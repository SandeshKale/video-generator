// index.html for the "coupon validation platform" architecture GIF (client case study; names omitted in the source one-pager).
// Fonts + icons are read from ../../../assets (never hand-copied); app.js draws the whole diagram as a pure function of t. Run: bun build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const A = (p) => new URL(`../../../assets/${p}`, import.meta.url);
const inner = (f) => readFileSync(A(f), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/g, '').trim();
const PH = {}; for (const n of ['qr-code', 'printer', 'storefront', 'truck', 'chart-bar', 'shield-check', 'lock-key', 'database', 'clock', 'wifi-slash', 'key', 'cloud-arrow-up', 'heartbeat', 'prohibit', 'check-circle', 'warning', 'gauge', 'stack', 'lightning', 'device-mobile', 'seal-check', 'bug', 'rocket-launch', 'globe', 'ticket', 'hourglass-medium', 'arrows-clockwise', 'binoculars']) PH[n] = inner(`icons/phosphor/bold/${n}-bold.svg`);
const SI = {}; for (const n of ['supabase', 'vercel', 'postgresql', 'react', 'typescript', 'github', 'sentry', 'cloudflare', 'deno', 'vite', 'vitest']) SI[n] = inner(`icons/simple-icons/${n}.svg`);
const F = (fam, file, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url('../../../assets/fonts/${file}');font-display:block}`;
writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><title>The database is the rulebook</title><style>
${F('SO', 'sora/sora-latin-800-normal.woff2', 800)}
${F('SO', 'sora/sora-latin-700-normal.woff2', 700)}
${F('RM', 'red-hat-mono/red-hat-mono-latin-500-normal.woff2', 500)}
${F('RM', 'red-hat-mono/red-hat-mono-latin-700-normal.woff2', 700)}
${F('IN', 'inter/inter-latin-500-normal.woff2', 500)}
${F('IN', 'inter/inter-latin-700-normal.woff2', 700)}
html,body{margin:0;width:1600px;height:900px;overflow:hidden;background:#0a0b1f}svg{display:block}
</style></head><body><svg id="s" width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg"></svg>
<script>window.PH=${JSON.stringify(PH)};window.SI=${JSON.stringify(SI)};</script><script src="app.js"></script></body></html>`);
console.log('ok', Object.keys(PH).length, Object.keys(SI).length);
