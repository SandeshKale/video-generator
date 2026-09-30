#!/usr/bin/env node
// Throwaway mockup for "Why We Let AI Roast Us (And Loved It)" — the viral
// "roast my Instagram" AI trend. Renders 3 representative static frames for
// design-system approval. Delete once the full build.mjs supersedes this.
//
// Proposed visual system, deliberately distinct from every prior reel:
//   - Palette: charred near-black (#160b05) + burnt orange (#ff7a29, the
//     "roast/heat") + ice cyan (#3fd8ff, the cool "before" contrast) — this
//     orange/cyan pairing is unused (muse-takeover/jagged-frontier's oranges
//     both skew yellow-amber/gold, not this saturated a flame-orange).
//   - Texture: a deterministic rising-ember particle field (seeded-hash
//     positions, never Math.random()) over a scorched-grain vignette — a
//     genuinely new *kind* of background motion vs. every prior dot-grid/
//     hatch/hex-grid/DNA-helix/jagged-line-scroll texture.
//   - Components: scorch-edged "burnt paper" cards (irregular clip-path
//     border, organic not symmetric-zigzag) — distinct from rounded-rect/
//     clip-corner/hex-notch/torn-zigzag cards used previously.
//   - Type: Anton (condensed poster-weight display face) — first use in
//     this repo, fits the meme/impact tone of a "roast" reel.
//   - Motion-polish (from DESIGN-POLISH-NOTES.md): tabular-nums on the
//     stat, shadow-based elevation, one squircle badge, an icon-morph
//     (blur+scale+fade) crossfading heart -> flame for the "before/after"
//     beat, and (in the full build) an asymmetric faster/quieter crossfade
//     exit. A tasteful glitch-transition burst (MOTION-SHOWREEL-STYLES.md
//     style #2) lands on "the burn" scene — shown here frozen mid-burst.
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

// Deterministic hash -> [0,1), for seeded ember positions (never Math.random()).
function hash(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

async function main() {
  const [flame, heart, camera] = await Promise.all(['flame', 'heart', 'camera'].map(tablerIcon));
  // Fresh pose, unused in any prior reel (used so far: old reel-app figure;
  // 9/16; 3/20; 7/13; 1/5; 11/18; 6/14). This mockup: standing-4.
  const human = await humaaansFull('standing', 'standing-4', { coatColor: '#ff7a29', pantColor: '#160b05' });

  const html = buildHtml({ icons: { flame, heart, camera }, human });
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

function embersHtml() {
  let out = '';
  for (let i = 0; i < 26; i++) {
    const x = hash(i) * 1080;
    const y = hash(i + 100) * 1920;
    const size = 4 + hash(i + 200) * 6;
    const isOrange = hash(i + 300) > 0.35;
    out += `<div class="ember" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${size.toFixed(0)}px;height:${size.toFixed(0)}px;background:${isOrange ? '#ff7a29' : '#3fd8ff'};box-shadow:0 0 ${(size * 2).toFixed(0)}px ${isOrange ? '#ff7a29' : '#3fd8ff'};opacity:${(0.3 + hash(i + 400) * 0.5).toFixed(2)};"></div>`;
  }
  return out;
}

function buildHtml({ icons: I, human }) {
return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>mockup</title>
<style>
@font-face{font-family:'Anton';font-weight:400;src:url('../assets/fonts/anton/anton-latin-400-normal.woff2') format('woff2');font-display:block;}
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
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}

.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 22% 18%, rgba(255,122,41,0.14), transparent 60%),
  radial-gradient(ellipse 900px 900px at 82% 78%, rgba(63,216,255,0.10), transparent 60%),
  var(--bg);}
.bg-grain{position:absolute;inset:0;opacity:0.05;background-image:repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.6) 0, transparent 2px);background-size:6px 6px;}
.ember{position:absolute;border-radius:50%;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.62) 100%);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:2;}
.frame{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}
.frame.active{display:flex;}
.band-content{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.14em;color:var(--orange);text-transform:uppercase;text-align:center;width:100%;}
.headline{font-family:'Anton',sans-serif;font-weight:400;font-size:88px;line-height:1.05;letter-spacing:0.005em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.7);text-align:center;width:100%;text-transform:uppercase;}
.headline .hi-orange{color:var(--orange);}
.headline .hi-cyan{color:var(--cyan);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:42px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:27px;letter-spacing:0.06em;color:var(--ink-dim);text-align:center;width:100%;}

/* Scorch-edged "burnt paper" card — organic irregular clip-path border,
   layered box-shadow for elevation (not just a border), distinct from
   every prior reel's card shape. */
.scorch-card{position:relative;background:rgba(255,255,255,0.05);padding:40px 50px;width:100%;max-width:800px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:10px;
  clip-path:polygon(2% 8%,8% 0%,22% 4%,35% 0%,48% 5%,58% 0%,71% 6%,83% 1%,94% 7%,100% 3%,98% 18%,100% 32%,96% 45%,100% 58%,97% 72%,100% 85%,94% 94%,86% 100%,73% 96%,60% 100%,47% 97%,34% 100%,21% 95%,9% 100%,3% 91%,0% 78%,4% 64%,0% 50%,3% 36%,0% 22%);
  box-shadow:0 1px 2px rgba(0,0,0,.35), 0 12px 34px rgba(0,0,0,.4), inset 0 0 0 1.5px rgba(255,122,41,0.35);}
.scorch-card.cyan{box-shadow:0 1px 2px rgba(0,0,0,.35), 0 12px 34px rgba(0,0,0,.4), inset 0 0 0 1.5px rgba(63,216,255,0.4);}

.chip{display:inline-flex;align-items:center;gap:14px;font-family:'JBMono',monospace;font-weight:700;font-size:26px;color:var(--ink);padding:18px 32px;border-radius:16px;
  background:rgba(255,122,41,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.35), inset 0 0 0 1.5px rgba(255,122,41,0.4);}
.chip-icon{width:30px;height:30px;flex:0 0 30px;}
.chip-icon svg{width:100%;height:100%;}

/* Squircle badge — one hero moment per DESIGN-POLISH-NOTES.md restraint rule */
.squircle{width:190px;height:190px;border-radius:44%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(160deg, rgba(255,122,41,0.22), rgba(63,216,255,0.12));
  box-shadow:0 1px 2px rgba(0,0,0,.35), 0 16px 40px rgba(0,0,0,.45), inset 0 0 0 2px rgba(255,122,41,0.45);}
.squircle svg{width:96px;height:96px;color:var(--orange);}

/* Glitch-burst text — 3 RGB-offset copies, screen blend, frozen mid-burst
   for this mockup (a real build scrubs the offset by local scene time,
   held under ~0.3s virtual-time). */
.glitch-wrap{position:relative;width:100%;}
.glitch-wrap .headline{position:relative;}
.glitch-wrap .glitch-layer.headline{position:absolute;top:0;left:0;}
.glitch-layer{mix-blend-mode:screen;}
.glitch-layer.r{color:#ff2d2d;transform:translate(-6px,2px);}
.glitch-layer.g{color:#2dff8f;transform:translate(5px,-3px);}
.glitch-layer.b{color:#2d9fff;transform:translate(2px,4px);}

.icon-badge{width:100%;height:100%;color:var(--cyan);}
.icon-badge svg{width:100%;height:100%;}
.icon-badge.orange{color:var(--orange);}

/* Icon-morph: blur+scale+fade cross-dissolve, shown at ~55% progress */
.morph-wrap{position:relative;width:170px;height:170px;}
.morph-icon{position:absolute;inset:0;}
.morph-out{opacity:0.35;filter:blur(6px);transform:scale(1.15);}
.morph-in{opacity:0.9;filter:blur(1px);transform:scale(0.92);}

.stat-big{font-family:'Anton',sans-serif;font-weight:400;font-size:186px;line-height:1;letter-spacing:0.01em;color:var(--orange);text-shadow:0 8px 30px rgba(0,0,0,.6);font-variant-numeric:tabular-nums;}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:27px;letter-spacing:0.06em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;text-align:center;}

.human-wrap{width:280px;height:353px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));}
.human-wrap svg{width:100%;height:100%;}
</style></head>
<body>
<div class="bg-texture">
  <div class="bg-wash"></div>
  <div class="bg-grain"></div>
  ${embersHtml()}
  <div class="vignette"></div>
</div>

<div class="safe">

  <!-- FRAME 1: hook -->
  <div class="frame" id="f1">
    <div class="band-content">
      <div class="eyebrow">// THE TREND EVERYONE'S DOING</div>
      <div class="squircle">${I.flame}</div>
      <div class="headline">310,000+ people asked AI to <span class="hi-orange">destroy them.</span></div>
      <div class="chip"><span class="chip-icon">${I.camera}</span><span>SCREENSHOT. UPLOAD. BRACE.</span></div>
    </div>
  </div>

  <!-- FRAME 2: the burn (glitch-burst moment, frozen mid-burst) -->
  <div class="frame" id="f2">
    <div class="band-tight">
      <div class="eyebrow">// THE BURN</div>
    </div>
    <div class="band-content" style="flex:1.3;">
      <div class="glitch-wrap">
        <div class="headline" style="font-size:76px;">"Brand deal <span class="hi-orange">with beige.</span>"</div>
        <div class="glitch-layer r headline" style="font-size:76px;">"Brand deal with beige."</div>
        <div class="glitch-layer b headline" style="font-size:76px;">"Brand deal with beige."</div>
      </div>
      <div class="mono-label">— CHATGPT, UNPROMPTED FOR MERCY</div>
    </div>
  </div>

  <!-- FRAME 3: component check — scorch card, morph icon, tabular stat -->
  <div class="frame" id="f3">
    <div class="band-content" style="gap:14px;">
      <div class="eyebrow">// THE SCALE</div>
      <div class="stat-big">310K<span style="font-size:0.35em;">+</span></div>
      <div class="stat-label">roasts posted in under a month</div>
      <div class="scorch-card cyan">
        <div class="morph-wrap">
          <div class="morph-icon morph-out icon-badge cyan">${I.heart}</div>
          <div class="morph-icon morph-in icon-badge orange">${I.flame}</div>
        </div>
        <div class="sub" style="font-size:36px;">The nice bio you wrote → the roast it earned.</div>
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
