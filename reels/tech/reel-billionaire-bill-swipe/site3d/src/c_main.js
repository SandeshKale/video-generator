/* Part C (billionaire): DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['A BORED BILLIONAIRE · ONE OVERDUE BILL', 'UPLOAD · SWIPE · PAID', 'FAKE TWEET · REAL NERVE', 'LENS 1 · IS THE BILL REAL?', 'LENS 1 · TWO SWIPES, ONE BILL', 'SCALE · 3,428 vs 14 MILLION', 'LENS 2 · FEES AND GIFT-TAX LINES', 'TOP FORBES $839 B vs YOUR $1,500', 'US MEDICAL DEBT vs 1.1% OF WEALTH', 'LENS 3 · A DATING PROFILE FOR RENT', 'LENS 4 · WHO GETS FUNDED', 'PAY THE BILLER · NOT THE FEED'];
var HL = ['Billionaire ka <b>right swipe</b>', 'Bill upload. <b>Swipe.</b> Paid.', 'Elon ne tweet kiya hi <b>nahi</b>', 'Pehle: bill <b>asli</b> hai?', 'Ek bill, ek <b>hold</b>', 'Har billionaire ke <b>4,084 bill</b>', 'Daan par <b>fee</b> aur tax', 'Rent = <b>2 paise</b>', 'Paisa kam nahi, <b>plumbing</b> kam', 'Kiraya, billionaire ke <b>mood</b> par', 'Gareebi ka <b>For You page</b>', 'Seedha <b>biller</b> ko'];
var TAGS = ['ILLUSTRATIVE SCENE · NOT A REAL APP', 'ILLUSTRATIVE · THE IDEA AS DESCRIBED', 'SOURCE: LEAD STORIES, 3 NOV 2026', 'PER THEIR SITE · ILLUSTRATIVE', 'ILLUSTRATIVE · SAMPLE DATA, NOT A REAL BILL', 'FORBES 2026 · KFF VIA THE GUARDIAN · ROUGH MATH', 'ONLYBILLS PER THEIR SITE · TAX: OUR READING, ASK A CA', 'FORBES 2026 · OUR ARITHMETIC · LOG SCALE', 'KFF · FORBES 2026 · OUR ARITHMETIC', 'ILLUSTRATIVE · NOT A REAL APP', 'KFF HEALTH NEWS 2024 · U. WASHINGTON 2017', 'ILLUSTRATIVE SCENE'];
var hsc = D('', 'left:0;top:0;width:1080px;height:430px;background:linear-gradient(rgba(255,227,220,.92),rgba(255,227,220,.75) 55%,rgba(255,227,220,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:600 24px \'Geist Mono\';letter-spacing:.14em;color:#e03131;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#e03131"></i><span id="ebt"></span></div><div id="hl" style="font:900 56px/1.04 Unbounded;letter-spacing:-.02em;margin-top:14px;color:#2a0f2e"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "Geist Mono";letter-spacing:.06em;color:rgba(42,15,46,.72);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(255,227,220,0),rgba(255,227,220,.94) 22%,rgba(255,227,220,.94) 80%,rgba(255,227,220,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #2a0f2e;box-shadow:0 0 0 6px #e8b53a,0 10px 40px rgba(42,15,46,.35);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#2a0f2e;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#e03131;font:600 26px "Geist Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#2a0f2e', 190], ['share', 'SHARE', '#2fb872', 210], ['bell-ringing', 'SUBSCRIBE', '#e03131', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:#fff7ee;display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "Geist Mono";letter-spacing:.05em;color:#2a0f2e;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#e8b53a', chipInk: '#2a0f2e', keywords: { 'billionaire': '#e8b53a', 'billionaires': '#e8b53a', 'bill': '#ff7a70', 'swipe': '#2fb872', 'tweet': '#ff7a70', 'paisa': '#e8b53a' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = []; for (var di = 1; di < SC.length; di++) DIPS.push(SC[di]);
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.1, 'slam'); ev(SP('h1', .6), 'whoosh'); ev(SP('h1', .6) + .6, 'ping'); DIPS.forEach(function (d) { ev(d - .1, 'whoosh'); });
  var L1 = S1('p1') - SC[1]; ev(SC[1] + L1 * .36, 'pop'); ev(SC[1] + L1 * .88, 'slam'); ev(SC[1] + L1 * .9, 'ping');
  ev(WS('r1', 'tweet|ट्वीट|ट्विट', .8), 'slam'); ev(S0('r2') + .3, 'pop'); ev(S0('r2') + 1.9, 'buzz'); for (var i = 0; i < 3; i++) ev(SP('r2', .55) + i * .8, 'pop');
  var L3 = S1('t1') - SC[3]; for (var k = 0; k < 4; k++) ev(SC[3] + .2 + k * L3 * .17, 'tick'); ev(SC[3] + L3 * .45, 'buzz'); ev(SC[3] + L3 * .88, 'ping');
  var L4 = S1('t2') - SC[4]; ev(SC[4] + 1.4, 'whoosh'); ev(SC[4] + 1.7, 'slam'); ev(SC[4] + L4 * .5 + .3, 'pop'); for (var m = 0; m < 3; m++) ev(SC[4] + L4 * .65 + m * .3, 'tick');
  ev(SC[5] + .5, 'ping'); ev(SC[5] + 1.0, 'tick'); ev(SC[5] + 1.4, 'tick'); ev(SC[5] + (S1('t3') - SC[5]) * .5 + 1.4, 'ping');
  for (var s = 0; s < 10; s++) ev(SC[6] + .3 + s * .18 + .3, 'tick'); ev(SC[6] + 2.7, 'pop'); ev(S0('f1b') + .4, 'pop'); ev(SP('f1b', .72), 'buzz');
  var L7 = S1('f2') - SC[7]; for (var q = 0; q < 4; q++) ev(SC[7] + .4 + q * .25, 'tick'); ev(SC[7] + L7 * .38 + .8, 'whoosh'); ev(SC[7] + L7 * .66 + 1.4, 'ping');
  ev(SC[8] + .5, 'whoosh'); ev(SC[8] + 1.2, 'pop'); ev(SC[8] + 2.4, 'ping');
  var L9 = S1('m1') - SC[9]; [.38, .6, .8].forEach(function (f) { ev(SC[9] + L9 * f, 'whoosh'); ev(SC[9] + L9 * f + .3, 'buzz'); });
  var L10 = S1('e1') - SC[10]; ev(SC[10] + L10 * .22, 'pop'); ev(SC[10] + L10 * .45 + .5, 'tick'); ev(SC[10] + L10 * .8, 'buzz');
  var L11 = S1('c1') - SC[11]; ev(SC[11] + L11 * .3, 'whoosh'); ev(SC[11] + L11 * .3 + 1.3, 'slam'); ev(SC[11] + L11 * .3 + 1.5, 'ping');
  ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.1, .1, .1, .1, .1, .06, .08, .08, .1, .1, .1, .1], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); e.camAt(sc, t); e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:900;background:#e8b53a;color:#2a0f2e;padding:0 10px;border-radius:6px'; });
  hdr.style.opacity = ec ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo)); hl.style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (ec ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  var dip = 0; DIPS.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#ffe3dc'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 22; e.POST.bloom = .25; e.POST.vig = .3; e.POST.expo = 1.3; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
