// Cells reel #02 MOCKUP: capillary (0-5.2 s), gut (5.2-10 s), payoff (10-15 s). Every frame is a pure function of t (window.__seek).
(function () {
'use strict';
var W = 1080, H = 1920, DUR = 15, F = 1763, CX0 = .4, CZ0 = .3, TAU = Math.PI * 2;
var $ = function (id) { return document.getElementById(id); };
window.__reelDurationSec = DUR; window.__ready = false; window.EV = [];
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function seg(t, a, b) { return clamp((t - a) / (b - a), 0, 1); }
function e3(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function eio(x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function lerp(a, b, k) { return a + (b - a) * k; }
function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
var fx = $('fx'), ctx = fx.getContext('2d');
// ---------- red-cell sprite variants: tilt(8) x blur(4) x fog(3)
var BLUR = [0, 2.2, 5.5, 11], FOG = [1, .66, .4], SPR = [];
function buildSprites(imgs) { for (var t = 0; t < 8; t++) { SPR[t] = []; for (var b = 0; b < 4; b++) { SPR[t][b] = []; for (var f = 0; f < 3; f++) { var c = document.createElement('canvas'); c.width = c.height = 320; var x = c.getContext('2d'); x.filter = 'blur(' + BLUR[b] + 'px) brightness(' + FOG[f] + ')'; x.drawImage(imgs[t], 32, 32); SPR[t][b][f] = c; } } } }
function loadImg(src) { return new Promise(function (r) { var i = new Image(); i.onload = function () { r(i); }; i.onerror = function () { r(null); }; i.src = src; }); }
// ---------- counter: 3.82 M/s x t (accelerated in this mockup only, to show the 100 M crossing inside 15 s)
function V(t) { var base = 3.82e6 * t; if (t < 10) return base; var u = seg(t, 10, 13.2); return 38.2e6 + (100e6 - 38.2e6) * (u * u * (3 - 2 * u) * .55 + u * .45); }
var CROSS = 13.2, digs = [];
(function () { var c = $('cnt'); var order = ['d8', 'd7', 'd6', 'sp', 'd5', 'd4', 'd3', 'sp', 'd2', 'd1', 'd0']; order.forEach(function (k) { var e = document.createElement('div'); if (k === 'sp') { e.className = 'sp'; } else { e.className = 'd'; e.innerHTML = '<i>0</i><i>0</i>'; e._k = +k.slice(1); digs.push(e); } c.appendChild(e); }); })();
function counter(t) {
  var v = Math.floor(V(t)), wrap = $('cntwrap');
  digs.forEach(function (e) { var k = e._k, cur, nxt, off = 0;
    if (k >= 6) { var q = V(t) / Math.pow(10, k), fl = Math.floor(q), fr = q - fl; cur = fl % 10; nxt = (fl + 1) % 10; off = smooth(fr, .86, 1); }
    else { var r = ((Math.floor(t * 60) * 7919 + k * 104729 + 13) % 9973); cur = (r % 10); nxt = cur; e.style.filter = 'blur(' + (k < 3 ? 3 : 1.6) + 'px)'; }
    var is = e.children; is[0].textContent = cur; is[1].textContent = nxt; is[0].style.marginTop = (-off * 112) + 'px';
    var sig = v >= Math.pow(10, k) || k < 4; e.style.opacity = sig ? 1 : .22; });
  var up = eio(seg(t, 10.0, 11.4)), pulse = Math.max(0, 1 - Math.abs(t - CROSS) / .28);
  wrap.style.transform = 'translateY(' + (up * 760) + 'px) scale(' + (1 + .1 * up + .06 * pulse) + ')'; $('cntlab').style.opacity = 1 - .3 * up;
}
function smooth(x, a, b) { var k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); }
// ---------- captions (placeholder chunks, to show the caption look)
var CAPS = [[.2, 1.7, 'your body <span class="k">replaces</span>'], [1.7, 3.3, 'millions of cells'], [3.4, 5.0, 'every <span class="k">second.</span>'], [5.9, 7.8, 'Three to <span class="a">five days.</span>'], [10.6, 12.6, 'Since you pressed play:'], [12.7, 14.8, 'about a <span class="k">hundred million.</span>']];
var capEl = $('cap'), capN = CAPS.map(function (c) { var d = document.createElement('div'); d.innerHTML = c[2]; capEl.appendChild(d); return d; });
function captions(t) { capN.forEach(function (d, i) { var c = CAPS[i], on = t >= c[0] && t < c[1]; d.style.display = on ? 'block' : 'none'; if (on) { var k = e3(seg(t, c[0], c[0] + .16)); d.style.opacity = k * (1 - seg(t, c[1] - .1, c[1])); d.style.transform = 'translateY(' + ((1 - k) * 14) + 'px) scale(' + lerp(.93, 1, k) + ')'; } }); }
// ---------- scene 1: capillary stream
var CELLS = (function () { var r = rng(11), a = []; for (var i = 0; i < 420; i++) { var ang = r() * TAU, rad = Math.sqrt(r()) * 4.4; a.push({ X: Math.cos(ang) * rad, Z: Math.sin(ang) * rad, d0: r() * 70, om: .5 + r() * 2.2, ph: r() * TAU, sp0: r() * TAU, sp: (r() - .5) * 1.6, lime: i % 11 === 0 }); } return a; })();
function dep(d) { return clamp(1 - (d - 3) / 87, 0, 1); }
var HERO = { X: 1.25, Z: -.55 };
function focus1(t) { var hero = 14.5 - 1.25 * t; return lerp(hero, 30, eio(seg(t, 2.2, 3.1))); }
function stream(t, speed, alphaK) {
  var arr = [], run = speed * t + (t > 4.3 ? 0 : 0); var dive = eio(seg(t, 4.2, 5.2));
  for (var i = 0; i < CELLS.length; i++) { var c = CELLS[i], d = ((c.d0 - run - 18 * dive * dive) % 70 + 70) % 70 + 2.5, X = c.X, Z = c.Z; arr.push({ c: c, d: d, X: X, Z: Z, hero: false }); }
  arr.push({ c: { om: .7, ph: 1, sp0: .4, sp: .5, lime: false }, d: 14.5 - 1.25 * t + (t > 4.2 ? -9 * dive : 0), X: HERO.X, Z: HERO.Z, hero: true });
  arr.sort(function (a, b) { return b.d - a.d; }); var fd = focus1(t), sway = [Math.sin(t * .7) * 5, Math.cos(t * .55) * 4];
  for (var j = 0; j < arr.length; j++) { var o = arr[j], d = o.d; if (d < 2.6) continue;
    var sx = W / 2 + (o.X - CX0) / d * F + sway[0] * (1 - d / 80), sy = H / 2 - (o.Z - CZ0) / d * F + sway[1] * (1 - d / 80), rs = 1.0 / d * F, D = 2.7 * rs;
    var diff = Math.abs(d - fd) * (o.hero ? 1.25 : 1), bl = diff < 2.5 ? 0 : diff < 8 ? 1 : diff < 17 ? 2 : 3, fg = d < 24 ? 0 : d < 42 ? 1 : 2;
    var tilt = Math.floor(Math.abs(Math.sin(o.c.om * t + o.c.ph)) * 7.99), spin = o.c.sp0 + o.c.sp * t;
    var al = alphaK * clamp((d - 2.6) / 1.2, 0, 1) * clamp((74 - d) / 10, 0, 1) * (bl === 3 ? .55 : 1);
    if (o.c.lime && d > 6) { var gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, rs * 2.6); gr.addColorStop(0, 'rgba(198,255,74,' + (.55 * al) + ')'); gr.addColorStop(1, 'rgba(198,255,74,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(sx, sy, rs * 2.6, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
    ctx.save(); ctx.globalAlpha = al; ctx.translate(sx, sy); ctx.rotate(spin); var s = D * 1.25; ctx.drawImage(SPR[tilt][bl][fg], -s / 2, -s / 2, s, s); ctx.restore(); }
}
// ---------- scene 2: gut shed cells (amber discs from the villus tips)
function shed(t, alphaK) {
  var r = rng(77); ctx.globalCompositeOperation = 'lighter';
  for (var i = 0; i < 110; i++) { var ang = r() * TAU, d0 = 7 + r() * 40, ph = r(), sp = .16 + r() * .14, k = (t * sp + ph) % 1, d = d0 - 2 * k; var rad = lerp(5.35, 3.6, k), X = Math.cos(ang) * rad, Z = Math.sin(ang) * rad - k * k * 2.2 * 1.0;
    var sx = W / 2 + (X - 0) / d * F, sy = H / 2 - (Z - 0) / d * F, rs = .34 / d * F, fd = 15, diff = Math.abs(d - fd), soft = clamp(diff / 14, 0, 1), rr = rs * (1.4 + 1.8 * soft);
    var al = alphaK * Math.sin(Math.PI * k) * (.8 - .45 * soft) * clamp((d - 3) / 3, 0, 1); if (al <= .01) continue;
    var g = ctx.createRadialGradient(sx, sy, rr * (.55 - .5 * soft), sx, sy, rr); g.addColorStop(0, 'rgba(255,196,96,' + al + ')'); g.addColorStop(.7, 'rgba(255,150,70,' + (al * .55) + ')'); g.addColorStop(1, 'rgba(255,120,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, rr, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
}
// ---------- scene 3: spark field ( ~ 1 spark = 1 M cells), centred on the body
function sparks(t, alphaK) {
  var r = rng(5), u = t - 10, N = 1500, cx = 540, cy = 900; ctx.globalCompositeOperation = 'lighter'; var rate = 1 + .9 * seg(t, 10.5, CROSS);
  for (var i = 0; i < N; i++) { var th = r() * TAU, z = r(), sp = .08 + r() * .22, off = r(), k = ((u * sp * rate + off) % 1 + 1) % 1, R0 = 40 + 40 * z, rad = R0 + Math.pow(k, 1.25) * (520 + 700 * z), a = (1 - k) * Math.min(1, k * 9) * alphaK, sz = (1.4 + 4.2 * (1 - z)) * (1 - .4 * k);
    var x = cx + Math.cos(th) * rad * .9, y = cy + Math.sin(th) * rad * 1.15; if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;
    var tint = (i % 7 === 0) ? [255, 255, 235] : [198, 255, 74]; var g = ctx.createRadialGradient(x, y, 0, x, y, sz * 3); g.addColorStop(0, 'rgba(' + tint + ',' + (a * .95) + ')'); g.addColorStop(.35, 'rgba(' + tint + ',' + (a * .35) + ')'); g.addColorStop(1, 'rgba(' + tint + ',0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, sz * 3, 0, TAU); ctx.fill(); }
  var sh = seg(t, CROSS, CROSS + .9); if (sh > 0 && sh < 1) { ctx.lineWidth = 14 * (1 - sh); ctx.strokeStyle = 'rgba(214,255,120,' + (1 - sh) + ')'; ctx.beginPath(); ctx.arc(cx, 1010, 60 + sh * 900, 0, TAU); ctx.stroke(); }
  ctx.globalCompositeOperation = 'source-over';
}
// ---------- driver
function seekAll(t) {
  ctx.clearRect(0, 0, W, H); var o = { t: t, par: .05, bloom: 1.0, streak: 0, flash: 0, vig: 1, ca: .005, dof: .03, dim: 1 }; var sway = [Math.sin(t * .7) * .55, Math.cos(t * .55) * .3];
  var big = $('big'); big.style.opacity = 0;
  if (t < 5.2) {   // scene 1 + dive into the wall
    var push = eio(seg(t, 4.2, 5.2)); o.a = 'cap_bg'; o.camA = [sway[0], sway[1], 1.0 + .35 * push + .03 * t / 5]; o.shA = [0, 0]; o.focus = dep(focus1(t)); o.dof = .028; o.dim = 1.0;
    if (t > 4.5) { o.b = 'gut_bg'; o.camB = [sway[0], sway[1], 1.0]; o.shB = [0, 0]; o.mix = eio(seg(t, 4.75, 5.15)); }
    stream(t, 5.5 + 30 * push * push, e3(seg(t, 0, .25))); o.streak = .9 * Math.max(0, 1 - Math.abs(t - 5.0) / .3); o.flash = .35 * Math.max(0, 1 - Math.abs(t - 5.05) / .12);
  } else if (t < 10) {   // gut
    var u = t - 5.0, sett = 1.35 - .35 * e3(seg(t, 5.0, 6.4)); o.a = 'gut_bg'; o.camA = [sway[0], sway[1], sett + .06 * seg(t, 6.4, 10)]; o.shA = [0, 0]; o.focus = dep(15); o.dof = .03; o.dim = 1;
    var wv = eio(seg(t, 6.0, 9.4)); o.wave = [lerp(.04, .96, wv), .09, .85 * (1 - seg(t, 9.0, 9.7))]; shed(t, e3(seg(t, 5.6, 6.2)) * (1 - seg(t, 9.6, 10.0)));
    var b = seg(t, 7.2, 7.6); big.style.opacity = b * (1 - seg(t, 9.3, 9.7)); big.style.color = '#ffc464'; big.style.textShadow = '0 0 50px rgba(255,180,58,.55),0 8px 30px rgba(0,0,0,.6)'; big.innerHTML = '3–5 DAYS'; big.style.top = '980px'; big.style.transform = 'scale(' + lerp(.86, 1, e3(b)) + ')';
    o.streak = .5 * Math.max(0, 1 - Math.abs(t - 7.3) / .35);
  } else {   // payoff
    var cr = Math.max(0, 1 - Math.abs(t - CROSS) / .25); o.a = 'xray_skull'; o.camA = [sway[0] * .6, 0, 1.12 - .1 * e3(seg(t, 10, 14))]; o.shA = [0, 0]; o.dim = .34 + .15 * seg(t, 11, 13.2); o.dof = .012; o.focus = .5; o.par = .035; o.vig = 1.2;
    if (t < 10.5) { o.b = 'gut_bg'; o.camB = [0, 0, 1.06]; o.shB = [0, 0]; o.mix = 1 - eio(seg(t, 10.0, 10.5)); o.dof = .03; o.focus = dep(15); }
    sparks(t, e3(seg(t, 10.2, 10.9))); o.flash = .55 * cr; o.streak = 1.3 * cr + .3 * seg(t, 11, 13); o.bloom = 1.2 + .5 * cr;
  }
  o.spr = fx; window.GLP.draw(o); counter(t); captions(t);
}
var vids = { dust: $('dust'), grain: $('grain') };
function vseek(v, t) { return new Promise(function (res) { if (!v.duration) return res(); function done() { v.removeEventListener('seeked', done); res(); } v.addEventListener('seeked', done); v.currentTime = t % v.duration; setTimeout(res, 400); }); }
window.__seek = function (t) { t = clamp(t, 0, DUR - 1e-3); seekAll(t); return Promise.all([vseek(vids.dust, t), vseek(vids.grain, t)]); };
Promise.all([document.fonts.load('400 100px Frag'), document.fonts.load('700 100px Fam'), document.fonts.load('700 40px InterX'), window.GLP.load(['cap_bg', 'gut_bg', 'xray_skull'])].concat([0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return loadImg('plates/rbc_' + i + '.png'); }))).then(function (r) {
  var imgs = r.slice(4); if (imgs.every(Boolean)) buildSprites(imgs); else console.log('sprites missing');
  return new Promise(function (res) { var n = 0; ['dust', 'grain'].forEach(function (k) { var v = vids[k]; if (v.readyState >= 2) { if (++n === 2) res(); } else v.addEventListener('loadeddata', function () { if (++n === 2) res(); }); }); });
}).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
})();
