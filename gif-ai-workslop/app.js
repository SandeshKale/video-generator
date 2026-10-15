// "Workslop": polished AI work that someone else has to fix, drawn as a customs inspection desk. 1600×900, 12 s loop.
// Documents arrive on three belts (peer / your report / your boss), the lens opens each one, 2 of every 12 are hollow, hollow ones ride a
// rework chute to your bench where the clock starts, and the day bar and bill fill up. Figures: BetterUp Labs + Stanford Social Media
// Lab study (1,150 US workers, HBR Sept 2025): 15.4% of work received, nearly 2 h to fix each, $186 per employee per month, senders
// 40% peer / 18% report-to-manager / 16% manager-to-report. Documents, timings and the 2-of-12 ratio are schematic.
// window.__seek(t) is a pure function of t (frame 0 is offset to mid-action).
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 12, OFF = 4.5;
var BG = '#f6efe0', PAPER = '#fffaf0', INK = '#1b2a33', TEAL = '#0f6e6e', TEALL = '#cfe6e1', TOM = '#e5482f', GOLD = '#f2a81d', LINE = '#d8ccb4', MUTE = '#6f6450', BELT = '#23424a';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; }
function mod(a, n) { return ((a % n) + n) % n; }
function back(x) { x = clamp(x, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { return E('text', { x: x, y: y, fill: fill, 'font-family': font || 'IN', 'font-weight': wt || 600, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); }
function ICON(par, name, x, y, s, col, sw) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')', fill: 'none', stroke: col, 'stroke-width': sw || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = window.ICONS[name]; return g; }
function R(par, x, y, w, h, at) { var a = { x: x, y: y, width: w, height: h, rx: 12 }; for (var k in at) a[k] = at[k]; return E('rect', a, par); }
function NB(n, x, y) { var g = E('g', {}); E('circle', { cx: x, cy: y, r: 17, fill: GOLD, stroke: INK, 'stroke-width': 2.5 }, g); T(g, x, y + 7, String(n), 21, INK, 'FR', 900, 'middle'); return g; }
function panel(x, y, w, h) { return R(svg, x, y, w, h, { fill: PAPER, stroke: INK, 'stroke-width': 2.5, rx: 16 }); }

// ---------- static frame ----------
E('rect', { width: 1600, height: 900, fill: BG });
var df = E('defs', {});
var tl = T(svg, 30, 66, 'Someone sent you workslop. ', 48, INK, 'FR', 900, 'start', -1); E('tspan', { fill: TOM }, tl, "Now it's your job.");
T(svg, 30, 100, 'BETTERUP LABS + STANFORD SOCIAL MEDIA LAB · 1,150 US FULL-TIME WORKERS · HBR, SEPT 2025', 18, MUTE, 'PM', 600, 'start', .4);
panel(30, 124, 440, 442); panel(490, 124, 520, 442); panel(1030, 124, 540, 442); panel(30, 586, 740, 200); panel(790, 586, 780, 200);
T(svg, 56, 156, 'HOW IT ARRIVES', 19, TEAL, 'PM', 600, 'start', 1.2); T(svg, 516, 156, 'OPEN IT', 19, TEAL, 'PM', 600, 'start', 1.2); T(svg, 1056, 156, 'THEN YOU FIX IT', 19, TEAL, 'PM', 600, 'start', 1.2);
T(svg, 56, 618, 'WHO SENDS IT · SHARE OF WORKSLOP RECEIVED', 18, TEAL, 'PM', 600, 'start', 1); T(svg, 816, 618, 'YOUR 8-HOUR DAY · 2 OF THESE 12 DOCS ARE HOLLOW', 18, TEAL, 'PM', 600, 'start', 1);
NB(1, 30, 126); NB(2, 490, 126); NB(3, 1030, 126); NB(4, 30, 588); NB(5, 790, 588);

// ---------- 1: three belts ----------
var LANES = [{ y: 232, ic: 'users', s: 'FROM A PEER', p: '40%' }, { y: 360, ic: 'arrow-up', s: 'FROM YOUR REPORT', p: '18%' }, { y: 488, ic: 'arrow-down', s: 'FROM YOUR BOSS', p: '16%' }];
var ticks = [];
LANES.forEach(function (L, i) { R(svg, 50, L.y, 420, 14, { fill: BELT, rx: 7 }); var tg = E('g', {}); ticks.push(tg); for (var k = 0; k < 17; k++) E('rect', { x: 50 + k * 26, y: L.y + 5, width: 12, height: 4, rx: 2, fill: '#5f8a91' }, tg);
  ICON(svg, L.ic, 52, L.y + 24, 1.1, TEAL, 2.2); T(svg, 84, L.y + 42, L.s, 17.5, INK, 'PM', 600); });
T(svg, 456, 156, 'ALL LOOK FINISHED', 17, MUTE, 'PM', 600, 'end');
// ---------- 2: lens + dots ----------
var LX = 680, LY = 340, LR = 142;
var lensBg = E('circle', { cx: LX, cy: LY, r: LR, fill: '#fdf4e0', stroke: 'none' });
var lensCp = E('clipPath', { id: 'lc' }, df); E('circle', { cx: LX, cy: LY, r: LR - 4 }, lensCp);
var lensG = E('g', { 'clip-path': 'url(#lc)' });
var lp = R(lensG, LX - 112, LY - 134, 224, 268, { fill: PAPER, stroke: INK, 'stroke-width': 3, rx: 10 }); R(lensG, LX - 96, LY - 114, 120, 14, { fill: TEAL, rx: 4 });
var lines = [0, 1, 2].map(function (i) { return T(lensG, LX - 96, LY - 56 + i * 44, '', 17, INK, 'PM', 600); });
var lbars = [0, 1, 2, 3].map(function (i) { return R(lensG, LX - 96 + i * 34, LY + 80, 24, 20, { fill: TEAL, rx: 3 }); });
var holo = R(lensG, LX - 112, LY - 134, 224, 268, { fill: TOM, opacity: 0, rx: 10 });
var scanBand = R(lensG, LX - 140, LY - 140, 280, 26, { fill: GOLD, opacity: .38, rx: 0 });
E('circle', { cx: LX, cy: LY, r: LR, fill: 'none', stroke: INK, 'stroke-width': 7 }); E('circle', { cx: LX, cy: LY, r: LR, fill: 'none', stroke: GOLD, 'stroke-width': 3.5 }); E('line', { x1: LX + 100, y1: LY + 102, x2: LX + 150, y2: LY + 150, stroke: INK, 'stroke-width': 14, 'stroke-linecap': 'round' });
var ring = E('circle', { cx: LX, cy: LY, r: LR + 12, fill: 'none', stroke: GOLD, 'stroke-width': 3 });
var stamp = E('g', { opacity: 0 }); var stR = R(stamp, -96, -34, 192, 68, { fill: 'none', stroke: TOM, 'stroke-width': 7, rx: 10 }); var stT = T(stamp, 0, 14, 'HOLLOW', 42, TOM, 'FR', 900, 'middle');
var verdict = { textContent: '', setAttribute: function () {} };
// 10×10 dot grid
var DX = 850, DY = 188, DS = 14, dots = [], hollowIdx = {}; [3, 8, 14, 21, 29, 36, 40, 47, 55, 61, 68, 74, 82, 90, 96].forEach(function (k) { hollowIdx[k] = 1; });
for (var d = 0; d < 100; d++) dots.push(E('circle', { cx: DX + (d % 10) * DS + 6, cy: DY + Math.floor(d / 10) * DS + 6, r: 5, fill: '#e3d8bd' }));
var cursor = E('rect', { x: DX - 2, y: DY, width: 144, height: 14, fill: 'none', stroke: GOLD, 'stroke-width': 3, rx: 5 });
var hollowN = T(svg, 850, 392, '0', 66, TOM, 'FR', 900, 'start', -1); T(svg, 850, 424, 'HOLLOW OF 100', 18, INK, 'PM', 600); T(svg, 850, 448, '15.4% OF INBOX', 17, MUTE, 'PM', 600);

// ---------- 3: rework chute, clock, bench ----------
var chute = E('path', { d: 'M680 490 L680 529 L1100 529', fill: 'none', stroke: TOM, 'stroke-width': 4, 'stroke-dasharray': '10 9', opacity: .75, 'stroke-linecap': 'round' });
T(svg, 1000, 556, 'REWORK CHUTE', 16.5, TOM, 'PM', 600, 'middle');
var CKX = 1110, CKY = 262; E('circle', { cx: CKX, cy: CKY, r: 62, fill: PAPER, stroke: INK, 'stroke-width': 5 });
for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; E('line', { x1: CKX + Math.sin(a) * 50, y1: CKY - Math.cos(a) * 50, x2: CKX + Math.sin(a) * 58, y2: CKY - Math.cos(a) * 58, stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }); }
var arc = E('path', { d: '', fill: TOM, opacity: .85 }); var hand = E('line', { x1: CKX, y1: CKY, x2: CKX, y2: CKY - 46, stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }); E('circle', { cx: CKX, cy: CKY, r: 7, fill: INK });
T(svg, 1196, 262, '≈ 2 HOURS', 46, INK, 'FR', 900, 'start', -.8); T(svg, 1196, 292, 'NEARLY 2 H PER INCIDENT', 17, MUTE, 'PM', 600); T(svg, 1196, 316, '(STUDY AVERAGE)', 17, MUTE, 'PM', 600);
R(svg, 1056, 372, 490, 126, { fill: '#f2e8d0', stroke: LINE, 'stroke-width': 2, rx: 12 }); T(svg, 1070, 394, 'YOUR BENCH', 16.5, MUTE, 'PM', 600, 'start', 1);
var benchSlots = [[1180, 450], [1350, 450]], benchG = [0, 1].map(function () { return E('g', { opacity: 0 }); }), benchTag = [0, 1].map(function (i) { return null; });
var alarm = E('g', { opacity: 0 }); ICON(alarm, 'alert-triangle', 1498, 378, 1.1, TOM, 2.4);

// ---------- 4: sender bars ----------
var SB = [['FROM A PEER', 40, 'users', 650], ['FROM YOUR REPORT', 18, 'arrow-up', 702], ['FROM YOUR BOSS', 16, 'arrow-down', 754]], sbar = [], sval = [];
SB.forEach(function (s) { ICON(svg, s[2], 52, s[3] - 21, 1.0, TEAL, 2.2); T(svg, 84, s[3] - 1, s[0], 17.5, INK, 'PM', 600); R(svg, 300, s[3] - 24, 420, 30, { fill: '#f2e8d0', stroke: LINE, 'stroke-width': 2, rx: 8 });
  sbar.push(R(svg, 300, s[3] - 24, 0, 30, { fill: TEAL, rx: 8 })); sval.push(T(svg, 306, s[3] - 2, s[1] + '%', 19, PAPER, 'FR', 900, 'start')); });

// ---------- 5: day bar + bill ----------
var dayB = [], dayL = []; for (var h = 0; h < 8; h++) { var bx = 816 + h * 93; R(svg, bx, 640, 86, 46, { fill: '#f2e8d0', stroke: LINE, 'stroke-width': 2, rx: 8 }); dayB.push(R(svg, bx, 640, 86, 46, { fill: TOM, rx: 8, opacity: 0 })); dayL.push(T(svg, bx + 43, 670, (9 + h) + ':00', 16.5, MUTE, 'PM', 600, 'middle')); }
var dayT = T(svg, 816, 710, '', 19, INK, 'PM', 600);
var billN = T(svg, 816, 778, '$0', 52, TOM, 'FR', 900, 'start', -1); T(svg, 990, 748, 'PER EMPLOYEE, PER MONTH', 18, INK, 'PM', 600); T(svg, 990, 772, '≈ $9M+ A YEAR AT 10,000 STAFF', 18, MUTE, 'PM', 600);

// ---------- footer ticker ----------
R(svg, 30, 806, 1540, 52, { fill: INK, rx: 12 });
var TICK = ['15.4% OF WORK YOU RECEIVE IS WORKSLOP', 'NEARLY 2 HOURS TO FIX EACH ONE', '$186 PER EMPLOYEE PER MONTH', 'MOST OF IT COMES FROM COWORKERS · 40%'], TW = 520, tick = [];
var tc = E('clipPath', { id: 'tcl' }, df); E('rect', { x: 40, y: 806, width: 1520, height: 52 }, tc);
var tg = E('g', { 'clip-path': 'url(#tcl)' }); for (var q = 0; q < 4; q++) { var g = E('g', {}, tg); E('circle', { cx: 14, cy: 832, r: 6, fill: GOLD }, g); T(g, 30, 839, TICK[q], 18, PAPER, 'PM', 600); tick.push(g); }
T(svg, 30, 886, 'Source: BetterUp Labs + Stanford Social Media Lab via HBR (Sept 2025), read through The Decoder. Documents and timings are schematic.', 17, MUTE, 'PM', 600);

// ---------- documents ----------
var N = 12, HOLLOW = { 3: 1, 9: 1 }, LANEOF = [0, 1, 0, 0, 2, 1, 0, 2, 0, 1, 0, 2], docs = [];
function mkDoc(i) { var g = E('g', {}), id = 'dc' + i; var cp = E('clipPath', { id: id }, df); E('rect', { x: 0, y: 0, width: 46, height: 58, rx: 6 }, cp);
  R(g, 0, 0, 46, 58, { fill: PAPER, stroke: INK, 'stroke-width': 3, rx: 6 }); R(g, 7, 8, 24, 6, { fill: TEAL, rx: 2 }); [0, 1, 2].forEach(function (j) { R(g, 7, 20 + j * 8, 32 - j * 5, 4, { fill: LINE, rx: 2 }); }); [0, 1, 2].forEach(function (j) { R(g, 8 + j * 10, 52 - 10 - j * 3, 7, 10 + j * 3, { fill: TEAL, rx: 1 }); });
  var sh = E('g', { 'clip-path': 'url(#' + id + ')' }, g); var shine = E('rect', { x: -30, y: -10, width: 14, height: 80, fill: '#ffffff', opacity: .7, transform: 'rotate(20)' }, sh);
  var mark = E('g', { opacity: 0 }, g); E('circle', { cx: 38, cy: 8, r: 9, fill: HOLLOW[i] ? TOM : TEAL }, mark); mark.appendChild(HOLLOW[i] ? E('path', { d: 'M34 4 L42 12 M42 4 L34 12', stroke: PAPER, 'stroke-width': 2.6, 'stroke-linecap': 'round' }) : E('path', { d: 'M33.5 8 L37 11.5 L43 5', fill: 'none', stroke: PAPER, 'stroke-width': 2.6, 'stroke-linecap': 'round' }));
  return { g: g, shine: shine, mark: mark, i: i }; }
for (var i = 0; i < N; i++) docs.push(mkDoc(i));
benchG.forEach(function (bg, hi) { var s = E('g', { transform: 'scale(1.4)' }, bg); s.innerHTML = '<rect width="46" height="58" rx="6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/><rect x="7" y="8" width="24" height="6" rx="2" fill="' + TEAL + '"/><rect x="7" y="20" width="32" height="4" rx="2" fill="' + LINE + '"/><rect x="7" y="28" width="27" height="4" rx="2" fill="' + LINE + '"/><circle cx="38" cy="8" r="9" fill="' + TOM + '"/><path d="M34 4 L42 12 M42 4 L34 12" stroke="' + PAPER + '" stroke-width="2.6" stroke-linecap="round"/>'; benchTag[hi] = T(bg, 70, 40, 'REWORK', 17, TOM, 'PM', 600, 'start'); });
var hollowDocs = [3, 9];
var SOL = [['Churn 4.1%', 'Source: CRM', 'Owner: ops, Fri'], ['Cost down 6%', 'Source: ledger', 'Owner: legal, Mon'], ['NPS 41', 'Source: survey', 'Owner: eng, Wed']];
var HOL = ['Leverage synergies', 'Unchecked figures', 'Next steps: TBD'];

// ---------- scene ----------
window.__seek = function (tt) {
  var t = mod(tt + OFF, DUR);
  // belts
  ticks.forEach(function (g) { g.setAttribute('transform', 'translate(' + (-((t * 70) % 26)).toFixed(1) + ',0)'); });
  var lensDoc = -1, lensK = 0;
  docs.forEach(function (D, i) {
    var p = mod(t - i * 1.0, DUR), L = LANES[LANEOF[i]], x, y, o = 1, sc = 1, rot = 0, show = true; var hol = !!HOLLOW[i];
    if (p < 2.1) { x = 54 + 420 * (p / 2.1); y = L.y - 58; if (p > 1.85) o = 1 - seg(p, 1.85, 2.1); }
    else if (p < 3.4) { show = false; lensDoc = i; lensK = (p - 2.1) / 1.3; }
    else if (hol && p < 5.0) { var u = sm((p - 3.4) / 1.6), s0 = u * (0), pts = [[657, 470], [657, 500], [1090, 500], [benchSlots[hollowDocs.indexOf(i)][0] - 32, benchSlots[hollowDocs.indexOf(i)][1] - 40]], seg1 = 30, seg2 = 433, seg3 = 150, tot = seg1 + seg2 + seg3, d0 = u * tot;
      if (d0 < seg1) { x = pts[0][0]; y = lerp(pts[0][1], pts[1][1], d0 / seg1); } else if (d0 < seg1 + seg2) { x = lerp(pts[1][0], pts[2][0], (d0 - seg1) / seg2); y = pts[1][1]; } else { var w = (d0 - seg1 - seg2) / seg3; x = lerp(pts[2][0], pts[3][0], w); y = lerp(pts[2][1], pts[3][1], w); sc = lerp(1, 1.4, w); }
      D.mark.setAttribute('opacity', 1); }
    else if (!hol && p < 4.0) { var uu = seg(p, 3.4, 4.0); x = 657 - 40 * uu; y = 470 + 40 * uu; o = 1 - uu; D.mark.setAttribute('opacity', 1); sc = 1 - .3 * uu; }
    else show = false;
    if (!(p >= 3.4 && (hol ? p < 5.0 : p < 4.0))) D.mark.setAttribute('opacity', 0);
    if (!show) { D.g.setAttribute('opacity', 0); return; }
    D.g.setAttribute('opacity', o.toFixed(2)); D.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
    D.shine.setAttribute('x', (-30 + ((p * 40) % 90)).toFixed(1));
  });
  // lens contents
  var open = lensDoc >= 0, ho = open && !!HOLLOW[lensDoc];
  lp.setAttribute('opacity', open ? 1 : .35); scanBand.setAttribute('y', (LY - 140 + ((t * 120) % 280)).toFixed(1)); scanBand.setAttribute('opacity', open && lensK < .55 ? .42 : 0);
  ring.setAttribute('r', (LR + 12 + (open ? 8 * Math.sin(t * 9) : 0)).toFixed(1)); ring.setAttribute('opacity', open ? .8 : .25);
  var txt = open ? (ho ? HOL : SOL[lensDoc % 3]) : ['', '', ''];
  lines.forEach(function (l, j) { l.textContent = txt[j]; l.setAttribute('fill', ho && lensK > .6 ? TOM : INK); l.setAttribute('opacity', seg(lensK, .08 + j * .1, .22 + j * .1)); });
  lbars.forEach(function (b, j) { b.setAttribute('height', (ho && lensK > .55 ? 3 : 20 + j * 6)); b.setAttribute('y', LY + 100 - (ho && lensK > .55 ? 3 : 20 + j * 6)); b.setAttribute('fill', ho && lensK > .55 ? TOM : TEAL); });
  holo.setAttribute('opacity', ho ? .14 * seg(lensK, .55, .7) : 0);
  var sk = back(seg(lensK, .55, .7)); stamp.setAttribute('opacity', open && lensK > .55 && lensK < .98 ? 1 : 0);
  stamp.setAttribute('transform', 'translate(' + (LX + 4) + ',' + (LY + 10) + ') rotate(-14) scale(' + lerp(2.2, 1, sk).toFixed(3) + ')'); stT.textContent = ho ? 'HOLLOW' : 'SOLID'; stT.setAttribute('fill', ho ? TOM : TEAL); stR.setAttribute('stroke', ho ? TOM : TEAL);
  verdict.textContent = open && lensK > .6 ? (ho ? 'LOOKS DONE, ISN’T: SENT TO YOU' : 'CHECKS OUT: FILED') : (open ? 'READING…' : 'WAITING FOR THE NEXT ONE'); verdict.setAttribute('fill', open && lensK > .6 ? (ho ? TOM : TEAL) : MUTE);
  // dots
  var n = t < 11.3 ? 100 * sm(seg(t, .3, 10.8)) : 100 * (1 - sm(seg(t, 11.3, 11.9))), cnt = 0;
  for (var d2 = 0; d2 < 100; d2++) { var on = d2 < n; if (on && hollowIdx[d2]) cnt++; dots[d2].setAttribute('fill', on ? (hollowIdx[d2] ? TOM : TEAL) : '#e3d8bd'); dots[d2].setAttribute('r', on && hollowIdx[d2] ? 6 + 1.6 * Math.max(0, 1 - Math.abs(d2 - n) / 6) : 5); }
  cursor.setAttribute('y', (DY + Math.min(9, Math.floor(n / 10)) * DS - 1).toFixed(1)); cursor.setAttribute('opacity', n > 1 && n < 99 ? 1 : 0); hollowN.textContent = String(cnt);
  // chute + bench + clock + day bar
  chute.setAttribute('stroke-dashoffset', (-(t * 40)).toFixed(1));
  var onB = 0, partial = 0;
  [0, 1].forEach(function (hi) { var a = mod(hollowDocs[hi] * 1.0 + 5.0, DUR), ph = mod(t - a, DUR), v = ph < 9.2 ? 1 : 0; var drop = seg(ph, 0, .3), out = seg(ph, 8.6, 9.2); benchG[hi].setAttribute('opacity', v ? (drop * (1 - out)).toFixed(2) : 0);
    benchG[hi].setAttribute('transform', 'translate(' + (benchSlots[hi][0] - 32) + ',' + (benchSlots[hi][1] - 40 + 0) + ')'); if (v) { onB++; partial += drop * (1 - out); } });
  var ak = Math.min(1, partial); alarm.setAttribute('opacity', ak > .1 ? (.55 + .45 * (Math.sin(t * 10) > 0 ? 1 : 0)).toFixed(2) : 0);
  var ang = (t * 360 / 4) % 360, ar = ang * Math.PI / 180; hand.setAttribute('x2', (CKX + Math.sin(ar) * 46).toFixed(1)); hand.setAttribute('y2', (CKY - Math.cos(ar) * 46).toFixed(1));
  var sw = ar > .01 ? ar : 0; arc.setAttribute('d', 'M' + CKX + ' ' + CKY + ' L' + CKX + ' ' + (CKY - 46) + ' A46 46 0 ' + (ang > 180 ? 1 : 0) + ' 1 ' + (CKX + Math.sin(ar) * 46).toFixed(1) + ' ' + (CKY - Math.cos(ar) * 46).toFixed(1) + ' Z');
  var hrs = 0; for (var b2 = 0; b2 < 8; b2++) { var f = clamp(partial * 2 - b2, 0, 1); dayB[b2].setAttribute('opacity', f.toFixed(2)); dayL[b2].setAttribute('fill', f > .5 ? PAPER : MUTE); hrs += f; }
  dayT.textContent = Math.round(hrs) + ' OF 8 HOURS GONE TO FIXING OTHER PEOPLE’S DRAFTS'; dayT.setAttribute('fill', hrs > 2.5 ? TOM : INK);
  // bars + bill
  var bk = t < 11.3 ? sm(seg(t, .3, 3.2)) : 1 - sm(seg(t, 11.3, 11.9));
  SB.forEach(function (s, j) { var wv = 420 * (s[1] / 40) * bk; sbar[j].setAttribute('width', Math.max(0, wv).toFixed(1)); sval[j].setAttribute('opacity', bk > .15 ? 1 : 0); sval[j].textContent = Math.round(s[1] * bk) + '%'; sval[j].setAttribute('x', 306); });
  var bv = 186 * (t < 11.3 ? sm(seg(t, .3, 10.2)) : 1 - sm(seg(t, 11.3, 11.9))); billN.textContent = '$' + Math.round(bv);
  // ticker
  var off = (t / DUR) * TW * 4; tick.forEach(function (g, q2) { var x = mod(40 + q2 * TW - off + 520, TW * 4) - 520; g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',0)'); });
};
window.__reelDurationSec = DUR; window.__ready = false; window.__seek(0);
Promise.all([document.fonts.load('900 40px FR'), document.fonts.load('600 20px PM'), document.fonts.load('600 20px IN'), document.fonts.load('700 20px IN')]).then(function () { window.__seek(0); window.__ready = true; });
})();
