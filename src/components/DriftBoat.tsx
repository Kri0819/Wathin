'use client';
import { useMemo } from 'react';
import { PaperBoat } from './PaperBoat';
import { BOAT } from '@/design-system/boat';

interface Props { onTap: () => void; onExit: () => void; }

export default function DriftBoat({ onTap, onExit }: Props) {
  const motion = useMemo(() => ({
    top: `${50 + Math.random() * 8}%`,
    duration: `${BOAT.driftSecondsMin + Math.random() * (BOAT.driftSecondsMax - BOAT.driftSecondsMin)}s`,
    delay: `${Math.random() * 0.8}s`,
  }), []);

  return (
    <button type="button" aria-label="輕觸紙船，讀一則船訊" onClick={onTap} onAnimationEnd={event => {
      if (event.animationName === 'boat-crossing') onExit();
    }} className="drift-boat" style={{ top: motion.top, animationDuration: motion.duration, animationDelay: motion.delay }}>
      <span className="drift-float">
        <span className="boat-ripple boat-ripple-one" />
        <span className="boat-ripple boat-ripple-two" />
        <PaperBoat size={BOAT.desktopScale} state="drift" showReflection />
      </span>
      <style>{`
        .drift-boat{position:absolute;left:-230px;z-index:12;width:230px;height:180px;padding:0;border:0;background:transparent;cursor:pointer;opacity:0;animation-name:boat-crossing;animation-timing-function:linear;animation-fill-mode:forwards;will-change:transform,opacity}
        .drift-float{position:relative;display:flex;align-items:center;justify-content:center;animation:boat-floating 3.6s ease-in-out infinite;will-change:transform}
        .boat-ripple{position:absolute;left:50%;top:64%;height:7px;border:1px solid rgba(207,232,255,.18);border-left-color:transparent;border-right-color:transparent;border-radius:50%;transform:translate(-50%,-50%);animation:ripple-breathe 3.6s ease-in-out infinite}
        .drift-float>.paper-boat-asset{width:clamp(148px,15vw,220px)!important;height:clamp(110px,11.1vw,163px)!important}.boat-ripple-one{width:clamp(156px,17vw,244px)}.boat-ripple-two{width:clamp(116px,13vw,186px);animation-delay:-1.1s;opacity:.55}
        @keyframes boat-crossing{0%{transform:translateX(0) scale(.72);opacity:0}8%{opacity:.38}19%{opacity:1}82%{opacity:1}94%{opacity:.42}100%{transform:translateX(calc(100vw + 380px)) scale(1.02);opacity:0}}
        @keyframes boat-floating{0%,100%{transform:translateY(4px) rotate(-2deg)}50%{transform:translateY(-4px) rotate(2.2deg)}}
        @keyframes ripple-breathe{0%,100%{transform:translate(-50%,-50%) scaleX(.82);opacity:.12}50%{transform:translate(-50%,-50%) scaleX(1.08);opacity:.3}}
        @media(max-width:480px){.drift-boat{left:-180px;width:168px;height:145px}.drift-float>.paper-boat-asset{width:${BOAT.mobileScale}px!important;height:${Math.round(BOAT.mobileScale * .74)}px!important}.boat-ripple-one{width:150px}.boat-ripple-two{width:112px}}
        @media(prefers-reduced-motion:reduce){.drift-boat{left:50%;transform:translateX(-50%);opacity:1;animation:none}.drift-float,.boat-ripple{animation:none}}
      `}</style>
    </button>
  );
}
