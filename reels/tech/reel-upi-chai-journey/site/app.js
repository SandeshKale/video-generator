// "Where did your ₹20 go?" — one continuous night-bazaar diorama and a travelling camera ("Night Bazaar Ledger"). Every visual is a pure function of t (window.__seek).
// World: chai stall + phone (x≈200) → YOUR APP → YOUR BANK → NPCI SWITCH (roundabout) → SHOP'S BANK along one lit road. The camera follows the money packet; no scene cuts.
(function () {
  var TM = window.TM, CUE = TM.CUE, END = TM.END, W = 1080, H = 1920;
  var cv = document.getElementById('cv'), g = cv.getContext('2d');
  function $(i) { return document.getElementById(i) }
  function lerp(a, b, u) { return a + (b - a) * u } function cl(x) { return Math.max(0, Math.min(1, x)) }
  function seg(t, a, b) { return cl((t - a) / (b - a)) } function e3(u) { return u * u * (3 - 2 * u) } function eo(u) { return 1 - Math.pow(1 - u, 3) }
  function eio(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2 } function eob(u) { var c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2) }
  function ih(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x) }
  var AM = '#ffb03a', MT = '#2de2c0', RD = '#ff4057', CR = '#f3ead6', INK = '#0a0f2e';
  var G = 1260, LANE = 1212, PY = 1130;                       // ground line, road lane, packet flight height
  var N = { app: 600, yb: 1060, sw: 1540, sb: 2030, stall: 200 };
  var C = CUE, EV = [];
  function ev(t, k) { EV.push([+t.toFixed(3), k]) }

  // ---- camera: keyframes (t, cx, z, cy), eased per segment, plus tiny handheld drift ---------------------------------------------------------------
  var CAM = [[0, 200, 1.4, 930], [3.0, 200, 1.4, 930], [4.9, 1315, .62, 1000], [12.3, 1360, .66, 1000], [14.6, 230, 1.18, 930], [14.9, 250, 1.15, 930],
    [16.5, 600, .98, 1030], [20.3, 700, .96, 1030], [21.8, 1060, .96, 1040], [23.5, 1540, .92, 1040], [29.0, 1540, .84, 1040], [31.0, 1290, .98, 1040],
    [33.7, 1060, 1.04, 1040], [34.6, 1250, .98, 1040], [36.9, 1900, .96, 1040], [38.0, 2030, 1.04, 1040], [39.5, 2030, 1.04, 1040], [41.6, 260, 1.2, 930],
    [43.2, 220, 1.3, 930], [43.9, 1800, .8, 1030], [48.0, 1780, .78, 1030], [50.4, 1500, .84, 1030], [52.8, 1220, .92, 1040], [54.5, 1315, .62, 1000], [END, 1340, .7, 1000]];
  var SHK = [];   // [time, amp] camera kicks (stamps)
  function cam(t) {
    var i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
    var a = CAM[i], b = CAM[i + 1], u = e3(seg(t, a[0], b[0]));
    var cx = lerp(a[1], b[1], u), z = lerp(a[2], b[2], u), cy = lerp(a[3], b[3], u);
    cx += Math.sin(t * .9) * 5; cy += Math.sin(t * .7 + 1) * 4;
    SHK.forEach(function (s) { var d = t - s[0]; if (d > 0 && d < .4) { var k = (1 - d / .4); cx += Math.sin(d * 90) * s[1] * k * k; cy += Math.cos(d * 80) * s[1] * k * k * .7 } });
    return [cx, z, cy];
  }

  // ---- money packets: positions as pure functions of t ------------------------------------------------------------------------------------------
  function mix(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)] }
  function arc(a, b, u, h) { var p = mix(a, b, e3(u)); p[1] -= Math.sin(u * Math.PI) * h; return p }
  var T_TAP = C.tap + .0, T_APP = 16.6, T_YB1 = C.bank + 1.55, T_SW = C.switch + .3;
  var T_D0 = C.msg1 + .1, T_D1 = C.cut - .1, T_C0 = C.msg2 + .05, T_C1 = C.add - .05, T_Y0 = C.back - .1, T_TICK = C.tick, T_F = C.but + .1;
  var T_YES1 = C.yes1 - .0, T_YES2 = C.yes2 + .0, T_NR = C.noreply + .0, T_REV0 = C.five - .5, T_REV1 = C.hundred - .15;
  var PH = [140, PY], AP = [N.app, PY], YB = [N.yb, PY], SW = [N.sw, PY], SB = [N.sb, PY];
  function reqPos(t) {      // the amber ₹20 request
    if (t < T_TAP || t >= T_D0 - .3) return null;
    if (t < T_APP) return arc(PH, AP, seg(t, T_TAP, T_APP), 150);
    if (t < C.bank + .1) return [AP[0], PY + Math.sin(t * 3) * 6];
    if (t < T_YB1) return arc(AP, YB, seg(t, C.bank + .1, T_YB1), 90);
    if (t < C.switch - .2) return [YB[0], PY + Math.sin(t * 3) * 6];
    if (t < T_SW) return arc(YB, SW, seg(t, C.switch - .2, T_SW), 90);
    var a = (t - T_SW) * 1.3; return [SW[0] + Math.cos(a) * 150, G - 70 + Math.sin(a) * 36 - 90];
  }
  function debPos(t) { if (t < T_D0 || t >= T_YES1 + .6) return null; if (t < T_D1) return arc(SW, YB, seg(t, T_D0, T_D1), 80); return [YB[0], PY + Math.sin(t * 4) * 5] }
  function crdPos(t) { if (t < T_C0 || t >= T_YES2 + .6) return null; if (t < T_C1) return arc(SW, SB, seg(t, T_C0, T_C1), 80); return [SB[0], PY + Math.sin(t * 4) * 5] }
  function yesPos(t, which) {   // two green yes ticks that come back the same road
    var s = which ? T_Y0 : T_Y0 + .25, a = which ? SB : YB; if (t < s || t > T_TICK + .15) return null;
    if (t < s + .8) return arc(a, SW, seg(t, s, s + .8), 70); if (t < s + 1.35) return arc(SW, AP, seg(t, s + .8, s + 1.35), 70); return arc(AP, PH, seg(t, s + 1.35, T_TICK), 80);
  }
  function failPos(t) {         // replay: the credit message goes quiet at the shop's bank
    if (t < T_F + .2 || t > 52.8) return null; if (t < 44.9) return arc(SW, SB, seg(t, T_F + .2, 44.9), 90); return [SB[0] + Math.sin(t * 1.5) * 4, PY - 6 + Math.sin(t * 2) * 5];
  }
  function revPos(t) { if (t < T_REV0 || t > T_REV1 + .5) return null; if (t < T_REV1) return arc(SW, YB, seg(t, T_REV0, T_REV1), 90); return [YB[0], PY] }
  function ybBal(t) { return t < T_YES1 ? 150 : t < T_F - .2 ? 130 : t < T_F + .8 ? 150 : t < T_REV1 ? 130 : 150 }
  function sbBal(t) { return t < T_YES2 ? 0 : t < T_F - .2 ? 20 : 0 }
  var BALT = [T_YES1, T_F - .2, T_F + .8, T_REV1, T_YES2];      // balance change instants (for the flip animation)

  // ---- drawing helpers -------------------------------------------------------------------------------------------------------------------------
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath() }
  var REF = false;
  function txt(s, x, y, font, col, al, sh) { if (REF) return; g.font = font; g.fillStyle = col; g.textAlign = al || 'left'; g.textBaseline = 'alphabetic'; if (sh) { g.shadowColor = sh; g.shadowBlur = 16 } g.fillText(s, x, y); g.shadowBlur = 0 }
  function glow(x, y, r, col, a) { var gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.save(); g.globalAlpha = a; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore() }
  function sky(t, cx) {
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#070a24'); gr.addColorStop(.45, '#14164a'); gr.addColorStop(.72, '#2a1f5c'); gr.addColorStop(1, '#0a0f2e'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 90; i++) { var x = ih(i, 1) * W, y = ih(i, 2) * 820, tw = .5 + .5 * Math.sin(t * (1 + ih(i, 3) * 2) + i); g.globalAlpha = .25 + .5 * tw * ih(i, 4); g.fillStyle = CR; g.fillRect(x, y, 2 + (ih(i, 5) > .9 ? 1 : 0), 2) } g.globalAlpha = 1;
    glow(880 - cx * .02, 360, 230, 'rgba(255,200,120,.35)', .5); g.fillStyle = '#ffe9b8'; g.beginPath(); g.arc(880 - cx * .02, 360, 46, 0, 7); g.fill();
  }
  function skyline(par, base, col, hmin, hmax, seed, cx, lit) {
    var off = -cx * par, w0 = 120; g.fillStyle = col;
    for (var i = -2; i < 14; i++) { var k = i + Math.floor(-off / w0); var bw = 90 + ih(k, seed) * 120, bh = hmin + ih(k, seed + 1) * (hmax - hmin), bx = k * w0 + off + (-off % w0 + w0) % w0 * 0;
      bx = k * w0 + off; g.fillRect(bx, base - bh, bw, bh + 600);
      if (lit) for (var wy = base - bh + 18; wy < base - 10; wy += 30) for (var wx = bx + 12; wx < bx + bw - 14; wx += 26) if (ih(k * 31 + wx * .1, wy * .1 + seed) > .62) { g.fillStyle = 'rgba(255,200,110,' + (.25 + .25 * ih(wx, wy)) + ')'; g.fillRect(wx, wy, 10, 14) } g.fillStyle = col }
  }
  function windows(x, y, w, h, seed, t, col) {
    var cx = Math.floor((w - 40) / 44), cy = Math.floor((h - 150) / 58);
    for (var j = 0; j < cy; j++) for (var i = 0; i < cx; i++) { var on = ih(i * 7 + j * 13, seed) > .42; var fl = on ? .55 + .35 * Math.sin(t * (.6 + ih(i, j + seed)) + i + j) : .12; g.fillStyle = on ? 'rgba(255,205,120,' + fl + ')' : 'rgba(120,130,200,.12)'; g.fillRect(x + 22 + i * 44, y + 24 + j * 58, 26, 34) }
  }
  function building(x, w, h, base, label, seed, t, accent, active) {
    var gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, base); gr.addColorStop(1, '#0d1238');
    g.fillStyle = gr; g.fillRect(x - w / 2, G - h, w, h); g.fillStyle = 'rgba(243,234,214,.16)'; g.fillRect(x - w / 2, G - h, w, 6); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + w / 2 - 14, G - h, 14, h);
    windows(x - w / 2, G - h, w, h - 40, seed, t, accent);
    g.save(); rr(x - w / 2 + 12, G - h - 4, w - 24, 96, 14); g.fillStyle = active ? accent : 'rgba(10,15,46,.92)'; g.fill(); g.lineWidth = 5; g.strokeStyle = accent; g.stroke(); g.restore();
    txt(label, x, G - h + 66, '800 70px BS', active ? INK : CR, 'center');
    g.fillStyle = '#05071c'; rr(x - 46, G - 120, 92, 120, 8); g.fill(); g.fillStyle = accent; g.globalAlpha = .6 + .3 * Math.sin(t * 2); g.fillRect(x - 36, G - 112, 72, 6); g.globalAlpha = 1;
  }
  function balance(x, w, val, t, color) {
    if (REF) return;
    var y = G - 330, px = x - w / 2 + 22, pw = w - 44; g.save(); rr(px, y, pw, 150, 14); g.fillStyle = 'rgba(5,7,28,.92)'; g.fill(); g.lineWidth = 4; g.strokeStyle = color; g.stroke(); g.restore();
    txt('BALANCE', x, y + 38, '500 25px DM', 'rgba(243,234,214,.7)', 'center');
    var ch = -1; BALT.forEach(function (b) { if (t >= b && t < b + .3) ch = (t - b) / .3 });
    var prev = ch >= 0 ? (val === 150 ? 130 : val === 130 ? 150 : val === 20 ? 0 : 20) : val;
    g.save(); g.beginPath(); g.rect(px, y + 46, pw, 98); g.clip();
    if (ch >= 0) { var u = e3(ch); txt('₹' + prev, x, y + 120 - u * 100, '800 88px BS', CR, 'center'); txt('₹' + val, x, y + 220 - u * 100, '800 88px BS', color, 'center') } else txt('₹' + val, x, y + 120, '800 88px BS', val === 130 ? AM : CR, 'center'); g.restore();
  }
  function packet(p, mode, s, t, a) {
    if (!p || REF) return; var x = p[0], y = p[1], w = 190 * s, h = 96 * s; g.save(); g.globalAlpha = a == null ? 1 : a;
    for (var k = 6; k >= 1; k--) { var q = k * .05; g.globalAlpha = (a == null ? 1 : a) * (.22 - k * .03); g.fillStyle = mode === 'yes' ? '#6cf5c8' : mode === 'deb' ? RD : AM; g.beginPath(); g.arc(x - k * 22 * s * (mode === 'rev' ? -1 : 1), y + 8, 20 * s * (1 - k * .1), 0, 7); g.fill() }
    g.globalAlpha = a == null ? 1 : a; glow(x, y, 150 * s, mode === 'yes' ? 'rgba(45,226,192,.8)' : mode === 'deb' ? 'rgba(255,64,87,.7)' : 'rgba(255,176,58,.85)', .7);
    if (mode === 'yes') { g.fillStyle = MT; g.beginPath(); g.arc(x, y, 50 * s, 0, 7); g.fill(); g.lineWidth = 12 * s; g.strokeStyle = INK; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 22 * s, y + 2 * s); g.lineTo(x - 6 * s, y + 20 * s); g.lineTo(x + 26 * s, y - 20 * s); g.stroke() }
    else { rr(x - w / 2, y - h / 2, w, h, 16 * s); g.fillStyle = CR; g.fill(); g.lineWidth = 8 * s; g.strokeStyle = mode === 'deb' ? RD : mode === 'crd' ? MT : AM; g.stroke(); var lab = mode === 'deb' ? '−₹20' : mode === 'crd' ? '+₹20' : mode === 'rev' ? '↩ ₹20' : '₹20';
      txt(lab, x, y + 22 * s, '800 ' + Math.round(70 * s) + 'px BS', mode === 'deb' ? RD : INK, 'center'); g.fillStyle = INK; g.globalAlpha *= .75; g.fillRect(x - w / 2 + 14 * s, y + h / 2 + 8 * s, w - 28 * s, 6 * s) }
    g.restore();
  }
  function stamp(x, y, label, col, t0, t, rot, big) {
    if (REF) return; var u = seg(t, t0, t0 + .22); if (u <= 0) return; var s = (big || 1) * (u < 1 ? 1.5 - .5 * eob(u) : 1) * (1 + .03 * Math.sin((t - t0) * 6) * (t - t0 < 1.2 ? 1 : 0)); g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = Math.min(1, u * 3);
    g.font = '800 92px BS'; var w = g.measureText(label).width + 56; rr(-w / 2, -58, w, 116, 12); g.fillStyle = 'rgba(8,12,38,.9)'; g.fill(); g.lineWidth = 9; g.strokeStyle = col; g.stroke(); rr(-w / 2 + 12, -46, w - 24, 92, 6); g.lineWidth = 3; g.stroke(); txt(label, 0, 30, '800 92px BS', col, 'center'); g.restore();
  }
  function stall(t, cx) {
    // awning, posts, counter, QR, glass, phone
    g.fillStyle = '#1a1b52'; g.fillRect(-130, G - 190, 520, 190); g.fillStyle = '#272a7a'; g.fillRect(-130, G - 190, 520, 12);
    g.fillStyle = '#10113a'; g.fillRect(-120, 640, 14, G - 640); g.fillRect(366, 640, 14, G - 640);
    for (var i = 0; i < 10; i++) { g.fillStyle = i % 2 ? CR : AM; g.beginPath(); g.moveTo(-140 + i * 56, 640); g.lineTo(-84 + i * 56, 640); g.lineTo(-96 + i * 56 + 8, 720); g.lineTo(-152 + i * 56 + 8, 720); g.closePath(); g.fill() }
    g.fillStyle = 'rgba(8,12,38,.9)'; rr(70, G - 120, 240, 78, 12); g.fill(); g.lineWidth = 4; g.strokeStyle = AM; g.stroke(); txt('CHAI STALL', 190, G - 62, '800 56px BS', AM, 'center');
    // string lights
    for (var l = 0; l < 7; l++) { var lx = -110 + l * 80, ly = 760 + Math.sin(l * 1.3) * 10; glow(lx, ly, 46, 'rgba(255,210,120,.9)', .5 + .35 * Math.sin(t * 2 + l)); g.fillStyle = '#ffe3a0'; g.beginPath(); g.arc(lx, ly, 6, 0, 7); g.fill() }
    // glass of chai + steam
    g.fillStyle = 'rgba(255,190,110,.9)'; g.beginPath(); g.moveTo(166, G - 260); g.lineTo(224, G - 260); g.lineTo(214, G - 190); g.lineTo(176, G - 190); g.closePath(); g.fill(); g.fillStyle = 'rgba(243,234,214,.25)'; g.fillRect(170, G - 260, 6, 70);
    for (var s = 0; s < 3; s++) { g.strokeStyle = 'rgba(243,234,214,' + (.25 + .1 * s) + ')'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); for (var k = 0; k <= 14; k++) { var yy = G - 270 - k * 10, xx = 195 + (s - 1) * 14 + Math.sin(t * 1.6 + k * .5 + s * 2) * (3 + k * .8); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy) } g.stroke() }
    // QR standee (hash cells)
    g.fillStyle = CR; rr(262, G - 360, 116, 170, 8); g.fill(); for (var qy = 0; qy < 9; qy++) for (var qx = 0; qx < 9; qx++) if (ih(qx * 9 + qy, 77) > .5 || (qx < 3 && qy < 3) || (qx > 5 && qy < 3) || (qx < 3 && qy > 5)) { g.fillStyle = INK; g.fillRect(270 + qx * 11, G - 350 + qy * 11, 9, 9) } txt('SCAN & PAY', 320, G - 206, '600 20px DM', INK, 'center');
    // phone
    g.save(); g.translate(60, G - 190); g.rotate(-.06); g.fillStyle = '#05071c'; rr(-86, -330, 172, 330, 24); g.fill(); g.lineWidth = 5; g.strokeStyle = '#4a4f9a'; g.stroke();
    var scr = t < 3.0 ? 'paid' : t < T_TAP - .1 ? 'pay' : t < T_TAP + .15 ? 'tap' : t < T_TICK ? 'send' : 'paid';
    g.fillStyle = scr === 'paid' ? 'rgba(45,226,192,.18)' : '#10153f'; rr(-76, -316, 152, 302, 16); g.fill();
    if (scr === 'paid') { var pu = seg(t, 0, .4) * (t < 3 ? 1 : seg(t, T_TICK, T_TICK + .3)); g.fillStyle = MT; g.beginPath(); g.arc(0, -210, 40 * (.8 + .2 * pu), 0, 7); g.fill(); g.lineWidth = 9; g.strokeStyle = INK; g.lineCap = 'round'; g.beginPath(); g.moveTo(-17, -208); g.lineTo(-4, -192); g.lineTo(20, -228); g.stroke(); txt('PAID ₹20', 0, -130, '800 44px BS', CR, 'center'); txt('CHAI STALL', 0, -100, '500 17px DM', 'rgba(243,234,214,.7)', 'center'); glow(0, -210, 120, 'rgba(45,226,192,.7)', .5) }
    else { txt('Pay ₹20', 0, -226, '800 46px BS', CR, 'center'); txt('to CHAI STALL', 0, -196, '500 17px DM', 'rgba(243,234,214,.7)', 'center'); var pr = scr === 'tap' ? .93 : 1; rr(-56 * pr, -150, 112 * pr, 50, 25); g.fillStyle = scr === 'send' ? '#3a3f8a' : AM; g.fill(); txt(scr === 'send' ? '...' : 'PAY', 0, -114, '800 34px BS', scr === 'send' ? CR : INK, 'center');
      if (scr === 'send') { g.strokeStyle = MT; g.lineWidth = 6; g.beginPath(); g.arc(0, -40, 22, t * 5, t * 5 + 4); g.stroke() } }
    g.restore();
  }
  function roundabout(t, active) {
    var x = N.sw, cyy = G - 20;
    for (var i = 0; i < 4; i++) { var bx = x - 330 + i * 220 + (i > 1 ? 0 : 0), bh = 190 + ih(i, 9) * 90; g.fillStyle = 'rgba(32,36,100,.8)'; g.fillRect(bx - 50, G - 40 - bh, 100, bh); for (var wy = 0; wy < 5; wy++) { g.fillStyle = 'rgba(255,200,110,' + (.15 + .15 * ih(i, wy)) + ')'; g.fillRect(bx - 34, G - 40 - bh + 18 + wy * 30, 16, 14); g.fillRect(bx + 8, G - 40 - bh + 18 + wy * 30, 16, 14) }
      g.strokeStyle = 'rgba(45,226,192,.35)'; g.lineWidth = 3; g.setLineDash([8, 10]); g.lineDashOffset = -t * 40; g.beginPath(); g.moveTo(x, G - 150); g.lineTo(bx, G - 40 - bh * .5); g.stroke(); g.setLineDash([]);
      var u = ((t * .5 + i * .27) % 1); g.fillStyle = MT; glow(lerp(x, bx, u), lerp(G - 150, G - 40 - bh * .5, u), 20, 'rgba(45,226,192,.9)', .8) }
    g.save(); g.translate(x, cyy); g.scale(1, .26); g.beginPath(); g.arc(0, 0, 250, 0, 7); g.fillStyle = 'rgba(10,15,46,.9)'; g.fill(); g.lineWidth = 16; g.strokeStyle = active ? MT : 'rgba(45,226,192,.55)'; g.stroke(); g.setLineDash([36, 28]); g.lineDashOffset = -t * 120; g.lineWidth = 8; g.strokeStyle = CR; g.beginPath(); g.arc(0, 0, 196, 0, 7); g.stroke(); g.setLineDash([]); g.restore();
    g.fillStyle = '#161a5a'; rr(x - 78, G - 440, 156, 420, 20); g.fill(); g.lineWidth = 5; g.strokeStyle = MT; g.stroke();
    var ba = t * 1.6; glow(x, G - 440, 120, 'rgba(45,226,192,.8)', .55 + .35 * Math.sin(ba * 2)); g.strokeStyle = MT; g.lineWidth = 6; g.beginPath(); g.moveTo(x, G - 440); g.lineTo(x + Math.cos(ba) * 150, G - 440 + Math.sin(ba) * 36); g.stroke();
    rr(x - 150, G - 372, 300, 92, 14); g.fillStyle = active ? MT : 'rgba(10,15,46,.95)'; g.fill(); g.lineWidth = 5; g.strokeStyle = MT; g.stroke(); txt('NPCI SWITCH', x, G - 304, '800 66px BS', active ? INK : CR, 'center');
    txt('PASSES MESSAGES · HOLDS NO MONEY', x, G - 250, '500 21px DM', 'rgba(243,234,214,.8)', 'center');
  }
  function ground(t) {
    g.fillStyle = '#0d1238'; g.fillRect(-900, G, 5000, 2600); g.fillStyle = '#14185a'; g.fillRect(-900, G, 5000, 8);
    g.fillStyle = '#0a0e2e'; g.fillRect(-900, G + 8, 5000, 120);
    g.strokeStyle = MT; g.lineWidth = 9; g.lineCap = 'round'; g.setLineDash([46, 30]); g.lineDashOffset = -t * 160; g.globalAlpha = .9; g.beginPath(); g.moveTo(-900, LANE + 24); g.lineTo(3600, LANE + 24); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    glow(N.app, LANE + 24, 5, MT, 0); g.fillStyle = 'rgba(45,226,192,.08)'; g.fillRect(-900, LANE + 6, 5000, 40);
  }
  // ---- camera-space overlays: bokeh drift, speed streaks, vignette -----------------------------------------------------------------------------------
  function bokeh(t, cx, z) { for (var i = 0; i < 14; i++) { var x = (ih(i, 11) * 1400 - cx * 1.5 * (.6 + ih(i, 12)) + t * 14 * (ih(i, 13) - .5)) % 1300; x = (x + 1300) % 1300 - 110; var y = 1180 + ih(i, 14) * 600; glow(x, y, 60 + ih(i, 15) * 90, i % 3 ? 'rgba(255,176,58,.9)' : 'rgba(45,226,192,.9)', .07 + .04 * Math.sin(t + i)) } }

  // ---- DOM: HUD, tracker chips, captions, rule cards, end card, host --------------------------------------------------------------------------------
  var CH = $('chips'), chips = []; ['1 YOUR APP', '2 YOUR BANK', '3 SWITCH', '4 SHOP BANK'].forEach(function (n, i) { var d = document.createElement('div'); d.className = 'chip'; d.style.left = (150 + i * 195) + 'px'; d.textContent = n; CH.appendChild(d); chips.push(d) });
  var rule = document.createElement('div'); rule.style.cssText = 'position:absolute;left:150px;top:610px;width:360px;opacity:0;background:#f3ead6;color:#0a0f2e;border-radius:6px;padding:14px 20px 12px;box-shadow:0 12px 30px rgba(0,0,0,.55);transform-origin:0 0'; document.body.appendChild(rule);
  var calc = document.createElement('div'); calc.style.cssText = 'position:absolute;left:150px;top:790px;width:360px;opacity:0;background:#ffb03a;color:#0a0f2e;border-radius:6px;padding:12px 20px 10px;box-shadow:0 12px 30px rgba(0,0,0,.55);transform-origin:0 0'; document.body.appendChild(calc);
  var vid = $('hostv'), avc = $('avc'), hx = avc.getContext('2d'), lastF = -1;
  function hostSeek(t) { if (!vid.duration) return Promise.resolve(); var fr = Math.floor(t * 24); if (fr === lastF) return Promise.resolve(); lastF = fr; var ft = Math.min((fr + .5) / 24, vid.duration - .02);
    return new Promise(function (res) { var dn = function () { vid.removeEventListener('seeked', dn); hx.clearRect(0, 0, 544, 544); hx.drawImage(vid, 0, 0, 544, 544); res() }; vid.addEventListener('seeked', dn); vid.currentTime = ft }) }
  var HOSTW = [[3.3, 12.0], [12.3, 14.8], [22.4, 29.0], [43.6, 52.4], [56.2, END]];
  function hostOp(t) { var o = 0; HOSTW.forEach(function (w) { var u = Math.min(seg(t, w[0], w[0] + .35), 1 - seg(t, w[1] - .3, w[1])); o = Math.max(o, e3(u)) }); return o }
  var ACC = /^(₹?\d[\d,.]*|twenty|four|five|hundred|million|yes|ID|QR|NPCI|RBI|PIN|UPI|rupees|days?)$/i;
  function cap(t) { var CP = TM.CAP, k = -1; for (var i = 0; i < CP.length; i++) if (t >= CP[i][0] - .05) k = i; var c = $('cap'), sc = $('scrim'); if (k < 0 || t > CP[k][1] + .6 && k === CP.length - 1 && t > END - 2.2) { c.style.opacity = 0; sc.style.opacity = 0; return }
    var ws = CP[k][2], h = ''; ws.forEach(function (w, j) { var on = t >= w[1]; var clean = w[0].replace(/[.,:;!?"']/g, ''); h += (j ? ' ' : '') + (on ? (ACC.test(clean) ? '<b>' + w[0] + '</b>' : w[0]) : '<span style="opacity:.22">' + w[0] + '</span>') }); c.innerHTML = h; c.style.opacity = 1; sc.style.opacity = 1 }
  var eyeEl = $('eye'), upi = $('upi'), hook = $('hook'), refEl = $('ref'); hook.innerHTML = 'Where did your <em>₹20</em> go?';
  refEl.innerHTML = '<b>REMEMBER THIS ID</b>UPI REF 4096 3817 2250';
  function phase(t) { return t < 3 ? 'PAID ₹20 · UPI · CHAI STALL' : t < 12.3 ? 'SLOWED 1,000× · ILLUSTRATION, NOT A REAL BANK' : t < T_TAP ? 'STEP 0 · YOU TAP PAY' : t < C.bank ? 'STEP 1 · THE REQUEST LEAVES YOUR APP' : t < C.switch + 1.2 ? 'STEP 2 · THE REQUEST REACHES THE SWITCH' : t < C.msg1 - .1 ? 'STEP 2 · THE SWITCH ROUTES IT' : t < C.msg2 - .1 ? 'STEP 3 · YOUR BANK DEBITS ₹20' : t < T_Y0 - .2 ? 'STEP 4 · THE SHOP\'S BANK CREDITS ₹20' : t < T_F ? 'STEP 5 · BOTH YES COME BACK' : t < C.rbi ? 'WHEN IT GETS STUCK · THE ID SAVES YOU' : t < C.save ? 'RBI TURNAROUND RULE · AS READ 20 OCT 2026' : 'SAVE THIS' }
  function chipOn(t) { var on = [t >= T_TAP, t >= C.bank + .1, t >= C.switch - .2, t >= T_C1]; if (t >= T_Y0 && t < T_F) on = [t >= T_Y0 + 1.3, t >= T_Y0, t >= T_Y0, t >= T_Y0 - .5]; if (t >= T_F) on = [true, t >= T_F - .1, true, t >= T_F + .4]; if (t >= C.save) { on = [t >= C.save, t >= C.save + .3, t >= C.save + .6, t >= C.save + .9] } return on }

  // ---- seek -----------------------------------------------------------------------------------------------------------------------------------------
  // events for the score / SFX (aligned from the same constants that draw the picture)
  ev(.0, 'boom'); ev(3.0, 'whoosh'); ev(12.2, 'print'); ev(14.5, 'whoosh'); ev(T_TAP, 'tap'); ev(T_APP, 'tick'); ev(C.bank + 1.2, 'whoosh'); ev(T_SW, 'tick'); ev(T_D0, 'swish'); ev(T_YES1, 'stamp'); ev(T_C0, 'swish'); ev(T_YES2, 'stamp');
  ev(T_Y0 - .1, 'whoosh'); ev(T_TICK, 'chime'); ev(T_F - .55, 'whoosh'); ev(T_NR, 'buzz'); ev(C.idagain, 'pop'); ev(C.five, 'print'); ev(T_REV1, 'ding'); ev(C.save, 'pop'); ev(C.follow + .1, 'pop'); ev(C.follow + .7, 'pop'); ev(C.follow + 1.3, 'pop');
  SHK.push([T_YES1, 10], [T_YES2, 10], [T_NR, 16], [T_REV1, 10], [T_TAP, 6]);
  window.EV = EV.sort(function (a, b) { return a[0] - b[0] }); window.__reelDurationSec = END;
  window.__seek = function (t) {
    t = Math.max(0, Math.min(END - 1e-3, t)); var cm = cam(t), cx = cm[0], z = cm[1], cyc = cm[2];
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); sky(t, cx);
    g.save(); g.translate(0, 80 - (z - .6) * 30); skyline(.18, 980, '#161a52', 180, 420, 3, cx * z, true); skyline(.34, 1120, '#1c1f66', 120, 320, 7, cx * z, true); g.restore();
    var AY = 1010, drawW = function () {
    ground(t);
    var act = [t >= T_TAP && t < C.bank + 1.8 || (t >= T_Y0 + 1 && t < T_TICK), t >= C.bank + .5 && t < C.switch + .1 || (t >= T_D0 && t < T_YES1 + .6) || (t >= T_F && t < T_F + 1.3) || (t >= T_REV1 - .2 && t < T_REV1 + 1.2), t >= T_SW - .2 && t < T_D0 + .2, t >= T_C0 && t < T_YES2 + .6 || (t >= T_NR - .6 && t < T_NR + 1.5)];
    if (!REF) stall(t, cx);
    building(N.app, 280, 560, '#242a82', 'YOUR APP', 5, t, AM, act[0]);
    g.save(); rr(N.app - 70, G - 440, 140, 90, 14); g.fillStyle = 'rgba(5,7,28,.92)'; g.fill(); g.lineWidth = 4; g.strokeStyle = AM; g.stroke(); txt('₹', N.app, G - 372, '800 78px BS', AM, 'center'); g.restore();
    building(N.yb, 320, 700, '#2a2f90', 'YOUR BANK', 11, t, MT, act[1]); balance(N.yb, 320, ybBal(t), t, MT);
    roundabout(t, act[2]);
    building(N.sb, 320, 620, '#272c86', "SHOP'S BANK", 19, t, MT, act[3]); balance(N.sb, 320, sbBal(t), t, MT);
    // packets
    var rq = reqPos(t); if (rq) packet(rq, 'req', 1, t, 1 - seg(t, T_D0 - .5, T_D0 - .3));
    packet(debPos(t), 'deb', 1, t, 1 - seg(t, T_YES1 + .2, T_YES1 + .6)); packet(crdPos(t), 'crd', 1, t, 1 - seg(t, T_YES2 + .2, T_YES2 + .6));
    packet(yesPos(t, 0), 'yes', 1, t, 1 - seg(t, T_TICK - .1, T_TICK + .15)); packet(yesPos(t, 1), 'yes', 1, t, 1 - seg(t, T_TICK - .1, T_TICK + .15));
    var fp = failPos(t); if (fp) packet(fp, 'crd', 1, t, 1 - seg(t, 52.2, 52.8)); packet(revPos(t), 'rev', 1, t, 1 - seg(t, T_REV1 + .2, T_REV1 + .5));
    // stamps (world space)
    stamp(N.yb, G - 560, 'YES', MT, T_YES1, t, -.07); stamp(N.sb, G - 560, 'YES', MT, T_YES2, t, .06);
    if (t > T_F - .4 && t < T_F + .5) { g.save(); g.globalAlpha = seg(t, T_F - .4, T_F) * (1 - seg(t, T_F + .2, T_F + .5)); txt('REPLAY · WHEN IT GOES WRONG', N.sw, G - 760, '800 84px BS', RD, 'center', 'rgba(0,0,0,.8)'); g.restore() }
    if (t > T_NR) { var nu = 1 - seg(t, 52.2, 52.8); g.save(); g.globalAlpha = nu; stamp(N.sb, G - 560, 'NO REPLY', RD, T_NR, t, -.08, 1.05); g.restore();
      if (t > C.gone) { g.save(); g.globalAlpha = nu * seg(t, C.gone, C.gone + .25); txt('−₹20 DEBITED · SHOP GOT ₹0', N.yb + 330, G - 690 + (1 - eo(seg(t, C.gone, C.gone + .4))) * 30, '800 64px BS', AM, 'center', 'rgba(0,0,0,.8)'); g.restore() } }
    if (t > T_REV1 - .2 && t < T_REV1 + 2.4) stamp(N.yb, G - 560, 'REVERSED', AM, T_REV1 - .15, t, -.06);
    if (t > C.idagain && t < C.five) { var ru = (t - C.idagain) % 1; g.save(); g.strokeStyle = AM; g.lineWidth = 8; g.globalAlpha = 1 - ru; g.beginPath(); g.arc(N.sw, PY - 40, 80 + ru * 190, 0, 7); g.stroke(); g.restore() }
    };
    g.save(); g.translate(540, AY); g.scale(z, z); g.translate(-cx, -cyc); drawW(); g.restore();
    var yg = AY + (G - cyc) * z; g.save(); g.beginPath(); g.rect(0, yg, W, H - yg); g.clip(); g.globalAlpha = .14; g.translate(540, AY + (2 * G - cyc) * z); g.scale(z, -z); g.translate(-cx, 0); REF = true; drawW(); REF = false; g.restore();
    var fg = g.createLinearGradient(0, yg, 0, yg + 620); fg.addColorStop(0, 'rgba(10,15,46,.1)'); fg.addColorStop(1, 'rgba(10,15,46,.96)'); g.fillStyle = fg; g.fillRect(0, yg + 4, W, H - yg);
    bokeh(t, cx, z);
    // vignette
    var vg = g.createRadialGradient(540, 960, 520, 540, 960, 1300); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(3,4,20,.6)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    // speed streaks on the whips
    var sp = Math.abs(cam(t + .04)[0] - cam(t - .04)[0]) * cam(t)[1] / .08; if (sp > 1100) { var a = Math.min(.5, (sp - 1100) / 3000); g.save(); g.globalAlpha = a; for (var s = 0; s < 14; s++) { var yy = 400 + ih(s, 31) * 800; g.fillStyle = s % 2 ? AM : MT; g.fillRect(0, yy, W, 3 + ih(s, 32) * 4) } g.restore() }
    // DOM
    var on = chipOn(t); chips.forEach(function (c, i) { c.className = 'chip' + (on[i] ? ' on' : ''); c.style.opacity = t < 3.2 ? 0 : 1 });
    eyeEl.innerHTML = '<i></i>' + phase(t); eyeEl.style.top = (t < 3.2 ? 246 : 246) + 'px';
    var hu = 1 - seg(t, 2.7, 3.3); hook.style.opacity = hu; hook.style.transform = 'translateY(' + (-(1 - hu) * 60) + 'px)';
    var cnt = Math.floor(t * 9282); upi.innerHTML = 'UPI PAYMENTS SINCE YOU PRESSED PLAY<br><span style="font:800 54px/1 BS;color:#f3ead6">' + cnt.toLocaleString('en-US') + '</span>'; upi.style.opacity = seg(t, 3.0, 3.5); upi.style.top = '280px';
    var ru2 = seg(t, 12.2, 12.55); refEl.style.opacity = ru2; refEl.style.top = '350px'; refEl.style.transform = 'scale(' + (1 + (t > C.idagain && t < C.five ? .12 * Math.sin((t - C.idagain) * 9) * Math.sin((t - C.idagain) * 9) : 0) + (1 - e3(ru2)) * .25) + ')';
    var rU = seg(t, C.rbi, C.rbi + .3), rO = 1 - seg(t, C.save + .8, C.save + 1.2); rule.style.opacity = rU * rO; rule.style.transform = 'scale(' + (.9 + .1 * e3(rU)) + ')';
    rule.innerHTML = '<div style="font:500 20px DM;letter-spacing:.1em;color:#8a6a1e">RBI TAT RULE · AS READ 20 OCT 2026</div><div style="font:800 62px/1 BS;margin-top:4px">' + (t >= C.five ? '5 DAYS' : 'AUTO-REVERSAL') + '</div>';
    var cU = seg(t, C.hundred - .1, C.hundred + .25); calc.style.opacity = cU * rO; calc.style.transform = 'scale(' + (.9 + .1 * e3(cU)) + ')';
    calc.innerHTML = '<div style="font:500 20px DM;letter-spacing:.1em">OR THE BANK OWES YOU</div><div style="font:800 62px/1 BS">₹100 / DAY</div>';
    var hop = hostOp(t); var hw = $('hostw'); hw.style.opacity = hop; hw.style.transform = 'translateY(' + ((1 - hop) * 80) + 'px)'; hw.style.display = hop > 0 ? 'block' : 'none';
    var eU = seg(t, C.follow - 1.6, C.follow - 1.1); var end = $('end'); end.style.opacity = eU;
    [['b1', 0], ['b2', .5], ['b3', 1.0]].forEach(function (b) { var u = seg(t, C.follow - 1.1 + b[1], C.follow - .8 + b[1]); var el = $(b[0]); el.style.opacity = u; el.style.transform = 'scale(' + (u < 1 ? .6 + .4 * eob(u) : 1 + .04 * Math.sin((t - C.follow) * 5 + b[1] * 4)) + ')' });
    $('pf').style.opacity = seg(t, C.follow - 1.6, C.follow - 1.3); $('hd').style.opacity = seg(t, C.follow - 1.4, C.follow - 1.1); $('sub').style.opacity = seg(t, C.follow - .9, C.follow - .6); $('save').style.opacity = seg(t, C.follow - .5, C.follow - .2);
    cap(t); return hostSeek(t) };
  window.__ready = false;
  var waits = ['800 70px BS', '600 27px BS', '500 24px DM', '700 30px Inter'].map(function (x) { return document.fonts.load(x) })
    .concat([new Promise(function (r) { if (vid.readyState >= 2) r(); vid.addEventListener('loadeddata', r); vid.addEventListener('error', r); setTimeout(r, 3000) })]);
  Promise.all(waits).catch(function () {}).then(function () { return window.__seek(0) }).then(function () { window.__ready = true });
})();
