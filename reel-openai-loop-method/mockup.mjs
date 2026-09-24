#!/usr/bin/env node
// Quick static mockup of a distinct "Terminal / Signal" visual system for
// the Loop Method reel, for design approval before rebuilding all 10 scenes.
// Not wired into the seek/render pipeline — just two frozen frames.
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
async function featherIcon(name) {
  const src = await read(A(`icons/feather/${name}.svg`));
  const m = src.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${m[1]}</svg>`;
}
async function humaaansPart(relPath) {
  const src = await read(join(ROOT, 'reel-app/src/humaaans', relPath));
  const body = src
    .replace(/^[\s\S]*?=>\s*\(/, '')
    .replace(/\);\s*export default[\s\S]*$/, '')
    .replace(/strokeWidth=\{1\}/g, 'stroke-width="1"')
    .replace(/fillRule="evenodd"/g, 'fill-rule="evenodd"');
  return body.trim();
}

const [pencil, photo, refresh, alertCircle, settings, repeat, circleCheck] = await Promise.all(
  ['pencil', 'photo', 'refresh', 'alert-circle', 'settings', 'repeat', 'circle-check'].map(tablerIcon)
);
const scissors = await featherIcon('scissors');
const humanHead = await humaaansPart('head/Short.jsx');
const humanTorso = await humaaansPart('torso/PointingUp.jsx');
const humanBottom = await humaaansPart('bottom/SkinnyJeans.jsx');
const humanSvg = `<svg viewBox="0 0 380 480"><g fill-rule="evenodd" stroke-width="1">
  <g transform="translate(40.000000, 31.000000)">
    <g transform="translate(82.000000, 0.000000)">${humanHead}</g>
    <g transform="translate(0.000000, 187.000000)">${humanBottom}</g>
    <g transform="translate(22.000000, 82.000000)">${humanTorso}</g>
  </g>
</g></svg>`;

const CSS = `
@font-face{font-family:'Poppins';font-weight:800;src:url('../assets/fonts/poppins/poppins-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Poppins';font-weight:900;src:url('../assets/fonts/poppins/poppins-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

html,body{margin:0;padding:0;background:#050607;}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;background:#050607;font-family:'Inter',sans-serif;}
.grid-lines{position:absolute;inset:-2px;background-image:
  repeating-linear-gradient(0deg, rgba(0,229,255,0.07) 0px, rgba(0,229,255,0.07) 1px, transparent 1px, transparent 90px),
  repeating-linear-gradient(90deg, rgba(0,229,255,0.07) 0px, rgba(0,229,255,0.07) 1px, transparent 1px, transparent 90px);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1400px at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%);}
.scanline{position:absolute;left:0;right:0;height:220px;background:linear-gradient(180deg, transparent, rgba(0,229,255,0.10), transparent);}
.glow-cyan{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle, rgba(0,229,255,0.16), transparent 68%);filter:blur(4px);}
.glow-magenta{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle, rgba(255,47,166,0.13), transparent 68%);}

.readout{position:absolute;top:150px;bottom:400px;width:34px;font-family:'JBMono';font-size:20px;font-weight:500;color:rgba(0,229,255,0.32);line-height:2.1;writing-mode:vertical-rl;letter-spacing:0.1em;}
.readout.left{left:58px;}
.readout.right{right:200px;color:rgba(255,47,166,0.32);}

.safe{position:absolute;top:150px;left:0;right:190px;bottom:400px;z-index:1;display:flex;flex-direction:column;padding:0 44px;box-sizing:border-box;}
.tag{display:inline-flex;align-items:center;gap:14px;font-family:'JBMono';font-weight:700;font-size:28px;letter-spacing:0.06em;color:#0ff1e0;border:1.5px solid rgba(0,229,255,0.55);padding:14px 22px;background:rgba(0,229,255,0.06);}
.tag .b{opacity:0.55;}
.tag svg{width:32px;height:32px;color:#0ff1e0;}
.tag.magenta{color:#ff6fc4;border-color:rgba(255,47,166,0.55);background:rgba(255,47,166,0.06);}
.tag.magenta svg{color:#ff6fc4;}
.tag.active{background:rgba(0,229,255,0.16);box-shadow:0 0 24px rgba(0,229,255,0.35);}

.panel{position:relative;background:rgba(10,14,18,0.72);border:1px solid rgba(0,229,255,0.35);clip-path:polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px));box-shadow:inset 0 0 40px rgba(0,229,255,0.06);}
.panel::before{content:'';position:absolute;top:0;left:0;width:28px;height:28px;border-top:2px solid #0ff1e0;border-left:2px solid #0ff1e0;}
.panel::after{content:'';position:absolute;bottom:0;right:0;width:28px;height:28px;border-bottom:2px solid #ff6fc4;border-right:2px solid #ff6fc4;}

.headline{font-family:'Poppins',sans-serif;color:#eef8fb;font-size:70px;font-weight:800;line-height:1.14;letter-spacing:-0.03em;text-shadow:0 4px 14px rgba(0,0,0,.6), 0 0 30px rgba(0,229,255,0.12);}
.headline .acc{color:#0ff1e0;}
.sub{font-family:'Inter',sans-serif;color:#94b3bd;font-size:36px;font-weight:600;line-height:1.4;}
.mono-label{font-family:'JBMono';font-weight:700;font-size:26px;letter-spacing:0.16em;color:#5fd8e8;text-transform:uppercase;}

.ring-wrap{position:relative;width:560px;height:560px;}
.ring-num{font-family:'Poppins',sans-serif;font-weight:900;font-size:190px;color:#eef8fb;text-shadow:0 0 40px rgba(0,229,255,0.5);}
`;

const scene1 = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="frame">
  <div class="grid-lines"></div>
  <div class="glow-cyan" style="left:-200px;top:-100px;"></div>
  <div class="glow-magenta" style="right:-220px;bottom:200px;"></div>
  <div class="scanline" style="top:900px;"></div>
  <div class="vignette"></div>
  <div class="readout left">01001100 01001111 01001111 01010000</div>
  <div class="readout right">ITERATE REFINE VERIFY</div>
  <div class="safe">
    <div style="flex:1.2;display:flex;align-items:center;justify-content:center;position:relative;">
      <div style="width:340px;height:432px;position:relative;left:-160px;">${humanSvg}</div>
      <div class="panel" style="position:absolute;right:0;top:40px;padding:26px 30px;display:flex;flex-direction:column;gap:16px;">
        <div class="tag">${pencil}<span>WRITING</span></div>
        <div class="tag magenta">${scissors}<span>EDITING</span></div>
        <div class="tag">${photo}<span>IMAGES</span></div>
      </div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:28px;">
      <div class="mono-label">// STATUS: QUALITY DRIFT DETECTED</div>
      <div class="headline">My ChatGPT workflow works... but the <span class="acc">quality keeps drifting</span>.</div>
    </div>
  </div>
</div>
</body></html>`;

const scene6 = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="frame">
  <div class="grid-lines"></div>
  <div class="glow-cyan" style="left:50%;top:35%;transform:translate(-50%,-50%);"></div>
  <div class="vignette"></div>
  <div class="readout left">L1 L2 L3 L1 L2 L3</div>
  <div class="readout right">SCAN FIX RERUN</div>
  <div class="safe">
    <div style="flex:0.6;display:flex;align-items:center;justify-content:center;">
      <div class="headline" style="text-align:center;font-size:62px;">Step 4 — Run exactly <span class="acc">3 loops</span>.</div>
    </div>
    <div style="flex:2.2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;position:relative;">
      <div class="ring-wrap">
        <svg viewBox="0 0 200 200" style="width:100%;height:100%;position:absolute;">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(0,229,255,0.14)" stroke-width="2"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,229,255,0.4)" stroke-width="10" stroke-dasharray="6 10" stroke-linecap="round"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="#0ff1e0" stroke-width="10" stroke-linecap="round"
            stroke-dasharray="335" stroke-dashoffset="112" transform="rotate(-90 100 100)"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
          <div class="ring-num">2</div>
        </div>
      </div>
      <div class="mono-label">LOOP 2 / 3</div>
      <div class="panel" style="width:100%;padding:34px 20px;display:flex;align-items:center;justify-content:space-between;box-sizing:border-box;">
        <div class="icon-b" style="width:70px;height:70px;color:#ff6fc4;">${alertCircle}</div>
        <div class="icon-b" style="width:70px;height:70px;color:#5fd8e8;">${settings}</div>
        <div class="icon-b" style="width:70px;height:70px;color:#0ff1e0;">${repeat}</div>
        <div class="icon-b" style="width:70px;height:70px;color:#0ff1e0;">${circleCheck}</div>
      </div>
      <div class="sub" style="text-align:center;">Fix the workflow, not the output.</div>
    </div>
  </div>
</div>
</body></html>`;

await writeFile(join(__dirname, 'mockup-scene1.html'), scene1, 'utf8');
await writeFile(join(__dirname, 'mockup-scene6.html'), scene6, 'utf8');
console.log('wrote mockup-scene1.html and mockup-scene6.html');
