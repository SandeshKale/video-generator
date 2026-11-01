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
function mkDial(r) { var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d'), tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; var g = new THREE.Group(); var m = new THREE.Mesh(new THREE.CircleGeometry(r, 48), new THREE.MeshBasicMaterial({ map: tx, toneMapped: false })); g.add(m); var bz = new THREE.Mesh(new THREE.TorusGeometry(r, r * .07, 10, 48), new THREE.MeshStandardMaterial({ color: 0xffb020, metalness: .8, roughness: .3, emissive: 0x442200, emissiveIntensity: .7 })); g.add(bz); g.userData.bz = bz;
  g.userData.draw = function (ang, ok) { x.fillStyle = '#031417'; x.fillRect(0, 0, 256, 256); x.strokeStyle = ok ? '#ffb020' : 'rgba(244,239,227,.3)'; x.lineWidth = 7; for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283; x.beginPath(); x.moveTo(128 + Math.sin(a) * 100, 128 - Math.cos(a) * 100); x.lineTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); x.stroke(); } var a2 = ang * Math.PI / 180; x.lineWidth = 11; x.lineCap = 'round'; x.beginPath(); x.moveTo(128, 128); x.lineTo(128 + Math.sin(a2) * 84, 128 - Math.cos(a2) * 84); x.stroke(); x.fillStyle = x.strokeStyle; x.beginPath(); x.arc(128, 128, 13, 0, 6.283); x.fill(); if (!ok) { x.strokeStyle = '#ff4a3d'; x.lineWidth = 16; x.beginPath(); x.moveTo(60, 60); x.lineTo(196, 196); x.moveTo(196, 60); x.lineTo(60, 196); x.stroke(); } tx.needsUpdate = true; bz.material.emissive.setHex(ok ? 0x442200 : 0x220000); bz.material.color.setHex(ok ? 0xffb020 : 0x6a5a50); }; return g; }
/* ===== v4 MOCKUP: explainer scenes built entirely as 3D objects (labels are sprites in the world). Not part of the shipped film. ===== */
var MINT = 0x7fff9a, MK = [], DYN = new THREE.Group(); S.add(DYN);
function add(o) { S.add(o); MK.push(o); return o; }
function dyn(o) { DYN.add(o); return o; }
function clearDyn() { while (DYN.children.length) { var c = DYN.children.pop(); c.traverse(function (n) { if (n.geometry) n.geometry.dispose(); if (n.material) { if (n.material.map) n.material.map.dispose(); n.material.dispose(); } }); } }
var CAMP = new V3(), camHead = new THREE.DirectionalLight(0xfff4e6, .9); S.add(camHead); S.add(camHead.target);
function cam(p, t, fov) { C.position.copy(p); C.up.set(0, 1, 0); C.lookAt(t); C.fov = fov; C.updateProjectionMatrix(); camHead.position.copy(p); camHead.target.position.copy(t); }
var HEX = function (h) { return '#' + ('000000' + h.toString(16)).slice(-6); };
/* text sprite living in the world */
function lab(text, col, hh, o) { o = o || {}; var fs = o.fs || 56, f = (o.font || '700 ' + fs + 'px "IBM Plex Mono"'), c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = o.pad == null ? 22 : o.pad, lh = fs * 1.18; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
  if (o.bg) { x.fillStyle = 'rgba(3,20,23,.9)'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = HEX(col); x.lineWidth = 5; x.strokeRect(2.5, 2.5, c.width - 5, c.height - 5); } x.fillStyle = HEX(col); x.textBaseline = 'middle'; x.textAlign = o.center ? 'center' : 'left';
  lines.forEach(function (l, i) { x.fillText(l, o.center ? c.width / 2 : pad, pad * .55 + lh * (i + .5) + 2); });
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, opacity: o.op == null ? 1 : o.op })); s.renderOrder = 30; s.scale.set(hh * c.width / c.height, hh, 1); return s; }
function bar(a, b, col, r, op) { var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op == null ? .95 : op, depthWrite: false })); m.geometry.translate(0, .5, 0); setBar(m, a, b); return m; }
function setBar(m, a, b) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, Math.max(L, .0001), 1); m.quaternion.setFromUnitVectors(YAXIS, d.normalize()); }
function glow(col, s, op) { return sprite(col == AMB ? GL_AMB : col == SKY ? GL_SKY : GL_WHT, 0xffffff, s, op); }
function slab(w, d, y) { var g = new THREE.Group(), m = new THREE.Mesh(new THREE.BoxGeometry(w, .3, d), new THREE.MeshStandardMaterial({ color: 0x0b2028, roughness: .35, metalness: .5 })); m.position.y = y - .15; g.add(m);
  var pts = []; for (var i = -Math.floor(w / 2); i <= Math.floor(w / 2); i++) { pts.push(new V3(i, y + .005, -d / 2), new V3(i, y + .005, d / 2)); } for (var j = -Math.floor(d / 2); j <= Math.floor(d / 2); j++) { pts.push(new V3(-w / 2, y + .005, j), new V3(w / 2, y + .005, j)); }
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x55b8ff, transparent: true, opacity: .2 }))); return g; }
function mkPhone(sz) { var g = new THREE.Group(), c = document.createElement('canvas'); c.width = 256; c.height = 512; var x = c.getContext('2d'), t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  var body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundRect(.92, 1.92, .16), { depth: .08, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 3, curveSegments: 10 }), new THREE.MeshStandardMaterial({ color: 0x2b3238, metalness: .9, roughness: .28 })); body.position.z = -.08; g.add(body);
  var scr = new THREE.Mesh(new THREE.PlaneGeometry(.84, 1.84), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.z = .031; g.add(scr);
  g.userData.draw = function (lines) { x.fillStyle = '#04181d'; x.fillRect(0, 0, 256, 512); lines.forEach(function (l) { x.fillStyle = l.col || '#f4efe3'; x.font = '700 ' + (l.fs || 30) + 'px "IBM Plex Mono"'; x.textAlign = 'center'; x.fillText(l.t, 128, l.y); }); t.needsUpdate = true; };
  g.scale.setScalar(sz || 1); return g; }

function pl(s, x, y, z, lim, cx) { lim = lim == null ? 3.9 : lim; cx = cx || 0; var h = s.scale.x / 2; x = Math.max(cx - lim + h, Math.min(cx + lim - h, x)); s.position.set(x, y, z || 0); return s; }
/* ---- static world pieces ---- */
var mkSatA = mkSat(.95); add(mkSatA); var mkSatB = [mkSat(.34), mkSat(.34), mkSat(.34), mkSat(.34)]; mkSatB.forEach(add);
var slabA = add(slab(8, 5, -5)); var phA = add(mkPhone(1.7)); var dialS = add(mkDial(.7)), dialP = add(mkDial(.6));
var slabC = add(slab(10, 8, 0)); slabC.children[0].material.metalness = .05; slabC.children[0].material.roughness = .9; var phC = add(mkPhone(.9)); phC.rotation.x = -Math.PI / 2; phC.position.set(0, .12, 0);
var groundB = add(new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: 0x0a1a22, roughness: .9 }))); groundB.rotation.x = -Math.PI / 2; groundB.position.set(0, -.01, 0);
/* ===== scene A: the timestamp packet ===== */
function sceneA(step, t) {
  cam(new V3(0, -1.0, 24), new V3(0, -1.2, 0), 44);
  mkSatA.visible = slabA.visible = phA.visible = dialS.visible = dialP.visible = true; mkSatA.position.set(0, 5.2, 0); mkSatA.lookAt(0, -4, 8);
  phA.position.set(0, -3.1, 0); phA.rotation.x = -.35; phA.userData.draw([{ t: 'PHONE CLOCK', y: 80, fs: 26, col: '#ffb020' }, { t: step >= 3 ? '10:00:00.120' : '10:00:00.000', y: 230, fs: 34, col: step >= 3 ? '#ff4a3d' : '#f4efe3' }, { t: step >= 3 ? 'signal arrived' : 'listening...', y: 330, fs: 24, col: '#55b8ff' }]);
  dialS.position.set(-2.9, 5.2, 0); dialS.userData.draw(t * 20, true); dialP.position.set(2.8, -3.0, .6); dialP.userData.draw(t * 20 + (step >= 3 ? 43 : 0), true);
  var sp = new V3(0, 4.7, 0), pp = new V3(0, -1.7, 0); pl(dyn(lab('SATELLITE CLOCK 10:00:00.000', AMB, .52, { fs: 40, bg: true })), 0, 7.2);
  if (step >= 2) { var f = step == 2 ? .5 : 1, pk = sp.clone().lerp(pp, f); dyn(bar(sp, pk, SKY, .04, .8)); var cube = new THREE.Mesh(new THREE.BoxGeometry(.7, .7, .7), new THREE.MeshStandardMaterial({ color: 0xffb020, emissive: 0xff8a10, emissiveIntensity: 1.4, metalness: .4, roughness: .3 })); cube.position.copy(pk); cube.rotation.set(.5, .7, 0); dyn(cube); var g = glow(AMB, 2.6, .8); g.position.copy(pk); dyn(g);
    if (step == 2) pl(dyn(lab('time-stamp packet\n"SENT 10:00:00.000"', AMB, .95, { fs: 34, bg: true, center: true })), 2.4, pk.y + .1); }
  if (step >= 3) { var br = new V3(-3.5, 4.7, 0), br2 = new V3(-3.5, -1.7, 0); dyn(bar(br, br2, AMB, .035)); [br, br2].forEach(function (p) { dyn(bar(p.clone().add(new V3(-.3, 0, 0)), p.clone().add(new V3(.3, 0, 0)), AMB, .035)); }); pl(dyn(lab('gap = 0.12 s', AMB, .5, { fs: 36, bg: true })), -2.0, 1.5, .2); pl(dyn(lab('ARRIVED 10:00:00.120', RED, .46, { fs: 34, bg: true })), 0, -5.6); }
  if (step >= 4) { pl(dyn(lab('0.12 s × 300,000 km/s\n= 36,000 km  (distance)', IVO, .95, { fs: 34, bg: true, center: true })), 2.1, 1.6, 1); pl(dyn(lab('illustrative · not to scale', 0x8fa8b0, .34, { fs: 26 })), 0, -6.6); }
}
/* ===== scene B: how big is a tiny clock error on the ground ===== */
var bGroup = new THREE.Group(); (function () { var m = new THREE.MeshStandardMaterial({ color: 0x1a3a52, roughness: .55 }); for (var i = -9; i <= 9; i++) for (var j = -9; j <= 9; j++) { if (Math.abs(i) % 4 == 0 || Math.abs(j) % 4 == 0) continue; var zz = j * .9 - 2; if (Math.abs(zz - 2.7) < 1.4 && i * .9 + 5 > -.5 && i * .9 + 5 < 9) continue; var h = .06 + hash(i * 31 + j * 7 + 3) * .22, b = new THREE.Mesh(new THREE.BoxGeometry(.62, h, .62), m); b.position.set(i * .9 + 5, h / 2, zz); bGroup.add(b); } })(); add(bGroup);
function pitch(x, z) { var g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(1.05, .68), new THREE.MeshStandardMaterial({ color: 0x1f6b3a, roughness: .9 })); m.rotation.x = -Math.PI / 2; g.add(m); var pts = [new V3(-.525, 0, -.34), new V3(.525, 0, -.34), new V3(.525, 0, .34), new V3(-.525, 0, .34), new V3(-.525, 0, -.34)]; var ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xf4efe3 })); ln.position.y = .004; g.add(ln); g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new V3(0, .004, -.34), new V3(0, .004, .34)]), new THREE.LineBasicMaterial({ color: 0xf4efe3 }))); g.position.set(x, .012, z); return g; }
function sceneB(step, t) {
  bGroup.visible = false; groundB.visible = true;
  if (step == 1) { cam(new V3(41.0, 4.8, 3.4), new V3(40.5, 0, -.1), 44); groundB.position.x = 40; var ph = mkPhone(.62); ph.rotation.x = -Math.PI / 2; ph.position.set(40.9, .06, .6); dyn(ph); ph.userData.draw([{ t: 'PHONE', y: 150, fs: 40 }, { t: '15 cm', y: 280, fs: 44, col: '#ffb020' }]);
    var gh = mkPhone(.62); gh.rotation.x = -Math.PI / 2; gh.position.set(40.9, .06, -.62); gh.traverse(function (n) { if (n.material) { n.material = n.material.clone(); n.material.transparent = true; n.material.opacity = .35; } }); dyn(gh); gh.userData.draw([{ t: 'PHONE', y: 150, fs: 40 }, { t: '15 cm', y: 280, fs: 44, col: '#ffb020' }]);
    var a = new V3(39.9, .08, -1.25), b = new V3(39.9, .08, 1.2); dyn(bar(a, b, AMB, .03)); for (var i = 0; i <= 10; i++) dyn(bar(new V3(39.9, .08, -1.25 + i * .245), new V3(39.9 - (i % 5 ? .1 : .2), .08, -1.25 + i * .245), AMB, .012));
    pl(dyn(lab('1 nanosecond of clock error\n= 30 cm  (two phones)', AMB, .3, { fs: 36, bg: true, center: true })), 40.5, 1.55, -1.1, 1.3, 40.5); dyn(lab('30 cm', IVO, .2, { fs: 34 })).position.set(39.45, .22, 0); return; }
  groundB.position.x = 0; bGroup.visible = true;
  if (step == 2) { cam(new V3(2.2, 10.5, 8.2), new V3(2.1, 0, 2.5), 48); var s0 = new V3(.5, .03, 3.35), s1 = s0.clone().add(new V3(3.15, 0, 0)); [0, 1, 2].forEach(function (k) { dyn(pitch(.5 + k * 1.05 + .52, 2.7)); }); dyn(bar(s0, s1, AMB, .05)); [s0, s1].forEach(function (p) { dyn(bar(p.clone().add(new V3(0, 0, -.12)), p.clone().add(new V3(0, 0, .12)), AMB, .05)); });
    pl(dyn(lab('1 microsecond = 300 m\n= 3 football pitches', AMB, .6, { fs: 36, bg: true, center: true })), 2.1, .5, 1.1, 2.9, 2.1); dyn(lab('105 m each', IVO, .22, { fs: 28 })).position.set(1.0, .1, 3.75); return; }
  cam(new V3(2.1, 14.6, 10.2), new V3(2.1, 0, 3.0), 48); var a = new V3(2.1, .2, 3.0), b2 = a.clone().add(new V3(2.7, 0, 0));
  if (step >= 4) { var ring = new THREE.Mesh(new THREE.RingGeometry(2.66, 2.7, 96), new THREE.MeshBasicMaterial({ color: RED, side: THREE.DoubleSide, transparent: true, opacity: .95, depthWrite: false })); ring.rotation.x = -Math.PI / 2; ring.position.set(a.x, .05, a.z); dyn(ring); var disc = new THREE.Mesh(new THREE.CircleGeometry(2.7, 96), new THREE.MeshBasicMaterial({ color: RED, side: THREE.DoubleSide, transparent: true, opacity: .16, depthWrite: false })); disc.rotation.x = -Math.PI / 2; disc.position.set(a.x, .04, a.z); dyn(disc); pl(dyn(lab('every point inside this circle\nlooks equally right', RED, .7, { fs: 34, bg: true, center: true })), 2.1, .6, 6.2, 3.7, 2.1); }
  dyn(bar(a, b2, RED, .035, .85)); var gt = glow(SKY, 1.1, 1); gt.position.copy(a); dyn(gt); var gr = glow(AMB, 1.1, 1); gr.position.copy(b2); dyn(gr);
  pl(dyn(lab('where you are', IVO, .4, { fs: 32, bg: true })), a.x - .3, 1.0, a.z - 1.0, 3.7, 2.1); pl(dyn(lab('where the phone says', RED, .4, { fs: 32, bg: true })), b2.x, 1.0, b2.z - 1.0, 3.7, 2.1); pl(dyn(lab('300 m off', RED, .6, { fs: 44 })), a.x + 1.35, .6, a.z + 1.0, 3.7, 2.1);
}
/* ===== scene C: four spheres, the clock fix ===== */
var CS = [new V3(-1.9, 2.3, -1.2), new V3(2.0, 2.6, -.9), new V3(.2, 2.1, 2.1), new V3(-.5, 3.3, -1.9)], PHC = new V3(0, .12, 0), SCOL = [SKY, IVO, MINT, AMB];
var shells = SCOL.map(function (c) { var m = new THREE.Mesh(new THREE.SphereGeometry(1, 110, 72), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, uniforms: { col: { value: new THREE.Color(c) }, foc: { value: PHC.clone() }, R: { value: 2.7 }, a: { value: 1 } },
  vertexShader: 'varying vec3 vW;varying vec3 vN;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(position);gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: 'uniform vec3 col;uniform vec3 foc;uniform float R;uniform float a;varying vec3 vW;varying vec3 vN;void main(){float d=length(vW-foc);float f=1.-smoothstep(R*.5,R,d);if(f<=0.)discard;float la=acos(clamp(vN.y,-1.,1.))*16./3.14159;float lo=atan(vN.z,vN.x)*22./3.14159;float l1=1.-smoothstep(0.,.05,min(fract(la),1.-fract(la)));float l2=1.-smoothstep(0.,.05,min(fract(lo),1.-fract(lo)));float ln=max(l1,l2);gl_FragColor=vec4(col*(.35+.9*ln),f*a*(.05+.5*ln));}' })); m.renderOrder = 5; add(m); return m; });
function tri(c1, c2, c3, r1, r2, r3) { var ex = c2.clone().sub(c1), d = ex.length(); ex.normalize(); var v = c3.clone().sub(c1), i = ex.dot(v), ey = v.clone().sub(ex.clone().multiplyScalar(i)); var j = ey.length(); ey.normalize(); var ez = ex.clone().cross(ey); var x = (r1 * r1 - r2 * r2 + d * d) / (2 * d), y = (r1 * r1 - r3 * r3 + i * i + j * j) / (2 * j) - (i / j) * x, z2 = r1 * r1 - x * x - y * y, z = Math.sqrt(Math.max(0, z2)); var base = c1.clone().add(ex.clone().multiplyScalar(x)).add(ey.clone().multiplyScalar(y)); return [base.clone().add(ez.clone().multiplyScalar(z)), base.clone().sub(ez.clone().multiplyScalar(z))]; }
function arc(c1, c2, r1, r2, Rv) { var ax = c2.clone().sub(c1), L = ax.length(); ax.normalize(); var d1 = (r1 * r1 - r2 * r2 + L * L) / (2 * L), rr = Math.sqrt(Math.max(0, r1 * r1 - d1 * d1)), ctr = c1.clone().add(ax.clone().multiplyScalar(d1)); var u = Math.abs(ax.y) < .9 ? new V3(0, 1, 0) : new V3(1, 0, 0); u = u.clone().sub(ax.clone().multiplyScalar(u.dot(ax))).normalize(); var w = ax.clone().cross(u), pts = [], N = 360; for (var k = 0; k < N; k++) { var a = k / N * 6.2832; pts.push(ctr.clone().add(u.clone().multiplyScalar(Math.cos(a) * rr)).add(w.clone().multiplyScalar(Math.sin(a) * rr))); } var keep = pts.map(function (p) { return p.distanceTo(PHC) < Rv; }), st = keep.indexOf(false); if (st < 0) return pts; var out = []; for (var k2 = 1; k2 <= N; k2++) { var i = (st + k2) % N; if (keep[i]) out.push(pts[i]); else if (out.length > 3) break; } return out; }
function sceneC(step, t) {
  cam(new V3(1.0, 3.0, 10.8), new V3(0, 1.45, 0), 48); slabC.visible = true; phC.visible = true; phC.userData.draw([{ t: 'YOU', y: 250, fs: 40 }]);
  var n = step <= 2 ? step : (step == 3 ? 3 : 4), delta = step == 4 ? 1.1 : (step == 5 ? 1.1 * (1 - eio(clamp(t / 2.2))) : 0);
  mkSatB.forEach(function (s, i) { s.visible = i < n; s.position.copy(CS[i]); s.lookAt(0, 0, 0); });
  var rad = CS.map(function (c) { return c.distanceTo(PHC); });
  shells.forEach(function (s, i) { s.visible = i < n; s.position.copy(CS[i]); s.scale.setScalar(rad[i] + delta); });
  var Rv = 2.5; pl(dyn(lab('YOU', IVO, .2, { fs: 34 })), 0, -.25, 1.2, 2.5); var g0 = glow(SKY, 1.0, 1); g0.position.copy(PHC); if (step <= 3 || step == 5) dyn(g0);
  var T1 = function (txt, col, y) { pl(dyn(lab(txt, col, .34, { fs: 32, bg: true, center: true })), 0, y, 2, 2.5); };
  pl(dyn(lab('simplified: only the patch near you is drawn', 0x8fa8b0, .16, { fs: 26 })), 0, -.7, 2.6, 2.5);
  if (step == 1) T1('signal 1: you are somewhere\non this sphere', SKY, 4.35);
  if (step >= 2) { var a12 = arc(CS[0], CS[1], rad[0] + delta, rad[1] + delta, Rv); if (a12.length > 3) dyn(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(a12), a12.length, .03, 6, false), new THREE.MeshBasicMaterial({ color: 0xffffff }))); if (step == 2) T1('signals 1 + 2: you are\non this circle', IVO, 4.35); }
  if (step >= 3) { var tp = tri(CS[0], CS[1], CS[2], rad[0] + delta, rad[1] + delta, rad[2] + delta), pa = tp[0].distanceTo(PHC) < tp[1].distanceTo(PHC) ? tp[0] : tp[1], pb = pa === tp[0] ? tp[1] : tp[0];
    if (step == 3) { var gb = glow(AMB, 1.0, .9); gb.position.copy(pb); dyn(gb); pl(dyn(lab('2nd answer: out in space\n→ thrown away', 0xc8d4d8, .3, { fs: 30, bg: true, center: true })), pb.x + 1.3, Math.min(pb.y + .5, 4.2), pb.z, 2.5); T1('3 signals + a perfect clock:\nexactly one place = YOU', MINT, 4.35); }
    if (step >= 4) { var gw = glow(RED, 1.3, 1); gw.position.copy(pa); dyn(gw); dyn(bar(PHC, pa, RED, .035)); pl(dyn(lab('phone\'s answer', RED, .26, { fs: 30, bg: true })), pa.x + 1.2, pa.y + .4, pa.z, 2.5); } }
  if (step == 4) { var tp2 = tri(CS[0], CS[1], CS[2], rad[0] + delta, rad[1] + delta, rad[2] + delta), pw = tp2[0].distanceTo(PHC) < tp2[1].distanceTo(PHC) ? tp2[0] : tp2[1]; var dd = pw.distanceTo(CS[3]) - (rad[3] + delta);
    T1('clock off: every distance is too long\nby the SAME amount', RED, 4.35); pl(dyn(lab('4th sphere misses that answer', AMB, .28, { fs: 30, bg: true })), 0, 3.75, 2, 2.5); }
  if (step == 5) { T1('4th signal: find the shared error', AMB, 4.35); pl(dyn(lab(delta > .05 ? 'shrinking all four together…' : 'all four meet → clock fixed', delta > .05 ? IVO : MINT, .3, { fs: 32, bg: true })), 0, 3.75, 2, 2.5); }
}
/* ===== scene D: the ledger gate (3D scoreboard) ===== */
var dGroup = new THREE.Group(); add(dGroup); var dSats = [0, 1, 2, 3].map(function () { var s = mkSat(.58); dGroup.add(s); return s; }), dSock = [], dLamp = [], SOCK = [[-1.7, -1.1], [1.7, -1.1], [-1.7, 1.0], [1.7, 1.0]];
(function () { var al = new THREE.MeshStandardMaterial({ color: 0x9aa4ad, metalness: .9, roughness: .35 }); var desk = new THREE.Mesh(new THREE.BoxGeometry(6.0, .4, 4.4), new THREE.MeshStandardMaterial({ color: 0x0b2028, roughness: .5, metalness: .4 })); desk.position.set(0, -.2, 0); dGroup.add(desk); SOCK.forEach(function (p) { var sock = new THREE.Mesh(new THREE.TorusGeometry(.8, .07, 12, 40), al); sock.rotation.x = Math.PI / 2; sock.position.set(p[0], .06, p[1]); dGroup.add(sock); dSock.push(sock); var lamp = new THREE.Mesh(new THREE.SphereGeometry(.14, 16, 16), new THREE.MeshBasicMaterial({ color: 0x334444 })); lamp.position.set(p[0], .2, p[1] + .95); dGroup.add(lamp); dLamp.push(lamp); }); })();
var barsG = new THREE.Group(); add(barsG); var barM = [];
(function () { var cols = [SKY, SKY, SKY, SKY, RED]; for (var i = 0; i < 5; i++) { var m = new THREE.Mesh(new THREE.BoxGeometry(.8, 1, .8), new THREE.MeshStandardMaterial({ color: cols[i], emissive: cols[i], emissiveIntensity: .35, roughness: .4, metalness: .3, transparent: true, opacity: .95 })); m.geometry.translate(0, .5, 0); barsG.add(m); barM.push(m); } })();
var slabD = add(slab(8, 5, 0));
function sceneD(step, t) {
  var fail = step >= 3; var ok = [1, 1, 1, fail ? 0 : 1];
  if (step == 4) { cam(new V3(0, 4.6, 16.5), new V3(0, 2.2, 0), 46); slabD.visible = true; barsG.visible = true; var h = [3.0, 2.8, 2.6, 2.9, .1]; barM.forEach(function (m, i) { m.scale.y = h[i]; m.position.set(-2.8 + i * 1.4, 0, 0); });
    var nm = ['GPS', 'GLONASS', 'GALILEO', 'BEIDOU', 'NavIC\nalone']; nm.forEach(function (s, i) { pl(dyn(lab(s, i == 4 ? RED : SKY, .34, { fs: 24, center: true })), -2.8 + i * 1.4, -.55, 1.2, 3.7); });
    pl(dyn(lab('your phone map: still running', SKY, .5, { fs: 34, bg: true })), 0, 6.4, 0, 4); pl(dyn(lab('it uses several systems at once', 0xc8d4d8, .38, { fs: 28 })), 0, 5.8, 0, 4); pl(dyn(lab('NavIC standing alone: below 4 = paused', RED, .4, { fs: 28, bg: true })), 0, 4.9, 0, 4); return; }
  cam(new V3(0, 8.4, 14.8), new V3(0, 1.1, 1.5), 50); dGroup.visible = true; var n = step == 1 ? 0 : 4;
  dSats.forEach(function (s, i) { s.visible = n > 0; var up = step == 1 ? 2.8 : 1.5; if (i == 3 && fail) up = 1.5 + 2.4 * eo(t / 1.6); s.position.set(SOCK[i][0], up, SOCK[i][1]); s.rotation.set(-.3, .5 + t * .3, 0); s.userData.halo.material.opacity = ok[i] ? .5 : .05; });
  dLamp.forEach(function (l, i) { l.material.color.setHex(step == 1 ? 0x334444 : (ok[i] ? MINT : RED)); });
  pl(dyn(lab('NavIC needs 4 working satellites', IVO, .46, { fs: 34, bg: true })), 0, 6.0, 0, 3.9); var cnt = step == 1 ? '0' : (fail ? '3' : '4');
  pl(dyn(lab('WORKING ' + cnt + ' / NEED 4', fail ? RED : (step == 1 ? 0x8fa8b0 : MINT), .8, { fs: 52, bg: true, font: '800 62px "Big Shoulders Display"' })), 0, 5.1, 0, 3.9);
  if (step == 1) pl(dyn(lab('four sockets · one satellite each', 0x8fa8b0, .36, { fs: 30 })), 0, 4.2, 0);
  if (step >= 3) { pl(dyn(lab('13 MAR 2026 · IRNSS-1F clock stops', RED, .42, { fs: 30, bg: true })), 0, 4.2, 0, 3.9); }
  if (step >= 3) { var pg = new THREE.Group(); var ring = new THREE.Mesh(new THREE.RingGeometry(.95, 1.0, 80), new THREE.MeshBasicMaterial({ color: RED, side: THREE.DoubleSide, transparent: true, opacity: .95, depthWrite: false })), disc = new THREE.Mesh(new THREE.CircleGeometry(1.0, 80), new THREE.MeshBasicMaterial({ color: RED, side: THREE.DoubleSide, transparent: true, opacity: .2, depthWrite: false })); ring.rotation.x = disc.rotation.x = -Math.PI / 2; pg.add(ring); pg.add(disc); var ph = mkPhone(.3); ph.rotation.x = -Math.PI / 2; ph.position.y = .1; pg.add(ph); ph.userData.draw([{ t: 'NavIC', y: 250, fs: 40 }]); pg.position.set(0, .05, 3.3); dyn(pg); pl(dyn(lab('your position: wide again', RED, .34, { fs: 28 })), 0, .2, 4.7); }
}
window.__mock = function (name, step, t) { MK.forEach(function (o) { o.visible = false; }); clearDyn(); earth.visible = atmo.visible = false; S.children.forEach(function (c) { if (!c.isLight && !c.isPoints && MK.indexOf(c) < 0 && c !== DYN) c.visible = false; });
  var f = { A: sceneA, B: sceneB, C: sceneC, D: sceneD }[name]; f(step, t || 0); R.render(S, C); };
Promise.all(['700 40px "IBM Plex Mono"', '800 62px "Big Shoulders Display"'].map(function (f) { return document.fonts.load(f); })).then(function () { var w = function () { if (loaded >= NEED) { window.__ready = true; } else setTimeout(w, 50); }; w(); });
})();
