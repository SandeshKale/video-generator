// Dense strip + QA metrics. Usage: bun shot.mjs [t0=1.0] [n=24] [fps=24]
import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
import { writeFileSync } from 'node:fs';
const t0 = +(process.argv[2] || 1), N = +(process.argv[3] || 24), FPS = +(process.argv[4] || 24);
const srv = await serveDir(new URL('./site', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.log('ERR', e.message)); await p.goto(srv.url + '/index.html'); await p.waitForFunction(() => window.done, null, { timeout: 20000 });
const infos = []; const shots = [];
for (let i = 0; i < N; i++) { const t = t0 + i / FPS; infos.push(await p.evaluate((t) => { const r = window.frame(t); return r; }, t)); shots.push(await p.screenshot({ clip: { x: 140, y: 560, width: 800, height: 940 }, type: 'png' })); }
writeFileSync('/tmp/w/strip.json', JSON.stringify(infos)); shots.forEach((s, i) => writeFileSync(`/tmp/w/sf${String(i).padStart(3, '0')}.png`, s));
// metrics
const m = {}; m.floorResidualMax = Math.max(...infos.map(r => Math.abs(Math.max(r.soles.L[1], r.soles.R[1]) - r.floor)));
m.headToTorsoTilt = (() => { const a = infos.map(r => Math.abs(r.head)), c = infos.map(r => Math.abs(r.torso)); return Math.max(...a) / Math.max(1e-6, Math.max(...c)); })();
m.maxTorsoDeg = Math.max(...infos.map(r => Math.abs(r.torso))) * 57.3; m.maxHeadDeg = Math.max(...infos.map(r => Math.abs(r.head))) * 57.3;
let sp = 0; for (let i = 1; i < infos.length; i++) infos[i].ang.forEach((a, j) => { let d = Math.abs(a - infos[i - 1].ang[j]); if (d > Math.PI) d = 2 * Math.PI - d; sp = Math.max(sp, d); }); m.maxAngleStepDegPerFrame = sp * 57.3;
m.otherFootLiftMaxPx = Math.max(...infos.map(r => Math.abs(r.soles.L[1] - r.soles.R[1])));
const mean = a => a.reduce((x, y) => x + y, 0) / a.length; m.hipXRangePx = Math.max(...infos.map(r => r.hip[0])) - Math.min(...infos.map(r => r.hip[0]));
console.log(JSON.stringify(m, null, 1)); await b.close(); await srv.close();
