// Wathin｜未止 — index.tsx  v2.0.1
'use client';
import { useState, useCallback, useEffect } from 'react';
import WaterCanvas from '@/components/WaterCanvas';
import RiverScreen from '@/components/RiverScreen';
import MessageScreen from '@/components/MessageScreen';
import ShoreScreen from '@/components/ShoreScreen';
import { loadShore } from '@/lib/storage';
import type { Screen } from '@/lib/types';

export default function Home() {
  // 每次開啟程式，預設進入河流。
  const [screen, setScreen] = useState<Screen>('river');
  const [shoreCount, setShoreCount] = useState(0);

  const refresh = useCallback(() => setShoreCount(loadShore().length), []);
  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 'var(--app-height)', overflow: 'hidden', background: '#071B34' }}>
      <WaterCanvas />

      {screen === 'river' && (
        <RiverScreen onNavigate={setScreen} shoreCount={shoreCount} refreshShore={refresh} />
      )}
      {screen === 'message' && (
        <MessageScreen onNavigate={setScreen} onRelease={setScreen} shoreCount={shoreCount} />
      )}
      {screen === 'shore' && (
        <ShoreScreen onNavigate={setScreen} onUpdate={refresh} />
      )}
    </div>
  );
}
