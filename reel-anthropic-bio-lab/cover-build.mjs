#!/usr/bin/env node
// Purpose-built cover/thumbnail for "An AI Just Found Something No Human
// Has Ever Seen" — not a frame grab from the video. Same "Bio Lab" visual
// system (Outfit/Inter/JetBrains Mono, teal-black/green/violet, hex-grid
// texture, DNA-helix motif) but its own composition: a large circular
// "lens" ringing a zoomed-in double-helix segment with the anomaly
// highlighted and called out — a shape that appears nowhere in the reel
// itself (the reel's helix only ever appears as a thin decorative gutter
// in the far left/right margins, never as a large centered hero).
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
async function read(p) { return readFile(p, 'utf8'); }

const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// Zoomed double-helix segment inside the lens: two sine strands + rungs,
// hand-tuned to sit centered inside a 460px-diameter circle, with one
// rung/enzyme pair picked out in violet as "the anomaly."
const helixPath = 'M60,0 C160,50 -40,100 60,150 C160,200 -40,250 60,300 C160,350 -40,400 60,450';
const helixPathB = 'M180,0 C80,50 280,100 180,150 C80,200 280,250 180,300 C80,350 280,400 180,450';

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Outfit';font-weight:700;src:url('../assets/fonts/outfit/outfit-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Outfit';font-weight:800;src:url('../assets/fonts/outfit/outfit-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{ --bg:#05100e; --bg-2:#030907; --bio-green:#3dffb0; --bio-violet:#b26bff; --ink:#eafff5; --ink-dim:#8fb8ac; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 22% 16%, rgba(178,107,255,0.14), transparent 60%),
  radial-gradient(ellipse 900px 900px at 80% 78%, rgba(61,255,176,0.14), transparent 60%),
  var(--bg);}
.hexgrid{position:absolute;inset:0;opacity:0.3;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1600px at 50% 38%, transparent 44%, rgba(0,0,0,0.62) 100%);}

.eyebrow{position:absolute;top:118px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.14em;color:var(--bio-green);}

.lens-wrap{position:absolute;top:190px;left:50%;width:520px;height:520px;margin-left:-260px;}
.lens-ring-outer{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(234,255,245,0.35);}
.lens-ring-inner{position:absolute;inset:30px;border-radius:50%;border:1.5px solid rgba(61,255,176,0.4);box-shadow:0 0 60px rgba(61,255,176,0.18), inset 0 0 60px rgba(0,0,0,0.5);overflow:hidden;background:radial-gradient(circle, rgba(61,255,176,0.06), var(--bg-2) 72%);}
.lens-glint{position:absolute;top:36px;left:70px;width:120px;height:60px;border-radius:50%;background:rgba(234,255,245,0.12);filter:blur(8px);transform:rotate(-25deg);}
.lens-crosshair{position:absolute;left:50%;top:50%;width:2px;height:2px;}
.lens-crosshair::before,.lens-crosshair::after{content:'';position:absolute;background:rgba(234,255,245,0.15);}
.lens-crosshair::before{width:520px;height:1px;left:-260px;top:0;}
.lens-crosshair::after{width:1px;height:520px;left:0;top:-260px;}
.anomaly-tag{position:absolute;top:250px;left:670px;font-family:'JBMono',monospace;font-weight:700;font-size:26px;color:var(--bio-violet);background:rgba(178,107,255,0.1);border:1.5px solid rgba(178,107,255,0.5);padding:14px 22px;
  clip-path:polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);}
.anomaly-wire{position:absolute;top:280px;left:560px;width:110px;height:2px;background:rgba(178,107,255,0.5);}

.title{position:absolute;top:790px;left:0;right:0;text-align:center;font-family:'Outfit',sans-serif;font-weight:800;color:var(--ink);font-size:82px;line-height:1.1;letter-spacing:-0.015em;text-shadow:0 6px 20px rgba(0,0,0,.7);padding:0 56px;box-sizing:border-box;}
.title .hi{color:var(--bio-green);}
.subtitle{position:absolute;top:1090px;left:60px;right:60px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:41px;color:var(--ink-dim);line-height:1.4;}
.structure{position:absolute;top:1290px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.04em;color:var(--bio-green);}
.structure .sep{color:#3a5c52;margin:0 10px;}

.brand{position:absolute;bottom:120px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:22px;}
.brand img{width:94px;height:94px;border-radius:50%;object-fit:cover;border:3px solid var(--bio-green);box-shadow:0 0 24px rgba(61,255,176,0.5);}
.brand .handle{font-family:'Outfit',sans-serif;font-weight:800;font-size:38px;color:var(--ink);}
</style></head>
<body>
<div class="frame">
  <svg class="hexgrid" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hexpat" width="96" height="166" patternUnits="userSpaceOnUse">
        <polygon points="48,0 96,28 96,83 48,111 0,83 0,28" fill="none" stroke="rgba(61,255,176,0.3)" stroke-width="1.5"/>
        <polygon points="48,111 96,139 96,194 48,222 0,194 0,139" fill="none" stroke="rgba(178,107,255,0.24)" stroke-width="1.5"/>
      </pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#hexpat)"/>
  </svg>
  <div class="eyebrow">// AI BIOLOGY WATCH &nbsp;·&nbsp; FIRST DISCOVERY</div>

  <div class="lens-wrap">
    <div class="lens-ring-outer"></div>
    <div class="lens-crosshair"></div>
    <div class="lens-ring-inner">
      <svg viewBox="0 0 240 460" style="position:absolute;top:20px;left:130px;width:180px;height:420px;overflow:visible;">
        <path d="${helixPath}" fill="none" stroke="var(--bio-green)" stroke-width="5"/>
        <path d="${helixPathB}" fill="none" stroke="var(--bio-violet)" stroke-width="5"/>
        ${[...Array(8)].map((_, i) => `<line x1="60" y1="${i * 60 + 10}" x2="180" y2="${i * 60 + 10}" stroke="rgba(234,255,245,0.35)" stroke-width="3"/>`).join('')}
        <circle cx="120" cy="190" r="16" fill="none" stroke="var(--bio-violet)" stroke-width="3"/>
      </svg>
    </div>
    <div class="lens-glint"></div>
  </div>
  <div class="anomaly-wire"></div>
  <div class="anomaly-tag">ANOMALY</div>

  <div class="vignette"></div>
  <div class="title">AN AI JUST FOUND SOMETHING <span class="hi">NO HUMAN</span> HAS EVER SEEN</div>
  <div class="subtitle">Anthropic's AI biology lab spots a CRISPR-like anomaly in viral DNA.</div>
  <div class="structure">950 AGENTS <span class="sep">&rarr;</span> 210M TOKENS <span class="sep">&rarr;</span> 1 DISCOVERY</div>
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
