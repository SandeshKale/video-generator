#!/usr/bin/env node
// Assembles reel.html for "An AI Just Found Something No Human Has Ever
// Seen" (Anthropic's AI biology lab CRISPR-like discovery) from real files
// in assets/ — no hand-copied SVG.
//
// Visual system: "Bio Lab" — deep teal-black background, bioluminescent
// green + violet duotone, a static DNA-double-helix gutter (with traveling
// glow dots computed from the SVG path's own geometry) + hex-grid "petri
// dish" texture, hexagonal notched cards, Outfit display font. Approved
// from this reel's own mockup.mjs (mockup-scene1/4/10.png) — including the
// first use of a real vendored photo (a duotoned concentric-rings shot)
// as the hook/CTA hero.
//
// House rules that AREN'T about visual identity, still applied:
//   - GSAP-driven entrances (dropIn/tumbleIn/runIn), scrubbed via progress(e)
//   - Hard safe-zone exclusion: nothing in top ~224px, bottom ~400px, right ~190px
//   - Real vendored fonts, off-white text, soft shadow for legibility
//   - A gap-filling "helix-bridge" component (this reel's signal-bridge
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
  const [robot, target, activity, brain] = await Promise.all(
    ['robot', 'target', 'activity', 'brain'].map(tablerIcon)
  );

  // Two fresh humaaans poses, unused in any prior reel (used so far across
  // this repo: old reel-app figure, standing-9/16, standing-3/20,
  // standing-7/13, standing-1/5). This reel: standing-11 (the human role)
  // and standing-18 (CTA).
  const humanScientist = await humaaansFull('standing', 'standing-11', { coatColor: '#3dffb0', pantColor: '#0a1f1c' });
  const humanCta = await humaaansFull('standing', 'standing-18', { coatColor: '#b26bff', pantColor: '#12101d', shirtColor: '#eafff5' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const icons = { robot, target, activity, brain };

  const html = buildHtml({ icons, humanScientist, humanCta, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function petri(label, body, id, variant) {
  return `<div class="petri${variant ? ' ' + variant : ''}" id="${id}"><div class="petri-label">${label}</div><div class="petri-body">${body}</div></div>`;
}
function petriChip(icon, label, id, variant) {
  return `<div class="petri-chip${variant ? ' ' + variant : ''}" id="${id}">${icon ? `<span class="petri-chip-icon">${icon}</span>` : ''}<span>${label}</span></div>`;
}
function helixBridge(id) {
  return `<div class="helix-bridge"><div class="hb-readout"><span id="${id}readout"></span><span class="hb-cursor" id="${id}cursor">▌</span></div></div>`;
}

function buildHtml({ icons: I, humanScientist, humanCta, profileB64 }) {
return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>reel-anthropic-bio-lab</title>
<style>
@font-face{font-family:'Outfit';font-weight:700;src:url('../assets/fonts/outfit/outfit-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Outfit';font-weight:800;src:url('../assets/fonts/outfit/outfit-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{
  --bg: #05100e;
  --bg-2: #030907;
  --bio-green: #3dffb0;
  --bio-violet: #b26bff;
  --ink: #eafff5;
  --ink-dim: #8fb8ac;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter','Segoe UI',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

/* ---- background: hex-grid "petri dish" texture + DNA-helix gutters ---- */
.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-hexgrid{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 22% 18%, rgba(178,107,255,0.12), transparent 60%),
  radial-gradient(ellipse 900px 900px at 82% 78%, rgba(61,255,176,0.12), transparent 60%),
  var(--bg);}
.hexgrid-svg{position:absolute;inset:0;opacity:0.28;}
.helix-gutter{position:absolute;top:150px;bottom:400px;width:120px;opacity:0.6;}
.helix-gutter.left{left:36px;}
.helix-gutter.right{right:36px;transform:scaleX(-1);}
.helix-glow-dot{filter:drop-shadow(0 0 6px currentColor);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 42%, rgba(0,0,0,0.55) 100%);}

/* ---- photo hero: the concentric-rings shot, duotoned to the palette ---- */
.photo-hero{position:absolute;inset:0;z-index:0;}
.photo-hero img{position:absolute;top:50%;left:50%;height:1920px;width:auto;transform:translate(-50%,-50%);filter:grayscale(1) contrast(1.15) brightness(0.62);}
.photo-duo{position:absolute;inset:0;background:linear-gradient(135deg, rgba(61,255,176,0.62), rgba(178,107,255,0.58));mix-blend-mode:color;}
.photo-scrim{position:absolute;inset:0;background:linear-gradient(180deg, rgba(3,9,7,0.35) 0%, rgba(3,9,7,0.55) 55%, rgba(3,9,7,0.94) 100%);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:2;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}

.band{flex:1 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.band-content{flex:2.25 1 0;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;position:relative;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--bio-green);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.headline{font-family:'Outfit',sans-serif;font-weight:800;font-size:72px;line-height:1.16;letter-spacing:-0.01em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.65);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.headline .hi-green{color:var(--bio-green);}
.headline .hi-violet{color:var(--bio-violet);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:40px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}
.mono-label{font-family:'JBMono',monospace;font-weight:700;font-size:26px;letter-spacing:0.06em;color:var(--bio-violet);text-align:center;width:100%;will-change:transform,opacity;z-index:1;}

/* Helix bridge: this reel's signal-bridge equivalent — feeds a terminal-
   style typewriter line off the DNA-helix motif, then a blinking cursor.
   Fills the header-band -> content-band gap. */
.helix-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;z-index:1;position:relative;padding:10px 0;}
.hb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#d6f5e8;letter-spacing:0.01em;min-height:36px;}
.hb-cursor{color:var(--bio-green);font-weight:700;margin-left:3px;}

/* Petri card — hexagonal notched card, this reel's card/chip language. */
.petri{position:relative;background:rgba(255,255,255,0.05);border:1.5px solid rgba(61,255,176,0.32);padding:30px 44px;margin:12px 0;width:100%;max-width:760px;box-sizing:border-box;
  clip-path:polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%);will-change:transform,opacity;}
.petri.violet{border-color:rgba(178,107,255,0.4);}
.petri-label{font-family:'JBMono',monospace;font-weight:700;font-size:25px;letter-spacing:0.06em;color:var(--bio-green);text-transform:uppercase;}
.petri.violet .petri-label{color:var(--bio-violet);}
.petri-body{font-family:'Inter',sans-serif;font-weight:600;font-size:32px;color:var(--ink);margin-top:8px;line-height:1.3;}

.petri-chip{display:inline-flex;align-items:center;gap:14px;font-family:'JBMono',monospace;font-weight:700;font-size:26px;color:var(--ink);border:1.5px solid rgba(61,255,176,0.4);background:rgba(61,255,176,0.08);padding:18px 30px;
  clip-path:polygon(10% 0,90% 0,100% 50%,90% 100%,10% 100%,0 50%);will-change:transform,opacity;}
.petri-chip.violet{border-color:rgba(178,107,255,0.5);background:rgba(178,107,255,0.08);color:var(--bio-violet);}
.petri-chip-icon{width:30px;height:30px;flex:0 0 30px;}
.petri-chip-icon svg{width:100%;height:100%;}
.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;z-index:1;}

.icon-badge{width:100%;height:100%;color:var(--bio-green);will-change:transform,opacity;}
.icon-badge svg{width:100%;height:100%;}
.icon-badge.violet{color:var(--bio-violet);}

.human-wrap{width:280px;height:353px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5));will-change:transform,opacity;}
.human-wrap svg{width:100%;height:100%;}

.stat-big{font-family:'Outfit',sans-serif;font-weight:800;font-size:220px;line-height:1;letter-spacing:-0.02em;color:var(--bio-green);text-shadow:0 8px 30px rgba(0,0,0,.6);will-change:transform,opacity;}
.stat-label{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.06em;color:var(--ink-dim);text-transform:uppercase;margin-top:8px;text-align:center;will-change:transform,opacity;}

.cta-card{padding:50px 56px;display:flex;flex-direction:column;align-items:center;gap:20px;will-change:transform,opacity;background:rgba(255,255,255,0.06);border:1.5px solid rgba(61,255,176,0.35);position:relative;
  clip-path:polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%);}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--bio-green);box-shadow:0 0 28px rgba(61,255,176,0.5);}
.cta-main{font-family:'Outfit',sans-serif;color:var(--ink);font-size:48px;font-weight:800;letter-spacing:-0.01em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--bio-green);font-size:24px;font-weight:500;letter-spacing:0.02em;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(61,255,176,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--bio-green);width:0%;box-shadow:0 0 10px rgba(61,255,176,0.6);}
svg{overflow:visible;}
</style>
</head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="bg-hexgrid"></div>
  <svg class="hexgrid-svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hexpat" width="96" height="166" patternUnits="userSpaceOnUse">
        <polygon points="48,0 96,28 96,83 48,111 0,83 0,28" fill="none" stroke="rgba(61,255,176,0.35)" stroke-width="1.5"/>
        <polygon points="48,111 96,139 96,194 48,222 0,194 0,139" fill="none" stroke="rgba(178,107,255,0.28)" stroke-width="1.5"/>
      </pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#hexpat)"/>
  </svg>
  <svg class="helix-gutter left" id="helixL" viewBox="0 0 120 1346" xmlns="http://www.w3.org/2000/svg">
    <path id="helixLPathA" d="M20,0 C90,85 10,170 80,255 C90,340 10,425 80,510 C90,595 10,680 80,765 C90,850 10,935 80,1020 C90,1105 10,1190 80,1275 C90,1330 40,1346 20,1346" fill="none" stroke="var(--bio-green)" stroke-width="3"/>
    <path id="helixLPathB" d="M80,0 C10,85 90,170 20,255 C10,340 90,425 20,510 C10,595 90,680 20,765 C10,850 90,935 20,1020 C10,1105 90,1190 20,1275 C10,1330 60,1346 80,1346" fill="none" stroke="var(--bio-violet)" stroke-width="3"/>
    ${[...Array(11)].map((_, i) => `<line x1="20" y1="${i * 130 + 10}" x2="80" y2="${i * 130 + 10}" stroke="rgba(234,255,245,0.3)" stroke-width="2"/>`).join('')}
    <circle id="helixLDotA0" class="helix-glow-dot" r="6" fill="var(--bio-green)"/>
    <circle id="helixLDotA1" class="helix-glow-dot" r="6" fill="var(--bio-green)"/>
    <circle id="helixLDotB0" class="helix-glow-dot" r="6" fill="var(--bio-violet)"/>
    <circle id="helixLDotB1" class="helix-glow-dot" r="6" fill="var(--bio-violet)"/>
  </svg>
  <svg class="helix-gutter right" id="helixR" viewBox="0 0 120 1346" xmlns="http://www.w3.org/2000/svg">
    <path id="helixRPathA" d="M20,0 C90,85 10,170 80,255 C90,340 10,425 80,510 C90,595 10,680 80,765 C90,850 10,935 80,1020 C90,1105 10,1190 80,1275 C90,1330 40,1346 20,1346" fill="none" stroke="var(--bio-green)" stroke-width="3"/>
    <path id="helixRPathB" d="M80,0 C10,85 90,170 20,255 C10,340 90,425 20,510 C10,595 90,680 20,765 C10,850 90,935 20,1020 C10,1105 90,1190 20,1275 C10,1330 60,1346 80,1346" fill="none" stroke="var(--bio-violet)" stroke-width="3"/>
    ${[...Array(11)].map((_, i) => `<line x1="20" y1="${i * 130 + 10}" x2="80" y2="${i * 130 + 10}" stroke="rgba(234,255,245,0.3)" stroke-width="2"/>`).join('')}
    <circle id="helixRDotA0" class="helix-glow-dot" r="6" fill="var(--bio-green)"/>
    <circle id="helixRDotA1" class="helix-glow-dot" r="6" fill="var(--bio-green)"/>
    <circle id="helixRDotB0" class="helix-glow-dot" r="6" fill="var(--bio-violet)"/>
    <circle id="helixRDotB1" class="helix-glow-dot" r="6" fill="var(--bio-violet)"/>
  </svg>
  <div class="vignette"></div>
</div>

<div class="photo-hero" id="photoHero" style="display:none;">
  <img src="../assets/photos/servicestack/photo-1427087302890-2f05ee3bee12.jpg" alt="">
  <div class="photo-duo"></div>
  <div class="photo-scrim"></div>
</div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 (concentric-rings photo hero, full-bleed layer) -->
  <div class="scene" id="sc1">
    <div class="band-content">
      <div class="eyebrow" id="s1eyebrow">// AI BIOLOGY WATCH</div>
      <div class="headline" id="s1head">An AI just found something <span class="hi-green">no human</span> has ever seen.</div>
      <div class="sub" id="s1sub">Even its creators don't know what it does yet.</div>
    </div>
  </div>

  <!-- SCENE 2: SETUP 0:05-0:10 -->
  <div class="scene" id="sc2">
    <div class="band-content">
      <div class="icon-badge" id="s2icon" style="width:170px;height:170px;">${I.robot}</div>
      <div class="headline" id="s2head" style="font-size:64px;">Meet Anthropic's <span class="hi-violet">AI biology lab.</span></div>
      <div class="sub" id="s2sub">950 Claude agents, turned loose on a DNA database.</div>
      ${petriChip('', 'GOAL: FIND SOMETHING NEW', 's2chip')}
    </div>
  </div>

  <!-- SCENE 3: THE FIND 0:10-0:17 -->
  <div class="scene" id="sc3">
    <div class="band band-tight">
      <div class="eyebrow" id="s3eyebrow">// THE FIND</div>
      <div class="headline" id="s3head" style="font-size:62px;">A pattern <span class="hi-violet">nobody</span> had flagged before.</div>
    </div>
    ${helixBridge('s3')}
    <div class="band-content">
      ${petri('Anomaly detected', 'A CRISPR-like repeat array, paired with an unfamiliar enzyme.', 's3petri')}
    </div>
  </div>

  <!-- SCENE 4: THE MYSTERY 0:17-0:24 -->
  <div class="scene" id="sc4">
    <div class="band band-tight">
      <div class="eyebrow" id="s4eyebrow">// THE MYSTERY</div>
      <div class="headline" id="s4head" style="font-size:62px;">Anthropic is calling it <span class="hi-green">"ART."</span></div>
    </div>
    ${helixBridge('s4')}
    <div class="band-content">
      <div class="icon-badge violet" id="s4icon" style="width:140px;height:140px;">${I.target}</div>
      ${petri('A possible new gene editor', "Even Anthropic doesn't fully know yet.", 's4petri', 'violet')}
    </div>
  </div>

  <!-- SCENE 5: THE SCALE 0:24-0:31 -->
  <div class="scene" id="sc5">
    <div class="band band-tight">
      <div class="eyebrow" id="s5eyebrow">// THE SCALE</div>
      <div class="headline" id="s5head" style="font-size:58px;">950 agents. 210M tokens. <span class="hi-green">Less than a day.</span></div>
    </div>
    ${helixBridge('s5')}
    <div class="band-content">
      <div class="icon-badge" id="s5icon" style="width:120px;height:120px;">${I.activity}</div>
      <div class="chip-row">
        ${petriChip('', '950 AGENTS', 's5chip1')}
        ${petriChip('', '210M TOKENS', 's5chip2')}
        ${petriChip('', '< 24 HOURS', 's5chip3')}
      </div>
      ${petri('One agent’s own note', '"that’s a CRISPR-like… repeat array?!"', 's5petri', 'violet')}
    </div>
  </div>

  <!-- SCENE 6: THE HUMAN ROLE 0:31-0:38 -->
  <div class="scene" id="sc6">
    <div class="band-content">
      <div class="eyebrow" id="s6eyebrow">// THE HUMAN ROLE</div>
      <div class="human-wrap" id="s6human">${humanScientist}</div>
      <div class="headline" id="s6head" style="font-size:58px;">"Mostly, though not entirely" <span class="hi-green">Claude's.</span></div>
      <div class="sub" id="s6sub" style="font-size:36px;">Scientists picked the target. Claude suggested the experiments.</div>
    </div>
  </div>

  <!-- SCENE 7: THE VERDICT 0:38-0:45 -->
  <div class="scene" id="sc7">
    <div class="band-content">
      <div class="eyebrow" id="s7eyebrow">// THE VERDICT</div>
      <div class="headline" id="s7head">"Work I would have been proud of <span class="hi-violet">as a PhD student.</span>"</div>
      <div class="mono-label" id="s7label">— DARIO AMODEI, ANTHROPIC CEO</div>
    </div>
  </div>

  <!-- SCENE 8: THE TREND 0:45-0:51 -->
  <div class="scene" id="sc8">
    <div class="band-content">
      <div class="eyebrow" id="s8eyebrow">// THE TREND</div>
      <div class="icon-badge" id="s8icon" style="width:150px;height:150px;">${I.brain}</div>
      <div class="headline" id="s8head" style="font-size:58px;">Models went from failing basic math in 2023 to cracking open problems this year.</div>
      <div class="sub" id="s8sub">Biology looks like it's next.</div>
    </div>
  </div>

  <!-- SCENE 9: STAT CALLOUT 0:51-0:55 -->
  <div class="scene" id="sc9">
    <div class="band-content" style="gap:12px;">
      <div class="eyebrow" id="s9eyebrow">// STAT CALLOUT</div>
      <div class="stat-big" id="s9stat">26%</div>
      <div class="stat-label" id="s9statlabel">of Anthropic's own AI R&amp;D — led end-to-end by Claude</div>
      <div class="sub" id="s9sub" style="margin-top:10px;">Up from under 1% in February.</div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:55-1:00 (concentric-rings photo hero, full-bleed layer) -->
  <div class="scene" id="sc10">
    <div class="band band-tight">
      <div class="human-wrap" id="s10human" style="width:260px;height:328px;margin:20px auto 0;">${humanCta}</div>
    </div>
    ${helixBridge('s10')}
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

// Helix bridge: a terminal-style typewriter reveal of a scene-specific
// line, then a blinking cursor — this reel's variant skips a separate
// pulse dot since the DNA-gutter's own traveling glow already supplies
// the "wire" motion in the background.
function helixBridge(readoutEl, cursorEl, text, e, sceneT){
  if(!readoutEl) return;
  var ee = clamp(e,0,1);
  var typeE = clamp((ee-0.15)/0.6,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = '> ' + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

// DNA-helix gutters: traveling glow dots computed from the SVG paths' own
// geometry (getPointAtLength), so the motion is exactly t-driven and never
// drifts — two dots per strand, staggered, looping down the gutter.
function setupHelixDots(prefix) {
  var pathA = document.getElementById(prefix + 'PathA');
  var pathB = document.getElementById(prefix + 'PathB');
  var lenA = pathA.getTotalLength(), lenB = pathB.getTotalLength();
  return { pathA: pathA, pathB: pathB, lenA: lenA, lenB: lenB };
}
var helixL = setupHelixDots('helixL');
var helixR = setupHelixDots('helixR');
function updateHelixDots(prefix, geo, t) {
  [0, 1].forEach(function(i){
    var phaseA = (t * 0.09 + i / 2) % 1;
    var ptA = geo.pathA.getPointAtLength(phaseA * geo.lenA);
    var dotA = $(prefix + 'DotA' + i);
    dotA.setAttribute('cx', ptA.x); dotA.setAttribute('cy', ptA.y);
    dotA.style.opacity = 0.4 + 0.5 * Math.sin(phaseA * Math.PI);
    var phaseB = (t * 0.09 + 0.5 + i / 2) % 1;
    var ptB = geo.pathB.getPointAtLength(phaseB * geo.lenB);
    var dotB = $(prefix + 'DotB' + i);
    dotB.setAttribute('cx', ptB.x); dotB.setAttribute('cy', ptB.y);
    dotB.style.opacity = 0.4 + 0.5 * Math.sin(phaseB * Math.PI);
  });
}

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), usesPhoto: true, render: function(t){
      enter($('s1eyebrow'), eoc(t/0.35), 14, 1);
      enter($('s1head'), eoc((t-0.25)/0.55), 22, 1);
      enter($('s1sub'), eoc((t-0.9)/0.45), 18, 1);
  }},
  { start: 5, duration: 5, el: $('sc2'), render: function(t){
      dropIn($('s2icon'), t/0.5, -200, -8);
      enter($('s2head'), eoc((t-0.4)/0.5), 20, 1);
      enter($('s2sub'), eoc((t-0.85)/0.5), 16, 1);
      dropIn($('s2chip'), (t-1.5)/0.4, -100, -4);
  }},
  { start: 10, duration: 7, el: $('sc3'), render: function(t){
      enter($('s3eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s3head'), eoc((t-0.15)/0.5), 20, 1);
      helixBridge($('s3readout'), $('s3cursor'), 'scanning viral DNA for anomalies...', (t-0.5)/1.1, t);
      dropIn($('s3petri'), (t-1.3)/0.45, -140, 0);
  }},
  { start: 17, duration: 7, el: $('sc4'), render: function(t){
      enter($('s4eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s4head'), eoc((t-0.15)/0.5), 20, 1);
      helixBridge($('s4readout'), $('s4cursor'), 'classifying novel enzyme system...', (t-0.5)/1.1, t);
      tumbleIn($('s4icon'), (t-1.0)/0.5, -140);
      dropIn($('s4petri'), (t-1.5)/0.45, -140, 0);
  }},
  { start: 24, duration: 7, el: $('sc5'), render: function(t){
      enter($('s5eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.15)/0.5), 20, 1);
      helixBridge($('s5readout'), $('s5cursor'), 'tallying compute spent...', (t-0.5)/1.1, t);
      dropIn($('s5icon'), (t-1.0)/0.5, -160, -6);
      dropIn($('s5chip1'), (t-1.4)/0.35, -100, -4);
      dropIn($('s5chip2'), (t-1.6)/0.35, -100, 0);
      dropIn($('s5chip3'), (t-1.8)/0.35, -100, 4);
      dropIn($('s5petri'), (t-2.2)/0.45, -140, 0);
  }},
  { start: 31, duration: 7, el: $('sc6'), render: function(t){
      enter($('s6eyebrow'), eoc(t/0.3), 12, 1);
      runIn($('s6human'), (t-0.3)/0.55, -180);
      enter($('s6head'), eoc((t-0.9)/0.5), 20, 1);
      enter($('s6sub'), eoc((t-1.4)/0.45), 16, 1);
  }},
  { start: 38, duration: 7, el: $('sc7'), render: function(t){
      enter($('s7eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s7head'), eoc((t-0.3)/0.55), 22, 1);
      enter($('s7label'), eoc((t-1.0)/0.4), 14, 1);
  }},
  { start: 45, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s8icon'), (t-0.3)/0.5, 140);
      enter($('s8head'), eoc((t-0.9)/0.5), 20, 1);
      enter($('s8sub'), eoc((t-1.4)/0.45), 16, 1);
  }},
  { start: 51, duration: 4, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.3), 12, 1);
      tumbleIn($('s9stat'), (t-0.2)/0.5, -20);
      enter($('s9statlabel'), eoc((t-0.7)/0.4), 14, 1);
      enter($('s9sub'), eoc((t-1.05)/0.45), 16, 1);
  }},
  { start: 55, duration: 5, el: $('sc10'), usesPhoto: true, render: function(t){
      runIn($('s10human'), t/0.5, -180);
      helixBridge($('s10readout'), $('s10cursor'), 'queuing @sandesh.explains...', (t-0.15)/1.0, t);
      dropIn($('s10card'), (t-0.3)/0.5, -150, 0);
  }}
];

window.__reelDurationSec = 60.0;
var marker = $('marker');
var started = false;

var TRANS = 0.32;
var photoHero = $('photoHero');
window.__seek = function(t){
  if (!started) { marker.style.display='none'; started = true; }
  var photoOpacity = 0;
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
    if (scene.usesPhoto) photoOpacity = Math.max(photoOpacity, op);
  });
  photoHero.style.display = photoOpacity > 0 ? 'block' : 'none';
  photoHero.style.opacity = photoOpacity;
  $('progress').style.width = (100*clamp(t/window.__reelDurationSec,0,1)) + '%';

  updateHelixDots('helixL', helixL, t);
  updateHelixDots('helixR', helixR, t);
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
