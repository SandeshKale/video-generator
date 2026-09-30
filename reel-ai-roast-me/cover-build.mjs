#!/usr/bin/env node
// Purpose-built cover/thumbnail for the "Roast Me" reel — not a frame
// grab. Same visual system (Anton display type, charred orange/cyan
// duotone, scorch-edge panel language) but its own composition: a fanned
// stack of "feed photo" cards with the top one catching fire — a hero
// that appears nowhere in the reel's actual scenes (there the fire motif
// is ember particles + flame icon badges, never a photo-stack-on-fire).
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

const [flame, heart, camera] = await Promise.all(['flame', 'heart', 'camera'].map(tablerIcon));
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

function hash(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
const sparks = [...Array(14)].map((_, i) => ({
  x: 340 + hash(i) * 400,
  y: 60 + hash(i + 40) * 420,
  size: 3 + hash(i + 80) * 6,
  orange: hash(i + 120) > 0.3,
}));

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Anton';font-weight:400;src:url('../assets/fonts/anton/anton-latin-400-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
:root{ --bg:#160b05; --orange:#ff7a29; --cyan:#3fd8ff; --ink:#fbeee0; --ink-dim:#cfae95; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 22% 18%, rgba(255,122,41,0.16), transparent 60%),
  radial-gradient(ellipse 900px 900px at 82% 78%, rgba(63,216,255,0.10), transparent 60%),
  var(--bg);}
.bg-grain{position:absolute;inset:0;opacity:0.05;background-image:repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.6) 0, transparent 2px);background-size:6px 6px;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 40%, transparent 40%, rgba(0,0,0,0.62) 100%);}

.eyebrow{position:absolute;top:150px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.14em;color:var(--orange);}
.eyebrow .b{color:var(--cyan);}

.hero{position:absolute;top:240px;left:0;right:0;height:560px;}
.photocard{position:absolute;left:50%;top:50%;width:340px;height:340px;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.55);}
.pc1{background:linear-gradient(160deg,#2a3a4a,#1a2530);margin:-170px 0 0 -290px;transform:rotate(-14deg);}
.pc2{background:linear-gradient(160deg,#3a2f4a,#241d30);margin:-170px 0 0 -170px;transform:rotate(-3deg);}
.pc3{background:linear-gradient(160deg,#4a2a1f,#2f1a12);margin:-172px 0 0 -50px;transform:rotate(11deg);
  clip-path:polygon(0% 0%,100% 0%,100% 78%,92% 88%,100% 92%,86% 100%,74% 90%,60% 100%,48% 92%,36% 100%,22% 90%,8% 100%,0% 88%);
  box-shadow:0 24px 60px rgba(0,0,0,.6), 0 0 60px rgba(255,122,41,0.35);}
.pc-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.25);}
.pc-icon svg{width:120px;height:120px;}
.flame-burst{position:absolute;left:50%;top:50%;margin:-320px 0 0 15px;width:220px;height:220px;color:var(--orange);
  filter:drop-shadow(0 0 40px rgba(255,122,41,0.75)) drop-shadow(0 0 80px rgba(255,122,41,0.4));transform:rotate(8deg);}
.spark{position:absolute;border-radius:50%;}

.title{position:absolute;top:880px;left:0;right:0;text-align:center;font-family:'Anton',sans-serif;font-weight:400;color:var(--ink);font-size:126px;line-height:1.02;letter-spacing:0.01em;text-transform:uppercase;text-shadow:0 6px 20px rgba(0,0,0,.75);}
.title .hi{color:var(--orange);}
.subtitle{position:absolute;top:1140px;left:65px;right:65px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:44px;color:var(--ink-dim);line-height:1.35;text-shadow:0 3px 10px rgba(0,0,0,.5);}
.stepline{position:absolute;top:1330px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.05em;color:var(--cyan);}
.stepline .b{color:#7a6a5c;margin:0 6px;}

.brand{position:absolute;bottom:150px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:24px;}
.brand img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--orange);box-shadow:0 0 24px rgba(255,122,41,0.55);}
.brand .handle{font-family:'Anton',sans-serif;font-weight:400;font-size:40px;color:var(--ink);text-transform:uppercase;}
</style></head>
<body>
<div class="bg-wash"></div>
<div class="bg-grain"></div>
<div class="vignette"></div>

<div class="eyebrow">// THE VIRAL AI TREND <span class="b">·</span> 310K+ ROASTED</div>

<div class="hero">
  ${sparks.map(s => `<div class="spark" style="left:${s.x.toFixed(0)}px;top:${s.y.toFixed(0)}px;width:${s.size.toFixed(0)}px;height:${s.size.toFixed(0)}px;background:${s.orange ? '#ff7a29' : '#3fd8ff'};box-shadow:0 0 ${(s.size*2.5).toFixed(0)}px ${s.orange ? '#ff7a29' : '#3fd8ff'};"></div>`).join('\n  ')}
  <div class="photocard pc1"><div class="pc-icon">${heart}</div></div>
  <div class="photocard pc2"><div class="pc-icon">${camera}</div></div>
  <div class="photocard pc3"></div>
  <div class="flame-burst">${flame}</div>
</div>

<div class="title">AI ROASTED<br><span class="hi">MY FEED.</span></div>
<div class="subtitle">310,000+ people asked AI to destroy their Instagram. Here's why it feels so good.</div>
<div class="stepline">SCREENSHOT <span class="b">→</span> ROAST <span class="b">→</span> SURVIVE</div>

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
