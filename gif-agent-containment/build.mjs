// index.html for the "when an AI agent hits a wall" GIF (Anthropic's Oct 9 2026 disclosure of unintended model actions):
// fonts + tabler icons read from ../assets (never hand-copied); app.js draws the diagram as a pure function of t. Run: bun build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<(path|circle|rect|line|polyline)\b[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['robot', 'school', 'building-bank', 'alert-triangle', 'database', 'link', 'lock', 'eye', 'shield', 'filter', 'world', 'key', 'check', 'x']) ICONS[n] = icon(n);
const F = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('../assets/fonts/${file}');font-display:block}`;
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>When an agent hits a wall</title><style>
${F('BS', 'big-shoulders-display/big-shoulders-display-latin-800-normal.woff2', 800)}
${F('GM', 'geist-mono/geist-mono-latin-500-normal.woff2', 500)}
${F('GM', 'geist-mono/geist-mono-latin-600-normal.woff2', 600)}
${F('IN', 'inter/inter-latin-500-normal.woff2', 500)}
${F('IN', 'inter/inter-latin-700-normal.woff2', 700)}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#11130e}svg{display:block}
</style></head><body><svg id="s" width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
console.log('ok');
