/* Surya Tilak — "Sooraj ko andar kaise laaye?"  three.js r160; scene -> HDR RT -> bloom -> ACES. Every visual is a pure function of t (window.__seek).
   Schematic temple (generic Nagara section, NOT the temple's drawings). The idol is never modelled. Figures are illustrative brick people. */
(function () {
var T = THREE, W = 1080, H = 1920, TM = window.TM;
var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)); };
var eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
var eo = function (x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
var eob = function (x) { x = clamp(x); var c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
var lerp = function (a, b, u) { return a + (b - a) * u; };
var ramp = function (t, a, b) { return clamp((t - a) / (b - a)); };
var hsh = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace; R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
var S = new T.Scene(), cam = new T.PerspectiveCamera(30, W / H, .05, 900);
var ov = document.getElementById('ov'), svg = document.getElementById('lines'), capEl = document.getElementById('cap');
var V = function (x, y, z) { return new T.Vector3(x, y, z); };

// ---------- timing helpers ----------
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
var MISS = []; window.__cue = MISS;
function CUE(id, frac) { var s = SEN[id]; return s.t0 + (s.t1 - s.t0) * frac; }       // a point inside a sentence (fraction of its span, snapped to the nearest real word start)
function CW(id, frac) { var tt = CUE(id, frac), best = tt, bd = .6; for (var k = SEN[id].k0; k <= SEN[id].k1; k++) { var d = Math.abs(TM.words[k][1] - tt); if (d < bd) { bd = d; best = TM.words[k][1]; } } return best; }
var DUR = TM.end; window.__reelDurationSec = DUR;

// ---------- environment + post ----------
var pm = new T.PMREMGenerator(R), envS = new T.Scene();
envS.add(new T.Mesh(new T.SphereGeometry(50, 24, 12), new T.MeshBasicMaterial({ color: 0x1c0f10, side: T.BackSide })));
[[0, 30, 14, 34, 3, 10, 5, 1, .86, .62], [-26, 8, 12, 3, 16, 22, 1.6, .6, .7, 1], [24, 10, 6, 3, 12, 16, 1.2, 1, .8, .6]].forEach(function (q) {
  var m = new T.Mesh(new T.BoxGeometry(q[3], q[4], q[5]), new T.MeshBasicMaterial({ color: new T.Color(q[7], q[8], q[9]).multiplyScalar(q[6]) })); m.position.set(q[0], q[1], q[2]); m.lookAt(0, 0, 0); envS.add(m); });
S.environment = pm.fromScene(envS, .02).texture; S.background = new T.Color(0x120709);
var rtA = new T.WebGLRenderTarget(W, H, { samples: 4, type: T.HalfFloatType }), q4 = function () { return new T.WebGLRenderTarget(W / 4, H / 4, { type: T.HalfFloatType }); }, rB1 = q4(), rB2 = q4();
var pq = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), pS = new T.Scene(), quad = new T.Mesh(new T.PlaneGeometry(2, 2)); pS.add(quad);
var VS = 'varying vec2 vU; void main(){ vU=uv; gl_Position=vec4(position.xy,0.,1.); }';
var mBright = new T.ShaderMaterial({ uniforms: { tex: { value: null } }, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; varying vec2 vU; void main(){ vec3 c=texture2D(tex,vU).rgb; float l=dot(c,vec3(.2126,.7152,.0722)); gl_FragColor=vec4(c*smoothstep(.9,2.2,l),1.); }' });
var mBlur = new T.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new T.Vector2() } }, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; uniform vec2 dir; varying vec2 vU; void main(){ vec3 s=vec3(0.); float w=0.; for(int i=-6;i<=6;i++){ float g=exp(-float(i*i)/14.); s+=texture2D(tex,vU+dir*float(i)).rgb*g; w+=g; } gl_FragColor=vec4(s/w,1.); }' });
var mGrade = new T.ShaderMaterial({ uniforms: { tex: { value: null }, bl: { value: null }, exp: { value: 1 }, bloom: { value: .8 }, fade: { value: 0 }, t: { value: 0 } }, vertexShader: VS,
  fragmentShader: 'uniform sampler2D tex, bl; uniform float exp, bloom, fade, t; varying vec2 vU; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }' +
  'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }' +
  'void main(){ vec3 c=(texture2D(tex,vU).rgb + texture2D(bl,vU).rgb*bloom)*exp; c=aces(c); c=pow(c,vec3(1./2.2)); vec2 q=vU-.5; c*=1.-dot(q*vec2(1.,.8),q*vec2(1.,.8))*1.0; c+=(h(vU*vec2(1080.,1920.)+fract(t)*7.)-.5)*.022; c=mix(c,vec3(.07,.027,.035),fade); gl_FragColor=vec4(c,1.); }' });
[mBright, mBlur, mGrade].forEach(function (m) { m.depthTest = false; m.toneMapped = false; });
function render(t) {
  if (window.__skipRender) return;
  R.setRenderTarget(rtA); R.render(S, cam);
  quad.material = mBright; mBright.uniforms.tex.value = rtA.texture; R.setRenderTarget(rB1); R.render(pS, pq);
  for (var k = 0; k < 3; k++) { quad.material = mBlur; mBlur.uniforms.tex.value = rB1.texture; mBlur.uniforms.dir.value.set(3 / W * (k + 1), 0); R.setRenderTarget(rB2); R.render(pS, pq);
    mBlur.uniforms.tex.value = rB2.texture; mBlur.uniforms.dir.value.set(0, 3 / H * (k + 1)); R.setRenderTarget(rB1); R.render(pS, pq); }
  quad.material = mGrade; mGrade.uniforms.tex.value = rtA.texture; mGrade.uniforms.bl.value = rB1.texture; mGrade.uniforms.t.value = t; R.setRenderTarget(null); R.render(pS, pq);
}
var v3 = new T.Vector3();
function scr(p) { v3.copy(p).project(cam); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H, z: v3.z }; }

// ---------- materials ----------
function stoneTex() { var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d'); g.fillStyle = '#e9dfcc'; g.fillRect(0, 0, 512, 512);
  for (var i = 0; i < 9000; i++) { var a = hsh(i) * .07; g.fillStyle = hsh(i + 3) > .5 ? 'rgba(120,90,60,' + a + ')' : 'rgba(255,250,240,' + a + ')'; g.fillRect(hsh(i + 1) * 512, hsh(i + 2) * 512, 1 + hsh(i + 5) * 3, 1 + hsh(i + 6) * 2); }
  g.strokeStyle = 'rgba(90,60,40,.16)'; g.lineWidth = 2; for (var y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); for (var x = (y / 64 % 2) * 64; x < 512; x += 128) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } }
  var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.repeat.set(2, 2); return t; }
var sTex = stoneTex();
var STONE = new T.MeshStandardMaterial({ map: sTex, color: 0xf3d9c4, roughness: .9, envMapIntensity: .35 }), STONE_D = new T.MeshStandardMaterial({ map: sTex, color: 0xd9b9a2, roughness: .92, envMapIntensity: .35 });
function carveTex() { var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d'); g.fillStyle = '#e6c9b2'; g.fillRect(0, 0, 512, 512);
  function rel(fn) { g.save(); g.translate(2, 3); g.strokeStyle = 'rgba(80,40,25,.5)'; fn(); g.restore(); g.save(); g.translate(-1.5, -2); g.strokeStyle = 'rgba(255,246,232,.75)'; fn(); g.restore(); }
  g.lineWidth = 5; for (var cx = 0; cx < 2; cx++) for (var cy = 0; cy < 2; cy++) (function (ox, oy) { rel(function () { g.beginPath(); g.moveTo(ox + 26, oy + 250); g.lineTo(ox + 26, oy + 110); g.bezierCurveTo(ox + 26, oy + 40, ox + 128, oy + 70, ox + 128, oy + 18); g.bezierCurveTo(ox + 128, oy + 70, ox + 230, oy + 40, ox + 230, oy + 110); g.lineTo(ox + 230, oy + 250); g.stroke();
      for (var k = 0; k < 12; k++) { var a = k / 12 * 6.283; g.beginPath(); g.ellipse(ox + 128 + Math.cos(a) * 34, oy + 150 + Math.sin(a) * 34, 20, 8, a, 0, 6.283); g.stroke(); } g.beginPath(); g.arc(ox + 128, oy + 150, 13, 0, 6.283); g.stroke(); g.beginPath(); g.arc(ox + 128, oy + 150, 62, 0, 6.283); g.stroke();
      for (var q = 0; q < 6; q++) { g.beginPath(); g.arc(ox + 21 + q * 43, oy + 246, 17, Math.PI, 0); g.stroke(); } }); })(cx * 256, cy * 256);
  var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.repeat.set(5, 4); return t; }
var CARVE = new T.MeshStandardMaterial({ map: carveTex(), roughness: .88, envMapIntensity: .35 });
var CUT = new T.MeshStandardMaterial({ color: 0x8a5a44, roughness: .95, envMapIntensity: .2 });
var BRASS = new T.MeshStandardMaterial({ color: 0xd9a441, metalness: 1, roughness: .28 }), BRASS_D = new T.MeshStandardMaterial({ color: 0xa87a2c, metalness: 1, roughness: .42 });
var BLACK = new T.MeshStandardMaterial({ color: 0x0a0806, roughness: 1, side: T.BackSide, envMapIntensity: 0 });
var MIRROR = new T.MeshStandardMaterial({ color: 0xf4f6ff, metalness: 1, roughness: .03, envMapIntensity: 1.6 });
var GLASS = new T.MeshPhysicalMaterial({ color: 0xeaf6ff, roughness: .03, transmission: 1, thickness: .2, ior: 1.5, transparent: true, opacity: .55, envMapIntensity: 1.5, depthWrite: false });
var IRG = new T.MeshPhysicalMaterial({ color: 0x9fe6d0, roughness: .05, transparent: true, opacity: .5, envMapIntensity: 1.4, depthWrite: false });
function box(w, h, d, m, x, y, z, par) { var b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; (par || S).add(b); return b; }
function cyl(r1, r2, h, m, x, y, z, par, seg) { var b = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 24), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; (par || S).add(b); return b; }
function glowTex(c0, c1) { var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, c0); gr.addColorStop(.35, c1); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; }
function textPlane(txt, hgt, col, wt) { var c = document.createElement('canvas'), g = c.getContext('2d'), f = (wt || '500') + ' 64px MM'; g.font = f; var w = Math.ceil(g.measureText(txt).width) + 16; c.width = w; c.height = 84; g = c.getContext('2d'); g.font = f; g.fillStyle = col || '#f6ecd9'; g.textBaseline = 'middle'; g.fillText(txt, 8, 44);
  var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; var m = new T.Mesh(new T.PlaneGeometry(hgt * w / 84, hgt), new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); m.userData.w = hgt * w / 84; return m; }

// ---------- schematic temple, cut at z = 0. 1 unit = 1 m, floors 6 m (20 ft). West = -x (sanctum), north = -z ----------
var TEM = new T.Group(); S.add(TEM);
var X0 = -9, X1 = 15, Z0 = -8, FH = 6;
box(X1 - X0 + 3, 1.2, 9.5, STONE_D, (X0 + X1) / 2, -.6, Z0 / 2 - .75, TEM);
for (var f = 1; f <= 3; f++) { box(X1 - X0, .55, -Z0 - 5.1, STONE, (X0 + X1) / 2, f * FH, Z0 + (-Z0 - 5.1) / 2, TEM); box(X1 - X0, .55, 3.9, STONE, (X0 + X1) / 2, f * FH, -1.95, TEM);
  box(3 - .6 - X0, .55, 1.2, STONE, (X0 + 2.4) / 2, f * FH, -4.5, TEM); box(X1 - 3.6, .55, 1.2, STONE, (X1 + 3.6) / 2, f * FH, -4.5, TEM); box(X1 - X0, .56, .04, CUT, (X0 + X1) / 2, f * FH, 0, TEM); }
box(.8, 18.3, -Z0, STONE, X0 - .4, 9.15, Z0 / 2, TEM); box(.8, 18.3, -Z0, STONE, X1 + .4, 9.15, Z0 / 2, TEM); box(X1 - X0 + 1.6, 18.3, .8, CARVE, (X0 + X1) / 2, 9.15, Z0 - .4, TEM);
box(.82, 18.3, .04, CUT, X0 - .4, 9.15, 0, TEM); box(.82, 18.3, .04, CUT, X1 + .4, 9.15, 0, TEM);
for (var f2 = 0; f2 < 3; f2++) for (var px = -1; px <= 13; px += 3.5) { if (Math.abs(px - 3) < 1) continue; var py = f2 * FH + .28;
  cyl(.34, .4, 5.1, STONE, px, py + 2.8, -6.4, TEM, 12); box(1.0, .35, 1.0, STONE, px, py + .2, -6.4, TEM); box(1.1, .3, 1.1, STONE, px, py + 5.3, -6.4, TEM); cyl(.5, .34, .4, STONE, px, py + 4.95, -6.4, TEM, 12); }
box(.6, 5.45, 4.6, STONE, -1.2, 3, -5.7, TEM);
var NICHE = V(-8.2, 1.62, -1.5);
box(.5, 4.3, 3.4, STONE_D, -8.72, 2.4, -1.5, TEM); box(.7, .5, 3.9, STONE, -8.5, .5, -1.5, TEM); box(.6, 3.3, .42, STONE, -8.5, 2.4, -.02, TEM); box(.6, 3.3, .42, STONE, -8.5, 2.4, -3.0, TEM);
(function () { var a = new T.Mesh(new T.TorusGeometry(1.5, .26, 12, 40, Math.PI), STONE); a.rotation.y = Math.PI / 2; a.position.set(-8.5, 4.02, -1.5); a.castShadow = true; TEM.add(a);
  cyl(.95, 1.15, .28, STONE, -8.0, .9, -1.5, TEM, 20); cyl(.75, .95, .2, BRASS_D, -8.0, 1.12, -1.5, TEM, 20); })();
var AURA = new T.Mesh(new T.PlaneGeometry(2.3, 3.5), new T.MeshBasicMaterial({ map: glowTex('rgba(255,214,150,.55)', 'rgba(255,170,90,.18)'), transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: .2 })); AURA.rotation.y = Math.PI / 2; AURA.position.set(-8.35, 2.35, -1.5); AURA.scale.set(.8, .85, 1); TEM.add(AURA);
(function () { var pts = [], n = 22; for (var i = 0; i <= n; i++) { var u = i / n; pts.push(new T.Vector2(4.6 * Math.pow(1 - u, .62) * (1 - .12 * u) + .55, u * 26)); }
  var m = new T.Mesh(new T.LatheGeometry(pts, 20, Math.PI / 2, Math.PI), new T.MeshStandardMaterial({ map: sTex, roughness: .92, side: T.DoubleSide, envMapIntensity: .35 })); m.position.set(-4.6, 18.3, 0); m.castShadow = m.receiveShadow = true; TEM.add(m);
  var am = new T.Mesh(new T.SphereGeometry(1.5, 20, 10, Math.PI, Math.PI), STONE); am.scale.y = .42; am.position.set(-4.6, 44.9, 0); TEM.add(am); cyl(.2, .5, 2.2, BRASS, -4.6, 46.6, -.3, TEM);
  for (var s = 0; s < 4; s++) box(9.6 - s * 2.0, .9, 7.6 - s * 1.5, STONE, 9.8, 18.9 + s * .9, -4.2, TEM); cyl(.5, 1.1, 1.4, STONE, 9.8, 23.0, -4.2, TEM, 16); })();
// little oil lamp near the niche
var lamp = new T.PointLight(0xff9a4a, .9, 6, 2); lamp.position.set(-7.3, 1.1, .1); S.add(lamp); cyl(.08, .12, .42, BRASS, -7.3, .7, -.1); var flame = new T.Mesh(new T.SphereGeometry(.04, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(6, 2.6, .8) })); flame.position.set(-7.3, 1.0, -.1); S.add(flame);

// ---------- v2 decoration: marigold garlands, flags, diyas, bells, rangoli, carpet, petals; the real idol photo as an inset in the niche ----------
var FRONTG = new T.Group(); TEM.add(FRONTG); var FLW = [0xff8a00, 0xffc400], gSph = new T.SphereGeometry(1, 8, 6), FLM = new T.MeshStandardMaterial({ roughness: .8, envMapIntensity: .3 });
function garlandPts(pts, r, par) { var n = pts.length, m = new T.InstancedMesh(gSph, FLM, n), o = new T.Object3D(), c = new T.Color();
  for (var i = 0; i < n; i++) { o.position.copy(pts[i]); o.scale.setScalar(r * (.85 + .3 * hsh(i * 3.1 + pts[0].x))); o.updateMatrix(); m.setMatrixAt(i, o.matrix); c.setHex(FLW[Math.floor(i / 3) % 2]); if (hsh(i + 7.3 + pts[0].y) > .88) c.setHex(0xfff0d8); else if (hsh(i + 2.1) > .93) c.setHex(0xd81e3a); m.setColorAt(i, c); }
  m.instanceColor.needsUpdate = true; (par || TEM).add(m); return m; }
function swag(a, b, sag, n, r, par) { var pts = []; for (var i = 0; i < n; i++) { var u = i / (n - 1), q = a.clone().lerp(b, u); q.y -= sag * 4 * u * (1 - u); pts.push(q); } return garlandPts(pts, r, par); }
for (var gf = 1; gf <= 3; gf++) for (var gx = X0; gx < X1 - .1; gx += 3) { swag(V(gx, gf * FH - .32, .1), V(gx + 3, gf * FH - .32, .1), .62, 24, .105, FRONTG); swag(V(gx, gf * FH - .32, .1), V(gx, gf * FH - 1.5, .1), 0, 9, .095, FRONTG); }
for (var gx2 = X0; gx2 < X1 - .1; gx2 += 3) swag(V(gx2, 18.35, .1), V(gx2 + 3, 18.35, .1), .5, 24, .105, FRONTG);
(function () { var pts = []; for (var k = 0; k <= 46; k++) { var a = k / 46 * Math.PI; pts.push(V(-8.18, 4.02 + Math.sin(a) * 1.84, -1.5 + Math.cos(a) * 1.84)); } garlandPts(pts, .1); swag(V(-8.2, 4.02, -.3), V(-8.2, .9, -.3), 0, 30, .07); swag(V(-8.2, 4.02, -2.72), V(-8.2, .9, -2.72), 0, 30, .07);
  for (var f3 = 0; f3 < 3; f3++) for (var px3 = -1; px3 <= 13; px3 += 3.5) { if (Math.abs(px3 - 3) < 1) continue; var rp = []; for (var k2 = 0; k2 < 16; k2++) { var a2 = k2 / 16 * 6.283; rp.push(V(px3 + Math.cos(a2) * .47, f3 * FH + 4.75 + Math.sin(a2 * 3) * .04, -6.4 + Math.sin(a2) * .47)); } garlandPts(rp, .085); swag(V(px3, f3 * FH + 4.7, -5.93), V(px3, f3 * FH + 3.2, -5.93), 0, 12, .08); } })();
var FLAGS = []; function flag(x, y, z, w, h) { cyl(.05, .05, h * 2.6, BRASS, x, y + h * 1.3, z, TEM, 8); var g = new T.PlaneGeometry(w, h, 16, 4), m = new T.Mesh(g, new T.MeshStandardMaterial({ color: 0xff7a1a, roughness: .7, side: T.DoubleSide, emissive: 0x7a2a00, emissiveIntensity: .5 })); m.position.set(x + w / 2, y + h * 2.05, z); TEM.add(m); m.userData = { b: Array.prototype.slice.call(g.attributes.position.array), w: w }; FLAGS.push(m); }
flag(-4.6, 47.3, -.3, 3.4, 2.0); flag(9.8, 23.7, -4.2, 2.3, 1.35);
var DIYA = []; (function () { for (var x = X0 + .6; x < X1 - .2; x += 1.15) DIYA.push(V(x, .28, -.14)); for (var k = 0; k < 7; k++) { var a = -1.2 + k * .4; DIYA.push(V(-6.9 + Math.cos(a) * .1 - Math.abs(a) * .25, .28, -1.5 + Math.sin(a) * 1.9)); } for (var f = 1; f <= 2; f++) for (var x2 = X0 + 1.2; x2 < X1 - .5; x2 += 2.3) DIYA.push(V(x2, f * FH + .28, -.14)); })();
var DBOWL = new T.InstancedMesh(new T.CylinderGeometry(.075, .04, .05, 10), BRASS, DIYA.length), DFL = new T.InstancedMesh(new T.SphereGeometry(.035, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(3.2, 1.5, .45) }), DIYA.length);
(function () { var o = new T.Object3D(); DIYA.forEach(function (q, i) { o.position.copy(q).add(V(0, .025, 0)); o.updateMatrix(); DBOWL.setMatrixAt(i, o.matrix); }); TEM.add(DBOWL); TEM.add(DFL); })();
var BELLS = []; [0, 2.6, 5.2, 7.8, 10.4, 13].forEach(function (bx, i) { var g = new T.Group(); g.position.set(bx, FH - .28, -1.1); cyl(.012, .012, .7, BRASS_D, 0, -.35, 0, g, 6); cyl(.05, .17, .26, BRASS, 0, -.82, 0, g, 16); var cl = new T.Mesh(new T.SphereGeometry(.04, 8, 6), BRASS_D); cl.position.y = -.98; g.add(cl); TEM.add(g); BELLS.push(g); });
(function () { var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d'); g.translate(256, 256); var cols = ['#ff8a00', '#ffd23a', '#e6294a', '#fff3dc', '#2aa66a', '#ff5fa2'];
  for (var ring = 5; ring >= 1; ring--) { var n = 8 + ring * 4; for (var k = 0; k < n; k++) { var a = k / n * 6.283; g.save(); g.rotate(a); g.fillStyle = cols[(ring + k) % cols.length]; g.beginPath(); g.ellipse(ring * 44, 0, 30, 15, 0, 0, 6.283); g.fill(); g.restore(); } } g.fillStyle = '#ffd23a'; g.beginPath(); g.arc(0, 0, 26, 0, 6.283); g.fill();
  var tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; var m = new T.Mesh(new T.CircleGeometry(1.45, 48), new T.MeshStandardMaterial({ map: tx, transparent: true, roughness: .9, envMapIntensity: .2, polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.x = -Math.PI / 2; m.position.set(-3.6, .292, -1.55); m.receiveShadow = true; TEM.add(m);
  var cp = box(17.5, .015, 1.5, new T.MeshStandardMaterial({ color: 0x9c1c22, roughness: .95, envMapIntensity: .15 }), 5.6, .288, -1.85, TEM); cp.castShadow = false; box(17.5, .016, .08, BRASS_D, 5.6, .289, -1.1, TEM); box(17.5, .016, .08, BRASS_D, 5.6, .289, -2.6, TEM); })();
var NPET = 240, PETAL = new T.InstancedMesh(new T.PlaneGeometry(.1, .07), new T.MeshBasicMaterial({ side: T.DoubleSide }), NPET); (function () { var c = new T.Color(), pc = [0xff9a1a, 0xffd23a, 0xff6fa8, 0xfff0d8]; for (var i = 0; i < NPET; i++) { c.setHex(pc[i % 4]).multiplyScalar(.9); PETAL.setColorAt(i, c); } PETAL.instanceColor.needsUpdate = true; PETAL.frustumCulled = false; S.add(PETAL); })();
var HALL = [1.5, 7, 12.5].map(function (x) { var l = new T.PointLight(0xffb060, 0, 11, 1.7); l.position.set(x, 4.6, -1.6); S.add(l); return l; });
var kal = new T.Mesh(new T.SphereGeometry(.55, 20, 14), BRASS); kal.position.set(-4.6, 46.1, -.3); kal.scale.y = 1.15; TEM.add(kal);
var IDOL = (function () { var im = window.IM && window.IM['idol-sanctum.jpg']; if (!im || !im.width) return new T.Group(); var c = document.createElement('canvas'); c.width = 440; c.height = 520; var g = c.getContext('2d'); g.drawImage(im, 650, 265, 220, 260, 0, 0, 440, 520);
  g.globalCompositeOperation = 'destination-in'; var gr = g.createRadialGradient(220, 250, 150, 220, 250, 262); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 440, 520);
  var tx = new T.CanvasTexture(c); tx.colorSpace = T.SRGBColorSpace; tx.anisotropy = 8; var hgt = 1.9, wid = hgt * 220 / 260, m = new T.Mesh(new T.PlaneGeometry(wid, hgt), new T.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, color: new T.Color(.8, .76, .7) }));
  m.rotation.y = Math.PI / 2; m.position.set(NICHE.x - .05, NICHE.y - (.5 - .246) * hgt, NICHE.z); m.renderOrder = 2; S.add(m); return m; })();

// ---------- Sun geometry (real): Ayodhya 26.7956 N; noon elevation = 90 - lat + declination ----------
var LAT = 26.7956;
function decl(doy) { var g = 2 * Math.PI / 365.2422 * (doy - 1 + .27); return (0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g)) * 180 / Math.PI; }
function elev(doy) { return 90 - LAT + decl(doy); }
var EL24 = elev(108), EL25 = elev(96);                // 17 Apr 2024 (leap year day 108), 6 Apr 2025 (day 96)
function sunDir(el) { var e = el * Math.PI / 180; return V(0, Math.sin(e), Math.cos(e)); }

// ---------- the periscope (SCHEMATIC: dimensions are not published) ----------
var AP = V(3, 18.45, -.27), M1 = V(3, 14.1, -1.5), M2 = V(3, 14.1, -4.5), M3 = V(3, 3.4, -4.5), M4 = V(3, 3.4, -1.5);
(function () { var sd = sunDir(EL24); AP.copy(M1).addScaledVector(sd, (18.45 - 14.1) / sd.y); })();
var PER = new T.Group(); S.add(PER);
var dN = V(0, 0, -1), dD = V(0, -1, 0), dSo = V(0, 0, 1), dW = NICHE.clone().sub(M4).normalize();
function mirror(p, din, dout, r) { var g = new T.Group(); g.position.copy(p); var n = dout.clone().sub(din).normalize(); g.lookAt(p.clone().add(n));
  var d = new T.Mesh(new T.CylinderGeometry(r, r, .04, 40), MIRROR); d.rotation.x = Math.PI / 2; g.add(d); g.add(new T.Mesh(new T.TorusGeometry(r + .03, .05, 10, 40), BRASS));
  var back = new T.Mesh(new T.CylinderGeometry(r * .5, r * .9, .12, 24), BRASS_D); back.rotation.x = Math.PI / 2; back.position.z = -.09; g.add(back);
  var h = new T.Mesh(new T.CircleGeometry(r * .9, 40), new T.MeshBasicMaterial({ map: glowTex('rgba(255,240,210,1)', 'rgba(255,190,110,.75)'), color: new T.Color(2.6, 2.2, 1.6), transparent: true, blending: T.AdditiveBlending, depthWrite: false })); h.position.z = .03; h.renderOrder = 10; g.add(h); g.userData.glow = h;
  var l = new T.PointLight(0xffd9a0, 0, 7, 2); g.add(l); g.userData.light = l; PER.add(g); return g; }
var m1 = mirror(M1, sunDir(EL24).negate(), dN, .5), m2 = mirror(M2, dN, dD, .5), m3 = mirror(M3, dD, dSo, .34), m4 = mirror(M4, dSo, dW, .3), MIRS = [m1, m2, m3, m4];
function setM1(el) { var n = dN.clone().sub(sunDir(el).negate()).normalize(); m1.lookAt(M1.clone().add(n)); }
(function () { var a = V(3, 13.45, -4.5), b = V(3, 4.05, -4.5), L = a.distanceTo(b), g = new T.Group(), th0 = Math.PI * .375, tl = Math.PI * 1.25; g.position.copy(a).lerp(b, .5);
  var geo = new T.CylinderGeometry(.52, .52, L, 36, 1, true, th0, tl), o = new T.Mesh(geo, BRASS); o.castShadow = true; g.add(o); g.add(new T.Mesh(geo, BLACK));
  for (var i = 0; i <= 5; i++) { var fl = new T.Mesh(new T.TorusGeometry(.54, .045, 8, 36, tl), BRASS_D); fl.rotation.x = Math.PI / 2; fl.rotation.z = Math.PI / 2 - th0 - tl; fl.position.y = -L / 2 + .2 + i * (L - .4) / 5; g.add(fl); } PER.add(g); })();
function lens(p, dir, r) { var g = new T.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(V(0, 0, 1), dir.clone().normalize()); var l = new T.Mesh(new T.SphereGeometry(r, 32, 16), GLASS); l.scale.z = .22; l.renderOrder = 5; g.add(l); g.add(new T.Mesh(new T.TorusGeometry(r + .02, .045, 10, 36), BRASS)); PER.add(g); return g; }
var LN1 = V(3, 11.2, -4.5), LN2 = V(3, 8.4, -4.5), LN4 = M4.clone().addScaledVector(dW, 1.2);
var lensA = lens(LN1, dD, .46), lensB = lens(LN2, dD, .44); lens(V(3, 3.4, -3.0), dSo, .32); lens(LN4, dW, .26);
var HOOD = new T.Group(); (function () { HOOD.position.copy(AP); HOOD.quaternion.setFromUnitVectors(V(0, 1, 0), sunDir(EL24));
  var hood = new T.Mesh(new T.CylinderGeometry(.62, .62, .9, 36, 1, true), BRASS); hood.castShadow = true; HOOD.add(hood); HOOD.add(new T.Mesh(hood.geometry, BLACK));
  var ir = new T.Mesh(new T.CylinderGeometry(.6, .6, .05, 36), IRG); ir.position.y = .3; ir.renderOrder = 5; HOOD.add(ir); var fl = new T.Mesh(new T.TorusGeometry(.64, .06, 8, 36), BRASS_D); fl.rotation.x = Math.PI / 2; fl.position.y = .45; HOOD.add(fl); PER.add(HOOD); })();
var WH = new T.Group(); (function () { cyl(.07, .09, 1.75, BRASS_D, 3.75, 13.2, -1.5, PER); box(.5, .08, .5, BRASS_D, 3.75, 12.33, -1.5, PER); box(.8, .07, .07, BRASS_D, 3.38, 14.1, -1.5, PER); box(.05, .5, .05, BRASS, 3.86, 13.75, -1.5, PER);
  WH.position.set(3.9, 13.25, -1.5); WH.rotation.z = Math.PI / 2; WH.add(new T.Mesh(new T.CylinderGeometry(.5, .5, .05, 57), BRASS)); WH.add(new T.Mesh(new T.CylinderGeometry(.3, .3, .07, 40), BRASS_D)); WH.userData.n = [];
  for (var i = 0; i < 19; i++) { var a = i / 19 * Math.PI * 2, n = new T.Mesh(new T.BoxGeometry(.06, .09, .12), new T.MeshStandardMaterial({ color: 0xa87a2c, metalness: 1, roughness: .42, emissive: 0xffb050, emissiveIntensity: 0 })); n.position.set(Math.cos(a) * .53, 0, Math.sin(a) * .53); n.rotation.y = -a; WH.add(n); WH.userData.n.push(n); }
  var kn = new T.Mesh(new T.CylinderGeometry(.05, .05, .16, 12), BRASS_D); kn.position.set(.4, -.1, 0); WH.add(kn); var hold = new T.Group(); hold.add(WH); PER.add(hold); })();
// fixed pointer above the wheel
box(.04, .16, .04, new T.MeshBasicMaterial({ color: new T.Color(3, 2.2, 1.2) }), 3.9, 13.9, -1.5, PER);

// ---------- light: additive shafts (unit cylinders scaled to their segment) + dust that only shows inside the beam ----------
var SUNC = new T.Color(1, .74, .42), SHAFTS = [];
function shaft(r0, r1, k) { var g = new T.Group(), geo = new T.CylinderGeometry(r1, r0, 1, 40, 1, true);
  var m = new T.ShaderMaterial({ transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, uniforms: { c: { value: SUNC.clone() }, k: { value: k }, cut: { value: 1 }, len: { value: 1 }, ph: { value: 0 } },
    vertexShader: 'varying vec3 vN, vV; varying float vY; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); vY=uv.y; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; uniform float k, cut, len, ph; varying vec3 vN, vV; varying float vY; void main(){ if(vY>cut) discard; float f=abs(dot(normalize(vN),normalize(vV))); float y=vY*len; float s=.78+.22*sin(y*3.7-ph)*sin(y*1.13+1.7+ph*.6); float tip=smoothstep(cut,cut-.04/len,vY); gl_FragColor=vec4(c*k*pow(f,1.6)*s*(.35+.65*tip+ (1.-tip)*1.5),1.); }' });
  var o = new T.Mesh(geo, m); o.renderOrder = 8; g.add(o);
  var n = 700, pg = new T.BufferGeometry(), p = new Float32Array(n * 3); for (var i = 0; i < n; i++) { var u = i / n, rr = Math.sqrt(hsh(i * 1.7 + 5)) * (r0 + (r1 - r0) * u) * .95, th = hsh(i * 2.3 + 9) * 6.283; p[i * 3] = Math.cos(th) * rr; p[i * 3 + 1] = u - .5; p[i * 3 + 2] = Math.sin(th) * rr; }
  pg.setAttribute('position', new T.BufferAttribute(p, 3)); var pts = new T.Points(pg, new T.PointsMaterial({ color: SUNC.clone().multiplyScalar(k * 1.6), size: 2.2, sizeAttenuation: false, transparent: true, opacity: .8, blending: T.AdditiveBlending, depthWrite: false })); pts.renderOrder = 9; g.add(pts);
  g.userData = { m: m, pts: pts, n: n, k: k }; S.add(g); SHAFTS.push(g); return g; }
function setSeg(g, a, b, cut, I, t) { var d = b.clone().sub(a), L = d.length(); g.position.copy(a).addScaledVector(d, .5); g.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize()); g.scale.set(1, L, 1);
  var u = g.userData; u.m.uniforms.cut.value = cut; u.m.uniforms.len.value = L; u.m.uniforms.k.value = u.k * I; u.m.uniforms.ph.value = t * 1.3; g.visible = cut > .001 && I > .002;
  var cnt = Math.min(u.n, Math.round(L * 60)); u.pts.geometry.setDrawRange(0, Math.floor(u.n * cut)); u.pts.material.opacity = .8 * I * Math.min(1, cnt / u.n + .35); u.pts.rotation.y = t * .22; }
var shSky = shaft(.62, .6, .5), shA = shaft(.56, .48, 1), shB = shaft(.46, .46, 1), shC = shaft(.44, .42, 1), shD = shaft(.42, .3, 1.2), shE = shaft(.3, .26, 1.4), shF = shaft(.24, .2, 1.6), shG = shaft(.18, .1, 1.9), shH = shaft(.1, .03, 2.2);
var SPOT = new T.Mesh(new T.CircleGeometry(.029, 40), new T.MeshBasicMaterial({ color: new T.Color(9, 2.6, 1.1) })); SPOT.rotation.y = Math.PI / 2; S.add(SPOT);
var HALO = new T.Mesh(new T.PlaneGeometry(.6, .6), new T.MeshBasicMaterial({ map: glowTex('rgba(255,150,90,.9)', 'rgba(255,90,40,.25)'), transparent: true, blending: T.AdditiveBlending, depthWrite: false })); HALO.rotation.y = Math.PI / 2; S.add(HALO);
var spotL = new T.PointLight(0xffb070, 0, 14, 1.8); S.add(spotL);
// heat (infrared) particles that stop at the filter glass
var HEAT = (function () { var n = 60, g = new T.BufferGeometry(), p = new Float32Array(n * 3); g.setAttribute('position', new T.BufferAttribute(p, 3)); var pts = new T.Points(g, new T.PointsMaterial({ color: new T.Color(5, .6, .25), size: 7, sizeAttenuation: false, transparent: true, blending: T.AdditiveBlending, depthWrite: false })); pts.renderOrder = 11; pts.frustumCulled = false; S.add(pts); return pts; })();
// 58 mm ruler beside the spot
var RUL = new T.Group(); (function () { var m = new T.MeshBasicMaterial({ color: new T.Color(1.6, 1.4, 1.1) }); box(.004, .058, .004, m, 0, 0, 0, RUL); box(.004, .004, .03, m, 0, .029, 0, RUL); box(.004, .004, .03, m, 0, -.029, 0, RUL); S.add(RUL); })();
// sun token + ghosts on the sky arc (schematic distance), and a cloud
var SKY = new T.Group(); S.add(SKY); var SUNB = new T.Mesh(new T.SphereGeometry(.45, 32, 16), new T.MeshBasicMaterial({ color: new T.Color(8, 5.5, 2.4) })); SKY.add(SUNB); var GHO = [];
for (var gi = 0; gi < 3; gi++) { var gh = new T.Mesh(new T.TorusGeometry(.45, .025, 8, 48), new T.MeshBasicMaterial({ color: new T.Color(1.6, 1.2, .7), transparent: true })); SKY.add(gh); GHO.push(gh); }
var CLOUD = new T.Group(); (function () { var cm = new T.MeshStandardMaterial({ color: 0xe9e4e0, roughness: 1, envMapIntensity: .3 }); for (var i = 0; i < 16; i++) { var s = new T.Mesh(new T.SphereGeometry(1.2 + hsh(i) * 1.5, 16, 12), cm); s.position.set((hsh(i + 3) - .5) * 9, (hsh(i + 5) - .5) * 1.6, (hsh(i + 7) - .5) * 3); s.scale.y = .7; CLOUD.add(s); } CLOUD.scale.setScalar(.45); S.add(CLOUD); })();

// ---------- people: faceless brick-style figures, animated procedurally (pure functions of t) ----------
function clay(c) { return new T.MeshStandardMaterial({ color: c, roughness: .78, envMapIntensity: .3 }); }
var SKIN = clay(0xc98f62);
function fig(o) { o = o || {}; var g = new T.Group(), cl = clay(o.cloth || 0xe9e2d2), lg = clay(o.legs || 0xd9d2c2), J = {};
  var hips = new T.Group(); hips.position.y = .82; g.add(hips); J.hips = hips;
  [-1, 1].forEach(function (s) { var leg = new T.Group(); leg.position.set(0, 0, s * .1); hips.add(leg); box(.21, .8, .19, lg, 0, -.4, 0, leg); box(.27, .09, .2, clay(0x4a3526), .03, -.755, 0, leg); J['leg' + (s < 0 ? 'L' : 'R')] = leg; });
  box(.24, .14, .42, lg, 0, .05, 0, hips);
  var tor = new T.Group(); tor.position.y = .1; hips.add(tor); J.tor = tor;
  var tb = new T.Mesh(new T.CylinderGeometry(.2, .245, .56, 4, 1), cl); tb.rotation.y = Math.PI / 4; tb.scale.set(.82, 1, 1.2); tb.position.y = .3; tor.add(tb);
  cyl(.07, .07, .08, SKIN, 0, .62, 0, tor, 12); var head = new T.Group(); head.position.y = .66; tor.add(head); J.head = head;
  cyl(.135, .135, .22, SKIN, 0, .12, 0, head, 20); cyl(.07, .07, .05, SKIN, 0, .255, 0, head, 12);
  if (!o.hat) { var h = new T.Mesh(new T.SphereGeometry(.142, 20, 10, 0, 6.283, 0, 1.75), clay(0x1c1410)); h.position.set(-.012, .15, 0); h.scale.y = .95; head.add(h); }
  else { var hh = new T.Mesh(new T.SphereGeometry(.155, 20, 10, 0, 6.283, 0, 1.57), clay(o.hat)); hh.position.y = .17; head.add(hh); cyl(.19, .19, .02, clay(o.hat), .03, .175, 0, head, 20); }
  [-1, 1].forEach(function (s) { var sh = new T.Group(); sh.position.set(0, .52, s * .27); tor.add(sh); cyl(.062, .058, .3, cl, 0, -.15, 0, sh, 12); var elb = new T.Group(); elb.position.y = -.3; sh.add(elb); cyl(.055, .05, .27, cl, 0, -.135, 0, elb, 12);
    var hand = new T.Mesh(new T.SphereGeometry(.062, 12, 8), SKIN); hand.position.y = -.3; hand.scale.set(1, 1.1, .7); elb.add(hand); J['sh' + (s < 0 ? 'L' : 'R')] = sh; J['el' + (s < 0 ? 'L' : 'R')] = elb; });
  if (o.scarf) { var sc = new T.Mesh(new T.TorusGeometry(.115, .045, 8, 20), clay(o.scarf)); sc.rotation.x = Math.PI / 2; sc.position.y = .6; tor.add(sc); box(.035, .5, .1, clay(o.scarf), .16, .36, .09, tor); box(.035, .42, .1, clay(o.scarf), .16, .4, -.09, tor); }
  g.J = J; g.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); S.add(g); return g; }
// pose: nam (0..1 folded hands), up (0..1 look up), walk phase, sway seed
function pose(g, o) { var J = g.J, nam = o.nam || 0, up = o.up || 0, w = o.walk, sw = Math.sin((o.t || 0) * .9 + (o.seed || 0) * 9) * .025;
  ['L', 'R'].forEach(function (k, i) { var s = i ? 1 : -1; J['sh' + k].rotation.set(s * .42 * nam, 0, .08 + .47 * nam + (w != null ? -s * Math.sin(w) * .5 : 0)); J['el' + k].rotation.set(s * .62 * nam, 0, 1.75 * nam + (w != null ? .25 : 0)); J['leg' + k].rotation.z = w != null ? s * Math.sin(w) * .45 : 0; });
  J.head.rotation.z = -.1 * nam + .38 * up; J.tor.rotation.z = sw - .04 * up; J.head.rotation.y = (o.hy || 0); J.hips.position.y = .82 + (w != null ? Math.abs(Math.cos(w)) * .03 : 0); }
var COLS = [0xe9e2d2, 0xd8b98a, 0xb9c4c9, 0xd9a7a0, 0xc9d2a8, 0xe3c46b, 0xa9b6d9];
var dev = fig({ cloth: 0xefe6d4, legs: 0xe6dcc8, scarf: 0xf08a24 }); dev.position.set(-5.7, .28, -.35); dev.rotation.y = Math.PI + .2;
var CROWD = []; function crowd(n, x0, x1, z0, z1, seed, near) { for (var i = 0; i < n; i++) { var g = fig({ cloth: COLS[Math.floor(hsh(i + seed) * COLS.length)], legs: hsh(i + seed + 4) > .5 ? 0xd9d2c2 : 0x6c5a4c, scarf: hsh(i + seed + 7) > .8 ? 0xe8842a : null });
    g.position.set(x0 + (x1 - x0) * hsh(i * 2.1 + seed + 1), .28, z0 + (z1 - z0) * hsh(i * 3.7 + seed + 2)); g.rotation.y = Math.PI + (hsh(i + seed + 3) - .5) * .3; g.userData = { seed: i + seed, nam: hsh(i + seed + 9) > .45 ? 1 : 0, near: near }; CROWD.push(g); } }
crowd(6, -5.2, -2.6, -3.3, -2.0, 40, 1); crowd(34, -.2, 14, -3.1, -.55, 11, 0);
CROWD.forEach(function (g, i) { var u = g.userData; u.z = g.position.z; u.sp = .42 + .3 * hsh(i * 5.3 + 1); u.ph = hsh(i * 7.7 + 2) * 15; u.kid = hsh(i * 9.1 + 4) > .8; u.jai = hsh(i * 4.3 + 6) > .55; if (u.kid) g.scale.setScalar(.68); });
var priest = fig({ cloth: 0xf08a24, legs: 0xf6ead2 }); priest.position.set(-6.5, .28, -2.75); priest.rotation.y = Math.PI - .5; (function () { var pl = new T.Group(); pl.position.y = -.34; priest.J.elR.add(pl); cyl(.13, .13, .02, BRASS, 0, 0, 0, pl, 16); var f = new T.Mesh(new T.SphereGeometry(.035, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(6, 2.6, .7) })); f.position.y = .06; f.scale.y = 1.8; pl.add(f); var l = new T.PointLight(0xff9a4a, 1.2, 4, 2); l.position.y = .1; pl.add(l); })();
var e1 = fig({ cloth: 0x2f6f8f, legs: 0x39424e, hat: 0xf2c230 }), e2 = fig({ cloth: 0xd8632a, legs: 0x39424e, hat: 0xf4f1e8 }), tech = fig({ cloth: 0x2f6f8f, legs: 0x39424e, hat: 0xf2c230 }), astro = fig({ cloth: 0xefe6d4, legs: 0x4a5560, hat: 0xf4f1e8 });
e1.position.set(4.75, 12.28, -1.9); e1.rotation.y = Math.PI + .25; e2.position.set(1.3, 12.28, -3.6); e2.rotation.y = -.2;
var card = box(.02, .3, .4, new T.MeshStandardMaterial({ color: 0xf4ecd8, roughness: .8 }), 0, 0, 0);

// ---------- calendar set (cut-away, far from the temple): Ram Navami dates over one 19-year cycle ----------
var OC = V(300, 0, 0), CAL = new T.Group(); CAL.position.copy(OC); S.add(CAL);
box(16, .3, 10, new T.MeshStandardMaterial({ color: 0x2a1518, roughness: .95, envMapIntensity: .2 }), 0, -.15, 0, CAL);
var MOONC = new T.Color(.62, .77, 1);
// approximate dates: Chaitra new moon + 8.6 days (our calculation; matches 17 Apr 2024, 6 Apr 2025, 27 Mar 2026)
var YRS = (function () { var out = [], nm = Date.UTC(2024, 3, 8, 18, 21) / 864e5, LUN = 29.530589; for (var y = 2024; y <= 2043; y++) { if (y > 2024) { var c = nm + 12 * LUN, d = new Date(c * 864e5), doy0 = (c - Date.UTC(y, 0, 1) / 864e5); if (doy0 < 71.5) c += LUN; nm = c; }
    var nv = nm + 8.6, doy = nv - Date.UTC(y, 0, 1) / 864e5 + 1, dt = new Date(nv * 864e5); out.push({ y: y, doy: doy, d: dt.getUTCDate(), m: dt.getUTCMonth(), el: elev(doy) }); } return out; })();
var CX = function (doy) { return (doy - 97) * .29; }, CY0 = 2.95, CDY = .28;       // x by date (25 Mar - 21 Apr), y by year
(function () { var rail = box(9.4, .06, .06, BRASS, 0, CY0 - .35, 0, CAL); [[84, '25 MAR'], [91, '1 APR'], [101, '11 APR'], [111, '21 APR']].forEach(function (q) { box(.03, 19 * CDY + .9, .02, new T.MeshBasicMaterial({ color: 0x5a3c34 }), CX(q[0]), CY0 + 19 * CDY / 2 - .1, -.05, CAL); var tp = textPlane(q[1], .26, '#c9a777'); tp.position.set(CX(q[0]), CY0 - .72, 0); CAL.add(tp); }); })();
var DOTS = YRS.map(function (q, i) { var real = i < 3, last = i === 19, m = new T.Mesh(new T.SphereGeometry(.13, 20, 12), new T.MeshBasicMaterial({ color: last ? new T.Color(5, 3.6, 1.6) : real ? new T.Color(3.2, 2.5, 1.3) : new T.Color(.62 * 1.6, .77 * 1.6, 1.6) })); m.position.set(CX(q.doy), CY0 + Math.min(i, 19) * CDY, 0); CAL.add(m);
  var lab = textPlane(String(q.y), .27, '#f6ecd9'); lab.position.set(-5.2, CY0 + i * CDY, 0); CAL.add(lab); lab.userData.keep = real || i >= 18; m.userData.lab = lab; return m; });
var LINK = box(.03, 19 * CDY, .03, new T.MeshBasicMaterial({ color: new T.Color(3, 2.2, 1) }), CX(YRS[0].doy), CY0 + 19 * CDY / 2, 0, CAL);
var MOON = new T.Group(); (function () { var d = new T.Mesh(new T.SphereGeometry(.75, 32, 16), new T.MeshStandardMaterial({ color: 0xdfe6f2, roughness: .9, envMapIntensity: .1, emissive: 0x20283a })); MOON.add(d); MOON.position.set(0, CY0 + 19 * CDY + 1.0, 0); CAL.add(MOON); })();
var moonL = new T.DirectionalLight(0xcfe0ff, 0); CAL.add(moonL); CAL.add(moonL.target); moonL.target.position.copy(MOON.position);
// sun-height gauge + gnomon (pole and shadow) with a farmer
var GAU = new T.Group(); GAU.position.set(2.5, .15, 1.2); CAL.add(GAU); (function () { var arc = new T.Mesh(new T.TorusGeometry(1.9, .03, 8, 60, Math.PI / 2), BRASS); GAU.add(arc); box(2.1, .03, .03, BRASS_D, 1.05, 0, 0, GAU); box(.03, 2.1, .03, BRASS_D, 0, 1.05, 0, GAU); })();
var NEEDLE = new T.Group(); GAU.add(NEEDLE); box(1.9, .05, .05, new T.MeshBasicMaterial({ color: new T.Color(4, 2.8, 1.2) }), .95, 0, 0, NEEDLE); var NSUN = new T.Mesh(new T.SphereGeometry(.16, 20, 12), new T.MeshBasicMaterial({ color: new T.Color(8, 5.5, 2.4) })); NSUN.position.x = 1.9; NEEDLE.add(NSUN);
var POLE = cyl(.05, .05, 1.6, clay(0x8a6a4a), -3.3, .8, 1.6, CAL, 12), SHAD = box(1, .02, .16, new T.MeshBasicMaterial({ color: 0x0a0405 }), 0, .012, 1.6, CAL);
var farmer = fig({ cloth: 0xf0ead8, legs: 0xe8e0cc, scarf: 0xc0392b }); farmer.position.copy(OC).add(V(-4.3, 0, 2.1)); farmer.rotation.y = -.5;
var calKey = new T.DirectionalLight(0xffe6c8, 0); calKey.position.copy(OC).add(V(-6, 14, 12)); calKey.target.position.copy(OC).add(V(0, 4, 0)); S.add(calKey); S.add(calKey.target);

// ---------- lights ----------
var sun = new T.DirectionalLight(0xffe2b8, 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); S.add(sun); S.add(sun.target); sun.target.position.set(3, 16, -2);
var sc0 = sun.shadow.camera; sc0.left = -22; sc0.right = 22; sc0.top = 34; sc0.bottom = -24; sc0.near = 5; sc0.far = 130; sun.shadow.bias = -.0005; sun.shadow.normalBias = .04;
var hemi = new T.HemisphereLight(0x6a4a44, 0x140808, .5); S.add(hemi);
var fill = new T.DirectionalLight(0xe9d8c8, 0); fill.position.set(-10, 8, 20); S.add(fill);
var back = new T.DirectionalLight(0xb9a6a0, 0); back.position.set(10, 6, 6); S.add(back);
var kf = new T.DirectionalLight(0xffe6c4, 0); kf.position.set(14, 16, 4); kf.target.position.set(3.5, 13.5, -1.5); S.add(kf); S.add(kf.target);

// ---------- story clock (all from the voice) ----------
var t_beam0 = -2.6, t_spot = CW('s2', .86), t_nb = ST('s3');
var tB = ST('s4'), tB2 = ST('s5'), tC = ST('s7'), tC2 = ST('s8'), tD = ST('s9'), tD2 = ST('s10'), tD3 = ST('s12'), tD4 = CW('s12', .55);
var tE = ST('s13'), tE2 = ST('s15'), tE3 = ST('s16'), tE4 = CW('s16', .5), tE5 = ST('s17');
var tF = ST('s18'), tF2 = ST('s19'), tF3 = ST('s20'), tMiss = CW('s20', .62), tWhy = ST('s21');
var tG = ST('s22'), tG2 = ST('s23'), tG3 = ST('s24'), tG4 = ST('s25'), tH = ST('s26'), tH2 = ST('s27'), tH3 = ST('s28'), tH4 = ST('s29'), tClick = CW('s29', .86);
var tI = ST('s30'), tI2 = ST('s31'), tI3 = ST('s32'), tI4 = ST('s33'), tJ = ST('s34'), tJ2 = ST('s35'), tJ3 = ST('s36'), tCTA = ST('s37');
var tCal0 = tG - .25, tCal1 = tH3 - .3;         // light-change cuts into and out of the calendar set
var tBack = SE('s29') + .15;                    // after the click: ride down to see the tilak return

// ---------- camera: authored shots, locked between moves ----------
function P(tg, dir, dist) { var d = V(dir[0], dir[1], dir[2]).normalize(); return { p: V(tg[0], tg[1], tg[2]).addScaledVector(d, dist), l: V(tg[0], tg[1], tg[2]) }; }
var PO = {
  hook: { p: V(3.6, 2.0, 2.2), l: V(-8.2, 1.25, -1.75) }, hook2: { p: V(1.9, 1.95, 1.7), l: V(-8.2, 1.35, -1.72) },
  dust: { p: V(-1.3, 3.05, .5), l: V(-4.4, 2.3, -1.5) },
  wide: P([2.7, 6.9, -3], [.3, .15, 1], 90), wideUp: P([2.9, 10.5, -3], [.3, .12, 1], 74),
  top: P([3.1, 14.6, -2.6], [.34, .12, 1], 27), pipe1: P([3, 12.2, -4.2], [.3, .1, 1], 24), pipe2: P([3, 5.4, -4.2], [.3, .1, 1], 24),
  lens: P([3, 9.8, -4.5], [.25, .06, 1], 13), ap: P([3, 18.7, -.5], [.5, .42, 1], 9.5),
  m4: P([1.4, 3.1, -2.2], [.25, .12, 1], 22), spot: P([-7.9, 1.72, -1.5], [1, .3, -.3], 4.2),
  sanct: P([-3.4, 2.0, -2], [.28, .12, 1], 38),
  cal: P([300, 3.0, 0], [0, .16, 1], 50), cal2: P([300, 2.7, 0], [0, .15, 1], 48),
  wheel: P([3.3, 13.3, -1.6], [1, .32, .62], 12.5), wheel2: P([3.35, 13.35, -1.6], [1, .3, .62], 10.4),
  sky: P([3, 25, -1], [.22, -.2, 1], 56), final: P([2.2, 9, -3], [.3, .15, 1], 150)
};
var MOVES = [   // [t0, t1, from, to]  named moves; the camera is locked between them
  [CW('s2', .2), t_nb + 1.2, 'hook', 'hook2'],                 // push in as the tilak lands
  [tB - .2, tB + 2.4, 'hook2', 'dust'],                        // truck to the beam: dust in the light
  [tB2 - .2, tB2 + 3.6, 'dust', 'wide'],                       // crane up and out to the cut-away
  [tC2 - .1, tC2 + 1.8, 'wide', 'wideUp'],                     // pedestal up to the roof and the Sun
  [tD2 - .4, tD2 + 2.0, 'wideUp', 'top'],                      // dolly in to mirror 1
  [tD4 - .3, tD4 + 2.6, 'top', 'pipe1'], [tD4 + 2.6, tE - .1, 'pipe1', 'pipe1'],
  [tE - .1, tE + 1.6, 'pipe1', 'lens'],                        // push to the lenses
  [tE2 - .3, tE2 + 1.6, 'lens', 'ap'],                         // pedestal up to the filter glass
  [tE3 - .3, tE3 + 2.8, 'ap', 'm4'],                           // ride down the pipe
  [tE4 - .2, tE4 + 2.4, 'm4', 'spot'],                         // follow the last leg to the tilak
  [tF - .3, tF + 2.2, 'spot', 'sanct'],                        // pull back
  [tH4 + 2.6, tH4 + 4.4, 'wheel', 'wheel2'],                   // push in on the hand at the wheel
  [tBack, tBack + 2.2, 'wheel2', 'sanct'],                     // crane down: the tilak is back
  [tI2 - .2, tI2 + 2.2, 'sanct', 'sky'],                       // tilt up to the sky
  [tJ - .2, tJ + 2.2, 'sky', 'wide'], [tJ2 + .4, tCTA + 1.5, 'wide', 'final']
];
function camAt(t) { var cur = PO.hook, a = null, u = 0;
  if (t >= tCal0 && t < tCal1) { var uu = ramp(t, tG4 - .2, tG4 + 1.8); a = PO.cal; var b2 = PO.cal2; cam.position.copy(a.p).lerp(b2.p, eio(uu)); cam.lookAt(a.l.clone().lerp(b2.l, eio(uu))); return; }
  if (t >= tCal1 && t < tH4 + 2.6) { cam.position.copy(PO.wheel.p); cam.lookAt(PO.wheel.l); return; }
  for (var i = 0; i < MOVES.length; i++) { var m = MOVES[i]; if (t >= m[0]) { if (t < m[1]) { a = PO[m[2]]; cur = PO[m[3]]; u = eio((t - m[0]) / (m[1] - m[0])); } else { cur = PO[m[3]]; a = null; } } }
  if (a) { cam.position.copy(a.p).lerp(cur.p, u); cam.lookAt(a.l.clone().lerp(cur.l, u)); } else { cam.position.copy(cur.p); cam.lookAt(cur.l); } }

// ---------- DOM overlays ----------
function el(cls, html) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; d.style.display = 'none'; ov.appendChild(d); return d; }
var HEADS = [
  [0, tB - .1, 'AYODHYA · RAM NAVAMI · DOPAHAR 12 BAJE', 'Yeh tilak <b>sooraj</b><br>ne lagaya hai.'],
  [tB + .35, tB2 - .25, 'AAPNE DEKHA HOGA', 'Chhat ke chhed se<br><b>dhoop ki lakeer</b>.'],
  [tB2 - .05, tC - .15, 'ASLI MANDIR · AYODHYA', 'Wahi dhoop. Bas <b>teen<br>manzil</b> neeche laani thi.'],
  [tC + .1, tD - .1, 'MUSHKIL', 'Garbhagriha <b>teen<br>manzil</b> neeche hai.'],
  [tD + .1, tE - .2, 'JAWAAB', 'Chhat se neeche tak,<br>ek <b>periscope</b>.'],
  [tE + .2, tF - .2, 'PIPE KE ANDAR', 'Lens roshni ko<br><b>sikodte</b> hain.'],
  [tF + 1.8, tCal0, 'ASLI PARESHANI', 'Agle saal, tilak<br><b>hat gaya</b>.'],
  [tG + .3, tH - .1, 'CHAAND KA CALENDAR', 'Taareekh badli,<br><b>sooraj</b> bhi badla.'],
  [tH + .1, tCal1 - .1, '19 SAAL', 'Unnees saal baad,<br>wahi <b>taareekh</b>.'],
  [tH3 + .2, tBack - .1, 'SAAL MEIN EK BAAR', 'Ek aaina.<br><b>19</b> settings.<br>Haath se.'],
  [tI + .2, tJ - .2, 'SIRF KUCH MINUTE', 'Dharti <b>ghoom</b> rahi hai.'],
  [tJ + 1.4, tCTA - .2, 'BAS ITNA', 'Aaine. Peetal.<br>Ganit. <b>Khula aasmaan</b>.']
].map(function (h) { return { t0: h[0], t1: h[1], k: el('kick', '<i></i>' + h[2]), h: el('head', h[3]) }; });
var HUD = el('hud', ''), SRC = el('src', '');
var SRCS = [[tB + .35, tB2 - .25, 'the same sunlight you see at home'], [tC + .1, tD - .1, 'schematic model · not the temple\'s drawings'], [tD + .1, tE5 - .1, '4 mirrors + 4 lenses: reported · layout schematic'],
  [tF + 1.8, tCal0, 'sun heights: our calculation · miss shown schematically'], [tG + .3, tH - .1, 'dates approx: our calculation · sun data by IIA (reported)'], [tH + .1, tCal1 - .1, '235 moons ≈ 19 years, 2 h apart: our calculation'],
  [tH3 + .2, tBack - .1, 'yearly hand shift: reported (PIB) · wheel form illustrative'], [tI + .2, tJ - .2, 'speeded up 30× · our calculation'], [tJ + 1.4, tCTA - .2, 'no electricity: reported · figures illustrative']];
var TAGS = [];   // [t0, t1, world anchor fn, html, x, y, cls]
function tag(t0, t1, anchor, html, x, y, cls) { var d = el('tag ' + (cls || ''), html); d.style.left = x + 'px'; d.style.top = y + 'px'; TAGS.push({ t0: t0, t1: t1, a: anchor, d: d, x: x, y: y, cls: cls }); }
function A(v) { return function () { return v; }; }

tag(tC + 1.2, tD - .2, A(V(-4, 9, 0)), '<small>3 floors of stone</small>20 ft each', 600, 700);
tag(tC2 + 1.8, tD2 - .5, A(AP.clone().addScaledVector(sunDir(EL24), 5)), '<small>noon sun · 17 Apr 2024</small>73.8° above the horizon', 520, 560);
tag(tD2 + 2.0, tD4 - .4, A(M1), '<small>mirror 1</small>catches the sunbeam', 170, 880);
tag(tD2 + 2.4, tD4 - .4, A(V(4.75, 13.5, -1.9)), '<small>engineers</small>clean and align by hand', 560, 1010);
tag(tD4 + 2.4, tE - .3, A(V(3, 10, -4.5)), '<small>brass pipe</small>black inside, no stray light', 500, 620);
tag(tE + 1.6, tE2 - .4, A(LN1), '<small>lens</small>gathers the light', 560, 560);
tag(tE2 + 1.6, tE3 - .4, A(AP), '<small>filter glass</small>stops the heat', 170, 620, 'v');

tag(tF2 + .3, tF3 - .1, A(NICHE), '<small>2024</small>on the mark', 330, 700);
tag(tMiss + .6, tCal0 - .2, function () { return SPOTP; }, '<small>2025 · same mirror</small>light misses', 340, 600, 'v');
tag(tH4 + .6, tBack - .3, A(V(3.93, 13.7, -1.9)), '<small>setting wheel</small>19 notches, one per year', 520, 720);
tag(tH4 + 1.0, tBack - .3, A(M1), '<small>mirror 1</small>tilts about 2° this year', 170, 560);
tag(tBack + 2.3, tI2 - .4, function () { return SPOTP; }, '<small>after one click</small>back on the mark', 330, 690, 'v');
tag(tI2 + 2.4, tI3 - .2, function () { return SUNP; }, '<small>in 2 minutes</small>the Sun moves its own width', 380, 760);
tag(tI4 - .1, tJ - .3, function () { return CLOUD.position; }, '<small>cloud</small>no sunlight, no tilak', 420, 800, 'm');
// ---------- v2: real-photo plates (DOM): blurred fill + sharp card. The 3D world is not drawn while a plate is opaque ----------
var stage = document.getElementById('stage'), FX = 759, FY = 329;      // forehead of the idol in the photo (px)
function plate(src, cx, cy, cw, ch, iw, ih) { var d = document.createElement('div'); d.className = 'plate'; d.setAttribute('data-ov', '1');
  d.innerHTML = '<img class="bg" src="img/' + src + '"><div class="card" style="left:' + cx + 'px;top:' + cy + 'px;width:' + cw + 'px;height:' + ch + 'px"><div class="in" style="width:' + iw + 'px;height:' + ih + 'px"><img src="img/' + src + '" width="' + iw + '" height="' + ih + '"><div class="glowv"></div><div class="beam"></div><div class="spot"></div></div></div><div class="flash"></div><div class="pcred" style="top:' + (cy + ch + 14) + 'px"></div>';
  stage.insertBefore(d, svg); return { d: d, inn: d.querySelector('.in'), beam: d.querySelector('.beam'), spot: d.querySelector('.spot'), gl: d.querySelector('.glowv'), flash: d.querySelector('.flash'), cred: d.querySelector('.pcred'), bg: d.querySelector('.bg'), img: d.querySelector('.in img'), cx: cx, cy: cy, cw: cw, ch: ch, iw: iw }; }
var PL1 = plate('idol-sanctum.jpg', 162, 452, 756, 800, 960, 1038), PL2 = plate('temple-flowers.png', 162, 610, 756, 443, 960, 563);
PL1.gl.style.setProperty('--gx', (FX / 960 * 100) + '%'); PL1.gl.style.setProperty('--gy', (FY / 1038 * 100) + '%'); PL2.beam.style.display = PL2.spot.style.display = PL2.gl.style.display = 'none';
PL2.cred.textContent = 'real photo · Ram Mandir, Ayodhya · CC BY 3.0 (Wikimedia Commons)';
var ARR = document.createElement('div'); ARR.setAttribute('data-ov', '1'); ARR.style.cssText = 'position:absolute;left:500px;top:150px;width:8px;background:repeating-linear-gradient(180deg,#ffc56b 0 16px,transparent 16px 28px);box-shadow:0 0 14px #ffb347'; PL2.d.appendChild(ARR);
function idolView(s, px, py, beam, sp, t) { var k = PL1.cw / 960 * s; PL1.inn.style.transform = 'translate(' + (px - FX * k).toFixed(2) + 'px,' + (py - FY * k).toFixed(2) + 'px) scale(' + k.toFixed(4) + ')';
  var Lb = 560; PL1.beam.style.left = (FX - Lb) + 'px'; PL1.beam.style.top = (FY - 32) + 'px'; PL1.beam.style.width = Lb + 'px'; PL1.beam.style.transform = 'rotate(9deg)'; PL1.beam.style.opacity = beam;
  var z = 46 * sp; PL1.spot.style.left = (FX - z / 2) + 'px'; PL1.spot.style.top = (FY - z / 2) + 'px'; PL1.spot.style.width = PL1.spot.style.height = z + 'px'; PL1.gl.style.opacity = .55 + .45 * beam; }
var tSun = CW('s1', .68), tNa = CW('s3', 0), tTaar = CW('s3', .55);
var ST_ = [ [CW('s2', .62), tB - .25, el('tag v', '<small>the tilak</small>58 mm of real sunlight'), 200, 1120], [tNa, tB - .25, el('xchip', 'NA <s>BULB</s>'), 200, 1010], [tTaar, tB - .25, el('xchip', 'NA <s>TAAR</s>'), 470, 1010],
  [tB2 + 1.6, tC - .2, el('pill', '3 manzil neeche'), 0, 0], [tE5 + .15, tF - .35, el('tag v', '<small>the tilak</small>sirf 58 mm'), 200, 1120] ];
ST_.forEach(function (q) { q[2].style.left = q[3] + 'px'; q[2].style.top = q[4] + 'px'; });
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
var END = el('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="bS">SHARE</span><span id="bF">FOLLOW</span></div>');
var SPOTP = NICHE.clone(), SUNP = V(0, 0, 0);

// ---------- sound events for the mix ----------
window.EV = [[0, 'hit'], [tSun, 'glint'], [tNa, 'thud'], [tTaar, 'thud'], [tB - .05, 'whoosh'], [tB2 - .1, 'shutter'], [tC - .05, 'whoosh'], [tE5 - .1, 'shutter'], [tB2, 'rise'], [tC2 + .4, 'tick'], [tD, 'pop'], [tD2 + 2.0, 'glint'], [tD4 + .4, 'whoosh'], [tE + 1.6, 'glint'], [tE2 + 1.4, 'thud'], [tE3, 'whoosh'], [tE5, 'bell'], [tF3, 'tick'], [tMiss, 'slide'], [tWhy, 'hole'],
  [tCal0, 'relay'], [tG2, 'tick'], [tG4, 'tick'], [tH2, 'chime'], [tCal1, 'relay'], [tClick, 'click'], [tClick + .5, 'bell'], [tBack, 'whoosh'], [tI2, 'rise'], [tI3 + .2, 'hole'], [tJ, 'bell'], [tCTA, 'chime']].map(function (e) { return { t: +e[0].toFixed(3), k: e[1] }; });
window.SCN_T0 = function () { return [0, tB, tC, tD, tE, tF, tG, tH, tH3, tI, tJ, tCTA]; };

// ---------- frame ----------
var MON = ['JAN', 'FEB', 'MAR', 'APR'];
window.__seek = function (t) {
  t = Math.max(0, Math.min(DUR, t)); var inCal = t >= tCal0 && t < tCal1;
  camAt(t); cam.updateMatrixWorld();
  // --- Sun, mirror setting, error
  var uY = eio(ramp(t, tF3 + .2, tF3 + 1.6)), elNow = lerp(EL24, EL25, uY), uSet = eio(ramp(t, tClick, tClick + .7)), elSet = lerp(EL24, EL25, uSet), err = elNow - elSet;       // degrees (negative = Sun lower than the setting)
  var drift = t > tI ? (t - tI) * 30 / 60 * .25 : 0;                                                                              // degrees the Sun has moved since scene I began (30x)
  var sd = sunDir(elNow), cl = eio(ramp(t, tI3 - .1, tI3 + 1.0)) * (1 - eio(ramp(t, tJ - .3, tJ + .9)));                         // cloud cover 0..1
  var I = 1 - cl; setM1(elSet); HOOD.quaternion.setFromUnitVectors(V(0, 1, 0), sunDir(elSet));
  WH.rotation.x = -uSet * (Math.PI * 2 / 19); WH.userData.n.forEach(function (n, i) { n.material.emissiveIntensity = (i === (uSet > .5 ? 18 : 0)) ? 3 : 0; });
  sun.position.copy(sun.target.position).addScaledVector(sd, 60);
  // --- beam growth: hook shows only the last leg; the whole path builds in scene D
  var hookPhase = t < tC, built = t >= tD;
  var gHook = ramp(t, t_beam0, t_spot), g1 = ramp(t, tD + .5, tD + 1.3), g2 = ramp(t, tD2 + 1.8, tD2 + 2.5), g3 = ramp(t, tD4, tD4 + 1.6), g4 = ramp(t, tD4 + 1.6, tD4 + 2.6), gE = ramp(t, tE3 + .6, tE3 + 2.4), gF = ramp(t, tE4 - .4, tE4 + .5), gG = ramp(t, tE4 + .5, tE4 + 1.9);
  var offY = -err * .3, offZ = Math.min(.9, drift * .9);                 // schematic: where the last leg lands when the setting is wrong / as the Sun drifts
  SPOTP.copy(NICHE).add(V(0, offY, offZ)); var onMark = Math.abs(err) < .3 && offZ < .5;
  var skyP = AP.clone().addScaledVector(sd, 34), kSky = (t >= tC2 + .2 ? eo(ramp(t, tC2 + .2, tC2 + 1.4)) : 0);
  setSeg(shSky, skyP, AP, kSky, I * (inCal ? 0 : 1), t);
  setSeg(shA, AP, M1, built ? g1 : 0, I, t); setSeg(shB, M1, M2.clone().add(V(0, 0, 0)), built ? g2 : 0, I, t);
  setSeg(shC, M2, LN1, built ? g3 : 0, I, t); setSeg(shD, LN1, LN2, built ? ramp(g3, .25, .6) : 0, I, t); setSeg(shE, LN2, M3, built ? g4 : 0, I, t);
  var last = hookPhase ? gHook : gG;
  setSeg(shF, M3, M4, hookPhase ? 0 : gE, I, t); setSeg(shG, M4, LN4, hookPhase ? ramp(gHook, 0, .12) : gF, I, t); setSeg(shH, LN4, SPOTP, hookPhase ? ramp(gHook, .12, 1) : gG, I, t);
  var lit = (last >= 1 ? 1 : 0) * I; SPOT.visible = HALO.visible = lit > .02; SPOT.position.copy(SPOTP).add(V(.03, 0, 0)); HALO.position.copy(SPOTP).add(V(.05, 0, 0)); HALO.material.opacity = lit * (.75 + .25 * Math.sin(t * 2.1));
  spotL.position.copy(SPOTP).add(V(1.2, .3, 0));
  [[m1, built ? g1 : 0], [m2, built ? g2 : 0], [m3, built ? g4 : 0], [m4, hookPhase ? gHook : gF]].forEach(function (q, i) { var on = (q[1] >= 1 ? 1 : 0) * I; q[0].userData.glow.material.opacity = on; q[0].userData.light.intensity = on * (i < 2 ? 14 : 8) * (hookPhase ? .0 : 1); });
  PER.visible = true;
  // heat particles: fall along the Sun ray and stop at the filter glass
  var hp = HEAT.geometry.attributes.position, hOn = (t > tE2 + .6 && t < tE3 + .4) ? 1 : 0; HEAT.visible = !!hOn;
  if (hOn) { var side = V(1, 0, 0), up2 = sd.clone().cross(side).normalize(); for (var i = 0; i < 60; i++) { var ph = (t * .55 + hsh(i)) % 1, r = Math.sqrt(hsh(i + 20)) * .5, th = hsh(i + 40) * 6.283, base = AP.clone().addScaledVector(sd, .35 + (1 - ph) * 3.2);
      if (ph > .9) base.copy(AP).addScaledVector(sd, .35).addScaledVector(side, Math.cos(th) * (ph - .9) * 9).addScaledVector(up2, Math.sin(th) * (ph - .9) * 9); base.addScaledVector(side, Math.cos(th) * r).addScaledVector(up2, Math.sin(th) * r); hp.setXYZ(i, base.x, base.y, base.z); } hp.needsUpdate = true; }
  RUL.visible = t > tE5 - .1 && t < tF + .3; RUL.position.copy(NICHE).add(V(.04, 0, .075)); RUL.scale.setScalar(eob(ramp(t, tE5 - .1, tE5 + .4)));
  // sky arc + cloud (scene I)
  var skOn = t > tI2 + .6 && t < tJ + 1.4; SKY.visible = skOn; var arcD = 9.5;
  SUNP.copy(AP).addScaledVector(sunDir(elNow).applyAxisAngle(V(0, 1, 0), -(drift - 2) * Math.PI / 180 * 7.9), arcD); SUNB.position.copy(SUNP);
  GHO.forEach(function (g, i) { var dd = (i + 1) * .5; g.position.copy(AP).addScaledVector(sunDir(elNow).applyAxisAngle(V(0, 1, 0), -(drift - 2 - dd) * Math.PI / 180 * 7.9), arcD); g.lookAt(cam.position); g.material.opacity = .5 - i * .12; }); SUNB.scale.setScalar(1 - cl * .6);
  CLOUD.visible = cl > .01 || (t > tI3 - 1.2 && t < tJ + 1.5); CLOUD.position.copy(SUNP).add(V(lerp(-9, 0, eio(ramp(t, tI3 - 1.0, tI3 + .9))) + lerp(0, 10, eio(ramp(t, tJ - .4, tJ + 1.6))), .1, .9));
  // --- lights per place
  var uOut = eio(ramp(t, tB2, tB2 + 3.4)), dim = 1 - .55 * cl, inTop = (t >= tCal1 && t < tBack + 1.0) ? 1 : 0;
  S.environmentIntensity = inCal ? .35 : lerp(.08, .5, uOut); hemi.intensity = inCal ? .3 : lerp(.1, .55, uOut) * dim; sun.intensity = inCal ? 0 : lerp(0, 4.0, uOut) * (1 - cl * .85) * (inTop ? .65 : 1);
  fill.intensity = inCal ? 0 : lerp(0, .5, uOut); back.intensity = inCal ? 0 : lerp(.5, .15, uOut); kf.intensity = inTop * 1.5; calKey.intensity = inCal ? 2.2 : 0;
  mGrade.uniforms.exp.value = (inCal ? 1.05 : inTop ? .95 : lerp(1.0, 1.05, uOut)) * lerp(1, .32, eio(ramp(t, tCTA - .3, tCTA + .8))); mGrade.uniforms.bloom.value = inCal ? .6 : inTop ? .62 : lerp(1.1, .7, uOut);
  spotL.intensity = lit * lerp(2.6, 9, uOut); lamp.intensity = lerp(.9, 2.5, uOut); flame.scale.set(1, 1.8 + .25 * Math.sin(t * 9) * Math.sin(t * 5.3), 1); HALL.forEach(function (l, k) { l.intensity = inCal ? 0 : lerp(0, 9, uOut) * (.92 + .08 * Math.sin(t * 7 + k * 2)); });
  AURA.material.opacity = lerp(.2, .32, uOut) * (1 - .7 * ramp(t, tE4, tE4 + 2) * (1 - ramp(t, tF, tF + 1.5)));
  var fd = function (c) { return 1 - clamp(Math.abs(t - c) / .28); }; mGrade.uniforms.fade.value = Math.max(fd(tCal0), fd(tCal1)) * .96;
  // --- people
  var nam = eo(ramp(t, t_spot, t_spot + .9)), look = cl; var eOnPre = t >= tD - .2 && !(t >= tCal1 - .3);
  pose(dev, { t: t, nam: nam, up: look * .6, seed: 1 });
  var hold = Math.max(eo(ramp(t, tE5 - .3, tE5 + .5)) * (1 - ramp(t, tF3 + .2, tF3 + 1.2)), eo(ramp(t, tBack + 1.6, tBack + 2.4)) * (1 - ramp(t, tI2 - .5, tI2 + .5)), eo(ramp(t, tJ2, tJ2 + .8)));     // moments when everyone stops and salutes the tilak
  CROWD.forEach(function (g) { var u = g.userData, upv = Math.max(look, Math.abs(err) > 1 && t < tCal0 ? .45 : 0) * (.6 + .4 * hsh(u.seed)), hy = Math.sin(t * .7 + u.seed * 3.1) * .3;
    if (!u.near) { var d = t * u.sp + u.ph - hold * 0, xx = 14.2 - ((d % 14.8) + 14.8) % 14.8, edge = Math.min(1, (14.2 - xx) / .8, (xx + .6) / .8); g.position.set(xx, .28, u.z + Math.sin(t * .5 + u.seed) * .06); g.scale.setScalar((u.kid ? .68 : 1) * Math.max(.001, eo(edge)));
      pose(g, { t: t, nam: Math.max(u.nam * .0, hold * (u.jai ? 0 : 1)), up: upv, walk: d * 5.4 + u.seed, seed: u.seed, hy: hy }); if (hold > .02 && u.jai) { ['L', 'R'].forEach(function (k) { g.J['sh' + k].rotation.z = lerp(g.J['sh' + k].rotation.z, 2.75 + Math.sin(t * 5 + u.seed) * .12, hold); g.J['el' + k].rotation.z = lerp(g.J['el' + k].rotation.z, .15, hold); }); } }
    else { var b = Math.pow(Math.max(0, Math.sin(t * .75 + u.seed * 2.3)), 6); pose(g, { t: t, nam: (u.near ? Math.max(nam, .85) : 1) * (1 - look * .5) * (Math.abs(err) > 1 ? .3 : 1), up: upv, seed: u.seed, hy: hy * .5 }); g.J.tor.rotation.z -= .5 * b; g.J.head.rotation.z -= .2 * b; } });
  pose(priest, { t: t, seed: 21 }); priest.J.shR.rotation.set(.35 * Math.cos(t * 2.6), 0, 1.35 + .28 * Math.sin(t * 2.6)); priest.J.elR.rotation.z = .35; priest.J.shL.rotation.z = .5; priest.J.elL.rotation.z = 1.3 + .25 * Math.sin(t * 9); priest.visible = !inCal;
  var dvb = Math.pow(Math.max(0, Math.sin(t * .6 + 1)), 8); dev.J.tor.rotation.z -= .55 * dvb;
  FLAGS.forEach(function (f) { var p = f.geometry.attributes.position, b = f.userData.b, w = f.userData.w; for (var k = 0; k < p.count; k++) { var u2 = (b[k * 3] + w / 2) / w; p.setXYZ(k, b[k * 3], b[k * 3 + 1] * (1 - .82 * u2) + Math.sin(u2 * 5 - t * 4.2) * .1 * u2, Math.sin(u2 * 7 - t * 6) * .32 * u2); } p.needsUpdate = true; });
  (function () { var o = new T.Object3D(); DIYA.forEach(function (q, k) { var fl = 1.5 + .5 * Math.sin(t * 11 + k * 2.1) * Math.sin(t * 6.3 + k); o.position.copy(q).add(V(Math.sin(t * 7 + k) * .006, .085, 0)); o.scale.set(1, fl, 1); o.updateMatrix(); DFL.setMatrixAt(k, o.matrix); }); DFL.instanceMatrix.needsUpdate = true;
    var farCam = cam.position.z > 9; FRONTG.visible = farCam; PETAL.visible = !inCal && farCam; if (PETAL.visible) { for (var k = 0; k < NPET; k++) { var fy = ((t * (.5 + .5 * hsh(k * 1.3)) + hsh(k * 2.9) * 5.4) % 5.4); o.position.set(X0 + .8 + hsh(k * 3.7) * 22.5 + Math.sin(t * 1.3 + k) * .25, 5.7 - fy, -4.6 + hsh(k * 5.1) * 4.5); o.rotation.set(t * 2 + k, t * 1.4 + k * 2, k); o.scale.setScalar(1); o.updateMatrix(); PETAL.setMatrixAt(k, o.matrix); } PETAL.instanceMatrix.needsUpdate = true; } })();
  BELLS.forEach(function (b, k) { b.rotation.x = Math.sin(t * 2.3 + k * 1.7) * .16; b.rotation.z = Math.sin(t * 1.7 + k) * .06; });
  e2.position.x = 1.3 + 1.5 * Math.sin(t * .33); if (eOnPre) { var mv = Math.cos(t * .33); e2.rotation.y = mv > 0 ? 0 : Math.PI; }
  var eOn = t >= tD - .2 && !(t >= tCal1 - .3); e1.visible = e2.visible = eOn && !inCal; if (eOn) { pose(e1, { t: t, seed: 3 }); e1.J.shR.rotation.z = 1.25 + Math.sin(t * 3.1) * .12; e1.J.elR.rotation.z = .35 + Math.sin(t * 3.1 + .6) * .2; pose(e2, { t: t, seed: 5, walk: Math.abs(Math.cos(t * .33)) > .25 ? e2.position.x * 5.2 : null }); e2.J.shL.rotation.z += .5; e2.J.elL.rotation.z = .7; e1.J.tor.rotation.z = .1 * Math.sin(t * 3.1); e1.J.head.rotation.y = .3 * Math.sin(t * 1.1); }
  var tOn = t >= tCal1 - .3 && t < tI2 + 2.5; tech.visible = astro.visible = card.visible = tOn || inCal;
  if (inCal) { // astronomer on the calendar set, pinning dates
    astro.position.copy(OC).add(V(-5.9 + ramp(t, tG, tG + 1.4) * 0, 0, 1.0)); astro.rotation.y = .9; pose(astro, { t: t, seed: 7 }); astro.J.shR.rotation.z = 1.9 + Math.sin(t * 2.2) * .15; astro.J.elR.rotation.z = .2; card.visible = false; tech.visible = false; }
  if (tOn) { var w = ramp(t, tH4 + .1, tH4 + 2.4), wx = lerp(8.2, 4.42, eo(w)), turning = ramp(t, tClick - .5, tClick + .7);
    tech.position.set(wx, 12.28, -.78); tech.rotation.y = w < 1 ? Math.PI : lerp(Math.PI, 2.2, 1); pose(tech, { t: t, seed: 9, walk: w < 1 ? t * 7.5 : null });
    if (w >= 1) { tech.rotation.y = 2.2; tech.J.shR.rotation.z = 1.3 + Math.sin(turning * Math.PI) * .22; tech.J.elR.rotation.z = .25 + turning * .2; tech.J.shL.rotation.z = .3; tech.J.elL.rotation.z = .6; tech.J.tor.rotation.z = .12; tech.J.head.rotation.z = .16; }
    astro.position.set(2.5, 12.28, -.2); astro.rotation.y = .9; pose(astro, { t: t, seed: 7 }); ['L', 'R'].forEach(function (k) { astro.J['sh' + k].rotation.z = .9; astro.J['el' + k].rotation.z = 1.2; }); card.position.set(2.74, 13.42, -.52); card.rotation.y = .9; }
  // --- calendar set
  CAL.visible = farmer.visible = inCal;
  if (inCal) { var nShown = 0; DOTS.forEach(function (d, i) { var td = i < 3 ? tG + .5 + i * .55 : i < 19 ? tG2 + (i - 3) * (tG3 + 1.2 - tG2) / 16 : tH2 + .7, u = ramp(t, td, td + .45); d.visible = u > 0; d.position.y = CY0 + Math.min(i, 19) * CDY + (1 - eob(u)) * 2.2; d.scale.setScalar(.6 + .4 * eob(u)); d.userData.lab.visible = d.userData.lab.userData.keep && (u > 0 || i < 3); if (u > 0) nShown = i; });
    LINK.visible = t > tH2 + 1.0; LINK.scale.y = eo(ramp(t, tH2 + 1.0, tH2 + 1.8)); LINK.position.y = CY0 + 19 * CDY / 2 * LINK.scale.y;
    var q = YRS[Math.min(19, nShown)], gEl = t < tG4 ? q.el : lerp(40, 86, .5 - .5 * Math.cos((t - tG4) * 1.25)); NEEDLE.rotation.z = gEl * Math.PI / 180;
    var sl = 1.6 / Math.tan(gEl * Math.PI / 180); SHAD.scale.x = Math.max(.05, sl); SHAD.position.x = -3.3 + sl / 2;
    MOON.rotation.y = t * .5; var phs = (t - tG) * 1.1; moonL.position.set(MOON.position.x + Math.sin(phs) * 8, MOON.position.y + 2, Math.cos(phs) * 8); moonL.intensity = 2.4;
    pose(farmer, { t: t, seed: 11 }); farmer.J.shR.rotation.z = t > tG4 ? 1.1 : .1; } else moonL.intensity = 0;
  // --- real-photo plates
  var p1a = 1 - ramp(t, tB - .1, tB + .4), p1b = ramp(t, tE5 - .3, tE5 - .05) * (1 - ramp(t, tF - .3, tF - .05)), p1 = t < tB + .4 ? p1a : p1b, p2 = ramp(t, tB2 - .2, tB2 + .05) * (1 - ramp(t, tC - .2, tC + .05));
  PL1.d.style.display = p1 > 0 ? 'block' : 'none'; PL2.d.style.display = p2 > 0 ? 'block' : 'none';
  if (p1 > 0) { PL1.d.style.opacity = p1; if (t < tB + .4) { var uz = eio(ramp(t, 0, 7.6)), pls = Math.exp(-Math.max(0, t - tSun) * 2.2) * (t >= tSun ? 1 : 0), brt = 1 + .5 * Math.exp(-t * 3.5);
      idolView(lerp(1.24, 1.98, uz), lerp(578, 470, uz), lerp(300, 345, uz), Math.min(1, .62 + .12 * Math.sin(t * 2.3) + .4 * pls), 1 + .12 * Math.sin(t * 3.1) + .9 * pls + 1.2 * Math.exp(-t * 4), t);
      PL1.flash.style.display = t < .8 ? 'block' : 'none'; PL1.flash.style.opacity = .5 * ramp(t, .02, .1) * (1 - ramp(t, .1, .75)); PL1.cred.textContent = 'real photo: PIB · GODL-India · beam + spot drawn by us'; PL1.img.style.filter = 'brightness(' + (.5 + .3 * Math.exp(-t * 4)).toFixed(3) + ') saturate(1.1)'; }
    else { var uq = eio(ramp(t, tE5 - .3, tF - .2)); idolView(lerp(2.25, 2.6, uq), lerp(430, 400, uq), lerp(400, 420, uq), .8, 1 + .1 * Math.sin(t * 3.1), t); PL1.flash.style.display = 'none'; PL1.cred.textContent = '58 mm: reported (CBRI) · photo: PIB, GODL-India · spot drawn by us'; PL1.img.style.filter = 'brightness(.5) saturate(1.1)'; } }
  if (p2 > 0) { PL2.d.style.opacity = p2; var u2s = ramp(t, tB2 - .2, tC), k2 = PL2.cw / 960 * lerp(1.03, 1.15, u2s); PL2.inn.style.transform = 'translate(' + ((PL2.cw - 960 * k2) / 2).toFixed(2) + 'px,' + ((PL2.ch - 563 * k2) * .55).toFixed(2) + 'px) scale(' + k2.toFixed(4) + ')';
    var ua = eo(ramp(t, tB2 + .5, tB2 + 2.0)); ARR.style.top = (PL2.cy + 40) + 'px'; ARR.style.left = (PL2.cx + 340) + 'px'; ARR.style.height = (300 * ua) + 'px'; ST_[3][2].style.left = (PL2.cx + 360) + 'px'; ST_[3][2].style.top = (PL2.cy + 300) + 'px'; }
  ST_.forEach(function (q) { var on = t >= q[0] && t < q[1]; q[2].style.display = on ? 'block' : 'none'; if (on) { var u = eob(ramp(t, q[0], q[0] + .3)) * (1 - ramp(t, q[1] - .2, q[1])); q[2].style.opacity = Math.min(1, u); q[2].style.transform = 'scale(' + (.7 + .3 * u) + ')'; } });
  if (!(p1 >= 1 || p2 >= 1)) render(t);
  // --- DOM
  HEADS.forEach(function (h) { var on = t >= h.t0 && t < h.t1, u = (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .45))) * (1 - ramp(t, h.t1 - .25, h.t1)); h.k.style.display = h.h.style.display = on ? 'block' : 'none'; if (on) { h.k.style.opacity = h.h.style.opacity = u; h.h.style.transform = 'translateY(' + (1 - u) * 14 + 'px)'; } });
  var s = null; SRCS.forEach(function (q) { if (t >= q[0] && t < q[1]) s = q; }); SRC.style.display = s ? 'block' : 'none'; if (s) { SRC.textContent = s[2]; SRC.style.opacity = (s[0] === 0 ? 1 : eo(ramp(t, s[0], s[0] + .4))) * (1 - ramp(t, s[1] - .2, s[1])); }
  var hud = null, hm = function (m) { var mm = Math.floor(m), ss = Math.floor((m - mm) * 60); return '12:' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss; };
  if (t >= tC2 + 1.9 && t < tD2 - .5) hud = [['DATE', '17 APR 2024'], ['SUN HEIGHT', EL24.toFixed(1) + '°']];
  else if (t >= tF2 && t < tCal0) hud = [['DATE', uY < .5 ? '17 APR 2024' : '6 APR 2025'], ['SUN HEIGHT', elNow.toFixed(1) + '°'], ['SETTING', '1 / 19']];
  else if (inCal && t >= tG + .4) { var qq = YRS[Math.min(19, Math.max(0, DOTS.reduce(function (a, d, i) { return d.visible ? i : a; }, 0)))]; hud = t < tG4 ? [['RAM NAVAMI', qq.d + ' ' + MON[qq.m] + ' ' + qq.y], ['NOON SUN', qq.el.toFixed(1) + '°']] : t < tH ? [['SHADOW', 'LONG IN WINTER'], ['', 'SHORT IN SUMMER']] : [['235 MOONS', '6939.69 DAYS'], ['19 YEARS', '6939.60 DAYS']]; }
  else if (t >= tH3 + .3 && t < tBack) hud = [['DATE', '6 APR 2025'], ['SUN HEIGHT', EL25.toFixed(1) + '°'], ['SETTING', (uSet > .5 ? '2' : '1') + ' / 19']];
  else if (t >= tI + .3 && t < tJ - .2) hud = [['CLOCK · 30×', hm(Math.min(9.9, (t - tI) * .5))], ['TILAK', lit > .02 && offZ < .5 ? 'ON THE MARK' : cl > .5 ? 'NO SUN' : 'MOVING OFF']];
  HUD.style.display = hud ? 'flex' : 'none'; if (hud) HUD.innerHTML = hud.map(function (h) { return '<div><small>' + (h[0] || '&nbsp;') + '</small>' + h[1] + '</div>'; }).join('');
  var L = ''; TAGS.forEach(function (g) { var on = t >= g.t0 && t < g.t1; g.d.style.display = on ? 'block' : 'none'; if (!on) return; var u = eo(ramp(t, g.t0, g.t0 + .35)) * (1 - ramp(t, g.t1 - .2, g.t1)); g.d.style.opacity = u;
    var a = scr(g.a()), w = g.d.offsetWidth, h = g.d.offsetHeight, bx = clamp(a.x, g.x, g.x + w), by = a.y < g.y ? g.y : g.y + h, col = g.cls === 'v' ? '#ff6a4a' : g.cls === 'm' ? '#9fc4ff' : '#ffd9a0';
    if (a.x > 150 && a.x < 930 && a.y > 200 && a.y < 1300) L += '<path d="M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' L' + bx.toFixed(1) + ' ' + by.toFixed(1) + '" stroke="' + col + '" stroke-width="2" fill="none" opacity="' + (u * .85).toFixed(2) + '"/><circle cx="' + a.x.toFixed(1) + '" cy="' + a.y.toFixed(1) + '" r="5" fill="none" stroke="' + col + '" stroke-width="2" opacity="' + u.toFixed(2) + '"/>'; });
  svg.innerHTML = L;
  var endOn = t >= tCTA - .1; END.style.display = endOn ? 'block' : 'none'; if (endOn) { var ue = eo(ramp(t, tCTA - .1, tCTA + .6)); END.style.opacity = ue; END.style.transform = 'translateY(' + (1 - ue) * 30 + 'px)';
    var bs = document.getElementById('bS'), bf = document.getElementById('bF'), u1 = eob(ramp(t, CW('s37', .0), CW('s37', .0) + .4)), u2 = eob(ramp(t, CW('s37', .3), CW('s37', .3) + .4)), pu = 1 + .04 * Math.sin((t - tCTA) * 4.2);
    bs.style.transform = 'scale(' + (u1 * pu) + ')'; bf.style.transform = 'scale(' + (u2 * (2 - pu)) + ')'; }
  capEl.innerHTML = t < TM.groups[TM.groups.length - 1].end + .4 ? CAP.html(t, CAPW, { plain: true, hi: '#ffc56b', ink: '#f1f3f8', fs: 40, width: 756 }) : '';
};
window.__dbg = function (c) { return eval(c); };
window.__seek(0); window.__ready = true;
})();
