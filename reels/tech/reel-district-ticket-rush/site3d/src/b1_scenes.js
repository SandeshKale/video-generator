/* Part B1: scene boundaries, camera framing helper, scenes 1-4 */
var LEAD = .4, SC = [0, S0('n1') - LEAD, S0('s1a') - LEAD, S0('q1') - LEAD, S0('t1') - LEAD, S0('p1') - LEAD, S0('e1') - LEAD, S0('r1') - LEAD, S0('r2') - LEAD, END];
var G = [], SCN = [];
function grp() { var g = new THREE.Group(); g.visible = false; S.add(g); G.push(g); return g; }
/* fr(): frame a point so it sits at screen row rowPx (usable area is y 232-1290, so its centre is ~761) */
function fr(c, d, pitch, yaw, fov, rowPx) { fov = fov || 38; rowPx = rowPx || 761; var c3 = new V3(c[0], c[1], c[2]), pr = pitch * Math.PI / 180, yw = (yaw || 0) * Math.PI / 180, dir = new V3(Math.sin(yw) * Math.cos(pr), Math.sin(pr), Math.cos(yw) * Math.cos(pr)), p = c3.clone().add(dir.clone().multiplyScalar(d)), fwd = c3.clone().sub(p).normalize(), right = new V3().crossVectors(fwd, new V3(0, 1, 0)).normalize(), up = new V3().crossVectors(right, fwd).normalize(), wpp = 2 * d * Math.tan(fov * Math.PI / 360) / H, l = c3.clone().sub(up.multiplyScalar((960 - rowPx) * wpp)); return [[p.x, p.y, p.z], [l.x, l.y, l.z], fov]; }
function sh(sc, name, t0, t1, A, B, ease) { shot(sc, name, t0, t1, A[0], A[1], A[2], B[0], B[1], B[2], ease); }
function lock(sc, name, t0, A) { shot(sc, name, t0, t0 + .01, A[0], A[1], A[2], A[0], A[1], A[2], 'io'); }
function fmt(n) { n = Math.max(0, Math.round(n)); var s = String(n); if (s.length > 3) { var a = s.slice(0, -3), b = s.slice(-3); a = a.replace(/\B(?=(\d\d)+(?!\d))/g, ','); return a + ',' + b; } return s; }
var TK = Ticket(CYN); TK.visible = false; S.add(TK);
function mat(o, f) { o.traverse(function (n) { if (n.material) f(n.material); }); }
function brow(i, t) { return Math.abs(Math.sin(6.283 * (t * 1.7 + hash(i + 51)))) * .09; }

/* ===== S1 the hook: the phone with the queue number, push-in, the token emerges ===== */
(function () { var g = grp(), P = Phone(); P.position.set(0, 2.6, 0); g.add(P);
  var fc = Crowd(1600, 'mag', 5); fc.update(function (i, o) { o.x = (hash(i) - .5) * 62; o.z = -16 - hash(i + 1) * 36; o.ry = hash(i + 2) * 6.28; }); g.add(fc); var sc2 = Crowd(900, 'mag', 17); sc2.update(function (i, o) { var sd = hash(i) < .5 ? -1 : 1; o.x = sd * (3.0 + hash(i + 1) * 9); o.z = -2 + hash(i + 2) * 11; o.ry = Math.PI + (hash(i + 3) - .5) * .8; o.s = .95 + hash(i + 4) * .3; }); g.add(sc2);
  g.add(put3(glow('m', 26, .22), 0, 6, -14)); g.add(put3(glow('c', 18, .16), -7, 3, -16));
  var L1 = lab('1,00,000+ TICKETS', IVO, .5, { font: '400 60px Bungee', bg: true }), L2 = lab('< 1 HOUR', AMB, .42, { font: '400 52px Bungee', bg: true }), D1 = lab('DISTRICT ✓', LIME, .36, { font: '400 44px Bungee', bg: true }), D2 = lab('BOOKMYSHOW ✗', 0x9aa3b8, .36, { font: '400 44px Bungee', bg: true }), SS = lab('SAMAY KA SCREENSHOT · ~10 MIN', CYN, .3, { fs: 40, bg: true }),
    CR = lab('CRASH?', RED, .7, { font: '400 100px Bungee', bg: true }), SD = lab('SYSTEM DESIGN', CYN, .5, { font: '400 74px Bungee', bg: true }), Q1 = lab('Q1 · APP KYUN NAHI TOOTI?', MAG, .34, { fs: 44, bg: true }), Q2 = lab('Q2 · EK SEAT, DO LOG KAISE NAHI?', AMB, .34, { fs: 44, bg: true });
  g.add(put3(L1, 0, 5.15, .4)); g.add(put3(L2, 0, 4.58, .4)); g.add(put3(D1, -1.2, 0.35, .4)); g.add(put3(D2, 1.35, 0.35, .4)); g.add(put3(SS, 0, 5.15, .6)); g.add(put3(CR, 0, 2.6, .7)); g.add(put3(SD, 0, 2.6, .7)); g.add(put3(Q1, 0, 5.2, .5)); g.add(put3(Q2, 0, 4.7, .5));
  CR.material.rotation = -.16; SD.material.rotation = -.1;
  var tA = S0('h2'), tB = S0('h3'), tC = S1('h3') - 2.0, A0 = fr([0, 2.6, 0], 16.4, 3, 0), A1 = fr([0, 2.6, 0], 14.0, 3, 0), A2 = fr([0, 3.0, 0], 20, 8, 0);
  lock(0, 'locked wide', 0, A0); sh(0, 'push-in', tA, tA + 2.6, A0, A1); sh(0, 'pull-back', tB + 1.2, tB + 4.2, A1, A2);
  SCN[0] = function (t) { g.visible = true; var ahead = 12569 - 21 * t; P.draw('queue', fmt(ahead), .26 + .004 * t, t); P.rotation.y = 0;
    put(L1, t, -1, .3, S0('h2') - .1); put(L2, t, WS('h1', 'घंटे', .4), .35, S0('h2') - .1); put(D1, t, WS('h1', 'डिस्ट्रिक्ट', .75), .35, S0('h3') + .2); put(D2, t, WS('h1', 'बुकमायशो', .85), .35, S0('h3') + .2);
    put(SS, t, S0('h2') + .1, .4, S0('h3')); var tc = WS('h3', 'क्रैश', .0), ts = WS('h3', 'सिस्टम', .3); put(CR, t, tc, .3, ts); put(SD, t, ts, .35); put(Q1, t, WS('h3', 'टूटी', .5), .35); put(Q2, t, WS('h3', 'सीट', .75), .35);
    var u = clamp((t - tC) / 2.0); TK.visible = u > 0; if (u > 0) { TK.setCol(CYN); TK.position.set(0, 2.6 + .6 * eo3(u), .2 + 3.2 * eo3(u)); TK.rotation.set(-.1, .35 * eo3(u), .1); TK.scale.setScalar(.35 + .9 * eo3(u)); } }; })();

/* ===== S2 the math, then the stampede (the crowd is 9,000 figures standing for 1 lakh) ===== */
(function () { var g = grp(), N = 9000, cr = Crowd(N, 'mag', 7), line = Crowd(30, 'cy', 91); g.add(cr); g.add(line); var gt = gate(); g.add(gt);
  var rack = new THREE.Group(), rb = box(1.7, 4.4, 1.5, 0x1b2030, 0, { m: .6, r: .4 }); rb.position.y = 2.2; rack.add(rb); var leds = []; for (var k = 0; k < 14; k++) { var l = basicBox(.9, .12, .05, LIME); l.position.set(0, .6 + k * .27, .78); rack.add(l); leds.push(l); } rack.position.set(7.0, 0, -3); g.add(rack);
  var spineMat = new THREE.MeshBasicMaterial({ color: CYN, transparent: true, opacity: .55 }), lane = bar(new V3(0, .06, 40), new V3(0, .06, 0), CYN, .05, .5); g.add(lane);
  var E1 = lab('1,00,000 TICKETS', IVO, 1.45, { font: '400 54px Bungee', bg: true }), E2 = lab('÷ 3,600 SECONDS', IVO, 1.45, { font: '400 54px Bungee', bg: true }), E3 = lab('≈ 28 / SECOND', AMB, 1.9, { font: '400 74px Bungee', bg: true }),
    LS = lab('28 / SEC · EK TIDY LINE', CYN, 1.1, { fs: 44, bg: true }), RK = lab('EK CHHOTA SERVER: OK ✓', LIME, 1.1, { fs: 40, bg: true }), RKX = lab('EK PAL, EK GATE ✗', RED, 1.1, { fs: 40, bg: true }), CD = card('CONCURRENCY', 'sabka ek hi pal mein aana,\nek hi seat ke liye', MAG, 3.4);
  var a = SC[1], tS = WS('n3', 'सबका', .3), A0 = fr([0, 2, 8], 40, 24, 0, 38, 930), A1 = fr([0, 1.5, 10], 34, 7, 0, 38, 880);
  PL(g, E1, A0, 540, 300, 36, 84); PL(g, E2, A0, 540, 405, 36, 84); PL(g, E3, A0, 540, 530, 36, 112); PL(g, LS, A0, 540, 880, 36, 70); PL(g, RK, A0, 700, 640, 36, 62); PL(g, RKX, A1, 540, 740, 34, 74); PL(g, CD, A1, 540, 430, 34, 250);
  lock(1, 'locked high', a, A0); sh(1, 'crane-out', tS - .2, tS + 3.4, A0, A1);
  SCN[1] = function (t) { g.visible = true; put(E1, t, WS('n1', 'लाख', .45), .35, tS - .3); put(E2, t, WS('n1', 'घंटा', .6), .35, tS - .3); put(E3, t, WS('n1', 'अट्ठाईस', .85), .45, tS - .3); put(LS, t, WS('n1', 'यानी', .75) + .2, .4, tS); put(RK, t, WS('n2', 'सर्वर', .5), .4, tS); put(RKX, t, tS + 1.6, .4);
    put(CD, t, WS('n3', 'एक', .35) + 1.5, .5, WS('n3', 'पाँच', .6) + .5);
    line.update(function (i, o) { var z = ((t * 3.2 + i * 1.3) % 40); o.z = 40 - z; o.x = Math.sin(i * 7.1) * .12; o.y = z < 40 ? brow(i, t) : 0; o.ry = Math.PI; o.s = o.z < -3 ? 0 : 1; });
    var tt = t - tS; cr.visible = t >= WS('n3', 'सबका', .3) - 3.0; if (cr.visible) { cr.update(function (i, o) { var sx = (hash(i) - .5) * 52, sz = 26 + hash(i + 1) * 62, gx = (hash(i + 2) - .5) * 13, gz = 3 + hash(i + 3) * 17, dl = hash(i + 4) * 2.2, u = clamp((tt - dl + 1.6) / 3.0); var e = eo3(u); o.x = lerp(sx, gx, e); o.z = lerp(sz, gz, e); o.ry = Math.PI + (hash(i + 5) - .5) * .5; o.y = u > 0 && u < 1 ? brow(i, t) : 0; o.s = .9 + hash(i + 6) * .25; }); }
    var over = clamp((t - tS - .6) / 2); leds.forEach(function (l, k) { var on = hash(k + Math.floor(t * 8)) > .3; l.material.color.setHex(over > .3 ? (hash(k + Math.floor(t * 14)) > .5 ? RED : 0x401010) : (on ? LIME : 0x14301a)); }); rack.position.x = 7.0 + Math.sin(t * 60) * .05 * over;
    var th = SP('n3', 0); lane.visible = true; }; })();
