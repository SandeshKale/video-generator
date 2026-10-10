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
E('bell', 0, { n: 2 }); E('thwack', w(1, 3)); E('stamp', w(1, 7)); E('stamp', w(1, 10));
for (let i = 1; i < sc.length; i++) E('whoosh', st(i) - 0.1);
E('pop', w(2, 6)); E('pop', w(2, 9)); [11, 12, 13].forEach((n) => E('thwack', w(2, n)));
E('pop', w(3, 2)); E('count', w(3, 13), { dur: 1.2 }); E('stamp', w(3, 18)); E('thwack', w(3, 10));
E('tear', w(4, 4)); E('stamp', w(4, 5));
E('pop', w(5, 1)); E('pop', w(5, 4)); E('servo', w(5, 6), { dur: 4 }); [0.2, 1.8, 3.4].forEach((d) => E('thwack', w(5, 6) + d)); E('pop', w(5, 10)); E('pop', w(5, 14));
E('thwack', st(5) + 0.75); E('servo', st(5) + 0.9, { dur: 1.4 }); E('ok', w(6, 7));
E('pop', w(7, 5)); E('pop', w(7, 8)); E('stamp', w(7, 11));
E('count', w(8, 7), { dur: 2.0 }); E('chime', w(8, 12) + 0.4); E('pop', w(8, 3));
E('count', w(9, 0), { dur: 1.2 }); E('crowd', w(9, 0), { dur: 2.2 }); E('whoosh', w(9, 4)); E('code', w(9, 4) + 0.4, { dur: 1.8 }); E('stamp', w(9, 8)); E('stamp', w(9, 9));
E('bell', st(9), { n: 1 }); E('pop', w(10, 13) - 0.1); E('chime', w(10, 16)); E('pop', w(10, 16));
fs.writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: sc.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
