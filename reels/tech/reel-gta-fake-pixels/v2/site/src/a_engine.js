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
