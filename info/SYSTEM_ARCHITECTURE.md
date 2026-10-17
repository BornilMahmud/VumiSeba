# System Architecture — VumiSeba (ভূমিসেবা)

## 1. High-Level Architecture Overview

**VumiSeba** is constructed as a modern, decoupled full-stack monorepo application. It combines an institutional client-side Single Page Application (SPA) with a high-performance Express REST API and a resilient dual-database layer.

```mermaid
graph TD
    User["Citizen / Land Officer / Auditor"] -->|HTTPS / WSS| CDN["Vercel CDN / Static Edge"]
    CDN -->|Load SPA Bundles| ReactClient["React 18 SPA (Vite 6, Tailwind CSS)"]
    
    ReactClient -->|REST API Requests /api/*| APIGateway["Express REST API (Node.js 20 LTS)"]
    ReactClient -.->|Optional Direct Client SDK| FirebaseAuth["Firebase Authentication (landtech-e5773)"]
    
    subgraph "Backend Services Layer"
        APIGateway --> AuthMW["Auth & Role Guards (/api/auth)"]
        APIGateway --> RiskEngine["Multi-Factor Risk Engine (/api/risk)"]
        APIGateway --> ValidationSvc["Validation & Invariants Engine"]
        APIGateway --> SaleEngine["Sale Application Pipeline (/api/sale)"]
        APIGateway --> MutationEngine["Auto-Mutation Pipeline (/api/mutation)"]
        APIGateway --> AuditSvc["Immutable Audit Logger (/api/audit)"]
    end
    
    subgraph "Dual Storage Engine"
        ValidationSvc --> DBStore["Dual Storage Adapter (dbStore)"]
        SaleEngine --> DBStore
        MutationEngine --> DBStore
        AuditSvc --> DBStore
        
        DBStore -->|Local Dev & Acceptance Tests| LocalJSON[("data/db.json (Atomic File Mutex Store)")]
        DBStore -->|Production Cloud Cluster| CloudFirestore[("Google Cloud Firestore")]
    end
```

---

## 2. Directory Layout & Module Responsibilities

| Path | Purpose & Responsibility |
|:---|:---|
| `src/` | Client-side source code (React 18, TypeScript, Tailwind CSS). |
| `src/components/common/` | Reusable UI atoms and domain widgets (`ApplicationTimeline`, `DeedDraftModal`, `RiskBadge`, `StatusBadge`, `ChatbotBubble`, `DemoPersonaBar`). |
| `src/components/layout/` | Institutional layouts per role (`CitizenLayout`, `UnionOfficeLayout`, `AcLandOfficeLayout`, `RegistryOfficeLayout`, `AdminOfficeLayout`). |
| `src/context/` | React context providers: `AuthContext.tsx` (session and credentials), `LanguageContext.tsx` (bilingual state). |
| `src/pages/public/` | Public informational and self-service pages (`HomePage`, `SearchLandPage`, `VerifyLandPage`, `HowItWorksPage`, `ServicesPage`, `HelpPage`). |
| `src/pages/citizen/` | Citizen portal (`CitizenDashboard`, `MyLandPage`, `DealsPage`, `MyApplicationsPage`, `ProfileKycPage`). |
| `src/pages/office/` | Institutional role portals (`union/*`, `acland/*`, `registry/*`). |
| `src/pages/admin/` | National admin consoles (`AdminDashboard`, `AdminApplicationsPage`, `AdminUsersPage`, `AdminRolesPage`, `AdminAuditLogsPage`). |
| `server/` | Express backend application written in TypeScript. |
| `server/db/` | Database store interface (`store.ts`) and full deterministic seed script (`seed.ts`). |
| `server/routes/` | REST route handlers (`auth.ts`, `risk.ts`, `sale.ts`, `mutation.ts`, `officer.ts`, `admin.ts`, `audit.ts`, `chat.ts`). |
| `server/services/` | Business validation rules (`validation.service.ts`), risk computation, and sequence generation. |
| `server/tests/` | Automated test suites (`core-correctness.test.ts`, `risk-engine.test.ts`, `e2e-workflow.test.ts`, `firebase-auth-rules.test.ts`). |
| `data/db.json` | Active local database store with seeded test records. |

---

## 3. Dual-Database Architecture

To provide zero-dependency local development, rapid hackathon evaluation, and scalable cloud execution, VumiSeba implements a **Dual-Database Adapter Pattern** in `server/db/store.ts`:

1. **Local Atomic JSON Store (`data/db.json`):**
   - Utilizes an in-process serialized mutex queue for concurrent writes.
   - Employs temporary write-and-rename atomic flushing to protect against corruptions.
   - Allows instant test teardown and deterministic resets via `runSeed()`.
2. **Cloud Firestore Adapter (`landtech-e5773`):**
   - Implements identical collections: `land_parcels`, `profiles`, `sale_applications`, `mutation_applications`, `appointments`, `registration_records`, `audit_logs`.
   - Governed by comprehensive declarative security rules in `firestore.rules`.
   - Optimized with composite queries defined in `firestore.indexes.json`.

---

## 4. Key Cross-Office Data Flow (Problem 4: Smart e-Registry & Auto-Mutation)

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Buyer (Citizen)
    actor Seller as Seller (Citizen)
    actor Union as ULAO (Tahsildar)
    actor ACLand as AC Land
    actor SubReg as Sub-Registrar

    Seller->>Buyer: Initiates Sale Application (Share & Area verified)
    Buyer->>Union: Submits Dossier (Tax cleared & NID KYC verified)
    Union->>Union: Conducts Field Inspection & Boundary Check
    Union->>ACLand: Forwards Dossier with Field Report
    ACLand->>SubReg: Approves Pre-Registration Legal Dossier
    SubReg->>SubReg: Schedules Biometric Appointment with Checklist
    Buyer->>SubReg: Attends Biometric Verification & Signs Deed
    Seller->>SubReg: Confirms Consideration & Fingerprint
    SubReg->>SubReg: Executes Deed (Volume/Page assigned)
    Note over SubReg,ACLand: Automated Trigger Spawns e-Mutation
    SubReg-->>ACLand: Auto-Creates Mutation Application & Summons Queue
    ACLand->>ACLand: Conducts Online/Office Hearing
    ACLand->>Buyer: Approves Mutation & Issues New Khatian (নামজারি-XXXX)
```
