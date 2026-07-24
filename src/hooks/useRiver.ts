// Wathin｜未止 — useRiver hook  v2.0.0
import { useState, useCallback, useRef } from 'react';
import type { Boat } from '@/lib/types';

async function fetchNextBoat(): Promise<Boat | null> {
  try {
    const res = await fetch('/api/boats/next');
    if (!res.ok) return null;
    return (await res.json()) as Boat;
  } catch { return null; }
}

export function useRiver() {
  const [boat, setBoat] = useState<Boat | null>(null);
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = useCallback(() => {
    setBoat(null);
    timer.current = setTimeout(async () => {
      const b = await fetchNextBoat();
      if (b) setBoat(b); else schedule();
    }, 900 + Math.random() * 2000);
  }, []);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setTimeout(async () => {
      const b = await fetchNextBoat();
      if (b) setBoat(b); else schedule();
    }, 500);
  }, [schedule]);

  return { boat, start, dismiss: schedule, exit: schedule, received: schedule };
}
