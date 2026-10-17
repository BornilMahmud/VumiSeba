# API Routes & Service Contracts — VumiSeba (ভূমিসেবা)

The backend Express application (`server/index.ts`) exposes modular REST endpoints mounted under `/api`. All endpoints use JSON payloads and return structured responses `{ success: boolean, data?: any, error?: string }`.

## 1. Authentication & Session Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/auth/login` | Public | Authenticates user via email/password or demo credentials. Returns JWT token and profile. |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile, citizen ID, and jurisdictional role. |
| `POST` | `/api/auth/switch-demo` | Public / Demo | Switches active session instantly to any of the 5 demo personas for presentation. |

---

## 2. Land Due Diligence & Search Endpoints (`/api/risk`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/risk/search` | Public | Searches land parcels by District, Upazila, Mouza, and Dag/Khatian number. |
| `GET` | `/api/risk/parcel/:id` | Public | Returns complete parcel details, survey metadata, co-owner shares, and tax accounts. |
| `POST` | `/api/risk/assess` | Public | Evaluates multi-factor due-diligence risk. Returns 0-100 score, risk level (`low`, `medium`, `high`, `critical`), factor breakdowns, and Bengali warning notes. |

---

## 3. Sale Application Lifecycle Endpoints (`/api/sale`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/sale/apply` | `citizen` (Seller) | Submits new sale dossier. Enforces share reservation, tax clearance check, and court dispute blocks. |
| `GET` | `/api/sale/my-applications` | `citizen` | Retrieves applications where the authenticated user is either seller or buyer. |
| `GET` | `/api/sale/:id` | Authenticated | Retrieves comprehensive application details, timeline events, and linked draft deed. |
| `POST` | `/api/sale/:id/transition` | Officer / Admin | Advances application to subsequent stages with verification notes and audit logging. |

---

## 4. Post-Registration Mutation Endpoints (`/api/mutation`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/mutation/queue` | `ac_land`, Admin | Retrieves pending e-Mutation cases auto-spawned by Sub-Registry deed completions. |
| `POST` | `/api/mutation/:id/schedule-hearing` | `ac_land` | Schedules formal mutation hearing date and summons notes. |
| `POST` | `/api/mutation/:id/approve` | `ac_land` | Magisterial approval of e-Mutation. Creates new Khatian (`নামজারি-XXXX`), updates parcel area, and records audit trail. |

---

## 5. Administrative & Audit Endpoints (`/api/admin`, `/api/audit`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `GET` | `/api/admin/metrics` | `central_admin` | Real-time national metrics: total verified parcels, active sale cases, registered deeds, and tax collected. |
| `POST` | `/api/admin/kyc/:id/verify` | `central_admin` | Approves citizen NID KYC and issues unique identifier `BHM-CIT-XXXXXX`. |
| `POST` | `/api/admin/users/:id/role` | `central_admin` | Updates user role with strict anti-privilege escalation checks. |
| `GET` | `/api/audit/logs` | `central_admin` | Retrieves immutable audit trail entries with filtering by action, user, or date. |

---

## 6. Interactive Assistant Endpoint (`/api/chat`)

| Method | Endpoint | Access | Description |
|:---|:---|:---:|:---|
| `POST` | `/api/chat/query` | Public | Receives natural language queries in Bengali or English. Returns domain-specific land guidance. |
