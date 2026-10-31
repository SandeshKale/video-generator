import { chromium } from 'playwright'; import { pathToFileURL } from 'node:url'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await p.goto(pathToFileURL(join(H, 'index.html')).href); await p.waitForFunction('window.__ready===true');
const shots = [['A', 0.0], ['A', 1.3], ['A', 3.0], ['B', 0.9], ['B', 2.4], ['B', 3.4], ['C', 0.8], ['C', 1.6]];
for (const [sc, t] of shots) { await p.evaluate(([s, t]) => window.__mock(s, t), [sc, t]); await p.screenshot({ path: `/tmp/scr/qc/mock_${sc}_${t}.png` }); }
await b.close();
