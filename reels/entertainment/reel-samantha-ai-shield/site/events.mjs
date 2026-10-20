// bun site/events.mjs -> audio/events.json (the page's own SFX event list, window.EV)
import { chromium } from '../../../../node_modules/playwright/index.mjs';
import { serveDir } from '../../../../scripts/static-server.mjs';
import path from 'node:path'; import fs from 'node:fs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const server = await serveDir(root); const url = server.url || `http://127.0.0.1:${server.port}/`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(url); await pg.waitForFunction(() => window.EV);
const ev = await pg.evaluate(() => window.EV); fs.mkdirSync(path.join(root, '../audio'), { recursive: true });
fs.writeFileSync(path.join(root, '../audio/events_' + (process.argv[2] || 'en') + '.json'), JSON.stringify(ev)); console.log(ev.length, 'events', [...new Set(ev.map(e => e[1]))].join(' '));
await b.close(); server.close?.();
