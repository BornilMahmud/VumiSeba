import { Router, Request, Response } from 'express';

const router = Router();

// System prompt grounding the AI in Bangladesh Land & VumiSeba system
const SYSTEM_INSTRUCTION = `
You are "VumiSeba AI Assistant" (ভূমিসেবা এআই সহায়ক), an expert AI consultant for the Bangladesh Smart Land Administration & Citizen Services Platform (VumiSeba - ভূমিসেবা).

Your expertise covers:
1. Bangladesh Land Records: Khatian (CS, SA, RS, City/BS), Dag (Plot) numbers, Mouza, JL Number.
2. Safe Land Purchase: Verifying ownership chain, verifying deed validity (দলিল), checking land tax arrears (ভূমি উন্নয়ন কর/দাখিলা), court injunctions (দেওয়ানি মোকদ্দমা), and preventing earnest money (বায়না) fraud.
3. Automated e-Mutation (ই-নামজারি): Automated application after deed registration at the Sub-Registry office, Tahsildar (Union Land Office) field report, AC Land approval, DCR payment, and new khatian delivery within 7-15 days.
4. Role Ecosystem:
   - Citizen: Buyer / Seller.
   - Union Land Office (ULAO / তহশিলদার): Ground inspection, land category verification, tax clearance.
   - AC Land (সহকারী কমিশনার ভূমি): Quasi-judicial revenue court, hearing, mutation approval/rejection.
   - Sub-Registrar (সাব-রেজিস্ট্রার): Deed verification, biometrics, official registration.
   - Central Admin (ভূমি মন্ত্রণালয়): Audit log, rule enforcement, system oversight.
5. Demonstration Personas on this platform:
   - Seller Rafiqul: seller@bhumisathi.gov.bd (password: demo123456)
   - Buyer Farhan: buyer@bhumisathi.gov.bd (password: demo123456)
   - Union Officer: union.officer@land.gov.bd (password: demo123456)
   - AC Land: ac.land@land.gov.bd (password: demo123456)
   - Sub-Registrar: sub.registrar@land.gov.bd (password: demo123456)
   - Super Admin: admin@landtech.gov.bd (password: demo123456)

Guidelines:
- Reply in the same language the user uses (Bangla or English).
- Be polite, legally accurate according to Bangladesh land laws (State Acquisition and Tenancy Act, Registration Act), clear, and actionable.
- Format responses with clean bullet points and short paragraphs.
`.trim();

// Local smart fallback generator when no API key is provided
function generateFallbackResponse(userPrompt: string, isBn: boolean): string {
  const p = userPrompt.toLowerCase();

  if (p.includes('বায়না') || p.includes('কেনার আগে') || p.includes('verify') || p.includes('buy') || p.includes('purchase')) {
    return isBn
      ? `**জমি কেনার আগে ৪টি প্রধান যাচাই করণীয়:**\n\n` +
        `১. **খতিয়ান ও মালিকানা যাচাই:** সর্বশেষ বিএস/আরএস খতিয়ানে বিক্রেতার নাম ও সঠিক হিস্যা আছে কি না দেখুন।\n` +
        `২. **বায়া দলিল তল্লাশি:** বিগত ২৫ বছরের দলিলের ধারাবাহিকতা (Chain of Title) পরীক্ষা করুন।\n` +
        `৩. **দাখিলা ও খাজনা:** চলতি সনের ভূমি উন্নয়ন কর পরিশোধ করা আছে কি না যাচাই করুন।\n` +
        `৪. **আদালতের নিষেধাজ্ঞা:** স্থানীয় দেওয়ানি আদালত বা এসি ল্যান্ড কোর্টে কোনো মামলা বা নিষেধাজ্ঞা আছে কি না নিশ্চিত হোন।\n\n` +
        `*আমাদের 'জমি যাচাই' মেন্যু থেকে সরাসরি দাগ ও খতিয়ান নম্বর দিয়ে তাৎক্ষণিক ডিজিটাল যাচাই করতে পারেন।*`
      : `**4 Essential Steps Before Buying Land in Bangladesh:**\n\n` +
        `1. **Khatian & Share Verification:** Check if the seller holds undisputed title and required share in the latest RS/BS record of rights.\n` +
        `2. **Chain of Deeds:** Inspect previous title deeds (Baya deeds) for at least 25 years.\n` +
        `3. **Land Tax Clearance:** Confirm up-to-date land development tax receipts (Dakhila).\n` +
        `4. **Injunction Check:** Verify there are no court injunctions or ongoing civil disputes.\n\n` +
        `*Use our 'Verify Land' menu for instant digital verification.*`;
  }

  if (p.includes('নামজারি') || p.includes('mutation') || p.includes('খারিজ') || p.includes('খতিয়ান')) {
    return isBn
      ? `**স্মার্ট ই-নামজারি (Mutation) প্রক্রিয়া:**\n\n` +
        `• **সময়সীমা:** ভূমিসেবা প্ল্যাটফর্মে দলিল রেজিস্ট্রেশনের সাথে সাথেই স্বয়ংক্রিয়ভাবে ই-নামজারি আবেদন তৈরি হয়। সাধারণ আবেদনে ৭ থেকে ১৫ কার্যদিবস লাগে।\n` +
        `• **ধাপসমূহ:**\n` +
        `  ১. ইউনিয়ন তহশিলদার কর্তৃক প্রস্তাব ও প্রতিবেদন দাখিল।\n` +
        `  ২. শুনানি ও আপত্তি যাচাই (প্রয়োজনে)।\n` +
        `  ৩. এসি ল্যান্ড (AC Land) কর্তৃক অনুমোদন।\n` +
        `  ৪. ডিসিআর (DCR) ফি ১,১০০ টাকা অনলাইনে পরিশোধ করে কিউআর-কোডযুক্ত অনলাইন খতিয়ান ডাউনলোড।`
      : `**Smart e-Mutation Process in VumiSeba:**\n\n` +
        `• **Timeline:** Typically completed within 7 to 15 working days.\n` +
        `• **Steps:**\n` +
        `  1. Field report by Union Land Assistant Officer (Tahsildar).\n` +
        `  2. Hearing & dispute verification (if required).\n` +
        `  3. Final approval by Assistant Commissioner (Land) - AC Land.\n` +
        `  4. Online DCR fee payment (BDT 1,100) and download of QR-coded Mutation Khatian.`;
  }

  if (p.includes('হিস্যা') || p.includes('ঘাটতি') || p.includes('share') || p.includes('dispute')) {
    return isBn
      ? `**খতিয়ানে হিস্যা ঘাটতি হলে সমাধান:**\n\n` +
        `• যদি কোনো সহ-শরিক নিজের প্রাপ্য অংশের চেয়ে অতিরিক্ত জমি বিক্রির চেষ্টা করেন, আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে হিস্যা ব্লকেজ দেয়।\n` +
        `• প্রতিকার: ওয়ারিশান সনদ ও বণ্টননামা দলিল (Partition Deed) সম্পাদন করে নিজ নিজ অংশের আলাদা নামজারি খতিয়ান তৈরি করতে হবে।`
      : `**Resolution for Share Inconsistencies:**\n\n` +
        `• If a co-sharer attempts to sell beyond their recorded inheritance share, the platform automatically triggers an over-selling risk flag.\n` +
        `• Solution: Register an official registered Partition Deed (বণ্টননামা) and obtain individual mutation khatians.`;
  }

  if (p.includes('ডেমো') || p.includes('demo') || p.includes('লগইন') || p.includes('account')) {
    return isBn
      ? `**১-ক্লিক পরীক্ষামূলক ডেমো অ্যাকাউন্ট:**\n\n` +
        `• **নাগরিক (বিক্রেতা):** seller@bhumisathi.gov.bd (পাসওয়ার্ড: demo123456)\n` +
        `• **নাগরিক (ক্রেতা):** buyer@bhumisathi.gov.bd (পাসওয়ার্ড: demo123456)\n` +
        `• **ইউনিয়ন কর্মকর্তা:** union.officer@land.gov.bd (পাসওয়ার্ড: demo123456)\n` +
        `• **এসি ল্যান্ড:** ac.land@land.gov.bd (পাসওয়ার্ড: demo123456)\n` +
        `• **সাব-রেজিস্ট্রার:** sub.registrar@land.gov.bd (পাসওয়ার্ড: demo123456)\n` +
        `• **সুপার অ্যাডমিন:** admin@landtech.gov.bd (পাসওয়ার্ড: demo123456)\n\n` +
        `*লগইন পেজে কার্ডে ক্লিক করলেই এগুলো অটো-ফিল হয়ে যাবে।*`
      : `**1-Click Testing Demo Accounts:**\n\n` +
        `• **Citizen (Seller):** seller@bhumisathi.gov.bd (pwd: demo123456)\n` +
        `• **Citizen (Buyer):** buyer@bhumisathi.gov.bd (pwd: demo123456)\n` +
        `• **Union Officer:** union.officer@land.gov.bd (pwd: demo123456)\n` +
        `• **AC Land:** ac.land@land.gov.bd (pwd: demo123456)\n` +
        `• **Sub-Registrar:** sub.registrar@land.gov.bd (pwd: demo123456)\n` +
        `• **Super Admin:** admin@landtech.gov.bd (pwd: demo123456)\n\n` +
        `*Click any persona on the Login page to auto-fill immediately.*`;
  }

  return isBn
    ? `ধন্যবাদ আপনার প্রশ্নের জন্য। ভূমিসেবা (VumiSeba) প্ল্যাটফর্মে আপনি জমি যাচাই, খতিয়ান অনুসন্ধান, ডিজিটাল খাজনা পরিশোধ ও স্বয়ংক্রিয় ই-নামজারি সুবিধা পেতে পারেন।\n\nনির্দিষ্ট তথ্যের জন্য প্রশ্ন করুন: যেমন জমি কেনার নিয়ম, নামজারি প্রক্রিয়া, বা খতিয়ান যাচাই।`
    : `Thank you for your question. VumiSeba provides instant land verification, khatian search, land tax clearance, and automated e-mutation.\n\nFeel free to ask about buying land safely, mutation steps, inheritance shares, or testing our demo accounts.`;
}

// GET status of Gemini API configuration
router.get('/status', (req: Request, res: Response) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasServerKey: hasEnvKey,
    recommendedModel: 'gemini-2.5-flash',
  });
});

// POST chat message with Gemini API
router.post('/gemini', async (req: Request, res: Response): Promise<void> => {
  const { message, history, apiKey: clientApiKey } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ success: false, error: 'Message is required' });
    return;
  }

  // Determine language of prompt
  const hasBengali = /[\u0980-\u09FF]/.test(message);

  // Effective API key from client or server environment
  const effectiveKey = clientApiKey?.trim() || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!effectiveKey) {
    // Return domain fallback when no key is configured
    const fallback = generateFallbackResponse(message, hasBengali);
    res.json({
      success: true,
      reply: fallback,
      source: 'domain_fallback',
      notice: hasBengali
        ? '💡 গুগল এআই স্টুডিও এপিআই কি (API Key) চ্যাটবক্স সেটিংসে যোগ করলে সরাসরি জেমিনাই এআই সক্রিয় হবে।'
        : '💡 Add your Google AI Studio Gemini API Key in chatbot settings to activate live Gemini LLM.',
    });
    return;
  }

  try {
    // Format conversation history for Gemini API
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role === 'user' || h.role === 'model' || h.role === 'assistant') {
          formattedContents.push({
            role: h.role === 'assistant' ? 'model' : h.role,
            parts: [{ text: String(h.content || '') }],
          });
        }
      }
    }

    // Add current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Try gemini-3.8-flash (latest Google AI Studio model), then gemini-flash-latest
    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.5-flash'];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`;

        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            contents: formattedContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (replyText) {
            res.json({
              success: true,
              reply: replyText,
              source: `google_${model}`,
            });
            return;
          }
        } else {
          const errData = await geminiRes.text();
          lastError = errData;
          console.warn(`[Gemini API] Model ${model} returned status ${geminiRes.status}:`, errData);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    // If Gemini call failed (invalid key or quota issue), fall back gracefully
    const fallback = generateFallbackResponse(message, hasBengali);
    res.json({
      success: true,
      reply: fallback,
      source: 'domain_fallback_on_error',
      notice: hasBengali
        ? '⚠️ গুগল এআই স্টুডিও এপিআই কি-তে সমস্যা হয়েছে। অনুগ্রহ করে কি (API Key) টি সঠিক আছে কি না পরীক্ষা করুন।'
        : '⚠️ Gemini API request failed. Please verify your Google AI Studio API key.',
      errorDetails: typeof lastError === 'string' ? lastError.slice(0, 150) : lastError?.message,
    });
  } catch (error: any) {
    console.error('[Gemini Route Error]:', error);
    const fallback = generateFallbackResponse(message, hasBengali);
    res.json({
      success: true,
      reply: fallback,
      source: 'error_fallback',
    });
  }
});

export default router;
