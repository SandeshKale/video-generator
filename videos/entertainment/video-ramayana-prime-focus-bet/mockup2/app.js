// Mockup v2: clean flat-vector motion graphics. No grain, no vignette, no bitmap textures. Every frame is a pure function of t.
(function () {
var cv = document.getElementById('c'), cx = cv.getContext('2d'), W = 1920, H = 1080;
var VT = window.VT || { sc: [0, 5, 10, 15], end: 20, caps: [] };
var DUR = VT.end, SC = VT.sc.concat([VT.end]);
var C = { paper: '#F6F3EC', ink: '#141824', navy: '#0F1525', navyLine: '#1D2640', teal: '#0E8F73', tealL: '#7FD1BC', red: '#E0454B', redD: '#A5282E', gold: '#F2B230', verm: '#E8553D', sepia: '#EFE3CC', sepia2: '#DCC9A3', sepia3: '#B89B6A', sepiaDk: '#5A4630', grey: '#8B93A5', white: '#FFFFFF' };
var NUM = 'Anton, sans-serif', LAB = 'Plex, monospace', CAPF = 'Poppins, sans-serif';
function cl(x, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x)); }
function pr(t, a, b) { return cl((t - a) / (b - a)); }
function lerp(a, b, k) { return a + (b - a) * k; }
function eo(x) { x = cl(x); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = cl(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function ob(x) { x = cl(x); var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function inr(n) { return Math.round(n).toLocaleString('en-IN'); }
function rr(x, y, w, h, r) { r = Math.max(0, Math.min(r, w / 2, h / 2)); cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
function fillRR(x, y, w, h, r, col, a) { cx.save(); if (a !== undefined) cx.globalAlpha = a; cx.fillStyle = col; rr(x, y, w, h, r); cx.fill(); cx.restore(); }
function shadowRR(x, y, w, h, r, col, off) { cx.save(); cx.globalAlpha = .12; cx.fillStyle = col; rr(x, y + (off || 10), w, h, r); cx.fill(); cx.restore(); }
function tag(s, x, y, col, al, a) { cx.save(); cx.globalAlpha = a === undefined ? 1 : a; cx.font = '600 24px ' + LAB; cx.fillStyle = col; cx.textAlign = al || 'left'; cx.textBaseline = 'alphabetic'; if ('letterSpacing' in cx) cx.letterSpacing = '3px'; cx.fillText(s, x, y); cx.restore(); }
// ---- vector rupee glyph + number text ----
function rupee(x, y, h, col) {           // x,y = left/baseline; glyph height h
  var u = h / 1.0, lw = h * .115; cx.save(); cx.translate(x, y - h); cx.scale(u, u); cx.strokeStyle = col; cx.lineWidth = lw / u; cx.lineCap = 'butt'; cx.lineJoin = 'miter';
  cx.beginPath(); cx.moveTo(.0, .08); cx.lineTo(.62, .08); cx.moveTo(.0, .31); cx.lineTo(.62, .31); cx.stroke();
  cx.beginPath(); cx.moveTo(.06, .08); cx.lineTo(.26, .08); cx.bezierCurveTo(.56, .08, .56, .51, .26, .51); cx.lineTo(.06, .51); cx.stroke();
  cx.beginPath(); cx.moveTo(.1, .51); cx.lineTo(.46, 1.0); cx.stroke(); cx.restore(); return h * .62 + lw * .2;
}
function num(s, x, y, size, col, al, a) {   // Anton numerals with the vector rupee; y = baseline
  cx.save(); if (a !== undefined) cx.globalAlpha = a; cx.font = size + 'px ' + NUM; var hasR = s.charAt(0) === '₹', rest = hasR ? s.slice(1) : s, rw = cx.measureText(rest).width, gh = size * .74, gw = hasR ? gh * .62 + size * .1 : 0, tot = gw + rw, x0 = al === 'center' ? x - tot / 2 : al === 'right' ? x - tot : x;
  if (hasR) rupee(x0, y, gh, col); cx.fillStyle = col; cx.textAlign = 'left'; cx.textBaseline = 'alphabetic'; cx.fillText(rest, x0 + gw, y); cx.restore(); return tot;
}
// ---- icons (flat vector) ----
function ticket(x, y, w, h, col, a) {
  cx.save(); if (a !== undefined) cx.globalAlpha = a; var r = h * .2, n = h * .2; cx.fillStyle = col; cx.beginPath();
  cx.moveTo(x + r, y); cx.lineTo(x + w - r, y); cx.arcTo(x + w, y, x + w, y + r, r); cx.lineTo(x + w, y + h / 2 - n); cx.arc(x + w, y + h / 2, n, -Math.PI / 2, Math.PI / 2, true);
  cx.lineTo(x + w, y + h - r); cx.arcTo(x + w, y + h, x + w - r, y + h, r); cx.lineTo(x + r, y + h); cx.arcTo(x, y + h, x, y + h - r, r); cx.lineTo(x, y + h / 2 + n); cx.arc(x, y + h / 2, n, Math.PI / 2, -Math.PI / 2, true); cx.lineTo(x, y + r); cx.arcTo(x, y, x + r, y, r); cx.closePath(); cx.fill();
  cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = Math.max(2, h * .05); cx.setLineDash([h * .12, h * .1]); cx.beginPath(); cx.moveTo(x + w * .7, y + h * .16); cx.lineTo(x + w * .7, y + h * .84); cx.stroke(); cx.restore();
}
function coin(x, y, r, a) { cx.save(); if (a !== undefined) cx.globalAlpha = a; cx.fillStyle = C.gold; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); cx.strokeStyle = '#C98A00'; cx.lineWidth = r * .1; cx.beginPath(); cx.arc(x, y, r * .76, 0, 7); cx.stroke(); rupee(x - r * .2, y + r * .38, r * .76, '#9A6700'); cx.restore(); }
function bank(x, y, s, col) { cx.fillStyle = col; cx.beginPath(); cx.moveTo(x - s, y - s * .25); cx.lineTo(x, y - s); cx.lineTo(x + s, y - s * .25); cx.closePath(); cx.fill(); for (var i = -2; i <= 2; i++) fillRR(x + i * s * .38 - s * .1, y - s * .12, s * .2, s * .62, 3, col); fillRR(x - s, y + s * .62, s * 2, s * .18, 3, col); }
function gear(x, y, r, col) { cx.save(); cx.fillStyle = col; for (var i = 0; i < 8; i++) { cx.save(); cx.translate(x, y); cx.rotate(i * Math.PI / 4); rr(-r * .17, -r, r * .34, r * .5, 2); cx.fill(); cx.restore(); } cx.beginPath(); cx.arc(x, y, r * .78, 0, 7); cx.arc(x, y, r * .32, 0, 7, true); cx.fill('evenodd'); cx.restore(); }
function building(x, y, s, col) { fillRR(x - s * .5, y - s, s, s * 1.5, 4, col); for (var r = 0; r < 4; r++) for (var c = 0; c < 2; c++) fillRR(x - s * .3 + c * s * .35, y - s * .82 + r * s * .32, s * .2, s * .15, 2, 'rgba(255,255,255,.8)'); }
function cam(s, e, tt, fx, fy) { var k = eio(tt), sc = lerp(s, e, k); cx.translate(fx || W / 2, fy || H / 2); cx.scale(sc, sc); cx.translate(-(fx || W / 2), -(fy || H / 2)); }
function grid(col, step) { cx.strokeStyle = col; cx.lineWidth = 2; cx.beginPath(); for (var gx = 0; gx <= W; gx += step) { cx.moveTo(gx, 0); cx.lineTo(gx, H); } for (var gy = 0; gy <= H; gy += step) { cx.moveTo(0, gy); cx.lineTo(W, gy); } cx.stroke(); }
// ================= scene A: the hook (split screen, one shared scale) =================
var SA = 520 / 5062;
function sceneA(u, t) {
  cx.save(); cam(1.0, 1.04, pr(u, 0, 5));
  cx.fillStyle = C.paper; cx.fillRect(-40, -40, 1000, H + 80); cx.fillStyle = C.navy; cx.fillRect(960, -40, 1000, H + 80); grid('rgba(20,24,36,.05)', 120); cx.save(); cx.beginPath(); cx.rect(960, 0, 960, H); cx.clip(); cx.fillStyle = C.navy; cx.fillRect(960, 0, 960, H); grid('rgba(255,255,255,.04)', 120); cx.restore();
  cx.save(); cx.beginPath(); cx.rect(0, 0, 960, H); cx.clip(); cx.restore();
  var d = eo(pr(u, .05, .7)); fillRR(954, H / 2 - H * d / 2, 12, H * d, 6, C.gold);
  var base = 900, cw = 360, lx = 480 - cw / 2, rx = 1440 - cw / 2;
  var g = eo(pr(u, .6, 2.4)), gH = 1547 * SA * g; shadowRR(lx, base - gH, cw, gH, 18, C.ink, 12); fillRR(lx, base - gH, cw, gH, 18, C.teal);
  cx.save(); rr(lx, base - gH, cw, gH, 18); cx.clip(); for (var r = 0; r < 4; r++) { var k = eo(pr(u, .7 + r * .18, 1.1 + r * .18)); ticket(lx + 28, base - 66 - r * 66 + (1 - k) * 24, cw - 56, 46, 'rgba(255,255,255,.22)', k); } cx.restore();
  for (var i = 0; i < 6; i++) { var fp = (u - 1.0 - i * .28) / 1.6; if (fp > 0 && fp < 1) { var fx = 480 + (i - 2.5) * 52 + fp * (i % 2 ? 70 : -70), fy = base - gH - 10 - Math.sin(fp * Math.PI) * 120 + fp * 30; cx.save(); cx.translate(fx, fy); cx.rotate(fp * 2.4 * (i % 2 ? 1 : -1)); ticket(-26, -16, 52, 32, i % 2 ? C.gold : C.teal, 1 - fp * .7); cx.restore(); } }
  var dd = eo(pr(u, 1.4, 3.4)), dH = 5062 * SA * dd; shadowRR(rx, base - dH, cw, dH, 18, '#000', 12); fillRR(rx, base - dH, cw, dH, 18, C.red);
  cx.save(); rr(rx, base - dH, cw, dH, 18); cx.clip(); for (var j = 0; j < 8; j++) { var rs = eo(pr(u, 1.4 + j * .15, 1.8 + j * .15)); for (var q = 0; q < 4; q++) coin(rx + 58 + q * 82, base - 50 - j * 58, 22 * rs, .95); } cx.restore();
  fillRR(lx - 40, base + 4, cw + 80, 8, 4, C.ink, .8); fillRR(rx - 40, base + 4, cw + 80, 8, 4, C.grey, .8);
  var a1 = eo(pr(u, .5, 1.2)), a2 = eo(pr(u, 1.3, 2.0)), pop = 1 + .05 * Math.sin(pr(u, 3.5, 4.1) * Math.PI);
  cx.save(); cx.globalAlpha = a1; ticket(430, 62, 100, 64, C.teal); cx.restore(); cx.save(); cx.globalAlpha = a2; bank(1440, 108, 42, C.red); cx.restore();
  cx.save(); cx.translate(480, 340); cx.scale(pop, pop); num('₹' + inr(1547 * g), 0, 0, 170, C.teal, 'center', a1); cx.restore();
  cx.save(); cx.translate(1440, 340); cx.scale(pop, pop); num('₹' + inr(5062 * dd), 0, 0, 170, C.red, 'center', a2); cx.restore();
  tag('WORLDWIDE GROSS · 15 DAYS · EST.', 480, 962, C.ink, 'center', a1); tag('PRIME FOCUS GROSS DEBT · REPORTED', 1440, 962, C.grey, 'center', a2);
  cx.restore();
}
// ================= scene B: 1995 garage (flat vector, gentle parallax) =================
function sceneB(u) {
  cx.save(); cam(1.0, 1.06, pr(u, 0, 5), 900, 560);
  cx.fillStyle = C.sepia; cx.fillRect(-80, -80, W + 160, H + 160);
  var par = function (k) { cx.translate(-(u - 2.5) * 8 * k, 0); };
  cx.save(); par(.4); fillRR(260, 120, 1060, 720, 8, C.sepia2); cx.strokeStyle = 'rgba(90,70,48,.16)'; cx.lineWidth = 3; cx.beginPath(); for (var by = 168; by < 820; by += 48) { cx.moveTo(260, by); cx.lineTo(1320, by); } cx.stroke();
  var up = eo(pr(u, .2, 1.4)), sh = 56 + 300 * (1 - up * .85); fillRR(340, 150, 900, sh, 6, '#CDB68A'); cx.strokeStyle = 'rgba(90,70,48,.25)'; cx.beginPath(); for (var s = 40; s < sh; s += 40) { cx.moveTo(340, 150 + s); cx.lineTo(1240, 150 + s); } cx.stroke(); fillRR(332, 140, 916, 14, 5, C.sepiaDk);
  cx.restore();
  cx.save(); par(.7); var sw = Math.sin(u * 2.2) * .09 * Math.exp(-u * .25); cx.translate(790, 120); cx.rotate(sw); cx.fillStyle = C.sepiaDk; cx.fillRect(-2, 0, 4, 116); cx.fillStyle = 'rgba(255,214,120,.28)'; cx.beginPath(); cx.arc(0, 150, 92, 0, 7); cx.fill(); cx.fillStyle = 'rgba(255,214,120,.45)'; cx.beginPath(); cx.arc(0, 150, 54, 0, 7); cx.fill(); cx.fillStyle = '#FFD470'; cx.beginPath(); cx.arc(0, 150, 24, 0, 7); cx.fill(); cx.restore();
  cx.save(); par(1.0); var dk = eo(pr(u, .7, 1.5)); cx.translate(0, (1 - dk) * 180); cx.globalAlpha = dk;
  fillRR(380, 702, 800, 28, 6, C.sepiaDk); fillRR(420, 730, 24, 150, 4, C.sepiaDk); fillRR(1116, 730, 24, 150, 4, C.sepiaDk);
  shadowRR(540, 472, 300, 232, 22, C.sepiaDk, 10); fillRR(540, 472, 300, 232, 22, '#E6D8B6'); fillRR(566, 498, 248, 166, 12, '#0B2B26'); fillRR(630, 704, 120, 14, 4, '#E6D8B6'); fillRR(926, 678, 180, 24, 8, '#E6D8B6');
  cx.save(); cx.translate(690, 580); var ang = u * 1.5, P = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], pp = P.map(function (v) { var x = v[0] * Math.cos(ang) - v[2] * Math.sin(ang), z = v[0] * Math.sin(ang) + v[2] * Math.cos(ang), y = v[1] * Math.cos(.6) - z * Math.sin(.6); return [x * 38, y * 38]; }); cx.strokeStyle = '#2BE3B0'; cx.lineWidth = 4; cx.lineJoin = 'round'; cx.beginPath(); [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { cx.moveTo(pp[e[0]][0], pp[e[0]][1]); cx.lineTo(pp[e[1]][0], pp[e[1]][1]); }); cx.stroke(); cx.restore(); cx.restore();
  cx.save(); par(1.3); var bb = eo(pr(u, 1.0, 1.7)); cx.globalAlpha = bb; fillRR(1200, 700 + (1 - bb) * 90, 190, 150, 8, '#CBA874'); fillRR(1250, 590 + (1 - bb) * 90, 150, 110, 8, '#D9B985'); cx.fillStyle = 'rgba(90,70,48,.25)'; cx.fillRect(1250, 636 + (1 - bb) * 90, 150, 6); cx.restore();
  var cp = ob(pr(u, 1.6, 2.2)); if (cp > 0) { cx.save(); cx.translate(1470, 300); cx.rotate(-.06); cx.scale(cp, cp); shadowRR(-190, -150, 380, 330, 20, C.sepiaDk, 12); fillRR(-190, -150, 380, 330, 20, '#FFFDF6'); cx.save(); rr(-190, -150, 380, 330, 20); cx.clip(); cx.fillStyle = C.verm; cx.fillRect(-190, -150, 380, 82); cx.restore(); cx.fillStyle = '#FFFDF6'; for (var h = -120; h <= 120; h += 80) { cx.beginPath(); cx.arc(h, -150, 11, 0, 7); cx.fill(); } cx.font = '150px ' + NUM; cx.fillStyle = C.sepiaDk; cx.textAlign = 'center'; cx.fillText('1995', 0, 118); cx.restore(); }
  var ls = eo(pr(u, 2.5, 3.3)); if (ls > 0) { cx.save(); cx.translate(lerp(2300, 1520, ls), 760); cx.rotate(.05); shadowRR(-200, -90, 400, 180, 14, C.sepiaDk, 10); fillRR(-200, -90, 400, 180, 14, '#FFFFFF'); cx.fillStyle = C.sepia3; for (var l = 0; l < 3; l++) fillRR(-150, -48 + l * 34, 220 - l * 50, 10, 5, C.sepia3); cx.restore(); var st = ob(pr(u, 3.4, 3.9)); if (st > 0) { cx.save(); cx.translate(1620, 750); cx.rotate(-.18); cx.scale(st, st); cx.strokeStyle = C.red; cx.lineWidth = 8; rr(-120, -42, 240, 84, 14); cx.stroke(); cx.font = '64px ' + NUM; cx.fillStyle = C.red; cx.textAlign = 'center'; if ('letterSpacing' in cx) cx.letterSpacing = '6px'; cx.fillText('LOAN', 3, 22); cx.restore(); } }
  tag('1995 · BANK LOAN · GARAGE', 120, 980, C.sepiaDk, 'left', eo(pr(u, 2.6, 3.2)));
  cx.restore();
}
// ================= scene C: the balance (area = amount) =================
function sceneC(u) {
  cx.save(); cam(1.03, 1.0, pr(u, 0, 5)); cx.fillStyle = C.paper; cx.fillRect(-60, -60, W + 120, H + 120); grid('rgba(20,24,36,.045)', 120);
  var K = 3.9, pcx = 960, pcy = 540, arm = 640;
  var wP = eo(pr(u, .5, 1.0)), wI = ob(pr(u, 1.0, 1.55)), wG = ob(pr(u, 1.5, 2.0)), wB = ob(pr(u, 2.0, 2.5)), left = wP + wI * .25 + wG * .3 + wB * .3, rev = eo(pr(u, 2.9, 4.2));
  var th = -(.15 * left) * (1 - rev * .96) + .018 * Math.sin(u * 6) * Math.exp(-u * .8) * (1 - rev);
  cx.fillStyle = C.gold; cx.beginPath(); cx.moveTo(pcx, pcy); cx.lineTo(pcx - 110, pcy + 290); cx.lineTo(pcx + 110, pcy + 290); cx.closePath(); cx.fill(); fillRR(pcx - 280, pcy + 290, 560, 28, 10, C.gold);
  cx.save(); cx.translate(pcx, pcy); cx.rotate(th); fillRR(-arm - 24, -14, arm * 2 + 48, 28, 14, C.ink); cx.fillStyle = C.gold; cx.beginPath(); cx.arc(0, 0, 24, 0, 7); cx.fill(); cx.fillStyle = C.ink; cx.beginPath(); cx.arc(0, 0, 9, 0, 7); cx.fill(); cx.restore();
  var Lx = pcx - Math.cos(th) * arm, Ly = pcy - Math.sin(th) * arm, Rx = pcx + Math.cos(th) * arm, Ry = pcy + Math.sin(th) * arm, hang = 200;
  function pan(px, py, hw) { cx.strokeStyle = C.ink; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px - hw, py + hang); cx.moveTo(px, py); cx.lineTo(px + hw, py + hang); cx.stroke(); fillRR(px - hw - 24, py + hang, hw * 2 + 48, 18, 9, C.ink); }
  pan(Lx, Ly, 270); pan(Rx, Ry, 150); var Lp = Ly + hang, Rp = Ry + hang;
  function drop(k) { return -(1 - Math.min(1, k)) * 520; }
  var sP = Math.sqrt(2885) * K, sI = Math.sqrt(558) * K, x0 = Lx - 262;
  var py = Lp - sP + drop(wP); shadowRR(x0, py, sP, sP, 14, C.ink, 8); fillRR(x0, py, sP, sP, 14, C.red); coin(x0 + sP / 2, py + sP / 2, 40);
  var iy = Lp - sI + drop(wI), ix = x0 + sP + 10; fillRR(ix, iy, sI, sI, 10, C.redD); cx.font = (sI * .7) + 'px ' + CAPF; cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.font = '800 ' + (sI * .62) + 'px ' + CAPF; cx.fillText('%', ix + sI / 2, iy + sI * .72);
  [[wG, 0, gear], [wB, 1, building]].forEach(function (q) { var s = 58, gx = ix + sI + 16 + q[1] * (s + 10), gy = Lp - s + drop(q[0]); cx.save(); cx.setLineDash([10, 8]); cx.strokeStyle = C.ink; cx.lineWidth = 4; rr(gx, gy, s, s, 10); cx.stroke(); cx.setLineDash([]); if (q[1]) building(gx + s / 2, gy + s * .45, 26, C.ink); else gear(gx + s / 2, gy + s / 2, 20, C.ink); cx.restore(); });
  var sR = Math.sqrt(3950) * K * (.3 + .7 * rev); shadowRR(Rx - sR / 2, Rp - sR, sR, sR, 14, C.ink, 8); fillRR(Rx - sR / 2, Rp - sR, sR, sR, 14, C.teal); for (var ti = 0; ti < 3; ti++) ticket(Rx - sR / 2 + 20, Rp - sR + 20 + ti * Math.min(66, (sR - 40) / 3), sR - 40, Math.min(46, (sR - 40) / 3 - 10), 'rgba(255,255,255,.22)');
  var ta = eo(pr(u, 1.3, 1.9)); tag('PAYROLL  ₹2,885 CR · FY24', Lx, Lp + 90, C.ink, 'center', ta); tag('FINANCE COST  ₹558 CR', Lx, Lp + 126, C.grey, 'center', ta);
  tag('REVENUE  ₹3,950 CR', Rx, Rp + 90, C.teal, 'center', eo(pr(u, 3.3, 3.9)));
  cx.restore();
}
// ================= scene D: the number (race, silence, break-up) =================
function sceneD(u) {
  var bt = u - 3.15, shake = (bt > 0 && bt < .5) ? Math.sin(bt * 90) * 8 * (1 - bt / .5) : 0;
  cx.save(); cx.translate(shake, shake * .5); cx.fillStyle = C.navy; cx.fillRect(-40, -40, W + 80, H + 80); grid('rgba(255,255,255,.035)', 120);
  var X0 = 460, PX = 1300 / 5062, rows = [280, 500, 720], tr = eo(pr(u, .1, .7));
  rows.forEach(function (y) { fillRR(X0, y, 1300 * tr, 130, 20, C.navyLine); });
  var g = eo(pr(u, .8, 2.0)), b = eo(pr(u, 1.3, 2.4)), d = eo(pr(u, 1.8, 3.1));
  cx.save(); cx.globalAlpha = tr; ticket(150, 312, 120, 66, C.teal); coin(210, 570, 36); bank(210, 770, 46, C.red); cx.restore();
  tag('GROSS', 210, 430, C.grey, 'center', tr); tag('BUDGET', 210, 650, C.grey, 'center', tr); tag('DEBT', 210, 870, C.grey, 'center', tr);
  var wf = pr(u, 3.9, 5.0), gw = 1547 * PX * g;
  if (wf <= 0) fillRR(X0, 280, Math.max(gw, 1), 130, 20, C.teal);
  else { var pw = 1547 * PX / 4; for (var i = 0; i < 3; i++) { var k = eo(pr(u, 3.9 + i * .22, 4.6 + i * .22)); cx.save(); cx.translate(X0 + i * pw + k * 40 * (i + 1), 280 - k * (i % 2 ? -150 : 150)); cx.rotate(k * (i - 1) * .12); cx.globalAlpha = 1 - k * .3; fillRR(0, 0, pw - 8, 130, 16, C.teal); cx.font = '600 19px ' + LAB; cx.fillStyle = '#fff'; cx.textAlign = 'center'; if ('letterSpacing' in cx) cx.letterSpacing = '0px'; cx.fillText(['TAX', 'THEATRE', 'DISTRIB'][i], (pw - 8) / 2, 78); cx.restore(); }
    var q = eo(pr(u, 4.5, 5)); cx.save(); cx.globalAlpha = q; cx.setLineDash([14, 10]); cx.strokeStyle = C.teal; cx.lineWidth = 5; rr(X0 + 3 * pw, 280, pw, 130, 16); cx.stroke(); cx.setLineDash([]); cx.font = '100px ' + NUM; cx.fillStyle = C.teal; cx.textAlign = 'center'; cx.fillText('?', X0 + 3 * pw + pw / 2, 372); cx.restore(); }
  fillRR(X0, 500, Math.max(1600 * PX * b, 1), 130, 20, C.verm); var rg = eo(pr(u, 2.2, 2.9)); cx.save(); cx.globalAlpha = rg; fillRR(X0 + 1600 * PX, 500, 400 * PX, 130, 12, 'rgba(232,85,61,.35)'); cx.strokeStyle = C.verm; cx.lineWidth = 4; cx.setLineDash([10, 8]); rr(X0 + 1600 * PX, 500, 400 * PX, 130, 12); cx.stroke(); cx.restore();
  fillRR(X0, 720, Math.max(5062 * PX * d, 1), 130, 20, C.red);
  if (wf <= 0 && g > .03) num('₹' + inr(1547 * g), X0 + gw + 32, 392, 96, C.tealL, 'left');
  if (b > .03) num('₹1,600–2,000', X0 + 2000 * PX * b + 32, 612, 96, '#FF9C84', 'left');
  if (d > .03) num('₹' + inr(5062 * d), X0 + 5062 * PX * d - 30, 832, 104, '#FFFFFF', 'right');
  if (bt > 0 && bt < .3) { cx.fillStyle = 'rgba(224,69,75,' + (.22 * (1 - bt / .3)) + ')'; cx.fillRect(-40, -40, W + 80, H + 80); }
  tag('SPLIT NOT PUBLIC · ILLUSTRATIVE', 1760, 1000, C.grey, 'right', eo(pr(u, 4.6, 5)));
  tag('SACNILK · EST.  /  TRADE REPORTS  /  REPORTED', 460, 1000, C.grey, 'left', tr);
  cx.restore();
}
// ---- plain captions (small, no box) ----
function caption(t, dark) { var cs = VT.caps || [], c = null; for (var i = 0; i < cs.length; i++) if (t >= cs[i].t0 && t < cs[i].t1) c = cs[i]; if (!c) return; var a = Math.min(1, (t - c.t0) / .15, (c.t1 - t) / .15); cx.save(); cx.globalAlpha = a; cx.font = '800 40px ' + CAPF; cx.textAlign = 'center'; cx.fillStyle = dark ? '#EDEFF5' : C.ink; cx.fillText(c.text, W / 2, 1040); cx.restore(); }
// ---- transitions: one clean colour panel sweep (sequential, no double exposure) ----
var TRC = [C.gold, C.teal, C.red];
function render(t) {
  t = cl(t, 0, DUR - 1e-3); var idx = 0; for (var i = 0; i < 4; i++) if (t >= SC[i]) idx = i; var tb = null;
  for (var k = 1; k < 4; k++) if (Math.abs(t - SC[k]) < .3) tb = k;
  var show = idx; if (tb !== null && t < SC[tb]) show = tb - 1;
  var s0 = SC[show], sd = SC[show + 1] - SC[show], u = cl((t - s0) / sd) * 5;
  cx.clearRect(0, 0, W, H); [sceneA, sceneB, sceneC, sceneD][show](u, t);
  caption(t, show === 3);
  if (tb !== null) { var p = (t - (SC[tb] - .3)) / .6, x = lerp(-W * 1.2, W * 1.2, eio(p)); cx.save(); cx.fillStyle = TRC[tb - 1]; cx.beginPath(); cx.moveTo(x - 200, 0); cx.lineTo(x + W, 0); cx.lineTo(x + W - 200, H); cx.lineTo(x - 400, H); cx.closePath(); cx.fill(); cx.restore(); }
}
window.__reelDurationSec = DUR; window.__ready = false;
window.__seek = function (t) { render(t); };
Promise.all([document.fonts.load('170px Anton', '0123456789,–?'), document.fonts.load('800 40px Poppins', 'Aa%'), document.fonts.load('600 24px Plex', 'AB0')]).then(function () { render(0); window.__ready = true; });
})();
