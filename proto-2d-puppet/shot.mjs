import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1920, height: 700 } });
p.on('pageerror', e => console.log('ERR', e.message)); await p.goto(srv.url + '/sheet.html'); await p.waitForFunction(() => window.done, null, { timeout: 20000 });
await p.screenshot({ path: '/tmp/w/pup.png' }); await b.close(); await srv.close();
