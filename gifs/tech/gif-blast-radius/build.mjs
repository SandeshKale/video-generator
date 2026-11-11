// index.html for the blast-radius GIF: fonts + tabler icons read from ../../../assets and copied next to the page (render.mjs serves only this folder). Run: bun build.mjs
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
mkdirSync(new URL('./fonts/', import.meta.url), { recursive: true });
const icon = (n) => [...readFileSync(new URL(`../../../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<(path|circle|rect|line|polyline)\b[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((s) => !/stroke="none"|d="M0 0h24v24H0z"/.test(s)).join('');
const ICONS = {}; for (const n of ['alert-triangle', 'plug', 'circle-check', 'shield-check', 'clock', 'bolt', 'network', 'lock']) { try { ICONS[n] = icon(n); } catch (e) { ICONS[n] = ''; } }
const F = (fam, file, w) => { copyFileSync(new URL(`../../../assets/fonts/${file}`, import.meta.url), new URL(`./fonts/${file.split('/').pop()}`, import.meta.url)); return `@font-face{font-family:'${fam}';font-weight:${w};src:url('fonts/${file.split('/').pop()}');font-display:block}`; };
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>One fibre cut, 25+ products hit</title><style>
${F('FG', 'familjen-grotesk/familjen-grotesk-latin-700-normal.woff2', 700)}
${F('GM', 'geist-mono/geist-mono-latin-500-normal.woff2', 500)}
${F('GM', 'geist-mono/geist-mono-latin-600-normal.woff2', 600)}
${F('IN', 'inter/inter-latin-600-normal.woff2', 600)}
${F('IN', 'inter/inter-latin-700-normal.woff2', 700)}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#f7e6e3}svg{display:block}
</style></head><body><svg id="s" width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
console.log('ok', Object.values(ICONS).filter(Boolean).length, 'icons');
