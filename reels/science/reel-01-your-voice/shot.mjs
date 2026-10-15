import { chromium } from 'playwright';
import { serveDir } from '../../../scripts/static-server.mjs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--force-color-profile=srgb'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('ERR', e.message)); p.on('console', (m) => { const t = m.text(); if (!/GPU stall|GL Driver/.test(t)) console.log('console:', t); });
await p.goto(`${srv.url}/index.html`); await p.waitForFunction(() => window.__ready === true, null, { timeout: 90000 });
const ts = (process.argv[2] || '0').split(',').map(Number); const tag = process.argv[3] || 'p';
for (const t of ts) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `/tmp/shots/${tag}_${t.toFixed(2)}.png` }); }
if (process.argv[4] === 'ev') console.log(JSON.stringify(await p.evaluate(() => window.EV)));
await b.close(); process.exit(0);
