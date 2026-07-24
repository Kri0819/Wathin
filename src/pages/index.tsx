// Wathin｜未止 — index.tsx  v2.0.0
'use client';
import { useState, useCallback, useEffect } from 'react';
import WaterCanvas  from '@/components/WaterCanvas';
import RiverScreen  from '@/components/RiverScreen';
import CreateScreen from '@/components/CreateScreen';
import ShoreScreen  from '@/components/ShoreScreen';
import { loadShore } from '@/lib/storage';
import type { Screen } from '@/lib/types';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('river');
  const [shoreCount, setShoreCount] = useState(0);

  const refresh = useCallback(() => setShoreCount(loadShore().length), []);
  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#071B34' }}>
      <WaterCanvas />

      {screen === 'river' && (
        <RiverScreen onNavigate={setScreen} shoreCount={shoreCount} refreshShore={refresh} />
      )}
      {screen === 'create' && (
        <CreateScreen onBack={() => setScreen('river')} onRelease={(s) => setScreen(s)} />
      )}
      {screen === 'shore' && (
        <ShoreScreen onBack={() => setScreen('river')} onCreate={() => setScreen('create')} onUpdate={refresh} />
      )}
    </div>
  );
}
