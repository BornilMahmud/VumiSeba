# Roadmap & Future Improvements — VumiSeba (ভূমিসেবা)

This backlog contains prioritized, actionable enhancement proposals designed to scale VumiSeba from its production-ready MVP into an enterprise national utility.

---

## 1. Prioritized Improvement Backlog

### IMP-001: Route-Based Code Splitting via `React.lazy`
- **Category:** Frontend Performance / Optimization
- **Priority:** P1 (High)
- **Effort:** Small (S — ~1-2 hours)
- **Problem:** All pages (public, citizen, union, acland, registry, admin) are bundled into a single primary chunk (`index-BAmzvhj4.js`, 945 kB).
- **Solution:** Wrap `/office/*` and `/admin/*` route components in `React.lazy()` with a Suspense fallback skeleton.
- **Expected Benefit:** Reduces initial download size to `<300 kB`, cutting FCP by ~65% on 3G connections.
- **Acceptance Criteria:** `npm run build` generates split chunks for office and admin sections; initial chunk warning is resolved.

---

### IMP-002: Real-Time Push Alerts via Firebase Cloud Messaging (FCM)
- **Category:** Notification / Citizen Engagement
- **Priority:** P1 (High)
- **Effort:** Medium (M — ~3-4 hours)
- **Problem:** Citizens and officers currently rely on manual page reloads or local polling to view appointment schedules and mutation orders.
- **Solution:** Configure Firebase Cloud Messaging (FCM) web push notifications for appointment schedules and hearing summons.
- **Expected Benefit:** Immediate delivery of appointment tokens and hearing dates directly to mobile browsers.
- **Acceptance Criteria:** Hearing dates and biometric tokens show as native notifications within 2 seconds of officer confirmation.

---

### IMP-003: Interactive Cadastral Mouza GIS Map Overlay
- **Category:** Visual Land Tech / Spatial Intelligence
- **Priority:** P2 (Medium)
- **Effort:** Large (L — ~1-2 days)
- **Problem:** Land search results display tabular survey data without a spatial visualization of the plot boundaries or neighboring plots.
- **Solution:** Integrate Leaflet / MapLibre with GeoJSON boundary polygons for Bangladesh Mouzas, coloring plots by risk status (Green = Clear, Yellow = Tax Due, Red = Injunction).
- **Expected Benefit:** High-impact visual verification of land plot shape, road access, and neighboring boundaries.
- **Acceptance Criteria:** Plot search highlights the selected Dag polygon on an interactive vector map.

---

### IMP-004: Direct Porichoy NID Verification Integration
- **Category:** Security / Identity Assurance
- **Priority:** P2 (Medium)
- **Effort:** Medium (M — ~4-6 hours)
- **Problem:** Citizen KYC currently uses deterministic synthetic verification for hackathon evaluation.
- **Solution:** Implement backend webhook integration with the Porichoy (পরিচয়) national election commission API.
- **Expected Benefit:** Guaranteed cryptographic identity verification preventing fake NID submissions.
- **Acceptance Criteria:** Valid 10/17-digit NID + DOB retrieves real-time name matching from government servers.

---

### IMP-005: Sonali Bank e-Challan Treasury Gateway Integration
- **Category:** Financial Services / Revenue Assurance
- **Priority:** P2 (Medium)
- **Effort:** Large (L — ~1-2 days)
- **Problem:** Land development tax and registration fees are paid via simulated payment receipts.
- **Solution:** Integrate Sonali Bank e-Challan API (`Automated Challan System - A-Challan`) for real-time treasury deposits.
- **Expected Benefit:** Direct deposit of government revenue into national treasury accounts with instant cryptographic challan verification.
- **Acceptance Criteria:** Citizens receive a verifiable 16-digit government treasury challan code.

---

### IMP-006: PKI Digital Signature Stamping for AC Land Orders
- **Category:** Legal / Magisterial Invariants
- **Priority:** P3 (Medium)
- **Effort:** Large (L — ~1-2 days)
- **Problem:** Mutation order sheets and new Khatians are generated with system stamps rather than personal PKI cryptographic certificates.
- **Solution:** Implement X.509 cryptographic digital signing for AC Land mutation approvals using national digital certification authorities.
- **Expected Benefit:** Legally non-repudiable mutation orders accepted directly in civil courts and district registration offices.
- **Acceptance Criteria:** Exported mutation PDF includes cryptographically signed timestamp verifiable in Adobe Reader.
