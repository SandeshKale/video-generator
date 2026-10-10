(function () {
'use strict';
function slotY(i) { return 212 + i * 66; }
var NS = 'http://www.w3.org/2000/svg', DUR = 8;
var BG = '#f5efe6', INK = '#1d2530', RASP = '#c2185b', SAF = '#f0a500', SLATE = '#35557a', SAGE = '#6f9a74', CARD = '#fffdf9', MUTE = '#4a5563';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return sm((t - a) / (b - a)); }
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { return E('text', { x: x, y: y, fill: fill, 'font-family': font || 'Inter', 'font-weight': wt || 600, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); }
function ICON(par, name, x, y, s, col) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')', fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = window.ICONS[name] || ''; return g; }
function card(par, x, y, w, h, fill, r, sh) { if (sh !== 0) E('rect', { x: x + 5, y: y + 5, width: w, height: h, rx: r, fill: INK }, par); return E('rect', { x: x, y: y, width: w, height: h, rx: r, fill: fill || CARD, stroke: INK, 'stroke-width': 2.5 }, par); }
function tag(par, x, y, w, label, fill, col) { var g = E('g', {}, par); E('rect', { x: x, y: y, width: w, height: 28, rx: 7, fill: fill }, g); T(g, x + w / 2, y + 21, label, 17, col || '#fff', 'JB', 700, 'middle'); return g; }

E('rect', { width: 1600, height: 900, fill: BG });
var dfs = E('defs', {}), pat = E('pattern', { id: 'dots', width: 36, height: 36, patternUnits: 'userSpaceOnUse' }, dfs); E('circle', { cx: 18, cy: 18, r: 1.5, fill: '#e2dacd' }, pat);
E('rect', { width: 1600, height: 752, fill: 'url(#dots)' });
var W = E('g', { transform: 'translate(0,-122)' });          // diagram group (everything above the banner)

// ---------- static scaffolding ----------
function step(n, x, y, label, col) { var g = E('g', {}, W); E('circle', { cx: x + 17, cy: y + 17, r: 17, fill: col || INK }, g); T(g, x + 17, y + 24, String(n), 19, BG, 'Sora', 800, 'middle'); T(g, x + 44, y + 24, label, 20, col || INK, 'JB', 700, 'start', 1.6); }
step(1, 60, 168, 'RETAIN'); step(2, 360, 168, 'MEMORY BANK'); step(3, 680, 168, 'RECALL · 4 RETRIEVERS IN PARALLEL'); step(4, 1250, 168, 'ONE RANKED CONTEXT'); step(5, 680, 818, 'REFLECT · new facts rewrite the mental models', RASP);

// bank drawers
var DR = [['World facts', ['what is true'], 'database', SAGE, '#fff'], ['Experiences', ['what happened,', 'when'], 'clock', SLATE, '#fff'], ['Observations', ['beliefs with', 'evidence'], 'layers-intersect', SAF, INK], ['Mental models', ['standing answers,', 'rewritten'], 'brain', RASP, '#fff']];
var drawerGlow = [];
DR.forEach(function (d, i) { var y = 212 + i * 112; card(W, 360, y, 280, 100, CARD, 14);
  E('rect', { x: 376, y: y + 25, width: 50, height: 50, rx: 12, fill: d[3] }, W); ICON(W, d[2], 386, y + 35, 1.25, d[4]);
  T(W, 444, y + 38, d[0], 23, INK, 'Sora', 700); d[1].forEach(function (l, k) { T(W, 444, y + 64 + k * 21, l, 18, MUTE, 'Inter', 500); });
  drawerGlow.push(E('rect', { x: 357, y: y - 3, width: 286, height: 106, rx: 16, fill: 'none', stroke: i === 3 ? RASP : i === 0 ? SAGE : i === 1 ? SLATE : SAF, 'stroke-width': 6, opacity: 0 }, W)); });
T(W, 360, 686, 'One isolated bank per', 18, MUTE, 'Inter', 600); T(W, 360, 709, 'user, agent or project.', 18, MUTE, 'Inter', 600);

// retain column
var bu = E('g', {}, W); card(bu, 60, 212, 270, 126, '#fff', 14); tag(bu, 76, 224, 52, 'user', SLATE);
['I moved to Pune in March', "and I'm allergic to", 'peanuts.'].forEach(function (l, i) { T(bu, 76, 276 + i * 24, l, 19, INK, 'Inter', 600); });
var ba = E('g', {}, W); card(ba, 60, 346, 270, 104, INK, 14); tag(ba, 76, 358, 60, 'agent', RASP);
['Noted. Want Pune-based', 'vegetarian places?'].forEach(function (l, i) { T(ba, 76, 408 + i * 24, l, 19, BG, 'Inter', 600); });
var typing = E('g', {}, W); [0, 1, 2].forEach(function (i) { E('circle', { cx: 100 + i * 20, cy: 398, r: 5, fill: BG }, typing); });
card(W, 60, 476, 270, 196, CARD, 18); T(W, 80, 515, 'LLM extractor', 21, INK, 'Sora', 700);
var ex = [['fact', 56, SAGE, '#fff', 'allergic: peanuts'], ['entity', 76, SLATE, '#fff', 'Pune'], ['time', 56, SAF, INK, 'moved · March']].map(function (r, i) {
  var g = E('g', {}, W), y = 538 + i * 39; tag(g, 80, y, r[1], r[0], r[2], r[3]); T(g, 80 + r[1] + 10, y + 21, r[4], 19, INK, 'Inter', 600); return g; });
['Why it is not RAG: RAG', 'fetches text. This layer', 'extracts, links, ranks and', 'keeps learning.'].forEach(function (l, i) { T(W, 60, 716 + i * 25, l, 20, '#3a4552', 'Inter', 600); });
var conA = E('path', { d: 'M330 398 H358', stroke: INK, 'stroke-width': 4 }, W), conB = E('path', { d: 'M330 600 H358', stroke: INK, 'stroke-width': 4 }, W);
var pk1 = E('circle', { r: 7, fill: SAGE, cx: 330, cy: 600, opacity: 0 }, W), pk2 = E('circle', { r: 7, fill: SLATE, cx: 330, cy: 398, opacity: 0 }, W);

// lanes
var LANES = [['Semantic', 'vector similarity', 'search', RASP, ['#1', '#4', '#9']], ['Keyword', 'BM25 exact terms', 'hash', SAF, ['#2', '#3', '#7']], ['Graph', 'entities & links', 'layers-intersect', SLATE, ['#1', '#2', '#6']], ['Temporal', 'time phrases', 'clock', SAGE, ['#3', '#5', '#8']]];
var laneObj = [];
LANES.forEach(function (L, i) { var y = 212 + i * 88, col = L[3];
  var cp = E('clipPath', { id: 'lc' + i }, dfs); E('rect', { x: 680, y: y, width: 520, height: 74, rx: 14 }, cp);
  E('rect', { x: 680, y: y, width: 520, height: 74, rx: 14, fill: CARD, stroke: col, 'stroke-width': 2.5 }, W);
  var hd = E('g', { 'clip-path': 'url(#lc' + i + ')' }, W); E('rect', { x: 680, y: y, width: 64, height: 74, fill: col }, hd);
  ICON(W, L[2], 695, y + 20, 1.42, i === 1 ? INK : '#fff'); T(W, 756, y + 34, L[0], 22, INK, 'Sora', 700); T(W, 756, y + 57, L[1], 18, MUTE, 'Inter', 500);
  var sweep = E('rect', { x: 680, y: y, width: 90, height: 74, fill: col, opacity: 0.18, 'clip-path': 'url(#lc' + i + ')' }, W);
  var chips = L[4].map(function (r, k) { var g = E('g', {}, W), cx = 942 + k * 64; E('rect', { x: cx, y: y + 19, width: 56, height: 34, rx: 9, fill: '#fff', stroke: col, 'stroke-width': 2.5 }, g); T(g, cx + 28, y + 43, r, 19, col, 'JB', 700, 'middle'); g.__cx = cx + 28; return g; });
  var ring = E('circle', { cx: 1152, cy: y + 37, r: 16, fill: col, opacity: 0.15 }, W), dot = E('circle', { cx: 1152, cy: y + 37, r: 10, fill: col }, W);
  laneObj.push({ y: y, sweep: sweep, chips: chips, ring: ring, dot: dot, col: col }); });

// RRF panel
card(W, 680, 580, 520, 128, CARD, 18); T(W, 704, 616, 'RRF + cross-encoder rerank', 21, INK, 'Sora', 700);
['Four ranked lists become one.', 'Items several retrievers agree', 'on rise to the top.'].forEach(function (l, i) { T(W, 704, 650 + i * 24, l, 19, '#3a4552', 'Inter', 500); });
var bars = [RASP, SAF, SLATE, SAGE].map(function (c) { return E('rect', { width: 18, rx: 4, fill: c }, W); }); var fbar = E('rect', { width: 26, rx: 5, fill: INK, opacity: 0 }, W);
var barArrow = E('path', { d: 'M1000 650 H1020', stroke: INK, 'stroke-width': 3, opacity: 0.4 }, W);

// fused column
var ITEMS = ['peanut allergy', 'lives in Pune', 'moved · March', 'likes vegetarian', '…'];
[0,1,2,3,4].forEach(function (i) { E('rect', { x: 1250, y: slotY(i), width: 310, height: 54, rx: 12, fill: 'none', stroke: '#b9b0a2', 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, W); });
var fused = ITEMS.map(function (s, i) { var g = E('g', {}, W); card(g, 1250, 0, 310, 54, '#fff', 12); E('rect', { x: 1262, y: 14, width: 26, height: 26, rx: 7, fill: INK }, g); T(g, 1275, 33, String(i + 1), 19, BG, 'JB', 700, 'middle'); T(g, 1302, 34, s, 21, INK, 'Sora', 700); return g; });
var fnum = fused.map(function (g) { return g.childNodes[3]; });
T(W, 1250, 580, 'Trimmed to a token budget:', 20, '#3a4552', 'Inter', 600);
E('rect', { x: 1250, y: 592, width: 310, height: 34, rx: 10, fill: '#fff', stroke: INK, 'stroke-width': 2.5 }, W);
var gauge = E('rect', { x: 1252.5, y: 594.5, width: 0, height: 29, rx: 8, fill: SAF }, W);
var ctx = E('g', {}, W); card(ctx, 1250, 650, 310, 86, INK, 18, 0); var spark = ICON(ctx, 'sparkles', 1272, 672, 1.8, SAF); T(ctx, 1332, 690, 'Prompt context', 22, BG, 'Sora', 700); T(ctx, 1332, 714, '→ the LLM answers', 18, '#d6cfc3', 'Inter', 500);
var connF = [0, 1, 2, 3].map(function (i) { return E('path', { d: 'M1202 ' + (249 + i * 88) + ' H1248', stroke: INK, 'stroke-width': 3 }, W); });
var flyers = []; LANES.forEach(function (L, i) { for (var k = 0; k < 3; k++) flyers.push(E('circle', { r: 7, fill: L[3], opacity: 0 }, W)); });

// reflect loop
var PATH = [[1405, 740], [1405, 800], [620, 800], [620, 652]], PL = [60, 785, 148], PT = 993;
E('path', { d: 'M1405 740 V800 H620 V652', fill: 'none', stroke: RASP, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '3 12' }, W);
E('path', { d: 'M612 664 l8 -14 l8 14', fill: 'none', stroke: RASP, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, W);
function onPath(s) { s = clamp(s, 0, 1) * PT; for (var i = 0; i < 3; i++) { if (s <= PL[i]) { var f = s / PL[i]; return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * f, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * f]; } s -= PL[i]; } return PATH[3]; }
var rdots = [0, 1].map(function () { return E('circle', { r: 8, fill: RASP }, W); });

// ---------- footer banner (outside the shifted group) ----------
E('rect', { x: 0, y: 752, width: 1600, height: 148, fill: INK }); E('rect', { x: 0, y: 752, width: 1600, height: 6, fill: RASP });
var h = T(svg, 60, 828, 'Agent memory is ', 62, BG, 'Sora', 800); h.setAttribute('letter-spacing', -1.8); var ts = E('tspan', { fill: '#ff5c93' }, h, 'not'); E('tspan', { fill: BG }, h, ' RAG');
T(svg, 62, 872, 'Retain → Recall → Reflect · open-source Hindsight project', 22, '#d6cfc3', 'Inter', 600);
[[1192, 783, 140, 'MIT', 1], [1345, 783, 195, '47.7k ★', 1], [1192, 838, 348, '4 retrievers · in parallel', 0]].forEach(function (c) { E('rect', { x: c[0], y: c[1], width: c[2], height: 46, rx: 10, fill: c[4] ? BG : 'none', stroke: BG, 'stroke-width': 2 }); T(svg, c[0] + c[2] / 2, c[1] + 31, c[3], 20, c[4] ? INK : BG, 'JB', 700, 'middle'); });

// ---------- animation (pure function of t) ----------
function setOp(e, o) { e.setAttribute('opacity', o); }
function moveG(e, x, y, s) { e.setAttribute('transform', 'translate(' + x + ',' + y + ')' + (s != null && s !== 1 ? ' scale(' + s + ')' : '')); }
window.__reelDurationSec = DUR;
window.__seek = function (t) {
  t = ((t % DUR) + DUR) % DUR;
  var done = (t < 0.5 || t >= 7.6), tau = done ? 1e3 : Math.max(0, t - 0.8), g = t < 0.5 ? 1 : t < 0.8 ? 1 - sm((t - 0.5) / 0.3) : 1;   // g: reset fade
  // chat
  var a = seg(tau, 0, 0.5); bu.setAttribute('transform', 'translate(0,' + (-16 * (1 - a)) + ')'); setOp(bu, a * g);
  var tp = seg(tau, 0.45, 0.6) * (1 - seg(tau, 1.1, 1.25)); setOp(typing, tp * g); typing.childNodes.forEach(function (c, i) { c.setAttribute('cy', 398 - 4 * Math.sin(t * 9 + i * 1.2)); });
  var b2 = seg(tau, 1.0, 1.5); ba.setAttribute('transform', 'translate(0,' + (-16 * (1 - b2)) + ')'); setOp(ba, b2 * g);
  ex.forEach(function (e, i) { var p = seg(tau, 1.5 + i * 0.3, 1.8 + i * 0.3); var s = 0.9 + 0.1 * p + 0.08 * Math.sin(p * Math.PI); e.setAttribute('transform', 'translate(' + (80 * (1 - s)) + ',' + (((538 + i * 39) + 14) * (1 - s)) + ') scale(' + s + ')'); setOp(e, p * g); });
  // packets into the bank
  var q = seg(tau, 2.5, 3.0); [[pk1, 330, 358, 600], [pk2, 330, 358, 398]].forEach(function (k) { k[0].setAttribute('cx', k[1] + (k[2] - k[1]) * q); setOp(k[0], (q > 0 && q < 1 ? 1 : 0) * g); });
  var gl = [seg(tau, 2.8, 3.0) * (1 - seg(tau, 3.4, 3.8)), seg(tau, 3.0, 3.2) * (1 - seg(tau, 3.6, 4.0)), 0, seg(tau, 6.1, 6.4)];
  gl[0] = done ? 0 : gl[0]; gl[1] = done ? 0 : gl[1]; gl[3] = done ? 1 : gl[3];
  drawerGlow.forEach(function (e, i) { setOp(e, gl[i] * (i === 3 ? (0.6 + 0.4 * Math.sin(t * 5)) : 1) * g); });
  // lanes: sweep, chips, dot
  var CP = [];
  laneObj.forEach(function (L, i) { var s0 = 3.4 + i * 0.14, p = seg(tau, s0, s0 + 1.3), x = 680 + p * 430; L.sweep.setAttribute('x', x - 60); setOp(L.sweep, 0.2 * (p > 0 && p < 1 ? 1 : 0) * g);
    L.chips.forEach(function (c, k) { var pk = clamp((c.__cx - 700) / 430, 0, 1), cp = seg(tau, s0 + 1.3 * pk, s0 + 1.3 * pk + 0.25), s = 0.85 + 0.15 * cp + 0.1 * Math.sin(cp * Math.PI), cx = c.__cx, cy = L.y + 36;
      c.setAttribute('transform', 'translate(' + (cx * (1 - s)) + ',' + (cy * (1 - s)) + ') scale(' + s + ')'); setOp(c, cp * g); });
    var ap = seg(tau, s0 + 1.2, s0 + 1.5); setOp(L.dot, ap * g); L.ring.setAttribute('r', 14 + 4 * Math.sin(t * 5 + i)); setOp(L.ring, 0.2 * ap * g); });
  // flyers to the fused column
  flyers.forEach(function (f, n) { var lane = Math.floor(n / 3), k = n % 3, s0 = 5.0 + lane * 0.1 + k * 0.12, p = seg(tau, s0, s0 + 0.7), tx = 1250, ty = slotY(k + (lane % 2)) + 27, y0 = laneObj[lane].y + 37;
    f.setAttribute('cx', 1152 + (tx - 1152) * p); f.setAttribute('cy', y0 + (ty - y0) * p - 18 * Math.sin(p * Math.PI)); setOp(f, (p > 0 && p < 1 ? 1 : 0) * g); });
  // rrf bars: spread -> merge
  var wob = function (i) { return 40 + 22 * Math.sin(t * 3 + i * 1.7); }, mg = seg(tau, 5.0, 5.8), fh = seg(tau, 5.6, 6.0);
  bars.forEach(function (b, i) { var hgt = wob(i) * (1 - 0.0 * mg), x = 1040 + i * 28 + (1090 - (1040 + i * 28)) * mg; b.setAttribute('x', x); b.setAttribute('height', hgt); b.setAttribute('y', 692 - hgt); setOp(b, (1 - fh) * g); });
  fbar.setAttribute('x', 1085); fbar.setAttribute('height', 74 + 4 * Math.sin(t * 3)); fbar.setAttribute('y', 692 - (74 + 4 * Math.sin(t * 3))); setOp(fbar, fh * g); setOp(barArrow, 0);
  // fused list: appear shuffled, then re-rank
  var ap2 = seg(tau, 5.0, 5.5), rr = seg(tau, 5.9, 6.5), start = [3, 2, 1, 0, 4];
  fused.forEach(function (gg, i) { var slot = start[i] + (i - start[i]) * rr; gg.setAttribute('transform', 'translate(0,' + slotY(slot) + ')'); setOp(gg, ap2 * g * (i === 3 ? 1 - 0.4 * rr : i === 4 ? 1 - 0.65 * rr : 1)); });
  connF.forEach(function (c, i) { setOp(c, 1); });
  // gauge, context, spark
  gauge.setAttribute('width', 305 * 0.72 * seg(tau, 6.0, 6.6)); var cp2 = seg(tau, 6.4, 6.6), pulse = 1 + 0.04 * Math.sin(Math.min(1, (tau - 6.4) / 0.4) * Math.PI) * (done ? 0 : 1);
  ctx.setAttribute('transform', 'translate(' + (1405 * (1 - pulse)) + ',' + (693 * (1 - pulse)) + ') scale(' + pulse + ')'); spark.setAttribute('transform', 'translate(1272,672) scale(1.8) rotate(' + (10 * Math.sin(t * 2)) + ' 12 12)');
  // reflect loop: continuous
  rdots.forEach(function (d, i) { var s = ((t / 4) + i * 0.5) % 1, p = onPath(s); d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]); setOp(d, 0.35 + 0.65 * Math.sin(s * Math.PI)); });
};
window.__seek(0);
})();
