import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(800);
const ts = process.argv.slice(2).map(Number);
for (const t of ts) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `/tmp/fd_${t}.png` }); }
await b.close();
