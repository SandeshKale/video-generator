/* "Neon Coast" glass-product world — three.js r160. Pure function of t (window.__seek). Mockup build: scenes 1, 7, 9.
   Studio = black scene of emissive strips baked to PMREM every frame; hero = fictional glass city block (all contents opaque); one accent family: amber -> rose. */
(function () {
var T = THREE, W = 1080, H = 1920;
var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a == null ? 0 : a, x)); }, lerp = function (a, b, t) { return a + (b - a) * t; };
var eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }, eo3 = function (x) { return 1 - Math.pow(1 - clamp(x), 3); }, ei3 = function (x) { x = clamp(x); return x * x * x; };
var AMB = 0xffb454, ROSE = 0xff5d8f, AMBs = '#ffb454', ROSEs = '#ff5d8f';
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.setClearColor(0x020203, 1);
var S = new T.Scene(), cam = new T.PerspectiveCamera(30, W / H, .1, 200), pm = new T.PMREMGenerator(R), envRT = null;
/* ---------- studio strips ---------- */
var envS = new T.Scene(), sweepM;
function strip(w, h, x, y, z, ry, k, c) { var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c || 0xffffff).multiplyScalar(k), side: T.DoubleSide, toneMapped: false })); m.position.set(x, y, z); m.rotation.y = ry; envS.add(m); return m; }
strip(2, 16, -9, 0, -3, Math.PI / 2.4, 7); strip(2, 16, 9, 0, -3, -Math.PI / 2.4, 7); strip(40, 2.5, 0, 1, -22, 0, 1.0); strip(24, 24, 0, 16, 0, 0, .55).rotation.x = Math.PI / 2;
var accM = strip(6, 10, 0, 0, 14, Math.PI, 0, AMB); sweepM = strip(3, 18, 0, 0, 20, 0, 0);
var envBase = new T.Mesh(new T.SphereGeometry(60, 8, 8), new T.MeshBasicMaterial({ color: 0x000000, side: T.BackSide })); envS.add(envBase);
function bakeEnv(sweepAz, sweepK, accK) {
  sweepM.position.set(Math.sin(sweepAz) * 20, 0, Math.cos(sweepAz) * 20); sweepM.lookAt(0, 0, 0); sweepM.material.color.set(0xffffff).multiplyScalar(sweepK);
  accM.material.color.set(AMB).multiplyScalar(accK);
  var old = envRT; envRT = pm.fromScene(envS, 0, 1, 1000); S.environment = envRT.texture; if (old) old.dispose();
}
/* ---------- textures ---------- */
function cv(w, h, f) { var c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t; }
function hsh(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function windows(cols, rows, seed) { return cv(256, 512, function (g, w, h) { g.fillStyle = '#050405'; g.fillRect(0, 0, w, h); var cw = w / cols, ch = h / rows; for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { var k = hsh(seed + r * 31 + c * 7); if (k < .42) continue; g.fillStyle = k > .8 ? ROSEs : AMBs; g.globalAlpha = .55 + .45 * hsh(seed + r + c * 13); g.fillRect(c * cw + cw * .2, r * ch + ch * .22, cw * .6, ch * .5); } g.globalAlpha = 1; }); }
var sunTex = cv(256, 256, function (g, w, h) { var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, AMBs); gr.addColorStop(.55, '#ff8a63'); gr.addColorStop(1, ROSEs); g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 2, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; for (var i = 0; i < 5; i++) g.fillRect(0, h * (.52 + i * .09), w, 3 + i * 2.2); });
var puddleTex = cv(256, 256, function (g, w, h) { g.fillStyle = '#0a090d'; g.fillRect(0, 0, w, h); var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,93,143,.30)'); gr.addColorStop(1, 'rgba(255,180,84,.55)'); g.fillStyle = gr; g.fillRect(w * .34, 0, w * .32, h); for (var r = 0; r < 14; r++) for (var c = 0; c < 4; c++) { if (hsh(r * 5 + c) < .35) continue; g.fillStyle = hsh(r + c * 3) > .75 ? ROSEs : AMBs; g.globalAlpha = .8; g.fillRect(w * (.37 + c * .066), h * (.03 + r * .065), 10, 11); } g.globalAlpha = 1; });
/* ---------- hero: glass city block ---------- */
var hero = new T.Group(); S.add(hero); var city = new T.Group(); hero.add(city);
function box(w, h, d, m, x, y, z, p) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); (p || city).add(o); return o; }
var mDark = new T.MeshStandardMaterial({ color: 0x14121a, roughness: .55, metalness: .2 }), mRoad = new T.MeshStandardMaterial({ color: 0x0b0a0f, roughness: .35, metalness: .4 });
box(5.6, .3, 5.6, mDark, 0, -1.75, 0); box(5.6, .02, 1.05, mRoad, 0, -1.59, 1.35);
for (var i = 0; i < 9; i++) box(.34, .025, .06, new T.MeshBasicMaterial({ color: AMB }), -2.4 + i * .6, -1.575, 1.35);
var sea = box(5.6, .02, 1.5, new T.MeshStandardMaterial({ color: 0x07090f, roughness: .05, metalness: .9 }), 0, -1.59, -2.05);
var sun = new T.Mesh(new T.PlaneGeometry(2.5, 2.5), new T.MeshBasicMaterial({ map: sunTex, transparent: true, toneMapped: false })); sun.position.set(.6, -.4, -2.78); city.add(sun);
var TW = [[-2.3, 1.6, .9, 2.2, 0], [-1.45, 1.9, 1.0, 3.0, 1], [-.5, 1.5, .9, 1.9, 2], [1.55, 1.9, 1.0, 4.1, 3], [2.45, 1.4, .8, 2.4, 4]], tower;
TW.forEach(function (q, i) { var m = new T.MeshStandardMaterial({ color: 0x1b1822, roughness: .4, metalness: .5, emissive: 0xffffff, emissiveMap: windows(4, 10, 11 + i * 17), emissiveIntensity: 1.5 }); var b = box(q[1] * .6, q[3], q[2] * .8, m, q[0], -1.6 + q[3] / 2, -.35); if (i === 3) tower = b; });
function palm(x, z, h) { var g = new T.Group(); var tr = new T.Mesh(new T.CylinderGeometry(.03, .05, h, 6), new T.MeshStandardMaterial({ color: 0x241d1a, roughness: .8 })); tr.position.y = h / 2; g.add(tr); for (var k = 0; k < 7; k++) { var f = new T.Mesh(new T.ConeGeometry(.07, .62, 4), new T.MeshStandardMaterial({ color: 0x172620, roughness: .6, emissive: 0x330a1a, emissiveIntensity: .5 })); f.position.set(Math.cos(k * .9) * .22, h - .04, Math.sin(k * .9) * .22); f.rotation.set(Math.sin(k * .9) * 1.2, 0, -Math.cos(k * .9) * 1.2); g.add(f); } g.position.set(x, -1.59, z); city.add(g); }
[[-2.5, 1.7, 1.2], [-1.6, 2.1, 1.0], [1.2, 2.2, 1.3], [2.4, 1.8, 1.1], [-.2, 2.3, .9]].forEach(function (p) { palm(p[0], p[1], p[2]); });
var car = new T.Group(); box(.62, .13, .3, new T.MeshStandardMaterial({ color: 0x2a2530, roughness: .25, metalness: .8 }), 0, .09, 0, car); box(.32, .1, .26, new T.MeshStandardMaterial({ color: 0x120f16, roughness: .1, metalness: .9 }), -.04, .2, 0, car); box(.03, .05, .22, new T.MeshBasicMaterial({ color: ROSE }), -.32, .1, 0, car); box(.03, .04, .22, new T.MeshBasicMaterial({ color: AMB }), .32, .1, 0, car); car.position.set(-1.2, -1.59, 1.45); city.add(car);
var pud = new T.Mesh(new T.CircleGeometry(.5, 40), new T.MeshStandardMaterial({ map: puddleTex, roughness: .04, metalness: .85, emissive: 0xffffff, emissiveMap: puddleTex, emissiveIntensity: .55 })); pud.rotation.x = -Math.PI / 2; pud.position.set(1.1, -1.575, 1.25); pud.scale.set(1.2, 1, .7); city.add(pud);
var glass = new T.Mesh(new T.BoxGeometry(6, 5.4, 6), new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: .02, transmission: 1, thickness: 1.4, ior: 1.5, attenuationColor: new T.Color(0xdde8ff), attenuationDistance: 8, side: T.DoubleSide, envMapIntensity: 1.0 })); glass.position.y = .25; hero.add(glass);
var plinth = new T.Mesh(new T.CylinderGeometry(4.6, 4.8, .3, 64), new T.MeshStandardMaterial({ color: 0x0b0b0e, roughness: .12, metalness: 1 })); plinth.position.y = -2.6; hero.add(plinth);
var floor = new T.Mesh(new T.CircleGeometry(40, 64), new T.MeshStandardMaterial({ color: 0x030304, roughness: .75, metalness: .25 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.76; S.add(floor);
