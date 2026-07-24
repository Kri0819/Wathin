// Wathin｜未止 — API: POST /api/boats/create  v2.0.1
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { validateMessage } from '@/lib/safety';
import { userBoats } from './next';
import type { Boat } from '@/lib/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body as { message: string };
  const v = validateMessage(message);
  if (!v.ok) return res.status(400).json({ error: v.reason });

  const now = Date.now();
  const boat: Boat = {
    id: uuidv4(),
    message: message.trim(),
    createdAt: now,
    expiresAt: now + 72 * 3_600_000,
    status: 'drifting',
    pickedBy: null,
  };
  userBoats.push(boat);
  return res.status(201).json(boat);
}
