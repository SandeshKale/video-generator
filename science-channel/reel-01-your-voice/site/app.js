// Reel #01 preview: 3 scenes, camera moves + transitions. Everything is a pure function of t (window.__seek).
(function () {
'use strict';
var W = 1080, H = 1920, IW = 576, IH = 1024, NS = 'http://www.w3.org/2000/svg';
var $ = function (id) { return document.getElementById(id); };
window.__reelDurationSec = 15.0; window.__ready = false;
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function e3(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function back(x) { x = clamp(x, 0, 1); var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
function lerp(a, b, k) { return a + (b - a) * k; }
function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
var AN = window.AN;

// ---- camera on the photo plate. cam = {z, cx, cy} (zoom about image point cx,cy). Same maths drives the WebGL shader and the DOM anchors.
function sh(cam) { return [(cam.cx / IW - .5) * (1 - 1 / cam.z), ((1 - cam.cy / IH) - .5) * (1 - 1 / cam.z)]; }
function scr(a, cam) { var s = sh(cam), px = a[0] / IW, py = 1 - a[1] / IH; var u = (px - .5 - s[0]) * cam.z + .5, v = (py - .5 - s[1]) * cam.z + .5; return [u * W, (1 - v) * H]; }
function lensImg(t) { var k = 1 - seg(t, 3.6, 4.2); var s = AN.head.skull; return [s[0] + Math.sin(t * .8) * 46 * k, s[1] + Math.cos(t * .55) * 40 * k]; }
function cam0(t) { var push = eio(seg(t, 4.2, 5.0)); var lc = lensImg(Math.min(t, 4.2)); var z0 = 1 + .06 * eio(seg(t, 0, 4.2));
  return { z: z0 + 1.35 * push, cx: lerp(IW / 2 + Math.sin(t * .4) * 12, lc[0], push), cy: lerp(IH / 2, lc[1], push) }; }
function cam2(t) { var u = seg(t, 9.5, 15); return { z: 1.3 + .07 * e3(u), cx: 60 + 14 * u, cy: 225 + 10 * Math.sin(t * .4) }; }
var drift = function (t) { return [Math.sin(t * .45) * 9, Math.cos(t * .37) * 6]; };

// ---- static builds
var S = { s0: $('s0'), s1: $('s1'), s2: $('s2') };
(function bars() { var b = $('pbars'); for (var i = 0; i < 16; i++) b.appendChild(document.createElement('i')); })();
var pb = $('pbars').children;
function lensRim(svg, cx, cy, R, t, label) {
  svg.textContent = '';
  el('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: '#5ce6ff', 'stroke-width': 4, filter: 'url(#glowc)' }, svg);
  var d = el('circle', { cx: cx, cy: cy, r: R + 14, fill: 'none', stroke: '#5ce6ff', 'stroke-width': 9, 'stroke-dasharray': '2 14', opacity: .65 }, svg); d.setAttribute('transform', 'rotate(' + (t * 14) + ' ' + cx + ' ' + cy + ')');
  [0, 90, 180, 270].forEach(function (a) { var r = a * Math.PI / 180; el('path', { d: 'M' + (cx + Math.cos(r) * (R - 22)) + ' ' + (cy + Math.sin(r) * (R - 22)) + 'L' + (cx + Math.cos(r) * (R + 2)) + ' ' + (cy + Math.sin(r) * (R + 2)), stroke: '#5ce6ff', 'stroke-width': 4 }, svg); });
  if (label) { var tx = el('text', { x: cx + R * .72, y: cy - R * .72 - 14, fill: '#5ce6ff', 'font-family': 'Frag', 'font-size': 18, 'letter-spacing': '2' }, svg); tx.textContent = label; }
}
function defs(svg) { var d = el('defs', {}, svg); var f = el('filter', { id: 'glowc', x: '-30%', y: '-30%', width: '160%', height: '160%' }, d); el('feGaussianBlur', { stdDeviation: 5, result: 'b' }, f); var m = el('feMerge', {}, f); el('feMergeNode', { in: 'b' }, m); el('feMergeNode', { in: 'SourceGraphic' }, m);
  var g = el('filter', { id: 'glowo', x: '-40%', y: '-40%', width: '180%', height: '180%' }, d); el('feGaussianBlur', { stdDeviation: 6, result: 'b' }, g); var m2 = el('feMerge', {}, g); el('feMergeNode', { in: 'b' }, m2); el('feMergeNode', { in: 'SourceGraphic' }, m2); }
['lensrim0', 'waves0', 'lenssvg0', 'lenssvg2', 'lensrim2', 'poll', 'rough1'].forEach(function (id) { defs($(id)); });

// poll chart (static frame, bars animated)
var poll = $('poll'), pg = el('g', {}, poll);
var hat = el('pattern', { id: 'hat', width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, poll.firstChild); el('path', { d: 'M0 0v14', stroke: '#5ce6ff', 'stroke-width': 3, opacity: .55 }, hat);
var axis = el('g', {}, pg); el('path', { d: 'M214 640V1196', stroke: '#5ce6ff', 'stroke-width': 3 }, axis);
for (var i = 0; i < 19; i++) el('path', { d: 'M214 ' + (640 + i * 31) + 'h' + (i % 3 === 0 ? 24 : 12), stroke: '#5ce6ff', 'stroke-width': 2, opacity: i % 3 === 0 ? 1 : .55 }, axis);
var axt = el('text', { x: 236, y: 634, fill: '#5ce6ff', 'font-family': 'Frag', 'font-size': 16, 'letter-spacing': '1.5' }, axis); axt.textContent = 'PITCH';
el('path', { d: 'M240 940H890', stroke: '#ecf1f8', 'stroke-width': 2, 'stroke-dasharray': '6 8', opacity: .6 }, pg);
var barA = el('rect', { x: 300, y: 740, width: 200, height: 200, fill: 'url(#hat)', stroke: '#5ce6ff', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, pg);
var arrA = el('path', { d: 'M400 900v-110m-32 32 32-36 32 36', stroke: '#5ce6ff', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pg);
var barB = el('rect', { x: 570, y: 940, width: 200, height: 270, fill: '#ff5a4d', filter: 'url(#glowo)' }, pg);
var arrB = el('path', { d: 'M670 990v170m-36-36 36 38 36-38', stroke: '#070d1a', 'stroke-width': 11, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pg);
var guess = el('text', { x: 560, y: 905, fill: '#ecf1f8', 'font-family': 'Fam', 'font-size': 64, 'font-weight': 700, 'text-anchor': 'middle', opacity: 0 }, pg); guess.textContent = '?';
// rough circle around the study label
var gen = rough.generator(), rd = gen.toPaths(gen.ellipse(760, 714, 316, 170, { seed: 7, roughness: 1.8 }));
var rpath = el('path', { d: rd[0].d, fill: 'none', stroke: '#ff5a4d', 'stroke-width': 4, 'stroke-linecap': 'round' }, $('rough1')); var rlen = rpath.getTotalLength(); rpath.setAttribute('stroke-dasharray', rlen);

function pop(e, k, o) { o = o || {}; e.style.opacity = k > 0 ? '1' : '0'; e.style.transform = 'translate(' + (o.x || 0) + 'px,' + (o.y || 0) + 'px) scale(' + (o.s0 == null ? .6 : o.s0) + ' + 0)'.replace(' + 0', ''); }
function put(e, k, x, y, s0) { var s = lerp(s0 == null ? .7 : s0, 1, k); e.style.opacity = clamp(k * 3, 0, 1); e.style.transform = 'translate(' + (x || 0) + 'px,' + (y || 0) + 'px) scale(' + s + ')'; }
function wordsIn(h, t, t0, st) { var ws = h.querySelectorAll('.w'); for (var i = 0; i < ws.length; i++) { var k = back(seg(t, t0 + i * st, t0 + i * st + .45)), o = seg(t, t0 + i * st, t0 + i * st + .18); ws[i].style.opacity = o; ws[i].style.transform = 'translateY(' + ((1 - k) * 60) + 'px) rotate(' + ((1 - k) * 5) + 'deg)'; } }
function vis(e, on) { e.style.display = on ? 'block' : 'none'; }

var vids = { dust: $('dust'), grain: $('grain') };
function vseek(v, t) { return new Promise(function (res) { if (!v.duration) return res(); var tt = (t % v.duration); function done() { v.removeEventListener('seeked', done); res(); } v.addEventListener('seeked', done); v.currentTime = tt; setTimeout(res, 400); }); }

function seekDom(t) {
  var d = drift(t);
  // ---------- S0
  var in0 = t < 5.3; vis(S.s0, in0);
  if (in0) {
    var c = cam0(t), lc = lensImg(t), lcs = scr(lc, c), push = eio(seg(t, 4.5, 5.0)), R = 200 * c.z + 1100 * push;
    S.s0.style.opacity = 1 - seg(t, 4.75, 5.15); var ex = AN.head.skull;
    // lens content (x-ray) clipped to the lens circle; the xray image is registered to the head
    var L = $('lens0'); L.style.clipPath = 'circle(' + R + 'px at ' + lcs[0] + 'px ' + lcs[1] + 'px)'; L.style.background = 'rgba(3,8,18,.86)';
    var sk = scr(AN.head.ear, c), s = c.z * (W / IW) * AN.xray.k, xi = $('xr0'); xi.style.mixBlendMode = 'screen'; xi.style.filter = 'brightness(1.25) contrast(1.15) saturate(1.1)';
    xi.style.transform = 'translate(' + (sk[0] - AN.xray.ear[0] * s + AN.xray.dx * c.z) + 'px,' + (sk[1] - AN.xray.ear[1] * s + AN.xray.dy * c.z) + 'px) scale(' + s + ')';
    var ls = $('lenssvg0'); ls.textContent = ''; defs(ls);
    var pc = scr(AN.head.coral, c), pul = 1 + .07 * Math.sin(t * 5.2);
    [[44, 8, 1], [76, 3, .55], [106, 2, .3]].forEach(function (r) { el('circle', { cx: pc[0], cy: pc[1], r: r[0] * c.z * pul, fill: 'none', stroke: '#ff5a4d', 'stroke-width': r[1] * c.z, opacity: r[2], filter: 'url(#glowo)' }, ls); });
    el('circle', { cx: pc[0], cy: pc[1], r: 18 * c.z * pul, fill: '#ff5a4d', filter: 'url(#glowo)' }, ls);
    lensRim($('lensrim0'), lcs[0], lcs[1], R, t, push < .1 ? 'X-RAY' : ''); $('lensrim0').style.opacity = 1 - push * .8;
    // sound arcs from the mouth toward the phone
    var wv = $('waves0'); wv.textContent = ''; defs(wv); var m = scr(AN.head.mouth, c);
    for (var i = 0; i < 3; i++) { var ph = (t * .85 + i / 3) % 1, r = 36 + ph * 210, a0 = -8 * Math.PI / 180, a1 = 64 * Math.PI / 180;
      el('path', { d: 'M' + (m[0] + r * Math.cos(a0)) + ' ' + (m[1] + r * Math.sin(a0)) + 'A' + r + ' ' + r + ' 0 0 1 ' + (m[0] + r * Math.cos(a1)) + ' ' + (m[1] + r * Math.sin(a1)), fill: 'none', stroke: '#5ce6ff', 'stroke-width': 7 - 4 * ph, 'stroke-linecap': 'round', opacity: (1 - ph) * .95 * (1 - push), filter: 'url(#glowc)' }, wv); }
    var tg = $('bonetag'); tg.style.left = (lcs[0] - R * .9) + 'px'; tg.style.top = (lcs[1] + R + 12) + 'px'; tg.style.opacity = (1 - push) * seg(t, .3, .6); tg.style.display = R > 600 ? 'none' : 'block';
    var ph0 = $('phone'); put(ph0, e3(seg(t, .2, .7)), d[0] * 1.6, d[1] * 1.6, .85); ph0.style.opacity = (1 - push) * clamp(seg(t, .2, .5) * 3, 0, 1);
    for (var j = 0; j < 16; j++) { var h = 10 + Math.abs(Math.sin(j * 1.7 + t * 6) * 22 + Math.sin(j * .6 + t * 3) * 9); pb[j].style.height = h.toFixed(1) + 'px'; pb[j].style.opacity = j < ((t * 2.2) % 16) ? 1 : .42; }
    var pcard = $('peepc'); put(pcard, back(seg(t, .9, 1.4)), d[0] * 1.2, d[1] * 1.2, .5); pcard.style.opacity = (1 - push) * clamp(seg(t, .9, 1.1) * 3, 0, 1);
    var ug = $('ugh'); put(ug, back(seg(t, 1.25, 1.6)), 0, Math.sin(t * 7) * 2, .4); ug.style.opacity = (1 - push) * clamp(seg(t, 1.25, 1.4) * 3, 0, 1);
    var ch = $('chips0'); put(ch, e3(seg(t, .4, .8)), 0, 0, .9); ch.style.opacity = (1 - push) * clamp(seg(t, .4, .6) * 3, 0, 1);
    $('cap0').style.opacity = 1 - push; $('h0').style.opacity = 1 - seg(t, 4.3, 4.8); $('h0').style.transform = 'translate(' + (-d[0] * .3) + 'px,' + (-d[1] * .3) + 'px)';
  }
  // ---------- S1
  var in1 = t > 4.7 && t < 10.1; vis(S.s1, in1);
  if (in1) {
    var u = e3(seg(t, 4.8, 5.7)), exit = eio(seg(t, 9.3, 9.95));
    S.s1.style.opacity = seg(t, 4.85, 5.25) * (1 - seg(t, 9.8, 10.05));
    S.s1.style.transformOrigin = '540px 860px';
    S.s1.style.transform = 'translateX(' + (-exit * 1400) + 'px) scale(' + (1.7 - .7 * u) + ')'; S.s1.style.filter = 'blur(' + ((1 - u) * 14 + exit * 26).toFixed(1) + 'px)';
    wordsIn($('h1'), t, 5.4, .12);
    put($('panel'), e3(seg(t, 5.4, 6.0)), 0, 0, .94);
    var ax = e3(seg(t, 5.5, 6.0)); poll.style.opacity = ax;
    var a = back(seg(t, 6.0, 6.7)), hA = 200 * a; barA.setAttribute('y', 940 - hA); barA.setAttribute('height', Math.max(.01, hA)); arrA.style.opacity = seg(t, 6.45, 6.8); arrA.setAttribute('transform', 'translate(0 ' + ((1 - e3(seg(t, 6.45, 6.9))) * 40) + ')');
    $('labA').style.opacity = e3(seg(t, 6.0, 6.5)); $('labA').style.transform = 'translateY(' + ((1 - e3(seg(t, 6.0, 6.5))) * 18) + 'px)';
    var gq = seg(t, 6.8, 7.0) * (1 - seg(t, 7.35, 7.5)); guess.setAttribute('opacity', gq); guess.setAttribute('transform', 'translate(0 ' + (-Math.sin(t * 9) * 4) + ')');
    var b = back(seg(t, 7.5, 8.2)); barB.setAttribute('height', Math.max(.01, 270 * b)); arrB.style.opacity = seg(t, 7.95, 8.3);
    $('labB').style.opacity = e3(seg(t, 7.5, 8.0)); $('labB').style.transform = 'translateY(' + ((1 - e3(seg(t, 7.5, 8.0))) * 18) + 'px)';
    var st = back(seg(t, 8.3, 8.75)), am = $('amber'); am.style.opacity = clamp(seg(t, 8.3, 8.45) * 3, 0, 1); am.style.transform = 'scale(' + lerp(2.3, 1, st) + ') rotate(' + ((1 - st) * -8) + 'deg)';
    var shake = Math.max(0, 1 - seg(t, 8.7, 8.95)) * (t > 8.7 ? 1 : 0); S.s1.style.transform += ' translate(' + (Math.sin(t * 90) * 7 * shake) + 'px,' + (Math.cos(t * 77) * 7 * shake) + 'px)';
    var th = $('thumb'); th.style.opacity = e3(seg(t, 6.0, 6.5)); $('thumbl').style.opacity = th.style.opacity;
    $('chips1').style.opacity = clamp(seg(t, 8.3, 8.5) * 3, 0, 1);
    rpath.setAttribute('stroke-dashoffset', rlen * (1 - eio(seg(t, 8.9, 9.4)))); $('rough1').style.opacity = seg(t, 8.9, 9.0);
    $('cap1').style.opacity = e3(seg(t, 5.7, 6.1)); $('cap1').style.transform = 'translate(' + (d[0] * .4) + 'px,0)';
    $('b' + 't3').style.transform = 'scale(' + (1 + .12 * Math.sin(t * 6) * (t > 5.5 ? 1 : 0)) + ')';
  }
  // ---------- S2
  var in2 = t > 9.3; vis(S.s2, in2);
  if (in2) {
    var enter = eio(seg(t, 9.45, 10.15)), c2 = cam2(t);
    S.s2.style.opacity = seg(t, 9.4, 9.7); S.s2.style.transform = 'translateX(' + ((1 - enter) * 1400) + 'px)'; S.s2.style.filter = 'blur(' + ((1 - enter) * 24).toFixed(1) + 'px)';
    wordsIn($('h2'), t, 10.55, .13);
    var sk2 = scr(AN.head.skull, c2), ear2 = scr(AN.head.ear, c2), R2 = 232 * c2.z / 1.3, L2 = $('lens2'); L2.style.clipPath = 'circle(' + R2 + 'px at ' + sk2[0] + 'px ' + sk2[1] + 'px)'; L2.style.background = 'rgba(3,8,18,.84)';
    var s2 = c2.z * (W / IW) * AN.xray.k, xi2 = $('xr2'); xi2.style.mixBlendMode = 'screen'; xi2.style.filter = 'brightness(1.25) contrast(1.15)';
    xi2.style.transform = 'translate(' + (ear2[0] - AN.xray.ear[0] * s2 + AN.xray.dx * c2.z) + 'px,' + (ear2[1] - AN.xray.ear[1] * s2 + AN.xray.dy * c2.z) + 'px) scale(' + s2 + ')';
    var l2 = $('lenssvg2'); l2.textContent = ''; defs(l2); var pc2 = scr(AN.head.coral, c2), sw = seg(t, 11.3, 14.6);
    el('circle', { cx: pc2[0], cy: pc2[1], r: 190 * c2.z / 1.3, fill: 'url(#cg)', opacity: .5 + .4 * sw }, l2);
    var gd = el('radialGradient', { id: 'cg' }, l2.firstChild); el('stop', { offset: 0, 'stop-color': '#ff5a4d', 'stop-opacity': .7 }, gd); el('stop', { offset: 1, 'stop-color': '#ff5a4d', 'stop-opacity': 0 }, gd);
    for (var k = 0; k < 4; k++) { var ph2 = (t * .38 + k / 4) % 1, rr = (30 + ph2 * (130 + 120 * sw)) * c2.z / 1.3; el('circle', { cx: pc2[0], cy: pc2[1], r: rr, fill: 'none', stroke: '#ff5a4d', 'stroke-width': (7 - 5 * ph2) * (1 + sw * .6), opacity: (1 - ph2) * (.5 + .5 * sw), filter: 'url(#glowo)' }, l2); }
    el('circle', { cx: pc2[0], cy: pc2[1], r: (16 + 8 * sw) * c2.z / 1.3, fill: '#ff5a4d', filter: 'url(#glowo)' }, l2);
    // plug at the near ear + hand
    var ear = scr(AN.head.ear, c2); var pk = back(seg(t, 11.0, 11.5));
    el('rect', { x: ear[0] - 38 * pk, y: ear[1] - 22 * pk, width: 76 * pk, height: 44 * pk, rx: 20, fill: '#bfff45', filter: 'url(#glowo)' }, l2);
    lensRim($('lensrim2'), sk2[0], sk2[1], R2, t, 'X-RAY'); $('lensrim2').style.opacity = seg(t, 10.0, 10.4);
    var hL = $('handL'), hk = e3(seg(t, 10.7, 11.3)); hL.style.left = (ear[0] - 128) + 'px'; hL.style.top = (ear[1] - 50 + (1 - hk) * 160) + 'px'; hL.style.opacity = hk; hL.style.transform = 'rotate(' + (22 - 6 * Math.sin(t * 2)) + 'deg)'; $('handR').style.display = 'none';
    var at = $('airtag'); at.style.left = '700px'; at.style.top = (sk2[1] + 30) + 'px'; at.style.opacity = seg(t, 11.6, 12.0);
    var tr = $('tryit'); put(tr, back(seg(t, 10.9, 11.4)), 0, 0, .8); var cs = $('chips2'); cs.style.opacity = 1;
    $('cap2').style.opacity = e3(seg(t, 10.4, 10.8)); $('cap2').style.transform = 'translate(' + (d[0] * .4) + 'px,0)';
    $('stage').style.setProperty('--mute', sw);
    $('gl').style.filter = 'blur(' + (3.2 * eio(seg(t, 12.8, 13.6))).toFixed(2) + 'px) saturate(' + (1 - .25 * eio(seg(t, 12.8, 13.6))) + ')';
    [1, 2, 3, 4].forEach(function (n) { $('c' + 't' + n).classList.toggle('on', true); });
    $('ct4').style.transform = 'scale(' + (1 + .14 * Math.sin(t * 6)) + ')';
  } else { $('gl').style.filter = 'none'; }
  // global flash at the lens push-through and a bloom on the whip
  $('flash').style.opacity = Math.max(0, 1 - Math.abs(t - 4.92) / .13) * .42 + Math.max(0, 1 - Math.abs(t - 9.7) / .16) * .22;
  $('scrim').style.opacity = t < 5 ? 1 : (t < 9.5 ? 0.35 : 1);
}

function seekGL(t) {
  var o;
  if (t < 4.95) { var c = cam0(t), s = sh(c); o = { a: 'head_a', camA: [Math.sin(t * .5) * .7, Math.cos(t * .4) * .35, c.z], shA: s, par: .045, t: t, dim: .88 - .1 * eio(seg(t, 4.3, 4.9)), flash: 0 };
    if (t > 4.7) { o.b = 'xray_skull'; o.mix = seg(t, 4.7, 4.95); o.camB = [0, 0, 1.0]; o.shB = [0, 0]; } }
  else if (t < 9.3) { var z = 1 + .08 * seg(t, 4.9, 9.3); o = { a: 'xray_skull', camA: [Math.sin(t * .5) * .5, 0, z], shA: [0, 0], par: .03, t: t, dim: .42 }; }
  else { var c2 = cam2(t), s2 = sh(c2), pk = Math.sin(Math.PI * seg(t, 9.3, 10.2));
    o = { a: 'xray_skull', b: 'head_a', mix: eio(seg(t, 9.55, 9.9)), camA: [0, 0, 1.08], camB: [Math.sin(t * .5) * .8, Math.cos(t * .4) * .3, c2.z], shA: [0, 0], shB: s2, whip: pk * .09, wdir: [1, 0], par: .05, t: t, dim: (t < 9.9 ? .42 : .8) + .0 };
    if (t >= 9.9) o.dim = lerp(.42, .8, 1); }
  window.GLP.draw(o);
}

window.__seek = function (t) {
  seekGL(t); seekDom(t);
  return Promise.all([vseek(vids.dust, t * 1), vseek(vids.grain, t * 1)]);
};
Promise.all([document.fonts.load('700 100px Fam'), document.fonts.load('600 20px Fam'), document.fonts.load('400 20px Frag'), document.fonts.load('700 40px InterX'), document.fonts.load('600 20px InterX'), window.GLP.load(['head_a', 'xray_skull'])]).then(function () {
  return new Promise(function (r) { var n = 0; ['dust', 'grain'].forEach(function (k) { var v = vids[k]; if (v.readyState >= 2) { if (++n === 2) r(); } else v.addEventListener('loadeddata', function () { if (++n === 2) r(); }); }); });
}).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
})();
