#!/usr/bin/env node
// Throwaway mockup for "The Jagged Frontier" (working title) — AI is
// superhuman at hard problems and face-plants on trivial ones. Renders 3
// representative static frames for design-system approval. Delete once the
// full build.mjs supersedes this.
//
// Proposed visual system, deliberately distinct from every prior reel:
//   - Palette: near-black warm-red-tinted charcoal bg (#120d0d) + GOLD
//     (#ffcf40, "genius/peak") + true RED (#ff3b3b, "error/valley") — gold
//     and true-red as a pair are unused so far (muse-takeover used amber+
//     violet, pro-max used silver+crimson-pink, price-war used lime+coral).
//   - Texture: a literal animated jagged skyline/capability-graph line
//     (zigzag polyline) drifting across the background — not a dot-grid,
//     hex-grid, hatch, scanline, or ticker (all already used).
//   - Components: torn/zigzag-edge "receipt" cards (clip-path zigzag on
//     one edge, like a torn ticket) — distinct from rounded-rect,
//     clip-corner-angular, and hexagonal-notch cards used previously.
//   - Type: Fraunces (serif, weight 900) for display/headlines — the first
//     serif in this repo, paired with Inter body + JetBrains Mono labels.
//   - Bridge component: "seismBridge" — a small jagged EKG/seismograph
//     line feeding a typewriter readout, this reel's gap-filler.
import { chromium } from 'playwright';
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
  const [trophy, alertTriangle, x, scaleIcon] = await Promise.all(
    ['trophy', 'alert-triangle', 'x', 'scale'].map(tablerIcon)
  );
  // Two fresh poses, unused so far (used: old reel-app figure; 9/16; 3/20;
  // 7/13; 1/5; 11/18). This mockup: standing-6 (genius scene, gold coat)
  // and standing-14 (error scene, red coat).
  const humanGenius = await humaaansFull('standing', 'standing-6', { coatColor: '#ffcf40', pantColor: '#1a1414' });
  const humanError = await humaaansFull('standing', 'standing-14', { coatColor: '#ff3b3b', pantColor: '#1a1414' });

  const html = buildHtml({ icons: { trophy, alertTriangle, x, scaleIcon }, humanGenius, humanError });
  await writeFile(join(__dirname, 'mockup.html'), html, 'utf8');
  console.log('wrote mockup.html');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + join(__dirname, 'mockup.html'));
  for (const n of [1, 2, 3]) {
    await page.evaluate((n) => window.__showFrame(n), n);
    await page.screenshot({ path: join(__dirname, `mockup-${n}.png`) });
    console.log('captured frame', n);
  }
  await browser.close();
}

function buildHtml({ icons: I, humanGenius, humanError }) {
return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>mockup</title>
<style>
@font-face{font-family:'Fraunces';font-weight:900;src:url('../assets/fonts/fraunces/fraunces-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Fraunces';font-weight:900;font-style:italic;src:url('../assets/fonts/fraunces/fraunces-latin-900-italic.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
:root{
  --bg: #120d0d;
  --bg-2: #0a0707;
  --gold: #ffcf40;
  --red: #ff3b3b;
  --ink: #f7f0e6;
  --ink-dim: #c9b6a8;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}

.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 20% 15%, rgba(255,207,64,0.10), transparent 60%),
  radial-gradient(ellipse 900px 900px at 85% 80%, rgba(255,59,59,0.10), transparent 60%),
  var(--bg);}
.bg-grid{position:absolute;inset:0;opacity:0.14;
  background-image: linear-gradient(rgba(247,240,230,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,240,230,0.5) 1px, transparent 1px);
  background-size: 54px 54px;}
.jagged-svg{position:absolute;inset:0;opacity:0.5;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.6) 100%);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:2;}
.frame{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}
.frame.active{display:flex;}
.band-content{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.14em;color:var(--gold);text-transform:uppercase;text-align:center;width:100%;}
.eyebrow.red{color:var(--red);}
.headline{font-family:'Fraunces',serif;font-weight:900;font-size:82px;line-height:1.1;letter-spacing:-0.01em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.65);text-align:center;width:100%;}
.headline .hi-gold{color:var(--gold);}
.headline .hi-red{color:var(--red);}
.headline.italic{font-style:italic;}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:42px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.06em;color:var(--ink-dim);text-align:center;width:100%;}

/* Torn-edge "receipt" card: zigzag bottom edge via clip-path polygon */
.torn-card{position:relative;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,207,64,0.35);border-bottom:none;padding:36px 48px 56px;width:100%;max-width:780px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:10px;
  clip-path:polygon(0% 0%,100% 0%,100% 88%,94% 100%,88% 88%,82% 100%,76% 88%,70% 100%,64% 88%,58% 100%,52% 88%,46% 100%,40% 88%,34% 100%,28% 88%,22% 100%,16% 88%,10% 100%,4% 88%,0% 100%);}
.torn-card.red{border-color:rgba(255,59,59,0.4);}

.chip{display:inline-flex;align-items:center;gap:14px;font-family:'JBMono',monospace;font-weight:700;font-size:26px;color:var(--ink);border:1.5px solid rgba(255,207,64,0.45);background:rgba(255,207,64,0.08);padding:16px 30px 20px;
  clip-path:polygon(0 0,100% 0,100% 78%,92% 100%,84% 78%,76% 100%,68% 78%,60% 100%,52% 78%,44% 100%,36% 78%,28% 100%,20% 78%,12% 100%,4% 78%,0 100%);}
.chip.red{border-color:rgba(255,59,59,0.5);background:rgba(255,59,59,0.08);color:var(--red);}
.chip-icon{width:30px;height:30px;flex:0 0 30px;}
.chip-icon svg{width:100%;height:100%;}
.chip-row{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;width:100%;}

/* seismBridge: jagged EKG-style line feeding a typewriter readout */
.seism-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:10px;position:relative;padding:14px 0;}
.seism-svg{width:220px;height:44px;opacity:0.9;}
.sb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#f0e3d0;letter-spacing:0.01em;min-height:36px;}
.sb-cursor{color:var(--gold);font-weight:700;margin-left:3px;}

.icon-badge{width:100%;height:100%;color:var(--gold);}
.icon-badge svg{width:100%;height:100%;}
.icon-badge.red{color:var(--red);}

.human-wrap{width:300px;height:378px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));}
.human-wrap svg{width:100%;height:100%;}

.stat-big{font-family:'Fraunces',serif;font-weight:900;font-size:230px;line-height:1;letter-spacing:-0.02em;color:var(--gold);text-shadow:0 8px 30px rgba(0,0,0,.6);}
.stat-big.red{color:var(--red);}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.06em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;text-align:center;}
</style></head>
<body>
<div class="bg-texture">
  <div class="bg-wash"></div>
  <div class="bg-grid"></div>
  <svg class="jagged-svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg" id="jaggedSvg">
    <polyline points="0,900 60,860 120,920 180,780 240,860 300,700 360,820 420,640 480,760 540,560 600,700 660,500 720,660 780,440 840,600 900,380 960,540 1020,340 1080,480"
      fill="none" stroke="#ffcf40" stroke-width="3" opacity="0.55"/>
    <polyline points="0,1200 60,1240 120,1180 180,1280 240,1200 300,1320 360,1220 420,1340 480,1240 540,1360 600,1260 660,1380 720,1280 780,1400 840,1300 900,1420 960,1320 1020,1440 1080,1340"
      fill="none" stroke="#ff3b3b" stroke-width="3" opacity="0.45"/>
  </svg>
  <div class="vignette"></div>
</div>

<div class="safe">

  <!-- FRAME 1: hook — the flex (gold, trophy) -->
  <div class="frame" id="f1">
    <div class="band-content">
      <div class="eyebrow">// THE JAGGED FRONTIER</div>
      <div class="icon-badge" style="width:170px;height:170px;">${I.trophy}</div>
      <div class="headline">AI just won <span class="hi-gold">gold</span> at the International Math Olympiad.</div>
      <div class="chip"><span class="chip-icon">${I.scaleIcon}</span><span>TOP 10% ON THE BAR EXAM</span></div>
    </div>
  </div>

  <!-- FRAME 2: the record scratch — the fail (red, torn card) -->
  <div class="frame" id="f2">
    <div class="band-tight">
      <div class="eyebrow red">// SAME MODEL, FIVE MINUTES LATER</div>
      <div class="headline italic" style="font-size:66px;">Can't count the <span class="hi-red">r's in "strawberry."</span></div>
    </div>
    <div class="seism-bridge">
      <svg class="seism-svg" viewBox="0 0 220 44"><polyline points="0,22 30,22 40,4 50,40 60,22 90,22 100,10 110,34 120,22 220,22" fill="none" stroke="#ff3b3b" stroke-width="3"/></svg>
      <div class="sb-readout">&gt; counting letters in "strawberry"...<span class="sb-cursor">▌</span></div>
    </div>
    <div class="band-content" style="flex:0.9;">
      <div class="torn-card red">
        <div class="icon-badge red" style="width:80px;height:80px;">${I.x}</div>
        <div class="sub" style="font-size:40px;">"There are <b style="color:var(--red)">two</b> r's in strawberry."</div>
        <div class="mono-label">— THE SAME MODEL THAT SOLVED THE OLYMPIAD</div>
      </div>
    </div>
  </div>

  <!-- FRAME 3: component language check — stat + humaaans + chips together -->
  <div class="frame" id="f3">
    <div class="band-content" style="gap:14px;">
      <div class="eyebrow">// WHY IT HAPPENS</div>
      <div class="human-wrap">${humanGenius}</div>
      <div class="stat-big">2<span style="font-size:0.4em;">/</span>3</div>
      <div class="stat-label">of people trust AI's confident answer without checking it</div>
      <div class="chip-row">
        <div class="chip"><span class="chip-icon">${I.alertTriangle}</span><span>JAGGED, NOT LINEAR</span></div>
        <div class="chip red"><span class="chip-icon">${I.x}</span><span>CONFIDENCE ≠ ACCURACY</span></div>
      </div>
    </div>
  </div>

</div>

<script>
function $(id){ return document.getElementById(id); }
window.__showFrame = function(n){
  [1,2,3].forEach(function(i){ $('f'+i).classList.toggle('active', i===n); });
};
window.__showFrame(1);
</script>
</body></html>`;
}

main();
