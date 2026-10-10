// site/ic.js: tabler outline icon inner markup, read from assets/ (never hand-copied). Run: bun icons-build.mjs
import fs from 'node:fs';
const names = ['moon', 'tag', 'check', 'x', 'clock', 'robot', 'lock', 'wallet', 'receipt', 'shield-check', 'package', 'scale', 'users', 'credit-card', 'arrow-right', 'send', 'barcode', 'qrcode', 'user', 'adjustments', 'hand-finger', 'bolt'];
const o = {};
for (const n of names) { const p = `../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } const s = fs.readFileSync(p, 'utf8'); o[n] = [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join(''); }
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.stripeSvg=' + JSON.stringify(fs.readFileSync('mock/stripe.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/, '')) + ';\n');
