// bun site/check.mjs [step] -> layout lint: safe zone (x 150-918, y 140-1536), DOM overlaps between HUD/caption/host/cards, caption vs host. Samples every step s.
import { chromium } from '../../../../node_modules/playwright/index.mjs';
import { serveDir } from '../../../../scripts/static-server.mjs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const server = await serveDir(root); const url = server.url || `http://127.0.0.1:${server.port}/`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(url); await pg.waitForFunction(() => window.__ready !== false);
const step = +(process.argv[2] || .5); const END = await pg.evaluate(() => window.__reelDurationSec); const out = [];
const IDS = ['eye', 'upi', 'hook', 'ref', 'cap', 'hostw', 'b1', 'b2', 'b3', 'pf', 'hd', 'sub', 'save'];
for (let t = 0; t < END; t += step) {
  const r = await pg.evaluate(t => { window.__seek(t); const q = id => { const e = document.getElementById(id); if (!e) return null; const cs = getComputedStyle(e); if (+cs.opacity < .25 || cs.display === 'none') return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom] };
    const o = {}; ['eye', 'cnt', 'hl', 'stl', 'str', 'capw', 'hostw', 'b1', 'b2', 'b3', 'pf', 'hd', 'sub'].forEach(i => o[i] = q(i)); Array.from(document.querySelectorAll('.chip')).forEach((e, i) => o['chip' + i] = q.call(null, null) || (() => { const r = e.getBoundingClientRect(); return +getComputedStyle(e).opacity < .25 ? null : [r.left, r.top, r.right, r.bottom] })());
 return o }, t);
  const ks = Object.keys(r).filter(k => r[k]);
  for (const k of ks) { const [l, tp, rt, bt] = r[k]; if (k !== 'hostw' && (l < 148 || rt > 920 || tp < 138 || bt > 1540 || (k === 'hl' && bt > 480))) out.push(`${t.toFixed(2)} SAFE ${k} ${[l, tp, rt, bt].map(Math.round)}`) }
  for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) { const a = r[ks[i]], c = r[ks[j]]; if (a[0] < c[2] && c[0] < a[2] && a[1] < c[3] && c[1] < a[3]) { const ov = (Math.min(a[2], c[2]) - Math.max(a[0], c[0])) * (Math.min(a[3], c[3]) - Math.max(a[1], c[1])); if (ov > 400) out.push(`${t.toFixed(2)} OVERLAP ${ks[i]} x ${ks[j]} (${Math.round(ov)} px²)`) } }
}
const uniq = [...new Set(out.map(s => s.replace(/^[\d.]+ /, '')))]; console.log(out.length, 'findings,', uniq.length, 'unique'); uniq.forEach(u => console.log(' ', u, '| first at', out.find(s => s.endsWith(u.slice(u.indexOf(' ') + 1))) ? '' : ''));
for (const u of uniq) console.log(out.filter(s => s.includes(u)).slice(0, 1)[0]);
await b.close(); server.close?.();
