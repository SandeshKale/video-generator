// Claude in Sheets ("Cell Shock"). Mockup: scenes 1 (hook), 2 (Blender board), 5 (step 3) back to back.
// window.__seek(t) is a pure function of t; nothing here runs on the browser clock.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var cl = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var u = function (t, t0, d) { return cl((t - t0) / d, 0, 1); };
  var eo = function (x) { x = cl(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { x = cl(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var bk = function (x, s) { x = cl(x, 0, 1); s = s || 1.7; x -= 1; return x * x * ((s + 1) * x + s) + 1; };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var hash = function (a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  var MK = window.MK, IC = window.IC, st = $('stage');

  // ---------- timeline (mockup: estimates; the full build retimes from the voice) ----------
  var SC = [0, 2.65, 6.25], TOTAL = 12.4, CUT = .36;
  var LINES = [ // [start, end, text] spoken lines for captions
    [0.0, 2.08, 'Claude just moved into your Google Sheets.'],
    [2.7, 6.28, 'Messy data in. Clean table, pivot, and a chart out.'],
    [6.35, 11.95, 'Step three. Ask it like a colleague: clean this up, total sales by month, and chart it.']];
  window.SC = SC; window.TOTAL = TOTAL; window.__reelDurationSec = TOTAL;

  // ---------- scene 1: the messy sheet cleans itself and becomes a chart ----------
  var ROWS = [ // messy -> clean, flags = which columns are messy
    ['03/01/26', '03 Jan', 'Store A', 'Store A', '₹1,200', '1200', [1, 0, 1]],
    ['Jan 9', '09 Jan', 'store b', 'Store B', '650', '650', [1, 1, 0]],
    ['2026-02-02', '02 Feb', 'Store A', 'Store A', '₹ 950', '950', [1, 0, 1]],
    ['Feb 14', '14 Feb', 'Store B ', 'Store B', '1,430', '1430', [1, 0, 1]],
    ['Feb 14', '', 'Store B ', '', '1,430', '', [0, 0, 0], 'dup'],
    ['3/3', '03 Mar', 'STORE A', 'Store A', '₹2,100', '2100', [1, 1, 1]],
    ['Mar 21', '21 Mar', 'Store B', 'Store B', '1875.0', '1875', [0, 0, 1]]];
  var TOT = [['JAN', '1,850', 1850, 1], ['FEB', '2,380', 2380, 3], ['MAR', '3,975', 3975, 6]]; // label, text, value, sheet row index
  var W = [48, 200, 180, 170, 170], X0 = 150, Y0 = 400; // sheet columns: #, Date, Store, Amount, Total
  function cell(w, cls, inner) { return '<div class="c ' + (cls || '') + '" style="width:' + w + 'px">' + (inner || '') + '</div>'; }
  var s1 = '<div class="abs" style="left:150px;top:176px;width:768px"><div class="h1">CLAUDE IN<br><span class="hl">YOUR SHEET</span></div></div>' +
    '<div class="abs sheet" id="sh" style="left:' + X0 + 'px;top:' + Y0 + 'px;width:768px">' +
    '<div class="fx"><b>fx</b><span id="fxt"></span></div>' +
    '<div class="row hd">' + cell(W[0], 'n', '') + cell(W[1], '', 'A · DATE') + cell(W[2], '', 'B · STORE') + cell(W[3], '', 'C · AMOUNT') + cell(W[4], '', 'D · TOTAL') + '</div>';
  ROWS.forEach(function (r, i) {
    s1 += '<div class="row" id="r' + i + '">' + cell(W[0], 'n', String(i + 2)) +
      [0, 1, 2].map(function (k) { return cell(W[k + 1], k === 2 ? 'num' : '', '<div class="bad" id="b' + i + k + '"></div><span id="v' + i + k + '"></span>'); }).join('') +
      cell(W[4], 'num', '<span id="d' + i + '"></span>') + '</div>';
  });
  s1 += '<div class="tabs"><div class="tab on">Sheet1</div><div class="tab new" id="ptab">Pivot ✓</div></div>' +
    '<div class="sel" id="sel1"></div></div>' +
    '<div class="abs tag" id="ill1" style="left:740px;top:356px">ILLUSTRATIVE</div>' +
    '<div class="abs pane" id="pane" style="left:150px;top:1004px;width:768px">' +
    '<div class="who">' + MK.claude + 'Claude<span class="mode">ASK BEFORE EDITS</span></div>' +
    '<div class="bub">clean this up, total by month, chart it</div>' +
    '<div class="card"><div class="t"><b>6 changes</b><br>4 dates · 3 amounts · 1 duplicate</div><div class="btn" id="apv">Approve</div></div></div>' +
    '<div class="abs" id="pill" style="left:150px;top:1004px"><div class="pill">' + IC.check.replace('<svg', '<svg width="24" height="24"') + '6 CHANGES APPLIED</div></div>' +
    '<div class="abs" id="chart" style="left:150px;top:1070px;width:768px;height:190px;border-bottom:4px solid var(--head)"></div>' +
    '<div class="abs ring" id="ring1"></div><div class="abs cursor" id="cur1">' + IC.cursor + '</div>';
  var sc1 = mk('s1', s1);
  var chart = $('chart'), BX = [80, 300, 520], BW = 170, BMAX = 150;
  TOT.forEach(function (d, k) { chart.insertAdjacentHTML('beforeend', '<div class="bar" id="bar' + k + '" style="left:' + BX[k] + 'px;width:' + BW + 'px"><i>' + d[0] + '</i></div>'); });
  TOT.forEach(function (d, k) { sc1.insertAdjacentHTML('beforeend', '<div class="tot" id="tot' + k + '">₹' + d[1] + '</div>'); });
  // row geometry (top of each row in stage px) for the clean layout with the duplicate collapsed
  var FXH = 58, HDH = 52, RH = 56;

  function render1(t) {
    var clean0 = .95; // ripple start
    var ap = u(t, .62, .16); // approve tap
    // cells: messy text until the ripple passes, then clean text
    ROWS.forEach(function (r, i) {
      var row = $('r' + i);
      if (r[7] === 'dup') { var q = eio(u(t, clean0 + .25, .35)); row.style.height = (RH * (1 - q)) + 'px'; row.style.opacity = 1 - q; row.style.background = q > 0 ? 'rgba(255,82,51,' + (.25 * (1 - q)) + ')' : ''; }
      for (var k = 0; k < 3; k++) {
        var dly = clean0 + (i + k) * .045, c = u(t, dly, .14);
        var v = $('v' + i + k), b = $('b' + i + k), m = r[k * 2], cv = r[k * 2 + 1];
        v.textContent = (c < .5 || r[7] === 'dup') ? m : cv;
        v.style.opacity = r[7] === 'dup' ? 1 : (c < .5 ? 1 - c * 2 : (c - .5) * 2);
        b.style.opacity = r[6][k] ? (1 - c) : 0;
        v.style.color = r[6][k] && c < .5 ? 'var(--tom)' : '';
      }
      // highlighter sweep riding the ripple
      var sw = u(t, clean0 + i * .045, .3);
      row.style.boxShadow = sw > 0 && sw < 1 ? 'inset 0 0 0 999px rgba(255,195,26,' + (.35 * Math.sin(sw * Math.PI)) + ')' : 'none';
    });
    // totals column D appear at 1.35 s on the last row of each month
    var d0 = 1.35;
    ROWS.forEach(function (r, i) { $('d' + i).textContent = ''; });
    TOT.forEach(function (d, k) { var e = u(t, d0 + k * .1, .15), sp = $('d' + d[3]); if (e > 0) { sp.textContent = d[1]; sp.style.opacity = e; sp.style.color = 'var(--ink)'; sp.parentNode.style.background = 'rgba(255,195,26,' + (.55 * e) + ')'; } else sp.parentNode.style.background = ''; });
    // fx bar types the Jan formula while D3 is selected
    var fx = '=SUM(C2:C3)', fe = u(t, 1.3, .35);
    $('fxt').textContent = t < 1.3 ? '' : fx.slice(0, Math.round(fx.length * fe));
    var sel = $('sel1'), selE = u(t, 1.3, .12) * (1 - u(t, 2.0, .1));
    var ry = function (i) { var y = FXH + HDH; for (var j = 0; j < i; j++) y += parseFloat($('r' + j).style.height || RH); return y; };
    sel.style.left = (W[0] + W[1] + W[2] + W[3] - 3) + 'px'; sel.style.width = (W[4] + 4) + 'px';
    sel.style.top = (ry(1) - 2) + 'px'; sel.style.height = (RH + 2) + 'px'; sel.style.opacity = selE;
    // row numbers close up once the duplicate row has folded away
    var gone = u(t, clean0 + .25, .35) >= 1, rn = 2;
    ROWS.forEach(function (r, i) { if (gone && r[7] === 'dup') return; $('r' + i).firstChild.textContent = String(rn++); });
    // pane: cursor approves, then the pane gives way to the chart
    var c = $('cur1'), cp = eio(u(t, .05, .55)), out = eio(u(t, 1.0, .4));
    c.style.left = lerp(850, 790, cp) + lerp(0, 160, out) + 'px'; c.style.top = lerp(1280, 1196, cp) + lerp(0, 120, out) + 'px';
    c.style.opacity = 1 - out; c.style.transform = 'scale(' + (1 - .12 * Math.sin(ap * Math.PI)) + ')';
    var ring = $('ring1'), rr = u(t, .68, .35); ring.style.left = (812 - 40 * rr) + 'px'; ring.style.top = (1216 - 40 * rr) + 'px';
    ring.style.width = ring.style.height = (80 * rr) + 'px'; ring.style.opacity = rr > 0 ? 1 - rr : 0;
    $('apv').style.transform = 'scale(' + (1 - .08 * Math.sin(ap * Math.PI)) + ')';
    var pg = eio(u(t, .95, .3)); $('pane').style.opacity = 1 - pg; $('pane').style.transform = 'translateY(' + (30 * pg) + 'px) scale(' + (1 - .05 * pg) + ')';
    var pl = $('pill'); pl.style.opacity = eo(u(t, 1.05, .2)); pl.style.transform = 'translateY(' + (-12 * (1 - eo(u(t, 1.05, .2)))) + 'px)';
    // chart: baseline draws, total cells fly from column D to the bar tops, bars grow under them
    chart.style.opacity = eo(u(t, 1.2, .25)); chart.style.clipPath = 'inset(-400px ' + (100 - 100 * eo(u(t, 1.2, .35))) + '% -10px 0)';
    TOT.forEach(function (d, k) {
      var fly = eio(u(t, 1.95 + k * .08, .45)), grow = bk(u(t, 2.05 + k * .08, .45), 1.4);
      var h = BMAX * d[2] / 3975 * grow, bar = $('bar' + k); bar.style.height = h + 'px';
      var src = { x: X0 + W[0] + W[1] + W[2] + W[3] + 6, y: Y0 + ry(d[3]) + 4, w: W[4] - 12 };
      var dst = { x: 150 + BX[k], y: 1070 + 190 - h - 52, w: BW };
      var tc = $('tot' + k), vis = u(t, d0 + k * .1, .15);
      tc.style.left = lerp(src.x, dst.x, fly) + 'px'; tc.style.top = lerp(src.y, dst.y, fly) + 'px'; tc.style.width = lerp(src.w, dst.w, fly) + 'px';
      tc.style.opacity = fly > 0 ? 1 : 0; tc.style.transform = 'rotate(' + (-6 * Math.sin(fly * Math.PI)) + 'deg)';
      $('d' + d[3]).style.opacity = fly > 0 ? .25 : vis;
    });
    var pt = $('ptab'), pe = bk(u(t, 2.15, .3), 2); pt.style.transform = 'translateY(' + (-40 * (1 - pe)) + 'px)'; pt.style.opacity = u(t, 2.15, .05);
  }

  // ---------- scene 2: Blender spreadsheet board ----------
  var s2 = '<div class="abs" style="left:150px;top:176px;width:768px"><div class="eyebrow">// RAW ROWS TO A REAL CHART</div>' +
    '<div class="h1" style="margin-top:14px">MESSY IN →<br><span class="hl">CHART OUT</span></div></div>' +
    '<canvas id="board" width="847" height="630" class="abs" style="left:150px;top:512px;width:768px;height:571px"></canvas>' +
    '<div class="abs stamp" id="st0" style="left:150px;top:1118px">CLEAN TABLE</div>' +
    '<div class="abs stamp" id="st1" style="left:488px;top:1118px">PIVOT</div>' +
    '<div class="abs stamp" id="st2" style="left:704px;top:1118px">CHART</div>' +
    '<div class="abs track" id="trk2" style="left:150px;top:440px"><div>1 · INSTALL</div><div>2 · OPEN</div><div>3 · ASK</div></div>';
  mk('s2', s2);
  var BOARD = [], NB = 30;
  for (var i = 0; i < NB; i++) { var im = new Image(); im.src = '3d/board/b' + (i < 10 ? '0' : '') + i + '.png'; BOARD.push(im); }
  function render2(t) { // t = local scene time
    var p = cl(t / 3.5, 0, 1), f = p * (NB - 1), a = Math.floor(f), b = Math.min(NB - 1, a + 1), k = f - a;
    var cv = $('board'), x = cv.getContext('2d'); x.clearRect(0, 0, 847, 630);
    x.globalAlpha = 1; x.drawImage(BOARD[a], 0, 0); x.globalAlpha = k; x.drawImage(BOARD[b], 0, 0); x.globalAlpha = 1;
    [[.95, -4], [1.55, 3], [2.15, -3]].forEach(function (s, j) {
      var e = bk(u(t, s[0], .3), 2.2), el = $('st' + j);
      el.style.opacity = u(t, s[0], .06); el.style.transform = 'rotate(' + s[1] + 'deg) scale(' + lerp(1.8, 1, e) + ')';
    });
    var tr = $('trk2'), te = bk(u(t, 3.0, .35), 1.6); tr.style.opacity = u(t, 3.0, .08); tr.style.transform = 'translateY(' + (-30 * (1 - te)) + 'px)';
  }

  // ---------- scene 5: step 3, a colleague at a desk asks the laptop (humaaans + naive-icons + rough.js) ----------
  var PROMPT = [['Clean this up', 2.35], [', ', 0], ['total sales by month', 3.3], [', and ', 0], ['chart it', 4.45], ['.', 0]];
  var s5 = '<div class="abs track" style="left:150px;top:150px;transform:scale(.8);transform-origin:0 0"><div class="done">1 · INSTALL</div><div class="done">2 · OPEN</div><div class="on">3 · ASK</div></div>' +
    '<div class="abs" style="left:150px;top:222px;width:768px"><div class="eyebrow">// STEP 3 · ONE PROMPT, THREE JOBS</div>' +
    '<div class="h1" style="margin-top:14px;font-size:84px">ASK LIKE A<br><span class="hl">COLLEAGUE</span></div></div>' +
    '<div class="abs speech" id="chat5" style="left:150px;top:448px;width:768px"><div class="lb">YOU → CLAUDE</div><div class="tx" id="ptx"></div>' +
    '<svg class="abs" id="ul5" width="768" height="260" style="left:0;top:0;overflow:visible"></svg><div class="tail"></div></div>' +
    '<div class="abs desk" style="left:150px;top:1082px;width:560px;height:24px"></div>' +
    '<div class="abs leg" style="left:186px;top:1106px;height:200px"></div><div class="abs leg" style="left:656px;top:1106px;height:200px"></div>' +
    '<div class="abs laptop" id="lap" style="left:186px;top:790px;width:420px;height:262px"><div class="scr">' +
    '<div class="mini" id="mini"></div><div class="lpane"><div class="lph">' + MK.claude + 'Claude</div><div id="res5"></div></div></div>' +
    '<div class="abs tag" style="right:10px;top:-34px;font-size:14px">RESULTS ILLUSTRATIVE</div></div>' +
    '<div class="abs lapbase" style="left:160px;top:1052px;width:472px;height:30px"></div>' +
    '<img class="abs" src="naive/coffee.svg" style="left:628px;top:1010px;width:76px;height:76px">' +
    '<img class="abs" id="col5" src="colleague.svg" style="left:584px;top:874px;width:334px;height:422px">';
  mk('s5', s5);
  (function () { // mini sheet on the laptop: 6x5 cells, a few flagged; a 3-bar chart appears at the end
    var h = ''; for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) h += '<i id="m' + r + c + '" style="left:' + (c * 56) + 'px;top:' + (r * 30) + 'px"></i>';
    h += '<b id="mb0" style="left:16px"></b><b id="mb1" style="left:80px"></b><b id="mb2" style="left:144px"></b>';
    $('mini').innerHTML = h;
  })();
  var CH = [['CLEANED 214 ROWS', 3.05], ['12 MONTHS SUMMED', 4.15], ['CHART ADDED', 5.0]];
  CH.forEach(function (c, k) { $('res5').insertAdjacentHTML('beforeend', '<div class="rline" id="ch' + k + '">' + IC.check + c[0] + '</div>'); });
  var RG = window.rough ? rough.svg($('ul5')) : null, ULC = {};
  function underline(key, x1, y1, x2, k) { // a sunflower marker stroke drawn by rough.js (fixed seed), revealed by k in 0..1
    var id = key + '|' + Math.round(x2 - x1);
    if (!ULC[id]) { var g = RG.line(x1, y1, x2, y1 + 3, { seed: 11 + key.length * 7, stroke: '#ffc31a', strokeWidth: 9, roughness: 1.4, bowing: 1.5 });
      g.setAttribute('data-k', id); ULC[id] = g; }
    var g = ULC[id]; $('ul5').appendChild(g);
    [].forEach.call(g.querySelectorAll('path'), function (pth) { var L = pth.getTotalLength(); pth.style.strokeDasharray = L; pth.style.strokeDashoffset = L * (1 - k); pth.style.strokeLinecap = 'round'; });
  }
  function render5(t) {
    var ce = bk(u(t, .2, .4), 1.5); $('chat5').style.opacity = u(t, .2, .08); $('chat5').style.transform = 'translateY(' + (40 * (1 - ce)) + 'px) scale(' + lerp(.92, 1, ce) + ')';
    var le = eo(u(t, 0, .45)); $('lap').style.transform = 'translateY(' + (50 * (1 - le)) + 'px)'; $('lap').style.opacity = le;
    var pe = bk(u(t, .1, .5), 1.4), col = $('col5');
    col.style.transformOrigin = '45% 100%'; col.style.transform = 'translateX(' + (180 * (1 - pe)) + 'px) rotate(' + (1.6 * Math.sin(t * 2.4)) + 'deg)';
    // type the prompt (done by 2.2 s so it can be read and screenshotted)
    var full = PROMPT.map(function (p) { return p[0]; }).join(''), n = Math.round(full.length * u(t, .45, 1.7)), html = '', used = 0;
    PROMPT.forEach(function (p, i) { var s = p[0].slice(0, Math.max(0, n - used)); used += p[0].length; if (s) html += p[1] ? '<span class="cl" id="cl' + i + '">' + s + '</span>' : s; });
    $('ptx').innerHTML = html + (n < full.length || Math.floor(t * 2.5) % 2 ? '<span style="color:var(--vio)">|</span>' : '');
    // rough.js marker underlines, one per clause (per wrapped line), drawn on each clause's spoken word
    var ul = $('ul5'); while (ul.firstChild) ul.removeChild(ul.firstChild);
    if (RG) { var box = $('chat5').getBoundingClientRect(), sc = box.width / 768;
      PROMPT.forEach(function (p, i) { if (!p[1]) return; var el = $('cl' + i); if (!el) return; var k = eo(u(t, p[1], .4)); if (k <= 0) return;
        [].forEach.call(el.getClientRects(), function (r, j) { underline('c' + i + '_' + j, (r.left - box.left) / sc, (r.bottom - box.top) / sc - 6, (r.right - box.left) / sc, k); }); }); }
    // the laptop: messy cells clean up on "clean", totals on "month", bars on "chart"
    for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) { var bad = hash(r, c) > .62, cl0 = u(t, 2.35 + (r + c) * .04, .12), m = $('m' + r + c);
      m.style.background = bad && cl0 < .5 ? '#ffd9cf' : (c === 3 && r % 2 === 1 && t > 3.3 + r * .05 ? '#ffe7a3' : '#fff'); m.style.borderColor = bad && cl0 < .5 ? '#ff5233' : '#d5e3db'; }
    [0, 1, 2].forEach(function (k) { var e = bk(u(t, 4.5 + k * .1, .35), 1.6); $('mb' + k).style.height = (e * [34, 46, 70][k]) + 'px'; });
    CH.forEach(function (c, k) { var e = bk(u(t, c[1], .3), 2), el = $('ch' + k); el.style.opacity = u(t, c[1], .06); el.style.transform = 'translateX(' + (30 * (1 - e)) + 'px)'; });
  }

  // ---------- shared: background cell flashes, captions, grid-snap cuts ----------
  function mk(id, html) {
    var d = document.createElement('div'); d.className = 'scene'; d.id = id; d.innerHTML = html; st.appendChild(d);
    for (var k = 0; k < 7; k++) d.insertAdjacentHTML('afterbegin', '<div class="fl" id="' + id + 'f' + k + '"></div>');
    return d;
  }
  var SCN = [['s1', render1], ['s2', render2], ['s5', render5]];
  function flashes(id, t, si) { // a few background cells blink sunflower as if being computed (deterministic per cell slot and time)
    for (var k = 0; k < 7; k++) {
      var slot = Math.floor(t * .9 + k * .37), ph = t * .9 + k * .37 - slot, cx = Math.floor(hash(slot + si * 13, k) * 6), cy = Math.floor(hash(k, slot + si * 7) * 11);
      var f = $(id + 'f' + k); f.style.left = (cx * 180 - 30 + 2) + 'px'; f.style.top = (cy * 180 - 20 + 2) + 'px'; f.style.opacity = .07 * Math.sin(ph * Math.PI);
    }
  }
  st.insertAdjacentHTML('beforeend', '<div id="cap"><div id="capd"></div></div>');
  function caption(t) {
    var L = null; LINES.forEach(function (l) { if (t >= l[0] - .05 && t <= l[1] + .25) L = l; });
    var cap = $('cap'); if (!L) { cap.style.opacity = 0; return; } cap.style.opacity = 1;
    var ws = L[2].split(' '), n = ws.length, html = '';
    // mockup: words spread evenly over the line; the build uses Whisper word times. Show at most ~7 words around the current one.
    var cur = cl(Math.floor((t - L[0]) / (L[1] - L[0]) * n), 0, n - 1), a = Math.max(0, Math.min(cur - 2, n - 7)), b = Math.min(n, a + 7);
    for (var i = a; i < b; i++) html += '<span class="' + (i === cur ? 'on' : i < cur ? 'past' : '') + '">' + ws[i] + '</span> ';
    $('capd').innerHTML = html;
  }
  // grid-snap cut: violet cell tiles grow over the old scene in a diagonal wave, then shrink away from the new one.
  // Only one scene is visible at any moment (no interleaved text); drawn on one canvas (no masks, no SVG repaint).
  var cutc = $('cutc'), cx = cutc.getContext('2d');
  function cutDraw(p) { // p: 0..1 across the cut
    cx.clearRect(0, 0, 1080, 1920); if (p <= 0 || p >= 1) return;
    var cols = 6, rows = 10, w = 180, h = 192, half = p < .5, ph = half ? p * 2 : (p - .5) * 2;
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
      var d = (i + j) / (cols + rows - 2), q = cl((ph - d * .5) / .5, 0, 1), s = half ? eio(q) : 1 - eio(q);
      if (s <= .002) continue;
      var hh = (h - 8) * s, y = j * h + 4 + (h - 8 - hh) / 2;
      cx.fillStyle = (i + j) % 3 === 0 ? '#ffc31a' : '#23142d'; cx.fillRect(i * w + 4, y, w - 8, hh);
      if (s > .6) { cx.fillStyle = 'rgba(246,241,255,' + (s - .6) * 2 + ')'; cx.fillRect(i * w + 4, y + hh - 10, w - 8, 10); }
    }
  }

  window.__seek = function (t) {
    var cp = -1;
    SCN.forEach(function (s, i) {
      var el = $(s[0]), a = SC[i], b = i + 1 < SC.length ? SC[i + 1] : TOTAL + 1;
      var on = t >= a && t < b; // the incoming scene takes over at the cut's midpoint (SC[i])
      if (Math.abs(t - a) < CUT / 2 && i > 0) cp = (t - (a - CUT / 2)) / CUT;
      el.style.display = on ? 'block' : 'none'; if (!on) return;
      flashes(s[0], t, i); s[1](t - a);
    });
    cutDraw(cp); caption(t);
  };
  window.__ready = false;
  var FACES = ['700 20px Rubik', '800 20px Rubik', '500 20px Azeret', '700 20px Azeret', '500 20px Inter', '600 20px Inter', '700 20px Inter'];
  // load every face up front: text first set inside __seek would otherwise request its font late and stay invisible (font-display: block) on frame 0
  Promise.all([document.fonts.ready].concat(FACES.map(function (f) { return document.fonts.load(f); }), BOARD.map(function (im) { return im.decode().catch(function () {}); }))).then(function () { window.__seek(0); window.__ready = true; });
})();
