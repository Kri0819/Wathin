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
      <img src="/assets/paper-boat-v2.png" alt="" draggable={false} style={{ position: 'absolute', inset: '0 0 auto', display: 'block', width: '100%', height: 'auto', objectFit: 'contain', userSelect: 'none', filter: received
        ? 'drop-shadow(0 0 19px rgba(207,232,255,.95)) drop-shadow(0 9px 17px rgba(0,0,0,.58))'
        : `brightness(.82) contrast(.94) saturate(.64) drop-shadow(0 13px 22px rgba(0,3,12,${BOAT.shadowOpacity})) drop-shadow(0 3px 5px rgba(5,24,49,.92))`, transition: 'filter .55s ease' }} />
      {!received && <span style={{ position: 'absolute', inset: '0 0 auto', width: '100%', aspectRatio: '2/1', background: 'linear-gradient(145deg,rgba(207,232,255,0) 24%,rgba(19,57,92,.08) 48%,rgba(4,27,57,.42) 100%)', maskImage: 'url(/assets/paper-boat-v2.png)', WebkitMaskImage: 'url(/assets/paper-boat-v2.png)', maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', pointerEvents: 'none' }} />}
      {showReflection && <>
        <img src="/assets/paper-boat-v2.png" alt="" draggable={false} style={{ position: 'absolute', left: '5%', top: '49%', width: '90%', height: 'auto', transform: 'scaleY(-.34)', transformOrigin: 'top', opacity: .21, filter: 'blur(1.6px) brightness(.58) saturate(.72)', maskImage: 'linear-gradient(to bottom,rgba(0,0,0,.9),transparent 72%)', WebkitMaskImage: 'linear-gradient(to bottom,rgba(0,0,0,.9),transparent 72%)' }} />
        <span style={{ position: 'absolute', left: '-5%', right: '-5%', top: '51%', height: 18, borderTop: '1px solid rgba(207,232,255,.24)', borderBottom: '1px solid rgba(207,232,255,.10)', borderRadius: '50%', filter: 'blur(.15px)' }} />
      </>}
    </span>
  );
}

export function PaperBoatMini({ size = 58, fade = 1 }: { size?: number; fade?: number }) {
  return <span style={{ display: 'block', opacity: fade }}><PaperBoat size={size} state="still" showReflection /></span>;
}
