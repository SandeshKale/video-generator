// Generates site/timing.js (BEATS + per-beat spoken word times) from timing.json. Run: bun tools_timing.mjs
import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync(new URL('./timing.json', import.meta.url)));
const BEATS = T.scenes.map((s, i) => [s.start, i === T.scenes.length - 1 ? T.total : T.scenes[i + 1].start]);
const WORDS = T.scenes.map(s => s.beats.flatMap(b => b.words.map(w => [w.s, w.e])));
fs.writeFileSync(new URL('./site/timing.js', import.meta.url), `window.BEATS=${JSON.stringify(BEATS)};window.WORDS=${JSON.stringify(WORDS)};\n`);
console.log(BEATS.map(b => b.join('-')).join(' '));
// ---- SFX events (absolute seconds) ----
const sc = T.scenes, st = (i) => sc[i].start, ev = [], E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
const wd = (i, n) => { const w = sc[i].beats[0].words; return w[Math.min(n, w.length - 1)].s; };
const w = (s, n) => wd(s - 1, n);
fs.writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: sc.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
