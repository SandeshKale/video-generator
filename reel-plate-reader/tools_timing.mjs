// timing.json -> site/timing.js (BEATS, WORDS with text) + events.json for sfx.py. Run: bun tools_timing.mjs
import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync(new URL('./timing.json', import.meta.url)));
const BEATS = T.scenes.map((s, i) => [s.start, i === T.scenes.length - 1 ? T.total : T.scenes[i + 1].start]);
const WORDS = T.scenes.map(s => s.beats.flatMap(b => b.words.map(w => [w.s, w.e, w.w.replace(/[.,!?]+$/, '')])));
fs.writeFileSync(new URL('./site/timing.js', import.meta.url), `window.BEATS=${JSON.stringify(BEATS)};window.WORDS=${JSON.stringify(WORDS)};\n`);
console.log(BEATS.map(b => b[0].toFixed(1)).join(' '), T.total);
// ---- SFX events (absolute seconds), keyed to spoken words ----
const sc = T.scenes, st = (i) => sc[i].start, ev = [], E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
const w = (s, n) => { const ws = sc[s - 1].beats[0].words; return ws[Math.min(n, ws.length - 1)].s; };
for (let i = 1; i < sc.length; i++) E('whoosh', st(i) - 0.12);
E('tick', w(1, 8));
E('pop', w(2, 9)); E('servo', w(2, 9) + 0.1, { dur: 0.9 });
[0, 1, 2, 3, 4, 5, 6].forEach((i) => E('tick', w(3, 5) + 0.3 + i * 0.07)); E('pop', w(3, 4)); [12, 14, 17].forEach((n) => E('tick', w(3, n)));
for (let i = 0; i < 12; i++) E('tick', st(3) + 0.1 + i * 0.14); E('tick', w(4, 9)); E('rasp', w(4, 11));
E('stamp', w(5, 5)); E('stamp', w(5, 8)); E('pop', w(5, 11));
E('code', w(6, 13), { dur: 0.9 }); E('tick', w(6, 18)); E('ok', w(6, 19));
E('stamp', w(7, 2)); E('rasp', w(7, 9)); E('rasp', w(7, 16));
E('pop', w(8, 11)); E('pop', w(8, 20)); [0, 1, 2].forEach((i) => E('stamp', w(8, 15) + i * 0.7)); E('crowd', w(8, 7), { dur: 4 });
E('pop', w(9, 7)); E('chime', w(9, 15));
E('tick', st(9) + 0.05); E('pop', w(10, 6)); E('pop', w(10, 9)); E('chime', w(10, 10));
fs.writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: sc.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
