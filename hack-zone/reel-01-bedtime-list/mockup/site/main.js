// Hack Zone #01 mockup: ONE continuous camera through the nightstand world (no cuts): wide push-in through 14 floating "tab" panes ->
// dive onto the notebook page (rack focus) -> macro dolly following the pen as it writes the list and the panes close ->
// pull back out into the dimmed, quiet room -> the CTA panes form in the window. Everything is a pure function of t.
(function () {
'use strict';
var W = 1080, H = 1920, DUR = 17.6, RW = window.RW, RM = window.RM;
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); } function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); } function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; } function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; } function back(x) { x = clamp(x, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var $ = function (id) { return document.getElementById(id); };
var spr = document.createElement('canvas'); spr.width = W; spr.height = H; var cx = spr.getContext('2d');
var MINT = '#8ef0c8', TANG = '#ff7a1a', PAPER = '#f4ecd8', INK = '#101a1a', AMB = '#f2c14e';

// ---------- timeline ----------
var T_DIVE0 = 5.4, T_MAC0 = 7.3, T_OUT0 = 11.5, T_ROOM = 12.3, T_END = 15.3;
var TASKS = ['email Priya re: invoice', 'renew passport', 'book dentist', 'pay rent', 'taxes'], TW0 = [7.5, 8.35, 9.2, 10.05, 10.9];  // write start per task
var TWD = .72;
var PANES = ['email Priya', 'renew passport', 'book dentist', 'pay rent', 'taxes', 'reply to Dad', 'gym booking', 'slides for Mon', 'call plumber', 'birthday gift', 'back up photos', 'water bill', 'buy charger', 'RSVP Meera'];
var CLOSE = []; for (var i = 0; i < 14; i++) CLOSE[i] = i < 5 ? TW0[i] + TWD + .15 : (i < 13 ? 11.45 + (i - 5) * .075 : 14.4);
// wide-plate anchors of the 14 panes: [u, v_down, nearness, size]
var PW_ = [[.28, .30, .9, 1.15], [.62, .22, .35, .7], [.80, .40, .8, 1.05], [.12, .62, .85, 1.2], [.48, .45, .3, .62], [.70, .56, .55, .9], [.90, .18, .6, .85], [.36, .12, .25, .55], [.20, .20, .5, .8], [.56, .66, .2, .5], [.84, .66, .88, 1.1], [.06, .36, .7, .95], [.44, .30, .65, .9], [.74, .30, .4, .75]];
var PM_ = [[.16, .14, .9, 1.7], [.50, .08, .8, 1.5], [.84, .16, .9, 1.7], [.30, .26, .6, 1.2], [.68, .27, .6, 1.2], [.10, .36, .5, 1.0], [.90, .36, .5, 1.0], [.42, .40, .4, .8], [.58, .41, .4, .8], [.24, .42, .35, .7], [.78, .43, .35, .7], [.5, .22, .7, 1.3], [.36, .13, .5, 1.0], [.64, .13, .5, 1.0]];

// ---------- camera: plate-space centre (u, v_down) + zoom ----------
function shf(c, z) { return [(c.cx - .5) * (1 - 1 / z), ((1 - c.cy) - .5) * (1 - 1 / z)]; }
function scr(a, c, k) { var z = 1 + (c.z - 1) * (k || 1), s = shf(c, z), px = a[0], py = 1 - a[1]; return [((px - .5 - s[0]) * z + .5) * W, (1 - ((py - .5 - s[1]) * z + .5)) * H]; }
var penX = .5;   // normalised pen-tip x in the macro frame (computed in writeState)
function camWide(t) { // plate A (room_warm) then C (room_dim)
  if (t < T_DIVE0) { var u = eio(seg(t, 0, T_DIVE0)); return { cx: .5, cy: lerp(.50, .58, u), z: lerp(1.0, 1.3, u) }; }
  var d = seg(t, T_DIVE0, T_MAC0 + .2); var e = d * d * (3 - 2 * d) * 1.0; return { cx: lerp(.5, .60, eio(d)), cy: lerp(.58, .84, eio(d)), z: lerp(1.3, 3.6, Math.pow(d, 1.6)) };
}
function camRoom(t) { var u = eio(seg(t, T_OUT0 + .2, T_END)); return { cx: lerp(.60, .5, u), cy: lerp(.84, .52, u), z: lerp(3.6, 1.0, u) }; }
function camMacro(t) { var s = eio(seg(t, T_DIVE0 + 1.3, T_MAC0 + 1.2)), tr = clamp(penX, .35, .65); return { cx: lerp(.5, tr, .55) + (t > T_MAC0 ? 0 : 0), cy: .52 + .02 * Math.sin(t * .8), z: lerp(1.55, 1.04, s) * (1 + .06 * seg(t, T_MAC0 + 3, T_OUT0)) }; }
function drift(t) { return [Math.sin(t * .9) * .25, Math.cos(t * .7) * .15]; }

// ---------- handwriting ----------
function lineGeom(A, c, li, k) { var L = A.lines[li], p0 = scr([L[0][0], L[0][1]], c, k), p1 = scr([L[1][0], L[1][1]], c, k), p2 = scr([A.lines[li + 1][0][0], A.lines[li + 1][0][1]], c, k); return { p0: p0, p1: p1, ang: Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), len: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), pitch: Math.hypot(p2[0] - p0[0], p2[1] - p0[1]) }; }
function writeProg(i, t) { return sm(seg(t, TW0[i], TW0[i] + TWD)); }
var STRIKE0 = 11.15, REWR0 = 11.45, REWR_D = 1.0, NEWTXT = '→ call accountant, 10 am';
function drawWriting(A, c, big, showPen, t) {
  if (!A) return; var ink = '#1c2650'; var tipOut = null;
  for (var i = 0; i < 5; i++) { var g = lineGeom(A, c, 2 + i * 3, 1), fs = Math.max(10, g.pitch * 1.18), pr = writeProg(i, t); if (pr <= 0) continue;
    cx.save(); cx.translate(g.p0[0], g.p0[1]); cx.rotate(g.ang); cx.font = 'italic ' + fs + 'px Ser'; var txt = '• ' + TASKS[i], tw = cx.measureText(txt).width;
    cx.beginPath(); cx.rect(-4, -fs * 1.2, tw * pr + 6, fs * 1.6); cx.clip(); cx.fillStyle = ink; cx.globalAlpha = .94; cx.fillText(txt, g.len * .03, -fs * .12); cx.restore();
    if (pr < 1 && pr > 0) tipOut = { x: g.p0[0] + Math.cos(g.ang) * (g.len * .03 + tw * pr) , y: g.p0[1] + Math.sin(g.ang) * (g.len * .03 + tw * pr), pitch: g.pitch, ang: g.ang };
    if (i === 4) { // taxes: strike then rewrite
      var sp = sm(seg(t, STRIKE0, STRIKE0 + .35)); if (sp > 0) { cx.save(); cx.translate(g.p0[0], g.p0[1]); cx.rotate(g.ang); var w2 = cx.measureText ? 0 : 0; cx.font = 'italic ' + fs + 'px Ser'; var tw2 = cx.measureText('• taxes').width; cx.strokeStyle = TANG; cx.lineWidth = Math.max(3, fs * .09); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(g.len * .03 - 6, -fs * .30); cx.bezierCurveTo(g.len * .03 + tw2 * .3, -fs * .42, g.len * .03 + tw2 * .6, -fs * .18, g.len * .03 + tw2 * sp + 6, -fs * .32); cx.stroke(); cx.restore(); }
      var rp = sm(seg(t, REWR0, REWR0 + REWR_D)); if (rp > 0) { cx.save(); cx.translate(g.p0[0], g.p0[1]); cx.rotate(g.ang); cx.font = 'italic ' + fs + 'px Ser'; var tw3 = cx.measureText('• taxes').width, tw4 = cx.measureText(NEWTXT).width; cx.beginPath(); cx.rect(g.len * .03 + tw3 + 14, -fs * 1.2, tw4 * rp + 6, fs * 1.6); cx.clip(); cx.fillStyle = ink; cx.fillText(NEWTXT, g.len * .03 + tw3 + 22, -fs * .12); cx.restore();
        if (rp < 1) tipOut = { x: g.p0[0] + Math.cos(g.ang) * (g.len * .03 + tw3 + 22 + tw4 * rp), y: g.p0[1] + Math.sin(g.ang) * (g.len * .03 + tw3 + 22 + tw4 * rp), pitch: g.pitch, ang: g.ang }; } }
  }
  if (showPen) { var tp = tipOut; if (!tp) { var lg = lineGeom(A, c, 14, 1); tp = { x: lg.p0[0] + lg.len * .62, y: lg.p0[1] - lg.pitch * .2, pitch: lg.pitch, ang: lg.ang }; }
    var s = tp.pitch / 62; cx.save(); cx.translate(tp.x, tp.y + Math.sin(t * 22) * 1.2 * s); cx.rotate(-.95); cx.shadowColor = 'rgba(0,0,0,.45)'; cx.shadowBlur = 14 * s; cx.shadowOffsetX = 10 * s; cx.shadowOffsetY = 14 * s;
    var gr = cx.createLinearGradient(0, 0, 0, -380 * s); gr.addColorStop(0, '#c79a4a'); gr.addColorStop(.07, '#c79a4a'); gr.addColorStop(.08, '#1a1d1f'); gr.addColorStop(1, '#2a2f33'); cx.fillStyle = gr; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(-9 * s, -46 * s); cx.lineTo(-11 * s, -380 * s); cx.lineTo(11 * s, -380 * s); cx.lineTo(9 * s, -46 * s); cx.closePath(); cx.fill(); cx.restore(); penX = tp.x / W; }
}

// ---------- panes ----------
function glassPane(x, y, w, h, title, open, blur, alpha, close) {
  var a = alpha * (1 - close.u); if (a <= .01) return; var sc = lerp(1, .82, close.u), yy = y - 40 * close.u;
  cx.save(); cx.globalAlpha = a; if (blur > .5) cx.filter = 'blur(' + blur.toFixed(1) + 'px)'; cx.translate(x, yy); cx.scale(sc, sc);
  var col = close.u > 0 ? MINT : TANG; cx.beginPath(); var r = 22; cx.moveTo(-w / 2 + r, -h / 2); cx.arcTo(w / 2, -h / 2, w / 2, h / 2, r); cx.arcTo(w / 2, h / 2, -w / 2, h / 2, r); cx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r); cx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r); cx.closePath();
  var g = cx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, close.u > 0 ? 'rgba(142,240,200,.34)' : 'rgba(255,150,70,.34)'); g.addColorStop(1, close.u > 0 ? 'rgba(142,240,200,.10)' : 'rgba(255,122,26,.10)'); cx.fillStyle = g; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = col; cx.globalAlpha = a * .95; cx.stroke(); cx.globalAlpha = a;
  cx.fillStyle = col; for (var d = 0; d < 3; d++) { cx.beginPath(); cx.arc(-w / 2 + 28 + d * 20, -h / 2 + 26, 5, 0, 6.3); cx.fill(); }
  cx.fillStyle = '#ffe9d2'; cx.font = '500 ' + Math.round(h * .19) + 'px Mar'; cx.textAlign = 'center'; cx.fillText(close.u > 0 ? '✓ done' : title, 0, h * .12);
  if (close.u === 0) { cx.fillStyle = '#ff5a4f'; cx.beginPath(); cx.arc(w / 2 - 22, -h / 2 + 24, 11, 0, 6.3); cx.fill(); cx.fillStyle = '#fff'; cx.font = '800 15px Man'; cx.fillText('!', w / 2 - 22, -h / 2 + 30); }
  cx.restore();
}
function drawPanes(set, c, t, focusN, scale, kPar, vis) {
  for (var i = 0; i < 14; i++) { var P = set[i], tc = CLOSE[i], cu = seg(t, tc, tc + .55); if (t > tc + .6) continue;
    var ph = i * 1.7, flo = [Math.sin(t * .8 + ph) * 8, Math.cos(t * .6 + ph) * 10]; var pos = scr([P[0], P[1]], c, 1 + P[2] * kPar); var w = 250 * P[3] * scale, h = 150 * P[3] * scale;
    var blur = clamp(Math.abs(P[2] - focusN) * 34 * (scale > 1.2 ? .8 : 1), 0, 26), flick = .86 + .14 * Math.sin(t * 9 + ph * 3) * (cu > 0 ? 0 : 1);
    glassPane(pos[0] + flo[0], pos[1] + flo[1], w, h, PANES[i], true, blur, vis * flick, { u: cu }); }
}
// ---------- end card (CTA) ----------
var prof = new Image(); prof.src = 'media/profile.jpg';
function glassBox(x, y, w, h, fill, line, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); cx.fillStyle = fill; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = line; cx.stroke(); }
function drawCTA(t) { var u = seg(t, T_END - .1, T_END + 2.0); if (u <= 0) return; cx.save();
  var chips = [['SAVE', '#8ef0c8'], ['SEND', '#8ef0c8'], ['COMMENT  TONIGHT', '#f2c14e'], ['FOLLOW', '#ff7a1a']], base = T_END; var py = 520, pr = back(seg(t, base, base + .6)); cx.globalAlpha = clamp(pr * 2, 0, 1);
  cx.save(); cx.translate(540, py); cx.scale(lerp(.8, 1, pr), lerp(.8, 1, pr)); cx.beginPath(); cx.arc(0, 0, 138, 0, 6.3); cx.fillStyle = 'rgba(142,240,200,.15)'; cx.fill(); cx.lineWidth = 8; cx.strokeStyle = MINT; cx.stroke(); cx.save(); cx.beginPath(); cx.arc(0, 0, 124, 0, 6.3); cx.clip(); if (prof.complete) cx.drawImage(prof, -124, -124, 248, 248); cx.restore(); cx.restore();
  cx.globalAlpha = clamp(seg(t, base + .2, base + .7), 0, 1); cx.fillStyle = PAPER; cx.font = '800 64px Man'; cx.textAlign = 'center'; cx.fillText('@sandesh_explains', 540, py + 230);
  for (var i = 0; i < 4; i++) { var tt = base + .5 + i * .42, a = back(seg(t, tt, tt + .45)); if (a <= 0) continue; var w = i === 2 ? 470 : 250, x = [150, 420, 150, 640][i], y = [940, 940, 1030, 1030][i]; if (i === 2) x = 150; if (i === 3) { x = 640; y = 1030; w = 278; } if (i === 1) { x = 420; w = 250; y = 940; } if (i === 0) { x = 150; w = 250; y = 940; }
    cx.save(); cx.globalAlpha = clamp(a * 2, 0, 1); cx.translate(x + w / 2, y + 42); cx.scale(lerp(.8, 1, a), lerp(.8, 1, a)); glassBox(-w / 2, -42, w, 84, 'rgba(16,26,26,.7)', chips[i][1], 26); cx.fillStyle = chips[i][1]; cx.font = '500 28px Mar'; cx.textAlign = 'center'; cx.fillText(chips[i][0], 0, 10); cx.restore(); }
  cx.restore(); }

// ---------- per-frame ----------
var CAP = [[0, 3.2, 'Brain still running a hundred tabs?'], [3.4, 5.3, 'Here\'s a five-minute fix.'], [5.5, 7.2, 'One: pen and paper.'], [7.4, 10.0, 'Two: write down everything, still hanging over you.'], [10.2, 12.3, 'Three: be specific.'], [12.6, 15.1, 'A specific plan, can quiet the loop.'], [15.3, 17.6, 'Save this. Send it. Comment TONIGHT. Follow.']];
var vids = { dust: $('dust') }; function vseek(v, t) { return new Promise(function (res) { if (!v.duration) return res(); var tt = t % v.duration; function done() { v.removeEventListener('seeked', done); res(); } v.addEventListener('seeked', done); v.currentTime = tt; setTimeout(res, 400); }); }
window.__reelDurationSec = DUR;
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 1e-3); cx.clearRect(0, 0, W, H); var dr = drift(t), o = { t: t, par: .03, dof: 0, focus: .5, bloom: 1.05, streak: .15, vig: .6, dim: 1 };
  var inWide = t < T_MAC0 + .3, inMac = t >= T_MAC0 - .7 && t < T_OUT0 + .7, inRoom = t >= T_OUT0 - .2;
  var mixM = sm(seg(t, T_MAC0 - .8, T_MAC0 - .05)), mixR = sm(seg(t, T_OUT0 - .1, T_ROOM)), cW = camWide(t), cM = camMacro(t), cR = camRoom(t);
  if (t < T_MAC0 - .05) { o.a = 'room_warm'; o.camA = [dr[0], dr[1], cW.z]; o.shA = shf(cW, cW.z); if (mixM > 0) { o.b = 'page_warm'; o.camB = [dr[0] * .5, dr[1] * .5, cM.z]; o.shB = shf(cM, cM.z); o.mix = mixM; } }
  else if (t < T_OUT0 - .1) { o.a = 'page_warm'; o.camA = [dr[0] * .5, dr[1] * .5, cM.z]; o.shA = shf(cM, cM.z); }
  else if (t < T_ROOM) { o.a = 'page_warm'; o.camA = [dr[0] * .5, dr[1] * .5, cM.z]; o.shA = shf(cM, cM.z); o.b = 'room_dim'; o.camB = [dr[0], dr[1], cR.z]; o.shB = shf(cR, cR.z); o.mix = mixR; }
  else { o.a = 'room_dim'; o.camA = [dr[0], dr[1], cR.z]; o.shA = shf(cR, cR.z); }
  // focus pulls (rack focus): panes first, then the page, then the room
  var pf = t < 1.4 ? .85 : t < 4.2 ? lerp(.85, .5, sm(seg(t, 1.4, 2.6))) : lerp(.5, .1, sm(seg(t, 4.2, 5.4)));
  o.dof = t < T_DIVE0 ? 1.1 : (t < T_MAC0 ? 1.1 + 2.4 * seg(t, T_DIVE0, T_MAC0) : (t < T_OUT0 ? 1.6 : 1.4)); o.focus = t < T_MAC0 ? .5 : (t < T_OUT0 ? .62 : .5);
  o.dim = t > T_OUT0 ? lerp(1, .86, sm(seg(t, T_OUT0, T_ROOM + 2))) : 1; o.flash = 0;
  // panes
  if (t < T_MAC0 + .2) drawPanes(PW_, cW, t, pf, 1, 1.4, 1 - mixM);
  if (t >= T_MAC0 - .9 && t < T_OUT0 + .8) drawPanes(PM_, cM, t, .15, 1, 0.3, (mixM) * (1 - mixR));
  if (t >= T_OUT0 - .2 && t < T_END) drawPanes(PW_, cR, t, .45, 1, 1.4, mixR);
  // handwriting: macro view live; the wide room shows the finished list on the small notebook
  if (RM && t >= T_MAC0 - .9 && t < T_OUT0 + .8) { cx.save(); cx.globalAlpha = mixM * (1 - mixR); drawWriting(RM, cM, true, t >= T_MAC0 - .3 && t < T_OUT0 + .4, t); cx.restore(); }
  if (RW && t >= T_OUT0 - .2) { cx.save(); cx.globalAlpha = mixR; drawWriting(RW, cR, false, false, 99); cx.restore(); }
  drawCTA(t); o.spr = spr;
  window.GLP.draw(o);
  // overlays
  var hlA = 1 - sm(seg(t, 4.2, 5.2)); $('hl').style.opacity = hlA; $('hl').style.transform = 'translateY(' + (-30 * seg(t, 4.2, 5.2)) + 'px)';
  var st = t < 5.5 ? null : t < 7.4 ? '1/3 · PEN + PAPER' : t < 10.1 ? '2/3 · WRITE EVERYTHING' : t < 12.4 ? '3/3 · BE SPECIFIC' : null;
  var stE = $('step'); stE.textContent = st ? 'STEP ' + st : ''; stE.style.opacity = st ? sm(seg(t, 5.5, 5.8)) * (t > 12.1 ? 1 - seg(t, 12.1, 12.4) : 1) : 0;
  var n = 0; for (var i = 0; i < 14; i++) if (t < CLOSE[i] + .3) n++; var oe = $('open'); oe.textContent = n + ' OPEN'; oe.style.color = n ? TANG : MINT; oe.style.borderColor = n ? TANG : MINT; oe.style.opacity = t < T_END - .2 ? 1 : 1 - seg(t, T_END - .2, T_END + .2);
  var ce = $('catch'); ce.style.opacity = sm(seg(t, 12.9, 13.4)) * (1 - seg(t, T_END - .2, T_END)); ce.style.transform = 'translateY(' + (1 - sm(seg(t, 12.9, 13.4))) * 20 + 'px)';
  var c2 = ''; CAP.forEach(function (c) { if (t >= c[0] && t < c[1]) c2 = c[2]; }); var capE = $('cap'); capE.textContent = c2; capE.style.opacity = c2 ? 1 : 0;
  return Promise.all([vseek(vids.dust, t)]);
};
Promise.all([document.fonts.load('italic 40px Ser'), document.fonts.load('800 40px Man'), document.fonts.load('500 20px Mar'), window.GLP.load(['room_warm', 'room_dim', 'page_warm'])]).catch(function () {}).then(function () {
  return new Promise(function (r) { var v = vids.dust; if (v.readyState >= 2) r(); else v.addEventListener('loadeddata', function () { r(); }); }); }).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
window.__ready = false;
})();
