// site/ic.js: tabler outline icons + nominative logos read from assets/ (never hand-copied). Run: bun icons-build.mjs
import fs from 'node:fs';
const names = ['cloud', 'x', 'check', 'terminal-2', 'code', 'file-text', 'clock', 'download', 'bookmark', 'alert-triangle', 'arrow-right', 'wifi-off', 'plane', 'cpu', 'user', 'lock', 'bolt', 'circle-x'];
const o = {}; const inner = (s) => [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join('');
for (const n of names) { const p = `../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } o[n] = inner(fs.readFileSync(p, 'utf8')); }
const logo = (p) => fs.readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/s, '').replace(/<!--.*?-->/gs, '');
const L = { apple: logo('../assets/icons/simple-icons/apple.svg').replace(/<svg /, '<svg fill="currentColor" '), openai: logo('../assets/logos/gilbarbara/openai-icon.svg') };
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.LOGO=' + JSON.stringify(L) + ';\n');
