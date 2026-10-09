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
for (const n of ['check', 'x', 'video', 'camera', 'lock', 'cloud-upload', 'headphones', 'calendar', 'movie', 'file-text']) {
  const src = readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8');
  icons[n] = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
}
const scenes = T.scenes.map((sc) => ({ id: sc.id, start: sc.start, end: sc.end, beats: sc.beats.map((b, bi) => { const tx = script.scenes.find((x) => x.id === sc.id).beats[bi].split(/\s+/); return { start: b.start, end: b.end, words: b.words.length === tx.length ? b.words.map((w, i) => ({ ...w, w: tx[i] })) : b.words }; }), caps: capChunks(sc) }));
writeFileSync(new URL('./site/data.js', import.meta.url), 'window.DATA=' + JSON.stringify({ total: T.total, scenes, icons }) + ';\n');
console.log('data.js', scenes.length, 'scenes', T.total.toFixed(1), 's');

// ---- sfx events (absolute seconds) tied to the same word times the visuals use ----
import { writeFileSync as wf } from 'node:fs';
const wd = (si, i) => { const w = scenes[si].beats[0].words; return w[Math.min(i, w.length - 1)].s; };
const ev = []; const E = (k, t, o = {}) => ev.push({ k, t: +t.toFixed(3), ...o });
E('thump', 0); E('note', 0.15); E('click', wd(0, 5)); E('stamp', wd(0, 7)); E('note', wd(0, 4)); E('note', wd(0, 7));
for (let i = 1; i < scenes.length; i++) E('whoosh', scenes[i].start - 0.1);
E('note', wd(1, 2)); E('note', wd(1, 6)); E('pop', wd(1, 8)); E('pop', wd(1, 9)); E('note', wd(1, 18)); E('spin', wd(1, 0) + 0.4, { dur: 5 });
E('note', wd(2, 5)); E('note', wd(2, 17)); E('yip', wd(2, 23) - 0.4); E('note', wd(2, 27)); E('note', wd(2, 36)); E('blip', wd(2, 13));
E('note', scenes[3].start + 0.4); E('tag', wd(3, 4)); E('note', wd(3, 4) + 0.4); E('tag', wd(3, 9)); E('note', wd(3, 9) + 0.4); E('tag', wd(3, 16)); E('door', scenes[3].start + 0.1);
E('note', scenes[4].start + 0.3); E('pop', wd(4, 7)); E('click', wd(4, 11)); E('alarm', wd(4, 15)); E('note', wd(4, 12)); E('wah', wd(4, 16) + 0.2);
E('note', scenes[5].start + 0.3); E('tiptoe', scenes[5].start + 0.1, { dur: 3.5 }); E('pop', wd(5, 13)); E('note', wd(5, 19)); E('stamp', wd(5, 23)); E('wah', wd(5, 22)); E('stamp', wd(5, 25));
E('note', scenes[6].start + 0.4); [18, 20, 22].forEach((i) => { E('click', wd(6, i)); E('pop', wd(6, i)); }); E('note', wd(6, 18)); E('note', wd(6, 22));
E('note', scenes[7].start + 0.3); E('stamp', wd(7, 7) + 0.3); E('flip', wd(7, 16)); E('note', wd(7, 18)); E('slide', wd(7, 20)); E('ping', wd(7, 24)); E('note', wd(7, 30));
E('note', scenes[8].start + 0.3); E('note', wd(8, 9)); E('chime', wd(8, 12) - 0.4); E('pop', wd(8, 12) + 0.5);
wf(new URL('./events.json', import.meta.url), JSON.stringify({ scenes: scenes.map((s) => ({ id: s.id, start: s.start, end: s.end })), sfx: ev }));
console.log('events', ev.length);
