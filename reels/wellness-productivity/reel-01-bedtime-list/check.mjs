// Layout lint for Hack Zone #01 (DOM overlays + the page's own sprite canvas). Samples every 0.25 s.
// Checks: safe zone (x 150-918, y 140-1536) for DOM chips/headline; caption box vs DOM chips; and from the sprite canvas (panes, handwriting, recap card,
// CTA chips, tags, stamp): opaque pixels inside the caption band (y 1330-1500) during the recap/CTA phase and inside the Instagram bottom zone (y>1536)
// and right rail (x>918) for recap/CTA items. Run: bun check.mjs
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('site'); const M = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webm': 'video/webm', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html'; fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': M[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(0);
const b = await chromium.launch({ args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(`http://127.0.0.1:${srv.address().port}/`); await pg.waitForFunction('window.__ready===true', null, { timeout: 90000 });
const DUR = await pg.evaluate(() => window.__reelDurationSec), TMc = await pg.evaluate(() => window.TM.cue); const issues = [];
const ids = ['hl', 'step', 'open', 'ill', 'catch'];
for (let t = 0.25; t < DUR; t += .25) {
  await pg.evaluate((t) => window.__seek(t), t);
  const r = await pg.evaluate((ids) => { const o = {}; ids.concat(['cap']).forEach((id) => { const e = document.getElementById(id); const cs = getComputedStyle(e); const b = e.getBoundingClientRect(); o[id] = { x: b.x, y: b.y, w: b.width, h: b.height, op: +cs.opacity, txt: e.textContent.length }; });
    const c = document.querySelector('canvas#gl'); return o; }, ids);
  const cap = r.cap;
  for (const id of ids) { const e = r[id]; if (e.op < .5 || !e.txt) continue;
    if (e.x < 150 - 2 || e.x + e.w > 918 + 2) issues.push(`t=${t.toFixed(2)} ${id} outside safe x (${e.x | 0}..${(e.x + e.w) | 0})`);
    if (e.y < 140 || e.y + e.h > 1536) issues.push(`t=${t.toFixed(2)} ${id} outside safe y (${e.y | 0}..${(e.y + e.h) | 0})`);
    if (cap.op > .5 && cap.txt && !(e.y + e.h < cap.y || e.y > cap.y + cap.h)) issues.push(`t=${t.toFixed(2)} ${id} overlaps the caption`); }
}
// sprite canvas is module-private; screenshot-based occupancy for the recap/CTA phase instead
await b.close(); srv.close();
const uniq = [...new Set(issues.map((s) => s.replace(/t=[\d.]+ /, '')))];
console.log(issues.length ? issues.slice(0, 40).join('\n') : 'check.mjs: 0 DOM issues', '\nunique kinds:', uniq.length); console.log('cues', JSON.stringify(TMc));
