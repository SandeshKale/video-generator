#!/usr/bin/env node
// Purpose-built cover/thumbnail for "OpenAI Wants $500/Month For ChatGPT" —
// not a frame grab from the video. Same "Price Tag" visual system
// (Unbounded/Inter/JetBrains Mono, near-black/silver/crimson, price-
// staircase texture, notched price-tag language) but its own composition:
// a diagonal ASCENDING cascade of four price tags (small, bottom-left, to
// huge, top-right) linked by a rising ledger-wire — a shape that appears
// nowhere in the reel itself (the reel's ladder scene is a plain vertical
// stack, never a diagonal cascade).
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

const [crown] = await Promise.all(['crown'].map(tablerIcon));
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// Ascending cascade: four tags, each bigger + further up/right than the
// last, joined by straight ledger-wire segments. Positions are hand-tuned
// (not derived from the reel's own scene layout) so the shape reads as a
// standalone hero graphic.
const tags = [
  { label: 'Free', value: '$0', x: 90, y: 1080, w: 260, scale: 0.72, tier: 0 },
  { label: 'Plus', value: '$20', x: 210, y: 960, w: 300, scale: 0.82, tier: 1 },
  { label: 'Pro', value: '$200', x: 350, y: 820, w: 340, scale: 0.94, tier: 2 },
  { label: 'Pro Max', value: '$500', x: 470, y: 650, w: 460, scale: 1.15, tier: 3, hi: true },
];
const wireSegs = [];
for (let i = 0; i < tags.length - 1; i++) {
  const a = tags[i], b = tags[i + 1];
  wireSegs.push({ x1: a.x + a.w * 0.28, y1: a.y, x2: b.x + b.w * 0.28, y2: b.y });
}

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Unbounded';font-weight:800;src:url('../assets/fonts/unbounded/unbounded-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Unbounded';font-weight:900;src:url('../assets/fonts/unbounded/unbounded-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{ --bg:#0b0d12; --bg-2:#06070a; --silver:#d8dee8; --crimson:#ff2d55; --ink:#f3f5f9; --ink-dim:#8d97a8; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 20% 15%, rgba(255,45,85,0.12), transparent 60%),
  radial-gradient(ellipse 900px 900px at 85% 75%, rgba(216,222,232,0.09), transparent 60%),
  var(--bg);}
.grid-fine{position:absolute;inset:0;opacity:0.4;background-image:
  repeating-linear-gradient(0deg, rgba(216,222,232,0.05) 0px, rgba(216,222,232,0.05) 1px, transparent 1px, transparent 84px),
  repeating-linear-gradient(90deg, rgba(216,222,232,0.05) 0px, rgba(216,222,232,0.05) 1px, transparent 1px, transparent 84px);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1600px at 50% 40%, transparent 44%, rgba(0,0,0,0.62) 100%);}

.eyebrow{position:absolute;top:120px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.16em;color:var(--crimson);}

.hero{position:absolute;top:0;left:0;width:1080px;height:1250px;}
.wire{position:absolute;stroke:rgba(216,222,232,0.55);stroke-width:3;stroke-dasharray:10 10;fill:none;}
.crown-mark{position:absolute;width:96px;height:96px;color:var(--crimson);filter:drop-shadow(0 0 22px rgba(255,45,85,0.6));}

.cascade-tag{position:absolute;background:rgba(255,255,255,0.05);border:1.5px solid rgba(216,222,232,0.3);padding:22px 34px 22px 62px;box-sizing:border-box;
  clip-path:polygon(36px 0, 100% 0, 100% 100%, 36px 100%, 0 50%);}
.cascade-tag::before{content:'';position:absolute;left:16px;top:50%;width:16px;height:16px;margin-top:-8px;border-radius:50%;background:var(--bg-2);border:2px solid rgba(216,222,232,0.5);}
.cascade-tag.hi{border-color:var(--crimson);box-shadow:0 0 40px rgba(255,45,85,0.32);}
.cascade-tag.hi::before{border-color:var(--crimson);}
.cascade-row{display:flex;justify-content:space-between;align-items:baseline;gap:24px;}
.cascade-label{font-family:'Inter',sans-serif;font-weight:600;color:var(--ink-dim);}
.cascade-value{font-family:'JBMono',monospace;font-weight:700;color:var(--ink);}
.cascade-value.hi{color:var(--crimson);}

.title{position:absolute;top:1300px;left:0;right:0;text-align:center;font-family:'Unbounded',sans-serif;font-weight:800;color:var(--ink);font-size:88px;line-height:1.08;letter-spacing:-0.015em;text-shadow:0 6px 20px rgba(0,0,0,.7);padding:0 60px;box-sizing:border-box;}
.title .hi{color:var(--crimson);}
.subtitle{position:absolute;top:1560px;left:60px;right:60px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:40px;color:var(--ink-dim);line-height:1.35;}
.structure{position:absolute;top:1680px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.05em;color:var(--crimson);}

.brand{position:absolute;bottom:100px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:22px;}
.brand img{width:92px;height:92px;border-radius:50%;object-fit:cover;border:3px solid var(--crimson);box-shadow:0 0 24px rgba(255,45,85,0.5);}
.brand .handle{font-family:'Unbounded',sans-serif;font-weight:800;font-size:36px;color:var(--ink);}
</style></head>
<body>
<div class="frame">
  <div class="grid-fine"></div>
  <div class="eyebrow">// AI PRICING WATCH <span style="color:var(--silver);">·</span> LEAKED</div>

  <div class="hero">
    <svg width="1080" height="1250" style="position:absolute;top:0;left:0;">
      ${wireSegs.map((s) => `<line class="wire" x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}"/>`).join('')}
    </svg>
    ${tags.map((t) => `
      <div class="cascade-tag${t.hi ? ' hi' : ''}" style="left:${t.x}px;top:${t.y}px;width:${t.w}px;transform:scale(${t.scale});transform-origin:left center;">
        <div class="cascade-row">
          <span class="cascade-label" style="font-size:${34}px;">${t.label}</span>
          <span class="cascade-value${t.hi ? ' hi' : ''}" style="font-size:${t.hi ? 56 : 40}px;">${t.value}</span>
        </div>
      </div>`).join('')}
    <div class="crown-mark" style="left:${tags[3].x + tags[3].w * 1.15 * 0.9}px;top:${tags[3].y - 130}px;">${crown}</div>
  </div>

  <div class="vignette"></div>
  <div class="title">OPENAI WANTS <span class="hi">$500/MONTH</span></div>
  <div class="subtitle">For ChatGPT. That's 2.5x the current top tier — leaked days before DevDay.</div>
  <div class="structure">FREE → PLUS → PRO → PRO MAX</div>
  <div class="brand"><img src="data:image/jpeg;base64,${profileB64}" alt=""><div class="handle">@sandesh.explains</div></div>
</div>
</body></html>`;

await writeFile(join(__dirname, 'cover.html'), html, 'utf8');
console.log('wrote cover.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(__dirname, 'cover.html')}`);
await page.waitForTimeout(300);
await page.screenshot({ path: join(__dirname, 'cover.png') });
await browser.close();
console.log('wrote cover.png');
