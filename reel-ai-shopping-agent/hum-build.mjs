// site/hum.js: humaaans SVG strings for this reel (palette-overridden). Run: bun hum-build.mjs
import fs from 'node:fs';
import { humaaansFull } from '../gif-ai-work-treadmill/hum.mjs';
const ov = { shirtColor: '#ff2d6f', pantColor: '#23272d', coatColor: '#ffd23a', shoeColor: '#f3f6f8' };
const want = { sit4: ['sitting', 'sitting-4'], sit6: ['sitting', 'sitting-6'], sit2: ['sitting', 'sitting-2'], st9: ['standing', 'standing-9'], st14: ['standing', 'standing-14'], st20: ['standing', 'standing-20'], st5: ['standing', 'standing-5'] };
const out = {}; for (const [k, [a, b]] of Object.entries(want)) out[k] = humaaansFull(a, b, ov);
fs.writeFileSync('site/hum.js', 'window.HUM=' + JSON.stringify(out) + ';\n');
fs.writeFileSync('mock/hum-sheet.html', '<body style="margin:0;background:#dde;display:flex;flex-wrap:wrap">' + Object.entries(out).map(([k, v]) => `<div style="width:300px;margin:6px;font:14px sans-serif">${k}${v.replace('<svg ', '<svg width="300" ')}</div>`).join('') + '</body>');
