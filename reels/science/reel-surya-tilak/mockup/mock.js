/* Surya Tilak — mockup stills. ?s=1 hook (the spot lands, devotee), 2 the periscope in a cut-away temple, 3 the technician sets mirror 1.
   Schematic temple (generic Nagara section, NOT the temple's drawings). The idol is never modelled. three.js r160: scene -> HDR RT -> bloom -> ACES. */
(function () {
var T = THREE, W = 1080, H = 1920, Q = new URLSearchParams(location.search), SC = +(Q.get('s') || 1);
var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)); };
var hsh = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace; R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
var S = new T.Scene(), cam = new T.PerspectiveCamera(30, W / H, .05, 600);
var ov = document.getElementById('ov'), svg = document.getElementById('lines');
function el(cls, html, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; ov.appendChild(d); return d; }
var V = function (x, y, z) { return new T.Vector3(x, y, z); };

// ---------- environment (dark room with two soft boxes so brass has something to reflect) ----------
var pm = new T.PMREMGenerator(R), envS = new T.Scene();
envS.add(new T.Mesh(new T.SphereGeometry(50, 24, 12), new T.MeshBasicMaterial({ color: 0x1c0f10, side: T.BackSide })));
[[0, 30, 14, 34, 3, 10, 5, 1, .86, .62], [-26, 8, 12, 3, 16, 22, 1.6, .6, .7, 1], [24, 10, 6, 3, 12, 16, 1.2, 1, .8, .6]].forEach(function (q) {
  var m = new T.Mesh(new T.BoxGeometry(q[3], q[4], q[5]), new T.MeshBasicMaterial({ color: new T.Color(q[7], q[8], q[9]).multiplyScalar(q[6]) })); m.position.set(q[0], q[1], q[2]); m.lookAt(0, 0, 0); envS.add(m); });
S.environment = pm.fromScene(envS, .02).texture;
S.background = new T.Color(0x120709);

// ---------- post ----------
var rtA = new T.WebGLRenderTarget(W, H, { samples: 4, type: T.HalfFloatType }), q4 = function () { return new T.WebGLRenderTarget(W / 4, H / 4, { type: T.HalfFloatType }); }, rB1 = q4(), rB2 = q4();
var pq = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), pS = new T.Scene(), quad = new T.Mesh(new T.PlaneGeometry(2, 2)); pS.add(quad);
var VS = 'varying vec2 vU; void main(){ vU=uv; gl_Position=vec4(position.xy,0.,1.); }';
var mBright = new T.ShaderMaterial({ uniforms: { tex: { value: null } }, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; varying vec2 vU; void main(){ vec3 c=texture2D(tex,vU).rgb; float l=dot(c,vec3(.2126,.7152,.0722)); gl_FragColor=vec4(c*smoothstep(.9,2.2,l),1.); }' });
var mBlur = new T.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new T.Vector2() } }, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; uniform vec2 dir; varying vec2 vU; void main(){ vec3 s=vec3(0.); float w=0.; for(int i=-6;i<=6;i++){ float g=exp(-float(i*i)/14.); s+=texture2D(tex,vU+dir*float(i)).rgb*g; w+=g; } gl_FragColor=vec4(s/w,1.); }' });
var mGrade = new T.ShaderMaterial({ uniforms: { tex: { value: null }, bl: { value: null }, exp: { value: 1 }, bloom: { value: .8 } }, vertexShader: VS,
  fragmentShader: 'uniform sampler2D tex, bl; uniform float exp, bloom; varying vec2 vU; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }' +
  'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }' +
  'void main(){ vec3 c=(texture2D(tex,vU).rgb + texture2D(bl,vU).rgb*bloom)*exp; c=aces(c); c=pow(c,vec3(1./2.2)); vec2 q=vU-.5; c*=1.-dot(q*vec2(1.,.8),q*vec2(1.,.8))*1.0; c+=(h(vU*vec2(1080.,1920.))-.5)*.022; gl_FragColor=vec4(c,1.); }' });
[mBright, mBlur, mGrade].forEach(function (m) { m.depthTest = false; m.toneMapped = false; });
function render() {
  R.setRenderTarget(rtA); R.render(S, cam);
  quad.material = mBright; mBright.uniforms.tex.value = rtA.texture; R.setRenderTarget(rB1); R.render(pS, pq);
  for (var k = 0; k < 3; k++) { quad.material = mBlur; mBlur.uniforms.tex.value = rB1.texture; mBlur.uniforms.dir.value.set(3 / W * (k + 1), 0); R.setRenderTarget(rB2); R.render(pS, pq);
    mBlur.uniforms.tex.value = rB2.texture; mBlur.uniforms.dir.value.set(0, 3 / H * (k + 1)); R.setRenderTarget(rB1); R.render(pS, pq); }
  quad.material = mGrade; mGrade.uniforms.tex.value = rtA.texture; mGrade.uniforms.bl.value = rB1.texture; R.setRenderTarget(null); R.render(pS, pq);
}
var v3 = new T.Vector3();
function scr(p) { cam.updateMatrixWorld(); v3.copy(p).project(cam); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H }; }
function tagAt(p, html, dx, dy, cls) { var a = scr(p), d = el('tag ' + (cls || ''), html), w = d.offsetWidth, h = d.offsetHeight, x = clamp(a.x + dx, 160, 918 - w), y = a.y + dy; d.style.left = x + 'px'; d.style.top = y + 'px';
  var bx = clamp(a.x, x, x + w), by = dy < 0 ? y + h : y, col = cls === 'v' ? '#ff6a4a' : '#ffd9a0';
  svg.insertAdjacentHTML('beforeend', '<path d="M' + a.x + ' ' + a.y + ' L' + bx + ' ' + by + '" stroke="' + col + '" stroke-width="2" fill="none" opacity=".85"/><circle cx="' + a.x + '" cy="' + a.y + '" r="5" fill="' + col + '"/>'); }

// ---------- materials ----------
function stoneTex() { var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d'); g.fillStyle = '#e9dfcc'; g.fillRect(0, 0, 512, 512);
  for (var i = 0; i < 9000; i++) { var a = hsh(i) * .07; g.fillStyle = hsh(i + 3) > .5 ? 'rgba(120,90,60,' + a + ')' : 'rgba(255,250,240,' + a + ')'; g.fillRect(hsh(i + 1) * 512, hsh(i + 2) * 512, 1 + hsh(i + 5) * 3, 1 + hsh(i + 6) * 2); }
  g.strokeStyle = 'rgba(90,60,40,.16)'; g.lineWidth = 2; for (var y = 0; y < 512; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); for (var x = (y / 64 % 2) * 64; x < 512; x += 128) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 64); g.stroke(); } }
  var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
var sTex = stoneTex();
function stone(rep, col) { var t = sTex.clone(); t.needsUpdate = true; t.repeat.set(rep || 1, rep || 1); return new T.MeshStandardMaterial({ map: t, color: col || 0xffffff, roughness: .92, metalness: 0, envMapIntensity: .35 }); }
var STONE = stone(2), STONE_D = stone(2, 0xcbbfae), CUT = new T.MeshStandardMaterial({ color: 0x8a5a44, roughness: .95, envMapIntensity: .2 });
var BRASS = new T.MeshStandardMaterial({ color: 0xd9a441, metalness: 1, roughness: .28 }), BRASS_D = new T.MeshStandardMaterial({ color: 0xa87a2c, metalness: 1, roughness: .42 });
var BLACK = new T.MeshStandardMaterial({ color: 0x0a0806, roughness: 1, metalness: 0, side: T.BackSide, envMapIntensity: 0 });
var MIRROR = new T.MeshStandardMaterial({ color: 0xf4f6ff, metalness: 1, roughness: .03, envMapIntensity: 1.6 });
var GLASS = new T.MeshPhysicalMaterial({ color: 0xeaf6ff, roughness: .03, metalness: 0, transmission: 1, thickness: .2, ior: 1.5, transparent: true, opacity: .55, envMapIntensity: 1.5, depthWrite: false });
var IRG = new T.MeshPhysicalMaterial({ color: 0x9fe6d0, roughness: .05, metalness: 0, transparent: true, opacity: .45, envMapIntensity: 1.4, depthWrite: false });
function box(w, h, d, m, x, y, z, par) { var b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; (par || S).add(b); return b; }
function cyl(r1, r2, h, m, x, y, z, par, seg) { var b = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 24), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; (par || S).add(b); return b; }

// ---------- schematic temple, cut at z = 0 (camera side removed). 1 unit = 1 m. Floors 6 m (20 ft). West = -x (sanctum), north = -z. ----------
var TEM = new T.Group(); S.add(TEM);
var X0 = -9, X1 = 15, Z0 = -8, FH = 6;
box(X1 - X0 + 3, 1.2, 9.5, STONE_D, (X0 + X1) / 2, -.6, Z0 / 2 - .75, TEM);                 // plinth
for (var f = 0; f <= 3; f++) { if (f) { // floor slabs with a hole for the light pipe
    box(X1 - X0, .55, -Z0 - 5.1, STONE, (X0 + X1) / 2, f * FH, Z0 + (-Z0 - 5.1) / 2, TEM); box(X1 - X0, .55, 3.9, STONE, (X0 + X1) / 2, f * FH, -1.95, TEM);
    box(3 - .6 - X0, .55, 1.2, STONE, (X0 + 2.4) / 2, f * FH, -4.5, TEM); box(X1 - 3.6, .55, 1.2, STONE, (X1 + 3.6) / 2, f * FH, -4.5, TEM);
    box(X1 - X0, .56, .04, CUT, (X0 + X1) / 2, f * FH, .0, TEM); } }
box(.8, 18.3, -Z0, STONE, X0 - .4, 9.15, Z0 / 2, TEM); box(.8, 18.3, -Z0, STONE, X1 + .4, 9.15, Z0 / 2, TEM); box(X1 - X0 + 1.6, 18.3, .8, STONE_D, (X0 + X1) / 2, 9.15, Z0 - .4, TEM); // walls
box(.82, 18.3, .04, CUT, X0 - .4, 9.15, 0, TEM); box(.82, 18.3, .04, CUT, X1 + .4, 9.15, 0, TEM);
for (var f2 = 0; f2 < 3; f2++) for (var px = -1; px <= 13; px += 3.5) { if (Math.abs(px - 3) < 1) continue; var py = f2 * FH + .28; // carved pillars
    cyl(.34, .4, 5.1, STONE, px, py + 2.8, -6.4, TEM, 12); box(1.0, .35, 1.0, STONE, px, py + .2, -6.4, TEM); box(1.1, .3, 1.1, STONE, px, py + 5.3, -6.4, TEM); cyl(.5, .34, .4, STONE, px, py + 4.95, -6.4, TEM, 12); }
box(.6, 5.45, 4.6, STONE, -1.2, 3, -5.7, TEM);                                               // sanctum partition (doorway toward camera)
// niche: carved arch on the west wall; the idol is not modelled, a soft aureole of light stands in its place
var NICHE = V(-8.2, 1.62, -1.5);
box(.5, 4.3, 3.4, STONE_D, -8.72, 2.4, -1.5, TEM); box(.7, .5, 3.9, STONE, -8.5, .5, -1.5, TEM); box(.6, 3.3, .42, STONE, -8.5, 2.4, .0 - .02, TEM); box(.6, 3.3, .42, STONE, -8.5, 2.4, -3.0, TEM);
(function () { var a = new T.Mesh(new T.TorusGeometry(1.5, .26, 12, 40, Math.PI), STONE); a.rotation.y = Math.PI / 2; a.position.set(-8.5, 4.02, -1.5); a.castShadow = true; TEM.add(a);
  for (var i = 0; i < 9; i++) { var th = Math.PI * (i + .5) / 9; cyl(.11, .11, .12, BRASS, -8.25, 4.02 + Math.sin(th) * 1.5, -1.5 + Math.cos(th) * 1.5, TEM, 10).rotation.z = Math.PI / 2; }
  cyl(.95, 1.15, .28, STONE, -8.0, .9, -1.5, TEM, 20); cyl(.75, .95, .2, BRASS_D, -8.0, 1.12, -1.5, TEM, 20); })();
function glowTex(c0, c1) { var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, c0); gr.addColorStop(.35, c1); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; }
var AURA = new T.Mesh(new T.PlaneGeometry(2.3, 3.5), new T.MeshBasicMaterial({ map: glowTex('rgba(255,214,150,.55)', 'rgba(255,170,90,.18)'), transparent: true, blending: T.AdditiveBlending, depthWrite: false })); AURA.rotation.y = Math.PI / 2; AURA.position.set(-8.35, 2.35, -1.5); TEM.add(AURA);
// shikhara (half lathe, open toward the camera) over the sanctum + stepped roof over the hall
(function () { var pts = [], n = 22; for (var i = 0; i <= n; i++) { var u = i / n; pts.push(new T.Vector2(4.6 * Math.pow(1 - u, .62) * (1 - .12 * u) + .55, u * 26)); }
  var m = new T.Mesh(new T.LatheGeometry(pts, 20, Math.PI / 2, Math.PI), new T.MeshStandardMaterial({ map: STONE.map, roughness: .92, side: T.DoubleSide, envMapIntensity: .35 })); m.position.set(-4.6, 18.3, 0); m.castShadow = m.receiveShadow = true; TEM.add(m);
  var am = new T.Mesh(new T.SphereGeometry(1.5, 20, 10, Math.PI, Math.PI), STONE); am.scale.y = .42; am.position.set(-4.6, 44.9, 0); TEM.add(am); cyl(.2, .5, 2.2, BRASS, -4.6, 46.6, -.3, TEM);
  for (var s = 0; s < 4; s++) box(13.2 - s * 2.6, .9, 7.6 - s * 1.5, STONE, 7.6, 18.9 + s * .9, -4.2 - s * .0, TEM); cyl(.5, 1.1, 1.4, STONE, 7.6, 23.0, -4.2, TEM, 16); })();

// ---------- the periscope (SCHEMATIC: dimensions are not published) ----------
var AP = V(3, 18.45, -.27), M1 = V(3, 14.1, -1.5), M2 = V(3, 14.1, -4.5), M3 = V(3, 3.4, -4.5), M4 = V(3, 3.4, -1.5);
var SUNEL = SC === 3 ? 69.4 : 73.8, se = SUNEL * Math.PI / 180, SUND = V(0, Math.sin(se), Math.cos(se));     // noon: the Sun stands due south (+z, the camera side)
var PER = new T.Group(); S.add(PER);
function mirror(p, din, dout, r) { var g = new T.Group(); g.position.copy(p); var n = dout.clone().sub(din).normalize(); g.lookAt(p.clone().add(n));
  var d = new T.Mesh(new T.CylinderGeometry(r, r, .04, 40), MIRROR); d.rotation.x = Math.PI / 2; g.add(d); var ring = new T.Mesh(new T.TorusGeometry(r + .03, .05, 10, 40), BRASS); g.add(ring);
  var back = new T.Mesh(new T.CylinderGeometry(r * .5, r * .9, .12, 24), BRASS_D); back.rotation.x = Math.PI / 2; back.position.z = -.09; g.add(back); PER.add(g); return g; }
function pipe(a, b, r, open) { var d = b.clone().sub(a), L = d.length(), g = new T.Group(); g.position.copy(a).addScaledVector(d, .5); g.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
  var th0 = open == null ? 0 : open, tl = open == null ? Math.PI * 2 : Math.PI * 1.25, geo = new T.CylinderGeometry(r, r, L, 36, 1, true, th0, tl);
  var o = new T.Mesh(geo, BRASS); o.castShadow = true; g.add(o); g.add(new T.Mesh(geo, BLACK));
  for (var i = 0; i <= Math.floor(L / 1.6); i++) { var fl = new T.Mesh(new T.TorusGeometry(r + .02, .045, 8, 36, tl), BRASS_D); fl.rotation.x = Math.PI / 2; fl.rotation.z = Math.PI / 2 - th0 - tl; fl.position.y = -L / 2 + .2 + i * (L - .4) / Math.max(1, Math.floor(L / 1.6)); g.add(fl); }
  PER.add(g); return g; }
function lens(p, dir, r) { var g = new T.Group(); g.position.copy(p); g.quaternion.setFromUnitVectors(V(0, 0, 1), dir.clone().normalize()); var l = new T.Mesh(new T.SphereGeometry(r, 32, 16), GLASS); l.scale.z = .22; l.renderOrder = 5; g.add(l); g.add(new T.Mesh(new T.TorusGeometry(r + .02, .045, 10, 36), BRASS)); PER.add(g); return g; }
var dS = SUND.clone().negate(), dN = V(0, 0, -1), dD = V(0, -1, 0), dSo = V(0, 0, 1), dW = NICHE.clone().sub(M4).normalize();
var m1 = mirror(M1, dS, dN, .5); mirror(M2, dN, dD, .5); mirror(M3, dD, dSo, .34); mirror(M4, dSo, dW, .3);
// vertical pipe is cut open toward the camera (+z) so the beam is visible inside it
pipe(V(3, 13.45, -4.5), V(3, 4.05, -4.5), .52, Math.PI * .375);
lens(V(3, 11.2, -4.5), dD, .46); lens(V(3, 8.4, -4.5), dD, .44); lens(V(3, 3.4, -3.0), dSo, .32); lens(M4.clone().addScaledVector(dW, 1.2), dW, .26);
[M2, M3].forEach(function (p) { var b = box(1.25, 1.25, 1.25, BRASS_D, p.x, p.y, p.z, PER); b.material = BRASS_D.clone(); b.material.transparent = true; b.material.opacity = .0; b.visible = false; });
// roof aperture: brass hood + infrared filter glass
(function () { var g = new T.Group(); g.position.copy(AP); g.quaternion.setFromUnitVectors(V(0, 1, 0), SUND);
  var hood = new T.Mesh(new T.CylinderGeometry(.62, .62, .9, 36, 1, true), BRASS); hood.castShadow = true; g.add(hood); g.add(new T.Mesh(hood.geometry, BLACK));
  var ir = new T.Mesh(new T.CylinderGeometry(.6, .6, .05, 36), IRG); ir.position.y = .3; ir.renderOrder = 5; g.add(ir); var fl = new T.Mesh(new T.TorusGeometry(.64, .06, 8, 36), BRASS_D); fl.rotation.x = Math.PI / 2; fl.position.y = .45; g.add(fl); PER.add(g); })();
// mirror 1 mount: post, yoke and the 19-notch setting wheel
var WH = new T.Group(); (function () { cyl(.07, .09, 1.75, BRASS_D, 3.75, 13.2, -1.5, PER); box(.5, .08, .5, BRASS_D, 3.75, 12.33, -1.5, PER); box(.8, .07, .07, BRASS_D, 3.38, 14.1, -1.5, PER); box(.05, .5, .05, BRASS, 3.86, 13.75, -1.5, PER);
  WH.position.set(3.9, 13.25, -1.5); WH.rotation.z = Math.PI / 2; var d = new T.Mesh(new T.CylinderGeometry(.5, .5, .05, 57), BRASS); WH.add(d); var d2 = new T.Mesh(new T.CylinderGeometry(.3, .3, .07, 40), BRASS_D); WH.add(d2);
  for (var i = 0; i < 19; i++) { var a = i / 19 * Math.PI * 2, n = new T.Mesh(new T.BoxGeometry(.06, .09, .12), i === 1 ? new T.MeshBasicMaterial({ color: new T.Color(4, 1.1, .5) }) : BRASS_D); n.position.set(Math.cos(a) * .53, 0, Math.sin(a) * .53); n.rotation.y = -a; WH.add(n); }
  var kn = new T.Mesh(new T.CylinderGeometry(.05, .05, .16, 12), BRASS_D); kn.position.set(.4, -.1, 0); WH.add(kn); PER.add(WH); })();

// ---------- light: additive shafts with soft edges + dust that only shows inside the beam ----------
var SUNC = new T.Color(1, .74, .42);
function shaft(a, b, r0, r1, k) { var d = b.clone().sub(a), L = d.length(), geo = new T.CylinderGeometry(r1, r0, L, 40, 1, true);
  var m = new T.ShaderMaterial({ transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, uniforms: { c: { value: SUNC.clone().multiplyScalar(k) } },
    vertexShader: 'varying vec3 vN, vV; varying float vY; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); vY=uv.y; gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'uniform vec3 c; varying vec3 vN, vV; varying float vY; void main(){ float f=abs(dot(normalize(vN),normalize(vV))); float s=.75+.25*sin(vY*37.)*sin(vY*11.3+1.7); gl_FragColor=vec4(c*pow(f,1.6)*s,1.); }' });
  var o = new T.Mesh(geo, m); o.position.copy(a).addScaledVector(d, .5); o.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().normalize()); o.renderOrder = 8; S.add(o);
  var n = Math.round(L * 90 * (r0 + r1)), g = new T.BufferGeometry(), p = new Float32Array(n * 3), u = V(0, 1, 0).cross(d).length() < .01 ? V(1, 0, 0) : V(0, 1, 0).cross(d).normalize(), w = d.clone().cross(u).normalize();
  for (var i = 0; i < n; i++) { var t = hsh(i * 3.1 + L), rr = Math.sqrt(hsh(i * 1.7 + 5)) * (r0 + (r1 - r0) * t) * .95, th = hsh(i * 2.3 + 9) * 6.283; var q = a.clone().addScaledVector(d, t).addScaledVector(u, Math.cos(th) * rr).addScaledVector(w, Math.sin(th) * rr); p[i * 3] = q.x; p[i * 3 + 1] = q.y; p[i * 3 + 2] = q.z; }
  g.setAttribute('position', new T.BufferAttribute(p, 3)); var pts = new T.Points(g, new T.PointsMaterial({ color: SUNC.clone().multiplyScalar(k * 1.6), size: 2.2, sizeAttenuation: false, transparent: true, opacity: .8, blending: T.AdditiveBlending, depthWrite: false })); pts.renderOrder = 9; S.add(pts); return o; }
var skyP = AP.clone().addScaledVector(SUND, 30);
var KB = SC === 3 ? .5 : 1; shaft(skyP, AP, .62, .6, SC === 2 ? .5 : .35); shaft(AP, M1, .56, .48, KB); shaft(M1, M2, .46, .46, KB); shaft(M2, V(3, 11.2, -4.5), .44, .42, 1.0); shaft(V(3, 11.2, -4.5), V(3, 8.4, -4.5), .42, .3, 1.2);
shaft(V(3, 8.4, -4.5), M3, .3, .26, 1.4); shaft(M3, M4, .24, .2, 1.6); shaft(M4, NICHE, .18, .03, 2.0);
// the tilak: 58 mm spot of light (the only vermilion in the film) + the light it throws back
var SPOT = new T.Mesh(new T.CircleGeometry(.029, 40), new T.MeshBasicMaterial({ color: new T.Color(9, 2.6, 1.1) })); SPOT.rotation.y = Math.PI / 2; SPOT.position.copy(NICHE).add(V(.03, 0, 0)); S.add(SPOT);
var HALO = new T.Mesh(new T.PlaneGeometry(.6, .6), new T.MeshBasicMaterial({ map: glowTex('rgba(255,150,90,.9)', 'rgba(255,90,40,.25)'), transparent: true, blending: T.AdditiveBlending, depthWrite: false })); HALO.rotation.y = Math.PI / 2; HALO.position.copy(NICHE).add(V(.05, 0, 0)); S.add(HALO);
var spotL = new T.PointLight(0xffb070, 60, 14, 1.8); spotL.position.copy(NICHE).add(V(.5, .1, 0)); S.add(spotL);
[[M1, .5, dS, dN], [M2, .5, dN, dD], [M3, .34, dD, dSo], [M4, .3, dSo, dW]].forEach(function (q, i) { var l = new T.PointLight(0xffd9a0, i < 2 ? 14 : 8, 7, 2); l.position.copy(q[0]); S.add(l);
  var n = q[3].clone().sub(q[2]).normalize(), h = new T.Mesh(new T.CircleGeometry(q[1] * .9, 40), new T.MeshBasicMaterial({ map: glowTex('rgba(255,240,210,1)', 'rgba(255,190,110,.75)'), color: new T.Color(2.6, 2.2, 1.6), transparent: true, blending: T.AdditiveBlending, depthWrite: false })); h.position.copy(q[0]).addScaledVector(n, .03); h.lookAt(q[0].clone().add(n)); h.renderOrder = 10; S.add(h); });

// ---------- people: faceless brick-style figures (posed by hand here; mocap-driven in the film) ----------
function clay(c) { return new T.MeshStandardMaterial({ color: c, roughness: .78, metalness: 0, envMapIntensity: .3 }); }
var SKIN = clay(0xc98f62);
function fig(o) { o = o || {}; var g = new T.Group(), cl = clay(o.cloth || 0xe9e2d2), lg = clay(o.legs || 0xd9d2c2), J = {};
  var hips = new T.Group(); hips.position.y = .82; g.add(hips); J.hips = hips;
  [-1, 1].forEach(function (s) { var leg = new T.Group(); leg.position.set(0, 0, s * .1); hips.add(leg); var m = box(.21, .8, .19, lg, 0, -.4, 0, leg); box(.27, .09, .2, clay(0x4a3526), .03, -.8 + .045, 0, leg); J['leg' + (s < 0 ? 'L' : 'R')] = leg; });
  box(.24, .14, .42, lg, 0, .05, 0, hips);
  var tor = new T.Group(); tor.position.y = .1; hips.add(tor); J.tor = tor;
  var tb = new T.Mesh(new T.CylinderGeometry(.2, .245, .56, 4, 1), cl); tb.rotation.y = Math.PI / 4; tb.scale.set(.82, 1, 1.2); tb.position.y = .3; tb.castShadow = true; tor.add(tb);
  var neck = cyl(.07, .07, .08, SKIN, 0, .62, 0, tor, 12), head = new T.Group(); head.position.y = .66; tor.add(head); J.head = head;
  var hd = cyl(.135, .135, .22, SKIN, 0, .12, 0, head, 20); cyl(.07, .07, .05, SKIN, 0, .255, 0, head, 12);
  if (o.hair !== false && !o.hat) { var h = new T.Mesh(new T.SphereGeometry(.142, 20, 10, 0, 6.283, 0, 1.75), clay(0x1c1410)); h.position.set(-.012, .15, 0); h.scale.y = .95; h.castShadow = true; head.add(h); }
  if (o.hat) { var hh = new T.Mesh(new T.SphereGeometry(.155, 20, 10, 0, 6.283, 0, 1.57), clay(o.hat)); hh.position.y = .17; hh.castShadow = true; head.add(hh); cyl(.19, .19, .02, clay(o.hat), .03, .175, 0, head, 20); }
  [-1, 1].forEach(function (s) { var sh = new T.Group(); sh.position.set(0, .52, s * .27); tor.add(sh); cyl(.062, .058, .3, cl, 0, -.15, 0, sh, 12); var elb = new T.Group(); elb.position.y = -.3; sh.add(elb); cyl(.055, .05, .27, o.sleeve === false ? SKIN : cl, 0, -.135, 0, elb, 12);
    var hand = new T.Mesh(new T.SphereGeometry(.062, 12, 8), SKIN); hand.position.y = -.3; hand.scale.set(1, 1.1, .7); elb.add(hand); J['sh' + (s < 0 ? 'L' : 'R')] = sh; J['el' + (s < 0 ? 'L' : 'R')] = elb; });
  if (o.scarf) { var sc = new T.Mesh(new T.TorusGeometry(.115, .045, 8, 20), clay(o.scarf)); sc.rotation.x = Math.PI / 2; sc.position.y = .6; tor.add(sc); var t1 = box(.035, .5, .1, clay(o.scarf), .16, .36, .09, tor), t2 = box(.035, .42, .1, clay(o.scarf), .16, .4, -.09, tor); }
  g.J = J; g.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); return g; }
function place(g, x, y, z, yaw) { g.position.set(x, y, z); g.rotation.y = yaw || 0; S.add(g); return g; }   // figures face +x at yaw 0
function namaste(g) { var J = g.J; ['L', 'R'].forEach(function (k, i) { var s = i ? 1 : -1; J['sh' + k].rotation.set(s * .42, 0, .55); J['el' + k].rotation.set(s * .62, 0, 1.75); }); J.head.rotation.z = -.1; }
function crowd(n, x0, x1, z0, z1, y, seed, yaw) { for (var i = 0; i < n; i++) { var cols = [0xe9e2d2, 0xd8b98a, 0xb9c4c9, 0xd9a7a0, 0xc9d2a8, 0xe3c46b, 0xa9b6d9];
    var g = fig({ cloth: cols[Math.floor(hsh(i + seed) * cols.length)], legs: hsh(i + seed + 4) > .5 ? 0xd9d2c2 : 0x6c5a4c, scarf: hsh(i + seed + 7) > .8 ? 0xe8842a : null });
    place(g, x0 + (x1 - x0) * hsh(i * 2.1 + seed + 1), y, z0 + (z1 - z0) * hsh(i * 3.7 + seed + 2), yaw + (hsh(i + seed + 3) - .5) * .3); if (hsh(i + seed + 9) > .45) namaste(g); else { g.J.shL.rotation.z = .08; g.J.shR.rotation.z = .08; } } }

// ---------- lights per scene ----------
var sun = new T.DirectionalLight(0xffe2b8, 0); sun.position.copy(V(3, 16, -2)).addScaledVector(SUND, 60); sun.target.position.set(3, 16, -2); S.add(sun.target); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
var sc0 = sun.shadow.camera; sc0.left = -22; sc0.right = 22; sc0.top = 34; sc0.bottom = -24; sc0.near = 5; sc0.far = 130; sun.shadow.bias = -.0005; sun.shadow.normalBias = .04; S.add(sun);
var hemi = new T.HemisphereLight(0x6a4a44, 0x140808, .5); S.add(hemi);
var fill = new T.DirectionalLight(0xe9d8c8, 0); fill.position.set(-10, 8, 20); S.add(fill);
var KICK, HEAD, SRC, CAP, HUD;

if (SC === 1) {            // ---------- HOOK: the spot arrives. Dark sanctum, devotees from behind ----------
  S.environmentIntensity = .06; hemi.intensity = .1; mGrade.uniforms.exp.value = 1.0; mGrade.uniforms.bloom.value = 1.1; spotL.intensity = 2.6; spotL.position.copy(NICHE).add(V(1.2, .3, 0)); AURA.material.opacity = .2; AURA.scale.set(.8, .85, 1);
  var back = new T.DirectionalLight(0xb9a6a0, .5); back.position.set(10, 6, 6); S.add(back);
  var lamp = new T.PointLight(0xff9a4a, .9, 6, 2); lamp.position.set(-7.3, 1.1, .1); S.add(lamp); cyl(.08, .12, .42, BRASS, -7.3, .7, -.1); var fl = new T.Mesh(new T.SphereGeometry(.04, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(6, 2.6, .8) })); fl.scale.y = 1.8; fl.position.set(-7.3, 1.0, -.1); S.add(fl);
  var dev = place(fig({ cloth: 0xefe6d4, legs: 0xe6dcc8, scarf: 0xf08a24 }), -5.7, .28, -.35, Math.PI + .2); namaste(dev);
  var d2 = place(fig({ cloth: 0xb9c4c9, legs: 0x6c5a4c }), -4.9, .28, -3.0, Math.PI - .2); namaste(d2);
  var d3 = place(fig({ cloth: 0xd9a7a0, legs: 0xd9d2c2 }), -4.4, .28, -2.2, Math.PI - .05); namaste(d3);
  crowd(6, -3.6, -1.6, -3.4, -2.0, .28, 40, Math.PI);
  cam.fov = 30; cam.position.set(3.6, 2.0, 2.2); cam.lookAt(-8.2, 1.25, -1.75); cam.updateProjectionMatrix();
  KICK = 'RAM NAVAMI · DOPAHAR 12 BAJE'; HEAD = 'Na bulb. Na taar.<br>Phir yeh <b>roshni</b><br>aayi kahan se?';
  HUD = [];
  SRC = 'reported · CSIR-CBRI Roorkee, 2024 · schematic model · idol not shown'; CAP = 'Mandir ke sabse andar, <span>sooraj</span> ki ek kiran.';
} else if (SC === 2) {     // ---------- THE PERISCOPE: cut-away section, real noon Sun ----------
  S.environmentIntensity = .5; hemi.intensity = .55; sun.intensity = 4.2; fill.intensity = .5; mGrade.uniforms.exp.value = 1.05; mGrade.uniforms.bloom.value = .7; spotL.intensity = 40;
  crowd(34, -.2, 14, -5.4, -.5, .28, 11, Math.PI); namaste(place(fig({ cloth: 0xefe6d4, legs: 0xe6dcc8, scarf: 0xf08a24 }), -4.2, .28, -1.4, Math.PI));
  var e1 = place(fig({ cloth: 0x2f6f8f, legs: 0x39424e, hat: 0xf2c230 }), 4.75, 12.28, -1.9, Math.PI + .25); e1.J.shR.rotation.z = 1.25; e1.J.elR.rotation.z = .35; e1.J.shL.rotation.z = .1;
  var e2 = place(fig({ cloth: 0xd8632a, legs: 0x39424e, hat: 0xf4f1e8 }), 1.3, 12.28, -3.6, -.2); e2.J.shL.rotation.z = 1.0; e2.J.elL.rotation.z = .7; e2.J.shR.rotation.z = .12;
  cam.fov = 30; var tg = V(2.7, 6.9, -3), dir = V(.3, .15, 1).normalize(); cam.position.copy(tg).addScaledVector(dir, 90); cam.lookAt(tg); cam.updateProjectionMatrix();
  KICK = 'ANDAR KA RAASTA'; HEAD = 'Teen manzil neeche,<br>ek <b>periscope</b>.';
  HUD = [['DATE', '17 APR 2024'], ['IST', '12:00'], ['SUN HEIGHT', '73.8°']];
  SRC = 'schematic model · not the temple\'s drawings · 4 mirrors + 4 lenses: reported · sun height: our calculation'; CAP = 'Pehla aaina kiran ko <span>uttar</span> ki taraf modta hai.';
} else {                   // ---------- THE FIX: one click of mirror 1 ----------
  S.environmentIntensity = .6; hemi.intensity = .55; sun.intensity = 2.4; fill.intensity = .4; mGrade.uniforms.exp.value = .92; mGrade.uniforms.bloom.value = .6;
  var kf = new T.DirectionalLight(0xffe6c4, 1.5); kf.position.set(14, 16, 4); kf.target.position.set(3.5, 13.5, -1.5); S.add(kf); S.add(kf.target);
  var te = place(fig({ cloth: 0x2f6f8f, legs: 0x39424e, hat: 0xf2c230 }), 4.42, 12.28, -.78, 2.2); te.J.shR.rotation.z = 1.3; te.J.elR.rotation.z = .25; te.J.shL.rotation.z = .3; te.J.elL.rotation.z = .6; te.J.tor.rotation.z = .12; te.J.head.rotation.z = .16;
  var as = place(fig({ cloth: 0xefe6d4, legs: 0x4a5560, hat: 0xf4f1e8 }), 2.5, 12.28, -.2, .9); as.J.shL.rotation.z = .9; as.J.elL.rotation.z = 1.2; as.J.shR.rotation.z = .9; as.J.elR.rotation.z = 1.2;
  var card = box(.02, .3, .4, new T.MeshStandardMaterial({ color: 0xf4ecd8, roughness: .8 }), 2.74, 13.42, -.52); card.rotation.y = .9;
  cam.fov = 30; var tg3 = V(3.3, 13.3, -1.6), dir3 = V(1, .32, .62).normalize(); cam.position.copy(tg3).addScaledVector(dir3, 12.5); cam.lookAt(tg3); cam.updateProjectionMatrix();
  KICK = 'SAAL MEIN EK BAAR'; HEAD = 'Ek aaina.<br><b>19</b> settings.<br>Haath se.';
  HUD = [['DATE', '6 APR 2025'], ['SUN HEIGHT', '69.4°'], ['SETTING', '2 / 19']];
  SRC = '19-year cycle, yearly manual shift of mirror 1: reported (PIB) · wheel form: illustrative · figures: illustrative'; CAP = 'Is saal sooraj <span>4.4°</span> neeche hai. Aaina thoda ghoomega.';
}
el('kick', '<i></i>' + KICK); el('head', HEAD); el('src', SRC, ''); el('cap', CAP);
if (HUD.length) el('hud', HUD.map(function (h) { return '<div><small>' + h[0] + '</small>' + h[1] + '</div>'; }).join(''));
render();
if (SC === 1) { tagAt(NICHE.clone().add(V(0, .16, 0)), '<small>the tilak</small>58 mm spot of sunlight', -40, -150, 'v'); tagAt(M4.clone().lerp(NICHE, .62), '<small>no electricity</small>one beam, from the roof', -120, 110); }
if (SC === 2) { tagAt(AP, '<small>roof</small>opening + heat filter glass', 50, -30); tagAt(M1, '<small>mirror 1</small>tilts once a year', -340, -30); tagAt(V(3, 9.8, -4.5), '<small>brass pipe</small>lenses squeeze the beam', 60, -20);
  tagAt(M4, '<small>mirror 4</small>turns it west', 60, -60); tagAt(NICHE, '<small>sanctum</small>the tilak lands here', 10, -150, 'v'); tagAt(V(4.75, 13.3, -1.9), '<small>engineers</small>clean and align by hand', 60, 20); }
if (SC === 3) { tagAt(V(3.93, 13.7, -1.9), '<small>setting wheel</small>19 notches, one per year', 30, -150); tagAt(M1.clone().add(V(0, .3, 0)), '<small>mirror 1</small>catches the noon Sun', -310, -95); tagAt(V(2.74, 13.5, -.52), '<small>astronomer\'s card</small>19 Sun angles', -260, -90); }
window.__ready = true;
})();
