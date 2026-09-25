#!/usr/bin/env node
// Design-approval mockup for "Amazon Blocked It. Five Other Giants Didn't."
// — a new "Signal Wave" visual system, deliberately distinct from every
// prior reel:
//   - rundown-ios: navy bg, green/blue/amber, dot-grid+hatch, rounded cards
//   - loop-method: near-black bg, cyan/magenta, graph-grid+scanline, clip-corner panels
//   - price-war: plum bg, lime/coral, ticker-tape+candlesticks, ticket-stub cards
//   - THIS: warm espresso-charcoal bg, amber/violet, concentric voice-ripple
//     rings + drifting waveform bars, rounded chat-bubble tags (with a tail),
//     Plus Jakarta Sans display font (new to this repo)
// Static PNG screenshots only — no __seek loop needed for a design mockup.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

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
  const [meta, github] = await Promise.all(['meta', 'github'].map(simpleIcon));
  const [micOff, block] = await Promise.all(['microphone', 'lock'].map(tablerIcon));
  const humanHook = await humaaansFull('standing', 'standing-7', { coatColor: '#8b7bff', pantColor: '#241c14' });

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'PlusJakarta';font-weight:700;src:url('../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'PlusJakarta';font-weight:800;src:url('../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #171310;
  --bg-2: #100d0a;
  --amber: #ffb84d;
  --violet: #8b7bff;
  --ink: #f6efe6;
  --ink-dim: #c2b6a8;
}
html,body{margin:0;padding:0;width:1080px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.scene{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 78% 18%, rgba(255,184,77,0.10), transparent 60%),
  radial-gradient(ellipse 800px 900px at 15% 85%, rgba(139,123,255,0.12), transparent 60%),
  var(--bg);
}

/* ---- texture: concentric voice-ripple rings + waveform bars ---- */
.ripples{position:absolute;inset:0;z-index:0;overflow:hidden;}
.ripple{position:absolute;border-radius:50%;border:2px solid rgba(255,184,77,0.16);}
.ripple.violet{border-color:rgba(139,123,255,0.16);}
.wavebars{position:absolute;left:0;right:0;bottom:0;height:260px;z-index:0;display:flex;align-items:flex-end;justify-content:space-between;padding:0 40px;opacity:0.35;}
.wavebar{width:8px;border-radius:4px;background:linear-gradient(180deg, var(--amber), transparent);}
.wavebar.v{background:linear-gradient(180deg, var(--violet), transparent);}
.vignette{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 12%, transparent 82%, rgba(0,0,0,0.55) 100%);pointer-events:none;}

.safe{position:absolute;left:0;right:0;top:150px;bottom:400px;display:flex;flex-direction:column;z-index:2;padding:0 72px;box-sizing:border-box;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--amber);text-transform:uppercase;}
.headline{font-family:'PlusJakarta',sans-serif;font-weight:800;font-size:84px;line-height:1.1;letter-spacing:-0.02em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.55), 0 2px 4px rgba(0,0,0,.8);margin:18px 0;}
.headline .hi-amber{color:var(--amber);}
.headline .hi-violet{color:var(--violet);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:40px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);}

/* ---- chat-bubble component (with tail) — this reel's card/chip language ---- */
.bubble{position:relative;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,184,77,0.35);border-radius:28px;padding:22px 32px;display:inline-flex;align-items:center;gap:16px;}
.bubble::after{content:'';position:absolute;left:36px;bottom:-14px;width:0;height:0;border:14px solid transparent;border-top-color:rgba(255,184,77,0.35);border-bottom:0;}
.bubble.blocked{border-color:rgba(139,123,255,0.4);opacity:0.65;}
.bubble.blocked::after{border-top-color:rgba(139,123,255,0.4);}
.bubble-icon{width:44px;height:44px;flex:0 0 44px;color:var(--ink);}
.bubble-icon svg{width:100%;height:100%;}
.bubble-label{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.02em;color:var(--ink);}

.stat-big{font-family:'PlusJakarta',sans-serif;font-weight:800;font-size:210px;line-height:1;letter-spacing:-0.03em;color:var(--amber);text-shadow:0 8px 30px rgba(0,0,0,.6);}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.08em;color:var(--ink-dim);text-transform:uppercase;margin-top:6px;}

.human-wrap{position:absolute;right:-10px;bottom:420px;width:320px;z-index:2;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));}
.human-wrap svg{width:100%;}
</style></head>
<body>

<!-- ============ SCENE 1 — HOOK ============ -->
<div class="scene" id="scene1">
  <div class="ripples">
    <div class="ripple" style="width:900px;height:900px;left:-200px;top:-180px;"></div>
    <div class="ripple" style="width:700px;height:700px;left:-100px;top:-80px;"></div>
    <div class="ripple violet" style="width:1000px;height:1000px;right:-320px;bottom:200px;"></div>
    <div class="ripple violet" style="width:760px;height:760px;right:-200px;bottom:280px;"></div>
  </div>
  <div class="wavebars">
    ${[...Array(28)].map((_, i) => {
      const h = 40 + ((i * 53) % 180);
      const violet = i % 3 === 0;
      return `<div class="wavebar${violet ? ' v' : ''}" style="height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="vignette"></div>
  <div class="safe">
    <div class="eyebrow">// AI HARDWARE WATCH</div>
    <div class="headline">Amazon just blocked Meta's new <span class="hi-violet">AI agent.</span></div>
    <div class="sub">Five other giants didn't.</div>
  </div>
  <div class="human-wrap">${humanHook}</div>
</div>

<!-- ============ SCENE 6 — PARTNER RUSH ============ -->
<div class="scene" id="scene6">
  <div class="ripples">
    <div class="ripple" style="width:820px;height:820px;left:50%;top:40%;margin:-410px 0 0 -410px;"></div>
    <div class="ripple" style="width:620px;height:620px;left:50%;top:40%;margin:-310px 0 0 -310px;"></div>
  </div>
  <div class="wavebars">
    ${[...Array(28)].map((_, i) => {
      const h = 30 + ((i * 61) % 150);
      const violet = i % 4 === 0;
      return `<div class="wavebar${violet ? ' v' : ''}" style="height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="vignette"></div>
  <div class="safe" style="justify-content:center;gap:28px;">
    <div class="eyebrow">// THIS WEEK, MUSE PICKED UP</div>
    <div class="headline" style="font-size:64px;margin-bottom:10px;">Five giants joined. <span class="hi-violet">One blocked.</span></div>
    <div style="display:flex;flex-direction:column;gap:26px;margin-top:10px;">
      <div class="bubble"><span class="bubble-icon">${meta}</span><span class="bubble-label">MUSE BY META</span></div>
      <div class="bubble"><span class="bubble-icon">${github}</span><span class="bubble-label">GITHUB JOINED</span></div>
      <div class="bubble"><span class="bubble-icon" style="color:var(--ink-dim);">${micOff}</span><span class="bubble-label">PAYPAL · WALMART · BOX</span></div>
      <div class="bubble blocked"><span class="bubble-icon">${block}</span><span class="bubble-label">AMAZON — BLOCKED</span></div>
    </div>
  </div>
</div>

<!-- ============ SCENE 9 — STAT CALLOUT ============ -->
<div class="scene" id="scene9">
  <div class="ripples">
    <div class="ripple" style="width:900px;height:900px;left:50%;top:44%;margin:-450px 0 0 -450px;"></div>
    <div class="ripple violet" style="width:700px;height:700px;left:50%;top:44%;margin:-350px 0 0 -350px;"></div>
    <div class="ripple" style="width:500px;height:500px;left:50%;top:44%;margin:-250px 0 0 -250px;"></div>
  </div>
  <div class="wavebars">
    ${[...Array(28)].map((_, i) => {
      const h = 40 + ((i * 47) % 160);
      const violet = i % 2 === 0;
      return `<div class="wavebar${violet ? ' v' : ''}" style="height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="vignette"></div>
  <div class="safe" style="align-items:center;text-align:center;justify-content:center;gap:16px;">
    <div class="eyebrow">// STAT CALLOUT</div>
    <div class="stat-big">5:1</div>
    <div class="stat-label">giants joined · one giant blocked</div>
    <div class="sub" style="margin-top:30px;">That's the scoreboard on Meta's biggest pivot yet.</div>
  </div>
</div>

</body></html>`;

  await writeFile(join(__dirname, 'mockup.html'), html, 'utf8');
  console.log('wrote mockup.html');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`file://${join(__dirname, 'mockup.html')}`);
  await page.waitForTimeout(300);

  for (const id of ['scene1', 'scene6', 'scene9']) {
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
