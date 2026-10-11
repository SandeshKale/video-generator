// site/ic.js: tabler outline icons + nominative logos read from assets/ (never hand-copied). Run: bun icons-build.mjs
import fs from 'node:fs';
const names = ['lock', 'lock-open', 'moon-stars', 'calendar', 'clock', 'terminal-2', 'plug', 'server', 'shield-check', 'key', 'chart-line', 'device-laptop', 'bell-ringing', 'check', 'x', 'alert-triangle', 'flag-2', 'robot', 'checklist', 'arrow-right', 'news', 'filter', 'chart-candle', 'bell', 'player-pause', 'device-mobile', 'building-bank', 'webhook', 'bookmark', 'user-check'];
const o = {}; const inner = (s) => [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join('');
for (const n of names) { const p = `../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } o[n] = inner(fs.readFileSync(p, 'utf8')); }
const logo = (p) => fs.readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/s, '').replace(/<!--.*?-->/gs, '');
const L = { anthropic: logo('../assets/logos/gilbarbara/anthropic-icon.svg').replace(/fill="#181818"/, 'fill="currentColor"'), fastapi: logo('../assets/logos/gilbarbara/fastapi-icon.svg'), python: logo('../assets/logos/gilbarbara/python.svg') };
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.LOGO=' + JSON.stringify(L) + ';\n');
console.log(Object.keys(o).length, 'icons');
