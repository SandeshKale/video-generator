// Hack Zone #01 mockup: ONE continuous camera through the nightstand world (no cuts): wide push-in through 14 floating "tab" panes ->
// dive onto the notebook page (rack focus) -> macro dolly following the pen as it writes the list and the panes close ->
// pull back out into the dimmed, quiet room -> the CTA panes form in the window. Everything is a pure function of t.
(function () {
'use strict';
var W = 1080, H = 1920, RW = window.RW, RM = window.RM, RP = window.RP, TM = window.TM || { dur: 34, words: [], caps: [] };
// ---- voice cues (timing.js is built from the final voice-over by timing_from_voice.py; defaults keep the page testable without it) ----
function cue(k, d) { return (TM.cue && TM.cue[k] != null) ? TM.cue[k] : d; }
var K_ONE = cue('one', 3.6), K_TWO = cue('two', 6.4), K_YOUEND = cue('youEnd', 9.6), K_THREE = cue('three', 10.6), K_TAXES = cue('taxes', 12.0), K_ACCT = cue('accountant', 13.4), K_Q3END = cue('q3End', 15.6),
    K_UNF = cue('unfinished', 16.3), K_QUIET = cue('quiet', 19.0), K_LAB = cue('lab', 20.6), K_FASTER = cue('faster', 24.0), K_CATCH = cue('catch', 27.2), K_FIFTY = cue('fifty', 28.2),
    K_SAVE = cue('save', 30.4), K_SEND = cue('send', 32.2), K_COMMENT = cue('comment', 34.6), K_FOLLOW = cue('follow', 37.0), VEND = TM.dur || 38.5;
var DUR = Math.round((VEND + 3.2) * 100) / 100;
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); } function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); } function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; } function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; } function back(x) { x = clamp(x, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var $ = function (id) { return document.getElementById(id); };
var spr = document.createElement('canvas'); spr.width = W; spr.height = H; var cx = spr.getContext('2d');
var MINT = '#8ef0c8', TANG = '#ff7a1a', PAPER = '#f4ecd8', INK = '#101a1a', AMB = '#f2c14e';

// ---------- timeline (every time below derives from the voice cues) ----------
var T_DIVE0 = K_ONE - .2, T_MAC0 = Math.min(K_TWO - .9, T_DIVE0 + 2.0), T_OUT0 = K_Q3END + .1, T_ROOM = T_OUT0 + .8,
    T_PROOF0 = K_LAB - 1.1, T_PROOF1 = K_LAB - .1, T_BACK0 = K_SAVE - 1.1, T_BACK1 = K_SAVE - .1;
var TASKS = ['email Priya re: invoice', 'renew passport', 'book dentist', 'pay rent', 'taxes'], TW0 = [], TWD;
(function () { var step = Math.max(.5, (K_YOUEND - K_TWO) / 5.2); for (var i = 0; i < 5; i++) TW0[i] = K_TWO + .1 + i * step; TWD = Math.min(.78, step - .06); })();
var PANES = ['email Priya', 'renew passport', 'book dentist', 'pay rent', 'taxes', 'reply to Dad', 'gym booking', 'slides for Mon', 'call plumber', 'birthday gift', 'back up photos', 'water bill', 'buy charger', 'RSVP Meera'];
var CLOSE = []; for (var i = 0; i < 14; i++) CLOSE[i] = i < 5 ? TW0[i] + TWD + .15 : (i < 13 ? K_ACCT + .1 + (i - 5) * .13 : K_QUIET + .1);
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
function camRoom(t) { var u = eio(seg(t, T_OUT0 + .2, T_OUT0 + 2.6)), o = seg(t, T_OUT0 + 2.6, T_PROOF0); return { cx: lerp(.60, .5, u) + Math.sin(u * Math.PI) * .05 + o * .05, cy: lerp(.84, .52, u) - o * .03, z: lerp(3.6, 1.05, u) + o * .1 }; }
function camProof(t) { var u = eio(seg(t, T_PROOF0, K_FIFTY + 1.4)); return { cx: lerp(.44, .56, u), cy: lerp(.60, .64, u), z: lerp(1.0, 1.12, u) }; }
function camEnd(t) { var u = eio(seg(t, T_BACK0, K_FOLLOW + 1)); return { cx: .5, cy: lerp(.55, .40, u), z: lerp(1.5, 1.1, u) }; }
function camMacro(t) { var s = eio(seg(t, T_DIVE0 + 1.3, T_MAC0 + 1.2)), tr = clamp(penX, .35, .65); return { cx: .5 + .04 * Math.sin(t * .5), cy: .50 + .015 * Math.sin(t * .8), z: lerp(1.55, 1.12, s) * (1 + .06 * seg(t, T_MAC0 + 3, T_OUT0)) }; }
function drift(t) { return [Math.sin(t * .9) * .25, Math.cos(t * .7) * .15]; }

// ---------- handwriting ----------
function lineGeom(A, c, li, k) { var L = A.lines[li], p0 = scr([L[0][0], L[0][1]], c, k), p1 = scr([L[1][0], L[1][1]], c, k), p2 = scr([A.lines[li + 1][0][0], A.lines[li + 1][0][1]], c, k); return { p0: p0, p1: p1, ang: Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), len: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), pitch: Math.hypot(p2[0] - p0[0], p2[1] - p0[1]) }; }
function writeProg(i, t) { return sm(seg(t, TW0[i], TW0[i] + TWD)); }
var STRIKE0 = K_TAXES + .02, REWR0 = K_ACCT - .05, REWR_D = Math.max(.9, K_Q3END - K_ACCT - .1), NEWTXT = '→ call accountant, 10 am';
function drawWriting(A, c, big, showPen, t) {
  if (!A) return; var LS = big ? .36 : .03; var ink = '#1c2650'; var tipOut = null;
  for (var i = 0; i < 5; i++) { var g = lineGeom(A, c, 14 - i * 2, 1), fs = Math.max(10, g.pitch * (big ? 1.2 : 1.0)), pr = writeProg(i, t); if (pr <= 0) continue;
    cx.save(); cx.translate(g.p0[0], g.p0[1]); cx.rotate(g.ang); cx.font = 'italic ' + fs + 'px Ser'; var txt = '• ' + TASKS[i], tw = cx.measureText(txt).width;
    cx.beginPath(); cx.rect(-4, -fs * 1.2, g.len * LS + tw * pr + 6, fs * 1.6); cx.clip(); cx.fillStyle = ink; cx.globalAlpha = .94; cx.fillText(txt, g.len * LS, -fs * .12); cx.restore();
    if (pr < 1 && pr > 0) tipOut = { x: g.p0[0] + Math.cos(g.ang) * (g.len * LS + tw * pr) , y: g.p0[1] + Math.sin(g.ang) * (g.len * LS + tw * pr), pitch: g.pitch, ang: g.ang };
    if (i === 4) { // taxes: strike then rewrite
      var sp = sm(seg(t, STRIKE0, STRIKE0 + .35)); if (sp > 0) { cx.save(); cx.translate(g.p0[0], g.p0[1]); cx.rotate(g.ang); var w2 = cx.measureText ? 0 : 0; cx.font = 'italic ' + fs + 'px Ser'; var tw2 = cx.measureText('• taxes').width; cx.strokeStyle = TANG; cx.lineWidth = Math.max(3, fs * .09); cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(g.len * LS - 6, -fs * .30); cx.bezierCurveTo(g.len * LS + tw2 * .3, -fs * .42, g.len * LS + tw2 * .6, -fs * .18, g.len * LS + tw2 * sp + 6, -fs * .32); cx.stroke(); cx.restore(); }
      var rp = sm(seg(t, REWR0, REWR0 + REWR_D)); if (rp > 0) { cx.save(); cx.translate(g.p0[0], g.p0[1]); cx.rotate(g.ang); cx.font = 'italic ' + fs + 'px Ser'; var tw3 = cx.measureText('• taxes').width, tw4 = cx.measureText(NEWTXT).width; cx.beginPath(); cx.rect(g.len * LS + tw3 + 14, -fs * 1.2, tw4 * rp + 6, fs * 1.6); cx.clip(); cx.fillStyle = ink; cx.fillText(NEWTXT, g.len * LS + tw3 + 22, -fs * .12); cx.restore();
        if (rp < 1) tipOut = { x: g.p0[0] + Math.cos(g.ang) * (g.len * LS + tw3 + 22 + tw4 * rp), y: g.p0[1] + Math.sin(g.ang) * (g.len * LS + tw3 + 22 + tw4 * rp), pitch: g.pitch, ang: g.ang }; } }
  }
  if (showPen) { var tp = tipOut; if (!tp) { var lg = lineGeom(A, c, 16, 1); tp = { x: lg.p0[0] + lg.len * .62, y: lg.p0[1] - lg.pitch * .2, pitch: lg.pitch, ang: lg.ang }; }
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
function drawPanes(set, c, t, focusN, scale, kPar, vis, skip13) {
  for (var i = 0; i < 14; i++) { if (skip13 && i === 13) continue; var P = set[i], tc = CLOSE[i], cu = seg(t, tc, tc + .55); if (t > tc + .6) continue;
    var ph = i * 1.7, flo = [Math.sin(t * .8 + ph) * 8, Math.cos(t * .6 + ph) * 10]; var pos = scr([P[0], P[1]], c, 1 + P[2] * kPar); var w = 250 * P[3] * scale, h = 150 * P[3] * scale;
    var blur = clamp(Math.abs(P[2] - focusN) * 34 * (scale > 1.2 ? .8 : 1), 0, 26), flick = .86 + .14 * Math.sin(t * 9 + ph * 3) * (cu > 0 ? 0 : 1);
    glassPane(pos[0] + flo[0], pos[1] + flo[1], w, h, PANES[i], true, blur, vis * flick, { u: cu }); }
}
// ---------- proof beat: two notebooks (TO-DO vs DONE), writing mapped onto each page quad ----------
function qpt(q, c, u, v) { var P = q.map(function (p) { return scr(p, c, 1); }), tl = P[3], tr = P[2], bl = P[0], br = P[1];
  var tx = lerp(tl[0], tr[0], u), ty = lerp(tl[1], tr[1], u), bx = lerp(bl[0], br[0], u), by = lerp(bl[1], br[1], u); return [lerp(tx, bx, v), lerp(ty, by, v)]; }
function quadText(q, c, rows, ink, alpha, strikeIdx) {
  var tl = qpt(q, c, 0, 0), tr = qpt(q, c, 1, 0), bl = qpt(q, c, 0, 1), ang = Math.atan2(tr[1] - tl[1], tr[0] - tl[0]), ph = Math.hypot(bl[0] - tl[0], bl[1] - tl[1]), pw = Math.hypot(tr[0] - tl[0], tr[1] - tl[1]);
  var fs = Math.max(12, Math.min(ph * .09, pw * .064));
  for (var i = 0; i < rows.length; i++) { var p = qpt(q, c, .07, .14 + i * .16); cx.save(); cx.translate(p[0], p[1]); cx.rotate(ang); cx.font = 'italic ' + fs + 'px Ser'; cx.fillStyle = ink; cx.globalAlpha = alpha; cx.fillText(rows[i], 0, 0);
    if (i === strikeIdx) { var w = cx.measureText(rows[i].split(' → ')[0]).width; cx.strokeStyle = TANG; cx.lineWidth = Math.max(2, fs * .08); cx.beginPath(); cx.moveTo(-4, -fs * .3); cx.lineTo(w + 6, -fs * .34); cx.stroke(); } cx.restore(); } }
function nbTag(p, c, text, col, dy, alpha, fg) { var q = scr(p, c, 1); cx.save(); cx.globalAlpha = alpha; cx.font = '500 26px Mar'; var w = cx.measureText(text).width + 52; cx.translate(q[0], q[1] + dy);
  glassBox(-w / 2, -30, w, 60, 'rgba(16,26,26,.78)', col, 30); cx.fillStyle = fg || col; cx.textAlign = 'center'; cx.fillText(text, 0, 9); cx.restore(); }
function drawProof(t, c, alpha) {
  if (!RP || alpha <= .01) return;
  quadText(RP.todoPage, c, ['• email Priya re: invoice', '• renew passport', '• book dentist', '• pay rent', '• taxes → call accountant, 10 am'], '#1c2650', alpha * .95, 4);
  quadText(RP.donePage, c, ['• emailed the team', '• went to gym', '• cooked dinner', '• replied to Dad', '• watched a show'], '#6a6a63', alpha * .8, -1);
  var a1 = sm(seg(t, K_LAB, K_LAB + .5)) * alpha;
  nbTag(RP.todo, c, 'TO-DO LIST', MINT, -250, a1); nbTag(RP.done, c, 'DONE LIST', '#b8b8b0', -230, a1, '#d8d8d0');
  var sp = back(seg(t, K_FASTER - .1, K_FASTER + .45)); if (sp > 0) { var q = scr(RP.done, c, 1); cx.save(); cx.globalAlpha = clamp(sp * 2, 0, 1) * alpha; cx.translate(q[0] + 10, q[1] + 205); cx.rotate(-.07); cx.scale(lerp(1.5, 1, sp), lerp(1.5, 1, sp));
    cx.font = '800 46px Man'; var w = cx.measureText('FELL ASLEEP FASTER').width + 50; cx.strokeStyle = MINT; cx.lineWidth = 6; cx.fillStyle = 'rgba(13,43,42,.82)'; cx.beginPath(); cx.rect(-w / 2, -40, w, 80); cx.fill(); cx.stroke(); cx.fillStyle = MINT; cx.textAlign = 'center'; cx.fillText('FELL ASLEEP FASTER', 0, 16); cx.restore(); }
}
// ---------- recap + full call to action ----------
var prof = new Image(); prof.src = 'media/profile.jpg';
function glassBox(x, y, w, h, fill, line, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); cx.fillStyle = fill; cx.fill(); cx.lineWidth = 3; cx.strokeStyle = line; cx.stroke(); }
var CHIPS = [['SAVE', MINT, 150, 150, function () { return K_SAVE; }], ['SEND', MINT, 316, 150, function () { return K_SEND; }], ['COMMENT', AMB, 482, 230, function () { return K_COMMENT; }], ['FOLLOW', TANG, 728, 190, function () { return K_FOLLOW; }]];
function drawRecap(t) {
  var tin = K_SAVE - .3, tout = K_COMMENT + .15, u = back(seg(t, tin, tin + .6)), o = 1 - sm(seg(t, tout, tout + .45)); if (u <= 0 || o <= .01) return;
  cx.save(); cx.globalAlpha = clamp(u * 2, 0, 1) * o; var sc = lerp(.86, 1, u); cx.translate(540, 700 + (1 - u) * 80); cx.scale(sc, sc);
  cx.shadowColor = 'rgba(0,0,0,.5)'; cx.shadowBlur = 40; cx.shadowOffsetY = 18; glassBox(-384, -320, 768, 560, PAPER, '#101a1a', 30); cx.shadowColor = 'transparent';
  cx.fillStyle = TANG; cx.font = '500 24px Mar'; cx.textAlign = 'left'; cx.fillText('TONIGHT · 5 MINUTES · PEN + PAPER', -340, -262);
  cx.strokeStyle = 'rgba(16,26,26,.25)'; cx.lineWidth = 2; cx.setLineDash([10, 8]); cx.beginPath(); cx.moveTo(-340, -232); cx.lineTo(340, -232); cx.stroke(); cx.setLineDash([]);
  var rows = [['1', 'PEN + PAPER', '5 min'], ['2', 'EVERYTHING YOU STILL NEED TO DO', ''], ['3', 'BE SPECIFIC: THE NEXT ACTION', 'not "taxes"']];
  for (var i = 0; i < 3; i++) { var r = back(seg(t, tin + .4 + i * .42, tin + .85 + i * .42)); if (r <= 0) continue; cx.save(); cx.globalAlpha = clamp(r * 2, 0, 1); var y = -150 + i * 150;
    cx.fillStyle = INK; cx.beginPath(); cx.arc(-320, y - 12, 34, 0, 6.3); cx.fill(); cx.fillStyle = MINT; cx.font = '800 40px Man'; cx.textAlign = 'center'; cx.fillText(rows[i][0], -320, y + 2);
    cx.fillStyle = INK; cx.textAlign = 'left'; cx.font = '800 ' + (i === 1 ? 31 : 34) + 'px Man'; cx.fillText(rows[i][1], -262, y - 2); if (rows[i][2]) { cx.fillStyle = '#6b5a3e'; cx.font = 'italic 36px Ser'; cx.fillText(rows[i][2], -262, y + 44); }
    cx.restore(); }
  cx.restore();
}
function drawCTA(t) {
  if (t < K_SAVE - .3) return; cx.save();
  for (var i = 0; i < 4; i++) { var C = CHIPS[i], t0 = C[4](), a = back(seg(t, t0 - .05, t0 + .4)); if (a <= 0) continue; var y = 1160, w = C[3]; cx.save(); cx.globalAlpha = clamp(a * 2, 0, 1); cx.translate(C[2] + w / 2, y + 38); cx.scale(lerp(.8, 1, a), lerp(.8, 1, a));
    var lit = (i === 3 && t > K_FOLLOW + 1.1); glassBox(-w / 2, -38, w, 76, lit ? C[1] : 'rgba(16,26,26,.8)', C[1], 28); cx.fillStyle = lit ? INK : C[1]; cx.font = '500 26px Mar'; cx.textAlign = 'center'; cx.font = '500 ' + (i === 3 && lit ? 21 : 26) + 'px Mar'; cx.fillText(i === 3 && lit ? 'FOLLOWING' : C[0], 0, 8); cx.restore(); }
  // SEND: a paper plane leaves the chip
  var pf = seg(t, K_SEND + .1, K_SEND + 1.0); if (pf > 0 && pf < 1) { var e = eio(pf), px = lerp(391, 860, e), py = 1198 - Math.sin(e * Math.PI) * 420 - e * 760; cx.save(); cx.globalAlpha = 1 - pf * pf; cx.translate(px, py); cx.rotate(-.5 - e * .6); cx.fillStyle = MINT; cx.beginPath(); cx.moveTo(34, 0); cx.lineTo(-24, -20); cx.lineTo(-10, 0); cx.lineTo(-24, 20); cx.closePath(); cx.fill(); cx.restore(); }
  // COMMENT: a field types the keyword
  var ca = back(seg(t, K_COMMENT - .05, K_COMMENT + .45)), co = 1 - sm(seg(t, K_FOLLOW + 1.4, K_FOLLOW + 1.9)); if (ca > 0 && co > .01) { cx.save(); cx.globalAlpha = clamp(ca * 2, 0, 1) * co; cx.translate(540, 1040); cx.scale(lerp(.9, 1, ca), lerp(.9, 1, ca));
    glassBox(-384, -46, 768, 92, 'rgba(16,26,26,.86)', AMB, 46); var n = Math.floor(clamp((t - K_COMMENT - .25) / .55, 0, 1) * 7), word = 'TONIGHT'.slice(0, n);
    cx.fillStyle = PAPER; cx.font = '500 34px Mar'; cx.textAlign = 'left'; cx.fillText(word + ((Math.floor(t * 2.4) % 2 === 0 || n < 7) ? '▍' : ' '), -336, 12); cx.fillStyle = AMB; cx.font = '500 22px Mar'; cx.textAlign = 'right'; cx.fillText('POST', 340, 9); cx.restore(); }
  // FOLLOW: creator card
  var fu = back(seg(t, K_COMMENT + .3, K_COMMENT + .9)), bu = back(seg(t, K_FOLLOW - .05, K_FOLLOW + .5)); if (fu > 0) { cx.save(); cx.globalAlpha = clamp(fu * 2, 0, 1); cx.translate(540, 560); cx.scale(lerp(.8, 1, fu), lerp(.8, 1, fu));
    var pr = (t * .8) % 1; for (var k = 0; k < 2; k++) { var pp = (pr + k * .5) % 1; cx.strokeStyle = 'rgba(142,240,200,' + (.55 * (1 - pp)) + ')'; cx.lineWidth = 5; cx.beginPath(); cx.arc(0, 0, 146 + pp * 90, 0, 6.3); cx.stroke(); }
    cx.beginPath(); cx.arc(0, 0, 146, 0, 6.3); cx.fillStyle = 'rgba(142,240,200,.18)'; cx.fill(); cx.lineWidth = 9; cx.strokeStyle = MINT; cx.stroke(); cx.save(); cx.beginPath(); cx.arc(0, 0, 130, 0, 6.3); cx.clip(); if (prof.complete) cx.drawImage(prof, -130, -130, 260, 260); cx.restore();
    cx.fillStyle = PAPER; cx.font = '800 62px Man'; cx.textAlign = 'center'; cx.shadowColor = 'rgba(0,0,0,.6)'; cx.shadowBlur = 20; cx.fillText('@sandesh_explains', 0, 250); cx.shadowColor = 'transparent';
    if (bu > 0) { var pressed = t > K_FOLLOW + 1.0, bw = 360; cx.save(); cx.globalAlpha = clamp(bu * 2, 0, 1); cx.translate(0, 338); cx.scale(lerp(.8, 1, bu) * (pressed && t < K_FOLLOW + 1.15 ? .94 : 1), lerp(.8, 1, bu) * (pressed && t < K_FOLLOW + 1.15 ? .94 : 1)); glassBox(-bw / 2, -48, bw, 96, pressed ? MINT : TANG, pressed ? MINT : TANG, 48); cx.fillStyle = INK; cx.font = '800 40px Man'; cx.fillText(pressed ? 'FOLLOWING ✓' : 'FOLLOW', 0, 16); cx.restore(); } cx.restore(); }
  cx.restore();
}

// ambient light band: a soft mint sweep crossing the frame every ~2.5 s (keeps held hero visuals alive without touching them)
function drawBand(t) { if (t < 2.5) return; var per = 2.5, u = ((t / per) % 1), x = -260 + u * 1600, g = cx.createLinearGradient(x - 170, 0, x + 170, 0); g.addColorStop(0, 'rgba(142,240,200,0)'); g.addColorStop(.5, 'rgba(142,240,200,.10)'); g.addColorStop(1, 'rgba(142,240,200,0)');
  cx.save(); cx.fillStyle = g; cx.fillRect(x - 170, 380, 340, 900); cx.restore(); }
// ---------- per-frame ----------
var vids = { dust: $('dust') }; function vseek(v, t) { return new Promise(function (res) { if (!v.duration) return res(); var tt = t % v.duration; function done() { v.removeEventListener('seeked', done); res(); } v.addEventListener('seeked', done); v.currentTime = tt; setTimeout(res, 400); }); }
window.__reelDurationSec = DUR;
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 1e-3); cx.clearRect(0, 0, W, H); var dr = drift(t), o = { t: t, par: .015, dof: 0, focus: .5, bloom: .35, streak: .05, vig: .5, dim: 1 };
  var mixM = sm(seg(t, T_MAC0 - .8, T_MAC0 - .05)), mixR = sm(seg(t, T_OUT0 - .1, T_ROOM)), mixP = sm(seg(t, T_PROOF0, T_PROOF1)), mixB = sm(seg(t, T_BACK0, T_BACK1));
  var cW = camWide(t), cM = camMacro(t), cR = camRoom(t), cP = camProof(t), cE = camEnd(t);
  function A(id, c, f) { o.a = id; o.camA = [dr[0] * f, dr[1] * f, c.z]; o.shA = shf(c, c.z); } function B(id, c, m, f) { o.b = id; o.camB = [dr[0] * f, dr[1] * f, c.z]; o.shB = shf(c, c.z); o.mix = m; }
  if (t < T_MAC0 - .05) { A('room_warm', cW, 1); if (mixM > 0) B('page_warm', cM, mixM, .5); }
  else if (t < T_OUT0 - .1) A('page_warm', cM, .5);
  else if (t < T_ROOM) { A('page_warm', cM, .5); B('room_dim', cR, mixR, 1); }
  else if (t < T_PROOF0) A('room_dim', cR, 1);
  else if (t < T_PROOF1) { A('room_dim', cR, 1); B('proof_dim', cP, mixP, .8); }
  else if (t < T_BACK0) A('proof_dim', cP, .8);
  else if (t < T_BACK1) { A('proof_dim', cP, .8); B('room_dim', cE, mixB, 1); }
  else A('room_dim', cE, 1);
  o.dim = t > T_OUT0 ? lerp(1, .86, sm(seg(t, T_OUT0, T_ROOM + 2))) : 1; o.flash = 0;
  // panes
  var pf = t < 1.4 ? .85 : t < T_DIVE0 ? lerp(.85, .5, sm(seg(t, 1.4, 2.6))) : lerp(.5, .1, sm(seg(t, T_DIVE0, T_DIVE0 + 1.2)));
  if (t < T_MAC0 + .2) drawPanes(PW_, cW, t, pf, 1, 1.4, 1 - mixM);
  if (t >= T_MAC0 - .9 && t < T_OUT0 + .8) drawPanes(PM_, cM, t, .15, 1, 0.3, mixM * (1 - mixR));
  if (t >= T_OUT0 - .2 && t < T_PROOF1) drawPanes(PW_, cR, t, .45, 1, 1.4, mixR * (1 - mixP), true);
  if (t >= T_OUT0 + 1.2 && t < CLOSE[13] + .7) { var la = sm(seg(t, T_OUT0 + 1.2, T_OUT0 + 1.9)) * (1 - mixP); glassPane(690, 640 + Math.sin(t * 1.3) * 10, 400, 240, 'RSVP Meera', true, 0, la * (.88 + .12 * Math.sin(t * 7)), { u: seg(t, CLOSE[13], CLOSE[13] + .55) }); }
  // handwriting: macro page live; the small notebook in the dim room shows the finished list; the proof beat shows both notebooks
  if (RM && t >= T_MAC0 - .9 && t < T_OUT0 + .8) { cx.save(); cx.globalAlpha = mixM * (1 - mixR); drawWriting(RM, cM, true, t >= T_MAC0 - .3 && t < T_OUT0 + .4, t); cx.restore(); }
  if (RW && t >= T_OUT0 - .2 && t < T_PROOF1) { cx.save(); cx.globalAlpha = mixR * (1 - mixP); drawWriting(RW, cR, false, false, 99); cx.restore(); }
  drawProof(t, cP, mixP * (1 - mixB)); drawRecap(t); drawCTA(t); drawBand(t); o.spr = spr;
  window.GLP.draw(o);
  // overlays
  var hlA = 1 - sm(seg(t, T_DIVE0, T_DIVE0 + 1.0)); $('hl').style.opacity = hlA; $('hl').style.transform = 'translateY(' + (-30 * seg(t, T_DIVE0, T_DIVE0 + 1.0)) + 'px)';
  var st = t < K_ONE ? null : t < K_TWO ? '1/3 · PEN + PAPER' : t < K_THREE ? '2/3 · WRITE EVERYTHING' : t < K_UNF ? '3/3 · BE SPECIFIC' : null;
  var stE = $('step'); stE.textContent = st ? 'STEP ' + st : ''; stE.style.opacity = st ? sm(seg(t, st.charAt(0) === '1' ? K_ONE : st.charAt(0) === '2' ? K_TWO : K_THREE, (st.charAt(0) === '1' ? K_ONE : st.charAt(0) === '2' ? K_TWO : K_THREE) + .3)) : 0;
  var n = 0; for (var i = 0; i < 14; i++) if (t < CLOSE[i] + .3) n++; var oe = $('open'); oe.textContent = n + ' OPEN'; oe.style.color = n ? TANG : MINT; oe.style.borderColor = n ? TANG : MINT; oe.style.opacity = t < T_PROOF0 ? 1 : 1 - seg(t, T_PROOF0, T_PROOF0 + .4);
  var il = $('ill'); il.style.opacity = sm(seg(t, K_THREE, K_THREE + .4)) * (1 - sm(seg(t, K_Q3END, K_Q3END + .4)));
  var ce = $('catch'); ce.style.opacity = sm(seg(t, K_CATCH, K_CATCH + .5)) * (1 - sm(seg(t, T_BACK0, T_BACK0 + .4))); ce.style.transform = 'translateY(' + (1 - sm(seg(t, K_CATCH, K_CATCH + .5))) * 20 + 'px)';
  var c2 = ''; (TM.caps || []).forEach(function (c) { if (t >= c[0] && t < c[1]) c2 = c[2]; }); var capE = $('cap'); capE.textContent = c2; capE.style.opacity = c2 ? 1 : 0;
  return Promise.all([vseek(vids.dust, t)]);
};
// event list for the audio build (pane closes, pen strokes, strike, stamp, chips, typing)
window.EV = (function () { var e = []; for (var i = 0; i < 14; i++) e.push({ t: CLOSE[i], k: 'close', i: i }); for (var j = 0; j < 5; j++) e.push({ t: TW0[j], k: 'pen', d: TWD });
  e.push({ t: STRIKE0, k: 'strike' }, { t: REWR0, k: 'pen', d: REWR_D }, { t: K_FASTER, k: 'stamp' }, { t: K_SAVE - .3, k: 'recap' }, { t: K_SAVE, k: 'chip', n: 0 }, { t: K_SEND, k: 'chip', n: 1 }, { t: K_SEND + .1, k: 'swoosh' }, { t: K_COMMENT, k: 'chip', n: 2 }, { t: K_COMMENT + .25, k: 'type', d: .55 }, { t: K_FOLLOW, k: 'chip', n: 3 }, { t: K_FOLLOW + 1.0, k: 'press' }, { t: T_DIVE0, k: 'dive' }, { t: T_MAC0, k: 'macro' }, { t: T_OUT0, k: 'out' }, { t: T_PROOF0, k: 'proof' }, { t: K_QUIET + .1, k: 'quiet' }); return e; })();
Promise.all([document.fonts.load('italic 40px Ser'), document.fonts.load('800 40px Man'), document.fonts.load('500 20px Mar'), window.GLP.load(['room_warm', 'room_dim', 'page_warm', 'proof_dim'])]).catch(function () {}).then(function () {
  return new Promise(function (r) { var v = vids.dust; if (v.readyState >= 2) r(); else v.addEventListener('loadeddata', function () { r(); }); }); }).then(function () { return new Promise(function (r) { if (prof.complete) r(); else prof.onload = r; }); }).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
window.__ready = false;
})();
