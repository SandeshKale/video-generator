// "Fine Print" — every layer is a pure function of t. Voice = the creator's avatar clips (word times in timing.js).
(function () {
'use strict';
var SC = window.SC, WD = window.WD, DUR = window.TOTAL; window.__reelDurationSec = DUR;
var OR = '#ff6a13', LI = '#c6f135', BN = '#efe9dc', INK = '#12110f', GR = '#8a867c';
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return sm((t - a) / (b - a)); }
function bounce(x) { x = clamp(x, 0, 1); var s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); }
function wt(k, n) { k = k.replace(/[.,?!]/g, ''); var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } return 0; }
function wtp(p, k, n) { var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } return 0; }
var st = document.getElementById('st'), fx = document.getElementById('fx');
function D(css, html, par, cls) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; if (cls) e.className = cls; (par || st).appendChild(e); return e; }
function ic(n, sz, col, sw) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" style="flex:none">' + window.IC[n] + '</svg>'; }
function pin(el, t, at, o) { o = o || {}; var p = bounce(seg(t, at, at + (o.d || 0.35))), s0 = o.s0 == null ? 0.7 : o.s0; el.style.opacity = t < at ? 0 : 1; el.style.transform = 'translate(' + ((o.x || 0) * (1 - p)) + 'px,' + ((o.y || 0) * (1 - p)) + 'px) rotate(' + ((o.r || 0) + (o.rot || 0) * (1 - p)) + 'deg) scale(' + (s0 + (1 - s0) * p) + ')'; }
function pop(t, at, d) { var x = t - at; return x < 0 || x > (d || .3) ? 0 : 1 - x / (d || .3); }
function win(par, css, title, body, extra) { return D(css, '<div class="tb"><i style="background:' + OR + '"></i><i style="background:#555"></i><i style="background:#555"></i><span style="margin-left:8px">' + title + '</span>' + (extra || '') + '</div>' + body, par, 'win'); }
var scenes = [], tabs = [];
function scene() { var s = D('left:0;top:0;width:1080px;height:1920px', null, st, 'sc'); scenes.push(s); return s; }
function tab(par, txt) { var e = D('', txt, par, 'eb'); tabs.push(e); return e; }
function aitag(par, txt, css) { return D(css || 'left:150px;top:1252px', txt || 'AI IMAGE', par, 'tag'); }
D('', null, st).id = 'scrim';
var S = []; for (var i = 0; i < 12; i++) S.push(scene());
var A = {};
// background text layers: fine-print wall (the trap) and code rain (the open alternative)
var WORDS = ['hereinafter', 'notwithstanding', 'Section 4.2(b)', 'the Subscriber', 'early termination', 'remaining Monthly Payments', 'fifty percent (50%)', 'shall be due', 'upon cancellation', 'in accordance with', 'Schedule C', 'the Company reserves', 'sole discretion', 'non-refundable', 'pro rata', 'Annual Plan', 'billing cycle', 'as set forth', 'herein', 'provided that', 'and shall not', 'be construed'];
var wallEl = (function () { var r = 3, blk = ''; function rn() { r = (r * 16807) % 2147483647; return r / 2147483647; } for (var i = 0; i < 20; i++) { var l = ''; while (l.length < 205) l += WORDS[Math.floor(rn() * WORDS.length)] + ' '; blk += l + '\n'; } var all = ''; for (var k = 0; k < 11; k++) all += blk; return D('', all, fx, 'wall'); })();
var rainEl = (function () { var r = 9, blk = '', G = '01{}[]<>/=;:fn mut let pub use Rust'.split(''); function rn() { r = (r * 16807) % 2147483647; return r / 2147483647; } for (var i = 0; i < 10; i++) { var l = ''; for (var j = 0; j < 52; j++) l += (rn() < .55 ? ' ' : G[Math.floor(rn() * G.length)]) + ' '; blk += l + '\n'; } var all = ''; for (var k = 0; k < 10; k++) all += blk; return D('', all, fx, 'rain'); })();
var MK = [[0, 0], [3.5, 0], [5.9, 1], [28.4, 1], [29.2, 0], [51.0, 0], [56.2, .0], [57.4, 1], [DUR, 1]];
function mixAt(t) { for (var i = 0; i < MK.length - 1; i++) if (t < MK[i + 1][0]) return lerp(MK[i][1], MK[i + 1][1], sm((t - MK[i][0]) / (MK[i + 1][0] - MK[i][0]))); return 1; }
// ===== S1 : one fee too many =====
A.s1 = {}; (function (s) {
  s.tab = tab(S[0], '// ONE FEE TOO MANY');
  function wd(t, l, tp, k) { return D('left:' + l + 'px;top:' + tp + 'px;font:800 156px/.88 BC;letter-spacing:-.01em;color:' + BN + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap;text-transform:uppercase;transform-origin:0 70%', t, S[0]); }
  s.w = [wd('ONE', 150, 226), wd('<span style="color:' + OR + '">FEE</span>', 410, 226), wd('TOO', 150, 358), wd('MANY.', 380, 358)]; s.wk = ['one', 'fee', 'too', 'many'];
  s.mod = win(S[0], 'left:500px;top:1000px;width:418px;height:270px;transform-origin:50% 50%;z-index:6', 'CANCEL PLAN?', '<div style="padding:16px 20px"><div style="font:700 24px/1.25 IN;color:' + BN + '">Cancel now and an early termination fee applies.</div><div class="lab" style="margin-top:12px;font-size:17px">FEE <span class="blk" style="color:' + OR + '">██████</span></div><div class="kp" style="margin-top:14px;background:' + OR + ';color:' + INK + ';font:800 38px/64px BC;letter-spacing:.02em;text-align:center;height:64px;border-radius:8px">KEEP MY PLAN</div><div class="cc" style="margin-top:12px;font:500 14px/1 JM;color:' + GR + ';text-decoration:underline">continue to cancel</div></div>', '<b class="xx" style="margin-left:auto;color:' + OR + ';font-size:24px">×</b>');
  s.cur = D('left:0;top:0;width:34px;height:34px;z-index:6', '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2 4 7-3 1-4-7-5 4z" fill="' + BN + '" stroke="' + INK + '" stroke-width="1.5"/></svg>', S[0]);
  s.rip = D('left:0;top:0;width:60px;height:60px;border:5px solid ' + OR + ';border-radius:50%;z-index:5', '', S[0]);
})(A.s1);
// ===== S2 : photoshop, rebuilt — CSS-3D stack of Blender glass slabs =====
A.s2 = {}; (function (s) {
  s.tab = tab(S[1], '// PHOTOSHOP, REBUILT FROM BEHAVIOUR');
  s.h = D('left:150px;top:238px;font:800 190px/.88 BC;letter-spacing:-.01em;color:' + BN + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap;transform-origin:0 70%', 'REBUILT<span style="color:' + LI + '">.</span>', S[1]);
  s.cl = D('left:150px;top:420px', 'CLEAN-ROOM · HIS WORDS', S[1], 'chip'); s.cl.style.background = 'rgba(239,233,220,.12)'; s.cl.style.color = BN; s.cl.style.fontSize = '20px';
  s.st = D('left:470px;top:900px;width:0;height:0;perspective:1500px', '', S[1]); s.cn = D('transform-style:preserve-3d', '', s.st);
  s.slabs = ['bg', 'shapes', 'text', 'mask', 'adj'].map(function (n) { var e = D('width:500px;height:500px;left:-250px;top:-250px;background:url(3d/slab_' + n + '.png) center/contain no-repeat;filter:drop-shadow(0 26px 22px rgba(0,0,0,.5))', '', s.cn); return e; });
  var nm = [['BACKGROUND', BN], ['SHAPES', LI], ['TEXT', BN], ['MASK', GR], ['ADJUSTMENT', OR]];
  s.lb = nm.map(function (n, i) { var c = D('left:' + (640 + i * 6) + 'px;top:' + (860 - i * 92) + 'px;background:' + n[1] + ';color:' + INK, n[0], S[1], 'chip'); return c; });
  s.ar = D('left:150px;top:480px;display:flex;gap:14px;align-items:center', '<span class="chip" style="position:static;background:' + BN + ';color:' + INK + '">PHOTOSHOP</span><span style="font:800 54px/1 BC;color:' + OR + '">→</span><span class="chip" style="position:static;background:' + LI + ';color:' + INK + '">PHOTOCRAFT</span>', S[1]);
  s.git = D('left:150px;top:570px;width:210px;background:rgba(18,17,15,.86);border:2px solid rgba(198,241,53,.35);padding:12px 12px;font:700 15px/1.55 JM;color:' + LI + ';min-height:230px', '', S[1]);
  s.tg = aitag(S[1], 'ILLUSTRATIVE LOG · 3D RENDER', 'left:150px;top:1252px');
})(A.s2);
// ===== S3 : seven apps, one weekend — photoreal workshop + mocap robots =====
A.s3 = {}; (function (s) {
  s.tab = tab(S[2], '// SEVEN APPS, ONE WEEKEND');
  s.h1 = D('left:150px;top:222px;font:800 140px/.88 BC;letter-spacing:-.01em;color:' + BN + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap', 'SEVEN APPS.', S[2]); s.h2 = D('left:150px;top:346px;font:800 140px/.88 BC;letter-spacing:-.01em;color:' + LI + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap', 'ONE WEEKEND.', S[2]);
  s.occ = document.createElement('canvas'); s.occ.width = 1080; s.occ.height = 1920; s.occ.style.cssText = 'position:absolute;left:0;top:0;width:1080px;height:1920px'; S[2].appendChild(s.occ);
  s.wk = D('left:150px;top:520px;width:440px;background:rgba(18,17,15,.86);border:2px solid rgba(239,233,220,.3);padding:16px 18px', '<div class="lab">WEEKEND BUILD</div><div style="display:flex;gap:8px;margin-top:12px"><div style="flex:1;height:34px;background:#2a2723"><div class="sa" style="height:100%;background:' + LI + ';width:0"></div></div><div style="flex:1;height:34px;background:#2a2723"><div class="su" style="height:100%;background:' + LI + ';width:0"></div></div></div><div style="display:flex;justify-content:space-between;font:700 22px/1 JM;margin-top:10px"><span>SAT</span><span>SUN</span><span class="cnt" style="color:' + LI + '">1 / 7 APPS</span></div>', S[2]);
  s.free = D('left:700px;top:545px;background:' + LI + ';color:' + INK + ';font:800 82px/1 BC;padding:6px 22px;box-shadow:6px 6px 0 ' + INK + ';transform-origin:50% 50%', 'FREE', S[2]);
  var cn = ['PHOTOCRAFT', 'FILMCRAFT', 'VECTORCRAFT', 'LIGHTCRAFT', 'EFFECTCRAFT', 'DESIGNCRAFT', 'PRINTCRAFT'];
  s.grid = D('left:150px;top:952px;width:440px;display:grid;grid-template-columns:1fr 1fr;gap:8px', '', S[2]);
  s.cp = cn.map(function (n) { var c = D('position:relative;font:700 20px/1 JM;letter-spacing:.06em;padding:11px 12px;border:2px solid #4a463e;color:#6a665c;background:rgba(18,17,15,.8)', n, s.grid); return c; });
  s.tag = aitag(S[2], 'AI IMAGE · MOCAP ROBOTS · ILLUSTRATIVE', 'left:150px;top:1254px');
})(A.s3);
// ===== S4 : "software is over?" =====
A.s4 = {}; (function (s) {
  s.tab = tab(S[3], '// "SOFTWARE IS OVER"');
  s.l1 = D('left:150px;top:222px;font:800 178px/.88 BC;letter-spacing:-.01em;color:' + BN + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap;transform-origin:0 70%', 'SOFTWARE', S[3]);
  s.l2 = D('left:150px;top:380px;font:800 178px/.88 BC;letter-spacing:-.01em;color:' + LI + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap;transform-origin:0 70%', 'IS OVER', S[3]); s.q = D('left:0;top:372px;font:800 230px/.9 BC;color:' + OR + ';transform-origin:50% 90%;text-shadow:0 8px 24px rgba(0,0,0,.6)', '?', S[3]);
  s.at = D('left:150px;top:690px;width:190px;font:700 20px/1.4 JM;color:' + GR, '— BRANDON THOMAS,<br>ARTCRAFT<br>DEVELOPER', S[3]); s.sk = ['SEVEN APPS', 'ONE WEEKEND', 'FREE'].map(function (t, i) { return D('left:150px;top:' + (850 + i * 90) + 'px;width:180px;text-align:center;background:' + (i === 2 ? LI : BN) + ';color:' + INK + ';font:800 34px/1 BC;padding:12px 8px;transform:rotate(' + (i % 2 ? 2 : -2) + 'deg);box-shadow:0 8px 18px rgba(0,0,0,.45)', t, S[3]); }); s.qm = D('left:150px;top:548px;font:800 120px/1 BC;color:' + OR + ';opacity:.9', '“', S[3]);
})(A.s4);
// ===== S5 : open source, written in Rust — invented IDE =====
A.s5 = {}; (function (s) {
  s.tab = tab(S[4], '// OPEN SOURCE, WRITTEN IN RUST');
  var tree = ['photocraft', 'filmcraft', 'vectorcraft', 'lightcraft', 'effectcraft', 'designcraft', 'printcraft'];
  s.ide = win(S[4], 'left:150px;top:250px;width:768px;height:640px', 'artcraft — main', '<div style="position:absolute;left:0;top:40px;width:210px;bottom:0;background:#171512;border-right:2px solid #2a2723;padding:16px 14px;font:700 20px/1.9 JM;color:' + GR + '"><div class="lab" style="margin-bottom:6px;font-size:16px">CRATES</div></div><div class="cd" style="position:absolute;left:226px;top:52px;right:14px;height:370px;font:500 21px/1.5 JM;color:' + BN + ';white-space:pre;overflow:hidden"></div><div style="position:absolute;left:210px;right:0;bottom:0;height:150px;background:#0d0c0a;border-top:2px solid #2a2723;padding:12px 16px;font:500 20px/1.5 JM;color:' + LI + '"><div>$ cargo build --release</div><div class="bp" style="margin-top:8px;height:16px;background:#2a2723"><div class="bf" style="height:100%;background:' + LI + ';width:0"></div></div><div class="bt" style="margin-top:8px;color:' + GR + '"></div></div>');
  s.ideSide = s.ide.children[1]; s.tree = tree.map(function (n) { return D('position:relative;opacity:0;white-space:nowrap', '▸ ' + n, s.ideSide); }); s.cd = s.ide.querySelector('.cd'); s.bf = s.ide.querySelector('.bf'); s.bt = s.ide.querySelector('.bt');
  s.b1 = D('left:150px;top:920px;font-size:22px;background:' + BN + ';color:' + INK, 'MIT', S[4], 'chip'); s.b2 = D('left:232px;top:920px;font-size:22px;background:' + BN + ';color:' + INK, 'APACHE-2.0', S[4], 'chip');
  s.b3 = D('left:410px;top:912px;height:48px;display:flex;align-items:center;gap:10px;padding:0 14px;background:' + BN + ';border-radius:6px;font:700 22px/1 JM;color:' + INK, '<span class="lg" style="width:30px;height:30px;display:block">' + window.LOGO.rust + '</span>RUST', S[4]);
  s.b4 = D('left:150px;top:990px;height:52px;display:flex;align-items:center;gap:12px;padding:0 16px;background:' + LI + ';border-radius:6px;font:700 21px/1 JM;color:' + INK, '<span class="lg" style="width:26px;height:26px;display:block;color:' + INK + '">' + window.LOGO.anthropic + '</span>BUILT WITH CLAUDE OPUS 5.5 (REPORTED)', S[4]);
  s.b5 = D('left:150px;top:1070px;height:48px;display:flex;align-items:center;gap:10px;color:' + BN + ';font:500 21px/1 JM', '<span class="lg" style="width:28px;height:28px;display:block">' + window.LOGO.github + '</span>github.com/storytold/artcraft', S[4]);
})(A.s5);
// ===== S6 : stars on the main repo — real photo + odometer =====
A.s6 = {}; (function (s) {
  s.ph = D('left:-1500px;top:0;width:4000px;height:1920px;background:url(photos/laptop.jpg) center/cover', '', S[5]); s.sh = D('left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(18,17,15,.86),rgba(18,17,15,.5) 40%,rgba(18,17,15,.7))', '', S[5]);
  s.tab = tab(S[5], '// STARS ON THE MAIN REPO');
  s.od = D('left:150px;top:226px;display:flex;gap:6px;align-items:flex-end', '', S[5]); s.dg = [];
  '14,600'.split('').forEach(function (ch) { var d = D('position:relative;' + (ch === ',' ? 'width:34px' : 'width:104px;height:180px;background:' + INK + ';border:4px solid ' + LI + ';border-radius:10px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.5)'), '', s.od); if (ch !== ',') { d.innerHTML = '<div class="ds" style="position:absolute;left:0;right:0;top:0;text-align:center;font:800 172px/180px BC;color:' + BN + '"></div>'; var ds = d.firstChild; ds.innerHTML = '0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0'; s.dg.push([d, ds, +ch]); } else d.innerHTML = '<div style="font:800 120px/190px BC;color:' + BN + '">,</div>'; });
  s.lbl = D('left:150px;top:432px;font:700 24px/1.4 JM;letter-spacing:.06em;color:' + BN, '<span style="color:' + LI + '">★ GITHUB STARS</span> · storytold/artcraft<br><span style="color:' + GR + '">checked 11 Oct 2026 — it keeps moving</span>', S[5]);
  s.st = []; for (var i = 0; i < 9; i++) s.st.push(D('left:' + (560 + (i % 3) * 110) + 'px;top:0;color:' + LI + ';opacity:0', ic('star', 52 + (i % 4) * 10, LI, 2), S[5]));
  s.fig = D('left:620px;top:560px;width:300px;height:380px', window.HUM.st5.replace('<svg ', '<svg width="300" height="380" '), S[5]);
  s.ch = [['SUBSCRIPTION', 'free', 'FREE'], ['UPLOAD', 'local', 'LOCAL'], ['ACCOUNT', 'account', 'NO ACCOUNT']].map(function (c, i) { var e = D('left:150px;top:' + (590 + i * 100) + 'px;width:430px;height:76px;background:rgba(18,17,15,.88);border:2px solid #4a463e;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font:700 28px/1 JM;letter-spacing:.06em', '<span class="o" style="color:' + GR + ';text-decoration:line-through;text-decoration-color:' + OR + ';text-decoration-thickness:4px">' + c[0] + '</span><span class="n" style="color:' + LI + ';opacity:0">' + c[2] + '</span>', S[5]); e.dataset.k = c[1]; return e; });
  s.fk = D('left:150px;top:1000px;display:flex;gap:12px', '<span class="chip" style="position:static;background:' + BN + ';color:' + INK + '">★ 2.3K FORKS</span><span class="chip" style="position:static;background:' + LI + ';color:' + INK + '">MIT / APACHE</span>', S[5]); s.fk2 = D('left:150px;top:1075px;width:440px;font:700 20px/1.5 JM;color:' + BN + ';background:rgba(18,17,15,.88);border:2px solid #4a463e;padding:12px 16px', '<span style="color:' + GR + '">NOTE</span> Stars are interest, not users.<br>Alpha software, one maintainer.', S[5]);
  s.tg = aitag(S[5], 'REAL PHOTO · UNSPLASH', 'left:150px;top:1252px');
})(A.s6);
// ===== S7 : the half-of-what's-left fee — Blender turnstile + calendar =====
A.s7 = {}; (function (s) {
  s.tab = tab(S[6], '// THE HALF-OF-WHAT\'S-LEFT FEE');
  s.cal = D('left:150px;top:236px;width:768px;display:grid;grid-template-columns:repeat(6,1fr);gap:8px', '', S[6]); s.tiles = [];
  for (var m = 0; m < 12; m++) { var paid = m < 6; var t = D('position:relative;height:96px;border:3px solid ' + (paid ? BN : OR) + ';background:' + (paid ? 'rgba(239,233,220,.92)' : 'repeating-linear-gradient(135deg,rgba(255,106,19,.35) 0 10px,rgba(18,17,15,.8) 10px 20px)') + ';color:' + INK + ';font:800 36px/1 BC;padding:10px 12px', '<div class="lab" style="font-size:15px;color:' + (paid ? '#6a665c' : BN) + '">' + (paid ? 'PAID' : 'LEFT') + '</div>', s.cal); s.tiles.push(t); }
  s.sp = D('left:110px;top:560px;width:500px;height:448px;background-repeat:no-repeat;background-size:contain;filter:drop-shadow(0 20px 20px rgba(0,0,0,.45))', '', S[6]);
  s.meter = D('left:560px;top:560px;width:150px;height:300px;background:rgba(18,17,15,.88);border:3px solid ' + BN + ';padding:14px 14px', '<div class="lab" style="font-size:15px">FEE</div><div style="position:relative;margin-top:10px;height:220px;background:#2a2723"><div class="fl" style="position:absolute;left:0;right:0;bottom:0;background:' + OR + ';height:0"></div><div style="position:absolute;left:-8px;right:-8px;top:50%;height:4px;background:' + BN + '"></div></div><div style="font:800 30px/1 BC;margin-top:10px;color:' + BN + ';text-align:center">HALF</div>', S[6]);
  s.half = D('left:735px;top:560px;width:183px;font:800 76px/.9 BC;color:' + OR + ';text-shadow:0 6px 16px rgba(0,0,0,.6)', '50%<div style="font:700 22px/1.3 JM;color:' + BN + ';margin-top:8px;letter-spacing:.04em">OF WHAT\'S LEFT</div>', S[6]);
  s.fm = D('left:150px;top:1110px;width:440px;background:rgba(18,17,15,.9);border:3px solid ' + OR + ';padding:12px 16px', '<div class="lab" style="font-size:15px;color:' + OR + '">ANNUAL PLAN, PAID MONTHLY</div><div style="font:800 36px/1.1 BC;color:' + BN + ';margin-top:6px">REMAINING PAYMENTS × <span style="color:' + OR + '">50%</span> = FEE</div>', S[6]);
  s.tg = aitag(S[6], 'AI IMAGE · 3D RENDER · ILLUSTRATIVE MONTHS', 'left:150px;top:1252px');
})(A.s7);
// ===== S8 : $150M =====
A.s8 = {}; (function (s) {
  s.ph = D('left:-1200px;top:0;width:3600px;height:1920px;background:url(photos/towers.jpg) center/cover', '', S[7]); D('left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(18,17,15,.88),rgba(18,17,15,.55) 45%,rgba(18,17,15,.8))', '', S[7]); s.phEl = s.ph;
  s.tab = tab(S[7], '// A PROPOSED $150M DEAL');
  s.big = D('left:150px;top:222px;font:800 330px/.84 BC;letter-spacing:-.02em;color:' + BN + ';text-shadow:0 10px 30px rgba(0,0,0,.65);white-space:nowrap;transform-origin:0 70%', '$150<span style="color:' + OR + '">M</span>', S[7]);
  s.bar = D('left:150px;top:520px;width:768px;height:110px;display:flex', '<div class="b1" style="width:50%;height:100%;background:' + OR + ';color:' + INK + ';font:800 33px/110px BC;padding:0 12px;white-space:nowrap">$75M PENALTY</div><div class="b2" style="width:50%;height:100%;background:' + LI + ';color:' + INK + ';font:800 33px/110px BC;padding:0 12px;white-space:nowrap">$75M FREE SERVICES</div>', S[7]);
  s.sub = D('left:150px;top:644px;display:flex;justify-content:space-between;width:768px;font:700 20px/1 JM;letter-spacing:.08em;color:' + BN, '<span>CIVIL PENALTY</span><span>FREE SERVICES TO CUSTOMERS</span>', S[7]);
  s.stamp = D('left:150px;top:740px;border:7px solid ' + OR + ';color:' + OR + ';font:800 70px/1 BC;padding:6px 22px;letter-spacing:.04em;background:rgba(18,17,15,.7);transform-origin:50% 50%', 'PROPOSED · 13 MAR 2026', S[7]);
  s.law = D('left:150px;top:890px;width:440px;background:rgba(18,17,15,.88);border:2px solid rgba(239,233,220,.3);padding:14px 16px;font:700 21px/1.45 JM;color:' + BN, '<div class="lab" style="font-size:15px">US DEPARTMENT OF JUSTICE · ROSCA CASE</div>Restore Online Shoppers\' Confidence Act', S[7]);
  s.sc = D('left:150px;top:1040px;display:flex;gap:14px;align-items:center;color:' + BN, ic('scale', 70, BN, 1.6) + '<span style="font:700 22px/1.3 JM;color:' + BN + '">NEEDS COURT APPROVAL</span>', S[7]);
  s.trk = D('left:150px;top:1130px;width:440px;background:rgba(18,17,15,.9);border:2px solid rgba(239,233,220,.3);padding:12px 16px', '<div class="lab" style="font-size:15px">WHERE THE DEAL STANDS</div><div style="display:flex;align-items:center;gap:10px;margin-top:10px"><span class="chip" style="position:static;background:' + LI + ';color:' + INK + ';font-size:18px">PROPOSED · 13 MAR</span><span style="flex:1;height:4px;background:repeating-linear-gradient(90deg,' + BN + ' 0 8px,transparent 8px 14px)"></span><span class="chip" style="position:static;border:2px dashed ' + OR + ';color:' + OR + ';font-size:18px">COURT: PENDING</span></div>', S[7]);
  s.tg = aitag(S[7], 'REAL PHOTO · UNSPLASH', 'left:150px;top:1252px');
})(A.s8);
// ===== S9 : two readings, one fee — and one alpha =====
A.s9 = {}; (function (s) {
  s.tab = tab(S[8], '// TWO READINGS, ONE FEE');
  s.gov = win(S[8], 'left:150px;top:240px;width:768px;height:200px;transform-origin:0 0', 'THE GOVERNMENT ALLEGED', '<div style="padding:18px 22px;font:800 46px/1.05 BC;color:' + BN + '"><span style="background:linear-gradient(transparent 55%,rgba(255,106,19,.7) 55%)">FEE OBSCURED IN FINE PRINT</span><br><span style="background:linear-gradient(transparent 55%,rgba(255,106,19,.7) 55%)">CANCELLING DRAWN OUT</span></div>');
  s.adb = win(S[8], 'left:150px;top:470px;width:768px;height:180px;transform-origin:0 0', 'ADOBE', '<div style="padding:18px 22px;font:800 56px/1.05 BC;color:' + BN + '">DENIES WRONGDOING</div><div class="ap" style="position:absolute;right:18px;bottom:16px;font:700 20px/1 JM;color:' + INK + ';background:' + LI + ';padding:8px 12px">NEEDS COURT APPROVAL</div>');
  s.fig = D('left:130px;top:690px;width:330px;height:420px', window.HUM.sit4.replace('<svg ', '<svg width="330" height="420" '), S[8]);
  s.issues = D('left:440px;top:700px;width:160px', '', S[8]);
  s.known = D('left:470px;top:700px;width:448px;background:rgba(18,17,15,.88);border:2px solid rgba(239,233,220,.3);padding:12px 16px;font:700 19px/1.55 JM;color:' + BN, '<div class="lab" style="font-size:15px">KNOWN ISSUES (REPORTED)</div><div class="ki"></div>', S[8]);
  s.alpha = D('left:150px;top:720px;border:8px solid ' + LI + ';color:' + LI + ';font:800 80px/1 BC;padding:6px 22px;background:rgba(18,17,15,.8);letter-spacing:.04em;transform-origin:50% 50%', 'SUPER EARLY ALPHA', S[8]);
  s.tg = aitag(S[8], 'ILLUSTRATION · HUMAAANS', 'left:150px;top:1252px');
})(A.s9);
// ===== S10 : from a month to months — gauge =====
A.s10 = {}; (function (s) {
  s.tab = tab(S[9], '// FROM A MONTH TO MONTHS');
  s.h = D('left:150px;top:230px;font:800 150px/.88 BC;letter-spacing:-.01em;color:' + BN + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap', '100%<span style="color:' + OR + '"> → </span><span style="color:' + LI + '">99%</span>', S[9]);
  var svg = '<svg width="768" height="450" viewBox="0 0 768 450"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="' + OR + '"/><stop offset="1" stop-color="' + LI + '"/></linearGradient></defs><path d="M60 400 A324 324 0 0 1 708 400" fill="none" stroke="#2a2723" stroke-width="50" stroke-linecap="round"/><path class="gf" d="M60 400 A324 324 0 0 1 708 400" fill="none" stroke="url(#gg)" stroke-width="50" stroke-linecap="round" stroke-dasharray="0 1100"/>';
  [[.14, '1 MONTH'], [.5, 'MONTHS'], [.86, 'YEARS']].forEach(function (k) { var a = Math.PI * (1 - k[0]), x = 384 + Math.cos(a) * 372, y = 400 - Math.sin(a) * 372; svg += '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="JM" font-weight="700" font-size="20" fill="#8a867c">' + k[1] + '</text>'; });
  for (var i = 0; i <= 10; i++) { var a = Math.PI * (1 - i / 10); svg += '<line x1="' + (384 + Math.cos(a) * 292) + '" y1="' + (400 - Math.sin(a) * 292) + '" x2="' + (384 + Math.cos(a) * 262) + '" y2="' + (400 - Math.sin(a) * 262) + '" stroke="#8a867c" stroke-width="4"/>'; }
  svg += '<g class="nd"><line x1="384" y1="400" x2="384" y2="150" stroke="' + BN + '" stroke-width="12" stroke-linecap="round"/></g><circle cx="384" cy="400" r="26" fill="' + BN + '" stroke="' + INK + '" stroke-width="8"/></svg>';
  s.g = D('left:150px;top:470px;width:768px;height:450px', svg, S[9]); s.nd = s.g.querySelector('.nd'); s.gf = s.g.querySelector('.gf');
  s.mm = D('left:150px;top:850px;width:768px;text-align:center;font:800 54px/1 BC;color:' + BN, '1 MONTH', S[9]); s.mm.style.top = '905px'; s.mm.style.width = '768px';
  s.c1 = D('left:150px;top:985px;width:440px;background:' + BN + ';color:' + INK + ';padding:14px 18px;box-shadow:0 14px 30px rgba(0,0,0,.5)', '<div class="lab" style="font-size:16px;color:#6a665c">REDDIT · THE PROMISE</div><div style="font:800 42px/1 BC;margin-top:6px;white-space:nowrap">100% PARITY <span style="color:' + OR + '">IN A MONTH</span></div>', S[9]);
  s.c2 = D('left:150px;top:1110px;width:440px;background:' + LI + ';color:' + INK + ';padding:14px 18px;box-shadow:0 14px 30px rgba(0,0,0,.5)', '<div class="lab" style="font-size:16px;color:#3b4a0a">HACKER NEWS · THE REVISION</div><div style="font:800 42px/1 BC;margin-top:6px;white-space:nowrap">99% PARITY IN <span style="background:' + INK + ';color:' + LI + ';padding:0 8px">MONTHS</span></div>', S[9]);
  s.nt = [D('left:150px;top:380px;width:120px;height:78px;background:' + BN + ';color:' + INK + ';font:800 38px/78px BC;text-align:center;box-shadow:0 12px 24px rgba(0,0,0,.5)', 'TODO', S[9]), D('left:790px;top:380px;width:120px;height:78px;background:' + BN + ';color:' + INK + ';font:800 38px/78px BC;text-align:center;box-shadow:0 12px 24px rgba(0,0,0,.5)', 'BUGS', S[9])];
  s.tg = aitag(S[9], 'ATTRIBUTED QUOTES', 'left:150px;top:1252px');
})(A.s10);
// ===== S11 : not yet — the exit got a rival =====
A.s11 = {}; (function (s) {
  s.tab = tab(S[10], '// THE EXIT GOT A RIVAL');
  s.ny = D('left:150px;top:222px;font:800 230px/.86 BC;letter-spacing:-.02em;color:' + BN + ';text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap;transform-origin:0 70%', 'NOT <span style="color:' + LI + '">YET.</span>', S[10]);
  s.sp = D('left:90px;top:560px;width:480px;height:430px;background-repeat:no-repeat;background-size:contain;filter:drop-shadow(0 20px 20px rgba(0,0,0,.45))', '', S[10]);
  s.door = D('left:600px;top:540px;width:300px;height:340px;border:6px solid ' + LI + ';background:rgba(198,241,53,.12);overflow:hidden', '<div class="dp" style="position:absolute;left:0;top:0;width:150px;height:100%;background:' + LI + ';opacity:.85"></div><div class="dq" style="position:absolute;right:0;top:0;width:150px;height:100%;background:' + LI + ';opacity:.85"></div><div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:800 40px/1 BC;color:' + INK + '">OPEN</div>', S[10]);
  s.sub = D('left:150px;top:940px;width:440px;background:rgba(18,17,15,.88);border:3px solid ' + OR + ';padding:14px 18px;box-shadow:0 16px 34px rgba(0,0,0,.5)', '<div style="display:flex;align-items:center;gap:12px;color:' + OR + '">' + ic('lock', 40, OR, 2.4) + '<span style="font:800 44px/1 BC;color:' + BN + '">SUBSCRIPTION</span></div><div class="lab" style="margin-top:8px;font-size:16px;color:' + OR + '">FEE: HALF OF WHAT\'S LEFT</div>', S[10]);
  s.fre = D('left:150px;top:1090px;width:440px;background:rgba(18,17,15,.88);border:3px solid ' + LI + ';padding:14px 18px;box-shadow:0 16px 34px rgba(0,0,0,.5)', '<div style="display:flex;align-items:center;gap:12px;color:' + LI + '"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="' + LI + '" stroke-width="2.4" stroke-linecap="round"><circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="5" r="2.2"/><circle cx="12" cy="19" r="2.2"/><path d="M6 7.5v2.5c0 1.5 1.5 2.5 3 2.5h6c1.5 0 3-1 3-2.5V7.5M12 12.5v4.5"/></svg><span style="font:800 44px/1 BC;color:' + BN + '">FREE ALPHA</span></div><div class="lab" style="margin-top:8px;font-size:16px;color:' + LI + '">FORKABLE · BUGS INCLUDED</div>', S[10]);
  s.vs = D('left:455px;top:1062px;width:84px;height:84px;border-radius:50%;background:' + BN + ';color:' + INK + ';font:800 44px/84px BC;text-align:center;border:5px solid ' + INK + ';z-index:3', 'VS', S[10]);
  s.tg = aitag(S[10], 'AI IMAGE · 3D RENDER', 'left:150px;top:1252px');
})(A.s11);
// ===== S12 : the question + the call to action =====
A.s12 = {}; (function (s) {
  s.q = win(S[11], 'left:150px;top:940px;width:768px;height:330px', 'ARE YOU SURE YOU WANT TO SWAP?', '<div style="padding:22px 26px"><div style="font:800 60px/1 BC;color:' + BN + '">A SUBSCRIPTION FOR A <span style="color:' + LI + '">FREE ALPHA</span> YOU CAN FORK?</div><div style="display:flex;gap:18px;margin-top:22px"><div class="sw" style="flex:1;height:84px;background:' + LI + ';color:' + INK + ';font:800 50px/84px BC;text-align:center;border-radius:8px">SWAP</div><div class="sy" style="flex:1;height:84px;background:' + OR + ';color:' + INK + ';font:800 50px/84px BC;text-align:center;border-radius:8px">STAY</div></div></div>');
  s.cta = win(S[11], 'left:150px;top:940px;width:768px;height:330px', 'follow.sh', '<div style="padding:22px 26px;display:flex;gap:26px;align-items:center"><div class="rg" style="flex:none;width:220px;height:220px;border-radius:50%;background:url(profile.jpg) center/cover;border:10px solid ' + BN + ';box-shadow:0 0 0 8px ' + LI + ',0 14px 30px rgba(0,0,0,.5)"></div><div><div style="font:800 58px/1 BC;letter-spacing:-.01em;color:' + BN + ';white-space:nowrap">@sandesh.explains</div><div style="font:500 22px/1.3 JM;color:' + GR + ';margin-top:8px">$ follow --for "the next one"</div><div class="fo" style="margin-top:16px;width:360px;height:82px;border-radius:41px;background:' + LI + ';color:' + INK + ';font:800 52px/82px BC;text-align:center;box-shadow:0 12px 24px rgba(198,241,53,.35)">FOLLOW</div></div></div>');
  s.sw = s.q.querySelector('.sw'); s.sy = s.q.querySelector('.sy'); s.fo = s.cta.querySelector('.fo'); s.rg = s.cta.querySelector('.rg');
})(A.s12);
// ---------------- persistent: rail, caption, host ----------------
var rail = D('', '<b></b>', st); rail.id = 'rail'; var railB = rail.firstChild; SC.slice(1).forEach(function (t) { var m = document.createElement('i'); m.style.left = (t / DUR * 100) + '%'; rail.appendChild(m); });
var cap = D('', '', st); cap.id = 'cap';
var host = D('', '<div class="in"><div class="tb"><i style="background:' + OR + '" class="rec"></i><i style="background:#555"></i><i style="background:#555"></i><span style="margin-left:6px">cam · alpha</span></div><canvas width="720" height="720"></canvas></div>', st); host.id = 'host';
var hIn = host.querySelector('.in'), hCv = host.querySelector('canvas'), hRec = host.querySelector('.rec');
var hv = document.createElement('video'); hv.muted = true; hv.preload = 'auto'; hv.playsInline = true; hv.src = 'host.webm'; hv.style.cssText = 'position:absolute;width:2px;height:2px;opacity:0;pointer-events:none'; document.body.appendChild(hv);
function hostPaint() { try { hCv.getContext('2d').drawImage(hv, 60, 0, 600, 600, 0, 0, 720, 720); } catch (e) { } }
function vseek(v, tt) { return new Promise(function (res) { if (!v.duration) { res(); return; } if (Math.abs(v.currentTime - tt) < 1e-4 && v.readyState >= 2) { res(); return; } var done = false; function fin() { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); } v.addEventListener('seeked', fin); v.currentTime = tt; setTimeout(fin, 4000); }); }
function hostAt(t) { var f = Math.max(0, Math.min(1751, Math.floor(t * 24 + 1e-6))); return vseek(hv, (f + .5) / 24).then(hostPaint); }
var POSE = { A: [190, 540, 700], B: [618, 914, 300], C: [350, 650, 540], D: [210, 190, 660] };
var HT = [[3.35, 3.95, 'A', 'B'], [10.15, 10.7, 'B', 'C'], [14.2, 14.75, 'C', 'B'], [64.05, 64.8, 'B', 'D']];
function hostPose(t) { var cur = 'A', fr = null; for (var i = 0; i < HT.length; i++) { var h = HT[i]; if (t >= h[1]) cur = h[3]; else if (t >= h[0]) { fr = h; break; } else break; } var p = POSE[cur]; if (fr) { var u = sm((t - fr[0]) / (fr[1] - fr[0])), a = POSE[fr[2]], b = POSE[fr[3]]; p = [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; } return p; }
// overlays: real-footage textures (VP9 webm, seek-driven)
var OV = {}; function ovl(id, src, blend, op) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.className = 'vid'; v.style.mixBlendMode = blend; v.style.opacity = op; v.style.zIndex = 5; st.appendChild(v); OV[id] = { v: v }; }
ovl('dust', 'dust-particles.webm', 'screen', .7); ovl('leak', 'light-leak-dust.webm', 'screen', .25); ovl('grain', 'film-grain.webm', 'multiply', .5);
function ovAt(id, on, t, fps) { var o = OV[id]; o.v.style.display = on ? 'block' : 'none'; if (!on || !o.v.duration) return Promise.resolve(); var d = o.v.duration, tt = (t % d), f = Math.floor(tt * fps); return vseek(o.v, Math.min(d - .01, (f + .5) / fps)); }
// ---------------- depth for the occlusion mask ----------------
var DEP = {}; function loadDepth(id) { return new Promise(function (res) { var im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = im.width; c.height = im.height; var x = c.getContext('2d'); x.drawImage(im, 0, 0); DEP[id] = { w: im.width, h: im.height, d: x.getImageData(0, 0, im.width, im.height).data }; res(); }; im.onerror = function () { res(); }; im.src = 'depth/' + id + '.png'; }); }
function dAt(id, px, py) { var D0 = DEP[id]; if (!D0) return 0; var x = clamp(Math.round(px * (D0.w - 1)), 0, D0.w - 1), y = clamp(Math.round(py * (D0.h - 1)), 0, D0.h - 1); return D0.d[(y * D0.w + x) * 4] / 255; }
function dispDepth(id, sx, sy, cam) { var u = sx / 1080, v = 1 - sy / 1920; var px = (u - .5) / cam[2] + .5, py = (v - .5) / cam[2] + .5; var dep = dAt(id, px, 1 - py); var ox = cam[0] * (dep - .42) * .06, oy = cam[1] * (dep - .42) * .06; var qx = clamp(px + ox, .002, .998), qy = clamp(py + oy, .002, .998); return dAt(id, qx, 1 - qy); }
// ---------------- scenes: photo + camera ----------------
var PH = [null, null, 'workshop', null, null, null, 'lobby', null, null, null, 'lobby', null];
var MOVES = { 2: function (u) { return [lerp(-.5, .5, u), 0, lerp(1.08, 1.2, u)]; }, 6: function (u) { return [lerp(.3, -.2, u), .05, lerp(1.0, 1.14, u)]; }, 10: function (u) { return [lerp(-.2, .3, u), .05, lerp(1.12, 1.0, u)]; } };
var DIMS = { 2: 1, 6: .8, 10: .85 };
// captions
var PAGES = (function () { var pages = [], cur = []; WD.forEach(function (w, i) { var len = cur.reduce(function (a, j) { return a + WD[j].w.length + 1; }, 0) + w.w.length; var prev = cur.length ? WD[cur[cur.length - 1]] : null; if (cur.length && (len > 52 || (prev && /[.?!]$/.test(prev.w)) || prev.p !== w.p)) { pages.push(cur); cur = []; } cur.push(i); }); if (cur.length) pages.push(cur); return pages; })();
function drawCap(t) { var last = 0; for (var i = 0; i < WD.length; i++) if (t >= WD[i].s - .02) last = i; var page = PAGES.filter(function (p) { return p.indexOf(last) >= 0; })[0] || [0], out = [], line = '', len = 0; page.forEach(function (i) { if (i > last) return; var w = WD[i].w, h = i === last ? '<b>' + w + '</b>' : w; if (len + w.length + (len ? 1 : 0) > 27 && line) { out.push(line); line = ''; len = 0; } line += (len ? ' ' : '') + h; len += w.length + (len ? 1 : 0); }); out.push(line); cap.innerHTML = out.join('<br>'); }
var DEPS = {}; PH.forEach(function (p) { if (p) DEPS[p] = 1; });
var TSF = []; for (var q = 0; q < 12; q++) TSF.push('3d/ts_' + (q < 10 ? '0' : '') + q + '.png');
var ready = Promise.all([window.GLP.load(Object.keys(DEPS)), loadDepth('workshop'), new Promise(function (r) { hv.addEventListener('loadeddata', r); setTimeout(r, 8000); }), Promise.all(['dust', 'leak', 'grain'].map(function (k) { return new Promise(function (r) { OV[k].v.addEventListener('loadeddata', r); setTimeout(r, 6000); }); })), Promise.all(TSF.map(function (u) { return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = u; }); })), document.fonts.ready]).then(function () { window.__ready = true; return window.__seek(0); });
var glc = document.getElementById('gl'), flat = document.getElementById('flat');
// robots with depth occlusion (S3)
var RB = [[.56, 1.2, .08, 'PREMIERE', .0], [.5, .95, .35, 'ILLUSTRATOR', .37], [.45, .74, .6, 'LIGHTROOM', .8]];
function robotImgDraw(svg) { return new Promise(function (res) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg); }); }
function robotsDraw(t) {
  var c = A.s3.occ.getContext('2d'); c.clearRect(0, 0, 1080, 1920); var lt = t - SC[2]; if (lt < 0 || lt > SC[3] - SC[2]) return Promise.resolve();
  var u = lt / (SC[3] - SC[2]), cam = MOVES[2](u), z = cam[2], jobs = [];
  RB.forEach(function (r, i) { var sc = .86 * z * r[1], spd = RIG.speed('walk') * .86 * r[1] * .85, pu = r[2] + (lt * spd) / (1080 * z) - .1, pv = r[0];
    var sx = ((pu - .5) * z + .5) * 1080, sy = (1 - ((1 - pv - .5) * z + .5)) * 1920, P = RIG.sample('walk', (lt + r[4]) , { loop: true, inplace: true }), body = RIG.svg(P, 'robot', { pal: { body: '#efe9dc', back: '#9a9486', edge: '#12110f', joint: LI, inner: OR } });
    var mx = (P.hL[0] + P.hR[0]) / 2 + 10, my = -(P.hL[1] + P.hR[1]) / 2 - 8;
    var crate = '<g transform="translate(' + mx + ',' + my + ')"><rect x="-70" y="-50" width="140" height="100" rx="6" fill="#b88650" stroke="#12110f" stroke-width="6"/><rect x="-70" y="-50" width="140" height="26" fill="' + OR + '"/><text x="0" y="22" font-family="JM" font-weight="700" font-size="17" text-anchor="middle" fill="#12110f">' + r[3] + '</text></g>';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (520 * sc) + '" height="' + (480 * sc) + '" viewBox="-260 -430 520 480">' + body + crate + '</svg>';
    jobs.push(robotImgDraw(svg).then(function (im) { if (!im) return; var W0 = 520 * sc, H0 = 480 * sc, x0 = sx - W0 / 2, y0 = sy - H0 * (430 / 480), bx = Math.max(0, Math.floor(x0)), by = Math.max(0, Math.floor(y0)), bw = Math.min(1080 - bx, Math.ceil(W0)), bh = Math.min(1920 - by, Math.ceil(H0)); if (bw <= 0 || bh <= 0) return;
      var tc = document.createElement('canvas'); tc.width = bw; tc.height = bh; var x = tc.getContext('2d'); x.drawImage(im, x0 - bx, y0 - by, W0, H0); var d0 = x.getImageData(0, 0, bw, bh), d = d0.data, fd = dispDepth('workshop', sx, sy, cam) + 0.05, G = 6;
      for (var gy = 0; gy < bh; gy += G) for (var gx = 0; gx < bw; gx += G) { if (!(dispDepth('workshop', bx + gx + G / 2, by + gy + G / 2, cam) > fd)) continue; for (var yy = gy; yy < Math.min(bh, gy + G); yy++) for (var xx = gx; xx < Math.min(bw, gx + G); xx++) d[(yy * bw + xx) * 4 + 3] = 0; }
      x.putImageData(d0, 0, 0); return { tc: tc, bx: bx, by: by }; }));
  });
  return Promise.all(jobs).then(function (rs) { rs.forEach(function (r) { if (r) c.drawImage(r.tc, r.bx, r.by); }); });
}
function tsFrame(el, ang) { var f = Math.floor(((ang % 120) + 120) % 120 / 10) % 12; el.style.backgroundImage = 'url(' + TSF[f] + ')'; }
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var si = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
  var s0 = SC[si], s1 = si < SC.length - 1 ? SC[si + 1] : DUR, lt = t - s0, len = s1 - s0, u = lt / len, TR = .24, k = (t > s1 - TR && si < 11) ? (t - (s1 - TR)) / TR : -1;
  scenes.forEach(function (s, i) { s.style.display = i === si ? 'block' : 'none'; s.style.opacity = (i === si && k >= 0) ? 1 - sm(k * 1.6) : 1; s.style.transform = (i === si && k >= 0) ? 'translateX(' + (-60 * sm(k)) + 'px)' : ''; });
  var eb = tabs[si]; if (eb) { var q = bounce(seg(lt, 0, .3)); eb.style.transform = 'rotate(-1.5deg) translateX(' + ((1 - q) * -160) + 'px)'; eb.style.opacity = seg(lt, 0, .08); }
  // background: photo (GL) / flat ink + wall/rain
  var isGL = PH[si] !== null, nxt = si < 11 ? PH[si + 1] : undefined, nGL = si < 11 && nxt !== null, cam = isGL ? MOVES[si](u) : null, pa = PH[si], pb = null, mix = 0, camB = null, whip = 0, flatOp = isGL ? 0 : 1;
  if (k >= 0) { whip = Math.sin(k * Math.PI) * .06; if (isGL && nGL) { pb = nxt; mix = sm(k * 1.25 - .1); camB = MOVES[si + 1](0); } else if (isGL && !nGL) flatOp = sm(k * 1.3 - .1); else if (!isGL && nGL) { pa = nxt; cam = MOVES[si + 1](0); flatOp = 1 - sm(k * 1.3 - .1); } }
  flat.style.opacity = flatOp; glc.style.opacity = (flatOp >= .999) ? 0 : 1;
  var m = mixAt(t), fxOp = flatOp; if (si === 6) fxOp = Math.max(flatOp, .3 * (k >= 0 ? 1 - k : 1)); if (si === 10) fxOp = Math.max(flatOp, .12);
  fx.style.opacity = fxOp; var P1 = 130 * m - 15; wallEl.style.transform = 'translateY(' + (-(t * 16) % 240) + 'px)'; rainEl.style.transform = 'translateY(' + ((t * 70) % 220) + 'px)';
  wallEl.style.webkitMaskImage = wallEl.style.maskImage = 'linear-gradient(115deg,transparent ' + (P1 - 12) + '%,#000 ' + (P1 + 12) + '%)'; rainEl.style.webkitMaskImage = rainEl.style.maskImage = 'linear-gradient(115deg,#000 ' + (P1 - 12) + '%,transparent ' + (P1 + 12) + '%)'; wallEl.style.maskImage = wallEl.style.webkitMaskImage; rainEl.style.maskImage = rainEl.style.webkitMaskImage;
  if (pa) window.GLP.draw({ a: pa, b: pb, mix: mix, camA: cam, camB: camB, whip: whip, wdir: [1, 0], par: .06, dim: (DIMS[si] || 1) * (1 - .06 * seg(lt, len - .3, len)), flash: 0, t: t });
  var f = [u0, u1, u2, u3, u4, u5, u6, u7, u8, u9, u10, u11][si]; var jolt = f(t, len) || 0; st.style.transform = jolt ? 'translate(' + (Math.sin(t * 90) * jolt * 12) + 'px,' + (Math.cos(t * 70) * jolt * 10) + 'px)' : '';
  // persistent
  railB.style.width = (t / DUR * 100) + '%';
  var hp = hostPose(t), hs = hp[2] / 700; host.style.transform = 'translate(' + hp[0] + 'px,' + hp[1] + 'px) scale(' + hs + ')'; var trap = (si === 0 || (si >= 6 && si <= 8) || (si === 9 && t < 55)); var bc = trap ? OR : LI;
  if (t > wt('free') && t < wt('free') + .6) bc = LI; if (t > wt('fee') && t < wt('fee') + .5) bc = OR; hIn.style.borderColor = bc; hRec.style.background = bc; host.style.display = 'block';
  drawCap(t);
  var jobs = [hostAt(t)];
  jobs.push(ovAt('dust', si === 0 || si === 3 || si === 11, t, 25)); jobs.push(ovAt('leak', si === 3, t, 30)); jobs.push(ovAt('grain', si === 5 || si === 7, t, 30));
  A.s3.occ.style.display = si === 2 ? 'block' : 'none'; if (si === 2) jobs.push(robotsDraw(t));
  return Promise.all(jobs);
};
// ---------------- per-scene motion (all take ABSOLUTE t) ----------------
function u0(t) { var s = A.s1; s.w.forEach(function (e, i) { var at = wt(s.wk[i]); var p = 1 + .2 * pop(t, at, .35); e.style.transform = 'scale(' + p + ') rotate(' + (-1.2 * pop(t, at, .35)) + 'deg)'; });
  pin(s.mod, t, .1, { d: .35, s0: .6, y: 40 }); var shake = t > wt('fee') && t < wt('fee') + .45 ? Math.sin(t * 80) * 6 * (1 - (t - wt('fee')) / .45) : 0; var close = bounce(seg(t, 3.0, 3.3)); if (t >= .1) s.mod.style.transform = 'translateX(' + shake + 'px) scale(' + (t > 3.0 ? 1 - sm((t - 3.0) / .3) : 1) + ')'; s.mod.style.opacity = t < .1 ? 0 : (t > 3.3 ? 0 : 1);
  var blk = s.mod.querySelector('.blk'); blk.style.opacity = Math.floor(t * 4) % 2 ? .45 : 1; var kp = s.mod.querySelector('.kp'); kp.style.transform = 'scale(' + (1 + .04 * Math.sin(t * 6)) + ')';
  var cx = t < 1.2 ? lerp(640, 520, seg(t, 0, 1.2)) : t < 2.5 ? lerp(520, 540, seg(t, 1.2, 2.5)) : lerp(540, 860, seg(t, 2.5, 3.0)), cy = t < 1.2 ? lerp(820, 1075, seg(t, 0, 1.2)) : t < 2.5 ? lerp(1075, 1228, seg(t, 1.2, 2.5)) : lerp(1228, 1022, seg(t, 2.5, 3.0));
  s.cur.style.left = cx + 'px'; s.cur.style.top = cy + 'px'; s.cur.style.opacity = t < 3.3 ? 1 : 0; var rp = pop(t, 3.0, .35); s.rip.style.left = (860 - 14) + 'px'; s.rip.style.top = (1022 - 14) + 'px'; s.rip.style.opacity = rp ? rp : 0; s.rip.style.transform = 'scale(' + (1 + (1 - rp) * 1.2) + ')'; return pop(t, wt('fee') + .05, .3) * .6; }
function u1(t) { var s = A.s2, lt = t - SC[1], e = seg(t, 3.5, 5.6); pin(s.h, t, SC[1] + .02, { d: .4, y: -40, s0: .9 }); s.cn.style.transform = 'rotateX(60deg) rotateZ(' + lerp(-48, -26, e) + 'deg)';
  var sp = lerp(220, 92, e); s.slabs.forEach(function (sl, i) { var at = 3.5 + i * .2, up = sm((t - at) / .3); sl.style.opacity = t < at ? 0 : 1; sl.style.transform = 'translateZ(' + ((i - 2) * sp + (1 - up) * 400) + 'px)'; });
  s.lb.forEach(function (l, i) { pin(l, t, 3.7 + i * .2, { d: .3, x: 60, s0: .6, r: -2 }); }); pin(s.ar, t, wt('photoshop') - .1, { d: .35, y: 30, s0: .8 }); pin(s.cl, t, wt('rebuilt') || 3.9, { d: .3, s0: .8 });
  var lines = ['// git log (illus.)', 'feat: layers', 'feat: masks', 'feat: PSD i/o', 'fix: undo', 'feat: adjust', 'feat: filters'], n = clamp(Math.floor((t - 3.6) / .32), 0, lines.length); s.git.innerHTML = lines.slice(0, n).map(function (l, i) { return '<div style="' + (i === 0 ? 'color:' + GR : '') + '">' + l + '</div>'; }).join('') + '<span style="opacity:' + (Math.floor(t * 3) % 2 ? 0 : 1) + '">▌</span>'; return 0; }
function u2(t) { var s = A.s3, lt = t - SC[2]; pin(s.h1, t, SC[2] + .02, { d: .35, y: -30, s0: .9 }); pin(s.h2, t, SC[2] + .2, { d: .35, y: -30, s0: .9 }); pin(s.wk, t, SC[2] + .1, { d: .35, x: -80, s0: .9 });
  var e = seg(t, SC[2] + .2, SC[3] - .4); s.wk.querySelector('.sa').style.width = (clamp(e * 2, 0, 1) * 100) + '%'; s.wk.querySelector('.su').style.width = (clamp(e * 2 - 1, 0, 1) * 100) + '%';
  var n = 1; s.cp.forEach(function (c, i) { var at = i === 0 ? 0 : i === 1 ? wt('premiere') : wt('five') + (i - 2) * .38 + .2; var on = t >= at; if (on && i > 0) n = Math.max(n, i + 1); c.style.background = on ? LI : 'rgba(18,17,15,.8)'; c.style.color = on ? INK : '#6a665c'; c.style.borderColor = on ? LI : '#4a463e'; c.style.transform = 'scale(' + (1 + .12 * pop(t, at, .3)) + ')'; }); s.wk.querySelector('.cnt').textContent = n + ' / 7 APPS';
  pin(s.free, t, wt('free') - .05, { d: .3, s0: 2.4, rot: 12, r: 6 }); s.free.style.opacity = t < wt('free') - .05 ? 0 : 1; return pop(t, wt('five'), .3) * .3; }
function u3(t) { var s = A.s4, lt = t - SC[3]; pin(s.l1, t, SC[3] + .02, { d: .35, y: -40, s0: .9 }); pin(s.l2, t, wt('says') - .1, { d: .4, x: -80, s0: .9 }); var qa = wt('it') - .15; s.q.style.left = '610px'; s.q.style.opacity = t < qa ? 0 : 1; s.q.style.transform = 'rotate(' + (t < qa ? 0 : Math.sin((t - qa) * 5) * 10 * Math.exp(-(t - qa) * .6) + 8) + 'deg) scale(' + (t < qa ? 1 : 1 + .5 * (1 - bounce(seg(t, qa, qa + .35))) * -1 + 0.0) + ')';
  pin(s.at, t, wt('says') + .6, { d: .3, y: 20, s0: .9 }); s.sk.forEach(function (e, i) { pin(e, t, SC[3] + .3 + i * .18, { d: .3, x: -60, s0: .8, r: i % 2 ? 2 : -2 }); }); pin(s.qm, t, wt('says') - .1, { d: .3, s0: .6 }); s.l2.style.opacity = t < wt('says') - .1 ? .0 : 1; return pop(t, qa, .3) * .6; }
function u4(t) { var s = A.s5, lt = t - SC[4]; pin(s.ide, t, SC[4] + .05, { d: .4, y: 60, s0: .94 });
  s.tree.forEach(function (e, i) { var at = SC[4] + .8 + i * .22; e.style.opacity = t >= at ? 1 : 0; e.style.color = t >= at ? (t >= wt('rust') ? LI : BN) : GR; });
  var code = 'fn composite(layers: &[Layer]) -> Image {\n    layers.iter().fold(\n        Image::empty(),\n        |acc, l| acc.blend(l),\n    )\n}\n\n// clean-room: behaviour, not source\nfn open_psd(b: &[u8]) -> Doc {\n    Doc::from_layers(parse(b))\n}'; var n = Math.floor(clamp((t - (SC[4] + .6)) / 4.4, 0, 1) * code.length); s.cd.textContent = code.slice(0, n) + (Math.floor(t * 3) % 2 ? '' : '▌');
  var bp = seg(t, SC[4] + 2, wt('opus') + .5); s.bf.style.width = (bp * 100) + '%'; s.bt.textContent = bp >= 1 ? 'Finished release [optimized] — 7 binaries' : 'Compiling artcraft…';
  pin(s.b1, t, wt('rust') - .2, { d: .3, y: 20, s0: .6 }); pin(s.b2, t, wt('rust') - .1, { d: .3, y: 20, s0: .6 }); pin(s.b3, t, wt('rust'), { d: .3, y: 20, s0: .6 }); pin(s.b4, t, wt('opus') - .1, { d: .35, x: -60, s0: .8 }); pin(s.b5, t, wt('main'), { d: .3, y: 20, s0: .8 }); return pop(t, wt('opus') + .5, .3) * .3; }
function u5(t) { var s = A.s6, lt = t - SC[5], u = lt / (SC[6] - SC[5]); s.ph.style.left = lerp(-1400, -2000, u) + 'px'; s.ph.style.transform = 'scale(' + lerp(1.0, 1.08, u) + ')'; pin(s.od, t, SC[5] + .05, { d: .35, y: -30, s0: .9 }); pin(s.lbl, t, SC[5] + .4, { d: .3, y: 20, s0: .9 });
  var tgt = clamp(seg(t, SC[5] + .3, wt('14,000') + .6), 0, 1), val = [1, 4, 6, 0, 0]; s.dg.forEach(function (d, i) { var dv = d[2], v = tgt >= 1 ? dv : (i < 2 ? dv : Math.floor(tgt * 10 * (i + 1)) % 10); var prog = tgt >= 1 ? dv : (tgt * 10 * (i + 1)) % 10; d[1].style.transform = 'translateY(' + (-(tgt >= 1 ? dv : (i < 2 ? dv : prog)) * 180) + 'px)'; });
  s.st.forEach(function (e, i) { var at = SC[5] + .8 + i * .35, ph = ((t - at) / 2.2); var on = ph >= 0 && ph <= 1; e.style.opacity = on ? Math.sin(ph * Math.PI) : 0; e.style.top = (on ? lerp(560, 260, ph) : 560) + 'px'; });
  pin(s.fk, t, SC[5] + .3, { d: .3, y: 30, s0: .9 }); pin(s.fk2, t, SC[5] + .45, { d: .3, y: 30, s0: .9 }); pin(s.fig, t, SC[5] + .3, { d: .5, x: 100, s0: .9 }); s.fig.style.transform += ' translateY(' + (Math.sin(t * 3) * 4) + 'px)';
  s.ch.forEach(function (c, i) { var at = i === 0 ? wt('free') : i === 1 ? wt('local') : wt('account'); pin(c, t, SC[5] + .6 + i * .15, { d: .3, x: -80, s0: .9 }); var nn = c.querySelector('.n'); nn.style.opacity = t >= at ? 1 : 0; c.style.borderColor = t >= at ? LI : '#4a463e'; c.style.transform += ' scale(' + (1 + .02 * pop(t, at, .3)) + ')'; }); return 0; }
function u6(t) { var s = A.s7, lt = t - SC[6]; tsFrame(s.sp, 0);
  s.tiles.forEach(function (tl, i) { var at = SC[6] + .05 + i * .03; pin(tl, t, at, { d: .25, y: -30, s0: .8 }); });
  var ws = [wt('cancel'), wt('monthly'), wt('annual')]; var halfAt = wt('half'); var spin = t < halfAt ? (t - SC[6]) * 260 : (halfAt - SC[6]) * 260 + 40 * (1 - Math.exp(-(t - halfAt) * 6)) * 0;
  tsFrame(s.sp, spin); s.sp.style.backgroundImage = s.sp.style.backgroundImage; pin(s.sp, t, SC[6] + .1, { d: .4, y: 80, s0: .92 }); pin(s.meter, t, SC[6] + .15, { d: .35, x: 40, s0: .8 });
  var fill = clamp(seg(t, wt('cancel'), wt('left')) , 0, 1); s.meter.querySelector('.fl').style.height = (fill * 50) + '%'; s.meter.querySelector('.fl').style.background = OR;
  s.tiles.forEach(function (tl, i) { if (i < 6) return; var on = t >= halfAt - .1 && i < 9; tl.style.borderColor = on ? LI : OR; tl.style.background = on ? 'rgba(198,241,53,.22)' : tl.style.background; var lb = tl.firstChild; if (on) { lb.textContent = 'FEE'; lb.style.color = LI; } });
  pin(s.fm, t, SC[6] + .2, { d: .35, y: 40, s0: .9 }); pin(s.half, t, halfAt - .1, { d: .35, s0: 1.8, rot: -6 }); s.half.style.opacity = t < halfAt - .1 ? 0 : 1; return pop(t, halfAt, .35) * .8 + pop(t, wt('left') + .1, .3) * .3; }
function u7(t) { var s = A.s8, lt = t - SC[7], u = lt / (SC[8] - SC[7]); s.ph.style.left = lerp(-900, -1500, u) + 'px'; pin(s.big, t, SC[7] + .03, { d: .45, s0: 1.5, y: -30 }); s.bar.style.opacity = seg(t, SC[7] + .3, SC[7] + .5); var sp = seg(t, wt('million') - .2, wt('million') + .6); s.bar.firstChild.style.width = lerp(100, 50, sp) + '%'; s.bar.lastChild.style.width = lerp(0, 50, sp) + '%'; s.bar.lastChild.style.opacity = sp > .1 ? 1 : 0; s.sub.style.opacity = sp;
  pin(s.stamp, t, wtp(3, 'settlement') + .1, { d: .3, s0: 2.4, rot: 10, r: -4 }); s.stamp.style.opacity = t < wtp(3, 'settlement') + .1 ? 0 : 1; pin(s.law, t, SC[7] + .45, { d: .3, x: -60, s0: .9 }); pin(s.trk, t, SC[7] + .3, { d: .3, y: 30, s0: .9 }); pin(s.sc, t, wtp(3, 'settlement') + .5, { d: .3, y: 20, s0: .9 }); return pop(t, wtp(3, 'settlement') + .1, .35) * .8; }
function u8(t) { var s = A.s9, lt = t - SC[8]; pin(s.gov, t, SC[8] + .1, { d: .4, x: -300, s0: 1 }); pin(s.adb, t, wt('denies') - .2, { d: .4, x: 300, s0: 1 }); var ap = s.adb.querySelector('.ap'); ap.style.opacity = t >= wt('judge') - .4 ? 1 : 0; ap.style.transform = 'scale(' + (1 + .2 * pop(t, wt('judge') - .4, .3)) + ')';
  pin(s.fig, t, SC[8] + .4, { d: .45, x: -140, s0: .9 }); pin(s.known, t, SC[8] + .55, { d: .35, y: 40, s0: .9 }); var ki = ['basic functionality problems reported', 'one developer, seven apps to maintain', 'look-alike UI: trade-dress question (Ars Technica)'], n = clamp(Math.floor((t - wt('brandon') - .4) / .5), 0, 3); s.known.querySelector('.ki').innerHTML = ki.slice(0, n).map(function (x) { return '<div>▸ ' + x + '</div>'; }).join('');
  pin(s.alpha, t, wt('alpha') - .1, { d: .3, s0: 1.7, rot: -8, r: -4 }); s.alpha.style.opacity = t < wt('alpha') - .1 ? 0 : 1; s.alpha.style.left = '280px'; s.alpha.style.top = '1090px'; return pop(t, wt('alpha') - .1, .3) * .7; }
function u9(t) { var s = A.s10, lt = t - SC[9]; pin(s.h, t, SC[9] + .02, { d: .4, y: -30, s0: .9 }); var pr = wtp(4, 'promised'), nw = wt('now'), ms = wtp(4, 'months'); pin(s.g, t, SC[9] + .1, { d: .4, y: 40, s0: .92 });
  var fr = t < nw ? .14 : lerp(.14, .5, seg(t, nw, ms)), ang = (fr - .14) / .72 * 0; var A0 = Math.PI * (1 - fr); s.nd.setAttribute('transform', 'rotate(' + ((fr - .5) * 180) + ' 384 400)'); s.gf.setAttribute('stroke-dasharray', (fr * 1017) + ' 1100'); s.mm.textContent = t < nw + .8 ? '1 MONTH' : 'MONTHS'; s.mm.style.color = t < nw + .8 ? BN : LI; s.mm.style.transform = 'scale(' + (1 + .15 * pop(t, nw + .8, .3)) + ')'; pin(s.mm, t, SC[9] + .3, { d: .3, s0: .8 }); s.mm.style.transform += ' scale(' + (1 + .15 * pop(t, nw + .8, .3)) + ')';
  pin(s.c1, t, pr - .1, { d: .35, x: -80, s0: .9, r: -1.5 }); pin(s.c2, t, nw - .1, { d: .35, x: -80, s0: .9, r: 1.2 }); s.nt.forEach(function (e, i) { pin(e, t, SC[9] + .5 + i * .2, { d: .4, y: -60, s0: .8, r: i ? 8 : -8 }); }); return pop(t, nw + .8, .3) * .3; }
function u10(t) { var s = A.s11, lt = t - SC[10]; pin(s.ny, t, SC[10] + .02, { d: .4, y: -30, s0: .9 }); s.ny.style.transform += ' scale(1)'; var ys = wt('yet'); s.ny.style.opacity = t < SC[10] + .02 ? 0 : 1;
  var spin = t < ys ? (t - SC[10]) * 260 : (ys - SC[10]) * 260; tsFrame(s.sp, spin); pin(s.sp, t, SC[10] + .3, { d: .5, y: 80, s0: .92 }); var op = seg(t, wt('rival') - .2, wt('rival') + .7); s.door.querySelector('.dp').style.transform = 'translateX(' + (-150 * op) + 'px)'; s.door.querySelector('.dq').style.transform = 'translateX(' + (150 * op) + 'px)'; pin(s.door, t, wt('subscriptions') - .2 || SC[10] + 3, { d: .4, x: 80, s0: .9 });
  var ta = wt('subscriptions') - .1; pin(s.sub, t, ta, { d: .35, x: -120, s0: 1 }); pin(s.fre, t, wt('rival') - .1, { d: .35, x: -120, s0: 1 }); pin(s.vs, t, wt('rival') - .3, { d: .3, s0: .3, rot: 40 }); s.vs.style.opacity = t < wt('rival') - .3 ? 0 : 1; return pop(t, ys, .35) * .8; }
function u11(t) { var s = A.s12, ta = wt('tell'); var qIn = seg(t, wtp(5, 'would') - .3, wtp(5, 'would') + .2); s.q.style.opacity = t < ta ? qIn : 1 - seg(t, ta - .1, ta + .2); s.q.style.transform = 'scale(' + (t < ta ? .9 + .1 * qIn : 1 - .05 * seg(t, ta, ta + .3)) + ')'; s.q.style.display = t < ta + .3 ? 'block' : 'none';
  var sw = wt('swap'); s.sw.style.transform = 'scale(' + (1 + .08 * pop(t, sw, .4) + .04 * Math.sin(t * 6) * (t > sw ? 1 : 0)) + ')'; s.sy.style.opacity = t > wt('fork') ? .5 : 1;
  var cp = bounce(seg(t, ta, ta + .45)); s.cta.style.opacity = t < ta ? 0 : 1; s.cta.style.transform = 'translateY(' + ((1 - cp) * 60) + 'px) scale(' + (.94 + .06 * cp) + ')'; s.cta.style.display = t >= ta - .02 ? 'block' : 'none'; s.rg.style.transform = 'scale(' + (1 + .04 * Math.sin(t * 3)) + ')';
  var fo = wt('follow'); s.fo.style.transform = 'scale(' + (1 + .1 * pop(t, fo, .4) + (t > fo + .4 ? .04 * Math.sin(t * 6) : 0)) + ')'; s.fo.style.background = t > fo ? LI : '#8a9a3a'; return 0; }
})();
