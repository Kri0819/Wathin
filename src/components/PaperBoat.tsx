// Wathin｜未止 — PaperBoat  v2.0.0
// 三態：靜止 / 漂浮 / 被接住(發光)
interface PaperBoatProps {
  size?: number;
  state?: 'still' | 'drift' | 'received';
  showReflection?: boolean;
}

export function PaperBoat({ size = 120, state = 'drift', showReflection = true }: PaperBoatProps) {
  const isReceived = state === 'received';
  const isStill = state === 'still';
  const baseOpacity = isStill ? 0.55 : 1;

  const filter = isReceived
    ? 'drop-shadow(0 0 24px rgba(207,232,255,1.0)) drop-shadow(0 0 10px rgba(255,255,255,0.7)) drop-shadow(0 4px 16px rgba(0,0,0,0.4))'
    : `drop-shadow(0 10px 38px rgba(0,0,0,${0.78 * baseOpacity})) drop-shadow(0 2px 8px rgba(0,0,0,${0.5 * baseOpacity}))`;

  const svgH = showReflection ? 130 : 75;

  return (
    <svg width={size} height={size * (svgH / 120)} viewBox={`0 0 120 ${svgH}`} fill="none"
      style={{ display: 'block', overflow: 'visible', filter, opacity: baseOpacity,
        transition: 'filter 0.6s ease, opacity 0.6s ease' }}>

      <path d="M 42 8 L 88 60 L 42 60 Z" fill="rgba(248,252,255,0.96)" stroke="rgba(207,232,255,0.20)" strokeWidth="0.4" />
      <path d="M 42 8 L 42 60 L 52 60 Z" fill="rgba(180,215,245,0.18)" />
      <path d="M 68 24 L 88 60 L 75 60 Z" fill="rgba(255,255,255,0.12)" />
      <line x1="42" y1="8" x2="42" y2="62" stroke="rgba(207,232,255,0.55)" strokeWidth="0.9" strokeLinecap="round" />

      <path d="M 18 62 L 96 62 Q 96 66 78 70 L 57 74 L 36 70 Q 18 66 18 62 Z"
        fill="rgba(248,252,255,0.97)" stroke="rgba(207,232,255,0.18)" strokeWidth="0.4" />
      <path d="M 18 62 L 42 62 L 42 63 L 36 70 Q 18 66 18 62 Z" fill="rgba(185,218,245,0.30)" />
      <path d="M 42 62 L 96 62 Q 96 66 78 70 L 57 74 L 42 63 Z" fill="rgba(240,250,255,0.15)" />
      <line x1="42" y1="62" x2="57" y2="74" stroke="rgba(180,210,240,0.35)" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="18" y1="62" x2="96" y2="62" stroke="rgba(207,232,255,0.20)" strokeWidth="0.5" />

      {showReflection && (
        <>
          <ellipse cx="57" cy="74.5" rx="42" ry="4" fill="rgba(207,232,255,0.08)" />
          <g>
            <path d="M 24 79 Q 42 82 57 81 Q 72 82 90 79 Q 85 84 57 87 Q 29 84 24 79 Z" fill="rgba(207,232,255,0.07)" />
            <path d="M 42 76 L 57 81 L 42 81 Z" fill="rgba(207,232,255,0.05)" />
            <line x1="22" y1="78"  x2="92" y2="78"  stroke="rgba(207,232,255,0.14)" strokeWidth="0.75" />
            <line x1="24" y1="82"  x2="90" y2="82"  stroke="rgba(207,232,255,0.10)" strokeWidth="0.68" />
            <line x1="27" y1="86"  x2="87" y2="86"  stroke="rgba(207,232,255,0.07)" strokeWidth="0.60" />
            <line x1="31" y1="90"  x2="83" y2="90"  stroke="rgba(207,232,255,0.05)" strokeWidth="0.52" />
            <line x1="35" y1="94"  x2="79" y2="94"  stroke="rgba(207,232,255,0.035)" strokeWidth="0.46" />
            <line x1="39" y1="98"  x2="75" y2="98"  stroke="rgba(207,232,255,0.022)" strokeWidth="0.40" />
          </g>
        </>
      )}
    </svg>
  );
}

export function PaperBoatMini({ size = 54, fade = 1 }: { size?: number; fade?: number }) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 120 130" fill="none"
      style={{ display: 'block', filter: `drop-shadow(0 4px 16px rgba(0,0,0,${0.72 * fade}))`, opacity: fade }}>
      <path d="M 42 8 L 88 60 L 42 60 Z" fill="rgba(248,252,255,0.94)" stroke="rgba(207,232,255,0.15)" strokeWidth="0.4" />
      <path d="M 42 8 L 42 60 L 52 60 Z" fill="rgba(180,215,245,0.16)" />
      <line x1="42" y1="8" x2="42" y2="62" stroke="rgba(207,232,255,0.52)" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 18 62 L 96 62 Q 96 66 78 70 L 57 74 L 36 70 Q 18 66 18 62 Z" fill="rgba(248,252,255,0.96)" stroke="rgba(207,232,255,0.15)" strokeWidth="0.4" />
      <path d="M 18 62 L 42 62 L 42 63 L 36 70 Q 18 66 18 62 Z" fill="rgba(185,218,245,0.26)" />
      <line x1="42" y1="62" x2="57" y2="74" stroke="rgba(180,210,240,0.30)" strokeWidth="0.6" strokeLinecap="round" />
      <ellipse cx="57" cy="74.5" rx="42" ry="4" fill="rgba(207,232,255,0.07)" />
      <line x1="22" y1="78" x2="92" y2="78" stroke="rgba(207,232,255,0.12)" strokeWidth="0.75" />
      <line x1="25" y1="83" x2="89" y2="83" stroke="rgba(207,232,255,0.08)" strokeWidth="0.65" />
      <line x1="29" y1="88" x2="85" y2="88" stroke="rgba(207,232,255,0.05)" strokeWidth="0.56" />
    </svg>
  );
}
