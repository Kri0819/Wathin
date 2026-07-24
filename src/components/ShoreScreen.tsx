// Wathin｜未止 — ShoreScreen  v2.0.1
// 卡片式列表，層級清楚，顯示剩餘時間與進度條，最多收藏3則船訊
'use client';
import { useState, useEffect, useCallback } from 'react';
import { PaperBoatMini } from './PaperBoat';
import WathinWave from './WathinWave';
import NavBar from './NavBar';
import { loadShore, hoursLeft } from '@/lib/storage';
import { COLOR, FONT_BODY, SP } from '@/lib/tokens';
import type { ShoreBoat } from '@/lib/types';

interface Props { onNavigate: (screen: import('@/lib/types').Screen) => void; onUpdate: () => void; }

export default function ShoreScreen({ onNavigate, onUpdate }: Props) {
  const [boats, setBoats] = useState<ShoreBoat[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const refresh = useCallback(() => { const b = loadShore(); setBoats(b); onUpdate(); }, [onUpdate]);
  useEffect(() => { refresh(); const t = setInterval(refresh, 60_000); return () => clearInterval(t); }, [refresh]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: `linear-gradient(180deg, #010910 0%, ${COLOR.deepBlue} 44%, #0C2542 100%)`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ flexShrink: 0, paddingTop: `calc(env(safe-area-inset-top,0px)+${SP.xxl + 2}px)`, paddingBottom: SP.base, paddingLeft: SP.lg - 2, paddingRight: SP.lg - 2, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <h2 style={{ fontFamily: FONT_BODY, fontSize: 19, fontWeight: 400, color: 'rgba(245,249,255,0.95)', margin: 0, letterSpacing: '0.24em' }}>岸邊</h2>
          <p style={{ margin: '4px 0 0', fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(159,182,204,0.38)', letterSpacing: '0.08em' }}>{boats.length} / 3</p>
        </div>
      </div>

      <div style={{ height: 1, flexShrink: 0, marginBottom: SP.base, background: 'linear-gradient(90deg,transparent,rgba(207,232,255,0.11),transparent)' }} />

      <div style={{ flex: 1, padding: `0 ${SP.base}px calc(98px + env(safe-area-inset-bottom,0px))` }}>
        {boats.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 64, color: 'rgba(159,182,204,0.26)', fontFamily: FONT_BODY, fontSize: 13, letterSpacing: '0.14em', lineHeight: 2.6 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: SP.base }}><WathinWave w={36} a={0.14} sw={1.8} /></div>
            岸邊空著。<br />河流裡有些東西在等你。
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md - 2 }}>
          {[0, 1, 2].map(i => {
            const b = boats[i];
            if (!b) return (
              <div key={`e${i}`} style={{ height: 80, borderRadius: 16, border: '1px dashed rgba(14,50,100,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(14,50,100,0.38)', letterSpacing: '0.14em' }}>空</span>
              </div>
            );
            const prog = Math.min(1, (Date.now() - b.at) / (36 * 3_600_000));
            const fade = 1 - prog * 0.46;
            const isOpen = openId === b.id;
            return (
              <div key={b.id} onClick={() => setOpenId(isOpen ? null : b.id)}
                style={{ background: `linear-gradient(135deg, ${COLOR.navy}C7, #030C26DB)`, border: '1px solid rgba(207,232,255,0.08)', borderRadius: 16, padding: `${SP.md + 2}px ${SP.base}px`, cursor: 'pointer', opacity: fade, position: 'relative', overflow: 'hidden', transition: 'opacity 0.28s,border-color 0.16s', minHeight: 78 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(207,232,255,0.20)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(207,232,255,0.08)')}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: `${(1 - prog) * 100}%`, background: 'linear-gradient(90deg,rgba(207,232,255,0.38),rgba(207,232,255,0.04))', transition: 'width 60s linear' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
                  <div style={{ flexShrink: 0, width: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PaperBoatMini size={54} fade={fade} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 48 }}>
                    <p data-protected-message="true" onContextMenu={e => e.preventDefault()} style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: 'rgba(245,249,255,0.94)', margin: 0, lineHeight: 1.68, flex: 1, overflow: isOpen ? 'visible' : 'hidden', textOverflow: isOpen ? 'unset' : 'ellipsis', whiteSpace: isOpen ? 'normal' : 'nowrap', transition: 'all 0.26s' }}>{b.text.replace(/\n/g, ' ')}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: 'rgba(159,182,204,0.36)', fontFamily: 'monospace', letterSpacing: '0.04em', textAlign: 'right' }}>{hoursLeft(b.exp)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(159,182,204,0.17)', letterSpacing: '0.13em', lineHeight: 2.6, marginTop: SP.xl + 8 }}>每艘船都會在岸邊停留 36 小時，<br />然後永久消散。</p>
      </div>

      <NavBar active="shore" onNavigate={onNavigate} shoreCount={boats.length} />
    </div>
  );
}
