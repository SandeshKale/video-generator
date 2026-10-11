// site/hum.js: humaaans SVG strings for this reel (palette-overridden). Run: bun hum-build.mjs
import fs from 'node:fs';
import { humaaansFull } from '../gif-ai-work-treadmill/hum.mjs';
const ov = { shirtColor: '#f4ecd8', pantColor: '#15181b', coatColor: '#19c2b4', shoeColor: '#ff5a45' };
const want = { sit3: ['sitting', 'sitting-3'], st12: ['standing', 'standing-12'], st18: ['standing', 'standing-18'] };
const out = {}; for (const [k, [a, b]] of Object.entries(want)) out[k] = humaaansFull(a, b, ov);
fs.writeFileSync('site/hum.js', 'window.HUM=' + JSON.stringify(out) + ';\n');
fs.writeFileSync('mock/hum-sheet.html', '<body style="margin:0;background:#dde;display:flex;flex-wrap:wrap">' + Object.entries(out).map(([k, v]) => `<div style="width:300px;margin:6px;font:14px sans-serif">${k}${v.replace('<svg ', '<svg width="300" ')}</div>`).join('') + '</body>');
