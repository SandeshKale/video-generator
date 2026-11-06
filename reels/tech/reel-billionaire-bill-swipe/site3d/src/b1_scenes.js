/* Part B1 (billionaire): scenes 0-5 (hook, how it works, the myth, conveyor, double swipe + privacy, 3,428 crowd). Everything is a pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS;
var SC = window.SC = [0, S0('p1'), S0('r1'), S0('t1'), S0('t2'), S0('t3'), S0('f1'), S0('f2'), S0('f3'), S0('m1'), S0('e1'), S0('c1')];
window.GR = []; window.SCN = [];
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
window.fmt = fmt; window.grp = grp;
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.sw = sw;
/* ===== scene 0: the hook ===== */
var gA = grp(new THREE.Group()), A = {};
(function () { B.floor(gA, 0, 40); var st = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.8, .5, 64), e.physMat(0xfff0e6, { roughness: .35, envMapIntensity: .9 })); st.position.y = .25; gA.add(st);
  var ring = new THREE.Mesh(new THREE.TorusGeometry(7.6, .12, 12, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.4) })); ring.rotation.x = Math.PI / 2; ring.position.y = .52; gA.add(ring);
  var scr = B.tcv(540, 1100, function (x) { var grd = x.createLinearGradient(0, 0, 0, 1100); grd.addColorStop(0, '#ff7a70'); grd.addColorStop(1, '#ff4f5e'); x.fillStyle = grd; x.fillRect(0, 0, 540, 1100); x.fillStyle = '#fff7ee'; x.font = '900 46px Unbounded'; x.textAlign = 'center'; x.fillText('BILLSWIPE', 270, 96); x.font = '600 20px "Geist Mono"'; x.fillText('ILLUSTRATIVE · NOT A REAL APP', 270, 132);
    x.fillStyle = 'rgba(42,15,46,.18)'; x.fillRect(58, 205, 430, 640); x.fillStyle = '#fff7ee'; x.fillRect(46, 185, 448, 650); x.strokeStyle = '#2a0f2e'; x.lineWidth = 6; x.strokeRect(46, 185, 448, 650); x.fillStyle = '#fff7ee'; x.beginPath(); x.arc(160, 950, 70, 0, 6.283); x.fill(); x.beginPath(); x.arc(380, 950, 70, 0, 6.283); x.fill(); x.fillStyle = '#e03131'; x.font = '900 70px Inter'; x.fillText('✕', 160, 976); x.fillStyle = '#2fb872'; x.fillText('♥', 380, 976); });
  A.ph = B.phone(scr); A.ph.position.set(.9, 3.9, 0); A.ph.rotation.y = -.3; A.ph.scale.setScalar(.82); gA.add(A.ph);
  A.th = B.throne(); A.th.position.set(-3.7, .5, 1.6); A.th.rotation.y = .6; A.th.scale.setScalar(.95); gA.add(A.th); A.bi = B.voxel(); A.bi.position.set(-3.7, 1.6, 1.8); A.bi.rotation.y = .6; gA.add(A.bi);
  A.card = B.card('ELECTRICITY', '₹4,820', '1 MONTH OVERDUE'); A.card.scale.setScalar(.8); gA.add(A.card); A.paid = B.stamp('PAID', '#2fb872', 1.7, .6, 120); A.paid.position.set(.2, -.35, .1); A.card.add(A.paid);
  A.coins = B.coin(46); gA.add(A.coins);
  A.l1 = e.lab('BORED', K.RED, .5); A.l1.position.set(-3.7, 5.4, 1.8); gA.add(A.l1); A.l2 = e.lab('BILL · 1 MONTH OVERDUE', K.CORAL, .46); A.l2.position.set(.9, 8.0, 0); gA.add(A.l2); })();
SCN[0] = function (t) { var g = gA; g.visible = true; B.bgc(.012); var tF = SP('h1', .6), u = clamp((t - tF) / 1.1);
  var px = lerp(.9 + .55, 12, eo3(u)), py = 4.1 + 4.2 * u - 4.6 * u * u + (u < 0 ? 0 : 0), pz = .95; A.card.position.set(u > 0 ? px : 1.45, u > 0 ? py : 4.1 + .08 * Math.sin(t * 2.2), pz); A.card.rotation.set(0, -.3 + u * .3, -u * .9); A.paid.visible = u > .75; A.paid.scale.setScalar(.8 + .2 * eo3((u - .75) * 4));
  A.bi.userData.head.rotation.z = .1 * Math.sin(t * 1.5) - (u > 0 ? .1 : 0); A.bi.userData.head.rotation.y = lerp(.0, -.5, sw(tF, tF + .5, t)); A.bi.userData.armR.rotation.x = -.9 + .15 * Math.sin(t * 1.5);
  var tc = tF + .5; for (var i = 0; i < 46; i++) { var l = clamp((t - tc - hash(i) * .8) / 1.0), x0 = 3.0 + (hash(i + 3) - .5) * 4.4, z0 = 1.0 + (hash(i + 9) - .5) * 3.2, yy = lerp(9 + hash(i + 5) * 4, .62, ei3(l)); if (l <= 0) yy = -5; B.setI(A.coins, i, x0, yy, z0, 1.2 + l * 3, hash(i + 3) * 3, l * 4, 1); } A.coins.instanceMatrix.needsUpdate = true;
  put(A.l1, t, .6, .4); put(A.l2, t, 1.0, .4); };
e.shot(0, 'crane down', 0, 2.8, [4.5, 9.5, 22], [-.3, 4.4, 0], 44, [2.6, 5.4, 18.5], [-.4, 3.9, 0], 44, 'io');
e.shot(0, 'push on the flick', SP('h1', .5), SP('h1', .5) + 2.4, [2.6, 5.4, 18.5], [-.4, 3.9, 0], 44, [2.2, 5.2, 15.5], [1.6, 4.9, 0], 42, 'io');
/* ===== scene 1: how it works (upload -> swipe -> paid) ===== */
var gH = grp(new THREE.Group()), H = {};
(function () { B.floor(gH, 0, 60); [-7, 0, 7].forEach(function (x, i) { var d = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.0, .35, 48), e.physMat(0xfff0e6, { roughness: .4 })); d.position.set(x, .18, 0); gH.add(d); var rg = new THREE.Mesh(new THREE.TorusGeometry(2.85, .07, 10, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color([K.CORAL, K.GOLD, K.GREEN][i]).multiplyScalar(1.5) })); rg.rotation.x = Math.PI / 2; rg.position.set(x, .38, 0); gH.add(rg); });
  var sc2 = B.tcv(540, 1100, function (x) { x.fillStyle = '#ff5a5f'; x.fillRect(0, 0, 540, 1100); x.fillStyle = '#fff7ee'; x.font = '900 44px Unbounded'; x.textAlign = 'center'; x.fillText('UPLOAD BILL', 270, 150); x.strokeStyle = '#fff7ee'; x.lineWidth = 10; x.setLineDash([22, 16]); x.strokeRect(90, 260, 360, 500); });
  H.ph = B.phone(sc2); H.ph.scale.setScalar(.55); H.ph.position.set(-7, 2.4, -.8); gH.add(H.ph); H.bi = B.voxel(); H.bi.position.set(0, .35, -1.0); H.bi.scale.setScalar(.8); gH.add(H.bi);
  H.bld = new THREE.Group(); H.bld.position.set(7, .35, -1.0); var bb = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.4, 1.6), M(K.GREEN)); bb.position.y = 1.2; H.bld.add(bb); var rf = new THREE.Mesh(new THREE.BoxGeometry(3.0, .3, 2.0), M(K.PLUM)); rf.position.y = 2.55; H.bld.add(rf); gH.add(H.bld);
  H.card = B.card('ELECTRICITY', '₹4,820', 'ONE BILL'); gH.add(H.card); H.paid = B.stamp('PAID', '#2fb872', 1.9, .65, 120); H.paid.position.set(.2, -.3, .1); H.card.add(H.paid);
  H.heart = B.plane(1.6, 1.6, B.tcv(256, 256, function (x) { x.fillStyle = '#2fb872'; x.font = '900 220px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('♥', 128, 140); }), true); H.heart.position.set(0, 4.6, 1); gH.add(H.heart);
  H.coins = B.coin(30); gH.add(H.coins);
  H.l = [e.lab('1 · UPLOAD', K.CORAL, .6), e.lab('2 · SWIPE RIGHT', K.GOLD, .6), e.lab('3 · BILL PAID', K.GREEN, .6)]; H.l.forEach(function (l, i) { l.position.set(-7 + i * 7, 5.6, 0); gH.add(l); }); })();
SCN[1] = function (t) { var g = gH; g.visible = true; B.bgc(.01); var L = S1('p1') - SC[1], a = SC[1] + L * .08, b = SC[1] + L * .36, c = SC[1] + L * .66, d = SC[1] + L * .88;
  var x = -7 + 7 * sw(a + .2, b, t) + 7 * sw(c, d, t), y = .9 + (t < b ? 1.5 * sw(a - .1, a + .5, t) : 0) + .2 * Math.sin(t * 3); H.card.position.set(x, y + (x > 1 ? 0 : 0), t < a ? -0.2 : 1.0); H.card.rotation.set(0, .0, .08 * Math.sin(t * 2)); H.card.scale.setScalar(.75);
  var u3 = clamp((t - d) / .5); H.paid.visible = u3 > 0; H.paid.scale.setScalar(.8 + .3 * eo3(u3)); H.heart.visible = t > b + .1 && t < c + .5; H.heart.scale.setScalar(.6 + .5 * eo3((t - b - .1) * 3)); H.bi.userData.head.rotation.y = -.2 + .3 * sw(b - .3, b + .2, t);
  for (var i = 0; i < 30; i++) { var l = clamp((t - d - .1 - hash(i) * .3) / .8); B.setI(H.coins, i, 7 + (hash(i + 1) - .5) * 3, l <= 0 ? -5 : lerp(.9, .5 + 4 * Math.sin(l * 3.14) * (.4 + hash(i + 2)), 1) * (1 - 0) + 0, 1 + (hash(i + 4) - .5) * 2, l * 5, l * 6, 0); } H.coins.instanceMatrix.needsUpdate = true;
  H.l.forEach(function (l, i) { put(l, t, SC[1] + .15 + i * L * .27, .4); }); };
e.shot(1, 'truck along the stages', SC[1], S1('p1') + .2, [-7.8, 5.2, 11.5], [-7, 2.4, 0], 46, [7.8, 5.2, 11.5], [7, 2.4, 0], 46, 'io');
/* ===== scene 2: the myth (never posted) ===== */
var gM = grp(new THREE.Group()), Mv = {};
(function () { B.floor(gM, 0, 60); Mv.slab = B.rbox(6.2, 4.3, .2, .35, e.physMat(0xfff7ee, { roughness: .4 }), .04); Mv.slab.position.set(0, 4.6, 0); Mv.slab.rotation.y = -.12; gM.add(Mv.slab);
  var sp = B.plane(6.0, 4.1, B.tcv(620, 430, function (x) { x.fillStyle = '#fff7ee'; x.fillRect(0, 0, 620, 430); x.fillStyle = 'rgba(42,15,46,.12)'; x.beginPath(); x.arc(70, 76, 40, 0, 6.283); x.fill(); x.fillRect(130, 56, 220, 22); x.fillRect(130, 90, 150, 16); x.fillStyle = '#2a0f2e'; x.font = '900 34px Unbounded'; x.textAlign = 'left'; x.fillText('"app where bored', 40, 190); x.fillText('billionaires swipe', 40, 238); x.fillText('right to pay bills"', 40, 286); x.fillStyle = 'rgba(42,15,46,.55)'; x.font = '600 22px "Geist Mono"'; x.fillText('SCREENSHOT · NO DATE · NO LINK', 40, 340); x.fillText('SHARED ON FACEBOOK, 1 NOV 2026', 40, 376); })); sp.position.z = .16; Mv.slab.add(sp);
  Mv.stamp = B.stamp('NEVER\nPOSTED', '#e03131', 4.2, 1.44, 112); Mv.stamp.position.set(.9, -1.0, .45); Mv.stamp.rotation.z = -.2; Mv.slab.add(Mv.stamp);
  Mv.sb = B.rbox(7.4, 1.1, .2, .5, e.physMat(0xfff7ee, { roughness: .4 }), .03); Mv.sb.position.set(0, 1.9, 3.2); Mv.sb.rotation.x = -.15; Mv.sb.scale.setScalar(.68); gM.add(Mv.sb);
  Mv.q = B.plane(7.2, 1.07, B.tcv(740, 110, function (x) { x.fillStyle = '#fff7ee'; x.fillRect(0, 0, 740, 110); x.fillStyle = '#2a0f2e'; x.font = '600 28px "Geist Mono"'; x.fillText('SEARCH THE ACCOUNT: "bored billionaires"', 28, 66); })); Mv.q.position.z = .2; Mv.sb.add(Mv.q);
  Mv.zero = B.plane(3.2, .8, B.tcv(400, 100, function (x) { x.fillStyle = '#e03131'; x.fillRect(0, 0, 400, 100); x.fillStyle = '#fff7ee'; x.font = '900 52px Unbounded'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('0 RESULTS', 200, 54); })); Mv.zero.position.set(2.0, 0, .24); Mv.sb.add(Mv.zero);
  Mv.src = e.lab('LEAD STORIES · "NEVER POSTED" · 3 NOV 2026', K.GREEN, .42); Mv.src.position.set(0, 7.9, .4); gM.add(Mv.src);
  Mv.tl = [['22 OCT', 'AAM X USER KA\nMAZAAK', K.GOLD, -4.0], ['1 NOV', 'FACEBOOK\nPOST', K.CORAL, 0], ['3 NOV', 'LEAD STORIES:\nNEVER POSTED', K.GREEN, 4.0]].map(function (a) { var m = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .25, 32), M(a[2])); m.position.set(a[3], .15, 10); gM.add(m); var l = e.lab(a[0] + '\n' + a[1], a[2], .62, { fs: 36 }); l.position.set(a[3], 1.7, 10); gM.add(l); return { m: m, l: l }; });
  var line = new THREE.Mesh(new THREE.BoxGeometry(9, .06, .12), M(K.PLUM)); line.position.set(0, .2, 10); gM.add(line); })();
SCN[2] = function (t) { var g = gM; g.visible = true; B.bgc(.012); var tS = WS('r1', 'tweet|ट्वीट|ट्वीट|ट्विट', .8), tQ = S0('r2') + .3, tZ = tQ + 1.6, tT = SP('r2', .55);
  put(Mv.slab, t, SC[2], .5); B.slam(Mv.stamp, clamp((t - tS) / .9), 3, -1.0, 1); Mv.stamp.position.y = Mv.stamp.visible ? Mv.stamp.position.y : -1; Mv.stamp.position.z = .45;
  put(Mv.sb, t, tQ, .5); Mv.zero.visible = t > tZ; Mv.zero.scale.setScalar(.7 + .3 * eo3((t - tZ) * 3)); put(Mv.src, t, tZ + .3, .4);
  Mv.tl.forEach(function (a, i) { put(a.m, t, tT + i * .8, .3); put(a.l, t, tT + i * .8 + .1, .4); }); };
e.shot(2, 'whip-tilt to the slab', SC[2], SC[2] + 1.2, [.8, 12, 17], [0, 3, 1.5], 46, [.8, 5.6, 14.5], [0, 3.6, 1.5], 46, 'io');
e.shot(2, 'push to the search bar', S0('r2') - .2, S0('r2') + 1.6, [.8, 5.6, 14.5], [0, 3.6, 1.5], 46, [.4, 3.8, 11.8], [0, 2.8, 3], 46, 'io');
e.shot(2, 'pull to the timeline', SP('r2', .45), S1('r2') + .2, [.4, 3.8, 11.8], [0, 2.8, 3], 46, [.5, 5.0, 19], [0, 1.4, 6.5], 46, 'io');
/* ===== scene 3: tech lens 1 - the verification conveyor ===== */
var gT = grp(new THREE.Group()), T = {};
(function () { B.floor(gT, 0, 70); var bt = B.tcv(512, 64, function (x) { x.fillStyle = '#2a0f2e'; x.fillRect(0, 0, 512, 64); x.fillStyle = '#6b3a63'; for (var i = 0; i < 8; i++) x.fillRect(i * 64 + 8, 28, 36, 8); }), tx = e.canvasTex(bt); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(5, 1); T.tx = tx;
  var belt = new THREE.Mesh(new THREE.BoxGeometry(24, .4, 3.2), [M(K.PLUM), M(K.PLUM), new THREE.MeshStandardMaterial({ map: tx, roughness: .6 }), M(K.PLUM), M(K.PLUM), M(K.PLUM)]); belt.position.set(0, .3, 0); gT.add(belt);
  /* stations */
  T.scan = new THREE.Group(); T.scan.position.set(-6, 0, 0); [-1.8, 1.8].forEach(function (z) { var p = new THREE.Mesh(new THREE.BoxGeometry(.35, 3.2, .35), M(0xfff0e6, { roughness: .4 })); p.position.set(0, 1.9, z); T.scan.add(p); }); var top = new THREE.Mesh(new THREE.BoxGeometry(.5, .35, 4), M(0xfff0e6)); top.position.y = 3.5; T.scan.add(top);
  T.beam = new THREE.Mesh(new THREE.BoxGeometry(.06, .05, 3.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(2.4) })); T.beam.position.set(0, 1, 0); T.scan.add(T.beam); gT.add(T.scan);
  T.db = new THREE.Group(); T.db.position.set(-.5, 0, 0); for (var i = 0; i < 3; i++) { var d = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, .45, 32), GM()); d.position.set(0, .7 + i * .55, -2.4); T.db.add(d); } T.gate = new THREE.Mesh(new THREE.TorusGeometry(1.5, .1, 10, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.6), transparent: true, opacity: .7 })); T.gate.position.set(0, 1.9, 0); T.gate.rotation.y = Math.PI / 2; T.db.add(T.gate); gT.add(T.db);
  T.hu = B.voxel(false, K.CORAL); T.hu.position.set(4.6, .5, -2.9); T.hu.scale.setScalar(.9); T.hu.rotation.y = -.5; gT.add(T.hu); var cb = new THREE.Mesh(new THREE.BoxGeometry(.7, .9, .08), M(K.CREAM)); cb.position.set(.5, 1.35, .45); T.hu.add(cb);
  T.biller = new THREE.Group(); T.biller.position.set(10, 0, -.4); var bb = new THREE.Mesh(new THREE.BoxGeometry(3, 3.2, 2.4), M(K.GREEN)); bb.position.y = 1.6; T.biller.add(bb); var rf = new THREE.Mesh(new THREE.BoxGeometry(3.4, .35, 2.8), M(K.PLUM)); rf.position.y = 3.4; T.biller.add(rf); gT.add(T.biller);
  T.real = B.card('ELECTRICITY', '₹4,820', 'BILL #1'); T.real.scale.setScalar(.6); gT.add(T.real); T.fake = B.card('ELECTRICITY', '₹4,820', 'BILL #2', { paper: 0xffd6d6 }); T.fake.scale.setScalar(.6); gT.add(T.fake); T.x = B.stamp('FAKE', '#e03131', 1.9, .65, 120); T.x.position.set(0, 0, .1); T.fake.add(T.x);
  T.venmo = B.card('VENMO LINK', '$ ???', 'NOT ALLOWED', { paper: 0xe8e1ff }); T.venmo.scale.setScalar(.6); gT.add(T.venmo); T.vx = B.stamp('NO', '#e03131', 1.1, .65, 120); T.vx.position.set(0, 0, .1); T.venmo.add(T.vx);
  T.pay = B.stamp('PAID', '#2fb872', 1.9, .65, 120); T.pay.position.set(.2, -.3, .1); T.real.add(T.pay);
  T.l = [['1 · BILL READ', K.CORAL, -6], ['2 · BILLER MATCH', K.GOLD, -.5], ['3 · HUMAN CHECK', K.CORAL, 4.6], ['4 · BILLER PAID', K.GREEN, 10]].map(function (a, i) { var l = e.lab(a[0], a[1], .52, { fs: 40 }); l.position.set(a[2], 5.2, 0); gT.add(l); return l; });
  T.cap = e.lab('PAYS THE BILLER, NOT YOU', K.GREEN, .5, { fs: 40 }); T.cap.position.set(10, 6.1, 0); gT.add(T.cap); })();
SCN[3] = function (t) { var g = gT; g.visible = true; B.bgc(.008); var t0 = SC[3] + .2, L = S1('t1') - SC[3], v = 12 / (L * .5);
  T.tx.offset.x = -(t - SC[3]) * .35;
  var xr = -12 + (t - t0) * v * 1.0; T.real.position.set(Math.min(xr, 9), .85, 0); T.real.visible = t > t0; T.real.rotation.z = 0; T.pay.visible = xr > 8.2; T.pay.scale.setScalar(.8 + .2 * eo3((xr - 8.2)));
  var tf = t0 + 1.4, xf = -12 + (t - tf) * v; T.fake.visible = t > tf; var ej = clamp((xf + .5) / 2.2); if (xf < -.5) T.fake.position.set(xf, .85, 0), T.fake.rotation.set(0, 0, 0); else T.fake.position.set(-.5 + ej * 3, .85 + 3.5 * ej - 3 * ej * ej * 1.3, ej * 9), T.fake.rotation.set(ej * 3, 0, ej * 5);
  T.x.visible = xf > -1.5; T.gate.material.opacity = .45 + .5 * (xf > -2 && xf < 0 ? 1 : 0);
  var tv = SC[3] + L * .72, xv = 6 + (t - tv) * 5; T.venmo.visible = t > tv; var kv = clamp((t - tv - .6) / .8); T.venmo.position.set(Math.min(xv, 8.5) + kv * 2, .85 + kv * 2.5 * (1 - kv) * 2, -kv * 6); T.venmo.rotation.set(0, 0, kv * 4); T.vx.visible = t > tv + .5;
  T.beam.position.z = 1.5 * Math.sin(t * 5); T.hu.userData.head.rotation.y = .3 * Math.sin(t * 1.4); T.hu.userData.armR.rotation.x = -.4 + .3 * Math.sin(t * 4);
  var cxr = T.real.position.x, bi = 0, bd = 99; [-6, -.5, 4.6, 10].forEach(function (sx, k) { if (Math.abs(cxr - sx) < bd) { bd = Math.abs(cxr - sx); bi = k; } }); T.l.forEach(function (l, i) { put(l, t, SC[3] + .2, .4); if (i !== bi) l.visible = false; }); put(T.cap, t, SC[3] + L * .55, .4); if (bi !== 3) T.cap.visible = false; };
e.shot(3, 'follow the belt', SC[3], S1('t1') + .2, [-8.6, 6.4, 11.5], [-5.4, 1.8, 0], 46, [13.4, 6.4, 11.5], [9.2, 1.8, 0], 46, 'io');
/* ===== scene 4: tech lens 2 - double swipe + privacy ===== */
var gD = grp(new THREE.Group()), D = {};
(function () { B.floor(gD, 0, 60); D.ped = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 2.2, 40), e.physMat(0xfff0e6, { roughness: .4 })); D.ped.position.set(0, 1.1, 0); gD.add(D.ped);
  D.card = B.card('ELECTRICITY', '₹4,820', 'ONE BILL'); D.card.position.set(0, 3.4, 0); gD.add(D.card); D.hold = new THREE.Mesh(new THREE.TorusGeometry(2.0, .1, 12, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.8) })); D.hold.position.set(0, 3.4, 0); gD.add(D.hold);
  D.v1 = B.voxel(); D.v1.position.set(-3.6, 0, 0); D.v1.rotation.y = Math.PI / 2; D.v1.scale.setScalar(1.1); gD.add(D.v1); D.v2 = B.voxel(true, K.CORAL); D.v2.position.set(3.6, 0, 0); D.v2.rotation.y = -Math.PI / 2; D.v2.scale.setScalar(1.1); gD.add(D.v2);
  D.dbl = B.stamp('DOUBLE\nPAY ✕', '#e03131', 3.0, 1.05, 96); D.dbl.position.set(2.2, 6.0, 1.2); gD.add(D.dbl);
  D.l1 = e.lab('ONE BILL · ONE HOLD', K.GOLD, .55); D.l1.position.set(0, 7.0, 0); gD.add(D.l1); D.l2 = e.lab('2ND SWIPE BOUNCES', K.RED, .5); D.l2.position.set(2.2, 8.2, 0); gD.add(D.l2);
  D.priv = new THREE.Group(); D.pc = B.card('NAME  A. SAMPLE', '', '14 SAMPLE ROAD', { subcol: '#2a0f2e' }); D.pc.userData.face.material.map = e.canvasTex(B.tcv(520, 340, function (x, w, h) { x.fillStyle = '#fff7ee'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2a0f2e'; x.lineWidth = 8; x.strokeRect(6, 6, w - 12, h - 12); x.fillStyle = '#2a0f2e'; x.font = '600 28px "Geist Mono"'; x.fillText('ELECTRICITY BILL', 34, 62); x.font = '600 32px "Geist Mono"'; x.fillText('NAME   A. SAMPLE', 34, 130); x.fillText('ADDR   14 SAMPLE ROAD', 34, 190); x.fillText('A/C    ••••4821', 34, 250); x.font = '900 34px Unbounded'; x.fillText('₹4,820', 34, 316); })); D.pc.scale.setScalar(1.35); D.pc.position.set(0, 4.6, 0); D.priv.add(D.pc);
  D.bars = [130, 190, 250].map(function (yy, i) { var b = new THREE.Mesh(new THREE.BoxGeometry(2.2, .22, .06), M(K.PLUM)); b.position.set(.3, (172 - yy) / 340 * 1.62 + 0.0, .1); D.pc.add(b); return b; });
  D.lens = new THREE.Mesh(new THREE.TorusGeometry(1.0, .09, 12, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.RED).multiplyScalar(1.8) })); D.priv.add(D.lens);
  D.insta = e.lab('PUBLIC DECK = GHAR KA PATA ONLINE', K.RED, .55, { fs: 42 }); D.insta.position.set(0, 8.4, 0); D.priv.add(D.insta); D.fl = e.lab('ILLUSTRATIVE SAMPLE · NOT A REAL BILL', K.GOLD, .4, { fs: 34 }); D.fl.position.set(0, 1.4, 1.2); D.priv.add(D.fl); gD.add(D.priv); })();
SCN[4] = function (t) { var g = gD, L = S1('t2') - SC[4], tS = SC[4] + L * .5; g.visible = true; B.bgc(.012);
  var first = t < tS; [D.ped, D.card, D.hold, D.v1, D.v2, D.dbl, D.l1, D.l2].forEach(function (o) { o.visible = first; }); D.priv.visible = !first;
  if (first) { var lu = sw(SC[4] + .6, SC[4] + 1.4, t), bk = clamp((t - SC[4] - 1.4) / .8); D.v1.position.x = -3.6 + 1.8 * lu; D.v2.position.x = 3.6 - 1.8 * lu + (bk > 0 ? .9 * eo3(bk) : 0); D.v1.userData.armR.rotation.x = -1.2 * lu; D.v2.userData.armR.rotation.x = -1.2 * lu * (1 - bk);
    D.hold.visible = t > SC[4] + 1.1; D.hold.rotation.set(Math.PI / 2 + .3 * Math.sin(t * 2), 0, t * 1.4); D.card.rotation.y = .2 * Math.sin(t * 1.3); B.slam(D.dbl, clamp((t - SC[4] - 1.6) / .9), 8, 6.2, 1); D.dbl.position.x = 2.2; D.dbl.position.z = 1.2; put(D.l1, t, SC[4] + 1.15, .4); put(D.l2, t, SC[4] + 1.9, .4); }
  else { var lt = t - tS; D.pc.rotation.y = -.25 + .25 * sw(tS, tS + 1, t); D.lens.position.set(-1.6 + 3.2 * ((lt * .5) % 1), 4.6 + .35 * Math.sin(lt * 3), .6); D.lens.rotation.x = 0; D.bars.forEach(function (b, i) { b.visible = lt > L * .3 + i * .3; b.scale.x = eo3((lt - L * .3 - i * .3) * 3) + .001; }); put(D.insta, t, tS + .3, .4); put(D.fl, t, tS + .5, .4); } };
e.shot(4, 'locked wide on the lunge', SC[4], SC[4] + L4(), [0, 5.4, 14.5], [0, 3.6, 0], 46, [0, 5.4, 14.5], [0, 3.6, 0], 46, 'io');
function L4() { return (S1('t2') - SC[4]) * .5 - .1; }
e.shot(4, 'dolly in on the card', SC[4] + L4() + .2, S1('t2') + .2, [0, 5.4, 14.5], [0, 3.6, 0], 46, [.2, 5.6, 12.5], [0, 4.5, 0], 44, 'io');
/* ===== scene 5: scale - 3,428 billionaires ===== */
var gC = grp(new THREE.Group()), C5 = {};
(function () { B.floor(gC, 0, 120); var cols = 60, N = 3428; C5.N = N; C5.cols = cols; C5.im = [[K.PLUM, .5, 1.2, .5, .6], [K.SKIN, .45, .45, .45, 1.65], [K.GOLD, .5, .3, .5, 1.95]].map(function (m) { var im = new THREE.InstancedMesh(new THREE.BoxGeometry(m[1], m[2], m[3]), m[0] === K.GOLD ? GM() : M(m[0], { roughness: .65 }), N); im.frustumCulled = false; im.userData.y = m[4]; gC.add(im); return im; });
  var cw = B.tcv(512, 320, function (x) { x.fillStyle = '#ffc4b8'; x.fillRect(0, 0, 512, 320); for (var j = 0; j < 10; j++) for (var i = 0; i < 16; i++) { x.fillStyle = '#fff7ee'; x.fillRect(i * 32 + 2, j * 32 + 2, 28, 28); x.fillStyle = '#e03131'; x.fillRect(i * 32 + 5, j * 32 + 5, 22, 5); x.fillStyle = '#2a0f2e'; x.fillRect(i * 32 + 5, j * 32 + 14, 14, 3); x.fillRect(i * 32 + 5, j * 32 + 20, 18, 3); } }), wt = e.canvasTex(cw); var wall = new THREE.Mesh(new THREE.BoxGeometry(60, 40, 3), new THREE.MeshStandardMaterial({ map: wt, roughness: .6 })); wall.position.set(0, 20, -52); gC.add(wall);
  C5.fg = B.voxel(); C5.fg.position.set(0, 0, 15); C5.fg.scale.setScalar(1.6); gC.add(C5.fg);
  C5.c1 = e.dyn(.8, 760, 170, K.GOLD, function (x, a) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('FORBES 2026 · BILLIONAIRES', 32, 54); x.font = '900 70px Unbounded'; x.fillText(fmt(a), 32, 138); }); C5.c1.position.set(0, 9.5, 14); gC.add(C5.c1);
  C5.c2 = e.dyn(.95, 880, 220, K.RED, function (x, a, b) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('14 M WITH MEDICAL DEBT OVER $1,000 ÷ 3,428', 32, 52); x.font = '900 60px Unbounded'; x.fillText('≈ ' + fmt(a) + ' BILLS EACH', 32, 130); x.fillStyle = '#e03131'; x.font = '600 22px "Geist Mono"'; x.fillText('ROUGH · NOT TO SCALE · KFF VIA THE GUARDIAN', 32, 186); }); C5.c2.position.set(0, 3.8, 20); gC.add(C5.c2); })();
SCN[5] = function (t) { var g = gC; g.visible = true; B.bgc(.006); var lt = t - SC[5], L = S1('t3') - SC[5], dm = new THREE.Matrix4(), N = C5.N, cols = C5.cols;
  var wave = sw(SC[5] + L * .45, SC[5] + L * .85, t);
  C5.im.forEach(function (im) { for (var i = 0; i < N; i++) { var cx = (i % cols - cols / 2) * .95 + (hash(i) - .5) * .25, cz = (Math.floor(i / cols) - 30) * .95 + (hash(i + 7) - .5) * .25, bob = .09 * Math.sin(t * 3 + hash(i + 2) * 6.28) + wave * .35 * Math.max(0, Math.sin(t * 5 - cz * .35)); dm.makeTranslation(cx, im.userData.y + bob, cz); im.setMatrixAt(i, dm); } im.instanceMatrix.needsUpdate = true; });
  C5.fg.userData.head.rotation.y = .4 * Math.sin(t * 1.2); put(C5.fg, t, SC[5], .2); C5.c1.visible = true; C5.c1.draw(3428 * sw(SC[5] + .4, SC[5] + 1.8, t)); put(C5.c1, t, SC[5] + .3, .3);
  C5.c2.draw(4084 * sw(SC[5] + L * .5, SC[5] + L * .5 + 1.6, t)); put(C5.c2, t, SC[5] + L * .45, .4); };
e.shot(5, 'low look at one', SC[5], SC[5] + 1.6, [1.5, 3.2, 21], [0, 2.6, 15], 44, [1.5, 3.2, 21], [0, 2.6, 15], 44, 'io');
e.shot(5, 'crane up to the crowd', SC[5] + 1.6, SP('t3', .6), [1.5, 3.2, 21], [0, 2.6, 15], 44, [0, 15, 31], [0, .5, -4], 46, 'io');
})();
