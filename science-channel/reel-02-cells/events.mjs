import { chromium } from 'playwright'; import { writeFileSync } from 'node:fs';
import { serveDir } from '../../scripts/static-server.mjs';
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(`${srv.url}/index.html`); await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
const ev = await p.evaluate(() => ({ ev: window.EV, dur: window.__reelDurationSec })); writeFileSync(new URL('./events.json', import.meta.url).pathname, JSON.stringify(ev.ev)); console.log('events', ev.ev.length, 'dur', ev.dur); await b.close(); process.exit(0);
