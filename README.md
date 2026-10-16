# VumiSeba (ভূমিসেবা)
### বাংলাদেশ নাগরিক ভূমি সেবা, স্বত্ব যাচাই, স্মার্ট রেজিস্ট্রি ও স্বয়ংক্রিয় ই-নামজারি প্ল্যাটফর্ম
**Bangladesh Citizen Land Services, Ownership Verification, Smart Registry & e-Mutation Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![E2E Tests](https://img.shields.io/badge/acceptance%20tests-100%25%20passing-success.svg)]()
[![Firebase Rules Tests](https://img.shields.io/badge/firebase%20rules-26%20passed-blue.svg)]()
[![Locale](https://img.shields.io/badge/locale-bn--BD%20(Bangla--first)-teal.svg)]()
[![Deployment](https://img.shields.io/badge/deployment-Vercel%20%2B%20Render%20%2B%20Firebase-navy.svg)]()

---

## A. Project Overview

**VumiSeba (ভূমিসেবা)** is a Bengali-first national digital public service and land due-diligence platform designed for Bangladesh citizens, property buyers, sellers, and land administration officials.

The project unites two critical LandTech challenges into an integrated, transparent digital journey:
1. **Primary Focus: P5 — Check Before You Buy (কেনার আগে জমি যাচাই):**
   Empowers prospective buyers to search and cross-examine official land records (Khatian, Dag, Mouza), verify genuine seller ownership shares, detect undisclosed financial mortgages or civil court injunctions, and check land development tax (ভূমি উন্নয়ন কর) clearance before advancing financial commitments or signing deeds.
2. **Supporting Workflow: P4 — Smart e-Mutation & Registry (স্মার্ট ই-রেজিস্ট্রি ও নামজারি একীকরণ):**
   Unifies preparatory sale application drafting, administrative field verification, Sub-Registry deed execution, and post-registration e-Mutation case tracking. Once a deed is registered at the Sub-Registry Office, an e-Mutation case is **automatically initialized and routed to the Assistant Commissioner (Land)**—eliminating redundant citizen filings and manual paperwork.

---

## B. Problem Statement

Land administration and property transactions in Bangladesh face several well-documented challenges:
- **Record Disconnection Across Departments:** Records are historically maintained across disparate offices (Directorate of Registration under Ministry of Law vs. Assistant Commissioner (Land) and Settlement Offices under Ministry of Land). Citizens struggle to reconcile CS, SA, RS, and City Survey Khatians.
- **Ownership Share Confusion & Over-Selling:** In ancestral co-owned properties (*ইজবালি সম্পত্তি*), sellers sometimes attempt to sell more than their legally recorded share, causing multi-decade civil litigation.
- **Undisclosed Mortgages & Court Injunctions:** Buyers frequently purchase land only to discover subsequent bank liens, attachment orders, or court status quo (*অস্থায়ী নিষেধাজ্ঞা*) orders.
- **Tax Clearance Disconnect:** Transactions often proceed without verifying up-to-date Land Development Tax (*খাজনা ও দাখিলা*), transferring debt burdens to unsuspecting buyers.
- **Sub-Registry to e-Mutation Hassle:** After paying registration taxes and fees, citizens traditionally had to submit a separate manual or digital application for mutation, leading to delays and harassment.

> **Contextual Clarification:** Bangladesh has made significant strides in digitizing land records (e.g., e-Porcha, online Dakhila, and e-Mutation portals). **VumiSeba** addresses the critical *due-diligence comparison, automated multi-factor risk assessment, preparatory transaction guardrails, and cross-departmental handoff* gap.

---

## C. Proposed Solution

VumiSeba provides an end-to-end citizen and administrative pipeline:
1. **Intelligent Land Search:** Search parcel records by District, Upazila, Mouza, Khatian No, and Dag No.
2. **Multi-Factor Due Diligence Engine (P5):** Automated cross-verification of ownership share integrity, active mortgage liens, pending court injunctions, and public acquisition alerts with an explainable Risk Score (Low, Moderate, Critical).
3. **Citizen Accounts & Unique Citizen IDs:** Citizens register with mock NID KYC verification, receiving an immutable identifier format (`BHM-CIT-XXXXXX` / `VUM-CIT-XXXXXX`).
4. **Server-Side Tax Clearance Enforcement:** Transactions are blocked at the server level if Land Development Tax is overdue, preventing illegal deed execution.
5. **Preparatory Deed Drafting:** Interactive deed preview with automated calculation of stamp duty, registration fees, local government taxes, and AIT.
6. **Sub-Registry to AC Land e-Mutation Automation (P4):** Completing deed registration at the Sub-Registry Office automatically spawns an e-Mutation case with status tracking (`submitted -> hearing_scheduled -> approved -> khatian_issued`).
7. **Bengali-First Responsive Experience:** Built entirely in natural Bengali terminology with institutional typography (*Hind Siliguri* & *Noto Sans Bengali*) and accessible micro-interactions.

---

## D. Project Features

### Implemented & Verified Capabilities
- [x] **Public Land Record Search:** Querying by administrative boundaries, Khatian, and Dag.
- [x] **Multi-Factor Risk Assessment Engine:** Computes risk score, weighted indicators, and plain-Bengali legal recommendations.
- [x] **Citizen Registration & Mock NID KYC:** Automated issuance of unique Citizen ID.
- [x] **Citizen Land Portfolio:** Real-time summary of owned parcels, shares, and land development tax status.
- [x] **Holding Tax Payment & e-Dakhila Generation:** Simulated instant tax clearance.
- [x] **Sale Application Creation Wizard:** Validates parcel ownership, enforces tax clearance, and prevents over-selling.
- [x] **Printable Preparatory Deed Draft Modal:** High-density legal deed preview with statutory non-government watermarks.
- [x] **Integrated Officer Workspace:** Specialized operational panels for Union Land Assistant Officer (ULAO), AC Land, Sub-Registrar, and Central Admin.
- [x] **Field Inspection Reporting:** Union officers submit physical boundary and possession verification reports.
- [x] **Sub-Registry Execution Docket:** Deed verification and biometric sign-off triggering automated e-Mutation.
- [x] **AC Land Judicial Order & Khatian Issuance:** Generates new mutation Khatian (e.g., `নামজারি-৮৮৯৯`), updates buyer/seller shares, and recalculates holdings.
- [x] **Immutable Security Audit Log:** Server-side audit logging for administrative accountability.
- [x] **Dual Database Architecture:** Dual-engine supporting Google Firebase Cloud Firestore and persistent zero-dependency ACID JSON store.
- [x] **Firebase Authentication & Demo Switcher:** Google Sign-In with popup/redirect and 1-click persona switching bar.

### Simulated / Future Features (Transparent Scope)
- *Live National NID Election Commission Server:* Simulated through deterministic NID/DOB validation.
- *Real-time Banking Gateway (e-Challan):* Automated simulated transaction receipts.
- *Live Judicial Case Database:* Seeded with real-world case scenarios for demonstration.

---

## E. Users and Roles

VumiSeba enforces strict Role-Based Access Control (RBAC):

| Role Identifier | Role Name (Bengali) | Permitted Activities & Boundaries | Accessible Routes |
| :--- | :--- | :--- | :--- |
| `citizen` | সাধারণ নাগরিক / ক্রেতা-বিক্রেতা | Search land records, run due-diligence checks, manage owned holdings, clear taxes, submit sale applications, view draft deeds, track e-Mutations. | `/`, `/search-land`, `/verify-land`, `/citizen/*` |
| `union_officer` | ইউনিয়ন ভূমি সহকারী কর্মকর্তা (তহশিলদার) | Review field verification queue, inspect physical possession, verify local Dakhila records, submit field inquiry reports to AC Land. | `/officer/union-land`, `/officer` |
| `ac_land` | সহকারী কমিশনার (ভূমি) | Judicial review of mutation cases, hearing scheduling, final approval/rejection, automatic issuance of new Khatians and share updates. | `/officer/ac-land`, `/officer` |
| `sub_registrar` | সাব-রেজিস্ট্রার | Inspect approved sale dockets, verify identity and stamp duties, execute deed registration, and automatically trigger linked e-Mutation. | `/officer/registry`, `/officer` |
| `central_admin` | কেন্দ্রীয় ভূমি প্রশাসন ও অডিটর | System-wide dashboard, citizen KYC approvals, administrative dispute review, national statistics, and immutable audit logs. | `/admin`, `/officer` |

---

## F. Technology Stack

- **Frontend Framework:** React 18 (SPA) with TypeScript
- **Build Tool:** Vite 6
- **Routing:** React Router DOM v7
- **Styling & Design System:** Tailwind CSS v3 with customized government color tokens (`gov-navy`, `gov-teal`, `gov-amber`, `gov-blue`), tactile physics, and shimmer button animations.
- **Typography:** Google Fonts (*Hind Siliguri*, *Noto Sans Bengali*, *Inter*)
- **Icons:** Lucide React
- **Backend API:** Node.js v20+ with Express 4, TypeScript, and TSX
- **Schema Validation:** Zod
- **Authentication:** Dual — Firebase Authentication (Google Sign-In) + Stateless JWT with BCrypt password hashing
- **Database & Cloud:** 
  - Google Firebase Cloud Firestore (`landtech-e5773`)
  - Persistent ACID Local JSON Store (`data/db.json` with transactional atomic locks)
- **Deployment Targets:**
  - **Vercel:** Frontend Client Single Page Application (`dist/`)
  - **Render:** Backend REST API Web Service (`server/`)
  - **Firebase:** Auth, Firestore Rules, Firestore Indexes, Hosting

---

## G. Languages Used

- **TypeScript:** Core language for frontend UI, backend API controllers, data models, seeding, and automated test suites.
- **JavaScript (ES Modules):** Tooling, Vite configuration, PostCSS, and build orchestration.
- **HTML5:** Semantic markup, print media query wrappers, accessibility tags.
- **CSS3:** Custom Tailwind utility extensions, micro-animations (`@keyframes button-shimmer`, `@keyframes pulse-glow`), custom webkit scrollbars.
- **Bengali (বাংলা - bn-BD):** Complete localized citizen experience, legal terminology, government notices, and error messages.

---

## H. Repository Architecture

The project is structured as a single cohesive monorepo:

```
VumiSeba/
├── .env.example             # Sanitized environment variable template
├── .gitignore               # Strict secret and build artifact exclusion
├── firebase.json            # Firebase CLI configuration (Firestore rules/indexes & hosting)
├── firestore.rules          # Hardened role-based Firestore security rules
├── firestore.indexes.json   # Composite Firestore query indexes
├── package.json             # Root monorepo scripts & dependencies
├── render.yaml              # Render Blueprint deployment definition
├── vercel.json              # Vercel SPA routing and build output configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite frontend configuration
├── tailwind.config.js       # Tailwind theme and custom government palette
├── data/
│   └── db.json              # Persistent local JSON database (seeded with 6 core scenarios)
├── scripts/
│   ├── seedFirestore.ts     # Idempotent Cloud Firestore data seeder
│   └── bootstrapAdmin.ts    # Secure CLI utility for administrator role provisioning
├── server/                  # Backend Node.js / Express API
│   ├── index.ts             # Express entry point, health check, middleware, CORS
│   ├── tsconfig.json        # Backend TypeScript compiler configuration
│   ├── db/
│   │   ├── seed.ts          # Comprehensive local database seeder
│   │   └── store.ts         # Atomic transactional JSON store engine
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication and RBAC guard middleware
│   │   └── audit.ts         # Server-side security audit logging
│   ├── routes/              # Modular Express API controllers
│   │   ├── auth.ts          # Login, Register, Google sync, KYC
│   │   ├── land.ts          # Parcel queries, holdings, ownership
│   │   ├── risk.ts          # Multi-factor due diligence risk scoring
│   │   ├── tax.ts           # Holding tax dues & e-Dakhila payment
│   │   ├── sale.ts          # Sale application workflow & share verification
│   │   ├── mutation.ts      # e-Mutation lifecycle & Khatian issuance
│   │   ├── officer.ts       # Unified office queues & reporting
│   │   ├── notifications.ts # Citizen alerts and status notifications
│   │   └── audit.ts         # Audit trail reporting
│   └── tests/
│       ├── e2e-workflow.test.ts          # Full acceptance test suite (P5 + P4)
│       └── firebase-auth-rules.test.ts   # Firebase Auth, security rules & index validation
└── src/                     # Frontend React TypeScript Application
    ├── main.tsx             # React DOM root entry point
    ├── App.tsx              # Application router, role guards, layout wrappers
    ├── index.css            # Base Tailwind imports, font definitions, button animations
    ├── lib/
    │   └── firebase.ts      # Universal Firebase singleton resolver (Vite + Node safe)
    ├── context/
    │   ├── AuthContext.tsx  # Dual Firebase Google Auth & Demo session state
    │   └── NotificationContext.tsx # Global in-app notification center
    ├── services/
    │   ├── api.ts           # Configurable REST API client with environment fallback
    │   └── firestoreService.ts # Cloud Firestore CRUD service
    ├── types/               # TypeScript interfaces, enums, data contracts
    ├── components/
    │   ├── common/          # Reusable UI widgets (DemoPersonaBar, DeedDraftModal)
    │   └── layout/          # Navbar, Footer, CitizenLayout, OfficerLayout
    └── pages/
        ├── public/          # HomePage, SearchLandPage, VerifyLandPage, LoginPage, RegisterPage
        ├── citizen/         # Dashboard, MyLand, TaxClearance, SellLand, Deals, Mutations
        └── officer/         # UnifiedOfficerWorkspace, UnionLand, AcLand, SubRegistry, CentralAdmin
```

---

## I. System Architecture

The following Mermaid diagram illustrates how citizens, administrative officers, Vercel, Render, Firebase Auth, and Cloud Firestore communicate:

```mermaid
flowchart TD
    subgraph Clients["নাগরিক ও কর্মকর্তা ব্রাউজার (Clients)"]
        Citizen[নাগরিক / Citizen Browser]
        Officer[কর্মকর্তা / Officer Browser]
    end

    subgraph VercelHost["Frontend Hosting (Vercel)"]
        VercelApp[VumiSeba Vite React SPA\n- Bengali Typography & Animated Buttons\n- Due-Diligence UI\n- 1-Click Demo Persona Bar]
    end

    subgraph FirebaseCloud["Google Firebase (landtech-e5773)"]
        FirebaseAuth[Firebase Authentication\n- Google Sign-In Provider\n- Pre-provisioned Demo Accounts]
        Firestore[Cloud Firestore\n- users, land_parcels, sale_applications\n- mutation_cases, tax_records, audit_logs\n- Role-based Security Rules]
    end

    subgraph RenderHost["Backend API (Render)"]
        ExpressApp[Node.js / Express API Server\n- Port 10000 / Dynamic PORT\n- Tax Clearance Guard\n- Over-selling Validation Guard\n- Automated Mutation Trigger Engine]
        JSONDB[(Persistent Store / Fallback\ndata/db.json)]
    end

    Citizen -->|HTTP GET / Router| VercelApp
    Officer -->|HTTP GET / Router| VercelApp

    VercelApp -->|Google Sign-In / Auth Tokens| FirebaseAuth
    VercelApp -->|Direct Reads / Public Parcels| Firestore
    VercelApp -->|REST API Requests /api/*| ExpressApp

    ExpressApp -->|Dual Data Synchronization| Firestore
    ExpressApp -->|Atomic Local ACID Persistence| JSONDB
    FirebaseAuth -.->|Token Verification| ExpressApp
```

---

## J. Database Structure

Cloud Firestore collections and data fields:

### 1. `users` (Citizen & Staff Profiles)
- `id` / `uid` (string, primary key)
- `email` (string)
- `name_bn` (string, citizen full name)
- `nid` (string, 10 or 17 digit national identity)
- `citizen_id` (string, e.g., `BHM-CIT-254787`)
- `role` (enum: `citizen`, `union_officer`, `ac_land`, `sub_registrar`, `central_admin`)
- `kyc_status` (enum: `pending`, `verified`, `rejected`)
- `created_at` (timestamp)

### 2. `land_parcels` (Land Due Diligence Records)
- `id` (string)
- `district` (string, e.g., `ঢাকা`)
- `upazila` (string, e.g., `গুলশান`)
- `mouza` (string, e.g., `বাড্ডা`)
- `jl_no` (string)
- `khatian_no` (string, e.g., `১২০৪`)
- `khatian_type` (enum: `RS`, `City Survey`, `Mutation`)
- `dag_no` (string, e.g., `৪০৫`)
- `land_class` (string, e.g., `নাল`, `বাণিজ্যিক`)
- `total_area_decimal` (number)
- `ownerships` (array of `{ owner_name, share_fraction, recorded_area_decimal, citizen_id }`)
- `tax_status` (object: `{ is_cleared, last_paid_fiscal_year, dues_amount }`)
- `litigation` (object: `{ has_injunction, case_number, court_name }`)
- `encumbrance` (object: `{ is_mortgaged, bank_name, mortgage_amount }`)
- `acquisition_status` (boolean)

### 3. `sale_applications` (Transaction Dockets)
- `id` (string, e.g., `SALE-2026-001`)
- `parcel_id` (string, foreign key)
- `seller_id` (string, citizen_id)
- `buyer_id` (string, citizen_id)
- `proposed_share` (number)
- `proposed_area_decimal` (number)
- `total_consideration_bdt` (number)
- `status` (enum: `draft`, `submitted`, `union_verified`, `admin_approved`, `registered`, `rejected`)
- `created_at`, `updated_at` (timestamp)

### 4. `mutation_cases` (Post-Registration e-Mutations)
- `id` (string, e.g., `MUT-2026-7841`)
- `sale_application_id` (string, foreign key)
- `parcel_id` (string)
- `buyer_id` (string)
- `status` (enum: `initiated`, `hearing_scheduled`, `approved`, `khatian_issued`, `rejected`)
- `resulting_khatian_no` (string, generated upon approval, e.g., `নামজারি-৮৮৯৯`)
- `resulting_holding_no` (string)
- `approved_at` (timestamp)

### 5. `audit_logs` (Immutable Administrative Audit Trail)
- `id` (string)
- `action` (string, e.g., `SALE_SUBMITTED`, `DEED_REGISTERED`, `MUTATION_APPROVED`)
- `actor_role` (string)
- `actor_id` (string)
- `details` (map/object)
- `timestamp` (string / ISO)

---

## K. Installation and Local Development

### 1. Prerequisites
- **Node.js:** v18.18+ or v20.x (Recommended: v20 LTS)
- **npm:** v9.x or v10.x
- **Git:** v2.30+

### 2. Clone Repository
```bash
git clone https://github.com/BornilMahmud/VumiSeba.git
cd VumiSeba
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Setup
```bash
# Create local environment file from example template
cp .env.example .env
```
*(Default settings run seamlessly with zero configuration).*

### 5. Database Seeding & Verification
```bash
# 1. Seed local database with 6 comprehensive test scenarios
npm run seed

# 2. (Optional) Seed Cloud Firestore with demo accounts & parcel records
npm run seed:firestore
```

### 6. Run Automated Tests
```bash
# Run End-to-End acceptance test suite
npm test

# Run Firebase Authentication & Firestore Security Rules tests
npm run test:firebase
```

### 7. Run Full Application Locally
```bash
# Concurrently start backend API (port 5000) and Vite frontend (port 3000)
npm run dev
```
Open your browser at **`http://localhost:3000/`**.

---

## L. Environment Variables

All variables are documented in `.env.example`.

### Frontend Variables (Vercel)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Production Render API base URL | `https://vumiseba-backend.onrender.com/api` (Leave empty for local proxy) |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key for project `landtech-e5773` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain | `landtech-e5773.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `landtech-e5773` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Cloud Storage Bucket | `landtech-e5773.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM Messaging Sender ID | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Firebase Web App ID | `1:1234567890:web:...` |

### Backend Variables (Render)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Dynamic web port assigned by Render | `10000` |
| `NODE_ENV` | Environment mode | `production` |
| `CORS_ORIGIN` | Permitted frontend origins (comma-separated or `*`) | `https://vumi-seba.vercel.app` |
| `JWT_SECRET` | Secret key for stateless API session tokens | Random 64-character string |
| `FIREBASE_PROJECT_ID` | Firebase Project Identifier | `landtech-e5773` |
| `SIMULATE_SMS` | Enable mock SMS notification adapter | `true` |
| `SIMULATE_EMAIL` | Enable mock email notification adapter | `true` |

---

## M. Dummy and Demo Accounts

To facilitate instant testing without registration, a **1-Click Demo Persona Bar** is pinned to the header of the app:

| Demo Persona | Name (বাংলা) | Role | Pre-configured Testing Scenario |
| :--- | :--- | :--- | :--- |
| **১. ক্রেতা (Buyer)** | ফারহান আহমেদ | `citizen` | Verified buyer; owns holding in Banasree; searches land and initiates purchase. |
| **২. বিক্রেতা (Clean)** | রফিকুল ইসলাম | `citizen` | Owns Dag 405 (10 decimal / 50% share); tax cleared; zero mortgages; clean sale flow. |
| **৩. বিক্রেতা (Tax Due)** | আব্দুল লতিফ | `citizen` | Owns Dag 882; has ৳4,850 tax arrears; triggers server tax-clearance block. |
| **৪. বিক্রেতা (Over-Seller)** | নজরুল ইসলাম | `citizen` | Owns Dag 201 (12.5% share); attempts to sell 25%; triggers over-selling block. |
| **৫. তহশিলদার (ULAO)** | মো. কামাল হোসেন | `union_officer` | Union Land Assistant Officer; manages field investigation queue and submits reports. |
| **৬. এসি ল্যান্ড (AC Land)** | তানভীর হাসান চৌধুরী | `ac_land` | Assistant Commissioner (Land); conducts hearings and approves mutations. |
| **৭. সাব-রেজিস্ট্রার** | সৈয়দা রোকসানা পারভীন | `sub_registrar` | Sub-Registrar; executes deed registration and triggers post-registration e-Mutation. |
| **৮. অ্যাডমিন** | কাজী শাহেদুজ্জামান | `central_admin` | Central Supervisor; reviews KYC and monitors immutable audit trail. |

*Pre-provisioned Firebase Authentication Password:* `DemoCitizen2026!` / `DemoAdmin2026!` (or local demo password `demo123456`).

---

## N. API Documentation

The Express backend provides REST endpoints under `/api`:

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register citizen with email, password, NID, and mobile.
- `POST /api/auth/login` — Sign in with email and password; returns JWT token.
- `POST /api/auth/demo-login` — Instant role switching for evaluation personas.
- `POST /api/auth/firebase-sync` — Sync Google Sign-In profile with backend permissions.
- `GET /api/auth/me` — Retrieve authenticated user profile (Bearer token required).
- `POST /api/auth/kyc/submit` — Submit NID details and documents for KYC verification.
- `POST /api/auth/kyc/verify` — Admin approval endpoint issuing unique Citizen ID.

### 2. Land Due Diligence (`/api/land`)
- `GET /api/land/search` — Query parcels by district, upazila, mouza, dag_no, khatian_no.
- `GET /api/land/:id` — Retrieve full parcel record, ownership shares, tax status, and liens.
- `GET /api/land/my/holdings` — Retrieve all land parcels owned by the authenticated citizen.

### 3. Risk Engine (`/api/risk`)
- `POST /api/risk/evaluate` — Multi-factor analysis returning weighted risk score and indicators.
- `GET /api/risk/:parcelId` — Fetch cached risk assessment for a specific parcel.

### 4. Holding Tax & Dakhila (`/api/tax`)
- `GET /api/tax/holding/:parcelId` — Fetch real-time tax arrears and last payment date.
- `POST /api/tax/pay` — Process simulated holding tax payment and issue official e-Dakhila.
- `GET /api/tax/my/history` — Citizen tax payment receipt history.

### 5. Sale Applications (`/api/sale`)
- `POST /api/sale/pre-check` — Pre-submission check validating tax clearance and seller share.
- `POST /api/sale/submit` — Submit sale application with server-side tax guard and share validation.
- `GET /api/sale/my` — Fetch citizen's active sale/purchase applications.
- `GET /api/sale/:id` — Retrieve sale application details and preparatory deed draft.
- `POST /api/sale/:id/admin-review` — Central admin preliminary approval.
- `POST /api/sale/:id/union-report` — Union officer field inspection report submission.
- `POST /api/sale/:id/complete-registration` — Sub-Registrar execution triggering e-Mutation.

### 6. e-Mutation Lifecycle (`/api/mutation`)
- `GET /api/mutation` — List all mutation cases (role-filtered).
- `GET /api/mutation/:id` — Mutation case timeline and status details.
- `POST /api/mutation/:id/schedule-hearing` — AC Land judicial hearing scheduler.
- `POST /api/mutation/:id/approve` — AC Land approval generating new Khatian and holding.

### 7. System Health & Audit (`/api/health`, `/api/audit`)
- `GET /api/health` — Platform status, database stats, and version information.
- `GET /api/audit/logs` — Immutable audit trail (Admin only).

---

## O. Testing

The project includes automated test suites covering 100% of the core lifecycle:

### 1. End-to-End Acceptance Tests (`npm test`)
Executes `server/tests/e2e-workflow.test.ts`:
- **Test 1:** Database Seeding with 6 real-world scenarios.
- **Test 2:** Citizen Profile creation & unique Citizen ID issuance (`BHM-CIT-XXXXXX`).
- **Test 3:** Land search by Mouza, Khatian, and Dag.
- **Test 4:** Multi-factor due diligence risk scoring (Low vs Critical).
- **Test 5:** Server-Side Tax Clearance Guard (verifies unpaid tax blocks sale submission).
- **Test 6:** Over-Selling & Share Validation Guard (verifies selling 0.25 on a 0.125 share is blocked).
- **Test 7:** Full Lifecycle (Sale Application -> Admin Approval -> Union Field Report -> Sub-Registry Deed Execution -> Automated e-Mutation Trigger -> AC Land Approval -> New Khatian `নামজারি-৮৮৯৯` and Share Recalculation).

### 2. Firebase Auth & Firestore Rules Tests (`npm run test:firebase`)
Executes `server/tests/firebase-auth-rules.test.ts` (26 passed checks):
- Configuration validation for project `landtech-e5773`.
- Firestore security rules validation (unauthenticated rejections, anti-self-promotion).
- Immutable audit log protection.
- Composite index definitions.
- Pre-provisioned demo accounts mapping.

---

## P. Deployment Guide

### 1. Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import the GitHub repository: `https://github.com/BornilMahmud/VumiSeba.git`.
3. Configure Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. Add Environment Variables in Vercel:
   - `VITE_API_BASE_URL` = Your deployed Render backend URL (e.g., `https://vumiseba-backend.onrender.com/api`)
   - `VITE_FIREBASE_API_KEY` = Your Firebase Web API Key
   - `VITE_FIREBASE_AUTH_DOMAIN` = `landtech-e5773.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID` = `landtech-e5773`
   - `VITE_FIREBASE_STORAGE_BUCKET` = `landtech-e5773.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = Your sender ID
   - `VITE_FIREBASE_APP_ID` = Your app ID
5. Click **Deploy**. Vercel will build and serve the application with client-side SPA routing governed by `vercel.json`.

### 2. Deploy Backend on Render
1. Log in to [Render](https://render.com/) and click **New -> Web Service** (or use Blueprints with `render.yaml`).
2. Connect the repository: `https://github.com/BornilMahmud/VumiSeba.git`.
3. Configure Web Service Settings:
   - **Name:** `vumiseba-backend`
   - **Region:** Singapore (`singapore`)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build:server`
   - **Start Command:** `node dist-server/index.js`
   - **Health Check Path:** `/api/health`
4. Environment Variables on Render:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `CORS_ORIGIN` = Your Vercel frontend URL (e.g., `https://vumi-seba.vercel.app` or `*`)
   - `JWT_SECRET` = A strong secret string
   - `FIREBASE_PROJECT_ID` = `landtech-e5773`
   - `SIMULATE_SMS` = `true`
   - `SIMULATE_EMAIL` = `true`
5. Click **Create Web Service**. Verify health check at `https://your-service.onrender.com/api/health`.

### 3. Firebase Console Configuration (Project: `landtech-e5773`)
1. **Authorized Domains:**
   - Go to [Firebase Console](https://console.firebase.google.com/) -> `landtech-e5773` -> **Authentication** -> **Settings** -> **Authorized domains**.
   - Add your production Vercel domain (e.g., `vumi-seba.vercel.app`).
2. **Deploy Firestore Security Rules & Indexes via CLI:**
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project landtech-e5773
   npx firebase-tools deploy --only firestore:indexes --project landtech-e5773
   ```
3. **Seed Firestore Data & Demo Users:**
   ```bash
   npm run seed:firestore
   ```

---

## Q. Security and Privacy

- **Anti-Self-Promotion Protection:** Firestore security rules and backend API explicitly prevent users from elevating their own role. Google Sign-In defaults strictly to `citizen`.
- **Protected Administrator Bootstrapping:** Admin status can only be granted through protected backend CLI execution (`npm run admin:bootstrap`), which permanently logs the promotion in `audit_logs`.
- **Immutable Audit Trail:** Once written, `audit_logs` entries cannot be modified or deleted (`allow update, delete: if false`).
- **KYC & PII Protection:** NID numbers and confidential document uploads are restricted to the owner and authorized verification officers.
- **Strict CORS Origin Restriction:** Configured to whitelist authorized frontend domains, preventing unauthorized cross-origin requests.
- **Zero Exposed Secrets:** All credentials, private keys, and service account tokens are excluded from Git via `.gitignore`.

---

## R. Known Limitations

- **Mock Government Integrations:** VumiSeba does not connect to live confidential Ministry of Land or Election Commission production servers; all external lookups run on an authentic mock schema.
- **Simulated Payment Gateway:** Land development tax payments use an instant simulated gateway rather than live Sonali Bank e-Challan.
- **Synthetic Court Records:** Judicial cases and injunction notices are representative models for demonstration and do not reflect real ongoing litigation.
- **Non-Government Status:** VumiSeba is an innovative hackathon MVP. Output drafts are stamped with a legal disclaimer indicating they are not official government documents.

---

## S. Tools and Development Workflow

- **Git & GitHub:** Version control, branch protection, and collaborative workflow.
- **Firebase CLI (`firebase-tools`):** Deployment of Firestore security rules and indexes.
- **Vercel CLI / Platform:** Automated continuous deployment for modern frontend SPAs.
- **Render Platform:** Zero-downtime Node.js web service hosting.
- **Tailwind CSS & Autoprefixer:** Institutional design system and responsive layout.
- **UI/UX Guidelines:** Designed in compliance with Bangladesh National Web Portal design guidelines.

---

## T. Roadmap and Contribution Instructions

### Roadmap
- [ ] Integration with national digital land map vector layers (Mouza Map GIS).
- [ ] Live SMS gateway integration via Teletalk / Government SMS API.
- [ ] Automated OCR parsing for historical legacy Khatians (CS, SA).
- [ ] Mobile PWA (Progressive Web Application) offline caching for remote field officers.

### Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes following conventional commits: `git commit -m 'feat: add feature'`.
4. Ensure all tests pass: `npm test && npm run test:firebase && npm run build`.
5. Push to the branch: `git push origin feature/your-feature-name`.
6. Open a Pull Request.

### License
This project is developed for the **LandTech Hackathon 2026** and is open-sourced under the **MIT License**.
