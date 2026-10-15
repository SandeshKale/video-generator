// index.html for the "agents get an employee badge" GIF (Google's Gemini agent, Oct 8 2026): fonts + tabler icons read from
// ../../../assets (never hand-copied); the diagram itself is drawn by app.js as a pure function of t. Run: bun build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../../../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<(path|circle|rect|line|polyline)\b[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ICONS = {}; for (const n of ['user', 'users', 'robot', 'mail', 'calendar', 'lock', 'shield-check', 'check', 'x', 'player-pause', 'player-play', 'server', 'ticket', 'database', 'message', 'building', 'file-text', 'badge', 'coin', 'cloud']) ICONS[n] = icon(n);
const F = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('../../../assets/fonts/${file}');font-display:block}`;
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>Agents get an employee badge</title><style>
${F('SG', 'space-grotesk/space-grotesk-latin-700-normal.woff2', 700)}
${F('PM', 'ibm-plex-mono/ibm-plex-mono-latin-600-normal.woff2', 600)}
${F('PM', 'ibm-plex-mono/ibm-plex-mono-latin-700-normal.woff2', 700)}
${F('IN', 'inter/inter-latin-500-normal.woff2', 500)}
${F('IN', 'inter/inter-latin-700-normal.woff2', 700)}
html,body{margin:0;width:1080px;height:1350px;overflow:hidden;background:#0b1620}svg{display:block}
</style></head><body><svg id="s" width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.ICONS=${JSON.stringify(ICONS)};</script><script src="app.js"></script></body></html>`);
console.log('icons', Object.keys(ICONS).filter((k) => !ICONS[k]).join(' ') || 'all found');
