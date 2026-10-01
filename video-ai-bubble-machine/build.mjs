#!/usr/bin/env node
// Assembles parts/partNN.html (one self-contained 16:9 page per chapter) from
// script.json + timing.json (voiceover timings) + scenes/pNN.mjs.
// Usage: bun build.mjs [partId ...]   (no args = all parts)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONT_FACES, BASE_CSS, RUNTIME_JS, CORE_JS, tablerIcon, logoAsIs, brandMono } from './lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const script = JSON.parse(await readFile(join(__dirname, 'script.json'), 'utf8'));
const timing = existsSync(join(__dirname, 'timing.json')) ? JSON.parse(await readFile(join(__dirname, 'timing.json'), 'utf8')) : { parts: [] };

const iconCache = {};
const ctx = {
  icon: async (n) => (iconCache[n] ??= await tablerIcon(n)),
  logo: logoAsIs,
  mono: brandMono,
};

// Falls back to a words-per-second estimate when a part has no voiceover yet
// (lets scenes be previewed while TTS is still running).
function timingFor(part) {
  const t = timing.parts.find((p) => p.id === part.id);
  if (t) return { ...t, estimated: false };
  let cur = 0.9; const sentences = [];
  for (const s of part.sentences) {
    const d = s.split(/\s+/).length / 2.7;
    sentences.push({ start: +cur.toFixed(3), end: +(cur + d).toFixed(3), text: s });
    cur += d + 0.6;
  }
  return { id: part.id, duration: +(cur + 1).toFixed(3), sentences, estimated: true };
}

const AMB_PATHS = [
  'M -50 210 C 420 90, 760 380, 1180 250 S 1760 120, 1980 300',
  'M -50 820 C 380 960, 820 640, 1250 780 S 1740 960, 1980 780',
  'M 340 -40 C 520 300, 160 520, 560 700 S 1000 1000, 880 1130',
];
const ambCoins = [];
for (let k = 0; k < 9; k++) ambCoins.push({ k, path: k % 3, sp: 0.010 + (k % 4) * 0.0045, ph: (k * 0.237) % 1 });

const files = process.argv.slice(2).map(Number);
const parts = script.parts.filter((p) => !files.length || files.includes(p.id));
await mkdir(join(__dirname, 'parts'), { recursive: true });
for (const part of parts) {
  const T = timingFor(part);
  const modPath = join(__dirname, 'scenes', `p${String(part.id).padStart(2, '0')}.mjs`);
  let scene = { css: '', html: '<div class="abs" style="left:0;top:300px;width:1700px;text-align:center;font-size:60px" class="h2">scene not built yet</div>', js: 'function render(t){}' };
  if (existsSync(modPath)) scene = await (await import(modPath + `?v=${Date.now()}`)).default(ctx, { part, T });
  const segs = Array.from({ length: 12 }, (_, i) => `<div class="seg" id="seg${i}"><i></i></div>`).join('');
  const amb = ambCoins.map((c) => `<g id="amb${c.k}"><circle r="16" fill="#ffc53d" opacity=".14"/><circle r="7" fill="#ffc53d"/></g>`).join('');
  const ambPaths = AMB_PATHS.map((d, i) => `<path class="pipe" id="ambp${i}" d="${d}" fill="none" stroke="rgba(244,239,230,0.07)" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>part ${part.id}</title>
<style>${FONT_FACES}${BASE_CSS}${scene.css || ''}</style></head><body>
<div id="world">
  <div id="bg"><div id="bgwash"></div><div id="iso"></div><div class="glow" id="glowMint"></div><div class="glow" id="glowCoral"></div>
    <svg id="ambient" viewBox="0 0 1920 1080">${ambPaths}${amb}</svg><div id="vig"></div></div>
  <div id="header"><div id="hdrTick"></div><div><div id="hdrKick">${part.kicker}</div><div id="hdrTitle">${part.title}</div></div></div>
  <div id="brand">THE <b>AI BUBBLE</b> MACHINE<br>${String(part.id).padStart(2, '0')} / 12</div>
  <div id="stage">${scene.html}</div>
  <div id="cap"><div id="captxt"></div></div>
  <div id="rail">${segs}</div>
  <div id="intro"><div class="iwipe" id="iw1"></div><div class="iwipe" id="iw2"></div>
    <div id="iText"><div id="iKick">${part.kicker}</div><div id="iTitle">${part.title}</div></div></div>
</div>
<script>
${RUNTIME_JS}
var PIDX=${part.id - 1}, DUR=${T.duration};
var SENTS=${JSON.stringify(T.sentences.map(({ start, end, text }) => ({ start, end, text })))};
function CUE(i){return SENTS[Math.min(i,SENTS.length-1)].start;}
function ENDT(i){return SENTS[Math.min(i,SENTS.length-1)].end;}
var AMB=[];
(function(){var sp=${JSON.stringify(ambCoins.map((c) => [c.k, c.path, c.sp, c.ph]))};
  sp.forEach(function(a){AMB.push({g:$('amb'+a[0]),path:$('ambp'+a[1]),sp:a[2],ph:a[3]});});})();
${scene.js || ''}
${CORE_JS}
window.__reelDurationSec = DUR;
window.__seek = function(t){ core(t); };
core(0);
</script></body></html>`;
  await writeFile(join(__dirname, 'parts', `part${String(part.id).padStart(2, '0')}.html`), html, 'utf8');
  console.log(`part ${String(part.id).padStart(2, '0')}: ${T.duration.toFixed(1)}s ${T.estimated ? '(estimated timing)' : ''}`);
}
