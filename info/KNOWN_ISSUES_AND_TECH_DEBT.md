# Known Issues & Technical Debt — VumiSeba (ভূমিসেবা)

This document tracks verified limitations, technical debt, and operational risks identified during repository audits.

## 1. Verified Technical Debt & Architectural Observations

| ID | Category | Item & Context | Impact | Status / Mitigation |
|:---|:---|:---|:---|:---|
| **TD-001** | Frontend Performance | **Vite Bundle Size Warning (`index.js` > 900 kB):**<br>The main client chunk is currently 945.78 kB (136.60 kB gzipped) because public, citizen, and internal officer route modules are bundled together without lazy loading. | Increases initial First Contentful Paint (FCP) on slow 3G cellular connections. | **Mitigation Planned:** Implement `React.lazy()` and `Suspense` for `/office/*` and `/admin/*` routes (`IMP-001`). |
| **TD-002** | External Integrations | **Synthetic Porichoy KYC & e-Challan:**<br>Direct API integrations with the national election commission (Porichoy) and the Sonali Bank treasury gateway are simulated with verified deterministic mocks. | Eliminates network outages during evaluation, but requires live API contracts for national deployment. | **Documented Invariant:** Designed with clean adapter boundaries ready for production webhook drop-in (`IMP-004`, `IMP-005`). |
| **TD-003** | Cloud Secrets | **Missing Live Cloud Firebase Key in `.env`:**<br>The repository excludes real Google Cloud API keys for security (`VITE_FIREBASE_API_KEY` is blank). | Direct browser connection to live cloud Firestore falls back to the Express REST API. | **Verified by Test:** Group 1 test in `firebase-auth-rules.test.ts` asserts resilient fallback without application crash. |
| **TD-004** | Magisterial Workflow | **Cartridge Stamp Paper Printing:**<br>Sub-Registry offices in Bangladesh require 100-Taka physical stamp paper for final deed binding. VumiSeba generates a preliminary digital draft. | Requires printing and physical signing at the Sub-Registry booth during the appointment. | **Documented Invariant:** The digital deed serves for preliminary review and digital record preservation. |
| **TD-005** | Database Concurrency | **Single-Instance Mutex on `data/db.json`:**<br>The local JSON store uses an in-memory async mutex queue for file serialization. | Works reliably on single-node instances and local dev; cannot scale horizontally across multi-pod server clusters without switching to Firestore. | **Documented Invariant:** In multi-pod production environments, the Express backend must be configured to use Cloud Firestore. |
