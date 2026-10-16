import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../db/store.js';
import { UserProfile, UserRole } from '../db/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bhumisathi-super-secret-jwt-key-2026-bangladesh';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export function generateToken(user: UserProfile): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name_bn: user.name_bn,
      citizen_id: user.citizen_id,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message_bn: 'অননুমোদিত প্রবেশাধিকার। অনুগ্রহ করে প্রথমে লগইন করুন।',
      error: 'Unauthorized',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await dbStore.findById('profiles', decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message_bn: 'ব্যবহারকারী অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।',
        error: 'User not found',
      });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message_bn: 'লগইন সেশন মেয়াদোত্তীর্ণ বা অকার্যকর। পুনরায় লগইন করুন।',
      error: 'Invalid token',
    });
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message_bn: 'প্রথমে লগইন সম্পন্ন করতে হবে।',
        error: 'Unauthorized',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message_bn: 'এই কার্যক্রম পরিচালনার জন্য আপনার প্রয়োজনীয় সরকারি অনুমোদন বা ভূমিকা নেই।',
        error: 'Forbidden: Insufficient role permissions',
      });
      return;
    }

    next();
  };
}
