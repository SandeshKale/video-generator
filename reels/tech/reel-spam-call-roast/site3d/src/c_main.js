/* Part C (billionaire): DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['UNKNOWN NUMBER · 2:47 PM', 'SPAM CALLS · INDIA, 2025', 'THE 2024 FIX · 1400 AND 1600', 'THE CATCH · NOBODY ANSWERS THE OFFICIAL STREET', 'FRAUD CALLS · 770 CRORE', 'WHO PICKS UP · EVERY TIME', 'TRAI · 18 SEPTEMBER 2026', 'DECLARE YOURSELF']
var HL = ['Loan ne aapko <b>dhoondha</b>', '41.7 arab <b>spam calls</b>', 'Telemarketers ki <b>alag gali</b>', 'Wahi gali sabse <b>badnaam</b>', 'Bank, police, <b>payment app</b>', 'Scammer ko chahiye <b>baat</b>', 'Spam ke liye <b>call rate</b>', 'Ab loan ko <b>declare</b> karo']
var TAGS = ['ILLUSTRATIVE SCENE · NOT A REAL CALL', 'TRUECALLER REPORT 2025 · ROUGH MATH', 'TRAI FRAMEWORK 2024 · VIA TECHCRUNCH', 'TRUECALLER CEO CLAIM · 8 JUL 2026', 'TRUECALLER REPORT · OUR ARITHMETIC', 'OUR OPINION · ILLUSTRATIVE', 'TECHCRUNCH, 18 SEP 2026 · TRAI AMENDMENT', 'ILLUSTRATIVE SCENE']
var hsc = D('', 'left:0;top:0;width:1080px;height:430px;background:linear-gradient(rgba(13,20,51,.92),rgba(13,20,51,.75) 55%,rgba(13,20,51,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:600 24px \'DM Mono\';letter-spacing:.14em;color:#ff8a1f;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#ff8a1f"></i><span id="ebt"></span></div><div id="hl" style="font:900 56px/1.04 Chakra Petch;letter-spacing:-.02em;margin-top:14px;color:#f4ecd8;text-shadow:0 4px 18px rgba(0,0,0,.6)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "DM Mono";letter-spacing:.06em;color:rgba(244,236,216,.7);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(13,20,51,0),rgba(13,20,51,.94) 22%,rgba(13,20,51,.94) 80%,rgba(13,20,51,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f4ecd8;box-shadow:0 0 0 6px #ff8a1f,0 10px 40px rgba(0,0,0,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f4ecd8;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#ff8a1f;font:600 26px "DM Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#f4ecd8', 190], ['share', 'SHARE', '#3de0a8', 210], ['bell-ringing', 'SUBSCRIBE', '#ff8a1f', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:#0b1230;display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "DM Mono";letter-spacing:.05em;color:#f4ecd8;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ff8a1f', chipInk: '#0b1230', keywords: { 'spam': '#ff4d5e', 'loan': '#ff8a1f', 'Truecaller': '#3de0a8', 'TRAI': '#6a7bff', 'fraud': '#ff4d5e' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = []; for (var di = 1; di < SC.length; di++) DIPS.push(SC[di]);
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.15, 'ping'); ev(.85, 'ping'); ev(1.6, 'ping'); DIPS.forEach(function (d) { ev(d - .1, 'whoosh'); }); ev(S0('h2'), 'pop'); ev(S0('h3'), 'whoosh'); ev(S0('h3') + 1.1, 'slam');
  ev(SC[1] + .5, 'tick'); for (var a = 0; a < 6; a++) ev(SC[1] + .8 + a * .5, 'tick'); ev(S0('s3') + .8, 'pop');
  ev(SC[2] + .5, 'pop'); ev(S0('t2') + .2, 'ping'); ev(SC[3] + .4, 'slam'); ev(SC[3] + .7, 'slam'); ev(S0('r2') + .2, 'tick'); ev(S0('r3') + 1.4, 'slam');
  ev(S0('f1') + .5, 'pop'); ev(S0('f1') + 1.5, 'pop'); ev(S0('f2') + .2, 'ping'); for (var b = 0; b < 5; b++) ev(S0('f3') + 1.0 + b * .45, 'tick');
  ev(SC[5] + 1.0, 'pop'); ev(SC[5] + 2.5, 'pop'); ev(SC[5] + 4.0, 'buzz');
  ev(S0('x1') + 1.0, 'tick'); ev(S0('x1') + 2.4, 'tick'); ev(S0('x3') + 1.0, 'slam'); ev(S0('x4') + .1, 'pop');
  ev(SC[7] + (S1('c1') - SC[7]) * .5 + .3, 'slam'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.1, .08, .1, .1, .1, .1, .1, .1], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); e.camAt(sc, t); e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
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
