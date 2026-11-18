/* scenes A (hook: two bars), R (free light + rays as questions), B (light bent by a mass) — shared helpers first */
(function () {
var V = window.V, W = V.W, H = V.H, V3 = V.V3, clamp = V.clamp, lerp = V.lerp, eio = V.eio, eo3 = V.eo3, ramp = V.ramp, eob = V.eob;
var ICE = V.ICE, EMB = V.EMB, VIO = V.VIO, MINT = V.MINT, ROSE = V.ROSE, ST = V.ST, SE = V.SE, CW = V.CW, ev = V.ev, mkScan = V.mkScan, U = V.U, lineMat = V.lineMat, surfMat = V.surfMat, circ = V.circ, lines = V.lines, shk = V.shk;
/* scene boundaries (a little before each next sentence so the scan wipe sits in the pause) */
V.BND = [0, ST('s2') - .25, ST('s4') - .25, ST('s6') - .25, ST('s8') - .25, ST('s10') - .25, ST('s11') - .25, V.DUR];
V.scenes = [];
V.newScene = function (id, i, fov, scanArgs) { var o = { id: id, i: i, S: new THREE.Scene(), C: new THREE.PerspectiveCamera(fov, W / H, .1, 300), t0: V.BND[i], t1: V.BND[i + 1], labs: [] }; o.scan = scanArgs; V.scenes[i] = o; return o; };
V.labIn = function (sc, o) { o.sc = sc; sc.labs.push(V.lab(o)); return o; };
/* a polyline with an arc-length attribute (pulse travel) */
V.poly = function (pts, off) { var pos = [], as = [], s = off || 0; for (var i = 0; i < pts.length; i++) { if (i > 0) { var a = pts[i - 1], b = pts[i]; s += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); } pos.push(pts[i][0], pts[i][1], pts[i][2]); as.push(s); }
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(as, 1)); return { g: g, len: s }; };
V.segs = function (list, mat) { /* list of [p0,p1,off] -> LineSegments with aS */ var pos = [], as = []; list.forEach(function (l) { var p0 = l[0], p1 = l[1], o = l[2] || 0, d = Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]); pos.push(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2]); as.push(o, o + d); });
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(as, 1)); var m = new THREE.LineSegments(g, mat); m.frustumCulled = false; m.renderOrder = 5; return m; };
V.edgeBox = function (sc, S, w, h, d, col, rim, pos) { var g = new THREE.BoxGeometry(w, h, d); var m = new THREE.Mesh(g, surfMat(sc, col, rim)); m.position.copy(pos); S.add(m); var e = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineMat(sc, rim, .9)); e.position.copy(pos); e.renderOrder = 5; S.add(e); return { m: m, e: e }; };
V.pingMesh = function (S, col) { var mat = new THREE.ShaderMaterial({ uniforms: { uR: { value: 0 }, uA: { value: 0 }, uCol: { value: col || new THREE.Color(.66, .85, .94) } }, vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);}',
  fragmentShader: 'varying vec3 vP;uniform float uR,uA;uniform vec3 uCol;void main(){float r=length(vP.xz);float f=exp(-pow((r-uR)/.18,2.));gl_FragColor=vec4(uCol*f*uA*1.6,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  var m = new THREE.Mesh(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2), mat); m.position.y = .02; S.add(m); return mat; };
/* voxel performer rig factory: hierarchy + wireframe after-images */
V.mkRig = function (sc, S, o) {
  o = o || {}; var s = o.s || 1, wd = o.wide || 1, root = new THREE.Object3D(), hips = new THREE.Object3D(), parts = []; root.add(hips); root.scale.setScalar(s);
  var col = (o.col || ICE).clone().multiplyScalar(.9), rim = o.rim || ICE;
  function part(par, size, c, piv) { var pv = new THREE.Object3D(); pv.position.set(piv[0], piv[1], piv[2]); par.add(pv); var g = new THREE.BoxGeometry(size[0], size[1], size[2]); var m = new THREE.Mesh(g, surfMat(sc, col, rim)); m.position.set(c[0], c[1], c[2]); pv.add(m); parts.push({ m: m, g: g }); return pv; }
  part(hips, [.5 * wd, .62, .28 * wd], [0, .31, 0], [0, 0, 0]); part(hips, [.26 * wd, .28, .26 * wd], [0, .78, 0], [0, 0, 0]);
  var armL = part(hips, [.16 * wd, .56, .16 * wd], [0, -.28, 0], [-.33 * wd, .58, 0]), armR = part(hips, [.16 * wd, .56, .16 * wd], [0, -.28, 0], [.33 * wd, .58, 0]);
  var legL = part(hips, [.2 * wd, .92, .2 * wd], [0, -.46, 0], [-.14 * wd, 0, 0]), legR = part(hips, [.2 * wd, .92, .2 * wd], [0, -.46, 0], [.14 * wd, 0, 0]);
  if (o.horns) { part(hips, [.07, .2, .07], [-.1, .96, 0], [0, 0, 0]); part(hips, [.07, .2, .07], [.1, .96, 0], [0, 0, 0]); }
  var tail = null; if (o.tail) { tail = part(hips, [.07, .07, .62], [0, 0, -.31], [0, .02, -.16]); }
  S.add(root);
  var ghosts = []; for (var gk = 0; gk < (o.ghosts == null ? 6 : o.ghosts); gk++) { var gm = lineMat(sc, o.gcol || EMB, .55 * (1 - gk / 7)), arr = []; parts.forEach(function (p) { var l = new THREE.LineSegments(new THREE.EdgesGeometry(p.g), gm); l.matrixAutoUpdate = false; l.renderOrder = 5; S.add(l); arr.push(l); }); ghosts.push({ arr: arr, mat: gm }); }
  return { root: root, hips: hips, armL: armL, armR: armR, legL: legL, legR: legR, tail: tail, parts: parts, ghosts: ghosts, s: s };
};
V.poseRig = function (r, x, z, ry, ph, kind) {
  r.root.position.set(x, 0, z); r.root.rotation.y = ry;
  var sw = Math.sin(ph), ab = Math.abs(sw);
  if (kind === 'idle') { r.hips.position.y = .93 + .012 * Math.sin(ph * .5); r.legL.rotation.x = r.legR.rotation.x = 0; r.armL.rotation.x = .1 * Math.sin(ph * .4); r.armR.rotation.x = -.1 * Math.sin(ph * .4); }
  else if (kind === 'leap') { var j = Math.max(0, Math.sin(ph * .5)); r.root.position.y = j * 1.4 * r.s; r.hips.position.y = .93; r.legL.rotation.x = -.9 * j; r.legR.rotation.x = .9 * j; r.armL.rotation.x = -2.4 * j; r.armR.rotation.x = -2.4 * j; }
  else if (kind === 'stomp') { r.hips.position.y = .93 - .05 * ab; r.legL.rotation.x = sw * .5; r.legR.rotation.x = -sw * .5; r.armL.rotation.x = -sw * .8; r.armR.rotation.x = sw * .8; }
  else { r.hips.position.y = .93 + .04 * ab; r.legL.rotation.x = sw * .7; r.legR.rotation.x = -sw * .7; r.armL.rotation.x = -sw * .6; r.armR.rotation.x = sw * .6; }
  if (r.tail) r.tail.rotation.x = .3 + .35 * Math.sin(ph * 1.3);
  r.root.updateMatrixWorld(true);
};
V.rigGhosts = function (r, fn) { for (var k = r.ghosts.length - 1; k >= 0; k--) { fn(k); r.ghosts[k].arr.forEach(function (l, i) { l.matrix.copy(r.parts[i].m.matrixWorld); l.matrixWorldNeedsUpdate = true; }); } };

/* ================= scene A: the hook — two bars ================= */
var A = V.newScene('A', 0, 38, mkScan(0, new V3(0, 1, 0))), scA = A.scan, SA = A.S, CA = A.C;
var HB_L = 3.69, HB_R = 5.01, HB_R2 = 5.4, BX = 2.6, BARS = [];
function barBox(x, h, col, rim) { var b = V.edgeBox(scA, SA, 1.5, h, 1.5, col, rim, new V3(x, h / 2, 0)); BARS.push({ m: b.m, e: b.e, h: h, y0: 0, ta: x < 0 ? 0 : 1 }); }
barBox(-BX, HB_L, ICE.clone().multiplyScalar(.9), ICE); barBox(BX, HB_R, EMB.clone().multiplyScalar(.8), EMB);
(function () { var h = HB_R2 - HB_R, b = V.edgeBox(scA, SA, 1.5, h, 1.5, ROSE.clone().multiplyScalar(.9), ROSE, new V3(BX, HB_R + h / 2, 0)); BARS.push({ m: b.m, e: b.e, h: h, y0: HB_R, ta: 1 }); })();
[2.4, 3.6, 4.8].forEach(function (r) { [-BX, BX].forEach(function (x) { var l = lines(circ(r, 72, .01), lineMat(scA, x < 0 ? ICE : EMB, .22)); l.position.x = x; SA.add(l); }); });
var gP = []; for (var gi = -9; gi <= 9; gi++) gP.push(gi, 0, -9, gi, 0, 9, -9, 0, gi, 9, 0, gi); SA.add(lines(gP, lineMat(scA, ICE, .1)));
var moon = new THREE.Mesh(new THREE.SphereGeometry(.75, 40, 28), surfMat(scA, ICE.clone().multiplyScalar(1.1), ICE, true)); SA.add(moon);
var film = new THREE.Group(); (function () { var fw = 2.5, fh = fw / 2.39, g = new THREE.BoxGeometry(fw, fh, .06); film.add(new THREE.Mesh(g, surfMat(scA, ICE.clone().multiplyScalar(.25), EMB))); var e = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineMat(scA, EMB, 1)); e.renderOrder = 5; film.add(e);
  var perf = []; for (var i = 0; i < 9; i++) { var x = -fw / 2 + (i + .5) * fw / 9; perf.push(x, fh / 2 + .12, .04, x, fh / 2 + .22, .04, x, -fh / 2 - .12, .04, x, -fh / 2 - .22, .04); } film.add(lines(perf, lineMat(scA, EMB, .8))); SA.add(film); })();
var pingA = V.pingMesh(SA);
/* floating coin-rings around the film bar (the bill) and star dust around the moon bar: independent motion */
var coinsA = []; (function () { var g = new THREE.CylinderGeometry(.22, .22, .05, 20); for (var i = 0; i < 12; i++) { var m = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineMat(scA, EMB, .9)); m.renderOrder = 5; SA.add(m); coinsA.push(m); } })();
var dust = V.glowPoints(scA, (function () { var p = []; for (var i = 0; i < 160; i++) p.push((V.hash(i) - .5) * 14, V.hash(i + 99) * 9, (V.hash(i + 7) - .5) * 8); return p; })(), ICE, 9); SA.add(dust);
var tA0 = CW('s1', 'chaand'), tA1 = CW('s1', 'ramayana'), tA2 = CW('s1', 'kyun');
var la1 = V.labIn(A, { html: '<div class=tag>Chandrayaan-3</div><div class=big><span>0</span><small>CR</small></div><div class=src>ISRO chairman’s figure<br>reported · ₹ crore</div>', t0: -.5, anchor: new V3(-BX, HB_L + 3.2, 0), dx: -20 });
var la2 = V.labIn(A, { html: '<div class=tag>Ramayana · Part 1</div><div class="big em"><span></span><small>CR</small></div><div class=src>Trade reports · range<br>reported · ₹ crore</div>', t0: tA1 + .1, anchor: new V3(BX, HB_R2 + 3.2, 0) });
V.labIn(A, { html: '<div class="tag r">Why does a miracle cost more<br>than a moon trip?</div>', t0: tA2 - .2, px: [162, 1190] });
A.upd = function (t, tl, dur) {
  var u = eio(clamp(tl / (dur - .4))), v = eio(ramp(tl, 0, 2.4));
  CA.fov = lerp(26, 38, u); CA.updateProjectionMatrix(); CA.position.set(lerp(-5.5, .5, u), lerp(.9, 6.0, v), lerp(28, 24, u)); CA.up.set(0, 1, 0); CA.lookAt(lerp(-.6, 0, u), lerp(2.0, 3.5, v), 0); CA.rotateZ(lerp(.17, 0, eio(ramp(tl, 0, 3.4)))); CA.updateMatrixWorld(true);
  scA.uS.value = 7 + 9 * (1 - Math.pow(1 - ramp(tl, .0, 1.2), 3)) + .2 * Math.max(0, tl - 1.2);
  var pp = (t % 2.2) / 2.2; pingA.uniforms.uR.value = 16 * pp; pingA.uniforms.uA.value = (1 - pp) * (tl < 2.2 ? 1 : .6);
  var gL = eob(ramp(t, -.6, .7)), gR = eob(ramp(t, tA1 - .2, tA1 + 1.4));
  BARS.forEach(function (b) { var g = Math.max(.001, b.ta < .5 ? gL : gR), y = (b.y0 + b.h / 2) * g; b.m.scale.y = g; b.e.scale.y = g; b.m.position.y = y; b.e.position.y = y; });
  moon.position.set(-BX, HB_L * gL + .85 * Math.min(1, gL), 0); film.position.set(BX, HB_R2 * gR + 1.05 * Math.min(1, gR), 0); moon.rotation.y = t * .5; film.rotation.y = t * 1.1;
  coinsA.forEach(function (c, i) { var a = t * 1.2 + i * .52, r = 1.5 + .35 * Math.sin(t * 2 + i); c.position.set(BX + r * Math.cos(a), HB_R2 * gR * .5 + 1.5 * Math.sin(a * .8 + i) + 1.2, r * Math.sin(a)); c.rotation.set(t * 2 + i, t * 1.5, 0); c.visible = gR > .6; });
  var da = dust.userData.a; for (var i = 0; i < da.length; i++) da[i] = .35 + .65 * Math.abs(Math.sin(t * (.6 + V.hash(i) * 1.2) + i)); dust.geometry.attributes.aA.needsUpdate = true;
  la1.in.querySelector('span').textContent = Math.round(615 * eo3(ramp(t, la1.t0 + .1, la1.t0 + 1.2)));
  var kk = eo3(ramp(t, la2.t0 + .1, la2.t0 + 1.3)); la2.in.querySelector('span').textContent = kk < .01 ? '' : Math.round(835 * kk) + '–' + Math.round(900 * kk);
};

/* ================= scene R: free light, then every ray is a question ================= */
var R = V.newScene('R', 1, 34, mkScan(1, null, new V3(0, 3, 0), .5)), scR = R.scan, SR = R.S, CR = R.C;
var tq0 = CW('s3', 'poochna'), tq1 = CW('s3', 'girti'), tq2 = CW('s3', 'mudti'), tq3 = CW('s3', 'rukti'), tq4 = CW('s3', 'bill');
(function () { /* wall + floor grid */
  var p = []; for (var i = -7; i <= 7; i++) { p.push(i, 0, -3, i, 10, -3); } for (var j = 0; j <= 10; j++) p.push(-7, j, -3, 7, j, -3); for (var k = -7; k <= 7; k++) p.push(k, 0, -3, k, 0, 16, -7, 0, k + 5, 7, 0, k + 5);
  SR.add(lines(p, lineMat(scR, ICE, .13))); })();
var wallPatch = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.6), new THREE.ShaderMaterial({ uniforms: U(scR, { uA: 0 }), vertexShader: 'varying vec3 vP,vL;void main(){vL=position;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: SC_G() + 'varying vec3 vL;uniform float uA;void main(){float d=scanD();if(d<0.)discard;vec2 q=vL.xy/vec2(2.6,2.3);float m=max(abs(q.x),abs(q.y));float f=(1.-smoothstep(.8,1.,m))*(1.-.9*(step(abs(q.x+.02),.035)+step(abs(q.y),.035)));gl_FragColor=vec4(vec3(.62,.85,1.)*f*uA*.32,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
function SC_G() { return V.SC_GLSL; }
wallPatch.position.set(-.8, 4.6, -2.95); SR.add(wallPatch);
var sph = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 26), surfMat(scR, ICE.clone().multiplyScalar(.55), ICE, true)); sph.position.set(-2.1, 1, .6); SR.add(sph);
var cubeB = V.edgeBox(scR, SR, 2.2, 2.2, 2.2, VIO.clone().multiplyScalar(.7), VIO, new V3(2.2, 1.1, .2));
/* sunlight: parallel beam lines from a distant sun to the wall (a free, quiet bundle) */
var SUN = new V3(-11, 13, 8), beamL = [];
for (var bi = 0; bi < 26; bi++) { var gx = -2.5 + (bi % 6) * .85, gy = 3 + Math.floor(bi / 6) * .9 + (bi % 2) * .2; beamL.push([[SUN.x, SUN.y, SUN.z], [gx - .8, gy + 1.2, -3], bi * .3]); }
var beamM = lineMat(scR, ICE, .55); beamM.uniforms.uAmt.value = 3.2; var beam = V.segs(beamL, beamM); SR.add(beam);
var sunBall = new THREE.Mesh(new THREE.SphereGeometry(.9, 24, 18), new THREE.MeshBasicMaterial({ color: 0xfff1c8 })); sunBall.position.copy(SUN); SR.add(sunBall);
/* the question rays: eye -> pixel grid -> scene, raycast on the CPU at build time */
var EYE = new V3(0, 3.1, 15.5), PLANE_Z = 11.3, NX = 8, NY = 12, PWD = 2.5, PHT = PWD * 12 / 8;
var screenLines = []; for (var gx2 = 0; gx2 <= NX; gx2++) screenLines.push(-PWD / 2 + gx2 * PWD / NX, 3.1 - PHT / 2, PLANE_Z, -PWD / 2 + gx2 * PWD / NX, 3.1 + PHT / 2, PLANE_Z); for (var gy2 = 0; gy2 <= NY; gy2++) screenLines.push(-PWD / 2, 3.1 - PHT / 2 + gy2 * PHT / NY, PLANE_Z, PWD / 2, 3.1 - PHT / 2 + gy2 * PHT / NY, PLANE_Z);
var screenM = lines(screenLines, lineMat(scR, ICE, .6)); SR.add(screenM);
function raySphere(o, d, c, r) { var oc = o.clone().sub(c), b = oc.dot(d), cc = oc.dot(oc) - r * r, h = b * b - cc; if (h < 0) return -1; var s = -b - Math.sqrt(h); return s > .001 ? s : -1; }
function rayBox(o, d, c, hs) { var tmin = -1e9, tmax = 1e9; ['x', 'y', 'z'].forEach(function (a) { var inv = 1 / (d[a] || 1e-9), t1 = (c[a] - hs - o[a]) * inv, t2 = (c[a] + hs - o[a]) * inv; tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2)); }); return tmax >= tmin && tmax > 0 ? Math.max(tmin, .001) : -1; }
var rayList = [], hot = { girti: null, mudti: null, rukti: null };
(function () {
  for (var iy = 0; iy < NY; iy++) for (var ix = 0; ix < NX; ix++) {
    var tgt = new V3(-PWD / 2 + (ix + .5) * PWD / NX, 3.1 - PHT / 2 + (iy + .5) * PHT / NY, PLANE_Z), d = tgt.clone().sub(EYE).normalize();
    /* aim the whole fan at the scene: extend direction so it spreads over the objects */
    var d2 = new V3(d.x * 4.2, d.y * 3.0 - .1, d.z).normalize();
    var best = 1e9, kind = 'wall', n = null;
    var s1 = raySphere(EYE, d2, sph.position, 1); if (s1 > 0 && s1 < best) { best = s1; kind = 'sph'; }
    var s2 = rayBox(EYE, d2, cubeB.m.position, 1.1); if (s2 > 0 && s2 < best) { best = s2; kind = 'cube'; }
    var s3 = d2.y < 0 ? -EYE.y / d2.y : -1; if (s3 > 0 && s3 < best) { best = s3; kind = 'floor'; }
    var s4 = (-3 - EYE.z) / d2.z; if (s4 > 0 && s4 < best) { best = s4; kind = 'wall'; }
    var hit = EYE.clone().addScaledVector(d2, best); if (kind === 'wall' && (Math.abs(hit.x) > 7 || hit.y > 10 || hit.y < 0)) { best = 1e9; }
    var pts = [[EYE.x, EYE.y, EYE.z], [hit.x, hit.y, hit.z]], bounce = null;
    if (kind === 'sph') { var nn = hit.clone().sub(sph.position).normalize(), rf = d2.clone().sub(nn.clone().multiplyScalar(2 * d2.dot(nn))), sb = (-3 - hit.z) / rf.z; if (sb > 0) { var h2 = hit.clone().addScaledVector(rf, sb); bounce = [[hit.x, hit.y, hit.z], [h2.x, h2.y, h2.z]]; } }
    var r = { pts: pts, bounce: bounce, kind: kind, off: (ix * 7 + iy * 13) % 17 * .8, ix: ix, iy: iy }; rayList.push(r);
  }
  /* choose three showcase rays: one that lands on the wall, one that bounces off the sphere, one that stops at the cube */
  function pick(f) { var best = null, bd = 1e9; rayList.forEach(function (r) { if (!f(r)) return; var dd = Math.abs(r.ix - 3.5) + Math.abs(r.iy - 6); if (dd < bd) { bd = dd; best = r; } }); return best; }
  hot.girti = pick(function (r) { return r.kind === 'wall' && r.ix < 2; }) || pick(function (r) { return r.kind === 'wall'; });
  hot.mudti = pick(function (r) { return r.kind === 'sph' && r.bounce; });
  hot.rukti = pick(function (r) { return r.kind === 'cube'; }) || pick(function (r) { return r.kind === 'floor'; });
})();
var qMat = lineMat(scR, VIO, .38); qMat.uniforms.uAmt.value = 2.6;
var qSegs = []; rayList.forEach(function (r) { qSegs.push([r.pts[0], r.pts[1], r.off]); if (r.bounce) qSegs.push([r.bounce[0], r.bounce[1], r.off + 8]); });
var qLines = V.segs(qSegs, qMat); SR.add(qLines);
var hotMs = {}; ['girti', 'mudti', 'rukti'].forEach(function (k, i) { var r = hot[k]; if (!r) return; var m = lineMat(scR, [ICE, VIO, ROSE][i], 1.2); m.uniforms.uAmt.value = 6; var ls = [[r.pts[0], r.pts[1], 0]]; if (r.bounce) ls.push([r.bounce[0], r.bounce[1], 4]); var l = V.segs(ls, m); l.visible = false; SR.add(l); hotMs[k] = { l: l, r: r, m: m }; });
var hitPts = V.glowPoints(scR, [0, 0, 0, 0, 0, 0, 0, 0, 0], ICE, 22); SR.add(hitPts);
var pingR = V.pingMesh(SR, new THREE.Color(.62, .5, 1));
var motes = V.glowPoints(scR, (function () { var p = []; for (var i = 0; i < 140; i++) p.push((V.hash(i) - .5) * 14, 1 + V.hash(i + 41) * 8, -2.5 + V.hash(i + 5) * 10); return p; })(), ICE, 8); SR.add(motes);
var lr1 = V.labIn(R, { html: '<div class=tag>Sunlight · the real world</div><div class=big><span>₹0</span></div><div class=src>every ray · free</div>', t0: CW('s2', 'muft') - .2, t1: tq0 - .5, px: [162, 250] });
var lrQ1 = V.labIn(R, { html: '<div class=tag>Where does it land?</div>', t0: tq1, px: [162, 1000] }), lrQ2 = V.labIn(R, { html: '<div class="tag v">Where does it bounce?</div>', t0: tq2, px: [162, 1070] }), lrQ3 = V.labIn(R, { html: '<div class="tag r">Where does it stop?</div>', t0: tq3, px: [162, 1140] });
var lrN = V.labIn(R, { html: '<div class="tag v">Rays asked</div><div class="big v"><span>0</span></div><div class=src class=m>one 4K frame ≈ 8.3 M pixels<br>≥ 1 ray each · derived</div>', t0: tq0 - .6, px: [162, 250] });
R.upd = function (t, tl, dur) {
  var p1 = ramp(t, R.t0, tq0 - .3), p2 = ramp(t, tq0 - .3, tq4 + .9), p3 = ramp(t, tq4 + .9, R.t1);
  var e1 = eio(p1), e2 = eio(p2), e3 = eio(p3), k = shk(t, .03 * p3, 17);
  CR.fov = lerp(36, 42, e2); CR.updateProjectionMatrix();
  CR.position.set(lerp(lerp(9, 6, e1), -3.5, e2) + lerp(0, 9, e3) + k[0], lerp(lerp(3.6, 4.4, e1), 5.0, e2) + 3 * e3 + k[1], lerp(lerp(22, 20, e1), 27, e2) + 2 * e3 + k[2]);
  CR.up.set(0, 1, 0); CR.lookAt(lerp(-.4, 0, e2), lerp(3.6, 3.4, e2), lerp(-1, 4, e2)); CR.rotateZ(lerp(.1, -.06, e2) + .0); CR.updateMatrixWorld(true);
  scR.uS.value = 32 * Math.pow(clamp(tl / 2.2), .8) - 4;
  beam.visible = true; beamM.uniforms.uBase.value = .55 * (1 - .75 * ramp(t, tq0 - .2, tq0 + .5)); beamM.uniforms.uPulse.value = (t * 7) % 40 - 4;
  wallPatch.material.uniforms.uA.value = (.5 + .5 * Math.sin(t * 1.3)) * .35 + .65 * (1 - ramp(t, tq0 - .2, tq0 + .5)) * ramp(tl, .4, 1.4);
  sunBall.visible = true; sunBall.scale.setScalar(1 + .06 * Math.sin(t * 3));
  var qOn = ramp(t, tq0, tq0 + 1.6), nq = rayList.length;
  qMat.uniforms.uBase.value = .38 * qOn; qMat.uniforms.uPulse.value = (t * 6.5) % 30 - 3; qLines.visible = qOn > 0; screenM.visible = qOn > 0; screenM.material.uniforms.uBase.value = .6 * qOn;
  /* the scan reveals the fan from the eye: reuse a per-time clip by growing the fan with scan radius around the eye */
  Object.keys(hotMs).forEach(function (kk, i) { var h = hotMs[kk], tc = [tq1, tq2, tq3][i], u = ramp(t, tc, tc + .5); h.l.visible = u > 0; h.m.uniforms.uPulse.value = ((t - tc) * 9) % 14 - 2; h.m.uniforms.uBase.value = 1.6 * u; });
  var hp = hitPts.geometry.attributes.position.array, ha = hitPts.userData.a;
  [['girti', tq1], ['mudti', tq2], ['rukti', tq3]].forEach(function (a, i) { var h = hotMs[a[0]]; if (!h) { ha[i] = 0; return; } var end = h.r.bounce ? h.r.bounce[1] : h.r.pts[1]; hp[i * 3] = end[0]; hp[i * 3 + 1] = end[1]; hp[i * 3 + 2] = end[2]; ha[i] = ramp(t, a[1] + .35, a[1] + .7) * (.7 + .3 * Math.sin(t * 9 + i)); });
  hitPts.geometry.attributes.position.needsUpdate = true; hitPts.geometry.attributes.aA.needsUpdate = true;
  var ma = motes.userData.a; for (var i = 0; i < ma.length; i++) ma[i] = (.3 + .7 * Math.abs(Math.sin(t * (.5 + V.hash(i) * 1.1) + i))) * (1 - .6 * qOn); motes.geometry.attributes.aA.needsUpdate = true;
  sph.rotation.y = t * .3; sph.position.y = 1 + .06 * Math.sin(t * 1.4);
  var pp = ((t - tq4) % 2) / 2; pingR.uniforms.uR.value = 18 * pp; pingR.uniforms.uA.value = t > tq4 ? (1 - pp) : 0;
  lrN.in.querySelector('span').textContent = t < tq0 ? '0' : (Math.round(8.3 * eo3(ramp(t, tq0, tq4 + 1)) * 10) / 10).toFixed(1) + ' M';
};

/* ================= scene B: light bent round a mass (Schwarzschild, rs = 1) ================= */
var B = V.newScene('B', 2, 36, mkScan(1, null, new V3(0, 0, 0), .45)), scB = B.scan, SB = B.S, CB = B.C;
var bh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), new THREE.MeshBasicMaterial({ color: 0x000000 })); bh.renderOrder = 1; SB.add(bh);
var rays = [];
(function () { var Mm = .5, bs = [1.4, 2.0, 2.4, 2.52, 2.6, 2.66, 2.8, 3.1, 3.6, 4.4, 5.4, 6.6];
  bs.forEach(function (b0, k) { [1, -1].forEach(function (sg) {
    var b = b0, r0 = 17, ph = Math.asin(b / r0), u = 1 / r0, du = Math.cos(ph) / b, pts = [], dphi = .004, cap = false;
    function acc(u_) { return -u_ + 3 * Mm * u_ * u_; }
    for (var it = 0; it < 4200; it++) { var r = 1 / u; if (r < 1.02) { cap = true; break; } var th = Math.PI - ph; pts.push([r * Math.cos(th), sg * r * Math.sin(th), 0]);
      if (r > 19 && it > 50) break;
      var k1u = du, k1d = acc(u), k2u = du + k1d * dphi / 2, k2d = acc(u + k1u * dphi / 2), k3u = du + k2d * dphi / 2, k3d = acc(u + k2u * dphi / 2), k4u = du + k3d * dphi, k4d = acc(u + k3u * dphi);
      u += (k1u + 2 * k2u + 2 * k3u + k4u) * dphi / 6; du += (k1d + 2 * k2d + 2 * k3d + k4d) * dphi / 6; ph += dphi; }
    var pos = [], as = [], s = 0, step = 3; for (var i = 0; i < pts.length; i += step) { if (i > 0) { var a = pts[i - step], c = pts[i]; s += Math.hypot(c[0] - a[0], c[1] - a[1]); } pos.push(pts[i][0], pts[i][1], pts[i][2]); as.push(s); }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(as, 1));
    var m = new THREE.Line(g, lineMat(scB, cap ? EMB : (k % 3 === 0 ? ICE : VIO), 1.0)); m.frustumCulled = false; m.renderOrder = 5; SB.add(m); rays.push({ m: m, len: s, k: k + (sg > 0 ? 0 : .5), P: pos, S: as, cap: cap }); }); }); })();
var disc = new THREE.Mesh(new THREE.RingGeometry(1.6, 4.4, 128, 1).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: U(scB, { uT: 0 }), vertexShader: 'varying vec3 vP;varying vec2 vL;void main(){vL=position.xz;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: V.SC_GLSL + 'varying vec2 vL;uniform float uT;void main(){float d=scanD();if(d<0.)discard;float i=scanI(d);float r=length(vL),a=atan(vL.y,vL.x);float sw=.5+.5*sin(a*3.+uT*(4./max(r,1.))*1.8-r*3.);float f=smoothstep(4.4,2.2,r)*smoothstep(1.6,2.0,r);' +
  'vec3 col=mix(mix(vec3(1.,.66,.28),vec3(1.,.42,.55),smoothstep(1.7,2.8,r)),vec3(.62,.5,1.),smoothstep(2.8,4.3,r));gl_FragColor=vec4(col*f*(.25+.9*sw)*(.35+.65*min(i,1.4))*1.4,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
disc.rotation.x = .38; disc.renderOrder = 4; SB.add(disc);
var pring = lines(circ(1.5, 96, 0), lineMat(scB, EMB, 1.5)); pring.rotation.x = Math.PI / 2; SB.add(pring);
var halo = new THREE.Mesh(new THREE.RingGeometry(1.55, 2.5, 128, 1), new THREE.ShaderMaterial({ uniforms: U(scB, { uT: 0 }), vertexShader: 'varying vec3 vP;varying vec2 vL;void main(){vL=position.xy;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: V.SC_GLSL + 'varying vec2 vL;uniform float uT;void main(){float d=scanD();if(d<0.)discard;float i=scanI(d);float r=length(vL),a=atan(vL.y,vL.x);float f=smoothstep(2.5,1.6,r)*smoothstep(1.52,1.75,r);float sw=.55+.45*sin(a*2.+uT*.9);gl_FragColor=vec4(mix(vec3(1.,.7,.35),vec3(.62,.5,1.),smoothstep(1.6,2.4,r))*f*sw*(.3+.7*min(i,1.4))*1.5,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); halo.renderOrder = 4; SB.add(halo);
(function () { var sp = []; for (var i = 0; i < 900; i++) { var th = V.hash(i) * 6.2832, ph = Math.acos(2 * V.hash(i + 333) - 1), r = 24 + (i % 7); sp.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)); }
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); var pal = [[.7, .85, 1], [.62, .5, 1], [1, .7, .4], [1, .45, .55], [.5, .95, .75]], c = []; for (var i2 = 0; i2 < sp.length / 3; i2++) { var q = pal[(i2 * 7919) % 5]; c.push(q[0], q[1], q[2]); } g.setAttribute('aC', new THREE.Float32BufferAttribute(c, 3));
  var m = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: U(scB, {}), vertexShader: 'attribute vec3 aC;varying vec3 vP,vC;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;gl_PointSize=2.;vC=aC;}', fragmentShader: V.SC_GLSL + 'varying vec3 vC;void main(){float d=scanD();if(d<0.)discard;gl_FragColor=vec4(vC*(.2+.6*clamp(scanI(d),0.,1.)),1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); m.frustumCulled = false; SB.add(m); })();
var NP = 5, PTS = new Float32Array(rays.length * NP * 3), PCL = new Float32Array(rays.length * NP * 3);
rays.forEach(function (r, i) { var c = r.cap ? [1, .7, .35] : (Math.floor(r.k) % 3 === 0 ? [.7, .9, 1] : [.75, .65, 1]); for (var j = 0; j < NP; j++) { var o = (i * NP + j) * 3; PCL[o] = c[0]; PCL[o + 1] = c[1]; PCL[o + 2] = c[2]; } });
var pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(PTS, 3)); pgeo.setAttribute('aC', new THREE.BufferAttribute(PCL, 3));
var phot = new THREE.Points(pgeo, new THREE.ShaderMaterial({ uniforms: U(scB, {}), vertexShader: 'attribute vec3 aC;varying vec3 vP,vC;void main(){vC=aC;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;gl_PointSize=9.;}', fragmentShader: V.SC_GLSL + 'varying vec3 vC;void main(){float d=scanD();if(d<0.)discard;float f=smoothstep(.5,.0,length(gl_PointCoord-.5));gl_FragColor=vec4(vC*f*2.2,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); phot.frustumCulled = false; phot.renderOrder = 6; SB.add(phot);
function updatePhotons(t) { rays.forEach(function (r, i) { for (var j = 0; j < NP; j++) { var s = (t * 3.4 + j * r.len / NP + i * .53) % r.len, lo = 0, hi = r.S.length - 1; while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (r.S[mid] < s) lo = mid; else hi = mid; }
  var f = (s - r.S[lo]) / Math.max(1e-6, r.S[hi] - r.S[lo]), o = (i * NP + j) * 3; PTS[o] = r.P[lo * 3] + (r.P[hi * 3] - r.P[lo * 3]) * f; PTS[o + 1] = r.P[lo * 3 + 1] + (r.P[hi * 3 + 1] - r.P[lo * 3 + 1]) * f; PTS[o + 2] = 0; } }); pgeo.attributes.position.needsUpdate = true; }
var tB1 = CW('s4', 'dneg'), tB2 = CW('s4b', 'sau'), tB3 = CW('s5', 'paper'), tBi = CW('s4', 'interstellar');
V.labIn(B, { html: '<div class="tag r">Illustration · Schwarzschild<br>non-spinning mass</div>', t0: B.t0 + .5, px: [162, 260] });
V.labIn(B, { html: '<div class="tag m">DNEG · producer’s company</div><div class=src>dneg.com · studio page</div>', t0: tB1, px: [162, 400] });
var lb2 = V.labIn(B, { html: '<div class="tag v">Interstellar · one frame</div><div class="big v"><span>0</span><small>H</small></div><div class=src>up to ~100 h · reported<br>Wired via press</div>', t0: tB2 - .2, px: [162, 790] });
V.labIn(B, { html: '<div class="src m">2 papers · same code<br>Class. Quantum Grav. 32 (2015) 065001<br>Am. J. Phys. (2015)</div>', t0: tB3 - .2, px: [162, 1080] });
B.upd = function (t, tl, dur) {
  var a = ramp(tl, 0, dur * .5), b = ramp(tl, dur * .5, dur), e1 = eio(a), e2 = eio(b), fov = lerp(22, 48, e1); CB.fov = fov;
  var tn = Math.tan(fov * Math.PI / 360), r1 = 6.5 / tn, r = lerp(r1, 6.2, e2), az = lerp(-.1, .45, e1) + 1.1 * e2, y = lerp(.8, 2.4, e1) + 1.4 * e2, sk = shk(t, .05 * ramp(tl, dur * .75, dur), 23);
  CB.position.set(r * Math.sin(az) + sk[0], y + sk[1], r * Math.cos(az) + sk[2]); CB.up.set(0, 1, 0); CB.lookAt(0, 0, 0); CB.rotateZ(-.2 * e2 + sk[2] * .2); CB.updateProjectionMatrix(); CB.updateMatrixWorld(true);
  scB.uS.value = 24 * Math.pow(clamp((tl + .3) / 2.7), .8) - 1;
  updatePhotons(t); disc.material.uniforms.uT.value = t; halo.material.uniforms.uT.value = t;
  rays.forEach(function (r2) { var ph = ((t * 3.0 + r2.k * 1.3) % (r2.len + 4)) - 2; r2.m.material.uniforms.uPulse.value = ph; r2.m.material.uniforms.uAmt.value = 4.5; });
  lb2.in.querySelector('span').textContent = '~' + Math.round(100 * eo3(ramp(t, lb2.t0 + .2, lb2.t0 + 1.8)));
};
})();
