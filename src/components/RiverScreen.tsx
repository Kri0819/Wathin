// Wathin｜未止 — RiverScreen  v2.1.0
// 大量留白，聚焦船與文字；整體視覺乾淨、安靜
'use client';
import { useEffect, useState } from 'react';
import DriftBoat from './DriftBoat';
import BoatOverlay from './BoatOverlay';
import NavBar from './NavBar';
import { useRiver } from '@/hooks/useRiver';
import { pushShore, getDeviceId } from '@/lib/storage';
import { FONT_LOGO, FONT_BODY, SP } from '@/lib/tokens';
import type { Screen, ShoreBoat } from '@/lib/types';

interface Props {
  onNavigate: (s: Screen) => void;
  shoreCount: number;
  refreshShore: () => void;
}

export default function RiverScreen({ onNavigate, shoreCount, refreshShore }: Props) {
  const river = useRiver();
  const [open, setOpen] = useState(false);
  const [appeared, setAppeared] = useState(false);

  useEffect(() => { river.start(); }, []); // eslint-disable-line
  useEffect(() => {
    if (river.boat) { setAppeared(false); const t = setTimeout(() => setAppeared(true), 60); return () => clearTimeout(t); }
  }, [river.boat]);

  const receive = async () => {
    if (!river.boat || shoreCount >= 3) return;

    const currentBoat = river.boat;
    setOpen(false);

    try {
      const response = await fetch('/api/boats/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boatId: currentBoat.id, deviceId: getDeviceId() }),
      });
      const result = (await response.json()) as { ok?: boolean };

      // 若船已離開河流，畫面只安靜換成下一艘，不揭露原因。
      if (!response.ok || !result.ok) {
        river.dismiss();
        return;
      }

      const now = Date.now();
      const shoreBoat: ShoreBoat = {
        id: currentBoat.id,
        text: currentBoat.message,
        at: now,
        exp: now + 36 * 3_600_000,
      };

      if (pushShore(shoreBoat)) {
        refreshShore();
        river.received();
      } else {
        river.dismiss();
      }
    } catch {
      river.dismiss();
    }
  };
  const dismiss = () => { setOpen(false); river.dismiss(); };

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: `calc(env(safe-area-inset-top,0px) + ${SP.xxl + 4}px)`, left: 0, right: 0, zIndex: 20, pointerEvents: 'none', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: SP.md - 2, marginBottom: SP.sm + 1 }}>
          <span style={{ fontFamily: FONT_LOGO, fontSize: 'clamp(31px,3vw,43px)', fontWeight: 300, color: 'rgba(245,249,255,0.97)', letterSpacing: '0.11em', textShadow: '0 0 52px rgba(207,232,255,0.25),0 2px 26px rgba(0,0,0,0.72)' }}>Wathin</span>
          <span style={{ fontFamily: FONT_LOGO, color: 'rgba(207,232,255,0.46)', fontSize: 24, fontWeight: 200 }}>|</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(24px,2.5vw,36px)', fontWeight: 300, color: 'rgba(245,249,255,0.95)', letterSpacing: '0.19em', textShadow: '0 0 52px rgba(207,232,255,0.22),0 2px 26px rgba(0,0,0,0.72)' }}>未止</span>
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(12px,1.1vw,15px)', color: 'rgba(207,232,255,0.64)', letterSpacing: '0.22em', margin: 0 }}>把一句話放進河裡。</p>
      </div>

      {river.boat && !open && (
        <div style={{ opacity: appeared ? 1 : 0, transition: 'opacity 1.1s ease' }}>
          <DriftBoat key={river.boat.id} onTap={() => setOpen(true)} onExit={river.exit} />
        </div>
      )}

      {river.boat && !open && (
        <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom,0px) + 100px)', left: 0, right: 0, textAlign: 'center', zIndex: 15, pointerEvents: 'none' }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(12px,1.15vw,15px)', color: 'rgba(207,232,255,0.58)', letterSpacing: '0.20em', lineHeight: 1.9, marginBottom: SP.sm + 2 }}>輕觸紙船，<br />讀一則船訊。</p>
          <div style={{ width: 42, height: 1, margin: '0 auto', background: 'linear-gradient(90deg,transparent,rgba(207,232,255,0.48),transparent)', boxShadow: '0 0 10px rgba(207,232,255,.18)' }} />
        </div>
      )}

      <NavBar active="river" onNavigate={onNavigate} shoreCount={shoreCount} />

      {open && river.boat && <BoatOverlay text={river.boat.message} shoreCount={shoreCount} onReceive={receive} onClose={dismiss} />}
    </div>
  );
}
