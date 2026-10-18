// bun site/events.mjs -> audio/events.json (the page's own SFX event list, window.EV, so sounds land on the visuals)
import { chromium } from '../../../../node_modules/playwright/index.mjs';
import { serveDir } from '../../../../scripts/static-server.mjs';
import path from 'node:path'; import fs from 'node:fs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const server = await serveDir(root); const url = server.url || `http://127.0.0.1:${server.port}/`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(url); await pg.waitForFunction(() => window.__ready !== false);
const ev = await pg.evaluate(() => window.EV);
fs.writeFileSync(path.join(root, '../audio/events.json'), JSON.stringify(ev)); console.log(ev.length, 'events');
await b.close(); server.close?.();
