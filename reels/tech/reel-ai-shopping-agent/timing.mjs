// avatar/words.json (faster-whisper word times per clip) -> site/timing.js (absolute times) + events for sfx.py
import fs from 'node:fs';
const words = JSON.parse(fs.readFileSync(new URL('./avatar/words.json', import.meta.url)));
const OFF = { 1: 0, 2: 14.5, 3: 28.85, 4: 43.35 }, TOTAL = 59.334;
const DISP = { '100': 'a hundred', '6': 'six', '10': 'ten', 'and': 'and' };
const W = []; for (const p of [1, 2, 3, 4]) words[p].forEach(([w, s, e], i) => { let d = w.replace(/^[A-Za-z']+/, (x) => x); const core = w.replace(/[.,?!]/g, ''); if (DISP[core]) d = DISP[core] + w.slice(core.length); if (i === 0) d = d[0].toUpperCase() + d.slice(1); W.push({ p, w: d, k: core.toLowerCase(), s: +(s + OFF[p]).toFixed(3), e: +(e + OFF[p]).toFixed(3) }); });
const SC = [0, 3.1, 6.4, 10.5, 14.5, 19.4, 28.85, 33.85, 43.35, 49.45];
fs.writeFileSync(new URL('./site/timing.js', import.meta.url), `window.SC=${JSON.stringify(SC)};window.WD=${JSON.stringify(W)};window.TOTAL=${TOTAL};\n`);
console.log(W.length, 'words');

// ---- SFX events (absolute seconds), keyed to spoken words ----
const wt = (k, n = 0) => { let c = 0; for (const w of W) if (w.k === k) { if (c === n) return w.s; c++; } return 0; };
const wtp = (p, k, n = 0) => { let c = 0; for (const w of W) if (w.p === p && w.k === k) { if (c === n) return w.s; c++; } return 0; };
const ev = []; const E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
SC.slice(1).forEach((s) => E('whoosh', s - 0.12));
for (let i = 0; i < 10; i++) E('tick', 0.1 + i * 0.24); E('chime', wt('ai'));
E('code', wt('running'), { dur: wt('bucks') - wt('running') }); ['running', 'shoes', 'under'].forEach((k) => E('pop', wt(k) + .05)); E('ok', wt('bucks') + .25);
['browse', 'compare', 'check'].forEach((k) => E('tick', wt(k))); E('step', SC[2] + .1, { dur: 4 }); E('pop', wt('sleep') - .9);
E('pop', SC[3] + .1); E('ok', SC[3] + .45); E('code', wt('until') + .12, { dur: 2.4 }); E('thump', wt('wrong')); E('stamp', wt('thing'));
['sierra', 'meta', 'walmart', 'stripe'].forEach((k) => E('pop', wt(k))); E('ok', wt('stripe') + .3); E('stamp', wt('stripe') + .2);
E('tick', wt('who') + .1); E('tick', wt('do') - .1); E('tick', wt('what', 1) + .1); E('pop', wt('hall')); E('count', wt('spend') - .5, { dur: 1 });
E('servo', SC[6], { dur: 5 }); E('chime', wt('pays')); E('stamp', wt('who', 1));
E('tick', wt('choose')); E('stamp', wt('yours')); E('rasp', wt('merchants')); E('tear', wt('merchants') + .5);
for (let i = 0; i < 6; i++) E('chime', wtp(4, 'mistake') + .1 + i * .16); E('crowd', wtp(4, 'one', 0), { dur: 3 }); E('ok', wt('6') + .2);
E('beep', wt('would')); E('pop', wt('tell')); E('tear', wt('tell') + .3); E('chime', wt('follow'));
fs.writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ sfx: ev }));
