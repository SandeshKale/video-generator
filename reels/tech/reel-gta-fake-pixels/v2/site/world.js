/* "Gali ka Game" — tilt-shift miniature mohalla at dusk. three.js r160 (+GLTFLoader). Pure function of t via window.__seek.
   Parts: a_engine (renderer, post: tilt-shift band + grade), b_world (mohalla), c_game (game city on the phone), d_scenes, e_main. */
(function () {
var T = THREE, W = 1080, H = 1920, B = window.B = {};
var clamp = B.clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a == null ? 0 : a, x)); };
B.lerp = function (a, b, t) { return a + (b - a) * t; };
B.eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
B.eo3 = function (x) { return 1 - Math.pow(1 - clamp(x), 3); };
B.eob = function (x) { x = clamp(x); var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
B.hsh = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
B.W = W; B.H = H;
// palette (meaning-coded): amber = real (drawn by the computer), pink = AI-made, chalk = the explanation
B.C = { real: '#ffb21e', ai: '#ff3f8e', chalk: '#fff7e6', ink: '#1b1d3a', sky: '#2a3a8c', peach: '#ff9d6e', thread: '#fff1b8' };

var R = B.R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false);
R.outputColorSpace = T.SRGBColorSpace; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;

var S = B.S = new T.Scene();
var cam = B.cam = new T.PerspectiveCamera(30, W / H, .03, 400);

B.cv = function (w, h, f) { var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'); f(g, w, h, c); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; t.userData = { c: c, g: g }; return t; };

// sky dome: deep blue zenith -> peach horizon (dusk), shared by env map
function skyMat(top, mid, hor) {
  return new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: { a: { value: new T.Color(top) }, b: { value: new T.Color(mid) }, c: { value: new T.Color(hor) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform vec3 a,b,c; varying vec3 vP; void main(){ float y = vP.y; vec3 col = y>0.18 ? mix(b,a,smoothstep(.18,.75,y)) : mix(c,b,smoothstep(-.05,.18,y)); gl_FragColor = vec4(col,1.); }' });
}
B.skyMat = skyMat;
var sky = new T.Mesh(new T.SphereGeometry(180, 32, 16), skyMat(0x16205e, 0x4a4fa8, 0xffa070)); S.add(sky); B.sky = sky;
var pm = new T.PMREMGenerator(R);
var envS = new T.Scene(); envS.add(new T.Mesh(new T.SphereGeometry(50, 32, 16), skyMat(0x2a3a8c, 0x6f78c8, 0xffb98a)));
S.environment = pm.fromScene(envS, 0.02).texture; S.environmentIntensity = .55;

// dusk light: low warm sun (cheated per shot), cool hemisphere fill with warm ground bounce
var sun = B.sun = new T.DirectionalLight(0xffc28a, 2.3); sun.position.set(-14, 9, 6); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
var sc = sun.shadow.camera; sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 50;
S.add(sun); S.add(sun.target);
var hemi = new T.HemisphereLight(0x8fa2ff, 0xffa36b, .75); S.add(hemi);

// ---------- GLTF props ----------
var LD = new T.GLTFLoader(), MODELS = B.MODELS = {}, pend = [];
B.loadModels = function (names) { names.forEach(function (n) { pend.push(LD.loadAsync('models/' + n + '.glb').then(function (g) { MODELS[n] = g.scene; })); }); return Promise.all(pend); };
B.prop = function (n, x, y, z, ry, s, par) {
  var o = MODELS[n].clone(true); o.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  o.position.set(x, y, z); o.rotation.y = ry || 0; if (s) o.scale.setScalar(s); (par || S).add(o); return o;
};

// ---------- post: scene RT -> horizontal blur -> vertical blur (tilt-shift band) -> grade ----------
var rtA = new T.WebGLRenderTarget(W, H, { samples: 4, type: T.HalfFloatType }),
    rtB = new T.WebGLRenderTarget(W, H, { type: T.HalfFloatType }), rtC = new T.WebGLRenderTarget(W, H, { type: T.HalfFloatType });
var pq = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), pS = new T.Scene(), quad = new T.Mesh(new T.PlaneGeometry(2, 2)); pS.add(quad);
var VS = 'varying vec2 vU; void main(){ vU = uv; gl_Position = vec4(position.xy,0.,1.); }';
var blurFS = 'uniform sampler2D tex; uniform vec2 dir; uniform float band, wid, amp; varying vec2 vU;' +
  'float coc(float y){ float d = abs(y-band); return amp*pow(max(0., d-wid)/0.5, 1.25); }' +
  'void main(){ float r = coc(vU.y); vec4 s = vec4(0.); float tw = 0.;' +
  ' for(int i=-8;i<=8;i++){ float f = float(i)/8.; float w = exp(-f*f*2.2); s += texture2D(tex, vU + dir*f*r)*w; tw += w; }' +
  ' gl_FragColor = s/tw; }';
var mBlur = new T.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new T.Vector2() }, band: { value: .5 }, wid: { value: .1 }, amp: { value: 26 } }, vertexShader: VS, fragmentShader: blurFS, depthTest: false });
var gradeFS = 'uniform sampler2D tex; uniform float sat, vig, t, fade, exposure; uniform vec3 fadeC; varying vec2 vU;' +
  'float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }' +
  'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }' +
  'void main(){ vec3 c = texture2D(tex, vU).rgb*exposure; c = aces(c); c = pow(c, vec3(1./2.2)); float l = dot(c, vec3(.2126,.7152,.0722)); c = mix(vec3(l), c, sat);' +
  ' c = c*c*(3.-2.*c)*.25 + c*.75; vec2 q = vU-.5; c *= 1. - vig*dot(q*vec2(1.,.8), q*vec2(1.,.8))*1.6;' +
  ' c += (h(vU*vec2(1080.,1920.) + t*61.) - .5)*.018; c = mix(c, fadeC, fade); gl_FragColor = vec4(c,1.); }';
var mGrade = new T.ShaderMaterial({ uniforms: { tex: { value: null }, sat: { value: 1.22 }, vig: { value: .55 }, t: { value: 0 }, fade: { value: 0 }, exposure: { value: .82 }, fadeC: { value: new T.Color(0x0e1230) } }, vertexShader: VS, fragmentShader: gradeFS, depthTest: false });
mGrade.toneMapped = false;
// tilt-shift band: y in uv (0 bottom), half-width, blur amplitude in px
B.TS = { band: .5, wid: .09, amp: 26, sat: 1.22, fade: 0, exp: .82 };
B.render = function (t) {
  R.setRenderTarget(rtA); R.render(S, cam);
  var px = B.TS.amp / W, py = B.TS.amp / H;
  mBlur.uniforms.band.value = B.TS.band; mBlur.uniforms.wid.value = B.TS.wid; mBlur.uniforms.amp.value = 1;
  quad.material = mBlur; mBlur.uniforms.tex.value = rtA.texture; mBlur.uniforms.dir.value.set(px, 0); R.setRenderTarget(rtB); R.render(pS, pq);
  mBlur.uniforms.tex.value = rtB.texture; mBlur.uniforms.dir.value.set(0, py); R.setRenderTarget(rtC); R.render(pS, pq);
  quad.material = mGrade; mGrade.uniforms.tex.value = rtC.texture; mGrade.uniforms.t.value = t; mGrade.uniforms.sat.value = B.TS.sat; mGrade.uniforms.fade.value = B.TS.fade; mGrade.uniforms.exposure.value = B.TS.exp;
  R.setRenderTarget(null); R.render(pS, pq);
};
// world point -> screen px (for anchoring DOM labels)
var v3 = new T.Vector3();
B.toScr = function (p) { cam.updateMatrixWorld(); v3.copy(p).project(cam); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H, z: v3.z }; };
// band follows a world point: set band to its screen y
B.bandOn = function (p, wid, amp) { var s = B.toScr(p); B.TS.band = 1 - s.y / H; if (wid != null) B.TS.wid = wid; if (amp != null) B.TS.amp = amp; };
// camera helper: position + target
B.look = function (px, py, pz, tx, ty, tz, fov) { cam.position.set(px, py, pz); cam.lookAt(tx, ty, tz); if (fov) { cam.fov = fov; cam.updateProjectionMatrix(); } };
})();
/* b_world: the mohalla (lane + chowk) at dusk, built procedurally + real GLB props */
(function () {
var T = THREE, S = B.S, cv = B.cv, hsh = B.hsh;
var W = B.WORLD = new T.Group(); S.add(W);
function std(c, r, m, e, ei) { return new T.MeshStandardMaterial({ color: c, roughness: r == null ? .85 : r, metalness: m || 0, emissive: e || 0, emissiveIntensity: ei == null ? 1 : ei }); }
B.std = std;
function box(w, h, d, mat, x, y, z, par) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; (par || W).add(o); return o; }
B.box = box;
function cyl(rt, rb, h, mat, x, y, z, seg, par) { var o = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg || 24), mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; (par || W).add(o); return o; }
B.cyl = cyl;

// ---- ground: stone-slab lane with drains, dusty chowk ----
var slab = cv(1024, 1024, function (g, w, h) {
  g.fillStyle = '#8f8a86'; g.fillRect(0, 0, w, h);
  for (var r = 0; r < 8; r++) for (var c = 0; c < 4; c++) { var k = hsh(r * 9 + c); g.fillStyle = 'hsl(' + (20 + k * 20) + ',' + (8 + k * 8) + '%,' + (50 + k * 10) + '%)'; g.fillRect(c * 256 + 4 + (r % 2) * 60, r * 128 + 4, 248, 120); }
  for (var i = 0; i < 2500; i++) { g.fillStyle = 'rgba(40,30,30,' + (hsh(i) * .12) + ')'; g.fillRect(hsh(i * 3) * w, hsh(i * 7) * h, 3, 3); }
});
slab.wrapS = slab.wrapT = T.RepeatWrapping; slab.repeat.set(2, 10);
var lane = new T.Mesh(new T.PlaneGeometry(4.4, 24), new T.MeshStandardMaterial({ map: slab, roughness: .9 })); lane.rotation.x = -Math.PI / 2; lane.position.set(0, 0, -2); lane.receiveShadow = true; W.add(lane);
var dust = new T.Mesh(new T.PlaneGeometry(60, 60), std(0xb08a6a, .95)); dust.rotation.x = -Math.PI / 2; dust.position.set(0, -.01, -10); dust.receiveShadow = true; W.add(dust);
[-2.25, 2.25].forEach(function (x) { box(.18, .06, 24, std(0x4b4a52, .7), x, .03, -2); });

// ---- houses: plastered blocks in saturated paint, windows, balconies, water tanks, parapets ----
var PAINT = [0x2ec4b6, 0xff6f91, 0xffd23f, 0x5aa9ff, 0x9b7bff, 0xff9248, 0x56d68c, 0xf7f0e3];
function winTex(lit) { return cv(128, 160, function (g, w, h) { g.fillStyle = lit ? '#ffcf7a' : '#1d2440'; g.fillRect(0, 0, w, h); if (lit) { var gr = g.createRadialGradient(64, 60, 4, 64, 80, 90); gr.addColorStop(0, '#fff2c8'); gr.addColorStop(1, '#ff9c3c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } g.fillStyle = '#2b2b33'; for (var i = 1; i < 5; i++) g.fillRect(i * w / 5 - 2, 0, 4, h); g.fillRect(0, h / 2 - 2, w, 4); }); }
var WIN = [winTex(false), winTex(true)];
B.houses = [];
function house(side, z0, len, dep, flo, col, seed, opt) {
  opt = opt || {};
  var g = new T.Group(), fh = 3.1, h = flo * fh, xf = side * 2.25; // facade plane x
  var mW = std(col, .92), mT = std(new T.Color(col).multiplyScalar(.75), .9);
  box(dep, h, len, mW, xf + side * dep / 2, h / 2, z0, g);
  box(dep + .1, .35, len + .1, mT, xf + side * dep / 2, h + .17, z0, g); // parapet
  box(.06, .25, len, std(0xf3ead8, .8), xf + side * .03, fh - .1, z0, g); // floor band
  var nW = Math.max(1, Math.round(len / 2.2));
  for (var f = 0; f < flo; f++) for (var i = 0; i < nW; i++) {
    var z = z0 - len / 2 + (i + .5) * len / nW, y = f * fh + (f === 0 ? 1.35 : 1.6), lit = hsh(seed + f * 7 + i) > .45;
    if (f === 0 && i === opt.door) { box(.08, 2.1, 1.0, std(0x6b3b22, .7), xf + side * .02, 1.05, z, g); box(.04, 2.3, 1.2, std(0xf3ead8, .8), xf + side * .01, 1.15, z, g); continue; }
    if (f === 0 && opt.shutter === i) { var sh = cv(256, 256, function (gg, w, hh) { gg.fillStyle = '#9aa3ad'; gg.fillRect(0, 0, w, hh); for (var k = 0; k < 32; k++) { gg.fillStyle = k % 2 ? '#7f8892' : '#b3bcc5'; gg.fillRect(0, k * 8, w, 4); } }); box(.06, 2.3, 1.7, new T.MeshStandardMaterial({ map: sh, roughness: .6, metalness: .3 }), xf + side * .02, 1.15, z, g); continue; }
    box(.05, 1.25, .95, std(0xf3ead8, .8), xf + side * .02, y, z, g); // frame
    var gl = new T.Mesh(new T.PlaneGeometry(.8, 1.05), new T.MeshStandardMaterial({ map: WIN[lit ? 1 : 0], emissive: 0xffffff, emissiveMap: WIN[lit ? 1 : 0], emissiveIntensity: lit ? .9 : 0, roughness: .3 }));
    gl.position.set(xf + side * .05 * -1 + side * .1, y, z); gl.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(gl);
    box(.18, .06, 1.05, std(0xf3ead8, .8), xf - side * .06, y - .66, z, g); // sill
    if (f > 0 && hsh(seed + i * 3 + f) > .5) { // balcony + railing
      box(.8, .1, 1.5, std(0xe8e0d0, .8), xf - side * .4, y - .78, z, g);
      for (var k = 0; k < 7; k++) box(.03, .55, .03, std(0x2a2a33, .5, .6), xf - side * .78, y - .48, z - .7 + k * .233, g);
      box(.04, .04, 1.5, std(0x2a2a33, .5, .6), xf - side * .78, y - .2, z, g);
    }
  }
  // black water tank on the roof (Indian rooftop) + pipe
  if (!opt.noTank) { var tx = xf + side * (dep * .55), tz = z0 + (hsh(seed) - .5) * len * .4; cyl(.45, .5, .9, std(0x16161a, .45), tx, h + .8, tz, 20, g); box(.95, .35, .95, std(0x9a9488, .9), tx, h + .17 + .18, tz, g); }
  W.add(g); B.houses.push(g); return g;
}
// left (side -1) and right (side +1) of the lane, front (z+) to the chowk (z-)
house(-1, 3.6, 4.2, 5, 2, PAINT[0], 11, { shutter: 0 });
house(-1, -.9, 4.8, 5, 3, PAINT[2], 23, { door: 1 });
house(-1, -5.6, 4.6, 5, 2, PAINT[1], 37, { door: 0 });
house(1, 4.1, 3.2, 5, 3, PAINT[3], 41, {});
house(1, .3, 4.4, 5, 2, PAINT[6], 53, { door: 1 });
house(1, -4.4, 5.0, 5, 3, PAINT[4], 67, { shutter: 1 });
// chowk back walls (behind the well)
var back = [[-6, -15.5, 5, PAINT[6], 2], [-1, -16, 5, PAINT[1], 1], [4.5, -15.5, 5, PAINT[3], 2]];
back.forEach(function (q, i) { var mW = std(q[3], .92); var hgt = q[4] * 3.1; box(q[2], hgt, 3, mW, q[0], hgt / 2, q[1], W);
  for (var f = 0; f < q[4]; f++) for (var k = 0; k < 2; k++) { var lit = hsh(i * 9 + f * 3 + k) > .4; var gl = new T.Mesh(new T.PlaneGeometry(.8, 1.05), new T.MeshStandardMaterial({ map: WIN[lit ? 1 : 0], emissive: 0xffffff, emissiveMap: WIN[lit ? 1 : 0], emissiveIntensity: lit ? 1 : 0 })); gl.position.set(q[0] - 1.2 + k * 2.4, f * 3.1 + 1.6, q[1] + 1.52); W.add(gl); }
  cyl(.45, .5, .9, std(0x16161a, .45), q[0] + 1, hgt + .45, q[1], 20, W); });
// side walls closing the chowk
box(3, 6.2, 9, std(PAINT[0], .92), -7, 3.1, -11.5); box(3, 6.2, 9, std(PAINT[2], .92), 7, 3.1, -11.5);

// ---- overhead electric wires (catenary) ----
function wire(a, b, sag, col) { var pts = []; for (var i = 0; i <= 24; i++) { var u = i / 24, p = new T.Vector3().lerpVectors(a, b, u); p.y -= sag * 4 * u * (1 - u); pts.push(p); } var m = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, .012, 4), std(col || 0x15151a, .6)); W.add(m); return m; }
[[-2.25, 6.6, 4, 2.25, 6.4, 3], [-2.25, 6.9, 1, 2.25, 6.2, 2.5], [-2.25, 6.3, -2, 2.25, 6.8, -1.2], [-2.25, 6.5, -4.6, 2.25, 6.6, -3.2], [-2.25, 6.2, 2, 2.25, 6.6, -2]].forEach(function (q, i) { wire(new T.Vector3(q[0], q[1], q[2]), new T.Vector3(q[3], q[4], q[5]), .45 + i * .08); });
// festive bulb string over the chowk
B.bulbs = [];
(function () { var a = new T.Vector3(-5.5, 5, -9), b = new T.Vector3(5.5, 5.2, -9.4); for (var i = 0; i < 18; i++) { var u = (i + .5) / 18, p = new T.Vector3().lerpVectors(a, b, u); p.y -= 1.0 * 4 * u * (1 - u); var bb = new T.Mesh(new T.SphereGeometry(.06, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(['#ffd76a', '#ff6fa8', '#7fe0ff', '#9dff8a'][i % 4]).multiplyScalar(2.2), toneMapped: false })); bb.position.copy(p); W.add(bb); B.bulbs.push(bb); } wire(a, b, 1.0); })();

// ---- moon (for the well) ----
var moonTex = cv(256, 256, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, '#fffbe8'); gr.addColorStop(.62, '#fff3cc'); gr.addColorStop(.7, 'rgba(255,240,200,.35)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(200,190,160,.35)'; [[100, 110, 18], [150, 90, 12], [140, 150, 22]].forEach(function (c) { g.beginPath(); g.arc(c[0], c[1], c[2], 0, 7); g.fill(); }); });
var moon = B.moon = new T.Mesh(new T.PlaneGeometry(9, 9), new T.MeshBasicMaterial({ map: moonTex, transparent: true, depthWrite: false, toneMapped: false, color: new T.Color(1.6, 1.6, 1.5) }));
moon.position.set(-14, 34, -70); moon.lookAt(0, 1, 0); S.add(moon);

// ---- the well (chowk centre) ----
var WELL = B.WELL = new T.Group(); WELL.position.set(.4, 0, -11.2); W.add(WELL);
var wTex = cv(512, 128, function (g, w, h) { g.fillStyle = '#f2ece0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8402e'; g.fillRect(0, h * .62, w, h * .14); for (var i = 0; i < 400; i++) { g.fillStyle = 'rgba(120,100,80,' + hsh(i) * .15 + ')'; g.fillRect(hsh(i * 3) * w, hsh(i * 5) * h, 4, 2); } });
var ring = new T.Mesh(new T.CylinderGeometry(1.0, 1.05, .85, 40, 1, true), new T.MeshStandardMaterial({ map: wTex, roughness: .9, side: T.DoubleSide })); ring.position.y = .425; ring.castShadow = ring.receiveShadow = true; WELL.add(ring);
var lip = new T.Mesh(new T.TorusGeometry(1.02, .09, 8, 40), std(0xe9e2d4, .85)); lip.rotation.x = Math.PI / 2; lip.position.y = .86; lip.castShadow = true; WELL.add(lip);
var inner = new T.Mesh(new T.CylinderGeometry(.93, .93, .8, 40, 1, true), std(0x2b2622, .95)); inner.material.side = T.BackSide; inner.position.y = .42; WELL.add(inner);
var waterTex = cv(512, 512, function (g, w, h) { g.fillStyle = '#0c1430'; g.fillRect(0, 0, w, h); var gr = g.createRadialGradient(w * .42, h * .4, 4, w * .42, h * .4, 70); gr.addColorStop(0, '#fffbe6'); gr.addColorStop(.45, '#fff2c0'); gr.addColorStop(.6, 'rgba(255,240,190,.3)'); gr.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(160,190,255,.25)'; g.lineWidth = 2; for (var r = 1; r < 6; r++) { g.beginPath(); g.ellipse(w * .42, h * .4, 40 + r * 34, 30 + r * 26, 0, 0, 7); g.stroke(); } });
var water = B.water = new T.Mesh(new T.CircleGeometry(.93, 40), new T.MeshBasicMaterial({ map: waterTex, toneMapped: false })); water.rotation.x = -Math.PI / 2; water.position.y = .62; WELL.add(water);
// pulley frame + bucket
[-1, 1].forEach(function (s) { box(.12, 1.6, .12, std(0x5a3a22, .8), s * .95, 1.2, 0, WELL); });
box(2.1, .12, .12, std(0x5a3a22, .8), 0, 2.0, 0, WELL);
var pul = new T.Mesh(new T.TorusGeometry(.13, .035, 8, 20), std(0x3a3a40, .4, .7)); pul.position.set(0, 1.86, 0); WELL.add(pul);
var rope = new T.Mesh(new T.CylinderGeometry(.008, .008, 1.0, 5), std(0xc9a46a, .9)); rope.position.set(.13, 1.36, 0); WELL.add(rope);
var bucket = new T.Mesh(new T.CylinderGeometry(.16, .12, .24, 16), std(0x9aa0a8, .35, .8)); bucket.position.set(.13, .98, 0); bucket.castShadow = true; WELL.add(bucket);
B.wellPick = [ring, lip, water, bucket];

// ---- the jaali: freestanding carved sandstone screen at the chowk mouth ----
var J = B.JAALI = new T.Group(); J.position.set(0, 0, -7.4); W.add(J);
var JN = B.JN = 8, JS = 1.7; B.JS_HALF = JS / 2 + .02; var jc = JS / JN, jh = jc * .66;
(function () {
  var sh = new T.Shape(); sh.moveTo(-JS / 2 - .12, -JS / 2 - .12); sh.lineTo(JS / 2 + .12, -JS / 2 - .12); sh.lineTo(JS / 2 + .12, JS / 2 + .12); sh.lineTo(-JS / 2 - .12, JS / 2 + .12); sh.lineTo(-JS / 2 - .12, -JS / 2 - .12);
  for (var r = 0; r < JN; r++) for (var c = 0; c < JN; c++) { var cx = -JS / 2 + (c + .5) * jc, cy = -JS / 2 + (r + .5) * jc, hh = new T.Path(), q = jh / 2, k = q * .35;
    hh.moveTo(cx - q + k, cy - q); hh.lineTo(cx + q - k, cy - q); hh.quadraticCurveTo(cx + q, cy - q, cx + q, cy - q + k); hh.lineTo(cx + q, cy + q - k); hh.quadraticCurveTo(cx + q, cy + q, cx + q - k, cy + q); hh.lineTo(cx - q + k, cy + q); hh.quadraticCurveTo(cx - q, cy + q, cx - q, cy + q - k); hh.lineTo(cx - q, cy - q + k); hh.quadraticCurveTo(cx - q, cy - q, cx - q + k, cy - q); sh.holes.push(hh); }
  var stTex = cv(512, 512, function (g, w, h) { g.fillStyle = '#d8915a'; g.fillRect(0, 0, w, h); for (var i = 0; i < 3000; i++) { g.fillStyle = 'rgba(' + (hsh(i) > .5 ? '255,220,170' : '120,60,30') + ',' + hsh(i * 3) * .18 + ')'; g.fillRect(hsh(i * 5) * w, hsh(i * 7) * h, 3, 2); } });
  stTex.wrapS = stTex.wrapT = T.RepeatWrapping; stTex.repeat.set(1.2, 1.2);
  var geo = new T.ExtrudeGeometry(sh, { depth: .09, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 2, curveSegments: 4 });
  var m = new T.Mesh(geo, new T.MeshStandardMaterial({ map: stTex, roughness: .88, color: 0xffffff })); m.position.set(0, 1.45, -.045); m.castShadow = m.receiveShadow = true; J.add(m); B.jaaliMesh = m;
  box(JS + .5, .6, .4, std(0xc47c48, .9), 0, .3, 0, J); // plinth
  box(JS + .55, .14, .3, std(0xc47c48, .9), 0, 1.45 + JS / 2 + .2, 0, J); // top cornice
  [-1, 1].forEach(function (s) { box(.18, JS + .5, .26, std(0xc47c48, .9), s * (JS / 2 + .2), 1.45, 0, J); });
})();
// one flat-colour "pixel" tile inside every hole (invisible until its thread arrives)
B.jPix = [];
for (var r = 0; r < JN; r++) for (var c = 0; c < JN; c++) {
  var pm = new T.Mesh(new T.PlaneGeometry(jh * .98, jh * .98), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false }));
  pm.position.set(-JS / 2 + (c + .5) * jc, 1.45 - JS / 2 + (r + .5) * jc, .0); J.add(pm); B.jPix.push({ m: pm, r: r, c: c });
}

// ---- rangoli doorstep (in front of the right house's door) ----
B.RANG = new T.Group(); B.RANG.position.set(1.15, .006, .3); W.add(B.RANG);

// ---- chai stall (left, front) ----
var STALL = B.STALL = new T.Group(); STALL.position.set(-1.55, 0, 2.6); W.add(STALL);
box(1.3, .95, 2.4, std(0x8a5a32, .75), 0, .475, 0, STALL); // wooden counter
box(1.4, .06, 2.5, std(0x5e3a1e, .6), 0, .98, 0, STALL);
var tarpT = cv(256, 256, function (g, w, h) { for (var i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#1f6fd6' : '#ff8a1f'; g.fillRect(0, i * 32, w, 32); } });
var tarp = new T.Mesh(new T.PlaneGeometry(1.7, 2.6), new T.MeshStandardMaterial({ map: tarpT, roughness: .8, side: T.DoubleSide })); tarp.position.set(.25, 2.6, 0); tarp.rotation.set(0, Math.PI / 2, 0); tarp.rotateX(-.35); tarp.castShadow = true; STALL.add(tarp);
[[-.6, 1.2], [-.6, -1.2], [1.1, 1.2], [1.1, -1.2]].forEach(function (p) { box(.05, 2.4, .05, std(0x3b3b44, .5, .5), p[0], 1.2, p[1], STALL); });
var bulb = new T.Mesh(new T.SphereGeometry(.07, 12, 10), new T.MeshBasicMaterial({ color: new T.Color(3, 2.4, 1.4), toneMapped: false })); bulb.position.set(.35, 2.05, 0); STALL.add(bulb);
var bl = new T.PointLight(0xffb060, 6, 6, 1.6); bl.position.set(.35, 1.95, 0); STALL.add(bl);
var bench = box(.4, .45, 1.6, std(0x6b4426, .8), 1.2, .225, -.2, STALL);
// glass jars of biscuits on the counter
for (var i = 0; i < 3; i++) { var jar = new T.Mesh(new T.CylinderGeometry(.09, .09, .22, 16), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .05, transmission: .7, thickness: .05 })); jar.position.set(-.3, 1.12, -.9 + i * .22); STALL.add(jar); var bis = new T.Mesh(new T.CylinderGeometry(.075, .075, .14, 12), std(['#e0a050', '#d8604a', '#f0d070'][i], .8)); bis.position.set(-.3, 1.08, -.9 + i * .22); STALL.add(bis); }
B.placeProps = function () {
  B.prop('tea_set_01', -.05, 1.01, .35, Math.PI / 2, 1, STALL);
  B.prop('vintage_electric_kettle', -.2, 1.01, -.35, .4, 1.1, STALL);
  B.prop('brass_pot_01', .15, 1.01, -.65, 0, 1, STALL);
  B.prop('brass_pot_02', .3, 1.01, .85, 0, 1, STALL);
  B.prop('plastic_crate_02', .9, 0, 1.25, .3, 1, STALL);
  B.prop('plastic_crate_03', .95, .25, 1.2, -.2, 1, STALL);
  B.prop('barrel_03', -2.6, 0, -3.2, .4, .85);
  B.prop('utility_box_02', 2.42, 0, 1.9, -Math.PI / 2, .9);
  B.prop('wicker_basket_01', 1.9, .0, -1.6, .5, 1.2);
  B.prop('delivery_scooter', -1.5, 0, -2.6, .25, .9);
  var lamps = [[-2.2, 3.0, -3.2, Math.PI / 2], [2.2, 3.0, -1.4, -Math.PI / 2], [-2.2, 3.0, -7.2, Math.PI / 2]];
  lamps.forEach(function (q) { B.prop('street_lamp_02', q[0], q[1], q[2], q[3], 1); var pl = new T.PointLight(0xffb870, 5, 7, 1.7); pl.position.set(q[0] + (q[0] > 0 ? -.55 : .55), q[1] + 1.2, q[2]); W.add(pl); var g = new T.Mesh(new T.SphereGeometry(.09, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(3, 2.3, 1.3), toneMapped: false })); g.position.copy(pl.position); g.position.y -= .1; W.add(g); });
};

// ---- voxel figures (blocky, faceless) ----
B.voxel = function (o) {
  o = o || {}; var s = o.s || 1, g = new T.Group(), P = {};
  var mSkin = std(o.skin || 0xb57a52, .8), mTop = std(o.top || 0xffd23f, .8), mBot = std(o.bot || 0x2f4fa8, .8), mHair = std(o.hair || 0x1a1412, .9), mShoe = std(0x22222a, .7);
  function part(w, h, d, m, x, y, z, par) { var b = new T.Mesh(new T.BoxGeometry(w * s, h * s, d * s), m); b.position.set(x * s, y * s, z * s); b.castShadow = true; b.receiveShadow = true; (par || g).add(b); return b; }
  function pivot(x, y, z) { var p = new T.Group(); p.position.set(x * s, y * s, z * s); g.add(p); return p; }
  P.legL = pivot(-.09, .62, 0); part(.15, .56, .17, mBot, 0, -.28, 0, P.legL); part(.16, .08, .24, mShoe, 0, -.58, .03, P.legL);
  P.legR = pivot(.09, .62, 0); part(.15, .56, .17, mBot, 0, -.28, 0, P.legR); part(.16, .08, .24, mShoe, 0, -.58, .03, P.legR);
  P.torso = part(.36, .48, .22, mTop, 0, .86, 0);
  P.armL = pivot(-.23, 1.06, 0); part(.11, .44, .13, mTop, 0, -.12, 0, P.armL); part(.1, .14, .11, mSkin, 0, -.38, 0, P.armL);
  P.armR = pivot(.23, 1.06, 0); part(.11, .44, .13, mTop, 0, -.12, 0, P.armR); part(.1, .14, .11, mSkin, 0, -.38, 0, P.armR);
  P.head = pivot(0, 1.12, 0); part(.3, .3, .28, mSkin, 0, .17, 0, P.head); part(.32, .1, .3, mHair, 0, .34, -.01, P.head); part(.32, .2, .08, mHair, 0, .24, -.13, P.head);
  g.userData.P = P; g.userData.s = s; return g;
};
var kid = B.KID = B.voxel({ s: 1.12, top: 0xffd23f, bot: 0x2f4fa8, skin: 0xa86f48 }); kid.position.set(.45, 0, 1.9); kid.rotation.y = Math.PI * .92; W.add(kid);
// phone held in both hands, landscape
var KP = kid.userData.P; KP.armL.rotation.set(-1.42, 0, .42); KP.armR.rotation.set(-1.42, 0, -.42); KP.head.rotation.x = .15;
var phone = B.PHONE = new T.Group(); phone.position.set(0, 1.06 * 1.12, .46 * 1.12); phone.rotation.set(.8, Math.PI, 0); kid.add(phone);
var pBody = new T.Mesh(new T.BoxGeometry(.165, .078, .009), std(0x15151c, .3, .6)); phone.add(pBody);
B.phoneScreen = new T.Mesh(new T.PlaneGeometry(.152, .07), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); B.phoneScreen.position.z = .0047; phone.add(B.phoneScreen);
})();
/* b2_props: scene props for the full build — phone pixel shader, thread spools, wall clock, hoarding + scaffold + painter, flip-book, console vs PC */
(function () {
var T = THREE, S = B.S, W = B.WORLD, std = B.std, box = B.box, cyl = B.cyl, cv = B.cv, hsh = B.hsh, C = B.C;

// ---- phone screen: game texture with optional pixelation + grid (pixel = one hole of the jaali) ----
B.phoneMat = new T.ShaderMaterial({
  uniforms: { map: { value: null }, blocks: { value: new T.Vector2(0, 0) }, grid: { value: 0 }, dim: { value: 1 } },
  vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform sampler2D map; uniform vec2 blocks; uniform float grid, dim; varying vec2 vU;' +
    'void main(){ vec2 uv = vU; vec2 f = vec2(.5); if (blocks.x > .5) { uv = (floor(vU*blocks)+.5)/blocks; f = fract(vU*blocks); }' +
    ' vec3 c = texture2D(map, uv).rgb*dim; float e = min(min(f.x,1.-f.x)*blocks.x, min(f.y,1.-f.y)*blocks.y)/max(1.,blocks.x/40.);' +
    ' c = mix(c, vec3(.02,.02,.05), grid*(1.-smoothstep(.0,.08,min(min(f.x,1.-f.x), min(f.y,1.-f.y))))); gl_FragColor = vec4(c,1.); }'
});
B.phoneScreen.material = B.phoneMat;

// ---- thread spools that rain into the lane (instanced; positions are a pure function of t) ----
var NSP = B.NSP = 520, spG = new T.CylinderGeometry(.075, .075, .13, 14); spG.rotateZ(Math.PI / 2);
spG.scale(1.6, 1.6, 1.6); var spM = new T.MeshStandardMaterial({ roughness: .7 }), SP = B.SPOOLS = new T.InstancedMesh(spG, spM, NSP); SP.castShadow = SP.receiveShadow = true; S.add(SP);
var SPC = ['#ffb21e', '#fff1b8', '#ff3f8e', '#2ec4b6', '#5aa9ff', '#ffd23f'], cols = [];
B.SPD = [];
for (var i = 0; i < NSP; i++) {
  var x = -1.9 + hsh(i * 1.3) * 3.8, z = -1.2 + hsh(i * 2.7) * 4.6, layer = Math.floor(i / 70);
  B.SPD.push({ x: x, z: z, y: .12 + layer * .2 + hsh(i * 5.1) * .03, ry: hsh(i * 9.9) * 6.28, d: hsh(i * 4.4) });
  SP.setColorAt(i, new T.Color(SPC[i % SPC.length]));
}
SP.instanceColor.needsUpdate = true; SP.visible = false;
var m4 = new T.Matrix4(), q4 = new T.Quaternion(), e4 = new T.Euler(), v4 = new T.Vector3(), s4 = new T.Vector3(1, 1, 1);
// u in [0,1]: share of spools that have landed (they drop from above in order)
B.spoolsAt = function (u, t) {
  for (var i = 0; i < NSP; i++) {
    var d = B.SPD[i], ti = i / NSP, k = B.clamp((u - ti) / .07), y = k >= 1 ? d.y : d.y + 7 * (1 - k * k);
    e4.set(k < 1 ? t * 6 + i : 0, d.ry, 0); q4.setFromEuler(e4); v4.set(d.x, k > 0 ? y : -5, d.z); m4.compose(v4, q4, s4); SP.setMatrixAt(i, m4);
  }
  SP.instanceMatrix.needsUpdate = true;
};

// ---- wall clock on the yellow house (for "Cars: 17 ghante / tasveer") ----
var CLK = B.CLOCK = new T.Group(); CLK.position.set(-2.18, 4.15, -1.0); CLK.rotation.y = Math.PI / 2; W.add(CLK);
var face = cv(512, 512, function (g, w, h) { g.fillStyle = '#fff7e6'; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = '#1b1d3a'; g.lineWidth = 18; g.stroke();
  g.fillStyle = '#1b1d3a'; g.font = '700 64px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (var k = 1; k <= 12; k++) { var a = k / 12 * Math.PI * 2; g.fillText(String(k), 256 + Math.sin(a) * 190, 256 - Math.cos(a) * 190); } });
var cf = new T.Mesh(new T.CircleGeometry(.55, 48), new T.MeshStandardMaterial({ map: face, roughness: .6 })); cf.position.z = .05; CLK.add(cf);
var rim = new T.Mesh(new T.TorusGeometry(.56, .045, 10, 48), std(0xc8402e, .5)); rim.position.z = .05; CLK.add(rim);
var back = cyl(.58, .58, .08, std(0x3a2a22, .6), 0, 0, 0, 40, CLK); back.rotation.x = Math.PI / 2;
B.hHour = new T.Group(); B.hMin = new T.Group(); B.hHour.position.z = B.hMin.position.z = .07; CLK.add(B.hHour); CLK.add(B.hMin);
box(.04, .3, .02, std(0x1b1d3a, .5), 0, .14, 0, B.hHour); box(.03, .44, .02, std(0xff3f8e, .5), 0, .21, .01, B.hMin);
B.clockAt = function (hours) { B.hMin.rotation.z = -hours * Math.PI * 2; B.hHour.rotation.z = -hours / 12 * Math.PI * 2; };

// ---- cinema hoarding (portrait poster) on bamboo scaffolding, chowk left wall ----
var HD = B.HOARD = new T.Group(); HD.position.set(-5.42, 0, -11.6); HD.rotation.y = Math.PI / 2; W.add(HD);
var PW = 2.6, PH = 3.64, PY = 2.75;
var poster = B.posterTex = cv(600, 840, function (g, w, h) { g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h); });
var pm = new T.Mesh(new T.PlaneGeometry(PW, PH), new T.MeshStandardMaterial({ map: poster, roughness: .85 })); pm.position.set(0, PY, .04); pm.receiveShadow = true; HD.add(pm);
box(PW + .2, PH + .2, .06, std(0x2a2a33, .5, .4), 0, PY, 0, HD); // frame
[-1, 1].forEach(function (s) { box(.08, PY + PH / 2 + .3, .08, std(0x2a2a33, .5, .4), s * (PW / 2 + .05), (PY + PH / 2 + .3) / 2, -.05, HD); });
var bamboo = std(0xc9a25a, .7);
[-1.55, 1.55].forEach(function (x) { cyl(.035, .035, 5.2, bamboo, x, 2.6, .75, 8, HD); });
[.75, 2.05, 3.35].forEach(function (y) { var c = cyl(.03, .03, 3.4, bamboo, 0, y, .75, 8, HD); c.rotation.z = Math.PI / 2; box(3.3, .05, .38, std(0x8a6a3a, .8), 0, y + .05, .6, HD); });
// the small photo clipped to the scaffold (what the painter copies)
var small = B.smallTex = cv(120, 168, function (g, w, h) { g.fillStyle = '#ccc'; g.fillRect(0, 0, w, h); });
small.magFilter = T.NearestFilter; small.minFilter = T.NearestFilter;
var sp = B.smallPhoto = new T.Mesh(new T.PlaneGeometry(.42, .59), new T.MeshBasicMaterial({ map: small, toneMapped: false, color: new T.Color(.95, .95, .95) })); sp.position.set(-1.0, 1.25, .95); sp.rotation.y = .2; HD.add(sp);
box(.5, .67, .02, std(0xfff7e6, .7), -1.0, 1.25, .935, HD).rotation.y = .2;
var PAINTER = B.PAINTER = B.voxel({ s: 1.0, top: 0x2ec4b6, bot: 0x3a3a48, skin: 0x8a5a3a, hair: 0xf3ead8 }); HD.add(PAINTER); PAINTER.rotation.y = Math.PI;
var brush = new T.Mesh(new T.BoxGeometry(.05, .3, .05), std(0x8a5a32, .7)); brush.position.set(0, -.5, 0); PAINTER.userData.P.armR.add(brush);
var tip = new T.Mesh(new T.BoxGeometry(.07, .08, .07), std(0xff3f8e, .5)); tip.position.set(0, -.67, 0); PAINTER.userData.P.armR.add(tip);
B.HD_PW = PW; B.HD_PH = PH; B.HD_PY = PY;

// ---- flip-book: an exercise "copy" on the stall bench, its corner pages flip (rough.js drawings) ----
var FB = B.FLIP = new T.Group(); FB.position.set(-.38, .455, 2.25); FB.rotation.y = .35; W.add(FB);
var cover = box(.25, .012, .33, std(0x2f5bd6, .6), 0, .006, 0, FB);
var label = cv(256, 128, function (g, w, h) { g.fillStyle = '#fff7e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f5bd6'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#1b1d3a'; g.font = '700 46px Caveat'; g.textAlign = 'center'; g.fillText('Rough Copy', w / 2, 72); });
var lb = new T.Mesh(new T.PlaneGeometry(.14, .07), new T.MeshStandardMaterial({ map: label })); lb.rotation.x = -Math.PI / 2; lb.position.set(0, .0125, -.07); FB.add(lb);
// 8 pages hinged at the spine (left edge); drawn: a cricket ball flying across, stumps at the right
B.flipPages = [];
var NP = 8, pgW = .24, pgH = .32;
for (var i = 0; i < NP; i++) {
  var real = i % 4 === 0;
  var tx = cv(384, 512, (function (i, real) { return function (g, w, h) {
    g.fillStyle = '#fffdf3'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,120,220,.35)'; g.lineWidth = 2; for (var y = 60; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = 'rgba(220,60,60,.5)'; g.beginPath(); g.moveTo(44, 0); g.lineTo(44, h); g.stroke();
    var rc = rough.canvas(g.canvas);
    rc.line(60, 430, 360, 430, { stroke: '#2a5a2a', strokeWidth: 3, roughness: 1.5, seed: 3 }); // ground
    [318, 334, 350].forEach(function (x, k) { rc.line(x, 430, x, 330, { stroke: '#7a4a22', strokeWidth: 5, roughness: .8, seed: 10 + k }); });
    var u = i / (NP - 1), bx = 80 + u * 220, by = 300 - Math.sin(u * Math.PI) * 170 + u * 40;
    rc.circle(bx, by, 44, { fill: '#d8342a', fillStyle: 'solid', stroke: '#7a1010', strokeWidth: 2, roughness: 1.2, seed: 20 + i });
    rc.line(bx - 14, by - 8, bx + 14, by + 8, { stroke: '#fff', strokeWidth: 2, seed: 40 + i });
    g.fillStyle = real ? '#ffb21e' : '#ff3f8e'; g.fillRect(0, 0, w, 54); g.fillStyle = real ? '#1b1d3a' : '#fff7e6'; g.font = '700 40px Fredoka'; g.textAlign = 'center'; g.fillText(real ? 'ASLI ' + (i / 4 + 1) : 'AI', w / 2, 41);
    g.strokeStyle = real ? '#ffb21e' : '#ff3f8e'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
  }; })(i, real));
  var hinge = new T.Group(); hinge.position.set(-pgW / 2, .013 + (NP - i) * .0012, 0); FB.add(hinge);
  var pg = new T.Mesh(new T.PlaneGeometry(pgW, pgH), new T.MeshStandardMaterial({ map: tx, roughness: .9, side: T.DoubleSide })); pg.rotation.x = -Math.PI / 2; pg.position.x = pgW / 2; pg.castShadow = true; hinge.add(pg);
  B.flipPages.push({ h: hinge, m: pg, real: real });
}
// flip position f (pages 0..NP): pages with index < f are turned over (rotated about the spine), the current one is mid-flip
B.flipAt = function (f) { B.flipPages.forEach(function (p, i) { var k = B.clamp(f - i); p.h.rotation.z = Math.PI * B.eio(k) * .985; p.h.position.y = .013 + (k > .5 ? i : B.flipPages.length - i) * .0012; }); };

// ---- console vs PC on a small table in the lane ----
var TB = B.TABLE = new T.Group(); TB.position.set(.9, 0, 3.6); W.add(TB);
box(1.6, .06, .8, std(0x8a5a32, .7), 0, .76, 0, TB); [[-.72, -.33], [.72, -.33], [-.72, .33], [.72, .33]].forEach(function (p) { box(.06, .76, .06, std(0x5e3a1e, .7), p[0], .38, p[1], TB); });
function logoTex(path, w, h, bg, fg, txt, sub) { return cv(w, h, function (g) { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = 'center'; g.font = '700 ' + Math.round(h * .16) + 'px Fredoka'; g.fillText(txt, w / 2, h * .78); if (sub) { g.font = '600 ' + Math.round(h * .09) + 'px Inter'; g.fillText(sub, w / 2, h * .92); } }); }
B.consoleTex = logoTex(null, 256, 400, '#f3f3f6', '#1b1d3a', 'PS5 · XBOX', 'CONSOLE');
B.pcTex = logoTex(null, 256, 400, '#121418', '#76b900', 'NVIDIA', 'PC + GPU');
var cons = B.CONS = new T.Group(); cons.position.set(-.42, .79, 0); TB.add(cons);
var cb = new T.Mesh(new T.BoxGeometry(.2, .46, .36), [std(0xf3f3f6, .4), std(0xf3f3f6, .4), std(0xf3f3f6, .4), std(0xf3f3f6, .4), new T.MeshStandardMaterial({ map: B.consoleTex, roughness: .4 }), std(0xf3f3f6, .4)]); cb.position.y = .23; cb.castShadow = true; cons.add(cb);
box(.08, .47, .37, std(0x15151a, .4), 0, .235, 0, cons);
var pc = B.PC = new T.Group(); pc.position.set(.42, .79, 0); TB.add(pc);
var pb = new T.Mesh(new T.BoxGeometry(.24, .5, .44), [std(0x121418, .4, .3), std(0x121418, .4, .3), std(0x121418, .4, .3), std(0x121418, .4, .3), new T.MeshStandardMaterial({ map: B.pcTex, roughness: .4 }), std(0x121418, .4, .3)]); pb.position.y = .25; pb.castShadow = true; pc.add(pb);
B.gpuGlow = new T.Mesh(new T.BoxGeometry(.01, .06, .3), new T.MeshBasicMaterial({ color: new T.Color(.6, 1.6, .2), toneMapped: false })); B.gpuGlow.position.set(-.125, .22, 0); pc.add(B.gpuGlow);
// load real brand marks (nominative use) onto the fronts
B.loadLogos = function () {
  function draw(tex, url, col, x, y, s) { return new Promise(function (res) { fetch(url).then(function (r) { return r.text(); }).then(function (svg) { svg = svg.replace('<svg ', '<svg fill="' + col + '" '); var im = new Image(); im.onload = function () { tex.userData.g.drawImage(im, x, y, s, s); tex.needsUpdate = true; res(); }; im.onerror = res; im.src = 'data:image/svg+xml;base64,' + btoa(svg); }).catch(res); }); }
  return Promise.all([draw(B.consoleTex, 'logos/playstation5.svg', '#1b1d3a', 48, 60, 160), draw(B.pcTex, 'logos/nvidia.svg', '#76b900', 48, 60, 160)]);
};

// ---- game frames as canvases (portrait for the poster, low-res for the small photo) ----
B.gameShot = function (t, w, h, pose) {
  var R = B.R, gc = B.gcam, ox = gc.aspect, of = gc.fov; B.renderGame(t);
  if (pose) { gc.position.set(pose[0], pose[1], pose[2]); gc.lookAt(pose[3], pose[4], pose[5]); }
  gc.aspect = w / h; gc.fov = pose ? pose[6] : of; gc.updateProjectionMatrix();
  R.setRenderTarget(null); R.setViewport(0, 0, w, h); R.setScissor(0, 0, w, h); R.setScissorTest(true); R.render(B.GS, gc); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  gc.aspect = ox; gc.fov = of; gc.updateProjectionMatrix();
  var c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(R.domElement, 0, B.H - h, w, h, 0, 0, w, h); return c;
};
})();
/* c_game: our own made-up sunny coast "crime-game" city, rendered into the phone's screen (render target) */
(function () {
var T = THREE, R = B.R, std = B.std, hsh = B.hsh, cv = B.cv;
var GS = B.GS = new T.Scene(), GW = 1024, GH = 472;
var gcam = B.gcam = new T.PerspectiveCamera(52, GW / GH, .1, 600);
var gRT = B.gRT = new T.WebGLRenderTarget(GW, GH, { samples: 4, type: T.HalfFloatType });
GS.add(new T.Mesh(new T.SphereGeometry(400, 32, 16), B.skyMat(0x3d8bff, 0x8fd0ff, 0xfff0c8)));
var sunL = new T.DirectionalLight(0xfff0d0, 3.2); sunL.position.set(40, 60, 30); GS.add(sunL);
GS.add(new T.HemisphereLight(0xbfe4ff, 0xffd9a0, 1.1));
function gbox(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); GS.add(o); return o; }
// sea + beach + road along x
var sea = new T.Mesh(new T.PlaneGeometry(800, 300), new T.MeshStandardMaterial({ color: 0x18b6d8, roughness: .15, metalness: .1 })); sea.rotation.x = -Math.PI / 2; sea.position.set(0, -.2, -170); GS.add(sea);
var sand = new T.Mesh(new T.PlaneGeometry(800, 30), std(0xf4d79a, .95)); sand.rotation.x = -Math.PI / 2; sand.position.set(0, -.1, -16); GS.add(sand);
var grass = new T.Mesh(new T.PlaneGeometry(800, 200), std(0x5ccf6a, .95)); grass.rotation.x = -Math.PI / 2; grass.position.set(0, -.12, 100); GS.add(grass);
var roadT = cv(512, 128, function (g, w, h) { g.fillStyle = '#3a3d48'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd34a'; for (var i = 0; i < 8; i++) g.fillRect(i * 64 + 8, h / 2 - 3, 36, 6); g.fillStyle = '#f2f2f2'; g.fillRect(0, 6, w, 4); g.fillRect(0, h - 10, w, 4); });
roadT.wrapS = T.RepeatWrapping; roadT.repeat.set(60, 1);
var road = new T.Mesh(new T.PlaneGeometry(800, 10), new T.MeshStandardMaterial({ map: roadT, roughness: .7 })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, 0); GS.add(road);
var walk = new T.Mesh(new T.PlaneGeometry(800, 4), std(0xd9d2c4, .9)); walk.rotation.x = -Math.PI / 2; walk.position.set(0, .02, 7); GS.add(walk);
// pastel art-deco towers behind the walk
var DECO = [0xff9ec7, 0x7fe0d0, 0xfff1a8, 0xb7a8ff, 0xffb27a, 0x9fd8ff];
function winT(seed, col) { return cv(128, 256, function (g, w, h) { g.fillStyle = col; g.fillRect(0, 0, w, h); for (var r = 0; r < 12; r++) for (var c = 0; c < 4; c++) { g.fillStyle = hsh(seed + r * 5 + c) > .3 ? '#2a5a8a' : '#9fd6ff'; g.fillRect(8 + c * 30, 8 + r * 20, 22, 13); } }); }
for (var i = 0; i < 26; i++) {
  var x = -150 + i * 12 + hsh(i) * 4, h = 10 + hsh(i * 7) * 34, w = 7 + hsh(i * 3) * 4, col = DECO[i % DECO.length];
  var m = new T.MeshStandardMaterial({ map: winT(i * 13, '#' + new T.Color(col).getHexString()), roughness: .6 });
  gbox(w, h, 8, m, x, h / 2, 16 + hsh(i * 5) * 8);
  if (hsh(i * 11) > .5) gbox(w * .6, 4, 5, std(col, .6), x, h + 2, 16 + hsh(i * 5) * 8);
}
// palms along the beach side
function palm(x, z, h) { var g = new T.Group(); var tr = new T.Mesh(new T.CylinderGeometry(.18, .3, h, 7), std(0x8a6a44, .9)); tr.position.y = h / 2; tr.rotation.z = .08; g.add(tr);
  for (var k = 0; k < 8; k++) { var f = new T.Mesh(new T.BoxGeometry(3.4, .08, .7), std(0x2fae4a, .8)); f.position.set(Math.cos(k * .8) * 1.5, h, Math.sin(k * .8) * 1.5); f.rotation.set(0, -k * .8, -.45); g.add(f); }
  g.position.set(x, 0, z); GS.add(g); }
for (var i = 0; i < 30; i++) palm(-140 + i * 10, -8 - hsh(i) * 3, 7 + hsh(i * 3) * 3);
// boats on the sea
for (var i = 0; i < 6; i++) { var bt = gbox(4, 1, 1.6, std(0xffffff, .5), -60 + i * 30, .2, -40 - hsh(i) * 40); gbox(1.4, .9, 1.2, std(0xff6f91, .6), -60 + i * 30, .9, -40 - hsh(i) * 40); }
B.gameCars = [];
B.placeGame = function () {
  var hero = B.prop('SportsCar', 0, 0, 2.3, Math.PI / 2, 1, GS); hero.traverse(function (m) { if (m.isMesh && m.material && m.material.color) { m.material = m.material.clone(); if (m.material.color.r > .5 && m.material.color.g < .4) m.material.color.set(0xff3f8e); } });
  B.gameHero = hero;
  [['Taxi', -18, -2.3, -Math.PI / 2], ['SUV', 26, 2.3, Math.PI / 2], ['Taxi', 48, -2.3, -Math.PI / 2], ['SUV', -40, 2.3, Math.PI / 2]].forEach(function (q) { var c = B.prop(q[0], q[1], 0, q[2], q[3], 1, GS); B.gameCars.push({ o: c, x0: q[1], v: q[3] > 0 ? 6 : -9 }); });
  for (var i = 0; i < 14; i++) B.prop('Streetlight_Single', -60 + i * 10, 0, 5.4, 0, 3.2, GS);
};
// the "game": hero car drives along the coast road, chase cam behind it
B.renderGame = function (t) {
  var x = -150 + ((t * 11 + 50) % 300); if (B.gameHero) { B.gameHero.position.set(x, 0, 2.3 - (B.gameLane || 0)); B.gameHero.rotation.y = Math.PI / 2 + (B.gameLane > 0 && B.gameLane < 1.95 ? .25 : 0); }
  B.gameCars.forEach(function (c) { c.o.position.x = x + ((c.x0 + 300 + (c.v - 11) * t) % 120 + 120) % 120 - 40; });
  gcam.position.set(x - 10.5, 4.2, 6.5); gcam.lookAt(x + 6, 1.2, -1);
  R.setRenderTarget(gRT); R.render(GS, gcam); R.setRenderTarget(null);
  return gRT.texture;
};
// read the current game frame into a 2D canvas (used by the rangoli scene)
B.gameToCanvas = function (t) {
  B.renderGame(t); var x = B.gameHero ? B.gameHero.position.x : 0;
  R.setRenderTarget(null); R.setViewport(0, 0, GW, GH); R.setScissor(0, 0, GW, GH); R.setScissorTest(true); R.render(GS, gcam); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  var c = document.createElement('canvas'); c.width = GW; c.height = GH; c.getContext('2d').drawImage(R.domElement, 0, B.H - GH, GW, GH, 0, 0, GW, GH); return c;
};
})();
/* d_scenes: 11 scenes in one lane, timed from the voice (window.TM). Every scene = pose(t) (authored camera) + act(t) (objects, UI). Pure functions of t. */
(function () {
var T = THREE, S = B.S, W = B.WORLD, cam = B.cam, clamp = B.clamp, lerp = B.lerp, eio = B.eio, eo3 = B.eo3, eob = B.eob, hsh = B.hsh, cv = B.cv, C = B.C, TM = window.TM;
var V = function (x, y, z) { return new T.Vector3(x, y, z); };
// ---------- timing ----------
function GR(id) { for (var i = 0; i < TM.groups.length; i++) if (TM.groups[i].group === id) return TM.groups[i]; return null; }
B.GR = GR;
// word start time in group gid matching any of 'a|b' (k-th hit; last=true takes the last hit); falls back to the needle's position in the text
function WS(gid, needle, k, last) {
  var ns = needle.split('|'), hits = [];
  TM.words.forEach(function (w) { if (w[3] === gid && ns.some(function (n) { return w[0].indexOf(n) >= 0; })) hits.push(w[1]); });
  if (hits.length) return last ? hits[hits.length - 1] : hits[Math.min(k || 0, hits.length - 1)];
  var g = GR(gid), tx = TM.B[gid], idx = -1; ns.some(function (n) { idx = tx.indexOf(n); return idx >= 0; });
  (window.__ws = window.__ws || []).push(gid + ':' + needle); if (idx < 0) idx = 0;
  return g.start + (g.end - g.start) * idx / tx.length;
}
B.WS = WS;
// ---------- UI ----------
var UI = document.getElementById('ui');
function el(css, html) { var d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; if (html != null) d.innerHTML = html; UI.appendChild(d); return d; }
B.el = el;
var SH = 'text-shadow:0 4px 14px rgba(10,12,40,.55),0 1px 3px rgba(10,12,40,.8);';
var kick = el('left:156px;top:236px;font:600 30px Fredoka;letter-spacing:.08em;color:#1b1d3a;background:' + C.real + ';padding:6px 16px 4px;border-radius:10px;opacity:0');
var head = el('left:156px;top:296px;width:740px;font:700 82px/1.06 Fredoka;color:#fff7e6;letter-spacing:-.01em;' + SH + 'opacity:0');
var sub = el('left:156px;top:500px;width:740px;font:600 34px/1.25 Inter;color:#fff7e6;' + SH + 'opacity:0');
var blk = function (txt, col, ink) { return '<span style="background:' + col + ';color:' + (ink || '#fff7e6') + ';padding:0 .16em;border-radius:.14em;text-shadow:none;box-decoration-break:clone;-webkit-box-decoration-break:clone">' + txt + '</span>'; };
var AI = function (x) { return blk(x, C.ai); }, RL = function (x) { return blk(x, C.real, '#1b1d3a'); };
var card = el('left:470px;top:1030px;width:430px;padding:22px 26px 18px;background:#fff7e6;border-radius:6px;box-shadow:0 14px 30px rgba(10,12,40,.45);transform-origin:50% 0;opacity:0;box-sizing:border-box');
card.innerHTML = '<div style="position:absolute;left:150px;top:-16px;width:120px;height:32px;background:rgba(255,210,63,.85);transform:rotate(-4deg)"></div><div style="font:700 40px Caveat;color:#6a5a7a">isko kehte hain:</div><div class="tm" style="font:700 60px/1.02 Fredoka;color:#1b1d3a;margin-top:4px"></div>';
var cardTm = card.querySelector('.tm');
function chalk() { return el('font:700 58px/1 Caveat;color:#fff7e6;' + SH + 'white-space:nowrap;opacity:0'); }
var L1 = chalk(), L2 = chalk(), L3 = chalk();
var big = el('left:156px;width:768px;text-align:center;font:700 120px/1 Fredoka;color:' + C.real + ';' + SH + 'opacity:0;font-variant-numeric:tabular-nums');
var chip = el('font:700 44px Fredoka;padding:8px 22px 6px;border-radius:14px;opacity:0;white-space:nowrap');
var cap = document.getElementById('cap');
// end card
var endc = el('left:156px;top:560px;width:768px;height:700px;opacity:0;text-align:center');
endc.innerHTML = '<div style="width:300px;height:300px;margin:0 auto;border-radius:50%;background:#0d1330;padding:14px;box-sizing:border-box;box-shadow:0 0 0 8px #b4f000,0 18px 40px rgba(0,0,0,.5)"><img src="nerdlogic-profile.jpg" style="width:100%;height:100%;border-radius:50%;display:block"></div>' +
  '<div style="font:700 86px Fredoka;color:#fff7e6;margin-top:46px;' + SH + '">nerdlogic.co</div><div class="btns" style="display:flex;justify-content:center;gap:22px;margin-top:40px"></div>';
var BTN = ['LIKE', 'SHARE', 'SUBSCRIBE'].map(function (x, i) { var b = document.createElement('div'); b.textContent = x; b.style.cssText = 'font:700 40px Fredoka;padding:14px 28px 10px;border-radius:40px;opacity:0;' + (i === 2 ? 'background:#ff3f8e;color:#fff7e6' : 'background:#fff7e6;color:#1b1d3a'); endc.querySelector('.btns').appendChild(b); return b; });

function hideUI() { [kick, head, sub, card, L1, L2, L3, big, chip, endc].forEach(function (d) { d.style.opacity = 0; d.style.transform = ''; }); }
function show(d, t, t0, dur) { var u = clamp((t - t0) / (dur || .35)); d.style.opacity = u; d.style.transform = 'translateY(' + (1 - eo3(u)) * 18 + 'px)'; return u; }
function popCard(t, t0, term, fs) { var u = clamp((t - t0) / .4); card.style.opacity = u > 0 ? 1 : 0; card.style.transform = 'rotate(-3deg) scale(' + (u > 0 ? eob(u) : 0) + ')'; cardTm.textContent = term; cardTm.style.fontSize = (fs || 60) + 'px'; }
function place(d, x, y) { d.style.left = Math.round(x) + 'px'; d.style.top = Math.round(y) + 'px'; }
// a chalk label anchored to a world point, clamped inside the safe box
function lab(d, txt, p, dx, dy, t, t0, t1) { if (t < t0 || (t1 != null && t > t1)) return; var s = B.toScr(p); d.textContent = txt; var w = txt.length * 24; place(d, clamp(s.x + (dx || 0), 160, 918 - w), clamp(s.y + (dy || 0), 560, 1250)); show(d, t, t0); if (t1 != null) d.style.opacity = Math.min(+d.style.opacity, clamp((t1 - t) / .3)); }
function kickHead(t, k, h, t0) { kick.textContent = k; show(kick, t, t0 - .1); head.innerHTML = h; show(head, t, t0); }
B.UIs = { hide: hideUI };

// ---------- shared actors ----------
var GRID = [], REAL = 0;
(function () {
  function tileTex(real) { return cv(128, 128, function (g, w, h) { g.fillStyle = real ? 'rgba(255,178,30,.9)' : 'rgba(255,63,142,.84)'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,247,230,.9)'; g.lineWidth = 5; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = real ? '#1b1d3a' : '#fff7e6'; g.font = '700 ' + (real ? 38 : 56) + 'px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(real ? 'ASLI' : 'AI', w / 2, h / 2 + 3); }); }
  var tr = tileTex(true), ta = tileTex(false), sw = .152 / 4, sh = .07 / 4;
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var i = r * 4 + c, m = new T.Mesh(new T.PlaneGeometry(sw * .96, sh * .94), new T.MeshBasicMaterial({ map: i === REAL ? tr : ta, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    m.position.set(-.076 + (c + .5) * sw, .035 - (r + .5) * sh, .0052); m.userData = { r: r, c: c, tR: tr, tA: ta }; B.PHONE.add(m); GRID.push(m); }
})();
B.gridOff = function () { gridAt(function () { return 0; }); };
function gridAt(fn, realFn) { GRID.forEach(function (m, i) { var k = fn(m.userData.r, m.userData.c, i); m.material.map = (realFn ? realFn(m.userData.r, m.userData.c, i) : i === REAL) ? GRID[REAL].userData.tR : GRID[REAL].userData.tA; m.material.opacity = k > 0 ? .92 : 0; m.scale.set(1, k > 0 ? eob(Math.min(1, k)) : .001, 1); }); }
var KID = B.KID, KID2 = B.voxel({ s: 1.12, top: 0xffd23f, bot: 0x2f4fa8, skin: 0xa86f48 }); W.add(KID2); B.KID2 = KID2;
function phonePose(t, extraPush) { // first-person POV on the kid's phone
  KID.updateMatrixWorld(true); var pc = new T.Vector3(); B.PHONE.getWorldPosition(pc); var p = KID.localToWorld(V(0, 1.52, .1)); p.lerp(pc, extraPush || 0);
  return { p: p, q: pc.clone().add(V(0, .03, 0)), fov: 40, band: pc, wid: .11, amp: 30, hideHead: true };
}
function gameOnPhone(t, blocks, grid) { B.phoneMat.uniforms.map.value = B.renderGame(t); B.phoneMat.uniforms.blocks.value.set(blocks || 0, blocks ? Math.round(blocks * .46) : 0); B.phoneMat.uniforms.grid.value = grid || 0; }

// ================= 1. HOOK (g1, g2) =================
function hookPose(t, sc) { var cU = eio((t - (sc.t1 - 2.2)) / 2.0), P = phonePose(t, eio(t / 6) * .12 * (1 - cU)); var far = V(2.0, 4.4, 7.6);
  return cU <= 0 ? P : { p: P.p.clone().lerp(far, cU), q: P.q.clone().lerp(V(-.2, 1.0, -2.4), cU), fov: lerp(40, 36, cU), band: P.band.clone().lerp(V(0, 1, 0), cU), wid: lerp(.11, .18, cU), amp: lerp(30, 20, cU), hideHead: cU < .3 }; }
function hookAct(t, sc) {
  gameOnPhone(t, 0, 0);
  var g2 = GR('g2'), tg = WS('g2', 'सोलह'), tAI = WS('g2', 'एआई|अंदाज़');
  gridAt(function (r, c, i) { return i === REAL ? (t - tg) / .28 : (t - (tg + .5 + ((i * 7) % 16) / 16 * 1.6)) / .28; });
  kick.textContent = 'GTA 6 · 19 NOV'; show(kick, t, -1);
  if (t < tg - .2) { head.innerHTML = 'GTA 6 aa raha hai!'; show(head, t, -1); }
  else { head.innerHTML = '16 mein se 15 pixel<br>' + AI('AI') + ' ka andaaza!'; show(head, t, tg - .2); sub.textContent = 'NVIDIA ka daawa · ek khaas setting par'; show(sub, t, tg + .3); sub.style.top = '500px'; }
}

// ================= 2. PIXEL (g3, g4, g5) — jaali front, then the phone screen as a jaali =================
var tPhone = function () { return WS('g4', 'फ़ोन|फोन') - .35; };
function pixPose(t, sc) {
  if (t < tPhone()) { var u = eio((t - sc.t0) / 4); return { p: V(0, lerp(2.1, 1.75, u), lerp(2.2, .9, u)), q: V(0, 1.5, -7.4), fov: 34, band: V(0, 1.45, -7.4), wid: .14, amp: 26 }; }
  var P = phonePose(t, .1 + eio((t - tPhone()) / 6) * .1); return P;
}
function pixAct(t, sc) {
  var tc = WS('g3', 'छेद|रंग'), tP = tPhone(), tpx = WS('g4', 'पिक्सल|पिक्सेल'), t4 = WS('g5', 'फ़ोर|फोर|4'), t83 = WS('g5', 'तिरासी|83');
  KID2.visible = false;
  // holes fill one flat colour each, row by row from the top
  B.jPix.forEach(function (p) { var k = clamp((t - (tc + (B.JN - 1 - p.r) * .12 + p.c * .03)) / .25); p.m.material.color.copy(p.col || p.m.material.color); p.m.material.opacity = k; });
  if (t < tP) {
    kickHead(t, 'TASVEER KYA HAI?', 'Har chhed se<br>bas ' + RL('ek rang'), sc.t0 + .2);
    lab(L1, '1 chhed = 1 rang', V(.6, 2.45, -7.4), -40, -80, t, tc + .6);
  } else {
    // the phone screen, seen as a jaali: big blocks -> finer -> 4K
    var bl = t < t4 ? 16 : Math.round(lerp(16, 900, eio((t - t4) / 1.8)));
    gameOnPhone(t, bl, t < t4 + 1.2 ? .8 : lerp(.8, 0, clamp((t - t4 - 1.2) / .6)));
    if (t < t83 - .3) kickHead(t, 'PHONE KI SCREEN', 'Screen bhi ek<br>' + RL('jaali') + ' hai', tP + .1);
    else { kickHead(t, '4K SCREEN', RL('83 lakh') + ' chhed!', t83 - .3); var n = Math.round(8294400 * eio((t - t83) / 1.4)); big.textContent = n.toLocaleString('en-IN'); big.style.top = '520px'; big.style.fontSize = '96px'; show(big, t, t83);
      sub.textContent = '3840 × 2160 = 82,94,400 pixel'; sub.style.top = '640px'; show(sub, t, t83 + 1.2); }
    if (t >= tpx - .1 && t < t83 - .4) popCard(t, tpx, 'PIXEL'); card.style.top = '600px'; card.style.left = '480px';
  }
}

// ================= 3. LIGHT (g6, g7) — the moon in the well =================
var RAYP = null, rayL = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color: new T.Color(2.2, 1.9, 1.2), toneMapped: false })), rayDot = new T.Mesh(new T.SphereGeometry(.06, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(3, 2.6, 1.6), toneMapped: false }));
S.add(rayL); S.add(rayDot);
var rayTube = null;
function lightPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(1.9, 1.6, u), lerp(4.2, 3.9, u), lerp(-7.0, -7.6, u)), q: V(.2, .8, -11.2), fov: 42, band: V(.4, .8, -11.2), wid: .16, amp: 24 }; }
function lightAct(t, sc) {
  KID2.visible = true; KID2.position.set(-1.3, 0, -10.9); KID2.rotation.y = Math.PI / 2; KID2.userData.P.head.rotation.x = .55;
  W.updateMatrixWorld(true); var eye = new T.Vector3(); KID2.userData.P.head.getWorldPosition(eye); eye.y += .2 * 1.12;
  var moonP = B.moon.position.clone(), water = V(.2, .62, -11.35);
  var src = water.clone().add(moonP.clone().sub(water).normalize().multiplyScalar(9));
  var tr = WS('g7', 'रोशनी'), tt = WS('g7', 'टकरा'), tm = WS('g7', 'मुड़|मुड'), ta = WS('g7', 'आँख|आंख');
  var k1 = clamp((t - tr) / (tt - tr + .2)), k2 = clamp((t - tm) / Math.max(.4, ta - tm + .3));
  var pts = [src.clone()]; var a = src.clone().lerp(water, eo3(k1)); pts.push(a); var cur = a;
  if (k1 >= 1) { cur = water.clone().lerp(eye, eo3(k2)); pts.push(cur); }
  rayL.geometry.setFromPoints(pts); rayL.visible = t >= tr; rayDot.visible = t >= tr && k2 < 1; rayDot.position.copy(cur);
  kickHead(t, 'RANG KAHAAN SE?', t < tr - .2 ? RL('Roshni') + ' se!' : 'Roshni ' + RL('takraati') + ',<br>mudti, aankh tak', sc.t0 + .2);
  if (rayL.visible) lab(L1, 'chaand ki roshni', src.clone().lerp(water, .3), 30, -40, t, tr + .3);
  lab(L2, 'takraayi, mudi', water, -40, -110, t, tt);
  lab(L3, 'aankh', eye, 40, -40, t, ta);
}

// ================= 4. RAY TRACING (g8, g9) — a thread from the eye through every hole =================
var TH = [], thrG = B.thrG = new T.Group(), EYE = new T.Vector3(); S.add(thrG);
B.initThreads = function () {
  KID2.position.set(-.45, 0, -5.2); KID2.rotation.y = Math.PI; KID2.userData.P.head.rotation.set(0, .05, 0);
  W.updateMatrixWorld(true); KID2.userData.P.head.getWorldPosition(EYE); EYE.y += .2 * 1.12; EYE.z -= .14;
  B.jaaliMesh.visible = false; B.jPix.forEach(function (p) { p.m.visible = false; }); KID2.visible = false; B.SPOOLS.visible = false;
  var J = B.JAALI, jc0 = new T.Vector3(0, 1.45, 0).applyMatrix4(J.matrixWorld), ecam = new T.PerspectiveCamera(30, 1, .05, 300);
  ecam.position.copy(EYE); ecam.lookAt(jc0); var dist = EYE.distanceTo(jc0); ecam.fov = 2 * Math.atan(B.JS_HALF / dist) * 180 / Math.PI; ecam.updateProjectionMatrix();
  var R = B.R, N = 256; R.setRenderTarget(null); R.setViewport(0, 0, N, N); R.setScissor(0, 0, N, N); R.setScissorTest(true); R.render(S, ecam); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  var c = document.createElement('canvas'); c.width = N; c.height = N; var g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(R.domElement, 0, B.H - N, N, N, 0, 0, N, N);
  B.jaaliMesh.visible = true; B.jPix.forEach(function (p) { p.m.visible = true; }); KID2.visible = true;
  var rc = new T.Raycaster(), targets = []; W.traverse(function (o) { if (o.isMesh && o !== B.jaaliMesh && B.jPix.every(function (p) { return p.m !== o; })) targets.push(o); });
  KID2.traverse(function (o) { var i = targets.indexOf(o); if (i >= 0) targets.splice(i, 1); });
  B.jPix.forEach(function (p) {
    var hp = new T.Vector3(); p.m.getWorldPosition(hp); var dir = hp.clone().sub(EYE).normalize(); rc.set(EYE, dir); rc.far = 60;
    var hit = rc.intersectObjects(targets, false).filter(function (h) { return h.distance > EYE.distanceTo(hp) + .2; })[0];
    var end = hit ? hit.point : EYE.clone().addScaledVector(dir, 45);
    var sp = hp.clone().project(ecam), px = Math.round((sp.x + 1) / 2 * N), py = Math.round((1 - sp.y) / 2 * N), d = g.getImageData(clamp(px - 3, 0, N - 7), clamp(py - 3, 0, N - 7), 7, 7).data, rr = 0, gg = 0, bb = 0;
    for (var q = 0; q < d.length; q += 4) { rr += d[q]; gg += d[q + 1]; bb += d[q + 2]; } var nq = d.length / 4;
    p.col = new T.Color('rgb(' + Math.round(rr / nq) + ',' + Math.round(gg / nq) + ',' + Math.round(bb / nq) + ')');
    var ln = new T.Line(new T.BufferGeometry().setFromPoints([EYE, end]), new T.LineBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(1.6), transparent: true, opacity: .9, toneMapped: false }));
    thrG.add(ln); var dot = new T.Mesh(new T.SphereGeometry(.035, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(2.2), toneMapped: false })); thrG.add(dot);
    TH.push({ ln: ln, dot: dot, end: end, ord: (B.JN - 1 - p.r) * B.JN + p.c, p: p });
  });
};
function rtPose(t, sc) { var u = eio((t - (WS('g9', 'पूछो|पूछ') - .3)) / 3.2), jc = V(0, 1.6, -7.4);
  return { p: V(1.3, 3.9, 2.0).lerp(V(2.1, 5.6, -3.6), u), q: jc.clone().lerp(V(.2, .9, -9.4), u), fov: lerp(34, 38, u), band: V(0, 1.45, -7.4).lerp(V(.2, 1.0, -9.0), u), wid: lerp(.1, .2, u), amp: 24 }; }
function rtAct(t, sc) {
  KID2.visible = true; KID2.position.set(-.45, 0, -5.2); KID2.rotation.y = Math.PI; KID2.userData.P.head.rotation.set(0, .05, 0);
  var tb = WS('g8', 'धागा'), n = TH.length, span = Math.max(2.5, WS('g9', 'रोशनी', 0, true) - tb);
  thrG.visible = true;
  TH.forEach(function (h) {
    var t0 = tb + h.ord / n * span * .8, k = clamp((t - t0) / .55);
    var cur = EYE.clone().lerp(h.end, eo3(k)); h.ln.geometry.setFromPoints([EYE, cur]); h.ln.visible = k > 0; h.dot.visible = k > 0 && k < 1; h.dot.position.copy(cur);
    h.ln.material.opacity = k >= 1 ? lerp(.85, .35, clamp((t - t0 - .6) / 1.5)) : .9;
    h.p.m.material.color.copy(h.p.col); h.p.m.material.opacity = clamp((k - .55) / .3);
  });
  kickHead(t, 'GAME ULTA KARTA HAI', 'Har chhed tak<br>ek ' + RL('dhaaga'), sc.t0 + .2);
  lab(L1, 'aankh', EYE, 70, -30, t, tb - .4, WS('g9', 'पूछो|पूछ') - .3);
  lab(L2, 'har chhed = 1 dhaaga', V(.35, 2.55, -7.4), 0, -80, t, tb + 1.0, WS('g9', 'पूछो|पूछ') - .3);
  var trt = WS('g9', 'रे|ट्रेसिंग'); if (t >= trt - .1) popCard(t, trt, 'RAY TRACING');
  card.style.top = '1030px'; card.style.left = '470px';
}

// ================= 5. COST (g10, g11) — spools of thread bury the lane; the Cars clock =================
function costPose(t, sc) { var tc = WS('g11', 'फ़िल्म|फिल्म|कार्स') - .5, u = eio((t - tc) / 1.6);
  var a = { p: V(.3, 4.6, 6.0), q: V(-.2, .4, .9), fov: 40, band: V(0, .4, 1.2), wid: .2, amp: 22 };
  var b = { p: V(1.9, 4.0, 1.6), q: V(-2.2, 4.4, -1.0), fov: 36, band: V(-2.18, 4.15, -1.0), wid: .12, amp: 26 };
  if (u <= 0) { var k = eio((t - sc.t0) / 3); a.p.y -= k * .6; a.p.z -= k * .6; return a; }
  return { p: a.p.clone().lerp(b.p, u), q: a.q.clone().lerp(b.q, u), fov: lerp(a.fov, b.fov, u), band: a.band.clone().lerp(b.band, u), wid: lerp(a.wid, b.wid, u), amp: lerp(a.amp, b.amp, u) };
}
function costAct(t, sc) {
  var t83 = WS('g10', 'तिरासी|83'), t60 = WS('g10', 'साठ|60'), t50 = WS('g11', 'पचास|50'), tc = WS('g11', 'फ़िल्म|फिल्म|कार्स'), t17 = WS('g11', 'सत्रह|17');
  B.SPOOLS.visible = true; B.spoolsAt(clamp((t - t83 + .3) / Math.max(2, t50 - t83 + 1.2)), t);
  B.clockAt(t < tc ? 3 : 3 + 17 * eio((t - t17 + .4) / 2.4));
  kick.textContent = 'KITNA KAAM?'; show(kick, t, sc.t0 + .1);
  if (t < t60 - .2) head.innerHTML = 'Ek tasveer:<br>' + RL('83 lakh') + ' dhaage';
  else if (t < t50 - .2) head.innerHTML = '83 lakh × ' + RL('60') + '<br>har second';
  else if (t < tc - .2) head.innerHTML = '= ' + AI('50 crore') + '<br>dhaage / second!';
  else head.innerHTML = 'Cars film: ' + RL('17 ghante') + '<br>ek tasveer';
  show(head, t, t < t60 - .2 ? sc.t0 + .2 : t < t50 - .2 ? t60 - .2 : t < tc - .2 ? t50 - .2 : tc - .2);
  if (t >= tc) { sub.textContent = 'Pixar Cars (2006), D23 ke mutabiq, average · reported'; sub.style.top = '500px'; show(sub, t, tc + .4); }
  if (t > t60 - .2 && t < tc - .3) { chip.textContent = '× 60 / SECOND'; chip.style.background = C.real; chip.style.color = '#1b1d3a'; place(chip, 156, 540); show(chip, t, t60); }
  if (t >= tc) { var hrs = Math.min(17, Math.floor(17 * eio((t - t17 + .4) / 2.4))); big.textContent = hrs + ' ghante'; big.style.top = '1040px'; big.style.fontSize = '88px'; show(big, t, t17 - .2); }
}

// ================= 6. RAY RECONSTRUCTION (g12, g13) — rangoli =================
var rTex = cv(1024, 1024, function () {}), rC = rTex.userData.c, rG = rTex.userData.g, RIMG = null, RDOTS = [], RS = null;
var rang = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), new T.MeshStandardMaterial({ map: rTex, roughness: .95, transparent: true })); rang.rotation.x = -Math.PI / 2; rang.receiveShadow = true; B.RANG.add(rang);
for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2, dx = Math.cos(a) * .95, dz = Math.sin(a) * .95; var dy = new T.Mesh(new T.CylinderGeometry(.05, .03, .04, 12), B.std(0xb87333, .35, .8)); dy.position.set(dx, .02, dz); B.RANG.add(dy); var fl = new T.Mesh(new T.SphereGeometry(.018, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(3, 2, .8), toneMapped: false })); fl.scale.y = 1.8; fl.position.set(dx, .07, dz); B.RANG.add(fl); }
var dl = new T.PointLight(0xffa040, 2.5, 3, 1.5); dl.position.set(0, .35, 0); B.RANG.add(dl);
B.initRangoli = function () {
  RIMG = B.gameToCanvas(3.2);
  var ic = document.createElement('canvas'); ic.width = 128; ic.height = 59; var ig = ic.getContext('2d', { willReadFrequently: true }); ig.drawImage(RIMG, 0, 0, 128, 59); var px = ig.getImageData(0, 0, 128, 59).data;
  for (var k = 0; k < 520; k++) { var x = hsh(k * 3.1) * 127, y = hsh(k * 7.7) * 58, q = (Math.floor(y) * 128 + Math.floor(x)) * 4; RDOTS.push({ x: x / 128, y: y / 59, c: 'rgb(' + px[q] + ',' + px[q + 1] + ',' + px[q + 2] + ')' }); }
  RS = rough.canvas(rC);
};
var FX = 112, FY = 290, FW = 800, FH = 369;
function drawRangoli(nd, lu, fu) {
  var g = rG; g.clearRect(0, 0, 1024, 1024);
  g.fillStyle = 'rgba(255,247,230,.10)'; g.fillRect(40, 40, 944, 944);
  var pet = ['#ff3f8e', '#ffb21e', '#2ec4b6', '#9b7bff'];
  for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; g.fillStyle = pet[i % 4]; g.beginPath(); g.ellipse(512 + Math.cos(a) * 470, 512 + Math.sin(a) * 470, 34, 16, a, 0, 7); g.fill(); }
  g.strokeStyle = '#fff7e6'; g.lineWidth = 6; g.setLineDash([2, 18]); g.lineCap = 'round'; g.strokeRect(80, 80, 864, 864); g.setLineDash([]);
  for (var i = 0; i < 4; i++) { var cx = [180, 844, 180, 844][i], cy = [180, 180, 844, 844][i]; for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; g.fillStyle = pet[(i + k) % 4]; g.beginPath(); g.ellipse(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 26, 11, a, 0, 7); g.fill(); } g.fillStyle = '#fff7e6'; g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(255,247,230,.16)'; g.fillRect(FX - 10, FY - 10, FW + 20, FH + 20); g.strokeStyle = '#fff7e6'; g.lineWidth = 5; g.strokeRect(FX - 14, FY - 14, FW + 28, FH + 28);
  if (fu > 0) { g.save(); g.beginPath(); g.rect(FX, FY, FW, FH); g.clip(); g.beginPath(); g.arc(FX + FW / 2, FY + FH / 2, eio(fu) * 560, 0, 7); g.clip(); g.drawImage(RIMG, FX, FY, FW, FH);
    for (var k = 0; k < 1400; k++) { g.fillStyle = 'rgba(255,255,255,' + hsh(k) * .07 + ')'; g.fillRect(FX + hsh(k * 3) * FW, FY + hsh(k * 5) * FH, 3, 3); } g.restore(); }
  if (lu > 0) { var nl = Math.floor(lu * 220); for (var k = 0; k < nl; k++) { var a = RDOTS[k], b = RDOTS[(k * 37 + 11) % RDOTS.length]; if (Math.abs(a.x - b.x) > .09 || Math.abs(a.y - b.y) > .16) continue;
    RS.line(FX + a.x * FW, FY + a.y * FH, FX + b.x * FW, FY + b.y * FH, { stroke: 'rgba(255,247,230,' + (fu > 0 ? .5 * (1 - fu) : .75) + ')', strokeWidth: 2.2, roughness: 1.2, seed: k + 1 }); } }
  for (var k = 0; k < nd; k++) { var d = RDOTS[k], x = FX + d.x * FW, y = FY + d.y * FH; g.fillStyle = d.c; g.beginPath(); g.arc(x, y, 8.5, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,247,230,' + (fu > .6 ? 0 : .55) + ')'; g.lineWidth = 2; g.stroke(); }
  rTex.needsUpdate = true;
}
var MAKER = B.MAKER = B.voxel({ s: 1.05, top: 0xff3f8e, bot: 0xff3f8e, skin: 0x9a6440, hair: 0x18120f }); MAKER.position.set(1.15 - 1.05, 0, .3 + .1); MAKER.rotation.y = Math.PI / 2; W.add(MAKER);
(function () { var P = MAKER.userData.P; P.legL.rotation.x = -1.3; P.legR.rotation.x = -1.3; P.legL.position.y -= .3; P.legR.position.y -= .3; P.torso.position.y -= .33; P.armL.position.y -= .33; P.armR.position.y -= .33; P.head.position.y -= .33; P.armR.rotation.x = -1.0; P.armL.rotation.x = -.6; P.head.rotation.x = .5; })();
var rangRC = V(1.15, 0, .3);
function rrPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(2.35, 1.5, u), lerp(3.6, 3.1, u), lerp(3.3, 1.8, u)), q: V(1.15, 0, .2), fov: 34, band: rangRC, wid: .13, amp: 28 }; }
var rrState = function (t) { var tb = WS('g12', 'बिंदियों|बिंदि'), tj = WS('g13', 'जोड़|जोड'), tp = WS('g13', 'पूरी'); return { nd: Math.floor(clamp((t - (WS('g12', 'कम') - .1)) / Math.max(1.5, tb - WS('g12', 'कम') + .8)) * RDOTS.length), lu: clamp((t - tj + .8) / 2.4), fu: clamp((t - tp + .2) / 2.6) }; };
function rrAct(t, sc) {
  MAKER.visible = true; var st = rrState(t); drawRangoli(st.nd, st.lu, st.fu); MAKER.userData.P.armR.rotation.x = -1.0 + Math.sin(t * 5) * .12 * (st.lu > 0 && st.fu < 1 ? 1 : 0);
  var tj = WS('g13', 'एआई|फिर');
  kick.textContent = 'JUGAAD 1'; show(kick, t, sc.t0 + .1);
  if (t < tj - .2) { head.innerHTML = 'Kam dhaage =<br>' + AI('bindiyan') + ' hi bindiyan'; show(head, t, sc.t0 + .2); } else { head.innerHTML = 'AI ' + RL('bindu jodkar') + '<br>poori tasveer'; show(head, t, tj - .2); }
  lab(L1, 'sirf thode dhaage', V(.6, 0, 1.25), -80, 10, t, WS('g12', 'कम') + .2, tj - .3);
  lab(L2, 'maahir rangoli wali', V(.05, .7, .4), -40, -90, t, WS('g13', 'माहिर|रंगोली'), WS('g13', 'पूरी') + .3);
  var trr = WS('g13', 'रिकंस्ट्र|रे'); if (t >= trr - .1) popCard(t, trr, 'RAY RECONSTRUCTION', 46);
  card.style.top = '1040px'; card.style.left = '440px';
}

// ================= 7. DLSS SUPER RESOLUTION (g14, g15) — the hoarding painter =================
var POSTER = null, SMALL = null;
B.initPoster = function () {
  POSTER = B.gameShot(3.0, 600, 840, [-14, 3.0, 5.5, 4, 3.2, -6, 62]);
  var s = document.createElement('canvas'); s.width = 150; s.height = 210; s.getContext('2d').drawImage(POSTER, 0, 0, 150, 210); SMALL = s;
  var g = B.smallTex.userData.g, c = B.smallTex.userData.c; c.width = 150; c.height = 210; g.imageSmoothingEnabled = false; g.drawImage(SMALL, 0, 0); B.smallTex.needsUpdate = true;
};
function drawPoster(sk, pu) { // sk: sketch grid strength, pu: painted share (left -> right, top -> bottom sweeps)
  var g = B.posterTex.userData.g, w = 600, h = 840; g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h);
  g.globalAlpha = .35 * sk; g.imageSmoothingEnabled = false; g.drawImage(SMALL, 0, 0, w, h); g.globalAlpha = 1; g.imageSmoothingEnabled = true;
  g.strokeStyle = 'rgba(40,40,60,' + .5 * sk + ')'; g.lineWidth = 2; for (var x = 0; x <= w; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (var y = 0; y <= h; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  if (pu > 0) { var rows = 4, rh = h / rows; for (var r = 0; r < rows; r++) { var k = clamp(pu * rows - r); if (k <= 0) continue; g.save(); g.beginPath(); g.rect(0, r * rh, w * eio(k), rh + 1); g.clip(); g.drawImage(POSTER, 0, 0, w, h); g.restore(); } }
  B.posterTex.needsUpdate = true;
}
function srPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(3.6, 3.2, u), lerp(2.9, 2.8, u), lerp(-12.8, -12.4, u)), q: V(-5.4, 2.5, -11.6), fov: 42, band: V(-5.4, 2.5, -11.6), wid: .2, amp: 20 }; }
function srAct(t, sc) {
  var ts = WS('g14', 'छोटी'), tc4 = WS('g14', 'चार|सिर्फ़|सिर्फ'), tb = WS('g14', 'बड़ा|बडा'), tp = WS('g15', 'पेंटर'), tdl = WS('g15', 'डीएलएसएस|डी');
  var pu = clamp((t - tb + .2) / Math.max(3, tdl - tb + .6)); drawPoster(clamp((t - ts) / .5), pu);
  // painter climbs along the scaffold following the sweep
  var rows = 4, r = Math.min(3, Math.floor(pu * rows)), k = clamp(pu * rows - r), PW = B.HD_PW, PH = B.HD_PH, PY = B.HD_PY;
  var px = -PW / 2 + .2 + eio(k) * (PW - .4), py = PY + PH / 2 - (r + .5) * PH / rows;
  var plank = [.75, 2.05, 3.35].reduce(function (a, b) { return Math.abs(b + .1 - (py - .9)) < Math.abs(a + .1 - (py - .9)) ? b : a; });
  B.PAINTER.visible = true; B.PAINTER.position.set(px, plank + .08, .62); B.PAINTER.userData.P.armR.rotation.set(-2.3 + Math.sin(t * 9) * .25 * (pu > 0 && pu < 1 ? 1 : 0), 0, 0);
  kick.textContent = 'JUGAAD 2'; show(kick, t, sc.t0 + .1);
  if (t < tb - .2) { head.innerHTML = 'Tasveer chhoti:<br>' + RL('4 mein se 1') + ' pixel'; show(head, t, sc.t0 + .2); } else { head.innerHTML = 'AI use banata hai<br>' + AI('bada + saaf'); show(head, t, tb - .2); }
  lab(L1, 'chhoti photo', V(-4.47, 1.6, -10.6), -60, -90, t, ts + .2);
  lab(L2, 'bada poster', V(-5.4, 4.6, -11.6), -100, -60, t, tp);
  if (t >= tdl - .1) popCard(t, tdl, 'DLSS', 64); card.style.top = '1040px'; card.style.left = '520px';
  if (t >= tdl) { sub.textContent = 'DLSS Super Resolution · NVIDIA'; sub.style.top = '500px'; show(sub, t, tdl + .3); }
}

// ================= 8. FRAME GENERATION (g16, g17) — flip-book in the corner of a copy =================
var fbC = V(-.38, .46, 2.25);
function fgPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(-.05, .05, u), lerp(1.25, 1.05, u), lerp(2.95, 2.75, u)), q: fbC.clone().add(V(0, 0, -.02)), fov: 36, band: fbC, wid: .1, amp: 30 }; }
function fgAct(t, sc) {
  var tr = WS('g16', 'कार्ड'), tai = WS('g16', 'बीच'), tfg = WS('g17', 'फ़्रेम|फ्रेम|जनरेशन');
  // flip speed: slow page-by-page while explained, then a fast riffle
  var f = t < tr ? 0 : t < tai ? eio((t - tr) / (tai - tr)) * 1 : 1 + (t - tai) * 2.2; f = f % 8.9;
  B.FLIP.visible = true; B.flipAt(f);
  kick.textContent = 'JUGAAD 3'; show(kick, t, sc.t0 + .1);
  if (t < tai - .2) { head.innerHTML = 'Copy ke kone ki<br>' + RL('flip-book'); show(head, t, sc.t0 + .2); } else { head.innerHTML = '1 ' + RL('asli') + ' page,<br>3 ' + AI('AI') + ' ke pages'; show(head, t, tai - .2); }
  lab(L1, 'asli', fbC.clone().add(V(-.18, .02, -.1)), -60, -40, t, tr, tai + 1.6);
  lab(L2, 'AI ke 3 page', fbC.clone().add(V(.1, .02, .12)), 0, 60, t, tai + .3);
  if (t >= tfg - .1) popCard(t, tfg, 'FRAME GENERATION', 48); card.style.top = '1040px'; card.style.left = '440px';
}

// ================= 9. MATH (g18, g19) — back to the phone: 1/4 x 1/4 = 1/16 =================
function mathPose(t, sc) { return phonePose(t, .14); }
function mathAct(t, sc) {
  gameOnPhone(t, 0, 0);
  var tp = WS('g18', 'पिक्सल'), tt = WS('g18', 'तस्वीर'), t16 = WS('g18', 'सोलह|बटा'), tn = WS('g19', 'एनवीडिया|इसीलिए');
  gridAt(function (r, c) { var a = (t - tp) / .25, b = (t - tt - r * .08) / .25; return c > 0 ? a : (r > 0 ? Math.max(a, b) : a); }, function (r, c) { return c === 0 && (r === 0 || t < tt); });
  kick.textContent = 'AB JODO'; show(kick, t, sc.t0 + .1);
  if (t < t16 - .2) { head.innerHTML = (t < tt - .1 ? RL('4 mein 1') + ' pixel' : RL('4 mein 1') + ' pixel<br>× ' + RL('4 mein 1') + ' tasveer'); show(head, t, sc.t0 + .2); }
  else { head.innerHTML = '¼ × ¼ = ' + AI('1 / 16'); show(head, t, t16 - .2); }
  lab(L1, 'pixel →', V(0, 0, 0).copy(B.PHONE.localToWorld(V(-.02, .052, 0))), -60, -70, t, tp, t16 - .2);
  lab(L2, '↓ tasveer', B.PHONE.localToWorld(V(-.11, .0, 0)), -40, -20, t, tt, t16 - .2);
  if (t >= tn - .2) { sub.textContent = 'NVIDIA ka daawa · DLSS Performance + 4× Frame Generation, 4K'; sub.style.top = '520px'; show(sub, t, tn - .2); }
}

// ================= 10. CATCH (g20, g21, g22) — lag, then console vs PC =================
var tTable = function () { return WS('g21', 'जीटीए|और') - .3; };
function catchPose(t, sc) {
  if (t < tTable()) return phonePose(t, .14);
  var u = eio((t - tTable()) / 1.2), tg = V(.9, 1.05, 3.6);
  return { p: V(lerp(1.4, 1.2, u), lerp(2.3, 2.1, u), lerp(7.4, 7.1, u)), q: tg.clone().add(V(0, .25, 0)), fov: 40, band: tg, wid: .13, amp: 26 };
}
function catchAct(t, sc) {
  var tb = WS('g20', 'बटन'), tl = WS('g20', 'लैग|लेग'), tps = WS('g21', 'पीएस|प्ले'), td = WS('g21', 'डीएलएसएस|डी'), tr = WS('g22', 'रॉकस्टार|रॉक');
  kick.textContent = 'PAR EK PENCH'; show(kick, t, sc.t0 + .1);
  if (t < tTable()) {
    // the button is pressed, the pre-drawn AI pages keep going: the car turns late
    B.gameLane = 2.0 * eio((t - (tb + .45)) / .5); gameOnPhone(t, 0, 0); gridAt(function () { return 0; });
    head.innerHTML = 'AI ke pages button<br>' + AI('nahi sunte'); show(head, t, sc.t0 + .2);
    if (t > tb) { chip.textContent = t < tb + .45 ? '● BUTTON DABAYA' : 'LAG +'; chip.style.background = t < tb + .45 ? C.real : C.ai; chip.style.color = t < tb + .45 ? '#1b1d3a' : '#fff7e6'; place(chip, 156, 540); show(chip, t, tb, .15); }
  } else {
    B.TABLE.visible = true; B.KID.visible = false;
    if (t < tr - .2) { head.innerHTML = 'GTA 6: ' + RL('console') + '<br>DLSS: ' + AI('NVIDIA PC'); show(head, t, tTable() + .1); }
    else { head.innerHTML = 'Rockstar:<br>' + RL('confirm nahi'); show(head, t, tr - .2); }
    lab(L1, 'GTA 6 yahan', V(.48, 1.3, 3.6), -160, -60, t, tps);
    lab(L2, 'DLSS yahan', V(1.32, 1.35, 3.6), -40, -70, t, td);
    if (t >= tr) { sub.textContent = 'GTA 6: PS5 + Xbox Series X|S · 19 Nov 2026 · PC date nahi'; sub.style.top = '520px'; show(sub, t, tr + .2); }
  }
}

// ================= 11. CTA (g23) =================
function ctaPose(t, sc) { var u = eio((t - sc.t0) / 3.5); return { p: V(lerp(2.0, .6, u), lerp(2.6, 9.5, u), lerp(6.6, 8.6, u)), q: V(0, .2, lerp(2.0, -3.0, u)), fov: lerp(36, 42, u), band: V(0, 0, lerp(2, -2, u)), wid: .22, amp: 18 }; }
function ctaAct(t, sc) {
  var tl = WS('g23', 'लाइक'), ts = WS('g23', 'शेयर'), tsu = WS('g23', 'सब्स'), tn = WS('g23', 'नर्ड|लॉजिक');
  endc.style.opacity = clamp((t - (sc.t0 + .3)) / .5); B.TS.fade = Math.max(B.TS.fade, .45 * clamp((t - sc.t0 - .3) / .5));
  [tl, ts, tsu].forEach(function (x, i) { var u = clamp((t - x) / .3); BTN[i].style.opacity = u; BTN[i].style.transform = 'scale(' + (u > 0 ? eob(u) : .5) + ')'; });
  var pulse = 1 + .04 * Math.max(0, Math.sin((t - tn) * 6)) * (t > tn ? 1 : 0); endc.querySelector('img').parentNode.style.transform = 'scale(' + pulse + ')';
}

// ---------- scene list + boundaries ----------
var SC = B.SCN = [
  { g: ['g1', 'g2'], pose: hookPose, act: hookAct },
  { g: ['g3', 'g4', 'g5'], pose: pixPose, act: pixAct, tr: 'fly' },
  { g: ['g6', 'g7'], pose: lightPose, act: lightAct, tr: 'dip' },
  { g: ['g8', 'g9'], pose: rtPose, act: rtAct, tr: 'fly' },
  { g: ['g10', 'g11'], pose: costPose, act: costAct, tr: 'fly' },
  { g: ['g12', 'g13'], pose: rrPose, act: rrAct, tr: 'fly' },
  { g: ['g14', 'g15'], pose: srPose, act: srAct, tr: 'fly' },
  { g: ['g16', 'g17'], pose: fgPose, act: fgAct, tr: 'fly' },
  { g: ['g18', 'g19'], pose: mathPose, act: mathAct, tr: 'dip' },
  { g: ['g20', 'g21', 'g22'], pose: catchPose, act: catchAct, tr: 'none' },
  { g: ['g23'], pose: ctaPose, act: ctaAct, tr: 'fly' }
];
SC.forEach(function (s, i) { var a = GR(s.g[0]); s.t0 = i === 0 ? 0 : (GR(SC[i - 1].g[SC[i - 1].g.length - 1]).end + a.start) / 2; });
SC.forEach(function (s, i) { s.t1 = i < SC.length - 1 ? SC[i + 1].t0 : TM.end; });
B.DUR = TM.end;
// inner dip in scene 2 (jaali -> phone)
B.innerDip = function (t) { var tp = tPhone(); return Math.max(0, 1 - Math.abs(t - tp) / .3); };
B.sceneAt = function (t) { for (var i = SC.length - 1; i >= 0; i--) if (t >= SC[i].t0) return i; return 0; };
B.setCap = function (t) { cap.innerHTML = CAP.html(t, TM.cap, { plain: true, hi: C.real, ink: '#f1f3f8', fs: 40 }); };
})();
/* e_main: load props, build, scene switching with authored camera flights / dips, the render contract, the sound-event list */
(function () {
var T = THREE, clamp = B.clamp, lerp = B.lerp, eio = B.eio, WS = B.WS, GR = B.GR, SC = B.SCN;
window.__reelDurationSec = B.DUR;
window.__ready = false;
var FLY = 1.1;
function applyPose(P) { B.cam.position.copy(P.p); B.cam.lookAt(P.q); B.cam.fov = P.fov; B.cam.updateProjectionMatrix(); B.bandOn(P.band, P.wid, P.amp); B.KID.userData.P.head.visible = !P.hideHead; }
function blendPose(a, b, u) { return { p: a.p.clone().lerp(b.p, u), q: a.q.clone().lerp(b.q, u), fov: lerp(a.fov, b.fov, u), band: a.band.clone().lerp(b.band, u), wid: lerp(a.wid, b.wid, u), amp: lerp(a.amp, b.amp, u), hideHead: u < .5 ? a.hideHead : b.hideHead }; }
// sound events for audio_mix.py (dumped by tools/events.mjs)
function buildEV() {
  var E = [];
  SC.forEach(function (s, i) { if (i) E.push({ t: s.t0, k: s.tr === 'dip' ? 'whoosh' : 'swish' }); });
  E.push({ t: WS('g2', 'सोलह'), k: 'slam' }); for (var i = 0; i < 6; i++) E.push({ t: WS('g2', 'सोलह') + .5 + i * .27, k: 'tick' });
  E.push({ t: WS('g3', 'छेद|रंग'), k: 'sparkle' }); E.push({ t: WS('g4', 'पिक्सल|पिक्सेल'), k: 'card' }); E.push({ t: WS('g5', 'तिरासी|83'), k: 'count' });
  E.push({ t: WS('g7', 'टकरा'), k: 'ping' }); E.push({ t: WS('g7', 'आँख|आंख'), k: 'ping2' });
  E.push({ t: WS('g8', 'धागा'), k: 'zip' }); E.push({ t: WS('g9', 'रे|ट्रेसिंग'), k: 'card' });
  E.push({ t: WS('g10', 'तिरासी|83'), k: 'rumble' }); E.push({ t: WS('g11', 'पचास|50'), k: 'slam' }); E.push({ t: WS('g11', 'सत्रह|17'), k: 'clock' });
  E.push({ t: WS('g12', 'कम'), k: 'sparkle' }); E.push({ t: WS('g13', 'पूरी'), k: 'swell' }); E.push({ t: WS('g13', 'रिकंस्ट्र|रे'), k: 'card' });
  E.push({ t: WS('g14', 'बड़ा|बडा'), k: 'brush' }); E.push({ t: WS('g15', 'डीएलएसएस|डी'), k: 'card' });
  E.push({ t: WS('g16', 'कार्ड'), k: 'flip' }); E.push({ t: WS('g16', 'बीच'), k: 'riffle' }); E.push({ t: WS('g17', 'फ़्रेम|फ्रेम|जनरेशन'), k: 'card' });
  E.push({ t: WS('g18', 'पिक्सल'), k: 'tick' }); E.push({ t: WS('g18', 'तस्वीर'), k: 'tick' }); E.push({ t: WS('g18', 'सोलह|बटा'), k: 'slam' });
  E.push({ t: WS('g20', 'बटन'), k: 'click' }); E.push({ t: WS('g20', 'लैग|लेग'), k: 'buzz' }); E.push({ t: WS('g22', 'रॉकस्टार|रॉक'), k: 'stamp' });
  E.push({ t: WS('g23', 'लाइक'), k: 'pop' }); E.push({ t: WS('g23', 'शेयर'), k: 'pop' }); E.push({ t: WS('g23', 'सब्स'), k: 'pop' });
  E.sort(function (a, b) { return a.t - b.t; }); return E;
}
B.loadModels(['tea_set_01', 'vintage_electric_kettle', 'brass_pot_01', 'brass_pot_02', 'plastic_crate_02', 'plastic_crate_03', 'barrel_03', 'street_lamp_02', 'utility_box_02', 'wicker_basket_01', 'delivery_scooter', 'SportsCar', 'Taxi', 'SUV', 'Streetlight_Single']).then(function () {
  return B.loadLogos();
}).then(function () {
  B.placeProps(); B.placeGame(); B.initThreads(); B.initRangoli(); B.initPoster();
  window.EV = buildEV();
  window.__seek = function (t) {
    var i = B.sceneAt(t), s = SC[i];
    B.UIs.hide(); B.TS.fade = 0; B.gameLane = 0;
    B.KID.visible = true; B.thrG.visible = false; B.SPOOLS.visible = false; B.KID2.visible = false; B.gridOff(); B.phoneMat.uniforms.blocks.value.set(0, 0); B.phoneMat.uniforms.grid.value = 0;
    s.act(t, s);
    var P = s.pose(t, s);
    if (i > 0 && s.tr === 'fly' && t < s.t0 + FLY) { var pv = SC[i - 1]; P = blendPose(pv.pose(s.t0, pv), P, eio((t - s.t0) / FLY)); }
    applyPose(P);
    if (s.tr === 'dip') B.TS.fade = Math.max(B.TS.fade, clamp(1 - (t - s.t0) / .3));
    if (i + 1 < SC.length && SC[i + 1].tr === 'dip') B.TS.fade = Math.max(B.TS.fade, clamp(1 - (s.t1 - t) / .3));
    if (i === 1) B.TS.fade = Math.max(B.TS.fade, B.innerDip(t));
    B.setCap(t);
    B.bulbs.forEach(function (b, k) { b.scale.setScalar(.85 + .3 * (0.5 + 0.5 * Math.sin(t * 3 + k * 1.7))); });
    if (!window.__skipRender) B.render(t);
  };
  window.__seek(0); window.__ready = true;
}).catch(function (e) { console.error('LOAD FAIL', e && e.stack || e); });
window.__view = function (p, q, fov, t) { window.__seek(t || 0); B.cam.position.set(p[0], p[1], p[2]); B.cam.lookAt(q[0], q[1], q[2]); B.cam.fov = fov || 40; B.cam.updateProjectionMatrix(); B.TS.amp = 0; B.render(t || 0); };
})();
