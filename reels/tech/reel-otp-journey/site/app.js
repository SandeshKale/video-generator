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
  // ---- HUD tables derived from the voice cues (TM.CUE) ----
  var C = TM.CUE;
  var TAGS = [[0, 'YOUR PHONE', 'am'], [C.hook_end + .5, 'THE ROUTE · REWIND', 'cy'], [C.a_bank, 'BANK', 'am'], [C.a_gate, 'SMS GATEWAY', 'cy'], [C.a_core, 'TELECOM CORE', 'cy'], [C.a_tow, 'RADIO TOWER', 'cy'], [C.a_air, 'IN THE AIR', 'cy'], [C.a_type - .4, 'YOUR PHONE', 'am'], [C.a_guess, 'ONE IN A MILLION', 'am'], [C.a_you, 'FAKE CALLER', 'rd'], [C.a_never, 'BANK', 'am'], [C.a_1930, 'THE WHOLE ROUTE', 'cy'], [C.a_cta, 'YOUR PHONE', 'am']];
  var STEPS = [[C.a_bank, 0], [C.a_gate, 1], [C.a_core, 2], [C.a_tow, 3], [C.a_type - .4, 4]], STEPN = ['BANK', 'GATEWAY', 'CORE', 'TOWER', 'PHONE'];
  var COL = { am: '#ff9d3c', cy: '#7fe6ff', rd: '#ff3b3b' };
  window.EV = [[0.05, 'ping'], [0.05, 'sub'], [C.hook_end, 'whoosh'], [C.a_bank, 'lock'], [C.a_gate, 'whoosh'], [C.a_gate + 1.7, 'relay'], [C.a_core, 'relay'], [C.tow_end, 'pulse'], [C.a_air + 1.9, 'fade'], [C.a_type - .4, 'ping'], [C.a_match + .3, 'tick'],
    [C.a_dead - .4, 'burn'], [C.a_dead + .4, 'stamp'], [C.a_block + .4, 'stamp'], [C.a_guess, 'swarm'], [C.a_you + .6, 'redlane'], [C.a_isnt, 'stamp'], [C.a_own, 'flip'], [C.own_end, 'hit'], [C.a_never, 'snap'], [C.a_never + 1.3, 'burn'], [C.a_1930, 'resolve'], [C.a_cta, 'end']];
  for (var q = 0; q < 10; q++) window.EV.push([C.a_bank + q * .2, 'dial']); for (var q2 = 0; q2 < 6; q2++) window.EV.push([C.a_type + q2 * .15, 'key']);
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
    var ri = t < C.a_1930 ? 1 : 1 - .72 * ease((t - C.a_1930) / 7); cx.lineCap = 'round';
    for (var i = 0; i < 60; i++) { var sp = 1500 + H(i + 9) * 900, len = 50 + H(i + 3) * 90, x0 = (H(i) * 1500 - 200 - t * 120 * (.4 + H(i + 5))) , y0 = ((H(i + 1) * 2200 + t * sp) % 2300) - 200; var a = (.05 + .09 * H(i + 7)) * ri; if (H(i + 11) > ri) continue;
      cx.strokeStyle = 'rgba(175,225,255,' + a.toFixed(3) + ')'; cx.lineWidth = 1 + H(i + 13) * 1.6; cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x0 - len * .18, y0 + len); cx.stroke() }
    // film grain (seeded per frame)
    var fr = Math.round(t * FPS); cx.globalCompositeOperation = 'soft-light'; cx.globalAlpha = .12; var ox = (H(fr) * 256) | 0, oy = (H(fr + 99) * 256) | 0, tl = tiles[fr % 4];
    for (var gy = -1; gy < 8; gy++) for (var gx = -1; gx < 5; gx++) cx.drawImage(tl, gx * 256 - ox, gy * 256 - oy);
    cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1;
  }
  window.__seek = function (t) {
    t = cl(t, 0, END); return seekVid(t).then(function () {
      fx(t);
      // location tag + 5-step route tracker
      var tg = TAGS[0]; for (var i = 0; i < TAGS.length; i++) if (t >= TAGS[i][0]) tg = TAGS[i];
      $('tag').innerHTML = '<i style="background:' + COL[tg[2]] + ';color:' + COL[tg[2]] + '"></i><span style="color:' + (tg[2] === 'rd' ? '#ff5a5a' : '#f1e8d6') + '">' + tg[1] + '</span>';
      var cur = -1; for (var j = 0; j < STEPS.length; j++) if (t >= STEPS[j][0]) cur = STEPS[j][1];
      if (t >= C.a_guess) cur = t < C.a_never ? 4 : 5; var trk = ''; for (var k = 0; k < 5; k++) { var st = k < cur || cur === 5 ? 'done' : k === cur ? 'on' : ''; trk += '<span class="' + st + '">' + (k + 1) + '</span>' }
      $('trk').innerHTML = trk + '<em>' + (cur >= 0 && cur < 5 ? STEPN[cur] : cur === 5 ? 'DONE' : '') + '</em>'; $('trk').style.opacity = t >= C.a_bank - .3 && t < C.a_cta ? 1 : 0;
      // headline in the first seconds, then the 1-in-a-million counter
      var h = ease((C.hook_end + .9 - t) / .3); $('hl').style.opacity = h; if (h > 0) $('hl').innerHTML = 'This code dies<br>in <em>minutes</em>';
      var mp = pulse(t, C.million, C.a_bank - .1, .2, .3); $('mil').style.opacity = mp; if (mp > 0) $('mil').innerHTML = '<b>1</b> IN 1,000,000';
      var gp = pulse(t, C.a_guess + .2, C.a_you - .1, .3, .4); $('gu').style.opacity = gp; if (gp > 0) $('gu').innerHTML = '<b>1</b> IN 1,000,000<small>EVERY CELL = ONE POSSIBLE CODE</small>';
      // stamps
      var s1 = $('s1'), s2 = $('s2'); s1.style.top = '520px'; s2.style.top = '520px';
      stampEl(s1, t, C.a_match + .3, C.a_dead + .1, 'Matched ✔', '#3dff9a');
      if (t >= C.a_dead + .4 && t < C.a_guess - .1) stampEl(s2, t, C.a_dead + .4, C.a_guess - .1, t < C.a_block + .4 ? 'Used once' : 'Blocked', '#ff3b3b');
      else if (t >= C.a_rush + .6 && t < C.a_isnt + .6) stampEl(s2, t, C.a_rush + .6, C.a_isnt + .6, 'Your payment', '#f1e8d6');
      else if (t >= C.a_isnt + .6 && t < C.a_never - .1) stampEl(s2, t, C.a_isnt + .6, C.a_never - .1, 'Their payment', '#ff3b3b');
      else if (t >= C.a_never && t < C.a_1930 - .2) stampEl(s2, t, C.a_never, C.a_1930 - .2, 'No bank asks', '#ff9d3c');
      else if (t >= C.a_1930 + .1 && t < C.a_cta - .1) { stampEl(s2, t, C.a_1930 + .1, C.a_cta - .1, '1930', '#7fe6ff'); s2.style.fontSize = '150px'; s2.innerHTML = '1930<div style="font:600 24px/1.2 PM;letter-spacing:.1em;margin-top:8px">NATIONAL CYBERCRIME HELPLINE</div>' }
      else { s2.style.opacity = 0 }
      if (!(t >= C.a_1930 + .1 && t < C.a_cta - .1)) s2.style.fontSize = '84px';
      $('wk').style.opacity = pulse(t, C.a_air + 1.9, C.a_type - .6, .2, .3);
      // captions
      var cap = null; for (var m = 0; m < TM.CL.length; m++) { var c_ = TM.CL[m]; if (t >= c_.a - .06 && t < c_.b + .35) cap = c_ }
      var ce = $('cap'); if (cap && t < C.voice_end + .3) { var txt = cap.en, ix = txt.indexOf(cap.ac); ce.innerHTML = ix >= 0 ? txt.slice(0, ix) + '<b>' + cap.ac + '</b>' + txt.slice(ix + cap.ac.length) : txt; ce.style.opacity = 1; ce.className = (t >= C.a_rush - .1 && t < C.a_never) || (t >= C.a_dead - .1 && t < C.a_guess - .1) ? 'r' : '' } else ce.style.opacity = 0;
      $('ill').style.opacity = t < C.a_cta ? 1 : 0;
      // end card
      var ec = ease((t - C.a_cta) / .5); $('endc').style.opacity = ec; $('endc').style.transform = 'translateY(' + ((1 - ec) * 24) + 'px)';
      var bt = [C.a_cta + 1.0, C.a_cta + 1.7, C.a_cta + 2.4]; for (var b = 1; b <= 3; b++) { var bp = ease((t - bt[b - 1]) / .22), bb = $('b' + b); bb.style.opacity = bp; bb.style.transform = 'scale(' + (.7 + .3 * bp + (t > C.a_cta + 3.1 ? .05 * Math.sin((t - C.a_cta - 3.1) * 7 + b) : 0)) + ')' }
      if (t >= C.a_cta) { cx.globalAlpha = .5 * ec; cx.fillStyle = '#04100f'; cx.fillRect(0, 0, 1080, 1920); cx.globalAlpha = 1 }
    })
  };
  window.__ready = false;
  var w = [new Promise(function (r) { if (vid.readyState >= 2) r(); else vid.addEventListener('loadeddata', r) })];
  ['400 20px IS', '400 20px AN', '700 20px Inter', '500 20px PM', '600 20px PM'].forEach(function (f) { w.push(document.fonts.load(f).catch(function () {})) });
  Promise.all(w).then(function () { return window.__seek(0) }).then(function () { window.__ready = true });
})();
