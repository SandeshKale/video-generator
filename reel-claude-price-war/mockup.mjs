#!/usr/bin/env node
// Design-approval mockup for "The Price Cut That Didn't Matter" reel — a new
// "Market Ticker" visual system, deliberately distinct from rundown-ios
// (navy/green-blue-amber, dot-grid+hatch, rounded cards) and loop-method
// (near-black/cyan-magenta, graph-grid+scanline, clip-corner panels):
//   - Palette: deep plum/aubergine background, lime (gain) + coral (burn) accents
//   - Texture: scrolling ticker-tape marquee (top+bottom) + drifting candlestick bars
//   - Component: "ticket stub" cards — perforated left edge, rotated corner stamp
//   - Type: Sora (display, new to this repo) + Inter (body) + JetBrains Mono (numbers)
// Static PNG screenshots only — no __seek loop needed for a design-approval mockup.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);
async function read(p) { return readFile(p, 'utf8'); }

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
  const [anthropic, openai] = await Promise.all([
    brandLogo('logos/gilbarbara/anthropic-icon.svg'),
    brandLogo('logos/gilbarbara/openai-icon.svg'),
  ]);
  // Fresh poses/colors — standing-3 and standing-20 haven't been used in any
  // prior reel (rundown-ios used the old single humaaans figure; loop-method
  // used standing-9 and standing-16).
  const humanTest = await humaaansFull('standing', 'standing-3', { coatColor: '#ff5d3a', pantColor: '#2a1030' });

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Sora';font-weight:700;src:url('../assets/fonts/sora/sora-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Sora';font-weight:800;src:url('../assets/fonts/sora/sora-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --plum: #1b0f24;
  --plum-2: #120a19;
  --lime: #c6ff3d;
  --coral: #ff5d3a;
  --ink: #f3ecf7;
  --ink-dim: #b7a8c4;
}
html,body{margin:0;padding:0;width:1080px;background:var(--plum);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.scene{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 50% 20%, rgba(198,255,61,0.08), transparent 60%),
  radial-gradient(ellipse 800px 900px at 90% 85%, rgba(255,93,58,0.10), transparent 60%),
  var(--plum);
}

/* ---- texture: candlestick field, drifting (static frame for mockup) ---- */
.candles{position:absolute;inset:0;z-index:0;opacity:0.5;}
.candle{position:absolute;width:14px;border-radius:2px;}
.candle.up{background:linear-gradient(180deg, var(--lime), transparent);box-shadow:0 0 18px 2px rgba(198,255,61,0.25);}
.candle.down{background:linear-gradient(180deg, var(--coral), transparent);box-shadow:0 0 18px 2px rgba(255,93,58,0.2);}

/* ---- texture: ticker-tape marquee strips ---- */
.ticker{position:absolute;left:0;right:0;height:64px;z-index:1;overflow:hidden;background:rgba(0,0,0,0.28);border-top:1px solid rgba(255,255,255,0.08);border-bottom:1px solid rgba(255,255,255,0.08);}
.ticker-top{top:150px;}
.ticker-bottom{top:1536px;}
.ticker-track{position:absolute;top:0;left:0;height:64px;display:flex;align-items:center;gap:48px;white-space:nowrap;font-family:'JBMono',monospace;font-weight:700;font-size:26px;letter-spacing:0.02em;padding-left:40px;}
.tick{display:inline-flex;align-items:center;gap:10px;color:var(--ink-dim);}
.tick .up{color:var(--lime);}
.tick .down{color:var(--coral);}
.tick .arrow{font-size:20px;}

.vignette{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 12%, transparent 82%, rgba(0,0,0,0.55) 100%);pointer-events:none;}

.safe{position:absolute;left:0;right:0;top:214px;bottom:400px;display:flex;flex-direction:column;z-index:2;padding:0 72px;box-sizing:border-box;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.16em;color:var(--lime);text-transform:uppercase;}
.headline{font-family:'Sora',sans-serif;font-weight:800;font-size:88px;line-height:1.08;letter-spacing:-0.03em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.55), 0 2px 4px rgba(0,0,0,.8);margin:20px 0;}
.headline .hl-lime{color:var(--lime);}
.headline .hl-coral{color:var(--coral);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:42px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);}

/* ---- ticket-stub card component ---- */
.ticket{position:relative;background:rgba(255,255,255,0.045);border:2px dashed rgba(255,255,255,0.22);border-radius:6px;padding:36px 40px 36px 56px;margin:18px 0;}
.ticket::before{content:'';position:absolute;left:-1px;top:0;bottom:0;width:1px;
  background-image: radial-gradient(circle 9px, var(--plum) 9px, transparent 10px);
  background-size: 100% 40px; background-position: left top; background-repeat: repeat-y;}
.stamp{position:absolute;top:-16px;right:24px;transform:rotate(6deg);background:var(--lime);color:#12210a;font-family:'JBMono',monospace;font-weight:700;font-size:22px;letter-spacing:0.06em;padding:6px 16px;border-radius:3px;box-shadow:0 4px 14px rgba(0,0,0,.4);}
.stamp.coral{background:var(--coral);color:#3a0f04;}
.ticket-row{display:flex;justify-content:space-between;align-items:baseline;margin:6px 0;}
.ticket-label{font-family:'Inter',sans-serif;font-weight:600;font-size:32px;color:var(--ink-dim);}
.ticket-value{font-family:'JBMono',monospace;font-weight:700;font-size:36px;color:var(--ink);}
.ticket-value.lime{color:var(--lime);}
.ticket-value.coral{color:var(--coral);}

.chip-row{display:flex;gap:16px;margin:16px 0;}
.chip{display:inline-flex;align-items:center;gap:10px;font-family:'JBMono',monospace;font-weight:700;font-size:24px;letter-spacing:0.05em;padding:10px 20px;border-radius:4px;border:1.5px solid;}
.chip.lime{color:var(--lime);border-color:rgba(198,255,61,0.5);background:rgba(198,255,61,0.08);}
.chip.coral{color:var(--coral);border-color:rgba(255,93,58,0.5);background:rgba(255,93,58,0.08);}
.chip svg{width:28px;height:28px;}

.brand-badge{width:96px;height:96px;border-radius:50%;background:rgba(255,255,255,0.06);border:2px solid rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;}
.brand-badge svg{width:50px;height:50px;color:var(--ink);}
.brand-badge.win{border-color:var(--lime);box-shadow:0 0 24px rgba(198,255,61,0.35);}
.brand-badge.lose{border-color:var(--coral);opacity:0.55;}

.big-stat{font-family:'Sora',sans-serif;font-weight:800;font-size:200px;line-height:1;letter-spacing:-0.04em;color:var(--coral);text-shadow:0 8px 30px rgba(0,0,0,.6);}
.big-stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:32px;letter-spacing:0.08em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;}

.human-wrap{position:absolute;right:-20px;bottom:420px;width:340px;z-index:2;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));}
.human-wrap svg{width:100%;}
</style></head>
<body>

<!-- ============ SCENE 1 — HOOK ============ -->
<div class="scene" id="scene1">
  <div class="candles">
    ${[...Array(10)].map((_, i) => {
      const up = i % 2 === 0;
      const h = 80 + (i * 37) % 260;
      const x = 40 + i * 108;
      const y = 1920 - h - ((i * 53) % 300) - 300;
      return `<div class="candle ${up ? 'up' : 'down'}" style="left:${x}px;top:${y}px;height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="ticker ticker-top"><div class="ticker-track">
    ${[...Array(6)].map(() => `
      <span class="tick"><span class="up">GPT-6 SOL</span> <span class="arrow">▾</span> -50%</span>
      <span class="tick"><span class="down">OPUS 5.5</span> <span class="arrow">▴</span> BENCHMARK LEADER</span>
      <span class="tick">CLAUDE CODE <span class="up">+20%</span> LIMITS</span>
    `).join('')}
  </div></div>
  <div class="ticker ticker-bottom"><div class="ticker-track">
    ${[...Array(6)].map(() => `
      <span class="tick">LUNA <span class="up">$0.10/$0.50</span></span>
      <span class="tick">SOL <span class="up">$2/$10</span></span>
      <span class="tick"><span class="down">22% BUDGET</span> · 1 TASK · 4 HRS</span>
    `).join('')}
  </div></div>
  <div class="vignette"></div>
  <div class="safe">
    <div class="eyebrow">// AI MARKET WATCH</div>
    <div class="headline">OpenAI cut prices <span class="hl-lime">50%.</span><br>Devs went back to <span class="hl-coral">Claude</span> anyway.</div>
    <div class="sub">Here's the number that explains why.</div>
  </div>
</div>

<!-- ============ SCENE 5 — THE REAL TEST ============ -->
<div class="scene" id="scene5">
  <div class="candles">
    ${[...Array(10)].map((_, i) => {
      const up = i % 3 !== 0;
      const h = 60 + (i * 41) % 220;
      const x = 40 + i * 108;
      const y = 1920 - h - ((i * 61) % 280) - 260;
      return `<div class="candle ${up ? 'up' : 'down'}" style="left:${x}px;top:${y}px;height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="ticker ticker-top"><div class="ticker-track">
    ${[...Array(6)].map(() => `<span class="tick">THE REAL TEST <span class="arrow">▸</span> GPT-6-SOL ON A LIVE TASK</span>`).join('')}
  </div></div>
  <div class="ticker ticker-bottom"><div class="ticker-track">
    ${[...Array(6)].map(() => `<span class="tick"><span class="down">4 HOURS</span> · $100/MO PLAN · <span class="down">22% GONE</span></span>`).join('')}
  </div></div>
  <div class="vignette"></div>
  <div class="safe">
    <div class="eyebrow">// STEP 05 — LIVE TEST</div>
    <div class="headline" style="font-size:66px;">One builder pointed <span class="hl-coral">GPT-6-Sol</span> at a real task.</div>
    <div class="ticket">
      <div class="stamp coral">4 HOURS</div>
      <div class="ticket-row"><span class="ticket-label">Task</span><span class="ticket-value">Build a course, unsupervised</span></div>
      <div class="ticket-row"><span class="ticket-label">Plan</span><span class="ticket-value">$100/mo Codex</span></div>
      <div class="ticket-row"><span class="ticket-label">Consumed</span><span class="ticket-value coral">22% of weekly limit</span></div>
      <div class="ticket-row"><span class="ticket-label">Result</span><span class="ticket-value">"Pretty decent" first draft</span></div>
    </div>
    <div class="chip-row">
      <span class="chip coral">${await (async()=>{const s=await read(A('icons/tabler/alert-triangle.svg')).catch(()=>null);return s?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${[...s.matchAll(/<path[^>]*\/>/g)].map(m=>m[0]).join('')}</svg>`:'';})()} EXPENSIVE</span>
      <span class="chip lime">50% CHEAPER STICKER PRICE</span>
    </div>
  </div>
  <div class="human-wrap">${humanTest}</div>
</div>

<!-- ============ SCENE 9 — BIG STAT ============ -->
<div class="scene" id="scene9">
  <div class="candles">
    ${[...Array(10)].map((_, i) => {
      const up = false;
      const h = 70 + (i * 47) % 240;
      const x = 40 + i * 108;
      const y = 1920 - h - ((i * 71) % 260) - 260;
      return `<div class="candle down" style="left:${x}px;top:${y}px;height:${h}px;"></div>`;
    }).join('')}
  </div>
  <div class="ticker ticker-top"><div class="ticker-track">
    ${[...Array(6)].map(() => `<span class="tick">THE NUMBER THAT MATTERS <span class="arrow">▸</span> NOT THE STICKER PRICE</span>`).join('')}
  </div></div>
  <div class="ticker ticker-bottom"><div class="ticker-track">
    ${[...Array(6)].map(() => `<span class="tick">EFFICIENCY <span class="up">BEAT</span> THE DISCOUNT</span>`).join('')}
  </div></div>
  <div class="vignette"></div>
  <div class="safe" style="align-items:center;text-align:center;justify-content:center;">
    <div class="eyebrow">// STAT CALLOUT</div>
    <div class="big-stat">22%</div>
    <div class="big-stat-label">of a monthly budget · one task · four hours</div>
    <div class="sub" style="margin-top:40px;">That's the number that matters —<br>not the 50% off sticker price.</div>
    <div style="display:flex;gap:28px;margin-top:50px;">
      <div class="brand-badge lose">${openai}</div>
      <div class="brand-badge win">${anthropic}</div>
    </div>
  </div>
</div>

</body></html>`;

  await writeFile(join(__dirname, 'mockup.html'), html, 'utf8');
  console.log('wrote mockup.html');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`file://${join(__dirname, 'mockup.html')}`);
  await page.waitForTimeout(300);

  for (const id of ['scene1', 'scene5', 'scene9']) {
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
