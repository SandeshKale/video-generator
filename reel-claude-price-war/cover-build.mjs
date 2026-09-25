#!/usr/bin/env node
// Purpose-built cover/thumbnail for "The Price Cut That Didn't Matter" —
// not a frame grab from the video. Same "Market Ticker" visual system
// (Sora/Inter/JetBrains Mono, plum/lime/coral, candlestick+ticker texture,
// ticket-stub language) but its own composition: a diverging price-chart
// duel (OpenAI trending down, Claude trending up) that appears nowhere in
// the reel's actual scenes.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);
async function read(p) { return readFile(p, 'utf8'); }

async function brandLogo(path) {
  const src = await read(A(path));
  const inner = src.match(/<svg[^>]*viewBox="([^"]+)"[\s\S]*?<g[^>]*>([\s\S]*)<\/g>\s*<\/svg>/);
  return `<svg viewBox="${inner[1]}" fill="currentColor">${inner[2].replace(/ fill="#[0-9a-fA-F]{3,6}"/g, '')}</svg>`;
}

const [anthropic, openai] = await Promise.all([
  brandLogo('logos/gilbarbara/anthropic-icon.svg'),
  brandLogo('logos/gilbarbara/openai-icon.svg'),
]);
const profileB64 = (await read('/tmp/pic_b64.txt')).trim();

// Diverging duel chart: two polylines from a shared origin near center,
// one dropping to the lower-left (OpenAI, -50%), one climbing to the
// upper-right (Claude, winning) — a dramatic "fork" shape that never
// appears in the reel itself (the reel only shows small side-by-side
// badges and flat candlesticks, never a big diverging trend duel).
const cx = 340, cy = 460;
const downPath = `M ${cx} ${cy} L ${cx - 60} ${cy + 70} L ${cx - 40} ${cy + 130} L ${cx - 110} ${cy + 230} L ${cx - 90} ${cy + 300} L ${cx - 170} ${cy + 400}`;
const upPath = `M ${cx} ${cy} L ${cx + 90} ${cy - 40} L ${cx + 70} ${cy - 100} L ${cx + 160} ${cy - 170} L ${cx + 140} ${cy - 250} L ${cx + 230} ${cy - 330}`;

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:'Sora';font-weight:700;src:url('../assets/fonts/sora/sora-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Sora';font-weight:800;src:url('../assets/fonts/sora/sora-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}

:root{ --plum:#1b0f24; --lime:#c6ff3d; --coral:#ff5d3a; --ink:#f3ecf7; --ink-dim:#b7a8c4; }
html,body{margin:0;padding:0;width:1080px;height:1920px;background:var(--plum);overflow:hidden;font-family:'Inter',sans-serif;color:var(--ink);}
.frame{position:relative;width:1080px;height:1920px;overflow:hidden;background:
  radial-gradient(ellipse 900px 700px at 22% 30%, rgba(255,93,58,0.10), transparent 60%),
  radial-gradient(ellipse 900px 800px at 78% 22%, rgba(198,255,61,0.12), transparent 60%),
  var(--plum);}
.grid-lines{position:absolute;inset:0;opacity:0.5;background-image:
  repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 96px),
  repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 96px);}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 900px 1500px at 50% 40%, transparent 42%, rgba(0,0,0,0.6) 100%);}

.eyebrow{position:absolute;top:132px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:0.16em;color:var(--lime);}

.chart-wrap{position:absolute;top:170px;left:0;width:1080px;height:830px;}
.chart-wrap svg{width:100%;height:100%;overflow:visible;}
.badge{position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;}
.badge svg{width:62px;height:62px;color:var(--ink);}
.badge.lose{border:2.5px solid var(--coral);opacity:0.7;}
.badge.win{border:2.5px solid var(--lime);box-shadow:0 0 34px rgba(198,255,61,0.5);}
.badge-tag{position:absolute;font-family:'JBMono',monospace;font-weight:700;font-size:28px;padding:8px 18px;border-radius:4px;white-space:nowrap;}
.badge-tag.lose{background:var(--coral);color:#3a0f04;}
.badge-tag.win{background:var(--lime);color:#12210a;}

.title{position:absolute;top:1030px;left:0;right:0;text-align:center;font-family:'Sora',sans-serif;font-weight:800;color:var(--ink);font-size:96px;line-height:1.04;letter-spacing:-0.025em;text-shadow:0 6px 20px rgba(0,0,0,.7);padding:0 60px;box-sizing:border-box;}
.title .hi{color:var(--coral);}
.subtitle{position:absolute;top:1330px;left:60px;right:60px;text-align:center;font-family:'Inter',sans-serif;font-weight:600;font-size:42px;color:var(--ink-dim);line-height:1.35;}
.structure{position:absolute;top:1470px;left:0;right:0;text-align:center;font-family:'JBMono',monospace;font-weight:700;font-size:32px;letter-spacing:0.05em;color:var(--lime);}
.structure .sep{color:#5c4d6b;margin:0 10px;}

.brand{position:absolute;bottom:150px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:24px;}
.brand img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--lime);box-shadow:0 0 24px rgba(198,255,61,0.5);}
.brand .handle{font-family:'Sora',sans-serif;font-weight:700;font-size:40px;color:var(--ink);}
</style></head>
<body>
<div class="frame">
  <div class="grid-lines"></div>
  <div class="eyebrow">// AI MARKET WATCH <span style="color:var(--coral);">·</span> PRICE WAR</div>

  <div class="chart-wrap">
    <svg viewBox="0 0 1080 830">
      <path d="${downPath}" fill="none" stroke="var(--coral)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      <path d="${upPath}" fill="none" stroke="var(--lime)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
      <circle cx="340" cy="460" r="10" fill="var(--ink)"/>
    </svg>
    <div class="badge lose" style="left:110px;top:790px;">${openai}</div>
    <div class="badge-tag lose" style="left:120px;top:730px;">-50%</div>
    <div class="badge win" style="left:800px;top:60px;">${anthropic}</div>
    <div class="badge-tag win" style="left:790px;top:190px;">WINNING</div>
  </div>

  <div class="vignette"></div>
  <div class="title">THE PRICE CUT THAT <span class="hi">DIDN'T MATTER</span></div>
  <div class="subtitle">OpenAI cut prices 50%. Developers went back to Claude anyway.</div>
  <div class="structure">CHEAPER <span class="sep">≠</span> BETTER</div>
  <div class="brand"><img src="data:image/jpeg;base64,${profileB64}" alt=""><div class="handle">@sandesh.explains</div></div>
</div>
</body></html>`;

await writeFile(join(__dirname, 'cover.html'), html, 'utf8');
console.log('wrote cover.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(__dirname, 'cover.html')}`);
await page.waitForTimeout(300);
await page.screenshot({ path: join(__dirname, 'cover.png') });
await browser.close();
console.log('wrote cover.png');
