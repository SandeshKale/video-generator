/* Word-by-word highlighted captions (yellow rounded chip on the spoken word, keyword tints) — own work, CC0.
 * Pure function of t: CAP.html(t, words, opts) -> HTML string. Put it in a positioned box inside window.__seek(t):
 *     capEl.innerHTML = CAP.html(t, WORDS, {fs: 56, width: 768, lines: 2, keywords: {'billion': '#c9b8ff', 'free': '#ffc9a8'}});
 * words = [{w:'Black', t0: 0.12, t1: 0.41}, ...]  (seconds; the same timing.json word list the reels already build).
 * Layout rules baked in (CLAUDE.md): <= 2 lines per chunk, chunk breaks at sentence ends, dark scrim pill behind, off-white text (never #fff),
 * and the box is meant to sit inside the Instagram safe zone (x 150-918, above y 1536) — position the host element there yourself.
 * Fonts: Inter ExtraBold (assets/fonts/inter, weight 800) or Archivo 800/900 or Roboto 900 — load every face before __ready.
 */
(function (g) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const eo3 = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const strip = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');

  // width model: a word costs (chars + 1.25) "units" (letter widths + the chip padding/gap); one unit ~ 0.6 em of bold caps-height text.
  const cost = (w) => w.w.length + 1.25;
  function layout(ws, maxU) {                       // -> array of lines (arrays of words), greedy
    const lines = [[]]; let u = 0;
    ws.forEach((w) => { if (u + cost(w) > maxU && lines[lines.length - 1].length) { lines.push([]); u = 0; } lines[lines.length - 1].push(w); u += cost(w); });
    return lines;
  }
  function chunks(words, maxU, nLines) {            // chunks of at most nLines lines; also break after sentence ends
    const out = []; let cur = [];
    words.forEach((w) => {
      if (cur.length && layout(cur.concat([w]), maxU).length > nLines) { out.push(cur); cur = []; }
      cur.push(w);
      if (/[.!?]$/.test(w.w) && cur.length >= 2) { out.push(cur); cur = []; }
    });
    if (cur.length) out.push(cur); return out;
  }

  function html(t, words, o = {}) {
    const fs = o.fs || 64, width = o.width || 768, nLines = o.lines || 2, padX = Math.round(fs * .5);
    const maxU = o.maxUnits || Math.floor((width - 2 * padX) / (fs * .6));            // e.g. 64 px in a 768 px box -> 11 units; use fs 56 for ~13
    const chip = o.chip || '#ffd21f', chipInk = o.chipInk || '#161616', ink = o.ink || '#f1f3f8', dim = o.dim == null ? .72 : o.dim, kw = o.keywords || {};
    const font = o.font || "'Inter','Archivo','Roboto',sans-serif", wt = o.weight || 800;
    const cs = o._cs || (o._cs = chunks(words, maxU, nLines));
    let ci = -1; for (let i = 0; i < cs.length; i++) if (t >= cs[i][0].t0 - (o.lead == null ? .05 : o.lead)) ci = i;
    if (ci < 0) return '';
    const c = cs[ci], last = c[c.length - 1];
    if (t > last.t1 + (o.hold == null ? .35 : o.hold)) return '';                       // hold the finished chunk briefly, then clear
    const born = eo3((t - c[0].t0 + .05) / .16);
    const spans = layout(c, maxU).map((ln) => ln.map((w) => {
      const on = t >= w.t0 && t < w.t1 + .001, past = t >= w.t1, k = kw[strip(w.w)];
      const pop = on ? 1 + .07 * Math.sin(clamp((t - w.t0) / .14) * Math.PI) : 1;
      return `<span style="display:inline-block;padding:2px ${Math.round(fs * .2)}px;margin:0 ${Math.round(fs * .04)}px;border-radius:${Math.round(fs * .26)}px;background:${on ? chip : 'transparent'};color:${on ? chipInk : (k || ink)};opacity:${on || past ? 1 : dim};transform:scale(${pop.toFixed(3)});transform-origin:50% 60%;${on ? 'text-shadow:none' : ''}">${esc(w.w)}</span>`;
    }).join('')).join('<br>');
    return `<div style="display:inline-block;max-width:100%;white-space:nowrap;text-align:center;font:${wt} ${fs}px/1.3 ${font};letter-spacing:-.01em;padding:${Math.round(fs * .3)}px ${padX}px;border-radius:${Math.round(fs * .5)}px;background:rgba(8,10,20,${o.scrim == null ? .62 : o.scrim});opacity:${born.toFixed(3)};transform:translateY(${((1 - born) * 14).toFixed(1)}px);text-shadow:0 4px 12px rgba(0,0,0,.5),0 1px 3px rgba(0,0,0,.8)">${spans}</div>`;
  }
  g.CAP = { html, chunks };
})(typeof window !== 'undefined' ? window : globalThis);
