// index.html for the "workslop" GIF: fonts + tabler icons read from ../assets (never hand-copied); app.js draws the scene as a pure function of t. Run: bun build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<(path|circle|rect|line|polyline)\b[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((s) => !/d="M0 0h24v24H0z"/.test(s)).join('');
const ICONS = {}; for (const n of ['users', 'arrow-up', 'arrow-down', 'clock', 'search', 'file-text', 'check', 'x', 'currency-dollar', 'hourglass', 'alert-triangle', 'user', 'briefcase']) ICONS[n] = icon(n);
const F = (fam, file, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url('../assets/fonts/${file}');font-display:block}`;
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>Workslop</title><style>
${F('FR', 'fraunces/fraunces-latin-900-normal.woff2', 900)}
${F('PM', 'ibm-plex-mono/ibm-plex-mono-latin-600-normal.woff2', 600)}
${F('IN', 'inter/inter-latin-600-normal.woff2', 600)}
${F('IN', 'inter/inter-latin-700-normal.woff2', 700)}
html,body{margin:0;width:1600px;height:900px;overflow:hidden;background:#f6efe0}svg{display:block}
</style></head><body><svg id="s" width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
console.log('ok');
