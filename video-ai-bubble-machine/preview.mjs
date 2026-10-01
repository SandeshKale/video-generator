#!/usr/bin/env node
// Usage: bun preview.mjs <partId> <t1> <t2> ...  -> screenshots into $PREVIEW_DIR (default ./out)
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
const __dirname = dirname(fileURLToPath(import.meta.url));
const [, , pid, ...ts] = process.argv;
const dir = process.env.PREVIEW_DIR || join(__dirname, 'out');
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await page.goto('file://' + join(__dirname, 'parts', `part${String(pid).padStart(2, '0')}.html`));
await page.waitForFunction(() => typeof window.__seek === 'function');
await page.waitForTimeout(300);
console.log('duration', await page.evaluate(() => window.__reelDurationSec));
for (const t of ts) {
  await page.evaluate((x) => window.__seek(x), Number(t));
  const f = join(dir, `p${pid}-t${t}.png`);
  await page.screenshot({ path: f });
  console.log('shot', f);
}
await browser.close();
