/* Part C (Nvidia case file): DOM header, captions, end card, sound events, stamp shake/flash, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['FILE NVDA-1108 · FOUR STATUS STAMPS', 'EXHIBIT 1 · THE LETTER', 'EXHIBIT 2 · THE ALLEGATION', 'EXHIBIT 3 · EVERYONE\'S EVIDENCE', 'EXHIBIT 4 · WHY THE MARKET FLINCHED', 'EXHIBIT 5 · WHAT IS NOT KNOWN', 'CASE STATUS · OPEN'];
var HL = ['Sabke paas <b>bayaan</b>, saboot nahi', 'Jo <b>pakka</b> hai', 'Ab shuru hota hai <b>reportedly</b>', 'Chaar bayaan, saboot <b>khaali</b>', 'Share lagbhag <b>5%</b> gira', 'Abhi tak <b>pata nahi</b>', 'Pehle dekho <b>kisne kaha</b>'];
var TAGS = ['AS REPORTED · SOURCES IN THE CAPTION', 'AP / THE NEURON · 8 NOV 2026 · AS REPORTED', 'NYT VIA AP · MEMO NOT PUBLISHED · DENIED BY CHINA', 'AP · THE NEURON · AS REPORTED', 'AP · PRE-MARKET, MON 9 NOV · APPROX.', 'THE NEURON · NO CHARGE · NO PUBLIC FINDING', 'CASE REMAINS OPEN'];
var hsc = D('', 'left:0;top:0;width:1080px;height:420px;background:linear-gradient(rgba(234,217,180,.94),rgba(234,217,180,.8) 60%,rgba(234,217,180,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:700 23px \'JetBrains Mono\';letter-spacing:.12em;color:#2c4bd8;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#e1362f"></i><span id="ebt"></span></div><div id="hl" style="font:400 56px/1.05 \'Alfa Slab One\';letter-spacing:-.02em;margin-top:14px;color:#13172a;text-shadow:5px 5px 0 rgba(44,75,216,.55)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:700 20px "JetBrains Mono";letter-spacing:.05em;color:rgba(19,23,42,.8);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(234,217,180,0),rgba(234,217,180,.95) 22%,rgba(234,217,180,.95) 80%,rgba(234,217,180,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #13172a;box-shadow:0 0 0 6px #ffb300,8px 10px 0 rgba(44,75,216,.6);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#13172a;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#2c4bd8;font:700 26px "JetBrains Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#1d9a69', 190], ['share', 'SHARE', '#7b4bd0', 210], ['bell-ringing', 'SUBSCRIBE', '#e1362f', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:5px solid ' + c[2] + ';border-radius:10px;background:#f3ead2;display:flex;align-items:center;justify-content:center;gap:10px;font:700 25px "JetBrains Mono";letter-spacing:.05em;color:' + c[2] + ';box-sizing:border-box;box-shadow:5px 5px 0 rgba(19,23,42,.35)', ico(c[0], 34, c[2], 2) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ffb300', chipInk: '#13172a', keywords: { 'confirmed': '#1d9a69', 'reportedly': '#7b4bd0', 'DENIED': '#e1362f', 'saboot': '#ffb300', 'memo': '#ffb300', 'China': '#e1362f' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = [];
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { var st = window.__STAMPS_T || []; ev(S0('h1') + .02, 'pop');
  ev(S0('c1'), 'whoosh'); for (var k = 0; k < 9; k++) ev(S0('c1') + .6 + k * .28, 'tick'); ev(S0('n1'), 'whoosh'); ev(S0('e1') - .1, 'whoosh'); ev(S0('e1') + .6, 'pop'); ev(WS('e1', 'चीन', .5) - .2, 'pop'); ev(WS('e1', 'सिंगापुर', .5) - .2, 'pop'); ev(S0('e2') + .3, 'pop'); ev(S0('s1') - .1, 'whoosh'); for (var b = 0; b < 6; b++) ev(S0('s1') + .3 + b * .18, 'tick'); ev(S0('s2') + .3, 'slam');
  ev(S0('u1') - .1, 'whoosh'); ev(S0('u1') + 1.2, 'tick'); ev(S0('u1') + 4.2, 'tick'); ev(S0('u1') + 7.2, 'tick'); ev(S0('r1') - .1, 'whoosh'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
var AP = [.2, .18, .18, .18, .2, .2, .18], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); if (window.__camO) e.setCam(window.__camO.p, window.__camO.l, window.__camO.f); else { e.camAt(0, t); var sx = 0, sy = 0, fl = 0; (window.SHAKES || []).forEach(function (s) { var d = t - s.t; if (d >= 0 && d < .7) { var a = s.a * Math.exp(-d * 9); sx += a * Math.sin(d * 90); sy += a * Math.cos(d * 77 + 1); fl = Math.max(fl, .35 * Math.exp(-d * 16) * (s.a > .4 ? 1 : .6)); } }); e.camP.x += sx; e.camP.y += sy; e.camL.x += sx; e.camL.y += sy; window.__fl = fl; }
  e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:400;background:#ffb300;color:#13172a;padding:0 10px;text-shadow:none;box-shadow:4px 4px 0 rgba(44,75,216,.55)'; });
  hdr.style.opacity = ec ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo)); hl.style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (ec ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  flash.style.background = '#fffaf0'; flash.style.opacity = window.__fl || 0;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 14; e.POST.bloom = .12; e.POST.vig = .3; e.POST.expo = 1.05; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
