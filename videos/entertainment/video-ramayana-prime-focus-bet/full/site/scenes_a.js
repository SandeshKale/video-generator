// Scenes for groups 1-12. Each: SCN[g] = function(p, u) where p = 0..1 progress through the scene and u = seconds in scene. Pure functions.
var SCN = {};
SCN.bg = {};
// g1: hook, split screen with one shared scale (area honest)
SCN[1] = function (p, u) {
  var SA = 520 / 5062; cx.save(); cam(1.0, 1.04, p);
  cx.fillStyle = C.paper; cx.fillRect(-40, -40, 1000, H + 80); grid('rgba(20,24,36,.05)', 120);
  cx.save(); cx.beginPath(); cx.rect(960, 0, 960, H); cx.clip(); cx.fillStyle = C.navy; cx.fillRect(960, 0, 960, H); grid('rgba(255,255,255,.04)', 120); cx.restore();
  var d = eo(pr(p, .01, .12)); fillRR(954, 500 - 500 * d, 12, 1000 * d, 6, C.gold);
  var base = 900, cw = 360, lx = 480 - cw / 2, rx = 1440 - cw / 2;
  var g = eo(pr(p, .1, .42)), gH = 1547 * SA * g; shadowRR(lx, base - gH, cw, gH, 18, C.ink, 12); fillRR(lx, base - gH, cw, gH, 18, C.teal);
  cx.save(); rr(lx, base - gH, cw, gH, 18); cx.clip(); for (var r = 0; r < 4; r++) { var k = eo(pr(p, .12 + r * .03, .18 + r * .03)); ticket(lx + 28, base - 66 - r * 66 + (1 - k) * 24, cw - 56, 46, 'rgba(255,255,255,.22)', k); } cx.restore();
  for (var i = 0; i < 6; i++) { var fp = (p - .17 - i * .045) / .27; if (fp > 0 && fp < 1) { var fx = 480 + (i - 2.5) * 52 + fp * (i % 2 ? 70 : -70), fy = base - gH - 10 - Math.sin(fp * Math.PI) * 120 + fp * 30; cx.save(); cx.translate(fx, fy); cx.rotate(fp * 2.4 * (i % 2 ? 1 : -1)); ticket(-26, -16, 52, 32, i % 2 ? C.gold : C.teal, 1 - fp * .7); cx.restore(); } }
  var dd = eo(pr(p, .56, .8)), dH = 5062 * SA * dd; shadowRR(rx, base - dH, cw, dH, 18, '#000', 12); fillRR(rx, base - dH, cw, dH, 18, C.red);
  cx.save(); rr(rx, base - dH, cw, dH, 18); cx.clip(); for (var j = 0; j < 8; j++) { var rs = eo(pr(p, .56 + j * .02, .62 + j * .02)); for (var q = 0; q < 4; q++) coin(rx + 58 + q * 82, base - 50 - j * 58, 22 * rs, .95); } cx.restore();
  fillRR(lx - 40, base + 4, cw + 80, 8, 4, C.ink, .8); fillRR(rx - 40, base + 4, cw + 80, 8, 4, C.grey, .8);
  var a1 = eo(pr(p, .06, .14)), a2 = eo(pr(p, .5, .58)), pop = 1 + .05 * Math.sin(pr(p, .8, .86) * Math.PI);
  cx.save(); cx.globalAlpha = a1; ticket(430, 62, 100, 64, C.teal); cx.restore(); cx.save(); cx.globalAlpha = a2; bank(1440, 108, 42, C.red); cx.restore();
  cx.save(); cx.translate(480, 340); cx.scale(pop, pop); num('₹' + inr(1547 * g), 0, 0, 170, C.teal, 'center', a1); cx.restore();
  cx.save(); cx.translate(1440, 340); cx.scale(pop, pop); num('₹' + inr(5062 * dd), 0, 0, 170, C.red, 'center', a2); cx.restore();
  tag('WORLDWIDE GROSS · 15 DAYS · EST.', 480, 940, C.ink, 'center', a1); tag('PRIME FOCUS GROSS DEBT · REPORTED', 1440, 940, C.grey, 'center', a2);
  cx.restore();
};
// g2: two queues (theatre line vs bank line)
SCN[2] = function (p, u) {
  cx.fillStyle = C.paper; cx.fillRect(0, 0, W, H); grid('rgba(20,24,36,.045)', 120); cx.fillStyle = C.navy; cx.fillRect(960, 0, 960, H); grid('rgba(255,255,255,.035)', 120);
  cx.save(); cx.beginPath(); cx.rect(0, 0, 960, H); cx.clip(); cx.fillStyle = C.paper; cx.fillRect(0, 0, 960, H); grid('rgba(20,24,36,.045)', 120); cx.restore();
  fillRR(954, 0, 12, 1000, 6, C.gold);
  var sc = u * 150; for (var i = 0; i < 9; i++) { var x = (i * 150 + sc) % 1350 - 200; if (x < 960 - 130) ticket(x + 140, 470, 130, 82, i % 3 ? C.teal : C.tealL, eo(pr(p, 0, .15))); }
  for (var j = 0; j < 8; j++) { var y = 470; var x2 = 1000 + ((j * 130 + sc * .55) % 1040); coin(Math.min(x2, 1850), y + 40, 46, eo(pr(p, .1, .3))); }
  line(40, 600, 920, 600, C.ink, 4, .35); line(1000, 600, 1880, 600, C.grey, 4, .5);
  var a = eo(pr(p, .05, .2)), b = eo(pr(p, .3, .45)); ticket(430, 260, 100, 64, C.teal, a); bank(1440, 300, 46, C.red); cx.globalAlpha = 1;
  tag('THEATRE LINE', 480, 700, C.ink, 'center', a); tag('BANK LINE', 1440, 700, C.grey, 'center', b);
  tag('NOT THE SAME LINE', 960, 960, C.ink, 'center', eo(pr(p, .55, .75)));
};
// g3: chapter map
SCN[3] = function (p, u) {
  bgPaper(); var xs = [260, 640, 1020, 1400, 1700], ys = 540; line(160, ys, 1780, ys, C.ink, 6, .25, [2, 16]);
  var items = [function (a) { building(xs[0], ys - 20, 90, C.sepiaDk); }, function (a) { trophy(xs[1], ys, 70, C.gold); }, function (a) { filmFrame(xs[2] - 40, ys - 70, 80, 130, C.red); line(xs[2] - 70, ys + 70, xs[2] + 70, ys - 70, C.ink, 10); }, function (a) { big('?', xs[3], ys + 40, 150, C.teal, 'center'); }];
  var lab = ['GARAGE', '8 OSCARS', 'STRIKE', 'THE NUMBER'];
  for (var i = 0; i < 4; i++) { var k = ob(pr(p, .08 + i * .17, .22 + i * .17)); if (k <= 0) continue; cx.save(); cx.translate(xs[i], ys); cx.scale(k, k); cx.translate(-xs[i], -ys); circ(xs[i], ys, 130, i == 1 ? 'rgba(242,178,48,.2)' : 'rgba(20,24,36,.07)'); items[i](); cx.restore(); tag(lab[i], xs[i], ys + 210, C.ink, 'center', eo(pr(p, .12 + i * .17, .3 + i * .17))); }
  var t = eo(pr(p, .78, .92)); tag('BUSINESS ONLY · NO FAITH · NO ACTING', 960, 940, C.grey, 'center', t);
};
// g4: gross / net / producer (ILLUSTRATIVE widths)
SCN[4] = function (p, u) {
  bgPaper(); var X0 = 380, Wd = 1200; var rows = [['GROSS', C.teal, 1], ['NET', C.tealL, .84], ['PRODUCER', C.gold, .46]];
  for (var i = 0; i < 3; i++) { var y = 260 + i * 220, k = eo(pr(p, .05 + i * .22, .2 + i * .22)); fillRR(X0, y, Wd, 130, 20, 'rgba(20,24,36,.06)'); fillRR(X0, y, Wd * rows[i][2] * k, 130, 20, rows[i][1]); tag(rows[i][0], X0 - 30, y + 78, C.ink, 'right', k); if (i == 0) { ticket(X0 + 30, y + 30, 120, 70, 'rgba(255,255,255,.35)', k); } }
  var k2 = eo(pr(p, .35, .5)); cx.save(); cx.globalAlpha = k2; cx.fillStyle = C.red; for (var j = 0; j < 3; j++) fillRR(X0 + Wd * .84 + j * 56, 260 - 10, 38, 150, 8, 'rgba(224,69,75,.85)'); cx.restore(); tag('TAX', X0 + Wd * .92, 245, C.red, 'center', k2);
  var k3 = eo(pr(p, .6, .78)); cx.save(); cx.globalAlpha = k3; cx.setLineDash([12, 10]); cx.strokeStyle = C.ink; cx.lineWidth = 4; rr(X0 + Wd * .46, 700, Wd * .38, 130, 20); cx.stroke(); cx.restore(); big('?', X0 + Wd * .65, 800, 110, C.ink, 'center', k3);
  tag('ILLUSTRATIVE WIDTHS · THE SPLIT IS NOT PUBLIC', 960, 960, C.grey, 'center', eo(pr(p, .8, .95)));
};
// g5: 1995 garage
SCN[5] = function (p, u) {
  cx.save(); cam(1.0, 1.06, p, 900, 560); bgSepia(); var par = function (k) { cx.translate(-(p - .5) * 40 * k, 0); };
  cx.save(); par(.4); fillRR(260, 120, 1060, 720, 8, C.sepia2); cx.strokeStyle = 'rgba(90,70,48,.16)'; cx.lineWidth = 3; cx.beginPath(); for (var by = 168; by < 820; by += 48) { cx.moveTo(260, by); cx.lineTo(1320, by); } cx.stroke(); var up = eo(pr(p, .05, .3)), sh = 56 + 300 * (1 - up * .85); fillRR(340, 150, 900, sh, 6, '#CDB68A'); cx.strokeStyle = 'rgba(90,70,48,.25)'; cx.beginPath(); for (var s = 40; s < sh; s += 40) { cx.moveTo(340, 150 + s); cx.lineTo(1240, 150 + s); } cx.stroke(); fillRR(332, 140, 916, 14, 5, C.sepiaDk); cx.restore();
  cx.save(); par(.7); var sw = Math.sin(u * 2.2) * .09 * Math.exp(-u * .25); cx.translate(790, 120); cx.rotate(sw); cx.fillStyle = C.sepiaDk; cx.fillRect(-2, 0, 4, 116); circ(0, 150, 92, 'rgba(255,214,120,.28)'); circ(0, 150, 54, 'rgba(255,214,120,.45)'); circ(0, 150, 24, '#FFD470'); cx.restore();
  cx.save(); par(1.0); var dk = eo(pr(p, .1, .3)); cx.translate(0, (1 - dk) * 180); cx.globalAlpha = dk; fillRR(380, 702, 800, 28, 6, C.sepiaDk); fillRR(420, 730, 24, 150, 4, C.sepiaDk); fillRR(1116, 730, 24, 150, 4, C.sepiaDk); shadowRR(540, 472, 300, 232, 22, C.sepiaDk, 10); fillRR(540, 472, 300, 232, 22, '#E6D8B6'); fillRR(566, 498, 248, 166, 12, '#0B2B26'); fillRR(630, 704, 120, 14, 4, '#E6D8B6'); fillRR(926, 678, 180, 24, 8, '#E6D8B6');
  cx.save(); cx.translate(690, 580); var ang = u * 1.5, P = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], pp = P.map(function (v) { var x = v[0] * Math.cos(ang) - v[2] * Math.sin(ang), z = v[0] * Math.sin(ang) + v[2] * Math.cos(ang), y = v[1] * Math.cos(.6) - z * Math.sin(.6); return [x * 38, y * 38]; }); cx.strokeStyle = '#2BE3B0'; cx.lineWidth = 4; cx.lineJoin = 'round'; cx.beginPath(); [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { cx.moveTo(pp[e[0]][0], pp[e[0]][1]); cx.lineTo(pp[e[1]][0], pp[e[1]][1]); }); cx.stroke(); cx.restore(); cx.restore();
  cx.save(); par(1.3); var bb = eo(pr(p, .2, .38)); cx.globalAlpha = bb; fillRR(1200, 700 + (1 - bb) * 90, 190, 150, 8, '#CBA874'); fillRR(1250, 590 + (1 - bb) * 90, 150, 110, 8, '#D9B985'); cx.restore();
  var cp = ob(pr(p, .3, .45)); if (cp > 0) { cx.save(); cx.translate(1470, 300); cx.rotate(-.06); cx.scale(cp, cp); shadowRR(-190, -150, 380, 330, 20, C.sepiaDk, 12); fillRR(-190, -150, 380, 330, 20, '#FFFDF6'); cx.save(); rr(-190, -150, 380, 330, 20); cx.clip(); cx.fillStyle = C.verm; cx.fillRect(-190, -150, 380, 82); cx.restore(); for (var h = -120; h <= 120; h += 80) circ(h, -150, 11, '#FFFDF6'); cx.font = '150px ' + NUM; cx.fillStyle = C.sepiaDk; cx.textAlign = 'center'; cx.fillText('1995', 0, 118); cx.restore(); }
  var ls = eo(pr(p, .5, .68)); if (ls > 0) { cx.save(); cx.translate(lerp(2300, 1520, ls), 760); cx.rotate(.05); shadowRR(-200, -90, 400, 180, 14, C.sepiaDk, 10); fillRR(-200, -90, 400, 180, 14, '#FFFFFF'); for (var l = 0; l < 3; l++) fillRR(-150, -48 + l * 34, 220 - l * 50, 10, 5, C.sepia3); cx.restore(); var st = ob(pr(p, .7, .82)); if (st > 0) { cx.save(); cx.translate(1620, 750); cx.rotate(-.18); cx.scale(st, st); cx.strokeStyle = C.red; cx.lineWidth = 8; rr(-120, -42, 240, 84, 14); cx.stroke(); cx.font = '64px ' + NUM; cx.fillStyle = C.red; cx.textAlign = 'center'; cx.fillText('LOAN', 0, 22); cx.restore(); } }
  tag('1995 · MUMBAI · BANK LOAN · GARAGE', 120, 940, C.sepiaDk, 'left', eo(pr(p, .55, .7))); cx.restore();
};
// g6: flood, fire, downturn on a timeline
SCN[6] = function (p, u) {
  bgSepia(); var y0 = 700; line(160, y0, 1760, y0, C.sepiaDk, 8, .5); for (var t = 0; t < 8; t++) line(160 + t * 228, y0 - 14, 160 + t * 228, y0 + 14, C.sepiaDk, 4, .5);
  var xs = [480, 960, 1440], ik = [function (x, y, s) { cx.save(); cx.strokeStyle = C.blue; cx.lineWidth = 14; cx.lineCap = 'round'; for (var r = 0; r < 3; r++) { cx.beginPath(); for (var i = 0; i <= 20; i++) { var xx = x - 130 + i * 13, yy = y - 40 + r * 50 + Math.sin(i * .9 + u * 2) * 12; if (i) cx.lineTo(xx, yy); else cx.moveTo(xx, yy); } cx.stroke(); } cx.restore(); }, function (x, y, s) { cx.save(); cx.translate(x, y + 80); cx.scale(s, s); cx.fillStyle = C.verm; cx.beginPath(); cx.moveTo(0, -250); cx.bezierCurveTo(120, -130, 150, -40, 90, 40); cx.bezierCurveTo(60, 80, -60, 80, -90, 40); cx.bezierCurveTo(-150, -40, -90, -140, 0, -250); cx.fill(); cx.fillStyle = C.gold; cx.beginPath(); cx.moveTo(0, -130); cx.bezierCurveTo(60, -60, 70, 0, 40, 40); cx.bezierCurveTo(20, 60, -30, 60, -40, 30); cx.bezierCurveTo(-70, -20, -30, -80, 0, -130); cx.fill(); cx.restore(); }, function (x, y, s) { var pts = [[x - 140, y - 90], [x - 60, y - 30], [x + 10, y - 70], [x + 80, y + 40], [x + 140, y + 100]]; draw(pts, 1, C.red, 16); cx.fillStyle = C.red; cx.beginPath(); cx.moveTo(x + 168, y + 108); cx.lineTo(x + 110, y + 130); cx.lineTo(x + 120, y + 62); cx.closePath(); cx.fill(); }];
  var lab = ['FLOOD', 'FIRE', 'DOWNTURN'];
  for (var i = 0; i < 3; i++) { var k = ob(pr(p, .1 + i * .25, .3 + i * .25)); if (k <= 0) continue; circ(xs[i], 420, 170 * Math.min(1, k), 'rgba(90,70,48,.1)'); cx.save(); cx.globalAlpha = Math.min(1, k); ik[i](xs[i], 420, Math.min(1, k)); cx.restore(); tag(lab[i], xs[i], 700 + 90, C.sepiaDk, 'center', eo(pr(p, .15 + i * .25, .35 + i * .25))); }
  var z = eo(pr(p, .78, .95)); line(160, y0, 160 + 1600 * z, y0, C.verm, 10);
  tag('"THE BUSINESS NEVER RUNS IN A STRAIGHT LINE"', 960, 960, C.sepiaDk, 'center', z, 22);
};
// g7: 2008 downturn + strike; 3D keeps the lights on
SCN[7] = function (p, u) {
  bgNavy(); var pts = [[260, 300], [520, 280], [760, 330], [980, 640], [1180, 760], [1420, 700], [1700, 520]]; var a = pr(p, .05, .55); tag('ORDERS', 200, 220, C.grey, 'left', eo(a));
  line(200, 840, 1780, 840, 'rgba(255,255,255,.2)', 3); line(200, 240, 200, 840, 'rgba(255,255,255,.2)', 3);
  var last = draw(pts, a, C.red, 10); circ(last[0], last[1], 14, C.red);
  var s = ob(pr(p, .4, .55)); if (s > 0) { cx.save(); cx.translate(980, 460); cx.rotate(-.1); cx.scale(s, s); cx.strokeStyle = C.gold; cx.lineWidth = 8; rr(-190, -50, 380, 100, 14); cx.stroke(); cx.font = '70px ' + NUM; cx.fillStyle = C.gold; cx.textAlign = 'center'; cx.fillText('2008', 0, 25); cx.restore(); }
  var r = ob(pr(p, .6, .78)); if (r > 0) { cx.save(); cx.translate(1480, 340); cx.scale(r, r); fillRR(-110, -70, 220, 140, 24, C.teal); cx.font = '90px ' + NUM; cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText('3D', 0, 32); cx.restore(); draw([[1480, 410], [1480, 560], [1560, 610]], eo(pr(p, .72, .9)), C.teal, 8); }
  tag('SOMETHING KEPT RUNNING', 1480, 230, C.tealL, 'center', eo(pr(p, .75, .9)));
};
// g8: 2D frame becomes depth layers
SCN[8] = function (p, u) {
  bgPaper(); var k = eio(pr(p, .12, .5)); fillRR(220, 330, 520, 340, 18, C.ink); var cl2 = [C.teal, C.gold, C.verm, C.blue];
  tag('FLAT FRAME', 480, 740, C.ink, 'center', 1);
  for (var i = 3; i >= 0; i--) { var x = 1000 + i * 110 * k, y = 300 + i * 50 * k - (1 - k) * i * 50, w = 520 - i * 70, h = 340 - i * 50; cx.save(); cx.globalAlpha = k > 0 ? 1 : 0; shadowRR(x, y + (1 - k) * 0, w, h, 16, C.ink, 14); fillRR(x, y, w, h, 16, cl2[i]); cx.restore(); }
  var m = eo(pr(p, .1, .3)); cx.save(); cx.globalAlpha = 1 - k; fillRR(1000, 300, 520, 340, 16, C.ink); cx.restore();
  var ar = eo(pr(p, .5, .7)); draw([[780, 500], [940, 500]], ar, C.ink, 8); tag('DEPTH ADDED FRAME BY FRAME', 1260, 800, C.ink, 'center', eo(pr(p, .55, .75)));
  tag('3D CONVERSION', 960, 160, C.ink, 'center', eo(pr(p, .0, .1)));
};
// g9: 2014 merger, staff 700 -> ~9000
SCN[9] = function (p, u) {
  bgPaper(); var k = eio(pr(p, .1, .4)); var ax = lerp(520, 860, k), bx = lerp(1400, 1060, k); circ(ax, 360, 150, C.blue, .9); circ(bx, 360, 150, C.verm, .9); tag('PRIME FOCUS', 520, 170, C.ink, 'center', 1 - k); tag('DOUBLE NEGATIVE', 1400, 170, C.ink, 'center', 1 - k);
  var m = eo(pr(p, .38, .5)); if (m > 0) { cx.save(); cx.globalAlpha = m; cx.fillStyle = C.ink; cx.textAlign = 'center'; cx.font = '120px ' + NUM; cx.fillText('DNEG', 960, 400); cx.restore(); }
  var y = 840; var s1 = eo(pr(p, .55, .72)), s2 = eo(pr(p, .68, .92)); var wMax = 1200; fillRR(360, y - 50, wMax * (700 / 9000) * s1, 50, 10, C.grey); fillRR(360, y + 20, wMax * s2, 50, 10, C.teal);
  tag('700 STAFF', 360, y - 66, C.ink, 'left', s1, 22); tag('~9,000 STAFF · PROFILE', 360, y + 4, C.ink, 'left', s2, 22); big('2014', 1650, 180, 130, C.gold, 'right', eo(pr(p, .1, .25)));
};
// g10: eight Oscars
SCN[10] = function (p, u) {
  bgNavy(); for (var i = 0; i < 8; i++) { var k = ob(pr(p, .1 + i * .09, .2 + i * .09)); if (k <= 0) continue; var x = 280 + i * 195; cx.save(); cx.translate(x, 470); cx.scale(Math.min(1.1, k), Math.min(1.1, k)); cx.translate(-x, -470); trophy(x, 470, 62, C.gold); star(x, 340, 14, '#fff', .9); cx.restore(); }
  var names = ['INCEPTION', 'INTERSTELLAR', 'EX MACHINA', 'BLADE RUNNER 2049', 'FIRST MAN', 'TENET', 'DUNE', 'DUNE: PART TWO'];
  var idx = Math.min(7, Math.floor(pr(p, .1, .85) * 8)); tag(names[idx], 960, 820, C.gold, 'center', eo(pr(p, .1, .2)), 30); big(String(Math.min(8, Math.floor(pr(p, .1, .85) * 8 + 1))) + ' / 8', 960, 960, 90, '#fff', 'center', eo(pr(p, .1, .2)));
  var bh = eo(pr(p, .8, .95)); circ(1640, 220, 60 * bh, '#000'); circ(1640, 220, 60 * bh, 'rgba(255,255,255,.1)'); cx.save(); cx.strokeStyle = '#fff'; cx.lineWidth = 6; cx.globalAlpha = bh; cx.beginPath(); cx.arc(1640, 220, 80 * bh, 0, 7); cx.stroke(); cx.restore(); tag('A REAL BLACK HOLE · 2 PAPERS', 1640, 340, C.grey, 'center', bh, 20);
};
// g11: 1000 shots, 100 hours
SCN[11] = function (p, u) {
  bgPaper(); var n = Math.floor(1000 * eo(pr(p, .05, .6))); for (var i = 0; i < 1000; i++) { var cxx = 160 + (i % 50) * 20, cyy = 190 + Math.floor(i / 50) * 20; circ(cxx, cyy, 6.5, i < n ? C.teal : 'rgba(20,24,36,.1)'); }
  big('1,000', 1700, 440, 170, C.teal, 'right', eo(pr(p, .05, .2))); tag('VFX SHOTS', 1700, 505, C.ink, 'right', eo(pr(p, .1, .25))); tag('DUNE PART TWO · COMPANY CLAIM', 1700, 545, C.grey, 'right', eo(pr(p, .1, .25)), 18);
  var c = eo(pr(p, .55, .7)); cx.save(); cx.globalAlpha = c; clock(520, 800, 110, p * 6, C.ink); fillRR(700, 740, 220 * pr(p, .6, .95), 30, 15, C.red); cx.restore(); big('100 HRS', 1100, 830, 120, C.ink, 'left', c); tag('ONE FRAME · REPORTED', 1100, 880, C.grey, 'left', c);
};
// g12: Oscar -> trust -> order
SCN[12] = function (p, u) {
  bgPaper(); var xs = [380, 960, 1540]; for (var i = 0; i < 3; i++) { var k = ob(pr(p, .08 + i * .2, .22 + i * .2)); if (k <= 0) continue; cx.save(); cx.translate(xs[i], 480); cx.scale(Math.min(1.05, k), Math.min(1.05, k)); cx.translate(-xs[i], -480); circ(xs[i], 480, 150, 'rgba(20,24,36,.06)'); if (i == 0) trophy(xs[i], 480, 80, C.gold); if (i == 1) { cx.fillStyle = C.blue; cx.beginPath(); cx.moveTo(xs[i], 360); cx.lineTo(xs[i] + 90, 395); cx.lineTo(xs[i] + 80, 500); cx.quadraticCurveTo(xs[i] + 60, 570, xs[i], 600); cx.quadraticCurveTo(xs[i] - 60, 570, xs[i] - 80, 500); cx.lineTo(xs[i] - 90, 395); cx.closePath(); cx.fill(); cx.strokeStyle = '#fff'; cx.lineWidth = 14; cx.beginPath(); cx.moveTo(xs[i] - 40, 490); cx.lineTo(xs[i] - 8, 525); cx.lineTo(xs[i] + 46, 450); cx.stroke(); } if (i == 2) ticket(xs[i] - 90, 430, 180, 110, C.teal); cx.restore(); tag(['OSCAR', 'TRUST', 'NEXT ORDER'][i], xs[i], 720, C.ink, 'center', eo(pr(p, .12 + i * .2, .3 + i * .2))); if (i < 2) draw([[xs[i] + 170, 480], [xs[i + 1] - 170, 480]], eo(pr(p, .2 + i * .2, .38 + i * .2)), C.ink, 8); }
  tag('OUR ANALYSIS', 960, 940, C.grey, 'center', eo(pr(p, .7, .85)));
};
