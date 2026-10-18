// "Don't break the cache." Prompt caching as a pre-cast tower (1600x900, 12 s loop, pure function of t; frame 0 offset to mid-action).
// The prompt prefix is built tools -> system -> messages (Anthropic docs). Foundation slabs = TOOLS + SYSTEM, one floor per turn.
// Hit: the unchanged prefix is read from cache (0.1x input price). A timestamp in the system prompt changes every request, so SYSTEM
// and every floor above it are re-written (1.25x). Fix: move the timestamp to the latest message; after one re-write every turn hits again.
// Facts: Anthropic + OpenAI prompt-caching docs (read 18 Oct 2026); Lumer et al., arXiv 2601.06007 (Jan 2026).
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 12, OFF = 5.4;
var BG = '#eceae4', PANEL = '#f8f7f3', INK = '#1d2733', STEEL = '#2f5d8a', YEL = '#f5b700', GRN = '#1f9d55', RED = '#e5484d', CONC = '#d3cec3',
  GRID = '#dcdde0', MUTE = '#5d6670', HITF = '#d3f0de', MISF = '#fbd5d5', NEWF = '#ffe8a3', WHITE = '#ffffff';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { if (typeof par === 'string') { var sw = txt; txt = par; par = sw; } var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; }
function mod(a, n) { return ((a % n) + n) % n; }
function back(x) { x = clamp(x, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function A(e, at) { for (var k in at) e.setAttribute(k, at[k]); return e; }
function icon(n, x, y, s, col, par) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s / 24 + ')', fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = (window.ICONS || {})[n] || ''; return g; }

// ---- static layer: blueprint grid, header, cards ----------------------------------------------------------------------
E('rect', { x: 0, y: 0, width: 1600, height: 900, fill: BG });
var grid = E('g', { stroke: GRID, 'stroke-width': 1 });
for (var gx = 0; gx <= 1600; gx += 40) E('line', { x1: gx, y1: 0, x2: gx, y2: 900 }, grid);
for (var gy = 0; gy <= 900; gy += 40) E('line', { x1: 0, y1: gy, x2: 1600, y2: gy }, grid);
E('text', { x: 48, y: 54, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, fill: STEEL, 'letter-spacing': 2 }, 'PROMPT CACHING · HOW YOUR AI BILL IS BUILT');
E('text', { x: 46, y: 116, 'font-family': 'MR', 'font-weight': 800, 'font-size': 50, fill: INK, 'letter-spacing': -1 }, "Don't break the cache.");
E('text', { x: 48, y: 152, 'font-family': 'IN', 'font-weight': 600, 'font-size': 22, fill: MUTE }, 'Every agent turn re-sends the same long prompt. Its order decides what you pay.');
function card(x, y, w, h, title) { E('rect', { x: x, y: y, width: w, height: h, rx: 16, fill: PANEL, stroke: INK, 'stroke-width': 2.5 }); if (title) E('text', { x: x + 22, y: y + 36, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, fill: INK, 'letter-spacing': 1.5 }, title); }
card(48, 186, 420, 330, 'COST OF THE PREFIX, PER TURN');
card(48, 532, 420, 120, null);
card(48, 668, 420, 158, null);
card(1128, 186, 428, 640, 'THE RULES');
E('text', { x: 48, y: 868, 'font-family': 'IN', 'font-weight': 600, 'font-size': 17, fill: MUTE }, "Sources: Anthropic and OpenAI prompt-caching docs (read 18 Oct 2026) · Lumer et al., \"Don't Break the Cache\", arXiv 2601.06007 (Jan 2026). Tower is a schematic.");

// ---- rules card (numbered, the current one highlights) ------------------------------------------------------------------
var RULES = [['Prefix order: tools → system', '→ messages.'], ['A hit reads the cached prefix', 'at 0.1× the input price.'], ['A miss re-writes it at 1.25×', '(5-min cache, refreshed free).'],
  ['Change one byte: that level and', 'everything after it is re-written.'], ['Static first. Dynamic last', '(time, user data at the end).']];
var ruleG = RULES.map(function (r, i) { var y = 250 + i * 84, g = E('g', {});
  var hl = E('rect', { x: 1142, y: y - 30, width: 400, height: 76, rx: 12, fill: YEL, opacity: 0 }, g);
  var c = E('circle', { cx: 1172, cy: y + 4, r: 17, fill: INK }, g); E('text', { x: 1172, y: y + 10, 'text-anchor': 'middle', 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, fill: WHITE }, String(i + 1), g);
  E('text', { x: 1202, y: y, 'font-family': 'IN', 'font-weight': 700, 'font-size': 20, fill: INK }, r[0], g); E('text', { x: 1202, y: y + 26, 'font-family': 'IN', 'font-weight': 600, 'font-size': 20, fill: INK }, r[1], g);
  return hl; });
var stat = E('g', {});
var statBg = E('rect', { x: 1146, y: 682, width: 392, height: 128, rx: 12, fill: INK }, stat);
E('text', { x: 1166, y: 712, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 16, fill: YEL, 'letter-spacing': 1.5 }, 'MEASURED · 500+ AGENT RUNS', stat);
E('text', { x: 1166, y: 754, 'font-family': 'MR', 'font-weight': 800, 'font-size': 32, fill: WHITE }, 'Cost −41% to −80%', stat);
E('text', { x: 1166, y: 790, 'font-family': 'IN', 'font-weight': 700, 'font-size': 20, fill: '#cfe3f7' }, 'First token 13–31% faster', stat);

// ---- cost meter (5 turns) ---------------------------------------------------------------------------------------------
var BARS = [], BASE = 470, UNIT = 150;   // 1.0x input price = 150 px
for (var i = 0; i < 5; i++) { var bx = 84 + i * 76, g = E('g', {});
  E('text', { x: bx + 26, y: BASE + 26, 'text-anchor': 'middle', 'font-family': 'AZ', 'font-weight': 700, 'font-size': 17, fill: MUTE }, 'T' + (i + 1), g);
  var r = E('rect', { x: bx, y: BASE, width: 52, height: 0, rx: 5, fill: GRN }, g);
  var v = E('text', { x: bx + 26, y: BASE - 8, 'text-anchor': 'middle', 'font-family': 'AZ', 'font-weight': 700, 'font-size': 17, fill: GRN }, '', g);
  BARS.push({ g: g, r: r, v: v, x: bx }); }
E('line', { x1: 72, y1: BASE, x2: 444, y2: BASE, stroke: INK, 'stroke-width': 2 });
E('line', { x1: 72, y1: BASE - UNIT, x2: 444, y2: BASE - UNIT, stroke: MUTE, 'stroke-width': 1.5, 'stroke-dasharray': '6 6' });
E('text', { x: 84, y: BASE - UNIT - 8, 'font-family': 'AZ', 'font-weight': 500, 'font-size': 16, fill: MUTE }, '1× full price');
// TTL ring card
var ttlRing = E('circle', { cx: 112, cy: 592, r: 34, fill: 'none', stroke: GRN, 'stroke-width': 9, 'stroke-linecap': 'round', transform: 'rotate(-90 112 592)' });
E('circle', { cx: 112, cy: 592, r: 34, fill: 'none', stroke: GRID, 'stroke-width': 9, opacity: .6 });
svg.appendChild(ttlRing);
icon('clock', 100, 580, 24, INK);
E('text', { x: 166, y: 584, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, fill: INK, 'letter-spacing': 1 }, 'CACHE LIFETIME: 5 MIN');
var ttlTxt = E('text', { x: 166, y: 614, 'font-family': 'IN', 'font-weight': 600, 'font-size': 19, fill: MUTE }, 'resets free on every hit');
// callout card (changes with the story)
var callT = E('text', { x: 94, y: 708, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, 'letter-spacing': 1.2 }, '');
var callL = [0, 1, 2].map(function (k) { return E('text', { x: 72, y: 742 + k * 28, 'font-family': 'IN', 'font-weight': 600, 'font-size': 20, fill: INK }, ''); });
var callDot = E('circle', { cx: 78, cy: 702, r: 8 });

// ---- construction site ------------------------------------------------------------------------------------------------
var GROUND = 820, TX = 620, TW = 360;
E('rect', { x: 496, y: GROUND, width: 620, height: 14, fill: '#b9b2a4' });
for (var hx = 500; hx < 1112; hx += 18) E('line', { x1: hx, y1: GROUND + 14, x2: hx + 10, y2: GROUND + 2, stroke: '#9a9285', 'stroke-width': 2 });
// crane: mast + jib (yellow lattice), cab, counterweight, blinking tip light
var crane = E('g', {});
E('rect', { x: 546, y: 196, width: 28, height: GROUND - 196, fill: 'none', stroke: YEL, 'stroke-width': 5 }, crane);
for (var my = 196; my < GROUND - 20; my += 28) E('path', { d: 'M546 ' + my + ' L574 ' + (my + 28) + ' M574 ' + my + ' L546 ' + (my + 28), stroke: YEL, 'stroke-width': 3 }, crane);
E('rect', { x: 500, y: 172, width: 600, height: 24, fill: 'none', stroke: YEL, 'stroke-width': 5 }, crane);
for (var jx = 500; jx < 1100; jx += 24) E('path', { d: 'M' + jx + ' 172 L' + (jx + 24) + ' 196', stroke: YEL, 'stroke-width': 3 }, crane);
E('rect', { x: 500, y: 196, width: 34, height: 40, rx: 4, fill: '#a9a397', stroke: INK, 'stroke-width': 2 }, crane);
E('rect', { x: 576, y: 196, width: 48, height: 38, rx: 6, fill: YEL, stroke: INK, 'stroke-width': 2.5 }, crane);
E('rect', { x: 586, y: 204, width: 28, height: 16, rx: 3, fill: '#bfe0ff', stroke: INK, 'stroke-width': 2 }, crane);
var tipLight = E('circle', { cx: 1096, cy: 168, r: 7, fill: RED });
// mixer truck (the re-pour)
var truck = E('g', { transform: 'translate(1124,820) scale(.85) translate(-1116,-820)' });
E('rect', { x: 1066, y: 772, width: 48, height: 36, rx: 6, fill: STEEL, stroke: INK, 'stroke-width': 2.5 }, truck);
E('rect', { x: 1076, y: 780, width: 26, height: 14, rx: 3, fill: '#bfe0ff' }, truck);
var drum = E('g', {}, truck); E('ellipse', { cx: 1024, cy: 780, rx: 42, ry: 26, fill: '#d9d4c9', stroke: INK, 'stroke-width': 2.5 }, drum);
var stripes = [0, 1, 2].map(function () { return E('path', { fill: 'none', stroke: STEEL, 'stroke-width': 5 }, drum); });
E('rect', { x: 980, y: 802, width: 136, height: 12, rx: 3, fill: INK }, truck);
[1000, 1048, 1096].forEach(function (cx) { E('circle', { cx: cx, cy: 816, r: 10, fill: INK }, truck); });
// tower slabs: TOOLS, SYSTEM, T1..T5
var SL = [{ k: 'tools', ic: 'puzzle', lab: 'TOOLS', h: 62 }, { k: 'sys', ic: 'settings', lab: 'SYSTEM', h: 62 }];
for (i = 1; i <= 5; i++) SL.push({ k: 't' + i, ic: 'message', lab: 'TURN ' + i, h: 50 });
var yTop = GROUND; SL.forEach(function (s) { s.y = yTop - s.h; yTop = s.y; });
var tower = E('g', {});
SL.forEach(function (s) { var g = E('g', {}, tower); s.g = g;
  s.body = E('rect', { x: TX, y: s.y, width: TW, height: s.h - 4, rx: 6, fill: CONC, stroke: INK, 'stroke-width': 2.5 }, g);
  var cp = E('clipPath', { id: 'c' + s.k }, g); E('rect', { x: TX, y: s.y, width: TW, height: s.h - 4, rx: 6 }, cp);
  s.pour = E('rect', { x: TX, y: s.y + s.h, width: TW, height: 0, fill: RED, opacity: .5, 'clip-path': 'url(#c' + s.k + ')' }, g);
  icon(s.ic, TX + 12, s.y + (s.h - 4) / 2 - 11, 22, INK, g);
  E('text', { x: TX + 42, y: s.y + (s.h - 4) / 2 + 6, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, fill: INK }, s.lab, g);
  s.pill = E('rect', { x: TX + TW - 128, y: s.y + (s.h - 4) / 2 - 15, width: 120, height: 30, rx: 15, fill: GRN }, g);
  s.ptx = E('text', { x: TX + TW - 68, y: s.y + (s.h - 4) / 2 + 6, 'text-anchor': 'middle', 'font-family': 'AZ', 'font-weight': 700, 'font-size': 15, fill: WHITE }, '', g); });
var crack = E('path', { d: 'M700 ' + (SL[1].y + 6) + ' l18 14 l-10 10 l20 16 l-6 12 M760 ' + (SL[1].y + 10) + ' l-12 16 l14 10 l-8 18', fill: 'none', stroke: RED, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 });
var scan = E('rect', { x: TX - 6, y: 0, width: TW + 12, height: 6, rx: 3, fill: GRN, opacity: 0 });
// cached-prefix bracket (right of the tower)
var brk = E('path', { fill: 'none', stroke: GRN, 'stroke-width': 5, 'stroke-linecap': 'round' });
var brkT = E('text', { x: 1004, y: 0, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 17, fill: GRN }, '');
var brkT2 = E('text', { x: 1004, y: 0, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 17, fill: GRN }, '');
// crane rig: trolley, cable, hook, carried floor / timestamp brick
var trolley = E('rect', { width: 36, height: 14, rx: 3, fill: INK });
var cable = E('line', { stroke: INK, 'stroke-width': 2.5 });
var hook = E('path', { fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' });
var load = E('g', {}); var loadR = E('rect', { width: TW, height: 46, rx: 6, fill: NEWF, stroke: INK, 'stroke-width': 2.5 }, load);
var loadT = E('text', { 'font-family': 'AZ', 'font-weight': 700, 'font-size': 18, fill: INK }, '', load);
var brick = E('g', {}); var brickR = E('rect', { width: 96, height: 38, rx: 6, fill: RED, stroke: INK, 'stroke-width': 2.5 }, brick);
icon('clock', 4, 11, 16, WHITE, brick); var brickT = E('text', { x: 22, y: 25, 'font-family': 'AZ', 'font-weight': 700, 'font-size': 14.6, fill: WHITE }, '18:04:07', brick);
var dust = []; for (i = 0; i < 10; i++) dust.push(E('circle', { r: 5, fill: '#b9b2a4', opacity: 0 }));

// ---- story (internal time u in [0, 12)) ----------------------------------------------------------------------------------
var LAND = { t1: 1.2, t2: 2.3, t3: 5.0, t5: 9.6 }, INS = 3.6, FIXLIFT = 6.9, T4AT = 8.1, RESET = 11.2;
var PICK = 940, HOOKUP = 236;
function slotY(s) { return s.y + (s.h - 4) / 2; }
// one crane trip: appear at the pickup, travel to x, lower to y
function trip(u, t0, x, y) { var a = seg(u, t0, t0 + .55), b = seg(u, t0 + .55, t0 + .95); return { x: lerp(PICK, x, sm(a)), y: lerp(HOOKUP + 40, y, sm(b)), on: u >= t0 }; }
function state(u) {
  var st = {}; SL.forEach(function (s) { st[s.k] = { vis: s.k === 'tools' || s.k === 'sys' ? 1 : 0, mode: 'hit' }; });
  var fade = 1 - seg(u, RESET, RESET + .6);   // session ends: message floors leave, foundation stays cached
  ['t1', 't2', 't3', 't4', 't5'].forEach(function (k) { var at = k === 't4' ? T4AT + .25 : LAND[k]; st[k].vis = u >= at ? fade : 0; st[k].mode = 'new'; });
  if (u >= LAND.t1 + .3) st.t1.mode = 'hit'; if (u >= LAND.t2 + .3) st.t2.mode = 'hit';
  if (u >= INS) { st.sys.mode = 'miss'; st.t1.mode = 'miss'; st.t2.mode = 'miss'; }
  if (u >= LAND.t3) st.t3.mode = 'miss';
  if (u >= FIXLIFT) { st.sys.mode = 'write'; st.t1.mode = 'write'; st.t2.mode = 'write'; st.t3.mode = 'write'; }
  if (u >= LAND.t5) { ['sys', 't1', 't2', 't3', 't4'].forEach(function (k) { st[k].mode = 'hit'; }); st.t5.mode = 'new'; }
  if (u >= LAND.t5 + .5) st.t5.mode = 'hit';
  if (u >= RESET) { st.sys.mode = 'hit'; }
  return st; }
var MODE = { hit: [HITF, GRN, 'READ 0.1×'], miss: [MISF, RED, 'MISS'], write: ['#fde3c4', '#d9822b', 'WRITE 1.25×'], new: [NEWF, '#b8860b', 'NEW'] };

window.__seek = function (tt) {
  var u = mod(tt + OFF, DUR);
  // ambient: grid drift, tip light, drum
  // grid stays static: a drifting grid changes every pixel and bloats the GIF
  tipLight.setAttribute('opacity', mod(u, 1) < .5 ? 1 : .25);
  var spin = u * (u >= LAND.t3 && u < LAND.t3 + 1.2 ? 9 : 2.2);
  stripes.forEach(function (p, k) { var ph = mod(spin + k * 2.1, 6.28), x = 1024 + Math.cos(ph) * 34; p.setAttribute('d', 'M' + x + ' 758 Q' + (x + Math.sin(ph) * 10) + ' 780 ' + x + ' 802'); p.setAttribute('opacity', Math.sin(ph) > 0 ? 1 : .25); });
  // slabs
  var st = state(u);
  SL.forEach(function (s, i) { var S = st[s.k], m = MODE[S.mode]; s.g.setAttribute('opacity', S.vis);
    var drop = s.k.charAt(0) === 't' ? (1 - seg(u, RESET, RESET + .6)) : 1;
    
    A(s.body, { fill: m[0], stroke: S.mode === 'miss' ? RED : INK }); A(s.pill, { fill: m[1] }); s.ptx.textContent = m[2];
    var pu = 0; if (S.mode === 'write' || (S.mode === 'miss' && u >= LAND.t3)) pu = seg(u, LAND.t3 + i * .12, LAND.t3 + .5 + i * .12);
    A(s.pour, { y: s.y + s.h - (s.h - 4) * pu, height: (s.h - 4) * pu, opacity: S.mode === 'write' ? .0 : .45 }); });
  // crack on the system slab while the timestamp sits in it
  var ca = u >= INS && u < FIXLIFT + .2 ? seg(u, INS, INS + .5) : 0; A(crack, { opacity: ca, 'stroke-dasharray': 200, 'stroke-dashoffset': 200 * (1 - ca) });
  // scan beam (cache read) after each hit landing
  var sc = null; [LAND.t1, LAND.t2, LAND.t5].forEach(function (L) { if (u >= L && u < L + .55) sc = [L, u - L]; });
  if (sc) { var topK = sc[0] === LAND.t5 ? 't4' : (sc[0] === LAND.t2 ? 't1' : 'sys'), ty = SL.filter(function (s) { return s.k === topK; })[0].y, p = sm(sc[1] / .55);
    A(scan, { y: lerp(GROUND - 6, ty, p), opacity: Math.sin(p * Math.PI) }); } else scan.setAttribute('opacity', 0);
  // cached-prefix bracket
  var cachedTop = 'sys'; if (u >= LAND.t1 + .3) cachedTop = 't1'; if (u >= LAND.t2 + .3) cachedTop = 't2'; if (u >= INS) cachedTop = 'tools'; if (u >= LAND.t5) cachedTop = 't4'; if (u >= LAND.t5 + .5) cachedTop = 't5'; if (u >= RESET) cachedTop = 'sys';
  var bt = SL.filter(function (s) { return s.k === cachedTop; })[0].y + 2, bc = cachedTop === 'tools' ? RED : GRN;
  A(brk, { d: 'M' + (TX + TW + 6) + ' ' + bt + ' h10 V' + (GROUND - 4) + ' h-10', stroke: bc }); var ly = cachedTop === 'tools' ? bt - 50 : bt + 22; A(brkT, { y: ly, fill: bc }); A(brkT2, { y: ly + 22, fill: bc });
  brkT.textContent = cachedTop === 'tools' ? 'ONLY TOOLS' : 'CACHED'; brkT2.textContent = cachedTop === 'tools' ? 'CACHED' : 'PREFIX';
  // crane trips
  var tr = null, carry = null;
  if (u < 1.0) { tr = trip(u, .2, TX + TW / 2, slotY(SL[2])); carry = 'TURN 1'; }
  else if (u >= 1.3 && u < 2.1) { tr = trip(u, 1.3, TX + TW / 2, slotY(SL[3])); carry = 'TURN 2'; }
  else if (u >= 2.4 && u < INS) { tr = trip(u, 2.4, 700, slotY(SL[1])); tr.y = lerp(HOOKUP + 40, slotY(SL[1]) - 30, sm(seg(u, 2.95, 3.35))); carry = 'BRICK'; }
  else if (u >= 4.0 && u < 4.8) { tr = trip(u, 4.0, TX + TW / 2, slotY(SL[4])); carry = 'TURN 3'; }
  else if (u >= 6.5 && u < T4AT + .25) { var a = seg(u, 6.5, 6.9), b = seg(u, 6.9, 7.3), c = seg(u, 7.3, 7.7), d = seg(u, 7.7, T4AT);
    tr = { x: lerp(PICK, 775, sm(a)), y: slotY(SL[1]) - 30, on: true }; if (u >= 6.9) { tr.y = lerp(slotY(SL[1]) - 30, HOOKUP + 40, sm(b)); carry = 'BRICK'; }
    if (u >= 7.3) { tr.x = 775; tr.y = lerp(HOOKUP + 40, slotY(SL[5]) - 26, sm(d)); } if (u < 6.9 && a < 1) carry = null; else carry = 'BRICK'; }
  else if (u >= 8.6 && u < 9.4) { tr = trip(u, 8.6, TX + TW / 2, slotY(SL[6])); carry = 'TURN 5'; }
  var hx = tr ? tr.x : (u >= RESET ? PICK : (u < 6.5 && u > 5 ? lerp(TX + TW / 2, PICK, seg(u, 5.0, 5.6)) : PICK)), hy = tr ? tr.y : HOOKUP;
  A(trolley, { x: hx - 18, y: 196 }); A(cable, { x1: hx, y1: 210, x2: hx, y2: hy - 18 }); A(hook, { d: 'M' + hx + ' ' + (hy - 18) + ' v10 a8 8 0 1 1 -8 8' });
  load.setAttribute('opacity', carry && carry !== 'BRICK' ? 1 : 0);
  if (carry && carry !== 'BRICK') { A(loadR, { x: hx - TW / 2, y: hy - 23 }); A(loadT, { x: hx - TW / 2 + 42, y: hy + 6 }); loadT.textContent = carry; }
  // timestamp brick: carried, then sitting in SYSTEM, then lifted to the top as part of TURN 4
  var bvis = (u >= 2.4 && u < T4AT + .25) || false, bxp, byp;
  if (carry === 'BRICK') { bxp = hx - 48; byp = hy - 19; } else if (u >= INS - .25 && u < 6.9) { var sl = seg(u, INS - .25, INS); bxp = lerp(700 - 48, 754, sm(sl)); byp = slotY(SL[1]) - 19; } else { bxp = hx - 48; byp = hy - 19; }
  if (u >= T4AT && u < T4AT + .25) { bxp = 775 - 48 + 40 * seg(u, T4AT, T4AT + .25); byp = slotY(SL[5]) - 19; }
  A(brick, { transform: 'translate(' + bxp + ',' + byp + ')', opacity: bvis ? 1 : 0 });
  brickT.textContent = u >= 6.2 ? '18:04:12' : '18:04:07';
  brickR.setAttribute('fill', u >= 7.3 ? '#b8860b' : RED);
  // the timestamp now lives at the end of TURN 4
  SL[5].ptx && (st.t4.vis > 0) && (SL[5].ptx.textContent = st.t4.mode === 'new' ? 'NEW · TIME' : SL[5].ptx.textContent);
  // landing dust
  var land = null; [LAND.t1, LAND.t2, LAND.t3, T4AT + .25, LAND.t5].forEach(function (L) { if (u >= L && u < L + .5) land = L; });
  dust.forEach(function (d, k) { if (land == null) { d.setAttribute('opacity', 0); return; } var p = (u - land) / .5, dir = k < 5 ? -1 : 1, kk = k % 5;
    A(d, { cx: (dir < 0 ? TX : TX + TW) + dir * (8 + p * (30 + kk * 12)), cy: GROUND - 10 - kk * 3 - p * 18, opacity: .8 * (1 - p), r: 4 + kk }); });
  // cost meter: T1 hit, T2 hit, T3 re-write, T4 re-write once (timestamp moved), T5 hit
  var BV = [[LAND.t1, .1, 'hit'], [LAND.t2, .1, 'hit'], [LAND.t3, 1.25, 'miss'], [T4AT + .25, 1.25, 'once'], [LAND.t5, .1, 'hit']];
  BARS.forEach(function (b, k) { var v = BV[k], p = back(seg(u, v[0], v[0] + .45)) * (1 - seg(u, RESET, RESET + .6)), h = Math.max(0, v[1] * UNIT * p), col = v[2] === 'hit' ? GRN : (v[2] === 'once' ? '#d9822b' : RED);
    A(b.r, { y: BASE - h, height: h, fill: col }); A(b.v, { y: BASE - h - 8, fill: col, opacity: p > 0 ? 1 : 0 }); b.v.textContent = v[1] + '×'; });
  // TTL ring: refreshed on every hit, rewritten (red flash) on a miss
  var resets = [0, LAND.t1, LAND.t2, LAND.t3, T4AT + .25, LAND.t5], last = 0; resets.forEach(function (r) { if (u >= r) last = r; });
  var frac = 1 - clamp((u - last) / 7, 0, 1), circ = 2 * Math.PI * 34, red = (u >= LAND.t3 && u < LAND.t3 + .6) || (u >= T4AT + .25 && u < T4AT + .85);
  A(ttlRing, { 'stroke-dasharray': (circ * frac) + ' ' + circ, stroke: red ? RED : GRN });
  ttlTxt.textContent = red ? 're-written: billed at 1.25×' : 'resets free on every hit';
  // callout
  var C = u < INS ? [STEEL, 'PREFIX UNCHANGED', ['Same tools, same system prompt:', 'only the new turn is fresh,', 'the rest is read from cache.']]
    : (u < 6.5 ? [RED, 'TIMESTAMP IN THE SYSTEM PROMPT', ['It changes on every request, so', 'that slab and every floor above', 'it are re-written each turn.']]
      : [GRN, 'TIMESTAMP MOVED TO THE END', ['Re-written once. From then on', 'only the newest turn changes;', 'everything below it is a hit.']]);
  A(callT, { fill: C[0] }); callT.textContent = C[1]; C[2].forEach(function (l, k) { callL[k].textContent = l; }); A(callDot, { fill: C[0], opacity: mod(u, .8) < .4 ? 1 : .35 });
  // rules highlight follows the story
  var R = u < LAND.t2 + .3 ? 1 : (u < LAND.t3 ? 3 : (u < 6.5 ? 2 : (u < LAND.t5 ? 4 : 1)));
  ruleG.forEach(function (h, k) { h.setAttribute('opacity', k === R ? .55 + .2 * Math.sin(u * 5) : 0); });
  A(statBg, { fill: u >= LAND.t5 + .4 && u < RESET ? STEEL : INK });
};
window.__reelDurationSec = DUR; window.__ready = false; window.__seek(0);
Promise.all([document.fonts.load('800 40px MR'), document.fonts.load('700 20px AZ'), document.fonts.load('600 20px IN'), document.fonts.load('700 20px IN')]).catch(function () {}).then(function () { window.__seek(0); window.__ready = true; });
})();
