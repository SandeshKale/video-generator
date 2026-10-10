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
E('bell', 0, { n: 2 }); E('stamp', wd(0, 8));
for (let i = 1; i < sc.length; i++) E('whoosh', st(i) - 0.1);
[1, 2, 3].forEach((n) => E('pop', st(1) + 0.9 + n * 0.55)); E('thwack', st(1) + 4.0);
E('count', wd(2, 8), { dur: 1.2 }); E('stamp', st(2) + 2.4); E('thwack', st(2) + 4.5); E('thwack', st(2) + 6.2);
E('tear', st(3) + 1.5);
[1.0, 2.6, 4.2].forEach((d) => E('thwack', st(4) + d)); E('servo', st(4) + 0.6, { dur: 4 });
E('blip', st(5) + 0.3); E('thwack', st(5) + 1.0); E('ok', st(5) + 2.0);
E('pop', st(6) + 0.2); E('stamp', wd(6, 11)); E('servo', st(6) + 1, { dur: 2.2 });
E('count', st(7) + 1.0, { dur: 2.4 }); E('chime', st(7) + 4.2);
E('code', st(8) + 0.4, { dur: 1.6 }); E('stamp', st(8) + 2.2); E('crowd', st(8) + 2.6, { dur: 3 }); E('count', st(8) + 2.6, { dur: 2.4 });
E('bell', st(9), { n: 3 }); E('chime', st(9) + 4.5); E('pop', st(9) + 0.7);
fs.writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: sc.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
