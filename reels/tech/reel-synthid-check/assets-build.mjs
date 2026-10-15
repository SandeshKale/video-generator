// Copy this reel's assets into site/: fonts, the AI storm still + depth, the real Unsplash lightning photo, product marks (nominative use),
// icons and rough.js. bun assets-build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const H = path.dirname(new URL(import.meta.url).pathname), A = path.join(H, '..', '..', '..', 'assets'), S = path.join(H, 'site');
const cp = (from, to) => { fs.mkdirSync(path.dirname(path.join(S, to)), { recursive: true }); fs.copyFileSync(path.join(A, from), path.join(S, to)); };
for (const f of ['bodoni-moda/bodoni-moda-latin-700-normal', 'bodoni-moda/bodoni-moda-latin-800-normal', 'chivo-mono/chivo-mono-latin-500-normal',
  'chivo-mono/chivo-mono-latin-700-normal', 'inter/inter-latin-600-normal', 'inter/inter-latin-700-normal']) cp(`fonts/${f}.woff2`, `fonts/${path.basename(f)}.woff2`);
cp('animations/rough/rough.min.js', 'rough.min.js');
fs.mkdirSync(path.join(S, 'photos'), { recursive: true });
// real photo (Unsplash via servicestack): portrait crop of the lightning shot, 744x1024
execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open('${A}/photos/servicestack/photo-1429552054921-018e433d7d34.jpg').convert('RGB')
w, h = im.size; cw = int(h * 0.62); x = int(w * 0.34)
im.crop((x, 0, x + cw, h)).resize((620, 1000), Image.LANCZOS).save('${S}/photos/real.jpg', quality=88)`]);
for (const [src, dst] of [['shots/storm.jpg', 'photos/storm.jpg'], ['depth/storm.png', 'photos/storm-depth.png']]) if (fs.existsSync(path.join(H, src))) fs.copyFileSync(path.join(H, src), path.join(S, dst));
// marks (simple-icons, CC0 icon data; trademarks belong to their owners, used to say whose watermarks the tool reads)
const mark = (name, col) => fs.readFileSync(path.join(A, 'icons/simple-icons', name + '.svg'), 'utf8').replace('<svg ', `<svg fill="${col}" `);
const ph = (n) => fs.readFileSync(path.join(A, 'icons/phosphor/bold', n + '-bold.svg'), 'utf8').replace(/fill="[^"]*"/, 'fill="currentColor"');
const marks = { google: mark('google', '#13243d'), nvidia: mark('nvidia', '#13243d') };   // OpenAI: gilbarbara/openai.svg, added in the full build
const icons = { play: ph('play'), scan: ph('scan'), seal: ph('seal-check'), stamp: ph('stamp'), search: ph('magnifying-glass'), fingerprint: ph('fingerprint'), push: ph('push-pin'), image: ph('file-image'), film: ph('film-strip'), wave: ph('waveform'), upload: ph('upload-simple') };
fs.writeFileSync(path.join(S, 'marks.js'), `window.MK=${JSON.stringify(marks)};window.IC=${JSON.stringify(icons)};\n`);
// full-build extras: partner logos, footage textures, creator photo, a recoloured humaaans figure, naive icons
import { humaaansFull } from '../../../gifs/tech/gif-ai-work-treadmill/hum.mjs';
cp('logos/gilbarbara/openai-icon.svg', 'logos/openai.svg'); cp('logos/gilbarbara/google-icon.svg', 'logos/google.svg'); cp('logos/gilbarbara/apple.svg', 'logos/apple.svg');
cp('animations/video-overlay/dust-particles.webm', 'fx/dust.webm'); cp('animations/video-overlay/film-grain.webm', 'fx/grain.webm');
fs.copyFileSync(path.join(H, '..', '..', '..', 'prototypes/reel-app/public/profile.jpg'), path.join(S, 'photos/profile.jpg'));
fs.writeFileSync(path.join(S, 'photos/figure.svg'), humaaansFull('standing', 'standing-15', { coatColor: '#0e6b5a', shirtColor: '#f2ead3', pantColor: '#13243d', shoeColor: '#e2412c' }));
const nv = (n) => fs.readFileSync(path.join(A, 'icons/naive-icons', n + '.svg'), 'utf8');
Object.assign(icons, { bookmark: ph('bookmark-simple'), chat: ph('chat-circle-dots'), check: ph('check-circle'), cursor: ph('cursor'), lock: ph('lock-key'), shield: ph('shield-check'), link: ph('link'), warn: ph('warning') });
fs.writeFileSync(path.join(S, 'marks.js'), `window.MK=${JSON.stringify(marks)};window.IC=${JSON.stringify(icons)};\n`);
console.log('assets ok');
