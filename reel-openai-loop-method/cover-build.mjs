#!/usr/bin/env node
// Purpose-built cover/thumbnail for the Loop Method reel — not a frame
// grab from the video. Same "Terminal/Signal" visual system (fonts,
// colors, grid/scanline bg, panel language) but its own composition:
// a custom orbiting-icon ring hero instead of any in-reel layout.
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
async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g>([\s\S]*)<\/g>\s*<\/svg>/);
  return `<svg viewBox="${inner[1]}" fill="currentColor">${inner[2].replace(/ fill="#000000"/g, '')}</svg>`;
}

const [pencil, target, refresh, circleCheck, bulb, search, school] = await Promise.all(
  ['pencil', 'target', 'refresh', 'circle-check', 'bulb', 'search', 'school'].map(tablerIcon)
);
const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// 5 orbit nodes = the 5 steps, evenly spaced around the ring.
const orbit = [
  { icon: pencil, color: '#0ff1e0', angle: -90 },
  { icon: target, color: '#5fd8e8', angle: -18 },
  { icon: refresh, color: '#ff6fc4', angle: 54 },
  { icon: circleCheck, color: '#0ff1e0', angle: 126 },
  { icon: bulb, color: '#ff8ed4', angle: 198 },
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
@font-face{font-family:'SpaceGrotesk';font-weight:600;src:url('../assets/fonts/space-grotesk/space-grotesk-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'SpaceGrotesk';font-weight:700;src:url('../assets/fonts/space-grotesk/space-grotesk-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:#050607;overflow:hidden;font-family:'Inter',sans-serif;}
.grid-lines{position:absolute;inset:-4px;background-image:
  repeating-linear-gradient(0deg, rgba(0,229,255,0.10) 0px, rgba(0,229,255,0.10) 1px, transparent 1px, transparent 90px),
  repeating-linear-gradient(90deg, rgba(0,229,255,0.10) 0px, rgba(0,229,255,0.10) 1px, transparent 1px, transparent 90px);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.6) 100%);}
.glow{position:absolute;width:1000px;height:1000px;left:50%;top:640px;margin:-500px 0 0 -500px;border-radius:50%;background:radial-gradient(circle, rgba(0,229,255,0.24), rgba(255,47,166,0.10) 55%, transparent 75%);}
.eyebrow{position:absolute;top:150px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:32px;letter-spacing:0.18em;color:#5fd8e8;}
.eyebrow .b{color:#ff6fc4;}
.orbit-wrap{position:absolute;top:230px;left:50%;width:680px;height:680px;margin-left:-340px;}
.orbit-ring{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(0,229,255,0.4);box-shadow:0 0 60px rgba(0,229,255,0.25), inset 0 0 60px rgba(0,229,255,0.08);}
.orbit-ring::before{content:'';position:absolute;inset:40px;border-radius:50%;border:1.5px dashed rgba(0,229,255,0.25);}
.orbit-node{position:absolute;width:118px;height:118px;margin:-59px 0 0 -59px;border-radius:50%;background:#0a1216;border:2px solid;display:flex;align-items:center;justify-content:center;}
.orbit-node svg{width:56px;height:56px;}
.openai-center{position:absolute;top:50%;left:50%;width:170px;height:208px;margin:-104px 0 0 -85px;color:#eef8fb;filter:drop-shadow(0 0 30px rgba(0,229,255,0.5));}
.title{position:absolute;top:960px;left:0;right:0;text-align:center;font-family:'SpaceGrotesk',sans-serif;font-weight:700;color:#eef8fb;font-size:118px;line-height:1.02;letter-spacing:-0.02em;text-shadow:0 6px 20px rgba(0,0,0,.7);}
.title .hi{color:#0ff1e0;text-decoration:underline wavy rgba(0,229,255,0.6);text-underline-offset:14px;text-decoration-thickness:4px;}
.subtitle{position:absolute;top:1230px;left:60px;right:60px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:46px;color:#9fb8c2;line-height:1.35;}
.stepline{position:absolute;top:1420px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:34px;letter-spacing:0.06em;color:#5fd8e8;}
.stepline .arrow{color:#3a4a50;margin:0 6px;}
.brand{position:absolute;bottom:150px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:24px;}
.brand img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid #0ff1e0;box-shadow:0 0 24px rgba(0,229,255,0.5);}
.brand .handle{font-family:'SpaceGrotesk',sans-serif;font-weight:700;font-size:40px;color:#eef8fb;}
</style></head>
<body>
<div class="grid-lines"></div>
<div class="glow"></div>
<div class="vignette"></div>
<div class="eyebrow">// AI WORKFLOW SYSTEM <span class="b">·</span> 5 STEPS</div>
<div class="orbit-wrap">
  <div class="orbit-ring"></div>
  ${orbitNodes}
  <div class="openai-center">${openai}</div>
</div>
<div class="title">THE<br><span class="hi">LOOP</span> METHOD</div>
<div class="subtitle">Stop your ChatGPT output from quietly drifting — every time.</div>
<div class="stepline">PICK <span class="arrow">→</span> PANEL <span class="arrow">→</span> DEFINE <span class="arrow">→</span> LOOP×3 <span class="arrow">→</span> TEST</div>
<div class="brand"><img src="data:image/jpeg;base64,${profileB64}" alt=""><div class="handle">@sandesh.explains</div></div>
</body></html>`;

await writeFile(join(__dirname, 'cover.html'), html, 'utf8');
console.log('wrote cover.html');
