/* "Itna jaldi kaise?" — Neon Dispatch. Every frame is a pure function of t (window.__seek). Times come from the voice (timing.js, TM). */
(function () {
var ST = document.getElementById('stage'), NS = 'http://www.w3.org/2000/svg';
var ORD = '#ff6a1a', FEN = '#7b4dff', STK = '#c6ff1a', ALR = '#ff2d7a', OFF = '#eef0fa';
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function eo(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function bk(x) { x = clamp(x); var c = 1.7; return Math.max(0, 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2)); }
function bounce(x) { x = clamp(x); var n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) { x -= 1.5 / d; return n * x * x + .75; } if (x < 2.5 / d) { x -= 2.25 / d; return n * x * x + .9375; } x -= 2.625 / d; return n * x * x + .984375; }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
/* ---- word cues (Hindi transcript word start times) ---- */
var WD = TM.words;
function K(sub, n, exact) { n = n || 0; var c = 0; for (var i = 0; i < WD.length; i++) { var w = WD[i][0].replace(/[?,.]/g, ''); if (exact ? w === sub : w.indexOf(sub) >= 0) { if (c === n) return WD[i][1]; c++; } } window.__miss = (window.__miss || []).concat([sub, n]); return 0; }
var EV = []; function ev(t, k) { EV.push({ t: +t.toFixed(3), k: k }); return t; }
/* ---- tiny DOM helpers ---- */
function E(p, cls, css, html, tag) { var e = document.createElement(tag || 'div'); if (cls) e.className = cls; if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; p.appendChild(e); return e; }
function S(p, tag, at) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); p.appendChild(e); return e; }
function svg(p, css, vb) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', vb || '0 0 1080 1920'); s.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;' + (css || ''); p.appendChild(s); return s; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.6) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
function show(el, t, t0, o) { o = o || {}; var d = o.d || .35, u = t - t0, k = o.bounce === false ? eo(u / d) : bk(u / d), a = eo(u / (d * .7)); el.style.opacity = u < 0 ? 0 : a * (o.max == null ? 1 : o.max); var y = (o.y == null ? 36 : o.y) * (1 - k), x = (o.x || 0) * (1 - k), s = 1 - (1 - (o.s == null ? .92 : o.s)) * (1 - k); el.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')'; }
function tint(t, t0, k) { return clamp(1 - Math.abs(t - t0) / k); }
/* ---- scene table: boundaries sit in the silences of the voice track (cuts in the one 0-gap spot get a hard whoosh) ---- */
var B = [0, 3.42, 5.5, 11.1, 18.4, 24.55, 30.2, 34.1, 40.2, 43.65, 49.7, 55.6];
var DUR = B[B.length - 1], TR = .3;
var FL = [ORD, ORD, ALR, FEN, STK, STK, ORD, ALR, STK, ORD, FEN];
var scenes = [];
function scene(i) { var el = E(ST, 'scene', ''); var o = { i: i, t0: B[i], t1: B[i + 1], el: el }; scenes.push(o); return o; }
/* =========================  A  HOOK 0 - 3.42  (NASA Black Marble + HUD stopwatch)  ========================= */
(function () {
var s = scene(0), el = s.el;
var map = E(el, 'abs', 'left:0;top:640px;width:1080px;height:700px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent,#000 14%,#000 86%,transparent)');
var img = E(map, '', 'position:absolute;left:0;top:-120px;width:1080px;filter:brightness(1.9) contrast(1.15) saturate(1.5);transform-origin:50% 50%', '', 'img'); img.src = 'img/india-night.jpg';
var ps = svg(map, '', '0 0 1080 700'), pins = [];
var CITIES = [[77.2, 28.6], [72.9, 19.1], [88.4, 22.6], [78.5, 17.4], [77.6, 13.0], [80.3, 13.1]];
CITIES.forEach(function (c, i) { var x = (c[0] - 66) / 33 * 1080, y = (38 - c[1]) / 34 * 1112 - 120; var r1 = S(ps, 'circle', { cx: x, cy: y, r: 10, fill: 'none', stroke: ORD, 'stroke-width': 4 }), r2 = S(ps, 'circle', { cx: x, cy: y, r: 10, fill: 'none', stroke: ORD, 'stroke-width': 3 }), h = S(ps, 'circle', { cx: x, cy: y, r: 26, fill: ORD, opacity: .25 }), d = S(ps, 'circle', { cx: x, cy: y, r: 11, fill: ORD }); pins.push({ r1: r1, r2: r2, h: h, d: d }); ev(.15 + i * .28, 'ping'); });
var clk = svg(el, 'top:190px;height:700px', '0 0 1080 700'), cx = 540, cy = 330, R = 250, L = 2 * Math.PI * R;
S(clk, 'circle', { cx: cx, cy: cy, r: R + 34, fill: 'rgba(5,6,12,.55)' });
for (var i = 0; i < 60; i++) { var a = i / 60 * Math.PI * 2 - Math.PI / 2, r0 = R + 12, r1 = R + (i % 5 ? 20 : 34); S(clk, 'line', { x1: cx + Math.cos(a) * r0, y1: cy + Math.sin(a) * r0, x2: cx + Math.cos(a) * r1, y2: cy + Math.sin(a) * r1, stroke: i % 5 ? 'rgba(238,240,250,.35)' : OFF, 'stroke-width': i % 5 ? 3 : 5 }); }
S(clk, 'circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: 'rgba(255,106,26,.22)', 'stroke-width': 26 });
var arc = S(clk, 'circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: ORD, 'stroke-width': 26, 'stroke-linecap': 'round', transform: 'rotate(-90 ' + cx + ' ' + cy + ')', 'stroke-dasharray': L + ' ' + L });
var num = S(clk, 'text', { x: cx, y: cy + 110, 'text-anchor': 'middle', fill: OFF, 'font-family': 'Antonio', 'font-weight': 700, 'font-size': 330 }); num.textContent = '10';
var mn = S(clk, 'text', { x: cx, y: cy + 175, 'text-anchor': 'middle', fill: ORD, 'font-family': 'JetBrains Mono', 'font-weight': 700, 'font-size': 40, 'letter-spacing': '12' }); mn.textContent = 'MIN';
var slash = E(el, '', 'left:120px;top:500px;width:840px;height:34px;position:absolute;background:' + ALR + ';box-shadow:0 0 50px 10px rgba(255,45,122,.55);transform-origin:0 50%');
var chipR = E(el, 'chip mono', 'left:150px;top:150px;color:' + ORD + ';font-size:24px', '<i></i>reported · reuters · 13 jan 2026');
var cB = E(el, 'chip mono', 'left:150px;top:1236px;color:' + OFF + ';font-size:28px', '<i style="background:' + ORD + '"></i>Blinkit'), cZ = E(el, 'chip mono', 'left:380px;top:1236px;color:' + OFF + ';font-size:28px', '<i style="background:' + FEN + '"></i>Zepto');
var tSl = K('बंद'); ev(tSl, 'slam');
E(el, 'vig', '');
s.r = function (t) {
var p = (t * .62) % 1; arc.setAttribute('stroke-dashoffset', L * p);
var sl = eo((t - tSl) / .26); slash.style.transform = 'rotate(-9deg) scaleX(' + sl + ')';
num.setAttribute('opacity', 1 - .62 * eo((t - tSl - .1) / .3)); mn.setAttribute('opacity', 1 - .5 * eo((t - tSl) / .3));
img.style.transform = 'scale(' + (1.06 + t * .012) + ')';
pins.forEach(function (q, i) { var u = t - (.15 + i * .28), on = u >= 0, k = on ? bk(u / .35) : 0; q.d.setAttribute('r', 11 * k); q.h.setAttribute('r', 26 * k); q.h.setAttribute('opacity', on ? .28 : 0); var ph = ((u * 1.1) % 1 + 1) % 1; q.r1.setAttribute('r', 10 + ph * 70); q.r1.setAttribute('opacity', on ? (1 - ph) * .9 : 0); var ph2 = ((u * 1.1 + .5) % 1 + 1) % 1; q.r2.setAttribute('r', 10 + ph2 * 70); q.r2.setAttribute('opacity', on ? (1 - ph2) * .9 : 0); });
chipR.style.opacity = 1; show(cB, t, -.1, { d: .3, y: 20 }); show(cZ, t, .55, { d: .3, y: 20 });
var jx = tint(t, tSl, .12) * 7 * Math.sin(t * 90); el.style.transform = 'translateX(' + jx + 'px)';
};
})();
/* =========================  B  MILK 3.42 - 5.5  (Blender doorstep + pouch sprite)  ========================= */
(function () {
var s = scene(1), el = s.el, tD = K('दूद') - .25, tQ = K('कैसे');
var bg = E(el, 'fill', 'width:1080px;height:1920px;transform-origin:50% 60%', '', 'img'); bg.src = 'img/doorstep.png';
var sh = E(el, 'abs', 'left:395px;top:1262px;width:290px;height:46px;border-radius:50%;background:rgba(0,0,0,.6);filter:blur(10px)');
var po = E(el, 'abs', 'left:330px;top:0;width:420px;height:420px;transform-origin:50% 90%', '', 'img'); po.src = 'img/pouch.png';
var ring = svg(el, ''), rg = S(ring, 'ellipse', { cx: 540, cy: 1300, rx: 10, ry: 4, fill: 'none', stroke: STK, 'stroke-width': 6 });
var chip = E(el, 'chip mono', 'left:150px;top:150px;color:' + STK + ';font-size:26px', '<i></i>doorstep · order a-2031');
var q = E(el, 'big', 'left:690px;top:600px;font-size:420px;color:' + ALR + ';text-shadow:0 0 60px rgba(255,45,122,.7)', '?');
var sc2 = svg(el, ''); ev(tD + .55, 'thud'); ev(tQ, 'pop');
E(el, 'vig', '');
s.r = function (t) {
var u = (t - tD) / .55, k = u < 0 ? 0 : bounce(u), y = -520 + 520 * k; var base = 1262 - 420 + 98; po.style.top = (base + y) + 'px'; po.style.opacity = u < -.02 ? 0 : 1;
po.style.transform = 'rotate(' + ((1 - k) * -18) + 'deg) scale(' + (1 + (u > 1 ? 0 : (1 - k) * .1)) + ')';
sh.style.opacity = clamp(u) * .9; sh.style.transform = 'scale(' + (.5 + .5 * clamp(u)) + ')';
var r = clamp((t - (tD + .55)) / .6); rg.setAttribute('rx', 10 + 360 * r); rg.setAttribute('ry', 4 + 90 * r); rg.setAttribute('opacity', r > 0 && r < 1 ? 1 - r : 0);
bg.style.transform = 'scale(' + (1 + (t - B[1]) * .02) + ')';
show(chip, t, B[1] + .05, { d: .3, y: 20 }); show(q, t, tQ, { d: .4, y: 80, s: .4 });
};
})();
/* =========================  C  RIDER vs ORDER 5.5 - 11.1  (scooter sprite, speed lines, freeze, three decisions)  ========================= */
(function () {
var s = scene(2), el = s.el, tF = K('नहीं'), tT = K('तीन'), tTab = K('टैब');
E(el, 'fill', 'background:radial-gradient(ellipse at 50% 70%,#1c1040 0%,#080a18 70%)');
var lines = svg(el, ''), L = []; for (var i = 0; i < 16; i++) { var y = 280 + hash(i * 7 + 1) * 1000; L.push({ e: S(lines, 'rect', { x: 0, y: y, width: 140 + hash(i + 40) * 260, height: 4 + hash(i + 9) * 8, rx: 4, fill: i % 3 == 0 ? ORD : i % 3 == 1 ? FEN : 'rgba(238,240,250,.7)' }), y: y, v: 900 + hash(i + 3) * 900, w: 140 + hash(i + 40) * 260, ph: hash(i + 20) * 1500 }); }
var city = svg(el, '', '0 0 1080 1920'), bokeh = []; for (var j = 0; j < 22; j++) bokeh.push({ e: S(city, 'circle', { r: 10 + hash(j + 90) * 22, cy: 1180 + hash(j + 11) * 100 - hash(j + 33) * 60, fill: j % 2 ? ORD : FEN, opacity: .5 }), v: 120 + hash(j) * 160, ph: hash(j + 5) * 1400 });
E(el, 'abs', 'left:0;top:1300px;width:1080px;height:2px;background:linear-gradient(90deg,transparent,' + ORD + ',transparent);box-shadow:0 0 30px 6px rgba(255,106,26,.5)');
var sco = E(el, 'abs', 'left:-40px;top:760px;width:1200px;height:800px;transform-origin:50% 75%', '', 'img'); sco.src = 'img/scooter.png';
var big = E(el, 'big', 'left:150px;top:190px;font-size:150px', 'Before<br>the tap'), big2 = E(el, 'big', 'left:150px;top:190px;font-size:150px', 'Three<br>decisions'), x = E(el, 'abs', 'left:690px;top:250px;font-size:190px;color:' + ALR + ';text-shadow:0 0 50px rgba(255,45,122,.7)', '', 'div');
var xs = E(el, 'chip mono', 'left:150px;top:560px;color:' + ALR + ';font-size:28px', '<i></i>rider speed ≠ the secret');
var tabs = [['h-building-storefront', 'STORE', FEN, K('फैसले')], ['package', 'SHELF', STK, K('तीनो')], ['h-shopping-bag', 'PACK', ORD, tTab - .15]].map(function (c, i) {
var d = E(el, 'abs', 'left:150px;top:' + (560 + i * 250) + 'px;width:768px;height:215px;border:4px solid ' + c[2] + ';background:rgba(8,10,22,.82);border-radius:22px;display:flex;align-items:center;gap:26px;padding:0 32px;box-sizing:border-box;box-shadow:0 0 40px -6px ' + c[2], '<div style="font:700 150px Antonio;color:' + c[2] + '">' + (i + 1) + '</div>' + ico(c[0], 110, c[2], 1.4) + '<div style="font:700 110px Antonio;letter-spacing:.04em;color:' + OFF + '">' + c[1] + '</div>');
ev(c[3], 'tab'); return { e: d, t: c[3] }; });
var tap = svg(el, ''), tr = S(tap, 'circle', { cx: 540, cy: 1100, r: 10, fill: 'none', stroke: OFF, 'stroke-width': 6 }), tAll = tTab;
ev(tF, 'freeze'); ev(K('असली'), 'swell');
E(el, 'vig', '');
s.r = function (t) {
var ts = Math.min(t, tF), moving = t < tF;
L.forEach(function (l) { var xx = 1300 - ((ts * l.v + l.ph) % (1300 + l.w)); l.e.setAttribute('x', xx); l.e.setAttribute('opacity', moving ? .9 : .9 * clamp(1 - (t - tF) / .25)); });
bokeh.forEach(function (b) { b.e.setAttribute('cx', 1200 - ((ts * b.v + b.ph) % 1300)); });
var bob = moving ? Math.sin(t * 28) * 5 : 0, lean = moving ? -2.5 : 0, out = eio((t - (tT - .6)) / .6);
var scale = 1 - .45 * out; sco.style.transform = 'translate(' + (-1000 * out) + 'px,' + (-250 * out + bob) + 'px) rotate(' + lean + 'deg) scale(' + scale + ')';
sco.style.opacity = 1 - .0 * out;
show(big, t, B[2] + .08, { d: .3, y: 30 });
x.innerHTML = '<span class="big" style="position:relative;font-size:190px;color:' + ALR + '">✕</span>'; show(x, t, tF, { d: .3, y: 0, s: .3 });
show(xs, t, tF + .05, { d: .3, y: 20 }); xs.style.opacity = clamp((t - tF) / .2) * (1 - clamp((t - (tT - .4)) / .25)); x.style.opacity = (+x.style.opacity) * (1 - clamp((t - (tT - .4)) / .25));
big.style.opacity = (t < B[2] + .08 ? 0 : 1) * (1 - clamp((t - (tT - .25)) / .25));
show(big2, t, tT - .1, { d: .35, y: 40 }); tabs.forEach(function (c, i) { show(c.e, t, c.t, { d: .38, y: 0, x: 140, s: .96 }); });
var u = (t - tTab) / .6; tr.setAttribute('r', 10 + clamp(u) * 150); tr.setAttribute('opacity', u > 0 && u < 1 ? 1 - u : 0); tr.setAttribute('cy', 1100 + 0);
};
})();
/* =========================  D  ONE FENCE 11.1 - 18.4  (Blender city + HUD geofence)  ========================= */
(function () {
var s = scene(3), el = s.el, tH = K('पहला'), tFence = K('घिरा'), tG = K('ज्यूफन्स'), tOrd = K('आपका'), tYou = K('आप', 0, true), tKm = K('कहते');
var bg = E(el, 'fill', 'width:1080px;height:1920px;transform-origin:50% 55%', '', 'img'); bg.src = 'img/city.png';
var hud = svg(el, '');
var f1 = S(hud, 'ellipse', { cx: 540, cy: 1010, rx: 430, ry: 236, fill: 'none', stroke: FEN, 'stroke-width': 7 }), fill = S(hud, 'ellipse', { cx: 540, cy: 1010, rx: 430, ry: 236, fill: 'rgba(123,77,255,.18)' });
var nb = [[250, 560, 140, 80], [830, 600, 130, 76], [820, 1420, 130, 74], [260, 1420, 140, 76]].map(function (c, i) { var e = S(hud, 'ellipse', { cx: c[0], cy: c[1], rx: c[2], ry: c[3], fill: 'rgba(123,77,255,.10)', stroke: FEN, 'stroke-width': 4, 'stroke-dasharray': '10 8' }), d = S(hud, 'circle', { cx: c[0], cy: c[1], r: 9, fill: '#b9a3ff' }); return { e: e, d: d, t: tH + .9 + i * .34 }; });
var sd = S(hud, 'circle', { cx: 560, cy: 1020, r: 12, fill: '#b9a3ff' });
var pr = S(hud, 'circle', { cx: 130, cy: 880, r: 14, fill: 'none', stroke: ORD, 'stroke-width': 5 }), pth = S(hud, 'path', { d: 'M130 880 C 260 700, 420 760, 560 1020', fill: 'none', stroke: ORD, 'stroke-width': 5, 'stroke-dasharray': '14 12' }), pk = S(hud, 'circle', { cx: 0, cy: 0, r: 15, fill: ORD }), PL = pth.getTotalLength();
var scan = S(hud, 'ellipse', { cx: 540, cy: 1010, rx: 10, ry: 6, fill: 'none', stroke: STK, 'stroke-width': 6 }), you = S(hud, 'ellipse', { cx: 560, cy: 1020, rx: 20, ry: 11, fill: 'none', stroke: ORD, 'stroke-width': 5 });
var lY = E(el, 'chip mono', 'left:150px;top:800px;color:' + ORD + ';font-size:24px', 'you'), lS = E(el, 'chip mono', 'left:620px;top:1090px;color:#b9a3ff;font-size:24px', 'store');
var hd = E(el, 'big', 'left:150px;top:214px;font-size:158px', 'One fence'), gf = E(el, 'big', 'left:168px;top:385px;font-size:112px', '<span class="blk" style="background:' + FEN + ';color:#fff">geofence</span>');
var km = E(el, 'chip mono', 'left:150px;top:1140px;color:' + FEN + ';font-size:24px', '<i></i>2-3 km · cbre'), tk = E(el, 'trk', '', ''); [1, 2, 3].forEach(function (n) { E(tk, 'pg', '', n); });
E(el, 'abs', 'left:0;top:0;right:0;height:560px;background:linear-gradient(180deg,rgba(5,6,12,.8),transparent)');
ev(tFence, 'ring'); ev(tG, 'slam'); ev(tOrd + .5, 'ping'); ev(tYou, 'ping');
E(el, 'vig', '');
s.r = function (t) {
bg.style.transform = 'scale(' + (1 + (t - B[3]) * .016) + ') translate(' + (-(t - B[3]) * 2) + 'px,' + (-(t - B[3]) * 1) + 'px)';
var Lf = f1.getTotalLength(); f1.setAttribute('stroke-dasharray', Lf); f1.setAttribute('stroke-dashoffset', Lf * (1 - eo((t - (tH + .7)) / .9)));
fill.setAttribute('opacity', eo((t - tFence) / .5));
nb.forEach(function (n) { var u = clamp((t - n.t) / .45); n.e.setAttribute('opacity', u); n.d.setAttribute('r', 9 * bk(u)); });
var sp = (t - tH - .55) / 1.0, s2 = clamp(sp); scan.setAttribute('rx', 10 + 420 * s2); scan.setAttribute('ry', 6 + 230 * s2); scan.setAttribute('opacity', sp > 0 && sp < 1 ? 1 - s2 : 0);
var u = eo((t - tOrd) / .95); var pt = pth.getPointAtLength(PL * u); pk.setAttribute('cx', pt.x); pk.setAttribute('cy', pt.y); pk.setAttribute('opacity', u > 0 && u < 1 ? 1 : 0); pth.setAttribute('opacity', eo((t - tOrd + .1) / .3) * .9 * (1 - clamp((t - tOrd - 1.2) / .4)));
var ph = (t * 1.1) % 1; pr.setAttribute('r', 14 + ph * 60); pr.setAttribute('opacity', (1 - ph) * .9);
var yu = clamp((t - tYou) / .5); you.setAttribute('opacity', yu); you.setAttribute('rx', 20 + (1 - yu) * 40 + 4 * Math.sin(t * 6)); you.setAttribute('ry', 11 + (1 - yu) * 20 + 2 * Math.sin(t * 6)); sd.setAttribute('opacity', eo((t - tFence) / .3));
show(lY, t, tH + .2, { d: .3, y: 20 }); show(lS, t, tFence + .2, { d: .3, y: 20 }); show(hd, t, tH - .1, { d: .35, y: 40 }); show(gf, t, tG, { d: .3, y: 0, s: .5 }); show(km, t, tKm, { d: .3, y: 20 });
for (var i = 0; i < 3; i++) { var e = tk.children[i], on = i == 0; e.style.background = on ? FEN : 'rgba(5,6,12,.6)'; e.style.color = on ? '#fff' : 'rgba(238,240,250,.5)'; e.style.borderColor = on ? FEN : 'rgba(238,240,250,.35)'; }
};
})();
/* =========================  E  STOCKED FIRST 18.4 - 24.55  (Blender aisle + HUD forecast bars)  ========================= */
(function () {
var s = scene(4), el = s.el, tH = K('दुसरा'), tR = K('रखना'), tPin = K('पिंग'), tFc = K('फोर्कास्ट'), tFe = K('त्युहारो'), tM = K('क्रिकेट');
var bg = E(el, 'fill', 'width:1080px;height:1920px;transform-origin:50% 60%', '', 'img'); bg.src = 'img/aisle.png';
E(el, 'scrim', ''); var hud = svg(el, '');
var panel = S(hud, 'rect', { x: 150, y: 860, width: 640, height: 400, rx: 20, fill: 'rgba(5,6,12,.7)', stroke: 'rgba(198,255,26,.55)', 'stroke-width': 3 });
var vals = [.28, .34, .3, .4, .36, .46, .98, .5, .44, .86, .4, .36], bars = vals.map(function (v, i) { return S(hud, 'rect', { x: 180 + i * 48, y: 1230, width: 34, height: 0, rx: 5, fill: i == 6 || i == 9 ? ALR : STK }); });
var beam = S(hud, 'rect', { x: 0, y: 330, width: 1080, height: 120, fill: 'rgba(198,255,26,.16)' }), bl = S(hud, 'rect', { x: 0, y: 330, width: 1080, height: 4, fill: STK });
var hd = E(el, 'big', 'left:150px;top:200px;font-size:172px', 'Stocked<br>first'), tk = E(el, 'trk', '', ''); [1, 2, 3].forEach(function (n) { E(tk, 'pg', '', n); });
var cP = E(el, 'chip mono', 'left:150px;top:760px;color:' + STK + ';font-size:24px', '<i></i>per pin code'), cF = E(el, 'chip mono', 'left:470px;top:760px;color:#0b0f00;background:' + STK + ';border-color:' + STK + ';font-size:28px', 'forecast');
var cFe = E(el, 'chip mono', 'left:300px;top:900px;color:' + ALR + ';font-size:22px', 'festival'), cM = E(el, 'chip mono', 'left:610px;top:925px;color:' + ALR + ';font-size:22px', 'match');
E(el, 'src', 'top:1275px', 'illustrative forecast · not company data');
ev(tFc, 'slam'); ev(tFe, 'spike'); ev(tM, 'spike'); ev(tR, 'scan');
E(el, 'vig', '');
s.r = function (t) {
bg.style.transform = 'scale(' + (1 + (t - B[4]) * .03) + ')';
var u = (t - tR) / 1.1; bl.setAttribute('y', 330 + clamp(u) * 520); beam.setAttribute('y', 330 + clamp(u) * 520 - 120); beam.setAttribute('opacity', u > 0 && u < 1 ? 1 : 0); bl.setAttribute('opacity', u > 0 && u < 1 ? 1 : 0);
var pa = eo((t - tPin + .2) / .3); panel.setAttribute('opacity', pa);
bars.forEach(function (b, i) { var uu = eo((t - tPin - .15 - i * .07) / .55), h = vals[i] * 270 * uu; if (i == 6) h *= (t < tFe ? .55 : 1) * 1; if (i == 9) h *= (t < tM ? .55 : 1); var hh = vals[i] * 270 * uu * ((i == 6 && t < tFe) || (i == 9 && t < tM) ? .45 : 1); if (i == 6) hh = vals[6] * 270 * uu * (.45 + .55 * eo((t - tFe) / .35)); if (i == 9) hh = vals[9] * 270 * uu * (.45 + .55 * eo((t - tM) / .35)); b.setAttribute('y', 1230 - hh); b.setAttribute('height', hh); });
show(hd, t, tH - .1, { d: .35, y: 40 }); show(cP, t, tPin, { d: .3, y: 20 }); show(cF, t, tFc, { d: .3, y: 0, s: .5 }); show(cFe, t, tFe, { d: .3, y: 14 }); show(cM, t, tM, { d: .3, y: 14 });
for (var i = 0; i < 3; i++) { var e = tk.children[i], on = i == 1; e.style.background = on ? STK : 'rgba(5,6,12,.6)'; e.style.color = on ? '#0b0f00' : 'rgba(238,240,250,.5)'; e.style.borderColor = on ? STK : 'rgba(238,240,250,.35)'; }
};
})();
/* =========================  F  PACKING 24.55 - 30.2  (Blender phone + homography screen + scan)  ========================= */
function homog(w, h, q) { var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1]; var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3; var den = dx1 * dy2 - dy1 * dx2, a13 = (dx3 * dy2 - dy3 * dx2) / den, a23 = (dx1 * dy3 - dy1 * dx3) / den; var a11 = x1 - x0 + a13 * x1, a21 = x3 - x0 + a23 * x3, a12 = y1 - y0 + a13 * y1, a22 = y3 - y0 + a23 * y3; return 'matrix3d(' + [a11 / w, a12 / w, 0, a13 / w, a21 / h, a22 / h, 0, a23 / h, 0, 0, 1, 0, x0, y0, 0, 1].join(',') + ')'; }
var PH = window.PHONE;
(function () {
var s = scene(5), el = s.el, tH = K('तीसरा'), tPhone = K('हैंडहेल्ट') - .3, tBin = K('बिन', 0, true), tScan = K('बार', 0, true), tEgg = K('अड़े'), tLast = K('आखिर');
var bg = E(el, 'fill', 'width:1080px;height:1920px;filter:blur(10px) brightness(.5) saturate(1.3);transform:scale(1.1)', '', 'img'); bg.src = 'img/aisle.png';
var SP = .81, PX = 189, PY = 206; var ph = E(el, 'abs', 'left:' + PX + 'px;top:' + PY + 'px;width:' + (900 * SP) + 'px;height:' + (1500 * SP) + 'px;transform-origin:50% 50%', '');
var pimg = E(ph, 'abs', 'left:0;top:0;width:100%;height:100%', '', 'img'); pimg.src = 'img/phone.png';
var q = ['tl', 'tr', 'br', 'bl'].map(function (k) { return [PH[k][0] * SP, PH[k][1] * SP]; }), SW = 400, SH = 860;
var scr = E(ph, 'abs', 'left:0;top:0;width:' + SW + 'px;height:' + SH + 'px;transform-origin:0 0;transform:' + homog(SW, SH, q) + ';background:#0a0d1c;overflow:hidden;border-radius:26px');
E(scr, '', 'position:absolute;left:0;right:0;top:0;height:92px;background:' + ORD + ';color:#1a0900;font:700 30px "JetBrains Mono";letter-spacing:.08em;display:flex;align-items:center;padding:0 26px', 'PICK LIST');
var items = [['A3', 'MILK', STK], ['B1', 'BREAD', STK], ['C7', 'EGGS', ALR], ['D2', 'RICE', STK], ['F4', 'TEA', STK]], rows = items.map(function (c, i) { return E(scr, '', 'position:absolute;left:24px;right:24px;height:112px;top:0;border:4px solid rgba(238,240,250,.25);border-radius:18px;display:flex;align-items:center;gap:22px;padding:0 22px;font:700 44px "JetBrains Mono";color:' + OFF + ';box-sizing:border-box', '<span class="bn" style="color:' + c[2] + '">' + c[0] + '</span><span style="font-size:36px;letter-spacing:.06em">' + c[1] + '</span><span class="ck" style="margin-left:auto;font-size:40px;color:' + STK + ';opacity:0">✓</span>'); });
var beam = E(scr, '', 'position:absolute;left:0;right:0;height:10px;background:' + STK + ';box-shadow:0 0 30px 8px rgba(198,255,26,.7);opacity:0');
var hd = E(el, 'big', 'left:150px;top:210px;font-size:100px', 'Packed in order'), tk = E(el, 'trk', '', ''); [1, 2, 3].forEach(function (n) { E(tk, 'pg', '', n); });
var cE = E(el, 'chip mono', 'left:150px;top:1268px;color:' + ALR + ';font-size:26px', '<i></i>eggs · picked last'), cS = E(el, 'chip mono', 'left:150px;top:345px;color:' + STK + ';font-size:26px', '<i></i>barcode · scan each item');
ev(tPhone + .3, 'whoosh'); ev(tScan, 'scan'); ev(tScan + .3, 'beep'); ev(tScan + .6, 'beep'); ev(tLast, 'pop');
E(el, 'vig', '');
s.r = function (t) {
var u = (t - tPhone) / .6; ph.style.opacity = clamp(u * 2); ph.style.transform = 'translateY(' + ((1 - bk(u)) * 220) + 'px) rotate(' + ((1 - bk(u)) * 8) + 'deg)';
// route order: bins light one by one from tBin; the eggs row moves from position 2 to the last slot at tLast
var base = [0, 1, 2, 3, 4], pos = base.map(function (i) { return i; }); var egg = eo((t - tLast) / .7);
rows.forEach(function (r, i) { var slot = i; if (i == 2) slot = 2 + 2 * egg; else if (i > 2 && i <= 4) slot = i - egg; r.style.top = (120 + slot * 128) + 'px'; var lit = clamp((t - (tBin + i * .22)) / .25), done = clamp((t - (tScan + (i < 2 ? i : i - 0) * .22 + .1)) / .2) * (i == 2 ? clamp((t - tLast) / .3) : 1) * (t > tScan ? 1 : 0); if (i == 2 && t < tLast) done = 0; r.style.borderColor = lit > 0 ? (i == 2 ? ALR : STK) : 'rgba(238,240,250,.25)'; r.style.boxShadow = lit > 0 ? '0 0 ' + (24 * lit) + 'px -4px ' + (i == 2 ? ALR : STK) : 'none'; r.querySelector('.ck').style.opacity = done; r.style.opacity = .35 + .65 * lit; });
var bu = (t - tScan) / .9; beam.style.opacity = bu > 0 && bu < 1 ? 1 : 0; beam.style.top = (110 + clamp(bu) * 640) + 'px';
show(hd, t, tH - .1, { d: .35, y: 40 }); show(cS, t, tScan - .1, { d: .3, y: 20 }); show(cE, t, tEgg, { d: .3, y: 20 });
for (var i = 0; i < 3; i++) { var e = tk.children[i], on = i == 2; e.style.background = on ? ORD : 'rgba(5,6,12,.6)'; e.style.color = on ? '#1a0900' : 'rgba(238,240,250,.5)'; e.style.borderColor = on ? ORD : 'rgba(238,240,250,.35)'; }
};
})();
/* =========================  G  SCAN & GO 30.2 - 34.1  (pigeonholes + rider + bag sprite)  ========================= */
(function () {
var s = scene(6), el = s.el, tR = K('राइड', 0, true), tScan = K('बैक'), tGo = K('निकल');
E(el, 'fill', 'background:radial-gradient(ellipse at 50% 40%,#1b1238 0%,#07080f 75%)');
var wall = E(el, 'abs', 'left:90px;top:470px;width:900px;height:640px;transform:perspective(1400px) rotateY(-16deg) rotateX(6deg);transform-origin:50% 50%'); var hud = svg(wall, '', '0 0 900 640');
var cols = 5, rows = 4, cs = 160, g = 14, cols_ = [FEN, STK, ORD, FEN, STK], cells = [], target = 7;
for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { var i = r * cols + c, col = i == target ? ORD : [FEN, STK][(r + c) % 2]; var e = S(hud, 'rect', { x: 20 + c * (cs + g), y: 20 + r * (cs + g), width: cs, height: cs, rx: 14, fill: 'rgba(8,10,22,.8)', stroke: col, 'stroke-width': 3 }); var f = S(hud, 'rect', { x: 20 + c * (cs + g), y: 20 + r * (cs + g), width: cs, height: cs, rx: 14, fill: col, opacity: 0 }); cells.push({ e: e, f: f, i: i, col: col, o: hash(i + 4) * .9 }); }
var door = E(el, 'abs', 'left:0;top:1262px;width:1080px;height:6px;background:' + ALR + ';box-shadow:0 0 34px 6px rgba(255,45,122,.6)'), dl = E(el, 'chip mono', 'left:150px;top:392px;color:' + ALR + ';font-size:24px', '<i></i>rider stays outside');
var sco = E(el, 'abs', 'left:0;top:860px;width:600px;height:400px;transform-origin:50% 90%', '', 'img'); sco.src = 'img/scooter.png';
var ray = svg(el, ''), rl = S(ray, 'line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: STK, 'stroke-width': 6, 'stroke-dasharray': '12 10' });
var hd = E(el, 'big', 'left:150px;top:200px;font-size:172px', 'Scan <span style="color:' + STK + '">&amp;</span> go'), ok = E(el, 'chip mono', 'left:620px;top:1190px;color:' + STK + ';font-size:26px', '<i></i>scanned');
ev(tR, 'whoosh'); ev(tScan, 'scan'); ev(tScan + .35, 'beep'); ev(tGo, 'whoosh');
E(el, 'vig', '');
s.r = function (t) {
cells.forEach(function (c) { var lit = c.i == target ? clamp((t - tScan - .35) / .2) : (.25 * (.5 + .5 * Math.sin(t * 2 + c.o * 6))) * clamp((t - B[6] - c.o * .6) / .3); c.f.setAttribute('opacity', c.i == target ? .85 * lit : lit * .5); c.e.setAttribute('opacity', clamp((t - B[6] - c.o * .5) / .3)); });
var tw = cells[target].e; var arrive = eio((t - (tR - .1)) / .8), leave = eio((t - tGo) / .6); var x = -700 + 820 * arrive + 1100 * leave; sco.style.left = x + 'px'; sco.style.transform = 'translateY(' + (Math.sin(t * 30) * (arrive < 1 || leave > 0 ? 3 : 0)) + 'px)';
var ru = clamp((t - tScan) / .35), bx = x + 330, by = 900; var tx = 90 + 20 + 2 * (cs + g) + cs / 2 + 150, ty = 470 + 20 + 1 * (cs + g) + cs / 2 + 40; rl.setAttribute('x1', bx); rl.setAttribute('y1', by); rl.setAttribute('x2', bx + (tx - bx) * eo(ru)); rl.setAttribute('y2', by + (ty - by) * eo(ru)); rl.setAttribute('opacity', ru > 0 && t < tScan + .9 ? 1 : 0);
show(hd, t, B[6] + .05, { d: .35, y: 40 }); show(ok, t, tScan + .45, { d: .3, y: 14 }); show(dl, t, B[6] + .3, { d: .3, y: 14 });
};
})();
/* =========================  H  WHAT REUTERS REPORTED 34.1 - 40.2  (10 MIN card, gauge, pay)  ========================= */
(function () {
var s = scene(7), el = s.el, tM = K('दस', 1, true), tMk = K('मार्केटिंग'), tRe = K('रॉटर्स'), tSp = K('सपीट'), tPay = K('कंपे');
E(el, 'fill', 'background:radial-gradient(ellipse at 30% 25%,#2b1030 0%,#07080f 70%)');
var g = svg(el, ''), arc = S(g, 'circle', { cx: 330, cy: 560, r: 190, fill: 'none', stroke: ORD, 'stroke-width': 24, 'stroke-linecap': 'round', transform: 'rotate(-90 330 560)' }); S(g, 'circle', { cx: 330, cy: 560, r: 190, fill: 'none', stroke: 'rgba(255,106,26,.2)', 'stroke-width': 24 });
var ten = E(el, 'big', 'left:210px;top:440px;font-size:250px;text-align:center;width:240px', '10'), mn = E(el, 'chip mono', 'left:262px;top:690px;color:' + ORD + ';font-size:28px;border:none;background:none', 'min');
var mk = E(el, 'chip mono', 'left:150px;top:810px;color:' + ALR + ';font-size:28px;background:' + ALR + ';color:#1a0010', 'not just marketing'), rep = E(el, 'chip mono', 'left:150px;top:150px;color:' + ORD + ';font-size:24px', '<i></i>reported · reuters · 13 jan 2026');
var card1 = E(el, 'glass', 'left:540px;top:380px;width:378px;height:250px;border-color:' + ALR, '<div style="position:absolute;left:24px;top:20px;font:700 22px JetBrains Mono;letter-spacing:.12em;color:' + ALR + '">RIDER SPEED</div>'), gs = svg(card1, '', '0 0 378 300');
S(gs, 'path', { d: 'M54 230 A135 135 0 0 1 324 230', fill: 'none', stroke: 'rgba(238,240,250,.25)', 'stroke-width': 18, 'stroke-linecap': 'round' }); var gv = S(gs, 'path', { d: 'M54 230 A135 135 0 0 1 324 230', fill: 'none', stroke: ALR, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-dasharray': '424 424' }), nd = S(gs, 'line', { x1: 189, y1: 230, x2: 189, y2: 120, stroke: OFF, 'stroke-width': 8, 'stroke-linecap': 'round' }); S(gs, 'circle', { cx: 189, cy: 230, r: 14, fill: OFF });
var card2 = E(el, 'glass', 'left:540px;top:650px;width:378px;height:250px;border-color:' + ALR, '<div style="position:absolute;left:24px;top:20px;font:700 22px JetBrains Mono;letter-spacing:.12em;color:' + ALR + '">PAY IF LATE</div><div style="position:absolute;left:34px;top:92px">' + ico('currency-rupee', 130, ALR, 1.5) + '</div><div style="position:absolute;left:210px;top:110px">' + ico('trending-down', 120, ALR, 1.5) + '</div><div style="position:absolute;left:24px;bottom:18px;font:700 20px JetBrains Mono;letter-spacing:.1em;color:rgba(238,240,250,.7)">MISSED DEADLINES</div>');
var ev1 = E(el, 'glass', 'left:150px;top:940px;width:768px;height:150px;border-color:' + ORD, '<div style="position:absolute;left:26px;top:28px">' + ico('calendar', 84, ORD, 1.5) + '</div><div style="position:absolute;left:140px;top:30px;font:700 44px Antonio;letter-spacing:.05em;color:' + OFF + '">CLOSED-DOOR MEETING</div><div style="position:absolute;left:140px;top:92px;font:700 22px JetBrains Mono;letter-spacing:.1em;color:' + ORD + '">LABOUR MINISTRY · REPORTED</div>');
var hd = E(el, 'big', 'left:150px;top:1112px;font-size:84px', 'The worry:<br>speed &amp; pay');
E(el, 'src', 'top:1298px', 'two unnamed sources · reported, not confirmed');
ev(tMk, 'slam'); ev(tSp, 'swell'); ev(tPay, 'drop');
E(el, 'vig', '');
s.r = function (t) {
var L = 2 * Math.PI * 190; arc.setAttribute('stroke-dasharray', L + ' ' + L); arc.setAttribute('stroke-dashoffset', L * ((t * .5) % 1));
show(ten, t, B[7] + .02, { d: .3, y: 30 }); show(mn, t, B[7] + .1, { d: .3, y: 20 }); show(mk, t, tMk, { d: .3, y: 0, s: .5 }); show(rep, t, tRe - .1, { d: .3, y: 20 });
show(card1, t, tRe + .3, { d: .4, y: 0, x: 140, s: .96 }); show(card2, t, tPay - .6, { d: .4, y: 0, x: 140, s: .96 });
var gu = eo((t - tSp) / .5), jit = t > tSp + .5 ? Math.sin(t * 40) * 1.2 : 0; nd.setAttribute('transform', 'rotate(' + (-70 + 140 * gu + jit) + ' 189 230)'); gv.setAttribute('stroke-dashoffset', 424 * (1 - gu));
show(hd, t, tSp - .2, { d: .35, y: 40 }); show(ev1, t, tRe + .1, { d: .38, y: 40 });
};
})();
/* =========================  I  THE SIGN CHANGES 40.2 - 43.65  ========================= */
(function () {
var s = scene(8), el = s.el, tB = K('ब्लिंकिट', 1), tG = K('ग्रोसरी'), tClock = K('घडी'), tSys = K('सिस्टम');
E(el, 'fill', 'background:linear-gradient(180deg,#0a0820,#05060c)');
E(el, 'abs', 'left:150px;top:640px;width:768px;height:1px;background:rgba(238,240,250,.15)');
var old = E(el, 'abs', 'left:150px;top:300px;width:768px;text-align:center;font:700 128px/.95 Antonio;color:' + ORD + ';text-shadow:0 0 40px rgba(255,106,26,.8);text-transform:uppercase;border:6px solid ' + ORD + ';border-radius:24px;padding:36px 20px;box-sizing:border-box;box-shadow:0 0 60px rgba(255,106,26,.4),inset 0 0 40px rgba(255,106,26,.3)', 'Grocery in<br>10 minutes');
var nw = E(el, 'abs', 'left:150px;top:700px;width:768px;text-align:center;font:700 128px/.95 Antonio;color:' + STK + ';text-shadow:0 0 40px rgba(198,255,26,.8);text-transform:uppercase;border:6px solid ' + STK + ';border-radius:24px;padding:36px 20px;box-sizing:border-box;box-shadow:0 0 60px rgba(198,255,26,.4),inset 0 0 40px rgba(198,255,26,.3)', 'Groceries<br>&amp; more');
var cb = E(el, 'chip mono', 'left:150px;top:150px;color:' + OFF + ';font-size:28px', '<i style="background:' + ORD + '"></i>Blinkit · tagline');
var cl = svg(el, '', '0 0 1080 1920'), ccx = 260, ccy = 1170; var face = S(cl, 'circle', { cx: ccx, cy: ccy, r: 90, fill: 'rgba(5,6,12,.8)', stroke: OFF, 'stroke-width': 6 }), hand = S(cl, 'line', { x1: ccx, y1: ccy, x2: ccx, y2: ccy - 66, stroke: ORD, 'stroke-width': 8, 'stroke-linecap': 'round' }), hand2 = S(cl, 'line', { x1: ccx, y1: ccy, x2: ccx + 40, y2: ccy, stroke: OFF, 'stroke-width': 8, 'stroke-linecap': 'round' });
var sysc = E(el, 'chip mono', 'left:420px;top:1140px;color:' + FEN + ';font-size:24px', '<i></i>same system');
E(el, 'src', 'top:1250px', 'tagline change: reported by reuters (wayback)');
ev(tG - .35, 'flick'); ev(tG, 'neon'); ev(tClock, 'tick'); ev(tSys, 'slam');
E(el, 'vig', '');
s.r = function (t) {
var offT = tG - .45, fl = t < offT ? 1 : (t < offT + .5 ? (hash(Math.floor(t * 30)) > .5 ? 1 : .15) : (t < offT + .9 ? .12 : 0)); old.style.opacity = t < B[8] + .05 ? 1 : fl * eo((t - B[8]) / .1);
var on = t < tG ? 0 : (t < tG + .45 ? (hash(Math.floor(t * 30) + 7) > .45 ? 1 : .2) : 1); nw.style.opacity = on;
show(cb, t, B[8] + .02, { d: .3, y: 20 });
var u = eio((t - tClock) / .5); hand.setAttribute('transform', 'rotate(' + (-u * 330 + 0) + ' ' + ccx + ' ' + ccy + ')'); hand2.setAttribute('transform', 'rotate(' + (-u * 60) + ' ' + ccx + ' ' + ccy + ')'); face.setAttribute('opacity', t < tClock - .3 ? 0 : 1); hand.setAttribute('opacity', t < tClock - .3 ? 0 : 1); hand2.setAttribute('opacity', t < tClock - .3 ? 0 : 1);
show(sysc, t, tSys, { d: .3, y: 0, s: .5 });
};
})();
/* =========================  J  THE SCALE 43.65 - 49.7  (night India + store lights + odometers)  ========================= */
(function () {
var s = scene(9), el = s.el, tSt = K('पौने'), tM = K('महिनों'), tV = K('करीब'), tR = K('रूपे');
var map = E(el, 'abs', 'left:0;top:300px;width:1080px;height:1112px;-webkit-mask-image:linear-gradient(180deg,transparent,#000 12%,#000 82%,transparent)');
var im = E(map, '', 'position:absolute;left:0;top:0;width:1080px;filter:brightness(1.35) contrast(1.1) saturate(1.4);transform-origin:50% 50%', '', 'img'); im.src = 'img/india-night.jpg';
var dv = svg(map, '', '0 0 1080 1112'), dots = DOTS.map(function (d, i) { return { e: S(dv, 'circle', { cx: d[0] * 1080, cy: d[1] * 1112, r: 0, fill: ORD }), t: tSt + hash(i + 2) * 1.4 }; });
var n1 = E(el, 'big', 'left:150px;top:210px;font-size:250px;color:' + ORD + ';text-shadow:0 0 60px rgba(255,106,26,.55)', '0'), l1 = E(el, 'chip mono', 'left:150px;top:140px;color:' + OFF + ';font-size:26px', '<i style="background:' + ORD + '"></i>blinkit dark stores'), d1 = E(el, 'chip mono', 'left:150px;top:458px;color:' + STK + ';font-size:26px', '+308 · jul-sep');
var n2 = E(el, 'big', 'left:150px;top:1040px;font-size:200px;color:' + STK + ';text-shadow:0 0 60px rgba(198,255,26,.5)', '₹0'), l2 = E(el, 'chip mono', 'left:150px;top:970px;color:' + OFF + ';font-size:26px', '<i style="background:' + STK + '"></i>order value'), d2 = E(el, 'chip mono', 'left:470px;top:970px;color:' + STK + ';font-size:26px;background:' + STK + ';border-color:' + STK + ';color:#0b0f00', '+79.3% yoy');
E(el, 'src', 'top:1275px', 'eternal q2 fy27 · 21 oct 2026 · reported');
ev(tSt, 'tick'); ev(tV, 'tick'); ev(tR, 'slam');
E(el, 'vig', '');
s.r = function (t) {
im.style.transform = 'scale(' + (1.02 + (t - B[9]) * .012) + ')';
dots.forEach(function (d) { var u = clamp((t - d.t) / .3); d.e.setAttribute('r', 5 * bk(u) + (u > 0 && u < 1 ? 5 : 0)); d.e.setAttribute('opacity', u * .9); });
var a = eo((t - tSt) / 1.0); n1.innerHTML = fmt(2751 * a); show(l1, t, B[9] + .02, { d: .3, y: 20 }); show(n1, t, B[9] + .02, { d: .3, y: 30 }); show(d1, t, tM, { d: .3, y: 14 });
var b = eo((t - tV) / 1.15); n2.innerHTML = '₹' + fmt(20940 * b) + '<span style="font-size:70px;margin-left:16px">cr</span>'; show(l2, t, tV - .3, { d: .3, y: 20 }); show(n2, t, tV - .3, { d: .3, y: 30 }); show(d2, t, tR, { d: .3, y: 0, s: .5 });
};
})();
/* =========================  K  END CARD 49.7 - 55.6  ========================= */
(function () {
var s = scene(10), el = s.el, tQ = K('क्या', 1), tCm = K('कमेंट'), tSd = K('संदेश'), tL = K('लाइक'), tSh = K('शेर'), tSb = K('सब्स्क्रेब');
E(el, 'fill', 'background:radial-gradient(ellipse at 50% 30%,#241046 0%,#07080f 72%)');
var rays = svg(el, ''), RY = []; for (var i = 0; i < 12; i++) RY.push(S(rays, 'polygon', { fill: i % 2 ? 'rgba(255,106,26,.07)' : 'rgba(123,77,255,.09)' }));
var tenC = svg(el, 'top:130px;height:560px', '0 0 1080 560'), arc = S(tenC, 'circle', { cx: 540, cy: 280, r: 170, fill: 'none', stroke: ORD, 'stroke-width': 22, 'stroke-linecap': 'round', transform: 'rotate(-90 540 280)' }); S(tenC, 'circle', { cx: 540, cy: 280, r: 170, fill: 'none', stroke: 'rgba(255,106,26,.2)', 'stroke-width': 22 });
var tx = S(tenC, 'text', { x: 540, y: 355, 'text-anchor': 'middle', fill: OFF, 'font-family': 'Antonio', 'font-weight': 700, 'font-size': 230 }); tx.textContent = '10';
var yes = E(el, 'abs', 'left:150px;top:720px;width:370px;height:130px;box-sizing:border-box;border:4px solid ' + STK + ';border-radius:20px;background:rgba(198,255,26,.14);display:flex;align-items:center;justify-content:center;font:700 62px Antonio;letter-spacing:.06em;color:' + STK, 'YES, BRING IT'), no = E(el, 'abs', 'left:548px;top:720px;width:370px;height:130px;box-sizing:border-box;border:4px solid ' + ALR + ';border-radius:20px;background:rgba(255,45,122,.14);display:flex;align-items:center;justify-content:center;font:700 62px Antonio;letter-spacing:.06em;color:' + ALR, 'NO, KEEP IT');
var cm = E(el, 'chip mono', 'left:150px;top:900px;color:' + OFF + ';font-size:26px', '<i style="background:' + ORD + '"></i>comment: <span id="kw" style="color:' + STK + '"></span><span id="cur" style="color:' + STK + '">▌</span>');
var pf = E(el, 'abs', 'left:150px;top:990px;width:210px;height:210px;border-radius:50%;border:8px solid ' + OFF + ';box-shadow:0 0 0 6px ' + ORD + ',0 0 60px 8px rgba(255,106,26,.5);overflow:hidden', '', 'div'); var pi = E(pf, '', 'width:100%;height:100%;object-fit:cover', '', 'img'); pi.src = 'img/profile.jpg';
var hn = E(el, 'abs', 'left:395px;top:1010px;font:700 64px Antonio;letter-spacing:.03em;color:' + OFF + ';white-space:nowrap', '@sandeshexplains'), sub = E(el, 'abs', 'left:395px;top:1100px;font:700 26px "JetBrains Mono";letter-spacing:.14em;color:' + ORD + ';text-transform:uppercase', 'Sandesh Explains');
var row = E(el, 'abs', 'left:150px;top:1230px;display:flex;gap:14px');
var btn = [['thumb-up', 'LIKE', ORD, tL], ['share', 'SHARE', FEN, tSh], ['bell-ringing', 'SUBSCRIBE', ALR, tSb]].map(function (c) { return { e: E(row, '', 'height:92px;padding:0 22px;border:4px solid ' + c[2] + ';border-radius:18px;background:rgba(8,10,22,.85);display:flex;align-items:center;gap:10px;font:700 30px "JetBrains Mono";letter-spacing:.04em;color:' + OFF + ';box-sizing:border-box', ico(c[0], 40, c[2], 1.7) + c[1]), t: c[3] }; });
ev(tQ, 'pop'); ev(tSd, 'whoosh'); ev(tL, 'pop'); ev(tSh, 'pop'); ev(tSb, 'pop');
E(el, 'vig', '');
var KW = 'YES';
s.r = function (t) {
var L = 2 * Math.PI * 170; arc.setAttribute('stroke-dasharray', L + ' ' + L); arc.setAttribute('stroke-dashoffset', L * ((t * .5) % 1));
RY.forEach(function (p, i) { var a = i / 12 * Math.PI * 2 + t * .08, a2 = a + .18; p.setAttribute('points', '540,400 ' + (540 + Math.cos(a) * 1600) + ',' + (400 + Math.sin(a) * 1600) + ' ' + (540 + Math.cos(a2) * 1600) + ',' + (400 + Math.sin(a2) * 1600)); });
show(yes, t, tQ + .35, { d: .3, y: 30 }); show(no, t, tQ + .5, { d: .3, y: 30 }); show(cm, t, tCm, { d: .3, y: 20 });
var kw = el.querySelector('#kw'), n = Math.floor(clamp((t - tCm - .2) / .5) * 3); kw.textContent = KW.slice(0, n); el.querySelector('#cur').style.opacity = (Math.floor(t * 2.2) % 2) ? .1 : 1;
show(pf, t, tQ + .9, { d: .4, y: 0, s: .5 }); show(hn, t, tQ + 1.0, { d: .35, y: 20 }); show(sub, t, tQ + 1.15, { d: .35, y: 14 });
btn.forEach(function (b) { show(b.e, t, b.t - .05, { d: .32, y: 0, s: .5 }); });
};
})();
/* =========================  persistent layers: caption rig, flash, ambient sweep, grain  ========================= */
var cap = E(ST, '', '', ''); cap.id = 'cap'; var fl = E(ST, '', '', ''); fl.id = 'flash'; var sw = E(ST, '', '', ''); sw.id = 'sweep'; E(ST, '', '', '').id = 'grain';
var CAPW = TM.cap, CAPOPT = { fs: 54, width: 768, lines: 2, chip: STK, chipInk: '#0b0f00', keywords: { geofence: '#b9a3ff', forecast: STK, minute: '#ff9a5c', reuters: '#ff9a5c', blinkit: '#ff9a5c', zepto: '#b9a3ff', eggs: '#ff6b9a' } };
function lerpC() { }
window.__seek = function (t) {
t = Math.max(0, Math.min(DUR - .001, t));
var cur = 0; for (var i = 0; i < B.length - 1; i++) if (t >= B[i]) cur = i;
scenes.forEach(function (s) {
var vis = (s.i === cur) || (s.i === cur - 1 && t < B[cur] + TR * .5), el = s.el;
el.style.display = vis ? 'block' : 'none'; if (!vis) return;
var u = t - B[cur];
if (s.i === cur) { var inT = s.i === 0 ? 1 : eo((u - TR * .45) / (TR * .55)); el.style.opacity = inT; el.style.zIndex = 2; el.style.transform = s.i === 0 ? '' : 'scale(' + (1.05 - .05 * inT) + ')'; }
else { var o = 1 - eo(u / (TR * .5)); el.style.opacity = o; el.style.zIndex = 1; el.style.transform = 'scale(' + (1 + .04 * eo(u / (TR * .5))) + ')'; }
s.r(Math.min(t, s.t1 + TR - .001));
});
fl.style.background = FL[cur]; fl.style.opacity = cur === 0 ? 0 : .38 * Math.sin(Math.PI * clamp((t - B[cur]) / TR));
sw.style.left = (-300 + ((t % 1.8) / 1.8) * 1700) + 'px';
cap.innerHTML = CAP.html(t, CAPW, CAPOPT);
};
window.__reelDurationSec = DUR; window.EV = EV; window.__B = B; window.__fixW = 0;
var A = Array.prototype; window.__ready = false;
Promise.all(['700 40px Antonio', '700 24px "JetBrains Mono"', '500 24px "JetBrains Mono"', '800 50px Inter'].map(function (f) { return document.fonts.load(f); }).concat(Array.prototype.map.call(document.images, function (im) { return im.decode ? im.decode().catch(function () { }) : 0; }))).then(function () { window.__ready = true; });
})();
