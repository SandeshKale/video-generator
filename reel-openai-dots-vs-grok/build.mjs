#!/usr/bin/env node
// Assembles reel.html for "OpenAI's dots vs Grok Bot — the domain redirect
// story" from real files in assets/ — no hand-copied SVG.
//
// Visual system: "Arena / Duotone" — graphite background, indigo (dots/
// OpenAI) vs amber (Grok Bot/xAI) split by a rotated diagonal seam, browser-
// window cards, a VS-badge head-to-head device, an address-bar typewriter
// bridge, Manrope display type. Deliberately distinct from every prior
// reel's palette/texture/component language — approved from mockup.mjs
// (3-frame preview) before this full build. See CLAUDE.md's "Every reel
// needs its own visual identity" + "Creative benchmark" sections.
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

function hash(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

async function main() {
  const iconNames = [
    'world', 'link', 'cloud', 'server', 'flame', 'search', 'device-desktop',
    'users', 'rocket', 'puzzle', 'arrow-right', 'message', 'trending-up', 'map-pin',
  ];
  const iconList = await Promise.all(iconNames.map(tablerIcon));
  const I = {};
  iconNames.forEach((n, i) => { I[n.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = iconList[i]; });

  const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');

  // Different pose + a per-reel color override for each character
  // appearance (never reusing one pose/color combo twice — CLAUDE.md).
  const humanHook = await humaaansFull('standing', 'standing-8', { coatColor: '#5b6bff', pantColor: '#15171d' });
  const humanReact = await humaaansFull('standing', 'standing-21', { coatColor: '#ffab2e', pantColor: '#15171d', shirtColor: '#eef0f7' });

  const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

  const html = buildHtml({ icons: I, openai, humanHook, humanReact, profileB64 });
  await writeFile(join(__dirname, 'reel.html'), html, 'utf8');
  console.log('wrote', join(__dirname, 'reel.html'), `(${(html.length / 1024).toFixed(0)}KB)`);
}

function chip(icon, label, id, variant) {
  return `<div class="chip${variant ? ' ' + variant : ''}" id="${id}"><span class="icon-sz" style="width:22px;height:22px;">${icon}</span><span>${label}</span></div>`;
}

function stepHead(current, total, id) {
  let dots = '';
  for (let i = 1; i <= total; i++) dots += `<span class="step-dot${i <= current ? ' done' : ''}"></span>`;
  return `<div class="step-head" id="${id}"><div class="eyebrow" style="margin-bottom:0;">STEP ${current} / ${total}</div><div class="step-dots">${dots}</div></div>`;
}

function appTiles() {
  let out = '';
  for (let i = 0; i < 34; i++) {
    const x = hash(i) * 1080;
    const y = hash(i + 100) * 1920;
    out += `<div class="app-tile" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;"></div>`;
  }
  return out;
}

function buildHtml({ icons: I, openai, humanHook, humanReact, profileB64 }) {
return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>reel-openai-dots-vs-grok</title>
<style>
@font-face{font-family:'Manrope';font-weight:700;src:url('../assets/fonts/manrope/manrope-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Manrope';font-weight:800;src:url('../assets/fonts/manrope/manrope-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:500;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
:root{
  --bg: #15171d;
  --indigo: #5b6bff;
  --amber: #ffab2e;
  --ink: #eef0f7;
  --ink-dim: #9aa0b4;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.marker{position:absolute;inset:0;background:#FF00FF;z-index:9999;}

.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 1100px 900px at 12% 10%, rgba(91,107,255,0.30), transparent 58%),
  radial-gradient(ellipse 1100px 1000px at 90% 88%, rgba(255,171,46,0.24), transparent 58%),
  var(--bg);}
.arena-split{position:absolute;inset:-10% -30%;transform:rotate(-11deg);background:linear-gradient(90deg,
  rgba(91,107,255,0.16) 0%, rgba(91,107,255,0.05) 46%, transparent 50%,
  rgba(255,171,46,0.05) 54%, rgba(255,171,46,0.16) 100%);}
.arena-seam{position:absolute;left:50%;top:-10%;bottom:-10%;width:3px;transform:rotate(-11deg) translateX(-50%);
  background:linear-gradient(180deg, transparent, rgba(238,240,247,0.5) 20%, rgba(238,240,247,0.5) 80%, transparent);
  box-shadow:0 0 40px 6px rgba(238,240,247,0.25);}
.app-tile{position:absolute;width:34px;height:34px;border-radius:9px;background:rgba(238,240,247,0.06);}
.spotlight{position:absolute;top:50%;left:50%;border-radius:50%;background:radial-gradient(circle, rgba(91,107,255,0.20), rgba(91,107,255,0.05) 55%, transparent 75%);pointer-events:none;z-index:0;}
.spotlight.amber{background:radial-gradient(circle, rgba(255,171,46,0.20), rgba(255,171,46,0.05) 55%, transparent 75%);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 34%, rgba(0,0,0,0.62) 100%);}

/* Vertical data-readout gutters, inset well past the 15px safe margin
   (CLAUDE.md: decorative edge elements must sit at the same inset as
   content, not near the raw canvas edge). */
.readout{position:absolute;top:224px;bottom:400px;width:34px;overflow:hidden;z-index:0;}
.readout.left{left:64px;}
.readout.right{right:64px;}
.readout-inner{font-family:'JBMono';font-weight:500;font-size:19px;letter-spacing:0.13em;line-height:2.3;writing-mode:vertical-rl;color:rgba(91,107,255,0.4);white-space:pre;}
.readout.right .readout-inner{color:rgba(255,171,46,0.4);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:1;}
.scene{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}
/* Every scene's content lives as direct children of one full-height stack,
   spread with space-evenly so extra room distributes across the WHOLE
   safe area (top gap, between-child gaps, bottom gap) instead of
   collapsing into one dead zone below a small centered cluster — the
   fix for the "min 60% fill" / no-empty-space hard rule. */
.scene-stack{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-evenly;gap:10px;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--indigo);text-transform:uppercase;text-align:center;width:100%;will-change:transform,opacity;}
.eyebrow.amber{color:var(--amber);}
.headline{font-family:'Manrope',sans-serif;font-weight:800;font-size:76px;line-height:1.1;letter-spacing:-0.02em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.7);text-align:center;width:100%;will-change:transform,opacity;}
.headline .hi-indigo{color:var(--indigo);}
.headline .hi-amber{color:var(--amber);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:38px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;will-change:transform,opacity;}

.step-head{display:flex;flex-direction:column;align-items:center;gap:14px;will-change:transform,opacity;}
.step-dots{display:flex;gap:11px;}
.step-dot{width:11px;height:11px;border-radius:50%;background:rgba(91,107,255,0.2);border:1px solid rgba(91,107,255,0.35);}
.step-dot.done{background:var(--indigo);border-color:var(--indigo);box-shadow:0 0 10px rgba(91,107,255,0.65);}

.signal-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:14px;z-index:1;position:relative;padding:6px 0;}
.sig-wire{position:relative;width:2px;height:60px;background:linear-gradient(180deg, rgba(91,107,255,0.12), rgba(91,107,255,0.6), rgba(91,107,255,0.12));}
.sig-pulse{position:absolute;left:50%;top:0;width:13px;height:13px;margin-left:-6.5px;border-radius:50%;background:var(--indigo);box-shadow:0 0 18px 5px rgba(91,107,255,0.65);opacity:0;}
.sig-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#b7c0ff;letter-spacing:0.01em;min-height:36px;text-align:center;}
.sig-cursor{color:var(--indigo);font-weight:700;margin-left:3px;}

.browser-card{width:100%;max-width:900px;border-radius:18px;overflow:hidden;background:#1b1e27;flex-shrink:0;
  box-shadow:0 1px 2px rgba(0,0,0,.4), 0 26px 60px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,0.06);will-change:transform,opacity;}
.browser-titlebar{height:52px;display:flex;align-items:center;gap:10px;padding:0 20px;background:#22262f;}
.browser-dot{width:13px;height:13px;border-radius:50%;}
.browser-dot.r{background:#ff5f57;} .browser-dot.a{background:#febc2e;} .browser-dot.g{background:#28c840;}
.browser-tab{margin-left:16px;font-family:'JBMono',monospace;font-size:20px;color:var(--ink-dim);}
.browser-urlrow{display:flex;align-items:center;gap:12px;padding:18px 22px;background:#191c24;}
.browser-urlpill{flex:1;display:flex;align-items:center;gap:10px;background:#0d0e12;border-radius:20px;padding:12px 22px;font-family:'JBMono',monospace;font-size:26px;color:var(--ink);}
.browser-body{padding:36px 34px 42px;display:flex;flex-direction:column;align-items:center;gap:16px;}

.icon-sz{display:inline-flex;flex:0 0 auto;}
.icon-sz svg{width:100%;height:100%;}

.vs-badge{position:relative;width:96px;height:96px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg, var(--indigo), var(--amber));
  box-shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 26px rgba(0,0,0,.5), 0 0 0 4px var(--bg), 0 0 0 6px rgba(255,255,255,0.12);will-change:transform,opacity;}
.vs-badge span{font-family:'Manrope',sans-serif;font-weight:800;font-size:30px;color:#0d0e12;letter-spacing:-0.02em;}

.brand-badge{width:100px;height:100px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);flex-shrink:0;}
.brand-badge svg{width:56px;height:56px;color:var(--ink);}
.grok-mark{font-family:'Manrope',sans-serif;font-weight:800;font-size:44px;color:var(--amber);letter-spacing:-0.02em;}

.spec-row{display:flex;justify-content:space-between;align-items:center;width:100%;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08);}
.spec-row:last-child{border-bottom:none;}
.spec-label{font-family:'JBMono',monospace;font-size:22px;color:var(--ink-dim);text-transform:uppercase;letter-spacing:0.04em;}
.spec-value{font-family:'Manrope',sans-serif;font-weight:800;font-size:28px;color:var(--ink);}
.spec-value.indigo{color:var(--indigo);}
.spec-value.amber{color:var(--amber);}

.addr-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 0;}
.addr-pill{display:flex;align-items:center;gap:10px;background:#0d0e12;border-radius:20px;padding:12px 26px;font-family:'JBMono',monospace;font-size:24px;color:var(--ink);box-shadow:inset 0 0 0 1.5px rgba(91,107,255,0.35);}
.addr-pill .icon-sz{width:22px;height:22px;color:var(--indigo);}
.addr-cursor{color:var(--indigo);font-weight:700;}

.human-wrap{width:270px;height:340px;flex-shrink:0;filter:drop-shadow(0 16px 26px rgba(0,0,0,.5));will-change:transform,opacity;}
.human-wrap svg{width:100%;height:100%;}

.snap{width:100%;background:#0d0e12;border-radius:10px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.06);}
.snap-nav{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);}
.snap-nav .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.18);}
.snap-nav .navlabel{margin-left:auto;font-family:'JBMono',monospace;font-size:16px;color:var(--ink-dim);}
.snap-hero{padding:30px 26px 34px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;}
.snap-hero h3{margin:0;font-family:'Manrope',sans-serif;font-weight:800;font-size:34px;color:var(--ink);}
.snap-hero p{margin:0;font-family:'Inter',sans-serif;font-size:19px;color:var(--ink-dim);}
.snap-pill{display:inline-block;font-family:'JBMono',monospace;font-weight:700;font-size:18px;color:#0d0e12;background:var(--amber);padding:8px 20px;border-radius:16px;}

.chip{display:inline-flex;align-items:center;gap:12px;font-family:'JBMono',monospace;font-weight:700;font-size:22px;color:var(--ink);padding:14px 24px;border-radius:14px;
  background:rgba(91,107,255,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.3), inset 0 0 0 1.5px rgba(91,107,255,0.35);will-change:transform,opacity;}
.chip.amber{background:rgba(255,171,46,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.3), inset 0 0 0 1.5px rgba(255,171,46,0.4);color:var(--amber);}
.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;z-index:1;}

/* Dated timeline — bespoke centerpiece for S2, showing the actual
   sequence of dates the story hinges on (not a reused card). */
.tl-track{position:relative;width:100%;max-width:760px;padding:10px 0;}
.tl-line{position:absolute;left:38px;top:20px;bottom:20px;width:3px;background:linear-gradient(180deg, var(--indigo), var(--ink-dim) 50%, var(--amber));}
.tl-node{position:relative;display:flex;align-items:flex-start;gap:26px;padding:22px 0;will-change:transform,opacity;}
.tl-dot{position:relative;z-index:1;width:24px;height:24px;border-radius:50%;flex:0 0 24px;margin-top:4px;background:var(--bg);border:4px solid var(--indigo);box-shadow:0 0 0 6px rgba(91,107,255,0.15);}
.tl-node.amber .tl-dot{border-color:var(--amber);box-shadow:0 0 0 6px rgba(255,171,46,0.15);}
.tl-date{font-family:'JBMono',monospace;font-weight:700;font-size:24px;letter-spacing:0.06em;color:var(--indigo);}
.tl-node.amber .tl-date{color:var(--amber);}
.tl-desc{font-family:'Inter',sans-serif;font-weight:600;font-size:29px;color:var(--ink);line-height:1.3;margin-top:4px;}

/* Architecture split — bespoke centerpiece for S5, one dedicated compute
   node per agent (dots) vs one shared compute node (grok bot). */
.arch-row{display:flex;align-items:stretch;justify-content:center;gap:28px;width:100%;}
.arch-col{flex:1;max-width:340px;border-radius:18px;padding:30px 22px;display:flex;flex-direction:column;align-items:center;gap:14px;
  background:rgba(255,255,255,0.04);box-shadow:inset 0 0 0 1.5px rgba(91,107,255,0.3);will-change:transform,opacity;}
.arch-col.amber{box-shadow:inset 0 0 0 1.5px rgba(255,171,46,0.35);}
.arch-title{font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:0.08em;color:var(--indigo);text-transform:uppercase;}
.arch-col.amber .arch-title{color:var(--amber);}
.arch-nodes{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;}
.arch-node{width:66px;height:66px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(91,107,255,0.14);}
.arch-node svg{width:34px;height:34px;color:var(--indigo);}
.arch-col.amber .arch-node{background:rgba(255,171,46,0.14);}
.arch-col.amber .arch-node svg{color:var(--amber);}
.arch-sub{font-family:'Inter',sans-serif;font-weight:600;font-size:22px;color:var(--ink-dim);text-align:center;line-height:1.3;}

/* Bare attributed quote — S6, real-source credibility, no card wrapper. */
.quote-mark{width:64px;height:64px;color:var(--indigo);opacity:0.7;}
.quote-mark svg{width:100%;height:100%;}
.quote-text{font-family:'Manrope',sans-serif;font-weight:700;font-size:52px;line-height:1.28;letter-spacing:-0.01em;color:var(--ink);text-align:center;text-shadow:0 4px 16px rgba(0,0,0,.6);width:100%;will-change:transform,opacity;}
.quote-src{font-family:'JBMono',monospace;font-weight:500;font-size:24px;letter-spacing:0.05em;color:var(--ink-dim);text-align:center;width:100%;will-change:transform,opacity;}

/* Big stat face-off — S9, two hero numbers on either side of a VS badge. */
.stat-row{display:flex;align-items:center;justify-content:center;gap:30px;width:100%;}
.stat-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;will-change:transform,opacity;}
.stat-num{font-family:'Manrope',sans-serif;font-weight:800;font-size:88px;letter-spacing:-0.03em;color:var(--indigo);text-shadow:0 6px 20px rgba(0,0,0,.6);}
.stat-col.amber .stat-num{color:var(--amber);}
.stat-lbl{font-family:'JBMono',monospace;font-weight:700;font-size:21px;letter-spacing:0.06em;color:var(--ink-dim);text-transform:uppercase;text-align:center;}

.cta-panel{padding:46px 60px;display:flex;flex-direction:column;align-items:center;gap:22px;will-change:transform,opacity;background:rgba(255,255,255,0.04);border-radius:24px;box-shadow:inset 0 0 0 1.5px rgba(91,107,255,0.3);}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--indigo);box-shadow:0 0 30px rgba(91,107,255,0.45);}
.cta-main{font-family:'Manrope',sans-serif;color:var(--ink);font-size:56px;font-weight:800;letter-spacing:-0.02em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--ink-dim);font-size:26px;font-weight:500;}

.progress{position:absolute;bottom:26px;left:40px;right:40px;height:3px;background:rgba(91,107,255,0.14);overflow:hidden;}
.progress-fill{position:absolute;top:0;left:0;bottom:0;background:var(--indigo);width:0%;box-shadow:0 0 10px rgba(91,107,255,0.6);}
svg{overflow:visible;}
</style></head>
<body>
<div class="marker" id="marker"></div>
<div class="bg-texture">
  <div class="bg-wash"></div>
  <div class="arena-split"></div>
  <div class="arena-seam"></div>
  ${appTiles()}
  <div class="vignette"></div>
</div>
<div class="readout left"><div class="readout-inner" id="reoL">DOTS · DOTS · DOTS · DOTS · DOTS · DOTS · DOTS · DOTS</div></div>
<div class="readout right"><div class="readout-inner" id="reoR">GROK BOT · GROK BOT · GROK BOT · GROK BOT · GROK BOT</div></div>

<div class="safe" id="safe">

  <!-- SCENE 1: HOOK 0:00-0:05 -->
  <div class="scene" id="sc1">
    <div class="scene-stack">
      <div class="spotlight" id="s1spot" style="width:900px;height:900px;margin:-450px 0 0 -450px;"></div>
      <div class="eyebrow" id="s1eyebrow">// THE AGENT ARMS RACE</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:26px;width:100%;">
        <div class="human-wrap" id="s1human" style="width:236px;height:296px;">${humanHook}</div>
        <div class="vs-badge" id="s1vs"><span>VS</span></div>
        <div class="brand-badge" id="s1grok" style="width:128px;height:128px;"><div class="grok-mark" style="font-size:40px;">grok</div></div>
      </div>
      <div class="headline" id="s1head" style="font-size:66px;">OpenAI just launched its biggest AI agent. Its own <span class="hi-amber">domain</span> sends you to the rival.</div>
      <div class="addr-bridge" id="s1addr">
        <div class="addr-pill"><span class="icon-sz">${I.link}</span><span id="s1addrtext">dot.com</span><span class="addr-cursor">▌</span></div>
      </div>
      <div class="chip-row">
        ${chip(I.flame, 'SEPT 29, 2026', 's1chip1', 'amber')}
        ${chip(I.world, 'DEVDAY 2026', 's1chip2')}
      </div>
    </div>
  </div>

  <!-- SCENE 2: THE PAPER TRAIL (timeline) 0:05-0:11 -->
  <div class="scene" id="sc2">
    <div class="scene-stack">
      <div class="spotlight" id="s2spot" style="width:820px;height:820px;margin:-410px 0 0 -410px;"></div>
      <div class="eyebrow" id="s2eyebrow">// THE PAPER TRAIL</div>
      <div class="headline" id="s2head" style="font-size:60px;">Three dates. One quiet decision.</div>
      <div class="tl-track" id="s2track">
        <div class="tl-line"></div>
        <div class="tl-node" id="s2n1">
          <div class="tl-dot"></div>
          <div><div class="tl-date">JULY 2026</div><div class="tl-desc">Whois records: <span class="hi-amber">dot.com</span> quietly changes hands — no announcement.</div></div>
        </div>
        <div class="tl-node amber" id="s2n2">
          <div class="tl-dot"></div>
          <div><div class="tl-date">AUG 11, 2026</div><div class="tl-desc">Grok Bot launches at xAI — <span class="hi-amber">$20/month</span>, flat.</div></div>
        </div>
        <div class="tl-node" id="s2n3">
          <div class="tl-dot"></div>
          <div><div class="tl-date">SEPT 29, 2026</div><div class="tl-desc">OpenAI unveils <span class="hi-indigo">dots</span> at DevDay — 49 days later.</div></div>
        </div>
      </div>
      <div class="chip-row">${chip(I.search, '49 DAYS BETWEEN THE TRANSFER AND THE LAUNCH', 's2chip1')}</div>
    </div>
  </div>

  <!-- SCENE 3: THE REDIRECT 0:11-0:17 -->
  <div class="scene" id="sc3">
    <div class="scene-stack">
      <div class="spotlight amber" id="s3spot" style="width:850px;height:850px;margin:-425px 0 0 -425px;"></div>
      ${stepHead(1, 3, 's3step')}
      <div class="eyebrow amber" id="s3eyebrow">// THE REDIRECT</div>
      <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s3pulse"></div></div><div class="sig-readout"><span id="s3readout"></span><span class="sig-cursor" id="s3cursor">▌</span></div></div>
      <div class="browser-card" id="s3card">
        <div class="browser-titlebar">
          <div class="browser-dot r"></div><div class="browser-dot a"></div><div class="browser-dot g"></div>
          <div class="browser-tab">dot.com</div>
        </div>
        <div class="browser-urlrow">
          <div class="browser-urlpill"><span class="icon-sz">${I.link}</span><span>dot.com</span></div>
        </div>
        <div class="browser-body" style="gap:24px;">
          <div class="snap" id="s3snap">
            <div class="snap-nav"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span class="navlabel">grok.com/bot</span></div>
            <div class="snap-hero">
              <h3>Meet Grok <span style="color:var(--amber);">Bot</span></h3>
              <p>Always-on. Browses like a person. No API needed.</p>
              <span class="snap-pill">$20 / month</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:14px;width:100%;" id="s3row">
            <div class="brand-badge" style="width:74px;height:74px;"><div style="color:var(--indigo);width:40px;height:40px;">${openai}</div></div>
            <div class="vs-badge" style="width:60px;height:60px;"><span style="font-size:19px;">VS</span></div>
            <div class="brand-badge" style="width:74px;height:74px;"><div class="grok-mark" style="font-size:30px;">grok</div></div>
          </div>
        </div>
      </div>
      <div class="chip-row">${chip(I.cloud, 'THE #1 RESULT FOR "dot.com" WAS A COMPETITOR', 's3chip1', 'amber')}</div>
    </div>
  </div>

  <!-- SCENE 4: HEAD TO HEAD (spec ticket) 0:17-0:23 -->
  <div class="scene" id="sc4">
    <div class="scene-stack">
      <div class="spotlight" id="s4spot" style="width:830px;height:830px;margin:-415px 0 0 -415px;"></div>
      ${stepHead(2, 3, 's4step')}
      <div class="eyebrow" id="s4eyebrow">// HEAD TO HEAD</div>
      <div class="headline" id="s4head" style="font-size:58px;">Two agents. <span class="hi-indigo">One</span> launched six weeks after the <span class="hi-amber">other.</span></div>
      <div class="browser-card" id="s4card">
        <div class="browser-titlebar">
          <div class="browser-dot r"></div><div class="browser-dot a"></div><div class="browser-dot g"></div>
          <div class="browser-tab">dots vs grok bot</div>
        </div>
        <div class="browser-body" style="padding-top:28px;">
          <div class="spec-row"><span class="spec-label">dots · openai</span><span class="spec-value indigo">$100/mo Pro</span></div>
          <div class="spec-row"><span class="spec-label">grok bot · xai</span><span class="spec-value amber">$20/mo flat</span></div>
          <div class="spec-row"><span class="spec-label">dots compute</span><span class="spec-value indigo">own cloud computer</span></div>
          <div class="spec-row"><span class="spec-label">grok bot compute</span><span class="spec-value amber">one shared computer</span></div>
          <div class="spec-row"><span class="spec-label">dots ecosystem</span><span class="spec-value indigo">4,000+ apps</span></div>
        </div>
      </div>
      <div class="human-wrap" id="s4human" style="width:190px;height:238px;">${humanReact}</div>
    </div>
  </div>

  <!-- SCENE 5: THE COMPUTE GAP (architecture diagram) 0:23-0:30 -->
  <div class="scene" id="sc5">
    <div class="scene-stack">
      <div class="spotlight" id="s5spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      ${stepHead(3, 3, 's5step')}
      <div class="eyebrow" id="s5eyebrow">// THE COMPUTE GAP</div>
      <div class="headline" id="s5head" style="font-size:60px;">Not just price. <span class="hi-indigo">Architecture.</span></div>
      <div class="arch-row" id="s5row">
        <div class="arch-col" id="s5col1">
          <div class="arch-title">dots</div>
          <div class="arch-nodes">
            <div class="arch-node">${I.deviceDesktop}</div>
            <div class="arch-node">${I.deviceDesktop}</div>
            <div class="arch-node">${I.deviceDesktop}</div>
          </div>
          <div class="arch-sub">a dedicated cloud computer per agent</div>
        </div>
        <div class="vs-badge" id="s5vs" style="width:74px;height:74px;flex-shrink:0;"><span style="font-size:23px;">VS</span></div>
        <div class="arch-col amber" id="s5col2">
          <div class="arch-title">grok bot</div>
          <div class="arch-nodes">
            <div class="arch-node">${I.server}</div>
          </div>
          <div class="arch-sub">one shared computer for every user</div>
        </div>
      </div>
      <div class="sub" id="s5sub" style="font-size:34px;">More compute per task — or more users per machine.</div>
    </div>
  </div>

  <!-- SCENE 6: THE QUOTE 0:30-0:35 -->
  <div class="scene" id="sc6">
    <div class="scene-stack">
      <div class="spotlight amber" id="s6spot" style="width:820px;height:820px;margin:-410px 0 0 -410px;"></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:20px;" id="s6brands">
        <div class="brand-badge" style="width:80px;height:80px;"><div style="color:var(--indigo);width:44px;height:44px;">${openai}</div></div>
        <div class="quote-mark" id="s6mark">${I.message}</div>
        <div class="brand-badge" style="width:80px;height:80px;"><div class="grok-mark" style="font-size:32px;">grok</div></div>
      </div>
      <div class="quote-text" id="s6text">"Always-on. Browses the web like a person would. No API needed."</div>
      <div class="quote-src" id="s6src">— xAI's own launch copy for Grok Bot, Aug 2026</div>
      <div class="chip-row">${chip(I.link, 'MARKETING COPY, NOT AN INDEPENDENT REVIEW', 's6chip1', 'amber')}</div>
    </div>
  </div>

  <!-- SCENE 7: THE CATCH 0:35-0:41 -->
  <div class="scene" id="sc7">
    <div class="scene-stack">
      <div class="spotlight" id="s7spot" style="width:830px;height:830px;margin:-415px 0 0 -415px;"></div>
      <div class="eyebrow amber" id="s7eyebrow">// THE CATCH</div>
      <div class="headline" id="s7head" style="font-size:62px;">$20 sounds cheap. <span class="hi-amber">Read the fine print.</span></div>
      <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s7pulse"></div></div><div class="sig-readout"><span id="s7readout"></span><span class="sig-cursor" id="s7cursor">▌</span></div></div>
      <div class="browser-card" id="s7card">
        <div class="browser-titlebar">
          <div class="browser-dot r"></div><div class="browser-dot a"></div><div class="browser-dot g"></div>
          <div class="browser-tab">the fine print</div>
        </div>
        <div class="browser-body" style="padding-top:28px;">
          <div class="spec-row"><span class="spec-label">dots price</span><span class="spec-value indigo">$100/mo, unlimited runs</span></div>
          <div class="spec-row"><span class="spec-label">grok bot price</span><span class="spec-value amber">$20/mo — shared queue</span></div>
          <div class="spec-row"><span class="spec-label">grok bot access</span><span class="spec-value amber">bundled into X Premium+ too</span></div>
        </div>
      </div>
      <div class="chip-row">${chip(I.trendingUp, 'CHEAPER ENTRY, SLOWER TASKS AT PEAK LOAD', 's7chip1', 'amber')}</div>
    </div>
  </div>

  <!-- SCENE 8: THE PATTERN 0:41-0:47 -->
  <div class="scene" id="sc8">
    <div class="scene-stack">
      <div class="spotlight" id="s8spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      <div class="eyebrow" id="s8eyebrow">// THE PATTERN</div>
      <div class="headline" id="s8head" style="font-size:60px;">This isn't one rivalry. It's the whole industry.</div>
      <div class="signal-bridge"><div class="sig-wire"><div class="sig-pulse" id="s8pulse"></div></div><div class="sig-readout"><span id="s8readout"></span><span class="sig-cursor" id="s8cursor">▌</span></div></div>
      <div class="chip-row" style="gap:18px;" id="s8chips">
        ${chip(I.rocket, 'OPENAI → dots, an autonomous agent', 's8c1')}
        ${chip(I.puzzle, 'xAI → Grok Bot, a browsing agent', 's8c2', 'amber')}
        ${chip(I.users, 'EVERY MAJOR LAB IS RACING TO SHIP', 's8c3')}
      </div>
      <div class="sub" id="s8sub" style="font-size:34px;">The product that acts, not just answers, is the next battleground.</div>
    </div>
  </div>

  <!-- SCENE 9: THE NUMBERS (stat face-off) 0:47-0:53 -->
  <div class="scene" id="sc9">
    <div class="scene-stack">
      <div class="spotlight" id="s9spot" style="width:840px;height:840px;margin:-420px 0 0 -420px;"></div>
      <div class="eyebrow" id="s9eyebrow">// THE NUMBERS</div>
      <div class="headline" id="s9head" style="font-size:60px;">Ecosystem vs. entry price.</div>
      <div class="stat-row" id="s9row">
        <div class="stat-col" id="s9c1"><div class="stat-num" style="font-size:88px;">4,000+</div><div class="stat-lbl">apps dots can drive</div></div>
        <div class="vs-badge" id="s9vs"><span>VS</span></div>
        <div class="stat-col amber" id="s9c2"><div class="stat-num" style="font-size:88px;">$20</div><div class="stat-lbl">grok bot, flat monthly</div></div>
      </div>
      <div class="sub" id="s9sub" style="font-size:34px;">Breadth against price. Pick your battleground.</div>
      <div class="chip-row">${chip(I.arrowRight, 'DOTS: BREADTH. GROK BOT: BUDGET.', 's9chip1')}</div>
    </div>
  </div>

  <!-- SCENE 10: CTA 0:53-0:58 -->
  <div class="scene" id="sc10">
    <div class="scene-stack">
      <div class="spotlight" id="s10spot" style="width:920px;height:920px;margin:-460px 0 0 -460px;"></div>
      <div class="eyebrow" id="s10eyebrow">// FOLLOW FOR THE NEXT ONE</div>
      <div style="display:flex;align-items:flex-end;justify-content:center;gap:20px;" id="s10chars">
        <div class="human-wrap" id="s10human1" style="width:210px;height:264px;">${humanHook}</div>
        <div class="vs-badge" style="margin-bottom:56px;"><span>VS</span></div>
        <div class="human-wrap" id="s10human2" style="width:210px;height:264px;">${humanReact}</div>
      </div>
      <div class="cta-panel" id="s10card">
        <img class="cta-pic" src="data:image/jpeg;base64,${profileB64}" alt="">
        <div class="cta-main">@sandesh.explains</div>
        <div class="cta-sub">LINKEDIN /SANDESH-KALE</div>
      </div>
      <div class="chip-row">${chip(I.mapPin, 'AI AGENT NEWS, BROKEN DOWN WEEKLY', 's10chip1')}</div>
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

function sigBridge(prefix, pulseEl, readoutEl, cursorEl, text, e, sceneT){
  if(!pulseEl || !readoutEl) return;
  var ee = clamp(e,0,1);
  pulseEl.style.opacity = eoc(clamp((ee-0.05)/0.3,0,1)) * (1 - eoc(clamp((ee-0.55)/0.3,0,1)));
  pulseEl.style.top = (2 + 54*clamp((ee-0.05)/0.5,0,1)) + 'px';
  var typeE = clamp((ee-0.4)/0.5,0,1);
  var n = Math.floor(typeE * text.length);
  readoutEl.textContent = prefix + text.slice(0, n);
  if (cursorEl) cursorEl.style.opacity = (typeE < 1 || Math.floor(sceneT*2.2) % 2 === 0) ? 1 : 0;
}

var SCENES = [
  { start: 0, duration: 5, el: $('sc1'), render: function(t){
      enter($('s1eyebrow'), eoc(t/0.3), 12, 1);
      runIn($('s1human'), t/0.5, -180);
      tumbleIn($('s1vs'), (t-0.15)/0.4, 90);
      dropIn($('s1grok'), (t-0.3)/0.4, -120, 10);
      enter($('s1head'), eoc((t-0.5)/0.55), 22, 1);
      var addrE = clamp((t-1.0)/0.6, 0, 1);
      var full = 'dot.com';
      $('s1addrtext').textContent = full.slice(0, Math.floor(addrE*full.length));
      $('s1addr').style.opacity = eoc(clamp((t-0.95)/0.3,0,1));
      dropIn($('s1chip1'), (t-1.6)/0.4, -100, -8);
      dropIn($('s1chip2'), (t-1.75)/0.4, -100, 8);
  }},
  { start: 5, duration: 6, el: $('sc2'), render: function(t){
      enter($('s2eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s2head'), eoc((t-0.15)/0.5), 20, 1);
      runIn($('s2n1'), (t-0.5)/0.4, -160);
      runIn($('s2n2'), (t-0.85)/0.4, -160);
      runIn($('s2n3'), (t-1.2)/0.4, -160);
      dropIn($('s2chip1'), (t-1.9)/0.4, -100, 0);
  }},
  { start: 11, duration: 6, el: $('sc3'), render: function(t){
      enter($('s3step'), eoc(t/0.3), 12, 1);
      enter($('s3eyebrow'), eoc((t-0.1)/0.3), 12, 1);
      sigBridge('> ', $('s3pulse'), $('s3readout'), $('s3cursor'), 'resolving dot.com...', (t-0.3)/1.0, t);
      enter($('s3card'), eoc((t-0.5)/0.5), 26, 1);
      enter($('s3snap'), eoc((t-0.9)/0.4), 14, 1);
      dropIn($('s3row'), (t-1.3)/0.4, -80, 0);
      dropIn($('s3chip1'), (t-1.7)/0.4, -100, 0);
  }},
  { start: 17, duration: 6, el: $('sc4'), render: function(t){
      enter($('s4step'), eoc(t/0.3), 12, 1);
      enter($('s4eyebrow'), eoc((t-0.1)/0.3), 12, 1);
      enter($('s4head'), eoc((t-0.25)/0.5), 20, 1);
      enter($('s4card'), eoc((t-0.7)/0.5), 26, 1);
      runIn($('s4human'), (t-1.3)/0.4, 160);
  }},
  { start: 23, duration: 7, el: $('sc5'), render: function(t){
      enter($('s5step'), eoc(t/0.3), 12, 1);
      enter($('s5eyebrow'), eoc((t-0.1)/0.3), 12, 1);
      enter($('s5head'), eoc((t-0.25)/0.5), 20, 1);
      runIn($('s5col1'), (t-0.6)/0.4, -140);
      tumbleIn($('s5vs'), (t-0.9)/0.35, 90);
      runIn($('s5col2'), (t-1.05)/0.4, 140);
      enter($('s5sub'), eoc((t-1.6)/0.5), 18, 1);
  }},
  { start: 30, duration: 5, el: $('sc6'), render: function(t){
      enter($('s6brands'), eoc(t/0.4), 16, 1);
      tumbleIn($('s6mark'), t/0.4, -50);
      enter($('s6text'), eoc((t-0.3)/0.6), 22, 1);
      enter($('s6src'), eoc((t-0.9)/0.5), 14, 1);
      dropIn($('s6chip1'), (t-1.3)/0.4, -100, 0);
  }},
  { start: 35, duration: 6, el: $('sc7'), render: function(t){
      enter($('s7eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s7head'), eoc((t-0.15)/0.5), 20, 1);
      sigBridge('> ', $('s7pulse'), $('s7readout'), $('s7cursor'), 'checking the fine print...', (t-0.5)/1.0, t);
      enter($('s7card'), eoc((t-0.9)/0.5), 24, 1);
      dropIn($('s7chip1'), (t-1.4)/0.4, -100, 0);
  }},
  { start: 41, duration: 6, el: $('sc8'), render: function(t){
      enter($('s8eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s8head'), eoc((t-0.15)/0.5), 20, 1);
      sigBridge('> ', $('s8pulse'), $('s8readout'), $('s8cursor'), 'scanning the field...', (t-0.5)/1.0, t);
      dropIn($('s8c1'), (t-0.9)/0.35, -100, -8);
      dropIn($('s8c2'), (t-1.05)/0.35, -100, 0);
      dropIn($('s8c3'), (t-1.2)/0.35, -100, 8);
      enter($('s8sub'), eoc((t-1.6)/0.5), 18, 1);
  }},
  { start: 47, duration: 6, el: $('sc9'), render: function(t){
      enter($('s9eyebrow'), eoc(t/0.3), 12, 1);
      enter($('s9head'), eoc((t-0.15)/0.5), 20, 1);
      runIn($('s9c1'), (t-0.55)/0.4, -160);
      tumbleIn($('s9vs'), (t-0.85)/0.35, 90);
      runIn($('s9c2'), (t-1.0)/0.4, 160);
      enter($('s9sub'), eoc((t-1.5)/0.5), 18, 1);
      dropIn($('s9chip1'), (t-1.9)/0.4, -100, 0);
  }},
  { start: 53, duration: 5, el: $('sc10'), render: function(t){
      enter($('s10eyebrow'), eoc(t/0.3), 12, 1);
      runIn($('s10human1'), (t-0.15)/0.5, -180);
      runIn($('s10human2'), (t-0.3)/0.5, 180);
      dropIn($('s10card'), (t-0.55)/0.5, -160, 0);
      dropIn($('s10chip1'), (t-1.0)/0.4, -100, 0);
  }}
];

window.__reelDurationSec = 58.0;
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

  $('reoL').style.transform = 'translateY(' + (-(t*44) % 620) + 'px)';
  $('reoR').style.transform = 'translateY(' + ((t*36) % 620 - 620) + 'px)';

  for (var i = 0; i < 34; i++) {
    // handled server-side (static positions); tiles drift slowly via opacity pulse
  }
};

window.__autoplay = function(){
  var start = performance.now();
  function tick(){
    var t = (performance.now()-start)/1000;
    window.__seek(t);
    if (t < window.__reelDurationSec) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
};
</script>
</body></html>`;
}

main();
