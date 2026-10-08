import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const ts = process.argv.slice(2).map(Number);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('console', m => { if (m.type() === 'error') console.log('console', m.text()); });
await p.goto(srv.url + '/index.html'); await p.waitForTimeout(5000);
console.log(await p.title(), await p.evaluate(() => window.__reelDurationSec));
for (const t of ts) { await p.evaluate(t => window.__seek(t), t); await p.screenshot({ path: `out/rp-${t}.png` }); }
await b.close(); await srv.close();
