/* Part C: DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, eo3 = e.eo3, sstep = e.sstep, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['A PUDDLE · A MISSING BUILDING', 'ONE BULB · BILLIONS OF RAYS', 'THE FLIP · EYE → PIXEL → WORLD', 'THE BOUNCE · WHAT THE BALL SHOWS', 'SHADOW RAY · LIGHT OR BLOCKED', 'BVH · BOXES INSIDE BOXES', '1968 → 2018 · FIFTY YEARS OF RAYS', 'RTX · 10 BILLION RAYS (CLAIMED)', '1 RAY OR 64 · NOISE AND DENOISE', 'REAL RAYS + GUESSES', 'THE WHOLE TRACE · ONE PIXEL'];
var HL = ['Puddle mein woh <b>building</b> jo screen par hai hi nahi', 'Ek bulb, arbon kirnein, <b>kam</b> kaam ki', 'Kiran <b>aankh</b> se, ulti taraf', 'Sheeshe se <b>uchhal</b> kar doosri kiran', 'Shadow bhi ek <b>sawaal</b> hai', 'Karodon triangles, <b>dibbe</b> ke andar dibbe', 'Idea <b>purana</b>, hardware naya', '10 arab kirnein? <b>Math</b> karo', 'Kam kirnein = <b>daane</b>', 'Asli kirnein + <b>andaza</b>', 'Puddle ka <b>raaz</b>'];
var hdr = D('', 'left:150px;top:150px;width:780px', '<div id="eb" style="font:600 25px \'Martian Mono\';letter-spacing:.14em;color:#ffc46b;display:flex;align-items:center;gap:14px;text-shadow:0 2px 10px #000"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#ffc46b;box-shadow:0 0 14px #ffc46b"></i><span id="ebt"></span></div><div id="hl" style="font:400 92px/.98 \'Instrument Serif\',serif;letter-spacing:-.01em;margin-top:16px;text-shadow:0 4px 22px rgba(0,0,0,.75)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "Martian Mono";letter-spacing:.06em;color:rgba(238,242,238,.62);text-shadow:0 2px 8px #000;white-space:nowrap', '');
hl.style.setProperty('--b', '1');
var TAGS = ['ILLUSTRATIVE SCENE', 'ILLUSTRATIVE · 520 RAYS DRAWN FOR BILLIONS', 'ILLUSTRATIVE SCENE', 'ILLUSTRATIVE SCENE', 'ILLUSTRATIVE SCENE', 'ILLUSTRATIVE MODEL · NOT A GAME SCENE', 'SOURCES: APPEL 1968 · WHITTED 1980 · D23 (CARS) · REPORTED', 'NVIDIA SIGGRAPH 2018 CLAIM · PEAK, NOT A BENCHMARK', 'REAL PATH TRACER · SAME SCENE · 4 SETTINGS', 'SCHEMATIC · NOT A MEASUREMENT', 'ILLUSTRATIVE SCENE'];
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(7,8,11,0),rgba(7,8,11,.9) 22%,rgba(7,8,11,.9) 80%,rgba(7,8,11,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #eef2ee;box-shadow:0 0 0 6px #ffc46b,0 0 60px 8px rgba(255,196,107,.45);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#eef2ee;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#ffc46b;font:600 26px "Martian Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#eef2ee', 190], ['share', 'SHARE', '#7fd6ff', 210], ['bell-ringing', 'SUBSCRIBE', '#ffc46b', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:rgba(7,8,11,.9);display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "Martian Mono";letter-spacing:.05em;color:#eef2ee;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ffc46b', chipInk: '#07080b', keywords: { 'ray': '#7fd6ff', 'pixel': '#fffaf0', 'kirnein': '#ffc46b', 'kiran': '#ffc46b', 'shadow': '#b07cff', 'BVH': '#7fd6ff', 'RTX': '#9be3b0', 'denoiser': '#9be3b0' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = [1, 2, 5, 6, 7, 8, 9, 10].map(function (k) { return SC[k]; }), tCta = S0('cta');
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.1, 'slam'); ev(3.4, 'ping'); DIPS.forEach(function (d) { ev(d - .1, 'whoosh'); });
  var t1 = SC[1] + .2; for (var i = 0; i < 8; i++) ev(t1 + i * .4, 'tick'); ev(WS('p1', 'आँख|आंख|पहुँचती', .8), 'ping'); ev(WS('p2', 'नुकसान|बड़ा', .4), 'buzz');
  var t2 = SC[2]; ev(t2 + .2, 'pop'); ev(t2 + .9, 'pop'); ev(WS('r1', 'बाहर|तरफ़|भेजो', .65), 'whoosh'); ev(WS('r1b', 'प्राइमरी', .9), 'card'); ev(S0('r2') + .2, 'ping');
  ev(SC[3] + .3, 'pop'); ev(WS('b1', 'उछलकर|उछल', .25), 'whoosh'); ev(WS('b1', 'उछलकर|उछल', .25) + 1.0, 'pop'); ev(WS('b1', 'पडल|पुडल|पड्डल|पडल्', .8), 'ping');
  ev(SC[4] + .1, 'pop'); ev(SC[4] + .3, 'card'); ev(WS('s1', 'छाया', .45), 'buzz'); ev(WS('s1', 'रोशनी', .8), 'ping');
  var v2 = S0('v2'); for (var k = 0; k < 8; k++) ev(S0('v1') + .8 + k * .4, 'tick'); ev(v2 + .2, 'card'); for (var L = 0; L <= 6; L++) ev(v2 + 1.0 + L * .85, 'pop'); ev(v2 + 7.0, 'ping');
  ev(WS('y1', 'अड़सठ|अडसठ', .12), 'pop'); ev(WS('y1', 'व्हिटेड|विटेड|टर्नर', .4), 'pop'); ev(WS('y1', 'कार्स|कारस', .8), 'pop'); for (var m = 0; m < 6; m++) ev(WS('y1', 'कार्स|कारस', .8) + .8 + m * .35, 'tick'); ev(WS('y1', 'सत्रह|सतरह', .93) + 1.4, 'pop');
  ev(WS('y2b', 'अरब|दस', .8), 'card'); for (var n = 0; n < 6; n++) ev(WS('y2b', 'अरब|दस', .8) + n * .15, 'tick'); ev(WS('m1', 'फ़ुल|फुल', .15), 'pop'); ev(WS('m1', 'करोड़', .62), 'pop'); ev(WS('m1', 'अस्सी', .92), 'ping');
  var n1 = S0('n1'); ev(n1 + .1, 'pop'); ev(WS('n1', 'दाने|दाना', .3), 'pop'); ev(WS('n1', 'दाने|दाना', .3) + 1, 'pop'); var dn = WS('n1', 'डीनॉइज़र|डिनोइज़र|डीनोइज़र', .72); ev(dn + .15, 'card'); ev(dn + .7, 'whoosh'); ev(dn + 1.6, 'ping');
  ev(WS('e1', 'असली|असल', .45), 'ping'); ev(WS('e1', 'अंदाज़ा|अंदाजा', .8), 'pop'); ev(WS('e1', 'पुराने', .4), 'whoosh');
  var f1 = WS('f1', 'उल्टी|उल्टा', .45); ev(f1, 'whoosh'); ev(f1 + 1.0, 'whoosh'); ev(f1 + 2.5, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्सक्राइब|सबस्क्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.2, .12, .1, .1, .1, .1, .12, .12, .06, .08, .2], FOC = { 8: 20, 9: 14 };
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t);
  GR.forEach(function (g) { g.visible = false; }); window.__lbAll && 0; e.hideLabels();
  S.fog = null; SCN[sc](t); e.camAt(sc, t); e.applyCam(); var hv = (t - SC[sc]) < 4.2 && !(sc === 10 && t > S0('cta') - 1); SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:400;background:#ffc46b;color:#07080b;padding:0 12px;border-radius:2px;text-shadow:none'; });
  hdr.style.opacity = (sc === 10 && t >= tCta - .1) ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo * 1 + 0)); hdr.querySelector('#hl').style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u) * (sc === 10 && t >= tCta - .1 ? 0 : 1);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (sc === 10 && t >= tCta - .1 ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); }, ec = sc === 10 && t >= tCta - .1;
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्सक्राइब|सबस्क्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  var dip = 0; DIPS.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#07080b'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 22; e.POST.bloom = sc === 8 ? .6 : 1.0; e.POST.seed = (t * 37) % 97; e.POST.fade = ec ? .0 : 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
