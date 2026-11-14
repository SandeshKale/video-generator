/* Jatayu — "Itna bada pakshi ud sakta hai?"  three.js r160. Every hero image is a real photograph, museum specimen or film still, placed in a real 360° photographed sky.
   CG is used only for geometry (ruler, cubes, ladder, vial), drawn overlays (muscle, air sacs: labelled as drawn) and labels. Pure function of t (window.__seek). */
(function () {
var T = THREE, W = 1080, H = 1920, TM = window.TM, IM = window.IM;
var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)); };
var eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
var eo = function (x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
var eob = function (x) { x = clamp(x); var c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
var lerp = function (a, b, u) { return a + (b - a) * u; };
var ramp = function (t, a, b) { return clamp((t - a) / (b - a)); };
var hsh = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
var glc = document.getElementById('gl');
var R = new T.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace;
var S = new T.Scene(), cam = new T.PerspectiveCamera(30, W / H, .05, 3000);
var ov = document.getElementById('ov'), svg = document.getElementById('lines'), capEl = document.getElementById('cap'), tint = document.getElementById('tint');
var V = function (x, y, z) { return new T.Vector3(x, y, z); };

// ---------- timing ----------
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
function CW(id, frac) { var s = SEN[id], tt = s.t0 + (s.t1 - s.t0) * frac, best = tt, bd = .6; for (var k = s.k0; k <= s.k1; k++) { var d = Math.abs(TM.words[k][1] - tt); if (d < bd) { bd = d; best = TM.words[k][1]; } } return best; }
var DUR = TM.end; window.__reelDurationSec = DUR;

// ---------- textures and photo planes ----------
function tex(n) { var t = new T.Texture(IM[n]); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; }
function photo(n, h, par) { var im = IM[n], m = new T.Mesh(new T.PlaneGeometry(h * im.width / im.height, h), new T.MeshBasicMaterial({ map: tex(n), transparent: true, depthWrite: false, side: T.DoubleSide })); m.userData.w = h * im.width / im.height; m.userData.h = h; (par || S).add(m); return m; }
function show(o, u, sc) { o.visible = u > .003; if (!o.visible) return; if (o.material) o.material.opacity = Math.min(1, u); if (sc != null) o.scale.setScalar(sc); }
function canvasTex(w, h, fn) { var c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), c); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
function framed(n, h, par) { var g = new T.Group(), p = photo(n, h, g), b = new T.Mesh(new T.PlaneGeometry(p.userData.w + h * .035, h * 1.035), new T.MeshBasicMaterial({ color: 0xfbf6ea, transparent: true, depthWrite: false })); b.position.z = -.01; g.add(b); g.userData = { p: p, b: b, w: p.userData.w, h: h }; (par || S).add(g); return g; }
function showF(g, u, sc) { g.visible = u > .003; if (!g.visible) return; g.userData.p.material.opacity = g.userData.b.material.opacity = Math.min(1, u); if (sc != null) g.scale.setScalar(sc); }
function bar(a, b, th, col, par) { var d = b.clone().sub(a), m = new T.Mesh(new T.BoxGeometry(th, d.length(), th), new T.MeshBasicMaterial({ color: col, transparent: true })); m.position.copy(a).addScaledVector(d, .5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize()); (par || S).add(m); return m; }

// ---------- the real sky (two 360° photographs, cross-faded) ----------
function skyDome(n, rot, tilt) { var m = new T.Mesh(new T.SphereGeometry(1500, 64, 32), new T.MeshBasicMaterial({ map: tex(n), side: T.BackSide, transparent: true, depthWrite: false, depthTest: false })); m.scale.x = -1; m.rotation.order = 'XYZ'; m.rotation.y = rot; m.rotation.x = tilt; m.renderOrder = -10; S.add(m); return m; }
var SKY1 = skyDome('sky_kloofendal.jpg', 2.2, -.42), SKY2 = skyDome('sky_belfast.jpg', 5.25, -.25); SKY2.renderOrder = -9;

// ---------- stations along the flight path (camera really travels between them) ----------
var C = [0, 70, 140, 210, 280, 350, 440, 510, 580].map(function (x, i) { return V(x, 0, 0); });
function P(c, az, el, d) { var a = az * Math.PI / 180, e = el * Math.PI / 180; return { p: V(c.x + d * Math.sin(a) * Math.cos(e), c.y + d * Math.sin(e), c.z + d * Math.cos(a) * Math.cos(e)), l: V(c.x, c.y - .021 * d, c.z) }; }
function off(c, x, y, z) { return V(c.x + x, c.y + y, c.z + (z || 0)); }

// ---------- story clock ----------
var tA2 = ST('s2'), tA3 = ST('s3'), tB = ST('s4'), tB2 = ST('s5'), tB3 = ST('s6'), tB4 = CW('s6', .5), tC = ST('s7'), tC2 = CW('s7', .5);
var tD = ST('s8'), tD2 = ST('s9'), tD3 = CW('s9', .62), tD4 = ST('s10'), tE = ST('s11'), tE2 = CW('s11', .5), tE3 = ST('s12');
var tF = ST('s13'), tF2 = ST('s14'), tF3 = ST('s15'), tG = ST('s16'), tG2 = ST('s17'), tG3 = CW('s17', .7);
var tH = ST('s18'), tH2 = ST('s19'), tH3 = CW('s19', .38), tH4 = CW('s19', .72), tH5 = ST('s20');
var tI = ST('s21'), tI2 = ST('s22'), tI3 = ST('s23'), tI4 = ST('s24');
var tJ = ST('s25'), tJ2 = ST('s26'), tJ3 = CW('s26', .62), tJ4 = ST('s27'), tJ5 = CW('s27', .5);
var tK = ST('s28'), tK2 = ST('s29'), tK3 = ST('s30'), tK4 = CW('s30', .7), tL = ST('s31'), tL2 = ST('s32'), tCTA = ST('s33');
var tS1 = Math.min(tA2, 2.5), tS2 = Math.min(tA3, tA2 + 2.5);           // each film still is on screen for at most 2.5 s

// ---------- station 0: the film (two official stills, comment use, <= 2.5 s each) ----------
var FS0 = photo('film/jatayu-0.jpg', 10), FS1 = photo('film/jatayu-1.jpg', 10); FS0.position.copy(C[0]); FS1.position.copy(C[0]);
// ---------- station 1: a real vulture in the real sky ----------
var VUL = photo('cut/vulture-hi.png', 2.07), FAR = [];
for (var i = 0; i < 9; i++) { var f = photo(i % 2 ? 'cut/griffon-soar.png' : 'cut/vulture-flight-2.png', .5 + hsh(i) * .5); f.userData.k = i; FAR.push(f); }
var RUL = bar(V(-.74, -.96, .02), V(.74, .98, .02), .022, 0xfbf6ea, VUL), RT1 = bar(V(-.82, -.9, .02), V(-.66, -1.02, .02), .022, 0xfbf6ea, VUL), RT2 = bar(V(.66, 1.04, .02), V(.82, .92, .02), .022, 0xfbf6ea, VUL);
// ---------- station 2: opened up (real specimens in depth) ----------
var GH = photo('cut/vulture-blur.png', 2.6), GS = photo('cut/vulture-hi.png', 2.6), SK = photo('cut/skel-lammergeier.png', 3.1);
GH.position.copy(off(C[2], -1.25, .25, -1.6)); GS.position.copy(GH.position); SK.position.copy(off(C[2], .5, -.1, 0));
var DR = photo('cut/d-raven.png', 1.25), DD = photo('cut/d-dove.png', 1.0), DMc = photo('cut/d-micro.png', .82), DB = photo('cut/d-bone.png', 1.05);
DR.position.copy(off(C[2], -1.45, .85, 1.0)); DD.position.copy(off(C[2], -.8, .05, 1.5)); DMc.position.copy(off(C[2], -1.35, -.3, 2.0)); DB.position.copy(off(C[2], 1.3, -.85, .9));
// drawn overlays on the skeleton (labelled "drawn" on screen): flight muscle on the keel, nine air sacs
var MUS = new T.Mesh(new T.PlaneGeometry(1.56, 3.1), new T.MeshBasicMaterial({ transparent: true, depthWrite: false, map: canvasTex(390, 775, function (g) { var gr = g.createRadialGradient(165, 265, 10, 165, 265, 150); gr.addColorStop(0, 'rgba(255,120,40,.95)'); gr.addColorStop(.6, 'rgba(230,70,30,.75)'); gr.addColorStop(1, 'rgba(200,40,20,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(165, 265, 120, 150, -.5, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(255,220,180,.5)'; g.lineWidth = 2; for (var k = 0; k < 14; k++) { g.beginPath(); g.moveTo(80 + k * 12, 160 + k * 4); g.quadraticCurveTo(150 + k * 4, 270, 210 - k * 3, 380 - k * 6); g.stroke(); } }) }));
MUS.position.copy(SK.position).add(V(0, 0, .03)); S.add(MUS);
var SACS = [[150, 215], [205, 235], [130, 285], [190, 300], [240, 280], [150, 350], [215, 355], [185, 250], [170, 320]];
var SAC = new T.Mesh(new T.PlaneGeometry(1.56, 3.1), new T.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, map: canvasTex(390, 775, function (g) { SACS.forEach(function (q, k) { var r = 30 + (k % 3) * 7, gr = g.createRadialGradient(q[0], q[1], 2, q[0], q[1], r); gr.addColorStop(0, 'rgba(120,230,255,.5)'); gr.addColorStop(.5, 'rgba(70,180,255,.28)'); gr.addColorStop(1, 'rgba(40,120,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], r, 0, 6.283); g.fill(); }); }) }));
SAC.position.copy(SK.position).add(V(0, 0, .04)); S.add(SAC);
var WED = new T.Group(); (function () { var a = new T.Mesh(new T.RingGeometry(.34, .5, 64), new T.MeshBasicMaterial({ color: 0x24406e, transparent: true, side: T.DoubleSide })), b = new T.Mesh(new T.RingGeometry(.34, .5, 32, 1, Math.PI / 2, -Math.PI / 2), new T.MeshBasicMaterial({ color: 0xff8a1f, transparent: true, side: T.DoubleSide })); b.position.z = .01; WED.add(a); WED.add(b); WED.position.copy(off(C[2], 1.32, -.3, .3)); S.add(WED); })();
// ---------- station 3: how high (1 unit = 1 km x 0.7) ----------
var KM = .7, LAD = new T.Group(); LAD.position.copy(C[3]); S.add(LAD);
(function () { bar(V(0, 0, 0), V(0, 11.3 * KM, 0), .05, 0xfbf6ea, LAD); for (var k = 0; k <= 11; k++) bar(V(-.16, k * KM, 0), V(.16, k * KM, 0), .03, 0xfbf6ea, LAD);
  var hh = 8.85 * KM, g = new T.ConeGeometry(2.1, hh, 40, 22, true), col = [], p = g.attributes.position;
  for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i), u = y / hh + .5, a = Math.atan2(z, x), n = (Math.sin(a * 5 + u * 9) * .5 + Math.sin(a * 11 - u * 17) * .3 + Math.sin(a * 23 + u * 31) * .2), k = 1 + n * .16 * (1 - u * .6) * (u < .99 ? 1 : 0);
    p.setX(i, x * k); p.setZ(i, z * k); var lit = .55 + .45 * Math.max(0, Math.cos(a - .9)) + n * .22, snow = u > .52 + n * .1 ? 1 : 0, c = snow ? new T.Color().setHSL(.6, .1, Math.min(.97, .62 + lit * .34)) : new T.Color().setHSL(.07, .12, .12 + lit * .2); col.push(c.r, c.g, c.b); }
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  var m = new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, transparent: true })); m.position.set(-2.0, hh / 2, -1.2); LAD.add(m); })();
var HV = photo('cut/vulture-hi.png', 1.2, LAD); HV.position.set(1.15, 11.3 * KM, .3);
// ---------- station 4: make it bigger ----------
var VB = photo('cut/vulture-hi.png', 1.3); VB.position.copy(off(C[4], 0, .6, 0));
var SQ = [], CU = []; (function () { var e = new T.EdgesGeometry(new T.BoxGeometry(.3, .3, .3));
  for (var k = 0; k < 4; k++) { var m = new T.Mesh(new T.BoxGeometry(.3, .3, .03), new T.MeshBasicMaterial({ color: 0xffe2b8, transparent: true })); m.position.copy(off(C[4], -1.2 + (k % 2) * .36, -1.2 + Math.floor(k / 2) * .36, .5)); S.add(m); SQ.push(m); }
  for (var k2 = 0; k2 < 8; k2++) { var c = new T.Mesh(new T.BoxGeometry(.3, .3, .3), new T.MeshBasicMaterial({ color: 0xff8a1f, transparent: true })); c.add(new T.LineSegments(e, new T.LineBasicMaterial({ color: 0x1a0d02, transparent: true }))); c.position.copy(off(C[4], .75 + (k2 % 2) * .36, -1.2 + (Math.floor(k2 / 2) % 2) * .36, .5 + Math.floor(k2 / 4) * .36)); c.rotation.set(0, 0, 0); S.add(c); CU.push(c); } })();
var KITE = new T.Group(), KSTR; (function () { var sh = new T.Shape(); sh.moveTo(0, .5); sh.lineTo(.36, 0); sh.lineTo(0, -.5); sh.lineTo(-.36, 0); sh.closePath(); var m = new T.Mesh(new T.ShapeGeometry(sh), new T.MeshBasicMaterial({ color: 0xff5a1f, transparent: true, side: T.DoubleSide })); KITE.add(m); KITE.add(bar(V(0, .5, .01), V(0, -.5, .01), .02, 0x1a0d02)); KITE.add(bar(V(-.36, 0, .01), V(.36, 0, .01), .02, 0x1a0d02)); S.add(KITE);
  KSTR = new T.Line(new T.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0)]), new T.LineBasicMaterial({ color: 0xfbf6ea, transparent: true })); S.add(KSTR); })();
// ---------- station 5: the heaviest fliers, to scale (1 unit = 1 m) ----------
var L1 = photo('cut/vulture-hi.png', 2.07), L2 = photo('cut/albatross.png', 1.5), L3 = photo('cut/argentavis.png', 3.3), L4 = framed('argentavis-mef.jpg', 1.3), FS2 = photo('film/jatayu-2.jpg', 5.2);
L1.position.copy(off(C[5], -2.0, -.75, 0)); L2.position.copy(off(C[5], -.4, 1.35, 0)); L3.position.copy(off(C[5], 5.6, -.3, 0)); L4.position.copy(off(C[5], 5.0, -2.55, .4)); FS2.position.copy(off(C[5], 16, .2, 0));
var HB = photo('cut/vulture-hi.png', 4.2); HB.material = HB.material.clone(); HB.material.color.setRGB(.5, .4, .36);
var MRUL = new T.Group(); MRUL.position.copy(off(C[5], 0, -1.95, 0)); S.add(MRUL); (function () { bar(V(-5, 0, 0), V(9, 0, 0), .03, 0xfbf6ea, MRUL); for (var k = -5; k <= 9; k++) bar(V(k, -.09, 0), V(k, .09, 0), .025, 0xfbf6ea, MRUL); })();
// ---------- station 6: the real loss (100 real birds; 97 fade) ----------
var FLK = []; for (var q = 0; q < 100; q++) { var b = photo(q % 3 ? 'cut/griffon-soar.png' : 'cut/vulture-flight-2.png', .42 + hsh(q * 3.3) * .3); b.material = b.material.clone(); b.userData = { r: 1.0 + hsh(q * 1.7) * 2.3, y: -2.6 + hsh(q * 2.9) * 5.6, ph: hsh(q * 5.1) * 6.283, sp: .25 + hsh(q * 7.7) * .3, keep: q === 7 || q === 41 || q === 76, ord: hsh(q * 9.3) }; FLK.push(b); }
var VIAL = new T.Group(); (function () { var gl = new T.Mesh(new T.CylinderGeometry(.2, .2, .62, 32), new T.MeshBasicMaterial({ color: 0xcfe6ff, transparent: true, opacity: .38 })), liq = new T.Mesh(new T.CylinderGeometry(.18, .18, .38, 32), new T.MeshBasicMaterial({ color: 0xf4e9c2, transparent: true, opacity: .8 })), capm = new T.Mesh(new T.CylinderGeometry(.13, .15, .16, 32), new T.MeshBasicMaterial({ color: 0xb9bfc9, transparent: true })); liq.position.y = -.1; capm.position.y = .39;
  var lab = new T.Mesh(new T.CylinderGeometry(.205, .205, .32, 32, 1, true, -1.1, 2.2), new T.MeshBasicMaterial({ transparent: true, map: canvasTex(512, 256, function (g) { g.fillStyle = '#fbf6ea'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#c0281c'; g.fillRect(0, 0, 512, 46); g.fillStyle = '#16213a'; g.font = '800 62px Inter'; g.textAlign = 'center'; g.fillText('DICLOFENAC', 256, 132); g.font = '500 30px DM'; g.fillText('veterinary · 30 ml', 256, 196); }) })); lab.position.y = -.05;
  [liq, gl, lab, capm].forEach(function (m) { VIAL.add(m); }); VIAL.position.copy(off(C[6], .5, -1.3, 2.2)); VIAL.rotation.z = -.14; S.add(VIAL); })();
// ---------- station 7: the comeback (real photo, Pinjore, 3 June 2016) ----------
var PIN = framed('pinjore-crop.jpg', 3.05); PIN.position.copy(off(C[7], 0, -.15, 0)); PIN.rotation.z = -.025;
var RET = []; for (var r2 = 0; r2 < 14; r2++) { var rb = photo(r2 % 2 ? 'cut/griffon-soar.png' : 'cut/vulture-flight-2.png', .5 + hsh(r2 * 4.1) * .4); rb.userData.k = r2; RET.push(rb); }
// ---------- station 8: sunset; the film's Jatayu, then the real one ----------
var FS3 = photo('film/jatayu-1.jpg', 10), VEND = photo('cut/vulture-hi.png', 2.6); FS3.position.copy(C[8]); VEND.material = VEND.material.clone(); VEND.material.color.setRGB(.42, .34, .3);

// ---------- camera: authored shots, locked between moves ----------
var PO = {
  f0a: P(off(C[0], -.4, -.55, 0), -9, 1.5, 38), f0b: P(off(C[0], .5, -.55, 0), 5, -1, 34.5), f1a: P(off(C[0], 1.2, -.55, 0), 6, 2, 37.5), f1b: P(off(C[0], .2, -.55, 0), -7, -1, 34.5),
  askA: P(off(C[1], -9, 9, 0), 0, 24, 30), v1: P(C[1], -13, 4, 11.5), v2: P(C[1], 9, 1, 9.2),
  x1: P(off(C[2], -.2, .1, 0), 0, 2, 13.2), xf: P(off(C[2], -1.1, .1, 1.5), -6, 1, 8.6), xm: P(off(C[2], .75, .45, 0), 7, 0, 8.2), xb: P(off(C[2], .95, -.55, .3), 5, -1, 7.6), xs: P(off(C[2], .6, .25, 0), -4, 1, 8.6),
  h1: P(off(C[3], -.5, 2.0, 0), 0, 0, 17), h2: P(off(C[3], -.5, 6.75, 0), 0, 1, 15.5),
  s1: P(off(C[4], 0, .2, 0), -5, 2, 12.5), s2: P(off(C[4], 0, .05, 0), 3, 1, 15), s3: P(off(C[4], .15, .1, 0), 7, 2, 15.5),
  r1: P(off(C[5], -.72, .1, 0), -3, 1, 19.5), r2: P(off(C[5], 5.75, -.6, 0), 3, 1, 22), r3a: P(off(C[5], 16, .2, 0), 5, 1, 25.5), r3b: P(off(C[5], 16, .2, 0), -5, -1, 23.6), r4: P(off(C[5], 16, 7.5, 0), 0, 6, 14),
  l1: P(off(C[6], 0, .4, 0), -4, 9, 17), l2: P(off(C[6], 0, -.5, 0), 3, -3, 15.5),
  k1: P(off(C[7], 0, 0, 0), -5, 2, 19), k2: P(off(C[7], 0, 0, 0), 2, 0, 15.6),
  e0a: P(off(C[8], 1.2, -.55, 0), -7, 1, 37.5), e0b: P(off(C[8], .2, -.55, 0), 6, -1, 34.5), e1: P(off(C[8], 0, 14, 0), 0, 8, 13), e2: P(off(C[8], 0, 14, 0), 0, 3, 24)
};
var MOVES = [   // [t0, t1, from, to]
  [0, tS1, 'f0a', 'f0b'], [tS1, tS1 + .001, 'f0b', 'f1a'], [tS1 + .001, tS2, 'f1a', 'f1b'],     // slow arcs across each still: real perspective shift
  [tS2, tS2 + .9, 'f1b', 'askA'],                                 // whip up and away into the real sky
  [tB - .5, tB + 1.0, 'askA', 'v1'],                              // descend to the real vulture
  [tB3 - .3, tB3 + 2.0, 'v1', 'v2'],                              // orbit a little and push in for the ruler
  [tC + .2, tC + 1.5, 'v2', 'x1'],                                // whip to the specimen
  [tD - .2, tD + 2.2, 'x1', 'xf'],                                // macro push through the feather layers
  [tE - .4, tE + 1.4, 'xf', 'xm'],                                // truck to the chest
  [tF - .3, tF + 1.6, 'xm', 'xb'],                                // pedestal down to the bone
  [tG - .3, tG + 1.3, 'xb', 'xs'],                                // back up to the air sacs
  [tG2 - .2, tG2 + 1.0, 'xs', 'h1'], [tG2 + 1.0, tG2 + 3.2, 'h1', 'h2'],   // whip to the ladder, then crane up 11 km
  [tH - .5, tH + .8, 'h2', 's1'], [tH3 - .2, tH3 + 1.6, 's1', 's2'], [tH5 - .2, tH5 + 1.2, 's2', 's3'],
  [tI - .5, tI + .9, 's3', 'r1'], [tI2 - .3, tI2 + 2.0, 'r1', 'r2'],        // truck along the line-up
  [tI3 - .1, tI3 + .8, 'r2', 'r3a'], [tI3 + .8, tI3 + 3.3, 'r3a', 'r3b'], [tI4 - .2, tI4 + 1.2, 'r3b', 'r4'],
  [tJ - .3, tJ + 1.0, 'r4', 'l1'], [tJ2 + .4, tJ4 + 1.0, 'l1', 'l2'],       // slow tilt down as they vanish
  [tK - .3, tK + 1.0, 'l2', 'k1'], [tK3 - .2, tK3 + 1.6, 'k1', 'k2'],       // push in on the name
  [tL - .6, tL - .1, 'k2', 'e0a'], [tL - .1, tL + 2.2, 'e0a', 'e0b'], [tL + 2.2, tL + 3.3, 'e0b', 'e1'], [tCTA - .2, tCTA + 2.2, 'e1', 'e2']
];
function camAt(t, c) { var cur = PO.f0a, a = null, u = 0; for (var i = 0; i < MOVES.length; i++) { var m = MOVES[i]; if (t >= m[0]) { if (t < m[1]) { a = PO[m[2]]; cur = PO[m[3]]; u = (m[1] - m[0]) > 1.9 ? clamp((t - m[0]) / (m[1] - m[0])) * .5 + eio((t - m[0]) / (m[1] - m[0])) * .5 : eio((t - m[0]) / (m[1] - m[0])); } else { cur = PO[m[3]]; a = null; } } }
  if (a) { c.position.copy(a.p).lerp(cur.p, u); c.lookAt(a.l.clone().lerp(cur.l, u)); } else { c.position.copy(cur.p); c.lookAt(cur.l); } }
var cam0 = new T.PerspectiveCamera(30, W / H, .05, 3000);
var v3 = new T.Vector3(); function scr(p) { v3.copy(p).project(cam); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H, z: v3.z }; }

// ---------- DOM overlays ----------
function el(cls, html) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; d.style.display = 'none'; ov.appendChild(d); return d; }
var HEADS = [
  [0, tS2 + .3, 'RAMAYANA · PART 1 · JATAYU', 'Itna bada pakshi<br><b>ud</b> bhi sakta hai?'],
  [tS2 + .5, tB - .3, 'AAPKA JAWAAB?', 'Comment mein likhiye:<br><b>haan</b> ya <b>nahi</b>?'],
  [tB + .3, tC + .1, 'ASLI GIDH · VALMIKI KA GIDHRAJ', 'Pankh <b>2.5 metre</b>.<br>Vazan sirf 6 kilo.'],
  [tC + .9, tE - .3, 'KHOL KE DEKHTE HAIN · 1', 'Pankh: baareek kaante,<br><b>zip</b> ki tarah.'],
  [tE + .2, tF - .2, 'KHOL KE DEKHTE HAIN · 2', 'Seene ki maaspeshi:<br>iska <b>engine</b>.'],
  [tF + .2, tG - .2, 'KHOL KE DEKHTE HAIN · 3', 'Haddiyan <b>khokhli</b>.<br>Dhaancha sirf 5%.'],
  [tG + .2, tH - .4, 'KHOL KE DEKHTE HAIN · 4', '9 hawa ki thailiyan.<br><b>11 km</b> oopar tak.'],
  [tH + .5, tI - .4, 'AB ISE BADA KARTE HAIN', 'Pankh 4 guna.<br>Par vazan <b>8 guna</b>.'],
  [tI + .5, tI3 - .1, 'SABSE BHAARI UDNE WALE', 'Aaj: 19 kilo.<br>Itihaas mein: <b>70 kilo</b>.'],
  [tI3 + .1, tJ - .3, 'TO FILM JITNA BADA?', 'Vigyan: mushkil.<br>Kahani: <b>himmat</b> se bada.'],
  [tJ + .5, tK - .3, 'ASLI DUKH', '15 saal mein<br><b>97%</b> gidh khatm.'],
  [tK + .5, tK4 - .15, 'WAPSI', '2006: dawa par <b>rok</b>.<br>Gidh phir paale gaye.'],
  [tK4, tL - .4, 'HARYANA · PINJORE', 'Us kendra ka naam?<br><b>Jatayu</b>.'],
  [tL + .1, tCTA - .2, 'FILM KA JATAYU · ASLI JATAYU', 'Asli Jatayu roz<br><b>hamare liye</b> ladta hai.']
].map(function (h) { return { t0: h[0], t1: h[1], k: el('kick', '<i></i>' + h[2]), h: el('head', h[3]) }; });
var HUD = el('hud', ''), SRC = el('src', '');
var SRCS = [[0, tS2 + .3, 'film stills © Prime Focus Studios · DNEG · via TMDB · shown for comment'], [tB + .3, tC + .1, 'real photo: P. Jeganathan, CC BY-SA 4.0 · real sky: Poly Haven, CC0'], [tC + .9, tE - .3, 'real macro photos: D. Delso, F. van Duns, Gribkov · CC BY(-SA)'],
  [tE + .2, tF - .2, 'skeleton: Natural History Museum, Univ. of Pisa · muscle: drawn by us'], [tF + .2, tG - .2, 'skeleton: Univ. of Pisa, CC BY-SA 4.0 · plate: Coues, 1890'], [tG + .2, tG2 - .1, 'air sacs: drawn by us · skeleton: Univ. of Pisa'], [tG2 + .9, tH - .4, '11,300 m: reported, 1973 · mountain to scale'],
  [tH + .5, tI - .4, 'our arithmetic: area × 4, weight × 8'], [tI + .5, tI3 - .1, 'sizes are estimates · reconstruction: Trost1702 · mount: MEF, Argentina'], [tI3 + .1, tI4 - .1, 'film still © Prime Focus Studios · DNEG · via TMDB'],
  [tJ + .5, tK - .3, '97% in 10–15 years: reported · birds shown: real photos, repeated'], [tK + .5, tL - .4, 'real photo: Pinjore, 3 June 2016 · MoEFCC, GODL-India'], [tL - .1, tL + 2.2, 'film still © Prime Focus Studios · DNEG · via TMDB']];
var TAGS = []; function tag(t0, t1, anchor, html, x, y, cls) { var d = el('tag ' + (cls || ''), html); d.style.left = x + 'px'; d.style.top = y + 'px'; TAGS.push({ t0: t0, t1: t1, a: anchor, d: d, x: x, y: y, cls: cls }); }
function A(v) { return function () { return v; }; }
tag(tB4 - 1.2, tC, function () { return VUL.position.clone().add(V(.45, .6, 0)); }, '<small>wingspan</small>2.2 – 2.6 m', 590, 560);
tag(tB4, tC, function () { return VUL.position.clone().add(V(-.3, -.35, 0)); }, '<small>weight</small>5.5 – 6.3 kg', 170, 1090);
tag(tD + .2, tE - .5, A(DR.position), '<small>1 · feather</small>one vane', 170, 850);
tag(tD2 + .4, tE - .5, A(DD.position), '<small>barbs</small>thousands, side by side', 560, 1130);
tag(tD3, tE - .5, A(DMc.position), '<small>tiny hooks</small>zip the barbs together', 170, 1205);
tag(tE + 1.0, tF - .3, A(off(C[2], .32, .5, 0)), '<small>2 · flight muscle (drawn)</small>~25% of body weight', 170, 1120);
tag(tF + .9, tG - .3, A(DB.position), '<small>3 · hollow bone, with struts</small>like a bridge girder', 480, 1080);
tag(tG + .6, tG2 - .2, A(off(C[2], .45, .15, 0)), '<small>4 · air sacs (drawn)</small>nine, air flows one way', 170, 1120);
tag(tG2 + 1.4, tH - .5, A(off(C[3], -2.0, 8.85 * KM, -1.2)), '<small>Mount Everest</small>8.85 km', 170, 700);
tag(tG3, tH - .5, A(off(C[3], 1.15, 11.3 * KM, .3)), '<small>a vulture, 1973</small>11.3 km', 560, 560);
tag(tH3 + .4, tI - .5, A(off(C[4], -1.02, -.85, .5)), '<small>wing area</small>× 4', 170, 1160);
tag(tH4, tI - .5, A(off(C[4], .93, -.85, .68)), '<small>weight</small>× 8', 770, 1160);
tag(tH5 + .5, tI - .5, function () { return KITE.position; }, '<small>heavy kite</small>needs faster wind', 500, 450);
tag(tI + 1.0, tI2 + .3, A(L1.position), '<small>vulture</small>6 kg · 2.5 m', 170, 1110);
tag(tI + 1.4, tI2 + .3, A(L2.position), '<small>albatross</small>up to ~16 kg · 3.5 m', 520, 470);
tag(tI2 + 1.5, tI3 - .2, A(L3.position), '<small>Argentavis · extinct · artist's reconstruction</small>~70 kg · ~6 m wings', 170, 560);
tag(tI2 + 2.1, tI3 - .2, A(L4.position), '<small>its real fossil mount</small>museum, Argentina', 170, 1130);
tag(tJ5, tK - .4, A(VIAL.position), '<small>cattle painkiller</small>deadly to vultures', 250, 1120, 'r');
tag(tK4, tL - .5, A(off(C[7], .3, -.9, 0)), '<small>ring on the leg</small>before release', 520, 1130, 'g');
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
var END = el('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="ser">Ramayana × Vigyan</div><div class="btns"><span id="bS">SHARE</span><span id="bF">FOLLOW</span></div>');

// ---------- sound events for the mix ----------
window.EV = [[0, 'hit'], [tS1, 'shutter'], [tS2, 'whoosh'], [tB - .3, 'whoosh'], [tB4, 'tick'], [tC + .3, 'whoosh'], [tD, 'pop'], [tD2 + .4, 'pop'], [tD3, 'glint'], [tE + .9, 'thud'], [tF + .8, 'pop'], [tF3, 'tick'], [tG + .5, 'glint'], [tG2, 'rise'], [tG3, 'bell'],
  [tH - .3, 'whoosh'], [tH3, 'pop'], [tH4, 'thud'], [tH5 + .4, 'slide'], [tI - .3, 'whoosh'], [tI2 + 1.4, 'thud'], [tI3, 'shutter'], [tI4, 'bell'], [tJ, 'hole'], [tJ3, 'slide'], [tJ5, 'thud'], [tK, 'chime'], [tK2 + .5, 'shutter'], [tK4, 'bell'], [tL, 'whoosh'], [tL2, 'rise'], [tCTA, 'chime']].map(function (e) { return { t: +e[0].toFixed(3), k: e[1] }; });
window.SCN_T0 = function () { return [0, tB, tC, tE, tF, tG, tH, tI, tJ, tK, tL, tCTA]; };

// ---------- frame ----------
function face(o) { o.quaternion.copy(cam.quaternion); }
window.__seek = function (t) {
  t = Math.max(0, Math.min(DUR, t));
  camAt(t, cam); cam.updateMatrixWorld(); camAt(Math.max(0, t - 1 / 30), cam0);
  var spd = cam.position.distanceTo(cam0.position) * 30, cut = Math.abs(t - tS1) < .04 || t < .04;
  glc.style.filter = (!cut && spd > 14) ? 'blur(' + Math.min(16, (spd - 14) * .16).toFixed(1) + 'px)' : 'none';
  SKY1.position.copy(cam.position); SKY2.position.copy(cam.position);
  var sun = Math.max(t < tS2 + .45 ? 1 - ramp(t, tS2, tS2 + .45) : 0, ramp(t, tI3 - .1, tI3 + .5) * (1 - ramp(t, tI4 + .4, tI4 + 1.3)), ramp(t, tK4 + .6, tL + .3)); SKY2.material.opacity = sun; SKY2.visible = sun > .003;
  // station 0: film stills, slow arc
  show(FS0, t < tS1 ? 1 : 0); show(FS1, t >= tS1 && t < tS2 + .7 ? 1 - ramp(t, tS2 + .3, tS2 + .7) : 0);
  // station 1: the real vulture glides in on a curve; distant birds wheel on a thermal
  var uv = eo(ramp(t, tB - .6, tB + 1.6)), on1 = t > tS2 + .3 && t < tC + 1.6;
  VUL.visible = on1; if (on1) { VUL.position.set(C[1].x + lerp(-7, 0, uv) + Math.sin(t * .55) * .08, lerp(3.2, 0, uv) + Math.sin(t * .8) * .05, lerp(-6, 0, uv)); VUL.rotation.z = lerp(.35, 0, uv) + Math.sin(t * .6) * .025; VUL.material.opacity = 1; }
  var ur = eo(ramp(t, tB3 + .1, tB3 + .9)); RUL.visible = RT1.visible = RT2.visible = ur > .01; RUL.scale.y = Math.max(.001, ur); RT1.material.opacity = RT2.material.opacity = ur;
  FAR.forEach(function (f) { var k = f.userData.k, a = t * (.12 + hsh(k * 2.1) * .1) + k * 1.9, rr = 7 + hsh(k * 3.7) * 9; f.visible = on1; f.position.set(C[1].x + Math.cos(a) * rr, -2 + hsh(k * 1.3) * 9, -14 - hsh(k * 4.9) * 22 + Math.sin(a) * rr * .6); f.rotation.z = a + 1.57; });
  // station 2: opened up
  var on2 = t > tC && t < tG2 + 1.2, ug = ramp(t, tC + .7, tC + 1.6); GS.visible = on2 && ug < 1; GS.material.opacity = 1 - ug; GH.visible = on2; GH.material.opacity = .55 * ug + (1 - ug) * 0 + .0;
  var us = eob(ramp(t, tC2, tC2 + .7)); show(SK, on2 ? Math.min(1, ramp(t, tC2, tC2 + .4)) : 0); if (SK.visible) { SK.scale.setScalar(.85 + .15 * us); }
  var fOn = on2 && t < tE + 1.0, fo = 1 - ramp(t, tE + .3, tE + 1.0); show(DR, fOn ? eo(ramp(t, tD, tD + .5)) * fo : 0, .7 + .3 * eob(ramp(t, tD, tD + .5))); show(DD, fOn ? eo(ramp(t, tD2 + .3, tD2 + .8)) * fo : 0, .7 + .3 * eob(ramp(t, tD2 + .3, tD2 + .8))); show(DMc, fOn ? eo(ramp(t, tD3, tD3 + .5)) * fo : 0, .7 + .3 * eob(ramp(t, tD3, tD3 + .5)));
  [DR, DD, DMc, DB].forEach(face);
  var um = eo(ramp(t, tE + .8, tE + 1.6)) * (1 - ramp(t, tF - .2, tF + .5)); show(MUS, on2 ? um * (.86 + .14 * Math.sin(t * 5.5)) : 0);
  var uw = eo(ramp(t, tE2, tE2 + .6)) * (1 - ramp(t, tF - .2, tF + .3)); WED.visible = on2 && uw > .01; WED.children.forEach(function (c) { c.material.opacity = uw; }); face(WED); WED.scale.setScalar((.6 + .4 * eob(ramp(t, tE2, tE2 + .6))) * .5);
  show(DB, on2 ? eo(ramp(t, tF + .7, tF + 1.2)) * (1 - ramp(t, tG - .2, tG + .4)) : 0, .7 + .3 * eob(ramp(t, tF + .7, tF + 1.2)));
  show(SAC, on2 ? eo(ramp(t, tG + .4, tG + 1.2)) * (.7 + .3 * Math.sin(t * 3.2)) : 0);
  // station 3: the height ladder
  LAD.visible = t > tG2 - .2 && t < tH + .9; HV.position.x = 1.15 + Math.sin(t * .7) * .12; HV.rotation.z = Math.sin(t * .5) * .05; HV.material.opacity = eo(ramp(t, tG3 - .3, tG3 + .4));
  // station 4: bigger
  var on4 = t > tH - .6 && t < tI + .9, big = eio(ramp(t, tH3 - .1, tH3 + 1.3)); VB.visible = on4; VB.scale.setScalar(lerp(1, 1.8, big)); VB.rotation.z = Math.sin(t * .6) * .02;
  SQ.forEach(function (m, k) { var u = on4 ? eob(ramp(t, tH3 + .25 + k * .12, tH3 + .6 + k * .12)) : 0; m.visible = u > .01 && (k === 0 || true); m.scale.setScalar(Math.max(.001, k === 0 ? Math.max(u, eo(ramp(t, tH2, tH2 + .4))) : u)); if (k === 0) m.visible = on4 && t > tH2; });
  CU.forEach(function (m, k) { var u = on4 ? eob(ramp(t, tH4 + (k ? .05 : -9) + k * .09, tH4 + .35 + k * .09)) : 0; if (k === 0) u = on4 ? eo(ramp(t, tH2, tH2 + .4)) : 0; m.visible = u > .01; m.scale.setScalar(Math.max(.001, u)); m.rotation.y = .5 + Math.sin(t * .4) * .08; m.rotation.x = .3; });
  var uk = eo(ramp(t, tH5 + .2, tH5 + 1.0)), kOn = on4 && uk > .01; KITE.visible = KSTR.visible = kOn; if (kOn) { var kp = off(C[4], 1.45 + Math.sin(t * 1.7) * .12, lerp(-.8, 1.25, uk) + Math.sin(t * 2.3) * .08, -.6); KITE.position.copy(kp); KITE.rotation.z = -.35 + Math.sin(t * 2.1) * .12; KITE.children.forEach(function (c) { c.material.opacity = uk; });
    KSTR.geometry.setFromPoints([kp.clone().add(V(0, -.5, 0)), off(C[4], 2.3, -3.6, 1)]); KSTR.material.opacity = uk; }
  // station 5: line-up to scale
  var on5 = t > tI - .6 && t < tJ + 1.1; L1.visible = L2.visible = MRUL.visible = on5; L1.position.y = C[5].y - .75 + Math.sin(t * .7) * .05; L2.position.y = C[5].y + 1.35 + Math.sin(t * .6 + 1) * .06;
  show(L3, on5 ? eo(ramp(t, tI2 + .9, tI2 + 1.7)) : 0, .8 + .2 * eob(ramp(t, tI2 + .9, tI2 + 1.7))); showF(L4, on5 ? eo(ramp(t, tI2 + 1.9, tI2 + 2.5)) * (1 - ramp(t, tI3 - .1, tI3 + .3)) : 0);
  show(FS2, on5 && t >= tI3 - .1 && t < tI3 + 2.5 ? Math.min(1, ramp(t, tI3 - .1, tI3 + .2)) * (1 - ramp(t, tI3 + 2.2, tI3 + 2.5)) : 0);
  var uh = eio(ramp(t, tI4 - .1, tI4 + 2.6)), hOn = t > tI4 - .3 && t < tJ + .9; HB.visible = hOn; if (hOn) { HB.position.set(C[5].x + 16 + lerp(-5.5, .2, uh), 7.5 + lerp(-3.2, .3, uh) + Math.sin(t * .7) * .06, 0); HB.rotation.z = lerp(.3, .02, uh); HB.material.opacity = Math.min(1, ramp(t, tI4 - .3, tI4 + .3)); }
  // station 6: 100 real birds; 97 fade
  var on6 = t > tJ - .5 && t < tK + 1.2, gone = ramp(t, tJ3 - .9, tJ3 + 1.5);
  FLK.forEach(function (b) { var u = b.userData, a = t * u.sp + u.ph, o = on6 ? (u.keep ? 1 : 1 - ramp(gone, u.ord * .8, u.ord * .8 + .2)) : 0; b.visible = o > .01; if (!b.visible) return; b.material.opacity = o; b.position.set(C[6].x + Math.cos(a) * u.r, u.y + Math.sin(t * .4 + u.ph) * .15 - (u.keep ? 0 : (1 - o) * 1.2), Math.sin(a) * u.r); b.rotation.z = a + 1.57; face(b); b.rotateZ(a + 1.57); });
  var uvl = eob(ramp(t, tJ5 - .2, tJ5 + .5)); VIAL.visible = on6 && uvl > .01; VIAL.scale.setScalar(Math.max(.001, uvl * 1.5)); VIAL.rotation.y = Math.sin(t * .8) * .3;
  tint.style.opacity = (.42 * ramp(t, tJ, tJ + 1.4) * (1 - ramp(t, tK - .3, tK + 1.0))).toFixed(3);
  // station 7: the comeback
  var on7 = t > tK - .5 && t < tL + .6; showF(PIN, on7 ? eo(ramp(t, tK2 - .2, tK2 + .6)) : 0, .82 + .18 * eob(ramp(t, tK2 - .2, tK2 + .6)));
  RET.forEach(function (b) { var k = b.userData.k, u = ramp(t, tK + .2 + k * .12, tK + 3.2 + k * .12), a = t * .22 + k * 1.3; b.visible = on7; b.material.opacity = Math.min(1, u * 3); b.position.set(C[7].x + (k % 2 ? 1 : -1) * (2.3 + hsh(k) * 1.6) + Math.cos(a) * .5, lerp(-5, 2.8 + hsh(k * 2.2) * 2.2, eo(u)), -2 - hsh(k * 3.3) * 6); b.rotation.z = (k % 2 ? -.5 : .5) + Math.sin(a) * .2; });
  // station 8: sunset
  show(FS3, t >= tL - .2 && t < tL + 2.3 ? 1 - ramp(t, tL + 2.0, tL + 2.3) : 0);
  var ue = eo(ramp(t, tL + 2.2, tL + 4.0)); VEND.visible = t > tL + 2.0; VEND.position.set(C[8].x + lerp(-5, 0, ue) + Math.sin(t * .5) * .1, 14 + lerp(-2, 0, ue) + Math.sin(t * .7) * .06 + 3.5 * eio(ramp(t, tCTA - .2, tCTA + 2.0)), 0); VEND.rotation.z = lerp(.3, 0, ue) + Math.sin(t * .6) * .03; VEND.material.opacity = ue * (1 - .0);
  R.render(S, cam);
  // --- DOM
  HEADS.forEach(function (h) { var on = t >= h.t0 && t < h.t1, u = (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .4))) * (1 - ramp(t, h.t1 - .22, h.t1)); h.k.style.display = h.h.style.display = on ? 'block' : 'none'; if (on) { h.k.style.opacity = h.h.style.opacity = u; h.h.style.transform = 'translateY(' + (1 - u) * 14 + 'px)'; } });
  var s = null; SRCS.forEach(function (q) { if (t >= q[0] && t < q[1]) s = q; }); SRC.style.display = s ? 'block' : 'none'; if (s) { SRC.textContent = s[2]; SRC.style.opacity = (s[0] === 0 ? 1 : eo(ramp(t, s[0], s[0] + .4))) * (1 - ramp(t, s[1] - .2, s[1])); }
  var hud = null;
  if (t >= tF3 && t < tG - .3) hud = [['SKELETON', '5% of weight'], ['FEATHERS', '2–3× the skeleton']];
  else if (t >= tI + .6 && t < tI2 - .2) hud = [['HEAVIEST FLIER TODAY', 'kori bustard · ~19 kg']];
  else if (t >= tJ3 - .6 && t < tK - .4) { var left = Math.round(lerp(100, 3, gone)); hud = [['VULTURES LEFT, OUT OF 100', String(left)], ['YEARS', '10–15']]; }
  else if (t >= tK + .6 && t < tK2 + 1.2) hud = [['VET DICLOFENAC', 'BANNED · MARCH 2006']];
  HUD.style.display = hud ? 'flex' : 'none'; if (hud) HUD.innerHTML = hud.map(function (h) { return '<div><small>' + h[0] + '</small>' + h[1] + '</div>'; }).join('');
  var Ls = ''; TAGS.forEach(function (g) { var on = t >= g.t0 && t < g.t1; g.d.style.display = on ? 'block' : 'none'; if (!on) return; var u = eo(ramp(t, g.t0, g.t0 + .35)) * (1 - ramp(t, g.t1 - .2, g.t1)); g.d.style.opacity = u;
    var a = scr(g.a()), w = g.d.offsetWidth, h = g.d.offsetHeight, bx = clamp(a.x, g.x, g.x + w), by = a.y < g.y ? g.y : g.y + h, col = g.cls === 'r' ? '#ff5a4a' : g.cls === 'g' ? '#7be0a0' : '#ffe2b8';
    if (a.x > 120 && a.x < 960 && a.y > 200 && a.y < 1320 && !(a.x > g.x && a.x < g.x + w && a.y > g.y && a.y < g.y + h)) Ls += '<path d="M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' L' + bx.toFixed(1) + ' ' + by.toFixed(1) + '" stroke="' + col + '" stroke-width="2.5" fill="none" opacity="' + (u * .9).toFixed(2) + '"/><circle cx="' + a.x.toFixed(1) + '" cy="' + a.y.toFixed(1) + '" r="6" fill="none" stroke="' + col + '" stroke-width="2.5" opacity="' + u.toFixed(2) + '"/>'; });
  svg.innerHTML = Ls;
  var endOn = t >= tCTA - .1; END.style.display = endOn ? 'block' : 'none'; if (endOn) { var uE = eo(ramp(t, tCTA - .1, tCTA + .6)); END.style.opacity = uE; END.style.transform = 'translateY(' + (1 - uE) * 30 + 'px)';
    var bs = document.getElementById('bS'), bf = document.getElementById('bF'), u1 = eob(ramp(t, CW('s33', 0), CW('s33', 0) + .4)), u2 = eob(ramp(t, CW('s33', .3), CW('s33', .3) + .4)), pu = 1 + .04 * Math.sin((t - tCTA) * 4.2);
    bs.style.transform = 'scale(' + (u1 * pu) + ')'; bf.style.transform = 'scale(' + (u2 * (2 - pu)) + ')'; }
  capEl.innerHTML = t < TM.groups[TM.groups.length - 1].end + .4 ? CAP.html(t, CAPW, { plain: true, hi: '#ffb25c', ink: '#f4f6fb', fs: 40, width: 756 }) : '';
};
window.__dbg = function (c) { return eval(c); };
window.__seek(0); window.__ready = true;
})();
