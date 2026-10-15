// "The agent writes the workflow" — Claude Managed Agents dynamic workflows (public beta, Oct 9 2026) as a live diagram,
// 1600×900, 12 s loop. Every motion is a step of the system: the lead agent writes the program; the run fans out agent
// threads (≤64 working at once) over code chunks; each thread returns its result to the program; phase 2 merges, a reviewer
// rejects round 1, the draft is revised and passes; the report returns to the lead agent, which reads the run. Events print on
// the session stream as they happen. window.__seek(t) is a pure function of t.
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 12;
var BG = '#15100d', DOT = '#2c221b', PANEL = '#1f1813', LINE = '#3d2f25', TXT = '#f3e6d3', MUTE = '#ad9781',
  EMB = '#ff7a3d', COB = '#5b8cff', JADE = '#2ed3a0', MAG = '#ff4fa3', GOLD = '#ffc845';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function lerp(a, b, u) { return a + (b - a) * u; }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { return E('text', { x: x, y: y, fill: fill, 'font-family': font || 'IN', 'font-weight': wt || 500, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); }
function ICON(par, name, x, y, s, col, sw) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')', fill: 'none', stroke: col, 'stroke-width': sw || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = window.ICONS[name] || ''; return g; }
function R(par, x, y, w, h, at) { var a = { x: x, y: y, width: w, height: h, rx: 12 }; for (var k in at) a[k] = at[k]; return E('rect', a, par); }
function NB(par, n, x, y) { var g = E('g', {}, par); E('circle', { cx: x, cy: y, r: 16, fill: GOLD }, g); T(g, x, y + 7, String(n), 20, BG, 'OU', 800, 'middle'); return g; }

// ---------- static frame ----------
var df = E('defs', {}); var dp = E('pattern', { id: 'd', width: 28, height: 28, patternUnits: 'userSpaceOnUse' }, df); E('circle', { cx: 14, cy: 14, r: 1.4, fill: DOT }, dp);
var gl = E('filter', { id: 'glow', x: '-1', y: '-1', width: '3', height: '3' }, df); E('feGaussianBlur', { stdDeviation: 4, result: 'b' }, gl); var fm = E('feMerge', {}, gl); E('feMergeNode', { in: 'b' }, fm); E('feMergeNode', { in: 'SourceGraphic' }, fm);
E('rect', { width: 1600, height: 900, fill: BG }); E('rect', { width: 1600, height: 900, fill: 'url(#d)' });
var tl = T(svg, 30, 58, 'This agent writes its own ', 44, TXT, 'OU', 800, 'start', -.8); E('tspan', { fill: EMB }, tl, 'orchestration code.');
T(svg, 30, 92, 'CLAUDE MANAGED AGENTS · DYNAMIC WORKFLOWS · PUBLIC BETA, OCT 9, 2026', 18, MUTE, 'DM', 500, 'start', .6);
// lead agent + program editor
var lead = E('g', {}); var leadR = R(lead, 30, 120, 400, 58, { fill: PANEL, stroke: EMB, 'stroke-width': 2.5 }); ICON(lead, 'robot', 44, 132, 1.4, EMB);
T(lead, 84, 156, 'LEAD AGENT', 21, TXT, 'DM', 500); var leadSt = T(lead, 416, 156, '', 18, EMB, 'DM', 500, 'end');
var ed = E('g', {}); R(ed, 30, 190, 400, 288, { fill: '#120d0b', stroke: LINE, 'stroke-width': 2 }); R(ed, 30, 190, 400, 36, { fill: PANEL, rx: 12 }); E('rect', { x: 30, y: 214, width: 400, height: 12, fill: PANEL }, ed);
T(ed, 46, 214, 'workflow · written by the agent', 17.5, MUTE, 'DM', 500); NB(svg, 1, 430, 192);
var CODE = ['phase("Read the code")', 'found = fanOut(chunks, finder)', 'phase("Reconcile")', 'report = merge(found)', 'while (!review(report).pass)', '  report = revise(report)', 'return report'];
var codeT = CODE.map(function (s, i) { var y = 260 + i * 31; var hl = R(ed, 36, y - 22, 388, 30, { fill: EMB, opacity: 0, rx: 6 }); var tx = T(ed, 50, y, '', 19, TXT, 'DM', 500); return { s: s, hl: hl, tx: tx, y: y }; });
T(ed, 46, 470, 'ILLUSTRATIVE · a new program per task', 15.5, '#7d6a58', 'DM', 500);
// result box (bottom-left)
var res = E('g', {}); var resR = R(res, 30, 490, 400, 70, { fill: PANEL, stroke: LINE, 'stroke-width': 2 }); ICON(res, 'file-text', 44, 504, 1.5, MUTE);
var resT1 = T(res, 88, 519, 'run result → lead agent', 19, MUTE, 'DM', 500), resT2 = T(res, 88, 545, 'waiting for the run…', 17.5, '#7d6a58', 'DM', 500); NB(svg, 5, 430, 492);
// phase 1 panel
var p1 = E('g', {}); var p1R = R(p1, 452, 120, 548, 440, { fill: PANEL, stroke: LINE, 'stroke-width': 2.5 });
T(p1, 470, 150, 'PHASE 1 · READ THE CODE', 21, TXT, 'DM', 500); NB(svg, 2, 1000, 122);
var gWork = T(p1, 470, 178, '', 18, COB, 'DM', 500), gStart = T(p1, 984, 178, '', 18, GOLD, 'DM', 500, 'end');
// queue of chunks
R(p1, 466, 196, 62, 350, { fill: '#120d0b', stroke: LINE, 'stroke-width': 1.5, rx: 8 }); T(p1, 497, 540, 'QUEUE', 14.5, MUTE, 'DM', 500, 'middle');
var qT = []; for (var q = 0; q < 9; q++) qT.push(R(p1, 474, 0, 46, 26, { fill: '#2a2018', stroke: '#5a4636', 'stroke-width': 1.5, rx: 4 }));
// 8×8 grid of agent cells
var CX = 548, CY = 196, CS = 40, CG = 4.5, cells = [];
for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { var x = CX + c * (CS + CG), y = CY + r * (CS + CG);
  var g = E('g', {}, p1); var base = R(g, x, y, CS, CS, { fill: '#241b15', stroke: '#3a2c22', 'stroke-width': 1.5, rx: 7 }); var fill = R(g, x + 3, y + CS - 3, CS - 6, 0, { fill: COB, rx: 4, opacity: .9 });
  var mk = E('g', {}, g); cells.push({ x: x, y: y, cx: x + CS / 2, cy: y + CS / 2, base: base, fill: fill, mk: mk }); }
// phase 2 panel
var p2 = E('g', {}); var p2R = R(p2, 1022, 120, 548, 440, { fill: PANEL, stroke: LINE, 'stroke-width': 2.5 });
T(p2, 1040, 150, 'PHASE 2 · RECONCILE', 21, TXT, 'DM', 500); NB(svg, 4, 1570, 122);
var round = T(p2, 1554, 150, '', 18, MAG, 'DM', 500, 'end');
function node(par, x, y, w, h, ic, label, col) { var g = E('g', {}, par); var rr = R(g, x, y, w, h, { fill: '#120d0b', stroke: col, 'stroke-width': 2.5 }); ICON(g, ic, x + 12, y + 14, 1.15, col); var tx = T(g, x + 46, y + 34, label, 19, TXT, 'DM', 500); var ring = E('circle', { cx: x + w - 22, cy: y + h / 2, r: 11, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-dasharray': '69.1', 'stroke-dashoffset': '69.1', transform: 'rotate(-90 ' + (x + w - 22) + ' ' + (y + h / 2) + ')' }, g); return { g: g, r: rr, tx: tx, ring: ring, x: x, y: y, w: w, h: h }; }
var inbox = node(p2, 1040, 176, 196, 54, 'stack-2', 'collected', JADE);
var inboxN = T(p2, 1138, 260, '', 19, JADE, 'DM', 500, 'middle'); T(p2, 1138, 284, 'results held by', 15.5, MUTE, 'DM', 500, 'middle'); T(p2, 1138, 304, 'the program', 15.5, MUTE, 'DM', 500, 'middle');
var mergeN = node(p2, 1284, 176, 180, 54, 'copy', 'merge', COB);
var reviewN = node(p2, 1340, 330, 200, 54, 'eye', 'review', GOLD);
var reviseN = node(p2, 1060, 330, 196, 54, 'pencil', 'revise', MAG);
var outN = node(p2, 1340, 470, 200, 54, 'file-text', 'report', JADE);
var wires = E('g', {}, p2);
function wire(d, col, dash) { return E('path', { d: d, fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-dasharray': dash || '0', opacity: .55 }, wires); }
var W1 = wire('M1236 203 L1284 203', JADE), W2 = wire('M1420 230 C 1420 280 1440 290 1440 330', COB), W3 = wire('M1340 370 C 1300 380 1290 380 1256 370', MAG, '7 6'),
  W4 = wire('M1256 344 C 1290 330 1300 330 1340 344', MAG, '7 6'), W5 = wire('M1440 384 L1440 470', JADE);
p2.insertBefore(wires, p2.childNodes[3]);   // wires sit behind the nodes
var verdict = E('g', {}, p2);
T(p2, 1040, 470, 'repeat until the', 17, MUTE, 'DM', 500); T(p2, 1040, 492, 'review passes, or', 17, MUTE, 'DM', 500); T(p2, 1040, 514, 'the rounds run out', 17, MUTE, 'DM', 500);
// shared sandbox files band
var fb = E('g', {}); var fbR = R(fb, 452, 572, 1118, 46, { fill: '#120d0b', stroke: JADE, 'stroke-width': 2, 'stroke-dasharray': '10 7', rx: 10, opacity: .9 }); NB(svg, 3, 452, 574);
T(fb, 476, 601, 'SHARED SANDBOX FILES · every thread works with the same files', 17.5, JADE, 'DM', 500);
var FILES = []; for (var f = 0; f < 9; f++) { var fx = 1166 + f * 44; var fg = ICON(fb, 'file-text', fx, 583, .95, '#4e7d6c'); FILES.push({ g: fg, x: fx + 11 }); }
// event stream band
var ev = E('g', {}); R(ev, 30, 632, 1540, 52, { fill: '#120d0b', stroke: LINE, 'stroke-width': 2, rx: 10 }); T(ev, 46, 664, 'SESSION EVENTS', 16, MUTE, 'DM', 500);
var cpE = E('clipPath', { id: 'evc' }, df); E('rect', { x: 196, y: 634, width: 1370, height: 48 }, cpE); var evg = E('g', { 'clip-path': 'url(#evc)', class: 'clip' }, ev);
var CHIPS = []; for (var k = 0; k < 14; k++) { var cg = E('g', {}, evg); var cr = R(cg, 0, 642, 10, 32, { fill: '#2a2018', stroke: LINE, 'stroke-width': 1.5, rx: 7 }); var ct = T(cg, 12, 664, '', 16.5, TXT, 'DM', 500); CHIPS.push({ g: cg, r: cr, t: ct }); }
// payoff bars
var pb = E('g', {}); R(pb, 30, 698, 900, 172, { fill: PANEL, stroke: LINE, 'stroke-width': 2 });
T(pb, 48, 728, "BUGS FOUND · ANTHROPIC'S SYNTHETIC TEST", 18, GOLD, 'DM', 500); T(pb, 912, 728, '70 planted in 116,000 lines · 3 runs', 15.5, MUTE, 'DM', 500, 'end');
T(pb, 48, 774, 'Workflow', 20, TXT, 'IN', 700); R(pb, 200, 754, 560, 30, { fill: '#120d0b', rx: 7 }); var bW = R(pb, 200, 754, 0, 30, { fill: JADE, rx: 7 }); var bWn = T(pb, 772, 776, '', 20, JADE, 'IN', 700);
T(pb, 48, 828, 'Single agent', 20, TXT, 'IN', 700); R(pb, 200, 808, 560, 30, { fill: '#120d0b', rx: 7 }); var bS = R(pb, 200, 808, 0, 30, { fill: MAG, rx: 7 }); var bSn = T(pb, 772, 830, '', 20, MAG, 'IN', 700);
T(pb, 200, 860, 'runs: 66, 66, 66 vs 14, 15, 27 (best shown) · uses more tokens', 15.5, '#8a7562', 'DM', 500);
for (var m = 0; m <= 70; m += 10) E('line', { x1: 200 + m * 8, y1: 750, x2: 200 + m * 8, y2: 842, stroke: '#2c221b', 'stroke-width': 1 }, pb);
// legend
var LEG = [[1, 'The agent writes the workflow program itself.'], [2, 'It fans out: up to 64 agents at once, 1,000 per run.'], [3, 'Phases pass results on; all share the sandbox files.'], [4, 'Repeat until the review passes (or rounds run out).'], [5, 'One result goes back; the lead agent reads the run.']];
LEG.forEach(function (l, i) { var y = 724 + i * 34; NB(svg, l[0], 966, y - 7); T(svg, 992, y, l[1], 19, TXT, 'IN', 500); });
T(svg, 966, 886, 'Source: Claude Platform release notes & docs, Oct 9, 2026', 15.5, MUTE, 'IN', 500);
var pk = E('g', { filter: 'url(#glow)' }), fx2 = E('g', {});

// ---------- schedule (the run) ----------
var RUN0 = 1.15, P1S = 1.3, P1E = 7.0, slots = [], ITEMS = [];
for (var s = 0; s < 64; s++) slots.push(P1S + s * .012);
for (var i = 0; ; i++) { var best = 0; for (var s2 = 1; s2 < 64; s2++) if (slots[s2] < slots[best]) best = s2; var st = slots[best] + .22; if (st > 5.7) break;
  var d = 1.0 + .75 * hash(i); ITEMS.push({ i: i, slot: best, q: slots[best], st: st, en: st + d }); slots[best] = st + d; }
var order = ITEMS.map(function (it) { return it; }).sort(function (a, b) { return hash(a.i + 99) - hash(b.i + 99); }); order.slice(0, 66).forEach(function (it) { it.bug = 1; });
var NIT = ITEMS.length, LASTEND = Math.max.apply(0, ITEMS.map(function (x) { return x.en; }));
// phase 2 timeline
var M0 = 7.05, M1 = 7.75, R1a = 7.95, R1b = 8.45, V0 = 8.75, V1 = 9.35, R2a = 9.55, R2b = 9.95, OUT0 = 10.1, OUT1 = 10.85, READ = 11.45, CLR = 11.7;
var EVTS = [[RUN0, 'workflow_run.created', EMB], [RUN0 + .12, 'status_running', EMB], [P1S, 'phase_started · Read the code', COB]];
[64, 128].forEach(function (n) { EVTS.push([ITEMS[n - 1].st, 'thread_created ×' + n, '#c9b7a4']); });
EVTS.push([ITEMS[NIT - 1].st, 'thread_created ×' + NIT, '#c9b7a4']); EVTS.push([M0 - .05, 'phase_ended · Read the code', COB]); EVTS.push([M0, 'phase_started · Reconcile', MAG]);
EVTS.push([R1a, 'thread_created · reviewer', '#c9b7a4']); EVTS.push([OUT0, 'phase_ended · Reconcile', MAG]); EVTS.push([OUT0 + .25, 'status_ended · completed', JADE]);
EVTS.sort(function (a, b) { return a[0] - b[0]; });
// measure chip widths once
var CW = EVTS.map(function (e) { return e[1].length * 9.9 + 26; });   // DM Mono advance = 0.6 em at 16.5 px
function pathPt(pts, u) { var L = [], tot = 0; for (var j = 1; j < pts.length; j++) { var l = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); L.push(l); tot += l; } var d2 = u * tot; for (j = 1; j < pts.length; j++) { if (d2 <= L[j - 1]) { var v = d2 / L[j - 1]; return [lerp(pts[j - 1][0], pts[j][0], v), lerp(pts[j - 1][1], pts[j][1], v)]; } d2 -= L[j - 1]; } return pts[pts.length - 1]; }
function dot(x, y, r, col, op) { E('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: r, fill: col, opacity: op == null ? 1 : op }, pk); }
function setRing(n, u) { n.ring.setAttribute('stroke-dashoffset', (69.1 * (1 - clamp(u, 0, 1))).toFixed(1)); }

window.__reelDurationSec = DUR;
var OFFSET = 3.6;   // GIF frame 0 lands mid fan-out (LinkedIn shows frame 0 as the still preview); the loop itself is unchanged
window.__seek = function (t0) {
  var t = (((t0 + OFFSET) % DUR) + DUR) % DUR; pk.innerHTML = ''; fx2.innerHTML = ''; verdict.innerHTML = '';
  var clr = sm((t - CLR) / .3);
  fbR.setAttribute('stroke-dashoffset', (-t / DUR * 17 * 12).toFixed(1)); W3.setAttribute('stroke-dashoffset', (t / DUR * 13 * 24).toFixed(1)); W4.setAttribute('stroke-dashoffset', (-t / DUR * 13 * 24).toFixed(1));   // ambient: dashes march, whole periods per loop
  // 1 · the agent writes the program (0 → 1.1 s), then a cursor marks the line that is executing
  var nch = Math.floor(clamp(t / 1.05, 0, 1) * CODE.join('').length), acc = 0;
  var exec = t < RUN0 ? -1 : (t < P1E ? (t < P1S + .3 ? 0 : 1) : t < M1 ? 3 : t < R1b ? 4 : t < V1 ? 5 : t < R2b ? 4 : t < OUT1 ? 6 : -1);
  if (t >= M0 - .1 && t < M0) exec = 2;
  codeT.forEach(function (c, i) { var vis = c.s.slice(0, Math.max(0, Math.min(c.s.length, nch - acc))); acc += c.s.length;
    c.tx.textContent = vis + (vis.length > 0 && vis.length < c.s.length ? '▌' : ''); c.tx.setAttribute('opacity', (1 - clr).toFixed(2)); c.hl.setAttribute('opacity', exec === i ? .22 * (1 - clr) : 0);
    c.tx.setAttribute('fill', exec === i ? '#ffd2bd' : TXT); });
  leadSt.textContent = t < RUN0 ? 'writing workflow…' : t < OUT1 ? 'run in background' : t < READ ? 'reading the run' + '.'.repeat(1 + Math.floor(t * 5) % 3) : 'answer ready ✓'; leadSt.setAttribute('fill', t >= READ ? JADE : EMB);
  leadR.setAttribute('stroke-width', t < RUN0 || (t >= OUT1 && t < READ) ? 4 : 2.5);
  // 2 · phase 1: fan-out over the queue, ≤ 64 threads at once
  var p1on = t >= P1S && t < M0, working = 0, started = 0, found = 0;
  p1R.setAttribute('stroke', p1on ? COB : LINE); p2R.setAttribute('stroke', t >= M0 && t < OUT0 + .3 ? MAG : LINE);
  cells.forEach(function (c) { c.cur = null; c.last = null; });
  ITEMS.forEach(function (it) { if (t >= it.st) started++; if (t >= it.st && t < it.en) { working++; cells[it.slot].cur = it; } if (t >= it.en) { if (it.bug) found++; var c = cells[it.slot]; if (!c.last || it.en > c.last.en) c.last = it; }
    var fl = (t - it.q) / .22; if (fl > 0 && fl < 1) { var cc = cells[it.slot], qy = 520 - 0; var p = [lerp(497, cc.cx, sm(fl)), lerp(qy, cc.cy, sm(fl))]; dot(p[0], p[1], 4.5, COB); }
    var rt = (t - it.en) / .45; if (rt > 0 && rt < 1 && t < M0 + .5) { var c2 = cells[it.slot]; var pp = pathPt([[c2.cx, c2.cy], [1010, 190 + (it.i % 7) * 4], [1046, 203]], sm(rt)); dot(pp[0], pp[1], it.bug ? 5 : 3.5, it.bug ? GOLD : JADE, .95); }
    if (rt > 0 && rt < .5 && t < M0) { var fi = FILES[it.i % FILES.length]; fi.hot = Math.max(fi.hot || 0, 1 - rt * 2); } });
  cells.forEach(function (c) { var it = c.cur, mk = c.mk; mk.innerHTML = '';
    if (it) { var u = (t - it.st) / (it.en - it.st); c.base.setAttribute('fill', '#1d2440'); c.base.setAttribute('stroke', COB); var h = (CS - 6) * u; c.fill.setAttribute('y', c.y + CS - 3 - h); c.fill.setAttribute('height', h.toFixed(1)); c.fill.setAttribute('fill', COB); }
    else { c.fill.setAttribute('height', 0); var L = c.last, a = L ? t - L.en : 9; if (a < .35 && t < M0 + .4) { c.base.setAttribute('fill', L.bug ? '#3a2e10' : '#123329'); c.base.setAttribute('stroke', L.bug ? GOLD : JADE);
        mk.innerHTML = L.bug ? '<circle cx="' + c.cx + '" cy="' + c.cy + '" r="7" fill="' + GOLD + '"/>' : '<path d="M' + (c.cx - 8) + ' ' + c.cy + ' l6 6 l11 -12" fill="none" stroke="' + JADE + '" stroke-width="3.5" stroke-linecap="round"/>'; }
      else if (L && t < CLR) { c.base.setAttribute('fill', L.bug ? '#2a2112' : '#15241e'); c.base.setAttribute('stroke', L.bug ? '#7a6224' : '#2b5c4b');   // finished thread: keeps a dim record of its last result
        mk.innerHTML = L.bug ? '<circle cx="' + c.cx + '" cy="' + c.cy + '" r="5" fill="' + GOLD + '" opacity=".55"/>' : '<path d="M' + (c.cx - 6) + ' ' + c.cy + ' l4 4 l8 -9" fill="none" stroke="' + JADE + '" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>'; }
      else { c.base.setAttribute('fill', '#241b15'); c.base.setAttribute('stroke', '#3a2c22'); } } });
  var queued = Math.max(0, NIT - started); qT.forEach(function (q2, j) { var y = 210 + j * 34 + ((t * 40) % 34) * (p1on && queued > 9 ? 1 : 0); q2.setAttribute('y', Math.min(y, 500).toFixed(1)); q2.setAttribute('opacity', j < queued ? (y > 480 ? .4 : 1) : .12); });
  gWork.textContent = t < P1S ? 'WORKING NOW  0 / 64' : 'WORKING NOW  ' + working + ' / 64'; gWork.setAttribute('fill', working >= 64 ? JADE : COB);
  gStart.textContent = 'STARTED  ' + (t < CLR ? started : 0) + ' / 1,000';
  // results collected by the program
  var col = t < CLR ? ITEMS.filter(function (it) { return t >= it.en + .45; }).length : 0, fed = sm((t - M0) / .5); inboxN.textContent = col + ' results';
  inbox.r.setAttribute('stroke-width', t >= P1S && t < M0 + .5 ? 3.5 : 2.5);
  // 3 · phase 2: merge, review (round 1 rejected), revise, review (round 2 passes), report
  if (t > M0 && t < M0 + .5) for (var z = 0; z < 6; z++) { var pp2 = pathPt([[1236, 203], [1284, 203]], ((t - M0) * 2 + z / 6) % 1); dot(pp2[0], pp2[1], 4, JADE); }
  setRing(mergeN, (t - M0) / (M1 - M0)); setRing(reviewN, t < R2a ? (t - R1a) / (R1b - R1a) : (t - R2a) / (R2b - R2a)); setRing(reviseN, (t - V0) / (V1 - V0));
  if (t < M0 || t > CLR) { setRing(mergeN, 0); setRing(reviewN, 0); setRing(reviseN, 0); }
  function doc(pts, u, col) { var p3 = pathPt(pts, sm(u)); E('g', { transform: 'translate(' + (p3[0] - 12) + ',' + (p3[1] - 14) + ')' }, pk).innerHTML = '<rect width="24" height="28" rx="4" fill="' + col + '"/><path d="M5 9h14M5 15h14M5 21h9" stroke="' + BG + '" stroke-width="2.4"/>'; }
  if (t > M1 && t < R1a) doc([[1374, 230], [1420, 280], [1440, 330]], (t - M1) / (R1a - M1), COB);
  if (t > R1b && t < V0) doc([[1340, 370], [1300, 382], [1256, 370]], (t - R1b) / (V0 - R1b), MAG);
  if (t > V1 && t < R2a) doc([[1256, 344], [1300, 330], [1340, 344]], (t - V1) / (R2a - V1), MAG);
  if (t > R2b && t < OUT0) doc([[1440, 384], [1440, 470]], (t - R2b) / (OUT0 - R2b), JADE);
  if (t > OUT0 && t < OUT1) doc([[1440, 524], [1440, 595], [430, 595], [400, 560]], (t - OUT0) / (OUT1 - OUT0), JADE);
  if (t >= R1b && t < V1) { verdict.innerHTML = '<g transform="translate(1496,312)"><circle r="17" fill="' + MAG + '"/><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="' + BG + '" stroke-width="4" stroke-linecap="round"/></g><text x="1340" y="418" font-family="DM" font-size="17" fill="' + MAG + '">missing evidence</text>'; }
  if (t >= R2b && t < CLR) { verdict.innerHTML = '<g transform="translate(1496,312)"><circle r="17" fill="' + JADE + '"/><path d="M-8 0 L-2 6 L9 -6" fill="none" stroke="' + BG + '" stroke-width="4" stroke-linecap="round"/></g><text x="1340" y="418" font-family="DM" font-size="17" fill="' + JADE + '">review passed</text>'; }
  round.textContent = t < M0 || t >= CLR ? '' : (t < V1 ? 'ROUND 1 / 3' : 'ROUND 2 / 3'); round.setAttribute('fill', t >= R2b ? JADE : MAG);
  [[mergeN, M0, M1], [reviewN, R1a, R1b], [reviseN, V0, V1], [reviewN, R2a, R2b], [outN, R2b, OUT1]].forEach(function (a) { if (t >= a[1] && t < a[2]) a[0].r.setAttribute('fill', '#2a2018'); });
  [mergeN, reviewN, reviseN, outN].forEach(function (n) { if (!((t >= M0 && t < M1 && n === mergeN) || (((t >= R1a && t < R1b) || (t >= R2a && t < R2b)) && n === reviewN) || (t >= V0 && t < V1 && n === reviseN) || (t >= R2b && t < OUT1 && n === outN))) n.r.setAttribute('fill', '#120d0b'); });
  W3.setAttribute('opacity', t >= R1b && t < V0 ? 1 : .45); W4.setAttribute('opacity', t >= V1 && t < R2a ? 1 : .45); W5.setAttribute('opacity', t >= R2b && t < OUT0 ? 1 : .45);
  // report written to the shared files, then returned to the lead agent
  FILES.forEach(function (f, j) { var h2 = f.hot || 0; if (j === 8 && t >= OUT0 + .3 && t < CLR) h2 = 1; f.g.setAttribute('stroke', h2 > .05 ? (j === 8 && t >= OUT0 ? JADE : '#8fe7c9') : '#4e7d6c'); f.g.setAttribute('opacity', (.6 + .4 * h2).toFixed(2)); f.hot = 0; });
  var done = t >= OUT1 && t < CLR + .3; resR.setAttribute('stroke', done ? JADE : LINE); resT1.textContent = done ? 'report.md · 66 issues' : 'run result → lead agent'; resT1.setAttribute('fill', done ? JADE : MUTE);
  resT2.textContent = t < RUN0 ? 'no run yet' : t < OUT1 ? 'the lead agent keeps working' : 'its turn: read what the run did'; resT2.setAttribute('fill', done ? TXT : '#7d6a58');
  // payoff bars: Anthropic's synthetic test (70 planted bugs)
  var fw = t < CLR ? Math.round(66 * clamp(found / 66, 0, 1)) : 0, fs = t < CLR ? Math.round(27 * clamp((t - P1S) / (OUT1 - P1S), 0, 1)) : 0;
  bW.setAttribute('width', (fw * 8).toFixed(1)); bWn.textContent = fw + ' / 70'; bS.setAttribute('width', (fs * 8).toFixed(1)); bSn.textContent = fs + ' / 70';
  // event stream: newest chip at the right; the strip slides left as each arrives (previous loop included, so the loop is seamless)
  var list = []; [-DUR, 0].forEach(function (o) { EVTS.forEach(function (e, j) { if (e[0] + o <= t) list.push({ t: e[0] + o, j: j }); }); });
  list = list.slice(-14); var xr = 1556, slide = list.length ? sm((t - list[list.length - 1].t) / .25) : 1, wN = list.length ? CW[list[list.length - 1].j] + 10 : 0;
  CHIPS.forEach(function (ch, k) { var a = list[list.length - 1 - k]; if (!a) { ch.g.setAttribute('opacity', 0); return; } xr -= CW[a.j] + 10; if (k === 0) ch.g.setAttribute('opacity', slide.toFixed(2)); else ch.g.setAttribute('opacity', 1);
    var x = xr + 10 + (1 - slide) * wN; ch.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',0)'); ch.r.setAttribute('width', CW[a.j]); ch.t.textContent = EVTS[a.j][1]; ch.t.setAttribute('fill', EVTS[a.j][2]); ch.r.setAttribute('stroke', t - a.t < .6 ? EVTS[a.j][2] : LINE); });
};
window.__seek(0);
})();
