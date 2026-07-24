// Wathin｜未止 — API: POST /api/boats/receive  v2.0.1
import type { NextApiRequest, NextApiResponse } from 'next';
import { userBoats } from './next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { boatId, deviceId } = req.body as { boatId: string; deviceId: string };
  const boat = userBoats.find((b) => b.id === boatId);

  // 目前展示用 seed 船不在記憶體中，仍允許接住。
  if (!boat) return res.status(200).json({ ok: true });

  // 已被接住或已離開河流時，不向使用者揭露原因。
  if (boat.status !== 'drifting' || boat.pickedBy !== null) {
    return res.status(200).json({ ok: false });
  }

  boat.status = 'held';
  boat.pickedBy = deviceId;
  return res.status(200).json({ ok: true });
}
