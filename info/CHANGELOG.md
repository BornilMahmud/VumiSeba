# Changelog — VumiSeba (ভূমিসেবা)

All notable changes, bug fixes, and architectural evolutions for this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-10-17

### Added
- **Problem 5 (P5) Multi-Factor Risk Engine:** Automated land due-diligence assessment calculating 0–100 risk scores, evaluating co-owner shares, unpaid land taxes, court injunctions, and bank mortgages.
- **Problem 4 (P4) Smart e-Registry & Auto-Mutation:** Cross-office workflow pipeline bridging Citizens, Union Land Offices (ULAO), AC Land, and Sub-Registry. Automated post-registration trigger that instantly spawns e-Mutation cases in AC Land's queue upon Sub-Registry deed execution.
- **Dual-Database Adapter Architecture:** Unified storage abstraction (`dbStore`) supporting atomic local JSON operations (`data/db.json`) for zero-dependency development and Google Cloud Firestore (`landtech-e5773`) for cloud deployments.
- **Comprehensive Test Automation Suite:**
  - `server/tests/core-correctness.test.ts`: Basis points integer math, monotonic sequence generation, double-sale prevention, and concurrency serialization.
  - `server/tests/risk-engine.test.ts`: Factor transparency and critical score overrides.
  - `server/tests/e2e-workflow.test.ts`: 7-scenario end-to-end acceptance tests.
  - `server/tests/firebase-auth-rules.test.ts`: 26 declarative security rules checks.
- **Institutional Light Theme Design System:** High-contrast light surfaces (`#ffffff`, `#f8fafc`), deep charcoal typography (`#0f172a`), emerald accents (`#059669`), Google Fonts (*Hind Siliguri*, *Inter*), and bilingual toggle (`[বাংলা / English]`).
- **Interactive Land Assistant (AI Chatbot):** Floating responsive chatbot bubble assisting citizens with land laws, tax calculation, and mutation procedures.
- **Demo Persona Bar:** Quick persona switcher allowing evaluators to jump between Citizen (Buyer/Seller), Union Officer, AC Land, Sub-Registrar, and Central Admin roles.
- **Master Knowledge Hub & Intelligence Report:** Complete documentation suite in `info/` and self-contained `PROJECT_INTELLIGENCE_REPORT.md`.

### Fixed
- **Seed Data Parcel Collision in Phase 1 Core Correctness:**
  - Resolved an issue where seeded application `sa-ready-demo-02` was pointing to `pcl-clean-405` instead of `pcl-acland-appr-704`.
  - This conflict caused reserved shares on Parcel 405 to calculate as 0.12 instead of the expected 0.05 in `core-correctness.test.ts` (Test 3).
  - Fixed in `server/db/seed.ts` line 1642; all Phase 1, Phase 3, and E2E acceptance tests now pass with 100% success.
