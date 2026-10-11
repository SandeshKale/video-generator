// "AI can't read." — Letterpress Tokenizer. Every layer is a pure function of t; word times from the avatar clips (timing.js),
// token splits are real o200k / cl100k output (tok.js, timing.js PG). window.EV lists every on-screen event for the score/SFX.
(function () {
'use strict';
var SC = window.SC, WD = window.WD, PG = window.PG, TOK = window.TOK, DUR = window.TOTAL; window.__reelDurationSec = DUR;
var PAST = ['#ffc79a', '#9be8cf', '#c4b5ff', '#9fd6ff'], INK = '#17171a', NP = '#f3efe4', PP = '#fbf8f0', RED = '#e8432e', GR = '#6b6b70';
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function ec(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function seg(t, a, b) { return sm((t - a) / (b - a)); }
function key(k) { return k.replace(/[.,?!:…]/g, '').toLowerCase(); }
function wtp(p, k, n) { k = key(k); var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } throw new Error('word ' + p + ' ' + k); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var st = document.getElementById('st');
function D(css, html, par, cls) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; if (cls) e.className = cls; (par || st).appendChild(e); return e; }
function ic(n, sz, col, sw) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" style="flex:none;display:block">' + window.IC[n] + '</svg>'; }
function logo(n, w, h) { return '<span class="lg" style="display:inline-block;width:' + w + 'px;height:' + h + 'px">' + window.LOGO[n] + '</span>'; }
function vis(t, sp) { return sp.replace(/^ /, '␣'); }
function chipHtml(arr, fs, o) { o = o || {}; return arr.map(function (x, i) { var s = o.raw ? esc(x[0]) : esc(x[0]).replace(/^ /, o.keepSpace ? '␣' : ''); return '<span class="tk" style="background:' + PAST[(i + (o.c0 || 0)) % 4] + ';font:700 ' + fs + 'px/1.25 ' + (o.font || 'IN') + ';' + (o.border ? 'border:3px solid ' + INK + ';box-shadow:4px 4px 0 ' + INK + ';margin:0 6px 8px 0' : '') + '">' + s + '</span>'; }).join(''); }
// press entrance: a letterpress punch (no bounce): fast fade, slight scale-down + drop
function press(el, t, at, o) { o = o || {}; var u = ec((t - at) / (o.d || .26)); el.style.opacity = t < at ? 0 : clamp((t - at) / .07, 0, 1); el.style.transform = 'translate(' + ((o.x || 0) * (1 - u)) + 'px,' + ((o.y == null ? -18 : o.y) * (1 - u)) + 'px) rotate(' + (o.r || 0) + 'deg) scale(' + (1 + (o.s == null ? .08 : o.s) * (1 - u)) + ')'; }
function pop(t, at, d) { var x = t - at; return x < 0 || x > (d || .3) ? 0 : 1 - x / (d || .3); }
function typed(s, t, at, cps) { return s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - at) * (cps || 18))))); }
var EV = []; function E(k, t, o) { var e = { k: k, t: +t.toFixed(3) }; for (var q in (o || {})) e[q] = o[q]; EV.push(e); }
var scenes = [], ebs = [];
function scene() { var s = D('left:0;top:0;width:1080px;height:1920px', null, st, 'sc'); scenes.push(s); return s; }
function eb(par, txt) { var e = D('', txt, par, 'eb'); ebs.push(e); return e; }
var S = []; for (var i = 0; i < 11; i++) S.push(scene());
function h2(par, a, b, o) { o = o || {}; var fs = o.fs || 88; var l1 = D('left:150px;top:236px;font-size:' + fs + 'px', a, par, 'h' + (o.dk ? ' dk' : '')); var l2 = D('left:150px;top:' + (236 + fs * 1.04) + 'px;font-size:' + fs + 'px', '<span class="k" style="background:' + (o.hl || PAST[0]) + '">' + b + '</span>', par, 'h' + (o.dk ? ' dk' : '')); if (o.dk) l2.firstChild.style.color = INK; return [l1, l2]; }
function tag(par, txt, css) { return D(css || 'left:150px;top:1252px', txt, par, 'tag'); }
var A = [];
// ================= S1 · hook: the message you typed breaks into tokens, then numbers =================
A[0] = (function (P) { var s = {};
  s.stamp = D('left:182px;top:182px;background:' + RED + ';color:' + NP + ';font:400 46px/1 AS;padding:12px 18px;box-shadow:6px 6px 0 ' + INK + ';z-index:7', 'NEVER READ.', P);
  s.comp = D('left:150px;top:950px;width:768px;height:118px;background:#fff;border:3px solid ' + INK + ';border-radius:60px;box-shadow:8px 8px 0 ' + INK, '<div style="position:absolute;left:34px;top:14px;font:600 18px/1 PM;color:#9a9a9f;letter-spacing:.1em">YOU TYPED</div><div class="tx" style="position:absolute;left:34px;top:44px;font:700 46px/1 IN;color:' + INK + ';text-decoration-color:' + RED + ';text-decoration-thickness:4px">explain my phone bill</div><div style="position:absolute;right:18px;top:18px;width:76px;height:76px;border-radius:50%;background:' + INK + ';display:flex;align-items:center;justify-content:center">' + ic('arrow-right', 44, NP, 2.4).replace('<svg ', '<svg style="transform:rotate(-90deg)" ') + '</div>', P);
  var xs = [150, 252, 404, 546, 742], ys = [1094, 1118, 1098, 1122, 1092], rot = [-8, 5, -4, 7, -6], sx = [184, 214, 330, 390, 520];
  s.ch = TOK.chat.map(function (tk, i) { var d = D('left:' + xs[i] + 'px;top:' + ys[i] + 'px;text-align:center', '<div class="tk" style="background:' + PAST[i % 4] + ';font:700 42px/1.1 IN;border:3px solid ' + INK + ';box-shadow:5px 5px 0 ' + INK + '">' + esc(tk[0]).replace(/^ /, '␣') + '</div><div class="mono id" style="margin-top:10px;font-size:28px">' + tk[1] + '</div>', P); d.x = xs[i]; d.y = ys[i]; d.r = rot[i]; d.sx = sx[i]; return d; });
  s.tg = tag(P, '"explain my phone bill" → 5 TOKENS → 5 NUMBERS', 'left:150px;top:1240px');
  var tN = wtp(1, 'never'), tT = wtp(1, 'not');
  E('stamp', tN); s.ch.forEach(function (c, i) { E('clack', tN + .12 + i * .07); E('tick', tT + i * .09); }); E('pop', wtp(1, 'one'));
  s.u = function (t) { press(s.stamp, t, tN, { r: -3, s: .4, y: 0, d: .2 }); s.comp.querySelector('.tx').style.textDecoration = t >= tN + .1 ? 'line-through' : 'none'; s.comp.querySelector('.tx').style.color = t >= tN + .1 ? '#c9c4b8' : INK;
    s.ch.forEach(function (c, i) { var at = tN + .12 + i * .07, u = ec((t - at) / .4); c.style.opacity = t < at ? 0 : 1; c.style.transform = 'translate(' + ((c.sx - c.x) * (1 - u)) + 'px,' + ((995 - c.y) * (1 - u)) + 'px) rotate(' + (c.r * u) + 'deg) scale(' + (.7 + .3 * u) + ')'; c.querySelector('.id').style.opacity = t >= tT + i * .09 ? 1 : 0; });
    press(s.tg, t, wtp(1, 'one'), { y: 10 }); return 0; };
  return s; })(S[0]);
// ================= S2 · Sand | esh (Blender letterpress block) =================
var SANDF = []; for (var q = 0; q < 12; q++) SANDF.push('3d/sand_' + (q < 10 ? '0' : '') + q + '.png');
A[1] = (function (P) { var s = {}; eb(P, '// SAND + ESH = ME');
  s.l1 = D('left:150px;top:236px', 'TO AI, I\'M', P, 'h'); s.l2 = D('left:150px;top:328px', '"SANDESH"?', P, 'h'); s.l3 = D('left:150px;top:328px', '<span class="k">2 TOKENS.</span>', P, 'h');
  s.blk = D('left:40px;top:420px;width:1000px;height:640px;background-size:contain;background-repeat:no-repeat;background-position:center;-webkit-mask:radial-gradient(ellipse 52% 50% at 50% 48%,#000 70%,transparent 100%)', '', P);
  s.tg = tag(P, 'MEASURED · o200k · 11 OCT 2026', 'left:150px;top:966px');
  s.pr = D('left:150px;top:1020px;width:440px;padding:18px 20px', '<div class="lab">"Sandesh" →</div><div style="margin-top:10px;font:700 46px/1.1 IN"><span class="tk" style="background:#ffc79a">Sand</span><span class="tk" style="background:#9be8cf">esh</span></div><div class="mono" style="margin-top:10px;font-size:26px">54311 · 8382</div>', P, 'proof');
  var tS = wtp(1, 'sand'), tE = wtp(1, 'esh'), tSd = wtp(1, 'sandesh');
  E('clack', tE - .05); E('thunk', tE - .02); E('pop', tE + .15); E('tick', wtp(1, 'two'));
  s.u = function (t) { press(s.l1, t, SC[1] + .05); press(s.l2, t, tSd, { y: 0 }); s.l2.style.opacity = t >= tSd && t < tE ? 1 : 0; press(s.l3, t, tE, { s: .25, y: 0 });
    var f = t < tS + .45 ? 0 : clamp((t - (tS + .45)) / .55, 0, 1) * 11; var fi = Math.round(f); if (s.blk.__f !== fi) { s.blk.__f = fi; s.blk.style.backgroundImage = 'url(' + SANDF[fi] + ')'; }
    press(s.blk, t, SC[1] + .1, { y: 30, s: .03 }); press(s.tg, t, SC[1] + .4, { y: 10 }); press(s.pr, t, tE + .15, { y: 24 }); return pop(t, tE - .02, .25) * .25; };
  return s; })(S[1]);
// ================= S3 · what it actually sees (photoreal type case + real token IDs) =================
A[2] = (function (P) { var s = {}; eb(P, '// WHAT IT ACTUALLY SEES');
  var hh = h2(P, 'IT SEES', 'TOKENS.', { dk: 1, hl: PAST[1] }); s.l1 = hh[0]; s.l2 = hh[1];
  s.strip = D('left:150px;top:470px;width:768px;padding:20px 22px', '<div class="lab">REAL SPLITS · o200k</div>' + [['ChatGPT', TOK.chatgpt], ['unbelievable', TOK.unb], ['Sandesh', TOK.sandesh]].map(function (r) { return '<div class="row" style="display:flex;align-items:center;gap:14px;margin-top:14px"><span class="mono" style="width:220px;font-size:26px">' + r[0] + '</span>' + ic('arrow-right', 30, INK, 2.4) + '<span style="font:700 36px/1 IN">' + chipHtml(r[1], 36) + '</span><span class="mono" style="margin-left:auto;font-size:22px;color:' + GR + '">' + r[1].length + '</span></div>'; }).join(''), P, 'proof');
  s.tab = D('left:150px;top:790px;width:768px;padding:18px 22px', '<div class="lab" style="display:flex;justify-content:space-between"><span>YOU TYPE</span><span>IT RECEIVES</span></div>' + TOK.conv.map(function (x, i) { return '<div class="rw" style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;height:44px"><span class="tk" style="background:' + PAST[i % 4] + ';font:700 32px/1.2 IN">' + esc(x[0]).replace(/^ /, '␣') + '</span><span class="mono id" style="font-size:32px">' + x[1] + '</span></div>'; }).join(''), P, 'proof');
  s.tg = tag(P, 'AI IMAGE · LETTERPRESS TYPE CASE', 'left:150px;top:1252px');
  s.rows = s.strip.querySelectorAll('.row'); s.trs = s.tab.querySelectorAll('.rw');
  var wk = ['little', 'chunks', 'of', 'text', 'turned', 'into', 'numbers']; s.wt = wk.map(function (k) { return wtp(2, k); });
  Array.prototype.forEach.call(s.rows, function (r, i) { E('clack', SC[2] + .35 + i * .35); }); s.wt.forEach(function (x) { E('tick', x + .22); });
  s.u = function (t) { press(s.l1, t, SC[2] + .05); press(s.l2, t, wtp(2, 'tokens'), { s: .25, y: 0 }); press(s.strip, t, SC[2] + .2, { y: 30 }); Array.prototype.forEach.call(s.rows, function (r, i) { r.style.opacity = t >= SC[2] + .35 + i * .35 ? 1 : 0; });
    press(s.tab, t, s.wt[0] - .35, { y: 30 }); Array.prototype.forEach.call(s.trs, function (r, i) { var a = s.wt[i]; r.style.opacity = t >= a ? 1 : .18; r.querySelector('.id').style.opacity = t >= a + .22 ? 1 : 0; });
    press(s.tg, t, SC[2] + .5, { y: 0 }); return 0; };
  return s; })(S[2]);
// ================= S4 · strawberry = 1 token (Blender opaque sort + x-ray) =================
A[3] = (function (P) { var s = {}; eb(P, '// ONE CHUNK, NOT TEN LETTERS');
  s.l1 = D('left:150px;top:236px', 'STRAWBERRY', P, 'h'); s.l2 = D('left:150px;top:328px', '<span class="k" style="background:#c4b5ff">= 1 TOKEN.</span>', P, 'h');
  s.q = D('left:150px;top:438px;width:800px', chipHtml(TOK.q, 34, { keepSpace: 1 }), P); s.qs = s.q.querySelectorAll('.tk');
  s.blk = D('left:40px;top:470px;width:1000px;height:640px;background:url(3d/straw_00.png) center/contain no-repeat;-webkit-mask:radial-gradient(ellipse 52% 50% at 50% 50%,#000 70%,transparent 100%)', '', P);
  s.xr = D('left:150px;top:640px;width:150px;height:200px;background:rgba(23,23,26,.82);border:3px solid #9fd6ff;border-radius:10px;overflow:hidden;box-shadow:0 0 30px rgba(159,214,255,.5)', '<div class="mono" style="position:absolute;left:0;top:10px;width:768px;font-size:20px;color:#9fd6ff;letter-spacing:.14em;padding-left:12px">X-RAY</div><div class="lt" style="position:absolute;left:0;top:70px;width:768px;text-align:center;font:400 84px/1 AS;color:#fbf8f0;letter-spacing:.22em;filter:blur(2.5px)">strawberry</div>', P);
  s.stp = D('left:560px;top:600px;transform-origin:50% 50%', '1 TOKEN', P, 'stamp');
  s.pr = D('left:150px;top:1060px;width:440px;padding:16px 20px', '<div class="lab">THE MODEL GETS</div><div style="margin-top:8px;font:700 36px/1 IN"><span class="tk" style="background:#c4b5ff">␣strawberry</span></div><div class="mono" style="margin-top:10px;font-size:30px">#101830</div>', P, 'proof');
  var tq = wtp(2, 'sentence'), ts = wtp(2, 'strawberry'), tsi = wtp(2, 'single');
  for (var i = 0; i < 7; i++) E('clack', tq - .1 + i * .07); E('xray', ts + .1, { dur: 1.2 }); E('stamp', tsi);
  s.u = function (t) { press(s.l1, t, SC[3] + .05); press(s.l2, t, wtp(2, 'one'), { s: .25, y: 0 }); Array.prototype.forEach.call(s.qs, function (c, i) { press(c, t, tq - .1 + i * .07, { y: -10 }); c.style.boxShadow = (i === 5 && t >= ts) ? '0 0 0 4px ' + INK : 'none'; });
    press(s.blk, t, SC[3] + .1, { y: 30, s: .03 }); var xu = seg(t, ts + .1, ts + 1.3); s.xr.style.opacity = t < ts + .1 ? 0 : (t > tsi + .6 ? .35 : 1); s.xr.style.left = lerp(150, 768, xu) + 'px'; s.xr.querySelector('.lt').style.left = (-lerp(0, 618, xu)) + 'px';
    press(s.stp, t, tsi, { r: -8, s: .5, y: 0, d: .18 }); press(s.pr, t, wtp(2, 'token') + .1, { y: 24 }); return pop(t, tsi, .25) * .3; };
  return s; })(S[3]);
// ================= S5 · why it miscounted the R's (humaaans reader) =================
A[4] = (function (P) { var s = {}; eb(P, '// WHY IT MISCOUNTED THE R\'S');
  s.l1 = D('left:150px;top:236px', 'IT NEVER SAW', P, 'h'); s.l2 = D('left:150px;top:328px', '<span class="k" style="background:#9fd6ff">THE LETTERS.</span>', P, 'h');
  s.man = D('left:120px;top:440px;width:300px;height:380px', window.HUM.st17.replace('<svg ', '<svg width="300" height="380" '), P);
  s.mag = D('left:330px;top:500px;width:170px;height:170px', '<svg width="170" height="170" viewBox="0 0 170 170"><line x1="40" y1="130" x2="10" y2="165" stroke="#17171a" stroke-width="16" stroke-linecap="round"/><circle cx="95" cy="75" r="62" fill="rgba(159,214,255,.35)" stroke="#17171a" stroke-width="10"/><text x="95" y="98" text-anchor="middle" font-family="AS" font-size="70" fill="#17171a">?</text></svg>', P);
  s.blk = D('left:470px;top:450px;width:448px;height:287px;background:url(3d/straw_00.png) center/contain no-repeat', '', P);
  s.ans = D('left:470px;top:740px;width:448px;padding:16px 20px', '<div class="lab">THE FAMOUS ANSWER</div><div style="margin-top:8px;font:700 40px/1.1 IN">"There are 2 R\'s."</div>', P, 'proof');
  s.x = D('left:790px;top:740px', '✗', P, 'stamp'); s.x.style.fontSize = '60px'; s.x.style.padding = '0 14px';
  s.tr = D('left:150px;top:880px;width:768px;display:flex;gap:6px;align-items:center', 'strawberry'.split('').map(function (c) { var r = c === 'r'; return '<span style="width:58px;height:70px;display:flex;align-items:center;justify-content:center;background:' + (r ? '#fbf8f0' : '#e7e1d2') + ';border:3px solid ' + (r ? RED : INK) + ';border-radius:' + (r ? '50%' : '8px') + ';font:400 44px/1 AS;color:' + (r ? RED : INK) + '">' + c + '</span>'; }).join('') + '<span style="margin-left:14px;font:400 56px/1 AS;color:' + RED + '">= 3</span>', P);
  s.tc = D('left:150px;top:1000px;width:440px;padding:14px 18px', '<div class="lab">REPORTED</div><div style="margin-top:6px;font:700 26px/1.25 IN">TechCrunch, Aug 2024: "Why AI can\'t spell \'strawberry\'"</div>', P, 'proof');
  var tm = wtp(2, 'miscounted'), tr = wtp(2, "r's"), tn = wtp(2, 'never', 0);
  try { tn = wtp(2, 'never'); } catch (e) { }
  E('buzz', tm + .1); E('ding', tr + .2); E('pop', SC[4] + .5);
  s.u = function (t) { press(s.l1, t, SC[4] + .05); press(s.l2, t, wtp(2, 'saw') - .25, { s: .25, y: 0 }); press(s.man, t, SC[4] + .1, { x: -40, y: 0, s: 0 }); s.man.style.transform += ' rotate(' + (Math.sin(t * 2.2) * 1.2) + 'deg)';
    press(s.blk, t, SC[4] + .2, { y: 20 }); press(s.mag, t, SC[4] + .35, { y: 0, s: .2 }); s.mag.style.transform += ' translate(' + (Math.sin(t * 1.7) * 14) + 'px,' + (Math.cos(t * 1.3) * 8) + 'px)';
    press(s.ans, t, SC[4] + .45, { y: 24 }); press(s.x, t, tm + .1, { r: -10, s: .6, y: 0, d: .16 }); press(s.tr, t, tr + .1, { y: 20 }); press(s.tc, t, SC[4] + .8, { y: 20 }); return pop(t, tm + .1, .2) * .2; };
  return s; })(S[4]);
// ================= S6 · token race (mocap runners, one stone per token) =================
A[5] = (function (P) { var s = {}; eb(P, '// "I LOVE YOU" IN TOKENS');
  s.l1 = D('left:150px;top:236px;font-size:84px', 'SAME WORDS.', P, 'h'); s.l2 = D('left:150px;top:324px;font-size:84px', '<span class="k" style="background:#c4b5ff">MORE STEPS.</span>', P, 'h');
  var L = [{ k: 'love', lab: 'ENGLISH · "I love you"', font: 'IN', at: wtp(3, 'i'), hop: .24 }, { k: 'hi', lab: 'HINDI · TODAY\'S TOKENIZER', font: 'ND', at: wtp(3, 'hindi'), hop: .24 }, { k: 'hi_old', lab: 'HINDI · OLDER TOKENIZER', font: 'IN', at: wtp(3, 'older') - .2, hop: .1 }];
  s.L = L.map(function (l, li) { var y = 540 + li * 235, x0 = 150, x1 = 820, arr = TOK[l.k], n = arr.length, w = (x1 - x0) / n, big = n < 10, o = { y: y, x0: x0, x1: x1, n: n, w: w, at: l.at, hop: l.hop };
    o.lab = D('left:150px;top:' + (y - 24) + 'px;font:700 19px/1 PM;letter-spacing:.12em', l.lab, P);
    o.st = arr.map(function (tk, i) { return D('left:' + (x0 + i * w + 3) + 'px;top:' + (y + 118) + 'px;width:' + (w - 6) + 'px;height:' + (big ? 62 : 46) + 'px;border:3px dashed ' + INK + ';border-radius:8px;transform:skewX(-12deg);display:flex;align-items:center;justify-content:center;font:700 ' + (big ? (l.font === 'ND' ? 30 : 32) : 14) + 'px/1 ' + l.font + ';overflow:hidden;white-space:pre', big ? esc(tk[0].trim()) : '', P); });
    o.ct = D('left:828px;top:' + (y + 96) + 'px;font:400 68px/1 AS;color:' + (li ? RED : INK), '0', P);
    o.rn = D('left:0;top:0;width:200px;height:185px', '', P); o.dn = D('left:' + (x1 - 40) + 'px;top:' + (y + 20) + 'px;font:400 30px/1 AS;background:#9be8cf;padding:6px 10px;border:3px solid ' + INK, 'DONE', P);
    for (var i = 0; i < n; i++) E(li === 2 ? 'hop' : 'clack', l.at + .3 + i * l.hop); E('ding', l.at + .3 + n * l.hop);
    return o; });
  s.tg = tag(P, 'OWN MEASUREMENT · tiktoken · o200k vs cl100k', 'left:150px;top:1252px');
  s.u = function (t) { press(s.l1, t, SC[5] + .05); press(s.l2, t, wtp(3, 'hindi'), { s: .25, y: 0 });
    s.L.forEach(function (o, li) { var vis = t >= SC[5] + .12 + li * .08; o.lab.style.opacity = vis ? 1 : 0; o.ct.style.opacity = vis ? 1 : 0;
      var prog = clamp((t - (o.at + .3)) / o.hop, 0, o.n), k = Math.floor(prog + 1e-6); o.ct.textContent = t < o.at ? '0' : String(Math.min(o.n, k));
      o.st.forEach(function (d, i) { d.style.opacity = vis ? 1 : 0; var lit = t >= o.at + .3 + i * o.hop; d.style.background = lit ? PAST[i % 4] : (t >= o.at ? 'rgba(251,248,240,.9)' : 'transparent'); d.style.borderStyle = lit ? 'solid' : 'dashed'; d.style.boxShadow = lit ? '0 6px 0 ' + INK : 'none'; d.style.color = t >= o.at ? INK : 'transparent'; });
      var done = prog >= o.n, x = o.x0 + clamp(prog, 0, o.n) * o.w - (done ? 30 : 0), on = t >= o.at; o.rn.style.opacity = on ? (li === 2 ? .6 : 1) : 0;
      var P2 = done ? RIG.sample('walk', .3, { inplace: true }) : RIG.sample('run', (t - o.at) * 1.1 + li * .2, { loop: true, inplace: true }), sc = li === 2 ? .34 : .38;
      o.rn.style.left = (x - 260 * sc) + 'px'; o.rn.style.top = (o.y + 130 - 430 * sc) + 'px'; o.rn.innerHTML = '<svg width="' + (520 * sc) + '" height="' + (480 * sc) + '" viewBox="-260 -430 520 480">' + RIG.svg(P2, 'human', { tint: INK }) + '</svg>';
      o.dn.style.opacity = done ? 1 : 0; o.dn.style.transform = 'scale(' + (1 + .3 * pop(t, o.at + .3 + o.n * o.hop, .25)) + ')'; });
    press(s.tg, t, SC[5] + .6, { y: 0 }); return 0; };
  return s; })(S[5]);
// ================= S7 · billed in tokens, remembers in tokens (real photo + context jars) =================
A[6] = (function (P) { var s = {}; eb(P, '// WHERE TOKENS COST YOU');
  s.l1 = D('left:150px;top:236px', 'BILLED IN', P, 'h'); s.l2 = D('left:150px;top:328px', '<span class="k" style="background:#9be8cf">TOKENS.</span>', P, 'h');
  s.ph = D('left:150px;top:440px;width:768px;height:230px;background-image:url(photos/typewriter.jpg);background-size:150% auto', '', P, 'ph');
  s.pt = D('left:560px;top:470px;width:330px;transform-origin:20px 0', '<div style="background:' + PP + ';border:3px solid ' + INK + ';border-radius:12px 12px 12px 12px;padding:14px 18px 16px 50px;box-shadow:8px 8px 0 ' + INK + ';position:relative"><span style="position:absolute;left:16px;top:22px;width:18px;height:18px;border-radius:50%;border:3px solid ' + INK + '"></span><div class="lab">PRICE LIST</div><div style="margin-top:6px;font:400 40px/1 AS">$ / 1M TOKENS</div><div class="mono" style="margin-top:6px;font-size:18px;color:' + GR + '">in · out · cached</div></div>', P);
  s.cp = D('left:150px;top:690px;width:768px', '<span class="tag" style="position:static;display:inline-block">REAL PHOTO · UNSPLASH</span>', P);
  s.jars = ['ENGLISH', 'HINDI'].map(function (lb, j) { var x = 150 + j * 230; var d = D('left:' + x + 'px;top:740px;width:210px;height:500px', '<div class="lab" style="text-align:center">' + lb + '</div><div class="jr" style="position:absolute;left:10px;top:36px;width:190px;height:400px;border:5px solid ' + INK + ';border-top-width:0;border-radius:0 0 34px 34px;background:rgba(251,248,240,.75);overflow:hidden"><div class="fill" style="position:absolute;left:0;right:0;bottom:0;display:flex;flex-wrap:wrap-reverse;align-content:flex-start;gap:4px;padding:6px"></div></div><div style="position:absolute;left:0;top:30px;width:210px;height:16px;background:' + INK + ';border-radius:6px"></div><div class="ct mono" style="position:absolute;left:0;right:0;top:450px;text-align:center;font-size:24px"></div>', P);
    d.fill = d.querySelector('.fill'); d.ct = d.querySelector('.ct'); d.n = j ? 30 : 16; for (var i = 0; i < d.n; i++) { var m = document.createElement('span'); m.style.cssText = 'width:38px;height:38px;border-radius:50%;border:3px solid ' + INK + ';background:' + PAST[i % 4] + ';display:block'; d.fill.appendChild(m); } d.ms = d.fill.children; return d; });
  s.jl = D('left:620px;top:902px;width:298px;font:600 17px/1.3 PM;letter-spacing:.06em;color:' + INK, 'SAME SENTENCE IN BOTH JARS. THE JAR = ITS CONTEXT WINDOW (MEMORY).', P);
  s.nr = D('left:620px;top:726px;width:298px;padding:12px 16px', '<div class="lab">RESEARCH</div><div style="margin-top:6px;font:700 24px/1.3 IN">Same text, up to <span style="background:#ffc79a;padding:0 4px">15×</span> more tokens in some languages.</div><div class="mono" style="margin-top:8px;font-size:15px;color:' + GR + '">Petrov et al., NeurIPS 2023</div>', P, 'proof');
  var tp = wtp(3, 'priced'), tr = wtp(3, 'remembers');
  E('register', tp); for (var i = 0; i < 16; i++) E('marble', tp + .6 + i * .12, { g: .5 }); E('pop', SC[6] + .5);
  s.u = function (t) { press(s.l1, t, SC[6] + .05); press(s.l2, t, tp, { s: .25, y: 0 }); press(s.ph, t, SC[6] + .1, { y: 20, s: .02 }); s.ph.style.backgroundPosition = lerp(20, 60, seg(t, SC[6], SC[7])) + '% 55%'; press(s.cp, t, SC[6] + .3, { y: 0 });
    press(s.pt, t, tp - .05, { y: -40, s: 0 }); s.pt.style.transform += ' rotate(' + (Math.sin((t - tp) * 5) * 6 * Math.exp(-Math.max(0, t - tp) * 1.2) + 2) + 'deg)';
    s.jars.forEach(function (d, j) { press(d, t, SC[6] + .2 + j * .12, { y: 30 }); var k = Math.floor(clamp((t - (tp + .6)) / (j ? .065 : .12), 0, d.n)); for (var i = 0; i < d.n; i++) d.ms[i].style.visibility = i < k ? 'visible' : 'hidden'; d.ct.textContent = k + ' TOKENS'; });
    press(s.jl, t, SC[6] + .5, { y: 0 }); press(s.nr, t, SC[6] + .55, { y: 24 }); return 0; };
  return s; })(S[6]);
// ================= S8 · one token at a time (Blender next-token drum) =================
var DRUMF = []; for (var q2 = 0; q2 < 24; q2++) DRUMF.push('3d/drum_' + (q2 < 10 ? '0' : '') + q2 + '.png');
var DTOK = ['It', ' writes', ' one', ' token', ' at', ' a', ' time', ' cat', ' rhyme', ' piece', ' word', ' next'];
A[7] = (function (P) { var s = {}; eb(P, '// HOW IT WRITES');
  s.l1 = D('left:150px;top:236px', 'ONE TOKEN', P, 'h'); s.l2 = D('left:150px;top:328px', '<span class="k" style="background:#ffc79a">AT A TIME.</span>', P, 'h');
  s.dr = D('left:150px;top:420px;width:768px;height:500px;background-size:contain;background-repeat:no-repeat;background-position:center', '', P);
  s.sn = D('left:150px;top:930px;width:768px;height:84px;padding:14px 18px;display:flex;align-items:center', '', P, 'proof');
  s.bars = D('left:150px;top:1040px;width:470px;padding:14px 18px', '', P, 'proof');
  s.ac = D('left:230px;top:560px;font:400 54px/1 AS;background:' + PP + ';border:4px solid ' + INK + ';padding:14px 22px;box-shadow:10px 10px 0 ' + INK + ';z-index:3', 'AUTOCOMPLETE?', P);
  s.nq = D('left:420px;top:650px;z-index:4;font-size:64px', 'NOT QUITE.', P, 'stamp');
  // schedule: token k chosen at C[k]; drum spins 1 full turn + offset between picks; face i is front at frame 2i
  var t0 = SC[7] + .35, step = .52; s.C = []; for (var k = 0; k < 7; k++) s.C.push(t0 + .32 + k * step); s.t0 = t0; s.step = step;
  s.C.forEach(function (c) { E('ratchet', c - .32, { dur: .3 }); E('clack', c); });
  var ta = wtp(4, 'autocomplete') - .15, tq = wtp(4, 'not'); E('pop', ta); E('stamp', tq);
  s.frame = function (t) { if (t < t0) return 0; var k = Math.floor((t - t0) / step); if (k >= 7) { var base = 12; return (base + Math.floor((t - (t0 + 7 * step)) * 4)) % 24; } var u = clamp(((t - t0) - k * step) / .32, 0, 1), a = k === 0 ? 0 : 2 * (k - 1), b = 2 * k + 24; return Math.round(lerp(a, b, ec(u))) % 24; };
  s.u = function (t) { press(s.l1, t, SC[7] + .05); press(s.l2, t, wtp(4, 'time'), { s: .25, y: 0 }); press(s.dr, t, SC[7] + .1, { y: 30, s: .03 });
    var f = s.frame(t); if (s.dr.__f !== f) { s.dr.__f = f; s.dr.style.backgroundImage = 'url(' + DRUMF[f] + ')'; }
    var spinning = s.C.some(function (c) { return t > c - .32 && t < c; }); s.dr.style.filter = spinning ? 'blur(1.4px)' : 'none';
    press(s.sn, t, SC[7] + .25, { y: 24 }); var n = s.C.filter(function (c) { return t >= c; }).length; s.sn.innerHTML = '<span class="lab" style="margin-right:12px">WRITTEN:</span>' + chipHtml(TOK.write.slice(0, n), 34, { keepSpace: 1 }) + '<span style="display:inline-block;width:4px;height:40px;background:' + INK + ';opacity:' + (Math.floor(t * 3) % 2) + '"></span>';
    var cur = Math.min(6, Math.max(0, n - (t < (s.C[n] || 1e9) - .32 ? 0 : 0))); var pick = DTOK[Math.min(6, n)] || DTOK[6], alts = [DTOK[7 + (n % 5)], DTOK[(n + 9) % 12 === Math.min(6, n) ? 10 : (n + 9) % 12]];
    press(s.bars, t, SC[7] + .4, { y: 24 }); s.bars.innerHTML = '<div class="lab">NEXT-TOKEN ODDS · ILLUSTRATION</div>' + [[pick, .86], [alts[0], .38], [alts[1], .22]].map(function (r, i) { return '<div style="display:flex;align-items:center;gap:10px;margin-top:8px"><span class="mono" style="width:120px;font-size:20px;white-space:pre">' + esc(r[0]).replace(/^ /, '␣') + '</span><span style="height:22px;width:' + (r[1] * 290) + 'px;background:' + (i ? '#d8d2c4' : PAST[n % 4]) + ';border:2px solid ' + INK + '"></span></div>'; }).join('');
    press(s.ac, t, ta, { r: -3, y: 0, s: .2 }); s.ac.style.opacity = t < ta ? 0 : 1; press(s.nq, t, tq, { r: -9, s: .6, y: 0, d: .16 }); return pop(t, tq, .22) * .25; };
  return s; })(S[7]);
// ================= S9 · it plans ahead (X-ray board, Anthropic interpretability) =================
A[8] = (function (P) { var s = {}; eb(P, '// IT PLANS AHEAD');
  s.l1 = D('left:150px;top:236px;font-size:80px', 'IT PICKED THE', P, 'h'); s.l2 = D('left:150px;top:319px;font-size:80px', '<span class="k" style="background:#9be8cf">RHYME FIRST.</span>', P, 'h');
  s.pp = D('left:150px;top:440px;width:768px;height:320px;padding:24px 28px', '<div class="lab">LINE 1</div><div class="a1" style="margin-top:10px;font:700 34px/1.5 IN;min-height:51px"></div><div class="lab" style="margin-top:14px">LINE 2</div><div class="a2" style="margin-top:10px;font:700 34px/1.4 IN"></div><div class="iv mono" style="position:absolute;left:28px;bottom:16px;font-size:16px;color:' + GR + ';letter-spacing:.04em">TEST: suppress "rabbit" → it writes "habit" · inject "green" → "green"</div>', P, 'proof');
  s.a1 = s.pp.querySelector('.a1'); s.a2 = s.pp.querySelector('.a2'); s.iv = s.pp.querySelector('.iv');
  s.bd = D('left:390px;top:800px;width:528px;height:372px;background:' + INK + ';border-radius:18px;box-shadow:0 18px 40px rgba(23,23,26,.4)', '<div style="position:absolute;left:22px;bottom:16px;font:700 17px/1 PM;letter-spacing:.12em;color:#9fd6ff">X-RAY · ACTIVE BEFORE LINE 2 IS WRITTEN</div>', P);
  s.lamps = [['rabbit', 1], ['habit', 0], ['carrot', 0], ['grab', 0], ['green', 0], ['hungry', 0]].map(function (w, i) { var cx = 22 + (i % 2) * 250, cy = 20 + Math.floor(i / 2) * 104; var d = D('left:' + cx + 'px;top:' + cy + 'px;width:236px;height:96px;border-radius:14px;background:#222226;border:2px solid #3a3a40', '<div class="bulb" style="position:absolute;left:16px;top:24px;width:46px;height:46px;border-radius:50%;background:#3a3a40"></div><div class="w" style="position:absolute;left:80px;top:30px;font:700 30px/1 PM;color:#6d6d74">' + w[0] + '</div>', s.bd); d.on = w[1]; return d; });
  s.arw = D('left:0;top:0;width:1080px;height:1920px;pointer-events:none', '<svg width="1080" height="1920"><path class="pth" d="M530 822 C 540 772, 760 782, 776 700" fill="none" stroke="#e8432e" stroke-width="6" stroke-dasharray="14 10"/><path d="M762 708 L776 680 L792 710 Z" fill="#e8432e"/></svg>', P);
  s.poet = D('left:110px;top:800px;width:300px;height:380px', window.HUM.sit5.replace('<svg ', '<svg width="300" height="380" '), P);
  s.src = D('left:150px;top:1192px;display:flex;align-items:center;gap:10px', '<span style="width:34px;height:24px;color:' + INK + '">' + logo('anthropic', 34, 24) + '</span>ANTHROPIC RESEARCH · MAR 2025 · CLAUDE 3.5 HAIKU', P, 'chip'); s.src.style.position = 'absolute';
  s.fn = D('left:150px;top:1256px;font:600 15px/1 PM;letter-spacing:.06em;color:' + GR, 'Their method sees only a fraction of the computation.', P);
  var tl = wtp(4, 'looked'), tpk = wtp(4, 'picked'), tli = wtp(4, 'line');
  s.l1t = SC[8] + .3; s.l2t = tpk - .1; s.l2s = (tli + .1 - s.l2t) / TOK.l2.length;
  TOK.l1.forEach(function (x, i) { E('type', s.l1t + i * .1); }); E('lamp', tl + .2, { dur: 2.4 }); TOK.l2.forEach(function (x, i) { E('type', s.l2t + i * s.l2s); }); E('ding', s.l2t + TOK.l2.length * s.l2s);
  s.u = function (t) { press(s.l1, t, SC[8] + .05); press(s.l2, t, tpk - .2, { s: .25, y: 0 }); press(s.pp, t, SC[8] + .15, { y: 24 });
    var n1 = clamp(Math.floor((t - s.l1t) / .1) + 1, 0, TOK.l1.length); s.a1.innerHTML = chipHtml(TOK.l1.slice(0, n1), 34, {});
    var n2 = clamp(Math.floor((t - s.l2t) / s.l2s) + 1, 0, TOK.l2.length); var wr = TOK.l2.slice(0, n2), last = n2 === TOK.l2.length; s.a2.innerHTML = n2 ? chipHtml(wr, 34, {}) : '<span style="color:#b7b2a6">His hunger was like a starving </span><span style="border-bottom:5px dashed ' + RED + ';color:' + RED + '">______</span>'; if (last) s.a2.lastChild.style.boxShadow = '0 0 0 4px ' + RED;
    s.iv.style.opacity = t >= tli - .2 ? 1 : 0; press(s.bd, t, SC[8] + .25, { y: 30 }); press(s.poet, t, SC[8] + .2, { x: -30, y: 0, s: 0 });
    var lit = seg(t, tl + .2, tl + .6); s.lamps.forEach(function (d, i) { var on = d.on && lit > 0, fl = .5 + .5 * Math.sin(t * 9 + i * 2); d.style.background = on ? '#2b2420' : '#222226'; d.style.borderColor = on ? '#ffc79a' : '#3a3a40'; d.querySelector('.bulb').style.background = on ? 'radial-gradient(circle,#fff3e6 0,#ffc79a 45%,#e8432e 100%)' : (t > tl ? 'rgba(80,80,90,' + (.6 + .2 * fl) + ')' : '#3a3a40'); d.querySelector('.bulb').style.boxShadow = on ? '0 0 ' + (24 * lit + 6 * Math.sin(t * 6)) + 'px ' + (10 * lit) + 'px rgba(255,199,154,.55)' : 'none'; d.querySelector('.w').style.color = on ? '#ffc79a' : '#6d6d74'; });
    s.arw.style.opacity = seg(t, tl + .5, tl + .8); press(s.src, t, SC[8] + .5, { y: 0 }); press(s.fn, t, SC[8] + .7, { y: 0 }); return 0; };
  return s; })(S[8]);
// ================= S10 · try it: your name (real keyboard photo + phone) =================
A[9] = (function (P) { var s = {}; eb(P, '// TRY IT: YOUR NAME');
  s.l1 = D('left:150px;top:236px;font-size:68px', 'HOW MANY', P, 'h'); s.l2 = D('left:150px;top:308px;font-size:68px', '<span class="k" style="background:#c4b5ff">TOKENS ARE YOU?</span>', P, 'h');
  s.ph = D('left:150px;top:430px;width:768px;height:300px;background-image:url(photos/keys.jpg);background-size:140% auto', '', P, 'ph');
  s.phn = D('left:180px;top:470px;width:360px;height:770px;background:' + INK + ';border-radius:48px;padding:16px;box-shadow:12px 12px 0 rgba(23,23,26,.35);z-index:2', '<div style="position:absolute;left:16px;right:16px;top:16px;bottom:16px;background:' + PP + ';border-radius:34px;overflow:hidden"><div style="height:30px;display:flex;justify-content:center;padding-top:8px"><span style="width:90px;height:22px;border-radius:11px;background:' + INK + '"></span></div><div class="sb" style="margin:14px 16px 0;height:56px;border:3px solid ' + INK + ';border-radius:28px;display:flex;align-items:center;gap:10px;padding:0 16px;font:700 22px/1 IN;white-space:nowrap;overflow:hidden">' + ic('search', 24, INK, 2.6) + '<span class="q"></span></div><div class="res" style="margin:16px 16px 0;padding:14px;border:3px solid ' + INK + ';border-radius:16px;display:flex;gap:10px;align-items:center"><span style="width:34px;height:34px;color:' + INK + '">' + logo('openai', 34, 34) + '</span><div><div style="font:700 21px/1.2 IN">Tokenizer</div><div class="mono" style="font-size:14px;color:' + GR + '">platform.openai.com/tokenizer</div></div></div><div class="tz" style="margin:16px 16px 0"><div class="lab" style="font-size:15px">TYPE YOUR NAME</div><div class="nm" style="margin-top:10px;height:58px;border:3px solid ' + INK + ';border-radius:12px;padding:10px 12px;font:700 32px/1 IN"></div><div class="tks" style="margin-top:14px;min-height:50px"></div><div class="cnt mono" style="margin-top:12px;font-size:24px"></div></div></div>', P);
  s.q = s.phn.querySelector('.q'); s.res = s.phn.querySelector('.res'); s.tz = s.phn.querySelector('.tz'); s.nm = s.phn.querySelector('.nm'); s.tks = s.phn.querySelector('.tks'); s.cnt = s.phn.querySelector('.cnt');
  s.ex = D('left:580px;top:738px;width:338px;padding:14px 16px', '<div class="lab">OTHER NAMES · o200k</div>' + [['Priyanka', TOK.name2], ['Rahul', TOK.name3]].map(function (r) { return '<div style="margin-top:10px;font:700 28px/1.2 IN">' + chipHtml(r[1], 28, {}) + '<span class="mono" style="font-size:20px;margin-left:8px">= ' + r[1].length + '</span></div>'; }).join(''), P, 'proof');
  s.cm = D('left:580px;top:922px;width:338px;padding:14px 16px;border-radius:18px', '<div style="display:flex;gap:10px;align-items:center">' + ic('message-circle', 30, INK, 2.2) + '<span class="lab">COMMENT</span></div><div style="margin-top:8px;font:700 30px/1.2 IN">Sandesh → 2.<br>You?</div>', P, 'proof');
  var tsr = wtp(5, 'search'), ttp = wtp(5, 'type'), tnm = wtp(5, 'name'), tcm = wtp(5, 'comment');
  for (var i = 0; i < 16; i++) E('type', tsr + .1 + i * .07, { g: .6 }); E('pop', wtp(5, 'tokenizer') + .45); for (var j = 0; j < 7; j++) E('type', ttp + j * .1, { g: .6 }); E('clack', tnm + .35); E('clack', tnm + .45); E('pop', tcm);
  s.u = function (t) { press(s.l1, t, SC[9] + .05); press(s.l2, t, wtp(5, 'pieces') - .3, { s: .25, y: 0 }); press(s.ph, t, SC[9] + .1, { y: 20, s: .02 }); s.ph.style.backgroundPosition = lerp(30, 70, seg(t, SC[9], SC[10])) + '% 50%';
    press(s.phn, t, SC[9] + .2, { y: 50, s: .02 }); s.q.textContent = typed('OpenAI tokenizer', t, tsr + .1, 14); var shown = t >= wtp(5, 'tokenizer') + .45; s.res.style.opacity = shown ? 1 : 0; s.tz.style.opacity = t >= ttp - .2 ? 1 : 0;
    s.nm.textContent = typed('Sandesh', t, ttp, 10); var split = t >= tnm + .35; s.tks.innerHTML = split ? chipHtml(TOK.sandesh, 34, { border: 1 }) : ''; s.cnt.textContent = split ? '= 2 TOKENS' : '';
    press(s.ex, t, tnm + .6, { y: 24 }); press(s.cm, t, tcm, { y: 24 }); return 0; };
  return s; })(S[9]);
// ================= S11 · recap card (save) + CTA =================
A[10] = (function (P) { var s = {};
  s.card = D('left:150px;top:170px;width:768px;padding:30px 34px 26px', '<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="font:400 64px/1 AS">AI READS<br><span style="background:#ffc79a;padding:0 10px">TOKENS.</span></div><div class="sv" style="display:flex;flex-direction:column;align-items:center;gap:6px"><svg width="58" height="70" viewBox="0 0 24 28"><path d="M4 2h16v24l-8-6-8 6z" fill="#17171a"/></svg><span class="mono" style="font-size:16px">SAVE</span></div></div>' +
    [['1', 'Not letters.', '"strawberry" in a sentence = <b>1</b> token.'], ['2', 'Not equal.', '"I love you" = <b>3</b> tokens; in Hindi <b>6</b> (older model <b>24</b>).'], ['3', 'One at a time.', 'It picks the next token, and plans ahead.']].map(function (r, i) { return '<div class="rr" style="display:flex;gap:18px;margin-top:24px;align-items:flex-start"><span style="flex:none;width:58px;height:58px;border-radius:50%;background:' + PAST[i] + ';border:3px solid ' + INK + ';font:400 34px/52px AS;text-align:center">' + r[0] + '</span><div><div style="font:400 36px/1.1 AS">' + r[1] + '</div><div style="margin-top:6px;font:600 26px/1.35 IN">' + r[2] + '</div></div></div>'; }).join('') +
    '<div class="mono" style="margin-top:24px;font-size:16px;color:' + GR + ';letter-spacing:.06em">MEASURED WITH OPENAI\'S TOKENIZER (o200k) · 11 OCT 2026</div>', P, 'proof');
  s.rows = s.card.querySelectorAll('.rr'); s.sv = s.card.querySelector('.sv');
  s.hd = D('left:440px;top:950px;font:400 44px/1 AS', '@sandesh.explains', P);
  s.fo = D('left:440px;top:1020px;background:' + INK + ';color:' + NP + ';font:400 40px/1 AS;padding:18px 34px;border-radius:40px;box-shadow:6px 6px 0 #c4b5ff', 'FOLLOW', P);
  s.me = D('left:440px;top:1118px;transform:rotate(-4deg);background:#9be8cf;border:3px solid ' + INK + ';font:700 22px/1.2 PM;padding:10px 12px;box-shadow:5px 5px 0 ' + INK, 'I\'M 2 TOKENS.<br>YOU?', P);
  s.ring = D('left:150px;top:930px;width:260px;height:260px;border-radius:50%;border:8px solid ' + INK + ';box-shadow:0 0 0 8px #ffc79a,10px 14px 0 8px rgba(23,23,26,.25);pointer-events:none;z-index:7', '', P);
  var ts = wtp(5, 'save'), tf = wtp(5, 'follow');
  E('pop', SC[10] + .3); E('pop', SC[10] + .55); E('pop', SC[10] + .8); E('chime', tf); E('thunk', ts);
  s.u = function (t) { press(s.card, t, SC[10] + .08, { y: 30, s: .02 }); Array.prototype.forEach.call(s.rows, function (r, i) { press(r, t, SC[10] + .3 + i * .25, { x: -20, y: 0, s: 0 }); });
    s.sv.style.transform = 'scale(' + (1 + .18 * pop(t, ts, .4) + .04 * Math.sin(t * 5)) + ')'; press(s.ring, t, SC[10] + .2, { y: 0, s: .15 }); press(s.hd, t, SC[10] + .9, { x: 30, y: 0, s: 0 }); press(s.fo, t, SC[10] + 1.1, { x: 30, y: 0, s: 0 });
    s.fo.style.transform += ' scale(' + (1 + .12 * pop(t, tf, .45) + (t > tf ? .03 * Math.sin(t * 6) : 0)) + ')'; press(s.me, t, SC[10] + 1.4, { r: -4, s: .3, y: 0 }); return 0; };
  return s; })(S[10]);
// ---------------- host (avatar video) ----------------
var host = D('', '<div class="fr"><canvas width="720" height="720"></canvas><div class="lb"><span class="ln">HOST</span><span>AI AVATAR</span></div></div>', st); host.id = 'host';
var hFr = host.querySelector('.fr'), hCv = host.querySelector('canvas'), hLb = host.querySelector('.lb'), hLn = host.querySelector('.ln');
var hv = document.createElement('video'); hv.muted = true; hv.preload = 'auto'; hv.playsInline = true; hv.src = 'host.webm'; hv.style.cssText = 'position:absolute;width:2px;height:2px;opacity:0;pointer-events:none'; document.body.appendChild(hv);
function vseek(v, tt) { return new Promise(function (res) { if (!v.duration) { res(); return; } if (Math.abs(v.currentTime - tt) < 1e-4 && v.readyState >= 2) { res(); return; } var done = false; function fin() { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); } v.addEventListener('seeked', fin); v.currentTime = tt; setTimeout(fin, 4000); }); }
function hostAt(t) { var f = Math.max(0, Math.floor(t * 24 + 1e-6)); return vseek(hv, Math.min(hv.duration - .02, (f + .5) / 24)).then(function () { try { hCv.getContext('2d').drawImage(hv, 0, 0, 720, 720); } catch (e) { } }); }
// pose per scene: [x, y, w, h, mode]  mode: case | ring | hide
var HP = [[150, 150, 768, 760, 'case'], [640, 980, 278, 280, 'case'], [0, 0, 0, 0, 'hide'], [640, 980, 278, 280, 'case'], [640, 980, 278, 280, 'case'], [0, 0, 0, 0, 'hide'], [640, 980, 278, 280, 'case'], [680, 1040, 238, 220, 'case'], [0, 0, 0, 0, 'hide'], [640, 1090, 278, 170, 'case'], [158, 938, 244, 244, 'ring']];
var HLAB = ['HOST', 'SAND·ESH', '', 'HOST', 'HOST', '', 'HOST', 'HOST', '', 'YOUR TURN', ''];
function hostPose(t, si, lt) { var p = HP[si]; if (p[4] === 'hide') { host.style.display = 'none'; return; } host.style.display = 'block';
  var x = p[0], y = p[1], w = p[2], h = p[3];
  if (si === 1) { var u = ec(lt / .45), a = HP[0]; x = lerp(a[0], x, u); y = lerp(a[1], y, u); w = lerp(a[2], w, u); h = lerp(a[3], h, u); }
  host.style.left = x + 'px'; host.style.top = y + 'px'; host.style.width = w + 'px'; host.style.height = h + 'px'; host.style.transform = '';
  var ring = p[4] === 'ring', lbh = ring ? 0 : (w > 400 ? 46 : 34), inner = Math.max(w - (ring ? 0 : 20), h - lbh - (ring ? 0 : 20));
  hFr.style.borderRadius = ring ? '50%' : (w > 400 ? '22px' : '16px'); hFr.style.borderWidth = ring ? '0' : (w > 400 ? '10px' : '6px'); hLb.style.display = ring ? 'none' : 'flex'; hLb.style.height = lbh + 'px'; hLb.style.lineHeight = lbh + 'px'; hLb.style.fontSize = (w > 400 ? 18 : 13) + 'px'; hLn.textContent = HLAB[si];
  var cw = ring ? w : w - 2 * (w > 400 ? 10 : 6), ch = ring ? h : h - lbh - 2 * (w > 400 ? 10 : 6), sz = Math.max(cw, ch); hCv.style.width = sz + 'px'; hCv.style.height = sz + 'px'; hCv.style.left = ((cw - sz) / 2) + 'px'; hCv.style.top = ((ch - sz) / 2 - (ring ? 0 : sz * .04)) + 'px'; }
// ---------------- captions: real token chips ----------------
var stick = D('', '<div class="row"></div><div class="meta"></div>', st); stick.id = 'stick'; var sRow = stick.firstChild, sMeta = stick.lastChild;
var PGB = [], acc = 0; PG.forEach(function (p) { PGB.push(acc); acc += p.t.length; });
function drawCap(t) { var last = 0; for (var i = 0; i < WD.length; i++) if (t >= WD[i].s - .02) last = i; var pi = 0; for (var j = 0; j < PG.length; j++) if (PG[j].w.indexOf(last) >= 0) pi = j; var p = PG[pi], out = '', n = 0;
  p.t.forEach(function (tk, k) { if (tk[1] > last) return; n++; out += '<span class="tk' + (tk[1] === last ? ' cur' : '') + '" style="background:' + PAST[(PGB[pi] + k) % 4] + '">' + esc(tk[0].replace(/^ /, '')) + '</span>'; });
  if (sRow.__h !== out) { sRow.__h = out; sRow.innerHTML = out; } sMeta.textContent = 'CAPTIONS SET IN REAL TOKENS · o200k · ' + (PGB[pi] + n) + ' SO FAR'; }
// ---------------- background + overlays ----------------
var glc = document.getElementById('gl'), paper = document.getElementById('paper'), ht = paper.querySelector('.ht');
var OV = {}; function ovl(id, src, blend, op) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.className = 'vid'; v.style.mixBlendMode = blend; v.style.opacity = op; st.appendChild(v); OV[id] = { v: v }; }
ovl('dust', 'dust-particles.webm', 'screen', .55); ovl('grain', 'film-grain.webm', 'multiply', .35);
function ovAt(id, on, t, fps) { var o = OV[id]; o.v.style.display = on ? 'block' : 'none'; if (!on || !o.v.duration) return Promise.resolve(); var d = o.v.duration, tt = (t % d), f = Math.floor(tt * fps); return vseek(o.v, Math.min(d - .01, (f + .5) / fps)); }
var wipe = D('', '', st); wipe.id = 'wipe';
SC.slice(1).forEach(function (c) { E('roll', c - .16); });
// ---------------- seek ----------------
var ready = Promise.all([window.GLP.load(['typecase']), new Promise(function (r) { hv.addEventListener('loadeddata', r); setTimeout(r, 8000); }), Promise.all(['dust', 'grain'].map(function (k) { return new Promise(function (r) { OV[k].v.addEventListener('loadeddata', r); setTimeout(r, 6000); }); })), Promise.all(SANDF.concat(DRUMF, ['3d/straw_00.png', 'photos/typewriter.jpg', 'photos/keys.jpg']).map(function (u) { return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = u; }); })), document.fonts.ready]).then(function () { window.__ready = true; return window.__seek(0); });
window.EV = EV;
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var si = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
  var s0 = SC[si], s1 = si < SC.length - 1 ? SC[si + 1] : DUR, lt = t - s0;
  scenes.forEach(function (s, i) { s.style.display = i === si ? 'block' : 'none'; });
  var e = ebs.filter(function (x) { return x.parentNode === scenes[si]; })[0]; if (e) { var qq = ec(lt / .3); e.style.transform = 'translateX(' + ((1 - qq) * -80) + 'px)'; e.style.opacity = clamp(lt / .1, 0, 1); }
  // ink-roller wipe centred on each cut (0.36 s)
  var wx = -1500; for (var c = 1; c < SC.length; c++) { var u = (t - (SC[c] - .18)) / .36; if (u >= 0 && u <= 1) wx = lerp(-1500, 1080, u); } wipe.style.left = wx + 'px'; wipe.style.width = '1500px';
  var gl = si === 2; paper.style.display = gl ? 'none' : 'block'; glc.style.display = gl ? 'block' : 'none'; ht.style.backgroundPosition = (t * 6) + 'px ' + (t * 3) + 'px';
  if (gl) { var uu = lt / (s1 - s0); window.GLP.draw({ a: 'typecase', camA: [lerp(-.25, .2, uu), .05, lerp(1.04, 1.18, uu)], par: .07, dim: .62, t: t }); }
  var jolt = A[si].u(t) || 0; st.style.transform = '';
  hostPose(t, si, lt); drawCap(t);
  return Promise.all([hostAt(t), ovAt('dust', si === 2, t, 25), ovAt('grain', si === 2 || si === 6 || si === 9, t, 30)]);
};
})();
