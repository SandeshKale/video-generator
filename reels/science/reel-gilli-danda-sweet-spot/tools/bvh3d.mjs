// BVH (CMU mocap) -> projected 2D joint tracks for the 12-joint rig. Output: site/mocap.js (window.MOCAP).
// Forward kinematics at build time; the runtime just samples frames (+lerp), so every pose is a pure function of t.
// Data: CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), see assets/mocap/cmu/READMEFIRST.txt.
import { readFileSync, writeFileSync } from 'node:fs';
const DIR = new URL('../../../../assets/mocap/cmu/', import.meta.url);
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

// 3D joint tracks for the gilli-danda figurines: FK -> normalised units (hip-to-ankle leg length = 1), y up, 30 fps.
// swing clips are yawed so the hand velocity at impact points +x (the swing lies in the x-y plane, camera looks down -z).
const KEYS = { hip: 'Hips', neck: 'Neck1', head: 'Head', sL: 'LeftArm', sR: 'RightArm', eL: 'LeftForeArm', eR: 'RightForeArm', hL: 'LeftHand', hR: 'RightHand', uL: 'LeftUpLeg', uR: 'RightUpLeg', kL: 'LeftLeg', kR: 'RightLeg', fL: 'LeftFoot', fR: 'RightFoot', tL: 'LeftToeBase', tR: 'RightToeBase' };
const names = Object.keys(KEYS);
const CL = { swingA: ['64_01', 'swing'], swingB: ['64_02', 'swing'], swingC: ['64_03', 'swing'], run: ['02_03', 'loop'], walk: ['02_01', 'loop'] };
const out = {};
for (const [name, [file, kind]] of Object.entries(CL)) {
  const b = parse(readFileSync(new URL(file + '.bvh', DIR), 'utf8'));
  const idx = (n) => b.joints.findIndex((j) => j.name === n); const ids = names.map((k) => idx(KEYS[k])); if (ids.includes(-1)) throw new Error('missing joint ' + file);
  const p0 = fk(b, 0), d = (a, c) => Math.hypot(...a.map((v, k) => v - c[k]));
  const leg = d(p0[idx('LeftUpLeg')], p0[idx('LeftLeg')]) + d(p0[idx('LeftLeg')], p0[idx('LeftFoot')]), sc = 1 / leg;
  const step = Math.max(1, Math.round(1 / b.ft / 30)), all = []; for (let f = 0; f < b.nf; f += step) all.push(fk(b, f));
  const dt = b.ft * step;
  let f0 = 0, f1 = all.length - 1, impact = -1, yaw = 0;
  if (kind === 'swing') { // impact = max hand speed in the second half
    let best = 0; const H = (P) => { const a = P[idx('LeftHand')], c = P[idx('RightHand')]; return [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2]; };
    for (let f = 2; f < all.length - 2; f++) { const a = H(all[f - 1]), c = H(all[f + 1]); const v = d(a, c); if (v > best && f > all.length * 0.3) { best = v; impact = f; } }
    f0 = Math.max(0, impact - Math.round(2.2 / dt)); f1 = Math.min(all.length - 1, impact + Math.round(1.2 / dt));
    // yaw: the figure stands on the -x side with the club tip ahead (+x) and the downswing lying in the x-y plane
    const tipOf = (P, y) => { const c0 = Math.cos(y), s0 = Math.sin(y), r = (q) => [q[0] * c0 - q[2] * s0, q[1], q[0] * s0 + q[2] * c0]; const hl = r(P[idx('LeftHand')]), hr = r(P[idx('RightHand')]), el = r(P[idx('LeftForeArm')]), er = r(P[idx('RightForeArm')]);
      const gp = [(hl[0] + hr[0]) / 2, (hl[1] + hr[1]) / 2, (hl[2] + hr[2]) / 2], em = [(el[0] + er[0]) / 2, (el[1] + er[1]) / 2, (el[2] + er[2]) / 2], dv = gp.map((v, k) => v - em[k]), dl = Math.hypot(...dv) || 1;
      return { tip: gp.map((v, k) => v + dv[k] / dl * leg * 1.7), root: r(P[idx('Hips')]) }; };
    let bc = 1e18; for (let yd = 0; yd < 360; yd += 5) { const y = yd * D2R, T = tipOf(all[impact], y); let cost = 0; for (let k = 1; k <= 12; k++) cost += Math.abs(tipOf(all[impact - k], y).tip[2] - T.tip[2]) * 3 / leg; cost += Math.max(0, 1.3 * leg - (T.tip[0] - T.root[0])) * 40 / leg; if (cost < bc) { bc = cost; yaw = y; } }
  }
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const rot = (p) => [p[0] * cy - p[2] * sy, p[1], p[0] * sy + p[2] * cy];
  let minY = 1e9; for (let f = f0; f <= f1; f++) for (const k of ['fL', 'fR', 'tL', 'tR']) minY = Math.min(minY, all[f][idx(KEYS[k])][1]);
  const root0 = rot(all[f0][idx('Hips')]);
  const frames = []; for (let f = f0; f <= f1; f++) { const P = all[f], row = []; for (const k of names) { let p = rot(P[idx(KEYS[k])]); if (k === 'head') { const e = rot(P[idx('Head_end')]); p = [(p[0] + e[0]) / 2, (p[1] + e[1]) / 2, (p[2] + e[2]) / 2]; } row.push(Math.round((p[0] - (kind === 'loop' ? 0 : root0[0])) * sc * 1000) / 1000, Math.round((p[1] - minY) * sc * 1000) / 1000, Math.round((p[2] - (kind === 'loop' ? 0 : root0[2])) * sc * 1000) / 1000); } frames.push(row); }
  let fr = frames;
  if (kind === 'loop') { // crop the best seamless cycle on joint poses relative to the hips
    const rel = (f) => { const o = []; for (let k = 0; k < f.length; k += 3) o.push(f[k] - f[0], f[k + 1], f[k + 2] - f[2]); return o; };
    const R = frames.map(rel), dist = (a, b2) => a.reduce((s, v, k) => s + (v - b2[k]) ** 2, 0), minLen = name === 'walk' ? 18 : 12; let bst = [1e18, 0, 0];
    for (let i = 0; i < frames.length - minLen - 3; i++) for (let j = i + minLen; j < frames.length - 1; j++) { const dd = dist(R[i], R[j]) + dist(R[i + 1], R[j + 1]); if (dd < bst[0]) bst = [dd, i, j]; }
    fr = frames.slice(bst[1], bst[2] + 1); console.log('  loop', bst[1], bst[2]);
  }
  out[name] = { fps: Math.round(1 / dt), n: fr.length, joints: names, impact: kind === 'swing' ? impact - f0 : -1, f: fr };
  console.log(name, file, 'frames', fr.length, 'fps', Math.round(1 / dt), 'impact', out[name].impact, 'yaw', (yaw * 57.3).toFixed(0));
}
writeFileSync(new URL('../site/mocap3d.js', import.meta.url), 'window.MOCAP3=' + JSON.stringify(out) + ';\n');
