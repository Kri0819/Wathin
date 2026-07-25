// Wathin｜未止 — useRiver hook  v2.1.0
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Boat } from '@/lib/types';
import { RIVER } from '@/design-system/river';

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
  const nextDelay = () => RIVER.emptyRiverDelayMin + Math.random() * (RIVER.emptyRiverDelayMax - RIVER.emptyRiverDelayMin);

  const schedule = useCallback(() => {
    setBoat(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const b = await fetchNextBoat();
      if (b) setBoat(b); else schedule();
    }, nextDelay());
  }, []);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    timer.current = setTimeout(async () => {
      const b = await fetchNextBoat();
      if (b) setBoat(b); else schedule();
    }, nextDelay());
  }, [schedule]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { boat, start, dismiss: schedule, exit: schedule, received: schedule };
}
