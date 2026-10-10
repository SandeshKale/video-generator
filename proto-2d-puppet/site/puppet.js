// 2D cut-out puppet v3. Mocap supplies bone directions (3/4 view, yaw ~10 deg, with depth foreshortening); the art keeps its own bone lengths.
// v3: capped torso/head lean (no cardboard sway), damped root sway, pelvis layer, ground solve from the shoe-sole pixels (lowest sole sits on the floor line).
// draw() returns diagnostics (soles, angles) used by the QA page and the shadow.
(function () {
var META = null, IMGS = {};
function load(cb) { fetch('parts.json').then(function (r) { return r.json(); }).then(function (m) { META = m; var n = 0, keys = Object.keys(m); keys.forEach(function (k) { var i = new Image(); i.onload = function () { if (++n === keys.length) cb(); }; i.src = 'parts/' + k + '.png'; IMGS[k] = i; }); }); }
var SHEET = { hip: [600, 495], neck: [600, 215], sL: [505, 265], sR: [695, 265], hL: [550, 500], hR: [650, 500] };
var SGN = null, UP = -Math.PI / 2, clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
function proj(P, o) {
  var ZF = o.zoom == null ? 0.0016 : o.zoom, yw = o.yaw == null ? 0.17 : o.yaw, cy = Math.cos(yw), sy_ = Math.sin(yw);
  if (SGN == null) SGN = P.sR[2] < P.sL[2] ? 1 : -1;
  var X0 = function (k) { return SGN * P[k][2] * cy + P[k][0] * sy_; }, ARMK = o.guardSpread == null ? 1.35 : o.guardSpread;
  var LEGK = o.legSpread == null ? 0.65 : o.legSpread;   // retarget the clip's wide stance toward the sheet's stance
  var X = function (k) { return /^[seh][LR]$/.test(k) ? X0('hip') + (X0(k) - X0('hip')) * ARMK : /^[kf][LR]$/.test(k) ? X0('hip') + (X0(k) - X0('hip')) * LEGK : X0(k); }
  var Dp = function (k) { return P[k][0] * cy - SGN * P[k][2] * sy_; };
  var Q = function (k) { return [X(k), -P[k][1]]; };
  var dir = function (a, b) { var A = Q(a), B = Q(b); return Math.atan2(B[1] - A[1], B[0] - A[0]); };
  var fore = function (a, b) { var A = Q(a), B = Q(b), dx = B[0] - A[0], dy = B[1] - A[1], dz = Dp(b) - Dp(a), l2 = Math.hypot(dx, dy), l3 = Math.hypot(l2, dz); return l3 < 1e-3 ? 1 : clamp(l2 / l3, 0.45, 1); };
  var wrapPI = function (a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  var dirP = function (a, b, prior) { var r = fore(a, b), w = clamp(r / 0.6, 0, 1); w = w * w * (3 - 2 * w); var ra = dir(a, b), vx = Math.cos(ra) * w + Math.cos(prior) * (1 - w), vy = Math.sin(ra) * w + Math.sin(prior) * (1 - w); return Math.atan2(vy, vx); };   // near-camera bones lean on the parent bone direction (vector blend, no wrap flips)
  var zoomAt = function (k) { return 1 + ZF * (Dp(k) - Dp('hip')); };
  return { X: X, Dp: Dp, Q: Q, dir: dir, fore: fore, dirP: dirP, zoomAt: zoomAt, ZF: ZF, clamp: clamp };
}
function faAngles(P, o) { var h = proj(P, o); return { R: h.dirP('eR', 'hR', h.dir('sR', 'eR')), L: h.dirP('eL', 'hL', h.dir('sL', 'eL')), uR: h.dir('sR', 'eR'), uL: h.dir('sL', 'eL') }; }
function draw(ctx, P, o) {
  var S = o.scale || 0.7, kk = 1.93 * S, floor = o.y, H = proj(P, o), X = H.X, Dp = H.Dp, Q = H.Q, dir = H.dir, fore = H.fore, dirP = H.dirP, zoomAt = H.zoomAt, ZF = H.ZF, FA = o.fa || null;
  var MAP = { L: 'R', R: 'L' };
  // trunk: lean capped at ~11 deg, head tilt capped at ~7 deg (the rest of the body motion stays in the limbs)
  var tRaw = dir('hip', 'neck'), tTh = UP + clamp((tRaw - UP) * 0.45, -0.2, 0.2), tr = Math.max(0.85, fore('hip', 'neck'));
  var hRaw = dir('neck', 'head'), hTh = UP + clamp((hRaw - UP) * 0.15, -0.06, 0.06);
  var torsoRot = tTh - UP, rot = function (v) { var c = Math.cos(torsoRot), s = Math.sin(torsoRot); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
  var attAt = function (hip, k) { var d = rot([(SHEET[k][0] - SHEET.hip[0]) * S, (SHEET[k][1] - SHEET.hip[1]) * S * tr]); return [hip[0] + d[0], hip[1] + d[1]]; };
  var SEGS = [], CALLS = {};
  var step = function (c, k, at, theta, r, zm) { var m = META[k], axis = Math.atan2(m.b[1] - m.a[1], m.b[0] - m.a[0]); if (c) { c.save(); c.translate(at[0], at[1]); c.rotate(theta); c.scale(S * zm * r, S * zm); c.rotate(-axis); c.drawImage(IMGS[k], -m.a[0], -m.a[1]); c.restore(); } var len = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]) * S * zm * r, e = [at[0] + Math.cos(theta) * len, at[1] + Math.sin(theta) * len]; if (c) { CALLS[k] = (CALLS[k] || 0) + 1; SEGS.push([at[0], at[1], e[0], e[1], k, Math.max(m.w, m.h) * S * 0.18]); } return e; };
  var legAng = function (s) { var m = MAP[s]; return { t: dir('hip', 'k' + m), tr: fore('hip', 'k' + m), tz: zoomAt('k' + m), s: dir('k' + m, 'f' + m), sr: fore('k' + m, 'f' + m), sz: zoomAt('f' + m) }; };
  // sole offset of a shin sprite (lowest opaque pixels) relative to the hip, via the exact transform used for drawing
  var soleOf = function (hip, s, c) {
    var g = legAng(s), a = attAt(hip, 'h' + s), kn = step(c, 'th' + s, a, g.t, g.tr, g.tz), m = META['sh' + s], axis = Math.atan2(m.b[1] - m.a[1], m.b[0] - m.a[0]), th = g.s, sx = S * g.sz * g.sr, sy = S * g.sz, best = -1e9, bx = 0;
    m.sole.forEach(function (p) { var vx = p[0] - m.a[0], vy = p[1] - m.a[1], ca = Math.cos(-axis), sa = Math.sin(-axis), rx = vx * ca - vy * sa, ry = vx * sa + vy * ca; rx *= sx; ry *= sy; var ct = Math.cos(th), st = Math.sin(th), X_ = kn[0] + rx * ct - ry * st, Y_ = kn[1] + rx * st + ry * ct; if (Y_ > best) { best = Y_; bx = X_; } });
    return { y: best, x: bx, knee: kn, g: g };
  };
  // ground solve: put the hip where the lowest sole touches the floor line
  var h0 = [o.x + X('hip') * kk * 0.5, 0], sL = soleOf(h0, 'L'), sR = soleOf(h0, 'R'), low = Math.max(sL.y, sR.y);
  var hip = [h0[0], floor - low];
  var legs = {}; ['L', 'R'].forEach(function (s) { legs[s] = soleOf(hip, s); });
  var arm = function (s) { var m = MAP[s], a = attAt(hip, 's' + s), el = step(ctx, 'up' + s, a, FA ? FA['u' + m] : dir('s' + m, 'e' + m), fore('s' + m, 'e' + m), zoomAt('s' + m)); step(ctx, 'fo' + s, el, FA ? FA[m] : dirP('e' + m, 'h' + m, dir('s' + m, 'e' + m)), fore('e' + m, 'h' + m), zoomAt('e' + m)); };
  var leg = function (s) { var g = legs[s].g, a = attAt(hip, 'h' + s), kn = step(ctx, 'th' + s, a, g.t, g.tr, g.tz); step(ctx, 'sh' + s, kn, g.s, g.sr, g.sz); };
  var limbs = [['arm', 'L', Dp('h' + MAP.L) - Dp('hip')], ['arm', 'R', Dp('h' + MAP.R) - Dp('hip')], ['leg', 'L', Dp('f' + MAP.L) - Dp('hip')], ['leg', 'R', Dp('f' + MAP.R) - Dp('hip')]];
  var behind = function (l) { return l[2] < (l[0] === 'arm' ? 25 : 0); }, by = function (a, b) { return a[2] - b[2]; };
  step(ctx, 'pelvis', hip, tTh, tr, 1);                                              // fills the hip arc behind the thighs
  limbs.filter(behind).sort(by).forEach(function (l) { (l[0] === 'arm' ? arm : leg)(l[1]); });
  step(ctx, 'torso', hip, tTh, tr, 1);
  limbs.filter(function (l) { return !behind(l); }).sort(by).forEach(function (l) { (l[0] === 'arm' ? arm : leg)(l[1]); });
  step(ctx, 'head', attAt(hip, 'neck'), hTh, 1, 1 + ZF * (Dp('head') - Dp('hip')));
  return { segs: SEGS, calls: CALLS, floor: floor, hip: hip, soles: { L: [legs.L.x, legs.L.y], R: [legs.R.x, legs.R.y] }, torso: tTh - UP, head: hTh - UP, torsoRaw: tRaw - UP, headRaw: hRaw - UP, ang: [FA ? FA.uR : dir('sR', 'eR'), FA ? FA.R : dirP('eR', 'hR', dir('sR', 'eR')), FA ? FA.uL : dir('sL', 'eL'), FA ? FA.L : dirP('eL', 'hL', dir('sL', 'eL')), dir('hip', 'kR'), dir('kR', 'fR'), dir('hip', 'kL'), dir('kL', 'fL')] };
}
window.PUPPET = { load: load, draw: draw, faAngles: faAngles };
})();
