#!/usr/bin/env node
// Assembles reel.html for "OpenAI Wants $500/Month For ChatGPT" from real
// files in assets/ — no hand-copied SVG.
//
// Visual system: "Price Tag" — cool near-black (blue undertone) background,
// platinum-silver + crimson duotone, an ascending monotonic "price
// staircase" bar texture (distinct from price-war's up/down candlesticks),
// angular price-tag cards (notch + punch hole), Unbounded display font
// (new to this repo, weights 800/900). Approved from this reel's own
// mockup.mjs (mockup-scene1/3/9.png).
//
// House rules that AREN'T about visual identity, still applied:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), scrubbed via progress(e)
//   - Hard safe-zone exclusion: nothing in top ~224px, bottom ~400px, right ~190px
//   - Real vendored fonts, off-white text, soft shadow for legibility
//   - A gap-filling "ledger-bridge" component (this reel's signal-bridge
//     equivalent) between every header band and its content band
//   - Subtle scene-to-scene crossfade transitions (TRANS window)
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);
async function read(p) { return readFile(p, 'utf8'); }

async function tablerIcon(name) {
  const src = await read(A(`icons/tabler/${name}.svg`));
  const paths = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
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
  const [lock, trendingUp, calendar, puzzle, chartLine, gauge, sparkles, cash, clock] = await Promise.all(
    ['lock', 'trending-up', 'calendar', 'puzzle', 'chart-line', 'gauge', 'sparkles', 'cash', 'clock'].map(tablerIcon)
  );

  // Two fresh humaaans poses, unused in any prior reel (used so far across
  // this repo: old reel-app figure, standing-9/16, standing-3/20,
  // standing-7/13). This reel: standing-1 (hook, approved in mockup) and
  // standing-5 (CTA, fresh).
  const humanHook = await humaaansFull('standing', 'standing-1', { coatColor: '#ff2d55', pantColor: '#0d0f14' });
  const humanCta = await humaaansFull('standing', 'standing-5', { coatColor: '#d8dee8', pantColor: '#171a20', shirtColor: '#f3f5f9' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = { lock, trendingUp, calendar, puzzle, chartLine, gauge, sparkles, cash, clock };

  const html = buildHtml({ icons, humanHook, humanCta, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function priceTag(label, value, hi, id, active) {
  return `<div class="price-tag${active ? ' active' : ''}" id="${id}"><div class="price-tag-row"><span class="price-tag-label">${label}</span><span class="price-tag-value${hi ? ' hi' : ''}">${value}</span></div></div>`;
}
function tagChip(icon, label, id, variant) {
  return `<div class="tag-chip${variant ? ' ' + variant : ''}" id="${id}"><span class="tag-chip-icon">${icon}</span><span class="tag-chip-label">${label}</span></div>`;
}
function stairs(id, extraClass) {
  let bars = '';
  for (let i = 0; i < 20; i++) {
    const h = 30 + i * 14;
    const crimson = i % 4 === 3;
    bars += `<div class="stair ${crimson ? 'crimson' : 'silver'}" style="height:${h}px;"></div>`;
  }
  return `<div class="stairs${extraClass ? ' ' + extraClass : ''}" id="${id}">${bars}</div>`;
}
function ledgerBridge(id) {
  return `<div class="ledger-bridge"><div class="lg-wire"><div class="lg-pulse" id="${id}pulse"></div></div><div class="lg-readout"><span id="${id}readout"></span><span class="lg-cursor" id="${id}cursor">_</span></div></div>`;
}

function buildHtml({ icons: I, humanHook, humanCta, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-openai-pro-max</title>
<style>
@font-face{font-family:'Unbounded';font-weight:800;src:url('../assets/fonts/unbounded/unbounded-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Unbounded';font-weight:900;src:url('../assets/fonts/unbounded/unbounded-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #0b0d12;
  --bg-2: #06070a;
  --silver: #d8dee8;
  --crimson: #ff2d55;
  --ink: #f3f5f9;
  --ink-dim: #8d97a8;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* ---- background: ascending price-staircase bars + fine grid, t-driven ---- */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;background:
  radial-gradient(ellipse 900px 700px at 20% 15%, rgba(255,45,85,0.10), transparent 60%),
  radial-gradient(ellipse 900px 900px at 85% 80%, rgba(216,222,232,0.08), transparent 60%),
  var(--bg);}
.grid-fine{position:absolute;inset:0;z-index:0;opacity:0.35;background-image:
  repeating-linear-gradient(0deg, rgba(216,222,232,0.05) 0px, rgba(216,222,232,0.05) 1px, transparent 1px, transparent 84px),
  repeating-linear-gradient(90deg, rgba(216,222,232,0.05) 0px, rgba(216,222,232,0.05) 1px, transparent 1px, transparent 84px);}
.stairs{position:absolute;left:0;right:0;bottom:0;height:400px;z-index:0;display:flex;align-items:flex-end;justify-content:space-between;padding:0 32px;opacity:0.42;}
.stair{width:26px;border-radius:3px 3px 0 0;}
.stair.silver{background:linear-gradient(180deg, var(--silver), transparent);}
.stair.crimson{background:linear-gradient(180deg, var(--crimson), transparent);}
.stairs-top{position:absolute;left:0;right:0;top:0;height:280px;z-index:0;display:flex;align-items:flex-start;justify-content:space-between;padding:0 32px;opacity:0.16;transform:scaleY(-1);}
.vignette{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 14%, transparent 80%, rgba(0,0,0,0.6) 100%);pointer-events:none;}

.safe{position:absolute;top:224px;left:0;right:190px;bottom:400px;z-index:2;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--crimson);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.headline{font-family:'Unbounded',sans-serif;font-weight:800;font-size:74px;line-height:1.16;letter-spacing:-0.01em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.6);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.headline .hi-crimson{color:var(--crimson);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:40px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

/* Ledger bridge: this reel's signal-bridge equivalent — a short vertical
   dashed "receipt wire" whose pulse is a small printer-head square,
   feeding a terminal-style typewriter line, then a blinking underscore
   cursor. Fills the header-band -> content-band gap. */
.ledger-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;z-index:1;position:relative;padding:4px 0;}
.lg-wire{position:relative;width:2px;height:58px;background:repeating-linear-gradient(180deg, rgba(216,222,232,0.5) 0, rgba(216,222,232,0.5) 6px, transparent 6px, transparent 12px);}
.lg-pulse{position:absolute;left:50%;top:0;width:10px;height:10px;margin-left:-5px;background:var(--crimson);box-shadow:0 0 16px 4px rgba(255,45,85,0.6);opacity:0;}
.lg-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#e8d6db;letter-spacing:0.01em;min-height:36px;}
.lg-cursor{color:var(--crimson);font-weight:700;margin-left:3px;}

/* Price-tag component — angular card with a pronounced notch + punch hole,
   this reel's card/chip language. Notch widened from an early draft (28px)
   to 46px and the punch hole enlarged + given real contrast so it reads
   clearly as a price tag, not a plain rectangle. */
.price-tag{position:relative;background:rgba(255,255,255,0.045);border:1.5px solid rgba(216,222,232,0.28);padding:28px 44px 28px 80px;margin:12px 0;width:100%;max-width:760px;box-sizing:border-box;
  clip-path:polygon(46px 0, 100% 0, 100% 100%, 46px 100%, 0 50%);will-change:transform,opacity;}
.price-tag::before{content:'';position:absolute;left:20px;top:50%;width:20px;height:20px;margin-top:-10px;border-radius:50%;background:var(--bg-2);border:2px solid rgba(216,222,232,0.55);box-shadow:inset 0 0 0 3px var(--bg-2);}
.price-tag-row{display:flex;justify-content:space-between;align-items:baseline;}
.price-tag-label{font-family:'Inter',sans-serif;font-weight:600;font-size:34px;color:var(--ink-dim);}
.price-tag-value{font-family:'JBMono',monospace;font-weight:700;font-size:42px;color:var(--ink);}
.price-tag-value.hi{color:var(--crimson);font-size:52px;}
.price-tag.active{border-color:var(--crimson);box-shadow:0 0 30px rgba(255,45,85,0.28);}
.price-tag.active::before{border-color:var(--crimson);}

.tag-chip{font-family:'JBMono',monospace;position:relative;display:flex;align-items:center;gap:16px;font-weight:700;font-size:27px;letter-spacing:0.02em;color:var(--ink);border:1.5px solid rgba(216,222,232,0.4);padding:20px 30px 20px 46px;background:rgba(255,255,255,0.04);will-change:transform,opacity;
  clip-path:polygon(18px 0, 100% 0, 100% 100%, 18px 100%, 0 50%);width:100%;max-width:720px;box-sizing:border-box;}
.tag-chip.crimson{color:var(--crimson);border-color:rgba(255,45,85,0.5);background:rgba(255,45,85,0.08);}
.tag-chip-icon{width:32px;height:32px;flex:0 0 32px;}
.tag-chip-icon svg{width:100%;height:100%;}

.icon-badge{width:100%;height:100%;color:var(--ink);}
.icon-badge svg{width:100%;height:100%;}

.stat-big{font-family:'Unbounded',sans-serif;font-weight:900;font-size:192px;line-height:1;letter-spacing:-0.02em;color:var(--crimson);text-shadow:0 8px 30px rgba(0,0,0,.6);will-change:transform,opacity;}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.08em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;text-align:center;will-change:transform,opacity;}

.human-wrap{width:280px;height:353px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));will-change:transform,opacity;}
.human-wrap svg{width:100%;height:100%;}

.cta-card{padding:50px 56px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;background:rgba(255,255,255,0.045);border:1.5px solid rgba(216,222,232,0.3);position:relative;
  clip-path:polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px));}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--crimson);box-shadow:0 0 28px rgba(255,45,85,0.45);}
.cta-main{font-family:'Unbounded',sans-serif;color:var(--ink);font-size:48px;font-weight:800;letter-spacing:-0.01em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--crimson);font-size:24px;font-weight:500;letter-spacing:0.02em;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(216,222,232,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--crimson);width:0%;box-shadow:0 0 10px rgba(255,45,85,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="grid-fine"></div>
  ${stairs('stairsbot')}
  ${stairs('stairstop', 'stairs-top')}
  <div class="vignette"></div>
</div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band-content">
      <div class="eyebrow" id="s1eyebrow">// AI PRICING WATCH</div>
      <div class="headline" id="s1head">OpenAI is about to charge <span class="hi-crimson">$500</span> a month for ChatGPT.</div>
      <div class="sub" id="s1sub">That's 2.5x its current top tier.</div>
      <div class="human-wrap" id="s1human">${humanHook}</div>
      ${tagChip(I.lock, 'LEAKED — NOT YET ANNOUNCED', 's1chip', 'crimson')}
    </div>
  </div>

  <!-- SCENE 2: SETUP 0:05-0:10 -->
  <div class="scene" id="sc2">
    <div class="band-content">
      <div class="icon-badge" id="s2icon" style="width:170px;height:170px;color:var(--crimson);">${I.sparkles}</div>
      <div class="headline" id="s2head" style="font-size:64px;">Meet <span class="hi-crimson">ChatGPT Pro Max.</span></div>
      <div class="sub" id="s2sub">A new tier, leaked days before OpenAI's biggest event of the year.</div>
      ${tagChip(I.calendar, 'DEVDAY IN 4 DAYS', 's2chip')}
    </div>
  </div>

  <!-- SCENE 3: THE LADDER 0:10-0:17 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      <div class="eyebrow" id="s3eyebrow">// THE LADDER</div>
      <div class="headline" id="s3head" style="font-size:62px;">Four tiers. One <span class="hi-crimson">huge</span> jump.</div>
    </div>
    ${ledgerBridge('s3')}
    <div class="band-content" style="gap:2px;">
      ${priceTag('Free', '$0', false, 's3tag1')}
      ${priceTag('Plus', '$20', false, 's3tag2')}
      ${priceTag('Pro', '$200', false, 's3tag3')}
      ${priceTag('Pro Max', '$500', true, 's3tag4', true)}
    </div>
  </div>

  <!-- SCENE 4: THE MYSTERY 0:17-0:24 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      <div class="eyebrow" id="s4eyebrow">// THE MYSTERY</div>
      <div class="headline" id="s4head" style="font-size:58px;">Nobody knows what <span class="hi-crimson">$500</span> buys.</div>
    </div>
    ${ledgerBridge('s4')}
    <div class="band-content" style="gap:16px;">
      <div class="icon-badge" id="s4icon" style="width:120px;height:120px;color:var(--crimson);">${I.puzzle}</div>
      ${tagChip(I.gauge, 'FASTER RESPONSES?', 's4chip1')}
      ${tagChip(I.chartLine, 'BIGGER USAGE LIMITS?', 's4chip2')}
      ${tagChip(I.clock, 'LONGER "WORK" SESSIONS?', 's4chip3')}
    </div>
  </div>

  <!-- SCENE 5: THE TIMING 0:24-0:31 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      <div class="eyebrow" id="s5eyebrow">// THE TIMING</div>
      <div class="headline" id="s5head" style="font-size:58px;">The leak lands <span class="hi-crimson">4 days</span> before DevDay.</div>
    </div>
    ${ledgerBridge('s5')}
    <div class="band-content">
      <div class="icon-badge" id="s5icon" style="width:150px;height:150px;color:var(--silver);">${I.calendar}</div>
      <div class="sub" id="s5sub" style="font-size:38px;">OpenAI's showcase for APIs, dev tooling, and new subscription tiers.</div>
    </div>
  </div>

  <!-- SCENE 6: THE PARALLEL 0:31-0:39 -->
  <div class="scene" id="sc6">
    <div class="band band-tight">
      <div class="eyebrow" id="s6eyebrow">// SAME WEEK</div>
      <div class="headline" id="s6head" style="font-size:56px;">DeepSeek raised its API prices <span class="hi-crimson">2.3–4.5x.</span></div>
    </div>
    ${ledgerBridge('s6')}
    <div class="band-content">
      <div class="icon-badge" id="s6icon" style="width:130px;height:130px;color:var(--crimson);">${I.chartLine}</div>
      ${tagChip(I.cash, 'RESULT: $1B REVENUE RUN RATE', 's6chip', 'crimson')}
    </div>
  </div>

  <!-- SCENE 7: THE READ 0:39-0:45 -->
  <div class="scene" id="sc7">
    <div class="band-content">
      <div class="eyebrow" id="s7eyebrow">// THE READ</div>
      <div class="icon-badge" id="s7icon" style="width:150px;height:150px;color:var(--silver);">${I.trendingUp}</div>
      <div class="headline" id="s7head" style="font-size:62px;">Demand held anyway.</div>
      <div class="sub" id="s7sub">Across the board, AI pricing is climbing — and people are paying it.</div>
    </div>
  </div>

  <!-- SCENE 8: THE PATTERN 0:45-0:51 -->
  <div class="scene" id="sc8">
    <div class="band-content">
      <div class="eyebrow" id="s8eyebrow">// THE PATTERN</div>
      <div class="icon-badge" id="s8icon" style="width:140px;height:140px;color:var(--crimson);">${I.gauge}</div>
      <div class="headline" id="s8head" style="font-size:58px;">From open-source challengers to frontier labs:</div>
      <div class="sub" id="s8sub">the ceiling on what people will pay keeps moving up.</div>
    </div>
  </div>

  <!-- SCENE 9: STAT CALLOUT 0:51-0:55 -->
  <div class="scene" id="sc9">
    <div class="band-content" style="gap:12px;">
      <div class="eyebrow" id="s9eyebrow">// STAT CALLOUT</div>
      <div class="stat-big" id="s9stat">2.5x</div>
      <div class="stat-label" id="s9statlabel">the current top tier · $500 / month</div>
      <div class="sub" id="s9sub" style="margin-top:10px;">That's the new number to watch.</div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="human-wrap" id="s10human" style="width:260px;height:328px;margin:20px auto 0;">${humanCta}</div>
    </div>
    ${ledgerBridge('s10')}
    <div class="band-content">
      <div class="cta-card" id="s10card">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="">
        <div class="cta-main">@sandesh.explains</div>
        <div class="cta-sub">AI NEWS THAT ACTUALLY CHANGES HOW YOU BUILD</div>
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

// Ledger bridge: a printer-head pulse travels down a dashed "receipt wire",
// then a terminal-style typewriter reveal of a scene-specific line, then a
// blinking underscore cursor.
function ledgerBridge(pulseEl, readoutEl, cursorEl, text, e, sceneT){
  if(!pulseEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  pulseEl.style.opacity = eoc(clamp((ee-0.05)/0.3,0,1)) * (1 - eoc(clamp((ee-0.55)/0.3,0,1)));
  pulseEl.style.top = (2 + 52*clamp((ee-0.05)/0.5,0,1)) + 'px';
  var typeE = clamp((ee-0.4)/0.5,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = '> ' + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      enter($('s1eyebrow'), eoc(t/0.35), 14, 1);
      enter($('s1head'), eoc((t-0.25)/0.55), 22, 1);
      enter($('s1sub'), eoc((t-0.9)/0.45), 18, 1);
      runIn($('s1human'), (t-1.2)/0.5, -180);
      dropIn($('s1chip'), (t-1.7)/0.4, -110, 4);
  }},
  { start: 5, duration: 5, el: $('sc2'), render: function(t){
      dropIn($('s2icon'), t/0.5, -200, -8);
      enter($('s2head'), eoc((t-0.4)/0.5), 20, 1);
      enter($('s2sub'), eoc((t-0.85)/0.5), 16, 1);
      dropIn($('s2chip'), (t-1.5)/0.4, -100, -4);
  }},
  { start: 10, duration: 7, el: $('sc3'), render: function(t){
      enter($('s3eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s3head'), eoc((t-0.15)/0.5), 20, 1);
      ledgerBridge($('s3pulse'), $('s3readout'), $('s3cursor'), 'calculating price-per-tier delta...', (t-0.5)/1.1, t);
      runIn($('s3tag1'), (t-1.0)/0.35, -260);
      runIn($('s3tag2'), (t-1.3)/0.35, -260);
      runIn($('s3tag3'), (t-1.6)/0.35, -260);
      runIn($('s3tag4'), (t-1.95)/0.4, -260);
  }},
  { start: 17, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s4head'), eoc((t-0.15)/0.5), 20, 1);
      ledgerBridge($('s4pulse'), $('s4readout'), $('s4cursor'), 'parsing leaked feature list...', (t-0.5)/1.1, t);
      tumbleIn($('s4icon'), (t-1.0)/0.5, -140);
      dropIn($('s4chip1'), (t-1.5)/0.35, -100, -4);
      dropIn($('s4chip2'), (t-1.8)/0.35, -100, 0);
      dropIn($('s4chip3'), (t-2.1)/0.35, -100, 4);
  }},
  { start: 24, duration: 7, el: $('sc5'), render: function(t){
      enter($('s5eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      ledgerBridge($('s5pulse'), $('s5readout'), $('s5cursor'), 'counting down to devday...', (t-0.5)/1.1, t);
      dropIn($('s5icon'), (t-1.0)/0.5, -200, -6);
      enter($('s5sub'), eoc((t-1.5)/0.45), 16, 1);
  }},
  { start: 31, duration: 8, el: $('sc6'), render: function(t){
      enter($('s6eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s6head'), eoc((t-0.15)/0.5), 20, 1);
      ledgerBridge($('s6pulse'), $('s6readout'), $('s6cursor'), 'cross-referencing deepseek pricing...', (t-0.5)/1.1, t);
      dropIn($('s6icon'), (t-1.0)/0.5, -200, -6);
      dropIn($('s6chip'), (t-1.5)/0.4, -110, 0);
  }},
  { start: 39, duration: 6, el: $('sc7'), render: function(t){
      enter($('s7eyebrow'), eoc(t/0.3), 12, 1);
      dropIn($('s7icon'), (t-0.3)/0.5, -180, 0);
      enter($('s7head'), eoc((t-0.9)/0.5), 20, 1);
      enter($('s7sub'), eoc((t-1.4)/0.45), 16, 1);
  }},
  { start: 45, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s8icon'), (t-0.3)/0.5, 140);
      enter($('s8head'), eoc((t-0.9)/0.5), 20, 1);
      enter($('s8sub'), eoc((t-1.4)/0.45), 16, 1);
  }},
  { start: 51, duration: 4, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s9stat'), (t-0.2)/0.5, -20);
      enter($('s9statlabel'), eoc((t-0.7)/0.4), 14, 1);
      enter($('s9sub'), eoc((t-1.05)/0.45), 16, 1);
  }},
  { start: 55, duration: 5, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.5, -180);
      ledgerBridge($('s10pulse'), $('s10readout'), $('s10cursor'), 'queuing @sandesh.explains...', (t-0.15)/1.0, t);
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
