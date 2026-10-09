// Resolves script.json + timing.json into site/data.js (scene windows, caption chunks, tabler icons).
import { readFileSync, writeFileSync } from 'node:fs';
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url)));
const script = JSON.parse(readFileSync(new URL('./script.json', import.meta.url)));
function capChunks(sc) {
  const out = []; const spec = script.scenes.find((x) => x.id === sc.id);
  sc.beats.forEach((b, bi) => {
    const toks = spec.beats[bi].split(/\s+/);
    const ws = b.words.length === toks.length ? b.words.map((w, i) => ({ ...w, w: toks[i] })) : b.words;
    const units = []; let cur = [];
    ws.forEach((w, i) => { cur.push(w); if (/[.!?]$/.test(toks[i] || '') || i === ws.length - 1) { units.push(cur); cur = []; } });
    const len = (u) => u.map((w) => w.w).join(' ').length;
    const split = (u) => { if (len(u) <= 44 || u.length < 2) return [u]; let best = Math.ceil(u.length / 2), bd = 1e9; for (let i = 2; i <= u.length - 2; i++) { const d = Math.abs(len(u.slice(0, i)) - len(u.slice(i))) - (/,$/.test(u[i - 1].w) ? 12 : 0); if (d < bd) { bd = d; best = i; } } return [...split(u.slice(0, best)), ...split(u.slice(best))]; };
    const parts = units.flatMap(split); const merged = [];
    for (const p of parts) { const last = merged[merged.length - 1]; if (last && len(last.concat(p)) <= 44) merged[merged.length - 1] = last.concat(p); else merged.push(p); }
    for (const p of merged) out.push({ start: p[0].s, end: p[p.length - 1].e, words: p });
  });
  return out;
}
const icons = {};
for (const n of ['check', 'x', 'robot', 'video', 'camera']) {
  const src = readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8');
  icons[n] = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
}
const scenes = T.scenes.map((sc) => ({ id: sc.id, start: sc.start, end: sc.end, beats: sc.beats.map((b, bi) => { const tx = script.scenes.find((x) => x.id === sc.id).beats[bi].split(/\s+/); return { start: b.start, end: b.end, words: b.words.length === tx.length ? b.words.map((w, i) => ({ ...w, w: tx[i] })) : b.words }; }), caps: capChunks(sc) }));
writeFileSync(new URL('./site/data.js', import.meta.url), 'window.DATA=' + JSON.stringify({ total: T.total, scenes, icons }) + ';\n');
console.log('data.js', scenes.length, 'scenes', T.total.toFixed(1), 's');

// ---- sfx events (absolute seconds) keyed to the same word times the visuals use ----
const wd = (si, i) => { const w = scenes[si].beats[0].words; return w[Math.min(i, w.length - 1)].s; };
const ev = [];
const E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
E('thump', 0.0); E('pop', 0.35); E('stamp', wd(0, 10)); E('step', 0.9, { dur: 1.6 });
for (let i = 1; i < scenes.length; i++) E('whoosh', scenes[i].start - 0.1);
[2, 4].forEach((i) => E('pop', wd(1, i) - .1)); [12, 13, 14, 15, 17].forEach((i) => E('beep', wd(1, i)));
E('count', wd(1, 18), { dur: 1.4 });
E('pop', wd(2, 10)); E('reward', wd(2, 13)); E('penalty', wd(2, 20)); E('penalty', wd(2, 22) + .1); E('crash', wd(2, 26));
E('code', wd(3, 6), { dur: 1.4 }); [16, 17, 19, 20].forEach((i) => E('pop', wd(3, i) - .05)); E('flip', wd(3, 19));
E('blip', wd(4, 4)); E('blip', wd(4, 7)); E('ok', wd(4, 10) + .1);
E('pop', wd(5, 12)); E('stamp', wd(5, 12)); E('ok', wd(5, 24));
E('pop', wd(6, 0)); E('pop', wd(6, 4)); E('stamp', wd(6, 10)); [14, 16, 19].forEach((i) => E('beep', wd(6, i))); E('flip', wd(6, 26) - .1);
E('ok', wd(7, 5)); E('ok', wd(7, 6)); E('slip', wd(7, 7) + .15); E('buzz', wd(7, 10));
E('stamp', wd(8, 7)); E('chime', wd(8, 14) - .35); E('pop', wd(8, 14) + .5);
writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: scenes.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
