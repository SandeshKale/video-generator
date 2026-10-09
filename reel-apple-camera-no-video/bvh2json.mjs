// BVH (CMU mocap) -> projected 2D joint tracks for the 12-joint rig. Output: site/mocap.js (window.MOCAP).
// Forward kinematics at build time; the runtime just samples frames (+lerp), so every pose is a pure function of t.
// Data: CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), see assets/mocap/cmu/READMEFIRST.txt.
import { readFileSync, writeFileSync } from 'node:fs';
const DIR = new URL('../assets/mocap/cmu/', import.meta.url);
const CLIPS = { // name: [file, startSec, endSec, facing ('travel'|'hips')]
  walk: ['02_01', 0, 4.2, 'travel'], run: ['02_03', 0, 3.5, 'travel'], stealth: ['17_03', 2, 14, 'travel'], gest: ['18_08', 1, 14, 'hips'],
  point: ['13_27', 0, 12, 'hips'], shrug: ['111_25', 0, 2.4, 'hips'], sit: ['13_01', 0, 9, 'hips'], dance: ['55_01', 0, 6, 'hips'],
};
function parse(txt) {
  const tok = txt.split(/\s+/).filter(Boolean); let i = 0; const joints = []; let nf = 0, ft = 0.0083333;
  const stack = [];
  function readJoint(parent, name) {
    const j = { name, parent, off: [0, 0, 0], ch: [] }; joints.push(j); i++; // '{'
    while (tok[i] !== '}') {
      if (tok[i] === 'OFFSET') { j.off = [+tok[i + 1], +tok[i + 2], +tok[i + 3]]; i += 4; }
      else if (tok[i] === 'CHANNELS') { const n = +tok[i + 1]; j.ch = tok.slice(i + 2, i + 2 + n); i += 2 + n; }
      else if (tok[i] === 'JOINT') { const nm = tok[i + 1]; i += 2; readJoint(joints.indexOf(j), nm); }
      else if (tok[i] === 'End') { // End Site
        i += 2; i++; const off = [+tok[i + 1], +tok[i + 2], +tok[i + 3]]; i += 4; i++;
        joints.push({ name: j.name + '_end', parent: joints.indexOf(j), off, ch: [], end: true });
      } else throw new Error('bvh parse ' + tok[i]);
    }
    i++; // '}'
  }
  while (tok[i] !== 'ROOT') i++; i++; const rn = tok[i++]; readJoint(-1, rn);
  while (tok[i] !== 'Frames:') i++; nf = +tok[i + 1]; i += 2; while (tok[i] !== 'Time:') i++; ft = +tok[i + 1]; i += 2;
  const nch = joints.reduce((s, j) => s + j.ch.length, 0); const data = new Float32Array(nf * nch);
  for (let k = 0; k < data.length; k++) data[k] = +tok[i + k];
  return { joints, nf, ft, nch, data };
}
const D2R = Math.PI / 180;
const mul = (a, b) => { const r = new Array(9); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j]; return r; };
const rx = (a) => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
const ry = (a) => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)];
const rz = (a) => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1];
function fk(b, f) {
  const P = [], R = []; let c = f * b.nch;
  b.joints.forEach((j, ji) => {
    let pos = j.off.slice(), M = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    for (const ch of j.ch) { const v = b.data[c++]; if (ch === 'Xposition') pos[0] += v; else if (ch === 'Yposition') pos[1] += v; else if (ch === 'Zposition') pos[2] += v; else if (ch === 'Xrotation') M = mul(M, rx(v * D2R)); else if (ch === 'Yrotation') M = mul(M, ry(v * D2R)); else if (ch === 'Zrotation') M = mul(M, rz(v * D2R)); }
    if (j.parent < 0) { P[ji] = pos; R[ji] = M; }
    else { const pr = R[j.parent], pp = P[j.parent]; P[ji] = [pp[0] + pr[0] * pos[0] + pr[1] * pos[1] + pr[2] * pos[2], pp[1] + pr[3] * pos[0] + pr[4] * pos[1] + pr[5] * pos[2], pp[2] + pr[6] * pos[0] + pr[7] * pos[1] + pr[8] * pos[2]]; R[ji] = mul(pr, M); }
  });
  return P;
}
const out = {};
for (const [name, [file, s0, s1, face]] of Object.entries(CLIPS)) {
  const b = parse(readFileSync(new URL(file + '.bvh', DIR), 'utf8'));
  const idx = (n) => b.joints.findIndex((j) => j.name === n);
  const J = { hip: 'Hips', neck: 'Neck1', head: 'Head', sL: 'LeftArm', sR: 'RightArm', eL: 'LeftForeArm', eR: 'RightForeArm', hL: 'LeftHand', hR: 'RightHand', kL: 'LeftLeg', kR: 'RightLeg', fL: 'LeftFoot', fR: 'RightFoot', tL: 'LeftToeBase', tR: 'RightToeBase' };
  const keys = Object.keys(J), ids = keys.map((k) => idx(J[k])); if (ids.includes(-1)) throw new Error('missing joint in ' + file);
  const headEnd = idx('Head_end');
  // scale: leg length (hip->knee->ankle) = 190 px
  const p0 = fk(b, 0); const d = (a, c) => Math.hypot(...a.map((v, k) => v - c[k]));
  const legLen = d(p0[idx('LeftUpLeg')], p0[idx('LeftLeg')]) + d(p0[idx('LeftLeg')], p0[idx('LeftFoot')]); const sc = 200 / legLen;
  const step = Math.max(1, Math.round(1 / b.ft / 60)), f0 = Math.floor(s0 / b.ft), f1 = Math.min(b.nf - 1, Math.floor(s1 / b.ft));
  const raw = []; for (let f = f0; f <= f1; f += step) raw.push(fk(b, f));
  // facing: forward axis (xz) -> screen +x
  let fx, fz; const a = raw[0][idx('Hips')], z = raw[raw.length - 1][idx('Hips')];
  const tr = Math.hypot(z[0] - a[0], z[2] - a[2]);
  if (face === 'travel' && tr > 5) { fx = (z[0] - a[0]) / tr; fz = (z[2] - a[2]) / tr; }
  else { const l = raw[0][idx('LeftUpLeg')], r = raw[0][idx('RightUpLeg')]; const hx = l[0] - r[0], hz = l[2] - r[2]; const hl = Math.hypot(hx, hz); fx = -hz / hl; fz = hx / hl; if (fx * 1 + 0 < 0 && false) { fx = -fx; fz = -fz; } }
  // ground: lowest foot/toe over clip -> y=0 ; x relative to start root
  let minY = 1e9; for (const P of raw) for (const k of ['fL', 'fR', 'tL', 'tR']) minY = Math.min(minY, P[idx(J[k])][1]);
  const x0 = (a[0] * fx + a[2] * fz);
  const frames = raw.map((P) => {
    const row = [];
    for (const k of keys) {
      if (k === 'tL' || k === 'tR') continue;
      let p = P[idx(J[k])];
      if (k === 'head') { const e = P[headEnd]; p = [(p[0] + e[0]) / 2, (p[1] + e[1]) / 2, (p[2] + e[2]) / 2]; }
      row.push(Math.round((p[0] * fx + p[2] * fz - x0) * sc * 10) / 10, Math.round((p[1] - minY) * sc * 10) / 10, Math.round((-p[0] * fz + p[2] * fx) * sc * 10) / 10);
    }
    // toe tips as extra points for foot direction
    for (const k of ['tL', 'tR']) { const p = P[idx(J[k])]; row.push(Math.round((p[0] * fx + p[2] * fz - x0) * sc * 10) / 10, Math.round((p[1] - minY) * sc * 10) / 10, Math.round((-p[0] * fz + p[2] * fx) * sc * 10) / 10); }
    return row;
  });
  let fr = frames;
  if (name === 'walk' || name === 'run' || name === 'stealth') { // crop to the best seamless cycle (pose + velocity match between first and last frame)
    const rel = (f) => { const o = []; for (let k = 0; k < f.length; k += 3) { o.push(f[k] - f[0], f[k + 1], f[k + 2]); } return o; };
    const R = frames.map(rel); const dist = (a, b) => a.reduce((s, v, k) => s + (v - b[k]) ** 2, 0);
    const minLen = name === 'run' ? 28 : name === 'stealth' ? 60 : 40; let best = [1e18, 0, 0];
    for (let i = 0; i < frames.length - minLen - 3; i++) for (let j = i + minLen; j < frames.length - 1; j++) { const d = dist(R[i], R[j]) + dist(R[i + 1], R[j + 1]); if (d < best[0]) best = [d, i, j]; }
    fr = frames.slice(best[1], best[2] + 1); console.log('  loop', best[1], best[2], 'err', best[0].toFixed(0));
  }
  out[name] = { fps: 60, n: fr.length, joints: keys.filter((k) => k !== 'tL' && k !== 'tR').concat(['tL', 'tR']), f: fr };
  console.log(name, file, 'frames', frames.length, 'travel', Math.round(tr * sc), 'minY', minY.toFixed(1));
}
writeFileSync(new URL('./site/mocap.js', import.meta.url), 'window.MOCAP=' + JSON.stringify(out) + ';\n');
