/* scenes C (42-camera capture floor), D (Jatayu: entirely CG vs two live actors), E (the ledger), F (back to free light + end) */
(function () {
var V = window.V, W = V.W, H = V.H, V3 = V.V3, clamp = V.clamp, lerp = V.lerp, eio = V.eio, eo3 = V.eo3, ramp = V.ramp, eob = V.eob;
var ICE = V.ICE, EMB = V.EMB, VIO = V.VIO, MINT = V.MINT, ROSE = V.ROSE, ST = V.ST, SE = V.SE, CW = V.CW, mkScan = V.mkScan, U = V.U, lineMat = V.lineMat, surfMat = V.surfMat, circ = V.circ, lines = V.lines, shk = V.shk;

/* ================= scene C: 42 capture cameras, then three characters captured ================= */
var C = V.newScene('C', 3, 36, mkScan(0, new V3(0, 1, 0), null, .35)), scC = C.scan, SC = C.S, CC = C.C;
var fP = []; [1.5, 3, 4.5, 6, 7.5].forEach(function (r) { fP = fP.concat(circ(r, 96, 0)); }); var spP = []; for (var sp = 0; sp < 24; sp++) { var an = sp / 24 * 6.2832; spP.push(0, 0, 0, 7.5 * Math.cos(an), 0, 7.5 * Math.sin(an)); }
SC.add(lines(fP, lineMat(scC, ICE, .18))); SC.add(lines(spP, lineMat(scC, MINT, .16)));
var t42 = CW('s6', '42'), tKum = CW('s7', 'kumbhakarna'), tHan = CW('s7', 'hanuman'), tAsu = CW('s7', 'asur'), tCap = CW('s7', 'capture');
var cones = [], CT = new V3(0, 1.3, 0);
(function () { var tiers = [.55, 1.9, 3.3], per = 14, cg = new THREE.ConeGeometry(.17, .5, 12).rotateX(-Math.PI / 2);
  for (var ti = 0; ti < 3; ti++) for (var i = 0; i < per; i++) { var a = (i + (ti % 2) * .5) / per * 6.2832, r = 6.3 - ti * .35, idx = ti * per + i;
    var mat = surfMat(scC, ICE.clone().multiplyScalar(.7), VIO), m = new THREE.Mesh(cg, mat); m.position.set(r * Math.cos(a), tiers[ti], r * Math.sin(a)); m.lookAt(CT); SC.add(m);
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(cg), lineMat(scC, ICE, .7)); e.position.copy(m.position); e.quaternion.copy(m.quaternion); e.renderOrder = 5; SC.add(e);
    var fl = lineMat(scC, VIO, 0); var fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute([m.position.x, m.position.y, m.position.z, CT.x, CT.y, CT.z], 3)); var fline = new THREE.LineSegments(fg, fl); fline.frustumCulled = false; fline.renderOrder = 5; SC.add(fline);
    cones.push({ m: m, mat: mat, fl: fl, t: t42 + idx * .045, idx: idx }); } })();
var actor = V.mkRig(scC, SC, { s: 1 });
var caps = [V.mkRig(scC, SC, { s: 1.9, wide: 1.5, col: VIO, rim: VIO, gcol: VIO, ghosts: 3 }), V.mkRig(scC, SC, { s: 1.05, tail: true, col: VIO, rim: VIO, gcol: VIO, ghosts: 4 }), V.mkRig(scC, SC, { s: 1.3, horns: true, wide: 1.2, col: VIO, rim: VIO, gcol: VIO, ghosts: 3 })];
var capT = [tKum, tHan, tAsu], capKind = ['stomp', 'leap', 'walk'], capAng = [0, 2.1, 4.2], capRad = 2.8;
V.labIn(C, { html: '<div class="tag v">Motion-capture floor</div><div class="big v"><span>0</span></div><div class=tag style="margin-top:2px">infrared cameras · about</div><div class=src style="margin-top:8px">Cinematographer Pankaj Kumar<br>THR India · reported</div>', t0: t42 - .3, px: [162, 250] });
V.labIn(C, { html: '<div class="src r">Illustration · voxel stand-ins<br>not the film’s footage</div>', t0: C.t0 + 1.2, px: [162, 1210] });
var cl = [V.labIn(C, { html: '<div class="tag v">▸ Kumbhakarna · captured</div>', t0: tKum, px: [162, 1000] }), V.labIn(C, { html: '<div class="tag v">▸ Hanuman · captured</div>', t0: tHan, px: [162, 1060] }), V.labIn(C, { html: '<div class="tag v">▸ Asur · captured</div>', t0: tAsu, px: [162, 1120] })];
var mark = lines((function () { var p = circ(.5, 40, .02); return p; })(), lineMat(scC, EMB, 1)); mark.visible = false; SC.add(mark);
C.upd = function (t, tl, dur) {
  var a = ramp(tl, 0, dur * .3), b = ramp(tl, dur * .3, dur * .58), c = ramp(t, tKum - .2, C.t1), ea = 1 - Math.pow(1 - a, 3), eb = eio(b), ec = eio(c);
  var az = lerp(.35, 2.6, ea) + .9 * eb + 1.4 * ec, r = lerp(lerp(15, 12, ea), 4.6, eb); r = lerp(r, 13.5, ec); var y = lerp(lerp(4.4, 2.4, ea), 1.5, eb); y = lerp(y, 5.6, ec);
  CC.fov = lerp(lerp(34, 46, eb), 40, ec); var sk = shk(t, .06 * eb * (1 - ec), 19);
  var th = tl * .9; var ax = 1.25 * Math.cos(th), az2 = 1.25 * Math.sin(th);
  CC.position.set(r * Math.cos(az) + sk[0], y + sk[1], r * Math.sin(az) + sk[2]); CC.up.set(0, 1, 0);
  CC.lookAt(lerp(0, ax * .85, eb * (1 - ec)), lerp(1.2, 1.1, ec), lerp(0, az2 * .85, eb * (1 - ec))); CC.rotateZ(.22 * eb * (1 - ec) + sk[2] * .2); CC.updateProjectionMatrix(); CC.updateMatrixWorld(true);
  scC.uS.value = -1 + 9 * (1 - Math.pow(1 - ramp(tl, .0, 1.7), 3)) + .25 * Math.max(0, tl - 1.7);
  var litN = 0; cones.forEach(function (cn) { var u = ramp(t, cn.t, cn.t + .25), lit = u > 0; if (lit) litN++; cn.mat.uniforms.uLit.value = .5 + 1.2 * Math.exp(-(t - cn.t) * 2.2) * (lit ? 1 : 0); cn.mat.uniforms.uCol.value.copy(lit ? VIO : ICE).multiplyScalar(.5); cn.fl.uniforms.uBase.value = lit ? .22 * u : 0; });
  C.labs[0].in.querySelector('span').textContent = litN;
  var actAlive = t < tKum;
  actor.root.visible = actAlive; actor.ghosts.forEach(function (g) { g.arr.forEach(function (l) { l.visible = actAlive; }); });
  V.rigGhosts(actor, function (k) { V.poseRig(actor, 1.25 * Math.cos((tl - (k + 1) * .17) * .9), 1.25 * Math.sin((tl - (k + 1) * .17) * .9), -(tl - (k + 1) * .17) * .9 + Math.PI, (tl - (k + 1) * .17) * 5.2, 'walk'); });
  V.poseRig(actor, ax, az2, -th + Math.PI, tl * 5.2, 'walk');
  caps.forEach(function (c2, i) { var u = ramp(t, capT[i], capT[i] + .5), on = u > 0, ang = capAng[i] + (t - capT[i]) * .25, cx = capRad * Math.cos(ang), cz = capRad * Math.sin(ang);
    c2.root.visible = on; c2.ghosts.forEach(function (g) { g.arr.forEach(function (l) { l.visible = on; }); });
    var tt = Math.max(0, t - capT[i]); V.rigGhosts(c2, function (k) { var q = tt - (k + 1) * .17; V.poseRig(c2, capRad * Math.cos(capAng[i] + q * .25), capRad * Math.sin(capAng[i] + q * .25), -(capAng[i] + q * .25) + Math.PI, q * 4.2, capKind[i]); });
    V.poseRig(c2, cx, cz, -ang + Math.PI, tt * 4.2, capKind[i]); c2.root.scale.setScalar(c2.s * eob(u)); });
};

/* ================= scene D: Jatayu — entirely CG vs two live actors ================= */
var D = V.newScene('D', 4, 36, mkScan(1, null, new V3(0, 2.5, 0), .5)), scD = D.scan, SD = D.S, CD = D.C;
var tJat = CW('s8', 'jatayu'), tPoori = CW('s8', 'poori'), tDo = CW('s8', 'sirf'), tYash = CW('s8', 'yash'), tSai = CW('s8', 'sai'), tPankh = CW('s9', 'pankh'), tChh = CW('s9', 'chhaya'), tKir = CW('s9', 'kiran'), tGan = CW('s9', 'ganit');
(function () { var p = []; for (var i = -9; i <= 9; i++) p.push(i, 0, -9, i, 0, 9, -9, 0, i, 9, 0, i); SD.add(lines(p, lineMat(scD, ICE, .1))); [2, 4, 6, 8].forEach(function (r) { SD.add(lines(circ(r, 80, .01), lineMat(scD, MINT, .14))); }); })();
var bird = new THREE.Group(), body = new THREE.Group(); bird.add(body); SD.add(bird);
(function () { /* body: lat/long wire ellipsoid; head, beak; neck ruff */
  function ell(a, b, c, nl, nm) { var P = []; for (var i = 0; i < nl; i++) { var ph = i / nl * Math.PI * 2; for (var j = 0; j < nm; j++) { var th1 = j / nm * Math.PI - Math.PI / 2, th2 = (j + 1) / nm * Math.PI - Math.PI / 2; P.push(a * Math.cos(th1) * Math.cos(ph), b * Math.sin(th1), c * Math.cos(th1) * Math.sin(ph), a * Math.cos(th2) * Math.cos(ph), b * Math.sin(th2), c * Math.cos(th2) * Math.sin(ph)); } }
    for (var j2 = 1; j2 < nm; j2++) { var th = j2 / nm * Math.PI - Math.PI / 2; for (var i2 = 0; i2 < 40; i2++) { var q1 = i2 / 40 * 6.2832, q2 = (i2 + 1) / 40 * 6.2832; P.push(a * Math.cos(th) * Math.cos(q1), b * Math.sin(th), c * Math.cos(th) * Math.sin(q1), a * Math.cos(th) * Math.cos(q2), b * Math.sin(th), c * Math.cos(th) * Math.sin(q2)); } } return P; }
  var bm = lineMat(scD, VIO, 1.8); body.add(lines(ell(1.9, .7, .6, 12, 8), bm));
  var head = lines(ell(.38, .32, .3, 8, 6), bm); head.position.set(2.15, .35, 0); body.add(head);
  var neck = lines([1.5, .2, 0, 2.0, .35, 0, 1.5, .3, .3, 2.0, .4, .2, 1.5, .3, -.3, 2.0, .4, -.2], bm); body.add(neck);
  body.add(lines([2.5, .3, 0, 2.95, .1, 0, 2.5, .4, 0, 2.95, .1, 0, 2.5, .35, .1, 2.95, .1, 0, 2.5, .35, -.1, 2.95, .1, 0], lineMat(scD, EMB, 1)));
  var tail = []; for (var k = 0; k < 9; k++) { var z = (k - 4) * .12; tail.push(-1.8, 0, z, -3.1 - Math.abs(k - 4) * .02, .05, z * 1.8); } body.add(lines(tail, bm)); })();
var wings = [], fMat = lineMat(scD, VIO, 1.9), fMatHot = lineMat(scD, EMB, 2.3);
(function () { [1, -1].forEach(function (sg) { var wg = new THREE.Group(); wg.position.set(.3, .3, 0); body.add(wg); var P = [], PH = [], n = 16;
  for (var i = 0; i < n; i++) { var f = i / (n - 1), len = 2.0 + 2.6 * Math.sin(f * 2.4 + .2), sw = -1.4 + f * 2.6, x0 = sw * .5, z0 = sg * (.35 + f * 1.2), x1 = sw * .5 - 1.3 - f * .7 + (i % 2) * .15, z1 = sg * (z0 * sg + len * .78);
    var tgt = (i % 3 === 0) ? PH : P; tgt.push(x0, .02, z0, x1, -.18 - f * .25, z1); tgt.push(x0 + .06, .02, z0, x1 + .12, -.18 - f * .25, z1 - sg * .15); /* feather edge */
    if (i > 0) { P.push(x1, -.18 - f * .25, z1, wings.__px || x1, wings.__py || -.2, wings.__pz || z1); } wings.__px = x1; wings.__py = -.18 - f * .25; wings.__pz = z1; }
  wg.add(lines(P, fMat)); wg.add(lines(PH, fMatHot)); wings.push({ g: wg, sg: sg }); }); })();
bird.position.set(0, 3.4, 0);
var rayBeam = null, rayM = lineMat(scD, ICE, 0); rayM.uniforms.uAmt.value = 4.2;
(function () { var ls = []; for (var i = 0; i < 34; i++) { var x = -3 + V.hash(i) * 6, z = -3.5 + V.hash(i + 77) * 7, y = 4.5 + (V.hash(i + 5) - .5) * 1.4; ls.push([[x - 6, y + 9, z + 4], [x, y, z], i * .35]); } rayBeam = V.segs(ls, rayM); SD.add(rayBeam); })();
var shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 40).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: U(scD, { uA: 0 }), vertexShader: 'varying vec3 vP,vL;void main(){vL=position;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}', fragmentShader: V.SC_GLSL + 'varying vec3 vL;uniform float uA;void main(){float d=scanD();if(d<0.)discard;float r=length(vL.xz);gl_FragColor=vec4(vec3(.62,.5,1.)*(1.-smoothstep(.3,1.,r))*uA*.7,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); shadow.position.y = .03; SD.add(shadow);
var act2 = [V.mkRig(scD, SD, { s: 1, ghosts: 3 }), V.mkRig(scD, SD, { s: 1, col: MINT, rim: MINT, ghosts: 3, gcol: MINT })];
var tags = ['LIVE', 'LIVE'];
var ld0 = V.labIn(D, { html: '<div class="tag v">Jatayu · entirely CG</div><div class=src>Pankaj Kumar · THR India · reported</div>', t0: tJat + .1, t1: tDo + 3, px: [162, 250] });
var ld1 = V.labIn(D, { html: '<div class="tag m">Live actors in the scene</div><div class="big m" style="color:#7ff0c0"><span>0</span></div><div class=src>Yash · Sai Pallavi</div>', t0: tDo, px: [162, 340] });
var ldY = V.labIn(D, { html: '<div class="tag">Yash</div>', t0: tYash, anchor: new V3(-2.0, 2.1, 3.0), dx: -30 }), ldS = V.labIn(D, { html: '<div class="tag m">Sai Pallavi</div>', t0: tSai, anchor: new V3(2.0, 2.1, 3.0), dx: -40 });
var ld2 = V.labIn(D, { html: '<div class="tag e">Every feather · every shadow · every ray</div><div class=src>→ computed, not filmed</div>', t0: tPankh, px: [162, 1180] });
D.upd = function (t, tl, dur) {
  var a = ramp(tl, 0, dur * .45), b = ramp(tl, dur * .45, dur), ea = eio(a), eb = eio(b), sk = shk(t, .035 * ramp(t, tPankh, tGan + 1), 21);
  CD.fov = lerp(34, 44, ea); CD.updateProjectionMatrix();
  var az = lerp(.1, .4, ea) + lerp(0, .25, eb), r = lerp(lerp(21, 18, ea), 15.5, eb), y = lerp(lerp(1.2, 3.0, ea), 5.0, eb);
  CD.position.set(r * Math.sin(az) + sk[0], y + sk[1], r * Math.cos(az) + sk[2]); CD.up.set(0, 1, 0); CD.lookAt(0, lerp(3.2, 2.6, eb), 0); CD.rotateZ(lerp(.1, -.08, ea) + sk[2] * .2); CD.updateMatrixWorld(true);
  scD.uS.value = 28 * Math.pow(clamp((tl + .3) / 2.4), .8) - 4;
  var u = ramp(t, tJat - .4, tJat + 1.4); bird.visible = u > 0; bird.scale.setScalar(.3 + .75 * eob(u)); bird.position.y = 3.4 + .3 * Math.sin(t * 1.4); bird.rotation.y = -Math.PI / 2 + .5 + .25 * Math.sin(t * .3); bird.rotation.z = .08 * Math.sin(t * 1.1);
  var fl = Math.sin(t * 3.2); wings.forEach(function (w) { w.g.rotation.x = w.sg * (.35 + .5 * fl); w.g.rotation.y = w.sg * .12 * Math.cos(t * 3.2); });
  fMat.uniforms.uBase.value = 1.9; fMatHot.uniforms.uPulse.value = (t * 8) % 20 - 2; fMatHot.uniforms.uAmt.value = 3;
  var ru = ramp(t, tPankh - .2, tPankh + .6); rayM.uniforms.uBase.value = .5 * ru; rayM.uniforms.uPulse.value = (t * 9) % 30 - 3; rayBeam.visible = ru > 0;
  shadow.material.uniforms.uA.value = ramp(t, tChh - .2, tChh + .6) * .8 + .1 * ramp(t, tJat, tJat + 1); shadow.scale.set(2.6 + .4 * fl, 1, 1.5 + .2 * fl); shadow.position.set(.3 * Math.sin(t * .3) , .03, 0);
  [[-2.0, 3.0, tYash], [2.0, 3.0, tSai]].forEach(function (p, i) { var rg = act2[i], uu = ramp(t, p[2] - .2, p[2] + .5); rg.root.visible = uu > 0; rg.ghosts.forEach(function (g) { g.arr.forEach(function (l) { l.visible = uu > 0; }); });
    V.rigGhosts(rg, function (k) { V.poseRig(rg, p[0], p[1], i ? -.4 : .4, (t - (k + 1) * .17) * 1.4 + i, 'idle'); }); V.poseRig(rg, p[0], p[1], i ? -.4 : .4, t * 1.4 + i, 'idle'); rg.root.scale.setScalar(eob(uu)); });
  ld1.in.querySelector('span').textContent = Math.round(2 * eo3(ramp(t, tDo, tDo + .8)));
};

/* ================= scene E: the ledger — what is public, what is not (rows along x, top-down camera) ================= */
var E = V.newScene('E', 5, 50, mkScan(0, new V3(1, 0, 0), null, .4)), scE = E.scan, SE_ = E.S, CE = E.C;
var tRen = CW('s10', 'render'), tPart = CW('s10b', 'part'), tTwo = CW('s10b', 'hisson'), tGap = CW('s10b', 'crore', 1);
var LX = -2.3, SCL = 4.6 / 4000, ZR = [-5.2, -3.0, -.8, 1.5], ZG = 3.1;
(function () { var p = []; for (var i = 0; i <= 8; i++) p.push(LX + i * .575, 0, -5.4, LX + i * .575, 0, 2.9); for (var j = 0; j <= 10; j++) p.push(LX, 0, -5.4 + j * .83, LX + 4.6, 0, -5.4 + j * .83); SE_.add(lines(p, lineMat(scE, ICE, .1)));
  for (var q = 0; q <= 4; q++) { var xx = LX + q * 1.15; SE_.add(lines([xx, .01, -5.7, xx, .01, 2.9], lineMat(scE, ICE, .38))); } })();
function hbox(z, len, col, rim, h) { var b = V.edgeBox(scE, SE_, len, h || .5, .8, col, rim, new V3(LX + len / 2, (h || .5) / 2, z)); b.len = len; b.z = z; return b; }
function dashRow(z) { var p = []; for (var x = LX; x < LX + 4.6; x += .5) { p.push(x, .3, z - .35, Math.min(x + .28, LX + 4.6), .3, z - .35, x, .3, z + .35, Math.min(x + .28, LX + 4.6), .3, z + .35); } var l = lines(p, lineMat(scE, ROSE, .95)); SE_.add(l); return l; }
var rowRen = dashRow(ZR[0]), rowPow = dashRow(ZR[1]);
var barP1 = hbox(ZR[2], 900 * SCL, EMB.clone().multiplyScalar(.8), EMB), barP1b = hbox(ZR[2], 65 * SCL, ROSE.clone().multiplyScalar(.9), ROSE), barBoth = hbox(ZR[3], 4000 * SCL, VIO.clone().multiplyScalar(.7), VIO);
barP1b.base = LX + 835 * SCL; barP1.base = LX; barBoth.base = LX;
var gx0 = LX + 900 * SCL, gx1 = LX + 4000 * SCL;
var gapLine = lines([gx0, .2, ZG, gx1, .2, ZG, gx0, .2, ZG - .25, gx0, .2, ZG + .25, gx1, .2, ZG - .25, gx1, .2, ZG + .25], lineMat(scE, MINT, 1.2)); SE_.add(gapLine);
var curs = lines([0, .02, -5.7, 0, .02, 2.9], lineMat(scE, MINT, 1)); SE_.add(curs);
var pingE = V.pingMesh(SE_, new THREE.Color(.62, .5, 1));
function rowLab(z, html, t0, dx) { return V.labIn(E, { html: html, t0: t0, anchor: new V3(LX + 1.4, .6, z - .1), dx: dx || 0 }); }
var le = [rowLab(ZR[0], '<div class="tag r">Render hours · electricity</div><div class="big r" style="font-size:50px">NOT PUBLIC</div>', tRen - .1),
  rowLab(ZR[2], '<div class="tag e">Part 1 · reported range</div><div class="big em" style="font-size:54px"><span>835–900</span><small>CR</small></div>', tPart - .1),
  rowLab(ZR[3], '<div class="tag v">Both parts · makers’ claim</div><div class="big v" style="font-size:54px"><span>≈4,000</span><small>CR</small></div>', tTwo),
  V.labIn(E, { html: '<div class="tag m">Gap: 3,100+ cr · derived</div><div class=src>numbers don’t match · scope unclear</div>', t0: tGap - .1, anchor: new V3(LX + 3.4, .3, ZG + .7), dx: 0 })];
E.upd = function (t, tl, dur) {
  var a = ramp(tl, 0, 2.2), b = ramp(t, tPart - .2, tTwo + 1.4), ea = eio(a), eb = eio(b);
  CE.fov = 50; CE.updateProjectionMatrix(); CE.position.set(lerp(-1.2, 0, ea), lerp(17, 14.5, ea) + .6 * eb, lerp(11, 9, ea)); CE.up.set(0, 1, 0); CE.lookAt(lerp(-.3, 0, ea), 0, -1.0); CE.rotateZ(lerp(.07, 0, ea)); CE.updateMatrixWorld(true);
  scE.uS.value = -6 + 16 * Math.pow(clamp((tl + .3) / 2.4), .8) + 2;
  var g1 = eob(ramp(t, tPart - .1, tPart + 1.1)), g2 = eob(ramp(t, tTwo - .1, tTwo + 1.6));
  [[barP1, g1], [barP1b, g1], [barBoth, g2]].forEach(function (p) { var b2 = p[0], g = Math.max(.001, p[1]); b2.m.scale.x = g; b2.e.scale.x = g; b2.m.position.x = b2.base + b2.len / 2 * g; b2.e.position.x = b2.m.position.x; });
  gapLine.visible = t > tGap - .2; rowRen.visible = t > tRen - .2; rowPow.visible = t > tRen + .5;
  curs.visible = t > tPart; curs.position.x = (t < tTwo ? 900 : 900 + 3100 * eo3(ramp(t, tTwo, tTwo + 1.6))) * SCL;
  var pp = ((t - tGap) % 2) / 2; pingE.uniforms.uR.value = 14 * pp; pingE.uniforms.uA.value = t > tGap ? (1 - pp) * .7 : 0;
};

/* ================= scene F: back to free light, the end card ================= */
var F = V.newScene('F', 6, 34, mkScan(1, null, new V3(0, 3, -2), .55)), scF = F.scan, SF = F.S, CF = F.C;
var tTul = ST('s11'), tMuft = CW('s11b', 'muft'), tEnd = ST('s12') - .05; V.tEnd = tEnd;
(function () { var p = []; for (var i = -7; i <= 7; i++) { p.push(i, 0, -3, i, 10, -3); } for (var j = 0; j <= 10; j++) p.push(-7, j, -3, 7, j, -3); for (var k = -7; k <= 7; k++) p.push(k, 0, -3, k, 0, 16); SF.add(lines(p, lineMat(scF, ICE, .13))); })();
var beamF = (function () { var SUN = new V3(-11, 13, 8), ls = []; for (var bi = 0; bi < 30; bi++) { var gx = -2.8 + (bi % 6) * .9, gy = 2.6 + Math.floor(bi / 6) * .9; ls.push([[SUN.x, SUN.y, SUN.z], [gx, gy, -3], bi * .3]); } var m = lineMat(scF, ICE, .7); m.uniforms.uAmt.value = 3.4; var l = V.segs(ls, m); l.userData.m = m; SF.add(l); var sb = new THREE.Mesh(new THREE.SphereGeometry(.9, 24, 18), new THREE.MeshBasicMaterial({ color: 0xfff1c8 })); sb.position.copy(SUN); SF.add(sb); return l; })();
var patchF = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), new THREE.ShaderMaterial({ uniforms: U(scF, { uA: 0 }), vertexShader: 'varying vec3 vP,vL;void main(){vL=position;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: V.SC_GLSL + 'varying vec3 vL;uniform float uA;void main(){float d=scanD();if(d<0.)discard;vec2 q=vL.xy/vec2(3.,2.5);float m=max(abs(q.x),abs(q.y));float f=(1.-smoothstep(.8,1.,m))*(1.-.9*(step(abs(q.x),.03)+step(abs(q.y),.03)));gl_FragColor=vec4(vec3(.7,.9,1.)*f*uA*.32,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); patchF.position.set(0, 4.4, -2.95); SF.add(patchF);
var echoBars = [V.edgeBox(scF, SF, 1.0, 2.46, 1.0, ICE.clone().multiplyScalar(.5), ICE, new V3(-5.2, 1.23, -1.5)), V.edgeBox(scF, SF, 1.0, 3.6, 1.0, EMB.clone().multiplyScalar(.5), EMB, new V3(-3.6, 1.8, -1.5))];
var pingF = V.pingMesh(SF); pingF.uniforms.uCol.value.set(.9, .95, 1);
var motesF = V.glowPoints(scF, (function () { var p = []; for (var i = 0; i < 120; i++) p.push((V.hash(i + 3) - .5) * 14, 1 + V.hash(i + 61) * 8, -2.5 + V.hash(i + 9) * 9); return p; })(), ICE, 8); SF.add(motesF);
V.labIn(F, { html: '<div class="tag r">An incomplete comparison</div><div class=src>a mission vs a film · different scope</div>', t0: tTul + .3, t1: tEnd, px: [162, 250] });
var lfm = V.labIn(F, { html: '<div class=tag>Sunlight · the real world</div><div class=big><span>₹0</span></div><div class=src>per ray · every day</div>', t0: tMuft - .3, t1: tEnd, px: [162, 400] });
F.endOnly = true;
F.upd = function (t, tl, dur) {
  var a = ramp(t, F.t0, tMuft - .2), b = ramp(t, tMuft - .2, tEnd + 1), c = ramp(t, tEnd, tEnd + 1.2), ea = eio(a), eb = eio(b), ec = eio(c);
  CF.fov = lerp(36, 42, eb); CF.updateProjectionMatrix(); CF.position.set(lerp(lerp(7, 4, ea), 0, eb), lerp(lerp(3.6, 4.2, ea), 8, eb), lerp(lerp(22, 20, ea), 28, eb)); CF.up.set(0, 1, 0); CF.lookAt(lerp(-.2, 0, ea), lerp(3.4, 4.2, eb), -1); CF.rotateZ(lerp(.1, 0, eb)); CF.updateMatrixWorld(true);
  scF.uS.value = 34 * Math.pow(clamp((tl + .3) / 2.4), .8) - 4;
  beamF.userData.m.uniforms.uPulse.value = (t * 7) % 40 - 4; var sw = .55 + .45 * Math.sin(t * 1.2); patchF.material.uniforms.uA.value = ((.2 + .25 * sw) * ramp(tl, .2, 1.2) + .35 * ramp(t, tMuft, tMuft + .6)) * (1 - .8 * ec);
  echoBars.forEach(function (eb2, i) { var g = 1 - .5 * ramp(t, tTul + .3, tTul + 1.8); eb2.m.scale.setScalar(g); eb2.e.scale.setScalar(g); });
  var pp = ((t - tMuft) % 2.4) / 2.4; pingF.uniforms.uR.value = 18 * pp; pingF.uniforms.uA.value = t > tMuft ? (1 - pp) * (1 - ec * .6) : 0;
  var ma = motesF.userData.a; for (var i = 0; i < ma.length; i++) ma[i] = .3 + .7 * Math.abs(Math.sin(t * (.5 + V.hash(i + 3) * 1.1) + i)); motesF.geometry.attributes.aA.needsUpdate = true;
  V.fade = 1 - .55 * ec;
};
})();
