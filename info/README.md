# VumiSeba (ভূমিসেবা) — Project Knowledge Hub

Welcome to the central knowledge repository for **VumiSeba (ভূমিসেবা)**, the Bangladesh Citizen Land Services, Due-Diligence & Automated e-Mutation Platform.

Every document in this directory is grounded in verified repository evidence, actual code paths, and executable test suites.

---

## 📚 Knowledge Hub Index

| Document | Purpose & Scope | Primary References |
|:---|:---|:---|
| [System Architecture](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/SYSTEM_ARCHITECTURE.md) | Full-stack monorepo design, dual database model (Local JSON + Firestore), Express API architecture, and Mermaid system flows. | `server/index.ts`, `src/App.tsx`, `firestore.rules` |
| [Feature Status & Inventory](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/FEATURE_STATUS_AND_INVENTORY.md) | Complete inventory of public, citizen, officer, and admin workflows with verified status tags. | `src/pages/*`, `server/routes/*` |
| [Data Model & Schemas](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/DATA_MODEL_AND_SCHEMAS.md) | Data dictionary, TypeScript interfaces, entity relationships, integer share math (bps), and indexes. | `src/types/index.ts`, `server/db/seed.ts`, `firestore.indexes.json` |
| [API Routes & Contracts](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/API_ROUTES_AND_CONTRACTS.md) | Specification for all Express REST endpoints, request/response formats, validation, and role middlewares. | `server/routes/*`, `server/services/validation.service.ts` |
| [Development & Operations Guide](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/DEVELOPMENT_AND_OPERATIONS_GUIDE.md) | Setup, dependency management, dev server execution, seed commands, and cloud deployment procedures. | `package.json`, `vercel.json`, `render.yaml`, `firebase.json` |
| [QA & Testing](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/QA_AND_TESTING.md) | Test automation suites, verified test executions (Core Correctness, Risk Engine, E2E, Firebase Rules), and pass rates. | `server/tests/*` |
| [Known Issues & Tech Debt](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/KNOWN_ISSUES_AND_TECH_DEBT.md) | Verified technical debt, bundle size observations, architectural limitations, and operational risk mitigation. | `dist/`, `server/` |
| [Roadmap & Future Improvements](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/ROADMAP_AND_FUTURE_IMPROVEMENTS.md) | Prioritized backlog of enhancements (IMP-001 through IMP-006) ranked by impact, effort, and dependencies. | Product roadmap |
| [Changelog](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/CHANGELOG.md) | Historical record of system revisions, architectural migrations, and bug fixes. | Commit and code evolution |
| [System Reviews & Audits](file:///Users/armanhossenripon/Documents/Github2/VumiSeba/info/REVIEWS/2026-10-17-SYSTEM-AUDIT.md) | Dated multi-dimensional system audits covering product completeness, UI/UX, engineering, security, and QA. | Comprehensive audit |

---

## 🏛️ Core Principles & Conventions

1. **Evidence First:** All claims reflect working TypeScript code and actual data fixtures in `server/db/seed.ts` or `data/db.json`.
2. **Zero Secrets in Documentation:** Real credentials, JWT secrets, or Firebase service account keys must never be committed to documentation.
3. **Bilingual Invariant:** The UI natively supports Bengali (`bn`) as primary and English (`en`) as secondary, preserved through `src/context/LanguageContext.tsx`.
4. **Institutional Aesthetics:** Strict high-contrast light theme (`#ffffff`, `#f8fafc`, text `#0f172a`, emerald `#059669`) with typography using *Hind Siliguri* and *Inter*.
