import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const ts = process.argv.slice(2).map(Number);
const srv = await serveDir(new URL('.', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('console', m.text()); });
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 60000 }); await p.waitForTimeout(800);
for (const t of ts) { await p.evaluate(t => window.__seek(t), t); await p.waitForTimeout(120); await p.screenshot({ path: `/tmp/w/pr-${t}.png` }); }
await b.close(); await srv.close();
