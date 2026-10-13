// Reel #01 "You've never heard YOU" (full build, 30 s). Everything is a pure function of t (window.__seek).
// Scene times derive from timing.js (voice line/word times): swap the voice, rebuild, and the whole reel re-times.
(function () {
'use strict';
var W = 1080, H = 1920, IW = 576, IH = 1024, NS = 'http://www.w3.org/2000/svg', DUR = 30;
var $ = function (id) { return document.getElementById(id); };
window.__reelDurationSec = DUR; window.__ready = false; window.EV = [];
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function e3(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function back(x) { x = clamp(x, 0, 1); var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function lerp(a, b, k) { return a + (b - a) * k; }
function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
var AN = window.AN, TM = window.TM, EAR = window.EAR;

// ---------- voice timing: line i (1-based) and the start of its k-th display word (proportional to characters)
var LW = ["You've never heard your own voice the way everyone else does.", "Two routes to your ears: air, and bone.", "Everyone hears the air. Only you get the bone.", "A recording only catches the air.", "One theory says you'd sound higher.", "A 2025 study: most people heard lower.", "Send this to the friend who hates voice notes.", "Now plug your ears and say anything.", "Nobody else will ever hear the version you hear."].map(function (s) { return s.split(' '); });
function L(i) { return TM.lines[i - 1]; }
function wt(i, k) { var l = L(i), ws = LW[i - 1], tot = ws.join(' ').length, c = 0; for (var j = 0; j < k; j++) c += ws[j].length + 1; return l.a + (l.b - l.a) * c / tot; }
function ev(t, type, extra) { window.EV.push({ t: +t.toFixed(3), type: type, x: extra }); }

// ---------- scene boundaries (BD[i] = boundary between scene i and i+1) and transition kinds
var BD = [L(1).b + .12, L(2).b + .2, L(3).b + .25, L(4).b + .12, L(5).a - .05, L(6).b + .55, L(7).b + .3, L(9).b + .55];
var SCN = ['s1', 's2', 's3', 's4', 's5', 's6', 's8', 's9', 's12'];
var TK = ['dive', 'cross', 'whip', 'dive', 'rise', 'whip', 'tilt', 'dive'];
var TW = [.9, .5, .6, .8, .5, .7, .7, .8];
function sa(i) { return i === 0 ? 0 : BD[i - 1]; } function sb(i) { return i === SCN.length - 1 ? DUR : BD[i]; }
BD.forEach(function (b, i) { ev(b, 'tr_' + TK[i]); });

// ---------- camera on the photo plate: cam = {z,cx,cy}; same maths drives the shader and DOM anchors
function sh(cam) { return [(cam.cx / IW - .5) * (1 - 1 / cam.z), ((1 - cam.cy / IH) - .5) * (1 - 1 / cam.z)]; }
function scr(a, cam) { var s = sh(cam), px = a[0] / IW, py = 1 - a[1] / IH; var u = (px - .5 - s[0]) * cam.z + .5, v = (py - .5 - s[1]) * cam.z + .5; return [u * W, (1 - v) * H]; }
function lensImg(t) { var k = 1 - seg(t, BD[0] - 1.0, BD[0] - .5); var s = AN.head.skull; return [s[0] + Math.sin(t * .8) * 46 * k, s[1] + Math.cos(t * .55) * 40 * k]; }
function cam1(t) { var tt = Math.max(0, t), push = eio(seg(t, BD[0] - .6, BD[0] + .05)); var lc = lensImg(Math.min(t, BD[0] - 1.0)), z0 = 1 + .06 * eio(seg(tt, 0, BD[0] - .6));
  return { z: z0 + 1.35 * push, cx: lerp(IW / 2 + Math.sin(tt * .4) * 12, lc[0], push), cy: lerp(IH / 2, lc[1], push) }; }
function cam4(t) { var u = seg(t, sa(3), sb(3)); return { z: 1.18 + .08 * u, cx: 300, cy: 470 }; }
function cam8(t) { return { z: 2.4, cx: 420 + 10 * Math.sin(t * .3), cy: 900 }; }
function cam9(t) { var u = seg(t, sa(7), DUR - 1); return { z: 1.3 + .07 * e3(u) + .05 * eio(seg(t, L(9).a, L(9).b)), cx: 60 + 14 * u, cy: 225 + 10 * Math.sin(t * .4) }; }
var drift = function (t) { return [Math.sin(t * .45) * 9, Math.cos(t * .37) * 6]; };

// ---------- gl plate per scene: shader state for scene index i at time t
function glFor(i, t) {
  var par = [Math.sin(t * .5) * .6, Math.cos(t * .4) * .3];
  if (i === 0) { var c = cam1(t); return { shot: 'head_a', cam: [par[0], par[1], c.z], sh: sh(c), dim: .88 - .1 * eio(seg(t, BD[0] - .6, BD[0] - .1)), par: .045 }; }
  if (i === 1 || i === 2) return { shot: 'xray_skull', cam: [par[0] * .8, 0, 1 + .1 * seg(t, sa(1), sb(2))], sh: [0, 0], dim: .42, par: .03 };
  if (i === 3) { var c4 = cam4(t); return { shot: 'head_a', cam: [par[0], par[1], c4.z], sh: sh(c4), dim: .82, par: .045 }; }
  if (i === 4) return { shot: 'xray_skull', cam: [par[0] * .6, 0, 1.05 + .05 * seg(t, sa(4), sb(4))], sh: [0, 0], dim: .32, par: .03 };
  if (i === 5) return { shot: 'xray_skull', cam: [par[0] * .6, 0, 1.08 + .08 * seg(t, sa(5), sb(5))], sh: [0, 0], dim: .42, par: .03 };
  if (i === 6) { var c8 = cam8(t); return { shot: 'head_a', cam: [par[0], par[1], c8.z], sh: sh(c8), dim: .5, par: .03 }; }
  if (i === 7) { var c9 = cam9(t); return { shot: 'head_a', cam: [par[0] * 1.2, par[1], c9.z], sh: sh(c9), dim: .8, par: .05 }; }
  return { shot: 'xray_skull', cam: [par[0] * .5, 0, 1.1], sh: [0, 0], dim: .26, par: .03 };
}
function sceneAt(t) { for (var i = 0; i < SCN.length; i++) if (t < sb(i)) return i; return SCN.length - 1; }
function seekGL(t) {
  var i = sceneAt(t), a = glFor(i, t), o = { a: a.shot, camA: a.cam, shA: a.sh, par: a.par, t: t, dim: a.dim, flash: 0 };
  var next = i + 1 < SCN.length ? glFor(i + 1, t) : null, bd = i < BD.length ? BD[i] : 1e9, prev = i > 0 ? glFor(i - 1, t) : null;
  if (next && t > bd - TW[i] * .55) { var m = eio(seg(t, bd - TW[i] * .5, bd - TW[i] * .05)); if (next.shot !== a.shot) { o.b = next.shot; o.camB = next.cam; o.shB = next.sh; o.mix = m; } else { o.camA = next.cam; o.shA = next.sh; o.dim = lerp(a.dim, next.dim, m); } }
  else if (prev && t < sa(i) + TW[i - 1] * .45 && prev.shot !== a.shot) { o.a = prev.shot; o.camA = prev.cam; o.shA = prev.sh; o.b = a.shot; o.camB = a.cam; o.shB = a.sh; o.mix = eio(seg(t, sa(i) - TW[i - 1] * .1, sa(i) + TW[i - 1] * .4)); o.dim = a.dim; }
  var k = i < TK.length ? TK[i] : '', kp = i > 0 ? TK[i - 1] : '';
  if (k === 'whip' || kp === 'whip') { var wb = (k === 'whip' ? BD[i] : BD[i - 1]), ww = TW[k === 'whip' ? i : i - 1]; o.whip = Math.sin(Math.PI * seg(t, wb - ww * .6, wb + ww * .4)) * .09; o.wdir = [1, 0]; }
  if (k === 'tilt' || kp === 'tilt') { var tb = (k === 'tilt' ? BD[i] : BD[i - 1]), tw = TW[k === 'tilt' ? i : i - 1]; o.whip = Math.sin(Math.PI * seg(t, tb - tw * .6, tb + tw * .4)) * .09; o.wdir = [0, 1]; }
  if (t > DUR - .45) { var lm = e3(seg(t, DUR - .45, DUR)), h = glFor(0, 0); o.b = h.shot; o.camB = h.cam; o.shB = h.sh; o.mix = lm; }
  window.GLP.draw(o);
}

// ---------- shared builders
function defsFor(svg) { var d = el('defs', {}, svg), f = el('filter', { id: 'glowc', x: '-30%', y: '-30%', width: '160%', height: '160%' }, d); el('feGaussianBlur', { stdDeviation: 5, result: 'b' }, f); var m = el('feMerge', {}, f); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
  var g = el('filter', { id: 'glowo', x: '-40%', y: '-40%', width: '180%', height: '180%' }, d); el('feGaussianBlur', { stdDeviation: 6, result: 'b' }, g); var m2 = el('feMerge', {}, g); el('feMergeNode', { in: 'b' }, m2); el('feMergeNode', { in: 'SourceGraphic' }, m2); }
function wipe(svg) { while (svg.childNodes.length > 1) svg.removeChild(svg.lastChild); }
['lsvg1', 'lrim1', 'waves1', 'rt2', 'rt3', 'crowd', 'waves4', 'snap4', 'guess5', 'poll', 'rough6', 'rough8', 'lsvg9', 'lrim9', 'endsvg'].forEach(function (id) { defsFor($(id)); });
function lensRim(svg, cx, cy, R, t, label) {
  wipe(svg); el('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: '#5ce6ff', 'stroke-width': 4, filter: 'url(#glowc)' }, svg);
  var d = el('circle', { cx: cx, cy: cy, r: R + 14, fill: 'none', stroke: '#5ce6ff', 'stroke-width': 9, 'stroke-dasharray': '2 14', opacity: .65 }, svg); d.setAttribute('transform', 'rotate(' + (t * 14) + ' ' + cx + ' ' + cy + ')');
  [0, 90, 180, 270].forEach(function (a) { var r = a * Math.PI / 180; el('path', { d: 'M' + (cx + Math.cos(r) * (R - 22)) + ' ' + (cy + Math.sin(r) * (R - 22)) + 'L' + (cx + Math.cos(r) * (R + 2)) + ' ' + (cy + Math.sin(r) * (R + 2)), stroke: '#5ce6ff', 'stroke-width': 4 }, svg); });
  if (label) { var tx = el('text', { x: cx + R * .72, y: cy - R * .72 - 14, fill: '#5ce6ff', 'font-family': 'Frag', 'font-size': 18, 'letter-spacing': '2' }, svg); tx.textContent = label; }
}
function put(e, k, x, y, s0) { var s = lerp(s0 == null ? .7 : s0, 1, k); e.style.opacity = clamp(k * 3, 0, 1); e.style.transform = 'translate(' + (x || 0) + 'px,' + (y || 0) + 'px) scale(' + s + ')'; }
function wordsIn(h, t, t0, st) { var ws = h.querySelectorAll('.w'); for (var i = 0; i < ws.length; i++) { var k = back(seg(t, t0 + i * st, t0 + i * st + .45)), o = seg(t, t0 + i * st, t0 + i * st + .18); ws[i].style.opacity = o; ws[i].style.transform = 'translateY(' + ((1 - k) * 60) + 'px) rotate(' + ((1 - k) * 5) + 'deg)'; } }
function wordsOut(h, t, t0) { var ws = h.querySelectorAll('.w'); for (var i = 0; i < ws.length; i++) { var k = seg(t, t0 + i * .05, t0 + i * .05 + .25); ws[i].style.opacity = 1 - k; ws[i].style.transform = 'translateY(' + (-k * 40) + 'px)'; } }
function bars(id, n) { var b = $(id); for (var i = 0; i < n; i++) b.appendChild(document.createElement('i')); return b.children; }
var pb1 = bars('pbars1', 16), pb4 = bars('pbars4', 22), pb8 = bars('pbars8', 16);
function animBars(list, t, played, amp) { for (var j = 0; j < list.length; j++) { var h = 8 + Math.abs(Math.sin(j * 1.7 + t * 6) * 22 + Math.sin(j * .6 + t * 3) * 9) * (amp == null ? 1 : amp); list[j].style.height = h.toFixed(1) + 'px'; list[j].style.opacity = j < played ? 1 : .42; } }
function pathCR(p) { var d = 'M' + p[0][0] + ' ' + p[0][1]; for (var i = 0; i < p.length - 1; i++) { var p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)]; d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6) + ' ' + p2[0] + ' ' + p2[1]; } return d; }
function route(svg, pts, col, prog, t, w, key) {
  var pa = el('path', { d: pathCR(pts), fill: 'none', stroke: col, 'stroke-width': w || 7, 'stroke-linecap': 'round', filter: 'url(#glowc)' }, svg), len = pa.getTotalLength();
  pa.setAttribute('stroke-dasharray', len); pa.setAttribute('stroke-dashoffset', len * (1 - prog));
  if (prog > .02) { var ph = (t * .55 + (key || 0)) % 1, pp = pa.getPointAtLength(Math.min(len * prog, len) * ph); el('circle', { cx: pp.x, cy: pp.y, r: 13, fill: '#fff', opacity: .95, filter: 'url(#glowc)' }, svg); el('circle', { cx: pp.x, cy: pp.y, r: 22, fill: col, opacity: .4 }, svg); }
  return len;
}

// ---------- ear macro frames (Blender sequence scrubbed by t)
var efs = { 2: document.querySelectorAll('.ef2'), 3: document.querySelectorAll('.ef3') };
function earFrame(fi) { var a = Math.floor(fi), b = Math.min(15, a + 1), k = fi - a; return { a: a, b: b, k: k }; }
function earPts(key, fi) { var f = earFrame(fi), A = EAR.frames[f.a][key], B = EAR.frames[f.b][key]; return A.map(function (p, i) { return [lerp(p[0], B[i][0], f.k), lerp(p[1], B[i][1], f.k)]; }); }
function earPt(key, fi) { var f = earFrame(fi), A = EAR.frames[f.a][key], B = EAR.frames[f.b][key]; return [lerp(A[0], B[0], f.k), lerp(A[1], B[1], f.k)]; }
function vpg(t) { var u = e3(seg(t, L(3).a - .15, L(3).a + .55)); return { cx: 540, cy: lerp(900, 840, u), R: lerp(330, 250, u) }; }
function earFi(t) { return eio(seg(t, sa(1) + .1, sb(2) - .3)) * 15; }
function placeVp(n, g, fi, op) {
  var vp = $('vp' + n); vp.style.left = (g.cx - g.R) + 'px'; vp.style.top = (g.cy - g.R) + 'px'; vp.style.width = vp.style.height = (2 * g.R) + 'px'; vp.style.opacity = op;
  var kk = (2 * g.R * 1.25) / 900, ew = $('ew' + n); ew.style.width = ew.style.height = '900px'; ew.style.transformOrigin = '0 0'; ew.style.transform = 'translate(' + (g.R - 450 * kk) + 'px,' + (g.R - 450 * kk) + 'px) scale(' + kk + ')';
  var f = earFrame(fi); efs[n].forEach(function (im, i) { im.style.opacity = i === f.a ? (1 - f.k * (f.b !== f.a ? 1 : 0)) : (i === f.b ? f.k : 0); });
  return kk;
}
function e2s(p, g, kk) { return [g.cx + (p[0] - 450) * kk, g.cy + (p[1] - 450) * kk]; }

// ---------- chrome (persistent): eyebrow, tracker, source line, caption
var EYE = ['VOICE NOTE, PLAYED BACK', 'TWO ROUTES TO YOUR EARS', 'WHO GETS WHICH ROUTE', "WHAT THE MIC CAN'T CATCH", 'WHAT DO YOU GUESS?', 'THE TEXTBOOK IDEA', 'FOR THE VOICE-NOTE HATER', 'EARS PLUGGED · BONE ROUTE ONLY', ''];
var SRCT = ['SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A', 'SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A', 'SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A', 'SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A', 'SRC · NO CLAIM: THE GUESS IS YOURS', 'SRC · WALTER ET AL. 2025, CAN. ACOUSTICS 53(3)', 'SRC · SHARE LINE, NO CLAIM', 'SRC · HULLAR, SCIENTIFIC AMERICAN · TIER A', ''];
var TRK = [[], [1], [1, 2], [1, 2], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4]];
var capEl = $('cap');
(function () { LW.forEach(function (ws, i) { var h = ws.map(function (w, k) { return '<span class="cw" data-i="' + i + '" data-k="' + k + '">' + w + '</span>'; }).join(' '); var d = document.createElement('div'); d.style.display = 'none'; d.innerHTML = h; d.id = 'capl' + (i + 1); capEl.appendChild(d); }); })();
function chrome(t, si) {
  var ey = $('eyebrow'), txt = EYE[si], n = si === 0 ? txt.length : Math.floor(clamp((t - sa(si) - .1) * 55, 0, txt.length)); ey.textContent = txt ? '// ' + txt.slice(0, n) : '';
  var tk = TRK[si]; [1, 2, 3, 4].forEach(function (k) { $('t' + k).classList.toggle('on', tk.indexOf(k) >= 0); });
  $('src').textContent = SRCT[si]; $('rule').style.opacity = si === 8 ? 0 : 1; $('src').style.opacity = si === 8 ? 0 : 1; $('aitag').style.opacity = si === 8 ? 0 : 1;
  var cur = 0; for (var i = 1; i <= 9; i++) if (t >= L(i).a - .12 && t <= L(i).b + .4) cur = i;
  for (var j = 1; j <= 9; j++) $('capl' + j).style.display = j === cur ? 'block' : 'none';
  capEl.style.opacity = cur ? (cur === 1 ? 1 : clamp(seg(t, L(cur).a - .12, L(cur).a + .04) * 1.2, 0, 1)) * (1 - seg(t, L(cur).b + .15, L(cur).b + .4)) : 0;
  capEl.classList.toggle('long', cur === 1);
  if (cur) { var ws = $('capl' + cur).children, l = L(cur); for (var k = 0; k < ws.length; k++) ws[k].classList.toggle('on', t >= wt(cur, k) && t < (k + 1 < ws.length ? wt(cur, k + 1) : l.b + .05)); }
}

// ---------- transitions: per-scene root transform / opacity / blur from the boundaries on either side
var PIV = [null, null, null, [668, 1120], null, null, null, [540, 860]];
function fx(i, t) {
  var tr = 'none', op = 1, bl = 0;
  var a0 = sa(i), b0 = sb(i), tin = i > 0 ? TW[i - 1] : 0, tout = i < BD.length ? TW[i] : 0;
  if (t < a0 - tin * .55 || t > b0 + tout * .5) return null;
  if (i > 0 && t < a0 + tin * .45) { var k = i - 1, u = eio(seg(t, a0 - tin * .45, a0 + tin * .35)), kind = TK[k];
    if (kind === 'dive') { op = seg(t, a0 - tin * .12, a0 + tin * .15); tr = 'scale(' + (1.7 - .7 * e3(seg(t, a0 - .02, a0 + .5))) + ')'; bl = (1 - e3(seg(t, a0 - .02, a0 + .5))) * 14; }
    else if (kind === 'whip') { tr = 'translateX(' + ((1 - u) * 1400) + 'px)'; bl = (1 - u) * 24; op = seg(t, a0 - tin * .45, a0 - tin * .1); }
    else if (kind === 'tilt') { tr = 'translateY(' + ((1 - u) * 1500) + 'px)'; bl = (1 - u) * 24; op = seg(t, a0 - tin * .45, a0 - tin * .1); }
    else if (kind === 'rise') { op = u; tr = 'translateY(' + ((1 - u) * 120) + 'px) scale(' + (.97 + .03 * u) + ')'; }
    else { op = u; } }
  if (i < BD.length && t > b0 - tout * .55) { var kind2 = TK[i], u2 = eio(seg(t, b0 - tout * .55, b0 + tout * .05)), P = PIV[i] || [540, 860];
    if (kind2 === 'dive') { var q = eio(seg(t, b0 - .6, b0 + .05)); $(SCN[i]).style.transformOrigin = P[0] + 'px ' + P[1] + 'px'; tr = 'scale(' + (1 + q * 2.6) + ')'; op = Math.min(op, 1 - Math.pow(q, 2.2)); bl = q * 10; }
    else if (kind2 === 'whip') { tr = 'translateX(' + (-u2 * 1400) + 'px)'; bl = u2 * 24; op = Math.min(op, 1 - seg(t, b0 - .1, b0 + tout * .05)); }
    else if (kind2 === 'tilt') { tr = 'translateY(' + (-u2 * 1500) + 'px)'; bl = u2 * 24; op = Math.min(op, 1 - seg(t, b0 - .1, b0 + tout * .05)); }
    else if (kind2 === 'rise') { op = Math.min(op, 1 - u2); tr = 'translateY(' + (-u2 * 160) + 'px)'; }
    else { op = Math.min(op, 1 - u2); } }
  return { tr: tr, op: op, bl: bl };
}

// ---------- scene renderers (t absolute)
var gen = rough.generator();
var rp6 = gen.toPaths(gen.ellipse(760, 714, 316, 170, { seed: 7, roughness: 1.8 })), rpath6 = el('path', { d: rp6[0].d, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 4, 'stroke-linecap': 'round' }, $('rough6')), rlen6 = rpath6.getTotalLength();
var rx8 = gen.toPaths(gen.line(160, 690, 440, 830, { seed: 3, roughness: 2 })).concat(gen.toPaths(gen.line(440, 690, 160, 830, { seed: 5, roughness: 2 }))), rxp = rx8.map(function (p) { var e = el('path', { d: p.d, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 7, 'stroke-linecap': 'round' }, $('rough8')); e._l = e.getTotalLength(); e.setAttribute('stroke-dasharray', e._l); return e; });

function r1(t) {
  var tt = t > DUR - .45 ? 0 : t, c = cam1(tt), lc = lensImg(tt), lcs = scr(lc, c), push = eio(seg(tt, BD[0] - .6, BD[0] + .05)), R = 200 * c.z + 1100 * push, d = drift(tt);
  var L1 = $('lens1'); L1.style.clipPath = 'circle(' + R + 'px at ' + lcs[0] + 'px ' + lcs[1] + 'px)'; L1.style.background = 'rgba(3,8,18,.86)';
  var sk = scr(AN.head.ear, c), s = c.z * (W / IW) * AN.xray.k, xi = $('xr1'); xi.style.mixBlendMode = 'screen'; xi.style.filter = 'brightness(1.25) contrast(1.15) saturate(1.1)';
  xi.style.transform = 'translate(' + (sk[0] - AN.xray.ear[0] * s + AN.xray.dx * c.z) + 'px,' + (sk[1] - AN.xray.ear[1] * s + AN.xray.dy * c.z) + 'px) scale(' + s + ')';
  var ls = $('lsvg1'); wipe(ls); var pc = scr(AN.head.coral, c), pul = 1 + .07 * Math.sin(tt * 5.2);
  [[44, 8, 1], [76, 3, .55], [106, 2, .3]].forEach(function (r) { el('circle', { cx: pc[0], cy: pc[1], r: r[0] * c.z * pul, fill: 'none', stroke: '#ff5a4d', 'stroke-width': r[1] * c.z, opacity: r[2], filter: 'url(#glowo)' }, ls); });
  el('circle', { cx: pc[0], cy: pc[1], r: 18 * c.z * pul, fill: '#ff5a4d', filter: 'url(#glowo)' }, ls);
  lensRim($('lrim1'), lcs[0], lcs[1], R, tt, push < .1 ? 'X-RAY' : ''); $('lrim1').style.opacity = 1 - push * .8;
  var wv = $('waves1'); wipe(wv); var m = scr(AN.head.mouth, c);
  for (var i = 0; i < 3; i++) { var ph = (tt * .85 + i / 3) % 1, r = 36 + ph * 210, a0 = -8 * Math.PI / 180, a1 = 64 * Math.PI / 180;
    el('path', { d: 'M' + (m[0] + r * Math.cos(a0)) + ' ' + (m[1] + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 0 1 ' + (m[0] + r * Math.cos(a1)) + ' ' + (m[1] + r * Math.sin(a1)), fill: 'none', stroke: '#5ce6ff', 'stroke-width': 7 - 4 * ph, 'stroke-linecap': 'round', opacity: (1 - ph) * .95 * (1 - push), filter: 'url(#glowc)' }, wv); }
  var tg = $('bonetag'); tg.style.left = (lcs[0] - R * .9) + 'px'; tg.style.top = (lcs[1] + R + 12) + 'px'; tg.style.opacity = (1 - push) * clamp(seg(tt, 0, .3) + .5, 0, 1); tg.style.display = R > 600 ? 'none' : 'block';
  var p1 = $('phone1'); put(p1, e3(seg(tt, 0, .35)), d[0] * 1.6, d[1] * 1.6, .85); p1.style.opacity = 1 - push;
  animBars(pb1, tt, (tt * 2.2) % 16);
  var pcd = $('peep1'); put(pcd, back(seg(tt, 0, .5)), d[0] * 1.2, d[1] * 1.2, .7); pcd.style.opacity = 1 - push;
  var ug = $('ugh1'); put(ug, back(seg(tt, .15, .6)), 0, Math.sin(tt * 7) * 2, .6); ug.style.opacity = 1 - push;
  var ch = $('chips1'); put(ch, e3(seg(tt, 0, .4)), 0, 0, .9); ch.style.opacity = 1 - push;
  $('h1').style.opacity = 1 - seg(tt, BD[0] - 1.0, BD[0] - .55); $('h1').style.transform = 'translate(' + (-d[0] * .3) + 'px,' + (-d[1] * .3) + 'px)';
}
function r2(t) {
  if (!r2.f) { r2.f = 1; ev(wt(2, 5), 'air'); ev(wt(2, 7), 'bone'); }
  var g = vpg(t), fi = earFi(t), kk = placeVp(2, g, fi, 1), op = seg(t, sa(1) - .1, sa(1) + .4);
  $('vp2').style.opacity = op; var rt = $('rt2'); wipe(rt); rt.style.opacity = op;
  wordsIn($('h2'), t, sa(1) + .15, .1);
  var pa = e3(seg(t, wt(2, 5) - .25, wt(2, 5) + .7)), pb = e3(seg(t, wt(2, 7) - .25, wt(2, 7) + .7));
  var air = earPts('air', fi).map(function (p) { return e2s(p, g, kk); }), bone = earPts('bone', fi).map(function (p) { return e2s(p, g, kk); });
  route(rt, air, '#5ce6ff', pa, t, 8, 0); route(rt, bone, '#ff5a4d', pb, t, 8, .5);
  var cs = e2s(earPt('coch', fi), g, kk), glow = pb * (1 + .08 * Math.sin(t * 5));
  if (pb > .6) for (var i = 0; i < 3; i++) { var ph = (t * .6 + i / 3) % 1; el('circle', { cx: cs[0], cy: cs[1], r: 30 + ph * 90 * kk * 1.2, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 5 - 3 * ph, opacity: (1 - ph) * .85, filter: 'url(#glowo)' }, rt); }
  el('circle', { cx: cs[0], cy: cs[1], r: 16 * glow, fill: '#ff5a4d', filter: 'url(#glowo)', opacity: pb }, rt);
  var at = $('airtag2'), bt = $('bonetag2'); at.style.left = '150px'; at.style.top = '1190px'; at.style.opacity = pa; bt.style.left = '150px'; bt.style.top = '1226px'; bt.style.opacity = pb;
  $('chips2').style.opacity = e3(seg(t, sa(1) + .3, sa(1) + .6));
}
function crowdIcon(g, x, y, lit) { var c = lit ? '#5ce6ff' : 'rgba(236,241,248,.35)'; el('circle', { cx: x, cy: y - 22, r: 15, fill: c, filter: lit ? 'url(#glowc)' : '' }, g); el('path', { d: 'M' + (x - 26) + ' ' + (y + 22) + 'a26 26 0 0 1 52 0z', fill: c, filter: lit ? 'url(#glowc)' : '' }, g); }
function r3(t) {
  var g = vpg(t), fi = earFi(t), kk = placeVp(3, g, fi, 1); var rt = $('rt3'); wipe(rt); var cr = $('crowd'); wipe(cr);
  wordsIn($('h3'), t, sa(2) + .15, .09);
  var air = earPts('air', fi).map(function (p) { return e2s(p, g, kk); }), bone = earPts('bone', fi).map(function (p) { return e2s(p, g, kk); });
  route(rt, air, '#5ce6ff', 1, t, 8, 0); route(rt, bone, '#ff5a4d', 1, t, 8, .5);
  var cs = e2s(earPt('coch', fi), g, kk), pul = 1 + .1 * Math.sin(t * 5), gl = seg(t, wt(3, 4) - .2, wt(3, 6) + .3);
  for (var i = 0; i < 3; i++) { var ph = (t * .6 + i / 3) % 1; el('circle', { cx: cs[0], cy: cs[1], r: 30 + ph * 70 * kk * 1.2, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 5 - 3 * ph, opacity: (1 - ph) * (.5 + .45 * gl), filter: 'url(#glowo)' }, rt); }
  el('circle', { cx: cs[0], cy: cs[1], r: (16 + 8 * gl) * pul, fill: '#ff5a4d', filter: 'url(#glowo)' }, rt);
  var a0 = air[0], row = 1168, xs = [236, 366, 496, 624, 752, 862], t0 = wt(3, 0) - .1;
  xs.forEach(function (x, i) { var k = e3(seg(t, t0 + i * .1, t0 + i * .1 + .5)); crowdIcon(cr, x, row, k > .6); el('path', { d: 'M' + a0[0] + ' ' + a0[1] + 'Q' + (a0[0] - 20) + ' ' + ((a0[1] + row) / 2) + ' ' + x + ' ' + (row - 52), fill: 'none', stroke: '#5ce6ff', 'stroke-width': 3, 'stroke-dasharray': '6 10', 'stroke-dashoffset': -t * 40, opacity: .6 * k }, cr); });
  var ct = $('crowdtag'); ct.style.left = '150px'; ct.style.top = '1090px'; ct.style.opacity = e3(seg(t, t0 + .3, t0 + .7)); $('chips3').style.opacity = 1;
}
function r4(t) {
  var c = cam4(t), m = scr(AN.head.mouth, c), ear = scr(AN.head.ear, c), mic = [668, 1120], d = drift(t);
  wordsIn($('h4'), t, sa(3) + .15, .09);
  var p4 = $('phone4'); put(p4, e3(seg(t, sa(3) + .1, sa(3) + .6)), d[0] * 1.2, d[1] * 1.2, .8); animBars(pb4, t, 22 * seg(t, wt(4, 5) - .1, wt(4, 5) + .9), seg(t, wt(4, 5) - .1, wt(4, 5) + .5) * .9 + .1);
  var wv = $('waves4'); wipe(wv);
  for (var i = 0; i < 4; i++) { var ph = (t * .9 + i / 4) % 1, x = lerp(m[0], mic[0], ph), y = lerp(m[1], mic[1], ph); el('circle', { cx: x, cy: y, r: 7 + 7 * ph, fill: '#5ce6ff', opacity: (1 - ph * .5) * (.4 + .6 * seg(t, sa(3) + .5, sa(3) + 1.0)), filter: 'url(#glowc)' }, wv); }
  el('path', { d: 'M' + m[0] + ' ' + m[1] + 'Q' + ((m[0] + mic[0]) / 2 + 20) + ' ' + ((m[1] + mic[1]) / 2 - 40) + ' ' + mic[0] + ' ' + mic[1], fill: 'none', stroke: '#5ce6ff', 'stroke-width': 5, opacity: .55, filter: 'url(#glowc)' }, wv);
  var sn = $('snap4'); wipe(sn); var go = e3(seg(t, wt(4, 1) - .1, wt(4, 2) - .05)), snapT = wt(4, 2) + .05, back_ = e3(seg(t, snapT, snapT + .3));
  var tip = [lerp(ear[0], 600, go * (1 - back_)), lerp(ear[1], 1120, go * (1 - back_))];
  if (go > 0) el('path', { d: 'M' + ear[0] + ' ' + ear[1] + 'Q' + ((ear[0] + tip[0]) / 2) + ' ' + ((ear[1] + tip[1]) / 2 + 60) + ' ' + tip[0] + ' ' + tip[1], fill: 'none', stroke: '#ff5a4d', 'stroke-width': 8, 'stroke-linecap': 'round', filter: 'url(#glowc)', opacity: 1 - back_ * .9 }, sn);
  var sp = seg(t, snapT, snapT + .45); if (sp > 0 && sp < 1) for (var k = 0; k < 10; k++) { var a = k / 10 * Math.PI * 2, r = 20 + sp * 110; el('line', { x1: 600 + Math.cos(a) * r * .5, y1: 1120 + Math.sin(a) * r * .5, x2: 600 + Math.cos(a) * r, y2: 1120 + Math.sin(a) * r, stroke: k % 2 ? '#ffbd3a' : '#ff5a4d', 'stroke-width': 5 * (1 - sp), 'stroke-linecap': 'round' }, sn); }
  var st = $('snaptag'); st.style.left = '150px'; st.style.top = '1190px'; st.style.opacity = e3(seg(t, snapT + .1, snapT + .4)); $('chips4').style.opacity = 1;
  if (!r4.f) { r4.f = 1; ev(snapT, 'snap'); }
}
function r5(t) {
  if (!r5.f) { r5.f = 1; ev(sa(4), 'guess'); }
  var u = t - sa(4), d = L(5).a - sa(4);
  wordsIn($('h5'), t, sa(4) + .1, .1);
  var a = back(seg(t, sa(4) + .15, sa(4) + .6)), b = back(seg(t, sa(4) + .3, sa(4) + .75)), tick = Math.floor(t * 3) % 2;
  var U = $('acU'), D = $('acD'); U.style.transform = 'translateX(' + ((1 - a) * -900) + 'px)'; D.style.transform = 'translateX(' + ((1 - b) * 900) + 'px)';
  U.style.boxShadow = tick ? '0 0 50px rgba(92,230,255,.45)' : 'none'; D.style.boxShadow = !tick ? '0 0 50px rgba(255,90,77,.45)' : 'none';
  var g = $('guess5'); wipe(g); var cx = 540, cy = 842, p = clamp(u / d, 0, 1);
  el('circle', { cx: cx, cy: cy, r: 70, fill: '#070d1a', stroke: 'rgba(236,241,248,.3)', 'stroke-width': 3 }, g);
  el('circle', { cx: cx, cy: cy, r: 70, fill: 'none', stroke: '#ffbd3a', 'stroke-width': 9, 'stroke-dasharray': 2 * Math.PI * 70, 'stroke-dashoffset': 2 * Math.PI * 70 * p, transform: 'rotate(-90 ' + cx + ' ' + cy + ')', 'stroke-linecap': 'round', filter: 'url(#glowc)' }, g);
  var q = el('text', { x: cx, y: cy + 26, 'text-anchor': 'middle', 'font-family': 'Fam', 'font-size': 84, 'font-weight': 700, fill: '#ecf1f8' }, g); q.textContent = '?';
  $('chips5').style.opacity = e3(seg(t, sa(4) + .3, sa(4) + .6));
}
var poll = $('poll'), pg = el('g', {}, poll), pdyn = el('g', {}, poll);
(function () { var hat = el('pattern', { id: 'hat', width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, poll.firstChild); el('path', { d: 'M0 0v14', stroke: '#5ce6ff', 'stroke-width': 3, opacity: .55 }, hat); })();
var axis = el('g', {}, pg); el('path', { d: 'M214 640V1196', stroke: '#5ce6ff', 'stroke-width': 3 }, axis);
for (var q = 0; q < 19; q++) el('path', { d: 'M214 ' + (640 + q * 31) + 'h' + (q % 3 === 0 ? 24 : 12), stroke: '#5ce6ff', 'stroke-width': 2, opacity: q % 3 === 0 ? 1 : .55 }, axis);
var axt = el('text', { x: 236, y: 634, fill: '#5ce6ff', 'font-family': 'Frag', 'font-size': 16, 'letter-spacing': '1.5' }, axis); axt.textContent = 'PITCH';
el('path', { d: 'M240 940H890', stroke: '#ecf1f8', 'stroke-width': 2, 'stroke-dasharray': '6 8', opacity: .6 }, pg);
var barA = el('rect', { x: 300, y: 740, width: 200, height: 200, fill: 'url(#hat)', stroke: '#5ce6ff', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, pg);
var arrA = el('path', { d: 'M400 900v-110m-32 32 32-36 32 36', stroke: '#5ce6ff', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pg);
var barB = el('rect', { x: 570, y: 940, width: 200, height: 270, fill: '#ff5a4d', filter: 'url(#glowo)' }, pg);
var arrB = el('path', { d: 'M670 990v170m-36-36 36 38 36-38', stroke: '#070d1a', 'stroke-width': 11, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pg);
function r6(t) {
  var s0 = sa(5); wordsIn($('h6'), t, s0 + .2, .1); while (pdyn.firstChild) pdyn.removeChild(pdyn.firstChild);
  for (var rr = 0; rr < 3; rr++) { var rp = (t * .7 + rr / 3) % 1; el('circle', { cx: 357, cy: 1073, r: 96 + rp * 70, fill: 'none', stroke: '#5ce6ff', 'stroke-width': 4 * (1 - rp), opacity: (1 - rp) * .8 * seg(t, s0 + .8, s0 + 1.2) }, pdyn); }
  var gh = el('rect', { x: 570, y: 940, width: 200, height: Math.max(.01, 270 * .45 * eio(seg(t, wt(6, 2), wt(6, 6) - .35))), fill: 'none', stroke: '#ff5a4d', 'stroke-width': 4, 'stroke-dasharray': '10 8', opacity: .8 * (1 - seg(t, wt(6, 6) - .45, wt(6, 6) - .3)) }, pdyn);
  var sy = 600 + ((t * .75) % 1) * 600, sg = el('linearGradient', { id: 'scg', x1: 0, y1: 0, x2: 0, y2: 1 }, pdyn); el('stop', { offset: 0, 'stop-color': '#5ce6ff', 'stop-opacity': 0 }, sg); el('stop', { offset: .5, 'stop-color': '#5ce6ff', 'stop-opacity': .5 }, sg); el('stop', { offset: 1, 'stop-color': '#5ce6ff', 'stop-opacity': 0 }, sg);
  el('rect', { x: 160, y: sy, width: 748, height: 70, fill: 'url(#scg)', opacity: seg(t, s0 + .6, s0 + 1.0) * .9 }, pdyn);
  var bob = Math.sin(t * 5) * 6; arrA.setAttribute('transform', 'translate(0 ' + bob + ')');
  put($('panel'), e3(seg(t, s0 + .1, s0 + .6)), 0, 0, .94); poll.style.opacity = e3(seg(t, s0 + .15, s0 + .55));
  var tA = wt(5, 5) - .2, tB = wt(6, 6) - .35, a = back(seg(t, tA, tA + .6)), hA = 200 * a;
  barA.setAttribute('y', 940 - hA); barA.setAttribute('height', Math.max(.01, hA)); arrA.style.opacity = seg(t, tA + .4, tA + .7);
  $('labA').style.opacity = e3(seg(t, tA, tA + .45)); $('labA').style.transform = 'translateY(' + ((1 - e3(seg(t, tA, tA + .45))) * 18) + 'px)';
  var b = back(seg(t, tB, tB + .7)); barB.setAttribute('height', Math.max(.01, 270 * b)); arrB.style.opacity = seg(t, tB + .45, tB + .75);
  var tL = wt(6, 1) - .1; $('labB').style.opacity = e3(seg(t, tL, tL + .5)); $('labB').style.transform = 'translateY(' + ((1 - e3(seg(t, tL, tL + .5))) * 18) + 'px)';
  var tS = tB + .75, st = back(seg(t, tS, tS + .45)), am = $('amber'); am.style.opacity = clamp(seg(t, tS, tS + .15) * 3, 0, 1); am.style.transform = 'scale(' + lerp(2.3, 1, st) + ') rotate(' + ((1 - st) * -8) + 'deg)';
  var shake = t > tS + .35 ? Math.max(0, 1 - seg(t, tS + .35, tS + .6)) : 0; $('s6')._sh = [Math.sin(t * 90) * 7 * shake, Math.cos(t * 77) * 7 * shake];
  rpath6.setAttribute('stroke-dasharray', rlen6); rpath6.setAttribute('stroke-dashoffset', rlen6 * (1 - eio(seg(t, tS + .5, tS + 1.0)))); $('rough6').style.opacity = seg(t, tS + .5, tS + .6);
  var th = $('thumb'); th.style.opacity = e3(seg(t, s0 + .5, s0 + 1.0)); $('thumbl').style.opacity = th.style.opacity;
  $('chips6').style.opacity = clamp(seg(t, tS, tS + .2) * 3, 0, 1); $('t3').style.transform = 'scale(' + (1 + .12 * Math.sin(t * 6)) + ')';
  if (!r6.f) { r6.f = 1; ev(wt(6, 1), 'tag'); ev(tA, 'bar1'); ev(tB, 'bar2'); ev(tS, 'stamp'); }
}
function r8(t) {
  var s0 = sa(6); wordsIn($('h8'), t, s0 + .15, .09);
  var pc = $('peep8'); put(pc, e3(seg(t, s0 + .1, s0 + .6)), Math.sin(t * 1.3) * 4, 0, .9);
  var tb = wt(7, 0) + .45, bk = e3(seg(t, tb, tb + .5)), bub = $('bub8'); bub.style.opacity = clamp(bk * 3, 0, 1); bub.style.transform = 'translate(' + ((1 - bk) * -500 + (t > wt(7, 6) ? Math.sin(t * 11) * 3 : 0)) + 'px,0)';
  animBars(pb8, t, 16 * ((t * .35) % 1), .8);
  var tx = wt(7, 6) - .1; rxp.forEach(function (e, i) { var p = eio(seg(t, tx + i * .18, tx + i * .18 + .3)); e.setAttribute('stroke-dashoffset', e._l * (1 - p)); }); $('rough8').style.opacity = seg(t, tx, tx + .05);
  $('seen8').style.opacity = e3(seg(t, tx + .35, tx + .7));
  var ts = wt(7, 0) + .05, sk = back(seg(t, ts, ts + .4)), sc = $('sendchip'); put(sc, sk, 0, 0, .7); sc.style.transform += ' scale(' + (1 + .06 * Math.sin(t * 8)) + ')'; $('chips8').style.opacity = 1;
  if (!r8.f) { r8.f = 1; ev(ts, 'send'); ev(tx, 'xmark'); }
}
function r9(t) {
  var c2 = cam9(t), sk2 = scr(AN.head.skull, c2), ear2 = scr(AN.head.ear, c2), R2 = 232 * c2.z / 1.3 * (1 + .25 * eio(seg(t, L(9).a - .1, L(9).b)));
  var s9 = sa(7), tp = wt(8, 1) - .05, pk = back(seg(t, tp, tp + .5)), swell = seg(t, tp, L(9).b), sw2 = seg(t, L(9).a, L(9).b + .3);
  wordsIn($('h9'), t, s9 + .15, .1); wordsOut($('h9'), t, L(8).b + .2); var h11 = $('h11'); h11.style.opacity = seg(t, L(9).a - .15, L(9).a); wordsIn(h11, t, L(9).a - .1, .13);
  var L9 = $('lens9'); L9.style.clipPath = 'circle(' + R2 + 'px at ' + sk2[0] + 'px ' + sk2[1] + 'px)'; L9.style.background = 'rgba(3,8,18,.84)';
  var s = c2.z * (W / IW) * AN.xray.k, xi = $('xr9'); xi.style.mixBlendMode = 'screen'; xi.style.filter = 'brightness(1.25) contrast(1.15)';
  xi.style.transform = 'translate(' + (ear2[0] - AN.xray.ear[0] * s + AN.xray.dx * c2.z) + 'px,' + (ear2[1] - AN.xray.ear[1] * s + AN.xray.dy * c2.z) + 'px) scale(' + s + ')';
  var l = $('lsvg9'); wipe(l); var pc = scr(AN.head.coral, c2), z1 = c2.z / 1.3;
  var gd = el('radialGradient', { id: 'cg9' }, l.firstChild); el('stop', { offset: 0, 'stop-color': '#ff5a4d', 'stop-opacity': .7 }, gd); el('stop', { offset: 1, 'stop-color': '#ff5a4d', 'stop-opacity': 0 }, gd);
  el('circle', { cx: pc[0], cy: pc[1], r: (190 + 120 * sw2) * z1, fill: 'url(#cg9)', opacity: .5 + .45 * swell }, l);
  for (var k = 0; k < 4; k++) { var ph = (t * .38 + k / 4) % 1, rr = (30 + ph * (130 + 120 * swell + 110 * sw2)) * z1; el('circle', { cx: pc[0], cy: pc[1], r: rr, fill: 'none', stroke: '#ff5a4d', 'stroke-width': (7 - 5 * ph) * (1 + swell * .6), opacity: (1 - ph) * (.5 + .5 * swell), filter: 'url(#glowo)' }, l); }
  var burst = seg(t, wt(9, 3), wt(9, 3) + .7); if (burst > 0 && burst < 1) el('circle', { cx: pc[0], cy: pc[1], r: 60 + burst * 520, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 10 * (1 - burst), opacity: 1 - burst, filter: 'url(#glowo)' }, l);
  el('circle', { cx: pc[0], cy: pc[1], r: (16 + 8 * swell + 8 * sw2) * z1, fill: '#ff5a4d', filter: 'url(#glowo)' }, l);
  el('rect', { x: ear2[0] - 38 * pk, y: ear2[1] - 22 * pk, width: 76 * pk, height: 44 * pk, rx: 20, fill: '#bfff45', filter: 'url(#glowo)' }, l);
  lensRim($('lrim9'), sk2[0], sk2[1], R2, t, 'X-RAY');
  var hL = $('hand9'), hk = e3(seg(t, s9 + .5, s9 + 1.1)); hL.style.left = (ear2[0] - 128) + 'px'; hL.style.top = (ear2[1] - 50 + (1 - hk) * 160) + 'px'; hL.style.opacity = hk; hL.style.transform = 'rotate(' + (22 - 6 * Math.sin(t * 2)) + 'deg)';
  var at = $('airtag9'); at.style.left = '700px'; at.style.top = (sk2[1] + 30) + 'px'; at.style.opacity = seg(t, tp + .5, tp + .9);
  var tr = $('tryit'); put(tr, back(seg(t, s9 + .7, s9 + 1.2)), 0, 0, .8); var mu = $('muf'); put(mu, back(seg(t, wt(8, 6) - .1, wt(8, 6) + .4)), 0, 0, .8);
  var hp = $('hp'); put(hp, back(seg(t, L(8).b + .2, L(8).b + .7)), 0, 0, .8); $('chips9b').style.top = '1196px';
  var bl = 3.4 * eio(seg(t, L(8).b - .1, L(8).b + .9)); $('gl').style.filter = 'blur(' + bl.toFixed(2) + 'px) saturate(' + (1 - .25 * eio(seg(t, L(8).b, L(8).b + .9))) + ')';
  if (!r9.f) { r9.f = 1; ev(tp, 'plug'); ev(L(8).b + .05, 'muffle'); ev(L(9).a, 'swell'); ev(wt(9, 3), 'ring'); }
}
function r12(t) {
  var s0 = sa(8); wordsIn({ querySelectorAll: function () { return [$('e1'), $('e2')]; } }, t, s0 + .1, .22);
  var nk = e3(seg(t, s0 + .5, s0 + 1.0)); put($('next12'), nk, 0, 0, .9); var cn = clamp(seg(t, s0 + .7, s0 + 1.4), 0, 1); $('n4m').textContent = (Math.round(4 * cn)) + ' million';
  var fk = back(seg(t, s0 + 1.0, s0 + 1.5)), press = seg(t, s0 + 1.9, s0 + 2.05) * (1 - seg(t, s0 + 2.05, s0 + 2.25)); var f = $('fol12'); f.style.opacity = clamp(fk * 3, 0, 1); f.style.transform = 'scale(' + (lerp(.6, 1, fk) - .06 * press) + ')';
  var e = $('endsvg'); wipe(e); var cx = 800, cy = 1280;
  for (var i = 0; i < 3; i++) { var ph = (t * .9 + i / 3) % 1; el('circle', { cx: cx, cy: cy, r: 24 + ph * 110, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 6 - 4 * ph, opacity: (1 - ph) * seg(t, s0 + 1.0, s0 + 1.4), filter: 'url(#glowo)' }, e); }
  el('circle', { cx: cx, cy: cy, r: 22, fill: '#ff5a4d', filter: 'url(#glowo)', opacity: seg(t, s0 + 1.0, s0 + 1.4) }, e);
  var rs = seg(t, s0 + 1.95, s0 + 2.6); if (rs > 0 && rs < 1) el('circle', { cx: 330, cy: 1215, r: 40 + rs * 220, fill: 'none', stroke: '#bfff45', 'stroke-width': 8 * (1 - rs), opacity: 1 - rs }, e);
  var tk = $('tick12'); tk.style.opacity = e3(seg(t, s0 + .9, s0 + 1.3)); $('tickin').style.transform = 'translateX(' + (-(t * 120) % 1400) + 'px)';
  if (!r12.f) { r12.f = 1; ev(s0 + 1.0, 'follow'); ev(s0 + 1.95, 'press'); }
}
var R = [r1, r2, r3, r4, r5, r6, r8, r9, r12];

function seekDom(t) {
  var si = sceneAt(t), loop = t > DUR - .45; chrome(t, si);
  for (var i = 0; i < SCN.length; i++) {
    var e = $(SCN[i]), f = fx(i, t);
    if (loop) { if (i === 0) f = { tr: 'none', op: e3(seg(t, DUR - .25, DUR)), bl: 0 }; else if (i === SCN.length - 1 && f) f = { tr: f.tr, op: f.op * (1 - seg(t, DUR - .45, DUR - .22)), bl: 0 }; else f = null; }
    if (!f) { e.style.display = 'none'; continue; }
    e.style.display = 'block'; e._sh = null; R[i](t);
    var sh2 = e._sh ? ' translate(' + e._sh[0] + 'px,' + e._sh[1] + 'px)' : '';
    e.style.opacity = f.op; e.style.transform = (f.tr === 'none' ? '' : f.tr) + sh2; e.style.filter = f.bl > .3 ? 'blur(' + f.bl.toFixed(1) + 'px)' : 'none';
  }
  if (si !== 7 && !loop) $('gl').style.filter = 'none';
  var fl = 0; BD.forEach(function (b, i) { if (TK[i] === 'dive') fl = Math.max(fl, Math.max(0, 1 - Math.abs(t - (b - .05)) / .11) * .42); else if (TK[i] === 'whip' || TK[i] === 'tilt') fl = Math.max(fl, Math.max(0, 1 - Math.abs(t - b) / .16) * .2); });
  $('flash').style.opacity = fl; $('scrim').style.opacity = (si === 0 || si === 3 || si === 6 || si === 7) ? 1 : .35;
}

var vids = { dust: $('dust'), grain: $('grain') };
function vseek(v, t) { return new Promise(function (res) { if (!v.duration) return res(); var tt = (t % v.duration); function done() { v.removeEventListener('seeked', done); res(); } v.addEventListener('seeked', done); v.currentTime = tt; setTimeout(res, 400); }); }
window.__seek = function (t) { t = clamp(t, 0, DUR - 1e-3); seekGL(t); seekDom(t); return Promise.all([vseek(vids.dust, t), vseek(vids.grain, t)]); };
var imgs = [].slice.call(document.querySelectorAll('.ef2,.ef3')).concat([$('xr1'), $('xr9')]);
Promise.all([document.fonts.load('700 100px Fam'), document.fonts.load('600 20px Fam'), document.fonts.load('400 20px Frag'), document.fonts.load('700 40px InterX'), document.fonts.load('600 20px InterX'), window.GLP.load(['head_a', 'xray_skull'])].concat(imgs.map(function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve(); }))).then(function () {
  return new Promise(function (r) { var n = 0; ['dust', 'grain'].forEach(function (k) { var v = vids[k]; if (v.readyState >= 2) { if (++n === 2) r(); } else v.addEventListener('loadeddata', function () { if (++n === 2) r(); }); }); });
}).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
})();
