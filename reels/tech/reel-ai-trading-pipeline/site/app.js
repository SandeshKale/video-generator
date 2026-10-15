// "A bot that can't panic." — Patch Bay. Every layer is a pure function of t; word times come from the avatar clips (timing.js).
// One signal cable runs through the reel: each scene's cable leaves the right edge at the height where the next scene's cable
// enters from the left, and every cut is a camera push along it (both scenes on screen for 0.28 s), so the cable never breaks.
// window.EV lists every on-screen event for the score/SFX.
(function () {
'use strict';
var SC = window.SC, WD = window.WD, PG = window.PG, DUR = window.TOTAL; window.__reelDurationSec = DUR;
var BLUE = '#2f7bff', AMB = '#ff8a00', RED = '#ff3b3b', GRN = '#22c55e', LIME = '#7ee02a', OFFW = '#eef1f4', ALU = '#c9ced4', DIM = '#8a929a', GRY = '#5d646c';
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
function ic(n, sz, col, sw) { return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="' + (col || 'currentColor') + '" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" style="flex:none;display:inline-block;vertical-align:middle">' + window.IC[n] + '</svg>'; }
function logo(n, w, h, col) { return '<span class="lg" style="display:inline-block;vertical-align:middle;width:' + w + 'px;height:' + h + 'px;color:' + (col || OFFW) + '">' + window.LOGO[n] + '</span>'; }
// panel entrance: a quick slide-and-settle, like a module seated into a rack (no bounce)
function seat(el, t, at, o) { o = o || {}; var u = ec((t - at) / (o.d || .3)); el.style.opacity = t < at ? 0 : clamp((t - at) / .08, 0, 1); el.style.transform = 'translate(' + ((o.x || 0) * (1 - u)) + 'px,' + ((o.y == null ? 24 : o.y) * (1 - u)) + 'px) rotate(' + (o.r || 0) + 'deg) scale(' + (1 + (o.s == null ? .04 : o.s) * (1 - u)) + ')'; }
function pop(t, at, d) { var x = t - at; return x < 0 || x > (d || .3) ? 0 : 1 - x / (d || .3); }
function typed(s, t, at, cps) { return s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - at) * (cps || 18))))); }
var EV = []; function E(k, t, o) { var e = { k: k, t: +t.toFixed(3) }; for (var q in (o || {})) e[q] = o[q]; EV.push(e); }
// ---------- deterministic market series + candle chart ----------
function rnd(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function series(n, seed, vol, drift) { var r = rnd(seed), p = 100, out = []; for (var i = 0; i < n; i++) { var op = p, cl = p + (r() - .5 + (drift || 0)) * (vol || 4), hi = Math.max(op, cl) + r() * 1.6, lo = Math.min(op, cl) - r() * 1.6; out.push([op, hi, lo, cl]); p = cl; } return out; }
function emaOf(b, k) { var e = b[0][3], o = []; b.forEach(function (x) { e += (x[3] - e) * k; o.push(e); }); return o; }
// draw bars[0..show) (show may be fractional: the last bar grows), optional EMA lines and cross marks
function candles(w, h, bars, show, o) { o = o || {}; var n = bars.length, mx = -1e9, mn = 1e9; bars.forEach(function (b) { mx = Math.max(mx, b[1]); mn = Math.min(mn, b[2]); });
  var Y = function (v) { return h - 8 - (v - mn) / (mx - mn) * (h - 16); }, bw = w / n, s = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">';
  if (o.grid) for (var g = 1; g < 4; g++) s += '<line x1="0" x2="' + w + '" y1="' + (h * g / 4) + '" y2="' + (h * g / 4) + '" stroke="#2c3137" stroke-width="1"/>';
  var k = Math.min(n, Math.ceil(show));
  for (var i = 0; i < k; i++) { var b = bars[i], gr = i === k - 1 ? clamp(show - i, 0, 1) : 1, cl = lerp(b[0], b[3], gr), up = cl >= b[0], c = up ? GRN : RED, x = i * bw + bw / 2;
    s += '<line x1="' + x + '" y1="' + Y(lerp(Math.max(b[0], cl), b[1], gr)) + '" x2="' + x + '" y2="' + Y(lerp(Math.min(b[0], cl), b[2], gr)) + '" stroke="' + c + '" stroke-width="2"/><rect x="' + (x - bw * .32) + '" y="' + Math.min(Y(b[0]), Y(cl)) + '" width="' + bw * .64 + '" height="' + Math.max(2, Math.abs(Y(b[0]) - Y(cl))) + '" fill="' + c + '"/>'; }
  (o.lines || []).forEach(function (L) { var pts = []; for (var j = 0; j < k; j++) pts.push((j * bw + bw / 2).toFixed(1) + ',' + Y(L.v[j]).toFixed(1)); if (pts.length > 1) s += '<polyline fill="none" stroke="' + L.c + '" stroke-width="' + (L.w || 3) + '" points="' + pts.join(' ') + '"/>'; });
  (o.marks || []).forEach(function (m) { if (m[0] >= k) return; var x = m[0] * bw + bw / 2, b = bars[m[0]], buy = m[1] === 'B', y = buy ? Y(b[2]) + 10 : Y(b[1]) - 10;
    s += '<path d="M' + (x - 11) + ' ' + (buy ? y + 18 : y - 18) + ' L' + x + ' ' + y + ' L' + (x + 11) + ' ' + (buy ? y + 18 : y - 18) + ' Z" fill="' + (buy ? GRN : RED) + '"/><text x="' + x + '" y="' + (buy ? y + 40 : y - 26) + '" text-anchor="middle" font-family="MM" font-weight="600" font-size="15" fill="' + OFFW + '">' + (buy ? 'BUY' : 'SELL') + '</text>'; });
  return s + '</svg>'; }
// ---------- scenes ----------
var scenes = [], ebs = [], CAB = [];
function scene() { var s = D('', null, st, 'sc'); scenes.push(s); return s; }
function eb(par, txt) { var e = D('', txt, par, 'eb'); ebs.push(e); return e; }
function trk(par, n) { var d = D('', '', par, 'trk'); for (var i = 1; i <= 4; i++) { var x = document.createElement('i'); x.textContent = i; if (i <= n) { x.className = 'on'; x.style.color = [BLUE, AMB, RED, LIME][i - 1]; } d.appendChild(x); } return d; }
function tag(par, txt, css) { return D(css || 'left:150px;top:1236px', txt, par, 'tag'); }
function hl(par, top, html, fs) { return D('top:' + top + 'px;font-size:' + (fs || 86) + 'px', html, par, 'h'); }
// the cable: enters at the left edge at yin, dives behind the scene's centre piece at ymid, leaves the right edge at yout
var YC = [0, 1150, 1190, 1150, 1210, 1150, 1180, 1160, 1200, 1170, 1190, 1170, 1180, 1180];
var CCOL = [BLUE, BLUE, BLUE, BLUE, BLUE, AMB, AMB, RED, RED, LIME, LIME, GRY, LIME];
var YMID = [0, 820, 900, 520, 720, 520, 700, 600, 900, 560, 740, 700, 600];
function cable(P, i) { var yi = YC[i], yo = YC[i + 1], ym = YMID[i], c = CCOL[i];
  var d = i === 0 ? 'M1100 112 C 1000 240 1010 470 890 588' : 'M-30 ' + yi + ' C 120 ' + yi + ' 110 ' + ym + ' 300 ' + ym + ' L 780 ' + ym + ' C 970 ' + ym + ' 960 ' + yo + ' 1110 ' + yo;
  var g = D('left:0;top:0;width:1080px;height:1920px;pointer-events:none', '<svg width="1080" height="1920"><path class="cb" d="' + d + '" fill="none" stroke="#0b0d0f" stroke-width="18" stroke-linecap="round" opacity=".7"/><path class="cc" d="' + d + '" fill="none" stroke="' + c + '" stroke-width="10" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ' + c + ')"/><circle class="pu" r="13" fill="#fff" style="filter:drop-shadow(0 0 14px ' + c + ') drop-shadow(0 0 6px ' + c + ')"/><circle class="pu2" r="7" fill="' + c + '"/></svg>', P);
  P.insertBefore(g, P.firstChild); var o = { g: g, p: g.querySelector('.cc'), b: g.querySelector('.cb'), pu: g.querySelector('.pu'), pu2: g.querySelector('.pu2') }; o.L = o.p.getTotalLength(); CAB[i] = o; return o; }
function cableAt(i, t) { var o = CAB[i], s0 = SC[i], s1 = i < SC.length - 1 ? SC[i + 1] : DUR, f = clamp((t - s0) / (s1 - s0), 0, 1);
  if (i === 0) { var a = Math.min(1, ec(t / 0.9)); o.p.style.strokeDasharray = o.L; o.p.style.strokeDashoffset = o.L * (1 - a); o.b.style.strokeDasharray = o.L; o.b.style.strokeDashoffset = o.L * (1 - a); f = clamp((t % 0.9) / 0.9, 0, 1) * a; }
  var p = o.p.getPointAtLength(o.L * f), q = o.p.getPointAtLength(o.L * ((f + .5) % 1)); o.pu.setAttribute('cx', p.x); o.pu.setAttribute('cy', p.y); o.pu2.setAttribute('cx', q.x); o.pu2.setAttribute('cy', q.y); }
var S = []; for (var i = 0; i < 13; i++) { S.push(scene()); cable(S[i], i); }
var A = [];
var RACK = ['3d/rack_0.png', '3d/rack_1.png', '3d/rack_2.png', '3d/rack_3.png', '3d/rack_4.png'];
function rackEl(P, css) { var r = D(css, '<div class="r0" style="position:absolute;inset:0;background:center/contain no-repeat"></div><div class="r1" style="position:absolute;inset:0;background:center/contain no-repeat"></div>', P); r.a = r.querySelector('.r0'); r.b = r.querySelector('.r1'); return r; }
function rackState(r, from, to, u) { r.a.style.backgroundImage = 'url(' + RACK[from] + ')'; r.b.style.backgroundImage = 'url(' + RACK[to] + ')'; r.b.style.opacity = u; }

// ================= S1 · hook: TradingView plugs straight into Claude =================
var MKT = series(46, 7, 4.2, .02);
A[0] = (function (P) { var s = {};
  s.cd = D('left:110px;top:600px;width:860px;height:420px;opacity:.42', '', P);
  s.jk = D('left:862px;top:560px;z-index:7', '', P, 'jack');
  s.jl = D('left:752px;top:636px;z-index:7;font:700 18px/1 CP;letter-spacing:.12em;color:' + OFFW + ';background:#0d0f11;border:2px solid ' + BLUE + ';padding:7px 10px;border-radius:4px', 'CLAUDE', P);
  s.sp = D('left:840px;top:538px;width:100px;height:100px;border-radius:50%;z-index:7;background:radial-gradient(circle,#fff 0,' + BLUE + ' 30%,transparent 70%);pointer-events:none', '', P);
  s.ch = D('left:150px;top:1004px;color:' + BLUE, 'TRADINGVIEW MCP · OFFICIAL · PUBLIC BETA', P, 'chip');
  s.tt = D('left:150px;top:1064px;font:700 56px/1 CP;text-transform:uppercase;white-space:nowrap;text-shadow:0 6px 20px rgba(0,0,0,.6)', 'TradingView <span style="color:' + BLUE + '">→</span> Claude ' + logo('anthropic', 46, 46, OFFW), P);
  s.mini = D('left:150px;top:1150px;width:768px;height:84px', '', P);
  var tp = wtp(1, 'plugged'), tc = wtp(1, 'claude');
  E('whip', 0.02); E('jack', tp + .05); E('spark', tp + .08); 
  s.u = function (t) { s.cd.innerHTML = candles(860, 420, MKT, 14 + t * 9, {}); s.mini.innerHTML = candles(768, 84, MKT.slice(10), 6 + t * 10, {});
    var on = t >= tp + .05; s.jk.style.boxShadow = '0 0 0 4px #1b1e22' + (on ? ',0 0 24px 6px ' + BLUE : ''); s.sp.style.opacity = pop(t, tp + .05, .35); s.sp.style.transform = 'scale(' + (.5 + pop(t, tp + .05, .35)) + ')';
    seat(s.jl, t, tp + .1, { y: 0, x: 20 }); s.ch.style.opacity = 1; s.tt.style.opacity = 1; s.tt.style.transform = 'scale(' + (1 + .06 * pop(t, tp + .05, .3)) + ')'; return pop(t, tp + .05, .2) * .5; };
  return s; })(S[0]);

// ================= S2 · "So I asked Claude to build me a trading pipeline. Not a get-rich bot." =================
A[1] = (function (P) { var s = {}; eb(P, '// BUILT BY CLAUDE, RUN BY RULES');
  s.l1 = hl(P, 236, 'BUILD ME A'); s.l2 = hl(P, 322, '<span class="k">PIPELINE.</span>');
  s.chat = D('left:150px;top:432px;width:768px;height:132px;padding:18px 22px', '<div class="lab" style="display:flex;align-items:center;gap:10px">YOU <span style="color:' + DIM + '">→</span> ' + logo('anthropic', 18, 18, ALU) + ' CLAUDE</div><div class="tx" style="margin-top:14px;font:600 30px/1.3 MM;color:' + OFFW + ';white-space:nowrap"></div>', P, 'card');
  s.rk = rackEl(P, 'left:150px;top:590px;width:560px;height:459px');
  s.st = D('left:540px;top:640px;transform-origin:50% 50%;background:' + AMB + ';color:#141619;font:700 30px/1.05 CP;padding:14px 16px;border-radius:6px;box-shadow:0 10px 24px rgba(0,0,0,.5);text-align:center;white-space:nowrap', '🚀 GET-RICH BOT<br><span style="font:600 16px/1 MM">1000% RETURNS!!</span>', P);
  s.stp = D('left:560px;top:790px;transform-origin:50% 50%', 'NOPE.', P, 'stamp');
  s.tg = tag(P, 'ILLUSTRATIVE PROMPT · 4 EMPTY SLOTS', 'left:150px;top:1070px');
  var ta = wtp(1, 'asked'), tpl = wtp(1, 'pipeline'), tn = wtp(1, 'not');
  E('type', ta + .1, { n: 14 }); E('pop', tpl); E('slap', SC[1] + .9); E('stamp', tn);
  s.u = function (t) { seat(s.l1, t, SC[1] + .05); seat(s.l2, t, tpl, { s: .2, y: 0 }); seat(s.chat, t, SC[1] + .1);
    s.chat.querySelector('.tx').innerHTML = esc(typed('Build me a trading pipeline.', t, ta + .1, 16)) + '<span style="color:' + LIME + '">▌</span>';
    seat(s.rk, t, SC[1] + .25, { y: 40 }); rackState(s.rk, 0, 0, 0); seat(s.st, t, SC[1] + .9, { r: -7, s: .5, y: -60, d: .25 }); s.st.style.filter = t >= tn ? 'grayscale(.8) brightness(.6)' : '';
    seat(s.stp, t, tn, { r: -12, s: .6, y: 0, d: .16 }); seat(s.tg, t, SC[1] + .6, { y: 0 }); return pop(t, tn, .2) * .4; };
  return s; })(S[1]);

// ================= S3 · photoreal night desk: "a disciplined one that can't panic. Four blocks." =================
var WILD = series(60, 19, 9, 0);
A[2] = (function (P) { var s = {}; eb(P, '// ONE PIPELINE, FOUR BLOCKS');
  s.l1 = hl(P, 236, 'CAN\'T'); s.l2 = hl(P, 322, '<span class="k" style="background:' + LIME + '">PANIC.</span>');
  s.sc = D('left:150px;top:440px;width:768px;height:300px;padding:0', '<div class="tb"><s></s><s></s><s></s>scope · market vs your rules</div><div class="cv" style="position:absolute;left:16px;top:56px"></div><div style="position:absolute;left:16px;top:184px;width:736px;height:4px;background:' + LIME + ';box-shadow:0 0 14px ' + LIME + '"></div><div class="mono" style="position:absolute;left:18px;top:198px;font-size:16px;color:' + LIME + '">YOUR RULES · FLAT</div><div class="mono" style="position:absolute;right:18px;top:62px;font-size:16px;color:' + RED + '">MARKET · SWINGING</div>', P, 'pane');
  s.cv = s.sc.querySelector('.cv');
  var N = ['BRAIN', 'SIGNAL', 'HANDS', 'SUPERVISOR'], C = [BLUE, AMB, RED, LIME];
  s.mods = N.map(function (n, i) { return D('left:' + (150 + i * 198) + 'px;top:790px;width:174px;height:250px;background:linear-gradient(180deg,#d6dade,#a9b0b7);border-radius:8px;box-shadow:0 16px 30px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.6);color:#141619;text-align:center', '<div style="margin-top:22px;font:700 64px/1 CP">' + (i + 1) + '</div><div style="margin-top:8px;font:700 ' + (n.length > 6 ? 19 : 24) + 'px/1 CP;letter-spacing:.06em">' + n + '</div><div class="ld" style="margin:22px auto 0;width:22px;height:22px;border-radius:50%;background:#3a2a2a"></div><div style="margin:26px auto 0;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle,#050506 0 34%,#b9bec4 36% 58%,#6a7179 60% 100%)"></div>', P); });
  s.tg = tag(P, 'AI IMAGE · NOT A REAL DESK', 'left:150px;top:1080px');
  var tf = wtp(1, 'four'), td = wtp(1, 'disciplined'), tpn = wtp(1, 'panic');
  E('pop', tpn); for (var i = 0; i < 4; i++) E('clack', tf + i * .16);
  s.u = function (t) { seat(s.l1, t, SC[2] + .05); seat(s.l2, t, tpn - .1, { s: .2, y: 0 }); seat(s.sc, t, SC[2] + .15);
    var off = (t - SC[2]) * 9; s.cv.innerHTML = candles(736, 120, WILD.slice(Math.floor(off) % 20, Math.floor(off) % 20 + 36), 36, {});
    s.mods.forEach(function (m, i) { var at = tf + i * .16; seat(m, t, SC[2] + .3 + i * .08, { y: 30 }); m.style.transform += ' translateY(' + (-26 * pop(t, at, .3)).toFixed(1) + 'px)'; m.style.filter = t >= at ? '' : 'brightness(.55)'; var on = t >= at + .1; m.querySelector('.ld').style.background = on ? C[i] : '#3a2a2a'; m.querySelector('.ld').style.boxShadow = on ? '0 0 12px ' + C[i] : 'none'; });
    seat(s.tg, t, SC[2] + .4, { y: 0 }); return 0; };
  return s; })(S[2]);

// ================= S4 · block 1, the brain: one command =================
A[3] = (function (P) { var s = {}; eb(P, '// BLOCK 1 · ONE COMMAND'); trk(P, 1);
  s.l1 = hl(P, 236, 'THE BRAIN.');
  var CMD = [['claude mcp add \\', OFFW], ['  --transport http \\', OFFW], ['  mcp-tradingview \\', OFFW], ['  https://mcp.tradingview.com/mcp', BLUE]];
  s.term = D('left:150px;top:350px;width:768px;height:300px', '<div class="tb"><s></s><s></s><s></s>terminal — claude code</div><div class="tx mono" style="padding:20px 22px;font-size:30px;line-height:1.45;white-space:pre"></div>', P, 'pane');
  s.tx = s.term.querySelector('.tx');
  s.nx = D('left:150px;top:672px;color:' + ALU, 'THEN: /mcp  →  AUTHORIZE IN BROWSER (OAUTH)', P, 'chip');
  s.rk = rackEl(P, 'left:90px;top:716px;width:900px;height:510px');
  s.tg = tag(P, 'SOURCE · tradingview.com/mcp/docs · ESSENTIAL PLAN+', 'left:150px;top:1236px');
  var t0 = SC[3] + .5, tcn = wtp(2, 'connector'), tcd = wtp(2, 'code');
  var full = CMD.map(function (c) { return c[0]; }).join('\n'), cps = full.length / (tcn + .4 - t0);
  for (var k = 0; k < full.length; k += 4) E('type', t0 + k / cps); E('jack', tcn + .5); E('pop', tcd + .1);
  s.u = function (t) { seat(s.l1, t, SC[3] + .05); seat(s.term, t, SC[3] + .1); var n = Math.max(0, Math.floor((t - t0) * cps)), out = '', c = 0;
    CMD.forEach(function (l, i) { if (i && n <= c) return; var piece = l[0].slice(0, Math.max(0, n - c)); c += l[0].length + 1; out += (i ? '\n' : '<span style="color:' + LIME + '">$ </span>') + '<span style="color:' + l[1] + '">' + esc(piece) + '</span>'; });
    s.tx.innerHTML = out + '<span style="color:' + LIME + ';opacity:' + (Math.floor(t * 2.5) % 2 ? 1 : .25) + '">▌</span>';
    seat(s.nx, t, tcd + .1, { x: -20, y: 0 }); seat(s.rk, t, SC[3] + .3, { y: 40 }); rackState(s.rk, 0, 1, seg(t, tcn + .5, tcn + .7)); seat(s.tg, t, SC[3] + .5, { y: 0 }); return pop(t, tcn + .5, .2) * .3; };
  return s; })(S[3]);

// ================= S5 · what the connector can do: 35 tool keys light up; no order tools =================
A[4] = (function (P) { var s = {}; eb(P, '// 35 TOOLS, NO ORDER BUTTON'); trk(P, 1);
  s.l1 = hl(P, 236, 'READS. SCREENS.'); s.l2 = hl(P, 322, '<span class="k" style="background:' + RED + ';color:' + OFFW + '">NEVER TRADES.</span>');
  var TS = window.TILES, sc = 860 / TS.res[0];
  s.wall = D('left:110px;top:420px;width:860px;height:' + Math.round(TS.res[1] * sc) + 'px;background:url(3d/tiles_off.png) center/100% 100% no-repeat', '<div class="on" style="position:absolute;inset:0;background:url(3d/tiles_on.png) center/100% 100% no-repeat"></div>', P);
  s.on = s.wall.querySelector('.on');
  var CH = [['CHARTS', 'reads'], ['SCREENER', 'screeners'], ['NEWS', 'news'], ['ALERTS', 'alerts']];
  s.chips = CH.map(function (c, i) { return D('left:' + (150 + i * 196) + 'px;top:1076px;color:' + (i === 3 ? AMB : BLUE), c[0] + ' ' + ic('check', 18, 'currentColor', 3), P, 'chip'); });
  s.stp = D('left:250px;top:660px;transform-origin:50% 50%;z-index:3', ic('x', 46, RED, 3.4) + ' NO ORDER TOOLS', P, 'stamp');
  s.man = D('left:742px;top:858px;width:176px;height:222px;z-index:3', window.HUM.st6.replace('<svg ', '<svg width="176" height="222" '), P);
  s.bub = D('left:640px;top:880px;z-index:4;background:' + LIME + ';color:#141619;font:700 30px/1 CP;padding:10px 14px;border-radius:8px;box-shadow:0 8px 18px rgba(0,0,0,.5)', 'GOOD.', P);
  s.tg = tag(P, 'SOURCE · tradingview.com/mcp/docs · 25 READ + 10 WRITE TOOLS', 'left:150px;top:1150px');
  // key reveal order: read keys (0..24) sweep in on "reads charts, runs screeners, pulls news", write keys (25..34) on "sets alerts"
  var tr = wtp(2, 'reads'), tal = wtp(2, 'alerts'), tst = wtp(2, 'sets'), tc = wtp(2, 'can\'t'), tg = wtp(2, 'good');
  s.kt = []; for (var i = 0; i < 35; i++) s.kt.push(i < 25 ? tr + (i / 24) * (tal - tr - .2) : tst + (i - 25) * .06);
  s.kt[0] = wtp(2, 'charts'); s.kt[2] = wtp(2, 'screeners'); s.kt[4] = wtp(2, 'news'); s.kt[6] = tal;
  s.kt.forEach(function (x, i) { if (i % 3 === 0 || i === 2 || i === 4 || i === 6) E('blip', x, { g: .5 }); }); E('buzz', tc + .1); E('stamp', tc + .1); E('ding', tg);
  s.u = function (t) { seat(s.l1, t, SC[4] + .05); seat(s.l2, t, tc, { s: .2, y: 0 }); seat(s.wall, t, SC[4] + .1, { y: 40, s: .02 });
    var m = []; s.kt.forEach(function (x, i) { var u = clamp((t - x) / .15, 0, 1); if (u > 0) { var c = TS.c[i]; m.push('radial-gradient(circle at ' + (c[0] / TS.res[0] * 100).toFixed(2) + '% ' + (c[1] / TS.res[1] * 100).toFixed(2) + '%,#000 ' + (5.2 * u).toFixed(2) + '%,transparent ' + (6.4 * u).toFixed(2) + '%)'); } });
    s.on.style.webkitMaskImage = m.length ? m.join(',') : 'linear-gradient(transparent,transparent)'; s.on.style.maskImage = s.on.style.webkitMaskImage;
    s.chips.forEach(function (c, i) { seat(c, t, CH[i][1] === 'reads' ? s.kt[0] : s.kt[[0, 2, 4, 6][i]], { y: 14 }); });
    seat(s.stp, t, tc + .1, { r: -8, s: .6, y: 0, d: .16 }); seat(s.man, t, SC[4] + .5, { x: 30, y: 0 }); seat(s.bub, t, tg, { s: .4, y: 0, r: -4 }); seat(s.tg, t, SC[4] + .6, { y: 0 }); return pop(t, tc + .1, .2) * .4; };
  return s; })(S[4]);

// ================= S6 · block 2, the signal: Pine Script + live chart + backtest =================
var PB = series(40, 5, 3.6, .03), PF = emaOf(PB, 2 / 7), PS = emaOf(PB, 2 / 15), PM = [];
for (var q = 2; q < PB.length; q++) { if (PF[q - 1] <= PS[q - 1] && PF[q] > PS[q]) PM.push([q, 'B']); if (PF[q - 1] >= PS[q - 1] && PF[q] < PS[q]) PM.push([q, 'S']); }
A[5] = (function (P) { var s = {}; eb(P, '// BLOCK 2 · YOUR RULES IN CODE'); trk(P, 2);
  s.l1 = hl(P, 236, 'THE SIGNAL.');
  var CODE = ['//@version=6', 'strategy("EMA cross", overlay=true)', 'fast = ta.ema(close, 9)', 'slow = ta.ema(close, 21)', 'if ta.crossover(fast, slow)', '    strategy.entry("L", strategy.long)', 'if ta.crossunder(fast, slow)', '    strategy.close("L")'];
  s.ed = D('left:150px;top:350px;width:768px;height:330px', '<div class="tb"><s></s><s></s><s></s>pine editor · ema_cross.pine · ILLUSTRATIVE</div><div class="tx mono" style="padding:14px 20px;font-size:21px;line-height:1.5;white-space:pre"></div>', P, 'pane');
  s.tx = s.ed.querySelector('.tx');
  s.ch = D('left:150px;top:700px;width:768px;height:340px', '<div class="tb"><s></s><s></s><s></s>chart · ILLUSTRATIVE DATA · NOT A RECOMMENDATION</div><div class="cv" style="position:absolute;left:12px;top:52px"></div>', P, 'pane');
  s.cv = s.ch.querySelector('.cv');
  s.bt = D('left:150px;top:1060px;width:768px;height:150px;padding:14px 18px', '<div class="lab" style="display:flex;justify-content:space-between"><span>STRATEGY TESTER · BACKTEST</span><span style="color:' + AMB + '">TEST BEFORE YOU TRUST</span></div><svg class="eq" width="732" height="90" style="margin-top:10px"></svg>', P, 'card');
  var ta = SC[5] + .4, tps = wtp(3, 'pine script'), tb = wtp(3, 'backtest'), ttv = wtp(3, 'tradingview');
  var full = CODE.join('\n'), cps = full.length / (tps + .9 - ta);
  for (var k = 0; k < full.length; k += 5) E('type', ta + k / cps, { g: .7 });
  PM.forEach(function (m) { E('blip', tb - .2 + m[0] / PB.length * 1.6 + .05); }); E('pop', tb);
  var eq = []; var r = rnd(3), v = 40; for (var i = 0; i < 60; i++) { v += (r() - .44) * 6; eq.push(v); }
  s.u = function (t) { seat(s.l1, t, SC[5] + .05); seat(s.ed, t, SC[5] + .1); var n = Math.max(0, Math.floor((t - ta) * cps));
    s.tx.innerHTML = esc(full.slice(0, n)).replace(/(\/\/@version=6)/, '<span style="color:' + DIM + '">$1</span>').replace(/(strategy\.entry|strategy\.close|ta\.crossover|ta\.crossunder|ta\.ema)/g, '<span style="color:' + AMB + '">$1</span>') + '<span style="color:' + LIME + ';opacity:' + (Math.floor(t * 2.5) % 2 ? 1 : .25) + '">▌</span>';
    seat(s.ch, t, SC[5] + .25); var shown = 8 + clamp((t - (tb - .2)) / 1.6, 0, 1) * 32; s.cv.innerHTML = candles(744, 280, PB, shown, { grid: 1, lines: [{ v: PF, c: BLUE }, { v: PS, c: AMB }], marks: PM });
    seat(s.bt, t, SC[5] + .4); var eu = clamp((t - tb) / 1.4, 0, 1), mx = Math.max.apply(0, eq), mn = Math.min.apply(0, eq), pts = [];
    for (var j = 0; j < Math.max(2, Math.round(eu * eq.length)); j++) pts.push((j * 732 / 59).toFixed(1) + ',' + (84 - (eq[j] - mn) / (mx - mn) * 78).toFixed(1));
    s.bt.querySelector('.eq').innerHTML = eu > 0 ? '<polyline fill="none" stroke="' + AMB + '" stroke-width="3" points="' + pts.join(' ') + '"/>' : '';
    return 0; };
  return s; })(S[5]);

// ================= S7 · the webhook alert is yours (JSON over a real keyboard photo) =================
A[6] = (function (P) { var s = {}; eb(P, '// BLOCK 2 · THE ALERT IS YOURS'); trk(P, 2);
  s.l1 = hl(P, 236, 'YOU CREATE', 76); s.l2 = hl(P, 316, '<span class="k" style="background:' + AMB + '">THE WEBHOOK.</span>', 76);
  s.ph = D('left:150px;top:430px;width:768px;height:520px;background:url(photos/keys.jpg) 40% 50%/170% auto;box-shadow:0 22px 50px rgba(0,0,0,.6)', '<div style="position:absolute;inset:0;border-radius:12px;background:linear-gradient(180deg,rgba(20,22,25,.25),rgba(20,22,25,.75))"></div>', P, 'ph');
  s.pt = tag(P, 'REAL PHOTO · UNSPLASH', 'left:170px;top:446px');
  var J = [['{', ''], ['  "secret": ', '"•••••"', DIM], ['  "symbol": ', '"{{ticker}}"', AMB], ['  "side": ', '"{{strategy.order.action}}"', AMB], ['  "qty": ', '"{{strategy.order.contracts}}"', AMB], ['}', '']];
  s.js = D('left:196px;top:510px;width:676px;height:300px', '<div class="tb"><s></s><s></s><s></s>alert message · json · ILLUSTRATIVE</div><div class="tx mono" style="padding:16px 22px;font-size:21px;line-height:1.6;white-space:pre"></div>', P, 'pane');
  s.tx = s.js.querySelector('.tx');
  s.lk = D('left:780px;top:840px;width:110px;height:110px;border-radius:50%;background:#0d0f11;border:3px solid ' + LIME + ';display:flex;align-items:center;justify-content:center;z-index:3', '<div class="a">' + ic('lock-open', 56, LIME, 2.2) + '</div><div class="b" style="position:absolute">' + ic('lock', 56, LIME, 2.2) + '</div>', P);
  var CH = [['YOU CREATE IT', LIME, 'yourself'], ['PORTS 80 / 443', BLUE, 'yourself'], ['2FA REQUIRED', LIME, 'two-factor'], ['PAID PLAN', AMB, 'paid']];
  s.chips = CH.map(function (c, i) { return D('left:' + (150 + (i % 2) * 300) + 'px;top:' + (990 + Math.floor(i / 2) * 64) + 'px;color:' + c[1], c[0], P, 'chip'); });
  s.to = D('left:150px;top:1128px;width:768px;font:600 20px/1.4 MM;color:' + ALU, 'TradingView gives your server <span style="color:' + RED + '">3 seconds</span> to answer. The connector can\'t make this alert; you do.', P);
  s.tg = tag(P, 'SOURCE · TRADINGVIEW HELP · "ABOUT WEBHOOKS"', 'left:150px;top:1236px');
  var tw = wtp(3, 'webhook'), ty = wtp(3, 'yourself'), t2 = wtp(3, 'two-factor'), tp = wtp(3, 'paid');
  var full = J.map(function (l) { return l[0] + l[1]; }).join('\n'), cps = full.length / (ty + .3 - tw);
  for (var k = 0; k < full.length; k += 5) E('type', tw + k / cps, { g: .7 }); E('lock', t2 + .1); E('pop', tp); E('pop', ty + .2);
  s.u = function (t) { seat(s.l1, t, SC[6] + .05); seat(s.l2, t, tw - .1, { s: .2, y: 0 }); seat(s.ph, t, SC[6] + .1, { s: .02 }); s.ph.style.backgroundPosition = lerp(35, 55, seg(t, SC[6], SC[7])) + '% 50%'; seat(s.pt, t, SC[6] + .3, { y: 0 });
    seat(s.js, t, SC[6] + .2); var n = Math.max(0, Math.floor((t - tw) * cps)), c = 0, out = '';
    J.forEach(function (l, i) { if (i && n <= c) return; var a = l[0].slice(0, Math.max(0, n - c)), b = l[1].slice(0, Math.max(0, n - c - l[0].length)); c += l[0].length + l[1].length + 1; out += (i ? '\n' : '') + esc(a) + '<span style="color:' + (l[2] || OFFW) + '">' + esc(b) + '</span>'; });
    s.tx.innerHTML = out + '<span style="color:' + LIME + ';opacity:' + (Math.floor(t * 2.5) % 2 ? 1 : .25) + '">▌</span>';
    var lk = t >= t2 + .1; seat(s.lk, t, SC[6] + .5, { s: .3, y: 0 }); s.lk.querySelector('.a').style.opacity = lk ? 0 : 1; s.lk.querySelector('.b').style.opacity = lk ? 1 : 0; s.lk.style.boxShadow = lk ? '0 0 22px ' + LIME : 'none';
    s.chips.forEach(function (ch, i) { seat(ch, t, i === 1 ? ty + .2 : wtp(3, CH[i][2]), { y: 14 }); }); seat(s.to, t, ty + .5, { y: 10 }); seat(s.tg, t, SC[6] + .6, { y: 0 }); return pop(t, t2 + .1, .2) * .2; };
  return s; })(S[6]);

// ================= S8 · block 3, the hands: the rack's HANDS module plugs in + the server code =================
A[7] = (function (P) { var s = {}; eb(P, '// BLOCK 3 · A SERVER YOU OWN'); trk(P, 3);
  s.l1 = hl(P, 236, 'THE HANDS.');
  s.rk = rackEl(P, 'left:190px;top:330px;width:700px;height:574px');
  var CODE = [['@app.post("/hook")', DIM], ['def hook(alert: Alert):', OFFW], ['    check_secret(alert)', OFFW, 1], ['    check_limits(alert)', OFFW, 1], ['    broker.place(alert)', RED]];
  s.cd = D('left:150px;top:924px;width:768px;height:290px', '<div class="tb"><s></s><s></s><s></s>' + logo('fastapi', 20, 20) + ' server.py · ILLUSTRATIVE · written by Claude Code</div><div class="tx mono" style="padding:14px 22px;font-size:23px;line-height:1.55;white-space:pre"></div>', P, 'pane');
  s.tx = s.cd.querySelector('.tx');
  var th = wtp(4, 'hands'), tw = SC[7] + .4, tsv = wtp(4, 'server');
  var full = CODE.map(function (c) { return c[0]; }).join('\n'), cps = full.length / (tsv + .5 - tw);
  for (var k = 0; k < full.length; k += 5) E('type', tw + k / cps, { g: .7 }); E('jack', th + .1);
  s.u = function (t) { seat(s.l1, t, SC[7] + .05); seat(s.rk, t, SC[7] + .1, { y: 40 }); rackState(s.rk, 2, 3, seg(t, th + .1, th + .3)); seat(s.cd, t, SC[7] + .3);
    var n = Math.max(0, Math.floor((t - tw) * cps)), c = 0, out = '';
    CODE.forEach(function (l, i) { if (i && n <= c) return; var a = l[0].slice(0, Math.max(0, n - c)); c += l[0].length + 1; out += (i ? '\n' : '') + '<span style="color:' + l[1] + '">' + esc(a) + '</span>' + (l[2] && a.length === l[0].length ? '  <span style="color:' + LIME + '">✓</span>' : ''); });
    s.tx.innerHTML = out + '<span style="color:' + LIME + ';opacity:' + (Math.floor(t * 2.5) % 2 ? 1 : .25) + '">▌</span>'; return pop(t, th + .1, .2) * .3; };
  return s; })(S[7]);

// ================= S9 · the risk gate: a mocap robot doorman checks every order =================
A[8] = (function (P) { var s = {}; eb(P, '// BLOCK 3 · THE RISK GATE'); trk(P, 3);
  s.l1 = hl(P, 236, 'CHECKED,', 80); s.l2 = hl(P, 318, '<span class="k" style="background:' + RED + ';color:' + OFFW + '">THEN SENT.</span>', 80);
  s.ph = D('left:150px;top:430px;width:768px;height:280px;background:url(photos/city.jpg) center 60%/cover', '<div style="position:absolute;inset:0;border-radius:12px;background:linear-gradient(90deg,rgba(20,22,25,.1),rgba(20,22,25,.7))"></div>', P, 'ph');
  s.pt = tag(P, 'REAL PHOTO · UNSPLASH', 'left:170px;top:446px');
  s.bk = D('left:470px;top:476px;width:420px;padding:18px 20px;background:rgba(13,15,17,.92);border:2px solid ' + RED + ';border-radius:12px', '<div style="display:flex;align-items:center;gap:12px">' + ic('building-bank', 40, RED, 2) + '<div class="lab" style="color:' + RED + '">ORDER GOES OUT</div></div><div style="margin-top:10px;font:700 34px/1.1 CP;text-transform:uppercase">Your broker\'s API</div><div class="mono" style="margin-top:8px;font-size:15px;color:' + ALU + '">only from your server · only inside your limits</div>', P);
  s.gp = D('left:520px;top:760px;width:16px;height:440px;background:linear-gradient(90deg,#9aa1a8,#6a7179);border-radius:6px', '', P);
  s.gb = D('left:520px;top:760px;width:398px;height:16px;background:linear-gradient(180deg,#c9ced4,#7b838c);border-radius:6px', '', P);
  var R = [['SECRET', 'secret'], ['MAX SIZE · 2', 'risk'], ['DAILY LOSS · OK', 'limits'], ['KILL SWITCH · OFF', 'limits']];
  s.ck = D('left:560px;top:800px;width:340px;padding:14px 16px', '<div class="lab">RISK GATE</div>' + R.map(function (r) { return '<div class="rw" style="display:flex;justify-content:space-between;margin-top:12px;font:600 21px/1 MM"><span>' + r[0] + '</span><span class="v" style="color:' + LIME + '">✓</span></div>'; }).join('') + '<div class="bad" style="display:flex;justify-content:space-between;margin-top:14px;font:600 21px/1 MM;color:' + RED + '"><span>QTY 500</span><span>✗ BOUNCED</span></div>', P, 'card');
  s.rows = s.ck.querySelectorAll('.rw'); s.bad = s.ck.querySelector('.bad');
  s.rob = D('left:120px;top:770px;width:400px;height:420px', '', P);
  s.p1 = D('left:150px;top:1120px;color:' + GRN + ';z-index:3;box-shadow:0 0 18px rgba(34,197,94,.35)', 'BUY 1', P, 'chip');
  s.p2 = D('left:150px;top:1060px;color:' + RED + ';z-index:3;box-shadow:0 0 18px rgba(255,59,59,.35)', 'QTY 500', P, 'chip');
  var tsec = wtp(4, 'secret'), tri = wtp(4, 'risk'), tli = wtp(4, 'limits'), tse = wtp(4, 'sends'), tbr = wtp(4, 'broker');
  s.rt = [tsec, tri, tli + .1, tli + .3]; s.tb = tli + .55;
  s.rt.forEach(function (x) { E('tick', x); }); E('buzz', s.tb); E('thunk', s.tb + .05); E('whoosh', tse); E('pop', tbr);
  var PAL = { body: '#c9ced4', back: '#7b838c', edge: '#141619', joint: AMB, inner: BLUE };
  s.u = function (t) { var lt = t - SC[8]; seat(s.l1, t, SC[8] + .05); seat(s.l2, t, tse - .15, { s: .2, y: 0 }); seat(s.ph, t, SC[8] + .1, { s: .02 }); s.ph.style.backgroundPosition = 'center ' + lerp(55, 65, seg(t, SC[8], SC[9])) + '%'; seat(s.pt, t, SC[8] + .3, { y: 0 });
    seat(s.bk, t, SC[8] + .35, { x: 30, y: 0 }); s.bk.style.boxShadow = t >= tse + .5 ? '0 0 26px rgba(255,59,59,.55)' : 'none';
    seat(s.gp, t, SC[8] + .15, { y: 60 }); seat(s.gb, t, SC[8] + .2, { x: 60, y: 0 }); seat(s.ck, t, SC[8] + .3);
    Array.prototype.forEach.call(s.rows, function (r, i) { r.querySelector('.v').style.opacity = t >= s.rt[i] ? 1 : 0; }); s.bad.style.opacity = t >= s.tb ? 1 : 0;
    // robot doorman: patrols (walk in place), kicks the oversized order away at the bounce, then settles
    var P0, kk = t - (s.tb - .55); if (kk > 0 && kk < 1.6) P0 = RIG.sample('kick', 1.55 + kk * .9, {}); else P0 = RIG.sample('walk', lt * .55, { loop: true, inplace: true });
    if (kk > 0 && kk < 1.6) { var hx = P0.hip[0]; for (var j in P0) P0[j][0] -= hx; }
    s.rob.innerHTML = '<svg width="400" height="420" viewBox="-200 -400 400 420">' + RIG.svg(P0, 'robot', { pal: PAL }) + '</svg>';
    // packets: QTY 500 walks up and is kicked back; BUY 1 passes the gate and flies to the broker card
    var u2 = seg(t, SC[8] + .4, s.tb), b2 = clamp((t - s.tb) / .5, 0, 1); s.p2.style.opacity = t < SC[8] + .4 ? 0 : 1 - clamp((t - s.tb - .5) / .3, 0, 1);
    s.p2.style.transform = 'translate(' + (lerp(0, 300, u2) - 240 * ec(b2)) + 'px,' + (-80 * Math.sin(b2 * Math.PI)) + 'px) rotate(' + (-30 * b2) + 'deg)';
    var u1 = seg(t, s.tb + .2, tse + .1), f1 = seg(t, tse + .1, tse + .7); s.p1.style.opacity = t < s.tb + .2 ? 0 : 1 - clamp((t - tse - .6) / .2, 0, 1);
    s.p1.style.transform = 'translate(' + (lerp(0, 290, u1) + 200 * Math.pow(f1, 5)) + 'px,' + (-560 * f1) + 'px) scale(' + (1 - .4 * f1) + ')';
    return pop(t, s.tb, .2) * .35; };
  return s; })(S[8]);

// ================= S10 · block 4, the supervisor: a Cowork scheduled task reads the trade log every evening =================
var LOG = [['09:41', 'AAPL', 'BUY', '1', ''], ['10:05', 'EURUSD', 'SELL', '2', ''], ['11:32', 'GOLD', 'BUY', '1', ''], ['13:10', 'BTCUSD', 'BUY', '3', 'F'], ['14:47', 'AAPL', 'SELL', '1', ''], ['15:20', 'EURUSD', 'BUY', '2', ''], ['15:58', 'GOLD', 'SELL', '1', '']];
A[9] = (function (P) { var s = {}; eb(P, '// BLOCK 4 · EVERY EVENING'); trk(P, 4);
  s.l1 = hl(P, 236, 'THE'); s.l2 = hl(P, 322, '<span class="k" style="background:' + LIME + '">SUPERVISOR.</span>');
  s.tk = D('left:150px;top:430px;width:768px;padding:18px 22px', '<div class="lab" style="display:flex;align-items:center;gap:10px">' + logo('anthropic', 18, 18, ALU) + ' CLAUDE COWORK · SCHEDULED TASK</div><div style="margin-top:12px;font:700 40px/1.1 CP;text-transform:uppercase">Review today\'s trades</div><div class="rw" style="margin-top:14px;display:flex;gap:12px;flex-wrap:nowrap"><span class="chip" style="position:static;color:' + LIME + '">' + ic('calendar', 18, 'currentColor') + ' WEEKDAYS · 6:30 PM</span><span class="chip rr" style="position:static;color:' + BLUE + '">' + ic('moon-stars', 18, 'currentColor') + ' RUNS REMOTELY</span></div>', P, 'card');
  s.rr = s.tk.querySelector('.rr'); s.rw = s.tk.querySelector('.rw');
  s.lg = D('left:150px;top:700px;width:500px;height:400px', '<div class="tb"><s></s><s></s><s></s>trade_log · ILLUSTRATIVE</div><div class="bd" style="position:relative;height:350px;overflow:hidden"><div class="in" style="position:absolute;left:0;right:0;top:0"></div></div>', P, 'pane');
  s.in = s.lg.querySelector('.in');
  s.in.innerHTML = '<div class="mono" style="display:flex;padding:12px 16px;font-size:15px;color:' + DIM + ';letter-spacing:.08em"><span style="width:90px">TIME</span><span style="width:130px">SYMBOL</span><span style="width:90px">SIDE</span><span>QTY</span></div>' + LOG.concat(LOG).map(function (r, i) { return '<div class="lr mono" data-f="' + (i < 7 ? r[4] : '') + '" style="display:flex;align-items:center;padding:11px 16px;font-size:19px;border-top:1px solid #22262b"><span style="width:90px;color:' + DIM + '">' + r[0] + '</span><span style="width:130px">' + r[1] + '</span><span style="width:90px;color:' + (r[2] === 'BUY' ? GRN : RED) + '">' + r[2] + '</span><span>' + r[3] + '</span><span class="fl" style="margin-left:auto;color:' + AMB + ';opacity:0">' + ic('flag-2', 20, AMB) + ' 3 &gt; MAX 2</span></div>'; }).join('');
  s.flag = s.in.querySelector('[data-f="F"]');
  s.lap = D('left:676px;top:700px;width:242px;height:200px', '', P);
  s.lt = D('left:676px;top:910px;width:242px;text-align:center;font:600 15px/1.35 MM;color:' + ALU, 'LAPTOP OFF.<br><span style="color:' + LIME + '">TASK STILL RUNS.</span>', P);
  s.tg = tag(P, 'SOURCE · support.claude.com · COWORK SCHEDULED TASKS', 'left:150px;top:1150px');
  var tcw = wtp(5, 'cowork'), tsch = wtp(5, 'scheduled'), trd = wtp(5, 'reads'), tev = wtp(5, 'evening'), toff = wtp(5, 'off'), tfl = wtp(5, 'flags'), twd = wtp(5, 'weird');
  E('pop', tcw); E('tick', tsch + .2); E('flip', trd); E('tick', tev); E('lid', toff); E('flag', tfl + .1); E('pop', twd);
  s.u = function (t) { seat(s.l1, t, SC[9] + .05); seat(s.l2, t, wtp(5, 'supervisor') - .05, { s: .2, y: 0 }); seat(s.tk, t, SC[9] + .15); s.rw.style.opacity = t >= tsch + .2 ? 1 : 0; s.rr.style.opacity = t >= toff ? 1 : .3;
    seat(s.lg, t, SC[9] + .2); var sc = seg(t, trd, tfl) * 160; s.in.style.transform = 'translateY(' + (-sc) + 'px)';
    var fl = t >= tfl + .1; s.flag.style.background = fl ? 'rgba(255,138,0,.16)' : 'transparent'; s.flag.style.boxShadow = fl ? 'inset 4px 0 0 ' + AMB : 'none'; s.flag.querySelector('.fl').style.opacity = fl ? 1 : 0;
    // laptop: lid closes on "off", screen goes dark, a moon rises; the task keeps a lime LED pulsing
    var lc = seg(t, toff, toff + .45), on = 1 - lc, ang = lerp(-8, -84, lc);
    s.lap.innerHTML = '<svg width="242" height="200" viewBox="0 0 242 200"><rect x="6" y="150" width="230" height="16" rx="6" fill="#9aa1a8"/><g transform="translate(121 152) scale(1 ' + Math.cos(ang * Math.PI / 180).toFixed(3) + ') translate(-121 -152)"><rect x="26" y="22" width="190" height="128" rx="8" fill="#3a4048"/><rect x="34" y="30" width="174" height="112" rx="4" fill="' + (on > .5 ? '#0b1220' : '#050506') + '"/><g opacity="' + on.toFixed(2) + '">' + [0, 1, 2, 3, 4].map(function (k) { return '<rect x="' + (46 + k * 32) + '" y="' + (60 + (k % 2) * 18) + '" width="16" height="' + (40 - (k % 2) * 18) + '" fill="' + (k % 2 ? RED : GRN) + '"/>'; }).join('') + '</g></g>' +
      '<g opacity="' + lc.toFixed(2) + '" transform="translate(' + (190) + ' ' + (40 - 20 * lc) + ')">' + window.IC['moon-stars'].replace(/<(path|circle|line)/g, '<$1 stroke="' + BLUE + '" stroke-width="2" fill="none"') + '</g><circle cx="121" cy="158" r="5" fill="' + LIME + '" opacity="' + (.4 + .6 * (Math.floor(t * 2) % 2)).toFixed(2) + '"/></svg>';
    seat(s.lap, t, SC[9] + .35, { x: 30, y: 0 }); seat(s.lt, t, toff + .3, { y: 10 }); seat(s.tg, t, SC[9] + .6, { y: 0 }); return 0; };
  return s; })(S[9]);

// ================= S11 · nothing changes until you approve it =================
A[10] = (function (P) { var s = {}; eb(P, '// YOU STAY THE BOSS'); trk(P, 4);
  s.l1 = hl(P, 236, 'YOU'); s.l2 = hl(P, 322, '<span class="k" style="background:' + LIME + '">APPROVE IT.</span>');
  s.man = D('left:140px;top:560px;width:280px;height:354px', window.HUM.st22.replace('<svg ', '<svg width="280" height="354" '), P);
  s.ph = D('left:440px;top:440px;width:330px;height:620px;border-radius:44px;background:#0b0d0f;border:10px solid #3a4048;box-shadow:0 26px 50px rgba(0,0,0,.6);overflow:hidden', '<div style="margin:22px auto 0;width:90px;height:8px;border-radius:4px;background:#22262b"></div><div style="padding:22px 20px"><div class="lab" style="display:flex;align-items:center;gap:8px">' + logo('anthropic', 16, 16, ALU) + ' NIGHTLY REVIEW</div><div style="margin-top:14px;font:700 26px/1.2 IN">Claude suggests:</div><div style="margin-top:10px;font:700 34px/1.15 CP;text-transform:uppercase">Lower max size <span style="color:' + AMB + '">2 → 1</span></div><div class="mono" style="margin-top:12px;font-size:15px;line-height:1.5;color:' + ALU + '">Reason: 1 trade broke the size rule today.</div><div class="ap" style="margin-top:26px;height:64px;border-radius:12px;background:' + LIME + ';color:#141619;font:700 28px/64px CP;text-align:center">APPROVE</div><div style="margin-top:12px;height:56px;border-radius:12px;border:2px solid #3a4048;color:' + ALU + ';font:700 24px/52px CP;text-align:center">REJECT</div></div>', P);
  s.ap = s.ph.querySelector('.ap');
  s.tap = D('left:540px;top:820px;width:130px;height:130px;border-radius:50%;border:5px solid ' + LIME + ';pointer-events:none', '', P);
  s.rk = rackEl(P, 'left:150px;top:930px;width:280px;height:230px');
  s.nb = D('left:440px;top:1084px;width:478px;font:700 26px/1.25 CP;text-transform:uppercase;color:' + OFFW, 'Nothing changes <span style="color:' + LIME + '">without you.</span>', P);
  s.df = D('left:786px;top:470px;width:132px;padding:14px 12px', '<div class="lab">RULE DIFF</div><div class="mono" style="margin-top:14px;font-size:17px;line-height:1.5;color:' + RED + ';text-decoration:line-through">max_size<br>= 2</div><div class="mono" style="margin-top:10px;font-size:17px;line-height:1.5;color:' + LIME + '">max_size<br>= 1</div><div class="mono st" style="margin-top:16px;font-size:14px;color:' + AMB + '">PENDING</div>', P, 'card');
  s.fc = D('left:150px;top:450px;color:' + AMB, ic('flag-2', 18, 'currentColor') + ' 1 TRADE FLAGGED', P, 'chip');
  s.tg = tag(P, 'ILLUSTRATIVE APPROVAL CARD', 'left:150px;top:1180px');
  var tn = wtp(5, 'nothing'), ta = wtp(5, 'approve');
  E('pop', tn + .2); E('tap', ta + .15); E('ding', ta + .2);
  s.u = function (t) { seat(s.l1, t, SC[10] + .05); seat(s.l2, t, ta - .1, { s: .2, y: 0 }); seat(s.man, t, SC[10] + .1, { x: -30, y: 0 }); seat(s.ph, t, SC[10] + .15, { y: 50 }); var ok = t >= ta + .15;
    s.ap.textContent = ok ? 'APPROVED ✓' : 'APPROVE'; s.ap.style.boxShadow = ok ? '0 0 26px ' + LIME : 'none'; var tu = clamp((t - ta - .15) / .5, 0, 1); s.tap.style.opacity = t < ta + .15 ? 0 : 1 - tu; s.tap.style.transform = 'scale(' + (.4 + tu) + ')';
    seat(s.df, t, SC[10] + .2, { x: 20, y: 0 }); var stt = s.df.querySelector('.st'); stt.textContent = ok ? 'APPROVED' : 'PENDING'; stt.style.color = ok ? LIME : AMB; seat(s.fc, t, SC[10] + .25, { y: 0 });
    seat(s.rk, t, SC[10] + .3, { y: 30 }); rackState(s.rk, 3, 4, seg(t, ta + .2, ta + .4)); seat(s.nb, t, tn + .2, { y: 12 }); seat(s.tg, t, SC[10] + .5, { y: 0 }); return 0; };
  return s; })(S[10]);

// ================= S12 · the honest part: most retail traders lose; a bot just loses faster =================
var DROP = series(40, 11, 3, -.18);
A[11] = (function (P) { var s = {}; eb(P, '// WHAT REGULATORS MEASURED');
  s.l1 = hl(P, 236, 'MOST TRADERS', 80); s.l2 = hl(P, 318, '<span class="k" style="background:' + RED + ';color:' + OFFW + '">LOSE MONEY.</span>', 80);
  var dots = ''; for (var i = 0; i < 100; i++) dots += '<i data-i="' + i + '" style="position:absolute;left:' + ((i % 10) * 46) + 'px;top:' + (Math.floor(i / 10) * 46) + 'px;width:34px;height:34px;border-radius:50%;background:#2c3137"></i>';
  s.gd = D('left:150px;top:440px;width:460px;height:460px', dots, P); s.ds = s.gd.querySelectorAll('i');
  s.nm = D('left:650px;top:440px;width:268px', '<div style="font:700 66px/1 CP;color:' + RED + '">74–89%</div><div class="mono" style="margin-top:10px;font-size:16px;line-height:1.45;color:' + ALU + '">of retail CFD accounts lost money</div>', P);
  s.lf = D('left:150px;top:924px;width:768px;font:700 52px/1 CP;text-transform:uppercase;white-space:nowrap', 'A bot just loses <span style="color:' + RED + '">faster.</span>', P);
  s.ch = D('left:150px;top:996px;width:768px;height:200px', '<div class="tb"><s></s><s></s><s></s>auto-trading a bad rule · ILLUSTRATIVE</div><div class="cv" style="position:absolute;left:12px;top:50px"></div>', P, 'pane');
  s.cv = s.ch.querySelector('.cv');
  s.tg = tag(P, 'SOURCE · ESMA (EU REGULATOR) · 27 MAR 2018', 'left:150px;top:1220px');
  var th = wtp(6, 'honest'), tb = wtp(6, 'bot'), tf = wtp(6, 'faster');
  E('drone', SC[11] + .1, { dur: 3.5 }); for (var k = 0; k < 10; k++) E('tick', th + k * .08, { g: .5 }); E('thunk', tf + .1);
  s.u = function (t) { seat(s.l1, t, SC[11] + .05); seat(s.l2, t, th, { s: .2, y: 0 }); seat(s.gd, t, SC[11] + .15);
    var nr = Math.floor(clamp((t - th) / .9, 0, 1) * 74), na = Math.floor(clamp((t - th - .9) / .5, 0, 1) * 15);
    Array.prototype.forEach.call(s.ds, function (d, i) { d.style.background = i < nr ? RED : (i < 74 + na && i >= 74 ? 'rgba(255,59,59,' + (.35 + .25 * Math.sin(t * 6)).toFixed(2) + ')' : '#2c3137'); });
    seat(s.nm, t, th + .3, { x: 20, y: 0 }); seat(s.lf, t, tb - .1, { y: 14 }); seat(s.ch, t, SC[11] + .3);
    s.cv.innerHTML = candles(744, 140, DROP, 6 + clamp((t - tb) / 1.4, 0, 1) * 34, { grid: 1 }); seat(s.tg, t, SC[11] + .5, { y: 0 }); return 0; };
  return s; })(S[11]);

// ================= S13 · recap card (save) + CTA =================
A[12] = (function (P) { var s = {};
  var ROWS = [['1', 'BRAIN', 'Official TradingView connector', BLUE], ['2', 'SIGNAL', 'Pine Script + your webhook alert', AMB], ['3', 'HANDS', 'Your server: secret + risk limits', RED], ['4', 'SUPERVISOR', 'Cowork task. You approve changes.', LIME]];
  s.card = D('left:150px;top:166px;width:768px;padding:24px 26px 22px', '<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="font:700 46px/1 CP;text-transform:uppercase">The 4-block<br><span style="color:' + LIME + '">pipeline</span></div><div class="sv" style="display:flex;flex-direction:column;align-items:center;gap:6px"><svg width="46" height="56" viewBox="0 0 24 28"><path d="M4 2h16v24l-8-6-8 6z" fill="' + OFFW + '"/></svg><span class="mono" style="font-size:14px">SAVE</span></div></div>' +
    '<div class="rk" style="position:relative;height:250px;margin-top:6px;background:url(3d/rack_4.png) center/contain no-repeat"></div>' +
    ROWS.map(function (r) { return '<div class="rr" style="display:flex;gap:16px;margin-top:14px;align-items:center"><span style="flex:none;width:46px;height:46px;border-radius:8px;border:2px solid ' + r[3] + ';color:' + r[3] + ';font:700 28px/42px CP;text-align:center">' + r[0] + '</span><div style="flex:none;width:200px;font:700 26px/1 CP;color:' + r[3] + '">' + r[1] + '</div><div style="font:600 21px/1.25 IN;color:' + OFFW + '">' + r[2] + '</div></div>'; }).join('') +
    '<div class="ru" style="margin-top:18px;display:flex;gap:10px"><span class="chip pp" style="position:static;color:' + LIME + '">PAPER TRADE FIRST</span><span class="chip" style="position:static;color:' + RED + '">HARD LIMITS</span><span class="chip" style="position:static;color:' + BLUE + '">YOU APPROVE</span></div>', P, 'card');
  s.rows = s.card.querySelectorAll('.rr'); s.sv = s.card.querySelector('.sv'); s.pp = s.card.querySelector('.pp'); s.ru = s.card.querySelector('.ru');
  s.hd = D('left:440px;top:950px;font:700 44px/1 CP', '@sandesh.explains', P);
  s.fo = D('left:440px;top:1014px;background:' + LIME + ';color:#141619;font:700 34px/1 CP;padding:16px 26px;border-radius:10px;box-shadow:0 0 22px rgba(126,224,42,.45);white-space:nowrap', 'FOLLOW FOR MORE', P);
  s.nf = D('left:440px;top:1104px;font:600 15px/1.4 MM;color:' + ALU + ';letter-spacing:.08em', 'NOT FINANCIAL ADVICE.<br>NO RETURNS ARE PROMISED.', P);
  s.ring = D('left:150px;top:930px;width:260px;height:260px;border-radius:50%;border:8px solid #3a4048;box-shadow:0 0 0 6px ' + LIME + ',0 18px 40px rgba(0,0,0,.6);pointer-events:none;z-index:7', '', P);
  var tp = wtp(6, 'paper'), ts = wtp(6, 'save'), tf = wtp(6, 'follow');
  E('pop', SC[12] + .25); for (var i = 0; i < 4; i++) E('jack', SC[12] + .45 + i * .2, { g: .6 }); E('stamp', tp + .1, { g: .6 }); E('thunk', ts); E('chime', tf);
  s.u = function (t) { seat(s.card, t, SC[12] + .05, { y: 30, s: .02 }); Array.prototype.forEach.call(s.rows, function (r, i) { seat(r, t, SC[12] + .45 + i * .2, { x: -20, y: 0, s: 0 }); });
    seat(s.ru, t, SC[12] + .3, { y: 0 }); s.pp.style.boxShadow = t >= tp + .1 ? '0 0 18px ' + LIME : 'none'; s.pp.style.transform = 'scale(' + (1 + .15 * pop(t, tp + .1, .4)) + ')';
    s.sv.style.transform = 'scale(' + (1 + .2 * pop(t, ts, .4) + .04 * Math.sin(t * 5)) + ')'; seat(s.ring, t, SC[12] + .2, { y: 0, s: .15 }); seat(s.hd, t, SC[12] + .6, { x: 30, y: 0, s: 0 }); seat(s.fo, t, SC[12] + .8, { x: 30, y: 0, s: 0 });
    s.fo.style.transform += ' scale(' + (1 + .1 * pop(t, tf, .45) + (t > tf ? .03 * Math.sin(t * 6) : 0)) + ')'; seat(s.nf, t, SC[12] + 1.1, { y: 0 }); return 0; };
  return s; })(S[12]);

// ---------------- host (avatar video) ----------------
var host = D('', '<div class="fr"><canvas width="720" height="720"></canvas><div class="lb"><span><span class="led"></span><span class="ln">HOST</span></span><span>AI AVATAR</span></div></div>', st); host.id = 'host';
var hFr = host.querySelector('.fr'), hCv = host.querySelector('canvas'), hLb = host.querySelector('.lb'), hLn = host.querySelector('.ln');
var hv = document.createElement('video'); hv.muted = true; hv.preload = 'auto'; hv.playsInline = true; hv.src = 'host.webm'; hv.style.cssText = 'position:absolute;width:2px;height:2px;opacity:0;pointer-events:none'; document.body.appendChild(hv);
function vseek(v, tt) { return new Promise(function (res) { if (!v.duration) { res(); return; } if (Math.abs(v.currentTime - tt) < 1e-4 && v.readyState >= 2) { res(); return; } var done = false; function fin() { if (done) return; done = true; v.removeEventListener('seeked', fin); res(); } v.addEventListener('seeked', fin); v.currentTime = tt; setTimeout(fin, 4000); }); }
function hostAt(t) { var f = Math.max(0, Math.floor(t * 24 + 1e-6)); return vseek(hv, Math.min(hv.duration - .02, (f + .5) / 24)).then(function () { try { hCv.getContext('2d').drawImage(hv, 0, 0, 720, 720); } catch (e) { } }); }
// pose per scene: [x, y, w, h, mode]  mode: case | ring | hide
var HP = [[150, 180, 768, 800, 'case'], [680, 990, 238, 262, 'case'], [0, 0, 0, 0, 'hide'], [0, 0, 0, 0, 'hide'], [0, 0, 0, 0, 'hide'], [0, 0, 0, 0, 'hide'], [0, 0, 0, 0, 'hide'], [0, 0, 0, 0, 'hide'], [0, 0, 0, 0, 'hide'],
  [676, 960, 242, 180, 'case'], [0, 0, 0, 0, 'hide'], [650, 620, 268, 284, 'case'], [158, 938, 244, 244, 'ring']];
var HLAB = ['HOST', 'HOST', '', '', '', '', '', '', '', 'HOST', '', 'HOST', ''];
function poseOf(si) { return HP[si]; }
function hostSet(p, dx, si) { if (!p || p[4] === 'hide') { host.style.display = 'none'; return; } host.style.display = 'block';
  var x = p[0] + dx, y = p[1], w = p[2], h = p[3]; host.style.left = x + 'px'; host.style.top = y + 'px'; host.style.width = w + 'px'; host.style.height = h + 'px';
  var ring = p[4] === 'ring', big = w > 400, lbh = ring ? 0 : (big ? 44 : 32), bw = ring ? 0 : (big ? 8 : 6);
  hFr.style.borderRadius = ring ? '50%' : (big ? '20px' : '14px'); hFr.style.borderWidth = bw + 'px'; hLb.style.display = ring ? 'none' : 'flex'; hLb.style.height = lbh + 'px'; hLb.style.lineHeight = lbh + 'px'; hLb.style.fontSize = (big ? 16 : 12) + 'px'; hLn.textContent = HLAB[si] || 'HOST';
  var cw = w - 2 * bw, ch = h - lbh - 2 * bw, sz = Math.max(cw, ch); hCv.style.width = sz + 'px'; hCv.style.height = sz + 'px'; hCv.style.left = ((cw - sz) / 2) + 'px'; hCv.style.top = ((ch - sz) / 2 - (ring ? 0 : sz * .03)) + 'px'; }
// ---------------- captions ----------------
var cap = D('', '', st); cap.id = 'cap';
function drawCap(t, col) { var last = 0; for (var i = 0; i < WD.length; i++) if (t >= WD[i].s - .02) last = i; var pi = 0; for (var j = 0; j < PG.length; j++) if (PG[j].indexOf(last) >= 0) pi = j;
  var out = PG[pi].map(function (wi) { return '<span class="' + (wi === last ? 'cur' : (wi < last ? 'w' : '')) + '">' + esc(WD[wi].w) + '</span>'; }).join(' ');
  if (cap.__h !== out) { cap.__h = out; cap.innerHTML = out; } cap.style.setProperty('--c', col); }
// ---------------- background + overlays ----------------
var glc = document.getElementById('gl'), bg = document.getElementById('bg');
var OV = {}; function ovl(id, src, blend, op) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = src; v.className = 'vid'; v.style.mixBlendMode = blend; v.style.opacity = op; st.appendChild(v); OV[id] = { v: v }; }
ovl('dust', 'dust-particles.webm', 'screen', .5); ovl('grain', 'film-grain.webm', 'multiply', .3);
function ovAt(id, on, t, fps) { var o = OV[id]; o.v.style.display = on ? 'block' : 'none'; if (!on || !o.v.duration) return Promise.resolve(); var d = o.v.duration, tt = (t % d), f = Math.floor(tt * fps); return vseek(o.v, Math.min(d - .01, (f + .5) / fps)); }
var WH = 0.14; SC.slice(1).forEach(function (c) { E('whip', c - .12); });
// ---------------- seek ----------------
var IMGS = RACK.concat(['3d/tiles_off.png', '3d/tiles_on.png', 'photos/keys.jpg', 'photos/city.jpg']);
var ready = Promise.all([window.GLP.load(['desk']), new Promise(function (r) { hv.addEventListener('loadeddata', r); setTimeout(r, 8000); }), Promise.all(['dust', 'grain'].map(function (k) { return new Promise(function (r) { OV[k].v.addEventListener('loadeddata', r); setTimeout(r, 6000); }); })), Promise.all(IMGS.map(function (u) { return new Promise(function (r) { var i = new Image(); i.onload = i.onerror = r; i.src = u; }); })), document.fonts.ready]).then(function () { window.__ready = true; return window.__seek(0); });
window.EV = EV;
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var si = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) si = i;
  // camera push along the cable: around each cut both scenes are on screen, offset by one frame width
  var off = {}, prev = -1, nxt = -1, u = 0;
  if (si > 0 && t < SC[si] + WH) { prev = si - 1; u = sm((t - (SC[si] - WH)) / (2 * WH)); }
  else if (si < SC.length - 1 && t >= SC[si + 1] - WH) { nxt = si + 1; u = sm((t - (SC[si + 1] - WH)) / (2 * WH)); }
  if (prev >= 0) { off[prev] = -1080 * u; off[si] = 1080 * (1 - u); } else if (nxt >= 0) { off[si] = -1080 * u; off[nxt] = 1080 * (1 - u); } else off[si] = 0;
  scenes.forEach(function (s, i) { var on = off.hasOwnProperty(i); s.style.display = on ? 'block' : 'none'; if (on) s.style.transform = off[i] ? 'translateX(' + off[i].toFixed(1) + 'px)' : ''; });
  var jolt = 0; Object.keys(off).forEach(function (k) { k = +k; var e = ebs.filter(function (x) { return x.parentNode === scenes[k]; })[0]; if (e) { var lt = t - SC[k], qq = ec(lt / .3); e.style.transform = 'translateX(' + ((1 - qq) * -60) + 'px)'; e.style.opacity = clamp(lt / .1, 0, 1); } cableAt(k, t); var j = A[k].u(t) || 0; if (k === si) jolt = j; });
  st.style.transform = jolt ? 'translate(' + (Math.sin(t * 90) * 6 * jolt).toFixed(1) + 'px,' + (Math.cos(t * 77) * 5 * jolt).toFixed(1) + 'px)' : '';
  var gl = off.hasOwnProperty(2); bg.style.display = gl && (off[2] === 0) ? 'none' : 'block'; glc.style.display = gl ? 'block' : 'none';
  if (gl) { glc.style.transform = off[2] ? 'translateX(' + off[2].toFixed(1) + 'px)' : ''; var uu = clamp((t - SC[2]) / (SC[3] - SC[2]), 0, 1); window.GLP.draw({ a: 'desk', camA: [lerp(-.2, .15, uu), .02, lerp(1.06, 1.2, uu)], par: .07, dim: .5, t: t }); }
  bg.querySelector('.br').style.transform = 'translateX(' + (((off[si] || 0) % 3)).toFixed(1) + 'px)';
  // host follows its scene during a push; between two host scenes it travels from pose to pose
  var ks = Object.keys(off).map(Number), hs = ks.filter(function (k) { return HP[k][4] !== 'hide'; });
  if (hs.length === 2) { var a = HP[ks[0]], b = HP[ks[1]], v = u; hostSet([lerp(a[0], b[0], v), lerp(a[1], b[1], v), lerp(a[2], b[2], v), lerp(a[3], b[3], v), v > .5 ? b[4] : a[4]], 0, v > .5 ? ks[1] : ks[0]); }
  else if (hs.length === 1) hostSet(HP[hs[0]], off[hs[0]], hs[0]); else hostSet(null);
  drawCap(t, CCOL[si]);
  return Promise.all([hostAt(t), ovAt('dust', si === 2, t, 25), ovAt('grain', si === 6 || si === 8 || si === 11, t, 30)]);
};
})();
