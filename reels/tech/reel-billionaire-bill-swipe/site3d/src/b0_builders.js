/* Part B0 (billionaire): timing helpers + shared 3D builders (phone, voxel billionaire, throne, bill cards, stamps, coins) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return TM.words[k][1]; } } } window.__ws[id + '|' + subs] = ['MISS', +SP(id, f == null ? .5 : f).toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return SP(id, f == null ? .5 : f); }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
var GOLD = 0xe8b53a, PLUM = 0x2a0f2e, CREAM = 0xfff7ee, GREEN = 0x2fb872, RED = 0xe03131, BLUSH = 0xffe3dc, CORAL = 0xff5a5f, SKIN = 0xd9a27a;
var K = { GOLD: GOLD, PLUM: PLUM, CREAM: CREAM, GREEN: GREEN, RED: RED, BLUSH: BLUSH, CORAL: CORAL, SKIN: SKIN };
var B = window.B = { K: K };
/* live counter sprite (cream card, coloured edge) */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'dyn', sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s);
  s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(255,247,238,.98)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 12, h); x.strokeStyle = 'rgba(42,15,46,.35)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function rr(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function rbox(w, h, d, r, mat, bev) { var g = new THREE.ExtrudeGeometry(rr(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev || .05, bevelSize: bev || .05, bevelSegments: 3, curveSegments: 10 }); g.translate(0, 0, -d / 2); return new THREE.Mesh(g, mat); }
function tcv(w, h, fn) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); fn(x, w, h); return c; }
function plane(w, h, canvas, tr) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(canvas), transparent: !!tr, toneMapped: false })); return m; }
function M(c, o) { return e.physMat(c, Object.assign({ roughness: .6, metalness: .05 }, o || {})); }
var GM = function () { return M(GOLD, { metalness: .75, roughness: .35, envMapIntensity: .9 }); };
B.rr = rr; B.rbox = rbox; B.tcv = tcv; B.plane = plane; B.M = M; B.GM = GM;
B.floor = function (g, y, r) { var fl = new THREE.Mesh(new THREE.CircleGeometry(r || 60, 64), e.physMat(0xffcbbf, { roughness: .8, metalness: 0, envMapIntensity: .5 })); fl.rotation.x = -Math.PI / 2; fl.position.y = y || 0; g.add(fl); var gr = e.gridFloor(40, 2, 0x2a0f2e, .07); gr.position.y = (y || 0) + .01; g.add(gr); return fl; };
/* the bill card: front face drawn on a canvas. kind: 'bill' | 'rent' | 'water' | 'medical' */
B.card = function (title, amount, sub, o) { o = o || {}; var g = new THREE.Group(), body = rbox(2.6, 1.7, .08, .22, e.physMat(o.paper || CREAM, { roughness: .5 }), .02); g.add(body);
  var f = plane(2.5, 1.62, tcv(520, 340, function (x, w, h) { x.fillStyle = o.paper ? '#' + ('000000' + o.paper.toString(16)).slice(-6) : '#fff7ee'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2a0f2e'; x.lineWidth = 8; x.strokeRect(6, 6, w - 12, h - 12); x.fillStyle = '#2a0f2e'; x.font = '600 30px "Geist Mono"'; x.fillText(title, 34, 66);
    var fs = 86; x.font = '900 ' + fs + 'px Unbounded'; while (x.measureText(amount).width > w - 64 && fs > 30) { fs -= 4; x.font = '900 ' + fs + 'px Unbounded'; } x.fillText(amount, 30, 175);
    x.fillStyle = o.subcol || '#e03131'; x.font = '600 26px "Geist Mono"'; x.fillText(sub || '', 34, 232); x.fillStyle = 'rgba(42,15,46,.14)'; x.fillRect(34, 262, 300, 16); x.fillRect(34, 290, 210, 16); x.fillStyle = 'rgba(42,15,46,.3)'; for (var i = 0; i < 8; i++) x.fillRect(w - 52, 262 + i * 0, 0, 0); })); f.position.z = .06; g.add(f); g.userData.face = f; return g; };
B.stamp = function (txt, col, w, h, fs) { var c = tcv(760, 260, function (x, W, H) { x.strokeStyle = col; x.lineWidth = 16; x.strokeRect(14, 14, W - 28, H - 28); x.fillStyle = col; x.font = '900 ' + (fs || 112) + 'px Unbounded'; x.textAlign = 'center'; x.textBaseline = 'middle'; var ls = txt.split('\n'); ls.forEach(function (l, i) { x.fillText(l, W / 2, H * (i + .5) / ls.length + 4); }); }); return plane(w || 4.2, h || 1.44, c, true); };
/* stamp slam: 0 hidden, drops from above, squashes, settles. u in [0,1] */
B.slam = function (m, u, y0, y1, sc) { m.visible = u > 0; if (u <= 0) return; var k = clamp(u / .35), y = lerp(y0, y1, k * k), s = (u < .35 ? 1.5 - .5 * k : 1 + .08 * Math.exp(-(u - .35) * 14) * Math.cos((u - .35) * 40)); m.position.y = y; m.scale.setScalar(s * (sc || 1)); };
B.phone = function (screen) { var g = new THREE.Group(), body = rbox(3.5, 6.9, .4, .55, e.physMat(0x1b1220, { metalness: .6, roughness: .22, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 1.3 }), .06); g.add(body);
  var scr = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 6.52), new THREE.MeshBasicMaterial({ map: e.canvasTex(screen), toneMapped: false })); scr.position.z = .31; g.add(scr); g.userData.scr = scr; return g; };
B.voxel = function (hat, shirt) { var g = new THREE.Group(), b = function (w, h, d, m, x, y, z) { var q = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); q.position.set(x, y, z); g.add(q); return q; }, sh = shirt == null ? PLUM : shirt;
  b(.34, .7, .34, M(PLUM), -.2, .35, 0); b(.34, .7, .34, M(PLUM), .2, .35, 0); g.userData.torso = b(.9, 1.0, .5, M(sh, { roughness: .45 }), 0, 1.2, 0); g.userData.armL = b(.18, .5, .6, M(sh), -.56, 1.2, .1); g.userData.armR = b(.18, .5, .6, M(sh), .56, 1.2, .1);
  b(.22, .22, .06, M(CORAL), 0, 1.5, .28); var head = new THREE.Group(); head.position.set(0, 2.05, 0); g.add(head); g.userData.head = head; var hb = function (w, h, d, m, x, y, z) { var q = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); q.position.set(x, y - 2.05, z); head.add(q); return q; };
  hb(.62, .62, .6, M(SKIN), 0, 2.05, 0); hb(.34, .09, .06, M(0x1b1220), 0, 1.92, .31); hb(.08, .08, .06, M(0x1b1220), -.16, 2.14, .31); hb(.08, .08, .06, M(0x1b1220), .16, 2.14, .31);
  if (hat !== false) { hb(.9, .1, .9, GM(), 0, 2.42, 0); hb(.55, .46, .55, GM(), 0, 2.7, 0); hb(.57, .1, .57, M(RED), 0, 2.52, 0); } return g; };
B.throne = function () { var g = new THREE.Group(), gm = e.physMat(GOLD, { metalness: .75, roughness: .32, envMapIntensity: .9 }), vm = e.physMat(0xa31621, { roughness: .95, metalness: 0 });
  [[2.4, .5, 2.1, 0, .25, 0, gm], [2.2, .4, 1.9, 0, .7, 0, vm], [2.4, 3.4, .5, 0, 2.2, -.95, gm], [2.0, 2.9, .3, 0, 2.2, -.7, vm], [.4, 1.2, 2.0, -1.2, 1.1, 0, gm], [.4, 1.2, 2.0, 1.2, 1.1, 0, gm]].forEach(function (a) { var b = new THREE.Mesh(new THREE.BoxGeometry(a[0], a[1], a[2]), a[6]); b.position.set(a[3], a[4], a[5]); g.add(b); });
  var crown = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, .5, 6), gm); crown.position.set(0, 4.15, -.95); g.add(crown); return g; };
B.coin = function (n) { var im = new THREE.InstancedMesh(new THREE.CylinderGeometry(.22, .22, .06, 24), e.physMat(GOLD, { metalness: .8, roughness: .3, envMapIntensity: 1.0 }), n); im.frustumCulled = false; return im; };
var _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new V3(), _p = new V3();
B.setI = function (im, i, x, y, z, rx, ry, rz, s) { _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e); _s.set(s == null ? 1 : s, s == null ? 1 : s, s == null ? 1 : s); _p.set(x, y, z); _m.compose(_p, _q, _s); im.setMatrixAt(i, _m); };
B.bgc = function (fog) { S.background = new THREE.Color(BLUSH); S.fog = new THREE.FogExp2(BLUSH, fog == null ? .012 : fog); };
B.sc = null;
})();
