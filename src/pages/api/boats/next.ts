// Wathin｜未止 — API: GET /api/boats/next  v2.0.0
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import type { Boat } from '@/lib/types';

const SEED_MESSAGES = [
  '我不知道為什麼\n今天的陽光讓我想哭。',
  '有些人走了，\n但佔的地方還在。',
  '我假裝沒事，\n但其實一直在等人問我好不好。',
  '這個城市很大，\n我卻覺得越來越小。',
  '我只是累了。\n不是不愛了，只是累了。',
  '說了再見，\n卻不知道再見是什麼意思。',
  '有些夜晚特別長。',
  '我很好，\n只是好像哪裡缺了一塊。',
  '時間真的會帶走一切嗎？\n還是只是帶走了記憶？',
  '我在練習一個人，\n但還沒學會。',
  '原來思念這件事，\n是沒有對象也可以發生的。',
  '我只是想有人說一句，\n你辛苦了。',
  '某些快樂是不能分享的，\n因為沒有人會懂。',
  '我把很多話都嚥了回去。',
];

let pointer = Math.floor(Math.random() * SEED_MESSAGES.length);
const userBoats: Boat[] = [];

function getNextBoat(): Boat {
  const now = Date.now();
  const available = userBoats.filter((b) => b.status === 'drifting' && b.expiresAt > now && b.pickedBy === null);
  if (available.length > 0) return available[0];
  pointer = (pointer + 1) % SEED_MESSAGES.length;
  return {
    id: `seed-${uuidv4()}`,
    message: SEED_MESSAGES[pointer],
    createdAt: now,
    expiresAt: now + 72 * 3_600_000,
    status: 'drifting',
    pickedBy: null,
  };
}

export { userBoats };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  return res.status(200).json(getNextBoat());
}
