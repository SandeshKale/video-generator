import { chromium } from 'playwright';
import { serveDir } from '../../../scripts/static-server.mjs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('ERR', e.message)); p.on('console', (m) => { const t = m.text(); if (!/GPU stall|GL Driver|GroupMarker|404/.test(t)) console.log('console:', t); });
await p.goto(`${srv.url}/index.html`); await p.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
const ts = (process.argv[2] || '0').split(',').map(Number); const tag = process.argv[3] || 'm'; const t0 = Date.now();
for (const t of ts) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `/tmp/shots/${tag}_${t.toFixed(2)}.png` }); }
console.log('ms/frame', Math.round((Date.now() - t0) / ts.length));
await b.close(); process.exit(0);
