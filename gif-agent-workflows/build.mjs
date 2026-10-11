// index.html for the "agent writes its own orchestration code" GIF (Claude Managed Agents dynamic workflows, Oct 9 2026):
// fonts + tabler icons read from ../assets (never hand-copied); app.js draws the diagram as a pure function of t. Run: bun build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<(path|circle|rect|line|polyline)\b[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['robot', 'file-text', 'check', 'x', 'eye', 'pencil', 'copy', 'stack-2', 'user', 'code', 'alert-triangle']) ICONS[n] = icon(n);
const F = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('../assets/fonts/${file}');font-display:block}`;
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>The agent writes the workflow</title><style>
${F('OU', 'outfit/outfit-latin-800-normal.woff2', 800)}
${F('DM', 'dm-mono/dm-mono-latin-500-normal.woff2', 500)}
${F('IN', 'inter/inter-latin-500-normal.woff2', 500)}
${F('IN', 'inter/inter-latin-700-normal.woff2', 700)}
html,body{margin:0;width:1600px;height:900px;overflow:hidden;background:#15100d}svg{display:block}
</style></head><body><svg id="s" width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
console.log('ok');
