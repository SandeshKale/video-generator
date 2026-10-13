// "Is that clip AI? Google can sometimes tell." ("Hold to the Light": banknote cream, engraving navy, currency green, stamp vermilion, brass light).
// Mockup: scenes 1 (hook reveal), 2 (Blender lightbox), 7 (the blind spot) back to back. window.__seek(t) is a pure function of t.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var cl = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var u = function (t, t0, d) { return cl((t - t0) / d, 0, 1); };
  var eo = function (x) { x = cl(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { x = cl(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var bk = function (x, s) { x = cl(x, 0, 1); s = s || 1.7; x -= 1; return x * x * ((s + 1) * x + s) + 1; };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var pw = function (t, K) { if (t <= K[0][0]) return K[0][1]; for (var i = 1; i < K.length; i++) if (t <= K[i][0]) return lerp(K[i - 1][1], K[i][1], (t - K[i - 1][0]) / Math.max(1e-6, K[i][0] - K[i - 1][0])); return K[K.length - 1][1]; };
  var MK = window.MK, IC = window.IC, st = $('stage');
  var SC = window.SC, WD = window.WD, PG = window.PG, TOTAL = window.TOTAL, CUT = .30;
  window.__reelDurationSec = TOTAL;
  var DUR = SC.map(function (s, i) { return (i + 1 < SC.length ? SC[i + 1] : TOTAL) - s; });
  function W(p, k, n) { var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } console.warn('no word', p, k, n); return SC[Math.min(p - 1, SC.length - 1)] + .3; }
  function L(i, k, n, p) { return W(p || i + 1, k, n) - SC[i]; }
  function ico(svg, px) { return svg.replace('<svg', '<svg width="' + px + '" height="' + px + '"'); }
  function head(eb, a, b, fs) { return '<div class="abs" style="left:150px;top:196px;width:768px"><div class="eyebrow">' + eb + '</div><div class="h1" style="margin-top:12px' + (fs ? ';font-size:' + fs + 'px' : '') + '">' + a + '<br><span class="hl">' + b + '</span></div></div>'; }
  function enter(el, e, dy, s0) { el.style.opacity = cl(e * 4, 0, 1); el.style.transform = 'translateY(' + ((dy || 40) * (1 - e)) + 'px) scale(' + lerp(s0 || 1, 1, e) + ')'; }
  var RC = {};
  function rstroke(svgEl, key, make, k) {
    if (!window.rough) return;
    var g = RC[key]; if (!g) { g = make(rough.svg(svgEl)); RC[key] = g; }
    if (g.parentNode !== svgEl) svgEl.appendChild(g);
    g.style.display = k > 0 ? '' : 'none';
    [].forEach.call(g.querySelectorAll('path'), function (p) { var Ln = p.getTotalLength(); p.style.strokeDasharray = Ln; p.style.strokeDashoffset = Ln * (1 - cl(k, 0, 1)); p.style.strokeLinecap = 'round'; });
  }
  function mk(id, html) { var d = document.createElement('div'); d.className = 'scene'; d.id = id; d.innerHTML = html; st.appendChild(d); return d; }

  // ---------- background: banknote guilloche (two sine line families make a slow moire; a corner rosette), phase driven by t ----------
  var bg = $('bg').getContext('2d');
  function drawBg(t) {
    bg.fillStyle = '#f2ead3'; bg.fillRect(0, 0, 1080, 1920);
    bg.lineWidth = 1.4;
    for (var fam = 0; fam < 2; fam++) {
      bg.strokeStyle = fam ? 'rgba(14,107,90,.13)' : 'rgba(19,36,61,.08)';
      for (var i = 0; i < 46; i++) {
        bg.beginPath(); var y0 = i * 44 - 40 + (fam ? 22 : 0);
        for (var x = 0; x <= 1080; x += 20) { var y = y0 + 22 * Math.sin(x * .012 + i * .5 + t * (fam ? .35 : -.28) + fam * 2) + 12 * Math.sin(x * .031 - i * .3 + t * .2); if (x === 0) bg.moveTo(x, y); else bg.lineTo(x, y); }
        bg.stroke();
      }
    }
    // rosette bottom-right (circle family, rotating phase)
    bg.strokeStyle = 'rgba(14,107,90,.11)'; bg.lineWidth = 1.2;
    for (var k = 0; k < 40; k++) { var a = k / 40 * Math.PI * 2 + t * .05; bg.beginPath(); bg.arc(940 + 90 * Math.cos(a), 1800 + 90 * Math.sin(a), 150, 0, Math.PI * 2); bg.stroke(); }
  }

  // ---------- photo helpers: depth-split parallax for the AI still ----------
  var IMG = {}, DEP = null, FG = null, BGL = null;
  function loadImg(k, src) { var im = new Image(); im.src = src; IMG[k] = im; return im; }
  loadImg('storm', 'photos/storm.jpg'); loadImg('depth', 'photos/storm-depth.png'); loadImg('real', 'photos/real.jpg');
  var PW = 490, PH = 870;
  function buildLayers() { // foreground = near (bright depth) pixels with soft edge; background = whole photo
    var im = IMG.storm, dp = IMG.depth;
    var c = document.createElement('canvas'); c.width = PW + 40; c.height = PH + 70; var x = c.getContext('2d');
    var sc = Math.max(c.width / im.naturalWidth, c.height / im.naturalHeight); x.drawImage(im, (c.width - im.naturalWidth * sc) / 2, (c.height - im.naturalHeight * sc) / 2, im.naturalWidth * sc, im.naturalHeight * sc);
    BGL = c;
    var d = document.createElement('canvas'); d.width = c.width; d.height = c.height; var dx = d.getContext('2d');
    dx.drawImage(dp, (c.width - im.naturalWidth * sc) / 2, (c.height - im.naturalHeight * sc) / 2, im.naturalWidth * sc, im.naturalHeight * sc);
    var f = document.createElement('canvas'); f.width = c.width; f.height = c.height; var fx = f.getContext('2d');
    var pa = x.getImageData(0, 0, c.width, c.height), da = dx.getImageData(0, 0, c.width, c.height);
    for (var i = 0; i < pa.data.length; i += 4) { var v = da.data[i] / 255, a = cl((v - .5) / .22, 0, 1); pa.data[i + 3] = a * 255; }
    fx.putImageData(pa, 0, 0); FG = f;
  }

  // ================= scene 1: the hook, a "viral" AI photo held to the light =================
  var DOTS = []; for (var gy = 0; gy < 40; gy++) for (var gx = 0; gx < 23; gx++) DOTS.push([gx * 22 + (gy % 2 ? 11 : 0) + 6, gy * 22 + 6]);
  var s1 = '<div class="abs" style="left:150px;top:170px;width:768px"><div class="h1">IS THAT<br><span class="hl">CLIP AI?</span></div></div>' +
    '<div class="abs phone" id="ph1" style="left:295px;top:400px;width:' + (PW + 34) + 'px"><canvas id="pc1" width="' + PW + '" height="' + PH + '"></canvas>' +
    '<div class="abs tag" style="left:30px;top:30px">AI IMAGE</div><div class="abs tag" style="right:30px;top:30px">ILLUSTRATIVE</div>' +
    '<div class="abs ctr" id="ct1" style="left:30px;bottom:40px">' + ico(IC.play, 24) + '<span id="cn1">2.3M</span></div>' +
    '<div class="abs play" id="pl1" style="left:215px;top:370px;opacity:.0">' + ico(IC.play, 50) + '</div></div>' +
    '<div class="abs" id="st1" style="left:500px;top:880px"><div class="stamp found" style="font-size:40px">WATERMARK<br>FOUND<small>ILLUSTRATIVE · DRAWN, NOT REAL</small></div></div>';
  mk('s1', s1);
  function render1(t) {
    if (!BGL) buildLayers();
    var tell = L(0, 'google'), x0 = .45, x1 = tell + .05;
    var band = pw(t, [[0, -.3], [x0, -.25], [x1, 1.15]]);          // band centre across the photo, 0..1
    var drift = Math.sin(t * .9) * 9, c = $('pc1').getContext('2d');
    c.clearRect(0, 0, PW, PH); c.save(); c.beginPath(); c.rect(0, 0, PW, PH); c.clip();
    c.drawImage(BGL, -20 - drift * .45, -35, PW + 40, PH + 70); c.drawImage(FG, -20 + drift * .75, -35, PW + 40, PH + 70);
    c.restore();
    var cx = band * (PW + 280) - 140, ang = -.32, lock = u(t, tell, .35);
    // hidden dot pattern: visible only inside the band (and softly everywhere once locked)
    for (var i = 0; i < DOTS.length; i++) {
      var dx = DOTS[i][0] - cx, dy = DOTS[i][1] - PH / 2, dd = (dx * Math.cos(ang) + dy * Math.sin(ang)); // signed distance across the band
      var a = Math.exp(-(dd / 70) * (dd / 70)) * (band > -.2 && band < 1.1 ? 1 : 0); a = Math.max(a, lock * .2);
      if (a < .03) continue; c.fillStyle = 'rgba(127,214,236,' + (.9 * a) + ')'; c.beginPath(); c.arc(DOTS[i][0], DOTS[i][1], 3.2, 0, 7); c.fill();
    }
    // the warm band of light itself (screen-ish glow)
    var gr = c.createLinearGradient(cx - 150 * Math.cos(ang), PH / 2 - 150 * Math.sin(ang), cx + 150 * Math.cos(ang), PH / 2 + 150 * Math.sin(ang));
    var ga = band > -.2 && band < 1.1 ? .5 : 0; gr.addColorStop(0, 'rgba(255,225,150,0)'); gr.addColorStop(.5, 'rgba(255,225,150,' + ga + ')'); gr.addColorStop(1, 'rgba(255,225,150,0)');
    c.globalCompositeOperation = 'lighter'; c.fillStyle = gr; c.fillRect(0, 0, PW, PH); c.globalCompositeOperation = 'source-over';
    $('cn1').textContent = (2.3 + .06 * Math.floor(t * 6) / 10 * 10).toFixed(1) + 'M';
    var se = bk(u(t, tell + .05, .28), 2.2), s = $('st1'); s.style.opacity = u(t, tell + .05, .06); s.style.transform = 'rotate(-8deg) scale(' + lerp(1.9, 1, se) + ')';
  }

  // ================= scene 2: the Blender lightbox =================
  var LB = [], NL = 24;
  for (var li = 0; li < NL; li++) { var im2 = new Image(); im2.src = '3d/lightbox/b' + (li < 10 ? '0' : '') + li + '.png'; LB.push(im2); }
  mk('s2', head('// A WATERMARK YOU CAN\'T SEE', 'SYNTHID', 'DETECTOR', 84) +
    '<canvas id="lb" width="900" height="640" class="abs" style="left:150px;top:500px;width:768px;height:546px"></canvas>' +
    '<div class="abs note" id="tab2" style="left:150px;top:1066px;width:768px;height:92px"><div class="thread"></div><div class="abs serial" style="left:56px;top:14px">SYNTHID.COM · NO. 0007102026</div><div class="abs" style="left:56px;top:40px;font-family:Bodoni;font-weight:800;font-size:34px">SynthID Detector</div></div>' +
    '<div class="abs" id="any2" style="left:560px;top:1190px"><div class="stamp found" style="font-size:30px">OPEN TO ANYONE</div></div>' +
    '<div class="abs tag" style="left:150px;top:1214px">3D RENDER</div>');
  function render2(t) {
    var tl = L(1, 'detector') > 0 ? L(1, 'detector') : 1.2, an = L(1, 'anyone');
    var p = pw(t, [[0, 0], [.2, .05], [an + .5, 1]]), f = p * (NL - 1), a = Math.floor(f), b = Math.min(NL - 1, a + 1), k = f - a;
    var x = $('lb').getContext('2d'); x.clearRect(0, 0, 900, 640); x.globalAlpha = 1; x.drawImage(LB[a], 0, 120, 900, 640, 0, 0, 900, 640); x.globalAlpha = k; x.drawImage(LB[b], 0, 120, 900, 640, 0, 0, 900, 640); x.globalAlpha = 1;
    enter($('tab2'), eo(u(t, .5, .4)), 30); var e = bk(u(t, an, .3), 2); $('any2').style.opacity = u(t, an, .06); $('any2').style.transform = 'rotate(-3deg) scale(' + lerp(1.8, 1, e) + ')';
  }

  // ================= scene 7: the blind spot, same answer for two origins =================
  mk('s3', head('// THE BLIND SPOT', 'SAME ANSWER,', 'TWO ORIGINS', 80) +
    '<div class="abs pcard" id="cr" style="left:150px;top:470px;width:340px;height:640px"><img src="photos/real.jpg"><div class="abs tag" style="left:10px;top:10px">PHOTO · UNSPLASH</div></div>' +
    '<div class="abs pcard" id="ca" style="left:578px;top:470px;width:340px;height:640px"><img src="photos/storm.jpg"><div class="abs tag" style="left:10px;top:10px">AI IMAGE</div></div>' +
    '<div class="abs eq" id="eq" style="left:498px;top:748px">=</div>' +
    '<div class="abs cardlab" id="lr" style="left:150px;top:1136px;width:340px">A REAL PHOTO</div><div class="abs cardlab" id="la" style="left:578px;top:1136px;width:340px">AI IMAGE FROM A TOOL<br>THAT DOESN\'T USE SYNTHID</div>' +
    '<div class="abs" id="sr" style="left:136px;top:960px"><div class="stamp none" style="font-size:25px">NO WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div></div>' +
    '<div class="abs" id="sa" style="left:566px;top:960px"><div class="stamp none" style="font-size:25px">NO WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div></div>' +
    '<svg class="abs" id="rs3" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible"></svg>');
  function render3(t) {
    var tc = L(2, 'catch', 0, 3), tf = L(2, 'fake', 0, 4), tw = L(2, 'tool', 0, 4);
    enter($('cr'), eo(u(t, 0, .4)), 50); enter($('ca'), eo(u(t, .12, .4)), 50); enter($('lr'), eo(u(t, .2, .35)), 20); enter($('la'), eo(u(t, .32, .35)), 20);
    var e1 = bk(u(t, tc + .25, .3), 2), e2 = bk(u(t, tf + .1, .3), 2);
    $('sr').style.opacity = u(t, tc + .25, .06); $('sr').style.transform = 'rotate(-7deg) scale(' + lerp(1.8, 1, e1) + ')';
    $('sa').style.opacity = u(t, tf + .1, .06); $('sa').style.transform = 'rotate(6deg) scale(' + lerp(1.8, 1, e2) + ')';
    var ee = bk(u(t, tf + .5, .35), 2); $('eq').style.opacity = u(t, tf + .5, .08); $('eq').style.transform = 'scale(' + ee + ') rotate(' + (-10 * (1 - ee)) + 'deg)';
    rstroke($('rs3'), 'ring', function (r) { return r.ellipse(540, 1032, 880, 150, { seed: 5, stroke: '#c9962b', strokeWidth: 6, roughness: 1.6 }); }, eo(u(t, tf + .7, .5)));
  }

  // ---------- captions, light-band cuts, seek ----------
  st.insertAdjacentHTML('beforeend', '<div id="cap"><div id="capd"></div></div>');
  function caption(t) {
    var pg = null;
    for (var i = 0; i < PG.length; i++) { var w0 = WD[PG[i][0]], w1 = WD[PG[i][PG[i].length - 1]], nx = i + 1 < PG.length ? WD[PG[i + 1][0]].s : 1e9; if (t >= w0.s - .06 && t < Math.min(nx - .06, w1.e + .6)) pg = PG[i]; }
    var cap = $('cap'); if (!pg) { cap.style.opacity = 0; return; } cap.style.opacity = 1;
    $('capd').innerHTML = pg.map(function (j) { var w = WD[j]; return '<span class="' + (t >= w.s && t < w.e + .08 ? 'on' : t >= w.s ? 'past' : '') + '">' + w.w + '</span>'; }).join(' ');
  }
  var cx = $('cutc').getContext('2d');
  function cutDraw(p) { // a warm brass light band sweeps left to right; the scene swaps under its centre
    cx.clearRect(0, 0, 1080, 1920); if (p <= 0 || p >= 1) return;
    var c = lerp(-420, 1500, eio(p)), g = cx.createLinearGradient(c - 380, 0, c + 380, 0);
    g.addColorStop(0, 'rgba(242,234,211,0)'); g.addColorStop(.35, 'rgba(242,234,211,.96)'); g.addColorStop(.5, 'rgba(233,196,110,1)'); g.addColorStop(.65, 'rgba(242,234,211,.96)'); g.addColorStop(1, 'rgba(242,234,211,0)');
    cx.save(); cx.translate(540, 960); cx.rotate(-.18); cx.translate(-540, -960); cx.fillStyle = g; cx.fillRect(-300, -400, 1700, 2720); cx.restore();
  }
  var SCN = [render1, render2, render3];
  window.__seek = function (t) {
    var cp = -1, si = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
    for (i = 0; i < SC.length; i++) { $('s' + (i + 1)).style.display = i === si ? 'block' : 'none'; if (i > 0 && Math.abs(t - SC[i]) < CUT / 2) cp = (t - (SC[i] - CUT / 2)) / CUT; }
    drawBg(t); SCN[si](t - SC[si]); cutDraw(cp); caption(t);
  };
  window.__ready = false;
  var FACES = ['700 20px Bodoni', '800 20px Bodoni', '500 20px Chivo', '700 20px Chivo', '600 20px Inter', '700 20px Inter'];
  var imgs = [].slice.call(document.querySelectorAll('#stage img')).concat(LB, [IMG.storm, IMG.depth, IMG.real]).map(function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve(); });
  Promise.all([document.fonts.ready].concat(FACES.map(function (f) { return document.fonts.load(f); }), imgs)).then(function () { window.__seek(0); window.__ready = true; });
})();
