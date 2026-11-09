/* Part B1 (spam call): scenes 0-3 (hook, 41.7 billion, the 1400/1600 street, the reversal) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS;
var SC = window.SC = [0, S0('s1'), S0('t1'), S0('r1'), S0('f1'), S0('d1'), S0('x1'), S0('c1')];
window.GR = []; window.SCN = [];
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.fmt = fmt; window.grp = grp; window.sw = sw;
function dm(d) { return d; }
/* ===== scene 0: the hook ===== */
var gA = grp(new THREE.Group()), A = {};
(function () { B.floor(gA, 0, 40);
  var desk = new THREE.Mesh(new THREE.BoxGeometry(9, .5, 3.6), M(0x2b3678, { roughness: .5 })); desk.position.set(0, 1.9, 0); gA.add(desk); [-4, 4].forEach(function (x) { var l = new THREE.Mesh(new THREE.BoxGeometry(.4, 1.9, 3), M(0x2b3678)); l.position.set(x, .95, 0); gA.add(l); });
  A.user = B.voxel(false, K.CORAL); A.user.position.set(-2.8, 2.15, -.4); A.user.scale.setScalar(1.15); A.user.rotation.y = .35; gA.add(A.user);
  var lap = new THREE.Mesh(new THREE.BoxGeometry(2.2, .12, 1.5), M(0x7f89c8)); lap.position.set(-2.8, 2.2, 1.0); gA.add(lap); var lscr = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, .1), M(0x7f89c8)); lscr.position.set(-2.8, 2.9, .3); lscr.rotation.x = -.15; gA.add(lscr);
  A.ph = B.phone(B.callScreen('UNKNOWN', '+91 ·····  · 2:47 PM')); A.ph.position.set(2.3, 4.6, .4); A.ph.scale.setScalar(.62); A.ph.rotation.y = -.2; gA.add(A.ph);
  A.rings = [0, 1, 2].map(function () { var r = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.8), transparent: true, depthWrite: false })); r.position.set(2.3, 4.6, .8); gA.add(r); return r; });
  A.agent = B.agent(K.GOLD); A.agent.position.set(4.6, 2.15, 1.5); A.agent.scale.setScalar(.9); A.agent.rotation.y = -.5; gA.add(A.agent);
  A.card = B.card('LOAN · PRE-APPROVED', '₹5,00,000', 'NOBODY ASKED', { subcol: '#ff4d5e' }); A.card.scale.setScalar(.8); gA.add(A.card);
  A.l1 = e.lab('YOU · IN A MEETING', K.CORAL, .5, { fs: 40 }); A.l1.position.set(-2.8, 6.3, 0); gA.add(A.l1); A.l2 = e.lab('"SIR, LOAN CHAHIYE?"', K.GOLD, .6, { fs: 44 }); A.l2.position.set(4.2, 6.6, 1); gA.add(A.l2); A.l3 = e.lab('LOAN NE AAPKO DHOONDHA', K.RED, .56, { fs: 40 }); A.l3.position.set(0, 8.6, 1); gA.add(A.l3); })();
SCN[0] = function (t) { var g = gA; g.visible = true; B.bgc(.014); var t2 = S0('h2'), t3 = S0('h3');
  A.rings.forEach(function (r, i) { var u = ((t * 1.1 + i / 3) % 1); r.scale.setScalar(.4 + u * 1.8); r.material.opacity = (1 - u) * .8; }); A.ph.position.x = 2.3 + .05 * Math.sin(t * 38) * (t < t3 ? 1 : .0); A.ph.rotation.z = .04 * Math.sin(t * 36) * (t < t3 ? 1 : 0);
  put(A.agent, t, t2 - .1, .4); A.agent.userData.head.rotation.z = .1 * Math.sin(t * 5); A.agent.userData.armR.rotation.x = -1.2 + .3 * Math.sin(t * 6);
  var u = clamp((t - t3) / 1.3); A.card.visible = t > t3 - .05; A.card.position.set(lerp(4.4, -2.4, eo3(u)), lerp(4.4, 4.6, u) + 2.2 * Math.sin(u * 3.14), lerp(1.8, .9, u)); A.card.rotation.set(0, 0, (1 - u) * -.5 + .08 * Math.sin(t * 3));
  A.user.userData.head.rotation.y = lerp(.0, -.6, sw(t2, t2 + .4, t)); A.user.userData.armR.rotation.x = -.6 * sw(t3, t3 + .8, t);
  put(A.l1, t, .5, .35, t2 + .3); put(A.l2, t, t2 + .2, .35); put(A.l3, t, t3 + .8, .35); };
e.shot(0, 'push on the ringing phone', 0, 2.4, [3.4, 7.2, 22], [.2, 3.9, 0], 44, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, 'io');
e.shot(0, 'hold', 2.4, S0('h3') - .3, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, 'io');
e.shot(0, 'swing to the user', S0('h3') - .3, S0('h3') + 1.8, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, [-.4, 5.6, 16.5], [-.8, 3.9, 0], 44, 'io');
/* ===== scene 1: 41.7 billion ===== */
var gC = grp(new THREE.Group()), C = {};
(function () { B.floor(gC, 0, 60); var cols = 40, rows = 25, N = cols * rows; C.N = N; C.cols = cols; C.im = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .8, .2), M(0xffffff, { roughness: .5 }), N); C.im.frustumCulled = false; gC.add(C.im); C.im.setColorAt(0, new THREE.Color(1, 1, 1));
  C.c1 = e.dyn(.95, 860, 200, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('SPAM CALLS IN INDIA, 2025 (PER TRUECALLER REPORT)', 28, 52); x.font = '700 76px "Chakra Petch"'; x.fillText((a).toFixed(1) + ' BILLION', 28, 140); x.fillStyle = '#7a4a10'; x.font = '600 22px "DM Mono"'; x.fillText('4,168 CRORE · 1 DOT = 40 MILLION · NOT TO SCALE', 28, 182); }); C.c1.position.set(0, 10.8, 3); gC.add(C.c1);
  C.c2 = e.dyn(.8, 860, 170, K.CORAL, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('ITS USERS ALONE ≈ 42 B · 350 M+ USERS', 28, 50); x.font = '700 64px "Chakra Petch"'; x.fillText('≈ ' + Math.round(10 * a) + ' / USER / MONTH', 28, 126); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('OUR ROUGH MATH · SELF-SELECTED USERS', 28, 156); }); C.c2.position.set(0, 1.4, 6); gC.add(C.c2);
  C.mer = e.lab('EMI SE KAM YAAD AATA HAI', K.RED, .46, { fs: 36 }); C.mer.position.set(0, 12.5, 3); gC.add(C.mer); })();
SCN[1] = function (t) { var g = gC; g.visible = true; B.bgc(.01); var L = S1('s2') - SC[1], u = sw(SC[1] + .3, SC[1] + L * .55, t), lit = Math.floor(u * 1042), m = new THREE.Matrix4(), N = C.N, cols = C.cols, col = new THREE.Color();
  for (var i = 0; i < N; i++) { var x = (i % cols - cols / 2 + .5) * .62, y = (Math.floor(i / cols)) * .95 + .6, on = i < lit; m.makeTranslation(x, y + (on ? .06 * Math.sin(t * 3 + i * .3) : 0), 0); C.im.setMatrixAt(i, m); col.set(on ? K.GOLD : 0x28326e); if (on && hash(i + 5) < .06) col.set(K.RED); C.im.setColorAt(i, col); } C.im.instanceMatrix.needsUpdate = true; C.im.instanceColor.needsUpdate = true;
  C.c1.draw(41.7 * u); put(C.c1, t, SC[1] + .2, .3); put(C.mer, t, S0('s3') + .8, .35); var t3 = S0('s3'); C.c2.draw(sw(t3 + .3, t3 + 1.8, t)); put(C.c2, t, t3 + .2, .35); };
e.shot(1, 'rise along the dot wall', SC[1], S0('s3') - .3, [0, 3.2, 28], [0, 5.0, 0], 46, [0, 9.5, 33], [0, 9.0, 0], 46, 'io');
e.shot(1, 'drop to the per-user line', S0('s3') - .3, S1('s3') + .3, [0, 9.5, 33], [0, 9.0, 0], 46, [0, 6.2, 30], [0, 6.5, 0], 46, 'io');
/* ===== scenes 2 + 3: the street (built twice: the promise, then the catch) ===== */
function street(withDoors) { var g = new THREE.Group(); B.floor(g, 0, 60); var s = {}; var road = new THREE.Mesh(new THREE.BoxGeometry(24, .08, 5), M(0x2a3470)); road.position.set(0, .06, 3.2); g.add(road);
  function shop(x, col, label) { var b = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 3), M(0x1f2858)); b.position.set(x, 2.1, -1.4); g.add(b); var aw = new THREE.Mesh(new THREE.BoxGeometry(4.0, .35, 1.6), M(col)); aw.position.set(x, 4.2, .1); g.add(aw); var door = new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.6, .2), M(0x0b1230)); door.position.set(x, 1.3, .15); g.add(door); var sg = B.sign(label, '#' + col.toString(16).padStart(6, '0'), 3.2, 1.2, 120); sg.position.set(x, 5.3, .2); g.add(sg); return { b: b, door: door, sign: sg }; }
  s.a = shop(-2.3, K.GOLD, '1400'); s.b = shop(2.3, K.GREEN, '1600'); s.g = g; return s; }
var gS = grp(new THREE.Group()), SS = street(); gS.add(SS.g); SS.g.parent.remove(SS.g); gS.add(SS.g);
SS.ag = []; for (var i = 0; i < 6; i++) { var a = B.agent(K.GOLD); a.scale.setScalar(.7); SS.g.add(a); SS.ag.push(a); }
SS.l1 = e.lab('TELEMARKETING', K.GOLD, .5, { fs: 40 }); SS.l1.position.set(-2.3, 7.2, 0); SS.g.add(SS.l1); SS.l2 = e.lab('SERVICE + TRANSACTIONS', K.GREEN, .5, { fs: 36 }); SS.l2.position.set(2.3, 8.0, 0); SS.g.add(SS.l2); SS.l3 = e.card('1400 · 1600', 'business-only number series:\nyou can tell a company is calling', K.GOLD, 1.7); SS.l3.position.set(0, 9.4, 2); SS.g.add(SS.l3);
SCN[2] = function (t) { var g = gS; g.visible = true; B.bgc(.01); var L = S1('t2') - SC[2];
  SS.ag.forEach(function (a, i) { var u = clamp(((t - SC[2] - .4 - i * .5) / 2.2)); a.visible = u > 0 && u < 1; a.position.set(lerp(-8, -2.3, u), .15, 3.3 - .15 * i); a.rotation.y = Math.PI / 2 + .1; a.userData.armR.rotation.x = Math.sin(t * 8 + i) * .5; });
  put(SS.l1, t, SC[2] + .4, .35, S0('t2')); put(SS.l2, t, S0('t1') + L * .45, .35, S0('t2')); put(SS.l3, t, S0('t2') + .2, .35); };
e.shot(2, 'truck along the street', SC[2], S1('t2') + .3, [-4, 6.4, 20], [-2, 3.4, 0], 46, [2, 6.4, 20], [1.4, 3.6, 0], 46, 'io');
var gR = grp(new THREE.Group()), RR = street(); gR.add(RR.g);
RR.sh = [RR.a, RR.b].map(function (sp, i) { var sh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, .2), M(0x59608f, { metalness: .6, roughness: .4 })); sh.position.set(i ? 2.3 : -2.3, 4.4, .3); RR.g.add(sh); return sh; });
RR.walk = []; for (var j = 0; j < 7; j++) { var p = B.voxel(false, j % 2 ? K.CREAM : K.CORAL); p.scale.setScalar(.7); RR.g.add(p); RR.walk.push(p); }
RR.b1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, .8), M(K.GOLD)); RR.b2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, .8), M(K.GREEN)); RR.b1.position.set(-2.3, .5, 5.6); RR.b2.position.set(2.3, .5, 5.6); RR.g.add(RR.b1); RR.g.add(RR.b2);
RR.p1 = e.dyn(.7, 520, 150, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1400 · CALLS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(81 * a) + '%', 22, 118); }); RR.p1.position.set(-2.1, 7.2, 2); RR.g.add(RR.p1);
RR.p2 = e.dyn(.7, 520, 150, K.GREEN, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1600 · CALLS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(79 * a) + '%', 22, 118); }); RR.p2.position.set(2.1, 7.2, 2); RR.g.add(RR.p2);
RR.st = B.stamp('FREQUENTLY\nBLOCKED', '#ff4d5e', 4.4, 1.5, 96); RR.g.add(RR.st); RR.cl = e.lab("TRUECALLER CEO'S CLAIM · 8 MONTHS", K.RED, .46, { fs: 34 }); RR.cl.position.set(0, 10.0, 0); RR.g.add(RR.cl); RR.cd = e.card('FREQUENTLY BLOCKED', 'the label Truecaller may use:\nit cannot say "spam" for these series', K.RED, 1.7); RR.cd.position.set(0, 9.6, 2); RR.g.add(RR.cd);
SCN[3] = function (t) { var g = gR; g.visible = true; B.bgc(.01); var L = S1('r3') - SC[3], t2 = S0('r2'), t3 = S0('r3');
  RR.sh.forEach(function (sh, i) { var u = sw(SC[3] + .3 + i * .3, SC[3] + 1.1 + i * .3, t); sh.position.y = lerp(7.2, 1.45, u); sh.scale.y = 1; });
  RR.walk.forEach(function (p, i) { var u = ((t * .13 + i / 7) % 1); p.position.set(lerp(-9, 9, u), .15, 3.4 + (i % 2) * .8); p.rotation.y = Math.PI / 2; p.userData.armR.rotation.x = Math.sin(t * 6 + i) * .4; p.visible = true; });
  RR.p1.draw(sw(t2, t2 + 1.6, t)); RR.p2.draw(sw(t2 + .3, t2 + 1.9, t)); put(RR.p1, t, t2, .35, t3 + 1.3); put(RR.p2, t, t2 + .3, .35, t3 + 1.3); RR.b1.scale.y = .2 + 3.2 * sw(t2, t2 + 1.6, t) * .81; RR.b2.scale.y = .2 + 3.2 * sw(t2 + .3, t2 + 1.9, t) * .79; RR.b1.position.y = .5 * RR.b1.scale.y; RR.b2.position.y = .5 * RR.b2.scale.y;
  B.slam(RR.st, clamp((t - t3 - .6) / .8), 6.5, 3.8, 1); RR.st.position.x = 0; RR.st.position.z = 2.4; put(RR.cl, t, t2 + 1.2, .35, t3 + .2); put(RR.cd, t, t3 + 1.4, .4); };
e.shot(3, 'locked on the shuttered street', SC[3], S0('r2') - .2, [0, 6.4, 22], [0, 3.4, 0], 46, [0, 6.4, 22], [0, 3.4, 0], 46, 'io');
e.shot(3, 'push on the bars', S0('r2') - .2, S1('r3') + .3, [0, 6.4, 22], [0, 3.4, 0], 46, [0, 6.4, 17], [0, 3.8, 0], 44, 'io');
})();
