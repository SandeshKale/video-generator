#!/usr/bin/env node
// Design-approval mockup for "An AI Just Found Something No Human Has Ever
// Seen" (Anthropic's AI biology lab CRISPR-like discovery) — a new
// "Bio Lab" visual system, deliberately distinct from every prior reel:
//   - rundown-ios: navy bg, green/blue/amber, dot-grid+hatch, rounded cards
//   - loop-method: near-black bg, cyan/magenta, graph-grid+scanline, clip-corner panels
//   - price-war: plum bg, lime/coral, ticker-tape+candlesticks, ticket-stub cards
//   - muse-takeover: espresso-charcoal bg, amber/violet, ripple+waveform, chat-bubble cards
//   - pro-max: cool near-black, silver/crimson, price-staircase, notched price-tags
//   - THIS: deep teal-black bg, bioluminescent green + violet duotone, a
//     drifting DNA-double-helix gutter + hex-grid "petri dish" texture,
//     hexagonal clip-path cards, Outfit display font (new to this repo).
//
// This mockup also tests using a REAL vendored photo (never used in a reel
// before — see assets/photos/servicestack/) as a duotoned hero background
// for the hook/CTA scenes: a concentric-rings architecture shot that reads
// as "looking down a microscope / a portal into the unknown" once tinted
// to the reel's green/violet palette.
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
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
html,body{margin:0;padding:0;width:1080px;background:var(--bg);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.scene{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--bg);}

/* ---- photo hero: the concentric-rings shot, duotoned to the palette ---- */
.photo-hero{position:absolute;inset:0;z-index:0;}
.photo-hero img{position:absolute;top:50%;left:50%;height:1920px;width:auto;transform:translate(-50%,-50%);filter:grayscale(1) contrast(1.15) brightness(0.62);}
.photo-duo{position:absolute;inset:0;background:linear-gradient(135deg, rgba(61,255,176,0.62), rgba(178,107,255,0.58));mix-blend-mode:color;}
.photo-scrim{position:absolute;inset:0;background:linear-gradient(180deg, rgba(3,9,7,0.35) 0%, rgba(3,9,7,0.55) 55%, rgba(3,9,7,0.94) 100%);}

/* ---- CSS/SVG texture (non-photo scenes): hex-grid + DNA-helix gutters ---- */
.bg-hexgrid{position:absolute;inset:0;z-index:0;opacity:0.5;background-image:
  radial-gradient(ellipse 900px 700px at 22% 18%, rgba(178,107,255,0.10), transparent 60%),
  radial-gradient(ellipse 900px 900px at 82% 78%, rgba(61,255,176,0.10), transparent 60%),
  var(--bg);}
.hexgrid-svg{position:absolute;inset:0;z-index:0;opacity:0.28;}
.helix-gutter{position:absolute;top:150px;bottom:400px;width:120px;z-index:0;opacity:0.55;}
.helix-gutter.left{left:36px;}
.helix-gutter.right{right:36px;transform:scaleX(-1);}
.vignette{position:absolute;inset:0;z-index:1;background:radial-gradient(ellipse 900px 1500px at 50% 42%, transparent 42%, rgba(0,0,0,0.55) 100%);pointer-events:none;}

.safe{position:absolute;left:0;right:0;top:224px;bottom:400px;display:flex;flex-direction:column;z-index:2;padding:0 72px;box-sizing:border-box;align-items:center;text-align:center;}

.eyebrow{font-family:'JBMono',monospace;font-weight:700;font-size:28px;letter-spacing:0.14em;color:var(--bio-green);text-transform:uppercase;}
.headline{font-family:'Outfit',sans-serif;font-weight:800;font-size:76px;line-height:1.14;letter-spacing:-0.01em;color:var(--ink);text-shadow:0 6px 20px rgba(0,0,0,.65);margin:22px 0;}
.headline .hi-green{color:var(--bio-green);}
.headline .hi-violet{color:var(--bio-violet);}
.sub{font-family:'Inter',sans-serif;font-weight:600;font-size:40px;line-height:1.4;color:var(--ink-dim);text-shadow:0 3px 10px rgba(0,0,0,.5);}

/* ---- hex "petri" card: this reel's card/chip language ---- */
.petri{position:relative;background:rgba(255,255,255,0.05);border:1.5px solid rgba(61,255,176,0.32);padding:34px 40px;margin:14px 0;width:100%;max-width:760px;box-sizing:border-box;
  clip-path:polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%);}
.petri.violet{border-color:rgba(178,107,255,0.4);}
.petri-label{font-family:'JBMono',monospace;font-weight:700;font-size:26px;letter-spacing:0.06em;color:var(--bio-green);text-transform:uppercase;}
.petri-body{font-family:'Inter',sans-serif;font-weight:600;font-size:34px;color:var(--ink);margin-top:10px;line-height:1.3;}

.helix-bridge{width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;z-index:1;position:relative;padding:8px 0;}
.hb-rungs{position:relative;width:64px;height:58px;}
.hb-readout{font-family:'JBMono',monospace;font-weight:500;font-size:27px;color:#d6f5e8;letter-spacing:0.01em;min-height:36px;}

.cta-card{padding:50px 56px;display:flex;flex-direction:column;align-items:center;gap:20px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(61,255,176,0.35);position:relative;
  clip-path:polygon(6% 0%, 94% 0%, 100% 50%, 94% 100%, 6% 100%, 0% 50%);}
.cta-pic{width:150px;height:150px;border-radius:50%;object-fit:cover;border:3px solid var(--bio-green);box-shadow:0 0 28px rgba(61,255,176,0.5);}
.cta-main{font-family:'Outfit',sans-serif;color:var(--ink);font-size:48px;font-weight:800;letter-spacing:-0.01em;}
.cta-sub{font-family:'JBMono',monospace;color:var(--bio-green);font-size:24px;font-weight:500;letter-spacing:0.02em;}
</style></head>
<body>

<!-- ============ SCENE 1 — HOOK (concentric-rings photo hero) ============ -->
<div class="scene" id="scene1">
  <div class="photo-hero">
    <img src="../assets/photos/servicestack/photo-1427087302890-2f05ee3bee12.jpg" alt="">
    <div class="photo-duo"></div>
    <div class="photo-scrim"></div>
  </div>
  <div class="vignette"></div>
  <div class="safe">
    <div class="eyebrow">// AI BIOLOGY WATCH</div>
    <div class="headline">An AI just found something <span class="hi-green">no human</span> has ever seen.</div>
    <div class="sub">Even its creators don't know what it does yet.</div>
  </div>
</div>

<!-- ============ SCENE 4 — THE FIND (CSS/SVG texture, hex petri card) ============ -->
<div class="scene" id="scene4">
  <div class="bg-hexgrid"></div>
  <svg class="hexgrid-svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hexpat" width="96" height="166" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
        <polygon points="48,0 96,28 96,83 48,111 0,83 0,28" fill="none" stroke="rgba(61,255,176,0.35)" stroke-width="1.5"/>
        <polygon points="48,111 96,139 96,194 48,222 0,194 0,139" fill="none" stroke="rgba(178,107,255,0.28)" stroke-width="1.5"/>
      </pattern>
    </defs>
    <rect width="1080" height="1920" fill="url(#hexpat)"/>
  </svg>
  <svg class="helix-gutter left" viewBox="0 0 120 1370" xmlns="http://www.w3.org/2000/svg">
    <path d="M20,0 C90,85 10,170 80,255 C90,340 10,425 80,510 C90,595 10,680 80,765 C90,850 10,935 80,1020 C90,1105 10,1190 80,1275 C90,1360 10,1370 80,1370" fill="none" stroke="var(--bio-green)" stroke-width="3"/>
    <path d="M80,0 C10,85 90,170 20,255 C10,340 90,425 20,510 C10,595 90,680 20,765 C10,850 90,935 20,1020 C10,1105 90,1190 20,1275 C10,1360 90,1370 20,1370" fill="none" stroke="var(--bio-violet)" stroke-width="3"/>
    ${[...Array(11)].map((_, i) => `<line x1="20" y1="${i * 130 + 10}" x2="80" y2="${i * 130 + 10}" stroke="rgba(234,255,245,0.35)" stroke-width="2"/>`).join('')}
  </svg>
  <div class="vignette"></div>
  <div class="safe">
    <div class="eyebrow">// THE FIND</div>
    <div class="headline" style="font-size:64px;">A pattern <span class="hi-violet">nobody</span> had flagged before.</div>
    <div class="helix-bridge">
      <div class="hb-readout">&gt; scanning viral DNA for anomalies...</div>
    </div>
    <div class="petri">
      <div class="petri-label">Anomaly detected</div>
      <div class="petri-body">A CRISPR-like repeat array, paired with an unfamiliar enzyme.</div>
    </div>
    <div class="petri violet">
      <div class="petri-label" style="color:var(--bio-violet);">Anthropic calls it</div>
      <div class="petri-body">"ART" — a possible new gene editor.</div>
    </div>
  </div>
</div>

<!-- ============ SCENE 10 — CTA (concentric-rings photo hero) ============ -->
<div class="scene" id="scene10">
  <div class="photo-hero">
    <img src="../assets/photos/servicestack/photo-1427087302890-2f05ee3bee12.jpg" alt="">
    <div class="photo-duo"></div>
    <div class="photo-scrim"></div>
  </div>
  <div class="vignette"></div>
  <div class="safe" style="justify-content:center;">
    <div class="eyebrow">// FOLLOW FOR MORE</div>
    <div class="cta-card">
      <div class="cta-main">@sandesh.explains</div>
      <div class="cta-sub">AI NEWS THAT ACTUALLY CHANGES HOW YOU BUILD</div>
    </div>
  </div>
</div>

</body></html>`;

await writeFile(join(__dirname, 'mockup.html'), html, 'utf8');
console.log('wrote mockup.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(__dirname, 'mockup.html')}`);
await page.waitForTimeout(300);

for (const id of ['scene1', 'scene4', 'scene10']) {
  await page.evaluate((sceneId) => {
    for (const el of document.querySelectorAll('.scene')) el.style.display = 'none';
    document.getElementById(sceneId).style.display = 'block';
  }, id);
  await page.screenshot({ path: join(__dirname, `mockup-${id}.png`) });
  console.log(`wrote mockup-${id}.png`);
}
await browser.close();
