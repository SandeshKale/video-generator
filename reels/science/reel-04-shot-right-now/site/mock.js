// Mockup (3 scenes, silent): A neutrino rain through a life-size phone screen + pull-back through Earth,
// B cosmic-ray air shower with time-dilation clocks, C rigid-body banana pile with real-time K-40 decays.
// Everything is a pure function of t. Physics constants and the time-scale used are printed on screen.
(function () {
  var W = 1080, H = 1920, cv = document.getElementById('cv'), g = cv.getContext('2d');
  var fx = document.createElement('canvas'); fx.width = W; fx.height = H; var f = fx.getContext('2d');
  var sm = document.createElement('canvas'); sm.width = W / 4; sm.height = H / 4; var s = sm.getContext('2d');
  var $ = function (id) { return document.getElementById(id) };
  function cl(x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)) }
  function seg(t, a, b) { return cl((t - a) / (b - a)) }
  function e3(x) { return 1 - Math.pow(1 - x, 3) } function io(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }
  function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  function ih(k, salt) { var x = (Math.floor(k) * 2654435761 ^ (salt * 2246822519)) >>> 0; x = Math.imul(x ^ (x >>> 16), 2246822507) >>> 0; x = Math.imul(x ^ (x >>> 13), 3266489909) >>> 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967296 }   // integer hash (no lattice artefacts)
  function fmt(n) { return Math.floor(n).toLocaleString('en-US') }
  var SA = [0, 5.2], SB = [5.2, 9.6], SC = [9.6, 13.4], END = 13.4;

  // ---- A: neutrino rain. Screen = a phone screen at life size (1080 px = 7 cm). Slowed 1e9x: speed c/1e9 = 30 cm/s.
  // Flux 6.5e10 /cm2/s x ~87 cm2 = 5.7e12 /s real -> 5,660 per video second. Tracks are parallel (the Sun is far away).
  var PXCM = 1080 / 7, VNU = 30 * PXCM, RATE = 5660, DIR = (function () { var x = .5, y = 1, l = Math.hypot(x, y); return [x / l, y / l] })();
  function rain(t, scale, ox, oy, alpha) {
    var span = 2200 / VNU, k0 = Math.floor((t - span) * RATE), k1 = Math.floor((t + span) * RATE);
    f.lineCap = 'round';
    for (var k = k0; k <= k1; k++) {
      var tk = k / RATE, px = ih(k, 1) * 1500 - 210, py = ih(k, 2) * 2300 - 190, d = (t - tk) * VNU;
      var x = px + DIR[0] * d, y = py + DIR[1] * d; if (y < -100 || y > 2020 || x < -100 || x > 1180) continue;
      var L = VNU / 60, X = ox + (x - ox) * scale, Y = oy + (y - oy) * scale, Lx = DIR[0] * L * scale, Ly = DIR[1] * L * scale;
      f.globalAlpha = alpha * (.35 + .65 * ih(k, 3)); f.strokeStyle = '#9fe8ff'; f.lineWidth = 2.2 * Math.max(.5, scale);
      f.beginPath(); f.moveTo(X - Lx, Y - Ly); f.lineTo(X, Y); f.stroke();
    }
    f.globalAlpha = 1;
  }
  // Earth cross-section with the same parallel stream crossing it unaffected (slowed so it crosses in ~1.1 s: x0.04 s real)
  function earth(t, a) {
    var cx = 540, cy = 880, R = 300; g.save(); g.globalAlpha = a;
    var L = [[1, '#1d3a5a'], [.995, '#2c4b2f'], [.88, '#6a3b1c'], [.55, '#c9631f'], [.19, '#ffd27a']];   // crust, mantle, outer core, inner core
    L.forEach(function (l, i) { var gr = g.createRadialGradient(cx - R * .2, cy - R * .2, 0, cx, cy, R * l[0]); gr.addColorStop(0, l[1]); gr.addColorStop(1, i ? l[1] : '#0d2238'); g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R * l[0], 0, 7); g.fill() });
    g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(cx, cy, R, Math.atan2(DIR[1], DIR[0]) - Math.PI / 2, Math.atan2(DIR[1], DIR[0]) + Math.PI / 2); g.fill();   // night half faces away from the Sun
    g.restore();
    var sp = 2 * R / 1.1, rate = 900, span = 1400 / sp, k0 = Math.floor((t - span) * rate), k1 = Math.floor(t * rate);
    for (var k = k0; k <= k1; k++) {
      var tk = k / rate, off = (ih(k, 4) - .5) * 1200, d = (t - tk) * sp - 700;
      var x = cx + DIR[0] * d - DIR[1] * off, y = cy + DIR[1] * d + DIR[0] * off;
      f.globalAlpha = a * (.4 + .6 * hash(k + 9)); f.strokeStyle = '#9fe8ff'; f.lineWidth = 2;
      f.beginPath(); f.moveTo(x - DIR[0] * 40, y - DIR[1] * 40); f.lineTo(x, y); f.stroke();
    }
    f.globalAlpha = 1;
  }
  // ---- B: Heitler air shower. Altitude 15 km -> 0 over the stage; slowed 80,000x (front moves at c/80000 = 3.75 km/s).
  var Y15 = 560, Y0 = 1180, PXKM = (Y0 - Y15) / 15, VKM = 3.75, NODES = [], SHOW = [[0, 0, 1], [-250, .9, .55], [190, 1.6, .6], [-120, 2.3, .45], [300, 2.9, .5], [-330, 3.4, .4], [60, 3.8, .45]];
  (function build() {
    function node(x, h, ang, gen, id, mu) { NODES.push({ x: x, h: h, a: ang, g: gen, id: id, mu: mu }); if (mu) return;
      var hn = h - 1.3; if (gen >= 7 || hn < 6.2) { NODES[NODES.length - 1].stop = hn + .9; return }
      for (var c = 0; c < 2; c++) { var id2 = id * 2 + c, sp = .11 / (gen + 1) * (c ? 1 : -1) + (hash(id2) - .5) * .05;
        var isMu = gen >= 1 && hash(id2 * 3.7 + 77) < .3; var hx = x + Math.tan(ang) * 1.3 * PXKM; node(hx, hn, ang + sp, gen + 1, id2, isMu) } }
    node(560, 15, .02, 0, 1, false);
  })();
  function shower(t, a) {
    var hf0 = 0; SHOW.slice(1).forEach(function (S) { one(t - S[1], a * S[2], S[0], true) }); return one(t, a, 0, false);
  }
  function one(t, a, dx, bgr) {
    var t0 = SB[0] + .35, hf = 15.6 - (t - t0) * VKM;          // shower front altitude (km)
    function Y(h) { return Y0 - h * PXKM }
    // incoming primary proton
    if (hf > 15) { f.globalAlpha = a; f.strokeStyle = '#fff1d6'; f.lineWidth = 4; f.beginPath(); f.moveTo(560 + dx - 6, Y(hf + 1.2)); f.lineTo(560 + dx, Y(hf)); f.stroke() }
    NODES.forEach(function (n) {
      var h1 = n.mu ? 0 : (n.stop != null ? n.stop : n.h - 1.3); if (hf > n.h) return;
      var hEnd = Math.max(h1, hf), x2 = n.x + dx + Math.tan(n.a) * (n.h - hEnd) * PXKM, nx = n.x + dx;
      var age = (n.h - hf) / VKM, col = n.mu ? '#ff4fd8' : '#ff8a2a';
      var fade = n.mu ? 1 : (n.stop != null ? 1 - seg(hf, n.stop, n.stop - 2) : 1) * (1 - seg(age, 1.4, 2.6) * .55);
      f.globalAlpha = a * fade * (n.mu ? .95 : .8); f.strokeStyle = col; f.lineWidth = n.mu ? 3 : Math.max(1.2, 4 - n.g * .4);
      f.beginPath(); f.moveTo(nx, Y(n.h)); f.lineTo(x2, Y(hEnd)); f.stroke();
      if (n.mu || n.g < 4) { g.save(); g.globalAlpha = a * fade * .22 * seg(age, 0, .6); g.strokeStyle = '#cfd8e6'; g.lineWidth = 6 + 10 * seg(age, 0, 2.5); g.filter = 'blur(4px)'; g.beginPath(); g.moveTo(nx, Y(n.h)); g.lineTo(x2, Y(hEnd)); g.stroke(); g.restore() }   // cloud-chamber vapour trail behind charged tracks, widening with age
      if (n.mu && !bgr && hf < n.h - .66) {   // ghost: classical death after ~660 m without time dilation
        var gx = n.x + Math.tan(n.a) * .66 * PXKM, gy = Y(n.h - .66); g.save(); g.globalAlpha = a * .75; g.strokeStyle = '#ff4fd8'; g.lineWidth = 2; g.setLineDash([5, 6]);
        g.beginPath(); g.moveTo(n.x + 26, Y(n.h)); g.lineTo(gx + 26, gy); g.stroke(); g.setLineDash([]); g.beginPath(); g.moveTo(gx + 18, gy - 8); g.lineTo(gx + 34, gy + 8); g.moveTo(gx + 34, gy - 8); g.lineTo(gx + 18, gy + 8); g.stroke(); g.restore()
      }
      if (n.mu && hf <= 0 && hf > -1.2) { f.globalAlpha = a * (1 + hf / 1.2); f.fillStyle = '#ff4fd8'; f.beginPath(); f.arc(x2, Y0, 9, 0, 7); f.fill() }
    });
    f.globalAlpha = 1; return hf;
  }
  function ruler(a, hf) {
    g.save(); g.globalAlpha = a; g.strokeStyle = 'rgba(233,238,246,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(150, Y15); g.lineTo(150, Y0); g.stroke();
    g.font = '600 18px FC'; g.fillStyle = '#9aa7ba';
    for (var k = 0; k <= 15; k += 3) { var y = Y0 - k * PXKM; g.beginPath(); g.moveTo(140, y); g.lineTo(162, y); g.stroke(); g.fillText(k + ' km', 172, y + 6) }
    g.strokeStyle = 'rgba(157,255,90,.45)'; g.beginPath(); g.moveTo(130, Y0); g.lineTo(930, Y0); g.stroke();
    // shower front marker
    if (hf > 0) { g.strokeStyle = 'rgba(255,241,214,.35)'; g.setLineDash([3, 7]); g.beginPath(); g.moveTo(230, Y0 - hf * PXKM); g.lineTo(900, Y0 - hf * PXKM); g.stroke(); g.setLineDash([]) }
    g.restore();
  }
  function clocks(t, a) {   // ground clock 0->50 us while the front falls 15 km; the muon's own clock runs gamma = 23 times slower
    var tt = cl((t - SB[0] - .35 - 15.6 / VKM + 15 / VKM) / (15 / VKM)), us = 50 * cl((15.6 - (15.6 - (t - SB[0] - .35) * VKM)) / 15.6);
    var data = [[792, 640, 'EARTH CLOCK', us, 50, '#e9eef6'], [792, 880, 'MUON’S CLOCK', us / 23, 50, '#ff4fd8']];
    g.save(); g.globalAlpha = a;
    data.forEach(function (d) {
      var x = d[0], y = d[1]; g.strokeStyle = 'rgba(233,238,246,.25)'; g.lineWidth = 8; g.beginPath(); g.arc(x, y, 78, 0, 7); g.stroke();
      g.strokeStyle = d[5]; g.lineWidth = 8; g.beginPath(); g.arc(x, y, 78, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * d[3] / d[4]); g.stroke();
      g.font = '800 34px AB'; g.fillStyle = d[5]; g.textAlign = 'center'; g.fillText(d[3].toFixed(1) + ' µs', x, y + 12);
      g.font = '600 15px FC'; g.fillStyle = '#9aa7ba'; g.fillText(d[2], x, y + 112);
    });
    g.font = '600 17px FC'; g.fillStyle = '#ff4fd8'; g.textAlign = 'center'; g.fillText('γ ≈ 23 → 2.2 µs lasts 50 µs', 792, 1032); g.textAlign = 'left'; g.restore();
  }
  // ---- C: banana pile frames (Blender rigid body, real-time 24 fps) + K-40 decays at the real rate (~4,000 per second)
  var BAN = [], BANPTS = [];
  for (var i = 1; i <= 95; i += 2) { var im = new Image(); im.src = '3d/ban/ban_' + String(i).padStart(3, '0') + '.png'; BAN.push(im) }
  var BX = 90, BY = 520, BW = 900, BH = 1000;
  function banPts(k) {
    if (BANPTS[k]) return BANPTS[k]; var im = BAN[k]; if (!im.complete || !im.naturalWidth) return [];
    var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d'); x.drawImage(im, 0, 0);
    var d = x.getImageData(0, 0, c.width, c.height).data, pts = [];
    for (var yy = 0; yy < c.height; yy += 3) for (var xx = 0; xx < c.width; xx += 3) { var o = (yy * c.width + xx) * 4; if (d[o + 3] > 200 && d[o] > 120 && d[o + 1] > 90 && d[o + 2] < 120) pts.push([BX + xx / c.width * BW, BY + yy / c.height * BH]) }
    return (BANPTS[k] = pts);
  }
  function bananas(t, a) {
    var lt = t - SC[0] - .1, fr = cl(Math.floor(lt * 24 / 2), 0, BAN.length - 1), im = BAN[fr];
    g.save(); g.globalAlpha = a; if (im.complete && im.naturalWidth) g.drawImage(im, BX, BY, BW, BH); g.restore();
    var pts = banPts(fr); if (!pts.length) return;
    var RATE2 = 4000, life = .07, k0 = Math.floor((t - life) * RATE2), k1 = Math.floor(t * RATE2);
    for (var k = k0; k <= k1; k++) {
      var age = t - k / RATE2, p = pts[Math.floor(ih(k, 5) * pts.length)], al = a * (1 - age / life);
      f.globalAlpha = al; f.strokeStyle = '#9dff5a'; f.lineWidth = 2;
      if (hash(k + 4) < .11) { var an = hash(k + 6) * 6.283, L = 140; f.globalAlpha = al * .5; f.beginPath(); f.moveTo(p[0], p[1]); f.lineTo(p[0] + Math.cos(an) * L, p[1] + Math.sin(an) * L); f.stroke() }   // 1.46 MeV gamma: straight
      else { f.beginPath(); f.moveTo(p[0], p[1]); var x = p[0], y = p[1], an2 = hash(k + 8) * 6.283; for (var j = 0; j < 6; j++) { an2 += (hash(k * 7 + j) - .5) * 1.4; x += Math.cos(an2) * 8; y += Math.sin(an2) * 8; f.lineTo(x, y) } f.stroke() }   // beta electron: scatters, wiggly
      f.fillStyle = '#eaffd8'; f.beginPath(); f.arc(p[0], p[1], 2.4, 0, 7); f.fill();
    }
    f.globalAlpha = 1;
  }
  // ---- background: cloud-chamber haze (drifting, pure t) -------------------------------------------------------------------
  var haze = document.createElement('canvas'); haze.width = 270; haze.height = 480; (function () { var x = haze.getContext('2d'), d = x.createImageData(270, 480);
    for (var i = 0; i < 270 * 480; i++) { var n = hash(i * .37) * .6 + hash(Math.floor(i / 7) * 1.3) * .4; d.data[i * 4] = 40; d.data[i * 4 + 1] = 70; d.data[i * 4 + 2] = 110; d.data[i * 4 + 3] = n * 22 } x.putImageData(d, 0, 0) })();
  function bg(t) {
    var gr = g.createRadialGradient(540, 820, 80, 540, 900, 1300); gr.addColorStop(0, '#0b1424'); gr.addColorStop(1, '#03050a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = .9; g.filter = 'blur(10px)'; g.drawImage(haze, -60 + Math.sin(t * .2) * 30, -40 - t * 6, W + 120, H + 120); g.filter = 'none'; g.restore();
  }
  function tag(txt, col, x, y) { g.save(); g.font = '600 18px FC'; var w = g.measureText(txt).width + 26; g.fillStyle = 'rgba(3,5,10,.75)'; g.fillRect(x, y, w, 38); g.strokeStyle = col; g.lineWidth = 2; g.strokeRect(x, y, w, 38); g.fillStyle = col; g.fillText(txt, x + 13, y + 26); g.restore() }
  function square(x, y, a, col, label) { g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 3; g.strokeRect(x - 77, y - 77, 154, 154);
    g.beginPath(); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { g.moveTo(x + c[0] * 77, y + c[1] * 77); g.lineTo(x + c[0] * 105, y + c[1] * 105) }); g.stroke();
    g.font = '600 18px FC'; g.fillStyle = col; g.fillText(label, x - 77, y + 108); g.restore() }
  var CAPS = [[0, 'In the time you took to read this, a hundred billion particles shot through your thumbnail.'], [SB[0], 'A muon lives two microseconds. Yet it reaches you. Why? Einstein.'], [SC[0], 'That’s the radioactivity of over two hundred and fifty bananas.']];
  window.__reelDurationSec = END;
  window.__seek = function (t) {
    g.clearRect(0, 0, W, H); f.clearRect(0, 0, W, H); bg(t);
    var aA = 1 - seg(t, SA[1] - .25, SA[1]), aB = Math.min(seg(t, SB[0] - .1, SB[0] + .2), 1 - seg(t, SB[1] - .25, SB[1])), aC = seg(t, SC[0] - .1, SC[0] + .2);
    // A
    if (aA > 0) {
      var pb = io(seg(t, 2.9, 3.9)), sc2 = 1 - pb * .985;
      rain(t, sc2, 540, 880, aA * (1 - seg(pb, .6, 1)));
      if (pb > .3) earth(t, aA * seg(pb, .3, .9));
      if (pb < .5) { square(540, 880, aA * (1 - pb * 2), '#9fe8ff', '1 cm² ≈ your thumbnail'); tag('LIFE-SIZE SCREEN · SLOWED 1,000,000,000×', '#9fe8ff', 110, 1150) }
      else { tag('EARTH · NEUTRINOS CROSS IT IN 0.04 s', '#9fe8ff', 110, 1150); g.save(); g.globalAlpha = aA * seg(pb, .7, 1); g.font = '600 20px FC'; g.fillStyle = '#e9eef6'; g.fillText('☀ Sun this way', 120, 600); g.fillText('night side → up through your bed', 520, 1250 - 60); g.restore() }
    }
    // B
    if (aB > 0) { var hf = shower(t, aB); ruler(aB, hf); clocks(t, aB); tag('SLOWED 80,000×', '#ff8a2a', 110, 1210); square(560, Y0 - 70, aB * seg(hf, .5, -.5), '#ff4fd8', 'your palm (~100 cm²)');
      g.save(); g.globalAlpha = aB * seg(t, SB[0] + 1.6, SB[0] + 2); g.font = '600 17px FC'; g.fillStyle = '#ff4fd8'; g.fillText('× = where it dies without Einstein', 600, 1120); g.restore() }
    // C
    if (aC > 0) { bananas(t, aC); tag('REAL TIME · EACH GREEN FLASH = ONE ATOM DECAYING', '#9dff5a', 110, 1150) }
    // bloom: particles + blurred copy
    s.clearRect(0, 0, sm.width, sm.height); s.filter = 'blur(3px)'; s.drawImage(fx, 0, 0, sm.width, sm.height); s.filter = 'none';
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .9; g.drawImage(sm, 0, 0, W, H); g.globalAlpha = 1; g.drawImage(fx, 0, 0); g.restore();
    // DOM: scenes, HUD (true real-time counts since play), caption
    $('scA').style.opacity = aA; $('scB').style.opacity = aB; $('scC').style.opacity = aC;
    $('c1').textContent = fmt(6.5e10 * t); $('c2').textContent = fmt(100 / 60 * t); $('c3').textContent = fmt(4000 * t);
    var cp = CAPS.filter(function (c) { return t >= c[0] }).pop(); $('cap').textContent = cp[1];
  };
  window.__ready = false;
  Promise.all(['900 92px AB', '600 18px FC', '700 31px Inter'].map(function (x) { return document.fonts.load(x) }).concat(BAN.map(function (im) { return new Promise(function (r) { if (im.complete) r(); else { im.onload = r; im.onerror = r } }) })))
    .then(function () { window.__seek(0); window.__ready = true });
})();
