'use client';
import { useEffect, useRef } from 'react';
import { COLORS } from '@/design-system/colors';
import { MOON } from '@/design-system/moon';
import { RIVER } from '@/design-system/river';

type Star = { x: number; y: number; r: number; alpha: number; phase: number; speed: number };
type Wave = { y: number; x: number; width: number; amp: number; alpha: number; speed: number; phase: number };

const seeded = (seed: number) => () => {
  seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
  return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
};

export default function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const random = seeded(20260724);
    const stars: Star[] = Array.from({ length: RIVER.starCount }, () => ({
      x: 0.04 + random() * 0.92,
      y: 0.035 + random() * 0.29,
      r: 0.45 + random() * 1.2,
      alpha: 0.18 + random() * 0.55,
      phase: random() * Math.PI * 2,
      speed: 0.22 + random() * 0.42,
    }));
    const makeWaves = (count: number, far: boolean): Wave[] => Array.from({ length: count }, (_, index) => ({
      y: (far ? 0.37 : 0.43) + (index / count) * (far ? 0.26 : 0.56),
      x: random(),
      width: (far ? 0.05 : 0.09) + random() * (far ? 0.20 : 0.34),
      amp: (far ? 0.7 : 1.2) + random() * (far ? 1.2 : 2.4),
      alpha: (far ? 0.04 : 0.055) + random() * (far ? 0.105 : 0.16),
      speed: (random() - 0.5) * (far ? 0.11 : 0.18),
      phase: random() * Math.PI * 2,
    }));
    const waves = [...makeWaves(RIVER.farWaveCount, true), ...makeWaves(RIVER.nearWaveCount, false)];
    let width = 0;
    let height = 0;
    let frame = 0;
    let start = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawWave = (wave: Wave, time: number) => {
      const y = wave.y * height;
      const span = wave.width * width;
      const x = (wave.x * width + Math.sin(time * wave.speed + wave.phase) * width * 0.025) - span / 2;
      const gradient = context.createLinearGradient(x, 0, x + span, 0);
      gradient.addColorStop(0, 'rgba(207,232,255,0)');
      gradient.addColorStop(0.2, `rgba(207,232,255,${wave.alpha * 0.52})`);
      gradient.addColorStop(0.5, `rgba(229,244,255,${wave.alpha})`);
      gradient.addColorStop(0.8, `rgba(207,232,255,${wave.alpha * 0.46})`);
      gradient.addColorStop(1, 'rgba(207,232,255,0)');
      context.beginPath();
      for (let step = 0; step <= 28; step += 1) {
        const progress = step / 28;
        const px = x + span * progress;
        const py = y + Math.sin(progress * Math.PI * 2.4 + time * 0.33 + wave.phase) * wave.amp;
        if (!step) context.moveTo(px, py); else context.lineTo(px, py);
      }
      context.strokeStyle = gradient;
      context.lineWidth = wave.y > 0.7 ? 0.8 : 0.52;
      context.stroke();
    };

    const draw = (now: number) => {
      const time = reduced ? 0 : (now - start) / 1000;
      const horizon = height * RIVER.horizonRatio;
      const moonX = width * MOON.xRatio;
      const moonY = height * MOON.yRatio;

      const sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, COLORS.nightTop);
      sky.addColorStop(0.31, COLORS.nightMid);
      sky.addColorStop(0.43, COLORS.horizon);
      sky.addColorStop(0.47, COLORS.waterDeep);
      sky.addColorStop(1, COLORS.deepBlue);
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      const haze = context.createRadialGradient(moonX, moonY, 0, moonX, moonY, Math.min(MOON.haze, width * 0.65));
      haze.addColorStop(0, 'rgba(207,232,255,0.15)');
      haze.addColorStop(0.3, 'rgba(135,190,235,0.052)');
      haze.addColorStop(1, 'rgba(75,140,200,0)');
      context.fillStyle = haze;
      context.fillRect(0, 0, width, horizon + 80);

      stars.forEach((star) => {
        const flicker = star.alpha * (0.74 + Math.sin(time * star.speed + star.phase) * 0.26);
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(242,249,255,${flicker})`;
        context.fill();
      });

      const outer = context.createRadialGradient(moonX, moonY, MOON.size, moonX, moonY, MOON.outerGlow);
      outer.addColorStop(0, 'rgba(236,248,255,0.48)');
      outer.addColorStop(0.22, 'rgba(207,232,255,0.17)');
      outer.addColorStop(1, 'rgba(207,232,255,0)');
      context.fillStyle = outer;
      context.beginPath(); context.arc(moonX, moonY, MOON.outerGlow, 0, Math.PI * 2); context.fill();
      const bloom = context.createRadialGradient(moonX - 1.5, moonY - 1.5, 0, moonX, moonY, MOON.innerBloom);
      bloom.addColorStop(0, '#fffdf7');
      bloom.addColorStop(0.22, '#f5fbff');
      bloom.addColorStop(0.42, 'rgba(215,238,255,0.72)');
      bloom.addColorStop(1, 'rgba(207,232,255,0)');
      context.fillStyle = bloom;
      context.beginPath(); context.arc(moonX, moonY, MOON.innerBloom, 0, Math.PI * 2); context.fill();

      const horizonGlow = context.createLinearGradient(0, horizon - 55, 0, horizon + 75);
      horizonGlow.addColorStop(0, 'rgba(120,179,224,0)');
      horizonGlow.addColorStop(0.48, 'rgba(120,179,224,0.055)');
      horizonGlow.addColorStop(1, 'rgba(120,179,224,0)');
      context.fillStyle = horizonGlow;
      context.fillRect(0, horizon - 55, width, 130);

      const waterBloom = context.createRadialGradient(moonX, horizon + 70, 8, moonX, horizon + 130, width * .62);
      waterBloom.addColorStop(0, 'rgba(34,93,144,.16)');
      waterBloom.addColorStop(.36, 'rgba(18,66,112,.08)');
      waterBloom.addColorStop(1, 'rgba(4,19,39,0)');
      context.fillStyle = waterBloom;
      context.fillRect(0, horizon - 10, width, height - horizon + 10);

      waves.forEach((wave) => drawWave(wave, time));

      for (let band = 0; band < RIVER.reflectionBands; band += 1) {
        const progress = band / (RIVER.reflectionBands - 1);
        const y = horizon + 12 + progress * (height - horizon) * 0.82;
        if (band % 3 === 1) continue;
        const centerShift = Math.sin(band * 1.71 + time * 0.18) * width * (0.006 + progress * 0.012);
        const half = width * (0.012 + progress * 0.105) * (0.55 + ((band * 17) % 9) / 10);
        const pulse = 0.52 + Math.sin(time * 0.72 + band * 1.23) * 0.22;
        const alpha = RIVER.reflectionStrength * (1 - progress * 0.68) * pulse;
        const gradient = context.createLinearGradient(moonX + centerShift - half, 0, moonX + centerShift + half, 0);
        gradient.addColorStop(0, 'rgba(236,249,255,0)');
        gradient.addColorStop(0.25, `rgba(224,243,255,${alpha * 0.58})`);
        gradient.addColorStop(0.5, `rgba(248,253,255,${alpha})`);
        gradient.addColorStop(0.75, `rgba(224,243,255,${alpha * 0.58})`);
        gradient.addColorStop(1, 'rgba(236,249,255,0)');
        context.fillStyle = gradient;
        context.fillRect(moonX + centerShift - half, y, half * 2, 0.7 + progress * 1.25);
      }

      const vignette = context.createRadialGradient(width * 0.5, height * 0.48, height * 0.09, width * 0.5, height * 0.48, Math.max(width, height) * 0.72);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.66, 'rgba(0,4,12,0.08)');
      vignette.addColorStop(1, `rgba(0,4,12,${RIVER.vignetteOpacity})`);
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      start = 0;
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}
