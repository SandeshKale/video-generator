// "A judge just told the internet: take her face down" ("Tabloid Hoarding"). Every visual is a pure function of t (window.__seek).
// Through-line: one blank mannequin mask (a face-shaped void, no features): pink = a fake copy, turquoise = the original, stamped = ordered.
// No real person's face is generated or shown; the name is typographic. Illustrations carry an "ILLUSTRATION" tag.
(function () {
  var TM = window.TM, S = TM.S, C = TM.CUE, END = TM.END, ENV = TM.ENV, W = 1080, H = 1920;
  var cv = document.getElementById('cv'), g = cv.getContext('2d');
  var $ = function (id) { return document.getElementById(id) };
  function cl(x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)) }
  function seg(t, a, b) { return cl((t - a) / (b - a)) }
  function e3(x) { return 1 - Math.pow(1 - x, 3) } function io(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }
  function bk(x) { var c = 1.8; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2) }
  function lerp(a, b, u) { return a + (b - a) * u }
  function ih(k, salt) { var x = (Math.floor(k) * 2654435761 ^ ((salt || 0) * 2246822519)) >>> 0; x = Math.imul(x ^ (x >>> 16), 2246822507) >>> 0; x = Math.imul(x ^ (x >>> 13), 3266489909) >>> 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967296 }
  var EV = []; function ev(t, k) { EV.push([+t.toFixed(3), k]) }
  var INK = '#14101a', PAPER = '#f4ecd8', PK = '#ff2d78', TQ = '#00b8ad', SF = '#ffb000', DIM = '#6d6458';
  function img(src) { var i = new Image(); i.src = src; return i }
  var GAV = []; for (var gi = 0; gi < 14; gi++) GAV.push(img('3d/gavel_' + String(gi).padStart(2, '0') + '.png'));

  // ---- halftone newsprint ground: a pink dot screen that drifts (pure t) ------------------------------------------------------------
  var tile = document.createElement('canvas'); tile.width = tile.height = 24; (function () { var x = tile.getContext('2d'); x.fillStyle = 'rgba(255,45,120,.13)'; x.beginPath(); x.arc(6, 6, 3.2, 0, 7); x.fill(); x.beginPath(); x.arc(18, 18, 3.2, 0, 7); x.fill(); x.fillStyle = 'rgba(20,16,26,.05)'; x.beginPath(); x.arc(18, 6, 1.6, 0, 7); x.fill(); x.beginPath(); x.arc(6, 18, 1.6, 0, 7); x.fill() })();
  var PAT = g.createPattern(tile, 'repeat');
  function bg(t) { g.fillStyle = PAPER; g.fillRect(0, 0, W, H); g.save(); g.translate((t * 14) % 24, (t * 9) % 24); g.translate(-24, -24); g.fillStyle = PAT; g.fillRect(0, 0, W + 48, H + 48); g.restore();
    var v = g.createRadialGradient(540, 960, 500, 540, 960, 1300); v.addColorStop(0, 'rgba(120,80,40,0)'); v.addColorStop(1, 'rgba(120,80,40,.16)'); g.fillStyle = v; g.fillRect(0, 0, W, H) }

  // ---- small drawing helpers -----------------------------------------------------------------------------------------------------
  function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath() }
  function txt(s, x, y, font, col, a, align, sh) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = font; g.fillStyle = col; g.textAlign = align || 'left'; g.textBaseline = 'alphabetic'; if (sh) { g.fillStyle = INK; g.fillText(s, x + sh, y + sh); g.fillStyle = col } g.fillText(s, x, y); g.restore() }
  function tag(s, col, x, y, a, tc) { if (a <= 0) return 0; g.save(); g.globalAlpha = a; g.font = '400 19px SE'; var w = g.measureText(s).width + 24; g.fillStyle = col; g.fillRect(x, y, w, 34); g.fillStyle = tc || INK; g.fillText(s, x + 12, y + 24); g.restore(); return w }
  // the mannequin mask: a blank, feature-less face-shaped void (egg head, neck, shoulders). col = fill; fake = glitch RGB-split copy
  function mask(x, y, h, col, a, o) { o = o || {}; if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); if (o.rot) g.rotate(o.rot);
    function shape() { g.beginPath(); g.moveTo(0, -.52 * h); g.bezierCurveTo(.30 * h, -.52 * h, .31 * h, -.14 * h, .16 * h, .09 * h); g.bezierCurveTo(.11 * h, .17 * h, -.11 * h, .17 * h, -.16 * h, .09 * h); g.bezierCurveTo(-.31 * h, -.14 * h, -.30 * h, -.52 * h, 0, -.52 * h); g.closePath() }
    function body() { shape(); g.rect(-.075 * h, .1 * h, .15 * h, .16 * h); g.moveTo(-.34 * h, .5 * h); g.bezierCurveTo(-.34 * h, .28 * h, -.12 * h, .24 * h, 0, .24 * h); g.bezierCurveTo(.12 * h, .24 * h, .34 * h, .28 * h, .34 * h, .5 * h); g.lineTo(-.34 * h, .5 * h) }
    if (o.glitch) { g.fillStyle = '#35d6ff'; g.save(); g.translate(-o.glitch, 0); body(); g.fill(); g.restore(); g.fillStyle = col; g.save(); g.translate(o.glitch, 0); body(); g.fill(); g.lineWidth = Math.max(2, h * .018); g.strokeStyle = INK; body(); g.stroke(); g.restore() }
    else { g.fillStyle = col; body(); g.fill(); g.lineWidth = Math.max(2, h * .018); g.strokeStyle = INK; body(); g.stroke();
      var sh = g.createLinearGradient(-.3 * h, 0, .3 * h, 0); sh.addColorStop(0, 'rgba(255,255,255,.38)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,.22)'); g.fillStyle = sh; body(); g.fill();
      g.strokeStyle = 'rgba(20,16,26,.28)'; g.lineWidth = Math.max(1, h * .008); g.beginPath(); g.moveTo(-.2 * h, -.18 * h); g.quadraticCurveTo(0, -.1 * h, .2 * h, -.18 * h); g.moveTo(0, -.5 * h); g.lineTo(0, .08 * h); g.stroke() }
    g.restore() }
  function stamp(label, x, y, w, hh, col, rot, u, a) { if (u <= 0) return; var s = u < 1 ? lerp(2.4, 1, e3(u)) : 1; g.save(); g.globalAlpha = a == null ? cl(u * 3) : a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
    g.strokeStyle = col; g.lineWidth = 9; g.strokeRect(-w / 2, -hh / 2, w, hh); g.lineWidth = 3; g.strokeRect(-w / 2 + 12, -hh / 2 + 12, w - 24, hh - 24); g.fillStyle = col; g.font = '400 ' + Math.floor(hh * .5) + 'px BG'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 0, 4); g.restore() }
  function lock(x, y, s, col, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.fillStyle = col; g.strokeStyle = INK; g.lineWidth = 4; rr(-s / 2, -s * .1, s, s * .8, s * .12); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -s * .1, s * .3, Math.PI, 0); g.lineWidth = s * .14; g.stroke(); g.restore() }

  // ---- scene DOM (eyebrow + headline are DOM; the heroes are canvas) ----------------------------------------------------------------
  var DOMS = [];
  function mk(eye, h) { var d = document.createElement('div'); d.className = 'sc'; d.innerHTML = '<div class="eye"><i></i><span class="et">' + eye + '</span></div><div class="h">' + h + '</div>'; $('scenes').appendChild(d); DOMS.push(d); return d }
  function setH(d, h) { var el = d.querySelector('.h'); if (el.getAttribute('data-h') !== h) { el.innerHTML = h; el.setAttribute('data-h', h) } }
  function setE(d, s) { var el = d.querySelector('.et'); if (el.getAttribute('data-e') !== s) { el.textContent = s; el.setAttribute('data-e', s) } }
  var SC = [];

  // 0 hook: ransom-note headline + a billboard of one fake mask; a crane takes the face down ---------------------------------------------------
  var h0 = mk('A JUDGE JUST TOLD THE INTERNET', ''); h0.querySelector('.h').style.display = 'none';
  var TILES = [['TAKE', 0, 330], ['HER', 0, 470], ['FACE', 300, 470], ['DOWN', 0, 610]];
  var TILECOL = [[PK, PAPER], [INK, PAPER], [SF, INK], [TQ, INK], [PAPER, INK]];
  function ransom(word, x, y, t0, t, a, size) { var xx = x, hh = size || 112; for (var i = 0; i < word.length; i++) { var ch = word[i], k = word.charCodeAt(0) * 7 + i * 13, c = TILECOL[Math.floor(ih(k, 1) * 5)], f = ih(k, 2) < .5 ? 'BG' : 'AN', fs = f === 'AN' ? hh * 1.05 : hh * .8;
      g.save(); g.font = '400 ' + fs + 'px ' + f; var w = g.measureText(ch).width + 26; var u = seg(t, t0 + i * .05, t0 + i * .05 + .22), s = u < 1 ? bk(u) : 1; g.globalAlpha = a * cl(u * 4);
      g.translate(xx + w / 2, y + hh / 2); g.rotate((ih(k, 3) - .5) * .16); g.scale(s, s); g.fillStyle = c[0]; g.fillRect(-w / 2, -hh / 2, w, hh); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(-w / 2, -hh / 2, w, hh);
      g.fillStyle = c[1]; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, 0, 6); g.restore(); xx += w + 8 } return xx }
  SC.push(function (t, a) { var l = t, bx = 110, by = 760, bw = 808, bh = 440;
    var xe = ransom('TAKE', 110, 290, -1.2, t, a, 118); xe = ransom('HER', 110, 430, -1.2, t, a, 118); ransom('FACE', xe + 22, 430, -1.0, t, a, 118); ransom('DOWN', 110, 570, -.9, t, a, 118);
    // eyebrow typed word by word on the voice
    var et = h0.querySelector('.et'); et.textContent = 'A JUDGE JUST TOLD THE INTERNET';
    // billboard: posts, board, rail with a trolley
    g.save(); g.globalAlpha = a; g.fillStyle = INK; g.fillRect(bx + 120, by + bh, 26, 120); g.fillRect(bx + bw - 146, by + bh, 26, 120);
    g.fillStyle = PAPER; g.fillRect(bx, by, bw, bh); g.lineWidth = 12; g.strokeStyle = INK; g.strokeRect(bx, by, bw, bh); g.lineWidth = 4; g.strokeStyle = PK; g.strokeRect(bx + 18, by + 18, bw - 36, bh - 36);
    g.fillStyle = INK; g.fillRect(bx - 12, by - 36, bw + 24, 26); var tx = lerp(bx + 200, bx + bw / 2, io(seg(t, 0, 1.6))); g.fillStyle = SF; g.fillRect(tx - 28, by - 46, 56, 46); g.restore();
    var lift = seg(t, C.take, C.take + .9), hookY = by - 20 + 180 * seg(t, C.take, C.take + .35) - 220 * io(seg(t, C.take + .45, C.take + 1.15)), maskY = by + bh / 2 + 10 - 340 * e3(seg(t, C.take + .5, C.take + 1.2));
    var gone = t > C.take + 1.25;
    if (!gone) { g.save(); g.beginPath(); g.rect(bx, by - 10, bw, bh + 10); g.clip(); var jit = (ih(Math.floor(t * 14), 5) - .5) * 14 * (1 - seg(t, C.take, C.take + .3)); mask(bx + bw / 2, maskY, 330, PK, a, { glitch: Math.abs(jit) + 2 }); mask(bx + bw / 2 + jit * .6, maskY, 330, PK, a * .25); g.restore() }
    // scanlines over the fake while it hangs there
    if (t < C.take) { g.save(); g.globalAlpha = a * .22; g.fillStyle = INK; for (var yy = by + 22; yy < by + bh - 22; yy += 9) g.fillRect(bx + 22, yy + (t * 40) % 9, bw - 44, 2); g.restore() }
    // cable + hook
    g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(tx, by - 10); g.lineTo(bx + bw / 2, hookY); g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(bx + bw / 2, hookY + 8, 14, 0, Math.PI, false); g.lineTo(bx + bw / 2 - 14, hookY + 8); g.fill(); g.restore();
    tag('ILLUSTRATION · A BLANK MASK, NOT A REAL FACE', PK, bx, by + bh + 22, a * seg(t, .2, .5), PAPER);
    stamp('TAKEN DOWN', bx + bw / 2, by + bh / 2 + 10, 470, 130, PK, -.14, seg(t, C.down, C.down + .22), a);
    if (t > C.down && t < C.down + .3) { g.save(); g.globalAlpha = a * (1 - (t - C.down) / .3) * .3; g.fillStyle = PAPER; g.fillRect(0, 0, W, H); g.restore() } });
  ev(0, 'boom'); ev(C.take, 'whoosh'); ev(C.down, 'stamp');

  // 1 the case: a typewriter docket card ----------------------------------------------------------------------------------------------------
  var h1 = mk('BOMBAY HIGH COURT · 1 OCT 2026', 'THE <em class="r">DOCKET</em>');
  var DOCK = ['SAMANTHA RUTH PRABHU', 'v.', 'JOHN DOE & ORS.', '', 'SUIT: PERSONALITY RIGHTS', 'RELIEF: TAKEDOWN OF AI DEEPFAKES,', 'MISUSE OF NAME, IMAGE, VOICE'];
  SC.push(function (t, a) { var l = t - S[1], x = 150, y = 560;
    g.save(); g.globalAlpha = a; g.translate(540, y + 220); g.rotate(-.025); g.fillStyle = '#fffdf3'; g.fillRect(-420, -190, 840, 420); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-420, -190, 840, 420); g.fillStyle = PK; g.fillRect(-420, -190, 840, 46); g.restore();
    txt('REPORTED DOCKET · NOT THE ORDER TEXT', 540 - 400, y + 62, '400 20px SE', PAPER, a, 'left');
    var cps = 38, shown = Math.floor(Math.max(0, l - .25) * cps), pos = 0;
    DOCK.forEach(function (ln, i) { var part = ln.slice(0, Math.max(0, Math.min(ln.length, shown - pos))); pos += ln.length + 2; txt(part, 150, y + 130 + i * 46, i === 0 || i === 2 ? '400 34px BG' : '400 27px SE', INK, a) });
    if (Math.floor(t * 2) % 2 === 0) { g.save(); g.globalAlpha = a; g.fillStyle = INK; g.fillRect(150 + (pos > 0 ? 6 : 0) + 18 * 0, y + 130 + 6 * 46 + 8, 14, 28); g.restore() }
    stamp('INTERIM', 760, y + 450, 330, 100, SF, .12, seg(l, 1.6, 1.85), a); mask(790, y + 20 + 0, 0, TQ, 0);
    tag('JUSTICE MADHAV JAMDAR · REPORTED', TQ, 150, y + 600, a * seg(l, .8, 1.1)) });
  ev(S[1], 'whoosh'); ev(S[1] + 1.6, 'stamp');

  // 2 fakes everywhere -> gavel -> order (one continuous scene so the strike is never cut) ------------------------------------------------------
  var h2 = mk('WHAT WAS POSTED · ILLUSTRATION', 'AI FAKES OF <em class="k">HER FACE</em>');
  var COLS = 25, ROWS = 11, FX0 = 110, FY0 = 450, CW = 808 / COLS, CH = 57, STRIKE = 10.45, GX = 400, GY = 930;
  var ORDER = []; for (var oi = 0; oi < COLS * ROWS; oi++) ORDER.push([ih(oi, 41), oi]); ORDER.sort(function (p, q) { return p[0] - q[0] }); var RANK = []; ORDER.forEach(function (p, r) { RANK[p[1]] = r });
  function gavelFrame(t) { // raised hold -> swing to the strike at STRIKE -> rebound -> settle
    if (t < STRIKE - .5) return 0; if (t < STRIKE) return Math.floor(seg(t, STRIKE - .5, STRIKE) * 6); var u = (t - STRIKE) / .62; return 6 + Math.min(7, Math.floor(u * 8)) }
  SC.push(function (t, a) {
    // shake on the strike
    var sk = seg(t, STRIKE, STRIKE + .3), sx = (1 - sk) * Math.sin(t * 90) * 9 * (t > STRIKE ? 1 : 0), sy = (1 - sk) * Math.cos(t * 77) * 7 * (t > STRIKE ? 1 : 0); g.save(); g.translate(sx, sy);
    var hasOriginal = t > C.name - .1, t0 = S[2] + .1;
    setH(h2, t < C.interim ? 'AI FAKES OF <em class="k">HER FACE</em>' : t < C.name - .1 ? 'THE <em class="r">INTERIM ORDER</em>' : '<em class="r">HER</em> NAME. IMAGE. VOICE.');
    setE(h2, t < C.interim ? 'WHAT WAS POSTED · ILLUSTRATION' : t < C.name - .1 ? 'BOMBAY HC · INTERIM ORDER' : 'WHAT THE ORDER PROTECTS');
    // the fake farm: copies of one blank mask (schematic: NOT a count)
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) { var k = r * COLS + c, born = t0 + 0.15 + Math.pow(RANK[k] / (COLS * ROWS), 1.5) * 2.5, u = seg(t, born, born + .22);
      var dx = FX0 + c * CW + CW / 2, dy = FY0 + r * CH + CH / 2 + 26, dist = Math.hypot(dx - GX, dy - GY), die = STRIKE + .05 + dist / 1100, du = seg(t, die, die + .22);
      if (u <= 0 || du >= 1) continue; var s = (u < 1 ? bk(u) : 1) * (1 - du), jx = (ih(k + Math.floor(t * 8), 9) - .5) * 3.4 * (t < STRIKE ? 1 : 0), col = ih(k, 7) < .6 ? PK : ih(k, 7) < .85 ? '#ff6aa0' : '#e01660';
      mask(dx + jx, dy, 50 * s, col, a * (1 - du * .5)); if (du > 0 && du < 1) { g.save(); g.globalAlpha = a * (1 - du); g.strokeStyle = SF; g.lineWidth = 3; g.beginPath(); g.arc(dx, dy, 8 + 26 * du, 0, 7); g.stroke(); g.restore() } }
    // waveform ribbon under the farm: the voice copies too (decorative, same colour as the fakes)
    if (t < STRIKE + .4) { g.save(); g.globalAlpha = a * seg(t, t0 + 1.2, t0 + 1.6) * (1 - seg(t, STRIKE, STRIKE + .4)); g.strokeStyle = PK; g.lineWidth = 3; g.beginPath(); for (var xw = 110; xw <= 918; xw += 4) { var ei = Math.floor((t * 50 + (xw - 110) * .25) % ENV.length), yv = 1105 - (ENV[ei] / 99) * 34 * (.6 + .4 * Math.sin(xw * .05 + t * 6)); if (xw === 110) g.moveTo(xw, yv); else g.lineTo(xw, yv) } g.stroke(); g.restore() }
    tag('ILLUSTRATION · COPIES OF ONE FACE · NOT A COUNT', PK, 110, 1130, a * seg(t, t0 + .5, t0 + .8) * (1 - seg(t, STRIKE + .3, STRIKE + .6)), PAPER);
    // the gavel (Blender frames) comes in at 'The interim order?'
    var gu = seg(t, C.interim - .5, C.interim - .1), gf = gavelFrame(t), gim = GAV[gf];
    if (gu > 0 && t < C.name + .1 && gim.complete && gim.naturalWidth) { g.save(); g.globalAlpha = a * gu * (1 - seg(t, C.name - .2, C.name + .1)); g.translate(0, (1 - e3(gu)) * 60); g.drawImage(gim, GX - 340, GY - 372, 680, 728); g.restore() }
    // stamp slams on the strike
    var su = seg(t, STRIKE, STRIKE + .16); stamp('TAKE IT DOWN', 540, 700, 600, 150, SF, -.1, su, a * (1 - seg(t, C.name - .25, C.name + .05)));
    if (t > STRIKE && t < STRIKE + .12) { g.save(); g.globalAlpha = a * .45 * (1 - (t - STRIKE) / .12); g.fillStyle = PAPER; g.fillRect(0, 0, W, H); g.restore() }
    // the original: turquoise mask with three locks (name / image / voice) on the words
    if (hasOriginal) { var ou = seg(t, C.name - .1, C.name + .3), os = ou < 1 ? bk(ou) : 1; g.save(); g.globalAlpha = a * ou; g.fillStyle = 'rgba(0,184,173,.12)'; g.beginPath(); g.arc(540, 830, 250 * os, 0, 7); g.fill(); g.restore(); mask(540, 830, 400 * os, TQ, a * ou);
      [['HER NAME', C.name, 180, 640], ['HER IMAGE', C.image, 900 - 20, 790], ['HER VOICE', C.hervoice, 180, 940]].forEach(function (q, i) { var qu = seg(t, q[1] - .05, q[1] + .2); if (qu <= 0) return; var w = 250, xx = q[2] === 900 - 20 ? 918 - w : 110, yy = q[3]; g.save(); g.globalAlpha = a * qu; g.translate(xx + w / 2, yy); g.rotate((i - 1) * .06); g.scale(bk(qu), bk(qu)); g.fillStyle = i === 1 ? SF : i === 0 ? PK : INK; g.fillRect(-w / 2, -34, w, 68); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(-w / 2, -34, w, 68); g.fillStyle = i === 2 ? PAPER : i === 0 ? PAPER : INK; g.font = '400 27px BG'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(q[0], 0, 3); g.restore() });
      lock(540, 1010, 70, SF, a * seg(t, C.hervoice, C.hervoice + .3)) }
    g.restore() });
  ev(S[2], 'whoosh'); ev(C.interim - .4, 'tick'); ev(STRIKE, 'strike'); ev(C.remove, 'stamp'); ev(C.name, 'pop'); ev(C.image, 'pop'); ev(C.hervoice, 'pop');

  // 3-7 placeholders for the full build: headline + the through-line mask in its meaning colour -------------------------------------------------------
  var PH = [['PREETI ZINTA · JULY 2026 · REPORTED', 'ANOTHER STAR, <em class="r">SAME ORDER</em>', TQ, S[3]], ['PLATFORMS TOLD TO PULL IT', 'GOOGLE. META. <em class="k">X.</em>', PK, S[4]], ['WHAT PERSONALITY RIGHTS MEAN', 'YOUR <em class="r">FACE</em>, NAME, VOICE', TQ, S[5]], ['INTERIM, NOT FINAL', 'THE FIGHT ISN\'T <em class="s">OVER</em>', SF, S[6]]];
  PH.forEach(function (p) { var d = mk(p[0], p[1]); SC.push(function (t, a) { var u = seg(t, p[3], p[3] + .3); mask(540, 860, 520, p[2], a * u); txt('PLACEHOLDER (full build)', 540, 1180, '400 24px SE', DIM, a, 'center') }) });

  // 7 the twist: a star has a lawyer, you have a voice note; the voice is cloned from its own waveform ------------------------------------------------
  var h7 = mk('WHO CAN AFFORD A COURT ORDER', 'A STAR NEEDS <em class="r">A LAWYER</em>');
  function envAt(tt) { var i = Math.floor(tt * 50); return i < 0 || i >= ENV.length ? 0 : ENV[i] / 99 }
  function wave(x0, x1, yc, amp, tc, shift, col, a, wid, style) { g.save(); g.globalAlpha = a; g.fillStyle = col; var step = 5; for (var x = x0; x < x1; x += step) { var tt = tc + (x - (x0 + x1) / 2) / 170 - shift, v = envAt(tt), j = style === 'clone' ? (ih(Math.floor(x / step) + Math.floor(shift * 40), 31) - .5) * .3 : 0, hh = Math.max(3, (v * amp * (1 + j)) * (style === 'clone' ? .85 : 1)); g.fillRect(x, yc - hh / 2, step - 1.5, hh) } g.restore() }
  SC.push(function (t, a) { var l = t - S[7];
    setH(h7, t < C.cloned - .1 ? 'A STAR NEEDS <em class="r">A LAWYER</em>' : t < C.before ? 'YOUR VOICE CAN BE <em class="k">CLONED</em>' : 'BEFORE YOU POST THAT <em class="k">VOICE NOTE</em>');
    setE(h7, t < C.cloned - .1 ? 'WHO CAN AFFORD A COURT ORDER' : t < C.before ? 'ILLUSTRATION · HOW A CLONE COPIES A VOICE' : 'BEFORE YOU HIT SEND');
    var cu = 1 - seg(t, C.cloned - .15, C.cloned + .25);
    if (cu > 0) { // head to head: STAR (real, turquoise, lawyer + order) vs YOU (dashed, no order)
      var su = seg(t, S[7] + .25, S[7] + .6), yu = seg(t, C.you - .1, C.you + .3);
      g.save(); g.globalAlpha = a * cu * su; g.translate(0, (1 - e3(su)) * 50); g.fillStyle = 'rgba(0,184,173,.14)'; g.fillRect(110, 580, 390, 560); g.lineWidth = 8; g.strokeStyle = TQ; g.strokeRect(110, 580, 390, 560); g.restore();
      mask(305, 850, 330, TQ, a * cu * su); txt('A STAR', 305, 650, '400 40px BG', INK, a * cu * su, 'center');
      var lw = seg(t, C.lawyer - .1, C.lawyer + .25); if (lw > 0) { g.save(); g.globalAlpha = a * cu * lw; g.translate(305, 1040); g.scale(bk(lw), bk(lw)); g.fillStyle = INK; rr(-70, -40, 140, 90, 10); g.fill(); g.fillStyle = SF; g.fillRect(-70, -5, 140, 12); g.fillRect(-14, -52, 28, 14); g.restore(); txt('LAWYER', 305, 1112, '400 22px SE', INK, a * cu * lw, 'center') }
      stamp('ORDER', 400, 780, 200, 70, TQ, .15, seg(t, C.lawyer + .3, C.lawyer + .5), a * cu);
      g.save(); g.globalAlpha = a * cu * yu; g.translate(0, (1 - e3(yu)) * 50); g.setLineDash([14, 10]); g.lineWidth = 6; g.strokeStyle = INK; g.strokeRect(528, 580, 390, 560); g.setLineDash([]); g.restore();
      g.save(); g.globalAlpha = a * cu * yu; mask(723, 850, 330, 'rgba(0,0,0,0)', 1); g.globalAlpha = a * cu * yu * .85; g.fillStyle = PAPER; g.fillRect(0, 0, 0, 0); g.restore(); mask(723, 850, 330, '#bdb29c', a * cu * yu); txt('YOU', 723, 650, '400 40px BG', INK, a * cu * yu, 'center'); txt('?', 723, 880, '400 120px BG', INK, a * cu * yu * .6, 'center');
      var nu = seg(t, C.you + .35, C.you + .6); if (nu > 0) { g.save(); g.globalAlpha = a * cu * nu; g.translate(723, 1060); g.rotate(-.06); g.fillStyle = PK; g.fillRect(-150, -34, 300, 68); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(-150, -34, 300, 68); g.fillStyle = PAPER; g.font = '400 30px BG'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('NO LAWYER', 0, 3); g.restore() } }
    // the clone stage: the ORIGINAL waveform is the avatar's own real loudness envelope; each clone is a copy with a different offset and wobble
    var wu = seg(t, C.cloned - .1, C.cloned + .3) * (1 - seg(t, C.before + .1, C.before + .5));
    if (wu > 0) { var tc = t - .2; g.save(); g.globalAlpha = a * wu; g.fillStyle = 'rgba(0,184,173,.12)'; g.fillRect(110, 560, 808, 150); g.strokeStyle = TQ; g.lineWidth = 6; g.strokeRect(110, 560, 808, 150); g.restore();
      wave(130, 898, 635, 120, tc, 0, TQ, a * wu, 5, 'orig'); tag('ORIGINAL · THE REAL VOICE ENVELOPE', TQ, 110, 520, a * wu, INK);
      g.save(); g.globalAlpha = a * wu; g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(514, 548); g.lineTo(514, 722); g.stroke(); g.restore();
      for (var q = 0; q < 6; q++) { var qb = C.cloned + .25 + q * .28, qu = seg(t, qb, qb + .25); if (qu <= 0) continue; var yy = 790 + q * 74; g.save(); g.globalAlpha = a * wu * qu; g.fillStyle = 'rgba(255,45,120,.10)'; g.fillRect(110 + (1 - qu) * 80, yy - 30, 808, 60); g.restore();
        wave(130 + (1 - qu) * 80, 898, yy, 76, tc, (q + 1) * .11, PK, a * wu * qu, 5, 'clone'); }
      tag('CLONES · ILLUSTRATION · SAME VOICE, SLIGHTLY OFF', PK, 110, 1244 - 120, a * wu * seg(t, C.cloned + .6, C.cloned + .9), PAPER);
      var sq = seg(t, C.seconds - .1, C.seconds + .25); if (sq > 0) { g.save(); g.globalAlpha = a * wu * sq; g.translate(730, 1230 - 160); g.rotate(.05); g.fillStyle = SF; g.fillRect(-190, -30, 380, 60); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(-190, -30, 380, 60); g.fillStyle = INK; g.font = '400 24px SE'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('FROM A FEW SECONDS OF AUDIO', 0, 2); g.restore() } }
    // the voice note: a message bubble with a play button + the real waveform; a pink clone slides out from behind; SEND? pulses
    var vu = seg(t, C.before + .2, C.before + .6); if (vu > 0) { var by = 640 + (1 - e3(vu)) * 90; g.save(); g.globalAlpha = a * vu;
      var cu2 = seg(t, C.note, C.note + .4); if (cu2 > 0) { g.save(); g.globalAlpha = a * vu * cu2; g.translate(40 * cu2, 80 * cu2); g.fillStyle = PK; rr(150, by, 780, 150, 40); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore(); tag('A CLONE OF IT · ILLUSTRATION', PK, 190, by + 235, a * vu * cu2, PAPER) }
      g.fillStyle = TQ; rr(150, by, 780, 150, 40); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(240, by + 75, 40, 0, 7); g.fill(); g.fillStyle = PAPER; g.beginPath(); g.moveTo(228, by + 52); g.lineTo(228, by + 98); g.lineTo(264, by + 75); g.closePath(); g.fill(); g.restore();
      wave(300, 880, by + 75, 90, (t - C.before) * .6, 0, INK, a * vu, 5, 'orig');
      var tu = seg(t, C.twice - .1, C.twice + .3); if (tu > 0) { var pulse = 1 + .06 * Math.sin((t - C.twice) * 14); g.save(); g.globalAlpha = a * tu; g.translate(540, 1130); g.scale(pulse, pulse); g.rotate(-.04); g.fillStyle = SF; g.fillRect(-170, -48, 340, 96); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(-170, -48, 340, 96); g.fillStyle = INK; g.font = '400 52px BG'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SEND?', 0, 4); g.restore() } } });
  ev(S[7], 'whoosh'); ev(C.lawyer, 'pop'); ev(C.you, 'tick'); ev(C.cloned, 'riser'); ev(C.before + .2, 'pop'); ev(C.note, 'whoosh'); ev(C.twice, 'stamp');

  // 8 CTA --------------------------------------------------------------------------------------------------------------------------------------
  var h8 = mk('FOLLOW FOR THE NEXT ONE', 'ASK <em class="k">BEFORE</em> YOU SHARE YOUR VOICE');
  SC.push(function (t, a) { var l = t - S[8], e = seg(t, S[8] + .1, S[8] + .45); $('end').style.opacity = e; $('end').style.transform = 'scale(' + lerp(.9, 1, e3(e)) + ') rotate(' + lerp(2, 0, e3(e)) + 'deg)';
    mask(540, 640, 300, TQ, a * seg(l, 0, .3)); var b = (t - S[8]) % 2; if (b < .5) stamp('FOLLOW', 780 + Math.sin(Math.floor((t - S[8]) / 2) * 2.1) * 40, 1160, 300, 90, PK, -.12 + .05 * Math.floor((t - S[8]) / 2) % 2, seg(b, 0, .16), a) });
  ev(S[8], 'chime');
  for (var i2 = 1; i2 < S.length; i2++) ev(S[i2] - .1, 'swish');

  // ---- ticker, captions, host, seek ---------------------------------------------------------------------------------------------------------------
  var TK = $('tk'), TKS = ' ·  INTERIM ORDER  ·  BOMBAY HIGH COURT  ·  1 OCT 2026  ·  PERSONALITY RIGHTS  ·  NAME  ·  IMAGE  ·  VOICE  ·  REPORTED, NOT FINAL ';
  TK.textContent = TKS + TKS + TKS + TKS + TKS + TKS; var tkw = 0; function tkMeasure() { var m = document.createElement('span'); m.style.cssText = 'position:absolute;left:0;top:-99px;white-space:nowrap;font:400 21px/46px SE;letter-spacing:.06em'; m.textContent = TKS; document.body.appendChild(m); tkw = m.getBoundingClientRect().width; document.body.removeChild(m) }
  function cap(t) { var CP = TM.CAP, k = -1; for (var i = 0; i < CP.length; i++) if (t >= CP[i][0] - .05) k = i; var c = $('cap'); if (k < 0) { c.style.opacity = 0; return }
    var ws = CP[k][2], h = ''; ws.forEach(function (w, j) { var on = t >= w[1] && (j === ws.length - 1 || t < ws[j + 1][1]); h += (j ? ' ' : '') + (on ? '<b>' + w[0] + '</b>' : w[0]) }); c.innerHTML = h; c.style.opacity = 1 }
  var vid = $('hostv'), avc = $('avc'), hx = avc.getContext('2d'), lastF = -1;
  function hostSeek(t) { if (!vid.duration) return Promise.resolve(); var fr = Math.floor(t * 24); if (fr === lastF) return Promise.resolve(); lastF = fr; var ft = Math.min((fr + .5) / 24, vid.duration - .02);
    return new Promise(function (res) { var dn = function () { vid.removeEventListener('seeked', dn); hx.clearRect(0, 0, 544, 544); hx.drawImage(vid, 0, 0, 544, 544); res() }; vid.addEventListener('seeked', dn); vid.currentTime = ft }) }
  function nearestCut(t) { var b = 1e9; for (var i = 1; i < S.length; i++) if (Math.abs(t - S[i]) < Math.abs(t - b)) b = S[i]; return b }
  window.EV = EV.sort(function (a, b) { return a[0] - b[0] });
  window.__reelDurationSec = END;
  window.__seek = function (t) {
    t = Math.max(0, Math.min(END - 1e-3, t)); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); bg(t);
    if (!tkw) tkMeasure(); TK.style.transform = 'translateX(' + (-(t * 90) % tkw) + 'px)';
    SC.forEach(function (fn, si) { var s0 = S[si], s1 = si + 1 < S.length ? S[si + 1] : END, op = 0, sc = 1;
      if (t >= s0 && t < s1) { op = Math.min(si === 0 ? 1 : seg(t, s0, s0 + .18), si < S.length - 1 ? 1 - seg(t, s1 - .2, s1) : 1); sc = (si === 0 ? 1 : lerp(.95, 1, e3(seg(t, s0, s0 + .18)))) * lerp(1, 1.05, seg(t, s1 - .2, s1)) }
      DOMS[si].style.opacity = op; DOMS[si].style.transform = 'scale(' + sc + ')';
      if (op > 0) { g.save(); g.translate(540, 860); g.scale(sc, sc); g.translate(-540, -860); fn(t, op); g.restore() } });
    // ambient: a paparazzi flash corner star every 1.8 s keeps the stage alive without cutting any hero
    var fp = (t % 1.8) / 1.8; if (fp < .12) { var fa = 1 - fp / .12, fx = ih(Math.floor(t / 1.8), 3) < .5 ? 960 : 120, fy = 330 + ih(Math.floor(t / 1.8), 4) * 700; g.save(); g.globalAlpha = fa * .85; g.translate(fx, fy); g.fillStyle = PAPER; g.strokeStyle = PK; g.lineWidth = 3; g.beginPath(); for (var p = 0; p < 8; p++) { var an = p * Math.PI / 4, rr0 = p % 2 ? 22 : 62 * (.6 + .4 * fa); g.lineTo(Math.cos(an) * rr0, Math.sin(an) * rr0) } g.closePath(); g.fill(); g.stroke(); g.restore() }
    var gl = 1 - seg(Math.abs(t - nearestCut(t)), 0, .07); if (gl > 0) { g.save(); g.globalAlpha = gl * .22; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.restore() }
    cap(t); return hostSeek(t) };
  window.__ready = false;
  var waits = ['400 68px BG', '400 22px SE', '700 30px Inter', '400 40px AN'].map(function (x) { return document.fonts.load(x) })
    .concat(GAV.map(function (im) { return new Promise(function (r) { if (im.complete) r(); else { im.onload = r; im.onerror = r } }) }))
    .concat([new Promise(function (r) { if (vid.readyState >= 2) r(); vid.addEventListener('loadeddata', r); vid.addEventListener('error', r); setTimeout(r, 3000) })]);
  Promise.all(waits).catch(function () {}).then(function () { return window.__seek(0) }).then(function () { window.__ready = true });
})();
