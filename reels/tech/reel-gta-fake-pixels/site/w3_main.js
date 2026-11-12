/* ---------- end card ---------- */
var LIME = '#b4f000', tCta = S0('cta');
var scrim = D('left:0;top:830px;width:1080px;height:480px;background:linear-gradient(rgba(3,3,4,0),rgba(3,3,4,.9) 22%,rgba(3,3,4,.9) 80%,rgba(3,3,4,0))'); scrim.setAttribute('data-ov', '1');
var pf = D('left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:6px solid ' + LIME + ';box-shadow:0 0 0 6px #030304,0 0 44px 6px rgba(180,240,0,.4);overflow:hidden;background:#0a0f1d', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('left:385px;top:924px;font:800 62px/1 Inter;letter-spacing:-.02em;color:#eaffd0;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', 'nerdlogic<span style="color:' + LIME + '">.co</span>'), hs = D('left:385px;top:1004px;color:#eef0ff;font:600 22px Inter;letter-spacing:.24em', 'NERDS EXPLAIN · LOGIC EXPLAINS');
var IC = { 'thumb-up': '<path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0l4-8a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2l-1 5a2 2 0 0 1-2 2h-7a3 3 0 0 1-3-1"/>', 'share': '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>', 'bell': '<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1"/>' };
function ico(n, s, c) { return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + IC[n] + '</svg>'; }
var btns = [['thumb-up', 'LIKE', '#eef0ff', 190, 0], ['share', 'SHARE', '#eef0ff', 210, 210], ['bell', 'SUBSCRIBE', LIME, 290, 440]].map(function (c) { return D('left:' + (158 + c[4]) + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:3px solid ' + c[2] + ';border-radius:8px;background:rgba(3,3,4,.94);display:flex;align-items:center;justify-content:center;gap:10px;font:600 24px Inter;letter-spacing:.08em;color:' + c[2] + ';box-sizing:border-box', ico(c[0], 32, c[2]) + c[1]); });
/* ---------- sound events (kinds understood by audio_mix.py) ---------- */
function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.2, 'whoosh'); ev(3.4, 'pop'); for (var i = 1; i < SC.length - 1; i++) ev(SC[i] + .1, 'whoosh'); ev(WS('r1', 'उछलती|उचल', 0), 'ping'); for (i = 0; i < 6; i++) ev(S0('b1') + .8 + i * .55, 'tick'); ev(S0('b2') + .5, 'ping'); ev(WS('b2', 'हर', 0), 'pop'); ev(WS('s1', '83|तिरासी', 0), 'ping'); ev(WS('s1', '17|सत्रह', 0), 'pop'); ev(WS('s1', '36|छत्तीस', 0), 'slam'); ev(SC[6] + .3, 'rumble'); ev(WS('s2', 'जुगार|जुगाड़', 0, true), 'ping'); ev(WS('c1', 'पूरी', 0), 'ping'); ev(WS('c2', 'बड़ा|बडा', 0), 'pop'); ev(WS('c3', 'पांज|पाँच', 0), 'ping'); ev(S0('c3') + .8, 'card'); ev(WS('m1', '2|दो', 0), 'pop'); ev(WS('m1', '15|पंद्रह', 0), 'slam'); ev(WS('k1', 'बटन', 0), 'pop'); ev(WS('k1', 'लैग', 0), 'buzz'); ev(S0('k2'), 'card'); ev(tCta, 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
window.__reelDurationSec = TM.end; window.EV = EVL; window.__B = SC;
/* ---------- the seek ---------- */
var lastNo = 0;
window.__seek = function (t) {
  t = Math.max(0, Math.min(TM.end - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 2, ec = last && t >= tCta - .1;
  OTHERS.forEach(function (o) { o.visible = false; }); hero.visible = false; plinth.visible = false; glass.visible = true; sweepK = 1.1; accK = .9; sweepAz = 0; LABS.forEach(function (l) { l.style.opacity = 0; }); big.style.fontSize = '150px';
  camFor(sc, t); var h = SCN[sc](t);
  var az = Math.atan2(cam.position.x, cam.position.z) + Math.PI + (sweepAz || 0); bakeEnv(az, sweepK, accK);
  if (!window.__skipRender) R.render(S, cam);
  setText(kick, ec ? '' : h.k, ec ? 0 : clamp((t - SC[sc]) / .4)); setText(title, ec ? '' : h.title, ec ? 0 : h.op); setText(sub, ec ? '' : h.sub, ec ? 0 : (h.sub ? h.op : 0)); setText(tagEl, ec ? '' : h.tag, ec || !h.tag ? 0 : h.op); if (sc !== 5 && sc !== 6 && sc !== 10) big.style.opacity = 0;
  var ue = function (x) { return clamp((t - x) / .35); }; scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var u = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = u > 0 ? 'block' : 'none'; x.style.opacity = u; x.style.transform = 'translateY(' + ((1 - eo3(u)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var u = ec ? ue(bt[i] - .1) : 0; b.style.display = u > 0 ? 'flex' : 'none'; b.style.opacity = u; var pl = u >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(u); b.style.transform = 'scale(' + pl.toFixed(3) + ')'; });
  if (ec) LABS.forEach(function (l) { l.style.opacity = 0; });
  capEl.innerHTML = CAP.html(t, TM.cap, CAPO);
};
Promise.all(['200 40px Tight', '300 30px Tight', '600 30px Inter', '800 30px Inter'].map(function (f) { return document.fonts.load(f); })).then(function () { var im = new Image(); im.onload = im.onerror = function () { window.__ready = true; }; im.src = 'img/profile.jpg'; });
})();
