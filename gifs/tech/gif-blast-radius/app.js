// "One fibre cut. 25+ products hit." Blast radius of Google Cloud us-west1, 20 Aug 2026, as a splitting tower (1080x1350, 20 s loop, pure function of t).
// Facts: Google Cloud status incident report (preliminary 24 Aug, full 27 Aug 2026): scheduled fibre maintenance cut inter-campus capacity, automated rerouting failed, congestion,
// latency spikes cascaded into timeouts and cascading retries, 26+ products named, other regions unaffected; mitigation = traffic draining, fibre restored, traffic returned in
// validated stages; stated remediation = stricter checks + circuit redundancy before maintenance, better automated failover. The x64 retry multiplier is the Google SRE book's
// example (3 layers x 4 attempts), not a Google measurement. Bar/latency shapes are illustrative (the report gives no percentages).
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', D = 20, OFF = 11.0;
var BG = '#f7e6e3', PANEL = '#fff7f4', INK = '#3a0f1e', CY = '#00a6c8', CYL = '#d6f0f6', OR = '#ff5a1f', ORL = '#ffe0d2', RED = '#b3122e', REDL = '#f6cfd5', MINT = '#0f9d75', MINTL = '#d3f1e6', MUTE = '#80626c', GRID = '#ebcfca', WALL = '#6b1f3a';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { if (typeof par === 'string') { var sw = txt; txt = par; par = sw; } var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function A(e, at) { for (var k in at) e.setAttribute(k, at[k]); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; }
function mod(a, n) { return ((a % n) + n) % n; }
function hsh(i) { var h = Math.sin(i * 127.1 + 311.7) * 43758.5453; return h - Math.floor(h); }
function icon(n, x, y, s, col, par) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s / 24 + ')', fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = (window.ICONS || {})[n] || ''; return g; }
function T(x, y, s, fam, w, col, txt, par, extra) { var at = { x: x, y: y, 'font-family': fam, 'font-weight': w, 'font-size': s, fill: col }; for (var k in (extra || {})) at[k] = extra[k]; return E('text', at, par || svg, txt); }
function mix(c1, c2, u) { var a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16), r = Math.round(lerp(a >> 16, b >> 16, u)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, u)), bl = Math.round(lerp(a & 255, b & 255, u)); return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1); }
var ST = [0, 3.2, 6, 9.2, 13, 15.4, 19.5];
var NAMES = ['MAINTENANCE', 'REROUTE FAILS', 'CONGESTION', 'TIMEOUTS → RETRIES', 'MITIGATE', 'SPLIT THE TOWER'];
var QUOTE = [
  ['"scheduled fiber optic maintenance, which unexpectedly', 'compromised network capacity between data centers"'],
  ['"Automated rerouting mechanisms failed to properly', 'redistribute traffic to alternate capacity"'],
  ['"network congestion as volumes exceeded available', 'bandwidth in the affected area"'],
  ['"significant latency spikes, which cascaded into', 'timeouts and elevated error rates" → "cascading retries"'],
  ['"emergency traffic draining" → fibre restored → traffic', 'returned "through controlled validation stages"']
];

// ---- background + header ----------------------------------------------------------------------------------------------
E('rect', { x: 0, y: 0, width: 1080, height: 1350, fill: BG });
var dots = E('g', { fill: GRID }); for (var dx = 30; dx < 1080; dx += 40) for (var dy = 30; dy < 1350; dy += 40) E('circle', { cx: dx, cy: dy, r: 2 }, dots);
T(50, 52, 19, 'GM', 600, RED, 'BLAST RADIUS · GOOGLE CLOUD US-WEST1 · 20 AUG 2026', null, { 'letter-spacing': 1.4 });
T(50, 114, 56, 'FG', 700, INK, 'One fibre cut.');
T(50, 184, 56, 'FG', 700, INK, '25+ products hit.');

// ---- the tower: two campuses, three floors each ----------------------------------------------------------------------------
var TX = [50, 470], FW = 240, FY = [660, 455, 250], FH = 185;          // floor 0 = core (bottom), 1 = platform, 2 = apps
var LAY = [  // per tower: [floor0 labels, floor1 labels, floor2 labels]
  [['PAXOS', 'META', ''], ['GCS', 'DISK', 'GKE', '', ''], ['BQ', '', '', '', '']],
  [['PAXOS', 'META', 'KMS', ''], ['IAM', 'SQL', 'RUN', '', ''], ['PUB', '', '', '', '']]];
var floorG = [[], []], tiles = [], k = 0;
T(TX[0], 238, 20, 'GM', 600, INK, 'CAMPUS A'); T(TX[1], 238, 20, 'GM', 600, INK, 'CAMPUS B');
for (var tw = 0; tw < 2; tw++) for (var f = 0; f < 3; f++) {
  var g = E('g', {}); floorG[tw][f] = g;
  E('rect', { x: TX[tw], y: FY[f], width: FW, height: FH, rx: 12, fill: PANEL, stroke: INK, 'stroke-width': 2.5, 'stroke-opacity': .55 }, g);
  var L = LAY[tw][f];
  for (var q = 0; q < L.length; q++) {
    var c = q % 3, r = Math.floor(q / 3), x0 = TX[tw] + 12 + c * 75, y0 = FY[f] + 16 + r * 76;
    var rc = E('rect', { x: x0, y: y0, width: 66, height: 66, rx: 8, fill: CYL, stroke: CY, 'stroke-width': 2.5 }, g);
    var lb = L[q] ? T(x0 + 33, y0 + 39, 17, 'GM', 600, CY, L[q], g, { 'text-anchor': 'middle' }) : null;
    tiles.push({ tw: tw, f: f, i: k, rc: rc, lb: lb, cx: x0 + 33, cy: y0 + 33, h: hsh(k + 3) }); k++;
  }
}
var N_TILES = tiles.length;                                         // 27
var floorTxt = ['CORE', 'PLATFORM', 'APPS'];
for (var ff = 0; ff < 3; ff++) T(TX[1] + FW + 8, FY[ff] + 80, 16, 'GM', 500, MUTE, '', null);
var wallA = [], wallB = [];                                          // bulkheads between floors (shown in the last act)
for (var w2 = 0; w2 < 2; w2++) { wallA[w2] = E('rect', { x: TX[0] - 6, y: 0, width: FW + 12, height: 10, rx: 4, fill: WALL, opacity: 0 }); wallB[w2] = E('rect', { x: TX[1] - 6, y: 0, width: FW + 12, height: 10, rx: 4, fill: WALL, opacity: 0 }); }

// ---- the fibre bridge between campuses ------------------------------------------------------------------------------------
var BX0 = TX[0] + FW, BX1 = TX[1], BY = [730, 790, 760];
var cab = [], cabL = [];
for (var ci = 0; ci < 3; ci++) { cab.push([E('line', { x1: BX0, y1: BY[ci], x2: BX1, y2: BY[ci], stroke: CY, 'stroke-width': 10, 'stroke-linecap': 'round' }), E('line', { x1: BX0, y1: BY[ci], x2: BX1, y2: BY[ci], stroke: CY, 'stroke-width': 10, 'stroke-linecap': 'round' })]); }
var gapCut = E('rect', { x: 358, y: BY[1] - 14, width: 44, height: 28, fill: BG }), sparks = [];
for (var sp = 0; sp < 6; sp++) sparks.push(E('polygon', { points: '0,-7 3,-2 8,0 3,2 0,7 -3,2 -8,0 -3,-2', fill: OR }));
var tagM = E('g', { opacity: 0 }); icon('alert-triangle', 296, 812, 24, OR, tagM); T(326, 830, 17, 'GM', 600, OR, 'FIBRE 2 CUT', tagM);
var tag3 = E('g', { opacity: 0 }); T(300, 756, 16, 'GM', 600, MINT, '', tag3);
var PK = []; for (var pi = 0; pi < 36; pi++) PK.push(E('circle', { r: 6, fill: CY }));
var downTxt = T(380, 258, 20, 'GM', 600, RED, '', null, { 'text-anchor': 'middle' });
// alt capacity box + reroute arrows
var altG = E('g', { opacity: 0 }); E('rect', { x: 300, y: 866, width: 160, height: 62, rx: 12, fill: 'none', stroke: MUTE, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, altG);
T(380, 893, 17, 'GM', 600, MUTE, 'ALT CAPACITY', altG, { 'text-anchor': 'middle' }); var altX = T(380, 919, 22, 'FG', 700, RED, '✕ NO LOAD TAKEN', altG, { 'text-anchor': 'middle', 'font-size': 17 });
var arrows = []; for (var ai = 0; ai < 3; ai++) arrows.push(E('polygon', { points: '-9,-6 0,8 9,-6 0,-1', fill: OR, opacity: 0 }));
// retry packets
var RP = []; for (var rp = 0; rp < 60; rp++) RP.push(E('circle', { r: 5, fill: OR, opacity: 0 }));
var RE = [[0, 0], [0, 1], [1, 2]].map(function (p) { return { a: tiles.filter(function (t) { return t.tw === p[0] && t.f === 2; })[p[1] % 5], b: tiles.filter(function (t) { return t.tw === (p[0] ? 0 : 1) && t.f === 0; })[p[1] % 3] }; });

// ---- right-hand instruments ----------------------------------------------------------------------------------------------
var PX = 735, PW = 295;
function card(y, h, title) { E('rect', { x: PX, y: y, width: PW, height: h, rx: 14, fill: PANEL, stroke: INK, 'stroke-opacity': .4, 'stroke-width': 2 }); T(PX + 16, y + 28, 17, 'GM', 600, MUTE, title); }
card(215, 105, 'REPORT WINDOW · PDT'); var clk = T(PX + 16, 296, 48, 'FG', 700, INK, '08:00'); var clkBar = E('rect', { x: PX + 16, y: 304, width: 0, height: 6, rx: 3, fill: CY }); E('rect', { x: PX + 16, y: 304, width: 263, height: 6, rx: 3, fill: 'none', stroke: GRID, 'stroke-width': 2 }); var clkTag = T(PX + 176, 296, 17, 'GM', 500, MUTE, 'COMPRESSED');
card(334, 106, 'INTER-CAMPUS CAPACITY'); E('rect', { x: PX + 16, y: 376, width: 263, height: 24, rx: 12, fill: BG, stroke: GRID, 'stroke-width': 2 }); var capBar = E('rect', { x: PX + 16, y: 376, width: 263, height: 24, rx: 12, fill: CY }); var capTx = T(PX + 16, 428, 17, 'GM', 600, CY, 'FULL');
card(454, 156, 'LATENCY · ILLUSTRATIVE'); var spark = E('polyline', { points: '', fill: 'none', stroke: OR, 'stroke-width': 4, 'stroke-linejoin': 'round' }); E('line', { x1: PX + 16, y1: 588, x2: PX + 279, y2: 588, stroke: GRID, 'stroke-width': 2 }); var sparkDot = E('circle', { r: 6, fill: OR });
card(624, 128, 'ATTEMPTS PER CLICK'); var mult = T(PX + 16, 724, 64, 'FG', 700, OR, '×1'); T(PX + 170, 696, 17, 'GM', 500, MUTE, 'SRE BOOK', null); T(PX + 170, 720, 17, 'GM', 500, MUTE, 'EXAMPLE');
card(766, 134, 'OTHER REGIONS'); var okT = T(PX + 16, 886, 24, 'FG', 700, MINT, 'UNAFFECTED'); icon('circle-check', PX + 245, 854, 34, MINT);
var reg = []; for (var rg = 0; rg < 3; rg++) { var rx = PX + 18 + rg * 82; E('rect', { x: rx, y: 806, width: 66, height: 38, rx: 8, fill: MINTL, stroke: MINT, 'stroke-width': 2.5 }); reg.push(E('circle', { cx: rx + 33, cy: 825, r: 6, fill: MINT })); }

// ---- bottom card: quote (steps 1-5), rules ledger (step 6) --------------------------------------------------------------------
E('rect', { x: 40, y: 952, width: 1000, height: 340, rx: 18, fill: PANEL, stroke: INK, 'stroke-opacity': .4, 'stroke-width': 2 });
var stepTx = T(70, 1000, 20, 'GM', 600, RED, 'STEP 1/6'); var dotsS = []; for (var ds = 0; ds < 6; ds++) dotsS.push(E('circle', { cx: 202 + ds * 22, cy: 993, r: 7, fill: GRID }));
var stepName = T(360, 1006, 40, 'FG', 700, INK, 'MAINTENANCE');
var qL = [T(70, 1090, 34, 'IN', 600, INK, ''), T(70, 1140, 34, 'IN', 600, INK, '')];
var qTag = T(70, 1212, 19, 'GM', 600, MUTE, 'GOOGLE CLOUD STATUS · INCIDENT REPORT');
var ledG = E('g', { opacity: 0 }), led = [], LTX = ['Redundant circuit before any maintenance', 'Failover that survives sudden capacity loss', 'Bring traffic back in validated stages', 'Cap retries: budget, jitter, one layer'], LTG = ['GOOGLE · STATED FIX', 'GOOGLE · STATED FIX', 'GOOGLE · WHAT IT DID', 'GOOGLE SRE BOOK'];
for (var li = 0; li < 4; li++) { var ly = 1088 + li * 52; var bar = E('rect', { x: 62, y: ly - 33, width: 956, height: 46, rx: 10, fill: MINTL, opacity: 0 }, ledG); E('circle', { cx: 92, cy: ly - 10, r: 16, fill: 'none', stroke: MINT, 'stroke-width': 3 }, ledG); var nn = T(92, ly - 3, 19, 'FG', 700, MINT, String(li + 1), ledG, { 'text-anchor': 'middle' }); T(130, ly, 28, 'IN', 700, INK, LTX[li], ledG); T(1004, ly - 3, 17, 'GM', 600, MINT, LTG[li], ledG, { 'text-anchor': 'end' }); led.push(bar); }
T(40, 1332, 17, 'GM', 500, MUTE, 'SOURCES: GOOGLE CLOUD INCIDENT REPORT (24/27 AUG 2026) · GOOGLE SRE BOOK. SHAPES ILLUSTRATIVE.');

// ---- per-frame state ---------------------------------------------------------------------------------------------------------
function tileState(t, u) {
  var h = t.h, ts, td, tr; if (t.f === 0) { ts = 6.6 + h * .8; td = 9.5 + h * .5; tr = 13.5 + h * .5; } else if (t.f === 1) { ts = 8.4 + h * .6; td = 10.3 + h * .6; tr = 14.2 + h * .4; } else { ts = 9.0 + h * .5; td = 11.0 + h * .6; tr = 14.8 + h * .4; }
  if (t.i === 0 && u >= 17.4 && u < 18.6) return 'down';                  // the contained failure in the last act
  if (u >= tr && u < tr + .9) return 'rec'; if (u >= td && u < tr) return 'down'; if (u >= ts && u < td) return 'stress'; return 'ok';
}
var SC = { ok: [CYL, CY], stress: [ORL, OR], down: [REDL, RED], rec: [MINTL, MINT] };
function cablePos(i, n, u, sp) { var ph = mod(u * sp + i / n, 1); return ph; }
window.__seek = function (t) {
  var u = mod(t + OFF, D), act = 0; for (var i = 0; i < 6; i++) if (u >= ST[i]) act = i;
  var resetT = seg(u, 19.5, 20);
  // floors split (last act) and bulkheads
  var spl = sm(seg(u, 15.6, 16.5)) * (1 - sm(resetT)), dyF = [14 * spl, 0, -14 * spl];
  for (var tw2 = 0; tw2 < 2; tw2++) for (var ff2 = 0; ff2 < 3; ff2++) A(floorG[tw2][ff2], { transform: 'translate(0,' + dyF[ff2].toFixed(1) + ')' });
  [wallA, wallB].forEach(function (w) { A(w[0], { y: 440 - 7 * spl, opacity: spl }); A(w[1], { y: 645 + 7 * spl, opacity: spl }); });
  // tiles
  var down = 0;
  tiles.forEach(function (t) { var s = tileState(t, u), c = SC[s]; if (s === 'down') down++; A(t.rc, { fill: c[0], stroke: c[1] }); if (t.lb) A(t.lb, { fill: c[1] }); });
  A(downTxt, { fill: down ? RED : MUTE }); downTxt.textContent = down ? 'HIT ' + down + ' / ' + N_TILES : '';
  // cables
  var cutP = sm(seg(u, 1.5, 1.9)) * (1 - sm(seg(u, 13.6, 14.0))), cong = sm(seg(u, 6.0, 8.8)) * (1 - sm(seg(u, 13.4, 14.4)));
  var cableCol = mix(CY, OR, cong), cableCol2 = mix(cableCol, RED, sm(seg(u, 9.4, 10.6)) * (1 - sm(seg(u, 13.4, 14.4))));
  A(cab[0][0], { stroke: cableCol2, 'stroke-width': 10 + 3 * cong }); A(cab[0][1], { stroke: cableCol2, opacity: 0 });
  A(cab[1][0], { stroke: cableCol2 }); A(gapCut, { opacity: cutP }); A(tagM, { opacity: cutP > .5 ? 1 : 0 });
  var c3 = sm(seg(u, 16.2, 16.9)) * (1 - sm(resetT)); A(cab[2][0], { stroke: MINT, opacity: c3 }); A(tag3, { opacity: c3 }); tag3.lastChild.textContent = '';
  A(cab[2][1], { opacity: 0 });
  sparks.forEach(function (s, i2) { var on = u > 1.5 && u < 3.0 ? 1 : (u > 13.6 && u < 14.3 ? 1 : 0); var a2 = (u * 9 + i2 * 1.7), r2 = 10 + 14 * mod(u * 3 + i2 * .21, 1); A(s, { transform: 'translate(' + (380 + Math.cos(a2) * r2).toFixed(1) + ',' + (BY[1] + Math.sin(a2) * r2).toFixed(1) + ')', opacity: on ? (u > 13 ? .0 : 1) * (1 - mod(u * 3 + i2 * .21, 1)) : 0, fill: u > 13 ? MINT : OR }); if (u > 13.5 && u < 14.3) A(s, { opacity: 1 - mod(u * 3 + i2 * .21, 1), fill: MINT }); });
  // packets on cables
  var n1 = (u >= 1.7 && u < 13.8) ? 18 : 9, n2 = (u >= 1.7 && u < 13.8) ? 0 : 9, n3 = c3 > .5 ? 9 : 0, spd = lerp(.55, .2, cong), idx = 0;
  function lane(y, n, dir, drop) { for (var j = 0; j < 36; j++) { var p = PK[idx % 36]; if (j >= n) { if (idx < 36) { A(p, { opacity: 0 }); } idx++; continue; } var ph = mod(u * spd * (dir ? 1 : 1) + j / n, 1), x = dir ? BX0 + 180 * ph : BX1 - 180 * ph; var drp = drop && (j % 3 === 0) && u > 7.6 && u < 13.2 && ph > .55 ? (ph - .55) / .45 : 0; var col = cong > .15 ? mix(CY, OR, cong) : CY; if (drp) col = RED; var yy = y + (j % 2 ? -9 : 9) * .0 + drp * 60 + (j % 3 - 1) * 0; A(PK[idx % 36], { cx: x.toFixed(1), cy: (y + ((j % 2) ? 0 : 0) + drp * 70).toFixed(1), opacity: (1 - drp) * (ph < .04 || ph > .96 ? .3 : 1), fill: col }); idx++; } }
  idx = 0; for (var q2 = 0; q2 < 36; q2++) A(PK[q2], { opacity: 0 });
  (function () { var used = 0; function lane2(y, n, off, drop) { for (var j = 0; j < n && used < 36; j++, used++) { var ph = mod(u * spd + j / n + off, 1), left = (j % 2 === 0), x = left ? BX0 + 180 * ph : BX1 - 180 * ph; var drp = drop && (j % 3 === 0) && u > 7.6 && u < 13.2 && ph > .55 ? (ph - .55) / .45 : 0; A(PK[used], { cx: x.toFixed(1), cy: (y + drp * 70).toFixed(1), opacity: (1 - drp) * (ph < .05 || ph > .95 ? .35 : 1), fill: drp ? RED : mix(CY, OR, cong) }); } } lane2(BY[0], n1, 0, true); lane2(BY[1], n2, .3, false); lane2(BY[2], n3, .5, false); })();
  // reroute attempt (arrows go to the alternate box and bounce)
  var altOn = u >= 3.2 && u < 15.0 ? sm(seg(u, 3.2, 3.8)) : 0; A(altG, { opacity: altOn }); altX.textContent = u > 5.6 && u < 15.0 ? '✕ NO LOAD TAKEN' : '';
  arrows.forEach(function (a2, i3) { var ph = mod((u - 3.4) * .9 + i3 / 3, 1), on = u >= 3.4 && u < 6.4; var yy = ph < .5 ? lerp(842, 866, ph * 2) : lerp(866, 842, (ph - .5) * 2); A(a2, { transform: 'translate(' + (350 + i3 * 30) + ',' + yy.toFixed(1) + ') rotate(' + (ph < .5 ? 0 : 180) + ')', opacity: on ? .9 : 0 }); });
  // retry splits (steps 4-5)
  var ri = 0; RP.forEach(function (c4) { A(c4, { opacity: 0 }); });
  if (u >= 9.2 && u < 13.4) RE.forEach(function (em, j) { for (var cyc = 0; cyc < 2; cyc++) { var ph = mod((u - 9.2) / 1.4 + j * .33 + cyc * .5, 1), p0 = { x: em.a.cx + TX[em.a.tw] * 0, y: em.a.cy }, p1 = { x: em.b.cx, y: em.b.cy }; var nn2 = ph < .33 ? 1 : (ph < .66 ? 3 : 9), e1 = sm(ph); for (var m = 0; m < nn2 && ri < 60; m++, ri++) { var spread = nn2 === 1 ? 0 : (m - (nn2 - 1) / 2) * (nn2 === 3 ? 14 : 9), px = lerp(p0.x, p1.x, e1) + spread, py = lerp(p0.y, p1.y, e1) + (nn2 === 9 ? ((m % 3) - 1) * 10 : 0); A(RP[ri], { cx: px.toFixed(1), cy: py.toFixed(1), opacity: ph > .9 ? .3 : 1 }); } } });
  // containment demo (last act): packets bounce at the wall
  if (u >= 17.4 && u < 18.6) { for (var b = 0; b < 6; b++) { var phb = mod((u - 17.4) * 1.6 + b / 6, 1), bx = TX[0] + 40 + b * 32, by = 0; if (ri < 60) { A(RP[ri], { cx: bx, cy: (660 + 14 * spl - 14 - (phb < .5 ? phb : 1 - phb) * 40).toFixed(1), opacity: 1 }); ri++; } } }
  // right panels
  var cp = clamp(u / 13.6, 0, 1), mins = Math.round(480 + 142 * (u >= 19.5 ? 0 : cp)); var cs = (u >= 19.5 ? 0 : mins); clk.textContent = ('0' + Math.floor(cs / 60)).slice(-2) + ':' + ('0' + (cs % 60)).slice(-2); A(clkBar, { width: 263 * (u >= 19.5 ? 0 : cp) });
  var cap = 1 - .5 * cutP; A(capBar, { width: 263 * cap, fill: cap < 1 ? OR : CY }); capTx.textContent = cap < .98 ? 'REDUCED' : (c3 > .5 ? 'FULL + SPARE' : 'FULL'); A(capTx, { fill: cap < 1 ? OR : (c3 > .5 ? MINT : CY) });
  var pts = [], LV = function (x) { return x < 3 ? .1 : (x < 9.6 ? lerp(.1, .95, sm(seg(x, 3, 9.6))) : (x < 13.3 ? .95 : lerp(.95, .12, sm(seg(x, 13.3, 15.2))))); };
  for (var s2 = 0; s2 <= 40; s2++) { var xs = D * s2 / 40; if (xs > u) break; pts.push((PX + 16 + 263 * xs / D).toFixed(1) + ',' + (588 - 90 * LV(xs)).toFixed(1)); } var lx = PX + 16 + 263 * u / D, ly2 = 588 - 90 * LV(u); pts.push(lx.toFixed(1) + ',' + ly2.toFixed(1)); A(spark, { points: pts.join(' '), stroke: LV(u) > .5 ? OR : CY }); A(sparkDot, { cx: lx, cy: ly2, fill: LV(u) > .5 ? OR : CY });
  var mv = u >= 9.4 && u < 13.4 ? (u < 10.2 ? 4 : (u < 11.0 ? 16 : 64)) : 1; mult.textContent = '×' + mv; A(mult, { fill: mv > 1 ? OR : MUTE });
  reg.forEach(function (r4, i4) { A(r4, { opacity: .35 + .65 * (Math.sin(u * 5 + i4 * 2) * .5 + .5) }); });
  // bottom card
  var showLed = u >= 15.4 && u < 19.9 ? 1 : 0; A(ledG, { opacity: showLed }); qL.forEach(function (e2) { A(e2, { opacity: showLed ? 0 : 1 }); }); A(qTag, { opacity: showLed ? 0 : 1 });
  stepTx.textContent = 'STEP ' + (act + 1) + '/6'; stepName.textContent = NAMES[act]; dotsS.forEach(function (d2, i5) { A(d2, { fill: i5 === act ? RED : (i5 < act ? INK : GRID) }); });
  if (act < 5) { qL[0].textContent = QUOTE[act][0]; qL[1].textContent = QUOTE[act][1]; qTag.textContent = act === 3 ? 'GOOGLE CLOUD STATUS · SRE BOOK: 3 LAYERS × 4 ATTEMPTS = 64' : 'GOOGLE CLOUD STATUS · INCIDENT REPORT · 20 AUG 2026'; }
  var LT = [15.9, 16.7, 17.5, 18.3]; led.forEach(function (b2, i6) { A(b2, { opacity: u >= LT[i6] ? .55 + .45 * Math.sin((u - LT[i6]) * 6) * Math.exp(-(u - LT[i6]) * 1.2) : 0 }); });
};
window.__reelDurationSec = D; window.__ready = false; window.__seek(0);
Promise.all([document.fonts.load('700 40px FG'), document.fonts.load('600 20px GM'), document.fonts.load('500 20px GM'), document.fonts.load('600 20px IN'), document.fonts.load('700 20px IN')]).catch(function () {}).then(function () { window.__seek(0); window.__ready = true; });
})();
