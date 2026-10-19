// Handwritten notebook page engine. A page is 1600x2240 px of ruled paper; text sits on the ruled lines.
// Text markup: {r:..} red pen, {k:..} black pen, {g:..} green pen, {hy:..}/{hg:..}/{hp:..}/{hb:..} highlighter,
// {u:..} underline, {uu:..} double underline, {o:..} circled, {x:..} crossed out. Tags nest.
// Every letter gets a small seeded wobble (rotation, baseline, size, ink density) so no two letters repeat exactly.
(function () {
  var PW = 1600, PH = 2240, R0 = 236, RS = 66, NS = 'http://www.w3.org/2000/svg';
  var INK = { b: '#1d2f86', k: '#17171c', r: '#c22630', g: '#17734a', p: '#5a5f66' };
  var HL = { hy: 'rgba(255,226,0,.50)', hg: 'rgba(110,235,110,.45)', hp: 'rgba(255,110,190,.40)', hb: 'rgba(90,200,255,.42)' };
  var page = document.getElementById('page'), hl = document.getElementById('hl'), pen = document.getElementById('pen');
  var GL = '→⇄≈≠✓✗', rcH = rough.svg(hl), rcP = rough.svg(pen), SEED = 1, marks = [];
  function rnd(i) { var x = Math.sin(i * 127.1 + SEED * 311.7) * 43758.5453; return x - Math.floor(x) }
  var NI = 0;
  window.L = function (row) { return R0 + row * RS };
  window.N = { seed: function (s) { SEED = s } };
  // parse "{tag:..}" markup into a tree
  function parse(s) {
    var out = [], i = 0;
    function node(end) {
      var kids = [], buf = '';
      while (i < s.length) {
        var c = s[i];
        if (c === '{') { var m = /^\{([a-z]+):/.exec(s.slice(i)); if (m) { if (buf) kids.push(buf), buf = ''; i += m[0].length; kids.push({ t: m[1], k: node(true) }); continue } }
        if (c === '}' && end) { i++; break }
        buf += c; i++;
      }
      if (buf) kids.push(buf);
      return kids;
    }
    return node(false);
  }
  function emit(parent, kids, st, size) {
    kids.forEach(function (k) {
      if (typeof k === 'string') {
        for (var j = 0; j < k.length; j++) {
          var ch = k[j], sp = document.createElement('span'); NI++;
          if (ch === ' ') { sp.textContent = ' '; sp.style.marginRight = (rnd(NI) * 4 - 1) + 'px'; parent.appendChild(sp); continue }
          if (GL.indexOf(ch) >= 0) { sp.style.display = 'inline-block'; sp.style.width = (size * (ch === '✓' || ch === '✗' ? .62 : .9)) + 'px'; sp.style.height = (size * .5) + 'px'; sp.style.margin = '0 ' + (size * .08) + 'px'; marks.push({ el: sp, t: 'glyph', g: ch, ink: st.ink }); parent.appendChild(sp); continue }
          sp.textContent = ch; sp.style.display = 'inline-block';
          sp.style.color = INK[st.ink]; sp.style.opacity = (.80 + rnd(NI + 7) * .2).toFixed(2);
          sp.style.transform = 'translateY(' + ((rnd(NI + 3) - .5) * size * .055).toFixed(2) + 'px) rotate(' + ((rnd(NI + 5) - .5) * 5).toFixed(2) + 'deg) scale(' + (.96 + rnd(NI + 9) * .08).toFixed(3) + ')';
          sp.style.marginRight = ((rnd(NI + 11) - .45) * size * .03).toFixed(2) + 'px';
          parent.appendChild(sp);
        }
        return;
      }
      var g = document.createElement('span'), s2 = Object.assign({}, st);
      if (INK[k.t]) s2.ink = k.t;
      g.style.whiteSpace = 'nowrap'; parent.appendChild(g);
      if (HL[k.t] || /^(u|uu|o|x)$/.test(k.t)) marks.push({ el: g, t: k.t, ink: s2.ink });
      emit(g, k.k, s2, size);
    });
  }
  // write(row, x, text, opts): handwriting on ruled line `row`; opts.y overrides with an absolute baseline
  window.W = function (row, x, text, o) {
    o = o || {}; var size = o.size || 52, d = document.createElement('div');
    var base = o.y != null ? o.y : L(row);
    d.className = 'w'; d.style.left = x + 'px'; d.style.top = (base - size * (o.font === 'a' ? .95 : .82) + (o.dy || 0)) + 'px';
    d.style.fontSize = size + 'px'; d.style.fontFamily = o.font === 'a' ? 'AD' : 'CV'; d.style.fontWeight = o.w || (o.font === 'a' ? 400 : 500);
    d.style.transform = 'rotate(' + ((o.rot != null ? o.rot : (rnd(NI + 13) - .5) * .7)) + 'deg)'; d.style.transformOrigin = '0 80%';
    if (o.center) { d.style.width = o.center + 'px'; d.style.textAlign = 'center'; d.style.marginLeft = (-o.center / 2) + 'px' }
    emit(d, parse(text), { ink: o.ink || 'b' }, size); page.appendChild(d); return d;
  };
  // rough.js helpers on the pen layer (or highlighter layer with o.hl)
  function ro(o, def) { return Object.assign({ roughness: 1.1, bowing: 1.2, stroke: INK.b, strokeWidth: 3, seed: (SEED * 97 + (++NI)) % 2e9 }, def || {}, o || {}) }
  window.R = {
    box: function (x, y, w, h, o) { (o && o.hl ? rcH : rcP); var n = (o && o.hl ? rcH : rcP).rectangle(x, y, w, h, ro(o)); (o && o.hl ? hl : pen).appendChild(n); return n },
    ell: function (x, y, w, h, o) { var n = rcP.ellipse(x, y, w, h, ro(o)); pen.appendChild(n); return n },
    line: function (x1, y1, x2, y2, o) { var n = rcP.line(x1, y1, x2, y2, ro(o)); pen.appendChild(n); return n },
    path: function (d, o) { var n = rcP.path(d, ro(o)); pen.appendChild(n); return n },
    arrow: function (x1, y1, x2, y2, o) {
      o = o || {}; var a = Math.atan2(y2 - y1, x2 - x1), L2 = o.head || 22, w = .42;
      if (o.curve) { var mx = (x1 + x2) / 2 - Math.sin(a) * o.curve, my = (y1 + y2) / 2 + Math.cos(a) * o.curve; R.path('M' + x1 + ' ' + y1 + ' Q' + mx + ' ' + my + ' ' + x2 + ' ' + y2, o); a = Math.atan2(y2 - my, x2 - mx) }
      else R.line(x1, y1, x2, y2, o);
      R.line(x2, y2, x2 - L2 * Math.cos(a - w), y2 - L2 * Math.sin(a - w), o); R.line(x2, y2, x2 - L2 * Math.cos(a + w), y2 - L2 * Math.sin(a + w), o);
      if (o.both) { var b = a + Math.PI; R.line(x1, y1, x1 - L2 * Math.cos(b - w), y1 - L2 * Math.sin(b - w), o); R.line(x1, y1, x1 - L2 * Math.cos(b + w), y1 - L2 * Math.sin(b + w), o) }
    },
    tick: function (x, y, o) { R.path('M' + x + ' ' + (y - 14) + ' l12 16 l26 -38', ro(o, { stroke: INK.g, strokeWidth: 4 })) },
    cbox: function (x, y, done, o) { R.box(x, y - 34, 34, 34, ro(o, { stroke: INK.k, strokeWidth: 2.5 })); if (done) R.path('M' + (x + 4) + ' ' + (y - 16) + ' l12 14 l30 -44', ro(o, { stroke: INK.g, strokeWidth: 4.5 })) },
    star: function (x, y, s, o) { var p = ''; for (var i = 0; i < 10; i++) { var r = i % 2 ? s * .42 : s, a = -Math.PI / 2 + i * Math.PI / 5; p += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1) } R.path(p + 'Z', o) },
    hlRect: function (x, y, w, h, c) { var n = rcH.rectangle(x, y, w, h, { fill: c, fillStyle: 'solid', stroke: 'none', roughness: 1.8, seed: ++NI }); hl.appendChild(n) },
    stain: function (x, y, r) { var c = document.createElement('div'); c.className = 'stain'; c.style.left = (x - r) + 'px'; c.style.top = (y - r) + 'px'; c.style.width = c.style.height = (2 * r) + 'px'; page.appendChild(c) }
  };
  // after fonts load: highlighter strokes, underlines, circles and strike-throughs from the laid-out spans
  window.finish = function () {
    var pr = page.getBoundingClientRect();
    marks.forEach(function (m) {
      var r = m.el.getBoundingClientRect(), x = r.left - pr.left, y = r.top - pr.top, w = r.width, h = r.height, c = INK[m.ink === 'b' && m.t !== 'x' ? 'r' : m.ink];
      if (m.t === 'glyph') {
        var ik = INK[m.g === '✓' ? 'g' : (m.g === '✗' ? 'r' : m.ink)], o2 = { stroke: ik, strokeWidth: 3.4, roughness: .9 }, cy = y + h * .55;
        if (m.g === '→') R.arrow(x, cy, x + w, cy, Object.assign({ head: h * .45 }, o2));
        else if (m.g === '⇄') { R.arrow(x, cy - h * .2, x + w, cy - h * .2, Object.assign({ head: h * .32 }, o2)); R.arrow(x + w, cy + h * .25, x, cy + h * .25, Object.assign({ head: h * .32 }, o2)) }
        else if (m.g === '≈') { [-.16, .2].forEach(function (k) { R.path('M' + x + ' ' + (cy + h * k) + ' q' + w / 4 + ' -' + h * .25 + ' ' + w / 2 + ' 0 t' + w / 2 + ' 0', o2) }) }
        else if (m.g === '≠') { R.line(x, cy - h * .16, x + w, cy - h * .18, o2); R.line(x, cy + h * .2, x + w, cy + h * .18, o2); R.line(x + w * .7, cy - h * .5, x + w * .3, cy + h * .5, o2) }
        else if (m.g === '✓') R.path('M' + x + ' ' + (cy - h * .05) + ' l' + w * .3 + ' ' + h * .4 + ' l' + w * .7 + ' -' + h * .95, Object.assign(o2, { strokeWidth: 4 }));
        else if (m.g === '✗') { R.line(x, cy - h * .45, x + w, cy + h * .4, Object.assign(o2, { strokeWidth: 4 })); R.line(x + w, cy - h * .45, x, cy + h * .4, o2) }
        return;
      }
      if (HL[m.t]) R.hlRect(x - 6, y + h * .2, w + 12, h * .62, HL[m.t]);
      else if (m.t === 'u') R.line(x - 4, y + h * .86, x + w + 6, y + h * .84, { stroke: INK.r, strokeWidth: 3.2, roughness: 1.4 });
      else if (m.t === 'uu') { R.line(x - 4, y + h * .84, x + w + 6, y + h * .82, { stroke: INK.r, strokeWidth: 3.2 }); R.line(x, y + h * .93, x + w + 2, y + h * .92, { stroke: INK.r, strokeWidth: 3 }) }
      else if (m.t === 'o') R.ell(x + w / 2, y + h * .52, w + 30, h * .95, { stroke: INK.r, strokeWidth: 3, roughness: 1.6 });
      else if (m.t === 'x') { for (var k = 0; k < 3; k++) R.line(x - 2, y + h * (.45 + k * .06), x + w + 2, y + h * (.43 + k * .07), { stroke: INK.b, strokeWidth: 3.4, roughness: 2.2 }) }
    });
  };
})();
