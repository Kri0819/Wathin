import { useId } from 'react';
import { BOAT } from '@/design-system/boat';

interface PaperBoatProps {
  size?: number;
  state?: 'still' | 'drift' | 'received';
  showReflection?: boolean;
}

export function PaperBoat({ size = 132, state = 'drift', showReflection = true }: PaperBoatProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');
  const received = state === 'received';
  const still = state === 'still';
  const height = showReflection ? 118 : 82;

  return (
    <svg width={size} height={size * (height / 160)} viewBox={`0 0 160 ${height}`} fill="none" aria-hidden="true"
      style={{ display: 'block', overflow: 'visible', opacity: still ? 0.68 : 1,
        filter: received
          ? 'drop-shadow(0 0 22px rgba(207,232,255,.82)) drop-shadow(0 7px 18px rgba(0,0,0,.52))'
          : `drop-shadow(0 12px 22px rgba(0,0,0,${BOAT.shadowOpacity})) drop-shadow(0 2px 5px rgba(4,12,28,.72))`,
        transition: 'filter .55s ease, opacity .55s ease' }}>
      <defs>
        <linearGradient id={`${id}left`} x1="28" y1="38" x2="82" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9FBFC"/><stop offset=".55" stopColor="#D7E1E9"/><stop offset="1" stopColor="#AFC1D1"/>
        </linearGradient>
        <linearGradient id={`${id}right`} x1="132" y1="35" x2="77" y2="81" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="#E7EEF3"/><stop offset="1" stopColor="#B9CAD8"/>
        </linearGradient>
        <linearGradient id={`${id}center`} x1="80" y1="11" x2="80" y2="77" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF"/><stop offset=".62" stopColor="#E8EEF2"/><stop offset="1" stopColor="#BAC9D5"/>
        </linearGradient>
        <linearGradient id={`${id}hull`} x1="26" y1="67" x2="130" y2="88" gradientUnits="userSpaceOnUse">
          <stop stopColor="#BCCBD6"/><stop offset=".38" stopColor="#F4F7F9"/><stop offset=".72" stopColor="#D6E0E7"/><stop offset="1" stopColor="#8FA5B7"/>
        </linearGradient>
        <linearGradient id={`${id}reflection`} x1="80" y1="90" x2="80" y2="117" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CFE8FF" stopOpacity=".20"/><stop offset="1" stopColor="#CFE8FF" stopOpacity="0"/>
        </linearGradient>
      </defs>

      <ellipse cx="80" cy="80" rx="58" ry="8" fill="rgba(1,7,17,.54)" />
      <path d="M17 53 L80 77 L48 80 Z" fill={`url(#${id}left)`} stroke="rgba(255,255,255,.52)" strokeWidth=".65"/>
      <path d="M143 48 L80 77 L112 81 Z" fill={`url(#${id}right)`} stroke="rgba(255,255,255,.58)" strokeWidth=".65"/>
      <path d="M80 9 L48 80 L80 70 L112 81 Z" fill={`url(#${id}center)`} stroke="rgba(255,255,255,.7)" strokeWidth=".72"/>
      <path d="M17 53 L47 80 L80 70 L112 81 L143 48 L126 88 L42 88 Z" fill={`url(#${id}hull)`} stroke="rgba(224,238,248,.62)" strokeWidth=".75"/>
      <path d="M17 53 L80 70 L42 88 Z" fill="rgba(126,151,171,.30)"/>
      <path d="M143 48 L80 70 L126 88 Z" fill="rgba(255,255,255,.20)"/>
      <path d="M80 9 L80 70 M17 53 L80 70 L143 48 M42 88 L80 70 L126 88" stroke="rgba(102,128,151,.55)" strokeWidth=".75" strokeLinecap="round"/>
      <path d="M22 55 L80 76 L138 51" stroke="rgba(255,255,255,.55)" strokeWidth=".55"/>
      <path d="M42 88 Q80 94 126 88" stroke="rgba(2,14,31,.48)" strokeWidth="1.3"/>

      {showReflection && <>
        <ellipse cx="80" cy="91" rx="54" ry="4" fill="rgba(207,232,255,.10)"/>
        <path d="M43 94 Q80 99 119 94 L110 109 Q80 115 50 108 Z" fill={`url(#${id}reflection)`} opacity=".62"/>
        <path d="M21 96 Q47 92 69 96 T139 96 M31 102 Q55 99 77 102 T130 102 M44 109 Q66 106 83 109 T117 109" stroke="rgba(207,232,255,.13)" strokeWidth=".7" strokeLinecap="round"/>
      </>}
    </svg>
  );
}

export function PaperBoatMini({ size = 58, fade = 1 }: { size?: number; fade?: number }) {
  return <div style={{ opacity: fade }}><PaperBoat size={size} state="still" showReflection /></div>;
}
