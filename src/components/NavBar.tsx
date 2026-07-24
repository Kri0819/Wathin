// Wathin｜未止 — NavBar  v2.0.0
'use client';
import { IconShore, IconBoat } from './NavIcons';
import WathinWave from './WathinWave';
import { COLOR, FONT_BODY, SP } from '@/lib/tokens';

interface Props {
  onShore: () => void;
  onCreate: () => void;
  shoreCount: number;
  shoreActive?: boolean;
}

export default function NavBar({ onShore, onCreate, shoreCount, shoreActive = false }: Props) {
  return (
    <nav style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 'calc(82px + env(safe-area-inset-bottom,0px))',
      background: 'linear-gradient(0deg,rgba(2,9,17,0.97) 0%,rgba(2,9,17,0.55) 62%,transparent 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `0 ${SP.xxl}px calc(env(safe-area-inset-bottom,0px) + ${SP.base + 2}px)`,
      zIndex: 30,
    }}>
      <button onClick={onShore}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs + 1, padding: `${SP.sm - 2}px ${SP.md + 2}px`, transition: 'opacity 0.18s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.58')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
        <IconShore active={shoreCount > 0 || shoreActive} />
        <span style={{ fontFamily: FONT_BODY, fontSize: 11, letterSpacing: '0.11em', color: shoreCount > 0 || shoreActive ? 'rgba(207,232,255,0.90)' : 'rgba(159,182,204,0.46)' }}>
          岸邊{shoreCount > 0 ? ` ${shoreCount}` : ''}
        </span>
      </button>

      <button onClick={onCreate} style={{
        width: 66, height: 66, borderRadius: '50%',
        background: `linear-gradient(148deg, ${COLOR.blue}E6, ${COLOR.navy}F2)`,
        border: '1.5px solid rgba(207,232,255,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 0 32px rgba(207,232,255,0.07),inset 0 1px 0 rgba(207,232,255,0.13)',
        transition: 'border-color 0.20s,box-shadow 0.20s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(207,232,255,0.46)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(207,232,255,0.22),inset 0 1px 0 rgba(207,232,255,0.22)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(207,232,255,0.20)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(207,232,255,0.07),inset 0 1px 0 rgba(207,232,255,0.13)'; }}>
        <WathinWave w={32} a={0.84} sw={2.4} />
      </button>

      <button onClick={onCreate}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs + 1, padding: `${SP.sm - 2}px ${SP.md + 2}px`, transition: 'opacity 0.18s' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.58')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
        <IconBoat />
        <span style={{ fontFamily: FONT_BODY, fontSize: 11, letterSpacing: '0.11em', color: 'rgba(159,182,204,0.46)' }}>寫船</span>
      </button>
    </nav>
  );
}
