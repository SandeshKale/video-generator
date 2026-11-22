// stills of every scene at 70 % (or env FRAC) of its span -> /tmp/sc_NN.png ; usage: bun tools/stills.mjs
import { chromium } from 'playwright'; import { fileURLToPath } from 'node:url'; import path from 'node:path';
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../site') + '/'; const FR = +(process.env.FRAC || .7);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + dir + 'index.html'); await p.waitForFunction(() => window.__ready === true, null, { timeout: 30000 }).catch(e => errs.push('notready'));
const GS = await p.evaluate(() => window.VT.groups.map(g => g.t0)); const end = await p.evaluate(() => window.VT.end);
for (let i = 0; i < GS.length; i++) { const t0 = GS[i], t1 = i + 1 < GS.length ? GS[i + 1] : end; await p.evaluate(t => window.__seek(t), t0 + (t1 - t0) * FR); await p.screenshot({ path: `/tmp/sc_${String(i + 1).padStart(2, '0')}.png` }); }
console.log(errs.join('\n') || 'no errors'); await b.close();
