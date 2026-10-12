// "I was asleep when Claude wrote this." — Dawn Edition. Every layer is a pure function of t; word times come from the cloned
// voice (timing.js), the same times the soundtrack and its SFX were built on (audio.py -> events.json), so picture and sound agree.
// One wall clock (6:58.8 -> 7:40) drives the sky, the bedroom's lighting state and the masthead time. Cuts are a sunrise wipe:
// the next scene is revealed from the bottom up under a soft band of warm light (no dark dip, no double exposure).
(function () {
'use strict';
var SC = window.SC, WD = window.WD, PG = window.PG, DUR = window.TOTAL; window.__reelDurationSec = DUR;
var PR = window.PROJ, CORAL = '#ff5a3c', SKY = '#4a9dff', LEAF = '#2fae7a', INK = '#1d1d24', PAPER = '#fffaf1';
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function ec(x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); }
function eb(x) { x = clamp(x, 0, 1); var c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function key(k) { return k.replace(/[^a-z0-9']/gi, '').toLowerCase(); }
function W(p, k, n) { k = key(k); var c = 0; for (var i = 0; i < WD.length; i++) if (WD[i].p === p && WD[i].k === k) { if (c === (n || 0)) return WD[i].s; c++; } throw new Error('word ' + p + ' ' + k); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var st = document.getElementById('st');
function D(css, html, par, cls) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; if (cls) e.className = cls; (par || st).appendChild(e); return e; }
function OV(e) { e.dataset.ov = 1; return e; }   // deliberate overlay / full-frame figure layer (the lint skips these)
function ic(n, sz, col, sw) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" style="flex:none;vertical-align:middle">' + window.IC[n] + '</svg>'; }
function logo(n, sz, col) { return '<span class="lg" style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;color:' + col + ';flex:none;vertical-align:middle">' + window.LOGO[n] + '</span>'; }
function settle(el, t, at, o) { o = o || {}; var u = ec((t - at) / (o.d || .35)); el.style.opacity = t < at ? 0 : clamp((t - at) / .1, 0, 1); el.style.transform = 'translate(' + ((o.x || 0) * (1 - u)).toFixed(1) + 'px,' + ((o.y == null ? 26 : o.y) * (1 - u)).toFixed(1) + 'px) rotate(' + ((o.r || 0) + (o.r0 || 0) * (1 - u)).toFixed(2) + 'deg) scale(' + (1 + (o.s == null ? .03 : o.s) * (1 - u)).toFixed(4) + ')'; }
function drop(el, t, at, o) { o = o || {}; var u = eb((t - at) / (o.d || .42)); el.style.opacity = t < at ? 0 : clamp((t - at) / .08, 0, 1); el.style.transform = 'translateY(' + ((o.y || -60) * (1 - u)).toFixed(1) + 'px) rotate(' + ((o.r || 0) + (o.r0 == null ? -4 : o.r0) * (1 - u)).toFixed(2) + 'deg) scale(' + (1 + .06 * (1 - clamp(u, 0, 1))).toFixed(4) + ')'; }
function pop(t, at, d) { var x = t - at; return x < 0 || x > (d || .3) ? 0 : 1 - x / (d || .3); }
function cursor(on, col, h) { return on ? '<span style="display:inline-block;width:' + Math.round(h * .45) + 'px;height:' + h + 'px;background:' + col + ';vertical-align:-' + Math.round(h * .16) + 'px;margin-left:4px"></span>' : ''; }
// typed text that stays ahead of the voice: progress passes through (time, chars) checkpoints
function typedAt(s, t, pts) { var n = 0; if (t <= pts[0][0]) n = 0; else { n = s.length; for (var i = 0; i < pts.length - 1; i++) if (t < pts[i + 1][0]) { n = lerp(pts[i][1], pts[i + 1][1], (t - pts[i][0]) / (pts[i + 1][0] - pts[i][0])); break; } } return s.slice(0, Math.floor(clamp(n, 0, s.length))); }
window.EV = [];   // events live in events.json (written by audio.py from the same word times)

// ---------- wall clock: minutes after 6:00 ----------
var VS = SC.slice(); VS[1] = SC[1] + .95;   // the hook holds through the music drop at SC[1]; the first cut lands ~1 s later
function clockMin(t) { return t < SC[1] ? lerp(58.8, 60, t / SC[1]) : lerp(60, 100, (t - SC[1]) / (DUR - SC[1])); }
var SKYS = [[58, ['#0f1530', '#1e2552', '#3b3f7a']], [60, ['#1e2552', '#4b4a8c', '#c98a8a']], [70, ['#5a5aa0', '#ff9f80', '#ffd2a8']], [86, ['#a9cff5', '#ffdcc0', '#fff1e2']], [100, ['#bfe0ff', '#ffe6cc', '#fff4e6']]];
function hex(c) { return [1, 3, 5].map(function (k) { return parseInt(c.substr(k, 2), 16); }); }
function skyAt(m) { var a = SKYS[0], b = SKYS[SKYS.length - 1]; for (var i = 0; i < SKYS.length - 1; i++) if (m >= SKYS[i][0] && m <= SKYS[i + 1][0]) { a = SKYS[i]; b = SKYS[i + 1]; }
  var u = b[0] === a[0] ? 0 : (m - a[0]) / (b[0] - a[0]); function mix(c1, c2) { var x = hex(c1), y = hex(c2); return 'rgb(' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * u); }).join(',') + ')'; }
  return 'linear-gradient(180deg,' + mix(a[1][0], b[1][0]) + ' 0%,' + mix(a[1][1], b[1][1]) + ' 55%,' + mix(a[1][2], b[1][2]) + ' 100%)'; }
var skyEl = document.getElementById('sky');
function hhmm(m) { var h = 6 + Math.floor(m / 60), mm = Math.floor(m % 60); return h + ':' + (mm < 10 ? '0' : '') + mm; }

// ---------- clock hands over a projected dial (angle clockwise from 12) ----------
function handsSVG(J, ox, oy, k, minutes, col) { var c = J.c, x = J.x, y = J.y;
  function at(a, r) { return [ox + (c[0] + (y[0] - c[0]) * Math.cos(a) * r + (x[0] - c[0]) * Math.sin(a) * r) * k, oy + (c[1] + (y[1] - c[1]) * Math.cos(a) * r + (x[1] - c[1]) * Math.sin(a) * r) * k]; }
  var hh = 6 + minutes / 60, am = (minutes % 60) / 60 * 2 * Math.PI, ah = (hh % 12) / 12 * 2 * Math.PI, C = [ox + c[0] * k, oy + c[1] * k], M = at(am, .78), H = at(ah, .5), w = Math.hypot(x[0] - c[0], x[1] - c[1]) * k;
  return '<line x1="' + C[0].toFixed(1) + '" y1="' + C[1].toFixed(1) + '" x2="' + H[0].toFixed(1) + '" y2="' + H[1].toFixed(1) + '" stroke="' + col + '" stroke-width="' + (w * .09).toFixed(1) + '" stroke-linecap="round"/><line x1="' + C[0].toFixed(1) + '" y1="' + C[1].toFixed(1) + '" x2="' + M[0].toFixed(1) + '" y2="' + M[1].toFixed(1) + '" stroke="' + col + '" stroke-width="' + (w * .06).toFixed(1) + '" stroke-linecap="round"/><circle cx="' + C[0].toFixed(1) + '" cy="' + C[1].toFixed(1) + '" r="' + (w * .07).toFixed(1) + '" fill="' + CORAL + '"/>'; }

// ---------- scenes ----------
var scenes = [], A = [];
function scene() { var s = D('', null, st, 'sc'); scenes.push(s); return s; }
function eyebrow(P, txt, col) { var e = D('color:' + (col || '#ffb38a'), txt, P, 'eb'); return e; }
function head(P, html, col, top) { return D('color:' + (col || '#fbf4ff') + ';text-shadow:0 4px 16px rgba(0,0,0,.4)' + (top != null ? ';top:' + top + 'px' : ''), html, P, 'hd'); }
var S = []; for (var i = 0; i < 10; i++) S.push(scene());
// masthead (persistent: stays put across cuts)
var mast = D('', '', st, 'mast'); mast.innerHTML = '<div class="t">The 7&nbsp;a.m.<br>Edition</div>' + ['Connect', 'Brief', 'Schedule', 'Read'].map(function (n, i) { return '<div class="s"><span class="lb">STEP ' + (i + 1) + '</span><b>' + n + '</b></div>'; }).join('') + '<div class="tm"></div>';
var mS = mast.querySelectorAll('.s'), mT = mast.querySelector('.tm');
function mastSet(cur) { for (var i = 0; i < 4; i++) { var d = mS[i]; d.className = 's ' + (i + 1 === cur ? 'on' : (i + 1 < cur ? 'done' : '')); d.querySelector('.lb').innerHTML = 'STEP ' + (i + 1) + (i + 1 < cur ? ' <span style="color:' + LEAF + '">✓</span>' : ''); } }

// ================= S1 · hook: the night bedroom, the brief already half written =================
A[0] = (function (P) { var s = {}, L = 1;
  s.h = D('left:150px;top:160px;width:768px;font:800 84px/1 NR;letter-spacing:-.03em;color:#f3eefc;text-shadow:0 6px 24px rgba(0,0,0,.5)', 'Written while<br><i style="font-family:NR;font-style:italic;font-weight:600;color:#ffb38a">I slept.</i>', P);
  s.moon = D('left:760px;top:190px;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle at 38% 38%,#fff9ec,#e9e2ff 60%,#c9c2ea);box-shadow:0 0 60px 20px rgba(220,215,255,.25)', '', P);
  s.room = OV(D('left:0;top:300px;width:1080px;height:1240px', ['night', 'bluehour', 'sunrise'].map(function (n) { return '<img src="3d/bed_' + n + '.png" data-n="' + n + '" style="position:absolute;left:0;top:0;width:1080px">'; }).join('') + '<svg class="hd2" width="1080" height="1240" style="position:absolute;left:0;top:0;overflow:visible"></svg>', P));
  s.img = s.room.querySelectorAll('img'); s.hs = s.room.querySelector('.hd2');
  var F = PR.bedroom.face, fc = [F.c[0], F.c[1] + 300];
  s.glow = D('left:' + (fc[0] - 160) + 'px;top:' + (fc[1] - 160) + 'px;width:320px;height:320px;border-radius:50%;background:radial-gradient(rgba(255,190,120,.35),transparent 70%)', '', P);
  s.card = D('left:330px;top:440px;width:588px;padding:20px 26px 18px;border-radius:6px', '<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px double #1d1d24;padding-bottom:8px"><span style="font:800 34px NR;letter-spacing:-.02em">The 7 a.m. Edition</span><span class="mono" style="font-size:15px;color:#8b8172">MON 13 OCT</span></div><div class="r1" style="font:700 30px/1.35 IN;margin-top:12px"></div><div class="r2" style="font:700 30px/1.35 IN"></div><div class="r3" style="font:700 30px/1.35 IN"></div><div class="by" style="margin-top:12px;display:flex;align-items:center;gap:10px;font:700 15px RM;letter-spacing:.12em;color:#8b8172">' + logo('anthropic', 22, '#c9663f') + '<span>WRITTEN BY CLAUDE · 6:59 AM · ILLUSTRATIVE</span></div>', P, 'paper');
  s.r = [s.card.querySelector('.r1'), s.card.querySelector('.r2'), s.card.querySelector('.r3')]; s.by = s.card.querySelector('.by');
  s.lead = OV(D('left:0;top:0;width:1080px;height:1920px', '<svg width="1080" height="1920"><path d="M 560 740 C 560 820, ' + (fc[0] + 40) + ' ' + (fc[1] - 90) + ', ' + (fc[0] + 12) + ' ' + (fc[1] - 40) + '" fill="none" stroke="#ffb38a" stroke-width="3" stroke-dasharray="4 8"/></svg>', P));
  var rows = [['3', ' meetings today'], ['2', ' emails need a reply'], ['1', ' thing you promised']];
  var tc = W(L, 'claude'), tDrop = SC[1];
  s.u = function (t) {
    // typing: row 1 done at frame 0, row 2 types over the first second, row 3 lands with the drop
    var r2 = typedAt(rows[1][1], t, [[0, 6], [1.1, rows[1][1].length]]), r3 = typedAt(rows[2][1], t, [[tDrop - .55, 0], [tDrop - .05, rows[2][1].length]]);
    s.r[0].innerHTML = '<span style="color:' + CORAL + '">3</span>' + rows[0][1];
    s.r[1].innerHTML = '<span style="color:' + CORAL + '">2</span>' + esc(r2) + cursor(r2.length < rows[1][1].length, INK, 30);
    s.r[2].innerHTML = t < tDrop - .55 ? '<span style="color:#d6cec0">1 thing you promised</span>' : '<span style="color:' + CORAL + '">1</span>' + esc(r3) + cursor(t < tDrop && Math.floor(t * 2.4) % 2 === 0, INK, 30);
    s.by.style.opacity = t < tc ? .25 : 1; s.by.style.transform = 'scale(' + (1 + .12 * pop(t, tc, .3)) + ')'; s.by.style.transformOrigin = '0 50%';
    // the drop: 7:00, first light, the room warms, a gentle push-in
    var m = clockMin(t), sun = sm((t - (tDrop - .25)) / .7), blue = sm((t - (tDrop - .9)) / .6);
    s.img[1].style.opacity = blue; s.img[2].style.opacity = sun;
    s.hs.innerHTML = handsSVG(F, 0, 0, 1, m, INK);
    var push = ec((t - tDrop) / 1.0); s.room.style.transform = 'scale(' + (1 + .05 * push).toFixed(4) + ')'; s.room.style.transformOrigin = '62% 30%';
    s.card.style.transform = 'rotate(' + (-1.5 + 1.5 * push).toFixed(2) + 'deg) translateY(' + (-14 * push).toFixed(1) + 'px) scale(' + (1 + .04 * push + .03 * pop(t, tDrop, .3)).toFixed(4) + ')';
    s.moon.style.opacity = 1 - sun; s.moon.style.transform = 'translateY(' + (40 * sun).toFixed(1) + 'px)';
    s.glow.style.opacity = 1 - sun * .7;
    return pop(t, tDrop, .22) * .55; };
  return s; })(S[0]);

// ================= S2 · the night shift: a mocap robot sorts the inbox into three trays =================
var SPD = window.RIG.speed('walk');
A[1] = (function (P) { var s = {}, L = 2;
  eyebrow(P, '// WHILE YOU SLEEP', '#ffb38a'); head(P, 'It reads <i>two apps.</i>');
  s.chute = D('left:150px;top:470px;width:230px;height:170px;border-radius:16px;background:rgba(255,250,241,.95);box-shadow:0 14px 28px rgba(0,0,0,.3);padding:16px', '<div style="display:flex;align-items:center;gap:10px;font:700 26px IN">' + ic('mail', 34, SKY) + 'Gmail</div><div style="margin-top:8px;font:700 16px RM;letter-spacing:.12em;color:#8b8172">INBOX · 41 NEW</div><div style="position:absolute;left:20px;right:20px;bottom:16px;height:14px;border-radius:7px;background:#2a2e48"></div>', P);
  s.cal = D('left:688px;top:470px;width:230px;height:170px;border-radius:16px;background:rgba(255,250,241,.95);box-shadow:0 14px 28px rgba(0,0,0,.3);padding:16px;overflow:hidden', '<div style="display:flex;align-items:center;gap:10px;font:700 24px IN">' + logo('gcal', 32, '#4285f4') + 'Calendar</div><div class="pg2" style="margin-top:10px;font:800 54px/1 NR;color:' + CORAL + '">MON</div>', P);
  s.calp = s.cal.querySelector('.pg2');
  s.week = D('left:150px;top:660px;width:768px;display:flex;gap:10px', ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(function (d, i) { return '<div class="wk" style="flex:1;height:58px;border-radius:10px;background:' + (i < 5 ? 'rgba(255,250,241,.18)' : 'rgba(255,250,241,.06)') + ';border:2px solid rgba(255,250,241,' + (i < 5 ? '.5' : '.15') + ');text-align:center;font:700 16px/22px RM;color:#fff1e6;padding-top:6px">' + d + '<br><span style="font-size:15px;opacity:' + (i < 5 ? 1 : .35) + '">' + (i < 5 ? '7:00' : '—') + '</span></div>'; }).join(''), P);
  s.wk = s.week.querySelectorAll('.wk');
  // belt, trays, envelopes, robot
  s.belt = D('left:150px;top:1188px;width:470px;height:22px;border-radius:11px;background:repeating-linear-gradient(90deg,#2a2e48 0 26px,#3a3f63 26px 52px);box-shadow:0 8px 16px rgba(0,0,0,.35)', '', P);
  var TR = [['MEETINGS', 'calendar'], ['NEEDS ME', 'mail'], ['PROMISES', 'circle-check']];
  s.tr = TR.map(function (x, i) { return D('left:700px;top:' + (760 + i * 136) + 'px', '<b>' + ic(x[1], 22, CORAL) + x[0] + '</b><div class="cnt">0</div>', P, 'tray'); });
  s.cnt = s.tr.map(function (e) { return e.querySelector('.cnt'); });
  s.env = []; for (var i = 0; i < 4; i++) s.env.push(OV(D('', '', P, 'env')));
  s.fig = OV(D('left:0;top:0;width:1080px;height:1920px;pointer-events:none', '<svg width="1080" height="1920" style="overflow:visible"><ellipse class="sh" cx="440" cy="1262" rx="120" ry="16" fill="rgba(0,0,0,.35)"/><g class="g"></g></svg>', P));
  s.g = s.fig.querySelector('.g');
  var t0 = VS[1], PER = 1.15, ox = 440, oy = 1258, sc = 1.18;
  var tCal = W(L, 'calendar'), tWk = W(L, 'weekday'), tSet = W(L, 'setup');
  var base = window.RIG.damp(window.RIG.sample('walk', .5, { inplace: true }), 'walk', .12);
  function ik(S0, E0, H0, T) { var l1 = Math.hypot(E0[0] - S0[0], E0[1] - S0[1]), l2 = Math.hypot(H0[0] - E0[0], H0[1] - E0[1]); var dx = T[0] - S0[0], dy = T[1] - S0[1], dd = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 1); var a = Math.atan2(dy, dx), b = Math.acos(clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1)), ea = a + b; var E = [S0[0] + l1 * Math.cos(ea), S0[1] + l1 * Math.sin(ea), E0[2]]; var vx = T[0] - E[0], vy = T[1] - E[1], vl = Math.hypot(vx, vy) || 1; return [E, [E[0] + vx / vl * l2, E[1] + vy / vl * l2, H0[2]]]; }
  function W2R(p) { return [(p[0] - ox) / sc, -(p[1] - oy) / sc]; }
  function robot(P0) {   // rounded shell skin: cream body, navy limbs, coral visor, mail satchel
    function L2(a, b, w, c) { return '<line x1="' + a[0].toFixed(1) + '" y1="' + (-a[1]).toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + (-b[1]).toFixed(1) + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>'; }
    var o = '';
    o += L2(P0.hip, P0.kL, 30, '#2a2e48') + L2(P0.kL, P0.fL, 26, '#2a2e48') + L2(P0.fL, P0.tL, 20, '#2a2e48');
    o += L2(P0.sL, P0.eL, 22, '#3a6fd0') + L2(P0.eL, P0.hL, 20, '#3a6fd0');
    var sh = P0.sL, sr = P0.sR, hp = P0.hip;
    o += '<path d="M ' + (sh[0] - 6).toFixed(1) + ' ' + (-sh[1] + 2).toFixed(1) + ' L ' + (sr[0] + 6).toFixed(1) + ' ' + (-sr[1] + 2).toFixed(1) + ' L ' + (hp[0] + 26).toFixed(1) + ' ' + (-hp[1] + 4).toFixed(1) + ' L ' + (hp[0] - 26).toFixed(1) + ' ' + (-hp[1] + 4).toFixed(1) + ' Z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/>';
    o += '<line x1="' + (sh[0]).toFixed(1) + '" y1="' + (-sh[1] + 6).toFixed(1) + '" x2="' + (hp[0] + 22).toFixed(1) + '" y2="' + (-hp[1] - 4).toFixed(1) + '" stroke="' + CORAL + '" stroke-width="7"/>';
    o += '<rect x="' + (hp[0] + 6).toFixed(1) + '" y="' + (-hp[1] - 18).toFixed(1) + '" width="44" height="34" rx="6" fill="' + CORAL + '" stroke="' + INK + '" stroke-width="4"/>';
    o += L2(P0.hip, P0.kR, 32, '#3a3f63') + L2(P0.kR, P0.fR, 28, '#3a3f63') + L2(P0.fR, P0.tR, 22, '#3a3f63');
    o += L2(P0.sR, P0.eR, 24, SKY) + L2(P0.eR, P0.hR, 22, SKY);
    ['hL', 'hR'].forEach(function (k) { o += '<circle cx="' + P0[k][0].toFixed(1) + '" cy="' + (-P0[k][1]).toFixed(1) + '" r="15" fill="' + CORAL + '" stroke="' + INK + '" stroke-width="4"/>'; });
    var h = P0.head; o += '<line x1="' + h[0].toFixed(1) + '" y1="' + (-h[1] - 34).toFixed(1) + '" x2="' + h[0].toFixed(1) + '" y2="' + (-h[1] - 58).toFixed(1) + '" stroke="' + INK + '" stroke-width="4"/><circle cx="' + h[0].toFixed(1) + '" cy="' + (-h[1] - 62).toFixed(1) + '" r="8" fill="' + CORAL + '"/>';
    o += '<rect x="' + (h[0] - 44).toFixed(1) + '" y="' + (-h[1] - 36).toFixed(1) + '" width="88" height="70" rx="26" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="6"/><rect x="' + (h[0] - 28).toFixed(1) + '" y="' + (-h[1] - 14).toFixed(1) + '" width="62" height="24" rx="12" fill="' + INK + '"/><circle cx="' + (h[0] - 8).toFixed(1) + '" cy="' + (-h[1] - 2).toFixed(1) + '" r="6" fill="#ffb38a"/><circle cx="' + (h[0] + 16).toFixed(1) + '" cy="' + (-h[1] - 2).toFixed(1) + '" r="6" fill="#ffb38a"/>';
    return o; }
  var CHUTE = [365, 1170], PICK = [560, 1170], TRAYS = [[808, 832], [808, 968], [808, 1104]];
  s.u = function (t) {
    settle(s.chute, t, t0 + .05, { x: -30, y: 0 }); settle(s.cal, t, t0 + .15, { x: 30, y: 0 });
    s.calp.textContent = t < tCal ? 'MON' : ['TUE', 'WED', 'THU'][Math.min(2, Math.floor((t - tCal) / .35))] || 'THU'; s.calp.style.transform = 'scaleY(' + (1 - .7 * pop(t, tCal, .2)) + ')';
    Array.prototype.forEach.call(s.wk, function (e, i) { var on = i < 5 && t > tWk + i * .1; e.style.background = on ? 'rgba(255,90,60,.85)' : (i < 5 ? 'rgba(255,250,241,.18)' : 'rgba(255,250,241,.06)'); e.style.transform = on ? 'translateY(' + (-6 * pop(t, tWk + i * .1, .3)) + 'px)' : ''; });
    settle(s.week, t, t0 + .3, { y: 20 });
    s.tr.forEach(function (e, i) { settle(e, t, t0 + .2 + i * .1, { x: 30, y: 0 }); });
    // envelope cycle: belt -> robot's hand -> tray (i % 3); counts go up as they land
    var lt = t - t0 - .3, k = Math.floor(lt / PER), ph = lt / PER - k, counts = [0, 0, 0];
    for (var j = 0; j < k; j++) if (j >= 0) counts[j % 3]++;
    s.cnt.forEach(function (e, i) { e.textContent = 2 + counts[i] + [1, 0, 2][i]; });
    var hand = PICK, tray = TRAYS[((k % 3) + 3) % 3];
    s.env.forEach(function (e, i) { var kk = k - i + 1, p = ph + (i - 1); e.style.display = 'none';
      if (i === 0 && lt > 0) { // the one being handled this cycle
        var pos; if (ph < .45) { var u = sm(ph / .45); pos = [lerp(CHUTE[0], PICK[0], u), CHUTE[1] - 6]; } else if (ph < .9) { var v = sm((ph - .45) / .45); pos = [lerp(PICK[0], tray[0], v), lerp(PICK[1], tray[1], v) - 120 * Math.sin(Math.PI * v)]; } else pos = tray;
        hand = ph < .4 ? [lerp(PICK[0] + 40, PICK[0], sm(ph / .4)), PICK[1] - 80 + 60 * sm(ph / .4)] : [pos[0], pos[1] - 10];
        e.style.display = ph < .93 ? 'block' : 'none'; e.style.left = (pos[0] - 38).toFixed(1) + 'px'; e.style.top = (pos[1] - 25).toFixed(1) + 'px'; e.style.transform = 'rotate(' + (ph > .45 ? 12 * Math.sin(ph * 9) : 0).toFixed(1) + 'deg)'; }
      else if (i > 0 && lt > -.5) { var q = clamp(ph + i * .32, 0, 2); e.style.display = 'block'; e.style.left = (lerp(CHUTE[0] - 120, CHUTE[0] - 10, (q % 1)) - 38).toFixed(1) + 'px'; e.style.top = (CHUTE[1] - 31).toFixed(1) + 'px'; e.style.transform = ''; e.style.opacity = .9; } });
    var P0 = JSON.parse(JSON.stringify(base)), bob = Math.sin(t * 5.2) * 3; for (var q in P0) P0[q][1] += bob * (q === 'fL' || q === 'fR' || q === 'tL' || q === 'tR' ? 0 : 1);
    var r = ik(P0.sR, P0.eR, P0.hR, W2R(hand)); P0.eR = r[0]; P0.hR = r[1];
    var r2 = ik(P0.sL, P0.eL, P0.hL, W2R([ox - 40, 1080])); P0.eL = r2[0]; P0.hL = r2[1];
    s.g.innerHTML = robot(P0); s.g.setAttribute('transform', 'translate(' + ox + ' ' + oy + ') scale(' + (SPD < 0 ? -sc : sc) + ' ' + sc + ')');
    s.fig.style.opacity = clamp((t - t0) / .25, 0, 1);
    s.tr.forEach(function (e, i) { e.style.boxShadow = '0 12px 24px rgba(10,10,30,.35)' + (pop(t, t0 + .3 + (Math.floor((t - t0 - .3) / PER) * PER) + PER * .9, .35) > 0 && ((k - 1) % 3 + 3) % 3 === i ? ',0 0 0 4px ' + CORAL : ''); });
    return 0; };
  return s; })(S[1]);

// ================= S3 · step 1: the click path is the hero =================
A[2] = (function (P) { var s = {}, L = 3;
  eyebrow(P, '// STEP 1 · CUSTOMIZE → CONNECTORS'); head(P, 'Connect Gmail<br><i>+ Calendar.</i>');
  var rows = [['Customize', ''], ['Connectors', ''], ['Discover', 'search “Gmail”'], ['Connect to Claude', ''], ['Sign in with Google', '· approve'], ['Shows “Connected”', '']];
  s.card = D('left:150px;top:500px;width:768px', '<div class="lab">DO THIS · IN CLAUDE</div>' + rows.map(function (r, i) { return '<div class="row"><span class="n">' + (i < 5 ? i + 1 : '✓') + '</span>' + r[0] + (r[1] ? '<small>' + r[1] + '</small>' : '') + '</div>'; }).join(''), P, 'do');
  s.rows = s.card.querySelectorAll('.row');
  s.pg = D('left:150px;top:1080px', ic('mail', 44, SKY) + 'Gmail<span class="led"></span><span class="pin"></span>', P, 'plug');
  s.pc = D('left:150px;top:1214px;height:70px;font-size:24px;box-shadow:none;background:rgba(255,250,241,.92)', logo('gcal', 34, '#4285f4') + 'Calendar<span class="led" style="top:28px"></span>', P, 'plug');
  s.sock = D('left:434px;top:1080px;width:96px;height:204px;border-radius:14px;background:#2a2e48;box-shadow:inset 0 0 0 4px #474c70,0 12px 24px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#ffd3c7;font:700 15px RM;letter-spacing:.12em', logo('anthropic', 40, '#ff9b7a') + 'CLAUDE', P);
  s.c1 = D('left:556px;top:1092px;background:#fffaf1;color:#1d1d24;box-shadow:0 8px 18px rgba(0,0,0,.25)', 'REPEAT FOR GOOGLE CALENDAR', P, 'chip');
  s.c2 = D('left:556px;top:1160px;background:rgba(16,20,44,.75);color:#ffd3c7', 'IN A CHAT: + → CONNECTORS → ON', P, 'chip');
  s.c3 = D('left:556px;top:1236px;font-size:13px;background:rgba(16,20,44,.6);color:#c8c3e0', 'MENU NAMES: CLAUDE DOCS · OCT 2026', P, 'illus');
  var t0 = VS[2], tG = W(L, 'gmail'), tC = W(L, 'calendar'), tCu = W(L, 'customize'), tCo = W(L, 'connectors');
  // rows advance through the scene; the two spoken menu names pulse when said
  var adv = [t0 + .35, t0 + 1.1, t0 + 1.9, t0 + 2.7, t0 + 3.5, Math.min(VS[3] - .9, t0 + 4.3)];
  s.u = function (t) { settle(s.card, t, t0 + .05, { y: 30 });
    var cur = 0; for (var i = 0; i < 6; i++) if (t >= adv[i]) cur = i + 1;
    Array.prototype.forEach.call(s.rows, function (r, i) { r.className = 'row ' + (i < cur - 1 || (i === 5 && cur === 6) ? 'done' : (i === cur - 1 ? 'cur' : '')); r.querySelector('.n').textContent = (i < cur - 1 || (i === 5 && cur === 6)) ? '✓' : (i < 5 ? i + 1 : '✓');
      var pz = i === 0 ? pop(t, tCu, .4) : (i === 1 ? pop(t, tCo, .4) : 0); r.style.transform = 'scale(' + (1 + .04 * pz) + ')'; r.style.transformOrigin = '0 50%'; });
    var g = ec((t - tG) / .35), c = ec((t - tC) / .35);
    s.pg.style.opacity = t < tG - .3 ? .25 : 1; s.pg.style.transform = 'translateX(' + (-60 * (1 - g)).toFixed(1) + 'px)'; s.pg.querySelector('.led').style.background = t > tG + .35 ? LEAF : '#c9c2b4'; s.pg.querySelector('.led').style.boxShadow = t > tG + .35 ? '0 0 12px ' + LEAF : 'none';
    s.pc.style.opacity = t < tC - .3 ? .25 : 1; s.pc.style.transform = 'translateX(' + (-60 * (1 - c)).toFixed(1) + 'px)'; s.pc.querySelector('.led').style.background = t > tC + .35 ? LEAF : '#c9c2b4';
    settle(s.sock, t, t0 + .2, { y: 0, x: 0, s: .1 }); settle(s.c1, t, tC + .2, { x: 20, y: 0 }); settle(s.c2, t, tCo, { x: 20, y: 0 }); settle(s.c3, t, tCo + .3, { y: 0 });
    return 0; };
  return s; })(S[2]);

// ================= S4 · step 2: write the brief (the prompt is the hero) + the edition laid out =================
A[3] = (function (P) { var s = {}, L = 4;
  eyebrow(P, '// STEP 2 · THREE COLUMNS, FIVE LINES'); head(P, 'Write the <i>brief.</i>');
  s.card = D('left:150px;top:430px;width:768px;min-height:470px', '<div class="lab">PASTE THIS · YOUR BRIEF</div><div class="tx mono" style="margin-top:14px;font-size:33px;line-height:1.36;white-space:pre-wrap;color:#1d1d24"></div>', P, 'do');
  s.tx = s.card.querySelector('.tx');
  s.page = D('left:150px;top:930px;width:768px;padding:16px 24px 14px;border-radius:4px', '<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:4px double #1d1d24;padding-bottom:6px"><span style="font:800 34px NR;letter-spacing:-.02em">The 7 a.m. Edition</span><span class="mono" style="font-size:14px;color:#8b8172">LAYOUT</span></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:10px">' + ['MEETINGS', 'NEEDS A REPLY', 'YOU PROMISED'].map(function (h, i) { return '<div class="col c' + i + '"><h4>' + h + '</h4>' + [0, 1, 2, 3, 4].map(function (k) { return '<i style="display:block;height:9px;border-radius:5px;background:#e6ddcd;margin:7px 0;width:' + [92, 80, 88, 70, 84][(k + i) % 5] + '%"></i>'; }).join('') + '</div>'; }).join('') + '</div>', P, 'paper');
  s.cols = [0, 1, 2].map(function (i) { return s.page.querySelector('.c' + i); });
  s.nl = OV(D('left:640px;top:880px;background:#fffaf1;color:#8b8172;box-shadow:0 6px 14px rgba(0,0,0,.25)', 'NEWSLETTERS', P, 'chip'));
  var t0 = VS[3], tM = W(L, 'meetings'), tE = W(L, 'emails'), tP = W(L, 'promised'), tT = W(5, 'three'), tS = W(5, 'skip'), tN = W(5, 'newsletters');
  var A1 = 'Every weekday, brief me on:\n', A2 = '1. today\'s meetings\n', A3 = '2. emails that need me\n', A4 = '3. anything I promised someone\n', A5 = '3 sections · 5 lines each\n', A6 = 'Skip newsletters.';
  var full = A1 + A2 + A3 + A4 + A5 + A6, c = [A1.length, A1.length + A2.length, A1.length + A2.length + A3.length, A1.length + A2.length + A3.length + A4.length, full.length - A6.length, full.length];
  var pts = [[t0 + .15, 0], [t0 + 1.1, c[0]], [tM - .1, c[1]], [tE - .05, c[2]], [tP + .1, c[3]], [tT + .2, c[4]], [tS + .15, c[5]]];
  s.u = function (t) { settle(s.card, t, t0 + .05, { y: 30 }); settle(s.page, t, t0 + .3, { y: 40, r: -.6, r0: 1.5 });
    var ty = typedAt(full, t, pts), h = esc(ty);
    function mark(txt, at, col) { if (t > at) h = h.replace(esc(txt), '<span style="background:' + col + ';border-radius:4px">' + esc(txt) + '</span>'); }
    mark("today's meetings", tM, 'rgba(255,179,138,.55)'); mark('emails that need me', tE, 'rgba(74,157,255,.3)'); mark('anything I promised someone', tP, 'rgba(47,174,122,.3)');
    s.tx.innerHTML = h + cursor(ty.length < full.length || Math.floor(t * 2.2) % 2 === 0, CORAL, 34);
    [tM, tE, tP].forEach(function (at, i) { var u = ec((t - at) / .35); s.cols[i].style.opacity = .25 + .75 * u; s.cols[i].style.transform = 'translateY(' + (10 * (1 - u)).toFixed(1) + 'px)'; });
    // the newsletters chip appears, then gets struck out on "skip"
    settle(s.nl, t, tT, { y: -14 }); var k = ec((t - tS) / .3);
    s.nl.innerHTML = 'NEWSLETTERS' + (t > tS ? '<span style="position:absolute;left:8px;right:8px;top:50%;height:4px;background:' + CORAL + ';transform:scaleX(' + k.toFixed(3) + ');transform-origin:0 50%"></span>' : '');
    s.nl.style.opacity = t > tN + .6 ? .5 : s.nl.style.opacity;
    return 0; };
  return s; })(S[3]);

// ================= S5 · step 3: tell it when (exact message) + confirm + Schedule + Blender clock =================
A[4] = (function (P) { var s = {}, L = 6;
  eyebrow(P, '// STEP 3 · WEEKDAYS AT 7:00', '#ffe1cf'); head(P, 'Tell it <i>when.</i>', '#fffaf5');
  s.msg = D('left:150px;top:430px;width:768px;padding-bottom:26px', '<div class="lab">TYPE THIS · ONE TIME</div><div class="tx mono" style="margin-top:14px;font-size:40px;line-height:1.3;color:#1d1d24;min-height:104px"></div>', P, 'do');
  s.tx = s.msg.querySelector('.tx');
  s.ask = D('left:150px;top:640px;display:flex;gap:12px;align-items:center', '<span style="font:700 18px RM;letter-spacing:.12em;color:#fff1e6">CLAUDE MAY ASK</span><span class="mono" style="font-size:22px;padding:10px 16px;border-radius:999px;background:rgba(255,250,241,.9);color:#1d1d24">Which time zone?</span><span class="mono" style="font-size:22px;padding:10px 16px;border-radius:999px;background:rgba(255,250,241,.9);color:#1d1d24">Weekends too?</span>', P);
  s.ans = D('left:150px;top:706px;font:500 20px IN;color:#fff1e6', '→ answer, then check the card', P);
  s.conf = D('left:150px;top:756px;width:520px;padding:20px 24px', '<div style="display:flex;align-items:center;gap:10px;font:700 18px RM;letter-spacing:.14em;color:#8b8172">' + logo('anthropic', 24, '#c9663f') + 'CLAUDE CONFIRMS · ILLUSTRATIVE</div><div style="margin-top:14px;font:500 22px RM;color:#8b8172">NAME</div><div style="font:700 32px IN">Morning brief</div><div style="margin-top:10px;font:500 22px RM;color:#8b8172">SCHEDULE</div><div style="font:700 32px IN;color:' + CORAL + '">On weekdays · 7:00 AM</div><div style="margin-top:10px;font:500 22px RM;color:#8b8172">INSTRUCTIONS</div><div style="font:500 24px/1.3 IN">Meetings · emails that need me · promises</div>', P, 'do');
  s.btn = D('left:150px;top:1180px', 'Schedule ' + ic('check', 28, '#fff', 3), P, 'btn');
  s.ring = OV(D('left:330px;top:1214px;width:36px;height:36px;border-radius:50%;border:4px solid #fff', '', P));
  s.fq = D('left:420px;top:1196px;background:rgba(255,250,241,.85);color:#6c6457;font-size:17px', 'hourly · daily · weekly ·<br><b style="color:' + CORAL + '">on weekdays ✓</b> · manually', P, 'chip');
  var ck = 360 / 900, cx = 640, cy = 760, J = PR.clock;
  s.clk = OV(D('left:' + cx + 'px;top:' + cy + 'px;width:360px;height:400px', '<img src="3d/clock.png" style="width:360px;filter:drop-shadow(0 26px 30px rgba(80,30,40,.35));-webkit-mask:radial-gradient(closest-side,#000 70%,transparent 100%)"><svg class="hs" width="360" height="400" style="position:absolute;left:0;top:0;overflow:visible"></svg>', P));
  s.hs = s.clk.querySelector('.hs');
  var t0 = VS[4], tEv = W(L, 'every'), tSev = W(L, 'seven'), tAns = W(L, 'answer'), tSch = W(L, 'schedule');
  var msg = 'Every weekday at 7 a.m., run my morning brief.';
  s.u = function (t) { settle(s.msg, t, t0 + .05, { y: 30 });
    var ty = typedAt(msg, t, [[t0 + .2, 0], [tSev + .25, 23], [tAns - .2, msg.length]]); s.tx.innerHTML = esc(ty) + cursor(ty.length < msg.length || Math.floor(t * 2.2) % 2 === 0, CORAL, 40);
    settle(s.ask, t, tAns - .15, { x: -20, y: 0 }); settle(s.ans, t, tAns + .4, { y: 0 }); settle(s.conf, t, tAns + .55, { y: 30 });
    settle(s.btn, t, t0 + .6, { y: 0, s: .06 }); s.btn.style.transform += ' scale(' + (1 - .08 * pop(t, tSch, .25)) + ')'; s.btn.style.background = t > tSch ? LEAF : CORAL;
    s.ring.style.opacity = t > tSch - .3 && t < tSch + .5 ? 1 : 0; s.ring.style.transform = 'scale(' + (1 + 1.2 * clamp((t - tSch) / .4, 0, 1)) + ')';
    settle(s.fq, t, t0 + .8, { x: 20, y: 0 });
    // the clock sweeps from 6:52 to 7:00 across the scene, landing on "Schedule"
    var m = lerp(52, 60, sm((t - t0) / (tSch - t0))); settle(s.clk, t, t0 + .15, { y: 30, s: .08 }); s.hs.innerHTML = handsSVG(J, 0, 0, ck, m, INK);
    s.clk.style.transform += ' rotate(' + (2.5 * Math.sin(Math.max(0, t - tSch) * 40) * Math.exp(-Math.max(0, t - tSch) * 5)).toFixed(2) + 'deg)';
    return pop(t, tSch, .2) * .35; };
  return s; })(S[4]);

// ================= S6 · it runs in the cloud: photoreal nightstand (AI image) with depth parallax =================
A[5] = (function (P) { var s = {}, L = 7;
  s.dim = D('left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,rgba(15,21,48,.55),rgba(15,21,48,.05) 40%,rgba(15,21,48,.15) 70%,rgba(15,21,48,.7))', '', P);
  eyebrow(P, '// RUNS IN THE CLOUD', '#ffd3c7'); head(P, 'Your laptop<br><i>can sleep.</i>');
  s.badge = D('left:150px;top:520px;width:420px;padding:20px 24px;border-radius:18px;background:rgba(255,250,241,.95);box-shadow:0 18px 36px rgba(0,0,0,.35);display:flex;gap:18px;align-items:center', '<svg width="92" height="92" viewBox="0 0 92 92"><circle cx="46" cy="46" r="38" fill="none" stroke="#e6ddcd" stroke-width="9"/><circle class="rg" cx="46" cy="46" r="38" fill="none" stroke="' + LEAF + '" stroke-width="9" stroke-linecap="round" stroke-dasharray="239" stroke-dashoffset="239" transform="rotate(-90 46 46)"/><g transform="translate(26 26)">' + ic('cloud', 40, SKY, 2.2) + '</g></svg><div><div style="font:700 17px RM;letter-spacing:.14em;color:#8b8172">RUNNING REMOTELY</div><div style="font:800 40px NR;letter-spacing:-.02em">7:00 AM</div><div style="font:500 20px IN;color:#4a4a52">Morning brief · weekdays</div></div>', P);
  s.rg = s.badge.querySelector('.rg');
  s.fact = D('left:150px;top:690px;width:620px;background:rgba(16,20,44,.78);color:#fff1e6;white-space:normal;line-height:1.4;border-radius:14px;padding:12px 16px', 'Runs on schedule even when your computer is asleep or the app is closed.', P, 'chip');
  s.tag = D('left:150px;top:1250px;background:rgba(16,20,44,.7);color:#c8c3e0', 'AI-GENERATED IMAGE', P, 'illus');
  var t0 = VS[5], tC = W(L, 'cloud'), tS = W(L, 'sleep');
  s.u = function (t) { settle(s.badge, t, t0 + .1, { y: 30 }); s.rg.setAttribute('stroke-dashoffset', (239 * (1 - sm((t - t0 - .2) / (VS[6] - t0 - .5)))).toFixed(1)); s.badge.style.transform += ' scale(' + (1 + .04 * pop(t, tC, .35)) + ')';
    settle(s.fact, t, tS - .1, { y: 16 }); s.tag.style.opacity = 1; return 0; };
  return s; })(S[5]);

// ================= S7 · step 4: open it with coffee (real Unsplash latte) + where to find it =================
A[6] = (function (P) { var s = {}, L = 8;
  s.ph = D('left:0;top:0;width:1080px;height:1000px;background:url(photos/latte.jpg) center/cover;-webkit-mask:linear-gradient(180deg,#000 70%,transparent 100%)', '', P);
  s.sun = D('left:0;top:0;width:1080px;height:1920px;background:radial-gradient(700px 500px at 85% 10%,rgba(255,230,190,.55),transparent 70%)', '', P);
  s.ul = D('left:760px;top:262px;background:rgba(255,250,241,.85);color:#6c6457', 'PHOTO · UNSPLASH', P, 'illus');
  s.eb = D('color:' + CORAL + ';top:282px;background:rgba(255,250,241,.88);padding:6px 12px;border-radius:6px', '// STEP 4 · YOUR 7 A.M. EDITION', P, 'eb');
  s.hd = D('top:330px;color:' + INK + ';width:600px;text-shadow:0 2px 14px rgba(255,250,241,.9)', 'Open it with <i style="color:' + CORAL + '">coffee.</i>', P, 'hd');
  s.ed = D('left:150px;top:560px;width:768px;padding:22px 28px 20px;border-radius:4px', '<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:4px double #1d1d24;padding-bottom:8px"><span style="font:800 46px NR;letter-spacing:-.025em">The 7 a.m. Edition</span><span class="mono" style="font-size:16px;color:#8b8172">MON · ILLUSTRATIVE</span></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-top:14px"><div class="col"><h4>MEETINGS</h4><p><b>9:30</b> Design review</p><p><b>12:00</b> 1:1 with manager</p><p><b>4:00</b> Client call</p></div><div class="col"><h4>NEEDS A REPLY</h4><p><b>Invoice</b> question from accounting</p><p><b>Contract</b> edits due Wed</p></div><div class="col"><h4>YOU PROMISED</h4><p>Send the Q3 deck to the team <b>by Friday</b></p></div></div>', P, 'paper');
  s.find = D('left:150px;top:1010px;width:768px;padding:18px 26px', '<div class="lab">FIND IT · EVERY WEEKDAY</div><div style="display:flex;align-items:center;gap:10px;margin-top:10px;font:700 31px IN;color:#1d1d24;white-space:nowrap">Scheduled ' + ic('chevron-right', 34, CORAL, 3) + ' Morning brief ' + ic('chevron-right', 34, CORAL, 3) + ' <span style="color:' + CORAL + '">latest run</span></div><div class="ses" style="display:flex;gap:10px;margin-top:14px"></div>', P, 'do');
  s.ses = s.find.querySelector('.ses');
  var t0 = VS[6], tCo = W(L, 'coffee'), tEv = W(L, 'every'), tSe = W(L, 'session');
  s.u = function (t) { var g = sm((t - t0) / (VS[7] - t0)); s.ph.style.transform = 'scale(' + lerp(1.1, 1.02, g).toFixed(4) + ') rotate(' + lerp(-2, 1, g).toFixed(2) + 'deg)';
    settle(s.ed, t, t0 + .1, { y: 50, r: -1, r0: 3 }); settle(s.find, t, t0 + .5, { y: 30 }); settle(s.hd, t, t0 + .05, { y: 16 }); s.ed.style.transform += ' scale(' + (1 + .03 * pop(t, tCo, .4)) + ')';
    var days = ['MON 7:00 ✓', 'TUE 7:00', 'WED 7:00'], n = 1 + (t > tEv ? 1 : 0) + (t > tEv + .45 ? 1 : 0);
    s.ses.innerHTML = days.slice(0, n).map(function (d, i) { return '<span class="mono" style="font-size:18px;padding:6px 12px;border-radius:999px;background:' + (i === 0 ? LEAF : '#e9e1d3') + ';color:' + (i === 0 ? '#fff' : '#8b8172') + '">' + d + '</span>'; }).join('') + (t > tSe - .1 ? '<span class="mono" style="font-size:18px;color:#8b8172;padding:6px 0">each run = its own session</span>' : '');
    return 0; };
  return s; })(S[6]);

// ================= S8 · the clever part: draft the replies; sending waits for your OK =================
A[7] = (function (P) { var s = {}, L = 9;
  eyebrow(P, '// REPLIES ALREADY WRITTEN', CORAL); head(P, 'Drafts, <i>not sends.</i>', INK);
  s.add = D('left:150px;top:430px;width:768px', '<div class="lab">ADD THIS LINE TO YOUR BRIEF</div><div class="tx mono" style="margin-top:12px;font-size:34px;line-height:1.32;color:#1d1d24;min-height:90px"></div>', P, 'do');
  s.tx = s.add.querySelector('.tx');
  s.d = [['Re: Invoice question', 'Thanks! The invoice was sent on the 3rd…'], ['Re: Contract edits', 'Looks good. One change on clause 4…']].map(function (x, i) { return D('left:150px;top:' + (690 + i * 150) + 'px;width:480px;padding:16px 20px;border-radius:12px', '<div style="display:flex;align-items:center;gap:10px;font:700 16px RM;letter-spacing:.14em;color:#8b8172">' + ic('mail', 22, SKY) + 'DRAFT</div><div style="font:700 26px IN;margin-top:6px">' + x[0] + '</div><div style="font:500 20px IN;color:#6c6457;margin-top:4px">' + x[1] + '</div>', P, 'paper'); });
  s.cnt = D('left:150px;top:1000px;background:rgba(255,250,241,.9);color:#1d1d24;box-shadow:0 8px 16px rgba(0,0,0,.18)', '', P, 'chip');
  s.send = D('left:150px;top:1090px;width:480px;height:110px;border-radius:14px;background:#d9d2c6;display:flex;align-items:center;gap:16px;padding:0 22px;font:700 30px IN;color:#6c6457;box-shadow:0 10px 20px rgba(0,0,0,.2)', '<span class="lk">' + ic('lock', 40, INK, 2.2) + '</span><span>Send <small style="display:block;font:700 15px RM;letter-spacing:.12em;color:' + CORAL + '">WAITS FOR YOUR OK</small></span>', P);
  s.lk = s.send.querySelector('.lk');
  s.hum = OV(D('left:640px;top:780px;width:300px;height:380px', window.HUM.replace('<svg', '<svg width="300" height="380"'), P));
  var t0 = VS[7], tDr = W(L, 'draft'), tRe = W(L, 'replies'), tOk = W(L, 'okay');
  var line = '+ Draft replies for anything that needs me. Don\'t send.';
  s.u = function (t) { settle(s.add, t, t0 + .05, { y: 30 });
    var ty = typedAt(line, t, [[t0 + .2, 0], [tDr, 8], [tRe + .4, line.length]]); s.tx.innerHTML = esc(ty) + cursor(ty.length < line.length || Math.floor(t * 2.2) % 2 === 0, CORAL, 34);
    s.d.forEach(function (e, i) { drop(e, t, tDr + .15 + i * .3, { y: -50, r: [-1, .8][i], r0: [-4, 3][i] }); });
    var n = (t > tDr + .3 ? 1 : 0) + (t > tDr + .6 ? 1 : 0); s.cnt.innerHTML = ic('mail', 20, SKY) + ' GMAIL · DRAFTS <b style="color:' + CORAL + '">' + n + '</b>'; settle(s.cnt, t, t0 + .4, { y: 0 });
    settle(s.send, t, t0 + .6, { y: 20 }); s.lk.style.transform = 'scale(' + (1 + .3 * pop(t, tOk, .35)) + ') rotate(' + (12 * pop(t, tOk, .35)) + 'deg)'; s.send.style.boxShadow = t > tOk ? '0 0 0 4px ' + CORAL + ',0 10px 20px rgba(0,0,0,.2)' : '0 10px 20px rgba(0,0,0,.2)';
    settle(s.hum, t, t0 + .25, { x: 40, y: 0 }); s.hum.style.transform += ' translateY(' + (Math.sin(t * 3) * 3).toFixed(1) + 'px)';
    return pop(t, tOk, .2) * .3; };
  return s; })(S[7]);

// ================= S9 · the catch: four torn calendar pages pinned to a cork board =================
A[8] = (function (P) { var s = {}, L = 10;
  eyebrow(P, '// BEFORE YOU SET IT UP', '#ffe1cf'); s.h = head(P, 'The <i>catch.</i>', '#fffaf5', 300); P.querySelector('.eb').style.top = '240px';
  s.cork = D('', '', P, 'cork');
  var pages = [['Paid plans', 'Scheduling: Pro · Max · Team · Enterprise', 'paid'], ['One Google account', 'Only the account you connect', 'account'], ['Attachments', 'It sees the file name, not what’s inside', 'attachments'], ['Work accounts', 'An admin has to switch it on first', 'admin']];
  s.p = pages.map(function (x, i) { return D('left:' + (150 + (i % 2) * 400) + 'px;top:' + (450 + Math.floor(i / 2) * 400) + 'px', '<span class="pin"></span><b>' + x[0] + '</b><span>' + x[1] + '</span>', P, 'pg'); });
  var t0 = VS[8], T = pages.map(function (x) { return W(L, x[2]); });
  s.u = function (t) { settle(s.cork, t, t0 + .05, { y: 30, s: .02 });
    s.p.forEach(function (e, i) { drop(e, t, T[i] - .15, { y: -70, r: [-2.5, 1.8, 2.2, -1.6][i], r0: [-8, 7, 6, -7][i] }); });
    return pop(t, T[0] - .05, .15) * .25 + pop(t, T[1] - .05, .15) * .25 + pop(t, T[2] - .05, .15) * .25 + pop(t, T[3] - .05, .15) * .25; };
  return s; })(S[8]);

// ================= S10 · recap front page (save-worthy) + CTA =================
A[9] = (function (P) { var s = {}, L = 11;
  var steps = [['Connect', 'Customize → Connectors → Gmail + Google Calendar'], ['Brief', 'Meetings · emails that need me · promises. 3 sections, 5 lines.'], ['Schedule', '“Every weekday at 7 a.m., run my morning brief.” → Schedule'], ['Read', 'Scheduled → Morning brief → latest run']];
  s.pg = D('left:150px;top:160px;width:768px;padding:24px 30px 22px;border-radius:4px', '<div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:4px double #1d1d24;padding-bottom:8px"><span style="font:800 54px NR;letter-spacing:-.025em">The 7 a.m. Edition</span><span class="mono" style="font-size:16px;color:' + CORAL + '">SAVE THIS PAGE</span></div><div style="font:600 italic 32px NR;margin-top:10px;color:#4a4a52">Set it up tonight, in four steps.</div>' + steps.map(function (r, i) { return '<div class="rw" style="display:flex;gap:16px;align-items:flex-start;margin-top:18px"><span style="flex:none;width:52px;height:52px;border-radius:50%;background:' + INK + ';color:' + PAPER + ';font:800 28px/52px NR;text-align:center">' + (i + 1) + '</span><div><div style="font:700 18px RM;letter-spacing:.14em;color:' + CORAL + '">' + r[0].toUpperCase() + '</div><div style="font:700 28px/1.3 IN">' + esc(r[1]) + '</div></div></div>'; }).join('') + '<div style="margin-top:20px;border-top:2px solid #e6ddcd;padding-top:12px;font:700 17px RM;letter-spacing:.1em;color:#8b8172">SCHEDULING NEEDS A PAID PLAN · SENDING WAITS FOR YOUR OK</div>', P, 'paper');
  s.rows = s.pg.querySelectorAll('.rw');
  s.ring = D('left:150px;top:1040px;width:220px;height:220px;border-radius:50%;background:url(profile.jpg) center/cover;border:8px solid ' + PAPER + ';box-shadow:0 0 0 6px ' + CORAL + ',0 18px 40px rgba(0,0,0,.35)', '', P);
  s.hd = D('left:400px;top:1050px;font:800 46px/1 NR;letter-spacing:-.02em;color:' + INK + ';white-space:nowrap', '@sandesh.explains', P);
  s.sv = D('left:400px;top:1120px;background:' + INK, ic('check', 28, '#fff', 3) + ' SAVE', P, 'btn');
  s.fo = D('left:600px;top:1120px;background:' + CORAL, 'FOLLOW', P, 'btn');
  s.mr = D('left:400px;top:1222px;font:700 18px RM;letter-spacing:.14em;color:#6c6457', 'FOR MORE AI HOW-TOS', P);
  var t0 = VS[9], tSv = W(L, 'save'), tFo = W(L, 'follow');
  s.u = function (t) { settle(s.pg, t, t0 + .05, { y: 40, r: -.5, r0: 2 }); Array.prototype.forEach.call(s.rows, function (r, i) { settle(r, t, t0 + .35 + i * .16, { x: -20, y: 0, s: 0 }); });
    settle(s.ring, t, t0 + .3, { y: 0, s: .15 }); settle(s.hd, t, t0 + .45, { x: 30, y: 0, s: 0 });
    settle(s.sv, t, t0 + .55, { x: 30, y: 0, s: 0 }); s.sv.style.transform += ' scale(' + (1 + .16 * pop(t, tSv, .45) + (t > tSv ? .02 * Math.sin(t * 5) : 0)) + ')';
    settle(s.fo, t, t0 + .65, { x: 30, y: 0, s: 0 }); s.fo.style.transform += ' scale(' + (1 + .16 * pop(t, tFo, .45) + (t > tFo ? .03 * Math.sin(t * 6) : 0)) + ')';
    settle(s.mr, t, t0 + .8, { y: 0 }); return 0; };
  return s; })(S[9]);

// ---------- masthead per scene: [current step (0 = hidden), visible] ----------
var MS = [0, 0, 1, 2, 3, 3, 4, 5, 0, 0], tSetup = W(2, 'setup');
// ---------- captions ----------
var cap = D('', '', st); cap.id = 'cap';
function drawCap(t) { var last = 0; for (var i = 0; i < WD.length; i++) if (t >= WD[i].s - .02) last = i; var pi = 0; for (var j = 0; j < PG.length; j++) if (PG[j].indexOf(last) >= 0) pi = j;
  var out = PG[pi].map(function (wi) { return '<span class="' + (wi === last ? 'cur' : (wi < last ? 'w' : '')) + '">' + esc(WD[wi].w) + '</span>'; }).join(' ');
  if (cap.__h !== out) { cap.__h = out; cap.innerHTML = out; } }
// ---------- overlays (real footage) + WebGL photo + the sunrise-wipe band ----------
function vseek(v, tt) { return new Promise(function (res) { if (!v.duration) { res(); return; } if (Math.abs(v.currentTime - tt) < 1e-4 && v.readyState >= 2) { res(); return; } var done = false; function fin() { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); } v.addEventListener('seeked', fin); v.currentTime = tt; setTimeout(fin, 4000); }); }
var OVL = {}; function ovl(id, src, blend, op) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.className = 'vid'; v.style.mixBlendMode = blend; v.style.opacity = op; st.appendChild(v); OVL[id] = { v: v }; }
ovl('leak', 'light-leak-dust.webm', 'screen', .55); ovl('dust', 'dust-particles.webm', 'screen', .4);
function ovAt(id, on, t, fps, op) { var o = OVL[id]; o.v.style.display = on ? 'block' : 'none'; if (op != null) o.v.style.opacity = op; if (!on || !o.v.duration) return Promise.resolve(); var d = o.v.duration, tt = (t % d), f = Math.floor(tt * fps); return vseek(o.v, Math.min(d - .01, (f + .5) / fps)); }
var band = D('', '', st, 'band'), glc = document.getElementById('gl');
var WT = .42;
var ready = Promise.all([window.GLP.load(['nightstand']), Promise.all(['leak', 'dust'].map(function (k) { return new Promise(function (r) { OVL[k].v.addEventListener('loadeddata', r); setTimeout(r, 6000); }); })),
  Promise.all(['3d/bed_night.png', '3d/bed_bluehour.png', '3d/bed_sunrise.png', '3d/clock.png', 'photos/latte.jpg', 'profile.jpg'].map(function (u) { return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = u; }); })), document.fonts.ready]).then(function () { window.__ready = true; return window.__seek(0); });
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var si = 0; for (var i = 0; i < VS.length; i++) if (t >= VS[i]) si = i;
  // sunrise wipe: during [VS[k] - WT/2, VS[k] + WT/2] the incoming scene k is revealed from the bottom up
  var inI = -1, outI = -1, u = 0;
  for (var k = 1; k < VS.length; k++) if (t >= VS[k] - WT / 2 && t < VS[k] + WT / 2) { inI = k; outI = k - 1; u = sm((t - (VS[k] - WT / 2)) / WT); }
  scenes.forEach(function (s, i) { var show = inI >= 0 ? (i === inI || i === outI) : i === si; s.style.display = show ? 'block' : 'none'; s.style.clipPath = ''; s.style.zIndex = 1; });
  if (inI >= 0) { var y = (1 - u) * 100; scenes[inI].style.clipPath = 'inset(' + y.toFixed(2) + '% 0 0 0)'; scenes[inI].style.zIndex = 2; band.style.display = 'block'; band.style.top = ((1 - u) * 1920 - 130).toFixed(1) + 'px'; band.style.opacity = Math.sin(Math.PI * u).toFixed(3); }
  else band.style.display = 'none';
  var jolt = 0; [outI, inI, si].forEach(function (k, j, arr) { if (k < 0 || arr.indexOf(k) !== j) return; var r = A[k].u(t) || 0; if (k === si) jolt = r; });
  st.style.transform = jolt ? 'translate(' + (Math.sin(t * 90) * 5 * jolt).toFixed(1) + 'px,' + (Math.cos(t * 77) * 4 * jolt).toFixed(1) + 'px)' : '';
  // wall clock -> sky + masthead time
  var m = clockMin(t); skyEl.style.background = skyAt(m); mT.textContent = hhmm(m);
  var ms = MS[si]; var vis = ms > 0 || (si === 1 && t > tSetup); mast.style.display = vis ? 'flex' : 'none';
  if (si === 1) { var dv = eb((t - tSetup) / .45); mast.style.transform = 'translateY(' + (-60 * (1 - dv)).toFixed(1) + 'px)'; mast.style.opacity = clamp((t - tSetup) / .12, 0, 1); mastSet(0); }
  else { mast.style.transform = ''; mast.style.opacity = 1; mastSet(ms); }
  if (inI >= 0 && MS[inI] > 0 && !vis) { mast.style.display = 'flex'; mastSet(MS[inI]); mast.style.clipPath = 'inset(' + ((1 - u) * 100).toFixed(1) + '% 0 0 0)'; } else if (inI >= 0 && MS[inI] === 0 && vis) { mast.style.clipPath = 'inset(0 0 ' + (u * 100).toFixed(1) + '% 0)'; } else mast.style.clipPath = '';
  // WebGL nightstand photo for scene 6 (clipped with its scene during the wipe)
  var gs = 5, glOn = si === gs || inI === gs || outI === gs; glc.style.display = glOn ? 'block' : 'none';
  if (glOn) { glc.style.clipPath = inI === gs ? scenes[gs].style.clipPath : ''; glc.style.zIndex = 0; var uu = clamp((t - VS[gs]) / (VS[gs + 1] - VS[gs]), 0, 1); window.GLP.draw({ a: 'nightstand', camA: [lerp(.2, -.2, uu), .02, lerp(1.05, 1.16, uu)], par: .07, dim: .78, t: t }); }
  skyEl.style.display = glOn && si === gs && inI < 0 ? 'none' : 'block';
  drawCap(t);
  var leakOn = (t > SC[1] - .1 && t < VS[1] + .2) || si === 6 || si === 9, leakOp = si === 0 ? .7 * pop(t, SC[1] - .1, 1.2) + .1 : .45;
  return Promise.all([ovAt('leak', leakOn, t, 25, leakOp), ovAt('dust', si === 5 && inI < 0, t, 25, .4)]);
};
})();
