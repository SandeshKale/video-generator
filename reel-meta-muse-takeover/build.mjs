#!/usr/bin/env node
// Assembles reel.html for "Amazon Blocked It. Five Other Giants Didn't."
// from real files in assets/ — no hand-copied SVG.
//
// Visual system: "Signal Wave" — warm espresso-charcoal background, amber
// (adoption/gain) + violet (Meta/tech) duotone, concentric voice-ripple
// rings + drifting waveform-bar texture, chat-bubble cards with a tail,
// Plus Jakarta Sans display font. Deliberately distinct from every prior
// reel's system — approved from this reel's own mockup.mjs.
//
// Still applies the house rules that AREN'T about visual identity:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), scrubbed via progress(e)
//   - Hard safe-zone exclusion: nothing in top ~150px, bottom ~400px, right ~190px
//   - Real vendored fonts, off-white text, soft shadow for legibility
//   - A gap-filling "ripple-bridge" component (this reel's signal-bridge
//     equivalent) between every header band and its content band
//   - Subtle scene-to-scene crossfade transitions (TRANS window)
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);
async function read(p) { return readFile(p, 'utf8'); }

async function simpleIcon(name) {
  const src = await read(A(`icons/simple-icons/${name}.svg`));
  const paths = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="currentColor">${paths}</svg>`;
}
async function tablerIcon(name) {
  const src = await read(A(`icons/tabler/${name}.svg`));
  const paths = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g[^>]*>([\s\S]*)<\/g>\s*<\/svg>/);
  return `<svg viewBox="${inner[1]}" fill="currentColor">${inner[2].replace(/ fill="#[0-9a-fA-F]{3,6}"/g, '')}</svg>`;
}

function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function hexToHsl(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255, g = parseInt(hex.slice(2, 4), 16) / 255, b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}
function hslToHex(h, s, l) {
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => Math.round(clamp01(x) * 255).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}
function darkenHex(hex, amt) {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, clamp01(l - (amt || 0.1)));
}
async function humaaansFull(kind, name, overrides = {}) {
  const compName = name.split('-').map((p, i) => i === 0 ? p[0].toUpperCase() + p.slice(1) : p).join('');
  const src = await read(join(ROOT, `assets/illustrations/humaaans-react/${kind}/${name}/${compName}.js`));
  const defaults = {};
  const defBlockMatch = src.match(/\.defaultProps\s*=\s*\{([\s\S]*?)\};/);
  if (defBlockMatch) for (const m of defBlockMatch[1].matchAll(/(\w+):\s*'([^']*)'/g)) defaults[m[1]] = m[2];
  const colors = { ...defaults, ...overrides };
  const svgMatch = src.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  let body = svgMatch[1];
  body = body.replace(/\{darken\((\w+)\)\}/g, (_, key) => darkenHex(colors[key], 0.1));
  body = body.replace(/\{(\w+)\}/g, (_, key) => (key in colors ? colors[key] : '#000000'));
  return `<svg viewBox="0 0 380 480">${body}</svg>`;
}

async function main() {
  const [
    key, shield, shieldCheck, video, cpu, rocket, sparkles, users, check,
    microphone, wifi, lock, eye,
  ] = await Promise.all([
    'key', 'shield', 'shield-check', 'video', 'cpu', 'rocket', 'sparkles', 'users', 'check',
    'microphone', 'wifi', 'lock', 'eye',
  ].map(tablerIcon));

  const [meta, github] = await Promise.all(['meta', 'github'].map(simpleIcon));
  const [paypal, shopify] = await Promise.all([
    brandLogo('logos/gilbarbara/paypal.svg'),
    brandLogo('logos/gilbarbara/shopify.svg'),
  ]);

  // Two fresh humaaans poses, neither used in any prior reel.
  const humanHook = await humaaansFull('standing', 'standing-7', { coatColor: '#8b7bff', pantColor: '#241c14' });
  const humanCta = await humaaansFull('standing', 'standing-13', { coatColor: '#ffb84d', pantColor: '#241c14', shirtColor: '#f6efe6' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = {
    key, shield, shieldCheck, video, cpu, rocket, sparkles, users, check,
    microphone, wifi, lock, eye,
  };

  const html = buildHtml({ icons, meta, github, paypal, shopify, humanHook, humanCta, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function bubble(icon, label, id, variant) {
  return `<div class="bubble${variant ? ' ' + variant : ''}" id="${id}"><span class="bubble-icon">${icon}</span><span class="bubble-label">${label}</span></div>`;
}

function beatHead(current, total, id) {
  let dots = '';
  for (let i = 1; i <= total; i++) dots += `<span class="beat-dot${i <= current ? ' done' : ''}"></span>`;
  return `<div class="beat-head" id="${id}"><div class="mono-label" style="font-size:24px;">BEAT ${current} / ${total}</div><div class="beat-dots">${dots}</div></div>`;
}

function buildHtml({ icons: I, meta, github, paypal, shopify, humanHook, humanCta, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-meta-muse-takeover</title>
<style>
@font-face{font-family:'PlusJakarta';font-weight:700;src:url('../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'PlusJakarta';font-weight:800;src:url('../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #171310;
  --bg-2: #100d0a;
  --amber: #ffb84d;
  --violet: #8b7bff;
  --ink: #f6efe6;
  --ink-dim: #c2b6a8;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* ---- background: concentric voice-ripple rings + waveform bars, t-driven ---- */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.glow-amber{position:absolute;width:820px;height:820px;border-radius:50%;background:radial-gradient(circle, rgba(255,184,77,0.12), transparent 68%);}
.glow-violet{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle, rgba(139,123,255,0.14), transparent 68%);}
.ripples{position:absolute;inset:0;z-index:0;}
.ripple{position:absolute;border-radius:50%;border:2px solid rgba(255,184,77,0.14);top:50%;left:50%;}
.ripple.violet{border-color:rgba(139,123,255,0.14);}
.wavebars{position:absolute;left:0;right:0;top:150px;bottom:400px;z-index:0;display:flex;align-items:flex-end;justify-content:space-between;padding:0 40px;opacity:0.3;}
.wavebar{width:8px;border-radius:4px;background:linear-gradient(180deg, var(--amber), transparent);}
.wavebar.v{background:linear-gradient(180deg, var(--violet), transparent);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 42%, rgba(0,0,0,0.55) 100%);}

.safe{position:absolute;top:224px;left:0;right:190px;bottom:400px;z-index:1;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;position:relative;}

.beat-head{display:flex;flex-direction:column;align-items:center;gap:12px;will-change:transform,opacity;}
.beat-dots{display:flex;gap:10px;}
.beat-dot{width:12px;height:12px;border-radius:50%;background:rgba(255,184,77,0.16);border:1px solid rgba(255,184,77,0.32);}
.beat-dot.done{background:var(--amber);border-color:var(--amber);box-shadow:0 0 10px rgba(255,184,77,0.6);}

/* Ripple bridge: this reel's signal-bridge equivalent — a short vertical
   wire whose "pulse" is a small expanding ripple ring (echoing the voice-
   wave motif), feeding a typewriter-revealed line, then a blinking cursor.
   Fills the header-band -> content-band gap. */
.ripple-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;z-index:1;position:relative;padding:4px 0;}
.rb-wire{position:relative;width:2px;height:58px;background:linear-gradient(180deg, rgba(255,184,77,0.10), rgba(255,184,77,0.6), rgba(255,184,77,0.10));}
.rb-pulse{position:absolute;left:50%;top:0;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--amber);box-shadow:0 0 16px 4px rgba(255,184,77,0.6);opacity:0;}
.rb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#f3d9a8;letter-spacing:0.01em;min-height:36px;}
.rb-cursor{color:var(--amber);font-weight:700;margin-left:3px;}

.headline{font-family:'PlusJakarta',sans-serif;color:var(--ink);font-size:76px;font-weight:800;text-align:center;line-height:1.12;letter-spacing:-0.02em;width:100%;text-shadow:0 4px 14px rgba(0,0,0,.6), 0 0 24px rgba(255,184,77,0.10);will-change:transform,opacity;z-index:1;}
.headline .hi-amber{color:var(--amber);}
.headline .hi-violet{color:var(--violet);}
.sub{font-family:'Inter',sans-serif;color:var(--ink-dim);font-size:40px;font-weight:600;text-align:center;line-height:1.4;width:100%;text-shadow:0 3px 10px rgba(0,0,0,.45);will-change:transform,opacity;z-index:1;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:27px;letter-spacing:0.14em;color:var(--amber);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

/* Chat-bubble component — this reel's card/chip language: rounded card
   with a small tail, echoing "voice agent" conversation bubbles. */
.bubble{position:relative;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,184,77,0.35);border-radius:26px;padding:20px 30px;display:flex;align-items:center;gap:16px;width:100%;box-sizing:border-box;will-change:transform,opacity;}
.bubble::after{content:'';position:absolute;left:34px;bottom:-13px;width:0;height:0;border:13px solid transparent;border-top-color:rgba(255,184,77,0.35);border-bottom:0;}
.bubble.blocked{border-color:rgba(139,123,255,0.4);opacity:0.68;}
.bubble.blocked::after{border-top-color:rgba(139,123,255,0.4);}
.bubble-icon{width:40px;height:40px;flex:0 0 40px;color:var(--ink);}
.bubble-icon svg{width:100%;height:100%;}
.bubble-label{font-family:'JBMono',monospace;font-weight:700;font-size:27px;letter-spacing:0.02em;color:var(--ink);}

.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;z-index:1;}
.chip{font-family:'JBMono',monospace;display:flex;align-items:center;gap:14px;font-weight:700;font-size:26px;letter-spacing:0.03em;color:var(--amber);border:1.5px solid rgba(255,184,77,0.5);padding:18px 24px;background:rgba(255,184,77,0.07);will-change:transform,opacity;border-radius:24px;}
.chip-icon{width:30px;height:30px;flex:0 0 30px;}
.chip-icon svg{width:100%;height:100%;}
.chip.violet{color:var(--violet);border-color:rgba(139,123,255,0.5);background:rgba(139,123,255,0.08);}

.icon-badge{width:100%;height:100%;color:var(--ink);}
.icon-badge svg{width:100%;height:100%;}

.stat-big{font-family:'PlusJakarta',sans-serif;font-weight:800;font-size:200px;line-height:1;letter-spacing:-0.03em;color:var(--amber);text-shadow:0 8px 30px rgba(0,0,0,.6);will-change:transform,opacity;}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.08em;color:var(--ink-dim);text-transform:uppercase;margin-top:6px;will-change:transform,opacity;}

.cta-card{padding:50px 56px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,184,77,0.35);border-radius:26px;position:relative;}
.cta-card::after{content:'';position:absolute;left:44px;top:-13px;width:0;height:0;border:13px solid transparent;border-bottom-color:rgba(255,184,77,0.35);border-top:0;}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--amber);box-shadow:0 0 28px rgba(255,184,77,0.45);}
.cta-main{font-family:'PlusJakarta',sans-serif;color:var(--ink);font-size:52px;font-weight:800;letter-spacing:-0.02em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--amber);font-size:25px;font-weight:500;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(255,184,77,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--amber);width:0%;box-shadow:0 0 10px rgba(255,184,77,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="glow-amber" id="glowamber"></div>
  <div class="glow-violet" id="glowviolet"></div>
  <div class="ripples" id="ripples"></div>
  <div class="wavebars" id="wavebars"></div>
  <div class="vignette"></div>
</div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band-content">
      <div class="mono-label" id="s1eyebrow">// AI HARDWARE WATCH</div>
      <div class="headline" id="s1head">Amazon just blocked Meta's new <span class="hi-violet">AI agent.</span></div>
      <div class="sub" id="s1sub">Five other giants didn't.</div>
      <div class="icon-badge" id="s1human" style="width:280px;height:353px;margin-top:10px;">${humanHook}</div>
    </div>
  </div>

  <!-- SCENE 2: SETUP (MEET MUSE) 0:05-0:10 -->
  <div class="scene" id="sc2">
    <div class="band-content">
      <div class="icon-badge" id="s2icon" style="width:180px;height:180px;color:var(--violet);">${I.microphone}</div>
      <div class="headline" id="s2head" style="font-size:68px;">Meet <span class="hi-amber">Muse</span> — Meta's AI agent.</div>
      <div class="sub" id="s2sub">Viral experiment. Now, real hardware.</div>
    </div>
  </div>

  <!-- SCENE 3: THE DEVICE (CHARM) 0:10-0:17 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      ${beatHead(1, 5, 's3step')}
      <div class="headline" id="s3head" style="font-size:64px;">Meet <span class="hi-amber">Charm.</span></div>
    </div>
    <div class="ripple-bridge"><div class="rb-wire"><div class="rb-pulse" id="s3pulse"></div></div><div class="rb-readout"><span id="s3readout"></span><span class="rb-cursor" id="s3cursor">▌</span></div></div>
    <div class="band-content">
      <div class="icon-badge" id="s3icon" style="width:170px;height:170px;color:var(--amber);">${I.key}</div>
      <div class="sub" id="s3sub" style="font-size:40px;">A keychain device. Shipping December.</div>
      <div class="chip-row">
        <div class="chip" id="s3chip">"By far the fastest way to talk to your Muse." — Zuckerberg</div>
      </div>
    </div>
  </div>

  <!-- SCENE 4: THE GLASSES 0:17-0:24 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      ${beatHead(2, 5, 's4step')}
      <div class="headline" id="s4head" style="font-size:60px;">Coming to Meta's <span class="hi-violet">AI glasses.</span></div>
    </div>
    <div class="ripple-bridge"><div class="rb-wire"><div class="rb-pulse" id="s4pulse"></div></div><div class="rb-readout"><span id="s4readout"></span><span class="rb-cursor" id="s4cursor">▌</span></div></div>
    <div class="band-content">
      <div class="icon-badge" id="s4icon" style="width:170px;height:170px;color:var(--violet);">${I.eye}</div>
      <div class="bubble" id="s4bubble"><span class="bubble-icon">${I.shieldCheck}</span><span class="bubble-label">PRIVATE PROCESSING MODE</span></div>
      <div class="sub" id="s4sub" style="font-size:38px;">Excludes data from even Meta itself.</div>
    </div>
  </div>

  <!-- SCENE 5: THE BENCHMARK 0:24-0:32 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      ${beatHead(3, 5, 's5step')}
      <div class="headline" id="s5head" style="font-size:62px;">Muse Realtime <span class="hi-amber">Avatar.</span></div>
    </div>
    <div class="ripple-bridge"><div class="rb-wire"><div class="rb-pulse" id="s5pulse"></div></div><div class="rb-readout"><span id="s5readout"></span><span class="rb-cursor" id="s5cursor">▌</span></div></div>
    <div class="band-content">
      <div class="icon-badge" id="s5icon" style="width:160px;height:160px;color:var(--amber);">${I.video}</div>
      <div class="sub" id="s5sub" style="font-size:40px;">Synced voice, animated in real time.</div>
      <div class="chip-row">
        <div class="chip violet" id="s5chip1"><span class="chip-icon">${I.check}</span><span>BEAT RUNWAY</span></div>
        <div class="chip violet" id="s5chip2"><span class="chip-icon">${I.check}</span><span>BEAT HEYGEN</span></div>
      </div>
    </div>
  </div>

  <!-- SCENE 6: THE PARTNER RUSH 0:32-0:40 -->
  <div class="scene" id="sc6">
    <div class="band band-tight">
      ${beatHead(4, 5, 's6step')}
      <div class="headline" id="s6head" style="font-size:60px;">This week, Muse picked up:</div>
    </div>
    <div class="ripple-bridge"><div class="rb-wire"><div class="rb-pulse" id="s6pulse"></div></div><div class="rb-readout"><span id="s6readout"></span><span class="rb-cursor" id="s6cursor">▌</span></div></div>
    <div class="band-content" style="gap:20px;">
      ${bubble(paypal, 'PAYPAL', 's6b1')}
      ${bubble(I.users, 'WALMART · SHOPIFY', 's6b2')}
      ${bubble(github, 'GITHUB · BOX', 's6b3')}
    </div>
  </div>

  <!-- SCENE 7: THE ONE HOLDOUT 0:40-0:46 -->
  <div class="scene" id="sc7">
    <div class="band-content">
      <div class="mono-label" id="s7eyebrow">// SAME WEEK</div>
      <div class="icon-badge" id="s7icon" style="width:160px;height:160px;color:var(--violet);">${I.lock}</div>
      <div class="headline" id="s7head" style="font-size:66px;">Amazon moved to <span class="hi-violet">block access.</span></div>
      <div class="sub" id="s7sub">Everyone else is racing in.</div>
    </div>
  </div>

  <!-- SCENE 8: WHY IT MATTERS 0:46-0:52 -->
  <div class="scene" id="sc8">
    <div class="band-content">
      <div class="mono-label" id="s8eyebrow">// WHY IT MATTERS</div>
      <div class="headline" id="s8head" style="font-size:62px;">Meta was mocked for the metaverse for years.</div>
      <div class="sub" id="s8sub">Now it has the one thing every AI hardware maker wanted: an agent people actually use.</div>
    </div>
  </div>

  <!-- SCENE 9: STAT CALLOUT 0:52-0:56 -->
  <div class="scene" id="sc9">
    <div class="band-content" style="gap:14px;">
      <div class="mono-label" id="s9eyebrow">// STAT CALLOUT</div>
      <div class="stat-big" id="s9stat">5:1</div>
      <div class="stat-label" id="s9statlabel">giants joined · one giant blocked</div>
      <div class="sub" id="s9sub" style="margin-top:10px;">That's the scoreboard on Meta's biggest pivot yet.</div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:56-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="icon-badge" id="s10human" style="width:260px;height:328px;margin:20px auto 0;">${humanCta}</div>
    </div>
    <div class="ripple-bridge"><div class="rb-wire"><div class="rb-pulse" id="s10pulse"></div></div><div class="rb-readout"><span id="s10readout"></span><span class="rb-cursor" id="s10cursor">▌</span></div></div>
    <div class="band-content">
      <div class="cta-card" id="s10card">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="">
        <div class="cta-main">@sandesh.explains</div>
        <div class="cta-sub">AI NEWS THAT CHANGES HOW YOU BUILD</div>
      </div>
    </div>
  </div>

</div>

<div class="progress"><div class="progress-fill" id="progress"></div></div>

<script src="../assets/animations/gsap/gsap.min.js"></script>
<script>
function $(id){ return document.getElementById(id); }
function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }
function eoc(x){ x = clamp(x,0,1); return 1 - Math.pow(1-x,3); }

function enter(el, e, driftY, extraScale){
  if(!el) return;
  var ee = clamp(e,0,1);
  el.style.opacity = 0.25 + 0.75*ee;
  el.style.transform = 'translateY(' + (driftY*(1-ee)) + 'px) scale(' + ((0.92+0.08*ee) * (extraScale||1)) + ')';
}

var __entranceTl = new WeakMap();
function scrubTl(el, cacheKey, buildTl, e){
  if(!el || typeof gsap === 'undefined') return;
  var cached = __entranceTl.get(el);
  if(!cached || cached.key !== cacheKey){
    cached = { key: cacheKey, tl: buildTl() };
    __entranceTl.set(el, cached);
  }
  cached.tl.progress(clamp(e,0,1));
}
function dropIn(el, e, dropHeight, rotateDeg){
  scrubTl(el, 'drop:' + dropHeight + ':' + rotateDeg, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/3, ease: 'none' }, 0);
    tl.fromTo(el, { y: dropHeight || 0, rotation: rotateDeg || 0 },
                   { y: 0, rotation: 0, duration: 1, ease: 'bounce.out' }, 0);
    return tl;
  }, e);
}
function tumbleIn(el, e, rotateFromDeg){
  scrubTl(el, 'tumble:' + rotateFromDeg, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/2.4, ease: 'none' }, 0);
    tl.fromTo(el, { rotation: rotateFromDeg || 90, scale: 0.55 },
                   { rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }, 0);
    return tl;
  }, e);
}
function runIn(el, e, fromX){
  scrubTl(el, 'run:' + fromX, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/2.6, ease: 'none' }, 0);
    tl.fromTo(el, { x: fromX || 0, rotation: -7 },
                   { x: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 0);
    return tl;
  }, e);
}

// Ripple bridge: traveling pulse down the wire, then a terminal-style
// typewriter reveal of a scene-specific line, then a blinking cursor.
function rippleBridge(prefix, pulseEl, readoutEl, cursorEl, text, e, sceneT){
  if(!pulseEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  pulseEl.style.opacity = eoc(clamp((ee-0.05)/0.3,0,1)) * (1 - eoc(clamp((ee-0.55)/0.3,0,1)));
  pulseEl.style.top = (2 + 52*clamp((ee-0.05)/0.5,0,1)) + 'px';
  var typeE = clamp((ee-0.4)/0.5,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = prefix + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

// Concentric voice-ripple rings: a handful of expanding/fading rings per
// glow source, radius + opacity driven by t on a staggered loop — never
// CSS @keyframes, so the render loop's variable per-frame wall time
// never desyncs the motion.
var RIPPLE_SOURCES = [
  { cx: 200, cy: 260, color: 'amber', speed: 0.09 },
  { cx: 900, cy: 1500, color: 'violet', speed: 0.11 },
];
var RINGS_PER_SOURCE = 3;
var ripplesEl = $('ripples');
var ripDivs = [];
RIPPLE_SOURCES.forEach(function(src, si){
  for (var i = 0; i < RINGS_PER_SOURCE; i++) {
    var d = document.createElement('div');
    d.className = 'ripple' + (src.color === 'violet' ? ' violet' : '');
    ripplesEl.appendChild(d);
    ripDivs.push({ el: d, src: src, phaseOffset: i / RINGS_PER_SOURCE });
  }
});

// Waveform bars: 30 bars spanning the safe-zone width, height driven by a
// per-bar seed plus slow t-driven bob.
var BAR_N = 30;
var barSeeds = [];
for (var bi = 0; bi < BAR_N; bi++) {
  barSeeds.push({ h: 30 + ((bi * 53) % 170), v: bi % 3 === 0, speed: 0.5 + (bi % 5) * 0.12 });
}
var wavebarsEl = $('wavebars');
var barDivs = barSeeds.map(function(s){
  var d = document.createElement('div');
  d.className = 'wavebar' + (s.v ? ' v' : '');
  wavebarsEl.appendChild(d);
  return d;
});

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      enter($('s1eyebrow'), eoc(t/0.35), 14, 1);
      enter($('s1head'), eoc((t-0.25)/0.55), 22, 1);
      enter($('s1sub'), eoc((t-0.9)/0.45), 18, 1);
      runIn($('s1human'), (t-0.4)/0.55, 200);
  }},
  { start: 5, duration: 5, el: $('sc2'), render: function(t){
      dropIn($('s2icon'), t/0.5, -200, -8);
      enter($('s2head'), eoc((t-0.4)/0.5), 20, 1);
      enter($('s2sub'), eoc((t-0.85)/0.45), 16, 1);
  }},
  { start: 10, duration: 7, el: $('sc3'), render: function(t){
      enter($('s3step'), eoc(t/0.3), 12, 1);
      enter($('s3head'), eoc((t-0.15)/0.5), 20, 1);
      rippleBridge('> ', $('s3pulse'), $('s3readout'), $('s3cursor'), 'unboxing the Charm keychain...', (t-0.5)/1.1, t);
      dropIn($('s3icon'), (t-1.0)/0.5, -200, -6);
      enter($('s3sub'), eoc((t-1.5)/0.45), 16, 1);
      dropIn($('s3chip'), (t-1.9)/0.4, -110, 6);
  }},
  { start: 17, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4step'), eoc(t/0.3), 12, 1);
      enter($('s4head'), eoc((t-0.15)/0.5), 20, 1);
      rippleBridge('> ', $('s4pulse'), $('s4readout'), $('s4cursor'), 'syncing with AI glasses...', (t-0.5)/1.1, t);
      dropIn($('s4icon'), (t-1.0)/0.5, -200, -6);
      dropIn($('s4bubble'), (t-1.4)/0.4, -100, 0);
      enter($('s4sub'), eoc((t-1.9)/0.4), 16, 1);
  }},
  { start: 24, duration: 8, el: $('sc5'), render: function(t){
      enter($('s5step'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      rippleBridge('> ', $('s5pulse'), $('s5readout'), $('s5cursor'), 'running blind rater comparison...', (t-0.5)/1.1, t);
      dropIn($('s5icon'), (t-1.0)/0.5, -200, -6);
      enter($('s5sub'), eoc((t-1.5)/0.4), 16, 1);
      dropIn($('s5chip1'), (t-2.0)/0.4, -100, -6);
      dropIn($('s5chip2'), (t-2.2)/0.4, -100, 6);
  }},
  { start: 32, duration: 8, el: $('sc6'), render: function(t){
      enter($('s6step'), eoc(t/0.3), 12, 1);
      enter($('s6head'), eoc((t-0.15)/0.5), 20, 1);
      rippleBridge('> ', $('s6pulse'), $('s6readout'), $('s6cursor'), 'tallying new integration partners...', (t-0.5)/1.1, t);
      dropIn($('s6b1'), (t-1.0)/0.4, -140, -6);
      dropIn($('s6b2'), (t-1.25)/0.4, -140, 0);
      dropIn($('s6b3'), (t-1.5)/0.4, -140, 6);
  }},
  { start: 40, duration: 6, el: $('sc7'), render: function(t){
      enter($('s7eyebrow'), eoc(t/0.3), 12, 1);
      dropIn($('s7icon'), (t-0.3)/0.5, -180, 0);
      enter($('s7head'), eoc((t-0.9)/0.5), 20, 1);
      enter($('s7sub'), eoc((t-1.4)/0.4), 16, 1);
  }},
  { start: 46, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.35), 14, 1);
      enter($('s8head'), eoc((t-0.25)/0.55), 20, 1);
      enter($('s8sub'), eoc((t-0.95)/0.5), 16, 1);
  }},
  { start: 52, duration: 4, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s9stat'), (t-0.2)/0.5, -20);
      enter($('s9statlabel'), eoc((t-0.7)/0.4), 14, 1);
      enter($('s9sub'), eoc((t-1.05)/0.45), 16, 1);
  }},
  { start: 56, duration: 4, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.5, -180);
      rippleBridge('> ', $('s10pulse'), $('s10readout'), $('s10cursor'), 'connecting @sandesh.explains...', (t-0.15)/1.0, t);
      dropIn($('s10card'), (t-0.3)/0.5, -150, 0);
  }}
];

window.__reelDurationSec = 60.0;
var marker = $('marker');
var started = false;

var TRANS = 0.32;
window.__seek = function(t){
  if (!started) { marker.style.display='none'; started = true; }
  SCENES.forEach(function(scene, i){
    var raw = t - scene.start;
    var visible = raw >= -TRANS && raw < scene.duration;
    if (!visible) { scene.el.style.display = 'none'; return; }
    scene.el.style.display = 'flex';
    var op = 1, ty = 0;
    var isLast = i === SCENES.length - 1;
    if (raw < 0) {
      var ein = eoc((raw + TRANS) / TRANS);
      op = ein; ty = (1 - ein) * 22;
    } else if (!isLast && raw > scene.duration - TRANS) {
      var eout = eoc((scene.duration - raw) / TRANS);
      op = eout; ty = (1 - eout) * -22;
    }
    scene.el.style.opacity = op;
    scene.el.style.transform = 'translateY(' + ty + 'px)';
    scene.render(clamp(raw, 0, scene.duration));
  });
  $('progress').style.width = (100*clamp(t/window.__reelDurationSec,0,1)) + '%';

  // Background: glows drift on independent slow paths; voice-ripple rings
  // expand + fade on a staggered loop per source; waveform bars bob
  // gently — all t-driven, no CSS @keyframes.
  $('glowamber').style.left = (-180 + 100*Math.sin(t*0.12)) + 'px';
  $('glowamber').style.top = (-160 + 80*Math.cos(t*0.09)) + 'px';
  $('glowviolet').style.right = (-200 + 110*Math.sin(t*0.10 + 2)) + 'px';
  $('glowviolet').style.bottom = (180 + 90*Math.cos(t*0.14)) + 'px';

  ripDivs.forEach(function(r){
    var phase = (t * r.src.speed + r.phaseOffset) % 1;
    var maxR = 520;
    var radius = phase * maxR;
    r.el.style.width = (radius*2) + 'px';
    r.el.style.height = (radius*2) + 'px';
    r.el.style.left = r.src.cx + 'px';
    r.el.style.top = r.src.cy + 'px';
    r.el.style.marginLeft = (-radius) + 'px';
    r.el.style.marginTop = (-radius) + 'px';
    r.el.style.opacity = (1 - phase) * 0.5;
  });

  for (var bi = 0; bi < BAR_N; bi++) {
    var s = barSeeds[bi];
    var bob = 1 + 0.25 * Math.sin(t * s.speed * 6.283 + bi);
    barDivs[bi].style.height = (s.h * bob) + 'px';
  }
};

window.__autoplay = function(){
  var startTime = performance.now();
  function frame(){
    var t = (performance.now() - startTime) / 1000;
    if (t > window.__reelDurationSec) t = 0, startTime = performance.now();
    window.__seek(t);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
if (window.location.search.includes('autoplay')) window.__autoplay();
else window.__seek(0);
</script>
</body>
</html>`;
}

main();
