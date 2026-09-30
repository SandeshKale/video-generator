#!/usr/bin/env node
// Throwaway mockup for "OpenAI's Domain Redirects to Its Rival" (dots vs
// Grok Bot). Renders 3 representative static frames for design-system
// approval. Delete once the full build.mjs supersedes this.
//
// Proposed visual system, deliberately distinct from every prior reel:
//   - Palette: cool graphite background (#15171d) + indigo (#5b6bff,
//     "dots"/OpenAI side) vs amber (#ffab2e, Grok/xAI side) duotone —
//     indigo is unused anywhere in this repo; this exact pairing is new.
//   - Texture: a low-opacity grid of drifting rounded-square "app icon"
//     tiles (t-driven diagonal drift) — representing the "4,000+ apps"
//     plugin ecosystem, a genuinely new *kind* of background motion vs.
//     every dot-grid/hex-grid/DNA-helix/jagged-line/ember-particle used
//     so far.
//   - Components: "browser window" cards — a title bar with 3 traffic-
//     light dots + a URL/address pill below — on-theme with the actual
//     story (a domain redirect), and a shape never used in this repo.
//   - Bridge: an address-bar typewriter (types a URL char by char, then
//     "redirecting..."), this reel's signal-bridge equivalent.
//   - Type: Manrope (first use in this repo) for display text.
import { chromium } from 'playwright';
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

function hash(i) { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }

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
  const [world, link, cloud, server, flame] = await Promise.all(['world', 'link', 'cloud', 'server', 'flame'].map(tablerIcon));
  const openai = await brandLogo('logos/gilbarbara/openai-icon.svg');
  const humanHook = await humaaansFull('standing', 'standing-8', { coatColor: '#5b6bff', pantColor: '#15171d' });
  const humanReact = await humaaansFull('standing', 'standing-21', { coatColor: '#ffab2e', pantColor: '#15171d', shirtColor: '#eef0f7' });

  const html = buildHtml({ icons: { world, link, cloud, server, flame }, openai, humanHook, humanReact });
  await writeFile(join(__dirname, 'mockup.html'), html, 'utf8');
  console.log('wrote mockup.html');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + join(__dirname, 'mockup.html'));
  for (const n of [1, 2, 3]) {
    await page.evaluate((n) => window.__showFrame(n), n);
    await page.screenshot({ path: join(__dirname, `mockup-${n}.png`) });
    console.log('captured frame', n);
  }
  await browser.close();
}

function appTiles() {
  let out = '';
  for (let i = 0; i < 30; i++) {
    const x = hash(i) * 1080;
    const y = hash(i + 100) * 1920;
    out += `<div class="app-tile" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;"></div>`;
  }
  return out;
}

function buildHtml({ icons: I, openai, humanHook, humanReact }) {
return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>mockup</title>
<style>
@font-face{font-family:'Manrope';font-weight:700;src:url('../assets/fonts/manrope/manrope-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Manrope';font-weight:800;src:url('../assets/fonts/manrope/manrope-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
:root{
  --bg: #15171d;
  --bg-2: #0d0e12;
  --indigo: #5b6bff;
  --amber: #ffab2e;
  --ink: #eef0f7;
  --ink-dim: #9aa0b4;
}
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}

.bg-texture{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
.bg-wash{position:absolute;inset:0;background:
  radial-gradient(ellipse 900px 700px at 22% 18%, rgba(91,107,255,0.14), transparent 60%),
  radial-gradient(ellipse 900px 900px at 82% 78%, rgba(255,171,46,0.10), transparent 60%),
  var(--bg);}
.app-tile{position:absolute;width:34px;height:34px;border-radius:9px;background:rgba(238,240,247,0.05);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 40%, rgba(0,0,0,0.6) 100%);}

.safe{position:absolute;top:224px;left:190px;right:190px;bottom:400px;z-index:2;}
.frame{position:absolute;inset:0;display:none;flex-direction:column;align-items:stretch;padding:0 44px;box-sizing:border-box;}
.frame.active{display:flex;}
.band-content{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;position:relative;}
.band-tight{flex:0.62 1 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--indigo);text-transform:uppercase;text-align:center;width:100%;}
.eyebrow.amber{color:var(--amber);}
.headline{font-family:'Manrope',sans-serif;font-weight:800;font-size:76px;line-height:1.1;letter-spacing:-0.02em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.7);text-align:center;width:100%;}
.headline .hi-indigo{color:var(--indigo);}
.headline .hi-amber{color:var(--amber);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:38px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);text-align:center;width:100%;}

/* Browser-window card: title bar + traffic-light dots + URL pill —
   this reel's card language, on-theme with the domain-redirect story. */
.browser-card{width:100%;max-width:800px;border-radius:16px;overflow:hidden;background:#1b1e27;
  box-shadow:0 1px 2px rgba(0,0,0,.4), 0 20px 50px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,0.06);}
.browser-titlebar{height:52px;display:flex;align-items:center;gap:10px;padding:0 20px;background:#22262f;}
.browser-dot{width:13px;height:13px;border-radius:50%;}
.browser-dot.r{background:#ff5f57;} .browser-dot.a{background:#febc2e;} .browser-dot.g{background:#28c840;}
.browser-tab{margin-left:16px;font-family:'JBMono',monospace;font-size:20px;color:var(--ink-dim);}
.browser-urlrow{display:flex;align-items:center;gap:12px;padding:18px 22px;background:#191c24;}
.browser-urlpill{flex:1;display:flex;align-items:center;gap:10px;background:#0d0e12;border-radius:20px;padding:12px 22px;font-family:'JBMono',monospace;font-size:26px;color:var(--ink);}
.icon-sz{display:inline-flex;flex:0 0 auto;}
.icon-sz svg{width:100%;height:100%;}
.browser-urlpill .icon-sz{width:22px;height:22px;color:var(--ink-dim);}
.browser-urlpill .icon-sz svg{width:100%;height:100%;}
.browser-body{padding:36px 34px 42px;display:flex;flex-direction:column;align-items:center;gap:16px;}

.redirect-arrow{display:flex;align-items:center;justify-content:center;gap:14px;width:100%;}
.redirect-arrow .icon-sz{width:44px;height:44px;color:var(--amber);}
.redirect-arrow .icon-sz svg{width:100%;height:100%;}

.brand-badge{width:100px;height:100px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);}
.brand-badge svg{width:56px;height:56px;color:var(--ink);}
.grok-mark{font-family:'Manrope',sans-serif;font-weight:800;font-size:44px;color:var(--amber);letter-spacing:-0.02em;}

/* Spec ticket rows */
.spec-row{display:flex;justify-content:space-between;align-items:center;width:100%;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.08);}
.spec-row:last-child{border-bottom:none;}
.spec-label{font-family:'JBMono',monospace;font-size:22px;color:var(--ink-dim);text-transform:uppercase;letter-spacing:0.04em;}
.spec-value{font-family:'Manrope',sans-serif;font-weight:800;font-size:28px;color:var(--ink);}
.spec-value.indigo{color:var(--indigo);}
.spec-value.amber{color:var(--amber);}

.addr-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 0;}
.addr-pill{display:flex;align-items:center;gap:10px;background:#0d0e12;border-radius:20px;padding:12px 26px;font-family:'JBMono',monospace;font-size:24px;color:var(--ink);box-shadow:inset 0 0 0 1.5px rgba(91,107,255,0.35);}
.addr-pill .icon-sz{width:22px;height:22px;color:var(--indigo);}
.addr-pill .icon-sz svg{width:100%;height:100%;}
.addr-cursor{color:var(--indigo);font-weight:700;}

.human-wrap{width:230px;height:290px;filter:drop-shadow(0 16px 26px rgba(0,0,0,.5));}
.human-wrap svg{width:100%;height:100%;}

/* Fake "screenshot" landing-page panel — a stylized, clearly-a-mockup
   representation of a portal page (never claimed as a real captured
   screenshot), sitting inside the browser body for authenticity. */
.snap{width:100%;background:#0d0e12;border-radius:10px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.06);}
.snap-nav{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06);}
.snap-nav .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.18);}
.snap-nav .navlabel{margin-left:auto;font-family:'JBMono',monospace;font-size:16px;color:var(--ink-dim);}
.snap-hero{padding:30px 26px 34px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;}
.snap-hero h3{margin:0;font-family:'Manrope',sans-serif;font-weight:800;font-size:34px;color:var(--ink);}
.snap-hero p{margin:0;font-family:'Inter',sans-serif;font-size:19px;color:var(--ink-dim);}
.snap-pill{display:inline-block;font-family:'JBMono',monospace;font-weight:700;font-size:18px;color:#0d0e12;background:var(--amber);padding:8px 20px;border-radius:16px;}

.chip{display:inline-flex;align-items:center;gap:12px;font-family:'JBMono',monospace;font-weight:700;font-size:22px;color:var(--ink);padding:14px 24px;border-radius:14px;
  background:rgba(91,107,255,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.3), inset 0 0 0 1.5px rgba(91,107,255,0.35);}
.chip.amber{background:rgba(255,171,46,0.1);box-shadow:0 1px 2px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.3), inset 0 0 0 1.5px rgba(255,171,46,0.4);color:var(--amber);}
.chip-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;width:100%;}
</style></head>
<body>
<div class="bg-texture">
  <div class="bg-wash"></div>
  ${appTiles()}
  <div class="vignette"></div>
</div>

<div class="safe">

  <!-- FRAME 1: hook -->
  <div class="frame" id="f1">
    <div class="band-tight">
      <div class="eyebrow">// THE AGENT ARMS RACE</div>
      <div class="human-wrap" style="margin:0 auto;">${humanHook}</div>
    </div>
    <div class="band-content">
      <div class="headline" style="font-size:66px;">OpenAI just launched its biggest AI agent. Its own <span class="hi-amber">domain</span> sends you to the competition.</div>
      <div class="addr-bridge">
        <div class="addr-pill"><span class="icon-sz">${I.link}</span><span>dot.com</span><span class="addr-cursor">▌</span></div>
      </div>
    </div>
    <div class="band-tight">
      <div class="chip-row">
        <div class="chip amber"><span class="icon-sz" style="width:22px;height:22px;">${I.flame}</span><span>SEPT 29, 2026</span></div>
      </div>
    </div>
  </div>

  <!-- FRAME 2: the redirect reveal -->
  <div class="frame" id="f2">
    <div class="band-tight">
      <div class="eyebrow amber">// THE REVEAL</div>
      <div class="sub" style="font-size:30px;">Whois records show the transfer happened in July — months before DevDay.</div>
    </div>
    <div class="band-content" style="gap:18px;">
      <div class="browser-card">
        <div class="browser-titlebar">
          <div class="browser-dot r"></div><div class="browser-dot a"></div><div class="browser-dot g"></div>
          <div class="browser-tab">dot.com</div>
        </div>
        <div class="browser-urlrow">
          <div class="browser-urlpill"><span class="icon-sz">${I.link}</span><span>dot.com</span></div>
        </div>
        <div class="browser-body" style="gap:20px;">
          <div class="snap">
            <div class="snap-nav"><div class="dot"></div><div class="dot"></div><div class="dot"></div><span class="navlabel">grok.com/bot</span></div>
            <div class="snap-hero">
              <h3>Meet Grok <span style="color:var(--amber);">Bot</span></h3>
              <p>Always-on. Browses like a person. No API needed.</p>
              <span class="snap-pill">$20 / month</span>
            </div>
          </div>
          <div class="redirect-arrow">
            <div class="brand-badge" style="width:70px;height:70px;"><div style="color:var(--indigo);width:40px;height:40px;">${openai}</div></div>
            <span class="icon-sz">${I.link}</span>
            <div class="brand-badge" style="width:70px;height:70px;"><div class="grok-mark" style="font-size:30px;">grok</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="band-tight">
      <div class="human-wrap" style="width:190px;height:240px;margin:0 auto;">${humanReact}</div>
    </div>
  </div>

  <!-- FRAME 3: spec comparison -->
  <div class="frame" id="f3">
    <div class="band-tight">
      <div class="eyebrow">// HEAD TO HEAD</div>
      <div class="headline" style="font-size:58px;">Two agents. <span class="hi-indigo">One</span> launched six weeks after the <span class="hi-amber">other.</span></div>
    </div>
    <div class="band-content">
      <div class="browser-card">
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
    </div>
    <div class="band-tight">
      <div style="display:flex;align-items:flex-end;justify-content:center;gap:36px;">
        <div class="human-wrap" style="width:170px;height:214px;">${humanHook}</div>
        <div class="human-wrap" style="width:170px;height:214px;">${humanReact}</div>
      </div>
    </div>
  </div>

</div>

<script>
function $(id){ return document.getElementById(id); }
window.__showFrame = function(n){
  [1,2,3].forEach(function(i){ $('f'+i).classList.toggle('active', i===n); });
};
window.__showFrame(1);
</script>
</body></html>`;
}

main();
