import { useEffect, useRef } from 'react';
import Human from './Human.jsx';
import rocketUrl from './assets/rocket.svg';
import chartBarUrl from './assets/chart-bar.svg';
import anthropicIconUrl from './assets/anthropic-icon.svg';

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function easeOutCubic(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }

const SCENES = [
  { id: 'hook', start: 0, duration: 3.0 },
  { id: 'stat', start: 3.0, duration: 3.0 },
  { id: 'brand', start: 6.0, duration: 3.0 },
  { id: 'cta', start: 9.0, duration: 2.0 },
];
const DURATION_SEC = SCENES.reduce((m, s) => Math.max(m, s.start + s.duration), 0);

/**
 * React owns composition only — the tree below mounts ONCE. All per-frame
 * motion is imperative DOM mutation via refs inside window.__seek(t), same
 * contract as the plain-HTML reels (see reel-anthropic-opus-5-5/reel.html).
 * This avoids React re-render/reconciliation cost on every one of the
 * ~600-2200 frames a render steps through.
 */
export default function Reel() {
  const refs = useRef({});
  const set = (key) => (el) => { refs.current[key] = el; };

  useEffect(() => {
    window.__reelDurationSec = DURATION_SEC;

    window.__seek = (t) => {
      SCENES.forEach((scene) => {
        const localT = clamp(t - scene.start, 0, scene.duration);
        const active = t >= scene.start && t < scene.start + scene.duration;
        const el = refs.current[scene.id];
        if (!el) return;
        el.style.display = active ? 'flex' : 'none';
        if (active) renderScene(scene.id, localT, refs.current);
      });

      const progress = refs.current.progress;
      if (progress) progress.style.width = `${100 * clamp(t / DURATION_SEC, 0, 1)}%`;
    };

    return () => { delete window.__seek; delete window.__reelDurationSec; };
  }, []);

  return (
    <div style={styles.canvas}>
      <div style={styles.bgWash} />

      <div ref={set('hook')} style={styles.scene}>
        <div ref={set('hookHuman')} style={{ willChange: 'transform,opacity' }}>
          <Human size={340} />
        </div>
        <img ref={set('hookRocket')} src={rocketUrl} alt="" style={{ width: 260, marginTop: 10, willChange: 'transform,opacity' }} />
        <div ref={set('hookHeadline')} style={styles.headline}>Meet your new AI teammate.</div>
      </div>

      <div ref={set('stat')} style={styles.scene}>
        <img ref={set('statIcon')} src={chartBarUrl} alt="" style={{ width: 140, filter: 'invert(1)', willChange: 'transform,opacity' }} />
        <div ref={set('statNumber')} style={styles.stat}>0x</div>
        <div style={styles.sub}>faster agentic workflows</div>
      </div>

      <div ref={set('brand')} style={styles.scene}>
        <img ref={set('brandIcon')} src={anthropicIconUrl} alt="" style={{ width: 160, filter: 'invert(1)', willChange: 'transform,opacity' }} />
        <div ref={set('brandText')} style={styles.headline}>Built on Claude.</div>
      </div>

      <div ref={set('cta')} style={styles.scene}>
        <div ref={set('ctaCard')} style={styles.card}>
          <img src={`${import.meta.env.BASE_URL}profile.jpg`} alt="" style={styles.profilePic} />
          <div style={styles.ctaMain}>@sandesh.explains</div>
        </div>
      </div>

      <div style={styles.progressTrack}><div ref={set('progress')} style={styles.progressFill} /></div>
    </div>
  );
}

function renderScene(id, t, refs) {
  const entrance = easeOutCubic(t / 0.5);
  const pulse = 1 + 0.03 * Math.sin(t * 2);

  if (id === 'hook') {
    apply(refs.hookHuman, entrance, pulse, -20);
    apply(refs.hookRocket, easeOutCubic((t - 0.2) / 0.5), 1 + 0.04 * Math.sin(t * 2.4), 16);
    apply(refs.hookHeadline, easeOutCubic((t - 0.4) / 0.5), pulse, 20);
  }
  if (id === 'stat') {
    apply(refs.statIcon, entrance, pulse, -16);
    if (refs.statNumber) refs.statNumber.textContent = `${Math.round(10 * easeOutCubic(t / 1.2))}x`;
    apply(refs.statNumber, easeOutCubic((t - 0.1) / 0.6), 1 + 0.02 * Math.sin(t * 2.2), 0);
  }
  if (id === 'brand') {
    apply(refs.brandIcon, entrance, 1 + 0.03 * Math.sin(t * 1.8), -16);
    apply(refs.brandText, easeOutCubic((t - 0.25) / 0.5), pulse, 20);
  }
  if (id === 'cta') {
    apply(refs.ctaCard, entrance, 1 + 0.02 * Math.sin(t * 1.8), 0);
  }
}

function apply(el, entrance, pulse, driftPx) {
  if (!el) return;
  const e = clamp(entrance, 0, 1);
  el.style.opacity = 0.3 + 0.7 * e;
  el.style.transform = `translateY(${driftPx * (1 - e)}px) scale(${(0.92 + 0.08 * e) * pulse})`;
}

const styles = {
  canvas: {
    position: 'relative', width: 1080, height: 1920, background: '#0e0e12',
    overflow: 'hidden', fontFamily: "'Poppins','Segoe UI',sans-serif",
  },
  bgWash: {
    position: 'absolute', inset: 0,
    background:
      'radial-gradient(ellipse 820px 620px at 24% 18%, rgba(96,64,214,0.34), transparent 62%),' +
      'radial-gradient(ellipse 900px 700px at 80% 82%, rgba(24,144,190,0.28), transparent 62%),' +
      'linear-gradient(180deg,#0e0e12,#15121f 50%,#0e0e12)',
  },
  scene: {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', gap: 28, textAlign: 'center',
    padding: '0 60px',
  },
  headline: { color: '#fff', fontSize: 64, fontWeight: 700, willChange: 'transform,opacity' },
  sub: { color: '#9aa', fontSize: 40, fontWeight: 500 },
  stat: { color: '#ffb84d', fontSize: 120, fontWeight: 900, willChange: 'transform,opacity' },
  card: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 22, padding: '44px 60px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 20, willChange: 'transform,opacity',
  },
  profilePic: { width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.92)' },
  ctaMain: { color: '#fff', fontSize: 52, fontWeight: 800 },
  progressTrack: {
    position: 'absolute', bottom: 30, left: 40, right: 40, height: 4,
    background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', width: '0%', background: '#fff' },
};
