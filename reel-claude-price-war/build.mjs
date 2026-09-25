#!/usr/bin/env node
// Assembles reel.html for "The Price Cut That Didn't Matter" from real
// files in assets/ — no hand-copied SVG.
//
// Visual system: "Market Ticker" — deep plum/aubergine background, lime
// (gain) + coral (burn) duotone accents, a scrolling ticker-tape marquee
// + drifting candlestick field for texture, perforated "ticket stub"
// data cards, and a rotated corner "stamp" badge. Deliberately distinct
// from reel-anthropic-rundown-ios (navy dot-grid, rounded cards, green/
// blue/amber) and reel-openai-loop-method (near-black graph-grid, clip-
// corner panels, cyan/magenta) — approved from this reel's own mockup.mjs.
//
// Still applies the house rules that AREN'T about visual identity:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), scrubbed via progress(e)
//   - Hard safe-zone exclusion: nothing in top ~150px, bottom ~400px, right ~190px
//   - Real vendored fonts (Sora/Inter/JetBrains Mono), off-white text,
//     soft shadow for legibility over the moving ticker/candlestick texture
//   - A gap-filling "ticker-bridge" component (this reel's signal-bridge
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
    alertTriangle, circleCheck, trendingUp, trendingDown, arrowRight, bulb,
    rocket, sparkles, target, search, coin, receipt, scale, chartBar, flame,
  ] = await Promise.all([
    'alert-triangle', 'circle-check', 'trending-up', 'trending-down', 'arrow-right', 'bulb',
    'rocket', 'sparkles', 'target', 'search', 'coin', 'receipt', 'scale', 'chart-bar', 'flame',
  ].map(tablerIcon));

  const [anthropic, openai] = await Promise.all([
    brandLogo('logos/gilbarbara/anthropic-icon.svg'),
    brandLogo('logos/gilbarbara/openai-icon.svg'),
  ]);

  // Two fresh humaaans poses, neither used in any prior reel (rundown-ios
  // used the old single reel-app figure; loop-method used standing-9/16).
  const humanTest = await humaaansFull('standing', 'standing-3', { coatColor: '#ff5d3a', pantColor: '#2a1030' });
  const humanCta = await humaaansFull('standing', 'standing-20', { coatColor: '#c6ff3d', pantColor: '#1b0f24', shirtColor: '#f3ecf7' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = {
    alertTriangle, circleCheck, trendingUp, trendingDown, arrowRight, bulb,
    rocket, sparkles, target, search, coin, receipt, scale, chartBar, flame,
  };

  const html = buildHtml({ icons, anthropic, openai, humanTest, humanCta, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function chip(icon, label, id, variant) {
  return `<div class="chip${variant ? ' ' + variant : ''}" id="${id}"><span class="chip-icon">${icon}</span><span>${label}</span></div>`;
}

// Checkpoint head — this reel's step/progress indicator, styled as a
// mono "CHECKPOINT N/5" eyebrow + a row of square ticker-style dots
// instead of loop-method's round step-dots.
function checkpointHead(current, total, id) {
  let dots = '';
  for (let i = 1; i <= total; i++) dots += `<span class="checkpoint-dot${i <= current ? ' done' : ''}"></span>`;
  return `<div class="checkpoint-head" id="${id}"><div class="mono-label" style="font-size:24px;">CHECKPOINT ${current} / ${total}</div><div class="checkpoint-dots">${dots}</div></div>`;
}

function tickerRow(n) {
  const items = [
    'GPT-6 SOL <span class="dn">-50%</span>', 'OPUS 5.5 <span class="up">BENCHMARK LEADER</span>',
    'CLAUDE CODE <span class="up">+20%</span> LIMITS', 'LUNA <span class="up">$0.10/$0.50</span>',
    'SOL <span class="up">$2/$10</span>', '<span class="dn">22% BUDGET</span> · 1 TASK · 4 HRS',
  ];
  let out = '';
  for (let i = 0; i < n; i++) out += items.map((s) => `<span class="tick">${s}</span>`).join('');
  return out;
}

function buildHtml({ icons: I, anthropic, openai, humanTest, humanCta, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-claude-price-war</title>
<style>
@font-face{font-family:'Sora';font-weight:700;src:url('../assets/fonts/sora/sora-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Sora';font-weight:800;src:url('../assets/fonts/sora/sora-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --plum: #1b0f24;
  --plum-2: #120a19;
  --lime: #c6ff3d;
  --coral: #ff5d3a;
  --ink: #f3ecf7;
  --ink-dim: #b7a8c4;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--plum);overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* ---- background: candlestick field + radial glows, all t-driven ---- */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.glow-lime{position:absolute;width:820px;height:820px;border-radius:50%;background:radial-gradient(circle, rgba(198,255,61,0.13), transparent 68%);}
.glow-coral{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle, rgba(255,93,58,0.14), transparent 68%);}
.candles{position:absolute;left:0;right:0;top:150px;bottom:400px;z-index:0;opacity:0.55;}
.candle{position:absolute;width:15px;border-radius:2px;}
.candle.up{background:linear-gradient(180deg, var(--lime), transparent);box-shadow:0 0 16px 2px rgba(198,255,61,0.22);}
.candle.down{background:linear-gradient(180deg, var(--coral), transparent);box-shadow:0 0 16px 2px rgba(255,93,58,0.18);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 42%, rgba(0,0,0,0.55) 100%);}

/* ---- scrolling ticker-tape marquee strips (top + bottom gutters) ---- */
.ticker{position:absolute;left:0;right:0;height:64px;z-index:0;overflow:hidden;background:rgba(0,0,0,0.30);border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);}
.ticker-top{top:150px;}
.ticker-bottom{top:1536px;}
.ticker-track{position:absolute;top:0;left:0;height:64px;display:flex;align-items:center;gap:48px;white-space:nowrap;font-family:'JBMono',monospace;font-weight:700;font-size:25px;letter-spacing:0.02em;padding-left:40px;color:var(--ink-dim);}
.tick .up{color:var(--lime);}
.tick .dn{color:var(--coral);}

.safe{position:absolute;top:224px;left:0;right:190px;bottom:400px;z-index:1;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;position:relative;}

.checkpoint-head{display:flex;flex-direction:column;align-items:center;gap:12px;will-change:transform,opacity;}
.checkpoint-dots{display:flex;gap:10px;}
.checkpoint-dot{width:13px;height:13px;background:rgba(198,255,61,0.16);border:1px solid rgba(198,255,61,0.32);}
.checkpoint-dot.done{background:var(--lime);border-color:var(--lime);box-shadow:0 0 10px rgba(198,255,61,0.6);}

/* Ticker bridge: this reel's signal-bridge equivalent — a short vertical
   "price feed" wire with a traveling pulse, feeding a typewriter-revealed
   ticker readout line specific to that scene's content, with a blinking
   cursor once typing finishes. Fills the checkpoint-head -> content gap. */
.ticker-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;z-index:1;position:relative;padding:4px 0;}
.tb-wire{position:relative;width:2px;height:60px;background:linear-gradient(180deg, rgba(198,255,61,0.10), rgba(198,255,61,0.6), rgba(198,255,61,0.10));}
.tb-pulse{position:absolute;left:50%;top:0;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--lime);box-shadow:0 0 16px 4px rgba(198,255,61,0.6);opacity:0;}
.tb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#e0f7a8;letter-spacing:0.01em;min-height:36px;}
.tb-cursor{color:var(--lime);font-weight:700;margin-left:3px;}

.headline{font-family:'Sora',sans-serif;color:var(--ink);font-size:78px;font-weight:800;text-align:center;line-height:1.1;letter-spacing:-0.025em;width:100%;text-shadow:0 4px 14px rgba(0,0,0,.6), 0 0 24px rgba(198,255,61,0.10);will-change:transform,opacity;z-index:1;}
.headline .hl-lime{color:var(--lime);}
.headline .hl-coral{color:var(--coral);}
.sub{font-family:'Inter',sans-serif;color:var(--ink-dim);font-size:41px;font-weight:600;text-align:center;line-height:1.4;width:100%;text-shadow:0 3px 10px rgba(0,0,0,.45);will-change:transform,opacity;z-index:1;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--lime);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;z-index:1;}
.chip{font-family:'JBMono',monospace;display:flex;align-items:center;gap:14px;font-weight:700;font-size:27px;letter-spacing:0.03em;color:var(--lime);border:1.5px solid rgba(198,255,61,0.5);padding:20px 26px;background:rgba(198,255,61,0.07);will-change:transform,opacity;border-radius:3px;}
.chip-icon{width:32px;height:32px;flex:0 0 32px;}
.chip.coral{color:var(--coral);border-color:rgba(255,93,58,0.5);background:rgba(255,93,58,0.07);}

.icon-badge{width:100%;height:100%;color:var(--ink);}
.icon-badge svg{width:100%;height:100%;}

/* Ticket-stub data card — perforated left edge + rotated corner stamp,
   this reel's component-language replacement for rounded cards / clip-
   corner panels. */
.ticket{position:relative;background:rgba(255,255,255,0.045);border:2px dashed rgba(255,255,255,0.22);border-radius:6px;padding:34px 38px 34px 54px;width:100%;box-sizing:border-box;will-change:transform,opacity;}
.ticket::before{content:'';position:absolute;left:-1px;top:0;bottom:0;width:1px;
  background-image: radial-gradient(circle 9px, var(--plum) 9px, transparent 10px);
  background-size: 100% 40px; background-position: left top; background-repeat: repeat-y;}
.stamp{position:absolute;top:-16px;right:22px;transform:rotate(6deg);background:var(--lime);color:#12210a;font-family:'JBMono',monospace;font-weight:700;font-size:21px;letter-spacing:0.05em;padding:6px 15px;border-radius:3px;box-shadow:0 4px 14px rgba(0,0,0,.4);}
.stamp.coral{background:var(--coral);color:#3a0f04;}
.ticket-row{display:flex;justify-content:space-between;align-items:baseline;margin:5px 0;gap:20px;}
.ticket-label{font-family:'Inter',sans-serif;font-weight:600;font-size:29px;color:var(--ink-dim);flex:0 0 auto;}
.ticket-value{font-family:'JBMono',monospace;font-weight:700;font-size:32px;color:var(--ink);text-align:right;}
.ticket-value.lime{color:var(--lime);}
.ticket-value.coral{color:var(--coral);}

.brand-badge{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;will-change:transform,opacity;}
.brand-badge svg{width:52px;height:52px;color:var(--ink);}
.brand-badge.win{border-color:var(--lime);box-shadow:0 0 26px rgba(198,255,61,0.4);}
.brand-badge.lose{border-color:var(--coral);opacity:0.62;}
.brand-badge-label{font-family:'JBMono',monospace;font-weight:700;font-size:22px;letter-spacing:0.06em;color:var(--ink-dim);text-align:center;margin-top:12px;}

.big-stat{font-family:'Sora',sans-serif;font-weight:800;font-size:220px;line-height:1;letter-spacing:-0.04em;color:var(--coral);text-shadow:0 8px 30px rgba(0,0,0,.6);will-change:transform,opacity;}
.big-stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.08em;color:var(--ink-dim);text-transform:uppercase;margin-top:6px;will-change:transform,opacity;}

.quote-mark{font-family:'Sora',sans-serif;font-weight:800;font-size:140px;color:var(--lime);line-height:0.6;opacity:0.55;will-change:transform,opacity;}
.quote-text{font-family:'Sora',sans-serif;font-weight:700;font-size:58px;line-height:1.28;letter-spacing:-0.015em;color:var(--ink);text-align:center;text-shadow:0 4px 14px rgba(0,0,0,.55);will-change:transform,opacity;}
.quote-attr{font-family:'JBMono',monospace;font-weight:700;font-size:26px;letter-spacing:0.08em;color:var(--lime);text-transform:uppercase;will-change:transform,opacity;}

.cta-ticket{padding:52px 58px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;}
.cta-pic{width:156px;height:156px;border-radius:50%;object-fit:cover;border:3px solid var(--lime);box-shadow:0 0 28px rgba(198,255,61,0.45);}
.cta-main{font-family:'Sora',sans-serif;color:var(--ink);font-size:54px;font-weight:800;letter-spacing:-0.02em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--lime);font-size:26px;font-weight:500;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(198,255,61,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--lime);width:0%;box-shadow:0 0 10px rgba(198,255,61,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="glow-lime" id="glowlime"></div>
  <div class="glow-coral" id="glowcoral"></div>
  <div class="candles" id="candles"></div>
  <div class="vignette"></div>
</div>
<div class="ticker ticker-top"><div class="ticker-track" id="tickTop">${tickerRow(4)}</div></div>
<div class="ticker ticker-bottom"><div class="ticker-track" id="tickBottom">${tickerRow(4)}</div></div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band-content">
      <div class="mono-label" id="s1eyebrow">// AI MARKET WATCH</div>
      <div class="headline" id="s1head">OpenAI cut prices <span class="hl-lime">50%.</span> Devs went back to <span class="hl-coral">Claude</span> anyway.</div>
      <div class="sub" id="s1sub">Here's the number that explains why.</div>
    </div>
  </div>

  <!-- SCENE 2: SETUP 0:05-0:10 -->
  <div class="scene" id="sc2">
    <div class="band band-tight">
      <div class="mono-label" id="s2eyebrow">// THIS WEEK, TWO THINGS HAPPENED</div>
    </div>
    <div class="ticker-bridge"><div class="tb-wire"><div class="tb-pulse" id="s2pulse"></div></div><div class="tb-readout"><span id="s2readout"></span><span class="tb-cursor" id="s2cursor">▌</span></div></div>
    <div class="band-content">
      <div style="display:flex;gap:64px;align-items:flex-start;justify-content:center;width:100%;">
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="brand-badge lose" id="s2openai">${openai}</div>
          <div class="brand-badge-label">GPT-6 SOL &amp; LUNA</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div class="brand-badge win" id="s2anthropic">${anthropic}</div>
          <div class="brand-badge-label">CLAUDE OPUS 5.5</div>
        </div>
      </div>
      <div class="headline" id="s2head" style="font-size:64px;">Both dropped the <span class="hl-lime">same week.</span></div>
    </div>
  </div>

  <!-- SCENE 3: THE PRICE CUT 0:10-0:17 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      ${checkpointHead(1, 5, 's3step')}
      <div class="headline" id="s3head" style="font-size:60px;">The price cut looked like an easy win.</div>
    </div>
    <div class="ticker-bridge"><div class="tb-wire"><div class="tb-pulse" id="s3pulse"></div></div><div class="tb-readout"><span id="s3readout"></span><span class="tb-cursor" id="s3cursor">▌</span></div></div>
    <div class="band-content">
      <div class="ticket" id="s3ticket">
        <div class="stamp">-50%</div>
        <div class="ticket-row"><span class="ticket-label">GPT-6 Luna</span><span class="ticket-value lime">$0.10 / $0.50</span></div>
        <div class="ticket-row"><span class="ticket-label">GPT-6 Sol</span><span class="ticket-value lime">$2 / $10</span></div>
        <div class="ticket-row"><span class="ticket-label">Per</span><span class="ticket-value">1M tokens, in/out</span></div>
      </div>
      <div class="sub" id="s3sub" style="font-size:38px;">Both 50% cheaper than before.</div>
    </div>
  </div>

  <!-- SCENE 4: THE CATCH 0:17-0:24 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      ${checkpointHead(2, 5, 's4step')}
      <div class="headline" id="s4head" style="font-size:64px;">But the intelligence gain? <span class="hl-coral">Minor.</span></div>
    </div>
    <div class="ticker-bridge"><div class="tb-wire"><div class="tb-pulse" id="s4pulse"></div></div><div class="tb-readout"><span id="s4readout"></span><span class="tb-cursor" id="s4cursor">▌</span></div></div>
    <div class="band-content">
      <div class="ticket" id="s4ticket">
        <div class="stamp coral">STEP BEHIND</div>
        <div class="ticket-row"><span class="ticket-label">GPT-6-Sol vs Opus 5.5</span><span class="ticket-value coral">Clearly behind</span></div>
        <div class="ticket-row"><span class="ticket-label">Same</span><span class="ticket-value">Newsletter, same week</span></div>
      </div>
      <div class="chip-row">
        ${chip(I.scale, 'CHEAPER, NOT SMARTER', 's4chip1', 'coral')}
      </div>
    </div>
  </div>

  <!-- SCENE 5: THE REAL TEST 0:24-0:33 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      ${checkpointHead(3, 5, 's5step')}
      <div class="headline" id="s5head" style="font-size:60px;">One builder pointed <span class="hl-coral">GPT-6-Sol</span> at a real task.</div>
    </div>
    <div class="ticker-bridge"><div class="tb-wire"><div class="tb-pulse" id="s5pulse"></div></div><div class="tb-readout"><span id="s5readout"></span><span class="tb-cursor" id="s5cursor">▌</span></div></div>
    <div class="band-content">
      <div style="display:flex;align-items:center;gap:18px;width:100%;">
        <div class="ticket" id="s5ticket" style="flex:1 1 auto;">
          <div class="stamp coral">4 HOURS</div>
          <div class="ticket-row"><span class="ticket-label">Task</span><span class="ticket-value">Build a course</span></div>
          <div class="ticket-row"><span class="ticket-label">Plan</span><span class="ticket-value">$100/mo Codex</span></div>
          <div class="ticket-row"><span class="ticket-label">Consumed</span><span class="ticket-value coral">22% weekly limit</span></div>
          <div class="ticket-row"><span class="ticket-label">Result</span><span class="ticket-value">"Decent" draft</span></div>
        </div>
        <div class="icon-badge" id="s5human" style="flex:0 0 210px;width:210px;height:265px;filter:drop-shadow(0 16px 24px rgba(0,0,0,.5));">${humanTest}</div>
      </div>
      <div class="chip-row">
        ${chip(I.alertTriangle, 'EXPENSIVE', 's5chip1', 'coral')}
        ${chip(I.trendingDown, '50% CHEAPER STICKER', 's5chip2')}
      </div>
    </div>
  </div>

  <!-- SCENE 6: MEANWHILE, CLAUDE 0:33-0:41 -->
  <div class="scene" id="sc6">
    <div class="band band-tight">
      ${checkpointHead(4, 5, 's6step')}
      <div class="headline" id="s6head" style="font-size:64px;">Meanwhile, <span class="hl-lime">Opus 5.5:</span></div>
    </div>
    <div class="ticker-bridge"><div class="tb-wire"><div class="tb-pulse" id="s6pulse"></div></div><div class="tb-readout"><span id="s6readout"></span><span class="tb-cursor" id="s6cursor">▌</span></div></div>
    <div class="band-content">
      <div class="ticket" id="s6ticket">
        <div class="stamp">WINNING</div>
        <div class="ticket-row"><span class="ticket-label">Benchmarks</span><span class="ticket-value lime">Beats Fable 5.1</span></div>
        <div class="ticket-row"><span class="ticket-label">Price</span><span class="ticket-value lime">Cheaper than Opus 5</span></div>
        <div class="ticket-row"><span class="ticket-label">Claude Code limits</span><span class="ticket-value lime">+20%</span></div>
        <div class="ticket-row"><span class="ticket-label">Rate limit reset</span><span class="ticket-value lime">Banked</span></div>
      </div>
    </div>
  </div>

  <!-- SCENE 7: THE VERDICT (QUOTE) 0:41-0:47 -->
  <div class="scene" id="sc7">
    <div class="band-content">
      <div class="quote-mark" id="s7mark">&ldquo;</div>
      <div class="quote-text" id="s7text">My go-to agent changed to Claude Code with this release.</div>
      <div class="quote-attr" id="s7attr">— Ben's Bites, this week</div>
    </div>
  </div>

  <!-- SCENE 8: THE BIGGER PATTERN 0:47-0:52 -->
  <div class="scene" id="sc8">
    <div class="band-content">
      <div class="mono-label" id="s8eyebrow">// THE PATTERN</div>
      <div class="headline" id="s8head" style="font-size:64px;">A 50% discount doesn't save you money if the model burns 4x the tokens.</div>
      <div class="chip-row">
        ${chip(I.target, 'EFFICIENCY BEAT THE DISCOUNT', 's8chip1')}
      </div>
    </div>
  </div>

  <!-- SCENE 9: STAT CALLOUT 0:52-0:56 -->
  <div class="scene" id="sc9">
    <div class="band-content" style="gap:16px;">
      <div class="mono-label" id="s9eyebrow">// STAT CALLOUT</div>
      <div class="big-stat" id="s9stat">22%</div>
      <div class="big-stat-label" id="s9statlabel">of a monthly budget · one task · four hours</div>
      <div class="sub" id="s9sub" style="margin-top:12px;">That's the number that matters — not the 50% off sticker price.</div>
      <div style="display:flex;gap:24px;margin-top:14px;">
        <div class="brand-badge lose" id="s9openai" style="width:88px;height:88px;">${openai}</div>
        <div class="brand-badge win" id="s9anthropic" style="width:88px;height:88px;">${anthropic}</div>
      </div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:56-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="icon-badge" id="s10human" style="width:260px;height:328px;margin:20px auto 0;">${humanCta}</div>
    </div>
    <div class="ticker-bridge"><div class="tb-wire"><div class="tb-pulse" id="s10pulse"></div></div><div class="tb-readout"><span id="s10readout"></span><span class="tb-cursor" id="s10cursor">▌</span></div></div>
    <div class="band-content">
      <div class="ticket cta-ticket" id="s10card">
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

// Ticker bridge: traveling pulse down the wire (first half of e), then a
// terminal-style typewriter reveal of a scene-specific ticker line, then
// a steady blinking cursor. sceneT is scene-local time so the cursor
// keeps blinking after typing finishes.
function tickerBridge(prefix, pulseEl, readoutEl, cursorEl, text, e, sceneT){
  if(!pulseEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  pulseEl.style.opacity = eoc(clamp((ee-0.05)/0.3,0,1)) * (1 - eoc(clamp((ee-0.55)/0.3,0,1)));
  pulseEl.style.top = (2 + 54*clamp((ee-0.05)/0.5,0,1)) + 'px';
  var typeE = clamp((ee-0.4)/0.5,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = prefix + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

// Candlestick field: 26 bars spanning the safe-zone width, height + color
// driven by a fixed pseudo-random seed per bar plus a slow t-driven drift
// (position bob), never CSS @keyframes.
var CANDLE_N = 26;
var candleSeeds = [];
for (var ci = 0; ci < CANDLE_N; ci++) {
  candleSeeds.push({
    x: 8 + ci * (1080 / CANDLE_N),
    h: 60 + ((ci * 53) % 260),
    baseY: 1500 - ((ci * 71) % 420),
    up: (ci % 3 !== 1),
    speed: 0.06 + (ci % 5) * 0.015,
  });
}
var candlesEl = $('candles');
var candleDivs = candleSeeds.map(function(s){
  var d = document.createElement('div');
  d.className = 'candle ' + (s.up ? 'up' : 'down');
  d.style.left = s.x + 'px';
  d.style.height = s.h + 'px';
  candlesEl.appendChild(d);
  return d;
});

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      enter($('s1eyebrow'), eoc(t/0.35), 14, 1);
      enter($('s1head'), eoc((t-0.25)/0.55), 22, 1);
      enter($('s1sub'), eoc((t-0.9)/0.45), 18, 1);
  }},
  { start: 5, duration: 5, el: $('sc2'), render: function(t){
      enter($('s2eyebrow'), eoc(t/0.3), 12, 1);
      tickerBridge('> ', $('s2pulse'), $('s2readout'), $('s2cursor'), 'diffing two model releases...', (t-0.3)/1.0, t);
      dropIn($('s2openai'), (t-0.55)/0.4, -160, -8);
      dropIn($('s2anthropic'), (t-0.75)/0.4, -160, 8);
      enter($('s2head'), eoc((t-1.35)/0.5), 18, 1);
  }},
  { start: 10, duration: 7, el: $('sc3'), render: function(t){
      enter($('s3step'), eoc(t/0.3), 12, 1);
      enter($('s3head'), eoc((t-0.15)/0.5), 20, 1);
      tickerBridge('> ', $('s3pulse'), $('s3readout'), $('s3cursor'), 'pulling GPT-6 pricing tables...', (t-0.5)/1.1, t);
      enter($('s3ticket'), eoc((t-1.0)/0.5), 26, 1);
      enter($('s3sub'), eoc((t-1.6)/0.5), 18, 1);
  }},
  { start: 17, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4step'), eoc(t/0.3), 12, 1);
      enter($('s4head'), eoc((t-0.15)/0.5), 20, 1);
      tickerBridge('> ', $('s4pulse'), $('s4readout'), $('s4cursor'), 'cross-checking benchmark deltas...', (t-0.5)/1.1, t);
      enter($('s4ticket'), eoc((t-1.0)/0.5), 26, 1);
      dropIn($('s4chip1'), (t-1.6)/0.4, -110, 6);
  }},
  { start: 24, duration: 9, el: $('sc5'), render: function(t){
      enter($('s5step'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      tickerBridge('> ', $('s5pulse'), $('s5readout'), $('s5cursor'), 'running unsupervised task...', (t-0.5)/1.1, t);
      enter($('s5ticket'), eoc((t-1.0)/0.5), 26, 1);
      runIn($('s5human'), (t-1.4)/0.5, 180);
      dropIn($('s5chip1'), (t-2.4)/0.4, -100, -6);
      dropIn($('s5chip2'), (t-2.6)/0.4, -100, 6);
  }},
  { start: 33, duration: 8, el: $('sc6'), render: function(t){
      enter($('s6step'), eoc(t/0.3), 12, 1);
      enter($('s6head'), eoc((t-0.15)/0.5), 20, 1);
      tickerBridge('> ', $('s6pulse'), $('s6readout'), $('s6cursor'), 'tallying the Opus 5.5 release notes...', (t-0.5)/1.1, t);
      enter($('s6ticket'), eoc((t-1.0)/0.5), 26, 1);
  }},
  { start: 41, duration: 6, el: $('sc7'), render: function(t){
      enter($('s7mark'), eoc(t/0.4), 30, 1);
      enter($('s7text'), eoc((t-0.3)/0.55), 22, 1);
      enter($('s7attr'), eoc((t-0.95)/0.4), 16, 1);
  }},
  { start: 47, duration: 5, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.35), 14, 1);
      enter($('s8head'), eoc((t-0.25)/0.55), 20, 1);
      dropIn($('s8chip1'), (t-1.0)/0.4, -100, 6);
  }},
  { start: 52, duration: 4, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s9stat'), (t-0.2)/0.5, -20);
      enter($('s9statlabel'), eoc((t-0.7)/0.4), 14, 1);
      enter($('s9sub'), eoc((t-1.05)/0.45), 16, 1);
      dropIn($('s9openai'), (t-1.5)/0.35, -80, -6);
      dropIn($('s9anthropic'), (t-1.65)/0.35, -80, 6);
  }},
  { start: 56, duration: 4, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.5, -180);
      tickerBridge('> ', $('s10pulse'), $('s10readout'), $('s10cursor'), 'connecting @sandesh.explains...', (t-0.15)/1.0, t);
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

  // Background: glows drift on independent slow paths; candlesticks bob
  // gently up/down per-bar on staggered phases — all t-driven, no CSS
  // @keyframes, so the render loop's variable per-frame wall time never
  // desyncs the motion.
  $('glowlime').style.left = (-180 + 100*Math.sin(t*0.13)) + 'px';
  $('glowlime').style.top = (-160 + 80*Math.cos(t*0.10)) + 'px';
  $('glowcoral').style.right = (-200 + 110*Math.sin(t*0.11 + 2)) + 'px';
  $('glowcoral').style.bottom = (180 + 90*Math.cos(t*0.15)) + 'px';
  for (var ci = 0; ci < CANDLE_N; ci++) {
    var s = candleSeeds[ci];
    var bob = 10 * Math.sin(t * s.speed * 6.283 + ci);
    candleDivs[ci].style.top = (s.baseY + bob) + 'px';
  }

  // Ticker-tape marquees: continuous horizontal scroll, opposite
  // directions, looping on the track's own half-width (each track is
  // rendered 4x so a half-width loop is seamless).
  var trackW = 2200; // approx half of the 4x-repeated track width
  $('tickTop').style.transform = 'translateX(' + (-(t*70) % trackW) + 'px)';
  $('tickBottom').style.transform = 'translateX(' + ((t*55) % trackW - trackW) + 'px)';
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
