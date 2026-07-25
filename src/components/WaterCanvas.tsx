'use client';
import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; r: number; alpha: number; phase: number; speed: number };
type Glint = { x: number; y: number; width: number; alpha: number; phase: number; speed: number };

const seeded = (seed: number) => () => {
  seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
  return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
};

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const value = gl.createShader(type);
  if (!value) return null;
  gl.shaderSource(value, source); gl.compileShader(value);
  return gl.getShaderParameter(value, gl.COMPILE_STATUS) ? value : null;
}

export default function WaterCanvas() {
  const webglRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = webglRef.current;
    const gl = canvas?.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!canvas || !gl) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vertex = shader(gl, gl.VERTEX_SHADER, `
      attribute vec2 a_position;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      void main(){v_uv=a_uv;gl_Position=vec4(a_position,0.0,1.0);}
    `);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, `
      precision highp float;
      uniform sampler2D u_image;
      uniform vec2 u_view;
      uniform vec2 u_imageSize;
      uniform float u_time;
      varying vec2 v_uv;

      void main(){
        float viewAspect=u_view.x/u_view.y;
        float imageAspect=u_imageSize.x/u_imageSize.y;
        vec2 uv=v_uv;
        if(viewAspect>imageAspect){
          float visibleY=imageAspect/viewAspect;
          uv.y=(uv.y-.5)*visibleY+.5;
        }else{
          float visibleX=viewAspect/imageAspect;
          uv.x=(uv.x-.5)*visibleX+.5;
        }

        float water=1.0-smoothstep(.60,.68,v_uv.y);
        float nearDepth=pow(1.0-v_uv.y,1.65);
        float amplitude=water*(.00045+nearDepth*.0062);
        float longWave=sin(v_uv.x*15.0+v_uv.y*8.0+u_time*.32);
        float crossing=sin(v_uv.x*29.0-v_uv.y*13.0-u_time*.24);
        float fineWave=sin(v_uv.x*56.0+v_uv.y*22.0+u_time*.46);
        vec2 movement=vec2(
          (longWave*.55+crossing*.28+fineWave*.08)*amplitude,
          (crossing*.38+longWave*.18)*amplitude*.52
        );
        vec3 color=texture2D(u_image,clamp(uv+movement,vec2(.002),vec2(.998))).rgb;

        float movingLight=(sin(v_uv.x*38.0-v_uv.y*24.0+u_time*.38)*.5+.5);
        movingLight*=smoothstep(.55,.92,movingLight)*water*nearDepth;
        color+=vec3(.035,.075,.115)*movingLight*.22;
        float breath=.975+sin(u_time*.14)*.015;
        color*=mix(1.0,breath,water);
        gl_FragColor=vec4(color,1.0);
      }
    `);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program); gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 0,0,  1,-1, 1,0,  -1,1, 0,1,
      -1,1, 0,1,   1,-1, 1,0,   1,1, 1,1,
    ]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_position');
    const uv = gl.getAttribLocation(program, 'a_uv');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uv); gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 16, 8);
    const viewUniform = gl.getUniformLocation(program, 'u_view');
    const imageUniform = gl.getUniformLocation(program, 'u_imageSize');
    const timeUniform = gl.getUniformLocation(program, 'u_time');
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    let width = 0, height = 0, frame = 0, alive = true;
    const start = performance.now();
    const image = new Image();
    image.src = window.matchMedia('(max-width:600px)').matches ? '/assets/water-mobile.webp' : '/assets/water-desktop.webp';
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(viewUniform, width, height);
    };
    const render = (now: number) => {
      if (!alive) return;
      gl.uniform1f(timeUniform, reduced ? 0 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    image.onload = () => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.uniform2f(imageUniform, image.naturalWidth, image.naturalHeight);
      resize(); canvas.style.opacity = '1'; frame = requestAnimationFrame(render);
    };
    window.addEventListener('resize', resize);
    return () => { alive = false; cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    const canvas = effectsRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const random = seeded(112358);
    const stars: Star[] = Array.from({ length: 18 }, () => ({ x: .05 + random() * .9, y: .035 + random() * .28, r: .45 + random() * 1.15, alpha: .22 + random() * .52, phase: random() * Math.PI * 2, speed: .18 + random() * .38 }));
    const glints: Glint[] = Array.from({ length: 24 }, () => ({ x: .05 + random() * .9, y: .46 + random() * .46, width: .018 + random() * .07, alpha: .025 + random() * .075, phase: random() * Math.PI * 2, speed: .12 + random() * .3 }));
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
        const pulse = .45 + Math.sin(time * glint.speed + glint.phase) * .38;
        const x = glint.x * width + Math.sin(time * .16 + glint.phase) * 10;
        const baseY = glint.y * height;
        const y = baseY + Math.sin(time * .22 + glint.phase) * (2 + glint.y * 2);
        const w = glint.width * width;
        const gradient = context.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        gradient.addColorStop(0, 'rgba(207,232,255,0)'); gradient.addColorStop(.5, `rgba(231,247,255,${glint.alpha * pulse})`); gradient.addColorStop(1, 'rgba(207,232,255,0)');
        context.beginPath(); context.moveTo(x - w / 2, y); context.quadraticCurveTo(x, y + (index % 3) - 1, x + w / 2, y); context.strokeStyle = gradient; context.lineWidth = .65; context.stroke();
      });
      context.restore();
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#010812' }}>
    <picture><source media="(max-width:600px)" srcSet="/assets/water-mobile.webp" /><img className="river-fallback" src="/assets/water-desktop.webp" alt="" draggable={false} /></picture>
    <canvas ref={webglRef} style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }} />
    <canvas ref={effectsRef} style={{ position: 'absolute', inset: 0 }} />
    <style>{`.river-fallback{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.88) brightness(.86)}`}</style>
  </div>;
}
