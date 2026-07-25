'use client';
import { useMemo } from 'react';
import { PaperBoat } from './PaperBoat';
import { BOAT } from '@/design-system/boat';

interface Props { onTap: () => void; onExit: () => void; }

export default function DriftBoat({ onTap, onExit }: Props) {
  const motion = useMemo(() => ({
    top: `${45 + Math.random() * 6}%`,
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
        <span className="boat-water-contact" />
        <span className="boat-water-lap boat-water-lap-a" />
        <span className="boat-water-lap boat-water-lap-b" />
      </span>
      <style>{`
        .drift-boat{position:absolute;left:-230px;z-index:12;width:230px;height:180px;padding:0;border:0;background:transparent;cursor:pointer;opacity:0;animation-name:boat-crossing;animation-timing-function:linear;animation-fill-mode:forwards;will-change:transform,opacity}
        .drift-float{position:relative;display:flex;align-items:center;justify-content:center;animation:boat-floating 4.2s ease-in-out infinite;will-change:transform}
        .boat-ripple{position:absolute;left:50%;top:64%;height:7px;border:1px solid rgba(207,232,255,.18);border-left-color:transparent;border-right-color:transparent;border-radius:50%;transform:translate(-50%,-50%);animation:ripple-breathe 4.2s ease-in-out infinite}
        .drift-float>.paper-boat-asset{width:clamp(148px,15vw,220px)!important;height:clamp(110px,11.1vw,163px)!important}.boat-ripple-one{width:clamp(156px,17vw,244px)}.boat-ripple-two{width:clamp(116px,13vw,186px);animation-delay:-1.1s;opacity:.55}
        .boat-water-contact{position:absolute;z-index:4;left:50%;top:49%;width:clamp(126px,13vw,190px);height:16px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,rgba(0,8,23,.62) 0%,rgba(3,26,55,.38) 48%,transparent 72%);filter:blur(2.5px);pointer-events:none}
        .boat-water-lap{position:absolute;z-index:5;left:50%;top:49%;height:7px;border-top:1.3px solid rgba(191,225,249,.38);border-radius:50%;filter:drop-shadow(0 0 4px rgba(120,188,235,.22));pointer-events:none;animation:water-lap 4.2s ease-in-out infinite}
        .boat-water-lap-a{width:clamp(138px,14vw,205px);transform:translateX(-54%) rotate(-1deg)}.boat-water-lap-b{width:clamp(92px,10vw,148px);transform:translateX(-38%) rotate(1deg);animation-delay:-1.8s;opacity:.56}
        @keyframes boat-crossing{0%{transform:translateX(0) scale(.72);opacity:0}8%{opacity:.38}19%{opacity:1}82%{opacity:1}94%{opacity:.42}100%{transform:translateX(calc(100vw + 380px)) scale(1.02);opacity:0}}
        @keyframes boat-floating{0%,100%{transform:translateY(5px) rotate(-1.7deg)}48%{transform:translateY(-5px) rotate(1.9deg)}72%{transform:translateY(-1px) rotate(.4deg)}}
        @keyframes ripple-breathe{0%,100%{transform:translate(-50%,-50%) scaleX(.82);opacity:.12}50%{transform:translate(-50%,-50%) scaleX(1.08);opacity:.3}}
        @keyframes water-lap{0%,100%{margin-top:1px;opacity:.26;scale:.92 1}50%{margin-top:-2px;opacity:.62;scale:1.06 1}}
        @media(max-width:480px){.drift-boat{left:-180px;width:168px;height:145px}.drift-float>.paper-boat-asset{width:${BOAT.mobileScale}px!important;height:${Math.round(BOAT.mobileScale * .74)}px!important}.boat-ripple-one{width:150px}.boat-ripple-two{width:112px}.boat-water-contact{width:112px}.boat-water-lap-a{width:124px}.boat-water-lap-b{width:84px}}
        @media(prefers-reduced-motion:reduce){.drift-boat{left:50%;transform:translateX(-50%);opacity:1;animation:none}.drift-float,.boat-ripple{animation:none}}
      `}</style>
    </button>
  );
}
