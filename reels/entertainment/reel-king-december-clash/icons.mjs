// Inline the Phosphor icons this reel uses into site/icons.js (fill="currentColor"), so the page needs no extra requests.
import fs from 'node:fs';
const P = '../../../assets/icons/phosphor/fill/';
const names = ['film-strip', 'calendar-dots', 'crown-simple', 'popcorn', 'ticket', 'currency-inr', 'lock-simple', 'bandaids', 'chat-circle-dots', 'user-plus', 'flag-banner', 'star-four', 'monitor-play', 'sword', 'lightning', 'hand-pointing'];
const out = {};
for (const n of names) {
  const f = P + n + '-fill.svg';
  if (!fs.existsSync(f)) { console.log('missing', n); continue; }
  out[n] = fs.readFileSync(f, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<svg[^>]*>/, '<svg viewBox="0 0 256 256" fill="currentColor">').replace(/\s+/g, ' ').trim();
}
fs.writeFileSync('site/icons.js', 'window.IC=' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length, 'icons');
