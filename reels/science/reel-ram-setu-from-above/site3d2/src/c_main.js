/* Ram Setu v2 "Survey Window" — Part C: DOM instruments (eyebrow, readout line, captions), end card (nerdlogic.co), sound events, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, B = window.B;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var LIME = '#b4f000', FR = '#d4fff0', AM = '#ffb347';
var EYE = ['PALK STRAIT · FROM ORBIT', 'THE PALE LINE · WHAT A PHOTO SHOWS', 'ABOVE SEA LEVEL · 0.02 %', 'ICESat-2 · LASER RETURNS', 'TWO LENGTHS · ONE CHAIN', 'THE SHAPE UNDER THE WATER', 'MEASURED · NOT MEASURED', 'THE CHAIN · MAPPED BY LASER'];
var RD = ['NASA HLS · 15 MAR 2024 · VERTICAL x120', 'NASA HLS (SENTINEL-2) · 30 m · TRUE SCALE 1 UNIT = 1 km', 'VOLUME OF THE SHOAL CHAIN · SCHEMATIC', 'ATL03 PHOTONS · 4 TRACKS · REAL POSITIONS', 'RULERS DRAWN ON THE REAL IMAGE', 'RELIEF = ILLUSTRATIVE · PHOTONS = REAL', 'SURVEY WINDOW · THE REST IS UNMEASURED', 'REPORTED NUMBERS · SOURCES IN THE CAPTION'];
var hsc = D('', 'left:0;top:0;width:1080px;height:330px;background:linear-gradient(rgba(5,8,10,.92),rgba(5,8,10,.55) 65%,rgba(5,8,10,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div style="font:600 24px \'IBM Plex Mono\';letter-spacing:.12em;color:' + AM + ';display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:14px;height:14px;background:' + AM + ';border-radius:50%;box-shadow:0 0 12px ' + AM + '"></i><span id="ebt"></span></div><div id="rd" style="font:600 19px \'IBM Plex Mono\';letter-spacing:.06em;color:rgba(212,255,240,.78);margin-top:12px;white-space:nowrap"></div>'), ebt = hdr.querySelector('#ebt'), rd = hdr.querySelector('#rd');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(5,8,10,0),rgba(5,8,10,.93) 22%,rgba(5,8,10,.93) 80%,rgba(5,8,10,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:6px solid ' + LIME + ';box-shadow:0 0 0 6px #05080a,0 0 44px 6px rgba(180,240,0,.45);overflow:hidden;background:#0a0f1d', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:924px;font:800 62px/1 Inter;letter-spacing:-.02em;color:#eaffd0;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', 'nerdlogic<span style="color:' + LIME + '">.co</span>'), hs = D('', 'left:385px;top:1004px;color:' + FR + ';font:600 24px "IBM Plex Mono";letter-spacing:.14em', 'NERDS EXPLAIN · LOGIC EXPLAINS');
var btns = [['thumb-up', 'LIKE', FR, 190], ['share', 'SHARE', FR, 210], ['bell-ringing', 'SUBSCRIBE', LIME, 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:12px;background:rgba(5,8,10,.94);display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "IBM Plex Mono";letter-spacing:.05em;color:' + c[2] + ';box-sizing:border-box', ico(c[0], 34, c[2], 1.9) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#d4fff0', chipInk: '#05080a', keywords: { 'percent': AM, 'laser': FR, 'kilometre': AM, 'nerdlogic': LIME } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(WS('h1', 'निन्यानवे', .9), 'slam'); ev(.2, 'whoosh'); ev(S0('h2') + .3, 'pop'); ev(SC[1] + 1, 'pop'); ev(S0('p1') + 1.8, 'ping'); ev(WS('b1', 'शुन्य|दश्मलव', .55), 'slam'); ev(S0('b2') + .1, 'card'); ev(SC[3] + 1.2, 'whoosh'); for (var k = 0; k < 16; k++) ev(SC[3] + 1.6 + k * .45, 'tick'); ev(S0('m2') + .2, 'pop'); ev(SC[4] + 2, 'pop'); ev(S0('l2') + .2, 'card'); ev(S0('r1') + .5, 'pop'); ev(S0('r2'), 'ping'); ev(S0('e1') + .8, 'tick'); ev(S0('e1') + 1.5, 'tick'); ev(S0('f1') + 1, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 2;
  e.hideLabels(); SCN[sc](t); e.camAt(sc, t); e.applyCam(); var ec = last && t >= tCta - .1; SAFE.t = 290; e.clampLabels();
  var u = clamp((t - SC[sc]) / .5); ebt.textContent = EYE[sc]; rd.textContent = RD[sc]; hdr.style.opacity = ec ? 0 : (sc === 0 ? 1 : clamp(.4 + .6 * u)); hsc.style.opacity = ec ? 0 : 1;
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  flash.style.opacity = 0; capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.half = 0; e.POST.focus = cp.distanceTo(cl); e.POST.aper = .035; e.POST.maxR = 8; e.POST.bloom = .38; e.POST.vig = .4; e.POST.expo = 1.0; e.POST.grain = .012; e.POST.ca = .0006; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
function loadImg(src) { return new Promise(function (r) { var im = new Image(); im.onload = function () { r(im); }; im.onerror = function () { r(null); }; im.src = src; }); }
Promise.all([loadImg('img/hls.jpg'), loadImg('img/profile.jpg')]).then(function (a) { if (a[0]) B.buildPlate(a[0]); window.__ready = true; });
})();
