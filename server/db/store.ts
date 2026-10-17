import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppDatabaseSchema } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveDataDir(): string {
  if (process.env.DATA_DIR) {
    return path.resolve(process.env.DATA_DIR);
  }
  const cwdData = path.resolve(process.cwd(), 'data');
  if (fs.existsSync(cwdData)) {
    return cwdData;
  }
  const relDist = path.resolve(__dirname, '../../../data');
  if (fs.existsSync(relDist)) {
    return relDist;
  }
  const relServer = path.resolve(__dirname, '../../data');
  if (fs.existsSync(relServer)) {
    return relServer;
  }
  return cwdData;
}

const DATA_DIR = resolveDataDir();
const DB_FILE = path.join(DATA_DIR, 'db.json');

export const INITIAL_DB: AppDatabaseSchema = {
  profiles: [],
  land_parcels: [],
  land_ownerships: [],
  khatian_records: [],
  land_documents: [],
  khajna_accounts: [],
  tax_payments: [],
  tax_clearances: [],
  sale_applications: [],
  risk_assessments: [],
  office_reviews: [],
  registration_appointments: [],
  registration_records: [],
  mutation_applications: [],
  notifications: [],
  audit_logs: [],
};

class DatabaseStore {
  private memoryCache: AppDatabaseSchema | null = null;
  private isWriting = false;
  private writeQueue: (() => Promise<void>)[] = [];
  private transactionLock: Promise<void> = Promise.resolve();

  constructor() {
    this.ensureDataDir();
  }

  public async runTransaction<T>(action: () => Promise<T>): Promise<T> {
    const prevLock = this.transactionLock;
    let releaseLock: () => void;
    this.transactionLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    await prevLock;
    try {
      await this.getRaw();
      const result = await action();
      await this.persist();
      return result;
    } finally {
      releaseLock!();
    }
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  public async getRaw(): Promise<AppDatabaseSchema> {
    if (this.memoryCache) {
      return this.memoryCache;
    }

    if (!fs.existsSync(DB_FILE)) {
      this.memoryCache = JSON.parse(JSON.stringify(INITIAL_DB));
      await this.persist();
      return this.memoryCache!;
    }

    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      this.memoryCache = JSON.parse(data);
      return this.memoryCache!;
    } catch (err) {
      console.error('[DB] Failed reading db.json, initializing fresh store:', err);
      this.memoryCache = JSON.parse(JSON.stringify(INITIAL_DB));
      await this.persist();
      return this.memoryCache!;
    }
  }

  private async persist(): Promise<void> {
    if (!this.memoryCache) return;

    const doWrite = async () => {
      this.ensureDataDir();
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      try {
        fs.writeFileSync(tempFile, JSON.stringify(this.memoryCache, null, 2), 'utf-8');
        fs.renameSync(tempFile, DB_FILE);
      } catch (err) {
        if (fs.existsSync(tempFile)) {
          try { fs.unlinkSync(tempFile); } catch (_) {}
        }
        throw err;
      }
    };

    if (this.isWriting) {
      return new Promise<void>((resolve, reject) => {
        this.writeQueue.push(async () => {
          try {
            await doWrite();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    this.isWriting = true;
    try {
      await doWrite();
    } finally {
      this.isWriting = false;
      if (this.writeQueue.length > 0) {
        const next = this.writeQueue.shift();
        if (next) next();
      }
    }
  }

  public async get<K extends keyof AppDatabaseSchema>(collection: K): Promise<AppDatabaseSchema[K]> {
    const db = await this.getRaw();
    return db[collection] || ([] as any);
  }

  public async findById<K extends keyof AppDatabaseSchema>(
    collection: K,
    id: string
  ): Promise<any | null> {
    const items = await this.get(collection);
    return (items as any[]).find((item) => item.id === id) || null;
  }

  public async find<K extends keyof AppDatabaseSchema, T = any>(
    collection: K,
    predicate: (item: any) => boolean
  ): Promise<T[]> {
    const items = await this.get(collection);
    return (items as any[]).filter(predicate) as T[];
  }

  public async create<K extends keyof AppDatabaseSchema>(
    collection: K,
    item: any
  ): Promise<any> {
    const db = await this.getRaw();
    if (!db[collection]) {
      db[collection] = [] as any;
    }
    (db[collection] as any[]).push(item);
    await this.persist();
    return item;
  }

  public async update<K extends keyof AppDatabaseSchema>(
    collection: K,
    id: string,
    updates: Partial<any>
  ): Promise<any | null> {
    const db = await this.getRaw();
    const items = db[collection] as any[];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await this.persist();
    return items[index];
  }

  public async delete<K extends keyof AppDatabaseSchema>(
    collection: K,
    id: string
  ): Promise<boolean> {
    const db = await this.getRaw();
    const items = db[collection] as any[];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    items.splice(index, 1);
    await this.persist();
    return true;
  }

  public async seed(data: AppDatabaseSchema): Promise<void> {
    this.memoryCache = JSON.parse(JSON.stringify(data));
    await this.persist();
  }

  public async logAudit(
    userId: string,
    userNameBn: string,
    role: string,
    action: string,
    targetEntity: string,
    targetId: string,
    ip: string,
    details: Record<string, any>
  ): Promise<void> {
    const logItem = {
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      user_name_bn: userNameBn,
      user_role: role,
      action,
      target_entity: targetEntity,
      target_id: targetId,
      ip_address: ip,
      details,
      timestamp: new Date().toISOString(),
    };
    await this.create('audit_logs', logItem);
  }
}

export const dbStore = new DatabaseStore();
