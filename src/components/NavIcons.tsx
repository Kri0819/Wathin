// Wathin｜未止 — NavIcons  v2.0.0
export function IconShore({ active = false }: { active?: boolean }) {
  const c1 = active ? 'rgba(207,232,255,0.92)' : 'rgba(159,182,204,0.46)';
  const c2 = active ? 'rgba(159,182,204,0.68)' : 'rgba(159,182,204,0.22)';
  const wl = active ? 'rgba(207,232,255,0.52)' : 'rgba(159,182,204,0.20)';
  return (
    <svg width="30" height="26" viewBox="0 0 58 50" fill="none">
      <path d="M2 37 Q15 31 29 37 Q43 43 56 37" stroke={wl} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M4 43 Q16 38 29 43 Q42 48 54 43" stroke={wl} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="16" cy="31" rx="14" ry="9" fill={c2} />
      <ellipse cx="16" cy="29" rx="11.5" ry="7" fill={c1} opacity="0.74" />
      <ellipse cx="13" cy="25.5" rx="4.5" ry="2.2" fill="rgba(245,252,255,0.14)" />
      <ellipse cx="40" cy="32" rx="11" ry="7.5" fill={c2} opacity="0.80" />
      <ellipse cx="40" cy="30" rx="8.8" ry="5.8" fill={c1} opacity="0.60" />
      <ellipse cx="29" cy="35" rx="5.8" ry="4" fill={c1} opacity="0.88" />
      <ellipse cx="51" cy="36" rx="4.2" ry="2.8" fill={c2} opacity="0.58" />
    </svg>
  );
}

export function IconBoat({ a = 0.54 }: { a?: number }) {
  return (
    <svg width="30" height="28" viewBox="0 0 120 105" fill="none">
      <path d="M 42 8 L 88 60 L 42 60 Z" fill={`rgba(245,250,255,${a})`} stroke={`rgba(207,232,255,${a*0.6})`} strokeWidth="0.6" />
      <line x1="42" y1="8" x2="42" y2="62" stroke={`rgba(207,232,255,${a*0.75})`} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 18 62 L 96 62 Q 96 66 78 70 L 57 74 L 36 70 Q 18 66 18 62 Z" fill={`rgba(245,250,255,${a*0.96})`} stroke={`rgba(207,232,255,${a*0.5})`} strokeWidth="0.5" />
    </svg>
  );
}
