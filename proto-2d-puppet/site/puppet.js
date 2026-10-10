// 2D cut-out puppet retargeted by ANGLES: the mocap supplies bone directions + root motion, the art keeps its own bone lengths
// (no stretched drawings). Parts are PNGs placed with two-point anchors. Pure function of the pose.
(function () {
var META = null, IMGS = {};
function load(cb) { fetch('parts.json').then(function (r) { return r.json(); }).then(function (m) { META = m; var n = 0, keys = Object.keys(m); keys.forEach(function (k) { var i = new Image(); i.onload = function () { if (++n === keys.length) cb(); }; i.src = 'parts/' + k + '.png'; IMGS[k] = i; }); }); }
var SHEET = { hip: [415, 535], neck: [415, 235], head: [415, 110], sL: [355, 295], sR: [477, 295], hL: [385, 530], hR: [447, 530] }; // sheet-space attach points
function draw(ctx, P, o) {
  var S = o.scale || 0.7, f = o.flip || 1, kk = 2.07 * S;                    // rig px -> screen px for root motion (art leg 415 px = rig leg 200 px)
  var Q = function (k) { return [f * P[k][0], -P[k][1]]; };                   // rig (y up) -> screen-ish (y down), mirrored by flip
  var dir = function (a, b) { var A = Q(a), B = Q(b); return Math.atan2(B[1] - A[1], B[0] - A[0]); };
  var hip = [o.x + f * P.hip[0] * kk, o.y - P.hip[1] * kk];
  var put = function (k, at, theta, sy) { var m = META[k], axis = Math.atan2(m.b[1] - m.a[1], m.b[0] - m.a[0]); ctx.save(); ctx.translate(at[0], at[1]); ctx.rotate(theta - axis); ctx.scale(S, S * (sy || 1)); ctx.drawImage(IMGS[k], -m.a[0], -m.a[1]); ctx.restore(); var len = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]) * S * (sy || 1); return [at[0] + Math.cos(theta) * len, at[1] + Math.sin(theta) * len]; };
  var tTh = dir('hip', 'neck'), torsoRot = tTh - (-Math.PI / 2);              // art torso axis points up (-90deg)
  var rot = function (v) { var c = Math.cos(torsoRot), s = Math.sin(torsoRot); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
  var att = function (k) { var d = rot([(SHEET[k][0] - SHEET.hip[0]) * S, (SHEET[k][1] - SHEET.hip[1]) * S]); return [hip[0] + d[0], hip[1] + d[1]]; };
  var zL = P.eL[2] + P.hL[2], zR = P.eR[2] + P.hR[2], farArm = zL <= zR ? 'L' : 'R', nearArm = farArm === 'L' ? 'R' : 'L';
  var zl = P.kL[2] + P.fL[2], zr = P.kR[2] + P.fR[2], farLeg = zl <= zr ? 'L' : 'R', nearLeg = farLeg === 'L' ? 'R' : 'L';
  var leg = function (s) { var a = att('h' + s), kn = put('th' + s, a, dir('hip', 'k' + s)); put('sh' + s, kn, dir('k' + s, 'f' + s)); };
  var arm = function (s) { var a = att('s' + s), el = put('up' + s, a, dir('s' + s, 'e' + s)); put('fo' + s, el, dir('e' + s, 'h' + s)); };
  leg(farLeg); arm(farArm);
  put('torso', hip, tTh);
  leg(nearLeg); arm(nearArm);
  var neckP = att('neck'), headTh = dir('neck', 'head');                      // head sits on the neck, tilts with the mocap head direction
  put('head', neckP, headTh);
}
window.PUPPET = { load: load, draw: draw };
})();
