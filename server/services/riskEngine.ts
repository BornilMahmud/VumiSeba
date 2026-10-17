import { dbStore } from '../db/store.js';
import { LandParcel, RiskAssessment, LandOwnership, KhajnaAccount, SaleApplication, RiskFactorDetail } from '../db/types.js';
import { ValidationService } from './validationService.js';
import { toBasisPoints, fromBasisPoints } from '../utils/shareMath.js';

export interface AssessRiskInput {
  parcelId: string;
  sellerNidOrCitizenId?: string;
  proposedShare?: number;
  proposedAreaDecimal?: number;
  excludeApplicationId?: string;
}

export class RiskEngine {
  public static readonly VERSION = 'v2.2-transparency';

  public static async assessParcel(input: AssessRiskInput): Promise<RiskAssessment> {
    const parcel = (await dbStore.findById('land_parcels', input.parcelId)) as LandParcel | null;
    if (!parcel) {
      throw new Error('ভূমি খতিয়ান/পার্সেল রেকর্ড পাওয়া যায়নি');
    }

    const ownerships = (await dbStore.find(
      'land_ownerships',
      (o: LandOwnership) => o.parcel_id === input.parcelId && o.status === 'active'
    )) as LandOwnership[];
    const khajnaAccounts = (await dbStore.find(
      'khajna_accounts',
      (k: KhajnaAccount) => k.parcel_id === input.parcelId
    )) as KhajnaAccount[];
    const activeSaleApps = (await dbStore.find(
      'sale_applications',
      (s: SaleApplication) =>
        s.parcel_id === input.parcelId &&
        (!input.excludeApplicationId || s.id !== input.excludeApplicationId) &&
        s.stage !== 'REJECTED' &&
        s.stage !== 'MUTATION_APPROVED' &&
        s.status === 'active'
    )) as SaleApplication[];
    const documents = await dbStore.find('land_documents', (d) => d.parcel_id === input.parcelId);

    const identifiedIssues: string[] = [];
    const warningBasis: string[] = [];
    const unverifiedData: string[] = [];
    const recommendedActions: string[] = [];
    const criticalReasons: string[] = [];

    const factors: RiskFactorDetail[] = [];
    let aggregateScore = 100;

    // ----------------------------------------------------
    // FACTOR 1: Active Court Injunction & Litigation (CRITICAL)
    // ----------------------------------------------------
    const courtDispute = Boolean(parcel.court_case_flag);
    if (courtDispute) {
      const deduction = 35;
      aggregateScore -= deduction;
      criticalReasons.push('আদালতের দেওয়ানি মোকদ্দমা বা স্থগিতাদেশ বলবৎ');
      factors.push({
        factor_key: 'court_injunction',
        title_bn: 'আদালতের নিষেধাজ্ঞা ও দেওয়ানি বিরোধ',
        title_en: 'Court Injunction & Civil Litigation',
        status: 'failed',
        is_critical: true,
        weight_max_points: 35,
        deducted_points: deduction,
        explanation_bn: `বিজ্ঞ আদালতে দেওয়ানি মোকদ্দমা বা স্থগিতাদেশ বলবৎ রয়েছে (${parcel.court_case_details_bn || 'মামলা বিচারাধীন'})।`,
        explanation_en: `Active court injunction or litigation exists (${parcel.court_case_details_bn || 'Case pending'}). Transactions strictly prohibited.`,
      });
      identifiedIssues.push(`আদালতে দেওয়ানি মামলা বিচারাধীন রয়েছে: ${parcel.court_case_details_bn || 'স্থগিতাদেশ বলবৎ'}`);
      warningBasis.push('জেলা জজ আদালতের মোকদ্দমা রেজিস্টার ও নোটিশ ডাটাবেজ');
      recommendedActions.push('কোনো অবস্থাতেই এই জমিতে আর্থিক লেনদেন করবেন না। বিজ্ঞ আদালতের আদেশ স্থগিত হওয়া পর্যন্ত অপেক্ষা করুন।');
    } else {
      factors.push({
        factor_key: 'court_injunction',
        title_bn: 'আদালতের নিষেধাজ্ঞা ও দেওয়ানি বিরোধ',
        title_en: 'Court Injunction & Civil Litigation',
        status: 'passed',
        is_critical: true,
        weight_max_points: 35,
        deducted_points: 0,
        explanation_bn: 'জাতীয় বিচার বিভাগীয় ডাটাবেজ মোতাবেক এই জমিতে কোনো সক্রিয় দেওয়ানি মোকদ্দমা বা আদালতের স্থগিতাদেশ নেই।',
        explanation_en: 'No active court dispute or civil injunction found in national judicial databases.',
      });
    }

    // ----------------------------------------------------
    // FACTOR 2: Government Khas, Acquired, or Vested Land (CRITICAL)
    // ----------------------------------------------------
    const acquisitionRisk = Boolean(parcel.is_khas_land || parcel.is_acquired || parcel.is_vested);
    if (acquisitionRisk) {
      const deduction = 35;
      aggregateScore -= deduction;
      const typeStr = parcel.is_khas_land
        ? '১নং খাস খতিয়ানভুক্ত সরকারি ভূমি'
        : parcel.is_acquired
        ? 'সরকারি অধিগ্রহণভুক্ত (LA Case)'
        : 'অর্পিত বা পরিত্যক্ত সম্পত্তি';
      criticalReasons.push(typeStr);
      factors.push({
        factor_key: 'government_land',
        title_bn: 'সরকারি খাস, অধিগ্রহণ বা অর্পিত সম্পত্তি সংরক্ষণ',
        title_en: 'Government Khas / Acquired / Vested Property',
        status: 'failed',
        is_critical: true,
        weight_max_points: 35,
        deducted_points: deduction,
        explanation_bn: `জমিটি ${typeStr} হিসেবে চিহ্নিত। এটি ব্যক্তিগতভাবে হস্তান্তরযোগ্য নয়।`,
        explanation_en: `Parcel is designated as ${typeStr}. Private alienation prohibited by law.`,
      });
      identifiedIssues.push(`জমিটি ${typeStr} তালিকাভুক্ত।`);
      warningBasis.push('জেলা প্রশাসন ভূমি অধিগ্রহণ ও খাস জমি রেজিস্টার');
      recommendedActions.push('সরকারি সম্পত্তি ক্রয় আইনত দণ্ডনীয়। যেকোনো লেনদেন থেকে সম্পূর্ণ বিরত থাকুন।');
    } else {
      factors.push({
        factor_key: 'government_land',
        title_bn: 'সরকারি খাস, অধিগ্রহণ বা অর্পিত সম্পত্তি সংরক্ষণ',
        title_en: 'Government Khas / Acquired / Vested Property',
        status: 'passed',
        is_critical: true,
        weight_max_points: 35,
        deducted_points: 0,
        explanation_bn: 'জমিটি সম্পূর্ণ ব্যক্তিগত খতিয়ানভুক্ত; সরকারি খাস, অধিগ্রহণ বা অর্পিত সম্পত্তির আওতামুক্ত।',
        explanation_en: 'Property is verified private land, cleared of government khas, acquisition, or vested encumbrance.',
      });
    }

    // ----------------------------------------------------
    // FACTOR 3: Seller Ownership & Share Limit (CRITICAL OVER-SALE OVERRIDE)
    // ----------------------------------------------------
    let sellerMatch = true;
    let shareValid = true;
    if (input.sellerNidOrCitizenId) {
      const matchedOwner = ownerships.find(
        (o) => o.owner_nid === input.sellerNidOrCitizenId || o.owner_id === input.sellerNidOrCitizenId
      );
      if (!matchedOwner) {
        sellerMatch = false;
        shareValid = false;
        const deduction = 30;
        aggregateScore -= deduction;
        criticalReasons.push('প্রস্তাবিত বিক্রেতার মালিকানা রেকর্ড অনুপস্থিত');
        factors.push({
          factor_key: 'share_validation',
          title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
          title_en: 'Seller Share Verification & Over-Sale Guard',
          status: 'failed',
          is_critical: true,
          weight_max_points: 30,
          deducted_points: deduction,
          explanation_bn: 'প্রস্তাবিত বিক্রেতার এনআইডি বা সিটিজেন আইডি সরকারি খতিয়ান রেকর্ডের সাথে মিলছে না।',
          explanation_en: 'Proposed seller ID does not match any active ownership record in the official khatian.',
        });
        identifiedIssues.push('প্রস্তাবিত বিক্রেতার পরিচিতি সরকারি মালিকানা রেকর্ডের সাথে মিলছে না।');
        recommendedActions.push('বিক্রেতার হালনাগাদ উত্তরাধিকার বা নামজারি খতিয়ান যাচাই করুন।');
      } else {
        // Calculate reservation with ValidationService
        const reservation = await ValidationService.getSellerShareReservation(
          input.parcelId,
          matchedOwner.owner_id || matchedOwner.id,
          input.excludeApplicationId
        );

        if (input.proposedShare && toBasisPoints(input.proposedShare) > reservation.availableShareBps) {
          shareValid = false;
          const deduction = 30;
          aggregateScore -= deduction;
          criticalReasons.push('বিক্রেতার অবশিষ্ট অংশের অতিরিক্ত বিক্রির অপচেষ্টা (Over-Selling)');
          factors.push({
            factor_key: 'share_validation',
            title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
            title_en: 'Seller Share Verification & Over-Sale Guard',
            status: 'failed',
            is_critical: true,
            weight_max_points: 30,
            deducted_points: deduction,
            explanation_bn: `বিক্রেতার রেকর্ডীয় হিস্যা ${reservation.recordedShare}, যার মধ্যে ${reservation.reservedShare} অংশ অন্যান্য পেন্ডিং বিক্রয়ে সংরক্ষিত। অবশিষ্ট ${reservation.availableShare} অংশের চেয়ে বেশি (${input.proposedShare}) প্রস্তাবিত।`,
            explanation_en: `Proposed share (${input.proposedShare}) exceeds available share (${reservation.availableShare}). Committed in pending sales: ${reservation.reservedShare}.`,
          });
          identifiedIssues.push(
            `বিক্রেতা প্রাপ্য হিস্যার চেয়ে বেশি জমি বিক্রির প্রস্তাব করেছেন (অবশিষ্ট বিক্রয়যোগ্য: ${reservation.availableShare}, প্রস্তাবিত: ${input.proposedShare})।`
          );
          recommendedActions.push('বিক্রেতার অবশিষ্ট অংশের অতিরিক্ত কোনো বায়না বা চুক্তি করবেন না।');
        } else {
          factors.push({
            factor_key: 'share_validation',
            title_bn: 'বিক্রেতার মালিকানা হিস্যা ও বৈধতা',
            title_en: 'Seller Share Verification & Over-Sale Guard',
            status: 'passed',
            is_critical: true,
            weight_max_points: 30,
            deducted_points: 0,
            explanation_bn: `বিক্রেতার মালিকানা যাচাইকৃত (${matchedOwner.owner_name_bn}) এবং প্রস্তাবিত অংশ অবশিষ্ট বৈধ সীমার মধ্যে রয়েছে।`,
            explanation_en: `Seller identity confirmed (${matchedOwner.owner_name_bn}). Proposed share is fully within uncommitted title quota.`,
          });
        }
      }
    } else {
      // General parcel review without specific seller
      factors.push({
        factor_key: 'share_validation',
        title_bn: 'মালিকানা হিস্যা বিভাজন',
        title_en: 'Ownership Share Partition',
        status: ownerships.length > 1 ? 'warning' : 'passed',
        is_critical: false,
        weight_max_points: 30,
        deducted_points: ownerships.length > 1 ? 5 : 0,
        explanation_bn: ownerships.length > 1
          ? `খতিয়ানে মোট ${ownerships.length} জন যৌথ অংশীদার রয়েছেন। ক্রয়ের পূর্বে নির্দিষ্ট হিস্যা পৃথকীকরণ আবশ্যক।`
          : 'খতিয়ানে একক মালিকের পূর্ণাঙ্গ হিস্যা বিদ্যমান।',
        explanation_en: ownerships.length > 1
          ? `Property held by ${ownerships.length} co-owners. Formal share partition and co-sharer consent recommended.`
          : 'Sole ownership record in khatian with 100% clean title partition.',
      });
      if (ownerships.length > 1) {
        aggregateScore -= 5;
        warningBasis.push(`জমিটিতে মোট ${ownerships.length} জন যৌথ মালিক বা সহ-শরিকের হিস্যা বিদ্যমান।`);
        recommendedActions.push('সহ-শরিকদের মধ্যে কোনো আপস-বণ্টননামা দলিল সম্পাদিত আছে কি না নিশ্চিত হোন।');
      }
    }

    // ----------------------------------------------------
    // FACTOR 4: Bank Mortgage / Lien Encumbrance (CRITICAL)
    // ----------------------------------------------------
    const mortgageEncumbrance = Boolean(parcel.bank_mortgage_flag);
    if (mortgageEncumbrance) {
      const deduction = 25;
      aggregateScore -= deduction;
      criticalReasons.push('ব্যাংক মর্টগেজ ও আর্থিক দায়বদ্ধতা বিদ্যমান');
      factors.push({
        factor_key: 'bank_mortgage',
        title_bn: 'ব্যাংক মর্টগেজ ও আর্থিক দায়বদ্ধতা',
        title_en: 'Bank Mortgage & Lien Encumbrance',
        status: 'failed',
        is_critical: true,
        weight_max_points: 25,
        deducted_points: deduction,
        explanation_bn: `জমিটি ব্যাংক বা আর্থিক প্রতিষ্ঠানে দায়বদ্ধ/মর্টগেজ (${parcel.bank_mortgage_details_bn || 'দায়বদ্ধতা কার্যকর'})।`,
        explanation_en: `Parcel is mortgaged to financial institution (${parcel.bank_mortgage_details_bn || 'Lien active'}). Unconditional NOC mandatory.`,
      });
      identifiedIssues.push(`ব্যাংক বা আর্থিক প্রতিষ্ঠানে দায়বদ্ধ: ${parcel.bank_mortgage_details_bn || 'মর্টগেজ বিদ্যমান'}`);
      recommendedActions.push('ব্যাংক থেকে মূল মালিকের নামে ঋণ পরিশোধ ও দায়মুক্তি সনদ (NOC) যাচাই করুন।');
    } else {
      factors.push({
        factor_key: 'bank_mortgage',
        title_bn: 'ব্যাংক মর্টগেজ ও আর্থিক দায়বদ্ধতা',
        title_en: 'Bank Mortgage & Lien Encumbrance',
        status: 'passed',
        is_critical: true,
        weight_max_points: 25,
        deducted_points: 0,
        explanation_bn: 'সাব-রেজিস্ট্রি ইনডেক্স ও তফসিলি ব্যাংক ডাটাবেজ অনুযায়ী জমিটিতে কোনো মর্টগেজ লিয়েন নেই।',
        explanation_en: 'No registered bank mortgage, charge, or institutional financial lien recorded against parcel.',
      });
    }

    // ----------------------------------------------------
    // FACTOR 5: Land Development Tax (Khajna) Compliance
    // ----------------------------------------------------
    const khajna = khajnaAccounts[0];
    let taxCleared = true;
    if (khajna && khajna.status === 'dues_pending' && khajna.total_payable_bdt > 0) {
      taxCleared = false;
      const deduction = 15;
      aggregateScore -= deduction;
      factors.push({
        factor_key: 'tax_compliance',
        title_bn: 'ভূমি উন্নয়ন কর (খাজনা) হালনাগাদ',
        title_en: 'Land Development Tax Compliance',
        status: 'failed',
        is_critical: false,
        weight_max_points: 15,
        deducted_points: deduction,
        explanation_bn: `বকেয়া ভূমি উন্নয়ন কর ৳${khajna.total_payable_bdt.toLocaleString('bn-BD')} অপরিশোধিত রয়েছে (হোল্ডিং: ${khajna.holding_no})।`,
        explanation_en: `Unpaid land tax arrears of BDT ${khajna.total_payable_bdt} on holding ${khajna.holding_no}. Clearance certificate required.`,
      });
      identifiedIssues.push(`ভূমি উন্নয়ন কর বকেয়া রয়েছে: ৳${khajna.total_payable_bdt.toLocaleString('bn-BD')}`);
      recommendedActions.push('বিক্রয় চুক্তি স্বাক্ষরের পূর্বে বিক্রেতাকে হালনাগাদ দাখিলা পরিশোধের অনুরোধ করুন।');
    } else if (khajna && khajna.status === 'cleared') {
      factors.push({
        factor_key: 'tax_compliance',
        title_bn: 'ভূমি উন্নয়ন কর (খাজনা) হালনাগাদ',
        title_en: 'Land Development Tax Compliance',
        status: 'passed',
        is_critical: false,
        weight_max_points: 15,
        deducted_points: 0,
        explanation_bn: `ভূমি উন্নয়ন কর (খাজনা) হালনাগাদ পরিশোধিত রয়েছে (দাখিলা নং সংরক্ষিত)।`,
        explanation_en: `Land development tax fully cleared with authentic e-Dakhila certificate on record.`,
      });
    } else {
      factors.push({
        factor_key: 'tax_compliance',
        title_bn: 'ভূমি উন্নয়ন কর (খাজনা) হালনাগাদ',
        title_en: 'Land Development Tax Compliance',
        status: 'warning',
        is_critical: false,
        weight_max_points: 15,
        deducted_points: 5,
        explanation_bn: 'অনলাইন ভূমি উন্নয়ন কর ব্যবস্থার সাথে এই খতিয়ানের হোল্ডিং লিংক এখনও সক্রিয় নয়।',
        explanation_en: 'Digital tax holding record pending manual linking at Union Land Office.',
      });
      aggregateScore -= 5;
    }

    // ----------------------------------------------------
    // FACTOR 6: Conflicting & Duplicate Sale Transactions
    // ----------------------------------------------------
    const duplicateSaleRisk = activeSaleApps.length > 1;
    if (duplicateSaleRisk) {
      const deduction = 15;
      aggregateScore -= deduction;
      factors.push({
        factor_key: 'duplicate_sales',
        title_bn: 'দ্বৈত বা সমান্তরাল বিক্রয় লেনদেন',
        title_en: 'Concurrent Conflicting Sales',
        status: 'failed',
        is_critical: false,
        weight_max_points: 15,
        deducted_points: deduction,
        explanation_bn: `এই দাগে ইতিমধ্যে ${activeSaleApps.length}টি সক্রিয় বিক্রয় আবেদন প্রক্রিয়াধীন রয়েছে।`,
        explanation_en: `Multiple (${activeSaleApps.length}) concurrent pending sale applications detected on this parcel.`,
      });
      identifiedIssues.push(`দাগে একাধিক (${activeSaleApps.length}টি) সক্রিয় বিক্রয় আবেদন চলমান।`);
      recommendedActions.push('পূর্ববর্তী কোনো বায়না বা চুক্তি চলমান আছে কি না রেজিস্ট্রেশন কর্মকর্তার মাধ্যমে যাচাই করুন।');
    } else {
      factors.push({
        factor_key: 'duplicate_sales',
        title_bn: 'দ্বৈত বা সমান্তরাল বিক্রয় লেনদেন',
        title_en: 'Concurrent Conflicting Sales',
        status: 'passed',
        is_critical: false,
        weight_max_points: 15,
        deducted_points: 0,
        explanation_bn: 'এই দাগে কোনো দ্বৈত বা সমান্তরাল বিক্রয় চুক্তির সংঘাত নেই।',
        explanation_en: 'No competing pending transfers detected on this parcel in registry pipeline.',
      });
    }

    // ----------------------------------------------------
    // FACTOR 7: Document Consistency & Physical Area Match
    // ----------------------------------------------------
    const unverifiedDocs = documents.filter((d) => !d.is_verified || d.discrepancy_note_bn);
    const documentDiscrepancy = unverifiedDocs.length > 0;
    if (documentDiscrepancy) {
      const deduction = 10;
      aggregateScore -= deduction;
      factors.push({
        factor_key: 'document_consistency',
        title_bn: 'নথিপত্রের সঙ্গতি ও পর্চা যাচাই',
        title_en: 'Document Consistency & Boundary Harmony',
        status: 'warning',
        is_critical: false,
        weight_max_points: 10,
        deducted_points: deduction,
        explanation_bn: 'খতিয়ান ও দলিলের আয়তনে অসামঞ্জস্য বা অসত্যায়িত নকল পরিলক্ষিত হয়েছে।',
        explanation_en: 'Document discrepancy identified between khatian acreage and deed schedule.',
      });
      for (const d of unverifiedDocs) {
        identifiedIssues.push(d.discrepancy_note_bn || `নথি অসামঞ্জস্য: ${d.doc_title_bn} এর তথ্যে গরমিল রয়েছে।`);
      }
      recommendedActions.push('জেলা রেকর্ডরুম থেকে মূল পর্চা ও দলিলের সার্টিফাইড কপি সংগ্রহ করে মিলিয়ে নিন।');
    } else {
      factors.push({
        factor_key: 'document_consistency',
        title_bn: 'নথিপত্রের সঙ্গতি ও পর্চা যাচাই',
        title_en: 'Document Consistency & Boundary Harmony',
        status: 'passed',
        is_critical: false,
        weight_max_points: 10,
        deducted_points: 0,
        explanation_bn: 'সংযুক্ত সকল খতিয়ান ও দলিলের রেকর্ড পরস্পর সামঞ্জস্যপূর্ণ।',
        explanation_en: 'All uploaded deeds, porcha maps, and khatian schedules are internally consistent.',
      });
    }

    // Always disclose mandatory unverified due diligence boundaries
    unverifiedData.push('সরেজমিন শারীরিক সীমানা ও তৃতীয় পক্ষের অবৈধ দখলদারিত্ব (ম্যানুয়াল মাঠ তদন্ত প্রয়োজন)');
    unverifiedData.push('উত্তরাধিকারীদের মধ্যে অপ্রকাশিত পারিবারিক বিরোধ বা গোপন দানপত্র');

    // Aggregate score calculation
    aggregateScore = Math.max(0, Math.min(100, aggregateScore));

    // ----------------------------------------------------
    // CRITICAL FACTOR OVERRIDE CONTRACT
    // Active Injunction, Government Land, Over-Share, or Bank Mortgage
    // CAN NEVER DISPLAY "LOW RISK" REGARDLESS OF AGGREGATE POINTS
    // ----------------------------------------------------
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let criticalOverrideTriggered = false;

    if (courtDispute || acquisitionRisk) {
      // Hard Critical Override
      overallRiskLevel = 'critical';
      criticalOverrideTriggered = true;
      aggregateScore = Math.min(aggregateScore, 25);
    } else if (!shareValid || mortgageEncumbrance) {
      // Hard High Override
      overallRiskLevel = 'high';
      criticalOverrideTriggered = true;
      aggregateScore = Math.min(aggregateScore, 48);
    } else if (aggregateScore < 40) {
      overallRiskLevel = 'critical';
    } else if (aggregateScore < 65) {
      overallRiskLevel = 'high';
    } else if (aggregateScore < 85 || !taxCleared || duplicateSaleRisk || documentDiscrepancy) {
      overallRiskLevel = 'medium';
    } else {
      overallRiskLevel = 'low';
    }

    // Summary texts in Bengali and English
    let summaryBn = '';
    let summaryEn = '';
    if (overallRiskLevel === 'low') {
      summaryBn = 'জমিটির রেকর্ডীয় তথ্যসমূহ প্রাথমিকভাবে নির্ভরযোগ্য। রাজস্ব রেকর্ড, খতিয়ান এবং মালিকানা ইতিহাসের সাথে কোনো গুরুতর অসঙ্গতি বা আইনি জটিলতা দৃশ্যমান হয়নি। তবে সরেজমিন শারীরিক দখল ও সীমানা নিশ্চিত করে অগ্রসর হওয়া উচিত।';
      summaryEn = 'The land records are preliminarily sound. No critical injunction, over-selling, or legal encumbrances detected. Physical verification of boundaries remains recommended.';
    } else if (overallRiskLevel === 'medium') {
      summaryBn = 'জমিটিতে কিছু মধ্যম মাত্রার সতর্কতা পাওয়া গেছে (যেমন খাজনা বকেয়া, যৌথ মালিকানা বা চলমান সমান্তরাল আবেদন)। বায়না করার পূর্বে চিহ্নিত বিষয়গুলো সমাধান করা প্রয়োজন।';
      summaryEn = 'Moderate advisory warnings detected (unpaid land tax or co-ownership shares). Clarify before signing formal agreements.';
    } else if (overallRiskLevel === 'high') {
      summaryBn = 'উচ্চ ঝুঁকি শনাক্ত হয়েছে! বিক্রেতার মালিকানা হিস্যা অতিক্রমণ বা ব্যাংক মর্টগেজ দায়বদ্ধতার প্রমাণ রয়েছে। সন্তোষজনক দায়মুক্তি সনদ ব্যতিরেকে কোনো আর্থিক লেনদেন করবেন না।';
      summaryEn = 'High risk detected! Share quota discrepancy or active bank mortgage identified. Do not disburse funds without clearance.';
    } else {
      summaryBn = 'মারাত্মক ঝুঁকি সতর্কতা! এই জমিটিতে আদালতের স্থগিতাদেশ, সরকারি অধিগ্রহণ বা খাস খতিয়ানের রেকর্ড পাওয়া গেছে। এই জমিতে কোনো লেনদেন করা সম্পূর্ণ বেআইনি, অনিরাপদ ও ঝুঁকিপূর্ণ।';
      summaryEn = 'Critical risk alert! Active court injunction, government acquisition, or khas land record found. Transactions legally prohibited.';
    }

    const assessment: RiskAssessment = {
      id: `RISK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parcel_id: input.parcelId,
      overall_risk_level: overallRiskLevel,
      risk_score: aggregateScore,
      engine_version: RiskEngine.VERSION,
      data_as_of: parcel.data_as_of || '2026-10-15',
      disclaimer_bn: 'অত্র ঝুঁকি মূল্যায়ন প্রতিবেদনটি ডিজিটাল ভূমি রেকর্ডসমূহের প্রাথমিক স্বয়ংক্রিয় পর্যবেক্ষণীয় বিশ্লেষণ, কোনো চূড়ান্ত আইনি দলিল, প্রত্যয়নপত্র বা টাইটেল গ্যারান্টি নয়। যেকোনো জমি ক্রয়ের পূর্বে উপযুক্ত বিজ্ঞ আইনজীবী দ্বারা সরেজমিন দলিল ও শারীরিক দখল যাচাইকরণ আবশ্যক। (Advisory, not a formal legal opinion)',
      disclaimer_en: 'This advisory risk assessment is an automated analytical check against digital public land records, not a formal legal certificate or title guarantee. Physical due diligence and formal legal counsel are strongly advised before purchase.',
      critical_override_triggered: criticalOverrideTriggered,
      critical_override_reasons: criticalReasons,
      factors,
      summary_bn: summaryBn,
      summary_en: summaryEn,
      identified_issues_bn: identifiedIssues,
      warning_basis_bn: warningBasis,
      unverified_data_bn: unverifiedData,
      recommended_actions_bn: recommendedActions,
      seller_match: sellerMatch,
      share_valid: shareValid,
      tax_cleared: taxCleared,
      court_dispute: courtDispute,
      mortgage_encumbrance: mortgageEncumbrance,
      duplicate_sale_risk: duplicateSaleRisk,
      acquisition_risk: acquisitionRisk,
      document_discrepancy: documentDiscrepancy,
      generated_at: new Date().toISOString(),
    };

    await dbStore.create('risk_assessments', assessment);
    return assessment;
  }
}
