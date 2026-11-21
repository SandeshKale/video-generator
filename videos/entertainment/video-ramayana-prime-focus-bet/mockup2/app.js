// Mockup: 2D flat-vector motion graphics in the "Complete Story of ..." grammar. Every frame is a pure function of t.
(function () {
var cv = document.getElementById('c'), cx = cv.getContext('2d'), W = 1920, H = 1080;
var DUR = 20, SC = [0, 5, 10, 15, 20];
var C = { cream: '#F7F5F0', ink: '#10131C', navy: '#0E1420', navy2: '#18202F', teal: '#0F9D7A', red: '#E5484D', redD: '#9F2B30', gold: '#F5B301', verm: '#E8553D',
  sepia: '#F0E6D2', sepia2: '#E3D3B3', sepiaInk: '#8A6F4D', sepiaDk: '#5B4630', grey: '#9AA3B2' };
var NUM = 'Anton, Deva, sans-serif', LAB = 'Plex, Deva, monospace', HEAD = 'Poppins, Deva, sans-serif';
function cl(x, a, b) { return Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x)); }
function pr(t, a, b) { return cl((t - a) / (b - a)); }
function lerp(a, b, k) { return a + (b - a) * k; }
function eo(x) { x = cl(x); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = cl(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function ob(x) { x = cl(x); var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function ex(x) { x = cl(x); return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); }
function inr(n) { return Math.round(n).toLocaleString('en-IN'); }
function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
function txt(s, x, y, size, col, font, al, ls) { cx.font = (font === HEAD ? '800 ' : font === LAB ? '600 ' : '') + size + 'px ' + font; cx.fillStyle = col; cx.textAlign = al || 'left'; cx.textBaseline = 'alphabetic'; if (ls !== undefined && cx.letterSpacing !== undefined) cx.letterSpacing = ls + 'px'; cx.fillText(s, x, y); if (cx.letterSpacing !== undefined) cx.letterSpacing = '0px'; }
function tag(s, x, y, col, al, a) { cx.save(); cx.globalAlpha = (a === undefined ? 1 : a); txt(s, x, y, 28, col, LAB, al || 'left', 3); cx.restore(); }
// ---------- icons (flat vector) ----------
function iconTicket(x, y, w, h, col, a) { cx.save(); cx.globalAlpha = a === undefined ? 1 : a; cx.fillStyle = col; rr(x, y, w, h, 6); cx.fill(); cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.arc(x, y + h / 2, h * .22, 0, 7); cx.arc(x + w, y + h / 2, h * .22, 0, 7); cx.fill(); cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.setLineDash([5, 5]); cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x + w * .68, y + 6); cx.lineTo(x + w * .68, y + h - 6); cx.stroke(); cx.restore(); }
function iconCoin(x, y, r, a) { cx.save(); cx.globalAlpha = a === undefined ? 1 : a; cx.fillStyle = C.gold; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill(); cx.strokeStyle = '#B98300'; cx.lineWidth = r * .12; cx.beginPath(); cx.arc(x, y, r * .72, 0, 7); cx.stroke(); txt('₹', x, y + r * .36, r * 1.0, '#8A5F00', NUM, 'center'); cx.restore(); }
function iconBank(x, y, s, col) { cx.fillStyle = col; cx.beginPath(); cx.moveTo(x - s, y - s * .2); cx.lineTo(x, y - s); cx.lineTo(x + s, y - s * .2); cx.closePath(); cx.fill(); for (var i = -2; i <= 2; i++) { rr(x + i * s * .38 - s * .09, y - s * .1, s * .18, s * .7, 3); cx.fill(); } rr(x - s, y + s * .68, s * 2, s * .16, 3); cx.fill(); }
function iconGear(x, y, r, col) { cx.fillStyle = col; for (var i = 0; i < 8; i++) { cx.save(); cx.translate(x, y); cx.rotate(i * Math.PI / 4); rr(-r * .16, -r * 1.05, r * .32, r * .5, 3); cx.fill(); cx.restore(); } cx.beginPath(); cx.arc(x, y, r * .78, 0, 7); cx.fill(); cx.globalCompositeOperation = 'destination-out'; cx.beginPath(); cx.arc(x, y, r * .32, 0, 7); cx.fill(); cx.globalCompositeOperation = 'source-over'; }
function iconBuilding(x, y, s, col) { cx.fillStyle = col; rr(x - s * .5, y - s, s, s * 1.5, 4); cx.fill(); cx.fillStyle = 'rgba(255,255,255,.7)'; for (var r = 0; r < 4; r++) for (var c = 0; c < 2; c++) cx.fillRect(x - s * .3 + c * s * .35, y - s * .85 + r * s * .32, s * .2, s * .16); }
// ---------- shared finishing ----------
var grain = document.createElement('canvas'); grain.width = grain.height = 256; (function () { var g = grain.getContext('2d'), d = g.createImageData(256, 256); for (var i = 0; i < 65536; i++) { var v = hash(i) * 255; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; } g.putImageData(d, 0, 0); })();
function finish(t, dark) {
  var f = Math.floor(t * 30), ox = Math.floor(hash(f) * 256), oy = Math.floor(hash(f + 99) * 256);
  cx.save(); cx.globalAlpha = dark ? .05 : .045; cx.globalCompositeOperation = 'overlay'; var pat = cx.createPattern(grain, 'repeat'); cx.translate(-ox, -oy); cx.fillStyle = pat; cx.fillRect(0, 0, W + 256, H + 256); cx.restore();
  var g = cx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (dark ? .34 : .14) + ')'); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
}
function cam(s, e, tt, fx, fy) { var k = eio(tt), sc = lerp(s, e, k); cx.translate(fx || W / 2, fy || H / 2); cx.scale(sc, sc); cx.translate(-(fx || W / 2), -(fy || H / 2)); }
// ---------- scene A: the hook (split screen) ----------
var SCALE_A = 500 / 5062;   // px per crore: both columns share one scale (areas/heights are honest)
function sceneA(t) {
  cx.save(); cam(1.0, 1.06, pr(t, 0, 5));
  var d = eo(pr(t, .05, .7)); cx.fillStyle = C.cream; cx.fillRect(0, 0, W, H);
  cx.strokeStyle = 'rgba(16,19,28,.06)'; cx.lineWidth = 2; for (var gx = 0; gx < 960; gx += 80) { cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, H); cx.stroke(); } for (var gy = 40; gy < H; gy += 80) { cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(960, gy); cx.stroke(); }
  cx.fillStyle = C.navy; cx.fillRect(960, 0, 960, H); cx.fillStyle = 'rgba(255,255,255,.035)'; for (var gx2 = 960; gx2 < W; gx2 += 80) cx.fillRect(gx2, 0, 2, H);
  // divider
  cx.fillStyle = C.gold; var dh = H * d; cx.fillRect(956, H / 2 - dh / 2, 8, dh);
  // LEFT: ticket column (gross)
  var gH = 1547 * SCALE_A * eo(pr(t, .6, 2.4)), base = 900, colW = 340, lx = 480 - colW / 2;
  cx.fillStyle = C.teal; rr(lx, base - gH, colW, gH, 14); cx.fill();
  cx.save(); rr(lx, base - gH, colW, gH, 14); cx.clip(); for (var r = 0; r < 12; r++) { var ty = base - 44 - r * 50; if (ty > base - gH - 40) { var rise = eo(pr(t, .6 + r * .1, .9 + r * .1)); iconTicket(lx + 22, ty + (1 - rise) * 30, colW - 44, 38, 'rgba(255,255,255,.2)', rise); } } cx.restore();
  // confetti tickets flying off the top
  for (var i = 0; i < 7; i++) { var ft = t - 1.0 - i * .22, fp = ft / 1.6; if (fp > 0 && fp < 1) { var fx = 480 + Math.sin(i * 2.1) * 120 + fp * (i % 2 ? 90 : -90), fy = base - gH - 20 - Math.sin(fp * Math.PI) * 120 + fp * 40, rot = fp * 3 * (i % 2 ? 1 : -1); cx.save(); cx.translate(fx, fy); cx.rotate(rot); iconTicket(-26, -16, 52, 32, i % 2 ? C.gold : C.teal, 1 - fp * .6); cx.restore(); } }
  // RIGHT: debt column
  var dH = 5062 * SCALE_A * eo(pr(t, 1.4, 3.4)), rx = 1440 - colW / 2;
  cx.fillStyle = C.red; rr(rx, base - dH, colW, dH, 14); cx.fill();
  cx.save(); rr(rx, base - dH, colW, dH, 14); cx.clip(); for (var j = 0; j < 14; j++) { var cyy = base - 40 - j * 46; var rs = eo(pr(t, 1.4 + j * .12, 1.75 + j * .12)); cx.save(); cx.translate(rx + colW / 2, cyy); cx.scale(1, rs); iconCoin(-90, 0, 18, .85); iconCoin(-30, 0, 18, .85); iconCoin(30, 0, 18, .85); iconCoin(90, 0, 18, .85); cx.restore(); } cx.restore();
  // medallions + counters
  var a1 = eo(pr(t, .5, 1.2)), a2 = eo(pr(t, 1.3, 2.0));
  cx.save(); cx.globalAlpha = a1; iconTicket(430, 70, 100, 64, C.teal); cx.restore();
  cx.save(); cx.globalAlpha = a2; iconBank(1440, 120, 46, C.red); cx.restore();
  var nG = inr(1547 * eo(pr(t, .6, 2.4))), nD = inr(5062 * eo(pr(t, 1.4, 3.4)));
  var pop = 1 + .06 * Math.sin(cl(pr(t, 3.5, 4.1)) * Math.PI);
  cx.save(); cx.translate(480, 345); cx.scale(pop, pop); cx.globalAlpha = a1; txt('₹' + nG, 0, 0, 170, C.teal, NUM, 'center'); cx.restore();
  cx.save(); cx.translate(1440, 345); cx.scale(pop, pop); cx.globalAlpha = a2; txt('₹' + nD, 0, 0, 170, C.red, NUM, 'center'); cx.restore();
  tag('WORLDWIDE GROSS · 15 DAYS · EST.', 480, 975, C.ink, 'center', a1); tag('PRIME FOCUS GROSS DEBT · REPORTED', 1440, 975, C.grey, 'center', a2);
  cx.fillStyle = C.ink; cx.fillRect(lx - 30, base + 4, colW + 60, 6); cx.fillStyle = C.grey; cx.fillRect(rx - 30, base + 4, colW + 60, 6);
  cx.restore();
}
// ---------- scene B: 1995 garage (sepia collage, parallax) ----------
function sceneB(t) {
  var u = t - 5; cx.save(); cam(1.0, 1.1, pr(u, 0, 5), 900, 560);
  cx.fillStyle = C.sepia; cx.fillRect(-100, -100, W + 200, H + 200);
  cx.fillStyle = 'rgba(138,111,77,.09)'; for (var hx = 0; hx < W; hx += 22) for (var hy = 0; hy < H; hy += 22) { cx.beginPath(); cx.arc(hx + (hy / 22 % 2) * 11, hy, 2.2, 0, 7); cx.fill(); }
  var par = function (k) { cx.translate(-(u - 2.5) * 10 * k, 0); };
  // back wall + shutter
  cx.save(); par(.4); cx.fillStyle = C.sepia2; cx.fillRect(220, 130, 1100, 700); cx.strokeStyle = 'rgba(91,70,48,.25)'; cx.lineWidth = 3; for (var by = 160; by < 830; by += 46) { cx.beginPath(); cx.moveTo(220, by); cx.lineTo(1320, by); cx.stroke(); }
  var up = eo(pr(u, .2, 1.4)), sh = 360 * (1 - up * .85); cx.fillStyle = '#C9B48B'; cx.fillRect(330, 170, 880, sh); cx.fillStyle = 'rgba(91,70,48,.35)'; for (var s = 0; s < sh; s += 36) cx.fillRect(330, 170 + s, 880, 4);
  cx.fillStyle = C.sepiaDk; cx.fillRect(330, 164, 880, 10); cx.restore();
  // hanging bulb
  cx.save(); par(.6); var sw = Math.sin(u * 2.2) * .1 * Math.exp(-u * .2); cx.translate(770, 130); cx.rotate(sw); cx.strokeStyle = C.sepiaDk; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(0, 120); cx.stroke(); var gl = cx.createRadialGradient(0, 150, 4, 0, 150, 190); gl.addColorStop(0, 'rgba(255,214,120,.55)'); gl.addColorStop(1, 'rgba(255,214,120,0)'); cx.fillStyle = gl; cx.fillRect(-200, -40, 400, 400); cx.fillStyle = '#FFD878'; cx.beginPath(); cx.arc(0, 150, 26, 0, 7); cx.fill(); cx.restore();
  // desk + CRT computer
  cx.save(); par(1.0); var dk = eo(pr(u, .7, 1.5)); cx.translate(0, (1 - dk) * 200); cx.globalAlpha = dk;
  cx.fillStyle = C.sepiaDk; cx.fillRect(360, 700, 780, 28); cx.fillRect(400, 728, 24, 150); cx.fillRect(1076, 728, 24, 150);
  cx.fillStyle = '#D9CBA8'; rr(520, 470, 300, 232, 18); cx.fill(); cx.fillStyle = '#0B2B26'; rr(546, 494, 248, 170, 10); cx.fill();
  var gl2 = .65 + .35 * Math.sin(u * 5); cx.fillStyle = 'rgba(15,157,122,' + gl2 + ')'; cx.save(); cx.translate(670, 580); var ang = u * 1.6, P = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], pp = P.map(function (v) { var x = v[0] * Math.cos(ang) - v[2] * Math.sin(ang), z = v[0] * Math.sin(ang) + v[2] * Math.cos(ang), y = v[1] * Math.cos(.6) - z * Math.sin(.6); return [x * 38, y * 38]; }); cx.strokeStyle = 'rgba(15,200,150,' + gl2 + ')'; cx.lineWidth = 4; [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { cx.beginPath(); cx.moveTo(pp[e[0]][0], pp[e[0]][1]); cx.lineTo(pp[e[1]][0], pp[e[1]][1]); cx.stroke(); }); cx.restore();
  cx.fillStyle = '#D9CBA8'; rr(620, 702 - 14, 100, 14, 4); cx.fill(); rr(900, 676, 170, 26, 6); cx.fill();
  cx.restore();
  // boxes (mid foreground)
  cx.save(); par(1.4); cx.fillStyle = '#C9A877'; var bb = eo(pr(u, 1.0, 1.7)); cx.globalAlpha = bb; cx.fillRect(1180, 700 + (1 - bb) * 100, 190, 150); cx.fillRect(1230, 590 + (1 - bb) * 100, 150, 110); cx.restore();
  // calendar "1995" stamp
  var cp = ob(pr(u, 1.6, 2.2)); if (cp > 0) { cx.save(); cx.translate(1420, 300); cx.rotate(-.1); cx.scale(cp, cp); cx.fillStyle = '#FBF6EA'; rr(-190, -150, 380, 330, 14); cx.fill(); cx.fillStyle = C.sepiaDk; rr(-190, -150, 380, 82, 14); cx.fill(); cx.fillRect(-190, -110, 380, 42); txt('1995', 0, 105, 150, C.sepiaDk, NUM, 'center'); cx.restore(); }
  // loan slip
  var ls = eo(pr(u, 2.5, 3.3)); if (ls > 0) { cx.save(); cx.translate(lerp(2200, 1500, ls), 700); cx.rotate(.06); cx.fillStyle = '#FFFFFF'; rr(-200, -90, 400, 180, 8); cx.fill(); cx.strokeStyle = C.sepiaInk; cx.lineWidth = 3; cx.setLineDash([10, 8]); rr(-190, -80, 380, 160, 6); cx.stroke(); cx.setLineDash([]); cx.fillStyle = C.sepiaInk; for (var l = 0; l < 3; l++) cx.fillRect(-150, -40 + l * 30, 200 - l * 40, 8); cx.restore(); var st = ob(pr(u, 3.4, 3.9)); if (st > 0) { cx.save(); cx.translate(1560, 700); cx.rotate(-.2); cx.scale(st, st); cx.strokeStyle = C.red; cx.lineWidth = 8; rr(-120, -42, 240, 84, 10); cx.stroke(); txt('LOAN', 0, 22, 64, C.red, NUM, 'center', 6); cx.restore(); } }
  // guiding tag
  tag('AGE 19  ·  BANK LOAN  ·  GARAGE', 100, 960, C.sepiaDk, 'left', eo(pr(u, 2.6, 3.2)));
  cx.restore();
}
// ---------- scene C: the balance (diagram) ----------
function sceneC(t) {
  var u = t - 10; cx.save(); cam(1.04, 1.0, pr(u, 0, 5));
  cx.fillStyle = C.cream; cx.fillRect(-60, -60, W + 120, H + 120); cx.strokeStyle = 'rgba(16,19,28,.05)'; cx.lineWidth = 2; for (var gx = 0; gx < W; gx += 80) { cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, H); cx.stroke(); } for (var gy = 0; gy < H; gy += 80) { cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(W, gy); cx.stroke(); }
  var K = 4.0, pcx = 960, pcy = 560, arm = 640;
  var wP = eo(pr(u, .5, 1.0)), wI = ob(pr(u, 1.0, 1.55)), wG = ob(pr(u, 1.5, 2.0)), wB = ob(pr(u, 2.0, 2.5));
  var left = wP * 1 + wI * .25 + wG * .3 + wB * .3, rev = eo(pr(u, 2.9, 4.2));
  var th = -(.17 * left) * (1 - rev * .96) + .02 * Math.sin(u * 6) * Math.exp(-u * .8) * (1 - rev);
  // pivot
  cx.fillStyle = C.gold; cx.beginPath(); cx.moveTo(pcx, pcy - 40); cx.lineTo(pcx - 110, pcy + 250); cx.lineTo(pcx + 110, pcy + 250); cx.closePath(); cx.fill(); rr(pcx - 260, pcy + 250, 520, 26, 8); cx.fill();
  cx.save(); cx.translate(pcx, pcy - 40); cx.rotate(th); cx.fillStyle = C.ink; rr(-arm - 20, -14, arm * 2 + 40, 28, 14); cx.fill(); cx.fillStyle = C.gold; cx.beginPath(); cx.arc(0, 0, 22, 0, 7); cx.fill(); cx.restore();
  var Lx = pcx - Math.cos(th) * arm, Ly = pcy - 40 - Math.sin(th) * arm, Rx = pcx + Math.cos(th) * arm, Ry = pcy - 40 + Math.sin(th) * arm, hang = 230;
  function pan(px, py) { cx.strokeStyle = C.ink; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px - 150, py + hang); cx.moveTo(px, py); cx.lineTo(px + 150, py + hang); cx.stroke(); cx.fillStyle = C.ink; rr(px - 190, py + hang, 380, 16, 8); cx.fill(); }
  pan(Lx, Ly); pan(Rx, Ry);
  var Ly2 = Ly + hang, Ry2 = Ry + hang;
  // left weights: payroll (true size), finance cost (true size), two undisclosed (hollow, icons)
  var sP = Math.sqrt(2885) * K, sI = Math.sqrt(558) * K;
  function drop(k, y0) { return (1 - Math.min(1, k)) * -520; }
  cx.save(); var py = Ly2 - sP + drop(wP); cx.fillStyle = C.red; rr(Lx - 170, py, sP, sP, 10); cx.fill(); iconCoin(Lx - 170 + sP / 2, py + sP / 2, 44); cx.restore();
  var iy = Ly2 - sI + drop(wI); cx.fillStyle = C.redD; rr(Lx - 170 + sP + 14, iy, sI, sI, 8); cx.fill(); txt('%', Lx - 170 + sP + 14 + sI / 2, iy + sI * .72, sI * .7, '#fff', HEAD, 'center');
  [[wG, 0], [wB, 1]].forEach(function (q) { var s = 62, gx = Lx - 170 + sP + 14 + sI + 12 + q[1] * (s + 10) - (q[1] ? 0 : 0), gy = Ly2 - s - 0 + drop(q[0]); cx.save(); cx.setLineDash([10, 8]); cx.strokeStyle = C.ink; cx.lineWidth = 4; rr(gx, gy, s, s, 8); cx.stroke(); cx.setLineDash([]); if (q[1]) iconBuilding(gx + s / 2, gy + s * .42, 28, C.ink); else iconGear(gx + s / 2, gy + s / 2, 21, C.ink); cx.restore(); });
  // right: revenue slab grows
  var sR = Math.sqrt(3950) * K * (.35 + .65 * rev); cx.fillStyle = C.teal; rr(Rx - sR / 2, Ry2 - sR, sR, sR, 10); cx.fill(); cx.save(); cx.globalAlpha = .9; for (var ti = 0; ti < 3; ti++) iconTicket(Rx - sR / 2 + 18, Ry2 - sR + 18 + ti * Math.min(60, sR / 4), sR - 36, 34, 'rgba(255,255,255,.22)'); cx.restore();
  // tags
  tag('PAYROLL  ₹2,885 CR', Lx, Ly2 + 70, C.ink, 'center', eo(pr(u, 1.3, 1.9))); tag('FY24 · REPORTED', Lx, Ly2 + 108, C.grey, 'center', eo(pr(u, 1.3, 1.9)));
  tag('REVENUE  ₹3,950 CR', Rx, Ry2 + 70, C.teal, 'center', eo(pr(u, 3.3, 3.9)));
  cx.restore();
}
// ---------- scene D: the number (navy, race, silence beat, waterfall) ----------
function sceneD(t) {
  var u = t - 15, shake = 0; var bt = u - 3.15; if (bt > 0 && bt < .5) shake = Math.sin(bt * 90) * 10 * (1 - bt / .5);
  cx.save(); cx.translate(shake, shake * .6); cx.fillStyle = C.navy; cx.fillRect(-40, -40, W + 80, H + 80); cx.fillStyle = 'rgba(255,255,255,.04)'; for (var gx = 0; gx < W; gx += 80) cx.fillRect(gx, 0, 2, H); for (var gy = 0; gy < H; gy += 80) cx.fillRect(0, gy, W, 2);
  var X0 = 460, PX = 1300 / 5062, rows = [300, 520, 740], tr = eo(pr(u, .1, .7));
  rows.forEach(function (y) { cx.fillStyle = 'rgba(255,255,255,.06)'; rr(X0, y, 1300 * tr, 120, 14); cx.fill(); });
  var g = eo(pr(u, .8, 2.0)), b = eo(pr(u, 1.3, 2.4)), d = eo(pr(u, 1.8, 3.1));
  // labels as icons + tiny tags
  cx.save(); cx.globalAlpha = tr; iconTicket(150, 330, 120, 60, C.teal); txt('GROSS', 150, 440, 26, C.grey, LAB, 'left', 3); iconCoin(210, 590, 40); txt('BUDGET', 150, 665, 26, C.grey, LAB, 'left', 3); iconBank(210, 770, 54, C.red); txt('DEBT', 150, 890, 26, C.grey, LAB, 'left', 3); cx.restore();
  // gross bar (will break apart at the end)
  var wf = pr(u, 3.9, 5.0), gw = 1547 * PX * g;
  if (wf <= 0) { cx.fillStyle = C.teal; rr(X0, 300, gw, 120, 14); cx.fill(); }
  else { var parts = [['%', 0], ['▮', 1], ['▶', 2]]; var pw = 1547 * PX / 4; for (var i = 0; i < 3; i++) { var k = eo(pr(u, 3.9 + i * .22, 4.6 + i * .22)); cx.save(); cx.translate(X0 + i * pw + k * 70 * (i + 1), 300 - k * (i % 2 ? -190 : 190)); cx.rotate(k * (i - 1) * .35); cx.globalAlpha = 1 - k * .35; cx.fillStyle = C.teal; rr(0, 0, pw - 6, 120, 12); cx.fill(); txt(['TAX', 'THEATRE', 'DISTRIB.'][i], (pw - 6) / 2, 72, 30, '#fff', LAB, 'center', 2); cx.restore(); }
    var q = eo(pr(u, 4.5, 5)); cx.save(); cx.globalAlpha = q; cx.setLineDash([14, 10]); cx.strokeStyle = C.teal; cx.lineWidth = 5; rr(X0 + 3 * pw, 300, pw, 120, 12); cx.stroke(); cx.setLineDash([]); txt('?', X0 + 3 * pw + pw / 2, 388, 100, C.teal, NUM, 'center'); cx.restore(); }
  // budget band (range 1,600-2,000)
  cx.fillStyle = C.verm; rr(X0, 520, 1600 * PX * b, 120, 14); cx.fill(); var rg = eo(pr(u, 2.2, 2.9)); cx.save(); cx.globalAlpha = rg; cx.fillStyle = 'rgba(232,85,61,.4)'; cx.fillRect(X0 + 1600 * PX, 520, 400 * PX, 120); cx.strokeStyle = C.verm; cx.lineWidth = 4; cx.setLineDash([8, 8]); cx.strokeRect(X0 + 1600 * PX, 520, 400 * PX, 120); cx.restore();
  // debt bar
  cx.fillStyle = C.red; rr(X0, 740, 5062 * PX * d, 120, 14); cx.fill();
  // counters
  if (wf <= 0) txt('₹' + inr(1547 * g), X0 + gw + 28, 395, 92, C.teal, NUM, 'left');
  txt('₹1,600–2,000', X0 + 2000 * PX * b + 28, 615, 92, C.verm, NUM, 'left');
  var dnum = '₹' + inr(5062 * d), dflash = bt > 0 && bt < .35 ? 1 : 0; if (d > .03) txt(dnum, X0 + 5062 * PX * d - 24, 830, 100, dflash ? '#FFFFFF' : '#FFE8E8', NUM, 'right');
  // silence beat: hold; flash on the debt landing
  if (bt > 0 && bt < .3) { cx.fillStyle = 'rgba(229,72,77,' + (.28 * (1 - bt / .3)) + ')'; cx.fillRect(0, 0, W, H); }
  tag('SPLIT NOT PUBLIC · ILLUSTRATIVE', 1760, 1010, C.grey, 'right', eo(pr(u, 4.6, 5)));
  tag('SACNILK · EST.  /  TRADE REPORTS  /  REPORTED', 460, 1010, C.grey, 'left', tr);
  cx.restore();
}
// ---------- transitions: colour band wipe (sequential, no double exposure) ----------
var TR = [{ c: C.gold }, { c: C.teal }, { c: C.red }];
function render(t) {
  t = cl(t, 0, DUR - 1e-3); var idx = 0; for (var i = 0; i < 4; i++) if (t >= SC[i]) idx = i; var tb = null;
  for (var k = 1; k < 4; k++) if (Math.abs(t - SC[k]) < .3) tb = k;
  var show = idx; if (tb !== null && t < SC[tb]) show = tb - 1;
  cx.clearRect(0, 0, W, H); [sceneA, sceneB, sceneC, sceneD][show](t);
  var dark = show === 0 || show === 3; if (show === 1) dark = false; finish(t, dark);
  if (tb !== null) { var p = (t - (SC[tb] - .3)) / .6, x = lerp(-W * 1.1, W * 1.1, p); cx.save(); cx.fillStyle = TR[tb - 1].c; cx.beginPath(); cx.moveTo(x - 160, 0); cx.lineTo(x + W, 0); cx.lineTo(x + W - 160, H); cx.lineTo(x - 320, H); cx.closePath(); cx.fill(); cx.fillStyle = C.ink; cx.beginPath(); cx.moveTo(x + W, 0); cx.lineTo(x + W + 34, 0); cx.lineTo(x + W - 126, H); cx.lineTo(x + W - 160, H); cx.closePath(); cx.fill(); cx.restore(); }
}
window.__reelDurationSec = DUR; window.__ready = false;
window.__seek = function (t) { render(t); };
Promise.all([document.fonts.load('170px Anton', '₹0123456789'), document.fonts.load('800 30px Poppins', 'Aa%'), document.fonts.load('600 28px Plex', 'AB0'), document.fonts.load('700 40px Deva', '₹')]).then(function () { render(0); window.__ready = true; });
})();
