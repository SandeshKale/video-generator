// Dump window.EV (every on-screen event the page schedules) to events.json, so the score/SFX use the exact same times as the visuals.
import fs from 'node:fs';
import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const srv = await serveDir(new URL('../site/', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.EV && window.SC, null, { timeout: 60000 });
const ev = await p.evaluate(() => ({ sfx: window.EV.slice().sort((a, b) => a.t - b.t), SC: window.SC, total: window.TOTAL }));
fs.writeFileSync(new URL('../events.json', import.meta.url), JSON.stringify(ev));
console.log(ev.sfx.length, 'events'); await b.close(); await srv.close();
