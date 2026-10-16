import { dbStore } from '../db/store.js';
import { LandParcel, RiskAssessment, LandOwnership, KhajnaAccount, SaleApplication } from '../db/types.js';

export interface AssessRiskInput {
  parcelId: string;
  sellerNidOrCitizenId?: string;
  proposedShare?: number;
  proposedAreaDecimal?: number;
}

export class RiskEngine {
  public static async assessParcel(input: AssessRiskInput): Promise<RiskAssessment> {
    const parcel = (await dbStore.findById('land_parcels', input.parcelId)) as LandParcel | null;
    if (!parcel) {
      throw new Error('ভূমি খতিয়ান/পার্সেল রেকর্ড পাওয়া যায়নি');
    }

    const ownerships = (await dbStore.find('land_ownerships', (o: LandOwnership) => o.parcel_id === input.parcelId && o.status === 'active')) as LandOwnership[];
    const khajnaAccounts = (await dbStore.find('khajna_accounts', (k: KhajnaAccount) => k.parcel_id === input.parcelId)) as KhajnaAccount[];
    const activeSaleApps = (await dbStore.find('sale_applications', (s: SaleApplication) => 
      s.parcel_id === input.parcelId && (s.stage !== 'REJECTED' && s.stage !== 'MUTATION_APPROVED' && s.status === 'active')
    )) as SaleApplication[];
    const documents = await dbStore.find('land_documents', (d) => d.parcel_id === input.parcelId);

    const identifiedIssues: string[] = [];
    const warningBasis: string[] = [];
    const unverifiedData: string[] = [];
    const recommendedActions: string[] = [];

    let score = 100;
    let sellerMatch = true;
    let shareValid = true;
    let taxCleared = true;
    let courtDispute = parcel.court_case_flag;
    let mortgageEncumbrance = parcel.bank_mortgage_flag;
    let duplicateSaleRisk = activeSaleApps.length > 1;
    let acquisitionRisk = parcel.is_acquired || parcel.is_khas_land || parcel.is_vested;
    let documentDiscrepancy = false;

    // 1. Seller & Ownership Match
    if (input.sellerNidOrCitizenId) {
      const matchedOwner = ownerships.find(
        (o) => o.owner_nid === input.sellerNidOrCitizenId || o.owner_id === input.sellerNidOrCitizenId
      );
      if (!matchedOwner) {
        sellerMatch = false;
        score -= 30;
        identifiedIssues.push('প্রস্তাবিত বিক্রেতার এনআইডি বা পরিচিতি সরকারি মালিকানা রেকর্ডের সাথে মিলছে না।');
        warningBasis.push('ভূমি রেকর্ডরুমের সর্বশেষ নামজারি ও আর.এস খতিয়ান তালিকা');
        recommendedActions.push('বিক্রেতার নামে সর্বশেষ হালনাগাদ খতিয়ান বা উত্তরাধিকার সনদ সাবধানে যাচাই করুন।');
      } else {
        warningBasis.push(`মালিকানা রেকর্ডে প্রাপ্ত বিক্রেতার নাম: ${matchedOwner.owner_name_bn} (রেকর্ডীয় অংশ: ${matchedOwner.share_portion})`);

        // Check share limit
        if (input.proposedShare && input.proposedShare > matchedOwner.share_portion) {
          shareValid = false;
          score -= 35;
          identifiedIssues.push(
            `বিক্রেতা নিজের প্রাপ্য হিস্যার চেয়ে বেশি জমি বিক্রির প্রস্তাব করেছেন (রেকর্ডীয় অংশ: ${matchedOwner.share_portion}, প্রস্তাবিত: ${input.proposedShare})।`
          );
          warningBasis.push('খতিয়ানের সংরক্ষিত ১৬ আনার অংশ বণ্টন বিবরণী');
          recommendedActions.push('বিক্রেতার অবশিষ্ট বৈধ বিক্রয়যোগ্য অংশের অতিরিক্ত কোনো বায়না বা চুক্তি করবেন না।');
        }
      }
    }

    // Co-sharer awareness
    if (ownerships.length > 1) {
      warningBasis.push(`জমিটিতে মোট ${ownerships.length} জন যৌথ মালিক বা সহ-শরিকের হিস্যা বিদ্যমান।`);
      recommendedActions.push('সহ-শরিকদের মধ্যে কোনো আপস-বণ্টননামা দলিল সম্পাদিত আছে কি না নিশ্চিত হোন।');
    }

    // 2. Tax / Khajna Status
    const khajna = khajnaAccounts[0];
    if (khajna && khajna.status === 'dues_pending' && khajna.total_payable_bdt > 0) {
      taxCleared = false;
      score -= 20;
      identifiedIssues.push(`ভূমি উন্নয়ন কর (খাজনা) বকেয়া রয়েছে (মোট বকেয়া: ৳${khajna.total_payable_bdt.toLocaleString('bn-BD')})।`);
      warningBasis.push(`ভূমি উন্নয়ন কর হোল্ডিং নং: ${khajna.holding_no} (অর্থবছর: ${khajna.fiscal_year})`);
      recommendedActions.push('বিক্রয় চুক্তি স্বাক্ষরের পূর্বে বিক্রেতাকে হালনাগাদ দাখিলা পরিশোধের অনুরোধ করুন।');
    } else if (khajna && khajna.status === 'cleared') {
      warningBasis.push(`ভূমি উন্নয়ন কর হালনাগাদ পরিশোধিত (দাখিলা সংরক্ষিত)`);
    } else {
      unverifiedData.push('অনলাইন ভূমি উন্নয়ন কর ব্যবস্থার সাথে এই খতিয়ানের হোল্ডিং লিংক এখনও সক্রিয় নয়।');
    }

    // 3. Court Case & Injunction Check
    if (courtDispute) {
      score -= 40;
      identifiedIssues.push(`আদালতে দেওয়ানি মামলা বিচারাধীন রয়েছে: ${parcel.court_case_details_bn || 'স্থগিতাদেশ বলবৎ'}`);
      warningBasis.push('জেলা জজ আদালতের মোকদ্দমা রেজিস্টার ও নোটিশ ডাটাবেজ');
      recommendedActions.push('কোনো অবস্থাতেই এই জমিতে আর্থিক লেনদেন করবেন না। বিজ্ঞ আদালতের আদেশ স্থগিত হওয়া পর্যন্ত অপেক্ষা করুন।');
    }

    // 4. Bank Mortgage / Lien
    if (mortgageEncumbrance) {
      score -= 35;
      identifiedIssues.push(`ব্যাংক বা আর্থিক প্রতিষ্ঠানে দায়বদ্ধ/মর্টগেজ: ${parcel.bank_mortgage_details_bn || 'দায়বদ্ধতা বিদ্যমান'}`);
      warningBasis.push('ব্যাংক চার্জ ও সাব-রেজিস্ট্রি অফিসের মর্টগেজ ইনডেক্স');
      recommendedActions.push('ব্যাংক থেকে মূল মালিকের নামে ঋণ পরিশোধ ও দায়মুক্তি সনদ (NOC) যাচাই করুন।');
    }

    // 5. Duplicate Sale Risk
    if (duplicateSaleRisk) {
      score -= 30;
      identifiedIssues.push(`এই দাগে ইতিমধ্যে ${activeSaleApps.length}টি সক্রিয় বিক্রয় আবেদন প্রক্রিয়াধীন রয়েছে।`);
      warningBasis.push('ভূমিসাথী স্মার্ট রেজিস্ট্রি ও বিক্রির আবেদন পর্যবেক্ষণ ব্যবস্থা');
      recommendedActions.push('পূর্ববর্তী কোনো বায়না বা বিক্রয় চুক্তি চলমান আছে কি না রেজিস্ট্রেশন কর্মকর্তার মাধ্যমে যাচাই করুন।');
    }

    // 6. Acquisition / Khas / Vested Land Flag
    if (acquisitionRisk) {
      score -= 45;
      if (parcel.is_khas_land) identifiedIssues.push('জমিটি সরকারি খাস খতিয়ানভুক্ত (১নং খতিয়ান)। বেসরকারিভাবে বিক্রয়যোগ্য নয়।');
      if (parcel.is_acquired) identifiedIssues.push('জমিটি সরকারের উন্নয়ন প্রকল্পের জন্য অধিগ্রহণকৃত (LA Case) তালিকাভুক্ত।');
      if (parcel.is_vested) identifiedIssues.push('জমিটি অর্পিত বা পরিত্যক্ত সম্পত্তি তালিকাভুক্ত।');
      warningBasis.push('জেলা প্রশাসন ভূমি অধিগ্রহণ ও খাস জমি রেজিস্টার');
      recommendedActions.push('সরকারি অধিগ্রহণ বা খাস সম্পত্তি ক্রয় আইনত নিষিদ্ধ। যেকোনো লেনদেন থেকে সম্পূর্ণ বিরত থাকুন।');
    }

    // 7. Document Discrepancy
    const unverifiedDocs = documents.filter((d) => !d.is_verified || d.discrepancy_note_bn);
    if (unverifiedDocs.length > 0) {
      documentDiscrepancy = true;
      score -= 15;
      for (const d of unverifiedDocs) {
        identifiedIssues.push(d.discrepancy_note_bn || `নথি অসামঞ্জস্য: ${d.doc_title_bn} এর তথ্যে গরমিল রয়েছে।`);
      }
      warningBasis.push('সাব-রেজিস্ট্রি দলিলের পরিমাণ বনাম খতিয়ানের রেকর্ড তুলনা');
      recommendedActions.push('জেলা রেকর্ডরুম থেকে মূল পর্চা ও দলিলের সার্টিফাইড কপি সংগ্রহ করে মিলিয়ে নিন।');
    }

    // Unverified items always explicitly disclosed
    unverifiedData.push('সরেজমিন শারীরিক সীমানা ও তৃতীয় পক্ষের অবৈধ দখলদারিত্ব (ম্যানুয়াল মাঠ তদন্ত প্রয়োজন)');
    unverifiedData.push('উত্তরাধিকারীদের মধ্যে অপ্রকাশিত পারিবারিক বিরোধ বা অপ্রকাশিত দানপত্র');

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine overall risk level
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (score < 40 || courtDispute || acquisitionRisk) {
      overallRiskLevel = 'critical';
    } else if (score < 65 || mortgageEncumbrance || !shareValid) {
      overallRiskLevel = 'high';
    } else if (score < 85 || !taxCleared || duplicateSaleRisk || documentDiscrepancy) {
      overallRiskLevel = 'medium';
    } else {
      overallRiskLevel = 'low';
    }

    // Summary in natural Bengali
    let summaryBn = '';
    if (overallRiskLevel === 'low') {
      summaryBn = 'জমিটির রেকর্ডীয় তথ্যসমূহ প্রাথমিকভাবে নির্ভরযোগ্য। রাজস্ব রেকর্ড, খতিয়ান এবং মালিকানা ইতিহাসের সাথে কোনো গুরুতর অসঙ্গতি বা আইনি জটিলতা দৃশ্যমান হয়নি। তবে সরেজমিন শারীরিক দখল ও সীমানা নিশ্চিত করে অগ্রসর হওয়া উচিত।';
    } else if (overallRiskLevel === 'medium') {
      summaryBn = 'জমিটিতে কিছু মধ্যম মাত্রার সতর্কতা পাওয়া গেছে (যেমন খাজনা বকেয়া, যৌথ মালিকানা বা চলমান অপর আবেদন)। বায়না করার আগে চিহ্নিত বিষয়গুলো সমাধান করা প্রয়োজন।';
    } else if (overallRiskLevel === 'high') {
      summaryBn = 'উচ্চ ঝুঁকি শনাক্ত হয়েছে! বিক্রেতার মালিকানা হিস্যা অথবা ব্যাংক দায়বদ্ধতায় গরমিল পরিলক্ষিত হয়েছে। সন্তোষজনক সমাধান ব্যতিরেকে কোনো অগ্রিম টাকা প্রদান করবেন না।';
    } else {
      summaryBn = 'মারাত্মক ঝুঁকি সতর্কতা! এই জমিটিতে আদালতের স্থগিতাদেশ, মর্টগেজ দায়বদ্ধতা অথবা সরকারি অধিগ্রহণ বা খাস খতিয়ানের রেকর্ড পাওয়া গেছে। এই জমিতে কোনো লেনদেন করা সম্পূর্ণ অনিরাপদ ও ঝুঁকিপূর্ণ।';
    }

    const assessment: RiskAssessment = {
      id: `RISK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parcel_id: input.parcelId,
      overall_risk_level: overallRiskLevel,
      risk_score: score,
      summary_bn: summaryBn,
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
