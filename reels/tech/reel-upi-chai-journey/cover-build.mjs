import { chromium } from '../../../node_modules/playwright/index.mjs';
import path from 'node:path';
const here = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await pg.goto('file://' + here + '/cover.html'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
await pg.screenshot({ path: here + '/cover.png' }); await b.close(); console.log('cover.png');
