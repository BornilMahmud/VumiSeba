import { dbStore } from '../db/store.js';
import { LandParcel, LandOwnership, KhajnaAccount, SaleApplication } from '../db/types.js';
import { toBasisPoints, fromBasisPoints, subtractShares } from '../utils/shareMath.js';

export interface ShareReservationInfo {
  recordedShareBps: number;
  reservedShareBps: number;
  availableShareBps: number;
  recordedShare: number;
  reservedShare: number;
  availableShare: number;
  activeApplicationsCount: number;
}

export class ValidationService {
  /**
   * Calculates a seller's recorded, reserved (in pending active applications), and available share in basis points.
   */
  public static async getSellerShareReservation(
    parcelId: string,
    sellerId: string,
    excludeAppId?: string
  ): Promise<ShareReservationInfo> {
    const ownerships = (await dbStore.find(
      'land_ownerships',
      (o: LandOwnership) => o.parcel_id === parcelId && o.owner_id === sellerId && o.status === 'active'
    )) as LandOwnership[];

    const ownership = ownerships[0];
    const recordedShareBps = ownership ? toBasisPoints(ownership.share_portion) : 0;

    // Active applications reserving share
    const terminalStages = [
      'REJECTED',
      'UNION_REJECTED',
      'AC_LAND_REJECTED',
      'MUTATION_REJECTED',
      'MUTATION_APPROVED',
    ];

    const activeApps = (await dbStore.find(
      'sale_applications',
      (s: SaleApplication) =>
        s.parcel_id === parcelId &&
        s.seller_id === sellerId &&
        (!excludeAppId || s.id !== excludeAppId) &&
        !terminalStages.includes(s.stage) &&
        s.status !== 'rejected' &&
        s.status !== 'cancelled'
    )) as SaleApplication[];

    const reservedShareBps = activeApps.reduce(
      (sum, app) => sum + toBasisPoints(app.proposed_share),
      0
    );

    const availableShareBps = Math.max(0, recordedShareBps - reservedShareBps);

    return {
      recordedShareBps,
      reservedShareBps,
      availableShareBps,
      recordedShare: fromBasisPoints(recordedShareBps),
      reservedShare: fromBasisPoints(reservedShareBps),
      availableShare: fromBasisPoints(availableShareBps),
      activeApplicationsCount: activeApps.length,
    };
  }

  /**
   * Comprehensive parcel state validator for downstream review/registration/mutation steps.
   * Ensures that encumbrances, tax dues, or share deficits introduced after application submission are caught.
   */
  public static async validateParcelForStage(
    parcelId: string,
    sellerId: string,
    proposedShare: number,
    excludeAppId?: string
  ): Promise<{
    valid: boolean;
    reasonCode?: 'court_injunction' | 'bank_mortgage' | 'khas_land' | 'tax_arrears' | 'share_exceeded';
    reasonBn?: string;
    reasonEn?: string;
  }> {
    const parcel = (await dbStore.findById('land_parcels', parcelId)) as LandParcel | null;
    if (!parcel) {
      return {
        valid: false,
        reasonBn: 'ভূমি পার্সেল রেকর্ড ডাটাবেজে খুঁজে পাওয়া যায়নি।',
        reasonEn: 'Land parcel record not found in database.',
      };
    }

    // 1. Court Injunction Hard-Block
    if (parcel.court_case_flag) {
      return {
        valid: false,
        reasonCode: 'court_injunction',
        reasonBn: `আদালতের দেওয়ানি মোকদ্দমা বা স্থগিতাদেশ বলবৎ রয়েছে (${parcel.court_case_details_bn || 'মামলা নং বিচারাধীন'})। এই জমিতে কোনো লেনদেন বা প্রশাসনিক অনুমোদন সম্ভব নয়।`,
        reasonEn: `Active court injunction or dispute exists (${parcel.court_case_details_bn || 'Case pending'}). No transaction permitted.`,
      };
    }

    // 2. Bank Mortgage Hard-Block
    if (parcel.bank_mortgage_flag) {
      return {
        valid: false,
        reasonCode: 'bank_mortgage',
        reasonBn: `জমিটি ব্যাংক বা আর্থিক প্রতিষ্ঠানে মর্টগেজ দায়বদ্ধ (${parcel.bank_mortgage_details_bn || 'দায়বদ্ধতা বিদ্যমান'})। দায়মুক্তি সনদ (NOC) ব্যতিরেকে অনুমোদন সম্ভব নয়।`,
        reasonEn: `Parcel is mortgaged to bank/financial institution (${parcel.bank_mortgage_details_bn || 'Lien active'}). NOC required.`,
      };
    }

    // 3. Government / Khas / Acquired Land Hard-Block
    if (parcel.is_khas_land || parcel.is_acquired || parcel.is_vested) {
      return {
        valid: false,
        reasonCode: 'khas_land',
        reasonBn: 'জমিটি সরকারি খাস, অধিগ্রহণভুক্ত বা অর্পিত সম্পত্তি। ব্যক্তিগত মালিকানায় হস্তান্তর আইনত দণ্ডনীয়।',
        reasonEn: 'Parcel is identified as government khas, acquired, or vested property. Alienation prohibited.',
      };
    }

    // 4. Tax Arrears Check
    const khajnaAccounts = (await dbStore.find(
      'khajna_accounts',
      (k: KhajnaAccount) => k.parcel_id === parcelId
    )) as KhajnaAccount[];
    const khajna = khajnaAccounts[0];
    if (khajna && (khajna.status !== 'cleared' || khajna.total_payable_bdt > 0)) {
      return {
        valid: false,
        reasonCode: 'tax_arrears',
        reasonBn: `ভূমি উন্নয়ন কর বকেয়া রয়েছে (মোট বকেয়া ৳${khajna.total_payable_bdt})। কর পরিশোধ ব্যতীত কার্যক্রম পরিচালনা নিষিদ্ধ।`,
        reasonEn: `Land development tax has unpaid arrears (BDT ${khajna.total_payable_bdt}). Clearance required.`,
      };
    }

    // 5. Share Limit & Pending Reservation Check
    const shareInfo = await this.getSellerShareReservation(parcelId, sellerId, excludeAppId);
    const proposedBps = toBasisPoints(proposedShare);

    if (proposedBps > shareInfo.availableShareBps) {
      return {
        valid: false,
        reasonCode: 'share_exceeded',
        reasonBn: `অননুমোদিত হিস্যা! বিক্রেতার রেকর্ডীয় হিস্যা ${shareInfo.recordedShare}, যার মধ্যে ${shareInfo.reservedShare} অংশ অন্যান্য সক্রিয় আবেদনে প্রক্রিয়াধীন। বর্তমানে বিক্রয়যোগ্য অবশিষ্ট অংশ ${shareInfo.availableShare}, অথচ প্রস্তাবিত অংশ ${proposedShare}।`,
        reasonEn: `Share limit exceeded! Seller owns ${shareInfo.recordedShare}, but ${shareInfo.reservedShare} is committed in pending sales. Only ${shareInfo.availableShare} is available, yet ${proposedShare} proposed.`,
      };
    }

    return { valid: true };
  }
}
