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

