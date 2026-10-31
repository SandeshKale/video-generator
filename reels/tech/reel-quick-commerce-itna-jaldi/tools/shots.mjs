// usage: bun tools/shots.mjs t1 t2 ...   -> /tmp/scr/qc/f_<t>.png  (plus a contact sheet via tools/sheet.py)
import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto(pathToFileURL(join(H, '..', 'site', 'index.html')).href); await p.waitForFunction('window.__ready===true', null, { timeout: 60000 });
console.log('dur', await p.evaluate(() => window.__reelDurationSec), 'miss', await p.evaluate(() => JSON.stringify(window.__miss || [])));
for (const a of process.argv.slice(2)) { const t = Number(a); await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: `/tmp/scr/qc/f_${a}.png` }); }
await b.close();
