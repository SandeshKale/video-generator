// Resolves timeline.mjs specs against timing.json -> site/data.js
import { readFileSync, writeFileSync } from 'node:fs';
import { SCENES } from './timeline.mjs';
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url)));
const script = JSON.parse(readFileSync(new URL('./script.json', import.meta.url)));

const TK = ['t', 't0', 't1', 'litT', 'th', 'tCut', 'tPause'];
function mk(sc) {
  const resolve = (v) => {
    if (typeof v === 'number') return sc.start + v;
    if (v === 'end') return sc.end;
    let m;
    const off = (s) => (s ? Number(s) : 0);
    if ((m = /^b(\d+)([+-][\d.]+)?$/.exec(v))) return sc.beats[+m[1]].start + off(m[2]);
    if ((m = /^e(\d+)([+-][\d.]+)?$/.exec(v))) return sc.beats[+m[1]].end + off(m[2]);
    if ((m = /^w(\d+)\.(\d+)([+-][\d.]+)?$/.exec(v))) {
      const b = sc.beats[+m[1]]; const w = b.words[Math.min(+m[2], b.words.length - 1)];
      return w.s + off(m[3]);
    }
    throw new Error('bad time spec ' + v);
  };
  const walk = (o) => {
    if (Array.isArray(o)) return o.map(walk);
    if (o && typeof o === 'object') {
      const r = {};
      for (const [k, v] of Object.entries(o)) {
        if (TK.includes(k) && typeof v === 'string') r[k] = resolve(v);
        else if (TK.includes(k) && typeof v === 'number') r[k] = v < -50 ? v : sc.start + v;
        else r[k] = walk(v);
      }
      return r;
    }
    return o;
  };
  return { walk, resolve };
}

function capChunks(sc) {
  const out = [];
  const spec = script.scenes.find((x) => x.id === sc.id);
  sc.beats.forEach((b, bi) => {
    const text = spec.beats[bi]; const toks = text.split(/\s+/);
    const ws = b.words.length === toks.length ? b.words.map((w, i) => ({ ...w, w: toks[i] })) : b.words;
    // sentence boundaries by token (token ends with . ? !)
    const units = []; let cur = [];
    ws.forEach((w, i) => { cur.push(w); if (/[.!?]$/.test(toks[i] || '') || i === ws.length - 1) { units.push(cur); cur = []; } });
    // split overlong sentences at commas / midpoint
    const parts = [];
    for (const u of units) {
      if (u.length <= 15) { parts.push(u); continue; }
      let seg = [];
      for (const w of u) { seg.push(w); if (seg.length >= 7 && /,$/.test(w.w) && u.length - parts.flat().length > 4) { parts.push(seg); seg = []; } }
      if (seg.length) { if (seg.length > 15) { const m = Math.ceil(seg.length / 2); parts.push(seg.slice(0, m), seg.slice(m)); } else parts.push(seg); }
    }
    // merge short neighbours up to 14 words
    const merged = [];
    for (const p of parts) { const last = merged[merged.length - 1]; if (last && last.length + p.length <= 14) merged[merged.length - 1] = last.concat(p); else merged.push(p); }
    for (const p of merged) out.push({ start: p[0].s, end: p[p.length - 1].e, words: p });
  });
  return out;
}
const scenes = T.scenes.map((sc) => {
  const spec = SCENES[sc.id];
  if (!spec) throw new Error('no spec for ' + sc.id);
  const { walk } = mk(sc);
  const layers = spec.layers.map((L) => {
    const r = walk({ ...L, t0: L.t0 ?? 0 });
    if (r.t1 == null) r.t1 = sc.end + 0.12;
    else if (typeof L.t1 === 'string' && L.t1 !== 'end') r.t1 += 0;
    return r;
  });
  return { id: sc.id, shot: sc.shot, start: sc.start, end: sc.end,  beats: sc.beats.map((b, bi) => { const tx = script.scenes.find((x) => x.id === sc.id).beats[bi].split(/\s+/); const ws = b.words.length === tx.length ? b.words.map((w, i) => ({ ...w, w: tx[i] })) : b.words; return { start: b.start, end: b.end, words: ws }; }), caps: capChunks(sc), layers };
});
// scene overlap: the whip transition starts TR before `end`; keep layers ending with the scene.
import { readFileSync as rf, existsSync } from 'node:fs';
const icons = {};
for (const n of ['robot', 'car', 'lock', 'lock-open', 'calendar', 'file-text', 'users', 'school', 'map-pin', 'check', 'x', 'clock', 'briefcase', 'arrow-right']) {
  const src = rf(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8');
  icons[n] = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
}
const missing = new Set();
for (const sc of scenes) for (const l of sc.layers) if (l.img && !existsSync(new URL(`./shots/${l.img}.png`, import.meta.url))) missing.add(l.img);
if (missing.size) console.log('MISSING IMAGES:', [...missing].join(', '));
const data = { total: T.total, scenes, icons };
writeFileSync(new URL('./site/data.js', import.meta.url), 'window.DATA=' + JSON.stringify(data) + ';\n');
writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify(scenes.map((s) => ({ id: s.id, start: s.start, end: s.end, layers: s.layers.map((l) => ({ type: l.type, t0: l.t0, t1: l.t1 })) }))));
console.log('data.js scenes', scenes.length, 'total', T.total.toFixed(1));
