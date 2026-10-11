// word times -> site/timing.js (+ events.json). Uses avatar/words.json (+ avatar/cuts.json) when the clips have been transcribed;
// otherwise builds a PROVISIONAL timeline from the script text (2.4 words/s) so the site can be built and previewed before the clips arrive.
import fs from 'node:fs';
const TXT = {
  1: "Here's an AI that still answers when the Wi-Fi is off. No subscription. No cloud. It just runs on your laptop. Three steps. Let's go.",
  2: "Step one: install Ollama. On a Mac or Linux, paste one line into the terminal. On Windows, one line in PowerShell. Or just download the app from ollama dot com. It's free.",
  3: "Step two: pick a model that fits your memory. Got sixteen gigs of RAM? Run G-P-T O-S-S, twenty B. That's about fourteen gigabytes. Less memory? Try Gemma four, E four B.",
  4: "Step three: turn the Wi-Fi off. Ask it anything. It still answers, because the model lives on your machine. Bonus: it also runs a local API, so your own apps can talk to it.",
  5: "Two catches. It's usually slower than the big cloud models, and any model tagged cloud isn't local. Save this for later, tell me which model you try first, and follow for the next hack.",
};
const have = fs.existsSync(new URL('./avatar/words.json', import.meta.url));
let words, CUT;
if (have) { words = JSON.parse(fs.readFileSync(new URL('./avatar/words.json', import.meta.url))); CUT = JSON.parse(fs.readFileSync(new URL('./avatar/cuts.json', import.meta.url))); }
else { CUT = [14.4, 14.4, 14.4, 14.4, 14.4]; words = {}; for (const p of [1, 2, 3, 4, 5]) { const toks = TXT[p].split(/\s+/); const wlen = toks.map((w) => w.replace(/[^A-Za-z0-9']/g, '').length + 2); let tt = 0.15; words[p] = toks.map((w, i) => { const dur = wlen[i] / 22 * 1.0 + 0.08; const s = tt; tt += dur; if (/[.?!:]$/.test(w)) tt += 0.35; else if (/,$/.test(w)) tt += 0.15; return [w, +s.toFixed(2), +(s + dur).toFixed(2)]; }); const sc = 13.9 / tt; words[p] = words[p].map(([w, s, e]) => [w, +(s * sc).toFixed(2), +(e * sc).toFixed(2)]); } }
const OFF = {}; let a = 0; for (const p of [1, 2, 3, 4, 5]) { OFF[p] = +a.toFixed(3); a += CUT[p - 1]; }
const TOTAL = +(a + 1.0).toFixed(3);
const W = []; for (const p of [1, 2, 3, 4, 5]) words[p].forEach(([w, s, e], i) => { const core = w.replace(/[.,?!:]/g, '').toLowerCase(); let d = w; if (i === 0) d = d[0].toUpperCase() + d.slice(1); W.push({ p, w: d, k: core, s: +(s + OFF[p]).toFixed(3), e: +(e + OFF[p]).toFixed(3) }); });
const wt = (k, n = 0) => { let c = 0; for (const w of W) if (w.k === k) { if (c === n) return w.s; c++; } return 0; };
const wtp = (p, k, n = 0) => { let c = 0; for (const w of W) if (w.p === p && w.k === k) { if (c === n) return w.s; c++; } return 0; };
// scene starts keyed to words (works for provisional and real timings)
const SC = [0, wtp(1, 'subscription') - 0.25, wtp(1, 'three') - 0.15, OFF[2], OFF[3], wtp(3, 'run'), OFF[4], wtp(4, 'bonus') - 0.2, OFF[5], wtp(5, 'save') - 0.3].map((x) => +x.toFixed(3));
fs.writeFileSync(new URL('./site/timing.js', import.meta.url), `window.SC=${JSON.stringify(SC)};window.WD=${JSON.stringify(W)};window.TOTAL=${TOTAL};window.PROV=${have ? 'false' : 'true'};\n`);
console.log(have ? 'REAL' : 'PROVISIONAL', W.length, 'words, total', TOTAL, 'scenes', SC.join(' '));
const ev = []; const E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
SC.slice(1).forEach((s) => E('whoosh', s - 0.12));
E('tick', 0.2); E('pop', wtp(1, 'off')); E('ok', wtp(1, 'off') + 0.1);
E('stamp', wt('subscription')); E('stamp', wtp(1, 'cloud')); E('pop', wt('laptop'));
for (let i = 0; i < 12; i++) E('tick', SC[2] + 0.1 + i * 0.06); E('chime', SC[2] + 0.9);
E('code', wtp(2, 'mac'), { dur: 2.2 }); E('code', wt('windows'), { dur: 1.8 }); E('pop', wt('download')); E('ok', wt('free'));
E('thump', wtp(3, 'sixteen') + 0.3); E('buzz', wtp(3, 'ram') + 0.3); E('code', SC[5] + 0.4, { dur: 1.6 }); E('code', wt('gemma'), { dur: 1.4 }); E('pop', wt('gemma') - 0.2);
E('pop', wtp(4, 'off')); E('ok', wtp(4, 'off') + 0.15); E('code', wt('ask'), { dur: 1.4 }); E('count', wt('anything'), { dur: 4.0 });
E('pop', wt('bonus')); E('ok', wt('api') + 0.2);
E('rasp', wt('catches')); E('rasp', wt('cloud', 1) ); E('stamp', wt('save')); E('tear', wt('save') + 0.3); E('chime', wt('follow'));
fs.writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ sfx: ev }));
