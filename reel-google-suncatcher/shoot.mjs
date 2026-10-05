import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
const srv = await serveDir(new URL('.', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const k of ['hook','sat','lattice','math','cta']) { await p.goto(srv.url + '/mock-' + k + '.html'); await p.waitForTimeout(600); await p.screenshot({ path: `mock-${k}.png` }); }
await b.close(); await srv.close();
