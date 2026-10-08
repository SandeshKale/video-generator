import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['robot', 'lock', 'key', 'world-www', 'plug', 'user', 'package', 'database', 'file-text', 'building']) ICONS[n] = icon(n);
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>Front door for AI agents</title><style>
@font-face{font-family:'PJ';font-weight:800;src:url('../../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'PJ';font-weight:700;src:url('../../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'IN';font-weight:500;src:url('../../assets/fonts/inter/inter-latin-500-normal.woff2');font-display:block}
@font-face{font-family:'IN';font-weight:700;src:url('../../assets/fonts/inter/inter-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'JB';font-weight:700;src:url('../../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-display:block}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#f1f3f8}svg{display:block}
</style></head><body><svg id="s" width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
