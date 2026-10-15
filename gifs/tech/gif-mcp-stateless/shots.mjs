import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
await p.goto('file://' + process.cwd() + '/index.html'); await p.waitForTimeout(800);
for (const t of process.argv.slice(2).map(Number)) { await p.evaluate((t) => window.__seek(t), t); await p.screenshot({ path: `/tmp/mc_${t}.png`, clip: { x: 0, y: 190, width: 1080, height: 160 } }); }
await b.close();
