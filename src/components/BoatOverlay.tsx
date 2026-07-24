// Wathin｜未止 — BoatOverlay  v2.0.1
// 浮層出現：從下方浮起，淡入+位移；浮層半透明，背景仍可見河流
'use client';
import { useState, useEffect } from 'react';
import { PaperBoat } from './PaperBoat';
import WathinWave from './WathinWave';
import { COLOR, FONT_BODY, SP } from '@/lib/tokens';

interface Props {
  text: string;
  shoreCount: number;
  onReceive: () => void;
  onClose: () => void;
}

export default function BoatOverlay({ text, shoreCount, onReceive, onClose }: Props) {
  const [vis, setVis] = useState(false);
  const [out, setOut] = useState(false);
  const [receivedGlow, setReceivedGlow] = useState(false);

  useEffect(() => { const t = setTimeout(() => setVis(true), 18); return () => clearTimeout(t); }, []);
  const close = () => { setOut(true); setTimeout(onClose, 300); };
  const handleReceive = () => { setReceivedGlow(true); setTimeout(onReceive, 420); };
  const full = shoreCount >= 3;

  return (
    <div onClick={close} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2,8,18,0.74)',
      backdropFilter: 'blur(16px) brightness(0.68) saturate(1.25)',
      WebkitBackdropFilter: 'blur(16px) brightness(0.68) saturate(1.25)',
      opacity: vis && !out ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: `linear-gradient(168deg, ${COLOR.navy}F8 0%, ${COLOR.deepBlue}FC 100%)`,
        border: '1px solid rgba(207,232,255,0.10)',
        borderRadius: 28,
        padding: `${SP.lg + 2}px ${SP.lg + 2}px ${SP.lg}px`,
        width: 'min(348px,90vw)',
        position: 'relative',
        boxShadow: '0 36px 110px rgba(0,0,0,0.85),inset 0 1px 0 rgba(207,232,255,0.09)',
        transform: vis && !out ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.94)',
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: SP.base }}>
          <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
            <path d="M5 9.5 L13 4 L21 9.5" stroke="rgba(159,182,204,0.28)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: SP.lg - 2 }}>
          <WathinWave w={46} a={0.44} sw={1.9} breathing />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: SP.lg }}>
          <PaperBoat size={88} state={receivedGlow ? 'received' : 'drift'} showReflection={false} />
        </div>

        <p data-protected-message="true" onContextMenu={e => e.preventDefault()} style={{
          fontFamily: FONT_BODY, fontSize: 20, fontWeight: 300,
          lineHeight: 1.85, color: COLOR.text, textAlign: 'center',
          margin: `0 0 ${SP.lg}px`, letterSpacing: '0.025em', whiteSpace: 'pre-wrap',
        }}>{text}</p>

        <div style={{ height: 1, marginBottom: SP.base + 2, background: 'linear-gradient(90deg,transparent,rgba(207,232,255,0.11),transparent)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {full ? (
            <p style={{ textAlign: 'center', padding: `${SP.md}px 0`, fontFamily: FONT_BODY, fontSize: 13, color: 'rgba(159,182,204,0.44)', letterSpacing: '0.10em' }}>
              岸邊暫時滿了。
            </p>
          ) : (
            <button onClick={handleReceive} disabled={receivedGlow} style={{
              width: '100%', padding: '15px 0',
              background: `linear-gradient(135deg, ${COLOR.blue}F0, ${COLOR.navy}F8)`,
              border: '1.5px solid rgba(207,232,255,0.28)',
              borderRadius: 100,
              color: 'rgba(207,232,255,0.97)',
              fontFamily: FONT_BODY, fontSize: 16, letterSpacing: '0.13em',
              cursor: receivedGlow ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.sm + 2,
              boxShadow: '0 4px 26px rgba(9,36,86,0.65),inset 0 1px 0 rgba(207,232,255,0.16)',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { if (!receivedGlow) { e.currentTarget.style.borderColor = 'rgba(207,232,255,0.56)'; e.currentTarget.style.boxShadow = '0 4px 38px rgba(9,36,86,0.85),inset 0 1px 0 rgba(207,232,255,0.24)'; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(207,232,255,0.28)'; e.currentTarget.style.boxShadow = '0 4px 26px rgba(9,36,86,0.65),inset 0 1px 0 rgba(207,232,255,0.16)'; }}>
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M4.5 13 Q3 9 5.5 7.5 L5.5 5.5 Q5.5 4.5 6.5 4.5 Q7.5 4.5 7.5 5.5 L7.5 9.5 Q8.5 8.5 10 8.5 Q11.5 8.5 11.5 10 Q12.5 9.5 13.5 10 Q14.5 10.6 14.5 11.5 Q15.5 11.2 16.2 12 Q17 12.8 16.5 14 L15.5 16.5 Q14.5 18.5 12.5 18.5 L8 18.5 Q6 18.5 5 16.5 Z"
                  stroke="rgba(207,232,255,0.85)" strokeWidth="1.1" fill="none" strokeLinejoin="round" />
              </svg>
              {receivedGlow ? '接住了' : '接住它'}
            </button>
          )}

          <button onClick={close} style={{
            width: '100%', padding: `${SP.md}px 0`,
            background: 'transparent', border: 'none',
            color: 'rgba(159,182,204,0.58)',
            fontFamily: FONT_BODY, fontSize: 15, letterSpacing: '0.10em',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.sm + 1,
            transition: 'color 0.16s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(159,182,204,0.88)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(159,182,204,0.58)')}>
            <svg width="19" height="12" viewBox="0 0 22 13" fill="none">
              <path d="M1 7 Q4.5 1.5 8 7 Q11.5 12.5 15 7 Q17.5 4 21 5.5" stroke="rgba(159,182,204,0.54)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            讓它繼續漂流
          </button>
        </div>

        <button onClick={close} style={{
          position: 'absolute', bottom: -58, left: '50%', transform: 'translateX(-50%)',
          width: 44, height: 44, borderRadius: '50%',
          background: `${COLOR.navy}F0`,
          border: '1px solid rgba(207,232,255,0.14)',
          color: 'rgba(159,182,204,0.54)', fontSize: 19, lineHeight: 1,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(0,0,0,0.44)',
          transition: 'border-color 0.16s,color 0.16s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(207,232,255,0.42)'; e.currentTarget.style.color = 'rgba(207,232,255,0.80)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(207,232,255,0.14)'; e.currentTarget.style.color = 'rgba(159,182,204,0.54)'; }}>×</button>
      </div>
    </div>
  );
}
