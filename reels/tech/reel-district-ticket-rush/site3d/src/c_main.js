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
/* sound events (the audio script reads window.EV through tools/events.mjs, so SFX land on the same words as the picture) */
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { var tb;
  ev(WS('h1', 'घंटे', .4), 'pop'); ev(WS('h1', 'डिस्ट्रिक्ट', .75), 'pop'); ev(S0('h2') + .1, 'pop'); ev(WS('h3', 'क्रैश', .0), 'slam'); ev(WS('h3', 'सिस्टम', .3), 'ping'); ev(WS('h3', 'टूटी', .5), 'pop'); ev(WS('h3', 'सीट', .75), 'pop'); ev(S1('h3') - 2.0, 'whoosh');
  ev(WS('n1', 'लाख', .45), 'pop'); ev(WS('n1', 'घंटा', .6), 'pop'); ev(WS('n1', 'अट्ठाईस', .85), 'ping'); ev(WS('n2', 'सर्वर', .5), 'ping'); var tS = WS('n3', 'सबका', .3); ev(tS - 2.2, 'rumble'); ev(tS + 1.6, 'buzz'); ev(WS('n3', 'एक', .35) + 1.5, 'card');
  tb = S0('s1b'); ev(SC[2] + .6, 'pop'); for (var k = 0; k < 10; k++) ev(tb - .6 + k * .7 + .3, 'tick'); ev(WS('s1b', 'व्हाट्सऐप', .9), 'ping'); ev(WS('s1b', 'प्री', .1), 'card'); ev(WS('s1c', 'टिकटमास्टर', .2), 'pop');
  ev(WS('q1', 'वेटिंग', .8), 'card'); ev(WS('q2', 'आगे', .5), 'ping'); ev(WS('q3', 'पहले', .15), 'card'); for (k = 0; k < 3; k++) ev(WS('q3', 'कुकी', .5) + k * .5, 'tick'); ev(WS('q4', 'सेकंड', .5), 'ping'); ev(WS('q4', 'बाँटो', .5), 'pop'); ev(WS('q5', 'बग', .75) - 1.5, 'slam'); ev(Math.max(WS('q5', 'काम', .9), WS('q5', 'बग', .75) + .7), 'ping');
  var tTy = WS('t2', 'रेडिस', .6); ev(WS('t2', 'होल्ड', .5) + .2, 'card'); for (k = 0; k < 14; k++) ev(tTy + k * .15, 'tick'); ev(WS('t3', 'एक्स', .0) - .1, 'card'); ev(WS('t3', 'ओके', .45), 'ping'); ev(WS('t3', 'निल', .75), 'buzz'); ev(WS('t4', 'टाइमर', .15), 'card'); ev(WS('t4', 'छूट', .55), 'drop');
  var t1x = WS('p1', 'दबाया', .35); ev(t1x, 'tick'); ev(WS('p1', 'अटका', .6), 'buzz'); ev(WS('p1', 'फिर', .75), 'tick'); ev(WS('p1', 'फिर', .75) + 1.1, 'ping'); ev(WS('p2', 'आइडेम्पोटेंसी', .35), 'card'); ev(WS('p2', 'एक', .75), 'slam'); ev(S0('p3'), 'pop'); ev(S0('p4'), 'ping');
  var tE = S0('e1'); ev(WS('e1', 'बॉट्स', .0) + .3, 'buzz'); ev(WS('e1', 'टिकटमास्टर', .2), 'pop'); ev(WS('e1', 'रेट', .85), 'card');
  var r1 = S0('r1'); ev(r1 + .1, 'pop'); for (k = 0; k < 4; k++) ev(WS('r1', 'स्क्रीनशॉट', .5) - 2.8 + k * .75, 'tick'); for (k = 0; k < 4; k++) ev(WS('r1', 'इंडस्ट्री', .5) - 1.6 + k * .75, 'tick'); ev(WS('r1', 'अनवेरिफ़ाइड', .93) - .4, 'slam');
  ev(WS('r2', 'सीट', .85) + 1.0, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर', .6), 'ping'); ev(WS('cta', 'सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });

window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__SC = SC; window.__ready = false;
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
