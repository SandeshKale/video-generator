// "Agents get an employee badge" — Google's Gemini agent (Oct 8, 2026) as a live architecture diagram, 1080×1350, 10 s loop.
// Every motion is a step of the system: the team assigns an objective; the agent plans (model switch), spawns sub-agents that
// get attested IDs; agents' requests run on an internal bus, past the written-once policy, through Agent Gateway to tools;
// each crossing prints a signed audit line and charges the project meter; the cap pauses everything until an admin resumes;
// sub-agents report back and fold away; the result returns to the team. window.__seek(t) is a pure function of t.
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 10;
var BG = '#0b1620', GRID = '#13283a', PANEL = '#0f2232', LINE = '#28465a', TXT = '#eaf2f6', MUTE = '#8fa9ba',
  VIO = '#a395ff', CLA = '#ff9a6a', MINT = '#3ee0b0', SKY = '#4cb8ff', ROSE = '#ff4f7b', SAFF = '#ffb020';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function lerp(a, b, u) { return a + (b - a) * u; }
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { return E('text', { x: x, y: y, fill: fill, 'font-family': font || 'IN', 'font-weight': wt || 700, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); }
function ICON(par, name, x, y, s, col, sw) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')', fill: 'none', stroke: col, 'stroke-width': sw || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = window.ICONS[name] || ''; return g; }
function R(par, x, y, w, h, at) { var a = { x: x, y: y, width: w, height: h, rx: 12 }; for (var k in at) a[k] = at[k]; return E('rect', a, par); }
function NB(par, n, x, y) { var g = E('g', {}, par); E('circle', { cx: x, cy: y, r: 17, fill: SAFF }, g); T(g, x, y + 7, String(n), 20, BG, 'SG', 700, 'middle'); return g; }

// ---------- static frame ----------
E('rect', { width: 1080, height: 1350, fill: BG });
var df = E('defs', {}), gp = E('pattern', { id: 'g', width: 40, height: 40, patternUnits: 'userSpaceOnUse' }, df);
E('path', { d: 'M40 0H0V40', fill: 'none', stroke: GRID, 'stroke-width': 1 }, gp);
E('rect', { width: 1080, height: 1350, fill: 'url(#g)' });
T(svg, 56, 76, 'Google gave AI agents', 54, TXT, 'SG', 700, 'start', -1.2);
var hl = T(svg, 56, 138, 'an ', 54, TXT, 'SG', 700, 'start', -1.2); E('tspan', { fill: MINT }, hl, 'employee badge.');
T(svg, 56, 178, 'GEMINI AGENT · ANNOUNCED OCT 8, 2026 · AS GOOGLE DESCRIBES IT', 20, MUTE, 'PM', 600, 'start', .5);

// team (outside the sandbox)
var team = E('g', {}); R(team, 56, 204, 250, 58, { fill: PANEL, stroke: LINE, 'stroke-width': 2 }); ICON(team, 'users', 70, 217, 1.35, TXT);
T(team, 112, 240, 'YOUR TEAM', 22, TXT, 'PM', 700); var teamSt = T(svg, 322, 241, '', 20, MINT, 'PM', 700);
// sandbox
var sbx = R(svg, 40, 282, 760, 418, { fill: 'none', stroke: MINT, 'stroke-width': 2.5, 'stroke-dasharray': '14 10', rx: 18, opacity: .75 });
R(svg, 92, 268, 330, 30, { fill: BG, rx: 6 }); T(svg, 106, 290, 'AGENT SANDBOX · OWN NETWORK', 19, MINT, 'PM', 700);
// orchestrator
var orch = E('g', {}); var orR = R(orch, 60, 300, 460, 100, { fill: PANEL, stroke: VIO, 'stroke-width': 2.5 }); ICON(orch, 'robot', 76, 314, 1.6, VIO);
T(orch, 122, 340, 'GEMINI AGENT', 26, TXT, 'SG', 700); var think = T(orch, 506, 340, '', 19, VIO, 'PM', 700, 'end');
T(orch, 76, 384, 'MODEL', 17, MUTE, 'PM', 600);
var pill = R(orch, 150, 358, 300, 36, { fill: BG, stroke: LINE, 'stroke-width': 2, rx: 18 }), knob = R(orch, 152, 360, 148, 32, { fill: VIO, rx: 16 });
var mG = T(orch, 226, 383, 'GEMINI', 19, BG, 'PM', 700, 'middle'), mC = T(orch, 374, 383, 'CLAUDE', 19, MUTE, 'PM', 700, 'middle');
NB(svg, 1, 520, 302);
// coworker agents (persistent)
var CW = [{ id: 'events', x: 545 }, { id: 'finance', x: 668 }], cwG = [];
CW.forEach(function (c) { var g = E('g', {}); R(g, c.x, 300, 113, 100, { fill: PANEL, stroke: MINT, 'stroke-width': 2.5 });
  ICON(g, 'robot', c.x + 10, 310, 1.1, MINT); c.dot = E('circle', { cx: c.x + 98, cy: 318, r: 6, fill: MINT }, g);
  T(g, c.x + 12, 362, c.id, 20, TXT, 'PM', 700); c.mail = ICON(g, 'mail', c.x + 10, 370, .95, MUTE); ICON(g, 'calendar', c.x + 42, 370, .95, MUTE); ICON(g, 'cloud', c.x + 74, 370, .95, MUTE); cwG.push(g); });
NB(svg, 3, 781, 302);
// sub-agent slots (temporary)
var SA = [{ id: 'sa-01', x: 60 }, { id: 'sa-02', x: 216 }, { id: 'sa-03', x: 372 }];
SA.forEach(function (s) { s.ghost = R(svg, s.x, 450, 148, 112, { fill: 'none', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 6' });
  s.gt = T(svg, s.x + 74, 512, 'on demand', 17, '#4d6a7d', 'PM', 600, 'middle');
  s.wire = E('path', { d: 'M' + (290) + ' 400 C 290 425 ' + (s.x + 74) + ' 425 ' + (s.x + 74) + ' 450', fill: 'none', stroke: VIO, 'stroke-width': 2, 'stroke-dasharray': '5 6' });
  var g = E('g', {}); s.g = g; s.box = R(g, s.x, 450, 148, 112, { fill: PANEL, stroke: VIO, 'stroke-width': 2.5, 'stroke-dasharray': '9 6' });
  T(g, s.x + 12, 480, s.id, 22, TXT, 'PM', 700); s.bd = E('g', {}, g); R(s.bd, s.x + 12, 494, 84, 28, { fill: MINT, rx: 6 }); T(s.bd, s.x + 54, 515, 'ID ✓', 18, BG, 'PM', 700, 'middle');
  E('circle', { cx: s.x + 120, cy: 532, r: 15, fill: 'none', stroke: LINE, 'stroke-width': 5 }, g);
  s.ring = E('circle', { cx: s.x + 120, cy: 532, r: 15, fill: 'none', stroke: MINT, 'stroke-width': 5, 'stroke-dasharray': '94.25', transform: 'rotate(-90 ' + (s.x + 120) + ' 532)' }, g);
  s.task = T(g, s.x + 12, 550, '', 17, MUTE, 'PM', 600); });
NB(svg, 2, 60, 448);
// internal bus + policy ribbon + gateway + tools
var TOOLS = [{ n: 'MCP', ic: 'server' }, { n: 'JIRA', ic: 'ticket' }, { n: 'BIGQUERY', ic: 'database' }, { n: 'CRM', ic: 'building' }, { n: 'SLACK', ic: 'message' }, { n: 'NEED TO\nKNOW', ic: 'file-text', lock: 1 }];
TOOLS.forEach(function (o, i) { o.x = 40 + i * 127; o.cx = o.x + 57.5; });
E('line', { x1: 70, y1: 604, x2: 770, y2: 604, stroke: LINE, 'stroke-width': 3 });
TOOLS.forEach(function (o) { E('line', { x1: o.cx, y1: 604, x2: o.cx, y2: 832, stroke: LINE, 'stroke-width': 3 }); });
SA.concat(CW).forEach(function (s) { var cx = s.x + (s.ghost ? 74 : 56.5); E('line', { x1: cx, y1: s.ghost ? 562 : 400, x2: cx, y2: 604, stroke: LINE, 'stroke-width': 3, 'stroke-dasharray': s.ghost ? '4 5' : '0' }); });
var rib = E('g', {}); var ribR = R(rib, 52, 628, 736, 50, { fill: '#2a1020', stroke: ROSE, 'stroke-width': 2, rx: 8 });
ICON(rib, 'shield-check', 64, 640, 1.1, ROSE); T(rib, 98, 661, 'POLICY, WRITTEN ONCE: NO "NEED TO KNOW" DOCS', 20, '#ffd6e1', 'PM', 700);
var gw = E('g', {}); R(gw, 40, 716, 760, 78, { fill: '#10263a', stroke: SKY, 'stroke-width': 2.5, rx: 10 });
T(gw, 56, 740, 'AGENT GATEWAY · AI NETWORK FIREWALL', 19, SKY, 'PM', 700);
var gates = TOOLS.map(function (o) { return R(gw, o.cx - 22, 752, 44, 32, { fill: BG, stroke: SKY, 'stroke-width': 2, rx: 6 }); });
var scan = E('rect', { x: 40, y: 716, width: 70, height: 78, fill: SKY, opacity: .12, rx: 10 }, gw);
NB(svg, 4, 40, 716);
TOOLS.forEach(function (o) { var g = E('g', {}); o.box = R(g, o.x, 832, 115, 96, { fill: PANEL, stroke: o.lock ? ROSE : LINE, 'stroke-width': 2.5 });
  ICON(g, o.ic, o.cx - 16, 842, 1.35, o.lock ? ROSE : TXT); if (o.lock) ICON(g, 'lock', o.x + 84, 842, .8, ROSE);
  var ls = o.n.split('\n'); ls.forEach(function (l, k) { T(g, o.cx, 898 + k * 22 - (ls.length - 1) * 11, l, ls.length > 1 ? 17 : (l.length > 6 ? 18 : 20), o.lock ? '#ffd6e1' : TXT, 'PM', 700, 'middle'); }); o.g = g; });
T(svg, 40, 956, 'TOOLS & DATA · CONNECTORS + ANY MCP SERVER', 19, MUTE, 'PM', 600);
// spend meter
var mtr = E('g', {}); T(mtr, 40, 1000, 'PROJECT SPEND CAP', 20, SAFF, 'PM', 700); var mAmt = T(mtr, 560, 1000, '', 20, TXT, 'PM', 700, 'end');
R(mtr, 40, 1012, 520, 34, { fill: PANEL, stroke: LINE, 'stroke-width': 2, rx: 8 }); var mFill = R(mtr, 42, 1014, 0, 30, { fill: SAFF, rx: 7 });
var capL = E('line', { x1: 0, y1: 1006, x2: 0, y2: 1052, stroke: ROSE, 'stroke-width': 4 }, mtr);
var mSt = E('g', {}, mtr); var mStR = R(mSt, 580, 1010, 220, 38, { fill: BG, stroke: SAFF, 'stroke-width': 2, rx: 19 }); var mStT = T(mSt, 690, 1036, '', 19, SAFF, 'PM', 700, 'middle');
NB(svg, 5, 22, 1029);
// audit trail column
var au = E('g', {}); R(au, 818, 204, 222, 852, { fill: PANEL, stroke: LINE, 'stroke-width': 2 }); ICON(au, 'badge', 832, 218, 1.1, MINT);
T(au, 864, 238, 'AUDIT TRAIL', 21, TXT, 'PM', 700); T(au, 832, 266, 'signed by agent,', 18, MUTE, 'PM', 600); T(au, 832, 288, 'not by a person', 18, MUTE, 'PM', 600);
E('line', { x1: 832, y1: 302, x2: 1026, y2: 302, stroke: LINE, 'stroke-width': 2 }, au);
var cp = E('clipPath', { id: 'auc' }, df); E('rect', { x: 818, y: 304, width: 222, height: 750 }, cp); var aug = E('g', { 'clip-path': 'url(#auc)' }, au);
var AUL = []; for (var i = 0; i < 17; i++) { var g = E('g', { class: 'aul' }, aug); var bg = R(g, 826, 0, 206, 40, { fill: 'transparent', rx: 6 }); var tx = T(g, 834, 27, '', 19, TXT, 'PM', 700); AUL.push({ g: g, bg: bg, tx: tx }); }
// legend
var LEG = [[1, 'One agent. The model under it is a separate choice.'], [2, 'Temporary sub-agents, each with its own identity.'], [3, 'Coworker agents: own @agents email, calendar, Drive.'], [4, 'All traffic via Agent Gateway; policy written once.'], [5, 'Every action logged to the agent; spend cap pauses it.']];
LEG.forEach(function (l, i) { var y = 1100 + i * 44; NB(svg, l[0], 58, y - 8); T(svg, 88, y, l[1], 22, TXT, 'IN', 500); });
T(svg, 40, 1322, 'Source: Google Cloud blog, Oct 8, 2026 (private preview). Diagram is illustrative.', 20, MUTE, 'IN', 500);
// moving layers (on top)
var gl = E('filter', { id: 'glow', x: '-1', y: '-1', width: '3', height: '3' }, df); E('feGaussianBlur', { stdDeviation: 5, result: 'b' }, gl); var fm = E('feMerge', {}, gl); E('feMergeNode', { in: 'b' }, fm); E('feMergeNode', { in: 'SourceGraphic' }, fm);
var pk = E('g', { filter: 'url(#glow)' }), fx = E('g', {});
var pausedG = E('g', {}); R(pausedG, 60, 412, 720, 192, { fill: '#0b1620', stroke: SAFF, 'stroke-width': 3, rx: 14 });
ICON(pausedG, 'player-pause', 92, 452, 2.2, SAFF, 2.4); T(pausedG, 160, 486, 'PAUSED: SPEND CAP HIT', 34, SAFF, 'SG', 700); T(pausedG, 160, 528, 'nothing runs until an admin resumes', 22, TXT, 'IN', 500);
var cur = E('path', { d: 'M0 0 L0 34 L9 26 L15 40 L21 37 L15 24 L27 24 Z', fill: TXT, stroke: BG, 'stroke-width': 2 });

// ---------- the timeline (work clock: real time minus the cap pause) ----------
var REQ = [['sa-01', 1, 2.6], ['sa-02', 2, 2.9], ['events', 4, 3.2], ['sa-03', 0, 3.5], ['sa-01', 1, 4.1], ['finance', 2, 4.4], ['sa-03', 5, 4.8, 1], ['sa-02', 3, 5.2], ['events', 4, 5.6], ['sa-01', 0, 6.25], ['sa-02', 2, 6.55], ['finance', 3, 6.85]];
var SPAWN = [1.8, 2.05, 2.3], DONE = [7.45, 7.65, 7.85], TASK = ['tickets', 'sales', 'docs'];
var D1 = .25, D2 = .3, D3 = .4, CROSS = D1 + D2 + .26, HIT = D1 + D2 + D3, RET = .55, UNIT = 8;
var P0 = 5.6 + CROSS, PAUSE = .8;   // the 8th allowed crossing fills the meter to the 64% cap -> pause
function wclock(t) { return t < P0 ? t : (t < P0 + PAUSE ? P0 : t - PAUSE); }
function src(id) { var s = SA.filter(function (a) { return a.id === id; })[0]; if (s) return { x: s.x + 74, y: 562, sa: s }; var c = CW.filter(function (a) { return a.id === id; })[0]; return { x: c.x + 56.5, y: 400, cw: c }; }
// packet position along: source -> bus (y 604) -> lane x -> down to tool top (832); blocked packets stop at the ribbon (628)
function route(r, u) { var s = src(r[0]), lx = TOOLS[r[1]].cx; var y1 = 604, yEnd = r[3] ? 628 : 832, a = D1, b = D2, c = r[3] ? .22 : D3, L = a + b + c;
  var d = u * L; if (d < a) return [s.x, lerp(s.y, y1, d / a)]; d -= a; if (d < b) return [lerp(s.x, lx, sm(d / b)), y1]; d -= b; return [lx, lerp(y1, yEnd, d / c)]; }
// audit events (real time, for any loop offset)
var AUD = [];
function addA(w, txt, col) { AUD.push({ w: w, txt: txt, col: col }); }
SPAWN.forEach(function (w, i) { addA(w + .3, SA[i].id + ' ID ✓ new', MINT); });
var allowed = 0; REQ.forEach(function (r) { if (r[3]) addA(r[2] + D1 + D2 + .22, r[0] + ' ntk ✗ BLOCK', ROSE); else { allowed++; r.n = allowed; addA(r[2] + CROSS, r[0] + ' ' + ({ MCP: 'mcp', JIRA: 'jira', BIGQUERY: 'bq', CRM: 'crm', SLACK: 'slack' })[TOOLS[r[1]].n] + ' ✓', SKY); } });
addA(P0 + .01, 'CAP HIT · PAUSE', SAFF); addA(P0 + .02, 'admin: resume', TXT);
DONE.forEach(function (w, i) { addA(w + .35, SA[i].id + ' done · end', VIO); });
addA(8.95, 'result → team', MINT);
function realOf(w, lineOrder) { return w < P0 ? w : (lineOrder === 'resume' ? w + PAUSE - .2 : w + PAUSE); }
AUD.forEach(function (a) { a.t = a.txt === 'admin: resume' ? P0 + PAUSE - .15 : (a.txt === 'CAP HIT · PAUSE' ? P0 + .02 : realOf(a.w)); });

window.__reelDurationSec = DUR;
window.__seek = function (t) {
  t = ((t % DUR) + DUR) % DUR; var w = wclock(t), paused = t >= P0 && t < P0 + PAUSE;
  pk.innerHTML = ''; fx.innerHTML = '';
  // ambient: sandbox border marches, gateway scan sweeps (both close the loop at t = 10)
  sbx.setAttribute('stroke-dashoffset', (-t * 24 * 3 / DUR * 2).toFixed(1)); var sx = ((t / 2.5) % 1); scan.setAttribute('x', (40 + sx * 690).toFixed(1));
  // 0 team -> agent: objective; 8.6..9 result back
  var ob = clamp((w - .15) / .5, 0, 1); if (w > .15 && w < .65) E('circle', { cx: 181, cy: lerp(262, 300, ob), r: 10, fill: VIO, stroke: TXT, 'stroke-width': 2 }, pk);
  var rb = clamp((w - 8.55) / .4, 0, 1); if (w > 8.55 && w < 8.95) E('circle', { cx: 181, cy: lerp(300, 262, rb), r: 11, fill: MINT, stroke: TXT, 'stroke-width': 2 }, pk);
  teamSt.textContent = w < .15 ? '' : (w < 8.95 ? 'objective sent' : 'DONE ✓'); teamSt.setAttribute('fill', w < 8.95 ? MUTE : MINT);
  // model switch: plan + synthesis on Claude, routine steps on Gemini (smart routing)
  var claude = (w >= .7 && w < 1.75) || (w >= 7.95 && w < 8.6), kx = claude ? 1 : 0, kt = 0;
  [[.7, 1], [1.75, 0], [7.95, 1], [8.6, 0]].forEach(function (s) { if (w >= s[0] && w < s[0] + .18) { kt = 1; kx = lerp(1 - s[1], s[1], sm((w - s[0]) / .18)); } });
  knob.setAttribute('x', (152 + kx * 148).toFixed(1)); knob.setAttribute('fill', kx > .5 ? CLA : VIO); mG.setAttribute('fill', kx > .5 ? MUTE : BG); mC.setAttribute('fill', kx > .5 ? BG : MUTE);
  var thinking = (w >= .65 && w < 1.8) || (w >= 7.9 && w < 8.6); think.textContent = thinking ? (claude ? 'planning' : 'routing') + '.'.repeat(1 + Math.floor(t * 4) % 3) : (w > 1.8 && w < 7.9 ? 'orchestrating' : '');
  orR.setAttribute('stroke-width', thinking ? 4 : 2.5);
  // sub-agents: spawn with a badge stamp, work (ring), report back, fold away
  SA.forEach(function (s, i) { var a = SPAWN[i], d = DONE[i], on = w >= a && w < d + .5, u = clamp((w - a) / .3, 0, 1), f = clamp((w - d - .25) / .25, 0, 1);
    s.g.setAttribute('opacity', on ? (u * (1 - f)).toFixed(2) : 0); s.g.setAttribute('transform', 'translate(0,' + ((1 - u) * -26).toFixed(1) + ') scale(1)');
    s.ghost.setAttribute('opacity', on && u > .9 && f < .1 ? 0 : 1); s.gt.setAttribute('opacity', on ? 0 : 1);
    s.wire.setAttribute('stroke-opacity', on ? 1 : .25);
    var st = clamp((w - a - .3) / .25, 0, 1); s.bd.setAttribute('transform', 'translate(' + (s.x + 54) + ',508) scale(' + (st > 0 && st < 1 ? 1 + .5 * (1 - st) : 1) + ') translate(' + (-(s.x + 54)) + ',-508)'); s.bd.setAttribute('opacity', st > 0 ? 1 : 0);
    var pr = clamp((w - a - .5) / (d - a - .5), 0, 1); s.ring.setAttribute('stroke-dashoffset', (94.25 * (1 - pr)).toFixed(1)); s.task.textContent = pr >= 1 ? 'done ✓' : TASK[i];
    if (w > a - .45 && w < a) { var v = (w - a + .45) / .45; E('circle', { cx: lerp(290, s.x + 74, v), cy: lerp(400, 450, v), r: 8, fill: VIO }, pk); }
    if (w > d && w < d + .35) { var q = (w - d) / .35; E('circle', { cx: lerp(s.x + 74, 290, q), cy: lerp(450, 400, q), r: 9, fill: MINT, stroke: TXT, 'stroke-width': 2 }, pk); } });
  // coworkers: online pulse; mail arrives before each of their tasks
  CW.forEach(function (c) { c.dot.setAttribute('opacity', (.55 + .45 * Math.sin(t * Math.PI * 2 / 2.5)).toFixed(2)); var hot = REQ.some(function (r) { return r[0] === c.id && w > r[2] - .5 && w < r[2]; }); c.mail.setAttribute('stroke', hot ? SAFF : MUTE); });
  // requests
  var spent = 0; TOOLS.forEach(function (o, i) { o.box.setAttribute('fill', PANEL); gates[i].setAttribute('fill', BG); });
  ribR.setAttribute('fill', '#2a1020');
  REQ.forEach(function (r) { var L = D1 + D2 + (r[3] ? .22 : D3), u = (w - r[2]) / L;
    if (!r[3] && w >= r[2] + CROSS) spent++;
    if (u > 0 && u < 1) { for (var k = 3; k >= 1; k--) { var pt = route(r, Math.max(0, u - k * .045)); E('circle', { cx: pt[0], cy: pt[1], r: 10 - k * 2, fill: r[3] ? ROSE : SKY, opacity: (.55 - k * .14).toFixed(2) }, pk); } var p = route(r, u); E('circle', { cx: p[0], cy: p[1], r: 10, fill: r[3] ? ROSE : SKY, stroke: TXT, 'stroke-width': 2 }, pk); }
    if (!r[3]) { var g = gates[r[1]]; if (w > r[2] + CROSS - .12 && w < r[2] + CROSS + .2) g.setAttribute('fill', SKY);
      if (w > r[2] + HIT && w < r[2] + HIT + .3) TOOLS[r[1]].box.setAttribute('fill', '#163a52');
      var rv = (w - r[2] - HIT - .05) / RET; if (rv > 0 && rv < 1) { var q = route(r, 1 - rv); E('circle', { cx: q[0], cy: q[1], r: 6, fill: '#bfe6ff' }, pk); } }
    else { var bt = w - (r[2] + L); if (bt > 0 && bt < .6) { ribR.setAttribute('fill', '#5a1530'); var lx = TOOLS[r[1]].cx;
        E('g', { transform: 'translate(' + lx + ',628) scale(' + (1 + bt) + ')', opacity: (1 - bt / .6).toFixed(2) }, fx).innerHTML = '<circle r="20" fill="none" stroke="' + ROSE + '" stroke-width="4"/><path d="M-8 -8 L8 8 M8 -8 L-8 8" stroke="' + ROSE + '" stroke-width="4" stroke-linecap="round"/>';
        if (bt < .45) { var bp = route(r, 1 - bt / .45); E('circle', { cx: bp[0], cy: bp[1], r: 8, fill: ROSE }, pk); } } } });
  // meter: 8% per tool call; cap at 64% until the admin resumes (cap raised to 100%); drains when the task ends
  var drain = clamp((w - 9.0) / .2, 0, 1), cap = w < P0 ? 64 : lerp(64, 100, sm((t - P0 - PAUSE + .2) / .3)); if (w >= 9.0) cap = lerp(100, 64, drain);
  var pct = spent * UNIT * (1 - drain); mFill.setAttribute('width', (516 * pct / 100).toFixed(1)); capL.setAttribute('x1', 42 + 516 * cap / 100); capL.setAttribute('x2', 42 + 516 * cap / 100);
  mFill.setAttribute('fill', paused ? (Math.floor(t * 6) % 2 ? SAFF : ROSE) : SAFF); mAmt.textContent = Math.round(pct) + '% of cap ' + Math.round(cap) + '%';
  mStT.textContent = paused ? 'PAUSED' : (w >= P0 && w < 9.0 ? 'RESUMED ▶' : (w >= 9.0 ? 'TASK CLOSED' : 'RUNNING')); mStR.setAttribute('stroke', paused ? ROSE : SAFF); mStT.setAttribute('fill', paused ? ROSE : SAFF);
  pausedG.setAttribute('opacity', paused ? 1 : 0); var pz = paused ? 1 + .05 * clamp(1 - (t - P0) / .15, 0, 1) : 1; pausedG.setAttribute('transform', 'translate(420,508) scale(' + pz.toFixed(3) + ') translate(-420,-508)');
  // admin cursor: comes in, clicks the meter's status pill, leaves
  var cu = clamp((t - P0 - .1) / .45, 0, 1), cl = clamp((t - P0 - PAUSE + .1) / .4, 0, 1), cvis = t > P0 + .1 && t < P0 + PAUSE + .3;
  cur.setAttribute('opacity', cvis ? 1 : 0); cur.setAttribute('transform', 'translate(' + lerp(980, 700, sm(cu)) + ',' + lerp(1300, 1030, sm(cu)) + ') translate(' + (cl * 80) + ',' + (cl * 120) + ')');
  if (t > P0 + PAUSE - .2 && t < P0 + PAUSE + .15) { var ck = (t - P0 - PAUSE + .2) / .35; E('circle', { cx: 700, cy: 1030, r: 10 + 30 * ck, fill: 'none', stroke: SAFF, 'stroke-width': 3, opacity: (1 - ck).toFixed(2) }, fx); }
  // audit tape: newest on top; includes the previous loop's lines so the loop is seamless
  var lines = []; [-DUR, 0].forEach(function (o) { AUD.forEach(function (a) { if (a.t + o <= t) lines.push({ t: a.t + o, txt: a.txt, col: a.col }); }); });
  lines.sort(function (a, b) { return b.t - a.t; });
  var s0 = lines.length ? sm((t - lines[0].t) / .25) : 1;   // the list glides down one row as each new line enters from under the header (clipped)
  AUL.forEach(function (L, i) { var a = lines[i]; if (!a) { L.g.setAttribute('opacity', 0); return; } var age = t - a.t;
    L.g.setAttribute('transform', 'translate(0,' + (312 + (i - 1 + s0) * 43).toFixed(1) + ')'); L.g.setAttribute('opacity', (i > 14 ? Math.max(0, (17 - i - s0) / 3) : 1).toFixed(2));
    L.tx.textContent = a.txt; L.tx.setAttribute('fill', a.col); L.bg.setAttribute('fill', age < .6 ? 'rgba(76,184,255,' + (.18 * (1 - age / .6)).toFixed(2) + ')' : 'transparent'); });
};
window.__seek(0);
})();
