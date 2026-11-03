/* Part C: DOM strip (eyebrow, step tracker, captions, end card), dips, __seek */
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function E(cls, css, html) { var e = document.createElement('div'); e.className = cls; e.style.cssText = css; e.innerHTML = html || ''; ov.appendChild(e); return e; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['// SAMAY RAINA LIVE · PRE-SALE', '// 1 LAKH ÷ 1 HOUR', '// STEP 1 · SPREAD THE SALE', '// STEP 2 · THE WAITING ROOM', '// STEP 3 · ONE SEAT, ONE HOLD', '// STEP 4 · ONE KEY, ONE CHARGE', '// STEP 5 · BOTS AT THE DOOR', '// WHAT IS KNOWN VS STANDARD', '// 12,569 AHEAD, REREAD'];
var STEPOF = [0, 0, 1, 2, 3, 4, 5, 0, 0], STEPCOL = ['#22e1ff', '#22e1ff', '#ffb800', '#9dff3a', '#ff3b30'];
var eye = E('mono', 'left:156px;top:166px;color:#22e1ff;font:600 23px "Cutive Mono",monospace;letter-spacing:.1em;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,.9)', ''), dot = E('', 'left:150px;top:0;width:0;height:0', '');
var chips = [1, 2, 3, 4, 5].map(function (n, i) { return E('chip', 'left:' + (918 - 5 * 44 + i * 44) + 'px;top:160px;width:38px;height:38px;border:3px solid ' + STEPCOL[i] + ';border-radius:6px;box-sizing:border-box;text-align:center;font:400 22px/32px Bungee;color:#f2f4ff;background:rgba(7,8,12,.85)', n); });
var pf = E('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f2f4ff;box-shadow:0 0 0 6px #ff2d78,0 0 60px 8px rgba(255,45,120,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = E('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f2f4ff;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', '@sandeshexplains'), hs = E('mono', 'left:385px;top:988px;color:#ffb800;font:400 26px "Cutive Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#9dff3a', 190], ['share', 'SHARE', '#22e1ff', 210], ['bell-ringing', 'SUBSCRIBE', '#ff2d78', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return E('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:rgba(7,8,12,.9);display:flex;align-items:center;justify-content:center;gap:10px;font:400 28px "Cutive Mono";letter-spacing:.05em;color:#f2f4ff;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#f2f4ff', chipInk: '#07080c', keywords: { lakh: '#ff2d78', ghante: '#ffb800', seat: '#9dff3a', crash: '#ff3b30' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var dipAt = SC.slice(1, 9);
var tCta = S0('cta');
window.__reelDurationSec = END; window.EV = []; window.__SC = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t);
  G.forEach(function (g) { g.visible = false; }); TK.visible = TK2.visible = false; LBL.forEach(function (l) { l.visible = false; });
  motes.position.y = 0; R.toneMappingExposure = 1.05;
  SCN[sc](t); camAt(sc, t); applyCam(); clampLabels();
  /* strip */
  var e = EYE[sc]; eye.textContent = e; eye.style.color = STEPOF[sc] ? STEPCOL[STEPOF[sc] - 1] : '#22e1ff'; eye.style.opacity = clamp((t - SC[sc]) / .4 + .3); chips.forEach(function (c, i) { var on = STEPOF[sc] === i + 1, past = STEPOF[sc] > i + 1; c.style.display = sc >= 2 && sc <= 6 ? 'block' : 'none'; c.style.background = on ? STEPCOL[i] : 'rgba(7,8,12,.85)'; c.style.color = on ? '#07080c' : '#f2f4ff'; c.style.opacity = on ? 1 : (past ? .9 : .45); });
  /* end card */
  var ue = function (x) { return clamp((t - x) / .35); }, ec = sc === 8 && t >= tCta - .1;
  [pf, hn, hs].forEach(function (x, i) { var u = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = u > 0 ? 'block' : 'none'; x.style.opacity = u; x.style.transform = 'translateY(' + ((1 - eo3(u)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर', .6), WS('cta', 'सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var u = ec ? ue(bt[i] - .1) : 0; b.style.display = u > 0 ? 'flex' : 'none'; b.style.opacity = u; var pulse = u >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(u); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  /* dips (hide the cut) */
  var dip = 0; dipAt.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#07080c'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  if (!window.__skipRender) R.render(S, C);
};
Promise.all(['400 40px Bungee', '600 30px Inter', '800 30px Inter', '400 30px "Cutive Mono"'].map(function (f) { return document.fonts.load(f); })).then(function () { var im = new Image(); im.onload = im.onerror = function () { window.__ready = true; }; im.src = 'img/profile.jpg'; });
})();
