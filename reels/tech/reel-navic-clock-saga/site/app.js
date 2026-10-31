/* "The clock that broke India's GPS" — Ground Station. Every frame is a pure function of t (window.__seek). Times come from the voice (timing.js, TM). */
(function () {
var ST = document.getElementById('stage'), NS = 'http://www.w3.org/2000/svg';
var AMB = '#ffb020', SKY = '#55b8ff', RED = '#ff4a3d', IVO = '#f4efe3', BGC = '#031417';
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function eo(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function bk(x) { x = clamp(x); var c = 1.7; return Math.max(0, 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2)); }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
/* ---- cues from the voice ---- */
var SS = {}; TM.sentences.forEach(function (s) { SS[s.id] = s; });
function T0(id) { return SS[id].t0; } function T1(id) { return SS[id].t1; }
function PT(id, sub, n) { var b = TM.B[id], pos = -1; for (var c = 0; c <= (n || 0); c++) { pos = b.indexOf(sub, pos + 1); if (pos < 0) { window.__miss = (window.__miss || []).concat([id + ':' + sub]); return T0(id); } } return T0(id) + (T1(id) - T0(id)) * pos / b.length; }
var EV = []; function ev(t, k) { EV.push({ t: +t.toFixed(3), k: k }); return t; }
/* ---- DOM helpers ---- */
function E(p, cls, css, html, tag) { var e = document.createElement(tag || 'div'); if (cls) e.className = cls; if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; p.appendChild(e); return e; }
function S(p, tag, at) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); p.appendChild(e); return e; }
function svg(p, css, vb) { var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', vb || '0 0 1080 1920'); s.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;' + (css || ''); p.appendChild(s); return s; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.6) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
function show(el, t, t0, o) { o = o || {}; var d = o.d || .35, u = t - t0, k = o.bounce === false ? eo(u / d) : bk(u / d), a = eo(u / (d * .7)); el.style.opacity = u < 0 ? 0 : a * (o.max == null ? 1 : o.max); var y = (o.y == null ? 30 : o.y) * (1 - k), x = (o.x || 0) * (1 - k), s = 1 - (1 - (o.s == null ? .92 : o.s)) * (1 - k); el.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')'; }
function A(el, t, t0, d) { el.setAttribute('opacity', eo((t - t0) / (d || .3))); }
function img(p, src, css) { var i = E(p, '', css, '', 'img'); i.src = src; return i; }
function graticule(g, cy) { cy = cy || 1090; for (var i = -2; i < 14; i++) S(g, 'line', { x1: i * 100, y1: 0, x2: i * 100 - 240, y2: 1920, stroke: 'rgba(85,184,255,.09)', 'stroke-width': 2 }); for (var j = 0; j < 24; j++) S(g, 'line', { x1: 0, y1: j * 90, x2: 1080, y2: j * 90, stroke: 'rgba(85,184,255,.07)', 'stroke-width': 2 }); [180, 330, 490, 660, 850].forEach(function (r) { S(g, 'circle', { cx: 540, cy: cy, r: r, fill: 'none', stroke: 'rgba(85,184,255,.13)', 'stroke-width': 2, 'stroke-dasharray': '6 10' }); }); }
/* a clock dial (SVG): update(angleDeg, state) state 1 ok (amber) / 0 dead (grey + red cross) */
function dial(p, cx, cy, r) { var g = S(p, 'g', {}); var face = S(g, 'circle', { cx: cx, cy: cy, r: r, fill: BGC, stroke: AMB, 'stroke-width': Math.max(3, r / 12) }); for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; S(g, 'line', { x1: cx + Math.sin(a) * r * .8, y1: cy - Math.cos(a) * r * .8, x2: cx + Math.sin(a) * r * .94, y2: cy - Math.cos(a) * r * .94, stroke: AMB, 'stroke-width': Math.max(2, r / 20) }); } var h = S(g, 'line', { x1: cx, y1: cy, x2: cx, y2: cy - r * .72, stroke: AMB, 'stroke-width': Math.max(4, r / 10), 'stroke-linecap': 'round' }); var hub = S(g, 'circle', { cx: cx, cy: cy, r: r / 9, fill: AMB }); var x1 = S(g, 'line', { x1: cx - r * .5, y1: cy - r * .5, x2: cx + r * .5, y2: cy + r * .5, stroke: RED, 'stroke-width': Math.max(5, r / 8), 'stroke-linecap': 'round', opacity: 0 }), x2 = S(g, 'line', { x1: cx + r * .5, y1: cy - r * .5, x2: cx - r * .5, y2: cy + r * .5, stroke: RED, 'stroke-width': Math.max(5, r / 8), 'stroke-linecap': 'round', opacity: 0 });
return { g: g, set: function (ang, ok) { h.setAttribute('transform', 'rotate(' + ang + ' ' + cx + ' ' + cy + ')'); var col = ok ? AMB : 'rgba(244,239,227,.28)'; face.setAttribute('stroke', ok ? AMB : 'rgba(244,239,227,.3)'); h.setAttribute('stroke', col); hub.setAttribute('fill', col); x1.setAttribute('opacity', ok ? 0 : 1); x2.setAttribute('opacity', ok ? 0 : 1); } }; }
/* ---- scene boundaries sit in the silences between voice groups ---- */
var END = TM.end;
var B = [0, T0('p1') - .05, T0('i1') - .12, T1('i2') + .4, T1('i5') + .5, T1('i6') + .5, T1('b2') + .4, T1('b4') + .4, T1('d2') + .45, T0('t1') - .1, T0('t3') - .1, T1('t3') + .45, T1('y3') + .3, T1('y4') + .5, END];
var DUR = END, TR = .3, scenes = [];
var FL = [AMB, SKY, SKY, AMB, SKY, RED, RED, RED, SKY, AMB, AMB, SKY, AMB, SKY];
function scene(i) { var el = E(ST, 'scene', ''); var o = { i: i, t0: B[i], t1: B[i + 1], el: el }; scenes.push(o); return o; }
var DOT = [540, 1090], SATP = [[190, 700], [540, 610], [890, 700], [930, 930]];
function satImg(p, x, y, w, extra) { var h = w * SATD[1] / SATD[0]; return img(p, 'img/sat.png', 'position:absolute;left:' + (x - w / 2) + 'px;top:' + (y - h / 2) + 'px;width:' + w + 'px;' + (extra || '')); }
/* ===== 1 HOOK ===== */
(function () {
var s = scene(0), el = s.el; var bg = img(el, 'img/india-night.jpg', 'position:absolute;left:0;top:780px;width:1080px;opacity:.42;filter:saturate(1.2);-webkit-mask-image:linear-gradient(180deg,transparent,#000 22%,#000 70%,transparent)');
var g = svg(el, ''); graticule(g);
var err = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 240, fill: 'rgba(255,74,61,.13)', stroke: RED, 'stroke-width': 5, 'stroke-dasharray': '14 10' }), dot = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 16, fill: IVO }), halo = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 16, fill: 'none', stroke: IVO, 'stroke-width': 3 });
var rays = [], sats = [];
SATP.forEach(function (p, i) { var on = i < 3; rays.push(S(g, 'line', { x1: p[0], y1: p[1], x2: DOT[0], y2: DOT[1], stroke: on ? SKY : AMB, 'stroke-width': on ? 4 : 3, 'stroke-dasharray': on ? '0' : '10 12' })); if (on) sats.push(satImg(el, p[0], p[1], 230)); else { var ring = S(g, 'circle', { cx: p[0], cy: p[1], r: 40, fill: 'none', stroke: AMB, 'stroke-width': 5, 'stroke-dasharray': '8 8' }); sats.push(ring); } });
var n4 = E(el, 'big', 'left:150px;top:200px;font-size:330px;color:' + AMB, '4'), l4 = E(el, 'mono', 'left:160px;top:520px;color:' + AMB + ';font-size:40px', 'needed'), n3 = E(el, 'big', 'left:560px;top:200px;font-size:330px;color:' + RED, '3'), l3 = E(el, 'mono', 'left:570px;top:520px;color:' + RED + ';font-size:36px', 'working now');
var tg = E(el, 'tag', 'left:150px;top:140px;color:' + SKY + ';font-size:22px', 'NavIC · India\'s own GPS'), q1 = E(el, 'tag', 'left:620px;top:960px;color:' + AMB, 'why four?'), q2 = E(el, 'tag', 'left:480px;top:1230px;color:' + SKY + ';font-size:22px', 'where did the others go?'), src = E(el, 'src', 'top:1290px', 'parliament replies via the week, 2026');
var t4 = PT('h1', 'चार'), t3 = T0('h2') + .25, tq = T0('h3'), tq2 = PT('h3', 'बाक़ी'); ev(t4, 'slam'); ev(t3, 'slam'); ev(tq, 'ping');
E(el, 'vig', '');
s.r = function (t) {
err.setAttribute('r', 240 + 12 * Math.sin(t * 3)); err.setAttribute('stroke-dashoffset', -t * 30); var ph = (t * .9) % 1; halo.setAttribute('r', 16 + ph * 60); halo.setAttribute('opacity', 1 - ph);
sats.forEach(function (e, i) { var u = eo((t + .4 - .05 * i) / .3); if (e.tagName === 'circle') e.setAttribute('opacity', .4 + .5 * Math.abs(Math.sin(t * 4))); else e.style.opacity = u; });
rays.forEach(function (r, i) { r.setAttribute('opacity', i < 3 ? .9 * eo((t + .4) / .3) : .35 + .35 * Math.sin(t * 5)); });
show(n4, t, -.5, { d: .3, y: 40, s: .6 }); show(l4, t, -.45, { d: .25, y: 20 }); show(n3, t, t3, { d: .3, y: 40, s: .6 }); show(l3, t, t3 + .1, { d: .25, y: 20 }); show(tg, t, -.5, { d: .2, y: 0 }); show(q1, t, tq, { d: .3, y: 20 }); show(q2, t, tq2, { d: .3, y: 20 }); show(src, t, 1.5, { d: .3, y: 10 });
};
})();
/* ===== 2 PLANT: NavIC and the promised clock ===== */
(function () {
var s = scene(1), el = s.el, tP = PT('p3', 'एक चीज़'), tEnd = PT('p3', 'आख़िर');
var bg = img(el, 'img/earth-a.png', 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:50% 45%');
var g = svg(el, ''); S(g, 'ellipse', { cx: 540, cy: 820, rx: 520, ry: 250, transform: 'rotate(-16 540 820)', fill: 'none', stroke: 'rgba(85,184,255,.7)', 'stroke-width': 4, 'stroke-dasharray': '10 12' });
var SP = [[170, 700], [800, 560], [940, 980]], sats = SP.map(function (p, i) { var im = satImg(el, p[0], p[1], 210); return im; }), rings = SP.map(function (p) { return S(g, 'circle', { cx: p[0], cy: p[1], r: 30, fill: 'none', stroke: SKY, 'stroke-width': 3 }); });
var nw = satImg(el, 560, 330, 280, 'filter:drop-shadow(0 0 24px rgba(255,176,32,.8))');
var hd = E(el, 'big', 'left:150px;top:190px;font-size:170px', 'NavIC'), tg = E(el, 'tag', 'left:150px;top:380px;color:' + SKY + ';font-size:22px', 'illustrative orbits'), cc = E(el, 'abs', 'left:150px;top:1060px;width:190px;height:190px;border-radius:50%;border:5px solid ' + AMB + ';background:rgba(3,20,23,.85);display:flex;align-items:center;justify-content:center;box-shadow:0 0 50px rgba(255,176,32,.55)', ico('clock', 110, AMB, 1.5)), tl = E(el, 'tag', 'left:380px;top:1120px;color:' + AMB + ';font-size:22px', 'made by hand · first time'), tw = E(el, 'tag', 'left:380px;top:1180px;color:' + IVO + ';font-size:20px', 'what it can\'t do yet → end');
var tNew = T0('p3') + .2; ev(tNew, 'whoosh'); ev(tP, 'pop');
E(el, 'vig', '');
s.r = function (t) {
bg.style.transform = 'scale(' + (1 + (t - B[1]) * .014) + ')'; sats.forEach(function (e, i) { e.style.opacity = eo((t - B[1] - .1 * i) / .4); }); rings.forEach(function (r, i) { var ph = (t * .8 + i * .3) % 1; r.setAttribute('r', 30 + ph * 50); r.setAttribute('opacity', (1 - ph) * .8); });
var u = eo((t - tNew) / .9); nw.style.opacity = u; nw.style.transform = 'translate(' + ((1 - u) * 520) + 'px,' + (-(1 - u) * 80) + 'px) scale(' + (.8 + .2 * u) + ')';
show(hd, t, B[1] + .02, { d: .35, y: 40 }); show(tg, t, B[1] + .4, { d: .3, y: 10 }); show(cc, t, tP, { d: .4, y: 0, s: .4 }); show(tl, t, tP + .15, { d: .3, y: 10 }); show(tw, t, tEnd - .1, { d: .3, y: 10 });
var pu = (t - tP) % 1.2; cc.style.boxShadow = '0 0 ' + (50 + 30 * Math.sin(t * 5)) + 'px rgba(255,176,32,.6)';
};
})();
/* ===== 3 SIGNAL: a satellite only says "I sent this at this moment" ===== */
(function () {
var s = scene(2), el = s.el, tSend = PT('i2', 'बस एक'), tMoment = PT('i2', 'इस पल');
var g = svg(el, ''); graticule(g, 1000);
var sat = satImg(el, 330, 400, 560);
var dial0 = dial(g, 880, 300, 90);
var dot = S(g, 'circle', { cx: 760, cy: 1000, r: 18, fill: IVO }), ph = S(g, 'circle', { cx: 760, cy: 1000, r: 18, fill: 'none', stroke: IVO, 'stroke-width': 3 });
var waves = [0, 1, 2, 3].map(function () { return S(g, 'circle', { cx: 330, cy: 420, r: 10, fill: 'none', stroke: SKY, 'stroke-width': 4 }); }), pk = E(el, 'tag', 'left:0;top:0;color:' + AMB, 't = 10:00:00.000');
var hd = E(el, 'big', 'left:150px;top:1130px;font-size:90px', 'Only a timestamp'), t4 = E(el, 'tag', 'left:150px;top:140px;color:' + SKY + ';font-size:22px', 'why four? step 1');
var tPh = E(el, 'mono', 'left:640px;top:1040px;color:' + IVO + ';font-size:26px', 'your phone');
ev(tSend, 'whoosh'); ev(tSend + 1.0, 'ping');
E(el, 'vig', '');
s.r = function (t) {
var u0 = B[2]; sat.style.opacity = eo((t - u0) / .35); dial0.set((t - u0) * 70, 1); dial0.g.setAttribute('opacity', eo((t - u0 - .1) / .3));
waves.forEach(function (w, i) { var x = ((t - tSend) * .55 + i * .25); if (t < tSend) x = -1; var f = x % 1; w.setAttribute('r', 10 + f * 520); w.setAttribute('opacity', x < 0 ? 0 : (1 - f) * .85); });
var f = clamp((t - tSend) / 1.0), px = 330 + (760 - 330) * eo(f), py = 420 + (1000 - 420) * eo(f); pk.style.left = (px - 150) + 'px'; pk.style.top = (py - 20) + 'px'; pk.style.opacity = t < tSend ? 0 : (f >= 1 ? 1 - clamp((t - tSend - 1.0) / .4) * .5 : 1);
var pu = (t * .9) % 1; ph.setAttribute('r', 18 + pu * 60); ph.setAttribute('opacity', 1 - pu);
show(hd, t, B[2] + .15, { d: .35, y: 30 }); show(t4, t, B[2] + .05, { d: .3, y: 0 }); show(tPh, t, B[2] + .3, { d: .3, y: 10 });
};
})();
/* ===== 4 LIGHT: 30 cm per nanosecond, 300 m per microsecond ===== */
(function () {
var s = scene(3), el = s.el, tNs = PT('i3', 'नैनोसेकंड'), tUs = PT('i5', 'माइक्रो'), tM = PT('i5', 'तीन सौ');
var g = svg(el, ''); graticule(g, 1400);
var rl = S(g, 'line', { x1: 170, y1: 380, x2: 910, y2: 380, stroke: IVO, 'stroke-width': 5 }); for (var i = 0; i <= 10; i++) S(g, 'line', { x1: 170 + i * 74, y1: 360, x2: 170 + i * 74, y2: i % 5 ? 395 : 410, stroke: IVO, 'stroke-width': 3 });
var ph = S(g, 'circle', { cx: 170, cy: 380, r: 20, fill: AMB }), tr = S(g, 'line', { x1: 170, y1: 380, x2: 170, y2: 380, stroke: AMB, 'stroke-width': 8, 'stroke-linecap': 'round' });
var lab0 = E(el, 'mono', 'left:150px;top:440px;color:' + IVO + ';font-size:22px', '0'), lab1 = E(el, 'mono', 'left:820px;top:440px;color:' + AMB + ';font-size:26px', '30 cm'), k1 = E(el, 'tag', 'left:150px;top:200px;color:' + AMB + ';font-size:40px', '1 ns = 30 cm'), k2 = E(el, 'tag', 'left:150px;top:520px;color:' + RED + ';font-size:40px;text-transform:none', '1 µs = 300 m');
// street map: blocks, true position vs the position the phone reports
var bx = 150, by = 640, bw = 768, bh = 560; var mp = S(g, 'rect', { x: bx, y: by, width: bw, height: bh, rx: 10, fill: 'rgba(3,20,23,.85)', stroke: 'rgba(85,184,255,.5)', 'stroke-width': 3 });
for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) S(g, 'rect', { x: bx + 24 + c * 122, y: by + 26 + r * 134, width: 98, height: 108, fill: 'rgba(85,184,255,.10)', stroke: 'rgba(85,184,255,.25)', 'stroke-width': 2 });
var real = S(g, 'circle', { cx: 330, cy: 930, r: 16, fill: IVO }), rep = S(g, 'circle', { cx: 330, cy: 930, r: 16, fill: RED }), lk = S(g, 'line', { x1: 330, y1: 930, x2: 330, y2: 930, stroke: RED, 'stroke-width': 5, 'stroke-dasharray': '8 8' }), lr = E(el, 'mono', 'left:340px;top:960px;color:' + IVO + ';font-size:22px', 'you'), lp = E(el, 'mono', 'left:0;top:0;color:' + RED + ';font-size:22px', 'phone says');
var od = E(el, 'big', 'left:560px;top:1180px;font-size:70px;color:' + RED, '0 m');
ev(tNs, 'ping'); ev(tUs, 'tick'); ev(tM, 'slam');
E(el, 'vig', '');
s.r = function (t) {
var u = ((t - tNs) * .8) % 1; var f = t < tNs - .2 ? 0 : eio(u); ph.setAttribute('cx', 170 + 740 * f); tr.setAttribute('x2', 170 + 740 * f); ph.setAttribute('opacity', eo((t - B[3]) / .3));
show(k1, t, tNs - .2, { d: .3, y: 20 }); show(lab0, t, B[3] + .1, { d: .2, y: 0 }); show(lab1, t, tNs, { d: .3, y: 0 });
var d = eio((t - tM) / .8); var nx = 330 + 300 * d, ny = 930 - 40 * d; rep.setAttribute('cx', nx); rep.setAttribute('cy', ny); lk.setAttribute('x2', nx); lk.setAttribute('y2', ny); lk.setAttribute('opacity', d > 0 ? 1 : 0); rep.setAttribute('opacity', eo((t - tUs) / .3)); real.setAttribute('opacity', 1);
lp.style.left = (nx + 24) + 'px'; lp.style.top = (ny - 40) + 'px'; lp.style.opacity = d > .2 ? 1 : 0; show(lr, t, B[3] + .2, { d: .3, y: 0 }); show(k2, t, tUs, { d: .35, y: 20 }); od.innerHTML = fmt(300 * d) + ' m'; show(od, t, tUs, { d: .3, y: 20 });
};
})();
/* ===== 5 PROOF OBJECT: four rays fix the clock ===== */
(function () {
var s = scene(4), el = s.el, t3 = PT('i6', 'तीन'), tIf = PT('i6', 'अगर'), tNo = PT('i6', 'वो नहीं'), tFour = PT('i6', 'चौथा');
var g = svg(el, ''); graticule(g);
var er = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 240, fill: 'rgba(255,176,32,.10)', stroke: AMB, 'stroke-width': 5 }), ghost = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 8, fill: 'none', stroke: IVO, 'stroke-width': 3, 'stroke-dasharray': '4 6' });
var dot = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 16, fill: IVO }), halo = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 16, fill: 'none', stroke: IVO, 'stroke-width': 3 });
var rays = [], sats = [], dials = [];
SATP.forEach(function (p, i) { rays.push(S(g, 'line', { x1: p[0], y1: p[1], x2: DOT[0], y2: DOT[1], stroke: SKY, 'stroke-width': 4 })); sats.push(satImg(el, p[0], p[1], 230)); dials.push(dial(g, p[0], p[1] - 100, 38)); });
var pc = E(el, 'abs', 'left:700px;top:1120px;width:90px;height:90px;border-radius:50%;border:4px solid ' + RED + ';background:rgba(3,20,23,.85);display:flex;align-items:center;justify-content:center', ico('clock', 54, RED, 1.6)), tp = E(el, 'tag', 'left:640px;top:1230px;color:' + RED + ';font-size:20px', 'phone clock?');
var hd = E(el, 'big', 'left:150px;top:190px;font-size:116px', 'The fourth ray<br>fixes the clock'), t4 = E(el, 'tag', 'left:150px;top:1215px;color:' + AMB + ';font-size:26px', '4th ray = the clock'), t1 = E(el, 'tag', 'left:150px;top:1230px;color:' + SKY + ';font-size:22px', '3 rays: a ring, not a point');
var ta = [t3, t3 + .35, t3 + .7, tFour]; ev(ta[0], 'ping'); ev(ta[1], 'ping'); ev(ta[2], 'ping'); ev(tNo, 'buzz'); ev(tFour, 'slam');
E(el, 'vig', '');
s.r = function (t) {
var RAD = [240, 190, 110, 8]; var r = 240; for (var k = 0; k < 4; k++) { var u = eo((t - ta[k]) / .6); r = r + ((k == 3 ? RAD[3] : (k == 2 ? 104 : RAD[k])) - r) * u; rays[k].setAttribute('opacity', k == 3 ? eo((t - ta[3]) / .4) : .9 * eo((t - ta[k] + .25) / .3)); sats[k].style.opacity = eo((t - B[4] - .1 * k) / .4); dials[k].set((t - B[4]) * 60 * (k + 1), 1); }
var pulse = t > tNo && t < tFour ? 6 * Math.sin(t * 7) : 0; er.setAttribute('r', Math.max(r + pulse, 7)); er.setAttribute('stroke', t < tFour ? AMB : SKY); er.setAttribute('fill', t < tFour ? 'rgba(255,176,32,.10)' : 'rgba(85,184,255,.16)');
ghost.setAttribute('r', 8 + 20 * eo((t - tIf) / .3)); ghost.setAttribute('opacity', t > tIf && t < tNo ? .9 : 0); var p2 = (t * .9) % 1; halo.setAttribute('r', 16 + p2 * 60); halo.setAttribute('opacity', 1 - p2);
show(hd, t, B[4] + .05, { d: .35, y: 30 }); show(t1, t, ta[2] + .5, { d: .3, y: 10, max: t > tFour ? .0 : 1 }); show(pc, t, tNo - .1, { d: .3, y: 0, s: .5 }); show(tp, t, tNo, { d: .3, y: 10 }); show(t4, t, tFour + .3, { d: .3, y: 10 });
if (t > tFour) { t1.style.opacity = 0; pc.style.opacity = Math.max(0, 1 - (t - tFour) * 3); tp.style.opacity = Math.max(0, 1 - (t - tFour) * 3); }
};
})();
/* ===== 6 BUT: the clocks fail ===== */
(function () {
var s = scene(5), el = s.el, tY = PT('b2', 'सोलह'), tOne = PT('b2', 'तीनों'), tImp = PT('b2', 'विदेश');
var g = svg(el, ''); graticule(g, 900);
var sat = satImg(el, 540, 480, 720, 'filter:grayscale(.2)');
var ds = [[210, 1000], [540, 1000], [870, 1000]].map(function (p) { return dial(g, p[0], p[1], 105); });
var lb = ['CLOCK 1', 'CLOCK 2', 'CLOCK 3'].map(function (n, i) { return E(el, 'mono', 'left:' + (150 + i * 330) + 'px;top:1140px;color:' + IVO + ';font-size:22px', n); });
var hd = E(el, 'big', 'left:150px;top:190px;font-size:130px', 'IRNSS-1A'), yr = E(el, 'tag', 'left:150px;top:380px;color:' + RED, '2016 →'), im = E(el, 'tag', 'left:430px;top:380px;color:' + AMB, 'bought abroad');
var tt = [tOne, tOne + (T1('b2') - tOne) * .32, tOne + (T1('b2') - tOne) * .55]; tt.forEach(function (x) { ev(x, 'tick'); ev(x + .05, 'stop'); });
E(el, 'vig', '');
s.r = function (t) {
sat.style.opacity = eo((t - B[5]) / .4); ds.forEach(function (d, i) { var ok = t < tt[i]; d.set(ok ? (t - B[5]) * 90 * (i + 1) : (tt[i] - B[5]) * 90 * (i + 1) + 8 * Math.sin((t - tt[i]) * 30) * Math.exp(-(t - tt[i]) * 6), ok); d.g.setAttribute('opacity', eo((t - B[5] - .15 * i) / .3)); show(lb[i], t, B[5] + .15 * i, { d: .3, y: 10 }); });
show(hd, t, B[5] + .02, { d: .3, y: 30 }); show(yr, t, tY, { d: .3, y: 10 }); show(im, t, tImp, { d: .3, y: 10 });
};
})();
/* ===== 7 BUT: rocket does not separate / NVS-02 misses its orbit ===== */
(function () {
var s = scene(6), el = s.el, tR = PT('b3', 'पर अगस्त'), tV = PT('b4', 'पर इंजन');
var g = svg(el, ''); graticule(g, 1000);
var rk = img(el, 'img/rocket.png', 'position:absolute;left:150px;top:150px;width:400px;height:800px;transform-origin:50% 90%');
var tg1 = E(el, 'tag', 'left:540px;top:230px;color:' + RED, 'aug 2017 · IRNSS-1H'), tg2 = E(el, 'tag', 'left:540px;top:290px;color:' + RED + ';font-size:22px', 'did not separate');
var orb = S(g, 'ellipse', { cx: 700, cy: 1000, rx: 330, ry: 140, fill: 'none', stroke: 'rgba(85,184,255,.6)', 'stroke-width': 4, 'stroke-dasharray': '10 12' }), wr = S(g, 'ellipse', { cx: 700, cy: 1070, rx: 250, ry: 80, fill: 'none', stroke: RED, 'stroke-width': 5 }), st = satImg(el, 520, 1100, 210);
var h2 = E(el, 'big', 'left:150px;top:960px;font-size:100px', ''); var q2 = E(el, 'tag', 'left:560px;top:790px;color:' + AMB, 'jan 2025 · NVS-02'), q3 = E(el, 'tag', 'left:560px;top:850px;color:' + RED + ';font-size:22px', 'valve · wrong orbit');
var earth = S(g, 'circle', { cx: 700, cy: 1000, r: 70, fill: '#0b3a52', stroke: SKY, 'stroke-width': 3 });
ev(tR, 'whoosh'); ev(tR + 1.0, 'thud'); ev(tV, 'thud');
E(el, 'vig', '');
s.r = function (t) {
var u = eio((t - B[6]) / 1.3), up = t < tR + .8 ? 1 : 0; rk.style.transform = 'translateY(' + (320 * (1 - u)) + 'px) scale(' + (.9 + .1 * u) + ')'; rk.style.opacity = eo((t - B[6]) / .3) * (t < tV - .3 ? 1 : Math.max(.15, 1 - (t - tV + .3) * 2));
var fl = t > tR + .8 ? Math.sin(t * 40) * 6 : 0; rk.style.left = (150 + fl) + 'px';
show(tg1, t, tR, { d: .3, y: 10 }); show(tg2, t, tR + .8, { d: .3, y: 10 });
orb.setAttribute('opacity', eo((t - tV + .6) / .3)); wr.setAttribute('opacity', eo((t - tV) / .4)); earth.setAttribute('opacity', eo((t - tV + .6) / .3)); var a = t * 1.1; st.style.opacity = eo((t - tV) / .3); st.style.left = (700 + 250 * Math.cos(a) - 75) + 'px'; st.style.top = (1070 + 80 * Math.sin(a) - 54) + 'px';
show(q2, t, tV - .3, { d: .3, y: 10 }); show(q3, t, tV + .3, { d: .3, y: 10 });
};
})();
/* ===== 8 DARK MOMENT: 13 March 2026 ===== */
(function () {
var s = scene(7), el = s.el, tD = PT('d1', 'तेरह'), tQ = PT('d1', 'इसरो'), tP = T0('d2'), tF = PT('d2', 'सिर्फ़');
var g = svg(el, ''); graticule(g, 800);
var d = dial(g, 540, 520, 230); var date = E(el, 'big', 'left:150px;top:820px;font-size:130px;color:' + RED, '12 MAR'), tg = E(el, 'tag', 'left:150px;top:190px;color:' + SKY + ';font-size:22px', 'IRNSS-1F · launched 2016');
var qd = E(el, 'scope', 'left:150px;top:980px;width:768px;height:170px', '<div style="position:absolute;left:28px;top:22px;font:700 22px IBM Plex Mono;letter-spacing:.12em;color:' + AMB + '">ISRO · IN ITS OWN WORDS</div><div style="position:absolute;left:28px;top:66px;right:28px;font:700 36px/1.25 Inter;color:' + IVO + '">"procured on-board atomic clock stopped functioning"</div>');
var pr = E(el, 'scope', 'left:150px;top:1180px;width:768px;height:100px', '<div style="position:absolute;left:28px;top:24px;font:700 32px IBM Plex Mono;letter-spacing:.08em;color:' + IVO + '">PARLIAMENT: <span style="color:' + AMB + '">≥ 4 NEEDED</span> · <span style="color:' + RED + '">3 LEFT</span></div>');
ev(tD, 'tick'); ev(tD + .5, 'stop'); ev(tP, 'drop');
E(el, 'vig', '');
s.r = function (t) {
var ok = t < tD + .35; d.set(ok ? (t - B[7]) * 120 : (tD + .35 - B[7]) * 120, ok); d.g.setAttribute('opacity', eo((t - B[7]) / .3));
var dd = Math.min(13, 12 + eo((t - tD) / .35) + (t > tD ? 0 : 0)); date.innerHTML = (t > tD ? '13' : '12') + ' MAR 2026'; show(date, t, B[7] + .2, { d: .3, y: 20 }); show(tg, t, B[7] + .05, { d: .3, y: 0 }); show(qd, t, tQ, { d: .4, y: 0, x: 120, s: .96 }); show(pr, t, tP, { d: .4, y: 0, x: 120, s: .96 });
var dim = clamp((t - (T1('d2') - .2)) / .4); el.style.filter = 'brightness(' + (1 - .55 * dim) + ')';
};
})();
/* ===== 9 HONEST NOTE: the phone map kept working ===== */
(function () {
var s = scene(8), el = s.el, tR = PT('d3', 'रुका'), tSys = PT('d3', 'कई');
var g = svg(el, ''); graticule(g, 1000);
var SP = 1.0, PX = 330, PY = 330; var ph = E(el, 'abs', 'left:' + PX + 'px;top:' + PY + 'px;width:' + (PHONE.w * SP) + 'px;height:' + (PHONE.h * SP) + 'px;'); var pimg = img(ph, 'img/phone.png', 'position:absolute;left:0;top:0;width:100%;height:100%');
var q = ['tl', 'tr', 'br', 'bl'].map(function (k) { return [PHONE[k][0] * SP, PHONE[k][1] * SP]; }); function homog(w, h, q) { var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1]; var dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3; var den = dx1 * dy2 - dy1 * dx2, a13 = (dx3 * dy2 - dy3 * dx2) / den, a23 = (dx1 * dy3 - dy1 * dx3) / den; var a11 = x1 - x0 + a13 * x1, a21 = x3 - x0 + a23 * x3, a12 = y1 - y0 + a13 * y1, a22 = y3 - y0 + a23 * y3; return 'matrix3d(' + [a11 / w, a12 / w, 0, a13 / w, a21 / h, a22 / h, 0, a23 / h, 0, 0, 1, 0, x0, y0, 0, 1].join(',') + ')'; }
var SW = 400, SH = 860, scr = E(ph, 'abs', 'left:0;top:0;width:' + SW + 'px;height:' + SH + 'px;transform-origin:0 0;transform:' + homog(SW, SH, q) + ';background:#05242b;overflow:hidden;border-radius:26px'); var sg = svg(scr, '', '0 0 400 860');
for (var i = 0; i < 9; i++) { S(sg, 'line', { x1: 0, y1: i * 100, x2: 400, y2: i * 100 - 40, stroke: 'rgba(85,184,255,.25)', 'stroke-width': 3 }); S(sg, 'line', { x1: i * 60, y1: 0, x2: i * 60 + 40, y2: 860, stroke: 'rgba(85,184,255,.25)', 'stroke-width': 3 }); }
S(sg, 'path', { d: 'M20 700 C120 600 160 460 220 360 C260 300 320 250 380 180', fill: 'none', stroke: SKY, 'stroke-width': 10, 'stroke-linecap': 'round' }); var pd = S(sg, 'circle', { cx: 220, cy: 360, r: 20, fill: IVO, stroke: SKY, 'stroke-width': 8 }), ph2 = S(sg, 'circle', { cx: 220, cy: 360, r: 20, fill: 'none', stroke: SKY, 'stroke-width': 4 });
var c1 = E(el, 'tag', 'left:150px;top:1050px;color:' + SKY, 'phone map: running'), c2 = E(el, 'tag', 'left:150px;top:1110px;color:' + SKY + ';font-size:22px', 'several systems at once'), c3 = E(el, 'tag', 'left:150px;top:1170px;color:' + RED + ';font-size:26px', 'NavIC standing alone: paused'), hd = E(el, 'big', 'left:150px;top:190px;font-size:96px', 'Your map<br>kept working');
ev(tSys, 'ping'); ev(tR, 'drop');
E(el, 'vig', '');
s.r = function (t) {
ph.style.opacity = eo((t - B[8]) / .4); ph.style.transform = 'translateY(' + ((1 - bk((t - B[8]) / .6)) * 120) + 'px)'; var p = (t * .9) % 1; ph2.setAttribute('r', 20 + p * 50); ph2.setAttribute('opacity', 1 - p);
show(hd, t, B[8] + .05, { d: .35, y: 30 }); show(c1, t, B[8] + .5, { d: .3, y: 10 }); show(c2, t, tSys, { d: .3, y: 10 }); show(c3, t, tR, { d: .3, y: 10 });
};
})();
/* ===== 10 TURN: India makes its own clock ===== */
(function () {
var s = scene(9), el = s.el, tB = PT('t1', 'ख़ुद'), tA = PT('t2', 'अहमदाबाद'), tN = PT('t2', 'एनवीएस');
var g = svg(el, ''); graticule(g, 900);
var sat = satImg(el, 540, 640, 760);
var d = dial(g, 540, 1110, 140), glow = S(g, 'circle', { cx: 540, cy: 1110, r: 190, fill: 'none', stroke: AMB, 'stroke-width': 4, opacity: .6 });
var hd = E(el, 'big', 'left:150px;top:190px;font-size:116px', 'Our own<br>clock'), a1 = E(el, 'tag', 'left:150px;top:850px;color:' + AMB, 'Ahmedabad · Space Applications Centre'), a2 = E(el, 'tag', 'left:150px;top:910px;color:' + SKY + ';font-size:22px', 'rubidium clock · NVS-01 · 2023');
ev(tB, 'neon'); ev(tA, 'ping'); ev(tN, 'pop');
E(el, 'vig', '');
s.r = function (t) {
sat.style.opacity = eo((t - B[9]) / .4); d.set((t - B[9]) * 140, 1); d.g.setAttribute('opacity', eo((t - B[9] - .2) / .4)); glow.setAttribute('opacity', .3 + .3 * Math.sin(t * 4)); glow.setAttribute('r', 160 + 30 * ((t * .8) % 1));
show(hd, t, B[9] + .1, { d: .35, y: 30 }); show(a1, t, tA, { d: .3, y: 10 }); show(a2, t, tN, { d: .3, y: 10 });
};
})();
/* ===== 11 LAUNCH: 30 October ===== */
(function () {
var s = scene(10), el = s.el, tI = PT('t3', 'उड़ाया'), tClk = PT('t3', 'देसी'), tL1 = PT('t3', 'एल-वन');
var bg = img(el, 'img/launch.png', 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:50% 70%'); var fl = E(el, 'abs', 'left:440px;top:1200px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0%,#ffb020 35%,rgba(255,176,32,0) 70%);transform-origin:50% 0');
var rk = img(el, 'img/rocket.png', 'position:absolute;left:380px;top:560px;width:320px;height:640px;transform-origin:50% 100%');
var hd = E(el, 'big', 'left:150px;top:190px;font-size:130px', '30 October'), a1 = E(el, 'tag', 'left:150px;top:370px;color:' + AMB, 'GSLV-F18 → NVS-03'), a2 = E(el, 'tag', 'left:150px;top:430px;color:' + SKY + ';font-size:22px', 'same Indian clock + new L1 signal');
ev(tI - .2, 'rumble'); ev(tI, 'slam');
E(el, 'vig', '');
s.r = function (t) {
var u = clamp((t - tI) / 3.2), lift = u * u * 1100, sh = t > tI - .3 && t < tI + 1.5 ? Math.sin(t * 60) * 4 * clamp(1 - (t - tI) / 1.5) : 0;
bg.style.transform = 'scale(' + (1.02 + (t - B[10]) * .03) + ') translate(' + sh + 'px,' + (lift * .08) + 'px)'; rk.style.transform = 'translate(' + sh + 'px,' + (-lift) + 'px)'; rk.style.opacity = eo((t - B[10]) / .3) * (1 - clamp((u - .8) / .2));
var on = clamp((t - (tI - .1)) / .3); fl.style.opacity = on; fl.style.transform = 'translate(' + sh + 'px,' + (-lift) + 'px) scaleY(' + (1.4 + .5 * Math.sin(t * 40)) + ')';
show(hd, t, B[10] + .05, { d: .35, y: 30 }); show(a1, t, tI + .1, { d: .3, y: 10 }); show(a2, t, tClk, { d: .3, y: 10 });
};
})();
/* ===== 12 PAYOFF: the count, and "not yet" ===== */
(function () {
var s = scene(11), el = s.el, tCnt = PT('y1', 'गिनती'), tFour = PT('y1', 'तो चार'), tNot = PT('y3', 'पर अभी'), tOrb = PT('y3', 'ट्रांसफ़र'), tGo = PT('y3', 'चालू');
var bg = img(el, 'img/earth-b.png', 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:50% 40%;opacity:.9');
var g = svg(el, ''); var sockets = []; for (var i = 0; i < 4; i++) { var cx = 210 + i * 220; S(g, 'rect', { x: cx - 80, y: 300, width: 160, height: 130, rx: 16, fill: 'rgba(3,20,23,.85)', stroke: i < 3 ? SKY : AMB, 'stroke-width': 5, 'stroke-dasharray': i < 3 ? '0' : '10 8' }); sockets.push({ x: cx, im: i < 3 ? satImg(el, cx, 365, 150) : satImg(el, cx, 365, 150, 'filter:drop-shadow(0 0 20px rgba(255,176,32,.9))') }); }
var tr = S(g, 'ellipse', { cx: 600, cy: 1000, rx: 420, ry: 170, transform: 'rotate(-14 600 1000)', fill: 'none', stroke: AMB, 'stroke-width': 5, 'stroke-dasharray': '12 10' }), sl = S(g, 'circle', { cx: 970, cy: 880, r: 26, fill: 'none', stroke: IVO, 'stroke-width': 4, 'stroke-dasharray': '6 6' }), mv = satImg(el, 400, 1060, 170);
var cnt = E(el, 'big', 'left:150px;top:480px;font-size:260px;color:' + AMB, '3'), cl = E(el, 'mono', 'left:340px;top:640px;color:' + IVO + ';font-size:34px', 'working'), nt = E(el, 'tag', 'left:150px;top:760px;color:' + RED + ';font-size:36px', 'not yet live'), c1 = E(el, 'tag', 'left:150px;top:1230px;color:' + IVO + ';font-size:22px', '☐ reach its slot'), c2 = E(el, 'tag', 'left:480px;top:1230px;color:' + IVO + ';font-size:22px', '☐ switch on');
ev(tCnt, 'tick'); ev(tFour, 'slam'); ev(tNot, 'drop');
E(el, 'vig', '');
s.r = function (t) {
bg.style.transform = 'scale(' + (1 + (t - B[11]) * .012) + ')'; sockets.forEach(function (k, i) { var on = i < 3 ? 1 : eo((t - tFour) / .4); k.im.style.opacity = i < 3 ? eo((t - B[11] - .1 * i) / .3) : on; });
var n = t < tFour ? 3 : 4; cnt.innerHTML = n; cnt.style.color = n == 4 ? SKY : AMB; show(cnt, t, B[11] + .1, { d: .3, y: 30 }); show(cl, t, B[11] + .2, { d: .3, y: 10 });
tr.setAttribute('opacity', eo((t - tOrb + .4) / .4)); sl.setAttribute('opacity', eo((t - tOrb + .4) / .4)); var a = clamp((t - tOrb) / 6) * .5; mv.style.opacity = eo((t - tOrb + .4) / .4); mv.style.left = (600 + 420 * Math.cos(Math.PI * 1.1 + a * 1.2) * Math.cos(-.245) - 60) + 'px'; mv.style.top = (1000 + 170 * Math.sin(Math.PI * 1.1 + a * 1.2) - 43) + 'px';
show(nt, t, tNot, { d: .3, y: 0, s: .5 }); show(c1, t, tOrb + .3, { d: .3, y: 10 }); show(c2, t, tGo, { d: .3, y: 10 });
};
})();
/* ===== 13 REFRAME: the fourth clock is ours ===== */
(function () {
var s = scene(12), el = s.el, tF = PT('y4', 'चौथी');
var g = svg(el, ''); graticule(g);
var er = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 240, fill: 'rgba(255,74,61,.13)', stroke: RED, 'stroke-width': 5, 'stroke-dasharray': '14 10' }), dot = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 16, fill: IVO }), halo = S(g, 'circle', { cx: DOT[0], cy: DOT[1], r: 16, fill: 'none', stroke: IVO, 'stroke-width': 3 });
var rays = SATP.map(function (p, i) { return S(g, 'line', { x1: p[0], y1: p[1], x2: DOT[0], y2: DOT[1], stroke: i < 3 ? SKY : AMB, 'stroke-width': 4 }); }), sats = SATP.map(function (p, i) { return satImg(el, p[0], p[1], 230, i == 3 ? 'filter:drop-shadow(0 0 24px rgba(255,176,32,.9))' : ''); });
var cc = E(el, 'abs', 'left:880px;top:830px;width:110px;height:110px;border-radius:50%;border:5px solid ' + AMB + ';background:rgba(3,20,23,.88);display:flex;align-items:center;justify-content:center;box-shadow:0 0 50px rgba(255,176,32,.6)', ico('clock', 70, AMB, 1.5));
var hd = E(el, 'big', 'left:150px;top:190px;font-size:140px;color:' + AMB, 'The 4th clock<br>is ours'), sub = E(el, 'tag', 'left:150px;top:1240px;color:' + IVO + ';font-size:22px', 'the dependence was in the clock');
ev(tF, 'neon');
E(el, 'vig', '');
s.r = function (t) {
var u = eo((t - tF) / .8); var r = 240 + (8 - 240) * u; er.setAttribute('r', r); er.setAttribute('stroke', u > .5 ? SKY : RED); er.setAttribute('fill', u > .5 ? 'rgba(85,184,255,.16)' : 'rgba(255,74,61,.13)'); var ph = (t * .9) % 1; halo.setAttribute('r', 16 + ph * 60); halo.setAttribute('opacity', 1 - ph);
rays.forEach(function (rr, i) { rr.setAttribute('opacity', i < 3 ? .9 : u); }); sats.forEach(function (e, i) { e.style.opacity = eo((t - B[12] - .05 * i) / .3); });
show(hd, t, B[12] + .1, { d: .35, y: 30 }); show(cc, t, tF, { d: .35, y: 0, s: .4 }); show(sub, t, tF + .8, { d: .3, y: 10 });
};
})();
/* ===== 14 END CARD ===== */
(function () {
var s = scene(13), el = s.el, tC = T0('c1'), tSd = PT('c2', 'संदेश'), tL = PT('c2', 'लाइक'), tSh = PT('c2', 'शेयर'), tSb = PT('c2', 'सब्सक्राइब');
var g = svg(el, ''); graticule(g, 700); var rays = []; for (var i = 0; i < 12; i++) rays.push(S(g, 'polygon', { fill: i % 2 ? 'rgba(255,176,32,.06)' : 'rgba(85,184,255,.08)' }));
var big = E(el, 'big', 'left:150px;top:200px;font-size:190px;color:' + AMB, 'Send this<br>to them'); var sc = E(el, 'tag', 'left:150px;top:560px;color:' + IVO + ';font-size:22px;text-transform:none', 'for the "no tech of our own" friend');
var pf = E(el, 'abs', 'left:150px;top:760px;width:210px;height:210px;border-radius:50%;border:8px solid ' + IVO + ';box-shadow:0 0 0 6px ' + AMB + ',0 0 60px 8px rgba(255,176,32,.5);overflow:hidden'); img(pf, 'img/profile.jpg', 'width:100%;height:100%;object-fit:cover');
var hn = E(el, 'abs', 'left:395px;top:790px;font:800 72px/1 "Big Shoulders Display";letter-spacing:.02em;color:' + IVO + ';white-space:nowrap', '@sandeshexplains'), sub = E(el, 'mono', 'left:395px;top:880px;color:' + AMB + ';font-size:26px', 'Sandesh Explains');
var row = E(el, 'abs', 'left:150px;top:1050px;display:flex;gap:14px');
var btn = [['thumb-up', 'LIKE', AMB, tL], ['share', 'SHARE', SKY, tSh], ['bell-ringing', 'SUBSCRIBE', RED, tSb]].map(function (c) { return { e: E(row, '', 'height:92px;padding:0 22px;border:4px solid ' + c[2] + ';border-radius:14px;background:rgba(3,20,23,.88);display:flex;align-items:center;gap:10px;font:700 30px "IBM Plex Mono";letter-spacing:.04em;color:' + IVO + ';box-sizing:border-box', ico(c[0], 40, c[2], 1.7) + c[1]), t: c[3] }; });
ev(tC, 'pop'); ev(tSd, 'whoosh'); ev(tL, 'pop'); ev(tSh, 'pop'); ev(tSb, 'pop');
E(el, 'vig', '');
s.r = function (t) {
rays.forEach(function (p, i) { var a = i / 12 * Math.PI * 2 + t * .08, a2 = a + .18; p.setAttribute('points', '540,500 ' + (540 + Math.cos(a) * 1600) + ',' + (500 + Math.sin(a) * 1600) + ' ' + (540 + Math.cos(a2) * 1600) + ',' + (500 + Math.sin(a2) * 1600)); });
show(big, t, B[13] + .05, { d: .4, y: 40 }); show(sc, t, tC + .5, { d: .3, y: 10 }); show(pf, t, tSd, { d: .4, y: 0, s: .5 }); show(hn, t, tSd + .1, { d: .35, y: 20 }); show(sub, t, tSd + .25, { d: .35, y: 14 }); btn.forEach(function (b) { show(b.e, t, b.t - .05, { d: .32, y: 0, s: .5 }); });
};
})();
/* ===== persistent layers: caption rig, flash, ambient sweep, grain ===== */
var cap = E(ST, '', '', ''); cap.id = 'cap'; var fl = E(ST, '', '', ''); fl.id = 'flash'; var sw = E(ST, '', '', ''); sw.id = 'sweep'; E(ST, '', '', '').id = 'grain';
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: AMB, chipInk: '#1a1000', keywords: { navic: SKY, clock: AMB, ghadi: AMB, chaar: AMB, teen: RED, isro: SKY, nvs: SKY } };
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
fl.style.background = FL[cur]; fl.style.opacity = cur === 0 ? 0 : .34 * Math.sin(Math.PI * clamp((t - B[cur]) / TR));
sw.style.left = (-300 + ((t % 1.8) / 1.8) * 1700) + 'px';
cap.innerHTML = CAP.html(t, TM.cap, CAPOPT);
};
window.__reelDurationSec = DUR; window.EV = EV; window.__B = B; window.__ready = false;
Promise.all(['800 40px "Big Shoulders Display"', '700 24px "IBM Plex Mono"', '600 24px "IBM Plex Mono"', '800 50px Inter'].map(function (f) { return document.fonts.load(f); }).concat(Array.prototype.map.call(document.images, function (im) { return im.decode ? im.decode().catch(function () { }) : 0; }))).then(function () { window.__ready = true; });
})();
