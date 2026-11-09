/* Part C (billionaire): DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['DOORBELL · 2:47 PM', 'YOUR NUMBER = YOUR DOORBELL', 'THE 2024 FIX · A MARKED STREET', 'THE CATCH · NOBODY OPENS FOR THE MARKED STREET', 'THE CHOWKIDAAR CANNOT SAY SPAM', 'SOME RINGS ARE PLAIN FRAUD', 'TRAI · 18 SEPTEMBER 2026 · THREE GATES', 'DECLARE YOURSELF'];
var HL = ['Loan ne aapko <b>dhoondha</b>', '42 arab baar <b>ghanti</b>', 'Sellers ki <b>alag gali</b>', 'Gali ka naam hi <b>badnaam</b>', 'Chowkidaar bol nahi <b>sakta</b>', 'Bank, police, <b>payment app</b>', 'Gate par <b>teen niyam</b>', 'Ab loan ko <b>naam</b> batao'];
var TAGS = ['ILLUSTRATIVE · THE PHONE AS A DOORBELL', 'TRUECALLER REPORT 2025 · ROUGH MATH', 'TRAI FRAMEWORK 2024 · VIA TECHCRUNCH', 'TRUECALLER CEO CLAIM · 8 JUL 2026', 'TECHCRUNCH, 8 JUL 2026', 'TRUECALLER REPORT · FEB 2026', 'TECHCRUNCH, 18 SEP 2026 · TRAI AMENDMENT', 'ILLUSTRATIVE SCENE'];
var hsc = D('', 'left:0;top:0;width:1080px;height:430px;background:linear-gradient(rgba(13,20,51,.92),rgba(13,20,51,.75) 55%,rgba(13,20,51,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:600 24px \'DM Mono\';letter-spacing:.14em;color:#ff8a1f;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#ff8a1f"></i><span id="ebt"></span></div><div id="hl" style="font:900 56px/1.04 Chakra Petch;letter-spacing:-.02em;margin-top:14px;color:#f4ecd8;text-shadow:0 4px 18px rgba(0,0,0,.6)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "DM Mono";letter-spacing:.06em;color:rgba(244,236,216,.7);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(13,20,51,0),rgba(13,20,51,.94) 22%,rgba(13,20,51,.94) 80%,rgba(13,20,51,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f4ecd8;box-shadow:0 0 0 6px #ff8a1f,0 10px 40px rgba(0,0,0,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f4ecd8;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#ff8a1f;font:600 26px "DM Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#f4ecd8', 190], ['share', 'SHARE', '#3de0a8', 210], ['bell-ringing', 'SUBSCRIBE', '#ff8a1f', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:#0b1230;display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "DM Mono";letter-spacing:.05em;color:#f4ecd8;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ff8a1f', chipInk: '#0b1230', keywords: { 'spam': '#ff4d5e', 'loan': '#ff8a1f', 'Truecaller': '#3de0a8', 'TRAI': '#6a7bff', 'fraud': '#ff4d5e' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = [];
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { var th2 = S0('h2'), th3 = S0('h3'), ta1 = S0('a1'), ta2 = S0('a2'), tt1 = S0('t1'), tr1 = S0('r1'), tr2 = S0('r2'), tw2 = S0('w2'), tf1 = S0('f1'), tf2 = S0('f2'), tx2 = S0('x2'), tx3 = S0('x3'), tx4 = S0('x4'), tx5 = S0('x5'), tc1 = S0('c1');
  for (var k = 0; k < 7; k++) ev(.3 + k * 1.2, 'ping'); ev(th2 - .3, 'pop'); ev(th3, 'whoosh'); ev(ta1 + .6, 'whoosh'); for (var a = 0; a < 6; a++) ev(ta1 + 1.0 + a * .5, 'tick'); ev(ta2 + 2.4, 'ping');
  ev(tt1 + .3, 'pop'); ev(tt1 + 1.2, 'pop'); ev(tt1 + 4, 'whoosh'); ev(tr1 + .5, 'slam'); ev(tr1 + 1.1, 'slam'); ev(tr2 + 1.0, 'tick'); ev(tw2 + .6, 'slam'); ev(tf1 + 1.0, 'pop'); ev(tf1 + 2.2, 'pop'); ev(tf2 + .2, 'ping');
  ev(tx2 + .2, 'pop'); ev(tx3 + .2, 'pop'); ev(tx4 + .8, 'slam'); ev(tx5 + .1, 'pop'); ev(tc1 + 3.0, 'slam'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.22, .18, .18, .18, .2, .2, .18, .2], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); if (window.__camO) e.setCam(window.__camO.p, window.__camO.l, window.__camO.f); else e.camAt(0, t); e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:900;background:#ff8a1f;color:#0b1230;padding:0 10px;border-radius:6px;text-shadow:none'; });
  hdr.style.opacity = ec ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo)); hl.style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (ec ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  var dip = 0; DIPS.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#0d1433'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 22; e.POST.bloom = .25; e.POST.vig = .3; e.POST.expo = 1.3; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
