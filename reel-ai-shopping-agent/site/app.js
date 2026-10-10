// "Checkout Lane" — every layer is a pure function of t. Voice = the creator's avatar clips (word times in timing.js).
(function () {
'use strict';
var SC = window.SC, WD = window.WD, DUR = window.TOTAL; window.__reelDurationSec = DUR;
var AM = '#ffd23a', GP = '#23272d', MG = '#ff2d6f', PP = '#faf7ee', MN = '#2fd6a3', WH = '#f3f6f8';
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return sm((t - a) / (b - a)); }
function bounce(x) { x = clamp(x, 0, 1); var s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); }
function wt(k, n) { k = k.replace(/[.,?!]/g, ''); var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } return 0; }
function wtp(p, k, n) { var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } return 0; }
var st = document.getElementById('st');
function D(css, html, par, cls) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; if (cls) e.className = cls; (par || st).appendChild(e); return e; }
function ic(n, sz, col, sw) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" style="flex:none">' + window.IC[n] + '</svg>'; }
function pin(el, t, at, o) { o = o || {}; var p = bounce(seg(t, at, at + (o.d || 0.35))), s0 = o.s0 == null ? 0.7 : o.s0; el.style.opacity = t < at ? 0 : 1; el.style.transform = 'translate(' + ((o.x || 0) * (1 - p)) + 'px,' + ((o.y || 0) * (1 - p)) + 'px) rotate(' + ((o.r || 0) + (o.rot || 0) * (1 - p)) + 'deg) scale(' + (s0 + (1 - s0) * p) + ')'; }
function pop(t, at, d) { var x = t - at; return x < 0 || x > (d || .3) ? 0 : 1 - x / (d || .3); }
var scenes = [], tabs = [];
function scene() { var s = D('left:0;top:0;width:1080px;height:1920px', null, st, 'sc'); scenes.push(s); return s; }
function tab(par, txt) { var e = D('', txt, par, 'tab'); tabs.push(e); return e; }
function aitag(par, txt, css) { return D(css || 'left:150px;top:1244px', txt || 'AI IMAGE', par, 'tag'); }
D('', null, st).id = 'scrim';
// ---------------- scene containers + their parts ----------------
var S = [], A = {};
for (var i = 0; i < 10; i++) S.push(scene());
// ===== S1 : the aisle, a 3D cart, kinetic headline =====
A.s1 = {}; (function (s) {
  s.tab = tab(S[0], '// THE AISLE, 6 A.M.');
  s.w = [['SOON ', 'soon'], ['YOU ', 'you'], ['WON\'T', 'won\'t']].map(function (w, i) { return D('left:150px;top:' + (265 + i * 0) + 'px;font:800 124px/.96 PJ;letter-spacing:-.035em;color:#eef3f6;text-shadow:0 6px 18px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.8);white-space:nowrap', w[0], S[0]); });
  s.w[0].style.top = '262px'; s.w[1].style.top = '262px'; s.w[1].style.left = '560px'; s.w[2].style.top = '372px';
  s.shop = D('left:150px;top:486px;font:800 124px/.96 PJ;letter-spacing:-.035em;white-space:nowrap', '<span class="hl">SHOP.</span>', S[0]);
  s.stk = D('left:380px;top:648px;width:500px;height:104px;border-radius:52px;background:' + MG + ';color:#fff;font:800 50px/104px PJ;letter-spacing:-.01em;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.45);border:5px solid #fff', 'YOUR AI WILL.', S[0]);
  s.cart = D('left:0;top:618px;width:760px;height:844px;background:url(3d/cart.png) center/contain no-repeat;filter:drop-shadow(0 22px 22px rgba(0,0,0,.45))', '', S[0]);
  s.tag = aitag(S[0], 'AI IMAGE · 3D RENDER');
})(A.s1);
// ===== S2 : the wish, typed =====
A.s2 = {}; (function (s) {
  s.tab = tab(S[1], '// THE WISH, TYPED ONCE');
  s.chat = D('left:150px;top:250px;width:768px;height:410px;background:' + PP + ';border-radius:34px;box-shadow:0 26px 56px rgba(0,0,0,.5);overflow:hidden', '', S[1]);
  D('left:0;top:0;width:768px;height:84px;background:' + GP + ';color:' + AM + ';font:400 36px/84px VT;letter-spacing:.08em;padding:0 30px', 'YOUR ASSISTANT · ONLINE', s.chat);
  s.dot = D('right:30px;top:30px;width:22px;height:22px;border-radius:50%;background:' + MN, '', s.chat);
  s.bub = D('right:28px;top:116px;max-width:640px;background:' + MG + ';color:#fff;border-radius:30px 30px 8px 30px;padding:24px 32px;font:800 56px/1.1 PJ;letter-spacing:-.02em;min-width:90px', '', s.chat);
  s.bub.style.position = 'absolute';
  s.send = D('right:28px;top:300px;width:84px;height:84px;border-radius:50%;background:' + AM + ';display:flex;align-items:center;justify-content:center;color:' + GP, ic('send', 40), s.chat);
  s.typ = D('left:28px;top:300px;background:#e6e3d6;border-radius:30px 30px 30px 8px;padding:30px 36px;display:flex;gap:12px', '<i></i><i></i><i></i>', s.chat);
  s.dots = [].slice.call(s.typ.children).map(function (d) { d.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#7a828c;display:block'; return d; });
  s.hum = D('left:130px;top:740px;width:380px;height:480px', window.HUM.sit2.replace('<svg ', '<svg width="380" height="480" '), S[1]);
  s.glow = D('left:70px;top:800px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(255,45,111,.35),transparent 65%)', '', S[1]);
  s.ch = [['RUNNING', 'left:400px;top:760px', 'running'], ['SHOES', 'left:400px;top:850px', 'shoes'], ['BUDGET', 'left:400px;top:940px', 'under']].map(function (c) { var e = D(c[1], ic('tag', 28, MG, 2.6) + c[0], S[1], 'chip'); e.style.fontSize = '28px'; e.style.padding = '10px 20px'; e.dataset.k = c[2]; return e; });
  s.tag = aitag(S[1], 'AI IMAGE · HUMAAANS');
})(A.s2);
// ===== S3 : the errand — a robot in the aisle, shelves in front of it =====
A.s3 = {}; (function (s) {
  s.tab = tab(S[2], '// THE ERRAND, WHILE YOU SLEEP');
  s.occ = document.createElement('canvas'); s.occ.width = 1080; s.occ.height = 1920; s.occ.style.cssText = 'position:absolute;left:0;top:0;width:1080px;height:1920px'; S[2].appendChild(s.occ);
  s.list = D('left:150px;top:250px;width:520px;height:330px;background:' + PP + ';border-radius:26px;box-shadow:0 22px 48px rgba(0,0,0,.5);padding:24px 30px', '<div class="lab">SHELF LIST</div>', S[2]);
  s.rows = ['BROWSE', 'COMPARE', 'CHECK OUT'].map(function (n, i) { var r = D('position:relative;margin-top:' + (i ? 16 : 14) + 'px;height:72px;display:flex;align-items:center;gap:18px;font:800 46px/1 PJ;letter-spacing:-.02em', '<span style="width:56px;height:56px;border-radius:14px;border:5px solid ' + GP + ';display:flex;align-items:center;justify-content:center;color:#fff;flex:none"></span>' + n, s.list); r.firstChild.className = 'bx'; r.style.position = 'relative'; return r; });
  s.moon = D('left:688px;top:250px;width:218px;height:218px;border-radius:50%;background:' + GP + ';border:6px solid ' + AM + ';display:flex;flex-direction:column;align-items:center;justify-content:center;color:' + AM + ';font:400 36px/1 VT;letter-spacing:.08em;box-shadow:0 18px 40px rgba(0,0,0,.5)', ic('moon', 92, AM, 1.8) + '<div style="margin-top:6px">ZZZ</div>', S[2]);
  s.bagtag = D('left:688px;top:490px;width:218px', '<div style="background:' + MG + ';color:#fff;border-radius:16px;padding:10px 12px;font:800 28px/1.1 PJ;text-align:center">WHILE YOU SLEEP</div>', S[2]);
  s.tag = aitag(S[2], 'AI IMAGE · MOCAP ROBOT', 'left:150px;top:1244px');
})(A.s3);
// ===== S4 : the wrong box arrives; the receipt prints =====
A.s4 = {}; (function (s) {
  s.tab = tab(S[3], '// A DELIVERY NOBODY ORDERED');
  s.note = D('left:150px;top:262px;width:768px;height:150px;background:' + GP + ';border-radius:26px;box-shadow:0 22px 48px rgba(0,0,0,.5);display:flex;align-items:center;gap:22px;padding:0 34px;color:' + WH + ';font:800 44px/1.05 PJ;letter-spacing:-.02em', '<div style="width:84px;height:84px;border-radius:50%;background:' + MN + ';display:flex;align-items:center;justify-content:center;color:' + GP + '">' + ic('check', 52, GP, 3.4) + '</div><div>ORDER PLACED<div class="lab" style="color:' + AM + ';margin-top:8px;font-size:24px">BY YOUR ASSISTANT · WHILE YOU SLEPT</div></div>', S[3]);
  s.clip = D('left:150px;top:260px;width:330px;height:640px;overflow:hidden', '', S[3]);
  var lines = ['SOMEBODY\'S MARKET', '- - - - - - - - - - -', 'RUNNING SHOES   NO', 'RUNNING SHOES   NO', 'RUNNING SHOES   NO', 'RUNNING SHOES   NO', 'RUNNING SHOES   NO', 'RUNNING SHOES   NO', '- - - - - - - - - - -', 'TOTAL         OOPS'];
  s.rc = D('left:0;top:0;width:330px;font-size:34px;padding:22px 20px 46px;line-height:1.14', lines.map(function (l, i) { return '<div class="ln" style="opacity:0;white-space:pre">' + l + '</div>'; }).join(''), s.clip, 'rc'); s.rc.style.position = 'absolute';
  s.lines = [].slice.call(s.rc.querySelectorAll('.ln'));
  s.boxes = D('left:500px;top:380px;width:430px;height:526px;background:url(3d/boxes.png) center/contain no-repeat;filter:drop-shadow(0 20px 20px rgba(0,0,0,.5));transform-origin:50% 100%', '', S[3]);
  s.stamp = D('left:500px;top:300px;border:7px solid ' + MG + ';color:' + MG + ';background:rgba(250,247,238,.92);font:800 54px/1 PJ;padding:8px 18px;border-radius:12px;transform:rotate(-8deg);letter-spacing:.02em', 'WRONG THING', S[3]);
  s.tag = aitag(S[3], 'AI IMAGE · 3D RENDER');
})(A.s4);
// ===== S5 : the shared rulebook, partners tap on =====
A.s5 = {}; (function (s) {
  s.tab = tab(S[4], '// A HALL PASS FOR YOUR ASSISTANT');
  s.str = D('left:318px;top:-40px;width:8px;height:300px;background:#aab3bb;transform-origin:50% 0', '', S[4]);
  s.pass = D('left:162px;top:230px;width:330px;height:390px;background:' + WH + ';border-radius:26px;box-shadow:0 26px 52px rgba(0,0,0,.5);transform-origin:50% -30px;padding:30px 28px', '<div style="width:90px;height:16px;border-radius:8px;background:' + GP + ';margin:0 auto 22px"></div><div class="lab">AGENT PASS</div><div style="font:800 44px/1 PJ;letter-spacing:-.03em;margin-top:14px">VISITING <span style="color:' + MG + '">ASSISTANT</span></div><div style="margin-top:22px;display:flex;gap:12px;align-items:center;color:' + MN + '">' + ic('shield-check', 56, MN, 2.2) + '<span class="lab" style="color:#5d6670;font-size:22px">ID · RULES · LIMIT</span></div>', S[4]);
  s.pos = D('left:500px;top:230px;width:418px;height:390px', '<div class="scr" style="padding:22px 26px"><div class="lab">SHARED RULEBOOK</div></div>', S[4], 'pos');
  s.chips = [['SIERRA', 'sierra', null], ['META', 'meta,', null], ['WALMART', 'walmart', null], ['', 'stripe', 'stripe']].map(function (c, i) { var e = D('left:' + (524 + (i % 2) * 196) + 'px;top:' + (322 + Math.floor(i / 2) * 134) + 'px;width:182px;height:112px;border-radius:20px;background:#fff;border:3px solid #dfe5ea;display:flex;align-items:center;justify-content:center;font:800 32px/1 PJ;letter-spacing:-.01em;color:' + GP + ';box-shadow:0 8px 18px rgba(0,0,0,.18)', c[2] === 'stripe' ? '<div style="width:130px">' + window.stripeSvg.replace('<svg ', '<svg width="130" ') + '</div>' : c[0], S[4]); e.dataset.k = c[1]; return e; });
  s.draft = D('left:150px;top:690px;border:8px solid ' + AM + ';color:' + AM + ';font:800 62px/1 PJ;padding:12px 24px;border-radius:12px;transform:rotate(-5deg);background:rgba(35,39,45,.8);letter-spacing:.04em', 'DRAFT SPEC', S[4]);
  s.sub = D('left:150px;top:850px;width:420px;font:800 44px/1.08 PJ;letter-spacing:-.02em;color:#eef3f6;text-shadow:0 4px 14px rgba(0,0,0,.6)', 'NAMED PARTNERS, ONE <span style="color:' + AM + '">RULEBOOK</span>', S[4]);
  s.flow = D('left:150px;top:960px;width:440px;height:250px;background:rgba(35,39,45,.88);border-radius:24px;border:3px solid rgba(243,246,248,.5);padding:20px 24px', '<div class="lab" style="color:#cfd6dc;font-size:22px">HOW THE PASS WORKS</div><div style="display:flex;align-items:center;justify-content:space-between;margin-top:26px;color:#eef3f6"><div style="text-align:center">' + ic('users', 64, '#eef3f6', 1.8) + '<div class="lab" style="color:#eef3f6;font-size:20px;margin-top:8px">YOU</div></div>' + ic('arrow-right', 40, AM, 3) + '<div style="text-align:center">' + ic('robot', 64, MG, 1.8) + '<div class="lab" style="color:#eef3f6;font-size:20px;margin-top:8px">AGENT</div></div>' + ic('arrow-right', 40, AM, 3) + '<div style="text-align:center">' + ic('receipt', 64, MN, 1.8) + '<div class="lab" style="color:#eef3f6;font-size:20px;margin-top:8px">STORE</div></div></div><div class="fx" style="position:absolute;left:30px;top:214px;width:60px;height:12px;border-radius:6px;background:' + AM + '"></div>', S[4]); s.tag = aitag(S[4], 'AI IMAGE · PARTNER NAMES', 'left:150px;top:1244px');
})(A.s5);
// ===== S6 : who / what / how much — flat vector scene =====
A.s6 = {}; (function (s) {
  s.tab = tab(S[5], '// THREE PERMISSIONS');
  s.card = D('left:150px;top:250px;width:768px;height:430px;background:#fff;border-radius:28px;box-shadow:0 22px 50px rgba(35,39,45,.22);border:4px solid ' + GP, '', S[5]);
  function row(top, label, k) { var r = D('left:0;top:' + top + 'px;width:768px;height:140px;padding:0 34px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px dashed #d6dde3', '<div><div class="lab" style="font-size:22px;color:' + MG + '">' + k + '</div><div style="font:800 52px/1.05 PJ;letter-spacing:-.025em;margin-top:6px">' + label + '</div></div>', s.card); r.style.borderBottom = top > 200 ? 'none' : ''; return r; }
  s.r1 = row(0, 'WHO YOU ARE', 'PERMISSION 1'); s.r2 = row(145, 'WHAT IT MAY DO', 'PERMISSION 2'); s.r3 = row(290, 'WHAT IT MAY SPEND', 'PERMISSION 3');
  s.tg = [s.r1, s.r2, s.r3].map(function (r) { var t = D('position:relative;width:128px;height:72px;border-radius:36px;background:#cdd5db;flex:none', '<div style="position:absolute;left:6px;top:6px;width:60px;height:60px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.3)"></div>', r); t.style.position = 'relative'; return t; });
  s.sub = D('left:0;top:84px;display:flex;gap:10px', '', s.r2); s.sub.style.position = 'absolute'; s.sub.style.left = '34px'; s.sub.style.top = '100px';
  s.hum = D('left:140px;top:700px;width:260px;height:330px', window.HUM.st20.replace('<svg ', '<svg width="260" height="330" '), S[5]);
  s.bot = D('left:400px;top:690px;width:280px;height:365px', '', S[5]);
  s.passc = D('left:300px;top:800px;width:150px;height:94px;border-radius:14px;background:' + AM + ';border:5px solid ' + GP + ';box-shadow:0 10px 20px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:' + GP, ic('shield-check', 52, GP, 2.4), S[5]);
  s.limit = D('left:150px;top:1060px;width:430px;height:150px;background:#fff;border:4px solid ' + GP + ';border-radius:22px;padding:22px 26px;box-shadow:0 14px 30px rgba(35,39,45,.2)', '<div class="lab" style="font-size:22px">SPEND CAP</div><div style="position:relative;margin-top:26px;height:22px;border-radius:11px;background:#dfe5ea"><div class="fl" style="position:absolute;left:0;top:0;bottom:0;border-radius:11px;background:' + MG + '"></div><div class="kn" style="position:absolute;top:-14px;width:50px;height:50px;border-radius:50%;background:#fff;border:5px solid ' + GP + '"></div></div><div style="margin-top:22px;font:800 27px/1 PJ;letter-spacing:-.01em">THE ASSISTANT STOPS HERE.</div>', S[5]);
  s.tagv = aitag(S[5], 'ILLUSTRATION', 'left:150px;top:1244px');
})(A.s6);
// ===== S7 : who pays? the balance never settles =====
A.s7 = {}; (function (s) {
  s.tab = tab(S[6], '// THE BILL NOBODY OWNS');
  s.q = D('left:150px;top:246px;font:800 188px/.9 PJ;letter-spacing:-.05em;color:#eef3f6;text-shadow:0 8px 24px rgba(0,0,0,.6);white-space:nowrap', '<span style="display:inline-block">WHO</span><br><span class="hl" style="font-size:188px;padding:0 24px 8px">PAYS?</span>', S[6]);
  s.sc = D('left:170px;top:420px;width:560px;height:560px', '', S[6]);
  function L(img) { return D('left:0;top:0;width:560px;height:560px;background:url(3d/' + img + '.png) 0 0/560px 560px no-repeat', '', s.sc); }
  s.stand = L('scale_stand'); s.beam = L('scale_beam'); s.beam.style.transformOrigin = '50% 38.1%'; s.pl = L('scale_pan'); s.pr = L('scale_pan');
  function lab(txt) { return D('left:0;top:0;width:200px;font:800 28px/1 PJ;text-align:center;color:' + GP + ';background:' + PP + ';padding:8px 10px;border-radius:10px;box-shadow:0 8px 16px rgba(0,0,0,.4)', txt, S[6]); }
  s.ll = lab('THE STORE'); s.lr = lab('THE AI MAKER'); s.lr.style.width = '230px';
  function half(cl) { return D('left:0;top:0;width:150px;height:64px;background:' + PP + ';clip-path:' + cl + ';display:flex;align-items:center;justify-content:center;font:400 30px/1 VT;color:' + GP, 'RECEIPT', S[6]); }
  s.rl = half('polygon(0 8%,12% 0,26% 10%,40% 0,56% 12%,70% 2%,86% 14%,100% 4%,100% 100%,0 100%)'); s.rr = half('polygon(0 4%,14% 14%,30% 2%,44% 12%,60% 0,76% 10%,90% 0,100% 8%,100% 100%,0 100%)');
  s.torn = D('left:150px;top:1010px;width:430px;height:210px', '', S[6]);
  s.t1 = D('left:0;top:0;width:200px;height:210px;background:' + PP + ';padding:18px 16px;font:400 30px/1.1 VT;color:' + GP + ';clip-path:polygon(0 0,100% 0,92% 12%,100% 24%,90% 36%,100% 48%,92% 60%,100% 72%,90% 84%,100% 100%,0 100%);box-shadow:0 14px 30px rgba(0,0,0,.5)', 'RUNNING SHOES<br>NO<br>NO<br>NO<br>TOTAL OOPS', s.torn);
  s.t2 = D('left:230px;top:0;width:200px;height:210px;background:' + PP + ';padding:18px 16px;font:400 30px/1.1 VT;color:' + GP + ';clip-path:polygon(8% 0,100% 0,100% 100%,10% 100%,0 88%,8% 76%,0 64%,10% 52%,0 40%,8% 28%,0 16%);box-shadow:0 14px 30px rgba(0,0,0,.5)', '<span style="color:' + MG + '">WHO</span><br><span style="color:' + MG + '">PAYS</span><br>FOR THIS?', s.torn);
  s.tag = aitag(S[6], 'AI IMAGE · 3D RENDER', 'left:150px;top:1244px');
})(A.s7);
// ===== S8 : two readings of one question — real photo, head to head =====
A.s8 = {}; (function (s) {
  s.tab = tab(S[7], '// WHOSE CHOICE WAS IT?');
  function card(top, k, body, bg, fg) { var c = D('left:150px;top:' + top + 'px;width:768px;padding:26px 34px 30px;background:' + bg + ';color:' + fg + ';border-radius:24px;box-shadow:0 22px 48px rgba(0,0,0,.55)', '<div class="lab" style="color:' + (bg === PP ? '#5d6670' : AM) + ';font-size:24px">' + k + '</div><div style="font:800 56px/1.06 PJ;letter-spacing:-.025em;margin-top:12px">' + body + '</div>', S[7]); return c; }
  s.a = card(246, 'ONE RETAILER\'S TERMS', '“IF YOU LET IT CHOOSE, <span class="m" style="background:linear-gradient(transparent 55%,' + AM + ' 55%) 0 0/0% 100% no-repeat">THE CHOICE IS YOURS.</span>”', PP, GP);
  s.b = card(560, 'MERCHANTS', '“THE AI COMPANY <span style="color:' + AM + '">SHOULD COVER IT.</span>”', GP, '#eef3f6');
  s.vs = D('left:462px;top:496px;width:156px;height:70px;border-radius:35px;background:' + MG + ';color:#fff;font:800 40px/70px PJ;text-align:center;border:5px solid #fff;box-shadow:0 10px 24px rgba(0,0,0,.4)', 'VS', S[7]);
  s.rope = D('left:150px;top:1010px;width:420px;height:180px;background:rgba(35,39,45,.82);border-radius:22px;border:3px solid rgba(243,246,248,.5)', '<div style="position:absolute;left:30px;right:30px;top:86px;height:10px;border-radius:5px;background:repeating-linear-gradient(90deg,#d9b46a 0 12px,#b98f45 12px 24px)"></div><div class="lab" style="position:absolute;left:22px;top:22px;font-size:20px;color:#cfd6dc">STORE</div><div class="lab" style="position:absolute;right:22px;top:22px;font-size:20px;color:#cfd6dc">MAKER</div><div class="kn" style="position:absolute;top:66px;width:50px;height:50px;border-radius:50%;background:' + MG + ';border:5px solid #fff"></div><div style="position:absolute;left:0;right:0;bottom:22px;text-align:center;font:800 28px/1 PJ;color:#eef3f6">NO ONE HAS PULLED IT YET</div>', S[7]);
  s.tag = aitag(S[7], 'REAL PHOTO · UNSPLASH', 'left:150px;top:1244px');
})(A.s8);
// ===== S9 : six in ten — a crowd walks out =====
A.s9 = {}; (function (s) {
  s.tab = tab(S[8], '// ONE MISTAKE AND THEY\'RE GONE');
  s.ring = D('left:150px;top:236px;width:360px;height:360px', '<svg width="360" height="360" viewBox="0 0 360 360"><circle cx="180" cy="180" r="140" fill="rgba(35,39,45,.78)"/><circle cx="180" cy="180" r="140" fill="none" stroke="#dfe5ea" stroke-opacity=".35" stroke-width="30"/><circle class="arc" cx="180" cy="180" r="140" fill="none" stroke="' + MG + '" stroke-width="30" stroke-linecap="round" transform="rotate(-90 180 180)" stroke-dasharray="0 880"/></svg><div class="num" style="position:absolute;left:0;top:70px;width:360px;text-align:center;font:800 150px/1 PJ;letter-spacing:-.05em;color:#eef3f6">6</div><div style="position:absolute;left:0;top:222px;width:360px;text-align:center;font:800 54px/1 PJ;letter-spacing:-.02em;color:' + AM + '">IN 10</div>', S[8]);
  s.sv = D('left:560px;top:250px;font:800 36px/1 PJ;letter-spacing:.04em;background:' + AM + ';color:' + GP + ';padding:12px 22px;transform:skewX(-6deg);box-shadow:0 8px 20px rgba(0,0,0,.35)', 'UK SURVEY', S[8]);
  s.big = D('left:560px;top:340px;width:360px;font:800 76px/.98 PJ;letter-spacing:-.04em;color:#eef3f6;text-shadow:0 6px 18px rgba(0,0,0,.6)', 'ONE <span class="hl" style="padding:0 12px 4px">MISTAKE</span>', S[8]);
  s.sm2 = D('left:560px;top:520px;width:358px;font:800 38px/1.1 PJ;letter-spacing:-.02em;color:#eef3f6;text-shadow:0 4px 12px rgba(0,0,0,.6)', 'AND THEY\'D STOP USING IT', S[8]);
  s.crowd = D('left:0;top:560px;width:1080px;height:360px', '', S[8]);
  s.fig = []; for (var i = 0; i < 10; i++) { var g = D('left:0;top:0;width:260px;height:340px', '', s.crowd); s.fig.push(g); }
  s.tally = D('left:150px;top:960px;width:430px;height:240px;background:rgba(35,39,45,.85);border-radius:22px;border:3px solid rgba(243,246,248,.5);padding:20px 26px', '<div class="lab" style="color:#cfd6dc;font-size:22px">AFTER ONE MISTAKE</div>', S[8]);
  s.ppl = []; for (var j = 0; j < 10; j++) { var p = D('left:' + (26 + (j % 5) * 76) + 'px;top:' + (66 + Math.floor(j / 5) * 86) + 'px;width:60px;height:76px', ic('user', 60, '#8b95a0', 2), s.tally); s.ppl.push(p); }
  s.tag = aitag(S[8], 'AI IMAGE · MOCAP', 'left:150px;top:1244px');
})(A.s9);
// ===== S10 : the ask — host on the big kiosk, receipt CTA =====
A.s10 = {}; (function (s) {
  s.ask = D('left:178px;top:928px;', '', S[9]); s.ask.style.display = 'none';
  s.clip = D('left:150px;top:884px;width:768px;height:410px;overflow:hidden', '', S[9]);
  s.rc = D('left:0;top:0;width:768px;height:386px;padding:26px 30px 40px', '<div class="lab" style="font-size:24px">RECEIPT · YOUR CALL</div>', s.clip, 'rc'); s.rc.style.position = 'absolute';
  s.ring = D('left:30px;top:84px;width:236px;height:236px;border-radius:50%;background:url(profile.jpg) center/cover;border:10px solid ' + WH + ';box-shadow:0 0 0 8px ' + MG + ',0 14px 30px rgba(0,0,0,.45)', '', s.rc);
  s.hd = D('left:296px;top:84px;font:800 46px/1 PJ;letter-spacing:-.03em;white-space:nowrap', '@sandesh.explains', s.rc);
  s.sub = D('left:296px;top:146px;width:430px;font:400 36px/1.1 VT;color:#5d6670', 'ONE MISTAKE-PROOF RULE PER REEL.', s.rc); s.sub.innerHTML = 'THE NEXT ONE: WHO PAYS WHEN AN AI SHOPS FOR YOU';
  s.fo = D('left:296px;top:236px;width:430px;height:92px;border-radius:46px;background:' + MG + ';color:#fff;font:800 50px/92px PJ;letter-spacing:.02em;text-align:center;box-shadow:0 12px 24px rgba(255,45,111,.45)', 'FOLLOW', s.rc);
  s.tell = D('left:0;top:0;background:' + AM + ';color:' + GP + ';font:800 40px/1 PJ;padding:14px 26px;border-radius:999px;box-shadow:0 8px 20px rgba(0,0,0,.4);white-space:nowrap', 'TELL ME BELOW', S[9]);
})(A.s10);
// ---------------- persistent: belt, caption, kiosk ----------------
var belt = D('', '<i></i><b></b>', st); belt.id = 'belt'; var beltI = belt.firstChild, beltB = belt.lastChild;
var cap = D('', '', st); cap.id = 'cap';
var kiosk = D('', '<div class="bz"></div><div class="hd"></div><div class="scr"><canvas width="720" height="720"></canvas></div><div class="sl"></div><div class="led"></div>', st); kiosk.id = 'kiosk';
var kHd = kiosk.querySelector('.hd'), kCv = kiosk.querySelector('canvas'), kLed = kiosk.querySelector('.led'), kScr = kiosk.querySelector('.scr');
kiosk.querySelector('.scr').appendChild(A.s10.tell); A.s10.tell.style.cssText += ';left:100px;top:470px'; A.s10.tell.style.display = 'none';
// host video (seek-driven, pure function of t)
var hv = document.createElement('video'); hv.muted = true; hv.preload = 'auto'; hv.playsInline = true; hv.src = 'host.webm'; hv.style.cssText = 'position:absolute;width:2px;height:2px;opacity:0;pointer-events:none'; document.body.appendChild(hv);
function hostPaint() { try { kCv.getContext('2d').drawImage(hv, 0, 0, 720, 720); } catch (e) { } }
function vseek(v, tt) { return new Promise(function (res) { if (!v.duration) { res(); return; } if (Math.abs(v.currentTime - tt) < 1e-4 && v.readyState >= 2) { res(); return; } var done = false; function fin() { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); } v.addEventListener('seeked', fin); v.currentTime = tt; setTimeout(fin, 4000); }); }
function hostAt(t) { var f = Math.max(0, Math.min(1423, Math.floor(t * 24 + 1e-6))); return vseek(hv, (f + .5) / 24).then(hostPaint); }
// overlays: real-footage textures (VP9 webm, seek-driven)
var OV = {}; function ovl(id, src, blend, op) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.className = 'vid'; v.style.mixBlendMode = blend; v.style.opacity = op; v.style.zIndex = 5; st.appendChild(v); OV[id] = { v: v }; }
ovl('dust', 'dust-particles.webm', 'screen', .75); ovl('leak', 'light-leak-dust.webm', 'screen', .7); ovl('grain', 'film-grain.webm', 'multiply', .55);
function ovAt(id, on, t, fps) { var o = OV[id]; o.v.style.display = on ? 'block' : 'none'; if (!on || !o.v.duration) return Promise.resolve(); var d = o.v.duration, tt = ((t * 1) % d); var f = Math.floor(tt * fps); return vseek(o.v, Math.min(d - .01, (f + .5) / fps)); }
// ---------------- depth for the occlusion mask ----------------
var DEP = {}; function loadDepth(id) { return new Promise(function (res) { var im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = im.width; c.height = im.height; var x = c.getContext('2d'); x.drawImage(im, 0, 0); DEP[id] = { w: im.width, h: im.height, d: x.getImageData(0, 0, im.width, im.height).data }; res(); }; im.onerror = function () { res(); }; im.src = 'depth/' + id + '.png'; }); }
function dAt(id, px, py) { var D0 = DEP[id]; if (!D0) return 0; var x = clamp(Math.round(px * (D0.w - 1)), 0, D0.w - 1), y = clamp(Math.round(py * (D0.h - 1)), 0, D0.h - 1); return D0.d[(y * D0.w + x) * 4] / 255; }
// displayed depth at a screen pixel for the parallax shader (par 0.06)
function dispDepth(id, sx, sy, cam) { var u = sx / 1080, v = 1 - sy / 1920; var px = (u - .5) / cam[2] + .5, py = (v - .5) / cam[2] + .5; var dep = dAt(id, px, 1 - py); var ox = cam[0] * (dep - .42) * .06, oy = cam[1] * (dep - .42) * .06; var qx = clamp(px + ox, .002, .998), qy = clamp(py + oy, .002, .998); return dAt(id, qx, 1 - qy); }
// ---------------- scenes: photo + camera ----------------
var PH = ['aisle_dawn', 'living_dusk', 'aisle_dawn', 'doorstep', 'store_exit', null, 'storm_lot', null, 'store_exit', 'checkout_lane'];
var MOVES = [function (u) { return [lerp(-.15, .2, u), .05, lerp(1.0, 1.22, u)]; }, function (u) { return [lerp(.3, -.2, u), .05, lerp(1.04, 1.2, u)]; }, function (u) { return [lerp(-.5, .5, u), 0, lerp(1.12, 1.2, u)]; }, function (u) { return [lerp(.2, -.2, u), lerp(.1, -.1, u), lerp(1.04, 1.24, u)]; }, function (u) { return [lerp(-.3, .3, u), .05, lerp(1.0, 1.2, u)]; }, null, function (u) { return [lerp(.4, -.3, u), .1, lerp(1.04, 1.28, u)]; }, null, function (u) { return [lerp(.2, -.3, u), .05, lerp(1.1, 1.0, u)]; }, function (u) { return [lerp(-.2, .25, u), .08, lerp(1.0, 1.16, u)]; }];
var DIMS = [1, .8, 1, .85, 1, 1, .72, 1, .95, .8];
// ---------------- captions ----------------
var PAGES = (function () { var pages = [], cur = []; WD.forEach(function (w, i) { var len = cur.reduce(function (a, j) { return a + WD[j].w.length + 1; }, 0) + w.w.length; var prev = cur.length ? WD[cur[cur.length - 1]] : null; if (cur.length && (len > 52 || (prev && /[.?!]$/.test(prev.w)) || prev.p !== w.p)) { pages.push(cur); cur = []; } cur.push(i); }); if (cur.length) pages.push(cur); return pages; })();
function drawCap(t) { var last = 0; for (var i = 0; i < WD.length; i++) if (t >= WD[i].s - .02) last = i; var page = PAGES.filter(function (p) { return p.indexOf(last) >= 0; })[0] || [0], out = [], line = '', len = 0; page.forEach(function (i) { if (i > last) return; var w = WD[i].w, h = i === last ? '<b>' + w + '</b>' : w; if (len + w.length + (len ? 1 : 0) > 27 && line) { out.push(line); line = ''; len = 0; } line += (len ? ' ' : '') + h; len += w.length + (len ? 1 : 0); }); out.push(line); cap.innerHTML = out.join('<br>'); }
// ---------------- plumbing ----------------
var DEPS = {}; PH.forEach(function (p) { if (p) DEPS[p] = 1; });
var ready = Promise.all([window.GLP.load(Object.keys(DEPS)), loadDepth('aisle_dawn'), new Promise(function (r) { hv.addEventListener('loadeddata', r); setTimeout(r, 6000); }), Promise.all(['dust', 'leak', 'grain'].map(function (k) { return new Promise(function (r) { OV[k].v.addEventListener('loadeddata', r); setTimeout(r, 5000); }); })), document.fonts.ready]).then(function () { window.__ready = true; return window.__seek(0); });
var flat = document.getElementById('flat'), desk = document.getElementById('desk'), glc = document.getElementById('gl');
var robotImg = new Image();
function robotDraw(t) { // mocap robot, depth-occluded by the real shelves
  var s3 = A.s3, c = s3.occ.getContext('2d'); c.clearRect(0, 0, 1080, 1920); var lt = t - SC[2]; if (lt < 0 || lt > SC[3] - SC[2]) return Promise.resolve();
  var u = lt / (SC[3] - SC[2]), cam = MOVES[2](u), sc = 0.86 * cam[2], spd = RIG.speed('walk') * 0.86; var pu = 0.03 + (lt * spd) / (1080 * cam[2]) + 0.0; var pv = 0.58;
  var sx = ((pu - .5) * cam[2] + .5) * 1080, sy = (1 - ((1 - pv - .5) * cam[2] + .5)) * 1920;
  var P = RIG.sample('walk', lt, { loop: true, inplace: true }), body = RIG.svg(P, 'robot', { pal: { body: '#eef2f5', back: '#a9b4bf', edge: '#23272d', joint: MG, inner: AM } });
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (520 * sc) + '" height="' + (480 * sc) + '" viewBox="-260 -430 520 480">' + body + '</svg>';
  return new Promise(function (res) { robotImg.onload = function () { var W0 = 520 * sc, H0 = 480 * sc, x0 = sx - W0 / 2, y0 = sy - H0 * (430 / 480); c.drawImage(robotImg, x0, y0, W0, H0); var bx = Math.max(0, Math.floor(x0)), by = Math.max(0, Math.floor(y0)), bw = Math.min(1080 - bx, Math.ceil(W0)), bh = Math.min(1920 - by, Math.ceil(H0)); if (bw > 0 && bh > 0) { var im = c.getImageData(bx, by, bw, bh), d = im.data, fd = dispDepth('aisle_dawn', sx, sy, cam) + 0.05, G = 6; for (var gy = 0; gy < bh; gy += G) for (var gx = 0; gx < bw; gx += G) { var oc = dispDepth('aisle_dawn', bx + gx + G / 2, by + gy + G / 2, cam) > fd; if (!oc) continue; for (var yy = gy; yy < Math.min(bh, gy + G); yy++) for (var xx = gx; xx < Math.min(bw, gx + G); xx++) d[(yy * bw + xx) * 4 + 3] = 0; } c.putImageData(im, bx, by); } res(); }; robotImg.onerror = res; robotImg.src = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg); });
}
function kioskPos(t) { var u = seg(t, SC[9] - .15, SC[9] + .6), p = u < 1 ? u : 1, k = bounce(p); var x = lerp(612, 248, p), y = lerp(914, 180, p), s = lerp(.52, 1, k > 1 ? 1 + (k - 1) * .5 : k); if (p <= 0) { x = 612; y = 914; s = .52; } return 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')'; }
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var si = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
  var s0 = SC[si], s1 = si < SC.length - 1 ? SC[si + 1] : DUR, lt = t - s0, len = s1 - s0, u = lt / len, TR = .26, k = (t > s1 - TR && si < 9) ? (t - (s1 - TR)) / TR : -1;
  scenes.forEach(function (s, i) { s.style.display = i === si ? 'block' : 'none'; s.style.opacity = (i === si && k >= 0) ? 1 - sm(k * 1.6) : 1; s.style.transform = (i === si && k >= 0) ? 'translateX(' + (-60 * sm(k)) + 'px)' : ''; });
  var eb = tabs[si]; if (eb) { var q = bounce(seg(lt, 0, .3)); eb.style.transform = 'skewX(-6deg) translateX(' + ((1 - q) * -160) + 'px)'; eb.style.opacity = seg(lt, 0, .08); }
  // --- background: photo (GL) / flat / real photo
  var flatNow = PH[si] === null, nxt = si < 9 ? PH[si + 1] : undefined, flatNxt = si < 9 && nxt === null, cam = flatNow ? null : MOVES[si](u), pa = PH[si], pb = null, mix = 0, camB = null, whip = 0, flatOp = flatNow ? 1 : 0;
  var prevFlat = si > 0 && PH[si - 1] === null;
  if (k >= 0) { whip = Math.sin(k * Math.PI) * .06; if (!flatNow && !flatNxt) { pb = nxt; mix = sm(k * 1.25 - .1); camB = MOVES[si + 1](0); } else if (!flatNow && flatNxt) flatOp = sm(k * 1.3 - .1); else if (flatNow && !flatNxt) { pa = nxt; cam = MOVES[si + 1](0); flatOp = 1 - sm(k * 1.3 - .1); } }
  if (flatNow && k < 0 && prevFlat) flatOp = 1;
  var showFlat = flatOp > .001; var isDesk = (si === 7) || (si === 6 && k >= 0) || (si === 5 && k >= 0 && false);
  flat.style.display = showFlat && si !== 7 && !(si === 6 && k >= 0) ? 'block' : 'none'; flat.style.opacity = flatOp; flat.style.background = 'radial-gradient(circle at 88% 14%,rgba(255,45,111,.18) 0 300px,transparent 302px),radial-gradient(circle at 6% 70%,rgba(255,210,58,.30) 0 240px,transparent 242px),repeating-linear-gradient(0deg,rgba(35,39,45,.05) 0 3px,transparent 3px 72px),linear-gradient(180deg,#f3f6f8,#dfe6ec)';
  glc.style.opacity = (flatNow && flatOp >= .999) ? 0 : 1;
  desk.style.display = (si === 7 || (si === 6 && k >= 0)) ? 'block' : 'none'; if (si === 7) { desk.style.opacity = 1; desk.style.left = lerp(-1700, -2400, u) + 'px'; }
  if (si === 6 && k >= 0) { desk.style.opacity = sm(k * 1.3 - .1); desk.style.left = '-1700px'; }
  if (pa) window.GLP.draw({ a: pa, b: pb, mix: mix, camA: cam, camB: camB, whip: whip, wdir: [1, 0], par: .06, dim: DIMS[si] * (1 - .06 * seg(lt, len - .3, len)), flash: 0, t: t });
  // --- scene updates
  var f = [u0, u1, u2, u3, u4, u5, u6, u7, u8, u9][si]; var jolt = f(t, len) || 0;
  if (jolt) st.style.transform = 'translate(' + (Math.sin(t * 90) * jolt * 14) + 'px,' + (Math.cos(t * 70) * jolt * 12) + 'px)'; else st.style.transform = '';
  // --- persistent
  beltI.style.backgroundPosition = (-t * 120) + 'px 0'; beltB.style.width = (t / DUR * 100) + '%';
  kiosk.style.transform = kioskPos(t); kiosk.style.zIndex = 4;
  var hdTxt = si <= 2 ? 'ASSISTANT ONLINE' : si === 3 ? (t > wt('wrong') ? 'ERROR · WRONG ITEM' : 'DELIVERY RECEIVED') : si === 4 || si === 5 ? 'RULEBOOK CHECK' : si === 6 || si === 7 ? 'DISPUTE DESK' : si === 8 ? 'SURVEY · UK SHOPPERS' : '';
  if (si === 9) { var wa = wt('would'), ws = 'WOULD YOU HAND IT YOUR WALLET?', n = Math.floor(clamp((t - wa) / 1.5, 0, 1) * ws.length); hdTxt = t < wa ? 'YOUR CALL' : ws.slice(0, n); kHd.style.fontSize = '30px'; } else kHd.style.fontSize = '';
  kHd.textContent = hdTxt + (Math.floor(t * 2) % 2 ? '' : '_');
  var bad = si === 3 && t > wt('wrong') && t < wt('wrong') + 1.2; kLed.style.background = bad ? MG : MN; kLed.style.boxShadow = '0 0 14px 3px ' + (bad ? MG : MN); kScr.style.boxShadow = bad ? 'inset 0 0 0 6px ' + MG : 'inset 0 0 0 4px #0d1013';
  drawCap(t);
  // overlays + host + robot (async)
  var jobs = [hostAt(t)];
  jobs.push(ovAt('dust', si === 0 || si === 6 || si === 9, t, 25)); jobs.push(ovAt('leak', si === 3 || si === 6, t, 30)); jobs.push(ovAt('grain', si === 7, t, 30));
  A.s3.occ.style.display = si === 2 ? 'block' : 'none'; if (si === 2) jobs.push(robotDraw(t));
  return Promise.all(jobs);
};
// ---------------- per-scene motion ----------------
function u0(t) { var s = A.s1, w = [wt('soon'), wt('you'), wt('won\'t')]; s.w.forEach(function (e, i) { var p = 1 + .22 * pop(t, w[i], .35); e.style.transform = 'scale(' + p + ') rotate(' + (-1.2 * pop(t, w[i], .35)) + 'deg)'; e.style.transformOrigin = '0 60%'; });
  var sh = wt('shop.'); s.shop.style.transform = 'scale(' + (1 + .25 * pop(t, sh, .4)) + ')'; s.shop.style.transformOrigin = '0 60%';
  pin(s.stk, t, wt('your'), { d: .4, s0: .3, rot: -20, r: -7 }); var rr = RIG; var c = seg(t, 0, .9); s.cart.style.transform = 'translateX(' + ((1 - c) * -50 + Math.sin(t * 9) * 1.5) + 'px) rotate(' + (Math.sin(t * 7) * .6) + 'deg)'; return 0; }
function u1(t, len) { var s = A.s2, lt = t - SC[1], words = [['running', 'running'], ['shoes,', 'shoes'], ['under', 'under'], ['$100', '100'], ['', 'bucks']], txt = []; words.forEach(function (w) { if (t >= wt(w[1]) - .02 && w[0]) txt.push(w[0]); }); var cur = Math.floor(t * 3) % 2 ? '' : '▌'; s.bub.innerHTML = (txt.join(' ') || '') + '<span style="color:' + AM + '">' + cur + '</span>'; s.bub.style.opacity = t >= wt('running') - .05 ? 1 : 0;
  var sendAt = wt('bucks') + .2; s.send.style.transform = 'scale(' + (1 + .25 * pop(t, sendAt, .3)) + ')'; s.send.style.opacity = 1; s.typ.style.opacity = t > sendAt + .1 ? 1 : 0; s.dots.forEach(function (d, i) { d.style.transform = 'translateY(' + (Math.sin(t * 10 - i * .8) * 6) + 'px)'; });
  s.hum.style.transform = 'translateY(' + (Math.sin(t * 3) * 3) + 'px) rotate(' + (Math.sin(t * 2) * .8) + 'deg)'; pin(s.hum, t, SC[1] + .05, { d: .5, y: 120, s0: .9 }); s.glow.style.opacity = .6 + .4 * pop(t, sendAt, .6);
  s.chat.style.opacity = seg(lt, 0, .06);
  s.ch.forEach(function (c) { pin(c, t, wt(c.dataset.k) + .05, { d: .35, x: -40, s0: .5 }); }); return 0; }
function u2(t, len) { var s = A.s3, lt = t - SC[2], ws = [wt('browse,'), wt('compare'), wt('check')];
  s.rows.forEach(function (r, i) { var on = t >= ws[i]; var bx = r.querySelector('.bx'); bx.style.background = on ? MN : 'transparent'; bx.style.borderColor = on ? MN : GP; bx.innerHTML = on ? ic('check', 38, '#fff', 4) : ''; r.style.transform = 'translateX(' + (8 * pop(t, ws[i], .3)) + 'px)'; });
  pin(s.list, t, SC[2] + .05, { d: .4, x: -80, s0: .9 }); var zs = wt('sleep.') - 0.9; pin(s.moon, t, zs, { d: .45, y: -80, s0: .5 }); pin(s.bagtag, t, zs + .2, { d: .35, y: -50, s0: .6 }); s.moon.style.transform += ' rotate(' + (Math.sin(t * 3) * 4) + 'deg)'; return 0; }
function u3(t, len) { var s = A.s4, lt = t - SC[3], wr = wt('wrong'), un = wt('until'); var np = bounce(seg(t, SC[3] + .1, SC[3] + .55)); s.note.style.transform = 'translateY(' + ((1 - np) * -120) + 'px)'; s.note.style.opacity = t < SC[3] + .1 ? 0 : (t > un + .05 ? 1 - seg(t, un + .05, un + .3) : 1);
  var base = un + .12, n = s.lines.length, per = .24; s.lines.forEach(function (l, i) { l.style.opacity = t >= base + i * per ? 1 : 0; }); var printed = clamp((t - base) / per, 0, n) / n; var H = s.rc.offsetHeight || 420; var exit = seg(t, SC[4] - .5, SC[4] - .08); s.rc.style.clipPath = 'inset(0 0 ' + ((1 - printed) * 100) + '% 0)'; s.rc.style.transform = 'translateY(' + (-exit * (H + 60)) + 'px)'; s.clip.style.opacity = t > un ? 1 : 0;
  var bp = bounce(seg(t, wr - .12, wr + .22)); s.boxes.style.opacity = t < wr - .12 ? 0 : 1; s.boxes.style.transform = 'translateY(' + ((1 - bp) * -700) + 'px) scaleY(' + (1 - .05 * pop(t, wr + .1, .3)) + ')';
  pin(s.stamp, t, wt('thing.') - .05, { d: .25, s0: 2.6, rot: 8, r: -8 }); s.stamp.style.opacity = t < wt('thing.') - .05 ? 0 : 1; return pop(t, wr + .1, .35) * .8; }
function u4(t, len) { var s = A.s5, lt = t - SC[4]; var sw = Math.sin(lt * 3.2) * 4 * Math.exp(-lt * .3); pin(s.pass, t, SC[4] + .02, { d: .55, y: -300, s0: .95 }); var pb = s.pass.style.transform; s.pass.style.transform = pb + ' rotate(' + sw + 'deg)'; s.str.style.opacity = 0;
  pin(s.pos, t, SC[4] + .12, { d: .4, x: 120, s0: .9 }); s.chips.forEach(function (c) { var at = wt(c.dataset.k.replace(',', '')) + 0; if (c.dataset.k === 'meta,') at = wt('meta,'); pin(c, t, at, { d: .32, y: 40, s0: .3 }); c.style.boxShadow = '0 8px 18px rgba(0,0,0,.18),0 0 0 ' + (8 * pop(t, at, .4)) + 'px rgba(47,214,163,.5)'; });
  pin(s.flow, t, wt('walmart') + .3, { d: .4, y: 60, s0: .9 }); var fx = s.flow.querySelector('.fx'); fx.style.left = (30 + 350 * ((t * .8) % 1)) + 'px'; fx.style.opacity = t > wt('walmart') + .5 ? .9 : 0; pin(s.draft, t, wt('stripe') + .2, { d: .3, s0: 2.4, rot: 10, r: -5 }); pin(s.sub, t, wt('stripe') + .5, { d: .4, y: 40, s0: .9 }); return 0; }
function u5(t, len) { var s = A.s6, lt = t - SC[5], at = [wt('who'), wt('what'), wt('what', 1)], on = [t >= at[0] + .1, t >= wt('do,') - .1, t >= at[2] + .1]; pin(s.card, t, SC[5] + .1, { d: .45, y: -80, s0: .96 });
  s.tg.forEach(function (g, i) { var p = sm((t - at[i] - (i === 1 ? wt('do,') - at[1] - .2 : 0)) / .25); if (i === 1) p = sm((t - (wt('do,') - .15)) / .25); g.style.background = p > .5 ? MN : '#cdd5db'; g.firstChild.style.left = (6 + 56 * p) + 'px'; });
  var lbl = [['BROWSE', 1], ['BUY', 1], ['RETURN', 0]]; s.sub.innerHTML = lbl.map(function (l, i) { var shown = t >= wt('may') + .1 + i * .35; return '<span style="opacity:' + (shown ? 1 : 0) + ';font:800 22px/1 PJ;padding:7px 14px;border-radius:999px;background:' + (l[1] ? 'rgba(47,214,163,.22)' : 'rgba(255,45,111,.18)') + ';color:' + (l[1] ? '#0a7c5c' : '#c2124a') + '">' + (l[1] ? '✓ ' : '✕ ') + l[0] + '</span>'; }).join('');
  var hp = bounce(seg(t, SC[5] + .3, SC[5] + .8)); s.hum.style.opacity = t < SC[5] + .3 ? 0 : 1; s.hum.style.transform = 'translateX(' + ((1 - hp) * -200) + 'px)'; var P = RIG.sample('walk', 0.35, { loop: true, inplace: true }); s.bot.innerHTML = '<svg width="280" height="365" viewBox="-170 -420 340 440">' + RIG.svg(P, 'robot', { pal: { body: '#eef2f5', back: '#a9b4bf', edge: '#23272d', joint: MG, inner: AM } }) + '</svg>'; var bp = bounce(seg(t, SC[5] + .5, SC[5] + 1)); s.bot.style.opacity = t < SC[5] + .5 ? 0 : 1; s.bot.style.transform = 'translateX(' + ((1 - bp) * 200) + 'px)';
  var th = wt('hall'), pa = seg(t, th, th + .9); s.passc.style.opacity = t < th - .1 ? 0 : 1; s.passc.style.left = lerp(300, 470, pa) + 'px'; s.passc.style.top = (830 - Math.sin(pa * Math.PI) * 80) + 'px'; s.passc.style.transform = 'rotate(' + (lerp(-12, 8, pa)) + 'deg) scale(' + (1 + .15 * pop(t, th + .8, .4)) + ')';
  var sp = wt('spend.'); var cp = seg(t, sp - .5, sp + .5); s.limit.style.opacity = seg(t, SC[5] + .8, SC[5] + 1.1); var wv = .15 + .5 * cp + .03 * Math.sin(t * 6); s.limit.querySelector('.fl').style.width = (wv * 100) + '%'; s.limit.querySelector('.kn').style.left = (wv * 368 - 25) + 'px'; return 0; }
function u6(t, len) { var s = A.s7, lt = t - SC[6], Z = 560 / 1000; pin(s.q, t, SC[6] + .02, { d: .4, y: -60, s0: .9 }); pin(s.sc, t, SC[6] + .1, { d: .5, y: 160, s0: .9 });
  var ang = 13 * Math.sin(lt * 2.1) * (1 - .15 * seg(lt, 0, 5)) + 5 * Math.sin(lt * 5.3); s.beam.style.transform = 'rotate(' + ang + 'deg)';
  var r = ang * Math.PI / 180, arm = 1.5 * 238 * Z, px = 170 + 500 * Z, py = 420 + 381 * Z, lx = px - Math.cos(r) * arm, ly = py - Math.sin(r) * arm, rx = px + Math.cos(r) * arm, ry = py + Math.sin(r) * arm;
  s.pl.style.left = (lx - 500 * Z - 170) + 'px'; s.pl.style.top = (ly - 381 * Z - 420) + 'px'; s.pr.style.left = (rx - 500 * Z - 170) + 'px'; s.pr.style.top = (ry - 381 * Z - 420) + 'px';
  var rimY = 252 * Z; function at(el, x, y, w) { el.style.left = (x - w / 2) + 'px'; el.style.top = y + 'px'; }
  s.ll.textContent = t < wt('wrong', 1) ? 'THE STORE' : 'YOU'; at(s.rl, lx, ly + rimY - 60, 150); at(s.rr, rx, ry + rimY - 60, 150); at(s.ll, lx, ly + rimY + 26, 200); at(s.lr, rx, ry + rimY + 26, 230);
  [s.rl, s.rr, s.ll, s.lr].forEach(function (e) { e.style.opacity = seg(lt, .5, .8); });
  pin(s.torn, t, wt('wrong', 1) - .1, { d: .4, y: 80, s0: .8 }); var sp = seg(t, wt('who', 1) - .1, wt('pays?') + .3); s.t1.style.transform = 'translateX(' + (-14 * sp) + 'px) rotate(' + (-5 * sp) + 'deg)'; s.t2.style.transform = 'translateX(' + (14 * sp) + 'px) rotate(' + (5 * sp) + 'deg)'; return 0; }
function u7(t, len) { var s = A.s8, lt = t - SC[7]; pin(s.a, t, SC[7] + .1, { d: .45, x: -500, s0: 1 }); var h1 = wt('if'), h2 = wt('the', 3); var m = s.a.querySelector('.m'); m.style.backgroundSize = (seg(t, wt('choose,') - .3, wt('yours.') + .3) * 100) + '% 100%'; pin(s.b, t, wt('merchants') - .1, { d: .45, x: 500, s0: 1 }); pin(s.vs, t, wt('merchants') - .3, { d: .3, s0: .3, rot: 40 });
  s.b.style.opacity = t < wt('merchants') - .1 ? 0 : 1; s.vs.style.opacity = t < wt('merchants') - .3 ? 0 : 1; var kn = s.rope.querySelector('.kn'); var g = seg(t, wt('retailer\'s'), wt('yours.') + .2), g2 = seg(t, wt('merchants'), wt('it', 4) + .1); var pos = .5 - .35 * g + .3 * g2 + .05 * Math.sin(t * 5) * g2; kn.style.left = (pos * 360 + 5) + 'px'; pin(s.rope, t, SC[7] + .6, { d: .45, y: 60, s0: .9 }); return 0; }
function u8(t, len) { var s = A.s9, lt = t - SC[8]; pin(s.ring, t, SC[8] + .05, { d: .4, x: -120, s0: .9 }); var w6 = wt('6'), fill = seg(t, w6 - .1, w6 + 1.1) * .6; s.ring.querySelector('.arc').setAttribute('stroke-dasharray', (fill * 880) + ' 880'); s.ring.querySelector('.num').style.transform = 'scale(' + (1 + .12 * pop(t, w6, .4)) + ')';
  pin(s.sv, t, SC[8] + .1, { d: .3, x: 100, s0: .9 }); var mk = wt('mistake'); pin(s.big, t, wtp(4, 'one', 0) - .05, { d: .4, y: 50, s0: .6 }); s.big.style.opacity = t < wtp(4, 'one', 0) - .05 ? 0 : 1; pin(s.sm2, t, wtp(4, 'and', 1) - .05, { d: .4, y: 40, s0: .8 }); s.sm2.style.opacity = t < wtp(4, 'and', 1) - .05 ? 0 : 1;
  var C = ['#ff2d6f', '#2fd6a3', '#ffd23a', '#5b8cff', '#23272d', '#ff7a45', '#2fd6a3', '#c78bff', '#ff2d6f', '#ffd23a'], leaveT = wt('mistake') + .1, home = []; for (var i = 0; i < 10; i++) home.push([100 + i * 90 + (i % 2) * 14, 345 - (i % 2) * 22, .8 - (i % 2) * .1]);
  s.fig.forEach(function (g, i) { var leave = i < 6, h = home[i], lp = leave ? seg(t, leaveT + i * .16, leaveT + i * .16 + 1.6) : 0, x = lerp(h[0], 540 + (i - 3) * 6, lp), y = lerp(h[1], 190, lp), sc = lerp(h[2], .18, lp), dir = leave && lp > 0 ? -1 : 1, P = RIG.sample('walk', ((t - SC[8]) * .9 + i * .37) % 2.0, { loop: true, inplace: true }); var tx = leave ? (h[0] > 540 ? -1 : 1) : 1; g.innerHTML = '<svg width="260" height="340" viewBox="-130 -330 260 340" style="overflow:visible">' + RIG.svg(P, 'human', { pal: { body: C[i], back: '#14123a66', edge: '#23272d' } }) + '</svg>'; g.style.left = (x - 130) + 'px'; g.style.top = (y - 330) + 'px'; g.style.transform = 'scale(' + sc + ')'; g.style.transformOrigin = '50% 97%'; g.style.opacity = leave ? 1 - .85 * seg(lp, .8, 1) : 1; });
  pin(s.tally, t, SC[8] + .5, { d: .4, y: 60, s0: .9 }); s.ppl.forEach(function (p, j) { var on = j < 6 && t >= wt('mistake') + j * .22 - .1; p.firstChild.setAttribute('stroke', on ? MG : '#8b95a0'); p.firstChild.setAttribute('fill', on ? MG : 'none'); p.style.transform = 'scale(' + (1 + .25 * pop(t, wt('mistake') + j * .22, .3)) + ')'; }); return 0; }
function u9(t, len) { var s = A.s10, lt = t - SC[9]; var tl = wt('tell'), fo = wt('follow'); pin(s.tell, t, tl, { d: .4, y: 50, s0: .5 }); s.tell.style.display = t >= tl ? 'block' : 'none'; if (t < tl) s.tell.style.opacity = 0; s.tell.style.transform = 'translate(0,' + ((1 - bounce(seg(t, tl, tl + .4))) * 50) + 'px)';
  var pr = seg(t, tl + .3, tl + 1.4); s.rc.style.transform = 'translateY(' + (-(1 - pr) * 410) + 'px)'; s.clip.style.opacity = t > tl + .25 ? 1 : 0; s.ring.style.transform = 'scale(' + (1 + .06 * Math.sin(t * 3)) + ')'; pin(s.fo, t, fo - .1, { d: .4, y: 20, s0: .4 }); s.fo.style.transform += ' scale(' + (1 + .06 * Math.sin(t * 7) * seg(t, fo + .4, fo + .6)) + ')'; s.fo.style.opacity = t < fo - .1 ? 0 : 1; return 0; }
})();
