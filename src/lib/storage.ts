// Wathin｜未止 — Storage helpers  v2.0.1
import { v4 as uuidv4 } from 'uuid';
import type { ShoreBoat } from './types';

const DEVICE_KEY = 'wathin_device_id';
const SHORE_KEY  = 'wathin_shore_v2';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) { id = uuidv4(); localStorage.setItem(DEVICE_KEY, id); }
  return id;
}

export function loadShore(): ShoreBoat[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SHORE_KEY);
    if (!raw) return [];
    const boats: ShoreBoat[] = JSON.parse(raw);
    const now = Date.now();
    return boats.filter((b) => b.exp > now);
  } catch { return []; }
}

export function saveShore(boats: ShoreBoat[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHORE_KEY, JSON.stringify(boats));
}

export function pushShore(boat: ShoreBoat): boolean {
  const current = loadShore();
  if (current.length >= 3) return false;
  current.push(boat);
  saveShore(current);
  return true;
}

export function hoursLeft(exp: number): string {
  const h = Math.floor((exp - Date.now()) / 3_600_000);
  return h <= 0 ? '已消散' : `剩 ${h}h`;
}
