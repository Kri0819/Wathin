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
  const waterRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = waterRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width:600px)').matches;
    const image = new Image();
    image.src = mobile ? '/assets/water-mobile.webp' : '/assets/water-desktop.webp';
    let width = 0, height = 0, ratio = 1, frame = 0, alive = true, lastFrame = 0;
    const start = performance.now();

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
    };

    const drawCover = () => {
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const sourceW = width / scale, sourceH = height / scale;
      const sourceX = (image.naturalWidth - sourceW) / 2;
      const sourceY = (image.naturalHeight - sourceH) / 2;
      context.drawImage(image, sourceX, sourceY, sourceW, sourceH, 0, 0, width, height);
      return { scale, sourceW, sourceX, sourceY };
    };

    const render = (now: number) => {
      if (!alive) return;
      frame = requestAnimationFrame(render);
      if (!reduced && now - lastFrame < 32) return;
      lastFrame = now;
      const time = reduced ? 0 : (now - start) / 1000;
      const cover = drawCover();
      const horizon = height * (mobile ? .405 : .37);
      const strip = mobile ? 3 : 4;
      const extraPixels = 18;
      const extraSource = extraPixels / cover.scale;

      for (let y = horizon; y < height; y += strip) {
        const depth = (y - horizon) / (height - horizon);
        const eased = depth * depth;
        const horizontal =
          Math.sin(time * .92 + y * .020) * (2.1 + eased * 18.5) +
          Math.sin(-time * .63 + y * .051) * (1.1 + depth * 7.2);
        const vertical =
          Math.sin(time * .52 + y * .016) * (.55 + eased * 5.8) +
          Math.sin(-time * .36 + y * .037) * depth * 2.4;
        const sourceY = cover.sourceY + (y + vertical) / cover.scale;
        const sourceHeight = (strip + 2) / cover.scale;
        context.drawImage(
          image,
          cover.sourceX - extraSource,
          sourceY,
          cover.sourceW + extraSource * 2,
          sourceHeight,
          -extraPixels + horizontal,
          y,
          width + extraPixels * 2,
          strip + 2,
        );
      }

      const flow = context.createLinearGradient(0, horizon, 0, height);
      flow.addColorStop(0, 'rgba(3,20,42,0)');
      flow.addColorStop(.55, `rgba(10,42,76,${.018 + Math.sin(time * .22) * .006})`);
      flow.addColorStop(1, 'rgba(0,8,22,.08)');
      context.fillStyle = flow; context.fillRect(0, horizon, width, height - horizon);
    };

    image.onload = () => { if (!alive) return; resize(); canvas.style.opacity = '1'; frame = requestAnimationFrame(render); };
    window.addEventListener('resize', resize);
    return () => { alive = false; cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    const canvas = effectsRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const random = seeded(112358);
    const stars: Star[] = Array.from({ length: 18 }, () => ({ x: .05 + random() * .9, y: .035 + random() * .28, r: .45 + random() * 1.15, alpha: .22 + random() * .52, phase: random() * Math.PI * 2, speed: .18 + random() * .38 }));
    const glints: Glint[] = Array.from({ length: 34 }, () => ({ x: .05 + random() * .9, y: .43 + random() * .5, width: .022 + random() * .085, alpha: .06 + random() * .11, phase: random() * Math.PI * 2, speed: .22 + random() * .42 }));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, frame = 0;
    const start = performance.now();
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
      const moonX = width * .665, moonY = height * .145;
      const scale = Math.min(1.35, Math.max(.9, width / 700));
      const haze = context.createRadialGradient(moonX, moonY, 0, moonX, moonY, 96 * scale);
      haze.addColorStop(0, 'rgba(232,246,255,.38)'); haze.addColorStop(.16, 'rgba(187,220,247,.16)'); haze.addColorStop(.5, 'rgba(118,168,214,.055)'); haze.addColorStop(1, 'rgba(65,120,178,0)');
      context.fillStyle = haze; context.beginPath(); context.arc(moonX, moonY, 96 * scale, 0, Math.PI * 2); context.fill();
      const moon = context.createRadialGradient(moonX - 2, moonY - 2, 0, moonX, moonY, 14 * scale);
      moon.addColorStop(0, '#fffef8'); moon.addColorStop(.32, '#f1f8ff'); moon.addColorStop(.58, 'rgba(207,232,255,.76)'); moon.addColorStop(1, 'rgba(207,232,255,0)');
      context.fillStyle = moon; context.beginPath(); context.arc(moonX, moonY, 14 * scale, 0, Math.PI * 2); context.fill();
      stars.forEach(star => { const alpha = star.alpha * (.72 + Math.sin(time * star.speed + star.phase) * .28); context.beginPath(); context.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2); context.fillStyle = `rgba(239,249,255,${alpha})`; context.fill(); });
      context.save(); context.globalCompositeOperation = 'screen';
      glints.forEach((glint, index) => {
        const pulse = .5 + Math.sin(time * glint.speed + glint.phase) * .42;
        const x = glint.x * width + Math.sin(time * .58 + glint.phase) * (10 + glint.y * 16);
        const baseY = glint.y * height;
        const y = baseY + Math.sin(time * .46 + glint.phase) * (2.2 + glint.y * 3.8);
        const w = glint.width * width * (.82 + pulse * .32);
        const gradient = context.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        gradient.addColorStop(0, 'rgba(207,232,255,0)'); gradient.addColorStop(.5, `rgba(235,249,255,${glint.alpha * pulse})`); gradient.addColorStop(1, 'rgba(207,232,255,0)');
        context.beginPath(); context.moveTo(x - w / 2, y); context.quadraticCurveTo(x, y + (index % 3) - 1, x + w / 2, y); context.strokeStyle = gradient; context.lineWidth = .7 + glint.y * .4; context.stroke();
      });
      context.restore();
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#010812' }}>
    <picture><source media="(max-width:600px)" srcSet="/assets/water-mobile.webp" /><img className="river-fallback" src="/assets/water-desktop.webp" alt="" draggable={false} /></picture>
    <canvas ref={waterRef} style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .45s ease' }} />
    <canvas ref={effectsRef} style={{ position: 'absolute', inset: 0 }} />
    <style>{`.river-fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.88) brightness(.86)}`}</style>
  </div>;
}
