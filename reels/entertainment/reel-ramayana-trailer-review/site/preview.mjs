// bun site/preview.mjs t1 t2 ... -> out/pv_<t>.png contact frames (served over http like the renderer)
import { chromium } from '../../../../node_modules/playwright/index.mjs';
import { serveDir } from '../../../../scripts/static-server.mjs';
import path from 'node:path'; import fs from 'node:fs';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const server = await serveDir(root); const url = server.url || `http://127.0.0.1:${server.port}/`;
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on('pageerror', e => console.log('PAGEERR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('CONERR', m.text()) });
await pg.goto(url); await pg.waitForFunction(() => window.__ready !== false); fs.mkdirSync(path.join(root, '../out'), { recursive: true });
for (const t of process.argv.slice(2).map(Number)) { await pg.evaluate(t => window.__seek(t), t); await pg.screenshot({ path: path.join(root, `../out/pv_${t}.png`) }); }
await b.close(); server.close?.();
