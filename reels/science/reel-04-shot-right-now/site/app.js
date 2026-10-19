// "You're being shot right now" ("Cloud Chamber"). Every visual is a pure function of t (window.__seek).
// Physics rules (script.md "Physics guardrails"): neutrinos fly straight and are never stopped; muons are straight, near-vertical;
// showers branch downward with doubling counts; decays emit isotropically (betas wiggle, gammas run straight); meteors decelerate
// and burn out; orbits and rotation run the right way round. Every slowed or sped-up view says by how much on screen.
// Through-line: the 1 cm² detector square, which appears in every scene, and the three live counters at true real-time rates.
(function () {
  var TM = window.TM, S = TM.S, C = TM.CUE, END = TM.END, W = 1080, H = 1920;
  var cv = document.getElementById('cv'), g = cv.getContext('2d');
  var fx = document.createElement('canvas'); fx.width = W; fx.height = H; var f = fx.getContext('2d');
  var sm = document.createElement('canvas'); sm.width = W / 4; sm.height = H / 4; var sx = sm.getContext('2d');
  var $ = function (id) { return document.getElementById(id) };
  function cl(x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)) }
  function seg(t, a, b) { return cl((t - a) / (b - a)) }
  function e3(x) { return 1 - Math.pow(1 - x, 3) } function io(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }
  function bk(x) { var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) }
  function lerp(a, b, u) { return a + (b - a) * u }
  function ih(k, salt) { var x = (Math.floor(k) * 2654435761 ^ ((salt || 0) * 2246822519)) >>> 0; x = Math.imul(x ^ (x >>> 16), 2246822507) >>> 0; x = Math.imul(x ^ (x >>> 13), 3266489909) >>> 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967296 }
  function fmt(n) { return Math.floor(n).toLocaleString('en-US') }
  var EV = []; function ev(t, k) { EV.push([+t.toFixed(3), k]) }
  var COL = { nu: '#9fe8ff', mu: '#ff4fd8', cr: '#ff8a2a', de: '#9dff5a', me: '#ffc66b', sp: '#fff3c4', ink: '#e9eef6', dim: '#8d9aae' };
  function img(src) { var i = new Image(); i.src = src; return i }
  var IM = { sky: img('img/sky.jpg'), night: img('img/earth_night.jpg'), earth: img('img/earth.jpg'), latte: img('img/latte.jpg') };

  // ---- small drawing helpers ------------------------------------------------------------------------------------------------
  function tag(txt, col, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '600 17px FC'; var w = g.measureText(txt).width + 24; g.fillStyle = 'rgba(3,5,10,.78)'; g.fillRect(x, y, w, 36); g.strokeStyle = col; g.lineWidth = 2; g.strokeRect(x, y, w, 36); g.fillStyle = col; g.fillText(txt, x + 12, y + 24); g.restore(); return w }
  function label(txt, col, x, y, a, sz, align) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '600 ' + (sz || 18) + 'px FC'; g.fillStyle = col; g.textAlign = align || 'left'; g.shadowColor = 'rgba(3,5,10,.9)'; g.shadowBlur = 8; g.fillText(txt, x, y); g.restore() }
  function big(txt, col, x, y, a, sz, align) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '900 ' + sz + 'px AB'; g.fillStyle = col; g.textAlign = align || 'left'; g.shadowColor = 'rgba(3,5,10,.9)'; g.shadowBlur = 14; g.fillText(txt, x, y); g.restore() }
  function square(x, y, a, col, txt, s) { if (a <= 0) return; s = s || 77; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 3; g.strokeRect(x - s, y - s, 2 * s, 2 * s);
    g.beginPath(); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { g.moveTo(x + c[0] * s, y + c[1] * s); g.lineTo(x + c[0] * (s + 26), y + c[1] * (s + 26)) }); g.stroke();
    if (txt) { g.font = '600 17px FC'; g.fillStyle = col; g.shadowColor = '#03050a'; g.shadowBlur = 6; g.fillText(txt, x - s, y + s + 30) } g.restore() }
  function streak(x1, y1, x2, y2, col, w, a) { f.globalAlpha = a; f.strokeStyle = col; f.lineWidth = w; f.beginPath(); f.moveTo(x1, y1); f.lineTo(x2, y2); f.stroke() }
  function cover(im, x, y, w, h, fx0, fy0, zoom) {   // draw an image cropped to fill (x,y,w,h); fx0/fy0 = focus 0..1
    if (!im.complete || !im.naturalWidth) return; var iw = im.naturalWidth, ihh = im.naturalHeight, s = Math.max(w / iw, h / ihh) * (zoom || 1), sw = w / s, sh = h / s;
    g.drawImage(im, cl((iw - sw) * (fx0 == null ? .5 : fx0), 0, iw - sw), cl((ihh - sh) * (fy0 == null ? .5 : fy0), 0, ihh - sh), sw, sh, x, y, w, h) }

  // ---- background: cloud-chamber haze drifting upward (pure t) ---------------------------------------------------------------------
  var haze = document.createElement('canvas'); haze.width = 270; haze.height = 480; (function () { var x = haze.getContext('2d'), d = x.createImageData(270, 480);
    for (var i = 0; i < 270 * 480; i++) { var n = ih(i, 7) * .55 + ih(Math.floor(i / 9), 8) * .45; d.data[i * 4] = 50; d.data[i * 4 + 1] = 80; d.data[i * 4 + 2] = 120; d.data[i * 4 + 3] = n * 20 } x.putImageData(d, 0, 0) })();
  function bg(t) { var gr = g.createRadialGradient(540, 820, 80, 540, 900, 1300); gr.addColorStop(0, '#0a1322'); gr.addColorStop(1, '#03050a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = .85; g.filter = 'blur(10px)'; g.drawImage(haze, -60 + Math.sin(t * .2) * 30, -40 - (t * 7) % 60, W + 120, H + 160); g.filter = 'none'; g.restore() }

  // ---- particle systems (deterministic: particle k is born at k/rate with hashed position) ------------------------------------
  // Neutrino rain through a life-size phone screen (1080 px = 7 cm). 65e9 /cm2/s x ~87 cm2 = 5.7e12 /s; slowed 1e9x -> 5,660 per video s.
  var VNU = 30 * 1080 / 7, DIR = [.447, .894];
  function rain(t, rate, alpha, col, dir, v, len, w) {
    dir = dir || DIR; v = v || VNU; var span = 2300 / v, k0 = Math.floor((t - span) * rate), k1 = Math.floor((t + span) * rate);
    for (var k = k0; k <= k1; k++) { var tk = k / rate, px = ih(k, 1) * 1600 - 260, py = ih(k, 2) * 2400 - 240, d = (t - tk) * v, x = px + dir[0] * d, y = py + dir[1] * d;
      if (y < -60 || y > 1980 || x < -60 || x > 1140) continue; var L = len || v / 60; streak(x - dir[0] * L, y - dir[1] * L, x, y, col || COL.nu, w || 2.2, alpha * (.35 + .65 * ih(k, 3))) }
    f.globalAlpha = 1 }
  // isotropic decay bursts inside a point set (K-40: 89% beta - a wiggly electron track; 11% EC + 1.46 MeV gamma - a long straight line)
  function decays(t, rate, pts, a, life) {
    if (!pts || !pts.length) return; life = life || .07; var k0 = Math.floor((t - life) * rate), k1 = Math.floor(t * rate);
    for (var k = k0; k <= k1; k++) { var age = t - k / rate, p = pts(k), al = a * (1 - age / life); if (!p) continue; f.strokeStyle = COL.de; f.lineWidth = 2;
      if (ih(k, 4) < .11) { var an = ih(k, 6) * 6.283; f.globalAlpha = al * .55; f.beginPath(); f.moveTo(p[0], p[1]); f.lineTo(p[0] + Math.cos(an) * 420, p[1] + Math.sin(an) * 420); f.stroke() }
      else { f.globalAlpha = al; f.beginPath(); f.moveTo(p[0], p[1]); var x = p[0], y = p[1], an2 = ih(k, 8) * 6.283; for (var j = 0; j < 6; j++) { an2 += (ih(k * 7 + j, 9) - .5) * 1.4; x += Math.cos(an2) * 8; y += Math.sin(an2) * 8; f.lineTo(x, y) } f.stroke() }
      f.globalAlpha = al; f.fillStyle = '#eaffd8'; f.beginPath(); f.arc(p[0], p[1], 2.4, 0, 7); f.fill() }
    f.globalAlpha = 1 }

  // ---- scenes ---------------------------------------------------------------------------------------------------------------------
  var DOMS = [];
  function mk(eye, h) { var d = document.createElement('div'); d.className = 'sc'; d.innerHTML = '<div class="eye">' + eye + '</div><div class="h">' + h + '</div>'; $('scenes').appendChild(d); DOMS.push(d); return d }
  var SC = [];
  // 0 hook: neutrino rain through your screen ------------------------------------------------------------------------------------------
  mk('// SOLAR NEUTRINOS · THROUGH YOUR SCREEN', '<span style="font-size:104px;font-stretch:96%;color:var(--nu)">100,000,000,000</span><br><span style="font-size:52px;font-stretch:118%">just went through your thumbnail</span>');
  SC.push(function (t, a) { rain(t, 5660, a); square(540, 900, a, COL.nu, '1 cm² ≈ your thumbnail'); tag('LIFE-SIZE SCREEN · SLOWED 1,000,000,000×', COL.nu, 110, 1160, a);
    var pu = Math.max(0, 1 - Math.abs(t - C.hundred - .1) / .3); if (pu > 0) big('×10¹¹', COL.nu, 540, 1060, a * pu, 90, 'center') });
  ev(0, 'boom'); ev(C.hundred, 'riser'); ev(C.thumb, 'hit');
  // 1 the Sun's core: pp-chain fusion, neutrinos fly straight out ----------------------------------------------------------------------
  mk('// MADE IN THE CORE · 15 MILLION °C', 'Fired <em style="color:var(--nu)">straight out</em> of the Sun');
  var SUN = { x: 540, y: 880, r: 280 };
  var gran = document.createElement('canvas'); gran.width = 256; gran.height = 256; (function () { var x = gran.getContext('2d'), d = x.createImageData(256, 256);
    for (var i = 0; i < 256 * 256; i++) { var v = ih(i, 11) * .6 + ih(Math.floor(i / 3) + Math.floor(i / 768) * 7, 12) * .4; d.data[i * 4] = 255; d.data[i * 4 + 1] = 120 + v * 90; d.data[i * 4 + 2] = 30 + v * 40; d.data[i * 4 + 3] = 70 + v * 120 } x.putImageData(d, 0, 0) })();
  function sun(t, a, x0, y0, R) {
    g.save(); g.globalAlpha = a; var co = g.createRadialGradient(x0, y0, R * .9, x0, y0, R * 1.7); co.addColorStop(0, 'rgba(255,170,60,.45)'); co.addColorStop(1, 'rgba(255,120,30,0)'); g.fillStyle = co; g.beginPath(); g.arc(x0, y0, R * 1.7, 0, 7); g.fill();
    // limb darkening I(mu) = 1 - 0.6 (1 - mu): bright centre, darker, redder edge
    var ld = g.createRadialGradient(x0, y0, 0, x0, y0, R); ld.addColorStop(0, '#fff3c8'); ld.addColorStop(.6, '#ffc35a'); ld.addColorStop(.88, '#f08a22'); ld.addColorStop(1, '#b84a10'); g.fillStyle = ld; g.beginPath(); g.arc(x0, y0, R, 0, 7); g.fill();
    g.save(); g.beginPath(); g.arc(x0, y0, R, 0, 7); g.clip(); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = a * .7; g.drawImage(gran, x0 - R - (t * 4) % 20, y0 - R, 2 * R + 20, 2 * R); g.restore();
    g.restore() }
  SC.push(function (t, a) { var l = t - S[1];
    sun(t, a, SUN.x, SUN.y, SUN.r);
    // core cut-away (inner ~0.25 R)
    // quarter-wedge cut-away: convective zone (0.7-1 R), radiative zone (0.25-0.7 R), core (< 0.25 R)
    var cr = SUN.r * .25; g.save(); g.globalAlpha = a; [[1, '#7a2a08'], [.7, '#c2540f'], [.25, '#fff6d8']].forEach(function (q) { g.fillStyle = q[1]; g.beginPath(); g.moveTo(SUN.x, SUN.y); g.arc(SUN.x, SUN.y, SUN.r * q[0], -Math.PI * .5, 0); g.closePath(); g.fill() });
    g.strokeStyle = 'rgba(255,243,200,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(SUN.x, SUN.y - SUN.r); g.lineTo(SUN.x, SUN.y); g.lineTo(SUN.x + SUN.r, SUN.y); g.stroke(); g.restore();
    label('CONVECTIVE', '#ffd9a8', SUN.x + SUN.r * .64, SUN.y - SUN.r * .62, a, 14, 'center'); label('RADIATIVE', '#ffe6c2', SUN.x + SUN.r * .38, SUN.y - SUN.r * .3, a, 14, 'center');
    // a steady outflow of neutrinos from the core, straight out in every direction, at true speed for a Sun this size (R in 2.3 s)
    var VS = SUN.r / 2.3, ko0 = Math.floor((t - 12) * 60), ko1 = Math.floor(t * 60);
    for (var ko = Math.max(Math.floor((S[1] - 12) * 60), ko0); ko <= ko1; ko++) { var ag = t - ko / 60, dr = ih(ko, 26) * 6.283, rr0 = ih(ko, 27) * cr, d0 = rr0 + ag * VS; if (d0 > 1100) continue;
      streak(SUN.x + Math.cos(dr) * Math.max(rr0, d0 - 55), SUN.y + Math.sin(dr) * Math.max(rr0, d0 - 55), SUN.x + Math.cos(dr) * d0, SUN.y + Math.sin(dr) * d0, COL.nu, 2, a * (.4 + .6 * ih(ko, 28))) }
    // pp-chain events in the core: 4 protons converge -> helium; 2 neutrinos leave in straight radial lines
    var rate = 7, k0 = Math.floor((t - S[1] - 6) * rate), k1 = Math.floor((t - S[1]) * rate);
    for (var k = Math.max(0, k0); k <= k1; k++) { var tk = S[1] + k / rate, age = t - tk, rk = cr * (.25 + .6 * ih(k, 21)), ak = -ih(k, 22) * 1.571, cx = SUN.x + Math.cos(ak) * rk, cy = SUN.y + Math.sin(ak) * rk;
      if (age < .35) { for (var j = 0; j < 4; j++) { var an = j * 1.571 + ih(k, 23), rr = 40 * (1 - age / .35); f.globalAlpha = a; f.fillStyle = '#ff6a5a'; f.beginPath(); f.arc(cx + Math.cos(an) * rr, cy + Math.sin(an) * rr, 6, 0, 7); f.fill() } }
      else { if (age < .7) { f.globalAlpha = a * (1 - (age - .35) / .35); f.fillStyle = '#fff6d0'; f.beginPath(); f.arc(cx, cy, 10 + 30 * (age - .35), 0, 7); f.fill() }
        for (var n = 0; n < 2; n++) { var dir = ih(k, 24 + n) * 6.283, d = (age - .35) * SUN.r / 2.3; if (d > 1500) continue; streak(cx + Math.cos(dir) * Math.max(0, d - 55), cy + Math.sin(dir) * Math.max(0, d - 55), cx + Math.cos(dir) * d, cy + Math.sin(dir) * d, COL.nu, 2.6, a) } } }
    // a light photon random-walks (drawn as a jagged path that barely gets anywhere)
    g.save(); g.globalAlpha = a * seg(l, 1.6, 2.2); g.strokeStyle = '#fff3c8'; g.lineWidth = 2; g.beginPath(); g.beginPath(); g.moveTo(SUN.x, SUN.y); g.arc(SUN.x, SUN.y, SUN.r, -Math.PI * .5, 0); g.closePath(); g.clip(); g.beginPath(); var px = SUN.x + cr * 1.2, py = SUN.y - cr * 1.2; g.moveTo(px, py);
    var steps = Math.floor(seg(l, 1.6, 5) * 90); for (var s2 = 0; s2 < steps; s2++) { var an2 = ih(s2, 31) * 6.283; px += Math.cos(an2) * 16; py += Math.sin(an2) * 16; g.lineTo(px, py) } g.stroke(); g.restore();
    label('CORE', '#fff3c8', SUN.x + 18, SUN.y - cr + 26, a, 18);
    tag('4 ¹H → ⁴He + 2e⁺ + 2ν  (+ energy)', COL.nu, 110, 1128, a * seg(l, .4, .7));
    label('light: zig-zags out over thousands of years', '#fff3c8', 110, 1186, a * seg(l, 1.8, 2.2), 17);
    label('neutrinos: straight out in 2.3 s (true speed, Sun to scale) · Earth in 8 min 20 s', COL.nu, 110, 1214, a * seg(l, 2.6, 3), 17);
    big('65 BILLION', COL.nu, 540, 548, a * seg(t, C.b65, C.b65 + .2), 70, 'center'); label('per cm², every second, at Earth', COL.ink, 540, 580, a * seg(t, C.b65 + .2, C.b65 + .4), 19, 'center') });
  ev(S[1], 'whoosh'); ev(C.b65, 'hit'); ev(C.core, 'pulse');
  // 2 night side: straight through Earth and up through your bed -----------------------------------------------------------------------
  mk('// NIGHT SIDE · 12,742 km OF ROCK', 'At night they come <em style="color:var(--nu)">up through Earth</em>');
  var EA = { x: 540, y: 900, r: 300 };
  SC.push(function (t, a) { var l = t - S[2], cx = EA.x, cy = EA.y, R = EA.r;
    g.save(); g.globalAlpha = a; var L = [[1, '#2a5f8f'], [.985, '#3c6b40'], [.97, '#8a4a1e'], [.55, '#e0702a'], [.19, '#ffe08a']];
    L.forEach(function (q, i) { var gr = g.createRadialGradient(cx - R * .25, cy, 0, cx, cy, R * q[0]); gr.addColorStop(0, q[1]); gr.addColorStop(1, i ? q[1] : '#163450'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R * q[0], 0, 7); g.fill() });
    g.fillStyle = 'rgba(0,0,8,.55)'; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2); g.fill();   // the Sun is to the left: right half is night
    g.restore();
    label('INNER CORE', '#3a2400', cx, cy + 6, a, 15, 'center'); label('MANTLE', '#fff', cx - R * .75, cy - 10, a * .8, 15, 'center'); label('☀ FROM THE SUN →', '#ffd27a', 110, cy - R + 10, a, 18); label('CRUST', '#cfe6ff', cx - R * .93, cy - R * .42, a * .8, 13, 'center'); label('OUTER CORE', '#fff', cx - R * .3, cy - R * .38, a * .8, 13, 'center');
    label('DAY', '#cfe6ff', cx - R * .5, cy + R * .8, a, 16, 'center'); label('NIGHT', '#cfe6ff', cx + R * .5, cy + R * .8, a, 16, 'center');
    // parallel stream from the Sun (left), crossing Earth unchanged: 12,742 km in 0.042 s real; slowed 30x here
    var dir = [1, 0], v = 2 * R / 1.25; rain(t, 700, a, COL.nu, dir, v, 46, 2);
    // your bed on the night side, with the 1 cm2 square
    var bx = cx + R * .74, by = cy - R * .67, ba = a * seg(t, C.bed - .3, C.bed); g.save(); g.globalAlpha = ba; g.translate(bx, by); g.rotate(Math.atan2(by - cy, bx - cx) + Math.PI / 2); g.fillStyle = '#e9eef6'; g.fillRect(-30, -12, 60, 12); g.fillStyle = '#9fe8ff'; g.fillRect(-30, -20, 16, 8); g.fillStyle = '#5b6b80'; g.fillRect(-30, 0, 4, 10); g.fillRect(26, 0, 4, 10); g.restore();
    if (ba > 0) { var yy = by, xs = cx - Math.sqrt(R * R - (yy - cy) * (yy - cy)), ph = ((t - C.bed) * 1.6) % 1; g.save(); g.globalAlpha = ba * .5; g.strokeStyle = COL.nu; g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(xs - 120, yy); g.lineTo(bx, yy); g.stroke(); g.setLineDash([]); g.restore();
      var hx = lerp(xs - 120, bx + 140, ph); streak(hx - 60, yy, hx, yy, '#ffffff', 4, ba) }
    square(bx, by, ba, COL.nu, 'you, in bed', 48);
    tag('SLOWED 30× · 0.04 s TO CROSS EARTH · ≈ 0 STOPPED', COL.nu, 110, 1186, a * seg(l, .3, .6)) });
  ev(S[2], 'whoosh'); ev(C.bed, 'pop');
  // 3 look up: cosmic-ray air showers, muons, and the relativity clocks -------------------------------------------------------------------
  var hB = mk('// COSMIC RAYS · 15 km ABOVE YOU', 'Muons <em style="color:var(--mu)">should never</em> reach you');
  var Y15 = 520, Y0 = 1140, PXKM = (Y0 - Y15) / 15, VKM = 15 / (C.reaches - C.smash), NODES = [], SHOW = [[0, 0, 1], [-260, .7, .5], [200, 1.3, .55], [-130, 2.0, .45], [320, 2.6, .5], [-340, 3.1, .4], [70, 3.6, .45], [250, 4.4, .4], [-220, 5.0, .4]];
  (function build() { function node(x, h, ang, gen, id, mu) { NODES.push({ x: x, h: h, a: ang, g: gen, id: id, mu: mu }); if (mu) return; var hn = h - 1.3; if (gen >= 7 || hn < 6.2) { NODES[NODES.length - 1].stop = hn + .9; return }
      for (var c = 0; c < 2; c++) { var id2 = id * 2 + c, sp = .11 / (gen + 1) * (c ? 1 : -1) + (ih(id2, 41) - .5) * .05; node(x + Math.tan(ang) * 1.3 * PXKM, hn, ang + sp, gen + 1, id2, gen >= 1 && ih(id2, 42) < .3) } }
    node(560, 15, .02, 0, 1, false) })();
  function Yk(h) { return Y0 - h * PXKM }
  function shower1(t, a, dx, main) { var hf = 15 - (t - C.smash) * VKM;
    if (hf > 15) { if (t > C.cosmic - .3) streak(560 + dx - 30 * (hf - 15), Yk(hf + 2), 560 + dx, Yk(hf), '#fff1d6', 4, a); return hf }
    NODES.forEach(function (n) { if (hf > n.h) return; var h1 = n.mu ? 0 : (n.stop != null ? n.stop : n.h - 1.3), hEnd = Math.max(h1, hf), nx = n.x + dx, x2 = nx + Math.tan(n.a) * (n.h - hEnd) * PXKM, age = (n.h - hf) / VKM;
      var fade = n.mu ? 1 : (n.stop != null ? 1 - seg(hf, n.stop, n.stop - 2) : 1) * (1 - seg(age, 1.4, 2.6) * .55);
      streak(nx, Yk(n.h), x2, Yk(hEnd), n.mu ? COL.mu : COL.cr, n.mu ? 3 : Math.max(1.2, 4 - n.g * .4), a * fade * (n.mu ? .95 : .8));
      if (n.mu || n.g < 4) { g.save(); g.globalAlpha = a * fade * .2 * seg(age, 0, .6); g.strokeStyle = '#cfd8e6'; g.lineWidth = 6 + 10 * seg(age, 0, 2.5); g.filter = 'blur(4px)'; g.beginPath(); g.moveTo(nx, Yk(n.h)); g.lineTo(x2, Yk(hEnd)); g.stroke(); g.restore() }   // vapour trail
      if (main && n.mu && t > C.die && hf < n.h - .66) { var gx = nx + Math.tan(n.a) * .66 * PXKM + 24, gy = Yk(n.h - .66); g.save(); g.globalAlpha = a * .8 * seg(t, C.die, C.die + .3); g.strokeStyle = COL.mu; g.lineWidth = 2; g.setLineDash([5, 6]); g.beginPath(); g.moveTo(nx + 24, Yk(n.h)); g.lineTo(gx, gy); g.stroke(); g.setLineDash([]); g.beginPath(); g.moveTo(gx - 7, gy - 7); g.lineTo(gx + 7, gy + 7); g.moveTo(gx + 7, gy - 7); g.lineTo(gx - 7, gy + 7); g.stroke(); g.restore() }
      if (n.mu && hf <= 0 && hf > -1.5) { f.globalAlpha = a * (1 + hf / 1.5); f.fillStyle = COL.mu; f.beginPath(); f.arc(x2, Y0, 8, 0, 7); f.fill() } });
    f.globalAlpha = 1; return hf }
  SC.push(function (t, a) { var l = t - S[3];
    // look up: the sky photo slides down as the camera tilts up
    g.save(); g.globalAlpha = a * .55; cover(IM.sky, 0, 380, W, 900, .45, lerp(.9, .25, io(seg(l, 0, 1.2)))); g.restore();
    var gr = g.createLinearGradient(0, 380, 0, 1280); gr.addColorStop(0, 'rgba(3,5,10,.2)'); gr.addColorStop(1, 'rgba(3,5,10,.9)'); g.fillStyle = gr; g.fillRect(0, 380, W, 900);
    SHOW.slice(1).forEach(function (s) { shower1(t - s[1], a * s[2], s[0], false) }); var hf = shower1(t, a, 0, true);
    // ruler
    g.save(); g.globalAlpha = a * seg(l, .5, 1); g.strokeStyle = 'rgba(233,238,246,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(150, Y15); g.lineTo(150, Y0); g.stroke(); g.font = '600 17px FC'; g.fillStyle = '#9aa7ba';
    for (var k = 0; k <= 15; k += 3) { var y = Yk(k); g.beginPath(); g.moveTo(140, y); g.lineTo(162, y); g.stroke(); g.fillText(k + ' km', 170, y + 6) }
    g.strokeStyle = 'rgba(157,255,90,.5)'; g.beginPath(); g.moveTo(130, Y0); g.lineTo(930, Y0); g.stroke(); g.fillStyle = '#9dff5a'; g.fillText('GROUND · YOU', 170, Y0 + 26);
    if (hf > 0 && hf < 15) { g.strokeStyle = 'rgba(255,241,214,.35)'; g.setLineDash([3, 7]); g.beginPath(); g.moveTo(230, Yk(hf)); g.lineTo(930, Yk(hf)); g.stroke(); g.setLineDash([]) } g.restore();
    // time-dilation clocks: ground clock 0 -> 50 us while the front falls 15 km; the muon's clock runs gamma = 23x slower (2.2 us)
    var ca = a * seg(t, C.lives - .2, C.lives + .2), us = 50 * seg(t, C.smash, C.reaches);
    [[800, 640, 'OUR CLOCK', us, '#e9eef6'], [800, 870, 'MUON’S CLOCK', us / 23, COL.mu]].forEach(function (d, i) { if (ca <= 0) return; g.save(); g.globalAlpha = ca;
      g.fillStyle = 'rgba(3,5,10,.7)'; g.beginPath(); g.arc(d[0], d[1], 90, 0, 7); g.fill(); g.strokeStyle = 'rgba(233,238,246,.22)'; g.lineWidth = 8; g.beginPath(); g.arc(d[0], d[1], 78, 0, 7); g.stroke();
      g.strokeStyle = d[4]; g.beginPath(); g.arc(d[0], d[1], 78, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (i ? d[3] / 2.2 : d[3] / 50) * (i ? 2.2 / 50 : 1)); g.stroke();
      g.font = '800 32px AB'; g.fillStyle = d[4]; g.textAlign = 'center'; g.fillText(d[3].toFixed(1) + ' µs', d[0], d[1] + 11); g.font = '600 14px FC'; g.fillStyle = '#9aa7ba'; g.fillText(d[2], d[0], d[1] + 118);
      if (i && t > C.clock) { var pz = Math.max(0, 1 - (t - C.clock) / .5); g.strokeStyle = COL.mu; g.lineWidth = 4; g.globalAlpha = ca * pz; g.beginPath(); g.arc(d[0], d[1], 90 + 30 * (1 - pz), 0, 7); g.stroke() } g.restore() });
    label('× = where a muon dies without Einstein (~660 m)', COL.mu, 110, 1186, a * seg(t, C.die, C.die + .3), 17);
    var ein = seg(t, C.einstein, C.einstein + .25); if (ein > 0) tag('EINSTEIN: γ ≈ 23 → 2.2 µs LASTS 50 µs FOR US', COL.mu, 110, 1214, a * ein);
    tag('SLOWED ≈ 110,000×', COL.cr, 750, 1186, a * seg(t, C.smash, C.smash + .3) * (1 - ein));
    hB.querySelector('.h').innerHTML = t < C.einstein ? 'Muons <em style="color:var(--mu)">should never</em> reach you' : '<em style="color:var(--mu)">Einstein</em> says they do';
  });
  ev(S[3], 'whoosh'); ev(C.cosmic, 'riser'); ev(C.smash, 'boom'); ev(C.die, 'tick'); ev(C.reaches, 'hit'); ev(C.einstein, 'chime'); ev(C.clock, 'pulse');
  // 4 your palm, real time: ~1.7 muons per second through 100 cm2 ---------------------------------------------------------------------
  mk('// GROUND LEVEL · REAL TIME', 'One through <em style="color:var(--mu)">your palm</em> every second');
  var MU = [S[4] + .2, S[4] + .78, S[4] + 1.42];   // ~1.7 /s: Poisson-like spacing, all inside the scene
  SC.push(function (t, a) { var l = t - S[4];
    // a 10 x 10 grid of 1 cm tiles (a pixel tracker the size of a palm): tiles on a muon's path flash and fade
    g.save(); g.globalAlpha = a; for (var ti = 0; ti < 10; ti++) for (var tj = 0; tj < 10; tj++) { var tx = 280 + ti * 52, ty = 560 + tj * 52, hit = 0;
      MU.forEach(function (t0, i) { var age = t - t0; if (age < 0) return; var x0 = 400 + i * 120 + ih(i, 51) * 60, ang = (ih(i, 52) - .5) * .5, xm = x0 + Math.tan(ang) * (ty + 26 - 470); if (Math.abs(xm - tx - 26) < 30 && age > (ty - 470) / 900 * .06) hit = Math.max(hit, 1 - seg(age, .1, 1.3)) });
      g.fillStyle = hit > 0 ? 'rgba(255,79,216,' + (.15 + .6 * hit) + ')' : 'rgba(255,79,216,.05)'; g.fillRect(tx + 3, ty + 3, 46, 46) } g.restore();
    square(540, 820, a, COL.mu, '10 × 10 cm ≈ your palm', 260);
    // detector trace: one spike per muon, scrolling left in real time
    g.save(); g.globalAlpha = a; g.strokeStyle = 'rgba(255,79,216,.25)'; g.strokeRect(110, 1110, 808, 60); g.beginPath(); g.strokeStyle = COL.mu; g.lineWidth = 2;
    for (var xx = 112; xx < 916; xx += 2) { var tt = t - (916 - xx) / 450, v = 0; MU.forEach(function (t0) { var q = tt - t0; if (q >= 0 && q < .06) v = Math.max(v, Math.exp(-q / .012)) }); var yv = 1150 - v * 36 - (ih(Math.floor(tt * 400), 55) - .5) * 3; if (xx === 112) g.moveTo(xx, yv); else g.lineTo(xx, yv) } g.stroke();
    g.font = '600 14px FC'; g.fillStyle = COL.dim; g.fillText('DETECTOR TRACE', 120, 1128); g.restore();
    MU.forEach(function (t0, i) { label('HIT ' + (i + 1) + ' · +' + (t0 - S[4]).toFixed(2) + ' s', COL.mu, 918, 600 + i * 30, a * seg(t, t0, t0 + .1), 16, 'right') });
    MU.forEach(function (t0, i) { var age = t - t0; if (age < 0) return; var x0 = 400 + i * 120 + ih(i, 51) * 60, ang = (ih(i, 52) - .5) * .5, x1 = x0 + Math.tan(ang) * 700;
      var d = cl(age / .06), yA = 470, yB = 470 + 700 * d;   // crosses the frame in 0.06 s (visibly instantaneous: real time)
      streak(x0, yA, lerp(x0, x1, d), yB, COL.mu, 4, a * (1 - seg(age, .5, 1.6)));
      g.save(); g.globalAlpha = a * .35 * (1 - seg(age, 0, 2.2)); g.strokeStyle = '#d8e2f0'; g.lineWidth = 6 + 26 * seg(age, 0, 2); g.filter = 'blur(6px)'; g.beginPath(); g.moveTo(x0, yA); g.lineTo(lerp(x0, x1, d), yB); g.stroke(); g.restore() });   // cloud-chamber trail spreads
    tag('REAL TIME · ~1.7 PER SECOND', COL.mu, 110, 1190, a * seg(l, .2, .4)) });
  MU.forEach(function (x) { ev(x, 'geiger') });
  // 5 inside you: ~4,000 K-40 decays per second, real time, inside a 70 L body-volume cube ---------------------------------------------
  mk('// POTASSIUM-40 · INSIDE YOUR BODY', 'You are <em style="color:var(--de)">radioactive</em>');
  function cubePts(t) { var a1 = t * .35, a2 = .45, s = 300, cx = 540, cy = 830; return function (k) { var x = ih(k, 61) - .5, y = ih(k, 62) - .5, z = ih(k, 63) - .5, c = Math.cos(a1), sn = Math.sin(a1), X = x * c + z * sn, Z = -x * sn + z * c, Y = y * Math.cos(a2) - Z * Math.sin(a2); return [cx + X * s * 1.4, cy + Y * s * 1.4] } }
  SC.push(function (t, a) { var l = t - S[5], a1 = t * .35, a2 = .45, s = 300 * 1.4, cx = 540, cy = 830;
    var V = []; [-.5, .5].forEach(function (x) { [-.5, .5].forEach(function (y) { [-.5, .5].forEach(function (z) { var c = Math.cos(a1), sn = Math.sin(a1), X = x * c + z * sn, Z = -x * sn + z * c, Y = y * Math.cos(a2) - Z * Math.sin(a2); V.push([cx + X * s, cy + Y * s]) }) }) });
    g.save(); g.globalAlpha = a * .5; g.fillStyle = 'rgba(40,110,160,.10)'; [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]].forEach(function (q) { g.beginPath(); q.forEach(function (v, i) { g[i ? 'lineTo' : 'moveTo'](V[v][0], V[v][1]) }); g.closePath(); g.fill() }); g.restore();
    g.save(); g.globalAlpha = a * .7; g.strokeStyle = 'rgba(157,255,90,.55)'; g.lineWidth = 2; [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { g.beginPath(); g.moveTo(V[e[0]][0], V[e[0]][1]); g.lineTo(V[e[1]][0], V[e[1]][1]); g.stroke() }); g.restore();
    decays(t, 4000, cubePts(t), a); square(540, 830, a * .7, COL.de, '', 40);
    label('YOU ≈ 70 kg ≈ 70 L ≈ a 41 cm cube of water', COL.de, 540, 1110, a * seg(l, .3, .6), 18, 'center');
    tag('⁴⁰K → ⁴⁰Ca + e⁻ + ν̄   (89%)', COL.de, 110, 1150, a * seg(t, C.potassium, C.potassium + .3));
    tag('REAL TIME · ~4,000 PER SECOND', COL.de, 110, 1196, a * seg(t, C.k4, C.k4 + .3)) });
  ev(S[5], 'whoosh'); ev(C.k4, 'geigerbuzz');
  // 6 bananas: Blender rigid-body pour (real time, 24 fps) + the same ~4,000 decays/s inside them -----------------------------------------
  mk('// BANANA EQUIVALENT · ~15 DECAYS/s EACH', '≈ <em style="color:var(--de)">260 bananas</em> of radioactivity');
  var BAN = [], BPTS = []; for (var bi = 1; bi <= 112; bi++) BAN.push(img('3d/ban/ban_' + String(bi).padStart(3, '0') + '.png'));
  var BX = 90, BY = 470, BW = 900, BH = 1000;
  function banFrame(t) { return cl(Math.floor(12 + (t - S[6]) * 24), 0, BAN.length - 1) }
  function banPts(k) { if (BPTS[k]) return BPTS[k]; var im = BAN[k]; if (!im.complete || !im.naturalWidth) return null; var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d'); x.drawImage(im, 0, 0);
    var d = x.getImageData(0, 0, c.width, c.height).data, pts = []; for (var yy = 0; yy < c.height; yy += 3) for (var xx = 0; xx < c.width; xx += 3) { var o = (yy * c.width + xx) * 4; if (d[o + 3] > 200 && d[o] > 120 && d[o + 1] > 90 && d[o + 2] < 120) pts.push([BX + xx / c.width * BW, BY + yy / c.height * BH]) } return (BPTS[k] = pts) }
  SC.push(function (t, a) { var fr = banFrame(t), im = BAN[fr]; g.save(); g.globalAlpha = a; if (im.complete && im.naturalWidth) g.drawImage(im, BX, BY, BW, BH); g.restore();
    var pts = banPts(fr); if (pts && pts.length) decays(t, 4000, function (k) { return pts[Math.floor(ih(k, 5) * pts.length)] }, a);
    tag('REAL GRAVITY · REAL-TIME DECAYS', COL.de, 110, 1186, a * seg(t, S[6] + .2, S[6] + .5)) });
  ev(S[6], 'whoosh'); ev(S[6] + .3, 'thuds'); ev(C.bananas, 'pop');
  // 7 meteors at the airglow layer, over a real photo of Earth at night from orbit ------------------------------------------------------
  mk('// SPACE DUST · 80–120 km UP', '<em style="color:var(--me)">44 tonnes</em> of space dust a day');
  SC.push(function (t, a) { var l = t - S[7];
    g.save(); g.globalAlpha = a; cover(IM.night, 0, 470, W, 760, lerp(.25, .4, l / 6), .2, 1.05); g.restore();
    var gr = g.createLinearGradient(0, 470, 0, 1230); gr.addColorStop(0, 'rgba(3,5,10,0)'); gr.addColorStop(.85, 'rgba(3,5,10,.2)'); gr.addColorStop(1, 'rgba(3,5,10,1)'); g.fillStyle = gr; g.fillRect(0, 470, W, 760);
    var gt = g.createLinearGradient(0, 470, 0, 560); gt.addColorStop(0, 'rgba(3,5,10,1)'); gt.addColorStop(1, 'rgba(3,5,10,0)'); g.fillStyle = gt; g.fillRect(0, 470, W, 90);
    // meteors: enter, brighten, decelerate, burn out; a faint glowing train lingers (sped up 4x so the streaks read)
    var rate = 26, life = .9, k0 = Math.floor((t - life - 1.5) * rate), k1 = Math.floor(t * rate);
    for (var k = k0; k <= k1; k++) { var tk = k / rate, age = t - tk; if (age < 0 || age > life + 1.5) continue;
      var x0 = 60 + ih(k, 71) * 960, y0 = 540 + ih(k, 72) * 520, ang = .5 + ih(k, 73) * .9, v0 = 900 + ih(k, 74) * 900, tau = .45;
      var u = Math.min(age, life), dist = v0 * tau * (1 - Math.exp(-u / tau)), xe = x0 + Math.cos(ang) * dist, ye = y0 + Math.sin(ang) * dist;
      var br = Math.sin(Math.PI * cl(u / life)) ** .7 * (age < life ? 1 : 0), tl = Math.min(dist, 90);
      if (br > 0) { streak(xe - Math.cos(ang) * tl, ye - Math.sin(ang) * tl, xe, ye, COL.me, 3, a * br); f.globalAlpha = a * br; f.fillStyle = '#fff6dc'; f.beginPath(); f.arc(xe, ye, 3.5, 0, 7); f.fill() }
      var tr = a * .25 * (1 - seg(age, life * .5, life + 1.5)); if (tr > 0) { g.save(); g.globalAlpha = tr; g.strokeStyle = '#b9ffcf'; g.lineWidth = 3; g.filter = 'blur(2px)'; g.beginPath(); g.moveTo(x0 + Math.cos(ang) * dist * .2, y0 + Math.sin(ang) * dist * .2); g.lineTo(xe, ye); g.stroke(); g.restore() } }
    f.globalAlpha = 1;
    var kg = .509 * t; big(kg.toFixed(1) + ' kg', COL.me, 920, 1150, a * seg(t, C.t44, C.t44 + .3), 50, 'right'); label('landed since you pressed play (0.5 kg/s)', COL.ink, 920, 1180, a * seg(t, C.t44, C.t44 + .3), 16, 'right');
    tag('11–72 km/s · BURN 80–120 km UP', COL.me, 110, 1214, a * seg(t, C.k70 - .3, C.k70)); tag('SPED UP 4× · REAL PHOTO, ISS', COL.me, 110, 1168, a * seg(l, .3, .6)) });
  ev(S[7], 'whoosh'); ev(C.t44, 'hit'); ev(C.k70, 'riser');
  // 8 speed stack: sitting still -> Earth spins -> orbits the Sun -> circles the galaxy ------------------------------------------------
  mk('// YOU ARE NEVER STILL', 'You’ve <em style="color:var(--sp)">never</em> sat still');
  var ETX = null; function earthTex() { if (ETX) return ETX; var im = IM.earth; if (!im.complete || !im.naturalWidth) return null; var c = document.createElement('canvas'); c.width = 1024; c.height = 512; var x = c.getContext('2d'); x.drawImage(im, 0, 0, 1024, 512); ETX = x.getImageData(0, 0, 1024, 512).data; return ETX }
  var GL = document.createElement('canvas'); GL.width = 420; GL.height = 420; var gx2 = GL.getContext('2d'), GD = gx2.createImageData(420, 420);
  function globe(t, x0, y0, R, a, lon0) {   // orthographic globe from the Blue Marble texture; rotates west -> east (texture longitude increases)
    var T = earthTex(); if (!T || a <= 0) return; var N = 420, d = GD.data, tilt = .41;
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) { var o = (j * N + i) * 4, X = (i - N / 2) / (N / 2), Y = (j - N / 2) / (N / 2), r2 = X * X + Y * Y; if (r2 > 1) { d[o + 3] = 0; continue }
      var Z = Math.sqrt(1 - r2), y2 = Y * Math.cos(tilt) - Z * Math.sin(tilt), z2 = Y * Math.sin(tilt) + Z * Math.cos(tilt), lat = Math.asin(-y2), lon = Math.atan2(X, z2) + lon0;
      var u = ((lon / 6.283 + .5) % 1 + 1) % 1, v = .5 - lat / Math.PI, p = (Math.floor(v * 511) * 1024 + Math.floor(u * 1023)) * 4, sh = .25 + .75 * Math.max(0, X * -.55 + Z * .8);
      d[o] = T[p] * sh; d[o + 1] = T[p + 1] * sh; d[o + 2] = T[p + 2] * sh; d[o + 3] = 255 }
    gx2.putImageData(GD, 0, 0); g.save(); g.globalAlpha = a; g.drawImage(GL, x0 - R, y0 - R, 2 * R, 2 * R); var at = g.createRadialGradient(x0, y0, R * .95, x0, y0, R * 1.08); at.addColorStop(0, 'rgba(120,180,255,.0)'); at.addColorStop(.5, 'rgba(120,180,255,.35)'); at.addColorStop(1, 'rgba(120,180,255,0)'); g.fillStyle = at; g.beginPath(); g.arc(x0, y0, R * 1.08, 0, 7); g.fill(); g.restore() }
  var STARS = []; for (var si = 0; si < 5200; si++) { var arm = si % 4, rr = Math.pow(ih(si, 81), .6) * 300 + 20, th = Math.log(rr / 20) / .28 + arm * Math.PI / 2 + (ih(si, 82) - .5) * (arm % 2 ? .55 : .35); STARS.push([rr, th, ih(si, 83)]) }
  SC.push(function (t, a) { var l = t - S[8], p1 = seg(t, C.spinning - .2, C.spinning + .3), p2 = seg(t, C.orbiting - .2, C.orbiting + .3), p3 = seg(t, C.racing - .2, C.racing + .3);
    // phase 0: you, sitting still
    var a0 = a * (1 - p1); if (a0 > 0) { g.save(); g.globalAlpha = a0; cover(IM.latte, 140, 520, 800, 560, .3, .5); g.restore(); big('0 km/h ?', COL.sp, 540, 1150, a0 * seg(l, .2, .5), 60, 'center') }
    // phase 1: Earth spins (sped up 14,400x: one day in 6 s)
    var a1 = a * p1 * (1 - p2); if (a1 > 0) { var lon0 = 1.75 - (t - C.spinning) * 6.283 / 6; globe(t, 540, 790, 250, a1, lon0);
      // Mumbai (19.1 N, 72.9 E) carried round with the surface; centre longitude falls as the Earth turns eastward
      var la = .333, dl = 1.272 - lon0, Xm = Math.cos(la) * Math.sin(dl), Zr = Math.cos(la) * Math.cos(dl), y2 = -Math.sin(la), Ym = y2 * Math.cos(.41) + Zr * Math.sin(.41), Zm = -y2 * Math.sin(.41) + Zr * Math.cos(.41);
      if (Zm > .15) square(540 + Xm * 250, 790 + Ym * 250, a1 * seg(Zm, .15, .35), COL.sp, 'Mumbai ≈ 1,580 km/h', 18); tag('SPED UP 14,400× · ONE DAY IN 6 s', COL.sp, 110, 1150, a1) }
    // phase 2: orbits (sped up: one year in 4 s); Kepler periods Mercury 88 d, Venus 225 d, Earth 365 d, Mars 687 d, all counter-clockwise
    var a2 = a * p2 * (1 - p3); if (a2 > 0) { var cx = 540, cy = 790; sun(t, a2, cx, cy, 34); [[.39, 88, 70, '#b9b0a4'], [.72, 225, 130, '#e9d29a'], [1, 365, 200, '#4aa3ff'], [1.52, 687, 300, '#e06a3a']].forEach(function (pl) {
        g.save(); g.globalAlpha = a2 * .35; g.strokeStyle = '#8d9aae'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx, cy, pl[2], pl[2] * .55, 0, 0, 7); g.stroke(); g.restore();
        var th = -(t - C.orbiting) * 6.283 / 4 * 365 / pl[1] + pl[0] * 3; var px = cx + Math.cos(th) * pl[2], py = cy + Math.sin(th) * pl[2] * .55;
        f.globalAlpha = a2; f.fillStyle = pl[3]; f.beginPath(); f.arc(px, py, pl[1] === 365 ? 13 : 9, 0, 7); f.fill(); if (pl[1] === 365) square(px, py, a2, COL.sp, '107,000 km/h', 22) });
      f.globalAlpha = 1; tag('SPED UP · ONE YEAR IN 4 s', COL.sp, 110, 1150, a2) }
    // phase 3: the galaxy, and the solar system's true helix (planets coil around the moving Sun; the Sun never leads like a comet)
    var a3 = a * p3; if (a3 > 0) { var gcx = 540, gcy = 740, rot = -(t - C.racing) * .05;
      STARS.forEach(function (s) { var x = gcx + Math.cos(s[1] + rot) * s[0] * 1.35, y = gcy + Math.sin(s[1] + rot) * s[0] * .55; f.globalAlpha = a3 * (.35 + .65 * s[2]); f.fillStyle = s[2] > .9 ? '#ffe7b0' : '#b8cfff'; var zz = s[2] > .97 ? 3 : 2; f.fillRect(x, y, zz, zz) });
      var core = g.createRadialGradient(gcx, gcy, 0, gcx, gcy, 120); core.addColorStop(0, 'rgba(255,231,176,.9)'); core.addColorStop(1, 'rgba(255,231,176,0)'); g.save(); g.globalAlpha = a3; g.fillStyle = core; g.beginPath(); g.ellipse(gcx, gcy, 140, 70, 0, 0, 7); g.fill(); g.restore();
      // inset: Sun moving right-to-left along its path; Earth's helix around it (axis tilted ~60 deg to the motion)
      var ix = 540, iy = 975, vx = -110; for (var q = 0; q < 220; q++) { var tt = (t - C.racing) - q * .012; if (tt < 0) break; var sxp = ix + 200 + vx * tt, ph = tt * 6.283 * 1.6, ex = sxp + Math.cos(ph) * 14, ey = iy + Math.sin(ph) * 40 * Math.cos(.52); f.globalAlpha = a3 * (1 - q / 220); f.fillStyle = '#4aa3ff'; f.fillRect(ex, ey, 3, 3); if (q % 6 === 0) { f.fillStyle = '#ffd27a'; f.fillRect(sxp, iy, 3, 3) } }
      f.globalAlpha = 1; var s0x = ix + 200 + vx * Math.max(0, t - C.racing); sun(t, a3, s0x, iy, 9);
      var sp2 = gcx + Math.cos(.9 + rot) * 230 * 1.35, sq2 = gcy + Math.sin(.9 + rot) * 230 * .55; square(sp2, sq2, a3, COL.sp, 'us · 828,000 km/h', 14);
      label('one lap of the galaxy ≈ 230 million years', COL.ink, 540, 1150, a3 * seg(t, C.galaxy, C.galaxy + .3), 17, 'center');
      label('the planets coil around the moving Sun — it never leads like a comet', COL.dim, 540, 1178, a3 * seg(t, C.k800, C.k800 + .3), 15, 'center') }
    // odometers stacking down the right side
    [[C.k1600, '1,670', 'km/h · SPIN'], [C.k107, '107,000', 'km/h · ORBIT'], [C.k800, '828,000', 'km/h · GALAXY']].forEach(function (o, i) { var u = seg(t, o[0] - .1, o[0] + .25); if (u <= 0) return; var x = 110 + i * 274, y = 1084; g.save(); g.globalAlpha = a * u; g.fillStyle = 'rgba(3,5,10,.8)'; g.fillRect(x, y - 46, 260, 64); g.strokeStyle = COL.sp; g.lineWidth = 2; g.strokeRect(x, y - 46, 260, 64); g.restore(); big(o[1], COL.sp, x + 14, y - 4, a * u, 34); label(o[2], COL.dim, x + 14, y + 12, a * u, 12) }) });
  ev(S[8], 'whoosh'); ev(C.spinning, 'whoosh'); ev(C.k1600, 'tick'); ev(C.orbiting, 'whoosh'); ev(C.k107, 'tick'); ev(C.racing, 'riser'); ev(C.k800, 'boom');
  // 9 finale: everything at once, then the CTA -------------------------------------------------------------------------------------------
  mk('// ALL OF THIS · EVERY SECOND', 'All of this. <em style="color:var(--nu)">Right now.</em> To you.');
  SC.push(function (t, a) { var l = t - S[9], fade = 1 - seg(t, C.follow - .4, C.follow + .2) * .55;
    rain(t, 3200, a * .8 * fade);
    for (var i = 0; i < 8; i++) { var t0 = S[9] + i * .7, age = (t - t0) % 5.6; var x0 = 200 + ih(i, 91) * 680; streak(x0, 470, x0 + 30, 470 + Math.min(1, age / .06) * 760, COL.mu, 3, a * fade * (1 - seg(age, .4, 1.4))) }
    decays(t, 900, function (k) { return [140 + ih(k, 92) * 800, 480 + ih(k, 93) * 700] }, a * fade);
    square(540, 860, a * (1 - seg(t, C.follow - .3, C.follow)), COL.nu, '1 cm² · your thumbnail');
    var e = seg(t, C.follow - .3, C.follow + .1); $('end').style.opacity = e; $('end').style.transform = 'scale(' + lerp(.9, 1, e3(e)) + ')';
    if (t > C.follow + .3) { var b = (t - C.follow - .3) % 1.4; $('fo').style.transform = 'scale(' + (1 + .07 * Math.sin(Math.min(b, .4) / .4 * Math.PI)) + ')' } });
  ev(S[9], 'boom'); ev(C.follow, 'chime');
  for (var i2 = 1; i2 < S.length; i2++) ev(S[i2] - .1, 'swish');

  // ---- captions, host, seek --------------------------------------------------------------------------------------------------------
  function cap(t) { var CP = TM.CAP, k = -1; for (var i = 0; i < CP.length; i++) if (t >= CP[i][0] - .05) k = i; var c = $('cap'); if (k < 0) { c.style.opacity = 0; return }
    var ws = CP[k][2], h = ''; ws.forEach(function (w, j) { var on = t >= w[1] && (j === ws.length - 1 || t < ws[j + 1][1]); h += (j ? ' ' : '') + (on ? '<b>' + w[0] + '</b>' : w[0]) }); c.innerHTML = h; c.style.opacity = 1 }
  var vid = $('hostv'), avc = $('avc'), hx = avc.getContext('2d'), lastF = -1;
  function hostSeek(t) { if (!vid.duration) return Promise.resolve(); var fr = Math.floor(t * 24); if (fr === lastF) return Promise.resolve(); lastF = fr; var ft = Math.min((fr + .5) / 24, vid.duration - .02);
    return new Promise(function (res) { var dn = function () { vid.removeEventListener('seeked', dn); hx.clearRect(0, 0, 544, 544); hx.drawImage(vid, 0, 0, 544, 544); res() }; vid.addEventListener('seeked', dn); vid.currentTime = ft }) }
  window.EV = EV.sort(function (a, b) { return a[0] - b[0] });
  window.__reelDurationSec = END;
  window.__seek = function (t) {
    t = Math.max(0, Math.min(END - 1e-3, t)); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); f.clearRect(0, 0, W, H); bg(t);
    // sequential cuts with a small "dive": the outgoing scene pushes in and clears in .22 s, the incoming settles from 0.94 in .2 s
    SC.forEach(function (fn, si) { var s0 = S[si], s1 = si + 1 < S.length ? S[si + 1] : END, op = 0, sc = 1;
      if (t >= s0 && t < s1) { op = Math.min(seg(t, s0, s0 + .2) || (si === 0 ? 1 : 0), si < S.length - 1 ? 1 - seg(t, s1 - .22, s1) : 1); if (si === 0) op = Math.min(1, si < S.length - 1 ? 1 - seg(t, s1 - .22, s1) : 1); sc = lerp(.94, 1, e3(seg(t, s0, s0 + .2))) * lerp(1, 1.06, seg(t, s1 - .22, s1)); if (si === 0) sc = lerp(1, 1.06, seg(t, s1 - .22, s1)) }
      DOMS[si].style.opacity = op; DOMS[si].style.transform = 'scale(' + sc + ')';
      if (op > 0) { g.save(); f.save(); [g, f].forEach(function (c) { c.translate(540, 860); c.scale(sc, sc); c.translate(-540, -860) }); fn(t, op); g.restore(); f.restore() } });
    sx.clearRect(0, 0, sm.width, sm.height); sx.filter = 'blur(3px)'; sx.drawImage(fx, 0, 0, sm.width, sm.height); sx.filter = 'none';
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .9; g.drawImage(sm, 0, 0, W, H); g.globalAlpha = 1; g.drawImage(fx, 0, 0); g.restore();
    var scr = g.createLinearGradient(0, 40, 0, 520); scr.addColorStop(0, 'rgba(3,5,10,0)'); scr.addColorStop(.2, 'rgba(3,5,10,.82)'); scr.addColorStop(.7, 'rgba(3,5,10,.5)'); scr.addColorStop(1, 'rgba(3,5,10,0)'); g.fillStyle = scr; g.fillRect(0, 40, W, 480);
    var gl = 1 - seg(Math.abs(t - nearestCut(t)), 0, .08); if (gl > 0) { g.save(); g.globalAlpha = gl * .16; g.fillStyle = '#e8f6ff'; g.fillRect(0, 0, W, H); g.restore() }   // a faint flash on every cut
    $('c1').textContent = fmt(6.5e10 * t); $('c2').textContent = fmt(100 / 60 * t); $('c3').textContent = fmt(4000 * t);
    cap(t); return hostSeek(t) };
  function nearestCut(t) { var b = 1e9; for (var i = 1; i < S.length; i++) if (Math.abs(t - S[i]) < Math.abs(t - b)) b = S[i]; return b }
  window.__ready = false;
  var waits = ['900 74px AB', '600 18px FC', '700 30px Inter', '800 32px AB'].map(function (x) { return document.fonts.load(x) })
    .concat(Object.keys(IM).map(function (k) { var im = IM[k]; return new Promise(function (r) { if (im.complete) r(); else { im.onload = r; im.onerror = r } }) }))
    .concat(BAN.map(function (im) { return new Promise(function (r) { if (im.complete) r(); else { im.onload = r; im.onerror = r } }) }))
    .concat([new Promise(function (r) { if (vid.readyState >= 2) r(); vid.addEventListener('loadeddata', r); setTimeout(r, 8000) })]);
  Promise.all(waits).catch(function () {}).then(function () { return window.__seek(0) }).then(function () { window.__ready = true });
})();
