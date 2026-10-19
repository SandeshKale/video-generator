// Render the handwritten pages to flat textures: bun tex.mjs [pages...] -> tex/pN.png (1600x2240)
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
const pages = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : [1, 2, 3, 4, 5, 6, 7, 8];
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1600, height: 2240 } });
pg.on('pageerror', e => console.log('PAGEERR', e.message));
for (const p of pages) {
  await pg.goto(pathToFileURL(join(here, 'site/index.html')).href + '?p=' + p);
  await pg.waitForFunction(() => window.__done === true);
  const t = await pg.title(); if (t.startsWith('ERR')) console.log(p, t);
  await pg.screenshot({ path: join(here, `tex/p${p}.png`), omitBackground: true });
  console.log('tex', p);
}
await pg.setViewportSize({ width: 600, height: 600 });
for (const n of [1]) { await pg.goto(pathToFileURL(join(here, 'site/sticky.html')).href + '?n=' + n); await pg.waitForFunction(() => window.__done === true); await pg.screenshot({ path: join(here, `tex/sticky${n}.png`) }); console.log('sticky', n) }
await b.close();
