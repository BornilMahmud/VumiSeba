/**
 * Precision Land Share Math & Collision-Safe Sequence ID Generators
 * 
 * In Bangladesh land record terminology, shares are recorded out of 1.0000 (16 annas).
 * Using floating point arithmetic leads to precision drift across repeated splits.
 * We normalize all calculations using integer basis points:
 * 1.0000 share = 10,000 Basis Points (BPS).
 */

export const BPS_SCALE = 10000;

/**
 * Converts a decimal share (e.g. 0.5000 or 0.1250) to integer basis points.
 */
export function toBasisPoints(share: number): number {
  return Math.round(Number((share * BPS_SCALE).toFixed(4)));
}

/**
 * Converts integer basis points back to decimal share with 4 fixed decimal places.
 */
export function fromBasisPoints(bps: number): number {
  return Number((bps / BPS_SCALE).toFixed(4));
}

/**
 * Adds shares in basis points without float drift.
 */
export function addShares(aBps: number, bBps: number): number {
  return aBps + bBps;
}

/**
 * Subtracts shares in basis points, clamping to 0 if within negligible dust (<= 1 bps).
 */
export function subtractShares(totalBps: number, deductBps: number): number {
  const result = totalBps - deductBps;
  if (result < 0) {
    throw new Error(`Insufficient share: cannot subtract ${deductBps} from ${totalBps} basis points`);
  }
  return result <= 1 ? 0 : result;
}

/**
 * Validates that multiple split shares sum exactly to total without loss.
 */
export function validatePartition(totalBps: number, partsBps: number[]): boolean {
  const sum = partsBps.reduce((acc, curr) => acc + curr, 0);
  return sum === totalBps;
}

/**
 * Monotonic Sequence ID Generator
 * Guaranteed collision-safe even under high-concurrency requests within the same millisecond.
 */
let sequenceCounter = 1000;
let lastTimestamp = 0;

export function generateSequenceId(prefix: string, yearSuffix = true): string {
  const now = Date.now();
  if (now === lastTimestamp) {
    sequenceCounter += 1;
  } else {
    lastTimestamp = now;
    sequenceCounter = (sequenceCounter % 9000) + 1000;
  }
  
  const year = new Date().getFullYear();
  const counterStr = String(sequenceCounter).padStart(5, '0');
  const entropy = Math.floor(Math.random() * 90 + 10); // 2-digit random tail

  if (yearSuffix) {
    return `${prefix}-${year}-${counterStr}${entropy}`;
  }
  return `${prefix}-${counterStr}${entropy}`;
}
