// Part audit sheet + parts_audit.json + composite metrics (islands, heads, stray fraction) + dense-strip columns.
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
import { writeFileSync } from 'node:fs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1800, height: 900 } });
p.on('pageerror', e => console.log('ERR', e.message)); await p.goto(srv.url + '/audit.html'); await p.waitForFunction(() => window.audited && window.ready, null, { timeout: 30000 });
await p.screenshot({ path: 'parts_audit.png' });
const m = await p.evaluate(() => fetch('parts.json').then(r => r.json())); writeFileSync('parts_audit.json', JSON.stringify(Object.fromEntries(Object.entries(m).map(([k, v]) => [k, { bbox: [v.w, v.h], anchor_a: v.a, anchor_b: v.b, px: v.px, comps_pre: v.comps_pre, comps_post: v.comps_post }])), null, 1));
const res = await p.evaluate(() => window.compositeMetrics(0, 96, 24)); writeFileSync('composite_metrics.json', JSON.stringify(res));
const bad = res.filter(r => r.comps !== 1 || r.small > 0 || r.heads !== 1 || r.strayFrac > 0.03);
console.log('frames', res.length, 'frames with >1 big component:', res.filter(r => r.comps !== 1).length, '| with small islands:', res.filter(r => r.small > 0).length, '| head draws !=1:', res.filter(r => r.heads !== 1).length, '| max strayFrac', Math.max(...res.map(r => r.strayFrac)), '| worst frames', res.sort((a, c) => c.strayFrac - a.strayFrac).slice(0, 5).map(r => r.f + ':' + r.strayFrac).join(' '));
await b.close(); await srv.close();
