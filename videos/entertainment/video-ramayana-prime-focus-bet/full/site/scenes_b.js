// Scenes for groups 13-23 (factory, four weights, strike, recovery)
// g13: the factory: seats = people = the biggest cost
SCN[13] = function (p, u) {
  bgPaper(); var cols = 14, rows = 4; var n = Math.floor(cols * rows * eo(pr(p, .08, .6)));
  for (var i = 0; i < cols * rows; i++) { var x = 200 + (i % cols) * 98, y = 310 + Math.floor(i / cols) * 130; if (i < n) seat(x, y + 70, 56, C.red); else seat(x, y + 70, 56, 'rgba(20,24,36,.08)'); }
  var k = eo(pr(p, .6, .85)); var tot = 1500; fillRR(210, 800, tot, 60, 14, 'rgba(20,24,36,.08)'); fillRR(210, 800, tot * .62 * k, 60, 14, C.red); fillRR(210 + tot * .62, 800, tot * .14 * k, 60, 0, C.redD); fillRR(210 + tot * .76, 800, tot * .24 * k, 60, 0, C.grey);
  tag('PEOPLE', 210 + tot * .3, 900, C.red, 'center', k); tag('INTEREST', 210 + tot * .69, 900, C.redD, 'center', k); tag('OTHER', 210 + tot * .88, 900, C.grey, 'center', k); tag('ILLUSTRATIVE SPLIT', 1700, 250, C.grey, 'right', k, 20);
};
// g14: true-area squares: payroll, interest, revenue
SCN[14] = function (p, u) {
  bgPaper(); var K = 4.6, base = 800; var sP = Math.sqrt(2885) * K, sI = Math.sqrt(558) * K, sR = Math.sqrt(3950) * K;
  var a = eo(pr(p, .08, .3)), b = eo(pr(p, .3, .5)), c = eo(pr(p, .55, .8)); var x1 = 220, x2 = x1 + sP + 40, x3 = 1160;
  shadowRR(x1, base - sP * a, sP, sP * a, 14, C.ink, 10); fillRR(x1, base - sP * a, sP, sP * a, 14, C.red); if (a > .5) coin(x1 + sP / 2, base - sP / 2, 40);
  fillRR(x2, base - sI * b, sI, sI * b, 10, C.redD); if (b > .5) { cx.font = '800 ' + (sI * .6) + 'px ' + CAPF; cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText('%', x2 + sI / 2, base - sI * .25); }
  shadowRR(x3, base - sR * c, sR, sR * c, 14, C.ink, 10); fillRR(x3, base - sR * c, sR, sR * c, 14, C.teal); if (c > .5) ticket(x3 + sR * .15, base - sR * .7, sR * .7, 60, 'rgba(255,255,255,.25)');
  fillRR(160, base + 4, 1600, 8, 4, C.ink, .6);
  num('₹' + inr(2885 * a), x1 + sP / 2, base + 90, 70, C.red, 'center', a); num('₹' + inr(558 * b), x2 + sI / 2, base + 90, 70, C.redD, 'center', b); num('₹' + inr(3950 * c), x3 + sR / 2, base + 90, 70, C.teal, 'center', c);
  tag('STAFF', x1 + sP / 2, base - sP - 24, C.ink, 'center', a); tag('INTEREST', x2 + sI / 2, base - sI - 24, C.ink, 'center', b); tag('REVENUE', x3 + sR / 2, base - sR - 24, C.teal, 'center', c); tag('AREA = AMOUNT · REPORTED', 960, 1000, C.grey, 'center', eo(pr(p, .8, .95)), 20);
};
// g15: 100 coins -> 73 to salary
SCN[15] = function (p, u) {
  bgPaper(); var X = 200, Y = 250, k = eo(pr(p, .05, .25)); var mv = Math.floor(73 * eio(pr(p, .35, .75))), mi = Math.floor(6 * eio(pr(p, .6, .85)));
  fillRR(1160, 250, 560, 560, 24, 'rgba(224,69,75,.1)'); tag('SALARY', 1440, 230, C.red, 'center', k);
  for (var i = 0; i < 100; i++) { var cx0 = X + (i % 10) * 82 + 40, cy0 = Y + Math.floor(i / 10) * 60 + 30; var tx, ty; if (i < mv) { var f = eio(pr(p, .35 + (i / 73) * .3, .45 + (i / 73) * .3)); tx = 1200 + (i % 8) * 64 + 30; ty = 290 + Math.floor(i / 8) * 54 + 30; cx0 = lerp(cx0, tx, f); cy0 = lerp(cy0, ty, f); } coin(cx0, cy0, 24, k * (i < mv ? 1 : .55 + .0)); }
  big(String(100 - mv) + ' LEFT', 600, 925, 90, C.ink, 'center', k); tag('100 RUPEES IN · 73 GO TO SALARY · ILLUSTRATIVE', 960, 975, C.grey, 'center', k, 20);
};
// g16: orders halve, salary stays -> loss
SCN[16] = function (p, u) {
  bgPaper(); var h = eio(pr(p, .12, .45)); var n = Math.round(100 - 50 * h); for (var i = 0; i < 100; i++) { var x = 200 + (i % 10) * 54 + 20, y = 300 + Math.floor(i / 10) * 54; coin(x, y, 20, i < n ? 1 : 0.1); }
  var sal = 73; fillRR(1000, 300, 600, 540, 24, 'rgba(224,69,75,.1)'); for (var j = 0; j < sal; j++) coin(1040 + (j % 9) * 62, 340 + Math.floor(j / 9) * 56, 22, 1);
  var s = ob(pr(p, .6, .78)); if (s > 0) { cx.save(); cx.translate(1300, 560); cx.rotate(-.12); cx.scale(s, s); cx.strokeStyle = C.red; cx.lineWidth = 10; rr(-230, -70, 460, 140, 16); cx.stroke(); cx.font = '110px ' + NUM; cx.fillStyle = C.red; cx.textAlign = 'center'; cx.fillText('LOSS', 0, 38); cx.restore(); }
  big(String(n) + ' IN', 460, 920, 90, C.ink, 'center'); big('73 OUT', 1300, 920, 90, C.red, 'center'); tag('SAME SALARY · HALF THE ORDERS · ILLUSTRATIVE', 960, 975, C.grey, 'center', 1, 20);
};
// g17: balance beam: four weights; orders stop; SPAC called off
SCN[17] = function (p, u) {
  bgPaper(); var pcx = 960, pcy = 520, arm = 600; var orders = 1 - eio(pr(p, .35, .6)); var th = .02 + .13 * (1 - orders);
  cx.fillStyle = C.gold; cx.beginPath(); cx.moveTo(pcx, pcy); cx.lineTo(pcx - 100, pcy + 280); cx.lineTo(pcx + 100, pcy + 280); cx.closePath(); cx.fill(); fillRR(pcx - 260, pcy + 280, 520, 26, 10, C.gold);
  var ang = -th; cx.save(); cx.translate(pcx, pcy); cx.rotate(ang); fillRR(-arm - 24, -14, arm * 2 + 48, 28, 14, C.ink); circ(0, 0, 22, C.gold); cx.restore();
  var Lx = pcx - Math.cos(ang) * arm, Ly = pcy + Math.sin(ang) * arm * -1, Rx = pcx + Math.cos(ang) * arm, Ry = pcy - Math.sin(ang) * arm * -1; Ly = pcy - Math.sin(ang) * arm; Ry = pcy + Math.sin(ang) * arm;
  var w = [[C.red, 'ARTISTS'], [C.verm, 'SOFTWARE'], [C.redD, 'STUDIOS'], [C.ink, 'DEBT']]; for (var i = 0; i < 4; i++) { var k = ob(pr(p, .05 + i * .06, .15 + i * .06)); var s = 110; var x = Lx - 190 + i * 130, y = Ly + 150 - s - (1 - Math.min(1, k)) * 400; fillRR(x - s / 2, y, s, s, 10, w[i][0]); tag(w[i][1], x, y + s + 30, C.ink, 'center', k, 18); }
  var rk = orders; var oh = 60 * rk + 10; fillRR(Rx - 110, Ry + 150 - oh, 220, oh, 12, C.teal); tag('ORDERS', Rx, Ry + 200, C.teal, 'center', 1);
  var s2 = ob(pr(p, .68, .8)); if (s2 > 0) { cx.save(); cx.translate(960, 230); cx.scale(s2, s2); fillRR(-250, -60, 500, 120, 18, '#fff'); cx.strokeStyle = C.ink; cx.lineWidth = 4; rr(-250, -60, 500, 120, 18); cx.stroke(); cx.font = '60px ' + NUM; cx.fillStyle = C.ink; cx.textAlign = 'center'; cx.fillText('2022 · SPAC · $1.7B', 0, 22); cx.restore(); var st = ob(pr(p, .8, .9)); if (st > 0) { cx.save(); cx.translate(960, 240); cx.rotate(-.14); cx.scale(st, st); cx.strokeStyle = C.red; cx.lineWidth = 9; rr(-170, -46, 340, 92, 12); cx.stroke(); cx.font = '56px ' + NUM; cx.fillStyle = C.red; cx.textAlign = 'center'; cx.fillText('CALLED OFF', 0, 20); cx.restore(); } }
};
// g18: fixed cost line vs shrinking orders
SCN[18] = function (p, u) {
  bgNavy(); var X0 = 260, X1 = 1700, Yb = 840; line(X0, Yb, X1, Yb, 'rgba(255,255,255,.25)', 3); line(X0, 260, X0, Yb, 'rgba(255,255,255,.25)', 3);
  var cost = 440; line(X0, cost + 260, X1, cost + 260, C.red, 8, 1, [18, 12]); tag('FIXED COST', X1, cost + 230, C.red, 'right', 1);
  var pts = [[X0, 300], [600, 330], [900, 420], [1200, 620], [1500, 760], [X1, 790]]; var a = eo(pr(p, .1, .6)); var last = draw(pts, a, C.teal, 10); circ(last[0], last[1], 14, C.teal);
  var g = eo(pr(p, .55, .8)); cx.save(); cx.globalAlpha = .35 * g; cx.fillStyle = C.red; cx.beginPath(); cx.moveTo(1010, 700); cx.lineTo(X1, 700); cx.lineTo(X1, 790); cx.lineTo(1500, 760); cx.lineTo(1200, 620); cx.closePath(); cx.fill(); cx.restore();
  tag('ORDERS', X1, 740, C.teal, 'right', a); tag('FIXED COSTS DO NOT SHRINK WHEN ORDERS DO', 960, 960, C.grey, 'center', eo(pr(p, .75, .95)), 22);
};
// g19: strike: calendar 2023-24, reels stop
SCN[19] = function (p, u) {
  bgNavy(); var k = ob(pr(p, .08, .24)); cx.save(); cx.translate(560, 460); cx.scale(Math.min(1, k), Math.min(1, k)); shadowRR(-230, -230, 460, 440, 22, '#000', 14); fillRR(-230, -230, 460, 440, 22, '#F4F1EA'); cx.save(); rr(-230, -230, 460, 440, 22); cx.clip(); cx.fillStyle = C.red; cx.fillRect(-230, -230, 460, 110); cx.restore(); cx.font = '120px ' + NUM; cx.fillStyle = C.navy; cx.textAlign = 'center'; cx.fillText('2023', 0, 40); cx.fillText('2024', 0, 160); cx.restore();
  var r = pr(p, .3, .6); for (var i = 0; i < 2; i++) { var x = 1180 + i * 260, y = 460; circ(x, y, 100, C.grey); var ang = (1 - eio(pr(p, .5, .8))) * u * 4; for (var h = 0; h < 5; h++) { var a = ang + h * 1.2566; circ(x + Math.cos(a) * 55, y + Math.sin(a) * 55, 20, C.navy); } circ(x, y, 14, C.navy); }
  var s = ob(pr(p, .55, .72)); if (s > 0) { cx.save(); cx.translate(1310, 460); cx.rotate(-.14); cx.scale(s, s); cx.strokeStyle = C.red; cx.lineWidth = 12; rr(-250, -80, 500, 160, 20); cx.stroke(); cx.font = '120px ' + NUM; cx.fillStyle = C.red; cx.textAlign = 'center'; cx.fillText('STRIKE', 0, 42); cx.restore(); }
  tag('WRITERS', 1180, 640, C.grey, 'center', eo(pr(p, .35, .5))); tag('ACTORS', 1440, 640, C.grey, 'center', eo(pr(p, .4, .55))); tag('SHOOTING STOPS · POST-PRODUCTION STOPS', 960, 900, C.grey, 'center', eo(pr(p, .7, .9)), 22);
};
// g20: revenue falls 4,600 -> 3,950 ; loss 450-500
SCN[20] = function (p, u) {
  bgNavy(); var Yb = 820, K = 150 / 1000; var a = eo(pr(p, .08, .3)), b = eo(pr(p, .35, .6)); var h1 = 4600 * K * a * 1.0 / 1.0, h2 = 3950 * K * b;
  fillRR(440, Yb - 4600 * K * a * .9, 300, 4600 * K * a * .9, 16, C.teal); fillRR(940, Yb - 3950 * K * b * .9, 300, 3950 * K * b * .9, 16, C.teal);
  var d = eo(pr(p, .6, .85)); cx.save(); cx.globalAlpha = d; cx.setLineDash([12, 10]); cx.strokeStyle = C.red; cx.lineWidth = 5; rr(940, Yb - 4600 * K * .9, 300, (4600 - 3950) * K * .9, 16); cx.stroke(); cx.restore();
  num('₹4,600', 590, Yb + 90, 80, C.tealL, 'center', a); num('₹3,950', 1090, Yb + 90, 80, C.tealL, 'center', b); tag('REVENUE · FY23 → FY24 · REPORTED', 960, 160, C.grey, 'center', a);
  var l = ob(pr(p, .75, .9)); if (l > 0) { cx.save(); cx.translate(1580, 520); cx.scale(l, l); fillRR(-170, -90, 340, 180, 20, C.red); cx.font = '70px ' + NUM; cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText('450–500', 0, 14); cx.font = '600 20px ' + LAB; cx.fillText('LOSS · SOURCES DIFFER', 0, 60); cx.restore(); }
};
// g21: the bench: empty seats, meter running
SCN[21] = function (p, u) {
  bgNavy(); for (var i = 0; i < 28; i++) { var x = 260 + (i % 14) * 98, y = 330 + Math.floor(i / 14) * 150; seat(x, y + 70, 56, 'rgba(255,255,255,.14)', eo(pr(p, .05 + i * .006, .2 + i * .006))); }
  var m = eo(pr(p, .35, .5)); cx.save(); cx.globalAlpha = m; fillRR(660, 700, 600, 190, 26, '#fff'); fillRR(680, 720, 560, 150, 16, '#111'); cx.font = '110px ' + NUM; cx.fillStyle = C.red; cx.textAlign = 'center'; cx.fillText('₹' + inr(1000 + p * 98000), 960, 830); cx.restore(); tag('LICENSES · RENT · METER KEEPS RUNNING', 960, 950, C.grey, 'center', m, 22); tag('ILLUSTRATIVE METER', 960, 680, C.grey, 'center', m, 18);
};
// g22: recovery: revenue +23% to ~976 ; loss 158 -> profit 110
SCN[22] = function (p, u) {
  bgPaper(); var k = eo(pr(p, .08, .4)); var pts = [[200, 760], [520, 720], [840, 600], [1160, 420], [1480, 300]]; var last = draw(pts, k, C.teal, 12); circ(last[0], last[1], 16, C.teal);
  var a = ob(pr(p, .35, .5)); if (a > 0) { cx.save(); cx.translate(1500, 230); cx.scale(a, a); fillRR(-170, -70, 340, 140, 20, C.teal); num('₹976 CR', 0, 24, 66, '#fff', 'center'); cx.font = '600 20px ' + LAB; cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.fillText('Q1 FY26 · +23% · REPORTED', 0, 56); cx.restore(); }
  var b = eo(pr(p, .6, .8)), c = eo(pr(p, .75, .95)); var x0 = 1240, base = 880; fillRR(x0, base, 160, 158 * .6 * b, 10, C.red); fillRR(x0 + 220, base - 110 * .6 * c, 160, 110 * .6 * c, 10, C.teal); line(x0 - 40, base, x0 + 420, base, C.ink, 4); tag('LOSS ₹158 CR', x0 + 80, base - 24, C.red, 'center', b, 20); tag('PROFIT ₹110 CR', x0 + 300, base - 110 * .6 - 24, C.teal, 'center', c, 20);
  big('2025', 330, 240, 130, C.gold, 'left', eo(pr(p, .05, .2)));
};
// g23: FY26 profit 301 ; bench refills
SCN[23] = function (p, u) {
  bgPaper(); var n = Math.floor(28 * eo(pr(p, .1, .6))); for (var i = 0; i < 28; i++) { var x = 260 + (i % 14) * 98, y = 330 + Math.floor(i / 14) * 150; seat(x, y + 70, 56, i < n ? C.teal : 'rgba(20,24,36,.1)'); }
  var k = ob(pr(p, .55, .75)); if (k > 0) { cx.save(); cx.translate(960, 800); cx.scale(Math.min(1.05, k), Math.min(1.05, k)); fillRR(-420, -110, 840, 210, 28, C.ink); num('₹301 CR', 0, 40, 130, '#fff', 'center'); cx.restore(); } tag('FY26 PROFIT · REPORTED · THE BENCH IS WORKING AGAIN', 960, 990, C.grey, 'center', eo(pr(p, .7, .9)), 20);
};
