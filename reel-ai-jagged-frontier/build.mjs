#!/usr/bin/env node
// Assembles reel.html for "The Jagged Frontier" — AI is superhuman at hard
// problems (IMO gold, bar exam) and face-plants on trivial ones (letter
// counting, digit comparison). Built programmatically from real files in
// assets/ — no hand-copied SVG.
//
// Visual system: "Jagged Frontier" — near-black warm-red-tinted charcoal
// background, gold ("genius/peak") + true-red ("error/valley") duotone, a
// literal animated jagged skyline/capability-graph line as the background
// texture (t-driven pattern scroll, not a dot-grid/hex-grid/hatch), torn/
// zigzag-edge "receipt" cards, Fraunces serif display font (first serif in
// this repo). Approved from this reel's own mockup.mjs
// (mockup-1/2/3.png).
//
// House rules that AREN'T about visual identity, still applied:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), scrubbed via progress(e)
//   - Hard safe-zone exclusion: nothing in top ~224px, bottom ~400px, right ~190px
//   - Real vendored fonts, off-white text, soft shadow for legibility
//   - A gap-filling "seism-bridge" component (this reel's signal-bridge
//     equivalent) between every header band and its content band
//   - Subtle scene-to-scene crossfade transitions (TRANS window)
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
  const [trophy, award, certificate, scaleIcon, code, alertTriangle, x, checks, circleCheck, cpu, brain, target] = await Promise.all(
    ['trophy', 'award', 'certificate', 'scale', 'code', 'alert-triangle', 'x', 'checks', 'circle-check', 'cpu', 'brain', 'target'].map(tablerIcon)
  );

  // Two fresh humaaans poses, unused in any prior reel (used so far across
  // this repo: old reel-app figure, standing-9/16, standing-3/20,
  // standing-7/13, standing-1/5, standing-11/18). This reel: standing-6
  // (the "balancing on the peak" role, gold coat) and standing-14 (CTA,
  // red coat — matching this mockup's approved poses).
  const humanGenius = await humaaansFull('standing', 'standing-6', { coatColor: '#ffcf40', pantColor: '#1a1414' });
  const humanCta = await humaaansFull('standing', 'standing-14', { coatColor: '#ff3b3b', pantColor: '#1a1414', shirtColor: '#f7f0e6' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = { trophy, award, certificate, scaleIcon, code, alertTriangle, x, checks, circleCheck, cpu, brain, target };

  const html = buildHtml({ icons, humanGenius, humanCta, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function tornCard(label, body, id, variant) {
  return `<div class="torn-card${variant ? ' ' + variant : ''}" id="${id}">${label ? `<div class="torn-label">${label}</div>` : ''}<div class="torn-body">${body}</div></div>`;
}
function chip(icon, label, id, variant) {
  return `<div class="chip${variant ? ' ' + variant : ''}" id="${id}">${icon ? `<span class="chip-icon">${icon}</span>` : ''}<span>${label}</span></div>`;
}
function seismBridge(id) {
  return `<div class="seism-bridge"><svg class="seism-svg" viewBox="0 0 220 44" id="${id}svg"><polyline id="${id}line" points="0,22 220,22" fill="none" stroke-width="3"/></svg><div class="sb-readout"><span id="${id}readout"></span><span class="sb-cursor" id="${id}cursor">▌</span></div></div>`;
}

function buildHtml({ icons: I, humanGenius, humanCta, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-ai-jagged-frontier</title>
<style>
@font-face{font-family:'Fraunces';font-weight:900;src:url('../assets/fonts/fraunces/fraunces-latin-900-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Fraunces';font-weight:900;font-style:italic;src:url('../assets/fonts/fraunces/fraunces-latin-900-italic.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:500;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #120d0d;
  --bg-2: #0a0707;
  --gold: #ffcf40;
  --red: #ff3b3b;
  --ink: #f7f0e6;
  --ink-dim: #c9b6a8;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* ---- background: graph-paper grid + animated jagged skyline (gold peak
   line above, red valley line below) — this reel's texture, literal to
   the "jagged" concept, distinct from every prior dot/hex/hatch/scan grid. */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 20% 15%, rgba(255,207,64,0.10), transparent 60%),
  radial-gradient(ellipse 900px 900px at 85% 80%, rgba(255,59,59,0.10), transparent 60%),
  var(--bg);}
.bg-grid{position:absolute;inset:-60px;opacity:0.14;
  background-image: linear-gradient(rgba(247,240,230,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,240,230,0.5) 1px, transparent 1px);
  background-size: 54px 54px;}
.jagged-svg{position:absolute;inset:0;opacity:0.55;}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.6) 100%);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:2;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.14em;color:var(--gold);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.eyebrow.red{color:var(--red);}
.headline{font-family:'Fraunces',serif;font-weight:900;font-size:80px;line-height:1.12;letter-spacing:-0.01em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.65);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.headline .hi-gold{color:var(--gold);}
.headline .hi-red{color:var(--red);}
.headline.italic{font-style:italic;}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:44px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:27px;letter-spacing:0.06em;color:var(--ink-dim);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

/* Seism bridge: this reel's signal-bridge equivalent — a small jagged
   EKG/seismograph line feeding a typewriter readout, then a blinking
   cursor. Fills the header-band -> content-band gap. */
.seism-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:10px;z-index:1;position:relative;padding:12px 0;}
.seism-svg{width:220px;height:44px;}
.sb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#f0e3d0;letter-spacing:0.01em;min-height:36px;}
.sb-cursor{color:var(--gold);font-weight:700;margin-left:3px;}

/* Torn-edge "receipt" card — this reel's card/chip language: a zigzag
   torn bottom edge via clip-path, distinct from rounded-rect,
   clip-corner-angular, and hexagonal-notch cards used in prior reels. */
.torn-card{position:relative;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,207,64,0.35);border-bottom:none;padding:36px 48px 62px;margin:12px 0;width:100%;max-width:780px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:10px;
  clip-path:polygon(0% 0%,100% 0%,100% 90%,94% 100%,88% 90%,82% 100%,76% 90%,70% 100%,64% 90%,58% 100%,52% 90%,46% 100%,40% 90%,34% 100%,28% 90%,22% 100%,16% 90%,10% 100%,4% 90%,0% 100%);
  will-change:transform,opacity;}
.torn-card.red{border-color:rgba(255,59,59,0.4);}
.torn-label{font-family:'JBMono',monospace;font-weight:700;font-size:25px;letter-spacing:0.06em;color:var(--gold);text-transform:uppercase;}
.torn-card.red .torn-label{color:var(--red);}
.torn-body{font-family:'Inter',sans-serif;font-weight:600;font-size:34px;color:var(--ink);margin-top:6px;line-height:1.35;text-align:center;}

.chip{display:inline-flex;align-items:center;gap:14px;font-family:'JBMono',monospace;font-weight:700;font-size:26px;color:var(--ink);border:1.5px solid rgba(255,207,64,0.45);background:rgba(255,207,64,0.08);padding:16px 30px 22px;
  clip-path:polygon(0 0,100% 0,100% 76%,90% 100%,80% 76%,70% 100%,60% 76%,50% 100%,40% 76%,30% 100%,20% 76%,10% 100%,0 76%,0 100%);
  will-change:transform,opacity;}
.chip.red{border-color:rgba(255,59,59,0.5);background:rgba(255,59,59,0.08);color:var(--red);}
.chip-icon{width:30px;height:30px;flex:0 0 30px;}
.chip-icon svg{width:100%;height:100%;}
.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;z-index:1;}

.icon-badge{width:100%;height:100%;color:var(--gold);will-change:transform,opacity;}
.icon-badge svg{width:100%;height:100%;}
.icon-badge.red{color:var(--red);}

.human-wrap{width:300px;height:378px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));will-change:transform,opacity;}
.human-wrap svg{width:100%;height:100%;}

.stat-big{font-family:'Fraunces',serif;font-weight:900;font-size:230px;line-height:1;letter-spacing:-0.02em;color:var(--gold);text-shadow:0 8px 30px rgba(0,0,0,.6);will-change:transform,opacity;}
.stat-big.red{color:var(--red);}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.06em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;text-align:center;will-change:transform,opacity;}

.cta-card{padding:50px 56px 66px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,207,64,0.35);border-bottom:none;position:relative;
  clip-path:polygon(0% 0%,100% 0%,100% 90%,94% 100%,88% 90%,82% 100%,76% 90%,70% 100%,64% 90%,58% 100%,52% 90%,46% 100%,40% 90%,34% 100%,28% 90%,22% 100%,16% 90%,10% 100%,4% 90%,0% 100%);}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);box-shadow:0 0 28px rgba(255,207,64,0.5);}
.cta-main{font-family:'Fraunces',serif;color:var(--ink);font-size:48px;font-weight:900;letter-spacing:-0.01em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--gold);font-size:24px;font-weight:500;letter-spacing:0.02em;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(255,207,64,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--gold);width:0%;box-shadow:0 0 10px rgba(255,207,64,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="bg-wash"></div>
  <div class="bg-grid"></div>
  <svg class="jagged-svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="jagGoldPat" width="240" height="1920" patternUnits="userSpaceOnUse">
        <polyline points="0,900 30,860 60,920 90,780 120,860 150,700 180,820 210,640 240,760"
          fill="none" stroke="#ffcf40" stroke-width="3"/>
      </pattern>
      <pattern id="jagRedPat" width="240" height="1920" patternUnits="userSpaceOnUse">
        <polyline points="0,1200 30,1240 60,1180 90,1280 120,1200 150,1320 180,1220 210,1340 240,1240"
          fill="none" stroke="#ff3b3b" stroke-width="3"/>
      </pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#jagGoldPat)" opacity="0.55"/>
    <rect width="1080" height="1920" fill="url(#jagRedPat)" opacity="0.45"/>
  </svg>
  <div class="vignette"></div>
</div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band-content">
      <div class="eyebrow" id="s1eyebrow">// THE JAGGED FRONTIER</div>
      <div class="icon-badge" id="s1icon" style="width:150px;height:150px;">${I.trophy}</div>
      <div class="headline" id="s1head">AI just won <span class="hi-gold">gold</span> at the International Math Olympiad.</div>
      <div class="sub" id="s1sub">...and still can't count the letters in <span class="hi-red">"strawberry."</span></div>
    </div>
  </div>

  <!-- SCENE 2: THE FLEX 0:05-0:10 -->
  <div class="scene" id="sc2">
    <div class="band-content">
      <div class="eyebrow" id="s2eyebrow">// THE FLEX</div>
      <div class="headline" id="s2head" style="font-size:64px;">It's acing <span class="hi-gold">everything</span> we throw at it.</div>
      <div class="chip-row">
        ${chip(I.award, 'IMO GOLD MEDAL', 's2chip1')}
        ${chip(I.scaleIcon, 'BAR EXAM TOP 10%', 's2chip2')}
        ${chip(I.code, 'GOLD-MEDAL CODING', 's2chip3')}
      </div>
      ${tornCard('The record', 'State-of-the-art on nearly every hard benchmark we have.', 's2card')}
    </div>
  </div>

  <!-- SCENE 3: THE RECORD SCRATCH 0:10-0:17 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      <div class="eyebrow red" id="s3eyebrow">// SAME MODEL, FIVE MINUTES LATER</div>
      <div class="headline italic" id="s3head" style="font-size:66px;">"9.11 is <span class="hi-red">bigger</span> than 9.9."</div>
    </div>
    ${seismBridge('s3')}
    <div class="band-content">
      ${tornCard('', `"There are <b style="color:var(--red)">two</b> r's in strawberry."`, 's3card', 'red')}
      <div class="mono-label" id="s3label">— THE SAME MODEL THAT SOLVED THE OLYMPIAD</div>
    </div>
  </div>

  <!-- SCENE 4: THE QUESTION 0:17-0:24 -->
  <div class="scene" id="sc4">
    <div class="band-content">
      <div class="icon-badge" id="s4icon" style="width:130px;height:130px;">${I.brain}</div>
      <div class="headline" id="s4head" style="font-size:72px;">How can something this smart... be <span class="hi-red">this dumb?</span></div>
    </div>
  </div>

  <!-- SCENE 5: THE REAL ANSWER 0:24-0:31 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      <div class="eyebrow" id="s5eyebrow">// THE REAL ANSWER</div>
      <div class="headline" id="s5head" style="font-size:62px;">It doesn't see letters. <span class="hi-gold">It sees tokens.</span></div>
    </div>
    ${seismBridge('s5')}
    <div class="band-content">
      ${tornCard('What the model actually reads', '"strawberry" → <span class="hi-gold">straw</span> + <span class="hi-red">berry</span> — two chunks, not seven letters.', 's5card')}
      <div class="sub" id="s5sub" style="font-size:36px;">It's reasoning over word-shapes, not spelling things out like we do.</div>
    </div>
  </div>

  <!-- SCENE 6: THE NAME FOR IT 0:31-0:38 -->
  <div class="scene" id="sc6">
    <div class="band-content">
      <div class="eyebrow" id="s6eyebrow">// THE NAME FOR IT</div>
      <div class="human-wrap" id="s6human" style="width:300px;height:378px;">${humanGenius}</div>
      <div class="headline" id="s6head" style="font-size:76px;"><span class="hi-gold">Jagged</span> Intelligence.</div>
      <div class="sub" id="s6sub">Superhuman peaks and childlike gaps — right next to each other.</div>
    </div>
  </div>

  <!-- SCENE 7: WHY IT MATTERS 0:38-0:45 -->
  <div class="scene" id="sc7">
    <div class="band-content">
      <div class="eyebrow red" id="s7eyebrow">// WHY IT MATTERS</div>
      <div class="icon-badge red" id="s7icon" style="width:110px;height:110px;">${I.alertTriangle}</div>
      ${tornCard('', `Confidently wrong <span class="hi-red">doesn't look wrong.</span>`, 's7card', 'red')}
      <div class="sub" id="s7sub" style="font-size:38px;">The failures sound just as fluent and certain as the successes.</div>
    </div>
  </div>

  <!-- SCENE 8: THE HUMAN COST 0:45-0:51 -->
  <div class="scene" id="sc8">
    <div class="band-content" style="gap:16px;">
      <div class="eyebrow" id="s8eyebrow">// THE HUMAN COST</div>
      <div class="stat-big" id="s8stat">2<span style="font-size:0.4em;">/</span>3</div>
      <div class="stat-label" id="s8statlabel">of people take AI's confident answer at face value</div>
      <div class="sub" id="s8sub" style="margin-top:6px;">Without checking it once.</div>
    </div>
  </div>

  <!-- SCENE 9: THE TAKEAWAY 0:51-0:55 -->
  <div class="scene" id="sc9">
    <div class="band-content">
      <div class="eyebrow" id="s9eyebrow">// THE TAKEAWAY</div>
      <div class="headline" id="s9head" style="font-size:70px;">Trust the <span class="hi-gold">peaks.</span> Verify the <span class="hi-red">valleys.</span></div>
      <div class="chip-row">
        ${chip(I.circleCheck, 'TRUST THE PEAKS', 's9chip1')}
        ${chip(I.alertTriangle, 'VERIFY THE VALLEYS', 's9chip2', 'red')}
      </div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="human-wrap" id="s10human" style="width:260px;height:328px;margin:20px auto 0;">${humanCta}</div>
    </div>
    ${seismBridge('s10')}
    <div class="band-content">
      <div class="cta-card" id="s10card">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="">
        <div class="cta-main">@sandesh.explains</div>
        <div class="cta-sub">AI NEWS THAT ACTUALLY CHANGES HOW YOU BUILD</div>
      </div>
    </div>
  </div>

</div>

<div class="progress"><div class="progress-fill" id="progress"></div></div>

<script src="../assets/animations/gsap/gsap.min.js"></script>
<script>
function $(id){ return document.getElementById(id); }
function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }
function eoc(x){ x = clamp(x,0,1); return 1 - Math.pow(1-x,3); }

function enter(el, e, driftY, extraScale){
  if(!el) return;
  var ee = clamp(e,0,1);
  el.style.opacity = 0.25 + 0.75*ee;
  el.style.transform = 'translateY(' + (driftY*(1-ee)) + 'px) scale(' + ((0.92+0.08*ee) * (extraScale||1)) + ')';
}

var __entranceTl = new WeakMap();
function scrubTl(el, cacheKey, buildTl, e){
  if(!el || typeof gsap === 'undefined') return;
  var cached = __entranceTl.get(el);
  if(!cached || cached.key !== cacheKey){
    cached = { key: cacheKey, tl: buildTl() };
    __entranceTl.set(el, cached);
  }
  cached.tl.progress(clamp(e,0,1));
}
function dropIn(el, e, dropHeight, rotateDeg){
  scrubTl(el, 'drop:' + dropHeight + ':' + rotateDeg, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/3, ease: 'none' }, 0);
    tl.fromTo(el, { y: dropHeight || 0, rotation: rotateDeg || 0 },
                   { y: 0, rotation: 0, duration: 1, ease: 'bounce.out' }, 0);
    return tl;
  }, e);
}
function tumbleIn(el, e, rotateFromDeg){
  scrubTl(el, 'tumble:' + rotateFromDeg, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/2.4, ease: 'none' }, 0);
    tl.fromTo(el, { rotation: rotateFromDeg || 90, scale: 0.55 },
                   { rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }, 0);
    return tl;
  }, e);
}
function runIn(el, e, fromX){
  scrubTl(el, 'run:' + fromX, function(){
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1/2.6, ease: 'none' }, 0);
    tl.fromTo(el, { x: fromX || 0, rotation: -7 },
                   { x: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 0);
    return tl;
  }, e);
}

// Seism bridge: a jagged EKG-line draw-on (stroke-dashoffset, t-driven) +
// terminal-style typewriter reveal of a scene-specific line, then a
// blinking cursor. Fills the header-band -> content-band gap.
function seismBridge(lineEl, readoutEl, cursorEl, text, e, sceneT, colorVar){
  if(!lineEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  var drawE = clamp(ee/0.4, 0, 1);
  var len = lineEl.getTotalLength ? lineEl.getTotalLength() : 220;
  lineEl.style.strokeDasharray = len;
  lineEl.style.strokeDashoffset = len * (1 - drawE);
  lineEl.style.stroke = colorVar || '#ffcf40';
  var typeE = clamp((ee-0.15)/0.6,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = '> ' + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

var SEISM_POINTS = '0,22 26,22 36,4 46,40 56,22 86,22 96,10 106,34 116,22 140,22 150,8 160,36 170,22 220,22';
[3,5,10].forEach(function(n){
  var el = $('s' + n + 'svg');
  if (el) el.querySelector('polyline').setAttribute('points', SEISM_POINTS);
});

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      enter($('s1eyebrow'), eoc(t/0.35), 14, 1);
      dropIn($('s1icon'), t/0.5, -160, -6);
      enter($('s1head'), eoc((t-0.45)/0.55), 22, 1);
      enter($('s1sub'), eoc((t-1.15)/0.45), 18, 1);
  }},
  { start: 5, duration: 5, el: $('sc2'), render: function(t){
      enter($('s2eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s2head'), eoc((t-0.15)/0.5), 20, 1);
      dropIn($('s2chip1'), (t-0.75)/0.35, -100, -4);
      dropIn($('s2chip2'), (t-0.95)/0.35, -100, 0);
      dropIn($('s2chip3'), (t-1.15)/0.35, -100, 4);
      dropIn($('s2card'), (t-1.6)/0.4, -140, 0);
  }},
  { start: 10, duration: 7, el: $('sc3'), render: function(t){
      enter($('s3eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s3head'), (t-0.2)/0.5, -14);
      seismBridge($('s3line'), $('s3readout'), $('s3cursor'), 'comparing 9.11 and 9.9...', (t-0.7)/1.0, t, '#ff3b3b');
      dropIn($('s3card'), (t-1.5)/0.45, -140, 0);
      enter($('s3label'), eoc((t-2.1)/0.35), 14, 1);
  }},
  { start: 17, duration: 7, el: $('sc4'), render: function(t){
      dropIn($('s4icon'), t/0.5, -180, -8);
      enter($('s4head'), eoc((t-0.5)/0.6), 24, 1);
  }},
  { start: 24, duration: 7, el: $('sc5'), render: function(t){
      enter($('s5eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      seismBridge($('s5line'), $('s5readout'), $('s5cursor'), 'tokenizing input...', (t-0.5)/1.0, t, '#ffcf40');
      dropIn($('s5card'), (t-1.5)/0.45, -140, 0);
      enter($('s5sub'), eoc((t-2.1)/0.4), 16, 1);
  }},
  { start: 31, duration: 7, el: $('sc6'), render: function(t){
      enter($('s6eyebrow'), eoc(t/0.3), 12, 1);
      runIn($('s6human'), (t-0.3)/0.55, -180);
      tumbleIn($('s6head'), (t-1.0)/0.5, -20);
      enter($('s6sub'), eoc((t-1.6)/0.45), 16, 1);
  }},
  { start: 38, duration: 7, el: $('sc7'), render: function(t){
      enter($('s7eyebrow'), eoc(t/0.3), 12, 1);
      dropIn($('s7icon'), (t-0.3)/0.5, -160, -6);
      dropIn($('s7card'), (t-1.0)/0.45, -140, 0);
      enter($('s7sub'), eoc((t-1.7)/0.4), 16, 1);
  }},
  { start: 45, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s8stat'), (t-0.3)/0.5, -20);
      enter($('s8statlabel'), eoc((t-0.9)/0.4), 14, 1);
      enter($('s8sub'), eoc((t-1.25)/0.4), 16, 1);
  }},
  { start: 51, duration: 4, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.25), 12, 1);
      tumbleIn($('s9head'), (t-0.25)/0.45, -14);
      dropIn($('s9chip1'), (t-0.9)/0.35, -100, -4);
      dropIn($('s9chip2'), (t-1.1)/0.35, -100, 4);
  }},
  { start: 55, duration: 5, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.5, -180);
      seismBridge($('s10line'), $('s10readout'), $('s10cursor'), 'queuing @sandesh.explains...', (t-0.15)/1.0, t, '#ffcf40');
      dropIn($('s10card'), (t-0.3)/0.5, -150, 0);
  }}
];

window.__reelDurationSec = 60.0;
var marker = $('marker');
var started = false;

var TRANS = 0.32;
window.__seek = function(t){
  if (!started) { marker.style.display='none'; started = true; }
  SCENES.forEach(function(scene, i){
    var raw = t - scene.start;
    var visible = raw >= -TRANS && raw < scene.duration;
    if (!visible) { scene.el.style.display = 'none'; return; }
    scene.el.style.display = 'flex';
    var op = 1, ty = 0;
    var isLast = i === SCENES.length - 1;
    if (raw < 0) {
      var ein = eoc((raw + TRANS) / TRANS);
      op = ein; ty = (1 - ein) * 22;
    } else if (!isLast && raw > scene.duration - TRANS) {
      var eout = eoc((scene.duration - raw) / TRANS);
      op = eout; ty = (1 - eout) * -22;
    }
    scene.el.style.opacity = op;
    scene.el.style.transform = 'translateY(' + ty + 'px)';
    scene.render(clamp(raw, 0, scene.duration));
  });
  $('progress').style.width = (100*clamp(t/window.__reelDurationSec,0,1)) + '%';

  // Jagged skyline background scroll: seamless via a 240px-period tiled
  // SVG pattern, shifted left by t (deterministic, no drift) using
  // patternTransform — never a real-time CSS animation.
  var shift = -((t * 26) % 240);
  $('jagGoldPat').setAttribute('patternTransform', 'translate(' + shift + ',0)');
  $('jagRedPat').setAttribute('patternTransform', 'translate(' + (shift - 40) + ',0)');
};

window.__autoplay = function(){
  var startTime = performance.now();
  function frame(){
    var t = (performance.now() - startTime) / 1000;
    if (t > window.__reelDurationSec) t = 0, startTime = performance.now();
    window.__seek(t);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
if (window.location.search.includes('autoplay')) window.__autoplay();
else window.__seek(0);
</script>
</body>
</html>`;
}

main();
