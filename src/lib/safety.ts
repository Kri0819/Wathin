// Wathin｜未止 — Content Safety  v2.0.0

const BLOCKED: RegExp[] = [
  /\d{8,}/,
  /[\w.+-]+@[\w-]+\.[a-z]{2,}/i,
  /https?:\/\//i,
  /www\.[a-z]/i,
  /@[\w.]+/,
  /line\.me|line\s*id/i,
  /instagram/i,
  /discord/i,
  /telegram|t\.me/i,
  /threads/i,
];

export function validateMessage(text: string): { ok: boolean; reason?: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false };
  if (trimmed.length > 120) return { ok: false, reason: '字太多了，讓它輕一點吧。' };
  for (const re of BLOCKED) {
    if (re.test(trimmed)) return { ok: false, reason: '未止不留下能找到彼此的線索。' };
  }
  return { ok: true };
}
