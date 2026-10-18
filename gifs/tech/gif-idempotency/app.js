// "Your AI agent just paid twice." Idempotency keys as a pneumatic-tube bank (1080x1350, 12 s loop, pure function of t).
// Act 1, no key: the charge succeeds, the reply stalls at a timeout gate, the agent retries, the API charges again (duplicate).
// Act 2, with an idempotency key: the retry carries the same key, the dedup valve finds it in the key store and returns the
// saved response, so the card is charged once. Facts: Stripe API docs, "Idempotent requests" (read 18 Oct 2026).
(function () {
'use strict';
var NS = 'http://www.w3.org/2000/svg', DUR = 12, OFF = 4.7;
var BG = '#e5ede6', PANEL = '#f7faf6', INK = '#10302e', BRASS = '#c58b2a', BRASSD = '#8a5d14', OX = '#a3122a', KEYC = '#2563d9', OK = '#1c8a52',
  MUTE = '#4f6663', GLASS = '#d4e6e1', WHITE = '#ffffff', PAPER = '#fffdf6';
var svg = document.getElementById('s');
function E(tag, at, par, txt) { if (typeof par === 'string') { var sw = txt; txt = par; par = sw; } var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (txt != null) e.textContent = txt; (par || svg).appendChild(e); return e; }
function A(e, at) { for (var k in at) e.setAttribute(k, at[k]); return e; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function lerp(a, b, u) { return a + (b - a) * u; }
function mod(a, n) { return ((a % n) + n) % n; }
function back(x) { x = clamp(x, 0, 1); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function icon(n, x, y, s, col, par) { var g = E('g', { transform: 'translate(' + x + ',' + y + ') scale(' + s / 24 + ')', fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); g.innerHTML = (window.ICONS || {})[n] || ''; return g; }
function T(x, y, s, fam, w, col, txt, par, extra) { var at = { x: x, y: y, 'font-family': fam, 'font-weight': w, 'font-size': s, fill: col }; for (var k in (extra || {})) at[k] = extra[k]; return E('text', at, par || svg, txt); }

// ---- background + header -----------------------------------------------------------------------------------------------
E('rect', { x: 0, y: 0, width: 1080, height: 1350, fill: BG });
var dots = E('g', { fill: '#cbd9cd' }); for (var dx = 30; dx < 1080; dx += 40) for (var dy = 30; dy < 1350; dy += 40) E('circle', { cx: dx, cy: dy, r: 2 }, dots);
T(60, 62, 20, 'RM', 700, BRASSD, 'IDEMPOTENCY · WHY RETRIES CAN CHARGE TWICE', null, { 'letter-spacing': 1.5 });
T(58, 128, 60, 'DS', 400, INK, 'Your AI agent just paid twice.');
T(60, 172, 24, 'IN', 600, MUTE, 'The charge went through. Only the reply got lost, so it tried again.');
// mode switch: NO KEY | WITH AN IDEMPOTENCY KEY
E('rect', { x: 60, y: 200, width: 640, height: 56, rx: 28, fill: PANEL, stroke: INK, 'stroke-width': 3 });
var knob = E('rect', { x: 64, y: 204, width: 248, height: 48, rx: 24, fill: OX });
var swA = T(188, 236, 21, 'RM', 700, WHITE, 'NO KEY', null, { 'text-anchor': 'middle' });
var swB = T(506, 236, 21, 'RM', 700, INK, 'WITH AN IDEMPOTENCY KEY', null, { 'text-anchor': 'middle' });
var att = E('g', {}); E('rect', { x: 730, y: 200, width: 290, height: 56, rx: 28, fill: INK }, att);
var attT = T(875, 236, 21, 'RM', 700, WHITE, 'ATTEMPT 1', att, { 'text-anchor': 'middle' });

// ---- stations ----------------------------------------------------------------------------------------------------------
function box(x, y, w, h, fill) { return E('rect', { x: x, y: y, width: w, height: h, rx: 18, fill: fill || PANEL, stroke: INK, 'stroke-width': 3 }); }
// agent
box(60, 560, 300, 210);
icon('robot', 80, 576, 32, INK); T(122, 602, 24, 'RM', 700, INK, 'AI AGENT');
E('rect', { x: 78, y: 620, width: 264, height: 132, rx: 10, fill: INK });
var log = [0, 1, 2].map(function (k) { return T(92, 652 + k * 36, 19, 'RM', 500, '#bfe8d6', ''); });
var ringBg = E('circle', { cx: 318, cy: 592, r: 18, fill: 'none', stroke: '#c9d6d2', 'stroke-width': 7 });
var ring = E('circle', { cx: 318, cy: 592, r: 18, fill: 'none', stroke: KEYC, 'stroke-width': 7, transform: 'rotate(-90 318 592)', 'stroke-linecap': 'round' });
// payments API vault
box(700, 290, 320, 210);
icon('building-bank', 720, 306, 32, INK); T(762, 332, 24, 'RM', 700, INK, 'PAYMENTS API');
var door = E('g', {}); E('circle', { cx: 780, cy: 420, r: 46, fill: BRASS, stroke: INK, 'stroke-width': 4 }, door);
for (var sp = 0; sp < 6; sp++) E('line', { x1: 780, y1: 420, x2: 780 + 38 * Math.cos(sp * Math.PI / 3), y2: 420 + 38 * Math.sin(sp * Math.PI / 3), stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, door);
E('circle', { cx: 780, cy: 420, r: 12, fill: INK }, door);
T(840, 392, 20, 'RM', 700, MUTE, 'CHARGES MADE');
var charges = T(840, 462, 48, 'DS', 400, INK, '0');
var led = E('circle', { cx: 996, cy: 318, r: 7, fill: OK });
// key store (act 2)
box(700, 530, 320, 240);
icon('key', 718, 546, 28, KEYC); T(756, 570, 21, 'RM', 700, INK, 'KEY STORE');
T(720, 604, 18, 'RM', 500, MUTE, 'key → saved response');
E('line', { x1: 718, y1: 618, x2: 1002, y2: 618, stroke: '#c9d6d2', 'stroke-width': 2 });
var ksEmpty = T(720, 660, 20, 'IN', 600, MUTE, '(no key sent)');
var ksRow = E('g', {}); E('rect', { x: 716, y: 634, width: 288, height: 100, rx: 10, fill: '#dbe7fb' }, ksRow);
var ksK = T(732, 668, 22, 'RM', 700, KEYC, 'ord-1043', ksRow); var ksV = T(732, 712, 20, 'RM', 500, INK, '', ksRow);
// tubes (glass), drawn as wide stroke + inner glass + moving flow dashes
var OUT = 'M210 560 V395 Q210 365 240 365 H700', RET = 'M700 455 H310 Q280 455 280 485 V560';
function tube(d) { E('path', { d: d, fill: 'none', stroke: INK, 'stroke-width': 40, 'stroke-linecap': 'round' }); E('path', { d: d, fill: 'none', stroke: GLASS, 'stroke-width': 32, 'stroke-linecap': 'round' });
  return E('path', { d: d, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, 'stroke-dasharray': '10 26', opacity: .8 }); }
var flowO = tube(OUT), flowR = tube(RET);
var pO = E('path', { d: OUT, fill: 'none', stroke: 'none' }), pR = E('path', { d: RET, fill: 'none', stroke: 'none' });
var LO = pO.getTotalLength(), LR = pR.getTotalLength();
T(250, 414, 18, 'RM', 700, MUTE, 'REQUEST →'); T(298, 506, 18, 'RM', 700, MUTE, '← REPLY');
// pressure gauge on the request tube
E('circle', { cx: 210, cy: 470, r: 26, fill: PAPER, stroke: INK, 'stroke-width': 3 }); var needle = E('line', { x1: 210, y1: 470, x2: 210, y2: 452, stroke: OX, 'stroke-width': 4, 'stroke-linecap': 'round' });
// timeout gate on the reply tube
var GX = 470;
var gate = E('g', {}); E('rect', { x: GX - 20, y: 418, width: 40, height: 74, rx: 6, fill: BRASS, stroke: INK, 'stroke-width': 3 }, gate);
var gateTag = E('g', {}); E('rect', { x: GX - 92, y: 506, width: 184, height: 40, rx: 20, fill: OX }, gateTag); icon('clock', GX - 82, 514, 24, WHITE, gateTag);
T(GX + 14, 533, 18, 'RM', 700, WHITE, 'TIMEOUT', gateTag, { 'text-anchor': 'middle' });
// dedup valve in front of the API (act 2)
var valve = E('g', {}); E('rect', { x: 630, y: 330, width: 64, height: 80, rx: 10, fill: BRASS, stroke: INK, 'stroke-width': 3 }, valve); icon('key', 646, 356, 32, INK, valve);
var valveTag = T(662, 312, 18, 'RM', 700, KEYC, 'KEY CHECK', null, { 'text-anchor': 'middle' });
// canisters
function canister(fill, tagTxt) { var g = E('g', {}); E('rect', { x: -38, y: -15, width: 76, height: 30, rx: 15, fill: fill, stroke: INK, 'stroke-width': 3 }, g);
  E('rect', { x: -14, y: -9, width: 28, height: 18, rx: 4, fill: PAPER, stroke: INK, 'stroke-width': 2 }, g);
  var tag = E('g', {}, g); E('rect', { x: -44, y: -50, width: 88, height: 26, rx: 6, fill: KEYC }, tag); T(0, -31, 15, 'RM', 700, WHITE, tagTxt, tag, { 'text-anchor': 'middle' });
  return { g: g, tag: tag }; }
var CA = canister(BRASS, 'ord-1043'), CB = canister(BRASS, 'ord-1043'), CR = canister(OK, ''), CR2 = canister(OK, '');
CR.tag.setAttribute('opacity', 0); CR2.tag.setAttribute('opacity', 0);
var stamp = E('g', { opacity: 0 }); E('rect', { x: -150, y: -34, width: 300, height: 68, rx: 10, fill: 'rgba(255,253,246,.92)', stroke: OK, 'stroke-width': 6 }, stamp);
T(0, 14, 34, 'RM', 700, OK, 'ALREADY DONE', stamp, { 'text-anchor': 'middle' });

// ---- card statement + rules + source ----------------------------------------------------------------------------------
box(60, 800, 460, 290, PAPER);
icon('credit-card', 80, 818, 30, INK); T(122, 843, 22, 'RM', 700, INK, "CUSTOMER'S CARD");
E('line', { x1: 80, y1: 862, x2: 500, y2: 862, stroke: '#d6d2c4', 'stroke-width': 2, 'stroke-dasharray': '6 6' });
function row(y) { var g = E('g', { opacity: 0 }); E('rect', { x: 76, y: y - 30, width: 428, height: 46, rx: 8, fill: 'none' }, g);
  var a = T(92, y, 22, 'IN', 700, INK, 'ACME STORE · order 1043', g), b = T(488, y, 22, 'RM', 700, INK, '$49.00', g, { 'text-anchor': 'end' }); return { g: g, bg: g.firstChild, a: a, b: b }; }
var R1 = row(906), R2 = row(960);
var dup = E('g', { opacity: 0 }); E('rect', { x: 256, y: 978, width: 236, height: 50, rx: 8, fill: 'none', stroke: OX, 'stroke-width': 5 }, dup); T(374, 1013, 26, 'RM', 700, OX, 'DUPLICATE', dup, { 'text-anchor': 'middle' });
var once = E('g', { opacity: 0 }); E('rect', { x: 76, y: 932, width: 428, height: 46, rx: 23, fill: '#d6efdf' }, once); icon('check', 92, 943, 24, OK, once); T(124, 963, 22, 'IN', 700, OK, 'Charged once. Retry was safe.', once);
var tot = T(92, 1066, 22, 'RM', 700, INK, '');
box(60, 1110, 460, 190);
T(80, 1146, 18, 'RM', 700, BRASSD, 'FROM STRIPE\'S API DOCS', null, { 'letter-spacing': 1 });
['Server saves the first response', 'and returns it for every repeat.', 'Keys up to 255 characters,', 'kept at least 24 hours.'].forEach(function (l, k) { T(80, 1182 + k * 28, 21, 'IN', 600, INK, l); });
box(550, 800, 470, 500);
T(574, 840, 22, 'RM', 700, INK, 'THE FIX', null, { 'letter-spacing': 1.5 });
var RULES = [['The charge went through.', 'Only the reply was lost.'], ['A retry without a key is', 'a brand-new charge.'], ['Send one key per payment,', 'the same on every retry.'],
  ['Server sees the key again:', 'returns the saved result.'], ['Same key, different details:', 'rejected, not charged.']];
var RH = RULES.map(function (r, i) { var y = 892 + i * 82, g = E('g', {}); var hl = E('rect', { x: 562, y: y - 34, width: 446, height: 76, rx: 12, fill: '#f3d9a6', opacity: 0 }, g);
  E('circle', { cx: 592, cy: y + 2, r: 18, fill: INK }, g); T(592, y + 9, 19, 'RM', 700, WHITE, String(i + 1), g, { 'text-anchor': 'middle' });
  T(622, y - 2, 22, 'IN', 700, INK, r[0], g); T(622, y + 26, 22, 'IN', 600, INK, r[1], g); return hl; });
T(60, 1334, 17, 'IN', 600, MUTE, 'Source: Stripe API reference, "Idempotent requests" (read 18 Oct 2026). Tubes and timings are a schematic.');

// ---- story -------------------------------------------------------------------------------------------------------------
var K = 6.0;   // act 2 starts
function at(p, L, u) { var q = p.getPointAtLength(clamp(u, 0, 1) * L); return [q.x, q.y]; }
function place(c, xy, vis) { c.g.setAttribute('transform', 'translate(' + xy[0] + ',' + xy[1] + ')'); c.g.setAttribute('opacity', vis ? 1 : 0); }
var GATEU = (700 - GX) / LR;   // reply tube progress where the timeout gate sits
window.__seek = function (tt) {
  var u = mod(tt + OFF, DUR), act2 = u >= K - .4 && u < 11.6, a = act2 ? u - K : u;   // a = time within the act
  // switch
  var sw = sm(seg(u, K - .5, K - .1)) * (1 - sm(seg(u, 11.4, 11.8)));
  A(knob, { x: lerp(64, 316, sw), width: lerp(248, 380, sw), fill: sw > .5 ? KEYC : OX }); A(swA, { fill: sw > .5 ? INK : WHITE }); A(swB, { fill: sw > .5 ? WHITE : INK });
  // ambient
  flowO.setAttribute('stroke-dashoffset', -u * 60); flowR.setAttribute('stroke-dashoffset', u * 60);
  var nd = -50 + 30 * Math.sin(u * 3.1) + 10 * Math.sin(u * 7.3); A(needle, { x2: 210 + 18 * Math.sin(nd * Math.PI / 180), y2: 470 - 18 * Math.cos(nd * Math.PI / 180) });
  led.setAttribute('opacity', mod(u, .9) < .45 ? 1 : .3); dots.setAttribute('opacity', 1);
  // attempt 1 request, reply stalls at the gate, attempt 2 request
  var s1 = .3, s2 = 3.1;                                      // request departures within an act
  var req1 = seg(a, s1, s1 + 1.1), req2 = seg(a, s2, s2 + 1.1);
  place(CA, at(pO, LO, sm(req1)), a >= s1 && a < s1 + 1.15 && (u < 11.4)); CA.tag.setAttribute('opacity', act2 ? 1 : 0);
  place(CB, at(pO, LO, sm(req2)), a >= s2 && a < s2 + 1.15 && (u < 11.4)); CB.tag.setAttribute('opacity', act2 ? 1 : 0);
  // reply 1: leaves the API, stops at the timeout gate and never arrives
  var r1 = seg(a, 1.7, 2.4); var r1u = lerp(0, GATEU - .02, sm(r1));
  place(CR, at(pR, LR, r1u), a >= 1.7 && a < 5.6 && u < 11.4);
  // reply 2: act 1 = the second charge's reply (arrives); act 2 = the saved response from the key store (arrives)
  var r2 = seg(a, 4.4, 5.2); place(CR2, at(pR, LR, sm(r2)), a >= 4.4 && a < 5.25 && u < 11.4);
  var stall = a >= 2.4 && a < 5.6 && u < 11.4; gateTag.setAttribute('opacity', stall ? (mod(u, .6) < .4 ? 1 : .55) : 0);
  // agent timer ring: waiting for the reply, runs out at 3.1 -> retry
  var w = a >= s1 + 1.1 && a < s2 ? seg(a, 1.4, 3.1) : 0, circ = 2 * Math.PI * 18;
  A(ring, { 'stroke-dasharray': (circ * (1 - w)) + ' ' + circ, stroke: w > .7 ? OX : KEYC });
  attT.textContent = a >= s2 ? 'ATTEMPT 2 · RETRY' : 'ATTEMPT 1';
  // agent log
  var L1 = act2 ? 'POST + key ord-1043' : 'POST /charges $49.00', L2 = a < 2.4 ? 'waiting for reply…' : 'no reply: timed out', L3 = a < s2 ? '' : (act2 ? 'retry, same key' : 'retry (no key)');
  if (a >= 4.4) L3 = act2 ? 'got saved reply ✓' : 'got reply ✓';
  [L1, a >= .6 ? L2 : '', L3].forEach(function (s, k) { log[k].textContent = u >= 11.4 ? '' : s; });
  // API: charges and door spin on each executed request
  var exec1 = a >= 1.4, exec2 = !act2 && a >= 4.2, n = (u >= 11.4 ? 0 : (exec1 ? 1 : 0) + (exec2 ? 1 : 0));
  charges.textContent = String(n); A(charges, { fill: n > 1 ? OX : INK });
  var spin = (a >= 1.4 && a < 1.9 ? seg(a, 1.4, 1.9) : 0) + (exec2 && a < 4.7 ? seg(a, 4.2, 4.7) : 0); door.setAttribute('transform', 'rotate(' + (spin * 120 + (exec1 ? 120 : 0) + (exec2 && a >= 4.7 ? 120 : 0)) + ' 780 420)');
  // valve + key store (act 2 only)
  var vOn = act2 ? 1 : .0; valve.setAttribute('opacity', vOn); valveTag.setAttribute('opacity', vOn);
  ksEmpty.setAttribute('opacity', act2 && a >= 1.3 ? 0 : 1); ksEmpty.textContent = act2 ? 'waiting for a key…' : '(no key sent)';
  ksRow.setAttribute('opacity', act2 && a >= 1.3 ? 1 : 0); ksV.textContent = a >= 1.6 ? '→ 200 OK · $49.00' : '→ (running…)';
  var st = act2 && a >= 4.2 && a < 5.6 && u < 11.4; stamp.setAttribute('opacity', st ? 1 : 0);
  if (st) stamp.setAttribute('transform', 'translate(470,300) rotate(-5) scale(' + (a < 4.45 ? lerp(1.6, .9, back(seg(a, 4.2, 4.45))) : .9) + ')');
  // card statement
  var c1 = u < 11.4 && a >= 1.6, c2 = !act2 && a >= 4.4 && u < 11.4;
  R1.g.setAttribute('opacity', c1 ? E5(seg(a, 1.6, 1.9)) : 0); R2.g.setAttribute('opacity', c2 ? E5(seg(a, 4.4, 4.7)) : 0); A(R2.a, { fill: OX }); A(R2.b, { fill: OX });
  dup.setAttribute('opacity', c2 && a >= 4.6 ? 1 : 0); if (c2) dup.setAttribute('transform', 'rotate(-4 374 1003) scale(1)');
  once.setAttribute('opacity', act2 && a >= 4.6 && u < 11.4 ? E5(seg(a, 4.6, 4.9)) : 0);
  tot.textContent = u >= 11.4 || !c1 ? '' : (c2 ? 'TOTAL  $98.00' : 'TOTAL  $49.00'); A(tot, { fill: c2 ? OX : INK });
  // rules highlight
  var R = !act2 ? (a < 2.4 ? 0 : 1) : (a < 1.6 ? 2 : (a < 5.0 ? 3 : 4));
  RH.forEach(function (h, k) { h.setAttribute('opacity', k === R && u < 11.6 ? .75 + .25 * Math.sin(u * 5) : 0); });
};
function E5(x) { return 1 - Math.pow(1 - clamp(x, 0, 1), 3); }
window.__reelDurationSec = DUR; window.__ready = false; window.__seek(0);
Promise.all([document.fonts.load('400 40px DS'), document.fonts.load('700 20px RM'), document.fonts.load('500 20px RM'), document.fonts.load('600 20px IN'), document.fonts.load('700 20px IN')]).catch(function () {}).then(function () { window.__seek(0); window.__ready = true; });
})();
