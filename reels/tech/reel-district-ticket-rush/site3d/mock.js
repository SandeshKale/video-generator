/* District ticket-rush MOCKUP ("Showtime"): voxel crowd, arena seat map + Redis terminal, phone + ticket token. Stills only; cameras are authored poses. */
(function () {
var W = 1080, H = 1920, MAG = 0xff2d78, CYN = 0x22e1ff, AMB = 0xffb800, LIME = 0x9dff3a, RED = 0xff3b30, IVO = 0xf2f4ff, V3 = THREE.Vector3;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
var HEX = function (h) { return '#' + ('000000' + h.toString(16)).slice(-6); };
var R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.2;
var S = new THREE.Scene(); S.background = new THREE.Color(0x07080c); S.fog = new THREE.FogExp2(0x07080c, .014);
var C = new THREE.PerspectiveCamera(40, W / H, .05, 400);
S.add(new THREE.HemisphereLight(0x6a78b8, 0x0a0a16, .9));
var key = new THREE.DirectionalLight(0xbfd8ff, 1.2); key.position.set(8, 16, 10); S.add(key);
var rim = new THREE.DirectionalLight(0xff2d78, .9); rim.position.set(-10, 6, -12); S.add(rim);
function cam(p, t, fov) { C.position.copy(p); C.up.set(0, 1, 0); C.lookAt(t); C.fov = fov; C.updateProjectionMatrix(); }
function glowTex(c0, c1) { var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, c0); g.addColorStop(.4, c1); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
var GL = { c: glowTex('rgba(200,250,255,1)', 'rgba(34,225,255,.5)'), m: glowTex('rgba(255,190,220,1)', 'rgba(255,45,120,.5)'), a: glowTex('rgba(255,236,170,1)', 'rgba(255,184,0,.5)'), l: glowTex('rgba(230,255,190,1)', 'rgba(157,255,58,.5)') };
function glow(k, s, op) { var m = new THREE.Sprite(new THREE.SpriteMaterial({ map: GL[k], transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: op == null ? 1 : op })); m.scale.set(s, s, 1); return m; }
var LCache = {};
function lab(text, col, hh, o) { o = o || {}; var key = text + col + JSON.stringify(o), e = LCache[key];
  if (!e) { var fs = o.fs || 56, f = o.font || '600 ' + fs + 'px Inter', c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = 22, lh = fs * 1.2; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
    if (o.bg) { x.fillStyle = 'rgba(7,8,12,.92)'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = HEX(col); x.lineWidth = 5; x.strokeRect(2.5, 2.5, c.width - 5, c.height - 5); } x.fillStyle = HEX(col); x.textBaseline = 'middle'; x.textAlign = o.center ? 'center' : 'left';
    lines.forEach(function (l, i) { x.fillText(l, o.center ? c.width / 2 : pad, pad * .55 + lh * (i + .5) + 2); }); var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; e = LCache[key] = { tx: tx, asp: c.width / c.height }; }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: e.tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.scale.set(hh * e.asp, hh, 1); return s; }
var DYN = new THREE.Group(); S.add(DYN);
function clr() { while (DYN.children.length) { var c = DYN.children.pop(); c.traverse(function (n) { if (n.isSprite) { n.material.dispose(); return; } if (n.geometry) n.geometry.dispose(); if (n.material) { if (n.material.map && !n.userData.keepMap) n.material.map.dispose(); n.material.dispose(); } }); } }
function add(o, x, y, z) { o.position.set(x || 0, y || 0, z || 0); DYN.add(o); return o; }
/* voxel (Minecraft-like) crowd: torso + head + legs as instanced boxes, deterministic positions */
function crowd(n, x0, x1, z0, z1, seed, tint) { var g = new THREE.Group(), mk = function (w, h, d, y) { var gm = new THREE.BoxGeometry(w, h, d); gm.translate(0, y, 0); return new THREE.InstancedMesh(gm, new THREE.MeshStandardMaterial({ roughness: .7, metalness: .05 }), n); };
  var bo = mk(.5, .62, .3, .86), he = mk(.36, .36, .36, 1.35), le = mk(.4, .55, .26, .28), m4 = new THREE.Matrix4(), col = new THREE.Color();
  for (var i = 0; i < n; i++) { var x = x0 + (x1 - x0) * hash(i * 3 + seed), z = z0 + (z1 - z0) * hash(i * 5 + seed + 1), s = .9 + hash(i + seed + 7) * .25, ry = (hash(i + seed + 11) - .5) * .6; m4.makeRotationY(ry); m4.scale(new V3(s, s, s)); m4.setPosition(x, 0, z); [bo, he, le].forEach(function (m) { m.setMatrixAt(i, m4); });
    var h = tint === 'mag' ? .93 + (hash(i + seed) - .5) * .08 : .5 + (hash(i + seed) - .5) * .06; col.setHSL(h, .8, .45 + hash(i + 3 + seed) * .12); bo.setColorAt(i, col); col.setHSL(.07, .5, .55 + hash(i + 9) * .15); he.setColorAt(i, col); col.setHSL(.62, .3, .18 + hash(i + 13 + seed) * .08); le.setColorAt(i, col); }
  g.add(bo); g.add(he); g.add(le); return g; }
function plane(w, h, col, op) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op == null ? 1 : op, depthWrite: false, side: THREE.DoubleSide })); return m; }
function gridFloor(sz, step, col) { var pts = []; for (var i = -sz; i <= sz; i += step) { pts.push(new V3(i, 0, -sz), new V3(i, 0, sz), new V3(-sz, 0, i), new V3(sz, 0, i)); } return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .16 })); }
function bar(a, b, col, r, op) { var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op == null ? .95 : op, depthWrite: false })); m.geometry.translate(0, .5, 0); var d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, Math.max(L, .0001), 1); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); return m; }
function gate() { var g = new THREE.Group(), chrome = new THREE.MeshStandardMaterial({ color: 0xaab4c8, metalness: .9, roughness: .25 }); [-3.6, 3.6].forEach(function (x) { var p = new THREE.Mesh(new THREE.BoxGeometry(.7, 4.2, .7), chrome); p.position.set(x, 2.1, 0); g.add(p); }); var arch = new THREE.Mesh(new THREE.BoxGeometry(8, .35, .5), new THREE.MeshStandardMaterial({ color: CYN, emissive: CYN, emissiveIntensity: 1.6 })); arch.position.set(0, 4.3, 0); g.add(arch); var strip = plane(6.4, 10, CYN, .16); strip.rotation.x = -Math.PI / 2; strip.position.set(0, .02, -5.2); g.add(strip); g.add(add3(glow('c', 7, .6), 0, 4.3, 0)); return g; }
function add3(o, x, y, z) { o.position.set(x, y, z); return o; }
/* ===== M1: the stampede and the 28 per second line ===== */
function sceneM1(step) {
  var fl = gridFloor(60, 2, CYN); add(fl); var ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x0b0c14, roughness: .9 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -.01; add(ground); add(gate());
  cam(new V3(0, 17, 44), new V3(0, 1.0, 8), 42);
  if (step >= 1) { /* 28 people per second: a thin tidy line */ for (var k = 0; k < 14; k++) { var c = crowd(1, -.3, .3, 2 + k * 1.9, 2 + k * 1.9, 300 + k, 'cy'); add(c); } add(bar(new V3(0, .1, 0), new V3(0, .1, 28), CYN, .06, .6)); }
  if (step >= 2) { add(crowd(7000, -20, 20, 7, 70, 7, 'mag')); }
  var eq = lab('1,00,000 ÷ 3,600 s ≈ 28 / second', IVO, 1.5, { font: '400 54px Bungee', bg: true }); add(eq, 0, step == 3 ? 11.4 : 9.6, -2);
  if (step == 1) add(lab('itna to ek chhota server bhi sambhal le', CYN, 1.1, { fs: 40, bg: true }), 0, 6.6, -2);
  if (step == 2) add(lab('dikkat: sabka ek hi pal, ek hi seat', MAG, 1.4, { fs: 44, bg: true }), 0, 6.6, -2);
  if (step == 3) { var db = dashboard(); db.scale.setScalar(1.0); add(db, 0, 6.4, -2); db.rotation.y = 0; }
}
function dashboard() { var c = document.createElement('canvas'); c.width = 640; c.height = 520; var x = c.getContext('2d'); x.fillStyle = 'rgba(7,8,12,.92)'; x.fillRect(0, 0, 640, 520); x.strokeStyle = HEX(CYN); x.lineWidth = 6; x.strokeRect(3, 3, 634, 514); x.font = '400 34px Bungee'; x.fillStyle = HEX(CYN); x.fillText('LIVE · ILLUSTRATIVE', 28, 58);
  var rows = [['IN QUEUE', '12,569', MAG], ['ADMITTED / s', '~21', CYN], ['SEATS HELD', '3,904', AMB], ['SOLD', '1,00,000', LIME]]; rows.forEach(function (r, i) { x.font = '600 26px Inter'; x.fillStyle = 'rgba(242,244,255,.7)'; x.fillText(r[0], 28, 130 + i * 100); x.font = '400 60px Bungee'; x.fillStyle = HEX(r[2]); x.fillText(r[1], 28, 190 + i * 100); });
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; var m = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 5.2), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, transparent: true })); m.userData.keepMap = false; m.rotation.y = 0; return m; }
/* ===== M2: arena seat map, Redis hold ===== */
function arena(seed) { var n = 0, rings = [[9, 52], [11.2, 64], [13.4, 76], [15.6, 88], [17.8, 100]], pos = []; rings.forEach(function (r, ri) { for (var i = 0; i < r[1]; i++) { var a = i / r[1] * 6.2832; if (Math.abs(((a + 3.14159) % 6.2832) - 3.14159) < .0) continue; pos.push([Math.cos(a) * r[0], 1.2 + ri * .9, Math.sin(a) * r[0], a, ri, i]); } });
  var gm = new THREE.BoxGeometry(.7, .45, .7), im = new THREE.InstancedMesh(gm, new THREE.MeshStandardMaterial({ roughness: .5, metalness: .1 }), pos.length * 3), m4 = new THREE.Matrix4(), col = new THREE.Color(), cnt = 0, q = new THREE.Quaternion();
  pos.forEach(function (p) { for (var k = 0; k < 3; k++) { var rr = Math.hypot(p[0], p[2]) + (k - 1) * .0, aa = p[3] + (k - 1) * .0; m4.compose(new V3(p[0] * (1 + .0), p[1] + k * .0, p[2]), q.setFromAxisAngle(new V3(0, 1, 0), -p[3]), new V3(1, 1, 1)); /* one seat per slot; extra slots stay hidden below */ if (k) { m4.makeScale(0, 0, 0); } im.setMatrixAt(cnt, m4); var h = hash(cnt + seed); if (!k) { if (h < .55) col.setHex(0x2a2f44); else if (h < .78) col.setHex(AMB), col.multiplyScalar(.8); else col.setHex(LIME), col.multiplyScalar(.7); } else col.setHex(0); im.setColorAt(cnt, col); cnt++; } });
  return { im: im, pos: pos }; }
function sceneM2(step) {
  var ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: 0x0b0c14, roughness: .8 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -.01; add(ground);
  var ar = arena(3); add(ar.im); var stage = new THREE.Mesh(new THREE.BoxGeometry(6, .6, 4), new THREE.MeshStandardMaterial({ color: 0x151826, emissive: CYN, emissiveIntensity: .25 })); add(stage, 0, .3, 0); add(glow('c', 10, .35), 0, 3, 0);
  var tgt = ar.pos.filter(function (q) { return q[4] == 2; }).sort(function (a, b) { return b[2] - a[2]; })[0], sp = new V3(tgt[0], tgt[1] + .5, tgt[2]); /* the contested seat B14 */
  add(glow(step >= 3 ? 'a' : 'c', 2.2, .9), sp.x, sp.y + .2, sp.z); var tok = function (col, dx) { var t = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .6), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.6 })); t.position.set(sp.x + dx * 3.2, sp.y + 2.6, sp.z + dx * 1.5); DYN.add(t); add(glow(col === CYN ? 'c' : 'm', 2, .8), t.position.x, t.position.y, t.position.z); add(bar(t.position.clone(), sp.clone(), col, .03, .6)); };
  tok(CYN, -1); tok(MAG, 1);
  var rg = new THREE.Mesh(new THREE.TorusGeometry(1.0, .07, 10, 64, step >= 3 ? 4.4 : 6.283), new THREE.MeshBasicMaterial({ color: AMB })); rg.rotation.x = -Math.PI / 2; rg.visible = step >= 3; add(rg, sp.x, sp.y + .3, sp.z);
  var T = term(step); T.scale.setScalar(.62); add(T, 0, 14.5, 12); T.rotation.x = -.35;
  add(lab('seat B14', IVO, 1.1, { font: '400 52px Bungee', bg: true }), sp.x, sp.y + 2.6, sp.z + 2); if (step >= 3) add(lab('hold: 5:00 → paisa nahi, seat wapas', AMB, .9, { fs: 38, bg: true }), sp.x, sp.y + 1.2, sp.z + 4);
  cam(new V3(0, 26, 44), new V3(0, 5, 6), 42);
}
function term(step) { var c = document.createElement('canvas'); c.width = 1024; c.height = 640; var x = c.getContext('2d'); x.fillStyle = 'rgba(8,10,16,.96)'; x.fillRect(0, 0, 1024, 640); x.strokeStyle = HEX(CYN); x.lineWidth = 6; x.strokeRect(3, 3, 1018, 634); x.fillStyle = '#12151f'; x.fillRect(6, 6, 1012, 64); ['#ff5f57', '#febc2e', '#28c840'].forEach(function (cc, i) { x.fillStyle = cc; x.beginPath(); x.arc(40 + i * 40, 38, 12, 0, 6.283); x.fill(); });
  x.font = '400 30px "Cutive Mono"'; x.fillStyle = '#9fb0d0'; x.fillText('redis-cli · ILLUSTRATIVE', 190, 48); x.font = '400 44px "Cutive Mono"';
  var L = [['> SET seat:B14 you NX EX 300', IVO], step >= 2 ? ['OK', LIME] : ['', IVO], step >= 2 ? ['> SET seat:B14 other NX EX 300', IVO] : ['', IVO], step >= 2 ? ['(nil)', RED] : ['', IVO], step >= 3 ? ['# 300 s: key expires, seat free', AMB] : ['', IVO]];
  L.forEach(function (l, i) { x.fillStyle = HEX(l[1]); x.fillText(l[0], 40, 140 + i * 96); });
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; var m = new THREE.Mesh(new THREE.PlaneGeometry(14, 8.75), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); return m; }
/* ===== M3: the viewer's phone and the ticket token ===== */
function roundRect(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function phoneScreen(done) { var c = document.createElement('canvas'); c.width = 512; c.height = 1024; var x = c.getContext('2d'); x.fillStyle = '#080a12'; x.fillRect(0, 0, 512, 1024); x.fillStyle = '#10131f'; x.fillRect(0, 0, 512, 110); x.font = '400 40px Bungee'; x.fillStyle = HEX(IVO); x.fillText('district', 34, 74); x.textAlign = 'center';
  if (!done) { x.font = '600 34px Inter'; x.fillStyle = 'rgba(242,244,255,.75)'; x.fillText('Samay Raina Live · Mumbai', 256, 230); x.font = '600 40px Inter'; x.fillStyle = HEX(IVO); x.fillText('Aapke aage', 256, 420); x.font = '400 150px Bungee'; x.fillStyle = HEX(MAG); x.fillText('12,569', 256, 580); x.font = '600 36px Inter'; x.fillStyle = HEX(CYN); x.fillText('lagbhag 10 minute', 256, 660); x.fillStyle = '#1a1e30'; x.fillRect(56, 740, 400, 18); x.fillStyle = HEX(CYN); x.fillRect(56, 740, 130, 18); x.font = '600 28px Inter'; x.fillStyle = 'rgba(242,244,255,.6)'; x.fillText('is page ko refresh mat karna', 256, 840); }
  else { x.font = '400 64px Bungee'; x.fillStyle = HEX(LIME); x.fillText('CONFIRMED', 256, 380); x.font = '600 40px Inter'; x.fillStyle = HEX(IVO); x.fillText('Block B · Seat 14', 256, 480); x.fillStyle = '#10131f'; x.fillRect(86, 560, 340, 260); x.strokeStyle = HEX(LIME); x.lineWidth = 6; x.strokeRect(86, 560, 340, 260); x.font = '400 40px "Cutive Mono"'; x.fillStyle = HEX(LIME); x.fillText('1 ticket · paid', 256, 700); }
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function ticket(col) { var w = 2.6, h = 1.3, s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, -.2); s.absarc(w / 2, 0, .2, -Math.PI / 2, Math.PI / 2, true); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.lineTo(-w / 2, .2); s.absarc(-w / 2, 0, .2, Math.PI / 2, -Math.PI / 2, true); s.lineTo(-w / 2, -h / 2);
  var m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .08, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 2 }), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .9, metalness: .3, roughness: .35 })); var g = new THREE.Group(); g.add(m); for (var i = 0; i < 8; i++) { var d = new THREE.Mesh(new THREE.BoxGeometry(.04, .1, .09), new THREE.MeshBasicMaterial({ color: 0x07080c })); d.position.set(.55, -h / 2 + .12 + i * .15, .05); g.add(d); } return g; }
function sceneM3(step) {
  var table = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: 0x0a0c14, roughness: .25, metalness: .6 })); table.rotation.x = -Math.PI / 2; add(table, 0, 0, 0); add(gridFloor(30, 1, CYN), 0, .01, 0);
  var ph = new THREE.Group(); var body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundRect(2.0, 4.1, .34), { depth: .16, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 3, curveSegments: 12 }), new THREE.MeshStandardMaterial({ color: 0x2b3238, metalness: .9, roughness: .28 })); body.position.z = -.16; ph.add(body);
  var scr = new THREE.Mesh(new THREE.PlaneGeometry(1.84, 3.7), new THREE.MeshBasicMaterial({ map: phoneScreen(step >= 2), toneMapped: false })); scr.position.z = .045; scr.userData.keepMap = false; ph.add(scr); ph.rotation.x = -.18; add(ph, 0, 2.2, 0); add(glow(step >= 2 ? 'l' : 'm', 6, .35), 0, 2.2, -.5);
  var tk = ticket(step >= 2 ? LIME : CYN); tk.rotation.set(-.18, step >= 2 ? 0 : -.35, step >= 2 ? 0 : .12); add(tk, step >= 2 ? 0 : 2.6, step >= 2 ? 2.2 : 5.0, step >= 2 ? .5 : 1.2); add(glow(step >= 2 ? 'l' : 'c', 4, .6), step >= 2 ? 0 : 2.6, step >= 2 ? 2.2 : 5.0, step >= 2 ? .6 : 1.3);
  add(lab(step >= 2 ? 'wahi line ne seat bachayi' : 'ek tap, ek token, ek line', step >= 2 ? LIME : CYN, .5, { fs: 44, bg: true }), 0, 5.2, 1);
  cam(new V3(0, 1.4, 11), new V3(0, 3.0, 0), 38);
}
window.__mock = function (name, step) { clr(); ({ M1: sceneM1, M2: sceneM2, M3: sceneM3 })[name](step); R.render(S, C); };
Promise.all(['400 40px Bungee', '600 30px Inter', '400 30px "Cutive Mono"'].map(function (f) { return document.fonts.load(f); })).then(function () { window.__ready = true; });
})();
