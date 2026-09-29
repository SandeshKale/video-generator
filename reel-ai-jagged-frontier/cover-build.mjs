#!/usr/bin/env node
// Purpose-built cover/thumbnail for "The Jagged Frontier" reel — not a
// frame grab. Same visual system (Fraunces serif, gold/red duotone,
// jagged-skyline texture, torn-edge panel language) but its own
// composition: a single oversized jagged peak-to-valley chart line with a
// trophy pinned at the summit and an error mark pinned at the bottom —
// a hero graphic that appears nowhere in the reel's actual scenes (there
// it's a thin, low-opacity scrolling background texture, never a large
// foreground centerpiece with icons pinned to it).
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

const [trophy, x] = await Promise.all(['trophy', 'x'].map(tablerIcon));
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// Hero: one jagged path — rises in sharp zigzag steps to a summit (gold),
// then plunges in sharp zigzag steps to a trough (red). Coordinates in a
// 900x760 local box, drawn with a two-color stroke split at the peak.
const goldPts = '0,560 60,600 120,500 180,540 240,400 300,440 360,280 420,320 480,120';
const redPts  = '480,120 540,260 600,220 660,420 720,380 780,600 840,560 900,700';
const dotsGold = [[0,560],[120,500],[240,400],[360,280],[480,120]];
const dotsRed  = [[600,220],[720,380],[840,560]];

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Fraunces';font-weight:900;src:url('../assets/fonts/fraunces/fraunces-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
:root{ --bg:#120d0d; --gold:#ffcf40; --red:#ff3b3b; --ink:#f7f0e6; --ink-dim:#c9b6a8; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 20% 15%, rgba(255,207,64,0.12), transparent 60%),
  radial-gradient(ellipse 900px 900px at 85% 78%, rgba(255,59,59,0.12), transparent 60%),
  var(--bg);}
.bg-grid{position:absolute;inset:-60px;opacity:0.14;
  background-image: linear-gradient(rgba(247,240,230,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,240,230,0.5) 1px, transparent 1px);
  background-size: 54px 54px;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.62) 100%);}

.eyebrow{position:absolute;top:150px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:32px;letter-spacing:0.16em;color:var(--gold);}
.eyebrow .b{color:var(--red);}

.hero{position:absolute;top:250px;left:90px;width:900px;height:760px;}
.hero-icon{position:absolute;width:104px;height:104px;border-radius:50%;background:#0e0a0a;display:flex;align-items:center;justify-content:center;}
.hero-icon svg{width:56px;height:56px;}
.hero-icon.peak{border:2.5px solid var(--gold);color:var(--gold);box-shadow:0 0 34px rgba(255,207,64,0.55);}
.hero-icon.valley{border:2.5px solid var(--red);color:var(--red);box-shadow:0 0 34px rgba(255,59,59,0.55);}

.title{position:absolute;top:1078px;left:0;right:0;text-align:center;font-family:'Fraunces',serif;font-weight:900;color:var(--ink);font-size:112px;line-height:1.04;letter-spacing:-0.01em;text-shadow:0 6px 20px rgba(0,0,0,.75);}
.title .hi-gold{color:var(--gold);text-decoration:underline wavy rgba(255,207,64,0.6);text-underline-offset:14px;text-decoration-thickness:4px;}
.subtitle{position:absolute;top:1330px;left:70px;right:70px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:46px;color:var(--ink-dim);line-height:1.35;text-shadow:0 3px 10px rgba(0,0,0,.5);}
.stepline{position:absolute;top:1500px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.05em;color:var(--gold);}
.stepline .b{color:var(--red);}

.brand{position:absolute;bottom:150px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:24px;}
.brand img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);box-shadow:0 0 24px rgba(255,207,64,0.55);}
.brand .handle{font-family:'Fraunces',serif;font-weight:900;font-size:40px;color:var(--ink);}
</style></head>
<body>
<div class="bg-wash"></div>
<div class="bg-grid"></div>
<div class="vignette"></div>

<div class="eyebrow">// AI CAPABILITY REPORT <span class="b">·</span> GENIUS TO IDIOT</div>

<div class="hero">
  <svg width="900" height="760" viewBox="0 0 900 760">
    <polyline points="${goldPts}" fill="none" stroke="#ffcf40" stroke-width="7" stroke-linejoin="round"/>
    <polyline points="${redPts}" fill="none" stroke="#ff3b3b" stroke-width="7" stroke-linejoin="round"/>
    ${dotsGold.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#ffcf40"/>`).join('')}
    ${dotsRed.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#ff3b3b"/>`).join('')}
  </svg>
  <div class="hero-icon peak" style="left:432px;top:14px;">${trophy}</div>
  <div class="hero-icon valley" style="left:792px;top:594px;">${x}</div>
</div>

<div class="title">THE <span class="hi-gold">JAGGED</span><br>FRONTIER</div>
<div class="subtitle">It just won math olympiad gold — and still can't count the r's in "strawberry."</div>
<div class="stepline">GOLD-MEDAL PEAKS <span class="b">·</span> CHILDLIKE VALLEYS</div>

<div class="brand"><img src="data:image/jpeg;base64,${profileB64}" alt=""><div class="handle">@sandesh.explains</div></div>
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
