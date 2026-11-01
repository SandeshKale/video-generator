/* "The clock that broke India's GPS" - 3D world (three.js). One continuous scene: a phone on a desk at India's location, Earth at night, the NavIC satellites,
   the rocket pad. The camera travels (powers-of-ten climb from the phone to orbit, a tracked launch). Every frame is a pure function of t (window.__seek). */
(function () {
var W = 1080, H = 1920, AMB = 0xffb020, SKY = 0x55b8ff, RED = 0xff4a3d, IVO = 0xf4efe3;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function eo(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function bk(x) { x = clamp(x); var c = 1.7; return Math.max(0, 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2)); }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
/* ---- cues from the voice ---- */
var SS = {}; TM.sentences.forEach(function (s) { SS[s.id] = s; });
function T0(id) { return SS[id].t0; } function T1(id) { return SS[id].t1; }
function PT(id, sub, n) { var b = TM.B[id], pos = -1; for (var c = 0; c <= (n || 0); c++) { pos = b.indexOf(sub, pos + 1); if (pos < 0) { window.__miss = (window.__miss || []).concat([id + ':' + sub]); return T0(id); } } return T0(id) + (T1(id) - T0(id)) * pos / b.length; }
var END = TM.end;
var B = [0, T0('p1') - .05, T0('i1') - .12, T1('i2') + .4, T1('i5') + .5, T1('i6') + .5, T1('b2') + .4, T1('b4') + .4, T1('d2') + .45, T0('t1') - .1, T0('t3') - .1, T1('t3') + .45, T1('y3') + .3, T1('y4') + .5, END];
function sceneAt(t) { var c = 0; for (var i = 0; i < B.length - 1; i++) if (t >= B[i]) c = i; return c; }
/* ---- renderer ---- */
var cv = document.getElementById('gl');
var R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
var S = new THREE.Scene(); S.background = new THREE.Color(0x01070b);
var C = new THREE.PerspectiveCamera(38, W / H, .005, 400);
var V3 = THREE.Vector3;
/* ---- geography: Earth radius 5 units; objects near the ground are exaggerated (powers-of-ten) ---- */
var ER = 5;
function ll(lat, lon, r) { var th = Math.PI / 2 - lat * Math.PI / 180, ph = (lon + 180) * Math.PI / 180; return new V3(-r * Math.cos(ph) * Math.sin(th), r * Math.cos(th), r * Math.sin(ph) * Math.sin(th)); }
function frame(lat, lon) { var up = ll(lat, lon, 1), e = ll(lat, lon + .01, 1).sub(up); e.sub(up.clone().multiplyScalar(e.dot(up))).normalize(); var n = up.clone().cross(e).normalize(); return { up: up, east: e, north: n }; }
var IN = frame(20.6, 78.9), PI_ = IN.up.clone().multiplyScalar(ER);     // India: the phone sits here
var SR = frame(13.7, 80.2), PS_ = SR.up.clone().multiplyScalar(ER);     // Sriharikota
function basisQ(f) { var m = new THREE.Matrix4().makeBasis(f.east, f.up, f.east.clone().cross(f.up)); return new THREE.Quaternion().setFromRotationMatrix(m); }
/* ---- textures ---- */
var loader = new THREE.TextureLoader(), loaded = 0, NEED = 2;
function tex(src) { var t = loader.load(src, function () { loaded++; }); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
var dayT = tex('img/day.jpg'), nightT = tex('img/night.jpg');
var sunDir = ll(10, 78.9 - 108, 1).normalize();
/* ---- Earth: day/night shader, night lights in amber, blue rim ---- */
var earth = new THREE.Mesh(new THREE.SphereGeometry(ER, 160, 120), new THREE.ShaderMaterial({
  uniforms: { dayMap: { value: dayT }, nightMap: { value: nightT }, sunDir: { value: sunDir } },
  vertexShader: 'varying vec3 vN;varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: 'uniform sampler2D dayMap;uniform sampler2D nightMap;uniform vec3 sunDir;varying vec3 vN;varying vec2 vUv;varying vec3 vW;void main(){vec3 n=normalize(vN);float d=dot(n,normalize(sunDir));float dayK=smoothstep(-.10,.22,d);vec3 dc=texture2D(dayMap,vUv).rgb;float nl=texture2D(nightMap,vUv).r;vec3 land=dc*(.05+max(d,0.)*1.2);vec3 lights=vec3(1.7,1.0,.38)*pow(nl,.85)*(1.-dayK)*1.9;vec3 col=land*dayK+dc*vec3(.05,.07,.11)*(1.-dayK)+lights;vec3 v=normalize(cameraPosition-vW);float rim=pow(1.-max(dot(n,v),0.),3.);col+=vec3(.2,.48,1.)*rim*(.3+.9*dayK);gl_FragColor=vec4(col,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
}));
S.add(earth);
var atmo = new THREE.Mesh(new THREE.SphereGeometry(ER * 1.045, 96, 64), new THREE.ShaderMaterial({ transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
  vertexShader: 'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: 'varying vec3 vN;void main(){float i=pow(max(0.,.78-dot(vN,vec3(0.,0.,1.))),3.)*2.2;gl_FragColor=vec4(.25,.55,1.,1.)*i;}' }));
S.add(atmo);
/* stars */
(function () { var g = new THREE.BufferGeometry(), p = new Float32Array(1800 * 3); for (var i = 0; i < 1800; i++) { var a = hash(i + 1) * 6.283, b = Math.acos(2 * hash(i + 9) - 1), r = 150 + hash(i + 40) * 50; p[i * 3] = r * Math.sin(b) * Math.cos(a); p[i * 3 + 1] = r * Math.cos(b); p[i * 3 + 2] = r * Math.sin(b) * Math.sin(a); } g.setAttribute('position', new THREE.BufferAttribute(p, 3)); S.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xbfd8ff, size: 2, sizeAttenuation: false, transparent: true, opacity: .8 }))); })();
/* lights (for the objects; the Earth shader has its own) */
var sunL = new THREE.DirectionalLight(0xfff2dd, 2.2); sunL.position.copy(sunDir).multiplyScalar(60); S.add(sunL);
var keyL = new THREE.DirectionalLight(0x9cc8ff, 1.5); keyL.position.copy(PI_).add(IN.east.clone().multiplyScalar(14)).add(IN.up.clone().multiplyScalar(20)); S.add(keyL);
S.add(new THREE.HemisphereLight(0x5a7aa8, 0x0a1218, .9));
var padKey = new THREE.DirectionalLight(0xfff0e0, 0); padKey.position.copy(PS_.clone().add(SR.up.clone().multiplyScalar(3)).add(SR.east.clone().multiplyScalar(-1.2)).add(SR.north.clone().multiplyScalar(-2))); S.add(padKey); var padWarm = new THREE.PointLight(0xffa040, 0, 8, 2); S.add(padWarm);
/* glow sprite texture */
function glowTex(c0, c1) { var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, c0); g.addColorStop(.35, c1); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
var GL_AMB = glowTex('rgba(255,236,170,1)', 'rgba(255,150,30,.55)'), GL_SKY = glowTex('rgba(210,240,255,1)', 'rgba(85,184,255,.5)'), GL_WHT = glowTex('rgba(255,255,255,.9)', 'rgba(200,210,230,.3)');
function sprite(t, col, s, op) { var m = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, color: col || 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: op == null ? 1 : op })); m.scale.set(s, s, 1); return m; }
/* ---- satellite ---- */
function mkSat(sc) { var g = new THREE.Group();
  var gold = new THREE.MeshStandardMaterial({ color: 0xd8a233, metalness: .85, roughness: .32 }), fr = new THREE.MeshStandardMaterial({ color: 0xc8ccd6, metalness: .8, roughness: .4 });
  var pan = new THREE.MeshStandardMaterial({ color: 0x123a82, metalness: .75, roughness: .22, emissive: 0x0a2a66, emissiveIntensity: .9 });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(.5, .46, .6), gold));
  for (var s = -1; s <= 1; s += 2) { var arm = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .04), fr); arm.position.x = s * .5; g.add(arm); for (var k = 0; k < 3; k++) { var p = new THREE.Mesh(new THREE.BoxGeometry(.46, .015, .58), pan); p.position.set(s * (.95 + k * .5), 0, 0); g.add(p); } }
  var dish = new THREE.Mesh(new THREE.ConeGeometry(.24, .14, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0xe8eaf0, metalness: .5, roughness: .3, side: THREE.DoubleSide })); dish.position.y = .33; g.add(dish);
  var win = new THREE.Mesh(new THREE.PlaneGeometry(.3, .22), new THREE.MeshBasicMaterial({ color: AMB })); win.position.set(0, 0, .301); g.add(win); g.userData.win = win;
  var halo = sprite(GL_AMB, 0xffffff, 2.4, .5); halo.position.set(0, 0, .35); g.add(halo); g.userData.halo = halo;
  g.scale.setScalar(sc); return g; }
/* NavIC constellation near India (stylised: not to scale) */
var CEN = PI_.clone().normalize().multiplyScalar(9.4), SATA = [100, 220, 340], sats = [], slot4;
SATA.forEach(function (a) { var p = CEN.clone().add(IN.east.clone().multiplyScalar(Math.cos(a * Math.PI / 180) * 2.3)).add(IN.north.clone().multiplyScalar(Math.sin(a * Math.PI / 180) * 2.3)); var s = mkSat(1); s.position.copy(p); s.lookAt(0, 0, 0); S.add(s); sats.push(s); });
var P4 = CEN.clone().add(IN.east.clone().multiplyScalar(Math.cos(40 * Math.PI / 180) * 2.3)).add(IN.north.clone().multiplyScalar(Math.sin(40 * Math.PI / 180) * 2.3));
slot4 = new THREE.Group(); (function () { var pts = []; for (var i = 0; i <= 64; i++) pts.push(new V3(Math.cos(i / 64 * 6.283) * .45, Math.sin(i / 64 * 6.283) * .45, 0)); var l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: AMB, dashSize: .12, gapSize: .1, transparent: true })); l.computeLineDistances(); slot4.add(l); slot4.userData.ring = l; var gl = sprite(GL_AMB, 0xffffff, 1.3, .35); slot4.add(gl); slot4.userData.gl = gl; })(); slot4.position.copy(P4); slot4.lookAt(0, 0, 0); S.add(slot4);
var sat4 = mkSat(1); sat4.position.copy(P4); sat4.lookAt(0, 0, 0); sat4.visible = false; S.add(sat4);
/* rays + pulses */
function mkRay(col) { var m = new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, 1, 6, 1, true), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false })); m.geometry.translate(0, .5, 0); S.add(m); return m; }
var YAXIS = new V3(0, 1, 0);
function setRay(m, a, b, op) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(YAXIS, d.normalize()); m.material.opacity = op; m.visible = op > .01; }
var rays = [mkRay(SKY), mkRay(SKY), mkRay(SKY), mkRay(AMB)], pulsesN = []; for (var i = 0; i < 4 * 3; i++) { var sp = sprite(GL_SKY, 0xffffff, .5, 0); S.add(sp); pulsesN.push(sp); }
/* the blue dot on the ground, its error disc and halo */
var dotG = new THREE.Group(); dotG.position.copy(PI_.clone().add(IN.up.clone().multiplyScalar(.004))); dotG.quaternion.copy(basisQ(IN)); S.add(dotG);
var errDisc = new THREE.Mesh(new THREE.CircleGeometry(1, 72), new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: .22, depthWrite: false, side: THREE.DoubleSide })); errDisc.rotation.x = -Math.PI / 2; dotG.add(errDisc);
var errRing = new THREE.Mesh(new THREE.RingGeometry(.955, 1, 96), new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: .95, depthWrite: false, side: THREE.DoubleSide })); errRing.rotation.x = -Math.PI / 2; dotG.add(errRing);
var dotCore = sprite(GL_WHT, 0xffffff, .55, 1); dotCore.position.y = .02; dotG.add(dotCore);
var haloR = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 64), new THREE.MeshBasicMaterial({ color: IVO, transparent: true, opacity: .8, depthWrite: false, side: THREE.DoubleSide })); haloR.rotation.x = -Math.PI / 2; dotG.add(haloR);
/* ---- the phone on the desk (same place as the dot: powers of ten) ---- */
function roundRect(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
var phone = new THREE.Group(); phone.position.copy(PI_.clone().add(IN.up.clone().multiplyScalar(.0006))); phone.quaternion.copy(basisQ(IN)); S.add(phone);
var desk = new THREE.Mesh(new THREE.CircleGeometry(.62, 64), new THREE.MeshStandardMaterial({ color: 0x0a1c22, roughness: .38, metalness: .25, transparent: true })); desk.rotation.x = -Math.PI / 2; phone.add(desk);
var pbody = new THREE.Mesh(new THREE.ExtrudeGeometry(roundRect(.092, .192, .016), { depth: .007, bevelEnabled: true, bevelThickness: .0016, bevelSize: .0016, bevelSegments: 3, curveSegments: 10 }), new THREE.MeshStandardMaterial({ color: 0x2b3238, metalness: .9, roughness: .28 })); pbody.rotation.x = -Math.PI / 2; phone.add(pbody);
var pc = document.createElement('canvas'); pc.width = 512; pc.height = 1024; var px = pc.getContext('2d'), pTex = new THREE.CanvasTexture(pc); pTex.colorSpace = THREE.SRGBColorSpace; pTex.anisotropy = 4;
var pscr = new THREE.Mesh(new THREE.PlaneGeometry(.084, .184), new THREE.MeshBasicMaterial({ map: pTex, toneMapped: false })); pscr.rotation.x = -Math.PI / 2; pscr.position.y = .0092; phone.add(pscr);
var pLight = new THREE.PointLight(0x8fc4ff, .05, 3, 2); pLight.position.set(0, .06, 0); phone.add(pLight);
var pLight2 = new THREE.PointLight(0xffb870, .03, 3, 2); pLight2.position.set(.25, .12, .2); phone.add(pLight2);
function bez(u, a, b, c, d) { var v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d; }
function drawPhone(t, errPx, fix, show4, mv) { var c = px; c.fillStyle = '#04181d'; c.fillRect(0, 0, 512, 1024);
  c.strokeStyle = 'rgba(85,184,255,.20)'; c.lineWidth = 3; for (var i = 0; i < 12; i++) { c.beginPath(); c.moveTo(0, i * 92); c.lineTo(512, i * 92 - 30); c.stroke(); c.beginPath(); c.moveTo(i * 60, 0); c.lineTo(i * 60 + 40, 1024); c.stroke(); }
  c.strokeStyle = 'rgba(85,184,255,.55)'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(40, 880); c.bezierCurveTo(160, 760, 200, 620, 270, 520); c.bezierCurveTo(330, 440, 400, 380, 480, 300); c.stroke();
  var cx = 256, cy = 560; if (mv != null) { cx = bez(mv, 40, 160, 200, 270); cy = bez(mv, 880, 760, 620, 520); } var pulse = 1 + .05 * Math.sin(t * 3);
  c.fillStyle = 'rgba(255,74,61,.20)'; c.beginPath(); c.arc(cx, cy, errPx * pulse, 0, 6.283); c.fill(); c.strokeStyle = '#ff4a3d'; c.lineWidth = 6; c.setLineDash([22, 14]); c.lineDashOffset = -t * 40; c.beginPath(); c.arc(cx, cy, errPx * pulse, 0, 6.283); c.stroke(); c.setLineDash([]);
  var ph = (t * .9) % 1; c.strokeStyle = 'rgba(244,239,227,' + (1 - ph) + ')'; c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, 22 + ph * 70, 0, 6.283); c.stroke();
  c.fillStyle = '#f4efe3'; c.strokeStyle = '#55b8ff'; c.lineWidth = 9; c.beginPath(); c.arc(cx, cy, 24, 0, 6.283); c.fill(); c.stroke();
  c.fillStyle = 'rgba(3,20,23,.92)'; c.fillRect(0, 0, 512, 120); c.fillStyle = '#f4efe3'; c.font = '700 40px "IBM Plex Mono"'; c.fillText('10:00', 28, 76); c.fillStyle = '#ffb020'; c.font = '700 26px "IBM Plex Mono"'; c.fillText('NavIC', 380, 72);
  c.fillStyle = 'rgba(3,20,23,.92)'; c.fillRect(0, 880, 512, 144); c.fillStyle = fix ? '#55b8ff' : '#ff4a3d'; c.font = '700 34px "IBM Plex Mono"'; c.fillText(mv != null ? 'MAP · RUNNING' : (fix ? 'FIX · 1 m' : 'ERROR · ±' + Math.round(errPx * 1.2) + ' m'), 28, 950); c.fillStyle = 'rgba(244,239,227,.8)'; c.font = '700 26px "IBM Plex Mono"'; c.fillText(show4 ? '4 satellites' : '3 satellites', 28, 994);
  pTex.needsUpdate = true; }
/* ---- rocket, pad ---- */
var padG = new THREE.Group(); padG.position.copy(PS_.clone().add(SR.up.clone().multiplyScalar(.001))); padG.quaternion.copy(basisQ(SR)); S.add(padG);
var ground = new THREE.Mesh(new THREE.CircleGeometry(2.4, 64), new THREE.MeshStandardMaterial({ color: 0x07151a, roughness: .55, metalness: .15, transparent: true })); ground.rotation.x = -Math.PI / 2; padG.add(ground);
var padBase = new THREE.Mesh(new THREE.BoxGeometry(.34, .03, .34), new THREE.MeshStandardMaterial({ color: 0x1b262c, roughness: .6, metalness: .5 })); padBase.position.y = .015; padG.add(padBase);
(function () { var m = new THREE.MeshStandardMaterial({ color: 0x3b464e, roughness: .55, metalness: .7 }); for (var z = 0; z < 22; z++) { for (var s = -1; s <= 1; s += 2) { var b = new THREE.Mesh(new THREE.BoxGeometry(.012, .075, .012), m); b.position.set(-.3, .04 + z * .07, s * .05); padG.add(b); } var c = new THREE.Mesh(new THREE.BoxGeometry(.01, .01, .11), m); c.position.set(-.3, .07 + z * .07, 0); padG.add(c); if (z % 3 == 0) { var a = new THREE.Mesh(new THREE.BoxGeometry(.26, .008, .008), m); a.position.set(-.17, .07 + z * .07, 0); padG.add(a); } } })();
var rocket = new THREE.Group(), rw = new THREE.MeshStandardMaterial({ color: 0xe8eaf0, roughness: .35, metalness: .2 }), rd = new THREE.MeshStandardMaterial({ color: 0x2a323a, roughness: .5, metalness: .6 });
(function () { var core = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .26, 28), rw); core.position.y = .13; rocket.add(core); var nose = new THREE.Mesh(new THREE.ConeGeometry(.03, .075, 28), rw); nose.position.y = .30; rocket.add(nose); var band = new THREE.Mesh(new THREE.CylinderGeometry(.031, .031, .02, 28), rd); band.position.y = .22; rocket.add(band); var band2 = new THREE.Mesh(new THREE.CylinderGeometry(.031, .031, .015, 28), new THREE.MeshStandardMaterial({ color: 0xff7a28, roughness: .5 })); band2.position.y = .06; rocket.add(band2); for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2 + Math.PI / 4, b = new THREE.Mesh(new THREE.CylinderGeometry(.013, .013, .14, 18), rw); b.position.set(Math.cos(a) * .043, .07, Math.sin(a) * .043); rocket.add(b); var bn = new THREE.Mesh(new THREE.ConeGeometry(.013, .03, 18), rw); bn.position.set(Math.cos(a) * .043, .155, Math.sin(a) * .043); rocket.add(bn); } var ns = new THREE.Mesh(new THREE.CylinderGeometry(.02, .028, .03, 20), rd); ns.position.y = -.01; rocket.add(ns); })();
var flame = new THREE.Mesh(new THREE.ConeGeometry(.026, .22, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xffb020, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false })); flame.geometry.translate(0, -.11, 0); rocket.add(flame);
var flameG = sprite(GL_AMB, 0xffffff, .5, .9); flameG.position.y = -.03; rocket.add(flameG);
S.add(rocket);
var puffs = []; for (var i = 0; i < 36; i++) { var pf = sprite(GL_WHT, 0xffe0b0, .1, 0); S.add(pf); puffs.push(pf); }
var tI = PT('t3', 'उड़ाया');
function rocketPos(t) { var u = Math.max(0, t - tI), h = .002 + .16 * u * u + .03 * u * u * u * u * .02, lat = .11 * Math.pow(h, 1.4) * (u > 0 ? 1 : 0); return PS_.clone().add(SR.up.clone().multiplyScalar(.01 + h)).add(SR.east.clone().multiplyScalar(lat)); }
