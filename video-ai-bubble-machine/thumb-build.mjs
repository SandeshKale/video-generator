#!/usr/bin/env node
// YouTube thumbnail (1280x720) in the video's own visual system — a purpose-built composition
// (money-loop ring + giant number), not a frame grab.
import { writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { FONT_FACES, BASE_CSS } from './lib.mjs';
import { webAssets } from './scenes/web.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ctxStub = { mono: (await import('./lib.mjs')).brandMono, logo: (await import('./lib.mjs')).logoAsIs };
const logos = await webAssets(ctxStub);
const R = 235, CX = 930, CY = 372;
const nodes = [
  { a: -90, bg: '#2a1844', fg: '#f4efe6', html: `<div style="width:92px;height:92px;color:#f4efe6">${logos.openai}</div>` },
  { a: 0, bg: '#f4efe6', fg: '#1a0f26', html: `<div style="width:130px;height:92px">${logos.nvidia}</div>` },
  { a: 90, bg: '#ffc53d', fg: '#1a0f26', html: `<div class="wm" style="font-size:38px;color:#1a0f26">ORACLE</div>` },
  { a: 180, bg: '#35f2b0', fg: '#1a0f26', html: `<div class="wm" style="font-size:76px;color:#1a0f26">CW</div>` },
];
const nodeHtml = nodes.map((n) => {
  const x = CX + R * Math.cos((n.a * Math.PI) / 180), y = CY + R * Math.sin((n.a * Math.PI) / 180);
  return `<div class="card" style="left:${x - 98}px;top:${y - 66}px;width:196px;height:132px;background:${n.bg};display:flex;align-items:center;justify-content:center;border-width:5px;box-shadow:8px 8px 0 #0c0614;">${n.html}</div>`;
}).join('');
const coins = [20, 110, 200, 290].map((a) => {
  const x = CX + R * Math.cos((a * Math.PI) / 180), y = CY + R * Math.sin((a * Math.PI) / 180);
  return `<div style="position:absolute;left:${x - 24}px;top:${y - 24}px;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a8,#ffc53d 55%,#c98a00);border:5px solid #0c0614;box-shadow:0 5px 0 #0c0614;font:800 28px Bricolage;color:#6b4a00;display:flex;align-items:center;justify-content:center;">$</div>`;
}).join('');
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${FONT_FACES.replace(/\.\.\/\.\.\/assets/g, '../assets')}${BASE_CSS}
html,body{width:1280px;height:720px;}#world{width:1280px;height:720px;}
.big{position:absolute;}
</style></head><body><div id="world">
<div id="bg"><div id="bgwash" style="background:radial-gradient(ellipse 1000px 650px at 60% 50%,#2c1750 0%,#130a1f 75%)"></div><div id="iso"></div>
<div class="glow" style="left:760px;top:60px;width:700px;height:600px;background:radial-gradient(closest-side,rgba(255,93,77,.5),transparent)"></div>
<div class="glow" style="left:-200px;top:-100px;width:700px;height:600px;background:radial-gradient(closest-side,rgba(53,242,176,.45),transparent)"></div></div>
<svg style="position:absolute;left:0;top:0" width="1280" height="720"><circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#f4efe6" stroke-opacity=".55" stroke-width="6" stroke-dasharray="3 18" stroke-linecap="round"/></svg>
${coins}${nodeHtml}
<div class="abs big" style="left:${CX - 120}px;top:${CY - 118}px;width:240px;text-align:center;font-size:250px;color:#ffc53d;text-shadow:0 12px 0 #0c0614;line-height:1;">?</div>
<div class="abs big" style="left:52px;top:36px;font-size:210px;color:#f4efe6;text-shadow:0 12px 0 #0c0614;line-height:.95;"><span style="color:#35f2b0">$</span>1.15<span style="color:#35f2b0">T</span></div>
<div class="abs big" style="left:58px;top:262px;font-size:92px;color:#f4efe6;text-shadow:0 8px 0 #0c0614;line-height:.98;">THE AI<br>BUBBLE<br><span style="color:#ff5d4d">MACHINE</span></div>
<div class="pill coral" style="left:58px;top:600px;font-size:30px;padding:14px 30px;rotate:-2deg;">IT'S A CIRCLE. FOLLOW THE MONEY.</div>
</div></body></html>`;
await writeFile(join(__dirname, 'parts', 'thumb.html'), html, 'utf8');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('file://' + join(__dirname, 'parts', 'thumb.html')); await page.waitForTimeout(500);
await page.screenshot({ path: join(__dirname, 'thumbnail.png') });
await browser.close(); console.log('thumbnail.png written');
