/* Part B1: scenes 0-4 (puddle hook, nature's rays, the flip, reflection, shadow). Everything is a pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, K = e.col, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, put = e.put, B = window.B;
var SC = window.SC = [0, S0('p1'), S0('r1'), S0('b1'), S0('s1'), S0('v1'), S0('y1'), S0('y2'), S0('n1'), S0('e1'), S0('f1')];
window.GR = []; window.SCN = []; window.POSES = {}; window.SCFG = {};
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
/* dynamic text sprite (a counter / readout) that the label clamp can also place */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1);
  s.userData = { lbl: true, sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s); s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(6,7,10,.92)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 10, h); x.strokeStyle = 'rgba(238,242,238,.22)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function fitPose(pts, dir, fov, box) { var c = new V3(); pts.forEach(function (p) { c.add(p); }); c.multiplyScalar(1 / pts.length); var look = c.clone(), dist = 6, cp, cam = new THREE.PerspectiveCamera(fov, 1080 / 1920, .1, 400);
  function put2() { cp = look.clone().add(dir.clone().multiplyScalar(dist)); cam.position.copy(cp); cam.up.set(0, 1, 0); cam.lookAt(look); cam.updateMatrixWorld(true); cam.updateProjectionMatrix(); }
  function ok() { return pts.every(function (p) { var q = p.clone().project(cam), x = (q.x * .5 + .5) * 1080, y = (1 - (q.y * .5 + .5)) * 1920; return x > box[0] && x < box[2] && y > box[1] && y < box[3]; }); }
  for (var it = 0; it < 5; it++) { var lo = 2, hi = 90; for (var k = 0; k < 24; k++) { dist = (lo + hi) / 2; put2(); if (ok()) hi = dist; else lo = dist; } dist = hi; put2();
    var mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9; pts.forEach(function (p) { var q = p.clone().project(cam), x = (q.x * .5 + .5) * 1080, y = (1 - (q.y * .5 + .5)) * 1920; mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); });
    var wpp = 2 * dist * Math.tan(fov * Math.PI / 360) / 1920, r = new V3(), u = new V3(), f = new V3(); cam.matrixWorld.extractBasis(r, u, f); look.add(r.multiplyScalar(((mnx + mxx) / 2 - 540) * wpp)).add(u.multiplyScalar(-(((mny + mxy) / 2 - (box[1] + box[3]) / 2)) * wpp)); }
  put2(); return { p: [cp.x, cp.y, cp.z], l: [look.x, look.y, look.z], f: fov }; }
B.fitPose = fitPose;
var v3 = function (a) { return new V3(a[0], a[1], a[2]); };
/* ================= scene 0 + 10: the puddle street ================= */
var gS = grp(B.street()), pm = gS.userData.pm, tower = gS.userData.tower;
/* ================= scene 1: nature's rays ================= */
var gN = grp(new THREE.Group()), NR = 520, LP = new V3(0, 3.0, -6.4), EY = new V3(0, 1.6, 5.8), RM = { x0: -6, x1: 6, y0: 0, y1: 6, z0: -7.5, z1: 8 };
(function () { var fl = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), e.physMat(0x1c1f27, { roughness: .5, metalness: .2, envMapIntensity: .35 })); fl.rotation.x = -Math.PI / 2; gN.add(fl); gN.add(e.gridFloor(30, 1, 0x7f8aa0, .1));
  var lamp = new THREE.Mesh(new THREE.SphereGeometry(.5, 28, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.TUNG).multiplyScalar(3.6) })); lamp.position.copy(LP); gN.add(lamp); var pl = new THREE.PointLight(0xffc46b, 160, 26, 1.6); pl.position.copy(LP); gN.add(pl); var lg = e.glow('t', 6, .95); lg.position.copy(LP); gN.add(lg); gN.userData.lamp = lamp; gN.userData.lg = lg;
  var ey = new THREE.Group(), bd = new THREE.Mesh(new THREE.BoxGeometry(1.3, .9, 1.0), e.physMat(0x4a505e, { metalness: .8, roughness: .3, envMapIntensity: 1.6 })); ey.add(bd); var br = new THREE.Mesh(new THREE.CylinderGeometry(.3, .36, .6, 40), e.physMat(0x5a6070, { metalness: .9, roughness: .22, envMapIntensity: 1.8 })); br.rotation.x = Math.PI / 2; br.position.z = -.75; ey.add(br); var eg = e.glow('w', 2.6, .75); eg.position.z = -1.1; ey.add(eg);
  var rg = new THREE.Mesh(new THREE.TorusGeometry(.34, .04, 12, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(2.4) })); rg.position.z = -1.05; ey.add(rg); ey.position.copy(EY); ey.lookAt(LP); ey.rotateY(Math.PI); gN.add(ey); gN.userData.eye = ey;
  var pos = new Float32Array(NR * 6), col = new Float32Array(NR * 6), dirs = [], lens = [], hitEye = [];
  function slab(o, d) { var t = 1e9; [['x', 'x0', 'x1'], ['y', 'y0', 'y1'], ['z', 'z0', 'z1']].forEach(function (a) { var dd = d[a[0]], oo = o[a[0]]; if (Math.abs(dd) > 1e-6) { var t1 = ((dd > 0 ? RM[a[2]] : RM[a[1]]) - oo) / dd; if (t1 > 0 && t1 < t) t = t1; } }); return t; }
  for (var i = 0; i < NR; i++) { var d; if (i < 4) { d = EY.clone().add(new V3((i - 1.5) * .06, (i % 2 - .5) * .1, (i - 1.5) * .05)).sub(LP).normalize(); } else { var an = Math.pow(hash(i * 3 + 1), .8) * 1.35, ph = hash(i * 7 + 2) * 6.2832; d = new V3(Math.sin(an) * Math.cos(ph), Math.sin(an) * Math.sin(ph) * .55 + .1, Math.cos(an)).normalize(); }
    dirs.push(d); lens.push(i < 4 ? EY.distanceTo(LP) - .9 : slab(LP, d)); }
  var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); var lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); lines.frustumCulled = false; gN.add(lines);
  var ep = new Float32Array(NR * 3), ec = new Float32Array(NR * 3), eg2 = new THREE.BufferGeometry(); eg2.setAttribute('position', new THREE.BufferAttribute(ep, 3)); eg2.setAttribute('color', new THREE.BufferAttribute(ec, 3)); var pts2 = new THREE.Points(eg2, new THREE.PointsMaterial({ size: 7, sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); pts2.frustumCulled = false; gN.add(pts2);
  gN.userData.rays = { pos: pos, col: col, dirs: dirs, lens: lens, geo: geo, ep: ep, ec: ec, eg: eg2 };
  gN.userData.hot = [0, 1, 2, 3].map(function (i) { var r = e.ray(LP, EY.clone().sub(dirs[i].clone().multiplyScalar(.9)), K.HOT, .05); gN.add(r); return r; });
  gN.userData.c1 = e.dyn(.62, 760, 150, K.TUNG, function (x, a, b) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.TUNG); x.fillText('ONE BULB · BILLIONS OF RAYS', 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 50px "Martian Mono"'; x.fillText(a + ' drawn', 30, 112); });
  gN.userData.c2 = e.dyn(.62, 760, 150, K.HOT, function (x, a, b) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.HOT); x.fillText('REACHED THE EYE', 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 50px "Martian Mono"'; x.fillText(a + ' of ' + b, 30, 112); });
  gN.userData.l1 = e.lab('LAMP', K.TUNG, .5); gN.userData.l1.position.copy(LP.clone().add(new V3(0, 1.5, 0))); gN.add(gN.userData.l1); gN.userData.l2 = e.lab('EYE', K.HOT, .5); gN.userData.l2.position.copy(EY.clone().add(new V3(0, 1.3, 0))); gN.add(gN.userData.l2);
  gN.userData.l3 = e.lab('WASTED', K.COR, .5); gN.userData.l3.position.set(3.6, 4.0, -.5); gN.add(gN.userData.l3);
  gN.userData.c1.position.set(-2.7, .4, 9.5); gN.add(gN.userData.c1); gN.userData.c2.position.set(2.7, .4, 9.5); gN.add(gN.userData.c2); })();
/* ================= scenes 2-4: the ray bench ================= */
var bn = B.bench(), gB = grp(bn.g); window.BN = bn;
var PA = fitPose([bn.E0.clone().add(new V3(0, .6, -.6)), bn.P, bn.rEnd.clone().add(new V3(3.6, 3.0, -1.2)), bn.bpt.clone().setY(0).add(new V3(1.2, 0, 1.4)), bn.Pc.clone().add(new V3(-1.6, 1.2, 0)), bn.Pc.clone().add(new V3(2.6, -1.2, 0)), bn.Cs.clone().add(new V3(-1.4, -1.2, 1.4)), bn.Cs.clone().add(new V3(1.4, -1.2, 1.4)), bn.Lp.clone().add(new V3(-1.5, 1.2, -1.2))], new V3(.1, .85, .5).normalize(), 50, [190, 330, 890, 1230]);
POSES.PA = PA;
var bl = { l1: e.lab('PRIMARY RAY', K.HOT, .5), l2: e.lab('NORMAL', K.SAGE, .4), l3: e.lab('REFLECTION RAY', K.ICE, .5), l4: e.lab('ONE PIXEL', K.HOT, .4), l5: e.lab('BUILDING BEHIND YOU', K.ICE, .42), l6: e.lab('SHADOW RAY', K.VIO, .5), l7: e.lab('WHAT AM I?', K.HOT, .42), l8: e.lab('PIXEL = BUILDING', K.TUNG, .4), l9: e.lab('BLOCKED = SHADOW', K.COR, .42), l10: e.lab('CLEAR = LIGHT', K.TUNG, .42) };
bl.l1.position.copy(bn.E0.clone().add(bn.d.clone().multiplyScalar(3.4)).add(new V3(-2.3, .4, 0))); bl.l2.position.copy(bn.P.clone().add(bn.n.clone().multiplyScalar(1.4)).add(new V3(1.5, .5, -.9))); bl.l3.position.copy(bn.P.clone().add(bn.Rd.clone().multiplyScalar(2.6)).add(new V3(0, .6, -.9))); bl.l4.position.copy(bn.Pc.clone().add(new V3(2.1, .8, -.5))); bl.l5.position.copy(bn.bpt.clone().add(new V3(1.0, 3.5, -.2)));
bl.l6.position.copy(bn.P.clone().add(bn.Lp).multiplyScalar(.5).add(new V3(-1.9, .9, 0))); bl.l7.position.copy(bn.P.clone().add(new V3(1.8, .5, -1.7))); bl.l8.position.copy(bn.Pc.clone().add(new V3(-2.3, 1.1, 0))); bl.l9.position.copy(bn.P.clone().add(bn.Lp).multiplyScalar(.5).add(new V3(2.0, 1.2, 1.0))); bl.l10.position.copy(bn.P.clone().add(bn.Lp).multiplyScalar(.5).add(new V3(2.0, 1.2, 1.0)));
Object.keys(bl).forEach(function (k) { bn.g.add(bl[k]); });
var cardP = e.card('PRIMARY RAY', 'ek kiran, aankh se, ek pixel ke raaste', K.HOT, 1.7); cardP.position.copy(bn.Pc.clone().add(new V3(1.6, 3.8, -.4))); bn.g.add(cardP);
var cardS = e.card('SHADOW RAY', 'roshni tak seedhi raah hai ya nahi?', K.VIO, 1.7); cardS.position.copy(bn.P.clone().add(new V3(2.0, 3.8, -1.5))); bn.g.add(cardS);
/* ================= camera shots ================= */
var tS0 = SC[0], tHook = WS('h1', 'उल्टी|उल्टा|उलटी', .8);
e.shot(0, 'crane-down + tilt', 0, 3.6, [3, 10, 17], [0, 11, -40], 46, [.4, 1.35, 7.4], [.1, -2.9, -3.2], 44, 'io');
e.shot(0, 'push-in', Math.max(4.2, tHook - .6), Math.max(6.4, tHook + 1.8), [.4, 1.35, 7.4], [.1, -2.9, -3.2], 44, [.3, .95, 5.5], [.1, -3.2, -3.6], 44, 'io');
var tOrb = SC[1];
e.shot(1, 'orbit', tOrb, tOrb + 6.5, [-8, 10.5, 15], [0, 1.0, 0], 52, [7, 10.5, 15.5], [0, 1.0, 0], 52, 'io');
var tPush = WS('p1', 'आँख|आंख|पहुँचती', .8) - .4;
e.shot(1, 'push-in to the eye', tPush, tPush + 2.6, [7, 10.5, 15.5], [0, 1.0, 0], 52, [2.4, 4.4, 11.8], [0, 1.6, 5.5], 44, 'io');
var tRay = WS('r1', 'बाहर|तरफ़|भेजो', .65);
e.shot(2, 'plan view', SC[2], SC[2] + 1, PA.p, PA.l, 50, PA.p, PA.l, 50, 'io');
var BP = bn.E0.clone().add(bn.d.clone().multiplyScalar(.5)).add(new V3(7.6, 6.6, 1.2)), BL = bn.P.clone().add(new V3(0, .2, -.3));
e.shot(2, 'dolly with the ray', tRay - .2, tRay + 2.4, PA.p, PA.l, 50, [BP.x, BP.y, BP.z], [BL.x, BL.y, BL.z], 44, 'io');
var tR3 = SC[3], tRefl = WS('b1', 'उछलकर|उछल', .25), CPp = bn.P.clone().add(new V3(-8.6, 6.6, 6.6)), CLp = bn.P.clone().add(bn.rEnd).multiplyScalar(.5);
e.shot(3, 'orbit to the bounce', tR3 + .1, tR3 + 1.8, [BP.x, BP.y, BP.z], [BL.x, BL.y, BL.z], 44, [CPp.x, CPp.y, CPp.z], [CLp.x, CLp.y, CLp.z], 46, 'io');
var tBld = WS('b1', 'बिल्डिंग', .55), tPud = WS('b1', 'पडल|पुडल|पड्डल|पडल्', .8);
e.shot(3, 'pull-back to the building', tBld - .3, tBld + 2.2, [CPp.x, CPp.y, CPp.z], [CLp.x, CLp.y, CLp.z], 46, PA.p, PA.l, 50, 'io');
var SP0 = bn.P.clone().add(bn.Lp).multiplyScalar(.5), TP = SP0.clone().add(new V3(-9.6, 6.4, 9.6));
e.shot(4, 'truck along the shadow ray', SC[4] + .1, SC[4] + 2.6, PA.p, PA.l, 50, [TP.x, TP.y, TP.z], [SP0.x, SP0.y, SP0.z], 46, 'io');
/* ================= scene functions ================= */
SCN[0] = function (t) { (window.__r10 || []).forEach(function (o) { o.visible = false; }); gS.visible = true; tower.visible = true; S.fog = new THREE.FogExp2(0x0a0e1a, .011); S.background = new THREE.Color(0x0a0e1a); pm.uniforms.uT.value = t; };
SCN[1] = function (t) { gN.visible = true; S.fog = new THREE.FogExp2(0x07080b, .02); S.background = new THREE.Color(0x07080b); var ud = gN.userData, R = ud.rays, t0 = SC[1] + .2, tW = WS('p2', 'नुकसान|बड़ा', .4), w = clamp((t - tW) / .9);
  for (var i = 0; i < NR; i++) { var tb = t0 + (i / NR) * 3.2, u = clamp((t - tb) / .5), ln = R.lens[i] * u, d = R.dirs[i], j = i * 6, special = i < 4;
    var ex = LP.x + d.x * ln, ey = LP.y + d.y * ln, ez = LP.z + d.z * ln; R.pos[j] = LP.x; R.pos[j + 1] = LP.y; R.pos[j + 2] = LP.z; R.pos[j + 3] = ex; R.pos[j + 4] = ey; R.pos[j + 5] = ez;
    var a = special ? 0 : (u > 0 ? .55 : 0); var r = lerp(1, 1, w) * a, g2 = lerp(.62, .24, w) * a, b2 = lerp(.28, .2, w) * a; var fade = 1 - w * .45; R.col[j] = r * fade; R.col[j + 1] = g2 * fade; R.col[j + 2] = b2 * fade; R.col[j + 3] = r * fade * .3; R.col[j + 4] = g2 * fade * .3; R.col[j + 5] = b2 * fade * .3; }
  for (var q = 0; q < NR; q++) { R.ep[q * 3] = R.pos[q * 6 + 3]; R.ep[q * 3 + 1] = R.pos[q * 6 + 4]; R.ep[q * 3 + 2] = R.pos[q * 6 + 5]; var uu = clamp((t - (t0 + (q / NR) * 3.2)) / .5), c0 = q < 4 ? 0 : (uu >= 1 ? 1 : 0); R.ec[q * 3] = c0 * lerp(1, 1, w) * (1 - w * .4); R.ec[q * 3 + 1] = c0 * lerp(.7, .26, w) * (1 - w * .4); R.ec[q * 3 + 2] = c0 * lerp(.3, .2, w) * (1 - w * .4); } R.eg.attributes.position.needsUpdate = true; R.eg.attributes.color.needsUpdate = true; R.geo.attributes.position.needsUpdate = true; R.geo.attributes.color.needsUpdate = true;
  var tHit = WS('p1', 'आँख|आंख|पहुँचती', .8); ud.hot.forEach(function (r, i) { var u = clamp((t - (tHit - .4 + i * .08)) / .6); r.visible = u > 0; if (u > 0) e.setRay(r, LP, LP.clone().add(R.dirs[i].clone().multiplyScalar((EY.distanceTo(LP) - .9) * u))); });
  var n = Math.floor(Math.min(NR, Math.max(0, (t - t0) / 3.2 * NR))); ud.c1.draw(n); ud.c2.draw(t >= tHit ? 4 : 0, NR); ud.c1.visible = t > t0 + .2; ud.c2.visible = t > t0 + .2; put(ud.l1, t, t0, .4); put(ud.l2, t, t0 + .3, .4); put(ud.l3, t, tW, .4); };
function benchBase(t) { gB.visible = true; S.fog = new THREE.FogExp2(0x07080b, .028); S.background = new THREE.Color(0x07080b); }
function setRays(P1, P2) { e.setRay(bn.rayP, bn.eStart, bn.eStart.clone().lerp(bn.P, P1)); bn.rayP.visible = P1 > 0; bn.ah1.visible = P1 >= 1; bn.ah1.position.copy(bn.P.clone().sub(bn.d.clone().multiplyScalar(.2))); e.orient(bn.ah1, bn.d); }
SCN[2] = function (t) { benchBase(t); var t0 = SC[2], tPix = WS('r1', 'पिक्सल|पिक्सेल', .5), tPR = WS('r1', 'प्राइमरी|प्राइमरी', .9), tH = S0('r2');
  bn.g.children.forEach(function (c) { if (c.userData && c.userData.keep) return; });
  /* stage: eye first, then the pixel grid, then the ray */
  bn.eye.visible = t >= t0 + .15; var ue = clamp((t - t0 - .15) / .5); bn.eye.scale.setScalar(eo3(ue) || .001);
  var ug = clamp((t - (t0 + .8)) / .6); bn.plane.visible = ug > 0; bn.lines.material.opacity = .6 * ug; bn.glassP.material.opacity = .07 * ug; bn.hot.visible = t >= tPix - .6; bn.hot.scale.setScalar(1 + .25 * Math.max(0, Math.sin((t - tPix) * 6)) * clamp(1 - (t - tPix) / 2));
  bn.chrome.visible = true; bn.lamp.visible = false; bn.lampGl.visible = false; bn.rayS.visible = false; bn.ah3.visible = false; bn.blk.visible = false; bn.sw.visible = false; bn.bld.visible = false; bn.crown.visible = false; bn.rayR.visible = false; bn.rayN.visible = false; bn.ah2.visible = false; bn.hit.visible = t >= tRay + 1.2;
  var p1 = clamp((t - tRay) / 1.3); setRays(sstep(p1)); bn.hit.material.opacity = clamp((t - tRay - 1.2) / .3); bn.hit.scale.setScalar(1.5 + .3 * Math.sin(t * 5));
  put(bl.l1, t, tPR - .5, .4); put(bl.l4, t, tPix, .4); put(cardP, t, tPR, .5, tH + 2.8); put(bl.l7, t, tH + .2, .4); bn.hot.material.color.set(K.HOT).multiplyScalar(3); bn.hot.material.color.copy(new THREE.Color(K.HOT).multiplyScalar(3)); };
SCN[3] = function (t) { benchBase(t); var t0 = SC[3]; bn.eye.visible = true; bn.eye.scale.setScalar(1); bn.plane.visible = true; bn.lines.material.opacity = .6; bn.glassP.material.opacity = .07; bn.hot.visible = true; bn.lamp.visible = false; bn.lampGl.visible = false; bn.rayS.visible = false; bn.ah3.visible = false; bn.blk.visible = false; bn.sw.visible = false;
  setRays(1); bn.hit.visible = true; bn.hit.material.opacity = 1; bn.hit.scale.setScalar(1.5);
  var un = clamp((t - t0) / .5); bn.rayN.visible = un > 0; e.setRay(bn.rayN, bn.P, bn.P.clone().add(bn.n.clone().multiplyScalar(1.7 * sstep(un))));
  var ur = clamp((t - tRefl) / 1.5); e.setRay(bn.rayR, bn.P, bn.P.clone().lerp(bn.rEnd, sstep(ur))); bn.rayR.visible = ur > 0; bn.ah2.visible = ur >= 1; bn.ah2.position.copy(bn.rEnd); e.orient(bn.ah2, bn.Rd);
  var ub = clamp((t - (tRefl + .9)) / .6); bn.bld.visible = ub > 0; bn.crown.visible = ub > 0; bn.bld.scale.setScalar(eo3(ub) || .001); bn.crown.scale.setScalar(eo3(ub) || .001); bn.bld.position.y = 2.7 * (eo3(ub) || .001); bn.crown.position.y = 5.5 * (eo3(ub) || .001);
  put(bl.l2, t, t0 + .4, .4); put(bl.l3, t, tRefl + .5, .4); put(bl.l5, t, tBld, .4); put(bl.l8, t, tPud, .4); var up = sstep(clamp((t - tPud) / .8)); bn.hot.material.color.copy(new THREE.Color(K.HOT).multiplyScalar(3).lerp(new THREE.Color(K.TUNG).multiplyScalar(3.4), up)); };
SCN[4] = function (t) { benchBase(t); var t0 = SC[4], tBl = WS('s1', 'छाया|छाया,', .45), tCl = WS('s1', 'रोशनी|रोशनी।|रोशनी,', .8); bn.eye.visible = true; bn.eye.scale.setScalar(1); bn.plane.visible = true; bn.lines.material.opacity = .6; bn.glassP.material.opacity = .07; bn.hot.visible = true; setRays(1); bn.hit.visible = true; bn.hit.material.opacity = 1;
  bn.rayN.visible = true; bn.rayR.visible = true; bn.ah2.visible = true; bn.bld.visible = true; bn.crown.visible = true; bn.bld.scale.setScalar(1); bn.crown.scale.setScalar(1); bn.bld.position.y = 2.7; bn.crown.position.y = 5.5; bn.hot.material.color.copy(new THREE.Color(K.TUNG).multiplyScalar(3.4));
  var ul = clamp((t - t0) / .5); bn.lamp.visible = bn.lampGl.visible = ul > 0; bn.lamp.scale.setScalar(eo3(ul) || .001); bn.lampGl.scale.set(4.6 * eo3(ul) || .01, 4.6 * eo3(ul) || .01, 1);
  var mid = bn.P.clone().lerp(bn.Lp, .52), us = clamp((t - (t0 + .5)) / 1.0), ub = clamp((t - (tBl - .5)) / .6), ua = clamp((t - (tCl - .1)) / .8), blocked = t >= tBl - .1 && t < tCl - .1;
  var bpos = mid.clone().add(new V3(0, 2.8 * (1 - eo3(ub)) + 2.8 * eo3(ua), 0)); bn.blk.visible = t >= tBl - .6 && ua < 1; bn.blk.position.copy(bpos); bn.blk.rotation.y = 0; var endPt = blocked ? mid.clone().add(new V3(0, -.05, 0)) : bn.Lp; var dir2 = endPt.clone().sub(bn.P);
  var reach = blocked ? clamp((t - (tBl - .1)) / .01) : 1; var fullU = sstep(us); var e2 = bn.P.clone().lerp(blocked ? mid : bn.Lp, blocked ? 1 : fullU); if (!blocked && t < tBl - .1) e2 = bn.P.clone().lerp(bn.Lp, fullU); e.setRay(bn.rayS, bn.P, e2); bn.rayS.visible = us > 0; bn.ah3.visible = us >= 1 && !blocked; bn.ah3.position.copy(bn.Lp.clone().sub(bn.Lp.clone().sub(bn.P).normalize().multiplyScalar(.5))); e.orient(bn.ah3, bn.Lp.clone().sub(bn.P));
  bn.rayS.material.color.copy(new THREE.Color(blocked ? K.COR : K.VIO).multiplyScalar(2.2)); var lit = t >= tCl; bn.hot.material.color.copy(new THREE.Color(K.TUNG).multiplyScalar(lit || t < tBl ? 3.4 : .5)); bn.lampGl.material.opacity = .95; bn.hit.material.opacity = lit || t < tBl ? 1 : .25;
  put(bl.l6, t, t0 + .8, .4); put(cardS, t, t0 + .2, .5, tBl + 1.2); put(bl.l9, t, tBl + .1, .4, tCl); put(bl.l10, t, tCl + .1, .4); };
window.__gS = gS; window.__tower = tower; window.__pm = pm;
})();
