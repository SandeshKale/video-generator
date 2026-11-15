import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message));
for (const s of [1,2,3,4,5]) { await p.goto(pathToFileURL(process.cwd() + '/index.html').href + '?s=' + s); await p.waitForFunction('window.__done===true', null, { timeout: 60000 }); await p.screenshot({ path: `mock-${s}.png` }); console.log('shot', s); }
await b.close();
