/* Pushpak anatomy — mockup stills. ?s=1 hook (design sheets), 2 exploded Pushpak from Valmiki's verses, 3 the 1918 "manual" + IISc 1974, 4 the return flight on a real map.
   three.js r160; scene -> HDR RT -> bloom -> ACES grade. Every visual is a pure function of t (window.__seek). */
(function () {
var T = THREE, W = 1080, H = 1920;
var C = { lapis: 0x07102e, gold: 0xe8b04a, chalk: '#f4ecd8', ver: '#ff6a4a', teal: '#3fd0c9', crystal: 0xcfefff };
var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)); };
var eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
var hsh = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace;
R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
var S = new T.Scene(), cam = new T.PerspectiveCamera(30, W / H, .05, 800);
var ov = document.getElementById('ov'), svg = document.getElementById('lines');
function cv(w, h, f) { var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'); f(g, w, h, c); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
function el(cls, html, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; ov.appendChild(d); return d; }

// ---------- studio environment (gold needs something to reflect) ----------
function grad(top, mid, bot) { return new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: { a: { value: new T.Color(top) }, b: { value: new T.Color(mid) }, c: { value: new T.Color(bot) } },
  vertexShader: 'varying vec3 vP; void main(){ vP=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform vec3 a,b,c; varying vec3 vP; void main(){ float y=vP.y; vec3 col = y>0. ? mix(b,a,smoothstep(0.,.8,y)) : mix(b,c,smoothstep(0.,-.6,y)); gl_FragColor=vec4(col,1.); }' }); }
var pm = new T.PMREMGenerator(R), envS = new T.Scene();
envS.add(new T.Mesh(new T.SphereGeometry(50, 32, 16), grad(0x1a2a6a, 0x3a3060, 0x0a0a18)));
[[0, 30, -20, 40, 3, 8, 6], [-28, 10, 10, 3, 18, 30, 3], [26, 14, -8, 3, 14, 20, 2.2], [0, -6, 30, 30, 2, 2, 1.2]].forEach(function (q) {
  var m = new T.Mesh(new T.BoxGeometry(q[3], q[4], q[5]), new T.MeshBasicMaterial({ color: new T.Color(1, .92, .8).multiplyScalar(q[6]) })); m.position.set(q[0], q[1], q[2]); m.lookAt(0, 0, 0); envS.add(m); });
S.environment = pm.fromScene(envS, .015).texture; S.environmentIntensity = 1.0;
var key = new T.DirectionalLight(0xffe2b0, 2.6); key.position.set(-6, 12, 8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
var ksc = key.shadow.camera; ksc.left = -12; ksc.right = 12; ksc.top = 14; ksc.bottom = -12; ksc.far = 60; key.shadow.bias = -.0004; S.add(key);
var rim = new T.DirectionalLight(0x6fa8ff, 1.6); rim.position.set(8, 4, -10); S.add(rim);
S.add(new T.HemisphereLight(0x3a4a9a, 0x140c08, .35));

// ---------- post: HDR -> bloom -> ACES grade ----------
var rtA = new T.WebGLRenderTarget(W, H, { samples: 4, type: T.HalfFloatType }), q4 = function () { return new T.WebGLRenderTarget(W / 4, H / 4, { type: T.HalfFloatType }); }, rB1 = q4(), rB2 = q4();
var pq = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), pS = new T.Scene(), quad = new T.Mesh(new T.PlaneGeometry(2, 2)); pS.add(quad);
var VS = 'varying vec2 vU; void main(){ vU=uv; gl_Position=vec4(position.xy,0.,1.); }';
var mBright = new T.ShaderMaterial({ uniforms: { tex: { value: null } }, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; varying vec2 vU; void main(){ vec3 c=texture2D(tex,vU).rgb; float l=dot(c,vec3(.2126,.7152,.0722)); gl_FragColor=vec4(c*smoothstep(.9,2.2,l),1.); }' });
var mBlur = new T.ShaderMaterial({ uniforms: { tex: { value: null }, dir: { value: new T.Vector2() } }, vertexShader: VS, fragmentShader: 'uniform sampler2D tex; uniform vec2 dir; varying vec2 vU; void main(){ vec3 s=vec3(0.); float tw=0.; for(int i=-10;i<=10;i++){ float f=float(i); float w=exp(-f*f/40.); s+=texture2D(tex,vU+dir*f).rgb*w; tw+=w; } gl_FragColor=vec4(s/tw,1.); }' });
var mGrade = new T.ShaderMaterial({ uniforms: { tex: { value: null }, bl: { value: null }, t: { value: 0 }, exp: { value: 1 }, fade: { value: 0 }, shake: { value: new T.Vector2() } }, vertexShader: VS,
  fragmentShader: 'uniform sampler2D tex, bl; uniform float t, exp, fade; uniform vec2 shake; varying vec2 vU; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }' +
  'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }' +
  'void main(){ vec2 uv=vU+shake; vec3 c=(texture2D(tex,uv).rgb + texture2D(bl,uv).rgb*.55)*exp; c=aces(c); c=pow(c,vec3(1./2.2)); vec2 q=vU-.5; c*=1.-dot(q*vec2(1.,.75),q*vec2(1.,.75))*1.1; c+=(h(vU*vec2(1080.,1920.)+t)-.5)*.02; c=mix(c,vec3(.027,.063,.18),fade); gl_FragColor=vec4(c,1.); }' });
[mBright, mBlur, mGrade].forEach(function (m) { m.depthTest = false; m.toneMapped = false; });
function render(t) {
  R.setRenderTarget(rtA); R.render(S, cam);
  quad.material = mBright; mBright.uniforms.tex.value = rtA.texture; R.setRenderTarget(rB1); R.render(pS, pq);
  for (var k = 0; k < 2; k++) { quad.material = mBlur; mBlur.uniforms.tex.value = rB1.texture; mBlur.uniforms.dir.value.set(4 / W * (k + 1), 0); R.setRenderTarget(rB2); R.render(pS, pq);
    mBlur.uniforms.tex.value = rB2.texture; mBlur.uniforms.dir.value.set(0, 4 / H * (k + 1)); R.setRenderTarget(rB1); R.render(pS, pq); }
  quad.material = mGrade; mGrade.uniforms.tex.value = rtA.texture; mGrade.uniforms.bl.value = rB1.texture; mGrade.uniforms.t.value = t; R.setRenderTarget(null); R.render(pS, pq);
}
var v3 = new T.Vector3();
function scr(p) { cam.updateMatrixWorld(); v3.copy(p).project(cam); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H }; }
function leader(a, b, col) { var l = document.createElementNS('http://www.w3.org/2000/svg', 'path'); l.setAttribute('d', 'M' + a.x + ' ' + a.y + ' L' + b.x + ' ' + b.y); l.setAttribute('stroke', col || '#f4ecd8'); l.setAttribute('stroke-width', '2'); l.setAttribute('fill', 'none'); l.setAttribute('opacity', '.8'); svg.appendChild(l);
  var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', a.x); c.setAttribute('cy', a.y); c.setAttribute('r', 6); c.setAttribute('fill', col || '#f4ecd8'); svg.appendChild(c); }
function fitV(target, dir, pTop, pBot, yTop, yBot) {
  var dist = 30, up = new T.Vector3();
  for (var k = 0; k < 120; k++) { cam.position.copy(target).addScaledVector(dir, dist); cam.lookAt(target); cam.updateMatrixWorld();
    var a = scr(pTop).y, b = scr(pBot).y; dist *= Math.pow((b - a) / (yBot - yTop), .7);
    var vh = 2 * dist * Math.tan(cam.fov * Math.PI / 360); up.set(0, 1, 0).applyQuaternion(cam.quaternion);
    target.addScaledVector(up, -((a + b) / 2 - (yTop + yBot) / 2) / H * vh * .7); }
  cam.position.copy(target).addScaledVector(dir, dist); cam.lookAt(target); cam.updateMatrixWorld(); }
var bg = new T.Mesh(new T.SphereGeometry(300, 32, 16), grad(0x0b1a52, 0x07102e, 0x030612)); S.add(bg);
// star dust (fixed positions)
(function () { var n = 900, g = new T.BufferGeometry(), p = new Float32Array(n * 3); for (var i = 0; i < n; i++) { var u = hsh(i) * 6.283, v = hsh(i + 9) * 2 - 1, r = 200; p[i * 3] = r * Math.sqrt(1 - v * v) * Math.cos(u); p[i * 3 + 1] = r * v; p[i * 3 + 2] = r * Math.sqrt(1 - v * v) * Math.sin(u); }
  g.setAttribute('position', new T.BufferAttribute(p, 3)); S.add(window.__STARS = new T.Points(g, new T.PointsMaterial({ color: 0xbfd0ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: .55 }))); })();

// ---------- materials ----------
var GOLD = new T.MeshStandardMaterial({ color: 0xffc35a, metalness: 1, roughness: .26 });
var GOLD2 = new T.MeshStandardMaterial({ color: 0xd99a3a, metalness: 1, roughness: .38 });
var SILV = new T.MeshStandardMaterial({ color: 0xdfe6f0, metalness: 1, roughness: .22 });
var CRYS = new T.MeshPhysicalMaterial({ color: 0xdff6ff, metalness: 0, roughness: .04, transmission: 1, thickness: .35, ior: 1.5, transparent: true, opacity: 1, envMapIntensity: 1.4 });
var SAPH = new T.MeshPhysicalMaterial({ color: 0x2f62ff, roughness: .05, metalness: 0, transmission: .6, thickness: .3, emissive: 0x0b2a90, emissiveIntensity: .6 });
var EMER = new T.MeshPhysicalMaterial({ color: 0x1fd27a, roughness: .05, transmission: .6, thickness: .3, emissive: 0x0a5a30, emissiveIntensity: .6 });
var CORAL = new T.MeshStandardMaterial({ map: cv(1024, 1024, function (g, w, h) { g.fillStyle = '#b8402c'; g.fillRect(0, 0, w, h);
  for (var i = 0; i < 1400; i++) { g.fillStyle = 'rgba(255,' + (120 + hsh(i) * 80 | 0) + ',90,' + (.08 + hsh(i + 3) * .2) + ')'; g.beginPath(); g.arc(hsh(i * 3) * w, hsh(i * 7) * h, 2 + hsh(i * 5) * 9, 0, 7); g.fill(); }
  g.strokeStyle = '#ffd27a'; g.lineWidth = 6; for (var r = 120; r < 520; r += 130) { g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); }
  for (var k = 0; k < 24; k++) { var a = k / 24 * 6.283; g.fillStyle = k % 2 ? '#2f62ff' : '#1fd27a'; g.beginPath(); g.arc(w / 2 + Math.cos(a) * 380, h / 2 + Math.sin(a) * 380, 16, 0, 7); g.fill(); } }), roughness: .5, metalness: .1 });
var SWAN = cv(2048, 128, function (g, w, h) { g.fillStyle = '#0e2a7a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd27a'; g.fillRect(0, 6, w, 6); g.fillRect(0, h - 12, w, 6);
  g.fillStyle = '#f4ecd8'; for (var i = 0; i < 16; i++) { var x = i * w / 16 + 40, y = 74; g.beginPath(); g.ellipse(x + 22, y, 30, 15, 0, 0, 7); g.fill();
    g.beginPath(); g.moveTo(x - 4, y - 4); g.quadraticCurveTo(x - 18, y - 40, x - 2, y - 46); g.lineTo(x + 6, y - 44); g.quadraticCurveTo(x - 6, y - 34, x + 8, y - 4); g.fill(); g.fillStyle = '#ff9a3a'; g.fillRect(x - 12, y - 47, 10, 4); g.fillStyle = '#f4ecd8'; } });
var SWANM = new T.MeshStandardMaterial({ map: SWAN, roughness: .5, metalness: .2 });

// ---------- the Pushpak, built from Valmiki's verses (OUR 3D) ----------
function lathe(pts, m, seg) { return new T.Mesh(new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), seg || 8), m); }
function shikhara(r, h, m) { var g = new T.Group(), n = 7; for (var i = 0; i < n; i++) { var f = i / n, rr = r * (1 - f * .82), hh = h / n;
    var tier = new T.Mesh(new T.CylinderGeometry(rr * .93, rr, hh * .8, 8), m); tier.position.y = i * hh + hh * .4; g.add(tier);
    var lip = new T.Mesh(new T.CylinderGeometry(rr * 1.04, rr * 1.04, hh * .18, 8), GOLD2); lip.position.y = i * hh + hh * .88; g.add(lip); }
  var am = new T.Mesh(new T.TorusGeometry(r * .2, r * .07, 8, 20), GOLD); am.rotation.x = Math.PI / 2; am.position.y = h + r * .02; g.add(am);
  var kal = lathe([[0, 0], [r * .12, .02], [r * .14, r * .12], [r * .06, r * .22], [r * .08, r * .3], [0, r * .42]], GOLD, 16); kal.position.y = h + r * .05; g.add(kal); return g; }
var P = new T.Group(); S.add(P); S.add(key.target); var L = {};
function layer(name) { var g = new T.Group(); P.add(g); L[name] = g; return g; }
(function () {
  // L deck: coral & gem floor (5.9.17) + swan band rim (6.123.1)
  var d = layer('deck'); var top = new T.Mesh(new T.CylinderGeometry(2.3, 2.3, .08, 8), [SWANM, CORAL, GOLD2]); top.position.y = .04; d.add(top);
  var rimB = new T.Mesh(new T.CylinderGeometry(2.36, 2.2, .34, 8, 1, true), SWANM); rimB.position.y = -.17; d.add(rimB);
  var keel = lathe([[2.2, -.34], [1.7, -.62], [.9, -.86], [.25, -1.02], [0, -1.05]], GOLD2, 8); d.add(keel);
  // L stairs (5.9.15): four golden flights
  var st = layer('stairs'); for (var s = 0; s < 4; s++) { var sg = new T.Group(); for (var k = 0; k < 6; k++) { var b = new T.Mesh(new T.BoxGeometry(.7, .09, .2), GOLD); b.position.set(0, k * .09, -k * .2); sg.add(b); }
    sg.position.set(0, -.5, 2.6); var w = new T.Group(); w.add(sg); w.rotation.y = s * Math.PI / 2 + Math.PI / 4; st.add(w); }
  // L pillars (5.9.13): wolf-carved pillars, gold & silver
  var pl = layer('pillars'); for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283 + .13, m = i % 2 ? SILV : GOLD, pg = new T.Group();
    var shaft = new T.Mesh(new T.CylinderGeometry(.075, .09, 1.15, 12), m); shaft.position.y = .58; pg.add(shaft);
    for (var b2 = 0; b2 < 3; b2++) { var band = new T.Mesh(new T.TorusGeometry(.1, .025, 6, 14), GOLD2); band.rotation.x = Math.PI / 2; band.position.y = .25 + b2 * .33; pg.add(band); }
    var cap = new T.Mesh(new T.CylinderGeometry(.16, .1, .12, 8), GOLD); cap.position.y = 1.2; pg.add(cap); pg.position.set(Math.cos(a) * 1.85, 0, Math.sin(a) * 1.85); pl.add(pg); }
  // L crystal windows + ventilation holes (5.9.16)
  var cw = layer('crystal'); for (var j = 0; j < 8; j++) { var a2 = j / 8 * 6.283 + Math.PI / 8, wg = new T.Group();
    var pane = new T.Mesh(new T.BoxGeometry(1.1, .62, .06), CRYS); pane.position.y = .38; wg.add(pane);
    var fr = new T.Mesh(new T.TorusGeometry(.45, .03, 6, 4), GOLD); fr.scale.set(1.25, .85, 1); fr.rotation.z = Math.PI / 4; fr.position.y = .38; wg.add(fr);
    for (var v = 0; v < 4; v++) { var vh = new T.Mesh(new T.TorusGeometry(.055, .018, 6, 14), GOLD); vh.position.set(-.33 + v * .22, .82, .01); wg.add(vh);
      var hole = new T.Mesh(new T.CircleGeometry(.05, 14), new T.MeshBasicMaterial({ color: 0x05070f })); hole.position.set(-.33 + v * .22, .82, .0); wg.add(hole); }
    wg.position.set(Math.cos(a2) * 1.62, 0, Math.sin(a2) * 1.62); wg.rotation.y = -a2 + Math.PI / 2; cw.add(wg); }
  var core = new T.Mesh(new T.CylinderGeometry(1.45, 1.45, .95, 8), new T.MeshStandardMaterial({ color: 0x0e1a48, roughness: .5, metalness: .4, emissive: 0x7a3c0c, emissiveIntensity: .55 })); core.position.y = .45; cw.add(core);
  // L frame: gold rings + gem studs (5.8.1) + bells (6.124)
  var fm = layer('frame'); [2.05, 1.7].forEach(function (r, i) { var ring = new T.Mesh(new T.TorusGeometry(r, .07, 10, 8), GOLD); ring.rotation.x = Math.PI / 2; ring.rotation.z = Math.PI / 8; ring.position.y = i * .2; fm.add(ring); });
  for (var g2 = 0; g2 < 16; g2++) { var a3 = g2 / 16 * 6.283, gem = new T.Mesh(new T.IcosahedronGeometry(.085, 0), g2 % 2 ? SAPH : EMER); gem.position.set(Math.cos(a3) * 2.05, .02, Math.sin(a3) * 2.05); fm.add(gem);
    var bell = lathe([[0, 0], [.04, -.02], [.07, -.12], [.09, -.2], [0, -.2]], GOLD, 12); bell.position.set(Math.cos(a3 + .2) * 1.98, -.08, Math.sin(a3 + .2) * 1.98); fm.add(bell); }
  // L peaks: "like a mountain with wonderful peaks" (5.8.5)
  var pk = layer('peaks'); var main = shikhara(1.05, 2.6, GOLD); pk.add(main);
  for (var c2 = 0; c2 < 4; c2++) { var a4 = c2 / 4 * 6.283 + Math.PI / 4, sm = shikhara(.42, 1.05, GOLD2); sm.position.set(Math.cos(a4) * 1.5, 0, Math.sin(a4) * 1.5); pk.add(sm); }
  for (var c3 = 0; c3 < 8; c3++) { var a5 = c3 / 8 * 6.283, tn = shikhara(.2, .5, GOLD); tn.position.set(Math.cos(a5) * 1.95, 0, Math.sin(a5) * 1.95); pk.add(tn); }
  var lo = layer('lotus'); L.petals = [];
  function petalGeo(len, wid) { var sh = new T.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(wid, len * .25, wid * .8, len * .8, 0, len); sh.bezierCurveTo(-wid * .8, len * .8, -wid, len * .25, 0, 0);
    var g = new T.ExtrudeGeometry(sh, { depth: .03, bevelEnabled: true, bevelSize: .02, bevelThickness: .02, bevelSegments: 2, curveSegments: 16 }); g.translate(0, 0, -.015); return g; }
  var HAM = new T.MeshStandardMaterial({ color: 0xf0b850, metalness: 1, roughness: .34, map: cv(256, 256, function (g, w, h) { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); for (var i = 0; i < 500; i++) { g.fillStyle = 'rgba(120,80,20,' + hsh(i) * .25 + ')'; g.beginPath(); g.arc(hsh(i * 3) * w, hsh(i * 5) * h, 3 + hsh(i * 7) * 8, 0, 7); g.fill(); } }) });
  [[8, 2.15, 1.35, .62, 0], [8, 1.85, 1.0, .5, Math.PI / 8]].forEach(function (row, ri) { for (var i = 0; i < row[0]; i++) { var a = i / row[0] * 6.283 + row[4], piv = new T.Group(), pm = new T.Mesh(petalGeo(row[2], row[3]), ri ? GOLD2 : HAM);
      piv.position.set(Math.cos(a) * row[1] * .55, -.32 - ri * .1, Math.sin(a) * row[1] * .55); piv.rotation.y = -a + Math.PI / 2; pm.rotation.x = 0; piv.add(pm); lo.add(piv); L.petals.push({ p: piv, m: pm, ri: ri }); } });
  P.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  // engine slot: empty, dashed (nothing in the text)
  var eg = layer('engine'); var box = new T.LineSegments(new T.EdgesGeometry(new T.CylinderGeometry(1.1, 1.1, .9, 8)), new T.LineDashedMaterial({ color: 0x3fd0c9, dashSize: .12, gapSize: .09, transparent: true, opacity: .9 })); box.computeLineDistances(); eg.add(box);
})();
var ASM = { lotus: 0, engine: -1.95, deck: 0, stairs: 0, pillars: .04, crystal: .1, frame: 1.25, peaks: 1.45 };
var EXP = { lotus: -.25, engine: -2.5, deck: 0, stairs: -.42, pillars: 1.0, crystal: 2.35, frame: 3.65, peaks: 4.25 };
function setExplode(e) { for (var k in ASM) L[k].position.y = ASM[k] + (EXP[k] - ASM[k]) * e;
  // petals hang down (closed, hugging the keel) and open outward as the parts separate
  L.petals.forEach(function (q) { var c = q.ri ? 2.95 : 2.85, o = q.ri ? 1.62 : 1.32; q.m.rotation.x = c + (o - c) * Math.min(1, e * 1.4); }); }


// ======================= timing helpers (voice-driven) =======================
var lerp = function (a, b, u) { return a + (b - a) * u; };
var V = function (a) { return new T.Vector3(a[0], a[1], a[2]); };
var SN = {}; TM.sentences.forEach(function (s) { SN[s.id] = s; });
function ST(id) { return SN[id].t0; } function SE(id) { return SN[id].t1; }
// cue = time of a word inside a sentence: proportional position in the Devanagari text, snapped to the nearest real word start (Whisper) within 0.6 s
function CUE(id, sub) { var s = SN[id], b = TM.B[id], i = b.indexOf(sub); if (i < 0) { (window.__cue = window.__cue || []).push(id + ':' + sub); i = 0; }
  var p = s.t0 + (s.t1 - s.t0) * i / b.length, best = p, bd = .6; for (var k = s.k0; k <= s.k1; k++) { var w = TM.words[k]; if (w && Math.abs(w[1] - p) < bd) { bd = Math.abs(w[1] - p); best = w[1]; } } return best; }
var DUR = TM.end;
// ======================= DOM overlay system (pure function of t) =======================
var UIE = {};
function U(id, cls) { var d = UIE[id]; if (!d) { d = document.createElement('div'); ov.appendChild(d); UIE[id] = d; } if (d.className !== cls) d.className = cls; return d; }
function show(id, cls, html, t, tIn, css, tOut) { var d = U(id, cls); if (d._h !== html) { d.innerHTML = html; d._h = html; } if (d._c !== (css || '')) { d.style.cssText = css || ''; d._c = css || ''; }
  var a = clamp((t - tIn) / .35) * (tOut == null ? 1 : 1 - clamp((t - tOut) / .3)); d._a = a; d.style.display = a > 0 ? '' : 'none'; d.style.opacity = a; d.style.transform = 'translateY(' + ((1 - eio(a)) * 14).toFixed(1) + 'px)'; return d; }
function hideAll() { for (var k in UIE) UIE[k].style.display = 'none'; while (svg.firstChild) svg.removeChild(svg.firstChild); }
function lead(a, b, col, op) { if (op <= 0) return; leader(a, b, col); svg.lastChild.setAttribute('opacity', op); svg.lastChild.previousSibling.setAttribute('opacity', op * .8); }
// a card attached to a world point: card on side L/R, stacked under the previous card of that side
var STACK; function tagAt(id, html, t, tIn, wp, side, cls, tOut, col) {
  var sp = scr(wp), d = show(id, cls || 'tag', html, t, tIn, 'left:0;top:0', tOut); if (d._a <= 0) return d;
  var h = d.offsetHeight, w = d.offsetWidth, tx = side === 'R' ? 918 - w : 162, ty = clamp(sp.y - h / 2, STACK[side] + 12, 1250 - h); STACK[side] = ty + h;
  d.style.left = tx + 'px'; d.style.top = ty + 'px'; if (d._a > .3) lead(sp, { x: side === 'R' ? tx : tx + w, y: ty + h / 2 }, col, d._a); return d; }
function headline(t, t0, kick, head, t1) { show('kick', 'kick', '<i></i>' + kick, t, t0, '', t1); show('head', 'head', head, t, t0 + .12, 'font-size:64px', t1); }
// ======================= camera: authored shots, locked between moves =======================
function shots(t, K) { var p = V(K[0].p), q = V(K[0].q), f = K[0].fov || 28;
  for (var i = 1; i < K.length; i++) { var k = K[i], u = eio((t - k.t) / k.d); if (u <= 0) break; p.lerp(V(k.p), u); q.lerp(V(k.q), u); f = lerp(f, k.fov || f, u); if (u < 1) break; }
  cam.position.copy(p); cam.lookAt(q); if (cam.fov !== f) { cam.fov = f; cam.updateProjectionMatrix(); } cam.updateMatrixWorld(); }
function poseOf() { var d = new T.Vector3(); cam.getWorldDirection(d); return { p: cam.position.toArray(), q: cam.position.clone().addScaledVector(d, 12).toArray(), fov: cam.fov }; }
function keyAt(off) { key.position.set(off.x - 6, 12, off.z + 8); key.target.position.copy(off); key.target.updateMatrixWorld(); }
var SHAKE = 0;

// ======================= SCENE GROUPS (far apart) =======================
var OA = new T.Vector3(0, 0, 0), OB = new T.Vector3(70, 0, 0), OD = new T.Vector3(140, 0, 0), OE = new T.Vector3(210, 0, 0), OF = new T.Vector3(280, 0, 0), OG = new T.Vector3(350, 0, 0), OH = new T.Vector3(420, 0, 0);
function grp(o) { var g = new T.Group(); g.position.copy(o); S.add(g); g.visible = false; return g; }
var gA = grp(OA), gB = grp(OB), gD = grp(OD), gE = grp(OE), gF = grp(OF), gG = grp(OG), gH = grp(OH);

// ---------- A: drafting table + 50 design sheets ----------
function sheetTex(i) { return cv(512, 724, function (g, w, h, c) { g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,60,140,.18)'; g.lineWidth = 1; for (var x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (var y = 0; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  var rc = rough.canvas(c), o = { seed: i + 1, stroke: '#1f3f9a', strokeWidth: 6, roughness: 1.4 }, cx = w / 2, cy = h * .48, k = hsh(i);
  if (k < .25) { rc.ellipse(cx, cy, 300, 110, o); rc.polygon([[cx - 60, cy - 50], [cx, cy - 170], [cx + 60, cy - 50]], o); }
  else if (k < .5) { rc.circle(cx, cy, 240, o); rc.ellipse(cx, cy, 380, 60, o); rc.ellipse(cx, cy, 300, 40, o); }
  else if (k < .75) { for (var j = 0; j < 5; j++) rc.rectangle(cx - 150 + j * 15, cy - j * 50, 300 - j * 30, 46, o); rc.line(cx - 220, cy + 60, cx + 220, cy + 60, o); }
  else { rc.polygon([[cx - 170, cy + 40], [cx + 170, cy + 40], [cx + 90, cy - 40], [cx - 90, cy - 40]], o); rc.arc(cx, cy - 40, 180, 180, Math.PI, Math.PI * 2, false, o); rc.line(cx - 200, cy + 80, cx + 200, cy + 80, o); }
  g.fillStyle = '#1f3f9a'; g.font = '34px FM'; g.fillText('DESIGN ' + String(i + 1).padStart(2, '0') + ' / 50', 28, 52); g.font = '24px FM'; g.fillText('OUR SKETCH', w - 170, h - 26); }); }
var table = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshStandardMaterial({ color: 0x2a1810, roughness: .55, metalness: .05, map: cv(512, 512, function (g, w, h) { g.fillStyle = '#3a2216'; g.fillRect(0, 0, w, h); for (var i = 0; i < 240; i++) { g.strokeStyle = 'rgba(' + (60 + hsh(i) * 40 | 0) + ',30,18,.35)'; g.lineWidth = 1 + hsh(i + 1) * 3; g.beginPath(); var y = hsh(i * 3) * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 8, w * .6, y - 8, w, y + 4); g.stroke(); } }) }));
table.rotation.x = -Math.PI / 2; table.receiveShadow = true; gA.add(table);
var SHEETS = []; for (var i = 0; i < 50; i++) { var m = new T.Mesh(new T.PlaneGeometry(2.1, 2.97), new T.MeshStandardMaterial({ map: sheetTex(i), roughness: .9 })); m.castShadow = true; m.receiveShadow = true;
  var u = i / 49, a = -1.0 + u * 2.0; m.userData = { rz: a * .55 + (hsh(i) - .5) * .1, x: Math.sin(a) * 3.2 + (hsh(i + 4) - .5) * .3, y: .004 * i + .01, z: -Math.cos(a) * 1.2 + 1.6 + (hsh(i + 8) - .5) * .3 }; m.rotation.x = -Math.PI / 2; gA.add(m); SHEETS.push(m); }
var lampA = new T.SpotLight(0xffd29a, 150, 30, .6, .6, 1.6); lampA.position.set(-3, 9, 3); lampA.target.position.set(0, 0, .6); lampA.castShadow = true; gA.add(lampA); gA.add(lampA.target);

// ---------- B: studio floor for the teardown ----------
var floorB = new T.Mesh(new T.CircleGeometry(22, 96), new T.MeshStandardMaterial({ color: 0x0b1440, roughness: .35, metalness: .4 })); floorB.rotation.x = -Math.PI / 2; floorB.receiveShadow = true; gB.add(floorB);
// thought rings + carriers
var RINGS = []; for (var i = 0; i < 3; i++) { var r = new T.Mesh(new T.TorusGeometry(1, .025, 8, 96), new T.MeshBasicMaterial({ color: new T.Color(1, .8, .4).multiplyScalar(2.2), transparent: true, depthWrite: false })); r.rotation.x = Math.PI / 2; gB.add(r); RINGS.push(r); }
var DOT = cv(64, 64, function (g, w, h) { var r = g.createRadialGradient(32, 32, 0, 32, 32, 30); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.5, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
var NC = 260, carG = new T.BufferGeometry(), carP = new Float32Array(NC * 3); carG.setAttribute('position', new T.BufferAttribute(carP, 3));
var CAR = new T.Points(carG, new T.PointsMaterial({ color: new T.Color(.25, .85, .8).multiplyScalar(2), size: 9, sizeAttenuation: false, map: DOT, transparent: true, depthWrite: false })); gB.add(CAR);
// airflow streaks through the vents
var NA = 60, airG = new T.BufferGeometry(), airP = new Float32Array(NA * 3); airG.setAttribute('position', new T.BufferAttribute(airP, 3));
var AIR = new T.Points(airG, new T.PointsMaterial({ color: new T.Color(.7, .95, 1).multiplyScalar(2), size: 10, sizeAttenuation: false, map: DOT, transparent: true, depthWrite: false })); S.add(AIR);

// ---------- D: balloon physics ----------
var balloon = new T.Group(); gD.add(balloon);
(function () { var pts = []; for (var i = 0; i <= 40; i++) { var u = i / 40, y = -1.6 + u * 4.2, r = u < .18 ? .35 + u * 3.2 : 1.6 * Math.sin(Math.min(1, (u - .02) / .98) * Math.PI * .92 + .12) * (1 - Math.pow(u, 6) * .15); pts.push(new T.Vector2(Math.max(.02, r), y)); } pts.push(new T.Vector2(0, 2.62));
  var gore = cv(1024, 256, function (g, w, h) { for (var k = 0; k < 16; k++) { g.fillStyle = k % 2 ? '#e8b04a' : '#0e2a7a'; g.fillRect(k * w / 16, 0, w / 16, h); } g.fillStyle = 'rgba(255,255,255,.08)'; for (var y = 0; y < h; y += 16) g.fillRect(0, y, w, 2); });
  var env = new T.Mesh(new T.LatheGeometry(pts, 64), new T.MeshStandardMaterial({ map: gore, roughness: .55, metalness: .05, side: T.DoubleSide, transparent: true, opacity: .55, depthWrite: false })); balloon.add(env); balloon.userData.env = env;
  var basket = new T.Mesh(new T.BoxGeometry(.6, .45, .6), new T.MeshStandardMaterial({ color: 0x8a5a2a, roughness: .8 })); basket.position.y = -2.5; balloon.add(basket);
  for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2 + Math.PI / 4, ln = new T.Mesh(new T.CylinderGeometry(.008, .008, .9, 4), GOLD2); ln.position.set(Math.cos(a) * .33, -1.95, Math.sin(a) * .33); balloon.add(ln); }
  var flame = new T.Mesh(new T.ConeGeometry(.16, .7, 16), new T.MeshBasicMaterial({ color: new T.Color(1, .55, .15).multiplyScalar(4) })); flame.position.y = -1.85; balloon.add(flame); balloon.userData.flame = flame; })();
function cloud(n, inside, col, sz, seed) { var a = []; for (var i = 0; i < n * 3; i++) { var ang = hsh(i + seed) * 6.283, rad = Math.sqrt(hsh(i + seed + 7)), x = Math.cos(ang) * rad * 3.6, y = .6 + Math.sin(ang) * rad * 3.4, z = (hsh(i + seed + 13) - .5) * 1.2;
    var ins = y > -1.5 && y < 2.5 && Math.abs(x) < 1.5 * Math.sin(Math.min(1, (y + 1.6) / 4.2) * Math.PI * .92 + .12) * .95; if (ins === inside) a.push(x, y, z); if (a.length >= n * 3) break; }
  var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(a, 3)); var p = new T.Points(g, new T.PointsMaterial({ color: col, size: sz, sizeAttenuation: false, transparent: true, depthWrite: false, map: DOT })); gD.add(p); return p; }
var HOT = cloud(420, true, new T.Color(1, .5, .15).multiplyScalar(2.4), 9, 1), COLD = cloud(1400, false, new T.Color(.35, .7, 1).multiplyScalar(1.2), 7, 50000);
var LIFT = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(0, 2.9, 0), 1.2, 0x3fd0c9, .35, .25); gD.add(LIFT);
var CUBE = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ color: 0xffc35a, metalness: .85, roughness: .3, emissive: 0x7a4c00, emissiveIntensity: .7 })); CUBE.castShadow = true; gD.add(CUBE);
var MINI = []; for (var i = 0; i < 25; i++) { var b = balloon.userData.env.clone(); b.material = b.material.clone(); b.material.opacity = .9; b.scale.setScalar(.22); gD.add(b); MINI.push(b); }
var floorD = new T.Mesh(new T.CircleGeometry(30, 96), new T.MeshStandardMaterial({ color: 0x0a1238, roughness: .4, metalness: .3 })); floorD.rotation.x = -Math.PI / 2; floorD.position.y = -1.75; floorD.receiveShadow = true; gD.add(floorD);

// ---------- E: the 1918 "manual" sheet ----------
var SW = 7, SH = 7 * 1920 / 1080, BPK = 1.3, bpBase = document.createElement('canvas'); bpBase.width = W * BPK; bpBase.height = H * BPK;
(function () { var g = bpBase.getContext('2d'); g.scale(BPK, BPK); g.fillStyle = '#163f86'; g.fillRect(0, 0, W, H);
  for (var i = 0; i < 9000; i++) { g.fillStyle = 'rgba(255,255,255,' + (hsh(i) * .05) + ')'; g.fillRect(hsh(i * 3) * W, hsh(i * 7) * H, 2, 2); }
  g.strokeStyle = 'rgba(220,235,255,.14)'; g.lineWidth = 1; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  var rc = rough.canvas(bpBase), o = { seed: 7, stroke: '#eaf3ff', strokeWidth: 2.4, roughness: 1.1 }, cx = 470, cy = 680;
  rc.ellipse(cx, cy, 520, 150, o); rc.ellipse(cx, cy - 110, 290, 96, o); rc.circle(cx, cy - 196, 80, o);
  for (var k = 0; k < 6; k++) { rc.line(cx - 220 + k * 88, cy + 70, cx - 240 + k * 96, cy + 180, o); rc.circle(cx - 240 + k * 96, cy + 196, 30, o); }
  for (var s2 = 0; s2 < 3; s2++) rc.arc(cx, cy - 196, 130 + s2 * 48, 130 + s2 * 48, Math.PI * 1.1, Math.PI * 1.9, false, Object.assign({}, o, { strokeWidth: 1.6 }));
  g.fillStyle = '#eaf3ff'; g.font = '20px FM'; g.fillText('FIG. ?  "VIMANA" · MANUAL-STYLE SKETCH', 162, 958); g.fillText('ILLUSTRATIVE, NOT THE BOOK\'S DRAWING', 162, 986); })();
var bpTex = new T.CanvasTexture(document.createElement('canvas')); bpTex.image.width = W * BPK; bpTex.image.height = H * BPK; bpTex.colorSpace = T.SRGBColorSpace; bpTex.anisotropy = 8;
var bpG = bpTex.image.getContext('2d'), bpState = '';
function drawRuler(u1, u2, u3) { var k = u1.toFixed(2) + u2.toFixed(2) + u3.toFixed(2); if (k === bpState) return; bpState = k; var g = bpG; g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(bpBase, 0, 0); g.scale(BPK, BPK);
  var y0 = 1086, x0 = 162, x1 = 918; function X(yr) { return x0 + (yr - 1895) / (1980 - 1895) * (x1 - x0); }
  var xe = lerp(x0, X(1925), u1) + (x1 - X(1925)) * u3; g.strokeStyle = '#eaf3ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(xe, y0); g.stroke();
  g.font = '22px FM'; g.fillStyle = '#eaf3ff';
  [[1903, 'WRIGHTS', 0], [1918, '', 0], [1952, 'PUBLIC', 1], [1974, 'IISc', 1]].forEach(function (q) { if (X(q[0]) > xe) return; g.fillRect(X(q[0]) - 1.5, y0 - 16, 3, 32); g.fillText(q[0], X(q[0]) - 24, y0 + 46); if (q[1]) g.fillText(q[1], X(q[0]) - 24, y0 + 74); });
  if (u2 > 0) { g.fillStyle = 'rgba(232,176,74,' + (.9 * u2) + ')'; g.fillRect(X(1918), y0 - 22, X(1923) - X(1918), 44); g.fillStyle = 'rgba(255,210,122,' + u2 + ')'; g.font = '24px FM'; g.fillText('DICTATED 1918-23', X(1918) - 40, y0 - 38); }
  bpTex.needsUpdate = true; }
var sheetE = new T.Mesh(new T.PlaneGeometry(SW, SH), new T.MeshStandardMaterial({ map: bpTex, roughness: .85 })); sheetE.rotation.x = -Math.PI / 2; sheetE.receiveShadow = true; gE.add(sheetE);
var deskE = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshStandardMaterial({ color: 0x120c08, roughness: .8 })); deskE.rotation.x = -Math.PI / 2; deskE.position.y = -.02; gE.add(deskE);
function S2W(sx, sy, y) { return new T.Vector3((sx / W - .5) * SW, y || 0, (sy / H - .5) * SH); }
var inkE = cv(700, 700, function (g, w, h) { g.translate(w / 2, h / 2); g.rotate(-.18); g.strokeStyle = '#ff4a2e'; g.fillStyle = '#ff4a2e'; g.lineWidth = 16; g.beginPath(); g.arc(0, 0, 300, 0, 7); g.stroke(); g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 262, 0, 7); g.stroke();
  g.textAlign = 'center'; g.font = '800 92px Syne'; g.fillText('IISc 1974', 0, -50); g.font = '800 60px Syne'; g.fillText('CAN\'T FLY', 0, 40); g.font = '28px FM'; g.fillText('"NONE ... CAPABLE OF', 0, 108); g.fillText('BEING FLOWN"', 0, 146); });
var IMP = new T.Mesh(new T.PlaneGeometry(330 / W * SW, 330 / W * SW), new T.MeshBasicMaterial({ map: inkE, transparent: true, depthWrite: false })); IMP.rotation.x = -Math.PI / 2; IMP.position.copy(S2W(735, 690, .02)); gE.add(IMP);
var STAMP = new T.Group(); (function () { var rub = new T.Mesh(new T.CylinderGeometry(.95, .95, .25, 48), new T.MeshStandardMaterial({ color: 0x2a1a14, roughness: .6 })); STAMP.add(rub);
  var hdl = lathe([[.85, .12], [.9, .3], [.42, .5], [.32, 1.4], [.5, 1.8], [.36, 2.1], [0, 2.15]], new T.MeshStandardMaterial({ color: 0x8a5228, roughness: .45 }), 32); STAMP.add(hdl); STAMP.scale.setScalar(.75); STAMP.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); })(); gE.add(STAMP);
var lampE = new T.SpotLight(0xfff0d8, 420, 60, .7, .6, 1.3); lampE.position.set(-4, 14, -3); lampE.castShadow = true; gE.add(lampE); gE.add(lampE.target);

// ---------- F: Valmiki's chariot (our model) that Jatayu breaks ----------
var CHAR = [], charG = new T.Group(); gF.add(charG);
(function () { var wood = new T.MeshStandardMaterial({ color: 0x6a3a1c, roughness: .6 }), add = function (m, x, y, z, rx, ry, rz) { m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0); m.castShadow = true; charG.add(m); m.userData.h = { p: m.position.clone(), r: m.rotation.clone() }; CHAR.push(m); return m; };
  add(new T.Mesh(new T.BoxGeometry(1.6, .5, 1.2), wood), 0, 1.0, 0); add(new T.Mesh(new T.BoxGeometry(1.7, .08, 1.3), GOLD), 0, 1.28, 0);
  for (var s = -1; s <= 1; s += 2) { var wh = new T.Group(); wh.add(new T.Mesh(new T.TorusGeometry(.75, .06, 8, 40), GOLD2)); for (var k = 0; k < 8; k++) { var sp = new T.Mesh(new T.CylinderGeometry(.025, .025, 1.45, 6), wood); sp.rotation.z = k * Math.PI / 8; wh.add(sp); } add(wh, 0, .75, s * .72); }
  add(new T.Mesh(new T.CylinderGeometry(.05, .05, 2.6, 8), wood), 1.9, .9, 0, 0, 0, Math.PI / 2 - .12);
  add(new T.Mesh(new T.CylinderGeometry(.03, .03, 1.6, 6), GOLD2), -.6, 2.0, 0); add(new T.Mesh(new T.ConeGeometry(.75, .35, 16, 1, false), new T.MeshStandardMaterial({ color: 0xb4321e, roughness: .6, side: T.DoubleSide })), -.6, 2.85, 0);
  add(new T.Mesh(new T.BoxGeometry(.08, .9, 1.2), GOLD2), -.78, 1.55, 0); })();
var floorF = new T.Mesh(new T.CircleGeometry(30, 96), new T.MeshStandardMaterial({ color: 0x1a120c, roughness: .9 })); floorF.rotation.x = -Math.PI / 2; floorF.receiveShadow = true; gF.add(floorF);
var NDU = 160, duG = new T.BufferGeometry(), duP = new Float32Array(NDU * 3); duG.setAttribute('position', new T.BufferAttribute(duP, 3));
var DUST = new T.Points(duG, new T.PointsMaterial({ color: new T.Color(1, .75, .45).multiplyScalar(1.6), size: 8, sizeAttenuation: false, map: DOT, transparent: true, depthWrite: false })); gF.add(DUST);

// ---------- G: the flight home on NASA's relief map ----------
var mapTex = new T.TextureLoader().load('img/india.jpg'); mapTex.colorSpace = T.SRGBColorSpace; mapTex.anisotropy = 8;
function P3(lon, lat, y) { return new T.Vector3((lon - 79) * .95, y || 0, -(lat - 18)); }
var mapG = new T.Mesh(new T.PlaneGeometry(26 * .95, 28), new T.MeshStandardMaterial({ map: mapTex, roughness: .9 })); mapG.rotation.x = -Math.PI / 2; mapG.receiveShadow = true; gG.add(mapG);
var STOPS = [['LANKA', 80.7, 7.9, 'लंका'], ['SETU', 79.42, 9.17, 'सेतु'], ['KISHKINDHA', 76.46, 15.33, 'किष्किंधा'], ['PANCHAVATI', 73.79, 20.0, 'पंचवटी'], ['CHITRAKOOT', 80.85, 25.2, 'चित्रकूट'], ['PRAYAG', 81.85, 25.43, 'प्रयाग'], ['AYODHYA', 82.2, 26.8, 'अयोध्या']];
var ROUTE = new T.CatmullRomCurve3(STOPS.map(function (s) { return P3(s[1], s[2], .18); }), false, 'centripetal', .3);
var routeM = new T.Mesh(new T.TubeGeometry(ROUTE, 400, .07, 10, false), new T.MeshBasicMaterial({ color: new T.Color(0xffc35a).multiplyScalar(2.2) })); gG.add(routeM);
var routeGl = new T.Mesh(new T.TubeGeometry(ROUTE, 400, .22, 10, false), new T.MeshBasicMaterial({ color: 0xffb040, transparent: true, opacity: .18, depthWrite: false })); gG.add(routeGl);
// parameter u along the route for each stop (closest curve point)
var STOPU = STOPS.map(function (s) { var p = P3(s[1], s[2], .18), best = 0, bd = 1e9; for (var i = 0; i <= 600; i++) { var d = ROUTE.getPointAt(i / 600).distanceTo(p); if (d < bd) { bd = d; best = i / 600; } } return best; });
var PINS = STOPS.map(function (s, i) { var g = new T.Group(); g.add(new T.Mesh(new T.CylinderGeometry(.16, .16, .06, 24), new T.MeshBasicMaterial({ color: new T.Color(i === 1 ? 0x3fd0c9 : 0xfff1c8).multiplyScalar(2) })));
  var ring = new T.Mesh(new T.RingGeometry(.28, .34, 32), new T.MeshBasicMaterial({ color: 0xfff1c8, transparent: true, opacity: .7, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; g.add(ring); g.position.copy(P3(s[1], s[2], .2)); gG.add(g); return g; });

// ---------- H: ISRO's Pushpak (RLV) on a runway, our simple model ----------
var rwTex = cv(256, 2048, function (g, w, h) { g.fillStyle = '#26282e'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9e6dc'; for (var y = 40; y < h; y += 120) g.fillRect(w / 2 - 4, y, 8, 60); g.fillRect(14, 0, 6, h); g.fillRect(w - 20, 0, 6, h); for (var k = 0; k < 8; k++) { g.fillRect(30 + k * 12, h - 140, 7, 110); g.fillRect(w - 37 - k * 12, h - 140, 7, 110); } });
var runway = new T.Mesh(new T.PlaneGeometry(8, 160), new T.MeshStandardMaterial({ map: rwTex, roughness: .8 })); runway.rotation.x = -Math.PI / 2; runway.receiveShadow = true; gH.add(runway);
var grassH = new T.Mesh(new T.PlaneGeometry(200, 200), new T.MeshStandardMaterial({ color: 0x1c2a14, roughness: 1 })); grassH.rotation.x = -Math.PI / 2; grassH.position.y = -.02; grassH.receiveShadow = true; gH.add(grassH);
var RLV = new T.Group(); gH.add(RLV);
(function () { var white = new T.MeshStandardMaterial({ color: 0xe9ecef, roughness: .45, metalness: .2 }), black = new T.MeshStandardMaterial({ color: 0x1b1d22, roughness: .5 });
  var body = lathe([[0, 0], [.18, .25], [.32, .7], [.4, 1.4], [.42, 3.2], [.38, 3.6], [.0, 3.62]], white, 24); body.rotation.x = Math.PI / 2; body.position.z = 1.8; RLV.add(body);
  var nose = lathe([[0, 0], [.1, .08], [.18, .25], [0, .26]], black, 24); nose.rotation.x = -Math.PI / 2; nose.position.z = 1.8; RLV.add(nose);
  var sh = new T.Shape(); sh.moveTo(0, 1.4); sh.lineTo(.5, .2); sh.lineTo(1.7, -1.5); sh.lineTo(1.7, -1.8); sh.lineTo(-1.7, -1.8); sh.lineTo(-1.7, -1.5); sh.lineTo(-.5, .2); sh.lineTo(0, 1.4);
  var wing = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: .05, bevelEnabled: false }), white); wing.rotation.x = Math.PI / 2; wing.position.set(0, -.1, -.1); RLV.add(wing);
  [-1, 1].forEach(function (s) { var f = new T.Shape(); f.moveTo(0, 0); f.lineTo(.6, 0); f.lineTo(.2, .75); f.lineTo(0, .75); var fin = new T.Mesh(new T.ExtrudeGeometry(f, { depth: .04, bevelEnabled: false }), white); fin.rotation.y = Math.PI / 2; fin.rotation.z = s * -.3; fin.position.set(s * .32, .25, -1.45); RLV.add(fin); });
  RLV.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); RLV.scale.setScalar(.9); })();
var NAME = new T.Mesh(new T.PlaneGeometry(1.6, .32), new T.MeshBasicMaterial({ map: cv(512, 102, function (g, w, h) { g.fillStyle = '#16213f'; g.font = '800 74px Syne'; g.textAlign = 'center'; g.fillText('PUSHPAK', w / 2, 78); }), transparent: true, depthWrite: false })); NAME.rotation.y = -Math.PI / 2; NAME.position.set(-.425, .05, .2); RLV.add(NAME);
// the diya for the end
var DIYA = new T.Group(); (function () { var clay = new T.MeshStandardMaterial({ color: 0xb0582a, roughness: .7 }); DIYA.add(lathe([[0, 0], [.5, .02], [.62, .2], [.55, .28], [0, .12]], clay, 32));
  var fl = new T.Mesh(new T.SphereGeometry(.09, 16, 12), new T.MeshBasicMaterial({ color: new T.Color(1, .7, .3).multiplyScalar(5) })); fl.scale.set(1, 2.1, 1); fl.position.set(.38, .45, 0); DIYA.add(fl); DIYA.userData.fl = fl; })();
var lampD = new T.PointLight(0xffa040, 8, 8, 1.6);

// ======================= scene table =======================
var SCN = [['A', 's1', 's4'], ['B', 's5', 's14'], ['C', 's15', 's16'], ['D', 's17', 's22'], ['E', 's23', 's26'], ['F', 's27', 's29'], ['G', 's30', 's33'], ['H', 's34', 's35'], ['I', 's36', 's37']].map(function (q) { return { k: q[0], a: q[1], b: q[2] }; });
SCN.forEach(function (s, i) { s.t0 = i ? (SE(SCN[i - 1].b) + ST(s.a)) / 2 : 0; }); SCN.forEach(function (s, i) { s.t1 = i + 1 < SCN.length ? SCN[i + 1].t0 : DUR; });
window.SCN_T0 = function () { return SCN.map(function (s) { return s.t0; }).concat([DUR]); };
var CUT = { B: 1, D: 1, E: 1, F: 1, G: 1, H: 1, I: 1 };          // scenes entered with a short dip (C continues B's set)
function sceneAt(t) { for (var i = SCN.length - 1; i >= 0; i--) if (t >= SCN[i].t0) return i; return 0; }
var ORDER = ['engine', 'lotus', 'stairs', 'deck', 'pillars', 'crystal', 'frame', 'peaks'];
function explodeAt(t, tA, tClose) { var tot = 0; ORDER.forEach(function (n, k) { var o = eob((t - tA - k * .2) / 1.4, 1.1), c = tClose == null ? 0 : eio((t - tClose - (ORDER.length - 1 - k) * .08) / 1.2), e = Math.max(0, o * (1 - c));
    L[n].position.y = ASM[n] + (EXP[n] - ASM[n]) * e; if (n === 'lotus') L.petals.forEach(function (q) { var cc = q.ri ? 2.95 : 2.85, oo = q.ri ? 1.62 : 1.32; q.m.rotation.x = cc + (oo - cc) * clamp(e * 1.4); }); tot += e; }); return tot / ORDER.length; }
function eob(x, k) { x = clamp(x); k = k || 1.4; return 1 + (k + 1) * Math.pow(x - 1, 3) + k * Math.pow(x - 1, 2); }
// pre-solved camera poses for the teardown (assembled close-up, exploded wide, crystal macro, engine)
var PB = {};
(function () { var P0 = P.position.clone(); P.position.copy(OB).add(new T.Vector3(0, -2.15, 0)); P.rotation.y = .5; cam.fov = 26; cam.updateProjectionMatrix();
  function fit(e, yTop, yBot, a, b, dir) { explodeAt(e ? 99 : -99, 0); P.updateMatrixWorld(true); var top = new T.Vector3(0, ASM.peaks + e * (EXP.peaks - ASM.peaks) + 2.75, 0), bot = new T.Vector3(0, e ? EXP.engine - .5 : -1.3, 0); P.localToWorld(top); P.localToWorld(bot);
    fitV(OB.clone().add(new T.Vector3(0, 1.5, 0)), (dir || new T.Vector3(0, .2, 1)).normalize(), top, bot, a, b); return poseOf(); }
  PB.close0 = fit(0, 0, 0, 470, 1240, new T.Vector3(.5, .55, 1)); PB.close = fit(0, 0, 0, 520, 1200, new T.Vector3(.15, .25, 1)); PB.wide = fit(1, 0, 0, 470, 1240);
  explodeAt(99, 0); P.updateMatrixWorld(true);
  var w = PB.wide, WP = V(w.p), WQ = V(w.q), Q0 = new T.Vector3(); P.updateMatrixWorld(true);
  function focus(ly, dolly, side) { var f = new T.Vector3(0, ly, 0); P.localToWorld(f); var dir = WP.clone().sub(f).normalize(), dist = WP.distanceTo(f) * (1 - dolly), p = f.clone().addScaledVector(dir, dist); if (side) p.x += side; return { p: p.toArray(), q: f.toArray(), fov: 26 }; }
  PB.top = focus(EXP.peaks + 1.0, .38); PB.low = focus(EXP.deck + .4, .38); PB.macro = focus(EXP.crystal + .55, .62, 1.0); PB.engine = focus(EXP.engine + .5, .5);
  P.position.copy(P0); })();

// ======================= the render contract =======================
window.__reelDurationSec = DUR; window.__ready = false;
var capEl = document.getElementById('cap'), CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
window.__seek = function (t) {
  var si = sceneAt(t), sc = SCN[si], k = sc.k; hideAll(); STACK = { L: 430, R: 430 }; SHAKE = 0; var fade = 0;
  [gA, gB, gD, gE, gF, gG, gH].forEach(function (g) { g.visible = false; }); P.visible = false; RINGS.forEach(function (r) { r.visible = false; }); CAR.visible = false; STAMP.visible = true; AIR.visible = false; balloon.visible = true; DIYA.parent && DIYA.parent.remove(DIYA); lampD.parent && lampD.parent.remove(lampD);
  if (CUT[k]) fade = Math.max(fade, 1 - clamp((t - sc.t0) / .32)); if (si + 1 < SCN.length && CUT[SCN[si + 1].k]) fade = Math.max(fade, 1 - clamp((sc.t1 - t) / .28));
  SC_FN[k](t, sc);
  window.__STARS.position.copy(cam.position); bg.position.copy(cam.position);
  capEl.innerHTML = CAP.html(t, CAPW, { plain: true, hi: '#e8b04a', ink: '#f1f3f8', fs: 40, width: 756 });
  mGrade.uniforms.fade.value = fade; mGrade.uniforms.shake.value.set(SHAKE * Math.sin(t * 91) * .004, SHAKE * Math.cos(t * 77) * .003);
  if (!window.__skipRender) render(t);
};

var SC_FN = {
  // ---------- A: the hook ----------
  A: function (t) {
    gA.visible = true; keyAt(OA); key.intensity = .6; S.environmentIntensity = .4; bg.visible = false;
    var t1 = ST('s1'), nIn = 12;    // 12 sheets already down at frame 0, the rest drop in during s1
    SHEETS.forEach(function (m, i0) { var i = (i0 * 17) % 50, d = m.userData, tin = i < nIn ? -1 : t1 + (i - nIn) / (50 - nIn) * 2.3, u = eio((t - tin) / .45); m.visible = u > 0; m.position.set(d.x, d.y + (1 - u) * 1.6, d.z); m.rotation.set(-Math.PI / 2, 0, d.rz + (1 - u) * .6); });
    shots(t, [{ p: [0, 14.0, 6.0], q: [0, 0, -.4], fov: 30 }, { t: t1 + .2, d: 2.6, p: [0, 16.4, 7.4], q: [0, 0, -.6], fov: 30 }, { t: ST('s4') - .2, d: 2.2, p: [0, 15.4, 6.6], q: [0, 0, -.8], fov: 30 }]);
    var nShown = Math.min(50, Math.max(nIn, Math.floor(nIn + clamp((t - t1) / 2.3) * (50 - nIn) + .5)));
    headline(t, -1, 'RAMAYANA · PART 1 · 5 NOV 2026', 'Pushpak ke <b>' + (t < t1 + 2.2 ? nShown : '40-50') + '</b> design');
    show('c2', 'tag', '<small>SIRF DESIGN</small><span style="font:800 56px Syne;color:#1a1530">2 saal</span>', t, CUE('s2', 'दो') - .1, 'left:162px;top:1000px');
    show('c65', 'tag', '<small>RAVAN-JATAYU SCENE</small><span style="font:800 56px Syne;color:#b43a1e">6.5 saal</span>', t, CUE('s3', 'साढ़े') - .1, 'left:480px;top:1000px');
    show('q', 'tag q', '<small>NITESH TIWARI, DIRECTOR</small>"We wanted some kind of<br>science to go into it."', t, CUE('s4', 'हम') - .2, 'left:162px;top:1150px;background:rgba(7,16,46,.85)');
    show('srcA', 'src', 'Shreyas Media interview, via India.com (1 Nov 2026) · sheets are our sketches', t, CUE('s4', 'हम'), 'top:1286px');
  },
  // ---------- B: the teardown ----------
  B: function (t, sc) {
    gB.visible = true; P.visible = true; keyAt(OB); key.intensity = 2.6; S.environmentIntensity = 1; bg.visible = true;
    P.position.copy(OB).add(new T.Vector3(0, -2.15, 0)); floorB.position.y = -2.15 + EXP.engine - 1.05 - OB.y; P.scale.setScalar(1);
    var tEx = CUE('s6', 'खोलकर') - .15, e = explodeAt(t, tEx);
    P.rotation.y = .5 + .06 * Math.sin((t - sc.t0) * .35);    // a breath of life on the turntable, not a camera drift
    L.engine.children[0].material.opacity = .9 * clamp((t - CUE('s14', 'इंजन') + .2) / .6);
    shots(t, [PB.close0, { t: ST('s5') - .1, d: 2.4, p: PB.close.p, q: PB.close.q, fov: 26 }, { t: tEx - .1, d: 2.6, p: PB.wide.p, q: PB.wide.q, fov: 26 },
      { t: ST('s7') - .2, d: 1.4, p: PB.top.p, q: PB.top.q, fov: 26 }, { t: ST('s9'), d: 3.4, p: PB.low.p, q: PB.low.q, fov: 26 },
      { t: CUE('s12', 'खिड़कियाँ') - .3, d: 1.9, p: PB.macro.p, q: PB.macro.q, fov: 26 }, { t: ST('s14') - .1, d: 2.0, p: PB.engine.p, q: PB.engine.q, fov: 26 }]);
    var macro = t > CUE('s12', 'खिड़कियाँ') + .4 && t < ST('s14') + .3;
    headline(t, sc.t0, 'OUR 3D · BUILT FROM VALMIKI\'S WORDS', 'Pushpak, <b>part by part</b>', macro ? CUE('s12', 'खिड़कियाँ') + .2 : ST('s14') - .3);
    function tag(id, layer, lp, side, idx, verse, txt, tIn, tOut, cls, col) { var p = new T.Vector3(lp[0], lp[1], lp[2]); L[layer].localToWorld(p);
      return tagAt(id, '<small><b style="color:' + (col || '#c2780e') + '">' + idx + '</b> · ' + verse + '</small>' + txt, t, tIn, p, side, cls, tOut, col === '#3fd0c9' || col === '#e8b04a' ? col : null); }
    P.updateMatrixWorld(true);
    var tm0 = CUE('s12', 'खिड़कियाँ') + .1, tm1 = ST('s14') - .1;
    var eng = t > ST('s14') - .2;
    if (!macro) {
      if (!eng) {
      tag('t1', 'peaks', [1.3, 1.3, .6], 'R', '01', '5.8.5', 'Pahaad jaisa,<br>kai shikhar', CUE('s7', 'पहाड़') - .1);
      tag('t2', 'frame', [1.8, .05, .8], 'R', '02', '5.8.1 · 6.124', 'Sona, heere,<br>ghantiyaan', CUE('s8', 'सोना') - .1);
      tag('t4', 'pillars', [-1.6, .6, .8], 'L', '03', '5.9.13', 'Bhediyon ki<br>nakkaashi', CUE('s9', 'भेड़ि') - .1);
      tag('t5', 'stairs', [-1.6, -.25, 1.2], 'L', '04', '5.9.15', 'Sone ki<br>seedhiyaan', CUE('s10', 'सीढ़') - .1);
      tag('t6', 'deck', [1.6, -.05, .8], 'R', '05', '5.9.17 · 6.123.1', 'Moonge ka farsh,<br>hans ke chitra', CUE('s11', 'मूँग') - .1);
      }
      if (eng) { tag('t7', 'lotus', [-2.0, -.45, .6], 'L', '06', 'OUR TOUCH · NOT IN VERSE', 'Kamal-peeth', ST('s14'), null, 'tag q', '#e8b04a');
        tag('t8', 'engine', [1.1, 0, 0], 'R', '07', 'ENGINE?', 'Text mein nahi', CUE('s14', 'इंजन') - .05, null, 'tag q', '#3fd0c9'); }
    } else {
      tag('t3', 'crystal', [1.3, .45, .9], 'R', '06', '5.9.16', 'Crystal khidkiyaan', CUE('s12', 'क्रिस्टल') - .1);
      tag('t3b', 'crystal', [-1.3, .85, .9], 'L', '06', '5.9.16', 'Hawa ke chhed<br>(ventilation)', CUE('s12', 'हवा') - .1);
      show('kickM', 'kick', '<i></i>CLOSE-UP · 5.9.16', t, tm0 + .2, '');
      // air streaks through the vent holes
      AIR.visible = true; var vp = new T.Vector3(); for (var i = 0; i < NA; i++) { var ph = ((t - tm0) * .55 + hsh(i)) % 1, v = i % 8, a2 = v / 8 * 6.283 + Math.PI / 8, vh = (i >> 3) % 4;
        vp.set(Math.cos(a2) * 1.62 + Math.cos(a2) * (ph - .3) * 1.4, .82 + (hsh(i + 9) - .5) * .05, Math.sin(a2) * 1.62 + Math.sin(a2) * (ph - .3) * 1.4); var lx = -.33 + vh * .22; vp.x += -Math.sin(a2) * lx; vp.z += Math.cos(a2) * lx;
        L.crystal.localToWorld(vp); airP[i * 3] = vp.x; airP[i * 3 + 1] = vp.y; airP[i * 3 + 2] = vp.z; } airG.attributes.position.needsUpdate = true; AIR.material.opacity = clamp((t - CUE('s13', 'वेंटि') + .3) / .4) * .9;
    }
    show('srcB', 'src', 'Valmiki Ramayana 5.8-5.9, 6.123-124 · our model, not the film\'s design', t, sc.t0 + .4, 'top:1286px');
  },
  // ---------- C: moved by thought, carried by sky-roamers ----------
  C: function (t, sc) {
    gB.visible = true; P.visible = true; keyAt(OB); key.intensity = 2.6; S.environmentIntensity = 1; bg.visible = true;
    explodeAt(t, -99, sc.t0 - .1); var lift = eio((t - ST('s15') - 1.0) / 3.5) * 1.3; P.position.copy(OB).add(new T.Vector3(0, -2.15 + lift, 0)); P.rotation.y = .5 + (t - sc.t0) * .07;
    shots(t, [PB.engine, { t: sc.t0, d: 2.0, p: PB.close.p, q: PB.close.q, fov: 26 }, { t: ST('s16') - .2, d: 2.6, p: [PB.close.p[0], PB.close.p[1] - 2.2, PB.close.p[2] + 2.0], q: [PB.close.q[0], PB.close.q[1] - .6, PB.close.q[2]], fov: 28 }]);
    var tr = CUE('s15', 'मन'); RINGS.forEach(function (r, i) { var ph = ((t - tr) / 2.0 + i / 3) % 1; r.visible = t > tr; r.position.set(0, lift + 1.2 + ph * .6, 0); r.scale.setScalar(.5 + ph * 1.5); r.material.opacity = (1 - ph) * .8 * clamp((t - tr) / .4); });
    var tc = CUE('s16', 'राक्षस') - .4; CAR.visible = t > tc; for (var i = 0; i < NC; i++) { var a = hsh(i) * 6.283 + (t - tc) * (.5 + hsh(i + 3) * .5), r = 1.2 + hsh(i + 5) * 2.0, y = lift - 2.6 + hsh(i + 7) * 1.6 + Math.sin(t * 2 + i) * .06;
      carP[i * 3] = Math.cos(a) * r; carP[i * 3 + 1] = y; carP[i * 3 + 2] = Math.sin(a) * r; } carG.attributes.position.needsUpdate = true; CAR.material.opacity = clamp((t - tc) / .8) * .95;
    headline(t, sc.t0, 'HOW DOES IT MOVE? · VALMIKI', 'Soch se <b>chalta hai</b>');
    P.updateMatrixWorld(true); var pt = new T.Vector3(1.0, 4.4, 0); P.localToWorld(pt);
    tagAt('m1', '<small>5.8.4</small>Mann ke vichaar se', t, CUE('s15', 'मन') - .1, pt, 'R');
    tagAt('m2', '<small>6.124</small>Soch jitna tez', t, CUE('s15', 'सोच') - .1, pt, 'R');
    var pc = new T.Vector3(-1.6, -1.2, .6); P.localToWorld(pc); tagAt('m3', '<small>5.8.6</small>Rakshas aur bhootgan<br>uthaate hain', t, CUE('s16', 'राक्षस') - .1, pc, 'L', 'tag q', null, '#3fd0c9');
  },
  // ---------- D: the film's hot-air dome, tested ----------
  D: function (t, sc) {
    gD.visible = true; keyAt(OD); key.intensity = 2.2; S.environmentIntensity = .9; bg.visible = true;
    var tS = sc.t0 + .15, tB = tS + 2.35, tH = CUE('s20', 'गरम') - .1, tC = CUE('s20', 'ठंडी') - .1, tU = CUE('s20', 'ऊपर') - .1, tG = CUE('s21', 'सोना') - .3, tN = CUE('s22', 'पच्चीस') - .6;
    var inf = eio((t - tB) / 1.6), rise = eio((t - tU) / 1.6) * .6; balloon.scale.set(.25 + .75 * inf, .2 + .8 * inf, .25 + .75 * inf); balloon.position.y = rise; balloon.visible = t > tB;
    balloon.userData.flame.scale.setScalar(.8 + .25 * Math.sin(t * 23) * Math.sin(t * 7)); HOT.visible = t > tH; HOT.material.opacity = clamp((t - tH) / .5); HOT.position.y = rise + Math.sin(t * 1.3) * .05;
    COLD.visible = t > tC; COLD.material.opacity = clamp((t - tC) / .5) * .9; LIFT.visible = t > tU; LIFT.position.y = 2.9 + rise;
    var drop = eob((t - tG) / .7, 0); CUBE.visible = t > tG; CUBE.position.set(3.2, -1.25 + (1 - drop) * 5, 0); CUBE.rotation.y = .4;
    MINI.forEach(function (b, i) { var ti = tN + i * .085, u = eob((t - ti) / .45, 1.6); b.visible = u > 0; var r = i % 5, c = (i / 5) | 0; b.position.set(4.4 + r * .7, -.6 + c * .9 + Math.sin(t * 1.4 + i) * .04, -1.2); b.scale.setScalar(.2 * u); });
    shots(t, [{ p: [OD.x, .7, 20.5], q: [OD.x, .5, 0], fov: 28 }, { t: tG - .4, d: 2.2, p: [OD.x + 5.3, 1.0, 23], q: [OD.x + 5.3, .6, 0], fov: 28 }]);
    // film still (credited), at most 2.5 s on screen
    var stillOn = t > tS && t < tS + 2.5;
    headline(t, sc.t0, 'FILM KA JAWAAB · PER REVIEWS', 'Gumbad: <b>hot-air balloon</b>');
    show('still', '', '<img src="img/film-pushpak.jpg" style="width:756px;height:425px;object-fit:cover;display:block;border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.6)">', t, tS, 'position:absolute;left:162px;top:470px', tS + 2.2);
    show('stillC', 'label', '© Prime Focus / Sony Pictures · VFX DNEG · via TMDB', t, tS, 'left:162px;top:904px;color:#c9b8ff;font-size:17px', tS + 2.2);
    show('stillQ', 'tag', '<small>THEPRINT, 2 APR 2026 (TEASER)</small>"lotus-cum-hot air balloon"', t, tS + .4, 'left:162px;top:940px;background:#ff6a4a;color:#1a0a06', tS + 2.2);
    if (!stillOn) {
      show('d1', 'tag', '<small>100°C ANDAR</small><span style="font:800 34px Syne">0.95 kg/m³</span>', t, tH, 'left:162px;top:520px', tG - .2);
      show('d2', 'tag', '<small>15°C BAAHAR</small><span style="font:800 34px Syne">1.23 kg/m³</span>', t, tC, 'left:630px;top:520px;background:#cfe8ff', tG - .2);
      show('d3', 'tag q', '<small>LIFT · HAR m³</small><span style="font:800 34px Syne;color:#3fd0c9">0.28 kg</span>', t, tU, 'left:690px;top:700px;background:rgba(7,16,46,.85)', tG - .2);
      show('d4', 'tag', '<small>1 m³ SONA</small><span style="font:800 46px Syne">19.3 tonne</span>', t, CUE('s21', 'उन्नीस') - .1, 'left:162px;top:520px;background:#e8b04a');
      var n = Math.max(0, Math.min(25, Math.ceil((t - tN) / .085)));
      show('d5', 'tag q', '<small>PASSENGER BALLOONS</small><span style="font:800 46px Syne;color:#3fd0c9">× ' + n + '</span>', t, tN, 'left:600px;top:520px;background:rgba(7,16,46,.85)');
      show('d6', 'tag', '<small>OUR CALC · ENVELOPE, FUEL IGNORED</small><span style="font:800 34px Syne">≈ 69,000 m³ garam hawa</span>', t, CUE('s22', 'गरम') - .1, 'left:162px;top:1130px;background:#e8b04a');
    }
    show('srcD', 'src', 'Air density: ideal gas, sea level · gold 19.3 g/cm³', t, tH, 'top:1286px', stillOn ? -1 : null);
  },
  // ---------- E: the 1918 "manual" ----------
  E: function (t, sc) {
    gE.visible = true; keyAt(OE); key.intensity = .5; S.environmentIntensity = .45; bg.visible = false; lampE.target.position.set(0, 0, 0);
    var tR = CUE('s24', 'उन्नीस') - .2, tY = CUE('s24', 'अठारह'), t74 = CUE('s25', 'उन्नीस') - .2, tSt = CUE('s26', 'फ़ैसला') + .25;
    drawRuler(eio((t - tR) / 1.2), eio((t - tY) / .5), eio((t - t74) / 1.2));
    var slide = eio((t - sc.t0) / 1.0); sheetE.position.set(0, 0, (1 - slide) * 6);
    var up = cam.up; up.set(0, 0, -1); var hgt = SH / 2 / Math.tan(10 * Math.PI / 180);
    shots(t, [{ p: [OE.x, hgt * 1.12, OE.z + .6], q: [OE.x, 0, OE.z + .6], fov: 20 }, { t: sc.t0 + .2, d: 2.2, p: [OE.x, hgt, OE.z], q: [OE.x, 0, OE.z], fov: 20 }]);
    var u = eob((t - tSt) / .45, 0), sp = S2W(735, 690, 0); STAMP.visible = t > tSt - .05; STAMP.position.set(sp.x, .15 + (1 - u) * 6, sp.z); STAMP.rotation.set(0, .3, 0); IMP.visible = t > tSt + .4; IMP.material.opacity = clamp((t - tSt - .4) / .15);
    if (t > tSt + .4) { var up2 = eio((t - tSt - .5) / .6); STAMP.position.y = .15 + up2 * 2.2; STAMP.position.x = sp.x + up2 * 1.4; }
    SHAKE = Math.max(0, 1 - Math.abs(t - tSt - .42) / .22);
    headline(t, sc.t0, '"PRACHIN VIMAAN SHASTRA"?', 'Ye kitaab <b>1918</b> ki hai');
    show('e1', 'tag q', '<small>1974 · IISc, BENGALURU</small>5 vaigyanik, 4 vimaan', t, t74 + .5, 'left:600px;top:1176px;background:rgba(7,16,46,.85)', tSt - .1);
    show('e2', 'tag q', '<small>THIS IS CALLED</small><span style="font:800 40px Syne;color:#f4ecd8">MYTH</span>', t, CUE('s26', 'उड़'), 'left:162px;top:1176px;background:rgba(7,16,46,.85);border-color:#ff6a4a');
    show('srcE', 'src', 'Vaimanika Shastra: dictated 1918-23, public 1952 · Mukunda et al., IISc, Scientific Opinion, 1974', t, tR, 'top:1286px');
  },
  // ---------- F: film vs Valmiki ----------
  F: function (t, sc) {
    gF.visible = true; keyAt(OF); key.intensity = 2.4; S.environmentIntensity = .7; bg.visible = true; cam.up.set(0, 1, 0);
    var tFilm = CUE('s27', 'फ़िल्म') - .2, tR = ST('s29') - .1, tK = CUE('s29', 'तोड़') - .05;
    charG.visible = t > tR; var inC = eob((t - tR) / .7, 1.2); charG.scale.setScalar(Math.max(.001, inC));
    CHAR.forEach(function (m, i) { var h = m.userData.h, u = clamp((t - tK) / 1.4), dir = new T.Vector3(h.p.x + hsh(i) - .5, .6 + hsh(i + 3), h.p.z + hsh(i + 5) - .5).normalize();
      if (u <= 0) { m.position.copy(h.p); m.rotation.copy(h.r); return; } var d = u * 3.2; m.position.set(h.p.x + dir.x * d, Math.max(.15, h.p.y + dir.y * d * 1.4 - 4.9 * u * u * 1.4), h.p.z + dir.z * d); m.rotation.set(h.r.x + u * (hsh(i) * 6 - 3), h.r.y + u * 2, h.r.z + u * (hsh(i + 1) * 6 - 3)); });
    DUST.visible = t > tK; for (var i = 0; i < NDU; i++) { var u = clamp((t - tK) / 1.6), a = hsh(i) * 6.283, r = u * (1 + hsh(i + 1) * 2.5); duP[i * 3] = Math.cos(a) * r; duP[i * 3 + 1] = .2 + u * hsh(i + 2) * 1.6; duP[i * 3 + 2] = Math.sin(a) * r; } duG.attributes.position.needsUpdate = true; DUST.material.opacity = (1 - clamp((t - tK) / 1.6)) * .9;
    shots(t, [{ p: [OF.x + 8.5, 5.0, 16.5], q: [OF.x, .4, 0], fov: 30 }, { t: tR, d: 1.8, p: [OF.x + 7.2, 4.2, 14.0], q: [OF.x, .5, 0], fov: 30 }, { t: tK + .1, d: 1.2, p: [OF.x + 8.5, 5.2, 17.0], q: [OF.x, .3, 0], fov: 30 }]);
    SHAKE = Math.max(0, 1 - Math.abs(t - tK - .05) / .25) * .8;
    headline(t, sc.t0, 'FILM VS VALMIKI', 'Ek Pushpak, <b>do roop</b>');
    show('fs', '', '<img src="img/film-pushpak.jpg" style="width:520px;height:292px;object-fit:cover;display:block;border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.6)">', t, tFilm, 'position:absolute;left:162px;top:470px', tFilm + 2.3);
    show('fsC', 'label', '© Prime Focus Studios / Sony Pictures · VFX DNEG', t, tFilm, 'left:162px;top:770px;color:#c9b8ff;font-size:17px', tFilm + 2.3);
    show('f1', 'tag', '<small>FILM</small>Sita haran: Pushpak mein', t, tFilm + .3, 'left:162px;top:810px;background:#ff6a4a;color:#1a0a06', tR - .2);
    show('f2', 'tag', '<small>FILM</small>Jatayu ladte hain usi par', t, CUE('s28', 'जटायु') - .1, 'left:162px;top:920px;background:#ff6a4a;color:#1a0a06', tR - .2);
    var cp = OF.clone().add(new T.Vector3(.4, 2.9, 0));
    tagAt('f3', '<small>VALMIKI 3.51 · OUR MODEL</small>Rath, gadhon se khincha', t, tR + .2, cp, 'R');
    tagAt('f4', '<small>3.51.15-16</small>Jatayu ne tod diya', t, tK - .1, OF.clone().add(new T.Vector3(-.4, 1.2, 0)), 'L', 'tag q', null, '#ff6a4a');
    show('srcF', 'src', 'Valmiki Ramayana, Aranya Kanda 3.51 · film per reviews (Hollywood Reporter India, 6 Nov 2026)', t, tFilm, 'top:1286px');
  },
  // ---------- G: the flight home ----------
  G: function (t, sc) {
    gG.visible = true; P.visible = true; keyAt(OG); key.intensity = 2.4; S.environmentIntensity = .9; bg.visible = true; cam.up.set(0, 1, 0);
    var tS = STOPS.map(function (s, i) { return i ? CUE('s32', s[3]) : ST('s32') - .1; });
    var uRoute = 0; for (var i = 1; i < STOPS.length; i++) { var a = tS[i - 1], b = tS[i]; if (t >= b) uRoute = STOPU[i]; else if (t > a) { uRoute = lerp(STOPU[i - 1], STOPU[i], eio((t - a) / (b - a))); break; } else break; }
    var cnt = routeM.geometry.index.count; routeM.geometry.setDrawRange(0, Math.floor(cnt * uRoute / 6) * 6); routeGl.geometry.setDrawRange(0, Math.floor(cnt * uRoute / 6) * 6); routeM.visible = routeGl.visible = uRoute > 0;
    PINS.forEach(function (p, i) { var u = eob((t - tS[i]) / .4, 1.6); p.visible = u > 0; p.scale.setScalar(Math.max(.001, u)); });
    var tip = ROUTE.getPointAt(Math.max(.001, uRoute)); explodeAt(-99, 0); P.scale.setScalar(.7); P.position.set(OG.x + tip.x, 1.2 + tip.y, tip.z); P.rotation.y = 1.1 + t * .2; P.visible = uRoute > 0;
    var top = [OG.x + .3, 70, 14], obl = [OG.x + .6, 66, 26];
    shots(t, [{ p: top, q: [OG.x + .3, 0, 2.6], fov: 30 }, { t: ST('s31') - .2, d: 2.8, p: obl, q: [OG.x + .4, 0, 3.5], fov: 30 }]);
    headline(t, sc.t0, 'YUDDHA KANDA 6.123 · THE FLIGHT HOME', 'Raasta, <b>upar se</b>', ST('s32') + 1.2);
    STOPS.forEach(function (s, i) { if (t < tS[i]) return; var p = scr(P3(s[1], s[2], .2).add(OG)), right = (s[1] < 79 || i === 1 || s[0] === 'PRAYAG') && s[0] !== 'LANKA';
      show('st' + i, 'label', s[0], t, tS[i], 'top:' + (p.y - 13) + 'px;' + (right ? 'left:' + (p.x + 26) + 'px' : 'left:' + (p.x - 26) + 'px;margin-left:-' + (s[0].length * 12.2) + 'px') + (i === 1 ? ';color:#3fd0c9' : '')); });
    var tK = ST('s33') - .2, km = Math.round(eio((t - tK) / 1.3) * 2700 / 10) * 10;
    show('km', 'tag', '<small>OUR MEASUREMENT · 2,751 km</small><span style="font:800 42px Syne">~' + km.toLocaleString('en-IN') + ' km</span>', t, tK, 'left:520px;top:760px');
    show('srcG', 'label', 'TRAD. SITES · MAP: NASA GIBS', t, tK + .4, 'left:520px;top:856px;color:#c9b8ff;font-size:17px');
  },
  // ---------- H: ISRO's Pushpak lands itself ----------
  H: function (t, sc) {
    gH.visible = true; keyAt(OH); key.position.set(OH.x - 30, 10, OH.z - 20); key.intensity = 2.8; S.environmentIntensity = .8; bg.visible = true; cam.up.set(0, 1, 0);
    var tTD = CUE('s34', 'उतरता') + .1, tt = t - tTD, z, y; RLV.scale.setScalar(1.1);
    if (tt < 0) { z = tt * 12; y = .55 + Math.pow(-tt, 1.4) * .9; } else { var v = 12, dec = 2.4, tc = Math.min(tt, v / dec); z = v * tc - .5 * dec * tc * tc; y = .55; }
    RLV.position.set(0, y, z); RLV.rotation.set(tt < 0 ? .1 : .1 * (1 - clamp(tt / .6)), 0, 0);
    var wp = RLV.position.clone().add(OH), cp = OH.clone().add(new T.Vector3(5.5, 3.0, 22));
    cam.position.copy(cp); cam.lookAt(OH.x, .5 + RLV.position.y * .5, OH.z + Math.max(-30, RLV.position.z) * .6 - 2); if (cam.fov !== 32) { cam.fov = 32; cam.updateProjectionMatrix(); } cam.updateMatrixWorld();
    headline(t, sc.t0, 'ISRO · RLV LEX-03 · 2024', 'Aaj ka <b>Pushpak</b>');
    tagAt('h1', '<small>AUTONOMOUS LANDING</small>Khud runway par utra', t, tTD - .1, RLV.position.clone().add(OH).add(new T.Vector3(0, 1.2, 0)), 'R');
    tagAt('h2', '<small>NAAM</small><span style="font:800 46px Syne">PUSHPAK</span>', t, CUE('s35', 'पुष्पक') - .15, RLV.position.clone().add(OH).add(new T.Vector3(-.4, .1, .2)), 'L');
    show('srcH', 'src', 'ISRO RLV LEX-03 (as reported) · our simple model', t, sc.t0 + .4, 'top:1286px');
  },
  // ---------- I: Part 2 + end card ----------
  I: function (t, sc) {
    gB.visible = true; P.visible = true; keyAt(OB); key.intensity = 2.0; S.environmentIntensity = .9; bg.visible = true; cam.up.set(0, 1, 0);
    explodeAt(-99, 0); P.scale.setScalar(1); P.position.copy(OB).add(new T.Vector3(0, -1.2, 0)); P.rotation.y = .5 + (t - sc.t0) * .16; floorB.position.y = -2.15 + EXP.engine - 1.05;
    S.add(DIYA); DIYA.position.copy(OB).add(new T.Vector3(1.9, -4.3, 2.4)); DIYA.scale.setScalar(.8); DIYA.userData.fl.scale.set(1 + .08 * Math.sin(t * 17), 2.1 + .2 * Math.sin(t * 11), 1); S.add(lampD); lampD.position.copy(DIYA.position).add(new T.Vector3(.3, .6, 0));
    shots(t, [{ p: [PB.close.p[0], PB.close.p[1] + .4, PB.close.p[2] + 3], q: [PB.close.q[0], PB.close.q[1] - .4, PB.close.q[2]], fov: 28 }, { t: ST('s37') - .5, d: 1.8, p: [PB.close.p[0], PB.close.p[1] + 11, PB.close.p[2] + 6], q: [PB.close.q[0], PB.close.q[1] + 13, PB.close.q[2]], fov: 28 }]);
    var tE = ST('s37') - .2;
    headline(t, sc.t0, 'RAMAYANA · PART 2', 'Diwali <b>2028</b>', tE);
    show('i1', 'tag', '<small>AS REPORTED · THE WEEK, 5 NOV 2026</small>Part 2: Diwali 2028', t, CUE('s36', 'अट्ठाईस') - .2, 'left:162px;top:1110px', tE);
    var a = function (w) { return CUE('s37', w) - .1; };
    show('end', 'endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="bL">LIKE</span><span id="bS">SHARE</span><span id="bU">SUBSCRIBE</span></div>', t, tE, '');
    ['bL', 'bS', 'bU'].forEach(function (id, i) { var b = document.getElementById(id); if (!b) return; var u = clamp((t - a(['लाइक', 'शेयर', 'सब्स'][i])) / .3); b.style.opacity = .25 + .75 * u; b.style.transform = 'scale(' + (1 + .12 * Math.sin(Math.PI * clamp((t - a(['लाइक', 'शेयर', 'सब्स'][i])) / .4))) + ')'; });
  }
};
// sound events for audio_mix.py (dumped by tools/events.mjs)
window.EV = (function () { var E = [], add = function (t, k) { E.push({ t: +t.toFixed(3), k: k }); };
  SCN.forEach(function (s, i) { if (i && CUT[s.k]) add(s.t0, 'whoosh'); });
  add(ST('s1'), 'riffle'); add(CUE('s2', 'दो') - .1, 'card'); add(CUE('s3', 'साढ़े') - .1, 'slam'); add(CUE('s4', 'हम') - .2, 'card');
  var tEx = CUE('s6', 'खोलकर') - .15; add(tEx, 'rise'); ORDER.forEach(function (n, k) { add(tEx + k * .2 + .55, 'clunk'); });
  [['s7', 'पहाड़'], ['s8', 'सोना'], ['s9', 'भेड़ि'], ['s10', 'सीढ़'], ['s11', 'मूँग'], ['s12', 'क्रिस्टल'], ['s12', 'हवा']].forEach(function (q) { add(CUE(q[0], q[1]) - .1, 'tick'); });
  add(CUE('s13', 'वेंटि') - .3, 'air'); add(CUE('s14', 'इंजन') - .05, 'hollow'); add(ST('s15') - .1, 'close'); add(CUE('s15', 'मन'), 'shimmer'); add(CUE('s16', 'राक्षस') - .3, 'swirl');
  add(CUE('s18', 'पुष्पक') - .35, 'card'); add(SCN[3].t0 + 2.5, 'inflate'); add(CUE('s20', 'गरम') - .1, 'burner'); add(CUE('s21', 'सोना') - .3 + .55, 'thud');
  for (var i = 0; i < 25; i++) add(CUE('s22', 'पच्चीस') - .6 + i * .085, 'pop');
  add(CUE('s24', 'उन्नीस') - .2, 'draw'); add(CUE('s25', 'उन्नीस') - .2, 'draw'); add(CUE('s26', 'फ़ैसला') + .25 + .42, 'stamp'); add(CUE('s26', 'उड़'), 'card');
  add(CUE('s27', 'फ़िल्म') - .2, 'card'); add(ST('s29') - .1, 'card'); add(CUE('s29', 'तोड़') - .05, 'crash');
  STOPS.forEach(function (st, i) { add(i ? CUE('s32', st[3]) : ST('s32') - .1, i === 1 ? 'ping2' : 'ping'); }); add(ST('s33') - .2, 'count');
  add(CUE('s34', 'उतरता') + .1, 'touch'); add(SE('s35') + .03, 'slam');
  add(CUE('s36', 'अट्ठाईस') - .2, 'card'); ['लाइक', 'शेयर', 'सब्स'].forEach(function (w) { add(CUE('s37', w) - .1, 'pop'); });
  E.sort(function (a, b) { return a.t - b.t; }); return E; })();
window.__dbg = function (s) { return eval(s); };
window.__seek(0); window.__ready = true;
})();
