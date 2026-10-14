// Reel #02 "Four million. Every second." (cells). Every frame is a pure function of t (window.__seek).
// Scene times derive from timing.js (voice line/word times): swap the voice, rebuild, and the whole reel re-times.
(function () {
'use strict';
var W = 1080, H = 1920, F = 1763, CX0 = .4, CZ0 = .3, TAU = Math.PI * 2;
var $ = function (id) { return document.getElementById(id); };
window.__reelDurationSec = 32; window.__ready = false; window.EV = [];
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function e3(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function back(x) { x = clamp(x, 0, 1); var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function lerp(a, b, k) { return a + (b - a) * k; }
function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function ev(t, type) { window.EV.push({ t: +t.toFixed(3), type: type }); }
var fx = $('fx'), ctx = fx.getContext('2d'), TM = window.TM;

// ---------- voice timing
var LW = ["While I say this, your body replaces millions of cells.", "About four million. Every second.", "Most are blood cells. A red blood cell lasts about four months.", "Your gut lining? Three to five days.", "A brand-new body every seven years? Not quite.", "Most of your brain's neurons are never replaced.", "Send this to the friend who says they're a new person.", "Since you pressed play: about a hundred million.", "Follow for the next one."].map(function (s) { return s.split(' '); });
function L(i) { return TM.lines[i - 1]; }
function wt(i, k) { var l = L(i), ws = LW[i - 1], tot = ws.join(' ').length, c = 0; for (var j = 0; j < k; j++) c += ws[j].length + 1; return l.a + (l.b - l.a) * c / tot; }
var DUR = Math.min(35, Math.max(30, Math.ceil((L(9).b + 2.4) * 2) / 2)); window.__reelDurationSec = DUR;
var RATE = 3.82e6, TC = 100e6 / RATE;   // counter = RATE x t (330 bn / 86,400 s); crosses 100,000,000 at TC
// scene boundaries: BD[k] between scene k and k+1; kinds and widths
var BD = [L(2).a - .1, L(3).a - .1, L(4).a - .1, L(5).a - .1, L(6).a - .1, L(7).a - .1, L(8).a - .1, L(8).b + .75];
var TK = ['push', 'pull', 'push', 'pull', 'push', 'cross', 'pull', 'cross'], TW = [.7, .6, .7, .7, .7, .5, .7, .5];
var ORG = [[540, 900], [540, 900], [540, 840], [540, 900], [540, 520], [540, 900], [540, 840], [540, 900]];
var PLATE = ['plasma', 'marrow', 'plasma', 'gut_bg', 'void', 'void', 'void', 'void', 'void'];
function sa(i) { return i === 0 ? 0 : BD[i - 1]; } function sb(i) { return i === 8 ? DUR : BD[i]; }

// ---------- sprites: red cell (8 tilts x 3 blur x 3 fog), soft glows, dots
var BLUR = [0, 2.2, 6, 12], FOG = [1, .66, .4], SPR = [], SZ = 256;
function buildSprites(imgs) { SZ = imgs[0].naturalWidth; var k = SZ / 256, pad = SZ * .125, cs = SZ * 1.25;
  for (var t = 0; t < 8; t++) { SPR[t] = []; for (var b = 0; b < 4; b++) { SPR[t][b] = []; for (var f = 0; f < 3; f++) { var c = document.createElement('canvas'); c.width = c.height = cs; var x = c.getContext('2d'); x.filter = 'blur(' + (BLUR[b] * k) + 'px) brightness(' + FOG[f] + ')'; x.drawImage(imgs[t], pad, pad); SPR[t][b][f] = c; } } } }
function glow(r, g, b) { var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',1)'); gr.addColorStop(.35, 'rgba(' + r + ',' + g + ',' + b + ',.35)'); gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c; }
function dot(r, g, b) { var c = document.createElement('canvas'); c.width = c.height = 16; var x = c.getContext('2d'); x.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'; x.beginPath(); x.arc(8, 8, 7, 0, TAU); x.fill(); return c; }
var GL_LIME = glow(214, 255, 110), GL_AMB = glow(255, 190, 90), GL_CY = glow(92, 230, 255), D_CY = dot(92, 230, 255), D_LIME = dot(214, 255, 110), D_GRN = dot(176, 245, 120), D_IVO = dot(160, 210, 210);
function spot(img, x, y, r, a) { if (a < .01) return; ctx.globalAlpha = a; ctx.drawImage(img, x - r, y - r, 2 * r, 2 * r); }
function loadImg(src) { return new Promise(function (r) { var i = new Image(); i.onload = function () { r(i); }; i.onerror = function () { r(null); }; i.src = src; }); }

// ---------- counter
var digs = [];
(function () { var c = $('cnt'); ['d8', 'd7', 'd6', 'sp', 'd5', 'd4', 'd3', 'sp', 'd2', 'd1', 'd0'].forEach(function (k) { var e = document.createElement('div'); if (k === 'sp') e.className = 'sp'; else { e.className = 'd'; e.innerHTML = '<i>0</i><i>0</i>'; e._k = +k.slice(1); digs.push(e); } c.appendChild(e); }); })();
function smooth(x, a, b) { var k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }
function counter(t) {
  var V = RATE * t, v = Math.floor(V), wrap = $('cntwrap');
  digs.forEach(function (e) { var k = e._k, cur, nxt, off = 0;
    if (k >= 6) { var q = V / Math.pow(10, k), fl = Math.floor(q), fr = q - fl; cur = fl % 10; nxt = (fl + 1) % 10; off = smooth(fr, .5, 1); e.style.filter = 'none'; }
    else { var r = ((Math.floor(t * 60) * 7919 + k * 104729 + 13) % 9973); cur = r % 10; nxt = cur; e.style.filter = 'blur(' + (k < 3 ? 3 : 1.6) + 'px)'; }
    var is = e.children; is[0].textContent = cur; is[1].textContent = nxt; is[0].style.marginTop = (-off * 112) + 'px'; e.style.opacity = (v >= Math.pow(10, k) || k < 4) ? 1 : .22; });
  var down = eio(seg(t, sa(7) - .1, sa(7) + .7)) * (1 - eio(seg(t, sb(7) - .3, sb(7) + .5))), pulse = Math.max(0, 1 - Math.abs(t - TC) / .28);
  wrap.style.transform = 'translateY(' + (down * 930) + 'px) scale(' + (1 + .1 * down + .07 * pulse) + ')'; $('cntlab').style.opacity = 1 - .25 * down;
}

// ---------- captions (2-3 word chunks, one at a time, key word coloured)
var CH = [[[0, 3], [4, 6, { 6: 'li' }], [7, 9, { 7: 'li' }]], [[0, 2, { 2: 'li' }], [3, 4, { 4: 'li' }]], [[0, 3, { 2: 'co' }], [4, 7], [8, 9], [10, 11, { 11: 'co' }]], [[0, 2, { 1: 'am' }], [3, 6, { 6: 'am' }]], [[0, 2], [3, 5, { 4: 'co' }], [6, 7, { 7: 'li' }]], [[0, 2], [3, 4, { 4: 'cy' }], [5, 7, { 6: 'cy', 7: 'cy' }]], [[0, 2], [3, 4], [5, 7], [8, 10, { 10: 'li' }]], [[0, 3], [4, 7, { 6: 'li', 7: 'li' }]], [[0, 1], [2, 4, { 4: 'li' }]]];
var capEl = $('cap'), capNodes = [];
CH.forEach(function (cl, li) { cl.forEach(function (c, ci) { var d = document.createElement('div'); d.innerHTML = LW[li].slice(c[0], c[1] + 1).map(function (w, k) { var cls = c[2] && c[2][c[0] + k]; return cls ? '<span class="k-' + cls + '">' + w + '</span>' : w; }).join(' '); capEl.appendChild(d); capNodes.push({ el: d, line: li + 1, a: wt(li + 1, c[0]), b: (ci + 1 < cl.length ? wt(li + 1, cl[ci + 1][0]) : L(li + 1).b + .35) }); }); });
function captions(t) {
  var cur = null; capNodes.forEach(function (n) { if (t >= n.a - .02 && t < n.b) cur = n; }); capNodes.forEach(function (n) { if (n !== cur) n.el.style.display = 'none'; });
  if (!cur) return; var k = e3(seg(t, cur.a, cur.a + .14)), e = cur.el; e.style.display = 'block'; e.style.opacity = k * (cur.line === 9 ? 1 - seg(t, DUR - .4, DUR - .1) : 1); e.style.transform = 'translateY(' + ((1 - k) * 14) + 'px) scale(' + lerp(.93, 1, k) + ')';
}

// ---------- scene 1/3 stream of red cells (perspective, tumbling, focus-blurred, fogged)
function dep(d) { return clamp(1 - (d - 3) / 87, 0, 1); }
var CELLS = (function () { var r = rng(11), a = []; for (var i = 0; i < 330; i++) { var ang = r() * TAU, rad = Math.sqrt(r()) * 4.4; a.push({ idx: i, X: Math.cos(ang) * rad, Z: Math.sin(ang) * rad, d0: r() * 70, om: .5 + r() * 2.2, ph: r() * TAU, sp0: r() * TAU, sp: (r() - .5) * 1.6, lime: i % 11 === 0 }); } return a; })();
var HERO = { X: 1.25, Z: -.55 };
function focus1(t) { var hero = 14.5 - 1.25 * t; return lerp(hero, 16, eio(seg(t, 2.2, 3.1))); }
function stream(t, speed, al, o) {
  o = o || {}; var arr = [], run = speed * t, bias = o.bias || 0;
  for (var i = 0; i < CELLS.length; i++) { var c = CELLS[i]; arr.push({ c: c, d: ((c.d0 - run - (o.dive || 0)) % 70 + 70) % 70 + 2.5, X: c.X, Z: c.Z, hero: false }); }
  if (o.hero !== false) arr.push({ c: { om: .7, ph: 1, sp0: .4, sp: .5 }, d: 14.5 - 1.25 * t - 9 * (o.heroDive || 0), X: HERO.X, Z: HERO.Z, hero: true });
  arr.sort(function (a, b) { return b.d - a.d; }); var fd = o.focus == null ? focus1(t) : o.focus, sway = [Math.sin(t * .7) * 5, Math.cos(t * .55) * 4];
  for (var j = 0; j < arr.length; j++) { var q = arr[j], d = q.d; if (d < 2.6) continue; if (d < 10 && !q.hero && q.c.idx % 4) continue;
    var sx = W / 2 + (q.X - CX0) / d * F + sway[0] * (1 - d / 80), sy = H / 2 - (q.Z - CZ0) / d * F + sway[1] * (1 - d / 80), rs = 1 / d * F, D = 2.7 * rs;
    var diff = Math.abs(d - fd) * (q.hero ? 1.25 : 1), bl = clamp((diff < 2.5 ? 0 : diff < 8 ? 1 : diff < 17 ? 2 : 3) + bias, 0, 3), fg = d < 24 ? 0 : d < 42 ? 1 : 2;
    var tilt = Math.floor(Math.abs(Math.sin(q.c.om * t + q.c.ph)) * 7.99), spin = q.c.sp0 + q.c.sp * t;
    var a = al * clamp((d - 2.6) / 5, 0, 1) * clamp((74 - d) / 10, 0, 1) * (bl === 3 ? .4 : bl === 2 ? .8 : 1) * (d < 10 && !q.hero ? .7 : 1);
    if (q.c.lime && d > 6) { ctx.globalCompositeOperation = 'lighter'; spot(GL_LIME, sx, sy, rs * 2.6, .6 * a * ctx.__sa); ctx.globalCompositeOperation = 'source-over'; }
    ctx.save(); ctx.globalAlpha = a * ctx.__sa; ctx.translate(sx, sy); ctx.rotate(spin); var s = D * 1.25; ctx.drawImage(SPR[tilt][bl][fg], -s / 2, -s / 2, s, s); ctx.restore(); }
}
function draw1(t, al) { var push = eio(seg(t, sb(0) - .7, sb(0))); stream(t, 5.5 + 26 * push * push, e3(seg(t, 0, .25)), { dive: 18 * push * push, heroDive: push }); }

// ---------- scene 2: marrow: ~3,800 sparks a second (1 spark = 1,000 cells), 6 buds
var BUDS = [[300, 760], [770, 700], [540, 1020], [210, 1120], [850, 1090], [540, 540]];
var SPK = (function () { var r = rng(33), a = []; for (var i = 0; i < 1900; i++) a.push({ ph: r(), bud: Math.floor(r() * 6), ang: r() * TAU, sp: .5 + r() * .9, sz: 1.6 + r() * 3.4 }); return a; })();
function draw2(t, al) {
  var u = t - sa(1), ramp = e3(seg(u, .05, .5)), sway = [Math.sin(t * .7) * 5, Math.cos(t * .55) * 4];
  for (var i = 0; i < 16; i++) { var r = rng(900 + i), d = 10 + r() * 22, X = (r() - .5) * 12, Z = (r() - .5) * 14, k = (t * .06 + r()) % 1, sx = W / 2 + (X + Math.sin(t * .3 + i) * .5 - CX0) / d * F, sy = H / 2 - (Z + Math.cos(t * .27 + i) * .5 - CZ0) / d * F, rs = 1 / d * F * (1 + .06 * Math.sin(t * 3 + i)), D = 2.7 * rs * 1.25, bl = d > 24 ? 2 : d > 16 ? 1 : 0, tilt = Math.floor(Math.abs(Math.sin(r() * 5 + t * .8)) * 7.99);
    ctx.save(); ctx.globalAlpha = al * ctx.__sa * .9; ctx.translate(sx + sway[0], sy + sway[1]); ctx.rotate(r() * 6 + t * .2); ctx.drawImage(SPR[tilt][bl][d > 26 ? 1 : 0], -D / 2, -D / 2, D, D); ctx.restore(); }
  ctx.globalCompositeOperation = 'lighter';
  for (var j = 0; j < SPK.length; j++) { var p = SPK[j], age = ((t * 1.8 + p.ph) % 1), b = BUDS[p.bud], rad = Math.pow(age, .75) * 640 * p.sp, x = b[0] + Math.cos(p.ang) * rad, y = b[1] + Math.sin(p.ang) * rad * 1.15 - age * 120, a = Math.sin(Math.PI * Math.min(1, age * 1.05)) * ramp * (p.ph < .5 ? 1 : .8);
    if (x < -40 || x > W + 40 || y < -40 || y > H + 40) continue; spot(p.ph > .85 ? GL_AMB : GL_LIME, x, y, p.sz * (2.2 + 4 * age), Math.min(1, a * 1.25) * ctx.__sa); }
  ctx.globalCompositeOperation = 'source-over';
}

// ---------- scene 3: blood share ring (crimson ~86 % / amber ~14 %) + one cell's 120-day clock
function draw3(t, al) {
  stream(t, 3.4, .55 * e3(seg(t, sa(2), sa(2) + .5)), { bias: 1, hero: false, focus: 14 }); var s0 = sa(2), tR = wt(3, 2) - .2, kR = eio(seg(t, tR, tR + 1.1)), a0 = -Math.PI / 2, cx = 540, cy = 680, R = 215, ca = al * ctx.__sa;
  ctx.save(); ctx.globalAlpha = ca * .55 * e3(seg(t, tR - .1, tR + .3)); ctx.fillStyle = 'rgba(8,6,14,1)'; ctx.beginPath(); ctx.arc(cx, cy, R + 62, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha = ca * .95 * e3(seg(t, tR - .1, tR + .3)); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(8,10,20,.72)'; ctx.lineWidth = 60; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#ff4d3d'; ctx.shadowColor = 'rgba(255,77,61,.8)'; ctx.shadowBlur = 36; ctx.lineWidth = 46; ctx.beginPath(); ctx.arc(cx, cy, R, a0, a0 + TAU * .86 * kR); ctx.stroke();
  ctx.strokeStyle = '#ffb43a'; ctx.shadowColor = 'rgba(255,180,58,.8)'; ctx.beginPath(); ctx.arc(cx, cy, R, a0 + TAU * .865, a0 + TAU * (.865 + .135 * kR)); ctx.stroke(); ctx.restore();
  var pc = $('pct'); pc.textContent = '≈86%'; var ki = back(seg(t, tR + .5, tR + 1.0)); pc.style.opacity = clamp(ki * 3, 0, 1) * ctx.__sa; pc.style.top = '588px'; pc.style.transform = 'scale(' + lerp(.8, 1, ki) + ')';
  // followed cell + 120-day ring
  var t0 = wt(3, 4) - .1, tE = L(3).b - .05, p = seg(t, wt(3, 8) - .15, tE), enter = e3(seg(t, t0, t0 + .5)), swap = eio(seg(t, tE, tE + .55)), x = 540, y = 1040, rr = 150;
  var tilt = Math.floor(Math.abs(Math.sin(t * .9)) * 7.99), D = 2.7 * 92 * 1.25 * (.6 + .4 * enter);
  ctx.save(); ctx.translate(x - swap * 330, y); ctx.rotate(t * .6); ctx.globalAlpha = ca * enter * (1 - swap); ctx.drawImage(SPR[tilt][0][0], -D / 2, -D / 2, D, D); ctx.globalAlpha = ca * enter * (1 - swap) * p * .8; ctx.drawImage(SPR[tilt][0][2], -D / 2, -D / 2, D, D); ctx.restore();
  if (swap > 0) { var tl2 = Math.floor(Math.abs(Math.sin(t * 1.1 + 1)) * 7.99); ctx.save(); ctx.translate(x + (1 - swap) * 330, y); ctx.rotate(-t * .5); ctx.globalAlpha = ca * swap; ctx.drawImage(SPR[tl2][0][0], -D / 2, -D / 2, D, D); ctx.restore(); ctx.globalCompositeOperation = 'lighter'; spot(GL_LIME, x, y, 230, ca * .5 * Math.sin(Math.PI * swap)); ctx.globalCompositeOperation = 'source-over'; }
  ctx.save(); ctx.globalAlpha = ca * enter; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(241,236,230,.22)'; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#f1ece6'; ctx.shadowColor = 'rgba(255,230,200,.6)'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x, y, rr, a0, a0 + TAU * p); ctx.stroke(); ctx.restore();
  var dy = $('days'); dy.textContent = Math.round(120 * p) + ' DAYS'; dy.style.opacity = enter * ctx.__sa; dy.style.top = '1204px';
}

// ---------- scene 4: gut: shed cells off the villus tips, lime renewal wave (in the shader), "3-5 DAYS"
function draw4(t, al) {
  var u = t - sa(3), r = rng(77); ctx.globalCompositeOperation = 'lighter'; var ramp = e3(seg(u, .2, .8));
  for (var i = 0; i < 110; i++) { var ang = r() * TAU, d0 = 7 + r() * 40, ph = r(), sp = .16 + r() * .14, k = (t * sp + ph) % 1, d = d0 - 2 * k, rad = lerp(5.35, 3.6, k), X = Math.cos(ang) * rad, Z = Math.sin(ang) * rad - k * k * 2.2;
    var sx = W / 2 + X / d * F, sy = H / 2 - Z / d * F, rs = .34 / d * F, soft = clamp(Math.abs(d - 15) / 14, 0, 1), rr = rs * (1.4 + 1.8 * soft), a = ramp * Math.sin(Math.PI * k) * (.8 - .45 * soft) * clamp((d - 3) / 3, 0, 1); spot(GL_AMB, sx, sy, rr * 1.5, a * ctx.__sa); }
  ctx.globalCompositeOperation = 'source-over';
  var d35 = $('d35'), b = seg(t, wt(4, 3) - .1, wt(4, 3) + .35); d35.style.opacity = b * ctx.__sa; d35.style.transform = 'scale(' + lerp(.86, 1, e3(b)) + ')';
}

// ---------- body of light (silhouette sampled to points; foot-to-head renewal wave; the brain stays cyan)
var BODY = { pts: [], glow: null }, BS = .78;
function buildBody() {
  var c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'); x.fillStyle = '#fff';
  x.beginPath(); x.ellipse(540, 520, 128, 158, 0, 0, TAU); x.fill(); x.fillRect(486, 640, 108, 130);
  x.beginPath(); x.moveTo(478, 742); x.bezierCurveTo(300, 790, 214, 850, 190, 960); x.lineTo(160, 1650); x.lineTo(920, 1650); x.lineTo(890, 960); x.bezierCurveTo(866, 850, 780, 790, 602, 742); x.closePath(); x.fill();
  x.globalCompositeOperation = 'destination-in'; var gr = x.createLinearGradient(0, 1180, 0, 1560); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, W, H);
  var d = x.getImageData(0, 0, W, H).data, r = rng(21), n = 0, tries = 0;
  while (n < 7500 && tries < 400000) { tries++; var px = Math.floor(r() * W), py = Math.floor(120 + r() * 1500), a = d[(py * W + px) * 4 + 3]; if (a < 40 || r() * 255 > a) continue;
    var brain = ((px - 540) / 96) * ((px - 540) / 96) + ((py - 470) / 82) * ((py - 470) / 82) < 1; BODY.pts.push({ x: px, y: py, brain: brain, ph: r() * TAU, sz: .9 + r() * 2.1, h: r(), dir: Math.atan2(py - 900, px - 540) + (r() - .5) * .6 }); n++; }
  var g = document.createElement('canvas'); g.width = W; g.height = H; var gx = g.getContext('2d'); gx.filter = 'blur(38px)'; gx.globalAlpha = .55; gx.drawImage(c, 0, 0); BODY.glow = g;
}
// opt: appear (0..1), wave (0..1 foot->head, or -1 for none), burst (0..1), fade
function bodyDraw(t, appear, wave, burst, fade, al) {
  var yw = lerp(1560, 360, wave), ca = al * ctx.__sa;
  ctx.save(); ctx.globalAlpha = ca * appear * .6 * (1 - .5 * burst); ctx.globalCompositeOperation = 'lighter'; ctx.transform(BS, 0, 0, BS, 540 - 540 * BS, 330 - 360 * BS); ctx.drawImage(BODY.glow, 0, 0); ctx.restore();
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 0; i < BODY.pts.length; i++) { var p = BODY.pts[i], tw = .55 + .45 * Math.sin(t * 2.2 + p.ph), x = 540 + (p.x - 540) * BS, y = 330 + (p.y - 360) * BS, img, a, s = p.sz * BS * 1.1;
    if (p.brain) { img = D_CY; a = (.55 + .4 * tw) * appear; s *= 1.25; } else { var near = wave > 0 && wave < 1 && Math.abs(p.y - yw) < 70, done = wave >= 0 && p.y > yw;
      if (near) { img = D_LIME; a = 1; s *= 2.0; } else if (done) { img = D_GRN; a = .55 + .3 * tw; } else { img = D_IVO; a = .3 + .3 * tw; } a *= appear; }
    if (burst > 0 && !p.brain) { var off = burst * (160 + p.h * 640); x += Math.cos(p.dir) * off; y += Math.sin(p.dir) * off * 1.1; a *= 1 - .5 * burst; s *= 1 + burst * .8; }
    a *= fade * ca; if (a < .02) continue; ctx.globalAlpha = a; ctx.drawImage(img, x - s, y - s, 2 * s, 2 * s); }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
// ---------- scene 5: body + 7-year calendar; the wave stops at the brain
function draw5(t, al) {
  var appear = e3(seg(t, sa(4) + .1, sa(4) + .9)), tw0 = wt(5, 6) - .15, tw1 = sb(4) + .25, wave = t < tw0 ? -1 : eio(seg(t, tw0, tw1));
  bodyDraw(t, appear, wave, 0, 1, al);
  var cal = $('cal'), c0 = wt(5, 3), k = back(seg(t, c0, c0 + .45)); cal.style.opacity = clamp(k * 3, 0, 1) * ctx.__sa; cal.style.transform = 'scale(' + lerp(.8, 1, k) + ')';
  var f0 = wt(5, 4) - .35, fl = clamp(Math.floor(1 + 7 * seg(t, f0, wt(5, 6) - .05)), 1, 7); $('calnum').textContent = fl;
  var st = $('strike').firstElementChild, sk = eio(seg(t, tw1 - .3, tw1 + .2)); st.setAttribute('stroke-dashoffset', 290 * (1 - sk));
}
// ---------- scene 6: neurons that stay (cyan constellation); lime rings contract toward it and never touch it
var NEU = (function () { var r = rng(61), n = [], i; for (i = 0; i < 230; i++) { var ang = r() * TAU, rad = Math.sqrt(r()), z = Math.floor(r() * 3); n.push({ x: 540 + Math.cos(ang) * rad * 300, y: 790 + Math.sin(ang) * rad * 340, z: z, ph: r() * TAU, e: [] }); }
  n.forEach(function (a, ai) { var ds = []; n.forEach(function (b, bi) { if (bi !== ai && Math.abs(a.z - b.z) < 2) ds.push([Math.hypot(a.x - b.x, a.y - b.y), bi]); }); ds.sort(function (p, q) { return p[0] - q[0]; }); a.e = ds.slice(0, 3).map(function (d) { return d[1]; }); }); return n; })();
function draw6(t, al) {
  var u = t - sa(5), ap = e3(seg(u, .05, .7)), ca = al * ctx.__sa; ctx.globalCompositeOperation = 'lighter'; spot(GL_CY, 540, 790, 520, .16 * ap * ca);
  function pos(a) { var dz = [10, 5, 0][a.z], k = 1 + (2 - a.z) * .015; return [540 + (a.x - 540) * k + Math.sin(t * .4 + a.ph) * (4 + 3 * a.z) + dz * Math.sin(t * .3), 790 + (a.y - 790) * k + Math.cos(t * .35 + a.ph) * (4 + 3 * a.z)]; }
  for (var pass = 0; pass < 3; pass++) { ctx.lineWidth = [8, 3, 1.5][pass]; ctx.strokeStyle = ['rgba(92,230,255,.07)', 'rgba(92,230,255,.28)', 'rgba(210,250,255,.6)'][pass]; ctx.globalAlpha = ap * ca;
    ctx.beginPath(); NEU.forEach(function (a) { if (a.z === 0 && pass === 0) return; var p = pos(a); a.e.forEach(function (ei) { var b = NEU[ei], q = pos(b); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo((p[0] + q[0]) / 2 + (p[1] - q[1]) * .32, (p[1] + q[1]) / 2 + (q[0] - p[0]) * .32, q[0], q[1]); }); }); ctx.stroke(); }
  NEU.forEach(function (a) { var p = pos(a), tw = .6 + .4 * Math.sin(t * 2 + a.ph), r = [10, 7, 5][a.z]; spot(GL_CY, p[0], p[1], r * 3.6, ap * ca * (.5 + .5 * tw)); ctx.globalAlpha = ap * ca; ctx.drawImage(D_CY, p[0] - r * .6, p[1] - r * .6, r * 1.2, r * 1.2); });
  for (var k = 0; k < 2; k++) { var ph = ((u * .46 + k * .5) % 1), rad = 980 - 560 * ph, fade = Math.sin(Math.PI * Math.min(1, ph / .85)) * (1 - seg(ph, .8, .9)), n = 150;
    for (var i = 0; i < n; i++) { var an = i / n * TAU + k * .7 + u * .3, jx = Math.sin(i * 12.9898) * 6; spot(GL_LIME, 540 + Math.cos(an) * (rad + jx), 790 + Math.sin(an) * (rad + jx) * 1.08, 7 + 6 * ph, .8 * fade * ap * ca); } }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
// ---------- scene 7: the friend (happy doodle) and a paper plane
function draw7(t, al) {
  var u = t - sa(6), ca = al * ctx.__sa, f = $('friend'), k = back(seg(u, .1, .65)); f.style.opacity = clamp(k * 3, 0, 1) * ctx.__sa; f.style.transform = 'translate(' + ((1 - k) * -520) + 'px,' + (Math.sin(t * 1.3) * 4) + 'px) scale(' + lerp(.9, 1, k) + ')';
  var tp = wt(7, 0) - .05, fk = seg(t, tp, wt(7, 3) + .1), px = lerp(200, 800, eio(fk)), py = lerp(1160, 500, eio(fk)) - Math.sin(fk * Math.PI) * 160;
  if (fk > 0 && fk < 1) { ctx.globalCompositeOperation = 'lighter'; for (var q = 0; q < 8; q++) { var f2 = Math.max(0, fk - q * .04); spot(GL_LIME, lerp(200, 800, eio(f2)), lerp(1160, 500, eio(f2)) - Math.sin(f2 * Math.PI) * 160, 22 - q * 2, ca * (.7 - q * .08)); } ctx.globalCompositeOperation = 'source-over';
    ctx.save(); ctx.globalAlpha = ca; ctx.fillStyle = '#c6ff4a'; ctx.shadowColor = 'rgba(198,255,74,.8)'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.moveTo(px - 34, py + 14); ctx.lineTo(px + 42, py - 20); ctx.lineTo(px + 8, py + 40); ctx.lineTo(px - 2, py + 9); ctx.closePath(); ctx.fill(); ctx.restore(); }
  var bt = wt(7, 5) - .05, bk = back(seg(t, bt, bt + .5)), b = $('bubble'); b.style.opacity = clamp(bk * 3, 0, 1) * ctx.__sa; b.style.transform = 'translateY(' + ((1 - bk) * 40) + 'px) scale(' + lerp(.8, 1, bk) + ')'; b.style.transformOrigin = '100% 100%';
  var r = rng(15); ctx.globalCompositeOperation = 'lighter'; for (var i = 0; i < 70; i++) { var x = r() * W, y0 = r() * H, sp = 30 + r() * 60, y = ((y0 - t * sp) % H + H) % H; spot(GL_LIME, x, y, 3 + r() * 4, .35 * ca * (.5 + .5 * Math.sin(t * 2 + i))); } ctx.globalCompositeOperation = 'source-over';
}
// ---------- scene 8: payoff: the body bursts into sparks as the counter crosses 100,000,000
var SP8 = (function () { var r = rng(5), a = []; for (var i = 0; i < 1600; i++) a.push({ th: r() * TAU, z: r(), sp: .08 + r() * .22, off: r() }); return a; })();
function draw8(t, al) {
  var ca = al * ctx.__sa, appear = e3(seg(t, sa(7) + .05, sa(7) + .8)), wv = eio(seg(t, sa(7) + .25, TC - 1.25)), burst = e3(seg(t, TC - 1.1, TC + .4)), fade = 1 - .55 * seg(t, TC + .9, TC + 2.5);
  bodyDraw(t, appear, wv, burst, fade, al);
  var u = t - (TC - 1.1); if (u > 0) { ctx.globalCompositeOperation = 'lighter'; var rate = 1 + .9 * seg(t, TC - 1.1, TC + 1);
    for (var i = 0; i < SP8.length; i++) { var p = SP8[i], k = (((u * p.sp * rate + p.off) % 1) + 1) % 1, rad = 40 + 40 * p.z + Math.pow(k, 1.25) * (520 + 700 * p.z), a = (1 - k) * Math.min(1, k * 9) * e3(seg(u, 0, .6)) * ca, sz = (2.2 + 6.5 * (1 - p.z)) * (1 - .35 * k), x = 540 + Math.cos(p.th) * rad * .9, y = 760 + Math.sin(p.th) * rad * 1.15; if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue; spot(i % 7 === 0 ? GL_AMB : GL_LIME, x, y, sz * 2.4, a); }
    var sh = seg(t, TC, TC + .9); if (sh > 0 && sh < 1) { ctx.globalAlpha = (1 - sh) * ca; ctx.lineWidth = 14 * (1 - sh); ctx.strokeStyle = 'rgba(214,255,120,1)'; ctx.beginPath(); ctx.arc(540, 1230, 60 + sh * 900, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.globalCompositeOperation = 'source-over'; }
}
// ---------- scene 9: end card (the counter keeps running above it)
function draw9(t, al) {
  var u = t - sa(8), ca = al * ctx.__sa, ak = back(seg(u, .05, .6)), av = $('av'); av.style.opacity = clamp(ak * 3, 0, 1) * ctx.__sa; av.style.transform = 'translateY(' + (Math.sin(t * 1.8) * 3) + 'px) scale(' + lerp(.6, 1, ak) + ')';
  var hk = e3(seg(u, .3, .75)), hd = $('hd'); hd.style.opacity = hk * ctx.__sa; hd.style.transform = 'translateY(' + ((1 - hk) * 30) + 'px)';
  var fk = back(seg(t, L(9).a - .1, L(9).a + .45)), press = seg(t, L(9).b - .05, L(9).b + .1) * (1 - seg(t, L(9).b + .1, L(9).b + .3)), fo = $('fol'); fo.style.opacity = clamp(fk * 3, 0, 1) * ctx.__sa; fo.firstElementChild.style.transform = 'scale(' + (lerp(.6, 1, fk) - .07 * press) + ')';
  ctx.globalCompositeOperation = 'lighter'; for (var i = 0; i < 3; i++) { var ph = (t * .6 + i / 3) % 1; ctx.globalAlpha = (1 - ph) * .7 * ak * ca; ctx.strokeStyle = '#c6ff4a'; ctx.lineWidth = 6 - 4 * ph; ctx.beginPath(); ctx.arc(540, 810, 180 + ph * 170, 0, TAU); ctx.stroke(); }
  var rs = seg(t, L(9).b - .05, L(9).b + .6); if (rs > 0 && rs < 1) { ctx.globalAlpha = (1 - rs) * ca; ctx.lineWidth = 8 * (1 - rs); ctx.beginPath(); ctx.arc(540, 1230, 90 + rs * 260, 0, TAU); ctx.stroke(); }
  var r = rng(19); ctx.globalAlpha = 1; for (var j = 0; j < 120; j++) { var x = r() * W, y0 = r() * H, sp = 25 + r() * 70, y = ((y0 - t * sp) % H + H) % H; spot(GL_LIME, x, y, 3 + r() * 5, .4 * ca * (.5 + .5 * Math.sin(t * 2 + j))); }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
var DRAW = [draw1, draw2, draw3, draw4, draw5, draw6, draw7, draw8, draw9], DOMS = [null, null, 'sc3', 'sc4', 'sc5', null, 'sc7', null, 'sc9'];

// ---------- scene states: alpha/scale/origin for the entry and exit of each scene (match moves, no wipes)
function states(t) {
  var out = [];
  for (var i = 0; i < 9; i++) { var a = sa(i), b = sb(i), wi = i > 0 ? TW[i - 1] : 0, wo = i < 8 ? TW[i] : 0; if (t < a - wi / 2 || t > b + wo / 2) continue;
    var al = 1, sc = 1, o = [540, 900];
    if (i > 0 && t < a + wi / 2) { var e = eio(seg(t, a - wi / 2, a + wi / 2)), k = TK[i - 1]; o = ORG[i - 1]; al = e; sc = k === 'push' ? .74 + .26 * e : k === 'pull' ? 1.55 - .55 * e : 1.02 - .02 * e; }
    if (i < 8 && t > b - wo / 2) { var e2 = eio(seg(t, b - wo / 2, b + wo / 2)), k2 = TK[i]; o = ORG[i]; al *= 1 - e2; sc *= k2 === 'push' ? 1 + 1.25 * e2 : k2 === 'pull' ? 1 - .3 * e2 : 1; }
    out.push({ i: i, al: al, sc: sc, o: o }); }
  return out;
}
function glp(i, t) {
  var sway = [Math.sin(t * .7) * .55, Math.cos(t * .55) * .3];
  if (i === 0) return { cam: [sway[0], sway[1], 1 + .03 * t / 5], dof: .028, focus: dep(focus1(t)), dim: 1, par: .05 };
  if (i === 1) return { cam: [sway[0], sway[1], 1.04], dof: .025, focus: .55, dim: .9, par: .05 };
  if (i === 2) return { cam: [sway[0], sway[1], 1.12], dof: .02, focus: .5, dim: .6, par: .04 };
  if (i === 3) { var u = t - sa(3); return { cam: [sway[0], sway[1], 1 + .06 * seg(u, 0, 3)], dof: .03, focus: dep(15), dim: .8, par: .05 }; }
  return { cam: [0, 0, 1], dof: 0, focus: .5, dim: 1, par: .01 };
}
function seekAll(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); var st = states(t), o = { t: t, bloom: 1.0, streak: 0, flash: 0, vig: 1, ca: .005 };
  var rec = {}; st.forEach(function (s) { rec[s.i] = s; });
  DOMS.forEach(function (id, i) { if (id && !rec[i]) $(id).style.display = 'none'; });
  st.forEach(function (s) { var i = s.i; ctx.save(); ctx.translate(s.o[0], s.o[1]); ctx.scale(s.sc, s.sc); ctx.translate(-s.o[0], -s.o[1]); ctx.__sa = s.al; DRAW[i](t, 1); ctx.restore(); ctx.globalAlpha = 1;
    if (DOMS[i]) { var e = $(DOMS[i]); e.style.display = 'block'; e.style.transformOrigin = s.o[0] + 'px ' + s.o[1] + 'px'; e.style.transform = 'scale(' + s.sc + ')'; e.style.opacity = 1; } });
  // GL: plate pair from the active boundary, if any
  var k = -1; for (var j = 0; j < 8; j++) if (t >= BD[j] - TW[j] / 2 && t <= BD[j] + TW[j] / 2) k = j;
  if (k >= 0) { var u = seg(t, BD[k] - TW[k] / 2, BD[k] + TW[k] / 2), e = eio(u), ga = glp(k, t), gb = glp(k + 1, t), kind = TK[k], zA = 1 + ((kind === 'push' ? 1 + 1.25 * e : kind === 'pull' ? 1 - .3 * e : 1) - 1) * .3, zB = 1 + ((kind === 'push' ? .74 + .26 * e : kind === 'pull' ? 1.55 - .55 * e : 1) - 1) * .3;
    o.a = PLATE[k]; o.camA = [ga.cam[0], ga.cam[1], ga.cam[2] * zA]; o.par = lerp(ga.par, gb.par, e); o.dof = lerp(ga.dof, gb.dof, e); o.focus = lerp(ga.focus, gb.focus, e); o.dim = lerp(ga.dim, gb.dim, e);
    if (PLATE[k] !== PLATE[k + 1]) { o.b = PLATE[k + 1]; o.camB = [gb.cam[0], gb.cam[1], gb.cam[2] * zB]; o.mix = e; } else { o.camA[2] = lerp(ga.cam[2] * zA, gb.cam[2] * zB, e); }
    var f = Math.sin(Math.PI * u); if (kind === 'push') { o.flash = .2 * f; o.streak = .7 * f; } else if (kind === 'pull') { o.flash = .08 * f; o.streak = .3 * f; }
  } else { var si = st.length ? st[st.length - 1].i : 0; for (var q = 0; q < st.length; q++) if (st[q].al >= .99) si = st[q].i; var g = glp(si, t); o.a = PLATE[si]; o.camA = g.cam; o.par = g.par; o.dof = g.dof; o.focus = g.focus; o.dim = g.dim; }
  // renewal wave through the gut (depth band), and the crossing flash
  if (t >= sa(3) && t <= sb(3) + .5) { var wv = eio(seg(t, wt(4, 3) - .2, sb(3) - .1)); o.wave = [lerp(.04, .96, wv), .05, .85 * (1 - seg(t, sb(3) - .35, sb(3) + .3))]; }
  var cr = Math.max(0, 1 - Math.abs(t - TC) / .25); o.flash += .16 * cr; o.streak += .9 * cr; o.bloom = 1 + (t > sa(4) ? .5 : 0) + .4 * cr;
  if (t > DUR - .45) { /* loop seam: cross-fade the last frames toward frame 0 */ }
  o.spr = fx; window.GLP.draw(o); counter(t); captions(t);
}

// ---------- events for the audio mix (times derive from the voice)
(function () { BD.forEach(function (b, i) { ev(b, 'tr_' + TK[i]); }); ev(sa(1), 'spark'); ev(wt(3, 2) - .2, 'ring'); ev(L(3).b - .05, 'swap'); ev(wt(4, 3) - .2, 'gutwave'); ev(wt(4, 3), 'stamp35');
  var f0 = wt(5, 4) - .35, f1 = wt(5, 6) - .05; for (var i = 1; i <= 7; i++) ev(f0 + (f1 - f0) * (i - 1) / 6, 'flip'); ev(wt(5, 6) - .15, 'wave5'); ev(sb(4) + .05, 'strike'); ev(sa(5) + .1, 'neuron'); ev(wt(7, 0) - .05, 'plane'); ev(wt(7, 5) - .05, 'bubble'); ev(TC - 1.1, 'burst'); ev(TC, 'cross'); ev(L(9).a - .1, 'follow'); ev(L(9).b, 'press');
  for (var m = 1; m * 10e6 / RATE < DUR - 1; m++) ev(m * 10e6 / RATE, 'mil'); })();

var vids = { dust: $('dust'), grain: $('grain') };
function vseek(v, t) { return new Promise(function (res) { if (!v.duration) return res(); function done() { v.removeEventListener('seeked', done); res(); } v.addEventListener('seeked', done); v.currentTime = t % v.duration; setTimeout(res, 400); }); }
window.__seek = function (t) { t = clamp(t, 0, DUR - 1e-3); seekAll(t); return Promise.all([vseek(vids.dust, t), vseek(vids.grain, t)]); };
Promise.all([document.fonts.load('400 100px Frag'), document.fonts.load('700 100px Fam'), document.fonts.load('600 40px Fam'), document.fonts.load('700 40px InterX'), window.GLP.load(['plasma', 'marrow', 'gut_bg', 'void'])].concat([0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return loadImg('plates/rbc_' + i + '.png'); }))).then(function (r) {
  var imgs = r.slice(5); if (imgs.every(Boolean)) buildSprites(imgs); else console.log('sprites missing'); buildBody();
  return new Promise(function (res) { var n = 0; ['dust', 'grain'].forEach(function (k) { var v = vids[k]; if (v.readyState >= 2) { if (++n === 2) res(); } else v.addEventListener('loadeddata', function () { if (++n === 2) res(); }); }); });
}).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
})();
