// site/ic.js: tabler outline icons + nominative logos read from assets/ (never hand-copied). Run: bun icons-build.mjs
import fs from 'node:fs';
const names = ['search', 'send', 'share', 'book', 'user', 'message-circle', 'heart', 'currency-dollar', 'brain', 'sparkles', 'x', 'check', 'arrow-right', 'player-play', 'cpu', 'bulb', 'tag', 'device-mobile', 'refresh'];
const o = {}; const inner = (s) => [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join('');
for (const n of names) { const p = `../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } o[n] = inner(fs.readFileSync(p, 'utf8')); }
const logo = (p) => fs.readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/s, '').replace(/<!--.*?-->/gs, '');
const L = { openai: logo('../assets/logos/gilbarbara/openai-icon.svg'), anthropic: logo('../assets/logos/gilbarbara/anthropic-icon.svg').replace(/fill="#181818"/, 'fill="currentColor"') };
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.LOGO=' + JSON.stringify(L) + ';\n');
