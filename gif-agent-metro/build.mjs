import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['robot', 'lock', 'key', 'world-www', 'plug', 'user', 'database', 'ticket', 'x', 'check', 'hourglass', 'clock', 'alert-triangle']) ICONS[n] = icon(n);
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>Agent Metro</title><style>
@font-face{font-family:'UN';font-weight:900;src:url('../assets/fonts/unbounded/unbounded-latin-900-normal.woff2');font-display:block}
@font-face{font-family:'UN';font-weight:800;src:url('../assets/fonts/unbounded/unbounded-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'IN';font-weight:500;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2');font-display:block}
@font-face{font-family:'IN';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'JB';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-display:block}
html,body{margin:0;width:1600px;height:900px;overflow:hidden;background:#140f1f}svg{display:block}
</style></head><body><svg id="s" width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
