import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('PAGEERROR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto('file://' + process.cwd() + '/mock/index.html'); await p.waitForFunction(() => window.__ready, null, { timeout: 30000 });
await p.evaluate(() => document.fonts.ready);
for (const [id, t, n] of [['p1', 0, 's1a'], ['p1', 2.4, 's1b'], ['p3', 15.0, 's3'], ['p6', 38.0, 's6']]) { await p.evaluate(([id, t]) => window.__mock(id, t), [id, t]); await p.screenshot({ path: `mock/${n}.png` }); }
await b.close();
