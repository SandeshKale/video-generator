// site/hum.js: humaaans SVG strings for this reel (palette-overridden). Run: bun hum-build.mjs
import fs from 'node:fs';
import { humaaansFull } from '../../../gifs/tech/gif-ai-work-treadmill/hum.mjs';
const ov = { shirtColor: '#ff6a13', pantColor: '#12110f', coatColor: '#c6f135', shoeColor: '#efe9dc' };
const want = { sit4: ['sitting', 'sitting-4'], sit8: ['sitting', 'sitting-8'], st5: ['standing', 'standing-5'], st11: ['standing', 'standing-11'], st3: ['standing', 'standing-3'] };
const out = {}; for (const [k, [a, b]] of Object.entries(want)) out[k] = humaaansFull(a, b, ov);
fs.writeFileSync('site/hum.js', 'window.HUM=' + JSON.stringify(out) + ';\n');
fs.writeFileSync('mock/hum-sheet.html', '<body style="margin:0;background:#dde;display:flex;flex-wrap:wrap">' + Object.entries(out).map(([k, v]) => `<div style="width:300px;margin:6px;font:14px sans-serif">${k}${v.replace('<svg ', '<svg width="300" ')}</div>`).join('') + '</body>');
