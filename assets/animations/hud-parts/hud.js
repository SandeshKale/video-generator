/* HUD parts — geofence polygon, grid cells, ray-cast dots, bar chart, glow card. Own work, CC0.
 * Every part is a PURE FUNCTION of time t (seconds): `HUD.geofence(t, opts)` returns an SVG string, no timers, no CSS animation,
 * so it satisfies the render contract. Typical use inside window.__seek(t):
 *     el.innerHTML = HUD.geofence(t - sceneStart, {pts:[[…]], color:'#ffd21f', t0:0.2, dur:1.2});
 * Times are local seconds; before `t0` a part draws nothing (or its resting state). Colours: pass the reel's own palette.
 */
(function (g) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const eo3 = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const eio = (x) => (x = clamp(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const f = (n) => Math.round(n * 100) / 100;
  const MONO = "font-family=\"'JetBrains Mono', 'Space Mono', monospace\"";
  const hash = (i) => { let h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; };

  /* polygon that draws itself on, fills, then breathes; vertex handles pulse on a 1.4 s cycle */
  function geofence(t, o) {
    const pts = o.pts, c = o.color || '#ffd21f', t0 = o.t0 || 0, dur = o.dur || 1.2;
    const u = eo3((t - t0) / dur); if (t < t0) return '';
    let L = 0; const seg = pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; const l = Math.hypot(q[0] - p[0], q[1] - p[1]); L += l; return l; });
    const d = 'M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join(' L') + ' Z';
    const fillA = clamp((u - .7) / .3) * (o.fill == null ? .18 : o.fill);
    let s = `<path d="${d}" fill="${c}" fill-opacity="${f(fillA)}"/>`;
    s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${o.w || 3}" stroke-linejoin="round" stroke-dasharray="${f(L)}" stroke-dashoffset="${f(L * (1 - u))}" style="filter:drop-shadow(0 0 8px ${c})"/>`;
    let run = 0;
    pts.forEach((p, i) => {
      const reached = u * L >= run - 0.01; run += seg[i]; if (!reached) return;
      const ph = ((t - t0) / 1.4 + i * .17) % 1;
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="${f(5 + 11 * ph)}" fill="none" stroke="${c}" stroke-opacity="${f(.7 * (1 - ph))}" stroke-width="2"/><circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#fff" stroke="${c}" stroke-width="2.5"/>`;
    });
    if (o.label && u > .5) { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      s += `<text x="${f(cx)}" y="${f(cy)}" text-anchor="middle" fill="${c}" font-size="${o.fs || 22}" font-weight="700" letter-spacing="3" ${MONO} opacity="${f(clamp((u - .5) * 3))}">${o.label}</text>`; }
    return s;
  }

  /* cols x rows grid; cells light at their own times (o.lit = [[col,row,t],...]) and fade to a dim state; a cursor cell eases between lit cells */
  function gridCells(t, o) {
    const n = o.cols, m = o.rows, cs = o.cell, c = o.color || '#39e6c4', x0 = o.x || 0, y0 = o.y || 0;
    let s = ''; const lit = o.lit || [];
    for (let r = 0; r < m; r++) for (let q = 0; q < n; q++) {
      const hit = lit.find((a) => a[0] === q && a[1] === r); const a = hit ? eo3((t - hit[2]) / .4) : 0;
      const glow = hit && t >= hit[2] ? (1 - clamp((t - hit[2] - .4) / 1.6)) * .35 : 0;
      s += `<rect x="${x0 + q * cs + 1.5}" y="${y0 + r * cs + 1.5}" width="${cs - 3}" height="${cs - 3}" rx="${o.r == null ? 4 : o.r}" fill="${c}" fill-opacity="${f(a * (.28 + glow))}" stroke="${c}" stroke-opacity="${f(.18 + .6 * a)}" stroke-width="${a ? 2 : 1}"/>`;
    }
    const seq = lit.filter((a) => t >= a[2]); if (o.cursor !== false && seq.length) {
      const last = seq[seq.length - 1], prev = seq[seq.length - 2] || last, k = eio((t - last[2]) / .35);
      const cx = prev[0] + (last[0] - prev[0]) * k, cy = prev[1] + (last[1] - prev[1]) * k;
      s += `<rect x="${f(x0 + cx * cs - 3)}" y="${f(y0 + cy * cs - 3)}" width="${cs + 6}" height="${cs + 6}" rx="8" fill="none" stroke="#fff" stroke-width="2.5" style="filter:drop-shadow(0 0 6px ${c})"/>`;
    }
    return s;
  }

  /* rays from an origin to target dots; each ray shoots at its own time, the dot lights on arrival and rings once */
  function rayCast(t, o) {
    const [ox, oy] = o.origin, c = o.color || '#ff4d6d', sp = o.dur || .5; let s = '';
    o.targets.forEach((p, i) => {
      const ts = (o.t0 || 0) + i * (o.gap || .18), k = clamp((t - ts) / sp); if (t < ts) { s += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${c}" fill-opacity=".18"/>`; return; }
      const e = eo3(k), ex = ox + (p[0] - ox) * e, ey = oy + (p[1] - oy) * e;
      s += `<line x1="${ox}" y1="${oy}" x2="${f(ex)}" y2="${f(ey)}" stroke="${c}" stroke-opacity="${f(k < 1 ? .85 : .25)}" stroke-width="${k < 1 ? 2.5 : 1.2}" style="filter:drop-shadow(0 0 4px ${c})"/>`;
      if (k >= 1) { const ph = clamp((t - ts - sp) / .8); s += `<circle cx="${p[0]}" cy="${p[1]}" r="${f(6 + 22 * ph)}" fill="none" stroke="${c}" stroke-opacity="${f(.8 * (1 - ph))}" stroke-width="2"/>`; }
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="${k >= 1 ? 7 : 5}" fill="${k >= 1 ? c : 'none'}" fill-opacity="${k >= 1 ? 1 : .18}" stroke="${c}" stroke-width="2"/>`;
    });
    return s + `<circle cx="${ox}" cy="${oy}" r="9" fill="#fff" stroke="${c}" stroke-width="3" style="filter:drop-shadow(0 0 8px ${c})"/>`;
  }

  /* bars that grow with a stagger; value counter climbs with the bar; baseline + optional highlight index */
  function barChart(t, o) {
    const vs = o.values, mx = o.max || Math.max(...vs), w = o.w || 640, h = o.h || 320, gap = o.gap || 18, c = o.color || '#ffd21f', hi = o.highlight;
    const bw = (w - gap * (vs.length - 1)) / vs.length; let s = `<line x1="0" y1="${h}" x2="${w}" y2="${h}" stroke="${c}" stroke-opacity=".4" stroke-width="2"/>`;
    vs.forEach((v, i) => {
      const k = eo3((t - (o.t0 || 0) - i * (o.stagger || .12)) / (o.dur || .8)), bh = (v / mx) * (h - 34) * k, x = i * (bw + gap), col = hi == null || hi === i ? c : (o.dim || '#5b6480');
      s += `<rect x="${f(x)}" y="${f(h - bh)}" width="${f(bw)}" height="${f(bh)}" rx="6" fill="${col}" style="${hi === i ? `filter:drop-shadow(0 0 10px ${c})` : ''}"/>`;
      if (k > .02) s += `<text x="${f(x + bw / 2)}" y="${f(h - bh - 10)}" text-anchor="middle" fill="${col}" font-size="${o.fs || 22}" font-weight="700" ${MONO}>${(o.fmt || ((x) => Math.round(x)))(v * k)}</text>`;
      if (o.labels) s += `<text x="${f(x + bw / 2)}" y="${h + 28}" text-anchor="middle" fill="#9aa3c0" font-size="${(o.fs || 22) - 4}" ${MONO} letter-spacing="2">${o.labels[i]}</text>`;
    });
    return s;
  }

  /* yellow-on-navy glow card: mono eyebrow with wide tracking, headline types on, outer glow pulses slowly */
  function glowCard(t, o) {
    const w = o.w || 640, h = o.h || 170, c = o.color || '#ffd21f', bg = o.bg || '#0b1233', t0 = o.t0 || 0; if (t < t0) return '';
    const k = eo3((t - t0) / .45), n = Math.floor(clamp((t - t0 - .25) / ((o.text.length) * .035)) * o.text.length), pulse = .55 + .25 * Math.sin((t - t0) * 2.4);
    return `<g opacity="${f(k)}" transform="translate(0 ${f((1 - k) * 18)})"><rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="${bg}" stroke="${c}" stroke-width="3" style="filter:drop-shadow(0 0 ${f(10 + 16 * pulse)}px ${c})"/>
      <text x="28" y="44" fill="${c}" fill-opacity=".8" font-size="${o.efs || 18}" letter-spacing="5" font-weight="500" ${MONO}>${o.eyebrow || ''}</text>
      <text x="28" y="${h - 38}" fill="${c}" font-size="${o.fs || 52}" font-weight="800" letter-spacing="2" ${MONO}>${o.text.slice(0, n)}<tspan fill-opacity="${Math.floor((t - t0) * 2) % 2 ? 0 : 1}">▍</tspan></text></g>`;
  }

  g.HUD = { geofence, gridCells, rayCast, barChart, glowCard, ease: { eo3, eio }, hash };
})(typeof window !== 'undefined' ? window : globalThis);
