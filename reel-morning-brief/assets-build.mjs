// site/ic.js: tabler outline icons + nominative brand marks (Anthropic, Google Calendar) read from ../assets — never hand-copied.
// Also copies fonts, overlays, the profile photo, the CMU mocap tracks/rig and a humaaans pose into site/. Run: bun assets-build.mjs
import fs from 'node:fs';
import { humaaansFull } from '../gif-ai-work-treadmill/hum.mjs';
const names = ['mail', 'mail-opened', 'plug', 'clock', 'settings', 'search', 'check', 'circle-check', 'calendar', 'cloud', 'lock', 'lock-open', 'send', 'toggle-right', 'toggle-left', 'sparkles', 'list-check', 'chevron-right', 'arrow-right', 'device-laptop', 'alert-triangle', 'user'];
const o = {}; const inner = (s) => [...s.matchAll(/<(path|circle|rect|line|polyline|ellipse)\b[^>]*\/>/g)].map((m) => m[0]).filter((x) => !/stroke="none"/.test(x)).join('');
for (const n of names) { const p = `../assets/icons/tabler/${n}.svg`; if (!fs.existsSync(p)) { console.log('missing', n); continue; } o[n] = inner(fs.readFileSync(p, 'utf8')); }
const brand = (n) => fs.readFileSync(`../assets/icons/simple-icons/${n}.svg`, 'utf8').replace(/<title>.*?<\/title>/s, '').replace('<svg ', '<svg fill="currentColor" ');
const L = { anthropic: brand('anthropic'), gcal: brand('googlecalendar') };
fs.writeFileSync('site/ic.js', 'window.IC=' + JSON.stringify(o) + ';window.LOGO=' + JSON.stringify(L) + ';\n');
fs.mkdirSync('site/fonts', { recursive: true });
for (const [d, f] of [['newsreader', 'newsreader-latin-800-normal'], ['newsreader', 'newsreader-latin-700-normal'], ['newsreader', 'newsreader-latin-600-italic'], ['red-hat-mono', 'red-hat-mono-latin-500-normal'], ['red-hat-mono', 'red-hat-mono-latin-700-normal'], ['inter', 'inter-latin-700-normal'], ['inter', 'inter-latin-500-normal'], ['anton', 'anton-latin-400-normal']])
  fs.copyFileSync(`../assets/fonts/${d}/${f}.woff2`, `site/fonts/${f}.woff2`);
for (const v of ['light-leak-dust', 'dust-particles']) fs.copyFileSync(`../assets/animations/video-overlay/${v}.webm`, `site/${v}.webm`);
fs.copyFileSync('../reel-app/public/profile.jpg', 'site/profile.jpg');
// humaaans standing-10 (never used in a reel before), recoloured to the Dawn Edition palette
fs.writeFileSync('site/hum.js', 'window.HUM=' + JSON.stringify(humaaansFull('standing', 'standing-10', { coatColor: '#4a9dff', shirtColor: '#fffaf1', pantColor: '#1d1d24', shoeColor: '#fffaf1' })) + ';\n');
for (const f of ['mocap.js', 'rig.js']) fs.copyFileSync('../reel-teach-a-skill/site/' + f, 'site/' + f);
console.log(Object.keys(o).length, 'icons');
