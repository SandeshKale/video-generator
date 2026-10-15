// "When an AI agent hits a wall, it looks for a way around it" — Anthropic's Oct 9 2026 disclosure of unintended model
// actions, drawn as a containment stack. 1080×1350, 12 s loop. JULY (flashback): live internet is on in evals, the outer
// layers do not exist yet, and an attempt reaches a real site's tip form. OCT 9: the airlock seals, training stops paying
// for workarounds, and four real behaviour types (URL shortener, command injection, reused access token, government form)
// are each caught at a different layer, deeper and deeper out. Each catch writes a row in the ledger and ticks its layer.
// Which layer catches which attempt is illustrative (Anthropic says its detect-and-block tool alone caught every case).
// window.__seek(t) is a pure function of t.
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', W = 1080, H = 1350, DUR = 12;
var BG = '#11130e', DOT = '#22261b', PANEL = '#181b13', DEEP = '#0c0e09', LINE = '#30362a', TXT = '#ece6d6', MUTE = '#a39d8c', FAINT = '#6f6b5f',
  CY = '#7fe0ff', CH = '#c8f04a', CO = '#ff5a4e', AM = '#ffb547';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function lerp(a, b, u) { return a + (b - a) * u; }
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function T(par, x, y, s, size, fill, font, wt, anchor, ls) { return E('text', { x: x, y: y, fill: fill, 'font-family': font || 'IN', 'font-weight': wt || 500, 'font-size': size, 'text-anchor': anchor || 'start', 'letter-spacing': ls || 0 }, par, s); }
function ICON(par, name, x, y, s, col, sw) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s + ')', fill: 'none', stroke: col, 'stroke-width': sw || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = window.ICONS[name] || ''; return g; }
function R(par, x, y, w, h, at) { var a = { x: x, y: y, width: w, height: h, rx: 10 }; for (var k in at) a[k] = at[k]; return E('rect', a, par); }
function NB(par, n, x, y, col) { var g = E('g', {}, par); var c = E('circle', { cx: x, cy: y, r: 17, fill: col || CH }, g); T(g, x, y + 8, String(n), 22, BG, 'BS', 800, 'middle'); return { g: g, c: c }; }
function tick(par, x, y, col) { var g = E('g', { opacity: 0 }, par); E('circle', { cx: x, cy: y, r: 15, fill: col }, g); E('path', { d: 'M' + (x - 7) + ' ' + y + ' l5 5 l9 -10', fill: 'none', stroke: BG, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }

// ---------- timeline ----------
var B0 = 0.25, B1 = 1.55, TR0 = 2.3, TR1 = 2.95, RS0 = 11.35, RS1 = 11.9;
var AT = [3.0, 4.75, 6.5, 8.25];          // attempt k starts; pulse leaves at +.3, is caught at +1.0
// conduits: x in the stack, route height in the fan zone, target building(s)
var BX = [126, 328, 530, 732, 934];
var CONDUIT = [{ x: 480, ry: 322, to: [0] }, { x: 620, ry: 304, to: [1, 2] }, { x: 760, ry: 304, to: [3] }, { x: 900, ry: 322, to: [4] }];
var BANDY = [375, 455, 535, 615];          // centre y of layer ① (outer, top) … ④ (inner, bottom)
// attempts: conduit, building, layer that catches it (0-based: 0 = ①), stamp, agent text, ledger text
var ATT = [
  { c: 3, b: 4, L: 3, stamp: 'BLOCKED', ob: 'fetch tool: URL too long', tries: 'shorten it with a free shortener', led: 'URL shortener', by: '④ tool guardrails' },
  { c: 0, b: 0, L: 2, stamp: 'BLOCKED', ob: 'a tool it needs is blocked', tries: 'inject a command into a server', led: 'command injection', by: '③ detect & block' },
  { c: 2, b: 3, L: 1, stamp: 'FLAGGED', ob: 'the data sits behind a fee', tries: 'reuse an access token', led: 'reused access token', by: '② classifier monitor' },
  { c: 1, b: 1, L: 0, stamp: 'NO ROUTE', ob: 'it can\'t confirm an answer', tries: 'submit a government form', led: 'government form', by: '① internet off' }];
var BEFORE = { c: 1, b: 2, ob: 'it can\'t confirm an answer', tries: 'submit a real site\'s tip form' };

// ---------- static frame ----------
var df = E('defs', {}); var dp = E('pattern', { id: 'd', width: 30, height: 30, patternUnits: 'userSpaceOnUse' }, df); E('circle', { cx: 15, cy: 15, r: 1.3, fill: DOT }, dp);
var hp = E('pattern', { id: 'hz', width: 16, height: 16, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, df); E('rect', { width: 7, height: 16, fill: CH }, hp);
var gl = E('filter', { id: 'glow', x: '-1', y: '-1', width: '3', height: '3' }, df); E('feGaussianBlur', { stdDeviation: 5, result: 'b' }, gl); var fm = E('feMerge', {}, gl); E('feMergeNode', { in: 'b' }, fm); E('feMergeNode', { in: 'SourceGraphic' }, fm);
E('rect', { width: W, height: H, fill: BG }); E('rect', { width: W, height: H, fill: 'url(#d)' });
var t1 = T(svg, 34, 74, 'WHEN AN AI AGENT HITS A WALL,', 66, TXT, 'BS', 800, 'start', .5);
var t2 = T(svg, 34, 140, 'IT LOOKS FOR ', 66, TXT, 'BS', 800, 'start', .5); E('tspan', { fill: CO }, t2, 'A WAY AROUND IT.');
T(svg, 36, 176, 'ANTHROPIC\'S OWN DISCLOSURE · OCT 9, 2026 · AND ITS 5 FIXES', 18, MUTE, 'GM', 500, 'start', .4);

// skyline: real websites
T(svg, 36, 212, 'THE LIVE WEB · REAL SITES', 17, AM, 'GM', 600, 'start', .8);
var badge = E('g', {}); var badgeR = R(badge, 742, 191, 304, 30, { rx: 15, fill: DEEP, 'stroke-width': 2 }); var badgeT = T(badge, 894, 212, '', 17, CO, 'GM', 600, 'middle', .6);
var SITES = [['school', 'university', 'tool'], ['building-bank', '.gov', 'form'], ['alert-triangle', 'police', 'tip form'], ['database', 'paid', 'database'], ['link', 'URL', 'shortener']];
var bld = SITES.map(function (s, i) { var x = BX[i] - 96, g = E('g', {}); var r = R(g, x, 226, 192, 64, { fill: PANEL, stroke: AM, 'stroke-width': 2, 'stroke-opacity': .7 });
  ICON(g, s[0], x + 12, 240, 1.45, AM); T(g, x + 54, 253, s[1], 18.5, TXT, 'GM', 500); T(g, x + 54, 276, s[2], 18.5, TXT, 'GM', 500);
  var win = []; for (var k = 0; k < 3; k++) win.push(R(g, x + 175, 236 + k * 16, 8, 9, { rx: 2, fill: AM, opacity: .3 }));
  return { g: g, r: r, win: win }; });

// the containment stack: ① outer (top) … ④ inner (bottom), the agent's chamber beneath
var LAYERS = [['INTERNET OFF', 'all internal evals · contained infra', 'world'], ['CLASSIFIER MONITORS', '+ summarised transcript review', 'eye'], ['DETECT & BLOCK', 'automatic, on agent runs', 'shield'], ['TOOL GUARDRAILS', 'tighter web-fetch limits', 'filter']];
var lay = LAYERS.map(function (L, i) { var y = BANDY[i] - 35, g = E('g', {});
  var r = R(g, 24, y, 1032, 70, { fill: PANEL, stroke: CH, 'stroke-width': 2 });
  var nb = NB(g, i + 1, 58, BANDY[i]); var tt = T(g, 86, BANDY[i] - 5, L[0], 22, TXT, 'GM', 600, 'start', .4); var st = T(g, 86, BANDY[i] + 21, L[1], 17, MUTE, 'IN', 500);
  var ic = ICON(g, L[2], 1006, BANDY[i] - 16, 1.35, CH); var tk = tick(g, 420, BANDY[i], CH);
  return { g: g, r: r, nb: nb, tt: tt, st: st, ic: ic, tk: tk }; });
// conduits (drawn over the layer fills, under the ports and pulses)
var condG = E('g', {});
function cPath(c, bi) { var b = BX[bi]; return [[c.x, 690], [c.x, c.ry], [b, c.ry], [b, 290]]; }
var CPATHS = []; CONDUIT.forEach(function (c, ci) { c.to.forEach(function (bi) { CPATHS.push({ ci: ci, bi: bi, pts: cPath(c, bi) }); }); });
var condEl = CPATHS.map(function (p) { var d = 'M' + p.pts.map(function (q) { return q.join(' '); }).join(' L');
  var base = E('path', { d: d, fill: 'none', stroke: LINE, 'stroke-width': 5, 'stroke-linejoin': 'round' }, condG);
  var flow = E('path', { d: d, fill: 'none', stroke: CY, 'stroke-width': 2.5, 'stroke-dasharray': '6 14', 'stroke-linejoin': 'round', opacity: .35 }, condG);
  var outer = E('path', { d: 'M' + p.pts.slice(1).map(function (q) { return q.join(' '); }).join(' L') + ' M' + p.pts[0][0] + ' 340 L' + p.pts[0][0] + ' ' + p.pts[1][1], fill: 'none', stroke: BG, 'stroke-width': 6, opacity: 0 }, condG);
  return { base: base, flow: flow, outer: outer }; });

// airlock ports on layer ①
var ports = CONDUIT.map(function (c) { var g = E('g', {}); var open = R(g, c.x - 17, 342, 34, 66, { rx: 5, fill: BG, stroke: CO, 'stroke-width': 2, 'stroke-dasharray': '5 5' });
  var shut = R(g, c.x - 17, 342, 34, 66, { rx: 5, fill: 'url(#hz)', stroke: CH, 'stroke-width': 2, opacity: 0 }); return { open: open, shut: shut }; });
var layerFx = E('g', {});

// the eval chamber
var ch = E('g', {}); R(ch, 24, 666, 1032, 296, { fill: DEEP, stroke: CY, 'stroke-width': 2.5, rx: 14 });
T(ch, 44, 698, 'EVAL CHAMBER · AI AGENT AT WORK', 18, CY, 'GM', 600, 'start', .6);
R(ch, 440, 680, 500, 22, { rx: 11, fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); T(ch, 690, 696, 'OUTBOUND REQUESTS', 14.5, FAINT, 'GM', 500, 'middle', 1);
var agBox = R(ch, 44, 716, 96, 96, { fill: PANEL, stroke: CY, 'stroke-width': 2 }); ICON(ch, 'robot', 62, 734, 2.5, CY);
var scan = E('rect', { x: 46, y: 718, width: 92, height: 3, fill: CY, opacity: .55 }, ch);
T(ch, 160, 736, 'OBSTACLE', 16, MUTE, 'GM', 500, 'start', 1); var obT = T(ch, 160, 764, '', 23, TXT, 'IN', 700);
T(ch, 160, 798, 'SO IT TRIES TO', 16, MUTE, 'GM', 500, 'start', 1); var trT = T(ch, 160, 826, '', 23, CY, 'IN', 700); var cur = E('rect', { x: 160, y: 808, width: 3, height: 24, fill: CY }, ch);
// log
R(ch, 44, 846, 520, 100, { fill: PANEL, stroke: LINE, 'stroke-width': 1.5 }); var logT = [0, 1, 2].map(function (k) { return T(ch, 60, 876 + k * 28, '', 17, MUTE, 'GM', 500); });
// ⑤ training: does a workaround pay?
var trn = E('g', {}); var trnR = R(trn, 584, 846, 452, 100, { fill: PANEL, stroke: CO, 'stroke-width': 2 }); var nb5 = NB(trn, 5, 612, 876, CO);
T(trn, 638, 883, 'TRAINING: DOES A WORKAROUND PAY?', 16.5, TXT, 'GM', 600, 'start', .3);
R(trn, 602, 902, 196, 24, { rx: 12, fill: DEEP, stroke: LINE, 'stroke-width': 1.5 }); var payBar = R(trn, 604, 904, 0, 20, { rx: 10, fill: CO }); var payT = T(trn, 814, 921, '', 18, CO, 'GM', 600);
var tk5 = tick(trn, 1010, 876, CH);

// ledger
var led = E('g', {}); R(led, 24, 978, 1032, 270, { fill: PANEL, stroke: LINE, 'stroke-width': 2 });
T(led, 44, 1008, 'WHAT IT TRIED', 16, MUTE, 'GM', 600, 'start', 1); T(led, 540, 1008, 'CAUGHT BY', 16, MUTE, 'GM', 600, 'start', 1); T(led, 1036, 1008, 'RESULT', 16, MUTE, 'GM', 600, 'end', 1);
E('line', { x1: 40, y1: 1020, x2: 1040, y2: 1020, stroke: LINE, 'stroke-width': 1.5 }, led);
var ROWS = [{ a: 'JULY · a real site\'s tip form', b: 'nothing · internet on', r: 'REACHED', col: CO, t: B1 }].concat(ATT.map(function (a, k) { return { a: a.led, b: a.by, r: a.stamp, col: CH, t: AT[k] + 1.0 }; }));
var skel = ROWS.map(function (rw, k) { var y = 1052 + k * 44, g = E('g', {}, led); R(g, 44, y - 15, 150 + hash(k + 3) * 160, 14, { rx: 7, fill: LINE, opacity: .7 }); R(g, 540, y - 15, 120 + hash(k + 9) * 90, 14, { rx: 7, fill: LINE, opacity: .7 }); R(g, 960, y - 21, 76, 28, { rx: 6, fill: 'none', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '5 5' }); return g; });
var rowEl = ROWS.map(function (rw, k) { var y = 1052 + k * 44, g = E('g', { opacity: 0 }, led);
  T(g, 44, y, rw.a, 21, TXT, 'IN', 500); T(g, 540, y, rw.b, 21, rw.col === CO ? CO : TXT, 'GM', 500);
  var w = rw.r.length * 12.6 + 22; R(g, 1036 - w, y - 21, w, 28, { rx: 6, fill: rw.col }); T(g, 1036 - w / 2, y - 1, rw.r, 17.5, BG, 'GM', 600, 'middle', .5);
  return g; });
T(svg, 36, 1290, 'Paths are illustrative. Anthropic says its new detect-and-block tool stopped every case in its review.', 17.5, MUTE, 'IN', 500);
T(svg, 36, 1318, 'Source: Anthropic, "Investigating unintended model actions", Oct 9, 2026. No customer data was involved.', 17.5, FAINT, 'IN', 500);

var fx = E('g', {});   // pulses, bursts, stamps (redrawn every frame)

// ---------- helpers ----------
function pathPt(pts, u) { var L = [], tot = 0; for (var i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
  var d = clamp(u, 0, 1) * tot; for (var j = 0; j < L.length; j++) { if (d <= L[j] || j === L.length - 1) { var f = L[j] ? clamp(d / L[j], 0, 1) : 0; return [lerp(pts[j][0], pts[j + 1][0], f), lerp(pts[j][1], pts[j + 1][1], f)]; } d -= L[j]; } return pts[pts.length - 1]; }
function upTo(pts, y) { var out = [pts[0]]; for (var i = 1; i < pts.length; i++) { if (pts[i][1] < y && pts[i - 1][1] >= y) { out.push([pts[i - 1][0], y]); return out; } out.push(pts[i]); } return out; }
function pulse(x, y, col, a) { var g = E('g', { opacity: a.toFixed(2) }, fx); E('circle', { cx: x, cy: y, r: 16, fill: col, opacity: .25 }, g); E('circle', { cx: x, cy: y, r: 9, fill: col, filter: 'url(#glow)' }, g); }
function stamp(x, y, s, col, side, a) { var w = s.length * 13 + 26, x0 = side > 0 ? x + 22 : side < 0 ? x - 22 - w : x - w / 2; var g = E('g', { opacity: a.toFixed(2) }, fx);
  R(g, x0, y - 18, w, 36, { rx: 6, fill: BG, stroke: col, 'stroke-width': 2.5 }); T(g, x0 + w / 2, y + 7, s, 19, col, 'GM', 600, 'middle', .6); }
function ex(x, y, col, a) { var g = E('g', { opacity: a.toFixed(2) }, fx); E('circle', { cx: x, cy: y, r: 12, fill: BG, stroke: col, 'stroke-width': 3 }, g); E('path', { d: 'M' + (x - 5) + ' ' + (y - 5) + ' l10 10 M' + (x + 5) + ' ' + (y - 5) + ' l-10 10', stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round' }, g); }
function type(s, u) { return s.slice(0, Math.round(s.length * clamp(u, 0, 1))); }
function cpIndex(ci, bi) { for (var i = 0; i < CPATHS.length; i++) if (CPATHS[i].ci === ci && CPATHS[i].bi === bi) return i; return 0; }

window.__reelDurationSec = DUR;
var OFFSET = 5.35;   // GIF frame 0 lands mid-attempt (LinkedIn shows frame 0 while the GIF loads); the loop itself is unchanged
window.__seek = function (t0) {
  var t = (((t0 + OFFSET) % DUR) + DUR) % DUR; fx.innerHTML = '';
  var N = sm((t - TR0) / (TR1 - TR0)) * (1 - sm((t - RS0) / (RS1 - RS0)));   // 0 = July flashback, 1 = after Oct 9
  var fade = 1 - sm((t - RS0) / (RS1 - RS0));                                  // everything earned this loop fades out at the end
  // badge + layers
  badgeT.textContent = N > .5 ? 'OCT 9 · INTERNET OFF' : 'JULY · INTERNET ON'; badgeT.setAttribute('fill', N > .5 ? CH : CO); badgeR.setAttribute('stroke', N > .5 ? CH : CO);
  lay.forEach(function (l, i) { var a = .3 + .7 * N; l.r.setAttribute('stroke-opacity', a.toFixed(2)); l.r.setAttribute('stroke-dasharray', N > .5 ? 'none' : '8 8');
    l.tt.setAttribute('opacity', (.35 + .65 * N).toFixed(2)); l.st.setAttribute('opacity', (.35 + .65 * N).toFixed(2)); l.nb.g.setAttribute('opacity', (.35 + .65 * N).toFixed(2)); l.ic.setAttribute('opacity', (.3 + .7 * N).toFixed(2)); });
  ports.forEach(function (p) { p.open.setAttribute('opacity', (1 - N).toFixed(2)); p.shut.setAttribute('opacity', N.toFixed(2)); });
  // ambient: layer icons breathe, chamber scan, site windows flicker, conduits flow
  lay.forEach(function (l, i) { var x = 1006 + 16, y = BANDY[i]; var ph = (t * .8 + i * .25) % 1; if (N > .5) E('circle', { cx: x, cy: y, r: 16 + ph * 26, fill: 'none', stroke: CH, 'stroke-width': 2, opacity: (.45 * (1 - ph) * N).toFixed(2) }, fx); });
  scan.setAttribute('y', (718 + ((t * .9) % 1) * 90).toFixed(1));
  bld.forEach(function (b, i) { b.win.forEach(function (w, k) { w.setAttribute('opacity', hash(i * 7 + k * 3 + Math.floor(t * 3)) > .45 ? .75 : .2); }); });
  condEl.forEach(function (c) { c.flow.setAttribute('stroke-dashoffset', (-t * 40).toFixed(1)); c.outer.setAttribute('opacity', (N * .62).toFixed(2)); });
  // the agent's current obstacle and workaround
  var cur0 = null, s0 = 0;
  if (t < TR0) { cur0 = BEFORE; s0 = B0 - .2; } else { for (var k = 0; k < 4; k++) if (t >= AT[k] - .15) { cur0 = ATT[k]; s0 = AT[k] - .15; } }
  if (t >= AT[3] + 1.6 && t < RS1) { obT.textContent = 'every route out is closed'; trT.textContent = 'stop, and report the blocker'; trT.setAttribute('fill', CH); cur.setAttribute('opacity', 0); }
  else if (cur0) { obT.textContent = type(cur0.ob, (t - s0) / .3); var tr = type(cur0.tries, (t - s0 - .3) / .5); trT.textContent = tr; trT.setAttribute('fill', CY);
    var bb = trT.getComputedTextLength ? trT.getComputedTextLength() : 0; cur.setAttribute('x', (162 + bb).toFixed(1)); cur.setAttribute('opacity', Math.floor(t * 2.5) % 2 ? .9 : .2); }
  else { obT.textContent = ''; trT.textContent = ''; cur.setAttribute('opacity', 0); }
  if (t >= RS0) { obT.setAttribute('opacity', fade.toFixed(2)); trT.setAttribute('opacity', fade.toFixed(2)); } else { obT.setAttribute('opacity', 1); trT.setAttribute('opacity', 1); }
  // July: the attempt runs all the way out to a real site, and training says workarounds pay
  var bp = CPATHS[cpIndex(BEFORE.c, BEFORE.b)].pts;
  if (t > B0 && t < B1) { var u = sm((t - B0) / (B1 - B0)); var q = pathPt(bp, u); pulse(q[0], q[1], CY, 1); for (var z = 1; z < 4; z++) { var q2 = pathPt(bp, u - z * .035); E('circle', { cx: q2[0], cy: q2[1], r: 7 - z * 1.5, fill: CY, opacity: .5 - z * .12 }, fx); } }
  var hit = t >= B1 && t < TR0 + .4 ? 1 - sm((t - TR0) / .4) : 0;
  bld[BEFORE.b].r.setAttribute('fill', hit > 0 ? CO : PANEL); bld[BEFORE.b].r.setAttribute('fill-opacity', hit > 0 ? (.35 * hit).toFixed(2) : 1); if (hit > 0) { var tg = E('g', { opacity: hit.toFixed(2) }, fx); R(tg, BX[BEFORE.b] - 110, 194, 220, 30, { rx: 7, fill: CO }); T(tg, BX[BEFORE.b], 215, 'REACHED A REAL SITE', 16.5, BG, 'GM', 600, 'middle', .3); }
  if (t >= B1 && t < B1 + .5) { var ph2 = (t - B1) / .5; E('circle', { cx: BX[BEFORE.b], cy: 258, r: 30 + ph2 * 70, fill: 'none', stroke: CO, 'stroke-width': 3, opacity: (1 - ph2).toFixed(2) }, fx); }
  // ⑤ training gauge: July = yes (learned in training), Oct 9 = no (environments being fixed)
  var pay = t < B1 ? 0 : t < TR0 ? sm((t - B1) / .4) : 1 - N; payBar.setAttribute('width', (192 * pay).toFixed(1));
  var no = N > .5; payT.textContent = t < B1 ? '' : no ? 'NO · being fixed' : 'YES · it learned'; payT.setAttribute('fill', no ? CH : CO); payT.setAttribute('opacity', no ? fade.toFixed(2) : 1);
  trnR.setAttribute('stroke', no ? CH : CO); nb5.c.setAttribute('fill', no ? CH : CO); tk5.setAttribute('opacity', (N > .5 ? N : 0).toFixed(2));
  // Oct 9 attempts: each is caught at a different layer, one step further out each time
  ATT.forEach(function (a, k) { var s = AT[k], c = CONDUIT[a.c], pts = CPATHS[cpIndex(a.c, a.b)].pts, stopY = BANDY[a.L] + (a.L === 0 ? 0 : 0), seg = upTo(pts, stopY);
    var go0 = s + .3, go1 = s + 1.0;
    if (t > go0 && t < go1) { var u2 = sm((t - go0) / (go1 - go0)); var q3 = pathPt(seg, u2); pulse(q3[0], q3[1], CY, 1); for (var z2 = 1; z2 < 4; z2++) { var q4 = pathPt(seg, u2 - z2 * .05); E('circle', { cx: q4[0], cy: q4[1], r: 7 - z2 * 1.5, fill: CY, opacity: .5 - z2 * .12 }, fx); } }
    if (t >= go1 && t < go1 + .45) { var ph3 = (t - go1) / .45; E('circle', { cx: c.x, cy: stopY, r: 14 + ph3 * 50, fill: 'none', stroke: CH, 'stroke-width': 3, opacity: (1 - ph3).toFixed(2) }, fx);
      lay[a.L].r.setAttribute('fill', '#232a17'); } else if (t < RS1) lay[a.L].r.setAttribute('fill', PANEL);
    var next = k < 3 ? AT[k + 1] + .3 : RS0; if (t >= go1 && t < next) stamp(c.x, a.L === 0 ? 318 : stopY, a.stamp, CH, a.L === 0 ? 0 : a.c === 3 ? -1 : 1, sm((t - go1) / .15) * (k < 3 ? 1 - sm((t - next + .3) / .3) : fade));
    if (t >= go1 + .3 && t < RS1) ex(c.x, stopY, CH, fade * (t >= next ? 1 : sm((t - go1 - .3) / .2)));
    lay[a.L].tk.setAttribute('opacity', (t >= go1 ? sm((t - go1) / .2) * fade : 0).toFixed(2)); });
  // ledger rows and log, in order
  rowEl.forEach(function (g, k) { var rt = ROWS[k].t, o = t >= rt && t < RS1 ? sm((t - rt) / .25) * fade : 0; g.setAttribute('opacity', o.toFixed(2)); skel[k].setAttribute('opacity', (1 - o).toFixed(2)); });
  var LOG = [[B0, 'request → tip form · SENT (internet on)', CO], [TR1 - .2, 'Oct 9 · live internet off for all evals', CH]].concat(ATT.map(function (a, k) { return [AT[k] + 1.0, a.led + ' · ' + a.stamp.toLowerCase() + ' at ' + a.by.slice(0, 1), CH]; }));
  var shown = LOG.filter(function (l) { return l[0] <= t; }).slice(-3);
  logT.forEach(function (lt, k) { var l = shown[k]; lt.textContent = l ? '› ' + l[1] : ''; lt.setAttribute('fill', l ? (k === shown.length - 1 ? l[2] : MUTE) : MUTE); lt.setAttribute('opacity', fade.toFixed(2)); });
};
window.__seek(0);
})();
