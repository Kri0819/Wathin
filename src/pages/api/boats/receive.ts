// Wathin｜未止 — API: POST /api/boats/receive  v2.0.0
import type { NextApiRequest, NextApiResponse } from 'next';
import { userBoats } from './next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { boatId, deviceId } = req.body as { boatId: string; deviceId: string };
  const boat = userBoats.find((b) => b.id === boatId);
  if (!boat) return res.status(200).json({ ok: true });
  if (boat.status !== 'drifting' || boat.pickedBy !== null) {
    return res.status(409).json({ error: '這艘船已經被接住了。' });
  }
  boat.status = 'held';
  boat.pickedBy = deviceId;
  return res.status(200).json({ ok: true });
}
