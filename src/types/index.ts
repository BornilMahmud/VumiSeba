export type UserRole = 
  | 'citizen' 
  | 'union_officer' 
  | 'ac_land' 
  | 'sub_registrar' 
  | 'central_admin'
  | 'CITIZEN'
  | 'UNION_LAND_OFFICER'
  | 'AC_LAND'
  | 'SUB_REGISTRAR'
  | 'ADMIN';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface KhatianRecord {
  id: string;
  parcel_id: string;
  khatian_no: string;
  khatian_type: string;
  mouza: string;
  district: string;
  upazila: string;
  owners: string[];
  total_area_decimal: number;
  dags: string[];
  status: string;
  created_at?: string;
}

export type KycStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

export interface UserProfile {
  id: string;
  citizen_id?: string;
  email: string;
  name_bn: string;
  name_en: string;
  mobile: string;
  nid_no: string;
  date_of_birth?: string;
  father_name_bn: string;
  mother_name_bn: string;
  address_bn: string;
  district: string;
  upazila: string;
  role: UserRole;
  designation_bn?: string;
  office_name_bn?: string;
  kyc_status: KycStatus;
  kyc_verified_at?: string;
  created_at: string;
}

export interface LandParcel {
  id: string;
  parcel_number: string;
  district: string;
  upazila: string;
  mouza: string;
  jl_no: string;
  khatian_no: string;
  khatian_type: 'CS' | 'SA' | 'RS' | 'BS' | 'BRS' | 'Mutation';
  dag_no: string;
  land_class: string;
  total_area_decimal: number;
  available_area_decimal: number;
  current_holding_no: string;
  address_description_bn: string;
  is_khas_land: boolean;
  is_acquired: boolean;
  is_vested: boolean;
  court_case_flag: boolean;
  court_case_details_bn?: string;
  bank_mortgage_flag: boolean;
  bank_mortgage_details_bn?: string;
  recorded_owners_bn?: string;
  owners_count?: number;
  district_bn?: string;
  upazila_bn?: string;
  mouza_bn?: string;
  land_type_bn?: string;
}

export interface LandOwnership {
  id: string;
  parcel_id: string;
  owner_id?: string;
  owner_name_bn: string;
  owner_nid?: string;
  share_portion: number;
  area_decimal: number;
  khatian_ref: string;
  status: 'active' | 'transferred' | 'partial_transferred';
  acquired_type_bn: string;
}

export interface LandDocument {
  id: string;
  parcel_id: string;
  doc_type: string;
  doc_title_bn: string;
  doc_number: string;
  issue_date: string;
  issuing_authority_bn: string;
  file_url: string;
  is_verified: boolean;
  discrepancy_note_bn?: string;
}

export interface KhajnaAccount {
  id: string;
  parcel_id: string;
  owner_id: string;
  holding_no: string;
  fiscal_year: string;
  annual_demand_bdt: number;
  arrears_bdt: number;
  total_payable_bdt: number;
  status: 'cleared' | 'dues_pending';
  last_paid_date?: string;
}

export interface TaxClearance {
  id: string;
  parcel_id: string;
  user_id: string;
  holding_no: string;
  dakhila_no: string;
  clearance_certificate_no: string;
  is_cleared: boolean;
  valid_until: string;
  issued_at: string;
}

export type SaleApplicationStage =
  | 'DRAFT'
  | 'TAX_CLEARANCE_PENDING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'UNION_REVIEW_PENDING'
  | 'UNION_REPORT_PENDING'
  | 'RETURNED_FOR_CORRECTION'
  | 'RETURNED_FOR_INFORMATION'
  | 'UNION_APPROVED'
  | 'UNION_REJECTED'
  | 'AC_LAND_REVIEW_PENDING'
  | 'AC_LAND_APPROVED'
  | 'AC_LAND_REJECTED'
  | 'REGISTRATION_READY'
  | 'APPOINTMENT_SCHEDULED'
  | 'REGISTRATION_SCHEDULED'
  | 'REGISTRATION_COMPLETED'
  | 'MUTATION_PENDING'
  | 'MUTATION_SUBMITTED'
  | 'HEARING_SCHEDULED'
  | 'MUTATION_APPROVED'
  | 'MUTATION_REJECTED'
  | 'REJECTED'
  | string;

export interface SaleApplication {
  id: string;
  application_no: string;
  parcel_id: string;
  seller_id: string;
  buyer_id: string;
  buyer_citizen_id: string;
  proposed_share: number;
  proposed_area_decimal: number;
  agreed_price_bdt: number;
  deed_type_bn: string;
  stage: SaleApplicationStage;
  status: 'active' | 'completed' | 'cancelled' | 'rejected' | string;
  tax_cleared: boolean;
  admin_reviewed: boolean;
  union_verified: boolean;
  registry_completed: boolean;
  mutation_created: boolean;
  return_reason_bn?: string;
  rejection_reason_bn?: string;
  created_at: string;
  parcel?: LandParcel;
  seller?: any;
  buyer?: any;
  submission_date?: string;
  seller_owned_share?: number;
  seller_owned_area_decimal?: number;
  seller_citizen_id?: string;
  holding_no?: string;
  tax_clearance_status?: string;
  union_report?: any;
  appointment_details?: any;
  registration_details?: any;
  applicationNumber?: string;
  sellerCitizenId?: string;
  buyerCitizenId?: string;
  khatianNo?: string;
  dagNo?: string;
  proposedArea?: number;
  proposedShare?: number;
  agreedPrice?: number;
  taxClearanceId?: string;
  registrationNumber?: string;
}

export interface RiskAssessment {
  id: string;
  parcel_id: string;
  overall_risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  summary_bn: string;
  identified_issues_bn: string[];
  warning_basis_bn: string[];
  unverified_data_bn: string[];
  recommended_actions_bn: string[];
  seller_match: boolean;
  share_valid: boolean;
  tax_cleared: boolean;
  court_dispute: boolean;
  mortgage_encumbrance: boolean;
  duplicate_sale_risk: boolean;
  acquisition_risk: boolean;
  document_discrepancy: boolean;
  generated_at: string;
}

export interface MutationApplication {
  id: string;
  mutation_case_no: string;
  sale_application_id: string;
  parcel_id: string;
  applicant_id: string;
  previous_khatian_no: string;
  proposed_khatian_no: string;
  current_stage: 'application_submitted' | 'union_report_pending' | 'hearing_scheduled' | 'approved' | 'rejected' | string;
  status: 'active' | 'approved' | 'rejected' | string;
  hearing_date?: string;
  order_summary_bn?: string;
  approved_khatian_id?: string;
  created_at: string;
  parcel?: LandParcel;
  applicant?: any;
  seller?: any;
  proposed_area_decimal?: number;
  mutationCaseNumber?: string;
  saleAppId?: string;
  targetKhatianNo?: string;
  targetDagNo?: string;
  buyerCitizenId?: string;
  sellerCitizenId?: string;
  createdAt?: string;
  unionReport?: {
    recommendation: string;
    officerId: string;
    submittedAt: string;
  };
  hearingDate?: string;
  hearingTime?: string;
  resultingKhatianNo?: string;
  resultingHoldingNo?: string;
  jl_no?: string;
  khatian_no?: string;
  dag_no?: string;
  mouza_bn?: string;
  transferred_area_decimal?: number;
  deed_no?: string;
  approved_khatian_no?: string;
}

export interface RegistrationAppointment {
  id: string;
  application_id: string;
  registry_office_name_bn: string;
  appointment_date: string;
  slot_time: string;
  token_no: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
  required_documents_bn: string[];
}

export interface RegistrationRecord {
  id: string;
  application_id: string;
  registry_office_bn: string;
  registration_serial_no: string;
  deed_no: string;
  deed_volume_no: string;
  deed_year: string;
  completion_timestamp: string;
  disclaimer_bn: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title_bn: string;
  message_bn: string;
  type: 'info' | 'success' | 'warning' | 'alert' | string;
  link?: string;
  is_read: boolean;
  created_at: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  relatedLink?: string;
}
