// Wathin｜未止 — WaterCanvas  v2.0.0
'use client';
import { useEffect, useRef } from 'react';

export default function WaterCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);
  const t   = useRef(0);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext('2d')!;
    const rng = (s: number) => { let v = (s * 1664525 + 1013904223) | 0; return () => { v = (Math.imul(v, 1664525) + 1013904223) | 0; return (v >>> 0) / 2 ** 32; }; };
    const lr = rng(42), sr = rng(17);
    const N = 60;
    const L = Array.from({ length: N }, () => { const a=lr(),b=lr(),c=lr(),d=lr(),e=lr(); return { a,b,c,d,e, bright: e > 0.76 }; });
    const STARS = Array.from({ length: 14 }, () => ({ x: sr(), y: sr()*0.36, r: 0.4+sr()*0.7, ph: sr()*6.28, period: 8+sr()*4 }));
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    const draw = () => {
      t.current += 0.0036;
      const T = t.current, W = cv.width, H = cv.height;

      const bg = cx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'#020911'); bg.addColorStop(0.22,'#061829');
      bg.addColorStop(0.50,'#081E37'); bg.addColorStop(0.80,'#0A2342'); bg.addColorStop(1,'#0C2747');
      cx.fillStyle=bg; cx.fillRect(0,0,W,H);

      const MX=W*0.73, MY=H*0.135;
      const atm=cx.createRadialGradient(MX,MY,0,MX,MY,H*0.46);
      atm.addColorStop(0,'rgba(220,242,255,0.13)'); atm.addColorStop(0.14,'rgba(205,232,255,0.07)');
      atm.addColorStop(0.40,'rgba(190,222,255,0.025)'); atm.addColorStop(1,'rgba(0,0,0,0)');
      cx.fillStyle=atm; cx.fillRect(0,0,W,H);

      const mc=cx.createRadialGradient(MX,MY,0,MX,MY,W*0.030);
      mc.addColorStop(0,'rgba(255,253,248,1)'); mc.addColorStop(0.28,'rgba(248,252,255,0.94)');
      mc.addColorStop(0.58,'rgba(225,242,255,0.60)'); mc.addColorStop(1,'rgba(180,218,255,0)');
      cx.fillStyle=mc; cx.beginPath(); cx.arc(MX,MY,W*0.032,0,Math.PI*2); cx.fill();

      const HY=H*0.44;
      const hg=cx.createLinearGradient(0,HY-80,0,HY+60);
      hg.addColorStop(0,'rgba(207,232,255,0)'); hg.addColorStop(0.5,'rgba(207,232,255,0.02)'); hg.addColorStop(1,'rgba(207,232,255,0)');
      cx.fillStyle=hg; cx.fillRect(0,HY-80,W,140);

      const WT=H*0.41;
      for (let i=0;i<N;i++){
        const {a:r1,b:r2,c:r3,d:r4,e:r5,bright}=L[i];
        const p=i/N;
        const by=WT+(H-WT)*p;
        const y=by+Math.sin(T*0.32+i*0.6+r1*2)*3.0;
        let alpha: number;
        if (bright) { const pulse=Math.pow(Math.sin(T*0.55+i*1.5)*0.5+0.5,0.6); alpha=(0.150-p*0.09)*pulse; }
        else alpha=0.05-p*0.035;
        alpha=Math.max(0,alpha+Math.sin(T*1.7+i*2.2+r2*5)*0.008);
        if (alpha<0.004) continue;
        const span=Math.min(0.97,r1*0.52+0.22+(bright?0.20:0));
        const lw=W*span;
        const sx=(W-lw)*(r2*0.70+0.08);
        const lg=cx.createLinearGradient(sx,0,sx+lw,0);
        lg.addColorStop(0,'rgba(207,232,255,0)'); lg.addColorStop(0.07,`rgba(218,242,255,${alpha*0.5})`);
        lg.addColorStop(0.30,`rgba(222,244,255,${alpha})`); lg.addColorStop(0.70,`rgba(222,244,255,${alpha})`);
        lg.addColorStop(0.93,`rgba(218,242,255,${alpha*0.5})`); lg.addColorStop(1,'rgba(207,232,255,0)');
        cx.beginPath(); cx.moveTo(sx,y);
        for (let x=sx;x<=sx+lw;x+=5){
          const w=Math.sin((x/W)*Math.PI*2.6+T*0.62+i*0.5)*1.8+Math.sin((x/W)*Math.PI*6.8-T*0.82+r3*6)*0.8;
          cx.lineTo(x,y+w);
        }
        cx.strokeStyle=lg; cx.lineWidth=r5>0.82?0.95:0.45+r4*0.35; cx.stroke();
      }

      for (let i=0;i<22;i++){
        const ry=H*0.46+i*H*0.026; if(ry>H)break;
        const rw=W*(0.072-i*0.0026); if(rw<=0)continue;
        const pulse=Math.sin(T*0.85+i*0.82)*0.5+0.5;
        const ra=Math.max(0,(0.060-i*0.0025)*pulse); if(ra<0.003)continue;
        const rg=cx.createLinearGradient(MX-rw,0,MX+rw,0);
        rg.addColorStop(0,'rgba(230,246,255,0)'); rg.addColorStop(0.30,`rgba(240,252,255,${ra*0.7})`);
        rg.addColorStop(0.5,`rgba(250,255,255,${ra})`); rg.addColorStop(0.70,`rgba(240,252,255,${ra*0.7})`);
        rg.addColorStop(1,'rgba(230,246,255,0)');
        cx.fillStyle=rg; cx.fillRect(MX-rw,ry,rw*2,1.4+pulse*1.0);
      }

      for (const s of STARS) {
        const a=0.14+Math.sin((T*2*Math.PI)/(s.period*0.15)+s.ph)*0.12;
        cx.beginPath(); cx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);
        cx.fillStyle=`rgba(242,252,255,${Math.max(0,a)})`; cx.fill();
      }

      const vig=cx.createRadialGradient(W*.5,H*.46,H*.05,W*.5,H*.46,H*.92);
      vig.addColorStop(0,'rgba(2,9,17,0)'); vig.addColorStop(0.6,'rgba(2,9,17,0.04)'); vig.addColorStop(1,'rgba(2,9,17,0.48)');
      cx.fillStyle=vig; cx.fillRect(0,0,W,H);

      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}
