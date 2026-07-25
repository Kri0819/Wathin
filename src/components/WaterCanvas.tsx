'use client';
import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; r: number; alpha: number; phase: number; speed: number };
type Glint = { x: number; y: number; width: number; alpha: number; phase: number; speed: number };

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
    const random = seeded(112358);
    const stars: Star[] = Array.from({ length: 18 }, () => ({
      x: .05 + random() * .9, y: .035 + random() * .28, r: .45 + random() * 1.15,
      alpha: .22 + random() * .52, phase: random() * Math.PI * 2, speed: .18 + random() * .38,
    }));
    const glints: Glint[] = Array.from({ length: 34 }, () => ({
      x: .05 + random() * .9, y: .45 + random() * .48, width: .018 + random() * .085,
      alpha: .035 + random() * .11, phase: random() * Math.PI * 2, speed: .12 + random() * .3,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    const start = performance.now();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      const time = reduced ? 0 : (now - start) / 1000;
      context.clearRect(0, 0, width, height);

      const moonX = width * .665;
      const moonY = height * .145;
      const scale = Math.min(1.35, Math.max(.9, width / 700));
      const haze = context.createRadialGradient(moonX, moonY, 0, moonX, moonY, 96 * scale);
      haze.addColorStop(0, 'rgba(232,246,255,.38)');
      haze.addColorStop(.16, 'rgba(187,220,247,.16)');
      haze.addColorStop(.5, 'rgba(118,168,214,.055)');
      haze.addColorStop(1, 'rgba(65,120,178,0)');
      context.fillStyle = haze; context.beginPath(); context.arc(moonX, moonY, 96 * scale, 0, Math.PI * 2); context.fill();
      const moon = context.createRadialGradient(moonX - 2, moonY - 2, 0, moonX, moonY, 14 * scale);
      moon.addColorStop(0, '#fffef8'); moon.addColorStop(.32, '#f1f8ff'); moon.addColorStop(.58, 'rgba(207,232,255,.76)'); moon.addColorStop(1, 'rgba(207,232,255,0)');
      context.fillStyle = moon; context.beginPath(); context.arc(moonX, moonY, 14 * scale, 0, Math.PI * 2); context.fill();

      stars.forEach(star => {
        const alpha = star.alpha * (.72 + Math.sin(time * star.speed + star.phase) * .28);
        context.beginPath(); context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(239,249,255,${alpha})`; context.fill();
      });

      context.save(); context.globalCompositeOperation = 'screen';
      glints.forEach((glint, index) => {
        const pulse = .45 + Math.sin(time * glint.speed + glint.phase) * .38;
        const x = glint.x * width + Math.sin(time * .08 + glint.phase) * 8;
        const y = glint.y * height;
        const w = glint.width * width * (.82 + pulse * .22);
        const gradient = context.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        gradient.addColorStop(0, 'rgba(207,232,255,0)');
        gradient.addColorStop(.5, `rgba(231,247,255,${glint.alpha * pulse})`);
        gradient.addColorStop(1, 'rgba(207,232,255,0)');
        context.beginPath();
        context.moveTo(x - w / 2, y);
        context.quadraticCurveTo(x - w * .15, y - (index % 3) * 1.2, x, y);
        context.quadraticCurveTo(x + w * .2, y + ((index + 1) % 3), x + w / 2, y);
        context.strokeStyle = gradient; context.lineWidth = .55 + (y / height) * .72; context.stroke();
      });
      context.restore();

      const vignette = context.createRadialGradient(width * .5, height * .48, height * .08, width * .5, height * .48, Math.max(width, height) * .72);
      vignette.addColorStop(0, 'rgba(0,0,0,0)'); vignette.addColorStop(.72, 'rgba(0,4,12,.035)'); vignette.addColorStop(1, 'rgba(0,4,12,.32)');
      context.fillStyle = vignette; context.fillRect(0, 0, width, height);
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#010812' }}>
    <picture>
      <source media="(max-width: 600px)" srcSet="/assets/water-mobile.webp" />
      <img className="river-art" src="/assets/water-desktop.webp" alt="" draggable={false} />
    </picture>
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    <style>{`
      .river-art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.012);animation:river-breathe 16s ease-in-out infinite alternate;filter:saturate(.88) brightness(.86)}
      @keyframes river-breathe{from{transform:scale(1.012) translateY(0)}to{transform:scale(1.025) translateY(-.35%)}}
      @media(prefers-reduced-motion:reduce){.river-art{animation:none}}
    `}</style>
  </div>;
}
