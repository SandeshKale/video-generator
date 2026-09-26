#!/usr/bin/env node
// Design-approval mockup for "OpenAI Wants $500/Month For ChatGPT" — a new
// "Price Tag" visual system, deliberately distinct from every prior reel:
//   - rundown-ios: navy bg, green/blue/amber, dot-grid+hatch, rounded cards
//   - loop-method: near-black bg, cyan/magenta, graph-grid+scanline, clip-corner panels
//   - price-war: plum bg, lime/coral, ticker-tape+candlesticks, ticket-stub cards
//   - muse-takeover: espresso-charcoal bg, amber/violet, ripple+waveform, chat-bubble cards
//   - THIS: cool near-black (blue undertone, not brown/plum), platinum-silver +
//     crimson duotone, an ascending "price staircase" bar texture (monotonic,
//     not up/down candlesticks), angular "price tag" cards (notch + punch
//     hole), Unbounded display font (new to this repo)
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

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
  const [crown, lock, trendingUp, calendar] = await Promise.all(
    ['crown', 'lock', 'trending-up', 'calendar'].map(tablerIcon)
  );
  // Two fresh humaaans poses, unused in any prior reel (used so far:
  // old reel-app figure, standing-9/16, standing-3/20, standing-7/13).
  const humanHook = await humaaansFull('standing', 'standing-1', { coatColor: '#ff2d55', pantColor: '#0d0f14' });

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Unbounded';font-weight:800;src:url('../assets/fonts/unbounded/unbounded-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Unbounded';font-weight:900;src:url('../assets/fonts/unbounded/unbounded-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #0b0d12;
  --bg-2: #06070a;
  --silver: #d8dee8;
  --crimson: #ff2d55;
  --ink: #f3f5f9;
  --ink-dim: #8d97a8;
}
html,body{margin:0;padding:0;width:1080px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.scene{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 20% 15%, rgba(255,45,85,0.10), transparent 60%),
  radial-gradient(ellipse 900px 900px at 85% 80%, rgba(216,222,232,0.08), transparent 60%),
  var(--bg);
}

/* ---- texture: ascending price-staircase bars + fine grid ---- */
.grid-fine{position:absolute;inset:0;z-index:0;opacity:0.35;background-image:
  repeating-linear-gradient(0deg, rgba(216,222,232,0.05) 0px, rgba(216,222,232,0.05) 1px, transparent 1px, transparent 84px),
  repeating-linear-gradient(90deg, rgba(216,222,232,0.05) 0px, rgba(216,222,232,0.05) 1px, transparent 1px, transparent 84px);}
.stairs{position:absolute;left:0;right:0;bottom:0;height:340px;z-index:0;display:flex;align-items:flex-end;justify-content:space-between;padding:0 32px;opacity:0.4;}
.stair{width:26px;border-radius:3px 3px 0 0;}
.stair.silver{background:linear-gradient(180deg, var(--silver), transparent);}
.stair.crimson{background:linear-gradient(180deg, var(--crimson), transparent);}
.vignette{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 12%, transparent 82%, rgba(0,0,0,0.6) 100%);pointer-events:none;}

.safe{position:absolute;left:0;right:0;top:224px;bottom:400px;display:flex;flex-direction:column;z-index:2;padding:0 72px;box-sizing:border-box;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--crimson);text-transform:uppercase;}
.headline{font-family:'Unbounded',sans-serif;font-weight:800;font-size:76px;line-height:1.14;letter-spacing:-0.01em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.6);margin:20px 0;}
.headline .hi-crimson{color:var(--crimson);}
.headline .hi-silver{-webkit-text-fill-color:var(--silver);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:40px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);}

/* ---- price-tag component: angular card with a notch + punch hole ---- */
.price-tag{position:relative;background:rgba(255,255,255,0.04);border:1.5px solid rgba(216,222,232,0.28);padding:30px 40px 30px 64px;margin:14px 0;
  clip-path:polygon(28px 0, 100% 0, 100% 100%, 28px 100%, 0 50%);}
.price-tag::before{content:'';position:absolute;left:14px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:var(--bg);border:1.5px solid rgba(216,222,232,0.4);}
.price-tag-row{display:flex;justify-content:space-between;align-items:baseline;}
.price-tag-label{font-family:'Inter',sans-serif;font-weight:600;font-size:34px;color:var(--ink-dim);}
.price-tag-value{font-family:'JBMono',monospace;font-weight:700;font-size:42px;color:var(--ink);}
.price-tag-value.hi{color:var(--crimson);font-size:52px;}
.price-tag.active{border-color:var(--crimson);box-shadow:0 0 30px rgba(255,45,85,0.25);}

.big-stat{font-family:'Unbounded',sans-serif;font-weight:900;font-size:180px;line-height:1;letter-spacing:-0.02em;color:var(--crimson);text-shadow:0 8px 30px rgba(0,0,0,.6);}
.big-stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.08em;color:var(--ink-dim);text-transform:uppercase;margin-top:10px;}

.human-wrap{position:absolute;right:-10px;bottom:60px;width:290px;z-index:2;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));}
.human-wrap svg{width:100%;}
</style></head>
<body>

<!-- ============ SCENE 1 — HOOK ============ -->
<div class="scene" id="scene1">
  <div class="grid-fine"></div>
  <div class="stairs">
    ${[...Array(20)].map((_, i) => {
      const h = 30 + i * 14;
      const crimson = i % 4 === 3;
      return `<div class="stair ${crimson ? 'crimson' : 'silver'}" style="height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="vignette"></div>
  <div class="safe">
    <div class="eyebrow">// AI PRICING WATCH</div>
    <div class="headline">OpenAI is about to charge <span class="hi-crimson">$500</span> a month for ChatGPT.</div>
    <div class="sub">That's 2.5x its current top tier.</div>
    <div class="human-wrap">${humanHook}</div>
  </div>
</div>

<!-- ============ SCENE 3 — THE LADDER ============ -->
<div class="scene" id="scene3">
  <div class="grid-fine"></div>
  <div class="stairs">
    ${[...Array(20)].map((_, i) => {
      const h = 30 + i * 14;
      const crimson = i % 4 === 3;
      return `<div class="stair ${crimson ? 'crimson' : 'silver'}" style="height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="vignette"></div>
  <div class="safe" style="justify-content:center;gap:0;">
    <div class="eyebrow">// THE LADDER</div>
    <div class="headline" style="font-size:64px;margin-bottom:20px;">Four tiers. One <span class="hi-crimson">huge</span> jump.</div>
    <div class="price-tag"><div class="price-tag-row"><span class="price-tag-label">Free</span><span class="price-tag-value">$0</span></div></div>
    <div class="price-tag"><div class="price-tag-row"><span class="price-tag-label">Plus</span><span class="price-tag-value">$20</span></div></div>
    <div class="price-tag"><div class="price-tag-row"><span class="price-tag-label">Pro</span><span class="price-tag-value">$200</span></div></div>
    <div class="price-tag active"><div class="price-tag-row"><span class="price-tag-label">Pro Max</span><span class="price-tag-value hi">$500</span></div></div>
  </div>
</div>

<!-- ============ SCENE 9 — STAT CALLOUT ============ -->
<div class="scene" id="scene9">
  <div class="grid-fine"></div>
  <div class="stairs">
    ${[...Array(20)].map((_, i) => {
      const h = 30 + i * 14;
      const crimson = i % 4 === 3;
      return `<div class="stair ${crimson ? 'crimson' : 'silver'}" style="height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="vignette"></div>
  <div class="safe" style="align-items:center;text-align:center;justify-content:center;">
    <div class="eyebrow">// STAT CALLOUT</div>
    <div class="big-stat">2.5x</div>
    <div class="big-stat-label">the current top tier · $500 / month</div>
    <div class="sub" style="margin-top:40px;">That's the new number to watch.</div>
  </div>
</div>

</body></html>`;

  await writeFile(join(__dirname, 'mockup.html'), html, 'utf8');
  console.log('wrote mockup.html');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`file://${join(__dirname, 'mockup.html')}`);
  await page.waitForTimeout(300);

  for (const id of ['scene1', 'scene3', 'scene9']) {
    await page.evaluate((sceneId) => {
      for (const el of document.querySelectorAll('.scene')) el.style.display = 'none';
      document.getElementById(sceneId).style.display = 'block';
    }, id);
    await page.screenshot({ path: join(__dirname, `mockup-${id}.png`) });
    console.log(`wrote mockup-${id}.png`);
  }
  await browser.close();
}

main();
