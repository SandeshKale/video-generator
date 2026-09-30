#!/usr/bin/env node
// Purpose-built cover/thumbnail for the dots-vs-Grok-Bot reel — not a
// frame grab from the video. Same "Arena/Duotone" visual system (fonts,
// colors, arena-split bg, VS-badge language) but its own composition: a
// split-ring hero (openai + grok flanking a giant central VS badge, with
// 4 orbiting fact-icons) that appears nowhere in the reel's 10 scenes.
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
async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g>([\s\S]*)<\/g>\s*<\/svg>/);
  return `<svg viewBox="${inner[1]}" fill="currentColor">${inner[2].replace(/ fill="#000000"/g, '')}</svg>`;
}

const [link, flame, deviceDesktop, server] = await Promise.all(
  ['link', 'flame', 'device-desktop', 'server'].map(tablerIcon)
);
const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// 4 orbit nodes = the 4 hard facts the reel hinges on, evenly spaced
// around a ring split indigo (dots' half) / amber (grok bot's half).
const orbit = [
  { icon: link, color: '#5b6bff', angle: -135 },
  { icon: flame, color: '#ffab2e', angle: -45 },
  { icon: deviceDesktop, color: '#5b6bff', angle: 135 },
  { icon: server, color: '#ffab2e', angle: 45 },
];
const R = 330;
const orbitNodes = orbit.map(({ icon, color, angle }) => {
  const rad = (angle * Math.PI) / 180;
  const x = 340 + R * Math.cos(rad);
  const y = 340 + R * Math.sin(rad);
  return `<div class="orbit-node" style="left:${x}px;top:${y}px;color:${color};box-shadow:0 0 26px ${color}66;border-color:${color}88;">${icon}</div>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Manrope';font-weight:700;src:url('../assets/fonts/manrope/manrope-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Manrope';font-weight:800;src:url('../assets/fonts/manrope/manrope-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
:root{ --bg:#15171d; --indigo:#5b6bff; --amber:#ffab2e; --ink:#eef0f7; --ink-dim:#9aa0b4; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 1100px 900px at 12% 10%, rgba(91,107,255,0.32), transparent 58%),
  radial-gradient(ellipse 1100px 1000px at 90% 88%, rgba(255,171,46,0.26), transparent 58%),
  var(--bg);}
.arena-split{position:absolute;inset:-10% -30%;transform:rotate(-11deg);background:linear-gradient(90deg,
  rgba(91,107,255,0.18) 0%, rgba(91,107,255,0.06) 46%, transparent 50%,
  rgba(255,171,46,0.06) 54%, rgba(255,171,46,0.18) 100%);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 38%, rgba(0,0,0,0.62) 100%);}
.eyebrow{position:absolute;top:150px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:32px;letter-spacing:0.16em;color:var(--indigo);}
.eyebrow .b{color:var(--amber);}
.orbit-wrap{position:absolute;top:230px;left:50%;width:680px;height:680px;margin-left:-340px;}
.orbit-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from -90deg, rgba(91,107,255,0.4) 0deg 180deg, rgba(255,171,46,0.4) 180deg 360deg);padding:3px;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 3px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 3px));box-shadow:0 0 60px rgba(91,107,255,0.2), 0 0 60px rgba(255,171,46,0.15);}
.orbit-ring::before{content:'';position:absolute;inset:40px;border-radius:50%;border:1.5px dashed rgba(238,240,247,0.2);}
.orbit-node{position:absolute;width:118px;height:118px;margin:-59px 0 0 -59px;border-radius:50%;background:#0d0e12;border:2px solid;display:flex;align-items:center;justify-content:center;}
.orbit-node svg{width:56px;height:56px;}
.center-row{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:22px;}
.center-badge{width:96px;height:96px;border-radius:22px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;}
.center-badge svg{width:56px;height:56px;color:var(--indigo);}
.center-vs{position:relative;width:130px;height:130px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg, var(--indigo), var(--amber));
  box-shadow:0 1px 2px rgba(0,0,0,.4), 0 14px 34px rgba(0,0,0,.55), 0 0 0 5px var(--bg), 0 0 0 8px rgba(255,255,255,0.12);}
.center-vs span{font-family:'Manrope',sans-serif;font-weight:800;font-size:40px;color:#0d0e12;letter-spacing:-0.02em;}
.center-grok{font-family:'Manrope',sans-serif;font-weight:800;font-size:34px;color:var(--amber);}
.title{position:absolute;top:960px;left:0;right:0;text-align:center;font-family:'Manrope',sans-serif;font-weight:800;color:var(--ink);font-size:108px;line-height:1.02;letter-spacing:-0.02em;text-shadow:0 6px 20px rgba(0,0,0,.7);}
.title .hi{color:var(--amber);text-decoration:underline wavy rgba(255,171,46,0.6);text-underline-offset:14px;text-decoration-thickness:4px;}
.subtitle{position:absolute;top:1195px;left:60px;right:60px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:44px;color:var(--ink-dim);line-height:1.35;}
.stepline{position:absolute;top:1400px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.05em;color:var(--indigo);}
.stepline .arrow{color:#4a4e5c;margin:0 6px;}
.brand{position:absolute;bottom:150px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:24px;}
.brand img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--indigo);box-shadow:0 0 24px rgba(91,107,255,0.5);}
.brand .handle{font-family:'Manrope',sans-serif;font-weight:800;font-size:40px;color:var(--ink);}
</style></head>
<body>
<div class="bg-wash"></div>
<div class="arena-split"></div>
<div class="vignette"></div>
<div class="eyebrow">// THE AGENT ARMS RACE <span class="b">·</span> DEVDAY 2026</div>
<div class="orbit-wrap">
  <div class="orbit-ring"></div>
  ${orbitNodes}
  <div class="center-row">
    <div class="center-badge">${openai}</div>
    <div class="center-vs"><span>VS</span></div>
    <div class="center-badge"><div class="center-grok">grok</div></div>
  </div>
</div>
<div class="title">dots <span class="hi">vs</span><br>grok bot</div>
<div class="subtitle">OpenAI's own domain redirects to the rival it just launched against.</div>
<div class="stepline">JULY <span class="arrow">→</span> AUG 11 <span class="arrow">→</span> SEPT 29</div>
<div class="brand"><img src="data:image/jpeg;base64,${profileB64}" alt=""><div class="handle">@sandesh.explains</div></div>
</body></html>`;

await writeFile(join(__dirname, 'cover.html'), html, 'utf8');
console.log('wrote cover.html');

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(__dirname, 'cover.html')}`);
await page.waitForTimeout(300);
await page.screenshot({ path: join(__dirname, 'cover.png') });
await browser.close();
console.log('wrote cover.png');
