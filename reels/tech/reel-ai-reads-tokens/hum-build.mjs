// site/hum.js: humaaans SVG strings for this reel (newsprint/pastel overrides). Run: bun hum-build.mjs [all]
import fs from 'node:fs';
import { humaaansFull } from '../../../gifs/tech/gif-ai-work-treadmill/hum.mjs';
const ov = { shirtColor: '#c4b5ff', pantColor: '#17171a', coatColor: '#9fd6ff', shoeColor: '#e8432e' };
const all = process.argv[2] === 'all';
const want = all ? Object.fromEntries([...[1,5,7].map(n=>['sit'+n,['sitting','sitting-'+n]]),...[1,2,4,6,7,8,10,13,15,16,17,19,21,22,23,24].map(n=>['st'+n,['standing','standing-'+n]])])
  : { sit5: ['sitting', 'sitting-5'], st17: ['standing', 'standing-17'], sit7: ['sitting', 'sitting-7'] };
const out = {}; for (const [k, [a, b]] of Object.entries(want)) out[k] = humaaansFull(a, b, ov);
if (all) fs.writeFileSync('/tmp/bf/hum-sheet.html', '<body style="margin:0;background:#f3efe4;display:flex;flex-wrap:wrap;width:1600px">' + Object.entries(out).map(([k, v]) => `<div style="width:180px;margin:4px;font:14px sans-serif">${k}${v.replace('<svg ', '<svg width="180" ')}</div>`).join('') + '</body>');
else fs.writeFileSync('site/hum.js', 'window.HUM=' + JSON.stringify(out) + ';\n');
