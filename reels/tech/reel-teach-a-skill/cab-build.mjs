// site/3d/cab.js: the drawer frame list + each frame's projected plate/card positions (from blender/cabinet.py JSON).
// Missing frames (render still running) fall back to the nearest rendered one, so the page can be previewed early.
import fs from 'node:fs';
const want = [...Array(12).keys()].map((i) => 'd' + String(i).padStart(2, '0')).concat([1, 2, 3, 4, 5].map((j) => 'c' + j));
const have = want.filter((n) => fs.existsSync(`site/3d/${n}.png`));
if (!have.length) throw new Error('no frames');
const extra = fs.existsSync('site/3d/cab_open.png') ? ['cab_open'] : [];
const pick = (n, i) => { if (have.includes(n)) return n; if (n[0] === 'c' && extra.length) return 'cab_open'; let best = have[0], bd = 1e9; have.forEach((h) => { const d = Math.abs(want.indexOf(h) - i); if (d < bd) { bd = d; best = h; } }); return best; };
const frames = want.map(pick), J = {};
for (const n of new Set(frames)) J[n] = JSON.parse(fs.readFileSync(`site/3d/${n}.json`, 'utf8'));
fs.writeFileSync('site/3d/cab.js', 'window.CABF=' + JSON.stringify(frames) + ';window.CABJ=' + JSON.stringify(J) + ';\n');
console.log('frames', frames.join(' '));
