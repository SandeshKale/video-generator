// Builds deliverables/printable-list-A5.pdf and printable-list-phone.pdf ("Tonight's 5-minute list") from one HTML template.
// Run: bun printable-build.mjs   (from this folder). Fonts are the reel's own (Instrument Serif, Manrope 800, Martian Mono).
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = path.resolve('deliverables'); fs.mkdirSync(D, { recursive: true });
const F = (n) => pathToFileURL(path.resolve('site/fonts/' + n)).href;
const rows = Array.from({ length: 8 }, (_, i) => `<div class="row"><span class="n">${i + 1}</span><span class="task"></span><span class="act"></span></div>`).join('');
const html = (w, h, scale) => `<!doctype html><html><head><meta charset="utf8"><style>
@font-face{font-family:Ser;font-style:italic;src:url(${F('instrument-serif-latin-400-italic.woff2')})}
@font-face{font-family:Man;font-weight:800;src:url(${F('manrope-latin-800-normal.woff2')})}
@font-face{font-family:Mar;font-weight:500;src:url(${F('martian-mono-latin-500-normal.woff2')})}
@page{size:${w} ${h};margin:0} *{box-sizing:border-box} html,body{margin:0;width:${w};height:${h}}
body{background:#f4ecd8;color:#101a1a;font-family:Man;padding:${9 * scale}mm ${9 * scale}mm;display:flex;flex-direction:column}
.eye{font:500 ${2.8 * scale}mm Mar;letter-spacing:.14em;color:#ff7a1a}
h1{font:800 ${10 * scale}mm/1 Man;letter-spacing:-.03em;margin:${2 * scale}mm 0 ${1 * scale}mm}
h1 i{font:italic 400 ${11 * scale}mm Ser;color:#0d2b2a}
.sub{font:italic 400 ${4.6 * scale}mm Ser;color:#4b4a3c;margin-bottom:${4 * scale}mm}
.steps{display:flex;gap:${2.4 * scale}mm;margin-bottom:${4 * scale}mm}
.step{flex:1;background:#0d2b2a;color:#f4ecd8;border-radius:${3 * scale}mm;padding:${3 * scale}mm}
.step b{display:block;font:500 ${2.6 * scale}mm Mar;color:#8ef0c8;letter-spacing:.1em;margin-bottom:1mm}
.step span{font:800 ${3.6 * scale}mm/1.15 Man}
.head{display:grid;grid-template-columns:${7 * scale}mm 1fr 1fr;gap:${2 * scale}mm;font:500 ${2.5 * scale}mm Mar;letter-spacing:.1em;color:#6b5a3e;padding-bottom:1.2mm;border-bottom:.4mm solid #101a1a}
.row{display:grid;grid-template-columns:${7 * scale}mm 1fr 1fr;gap:${2 * scale}mm;align-items:end;height:${13.4 * scale}mm;border-bottom:.25mm dashed rgba(16,26,26,.35)}
.n{font:800 ${4 * scale}mm Man;color:#ff7a1a}.task,.act{border-bottom:0}
.act{background:linear-gradient(transparent 0,transparent 0)}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:end;font:500 ${2.4 * scale}mm Mar;color:#6b5a3e}
.foot b{font:800 ${4 * scale}mm Man;color:#101a1a}.note{max-width:62%;line-height:1.5}
</style></head><body>
<div class="eye">HACK ZONE · TONIGHT</div><h1>Tonight's <i>5-minute</i> list</h1><div class="sub">Pen and paper. Everything you still need to do. Make each one specific.</div>
<div class="steps"><div class="step"><b>1 · PEN + PAPER</b><span>Five minutes. Phone away.</span></div><div class="step"><b>2 · WRITE EVERYTHING</b><span>Every open loop, as it comes.</span></div><div class="step"><b>3 · BE SPECIFIC</b><span>Not "taxes": "call the accountant, 10 am".</span></div></div>
<div class="head"><span>#</span><span>WHAT'S STILL OPEN</span><span>NEXT ACTION (WHO · WHEN)</span></div>${rows}
<div class="foot"><div class="note">One small lab study (57 healthy adults, 18–30): writing a to-do list before bed was linked to falling asleep faster than listing what you'd already done. Not medical advice. Source: Scullin et al., J Exp Psychol Gen 2018.</div><div><b>@sandesh_explains</b></div></div>
</body></html>`;
const b = await chromium.launch({ args: ['--no-sandbox'] });
for (const [name, w, h, scale] of [['A5', '148mm', '210mm', 1], ['phone', '90mm', '160mm', .62]]) {
  const hf = `${D}/_${name}.html`; fs.writeFileSync(hf, html(w, h, scale)); const p = await b.newPage({ viewport: { width: Math.round(parseFloat(w) * 3.78), height: Math.round(parseFloat(h) * 3.78) } }); await p.goto(pathToFileURL(hf).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.pdf({ path: `${D}/printable-list-${name}.pdf`, width: w, height: h, printBackground: true, preferCSSPageSize: true });
  await p.screenshot({ path: `${D}/printable-list-${name}.png` }); await p.close(); fs.unlinkSync(hf);
}
await b.close(); console.log('ok');
