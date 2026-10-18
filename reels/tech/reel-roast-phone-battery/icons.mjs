// Inline the Phosphor icons this reel uses into site/icons.js (fill="currentColor"), so the page needs no extra requests.
import fs from 'node:fs';
const P = '../../../assets/icons/phosphor/fill/';
const names = ['game-controller', 'thermometer-hot', 'battery-full', 'fire', 'snowflake', 'device-mobile', 'fork-knife', 'moon-stars', 'clock', 'check-circle', 'paper-plane-tilt', 'warning', 'flask', 'gear-six', 'android-logo', 'apple-logo', 'bed', 'oven', 'sun'];
const out = {};
for (const n of names) {
  const f = P + n + '-fill.svg';
  if (!fs.existsSync(f)) { console.log('missing', n); continue; }
  out[n] = fs.readFileSync(f, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<svg[^>]*>/, '<svg viewBox="0 0 256 256" fill="currentColor">').replace(/\s+/g, ' ').trim();
}
fs.writeFileSync('site/icons.js', 'window.IC=' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length, 'icons');
