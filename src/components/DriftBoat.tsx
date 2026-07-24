// Wathin｜未止 — DriftBoat  v2.0.0
// 船自右向左緩慢漂流，非常緩慢
'use client';
import { useEffect, useRef, useState } from 'react';
import { PaperBoat } from './PaperBoat';

interface Props { onTap: () => void; onExit: () => void; }

export default function DriftBoat({ onTap, onExit }: Props) {
  const [pos, setPos] = useState({ x: -220, y: 0, rot: 0, op: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const spd = 0.16 + Math.random() * 0.12;
    const by = window.innerHeight * (0.50 + Math.random() * 0.08) - 70;
    let x = -220, ph = Math.random() * Math.PI * 2;
    const go = () => {
      x += spd; ph += 0.008;
      const y = by + Math.sin(ph) * 9 + Math.cos(ph * 0.55) * 4;
      const rot = Math.sin(ph * 0.55) * 2.4;
      const W = window.innerWidth;
      const fi = Math.min(1, (x + 220) / 180);
      const fo = Math.min(1, Math.max(0, (W + 200 - x) / 180));
      setPos({ x, y, rot, op: Math.max(0, fi * fo) });
      if (x > W + 220) { onExit(); return; }
      raf.current = requestAnimationFrame(go);
    };
    go();
    return () => cancelAnimationFrame(raf.current);
  }, [onExit]);

  return (
    <div onClick={onTap} style={{
      position: 'absolute', left: pos.x, top: pos.y,
      transform: `rotate(${pos.rot}deg) translateX(-50%)`,
      opacity: pos.op, cursor: 'pointer', zIndex: 10,
      padding: 30, margin: -30, willChange: 'transform,opacity',
    }}>
      <PaperBoat size={130} state="drift" showReflection />
    </div>
  );
}
