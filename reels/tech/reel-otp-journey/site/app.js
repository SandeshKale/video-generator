(function () {
  var TM = window.TM, END = TM.END, FPS = 60, $ = function (i) { return document.getElementById(i) };
  var cv = $('cv'), cx = cv.getContext('2d'), vid = $('wv');
  var sm = document.createElement('canvas'); sm.width = 108; sm.height = 192; var sx = sm.getContext('2d');
  var sm2 = document.createElement('canvas'); sm2.width = 36; sm2.height = 64; var sx2 = sm2.getContext('2d');
  var vig = document.createElement('canvas'); vig.width = 1080; vig.height = 1920; (function () { var g = vig.getContext('2d'), r = g.createRadialGradient(540, 900, 380, 540, 960, 1250); r.addColorStop(0, 'rgba(0,0,0,0)'); r.addColorStop(1, 'rgba(0,0,0,.62)'); g.fillStyle = r; g.fillRect(0, 0, 1080, 1920) })();
  var tiles = []; for (var k = 0; k < 4; k++) { var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d'), d = g.createImageData(256, 256), s = 1234 + k * 77; for (var i = 0; i < d.data.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; var v = (s >>> 24); d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255 } g.putImageData(d, 0, 0); tiles.push(c) }
  function H(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  function cl(x, a, b) { return Math.max(a, Math.min(b, x)) }
  function ease(x) { x = cl(x, 0, 1); return x * x * (3 - 2 * x) }
  function pulse(t, a, b, fi, fo) { return ease((t - a) / (fi || .25)) * ease((b - t) / (fo || .25)) }
  // ---- script-driven HUD tables (times from the voice) ----
  var TAGS = [[0, 'YOUR PHONE', 'am'], [2.6, 'OVER THE CITY', 'cy'], [4.7, 'BANK SERVER', 'am'], [13.7, 'SMS GATEWAY', 'cy'], [16.73, 'TELECOM CORE', 'cy'], [19.28, 'RADIO TOWER', 'cy'], [23.63, 'IN THE AIR', 'cy'], [29.7, 'YOUR PHONE', 'am'], [45.5, 'FAKE CALLER', 'rd'], [53.6, 'BANK SERVER', 'am'], [56.3, 'THE CITY', 'cy'], [60.1, 'YOUR PHONE', 'am']];
  var HOPS = [[13.7, 'HOP 1/4 · SMS GATEWAY'], [16.73, 'HOP 2/4 · TELECOM CORE'], [19.28, 'HOP 3/4 · RADIO TOWER'], [23.63, 'HOP 4/4 · THROUGH THE AIR'], [29.7, 'DELIVERED']];
  var CHAP = [[4.7, 'I · The code'], [13.7, 'II · The road'], [30.2, 'III · The match'], [45.5, 'IV · The ask']];
  var COL = { am: '#ff9d3c', cy: '#7fe6ff', rd: '#ff3b3b' };
  window.EV = [[0.05, 'ping'], [0.05, 'sub'], [1.9, 'whoosh'], [4.7, 'whoosh'], [6.8, 'lock'], [13.7, 'whoosh'], [16.73, 'relay'], [19.28, 'relay'], [22.45, 'pulse'], [25.6, 'fade'], [29.7, 'ping'], [32.3, 'tick'], [33.7, 'burn'], [35.7, 'stamp'], [37.1, 'stamp'], [38.9, 'swarm'], [42.5, 'redlane'], [49.2, 'stamp'], [50.84, 'flip'], [52.5, 'hit'], [53.6, 'snap'], [56.35, 'resolve'], [60.1, 'end']];
  for (var q = 0; q < 12; q++) window.EV.push([4.7 + q * .18, 'dial']); for (var q2 = 0; q2 < 6; q2++) window.EV.push([30.2 + q2 * .15, 'key']);
  window.EV.sort(function (a, b) { return a[0] - b[0] }); window.__reelDurationSec = END;
  var lastF = -1;
  function seekVid(t) { var f = Math.round(t * FPS); var ft = Math.min(t + .004, END - .02);
    return new Promise(function (res) { var dn = function () { vid.removeEventListener('seeked', dn); res() }; vid.addEventListener('seeked', dn); vid.currentTime = ft }) }
  function stampEl(el, t, a, b, txt, col) { el.style.opacity = pulse(t, a, b, .12, .2); if (el.style.opacity > 0) { el.textContent = txt; el.style.color = col; el.style.borderColor = col; var p = ease((t - a) / .18); el.style.transform = 'rotate(-3deg) scale(' + (1.25 - .25 * p) + ')' } }
  function fx(t) {
    cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1; cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
    cx.drawImage(vid, 0, 0, 1080, 1920);
    sx.drawImage(vid, 0, 0, 108, 192); sx2.drawImage(vid, 0, 0, 36, 64);
    cx.globalCompositeOperation = 'screen'; cx.globalAlpha = .42; cx.drawImage(sm, 0, 0, 1080, 1920); cx.globalAlpha = .55; cx.drawImage(sm2, 0, 0, 1080, 1920);
    cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1; cx.drawImage(vig, 0, 0);
    // rain (pure function of t), eases after the CTA begins
    var ri = t < 56 ? 1 : 1 - .72 * ease((t - 56) / 7); cx.lineCap = 'round';
    for (var i = 0; i < 150; i++) { var sp = 1500 + H(i + 9) * 900, len = 50 + H(i + 3) * 90, x0 = (H(i) * 1500 - 200 - t * 120 * (.4 + H(i + 5))) , y0 = ((H(i + 1) * 2200 + t * sp) % 2300) - 200; var a = (.07 + .13 * H(i + 7)) * ri; if (H(i + 11) > ri) continue;
      cx.strokeStyle = 'rgba(175,225,255,' + a.toFixed(3) + ')'; cx.lineWidth = 1 + H(i + 13) * 1.6; cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x0 - len * .18, y0 + len); cx.stroke() }
    // film grain (seeded per frame)
    var fr = Math.round(t * FPS); cx.globalCompositeOperation = 'soft-light'; cx.globalAlpha = .30; var ox = (H(fr) * 256) | 0, oy = (H(fr + 99) * 256) | 0, tl = tiles[fr % 4];
    for (var gy = -1; gy < 8; gy++) for (var gx = -1; gx < 5; gx++) cx.drawImage(tl, gx * 256 - ox, gy * 256 - oy);
    cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1;
  }
  window.__seek = function (t) {
    t = cl(t, 0, END); return seekVid(t).then(function () {
      fx(t);
      // location tag + hops + lifetime
      var tg = TAGS[0]; for (var i = 0; i < TAGS.length; i++) if (t >= TAGS[i][0]) tg = TAGS[i];
      $('tag').innerHTML = '<i style="background:' + COL[tg[2]] + ';color:' + COL[tg[2]] + '"></i><span style="color:' + (tg[2] === 'rd' ? '#ff5a5a' : '#f1e8d6') + '">' + tg[1] + '</span>';
      var hp = ''; for (var j = 0; j < HOPS.length; j++) if (t >= HOPS[j][0] && t < (HOPS[j + 1] ? HOPS[j + 1][0] : 31.4)) hp = HOPS[j][1]; $('hop').textContent = hp;
      var life = t < 32.8 ? 1 - .9 * ease(t / 32.8) : 0;
      $('life').innerHTML = t >= 60.1 ? '' : (t < 32.8 ? 'OTP LIFETIME · MINUTES' : '<span style="color:#ff5a5a">OTP DEAD · USED ONCE</span>') + '<div class="bar"><b style="width:' + (life * 100).toFixed(1) + '%"></b></div>';
      $('life').style.opacity = t < 60.1 ? 1 : 0;
      // range line while the code is being drawn
      $('rng').textContent = t >= 4.7 && t < 8.2 ? 'RANGE 000000 → 999999' : ''; $('rng').style.opacity = pulse(t, 4.7, 8.2, .2, .3);
      // chapter titles
      var ct = ''; var co = 0; for (var c = 0; c < CHAP.length; c++) { var cc = pulse(t, CHAP[c][0], CHAP[c][0] + 2.6, .3, .5); if (cc > 0) { ct = CHAP[c][1]; co = cc } }
      $('ch').textContent = ct; $('ch').style.opacity = co; $('ch').style.transform = 'translateY(' + ((1 - co) * 14) + 'px)';
      // headline in the first seconds, then the 1-in-a-million counter
      var h = ease((3.3 - t) / .3); $('hl').style.opacity = h; if (h > 0) $('hl').innerHTML = 'This code dies<br>in <em>minutes</em>';
      var mp = pulse(t, 3.15, 4.6, .2, .3); $('mil').style.opacity = mp; if (mp > 0) $('mil').innerHTML = '<b>1</b> IN 1,000,000';
      // stamps
      stampEl($('s1'), t, 32.3, 34.6, 'Matched ✔', '#3dff9a'); $('s1').style.top = '640px';
      var s2 = $('s2'); $('s2').style.top = '640px';
      if (t >= 35.7 && t < 38.8) stampEl(s2, t, 35.7, 38.8, t < 37.1 ? 'Used once' : 'Blocked after wrong tries', '#ff3b3b');
      else if (t >= 49.2 && t < 50.84) stampEl(s2, t, 49.2, 50.84, 'Your payment', '#f1e8d6');
      else if (t >= 50.84 && t < 53.6) stampEl(s2, t, 50.84, 53.6, 'Their payment', '#ff3b3b');
      else if (t >= 53.6 && t < 56.1) stampEl(s2, t, 53.6, 56.1, 'No bank asks', '#ff9d3c');
      else if (t >= 56.4 && t < 60.0) { stampEl(s2, t, 56.4, 60.0, '1930', '#7fe6ff'); s2.style.fontSize = '150px'; s2.innerHTML = '1930<div style="font:600 24px/1.2 PM;letter-spacing:.1em;margin-top:8px">NATIONAL CYBERCRIME HELPLINE</div>' }
      else { s2.style.opacity = 0; s2.style.fontSize = '84px' }
      if (!(t >= 56.4 && t < 60.0)) s2.style.fontSize = '84px';
      $('wk').style.opacity = pulse(t, 25.7, 29.0, .2, .3);
      // captions: latest clause that has started, until just after its end
      var cap = null; for (var m = 0; m < TM.CL.length; m++) { var cl_ = TM.CL[m]; if (t >= cl_.a - .06 && t < cl_.b + .35) cap = cl_ }
      var ce = $('cap'); if (cap && t < 63.7) { var txt = cap.en, ix = txt.indexOf(cap.ac); ce.innerHTML = ix >= 0 ? txt.slice(0, ix) + '<b>' + cap.ac + '</b>' + txt.slice(ix + cap.ac.length) : txt; ce.style.opacity = 1; ce.className = (t >= 45.5 && t < 53.6) || (t >= 33.6 && t < 38.6) ? 'r' : '' } else ce.style.opacity = 0;
      $('ill').style.opacity = t < 60.1 ? 1 : 0;
      // end card
      var ec = ease((t - 60.1) / .5); $('endc').style.opacity = ec; $('endc').style.transform = 'translateY(' + ((1 - ec) * 24) + 'px)';
      var bt = [61.1, 61.8, 62.5]; for (var b = 1; b <= 3; b++) { var bp = ease((t - bt[b - 1]) / .22), bb = $('b' + b); bb.style.opacity = bp; bb.style.transform = 'scale(' + (.7 + .3 * bp + (t > 63.4 ? .05 * Math.sin((t - 63.4) * 7 + b) : 0)) + ')' }
      if (t >= 60.1) { cx.globalAlpha = .55 * ec; cx.fillStyle = '#04100f'; cx.fillRect(0, 0, 1080, 1920); cx.globalAlpha = 1 }
    })
  };
  window.__ready = false;
  var w = [new Promise(function (r) { if (vid.readyState >= 2) r(); else vid.addEventListener('loadeddata', r) })];
  ['400 20px IS', '400 20px AN', '700 20px Inter', '500 20px PM', '600 20px PM'].forEach(function (f) { w.push(document.fonts.load(f).catch(function () {})) });
  Promise.all(w).then(function () { return window.__seek(0) }).then(function () { window.__ready = true });
})();
