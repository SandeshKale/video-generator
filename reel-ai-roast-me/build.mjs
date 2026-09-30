#!/usr/bin/env node
// Assembles reel.html for "Why We Let AI Roast Us (And Loved It)" — the
// viral "roast my Instagram" AI trend (310,000+ posted roasts). Built
// programmatically from real files in assets/ — no hand-copied SVG.
//
// Visual system: "Roast" — charred near-black background, burnt-orange +
// ice-cyan duotone, a deterministic rising-ember particle field (seeded
// positions, t-driven drift, never Math.random()), scorch-edged "burnt
// paper" cards (irregular clip-path, not a symmetric zigzag), Anton
// display type (first use in this repo — condensed poster weight, fits
// the meme/impact tone). Approved from this reel's own mockup.mjs
// (mockup-1/2/3.png).
//
// House rules that AREN'T about visual identity, still applied:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), scrubbed via progress(e)
//   - Hard safe-zone exclusion: nothing in top ~224px, bottom ~400px, right ~190px
//   - Real vendored fonts, off-white text, soft shadow for legibility
//   - A gap-filling "ember-bridge" component (this reel's signal-bridge
//     equivalent) between every header band and its content band
//   - Scene-to-scene crossfade, this reel using an ASYMMETRIC exit (faster/
//     quieter than the entrance) per DESIGN-POLISH-NOTES.md
//   - Motion-polish: tabular-nums on the stat, shadow-based elevation,
//     one squircle badge, an icon-morph (blur+scale+fade) crossfading
//     heart -> flame, and a tasteful <0.3s glitch-burst on "the burn" scene
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
function hash(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

async function main() {
  const [flame, heart, camera, message, alertTriangle, checks] = await Promise.all(
    ['flame', 'heart', 'camera', 'message', 'alert-triangle', 'checks'].map(tablerIcon)
  );

  // Two fresh humaaans poses, unused in any prior reel (used so far across
  // this repo: old reel-app figure, standing-9/16, standing-3/20,
  // standing-7/13, standing-1/5, standing-11/18, standing-6/14). This
  // reel: standing-4 (matches the approved mockup) and standing-19 (CTA).
  const humanPsych = await humaaansFull('standing', 'standing-4', { coatColor: '#ff7a29', pantColor: '#160b05' });
  const humanCta = await humaaansFull('standing', 'standing-19', { coatColor: '#3fd8ff', pantColor: '#160b05', shirtColor: '#fbeee0' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  // 22 ember particles, seeded/fixed at build time (never Math.random()) —
  // each gets a fixed x0/speed/phase/size/color, drifted purely by t.
  const embers = [...Array(22)].map((_, i) => ({
    x0: hash(i) * 1080,
    speed: 60 + hash(i + 50) * 90,
    phase: hash(i + 100) * 2000,
    size: 4 + hash(i + 200) * 7,
    sway: 10 + hash(i + 300) * 18,
    swayFreq: 0.3 + hash(i + 400) * 0.5,
    flickerFreq: 0.8 + hash(i + 500) * 1.2,
    orange: hash(i + 600) > 0.35,
  }));

  const icons = { flame, heart, camera, message, alertTriangle, checks };

  const html = buildHtml({ icons, humanPsych, humanCta, profileB64, embers });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function scorchCard(label, body, id, variant) {
  return `<div class="scorch-card${variant ? ' ' + variant : ''}" id="${id}">${label ? `<div class="scorch-label">${label}</div>` : ''}<div class="scorch-body">${body}</div></div>`;
}
function chip(icon, label, id, variant) {
  return `<div class="chip${variant ? ' ' + variant : ''}" id="${id}">${icon ? `<span class="chip-icon">${icon}</span>` : ''}<span>${label}</span></div>`;
}
function emberBridge(id) {
  return `<div class="ember-bridge" id="${id}wrap"><div class="eb-trail" id="${id}trail"></div><div class="eb-readout"><span id="${id}readout"></span><span class="eb-cursor" id="${id}cursor">▌</span></div></div>`;
}
function feedGrid(id, flameIcon, burningTile) {
  const tiles = [...Array(9)].map((_, i) => `<div class="feed-tile" style="background:${i % 2 === 0 ? '#2a3a4a' : '#3a2f4a'};" id="${id}tile${i}">${i === (burningTile ?? 4) ? `<div class="flame-badge" id="${id}flame">${flameIcon}</div>` : ''}</div>`).join('');
  return `<div class="feed-frame" id="${id}"><div class="feed-notch"></div><div class="feed-grid">${tiles}</div></div>`;
}
function roastMeter(id, label) {
  return `<div class="roast-meter" id="${id}"><div class="rm-track"><div class="rm-fill" id="${id}fill"></div><div class="rm-ticks">${[...Array(9)].map(() => '<span></span>').join('')}</div></div><div class="rm-label" id="${id}label"><span class="hot">${label || 'MILD'}</span></div></div>`;
}
function heatRow(id, icon, n) {
  return `<div class="heat-row" id="${id}">${[...Array(n)].map((_, i) => `<div class="icon-badge orange" id="${id}f${i}">${icon}</div>`).join('')}</div>`;
}
function growthChart(id, n) {
  return `<div class="growth-chart" id="${id}">${[...Array(n)].map((_, i) => `<div class="growth-bar" id="${id}bar${i}" style="height:0px;"></div>`).join('')}</div>`;
}

function buildHtml({ icons: I, humanPsych, humanCta, profileB64, embers }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-ai-roast-me</title>
<style>
@font-face{font-family:'Anton';font-weight:400;src:url('../assets/fonts/anton/anton-latin-400-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:500;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #160b05;
  --bg-2: #0d0603;
  --orange: #ff7a29;
  --cyan: #3fd8ff;
  --ink: #fbeee0;
  --ink-dim: #cfae95;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* ---- background: scorched grain + deterministic rising-ember field ---- */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 22% 18%, rgba(255,122,41,0.14), transparent 60%),
  radial-gradient(ellipse 900px 900px at 82% 78%, rgba(63,216,255,0.10), transparent 60%),
  var(--bg);}
.bg-grain{position:absolute;inset:0;opacity:0.05;background-image:repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.6) 0, transparent 2px);background-size:6px 6px;}
.ember{position:absolute;border-radius:50%;will-change:transform,opacity;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.62) 100%);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:2;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.14em;color:var(--orange);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.headline{font-family:'Anton',sans-serif;font-weight:400;font-size:78px;line-height:1.08;letter-spacing:0.005em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.7);text-align:center;width:100%;text-transform:uppercase;will-change:transform,opacity;z-index:1;}
.headline .hi-orange{color:var(--orange);}
.headline .hi-cyan{color:var(--cyan);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:42px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:26px;letter-spacing:0.06em;color:var(--ink-dim);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

/* Ember bridge: this reel's signal-bridge equivalent — a short trail of
   rising embers feeding a terminal-style typewriter readout, then a
   blinking cursor. Fills the header-band -> content-band gap. */
.ember-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:1;position:relative;padding:10px 0;height:64px;}
.eb-trail{position:relative;width:6px;height:40px;}
.eb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:26px;color:#f5ddc8;letter-spacing:0.01em;min-height:34px;}
.eb-cursor{color:var(--orange);font-weight:700;margin-left:3px;}

/* Scorch-edged "burnt paper" card — organic irregular clip-path border,
   layered box-shadow for elevation, this reel's card/chip language. */
.scorch-card{position:relative;background:rgba(255,255,255,0.05);padding:34px 46px;margin:10px 0;width:100%;max-width:800px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:10px;
  clip-path:polygon(2% 8%,8% 0%,22% 4%,35% 0%,48% 5%,58% 0%,71% 6%,83% 1%,94% 7%,100% 3%,98% 18%,100% 32%,96% 45%,100% 58%,97% 72%,100% 85%,94% 94%,86% 100%,73% 96%,60% 100%,47% 97%,34% 100%,21% 95%,9% 100%,3% 91%,0% 78%,4% 64%,0% 50%,3% 36%,0% 22%);
  box-shadow:0 1px 2px rgba(0,0,0,.35), 0 12px 34px rgba(0,0,0,.4), inset 0 0 0 1.5px rgba(255,122,41,0.35);
  will-change:transform,opacity;}
.scorch-card.cyan{box-shadow:0 1px 2px rgba(0,0,0,.35), 0 12px 34px rgba(0,0,0,.4), inset 0 0 0 1.5px rgba(63,216,255,0.4);}
.scorch-label{font-family:'JBMono',monospace;font-weight:700;font-size:24px;letter-spacing:0.06em;color:var(--orange);text-transform:uppercase;}
.scorch-card.cyan .scorch-label{color:var(--cyan);}
.scorch-body{font-family:'Inter',sans-serif;font-weight:600;font-size:32px;color:var(--ink);margin-top:6px;line-height:1.32;text-align:center;}

.chip{display:inline-flex;align-items:center;gap:14px;font-family:'JBMono',monospace;font-weight:700;font-size:25px;color:var(--ink);padding:17px 28px;border-radius:16px;
  background:rgba(255,122,41,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.35), inset 0 0 0 1.5px rgba(255,122,41,0.4);
  will-change:transform,opacity;}
.chip.cyan{background:rgba(63,216,255,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.35), inset 0 0 0 1.5px rgba(63,216,255,0.45);color:var(--cyan);}
.chip-icon{width:28px;height:28px;flex:0 0 28px;}
.chip-icon svg{width:100%;height:100%;}
.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;z-index:1;}

/* Squircle badge — one hero moment per DESIGN-POLISH-NOTES.md restraint rule */
.squircle{width:180px;height:180px;border-radius:44%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(160deg, rgba(255,122,41,0.22), rgba(63,216,255,0.12));
  box-shadow:0 1px 2px rgba(0,0,0,.35), 0 16px 40px rgba(0,0,0,.45), inset 0 0 0 2px rgba(255,122,41,0.45);
  will-change:transform,opacity;}
.squircle svg{width:92px;height:92px;color:var(--orange);}

.icon-badge{width:100%;height:100%;color:var(--cyan);will-change:transform,opacity;}
.icon-badge svg{width:100%;height:100%;}
.icon-badge.orange{color:var(--orange);}

/* Icon-morph: blur+scale+fade cross-dissolve between two icons, driven by
   a local progress value (never a hard display-toggle swap). */
.morph-wrap{position:relative;width:150px;height:150px;will-change:transform,opacity;}
.morph-icon{position:absolute;inset:0;}

.human-wrap{width:280px;height:353px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));will-change:transform,opacity;}
.human-wrap svg{width:100%;height:100%;}

.stat-big{font-family:'Anton',sans-serif;font-weight:400;font-size:196px;line-height:1;letter-spacing:0.01em;color:var(--orange);text-shadow:0 8px 30px rgba(0,0,0,.6);font-variant-numeric:tabular-nums;will-change:transform,opacity;}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:27px;letter-spacing:0.06em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;text-align:center;will-change:transform,opacity;}

/* Glitch-burst: 3 RGB-offset copies, screen blend — used only in a <0.3s
   virtual-time window at the top of scene 3, decaying to a clean settle. */
.glitch-wrap{position:relative;width:100%;}
.glitch-wrap .headline{position:relative;}
.glitch-wrap .glitch-layer.headline{position:absolute;top:0;left:0;}
.glitch-layer{mix-blend-mode:screen;}
.glitch-layer.r{color:#ff2d2d;}
.glitch-layer.b{color:#2d9fff;}

.cta-card{padding:46px 52px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;background:rgba(255,255,255,0.06);position:relative;
  clip-path:polygon(2% 8%,8% 0%,22% 4%,35% 0%,48% 5%,58% 0%,71% 6%,83% 1%,94% 7%,100% 3%,98% 18%,100% 32%,96% 45%,100% 58%,97% 72%,100% 85%,94% 94%,86% 100%,73% 96%,60% 100%,47% 97%,34% 100%,21% 95%,9% 100%,3% 91%,0% 78%,4% 64%,0% 50%,3% 36%,0% 22%);
  box-shadow:0 1px 2px rgba(0,0,0,.35), 0 12px 34px rgba(0,0,0,.4), inset 0 0 0 1.5px rgba(63,216,255,0.4);}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--orange);box-shadow:0 0 28px rgba(255,122,41,0.5);}
.cta-main{font-family:'Anton',sans-serif;color:var(--ink);font-size:46px;font-weight:400;letter-spacing:0.01em;text-transform:uppercase;}
.cta-sub{font-family:'JBMono',monospace;color:var(--orange);font-size:23px;font-weight:500;letter-spacing:0.02em;}

/* Feed grid: a phone-frame mockup holding a 3x3 "Instagram feed" grid,
   one tile catching fire — this reel's concrete, recognizable hero
   graphic (replaces an abstract badge for the hook scene). */
.feed-frame{position:relative;width:300px;padding:18px 14px 22px;border-radius:34px;background:rgba(255,255,255,0.04);
  box-shadow:0 1px 2px rgba(0,0,0,.35), 0 18px 44px rgba(0,0,0,.5), inset 0 0 0 2px rgba(255,122,41,0.3);will-change:transform,opacity;}
.feed-notch{width:70px;height:8px;border-radius:6px;background:rgba(255,255,255,0.12);margin:0 auto 14px;}
.feed-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.feed-tile{aspect-ratio:1;border-radius:6px;position:relative;overflow:hidden;}
.feed-tile.burning{box-shadow:0 0 22px 4px rgba(255,122,41,0.7);}
.feed-tile .flame-badge{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--orange);background:rgba(22,11,5,0.35);}
.feed-tile .flame-badge svg{width:60%;height:60%;filter:drop-shadow(0 0 8px rgba(255,122,41,0.9));}

/* Roast meter: a segmented heat gauge with a glowing indicator — a
   recurring motif that ties scenes together and reads instantly (a
   spice/heat-level gauge), distinct from every card/chip already in
   this reel's language. */
.roast-meter{width:100%;max-width:560px;display:flex;flex-direction:column;align-items:center;gap:10px;will-change:transform,opacity;}
.rm-track{position:relative;width:100%;height:14px;border-radius:8px;background:rgba(255,255,255,0.08);overflow:hidden;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.5);}
.rm-fill{position:absolute;top:0;left:0;bottom:0;border-radius:8px;background:linear-gradient(90deg,#3fd8ff,#ff7a29,#ff3b1a);width:0%;}
.rm-ticks{position:absolute;inset:0;display:flex;justify-content:space-between;padding:0 2px;}
.rm-ticks span{width:2px;height:100%;background:rgba(0,0,0,0.35);}
.rm-label{font-family:'JBMono',monospace;font-weight:700;font-size:24px;letter-spacing:0.1em;color:var(--ink-dim);text-transform:uppercase;}
.rm-label .hot{color:var(--orange);}

/* Heat rating: N flame icons, a simple recognizable "spice level" row. */
.heat-row{display:flex;gap:10px;justify-content:center;}
.heat-row .icon-badge{width:44px;height:44px;}

/* Mini growth chart: deterministic ascending bars, a small dataviz
   flourish for the scale scene. */
.growth-chart{display:flex;align-items:flex-end;gap:14px;height:120px;}
.growth-bar{width:34px;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#ff7a29,#a04010);box-shadow:0 0 14px rgba(255,122,41,0.35);}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(255,122,41,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--orange);width:0%;box-shadow:0 0 10px rgba(255,122,41,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="bg-wash"></div>
  <div class="bg-grain"></div>
  ${embers.map((e, i) => `<div class="ember" id="ember${i}" style="width:${e.size.toFixed(1)}px;height:${e.size.toFixed(1)}px;background:${e.orange ? '#ff7a29' : '#3fd8ff'};box-shadow:0 0 ${(e.size * 2).toFixed(0)}px ${e.orange ? '#ff7a29' : '#3fd8ff'};"></div>`).join('\n  ')}
  <div class="vignette"></div>
</div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band band-tight">
      <div class="eyebrow" id="s1eyebrow">// THE TREND EVERYONE'S DOING</div>
    </div>
    <div class="band-content">
      ${feedGrid('s1grid', I.flame, 4)}
      <div class="headline" id="s1head" style="font-size:68px;">310,000+ people asked AI to <span class="hi-orange">destroy them.</span></div>
      ${chip(I.camera, 'SCREENSHOT. UPLOAD. BRACE.', 's1chip')}
    </div>
    <div class="band band-tight">
      ${roastMeter('s1meter', 'MILD')}
    </div>
  </div>

  <!-- SCENE 2: THE MECHANIC 0:05-0:10 -->
  <div class="scene" id="sc2">
    <div class="band band-tight">
      <div class="eyebrow" id="s2eyebrow">// HOW IT WORKS</div>
      <div class="headline" id="s2head" style="font-size:60px;">Screenshot your feed. Type <span class="hi-orange">"roast me."</span></div>
    </div>
    ${emberBridge('s2')}
    <div class="band-content">
      <div class="chip-row">
        ${chip(I.camera, 'UPLOAD YOUR FEED', 's2chip1')}
        ${chip(I.message, '"ROAST ME"', 's2chip2')}
        ${chip(I.flame, 'BRACE FOR IMPACT', 's2chip3', 'cyan')}
      </div>
      ${roastMeter('s2meter', 'MEDIUM')}
    </div>
  </div>

  <!-- SCENE 3: THE BURN 0:10-0:17 (glitch-burst lands here) -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      <div class="eyebrow" id="s3eyebrow">// THE BURN</div>
    </div>
    <div class="band-content">
      <div class="scorch-card" id="s3card">
        <div class="glitch-wrap">
          <div class="headline" id="s3head" style="font-size:66px;">"Brand deal <span class="hi-orange">with beige.</span>"</div>
          <div class="glitch-layer r headline" id="s3headR" style="font-size:66px;">"Brand deal with beige."</div>
          <div class="glitch-layer b headline" id="s3headB" style="font-size:66px;">"Brand deal with beige."</div>
        </div>
        <div class="mono-label" id="s3label">— THE MODEL, UNPROMPTED FOR MERCY</div>
      </div>
      ${heatRow('s3heat', I.flame, 3)}
      ${roastMeter('s3meter', 'CHARRED')}
    </div>
  </div>

  <!-- SCENE 4: THE TWIST 0:17-0:24 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      <div class="eyebrow" id="s4eyebrow">// THE TWIST</div>
      <div class="icon-badge" id="s4icon" style="width:110px;height:110px;">${I.alertTriangle}</div>
    </div>
    ${emberBridge('s4')}
    <div class="band-content">
      <div class="headline" id="s4head" style="font-size:58px;">It doesn't sting like a friend. It stings like <span class="hi-cyan">something with nothing to lose.</span></div>
      <div class="chip-row">
        ${chip(I.heart, 'A FRIEND SOFTENS IT', 's4chip1', 'cyan')}
        ${chip(I.flame, 'AI DOESN’T CARE', 's4chip2')}
      </div>
    </div>
  </div>

  <!-- SCENE 5: WHY IT WORKS 0:24-0:31 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      <div class="eyebrow" id="s5eyebrow">// WHY IT ACTUALLY WORKS</div>
      <div class="headline" id="s5head" style="font-size:60px;">No relationship <span class="hi-orange">on the line.</span></div>
    </div>
    ${emberBridge('s5')}
    <div class="band-content">
      ${scorchCard('The trade', 'No social cost to hearing the truth. That’s catharsis, not cruelty.', 's5card')}
      <div class="chip-row">
        ${chip(I.checks, 'ZERO AWKWARDNESS', 's5chip1', 'cyan')}
        ${chip(I.checks, 'ZERO GRUDGES HELD', 's5chip2', 'cyan')}
      </div>
    </div>
  </div>

  <!-- SCENE 6: THE PSYCHOLOGY 0:31-0:38 -->
  <div class="scene" id="sc6">
    <div class="band band-tight">
      <div class="eyebrow" id="s6eyebrow">// THE PSYCHOLOGY</div>
      <div class="human-wrap" id="s6human" style="width:250px;height:315px;margin:0 auto;">${humanPsych}</div>
    </div>
    ${emberBridge('s6')}
    <div class="band-content">
      <div class="headline" id="s6head" style="font-size:56px;">Honesty lands easier from something with <span class="hi-orange">nothing to lose.</span></div>
      ${scorchCard('The mechanism', 'No friendship on the line means no reason to soften the read.', 's6card')}
    </div>
  </div>

  <!-- SCENE 7: THE CATCH 0:38-0:45 -->
  <div class="scene" id="sc7">
    <div class="band band-tight">
      <div class="eyebrow" id="s7eyebrow">// THE CATCH</div>
      <div class="headline" id="s7head" style="font-size:62px;">It's not reading <span class="hi-cyan">you.</span></div>
    </div>
    ${emberBridge('s7')}
    <div class="band-content">
      <div class="scorch-card cyan" id="s7card">
        <div class="morph-wrap" id="s7morph">
          <div class="morph-icon icon-badge cyan" id="s7heart">${I.heart}</div>
          <div class="morph-icon icon-badge orange" id="s7flame">${I.flame}</div>
        </div>
        <div class="scorch-body">The nice bio you wrote → the roast it earned. Same pattern-matching, new punchline.</div>
      </div>
      ${chip(I.alertTriangle, 'JAGGED, NOT PSYCHIC', 's7chip')}
    </div>
  </div>

  <!-- SCENE 8: THE SCALE 0:45-0:51 -->
  <div class="scene" id="sc8">
    <div class="band band-tight">
      <div class="eyebrow" id="s8eyebrow">// THE SCALE</div>
    </div>
    <div class="band-content" style="gap:14px;">
      <div class="stat-big" id="s8stat">310K<span style="font-size:0.35em;">+</span></div>
      <div class="stat-label" id="s8statlabel">roasts posted in under a month</div>
      ${growthChart('s8chart', 5)}
      <div class="sub" id="s8sub" style="margin-top:6px;font-size:34px;">Week one to now. And climbing.</div>
    </div>
  </div>

  <!-- SCENE 9: THE TAKEAWAY 0:51-0:55 -->
  <div class="scene" id="sc9">
    <div class="band band-tight">
      <div class="eyebrow" id="s9eyebrow">// THE TAKEAWAY</div>
    </div>
    <div class="band-content">
      <div class="headline" id="s9head" style="font-size:62px;">Let it roast your feed. <span class="hi-cyan">Not your self-worth.</span></div>
      <div class="chip-row">
        ${chip(I.flame, 'ROAST THE FEED', 's9chip1')}
        ${chip(I.checks, 'KEEP THE CONFIDENCE', 's9chip2', 'cyan')}
      </div>
      ${scorchCard('Bottom line', 'It’s a party trick, not a personality read. Enjoy the burn, keep the self-worth.', 's9card', 'cyan')}
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="human-wrap" id="s10human" style="width:250px;height:315px;margin:20px auto 0;">${humanCta}</div>
    </div>
    ${emberBridge('s10')}
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

// Ember bridge: a short rising-ember trail (3 dots looping up the wire) +
// terminal-style typewriter reveal of a scene-specific line, then a
// blinking cursor. Fills the header-band -> content-band gap.
function emberBridge(trailEl, readoutEl, cursorEl, text, e, sceneT){
  if(!trailEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  var dots = trailEl.querySelectorAll('.eb-dot');
  if (!dots.length) {
    for (var i = 0; i < 3; i++) {
      var d = document.createElement('div');
      d.className = 'eb-dot';
      d.style.cssText = 'position:absolute;left:-3px;width:8px;height:8px;border-radius:50%;background:#ff7a29;box-shadow:0 0 10px 3px #ff7a29;';
      trailEl.appendChild(d);
    }
    dots = trailEl.querySelectorAll('.eb-dot');
  }
  for (var i = 0; i < dots.length; i++) {
    var phase = (sceneT * 0.9 + i / 3) % 1;
    dots[i].style.top = ((1 - phase) * 40) + 'px';
    dots[i].style.opacity = (0.3 + 0.6 * Math.sin(phase * Math.PI)) * ee;
  }
  var typeE = clamp((ee-0.15)/0.6,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = '> ' + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

// Icon-morph: blur+scale+fade cross-dissolve between two icons, a pure
// function of local progress e (per DESIGN-POLISH-NOTES.md's icon-morph
// technique) — never a hard display-toggle swap.
function iconMorph(outEl, inEl, e){
  if(!outEl || !inEl) return;
  var ee = clamp(e,0,1);
  outEl.style.opacity = (1 - ee) * 0.9;
  outEl.style.filter = 'blur(' + (ee*7) + 'px)';
  outEl.style.transform = 'scale(' + (1 + ee*0.2) + ')';
  inEl.style.opacity = ee * 0.9 + 0.1*(ee>0?1:0);
  inEl.style.filter = 'blur(' + ((1-ee)*4) + 'px)';
  inEl.style.transform = 'scale(' + (0.85 + ee*0.15) + ')';
}

// Glitch-burst: RGB-split copies held only for a short local window at the
// top of a scene, decaying to zero offset — a deterministic wiggle of
// local time, never Math.random(), never held past ~0.3s virtual time.
function glitchBurst(rEl, bEl, localT){
  if(!rEl || !bEl) return;
  var decay = clamp(1 - localT/0.3, 0, 1);
  if (decay <= 0) { rEl.style.opacity = 0; bEl.style.opacity = 0; return; }
  var wob = Math.sin(localT*97.3) * Math.sin(localT*13.7);
  rEl.style.opacity = decay * 0.8;
  bEl.style.opacity = decay * 0.8;
  rEl.style.transform = 'translate(' + (decay*8 + wob*3) + 'px,' + (decay*3) + 'px)';
  bEl.style.transform = 'translate(' + (-decay*7 + wob*-2) + 'px,' + (-decay*4) + 'px)';
}

// Roast meter: fills a percentage width as a pure function of local
// progress e — the gradient track itself supplies the color shift from
// cyan (mild) through orange to red (charred), so only width changes.
function roastFill(id, pct, e){
  var el = $(id + 'fill');
  if(!el) return;
  el.style.width = (clamp(e,0,1) * pct) + '%';
}

// Feed-grid tiles: a quick staggered reveal (scale+fade), each tile's
// local progress offset by a fixed index-seeded delay.
function feedTilesReveal(id, e){
  for (var i = 0; i < 9; i++){
    var el = $(id + 'tile' + i);
    if(!el) continue;
    var localE = clamp((e - i*0.05)/0.3, 0, 1);
    el.style.opacity = localE;
    el.style.transform = 'scale(' + (0.7+0.3*localE) + ')';
  }
}

// Heat-row: N flame icons revealed in sequence, a simple "spice level" row.
function heatReveal(id, n, e){
  for (var i = 0; i < n; i++){
    var el = $(id + 'f' + i);
    if(!el) continue;
    var localE = clamp((e - i*0.18)/0.4, 0, 1);
    el.style.opacity = localE;
    el.style.transform = 'scale(' + (0.5+0.5*localE) + ')';
  }
}

// Growth chart: bars rise to their target heights in a staggered sequence,
// each an eased pure function of local progress.
function growthReveal(id, heights, e){
  for (var i = 0; i < heights.length; i++){
    var el = $(id + 'bar' + i);
    if(!el) continue;
    var localE = clamp((e - i*0.12)/0.5, 0, 1);
    el.style.height = (eoc(localE) * heights[i]) + 'px';
  }
}

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      enter($('s1eyebrow'), eoc(t/0.35), 14, 1);
      dropIn($('s1grid'), t/0.5, -160, -4);
      feedTilesReveal('s1grid', (t-0.25)/0.6);
      enter($('s1head'), eoc((t-0.75)/0.5), 22, 1);
      dropIn($('s1chip'), (t-1.4)/0.4, -100, 4);
      enter($('s1meter'), eoc((t-1.9)/0.35), 14, 1);
      roastFill('s1meter', 26, (t-1.9)/0.5);
  }},
  { start: 5, duration: 5, el: $('sc2'), render: function(t){
      enter($('s2eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s2head'), eoc((t-0.15)/0.5), 20, 1);
      emberBridge($('s2trail'), $('s2readout'), $('s2cursor'), 'opening the chat...', (t-0.55)/0.7, t);
      dropIn($('s2chip1'), (t-1.3)/0.35, -100, -4);
      dropIn($('s2chip2'), (t-1.5)/0.35, -100, 0);
      dropIn($('s2chip3'), (t-1.7)/0.35, -100, 4);
      enter($('s2meter'), eoc((t-2.1)/0.35), 14, 1);
      roastFill('s2meter', 55, (t-2.1)/0.5);
  }},
  { start: 10, duration: 7, el: $('sc3'), render: function(t){
      enter($('s3eyebrow'), eoc(t/0.3), 12, 1);
      dropIn($('s3card'), (t-0.2)/0.5, -140, 0);
      glitchBurst($('s3headR'), $('s3headB'), t);
      enter($('s3label'), eoc((t-1.0)/0.4), 14, 1);
      heatReveal('s3heat', 3, (t-1.6)/0.6);
      enter($('s3meter'), eoc((t-2.1)/0.35), 14, 1);
      roastFill('s3meter', 96, (t-2.1)/0.5);
  }},
  { start: 17, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4eyebrow'), eoc(t/0.3), 12, 1);
      dropIn($('s4icon'), (t-0.15)/0.5, -180, -8);
      emberBridge($('s4trail'), $('s4readout'), $('s4cursor'), 'measuring the sting...', (t-0.7)/0.7, t);
      enter($('s4head'), eoc((t-1.5)/0.55), 24, 1);
      dropIn($('s4chip1'), (t-2.2)/0.35, -100, -4);
      dropIn($('s4chip2'), (t-2.4)/0.35, -100, 4);
  }},
  { start: 24, duration: 7, el: $('sc5'), render: function(t){
      enter($('s5eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      emberBridge($('s5trail'), $('s5readout'), $('s5cursor'), 'measuring the fallout...', (t-0.5)/1.0, t);
      dropIn($('s5card'), (t-1.5)/0.45, -140, 0);
      dropIn($('s5chip1'), (t-2.2)/0.35, -100, -4);
      dropIn($('s5chip2'), (t-2.4)/0.35, -100, 4);
  }},
  { start: 31, duration: 7, el: $('sc6'), render: function(t){
      enter($('s6eyebrow'), eoc(t/0.3), 12, 1);
      runIn($('s6human'), (t-0.3)/0.55, -180);
      emberBridge($('s6trail'), $('s6readout'), $('s6cursor'), 'weighing the friendship cost...', (t-0.9)/0.8, t);
      tumbleIn($('s6head'), (t-1.8)/0.5, -20);
      dropIn($('s6card'), (t-2.5)/0.45, -140, 0);
  }},
  { start: 38, duration: 7, el: $('sc7'), render: function(t){
      enter($('s7eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s7head'), (t-0.2)/0.5, -14);
      emberBridge($('s7trail'), $('s7readout'), $('s7cursor'), 'pattern-matching your captions...', (t-0.5)/1.0, t);
      dropIn($('s7card'), (t-1.5)/0.45, -140, 0);
      iconMorph($('s7heart'), $('s7flame'), (t-2.0)/0.9);
      dropIn($('s7chip'), (t-3.0)/0.35, -100, 0);
  }},
  { start: 45, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s8stat'), (t-0.3)/0.5, -20);
      enter($('s8statlabel'), eoc((t-0.9)/0.4), 14, 1);
      growthReveal('s8chart', [26, 46, 70, 94, 120], (t-1.3)/0.9);
      enter($('s8sub'), eoc((t-2.3)/0.4), 16, 1);
  }},
  { start: 51, duration: 4, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.25), 12, 1);
      tumbleIn($('s9head'), (t-0.25)/0.45, -14);
      dropIn($('s9chip1'), (t-0.9)/0.35, -100, -4);
      dropIn($('s9chip2'), (t-1.1)/0.35, -100, 4);
      dropIn($('s9card'), (t-1.5)/0.4, -100, 0);
  }},
  { start: 55, duration: 5, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.5, -180);
      emberBridge($('s10trail'), $('s10readout'), $('s10cursor'), 'queuing @sandesh.explains...', (t-0.15)/1.0, t);
      dropIn($('s10card'), (t-0.3)/0.5, -150, 0);
  }}
];

window.__reelDurationSec = 60.0;
var marker = $('marker');
var started = false;

// Asymmetric crossfade: exit is faster AND quieter than the entrance, per
// DESIGN-POLISH-NOTES.md ("leave faster and quieter than you came").
var TRANS_IN = 0.32;
var TRANS_OUT = TRANS_IN * 0.6;
window.__seek = function(t){
  if (!started) { marker.style.display='none'; started = true; }
  SCENES.forEach(function(scene, i){
    var raw = t - scene.start;
    var visible = raw >= -TRANS_IN && raw < scene.duration;
    if (!visible) { scene.el.style.display = 'none'; return; }
    scene.el.style.display = 'flex';
    var op = 1, ty = 0;
    var isLast = i === SCENES.length - 1;
    if (raw < 0) {
      var ein = eoc((raw + TRANS_IN) / TRANS_IN);
      op = ein; ty = (1 - ein) * 22;
    } else if (!isLast && raw > scene.duration - TRANS_OUT) {
      var eout = eoc((scene.duration - raw) / TRANS_OUT);
      op = eout; ty = (1 - eout) * -14;
    }
    scene.el.style.opacity = op;
    scene.el.style.transform = 'translateY(' + ty + 'px)';
    scene.render(clamp(raw, 0, scene.duration));
  });
  $('progress').style.width = (100*clamp(t/window.__reelDurationSec,0,1)) + '%';

  // Rising-ember field: each particle's y is a pure function of t (wraps
  // top-to-bottom on its own fixed period), x sways by a fixed sine.
  var EMBERS = ${JSON.stringify(embers)};
  EMBERS.forEach(function(e, i){
    var period = 1920 + 200;
    var y = 1920 - (((t * e.speed) + e.phase) % period) + 100;
    var x = e.x0 + e.sway * Math.sin(t * e.swayFreq + e.phase);
    var op = 0.25 + 0.5 * Math.abs(Math.sin(t * e.flickerFreq + e.phase));
    var el = $('ember' + i);
    el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    el.style.opacity = op.toFixed(2);
  });
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
