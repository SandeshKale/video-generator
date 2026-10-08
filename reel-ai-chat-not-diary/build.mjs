// Resolves timeline.mjs specs against timing.json -> site/data.js
import { readFileSync, writeFileSync } from 'node:fs';
import { SCENES } from './timeline.mjs';
const T = JSON.parse(readFileSync(new URL('./timing.json', import.meta.url)));
const script = JSON.parse(readFileSync(new URL('./script.json', import.meta.url)));

const TK = ['t', 't0', 't1', 'e1', 'e2', 'e3', 'ts', 'ta', 'to', 'tb', 'nc', 'q', 'hlT', 'cnt', 'cal', 'sealT', 'stampT'];
const ARR = ['ts', 'r'];
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
        else if (ARR.includes(k) && Array.isArray(v)) r[k] = v.map((x) => (typeof x === 'number' ? (x < -50 ? x : sc.start + x) : resolve(x)));
        else r[k] = walk(v);
      }
      return r;
    }
    return o;
  };
  return { walk, resolve };
}

function fixW(ws) { const o = []; for (let i = 0; i < ws.length; i++) { if (ws[i].w === 'GPT-6' && ws[i + 1] && ws[i + 1].w === '1') { o.push({ ...ws[i], w: 'GPT-6.1', e: ws[i + 1].e }); i++; } else o.push(ws[i]); } return o; }
function capChunks(sc) {
  const out = [];
  const spec = script.scenes.find((x) => x.id === sc.id);
  sc.beats.forEach((b, bi) => {
    const text = spec.beats[bi]; const toks = text.split(/\s+/);
    const ws = fixW(b.words.length === toks.length ? b.words.map((w, i) => ({ ...w, w: toks[i] })) : b.words);
    // sentence boundaries by token (token ends with . ? !)
    const units = []; let cur = [];
    ws.forEach((w, i) => { cur.push(w); if (/[.!?]$/.test(toks[i] || '') || i === ws.length - 1) { units.push(cur); cur = []; } });
    const len = (u) => u.map((w) => w.w).join(' ').length;
    const split = (u) => { if (len(u) <= 50 || u.length < 2) return [u]; let best = Math.ceil(u.length / 2), bd = 1e9; for (let i = 2; i <= u.length - 2; i++) { const d = Math.abs(len(u.slice(0, i)) - len(u.slice(i))) - (/,$/.test(u[i - 1].w) ? 12 : 0); if (d < bd) { bd = d; best = i; } } return [...split(u.slice(0, best)), ...split(u.slice(best))]; };
    const parts = units.flatMap(split);
    const merged = [];
    for (const p of parts) { const last = merged[merged.length - 1]; if (last && len(last.concat(p)) <= 50) merged[merged.length - 1] = last.concat(p); else merged.push(p); }
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
  return { id: sc.id, shot: sc.shot, start: sc.start, end: sc.end,  beats: sc.beats.map((b, bi) => { const tx = script.scenes.find((x) => x.id === sc.id).beats[bi].split(/\s+/); const ws = fixW(b.words.length === tx.length ? b.words.map((w, i) => ({ ...w, w: tx[i] })) : b.words); return { start: b.start, end: b.end, words: ws }; }), caps: capChunks(sc), layers, sfx: (spec.sfx || []).map((e) => walk(e)) };
});
// scene overlap: the whip transition starts TR before `end`; keep layers ending with the scene.
import { readFileSync as rf, existsSync } from 'node:fs';
const icons = {};
for (const n of ['message-circle','flag','eye','shield-check','search','calendar','alert-triangle','file-text','lock','scale','user','notebook']) {
  const src = rf(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8');
  icons[n] = [...src.matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
}
const missing = new Set();
for (const sc of scenes) for (const l of sc.layers) if (l.img && !existsSync(new URL(`./shots/${l.img}.png`, import.meta.url))) missing.add(l.img);
if (missing.size) console.log('MISSING IMAGES:', [...missing].join(', '));
const logo = (f) => rf(new URL(`../assets/logos/gilbarbara/${f}`, import.meta.url), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/g, '').replace(/ fill="[^"]*"/g, '').replace(/<svg ([^>]*)>/, (m, a) => `<svg ${a.replace(/ (width|height)="[^"]*"/g, '')} fill="currentColor" width="46" height="46">`);
const logos = { anthropic: logo('anthropic-icon.svg'), openai: logo('openai-icon.svg') };
const data = { total: T.total, scenes, icons, logos };
writeFileSync(new URL('./site/data.js', import.meta.url), 'window.DATA=' + JSON.stringify(data) + ';\n');
writeFileSync(new URL('./events.json', import.meta.url), JSON.stringify(scenes.map((s) => ({ id: s.id, start: s.start, end: s.end, layers: s.layers.map((l) => ({ type: l.type, t0: l.t0, t1: l.t1 })), sfx: s.sfx }))));
console.log('data.js scenes', scenes.length, 'total', T.total.toFixed(1));
