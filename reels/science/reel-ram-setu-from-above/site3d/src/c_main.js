/* Part C: DOM strip (eyebrow, step tracker, captions, end card), dips, __seek */
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function E(cls, css, html) { var e = document.createElement('div'); e.className = cls; e.style.cssText = css; e.innerHTML = html || ''; ov.appendChild(e); return e; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['// PALK STRAIT · FROM ORBIT', '// SENTINEL-2 · THE PALE LINE', '// 0.02 % ABOVE SEA LEVEL', '// ICESat-2 · LASER BATHYMETRY', '// 29 KM OR 48 KM?', '// WHAT THE SEABED SHAPE SAYS', '// MEASURED VS NOT MEASURED', '// 29 KM · 99.98 % · LASER-MAPPED'];
var STEPOF = [0,0,0,0,0,0,0,0], STEPCOL = ['#ff7a1a'];
var eye = E('mono', 'left:156px;top:166px;color:#3fd0c9;font:600 23px "Martian Mono",monospace;letter-spacing:.1em;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,.9)', ''), dot = E('', 'left:150px;top:0;width:0;height:0', '');
var chips = [];
var scrim = E('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(6,20,31,0),rgba(6,20,31,.88) 22%,rgba(6,20,31,.88) 80%,rgba(6,20,31,0))', ''), pf = E('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f2f4ff;box-shadow:0 0 0 6px #ff7a1a,0 0 60px 8px rgba(255,45,120,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = E('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f2f4ff;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', '@sandeshexplains'), hs = E('mono', 'left:385px;top:988px;color:#e8d9a8;font:400 26px "Martian Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#eef2ee', 190], ['share', 'SHARE', '#3fd0c9', 210], ['bell-ringing', 'SUBSCRIBE', '#ff7a1a', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return E('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:rgba(7,8,12,.9);display:flex;align-items:center;justify-content:center;gap:10px;font:400 28px "Martian Mono";letter-spacing:.05em;color:#f2f4ff;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#f2f4ff', chipInk: '#06141f', keywords: { 'percent': '#ff7a1a', 'laser': '#3fd0c9', 'kilometre': '#e8d9a8' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var dipAt = SC.slice(1, 8);
var tCta = S0('cta');
/* sound events */
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(WS('h1', 'निन्यानवे', .9), 'slam'); ev(S0('h2') + .3, 'pop'); ev(SC[1] + 1, 'pop'); ev(S0('p1') + 1.8, 'ping'); ev(WS('b1', 'शुन्य|दश्मलव', .55), 'slam'); ev(S0('b2') + .1, 'card'); ev(SC[3] + 1, 'whoosh'); for (var k = 0; k < 14; k++) ev(SC[3] + 1 + k * .5, 'tick'); ev(S0('m2') + .2, 'pop'); ev(SC[4] + 2, 'pop'); ev(S0('l2') + .2, 'card'); ev(S0('r1') + .5, 'pop'); ev(S0('r2'), 'ping'); ev(S0('e1') + .8, 'tick'); ev(S0('e1') + 1.5, 'tick'); ev(S0('f1') + 1, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var tCta = S0('cta');
/* sound events (the audio script reads window.EV through tools/events.mjs, so SFX land on the same words as the picture) */
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }

window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t);
  GR.forEach(function (g) { g.visible = false; }); LBL.forEach(function (l) { l.visible = false; });
  motes.position.y = 0; R.toneMappingExposure = 1.05;
  SCN[sc](t); camAt(sc, t); applyCam(); clampLabels();
  /* strip */
  var e = EYE[sc]; eye.textContent = e; eye.style.color = '#3fd0c9'; eye.style.opacity = clamp((t - SC[sc]) / .4 + .3);   /* end card */
  var ue = function (x) { return clamp((t - x) / .35); }, ec = sc === 7 && t >= tCta - .1;
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0; [pf, hn, hs].forEach(function (x, i) { var u = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = u > 0 ? 'block' : 'none'; x.style.opacity = u; x.style.transform = 'translateY(' + ((1 - eo3(u)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेर', .6), WS('cta', 'सब्स्क्राइब', .75)]; btns.forEach(function (b, i) { var u = ec ? ue(bt[i] - .1) : 0; b.style.display = u > 0 ? 'flex' : 'none'; b.style.opacity = u; var pulse = u >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(u); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  /* dips (hide the cut) */
  var dip = 0; dipAt.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#06141f'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  if (!window.__skipRender) R.render(S, C);
};
Promise.all(['400 40px "Archivo Black"', '600 30px Inter', '800 30px Inter', '600 30px "Martian Mono"'].map(function (f) { return document.fonts.load(f); })).then(function () { var im = new Image(); im.onload = im.onerror = function () { var w = function () { if (regionReady) window.__ready = true; else setTimeout(w, 80); }; w(); }; im.src = 'img/profile.jpg'; });
})();
