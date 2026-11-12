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
/* ---------- timing helpers (same contract as the other Hinglish reels) ---------- */
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {};
function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:!]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2)]; return TM.words[k][1] + (TM.words[k][2] - TM.words[k][1]) * (f == null ? 0 : f); } } } window.__ws[id + '|' + subs] = 'MISS'; return s.t0 + (s.t1 - s.t0) * .5; }
/* ---------- image plates (the city, seen straight-on in a render target, filtered by the three cheats) ---------- */
var RTW = 270, RTH = 480, cityRT = new T.WebGLRenderTarget(RTW, RTH, { samples: 0 }), rtCam = new T.PerspectiveCamera(22, RTW / RTH, .1, 100);
rtCam.position.set(0, .1, 15.5); rtCam.lookAt(0, -.3, 0);
var plateFS = 'uniform sampler2D tx; uniform float clean, tint, seed, wipe, mode; uniform vec2 cells; varying vec2 vUv;\nfloat h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7))+seed)*43758.5453);}\nvoid main(){ vec2 g=floor(vUv*cells); vec3 base=texture2D(tx,(g+.5)/cells).rgb; float keep=step(.86,h(g)); vec3 noisyC=base*keep; vec3 sharp=texture2D(tx,vUv).rgb; vec3 col;\n if(mode<.5){ float m=step(vUv.x,wipe)*clean; col=mix(noisyC,sharp,m); col+=tint*vec3(1.,.36,.56)*dot(sharp,vec3(.3,.5,.2))*.55*m; } else if(mode<1.5){ col=base; } else { col=sharp; }\n gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}';
function plate(w, h) { var m = new T.ShaderMaterial({ uniforms: { tx: { value: cityRT.texture }, clean: { value: 0 }, tint: { value: 0 }, cells: { value: new T.Vector2(1, 1) }, seed: { value: 0 }, wipe: { value: 0 }, mode: { value: 0 } }, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: plateFS }); return new T.Mesh(new T.PlaneGeometry(w, h), m); }
function renderCityRT() { if (window.__skipRender) return; var hv = hero.visible, gv = glass.visible, pv = plinth.visible, fv = floor.visible, ry = hero.rotation.y, gm = [], i; hero.visible = true; glass.visible = false; plinth.visible = false; floor.visible = false; hero.rotation.y = 0; for (i = 0; i < OTHERS.length; i++) { gm[i] = OTHERS[i].visible; OTHERS[i].visible = false; } R.setRenderTarget(cityRT); R.clear(); R.render(S, rtCam); R.setRenderTarget(null); hero.visible = hv; glass.visible = gv; plinth.visible = pv; floor.visible = fv; hero.rotation.y = ry; for (i = 0; i < OTHERS.length; i++) OTHERS[i].visible = gm[i]; }
/* ---------- small builders ---------- */
function G() { var g = new T.Group(); g.visible = false; S.add(g); return g; }
function glassMat(rough, thick) { return new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: rough == null ? .05 : rough, transmission: 1, thickness: thick || .8, ior: 1.5, side: T.DoubleSide }); }
function emis(c, k) { return new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k || 1.6), toneMapped: false }); }
function lineMat(c, k) { return new T.LineBasicMaterial({ color: new T.Color(c).multiplyScalar(k || 1.8), toneMapped: false }); }
function polyline(pts, c, k) { var l = new T.Line(new T.BufferGeometry().setFromPoints(pts), lineMat(c, k)); l.frustumCulled = false; return l; }
function setLine(l, pts, n) { var a = l.geometry.attributes.position, i; for (i = 0; i < pts.length; i++) a.setXYZ(i, pts[i].x, pts[i].y, pts[i].z); l.geometry.setDrawRange(0, n == null ? pts.length : n); a.needsUpdate = true; }
function pathAt(pts, u) { var L = [], tot = 0, i; for (i = 1; i < pts.length; i++) { var d = pts[i].distanceTo(pts[i - 1]); L.push(d); tot += d; } var want = clamp(u) * tot; for (i = 0; i < L.length; i++) { if (want <= L[i] || i === L.length - 1) return pts[i].clone().lerp(pts[i + 1], clamp(want / L[i])); want -= L[i]; } return pts[pts.length - 1].clone(); }
function growPts(pts, u) { var L = [], tot = 0, i; for (i = 1; i < pts.length; i++) { var d = pts[i].distanceTo(pts[i - 1]); L.push(d); tot += d; } var want = clamp(u) * tot, out = [pts[0].clone()]; for (i = 0; i < L.length; i++) { if (want >= L[i]) { out.push(pts[i + 1].clone()); want -= L[i]; } else { out.push(pts[i].clone().lerp(pts[i + 1], want / L[i])); break; } } return out; }
function bar(w, h, d, c, op) { var m = new T.Mesh(new T.BoxGeometry(w, 1, d), glassMat(.08, 1)); var core = new T.Mesh(new T.BoxGeometry(w * .5, 1, d * .5), emis(c, 1.1)); var g = new T.Group(); g.add(m); g.add(core); g.userData = { m: m, core: core, w: w, d: d }; g.setH = function (hh) { hh = Math.max(.02, hh); m.scale.set(1, hh, 1); core.scale.set(1, hh, 1); m.position.y = hh / 2; core.position.y = hh / 2; }; g.setH(h); return g; }
/* ---------- the 16-cell plate: 1 real (amber), 15 AI (rose) — the through-line ---------- */
var cells16 = G(), cellM = [];
for (var ci = 0; ci < 16; ci++) { var cm = new T.Mesh(new T.BoxGeometry(.5, .5, .12), new T.MeshBasicMaterial({ color: 0x15151a, toneMapped: false })); cm.position.set((ci % 4 - 1.5) * .62, (1.5 - Math.floor(ci / 4)) * .62, 0); cells16.add(cm); cellM.push(cm); var ce = new T.Mesh(new T.BoxGeometry(.58, .58, .06), glassMat(.1, .5)); ce.position.copy(cm.position); ce.position.z = -.03; cells16.add(ce); }
function setCells(nA, nR, t, pulse) { for (var i = 0; i < 16; i++) { var c = i < nA ? AMB : (i < nA + nR ? ROSE : 0x15151a), k = i < nA + nR ? 1.5 : 1; if (pulse && i >= nA && i < nA + nR) k *= .8 + .35 * Math.sin(t * 5 + i); cellM[i].material.color.set(c).multiplyScalar(k); } }
/* ---------- DOM: header, big number, 3D-anchored labels, captions ---------- */
var ov = document.getElementById('ov'), capEl = document.getElementById('cap');
function D(css, html) { var d = document.createElement('div'); d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
var kick = D('left:150px;top:176px;width:768px;font:600 20px Inter;letter-spacing:.3em;color:rgba(241,243,248,.66);white-space:nowrap'), title = D('left:150px;top:222px;width:768px;font:200 100px/1.05 Tight;letter-spacing:.14em;color:#f1f3f8;text-transform:uppercase;white-space:nowrap;text-shadow:0 2px 12px rgba(0,0,0,.7)'), sub = D('left:150px;top:350px;width:768px;font:300 28px/1.3 Tight;letter-spacing:.18em;color:rgba(241,243,248,.78);white-space:nowrap'), tagEl = D('left:150px;top:1302px;width:768px;font:600 16px Inter;letter-spacing:.24em;color:rgba(255,180,84,.9);white-space:nowrap');
var big = D('left:150px;top:470px;width:768px;text-align:center;font:200 150px/1 Tight;letter-spacing:.04em;color:#f1f3f8;white-space:nowrap;text-shadow:0 4px 18px rgba(0,0,0,.8)');
var LABS = []; for (var li = 0; li < 6; li++) LABS.push(D('left:0;top:0;font:600 18px Inter;letter-spacing:.22em;color:#f1f3f8;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,.9);transform:translate(-50%,-50%);opacity:0'));
function setText(el, s, op) { if (el._s !== s) { el.innerHTML = s; el._s = s; el._fit = 0; } if (!el._fit && s) { var w = el.scrollWidth; el._fit = 1; if (w > 768) { var f = parseFloat(getComputedStyle(el).fontSize); el.style.fontSize = (f * 768 / w * .98) + 'px'; } } el.style.opacity = op; }
var projV = new T.Vector3();
function lab(i, text, pos, col, op) { var e = LABS[i]; if (!text || op <= 0) { e.style.opacity = 0; return; } projV.copy(pos).project(cam); var x = (projV.x * .5 + .5) * W, y = (-projV.y * .5 + .5) * H; if (e._s !== text) { e.innerHTML = text; e._s = text; } var hw = e.offsetWidth / 2 + 4; x = clamp(x, 150 + hw, 918 - hw); y = clamp(y, 460, 1228); e.style.lineHeight = "1.5"; e.style.textAlign = "center"; e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.color = col || '#f1f3f8'; e.style.opacity = op; }
var CAPO = { plain: true, hi: AMBs, ink: '#f1f3f8', fs: 40, width: 768, lines: 2 };
function pop(t, t0, d) { return eo3((t - t0) / (d || .45)); }
/* ---------- scenes ---------- */
var IDS = ['h1', 'p1', 'r1', 'b1', 'b2', 's1', 's2', 'c1', 'c2', 'c3', 'm1', 'k1', 'e1'];
var SC = IDS.map(function (id, i) { return i === 0 ? 0 : S0(id) - .25; }); SC.push(TM.end);
var gLight = G(), gCloud = G(), gEye = G(), gBars = G(), gP8 = G(), gP9 = G(), gP10 = G(), gCtl = G(), gCases = G(), gSum = G(), OTHERS = [gLight, gCloud, gEye, gBars, gP8, gP9, gP10, gCtl, gCases, gSum, cells16];
/* light path (scenes 2, 3): torch + mirror outside, sun -> tower -> puddle -> eye inside/outside the block */
var torch = new T.Mesh(new T.CylinderGeometry(.16, .24, .9, 20), new T.MeshStandardMaterial({ color: 0x1a1a20, roughness: .2, metalness: .9 })); torch.rotation.z = -Math.PI / 2; torch.position.set(-3.4, -2.2, 3.5); gLight.add(torch);
var torchLamp = new T.Mesh(new T.CylinderGeometry(.2, .2, .05, 20), emis(AMB, 2)); torchLamp.rotation.z = -Math.PI / 2; torchLamp.position.set(-2.93, -2.2, 3.5); gLight.add(torchLamp);
var mirror = new T.Mesh(new T.BoxGeometry(.06, 1.1, .9), new T.MeshStandardMaterial({ color: 0xffffff, roughness: .02, metalness: 1 })); mirror.position.set(-1.0, -1.85, 3.5); mirror.rotation.y = .6; gLight.add(mirror);
var BEAM1 = [P(-2.9, -2.2, 3.5), P(-1.02, -1.85, 3.5), P(1.2, -.4, 3.9)], BEAM1L = polyline(BEAM1, AMB, 2.2); gLight.add(BEAM1L);
var PATH = [P(.5, -.35, -2.6), P(1.4, .3, .08), P(1.1, -1.56, 1.25), P(1.5, -1.3, 4.8)], PATHL = polyline(PATH, AMB, 2.2); gLight.add(PATHL);
var pulse = new T.Mesh(new T.SphereGeometry(.12, 16, 12), emis(0xffffff, 3)); gLight.add(pulse);
var eyeG = new T.Group(); var lens = new T.Mesh(new T.SphereGeometry(.62, 32, 24), glassMat(.02, 1.2)); eyeG.add(lens); var iris = new T.Mesh(new T.CircleGeometry(.28, 28), emis(AMB, 1.4)); iris.position.z = -.35; iris.rotation.y = Math.PI; eyeG.add(iris); var eyeRing = new T.Mesh(new T.TorusGeometry(.72, .06, 12, 40), new T.MeshStandardMaterial({ color: 0x15151a, roughness: .15, metalness: 1 })); eyeG.add(eyeRing); gEye.add(eyeG); eyeG.position.set(0, -.1, 7.4);
/* cloud (scene 4): many bouncing threads from the sun */
var NCL = 90, CL = []; for (var qi = 0; qi < NCL; qi++) { var pts = [P(.5, -.35, -2.6)], cur = pts[0].clone(), dir = new T.Vector3(hash2(qi * 3 + 1) * 2 - 1, (hash2(qi * 3 + 2) * 2 - 1) * .8, hash2(qi * 3 + 3) * 1.2 + .1).normalize(); for (var bk = 0; bk < 3; bk++) { var len = 1.6 + hash2(qi + bk * 17) * 2.4; cur = cur.clone().add(dir.clone().multiplyScalar(len)); cur.x = clamp(cur.x, -2.8, 2.8); cur.y = clamp(cur.y, -1.55, 2.6); cur.z = clamp(cur.z, -2.7, 2.8); pts.push(cur.clone()); dir = new T.Vector3(hash2(qi * 7 + bk) * 2 - 1, hash2(qi * 5 + bk + 9) * 2 - 1, hash2(qi * 11 + bk + 4) * 2 - 1).normalize(); } var ln = polyline(pts, qi % 5 === 0 ? ROSE : AMB, 1.6); gCloud.add(ln); CL.push({ l: ln, p: pts }); }
function hash2(i) { var x = Math.sin(i * 91.17 + 17.3) * 43758.5453; return x - Math.floor(x); }
/* eye + pixel plate (scene 5) */
var PC = 16, PR = 9, PCW = .34, plateG = new T.Group(); gEye.add(plateG); plateG.position.set(0, .25, 4.0);
var pixM = []; for (var py = 0; py < PR; py++) for (var px = 0; px < PC; px++) { var pxm = new T.Mesh(new T.PlaneGeometry(PCW * .86, PCW * .86), new T.MeshBasicMaterial({ color: 0x15151a, toneMapped: false })); pxm.position.set((px - (PC - 1) / 2) * PCW, ((PR - 1) / 2 - py) * PCW, 0); plateG.add(pxm); pixM.push(pxm); }
var plateGlass = new T.Mesh(new T.BoxGeometry(PC * PCW + .1, PR * PCW + .1, .06), glassMat(.12, .4)); plateGlass.position.z = -.05; plateG.add(plateGlass);
var THR = [], eyeP = P(0, -.1, 7.4); for (var ti = 0; ti < PC * PR; ti++) { var cx = (ti % PC - (PC - 1) / 2) * PCW, cy = ((PR - 1) / 2 - Math.floor(ti / PC)) * PCW + .25, cp = P(cx, cy, 4.0), dd = cp.clone().sub(eyeP).normalize(), tt = (-2.4 - eyeP.z) / dd.z, hp = eyeP.clone().add(dd.multiplyScalar(tt)); var tl = polyline([eyeP.clone(), hp], AMB, 1.5); gEye.add(tl); THR.push({ l: tl, a: eyeP.clone(), b: hp, c: cp }); }
/* bars (scene 6, 11): 17 hours vs 1/60 s */
var barA = bar(1.1, 6, 1.1, AMB), barB = bar(1.1, .04, 1.1, ROSE); barA.position.set(-1.2, -.46, 0); barB.position.set(1.2, -.46, 0); gBars.add(barA); gBars.add(barB);
/* scene 8: noisy -> clean plate; 9: small blocky -> lens -> big sharp; 10: exploded slides */
var plate8 = plate(3.2, 5.7), frame8 = new T.Mesh(new T.BoxGeometry(3.4, 5.9, .18), glassMat(.12, 1)); frame8.position.z = -.16; gP8.add(plate8); gP8.add(frame8);
var plate9a = plate(1.3, 2.3), plate9b = plate(2.6, 4.6), dome = new T.Mesh(new T.SphereGeometry(1.1, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(.02, 2)), domeRing = new T.Mesh(new T.TorusGeometry(1.1, .05, 10, 48), new T.MeshStandardMaterial({ color: 0x15151a, roughness: .15, metalness: 1 }));
dome.rotation.x = Math.PI / 2; dome.position.set(-.1, 0, 1.2); domeRing.position.copy(dome.position); plate9a.position.set(-2.4, 0, 0); plate9b.position.set(1.7, 0, -.6); gP9.add(plate9a); gP9.add(plate9b); gP9.add(dome); gP9.add(domeRing);
var slides = []; for (var si = 0; si < 6; si++) { var sg = new T.Group(), spl = plate(1.7, 3.0), sed = new T.Mesh(new T.BoxGeometry(1.86, 3.16, .08), glassMat(.06, .6)), srim = new T.Mesh(new T.BoxGeometry(1.9, .06, .1), emis(si === 0 ? AMB : ROSE, 1.4)); spl.position.z = .06; srim.position.y = -1.62; sg.add(sed); sg.add(spl); sg.add(srim); gP10.add(sg); slides.push({ g: sg, p: spl }); slides[si].p.material.uniforms.mode.value = 2; }
var ctlDot = new T.Mesh(new T.SphereGeometry(.16, 16, 12), emis(AMB, 3)); gCtl.add(ctlDot); var ctlSlides = []; for (var cj = 0; cj < 6; cj++) { var cg = new T.Mesh(new T.BoxGeometry(.9, 1.6, .08), glassMat(.06, .5)), cr = new T.Mesh(new T.BoxGeometry(.7, 1.4, .04), emis(cj % 3 === 0 ? AMB : ROSE, .8)); cg.position.set((cj - 2.5) * 1.35, 0, 0); cr.position.copy(cg.position); cr.position.z = .04; gCtl.add(cg); gCtl.add(cr); ctlSlides.push(cr); }
var caseA = new T.Mesh(new T.BoxGeometry(2.3, 2.0, 2.0), glassMat(.04, 1.6)), caseB = new T.Mesh(new T.BoxGeometry(2.3, 2.0, 2.0), glassMat(.04, 1.6)), coreA = new T.Mesh(new T.BoxGeometry(1.4, .9, 1.0), emis(AMB, .9)), coreB = new T.Mesh(new T.BoxGeometry(1.4, .9, 1.0), emis(0xdfe8ff, .9)); caseA.position.set(-1.45, 0, 0); coreA.position.copy(caseA.position); caseB.position.set(1.45, 0, 0); coreB.position.copy(caseB.position); gCases.add(caseA); gCases.add(coreA); gCases.add(caseB); gCases.add(coreB);
/* ---------- camera shots: named move, from -> to, eased; locked between ---------- */
function P(x, y, z) { return new T.Vector3(x, y, z); }
function CP(px, py, pz, lx, ly, lz, fov) { return { p: P(px, py, pz), l: P(lx, ly, lz), fov: fov || 32 }; }
var SHOT = [
  { a: CP(-13, 3.5, 24, 0, .2, 0, 36), b: CP(-9.5, 3, 20.5, 0, .2, 0, 36), m0: .2, d: 4.2, name: 'sweep + push' },
  { a: CP(-2.5, -.6, 9.5, 1.1, -1.3, 1.2, 32), b: CP(.4, -.9, 7.5, 1.1, -1.3, 1.2, 32), m0: .8, d: 3.6, name: 'low macro dolly to puddle' },
  { a: CP(-9, .6, 24, 0, -.3, 2, 36), b: CP(-4, 1.2, 19.5, 0, -.3, 2, 36), m0: 1.4, d: 4.5, name: 'orbit in on the light path' },
  { a: CP(-13, 4.5, 23, 0, .2, 0, 36), b: CP(-9, 3.2, 19, 0, .2, 0, 36), m0: .8, d: 4.5, name: 'high 3/4 push into the cloud' },
  { a: CP(-5.5, 1.2, 21, 0, 0, 2, 36), b: CP(-2, .6, 17, 0, 0, 2, 36), m0: 1.0, d: 4.5, name: 'orbit to behind the eye' },
  { a: CP(0, .8, 17.5, 0, 1.0, 0, 32), b: CP(0, .8, 17.5, 0, 1.0, 0, 32), m0: 0, d: 1, name: 'locked front' },
  { a: CP(-9, 3.5, 24, 0, .2, 0, 36), b: CP(-7, 2.8, 26, 0, .2, 0, 36), m0: .5, d: 3.0, name: 'slow pull (the block goes dark)' },
  { a: CP(0, -.2, 17, 0, -.5, 0, 30), b: CP(.8, -.2, 15, 0, -.5, 0, 30), m0: 1.5, d: 6.0, name: 'macro push' },
  { a: CP(0, -.1, 15, -.4, -.4, 0, 34), b: CP(.4, -.1, 12.5, 0, -.4, 0, 34), m0: 1.2, d: 4.5, name: 'push through the lens' },
  { a: CP(-14, 5, 17, 0, -.3, 0, 32), b: CP(-10, 3.5, 19, 0, -.3, 0, 32), m0: 1.0, d: 6.0, name: 'exploded orbit' },
  { a: CP(0, .3, 16, 0, -.2, 0, 32), b: CP(0, .3, 16, 0, -.2, 0, 32), m0: 0, d: 1, name: 'locked front' },
  { a: CP(0, .3, 17, 0, -.3, 0, 32), b: CP(0, .3, 17, 0, -.3, 0, 32), m0: 0, d: 1, name: 'locked front' },
  { a: CP(-14, 3.5, 30, 0, .2, 0, 36), b: CP(-11, 3, 26, 0, .2, 0, 36), m0: 1.5, d: 6.0, name: 'pull back to negative space' }
];
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
function camFor(sc, t) { var s = SHOT[sc], u = eio((t - SC[sc] - s.m0) / s.d); cam.position.copy(s.a.p).lerp(s.b.p, u); var l = s.a.l.clone().lerp(s.b.l, u); cam.fov = lerp(s.a.fov, s.b.fov, u); cam.updateProjectionMatrix(); cam.lookAt(l); cam.updateMatrixWorld(); }
/* ---------- per-scene render; returns header text ---------- */
var SCN = [], EVL = [];
function cityLit(k) { city.children.forEach(function (c) { if (c.material && c.material.emissiveMap) c.material.emissiveIntensity = 1.5 * k; }); accK = 1.2 * k; }
var accK = 0, sweepK = 0, sweepAz = null;
function showHero(on) { hero.visible = on; plinth.visible = on; }
/* 1 hook */
SCN[0] = function (t) { showHero(true); var sw = clamp((t - .2) / 3.2), lit = eo3(clamp((t - 1.6) / 2.2)); sweepK = 9 * Math.sin(clamp(sw) * Math.PI) * (sw > 0 && sw < 1 ? 1 : 0); sweepAz = lerp(-2.4, 2.4, eio(sw)); cityLit(lit); car.position.x = lerp(-2.3, 2.3, (t % 9) / 9); hero.rotation.y = 0;
  cells16.visible = !window.__nocells; cells16.position.set(0, 4.6, 0); cells16.scale.setScalar(1.0); cells16.lookAt(cam.position.x, 4.6, cam.position.z); setCells(1, 15, t, true); var to = pop(t, 3.4, .8);
  return { k: 'GTA JAISI DUNIYA · ILLUSTRATIVE · NEON COAST IS A MADE-UP CITY', title: '<span style="color:' + AMBs + '">1</span> / <span style="color:' + ROSEs + '">15</span>', sub: 'PIXEL ASLI · BAAKI AI KE · NVIDIA KA DAAWA', op: to, tag: '' }; };
/* 2 puddle: who draws the reflection? */
SCN[1] = function (t) { showHero(true); cityLit(1); hero.rotation.y = 0; car.position.x = 1.6; glass.visible = true;
  return { k: 'EK SAWAAL', title: 'PUDDLE?', sub: 'BUILDING SCREEN PAR HAI HI NAHI, PHIR BHI DIKH RAHI', op: pop(t, SC[1] + .3), tag: 'ILLUSTRATIVE · NEON COAST IS A MADE-UP CITY' }; };
/* 3 light bounces: torch + mirror, then sun -> tower -> puddle -> eye */
SCN[2] = function (t) { showHero(true); cityLit(1); hero.rotation.y = 0; gLight.visible = true; var tt = WS('r1', 'टॉर्च|तौर्ज', 0), tm = WS('r1', 'उछलती|उचल', 0), tr = WS('r1', 'रिफ्लेक्षण|रिफ्लेक्शन', 0);
  var u1 = clamp((t - tt) / .9); setLine(BEAM1L, growPts(BEAM1, u1), growPts(BEAM1, u1).length); BEAM1L.visible = u1 > 0; torchLamp.material.color.set(AMB).multiplyScalar(2 * (u1 > 0 ? 1 : .2));
  var u2 = clamp((t - tm) / 2.6); var gp = growPts(PATH, u2); setLine(PATHL, gp, gp.length); PATHL.visible = u2 > 0; pulse.visible = u2 > 0; pulse.position.copy(pathAt(PATH, (t * .35) % 1)); eyeG.visible = false;
  lab(0, 'SOORAJ', P(.5, -.35, -2.6), AMBs, u2 > .05 ? pop(t, tm, .4) : 0); lab(1, 'BUILDING', P(1.5, 1.8, .1), AMBs, u2 > .35 ? pop(t, tm + .9, .4) : 0); lab(2, 'PUDDLE = SHEESHA', P(1.1, -1.8, 1.9), ROSEs, u2 > .6 ? pop(t, tm + 1.6, .4) : 0); lab(3, 'AANKH', P(1.5, -1.3, 4.9), '#f1f3f8', u2 > .95 ? pop(t, tm + 2.4, .4) : 0); lab(4, 'TORCH + MIRROR', P(-2.0, -3.3, 3.5), '#f1f3f8', pop(t, SC[2] + .4, .4));
  return { k: 'ROSHNI KA RASTA', title: 'REFLECTION', sub: 'TORCH → SHEESHA → AANKH', op: pop(t, SC[2] + .3), tag: 'SCHEMATIC · ONE RAY SHOWN' }; };
/* 4 too many rays */
SCN[3] = function (t) { showHero(true); cityLit(.85); hero.rotation.y = 0; gCloud.visible = true; var t0 = S0('b1') + .6, k = 0;
  CL.forEach(function (c, i) { var u = clamp((t - t0 - i * .035) / 1.1); var g = growPts(c.p, u); setLine(c.l, g, g.length); c.l.visible = u > 0; k += u > 0 ? 1 : 0; });
  return { k: 'ROSHNI KI BHEED', title: 'ARBON KIRNEIN', sub: 'HAR KIRAN KAI BAAR UCHHALTI HAI · SABKO FOLLOW? NAAMUMKIN', op: pop(t, SC[3] + .3), tag: 'SCHEMATIC · ' + (90) + ' OF BILLIONS SHOWN' }; };
/* 5 backwards: one ray per pixel from the eye */
SCN[4] = function (t) { showHero(true); cityLit(1); hero.rotation.y = 0; gEye.visible = true; eyeG.visible = true; var t1 = S0('b2') + .5, tAll = WS('b2', 'हर|हर', 0), one = clamp((t - t1) / 1.3);
  THR.forEach(function (h, i) { var c = i === 70; var u = c ? one : clamp((t - tAll - (i % 144) * .018) / .6); h.l.visible = u > 0; h.l.material.color.set(AMB).multiplyScalar(c ? 2.4 : 1.1); setLine(h.l, [h.a, h.a.clone().lerp(h.b, eo3(u))], 2); var col = hash2(i * 3) > .66 ? 0x15151a : (hash2(i * 5) > .5 ? AMB : ROSE); pixM[i].material.color.set(u > .95 ? col : 0x1b1b20).multiplyScalar(u > .95 ? 1.5 : 1); if (c) pixM[i].material.color.set(one > .95 ? AMB : 0x1b1b20).multiplyScalar(2); });
  lab(0, 'AANKH', P(0, -1.2, 7.4), '#f1f3f8', pop(t, SC[4] + .4, .4)); lab(1, 'EK PIXEL = EK KIRAN', P(0, 1.9, 4.2), AMBs, one > .9 ? pop(t, t1 + 1.3, .4) : 0);
  return { k: 'ULTA CHALO', title: 'RAY TRACING', sub: 'AANKH SE EK KIRAN · HAR PIXEL KE LIYE', op: pop(t, SC[4] + .3), tag: 'SCHEMATIC · 16 x 9 PIXELS SHOWN' }; };
/* 6 the cost: 83 lakh pixels x 60; 17 hours vs 1/60 s */
SCN[5] = function (t) { showHero(false); gBars.visible = true; var tp = WS('s1', '83|तिरासी', 0), t60 = WS('s1', '60', 0), t17 = WS('s1', '17|सत्रह', 0), ts = WS('s1', '60', 0, true), tx = WS('s1', '36|छत्तीस', 0);
  var n = Math.round(8294400 * eo3((t - tp) / 1.3)); var txt = t < tp ? '' : n.toLocaleString('en-IN'); if (t > t17 - .2) txt = ''; if (t > tx - .1) txt = '36,00,000×'; setText(big, txt, txt ? (t >= tx - .1 ? pop(t, tx, .4) : pop(t, tp, .3)) : 0); big.style.top = '470px'; big.style.color = t >= tx - .1 ? ROSEs : '#f1f3f8';
  barA.setH(3.6 * eo3((t - t17) / 1.2)); barB.setH(.14); barB.visible = t > ts - .1; barA.visible = t > t17 - .1; barB.userData.core.material.color.set(ROSE).multiplyScalar(2 * (t > ts ? 1 : 0));
  lab(0, '17 GHANTE<br>CARS KA EK FRAME · AVG, REPORTED', P(-.5, 3.75, 0), AMBs, (t > t17 + .6 && t < tx - .1) ? pop(t, t17 + .6, .4) : 0); lab(1, '1/60 SECOND<br>GAME KA EK FRAME', P(1.9, .2, 0), ROSEs, t > ts + .1 ? pop(t, ts + .1, .4) : 0);
  var sub2 = t < t60 ? 'FULL 4K SCREEN = 83 LAKH PIXEL' : (t < t17 ? 'x 60 BAAR HAR SECOND' : 'KAAM = 36 LAKH GUNA TEZ · PAPER MATH');
  return { k: 'HISAAB', title: t < t17 ? '4K × 60' : '17 H vs 1/60 S', sub: sub2, op: pop(t, SC[5] + .3), tag: 'PIXEL COUNT = 3840 × 2160 · 17 H / (1/60 S) = 3,672,000' }; };
/* 7 dark moment then three cheats */
SCN[6] = function (t) { showHero(true); var dark = 1 - .92 * eo3((t - SC[6]) / .8); hero.rotation.y = 0; cityLit(dark * .2); var tj = WS('s2', 'जुगार|जुगाड़', 0, true), tw = WS('s2', 'तीन|तीन', 0, true); cells16.visible = false;
  setText(big, '', 0); var title2 = t < tj - .3 ? 'NAAMUMKIN' : 'TEEN JUGAAD';
  if (t >= tj - .3) { cityLit(.35 + .5 * eo3((t - tj + .3) / 1.2)); }
  return { k: 'SEEDHA HISAAB', title: title2, sub: t < tj - .3 ? '' : '1 · KAM KIRNEIN  2 · CHHOTI TASVEER  3 · FLIP-BOOK', op: pop(t, SC[6] + .5), tag: '' }; };
/* 8 cheat 1: dots -> AI paint */
SCN[7] = function (t) { showHero(false); renderCityRT(); gP8.visible = true; gP8.scale.setScalar(.62); var tw = WS('c1', 'पूरी|पूरी', 0), wp = clamp((t - tw) / 3.2), u = plate8.material.uniforms; gP8.rotation.y = lerp(-.14, .1, eio(clamp((t - SC[7]) / 12)));
  u.mode.value = 0; u.cells.value.set(54, 96); u.clean.value = wp > 0 ? 1 : 0; u.wipe.value = eio(wp) * 1.02; u.tint.value = 1; u.seed.value = Math.floor(t * 12) * 3.7; cells16.visible = true; cells16.position.set(2.9, -2.6, 0); cells16.scale.setScalar(.5); cells16.lookAt(cam.position.x, -2.6, cam.position.z); setCells(1, wp > 0 ? 4 : 0, t, false);
  lab(0, 'THODE DOTS<br>= ASLI KIRNEIN', P(0, -2.9, 1), AMBs, pop(t, SC[7] + .5, .4)); lab(1, wp > .3 ? 'AI KA PAINT' : '', P(0, 3.4, 1), ROSEs, wp > .3 ? pop(t, tw + 1, .4) : 0);
  return { k: 'JUGAAD 1 · RAY RECONSTRUCTION', title: 'DOT TO DOT', sub: 'THODE DOTS → AI JODKAR POORI TASVEER', op: pop(t, SC[7] + .3), tag: 'ILLUSTRATIVE · SHADER SIMULATION ON THIS FILM\'S OWN CITY' }; };
/* 9 cheat 2: small -> lens -> big */
SCN[8] = function (t) { showHero(false); renderCityRT(); gP9.visible = true; var u9 = plate9a.material.uniforms, v9 = plate9b.material.uniforms, tb = WS('c2', 'बड़ा|बडा|बड़ा', 0), wp = pop(t, tb, .9); u9.mode.value = 1; u9.cells.value.set(27, 48); v9.mode.value = 2; plate9b.visible = t > tb - .3; plate9b.scale.setScalar(.4 + .6 * wp); dome.visible = t > S0('c2') + 1.4; domeRing.visible = dome.visible;
  cells16.visible = true; cells16.position.set(3.6, -2.7, 0); cells16.scale.setScalar(.5); cells16.lookAt(cam.position.x, -2.7, cam.position.z); setCells(1, t > tb ? 8 : 4, t, false);
  lab(0, 'CHHOTI TASVEER<br>4 MEIN 1 PIXEL', P(-2.4, -2.9, 0), '#f1f3f8', pop(t, SC[8] + .5, .4)); lab(1, 'AI KE SAATH<br>BADI · SHARP', P(1.7, -3.2, 0), ROSEs, t > tb ? pop(t, tb + .3, .4) : 0);
  return { k: 'JUGAAD 2 · DLSS SUPER RESOLUTION', title: 'STICKER → POSTER', sub: 'CHHOTI TASVEER → AI BADA KARKE SHARP', op: pop(t, SC[8] + .3), tag: 'ILLUSTRATIVE · QUARTER PIXELS, NOT A BENCHMARK' }; };
/* 10 cheat 3: flip-book */
SCN[9] = function (t) { showHero(false); renderCityRT(); gP10.visible = true; var t0 = S0('c3') + .8, t1 = WS('c3', 'पांज|पाँच', 0), spread = eo3(clamp((t - t0) / 2.6)) * (1 - clamp((t - SP('c3', .92)) / .5) * clamp((t - SP('c3', .92)) / .5));
  slides.forEach(function (s, i) { s.g.position.set((i - 2.5) * 1.1 * spread, 0, (i - 2.5) * -1.5 * spread); s.g.rotation.y = (i - 2.5) * .04 * spread; var u = s.p.material.uniforms; u.mode.value = 2; });
  gP10.scale.setScalar(.8); cells16.visible = true; cells16.position.set(3.4, -2.8, 0); cells16.scale.setScalar(.5); cells16.lookAt(cam.position.x, -2.8, cam.position.z); setCells(1, 15, t, t > t1);
  lab(0, 'ASLI', slidePos(0), AMBs, spread > .5 ? 1 : 0); lab(1, '5 TAK AI', slidePos(5), ROSEs, t > t1 ? pop(t, t1, .4) : 0);
  return { k: 'JUGAAD 3 · MULTI FRAME GENERATION', title: 'FLIP BOOK', sub: '1 ASLI FRAME + 5 TAK AI KE · NVIDIA KA DAAWA', op: pop(t, SC[9] + .3), tag: 'ILLUSTRATIVE · UP TO 5 GENERATED FRAMES PER RENDERED FRAME (NVIDIA)' }; };
function slidePos(i) { gP10.updateMatrixWorld(true); var v = new T.Vector3(); slides[i].g.getWorldPosition(v); v.applyMatrix4(gP10.matrixWorld); v.y -= 2.1; return v; }
/* 11 add them up */
SCN[10] = function (t) { showHero(false); gSum.visible = false; gBars.visible = true; cells16.visible = true; var tm = WS('m1', '2|दो', 0), tf = WS('m1', '15|पंद्रह', 0), nR = t > tf ? 15 : (t > tm ? 4 : 1); cells16.scale.setScalar(1.35); cells16.position.set(0, .4, 0); cells16.lookAt(cam.position.x, .4, cam.position.z); setCells(1, t > S0('m1') + 2.2 ? Math.min(15, Math.round(15 * eo3((t - S0('m1') - 2.2) / 3))) : 0, t, t > tf);
  barA.visible = false; barB.visible = false; gBars.visible = false; var n = t < S0('m1') + 1.6 ? '' : (t < tm ? '33 MILLION' : (t < tf ? '2 MILLION ASLI' : '15 / 16 AI'));
  setText(big, n, n ? 1 : 0); big.style.top = '1215px'; big.style.fontSize = '64px'; big.style.color = t >= tf ? ROSEs : '#f1f3f8';
  return { k: 'TEENO JODO', title: '15 / 16', sub: '4K FRAME · 33 M PIXEL · SIRF 2 M ASLI', op: pop(t, SC[10] + .3), tag: 'NVIDIA CLAIM · SUPER RESOLUTION PERFORMANCE + 4x MULTI FRAME GENERATION' }; };
/* 12 the catch: AI frames cannot see your button press; console vs PC */
SCN[11] = function (t) { showHero(false); big.style.fontSize = '150px'; var tk2 = S0('k2'); cells16.visible = false;
  if (t < tk2 - .2) { gCtl.visible = true; gCtl.scale.setScalar(.55); var tp = WS('k1', 'बटन|बटन', 0), u = clamp((t - tp) / 2.6); var xs = -3.4 + 6.8 * u; ctlDot.position.set(xs, 1.6 - 1.0 * u, .3); var nxt = Math.ceil((xs + 3.4) / 4.05) * 4.05 - 3.4; var tr = WS('k1', 'लैग|लैग', 0);
    ctlSlides.forEach(function (c, i) { c.material.color.set(i % 3 === 0 ? AMB : ROSE).multiplyScalar(i % 3 === 0 ? 1.6 : .8); });
    lab(0, 'ASLI FRAME', P(-1.9, -1.0, 0), AMBs, 1); lab(1, 'AI FRAME<br>BUTTON NAHI DEKHTA', P(0.0, -1.0, 0), ROSEs, t > tp ? 1 : 0); lab(2, 'LAG', P(1.9, -1.0, 0), '#f1f3f8', t > tr ? pop(t, tr, .4) : 0);
    return { k: 'CATCH', title: 'BUTTON PRESS?', sub: 'AI FRAME NE AAPKA BUTTON DEKHA HI NAHI · LAG · NVIDIA KA JAWAB: REFLEX', op: pop(t, SC[11] + .3), tag: 'SIMPLIFIED · NOT A MEASUREMENT OF ANY GAME' }; }
  gCases.visible = true; gCases.scale.setScalar(.7); var tg = pop(t, tk2, .5); caseA.visible = true; lab(0, 'GTA VI<br>PS5 / XBOX · 19 NOV', P(-1.0, 1.25, 0), AMBs, tg); lab(1, 'DLSS<br>NVIDIA PC GPU', P(1.0, 1.25, 0), '#f1f3f8', tg); lab(2, 'ROCKSTAR NE YE<br>CONFIRM NAHI KIYA', P(0, -1.3, 0), ROSEs, t > WS('k2', 'रॉकस्टार|रॉकस्टार', 0) ? 1 : 0);
  return { k: 'HONEST LIMIT', title: 'CONSOLE ≠ PC', sub: 'GTA VI: PS5 · XBOX SERIES · PC DATE NAHI', op: tg, tag: 'ROCKSTAR HAS CONFIRMED ONLY A 30 FPS TARGET · NO PC DATE' }; };
/* 13 reframe + end card */
SCN[12] = function (t) { showHero(true); cityLit(1); hero.rotation.y = 0; var tc = S0('cta'); cells16.visible = false; car.position.x = lerp(-2.3, 2.3, ((t - SC[12]) % 9) / 9);
  return { k: 'AGLI BAAR PUDDLE DEKHO', title: 'KUCH ASLI · BAAKI AI', sub: '', op: t < tc - .3 ? pop(t, SC[12] + .3) : 0, tag: t < tc - .3 ? 'ILLUSTRATIVE · NEON COAST IS A MADE-UP CITY' : '' }; };
/* ---------- end card ---------- */
var LIME = '#b4f000', tCta = S0('cta');
var scrim = D('left:0;top:830px;width:1080px;height:480px;background:linear-gradient(rgba(3,3,4,0),rgba(3,3,4,.9) 22%,rgba(3,3,4,.9) 80%,rgba(3,3,4,0))'); scrim.setAttribute('data-ov', '1');
var pf = D('left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:6px solid ' + LIME + ';box-shadow:0 0 0 6px #030304,0 0 44px 6px rgba(180,240,0,.4);overflow:hidden;background:#0a0f1d', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('left:385px;top:924px;font:800 62px/1 Inter;letter-spacing:-.02em;color:#eaffd0;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', 'nerdlogic<span style="color:' + LIME + '">.co</span>'), hs = D('left:385px;top:1004px;color:#eef0ff;font:600 22px Inter;letter-spacing:.24em', 'NERDS EXPLAIN · LOGIC EXPLAINS');
var IC = { 'thumb-up': '<path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0l4-8a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2l-1 5a2 2 0 0 1-2 2h-7a3 3 0 0 1-3-1"/>', 'share': '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>', 'bell': '<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/>' };
function ico(n, s, c) { return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + IC[n] + '</svg>'; }
var btns = [['thumb-up', 'LIKE', '#eef0ff', 190, 0], ['share', 'SHARE', '#eef0ff', 210, 210], ['bell', 'SUBSCRIBE', LIME, 290, 440]].map(function (c) { return D('left:' + (158 + c[4]) + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:3px solid ' + c[2] + ';border-radius:8px;background:rgba(3,3,4,.94);display:flex;align-items:center;justify-content:center;gap:10px;font:600 24px Inter;letter-spacing:.08em;color:' + c[2] + ';box-sizing:border-box', ico(c[0], 32, c[2]) + c[1]); });
/* ---------- sound events (kinds understood by audio_mix.py) ---------- */
function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.2, 'whoosh'); ev(3.4, 'pop'); for (var i = 1; i < SC.length - 1; i++) ev(SC[i] + .1, 'whoosh'); ev(WS('r1', 'उछलती|उचल', 0), 'ping'); for (i = 0; i < 6; i++) ev(S0('b1') + .8 + i * .55, 'tick'); ev(S0('b2') + .5, 'ping'); ev(WS('b2', 'हर', 0), 'pop'); ev(WS('s1', '83|तिरासी', 0), 'ping'); ev(WS('s1', '17|सत्रह', 0), 'pop'); ev(WS('s1', '36|छत्तीस', 0), 'slam'); ev(SC[6] + .3, 'rumble'); ev(WS('s2', 'जुगार|जुगाड़', 0, true), 'ping'); ev(WS('c1', 'पूरी', 0), 'ping'); ev(WS('c2', 'बड़ा|बडा', 0), 'pop'); ev(WS('c3', 'पांज|पाँच', 0), 'ping'); ev(S0('c3') + .8, 'card'); ev(WS('m1', '2|दो', 0), 'pop'); ev(WS('m1', '15|पंद्रह', 0), 'slam'); ev(WS('k1', 'बटन', 0), 'pop'); ev(WS('k1', 'लैग', 0), 'buzz'); ev(S0('k2'), 'card'); ev(tCta, 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
window.__reelDurationSec = TM.end; window.EV = EVL; window.__B = SC;
/* ---------- the seek ---------- */
var lastNo = 0;
window.__seek = function (t) {
  t = Math.max(0, Math.min(TM.end - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 2, ec = last && t >= tCta - .1;
  OTHERS.forEach(function (o) { o.visible = false; }); hero.visible = false; plinth.visible = false; glass.visible = true; sweepK = 1.1; accK = .9; sweepAz = 0; LABS.forEach(function (l) { l.style.opacity = 0; }); big.style.fontSize = '150px';
  camFor(sc, t); var h = SCN[sc](t);
  var az = Math.atan2(cam.position.x, cam.position.z) + Math.PI + (sweepAz || 0); bakeEnv(az, sweepK, accK);
  if (!window.__skipRender) R.render(S, cam);
  setText(kick, ec ? '' : h.k, ec ? 0 : clamp((t - SC[sc]) / .4)); setText(title, ec ? '' : h.title, ec ? 0 : h.op); setText(sub, ec ? '' : h.sub, ec ? 0 : (h.sub ? h.op : 0)); setText(tagEl, ec ? '' : h.tag, ec || !h.tag ? 0 : h.op); if (sc !== 5 && sc !== 6 && sc !== 10) big.style.opacity = 0;
  var ue = function (x) { return clamp((t - x) / .35); }; scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var u = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = u > 0 ? 'block' : 'none'; x.style.opacity = u; x.style.transform = 'translateY(' + ((1 - eo3(u)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var u = ec ? ue(bt[i] - .1) : 0; b.style.display = u > 0 ? 'flex' : 'none'; b.style.opacity = u; var pl = u >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(u); b.style.transform = 'scale(' + pl.toFixed(3) + ')'; });
  if (ec) LABS.forEach(function (l) { l.style.opacity = 0; });
  capEl.innerHTML = CAP.html(t, TM.cap, CAPO);
};
Promise.all(['200 40px Tight', '300 30px Tight', '600 30px Inter', '800 30px Inter'].map(function (f) { return document.fonts.load(f); })).then(function () { var im = new Image(); im.onload = im.onerror = function () { window.__ready = true; }; im.src = 'img/profile.jpg'; });
})();
