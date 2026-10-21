import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import path from 'node:path';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(pathToFileURL(path.resolve('mock.html')).href); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
for (const id of ['a','b','c']) await (await p.$('#' + id)).screenshot({ path: `m_${id}.png` });
await b.close();
