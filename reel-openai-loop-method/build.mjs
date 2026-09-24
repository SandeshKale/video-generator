#!/usr/bin/env node
// Assembles reel.html for "The Loop Method — Get Better Results From ChatGPT"
// from real files in assets/ and reel-app/src/humaaans/ — no hand-copied SVG.
//
// Visual system: "Terminal / Signal" — cyan/magenta duotone on near-black,
// monospace bracket-tags, angular clip-corner panels, a radar-tick loop
// counter, and a scanline/grid background. Deliberately distinct from
// reel-anthropic-rundown-ios's navy dot-grid/streamline look — see the
// mockup.mjs preview this was approved from, and CLAUDE.md's note that
// every reel needs its own color scheme/theme/component language, not a
// reskin of the last one.
//
// Still applies the house rules that AREN'T about visual identity:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn)
//   - Hard safe-zone exclusion: nothing in top ~150px, bottom ~400px, right ~190px
//   - Real vendored fonts (Poppins/Inter/JetBrains Mono), off-white text,
//     soft shadow/glow for legibility over the moving background
//   - band-content merge (visual + sub grouped, not split into separate
//     empty-feeling flex islands) to avoid dead space
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
async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g>([\s\S]*)<\/g>\s*<\/svg>/);
  const viewBox = inner[1];
  const body = inner[2].replace(/ fill="#000000"/g, '');
  return `<svg viewBox="${viewBox}" fill="currentColor">${body}</svg>`;
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

// ---- react-humaaans full pre-composed poses -> static SVG ----
// 24 different standing poses (assets/illustrations/humaaans-react/), vs.
// the single Short+PointingUp+SkinnyJeans figure reused everywhere before.
// Resolves each file's color props (defaultProps, or an override) and the
// couple of darken(color) calls into literal hex values.
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
  if (defBlockMatch) {
    for (const m of defBlockMatch[1].matchAll(/(\w+):\s*'([^']*)'/g)) defaults[m[1]] = m[2];
  }
  const colors = { ...defaults, ...overrides };

  const svgMatch = src.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  let body = svgMatch[1];
  body = body.replace(/\{darken\((\w+)\)\}/g, (_, key) => darkenHex(colors[key], 0.1));
  body = body.replace(/\{(\w+)\}/g, (_, key) => (key in colors ? colors[key] : '#000000'));
  return `<svg viewBox="0 0 380 480">${body}</svg>`;
}

async function main() {
  const [
    pencil, photo, target, search, school, circleCheck, alertCircle,
    settings, refresh, repeat, arrowRight, bulb, rocket, sparkles, users,
  ] = await Promise.all([
    'pencil', 'photo', 'target', 'search', 'school', 'circle-check', 'alert-circle',
    'settings', 'refresh', 'repeat', 'arrow-right', 'bulb', 'rocket', 'sparkles', 'users',
  ].map(tablerIcon));

  const bookmark = await featherIcon('bookmark');
  const scissors = await featherIcon('scissors');
  const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');

  // Two different pre-composed humaaans poses (assets/illustrations/humaaans-react/)
  // instead of reusing one single figure twice in the same reel.
  const humanHook = await humaaansFull('standing', 'standing-9');
  const humanCta = await humaaansFull('standing', 'standing-16', { coatColor: '#0e7c86', pantColor: '#123b40' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = {
    pencil, photo, scissors, target, search, school, circleCheck, alertCircle,
    settings, refresh, repeat, arrowRight, bulb, rocket, sparkles, bookmark, users,
  };

  const html = buildHtml({ icons, openai, humanHook, humanCta, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function tag(icon, label, id, variant) {
  return `<div class="tag${variant ? ' ' + variant : ''}" id="${id}"><span class="tag-icon">${icon}</span><span>${label}</span></div>`;
}

// Step progress indicator (STEP N / total + a dot row) — server-rendered
// (no runtime JS needed, the dot fill state is fixed per scene) since it
// doesn't change over the course of a single scene's playback.
function stepHead(current, total, id) {
  let dots = '';
  for (let i = 1; i <= total; i++) dots += `<span class="step-dot${i <= current ? ' done' : ''}"></span>`;
  return `<div class="step-head" id="${id}"><div class="mono-label" style="font-size:24px;">STEP ${current} / ${total}</div><div class="step-dots">${dots}</div></div>`;
}

function buildHtml({ icons: I, openai, humanHook, humanCta, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-openai-loop-method</title>
<style>
@font-face{font-family:'Inter';font-weight:500;font-style:normal;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;font-style:normal;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;font-style:normal;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;font-style:normal;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;font-style:normal;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'SpaceGrotesk';font-weight:600;font-style:normal;src:url('../assets/fonts/space-grotesk/space-grotesk-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'SpaceGrotesk';font-weight:700;font-style:normal;src:url('../assets/fonts/space-grotesk/space-grotesk-latin-700-normal.woff2') format('woff2');font-display:block;}

html,body{margin:0;padding:0;width:1080px;height:1920px;background:#050607;overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* Background: sparse cyan graph-grid + a soft cyan/magenta glow pair that
   drift slowly + a horizontal scanline sweep. Replaces the dot-grid/hatch
   texture from the other reel entirely — different pattern language, same
   rule (low-opacity, t-driven, never fights foreground). */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.grid-lines{position:absolute;inset:-4px;background-image:
  repeating-linear-gradient(0deg, rgba(0,229,255,0.10) 0px, rgba(0,229,255,0.10) 1px, transparent 1px, transparent 90px),
  repeating-linear-gradient(90deg, rgba(0,229,255,0.10) 0px, rgba(0,229,255,0.10) 1px, transparent 1px, transparent 90px);}
/* Per-scene "spotlight" — a stronger, tighter glow placed directly behind
   a scene's hero element, layered on top of the frame-wide glow-cyan/
   glow-magenta pair. This is what actually reads as "density" in the
   middle of the frame instead of empty dark space around a small icon. */
.spotlight{position:absolute;top:50%;left:50%;border-radius:50%;background:radial-gradient(circle, rgba(0,229,255,0.22), rgba(0,229,255,0.06) 55%, transparent 75%);pointer-events:none;z-index:0;}
.spotlight.magenta{background:radial-gradient(circle, rgba(255,47,166,0.20), rgba(255,47,166,0.05) 55%, transparent 75%);}
.glow-cyan{position:absolute;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle, rgba(0,229,255,0.15), transparent 68%);}
.glow-magenta{position:absolute;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle, rgba(255,47,166,0.12), transparent 68%);}
.scanline{position:absolute;left:0;right:0;height:240px;background:linear-gradient(180deg, transparent, rgba(0,229,255,0.09), transparent);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 45%, rgba(0,0,0,0.55) 100%);}

/* Vertical data-readout gutters (monospace, vertical writing-mode),
   replacing the old glowing-dot streamlines — a ticker instead of dots. */
.readout{position:absolute;top:150px;bottom:400px;width:34px;overflow:hidden;z-index:0;}
.readout.left{left:56px;}
.readout.right{right:212px;}
.readout-inner{font-family:'JBMono';font-weight:500;font-size:20px;letter-spacing:0.14em;line-height:2.3;writing-mode:vertical-rl;color:rgba(0,229,255,0.4);white-space:pre;}
.readout.right .readout-inner{color:rgba(255,47,166,0.4);}

/* Hard safe-zone box — same rule as every reel in this repo: nothing here
   renders in top 150px, right 190px, bottom 400px (phone status bar +
   Instagram's own UI chrome cover those regions on real playback). */
.safe{position:absolute;top:150px;left:0;right:190px;bottom:400px;z-index:1;}
/* display/opacity/transform on .scene are driven directly by JS (crossfade
   transitions between scenes need two scenes visible at once briefly, which
   a single .active class toggle can't express) — no .scene.active rule. */
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;}

.step-head{display:flex;flex-direction:column;align-items:center;gap:14px;will-change:transform,opacity;}
.step-dots{display:flex;gap:11px;}
.step-dot{width:11px;height:11px;border-radius:50%;background:rgba(0,229,255,0.18);border:1px solid rgba(0,229,255,0.3);}
.step-dot.done{background:#0ff1e0;border-color:#0ff1e0;box-shadow:0 0 10px rgba(0,229,255,0.65);}

/* Signal bridge: fills the gap between a scene's headline and its main
   content block with a real, content-aware component instead of empty
   space — a vertical "data wire" with a traveling pulse, feeding into a
   live-typing terminal readout line specific to that scene (e.g. "spinning
   up 3 reviewer roles..."). Replaces an earlier single-glyph caret there,
   which read as decorative rather than substantial. */
.signal-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:14px;z-index:1;position:relative;padding:6px 0;}
.sig-wire{position:relative;width:2px;height:64px;background:linear-gradient(180deg, rgba(0,229,255,0.12), rgba(0,229,255,0.6), rgba(0,229,255,0.12));}
.sig-pulse{position:absolute;left:50%;top:0;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;background:#0ff1e0;box-shadow:0 0 18px 5px rgba(0,229,255,0.65);opacity:0;}
.sig-readout{font-family:'JBMono',monospace;font-weight:500;font-size:29px;color:#5fd8e8;letter-spacing:0.01em;min-height:38px;}
.sig-cursor{color:#0ff1e0;font-weight:700;margin-left:3px;}
/* Merged band: a scene's visual + its sub-line grouped as one unit in the
   middle of the frame, instead of two separately-centered islands with a
   dead gap between them. */
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:42px;position:relative;}

/* Typography: Space Grotesk (display — more character/personality than a
   plain geometric sans, per "fonts could be more fun" feedback) + Inter
   (body) + JetBrains Mono (readouts, tags, eyebrow labels) — off-white
   with a soft shadow/glow so text holds up over the moving scanline/grid
   texture. */
.headline{font-family:'SpaceGrotesk',sans-serif;color:#eef8fb;font-size:80px;font-weight:700;text-align:center;line-height:1.12;letter-spacing:-0.02em;width:100%;text-shadow:0 4px 14px rgba(0,0,0,.6), 0 0 26px rgba(0,229,255,0.12);will-change:transform,opacity;z-index:1;}
.headline .acc{color:#0ff1e0;text-decoration:underline wavy rgba(0,229,255,0.55);text-underline-offset:10px;text-decoration-thickness:2.5px;}
/* Gradient-text hero moment. IMPORTANT: text-shadow is inherited from
   .headline, and a dark shadow behind a transparent-fill gradient clip
   reads as a solid dark silhouette instead of the gradient — this bit the
   first build of this reel. Explicitly clear it here. */
.headline .grad{background:linear-gradient(180deg,#eef8fb,#0ff1e0);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;text-shadow:none;filter:drop-shadow(0 0 18px rgba(0,229,255,0.35));}
.sub{font-family:'Inter',sans-serif;color:#94b3bd;font-size:42px;font-weight:600;text-align:center;line-height:1.4;width:100%;text-shadow:0 3px 10px rgba(0,0,0,.45);will-change:transform,opacity;z-index:1;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:29px;letter-spacing:0.14em;color:#5fd8e8;text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

.tag-row{display:flex;gap:16px;justify-content:center;flex-wrap:nowrap;width:100%;z-index:1;}
.tag-col{display:flex;flex-direction:column;align-items:center;gap:18px;z-index:1;}
.tag{font-family:'JBMono',monospace;display:flex;align-items:center;gap:16px;font-weight:700;font-size:31px;letter-spacing:0.04em;color:#5fd8e8;border:1.5px solid rgba(0,229,255,0.5);padding:24px 30px;background:rgba(0,229,255,0.06);will-change:transform,opacity;}
.tag-icon{width:36px;height:36px;flex:0 0 36px;color:#0ff1e0;}
.tag-icon svg{width:100%;height:100%;}
.tag.magenta{color:#ff8ed4;border-color:rgba(255,47,166,0.5);background:rgba(255,47,166,0.06);}
.tag.magenta .tag-icon{color:#ff6fc4;}
.tag.active{background:rgba(0,229,255,0.16);box-shadow:0 0 26px rgba(0,229,255,0.3);}

.icon-badge{width:100%;height:100%;color:#eef8fb;}
.icon-badge svg{width:100%;height:100%;}

/* Angular clip-corner panel — the "component language" replacement for
   the other reel's rounded-rect cards. */
.panel{position:relative;background:rgba(10,16,20,0.74);border:1px solid rgba(0,229,255,0.32);clip-path:polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px));box-shadow:inset 0 0 44px rgba(0,229,255,0.06);will-change:transform,opacity;}
.panel::before{content:'';position:absolute;top:0;left:0;width:26px;height:26px;border-top:2px solid #0ff1e0;border-left:2px solid #0ff1e0;}
.panel::after{content:'';position:absolute;bottom:0;right:0;width:26px;height:26px;border-bottom:2px solid #ff6fc4;border-right:2px solid #ff6fc4;}

.stack{display:flex;flex-direction:column;align-items:center;gap:6px;}
.stack-label{font-family:'Inter',sans-serif;color:#eef8fb;font-size:29px;font-weight:700;margin-top:14px;}
.stack-sub{font-family:'JBMono',monospace;color:#5fd8e8;font-size:20px;font-weight:500;letter-spacing:0.04em;}

.check-row{font-family:'Inter',sans-serif;display:flex;align-items:center;gap:16px;color:#eef8fb;font-size:32px;font-weight:600;}
.check-row .tag-icon{color:#0ff1e0;}

.ring-wrap{position:relative;width:480px;height:480px;will-change:transform,opacity;}
.ring-num{font-family:'SpaceGrotesk',sans-serif;font-weight:700;font-size:172px;color:#eef8fb;text-shadow:0 0 40px rgba(0,229,255,0.5);}

.tip-panel{width:100%;padding:56px 46px;box-sizing:border-box;display:flex;align-items:center;gap:30px;will-change:transform,opacity;}
.tip-panel .tag-icon{width:80px;height:80px;flex:0 0 80px;color:#ff8ed4;}
.tip-panel span{font-family:'Inter',sans-serif;color:#ffe1f2;font-size:40px;font-weight:700;line-height:1.32;}

.cta-panel{padding:46px 60px;display:flex;flex-direction:column;align-items:center;gap:22px;will-change:transform,opacity;}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid #0ff1e0;box-shadow:0 0 30px rgba(0,229,255,0.45);}
.cta-main{font-family:'SpaceGrotesk',sans-serif;color:#eef8fb;font-size:56px;font-weight:700;letter-spacing:-0.02em;}
.cta-sub{font-family:'JBMono',monospace;color:#5fd8e8;font-size:28px;font-weight:500;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(0,229,255,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:#0ff1e0;width:0%;box-shadow:0 0 10px rgba(0,229,255,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="grid-lines" id="gridlines"></div>
  <div class="glow-cyan" id="glowcyan"></div>
  <div class="glow-magenta" id="glowmagenta"></div>
  <div class="scanline" id="scanline"></div>
  <div class="vignette"></div>
</div>
<div class="readout left"><div class="readout-inner" id="reoL">01001100 01001111 01001111 01010000 01001100 01001111 01001111 01010000 01001100 01001111 01001111 01010000</div></div>
<div class="readout right"><div class="readout-inner" id="reoR">ITERATE · REFINE · VERIFY · ITERATE · REFINE · VERIFY · ITERATE · REFINE · VERIFY</div></div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="band-content">
      <div class="spotlight" id="s1spot" style="width:880px;height:880px;margin:-440px 0 0 -440px;"></div>
      <div style="width:100%;display:flex;align-items:center;justify-content:center;position:relative;gap:36px;">
        <div class="icon-badge" id="s1human" style="width:380px;height:481px;">${humanHook}</div>
        <div class="panel" id="s1panel" style="padding:30px 34px;display:flex;flex-direction:column;gap:20px;">
          ${tag(I.pencil, 'WRITING', 's1c0')}
          ${tag(I.scissors, 'EDITING', 's1c1', 'magenta')}
          ${tag(I.photo, 'IMAGES', 's1c2')}
        </div>
      </div>
      <div class="mono-label" id="s1status" style="font-size:29px;">// STATUS: QUALITY DRIFT DETECTED</div>
      <div class="headline" id="s1head" style="font-size:78px;">My ChatGPT workflow works... but the <span class="acc">quality keeps drifting</span>.</div>
    </div>
  </div>

  <!-- SCENE 2: REVEAL 0:05-0:09 -->
  <div class="scene" id="sc2">
    <div class="band-content">
      <div class="spotlight" id="s2spot" style="width:780px;height:780px;margin:-390px 0 0 -390px;"></div>
      <div class="spotlight magenta" id="s2spot2" style="width:600px;height:600px;margin:-300px 0 0 -300px;opacity:0.5;"></div>
      <div class="icon-badge" id="s2visual" style="width:340px;height:418px;color:#eef8fb;">${openai}</div>
      <div class="headline" id="s2head">There's a fix: <span class="grad">The Loop Method.</span></div>
      <div class="sub" id="s2sub">3 loops. That's it.</div>
      <div class="tag-row">
        ${tag(I.sparkles, 'ONE PROMPT, REUSABLE FOREVER', 's2chip1')}
      </div>
    </div>
  </div>

  <!-- SCENE 3: STEP 1 0:09-0:15 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      ${stepHead(1, 5, 's3step')}
      <div class="headline" id="s3head" style="font-size:66px;">Step 1 — Pick a workflow that needs improvement.</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s3pulse"></div></div><div class="sig-readout"><span id="s3readout"></span><span class="sig-cursor" id="s3cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight" id="s3spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      <div class="tag-col">
        ${tag(I.pencil, 'WRITING', 's3c0')}
        ${tag(I.scissors, 'EDITING', 's3c1', 'magenta')}
        ${tag(I.photo, 'IMAGES', 's3c2', 'active')}
      </div>
      <div class="sub" id="s3sub" style="font-size:44px;">Something that works, but needs cleanup every time.</div>
    </div>
  </div>

  <!-- SCENE 4: STEP 2 0:15-0:22 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      ${stepHead(2, 5, 's4step')}
      <div class="headline" id="s4head" style="font-size:66px;">Step 2 — Build a 3-agent review panel.</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s4pulse"></div></div><div class="sig-readout"><span id="s4readout"></span><span class="sig-cursor" id="s4cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight" id="s4spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      <div class="tag-row" style="align-items:stretch;">
        <div class="stack panel" id="s4quality" style="padding:38px 14px;width:256px;">
          <div class="icon-badge" style="width:104px;height:104px;color:#0ff1e0;">${I.target}</div>
          <div class="stack-label" style="font-size:31px;">Quality</div>
          <div class="stack-sub" style="font-size:21px;">REVIEWER</div>
        </div>
        <div class="stack panel" id="s4prompt" style="padding:38px 14px;width:256px;">
          <div class="icon-badge" style="width:104px;height:104px;color:#5fd8e8;">${I.search}</div>
          <div class="stack-label" style="font-size:31px;">Prompt</div>
          <div class="stack-sub" style="font-size:21px;">REVIEWER</div>
        </div>
        <div class="stack panel" id="s4expert" style="padding:38px 14px;width:256px;">
          <div class="icon-badge" style="width:104px;height:104px;color:#ff8ed4;">${I.school}</div>
          <div class="stack-label" style="font-size:31px;">Subject</div>
          <div class="stack-sub" style="font-size:21px;">MATTER EXPERT</div>
        </div>
      </div>
      <div class="sub" id="s4sub2" style="font-size:42px;">Each one checks a different thing.</div>
    </div>
  </div>

  <!-- SCENE 5: STEP 3 0:22-0:28 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      ${stepHead(3, 5, 's5step')}
      <div class="headline" id="s5head" style="font-size:66px;">Step 3 — Define "done" before you start.</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s5pulse"></div></div><div class="sig-readout"><span id="s5readout"></span><span class="sig-cursor" id="s5cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight" id="s5spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      <div class="panel" id="s5card" style="width:100%;padding:56px 48px;box-sizing:border-box;display:flex;flex-direction:column;gap:36px;">
        <div class="check-row" id="s5c0" style="font-size:38px;"><span class="tag-icon" style="width:46px;height:46px;flex:0 0 46px;">${I.circleCheck}</span><span>Consistent dimensions</span></div>
        <div class="check-row" id="s5c1" style="font-size:38px;"><span class="tag-icon" style="width:46px;height:46px;flex:0 0 46px;">${I.circleCheck}</span><span>Shared visual style</span></div>
        <div class="check-row" id="s5c2" style="font-size:38px;"><span class="tag-icon" style="width:46px;height:46px;flex:0 0 46px;">${I.circleCheck}</span><span>Recognizable details</span></div>
      </div>
      <div class="sub" id="s5sub" style="font-size:42px;">3–5 checks the output must pass.</div>
    </div>
  </div>

  <!-- SCENE 6: STEP 4 (the loop) 0:28-0:38 -->
  <div class="scene" id="sc6">
    <div class="band band-tight">
      ${stepHead(4, 5, 's6step')}
      <div class="headline" id="s6head" style="font-size:66px;">Step 4 — Run exactly <span class="acc">3 loops</span>.</div>
    </div>
    <div class="band-content">
      <div class="spotlight" id="s6spot" style="width:820px;height:820px;margin:-410px 0 0 -410px;"></div>
      <div class="ring-wrap" id="s6loopwrap">
        <svg viewBox="0 0 200 200" style="width:100%;height:100%;position:absolute;">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(0,229,255,0.14)" stroke-width="2"/>
          <circle id="s6ringbg" cx="100" cy="100" r="80" fill="none" stroke="rgba(0,229,255,0.35)" stroke-width="10" stroke-dasharray="6 10" stroke-linecap="round"/>
          <circle id="s6ring" cx="100" cy="100" r="80" fill="none" stroke="#0ff1e0" stroke-width="10" stroke-linecap="round" transform="rotate(-90 100 100)"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
          <div class="ring-num" id="s6num">1</div>
        </div>
      </div>
      <div class="mono-label" id="s6loopword">LOOP 1 / 3</div>
      <div class="panel" id="s6card" style="width:100%;padding:32px 18px;box-sizing:border-box;">
        <div class="tag-row" style="align-items:center;justify-content:space-between;">
          <div class="icon-badge" id="s6i0" style="width:70px;height:70px;color:#ff6fc4;">${I.alertCircle}</div>
          <div class="icon-badge" id="s6a0" style="width:38px;height:38px;color:#5fd8e8;">${I.arrowRight}</div>
          <div class="icon-badge" id="s6i1" style="width:70px;height:70px;color:#eef8fb;">${I.settings}</div>
          <div class="icon-badge" id="s6a1" style="width:38px;height:38px;color:#5fd8e8;">${I.arrowRight}</div>
          <div class="icon-badge" id="s6i2" style="width:70px;height:70px;color:#5fd8e8;">${I.repeat}</div>
          <div class="icon-badge" id="s6a2" style="width:38px;height:38px;color:#5fd8e8;">${I.arrowRight}</div>
          <div class="icon-badge" id="s6i3" style="width:70px;height:70px;color:#0ff1e0;">${I.circleCheck}</div>
        </div>
      </div>
      <div class="sub" id="s6sub" style="font-size:40px;">Fix the workflow, not the output.</div>
    </div>
  </div>

  <!-- SCENE 7: STEP 5 0:38-0:44 -->
  <div class="scene" id="sc7">
    <div class="band band-tight">
      ${stepHead(5, 5, 's7step')}
      <div class="headline" id="s7head" style="font-size:66px;">Step 5 — Test on a brand-new example.</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s7pulse"></div></div><div class="sig-readout"><span id="s7readout"></span><span class="sig-cursor" id="s7cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight" id="s7spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      <div class="tag-row" style="align-items:center;">
        <div class="icon-badge" id="s7new" style="width:150px;height:150px;color:#5fd8e8;">${I.sparkles}</div>
        <div class="icon-badge" id="s7arrow" style="width:82px;height:82px;color:#5fd8e8;">${I.arrowRight}</div>
        <div class="icon-badge" id="s7check1" style="width:128px;height:128px;color:#0ff1e0;">${I.circleCheck}</div>
        <div class="icon-badge" id="s7check2" style="width:128px;height:128px;color:#0ff1e0;">${I.circleCheck}</div>
        <div class="icon-badge" id="s7check3" style="width:128px;height:128px;color:#0ff1e0;">${I.circleCheck}</div>
      </div>
      <div class="sub" id="s7sub" style="font-size:42px;">Same workflow, zero rebuilding.</div>
      <div class="tag-row">
        ${tag(I.circleCheck, 'PASSES EVERY CHECK, SHIP IT', 's7chip1')}
      </div>
    </div>
  </div>

  <!-- SCENE 8: PRO TIP 0:44-0:50 -->
  <div class="scene" id="sc8">
    <div class="band band-tight">
      <div class="mono-label" id="s8eyebrow" style="font-size:30px;">// PRO TIP</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s8pulse"></div></div><div class="sig-readout"><span id="s8readout"></span><span class="sig-cursor" id="s8cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight magenta" id="s8spot" style="width:880px;height:880px;margin:-440px 0 0 -440px;"></div>
      <div class="panel tip-panel" id="s8card" style="padding:70px 54px;">
        <span class="tag-icon" style="width:96px;height:96px;flex:0 0 96px;">${I.bulb}</span>
        <span style="font-size:46px;">Fix the workflow, not the output — or you're patching forever.</span>
      </div>
      <div class="tag-row">
        ${tag(I.repeat, 'PATCH ONCE, NOT FOREVER', 's8chip1', 'magenta')}
      </div>
    </div>
  </div>

  <!-- SCENE 9: SAVE TIP 0:50-0:55 -->
  <div class="scene" id="sc9">
    <div class="band band-tight">
      <div class="headline" id="s9head" style="font-size:72px;">Save the loop prompt.</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s9pulse"></div></div><div class="sig-readout"><span id="s9readout"></span><span class="sig-cursor" id="s9cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight" id="s9spot" style="width:880px;height:880px;margin:-440px 0 0 -440px;"></div>
      <div class="icon-badge" id="s9bookmark" style="width:320px;height:320px;color:#0ff1e0;">${I.bookmark}</div>
      <div class="sub" id="s9sub" style="font-size:44px;">Reuse it any time quality drifts.</div>
      <div class="tag-row">
        ${tag(I.sparkles, 'ONE PROMPT. EVERY WORKFLOW.', 's9chip1', 'magenta')}
      </div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="icon-badge" id="s10human" style="width:340px;height:430px;margin:0 auto;">${humanCta}</div>
    </div>
    <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s10pulse"></div></div><div class="sig-readout"><span id="s10readout"></span><span class="sig-cursor" id="s10cursor">▌</span></div></div>
    <div class="band-content">
      <div class="spotlight" id="s10spot" style="width:900px;height:900px;margin:-450px 0 0 -450px;"></div>
      <div class="panel cta-panel" id="s10card" style="padding:58px 74px;">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="" style="width:168px;height:168px;">
        <div class="cta-main" style="font-size:62px;">@sandesh.explains</div>
        <div class="cta-sub" style="font-size:31px;">LINKEDIN /SANDESH-KALE</div>
      </div>
      <div class="tag-row">
        ${tag(I.rocket, 'NEW AI WORKFLOW BREAKDOWNS WEEKLY', 's10chip1')}
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

// --- GSAP-driven entrance helpers (assets/animations/gsap/gsap.min.js) ---
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

var RING_C = 2*Math.PI*80;
$('s6ring').style.strokeDasharray = RING_C;

// Signal bridge: a traveling pulse down the wire (0.35 -> 0.85 of e), then
// a terminal-style typewriter reveal of a context-specific line, then a
// steady blinking cursor. sceneT is the scene-local time (not e) so the
// cursor keeps blinking for the rest of the scene once typing finishes.
function sigBridge(prefix, pulseEl, readoutEl, cursorEl, text, e, sceneT){
  if(!pulseEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  pulseEl.style.opacity = eoc(clamp((ee-0.05)/0.3,0,1)) * (1 - eoc(clamp((ee-0.55)/0.3,0,1)));
  pulseEl.style.top = (2 + 58*clamp((ee-0.05)/0.5,0,1)) + 'px';
  var typeE = clamp((ee-0.4)/0.5,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = prefix + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      runIn($('s1human'), t/0.55, -180);
      dropIn($('s1panel'), (t-0.25)/0.5, -220, -6);
      dropIn($('s1c0'), (t-0.45)/0.35, -80, 0);
      dropIn($('s1c1'), (t-0.58)/0.35, -80, 0);
      dropIn($('s1c2'), (t-0.71)/0.35, -80, 0);
      enter($('s1status'), eoc((t-0.9)/0.4), 14, 1);
      enter($('s1head'), eoc((t-1.1)/0.55), 22, 1);
  }},
  { start: 5, duration: 4, el: $('sc2'), render: function(t){
      dropIn($('s2visual'), t/0.5, -240, 0);
      enter($('s2head'), eoc((t-0.3)/0.5), 20, 1);
      enter($('s2sub'), eoc((t-0.55)/0.5), 18, 1);
      dropIn($('s2chip1'), (t-1.0)/0.4, -110, 8);
  }},
  { start: 9, duration: 6, el: $('sc3'), render: function(t){
      enter($('s3step'), eoc(t/0.3), 12, 1);
      enter($('s3head'), eoc((t-0.15)/0.5), 20, 1);
      sigBridge('> ', $('s3pulse'), $('s3readout'), $('s3cursor'), 'scanning recent outputs for drift...', (t-0.5)/1.1, t);
      dropIn($('s3c0'), (t-0.35)/0.4, -140, -10);
      dropIn($('s3c1'), (t-0.5)/0.4, -140, 0);
      dropIn($('s3c2'), (t-0.65)/0.4, -140, 10);
      enter($('s3sub'), eoc((t-1.2)/0.5), 18, 1);
  }},
  { start: 15, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4step'), eoc(t/0.3), 12, 1);
      enter($('s4head'), eoc((t-0.15)/0.5), 20, 1);
      sigBridge('> ', $('s4pulse'), $('s4readout'), $('s4cursor'), 'spinning up 3 reviewer roles...', (t-0.5)/1.1, t);
      dropIn($('s4quality'), (t-0.3)/0.5, -220, -12);
      dropIn($('s4prompt'), (t-0.5)/0.5, -220, 0);
      dropIn($('s4expert'), (t-0.7)/0.5, -220, 12);
      enter($('s4sub2'), eoc((t-1.3)/0.5), 18, 1);
  }},
  { start: 22, duration: 6, el: $('sc5'), render: function(t){
      enter($('s5step'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      sigBridge('> ', $('s5pulse'), $('s5readout'), $('s5cursor'), 'writing acceptance criteria...', (t-0.5)/1.1, t);
      enter($('s5card'), eoc((t-0.3)/0.5), 24, 1);
      dropIn($('s5c0'), (t-0.4)/0.4, -100, 0);
      dropIn($('s5c1'), (t-0.6)/0.4, -100, 0);
      dropIn($('s5c2'), (t-0.8)/0.4, -100, 0);
      enter($('s5sub'), eoc((t-1.3)/0.5), 18, 1);
  }},
  { start: 28, duration: 10, el: $('sc6'), render: function(t){
      enter($('s6step'), eoc(t/0.3), 12, 1);
      enter($('s6head'), eoc((t-0.15)/0.5), 20, 1);
      $('s6loopwrap').style.opacity = eoc((t-0.15)/0.5);
      var loopT = clamp(t - 0.3, 0, 999);
      var loopIdx = Math.min(2, Math.floor(loopT / 2.6));
      var loopLocal = clamp((loopT - loopIdx*2.6) / 2.2, 0, 1);
      $('s6num').textContent = String(loopIdx + 1);
      $('s6loopword').textContent = 'LOOP ' + (loopIdx+1) + ' / 3';
      $('s6ring').style.strokeDashoffset = RING_C * (1 - eoc(loopLocal));
      $('s6loopword').style.opacity = eoc((t-0.3)/0.4);
      enter($('s6card'), eoc((t-1.0)/0.5), 24, 1);
      dropIn($('s6i0'), (t-1.3)/0.35, -100, -8);
      runIn($('s6a0'), (t-1.5)/0.3, -30);
      dropIn($('s6i1'), (t-1.65)/0.35, -100, 0);
      runIn($('s6a1'), (t-1.85)/0.3, -30);
      dropIn($('s6i2'), (t-2.0)/0.35, -100, 0);
      runIn($('s6a2'), (t-2.2)/0.3, -30);
      dropIn($('s6i3'), (t-2.35)/0.35, -100, 8);
      enter($('s6sub'), eoc((t-3.2)/0.5), 18, 1);
  }},
  { start: 38, duration: 6, el: $('sc7'), render: function(t){
      enter($('s7step'), eoc(t/0.3), 12, 1);
      enter($('s7head'), eoc((t-0.15)/0.5), 20, 1);
      sigBridge('> ', $('s7pulse'), $('s7readout'), $('s7cursor'), 'running against a holdout example...', (t-0.5)/1.1, t);
      dropIn($('s7new'), (t-0.35)/0.4, -140, -8);
      runIn($('s7arrow'), (t-0.55)/0.3, -40);
      dropIn($('s7check1'), (t-0.75)/0.35, -120, -8);
      dropIn($('s7check2'), (t-0.9)/0.35, -120, 0);
      dropIn($('s7check3'), (t-1.05)/0.35, -120, 8);
      enter($('s7sub'), eoc((t-1.5)/0.5), 18, 1);
      dropIn($('s7chip1'), (t-1.9)/0.4, -110, -6);
  }},
  { start: 44, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.4), 16, 1);
      sigBridge('> ', $('s8pulse'), $('s8readout'), $('s8cursor'), 'patch(workflow) > patch(output)', (t-0.3)/1.1, t);
      enter($('s8card'), eoc((t-0.55)/0.5), 26, 1);
      dropIn($('s8chip1'), (t-1.15)/0.4, -110, 6);
  }},
  { start: 50, duration: 5, el: $('sc9'), render: function(t){
      enter($('s9head'), eoc(t/0.45), 20, 1);
      sigBridge('> ', $('s9pulse'), $('s9readout'), $('s9cursor'), 'saving prompt as "loop-method.v1"...', (t-0.1)/1.1, t);
      dropIn($('s9bookmark'), (t-0.3)/0.55, -220, -10);
      enter($('s9sub'), eoc((t-0.75)/0.5), 18, 1);
      dropIn($('s9chip1'), (t-1.1)/0.4, -110, 6);
  }},
  { start: 55, duration: 5, el: $('sc10'), render: function(t){
      runIn($('s10human'), t/0.55, -200);
      sigBridge('> ', $('s10pulse'), $('s10readout'), $('s10cursor'), 'connecting @sandesh.explains...', (t-0.15)/1.1, t);
      dropIn($('s10card'), (t-0.3)/0.5, -160, 0);
      dropIn($('s10chip1'), (t-0.75)/0.4, -110, 6);
  }}
];

window.__reelDurationSec = 60.0;
var marker = $('marker');
var started = false;

// Scene-to-scene crossfade: a short overlap window where the outgoing
// scene fades/drifts out while the incoming one fades/drifts in, instead
// of a hard cut. Deliberately subtle (short duration, small drift, plain
// fade — no wipes/zooms) per the brief that transitions shouldn't be
// "over the top". Both scenes render simultaneously during the overlap,
// which is why .scene visibility is now driven directly via inline
// style rather than a single .active class (that could only express one
// visible scene at a time).
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

  // Background: grid drifts slowly, glows drift on independent slow paths,
  // scanline sweeps top-to-bottom on a continuous loop. All t-driven.
  $('gridlines').style.transform = 'translate(' + ((t*6)%90) + 'px,' + ((t*4)%90) + 'px)';
  $('glowcyan').style.left = (-160 + 90*Math.sin(t*0.14)) + 'px';
  $('glowcyan').style.top = (-140 + 70*Math.cos(t*0.11)) + 'px';
  $('glowmagenta').style.right = (-200 + 100*Math.sin(t*0.12 + 2)) + 'px';
  $('glowmagenta').style.bottom = (200 + 80*Math.cos(t*0.16)) + 'px';
  var scanH = 1920 + 240;
  $('scanline').style.top = (((t*160) % scanH) - 240) + 'px';

  // Data-readout gutters: continuous vertical scroll, opposite directions.
  $('reoL').style.transform = 'translateY(' + (-(t*44) % 620) + 'px)';
  $('reoR').style.transform = 'translateY(' + ((t*36) % 620 - 620) + 'px)';
};

window.__autoplay = function(){
  var start = performance.now();
  function tick(){
    var t = (performance.now()-start)/1000;
    window.__seek(t);
    if (t < window.__reelDurationSec) requestAnimationFrame(tick);
  }
  tick();
};
</script>
</body>
</html>`;
}

main().catch((err) => { console.error(err); process.exit(1); });
