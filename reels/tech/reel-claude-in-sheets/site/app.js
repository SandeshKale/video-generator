// "Claude just moved into your Google Sheets." ("Cell Shock", violet ground). 10 scenes, one voice line each.
// window.__seek(t) is a pure function of t; nothing here runs on the browser clock. Times come from timing.js
// (SC scene starts, WD word times, PG caption pages, TOTAL), written by ../timing.py from the finished voice lines.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var cl = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var u = function (t, t0, d) { return cl((t - t0) / d, 0, 1); };
  var eo = function (x) { x = cl(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { x = cl(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var bk = function (x, s) { x = cl(x, 0, 1); s = s || 1.7; x -= 1; return x * x * ((s + 1) * x + s) + 1; };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var hash = function (a, b) { var s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  var pw = function (t, K) { // piecewise-linear keyframes [[t, v], ...]
    if (t <= K[0][0]) return K[0][1];
    for (var i = 1; i < K.length; i++) if (t <= K[i][0]) return lerp(K[i - 1][1], K[i][1], (t - K[i - 1][0]) / Math.max(1e-6, K[i][0] - K[i - 1][0]));
    return K[K.length - 1][1];
  };
  var MK = window.MK, IC = window.IC, st = $('stage');
  var SC = window.SC, WD = window.WD, PG = window.PG, TOTAL = window.TOTAL, CUT = .36;
  window.__reelDurationSec = TOTAL;
  var DUR = SC.map(function (s, i) { return (i + 1 < SC.length ? SC[i + 1] : TOTAL) - s; });
  // word time (absolute) of the n-th word with key k in line p (1-based); L(i, k, n) = same, local to scene i (0-based)
  function W(p, k, n) { var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } console.warn('no word', p, k, n); return SC[p - 1] + .3; }
  function L(i, k, n) { return W(i + 1, k, n) - SC[i]; }
  function ico(svg, px) { return svg.replace('<svg', '<svg width="' + px + '" height="' + px + '"'); }
  function head(eb, a, b, fs) {
    return '<div class="abs" style="left:150px;top:214px;width:768px"><div class="eyebrow">' + eb + '</div><div class="h1" style="margin-top:12px' + (fs ? ';font-size:' + fs + 'px' : '') + '">' + a + '<br><span class="hl">' + b + '</span></div></div>';
  }
  function enter(el, e, dy, s0) { el.style.opacity = cl(e * 4, 0, 1); el.style.transform = 'translateY(' + ((dy || 40) * (1 - e)) + 'px) scale(' + lerp(s0 || 1, 1, e) + ')'; }
  // rough.js strokes (fixed seeds) revealed by k in 0..1 via stroke-dashoffset; cached per key so every seek draws the same shape
  var RC = {};
  function rstroke(svgEl, key, make, k) {
    if (!window.rough) return;
    var g = RC[key]; if (!g) { g = make(rough.svg(svgEl)); g.setAttribute('data-k', key); RC[key] = g; }
    if (g.parentNode !== svgEl) svgEl.appendChild(g);
    g.style.display = k > 0 ? '' : 'none';
    [].forEach.call(g.querySelectorAll('path'), function (p) { var Ln = p.getTotalLength(); p.style.strokeDasharray = Ln; p.style.strokeDashoffset = Ln * (1 - cl(k, 0, 1)); p.style.strokeLinecap = 'round'; });
  }
  function mk(id, html) {
    var d = document.createElement('div'); d.className = 'scene'; d.id = id; d.innerHTML = html; st.appendChild(d);
    for (var k = 0; k < 7; k++) d.insertAdjacentHTML('afterbegin', '<div class="fl" id="' + id + 'f' + k + '"></div>');
    return d;
  }

  // ================= scene 1: the messy sheet cleans itself and becomes a chart (hook, frame 0 composed) =================
  var ROWS = [ // messy -> clean, flags = which columns are messy
    ['03/01/26', '03 Jan', 'Store A', 'Store A', '₹1,200', '1200', [1, 0, 1]],
    ['Jan 9', '09 Jan', 'store b', 'Store B', '650', '650', [1, 1, 0]],
    ['2026-02-02', '02 Feb', 'Store A', 'Store A', '₹ 950', '950', [1, 0, 1]],
    ['Feb 14', '14 Feb', 'Store B ', 'Store B', '1,430', '1430', [1, 0, 1]],
    ['Feb 14', '', 'Store B ', '', '1,430', '', [0, 0, 0], 'dup'],
    ['3/3', '03 Mar', 'STORE A', 'Store A', '₹2,100', '2100', [1, 1, 1]],
    ['Mar 21', '21 Mar', 'Store B', 'Store B', '1875.0', '1875', [0, 0, 1]]];
  var TOT = [['JAN', '1,850', 1850, 1], ['FEB', '2,380', 2380, 3], ['MAR', '3,975', 3975, 6]]; // label, text, value, sheet row index
  var CW = [48, 200, 180, 170, 170], X0 = 150, Y0 = 400; // sheet columns: #, Date, Store, Amount, Total
  function cell(w, cls, inner) { return '<div class="c ' + (cls || '') + '" style="width:' + w + 'px">' + (inner || '') + '</div>'; }
  var s1 = '<div class="abs" style="left:150px;top:176px;width:768px"><div class="h1">CLAUDE IN<br><span class="hl">YOUR SHEET</span></div></div>' +
    '<div class="abs sheet" id="sh" style="left:' + X0 + 'px;top:' + Y0 + 'px;width:768px">' +
    '<div class="fx"><b>fx</b><span id="fxt"></span></div>' +
    '<div class="row hd">' + cell(CW[0], 'n', '') + cell(CW[1], '', 'A · DATE') + cell(CW[2], '', 'B · STORE') + cell(CW[3], '', 'C · AMOUNT') + cell(CW[4], '', 'D · TOTAL') + '</div>';
  ROWS.forEach(function (r, i) {
    s1 += '<div class="row" id="r' + i + '">' + cell(CW[0], 'n', String(i + 2)) +
      [0, 1, 2].map(function (k) { return cell(CW[k + 1], k === 2 ? 'num' : '', '<div class="bad" id="b' + i + k + '"></div><span id="v' + i + k + '"></span>'); }).join('') +
      cell(CW[4], 'num', '<span id="d' + i + '"></span>') + '</div>';
  });
  s1 += '<div class="tabs"><div class="tab on">Sheet1</div><div class="tab new" id="ptab">Pivot ✓</div></div>' +
    '<div class="sel" id="sel1"></div></div>' +
    '<div class="abs tag" style="left:740px;top:356px">ILLUSTRATIVE</div>' +
    '<div class="abs pane" id="pane" style="left:150px;top:1004px;width:768px">' +
    '<div class="who">' + MK.claude + 'Claude<span class="mode">ASK BEFORE EDITS</span></div>' +
    '<div class="bub">clean this up, total by month, chart it</div>' +
    '<div class="card"><div class="t"><b>6 changes</b><br>4 dates · 3 amounts · 1 duplicate</div><div class="btn" id="apv">Approve</div></div></div>' +
    '<div class="abs" id="pill" style="left:150px;top:1004px"><div class="pill">' + ico(IC.check, 24) + '6 CHANGES APPLIED</div></div>' +
    '<div class="abs" id="chart" style="left:150px;top:1070px;width:768px;height:190px;border-bottom:4px solid var(--head)"></div>' +
    '<div class="abs ring" id="ring1"></div><div class="abs cursor" id="cur1">' + IC.cursor + '</div>';
  var sc1 = mk('s1', s1);
  var chart = $('chart'), BX = [80, 300, 520], BW = 170, BMAX = 150;
  TOT.forEach(function (d, k) { chart.insertAdjacentHTML('beforeend', '<div class="bar" id="bar' + k + '" style="left:' + BX[k] + 'px;width:' + BW + 'px"><i>' + d[0] + '</i></div>'); });
  TOT.forEach(function (d, k) { sc1.insertAdjacentHTML('beforeend', '<div class="tot" id="tot' + k + '">₹' + d[1] + '</div>'); });
  var FXH = 58, HDH = 52, RH = 56;
  function render1(t) {
    var clean0 = .95, ap = u(t, .62, .16);
    ROWS.forEach(function (r, i) {
      var row = $('r' + i);
      if (r[7] === 'dup') { var q = eio(u(t, clean0 + .25, .35)); row.style.height = (RH * (1 - q)) + 'px'; row.style.opacity = 1 - q; row.style.background = q > 0 ? 'rgba(255,82,51,' + (.25 * (1 - q)) + ')' : ''; }
      for (var k = 0; k < 3; k++) {
        var c = u(t, clean0 + (i + k) * .045, .14), v = $('v' + i + k), b = $('b' + i + k);
        v.textContent = (c < .5 || r[7] === 'dup') ? r[k * 2] : r[k * 2 + 1];
        v.style.opacity = r[7] === 'dup' ? 1 : (c < .5 ? 1 - c * 2 : (c - .5) * 2);
        b.style.opacity = r[6][k] ? (1 - c) : 0; v.style.color = r[6][k] && c < .5 ? 'var(--tom)' : '';
      }
      var sw = u(t, clean0 + i * .045, .3);
      row.style.boxShadow = sw > 0 && sw < 1 ? 'inset 0 0 0 999px rgba(255,195,26,' + (.35 * Math.sin(sw * Math.PI)) + ')' : 'none';
    });
    var d0 = 1.35;
    ROWS.forEach(function (r, i) { $('d' + i).textContent = ''; });
    TOT.forEach(function (d, k) { var e = u(t, d0 + k * .1, .15), sp = $('d' + d[3]); if (e > 0) { sp.textContent = d[1]; sp.style.opacity = e; sp.style.color = 'var(--ink)'; sp.parentNode.style.background = 'rgba(255,195,26,' + (.55 * e) + ')'; } else sp.parentNode.style.background = ''; });
    var fx = '=SUM(C2:C3)'; $('fxt').textContent = t < 1.3 ? '' : fx.slice(0, Math.round(fx.length * u(t, 1.3, .35)));
    var ry = function (i) { var y = FXH + HDH; for (var j = 0; j < i; j++) y += parseFloat($('r' + j).style.height || RH); return y; };
    var sel = $('sel1'); sel.style.left = (CW[0] + CW[1] + CW[2] + CW[3] - 3) + 'px'; sel.style.width = (CW[4] + 4) + 'px';
    sel.style.top = (ry(1) - 2) + 'px'; sel.style.height = (RH + 2) + 'px'; sel.style.opacity = u(t, 1.3, .12) * (1 - u(t, 2.0, .1));
    var gone = u(t, clean0 + .25, .35) >= 1, rn = 2;
    ROWS.forEach(function (r, i) { if (gone && r[7] === 'dup') return; $('r' + i).firstChild.textContent = String(rn++); });
    var c = $('cur1'), cp = eio(u(t, .05, .55)), out = eio(u(t, 1.0, .4));
    c.style.left = lerp(850, 790, cp) + lerp(0, 120, out) + 'px'; c.style.top = lerp(1256, 1196, cp) + lerp(0, 100, out) + 'px';
    c.style.opacity = 1 - out; c.style.transform = 'scale(' + (1 - .12 * Math.sin(ap * Math.PI)) + ')';
    var ring = $('ring1'), rr = u(t, .68, .35); ring.style.left = (812 - 40 * rr) + 'px'; ring.style.top = (1216 - 40 * rr) + 'px';
    ring.style.width = ring.style.height = (80 * rr) + 'px'; ring.style.opacity = rr > 0 ? 1 - rr : 0;
    $('apv').style.transform = 'scale(' + (1 - .08 * Math.sin(ap * Math.PI)) + ')';
    var pg = eio(u(t, .95, .3)); $('pane').style.opacity = 1 - pg; $('pane').style.transform = 'translateY(' + (30 * pg) + 'px) scale(' + (1 - .05 * pg) + ')';
    var pe = eo(u(t, 1.05, .2)); $('pill').style.opacity = pe; $('pill').style.transform = 'translateY(' + (-12 * (1 - pe)) + 'px)';
    chart.style.opacity = eo(u(t, 1.2, .25)); chart.style.clipPath = 'inset(-400px ' + (100 - 100 * eo(u(t, 1.2, .35))) + '% -10px 0)';
    TOT.forEach(function (d, k) {
      var fly = eio(u(t, 1.95 + k * .08, .45)), grow = bk(u(t, 2.05 + k * .08, .45), 1.4);
      var h = BMAX * d[2] / 3975 * grow; $('bar' + k).style.height = h + 'px';
      var src = { x: X0 + CW[0] + CW[1] + CW[2] + CW[3] + 6, y: Y0 + ry(d[3]) + 4, w: CW[4] - 12 }, dst = { x: 150 + BX[k], y: 1070 + 190 - h - 52, w: BW };
      var tc = $('tot' + k);
      tc.style.left = lerp(src.x, dst.x, fly) + 'px'; tc.style.top = lerp(src.y, dst.y, fly) + 'px'; tc.style.width = lerp(src.w, dst.w, fly) + 'px';
      tc.style.opacity = fly > 0 ? 1 : 0; tc.style.transform = 'rotate(' + (-6 * Math.sin(fly * Math.PI)) + 'deg)';
      $('d' + d[3]).style.opacity = fly > 0 ? .25 : u(t, d0 + k * .1, .15);
    });
    var pt = $('ptab'), pb = bk(u(t, 2.15, .3), 2); pt.style.transform = 'translateY(' + (-40 * (1 - pb)) + 'px)'; pt.style.opacity = u(t, 2.15, .05);
  }

  // ================= scene 2: Blender spreadsheet board (messy tiles -> clean grid -> 3D bars) =================
  mk('s2', head('// RAW ROWS TO A REAL CHART', 'MESSY IN →', 'CHART OUT') +
    '<canvas id="board" width="847" height="630" class="abs" style="left:150px;top:458px;width:768px;height:571px"></canvas>' +
    '<div class="abs stamp" id="st0" style="left:150px;top:1080px">CLEAN TABLE</div>' +
    '<div class="abs stamp" id="st1" style="left:488px;top:1080px">PIVOT</div>' +
    '<div class="abs stamp" id="st2" style="left:704px;top:1080px">CHART</div>');
  var BOARD = [], NB = 30;
  for (var bi = 0; bi < NB; bi++) { var im = new Image(); im.src = '3d/board/b' + (bi < 10 ? '0' : '') + bi + '.png'; BOARD.push(im); }
  function render2(t) {
    var c = L(1, 'clean'), ch = L(1, 'chart');
    var p = pw(t, [[0, 0], [c - .35, .1], [c + .6, .5], [ch - .25, .58], [ch + .85, 1]]), f = p * (NB - 1), a = Math.floor(f), b = Math.min(NB - 1, a + 1), k = f - a;
    var x = $('board').getContext('2d'); x.clearRect(0, 0, 847, 630);
    x.globalAlpha = 1; x.drawImage(BOARD[a], 0, 0); x.globalAlpha = k; x.drawImage(BOARD[b], 0, 0); x.globalAlpha = 1;
    [[c, -4], [L(1, 'pivot'), 3], [ch, -3]].forEach(function (s, j) {
      var e = bk(u(t, s[0], .3), 2.2), el = $('st' + j);
      el.style.opacity = u(t, s[0], .06); el.style.transform = 'rotate(' + s[1] + 'deg) scale(' + lerp(1.8, 1, e) + ')';
    });
  }

  // ================= scene 3: step 1, the Marketplace install =================
  var Q3 = 'Claude for Google Workspace';
  mk('s3', head('// STEP 1 · GOOGLE\'S ADD-ON STORE', 'GET THE', 'ADD-ON') +
    '<div class="abs store" id="store" style="left:150px;top:470px;width:768px;height:560px">' +
    '<div class="sthead"><img src="naive/shopping-bag.svg" width="46" height="46">Google Workspace Marketplace<span class="tag in">ILLUSTRATIVE</span></div>' +
    '<div class="search">' + ico(IC.search, 34) + '<span id="q3"></span></div>' +
    '<div class="result" id="res3"><div class="logo">' + ico(MK.claude, 86) + '</div><div class="meta"><div class="ttl">Claude for<br>Google Workspace</div>' +
    '<div class="sub">Public beta · paid Claude plans</div><div class="works">WORKS IN ' + ico(MK.sheets, 38) + ico(MK.docs, 38) + ico(MK.slides, 38) + '</div></div></div>' +
    '<div class="ibtn" id="ib3"><span id="ib3t">INSTALL</span></div>' +
    '<svg class="abs" id="rs3" width="768" height="560" style="left:0;top:0;overflow:visible;pointer-events:none"></svg></div>' +
    '<div class="abs bridge" id="br3" style="left:150px;top:1066px;width:768px"><div class="bar3"><i id="pb3"></i></div>' +
    '<div class="bl" id="bl3"><span class="k">ADDED TO</span> Extensions ▸ Claude <b>✓</b></div></div>' +
    '<div class="abs cursor" id="cur3">' + IC.cursor + '</div>');
  function render3(t) {
    var mkt = L(2, 'marketplace'), tap = Math.min(mkt + .25, DUR[2] - .9);
    enter($('store'), eo(u(t, 0, .4)), 50);
    $('q3').innerHTML = Q3.slice(0, Math.round(Q3.length * u(t, .25, 1.0))) + (t < 1.3 || Math.floor(t * 2.5) % 2 ? '<em>|</em>' : '');
    var re = bk(u(t, 1.15, .35), 1.5); $('res3').style.opacity = u(t, 1.15, .08); $('res3').style.transform = 'translateY(' + (30 * (1 - re)) + 'px)';
    $('ib3').style.opacity = u(t, 1.3, .1);
    var pr = u(t, tap, .14), done = t >= tap + .12; $('ib3').style.transform = 'scale(' + (1 - .08 * Math.sin(pr * Math.PI)) + ')';
    $('ib3').className = 'ibtn' + (done ? ' done' : ''); $('ib3t').textContent = done ? 'INSTALLED ✓' : 'INSTALL';
    rstroke($('rs3'), 'c3', function (rc) { return rc.ellipse(612, 488, 300, 112, { seed: 7, stroke: '#ffc31a', strokeWidth: 6, roughness: 1.6 }); }, eo(u(t, tap, .45)));
    var cu = $('cur3'), mv = eio(u(t, .9, tap - .9)); cu.style.left = lerp(840, 650, mv) + 'px'; cu.style.top = lerp(1270, 960, mv) + 'px';
    cu.style.opacity = u(t, .8, .1) * (1 - u(t, tap + .5, .2)); cu.style.transform = 'scale(' + (1 - .14 * Math.sin(pr * Math.PI)) + ')';
    var bp = u(t, tap + .1, .7); $('pb3').style.width = (100 * eio(bp)) + '%';
    enter($('br3'), eo(u(t, .5, .4)), 30); $('bl3').style.opacity = u(t, tap + .7, .2);
  }

  // ================= scene 4: step 2, the menu path (held >= 2.5 s for screenshots) =================
  var MENU = ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help'];
  var s4 = head('// STEP 2 · THREE CLICKS', 'OPEN IT FROM', 'THE MENU') +
    '<div class="abs win" id="win4" style="left:150px;top:470px;width:768px;height:600px"><div class="wtitle">' + ico(MK.sheets, 30) + '<b>Sales 2026</b><span class="tag in">ILLUSTRATIVE</span></div>' +
    '<div class="mbar">' + MENU.map(function (m, i) { return '<span id="mb' + i + '">' + m + '</span>'; }).join('') + '</div><div class="wgrid"></div>' +
    '<div class="drop" id="dd4"><div>Add-ons<i>▸</i></div><div>Macros<i>▸</i></div><div>Apps Script</div><hr><div id="dc4">' + ico(MK.claude, 26) + 'Claude<i>▸</i></div></div>' +
    '<div class="drop sub" id="sd4"><div id="oc4">Open Claude</div></div>' +
    '<div class="wpane" id="wp4"><div class="who">' + ico(MK.claude, 28) + 'Claude</div><div class="hi">Hi! What should we do<br>with this sheet?</div></div></div>' +
    '<div class="abs path" id="path4" style="left:150px;top:1104px;width:768px"><span id="pa0">EXTENSIONS</span><em>▸</em><span id="pa1">CLAUDE</span><em>▸</em><span id="pa2">OPEN CLAUDE</span></div>' +
    '<div class="abs cursor" id="cur4">' + IC.cursor + '</div>';
  mk('s4', s4);
  var MX = {}; // measured menu positions (stage px), filled lazily once fonts are in
  function render4(t) {
    var te = L(3, 'extensions'), tc = L(3, 'claude', 0), to = L(3, 'open', 1);
    enter($('win4'), eo(u(t, 0, .4)), 50);
    if (!MX.ok) { var wb = $('win4').getBoundingClientRect(), eb = $('mb7').getBoundingClientRect(); MX = { ok: 1, ex: eb.left - wb.left, ew: eb.width }; }
    // dropdown: right-aligned so it stays inside the window; the submenu opens to the left (as menus do at a screen edge)
    var dd = $('dd4'), ddL = Math.min(MX.ex, 768 - 24 - 290); dd.style.left = ddL + 'px';
    $('mb7').className = t >= te ? 'on' : '';
    var de = eo(u(t, te + .05, .2)); dd.style.opacity = de; dd.style.transform = 'scaleY(' + lerp(.6, 1, de) + ')';
    $('dc4').className = t >= tc ? 'on' : '';
    var se = eo(u(t, tc + .1, .2)), sd = $('sd4'); sd.style.left = (ddL - 250) + 'px'; sd.style.opacity = se; sd.style.transform = 'translateX(' + (30 * (1 - se)) + 'px)';
    $('oc4').className = t >= to ? 'on' : '';
    var open = eo(u(t, to + .45, .4)); $('wp4').style.transform = 'translateX(' + (300 * (1 - open)) + 'px)'; $('wp4').style.opacity = u(t, to + .45, .1);
    dd.style.opacity = de * (1 - u(t, to + .4, .15)); sd.style.opacity = se * (1 - u(t, to + .4, .15));
    // cursor walks the path
    var P = [[0, 840, 1260], [te - .25, 150 + MX.ex + 40, 545], [tc - .2, 150 + ddL + 120, 760], [to - .2, 150 + ddL - 150, 772], [to + .4, 150 + ddL - 150, 772]];
    var cu = $('cur4'); cu.style.left = pw(t, P.map(function (q) { return [q[0], q[1]]; })) + 'px'; cu.style.top = pw(t, P.map(function (q) { return [q[0], q[2]]; })) + 'px';
    cu.style.opacity = u(t, .2, .1) * (1 - u(t, to + .6, .2));
    enter($('path4'), eo(u(t, .35, .4)), 30);
    [te, tc, to].forEach(function (w, i) { $('pa' + i).className = t >= w ? 'on' : ''; });
  }

  // ================= scene 5: step 3, a colleague at a desk asks the laptop (humaaans + naive-icons + rough.js) =================
  var PROMPT = [['Clean this up', 'clean'], [', ', 0], ['total sales by month', 'total'], [', and ', 0], ['chart it', 'chart'], ['.', 0]];
  mk('s5', head('// STEP 3 · ONE PROMPT, THREE JOBS', 'ASK LIKE A', 'COLLEAGUE', 84) +
    '<div class="abs speech" id="chat5" style="left:150px;top:456px;width:768px"><div class="lb">YOU → CLAUDE</div><div class="tx" id="ptx"></div>' +
    '<svg class="abs" id="ul5" width="768" height="260" style="left:0;top:0;overflow:visible"></svg><div class="tail"></div></div>' +
    '<div class="abs desk" style="left:150px;top:1082px;width:560px;height:24px"></div>' +
    '<div class="abs leg" style="left:186px;top:1106px;height:170px"></div><div class="abs leg" style="left:656px;top:1106px;height:170px"></div>' +
    '<div class="abs laptop" id="lap" style="left:186px;top:790px;width:420px;height:262px"><div class="scr">' +
    '<div class="mini" id="mini"></div><div class="lpane"><div class="lph">' + MK.claude + 'Claude</div><div id="res5"></div></div></div>' +
    '<div class="abs tag" style="right:10px;top:-34px;font-size:14px">RESULTS ILLUSTRATIVE</div></div>' +
    '<div class="abs lapbase" style="left:160px;top:1052px;width:472px;height:30px"></div>' +
    '<img class="abs" src="naive/coffee.svg" style="left:628px;top:1010px;width:76px;height:76px">' +
    '<img class="abs" id="col5" src="colleague.svg" style="left:566px;top:860px;width:334px;height:422px">');
  (function () {
    var h = ''; for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) h += '<i id="m' + r + c + '" style="left:' + (c * 56) + 'px;top:' + (r * 30) + 'px"></i>';
    h += '<b id="mbr0" style="left:16px"></b><b id="mbr1" style="left:80px"></b><b id="mbr2" style="left:144px"></b>';
    $('mini').innerHTML = h;
  })();
  var CH5 = [['CLEANED 214 ROWS', 'clean', .7], ['12 MONTHS SUMMED', 'total', .9], ['CHART ADDED', 'chart', .5]];
  CH5.forEach(function (c, k) { $('res5').insertAdjacentHTML('beforeend', '<div class="rline" id="ch5' + k + '">' + IC.check + c[0] + '</div>'); });
  function render5(t) {
    var tC = L(4, 'clean'), tT = L(4, 'total'), tH = L(4, 'chart');
    var ce = bk(u(t, .1, .4), 1.5); $('chat5').style.opacity = u(t, .1, .08); $('chat5').style.transform = 'translateY(' + (40 * (1 - ce)) + 'px) scale(' + lerp(.92, 1, ce) + ')';
    var le = eo(u(t, 0, .45)); $('lap').style.transform = 'translateY(' + (50 * (1 - le)) + 'px)'; $('lap').style.opacity = le;
    var pe = bk(u(t, .05, .5), 1.4), col = $('col5'); col.style.transformOrigin = '45% 100%'; col.style.transform = 'translateX(' + (180 * (1 - pe)) + 'px) rotate(' + (1.6 * Math.sin(t * 2.4)) + 'deg)';
    var full = PROMPT.map(function (p) { return p[0]; }).join(''), n = Math.round(full.length * u(t, .3, Math.min(1.7, tC - .45))), html = '', used = 0;
    PROMPT.forEach(function (p, i) { var s = p[0].slice(0, Math.max(0, n - used)); used += p[0].length; if (s) html += p[1] ? '<span class="cl" id="cl' + i + '">' + s + '</span>' : s; });
    $('ptx').innerHTML = html + (n < full.length || Math.floor(t * 2.5) % 2 ? '<span style="color:var(--vio)">|</span>' : '');
    var box = $('chat5').getBoundingClientRect(), sc = box.width / 768, svg = $('ul5');
    [].forEach.call(svg.childNodes, function (g) { g.style.display = 'none'; });
    PROMPT.forEach(function (p, i) {
      if (!p[1]) return; var el = $('cl' + i); if (!el) return; var k = eo(u(t, L(4, p[1]), .4)); if (k <= 0) return;
      [].forEach.call(el.getClientRects(), function (r, j) {
        var x1 = (r.left - box.left) / sc, y1 = (r.bottom - box.top) / sc - 6, x2 = (r.right - box.left) / sc;
        rstroke(svg, 'u' + i + '_' + j + '_' + Math.round(x2 - x1), function (rc) { return rc.line(x1, y1, x2, y1 + 3, { seed: 11 + i * 7 + j, stroke: '#ffc31a', strokeWidth: 9, roughness: 1.4, bowing: 1.5 }); }, k);
      });
    });
    for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) {
      var bad = hash(r, c) > .62, c0 = u(t, tC + (r + c) * .04, .12), m = $('m' + r + c);
      m.style.background = bad && c0 < .5 ? '#ffd9cf' : (c === 3 && r % 2 === 1 && t > tT + r * .05 ? '#ffe7a3' : '#fff'); m.style.borderColor = bad && c0 < .5 ? '#ff5233' : '#d5e3db';
    }
    [0, 1, 2].forEach(function (k) { var e = bk(u(t, tH + .15 + k * .1, .35), 1.6); $('mbr' + k).style.height = (e * [34, 46, 70][k]) + 'px'; });
    CH5.forEach(function (c, k) { var t0 = L(4, c[1]) + c[2], e = bk(u(t, t0, .3), 2), el = $('ch5' + k); el.style.opacity = u(t, t0, .06); el.style.transform = 'translateX(' + (30 * (1 - e)) + 'px)'; });
  }

  // ================= scene 6: Python joins two tables and writes the result back =================
  function tbl(id, title, cols, rows, w) {
    return '<div class="abs mtab" id="' + id + '" style="width:' + w + 'px"><div class="mth">' + title + '</div><div class="mrow hd">' + cols.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
      rows.map(function (r, i) { return '<div class="mrow" id="' + id + 'r' + i + '">' + r.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'; }).join('') + '</div>';
  }
  var CODE = [['orders', ' = sheet[', '"Orders"', ']'], ['custs', '  = sheet[', '"Customers"', ']'], ['joined', ' = orders.merge(', '', ''], ['', '    custs, on=', '"cust"', ')'], ['write', '(joined, ', '"Joined"', ')']];
  mk('s6', head('// TWO TABLES, ONE MERGE', 'MESSY JOINS?', 'IT USES PYTHON', 80) +
    tbl('to6', 'ORDERS', ['order', 'cust', '₹'], [['#101', 'C7', '1200'], ['#102', 'C3', '650'], ['#103', 'C7', '950']], 340) +
    tbl('tc6', 'CUSTOMERS', ['cust', 'city'], [['C3', 'Pune'], ['C7', 'Delhi']], 340) +
    '<div class="abs code" id="code6" style="left:530px;top:470px;width:388px;height:470px"><div class="cth"><img src="naive/code.svg" width="40" height="40">python<span class="tag in">ILLUSTRATIVE</span></div><div id="cb6"></div></div>' +
    '<div class="abs skel" id="sk6" style="left:150px;top:1000px;width:768px;height:236px"><span>NEW TAB · JOINED</span><em>waiting for Python…</em></div>' +
    tbl('tj6', 'JOINED ✓', ['order', 'cust', '₹', 'city'], [['#101', 'C7', '1200', 'Delhi'], ['#102', 'C3', '650', 'Pune'], ['#103', 'C7', '950', 'Delhi']], 768) +
    '<svg class="abs" id="ar6" width="1080" height="1920" style="left:0;top:0;overflow:visible;pointer-events:none"></svg>');
  $('to6').style.left = '150px'; $('to6').style.top = '470px'; $('tc6').style.left = '150px'; $('tc6').style.top = '742px';
  $('tj6').style.left = '150px'; $('tj6').style.top = '1000px';
  function render6(t) {
    var tP = L(5, 'pulls'), tR = L(5, 'range'), tY = L(5, 'python'), tW = L(5, 'writes'), tB = L(5, 'back');
    enter($('to6'), eo(u(t, 0, .35)), 40); enter($('tc6'), eo(u(t, .12, .35)), 40); enter($('code6'), eo(u(t, .2, .4)), 40);
    // the range gets lassoed (rough dashed rectangle) on "range"
    rstroke($('ar6'), 'lasso', function (rc) { return rc.rectangle(140, 462, 362, 520, { seed: 3, stroke: '#ffc31a', strokeWidth: 5, roughness: 1.8 }); }, eo(u(t, tR - .1, .5)));
    rstroke($('ar6'), 'a1', function (rc) { return rc.curve([[504, 640], [520, 600], [536, 560]], { seed: 5, stroke: '#f6f1ff', strokeWidth: 6, roughness: 1.2 }); }, eo(u(t, tY - .2, .4)));
    var n = Math.round(CODE.length * 14 * u(t, tP, Math.max(.8, tW - tP - .1))), html = '', used = 0;
    CODE.forEach(function (ln) {
      var s = ln.join(''), k = Math.max(0, Math.min(s.length, n - used)); used += 14;
      var part = s.slice(0, k), v = ln[0], rest = part.slice(v.length);
      html += '<div><b>' + part.slice(0, Math.min(k, v.length)) + '</b>' + rest.replace(/("[^"]*"?)/g, '<i>$1</i>') + '</div>';
    });
    $('cb6').innerHTML = html + (t < tW ? '<span class="cur">▌</span>' : '');
    enter($('sk6'), eo(u(t, .3, .4)), 30); $('sk6').style.opacity = Math.min(cl(eo(u(t, .3, .4)) * 4, 0, 1), 1 - u(t, tB - .15, .2));
    var je = bk(u(t, tB - .15, .45), 1.4); $('tj6').style.opacity = u(t, tB - .15, .08); $('tj6').style.transform = 'translateY(' + (60 * (1 - je)) + 'px)';
    rstroke($('ar6'), 'a2', function (rc) { return rc.curve([[724, 944], [700, 972], [660, 996]], { seed: 9, stroke: '#ffc31a', strokeWidth: 6, roughness: 1.2 }); }, eo(u(t, tW - .1, .4)));
    for (var i = 0; i < 3; i++) $('tj6r' + i).style.background = t > tB + .1 + i * .08 && t < tB + .6 + i * .08 ? 'var(--sun2)' : '';
  }

  // ================= scene 7: the approval card (default mode asks first; "Accept all edits" exists too) =================
  var PEND = [['3/3', '03 Mar'], ['₹2,100', '2100'], ['Feb 14 (dup)', 'removed'], ['', '+ SUM row']];
  mk('s7', head('// YOUR OKAY FIRST', 'IT ASKS', 'BEFORE EDITS') +
    '<div class="abs modes" id="md7" style="left:150px;top:470px;width:768px"><div class="m on">' + ico(IC.check, 24) + 'ASK BEFORE EDITS<em>DEFAULT</em></div><div class="m">ACCEPT ALL EDITS</div></div>' +
    '<div class="abs pend" id="pd7" style="left:150px;top:572px;width:768px">' + PEND.map(function (p, i) {
      return '<div class="prow" id="pr7' + i + '"><span class="old">' + p[0] + '</span><span class="arr">→</span><span class="new">' + p[1] + '</span></div>'; }).join('') + '</div>' +
    '<div class="abs acard" id="ac7" style="left:150px;top:930px;width:768px"><div class="lk" id="lk7">' + ico(IC.lock, 44) + '</div><div class="at"><b>3 changes</b><br>fix 2 dates · drop 1 duplicate · add a SUM row</div>' +
    '<div class="abtn" id="ab7">Approve</div><div class="dbtn">Dismiss</div></div>' +
    '<div class="abs" id="ok7" style="left:150px;top:1180px"><div class="pill">' + ico(IC.check, 24) + 'APPROVED · 3 EDITS MADE</div></div>' +
    '<div class="abs ring" id="ring7"></div><div class="abs cursor" id="cur7">' + IC.cursor + '</div>');
  function render7(t) {
    var tN = L(6, 'nothing'), tap = Math.min(L(6, 'back') + .25, DUR[6] - .7);
    enter($('md7'), eo(u(t, 0, .35)), 30); enter($('pd7'), eo(u(t, .1, .4)), 40); enter($('ac7'), eo(u(t, .3, .4)), 40);
    var ap = u(t, tap, .16), done = t >= tap + .1;
    PEND.forEach(function (p, i) { var r = $('pr7' + i), e = u(t, tap + .1 + i * .08, .2); r.className = 'prow' + (e > .5 ? ' done' : ''); r.style.transform = 'scale(' + (1 + .04 * Math.sin(e * Math.PI)) + ')'; });
    // while "nothing changes" is said, the pending rows pulse but stay pending
    $('pd7').style.boxShadow = t > tN && t < tap ? '0 0 0 ' + (4 + 3 * Math.sin((t - tN) * 9)) + 'px rgba(255,195,26,.55)' : '';
    $('ab7').style.transform = 'scale(' + (1 - .08 * Math.sin(ap * Math.PI)) + ')';
    $('lk7').innerHTML = ico(done ? IC.unlock : IC.lock, 44); $('lk7').className = 'lk' + (done ? ' open' : '');
    var cu = $('cur7'), mv = eio(u(t, .8, tap - .8)); cu.style.left = lerp(840, 640, mv) + 'px'; cu.style.top = lerp(1270, 1032, mv) + 'px';
    cu.style.opacity = u(t, .7, .1) * (1 - u(t, tap + .45, .2)); cu.style.transform = 'scale(' + (1 - .14 * Math.sin(ap * Math.PI)) + ')';
    var rr = u(t, tap, .35), rg = $('ring7'); rg.style.left = (660 - 40 * rr) + 'px'; rg.style.top = (1050 - 40 * rr) + 'px'; rg.style.width = rg.style.height = (80 * rr) + 'px'; rg.style.opacity = rr > 0 ? 1 - rr : 0;
    var oe = bk(u(t, tap + .35, .3), 1.8); $('ok7').style.opacity = u(t, tap + .35, .06); $('ok7').style.transform = 'translateY(' + (20 * (1 - oe)) + 'px)';
  }

  // ================= scene 8: Docs and Slides too, fanned over a real desk photo =================
  var APPS = [['sheets', 'SHEETS', 'Formulas, pivots, charts', -4, 164], ['docs', 'DOCS', 'Fixes text in place', 0, 414], ['slides', 'SLIDES', 'New slides in your theme', 4, 664]];
  mk('s8', head('// SAME PANE, THREE APPS', 'DOCS AND', 'SLIDES TOO') +
    '<div class="abs photo" id="ph8" data-ov="1" style="left:150px;top:470px;width:768px;height:440px"><img src="photos/desk.jpg"><div class="abs tag" style="right:14px;top:14px">PHOTO · UNSPLASH</div></div>' +
    APPS.map(function (a, i) { return '<div class="abs app" id="ap8' + i + '" style="left:' + a[4] + 'px;top:840px;width:232px">' + ico(MK[a[0]], 70) + '<b>' + a[1] + '</b><span>' + a[2] + '</span></div>'; }).join(''));
  function render8(t) {
    var tD = L(7, 'docs'), tS = L(7, 'slides');
    enter($('ph8'), eo(u(t, 0, .4)), 40);
    $('ph8').querySelector('img').style.transform = 'scale(' + (1.04 + .03 * t / Math.max(1, DUR[7])) + ')';
    [Math.min(.25, tD - .3), tD - .05, tS - .05].forEach(function (s, i) {
      var e = bk(u(t, s, .4), 1.6), el = $('ap8' + i); el.style.opacity = u(t, s, .06);
      el.style.transform = 'translateY(' + (90 * (1 - e)) + 'px) rotate(' + (APPS[i][3] * e + 12 * (1 - e) * (i - 1)) + 'deg)';
    });
  }

  // ================= scene 9: the catch, three flagged cells (with real film-grain footage) =================
  var CATCH = [['BETA', 'Public beta: it can still change', 'beta'], ['PAID PLANS', 'Any paid Claude plan, not the free one', 'paid'], ['WORK ACCOUNT', 'Your admin may need to allow it', 'admin\'s']];
  mk('s9', '<video class="abs fxv" id="vg9" src="fx/film-grain.webm" data-fps="30" muted preload="auto" style="left:0;top:0;width:1080px;height:1920px;object-fit:cover;mix-blend-mode:multiply;opacity:.34"></video>' +
    head('// BEFORE YOU INSTALL', 'THE', 'CATCH') +
    CATCH.map(function (c, i) {
      return '<div class="abs flag" id="fg9' + i + '" style="left:150px;top:' + (500 + i * 250) + 'px;width:768px"><div class="fcell"><img src="naive/alert-triangle.svg" width="70" height="70"></div><div class="ftx"><b>' + c[0] + '</b><span>' + c[1] + '</span></div></div>';
    }).join('') + '<svg class="abs" id="rc9" width="1080" height="1920" style="left:0;top:0;overflow:visible;pointer-events:none"></svg>');
  function render9(t) {
    CATCH.forEach(function (c, i) {
      var tw = L(8, c[2]), e = bk(u(t, Math.min(.15 + i * .12, tw - .5), .4), 1.4), el = $('fg9' + i);
      el.style.opacity = u(t, Math.min(.15 + i * .12, tw - .5), .06) * (t >= tw ? 1 : .55); el.style.transform = 'translateX(' + (-80 * (1 - e)) + 'px)';
      el.className = 'abs flag' + (t >= tw ? ' hot' : '');
      var y = 500 + i * 250;
      rstroke($('rc9'), 'cc' + i, function (rc) { return rc.ellipse(225, y + 75, 168, 160, { seed: 21 + i, stroke: '#ffc31a', strokeWidth: 7, roughness: 1.6 }); }, eo(u(t, tw, .45)));
    });
  }

  // ================= scene 10: save-worthy recap + comment CTA (profile, handle, keyword) =================
  mk('s10', '<video class="abs fxv" id="vl10" src="fx/dust-particles.webm" data-fps="25" muted preload="auto" style="left:0;top:0;width:1080px;height:1920px;object-fit:cover;mix-blend-mode:screen;opacity:.45"></video>' +
    '<div class="abs recap" id="rcp" style="left:150px;top:170px;width:768px">' +
    '<div class="rh"><span>CLAUDE IN SHEETS · 3 STEPS</span><em><img src="naive/bookmark.svg" width="34" height="34">SAVE</em></div>' +
    '<div class="rr"><i>1</i><b>INSTALL</b><span>Google Workspace Marketplace →<br><u>Claude for Google Workspace</u></span></div>' +
    '<div class="rr"><i>2</i><b>OPEN</b><span>Extensions ▸ Claude ▸ <u>Open Claude</u></span></div>' +
    '<div class="rr"><i>3</i><b>ASK</b><span>"Clean this up, total sales by month, and chart it."</span></div>' +
    '<div class="rf">Public beta · paid Claude plans · asks before every edit by default</div></div>' +
    '<div class="abs cta" id="cta" style="left:150px;top:878px;width:768px">' +
    '<div class="pfp"><img src="profile.jpg"></div><div class="who"><b>@sandesh.explains</b>' +
    '<div class="cbub">' + '<img src="naive/chat.svg" width="44" height="44"><span>Comment</span><strong id="kw10"></strong></div>' +
    '<div class="dm">→ I\'ll DM you the prompt</div></div></div>');
  function render10(t) {
    var tC = L(9, 'comment'), tS = L(9, 'sheets');
    enter($('rcp'), eo(u(t, 0, .4)), 40);
    var ce = bk(u(t, .25, .45), 1.4); $('cta').style.opacity = u(t, .25, .08); $('cta').style.transform = 'translateY(' + (60 * (1 - ce)) + 'px)';
    var kw = 'SHEETS', n = Math.round(kw.length * u(t, tS - .05, .45));
    $('kw10').innerHTML = kw.slice(0, n) + (Math.floor(t * 2.5) % 2 || n < kw.length ? '<em>|</em>' : '&nbsp;');
    $('cta').querySelector('.cbub').style.transform = 'scale(' + (1 + .05 * Math.sin(u(t, tC, .3) * Math.PI)) + ')';
  }

  // ================= shared: background cell flashes, step tracker, captions, cell-tile cuts, footage seeks =================
  var SCN = [render1, render2, render3, render4, render5, render6, render7, render8, render9, render10];
  function flashes(id, t, si) {
    for (var k = 0; k < 7; k++) {
      var slot = Math.floor(t * .9 + k * .37), ph = t * .9 + k * .37 - slot, cx = Math.floor(hash(slot + si * 13, k) * 6), cy = Math.floor(hash(k, slot + si * 7) * 11);
      var f = $(id + 'f' + k); f.style.left = (cx * 180 - 30 + 2) + 'px'; f.style.top = (cy * 180 - 20 + 2) + 'px'; f.style.opacity = .07 * Math.sin(ph * Math.PI);
    }
  }
  st.insertAdjacentHTML('beforeend', '<div class="abs track" id="trk" style="left:150px;top:150px"><div id="tk0">1 · INSTALL</div><div id="tk1">2 · OPEN</div><div id="tk2">3 · ASK</div></div>');
  var TSTATE = [null, null, 0, 1, 2, 3, 3, 3, 3, null]; // step tracker: index of the current step per scene (3 = all done)
  function tracker(t, si) {
    var s = TSTATE[si], el = $('trk'); el.style.display = s === null ? 'none' : 'flex'; if (s === null) return;
    var e = si === 2 ? bk(u(t - SC[2], 0, .35), 1.6) : 1; el.style.transform = 'translateY(' + (-30 * (1 - e)) + 'px)'; el.style.opacity = cl(e * 3, 0, 1);
    for (var k = 0; k < 3; k++) $('tk' + k).className = k < s ? 'done' : k === s ? 'on' : '';
  }
  st.insertAdjacentHTML('beforeend', '<div id="cap"><div id="capd"></div></div>');
  function caption(t) {
    var pg = null;
    for (var i = 0; i < PG.length; i++) { var w0 = WD[PG[i][0]], w1 = WD[PG[i][PG[i].length - 1]], nx = i + 1 < PG.length ? WD[PG[i + 1][0]].s : 1e9; if (t >= w0.s - .06 && t < Math.min(nx - .06, w1.e + .6)) pg = PG[i]; }
    var cap = $('cap'); if (!pg) { cap.style.opacity = 0; return; } cap.style.opacity = 1;
    $('capd').innerHTML = pg.map(function (j) { var w = WD[j]; return '<span class="' + (t >= w.s && t < w.e + .08 ? 'on' : t >= w.s ? 'past' : '') + '">' + w.w + '</span>'; }).join(' ');
  }
  var cutc = $('cutc'), cx = cutc.getContext('2d');
  function cutDraw(p) { // cell tiles cover the old scene (first half) and uncover the new one (second half); one scene visible at a time
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
  function vseek(v, tt) { // deterministic footage frame: seek to the middle of the frame window, resolve on "seeked"
    return new Promise(function (res) {
      var fps = +v.dataset.fps || 30, dur = v.duration || 6, f = Math.floor((tt % (dur - .1)) * fps), target = (f + .5) / fps;
      if (Math.abs(v.currentTime - target) < 1e-4 && v.readyState >= 2) return res();
      var done = function () { v.removeEventListener('seeked', done); res(); }; v.addEventListener('seeked', done); v.currentTime = target;
    });
  }
  window.__seek = function (t) {
    var cp = -1, si = 0, waits = [];
    for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
    for (i = 0; i < SC.length; i++) {
      var el = $('s' + (i + 1)), on = i === si; el.style.display = on ? 'block' : 'none';
      if (i > 0 && Math.abs(t - SC[i]) < CUT / 2) cp = (t - (SC[i] - CUT / 2)) / CUT;
    }
    flashes('s' + (si + 1), t, si); SCN[si](t - SC[si]); tracker(t, si); cutDraw(cp); caption(t);
    [].forEach.call($('s' + (si + 1)).querySelectorAll('video.fxv'), function (v) { waits.push(vseek(v, t - SC[si])); });
    return waits.length ? Promise.all(waits) : undefined;
  };
  window.__ready = false;
  var FACES = ['700 20px Rubik', '800 20px Rubik', '500 20px Azeret', '700 20px Azeret', '500 20px Inter', '600 20px Inter', '700 20px Inter'];
  // load every face up front: text first set inside __seek would otherwise request its font late and stay invisible on frame 0
  var vids = [].slice.call(document.querySelectorAll('video.fxv')).map(function (v) { return new Promise(function (res) { if (v.readyState >= 1) res(); else v.addEventListener('loadedmetadata', res, { once: true }); }); });
  var imgs = [].slice.call(document.querySelectorAll('#stage img')).map(function (im) { return im.decode().catch(function () {}); });
  Promise.all([document.fonts.ready].concat(FACES.map(function (f) { return document.fonts.load(f); }), BOARD.map(function (im) { return im.decode().catch(function () {}); }), vids, imgs))
    .then(function () { return window.__seek(0); }).then(function () { window.__ready = true; });
})();
