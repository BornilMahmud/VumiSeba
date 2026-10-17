export type UserRole = 'citizen' | 'union_officer' | 'ac_land' | 'sub_registrar' | 'central_admin';

export type KycStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

export interface UserProfile {
  id: string;
  citizen_id?: string; // e.g. BHM-CIT-491028
  email: string;
  password_hash: string;
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
  updated_at: string;
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
  land_class: string; // e.g., নাল, ধানী, ভিটি, বাড়ি, বাণিজ্যিক
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
  data_as_of?: string;
  data_source?: string;
  created_at: string;
  updated_at: string;
}

export interface LandOwnership {
  id: string;
  parcel_id: string;
  owner_id?: string; // linked user profile id if citizen
  owner_name_bn: string;
  owner_nid?: string;
  share_portion: number; // e.g. 0.5000 (representing 50% or 8 anna)
  area_decimal: number;
  khatian_ref: string;
  status: 'active' | 'transferred' | 'partial_transferred';
  acquired_type_bn: string; // পৈতৃক / ক্রয়সূত্রে / দানপত্র / বন্দোবস্ত
  created_at: string;
  updated_at: string;
}

export interface KhatianRecord {
  id: string;
  khatian_no: string;
  khatian_type: 'CS' | 'SA' | 'RS' | 'BS' | 'BRS' | 'Mutation';
  mouza: string;
  jl_no: string;
  upazila: string;
  district: string;
  recorded_owner_bn: string;
  recorded_father_bn: string;
  shares_summary_bn: string;
  dags_summary_bn: string;
  total_area_decimal: number;
  is_archived: boolean;
  created_at: string;
}

export interface LandDocument {
  id: string;
  parcel_id: string;
  doc_type: 'khatian_copy' | 'deed' | 'dakhila' | 'map_porcha' | 'court_order' | 'mutation_order';
  doc_title_bn: string;
  doc_number: string;
  issue_date: string;
  issuing_authority_bn: string;
  file_url: string;
  is_verified: boolean;
  discrepancy_note_bn?: string;
  created_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface TaxPayment {
  id: string;
  holding_id: string;
  parcel_id: string;
  user_id: string;
  amount_bdt: number;
  payment_method: 'Nagad' | 'bKash' | 'Rocket' | 'Sonali_Bank' | 'Demo_Direct';
  trx_id: string;
  dakhila_no: string;
  payment_status: 'success' | 'failed' | 'pending';
  is_demo_payment: boolean;
  paid_at: string;
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
  | 'REJECTED';

export interface SaleApplication {
  id: string;
  application_no: string; // e.g. BHM-SA-2026-0081
  parcel_id: string;
  seller_id: string;
  buyer_id: string;
  buyer_citizen_id: string;
  proposed_share: number; // e.g. 0.0500
  proposed_area_decimal: number;
  agreed_price_bdt: number;
  deed_type_bn: string; // সাফ-কবলা, হেবা, দানপত্র
  stage: SaleApplicationStage;
  status: 'active' | 'completed' | 'cancelled' | 'rejected';
  
  // Guard flags
  tax_cleared: boolean;
  tax_clearance_id?: string;
  admin_reviewed: boolean;
  union_verified: boolean;
  registry_completed: boolean;
  mutation_created: boolean;
  
  // Rejection or return remarks
  return_reason_bn?: string;
  rejection_reason_bn?: string;
  
  created_at: string;
  updated_at: string;
}

export interface RiskFactorDetail {
  factor_key: string;
  title_bn: string;
  title_en: string;
  status: 'passed' | 'warning' | 'failed';
  is_critical: boolean;
  weight_max_points: number;
  deducted_points: number;
  explanation_bn: string;
  explanation_en: string;
}

export interface RiskAssessment {
  id: string;
  parcel_id: string;
  overall_risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number; // 0 to 100
  engine_version?: string;
  data_as_of?: string;
  disclaimer_bn?: string;
  disclaimer_en?: string;
  critical_override_triggered?: boolean;
  critical_override_reasons?: string[];
  factors?: RiskFactorDetail[];
  summary_bn: string;
  summary_en?: string;
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

export interface OfficeReview {
  id: string;
  application_id: string;
  office_type: 'central_admin' | 'union_land' | 'sub_registry' | 'ac_land';
  officer_id: string;
  officer_name_bn: string;
  officer_designation_bn: string;
  action: 'approved' | 'returned' | 'rejected' | 'investigated' | 'registered' | 'hearing_scheduled' | 'scheduled' | string;
  notes_bn: string;
  field_findings_bn?: string;
  reviewed_at: string;
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
  scheduled_by: string;
  created_at: string;
}

export interface RegistrationRecord {
  id: string;
  application_id: string;
  registry_office_bn: string;
  registration_serial_no: string; // e.g. REG-GLS-2026-9921
  deed_no: string; // e.g. 10423/2026
  deed_volume_no: string;
  deed_year: string;
  completion_timestamp: string;
  officer_id: string;
  deed_draft_url: string;
  is_official_record: boolean;
  disclaimer_bn: string;
}

export interface MutationApplication {
  id: string;
  mutation_case_no: string; // e.g. MUT-AC-2026-0418
  sale_application_id: string;
  parcel_id: string;
  applicant_id: string; // buyer id
  previous_khatian_no: string;
  proposed_khatian_no: string;
  current_stage: 'application_submitted' | 'union_report_pending' | 'hearing_scheduled' | 'approved' | 'rejected';
  status: 'active' | 'approved' | 'rejected';
  hearing_date?: string;
  union_report_id?: string;
  order_summary_bn?: string;
  approved_khatian_id?: string;
  approved_by_officer_id?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title_bn: string;
  message_bn: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name_bn?: string;
  user_role: string;
  action: string;
  target_entity: string;
  target_id: string;
  ip_address: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface AppDatabaseSchema {
  profiles: UserProfile[];
  land_parcels: LandParcel[];
  land_ownerships: LandOwnership[];
  khatian_records: KhatianRecord[];
  land_documents: LandDocument[];
  khajna_accounts: KhajnaAccount[];
  tax_payments: TaxPayment[];
  tax_clearances: TaxClearance[];
  sale_applications: SaleApplication[];
  risk_assessments: RiskAssessment[];
  office_reviews: OfficeReview[];
  registration_appointments: RegistrationAppointment[];
  registration_records: RegistrationRecord[];
  mutation_applications: MutationApplication[];
  notifications: NotificationItem[];
  audit_logs: AuditLog[];
}
