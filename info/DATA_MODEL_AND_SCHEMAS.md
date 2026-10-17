# Data Model & Schemas — VumiSeba (ভূমিসেবা)

## 1. Domain Entities & Database Collections

VumiSeba represents property ownership, due-diligence verifications, and bureaucratic transfer lifecycles using strongly-typed TypeScript interfaces defined in `src/types/index.ts`.

### 1.1 `LandParcel` (ভূমি প্লট / দাগ)
Represents a distinct cadastral parcel in the government survey record:
```typescript
interface LandParcel {
  id: string;                         // e.g. 'pcl-clean-405'
  parcel_number: string;              // e.g. 'DH-GL-BAD-405'
  district: string;                   // e.g. 'ঢাকা'
  upazila: string;                    // e.g. 'গুলশান'
  mouza: string;                      // e.g. 'বাড্ডা'
  jl_no: string;                      // e.g. '২৮'
  khatian_no: string;                 // e.g. '১২০৪'
  khatian_type: 'CS' | 'SA' | 'RS' | 'BS' | 'City';
  dag_no: string;                     // e.g. '৪০৫'
  land_class: string;                 // e.g. 'বাস্তু (ভিটি)', 'নাল'
  total_area_decimal: number;         // Total land in decimal (শতক)
  available_area_decimal: number;     // Currently unencumbered area
  current_holding_no: string;         // Linked holding for land tax
  address_description_bn: string;
  is_khas_land: boolean;              // Government owned land flag
  is_acquired: boolean;               // Public infrastructure acquisition flag
  is_vested: boolean;                 // Vested property / শত্রু সম্পত্তি flag
  court_case_flag: boolean;           // Active injunction / স্থগিতাদেশ flag
  bank_mortgage_flag: boolean;        // Active loan lien flag
  data_as_of: string;
  data_source: string;
  created_at: string;
  updated_at: string;
}
```

### 1.2 `Profile` (ব্যবহারকারী প্রোফাইল)
Represents citizens, officers, and system administrators:
```typescript
interface Profile {
  id: string;                         // e.g. 'usr-seller-01'
  email: string;
  full_name_en: string;
  full_name_bn: string;
  nid_number: string;                 // 10 or 17 digit Bangladesh NID
  phone_number: string;
  role: 'citizen' | 'union_officer' | 'ac_land' | 'sub_registrar' | 'central_admin';
  citizen_id?: string;                // e.g. 'BHM-CIT-419203' (assigned upon KYC)
  kyc_status: 'pending' | 'verified' | 'rejected';
  office_designation_bn?: string;     // e.g. 'তহশিলদার (ইউএলএও)'
  jurisdiction_district?: string;
  jurisdiction_upazila?: string;
  jurisdiction_mouza?: string;
  created_at: string;
  updated_at: string;
}
```

### 1.3 `SaleApplication` (জমি বিক্রয় ও হস্তান্তর আবেদন)
Represents the 8-stage inter-office property transfer dossier:
```typescript
interface SaleApplication {
  id: string;                         // e.g. 'sa-clean-demo'
  application_no: string;             // e.g. 'BHM-SA-2026-0081'
  parcel_id: string;
  seller_id: string;
  buyer_id: string;
  buyer_citizen_id: string;
  proposed_share: number;             // e.g. 0.0500 (5% of parcel)
  proposed_area_decimal: number;      // e.g. 1.0 decimal
  agreed_price_bdt: number;           // Financial consideration in BDT
  deed_type_bn: string;               // e.g. 'সাফ-কবলা', 'হেবা'
  stage: ApplicationStage;            // Lifecycle stage
  status: 'active' | 'approved' | 'rejected' | 'completed';
  tax_cleared: boolean;
  tax_clearance_id?: string;
  admin_reviewed: boolean;
  union_verified: boolean;
  registry_completed: boolean;
  mutation_created: boolean;
  created_at: string;
  updated_at: string;
}

type ApplicationStage =
  | 'DRAFT_INITIATED'
  | 'TAX_CLEARANCE_PENDING'
  | 'UNION_REVIEW_PENDING'
  | 'RETURNED_FOR_CORRECTION'
  | 'AC_LAND_REVIEW_PENDING'
  | 'REGISTRATION_READY'
  | 'APPOINTMENT_SCHEDULED'
  | 'REGISTRATION_COMPLETED'
  | 'MUTATION_IN_PROGRESS'
  | 'MUTATION_HEARING_SCHEDULED'
  | 'MUTATION_APPROVED';
```

---

## 2. Integer Arithmetic (Basis Points) for Zero-Drift Share Math

In land records, floating-point inaccuracies can lead to double-selling or unallocated fractions. VumiSeba solves this using **Basis Points (bps)** integer arithmetic:

$$\text{Basis Points} = \text{round}(\text{share} \times 10,000)$$

- $1.0000 \text{ share} = 10,000 \text{ bps}$
- $0.0500 \text{ share} = 500 \text{ bps}$
- $0.1250 \text{ share} = 1,250 \text{ bps}$

In `server/services/validation.service.ts`:
```typescript
export function shareToBps(share: number): number {
  return Math.round(share * 10000);
}

export function bpsToShare(bps: number): number {
  return bps / 10000;
}
```
All reservation and comparison checks convert shares to integer basis points before arithmetic operations, ensuring exactly 0 drift across multiple concurrent transactions.

---

## 3. Database Indexes & Query Optimizations

Defined in `firestore.indexes.json` for Cloud Firestore:
- `land_parcels`: Composite index on `(district ASC, upazila ASC, mouza ASC, dag_no ASC)`.
- `sale_applications`: Composite index on `(status ASC, stage ASC, created_at DESC)`.
- `sale_applications`: Composite index on `(seller_id ASC, status ASC)`.
- `sale_applications`: Composite index on `(buyer_id ASC, status ASC)`.
- `mutation_applications`: Composite index on `(status ASC, stage ASC, created_at DESC)`.
- `audit_logs`: Composite index on `(target_type ASC, target_id ASC, timestamp DESC)`.
