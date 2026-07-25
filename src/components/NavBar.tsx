// Wathin｜未止 — NavBar  v2.0.1
'use client';
import { IconShore, IconBoat } from './NavIcons';
import WathinWave from './WathinWave';
import { FONT_BODY } from '@/lib/tokens';
import { VISUAL } from '@/lib/visual';
import type { Screen } from '@/lib/types';

interface Props {
  active: Screen;
  onNavigate: (screen: Screen) => void;
  shoreCount: number;
}

const ITEMS: Array<{ screen: Screen; label: string }> = [
  { screen: 'shore', label: '岸邊' },
  { screen: 'river', label: '河流' },
  { screen: 'message', label: '船訊' },
];

export default function NavBar({ active, onNavigate, shoreCount }: Props) {
  const { nav } = VISUAL;

  const renderIcon = (screen: Screen, isActive: boolean) => {
    if (screen === 'shore') return <IconShore active={isActive} />;
    if (screen === 'river') return <WathinWave w={32} a={isActive ? 0.92 : 0.42} sw={isActive ? 2.2 : 1.8} />;
    return <IconBoat a={isActive ? 0.92 : 0.42} />;
  };

  return (
    <nav
      aria-label="主要分頁"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: `calc(${nav.height}px + env(safe-area-inset-bottom,0px))`,
        background: `linear-gradient(0deg,rgba(2,9,17,${nav.backgroundDarkness}) 0%,rgba(2,9,17,0.64) 64%,transparent 100%)`,
        display: 'grid',
        gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
        alignItems: 'end',
        padding: `0 ${nav.horizontalPadding}px calc(env(safe-area-inset-bottom,0px) + ${nav.bottomPadding}px)`,
        zIndex: 30,
      }}
    >
      {ITEMS.map(({ screen, label }) => {
        const isActive = active === screen;
        const accessibleLabel = screen === 'shore' && shoreCount > 0 ? `${label}，目前 ${shoreCount} 艘` : label;

        return (
          <button
            key={screen}
            type="button"
            aria-label={accessibleLabel}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(screen)}
            style={{
              minWidth: 0,
              minHeight: 54,
              padding: '4px 8px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: nav.itemGap,
              opacity: isActive ? nav.activeOpacity : nav.inactiveOpacity,
              transition: 'opacity 180ms ease, transform 180ms ease',
              transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
            }}
          >
            <span style={{ height: screen === 'river' ? 54 : nav.iconBoxHeight, width: screen === 'river' ? 54 : 44, marginTop: screen === 'river' ? -20 : 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: screen === 'river' ? `1px solid rgba(207,232,255,${isActive ? .62 : .16})` : '1px solid transparent', background: screen === 'river' ? 'rgba(7,27,52,.82)' : 'transparent', boxShadow: screen === 'river' && isActive ? '0 0 24px rgba(72,157,228,.24),inset 0 0 18px rgba(18,59,99,.48)' : 'none' }}>
              {renderIcon(screen, isActive)}
            </span>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: nav.labelSize,
                letterSpacing: '0.14em',
                color: 'rgba(207,232,255,0.96)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
