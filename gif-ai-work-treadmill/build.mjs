import { readFileSync, writeFileSync } from 'node:fs';
import { humaaansFull } from './hum.mjs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['bolt', 'robot', 'clock', 'moon-stars', 'sparkles']) ICONS[n] = icon(n);
const runner = humaaansFull('standing', 'standing-8', { coatColor: '#2b50ff', pantColor: '#10142e', hairColor: '#10142e', shoeColor: '#ffffff', skinColor: '#8d5524' }).replace(/<svg[^>]*>|<\/svg>/g, '');
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>AI treadmill</title><style>
@font-face{font-family:'AN';src:url('assets/fonts/anton/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'MA';font-weight:800;src:url('assets/fonts/manrope/manrope-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'MA';font-weight:700;src:url('assets/fonts/manrope/manrope-latin-700-normal.woff2');font-display:block}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#ffd23f}svg{display:block}
</style></head><body><svg id="s" width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};window.RUNNER=${JSON.stringify(runner)};</script><script src="app.js"></script></body></html>`);
console.log('index.html');
