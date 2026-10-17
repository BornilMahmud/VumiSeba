# Feature Status & Complete Feature Inventory — VumiSeba (ভূমিসেবা)

This document provides a comprehensive inventory of all user-facing features, internal workflows, and system engines across VumiSeba, along with verified implementation statuses and references.

## Status Legend
- **Implemented:** Source code exists and is wired end-to-end.
- **Verified:** Tested and validated via automated test scripts or live runtime execution.
- **Partial:** UI or backend exists, but secondary integrations (e.g., live SMS/payment gateway) are synthetic or mock-backed.
- **Planned:** Documented roadmap feature not yet in the active codebase.

---

## 1. Public Discovery & Land Due Diligence (Problem 5)

| Feature Name | Description | Key Modules | Status | Verification Evidence |
|:---|:---|:---|:---:|:---|
| **Land Search Engine** | Public query by District, Upazila, Mouza, and Dag or Khatian number. | `src/pages/public/SearchLandPage.tsx`, `server/routes/risk.ts` | **Verified** | `e2e-workflow.test.ts` (Test 3) verified parcel 405 discovery. |
| **Check Before You Buy (Multi-Factor Risk Engine)** | 0–100 due-diligence risk scoring engine evaluating co-owner shares, tax status, court injunctions, and bank mortgages. | `server/routes/risk.ts`, `src/pages/public/VerifyLandPage.tsx` | **Verified** | `risk-engine.test.ts` (Tests 1–7) passed all boundary and override conditions. |
| **Risk Factors Transparency Breakdown** | Interactive visual breakdown of weighted risk factors (Ownership, Tax, Legal, Encumbrance). | `src/pages/public/VerifyLandPage.tsx`, `src/components/common/RiskBadge.tsx` | **Verified** | Verified live rendering in light-mode UI with Bengali explanations. |
| **Bilingual Language Switcher** | Instant toggle between Bengali (`বাংলা`) and English (`English`) across headers, forms, status badges, and notifications. | `src/context/LanguageContext.tsx`, `src/components/layout/Navbar.tsx` | **Verified** | Runtime context state verified across all 5 user roles. |
| **Interactive Land Assistant (AI Chatbot)** | Real-time multilingual conversational chatbot assisting citizens with land laws, tax rates, and mutation steps. | `src/components/common/ChatbotBubble.tsx`, `server/routes/chat.ts` | **Verified** | Interactive bubble tested with automated responsive Q&A fallbacks. |

---

## 2. Citizen Self-Service Portal

| Feature Name | Description | Key Modules | Status | Verification Evidence |
|:---|:---|:---|:---:|:---|
| **Citizen Registration & NID KYC** | Citizen onboarding with National ID (NID) submission and automated issuance of `BHM-CIT-XXXXXX`. | `src/pages/citizen/ProfileKycPage.tsx`, `server/routes/admin.ts` | **Verified** | `e2e-workflow.test.ts` (Test 2) verified KYC approval and ID issuance. |
| **My Land Holdings & e-Dakhila Tax Payment** | Owner parcel listing with real-time tax calculation and simulated mobile financial services payment (Nagad/bKash). | `src/pages/citizen/MyLandPage.tsx`, `server/routes/officer.ts` | **Verified** | `e2e-workflow.test.ts` (Test 5) verified tax due check and payment receipt generation. |
| **Sale Application Submission** | Seller initiates transfer by specifying Buyer Citizen ID, proposed share, and deed type. Server enforces share invariants. | `src/pages/citizen/DealsPage.tsx`, `server/routes/sale.ts` | **Verified** | `core-correctness.test.ts` (Test 3) validated reservation math and double-sale prevention. |
| **8-Stage Application Timeline Tracker** | Visual step-by-step progress bar showing current administrative review status. | `src/components/common/ApplicationTimeline.tsx` | **Verified** | Component tested with all 9 lifecycle stages. |
| **Preparatory Deed Draft Inspection** | Full-screen modal rendering official Bengali deed text, boundaries, and financial consideration. | `src/components/common/DeedDraftModal.tsx` | **Verified** | Component tested on Stage 4+ applications. |

---

## 3. Institutional Officer Portals (Problem 4: Smart e-Registry & Auto-Mutation)

| Feature Name | Description | Key Modules | Status | Verification Evidence |
|:---|:---|:---|:---:|:---|
| **Union Land Assistant Review (ULAO / Tahsildar)** | Physical possession and boundary verification, field report creation, and approval forwarding to AC Land. | `src/pages/office/union/*`, `server/routes/officer.ts` | **Verified** | `e2e-workflow.test.ts` (Test 7) verified stage advancement. |
| **AC Land Pre-Registration Review** | Executive scrutiny of legal title dossier prior to deed execution. | `src/pages/office/acland/*`, `server/routes/officer.ts` | **Verified** | `e2e-workflow.test.ts` (Test 7) verified transition to `REGISTRATION_READY`. |
| **Sub-Registry Appointment Scheduler** | Sub-Registrar schedules deed signing appointments with required original document checklists. | `src/pages/office/registry/*`, `server/routes/officer.ts` | **Verified** | `core-correctness.test.ts` verified appointment issuance. |
| **Sub-Registry Deed Execution** | Biometric verification, Volume/Page assignment, and execution record creation. | `src/pages/office/registry/*`, `server/routes/officer.ts` | **Verified** | Verified deed execution generates official `REG-GLS-XXXX` serial. |
| **Automated Downstream e-Mutation Trigger** | Server automatically generates linked mutation case (`BHM-MUT-XXXX`) immediately upon deed completion. | `server/routes/officer.ts`, `server/routes/mutation.ts` | **Verified** | `e2e-workflow.test.ts` (Test 7) verified automatic creation without citizen refiling. |
| **Post-Registration Mutation Hearing & Approval** | AC Land conducts hearing, updates Khatian, and issues new Khatian (`নামজারি-XXXX`). | `src/pages/office/acland/AcLandMutationPage.tsx`, `server/routes/mutation.ts` | **Verified** | `e2e-workflow.test.ts` (Test 7) verified new Khatian creation and area deduction. |

---

## 4. Central Administration & National Audit

| Feature Name | Description | Key Modules | Status | Verification Evidence |
|:---|:---|:---|:---:|:---|
| **Citizen KYC Review Console** | Administrators inspect uploaded NID cards and verify citizen identities. | `src/pages/admin/AdminUsersPage.tsx`, `server/routes/admin.ts` | **Verified** | Verified administrative approval workflow. |
| **Staff Role Provisioning** | Assignment and revoking of officer permissions (`union_officer`, `ac_land`, `sub_registrar`). | `src/pages/admin/AdminRolesPage.tsx`, `server/routes/admin.ts` | **Verified** | Role change tests verified anti-privilege escalation guards. |
| **Immutable Security Audit Log** | Tamper-proof activity ledger recording all critical mutations, approvals, and logins. | `src/pages/admin/AdminAuditLogsPage.tsx`, `server/routes/audit.ts` | **Verified** | `firebase-auth-rules.test.ts` (Group 2) verified append-only constraint. |
| **Demo Persona Switcher Bar** | Sticky bottom navigation bar allowing instant switching between all 5 demo personas for presentation and evaluation. | `src/components/common/DemoPersonaBar.tsx`, `src/context/AuthContext.tsx` | **Verified** | Verified active in development and production evaluation modes. |
