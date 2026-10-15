// "Everyone got the same AI. Only some teams lit up." Gallup, "Employee Engagement Remains Flat as AI Adoption Accelerates" (J. Harter,
// 21 Jul 2026; 43,262 US workers). Three identical towers, one window = 1 in 100 employees, lit = engaged. Tower A: manager does not back
// AI use (30% engaged). Tower B: manager actively backs it (48%). Tower C: frequent use + clear plan + manager (53%). A breaker panel of
// three switches shows what each lever is worth on its own (+18 / +15 / +8 points: separate comparisons, not additive).
// 1080x1350, 12 s loop, pure function of t (frame 0 is offset to mid-action).
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 12, OFF = 5;
var BG = '#ebe8ff', PANEL = '#f7f5ff', INK = '#14122b', DIM = '#2b2860', BLUE = '#2b3bff', LIME = '#c8ff3a', CORAL = '#ff5a4f', MUTE = '#5b5885', OFFC = '#cfcaf2', WHITE = '#ffffff';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; }
function mod(a, n) { return ((a % n) + n) % n; }
function back(x) { x = clamp(x, 0, 1); var c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { return E('text', { x: x, y: y, fill: fill, 'font-family': font || 'IN', 'font-weight': wt || 600, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); }
function R(par, x, y, w, h, at) { var a = { x: x, y: y, width: w, height: h, rx: 12 }; for (var k in at) a[k] = at[k]; return E('rect', a, par); }
function card(x, y, w, h, fill, rx) { R(svg, x + 8, y + 8, w, h, { fill: INK, rx: rx || 24 }); return R(svg, x, y, w, h, { fill: fill, stroke: INK, 'stroke-width': 4, rx: rx || 24 }); }

// ---------- static frame ----------
E('rect', { width: 1080, height: 1350, fill: BG });
var hl1 = T(svg, 36, 78, 'Everyone got the same AI.', 60, INK, 'AB', 400, 'start', -1.5);
var hl2 = T(svg, 36, 142, '', 60, INK, 'AB', 400, 'start', -1.5); E('tspan', { fill: BLUE }, hl2, 'Only some teams lit up.');
T(svg, 38, 180, 'GALLUP · 43,262 US WORKERS · JULY 2026 · 1 WINDOW = 1 IN 100 EMPLOYEES', 17, MUTE, 'MM', 500, 'start', .2);

// stage panel
card(24, 204, 1032, 648, PANEL, 28);
var defs = E('defs', {}); var sc = E('clipPath', { id: 'stg' }, defs); R(sc, 28, 208, 1024, 640, { rx: 24 });
var stage = E('g', { 'clip-path': 'url(#stg)' });
// clouds (drawn first, behind everything)
var clouds = [[150, 330, 1], [620, 300, .8], [930, 360, .9]].map(function (c, i) { var g = E('g', {}, stage); R(g, -46 * c[2], -14 * c[2], 92 * c[2], 28 * c[2], { fill: WHITE, rx: 14 * c[2] }); R(g, -26 * c[2], -30 * c[2], 54 * c[2], 30 * c[2], { fill: WHITE, rx: 15 * c[2] }); return { g: g, x: c[0], y: c[1], ph: i * 2.1 }; });

var CX = [190, 540, 890], TW = 300, GRID = 10, CELL = 26;
var TOW = [
  { lab: 'MANAGER DOES NOT', lab2: 'BACK AI USE', val: 30, fill: '#e7e4ff', tc: INK, t0: .2, t1: 2.4 },
  { lab: 'MANAGER ACTIVELY', lab2: 'BACKS AI USE', val: 48, fill: BLUE, tc: WHITE, t0: 2.9, t1: 4.9 },
  { lab: 'FREQUENT USE + CLEAR', lab2: 'PLAN + MANAGER', val: 53, fill: LIME, tc: INK, t0: 5.3, t1: 7.4 }
];
TOW.forEach(function (w, i) {
  var cx = CX[i], g = E('g', {}, stage);
  w.cx = cx;
  // label card
  R(g, cx - 160 + 6, 222 + 6, 320, 74, { fill: INK, rx: 18 }); R(g, cx - 160, 222, 320, 74, { fill: w.fill, stroke: INK, 'stroke-width': 3.5, rx: 18 });
  T(g, cx, 253, w.lab, 21, w.tc, 'IN', 700, 'middle', .2); T(g, cx, 282, w.lab2, 21, w.tc, 'IN', 700, 'middle', .2);
  // big number
  w.num = T(g, cx - 4, 378, '0', 92, INK, 'AB', 400, 'middle', -2); w.pct = T(g, cx + 60, 378, '%', 40, MUTE, 'AB', 400, 'start');
  T(g, cx, 420, 'OF EMPLOYEES ENGAGED', 15, MUTE, 'MM', 500, 'middle', .1);
  // tower
  w.glow = R(g, cx - 160, 452, 320, 346, { fill: 'none', stroke: LIME, 'stroke-width': 7, rx: 10, opacity: 0 });
  E('line', { x1: cx, y1: 446, x2: cx, y2: 466, stroke: INK, 'stroke-width': 4 }, g); w.ant = E('circle', { cx: cx, cy: 440, r: 7, fill: CORAL }, g);
  R(g, cx - 150, 462, 300, 336, { fill: INK, stroke: INK, 'stroke-width': 4, rx: 10 }); R(g, cx - 150, 462, 300, 12, { fill: BLUE, rx: 6 });
  w.sweep = R(g, cx - 150, 790, 300, 8, { fill: LIME, rx: 3, opacity: 0 });
  w.win = []; w.rank = [];
  var ord = []; for (var k = 0; k < 100; k++) ord.push({ k: k, h: hash(k * 3 + i * 101 + 7) }); ord.sort(function (a, b) { return a.h - b.h; }); ord.forEach(function (o, r) { w.rank[o.k] = r; });
  for (var k2 = 0; k2 < 100; k2++) { var wx = cx - 130 + (k2 % 10) * CELL + 3, wy = 484 + Math.floor(k2 / 10) * CELL + 2; w.win.push(R(g, wx, wy, 20, 20, { fill: DIM, rx: 4 })); }
  R(g, cx - 30, 758, 60, 40, { fill: BLUE, rx: 6 }); R(g, cx - 4, 758, 8, 40, { fill: INK, rx: 0 });
});
// street
R(stage, 28, 800, 1024, 48, { fill: '#d9d5fb', rx: 0 }); E('line', { x1: 28, y1: 800, x2: 1052, y2: 800, stroke: INK, 'stroke-width': 4 }, stage);
var dash = E('g', {}, stage); for (var d = 0; d < 28; d++) R(dash, 28 + d * 48, 826, 26, 5, { fill: WHITE, rx: 2 });
var cars = [[0, 1, BLUE, 1], [.37, 1, CORAL, 1], [.68, 2, INK, -1], [.12, 2, LIME, -1]].map(function (c) { var g = E('g', {}, stage); R(g, 0, 0, 56, 18, { fill: c[2], stroke: INK, 'stroke-width': 2.5, rx: 7 }); R(g, 14, -9, 26, 12, { fill: c[2], stroke: INK, 'stroke-width': 2.5, rx: 5 }); E('circle', { cx: 12, cy: 19, r: 5, fill: INK }, g); E('circle', { cx: 44, cy: 19, r: 5, fill: INK }, g); return { g: g, p: c[0], k: c[1], d: c[3] }; });
// confetti
var conf = []; for (var q = 0; q < 46; q++) conf.push({ e: R(stage, 0, 0, 10, 14, { fill: [LIME, BLUE, CORAL, INK][q % 4], rx: 2, opacity: 0 }), a: hash(q + 5) * Math.PI - Math.PI, v: 180 + hash(q + 9) * 320, r: (hash(q + 2) - .5) * 720 });

// ---------- breaker panel ----------
card(24, 874, 1032, 342, WHITE, 28);
T(svg, 56, 914, 'WHAT EACH LEVER IS WORTH', 20, INK, 'MM', 500, 'start', .8); T(svg, 1024, 914, 'POINTS OF ENGAGEMENT', 17, MUTE, 'MM', 500, 'end', .4);
var ROWS = [{ y: 948, s: 'MANAGER BACKS AI USE', v: 18, on: 2.8, note: '48% vs 30%' }, { y: 1016, s: 'CLEAR AI PLAN', v: 15, on: 5.2, note: 'vs none' }, { y: 1084, s: 'USED AT LEAST WEEKLY', v: 8, on: 5.8, note: 'vs less often' }];
ROWS.forEach(function (r) {
  r.track = R(svg, 56, r.y, 80, 42, { fill: OFFC, stroke: INK, 'stroke-width': 3.5, rx: 21 }); r.knob = E('circle', { cx: 77, cy: r.y + 21, r: 15, fill: WHITE, stroke: INK, 'stroke-width': 3.5 });
  T(svg, 156, r.y + 30, r.s, 24, INK, 'IN', 700, 'start', .1);
  R(svg, 540, r.y + 4, 360, 34, { fill: '#ece9ff', stroke: INK, 'stroke-width': 3, rx: 17 }); r.bar = R(svg, 540, r.y + 4, 0, 34, { fill: BLUE, stroke: INK, 'stroke-width': 3, rx: 17 });
  r.val = T(svg, 1024, r.y + 34, '+0', 38, INK, 'AB', 400, 'end', -.5); r.nt = T(svg, 556, r.y + 28, '', 16, WHITE, 'MM', 500, 'start');
});
var pay = E('g', {}); R(pay, 56 + 6, 1136 + 6, 968, 58, { fill: INK, rx: 16 }); var payR = R(pay, 56, 1136, 968, 58, { fill: LIME, stroke: INK, 'stroke-width': 4, rx: 16 });
T(pay, 80, 1176, 'ALL THREE TOGETHER', 26, INK, 'IN', 700, 'start', .3); T(pay, 1002, 1180, '53% ENGAGED', 40, INK, 'AB', 400, 'end', -.5);

// ---------- ticker ----------
R(svg, 24, 1236, 1032, 54, { fill: INK, rx: 14 });
var TK = ['31% OF US EMPLOYEES ENGAGED · FLAT SINCE 2024 · 36% IN 2020', 'AI TOP-RATED FOR PRODUCTIVITY: 9% → 33% WITH A BACKING MANAGER', 'DISENGAGEMENT COSTS ~$2 TRILLION A YEAR (GALLUP ESTIMATE)'], TWID = 880, tick = [];
var tcp = E('clipPath', { id: 'tcl' }, defs); R(tcp, 36, 1236, 1008, 54, { rx: 0 });
var tg = E('g', { 'clip-path': 'url(#tcl)' }); TK.forEach(function (s, i) { var g = E('g', {}, tg); E('circle', { cx: 14, cy: 1263, r: 7, fill: LIME }, g); T(g, 34, 1270, s, 18, WHITE, 'MM', 500, 'start', .1); tick.push(g); });
T(svg, 36, 1314, 'SOURCE: GALLUP, "EMPLOYEE ENGAGEMENT REMAINS FLAT AS AI ADOPTION ACCELERATES", 21 JUL 2026', 15, MUTE, 'MM', 500, 'start', 0);
T(svg, 36, 1334, 'SURVEY DATA, NOT PROOF OF CAUSE · LEVER BARS ARE SEPARATE COMPARISONS, NOT ADDITIVE', 15, MUTE, 'MM', 500, 'start', 0);

// ---------- scene ----------
window.__seek = function (tt) {
  var t = mod(tt + OFF, DUR), fade = 1 - sm(seg(t, 11.3, 11.9));
  // ambient
  clouds.forEach(function (c) { c.g.setAttribute('transform', 'translate(' + (c.x + 46 * Math.sin(2 * Math.PI * t / DUR + c.ph)).toFixed(1) + ',' + c.y + ')'); });
  dash.setAttribute('transform', 'translate(' + (-((t / DUR) * 96)).toFixed(1) + ',0)');
  cars.forEach(function (c) { var u = mod(c.p + c.k * t / DUR, 1); var x = c.d > 0 ? lerp(-80, 1100, u) : lerp(1100, -80, u); c.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + (c.d > 0 ? 806 : 826 - 4) + ')' + (c.d > 0 ? '' : ' translate(56,0) scale(-1,1)')); });
  // towers
  var nAll = [];
  TOW.forEach(function (w, i) {
    var u = sm(seg(t, w.t0, w.t1)), nLit = w.val * u * fade; nAll.push(nLit);
    for (var k = 0; k < 100; k++) { var r = w.rank[k], on = r < nLit, pop = on ? clamp(1 - (nLit - r) / 5, 0, 1) : 0; var el = w.win[k];
      if (on) { var tw = Math.sin(2 * Math.PI * (3 * t / DUR + r / 9)); el.setAttribute('fill', tw > .55 ? '#a6d92a' : LIME); el.setAttribute('opacity', 1); var s = 1 + .28 * pop; el.setAttribute('transform', 'translate(' + (el.getAttribute('x') * 1 + 10) + ',' + (el.getAttribute('y') * 1 + 10) + ') scale(' + s.toFixed(2) + ') translate(' + (-(el.getAttribute('x') * 1 + 10)) + ',' + (-(el.getAttribute('y') * 1 + 10)) + ')'); }
      else { el.setAttribute('fill', DIM); el.setAttribute('opacity', 1); el.removeAttribute('transform'); } }
    w.num.textContent = String(Math.round(nLit)); w.num.setAttribute('x', w.cx - 4 - (Math.round(nLit) >= 10 ? 0 : 0));
    w.pct.setAttribute('x', w.cx + (Math.round(nLit) >= 10 ? 62 : 36));
    var sp = seg(t, w.t0, w.t1); w.sweep.setAttribute('y', (790 - 320 * sp).toFixed(1)); w.sweep.setAttribute('opacity', sp > 0 && sp < 1 ? .85 : 0);
    w.ant.setAttribute('opacity', mod(t * (1 + i * .5), 1) < .5 ? 1 : .25);
    var gl = i === 0 ? 0 : (i === 1 ? seg(t, 2.9, 3.2) * fade : seg(t, 7.3, 7.6) * fade); w.glow.setAttribute('opacity', (gl * (.7 + .3 * Math.sin(2 * Math.PI * 2 * t / DUR))).toFixed(2));
  });
  // levers
  var vals = [];
  ROWS.forEach(function (r) { var k = back(seg(t, r.on, r.on + .5)) * fade + (1 - fade) * 0; var on = t >= r.on && t < 11.3, kx = on ? lerp(77, 115, back(seg(t, r.on, r.on + .35))) : lerp(115, 77, sm(seg(t, 11.3, 11.7)) ); if (t < r.on) kx = 77;
    r.knob.setAttribute('cx', kx.toFixed(1)); r.track.setAttribute('fill', on ? LIME : OFFC);
    var bw = 360 * (r.v / 18) * clamp(sm(seg(t, r.on + .1, r.on + 1.1)), 0, 1) * (t < 11.3 ? 1 : fade); r.bar.setAttribute('width', Math.max(0, bw).toFixed(1)); r.bar.setAttribute('opacity', bw > 2 ? 1 : 0);
    var vv = Math.round(r.v * sm(seg(t, r.on + .1, r.on + 1.1)) * (t < 11.3 ? 1 : fade)); r.val.textContent = '+' + vv; r.nt.textContent = bw > 330 ? r.note : '';
  });
  // payoff + confetti
  var pk = back(seg(t, 7.3, 7.8)) * fade; pay.setAttribute('opacity', clamp(pk * 2, 0, 1).toFixed(2)); pay.setAttribute('transform', 'translate(' + (540 * (1 - lerp(.85, 1, pk))).toFixed(1) + ',' + (1165 * (1 - lerp(.85, 1, pk))).toFixed(1) + ') scale(' + lerp(.85, 1, pk).toFixed(3) + ')');
  var cb = t - 7.35; conf.forEach(function (c) { var tt2 = cb; if (tt2 < 0 || tt2 > 1.5) { c.e.setAttribute('opacity', 0); return; } var x = CX[2] + Math.cos(c.a) * c.v * tt2, y = 440 + Math.sin(c.a) * c.v * tt2 + 380 * tt2 * tt2; c.e.setAttribute('opacity', (1 - tt2 / 1.5).toFixed(2)); c.e.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + (c.r * tt2).toFixed(0) + ')'); });
  // ticker
  var off = (t / DUR) * TWID * TK.length; tick.forEach(function (g, i) { var x = mod(40 + i * TWID - off + TWID, TWID * TK.length) - TWID; g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',0)'); });
};
window.__reelDurationSec = DUR; window.__ready = false; window.__seek(0);
Promise.all([document.fonts.load('400 40px AB'), document.fonts.load('500 20px MM'), document.fonts.load('600 20px IN'), document.fonts.load('700 20px IN')]).catch(function () {}).then(function () { window.__seek(0); window.__ready = true; });
})();
