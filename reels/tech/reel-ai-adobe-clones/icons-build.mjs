// site/ic.js: tabler outline icons + nominative logos read from assets/ (never hand-copied). Run: bun icons-build.mjs
import fs from 'node:fs';
const names = ['star', 'lock', 'x', 'check', 'terminal-2', 'file-text', 'coin', 'scale', 'shield-check', 'circle-x', 'arrow-right', 'alert-triangle', 'hourglass', 'calendar', 'cloud-upload', 'code', 'git-commit', 'user', 'robot', 'clock'];
const o = {}; const inner = (s) => [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join('');
for (const n of names) { const p = `../../../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } o[n] = inner(fs.readFileSync(p, 'utf8')); }
const logo = (p) => fs.readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/s, '').replace(/<!--.*?-->/gs, '');
const L = { rust: logo('../../../assets/logos/gilbarbara/rust.svg'), github: logo('../../../assets/icons/simple-icons/github.svg').replace(/<svg /, '<svg fill="currentColor" '), anthropic: logo('../../../assets/icons/simple-icons/anthropic.svg').replace(/<svg /, '<svg fill="currentColor" ') };
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.LOGO=' + JSON.stringify(L) + ';\n');
