// 2D cut-out puppet, FRONT-VIEW retarget. The character faces the camera; the mocap's forward axis points at the viewer, so
// punches/steps toward the camera become foreshortened (shorter along their axis) and grow slightly (nearer). Bone directions come
// from the projected mocap, bone lengths from the art. Art-left parts (viewer's left) follow the mocap's right-side joints.
(function () {
var META = null, IMGS = {};
function load(cb) { fetch('parts.json').then(function (r) { return r.json(); }).then(function (m) { META = m; var n = 0, keys = Object.keys(m); keys.forEach(function (k) { var i = new Image(); i.onload = function () { if (++n === keys.length) cb(); }; i.src = 'parts/' + k + '.png'; IMGS[k] = i; }); }); }
var SHEET = { hip: [600, 495], neck: [600, 215], sL: [505, 265], sR: [695, 265], hL: [550, 500], hR: [650, 500] };
var SGN = null;
function draw(ctx, P, o) {
  var S = o.scale || 0.7, kk = 1.93 * S, ZF = o.zoom == null ? 0.0016 : o.zoom, yw = o.yaw == null ? 0.6 : o.yaw, cy = Math.cos(yw), sy_ = Math.sin(yw);
  if (SGN == null) SGN = P.sR[2] < P.sL[2] ? 1 : -1;                                   // rig-right on the viewer's left
  var X = function (k) { return SGN * P[k][2] * cy + P[k][0] * sy_; }, Dp = function (k) { return P[k][0] * cy - SGN * P[k][2] * sy_; };   // 3/4 view: screen x mixes lateral+forward; Dp = depth toward the camera
  var Q = function (k) { return [X(k), -P[k][1]]; };
  var dir = function (a, b) { var A = Q(a), B = Q(b); return Math.atan2(B[1] - A[1], B[0] - A[0]); };
  var fore = function (a, b) { var A = Q(a), B = Q(b), dx = B[0] - A[0], dy = B[1] - A[1], dz = Dp(b) - Dp(a), l2 = Math.hypot(dx, dy), l3 = Math.hypot(l2, dz); return l3 < 1e-3 ? 1 : Math.max(0.4, Math.min(1, l2 / l3)); };
  var zoomAt = function (k) { return 1 + ZF * (Dp(k) - Dp('hip')); };
  var lowF = Math.min(P.fL[1], P.fR[1]), hip = [o.x + X('hip') * kk, o.y - ((P.hip[1] - lowF) * kk - 8 * S)];
  var put = function (k, at, theta, r, zm) { var m = META[k], axis = Math.atan2(m.b[1] - m.a[1], m.b[0] - m.a[0]); ctx.save(); ctx.translate(at[0], at[1]); ctx.rotate(theta); ctx.scale(S * zm * r, S * zm); ctx.rotate(-axis); ctx.drawImage(IMGS[k], -m.a[0], -m.a[1]); ctx.restore(); var len = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]) * S * zm * r; return [at[0] + Math.cos(theta) * len, at[1] + Math.sin(theta) * len]; };
  var tTh = dir('hip', 'neck'), torsoRot = tTh - (-Math.PI / 2), tr = fore('hip', 'neck');
  var rot = function (v) { var c = Math.cos(torsoRot), s = Math.sin(torsoRot); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
  var att = function (k) { var d = rot([(SHEET[k][0] - SHEET.hip[0]) * S, (SHEET[k][1] - SHEET.hip[1]) * S * tr]); return [hip[0] + d[0], hip[1] + d[1]]; };
  var MAP = { L: 'R', R: 'L' };                                                          // art side -> mocap side
  var arm = function (s) { var m = MAP[s], a = att('s' + s), z1 = zoomAt('s' + m), el = put('up' + s, a, dir('s' + m, 'e' + m), fore('s' + m, 'e' + m), z1); put('fo' + s, el, dir('e' + m, 'h' + m), fore('e' + m, 'h' + m), zoomAt('e' + m)); };
  var leg = function (s) { var m = MAP[s], a = att('h' + s), kn = put('th' + s, a, dir('hip', 'k' + m), fore('hip', 'k' + m), zoomAt('k' + m)); put('sh' + s, kn, dir('k' + m, 'f' + m), fore('k' + m, 'f' + m), zoomAt('f' + m)); };
  var limbs = [['arm', 'L', Dp('h' + MAP.L) - Dp('hip')], ['arm', 'R', Dp('h' + MAP.R) - Dp('hip')], ['leg', 'L', Dp('f' + MAP.L) - Dp('hip')], ['leg', 'R', Dp('f' + MAP.R) - Dp('hip')]];
  limbs.filter(function (l) { return l[2] < (l[0] === 'arm' ? 25 : 0); }).sort(function (a, b) { return a[2] - b[2]; }).forEach(function (l) { (l[0] === 'arm' ? arm : leg)(l[1]); });
  put('torso', hip, tTh, tr, 1);
  limbs.filter(function (l) { return !(l[2] < (l[0] === 'arm' ? 25 : 0)); }).sort(function (a, b) { return a[2] - b[2]; }).forEach(function (l) { (l[0] === 'arm' ? arm : leg)(l[1]); });
  put('head', att('neck'), dir('neck', 'head'), fore('neck', 'head'), 1 + ZF * (Dp('head') - Dp('hip')));
}
window.PUPPET = { load: load, draw: draw };
})();
