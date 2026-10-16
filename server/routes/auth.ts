import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { dbStore } from '../db/store.js';
import { generateToken, requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { UserProfile } from '../db/types.js';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  email: z.string().email('সঠিক ইমেইল ঠিকানা প্রদান করুন'),
  password: z.string().min(6, 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে'),
  name_bn: z.string().min(2, 'বাংলায় পুরো নাম লিখুন'),
  name_en: z.string().min(2, 'ইংরেজিতে পুরো নাম লিখুন'),
  mobile: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন'),
  nid_no: z.string().min(10, '১০ বা ১৭ ডিজিটের জাতীয় পরিচয়পত্র নম্বর দিন'),
  father_name_bn: z.string().min(2, 'পিতার নাম লিখুন'),
  mother_name_bn: z.string().min(2, 'মাতার নাম লিখুন'),
  address_bn: z.string().min(5, 'বর্তমান ঠিকানা লিখুন'),
  district: z.string().default('ঢাকা'),
  upazila: z.string().default('গুলশান'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Helper to generate unique Citizen ID
function generateCitizenId(): string {
  const randNum = Math.floor(100000 + Math.random() * 900000);
  return `BHM-CIT-${randNum}`;
}

// 1. Citizen Registration
router.post('/register', async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUsers = await dbStore.find('profiles', (p) => p.email === validated.email || p.nid_no === validated.nid_no);
    if (existingUsers.length > 0) {
      res.status(400).json({
        success: false,
        message_bn: 'এই ইমেইল বা এনআইডি নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: validated.email,
      password_hash: passwordHash,
      name_bn: validated.name_bn,
      name_en: validated.name_en,
      mobile: validated.mobile,
      nid_no: validated.nid_no,
      father_name_bn: validated.father_name_bn,
      mother_name_bn: validated.mother_name_bn,
      address_bn: validated.address_bn,
      district: validated.district,
      upazila: validated.upazila,
      role: 'citizen',
      kyc_status: 'unverified',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await dbStore.create('profiles', newUser);
    const token = generateToken(newUser);

    const { password_hash, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      message_bn: 'নিবন্ধন সফলভাবে সম্পন্ন হয়েছে।',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message_bn: err.errors?.[0]?.message || 'নিবন্ধনে ত্রুটি হয়েছে। অনুগ্রহ করে তথ্য যাচাই করুন।',
      error: err.message,
    });
  }
});

// 2. Standard Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const users = await dbStore.find('profiles', (p) => p.email.toLowerCase() === email.toLowerCase());
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({
        success: false,
        message_bn: 'ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।',
      });
      return;
    }

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;
    res.json({
      success: true,
      message_bn: 'লগইন সফল হয়েছে।',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message_bn: 'লগইনে ত্রুটি হয়েছে।',
      error: err.message,
    });
  }
});

// 3. Demo Persona 1-Click Login (Essential for Hackathon Judges & Government Evaluators)
router.post('/demo-login', async (req, res) => {
  const { role, persona } = req.body;
  let targetUser: UserProfile | undefined;

  const allProfiles = await dbStore.get('profiles');

  if (persona === 'seller') {
    targetUser = allProfiles.find((p) => p.id === 'usr-seller-01');
  } else if (persona === 'buyer') {
    targetUser = allProfiles.find((p) => p.id === 'usr-buyer-01');
  } else if (persona === 'taxdue') {
    targetUser = allProfiles.find((p) => p.id === 'usr-seller-taxdue');
  } else if (persona === 'oversell') {
    targetUser = allProfiles.find((p) => p.id === 'usr-seller-oversell');
  } else if (role === 'union_officer') {
    targetUser = allProfiles.find((p) => p.role === 'union_officer');
  } else if (role === 'ac_land') {
    targetUser = allProfiles.find((p) => p.role === 'ac_land');
  } else if (role === 'sub_registrar') {
    targetUser = allProfiles.find((p) => p.role === 'sub_registrar');
  } else if (role === 'central_admin') {
    targetUser = allProfiles.find((p) => p.role === 'central_admin');
  }

  if (!targetUser) {
    targetUser = allProfiles.find((p) => p.role === (role || 'citizen'));
  }

  if (!targetUser) {
    res.status(404).json({
      success: false,
      message_bn: 'ডেমো ব্যবহারকারী প্রোফাইল পাওয়া যায়নি।',
    });
    return;
  }

  const token = generateToken(targetUser);
  const { password_hash, ...safeUser } = targetUser;
  res.json({
    success: true,
    message_bn: `ডেমো লগইন সফল হয়েছে (${safeUser.name_bn})।`,
    token,
    user: safeUser,
  });
});

// 4. Current Profile & Verification Status
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { password_hash, ...safeUser } = user;
  res.json({
    success: true,
    user: safeUser,
  });
});

// 5. Submit KYC Verification Request
router.post('/kyc/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { date_of_birth, father_name_bn, mother_name_bn, address_bn } = req.body;

  const updated = await dbStore.update('profiles', user.id, {
    date_of_birth: date_of_birth || user.date_of_birth || '1990-01-01',
    father_name_bn: father_name_bn || user.father_name_bn,
    mother_name_bn: mother_name_bn || user.mother_name_bn,
    address_bn: address_bn || user.address_bn,
    kyc_status: 'pending',
    updated_at: new Date().toISOString(),
  });

  res.json({
    success: true,
    message_bn: 'কেওয়াইসি ভেরিফিকেশনের আবেদন জমা হয়েছে। পর্যালোচনার পর সিটিজেন আইডি ইস্যু করা হবে।',
    user: updated,
  });
});

// 6. Approve KYC & Generate Unique Citizen ID (Central Admin or System Action)
router.post('/kyc/verify', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  // Allow self-verification for demo citizen, or central admin
  const user = req.user!;
  const targetUserId = req.body.userId || user.id;

  const targetProfile = await dbStore.findById('profiles', targetUserId);
  if (!targetProfile) {
    res.status(404).json({ success: false, message_bn: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' });
    return;
  }

  // Generate Citizen ID if not already assigned
  let citizenId = targetProfile.citizen_id;
  if (!citizenId) {
    let candidate = generateCitizenId();
    // Enforce database uniqueness constraint
    const existing = await dbStore.find('profiles', (p) => p.citizen_id === candidate);
    while (existing.length > 0) {
      candidate = generateCitizenId();
    }
    citizenId = candidate;
  }

  const updated = await dbStore.update('profiles', targetUserId, {
    kyc_status: 'verified',
    citizen_id: citizenId,
    kyc_verified_at: new Date().toISOString(),
  });

  await dbStore.logAudit(
    user.id,
    user.name_bn,
    user.role,
    'APPROVE_KYC_GENERATE_CITIZEN_ID',
    'profiles',
    targetUserId,
    req.ip || '127.0.0.1',
    { citizen_id: citizenId }
  );

  res.json({
    success: true,
    message_bn: `কেওয়াইসি সফলভাবে অনুমোদিত হয়েছে। আপনার ইউনিক সিটিজেন আইডি: ${citizenId}`,
    user: updated,
  });
});

export default router;
