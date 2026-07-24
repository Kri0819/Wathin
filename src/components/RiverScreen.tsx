// Wathin｜未止 — RiverScreen  v2.0.0
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
    if (!river.boat) return;
    const now = Date.now();
    const shoreBoat: ShoreBoat = { id: river.boat.id, text: river.boat.message, at: now, exp: now + 36 * 3_600_000 };
    const ok = pushShore(shoreBoat);
    setOpen(false);
    if (ok) {
      fetch('/api/boats/receive', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boatId: river.boat.id, deviceId: getDeviceId() }),
      }).catch(() => {});
      refreshShore();
      river.received();
    } else river.dismiss();
  };
  const dismiss = () => { setOpen(false); river.dismiss(); };

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Logo */}
      <div style={{ position: 'absolute', top: `calc(env(safe-area-inset-top,0px) + ${SP.xxl - 4}px)`, left: SP.lg + 2, zIndex: 20, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.md - 1, marginBottom: SP.sm + 1 }}>
          <span style={{ fontFamily: FONT_LOGO, fontSize: 33, fontWeight: 300, color: 'rgba(245,249,255,0.96)', letterSpacing: '0.055em', textShadow: '0 0 64px rgba(207,232,255,0.26),0 2px 28px rgba(0,0,0,0.65)' }}>Wathin</span>
          <span style={{ fontFamily: FONT_LOGO, color: 'rgba(159,182,204,0.34)', fontSize: 25, fontWeight: 200 }}>|</span>
          <span style={{ fontFamily: FONT_BODY, fontSize: 26, fontWeight: 300, color: 'rgba(245,249,255,0.94)', letterSpacing: '0.17em', textShadow: '0 0 64px rgba(207,232,255,0.22),0 2px 28px rgba(0,0,0,0.65)' }}>未止</span>
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(159,182,204,0.52)', letterSpacing: '0.20em', margin: 0 }}>把一句話放進河裡。</p>
      </div>

      {river.boat && !open && (
        <div style={{ opacity: appeared ? 1 : 0, transition: 'opacity 1.1s ease' }}>
          <DriftBoat key={river.boat.id} onTap={() => setOpen(true)} onExit={river.exit} />
        </div>
      )}

      {river.boat && !open && (
        <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom,0px) + 100px)', left: 0, right: 0, textAlign: 'center', zIndex: 15, pointerEvents: 'none' }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(159,182,204,0.40)', letterSpacing: '0.20em', marginBottom: SP.sm + 2 }}>點擊紙船，看看今天遇見的話</p>
          <div style={{ width: 36, height: 1, margin: '0 auto', background: 'linear-gradient(90deg,transparent,rgba(207,232,255,0.30),transparent)' }} />
        </div>
      )}

      <NavBar onShore={() => onNavigate('shore')} onCreate={() => onNavigate('create')} shoreCount={shoreCount} />

      {open && river.boat && <BoatOverlay text={river.boat.message} shoreCount={shoreCount} onReceive={receive} onClose={dismiss} />}
    </div>
  );
}
