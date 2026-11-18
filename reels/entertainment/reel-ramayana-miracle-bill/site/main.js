/* "VFX ka bill" — orchestration: scenes joined by scan wipes, labels, captions, end card, events. Pure function of t. */
(function () {
var V = window.V, W = V.W, H = V.H, R = V.R, clamp = V.clamp, ramp = V.ramp, eo3 = V.eo3, eob = V.eob, ST = V.ST, CW = V.CW, ev = V.ev;
var S = V.scenes, N = S.length, DUR = V.DUR, WL = .35, WR = .2;
var title = V.mk('VFX <b>ka</b> bill', 'title'), capEl = document.createElement('div'), wipeEl = V.mk('', 'wipe');
capEl.style.cssText = 'position:absolute;left:162px;top:1340px;width:756px'; V.OV.appendChild(capEl);
var END = V.mk('<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="eF">FOLLOW</span><span id="eS">SHARE</span></div>', 'endc'); END.style.display = 'none';
var CAPW = window.TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
var tEnd = V.tEnd;
window.SCN_T0 = function () { return V.BND.slice(); };
/* sound events (the audio mix reads window.EV) */
ev(.05, 'hit'); for (var i = 1; i < N; i++) ev(V.BND[i] - .3, 'whoosh');
ev(CW('s1', 'chaand'), 'bars'); ev(CW('s1', 'ramayana'), 'bars'); ev(CW('s1', 'kyun'), 'ping');
ev(CW('s3', 'poochna'), 'tick'); ['girti', 'mudti', 'rukti'].forEach(function (w) { ev(CW('s3', w), 'tick'); }); ev(CW('s3', 'bill'), 'ring');
ev(CW('s4', 'dneg'), 'tick'); ev(CW('s4b', 'sau'), 'tick'); ev(CW('s5', 'paper'), 'ring');
for (var ci = 0; ci < 14; ci++) ev(CW('s6', '42') + ci * .135, 'tick');
ev(CW('s7', 'kumbhakarna'), 'ring'); ev(CW('s7', 'hanuman'), 'ring'); ev(CW('s7', 'asur'), 'ring');
ev(CW('s8', 'jatayu'), 'flash'); ev(CW('s8', 'sirf'), 'tick'); ev(CW('s9', 'ganit'), 'ring');
ev(CW('s10', 'render'), 'tick'); ev(CW('s10b', 'part'), 'bars'); ev(CW('s10b', 'hisson'), 'bars'); ev(CW('s10b', 'crore', 1), 'ring');
ev(CW('s11b', 'muft'), 'ping'); ev(tEnd, 'ping');
function dirOf(i) { return i % 2 ? 1 : -1; }
function drawBox(sc, x0, x1) { R.setRenderTarget(V.RT0); R.setScissorTest(true); R.setScissor(x0, 0, x1 - x0, H); R.render(sc.S, sc.C); R.setScissorTest(false); }
window.__seek = function (t) {
  var cur = 0; for (var i = 0; i < N; i++) if (t >= S[i].t0) cur = i;
  var wipeI = -1, wp = 0; for (var j = 1; j < N; j++) { var b = S[j].t0; if (t >= b - WL && t < b + WR) { wipeI = j; wp = ramp(t, b - WL, b + WR); } }
  var a = wipeI > 0 ? S[wipeI - 1] : S[cur], b2 = wipeI > 0 ? S[wipeI] : null;
  V.fade = 1; var order = b2 ? [a, b2] : [a]; order.forEach(function (sc) { sc.upd(t, t - sc.t0, sc.t1 - sc.t0); });
  V.mFin.uniforms.fade.value = V.fade;
  var cap = V.mFin.uniforms.ca; cap.value = .0022 + .008 * Math.exp(-Math.pow((t - .15) / .2, 2));
  if (wipeI > 0) cap.value += .02 * Math.exp(-Math.pow((wp - .6) / .22, 2));
  var cc = 0; ['s2', 's4', 's6', 's8', 's10', 's11'].forEach(function () { }); cap.value += .008 * Math.exp(-Math.pow((t - CW('s6', '42')) / .3, 2)) + .01 * Math.exp(-Math.pow((t - CW('s8', 'jatayu')) / .25, 2));
  /* render */
  R.setRenderTarget(V.RT0); R.setScissorTest(false); R.setClearColor(0x000000, 1); R.clear(true, true, true);
  if (!b2) drawBox(a, 0, W);
  else { var ex = Math.round(W * wp), d = dirOf(wipeI); if (d > 0) { drawBox(b2, 0, ex); drawBox(a, ex, W); } else { drawBox(a, 0, W - ex); drawBox(b2, W - ex, W); } wipeEl.style.display = 'block'; wipeEl.style.left = (d > 0 ? ex : W - ex) + 'px'; }
  if (!b2) wipeEl.style.display = 'none';
  V.post();
  /* DOM: title, labels, captions, end card */
  var tt = t < S[0].t1 - .4 ? Math.min(1, (t + .3) / .45) : Math.max(0, 1 - (t - (S[0].t1 - .4)) / .3); title.style.opacity = tt; title.style.display = tt > 0 ? 'block' : 'none';
  V.LBS.forEach(function (o) {
    var sc = o.sc, tE = o.t1 ? Math.min(o.t1, sc.t1) : sc.t1, on = (t >= sc.t0 + (sc.i === 0 ? -1 : .05)) && t < tE - .05;
    if (!on) { o.el.style.display = 'none'; return; }
    var u = ramp(t, o.t0, o.t0 + .55); if (t > tE - .3) u = u * clamp((tE - .05 - t) / .25);
    var w = o.in.offsetWidth || 300, h = o.in.offsetHeight || 100, x, y;
    if (o.anchor) { var p = V.proj(o.anchor, sc.C); x = p[0] - w / 2 + (o.dx || 0); y = p[1] - h; } else { x = o.px[0]; y = o.px[1]; }
    x = Math.max(156, Math.min(918 - w, x)); y = Math.max(232, Math.min(1290 - h, y)); o.el.style.left = x + 'px'; o.el.style.top = y + 'px'; V.writeIn(o, u);
  });
  capEl.innerHTML = window.CAP.html(t, CAPW, { plain: true, hi: '#a9d8f0', ink: '#f1f3f8', fs: 40, width: 756 });
  var e2 = eo3(ramp(t, tEnd, tEnd + .5)); END.style.display = e2 > 0 ? 'block' : 'none'; END.style.opacity = e2; END.style.transform = 'translateY(' + ((1 - e2) * 30) + 'px)';
  document.getElementById('eF').style.transform = 'scale(' + (eob(ramp(t, tEnd + .15, tEnd + .5)) * (1 + .04 * Math.sin((t - tEnd) * 4.2))).toFixed(3) + ')';
  document.getElementById('eS').style.transform = 'scale(' + (eob(ramp(t, tEnd + .4, tEnd + .75)) * (1 + .04 * Math.sin((t - tEnd) * 4.2 + 1.5))).toFixed(3) + ')';
};
window.__ready = false;
var faces = ['200 76px IntT', '300 38px IntT', '600 40px IntT', '800 40px Inter', '300 20px JBM', '500 23px JBM'];
(document.fonts && document.fonts.load ? Promise.all(faces.map(function (f) { return document.fonts.load(f, 'VFX ka bill 0123456789 ₹–·≈~'); })) : Promise.resolve()).then(function () { window.__ready = true; window.__seek(0); }).catch(function () { window.__ready = true; window.__seek(0); });
})();
