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
  var x = -30 + t * 11; if (B.gameHero) B.gameHero.position.set(x, 0, 2.3);
  B.gameCars.forEach(function (c) { c.o.position.x = c.x0 + c.v * t; });
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
/* d_scenes: mockup scenes A (hook: phone grid), B (jaali + threads), C (rangoli) — each a pure function of t */
(function () {
var T = THREE, S = B.S, W = B.WORLD, cam = B.cam, clamp = B.clamp, lerp = B.lerp, eio = B.eio, eo3 = B.eo3, eob = B.eob, hsh = B.hsh, cv = B.cv, C = B.C;
var UI = document.getElementById('ui');
function el(css, html) { var d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; if (html != null) d.innerHTML = html; UI.appendChild(d); return d; }
B.el = el;
var SH = 'text-shadow:0 4px 14px rgba(10,12,40,.55),0 1px 3px rgba(10,12,40,.8);';
// header: kicker chip + headline (Fredoka), key word in a solid block
var kick = el('left:156px;top:236px;font:600 30px Fredoka;letter-spacing:.08em;color:#1b1d3a;background:' + C.real + ';padding:6px 16px 4px;border-radius:10px;opacity:0');
var head = el('left:156px;top:296px;width:768px;font:700 84px/1.04 Fredoka;color:#fff7e6;letter-spacing:-.01em;' + SH + 'opacity:0');
var blk = function (txt, col, ink) { return '<span style="background:' + col + ';color:' + (ink || '#fff7e6') + ';padding:0 .16em;border-radius:.14em;text-shadow:none;box-decoration-break:clone">' + txt + '</span>'; };
// "ISKO KEHTE HAIN" paper tag with tape
var card = el('left:470px;top:560px;width:420px;padding:22px 26px 18px;background:#fff7e6;border-radius:6px;box-shadow:0 14px 30px rgba(10,12,40,.45);transform-origin:50% 0;opacity:0');
card.innerHTML = '<div style="position:absolute;left:150px;top:-16px;width:120px;height:32px;background:rgba(255,210,63,.85);transform:rotate(-4deg)"></div><div style="font:700 40px Caveat;color:#6a5a7a">isko kehte hain:</div><div class="tm" style="font:700 64px/1 Fredoka;color:#1b1d3a;margin-top:4px"></div>';
var cardTm = card.querySelector('.tm');
// handwritten world labels (chalk) with an arrow line
function chalkLabel() { var d = el('font:700 60px/1 Caveat;color:#fff7e6;' + SH + 'white-space:nowrap;opacity:0'); return d; }
var lab1 = chalkLabel(), lab2 = chalkLabel(), lab3 = chalkLabel();
var cap = document.getElementById('cap');
function setCap(t, words) { cap.innerHTML = words ? CAP.html(t, words, { plain: true, hi: C.real, ink: '#f1f3f8', fs: 40 }) : ''; }
function hideUI() { [kick, head, card, lab1, lab2, lab3].forEach(function (d) { d.style.opacity = 0; }); cap.innerHTML = ''; }
function show(d, t, t0, dur) { var u = clamp((t - t0) / (dur || .35)); d.style.opacity = u; d.style.transform = 'translateY(' + (1 - eo3(u)) * 18 + 'px)'; return u; }
function popCard(t, t0, term) { var u = clamp((t - t0) / .4); card.style.opacity = u > 0 ? 1 : 0; card.style.transform = 'rotate(-3deg) scale(' + (u > 0 ? eob(u) : 0) + ')'; cardTm.textContent = term; }
function place(d, x, y) { d.style.left = x + 'px'; d.style.top = y + 'px'; }
// simple word timing for the mockup captions (the real build uses the voice's Whisper times)
function wordsOf(txt, t0, t1) { var w = txt.split(' '), n = w.length; return w.map(function (x, i) { return { w: x, t0: t0 + (t1 - t0) * i / n, t1: t0 + (t1 - t0) * (i + 1) / n }; }); }

// ================= A: hook — the phone becomes a 4x4 grid; 15 AI, 1 real =================
var GRID = [], REAL = 5;
(function () {
  function tileTex(real) { return cv(128, 128, function (g, w, h) { g.fillStyle = real ? 'rgba(255,178,30,.86)' : 'rgba(255,63,142,.80)'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,247,230,.9)'; g.lineWidth = 5; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = real ? '#1b1d3a' : '#fff7e6'; g.font = '700 ' + (real ? 38 : 56) + 'px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(real ? 'ASLI' : 'AI', w / 2, h / 2 + 3); }); }
  var tr = tileTex(true), ta = tileTex(false), sw = .152 / 4, sh = .07 / 4;
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var i = r * 4 + c, m = new T.Mesh(new T.PlaneGeometry(sw * .96, sh * .94), new T.MeshBasicMaterial({ map: i === REAL ? tr : ta, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    m.position.set(-.076 + (c + .5) * sw, .035 - (r + .5) * sh, .0052); B.PHONE.add(m); GRID.push(m); }
})();
var kidHead = new T.Vector3();
function scnA(t) {
  var tex = B.renderGame(t); B.phoneScreen.material.map = tex; B.phoneScreen.material.needsUpdate = true;
  var K = B.KID, ph = B.PHONE; K.updateMatrixWorld(true);
  var pc = new T.Vector3(); ph.getWorldPosition(pc);
  // over-the-shoulder, then a crane up to show the lane (6.0 -> 8.0)
  var u = eio((t - 5.9) / 2.1), pClose = K.localToWorld(new T.Vector3(0, 1.52, .1)), pFar = new T.Vector3(2.4, 4.2, 7.8);
  var p = pClose.clone().lerp(pFar, u), tg = pc.clone().lerp(new T.Vector3(-.4, 1.0, -1.4), u);
  var push = (1 - u) * eio(t / 6) * .12; p.lerp(pc, push);
  cam.position.copy(p); cam.lookAt(tg.clone().add(new T.Vector3(0, .03 * (1 - u), 0))); cam.fov = lerp(40, 34, u); cam.updateProjectionMatrix();
  K.userData.P.head.visible = u > .3;
  B.bandOn(pc, lerp(.11, .16, u), lerp(30, 20, u));
  GRID.forEach(function (m, i) { var t0 = i === REAL ? 2.1 : 2.6 + (((i * 7) % 16) / 16) * 2.2, k = clamp((t - t0) / .28); m.material.opacity = k > 0 ? (i === REAL ? .95 : .9) : 0; m.scale.set(1, k > 0 ? eob(k) : .001, 1); });
  hideUI();
  kick.textContent = 'GTA 6 · 19 NOV'; show(kick, t, -1);
  if (t < 2.2) { head.innerHTML = 'GTA 6 aa raha hai!'; show(head, t, -1); }
  else { head.innerHTML = '16 mein se 15 dabbe<br>' + blk('AI', C.ai) + ' ne banaye!'; show(head, t, 2.25); }
  setCap(t, t < 1.6 ? wordsOf('GTA 6 aa raha hai! Par ek baat sunke chaunk jaoge.', 0, 1.6) : wordsOf('Aise game ki tasveer ke har 16 dabbon mein se 15 computer ne banaye hi nahi. AI ne andaaza lagaya!', 1.6, 7.6));
}

// ================= B: jaali — a thread from the eye through every hole =================
var KID2 = B.voxel({ s: 1.12, top: 0xffd23f, bot: 0x2f4fa8, skin: 0xa86f48 }); KID2.position.set(-.45, 0, -5.2); KID2.rotation.y = Math.PI; W.add(KID2);
KID2.userData.P.head.rotation.y = .05;
var TH = [], thrG = B.thrG = new T.Group(), EYE = new T.Vector3(); S.add(thrG);
B.initThreads = function () {
  W.updateMatrixWorld(true); KID2.userData.P.head.getWorldPosition(EYE); EYE.y += .2 * 1.12; EYE.z -= .14;
  // colour of each hole = what the eye really sees through it: render the lane from the eye with the jaali hidden
  B.jaaliMesh.visible = false; B.jPix.forEach(function (p) { p.m.visible = false; }); KID2.visible = false;
  var J = B.JAALI, jc0 = new T.Vector3(0, 1.45, 0).applyMatrix4(J.matrixWorld), ecam = new T.PerspectiveCamera(30, 1, .05, 300);
  ecam.position.copy(EYE); ecam.lookAt(jc0); var dist = EYE.distanceTo(jc0); ecam.fov = 2 * Math.atan(B.JS_HALF / dist) * 180 / Math.PI; ecam.updateProjectionMatrix();
  var R = B.R, N = 256; R.setRenderTarget(null); R.setViewport(0, 0, N, N); R.setScissor(0, 0, N, N); R.setScissorTest(true); R.render(S, ecam); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  var c = document.createElement('canvas'); c.width = N; c.height = N; var g = c.getContext('2d'); g.drawImage(R.domElement, 0, B.H - N, N, N, 0, 0, N, N);
  B.jaaliMesh.visible = true; B.jPix.forEach(function (p) { p.m.visible = true; }); KID2.visible = true;
  var rc = new T.Raycaster(), targets = []; W.traverse(function (o) { if (o.isMesh && o !== B.jaaliMesh && B.jPix.every(function (p) { return p.m !== o; })) targets.push(o); });
  KID2.traverse(function (o) { var i = targets.indexOf(o); if (i >= 0) targets.splice(i, 1); });
  B.jPix.forEach(function (p, k) {
    var hp = new T.Vector3(); p.m.getWorldPosition(hp); var dir = hp.clone().sub(EYE).normalize(); rc.set(EYE, dir); rc.far = 60;
    var hit = rc.intersectObjects(targets, false).filter(function (h) { return h.distance > EYE.distanceTo(hp) + .2; })[0];
    var end = hit ? hit.point : EYE.clone().addScaledVector(dir, 45);
    var sp = hp.clone().project(ecam), px = Math.round((sp.x + 1) / 2 * N), py = Math.round((1 - sp.y) / 2 * N), d = g.getImageData(clamp(px - 3, 0, N - 7), clamp(py - 3, 0, N - 7), 7, 7).data, rr = 0, gg = 0, bb = 0;
    for (var q = 0; q < d.length; q += 4) { rr += d[q]; gg += d[q + 1]; bb += d[q + 2]; } var nq = d.length / 4;
    var col = new T.Color('rgb(' + Math.round(rr / nq) + ',' + Math.round(gg / nq) + ',' + Math.round(bb / nq) + ')');
    var geo = new T.BufferGeometry().setFromPoints([EYE, end]); var ln = new T.Line(geo, new T.LineBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(1.6), transparent: true, opacity: .9, toneMapped: false }));
    thrG.add(ln); var dot = new T.Mesh(new T.SphereGeometry(.035, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(2.2), toneMapped: false })); thrG.add(dot);
    TH.push({ ln: ln, dot: dot, end: end, hp: hp, col: col, ord: (B.JN - 1 - p.r) * B.JN + p.c, p: p });
  });
};
function scnB(t) { B.KID.userData.P.head.visible = true;
  var lt = t - 8; W.updateMatrixWorld(true);
  var jc = new T.Vector3(0, 1.45, -7.4);
  // shot 1 (0-6): behind the kid's head, the jaali fills the frame; shot 2 (6-12): truck right + crane to see threads reach the well
  var u = eio((lt - 6.2) / 4.5);
  var p1 = new T.Vector3(1.3, 3.9, 2.0), p2 = new T.Vector3(2.1, 5.6, -3.6);
  cam.position.copy(p1.clone().lerp(p2, u)); cam.lookAt(jc.clone().add(new T.Vector3(0, .15, 0)).lerp(new T.Vector3(.2, .9, -9.4), u)); cam.fov = lerp(34, 38, u); cam.updateProjectionMatrix();
  B.bandOn(jc.clone().lerp(new T.Vector3(.2, 1.0, -9.0), u), lerp(.1, .2, u), 24);
  var n = TH.length;
  TH.forEach(function (h) {
    var t0 = 1.6 + h.ord / n * 4.2, k = clamp((lt - t0) / .55); // thread grows eye -> hole -> what it hits
    var cur = EYE.clone().lerp(h.end, eo3(k)); h.ln.geometry.setFromPoints([EYE, cur]); h.ln.visible = k > 0; h.dot.visible = k > 0 && k < 1; h.dot.position.copy(cur);
    h.ln.material.opacity = k >= 1 ? lerp(.85, .35, clamp((lt - t0 - .6) / 1.5)) : .9;
    var f = clamp((k - .55) / .3); h.p.m.material.color.copy(h.col).multiplyScalar(1.05); h.p.m.material.opacity = f;
  });
  hideUI();
  kick.textContent = 'TASVEER KAISE BANTI HAI?'; show(kick, t, 8.1);
  head.innerHTML = 'Har chhed tak<br>ek ' + blk('dhaaga', C.real, '#1b1d3a'); show(head, t, 8.2);
  var e = B.toScr(EYE), j = B.toScr(new T.Vector3(.35, 2.55, -7.4));
  lab1.textContent = 'aankh'; place(lab1, clamp(e.x + 70, 160, 760), clamp(e.y - 30, 480, 1220)); if (lt < 6) show(lab1, t, 9.2);
  lab2.textContent = 'har chhed = 1 rang'; place(lab2, clamp(j.x, 160, 560), clamp(j.y - 70, 480, 1220)); if (lt < 6) show(lab2, t, 10.4);
  if (lt > 7.4) popCard(t, 15.6, 'RAY TRACING'); card.style.top = '1030px'; card.style.left = '470px';
  setCap(t, wordsOf('Aankh se har chhed ki taraf ek dhaaga bhejo. Dhaaga jahaan takraaye, wahaan se poochho: yahaan kitni roshni hai?', 8.4, 19.6));
}

// ================= C: rangoli — few dots, then the AI joins them into the full picture =================
var rTex = cv(1024, 1024, function () {}), rC = rTex.userData.c, rG = rTex.userData.g, RIMG = null, RDOTS = [], RS = null;
var rang = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), new T.MeshStandardMaterial({ map: rTex, roughness: .95, transparent: true })); rang.rotation.x = -Math.PI / 2; rang.receiveShadow = true; B.RANG.add(rang);
// brass diyas around the rangoli
for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2, dx = Math.cos(a) * .95, dz = Math.sin(a) * .95; var dy = new T.Mesh(new T.CylinderGeometry(.05, .03, .04, 12), B.std(0xb87333, .35, .8)); dy.position.set(dx, .02, dz); B.RANG.add(dy); var fl = new T.Mesh(new T.SphereGeometry(.018, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(3, 2, .8), toneMapped: false })); fl.scale.y = 1.8; fl.position.set(dx, .07, dz); B.RANG.add(fl); }
var dl = new T.PointLight(0xffa040, 2.5, 3, 1.5); dl.position.set(0, .35, 0); B.RANG.add(dl);
B.initRangoli = function () {
  RIMG = B.gameToCanvas(3.2); // a real frame of our game, used as the picture inside the rangoli
  var ic = document.createElement('canvas'); ic.width = 128; ic.height = 59; var ig = ic.getContext('2d'); ig.drawImage(RIMG, 0, 0, 128, 59); var px = ig.getImageData(0, 0, 128, 59).data;
  for (var k = 0; k < 520; k++) { var x = hsh(k * 3.1) * 127, y = hsh(k * 7.7) * 58, q = (Math.floor(y) * 128 + Math.floor(x)) * 4; RDOTS.push({ x: x / 128, y: y / 59, c: 'rgb(' + px[q] + ',' + px[q + 1] + ',' + px[q + 2] + ')', s: k }); }
  RS = rough.canvas(rC);
};
var FX = 112, FY = 290, FW = 800, FH = 369; // picture frame inside the rangoli square (game aspect)
function drawRangoli(lt) {
  var g = rG; g.clearRect(0, 0, 1024, 1024);
  // traditional border: concentric dotted rings + petals, always present (the rangoli wali's frame)
  g.fillStyle = 'rgba(255,247,230,.10)'; g.fillRect(40, 40, 944, 944);
  var pet = ['#ff3f8e', '#ffb21e', '#2ec4b6', '#9b7bff'];
  for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; g.fillStyle = pet[i % 4]; g.beginPath(); g.ellipse(512 + Math.cos(a) * 470, 512 + Math.sin(a) * 470, 34, 16, a, 0, 7); g.fill(); }
  g.strokeStyle = '#fff7e6'; g.lineWidth = 6; g.setLineDash([2, 18]); g.lineCap = 'round'; g.strokeRect(80, 80, 864, 864); g.setLineDash([]);
  for (var i = 0; i < 4; i++) { var cx = [180, 844, 180, 844][i], cy = [180, 180, 844, 844][i]; for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; g.fillStyle = pet[(i + k) % 4]; g.beginPath(); g.ellipse(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 26, 11, a, 0, 7); g.fill(); } g.fillStyle = '#fff7e6'; g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fill(); }
  // the frame
  g.fillStyle = 'rgba(255,247,230,.16)'; g.fillRect(FX - 10, FY - 10, FW + 20, FH + 20); g.strokeStyle = '#fff7e6'; g.lineWidth = 5; g.strokeRect(FX - 14, FY - 14, FW + 28, FH + 28);
  // phase 1: dots appear (few rays)
  var nd = Math.floor(clamp(lt / 2.6) * RDOTS.length);
  // phase 2: AI fill spreads outward from the centre (a reveal of the full image, powder-textured)
  var fu = clamp((lt - 4.2) / 4.2);
  if (fu > 0) { g.save(); g.beginPath(); g.rect(FX, FY, FW, FH); g.clip(); var rad = eio(fu) * 560; g.beginPath(); g.arc(FX + FW / 2, FY + FH / 2, rad, 0, 7); g.clip(); g.drawImage(RIMG, FX, FY, FW, FH);
    for (var k = 0; k < 1400; k++) { g.fillStyle = 'rgba(255,255,255,' + hsh(k) * .07 + ')'; g.fillRect(FX + hsh(k * 3) * FW, FY + hsh(k * 5) * FH, 3, 3); } g.restore(); }
  // chalk lines joining neighbouring dots (the AI "joining the dots"), drawn just ahead of the fill
  var lu = clamp((lt - 2.8) / 3.0);
  if (lu > 0) { var nl = Math.floor(lu * 220); for (var k = 0; k < nl; k++) { var a = RDOTS[k], b = RDOTS[(k * 37 + 11) % RDOTS.length]; if (Math.abs(a.x - b.x) > .09 || Math.abs(a.y - b.y) > .16) continue;
    RS.line(FX + a.x * FW, FY + a.y * FH, FX + b.x * FW, FY + b.y * FH, { stroke: 'rgba(255,247,230,' + (fu > 0 ? .5 * (1 - fu) : .75) + ')', strokeWidth: 2.2, roughness: 1.2, seed: k + 1 }); } }
  for (var k = 0; k < nd; k++) { var d = RDOTS[k], x = FX + d.x * FW, y = FY + d.y * FH; g.fillStyle = d.c; g.beginPath(); g.arc(x, y, 8.5, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,247,230,' + (fu > .6 ? 0 : .55) + ')'; g.lineWidth = 2; g.stroke(); }
  rTex.needsUpdate = true;
}
var MAKER = B.voxel({ s: 1.05, top: 0xff3f8e, bot: 0xff3f8e, skin: 0x9a6440, hair: 0x18120f }); MAKER.position.set(1.15 - 1.05, 0, .3 + .1); MAKER.rotation.y = Math.PI / 2; W.add(MAKER);
(function () { var P = MAKER.userData.P; P.legL.rotation.x = -1.3; P.legR.rotation.x = -1.3; P.legL.position.y -= .3; P.legR.position.y -= .3; P.torso.position.y -= .33; P.armL.position.y -= .33; P.armR.position.y -= .33; P.head.position.y -= .33; P.armR.rotation.x = -1.0; P.armL.rotation.x = -.6; P.head.rotation.x = .5; })();
MAKER.visible = false; B.MAKER = MAKER;
function scnC(t) {
  var lt = t - 20; MAKER.visible = true; drawRangoli(lt);
  var rc = new T.Vector3(1.15, 0, .3);
  var u = eio(lt / 12); // slow, authored descent from a high oblique to nearly top-down
  cam.position.set(lerp(1.15 + 1.2, 1.15 + .35, u), lerp(3.6, 3.1, u), lerp(.3 + 3.0, .3 + 1.5, u)); cam.lookAt(rc.x, 0, rc.z - .1); cam.fov = 34; cam.updateProjectionMatrix();
  var P = MAKER.userData.P; P.armR.rotation.x = -1.0 + Math.sin(lt * 5) * .12;
  B.bandOn(rc, .13, 28);
  hideUI();
  kick.textContent = 'JUGAAD 1'; show(kick, t, 20.1);
  if (lt < 4.2) head.innerHTML = 'Kam dhaage =<br>' + blk('bindiyan', C.ai) + ' hi bindiyan'; else head.innerHTML = 'AI ' + blk('bindu jodkar', C.real, '#1b1d3a') + '<br>poori tasveer banata hai';
  show(head, t, lt < 4.2 ? 20.2 : 24.2);
  var s = B.toScr(new T.Vector3(rc.x - .55, 0, rc.z + .95)); lab1.textContent = 'sirf thode dhaage'; place(lab1, clamp(s.x - 80, 160, 600), clamp(s.y + 10, 480, 1230)); if (lt < 4.2) show(lab1, t, 21.6);
  if (lt > 8.4) { popCard(t, 28.4, 'RAY RECONSTRUCTION'); card.style.top = '1040px'; card.style.left = '420px'; cardTm.style.fontSize = '50px'; }
  setCap(t, wordsOf('Tasveer bindiyon wali banti hai, jaise rangoli ke bindu. Phir AI, ek maahir rangoli wali ki tarah, bindu jodkar poori tasveer bana deta hai.', 20.3, 31.6));
}
B.SCN = [{ t0: 0, t1: 8, f: scnA }, { t0: 8, t1: 20, f: scnB }, { t0: 20, t1: 32, f: scnC }];
})();
/* e_main: load props, build, expose the render contract */
(function () {
window.__reelDurationSec = 32;
window.__ready = false;
B.loadModels(['tea_set_01', 'vintage_electric_kettle', 'brass_pot_01', 'brass_pot_02', 'plastic_crate_02', 'plastic_crate_03', 'barrel_03', 'street_lamp_02', 'utility_box_02', 'wicker_basket_01', 'delivery_scooter', 'SportsCar', 'Taxi', 'SUV', 'Streetlight_Single']).then(function () {
  B.placeProps(); B.placeGame(); B.initThreads(); B.initRangoli();
  window.__seek = function (t) {
    var sc = B.SCN.filter(function (s) { return t >= s.t0 && t < s.t1; })[0] || B.SCN[B.SCN.length - 1];
    B.thrG.visible = sc === B.SCN[1]; B.MAKER.visible = sc === B.SCN[2];
    sc.f(t); B.bulbs.forEach(function (b, i) { b.scale.setScalar(.85 + .3 * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.7))); });
    if (!window.__skipRender) B.render(t);
  };
  window.__seek(0); window.__ready = true;
}).catch(function (e) { console.error('LOAD FAIL', e && e.message); });
})();
window.__view = function (p, q, fov, t) { window.__seek(t || 0); B.cam.position.set(p[0], p[1], p[2]); B.cam.lookAt(q[0], q[1], q[2]); B.cam.fov = fov || 40; B.cam.updateProjectionMatrix(); B.TS.amp = 0; B.render(t || 0); };
