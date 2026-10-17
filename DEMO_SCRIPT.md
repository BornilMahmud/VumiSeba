# VumiSeba (ভূমিসেবা) — Judge Presentation & Demo Script

> **Theme**: Pure Problem Solving for Bangladesh LandTech  
> **Core Pillars**: Check Before You Buy (P5) & Smart Registry to Auto e-Mutation (P4)  
> **Built For**: Hackathon Judges, Technical Evaluators & Policy Experts

---

## Part A: 90-Second Lightning Pitch Script

**Target Time:** 90 Seconds | **Focus:** High impact, problem clarity, fraud prevention, live proof.

| Time | Action / URL | Exact Screen Clicks | Spoken Narration (Bengali / English) |
|---|---|---|---|
| **00:00 - 00:20** | `http://localhost:3000/` (Home) | Show Home headline & dual solutions: *Check Before You Buy* & *Smart Registry to e-Mutation*. Click **"৩-মিনিট লাইভ ডেমো শুরু করুন"**. | "বাংলাদেশে জমি কিনে মানুষ সবচেয়ে বেশি প্রতারিত হয় বায়নার আগে স্বত্ব যাচাই না করতে পেরে এবং রেজিস্ট্রেশনের পর নামজারি না করায়। ভূমিসেবা এই দুই মারাত্মক ফাঁক বন্ধ করেছে।" / *"In Bangladesh, 70% of civil litigation stems from land fraud before earnest money and un-mutated deeds. VumiSeba solves both."* |
| **00:20 - 00:45** | `/verify-land` | 1. Click preset button: **"✓ নিরাপদ জমি (দাগ ৪০৫)"** -> Score: 90/100 (নিরাপদ).<br>2. Click preset button: **"⛔ আদালত মামলা ও মর্টগেজ (দাগ ৭১০)"** -> Watch **Critical Override Banner** trigger instantly! | "আমাদের স্বচ্ছ রিস্ক ইঞ্জিন শুধু স্কোর দেখায় না, ৭টি পৃথক ফ্যাক্টর এবং ক্রিটিক্যাল ওভাররাইড প্রদর্শন করে। দাগ ৭১০-এ অন্যান্য রেকর্ড ভালো থাকলেও আদালতের স্থগিতাদেশের কারণে সিস্টেম একে সরাসরি 'সংকটাপন্ন ঝুঁকি' হিসেবে চিহ্নিত করেছে।" / *"Notice the Critical Factor Override: active court injunctions strictly cap the score and prevent false 'Low Risk' ratings."* |
| **00:45 - 01:10** | Demo Persona Bar -> **"বিক্রেতা (আরমান)"** -> `/citizen/sell` | Select Dag **১০২** -> Enter proposed share `0.25` (Seller only owns `0.125`) -> Click Submit. | "ডাবল-সেল ও অতিরিক্ত বিক্রি রোধ: দাগ ১০২-এ নজরুল ০.১২৫ অংশের মালিক হয়ে ০.২৫ বিক্রির চেষ্টা করলে আমাদের ইনটিজার বেসিস-পয়েন্ট লেজার তাৎক্ষণিক 400 ত্রুটিতে আবেদন আটকে দেয়।" / *"Our integer basis-point ledger strictly blocks over-selling upon submission."* |
| **01:10 - 01:30** | Demo Persona Bar -> **"সাব-রেজিস্ট্রার"** -> `/office/registry/dashboard` | Click application `APP-2026-9041` -> Click **"দলিল সম্পাদন নিশ্চিত করুন"**. | "রেজিস্ট্রেশন সম্পূর্ণ হওয়ার সাথে সাথেই একটি পারমাণবিক ট্রানজ্যাকশনে সরাসরি ই-নামজারি কেস ও ক্রেতার নতুন খতিয়ান তৈরি হয়ে যায়। নাগরিকের কোনো নতুন আবেদন বা দালাল ধরার প্রয়োজন নেই।" / *"Deed registration atomically spawns the linked e-Mutation case and updates the khatian. Zero citizen delay."* |

---

## Part B: 3-Minute Comprehensive Interactive Demo Script

### Persona Access Cheat-Sheet (Always Visible on Top Demo Bar)
- **Buyer (Citizen)**: Farhan Ahmed (`farhan@demo.land.gov.bd`)
- **Seller (Citizen)**: Md. Arman Hossen Ripon (`seller@bhumisathi.gov.bd`)
- **Tax-Due Seller**: Latif Hossain (`latif@demo.land.gov.bd`)
- **Excess Share Seller**: Nazrul Islam (`nazrul@demo.land.gov.bd`)
- **Union Land Officer (ULAO)**: Najma Akter (`union.officer@land.gov.bd`)
- **AC Land (Magistrate)**: Mahmudul Hasan (`acland.gulshan@land.gov.bd`)
- **Sub-Registrar**: Abul Kalam Azad (`subreg.gulshan@minlaw.gov.bd`)
- **Central Admin**: System Administrator (`admin@land.gov.bd`)

---

### Step 1: Pre-Purchase Due Diligence (00:00 – 00:45)
**Goal:** Prove that an ordinary citizen can detect title defects in 5 seconds before giving a single Taka in earnest money (*বায়না*).

1. Open `http://localhost:3000/`.
2. Notice the prominent institutional light theme (`#ffffff` / `#059669`), dual solution framing, and quick test plot presets.
3. Click **"কেনার আগে জমি যাচাই করুন"** (takes you to `/verify-land`).
4. **Fraud Attempt 1 (Court Injunction Override):**
   - Click preset button: **"⛔ আদালত মামলা ও মর্টগেজ (দাগ ৭১০)"**.
   - **Show Judges:** Red Critical Override Banner appears: *"ক্রিটিক্যাল ফ্যাক্টর ওভাররাইড সক্রিয় — সক্রিয় আদালতের স্থগিতাদেশের কারণে এই জমিকে কখনই 'নিরাপদ' বলা যাবে না"*.
   - Point out the 7-factor transparency breakdown table showing max points, points deducted, status, and plain-Bengali explanation.
   - Point out the statutory notice: *"Advisory, not legal certificate"*.
5. **Fraud Attempt 2 (Government Khas Land):**
   - Click preset button: **"🚫 ১০০% সরকারি খাস জমি (দাগ ৯৯৯)"**.
   - Show that it scores 15/100 and alerts the buyer that the land belongs to Government Collectorate Khas Ledger.
6. Click preset button: **"✓ নিরাপদ জমি (দাগ ৪০৫, বাড্ডা)"** to show how a 100% clean parcel displays 90/100 Low Risk with passing grades on all 7 criteria.

---

### Step 2: Land Tax Arrears Enforcement (00:45 – 01:15)
**Goal:** Prove that the platform protects government revenue and prevents passing undisclosed debts to buyers.

1. In the top **Demo Persona Bar**, click **"কর বকেয়া (লতিফ)"**.
2. Navigate to `/citizen/tax-clearance`.
3. Select Parcel **দাগ ৮৮২ (সাঁতারকুল)**.
4. **Fraud Attempt 3 (Tax Arrears Block):**
   - Show the ৳4,850 unpaid Land Development Tax arrears.
   - Attempting to submit a sale application for this plot triggers a hard server block: *"বকেয়া খাজনা অপরিশোধিত থাকায় আবেদন গ্রহণ করা সম্ভব নয়"*.
5. Click **"অনলাইন খাজনা পরিশোধ ও দাখিলা সংগ্রহ"** (simulated e-Challan) to generate verified Dakhila certificate and tax clearance ID.

---

### Step 3: Cryptographic Share Guard & Double-Sale Block (01:15 – 01:50)
**Goal:** Prove that integer basis-point math (10,000 BPS) prevents fractional drift and active reservation prevents selling the same share twice.

1. In the top **Demo Persona Bar**, click **"অতিরিক্ত হিস্যা (নজরুল)"**.
2. Navigate to `/citizen/sell` with Parcel **দাগ ১০২**.
3. **Fraud Attempt 4 (Over-Selling Share Limit):**
   - The parcel shows Nazrul owns a `0.125` share (12.5% of 24 decimal = 3.0 decimal).
   - Enter proposed share `0.25` (25% = 6.0 decimal).
   - Click **"বিক্রয় আবেদন দাখিল করুন"**.
   - **Show Judges:** Server rejects with `400 Bad Request`: *"প্রস্তাবিত অংশ (০.২৫) বিক্রেতার বৈধ হিস্যা (০.১২৫) অপেক্ষা বেশি। আবেদন বাতিল।"*
4. Now switch to **"বিক্রেতা (আরমান)"** and submit a valid `0.05` share on clean plot **৪০৫**.
   - Show that submission immediately places an uncommitted reservation on the seller's active interest.

---

### Step 4: Inter-Office Workflow & Re-Validation (01:50 – 02:30)
**Goal:** Demonstrate the seamless handover across Union, AC Land, and Sub-Registry with real downstream re-validation.

1. In Demo Persona Bar, click **"ইউনিয়ন কর্মকর্তা"** -> `/office/union/dashboard`.
   - Show the review queue sorted oldest-first with SLA age counter.
   - Click on the pending application -> review field boundary checklist -> click **"অনুমোদন ও এসি ল্যান্ডে প্রেরণ"**.
2. Switch to **"এসি ল্যান্ড"** -> `/office/ac-land/dashboard`.
   - Click on the newly forwarded file.
   - Show the **ApplicationTimeline** component rendering all 9 stages, previous officer actions, and timestamps.
   - Click **"প্রাক-রেজিস্ট্রি NOC অনুমোদন"**. Note: Server executes downstream re-validation before issuing permission.

---

### Step 5: Sub-Registry Deed Execution & Instant Auto e-Mutation (02:30 – 03:00)
**Goal:** Deliver the "Magic Moment" — zero citizen delay between deed registration and e-mutation docket.

1. Switch to **"সাব-রেজিস্ট্রার"** -> `/office/registry/dashboard`.
2. Find the ready application -> Click **"দলিল সম্পাদন ও রেজিস্ট্রেশন"**.
3. Enter Deed Number `৩৪০৯/২০২৬` -> Click **"দলিল সম্পাদন নিশ্চিত করুন"**.
4. **Show Judges:** The store transaction executes atomically:
   - Deed record is permanently registered.
   - Linked e-Mutation case is spawned directly into AC Land docket without citizen re-filing!
5. Switch to **"ক্রেতা (ফারহান)"** -> `/citizen/mutation-tracking`.
   - Buyer Farhan instantly sees the new e-Mutation case with live 9-stage tracker and hearing schedule.
6. Open `/citizen/my-land` to show the final updated digital Khatian with verifiable QR code.
7. Wrap up: *"Check Before You Buy stops land disputes before earnest money; Smart Registry stops 40-year mutation backlogs at the source."*

---

## Part C: 4 Exact Moments Where Judges Can Break Other Apps (and VumiSeba Passes)

1. **The Double-Sale Concurrency Trap**:
   - Two buyers submit applications for the same seller's remaining share simultaneously.
   - *VumiSeba Result*: Server-side active share reservation and serialized transaction mutex ensures the second buyer is rejected with `share_reserved_exceeded`.
2. **The "Clean Paper, Dirty Injunction" Trap**:
   - A parcel has 100% clean tax records, but an active High Court status quo injunction.
   - *VumiSeba Result*: Risk engine overrides aggregate score and displays `Critical Risk` (score capped <= 25).
3. **The Float Drift Trap**:
   - Repeated 1/3 (0.33333...) inheritance splits accumulate rounding leakage.
   - *VumiSeba Result*: Integer Basis Point arithmetic (`10000 BPS`) preserves exact land fractions down to the square foot without drift.
4. **The Ghost Seller Trap**:
   - Seller provides an unrecorded NID.
   - *VumiSeba Result*: Evaluator flags seller identity mismatch and deducts 30 points.
