import { BOAT } from '@/design-system/boat';

interface PaperBoatProps {
  size?: number;
  state?: 'still' | 'drift' | 'received';
  showReflection?: boolean;
}

export function PaperBoat({ size = 150, state = 'drift', showReflection = true }: PaperBoatProps) {
  const received = state === 'received';
  const still = state === 'still';
  return (
    <span className="paper-boat-asset" aria-hidden="true" style={{ position: 'relative', display: 'block', width: size, height: size * (showReflection ? .74 : .58), opacity: still ? .72 : 1 }}>
      <span style={{ position: 'absolute', left: '10%', right: '10%', bottom: showReflection ? '18%' : '3%', height: '12%', borderRadius: '50%', background: 'rgba(0,5,15,.62)', filter: 'blur(7px)', transform: 'scaleX(.9)' }} />
      <img src="/assets/paper-boat.png" alt="" draggable={false} style={{ position: 'absolute', inset: '0 0 auto', display: 'block', width: '100%', height: 'auto', objectFit: 'contain', userSelect: 'none', filter: received
        ? 'drop-shadow(0 0 19px rgba(207,232,255,.95)) drop-shadow(0 9px 17px rgba(0,0,0,.58))'
        : `drop-shadow(0 11px 18px rgba(0,0,0,${BOAT.shadowOpacity})) drop-shadow(0 2px 4px rgba(5,15,31,.86))`, transition: 'filter .55s ease' }} />
      {showReflection && <>
        <img src="/assets/paper-boat.png" alt="" draggable={false} style={{ position: 'absolute', left: '5%', top: '54%', width: '90%', height: 'auto', transform: 'scaleY(-.34)', transformOrigin: 'top', opacity: .13, filter: 'blur(1.2px) saturate(.55)', maskImage: 'linear-gradient(to bottom,rgba(0,0,0,.9),transparent 72%)', WebkitMaskImage: 'linear-gradient(to bottom,rgba(0,0,0,.9),transparent 72%)' }} />
        <span style={{ position: 'absolute', left: '-5%', right: '-5%', top: '56%', height: 18, borderTop: '1px solid rgba(207,232,255,.24)', borderBottom: '1px solid rgba(207,232,255,.10)', borderRadius: '50%', filter: 'blur(.15px)' }} />
      </>}
    </span>
  );
}

export function PaperBoatMini({ size = 58, fade = 1 }: { size?: number; fade?: number }) {
  return <span style={{ display: 'block', opacity: fade }}><PaperBoat size={size} state="still" showReflection /></span>;
}
