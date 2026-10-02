// Resolves timeline.mjs specs against timing.json -> site/data.js
import { readFileSync, writeFileSync } from 'node:fs';
import { SCENES } from './timeline.mjs';
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url)));
const script = JSON.parse(readFileSync(new URL('./script.json', import.meta.url)));

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
        if ((k === 't' || k === 't0' || k === 't1' || k === 'litT') && typeof v === 'string') r[k] = resolve(v);
        else if ((k === 't' || k === 't0' || k === 't1' || k === 'litT') && typeof v === 'number') r[k] = v < -50 ? v : sc.start + v;
        else r[k] = walk(v);
      }
      return r;
    }
    return o;
  };
  return { walk, resolve };
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
  return { id: sc.id, shot: sc.shot, start: sc.start, end: sc.end, move: spec.move ?? 0, dim: spec.dim, glitch: !!spec.glitch, beats: sc.beats.map((b) => ({ start: b.start, end: b.end, words: b.words })), layers };
});
// scene overlap: the whip transition starts TR before `end`; keep layers ending with the scene.
const data = { total: T.total, scenes };
writeFileSync(new URL('./site/data.js', import.meta.url), 'window.DATA=' + JSON.stringify(data) + ';\n');
writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify(scenes.map((s) => ({ id: s.id, start: s.start, end: s.end, layers: s.layers.map((l) => ({ type: l.type, t0: l.t0, t1: l.t1 })) }))));
console.log('data.js scenes', scenes.length, 'total', T.total.toFixed(1));
