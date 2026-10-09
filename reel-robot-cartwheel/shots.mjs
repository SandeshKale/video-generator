// usage: bun shots.mjs t1 t2 ... -> shots/t.png (full) ; env SHEET=1 builds a contact sheet at 360px
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
import { mkdirSync } from 'node:fs';
mkdirSync(new URL('./shots', import.meta.url).pathname, { recursive: true });
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.__seek || document.title.startsWith('ERR'), null, { timeout: 60000 });
console.log('title', await p.title());
for (const t of process.argv.slice(2).map(Number)) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: new URL(`./shots/t${t}.png`, import.meta.url).pathname }); }
await b.close(); await srv.close();
