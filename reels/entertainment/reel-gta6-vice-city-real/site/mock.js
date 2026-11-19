/* GTA6 map mockup: scene A (NASA night-lights dive), B (Miami arena + illustrative sign + helicopter), C (parchment timeline + MYTH stamp). Pure function of t. */
(function () {
var T = THREE, W = 1080, H = 1920, clamp = function (x, a, b) { return Math.max(a || 0, Math.min(b == null ? 1 : b, x)); };
var ramp = function (t, a, b) { return clamp((t - a) / (b - a)); }, eo3 = function (x) { return 1 - Math.pow(1 - x, 3); }, eio = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
var eob = function (x) { var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true }); R.setSize(W, H, false); R.setPixelRatio(1); R.outputColorSpace = T.SRGBColorSpace;
var OV = document.getElementById('ov');
function mk(h, c) { var d = document.createElement('div'); d.className = c; d.innerHTML = h; OV.appendChild(d); return d; }
var texL = new T.TextureLoader();
function tex(u) { var t = texL.load(u); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
function txt(str, font, col, w, h, ppu) { var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'); g.font = font; g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, w / 2, h / 2); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; var m = new T.Mesh(new T.PlaneGeometry(w / ppu, h / ppu), new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); return m; }
/* ---------------- scene A: Florida plane ---------------- */
var A = { S: new T.Scene(), C: new T.PerspectiveCamera(38, W / H, .05, 200) }; A.S.background = new T.Color(0x040a14);
var PW = 8.02, PH = 7;
var night = new T.Mesh(new T.PlaneGeometry(PW, PH), new T.MeshBasicMaterial({ map: tex('img/fl_night.jpg') })); night.rotation.x = -Math.PI / 2; A.S.add(night);
var day = new T.Mesh(new T.PlaneGeometry(PW, PH), new T.MeshBasicMaterial({ map: tex('img/fl_true.jpg'), transparent: true, opacity: 0 })); day.rotation.x = -Math.PI / 2; day.position.y = .002; A.S.add(day);
function ll(lon, lat) { return new T.Vector3((lon + 88) / 9 * PW - PW / 2, 0, -(lat - 27.5)); }
var MIA = ll(-80.19, 25.78);
var ring = new T.Mesh(new T.RingGeometry(.1, .115, 64), new T.MeshBasicMaterial({ color: 0xffa21f, transparent: true, opacity: 0 })); ring.rotation.x = -Math.PI / 2; ring.position.copy(MIA); ring.position.y = .01; A.S.add(ring);
var pin = new T.Mesh(new T.CylinderGeometry(.006, .006, .5, 8), new T.MeshBasicMaterial({ color: 0xffa21f })); pin.position.set(MIA.x, .25, MIA.z); A.S.add(pin);
function camA(t) {
  var u = eio(ramp(t, 0.4, 4.6));
  var h = 11 * (1 - u) + 2.4 * u, tz = 0 * (1 - u) + (MIA.z - .5) * u, tx = 1.3 * (1 - u) + MIA.x * u;
  var back = 1.2 * (1 - u) + 2.3 * u;  // pitch: steeper from orbit, tilted at the end
  A.C.position.set(tx, h, tz + back * (0.2 + 0.9 * u)); A.C.lookAt(tx, 0, tz - .15 * u);
}
/* ---------------- scene B: Miami arena studio ---------------- */
var B = { S: new T.Scene(), C: new T.PerspectiveCamera(38, W / H, .1, 400) }; B.S.background = new T.Color(0x071a2b); B.S.fog = new T.Fog(0x071a2b, 60, 160);
var gnd = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshStandardMaterial({ color: 0x0c2a40, roughness: .9 })); gnd.rotation.x = -Math.PI / 2; B.S.add(gnd);
var grid = new T.GridHelper(400, 80, 0x1c5a7a, 0x103a52); grid.position.y = .02; B.S.add(grid);
B.S.add(new T.HemisphereLight(0x9ed6ff, 0x203040, .9)); var sun = new T.DirectionalLight(0xffc27a, 1.8); sun.position.set(-30, 25, 20); B.S.add(sun);
var arena = new T.Group(); B.S.add(arena);
var bowl = new T.Mesh(new T.CylinderGeometry(15, 17, 9, 64), new T.MeshStandardMaterial({ color: 0xd9e4ea, roughness: .55 })); bowl.scale.z = .72; bowl.position.y = 4.5; arena.add(bowl);
var roof = new T.Mesh(new T.CylinderGeometry(15.4, 15.4, .8, 64), new T.MeshStandardMaterial({ color: 0x2fb3b0, roughness: .4, metalness: .3 })); roof.scale.z = .72; roof.position.y = 9.4; arena.add(roof);
var band = new T.Mesh(new T.CylinderGeometry(17.05, 17.05, 1.2, 64, 1, true), new T.MeshBasicMaterial({ color: 0xffa21f, side: T.DoubleSide })); band.scale.z = .72; band.position.y = 6.2; arena.add(band);
var sign = new T.Group(); arena.add(sign);
var sBoard = new T.Mesh(new T.BoxGeometry(17, 5.2, .8), new T.MeshStandardMaterial({ color: 0x0a1018, roughness: .5 })); sign.add(sBoard);
var sFace = txt('WELCOME TO', '800 150px Man', '#ffa21f', 1500, 260, 100); sFace.scale.set(1, 1, 1); sFace.position.set(0, 1.35, .45); sign.add(sFace);
var sFace2 = txt('VICE CITY', '800 210px Man', '#2fe0d6', 1500, 300, 100); sFace2.position.set(0, -.95, .45); sign.add(sFace2);
var edge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(17.4, 5.6, 1)), new T.LineBasicMaterial({ color: 0xffa21f })); sign.add(edge);
var tagS = txt('ILLUSTRATION', '700 54px Az', '#8fb4c4', 800, 90, 100); tagS.position.set(0, -2.95, .45); sign.add(tagS);
var heli = new T.Group(); B.S.add(heli);
var hb = new T.Mesh(new T.CapsuleGeometry(1.1, 3, 6, 12), new T.MeshStandardMaterial({ color: 0xe8452c, roughness: .4 })); hb.rotation.z = Math.PI / 2; heli.add(hb);
var tail = new T.Mesh(new T.BoxGeometry(4.2, .3, .3), new T.MeshStandardMaterial({ color: 0xe8452c })); tail.position.set(-3.8, .2, 0); heli.add(tail);
var rotor = new T.Mesh(new T.CylinderGeometry(4.2, 4.2, .05, 32), new T.MeshBasicMaterial({ color: 0xcfe6f2, transparent: true, opacity: .25 })); rotor.position.y = 1.5; heli.add(rotor);
var blade = new T.Mesh(new T.BoxGeometry(8.4, .06, .22), new T.MeshBasicMaterial({ color: 0xcfe6f2 })); blade.position.y = 1.56; heli.add(blade);
var cab = [0, 1, 2, 3].map(function () { var l = new T.Mesh(new T.CylinderGeometry(.025, .025, 1, 4), new T.MeshBasicMaterial({ color: 0xffa21f })); B.S.add(l); return l; });
var gators = [];
function camB(t) { var u = eio(ramp(t, 0, 4.2)); B.C.position.set(-8 * (1 - u) + 8 * u, 36 * (1 - u) + 20 * u, 105 * (1 - u) + 80 * u); B.C.lookAt(0, 9 + 2 * u, 0); }
/* ---------------- scene C: parchment timeline ---------------- */
var C = { S: new T.Scene(), C: new T.PerspectiveCamera(38, W / H, .1, 200) }; C.S.background = new T.Color(0x071a2b);
C.S.add(new T.HemisphereLight(0xcfe6f2, 0x1a2a3a, 1.0)); var s2 = new T.DirectionalLight(0xffc27a, 1.6); s2.position.set(-6, 10, 8); C.S.add(s2);
var par = new T.Mesh(new T.BoxGeometry(11, .15, 9), new T.MeshStandardMaterial({ color: 0xe9d9b6, roughness: .9 })); par.position.set(0, 0, 0); C.S.add(par);
var axis = new T.Mesh(new T.BoxGeometry(8.4, .05, .08), new T.MeshBasicMaterial({ color: 0x2b2119 })); axis.position.set(0, .12, 1.4); C.S.add(axis);
function tick(x, label, col, big) { var k = new T.Mesh(new T.BoxGeometry(.09, .05, big ? 1.3 : .6), new T.MeshBasicMaterial({ color: col })); k.position.set(x, .13, 1.4); C.S.add(k); var l = txt(label, '800 120px Man', '#2b2119', 640, 180, 100); l.rotation.x = -Math.PI / 2; l.position.set(x, .14, 2.65); C.S.add(l); return k; }
var X1521 = -3, X1535 = 3;
tick(X1521, '1521', 0x2b2119, 1); var tk35 = tick(X1535, '1535', 0xe8452c, 1);
var spanBar = new T.Mesh(new T.BoxGeometry(1, .08, .18), new T.MeshBasicMaterial({ color: 0xe8452c })); spanBar.position.set((X1521 + X1535) / 2, .14, 0.55); C.S.add(spanBar);
var l1 = txt('DE LEON DIES', '700 56px Az', '#2b2119', 460, 90, 100); l1.rotation.x = -Math.PI / 2; l1.position.set(X1521 + 1.2, .14, 0.45); C.S.add(l1);
var l2 = txt('STORY WRITTEN', '700 56px Az', '#a02a15', 520, 90, 100); l2.rotation.x = -Math.PI / 2; l2.position.set(X1535 - 1.2, .14, -0.1); C.S.add(l2);
var yrs = txt('14 YEARS', '800 150px Man', '#a02a15', 700, 200, 100); yrs.rotation.x = -Math.PI / 2; yrs.position.set(0, .15, -1.0); C.S.add(yrs);
var stamp = new T.Group(); C.S.add(stamp);
var stBody = new T.Mesh(new T.BoxGeometry(4.6, .5, 2.0), new T.MeshStandardMaterial({ color: 0xe8452c, roughness: .5 })); stamp.add(stBody);
var stTxt = txt('MYTH', '800 230px Man', '#fff3ea', 700, 300, 100); stTxt.rotation.x = -Math.PI / 2; stTxt.position.y = .27; stamp.add(stTxt);
var stFace = txt('MYTH', '800 230px Man', 'rgba(200,50,30,0.9)', 700, 300, 100); stFace.rotation.x = -Math.PI / 2; stFace.position.set(0, .09, -3.1); C.S.add(stFace);
function camC(t) { var u = eio(ramp(t, 0, 3)); C.C.position.set(0, 29 - 3 * u, 9 + 1.5 * u); C.C.lookAt(0, 0, -0.2 * u); }
/* ---------------- DOM ---------------- */
var eyeEl = mk('', 'eye'), headEl = mk('', 'head'), srcEl = mk('', 'src'), chips = [mk('', 'chip'), mk('', 'chip')];
function setText(e, h) { if (e._h !== h) { e.innerHTML = h; e._h = h; } }
var SC = [{ t0: 0, t1: 5.2 }, { t0: 5.2, t1: 10.4 }, { t0: 10.4, t1: 15.6 }];
function seekA(t) {
  var u = ramp(t, 3.2, 5.0);
  day.material.opacity = eio(u) * .85; night.material.opacity = 1;
  ring.material.opacity = ramp(t, 2.8, 3.4) * (1 - ramp(t, 4.6, 5.1)); var k = 1 + ((t * 1.2) % 1) * 4; ring.scale.set(k, k, k); ring.material.opacity *= (1 - ((t * 1.2) % 1));
  pin.visible = t > 2.6; camA(t); R.render(A.S, A.C);
  setText(eyeEl, 'Real place · NASA night lights'); setText(headEl, 'नकली शहर,<br><i>असली</i> जगह');
  headEl.style.opacity = ramp(t, 0, .3); setText(srcEl, 'Florida · VIIRS Black Marble · NASA GIBS'); chips.forEach(function (c) { c.style.display = 'none'; });
}
function seekB(t) {
  var u = ramp(t, 0.8, 3.6); var ly = 28 * (1 - eio(u)) + 11 * eio(u) * 0 + 0; var sx = 0, sy = 5.2 + 24 * (1 - eio(u)), sz = 17 * .72 + .9;
  sign.position.set(sx, 9.8 + 9 * (1 - eio(u)) + 1.4, sz * .0 + 8.2);
  sign.scale.set(1, 1, 1); sign.position.y = 12.3 + 13 * (1 - eio(u));
  heli.position.set(0, sign.position.y + 8, 8.2); heli.rotation.y = 0; rotor.rotation.y = t * 30; blade.rotation.y = t * 40;
  var ends = [[-8, 2.6], [8, 2.6], [-8, -2.6], [8, -2.6]];
  cab.forEach(function (c, i) { var a = new T.Vector3(heli.position.x + (i % 2 ? 1 : -1) * .6, heli.position.y - 1.2, heli.position.z), b = new T.Vector3(sign.position.x + ends[i][0], sign.position.y + (ends[i][1] > 0 ? 2.6 : -2.6), sign.position.z); var d = b.clone().sub(a), L = d.length(); c.scale.set(1, L, 1); c.position.copy(a.clone().add(b).multiplyScalar(.5)); c.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); c.visible = u < .98; });
  sign.rotation.z = Math.sin(t * 3) * .03 * (1 - u);
  camB(t); R.render(B.S, B.C);
  setText(eyeEl, 'Miami · arena roof'); setText(headEl, 'छत पर उतरा<br><i>Vice City</i>'); headEl.style.opacity = 1; setText(srcEl, 'Sign drawn by us · deal REPORTED ~$975K · Local10 / WLRN');
  chips.forEach(function (c, i) { c.style.display = 'block'; }); chips[0].textContent = '$975,000 · REPORTED'; chips[0].style.cssText = 'left:162px;top:1175px;color:#ffa21f;border-color:#ffa21f;opacity:' + ramp(t, 3.4, 3.9);
  chips[1].textContent = 'WORDS BARRED: "GRAND THEFT AUTO"'; chips[1].style.cssText = 'left:162px;top:1235px;color:#2fe0d6;border-color:#2fe0d6;opacity:' + ramp(t, 4, 4.5);
}
function seekC(t) {
  var u = ramp(t, 0.6, 2.6), ev = eo3(u); var w = (X1535 - X1521) * ev; spanBar.scale.x = Math.max(.001, w); spanBar.position.x = X1521 + w / 2;
  var drop = ramp(t, 3.0, 3.35); stamp.position.set(0, 0.3 + 6 * (1 - drop * drop), -3.1); stamp.visible = t > 2.9 && t < 3.5; stFace.visible = t >= 3.3; stFace.material.opacity = 1; stTxt.visible = true;
  stamp.rotation.y = -0.05;
  var sh = t >= 3.3 && t < 3.6 ? Math.sin((t - 3.3) * 90) * (1 - (t - 3.3) / .3) * .08 : 0; camC(t); C.C.position.x += sh; C.C.position.y += sh * .5; R.render(C.S, C.C);
  setText(eyeEl, 'The famous story · Florida'); setText(headEl, 'झरना?<br><i>मिथक</i>'); headEl.style.opacity = 1; setText(srcEl, 'History.com · NPS · New World Encyclopedia'); chips.forEach(function (c) { c.style.display = 'none'; });
}
window.__reelDurationSec = 15.6;
window.__seek = function (t) {
  var i = t < SC[1].t0 ? 0 : t < SC[2].t0 ? 1 : 2, lt = t - SC[i].t0; [seekA, seekB, seekC][i](lt);
};
window.__ready = false;
setTimeout(function () { window.__ready = true; window.__seek(0); }, 800);
})();
