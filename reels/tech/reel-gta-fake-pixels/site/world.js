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
var floor = new T.Mesh(new T.CircleGeometry(40, 64), new T.MeshStandardMaterial({ color: 0x050507, roughness: .4, metalness: .6 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.76; S.add(floor);
/* ---------- image plates (scene 7 / 9): the city seen straight-on in a render target, filtered by the "cheats" ---------- */
var RTW = 270, RTH = 480, cityRT = new T.WebGLRenderTarget(RTW, RTH, { samples: 0 }), rtCam = new T.PerspectiveCamera(22, RTW / RTH, .1, 100);
rtCam.position.set(0, .1, 15.5); rtCam.lookAt(0, -.3, 0);
var plateFS = 'uniform sampler2D tx; uniform float noisy, clean, tint, cells, seed, wipe; varying vec2 vUv;\nfloat h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed)*43758.5453);}\nvoid main(){ vec2 g=floor(vUv*cells); float keep=step(.86,h(g)); vec3 base=texture2D(tx,(g+.5)/cells).rgb; vec3 noisyC=base*keep; \n vec3 sharp=texture2D(tx,vUv).rgb; float w=smoothstep(wipe-.08,wipe+.08,vUv.x); vec3 col=mix(mix(noisyC,sharp,clean*(1.-w)),sharp,clean*(1.-w)); col=mix(noisyC,sharp,clamp(clean*(1.-w)+clean*.0,0.,1.)); \n col=mix(noisyC,sharp,step(vUv.x,wipe)*clean); col+=tint*vec3(1.,.36,.56)*dot(sharp,vec3(.3,.5,.2))*.55*step(vUv.x,wipe)*clean; gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}';
function plate(w, h) { var m = new T.ShaderMaterial({ uniforms: { tx: { value: cityRT.texture }, noisy: { value: 1 }, clean: { value: 0 }, tint: { value: 0 }, cells: { value: new T.Vector2(1, 1) }, seed: { value: 0 }, wipe: { value: 0 } }, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: plateFS.replace('uniform float noisy, clean, tint, cells, seed, wipe;', 'uniform float noisy, clean, tint, seed, wipe; uniform vec2 cells;').replace(/vec2 g=floor\(vUv\*cells\)/, 'vec2 g=floor(vUv*cells)') }); var o = new T.Mesh(new T.PlaneGeometry(w, h), m); return o; }
var dummy = new T.Group(); S.add(dummy);
function renderCityRT() { hero.visible = true; var gv = glass.visible, pv = plinth.visible, fv = floor.visible, hv = hero.rotation.y; glass.visible = false; plinth.visible = false; floor.visible = false; dummy.visible = false; hero.rotation.y = 0; R.setRenderTarget(cityRT); R.clear(); R.render(S, rtCam); R.setRenderTarget(null); glass.visible = gv; plinth.visible = pv; floor.visible = fv; dummy.visible = true; hero.rotation.y = hv; hero.visible = false; }
/* scene 7 plate + glass frame (frost-to-clear) */
var P7 = new T.Group(); dummy.add(P7); var plate7 = plate(3.2, 5.7); P7.add(plate7); var frame7 = new T.Mesh(new T.BoxGeometry(3.4, 5.9, .18), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .4, transmission: .9, thickness: 1.2, ior: 1.45, side: T.DoubleSide })); frame7.position.z = -.16; P7.add(frame7);
var frost7 = new T.Mesh(new T.BoxGeometry(3.3, 5.8, .1), new T.MeshPhysicalMaterial({ color: 0xdfe6f5, roughness: .55, transmission: .92, thickness: 2, ior: 1.45, transparent: true, opacity: 1 })); frost7.position.z = .12; P7.add(frost7);
/* scene 9: six slides in an exploded line */
var P9 = new T.Group(); dummy.add(P9); var slides = [];
for (var si = 0; si < 6; si++) { var g9 = new T.Group(), pl = plate(1.7, 3.0), edgeCol = si === 0 ? AMB : ROSE, ed = new T.Mesh(new T.BoxGeometry(1.86, 3.16, .08), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .06, transmission: 1, thickness: .6, ior: 1.5, side: T.DoubleSide })), rim = new T.Mesh(new T.BoxGeometry(1.9, .05, .1), new T.MeshBasicMaterial({ color: edgeCol, toneMapped: false })); pl.position.z = .06; rim.position.y = -1.62; g9.add(ed); g9.add(pl); g9.add(rim); P9.add(g9); slides.push({ g: g9, pl: pl, rim: rim }); }
/* ---------- camera shots (authored: named move, from -> to, eased; locked between) ---------- */
function P(x, y, z) { return new T.Vector3(x, y, z); }
var SH = [
  { t0: 0, t1: 4.5, name: 'sweep + slow push', f: { p: P(-15, 4, 28), l: P(0, .9, 0), fov: 36 }, to: { p: P(-11, 3.2, 24), l: P(0, .9, 0), fov: 36 }, ease: eio },
  { t0: 4.5, t1: 7.5, name: 'high 3/4 hold', f: { p: P(-11, 3.2, 24), l: P(0, .9, 0), fov: 36 }, to: { p: P(-9, 5.8, 22), l: P(0, .7, 0), fov: 36 }, ease: eio },
  { t0: 58, t1: 70, name: 'macro rack focus', f: { p: P(0, 0, 16), l: P(0, .7, 0), fov: 30 }, to: { p: P(.8, 0, 14), l: P(0, .7, 0), fov: 30 }, ease: eio },
  { t0: 82, t1: 94, name: 'exploded orbit', f: { p: P(-14, 5.5, 16), l: P(0, .8, 0), fov: 32 }, to: { p: P(-10, 3.8, 18), l: P(0, .8, 0), fov: 32 }, ease: eio }
];
function shotAt(t) { var s = SH[0]; for (var i = 0; i < SH.length; i++) if (t >= SH[i].t0) s = SH[i]; var u = s.ease((t - s.t0) / (s.t1 - s.t0)); return { p: s.f.p.clone().lerp(s.to.p, u), l: s.f.l.clone().lerp(s.to.l, u), fov: lerp(s.f.fov, s.to.fov, u) }; }
/* ---------- overlay DOM ---------- */
var ov = document.getElementById('ov'), capEl = document.getElementById('cap');
function D(css, html) { var d = document.createElement('div'); d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
var kick = D('left:150px;top:176px;width:768px;font:600 20px Inter;letter-spacing:.34em;color:rgba(241,243,248,.62)'), title = D('left:150px;top:230px;width:768px;font:200 112px/1 Tight;letter-spacing:.16em;color:#f1f3f8;text-transform:uppercase;white-space:nowrap'), sub = D('left:150px;top:380px;width:768px;font:300 30px/1.3 Tight;letter-spacing:.2em;color:rgba(241,243,248,.7)');
var tag = D('left:150px;top:1270px;width:768px;font:600 17px Inter;letter-spacing:.28em;color:rgba(255,180,84,.85)');
var TM = window.TM; var CAPO = { plain: true, hi: AMBs, ink: '#f1f3f8', fs: 40, width: 768, lines: 2 };
function setText(el, s, op) { if (el._s !== s) { el.innerHTML = s; el._s = s; } el.style.opacity = op; }
/* ---------- the seek ---------- */
var SCENE = function (t) { return t < 8 ? 1 : (t >= 58 && t < 72) ? 7 : (t >= 82 && t < 96) ? 9 : 0; };
window.__reelDurationSec = 101.4; window.EV = [];
window.__seek = function (t) {
  var sc = SCENE(t), cs = shotAt(t); cam.position.copy(cs.p); cam.fov = cs.fov; cam.updateProjectionMatrix(); cam.lookAt(cs.l); cam.updateMatrixWorld();
  dummy.children.forEach(function (c) { c.visible = false; }); hero.visible = sc === 1; floor.visible = true; plinth.visible = sc === 1;
  var az = Math.atan2(cam.position.x, cam.position.z) + Math.PI, sweepK = 0, accK = 0, ttl = '', kk = '', sb = '', tg = '', to = 1;
  if (sc === 1) {
    var sw = clamp((t - .2) / 3.2), lit = eo3(clamp((t - 1.6) / 2.2)); sweepK = 9 * Math.sin(clamp(sw) * Math.PI) * (sw > 0 && sw < 1 ? 1 : 0); az = lerp(-2.4, 2.4, eio(sw)) + Math.atan2(cam.position.x, cam.position.z) + Math.PI;
    city.children.forEach(function (c) { if (c.material && c.material.emissiveIntensity != null && c.material.emissiveMap) c.material.emissiveIntensity = 1.5 * lit; }); accK = 1.2 * lit;
    car.position.x = lerp(-2.3, 2.3, (t % 9) / 9); hero.rotation.y = 0;
    kk = 'GTA JAISI DUNIYA · ILLUSTRATIVE · NEON COAST IS A MADE-UP CITY'; ttl = '16 / 15'; sb = ''; tg = ''; to = eo3(clamp((t - 3.4) / .8));
    setText(title, '<span style="color:' + AMBs + '">1</span>&nbsp;/&nbsp;<span style="color:' + ROSEs + '">15</span>', to); setText(sub, 'PIXELS ASLI &nbsp;·&nbsp; PIXELS AI KE', to);
  }
  if (sc === 7) {
    renderCityRT(); sweepK = 1.4; var u = clamp((t - 58) / 12), wp = clamp((t - 63.5) / 4.5);
    dummy.visible = true; P7.visible = true; P7.scale.setScalar(.62); P7.position.set(0, 0, 0); P7.rotation.y = lerp(-.18, .1, eio(u));
    plate7.material.uniforms.cells.value.set(54, 96); plate7.material.uniforms.clean.value = wp > 0 ? 1 : 0; plate7.material.uniforms.wipe.value = eio(wp) * 1.02; plate7.material.uniforms.tint.value = 1; plate7.material.uniforms.seed.value = Math.floor(t * 12) * 3.7;
    frost7.material.opacity = 1 - eo3(clamp((t - 63.5) / 3)); frost7.visible = frost7.material.opacity > .01; frost7.visible = false; if (window.__hf) { frost7.visible = false; frame7.visible = false; } frost7.material.roughness = lerp(.0, .55, frost7.material.opacity);
    kk = 'JUGAAD 1 · RAY RECONSTRUCTION'; setText(title, 'FROST&nbsp;&rarr;&nbsp;CLEAR', .96); sb = 'THODE DOTS (AMBER) &rarr; AI KA PAINT (ROSE)'; tg = 'ILLUSTRATIVE · SHADER SIMULATION OF DENOISING ON THIS FILM\'S OWN CITY';
    hero.visible = false; plinth.visible = false; floor.visible = false;
  }
  if (sc === 9) {
    renderCityRT(); sweepK = 1.2; var ux = clamp((t - 82) / 12), spread = eo3(clamp((t - 83) / 3)) * (1 - ei3(clamp((t - 91.8) / .5)));
    dummy.visible = true; P9.visible = true; P9.rotation.y = lerp(-.3, .3, eio(ux));
    P9.scale.setScalar(.8); slides.forEach(function (s, i) { s.g.position.set((i - 2.5) * 1.1 * spread, 0, (i - 2.5) * -1.5 * spread); s.g.rotation.y = (i - 2.5) * .04 * spread; var u = s.pl.material.uniforms; u.cells.value.set(170, 300); u.clean.value = 1; u.wipe.value = 1.1; u.tint.value = i === 0 ? 0 : 1; });
    kk = 'JUGAAD 3 · MULTI FRAME GENERATION'; setText(title, 'FLIP&nbsp;BOOK', .96); sb = '1 ASLI FRAME (AMBER) + 5 TAK AI KE (ROSE) &nbsp;·&nbsp; NVIDIA CLAIM'; tg = '';
    hero.visible = false; plinth.visible = false; floor.visible = false;
  }
  bakeEnv(az, sweepK, accK);
  S.fog = null; R.render(S, cam);
  setText(kick, kk, 1); if (sc !== 1) setText(title, title.innerHTML, 1); setText(sub, sb || sub.innerHTML, sc === 1 ? to : (sb ? 1 : 0)); setText(tag, tg, tg ? 1 : 0);
  capEl.innerHTML = CAP.html(t, TM.cap, CAPO);
};
window.__dbg = { frost7: frost7, frame7: frame7, plate7: plate7, glass: glass };
document.fonts.ready.then(function () { window.__ready = true; });
})();
