// Copy this reel's assets into site/: fonts, the Unsplash desk photo, the Open Peeps colleague, product marks (nominative use).
//   bun assets-build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { peep } from '../assets/illustrations/open-peeps/compose.mjs';
const H = path.dirname(new URL(import.meta.url).pathname), A = path.join(H, '..', 'assets'), S = path.join(H, 'site');
const cp = (from, to) => { fs.mkdirSync(path.dirname(path.join(S, to)), { recursive: true }); fs.copyFileSync(path.join(A, from), path.join(S, to)); };

for (const f of ['rubik/rubik-latin-700-normal', 'rubik/rubik-latin-800-normal', 'azeret-mono/azeret-mono-latin-500-normal',
  'azeret-mono/azeret-mono-latin-700-normal', 'inter/inter-latin-500-normal', 'inter/inter-latin-600-normal', 'inter/inter-latin-700-normal'])
  cp(`fonts/${f}.woff2`, `fonts/${path.basename(f)}.woff2`);

// desk photo (Unsplash via servicestack, unused by earlier reels): crop/resize to the scene's inset size
fs.mkdirSync(path.join(S, 'photos'), { recursive: true });
execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open('${A}/photos/servicestack/photo-1437419764061-2473afe69fc2.jpg').convert('RGB')
w, h = im.size; cw = int(h * 1.45); x = 0   # left side: laptop + wood; the right side shows camera/card brand marks
im.crop((x, 0, x + cw, h)).resize((1160, 800), Image.LANCZOS).save('${S}/photos/desk.jpg', quality=88)`]);

// Open Peeps colleague (first reel to use Open Peeps): pointing pose, explaining face, violet shirt via bg fill
fs.writeFileSync(path.join(S, 'peep.svg'), peep({ pose: 'standing/PointingFingerWB', hair: 'BunCurly', face: 'Explaining', accessory: 'GlassRound', stroke: '#23142d', bg: '#ffffff' }));

// marks: simple-icons (CC0 icon data; trademarks belong to their owners, used to identify the products)
const mark = (name, col) => fs.readFileSync(path.join(A, 'icons/simple-icons', name + '.svg'), 'utf8').replace('<svg ', `<svg fill="${col}" `);
const marks = { claude: mark('claude', '#d97757'), sheets: mark('googlesheets', '#11a08f'), docs: mark('googledocs', '#4a7dff'), slides: mark('googleslides', '#f5a300') };
const ph = (n) => fs.readFileSync(path.join(A, 'icons/phosphor/bold', n + '-bold.svg'), 'utf8').replace(/fill="[^"]*"/, 'fill="currentColor"');
const icons = { cursor: ph('cursor'), check: ph('check-fat'), lock: ph('lock-simple'), sparkle: ph('sparkle') };
fs.writeFileSync(path.join(S, 'marks.js'), `window.MK=${JSON.stringify(marks)};window.IC=${JSON.stringify(icons)};\n`);
console.log('assets ok');
