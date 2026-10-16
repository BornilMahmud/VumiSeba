import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import landRoutes from './routes/land.js';
import taxRoutes from './routes/tax.js';
import saleRoutes from './routes/sale.js';
import mutationRoutes from './routes/mutation.js';
import riskRoutes from './routes/risk.js';
import officerRoutes from './routes/officer.js';
import notificationRoutes from './routes/notifications.js';
import auditRoutes from './routes/audit.js';
import { dbStore } from './db/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health & Metadata Check
app.get('/api/health', async (req, res) => {
  const db = await dbStore.getRaw();
  res.json({
    status: 'ok',
    project: 'Bhumisathi (ভূমিসাথী)',
    tagline: 'Bangladesh Citizen Land Services, Ownership Verification, Smart Registry & e-Mutation Platform',
    version: '1.0.0-hackathon-mvp',
    database: {
      engine: 'Dual: Firebase Firestore Adapter + Persistent JSON Store',
      parcels_count: db.land_parcels.length,
      users_count: db.profiles.length,
      sales_count: db.sale_applications.length,
      mutations_count: db.mutation_applications.length,
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/land', landRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/sale', saleRoutes);
app.use('/api/mutation', mutationRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    message_bn: 'সার্ভারে অভ্যন্তরীণ ত্রুটি সংঘটিত হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏛️  Bhumisathi (ভূমিসাথী) LandTech Server Running`);
  console.log(`🚀 Port: http://localhost:${PORT}`);
  console.log(`📦 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

export default app;
