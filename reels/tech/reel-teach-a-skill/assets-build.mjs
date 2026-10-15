// site/ic.js (tabler icons + nominative Anthropic mark) and site/hum.js (humaaans sitting-2, recoloured to the
// Card Catalogue palette), read from ../../../assets — never hand-copied. Also copies fonts, overlays and the profile photo.
// Run: bun assets-build.mjs
import fs from 'node:fs';
import { humaaansFull } from '../../../gifs/tech/gif-ai-work-treadmill/hum.mjs';
const names = ['terminal-2', 'cloud-off', 'shield-check', 'key', 'lock', 'folder', 'file-text', 'paperclip', 'check', 'alert-triangle', 'api', 'device-laptop', 'message-circle', 'toggle-right', 'toggle-left', 'repeat', 'notebook', 'copy', 'x', 'search', 'send', 'code', 'settings', 'sparkles', 'bookmark', 'user-plus'];
const o = {}; const inner = (s) => [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join('');
for (const n of names) { const p = `../../../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } o[n] = inner(fs.readFileSync(p, 'utf8')); }
const logo = (p) => fs.readFileSync(p, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/s, '').replace(/<!--.*?-->/gs, '');
const L = { anthropic: logo('../../../assets/logos/gilbarbara/anthropic-icon.svg').replace(/fill="#181818"/, 'fill="currentColor"') };
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.LOGO=' + JSON.stringify(L) + ';\n');
const hum = humaaansFull('sitting', 'sitting-2', { coatColor: '#20396b', shirtColor: '#f5eedb', pantColor: '#4a2c1d', shoeColor: '#f5eedb' }).replace('viewBox="0 0 380 480"', 'viewBox="0 0 380 400"');
fs.writeFileSync('site/hum.js', 'window.HUM=' + JSON.stringify(hum) + ';\n');
fs.mkdirSync('site/fonts', { recursive: true });
for (const [d, f] of [['dm-serif-display', 'dm-serif-display-latin-400-normal'], ['courier-prime', 'courier-prime-latin-700-normal'], ['courier-prime', 'courier-prime-latin-400-normal'], ['inter', 'inter-latin-700-normal'], ['inter', 'inter-latin-500-normal'], ['anton', null]])
  if (f) fs.copyFileSync(`../../../assets/fonts/${d}/${f}.woff2`, `site/fonts/${f}.woff2`);
for (const v of ['dust-particles', 'film-grain']) fs.copyFileSync(`../../../assets/animations/video-overlay/${v}.webm`, `site/${v}.webm`);
fs.copyFileSync('../../../prototypes/reel-app/public/profile.jpg', 'site/profile.jpg');
console.log(Object.keys(o).length, 'icons, hum', hum.length);
