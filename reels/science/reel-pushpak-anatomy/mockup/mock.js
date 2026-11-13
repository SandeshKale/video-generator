/* Pushpak anatomy — mockup stills. ?s=1 hook (design sheets), 2 exploded Pushpak from Valmiki's verses, 3 the 1918 "manual" + IISc 1974, 4 the return flight on a real map.
   three.js r160; scene -> HDR RT -> bloom -> ACES grade. Every visual is a pure function of t (window.__seek). */
(function () {
var T = THREE, W = 1080, H = 1920, Q = new URLSearchParams(location.search), SC = +(Q.get('s') || 2);
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
var mGrade = new T.ShaderMaterial({ uniforms: { tex: { value: null }, bl: { value: null }, t: { value: 0 }, exp: { value: 1 } }, vertexShader: VS,
  fragmentShader: 'uniform sampler2D tex, bl; uniform float t, exp; varying vec2 vU; float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }' +
  'vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }' +
  'void main(){ vec3 c=(texture2D(tex,vU).rgb + texture2D(bl,vU).rgb*.55)*exp; c=aces(c); c=pow(c,vec3(1./2.2)); vec2 q=vU-.5; c*=1.-dot(q*vec2(1.,.75),q*vec2(1.,.75))*1.1; c+=(h(vU*vec2(1080.,1920.)+t)-.5)*.02; gl_FragColor=vec4(c,1.); }' });
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
  g.setAttribute('position', new T.BufferAttribute(p, 3)); S.add(new T.Points(g, new T.PointsMaterial({ color: 0xbfd0ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: .55 }))); })();

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
var P = new T.Group(); S.add(P); var L = {};
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
  P.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  // engine slot: empty, dashed (nothing in the text)
  var eg = layer('engine'); var box = new T.LineSegments(new T.EdgesGeometry(new T.CylinderGeometry(1.1, 1.1, .9, 8)), new T.LineDashedMaterial({ color: 0x3fd0c9, dashSize: .12, gapSize: .09, transparent: true, opacity: .9 })); box.computeLineDistances(); eg.add(box);
})();
var ASM = { engine: -1.95, deck: 0, stairs: 0, pillars: .04, crystal: .1, frame: 1.25, peaks: 1.45 };
var EXP = { engine: -2.5, deck: 0, stairs: -.42, pillars: 1.0, crystal: 2.35, frame: 3.65, peaks: 4.25 };
function setExplode(e) { for (var k in L) L[k].position.y = ASM[k] + (EXP[k] - ASM[k]) * e; }

// =============== SCENE 2: exploded Pushpak ===============
function scene2() {
  setExplode(1); P.rotation.y = .32; P.position.set(0, -2.15, 0);
  cam.fov = 26; cam.updateProjectionMatrix(); P.updateMatrixWorld(true);
  var top = new T.Vector3(0, ASM.peaks + 0 + 2.75, 0), bot = new T.Vector3(0, EXP.engine - .5, 0); top.y = EXP.peaks + 2.75; P.localToWorld(top); P.localToWorld(bot);
  fitV(new T.Vector3(0, 1.5, 0), new T.Vector3(0, .2, 1).normalize(), top, bot, 470, 1230);
  var floor = new T.Mesh(new T.CircleGeometry(9, 64), new T.MeshStandardMaterial({ color: 0x0b1440, roughness: .35, metalness: .4 })); floor.rotation.x = -Math.PI / 2; floor.position.y = bot.y - .6; floor.receiveShadow = true; S.add(floor);
  render(4.2);
  el('kick', '<i></i>OUR 3D · BUILT FROM VALMIKI\'S WORDS');
  el('head', 'Pushpak, <b>part by part</b>', 'font-size:64px');
  var tags = [['peaks', 1.3, 'R', '5.8.5', 'Pahaad jaisa,<br>kai shikhar'], ['frame', .05, 'L', '5.8.1 · 6.124', 'Sona, heere,<br>ghantiyaan'], ['crystal', .45, 'R', '5.9.16', 'Crystal khidkiyaan<br>+ hawa ke chhed'],
    ['pillars', .6, 'L', '5.9.13', 'Khambhe: bhediyon<br>ki nakkaashi'], ['deck', -.05, 'R', '5.9.17 · 6.123.1', 'Moonge ka farsh,<br>hans ke chitra'], ['stairs', -.25, 'L', '5.9.15', 'Sone ki<br>seedhiyaan']];
  var lastY = { L: 400, R: 400 };
  tags.forEach(function (q) { var g = L[q[0]], p = new T.Vector3(q[2] === 'R' ? 1.5 : -1.5, q[1], .8); g.localToWorld(p); var sp = scr(p);
    var ty = Math.max(sp.y - 40, lastY[q[2]] + 14), tx = q[2] === 'R' ? 690 : 162, d = el('tag', '<small>' + q[3] + '</small>' + q[4], 'left:' + tx + 'px;top:' + ty + 'px');
    lastY[q[2]] = ty + d.offsetHeight; var ay = ty + d.offsetHeight / 2; leader(sp, { x: q[2] === 'R' ? tx : tx + d.offsetWidth, y: ay }); });
  var ep = new T.Vector3(1.1, 0, 0); L.engine.localToWorld(ep); var se = scr(ep);
  var ey = Math.max(se.y - 40, lastY.R + 14), ed = el('tag q', '<small>ENGINE?</small>Text mein nahi', 'left:690px;top:' + ey + 'px'); leader(se, { x: 690, y: ey + ed.offsetHeight / 2 }, '#3fd0c9');
  el('src', 'Valmiki Ramayana 5.8-5.9, 6.123-124 · not the film\'s design');
  el('cap', 'Valmiki ne iske <span>hawa ke chhed</span> tak likhe.');
}

// =============== SCENE 1: forty-fifty design sheets ===============
function sheetTex(i) { return cv(512, 724, function (g, w, h, c) { g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,60,140,.18)'; g.lineWidth = 1; for (var x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (var y = 0; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  var rc = rough.canvas(c), o = { seed: i + 1, stroke: '#1f3f9a', strokeWidth: 6, roughness: 1.4 }, cx = w / 2, cy = h * .48, k = hsh(i);
  if (k < .25) { rc.ellipse(cx, cy, 300, 110, o); rc.polygon([[cx - 60, cy - 50], [cx, cy - 170], [cx + 60, cy - 50]], o); }
  else if (k < .5) { rc.circle(cx, cy, 240, o); rc.ellipse(cx, cy, 380, 60, o); rc.ellipse(cx, cy, 300, 40, o); }
  else if (k < .75) { for (var j = 0; j < 5; j++) rc.rectangle(cx - 150 + j * 15, cy - j * 50, 300 - j * 30, 46, o); rc.line(cx - 220, cy + 60, cx + 220, cy + 60, o); }
  else { rc.polygon([[cx - 170, cy + 40], [cx + 170, cy + 40], [cx + 90, cy - 40], [cx - 90, cy - 40]], o); rc.arc(cx, cy - 40, 180, 180, Math.PI, Math.PI * 2, false, o); rc.line(cx - 200, cy + 80, cx + 200, cy + 80, o); }
  g.fillStyle = '#1f3f9a'; g.font = '34px FM'; g.fillText('DESIGN ' + String(i + 1).padStart(2, '0') + ' / 50', 28, 46); g.fillText('ILLUSTRATIVE', w - 190, h - 26); }); }
function scene1() { P.visible = false;
  var table = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshStandardMaterial({ color: 0x2a1810, roughness: .55, metalness: .05, map: cv(512, 512, function (g, w, h) { g.fillStyle = '#3a2216'; g.fillRect(0, 0, w, h); for (var i = 0; i < 240; i++) { g.strokeStyle = 'rgba(' + (60 + hsh(i) * 40 | 0) + ',30,18,.35)'; g.lineWidth = 1 + hsh(i + 1) * 3; g.beginPath(); var y = hsh(i * 3) * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 8, w * .6, y - 8, w, y + 4); g.stroke(); } }) }));
  table.rotation.x = -Math.PI / 2; table.receiveShadow = true; S.add(table);
  for (var i = 0; i < 50; i++) { var m = new T.Mesh(new T.PlaneGeometry(2.1, 2.97), new T.MeshStandardMaterial({ map: sheetTex(i), roughness: .9 }));
    var u = i / 49, a = -1.0 + u * 2.0; m.rotation.x = -Math.PI / 2; m.rotation.z = a * .55 + (hsh(i) - .5) * .1; m.position.set(Math.sin(a) * 3.2 + (hsh(i + 4) - .5) * .3, .004 * i + .01, -Math.cos(a) * 1.2 + 1.6 + (hsh(i + 8) - .5) * .3); m.castShadow = true; m.receiveShadow = true; S.add(m); }
  var lamp = new T.SpotLight(0xffd29a, 150, 30, .6, .6, 1.6); lamp.position.set(-3, 9, 3); lamp.target.position.set(0, 0, 0.6); lamp.castShadow = true; S.add(lamp); S.add(lamp.target);
  key.intensity = .6; S.environmentIntensity = .4; bg.visible = false;
  cam.fov = 30; cam.updateProjectionMatrix(); fitV(new T.Vector3(0, 0, 1), new T.Vector3(0, 1, .45).normalize(), new T.Vector3(0, 0, -1.4), new T.Vector3(0, 0, 3.4), 540, 990);
  render(1.3);
  el('kick', '<i></i>RAMAYANA · PART 1 · IN CINEMAS 5 NOV');
  el('head', 'Pushpak ke <b>40-50</b> design');
  el('tag', '<small>SIRF DESIGN</small><span style="font:800 64px Syne;color:#1a1530">2 saal</span>', 'left:162px;top:1010px');
  el('tag', '<small>RAVAN-JATAYU SEQUENCE</small><span style="font:800 64px Syne;color:#b43a1e">6.5 saal</span>', 'left:520px;top:1010px');
  el('tag q', '<small>NITESH TIWARI, DIRECTOR</small>"We wanted some kind of<br>science to go into it."', 'left:162px;top:1160px;background:rgba(7,16,46,.8)');
  el('cap', 'Aur Ravan-Jatayu ki ladaai? <span>Saadhe chhe saal.</span>');
  el('src', 'Shreyas Media interview, via India.com (1 Nov 2026) · sheets are our sketches, not the film\'s', 'top:1290px');
}

// =============== SCENE 3: the 1918 "manual" on the table + IISc 1974 ===============
var SW = 7, SH = 7 * 1920 / 1080;
function S2W(sx, sy, y) { return new T.Vector3((sx / W - .5) * SW, y || 0, (sy / H - .5) * SH); }
function blueprintTex() { var K = 1.3; return cv(W * K, H * K, function (g, w, h, c) { g.scale(K, K); g.fillStyle = '#163f86'; g.fillRect(0, 0, W, H);
  for (var i = 0; i < 9000; i++) { g.fillStyle = 'rgba(255,255,255,' + (hsh(i) * .05) + ')'; g.fillRect(hsh(i * 3) * W, hsh(i * 7) * H, 2, 2); }
  g.strokeStyle = 'rgba(220,235,255,.14)'; g.lineWidth = 1; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  var rc = rough.canvas(c), o = { seed: 7, stroke: '#eaf3ff', strokeWidth: 2.4, roughness: 1.1 }, cx = 470, cy = 680;
  rc.ellipse(cx, cy, 520, 150, o); rc.ellipse(cx, cy - 110, 290, 96, o); rc.circle(cx, cy - 196, 80, o);
  for (var k = 0; k < 6; k++) { rc.line(cx - 220 + k * 88, cy + 70, cx - 240 + k * 96, cy + 180, o); rc.circle(cx - 240 + k * 96, cy + 196, 30, o); }
  for (var s2 = 0; s2 < 3; s2++) rc.arc(cx, cy - 196, 130 + s2 * 48, 130 + s2 * 48, Math.PI * 1.1, Math.PI * 1.9, false, Object.assign({}, o, { strokeWidth: 1.6 }));
  g.fillStyle = '#eaf3ff'; g.font = '20px FM'; g.fillText('FIG. ?  "VIMANA" · MANUAL-STYLE SKETCH', 162, 958); g.fillText('ILLUSTRATIVE, NOT THE BOOK\'S DRAWING', 162, 986);
  var y0 = 1086, x0 = 162, x1 = 918; g.strokeStyle = '#eaf3ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y0); g.stroke();
  function X(yr) { return x0 + (yr - 1895) / (1980 - 1895) * (x1 - x0); }
  g.fillStyle = 'rgba(232,176,74,.9)'; g.fillRect(X(1918), y0 - 22, X(1923) - X(1918), 44);
  g.font = '22px FM'; g.fillStyle = '#eaf3ff'; [[1903, 'WRIGHTS'], [1918, ''], [1952, 'PUBLIC'], [1974, 'IISc']].forEach(function (q) { g.fillRect(X(q[0]) - 1.5, y0 - 16, 3, 32); g.fillText(q[0], X(q[0]) - 24, y0 + 46); if (q[1]) g.fillText(q[1], X(q[0]) - 24, y0 + 74); });
  g.fillStyle = '#ffd27a'; g.font = '24px FM'; g.fillText('DICTATED 1918-23', X(1918) - 40, y0 - 38); }); }
function scene3() { P.visible = false;
  var sheet = new T.Mesh(new T.PlaneGeometry(SW * 1.06, SH * 1.06), new T.MeshStandardMaterial({ map: blueprintTex(), roughness: .85 })); sheet.material.map.repeat.set(1 / 1.06, 1 / 1.06); sheet.material.map.offset.set(.03, .03); sheet.rotation.x = -Math.PI / 2; sheet.receiveShadow = true; S.add(sheet);
  var ink = cv(700, 700, function (g, w, h) { g.translate(w / 2, h / 2); g.rotate(-.18); g.strokeStyle = '#ff4a2e'; g.fillStyle = '#ff4a2e'; g.lineWidth = 16; g.beginPath(); g.arc(0, 0, 300, 0, 7); g.stroke(); g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 262, 0, 7); g.stroke();
    g.textAlign = 'center'; g.font = '800 92px Syne'; g.fillText('IISc 1974', 0, -50); g.font = '800 60px Syne'; g.fillText('CAN\'T FLY', 0, 40); g.font = '28px FM'; g.fillText('"NONE ... CAPABLE OF', 0, 108); g.fillText('BEING FLOWN"', 0, 146); });
  var sp = S2W(735, 690, .02), r = 330 / W * SW;
  var imp = new T.Mesh(new T.PlaneGeometry(r, r), new T.MeshBasicMaterial({ map: ink, transparent: true, opacity: .95, depthWrite: false })); imp.rotation.x = -Math.PI / 2; imp.position.copy(sp); S.add(imp);
  var stamp = new T.Group(); var rub = new T.Mesh(new T.CylinderGeometry(.95, .95, .25, 48), new T.MeshStandardMaterial({ color: 0x2a1a14, roughness: .6 })); stamp.add(rub);
  var hdl = lathe([[.85, .12], [.9, .3], [.42, .5], [.32, 1.4], [.5, 1.8], [.36, 2.1], [0, 2.15]], new T.MeshStandardMaterial({ color: 0x8a5228, roughness: .45 }), 32); stamp.add(hdl);
  stamp.position.copy(S2W(880, 470, .5)); stamp.rotation.set(-1.2, 0, .5); stamp.scale.setScalar(.75); stamp.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); S.add(stamp);
  var lamp = new T.SpotLight(0xfff0d8, 420, 60, .7, .6, 1.3); lamp.position.set(-4, 14, -3); lamp.target.position.set(0, 0, 0); lamp.castShadow = true; S.add(lamp); S.add(lamp.target);
  key.intensity = .5; S.environmentIntensity = .45; bg.visible = false;
  cam.fov = 20; cam.up.set(0, 0, -1); cam.position.set(0, SH / 2 / Math.tan(10 * Math.PI / 180), 0); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
  render(2.1);
  el('kick', '<i></i>"PRACHIN VIMAAN SHASTRA"?');
  el('head', 'Ye kitaab <b>1918</b> ki hai');
  el('tag q', '<small>THIS IS CALLED</small><span style="font:800 40px Syne;color:#f4ecd8">MYTH</span>', 'left:162px;top:1196px;background:rgba(7,16,46,.85);border-color:#ff6a4a');
  el('src', 'Vaimanika Shastra: dictated 1918-23, public 1952 · Mukunda et al., IISc, Scientific Opinion, 1974', 'top:1290px');
  el('cap', 'IISc ke paanch scientists: <span>koi bhi plane ud nahi sakta.</span>');
}

// =============== SCENE 4: the return flight on a real map ===============
function scene4() {
  var tex = new T.TextureLoader().load('img/india.jpg', function () { render(6); finish4(); }); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8;
  var LON0 = 66, LON1 = 92, LAT0 = 4, LAT1 = 32, KX = .95;
  function P3(lon, lat, y) { return new T.Vector3((lon - 79) * KX, y || 0, -(lat - 18)); }
  var map = new T.Mesh(new T.PlaneGeometry((LON1 - LON0) * KX, LAT1 - LAT0), new T.MeshStandardMaterial({ map: tex, roughness: .9, metalness: 0 })); map.rotation.x = -Math.PI / 2; map.receiveShadow = true; S.add(map);
  var stops = [['LANKA', 80.7, 7.9], ['SETU', 79.42, 9.17], ['KISHKINDHA', 76.46, 15.33], ['PANCHAVATI', 73.79, 20.0], ['CHITRAKOOT', 80.85, 25.2], ['PRAYAG', 81.85, 25.43], ['AYODHYA', 82.2, 26.8]];
  var pts = stops.map(function (s) { return P3(s[1], s[2], .18); });
  var curve = new T.CatmullRomCurve3(pts, false, 'centripetal', .3);
  var arc = new T.TubeGeometry(curve, 300, .07, 10, false); var arcM = new T.Mesh(arc, new T.MeshBasicMaterial({ color: new T.Color(0xffc35a).multiplyScalar(2.2) })); S.add(arcM);
  var glow = new T.Mesh(new T.TubeGeometry(curve, 300, .22, 10, false), new T.MeshBasicMaterial({ color: 0xffb040, transparent: true, opacity: .18, depthWrite: false })); S.add(glow);
  stops.forEach(function (s, i) { var pin = new T.Mesh(new T.CylinderGeometry(.16, .16, .06, 24), new T.MeshBasicMaterial({ color: new T.Color(i === 1 ? 0x3fd0c9 : 0xfff1c8).multiplyScalar(2) })); pin.position.copy(P3(s[1], s[2], .2)); S.add(pin);
    var ring = new T.Mesh(new T.RingGeometry(.28, .34, 32), new T.MeshBasicMaterial({ color: 0xfff1c8, transparent: true, opacity: .7, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.copy(P3(s[1], s[2], .21)); S.add(ring); });
  // the Pushpak (assembled, small) riding the route at ~70%
  setExplode(0); P.scale.setScalar(.7); var pp = curve.getPointAt(.71); P.position.set(pp.x, 1.2, pp.z); P.rotation.y = 1.2;
  var sh = new T.Mesh(new T.CircleGeometry(.9, 32), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .35, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.set(pp.x, .05, pp.z); S.add(sh);
  key.position.set(-8, 14, 6); bg.visible = true;
  cam.fov = 30; cam.updateProjectionMatrix(); fitV(new T.Vector3(.4, 0, -1), new T.Vector3(0, 1, .3).normalize(), P3(82.2, 27.6), P3(80.7, 7.2), 470, 1240);
  function finish4() {
    el('kick', '<i></i>YUDDHA KANDA 6.123 · THE FLIGHT HOME');
    el('head', 'Raasta, <b>upar se</b>', 'font-size:64px');
    stops.forEach(function (s, i) { var p = scr(P3(s[1], s[2], .2)), right = (s[1] < 79 || i === 1 || s[0] === 'PRAYAG') && s[0] !== 'LANKA'; var d = el('label', s[0], 'top:' + (p.y - 13) + 'px;' + (right ? 'left:' + (p.x + 26) + 'px' : 'left:' + (p.x - 26) + 'px;transform:translateX(-100%)') + (i === 1 ? ';color:#3fd0c9' : '')); });
    el('tag', '<small>OUR MEASUREMENT · TRADITIONAL SITES</small><span style="font:800 60px Syne">≈2,750 km</span>', 'left:162px;top:1110px');
    el('src', 'Map: NASA Blue Marble (GIBS) · sites are traditional identifications', 'top:1290px');
    el('cap', 'Lanka, Setu, Kishkindha... <span>lagbhag sattaais sau kilometre.</span>');
  }
}

window.__ready = false;
({ 1: scene1, 2: scene2, 3: scene3, 4: scene4 })[SC]();
setTimeout(function () { window.__ready = true; }, SC === 4 ? 1500 : 200);
})();
