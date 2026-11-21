// Scenes for groups 24-45 (the bet, the number, the twist, full circle)
// g24: fork in the road + PFT card
SCN[24] = function (p, u) {
  bgPaper(); var k = eo(pr(p, .05, .35)); draw([[300, 620], [800, 620], [1000, 620]], k, C.ink, 14); var a = eo(pr(p, .3, .6)); draw([[1000, 620], [1300, 460], [1650, 460]], a, C.grey, 14); draw([[1000, 620], [1300, 780], [1650, 780]], a, C.teal, 14);
  tag('CUT COSTS', 1650, 410, C.grey, 'right', a); tag('DOUBLE DOWN', 1650, 850, C.teal, 'right', a); var c = ob(pr(p, .6, .78)); if (c > 0) { cx.save(); cx.translate(1450, 780); cx.scale(Math.min(1.05, c), Math.min(1.05, c)); cx.translate(-1450, -780); } if (c > 0) { fillRR(1230, 700, 440, 150, 22, C.teal); num('₹693 CR', 1450, 800, 80, '#fff', 'center'); cx.restore(); tag('JULY 2024 · PRIME FOCUS TECHNOLOGIES', 1450, 890, C.grey, 'center', eo(pr(p, .7, .9)), 18); }
  circ(300, 620, 18, C.ink);
};
// g25: scattered vendors -> one pipeline
SCN[25] = function (p, u) {
  bgPaper(); var m = eio(pr(p, .2, .6)); var items = [[C.blue, 'EFFECTS', 360, 340], [C.verm, 'STREAMING PREP', 360, 540], [C.gold, 'CONTENT', 360, 740]];
  for (var i = 0; i < 3; i++) { var x = lerp(items[i][2], 800, m), y = lerp(items[i][3], 540, m) + (i - 1) * 80 * m; var k = eo(pr(p, .03 + i * .06, .15 + i * .06)); cx.save(); cx.globalAlpha = k; fillRR(x - 150, y - 55, 300, 110, 20, items[i][0]); tag(items[i][1], x, y + 8, '#fff', 'center', 1, 20); cx.restore(); }
  var k2 = eo(pr(p, .6, .8)); cx.save(); cx.globalAlpha = k2; fillRR(1000, 440, 640, 200, 30, C.ink); tag('ONE STOP', 1320, 560, '#fff', 'center', 1, 40); cx.restore(); tag('VALUE ↑', 1320, 720, C.teal, 'center', eo(pr(p, .75, .95)), 30);
};
// g26: tenant -> owner
SCN[26] = function (p, u) {
  bgPaper(); var k = eio(pr(p, .4, .75)); var x = lerp(480, 1440, k);
  function house(x, y, s, col, win) { cx.fillStyle = col; cx.beginPath(); cx.moveTo(x - s, y); cx.lineTo(x, y - s * .9); cx.lineTo(x + s, y); cx.closePath(); cx.fill(); fillRR(x - s * .8, y, s * 1.6, s * 1.1, 6, col); fillRR(x - s * .2, y + s * .4, s * .4, s * .7, 4, win); }
  var a = eo(pr(p, .05, .25)); cx.save(); cx.globalAlpha = a; house(480, 520, 190, C.grey, C.paper); tag('RENT', 480, 900, C.grey, 'center', 1); cx.restore();
  var b = eo(pr(p, .45, .75)); cx.save(); cx.globalAlpha = b; house(1440, 520, 190, C.teal, C.paper); tag('OWN', 1440, 900, C.teal, 'center', 1); cx.restore();
  cx.save(); cx.translate(x, 330); cx.rotate(-.5); circ(0, 0, 36, C.gold); fillRR(30, -9, 110, 18, 6, C.gold); fillRR(100, 0, 14, 40, 4, C.gold); fillRR(122, 0, 14, 28, 4, C.gold); cx.restore();
  draw([[600, 700], [1320, 700]], eo(pr(p, .35, .7)), C.ink, 10); var f = eo(pr(p, .7, .9)); filmFrame(1360, 400, 70, 110, C.verm, f);
};
// g27: budget ranges on one axis
SCN[27] = function (p, u) {
  bgPaper(); var X0 = 260, X1 = 1700, max = 4200, sx = function (v) { return X0 + (X1 - X0) * v / max; }; var Yb = 760; line(X0, Yb, X1, Yb, C.ink, 5); [0, 1000, 2000, 3000, 4000].forEach(function (v) { line(sx(v), Yb - 12, sx(v), Yb + 12, C.ink, 4); tag(inr(v), sx(v), Yb + 52, C.grey, 'center', 1, 18); });
  var rows = [[835, 900, C.gold, 'EARLY REPORT', 640], [1600, 2000, C.verm, 'TRADE REPORTS · PART 1', 500], [0, 4000, C.red, 'MAKERS · BOTH PARTS', 360]];
  for (var i = 0; i < 3; i++) { var k = eo(pr(p, .1 + i * .22, .3 + i * .22)); fillRR(sx(rows[i][0]), rows[i][4] - 50 + 0, Math.max(14, (sx(rows[i][1]) - sx(rows[i][0])) * k), 90, 16, rows[i][2]); tag(rows[i][3], sx(rows[i][0]), rows[i][4] - 70, C.ink, 'left', k, 20); }
  var q = eo(pr(p, .8, .95)); big('?', 1500, 640, 160, C.ink, 'center', q); tag('₹ CRORE · THE NUMBER ITSELF IS A PUZZLE', 960, 960, C.grey, 'center', q, 20);
};
// g28: vendor income vs owner income over years
SCN[28] = function (p, u) {
  bgPaper(); var Yb = 760; line(220, Yb, 1700, Yb, C.ink, 5); line(220, 240, 220, Yb, C.ink, 5); tag('YEARS →', 1700, Yb + 50, C.grey, 'right', 1, 18);
  var a = eo(pr(p, .05, .4)); for (var i = 0; i < 6; i++) { var h = 70 + (i % 2) * 40; fillRR(300 + i * 90, Yb - h * a, 60, h * a, 8, C.grey); } tag('RENTAL WORK · ONLY WHILE ORDERS COME', 560, 880, C.grey, 'center', a, 18);
  var b = eo(pr(p, .35, .75)); fillRR(980, Yb, 100, 140 * b, 8, C.red); tag('BUILD COST UP FRONT', 1030, Yb + 200, C.red, 'center', b, 18); var parts = [['THEATRE', C.teal], ['OTT', C.blue], ['MUSIC', C.gold], ['PART 2', C.verm]];
  for (var j = 0; j < 4; j++) { var k = eo(pr(p, .5 + j * .1, .7 + j * .1)); fillRR(1100 + j * 150, Yb - (340 - j * 40) * k, 120, (340 - j * 40) * k, 10, parts[j][1]); tag(parts[j][0], 1160 + j * 150, Yb + 36, C.ink, 'center', k, 16); }
};
// g29: Adipurush: budget range vs loss
SCN[29] = function (p, u) {
  bgNavy(); var X0 = 300, sx = function (v) { return X0 + 1300 * v / 800; };
  var a = eo(pr(p, .1, .4)), b = eo(pr(p, .45, .7)); fillRR(sx(500), 300, (sx(700) - sx(500)) * a, 130, 20, C.verm); fillRR(X0, 300, (sx(500) - X0) * a, 130, 20, 'rgba(232,85,61,.45)'); tag('REPORTED BUDGET ₹500–700 CR', X0, 270, C.grey, 'left', a, 22);
  fillRR(X0, 600, (sx(225) - X0) * b, 130, 20, C.red); tag('TRADE-ESTIMATED LOSS ≈ ₹225 CR', X0, 570, C.grey, 'left', b, 22); num('₹225 CR', sx(225) + 40, 700, 100, '#FF9C84', 'left', b);
  var r = eo(pr(p, .7, .9)); cx.save(); cx.globalAlpha = r; cx.strokeStyle = C.gold; cx.lineWidth = 10; cx.beginPath(); cx.arc(1520, 800, 70, .6, 5.4); cx.stroke(); cx.fillStyle = C.gold; cx.beginPath(); cx.moveTo(1590, 760); cx.lineTo(1560, 830); cx.lineTo(1630, 810); cx.closePath(); cx.fill(); cx.restore(); tag('REWORK', 1520, 930, C.gold, 'center', r, 20); big('2023', 1700, 200, 120, C.grey, 'right', a);
};
// g30: risk gauge
SCN[30] = function (p, u) {
  bgPaper(); var cxg = 960, cyg = 700, R = 360; cx.save(); cx.lineWidth = 60; cx.lineCap = 'butt'; var cols = [C.teal, C.gold, C.red]; for (var i = 0; i < 3; i++) { cx.strokeStyle = cols[i]; cx.beginPath(); cx.arc(cxg, cyg, R, Math.PI + i * Math.PI / 3, Math.PI + (i + 1) * Math.PI / 3 - .02); cx.stroke(); } cx.restore();
  var ang = Math.PI + Math.PI * (.12 + .8 * eo(pr(p, .2, .7)) + .02 * Math.sin(u * 7) * pr(p, .7, 1)); line(cxg, cyg, cxg + Math.cos(ang) * (R - 40), cyg + Math.sin(ang) * (R - 40), C.ink, 14); circ(cxg, cyg, 34, C.ink);
  tag('LOW', cxg - R, cyg + 70, C.teal, 'center', 1); tag('HIGH', cxg + R, cyg + 70, C.red, 'center', 1); tag('VFX BET · RISK', cxg, 940, C.grey, 'center', eo(pr(p, .5, .8)), 22);
};
// g31: IMAX frame + 42 cameras ring + Jatayu CG
SCN[31] = function (p, u) {
  bgNavy(); var k = eo(pr(p, .05, .3)); fillRR(560, 330, 800 * k, 450 * k, 14, '#fff'); fillRR(580, 350, 760 * k, 410 * k, 8, '#0B1630'); if (k > .8) { tag('IMAX', 960, 575, '#fff', 'center', 1, 60); }
  var n = Math.floor(42 * eo(pr(p, .25, .65))); for (var i = 0; i < 42; i++) { var a = i / 42 * 6.283 - 1.57; var rx = 640, ry = 370; var x = 960 + Math.cos(a) * rx, y = 555 + Math.sin(a) * ry; circ(x, y, 10, i < n ? (Math.sin(u * 4 + i) > 0 ? C.gold : '#C98A00') : 'rgba(255,255,255,.1)'); }
  big('42', 1700, 360, 150, C.gold, 'right', eo(pr(p, .3, .5))); tag('IR CAMERAS · MOCAP', 1700, 410, C.grey, 'right', eo(pr(p, .35, .55)), 18);
  var j = eo(pr(p, .65, .85)); cx.save(); cx.globalAlpha = j; cx.strokeStyle = C.tealL; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(250, 800); cx.quadraticCurveTo(300, 740, 400, 760); cx.quadraticCurveTo(500, 700, 560, 800); cx.stroke(); cx.restore(); tag('JATAYU · FULLY CG', 400, 860, C.tealL, 'center', j, 20);
};
// g32: Diwali 2026 -> 2027, trailer marker, shared assets
SCN[32] = function (p, u) {
  bgPaper(); var Yb = 560; line(200, Yb, 1720, Yb, C.ink, 6); var ev = [[300, 'TRAILER', '30 JUL 2026', C.gold], [880, 'PART 1', 'DIWALI 2026', C.verm], [1560, 'PART 2', 'DIWALI 2027', C.teal]];
  for (var i = 0; i < 3; i++) { var k = ob(pr(p, .08 + i * .2, .22 + i * .2)); if (k <= 0) continue; circ(ev[i][0], Yb, 26 * Math.min(1, k), ev[i][3]); cx.save(); cx.globalAlpha = Math.min(1, k); filmFrame(ev[i][0] - 60, Yb - 250, 120, 150, ev[i][3]); cx.restore(); tag(ev[i][1], ev[i][0], Yb + 80, C.ink, 'center', Math.min(1, k)); tag(ev[i][2], ev[i][0], Yb + 120, C.grey, 'center', Math.min(1, k), 20); }
  var s = eo(pr(p, .6, .85)); cx.save(); cx.globalAlpha = s; cx.strokeStyle = C.blue; cx.lineWidth = 10; cx.beginPath(); cx.moveTo(880, 820); cx.quadraticCurveTo(1220, 960, 1560, 820); cx.stroke(); cx.restore(); tag('SETS · ASSETS · TECH BUILT ONCE', 1220, 960, C.blue, 'center', s, 20);
};
// g33: silence beat
SCN[33] = function (p, u) {
  bgNavy(); var r = 40 + 18 * Math.sin(u * 3); circ(960, 540, r + 90, 'rgba(242,178,48,.08)'); circ(960, 540, r, C.gold); tag('LISTEN', 960, 760, C.grey, 'center', eo(pr(p, .3, .7)), 24);
};
// g34: the number: three bars race
SCN[34] = function (p, u) {
  bgNavy(); var X0 = 460, PX = 1300 / 5062, rows = [280, 500, 720], tr = eo(pr(p, .02, .1)); rows.forEach(function (y) { fillRR(X0, y, 1300 * tr, 130, 20, C.navyLine); });
  var g = eo(pr(p, .1, .3)), b = eo(pr(p, .25, .45)), d = eo(pr(p, .45, .85)); cx.save(); cx.globalAlpha = tr; ticket(150, 312, 120, 66, C.teal); coin(210, 570, 36); bank(210, 770, 46, C.red); cx.restore();
  tag('GROSS', 210, 430, C.grey, 'center', tr); tag('BUDGET', 210, 650, C.grey, 'center', tr); tag('DEBT', 210, 870, C.grey, 'center', tr);
  fillRR(X0, 280, Math.max(1547 * PX * g, 1), 130, 20, C.teal); fillRR(X0, 500, Math.max(1600 * PX * b, 1), 130, 20, C.verm); var rg = eo(pr(p, .4, .5)); cx.save(); cx.globalAlpha = rg; fillRR(X0 + 1600 * PX, 500, 400 * PX, 130, 12, 'rgba(232,85,61,.35)'); cx.strokeStyle = C.verm; cx.lineWidth = 4; cx.setLineDash([10, 8]); rr(X0 + 1600 * PX, 500, 400 * PX, 130, 12); cx.stroke(); cx.restore();
  fillRR(X0, 720, Math.max(5062 * PX * d, 1), 130, 20, C.red);
  if (g > .03) num('₹' + inr(1547 * g), X0 + 1547 * PX * g + 32, 392, 96, C.tealL, 'left'); if (b > .03) num('₹1,600–2,000', X0 + 2000 * PX * b + 32, 612, 96, '#FF9C84', 'left'); if (d > .03) num('₹' + inr(5062 * d), X0 + 5062 * PX * d - 30, 832, 104, '#fff', 'right');
  var bt = p - .85; if (bt > 0 && bt < .06) { cx.fillStyle = 'rgba(224,69,75,' + (.22 * (1 - bt / .06)) + ')'; cx.fillRect(0, 0, W, H); }
  tag('SACNILK · EST.  /  TRADE REPORTS  /  REPORTED', 460, 950, C.grey, 'left', tr);
};
// g35: gross breaks into tax / theatre / distributor / ?
SCN[35] = function (p, u) {
  bgNavy(); var X0 = 360, Wd = 1200, Y = 420; var wf = eo(pr(p, .35, .85)); var parts = [['TAX', C.red, .12], ['THEATRE', C.blue, .30], ['DISTRIBUTOR', C.gold, .22], ['?', C.teal, .36]]; var x = X0;
  for (var i = 0; i < 4; i++) { var w = Wd * parts[i][2]; var off = (i - 1.5) * 70 * wf; var yy = Y - (i % 2 ? -1 : 1) * 40 * wf; fillRR(x + off, yy, w - 8, 150, 18, i == 3 ? 'rgba(14,143,115,.25)' : parts[i][1]); if (i == 3) { cx.save(); cx.setLineDash([14, 10]); cx.strokeStyle = C.teal; cx.lineWidth = 5; rr(x + off, yy, w - 8, 150, 18); cx.stroke(); cx.restore(); big('?', x + off + w / 2, yy + 120, 110, C.teal, 'center'); } else tag(parts[i][0], x + off + w / 2, yy + 88, '#fff', 'center', 1, 22); x += w; }
  var k0 = 1 - wf; cx.save(); cx.globalAlpha = k0; ticket(X0 - 130, Y + 30, 100, 90, C.teal); cx.restore(); tag('GROSS = THE PRICE ON THE TICKET', 960, 760, C.grey, 'center', eo(pr(p, .05, .25)), 26); tag('THE PRODUCER SHARE IS NOT PUBLIC', 960, 880, C.tealL, 'center', eo(pr(p, .8, .95)), 26);
};
// g36: three squares together: gross ≈ budget, debt bigger
SCN[36] = function (p, u) {
  bgPaper(); var K = 4.4, base = 800; var sG = Math.sqrt(1547) * K * 1.9, sB1 = Math.sqrt(1600) * K * 1.9, sB2 = Math.sqrt(2000) * K * 1.9, sD = Math.sqrt(5062) * K * 1.9;
  var a = eo(pr(p, .08, .28)), b = eo(pr(p, .28, .48)), c = eo(pr(p, .55, .8)); var x1 = 200, x2 = 620, x3 = 1100;
  fillRR(x1, base - sG * a, sG, sG * a, 14, C.teal); tag('GROSS', x1 + sG / 2, base + 50, C.teal, 'center', a); cx.save(); cx.globalAlpha = b; cx.setLineDash([12, 10]); cx.strokeStyle = C.verm; cx.lineWidth = 6; rr(x2, base - sB2, sB2, sB2, 14); cx.stroke(); cx.setLineDash([]); fillRR(x2, base - sB1, sB1, sB1, 14, 'rgba(232,85,61,.8)'); cx.restore(); tag('BUDGET 1,600–2,000', x2 + sB2 / 2, base + 50, C.verm, 'center', b, 20);
  fillRR(x3, base - sD * c, sD, sD * c, 14, C.red); tag('DEBT', x3 + sD / 2, base + 50, C.red, 'center', c); var e = eo(pr(p, .4, .55)); cx.save(); cx.globalAlpha = e; line(x1 + sG + 6, base - sG - 16, x2 - 6, base - sG - 16, C.ink, 4, 1, [8, 8]); tag('≈', (x1 + sG + x2) / 2, base - sG - 36, C.ink, 'center', 1, 40); cx.restore();
  var h = eo(pr(p, .75, .95)); tag('ONLY A SHARE OF GROSS REACHES THE PRODUCER · THE DEBT SQUARE IS STILL THE BIGGEST', 960, 960, C.grey, 'center', h, 20);
};
// g37: Hindi version ~650 net
SCN[37] = function (p, u) {
  bgPaper(); var K = 700 / 1600; var a = eo(pr(p, .1, .5)), b = eo(pr(p, .35, .8)); var S = 1100 / 1547; fillRR(520, 300, Math.max(1, 1547 * S * a), 130, 20, C.teal); fillRR(520, 540, Math.max(1, 650 * S * b), 130, 20, C.blue);
  tag('WORLDWIDE GROSS', 480, 385, C.ink, 'right', a); tag('HINDI NET · THE WEEK', 480, 625, C.ink, 'right', b); num('₹1,547 CR', 520 + 1547 * S * a + 30, 400, 90, C.teal, 'left', a); num('₹650 CR', 520 + 650 * S * b + 30, 640, 90, C.blue, 'left', b);
  tag('DIFFERENT THINGS · DIFFERENT NUMBERS', 960, 900, C.grey, 'center', eo(pr(p, .75, .95)), 22);
};
// g38: one person, two places: screen + shareholder
SCN[38] = function (p, u) {
  bgNavy(); var k = eo(pr(p, .1, .35)); fillRR(220, 300, 600, 380, 24, '#0B1630'); fillRR(240, 320, 560, 340, 14, '#fff'); tag('ON SCREEN', 520, 760, C.grey, 'center', k, 22); fillRR(1100, 300, 600, 380, 24, '#F4F1EA'); cx.strokeStyle = C.gold; cx.lineWidth = 8; rr(1120, 320, 560, 340, 14); cx.stroke(); tag('SHAREHOLDER', 1400, 760, C.grey, 'center', k, 22);
  cx.save(); cx.globalAlpha = k; circ(520, 450, 70, C.sepia3); fillRR(430, 530, 180, 130, 60, C.sepia3); circ(1400, 450, 70, C.sepia3); fillRR(1310, 530, 180, 130, 60, C.sepia3); cx.restore();
  var c = ob(pr(p, .5, .7)); cx.save(); cx.translate(1400, 400); cx.scale(Math.min(1.1, c), Math.min(1.1, c)); coin(0, 0, 70); cx.restore(); num('₹15 CR', 1400, 900, 90, C.gold, 'center', eo(pr(p, .6, .8))); tag('REPORTED BY FINSHOTS', 1400, 950, C.grey, 'center', eo(pr(p, .65, .85)), 18); draw([[820, 490], [1100, 490]], eo(pr(p, .3, .5)), C.gold, 8);
};
// g39: 3.3% slice
SCN[39] = function (p, u) {
  bgPaper(); var R = 270, cxp = 700, cyp = 540; circ(cxp, cyp, R, 'rgba(20,24,36,.1)'); var sl = eo(pr(p, .2, .6)) * .033 * 2 * Math.PI; cx.save(); cx.fillStyle = C.teal; cx.beginPath(); cx.moveTo(cxp, cyp); cx.arc(cxp, cyp, R + 20 * eo(pr(p, .5, .8)), -Math.PI / 2, -Math.PI / 2 + sl); cx.closePath(); cx.fill(); cx.restore();
  big('3.3%', 1180, 520, 220, C.teal, 'left', eo(pr(p, .3, .55))); tag('STAKE BOUGHT · SEPT 2025 · REPORTED', 1180, 580, C.ink, 'left', eo(pr(p, .4, .65)), 22);
  var c = eo(pr(p, .55, .8)); cx.save(); cx.globalAlpha = c; for (var i = 0; i < 3; i++) { var x = 1220 + i * 150; circ(x, 760, 52, i == 0 ? C.gold : i == 1 ? C.blue : C.verm); circ(x, 745, 18, 'rgba(255,255,255,.85)'); fillRR(x - 30, 770, 60, 28, 14, 'rgba(255,255,255,.85)'); } cx.restore(); tag('INVESTORS', 1370, 880, C.grey, 'center', c, 20);
};
// g40: stock line +35% in a month, +98% in a year; priced in ceiling
SCN[40] = function (p, u) {
  bgNavy(); var pts = [[240, 840], [520, 790], [800, 740], [1080, 650], [1360, 430], [1640, 330]]; var a = eo(pr(p, .08, .7)); var last = draw(pts, a, C.teal, 12); circ(last[0], last[1], 14, C.teal);
  var cl2 = eo(pr(p, .65, .85)); cx.save(); cx.globalAlpha = cl2; cx.setLineDash([16, 12]); cx.strokeStyle = C.gold; cx.lineWidth = 5; cx.beginPath(); cx.moveTo(240, 240); cx.lineTo(1700, 240); cx.stroke(); cx.restore(); tag('EXPECTATIONS ALREADY PRICED IN', 1700, 215, C.gold, 'right', cl2, 20);
  num('+98%', 560, 440, 150, C.tealL, 'left', eo(pr(p, .2, .4))); tag('IN A YEAR · REPORTED', 560, 490, C.grey, 'left', eo(pr(p, .25, .45)), 20); num('+35%', 1100, 600, 100, '#fff', 'left', eo(pr(p, .5, .7))); tag('IN THE TRAILER MONTH', 1100, 650, C.grey, 'left', eo(pr(p, .55, .75)), 20);
};
// g41: analysis, not advice: scale tipping between film and studio marketing
SCN[41] = function (p, u) {
  bgPaper(); var th = Math.sin(pr(p, .2, .9) * 3.14) * .05 - .03; var pcx = 960, pcy = 520; cx.fillStyle = C.gold; cx.beginPath(); cx.moveTo(pcx, pcy); cx.lineTo(pcx - 90, pcy + 270); cx.lineTo(pcx + 90, pcy + 270); cx.closePath(); cx.fill(); cx.save(); cx.translate(pcx, pcy); cx.rotate(th); fillRR(-560, -12, 1120, 24, 12, C.ink); cx.restore();
  var Lx = pcx - Math.cos(th) * 520, Ly = pcy - Math.sin(th) * 520, Rx = pcx + Math.cos(th) * 520, Ry = pcy + Math.sin(th) * 520; var a = eo(pr(p, .1, .3)); cx.save(); cx.globalAlpha = a; filmFrame(Lx - 50, Ly - 190, 100, 160, C.verm); fillRR(Rx - 100, Ry - 170, 200, 150, 20, C.blue); building(Rx, Ry - 100, 60, '#fff'); cx.restore(); tag('THE FILM', Lx, Ly + 40, C.ink, 'center', a); tag('THE STUDIO STORY', Rx, Ry + 40, C.ink, 'center', a);
  tag('MY ANALYSIS · NOT INVESTMENT ADVICE', 960, 960, C.grey, 'center', eo(pr(p, .5, .8)), 22);
};
// g42: mirror: 1995 garage computer <-> 2026 IMAX screen
SCN[42] = function (p, u) {
  var a = eo(pr(p, .05, .25)); cx.fillStyle = C.sepia; cx.fillRect(0, 0, 960, H); cx.fillStyle = C.navy; cx.fillRect(960, 0, 960, H); grid('rgba(255,255,255,.04)', 120); fillRR(954, 0, 12, 1000 * a, 6, C.gold);
  cx.save(); cx.globalAlpha = a; fillRR(250, 350, 460, 330, 24, '#E6D8B6'); fillRR(280, 380, 400, 270, 12, '#0B2B26'); cx.strokeStyle = '#2BE3B0'; cx.lineWidth = 5; var ang = u; cx.beginPath(); for (var i = 0; i < 4; i++) { var aa = ang + i * 1.57; cx.lineTo(480 + Math.cos(aa) * 70, 515 + Math.sin(aa) * 70); } cx.closePath(); cx.stroke(); fillRR(330, 690, 300, 24, 8, C.sepiaDk); cx.restore(); big('1995', 480, 900, 140, C.sepiaDk, 'center', a);
  cx.save(); cx.globalAlpha = a; fillRR(1180, 330, 560, 330, 14, '#fff'); fillRR(1196, 346, 528, 298, 8, '#0B1630'); tag('IMAX', 1460, 520, '#fff', 'center', 1, 50); cx.restore(); big('2026', 1460, 900, 140, C.gold, 'center', a);
  var q = eo(pr(p, .55, .85)); cx.save(); cx.globalAlpha = q; cx.fillStyle = C.ink; fillRR(780, 120, 360, 110, 24, C.ink); tag('SAME QUESTION', 960, 190, '#fff', 'center', 1, 26); cx.restore();
};
// g43: rent -> build; big win, big fall oscillation
SCN[43] = function (p, u) {
  bgPaper(); var k = eo(pr(p, .05, .5)); var pts = []; for (var i = 0; i <= 40; i++) { var x = 220 + i * 37; var amp = 60 + i * 5.5; pts.push([x, 560 - Math.sin(i * .5) * amp]); } var last = draw(pts, k, C.teal, 10); circ(last[0], last[1], 14, C.teal);
  line(220, 560, 1700, 560, C.ink, 3, .4, [8, 10]); var a = eo(pr(p, .55, .8)); cx.save(); cx.globalAlpha = a; cx.fillStyle = C.teal; cx.beginPath(); cx.moveTo(1500, 350); cx.lineTo(1540, 300); cx.lineTo(1580, 350); cx.closePath(); cx.fill(); cx.fillStyle = C.red; cx.beginPath(); cx.moveTo(1500, 780); cx.lineTo(1540, 830); cx.lineTo(1580, 780); cx.closePath(); cx.fill(); cx.restore(); tag('BIGGER WIN', 1540, 270, C.teal, 'center', a, 20); tag('BIGGER FALL', 1540, 880, C.red, 'center', a, 20);
  var h = eo(pr(p, .1, .3)); tag('RENT → BUILD', 260, 200, C.ink, 'left', h, 30);
};
// g44: three things to watch
SCN[44] = function (p, u) {
  bgNavy(); for (var i = 0; i < 3; i++) { var k = ob(pr(p, .08 + i * .22, .24 + i * .22)); if (k <= 0) continue; var x = 220 + i * 520; cx.save(); cx.translate(x + 220, 540); cx.scale(Math.min(1.04, k), Math.min(1.04, k)); cx.translate(-(x + 220), -540); fillRR(x, 300, 440, 480, 30, C.navyLine); big(String(i + 1), x + 60, 420, 120, C.gold, 'left'); if (i == 0) { draw([[x + 80, 700], [x + 180, 620], [x + 260, 660], [x + 360, 520]], 1, C.teal, 10); } if (i == 1) { bank(x + 220, 620, 50, C.red); draw([[x + 330, 560], [x + 330, 700]], 1, C.tealL, 10); cx.fillStyle = C.tealL; cx.beginPath(); cx.moveTo(x + 300, 690); cx.lineTo(x + 330, 730); cx.lineTo(x + 360, 690); cx.closePath(); cx.fill(); } if (i == 2) { for (var j = 0; j < 3; j++) ticket(x + 120, 540 + j * 70, 200, 56, j == 0 ? C.teal : 'rgba(255,255,255,.25)'); } cx.restore(); tag(['RESULTS SHOW THE FILM', 'DEBT NUMBER FALLS', 'HOLLYWOOD ORDERS'][i], x + 220, 850, C.grey, 'center', eo(pr(p, .12 + i * .22, .3 + i * .22)), 20); }
};
// g45: end card
SCN[45] = function (p, u) {
  bgNavy(); var k = ob(pr(p, .05, .2)); cx.save(); cx.translate(960, 400); cx.scale(Math.min(1.05, k), Math.min(1.05, k)); var img = window.__logo; circ(0, 0, 138, C.gold); cx.save(); cx.beginPath(); cx.arc(0, 0, 126, 0, 7); cx.clip(); if (img && img.complete) cx.drawImage(img, -126, -126, 252, 252); else circ(0, 0, 126, '#0B1630'); cx.restore(); cx.restore();
  big('nerdlogic.co', 960, 680, 110, '#fff', 'center', eo(pr(p, .12, .3)));
  var lab = ['LIKE', 'SHARE', 'SUBSCRIBE']; for (var i = 0; i < 3; i++) { var kk = ob(pr(p, .35 + i * .15, .5 + i * .15)); if (kk <= 0) continue; var x = 560 + i * 280; cx.save(); cx.translate(x + 120, 800); cx.scale(Math.min(1.05, kk), Math.min(1.05, kk)); fillRR(-120, -40, 240, 80, 40, i == 2 ? C.red : C.gold); cx.font = '600 28px ' + LAB; cx.fillStyle = i == 2 ? '#fff' : C.ink; cx.textAlign = 'center'; if ('letterSpacing' in cx) cx.letterSpacing = '3px'; cx.fillText(lab[i], 0, 10); cx.restore(); }
  var pulse = 1 + .03 * Math.sin(u * 5); cx.save(); cx.translate(960, 400); cx.scale(pulse, pulse); cx.strokeStyle = 'rgba(242,178,48,.4)'; cx.lineWidth = 6; cx.beginPath(); cx.arc(0, 0, 160, 0, 7); cx.stroke(); cx.restore();
};
