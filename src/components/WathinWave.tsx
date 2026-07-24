// Wathin｜未止 — WathinWave logo mark  v2.0.0
// 同時象徵：字母W、水波、紙船航跡、傳訊留下的軌跡
'use client';
import { useState, useEffect } from 'react';

interface Props { w?: number; a?: number; sw?: number; breathing?: boolean; }

export default function WathinWave({ w = 48, a = 0.65, sw = 2.1, breathing = false }: Props) {
  const [breathe, setBreathe] = useState(1);
  useEffect(() => {
    if (!breathing) return;
    let raf: number; const t0 = Date.now();
    const loop = () => {
      const t = (Date.now() - t0) / 1000;
      setBreathe(0.85 + Math.sin(t * (2 * Math.PI / 10)) * 0.15);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [breathing]);

  return (
    <svg width={w} height={Math.round(w * 0.38)} viewBox="0 0 80 30" fill="none" style={{ display: 'block' }}>
      <path d="M3 18 Q10 3 18 18 Q26 33 34 18 Q42 3 50 18 Q58 33 66 18 Q72 8 79 12"
        stroke={`rgba(207,232,255,${a * breathe})`} strokeWidth={sw} fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
