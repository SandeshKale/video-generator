// "Where did your ₹20 go?" v2 — fixed grid + one continuous world seen through a framed stage window ("Night Bazaar Ledger"). Every visual is a pure function of t.
// Grid: y150 tracker · y214 eyebrow/counter · y250 headline · y480-1150 STAGE (camera inside) · y1160-1536 host (right) + caption (left). Packet stays the focal point.
(function () {
  var TM = window.TM, C = TM.CUE, END = TM.END, W = 1080, H = 1920;
  var SX = 150, SY0 = 484, SW = 768, SH = 666, TB = 40, STX = SX, STY = SY0 + TB, STH = SH - TB, MX = SX + SW / 2, MY = STY + STH / 2;   // stage frame, title bar, stage window, its centre
  var cv = document.getElementById('cv'), g = cv.getContext('2d');
  function $(i) { return document.getElementById(i) }
  function lerp(a, b, u) { return a + (b - a) * u } function cl(x) { return Math.max(0, Math.min(1, x)) }
  function seg(t, a, b) { return cl((t - a) / (b - a)) } function e3(u) { return u * u * (3 - 2 * u) } function eo(u) { return 1 - Math.pow(1 - u, 3) }
  function eob(u) { var c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2) }
  function ih(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x) }
  var AM = '#ffb03a', MT = '#2de2c0', RD = '#ff4057', CR = '#f3ead6', INK = '#0a0f2e';
  var G = 1260, PY = 1085;                                    // ground line, packet flight height (world)
  var N = { app: 560, yb: 920, sw: 1280, sb: 1640 };
  var EV = []; function ev(t, k) { EV.push([+t.toFixed(3), k]) }
  var REF = false;

  // ---- camera (t, cx, z): the ground always lands at screen y≈1090 so the packet lane stays in the same place ----------------------------------------
  var CAM = [[0, 200, .9], [3.0, 200, .9], [4.9, 1110, .54], [12.3, 1130, .55], [14.6, 230, .9], [14.9, 260, .9], [16.5, 560, .95], [20.3, 620, .95], [21.8, 920, .95], [23.5, 1280, .92],
    [29.0, 1280, .85], [31.0, 1100, .95], [33.7, 920, 1.0], [34.6, 1060, .95], [36.9, 1500, .95], [38.0, 1640, 1.0], [39.5, 1640, 1.0], [41.6, 260, .9], [43.2, 220, .9], [43.9, 1520, .7],
    [48.0, 1500, .7], [50.4, 1250, .7], [52.8, 1000, .8], [54.4, 1110, .54], [END, 1110, .54]];
  var SHK = [];
  function cam(t) {
    var i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
    var a = CAM[i], b = CAM[i + 1], u = e3(seg(t, a[0], b[0])), cx = lerp(a[1], b[1], u), z = lerp(a[2], b[2], u);
    cx += Math.sin(t * .9) * 4;
    SHK.forEach(function (s) { var d = t - s[0]; if (d > 0 && d < .35) { var k = 1 - d / .35; cx += Math.sin(d * 90) * s[1] * k * k } });
    return [cx, z, G - (1090 - MY) / z];
  }

  // ---- money packets (pure functions of t) -----------------------------------------------------------------------------------------------------------
  function mix(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)] }
  function arc(a, b, u, h) { var p = mix(a, b, e3(u)); p[1] -= Math.sin(u * Math.PI) * h; return p }
  var T_TAP = C.tap, T_APP = 16.6, T_YB1 = C.bank + 1.55, T_SW = C.switch + .3;
  var T_D0 = C.msg1 + .1, T_D1 = C.cut - .1, T_C0 = C.msg2 + .05, T_C1 = C.add - .05, T_Y0 = C.back - .1, T_TICK = C.tick, T_F = C.but + .1;
  var T_YES1 = C.yes1, T_YES2 = C.yes2, T_NR = C.noreply, T_REV0 = C.five - .5, T_REV1 = C.hundred - .15;
  var PH = [150, PY], AP = [N.app, PY], YB = [N.yb, PY], SWP = [N.sw, PY], SB = [N.sb, PY];
  function reqPos(t) {
    if (t < T_TAP || t >= T_D0 - .3) return null;
    if (t < T_APP) return arc(PH, AP, seg(t, T_TAP, T_APP), 140);
    if (t < C.bank + .1) return [AP[0], PY + Math.sin(t * 3) * 6];
    if (t < T_YB1) return arc(AP, YB, seg(t, C.bank + .1, T_YB1), 90);
    if (t < C.switch - .2) return [YB[0], PY + Math.sin(t * 3) * 6];
    if (t < T_SW) return arc(YB, SWP, seg(t, C.switch - .2, T_SW), 90);
    var a = (t - T_SW) * 1.3; return [SWP[0] + Math.cos(a) * 100, G - 150 + Math.sin(a) * 24];
  }
  function debPos(t) { if (t < T_D0 || t >= T_YES1 + .6) return null; if (t < T_D1) return arc(SWP, YB, seg(t, T_D0, T_D1), 80); return [YB[0], PY + Math.sin(t * 4) * 5] }
  function crdPos(t) { if (t < T_C0 || t >= T_YES2 + .6) return null; if (t < T_C1) return arc(SWP, SB, seg(t, T_C0, T_C1), 80); return [SB[0], PY + Math.sin(t * 4) * 5] }
  function yesPos(t, w) { var s = w ? T_Y0 : T_Y0 + .25, a = w ? SB : YB; if (t < s || t > T_TICK + .15) return null;
    if (t < s + .8) return arc(a, SWP, seg(t, s, s + .8), 70); if (t < s + 1.35) return arc(SWP, AP, seg(t, s + .8, s + 1.35), 70); return arc(AP, PH, seg(t, s + 1.35, T_TICK), 80) }
  function failPos(t) { if (t < T_F + .2 || t > 52.8) return null; if (t < 44.9) return arc(SWP, SB, seg(t, T_F + .2, 44.9), 90); return [SB[0] + Math.sin(t * 1.5) * 4, PY - 6 + Math.sin(t * 2) * 5] }
  function revPos(t) { if (t < T_REV0 || t > T_REV1 + .5) return null; if (t < T_REV1) return arc(SWP, YB, seg(t, T_REV0, T_REV1), 90); return [YB[0], PY] }
  function ybBal(t) { return t < T_YES1 ? 150 : t < T_F - .2 ? 130 : t < T_F + .8 ? 150 : t < T_REV1 ? 130 : 150 }
  function sbBal(t) { return t < T_YES2 ? 0 : t < T_F - .2 ? 20 : 0 }
  var BALT = [T_YES1, T_F - .2, T_F + .8, T_REV1, T_YES2];

  // ---- drawing helpers -------------------------------------------------------------------------------------------------------------------------------
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath() }
  function txt(s, x, y, font, col, al, sh) { if (REF) return; g.font = font; g.fillStyle = col; g.textAlign = al || 'left'; g.textBaseline = 'alphabetic'; if (sh) { g.shadowColor = sh; g.shadowBlur = 14 } g.fillText(s, x, y); g.shadowBlur = 0 }
  function glow(x, y, r, col, a) { var gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.save(); g.globalAlpha = a; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore() }
  function backdrop(t) {            // full-canvas night, drawn once per frame behind the framed stage
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#070a24'); gr.addColorStop(.5, '#10133f'); gr.addColorStop(1, '#0a0f2e'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (var i = 0; i < 60; i++) { g.globalAlpha = .12 + .25 * ih(i, 4) * (.6 + .4 * Math.sin(t * (1 + ih(i, 3) * 2) + i)); g.fillStyle = CR; g.fillRect(ih(i, 1) * W, ih(i, 2) * 480, 2, 2) } g.globalAlpha = 1;
  }
  function stageSky(t, cx, z) {     // inside the stage window: gradient + two parallax skylines
    var gr = g.createLinearGradient(0, STY, 0, STY + STH); gr.addColorStop(0, '#14164a'); gr.addColorStop(.6, '#2a1f5c'); gr.addColorStop(1, '#0d1238'); g.fillStyle = gr; g.fillRect(STX, STY, SW, STH);
    glow(STX + 600 - cx * .02, STY + 120, 150, 'rgba(255,200,120,.35)', .55); g.fillStyle = '#ffe9b8'; g.beginPath(); g.arc(STX + 600 - cx * .02, STY + 120, 30, 0, 7); g.fill();
    [[.12, 540, '#1a1d58', 70, 200, 3], [.22, 700, '#202470', 50, 150, 7]].forEach(function (L) { var off = -cx * L[0] * z, w0 = 100; g.fillStyle = L[2];
      for (var k = Math.floor((-off - 60) / w0) - 1; k < Math.floor((-off + SW + 60) / w0) + 2; k++) { var bw = 70 + ih(k, L[5]) * 90, bh = L[3] + ih(k, L[5] + 1) * (L[4] - L[3]), bx = STX + k * w0 + off; g.fillRect(bx, STY + L[1] - bh, bw, bh + 200);
        for (var wy = STY + L[1] - bh + 14; wy < STY + L[1] - 8; wy += 24) for (var wx = bx + 10; wx < bx + bw - 12; wx += 22) if (ih(k * 31 + wx * .1, wy * .1) > .66) { g.fillStyle = 'rgba(255,200,110,.28)'; g.fillRect(wx, wy, 8, 11) } g.fillStyle = L[2] } });
  }
  function windows(x, y, w, h, seed, t) {
    var cx = Math.floor((w - 40) / 44), cy = Math.floor((h - 150) / 58);
    for (var j = 0; j < cy; j++) for (var i = 0; i < cx; i++) { var on = ih(i * 7 + j * 13, seed) > .42, fl = on ? .55 + .35 * Math.sin(t * (.6 + ih(i, j + seed)) + i + j) : .12; g.fillStyle = on ? 'rgba(255,205,120,' + fl + ')' : 'rgba(120,130,200,.12)'; g.fillRect(x + 22 + i * 44, y + 24 + j * 58, 26, 34) }
  }
  function building(x, w, h, base, label, seed, t, accent, active) {
    var gr = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); gr.addColorStop(0, base); gr.addColorStop(1, '#0d1238');
    g.fillStyle = gr; g.fillRect(x - w / 2, G - h, w, h); g.fillStyle = 'rgba(243,234,214,.16)'; g.fillRect(x - w / 2, G - h, w, 6); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + w / 2 - 14, G - h, 14, h);
    windows(x - w / 2, G - h + 100, w, h - 260, seed, t);
    g.save(); rr(x - w / 2 + 12, G - h + 14, w - 24, 92, 14); g.fillStyle = active ? accent : 'rgba(10,15,46,.95)'; g.fill(); g.lineWidth = 5; g.strokeStyle = accent; g.stroke(); g.restore();
    txt(label, x, G - h + 80, '800 68px BS', active ? INK : CR, 'center');
    g.fillStyle = '#05071c'; rr(x - 42, G - 104, 84, 104, 8); g.fill(); g.fillStyle = accent; g.globalAlpha = .6 + .3 * Math.sin(t * 2); g.fillRect(x - 32, G - 96, 64, 6); g.globalAlpha = 1;
  }
  function balance(x, w, val, t, color) {
    if (REF) return; var y = G - 330, px = x - w / 2 + 24, pw = w - 48; g.save(); rr(px, y, pw, 140, 14); g.fillStyle = 'rgba(5,7,28,.94)'; g.fill(); g.lineWidth = 4; g.strokeStyle = color; g.stroke(); g.restore();
    txt('BALANCE', x, y + 34, '500 23px DM', 'rgba(243,234,214,.75)', 'center');
    var ch = -1; BALT.forEach(function (b) { if (t >= b && t < b + .3) ch = (t - b) / .3 });
    var prev = ch >= 0 ? (val === 150 ? 130 : val === 130 ? 150 : val === 20 ? 0 : 20) : val;
    g.save(); g.beginPath(); g.rect(px, y + 42, pw, 94); g.clip();
    if (ch >= 0) { var u = e3(ch); txt('₹' + prev, x, y + 114 - u * 96, '800 84px BS', CR, 'center'); txt('₹' + val, x, y + 210 - u * 96, '800 84px BS', color, 'center') } else txt('₹' + val, x, y + 114, '800 84px BS', val === 130 ? AM : CR, 'center'); g.restore();
  }
  function packet(p, mode, t, a, tag) {
    if (!p || REF) return; var x = p[0], y = p[1], w = 200, h = 100; g.save(); var al = a == null ? 1 : a;
    for (var k = 6; k >= 1; k--) { g.globalAlpha = al * (.22 - k * .03); g.fillStyle = mode === 'yes' ? '#6cf5c8' : mode === 'deb' ? RD : AM; g.beginPath(); g.arc(x - k * 22 * (mode === 'rev' ? -1 : 1), y + 8, 20 * (1 - k * .1), 0, 7); g.fill() }
    g.globalAlpha = al; glow(x, y, 150, mode === 'yes' ? 'rgba(45,226,192,.8)' : mode === 'deb' ? 'rgba(255,64,87,.7)' : 'rgba(255,176,58,.85)', .7);
    if (mode === 'yes') { g.fillStyle = MT; g.beginPath(); g.arc(x, y, 50, 0, 7); g.fill(); g.lineWidth = 12; g.strokeStyle = INK; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 22, y + 2); g.lineTo(x - 6, y + 20); g.lineTo(x + 26, y - 20); g.stroke() }
    else { rr(x - w / 2, y - h / 2, w, h, 16); g.fillStyle = CR; g.fill(); g.lineWidth = 8; g.strokeStyle = mode === 'deb' ? RD : mode === 'crd' ? MT : AM; g.stroke(); var lab = mode === 'deb' ? '−₹20' : mode === 'crd' ? '+₹20' : mode === 'rev' ? '↩ ₹20' : '₹20';
      txt(lab, x, y + 24, '800 74px BS', mode === 'deb' ? RD : INK, 'center');
      if (tag) { g.globalAlpha = al; rr(x - 92, y + h / 2 + 8, 184, 32, 6); g.fillStyle = AM; g.fill(); txt('REF …2250', x, y + h / 2 + 32, '500 21px DM', INK, 'center') } }
    g.restore();
  }
  function stamp(x, y, label, col, t0, t, rot, big) {
    if (REF) return; var u = seg(t, t0, t0 + .22); if (u <= 0) return; var s = (big || 1) * (u < 1 ? 1.5 - .5 * eob(u) : 1); g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = Math.min(1, u * 3);
    g.font = '800 84px BS'; var w = g.measureText(label).width + 52; rr(-w / 2, -54, w, 108, 12); g.fillStyle = 'rgba(8,12,38,.92)'; g.fill(); g.lineWidth = 9; g.strokeStyle = col; g.stroke(); txt(label, 0, 28, '800 84px BS', col, 'center'); g.restore();
  }
  function stall(t) {
    var CT = G - 190;      // counter top
    g.fillStyle = '#1a1b52'; g.fillRect(-130, CT, 520, 190); g.fillStyle = '#272a7a'; g.fillRect(-130, CT, 520, 12);
    g.fillStyle = '#10113a'; g.fillRect(-120, 640, 14, CT - 640); g.fillRect(366, 640, 14, CT - 640);
    for (var i = 0; i < 10; i++) { g.fillStyle = i % 2 ? CR : AM; g.beginPath(); g.moveTo(-140 + i * 56, 640); g.lineTo(-84 + i * 56, 640); g.lineTo(-92 + i * 56, 706); g.lineTo(-148 + i * 56, 706); g.closePath(); g.fill() }
    g.fillStyle = 'rgba(8,12,38,.92)'; rr(70, G - 120, 240, 78, 12); g.fill(); g.lineWidth = 4; g.strokeStyle = AM; g.stroke(); txt('CHAI STALL', 190, G - 62, '800 56px BS', AM, 'center');
    for (var l = 0; l < 7; l++) { var lx = -110 + l * 80, ly = 726 + Math.sin(l * 1.3) * 8; glow(lx, ly, 40, 'rgba(255,210,120,.9)', .45 + .3 * Math.sin(t * 2 + l)); g.fillStyle = '#ffe3a0'; g.beginPath(); g.arc(lx, ly, 6, 0, 7); g.fill() }
    g.fillStyle = 'rgba(255,190,110,.92)'; g.beginPath(); g.moveTo(166, CT - 66); g.lineTo(224, CT - 66); g.lineTo(214, CT); g.lineTo(176, CT); g.closePath(); g.fill(); g.fillStyle = 'rgba(243,234,214,.25)'; g.fillRect(170, CT - 66, 6, 66);
    for (var s = 0; s < 3; s++) { g.strokeStyle = 'rgba(243,234,214,' + (.25 + .1 * s) + ')'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); for (var k = 0; k <= 14; k++) { var yy = CT - 76 - k * 9, xx = 195 + (s - 1) * 14 + Math.sin(t * 1.6 + k * .5 + s * 2) * (3 + k * .8); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy) } g.stroke() }
    g.fillStyle = CR; rr(262, CT - 168, 116, 168, 8); g.fill(); for (var qy = 0; qy < 9; qy++) for (var qx = 0; qx < 9; qx++) if (ih(qx * 9 + qy, 77) > .5 || (qx < 3 && qy < 3) || (qx > 5 && qy < 3) || (qx < 3 && qy > 5)) { g.fillStyle = INK; g.fillRect(270 + qx * 11, CT - 160 + qy * 11, 9, 9) } txt('SCAN & PAY', 320, CT - 12, '600 19px DM', INK, 'center');
    g.save(); g.translate(60, CT); g.rotate(-.06); g.fillStyle = '#05071c'; rr(-80, -286, 160, 286, 22); g.fill(); g.lineWidth = 5; g.strokeStyle = '#4a4f9a'; g.stroke();
    var scr = t < 3.0 ? 'paid' : t < T_TAP - .1 ? 'pay' : t < T_TAP + .15 ? 'tap' : t < T_TICK ? 'send' : 'paid';
    g.fillStyle = scr === 'paid' ? 'rgba(45,226,192,.18)' : '#10153f'; rr(-70, -272, 140, 258, 14); g.fill();
    if (scr === 'paid') { var pu = seg(t, 0, .4) * (t < 3 ? 1 : seg(t, T_TICK, T_TICK + .3)); g.fillStyle = MT; g.beginPath(); g.arc(0, -190, 36 * (.8 + .2 * pu), 0, 7); g.fill(); g.lineWidth = 8; g.strokeStyle = INK; g.lineCap = 'round'; g.beginPath(); g.moveTo(-15, -188); g.lineTo(-4, -174); g.lineTo(18, -206); g.stroke(); txt('PAID ₹20', 0, -118, '800 40px BS', CR, 'center'); txt('CHAI STALL', 0, -92, '500 15px DM', 'rgba(243,234,214,.7)', 'center'); glow(0, -190, 110, 'rgba(45,226,192,.7)', .5) }
    else { txt('Pay ₹20', 0, -206, '800 42px BS', CR, 'center'); txt('to CHAI STALL', 0, -180, '500 15px DM', 'rgba(243,234,214,.7)', 'center'); var pr = scr === 'tap' ? .93 : 1; rr(-50 * pr, -136, 100 * pr, 46, 23); g.fillStyle = scr === 'send' ? '#3a3f8a' : AM; g.fill(); txt(scr === 'send' ? '...' : 'PAY', 0, -103, '800 32px BS', scr === 'send' ? CR : INK, 'center');
      if (scr === 'send') { g.strokeStyle = MT; g.lineWidth = 6; g.beginPath(); g.arc(0, -40, 20, t * 5, t * 5 + 4); g.stroke() } }
    g.restore();
  }
  function roundabout(t, active) {
    var x = N.sw;
    for (var i = 0; i < 4; i++) { var bx = x - 180 + i * 120, bh = 150 + ih(i, 9) * 70; g.fillStyle = 'rgba(32,36,100,.8)'; g.fillRect(bx - 30, G - 30 - bh, 60, bh); for (var wy = 0; wy < 4; wy++) { g.fillStyle = 'rgba(255,200,110,' + (.15 + .15 * ih(i, wy)) + ')'; g.fillRect(bx - 20, G - 30 - bh + 16 + wy * 30, 10, 12); g.fillRect(bx + 6, G - 30 - bh + 16 + wy * 30, 10, 12) }
      g.strokeStyle = 'rgba(45,226,192,.35)'; g.lineWidth = 3; g.setLineDash([8, 10]); g.lineDashOffset = -t * 40; g.beginPath(); g.moveTo(x, G - 150); g.lineTo(bx, G - 30 - bh * .5); g.stroke(); g.setLineDash([]);
      var u = ((t * .5 + i * .27) % 1); glow(lerp(x, bx, u), lerp(G - 150, G - 30 - bh * .5, u), 18, 'rgba(45,226,192,.9)', .8) }
    g.save(); g.translate(x, G - 14); g.scale(1, .26); g.beginPath(); g.arc(0, 0, 150, 0, 7); g.fillStyle = 'rgba(10,15,46,.9)'; g.fill(); g.lineWidth = 14; g.strokeStyle = active ? MT : 'rgba(45,226,192,.55)'; g.stroke(); g.setLineDash([34, 26]); g.lineDashOffset = -t * 120; g.lineWidth = 8; g.strokeStyle = CR; g.beginPath(); g.arc(0, 0, 118, 0, 7); g.stroke(); g.setLineDash([]); g.restore();
    g.fillStyle = '#161a5a'; rr(x - 70, G - 400, 140, 380, 20); g.fill(); g.lineWidth = 5; g.strokeStyle = MT; g.stroke();
    var ba = t * 1.6; glow(x, G - 400, 110, 'rgba(45,226,192,.8)', .55 + .35 * Math.sin(ba * 2)); g.strokeStyle = MT; g.lineWidth = 6; g.beginPath(); g.moveTo(x, G - 400); g.lineTo(x + Math.cos(ba) * 130, G - 400 + Math.sin(ba) * 32); g.stroke();
    rr(x - 150, G - 360, 300, 88, 14); g.fillStyle = active ? MT : 'rgba(10,15,46,.95)'; g.fill(); g.lineWidth = 5; g.strokeStyle = MT; g.stroke(); txt('NPCI SWITCH', x, G - 296, '800 62px BS', active ? INK : CR, 'center');
    txt('PASSES MESSAGES · HOLDS NO MONEY', x, G - 244, '500 19px DM', 'rgba(243,234,214,.85)', 'center');
  }
  function ground(t) {
    g.fillStyle = '#0d1238'; g.fillRect(-900, G, 5000, 2600); g.fillStyle = '#14185a'; g.fillRect(-900, G, 5000, 8);
    g.strokeStyle = MT; g.lineWidth = 9; g.lineCap = 'round'; g.setLineDash([46, 30]); g.lineDashOffset = -t * 160; g.globalAlpha = .9; g.beginPath(); g.moveTo(-900, G + 40); g.lineTo(3600, G + 40); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    g.fillStyle = 'rgba(45,226,192,.08)'; g.fillRect(-900, G + 22, 5000, 40);
  }
  // ---- stage overlays: the RBI rule object (replaces floating cards) and the end-card dimmer ------------------------------------------------------------
  function ruleObject(t) {
    var u = seg(t, C.rbi, C.rbi + .35), uo = 1 - seg(t, C.save - 1.0, C.save - .7); var a = u * uo; if (a <= 0) return;
    g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(8,12,38,.95)'; g.fillRect(STX, STY, SW, STH);
    var y0 = STY + 70, cw = 340, ch = 330, x1 = STX + 28, x2 = STX + SW - 28 - cw;
    g.save(); g.translate(x1, y0); g.scale(.92 + .08 * e3(u), .92 + .08 * e3(u)); rr(0, 0, cw, ch, 16); g.fillStyle = CR; g.fill();                       // calendar: 5 days, ticks on the word "five"
    g.fillStyle = RD; rr(0, 0, cw, 62, 16); g.fill(); g.fillRect(0, 40, cw, 22); txt('RBI RULE', cw / 2, 46, '800 40px BS', CR, 'center');
    txt('5 DAYS', cw / 2, 168, '800 112px BS', INK, 'center'); txt('AUTO-REVERSAL', cw / 2, 208, '500 20px DM', '#8a6a1e', 'center');
    for (var d = 0; d < 5; d++) { var on = t >= C.five + d * .12; rr(24 + d * 60, 240, 52, 52, 8); g.fillStyle = on ? MT : 'rgba(10,15,46,.12)'; g.fill(); if (on) { g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(34 + d * 60, 268); g.lineTo(44 + d * 60, 280); g.lineTo(62 + d * 60, 254); g.stroke() } }
    g.restore();
    var cu = seg(t, C.hundred - .1, C.hundred + .3); g.save(); g.translate(x2, y0); g.globalAlpha = a * (.25 + .75 * cu); g.scale(.92 + .08 * e3(cu), .92 + .08 * e3(cu)); rr(0, 0, cw, ch, 16); g.fillStyle = AM; g.fill();   // the bank owes you: coin stack
    txt('OR THE BANK OWES YOU', cw / 2, 46, '500 21px DM', INK, 'center'); txt('₹100', cw / 2, 168, '800 118px BS', INK, 'center'); txt('PER DAY', cw / 2, 212, '800 44px BS', INK, 'center');
    for (var c2 = 0; c2 < 5; c2++) { g.fillStyle = c2 < Math.floor(cu * 5) ? CR : 'rgba(10,15,46,.12)'; g.beginPath(); g.ellipse(cw / 2 + (c2 - 2) * 48, 270, 22, 8, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke() }
    g.restore(); g.restore();
  }

  // ---- DOM: chips, eyebrow, counter, headline, caption, host, end card -----------------------------------------------------------------------------
  var CH = $('chips'), chips = []; ['1 APP', '2 YOUR BANK', '3 SWITCH', '4 SHOP BANK'].forEach(function (n, i) { var d = document.createElement('div'); d.className = 'chip'; d.style.left = (SX + i * 196) + 'px'; d.textContent = n; CH.appendChild(d); chips.push(d) });
  var vid = $('hostv'), avc = $('avc'), hx = avc.getContext('2d'), lastF = -1;
  function hostSeek(t) { if (!vid.duration) return Promise.resolve(); var fr = Math.floor(t * 24); if (fr === lastF) return Promise.resolve(); lastF = fr; var ft = Math.min((fr + .5) / 24, vid.duration - .02);
    return new Promise(function (res) { var dn = function () { vid.removeEventListener('seeked', dn); hx.clearRect(0, 0, 544, 544); hx.drawImage(vid, 0, 0, 544, 544); res() }; vid.addEventListener('seeked', dn); vid.currentTime = ft }) }
  var ACC = /^(₹?\d[\d,.]*|twenty|four|five|hundred|million|yes|ID|QR|NPCI|RBI|PIN|UPI|rupees|days?|stuck)$/i;
  function cap(t) { var CP = TM.CAP, k = -1; for (var i = 0; i < CP.length; i++) if (t >= CP[i][0] - .05) k = i; var c = $('capw'), r = $('capr'); if (k < 0) { c.style.opacity = 0; r.style.opacity = 0; return }
    var ws = CP[k][2], h = ''; ws.forEach(function (w, j) { var clean = w[0].replace(/[.,:;!?"']/g, ''); h += (j ? ' ' : '') + (ACC.test(clean) ? '<b>' + w[0] + '</b>' : w[0]) }); if (c.__h !== h) { c.innerHTML = h; c.__h = h } c.style.opacity = 1; r.style.opacity = 1 }
  var HL = [[0, 'WHERE DID YOUR <em>₹20</em><br>GO?', '// PAID ₹20 · UPI · CHAI STALL'], [3.0, '<em>FOUR SYSTEMS.</em><br>A FEW SECONDS.', '// SLOWED 1,000× · NOT A REAL BANK'], [12.3, 'YOU TAP <em>PAY.</em>', '// STEP 0 · YOUR PHONE'],
    [T_TAP, 'THE <em>REQUEST</em><br>LEAVES YOUR APP.', '// STEP 1 · APP → YOUR BANK'], [C.bank + 1.3, 'THE <em>SWITCH</em><br>ROUTES IT.', '// STEP 2 · NPCI · HOLDS NO MONEY'], [C.msg1 - .1, 'YOUR BANK<br><em>DEBITS ₹20.</em>', '// STEP 3 · MESSAGE ONE'],
    [C.msg2 - .1, 'THE SHOP<br><em>CREDITS ₹20.</em>', '// STEP 4 · MESSAGE TWO'], [T_Y0 - .1, 'BOTH SAY <em>YES.</em>', '// STEP 5 · THE SAME ROAD BACK'], [T_F - .3, 'THEN IT GETS<br><em>STUCK.</em>', '// REPLAY · THE SHOP NEVER ANSWERS'],
    [C.idagain - .4, 'THE <em>ID</em><br>SAVES YOU.', '// KEEP YOUR UPI REF'], [C.rbi - .1, '<em>5 DAYS</em><br>OR ₹100 / DAY.', '// RBI TAT RULE · AS READ 20 OCT 2026'], [C.save - .7, 'LIKE. SHARE.<br><em>SUBSCRIBE.</em>', '// SANDESH EXPLAINS']];
  var hlEl = $('hl'), eyeEl = $('eye'), cntEl = $('cnt'), strEl = $('str'), lastHL = -1;
  function chipOn(t) { var on = [t >= T_TAP, t >= C.bank + .1, t >= C.switch - .2, t >= T_C1]; if (t >= T_Y0 && t < T_F) on = [t >= T_Y0 + 1.3, t >= T_Y0, t >= T_Y0, t >= T_Y0 - .5]; if (t >= T_F) on = [true, t >= T_F - .1, true, t >= T_F + .4]; return on }

  // ---- events (SFX), seek -----------------------------------------------------------------------------------------------------------------------------
  ev(.0, 'boom'); ev(3.0, 'whoosh'); ev(12.2, 'print'); ev(14.5, 'whoosh'); ev(T_TAP, 'tap'); ev(T_APP, 'tick'); ev(C.bank + 1.2, 'whoosh'); ev(T_SW, 'tick'); ev(T_D0, 'swish'); ev(T_YES1, 'stamp'); ev(T_C0, 'swish'); ev(T_YES2, 'stamp');
  ev(T_Y0 - .1, 'whoosh'); ev(T_TICK, 'chime'); ev(T_F - .55, 'whoosh'); ev(T_NR, 'buzz'); ev(C.idagain, 'pop'); ev(C.rbi, 'print'); ev(C.five, 'tick'); ev(T_REV1, 'ding'); ev(C.save, 'pop'); ev(C.share, 'pop'); ev(C.follow, 'pop');
  SHK.push([T_YES1, 8], [T_YES2, 8], [T_NR, 12], [T_REV1, 8], [T_TAP, 5]);
  window.EV = EV.sort(function (a, b) { return a[0] - b[0] }); window.__reelDurationSec = END;
  window.__seek = function (t) {
    t = Math.max(0, Math.min(END - 1e-3, t)); var cm = cam(t), cx = cm[0], z = cm[1], cyc = cm[2];
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); backdrop(t);
    // stage frame (rounded panel) + clipped world
    g.save(); rr(SX - 4, SY0 - 4, SW + 8, SH + 8, 18); g.fillStyle = '#0b0f33'; g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(243,234,214,.28)'; g.stroke(); g.restore();
    g.save(); rr(STX, STY, SW, STH, 0); g.clip(); stageSky(t, cx, z);
    g.save(); g.translate(MX, MY); g.scale(z, z); g.translate(-cx, -cyc);
    var act = [t >= T_TAP && t < C.bank + 1.8 || (t >= T_Y0 + 1 && t < T_TICK), t >= C.bank + .5 && t < C.switch + .1 || (t >= T_D0 && t < T_YES1 + .6) || (t >= T_F && t < T_F + 1.3) || (t >= T_REV1 - .2 && t < T_REV1 + 1.2), t >= T_SW - .2 && t < T_D0 + .2, t >= T_C0 && t < T_YES2 + .6 || (t >= T_NR - .6 && t < T_NR + 1.5)];
    ground(t); stall(t);
    building(N.app, 280, 440, '#242a82', 'YOUR APP', 5, t, AM, act[0]); g.save(); rr(N.app - 62, G - 330, 124, 84, 14); g.fillStyle = 'rgba(5,7,28,.94)'; g.fill(); g.lineWidth = 4; g.strokeStyle = AM; g.stroke(); txt('₹', N.app, G - 262, '800 74px BS', AM, 'center'); g.restore();
    building(N.yb, 320, 480, '#2a2f90', 'YOUR BANK', 11, t, MT, act[1]); balance(N.yb, 320, ybBal(t), t, MT);
    roundabout(t, act[2]);
    building(N.sb, 320, 460, '#272c86', "SHOP'S BANK", 19, t, MT, act[3]); balance(N.sb, 320, sbBal(t), t, MT);
    [[N.app, '1', 440], [N.yb, '2', 480], [N.sw, '3', 460], [N.sb, '4', 460]].forEach(function (B, bi) { var on2 = act[bi], by = G - B[2] - 64; g.save(); g.fillStyle = on2 ? MT : 'rgba(10,15,46,.9)'; g.beginPath(); g.arc(B[0], by, 36, 0, 7); g.fill(); g.lineWidth = 5; g.strokeStyle = MT; g.stroke(); txt(B[1], B[0], by + 18, '800 52px BS', on2 ? INK : CR, 'center'); g.restore() });
    var rq = reqPos(t); if (rq) packet(rq, 'req', t, 1 - seg(t, T_D0 - .5, T_D0 - .3), true);
    packet(debPos(t), 'deb', t, 1 - seg(t, T_YES1 + .2, T_YES1 + .6)); packet(crdPos(t), 'crd', t, 1 - seg(t, T_YES2 + .2, T_YES2 + .6));
    packet(yesPos(t, 0), 'yes', t, 1 - seg(t, T_TICK - .1, T_TICK + .15)); packet(yesPos(t, 1), 'yes', t, 1 - seg(t, T_TICK - .1, T_TICK + .15));
    var fp = failPos(t); if (fp) packet(fp, 'crd', t, 1 - seg(t, 52.2, 52.8), true); packet(revPos(t), 'rev', t, 1 - seg(t, T_REV1 + .2, T_REV1 + .5), true);
    stamp(N.yb, G - 250, 'YES', MT, T_YES1, t, -.07); stamp(N.sb, G - 250, 'YES', MT, T_YES2, t, .06);
    if (t > T_NR) { var nu = 1 - seg(t, 52.2, 52.8); g.save(); g.globalAlpha = nu; stamp(N.sb, G - 230, 'NO REPLY', RD, T_NR, t, -.08, 1.0); g.restore() }
    if (t > T_REV1 - .2 && t < T_REV1 + 2.0) stamp(N.yb, G - 230, 'REVERSED', AM, T_REV1 - .15, t, -.06);
    if (t > C.idagain && t < C.five) { var ru = (t - C.idagain) % 1; g.save(); g.strokeStyle = AM; g.lineWidth = 8; g.globalAlpha = 1 - ru; g.beginPath(); g.arc(N.sb, PY, 70 + ru * 160, 0, 7); g.stroke(); g.restore() }
    g.restore();
    // stage vignette + speed streaks on whips
    var vg = g.createRadialGradient(MX, MY, 180, MX, MY, 520); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(3,4,20,.55)'); g.fillStyle = vg; g.fillRect(STX, STY, SW, STH);
    var sp = Math.abs(cam(t + .04)[0] - cam(t - .04)[0]) * cam(t)[1] / .08; if (sp > 1100) { g.save(); g.globalAlpha = Math.min(.5, (sp - 1100) / 3000); for (var s = 0; s < 12; s++) { g.fillStyle = s % 2 ? AM : MT; g.fillRect(STX, STY + 40 + ih(s, 31) * (STH - 80), SW, 3 + ih(s, 32) * 4) } g.restore() }
    ruleObject(t);
    g.restore();
    // title bar of the stage (canvas part): thin bar behind DOM labels
    g.save(); rr(SX, SY0, SW, TB, 12); g.fillStyle = 'rgba(10,15,46,.95)'; g.fill(); g.restore();
    // DOM
    var on = chipOn(t); chips.forEach(function (c, i) { c.className = 'chip' + (on[i] ? ' on' : '') });
    var hi = 0; for (var q = 0; q < HL.length; q++) if (t >= HL[q][0]) hi = q; if (hi !== lastHL) { hlEl.innerHTML = HL[hi][1]; eyeEl.innerHTML = '<i></i>' + HL[hi][2]; lastHL = hi }
    var hu = e3(seg(t, HL[hi][0], HL[hi][0] + .28)); hlEl.style.opacity = hi === 0 ? 1 : hu; hlEl.style.transform = 'translateY(' + ((hi === 0 ? 0 : (1 - hu) * 26)) + 'px)'; eyeEl.style.opacity = hi === 0 ? 1 : hu;
    cntEl.innerHTML = 'UPI PAYMENTS SINCE PLAY<b>' + Math.floor(t * 9282).toLocaleString('en-US') + '</b>'; cntEl.style.opacity = seg(t, 3.0, 3.5);
    var sa = seg(t, 12.2, 12.55); strEl.textContent = sa > 0 ? 'REF 4096 3817 2250' : ''; strEl.style.opacity = sa; strEl.className = (t > C.idagain && t < C.five && Math.floor((t - C.idagain) * 3) % 2 === 0) ? 'pulse' : '';
    var eU = seg(t, C.save - .6, C.save - .2), ec = $('endc'); ec.style.opacity = eU;
    [['b1', C.save], ['b2', C.share], ['b3', C.follow]].forEach(function (b) { var u = seg(t, b[1] - .05, b[1] + .3), el = $(b[0]); el.style.opacity = u; el.style.transform = 'scale(' + (u < 1 ? .6 + .4 * eob(u) : 1 + .05 * Math.sin((t - b[1]) * 6)) + ')' });
    $('pf').style.opacity = seg(t, C.save - .5, C.save - .2); $('hd').style.opacity = seg(t, C.save - .4, C.save - .1); $('sub').style.opacity = seg(t, C.save - .2, C.save + .1);
    if (eU > 0) { g.save(); g.globalAlpha = eU * .93; g.fillStyle = '#0a0f2e'; g.fillRect(STX, STY, SW, STH); g.restore() }
    // ambient: a light band sweeps the stage every 1.6 s (keeps frames alive without touching any hero)
    var sw = (t % 1.6) / 1.6, bx0 = STX - 220 + sw * (SW + 440); g.save(); rr(STX, STY, SW, STH, 0); g.clip(); var sg = g.createLinearGradient(bx0 - 110, 0, bx0 + 110, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,240,210,.20)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sg; g.fillRect(STX, STY, SW, STH); g.restore();
    cap(t); return hostSeek(t) };
  window.__ready = false;
  var waits = ['800 70px BS', '600 27px BS', '500 24px DM', '700 30px Inter'].map(function (x) { return document.fonts.load(x) })
    .concat([new Promise(function (r) { if (vid.readyState >= 2) r(); vid.addEventListener('loadeddata', r); vid.addEventListener('error', r); setTimeout(r, 3000) })]);
  Promise.all(waits).catch(function () {}).then(function () { return window.__seek(0) }).then(function () { window.__ready = true });
})();
