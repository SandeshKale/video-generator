import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const s of ['1', '2', '8']) { await p.goto('file://' + process.cwd() + '/mockup.html?s=' + s); await p.waitForTimeout(900); await p.screenshot({ path: `mockup-s${s}.png` }); }
await b.close();
