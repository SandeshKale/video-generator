// "Is that clip AI? Google can sometimes tell." ("Hold to the Light": banknote cream/navy, currency green, stamp vermilion, brass light).
// 9 scenes. window.__seek(t) is a pure function of t (returns a Promise while footage overlays seek).
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
  function W(p, k, n) { var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } console.warn('no word', p, k, n); return SC[Math.min(p - 1, SC.length - 1)] + .3; }
  function L(i, k, n) { return W(i + 1, k, n) - SC[i]; }   // local time of word k in scene i (0-based)
  function ico(svg, px) { return svg.replace('<svg', '<svg width="' + px + '" height="' + px + '"'); }
  function head(eb, a, b, fs, top) { return '<div class="abs" id="hd" style="left:150px;top:' + (top || 196) + 'px;width:768px"><div class="eyebrow">' + eb + '</div><div class="h1" style="margin-top:12px' + (fs ? ';font-size:' + fs + 'px' : '') + '">' + a + '<br><span class="hl">' + b + '</span></div></div>'; }
  function enter(el, e, dy, s0) { el.style.opacity = cl(e * 4, 0, 1); el.style.transform = 'translateY(' + ((dy || 40) * (1 - e)) + 'px) scale(' + lerp(s0 || 1, 1, e) + ')'; }
  function slam(el, t, t0, rot, from) { var e = bk(u(t, t0, .26), 2.2); el.style.opacity = u(t, t0, .05); el.style.transform = 'rotate(' + rot + 'deg) scale(' + lerp(from || 1.9, 1, e) + ')'; }
  var RC = {};
  function rstroke(svgEl, key, make, k) {
    if (!window.rough) return;
    var g = RC[key]; if (!g) { g = make(rough.svg(svgEl)); RC[key] = g; }
    if (g.parentNode !== svgEl) svgEl.appendChild(g);
    g.style.display = k > 0 ? '' : 'none';
    [].forEach.call(g.querySelectorAll('path'), function (p) { var Ln = p.getTotalLength(); p.style.strokeDasharray = Ln; p.style.strokeDashoffset = Ln * (1 - cl(k, 0, 1)); p.style.strokeLinecap = 'round'; });
  }
  function mk(id, html, cls) { var d = document.createElement('div'); d.className = 'scene' + (cls ? ' ' + cls : ''); d.id = id; d.innerHTML = html; st.appendChild(d); return d; }
  var NAVY = [0, 0, 0, 0, 1, 1, 1, 0, 0];

  // ---------- background: banknote guilloche; navy ground for the "honest part" (scenes 5-7); mix interpolates over a cut ----------
  var bg = $('bg').getContext('2d');
  function mix3(a, b, k) { return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(lerp(a[i], b[i], k)); }).join(',') + ')'; }
  function drawBg(t, nv) {
    bg.fillStyle = mix3([242, 234, 211], [15, 29, 51], nv); bg.fillRect(0, 0, 1080, 1920);
    bg.lineWidth = 1.4;
    for (var fam = 0; fam < 2; fam++) {
      bg.strokeStyle = nv > .5 ? (fam ? 'rgba(201,150,43,.13)' : 'rgba(127,178,201,.13)') : (fam ? 'rgba(14,107,90,.13)' : 'rgba(19,36,61,.08)');
      for (var i = 0; i < 46; i++) {
        bg.beginPath(); var y0 = i * 44 - 40 + (fam ? 22 : 0);
        for (var x = 0; x <= 1080; x += 20) { var y = y0 + 22 * Math.sin(x * .012 + i * .5 + t * (fam ? .35 : -.28) + fam * 2) + 12 * Math.sin(x * .031 - i * .3 + t * .2); if (x === 0) bg.moveTo(x, y); else bg.lineTo(x, y); }
        bg.stroke();
      }
    }
    bg.strokeStyle = nv > .5 ? 'rgba(201,150,43,.14)' : 'rgba(14,107,90,.11)'; bg.lineWidth = 1.2;
    for (var k = 0; k < 40; k++) { var a = k / 40 * Math.PI * 2 + t * .05; bg.beginPath(); bg.arc(940 + 90 * Math.cos(a), 1800 + 90 * Math.sin(a), 150, 0, Math.PI * 2); bg.stroke(); }
  }

  // ---------- images ----------
  var IMG = {};
  function loadImg(k, src) { var im = new Image(); im.src = src; IMG[k] = im; return im; }
  loadImg('storm', 'photos/storm.jpg'); loadImg('depth', 'photos/storm-depth.png'); loadImg('real', 'photos/real.jpg'); loadImg('pfp', 'photos/profile.jpg'); loadImg('fig', 'photos/figure.svg');
  var LOGO = { google: 'logos/google.svg', openai: 'logos/openai.svg', apple: 'logos/apple.svg' };
  function cover(c, im, w, h, fy) { var sc = Math.max(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * sc, dh = im.naturalHeight * sc; c.drawImage(im, (w - dw) / 2, (h - dh) * (fy == null ? .5 : fy), dw, dh); }
  var HW = 1160, HH = 2040, BGL = null, FG = null;
  function buildLayers() { // hook: background = whole photo, foreground = near (bright depth) pixels so the two drift at different speeds
    var c = document.createElement('canvas'); c.width = HW; c.height = HH; var x = c.getContext('2d'); cover(x, IMG.storm, HW, HH); BGL = c;
    var d = document.createElement('canvas'); d.width = HW; d.height = HH; var dx = d.getContext('2d'); cover(dx, IMG.depth, HW, HH);
    var f = document.createElement('canvas'); f.width = HW; f.height = HH; var fx = f.getContext('2d');
    var pa = x.getImageData(0, 0, HW, HH), da = dx.getImageData(0, 0, HW, HH);
    for (var i = 0; i < pa.data.length; i += 4) pa.data[i + 3] = cl((da.data[i] / 255 - .5) / .22, 0, 1) * 255;
    fx.putImageData(pa, 0, 0); FG = f;
  }
  // light band over a canvas: hidden dot lattice shows only inside the band (and faintly everywhere once "locked")
  function sweep(c, w, h, band, o) {
    var cx = band * (w + 280) - 140, ang = o.ang == null ? -.32 : o.ang, sp = o.sp || 22, wd = o.wd || 70, on = band > -.2 && band < 1.1;
    if (o.dots) {
      var nx = Math.ceil(w / sp) + 1, ny = Math.ceil(h / sp) + 1;
      for (var gy = 0; gy < ny; gy++) for (var gx = 0; gx < nx; gx++) {
        var px = gx * sp + (gy % 2 ? sp / 2 : 0) + 6, py = gy * sp + 6, dd = (px - cx) * Math.cos(ang) + (py - h / 2) * Math.sin(ang);
        var a = Math.exp(-(dd / wd) * (dd / wd)) * (on ? 1 : 0); a = Math.max(a, (o.lock || 0) * .3); if (a < .03) continue;
        c.fillStyle = 'rgba(127,214,236,' + (.92 * a) + ')'; c.beginPath(); c.arc(px, py, o.r || 3.2, 0, 7); c.fill();
      }
    }
    var L2 = (o.glow || 150), gr = c.createLinearGradient(cx - L2 * Math.cos(ang), h / 2 - L2 * Math.sin(ang), cx + L2 * Math.cos(ang), h / 2 + L2 * Math.sin(ang));
    var ga = on ? (o.ga == null ? .5 : o.ga) : 0; gr.addColorStop(0, 'rgba(255,225,150,0)'); gr.addColorStop(.5, 'rgba(255,225,150,' + ga + ')'); gr.addColorStop(1, 'rgba(255,225,150,0)');
    c.globalCompositeOperation = 'lighter'; c.fillStyle = gr; c.fillRect(0, 0, w, h); c.globalCompositeOperation = 'source-over';
  }
  function vid(id, src, fps, mixm, op) { return '<video class="abs fxv" id="' + id + '" src="' + src + '" data-fps="' + fps + '" muted preload="auto" style="left:0;top:0;width:1080px;height:1920px;object-fit:cover;mix-blend-mode:' + mixm + ';opacity:' + op + ';pointer-events:none"></video>'; }
  function trk(n, dk) { var t = ['1 · OPEN', '2 · UPLOAD', '3 · READ']; return '<div class="abs trk' + (dk ? ' dk' : '') + '" id="trk" style="left:150px;top:146px">' + t.map(function (x, i) { return '<div id="tk' + (i + 1) + '">' + x + '</div>'; }).join('') + '</div>'; }
  function trkSet(n) { for (var i = 1; i <= 3; i++) { var e = $('tk' + i); if (e) e.className = i < n ? 'done' : i === n ? 'on' : ''; } }
  function tag(txt, st2) { return '<div class="abs tag" style="' + st2 + '">' + txt + '</div>'; }

  // ================= 1: the hook =================
  mk('s1', '<div class="abs" id="s1w" style="left:0;top:0;width:1080px;height:1920px"><canvas id="pc1" class="abs" width="1080" height="1920" style="left:0;top:0"></canvas><div class="abs vig" style="left:0;top:0;width:1080px;height:1920px"></div>' +
    '<div class="abs" id="hk" style="left:150px;top:176px;width:768px"><div class="h1 big" id="hk1">IS THAT</div><div class="h1 big" style="margin-top:2px"><span class="blk" id="hk2">CLIP AI?</span></div></div>' +
    '<div class="abs ctr" id="ct1" style="left:150px;top:560px">' + ico(IC.play, 30) + '<span id="cn1">2.3M views</span></div>' +
    tag('AI IMAGE', 'left:150px;top:640px') + tag('ILLUSTRATIVE', 'left:290px;top:640px') +
    '<div class="abs" id="st1" style="left:150px;top:850px;width:768px;text-align:center"><div class="stamp found" style="font-size:66px;padding:22px 30px;border-width:9px">WATERMARK<br>FOUND<small style="font-size:20px">ILLUSTRATIVE · DRAWN, NOT REAL</small></div></div></div>' +
    '<div class="abs flash" id="fl1" style="left:0;top:0;width:1080px;height:1920px;opacity:0"></div>');
  function render1(t) {
    if (!BGL) buildLayers();
    var tell = L(0, 'google'), band = pw(t, [[0, -.12], [.85, 1.12], [1.0, 1.12], [tell - .05, .45], [tell, .5]]);
    var drift = Math.sin(t * 1.3) * 14, z = 1 + .09 * u(t, 0, 3.8), c = $('pc1').getContext('2d'), lock = u(t, tell, .3);
    var shake = t > tell && t < tell + .45 ? 16 * Math.pow(1 - (t - tell) / .45, 2) : 0, sx = Math.sin(t * 90) * shake, sy = Math.cos(t * 77) * shake * .7;
    c.clearRect(0, 0, 1080, 1920); c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-540, -960);
    c.drawImage(BGL, -40 - drift * .5, -60, HW, HH); c.drawImage(FG, -40 + drift * .9, -60, HW, HH); c.restore();
    sweep(c, 1080, 1920, band, { dots: true, lock: lock, sp: 34, wd: 120, r: 4.6, glow: 330, ga: .55 });
    $('s1w').style.transform = 'translate(' + sx + 'px,' + sy + 'px)';
    var hp = bk(u(t, 0, .35), 2.4); $('hk1').style.transform = 'scale(' + lerp(1.12, 1, hp) + ')'; $('hk1').style.transformOrigin = 'left center';
    $('hk2').style.transform = 'rotate(-2deg) scale(' + lerp(1.18, 1, hp) + ')';
    $('cn1').textContent = (2.3 + 7.4 * eo(t / 3.8)).toFixed(1) + 'M views';
    slam($('st1'), t, tell, -7, 2.5);
    var fl = t > tell && t < tell + .35 ? Math.pow(1 - (t - tell) / .35, 2) * .85 : 0; $('fl1').style.opacity = fl;
  }

  // ================= 2: it's called SynthID Detector (Blender lightbox) =================
  var LB = [], NL = 24;
  for (var li = 0; li < NL; li++) { var im2 = new Image(); im2.src = '3d/lightbox/b' + (li < 10 ? '0' : '') + li + '.png'; LB.push(im2); }
  mk('s2', head('// A WATERMARK YOU CAN\'T SEE', 'SYNTHID', 'DETECTOR', 96) +
    '<svg class="abs" id="rs2" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible"></svg>' +
    '<canvas id="lb" width="900" height="640" class="abs" style="left:150px;top:520px;width:768px;height:546px"></canvas>' +
    '<div class="abs note" id="tab2" style="left:150px;top:1090px;width:768px;height:100px"><div class="thread"></div><div class="abs serial" style="left:56px;top:14px">SYNTHID.COM · NO. 0007102026</div><div class="abs" style="left:56px;top:42px;font-family:Bodoni;font-weight:800;font-size:36px">SynthID Detector</div></div>' +
    '<div class="abs" id="any2" data-ov="1" style="left:470px;top:1222px"><div class="stamp found" style="font-size:32px">OPEN TO ANYONE</div></div>' +
    tag('3D RENDER', 'left:150px;top:1240px'));
  function render2(t) {
    var an = L(1, 'anyone'), dt = L(1, 'detector');
    var p = pw(t, [[0, 0], [.15, .04], [an + .5, 1]]), f = p * (NL - 1), a = Math.floor(f), b = Math.min(NL - 1, a + 1), k = f - a;
    var x = $('lb').getContext('2d'); x.clearRect(0, 0, 900, 640); x.globalAlpha = 1; x.drawImage(LB[a], 0, 120, 900, 640, 0, 0, 900, 640); x.globalAlpha = k; x.drawImage(LB[b], 0, 120, 900, 640, 0, 0, 900, 640); x.globalAlpha = 1;
    enter($('hd'), eo(u(t, 0, .35)), 36); enter($('tab2'), eo(u(t, .3, .4)), 30); slam($('any2'), t, an, -3, 1.9);
    rstroke($('rs2'), 'ul', function (r) { return r.line(152, 420, 700, 424, { seed: 3, stroke: '#e2412c', strokeWidth: 7, roughness: 1.4 }); }, eo(u(t, dt, .4)));
  }

  // ================= 3: step 1, open synthid.com =================
  mk('s3', trk(1) + head('// STEP ONE', 'OPEN', 'SYNTHID.COM', 100, 206) +
    '<div class="abs note" id="br3" style="left:150px;top:560px;width:768px;height:700px"><div class="urlbar">' + ico(IC.lock, 30) + '<div class="u" id="url3"></div></div>' +
    '<div class="abs" id="pg3" style="left:0;top:76px;width:768px;height:624px;background:var(--paper)">' +
    '<div class="abs" style="left:48px;top:34px"><div class="serial">WELCOME</div><div style="font-family:Bodoni;font-weight:800;font-size:54px;line-height:1.04;margin-top:6px">SynthID Detector</div></div>' +
    '<div class="abs" id="sg3" style="left:48px;top:176px;width:672px"><div class="serial" style="margin-bottom:14px">SIGN IN TO CONTINUE</div>' +
    '<div class="sbtn" id="b1" style="margin-bottom:14px"><img src="logos/google.svg">Continue with Google</div><div class="sbtn" id="b2" style="margin-bottom:14px"><img src="logos/apple.svg">Continue with Apple</div><div class="sbtn" id="b3"><img src="logos/openai.svg">Continue with ChatGPT</div></div></div></div>' +
    '<div class="abs" id="cur3" style="left:0;top:0;color:var(--ink);filter:drop-shadow(0 4px 4px rgba(0,0,0,.4))">' + ico(IC.cursor, 64) + '</div>' + tag('ILLUSTRATIVE', 'left:150px;top:1290px'));
  function render3(t) {
    var o = L(2, 'open'), cm = L(2, 'com'), txt = 'synthid.com', n = Math.floor(cl((t - o) / (cm + .1 - o), 0, 1) * txt.length);
    $('url3').textContent = txt.slice(0, n) + (t < cm + .5 && Math.floor(t * 4) % 2 ? '|' : '');
    trkSet(1); enter($('hd'), eo(u(t, 0, .35)), 36); enter($('br3'), eo(u(t, .05, .45)), 70);
    var ts = cm - .45; enter($('sg3'), eo(u(t, ts, .35)), 24);
    for (var i = 1; i <= 3; i++) enter($('b' + i), eo(u(t, ts + .05 * i, .3)), 18);
    var cx = pw(t, [[0, 830], [ts + .2, 700], [ts + .75, 380]]), cy = pw(t, [[0, 1300], [ts + .2, 1000], [ts + .75, 826]]), clk = u(t, ts + .8, .12);
    $('cur3').style.transform = 'translate(' + cx + 'px,' + cy + 'px) scale(' + (1 - .14 * Math.sin(clk * Math.PI)) + ')'; $('cur3').style.opacity = u(t, ts, .1);
    $('b1').style.transform = 'translateY(' + (5 * Math.sin(clk * Math.PI)) + 'px)'; if (t > ts + .8) $('b1').style.background = '#e7f3ee';
  }

  // ================= 4: step 2, upload a file =================
  mk('s4', trk(2) + head('// STEP TWO', 'UPLOAD', 'ONE FILE', 100, 206) +
    '<svg class="abs" id="rs4" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible"></svg>' +
    '<div class="abs dz" id="dz4" style="left:150px;top:560px;width:768px;height:470px"></div>' +
    '<div class="abs serial" id="dzt" style="left:150px;top:582px;width:768px;text-align:center;font-size:20px">DROP A FILE HERE</div>' +
    '<div class="abs tile" id="t1" style="left:178px;top:690px">' + ico(IC.image, 80) + '<b>IMAGE</b></div><div class="abs tile" id="t2" style="left:434px;top:690px">' + ico(IC.film, 80) + '<b>VIDEO</b></div><div class="abs tile" id="t3" style="left:690px;top:690px">' + ico(IC.wave, 80) + '<b>AUDIO</b></div>' +
    '<div class="abs" id="ar4" style="left:150px;top:932px;width:768px;text-align:center;color:var(--verm)">' + ico(IC.upload, 60) + '</div>' +
    '<div class="abs chipr" id="c1" style="left:150px;top:1090px"><small>REPORTED</small>FREE TO USE</div><div class="abs chipr" id="c2" style="left:150px;top:1170px"><small>REPORTED</small>~10 CHECKS A DAY</div>' + tag('ILLUSTRATIVE', 'left:560px;top:1134px'));
  function render4(t) {
    trkSet(2); enter($('hd'), eo(u(t, 0, .35)), 36);
    enter($('dz4'), eo(u(t, .05, .4)), 50); var dz = $('dz4'); dz.style.border = '5px dashed ' + (t > L(3, 'audio') ? '#e2412c' : '#13243d');
    $('dzt').style.opacity = eo(u(t, .3, .3));
    [['t1', 'image'], ['t2', 'video'], ['t3', 'audio']].forEach(function (a, i) { var e = bk(u(t, L(3, a[1]) - .1, .4), 1.8); var el = $(a[0]); el.style.opacity = u(t, L(3, a[1]) - .1, .08); el.style.transform = 'translateY(' + (-120 * (1 - e)) + 'px) rotate(' + ((i - 1) * 6 * (1 - e)) + 'deg) scale(' + lerp(.7, 1, e) + ')'; });
    var pa = Math.sin(t * 5) * 6; $('ar4').style.opacity = u(t, L(3, 'upload'), .2); $('ar4').style.transform = 'translateY(' + pa + 'px)';
    enter($('c1'), eo(u(t, 1.2, .35)), 30); enter($('c2'), eo(u(t, 1.7, .35)), 30);
    rstroke($('rs4'), 'dz', function (r) { return r.rectangle(166, 576, 736, 438, { seed: 9, stroke: '#c9962b', strokeWidth: 3.2, roughness: 1.5 }); }, eo(u(t, .4, .9)));
  }

  // ================= 5: step 3, it hunts for the watermark (navy) =================
  var PRT = [['p1', 'GOOGLE', '<img src="logos/google.svg">', 'google'], ['p2', 'OPENAI', '<img src="logos/openai.svg">', 'partners'], ['p3', 'NVIDIA', MK.nvidia, 'partners'], ['p4', 'KAKAO', '', 'partners']];
  mk('s5', trk(3, 1) + head('// STEP THREE', 'IT HUNTS FOR', 'THE WATERMARK', 78, 206) +
    '<div class="abs pcard" id="ic5" style="left:150px;top:560px;width:768px;height:470px"><canvas id="pc5" width="768" height="470" style="display:block"></canvas>' + tag('AI IMAGE', 'left:14px;top:14px') + '</div>' +
    '<div class="abs" id="st5" data-ov="1" style="left:560px;top:900px"><div class="stamp found" style="font-size:34px">WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div></div>' +
    PRT.map(function (p, i) { return '<div class="abs prt" id="' + p[0] + '" style="left:' + (150 + (i % 3) * 264) + 'px;top:' + (1086 + Math.floor(i / 3) * 90) + 'px;width:240px">' + p[2] + p[1] + '</div>'; }).join('') +
    '<div class="abs prt dim" id="p5" style="left:414px;top:1176px;width:504px"><img src="logos/apple.svg">APPLE · COMING SOON</div>', 'dk');
  // Apple is "coming soon": placed in the 3rd row only when it fits above the caption zone, so it sits beside the headline tag instead
  function render5(t) {
    trkSet(3); enter($('hd'), eo(u(t, 0, .35)), 36); enter($('ic5'), eo(u(t, .05, .45)), 60);
    var tg = L(4, 'google'), hunt = L(4, 'hunts'), band = pw(t, [[hunt - .2, -.12], [hunt + .9, 1.12], [hunt + 1.0, 1.12], [tg - .1, .5]]), c = $('pc5').getContext('2d');
    c.clearRect(0, 0, 768, 470); c.fillStyle = '#13243d'; c.fillRect(0, 0, 768, 470); cover(c, IMG.storm, 768, 470, .35);
    sweep(c, 768, 470, band, { dots: true, lock: u(t, tg, .3), sp: 24, wd: 90, r: 3.4, glow: 220 });
    var lockp = Math.sin(u(t, tg, .5) * Math.PI); if (lockp > 0) { c.strokeStyle = 'rgba(233,184,74,' + lockp + ')'; c.lineWidth = 10; c.strokeRect(5, 5, 758, 460); }
    PRT.forEach(function (p, i) { var el = $(p[0]), t0 = L(4, p[3]) + (p[3] === 'partners' ? (i - 1) * .15 - 1.0 : 0); enter(el, eo(u(t, 1.6 + i * .08, .35)), 24); var on = t >= t0; el.className = 'abs prt' + (on ? ' on' : ''); if (on) el.style.transform = 'translateY(0) scale(' + (1 + .035 * Math.sin(cl((t - t0) / .35, 0, 1) * Math.PI)) + ')'; });
    enter($('p5'), eo(u(t, 1.9, .35)), 24); slam($('st5'), t, tg + .35, -6, 1.9);
  }

  // ================= 6: the catch (navy) =================
  mk('s6', head('// THE CATCH', 'NO MARK', 'DOESN\'T MEAN REAL', 72, 196) +
    '<svg class="abs" id="rs6" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible"></svg>' +
    '<div class="abs pcard" id="rp6" style="left:150px;top:570px;width:400px;height:640px"><canvas id="pc6" width="400" height="640" style="display:block"></canvas>' + tag('PHOTO · UNSPLASH', 'left:12px;top:12px') + '</div>' +
    '<div class="abs" id="mg6" style="left:600px;top:600px;width:290px;color:#e9b84a;text-align:center">' + ico(IC.search, 200) + '<div style="font-family:Bodoni;font-weight:800;font-size:150px;line-height:.9;color:#f2ead3;margin-top:-10px">?</div></div>' +
    '<div class="abs cardlab" id="q6" style="left:600px;top:1010px;width:290px;text-align:center">NOTHING FOUND<br>IS NO PROOF</div>' +
    '<div class="abs" id="sn6" data-ov="1" style="left:156px;top:1040px"><div class="stamp none" style="font-size:34px">NO WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div></div>', 'dk');
  function render6(t) {
    enter($('hd'), eo(u(t, 0, .35)), 36); enter($('rp6'), eo(u(t, .05, .45)), 60);
    var c = $('pc6').getContext('2d'); c.clearRect(0, 0, 400, 640); c.fillStyle = '#13243d'; c.fillRect(0, 0, 400, 640); cover(c, IMG.real, 400, 640);
    sweep(c, 400, 640, pw(t, [[.2, -.12], [1.4, 1.12]]), { dots: false, glow: 190, ga: .5 });
    var nw = L(5, 'watermark'); enter($('mg6'), eo(u(t, .4, .45)), 40, .8); $('mg6').style.transform += ' rotate(' + (Math.sin(t * 2) * 4) + 'deg)'; enter($('q6'), eo(u(t, nw + .5, .35)), 24);
    slam($('sn6'), t, nw, -7, 1.9);
    rstroke($('rs6'), 'ul', function (r) { return r.line(152, 468, 800, 472, { seed: 4, stroke: '#e2412c', strokeWidth: 7, roughness: 1.4 }); }, eo(u(t, L(5, 'mean'), .4)));
  }

  // ================= 7: a fake from any other tool slips through (navy) =================
  mk('s7', head('// THE BLIND SPOT', 'SAME ANSWER,', 'TWO ORIGINS', 92, 196) +
    '<div class="abs pcard" id="cr" style="left:150px;top:560px;width:340px;height:610px"><canvas id="p7a" width="340" height="610" style="display:block"></canvas>' + tag('PHOTO · UNSPLASH', 'left:10px;top:10px') + '</div>' +
    '<div class="abs pcard" id="ca" style="left:578px;top:560px;width:340px;height:610px"><canvas id="p7b" width="340" height="610" style="display:block"></canvas>' + tag('AI IMAGE', 'left:10px;top:10px') + '</div>' +
    '<div class="abs eq" id="eq" data-ov="1" style="left:498px;top:820px">=</div>' +
    '<div class="abs cardlab" id="lr" style="left:150px;top:1190px;width:340px">A REAL PHOTO</div><div class="abs cardlab" id="la" style="left:578px;top:1190px;width:340px">AI IMAGE FROM A TOOL<br>WITHOUT SYNTHID</div>' +
    '<div class="abs" id="sr" data-ov="1" style="left:154px;top:1020px"><div class="stamp none" style="font-size:25px">NO WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div></div>' +
    '<div class="abs" id="sa" data-ov="1" style="left:566px;top:1020px"><div class="stamp none" style="font-size:25px">NO WATERMARK<br>FOUND<small>ILLUSTRATIVE</small></div></div>' +
    '<svg class="abs" id="rs7" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible"></svg>' + vid('vd7', 'fx/dust.webm', 25, 'screen', .5), 'dk');
  function render7(t) {
    var tf = L(6, 'fake'), tw = L(6, 'tool');
    enter($('hd'), eo(u(t, 0, .35)), 36); enter($('cr'), eo(u(t, .05, .4)), 50); enter($('ca'), eo(u(t, .15, .4)), 50); enter($('lr'), eo(u(t, .25, .35)), 20); enter($('la'), eo(u(t, tf, .35)), 20);
    var a = $('p7a').getContext('2d'); a.fillStyle = '#13243d'; a.fillRect(0, 0, 340, 610); cover(a, IMG.real, 340, 610);
    var b = $('p7b').getContext('2d'); b.fillStyle = '#13243d'; b.fillRect(0, 0, 340, 610); cover(b, IMG.storm, 340, 610);
    sweep(a, 340, 610, pw(t, [[.3, -.12], [1.5, 1.12]]), { dots: false, glow: 150 }); sweep(b, 340, 610, pw(t, [[tf + .2, -.12], [tf + 1.4, 1.12]]), { dots: false, glow: 150 });
    slam($('sr'), t, .75, -7, 1.8); slam($('sa'), t, tw + .2, 6, 1.8);
    var ee = bk(u(t, tw + .6, .35), 2); $('eq').style.opacity = u(t, tw + .6, .08); $('eq').style.transform = 'scale(' + ee + ') rotate(' + (-10 * (1 - ee)) + 'deg)';
    rstroke($('rs7'), 'ring', function (r) { return r.ellipse(538, 865, 150, 150, { seed: 5, stroke: '#c9962b', strokeWidth: 6, roughness: 1.6 }); }, eo(u(t, tw + .8, .5)));
  }

  // ================= 8: one clue, not a verdict =================
  var EV = [['WHO POSTED IT', 'FIRST?', IC.search, '1'], ['SYNTHID RESULT', 'A CLUE', IC.fingerprint, '2'], ['DOES THE STORY', 'ADD UP?', IC.chat, '3']];
  mk('s8', head('// WEIGH THE EVIDENCE', 'ONE CLUE,', 'NOT A VERDICT', 82, 196) +
    EV.map(function (e, i) { return '<div class="abs note" id="ev' + i + '" style="left:150px;top:' + (560 + i * 200) + 'px;width:560px;height:170px"><div class="thread"></div><div class="evc" style="height:100%"><div class="ico">' + ico(e[2], 38) + '</div><div><small>CLUE ' + e[3] + ' OF 3</small>' + e[0] + '<br>' + e[1] + '</div></div></div>'; }).join('') +
    '<div class="abs" id="pin8" data-ov="1" style="left:664px;top:700px;color:var(--verm);transform:rotate(25deg)">' + ico(IC.push, 56) + '</div>' +
    '<div class="abs chipr" id="vd8" style="left:738px;top:580px;font-size:23px">VERDICT</div>' +
    '<svg class="abs" id="rs8" width="1080" height="1920" style="left:0;top:0;pointer-events:none;overflow:visible"></svg>' +
    '<img class="abs" id="fg8" src="photos/figure.svg" style="left:722px;top:820px;width:196px;height:248px">' + vid('vg8', 'fx/grain.webm', 30, 'multiply', .3));
  function render8(t) {
    var cl8 = L(7, 'clue'), vd = L(7, 'verdict');
    enter($('hd'), eo(u(t, 0, .35)), 36);
    for (var i = 0; i < 3; i++) enter($('ev' + i), eo(u(t, .15 + i * .12, .38)), 50);
    var pe = bk(u(t, cl8 - .1, .35), 2); $('ev1').style.transform += ' scale(' + (1 + .02 * Math.sin(u(t, cl8 - .1, .5) * Math.PI)) + ')'; $('ev1').style.borderColor = t > cl8 ? '#c9962b' : '#13243d';
    $('pin8').style.opacity = u(t, cl8 - .1, .06); $('pin8').style.transform = 'rotate(25deg) translateY(' + (-70 * (1 - pe)) + 'px)';
    enter($('vd8'), eo(u(t, .5, .35)), 20); enter($('fg8'), eo(u(t, .3, .5)), 40);
    rstroke($('rs8'), 'x', function (r) { return r.line(742, 580, 910, 632, { seed: 7, stroke: '#e2412c', strokeWidth: 8, roughness: 1.2 }); }, eo(u(t, vd, .3)));
  }

  // ================= 9: recap + CTA =================
  mk('s9', '<div class="abs note recap" id="rc9" style="left:150px;top:170px;width:768px"><div class="thread"></div><div class="rh">CHECKLIST · 3 STEPS</div>' +
    '<div class="rr"><b>1</b>Open synthid.com</div><div class="rr"><b>2</b>Upload the file</div><div class="rr"><b>3</b>Found: a clue. None: no proof.</div></div>' +
    '<img class="abs pfp" id="pf9" src="photos/profile.jpg" style="left:415px;top:600px">' +
    '<div class="abs who" id="wh9" style="left:150px;top:872px;width:768px;text-align:center">@sandesh.explains</div>' +
    '<div class="abs" id="cb9" style="left:150px;top:970px;width:768px;display:flex;justify-content:center"><div class="cbub">' + ico(IC.chat, 44) + '<span>Comment</span><span class="kw" id="kw9"></span></div></div>' +
    '<div class="abs dm" id="dm9" style="left:150px;top:1112px;width:768px;text-align:center">→ I\'LL DM YOU THE CHECKLIST</div>' +
    '<div class="abs" id="bm9" style="left:150px;top:1170px;width:768px;display:flex;justify-content:center;align-items:center;gap:20px;color:var(--verm)">' + ico(IC.bookmark, 64) + '<div class="stamp found" style="font-size:34px;padding:8px 22px">SAVE THIS</div></div>' + vid('vd9', 'fx/dust.webm', 25, 'multiply', .0));
  function render9(t) {
    var cm = L(8, 'comment'), ck = L(8, 'check'), cs = L(8, 'checklist'), kw = 'CHECK', n = Math.floor(cl((t - ck) / .4, 0, 1) * kw.length);
    enter($('rc9'), eo(u(t, 0, .4)), 50); enter($('pf9'), eo(u(t, .1, .45)), 40, .7); enter($('wh9'), eo(u(t, .3, .4)), 24); enter($('cb9'), eo(u(t, cm, .35)), 30);
    $('kw9').textContent = ' ' + kw.slice(0, n) + (n < kw.length && Math.floor(t * 4) % 2 ? '|' : ''); enter($('dm9'), eo(u(t, cs - .1, .35)), 20); enter($('bm9'), eo(u(t, cs + .3, .35)), 20, .6);
    $('pf9').style.transform += ' scale(' + (1 + .015 * Math.sin(t * 3)) + ')';
  }

  // ---------- captions, light-band cuts, seek ----------
  st.insertAdjacentHTML('beforeend', '<div id="cap"><div id="capd"></div></div>');
  function caption(t) {
    var pg = null;
    for (var i = 0; i < PG.length; i++) { var w0 = WD[PG[i][0]], w1 = WD[PG[i][PG[i].length - 1]], nx = i + 1 < PG.length ? WD[PG[i + 1][0]].s : 1e9; if (t >= w0.s - .06 && t < Math.min(nx - .06, w1.e + .6)) pg = PG[i]; }
    if (t < .05) pg = PG[0];
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
  function vseek(v, tt) {
    return new Promise(function (res) {
      var fps = +v.dataset.fps || 30, dur = v.duration || 6, f = Math.floor((tt % (dur - .1)) * fps), target = (f + .5) / fps;
      if (Math.abs(v.currentTime - target) < 1e-4 && v.readyState >= 2) return res();
      var done = function () { v.removeEventListener('seeked', done); res(); }; v.addEventListener('seeked', done); v.currentTime = target;
    });
  }
  var SCN = [render1, render2, render3, render4, render5, render6, render7, render8, render9];
  window.__seek = function (t) {
    var cp = -1, si = 0, waits = [], nv;
    for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
    nv = NAVY[si];
    for (i = 0; i < SC.length; i++) { $('s' + (i + 1)).style.display = i === si ? 'block' : 'none'; if (i > 0 && Math.abs(t - SC[i]) < CUT / 2) { cp = (t - (SC[i] - CUT / 2)) / CUT; nv = lerp(NAVY[i - 1], NAVY[i], cp); } }
    drawBg(t, nv); SCN[si](t - SC[si]); cutDraw(cp); caption(t);
    [].forEach.call($('s' + (si + 1)).querySelectorAll('video.fxv'), function (v) { waits.push(vseek(v, t - SC[si])); });
    return waits.length ? Promise.all(waits) : undefined;
  };
  window.__ready = false;
  var FACES = ['700 20px Bodoni', '800 20px Bodoni', '500 20px Chivo', '700 20px Chivo', '600 20px Inter', '700 20px Inter'];
  var vids = [].slice.call(document.querySelectorAll('video.fxv')).map(function (v) { return new Promise(function (res) { if (v.readyState >= 1) res(); else v.addEventListener('loadedmetadata', res, { once: true }); }); });
  var imgs = [].slice.call(document.querySelectorAll('#stage img')).concat(LB, [IMG.storm, IMG.depth, IMG.real]).map(function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve(); });
  Promise.all([document.fonts.ready].concat(FACES.map(function (f) { return document.fonts.load(f); }), imgs, vids)).then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
})();
