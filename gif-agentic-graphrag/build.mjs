// Generates index.html — an animated architecture explainer (pure function of t) for GIF export.
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['file-text', 'stack-2', 'graph', 'search', 'brain', 'hierarchy', 'share-2', 'chart-dots', 'filter', 'notebook', 'sparkles', 'shield-check', 'message-circle', 'stack-3']) ICONS[n] = icon(n);
const html = `<!doctype html><html><head><meta charset="utf8"><title>Agentic GraphRAG</title><style>
@font-face{font-family:'BG';font-weight:800;src:url('assets/fonts/bricolage-grotesque/bricolage-grotesque-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'BG';font-weight:700;src:url('assets/fonts/bricolage-grotesque/bricolage-grotesque-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'JB';font-weight:700;src:url('assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'JB';font-weight:500;src:url('assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2');font-display:block}
html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#07130f}
svg{display:block}
</style></head><body><svg id="s" width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script>
<script src="app.js"></script></body></html>`;
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('index.html');
