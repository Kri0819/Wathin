// Wathin｜未止 — MessageScreen  v2.0.2
// 極簡輸入頁面，專注輸入，不干擾思緒；提交後紙船折疊動畫 0.6~0.8s
'use client';
import { useState, useRef, useEffect } from 'react';
import { PaperBoat } from './PaperBoat';
import WathinWave from './WathinWave';
import NavBar from './NavBar';
import { validateMessage } from '@/lib/safety';
import { clearMessageDraft, loadMessageDraft, saveMessageDraft } from '@/lib/storage';
import { COLOR, FONT_BODY, SP } from '@/lib/tokens';
import { VISUAL } from '@/lib/visual';
import type { Screen } from '@/lib/types';

interface Props { onNavigate: (s: Screen) => void; onRelease: (s: Screen) => void; shoreCount: number; }

type Phase = 'idle' | 'f1' | 'f2' | 'boat' | 'launch';

export default function MessageScreen({ onNavigate, onRelease, shoreCount }: Props) {
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [sending, setSending] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(loadMessageDraft());
    setDraftReady(true);
    ta.current?.focus();
  }, []);

  useEffect(() => {
    if (!draftReady) return;
    const timer = window.setTimeout(() => saveMessageDraft(text), 240);
    return () => window.clearTimeout(timer);
  }, [text, draftReady]);

  const trigShake = () => { setShake(true); setTimeout(() => setShake(false), 460); };

  const submit = async () => {
    if (sending) return;
    const t = text.trim();
    if (!t) { trigShake(); return; }
    const v = validateMessage(t);
    if (!v.ok) { setErr(v.reason ?? '字太多了，讓它輕一點吧。'); trigShake(); return; }
    setErr('');

    setSending(true);
    try {
      const response = await fetch('/api/boats/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: t }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setErr(result?.error ?? '河面暫時太遠了，這句話還在這裡。');
        trigShake();
        return;
      }
    } catch {
      setErr('河面暫時太遠了，這句話還在這裡。稍後再試一次。');
      trigShake();
      return;
    } finally {
      setSending(false);
    }

    clearMessageDraft();

    setPhase('f1');
    setTimeout(() => setPhase('f2'), 380);
    setTimeout(() => setPhase('boat'), 780);
    setTimeout(() => setPhase('launch'), 1500);
    setTimeout(() => onRelease('river'), 2350);
  };

  const pct = text.length / 120;
  const cClr = pct >= 0.9 ? 'rgba(255,110,60,0.92)' : pct >= 0.7 ? 'rgba(207,232,255,0.65)' : 'rgba(159,182,204,0.36)';

  if (phase !== 'idle') {
    const st = phase === 'f1' || phase === 'f2' ? 1 : phase === 'boat' ? 2 : 3;
    const an = phase === 'f1' ? 'pS 0.38s ease-in-out forwards'
      : phase === 'f2' ? 'pF 0.40s ease-in-out forwards'
      : phase === 'boat' ? 'pR 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards'
      : 'pL 0.8s ease-in-out forwards';
    const lb = phase === 'f1' ? '折疊中…' : phase === 'f2' ? '成形中…' : phase === 'boat' ? '好了。' : '放入河流…';

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,8,18,0.97)', backdropFilter: 'blur(22px)' }}>
        <div style={{ animation: an, willChange: 'transform,opacity' }}>
          <PaperBoat size={st >= 2 ? 130 : 100} state={st >= 2 ? 'received' : 'still'} showReflection={st >= 2} />
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: 'rgba(159,182,204,0.50)', marginTop: SP.xl + 2, letterSpacing: '0.22em', animation: 'fU 0.4s ease forwards' }}>{lb}</p>
        <style>{`
          @keyframes pS{from{transform:scale(1) rotate(0);opacity:1}to{transform:scale(0.72) rotate(-10deg);opacity:0.88}}
          @keyframes pF{from{transform:scale(0.72) rotate(-10deg)}to{transform:scale(0.86) rotate(6deg)}}
          @keyframes pR{from{transform:scale(0.86) rotate(6deg) translateY(14px);opacity:0.85}to{transform:scale(1.08) rotate(-2deg) translateY(-16px);opacity:1}}
          @keyframes pL{0%{transform:scale(1.08) rotate(-2deg) translateY(-16px);opacity:1}30%{transform:scale(1.10) rotate(5deg) translateY(-30px);opacity:1}100%{transform:scale(0.28) rotate(16deg) translateY(130px);opacity:0}}
          @keyframes fU{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `0 ${VISUAL.page.horizontalPadding}px ${VISUAL.page.bottomClearance}px`, background: 'rgba(2,8,18,0.97)', backdropFilter: 'blur(22px)' }}>
      <div style={{ width: '100%', maxWidth: VISUAL.page.contentMaxWidth, marginBottom: SP.xl - 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm }}>
        <WathinWave w={40} a={0.34} sw={1.9} />
        <h1 style={{ fontFamily: FONT_BODY, fontSize: VISUAL.message.titleSize, fontWeight: 400, color: 'rgba(245,249,255,0.95)', letterSpacing: VISUAL.message.titleTracking, margin: 0 }}>船訊</h1>
        <p style={{ fontFamily: FONT_BODY, fontSize: VISUAL.message.subtitleSize, color: 'rgba(159,182,204,0.42)', letterSpacing: '0.16em', margin: 0 }}>寫下一句想放進河裡的話</p>
      </div>

      <div style={{ width: '100%', maxWidth: VISUAL.page.contentMaxWidth, animation: shake ? 'eShk 0.46s cubic-bezier(0.36,0.07,0.19,0.97) forwards' : 'none' }}>
        <textarea ref={ta} value={text} aria-label="想放進河裡的話" aria-describedby="message-feedback"
          onChange={e => { setText(e.target.value); setErr(''); }}
          onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(); }}
          maxLength={120}
          style={{ width: '100%', minHeight: VISUAL.message.textareaMinHeight, background: 'rgba(7,26,58,0.50)', border: `1.5px solid ${err ? 'rgba(255,100,55,0.44)' : 'rgba(207,232,255,0.10)'}`, borderRadius: VISUAL.message.textareaRadius, color: COLOR.text, fontFamily: FONT_BODY, fontSize: VISUAL.message.textareaFontSize, lineHeight: VISUAL.message.textareaLineHeight, letterSpacing: '0.07em', padding: `${SP.lg - 2}px`, resize: 'none', outline: 'none', boxSizing: 'border-box', caretColor: COLOR.water, transition: 'border-color 0.20s' }} />
      </div>

      <div style={{ width: '100%', maxWidth: VISUAL.page.contentMaxWidth, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: SP.sm, minHeight: 30 }}>
        <p id="message-feedback" role="status" aria-live="polite" style={{ fontFamily: FONT_BODY, fontSize: 12, color: 'rgba(207,232,255,0.44)', lineHeight: 1.75, whiteSpace: 'pre-line', flex: 1, paddingRight: SP.md, opacity: err ? 1 : 0, transition: 'opacity 0.20s' }}>{err || ' '}</p>
        <span style={{ fontSize: 12, color: cClr, fontFamily: 'monospace', flexShrink: 0, transition: 'color 0.26s', paddingTop: 1 }}>{text.length}/120</span>
      </div>

      <button onClick={submit} disabled={!text.trim() || sending} aria-busy={sending} style={{
        marginTop: SP.md + 1, width: '100%', maxWidth: VISUAL.page.contentMaxWidth, padding: '17px 0',
        background: text.trim() ? `linear-gradient(135deg, ${COLOR.blue}EB, ${COLOR.navy}F8)` : 'rgba(7,26,58,0.28)',
        border: `1.5px solid ${text.trim() ? 'rgba(207,232,255,0.22)' : 'rgba(18,59,99,0.22)'}`,
        borderRadius: 100,
        color: text.trim() ? 'rgba(207,232,255,0.97)' : 'rgba(159,182,204,0.20)',
        fontFamily: FONT_BODY, fontSize: 15, letterSpacing: '0.18em',
        cursor: text.trim() && !sending ? 'pointer' : 'default',
        boxShadow: text.trim() ? '0 4px 28px rgba(9,36,86,0.62)' : 'none',
        transition: 'all 0.20s',
      }}
      onMouseEnter={e => { if (text.trim()) e.currentTarget.style.borderColor = 'rgba(207,232,255,0.48)'; }}
      onMouseLeave={e => { if (text.trim()) e.currentTarget.style.borderColor = 'rgba(207,232,255,0.22)'; }}>
        {sending ? '放流中…' : '放進河流'}
      </button>

      <p style={{ width: '100%', maxWidth: VISUAL.page.contentMaxWidth, fontFamily: FONT_BODY, fontSize: 11, color: 'rgba(159,182,204,0.24)', marginTop: SP.base, letterSpacing: '0.10em', textAlign: 'center', lineHeight: 2 }}>不留下私人資訊、聯絡方式或腥羶色內容。</p>
      <NavBar active="message" onNavigate={onNavigate} shoreCount={shoreCount} />
      <style>{`@keyframes eShk{0%,100%{transform:translateX(0)}18%{transform:translateX(-8px)}36%{transform:translateX(8px)}54%{transform:translateX(-5px)}72%{transform:translateX(5px)}88%{transform:translateX(-3px)}}`}</style>
    </div>
  );
}
