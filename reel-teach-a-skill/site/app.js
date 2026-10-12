// "Teach your AI once." — Card Catalogue. Every layer is a pure function of t; word times come from the cloned voice (timing.js).
// Cuts are a card flip-through: the outgoing scene tips back like a catalogue card being flicked past, the next one rises into place.
// window.EV lists every on-screen event for the score/SFX.
(function () {
'use strict';
var SC = window.SC, WD = window.WD, PG = window.PG, DUR = window.TOTAL; window.__reelDurationSec = DUR;
var BRASS = '#c9a04f', CARD = '#f5eedb', NAVY = '#20396b', RED = '#d1442f', GREEN = '#3e7a5a', INK = '#f3ead6', GOLD = '#f0c76a';
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function ec(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function eb(x) { x = clamp(x, 0, 1); var c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function key(k) { return k.replace(/[^a-z0-9']/gi, '').toLowerCase(); }
function W(p, k, n) { k = key(k); var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } throw new Error('word ' + p + ' ' + k); }
function WE(p, k, n) { k = key(k); var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].e; c++; } throw new Error('word ' + p + ' ' + k); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var st = document.getElementById('st');
function OV(e) { e.dataset.ov = 1; return e; }
function D(css, html, par, cls) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; if (cls) e.className = cls; (par || st).appendChild(e); return e; }
function ic(n, sz, col, sw) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" style="flex:none;display:inline-block;vertical-align:middle">' + window.IC[n] + '</svg>'; }
function folderIc(sz, col) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + col + '" stroke-width="2" stroke-linejoin="round" style="flex:none;vertical-align:middle"><path d="M3 6.5a1.5 1.5 0 0 1 1.5-1.5h4l2 2h9a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/></svg>'; }
function logo(n, w, col) { return '<span class="lg" style="display:inline-block;vertical-align:middle;width:' + w + 'px;height:' + w + 'px;color:' + col + '">' + window.LOGO[n] + '</span>'; }
// entrances: settle (cards placed on a desk: a short slide with a tiny tilt), drop (index card dropped into place, back-ease)
function settle(el, t, at, o) { o = o || {}; var u = ec((t - at) / (o.d || .35)); el.style.opacity = t < at ? 0 : clamp((t - at) / .1, 0, 1); el.style.transform = 'translate(' + ((o.x || 0) * (1 - u)).toFixed(1) + 'px,' + ((o.y == null ? 28 : o.y) * (1 - u)).toFixed(1) + 'px) rotate(' + ((o.r || 0) + (o.r0 || 0) * (1 - u)).toFixed(2) + 'deg) scale(' + (1 + (o.s == null ? .03 : o.s) * (1 - u)).toFixed(4) + ')'; }
function drop(el, t, at, o) { o = o || {}; var u = eb((t - at) / (o.d || .42)); el.style.opacity = t < at ? 0 : clamp((t - at) / .08, 0, 1); el.style.transform = 'translateY(' + ((o.y || -60) * (1 - u)).toFixed(1) + 'px) rotate(' + ((o.r || 0) + (o.r0 == null ? -4 : o.r0) * (1 - u)).toFixed(2) + 'deg) scale(' + (1 + .06 * (1 - clamp(u, 0, 1))).toFixed(4) + ')'; }
function stampIn(el, t, at, r) { var x = t - at; el.style.opacity = x < 0 ? 0 : 1; var s = x < 0 ? 1.6 : (x < .14 ? lerp(1.6, .94, x / .14) : (x < .26 ? lerp(.94, 1, (x - .14) / .12) : 1)); el.style.transform = 'rotate(' + (r || -8) + 'deg) scale(' + s.toFixed(3) + ')'; }
function pop(t, at, d) { var x = t - at; return x < 0 || x > (d || .3) ? 0 : 1 - x / (d || .3); }
function typed(s, t, at, cps) { return s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - at) * (cps || 22))))); }
function leader(par, x1, y1, x2, y2) { var dx = x2 - x1, dy = y2 - y1; var e = D('left:' + x1 + 'px;top:' + y1 + 'px;width:' + Math.hypot(dx, dy).toFixed(0) + 'px;transform:rotate(' + (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1) + 'deg)', '', par, 'leader'); return e; }
function grow(el, t, at, deg) { var u = ec((t - at) / .35); el.style.opacity = t < at ? 0 : 1; el.style.transform = 'rotate(' + deg + 'deg) scaleX(' + u.toFixed(3) + ')'; }
var EV = []; function E(k, t, o) { var e = { k: k, t: +t.toFixed(3) }; for (var q in (o || {})) e[q] = o[q]; EV.push(e); }
// deterministic pseudo-random
function rnd(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

// ---------- scenes / chrome ----------
var scenes = [], A = [];
function scene() { var s = D('', null, st, 'sc'); scenes.push(s); return s; }
function eyebrow(P, txt) { return D('', txt, P, 'eb'); }
function head(P, html, top) { return D(top != null ? 'top:' + top + 'px' : '', html, P, 'hd'); }
// persistent brass step tracker (outside the scenes, so it stays put while scenes flip)
var trk = D('', '', st, 'tracker'); trk.innerHTML = '<div class="lbl"></div>' + ['PICK', 'ASK', 'SAVE', 'TEST'].map(function (n, i) { return '<div class="dw"><span class="n">' + (i + 1) + '</span>' + n + '</div>'; }).join('');
var trkL = trk.querySelector('.lbl'), trkD = trk.querySelectorAll('.dw');
function trkSet(cur, label, lift) { trkL.innerHTML = label; for (var i = 0; i < 4; i++) { var d = trkD[i]; d.className = 'dw ' + (i + 1 === cur ? 'on' : (i + 1 < cur ? 'done' : '')); d.querySelector('.n').textContent = i + 1 < cur ? '✓' : (i + 1); d.style.transform = i + 1 === cur ? 'translateY(' + (8 * lift).toFixed(1) + 'px)' : ''; } }

// ---------- Blender card catalogue (frame sequence on a canvas, plate names set in DOM type) ----------
var CF = window.CABF, CJ = window.CABJ, FIMG = {};
var NAMES = ['brand', 'notes', 'sql', 'bills', 'hire', 'legal', 'weekly', 'ship', 'bugs', 'pitch', 'spend', 'style', 'posts', 'csv', 'okr', 'viz', 'api', 'email', 'tests', 'retro', 'trips', 'meals', 'pr', 'intro'];
function Cab(P, x, y, w, o) {
  o = o || {}; var h = Math.round(w * 1240 / 1080), k = w / 1080, c = { k: k, x: x, y: y, w: w, h: h };
  c.el = OV(D('left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px', '<canvas width="' + w + '" height="' + h + '"></canvas>', P, 'cab'));
  c.cv = c.el.querySelector('canvas'); c.cx = c.cv.getContext('2d'); c.pl = [];
  CJ[CF[0]].plates.forEach(function (p) { if (p.card) return; var i = p.c * 6 + p.r, e = D('', NAMES[i], c.el, 'pl'); e.style.fontSize = ((p.c === 1 && p.r === 0) ? 15 : 14) * Math.max(.75, k / .7) * .7 + 'px'; c.pl.push({ c: p.c, r: p.r, e: e }); });
  c.last = '';
  c.set = function (u, l) { // u: drawer progress 0..1, l: card lift 0..1
    var f, a, b, m;
    if (l > 0) { f = clamp(l, 0, 1) * 5; a = Math.floor(f); b = Math.min(5, a + 1); m = f - a; a = a === 0 ? 11 : 11 + a; b = b === 0 ? 11 : 11 + b; }
    else { f = clamp(u, 0, 1) * 11; a = Math.floor(f); b = Math.min(11, a + 1); m = f - a; }
    var ka = CF[a], kb = CF[b], sig = ka + kb + m.toFixed(2);
    if (sig !== c.last) { c.last = sig; c.cx.clearRect(0, 0, w, h); c.cx.globalAlpha = 1; if (FIMG[ka]) c.cx.drawImage(FIMG[ka], 0, 0, w, h); if (m > .01 && FIMG[kb]) { c.cx.globalAlpha = m; c.cx.drawImage(FIMG[kb], 0, 0, w, h); } c.cx.globalAlpha = 1; }
    var JA = CJ[ka].plates, JB = CJ[kb].plates;
    c.pl.forEach(function (q) { var pa = JA.filter(function (p) { return p.c === q.c && p.r === q.r; })[0], pb = JB.filter(function (p) { return p.c === q.c && p.r === q.r; })[0] || pa;
      var px = lerp(pa.x, pb.x, m), py = lerp(pa.y, pb.y, m), pw = lerp(pa.w, pb.w, m) * k * .98;
      q.e.style.left = (px * k - pw / 2).toFixed(1) + 'px'; q.e.style.top = (py * k - 9).toFixed(1) + 'px'; q.e.style.width = pw.toFixed(1) + 'px'; q.e.style.transform = 'rotate(' + pa.skew + 'deg)'; });
    var ca = JA.filter(function (p) { return p.card; })[0], cb = JB.filter(function (p) { return p.card; })[0];
    c.card = ca ? [x + lerp(ca.x, (cb || ca).x, m) * k, y + lerp(ca.y, (cb || ca).y, m) * k] : null;
  };
  c.plate = function (col, row) { var p = CJ[CF[0]].plates.filter(function (p) { return p.c === col && p.r === row; })[0]; return [x + p.x * k, y + p.y * k]; };
  c.label = function (col, row) { return c.pl.filter(function (q) { return q.c === col && q.r === row; })[0].e; };
  return c;
}

var S = []; for (var i = 0; i < 10; i++) S.push(scene());

// ================= S1 · hook: the same instructions, pasted again and again =================
A[0] = (function (P) { var s = {}, L = 1;
  s.h1 = head(P, 'Same instructions.<br><em>Again.</em>', 160); s.h1.style.width = '570px';
  s.h2 = head(P, 'Teach it <em>once.</em>', 160); s.h2.style.width = '570px';
  s.ct = D('left:736px;top:176px;width:176px;height:140px;border-radius:10px;background:linear-gradient(180deg,#d9b866,#b48a3c 55%,#94702c);box-shadow:0 10px 24px rgba(0,0,0,.45),inset 0 2px 0 rgba(255,240,200,.6);text-align:center;color:#2a1a08', '<div style="font:700 18px CP;letter-spacing:.14em;margin-top:16px">PASTED</div><div class="n" style="font:400 74px/1 DS;margin-top:4px">×2</div>', P);
  s.ctn = s.ct.querySelector('.n');
  var txt = 'Weekly update: wins, blockers, priorities. Max 3 bullets. Direct tone, my manager skims it.';
  s.b = []; for (var i = 0; i < 4; i++) s.b.push(OV(D('left:' + (180 + (i % 2) * 70) + 'px;top:' + (420 + i * 118) + 'px;width:640px', esc(txt) + '<span class="pt">PASTED ×' + (i + 1) + '</span>', P, 'bub')));
  // the desk: humaaans at a laptop
  s.desk = D('left:150px;top:1196px;width:768px;height:26px;border-radius:6px;background:linear-gradient(180deg,#5a3624,#3a2116);box-shadow:0 12px 20px rgba(0,0,0,.5)', '', P);
  s.lap = D('left:300px;top:1062px;width:210px;height:136px', '<div style="position:absolute;left:24px;top:0;width:150px;height:118px;border-radius:10px 10px 2px 2px;background:#1d2230;border:6px solid #9aa3ad;transform:skewX(-10deg)"><div style="margin:20px 14px;height:6px;border-radius:3px;background:#3c5a93"></div><div style="margin:-8px 14px;height:6px;width:60%;border-radius:3px;background:#3c5a93"></div></div><div style="position:absolute;left:0;top:118px;width:210px;height:16px;border-radius:2px 2px 8px 8px;background:#b9bdc4"></div>', P);
  s.hum = D('left:470px;top:830px;width:380px;height:400px', window.HUM, P);
  s.card = D('left:240px;top:560px;width:600px;height:330px;padding:66px 30px 0 92px;font:700 34px/48px CP', '<div style="position:absolute;left:92px;top:14px;font:700 18px CP;letter-spacing:.16em;color:#8a6a2c">SKILL CARD</div>weekly-team-update<div style="font:400 26px/48px CP;color:#4a4a52">wins · blockers · priorities</div><div style="font:400 26px/48px CP;color:#4a4a52">direct, for my manager</div>', P, 'card');
  s.tab = OV(D('left:640px;top:530px;width:150px;height:40px;border-radius:8px 8px 0 0;background:linear-gradient(180deg,#d9b866,#b48a3c);font:700 20px/40px CP;letter-spacing:.14em;text-align:center;color:#2a1a08', 'SKILL', P));
  var t1 = W(L, 'explaining'), t2 = W(L, 'same'), tt = W(L, 'teach'), to = W(L, 'once');
  E('paste', t1); E('paste', t2); E('flick', tt); E('clink', to);
  s.u = function (t) {
    var col = ec((t - tt) / .45), shown = t < t1 ? 2 : (t < t2 ? 3 : 4);
    s.b.forEach(function (b, i) { var at = i < 2 ? -1 : (i === 2 ? t1 : t2), on = i < shown;
      if (t < tt) { b.style.opacity = on ? 1 : 0; var u = on ? ec((t - at) / .25) : 0; b.style.transform = 'translateY(' + (i < 2 ? 0 : (1 - u) * -40).toFixed(1) + 'px) rotate(' + ((i % 2 ? 1.5 : -1.5) + (t > W(L, 'ai') ? Math.sin(t * 40 + i) * .6 * clamp(1 - (t - W(L, 'ai')) / .4, 0, 1) : 0)).toFixed(2) + 'deg) scale(' + (i < 2 ? 1 : 1 + .08 * (1 - u)) + ')'; }
      else { b.style.opacity = 1 - col; b.style.transform = 'translate(' + ((330 - (180 + (i % 2) * 70)) * col).toFixed(1) + 'px,' + ((640 - (420 + i * 118)) * col).toFixed(1) + 'px) scale(' + (1 - .55 * col).toFixed(3) + ')'; } });
    s.ctn.textContent = t < tt ? '×' + shown : '×1'; s.ct.querySelector('div').textContent = t < tt ? 'PASTED' : 'ONCE';
    s.ct.style.background = t < tt ? 'linear-gradient(180deg,#d9b866,#b48a3c 55%,#94702c)' : 'linear-gradient(180deg,#5aa07a,#3e7a5a)'; s.ct.style.color = t < tt ? '#2a1a08' : '#f3ead6';
    s.ct.style.transform = 'scale(' + (1 + .05 * (pop(t, t1, .25) + pop(t, t2, .25) + pop(t, tt + .3, .3))) + ')';
    s.h1.style.opacity = t < tt ? 1 : 0; s.h2.style.opacity = t < tt ? 0 : 1; s.h2.style.transform = 'scale(' + (1 + .05 * pop(t, tt, .3)) + ')'; s.h2.style.transformOrigin = '0 50%';
    s.card.style.opacity = t < tt + .2 ? 0 : 1; drop(s.card, t, tt + .2, { y: -30, r: -1.5, r0: 3 }); drop(s.tab, t, to, { y: -40, r: 0, r0: 0 });
    s.hum.style.transform = 'translateY(' + (Math.sin(t * 9) * 1.5).toFixed(1) + 'px)';
    return 0; };
  return s; })(S[0]);

// ================= S2 · what a skill is: the cabinet =================
A[1] = (function (P) { var s = {}, L = 2;
  eyebrow(P, '// WHAT A SKILL IS'); head(P, 'A skill is an <em>instruction card.</em>');
  s.c = Cab(P, 160, 505, 760);
  s.env = D('width:46px;height:32px;background:linear-gradient(180deg,#d9b77a,#b8924f);border-radius:3px;box-shadow:0 4px 8px rgba(0,0,0,.5)', '<div style="position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 60%);background:#c7a264"></div><div style="position:absolute;left:19px;top:13px;width:9px;height:9px;border-radius:50%;background:#d1442f"></div>', P);
  s.tc = D('left:150px;top:500px;width:260px', 'CARD<small>the instructions · pulled only when a request matches</small>', P, 'tagcard');
  s.te = D('left:620px;top:500px;width:298px', 'ENVELOPE<small>scripts &amp; files · opened only if needed</small>', P, 'tagcard');
  s.tl = D('left:620px;top:1110px;width:298px', 'LABEL = name + description<small>always on the front · ~100 tokens</small>', P, 'tagcard');
  var tS = SC[1], tSmall = W(L, 'small'), tPull = W(L, 'pulls'), tOnly = W(L, 'only'), tNeed = W(L, 'needed');
  s.c.set(1, 1); var cp = s.c.card, rp = s.c.plate(3, 3);
  s.lc = leader(P, 410, 560, cp[0] - 14, cp[1] - 6); s.le = leader(P, 620, 560, cp[0] + 60, cp[1] - 20); s.ll = leader(P, 700, 1110, rp[0], rp[1] + 12);
  E('drawer', tS + .25); E('lift', tPull); E('clink', tSmall); E('tick', tPull + .1); E('tick', tNeed);
  s.u = function (t) {
    var u = ec((t - tS - .25) / 1.0), l = ec((t - tPull) / .6);
    s.c.set(u, l > 0 ? l : 0);
    var g = sm((t - tS) / (SC[2] - tS)); s.c.el.style.transform = 'translateY(' + lerp(26, 0, g).toFixed(1) + 'px) scale(' + lerp(1.05, 1, g).toFixed(4) + ')'; s.c.el.style.transformOrigin = '50% 30%';
    var cp = s.c.card || [0, 0]; s.env.style.left = (cp[0] + 30).toFixed(0) + 'px'; s.env.style.top = (cp[1] - 26).toFixed(0) + 'px'; s.env.style.opacity = t < tOnly ? 0 : 1; s.env.style.transform = 'rotate(8deg) scale(' + (1 + .3 * pop(t, tOnly, .3)) + ')';
    s.env.style.opacity = l > .9 ? 1 : 0;
    settle(s.tl, t, tSmall, { x: 0, y: 20 }); grow(s.ll, t, tSmall + .15, (Math.atan2(rp[1] + 12 - 1110, rp[0] - 700) * 180 / Math.PI).toFixed(1));
    settle(s.tc, t, tPull + .2, { x: -30, y: 0 }); grow(s.lc, t, tPull + .35, (Math.atan2(cp[1] - 6 - 560, cp[0] - 14 - 410) * 180 / Math.PI).toFixed(1));
    settle(s.te, t, tNeed, { x: 0, y: 20 }); grow(s.le, t, tNeed + .15, (Math.atan2(cp[1] - 20 - 560, cp[0] + 60 - 620) * 180 / Math.PI).toFixed(1));
    return 0; };
  return s; })(S[1]);

// ================= S3 · step 1: the task you repeat (photoreal desk + depth parallax) =================
A[2] = (function (P) { var s = {}, L = 3;
  eyebrow(P, '// STEP 1 · THE TASK YOU REPEAT'); head(P, 'Pick a task <em>you repeat.</em>');
  s.cd = D('left:150px;top:520px;width:768px;height:520px;padding:22px 30px 0 92px', '<div style="font:700 20px CP;letter-spacing:.16em;color:#8a6a2c;height:46px">MY CHATS · ILLUSTRATIVE</div>', P, 'card');
  var rows = [['MON 28 SEP', 'Write my weekly update. Wins, blockers…'], ['MON 5 OCT', 'Weekly update again: wins, blockers…'], ['MON 12 OCT', 'Same as last week. Wins, blockers…']];
  s.r = rows.map(function (r, i) { return D('left:92px;top:' + (86 + i * 120) + 'px;width:640px', '<div style="font:700 19px CP;letter-spacing:.12em;color:#8a6a2c">' + r[0] + '</div><div class="tx" style="font:500 29px/1.3 IN;color:#1d2230;margin-top:6px;border-radius:6px;padding:4px 8px;margin-left:-8px">' + esc(r[1]) + '</div>', s.cd); });
  s.stp = OV(D('left:470px;top:880px', 'REPEATED ×3', P, 'stamp'));
  s.ch = D('left:150px;top:1080px;background:' + GREEN + ';color:#f3ead6;box-shadow:0 8px 16px rgba(0,0,0,.45)', '→ YOUR FIRST SKILL', P, 'chip');
  s.lab = D('left:150px;top:1240px', 'AI-GENERATED PHOTO', P, 'illus');
  var tS = SC[2], tTw = W(L, 'twice'), tWk = W(L, 'weekly');
  E('card', tS + .3); E('card', tS + .5); E('card', tS + .7); E('stamp', tTw + .05); E('tick', tWk);
  s.u = function (t) { settle(s.cd, t, tS + .15, { y: 40, r: -.8, r0: 1.5 }); s.r.forEach(function (r, i) { settle(r, t, tS + .3 + i * .2, { x: -20, y: 0, s: 0 }); });
    stampIn(s.stp, t, tTw + .05, -9); var hi = t >= tWk; s.r[2].querySelector('.tx').style.background = hi ? 'rgba(255,214,90,.6)' : 'transparent'; settle(s.ch, t, tWk + .1, { x: -20, y: 0 }); s.lab.style.opacity = 1;
    return pop(t, tTw + .05, .2) * .4; };
  return s; })(S[2]);

// ================= S4 · step 2: ask Claude (composer + format/tone/example) =================
A[3] = (function (P) { var s = {}, L = 4;
  eyebrow(P, '// STEP 2 · FORMAT, TONE, EXAMPLE'); head(P, 'Ask Claude to <em>build it.</em>');
  s.cmp = D('left:150px;top:450px;width:768px;height:300px;padding:22px 26px', '<div style="display:flex;align-items:center;gap:12px;font:700 18px CP;letter-spacing:.16em;color:#8a7a5a">' + logo('anthropic', 30, '#c9663f') + '<span>NEW CHAT · ILLUSTRATIVE</span></div><div class="tx" style="margin-top:22px;font:700 40px/1.3 CP;color:' + NAVY + ';min-height:160px"></div><div class="snd" style="position:absolute;right:22px;bottom:20px;width:64px;height:64px;border-radius:50%;background:' + NAVY + ';display:flex;align-items:center;justify-content:center">' + ic('send', 32, '#f5eedb') + '</div>', P, 'plain');
  s.tx = s.cmp.querySelector('.tx'); s.snd = s.cmp.querySelector('.snd');
  var att = [['FORMAT', 'wins · blockers · priorities<br>max 3 bullets each', 'checklist'], ['TONE', 'direct and factual,<br>for my manager to skim', 'message-circle'], ['EXAMPLE', '<span style="display:block;height:9px;width:90%;background:#c8bfa9;border-radius:4px;margin:6px 0"></span><span style="display:block;height:9px;width:70%;background:#c8bfa9;border-radius:4px;margin:6px 0"></span><span style="display:block;height:9px;width:80%;background:#c8bfa9;border-radius:4px;margin:6px 0"></span>one update you liked', 'file-text']];
  s.a = att.map(function (a, i) { return D('left:' + (150 + i * 262) + 'px;top:800px;width:244px;height:250px;padding:18px 18px', '<div style="display:flex;align-items:center;gap:8px;font:700 22px CP;letter-spacing:.1em;color:' + NAVY + '">' + (window.IC[a[2]] ? ic(a[2], 26, NAVY) : '') + a[0] + '</div><div style="margin-top:14px;font:500 22px/1.35 IN;color:#3a3a42">' + a[1] + '</div><div style="position:absolute;right:-6px;top:-14px;width:22px;height:46px;border:4px solid #9aa3ad;border-radius:11px;border-bottom-color:transparent"></div>', P, 'plain'); });
  s.sl = ['FORMAT', 'TONE', 'EXAMPLE'].map(function (n, i) { return D('left:' + (150 + i * 262) + 'px;top:800px;width:244px;height:250px;border:3px dashed rgba(201,160,79,.55);border-radius:8px;font:700 22px CP;letter-spacing:.1em;color:rgba(201,160,79,.75);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px', '<span style="font-size:44px">+</span>' + n, P); });
  s.src = D('left:150px;top:1100px', 'PROMPT PATTERN FROM ANTHROPIC ACADEMY', P, 'illus');
  s.nx = D('left:150px;top:1150px;background:rgba(201,160,79,.18);color:' + GOLD + ';border:2px solid ' + BRASS, '→ CLAUDE DRAFTS THE SKILL FILE', P, 'chip');
  var tS = SC[3], q = 'Create a skill for my weekly team update.', tF = W(L, 'format'), tT = W(L, 'tone'), tE = W(L, 'example'), tLk = W(L, 'liked');
  for (var i = 0; i < q.length; i += 3) E('type', tS + .15 + i / 26, { g: .35 });
  E('clip', tF); E('clip', tT); E('clip', tE); E('send', tLk + .2);
  s.u = function (t) { settle(s.cmp, t, tS + .05, { y: 30 }); var ty = typed(q, t, tS + .15, 26); s.tx.innerHTML = esc(ty) + (ty.length < q.length || Math.floor(t * 2.2) % 2 ? '<span style="display:inline-block;width:18px;height:38px;background:' + NAVY + ';vertical-align:-6px;margin-left:4px"></span>' : '');
    [tF, tT, tE].forEach(function (at, i) { drop(s.a[i], t, at, { y: -50, r: [-1.5, 1, -.5][i], r0: [-5, 4, -3][i] }); s.sl[i].style.opacity = t < at + .1 ? clamp((t - tS - .3) / .3, 0, 1) : 0; });
    s.snd.style.transform = 'scale(' + (1 + .25 * pop(t, tLk + .2, .35)) + ')'; s.snd.style.background = t > tLk + .2 ? GREEN : NAVY;
    s.src.style.opacity = t > tF ? 1 : 0; settle(s.nx, t, tLk + .25, { x: -20, y: 0 }); return 0; };
  return s; })(S[3]);

// ================= S5 · the card Claude writes (typewriter SKILL.md) =================
A[4] = (function (P) { var s = {}, L = 5;
  eyebrow(P, '// THE CARD CLAUDE WRITES'); head(P, 'Name + description:<br><em>what, and when.</em>');
  D('left:120px;top:500px;width:840px;height:64px;border-radius:32px;background:linear-gradient(180deg,#3a3d44,#0e0f12 60%,#24262b);box-shadow:0 12px 24px rgba(0,0,0,.6)', '', P);
  D('left:96px;top:512px;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f4e2b0,#a8873f 60%,#5b4419)', '', P); D('left:944px;top:512px;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f4e2b0,#a8873f 60%,#5b4419)', '', P);
  s.cd = D('left:156px;top:536px;width:752px;height:600px;padding:40px 24px 0 88px;font:700 28px/48px CP;white-space:pre;transform:rotate(-1.2deg)', '', P, 'card');
  // lines: [text, highlight class]; frontmatter types live, instructions were typed earlier (lighter)
  s.L = ['---', 'name: weekly-team-update', 'description: Drafts my weekly update', '  (wins, blockers, priorities).', '  Use when I ask for my team update.', '---'];
  s.I = '## Instructions\n- Three bullets max per section\n- Direct tone, for my manager\n- Match the example I liked';
  s.ru = D('left:238px;top:668px;width:420px;height:12px;transform:rotate(-1.2deg);transform-origin:0 50%;border-radius:3px;background:repeating-linear-gradient(90deg,#5b4419 0 2px,transparent 2px 12px),linear-gradient(180deg,#e5c77a,#b48a3c);box-shadow:0 4px 8px rgba(0,0,0,.35)', '', P);
  s.c64 = OV(D('left:560px;top:578px;background:' + GREEN + ';color:#f3ead6;box-shadow:0 6px 12px rgba(0,0,0,.35)', '✓ ≤ 64 CHARS · a-z-', P, 'chip'));
  s.cw = OV(D('left:330px;top:818px;background:#f0c040;color:#2a1a08;box-shadow:0 6px 12px rgba(0,0,0,.35)', '▲ WHAT ✓', P, 'chip'));
  s.cn = OV(D('left:510px;top:818px;background:' + GREEN + ';color:#f3ead6;box-shadow:0 6px 12px rgba(0,0,0,.35)', '▲ WHEN ✓', P, 'chip'));
  s.k = 'QWERTYUI'.split('').map(function (c, i) { return D('left:' + (158 + i * 96) + 'px;top:1158px', c, P, 'key'); });
  s.il = D('left:150px;top:1272px', 'SKILL.md · YOURS WILL DIFFER', P, 'illus');
  var tS = SC[4], cps = 62, tN = W(L, 'name'), tWh = W(L, 'what'), tWn = W(L, 'when');
  var all = s.L.join('\n'), n0 = tS + .2; for (var i = 0; i < all.length; i += 4) E('type', n0 + i / cps, { g: .3 }); E('bell', n0 + all.length / cps + .05); E('tick', tN); E('hl', tWh); E('hl', tWn);
  s.u = function (t) { s.cd.style.opacity = 1;
    var n = Math.max(0, Math.min(all.length, Math.floor((t - n0) * cps))), done = all.slice(0, n).split('\n'), out = [];
    done.forEach(function (ln, i) { var h = esc(ln);
      if (i === 2 && t > tWh) h = h.replace('Drafts my weekly update', '<span class="hl" style="background:rgba(255,214,90,.6)">Drafts my weekly update</span>');
      if (i === 3 && t > tWh) h = h.replace('(wins, blockers, priorities).', '<span class="hl" style="background:rgba(255,214,90,.6)">(wins, blockers, priorities).</span>');
      if (i === 4 && t > tWn) h = h.replace('Use when I ask for my team update.', '<span class="hl" style="background:rgba(110,190,140,.55)">Use when I ask for my team update.</span>');
      out.push(i === 0 || i === 5 ? '<span style="opacity:.55">' + h + '</span>' : h); });
    var cur = n < all.length || Math.floor(t * 2.2) % 2 ? '<span style="display:inline-block;width:14px;height:30px;background:' + NAVY + ';vertical-align:-5px;margin-left:2px"></span>' : '';
    s.cd.innerHTML = out.join('\n') + cur + '\n<span style="opacity:' + (n >= all.length ? .9 : .38) + '">' + esc(s.I) + '</span>';
    var typing = n > 0 && n < all.length, kd = typing ? (n * 7 + 3) % 8 : -1; s.k.forEach(function (k, i) { k.className = 'key' + (i === kd ? ' dn' : ''); k.style.transform = i === kd ? 'translateY(8px)' : ''; });
    var ru = ec((t - tN) / .4); s.ru.style.opacity = t < tN ? 0 : 1; s.ru.style.transform = 'rotate(-1.2deg) scaleX(' + ru + ')'; settle(s.c64, t, tN + .3, { y: 0, x: 20 });
    stampIn(s.cw, t, tWh, -2); stampIn(s.cn, t, tWn, 1); return 0; };
  return s; })(S[4]);

// ================= S6 · step 3: file the card (drawer closes) + where it lives =================
A[5] = (function (P) { var s = {}, L = 6;
  eyebrow(P, '// STEP 3 · FILE THE CARD'); head(P, 'Save it. <em>Switch it on.</em>');
  s.c = Cab(P, 110, 440, 500);
  s.app = D('left:610px;top:500px;width:308px;height:300px;padding:20px 22px', '<div style="font:700 17px CP;letter-spacing:.16em;color:#8a7a5a">CLAUDE APP</div><div style="display:flex;align-items:center;gap:10px;margin-top:14px;font:700 26px/1.2 IN;color:#1d2230">' + ic('settings', 30, NAVY) + 'Skills settings</div><div style="margin-top:26px;font:700 21px/1.3 CP;color:' + NAVY + '">weekly-team-<br>update</div><div class="tg" style="left:192px;top:196px"><i></i></div><div class="st" style="position:absolute;left:22px;top:250px;font:700 19px CP;letter-spacing:.12em;color:#8a7a5a">OFF</div>', P, 'plain');
  s.tg = s.app.querySelector('.tg'); s.tgk = s.tg.querySelector('i'); s.tgs = s.app.querySelector('.st');
  s.cc = D('left:150px;top:1010px;width:768px;height:250px;padding:20px 26px;background:#14100d;color:#e8dcc0;border:2px solid #5b4419', '<div style="display:flex;align-items:center;gap:10px;font:700 18px CP;letter-spacing:.16em;color:' + BRASS + '">' + ic('terminal-2', 26, BRASS) + 'CLAUDE CODE · IT\'S A FOLDER</div><div class="tx" style="margin-top:16px;font:700 30px/1.45 CP;white-space:pre"></div>', P, 'plain');
  s.cct = s.cc.querySelector('.tx');
  s.fl = OV(D('left:300px;top:850px', 'FILED', P, 'stamp dark'));
  var tS = SC[5], tSv = W(L, 'save'), tOn = W(L, 'on'), tCC = W(L, 'claude'), tF = W(L, 'folder');
  var tree = '~/.claude/skills/\n  weekly-team-update/\n    SKILL.md';
  E('lower', tS + .2); E('drawer', tSv + .05, { g: .55 }); E('thunk', tSv + .6); E('toggle', tOn); for (var i = 0; i < tree.length; i += 4) E('type', tCC + i / 34, { g: .3 }); E('stamp', tSv + .65, { g: .5 });
  s.u = function (t) {
    var l = 1 - ec((t - tS - .15) / .5), u = 1 - ec((t - tSv) / .55);
    s.c.set(u, l > 0.001 ? l : 0);
    var lab = s.c.label(1, 0); var g = t > tSv + .55; lab.style.background = g ? 'rgba(126,200,150,.55)' : ''; lab.style.boxShadow = g ? '0 0 12px rgba(126,224,150,.7)' : '';
    stampIn(s.fl, t, tSv + .65, -6);
    settle(s.app, t, tS + .3, { x: 30, y: 0 }); var on = t >= tOn, v = ec((t - tOn) / .2); s.tgk.style.left = lerp(6, 50, on ? v : 0) + 'px'; s.tg.style.background = on ? GREEN : '#5d5446'; s.tgs.textContent = on ? 'ON' : 'OFF'; s.tgs.style.color = on ? GREEN : '#8a7a5a';
    settle(s.cc, t, tS + .45, { y: 30 }); var ty = typed(tree, t, tCC, 34); s.cct.innerHTML = esc(ty).replace('SKILL.md', '<span style="color:' + GOLD + '">SKILL.md</span>') + (Math.floor(t * 2.2) % 2 ? '<span style="display:inline-block;width:14px;height:30px;background:' + BRASS + ';vertical-align:-5px;margin-left:2px"></span>' : '');
    s.cc.style.boxShadow = t > tF ? '0 0 0 3px ' + BRASS + ',0 16px 34px rgba(0,0,0,.55)' : '';
    return pop(t, tSv + .6, .18) * .5; };
  return s; })(S[5]);

// ================= S7 · step 4: test in a new chat (mocap librarian pulls the card) =================
var SPD = window.RIG.speed('walk');
A[6] = (function (P) { var s = {}, L = 7;
  eyebrow(P, '// STEP 4 · DOES IT PICK THE CARD?'); head(P, 'Test it in a <em>new chat.</em>');
  s.ch = D('left:150px;top:420px;width:768px;height:272px;border-radius:16px;padding:20px 24px;background:rgba(245,238,219,.97)', '<div style="font:700 17px CP;letter-spacing:.16em;color:#8a7a5a">NEW CHAT · ILLUSTRATIVE</div><div class="ub" style="margin-top:10px;margin-left:auto;width:max-content;max-width:560px;background:' + NAVY + ';color:#f3ead6;border-radius:16px 16px 4px 16px;padding:12px 18px;font:500 26px/1.3 IN;min-height:60px"></div><div class="rd" style="margin-top:14px;display:flex;align-items:center;gap:12px;font:700 25px CP;color:' + NAVY + '"><span class="sp" style="width:26px;height:26px;border-radius:50%;border:4px solid ' + BRASS + ';border-top-color:transparent"></span>Reading weekly-team-update…</div><div class="rs" style="margin-top:10px;display:flex;gap:10px;align-items:center;font:500 23px IN;color:#1d2230"><span style="background:#e7dcc0;border-radius:6px;padding:4px 10px">Wins</span><span style="background:#e7dcc0;border-radius:6px;padding:4px 10px">Blockers</span><span style="background:#e7dcc0;border-radius:6px;padding:4px 10px">Priorities</span><span style="margin-left:auto;font:700 22px CP;color:' + GREEN + '">✓ MATCHES YOUR EXAMPLE</span></div>', P, 'plain');
  s.ub = s.ch.querySelector('.ub'); s.rd = s.ch.querySelector('.rd'); s.sp = s.ch.querySelector('.sp'); s.rs = s.ch.querySelector('.rs');
  s.c = Cab(P, 418, 722, 520);
  s.glow = D('width:120px;height:80px;border-radius:50%;background:radial-gradient(rgba(255,215,120,.6),transparent 70%)', '', P);
  s.fig = OV(D('left:0;top:0;width:1080px;height:1920px;pointer-events:none', '<svg width="1080" height="1920" style="overflow:visible"><ellipse class="sh" cy="1266" rx="110" ry="15" fill="rgba(0,0,0,.45)"/><g class="g"></g></svg>', P));
  s.g = s.fig.querySelector('.g'); s.sh = s.fig.querySelector('.sh');
  s.sharp = D('left:150px;top:1272px;background:' + RED + ';color:#fff4e6;box-shadow:0 6px 14px rgba(0,0,0,.4)', 'NOT PICKED UP? SHARPEN THE DESCRIPTION', P, 'chip');
  var tS = SC[6], tT = W(L, 'test'), tCh = W(L, 'chat'), tIf = W(L, 'if'), tSh = W(L, 'sharpen');
  var q = "Draft this week's update from these notes.";
  var sc = 1.32, oy = 1262, xStop = 372, tStop = tCh - .1, tReach = tStop + .15;
  var pl = s.c.plate(1, 0), target = [pl[0], pl[1] + 44 * s.c.k];
  function ik(S0, E0, H0, T) { var l1 = Math.hypot(E0[0] - S0[0], E0[1] - S0[1]), l2 = Math.hypot(H0[0] - E0[0], H0[1] - E0[1]); var dx = T[0] - S0[0], dy = T[1] - S0[1], dd = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 1); var a = Math.atan2(dy, dx), b = Math.acos(clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1)), ea = a - b; var E = [S0[0] + l1 * Math.cos(ea), S0[1] + l1 * Math.sin(ea), E0[2]]; var vx = T[0] - E[0], vy = T[1] - E[1], vl = Math.hypot(vx, vy) || 1; return [E, [E[0] + vx / vl * l2, E[1] + vy / vl * l2, H0[2]]]; }
  for (var k = 0; k < 6; k++) E('step', tS + .1 + k * .4, { g: .5 }); E('drawer', tReach + .35); E('lift', tCh + .5); E('ding', tIf); E('stamp', tSh, { g: .5 });
  s.u = function (t) { settle(s.ch, t, tS + .05, { y: 24 });
    var uq = typed(q, t, tS + .2, 30); s.ub.textContent = uq; s.ub.style.opacity = uq.length ? 1 : 0;
    var rdOn = t > tCh; s.rd.style.opacity = rdOn ? 1 : 0; s.sp.style.transform = 'rotate(' + (t * 400 % 360) + 'deg)'; s.sp.style.opacity = t < tIf ? 1 : 0;
    s.rs.style.opacity = t > tIf ? 1 : 0; s.rs.style.transform = 'translateY(' + (t > tIf ? (1 - ec((t - tIf) / .3)) * 12 : 12) + 'px)';
    // robot: walks in (foot-locked: screen speed = clip travel speed), stops, reaches for the open drawer by 2-bone IK
    var walkT = Math.min(t, tStop) - tS, P0 = window.RIG.sample('walk', walkT, { loop: true, inplace: true });
    var ox = xStop - Math.abs(SPD) * sc * Math.max(0, tStop - t);
    var ur = sm((t - tReach) / .45), u = ec((t - tReach - .35) / .7), l = ec((t - tCh - .5) / .5);
    s.c.set(u, l > 0 ? l : 0);
    var T = [(target[0] - ox + (u * -20)) / sc, -(target[1] - oy) / sc];
    if (ur > 0) { var r = ik(P0.sR, P0.eR, P0.hR, T); P0.eR = [lerp(P0.eR[0], r[0][0], ur), lerp(P0.eR[1], r[0][1], ur), P0.eR[2]]; P0.hR = [lerp(P0.hR[0], r[1][0], ur), lerp(P0.hR[1], r[1][1], ur), P0.hR[2]]; }
    s.g.innerHTML = window.RIG.svg(P0, 'robot', { pal: { body: '#c9a04f', back: '#8a6a2c', edge: '#20396b', joint: '#20396b', inner: '#e8cf8a' } }); s.g.setAttribute('transform', 'translate(' + ox.toFixed(1) + ' ' + oy + ') scale(' + (SPD < 0 ? -sc : sc) + ' ' + sc + ')'); s.sh.setAttribute('cx', ox.toFixed(1));
    var cp = s.c.card; s.glow.style.opacity = l > .5 ? .5 + .5 * Math.sin(t * 6) * .3 + .2 : 0; if (cp) { s.glow.style.left = (cp[0] - 60) + 'px'; s.glow.style.top = (cp[1] - 40) + 'px'; }
    settle(s.sharp, t, tSh, { x: -20, y: 0 }); return 0; };
  return s; })(S[6]);

// ================= S8 · the context jar: dozens of skills cost almost nothing until needed =================
A[7] = (function (P) { var s = {}, L = 8;
  eyebrow(P, '// WHY DOZENS COST ALMOST NOTHING'); head(P, 'Until it\'s needed:<br><em>about 100 tokens.</em>');
  var jx = 360, jy = 540, jw = 380, jh = 700, base = jy + jh - 12;
  var sv = '<svg width="1080" height="1920" style="position:absolute;left:0;top:0"><defs><linearGradient id="jg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".18" stop-color="#fff" stop-opacity=".05"/><stop offset=".8" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient><clipPath id="jc"><rect x="' + (jx + 10) + '" y="' + (jy + 60) + '" width="' + (jw - 20) + '" height="' + (jh - 70) + '" rx="34"/></clipPath></defs>';
  sv += '<rect x="' + (jx + 20) + '" y="' + jy + '" width="' + (jw - 40) + '" height="46" rx="10" fill="#b48a3c" stroke="#5b4419" stroke-width="3"/>'; for (var i = 0; i < 14; i++) sv += '<rect x="' + (jx + 34 + i * 23) + '" y="' + (jy + 6) + '" width="6" height="34" rx="3" fill="#8a6a2c" opacity=".7"/>';
  sv += '<g clip-path="url(#jc)"><g class="str"></g><rect class="gh" x="' + (jx + 22) + '" y="' + (base - 24 * 1.6 - 92) + '" width="' + (jw - 44) + '" height="80" fill="none" stroke="#f5eedb" stroke-width="3" stroke-dasharray="10 8" opacity=".55"/></g>';
  sv += '<rect x="' + (jx + 10) + '" y="' + (jy + 60) + '" width="' + (jw - 20) + '" height="' + (jh - 70) + '" rx="34" fill="url(#jg)" stroke="rgba(230,240,255,.55)" stroke-width="4"/><rect x="' + (jx + 30) + '" y="' + (jy + 90) + '" width="14" height="' + (jh - 160) + '" rx="7" fill="#fff" opacity=".18"/>';
  for (var i = 1; i < 12; i++) sv += '<rect x="' + (jx + jw - 40 - (i % 2 ? 0 : 14)) + '" y="' + (jy + 60 + i * 52) + '" width="' + (i % 2 ? 18 : 32) + '" height="3" fill="#e6eef8" opacity=".35"/>';
  sv += '<text x="' + (jx + jw / 2) + '" y="' + (jy + 330) + '" text-anchor="middle" font-family="CP" font-weight="700" font-size="26" letter-spacing="3" fill="#c9bfa8" opacity=".85">CONTEXT WINDOW</text><text x="' + (jx + jw / 2) + '" y="' + (jy + 372) + '" text-anchor="middle" font-family="IN" font-weight="500" font-size="23" fill="#c9bfa8" opacity=".7">free for your actual work</text>';
  sv += '<text class="ght" x="' + (jx + jw / 2) + '" y="' + (base - 24 * 1.6 - 44) + '" text-anchor="middle" font-family="CP" font-weight="700" font-size="20" fill="#f5eedb" opacity=".8">a card, only when pulled</text>';
  sv += '<g class="pour"></g></svg>';
  s.svg = OV(D('left:0;top:0;width:1080px;height:1920px', sv, P)); s.str = s.svg.querySelector('.str'); s.pour = s.svg.querySelector('.pour'); s.gh = s.svg.querySelector('.gh'); s.ght = s.svg.querySelector('.ght');
  s.m = []; for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) s.m.push(D('left:' + (150 + c * 48) + 'px;top:' + (560 + r * 42) + 'px;width:42px;height:36px;border-radius:4px;background:linear-gradient(180deg,#4a2c1d,#2e1a10);box-shadow:inset 0 0 0 1px rgba(0,0,0,.4)', '<div style="margin:7px auto 0;width:24px;height:9px;border-radius:2px;background:#c9a04f"></div>', P));
  s.cnt = D('left:150px;top:820px;width:200px;font:700 20px/1.3 CP;color:#e6d3a6;letter-spacing:.04em', '', P);
  s.lg = [['LABEL', '~100 · always'], ['CARD', '&lt; 5k · if needed'], ['ENVELOPE', '0 · until opened']].map(function (a, i) { return D('left:150px;top:' + (960 + i * 100) + 'px;width:196px;padding-left:20px', a[0] + '<small>' + a[1] + '</small>', P, 'tagcard'); });
  s.mag = D('left:668px;top:1000px;width:250px;height:250px;border-radius:50%;border:10px solid #b48a3c;box-shadow:0 0 0 3px #5b4419,0 14px 26px rgba(0,0,0,.6);overflow:hidden;background:#1b120c', '<div class="ms" style="position:absolute;left:0;right:0;bottom:30px;height:0;background:repeating-linear-gradient(180deg,#c9a04f 0 2px,#8a6a2c 2px 4px)"></div><div style="position:absolute;left:44px;bottom:40px;font:700 17px CP;color:#2a1a08" class="ml">24 LABELS</div><div class="mg" style="position:absolute;left:12px;right:12px;bottom:92px;height:72px;border:3px dashed #f5eedb;opacity:.6"></div>', P);
  s.ms = s.mag.querySelector('.ms'); s.ml = s.mag.querySelector('.ml');
  s.dz = D('left:150px;top:1272px;background:' + GREEN + ';color:#f3ead6;box-shadow:0 6px 14px rgba(0,0,0,.4)', '24 SKILLS ≈ 2,400 TOKENS', P, 'chip');
  var tS = SC[7], tNd = W(L, "it's"), tHu = W(L, 'hundred'), tDz = W(L, 'dozens'), tCl = W(L, 'clever');
  for (var i = 0; i < 24; i++) E('tick', tNd + .1 + i * .045, { g: .25 }); E('pour', tNd + .1); E('pop', tHu); E('stamp', tDz, { g: .5 });
  s.u = function (t) { var n = clamp(Math.floor((t - tNd - .1) / .045) + 1, 0, 24);
    s.m.forEach(function (m, i) { m.style.boxShadow = i < n ? 'inset 0 0 0 1px rgba(0,0,0,.4),0 0 10px rgba(240,199,106,.55)' : 'inset 0 0 0 1px rgba(0,0,0,.4)'; });
    var g = ''; for (var i = 0; i < n; i++) g += '<rect x="370" y="' + (base - (i + 1) * 1.6) + '" width="360" height="1.6" fill="' + ['#c9a04f', '#e2c27a', '#b8913f'][i % 3] + '"/>'; s.str.innerHTML = g;
    var pu = n > 0 && n < 24; s.pour.innerHTML = pu ? '<path d="M300 ' + (580 + (n % 6) * 42) + ' C 360 560, 380 560, 420 600 L 430 ' + (base - n * 1.6) + '" fill="none" stroke="#f0c76a" stroke-width="4" stroke-dasharray="8 8" stroke-dashoffset="' + (-t * 120).toFixed(0) + '" style="filter:drop-shadow(0 0 6px #f0c76a)"/>' : '';
    s.cnt.innerHTML = n ? n + ' labels<br><span style="color:#f0c76a;font-size:30px">× ~100</span><br>tokens each' : '';
    s.gh.style.opacity = t > tCl + .2 ? .55 : 0; s.ght.style.opacity = t > tCl + .2 ? .8 : 0;
    s.lg.forEach(function (e, i) { settle(e, t, tS + .25 + i * .15, { x: -24, y: 0 }); });
    var mz = ec((t - tHu) / .4); s.mag.style.opacity = t < tHu ? 0 : 1; s.mag.style.transform = 'scale(' + lerp(.5, 1, mz) + ')'; s.ms.style.height = (n / 24 * 52).toFixed(1) + 'px';
    settle(s.dz, t, tDz, { x: -20, y: 0 }); return 0; };
  return s; })(S[7]);

// ================= S9 · the catch (real photo: typewriter on dark wood) =================
A[8] = (function (P) { var s = {}, L = 9;
  s.ph = D('left:0;top:0;width:1080px;height:1920px;background:url(photos/typewriter.jpg) center/cover;opacity:.55', '', P);
  D('left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(22,12,8,.85) 0,rgba(22,12,8,.35) 30%,rgba(22,12,8,.55) 70%,rgba(22,12,8,.92) 100%)', '', P);
  eyebrow(P, '// BEFORE YOU INSTALL ONE'); s.h = head(P, 'The <em>catch.</em>', 186); s.eb = P.querySelector('.eb'); s.eb.style.top = '152px';
  var cards = [['terminal-2', 'CODE EXECUTION ON', 'skills need it to run'], ['repeat', 'NO SYNC BETWEEN APPS', 'claude.ai · API · Claude Code: add it to each'], ['shield-check', 'ONLY SKILLS YOU TRUST', 'a bad one can run code it doesn\'t mention']];
  s.c = cards.map(function (c, i) { return D('top:' + (330 + i * 172) + 'px', '<div class="tb">' + ic(c[0], 54, '#fff4e6') + '</div><div><b>' + c[1] + '</b><span>' + esc(c[2]) + '</span></div>', P, 'warn'); });
  s.pw = D('left:150px;top:880px;width:768px;height:300px;padding:30px 30px 0 92px', '<div style="font:700 20px CP;letter-spacing:.16em;color:#8a6a2c">INSIDE SKILL.md</div><div style="margin-top:18px;font:700 34px/56px CP;color:' + NAVY + '">api_key: <span style="background:#1d2230;color:#1d2230;border-radius:4px">sk-ant-xxxxxxxx</span><br>password: <span style="background:#1d2230;color:#1d2230;border-radius:4px">hunter2hunter</span></div>', P, 'card');
  s.st = OV(D('left:420px;top:1010px', 'NO PASSWORDS', P, 'stamp'));
  s.kk = D('left:250px;top:1196px', 'OR API KEYS · KEEP SECRETS OUT', P, 'illus');
  s.lab = D('left:690px;top:1232px', 'PHOTO · UNSPLASH', P, 'illus');
  var tS = SC[8], tC = W(L, 'code'), tSy = W(L, 'sync'), tIn = W(L, 'install'), tPw = W(10, 'passwords'), tNv = W(10, 'never');
  E('thud', tC); E('thud', tSy); E('thud', tIn); E('card', tNv); E('stamp', tPw + .05);
  s.u = function (t) { var g = clamp((t - tS) / (SC[9] - tS), 0, 1); s.ph.style.transform = 'scale(' + lerp(1.08, 1, g).toFixed(4) + ') translateY(' + lerp(-20, 10, g).toFixed(1) + 'px)';
    [tC, tSy, tIn].forEach(function (at, i) { var on = t >= at - .05; settle(s.c[i], t, tS + .2 + i * .12, { y: 30, r: [-.6, .5, -.3][i], r0: [-3, 2.5, -2][i] });
      s.c[i].style.filter = on ? 'none' : 'brightness(.45) saturate(.3)'; s.c[i].style.transform += ' scale(' + (1 + .015 * pop(t, at - .05, .3)) + ')'; });
    settle(s.pw, t, tS + .6, { y: 40, r: -1, r0: 2 }); s.pw.style.filter = t >= tNv ? 'none' : 'brightness(.45) saturate(.3)'; s.pw.style.transform += ' scale(' + (1 + .015 * pop(t, tNv, .3)) + ')'; stampIn(s.st, t, tPw + .05, -10); s.kk.style.opacity = t > tPw + .3 ? 1 : 0;
    return pop(t, tPw + .05, .2) * .5 + pop(t, tC, .15) * .2 + pop(t, tSy, .15) * .2 + pop(t, tIn, .15) * .2; };
  return s; })(S[8]);

// ================= S10 · recap card + CTA =================
A[9] = (function (P) { var s = {}, L = 11;
  D('left:0;top:0;width:1080px;height:1920px;background:radial-gradient(900px 700px at 22% 12%,rgba(255,190,110,.20),transparent 70%),linear-gradient(180deg,#33201a,#22140e 60%,#160c08)', '', P);
  s.bc = Cab(P, 40, 120, 1000); s.bc.el.style.opacity = .16;
  s.rc = D('left:150px;top:200px;width:768px;height:800px;padding:34px 34px 0 92px', '<div style="font:700 19px CP;letter-spacing:.16em;color:#8a6a2c">KEEP THIS CARD</div><div style="font:400 62px/1.05 DS;color:#1d2230;margin-top:12px">Teach Claude a skill<br>in 4 steps</div>' +
    [['PICK', 'a task you\'ve explained twice'], ['ASK', 'Claude: format · tone · one example'], ['SAVE', 'switch it on in Skills settings<br><span style="font-family:CP;font-weight:700;font-size:24px">~/.claude/skills/ in Claude Code</span>'], ['TEST', 'new chat · look for "Reading…"']].map(function (r, i) {
      return '<div class="rw" style="display:flex;gap:18px;align-items:flex-start;margin-top:' + (i ? 22 : 34) + 'px"><span style="flex:none;width:52px;height:52px;border-radius:8px;background:linear-gradient(180deg,#4a2c1d,#2e1a10);color:' + GOLD + ';font:700 28px/52px CP;text-align:center">' + (i + 1) + '</span><div><div style="font:700 30px CP;letter-spacing:.1em;color:' + NAVY + '">' + r[0] + '</div><div style="font:500 29px/1.3 IN;color:#3a3a42">' + r[1] + '</div></div></div>'; }).join('') +
    '<div style="margin-top:28px;border-top:3px dashed #c8bfa9;padding-top:16px;font:700 25px/1.4 CP;color:' + GREEN + '">name + description = what + when<br><span style="color:#8a6a2c">~100 tokens until it\'s needed</span></div>', P, 'card');
  s.rows = s.rc.querySelectorAll('.rw');
  s.ring = D('left:150px;top:1040px;width:220px;height:220px;border-radius:50%;background:url(profile.jpg) center/cover;border:8px solid ' + CARD + ';box-shadow:0 0 0 6px ' + BRASS + ',0 18px 40px rgba(0,0,0,.6)', '', P);
  s.hd = D('left:400px;top:1046px;font:400 46px/1 DS;color:' + INK + ';text-shadow:0 4px 14px rgba(0,0,0,.6);white-space:nowrap', '@sandesh.explains', P);
  s.sv = D('left:400px;top:1120px;background:linear-gradient(180deg,#d9b866,#b48a3c);color:#2a1a08', 'SAVE', P, 'btn');
  s.fo = D('left:584px;top:1120px;background:' + GREEN + ';color:#f3ead6', 'FOLLOW', P, 'btn');
  s.mr = D('left:400px;top:1222px;font:700 20px CP;letter-spacing:.12em;color:#cdb382', 'FOR MORE AI HOW-TOS', P);
  var tS = SC[9], tSv = W(L, 'save'), tFo = W(L, 'follow');
  E('card', tS + .1); for (var i = 0; i < 4; i++) E('tick', tS + .4 + i * .14, { g: .6 }); E('clink', tSv); E('chime', tFo);
  s.u = function (t) { s.bc.set(0, 0); settle(s.rc, t, tS + .05, { y: 40, r: -.6, r0: 2 });
    Array.prototype.forEach.call(s.rows, function (r, i) { settle(r, t, tS + .4 + i * .14, { x: -20, y: 0, s: 0 }); });
    settle(s.ring, t, tS + .25, { y: 0, s: .15 }); settle(s.hd, t, tS + .45, { x: 30, y: 0, s: 0 });
    settle(s.sv, t, tS + .6, { x: 30, y: 0, s: 0 }); s.sv.style.transform += ' scale(' + (1 + .18 * pop(t, tSv, .45) + (t > tSv ? .025 * Math.sin(t * 5) : 0)) + ')';
    settle(s.fo, t, tS + .7, { x: 30, y: 0, s: 0 }); s.fo.style.transform += ' scale(' + (1 + .18 * pop(t, tFo, .45) + (t > tFo ? .03 * Math.sin(t * 6) : 0)) + ')';
    settle(s.mr, t, tS + .9, { y: 0 }); return 0; };
  return s; })(S[9]);

// ---------------- tracker state per scene: [current step, label, visible] ----------------
var TR = [[0, '', 0], [0, 'FOUR<br>STEPS', 1], [1, 'STEP<br>1 OF 4', 1], [2, 'STEP<br>2 OF 4', 1], [2, 'STEP<br>2 OF 4', 1], [3, 'STEP<br>3 OF 4', 1], [4, 'STEP<br>4 OF 4', 1], [5, 'WHY IT<br>SCALES', 1], [0, '', 0], [0, '', 0]];
var tFour = W(2, 'four');
// ---------------- captions ----------------
var cap = D('', '', st); cap.id = 'cap';
function drawCap(t) { var last = 0; for (var i = 0; i < WD.length; i++) if (t >= WD[i].s - .02) last = i; var pi = 0; for (var j = 0; j < PG.length; j++) if (PG[j].indexOf(last) >= 0) pi = j;
  var out = PG[pi].map(function (wi) { return '<span class="' + (wi === last ? 'cur' : (wi < last ? 'w' : '')) + '">' + esc(WD[wi].w) + '</span>'; }).join(' ');
  if (cap.__h !== out) { cap.__h = out; cap.innerHTML = out; } }
// ---------------- background: lamp motes + overlays + WebGL desk ----------------
var motes = document.getElementById('motes'), MO = []; (function () { var r = rnd(11); for (var i = 0; i < 28; i++) { var m = D('', '', motes, 'mote'), sz = 2 + (i % 3); m.style.width = m.style.height = sz + 'px'; MO.push({ e: m, x: 60 + r() * 760, y: 80 + r() * 1000, vx: (r() - .5) * 14, vy: -4 - r() * 8, ph: r() * 6.28, a: .12 + (i % 5) * .05 }); } })();
function motesAt(t) { MO.forEach(function (m) { var y = ((m.y + m.vy * t) % 1100 + 1100) % 1100 + 60, x = m.x + m.vx * t * .3 + Math.sin(t * .7 + m.ph) * 18; m.e.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; m.e.style.opacity = (m.a * (.6 + .4 * Math.sin(t * 1.3 + m.ph))).toFixed(3); }); }
function vseek(v, tt) { return new Promise(function (res) { if (!v.duration) { res(); return; } if (Math.abs(v.currentTime - tt) < 1e-4 && v.readyState >= 2) { res(); return; } var done = false; function fin() { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); } v.addEventListener('seeked', fin); v.currentTime = tt; setTimeout(fin, 4000); }); }
var OV = {}; function ovl(id, src, blend, op) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.className = 'vid'; v.style.mixBlendMode = blend; v.style.opacity = op; st.appendChild(v); OV[id] = { v: v }; }
ovl('dust', 'dust-particles.webm', 'screen', .45); ovl('grain', 'film-grain.webm', 'multiply', .28);
function ovAt(id, on, t, fps) { var o = OV[id]; o.v.style.display = on ? 'block' : 'none'; if (!on || !o.v.duration) return Promise.resolve(); var d = o.v.duration, tt = (t % d), f = Math.floor(tt * fps); return vseek(o.v, Math.min(d - .01, (f + .5) / fps)); }
var glc = document.getElementById('gl'), bg = document.getElementById('bg');
var WH = 0.16; SC.slice(1).forEach(function (c) { E('flick', c - .1); });
// ---------------- seek ----------------
var FR = []; CF.forEach(function (n) { if (FR.indexOf(n) < 0) FR.push(n); });
var ready = Promise.all([window.GLP.load(['desk']), Promise.all(['dust', 'grain'].map(function (k) { return new Promise(function (r) { OV[k].v.addEventListener('loadeddata', r); setTimeout(r, 6000); }); })),
  Promise.all(FR.map(function (n) { return new Promise(function (r) { var i = new Image(); i.onload = function () { FIMG[n] = i; r(); }; i.onerror = r; i.src = '3d/' + n + '.png'; }); })),
  Promise.all(['photos/typewriter.jpg', 'profile.jpg'].map(function (u) { return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = u; }); })), document.fonts.ready]).then(function () { window.__ready = true; return window.__seek(0); });
window.EV = EV;
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var si = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
  // card flip-through: outgoing scene tips back about its top edge, the incoming one rises from below
  var vis = {}, prev = -1, nxt = -1, u = 0;
  if (si > 0 && t < SC[si] + WH) { prev = si - 1; u = sm((t - (SC[si] - WH)) / (2 * WH)); }
  else if (si < SC.length - 1 && t >= SC[si + 1] - WH) { nxt = si + 1; u = sm((t - (SC[si + 1] - WH)) / (2 * WH)); }
  var outI = prev >= 0 ? prev : (nxt >= 0 ? si : -1), inI = prev >= 0 ? si : (nxt >= 0 ? nxt : -1);
  scenes.forEach(function (s, i) { var show = i === si || i === outI || i === inI; s.style.display = show ? 'block' : 'none';
    if (!show) return;
    if (i === outI) { s.style.transform = 'rotateX(' + (58 * u).toFixed(2) + 'deg) translateY(' + (-80 * u).toFixed(1) + 'px)'; s.style.opacity = (1 - u).toFixed(3); s.style.zIndex = 2; }
    else if (i === inI) { s.style.transform = 'translateY(' + (180 * (1 - u)).toFixed(1) + 'px) rotateX(' + (-14 * (1 - u)).toFixed(2) + 'deg)'; s.style.opacity = Math.min(1, u * 1.6).toFixed(3); s.style.zIndex = 1; }
    else { s.style.transform = ''; s.style.opacity = 1; s.style.zIndex = 1; } });
  var jolt = 0; [outI, inI, si].forEach(function (k, j, arr) { if (k < 0 || arr.indexOf(k) !== j) return; var jj = A[k].u(t) || 0; if (k === si) jolt = jj; });
  st.style.transform = jolt ? 'translate(' + (Math.sin(t * 90) * 5 * jolt).toFixed(1) + 'px,' + (Math.cos(t * 77) * 4 * jolt).toFixed(1) + 'px)' : '';
  // tracker
  var tr = TR[si], tv = si === 1 ? ec((t - tFour) / .4) : tr[2]; trk.style.display = tv > 0 || (inI >= 0 && TR[inI][2]) || (outI >= 0 && TR[outI][2]) ? 'flex' : 'none';
  if (si === 1) { trk.style.opacity = tv; trk.style.transform = 'translateY(' + (-40 * (1 - tv)).toFixed(1) + 'px)'; }
  else { var o = tr[2]; if (outI >= 0 && inI >= 0) o = lerp(TR[outI][2], TR[inI][2], u); trk.style.opacity = o; trk.style.transform = ''; }
  var cur = tr[0]; trkSet(cur, tr[1] || (TR[inI >= 0 ? inI : si][1]), si > 0 ? ec((t - SC[si] - .1) / .3) : 0);
  // WebGL desk on scene 3 (moves with the scene during the flip)
  var gs = 2, glOn = si === gs || outI === gs || inI === gs; glc.style.display = glOn ? 'block' : 'none';
  if (glOn) { var sEl = scenes[gs]; glc.style.transform = sEl.style.transform; glc.style.opacity = sEl.style.opacity; glc.style.transformOrigin = '50% 0'; var uu = clamp((t - SC[gs] + .3) / (SC[gs + 1] - SC[gs] + .3), 0, 1); window.GLP.draw({ a: 'desk', camA: [lerp(-.25, .2, uu), .03, lerp(1.04, 1.2, uu)], par: .08, dim: .5, t: t }); }
  bg.style.opacity = glOn && si === gs && outI < 0 && inI < 0 ? 0 : 1;
  motesAt(t); drawCap(t);
  return Promise.all([ovAt('dust', si === 2, t, 25), ovAt('grain', si === 8 || si === 9, t, 30)]);
};
})();
