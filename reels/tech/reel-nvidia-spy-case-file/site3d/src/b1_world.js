/* Part B1 (Nvidia case file): ONE continuous 3D desk; the camera travels along it from exhibit to exhibit. Halftone print look comes from the post pass. Pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, eob = e.eob, put = e.put, B = window.B, K = B.K, M = B.M, box = B.box, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS, HEX = e.HEX;
var SC = window.SC = [0, S0('c1'), S0('n1'), S0('e1'), S0('s1'), S0('u1'), S0('r1')];
window.GR = []; window.SCN = []; window.SHAKES = [];
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.sw = sw;
var W = new THREE.Group(); S.add(W); GR.push(W);
function add(o, x, y, z) { o.position.set(x, y, z); W.add(o); return o; }
var CS = { green: '#1d9a69', violet: '#7b4bd0', red: '#e1362f', grey: '#8a7a62', ink: '#13172a', cobalt: '#2c4bd8', mari: '#ffb300' };
/* lights + ground */
var DL = new THREE.DirectionalLight(0xfff0d0, 2.4); DL.position.set(-12, 24, 14); S.add(DL); S.add(new THREE.AmbientLight(0xffe8c0, .55));
var desk = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), new THREE.MeshStandardMaterial({ map: B.deskTex(), roughness: .95, metalness: 0, envMapIntensity: .3 })); desk.rotation.x = -Math.PI / 2; W.add(desk);
/* stamps: every stamp = tool + impression, contact time, position */
var STAMPS = [];
function stamp(txt, col, w, x, z, rot, tc, o) { var imp = B.impress(txt, col, w, o), tool = B.stampTool(new THREE.Color(col).getHex()); W.add(imp); W.add(tool); imp.visible = false; tool.visible = false; var s = { imp: imp, tool: tool, x: x, z: z, rot: rot, tc: tc, y: o && o.y }; STAMPS.push(s); return s; }
/* ---------- SCENE 1: the case folder (x = 0) ---------- */
var F0 = B.folder('FILE NVDA-1108', 'CASE NO. 14', { w: 6.2, h: 8.4 }); add(F0, 0, 0, 0); F0.rotation.y = .03;
for (var q = 0; q < 3; q++) { var fq = B.folder(['FILE 1107', 'FILE 1106', 'FILE 1105'][q], '', { w: 6, h: 8, fs: 50 }); add(fq, -9.4 - q * .5, q * .22, -1 + q * .5); fq.rotation.y = .12 - q * .09; }
add(B.pencil(), 5.6, 0, -4.5).rotation.y = .5; add(B.clip(), 4.2, 0, 3.6); add(B.clip(), -4.6, 0, 5.4).rotation.y = 1; add(B.ring(1.1), 6.5, 0, 3.5); add(B.ring(.9), -6.6, 0, -6);
var tH1 = S0('h1'), tH2 = S0('h2');
var tS1 = [WS('h1', 'चिठ्ठी|चिठ', .2), WS('h1', 'जांच|जाँच', .55), WS('h1', 'बयान', .88), WS('h2', 'सबूत', .15)];
var st1 = [stamp('CONFIRMED', CS.green, 4.8, 0, -.5, -.12, tS1[0]), stamp('ALLEGED', CS.violet, 4.0, .2, 1.2, .10, tS1[1]), stamp('DENIED', CS.red, 3.6, -.3, 2.8, -.07, tS1[2]), stamp('UNPROVEN', CS.grey, 4.8, 0, 4.0, .05, tS1[3], { fs: 130 })];
/* ---------- SCENE 2: the letter (x = 17) ---------- */
var LX = 17, tC1 = S0('c1'), tC2 = S0('c2');
var QT = 'I was unfaithful to my wife. My actions hurt her and our children.';
var LET = B.sheet(7.4, 9.6, function () { }, { ppu: 100 }); add(LET, LX, 0, 0); LET.rotation.y = -.03; LET.scale.setScalar(.84);
function paintLetter(frac) { LET.userData.paint(function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 26px "JetBrains Mono"'; x.fillText('NVIDIA · OPEN LETTER · 8 NOV 2026', 50, 70); x.fillStyle = '#2c4bd8'; x.fillText('AS REPORTED (AP, THE NEURON)', 50, 108); x.fillStyle = 'rgba(19,23,42,.55)'; x.fillRect(50, 130, W_ - 100, 4);
  x.fillStyle = '#13172a'; x.font = '400 56px "Alfa Slab One"'; var lines = B.wrap(x, QT, W_ - 110), n = Math.floor(QT.length * frac), used = 0; lines.forEach(function (l, i) { var seg = l.slice(0, Math.max(0, Math.min(l.length, n - used))); used += l.length + 1; x.fillText(seg, 50, 250 + i * 76); });
  if (frac >= 1) { x.fillStyle = 'rgba(255,179,0,.5)'; x.fillRect(46, 400, 560, 14); } x.fillStyle = '#13172a'; x.font = '700 28px "JetBrains Mono"'; x.fillText('"I support the investigation and will', 50, 700); x.fillText(' cooperate fully."', 50, 738); x.fillStyle = 'rgba(19,23,42,.6)'; x.fillText('— HUANG, SAME LETTER', 50, 800); }); }
paintLetter(0); var lastFrac = -1;
var NOTE = B.sheet(4.6, 3.4, function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 24px "JetBrains Mono"'; x.fillText('NVIDIA BOARD · 8 NOV', 24, 44); x.font = '800 30px Inter'; x.fillText('Independent directors', 24, 100); x.fillText('+ outside lawyers', 24, 142); x.fillStyle = '#2c4bd8'; x.font = '700 24px "JetBrains Mono"'; x.fillText('INVESTIGATION OPENED', 24, 196); }, { ppu: 100, bg: '#fbe7a0' }); add(NOTE, LX + 3.4, .06, 6.1); NOTE.rotation.y = .1; NOTE.scale.setScalar(.8);
var st2 = [stamp('CONFIRMED', CS.green, 4.2, LX + .5, .9, -.1, WS('c2', 'कंफरमड|कंफर', .5)), stamp('REPORTEDLY', CS.violet, 4.4, LX + .2, 3.6, .1, WS('c2', 'रिपोटेडली|रिपोट', .95), { fs: 120 })];
/* ---------- SCENE 3: allegation (x = 34) ---------- */
var AX = 34, tN1 = S0('n1');
var PA = B.plate('A.H.', 'FORMER MEGASPEED EXEC'); add(PA, AX, 0, -6.4); var PJ = B.plate('J.H.', 'NVIDIA CEO'); add(PJ, AX, 0, -1.9);
var TAGP = B.sheet(3.4, 1.3, function (x, W_, H_) { x.fillStyle = '#13172a'; x.textAlign = 'center'; x.font = '700 38px "JetBrains Mono"'; x.fillText('NOT RELATED', W_ / 2, 70); x.font = '700 22px "JetBrains Mono"'; x.fillText('same surname only', W_ / 2, 108); }, { ppu: 100, bg: '#ffd966' }); add(TAGP, AX, .6, -4.15); TAGP.rotation.y = .05;
var MF = B.folder('MEGASPEED', 'SINGAPORE · CHIP BUYER', { w: 4.6, h: 6.2, fs: 44 }); add(MF, AX - 1.2, 0, 3.6); MF.rotation.y = -.08;
/* export gate + crates */
var GATE = new THREE.Group(); W.add(GATE); GATE.position.set(AX + .2, 0, 10.2); var pl1 = box(.5, 3.4, .5, 0x2c3a60), pl2 = box(.5, 3.4, .5, 0x2c3a60), bm = box(5.6, .5, .6, 0x2c3a60); pl1.position.set(-2.4, 1.7, 0); pl2.position.set(2.4, 1.7, 0); bm.position.set(0, 3.6, 0); GATE.add(pl1, pl2, bm);
var gsign = B.plane(5.2, .9, B.tcv(780, 135, function (x, W_, H_) { x.fillStyle = '#ffb300'; x.fillRect(0, 0, W_, H_); x.fillStyle = '#13172a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 40px "JetBrains Mono"'; x.fillText('EXPORT LIMITS · ILLUSTRATIVE', W_ / 2, H_ / 2); })); gsign.position.set(0, 3.6, .32); GATE.add(gsign);
var belt = box(9, .25, 1.8, 0x3b3f55); belt.position.set(0, .13, 0); GATE.add(belt); var CR = []; for (var c = 0; c < 6; c++) { var cr = box(1.0, .9, .9, 0xc89a55); GATE.add(cr); CR.push(cr); }
var st3 = [stamp('ALLEGED', CS.violet, 4.0, AX, -9.3, -.08, WS('n1', 'चीन|इंटेलिजेंस', .75)), stamp('MEMO NOT PUBLISHED', CS.grey, 4.4, AX - 1.1, 4.4, .06, WS('n2', 'पब्लिक', .3), { fs: 72, asp: .26 })];
/* ---------- SCENE 4: the evidence board (x = 56) ---------- */
var BX = 56, BZ = -10, tE1 = S0('e1');
var cork = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 18), new THREE.MeshBasicMaterial({ map: e.canvasTex(B.tcv(1024, 512, function (x, W_, H_) { x.fillStyle = '#b98a52'; x.fillRect(0, 0, W_, H_); for (var i = 0; i < 4200; i++) { x.fillStyle = 'rgba(' + (hash(i) > .5 ? '90,56,24' : '230,190,130') + ',' + hash(i * 3) * .35 + ')'; x.beginPath(); x.arc(hash(i * 5) * W_, hash(i * 7 + 1) * H_, 1 + hash(i * 11) * 3, 0, 6.283); x.fill(); } x.strokeStyle = '#5b3a1b'; x.lineWidth = 22; x.strokeRect(0, 0, W_, H_); })) })); cork.position.set(BX, 7.6, BZ); W.add(cork);
var CARDS = [['NVIDIA BOARD', '"No reason to believe', 'secrets were compromised"', CS.green, 'STATEMENT'], ['CHINA FOREIGN MINISTRY', '"Unsubstantiated.', 'Nothing but smears"', CS.red, 'DENIED'], ['SINGAPORE MHA · 31 OCT', '"Never investigated her', 'over intelligence ties"', CS.violet, 'STATEMENT'], ['US INTELLIGENCE MEMO', 'Reported by NYT.', 'Not public.', CS.grey, 'UNPROVEN']];
var CP = CARDS.map(function (cd, i) { var g = new THREE.Group(), pl = B.plane(4.0, 5.7, B.tcv(560, 800, function (x, W_, H_) { x.fillStyle = '#f3ead2'; x.fillRect(0, 0, W_, H_); x.fillStyle = cd[3]; x.fillRect(0, 0, W_, 92); x.fillStyle = '#f3ead2'; x.font = '700 29px "JetBrains Mono"'; x.fillText(cd[0], 22, 56); x.fillStyle = '#13172a'; x.font = '800 36px Inter'; x.fillText(cd[1], 24, 190); x.fillText(cd[2], 24, 240); x.strokeStyle = 'rgba(19,23,42,.6)'; x.lineWidth = 5; x.setLineDash([16, 12]); x.strokeRect(24, 330, W_ - 48, 370); x.setLineDash([]); x.fillStyle = 'rgba(19,23,42,.45)'; x.font = '700 24px "JetBrains Mono"'; x.fillText('EVIDENCE ATTACHED:', 40, 372); x.fillStyle = 'rgba(19,23,42,.55)'; x.font = '400 190px "Alfa Slab One"'; x.textAlign = 'center'; x.fillText('?', W_ / 2, 590); x.font = '700 28px "JetBrains Mono"'; x.fillText('NONE PUBLISHED', W_ / 2, 665); })); g.add(pl); var pin = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 10), M(0xd0342c, { roughness: .35 })); pin.position.set(0, 2.6, .2); g.add(pin); g.position.set(BX + (i % 2 ? 2.25 : -2.25), 9.8 - (i > 1 ? 5.3 : 0), BZ + .15); g.rotation.z = [.03, -.04, .05, -.02][i]; g.userData.y0 = g.position.y; W.add(g); return g; });
var STR = []; for (var si = 0; si < 3; si++) { var ln = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 1, 6), new THREE.MeshBasicMaterial({ color: 0xc02a24 })); W.add(ln); STR.push(ln); }
function seg(m, a, b) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a.clone().add(b).multiplyScalar(.5)); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); }
var tCard = [S0('e1') + .6, WS('e1', 'चीन', .5) - .2, WS('e1', 'सिंगापुर', .5) - .2, S0('e2') + .3];
/* ---------- SCENE 5: the chart (x = 80) ---------- */
var CX = 80, tSt1 = S0('s1');
var chartBoard = B.plane(9.6, 10.6, B.tcv(720, 795, function (x, W_, H_) { x.fillStyle = '#f3ead2'; x.fillRect(0, 0, W_, H_); x.strokeStyle = '#13172a'; x.lineWidth = 10; x.strokeRect(5, 5, W_ - 10, H_ - 10); x.fillStyle = '#13172a'; x.font = '700 30px "JetBrains Mono"'; x.fillText('NVDA · PRE-MARKET', 36, 66); x.fillText('MON 9 NOV (AP)', 36, 106); x.fillStyle = '#2c4bd8'; x.font = '700 24px "JetBrains Mono"'; x.fillText('ABOUT -5%, AS REPORTED', 36, 146); x.fillText('BARS ILLUSTRATIVE', 36, 180); x.fillStyle = 'rgba(19,23,42,.25)'; x.fillRect(36, 735, W_ - 72, 5); })); add(chartBoard, CX, 6.0, BZ + .2);
var BARS = []; for (var bi = 0; bi < 6; bi++) { var bh = [4.6, 4.8, 4.7, 4.9, 4.8, 4.6][bi], bar = box(1.1, 1, .5, bi === 5 ? 0xe1362f : 0x2c4bd8, { roughness: .9 }); bar.userData.h = bh; W.add(bar); BARS.push(bar); }
var crate = box(3.2, 2.4, 3.0, 0xc89a55); add(crate, CX + 2.6, 1.2, 2.2); var crl = B.plane(2.8, 1.0, B.tcv(420, 150, function (x, W_, H_) { x.fillStyle = '#13172a'; x.fillRect(0, 0, W_, H_); x.fillStyle = '#ffb300'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 44px "JetBrains Mono"'; x.fillText('AI CHIPS', W_ / 2, H_ * .35); x.font = '700 22px "JetBrains Mono"'; x.fillText('ILLUSTRATIVE', W_ / 2, H_ * .75); })); crl.position.set(CX + 2.6, 1.4, 3.72); W.add(crl);
/* ---------- SCENE 6: what we don't know (x = 100) ---------- */
var UX = 100, tU1 = S0('u1'), tU2 = S0('u2');
var LST = ['NO CHARGE', 'NO PUBLIC FINDING SHE WORKED FOR CHINA', 'NO PUBLIC EVIDENCE HE SHARED A SECRET'];
var UL = B.sheet(7.6, 9.4, function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 28px "JetBrains Mono"'; x.fillText('WHAT IS NOT KNOWN · 9 NOV', 44, 66); x.fillStyle = 'rgba(19,23,42,.55)'; x.fillRect(44, 90, W_ - 88, 4); }, { ppu: 100 }); add(UL, UX, 0, 0); UL.scale.setScalar(.8);
function paintList(n) { UL.userData.paint(function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 28px "JetBrains Mono"'; x.fillText('WHAT IS NOT KNOWN · 9 NOV', 44, 66); x.fillStyle = 'rgba(19,23,42,.55)'; x.fillRect(44, 90, W_ - 88, 4);
  for (var i = 0; i < 3; i++) { var by = 170 + i * 190; x.fillStyle = '#13172a'; x.font = '800 44px Inter'; var ls = B.wrap(x, LST[i], W_ - 150); ls.forEach(function (l, k) { x.fillText(l, 100, by + k * 52); }); x.strokeStyle = '#13172a'; x.lineWidth = 5; x.strokeRect(44, by - 38, 36, 36); var f = clamp(n - i); if (f > 0) { x.strokeStyle = '#e1362f'; x.lineWidth = 9; x.beginPath(); x.moveTo(44, by - 20); x.lineTo(44 + (W_ - 88) * f, by - 20 + (hash(i) - .5) * 10); x.stroke(); x.beginPath(); x.moveTo(50, by - 34); x.lineTo(76, by - 6); x.moveTo(76, by - 34); x.lineTo(50, by - 6); x.stroke(); } } }); }
var st6 = [stamp('UNPROVEN', CS.grey, 4.8, UX, 2.6, -.06, WS('u2', 'पता|नहीं', .9, true), { fs: 140 })];
/* ---------- SCENE 7: closing desk (x = 120) ---------- */
var EX = 120, tR1 = S0('r1'), tCta = S0('cta');
add(B.folder('FILE NVDA-1108', 'CASE NO. 14', { w: 6.2, h: 8.4 }), EX, 0, -1);
var st7 = [stamp('CASE OPEN', CS.red, 4.8, EX, .2, -.1, tCta + .1, { fs: 120 })];
window.STAMPT = STAMPS.map(function (s) { return s.tc; }); window.HOLEAT = [st1[3].tc, st6[0].tc, st7[0].tc];
/* per-frame world state */
SCN[0] = SCN[1] = SCN[2] = SCN[3] = SCN[4] = SCN[5] = SCN[6] = function (t) {
  W.visible = true; S.background = new THREE.Color(0xcdb98c); S.fog = null; e.POST.half = window.__noHalf ? 0 : 1;
  STAMPS.forEach(function (s) { B.slam(s.tool, s.imp, t, s.tc, s.x, s.z, s.rot, { y: s.y }); });
  window.SHAKES = STAMPS.map(function (s) { return { t: s.tc, a: s.imp.userData.base > 5 ? .5 : .35 }; });
  /* letter typing */
  var fr = clamp((t - (tC1 + .5)) / 2.6); fr = Math.round(fr * QT.length) / QT.length; if (fr !== lastFrac) { paintLetter(fr); lastFrac = fr; }
  /* scene 3: crates flow through the gate, 2 stop before the beam */
  CR.forEach(function (cr, i) { var u = ((t * .5 + i / CR.length) % 1), x = lerp(-4.2, 4.2, u); cr.position.set(x, .8, 0); cr.visible = t > tN1 - 1; });
  /* scene 4: cards drop in, strings link them to the first card */
  CP.forEach(function (g, i) { var u = clamp((t - tCard[i]) / .45), k = eob(u); g.visible = u > 0; g.scale.setScalar(Math.max(.001, k) * .9); g.position.y = g.userData.y0 + (1 - eo3(u)) * 6; });
  var c0 = CP[0].position.clone(); c0.z += .5; for (var q2 = 0; q2 < 3; q2++) { var a = CP[q2].position.clone(), b2 = CP[q2 + 1].position.clone(); a.z += .5; a.y += 2.6; b2.z += .5; b2.y += 2.6; STR[q2].visible = CP[q2 + 1].visible; seg(STR[q2], a, b2); }
  /* scene 5: bars grow, last one drops ~5 % */
  var d5 = sw(S0('s2') + .2, S0('s2') + 1.4, t); BARS.forEach(function (b, i) { var u = clamp((t - (tSt1 + .3 + i * .18)) / .5), h = b.userData.h * eo3(u) * (i === 5 ? 1 - .05 * eo3(d5) * 6 : 1); h = Math.max(.001, h); b.scale.y = h; b.position.set(CX - 3.35 + i * 1.34, .85 + h / 2, BZ + .55); b.visible = u > 0; });
  /* scene 6 list */
  paintList(clamp((t - (tU1 + 1.2)) / 8) * 3);
};
/* ---------- authored camera ---------- */
function shot(name, t0, t1, p0, l0, f0, p1, l1, f1, ez) { e.shot(0, name, t0, t1, p0, l0, f0, p1, l1, f1, ez || 'io'); }
var h2 = S0('h2'), c1 = S0('c1'), c2 = S0('c2'), n1 = S0('n1'), n3 = S0('n3'), e1 = S0('e1'), e2 = S0('e2'), s1 = S0('s1'), s2 = S0('s2'), u1 = S0('u1'), u2 = S0('u2'), r1 = S0('r1'), cta = S0('cta');
function over(x, z, d, up) { return { p: [x, d * .78, z + d * .62], l: [x, 0, z + d * (up == null ? .07 : up)] }; }
function sh2(name, t0, t1, A, B2, f0, f1, ez) { shot(name, t0, t1, A.p, A.l, f0 || 38, B2.p, B2.l, f1 || f0 || 38, ez); }
var O1 = over(0, 0, 25), O1b = over(0, 2.4, 20), OL = over(LX, 0, 25), OLb = over(LX + .3, .6, 21), OA = over(AX, -5, 25), OB = over(AX, 5, 30, .12), OBo = over(BX, 7, 1), OC = over(CX, 0, 27), OU = over(UX, 0, 26), OUb = over(UX, .6, 22), OE = over(EX, -1, 26, .24), OEb = over(EX, -1, 30, .28);
var BD = function (z) { return { p: [BX, 7.4, BZ + 33], l: [BX, 6.2, BZ] }; };
sh2('locked wide on the case folder', 0, h2 - .2, O1, O1);
sh2('slow push to the last stamp', h2 - .2, c1 - .15, O1, O1b);
sh2('pan across the desk to the letter', c1 - .15, c1 + 2.2, O1b, OL);
sh2('slow push on the quote', c1 + 2.2, c2 + 2.8, OL, OLb);
sh2('hold on the letter', c2 + 2.8, n1 - .1, OLb, OLb);
sh2('pan to the name plates', n1 - .1, n1 + 2.4, OLb, OA);
sh2('hold on plates and tag', n1 + 2.4, WS('n4', 'सपीट|मेगा', .1) - .3, OA, OA);
sh2('track to the folder and gate', WS('n4', 'सपीट|मेगा', .1) - .3, e1 - .1, OA, OB);
shot('crane to the evidence board', e1 - .1, e1 + 1.8, OB.p, OB.l, 38, [BX, 7.4, BZ + 33], [BX, 6.2, BZ], 38, 'io');
shot('slow push on the board', e1 + 1.8, s1 - .1, [BX, 7.4, BZ + 33], [BX, 6.2, BZ], 38, [BX, 7.2, BZ + 30], [BX, 6.0, BZ], 36, 'io');
shot('pan to the chart', s1 - .1, s1 + 2.0, [BX, 7.2, BZ + 30], [BX, 6.0, BZ], 36, [CX, 6.4, BZ + 31], [CX, 4.7, BZ], 38, 'io');
shot('hold on the chart', s1 + 2.0, u1 - .1, [CX, 6.4, BZ + 31], [CX, 4.7, BZ], 38, [CX, 6.4, BZ + 31], [CX, 4.7, BZ], 38, 'io');
sh2('pan to the list', u1 - .1, u1 + 2.0, { p: [CX, 6.4, BZ + 31], l: [CX, 4.7, BZ] }, OU);
sh2('slow push on the list', u1 + 2.0, r1 - .1, OU, OUb);
sh2('pan back to the closing desk', r1 - .1, r1 + 2.2, OUb, OE);
sh2('pull back, locked for the end card', r1 + 2.2, cta + 3.0, OE, OEb, 40, 40, 'o');
})();
