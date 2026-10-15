// Hack Zone #01 v2 — a coherent top-down desk. One camera looking straight down, one lamp (upper left) so every shadow falls lower-right and grows with height.
// Everything moves the way objects move: sticky cards DROP under gravity and bounce once, the notebook SLIDES in and decelerates with friction, the pen is
// lifted and carried, written-down cards are lifted and FLICKED off the desk, the desk clears by sliding objects out, the camera rises (zoom out) for the comparison.
// All of it is a pure function of t; every time derives from the voice cues (timing.js).
(function () {
'use strict';
var W = 1080, H = 1920, TM = window.TM || { dur: 44, words: [], caps: [], cue: {} };
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); } function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); } function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; } function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function eout(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); } function ein(x) { x = clamp(x, 0, 1); return x * x * x; } function back(x) { x = clamp(x, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var $ = function (id) { return document.getElementById(id); }; var cv = $('c'), g = cv.getContext('2d');
var MINT = '#8ef0c8', TANG = '#ff7a1a', PAPER = '#f4ecd8', INK = '#101a1a', AMB = '#f2c14e', SPRUCE = '#0d2b2a';
function C(k, d) { return TM.cue && TM.cue[k] != null ? TM.cue[k] : d; }
var K = { grab: C('grab', 9.4), write: C('write', 11.4), hangEnd: C('hangEnd', 15.0), dont: C('dont', 15.9), taxes: C('taxes', 16.7), next: C('next', 17.7), acct: C('accountant', 18.9), ten: C('ten', 19.8), c2End: C('c2End', 20.4),
  unf: C('unfinished', 20.9), quiet: C('quiet', 24.0), lab: C('lab', 25.6), faster: C('faster', 29.0), only: C('only', 31.4), fifty: C('fifty', 32.1), exp: C('experiment', 33.6), save: C('save', 36.4), send: C('send', 38.0), comment: C('comment', 41.0), follow: C('follow', 43.6) };
var VEND = TM.dur || 45, DUR = Math.round((VEND + 3.4) * 100) / 100;

// ---------- fixed layout (world px = screen px at camera scale 1) ----------
var NB = { w: 700, h: 900, cx: 540, cy: 1290 }, LINE0 = 100, PITCH = 42, X0 = 65;           // notebook local frame: origin top-left; line i baseline y = LINE0 + i*PITCH
var TASKS = ['email Priya', 'renew passport', 'book dentist', 'pay rent', 'gift for Maya', 'call plumber', 'back up photos', 'taxes'], NCARD = 8;
var CARD = 180, COLS = [255, 445, 635, 825], ROWS = [560, 770], CCOL = ['#f2c14e', '#ff9a3c', '#ffb84d', '#ff8a5b'];
var HOME = TASKS.map(function (_, i) { var r = Math.floor(i / 4), c = i % 4; return { x: COLS[c] + (hash(i + 3) - .5) * 26, y: ROWS[r] + (hash(i + 9) - .5) * 26, rot: (hash(i + 21) - .5) * .26, col: CCOL[i % 4] }; });
var GRAV = 6200, DROP_H = 900;

// ---------- timeline derived from the voice ----------
var T_DROP0 = .12, DROP_STEP = .3, T_NB = K.grab - .35, T_PEN = K.grab + .35;
var STEP_W = Math.max(.42, (K.hangEnd - K.write) / 8.3), TW = [], TWD = Math.min(.44, STEP_W * .86);
for (var i = 0; i < NCARD; i++) TW[i] = K.write + i * STEP_W;
var T_QUIET = K.quiet - .3, T_P0 = K.lab - 1.3, T_P1 = T_P0 + 1.2, T_CL0 = K.save - 1.5, T_CL1 = T_CL0 + 1.0;

// ---------- procedural textures (built once) ----------
function mk(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
var DESK = (function () { var c = mk(2400, 4000), x = c.getContext('2d'); x.fillStyle = '#33241a'; x.fillRect(0, 0, 2400, 4000);
  for (var k = 0; k < 6500; k++) { var y = hash(k) * 4000, xx = hash(k + 1000) * 2400, l = 140 + hash(k + 2000) * 900, a = .03 + hash(k + 3000) * .07, dark = hash(k + 4000) > .45; x.strokeStyle = dark ? 'rgba(10,5,2,' + a + ')' : 'rgba(150,100,60,' + a * .7 + ')'; x.lineWidth = .6 + hash(k + 5000) * 2.4; x.beginPath(); x.moveTo(xx, y); x.bezierCurveTo(xx + l * .3, y + (hash(k + 6) - .5) * 5, xx + l * .6, y + (hash(k + 7) - .5) * 5, xx + l, y + (hash(k + 8) - .5) * 4); x.stroke(); }
  for (var p = 0; p < 10; p++) { var py = 200 + p * 400 + hash(p) * 60, gr = x.createLinearGradient(0, py - 30, 0, py + 30); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, 'rgba(0,0,0,.16)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, py - 30, 2400, 60); }
  return c; })();
var PAPERTX = (function () { var c = mk(300, 300), x = c.getContext('2d'); x.fillStyle = '#f5edda'; x.fillRect(0, 0, 300, 300); for (var k = 0; k < 2400; k++) { x.fillStyle = 'rgba(120,100,70,' + (hash(k) * .05) + ')'; x.fillRect(hash(k + 77) * 300, hash(k + 99) * 300, 1 + hash(k + 5) * 2, 1); } return c; })();

// ---------- drawing helpers ----------
var CAM = { s: 1, x: 540, y: 960 };
function sh(h) { return { ox: (.5 * h + 3) * CAM.s, oy: (.85 * h + 5) * CAM.s, bl: (4 + h * .55) * CAM.s, a: clamp(.55 - h * .0016, .22, .55) }; }
function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function withShadow(h, fn) { var s = sh(h); g.save(); g.shadowColor = 'rgba(8,4,0,' + s.a + ')'; g.shadowOffsetX = s.ox; g.shadowOffsetY = s.oy; g.shadowBlur = s.bl; fn(); g.restore(); }
function wrapText(txt, maxw) { var w = txt.split(' '), lines = [], cur = ''; for (var i = 0; i < w.length; i++) { var t2 = cur ? cur + ' ' + w[i] : w[i]; if (g.measureText(t2).width > maxw && cur) { lines.push(cur); cur = w[i]; } else cur = t2; } lines.push(cur); return lines; }

// ---------- sticky cards: drop (gravity + one bounce), lift, flick off ----------
function dropH(tau) { var Tf = Math.sqrt(2 * DROP_H / GRAV); if (tau < 0) return DROP_H; if (tau < Tf) return DROP_H - .5 * GRAV * tau * tau;
  var v1 = GRAV * Tf * .3, t2 = tau - Tf, T2 = 2 * v1 / GRAV; if (t2 < T2) return v1 * t2 - .5 * GRAV * t2 * t2; var v2 = v1 * .3, t3 = t2 - T2, T3 = 2 * v2 / GRAV; return t3 < T3 ? v2 * t3 - .5 * GRAV * t3 * t3 : 0; }
function cardState(i, t) {
  var H0 = HOME[i], t0 = T_DROP0 + i * DROP_STEP, tau = t - t0, h = dropH(tau), s = {}; s.x = H0.x; s.y = H0.y; s.rot = H0.rot; s.alpha = clamp(tau / .05, 0, 1); s.h = h; s.sc = 1 + h / 1500; s.rot += Math.sin(tau * 9) * .03 * clamp(h / 300, 0, 1);
  var tl = TW[i] - .06, u = t - tl; if (u > 0) { var lift = sm(u / .16) * 62; s.h = lift; s.sc = 1 + lift / 700; var f = (u - .2) / .5; if (f > 0) { var d = ein(f) * 1500; s.x += d * .52; s.y -= d * .85; s.rot += f * f * .9; s.h = lift + f * 30; if (f > 1) s.gone = true; } }
  s.landed = tau > Math.sqrt(2 * DROP_H / GRAV); return s;
}
function drawCard(i, t) {
  var s = cardState(i, t); if (s.gone || s.alpha <= 0) return; var P = worldPt(s.x, s.y); g.save(); g.translate(P[0], P[1]); g.rotate(s.rot); g.scale(CAM.s * s.sc, CAM.s * s.sc); g.globalAlpha = s.alpha;
  var hh = s.h, sc = CAM.s * s.sc; var so = sh(hh); g.shadowColor = 'rgba(8,4,0,' + so.a + ')'; g.shadowOffsetX = so.ox; g.shadowOffsetY = so.oy; g.shadowBlur = so.bl;
  var col = HOME[i].col, gr = g.createLinearGradient(-CARD / 2, -CARD / 2, CARD / 2, CARD / 2); gr.addColorStop(0, '#fff3cf'); gr.addColorStop(.06, col); gr.addColorStop(1, shade(col, -.14));
  rr(-CARD / 2, -CARD / 2, CARD, CARD, 7); g.fillStyle = gr; g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = 'rgba(0,0,0,.07)'; g.fillRect(-CARD / 2, -CARD / 2, CARD, 16);                                        // adhesive strip
  g.fillStyle = '#2a1a08'; g.font = 'italic 36px Ser'; g.textAlign = 'center'; var ls = wrapText(TASKS[i], CARD - 34), y0 = ls.length > 1 ? -4 : 12; for (var k = 0; k < ls.length; k++) g.fillText(ls[k], 0, y0 + k * 38);
  g.restore();
}
function shade(hex, a) { var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255, f = a < 0 ? 1 + a : 1; return 'rgb(' + Math.round(r * f) + ',' + Math.round(gg * f) + ',' + Math.round(b * f) + ')'; }

// ---------- notebooks ----------
function nbCenterA(t) { var p = eio(seg(t, T_P0, T_P1)), c = eio(seg(t, T_CL0, T_CL1)); var base = { x: 540, y: 1290 }; if (t < T_NB + 1.0) { var u = eout(seg(t, T_NB, T_NB + 1.0)); base.y = lerp(2500, 1290, u); }
  var x = lerp(base.x, 147, p), y = lerp(base.y, 893, p); x = lerp(x, -700, c); return { x: x, y: y, rot: lerp(-.015, 0, p) }; }
function nbCenterB(t) { var p = eio(seg(t, T_P0 + .15, T_P1 + .35)), c = eio(seg(t, T_CL0, T_CL1)); var x = lerp(1900, 933, p); x = lerp(x, 1900, c); return { x: x, y: 893, rot: .02 }; }
function worldPt(x, y) { return [(x - CAM.x) * CAM.s + 540, (y - CAM.y) * CAM.s + 960]; }
function drawNotebookBody(c, label, isA, t) {
  var P = worldPt(c.x, c.y), lift = 0; g.save(); g.translate(P[0], P[1]); g.rotate(c.rot); g.scale(CAM.s, CAM.s);
  var so = sh(5); g.shadowColor = 'rgba(8,4,0,' + so.a + ')'; g.shadowOffsetX = so.ox / CAM.s * CAM.s; g.shadowOffsetY = so.oy; g.shadowBlur = so.bl + 8;
  rr(-NB.w / 2 - 20, -NB.h / 2 - 16, NB.w + 40, NB.h + 32, 22); g.fillStyle = isA ? '#143a37' : '#3a3a36'; g.fill(); g.shadowColor = 'transparent';           // cover
  rr(-NB.w / 2, -NB.h / 2, NB.w, NB.h, 10); g.fillStyle = g.createPattern(PAPERTX, 'repeat'); g.fill();                                                  // page
  g.strokeStyle = 'rgba(70,110,150,.28)'; g.lineWidth = 2; for (var k = 0; k < 20; k++) { var y = -NB.h / 2 + LINE0 + 6 + k * PITCH; if (y > NB.h / 2 - 20) break; g.beginPath(); g.moveTo(-NB.w / 2 + 28, y); g.lineTo(NB.w / 2 - 28, y); g.stroke(); }
  g.strokeStyle = 'rgba(220,80,60,.45)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-NB.w / 2 + 48, -NB.h / 2 + 10); g.lineTo(-NB.w / 2 + 48, NB.h / 2 - 10); g.stroke();
  var gl = g.createLinearGradient(-NB.w / 2, 0, -NB.w / 2 + 60, 0); gl.addColorStop(0, 'rgba(0,0,0,.28)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(-NB.w / 2, -NB.h / 2, 60, NB.h);   // binding shade
  g.restore();
}
// handwriting in notebook-local coordinates (origin = notebook centre); text revealed left to right, per-glyph jitter
function inkLine(c, text, lx, ly, p, ink, alpha, fs) {
  if (p <= 0) return; var P = worldPt(c.x, c.y); g.save(); g.translate(P[0], P[1]); g.rotate(c.rot); g.scale(CAM.s, CAM.s); g.font = 'italic ' + fs + 'px Ser'; g.fillStyle = ink; g.globalAlpha = alpha; var w = g.measureText(text).width, x = lx, edge = lx + w * p;
  g.beginPath(); g.rect(lx - 8, ly - fs, w * p + 10, fs * 1.4); g.clip(); for (var k = 0; k < text.length; k++) { var ch = text.charAt(k), cw = g.measureText(ch).width; g.save(); g.translate(x + cw / 2, ly + (hash(k * 7 + text.length) - .5) * 2.4); g.rotate((hash(k * 3 + ly) - .5) * .05); g.fillText(ch, -cw / 2, 0); g.restore(); x += cw; } g.restore();
}
function textW(text, fs) { g.save(); g.font = 'italic ' + fs + 'px Ser'; var w = g.measureText(text).width; g.restore(); return w; }
var FS = 40, LX = -NB.w / 2 + X0, LY0 = -NB.h / 2 + LINE0;
function lineLocal(i) { return { x: LX, y: LY0 + i * PITCH }; }

// ---------- pen: world path while writing, then it rests on notebook A ----------
var PEN_L = 340, PEN_W = 24;
function penTipLocal(i, p) { var L = lineLocal(i); return { x: L.x + textW('– ' + (i === 8 ? 'call accountant, 10 am' : TASKS[i]), FS) * p, y: L.y - 6 }; }
function penState(t) {
  var A = nbCenterA(t), rest0 = { x: 760, y: 1250, ang: -.32, h: 0 }; function W_(l) { var c = Math.cos(A.rot), s = Math.sin(A.rot); return { x: A.x + l.x * c - l.y * s, y: A.y + l.x * s + l.y * c }; }
  var wAng = -1.12, out = { x: rest0.x, y: rest0.y, ang: rest0.ang, h: 0 };
  var t1 = T_PEN, t2 = T_PEN + .9, L0 = W_(penTipLocal(0, 0));
  if (t < t1) return out;
  if (t < t2) { var u = eio(seg(t, t1, t2)); out.x = lerp(rest0.x, L0.x, u); out.y = lerp(rest0.y, L0.y, u); out.ang = lerp(rest0.ang, wAng, u); out.h = Math.sin(u * Math.PI) * 46; return out; }
  // writing lines 0..7, carriage returns between them, strike, rewrite
  var seq = []; for (var i = 0; i < 8; i++) seq.push({ i: i, a: TW[i], b: TW[i] + TWD, p: 'w' });
  seq.push({ i: 7, a: K.taxes, b: K.taxes + .34, p: 's' }); seq.push({ i: 8, a: K.next, b: K.next + Math.max(.9, K.ten - K.next + .2), p: 'w' });
  var prevEnd = L0, prevT = t2, res = null;
  for (var k = 0; k < seq.length; k++) { var S = seq[k], st = penTipLocal(S.i, S.p === 's' ? 0 : 0), en = penTipLocal(S.i, 1);
    if (t < S.a) { var A1 = prevEnd, B1 = W_(st), u2 = eio(seg(t, prevT, S.a)); res = { x: lerp(A1.x, B1.x, u2), y: lerp(A1.y, B1.y, u2), h: Math.sin(u2 * Math.PI) * 16, hover: true }; break; }
    if (t <= S.b) { var pr = sm(seg(t, S.a, S.b)), tl = penTipLocal(S.i, pr), w = W_(tl); res = { x: w.x, y: w.y + Math.sin(t * 31) * 1.1, h: 0 }; break; }
    prevEnd = W_(en); prevT = S.b; }
  if (!res) { var tr = prevT + 1.0; if (t < tr) { var u3 = eio(seg(t, prevT, tr)); var rl = { x: NB.w / 2 - 110, y: LY0 + 5.5 * PITCH }; var Wr = W_(rl); res = { x: lerp(prevEnd.x, Wr.x, u3), y: lerp(prevEnd.y, Wr.y, u3), h: Math.sin(u3 * Math.PI) * 26 }; out.ang = lerp(wAng, -.5, u3); out.x = res.x; out.y = res.y; out.h = res.h; return out; }
    var rl2 = W_({ x: NB.w / 2 - 110, y: LY0 + 5.5 * PITCH }); out.x = rl2.x; out.y = rl2.y; out.ang = -.5 + A.rot * 0; out.h = 0; return out; }
  out.x = res.x; out.y = res.y; out.h = res.h; out.ang = wAng; return out;
}
function drawPen(t) {
  var s = penState(t), P = worldPt(s.x, s.y), sc = CAM.s * (1 + s.h / 900); g.save(); g.translate(P[0], P[1]); g.rotate(s.ang); g.scale(sc, sc); var so = sh(s.h + 4);
  g.shadowColor = 'rgba(8,4,0,' + clamp(so.a + .1, 0, .6) + ')'; g.shadowOffsetX = so.ox * .8; g.shadowOffsetY = so.oy * .8; g.shadowBlur = so.bl * .7;
  // body (tip at origin, extends along +x): brass cone, black barrel with cylinder shading, clip, cap
  g.beginPath(); g.moveTo(0, 0); g.lineTo(46, -PEN_W * .34); g.lineTo(46, PEN_W * .34); g.closePath(); g.fillStyle = '#c79a4a'; g.fill(); g.shadowColor = 'transparent';
  var gr = g.createLinearGradient(0, -PEN_W / 2, 0, PEN_W / 2); gr.addColorStop(0, '#4b5258'); gr.addColorStop(.35, '#1b1f22'); gr.addColorStop(.7, '#0b0d0e'); gr.addColorStop(1, '#2a3034'); g.fillStyle = gr; rr(46, -PEN_W / 2, PEN_L - 46, PEN_W, 8); g.fill();
  g.fillStyle = '#d8d0b8'; g.fillRect(46, -PEN_W / 2 + 1, 28, PEN_W - 2); g.fillStyle = '#b8b0a0'; g.fillRect(PEN_L - 150, -PEN_W / 2 - 3, 112, 5); g.restore();
}
function drawWriting(t) {
  var A = nbCenterA(t); if (t < T_NB) return;
  for (var i = 0; i < 8; i++) { var p = sm(seg(t, TW[i], TW[i] + TWD)); if (p <= 0) continue; var L = lineLocal(i), tx = '– ' + TASKS[i];
    if (i === 7) { var hl = sm(seg(t, K.dont, K.taxes - .1)) * (1 - sm(seg(t, K.taxes + .3, K.taxes + .6))); if (hl > 0) { var P = worldPt(A.x, A.y); g.save(); g.translate(P[0], P[1]); g.rotate(A.rot); g.scale(CAM.s, CAM.s); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(255,214,90,' + (.7 * hl) + ')'; g.fillRect(L.x - 8, L.y - 34, (textW(tx, FS) + 20) * hl, 44); g.restore(); } }
    inkLine(A, tx, L.x, L.y, p, '#1d2a5a', .96, FS);
    if (i === 7) { var sp = sm(seg(t, K.taxes, K.taxes + .34)); if (sp > 0) { var P2 = worldPt(A.x, A.y), w = textW(tx, FS); g.save(); g.translate(P2[0], P2[1]); g.rotate(A.rot); g.scale(CAM.s, CAM.s); g.strokeStyle = TANG; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(L.x - 6, L.y - 14); g.bezierCurveTo(L.x + w * .3, L.y - 20, L.x + w * .6, L.y - 8, L.x + w * sp + 6, L.y - 15); g.stroke(); g.restore(); } } }
  var L8 = lineLocal(8), p8 = sm(seg(t, K.next, K.next + Math.max(.9, K.ten - K.next + .2)));
  if (t >= K.next - .2) { var cb = back(seg(t, K.next - .2, K.next + .15)), P3 = worldPt(A.x, A.y); g.save(); g.translate(P3[0], P3[1]); g.rotate(A.rot); g.scale(CAM.s, CAM.s); g.strokeStyle = '#1d2a5a'; g.lineWidth = 3; g.globalAlpha = clamp(cb, 0, 1); g.strokeRect(L8.x - 52, L8.y - 28, 30, 30);
    var tk = back(seg(t, K.ten + .1, K.ten + .5)); if (tk > 0) { g.strokeStyle = '#19a06b'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); var q = clamp(tk, 0, 1); g.moveTo(L8.x - 47, L8.y - 12); g.lineTo(L8.x - 40, L8.y - 3); if (q > .45) g.lineTo(L8.x - 40 + 22 * Math.min(1, (q - .45) / .55), L8.y - 3 - 26 * Math.min(1, (q - .45) / .55)); g.stroke(); } g.restore(); }
  inkLine(A, '– call accountant, 10 am', L8.x, L8.y, p8, '#1d2a5a', .96, FS);
}
function drawNotebookB(t) { var B = nbCenterB(t); if (B.x > 1850) return; drawNotebookBody(B, 'DONE', false, t); var P = worldPt(B.x, B.y); var rows = ['– emailed the team', '– went to the gym', '– cooked dinner', '– replied to Dad', '– watched a show']; for (var i = 0; i < rows.length; i++) inkLine(B, rows[i], LX, LY0 + i * PITCH, 1, '#6a6a63', .85, FS); }

// ---------- light: one lamp, upper left; the pool shrinks when the mind goes quiet ----------
function drawLight(t) {
  var q = sm(seg(t, T_QUIET, T_QUIET + 1.6)), R = lerp(1900, 1100, q), a = lerp(.62, .84, q);
  g.save(); g.globalCompositeOperation = 'multiply'; var gr = g.createRadialGradient(300, 560, 40, 300, 560, R); gr.addColorStop(0, 'rgb(255,236,205)'); gr.addColorStop(.35, 'rgb(205,185,160)'); gr.addColorStop(1, 'rgb(' + Math.round(255 * (1 - a) * .55) + ',' + Math.round(255 * (1 - a) * .62) + ',' + Math.round(255 * (1 - a) * .62) + ')'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'screen'; var wm = g.createRadialGradient(240, 460, 20, 240, 460, 900); wm.addColorStop(0, 'rgba(255,170,80,.20)'); wm.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = wm; g.fillRect(0, 0, W, H); g.restore();
}
function drawDesk() { var s = CAM.s, P = worldPt(-600, -1000); g.drawImage(DESK, P[0], P[1], 2400 * s, 4000 * s); }

// ---------- proof (screen space): tags, bars racing to sleep, stamp, 57 dots ----------
function glassBox(x, y, w, h, fill, line, r) { rr(x, y, w, h, r); g.fillStyle = fill; g.fill(); g.lineWidth = 3; g.strokeStyle = line; g.stroke(); }
function screenTag(x, y, text, col, alpha) { g.save(); g.globalAlpha = alpha; g.font = '500 26px Mar'; var w = g.measureText(text).width + 52; glassBox(x - w / 2, y - 30, w, 60, 'rgba(16,26,26,.82)', col, 30); g.fillStyle = col; g.textAlign = 'center'; g.fillText(text, x, y + 9); g.restore(); }
function drawProof(t) {
  var pa = sm(seg(t, T_P1 - .3, T_P1 + .3)) * (1 - sm(seg(t, T_CL0, T_CL0 + .4))); if (pa <= .01) return;
  screenTag(320, 600, 'TO-DO LIST', MINT, pa); screenTag(760, 600, 'DONE LIST', '#c8c8c0', pa);
  var b0 = K.faster - .3, ba = sm(seg(t, b0 - .3, b0)) * (1 - sm(seg(t, K.only - .3, K.only)));
  if (ba > .01) { g.save(); g.globalAlpha = ba; var bx = [124, 564], fill = [eout(seg(t, b0, b0 + 1.3)), eout(seg(t, b0, b0 + 2.7)) * .92], col = [MINT, '#a8a8a0'], nm = ['asleep', 'asleep'];
    for (var i = 0; i < 2; i++) { rr(bx[i], 1180, 392, 36, 18); g.fillStyle = 'rgba(16,26,26,.7)'; g.fill(); rr(bx[i], 1180, Math.max(36, 392 * fill[i]), 36, 18); g.fillStyle = col[i]; g.fill(); g.fillStyle = INK; g.font = '500 22px Mar'; g.textAlign = 'left'; g.fillText('☾', bx[i] + Math.max(36, 392 * fill[i]) - 28, 1205); }
    g.fillStyle = PAPER; g.font = '500 20px Mar'; g.textAlign = 'center'; g.fillText('TIME TO FALL ASLEEP · ILLUSTRATIVE, NOT TO SCALE', 540, 1252); g.restore(); }
  var sp = back(seg(t, K.faster - .1, K.faster + .45)); if (sp > 0) { g.save(); g.globalAlpha = clamp(sp * 2, 0, 1) * pa; g.translate(330, 1010); g.rotate(-.08); g.scale(lerp(1.6, 1, sp), lerp(1.6, 1, sp)); g.font = '800 44px Man'; var w = g.measureText('FELL ASLEEP FASTER').width + 48; g.strokeStyle = MINT; g.lineWidth = 6; g.fillStyle = 'rgba(13,43,42,.86)'; g.beginPath(); g.rect(-w / 2, -40, w, 80); g.fill(); g.stroke(); g.fillStyle = MINT; g.textAlign = 'center'; g.fillText('FELL ASLEEP FASTER', 0, 15); g.restore(); }
  var d0 = K.fifty - .3, fade = 1 - sm(seg(t, T_CL0, T_CL0 + .5)); if (t >= d0) { g.save(); for (var k = 0; k < 57; k++) { var a = back(seg(t, d0 + k * .04, d0 + k * .04 + .3)); if (a <= 0) continue; var r = Math.floor(k / 19), c = k % 19, pu = 1 + .35 * Math.max(0, Math.sin((t - d0 - 2.5) * 5 - c * .5)) * (t > d0 + 2.5 ? 1 : 0); g.globalAlpha = clamp(a * 1.5, 0, 1) * fade; g.fillStyle = MINT; g.beginPath(); g.arc(170 + c * 41, 330 + r * 44, 11 * a * pu, 0, 6.3); g.fill(); } g.restore(); }
}
// ---------- recap note drops onto the cleared desk, then the call to action ----------
var prof = new Image(); prof.src = 'media/profile.jpg';
var CHIPS = [['SAVE', MINT, 150, 150, K.save], ['SEND', MINT, 316, 150, K.send], ['COMMENT', AMB, 482, 230, K.comment], ['FOLLOW', TANG, 728, 190, K.follow]];
function drawRecap(t) {
  var t0 = K.save - .3, tau = t - t0; if (tau < 0) return; var o = 1 - sm(seg(t, K.comment + .15, K.comment + .55)); if (o <= .01) return; var h = dropH(tau * 1.0) * .55, sc = 1 + h / 1500;
  g.save(); g.globalAlpha = clamp(tau / .06, 0, 1) * o; g.translate(540, 660); g.scale(sc, sc); var so = sh(h); g.shadowColor = 'rgba(8,4,0,' + so.a + ')'; g.shadowOffsetX = so.ox; g.shadowOffsetY = so.oy; g.shadowBlur = so.bl + 10;
  rr(-384, -270, 768, 540, 12); g.fillStyle = g.createPattern(PAPERTX, 'repeat'); g.fill(); g.shadowColor = 'transparent'; g.fillStyle = 'rgba(255,122,26,.85)'; g.fillRect(-90, -292, 180, 44);   // washi tape
  g.fillStyle = TANG; g.font = '500 24px Mar'; g.textAlign = 'left'; g.fillText('TONIGHT · 5 MINUTES · PEN + PAPER', -340, -214); g.strokeStyle = 'rgba(16,26,26,.25)'; g.lineWidth = 2; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(-340, -186); g.lineTo(340, -186); g.stroke(); g.setLineDash([]);
  var rows = [['1', 'PEN + PAPER', '5 min'], ['2', 'EVERYTHING YOU STILL NEED TO DO', ''], ['3', 'BE SPECIFIC: THE NEXT ACTION', 'not "taxes"']];
  for (var i = 0; i < 3; i++) { var r = back(seg(t, t0 + .7 + i * .45, t0 + 1.15 + i * .45)); if (r <= 0) continue; g.save(); g.globalAlpha *= clamp(r * 2, 0, 1); var y = -100 + i * 140; g.fillStyle = INK; g.beginPath(); g.arc(-320, y - 12, 32, 0, 6.3); g.fill(); g.fillStyle = MINT; g.font = '800 36px Man'; g.textAlign = 'center'; g.fillText(rows[i][0], -320, y);
    g.fillStyle = INK; g.textAlign = 'left'; g.font = '800 ' + (i === 1 ? 31 : 34) + 'px Man'; g.fillText(rows[i][1], -262, y - 2); if (rows[i][2]) { g.fillStyle = '#6b5a3e'; g.font = 'italic 34px Ser'; g.fillText(rows[i][2], -262, y + 42); } g.restore(); }
  g.restore();
}
function drawCTA(t) {
  if (t < K.save - .3) return; g.save();
  for (var i = 0; i < 4; i++) { var Cc = CHIPS[i], a = back(seg(t, Cc[4] - .05, Cc[4] + .4)); if (a <= 0) continue; var w = Cc[3], lit = (i === 3 && t > K.follow + 1.1); g.save(); g.globalAlpha = clamp(a * 2, 0, 1); g.translate(Cc[2] + w / 2, 1198); g.scale(lerp(.8, 1, a), lerp(.8, 1, a)); glassBox(-w / 2, -38, w, 76, lit ? Cc[1] : 'rgba(16,26,26,.8)', Cc[1], 28); g.fillStyle = lit ? INK : Cc[1]; g.font = '500 ' + (lit ? 21 : 26) + 'px Mar'; g.textAlign = 'center'; g.fillText(lit ? 'FOLLOWING' : Cc[0], 0, 8); g.restore(); }
  var pf = seg(t, K.send + .1, K.send + 1.0); if (pf > 0 && pf < 1) { var e = eio(pf), px = lerp(391, 860, e), py = 1198 - Math.sin(e * Math.PI) * 420 - e * 760; g.save(); g.globalAlpha = 1 - pf * pf; g.translate(px, py); g.rotate(-.5 - e * .6); g.fillStyle = MINT; g.beginPath(); g.moveTo(34, 0); g.lineTo(-24, -20); g.lineTo(-10, 0); g.lineTo(-24, 20); g.closePath(); g.fill(); g.restore(); }
  var ca = back(seg(t, K.comment - .05, K.comment + .45)), co = 1 - sm(seg(t, K.follow + 1.4, K.follow + 1.9)); if (ca > 0 && co > .01) { g.save(); g.globalAlpha = clamp(ca * 2, 0, 1) * co; g.translate(540, 1040); g.scale(lerp(.9, 1, ca), lerp(.9, 1, ca)); glassBox(-384, -46, 768, 92, 'rgba(16,26,26,.86)', AMB, 46); var n = Math.floor(clamp((t - K.comment - .25) / .55, 0, 1) * 7), word = 'TONIGHT'.slice(0, n);
    g.fillStyle = PAPER; g.font = '500 34px Mar'; g.textAlign = 'left'; g.fillText(word + ((Math.floor(t * 2.4) % 2 === 0 || n < 7) ? '▍' : ' '), -336, 12); g.fillStyle = AMB; g.font = '500 22px Mar'; g.textAlign = 'right'; g.fillText('POST', 340, 9); g.restore(); }
  var fu = back(seg(t, K.comment + .3, K.comment + .9)), bu = back(seg(t, K.follow - .05, K.follow + .5)); if (fu > 0) { g.save(); g.globalAlpha = clamp(fu * 2, 0, 1); g.translate(540, 560); g.scale(lerp(.8, 1, fu), lerp(.8, 1, fu));
    var pr = (t * .8) % 1; for (var k = 0; k < 2; k++) { var pp = (pr + k * .5) % 1; g.strokeStyle = 'rgba(142,240,200,' + (.55 * (1 - pp)) + ')'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 146 + pp * 90, 0, 6.3); g.stroke(); }
    g.beginPath(); g.arc(0, 0, 146, 0, 6.3); g.fillStyle = 'rgba(142,240,200,.18)'; g.fill(); g.lineWidth = 9; g.strokeStyle = MINT; g.stroke(); g.save(); g.beginPath(); g.arc(0, 0, 130, 0, 6.3); g.clip(); if (prof.complete) g.drawImage(prof, -130, -130, 260, 260); g.restore();
    g.fillStyle = PAPER; g.font = '800 62px Man'; g.textAlign = 'center'; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 20; g.fillText('@sandesh_explains', 0, 250); g.shadowColor = 'transparent';
    if (bu > 0) { var pressed = t > K.follow + 1.0, bw = 360, pk = pressed && t < K.follow + 1.15 ? .94 : 1; g.save(); g.globalAlpha = clamp(bu * 2, 0, 1); g.translate(0, 338); g.scale(lerp(.8, 1, bu) * pk, lerp(.8, 1, bu) * pk); glassBox(-bw / 2, -48, bw, 96, pressed ? MINT : TANG, pressed ? MINT : TANG, 48); g.fillStyle = INK; g.font = '800 40px Man'; g.fillText(pressed ? 'FOLLOWING ✓' : 'FOLLOW', 0, 16); g.restore(); } g.restore(); }
  g.restore();
}
// ---------- per-frame ----------
window.__reelDurationSec = DUR;
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 1e-3); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  var p = eio(seg(t, T_P0, T_P1)), c = eio(seg(t, T_CL0, T_CL1)), sP = lerp(lerp(1, .56, p), 1, c); CAM.s = sP; CAM.x = 540; CAM.y = lerp(960, 1000, sm(p) * (1 - c));
  drawDesk(); for (var i = 0; i < NCARD; i++) drawCard(i, t);
  var A = nbCenterA(t); if (t >= T_NB) { drawNotebookBody(A, 'TO-DO', true, t); drawWriting(t); } drawNotebookB(t); drawPen(t); drawLight(t);
  drawProof(t); drawRecap(t); drawCTA(t);
  // overlays
  var hl = $('hl'); var ho = 1 - sm(seg(t, K.grab - .6, K.grab)); hl.style.opacity = ho; hl.style.transform = 'translateY(' + (-24 * (1 - ho)) + 'px)';
  var st = t < K.grab ? null : t < K.write ? '1/3 · PEN + PAPER' : t < K.dont ? '2/3 · WRITE EVERYTHING' : t < K.unf ? '3/3 · BE SPECIFIC' : null, stE = $('step'); stE.textContent = st ? 'STEP ' + st : ''; stE.style.opacity = st ? sm(seg(t, st.charAt(0) === '1' ? K.grab : st.charAt(0) === '2' ? K.write : K.dont, (st.charAt(0) === '1' ? K.grab : st.charAt(0) === '2' ? K.write : K.dont) + .3)) : 0;
  var n = 0; for (var k = 0; k < NCARD; k++) { var tl = T_DROP0 + k * DROP_STEP + .55; if (t >= tl && t < TW[k] + .35) n++; } var oe = $('open'); oe.textContent = n + ' OPEN LOOPS'; oe.style.color = (n || t < K.write) ? TANG : MINT; oe.style.borderColor = oe.style.color; oe.style.opacity = t < T_P0 ? 1 : 1 - seg(t, T_P0, T_P0 + .4);
  var il = $('ill'); il.style.opacity = sm(seg(t, K.dont, K.dont + .4)) * (1 - sm(seg(t, K.c2End, K.c2End + .4)));
  var ce = $('catch'); ce.style.opacity = sm(seg(t, K.only, K.only + .5)) * (1 - sm(seg(t, T_CL0, T_CL0 + .4))); ce.style.transform = 'translateY(' + (1 - sm(seg(t, K.only, K.only + .5))) * 20 + 'px)';
  var c2 = ''; (TM.caps || []).forEach(function (cc) { if (t >= cc[0] && t < cc[1]) c2 = cc[2]; }); var capE = $('cap'); capE.textContent = c2; capE.style.opacity = c2 ? 1 : 0;
  return Promise.resolve();
};
window.EV = (function () { var e = []; for (var i = 0; i < NCARD; i++) { var t0 = T_DROP0 + i * DROP_STEP; e.push({ t: t0 + Math.sqrt(2 * DROP_H / GRAV), k: 'drop', i: i }); e.push({ t: TW[i] - .06, k: 'lift', i: i }); e.push({ t: TW[i] + .16, k: 'flick', i: i }); e.push({ t: TW[i], k: 'pen', d: TWD, i: i }); }
  e.push({ t: T_NB, k: 'slide' }, { t: T_PEN, k: 'pickup' }, { t: K.dont, k: 'marker' }, { t: K.taxes, k: 'strike' }, { t: K.next, k: 'pen', d: Math.max(.9, K.ten - K.next + .2), i: 8 }, { t: K.ten + .1, k: 'tick' }, { t: T_QUIET, k: 'quiet' }, { t: T_P0, k: 'rise' }, { t: K.faster - .3, k: 'bars' }, { t: K.faster, k: 'stamp' },
    { t: K.fifty - .3, k: 'dots' }, { t: T_CL0, k: 'clear' }, { t: K.save - .3, k: 'recap' }, { t: K.save, k: 'chip', n: 0 }, { t: K.send, k: 'chip', n: 1 }, { t: K.send + .1, k: 'swoosh' }, { t: K.comment, k: 'chip', n: 2 }, { t: K.comment + .25, k: 'type', d: .55 }, { t: K.follow, k: 'chip', n: 3 }, { t: K.follow + 1.0, k: 'press' }); return e; })();
// pen speed/height sampled at 100 Hz from the same function that draws the pen, so the scratch sound follows the motion exactly
window.PEN = (function () { var o = [], p0 = null, dt = .01; for (var t = T_PEN; t < K.ten + 2.2; t += dt) { var st = penState(t); if (p0) o.push([Math.round(t * 100) / 100, Math.round(Math.hypot(st.x - p0.x, st.y - p0.y) / dt), Math.round(st.h * 10) / 10]); p0 = st; } return o; })();
window.NBM = (function () { var o = []; for (var t = T_NB; t < T_NB + 1.3; t += .01) { var a = nbCenterA(t), b = nbCenterA(t - .01); o.push([Math.round(t * 100) / 100, Math.round(Math.hypot(a.x - b.x, a.y - b.y) / .01)]); } return o; })();
Promise.all([document.fonts.load('italic 40px Ser'), document.fonts.load('800 40px Man'), document.fonts.load('500 20px Mar')]).catch(function () {}).then(function () { return new Promise(function (r) { if (prof.complete) r(); else prof.onload = r; }); }).then(function () { window.__seek(0); window.__ready = true; });
window.__ready = false;
})();
