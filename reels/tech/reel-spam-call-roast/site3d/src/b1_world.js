/* Part B1 (spam call v2): ONE continuous 3D colony ("mohalla") the camera travels through. Your house + doorbell, the marked lane (1400/1600), the watchman hut, the entrance gates. Pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS;
var SC = window.SC = [0, S0('a1'), S0('t1'), S0('r1'), S0('w1'), S0('f1'), S0('x1'), S0('c1')];
window.GR = []; window.SCN = [];
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.fmt = fmt; window.sw = sw;
var W = new THREE.Group(); S.add(W); GR.push(W);
function add(o, x, y, z) { o.position.set(x, y, z); W.add(o); return o; }
function box(w, h, d, col, o) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(col, o)); }
/* ---------- sky, ground, roads ---------- */
(function () { var sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 20), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec3 vP;void main(){float h=clamp(normalize(vP).y,0.,1.);vec3 hor=vec3(.98,.5,.22),mid=vec3(.20,.18,.45),top=vec3(.03,.05,.16);vec3 c=mix(hor,mid,smoothstep(0.,.18,h));c=mix(c,top,smoothstep(.12,.7,h));float st=step(.9985,fract(sin(dot(floor(vP.xz*.35+vP.y*.2),vec2(12.9,78.2)))*43758.5));c+=st*smoothstep(.25,.6,h);gl_FragColor=vec4(c,1.);}' })); W.add(sky);
  var g = new THREE.Mesh(new THREE.CircleGeometry(120, 64), M(0x1a2a58, { roughness: .95, envMapIntensity: .4 })); g.rotation.x = -Math.PI / 2; W.add(g);
  add(box(130, .08, 7, 0x2e3a78, { roughness: .8 }), -15, .05, 17); for (var i = 0; i < 22; i++) add(box(1.6, .02, .25, 0xf4ecd8), -62 + i * 5.5, .1, 17);
  add(box(6, .08, 36, 0x34417f, { roughness: .8 }), 14, .06, -2); add(box(2.6, .06, 14, 0x55609b), 0, .08, 10.2);
  W.laneEdge = [-3, 3].map(function (dx) { var m = new THREE.Mesh(new THREE.BoxGeometry(.25, .12, 34), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(2.2), transparent: true, opacity: 0 })); add(m, 14 + dx, .16, -2); return m; }); })();
/* ---------- trees and lamp posts (foreground parallax) ---------- */
(function () { function tree(x, z, s) { var t = new THREE.Group(); var tr = box(.5, 2, .5, 0x4a3a2a); tr.position.y = 1; t.add(tr); for (var i = 0; i < 3; i++) { var c = new THREE.Mesh(new THREE.ConeGeometry(2.2 - i * .5, 2.6, 7), M(0x1d6a62, { roughness: .8 })); c.position.y = 2.6 + i * 1.5; t.add(c); } t.scale.setScalar(s); return add(t, x, 0, z); }
  [[-6, 7, .8], [6, 6, .9], [24, 2, .9], [-20, 8, .8], [-34, 10, .9], [28, -10, .9], [-12, 34, 1.0], [34, 30, 1.0], [-46, 28, 1.0], [10, 36, 1.0]].forEach(function (a) { tree(a[0], a[1], a[2]); });
  function lamp(x, z) { var p = box(.22, 6.4, .22, 0x2a2f55); add(p, x, 3.2, z); var h = new THREE.Mesh(new THREE.SphereGeometry(.4, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(3) })); add(h, x, 6.6, z); var gl = e.glow('t', 6, .9); gl.position.set(x, 6.6, z); W.add(gl); }
  for (var i = -5; i <= 2; i++) if (i !== 0) lamp(i * 9 + 4, 13.2); [-2, -10, 6].forEach(function (z) { lamp(10.6, z); }); })();
/* ---------- your house ---------- */
var H = {};
(function () { var g = new THREE.Group(); W.add(g); H.g = g; var body = box(8.4, 5.2, 7, 0x5a6bb5, { roughness: .7 }); body.position.set(0, 2.6, 0); g.add(body);
  var roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 6.6, 3.2, 4), M(0xb5541a, { roughness: .8 })); roof.rotation.y = Math.PI / 4; roof.position.set(0, 6.8, 0); roof.scale.set(1.12, 1, .96); g.add(roof);
  [-2.9, 2.9].forEach(function (x) { var w = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.5), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.5) })); w.position.set(x, 3.2, 3.52); g.add(w); H[x < 0 ? 'wl' : 'wr'] = w; });
  var fr = box(2.0, 3.5, .3, 0x1b1f40); fr.position.set(0, 1.75, 3.5); g.add(fr); var inner = box(1.7, 3.2, .1, 0xffc27a); inner.position.set(0, 1.6, 3.4); inner.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.1) }); g.add(inner);
  H.door = new THREE.Group(); H.door.position.set(-.85, 0, 3.7); var dm = box(1.7, 3.2, .16, 0xc86a2a, { roughness: .6 }); dm.position.set(.85, 1.6, 0); H.door.add(dm); g.add(H.door);
  var plate = box(.8, 1.15, .14, 0xf4ecd8); plate.position.set(2.4, 2.4, 3.65); g.add(plate); H.btn = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .12, 20), M(K.GOLD, { emissive: K.GOLD, emissiveIntensity: .6 })); H.btn.rotation.x = Math.PI / 2; H.btn.position.set(2.4, 2.6, 3.76); g.add(H.btn); var d2 = new THREE.Mesh(new THREE.PlaneGeometry(.55, .22), new THREE.MeshBasicMaterial({ color: 0x0b1230 })); d2.position.set(2.4, 2.1, 3.73); g.add(d2);
  H.rings = [0, 1, 2].map(function () { var r = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(2), transparent: true, depthWrite: false })); r.position.set(2.4, 2.6, 3.9); g.add(r); return r; });
  H.light = new THREE.PointLight(0xffb060, 40, 18, 1.6); H.light.position.set(0, 2.8, 6.5); g.add(H.light); var pg = e.glow('t', 7, .55); pg.position.set(0, 3, 5); g.add(pg);
  H.user = B.voxel(false, K.CORAL); H.user.position.set(0, 0, 2.2); H.user.scale.setScalar(1.05); g.add(H.user);
  H.lb = e.lab('DOORBELL = YOUR PHONE NUMBER', K.GOLD, .5, { fs: 36 }); H.lb.position.set(2.4, 5.6, 4.2); g.add(H.lb); })();
/* ---------- the salesman at your door + other callers ---------- */
var SM = {};
(function () { SM.sm = B.agent(K.GOLD); SM.sm.scale.setScalar(1.0); W.add(SM.sm); SM.case = box(.9, .6, .3, 0xf4ecd8); SM.case.position.set(.6, 1.0, .4); SM.sm.add(SM.case); var tex = B.plane(.8, .5, B.tcv(256, 160, function (x) { x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, 256, 160); x.fillStyle = '#0b1230'; x.font = '700 64px "Chakra Petch"'; x.textAlign = 'center'; x.fillText('LOAN', 128, 104); })); tex.position.set(0, 0, .17); SM.case.add(tex);
  SM.say = e.lab('"SIR, LOAN CHAHIYE?"', K.GOLD, .6, { fs: 44 }); SM.say.position.set(0, 7.6, 7); W.add(SM.say); SM.nm = e.lab('LOAN NE AAPKO DHOONDHA', K.RED, .5, { fs: 40 }); SM.nm.position.set(0, 8.8, 7); W.add(SM.nm);
  SM.badge = B.stamp('DECLARED', '#3de0a8', 3.0, 1.0, 100); SM.badge.position.set(0, 4.2, 7); W.add(SM.badge); })();
/* ---------- the rain of calls (1 dot = 35 million) ---------- */
var RN = {};
(function () { var N = 1200; RN.N = N; RN.im = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .8, .15), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.8) }), N); RN.im.frustumCulled = false; W.add(RN.im); RN.o = []; for (var i = 0; i < N; i++) { var a = hash(i) * 6.283, r = 22 + hash(i + 3) * 40; RN.o.push([Math.cos(a) * r + 6, 4 + hash(i + 7) * 20, Math.sin(a) * r * .7 + 14]); }
  RN.c1 = e.dyn(.95, 860, 200, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('TRUECALLER USERS · RINGS IN 2025', 28, 52); x.font = '700 76px "Chakra Petch"'; x.fillText('≈ ' + Math.round(a) + ' BILLION', 28, 140); x.fillStyle = '#7a4a10'; x.font = '600 22px "DM Mono"'; x.fillText('1 BOX = 35 MILLION RINGS · NOT TO SCALE', 28, 182); }); RN.c1.position.set(2.4, 11, 4); W.add(RN.c1);
  RN.c2 = e.dyn(.8, 860, 170, K.CORAL, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('42 B ÷ 350 M+ USERS ÷ 12', 28, 50); x.font = '700 64px "Chakra Petch"'; x.fillText('≈ ' + Math.round(10 * a) + ' RINGS / MONTH', 28, 126); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('OUR ROUGH MATH · SELF-SELECTED USERS', 28, 156); }); RN.c2.position.set(2.4, 11, 4); W.add(RN.c2);
  RN.cd = e.card('SPAM CALL', 'a ring you did not ask for:\nnobody invited it', K.RED, 1.7); RN.cd.position.set(2.4, 14.5, 6); W.add(RN.cd); })();
/* ---------- the marked lane (gali) ---------- */
var L = {};
(function () { var gate = new THREE.Group(); W.add(gate); L.gate = gate;
  [11, 17].forEach(function (x) { var p = box(.6, 6, .6, 0xf4ecd8); p.position.set(x, 3, 14.5); gate.add(p); }); var beam = box(7.4, .8, .8, 0x2b3678); beam.position.set(14, 6.4, 14.5); gate.add(beam);
  L.s14 = B.sign('1400', '#ff8a1f', 3.2, 1.3, 130); L.s14.position.set(12.2, 5.1, 14.95); gate.add(L.s14); L.s16 = B.sign('1600', '#3de0a8', 3.2, 1.3, 130); L.s16.position.set(15.8, 5.1, 14.95); gate.add(L.s16);
  L.booths = []; for (var i = 0; i < 5; i++) [[11, 0xb5601a], [17, 0x1e8f72]].forEach(function (a, k) { var b = new THREE.Group(); var bx = box(3.2, 3.4, 3.2, a[0] === 11 ? 0x7a4a22 : 0x1a5c52); bx.position.y = 1.7; b.add(bx); var aw = box(3.6, .3, 1.6, a[1]); aw.position.set(a[0] === 11 ? 1.4 : -1.4, 3.3, 0); b.add(aw); var win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(a[1]).multiplyScalar(1.4) })); win.position.set(a[0] === 11 ? 1.62 : -1.62, 2.2, 0); win.rotation.y = a[0] === 11 ? Math.PI / 2 : -Math.PI / 2; b.add(win); b.position.set(a[0] === 11 ? 10.4 : 17.6, 0, 8 - i * 6.6); W.add(b); L.booths.push(b); });
  L.ag = []; for (var j = 0; j < 8; j++) { var a = B.agent(K.GOLD); a.scale.setScalar(.8); W.add(a); L.ag.push(a); }
  L.cd = e.card('1400 · 1600 GALI', 'a marked street only for sellers:\nyou can tell a shop is calling', K.GOLD, 1.7); L.cd.position.set(14, 11.5, 12); W.add(L.cd);
  L.l1 = e.lab('1400 = TELEMARKETING', K.GOLD, .46, { fs: 34 }); L.l1.position.set(11, 8.8, 14.5); W.add(L.l1); L.l2 = e.lab('1600 = SERVICE', K.GREEN, .46, { fs: 34 }); L.l2.position.set(17, 8.0, 14.5); W.add(L.l2); })();
/* ---------- neighbours (doors that close) and walkers ---------- */
var N = {};
(function () { N.h = [-14, -26].map(function (x, i) { var g = new THREE.Group(); var b = box(7, 4.6, 6, i ? 0x4f7a8f : 0x7a5aa8, { roughness: .7 }); b.position.y = 2.3; g.add(b); var r = new THREE.Mesh(new THREE.CylinderGeometry(0, 5.4, 2.8, 4), M(0x6a2e2e)); r.rotation.y = Math.PI / 4; r.position.y = 6; g.add(r); var w = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.3) })); w.position.set(-2.4, 3, 3.02); g.add(w); var door = new THREE.Group(); door.position.set(-.8, 0, 3.1); var d = box(1.6, 3, .14, 0xc86a2a); d.position.set(.8, 1.5, 0); door.add(d); var inn = box(1.6, 3, .1, 0xffc27a); inn.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.1) }); inn.position.set(0, 1.5, 3.04); g.add(inn); g.add(door); g.position.set(x, 0, 0); W.add(g); return { g: g, door: door }; });
  N.wk = []; for (var i = 0; i < 7; i++) { var p = B.voxel(false, i % 2 ? K.CREAM : K.CORAL); p.scale.setScalar(.85); W.add(p); N.wk.push(p); }
  N.b1 = box(2, 1, 1.6, K.GOLD); N.b2 = box(2, 1, 1.6, K.GREEN); N.b1.position.set(23, .5, 10); N.b2.position.set(27, .5, 10); W.add(N.b1); W.add(N.b2);
  N.p1 = e.dyn(.7, 520, 150, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1400 · RINGS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(81 * a) + '%', 22, 118); }); N.p1.position.set(23, 12, 10); W.add(N.p1);
  N.p2 = e.dyn(.7, 520, 150, K.GREEN, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1600 · RINGS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(79 * a) + '%', 22, 118); }); N.p2.position.set(27, 13.4, 10); W.add(N.p2);
  N.cl = e.lab("TRUECALLER CEO'S CLAIM · 8 MONTHS", K.RED, .44, { fs: 32 }); N.cl.position.set(25, 15.4, 10); W.add(N.cl); N.sh = e.lab('NOBODY OPENS THE DOOR', K.CREAM, .46, { fs: 34 }); N.sh.position.set(-20, 8.6, 4); W.add(N.sh); })();
/* ---------- the watchman ---------- */
var G = {};
(function () { var g = new THREE.Group(); W.add(g); var hut = box(3.4, 3.4, 3.2, 0x2a7a6a); hut.position.y = 1.7; g.add(hut); var rf = box(4.2, .4, 4, 0x1b4a42); rf.position.y = 3.6; g.add(rf); var win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(1.4) })); win.position.set(0, 2.2, 1.62); g.add(win); g.position.set(7.4, 0, 12.2); G.g = g;
  G.guard = B.voxel(false, K.GREEN); G.guard.position.set(7.4, 0, 14.6); G.guard.scale.setScalar(.95); G.guard.rotation.y = .2; W.add(G.guard); var cap = box(.8, .3, .8, 0x0b1230); cap.position.set(0, .45, 0); G.guard.userData.head.add(cap);
  G.tag = e.lab('TRUECALLER = THE CHOWKIDAAR', K.GREEN, .46, { fs: 34 }); G.tag.position.set(7.4, 7.6, 12.2); W.add(G.tag);
  G.st = B.stamp('FREQUENTLY\nBLOCKED', '#ff4d5e', 4.4, 1.5, 96); W.add(G.st);
  G.cd = e.card('FREQUENTLY BLOCKED', 'the label Truecaller may use:\nit cannot say "spam" for 1400 / 1600', K.RED, 1.7); G.cd.position.set(7.4, 10.6, 12.2); W.add(G.cd); })();
/* ---------- fraud ---------- */
var F = {};
(function () { F.ag = [['BANK', 0x3de0a8], ['POLICE', 0x6a7bff], ['PAY APP', 0xff8a1f]].map(function (a) { var p = B.agent(K.RED); p.scale.setScalar(1.0); W.add(p); var s = B.sign(a[0], '#' + a[1].toString(16).padStart(6, '0'), 2.6, 1.0, 100); s.position.set(0, 4.6, 0); p.add(s); var m = box(1.0, .42, .1, 0x0b1230); m.position.set(0, 2.1, .33); p.userData.head.add(m); m.position.y = -.1; return p; });
  F.c1 = e.dyn(.78, 760, 170, K.RED, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('FRAUD CALLS IDENTIFIED, 2025', 28, 52); x.font = '700 70px "Chakra Petch"'; x.fillText(fmt(a) + ' CRORE', 28, 132); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('PER TRUECALLER REPORT', 28, 160); }); F.c1.position.set(3.4, 9.6, 8); W.add(F.c1); })();
/* ---------- the entrance: three rules as three gates + telco tower ---------- */
var X = {};
(function () { X.tw = new THREE.Group(); var mast = new THREE.Mesh(new THREE.CylinderGeometry(.35, .7, 22, 8), M(0xc9d2ff, { metalness: .6, roughness: .35 })); mast.position.y = 11; X.tw.add(mast); var base = box(5, 1.4, 5, 0x2b3678); base.position.y = .7; X.tw.add(base); [6, 10, 14].forEach(function (y, i) { var d = new THREE.Mesh(new THREE.CylinderGeometry(.01, 1.4, .5, 16), M(0xf4ecd8)); d.position.set(i % 2 ? 1.1 : -1.1, y + 2, 0); d.rotation.z = i % 2 ? -.8 : .8; X.tw.add(d); }); var tip = new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.CORAL).multiplyScalar(2.4) })); tip.position.y = 22.4; X.tw.add(tip); X.tw.position.set(-14, 0, 34); W.add(X.tw);
  X.ts = B.sign('TELCO\nPLATFORM', '#6a7bff', 5, 2.4, 120); X.ts.position.set(-14, 5.4, 36.6); W.add(X.ts);
  var curve = new THREE.CatmullRomCurve3([new V3(7.4, 3.8, 12.2), new V3(-2, 15, 20), new V3(-14, 17, 28), new V3(-14, 14, 34)]); X.curve = curve; X.pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, .14, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(1.8), transparent: true, opacity: 0 })); W.add(X.pipe);
  X.rep = []; for (var i = 0; i < 6; i++) { var c = B.card('', '', '', {}); c.scale.setScalar(.45); W.add(c); X.rep.push(c); }
  function arch(x, col, label) { var g = new THREE.Group(); [-3.6, 3.6].forEach(function (dz) { var p = box(.6, 6, .6, 0xf4ecd8); p.position.set(0, 3, dz); g.add(p); }); var b = box(.8, .8, 8.4, col); b.position.set(0, 6.4, 0); g.add(b); g.position.set(x, 0, 17); W.add(g); var s = B.sign(label, '#' + col.toString(16).padStart(6, '0'), 3.4, 1.2, 96); s.position.set(x, 8.2, 17); s.rotation.y = 0; W.add(s); return g; }
  X.a1 = arch(-8, K.GREEN, '1 · REPORT'); X.a2 = arch(-18, K.CORAL, '2 · DECLARE'); X.a3 = arch(-28, K.GOLD, '3 · TOLL');
  X.arm = box(7, .35, .35, K.RED); X.arm.geometry.translate(3.5, 0, 0); X.arm.position.set(-28, 3.4, 20.4); W.add(X.arm); var pl = box(.5, 3.4, .5, 0xf4ecd8); pl.position.set(-28.2, 1.7, 20.4); W.add(pl);
  X.rb = B.voxel(false, K.GOLD); X.rb.scale.setScalar(1.0); var ant = box(.1, .9, .1, K.RED); ant.position.set(0, .7, 0); X.rb.userData.head.add(ant); W.add(X.rb);
  X.pr = e.dyn(.7, 700, 150, K.GOLD, function (x) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('ROBOT CALL TOLL', 24, 46); x.font = '700 60px "Chakra Petch"'; x.fillText('≤ 5 PAISE / MIN', 24, 120); }); X.pr.position.set(-28, 12.6, 17); W.add(X.pr);
  X.c1 = e.card('A2P CALL', 'application-to-person: a machine dials,\nnot a person. Declare it in advance.', K.CORAL, 1.7); X.c1.position.set(-18, 13.6, 17); W.add(X.c1);
  X.q = B.sign('?', '#f4ecd8', 2.6, 2.6, 260); X.q.position.set(-18, 12, 24); W.add(X.q); X.td = e.lab('TRUECALLER CALLS IT ANTI-COMPETITIVE', K.RED, .44, { fs: 32 }); X.td.position.set(-18, 8.4, 24); W.add(X.td); })();
/* ---------- per-frame world state (all pure functions of t) ---------- */
var P_PATH = function (u) { return new V3(0, 0, lerp(17, 5.2, u)); };
SCN[0] = SCN[1] = SCN[2] = SCN[3] = SCN[4] = SCN[5] = SCN[6] = SCN[7] = function (t) { W.visible = true; S.background = new THREE.Color(0x0d1433); S.fog = new THREE.FogExp2(0x1a2150, .0055);
  var th1 = S0('h1'), th2 = S0('h2'), th3 = S0('h3'), ta1 = S0('a1'), ta2 = S0('a2'), ta3 = S0('a3'), tt1 = S0('t1'), tt2 = S0('t2'), tr1 = S0('r1'), tr2 = S0('r2'), tw1 = S0('w1'), tw2 = S0('w2'), tf1 = S0('f1'), tf2 = S0('f2'), tx1 = S0('x1'), tx2 = S0('x2'), tx3 = S0('x3'), tx4 = S0('x4'), tx5 = S0('x5'), tc1 = S0('c1'), tcta = S0('cta');
  /* doorbell + door */
  var ringing = (t < th2 + .6) || (t > ta1 && t < tt1 + .5) || (t > tf1 && t < tf2 + 3), flick = ringing ? 1 : 0;
  H.rings.forEach(function (r, i) { var u = ((t * 1.3 + i / 3) % 1); r.scale.setScalar(.4 + u * 2.2); r.material.opacity = flick * (1 - u) * .9; }); H.btn.scale.z = 1 + (ringing ? .5 * Math.sin(t * 18) : 0);
  var doorU = sw(th2 - .5, th2 + .1, t) * (1 - sw(tc1 + 3.5, tc1 + 4.5, t) * 0); H.door.rotation.y = -1.7 * doorU; H.user.visible = doorU > .2 || t > th2; H.user.userData.head.rotation.y = .3 * Math.sin(t * 1.3) - .15 * sw(th3, th3 + .5, t); H.user.userData.armR.rotation.x = -.6 * sw(th3, th3 + .8, t);
  H.light.intensity = 30 + 12 * doorU; H.wl.material.color.setScalar(1); put(H.lb, t, th1 + .8, .4, th2 + .2);
  /* the salesman: walks up the path, delivers the line, leaves; at the end he comes back declared */
  var wu = sw(th1 + .2, th2 - .3, t), leave = sw(th3 + 1.2, ta1 + 1.6, t), back = sw(tc1 + .2, tc1 + 2.6, t); var smz = lerp(17, 7.4, wu); if (t > th3) smz = lerp(7.4, 17, leave); if (t > tc1 - .5) smz = lerp(17, 7.4, back);
  SM.sm.position.set(0, 0, smz); SM.sm.rotation.y = (t > th3 && t < tc1 - .5) ? Math.PI : 0; SM.sm.visible = !(t > ta1 + 1.6 && t < tc1 - .5); SM.sm.userData.armR.rotation.x = -.4 + .3 * Math.sin(t * 6) * (wu > .01 && wu < .99 ? 1 : .2); SM.sm.userData.head.rotation.z = .08 * Math.sin(t * 4);
  put(SM.say, t, th2 + .1, .35, th3 - .1); put(SM.nm, t, th3 + .5, .35, ta1 - .1); var dec = clamp((t - tc1 - 3.0) / .9); B.slam(SM.badge, dec, 8, 4.2, 1); SM.badge.position.set(0, SM.badge.position.y, 7.8); SM.badge.rotation.z = -.1;
  /* the rain of rings (a1-a3) */
  var m = new THREE.Matrix4(), NR = RN.N, vis = t > ta1 - .2 && t < tt1 + .3, fl = sw(ta1, ta1 + 1.2, t); for (var i = 0; i < NR; i++) { if (!vis) { m.makeTranslation(0, -50, 0); RN.im.setMatrixAt(i, m); continue; } var u = (((t - ta1) * .22 + hash(i + 11)) % 1), o = RN.o[i], b = [2.4, 2.6, 4.2], c = [(o[0] + b[0]) / 2, o[1] + 8, (o[2] + b[2]) / 2], q = 1 - u, px = q * q * o[0] + 2 * q * u * c[0] + u * u * b[0], py = q * q * o[1] + 2 * q * u * c[1] + u * u * b[1], pz = q * q * o[2] + 2 * q * u * c[2] + u * u * b[2], s = Math.min(1, u * 8) * (u > .92 ? (1 - u) * 12 : 1) * fl; m.compose(new V3(px, py, pz), new THREE.Quaternion(), new V3(s, s, s)); RN.im.setMatrixAt(i, m); } RN.im.instanceMatrix.needsUpdate = true;
  RN.c1.draw(42 * sw(ta2, ta2 + 2.4, t)); put(RN.c1, t, ta2 - .1, .4, ta3 - .1); RN.c2.draw(sw(ta3, ta3 + 1.4, t)); put(RN.c2, t, ta3, .4, tt1 - .2); put(RN.cd, t, ta1 + .4, .4, ta2 - .2);
  /* the lane (t1-t2) */
  var lu = sw(tt1 - .2, tt1 + 1.2, t); W.laneEdge.forEach(function (m2) { m2.material.opacity = Math.min(1, lu * 1.2) * (t > tr1 + 6 ? .4 : 1); }); L.s14.visible = L.s16.visible = lu > 0; L.s14.scale.setScalar(.01 + eo3(lu)); L.s16.scale.setScalar(.01 + eo3(sw(tt1 + .3, tt1 + 1.4, t)));
  L.ag.forEach(function (a, j) { var u = clamp((t - tt1 - .5 - j * .38) / 2.6), side = j % 2, bz = 8 - Math.floor(j / 2) * 6.6, bx = side ? 17.6 : 10.4; var pos = u < .5 ? new V3(lerp(27, 14, sstep(u * 2)), 0, 19.4) : new V3(lerp(14, bx + (side ? -1.8 : 1.8), sstep(u * 2 - 1)), 0, lerp(19.4, bz, sstep(u * 2 - 1))); a.visible = t > tt1 + .3 && t < tr1 + 8; a.position.copy(pos); a.rotation.y = u < .5 ? -Math.PI / 2 : (side ? Math.PI / 2 : -Math.PI / 2) + (u < .5 ? 0 : 0); a.userData.armR.rotation.x = Math.sin(t * 8 + j) * .5; });
  put(L.cd, t, tt2 - .2, .4, tr1 - .1); put(L.l1, t, tt1 + .6, .35, tt2); put(L.l2, t, tt1 + 1.2, .35, tt2);
  /* the catch (r1-r2): neighbours walk past, doors close, bars rise */
  N.h.forEach(function (h, i) { h.door.rotation.y = -1.6 * (1 - sw(tr1 + .5 + i * .6, tr1 + 1.3 + i * .6, t)) * (t > tr1 - 4 ? 1 : 1) - 0; if (t < tr1 + .4) h.door.rotation.y = -1.6; });
  N.wk.forEach(function (p, i) { var u = (((t - tr1) * .12 + i / 7) % 1 + 1) % 1; p.visible = t > tr1 - .4 && t < tw1 + 2; p.position.set(lerp(34, -34, u), 0, 19.6 + (i % 2) * 1.2); p.rotation.y = -Math.PI / 2; p.userData.armR.rotation.x = Math.sin(t * 6 + i) * .4; });
  N.b1.visible = N.b2.visible = t > tr2 - .2 && t < tw1 + 1; var bu1 = sw(tr2, tr2 + 1.8, t), bu2 = sw(tr2 + .3, tr2 + 2.1, t); N.b1.scale.y = Math.max(.02, 8.1 * bu1); N.b1.position.y = N.b1.scale.y * .5; N.b2.scale.y = Math.max(.02, 7.9 * bu2); N.b2.position.y = N.b2.scale.y * .5; N.p1.draw(bu1); N.p2.draw(bu2); put(N.p1, t, tr2, .35, tw1); put(N.p2, t, tr2 + .3, .35, tw1); put(N.cl, t, tr2 + 1.2, .35, tw1); put(N.sh, t, tr1 + 1.2, .35, tr2);
  /* the watchman (w1-w2) */
  put(G.tag, t, tw1 + .2, .35, tw2 + 1.5); G.guard.userData.head.rotation.y = .4 * Math.sin(t * 1.1); G.guard.userData.armR.rotation.x = -.5 * sw(tw1 + 1, tw1 + 2, t); B.slam(G.st, clamp((t - tw2 - .3) / .8), 10, 6.4, 1); G.st.position.set(7.4, G.st.position.y, 13.4); put(G.cd, t, tw2 + 1.3, .4, tf1 - .1);
  /* fraud (f1-f2) */
  F.ag.forEach(function (a, j) { var u = clamp((t - tf1 - j * 1.1) / 2.2); a.visible = t > tf1 && t < tf2 + 2.6; a.position.set(lerp(-16 - j * 4, 0, sstep(u)) * (1 - u) + 0 * u, 0, lerp(17, 7.6 + j * 1.2, sstep(u))); a.position.x = lerp(-9 + j * 4, j * 3 - 3, sstep(u)); a.rotation.y = 0; a.userData.armR.rotation.x = -.8 + Math.sin(t * 7 + j) * .3; }); F.c1.draw(770 * sw(tf2, tf2 + 1.6, t)); put(F.c1, t, tf2, .4, tx1 - .2);
  /* the entrance (x1-x5) */
  var pu = sw(tx2, tx2 + 1, t); X.pipe.material.opacity = pu; X.rep.forEach(function (c, i) { var u = (((t - tx2 - .6) * .5 + i / 6) % 1 + 1) % 1; c.visible = t > tx2 + .4 && t < tx3 + 1.5; var p = X.curve.getPoint(u); c.position.copy(p); c.rotation.y = t * 2 + i; });
  put(X.c1, t, tx3 + .1, .4, tx4 - .1); var ru = clamp((t - tx3) / 3.4); X.rb.visible = t > tx3 - .3 && t < tx5; X.rb.position.set(lerp(-3, -33, sstep(ru)), 0, 19.4); X.rb.rotation.y = -Math.PI / 2; X.rb.userData.armR.rotation.x = Math.sin(t * 7) * .4;
  X.arm.rotation.z = sw(tx4 + .6, tx4 + 1.6, t) * 1.2; put(X.pr, t, tx4, .4, tx5); put(X.q, t, tx5, .4); X.q.rotation.z = .1 * Math.sin(t * 3); put(X.td, t, tx5 + 1.2, .35); X.a1.visible = X.a2.visible = X.a3.visible = true; };
/* ---------- the camera: one continuous travelling shot list (named moves, eased, locked between) ---------- */
function V(a) { return new V3(a[0], a[1], a[2]); }
function mv(pA, lA, fA, pB, lB, fB, o) { o = o || {}; return function (u) { var k = sstep(u), p = V(pA).lerp(V(pB), k); p.y += (o.up || 0) * Math.sin(Math.PI * k); p.x += (o.side || 0) * Math.sin(Math.PI * k); return { p: p, l: V(lA).lerp(V(lB), k), f: lerp(fA, fB, k) }; }; }
function orb(c, r, a0, a1, h0, h1, lA, lB, f) { return function (u) { var k = sstep(u), a = lerp(a0, a1, k) * Math.PI / 180; return { p: new V3(c[0] + r * Math.sin(a), lerp(h0, h1, k), c[2] + r * Math.cos(a)), l: V(lA).lerp(V(lB), k), f: f }; }; }
var th2 = S0('h2'), th3 = S0('h3');
e.follow(0, 'dolly in on the doorbell, slight arc', 0, th2 + .2, mv([-9, 4.2, 26], [1, 3.2, 5], 40, [4.5, 3.4, 17.5], [.6, 2.8, 4.2], 36, { side: 1.5, up: .4 }));
e.follow(0, 'crane up and pull back to the colony', th3 + .3, S0('a1') + 2.6, mv([4.5, 3.4, 17.5], [.6, 2.8, 4.2], 36, [26, 19, 46], [4, 2, 8], 44, { up: 8, side: -4 }));
e.follow(0, 'slow high orbit over the house', S0('a1') + 2.6, S0('t1') - .4, orb([4, 0, 10], 40, 38, -12, 17, 21, [3, 3, 8], [6, 3, 10], 42));
e.follow(0, 'swoop down to the lane gate', S0('t1') - .4, S0('t1') + 2.2, mv([37, 21, 36], [6, 3, 10], 42, [16, 6.5, 33], [14, 4, 12], 40, { side: 3, up: 3 }));
e.follow(0, 'truck along the lane', S0('t1') + 2.2, S0('r1') - .1, mv([16, 6.5, 33], [14, 4, 12], 40, [26, 4.5, 31], [13, 3, 12], 42, { side: -2 }));
e.follow(0, 'hold at the junction', S0('r1') - .1, S0('r2') - .3, mv([26, 4.5, 31], [13, 3, 12], 42, [24, 4.5, 30], [13, 3, 12], 42, {}));
e.follow(0, 'crane up to the bars', S0('r2') - .3, S0('w1') - .2, mv([24, 4.5, 30], [13, 3, 12], 42, [34, 12, 28], [24, 4, 10], 42, { up: 4, side: 2 }));
e.follow(0, 'swing across to the watchman hut', S0('w1') - .2, S0('f1') - .3, mv([34, 12, 28], [24, 4, 10], 42, [-4, 6, 22], [7.4, 3.8, 12.2], 40, { up: 3, side: -6 }));
e.follow(0, 'push to the door as the callers come', S0('f1') - .3, S0('f2') + 2.2, mv([-4, 6, 22], [7.4, 3.8, 12.2], 40, [-4, 4, 28], [1.5, 3, 8], 40, { side: -2 }));
e.follow(0, 'dolly along the road to gate 1', S0('f2') + 2.2, S0('x2') + .2, mv([-4, 4, 28], [1.5, 3, 8], 40, [0, 6.8, 37], [-9, 5, 17], 40, { up: 1.5 }));
e.follow(0, 'look back along the report pipe', S0('x2') + .2, S0('x3') - .2, mv([0, 6.8, 37], [-9, 5, 17], 40, [8, 10, 38], [-5, 12, 22], 44, { up: 2 }));
e.follow(0, 'tracking move to gate 2', S0('x3') - .2, S0('x4') - .2, mv([8, 10, 38], [-5, 12, 22], 44, [-8, 6.8, 38], [-18, 5.4, 17], 40, { side: -3 }));
e.follow(0, 'tracking move to the toll gate', S0('x4') - .2, S0('x5') - .1, mv([-8, 6.8, 38], [-18, 5.4, 17], 40, [-16, 6.8, 38], [-28, 5, 18], 40, { side: -2 }));
e.follow(0, 'crane up over the three gates', S0('x5') - .1, S0('c1') - .1, mv([-16, 6.8, 38], [-28, 5, 18], 40, [-4, 22, 46], [-16, 6, 18], 42, { up: 7 }));
e.follow(0, 'fly back to your door', S0('c1') - .1, S0('c1') + 3.0, mv([-4, 22, 46], [-16, 6, 18], 42, [7, 5.0, 17.5], [.2, 3.2, 6.6], 36, { side: 7, up: -2 }));
e.follow(0, 'settle at the door', S0('c1') + 3.0, S0('cta') - .2, mv([7, 5.0, 17.5], [.2, 3.2, 6.6], 36, [7, 5.0, 17.5], [.2, 3.2, 6.6], 36, {}));
e.follow(0, 'crane up and back', S0('cta') - .2, S0('cta') + 3.0, mv([7, 5.0, 17.5], [.2, 3.2, 6.6], 36, [14, 15, 42], [2, 1.5, 6], 42, { up: 3 }));
})();
