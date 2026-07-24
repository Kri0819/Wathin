// Wathin｜未止 — Types  v2.0.1

export type BoatStatus = 'drifting' | 'held' | 'expired';

export interface Boat {
  id: string;
  message: string;
  createdAt: number;
  expiresAt: number;
  status: BoatStatus;
  pickedBy: string | null;
}

export interface ShoreBoat {
  id: string;
  text: string;
  at: number;   // receivedAt
  exp: number;  // shoreExpiresAt
}

export type Screen = 'shore' | 'river' | 'message';
