/* Part B2 (spam call): scenes 4-7 (fraud, who picks up, the 18 Sep fix, declared) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS, SC = window.SC, grp = window.grp, sw = window.sw, SCN = window.SCN;
/* ===== scene 4: fraud ===== */
var gF = grp(new THREE.Group()), F = {};
(function () { B.floor(gF, 0, 60); var cn = new THREE.Mesh(new THREE.BoxGeometry(5, 1.6, 1.6), M(0x2b3678)); cn.position.set(-2.4, .8, 0); gF.add(cn);
  F.fr = B.agent(K.RED); F.fr.position.set(-2.4, 1.6, -.4); F.fr.scale.setScalar(1.15); gF.add(F.fr);
  F.sg = [['BANK', '#3de0a8'], ['POLICE', '#6a7bff'], ['PAY APP', '#ff8a1f']].map(function (a) { var s = B.sign(a[0], a[1], 3.0, 1.1, 120); s.position.set(-2.4, 5.6, .6); gF.add(s); return s; });
  F.c1 = e.dyn(.78, 760, 170, K.RED, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('FRAUD CALLS IDENTIFIED, 2025', 28, 52); x.font = '700 70px "Chakra Petch"'; x.fillText(fmt(a) + ' CRORE', 28, 132); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('PER TRUECALLER REPORT', 28, 160); }); F.c1.position.set(0, 7.6, 1); gF.add(F.c1);
  F.sw = new THREE.Group(); F.sw.position.set(2.4, 3.4, .6); F.sw.scale.setScalar(.8); var ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .12, 12, 60), M(K.CREAM)); F.sw.add(ring); F.hand = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.3, .1), M(K.RED)); F.hand.geometry.translate(0, .65, 0); F.sw.add(F.hand); gF.add(F.sw);
  F.l1 = e.lab('1.8 MIN PER CALL (AVG)', K.CREAM, .42, { fs: 34 }); F.l1.position.set(2.4, 1.4, 1); gF.add(F.l1);
  F.yr = new THREE.InstancedMesh(new THREE.BoxGeometry(.26, .26, .26), M(K.GOLD), 247); F.yr.frustumCulled = false; gF.add(F.yr);
  F.c2 = e.dyn(.74, 820, 160, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('BLOCKING SAVES 21.7 LAKH HOURS / DAY', 28, 50); x.font = '700 62px "Chakra Petch"'; x.fillText('≈ ' + Math.round(247 * a) + ' YEARS / DAY', 28, 124); x.fillStyle = '#7a4a10'; x.font = '600 22px "DM Mono"'; x.fillText('÷ 8,766 H/YEAR · OUR ARITHMETIC', 28, 150); }); F.c2.position.set(0, 10.2, 1); gF.add(F.c2); })();
SCN[4] = function (t) { var g = gF; g.visible = true; B.bgc(.01); var t1 = S0('f1'), t2 = S0('f2'), t3 = S0('f3'), L = S1('f1') - t1;
  F.sg.forEach(function (s, i) { var a = t1 + .3 + i * L * .28; s.visible = t > a && t < a + L * .28; s.scale.setScalar(eo3((t - a) * 4) + .01); }); F.fr.userData.head.rotation.z = .12 * Math.sin(t * 4); F.fr.userData.armR.rotation.x = -1.3 + .3 * Math.sin(t * 7);
  F.c1.draw(770 * sw(t2, t2 + 1.2, t)); put(F.c1, t, t2, .35); put(F.sw, t, t3, .35); F.hand.rotation.z = -clamp((t - t3) / 3) * 6.283 * 1.8 / 2 * 2 * .0 - (t - t3) * 2.1; put(F.l1, t, t3 + .3, .3);
  var m = new THREE.Matrix4(), u = sw(t3 + 1.0, t3 + 3.2, t), n = Math.floor(u * 247); for (var i = 0; i < 247; i++) { var cx = (i % 19 - 9) * .32 - 2.6, cy = Math.floor(i / 19) * .32 + 2.0 + .0; m.makeTranslation(i < n ? cx : -99, i < n ? cy : -99, 2.2); F.yr.setMatrixAt(i, m); } F.yr.instanceMatrix.needsUpdate = true; F.c2.draw(u); put(F.c2, t, t3 + .8, .35); };
e.shot(4, 'locked on the counter', SC[4], S0('f3') - .2, [0, 5.6, 15], [0, 3.6, 0], 46, [0, 5.6, 15], [0, 3.6, 0], 46, 'io');
e.shot(4, 'rise to the years', S0('f3') - .2, S1('f3') + .3, [0, 5.6, 15], [0, 3.6, 0], 46, [0, 6.8, 16], [0, 5.2, 0], 46, 'io');
/* ===== scene 5: who picks up ===== */
var gU = grp(new THREE.Group()), U = {};
(function () { B.floor(gU, 0, 60); U.un = B.voxel(false, K.CREAM); U.un.position.set(-1.8, 0, 0); U.un.scale.setScalar(1.5); gU.add(U.un); var hair = new THREE.Mesh(new THREE.BoxGeometry(.66, .14, .64), M(0xdddddd)); hair.position.set(0, .34, 0); U.un.userData.head.add(hair);
  U.ph = new THREE.Mesh(new THREE.BoxGeometry(.28, .5, .06), M(0x10183d)); U.ph.position.set(.62, 2.5, .3); U.un.add(U.ph);
  U.sc = B.agent(K.RED); U.sc.position.set(6.0, 0, -1); U.sc.scale.setScalar(1.2); U.sc.rotation.y = -.9; gU.add(U.sc);
  U.cable = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.6) })); gU.add(U.cable);
  U.bub = ['HELLO? HAAN BOLO', 'ARRE BETA, KAUN?', 'AAP KAUN BOL RAHE?'].map(function (tx, i) { var l = e.lab(tx, K.CREAM, .5, { fs: 38 }); l.position.set(-1.8 + (i % 2) * 1.6, 5.6 + i * 1.1, 1); gU.add(l); return l; });
  U.l = e.lab('PAPA PICKS UP. EVERY TIME.', K.GOLD, .56, { fs: 40 }); U.l.position.set(0, 9.6, 1); gU.add(U.l); U.l2 = e.lab('OPINION · NOT A STATISTIC', K.CREAM, .4, { fs: 32 }); U.l2.position.set(0, 1.0, 3.6); gU.add(U.l2); })();
SCN[5] = function (t) { var g = gU, L = S1('d1') - SC[5]; g.visible = true; B.bgc(.012); U.un.userData.head.rotation.z = .08 * Math.sin(t * 2); U.un.userData.armR.rotation.x = -1.2;
  var pa = new V3(-1.2, 2.6, .3), pb = new V3(5.6, 2.4, -.8), d = pb.clone().sub(pa); U.cable.position.copy(pa); U.cable.scale.set(1, d.length(), 1); U.cable.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); U.cable.visible = t > SC[5] + L * .45;
  U.bub.forEach(function (l, i) { put(l, t, SC[5] + .6 + i * L * .17, .35); }); put(U.l, t, SC[5] + L * .5, .35); put(U.l2, t, SC[5] + L * .6, .3); U.sc.userData.armR.rotation.x = -1 + .3 * Math.sin(t * 6); };
e.shot(5, 'locked wide', SC[5], S1('d1') + .3, [1.6, 6.0, 15.5], [1.6, 3.6, 0], 46, [1.6, 6.0, 14.5], [1.6, 3.8, 0], 46, 'io');
/* ===== scene 6: the 18 Sep fix ===== */
var gT = grp(new THREE.Group()), T = {};
(function () { B.floor(gT, 0, 60); T.box = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.6, 3), M(0x2b3678)); T.box.position.set(2.7, 1.8, -1.6); gT.add(T.box); T.bs = B.sign('TELCO\nPLATFORM', '#6a7bff', 3.0, 1.5, 110); T.bs.position.set(2.7, 2.2, .0); gT.add(T.bs);
  T.rep = []; for (var i = 0; i < 8; i++) { var c = B.card('', '', '', {}); c.scale.setScalar(.35); gT.add(c); T.rep.push(c); }
  T.app = B.phone(B.callScreen('FLAGGED', 'SPAM · USER REPORT', '#ff4d5e')); T.app.scale.setScalar(.5); T.app.position.set(-3.2, 2.6, 0); gT.add(T.app);
  T.l1 = e.lab('APPS MUST SHARE USER SPAM REPORTS', K.GREEN, .5, { fs: 34 }); T.l1.position.set(0, 7.8, 0); gT.add(T.l1);
  T.bar = new THREE.Group(); T.bar.position.set(-.6, 0, 2.4); var post = new THREE.Mesh(new THREE.BoxGeometry(.4, 3, .4), M(K.CREAM)); post.position.set(-1.4, 1.5, 0); T.bar.add(post); T.arm = new THREE.Mesh(new THREE.BoxGeometry(3, .2, .2), M(K.RED)); T.arm.geometry.translate(1.5, 0, 0); T.arm.position.set(-1.4, 3.0, 0); T.bar.add(T.arm); gT.add(T.bar);
  T.rb = B.voxel(false, K.GOLD); T.rb.scale.setScalar(.7); gT.add(T.rb); var ant = new THREE.Mesh(new THREE.BoxGeometry(.06, .5, .06), M(K.RED)); ant.position.set(0, .5, 0); T.rb.userData.head.add(ant);
  T.pr = e.dyn(.7, 700, 150, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('UNDECLARED ROBOCALL = SPAM', 24, 46); x.font = '700 60px "Chakra Petch"'; x.fillText('≤ 5 PAISE / MIN', 24, 120); }); T.pr.position.set(-.4, 5.4, 2.4); gT.add(T.pr);
  T.q = B.sign('?', '#f4ecd8', 2, 2, 260); T.q.position.set(1.6, 4.2, 3.0); gT.add(T.q); T.td = e.lab('TRUECALLER CALLS IT ANTI-COMPETITIVE', K.RED, .44, { fs: 32 }); T.td.position.set(0, 9.0, 0); gT.add(T.td); })();
SCN[6] = function (t) { var g = gT, t1 = S0('x1'), t2 = S0('x2'), t3 = S0('x3'), t4 = S0('x4'); g.visible = true; B.bgc(.012); put(T.l1, t, t1 + .4, .35);
  T.rep.forEach(function (c, i) { var a = t1 + .8 + i * .35, u = clamp((t - a) / 1.0); c.visible = u > 0 && u < 1; c.position.set(lerp(-2.8, 2.4, eo3(u)), lerp(2.6, 2.4, u) + 1.4 * Math.sin(u * 3.14), 1.0); c.rotation.z = .5 * Math.sin(u * 6); });
  put(T.pr, t, t3, .4); var arm = sw(t3 + .6, t3 + 1.6, t) * 1.2; T.arm.rotation.z = arm; var ru = clamp((t - t2 + .4) / 2.4); T.rb.visible = t > t2 - .4; T.rb.position.set(lerp(-6, 6, ru), .1, 3.6); T.rb.rotation.y = Math.PI / 2; T.rb.userData.armR.rotation.x = Math.sin(t * 7) * .4;
  put(T.q, t, t4, .4); T.q.rotation.z = .1 * Math.sin(t * 3); put(T.td, t, t4 + 1.2, .35); };
e.shot(6, 'truck from the app to the platform', SC[6], S0('x3') - .3, [0, 5.8, 17], [0, 3.0, 0], 46, [0, 5.8, 17], [0, 3.0, 0], 46, 'io');
e.shot(6, 'pull to the toll booth', S0('x3') - .3, S1('x4') + .3, [0, 5.8, 17], [0, 3.0, 0], 46, [0, 5.4, 14.5], [0, 3.2, 1], 44, 'io');
/* ===== scene 7: the toast ===== */
var gZ = grp(new THREE.Group()), Z = {};
(function () { B.floor(gZ, 0, 40); var scr = B.callScreen('UNKNOWN', '+91 ·····  · DECLARED', '#3de0a8'); Z.ph = B.phone(scr); Z.ph.position.set(0, 4.3, 0); Z.ph.scale.setScalar(.95); gZ.add(Z.ph);
  Z.tag = B.stamp('DECLARED', '#3de0a8', 4.6, 1.5, 110); gZ.add(Z.tag); Z.l = e.lab('AB LOAN KO BHI DECLARE KARNA PADEGA', K.GREEN, .5, { fs: 34 }); Z.l.position.set(0, 9.4, 1); gZ.add(Z.l);
  Z.rings = [0, 1, 2].map(function () { var r = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(1.6), transparent: true, depthWrite: false })); r.position.set(0, 4.3, .8); gZ.add(r); return r; }); })();
SCN[7] = function (t) { var g = gZ, L = S1('c1') - SC[7]; g.visible = true; B.bgc(.012); Z.rings.forEach(function (r, i) { var u = ((t * .7 + i / 3) % 1); r.scale.setScalar(.8 + u * 3.6); r.material.opacity = (1 - u) * .7; }); B.slam(Z.tag, clamp((t - SC[7] - L * .5) / .8), 9, 4.4, 1); Z.tag.position.z = 1.2; Z.tag.rotation.z = -.12; put(Z.l, t, SC[7] + .5, .35); };
e.shot(7, 'pull back from the phone', SC[7], S0('cta') - .3, [0, 5.2, 12], [0, 4.4, 0], 42, [0, 6.0, 20], [0, 2.6, 0], 44, 'io');
e.shot(7, 'hold for the end card', S0('cta') - .3, S0('cta') + 30, [0, 6.0, 20], [0, 2.6, 0], 44, [0, 6.0, 20], [0, 2.6, 0], 44, 'io');
})();
