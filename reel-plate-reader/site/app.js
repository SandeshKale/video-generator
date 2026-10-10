(function () {
'use strict';
var BEATS = window.BEATS, WORDS = window.WORDS, DUR = BEATS[BEATS.length - 1][1]; window.__reelDurationSec = DUR;
var AM = '#ffb400', GR = '#0a6b43', WH = '#f4f6f2', AS = '#15181c', RD = '#e5322d';
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function lerp(a, b, u) { return a + (b - a) * u; }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return sm((t - a) / (b - a)); }
function bounce(x) { x = clamp(x, 0, 1); var s = 1.70158 * 1.4; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); }
function W(bi, i) { return WORDS[bi][Math.min(i, WORDS[bi].length - 1)][0] - BEATS[bi][0]; }
var st = document.getElementById('st');
function D(css, html, par, cls) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; if (cls) e.className = cls; (par || st).appendChild(e); return e; }
function sign(par, html, css, cls) { var e = D(css, html, par, 'sign ' + (cls || 'h')); return e; }
function pin(el, t, at, o) { o = o || {}; var p = bounce(seg(t, at, at + (o.d || 0.35))), s0 = o.s0 == null ? 0.7 : o.s0; el.style.opacity = t < at ? 0 : 1; el.style.transform = 'translate(' + ((o.x || 0) * (1 - p)) + 'px,' + ((o.y || 0) * (1 - p)) + 'px) rotate(' + ((o.r || 0) + (o.rot || 0)) + 'deg) scale(' + (s0 + (1 - s0) * p) + ')'; }
function show(el, on) { el.style.opacity = on ? 1 : 0; }
function plateEl(par, css, nmFont, stFont) { var p = D(css, '<div class="st"' + (stFont ? ' style="font-size:' + stFont + 'px;margin-top:6px"' : '') + '>ANYSTATE</div><div class="nm" style="font-size:' + nmFont + 'px">ABC·1234</div>', par, 'plate'); return p; }
// persistent layers
D('', null, st).id = 'scrim'; D('', null, st).id = 'road'; var road = document.getElementById('road');
var scenes = [], tabs = [];
function scene() { var s = D('left:0;top:0;width:1080px;height:1920px', null, st, 'sc'); scenes.push(s); return s; }
function tab(par, txt) { var e = sign(par, txt, 'left:190px;top:170px', 'tab'); tabs.push(e); return e; }
function aitag(par, txt) { var e = D('', txt || 'AI IMAGE', par, 'tag'); return e; }

// ---------------- scene 1 ----------------
var S1 = scene(), s1 = {};
s1.tab = tab(S1, 'MORNING COMMUTE'); s1.h1 = sign(S1, 'YOUR CAR\'S<br>DAILY ROUTINE', 'left:190px;top:300px;width:700px'); s1.h2 = sign(S1, 'SOMEBODY\'S<br>KEEPING <em>NOTES</em>', 'left:190px;top:300px;width:700px');
s1.plate = plateEl(S1, 'left:455px;top:870px;width:230px;height:112px', 40, 12); s1.ring = D('left:0;top:0;width:60px;height:60px;border:6px solid ' + AM + ';border-radius:50%', '', S1); s1.tag = aitag(S1);
// ---------------- scene 2 ----------------
var S2 = scene(), s2 = {};
s2.tab = tab(S2, 'THE GRAY BOX ABOVE THE ROAD'); s2.h1 = sign(S2, 'ON YOUR WAY<br>TO WORK', 'left:190px;top:300px;width:700px'); s2.h2 = sign(S2, 'NEVER<br>LOOKED <em>UP</em>', 'left:190px;top:300px;width:700px');
s2.diamond = D('left:640px;top:640px;width:230px;height:230px;background:' + AM + ';border:10px solid ' + AS + ';transform:rotate(45deg);box-shadow:0 14px 30px rgba(0,0,0,.5)', '', S2);
s2.dtxt = D('left:640px;top:640px;width:230px;height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:' + AS + ';font:400 34px/1 AB;letter-spacing:.05em', '<svg width="86" height="86" viewBox="0 0 24 24" fill="none" stroke="#15181c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6"/></svg>CAMERA', S2); s2.tag = aitag(S2);
// ---------------- scene 3 ----------------
var S3 = scene(), s3 = {};
s3.tab = tab(S3, 'WHAT THE CAMERA WRITES DOWN'); s3.h = sign(S3, 'IT DOESN\'T<br>FILM YOU', 'left:190px;top:300px;width:700px;font-size:72px');
s3.plate = D('left:150px;top:600px;width:780px;height:360px', '<div class="st">ANYSTATE</div><div class="nm" id="p3n" style="font-size:88px;margin-top:46px"></div>', S3, 'plate');
s3.chars = []; 'ABC·1234'.split('').forEach(function (c) { var sp = document.createElement('span'); sp.textContent = c; sp.style.cssText = c === '·' ? 'padding:0 8px' : 'display:inline-block;border:4px solid transparent;margin:0 3px;padding:0 6px;border-radius:6px'; s3.plate.querySelector('#p3n').appendChild(sp); s3.chars.push(sp); });
function chip(par, txt, css) { return sign(par, txt, css + ';font:500 44px/1 DM;letter-spacing:.1em;padding:18px 30px;white-space:nowrap', 'tab'); }
s3.c1 = chip(S3, '08:14', 'left:190px;top:1030px'); s3.c2 = chip(S3, 'OAK ST', 'left:440px;top:1030px'); s3.c3 = chip(S3, '→ NORTH', 'left:190px;top:1130px'); s3.tag = aitag(S3);
// ---------------- scene 4 ----------------
var S4 = scene(), s4 = {};
s4.tab = tab(S4, 'MONDAY TO SUNDAY, ONE CAR'); s4.h = sign(S4, 'DO THAT<br>ALL OVER TOWN', 'left:190px;top:300px;width:700px;font-size:72px');
s4.dots = []; (function () { var r = 7; function rnd() { r = (r * 16807) % 2147483647; return r / 2147483647; } for (var i = 0; i < 46; i++) { var d = D('left:' + (200 + rnd() * 680) + 'px;top:' + (560 + rnd() * 560) + 'px;width:20px;height:20px;border-radius:50%;background:' + AM + ';box-shadow:0 0 22px 6px rgba(255,180,0,.65)', '', S4); d.dataset.at = (0.1 + (i / 46) * 1.5).toFixed(2); s4.dots.push(d); } })();
s4.flash = D('left:190px;top:520px;width:700px;height:640px;border:14px solid ' + WH + ';box-shadow:0 0 40px rgba(255,255,255,.7)', '', S4);
s4.diary = D('left:190px;top:520px;width:700px;height:640px;padding:44px 52px;font:italic 400 52px/1.45 IS', '<div style="font:500 22px/1 DM;letter-spacing:.2em;color:#8a7a52;margin-bottom:18px">ONE CAR · ONE WEEK</div>', S4, 'paper');
s4.lines = ['Mon: home, work, gym, home.', 'Tue: home, work, the usual café.', 'Wed: gym at six, work by eight.', 'Fri: the long drive out of town.', 'Sat: market, park, a late stop.'].map(function (t) { var l = D('position:relative;opacity:0', t, s4.diary); return l; }); s4.tag = aitag(S4);
// ---------------- scene 5 ----------------
var S5 = scene(), s5 = {};
s5.tab = tab(S5, 'WHY POLICE WANT THE DIARY'); s5.h = sign(S5, 'POLICE SAY', 'left:190px;top:300px;width:700px');
s5.c1 = D('left:190px;top:520px;width:700px;height:200px;padding:36px 44px', '<div style="font:500 26px/1 DM;letter-spacing:.2em;color:#6a6f76">VEHICLE REPORT</div><div style="font:400 64px/1.15 AB;margin-top:14px">STOLEN CAR</div>', S5, 'card'); s5.st1 = D('left:640px;top:600px;font-size:46px;color:#0a6b43;border-color:#0a6b43;background:rgba(244,246,242,.92)', 'FOUND', S5, 'stamp');
s5.c2 = D('left:190px;top:790px;width:700px;height:200px;padding:36px 44px', '<div style="font:500 26px/1 DM;letter-spacing:.2em;color:#6a6f76">MISSING PERSON</div><div style="font:400 56px/1.15 AB;margin-top:14px">STILL MISSING</div>', S5, 'card'); s5.st2 = D('left:680px;top:860px;color:#0a6b43;border-color:#0a6b43;background:rgba(244,246,242,.92);font-size:46px', 'HOME', S5, 'stamp');
s5.h2 = sign(S5, 'THEY\'RE<br>NOT <em>WRONG</em>', 'left:190px;top:1030px;width:700px;font-size:72px'); s5.tag = aitag(S5);
// ---------------- scene 6 ----------------
var S6 = scene(), s6 = {};
s6.tab = tab(S6, 'A FREE LOOKUP, THIS SUMMER'); s6.h1 = sign(S6, 'WHO GETS<br>TO READ IT?', 'left:190px;top:300px;width:700px;font-size:72px'); s6.h2 = sign(S6, 'ANYONE<br><em>SEARCHED?</em>', 'left:190px;top:300px;width:700px;font-size:72px');
s6.box = D('left:190px;top:700px;width:700px;background:' + WH + ';border:8px solid ' + GR + ';border-radius:20px;padding:28px 34px;box-shadow:0 18px 40px rgba(0,0,0,.5)', '<div style="font:500 24px/1 DM;letter-spacing:.2em;color:' + GR + '">YOUR PLATE</div><div id="s6t" style="font:500 92px/1.2 DM;color:#14171b;height:110px;white-space:nowrap"></div>', S6); s6.txt = s6.box.querySelector('#s6t');
s6.btn = D('left:190px;top:940px;width:700px;height:92px;background:' + AM + ';border-radius:16px;font:400 46px/92px AB;text-align:center;color:' + AS + ';letter-spacing:.06em;box-shadow:0 8px 0 #b27d00', 'SEARCH', S6); s6.bar = D('left:190px;top:1070px;width:700px;height:14px;background:rgba(255,255,255,.18);border-radius:7px;overflow:hidden', '<div id="s6b" style="height:100%;width:0;background:' + AM + '"></div>', S6); s6.fill = s6.bar.querySelector('#s6b');
s6.note = D('left:190px;top:1110px;width:700px;font:500 26px/1.4 DM;color:' + WH + ';letter-spacing:.06em;text-shadow:0 2px 8px rgba(0,0,0,.8)', 'free site · public records · incomplete', S6); s6.tag = aitag(S6, 'AI IMAGE · FICTIONAL PLATE');
// ---------------- scene 7 ----------------
var S7 = scene(), s7 = {};
s7.tab = tab(S7, 'THE LOG LOSES ITS NAMES'); s7.h = sign(S7, 'SOME GOT<br>A <em>YES</em>', 'left:190px;top:300px;width:700px;font-size:72px');
s7.sheet = D('left:190px;top:560px;width:700px;height:560px;padding:30px 36px;font:500 28px/1 DM', '', S7, 'paper');
var rows = [['CITY PD', 'Investigation', 'Tue 08:14'], ['COUNTY SO', 'Vehicle theft', 'Tue 09:02'], ['STATE PATROL', 'Missing person', 'Wed 07:41'], ['CITY PD', 'Suspicious vehicle', 'Wed 11:20'], ['COUNTY SO', 'Case follow-up', 'Thu 06:55']];
s7.html = '<div style="display:flex;gap:0;font-size:20px;letter-spacing:.14em;color:#8a7a52;margin-bottom:18px"><div style="width:230px">OFFICER / AGENCY</div><div style="width:270px">REASON</div><div>TIME</div></div>';
rows.forEach(function (r, i) { s7.html += '<div style="display:flex;height:76px;align-items:center;border-top:2px solid rgba(42,36,24,.18);position:relative"><div style="width:210px;font-size:24px">' + r[0] + '</div><div style="width:260px;font-size:24px">' + r[1] + '</div><div style="font-size:24px">' + r[2] + '</div></div>'; });
s7.sheet.innerHTML = s7.html; s7.nameBar = D('left:222px;top:630px;width:200px;height:380px;background:#0b0c0e;transform-origin:left;transform:scaleX(0)', '', S7); s7.reasonBar = D('left:432px;top:630px;width:250px;height:380px;background:#0b0c0e;transform-origin:left;transform:scaleX(0)', '', S7);
s7.stamp = D('left:260px;top:900px;color:' + RD + ';border-color:' + RD + ';background:rgba(243,236,220,.9);font-size:64px', 'SEARCHED', S7, 'stamp'); s7.tag = aitag(S7);
// ---------------- scene 8 ----------------
var S8 = scene(), s8 = {};
s8.tab = tab(S8, 'WHEN ASKING STOPPED WORKING'); s8.h = sign(S8, 'NO MORE<br>ASKING <em>NICELY</em>', 'left:190px;top:300px;width:700px;font-size:72px');
s8.e1 = sign(S8, '<div style="font:500 22px/1 DM;letter-spacing:.2em;margin-bottom:10px">NPR COUNT · VANDALIZED</div>36 STATES', 'left:190px;top:300px;width:700px;font-size:84px;padding:26px 38px');
s8.e2 = sign(S8, '<div style="font:500 22px/1 DM;letter-spacing:.2em;margin-bottom:10px">ONE WATCHDOG\'S COUNT · CANCELLED</div>100+ TOWNS', 'left:190px;top:560px;width:700px;font-size:84px;padding:26px 38px');
s8.list = D('left:190px;top:850px;width:700px;height:370px', '', S8); s8.stamps = ['ELM CITY', 'RIVER FALLS', 'OAK GROVE'].map(function (n, i) { var r = D('left:0;top:' + (i * 120) + 'px;width:700px;height:100px;padding:0 30px;display:flex;align-items:center;justify-content:space-between;font:500 28px/1 DM;letter-spacing:.1em', '<span>' + n + ' · CAMERA CONTRACT</span><span style="position:relative;color:' + RD + ';border:6px solid ' + RD + ';border-radius:8px;padding:6px 14px;font:400 36px/1 AB">ENDED</span>', s8.list, 'card'); r.lastChild.style.opacity = 0; return r; });
s8.ill = D('left:350px;top:1252px;font:500 20px/1 DM;letter-spacing:.14em;color:#fff;background:rgba(21,24,28,.85);padding:6px 10px;border-radius:6px', 'ILLUSTRATIVE TOWNS', S8); s8.tag = aitag(S8);
// ---------------- scene 9 ----------------
var S9 = scene(), s9 = {};
s9.tab = tab(S9, 'TWO STREETS, ONE POLE'); s9.a = sign(S9, 'EVERY STOLEN<br>CAR <em>FOUND</em>', 'left:190px;top:300px;width:700px;font-size:72px'); s9.b = sign(S9, 'ONE DAY,<br>NO <em>DIARY</em>', 'left:190px;top:600px;width:700px;font-size:72px');
s9.dial = D('left:290px;top:920px;width:500px;height:300px', '<svg viewBox="0 0 500 300" width="500" height="300"><path d="M30 270 A220 220 0 0 1 470 270" fill="none" stroke="' + WH + '" stroke-width="16" stroke-linecap="round" opacity=".85"/><g id="s9n"><path d="M250 270 L250 80" stroke="' + AM + '" stroke-width="14" stroke-linecap="round"/><circle cx="250" cy="270" r="20" fill="' + AM + '"/></g></svg>', S9); s9.needle = s9.dial.querySelector('#s9n'); s9.tag = aitag(S9);
// ---------------- scene 10 ----------------
var S10 = scene(), s10 = {};
s10.q = sign(S10, 'WHICH<br><em>SIDE?</em>', 'left:190px;top:300px;width:700px;font-size:96px');
s10.ring = D('left:410px;top:660px;width:260px;height:260px;border-radius:50%;background:url(profile.jpg) center/cover;border:10px solid ' + WH + ';box-shadow:0 0 0 8px ' + GR + ',0 18px 40px rgba(0,0,0,.55)', '', S10);
s10.hd = sign(S10, '@sandesh.explains', 'left:190px;top:960px;width:700px;text-align:center;font:400 40px/1 AB;padding:20px 0;white-space:nowrap', 'tab'); s10.fo = D('left:385px;top:1090px;font:400 64px/1 AB;color:' + AS + ';background:' + AM + ';padding:16px 36px;border-radius:14px;box-shadow:0 8px 0 #b27d00', 'FOLLOW', S10);
var cap = D('', '', st); cap.id = 'cap';
// photo plan
var PH = [['road_car', null], ['pole_cam', null], ['pass_pan', null], ['night_city', null], ['lone_sedan', null], ['desk_glow', null], ['audit_sheet', null], ['pole_cam', 'town_hall'], ['cul_cam', 'cul_nocam'], ['pole_cam', null]];
var MOVES = [function (u) { return [lerp(-.2, .25, u), .05, lerp(1.04, 1.22, u)]; }, function (u) { return [lerp(.3, -.2, u), lerp(.1, 0, u), lerp(1.05, 1.28, u)]; }, function (u) { return [lerp(-.7, .7, u), 0, 1.15]; }, function (u) { return [0, lerp(.5, -.5, u), lerp(1.1, 1.2, u)]; }, function (u) { return [lerp(.4, -.4, u), 0, lerp(1.1, 1.2, u)]; }, function (u) { return [lerp(-.3, .3, u), .1, lerp(1.1, 1.18, u)]; }, function (u) { return [lerp(.5, -.5, u), 0, 1.12]; }, function (u) { return [lerp(-.2, .3, u), lerp(.2, -.1, u), lerp(1.1, 1.24, u)]; }, function (u) { return [lerp(.2, -.2, u), 0, lerp(1.08, 1.2, u)]; }, function (u) { return [0, lerp(-.5, .6, u), lerp(1.12, 1.36, u)]; }];
var MIXAT = { 7: function () { return W(7, 13); }, 8: function () { return W(8, 7); } };
// captions: pages of <=3 lines, <=30 chars/line
var PAGES = WORDS.map(function (ws) { var pages = [], cur = [], lines = 1, len = 0; ws.forEach(function (w, i) { var l = w[2].length + (len ? 1 : 0); if (len + l > 30) { lines++; len = w[2].length; } else len += l; if (lines > 3) { pages.push(cur); cur = []; lines = 1; len = w[2].length; } cur.push(i); }); if (cur.length) pages.push(cur); return pages; });
function drawCap(bi, t) { var ws = WORDS[bi], n = 0; ws.forEach(function (w) { if (t >= w[0] - 0.02) n++; }); if (!n) n = 1; var last = n - 1, page = PAGES[bi].filter(function (p) { return p.indexOf(last) >= 0; })[0] || [last], out = [], len = 0, line = [];
  page.forEach(function (i) { if (i > last) return; var w = ws[i][2], l = w.length + (len ? 1 : 0); if (len + l > 30 && line.length) { out.push(line.join(' ')); line = []; len = 0; } line.push(i === last ? '<b>' + w + '</b>' : w); len += (len ? 1 : 0) + w.length; }); if (line.length) out.push(line.join(' ')); cap.innerHTML = out.join('<br>'); }
var imgs = {}; var ids = {}; PH.forEach(function (p) { ids[p[0]] = 1; if (p[1]) ids[p[1]] = 1; });
var ready = window.GLP.load(Object.keys(ids)).then(function () { window.__ready = true; window.__seek(0); });
window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001); var bi = 0; for (var i = 0; i < BEATS.length; i++) if (t >= BEATS[i][0]) bi = i;
  var b = BEATS[bi], lt = t - b[0], len = b[1] - b[0], u = lt / len;
  scenes.forEach(function (s, i) { s.style.display = i === bi ? 'block' : 'none'; });
  road.style.backgroundPositionY = (t * 70) + 'px'; var eb = tabs[bi]; if (eb) { var q = bounce(seg(lt, 0, 0.35)); eb.style.transform = 'translateX(' + ((1 - q) * -120) + 'px)'; eb.style.opacity = seg(lt, 0, 0.1); }
  var flash = 0, whip = 0, mix = 0, pa = PH[bi][0], pb = PH[bi][1], camA = MOVES[bi](u), camB = null, wd = [1, 0];
  if (pb) { var at = MIXAT[bi](); mix = seg(lt, at - 0.2, at + 0.35); camB = MOVES[bi](u); }
  // scene transition whip into the next scene's photo
  if (bi < BEATS.length - 1 && t > b[1] - 0.26) { var k = (t - (b[1] - 0.26)) / 0.26; var nxt = PH[bi + 1][0]; if (!pb) { pb = nxt; camB = MOVES[bi + 1](0); mix = sm(k * 1.2 - 0.1); } whip = Math.sin(k * Math.PI) * 0.05; wd = [0, 1]; }
  var T = { 0: u0, 1: u1, 2: u2, 3: u3, 4: u4, 5: u5, 6: u6, 7: u7, 8: u8, 9: u9 }[bi]; flash = T(lt, len) || 0;
  window.GLP.draw({ a: pa, b: pb, mix: mix, camA: camA, camB: camB, whip: whip, wdir: wd, par: 0.06, dim: 1 - 0.05 * seg(lt, len - 0.3, len), flash: flash, t: t });
  drawCap(bi, t); return Promise.resolve();
};
function click(lt, at) { var d = lt - at; return d < 0 || d > 0.35 ? 0 : 0.22 * Math.exp(-d * 14); }
function u0(t, len) { var a = W(0, 6), b = W(0, 8); show(s1.h1, t < a); pin(s1.h1, t, 0, { d: 0.01, s0: 1 }); s1.h1.style.opacity = t < a ? 1 : 0; pin(s1.h2, t, a, { d: 0.3, s0: 1.3 }); s1.plate.style.transform = 'scale(' + (1 + 0.12 * Math.exp(-Math.max(0, t - b) * 5) * (t > b ? 1 : 0)) + ')';
  var rr = t > b ? (t - b) : -1; s1.ring.style.opacity = rr >= 0 && rr < 0.6 ? 1 - rr / 0.6 : 0; var sc = 1 + (rr > 0 ? rr * 5 : 0); s1.ring.style.left = (565 - 30) + 'px'; s1.ring.style.top = (930 - 30) + 'px'; s1.ring.style.transform = 'scale(' + sc + ')'; return click(t, b); }
function u1(t, len) { var a = W(1, 13); pin(s2.h1, t, 0.05, { d: 0.3, s0: 1 }); s2.h1.style.opacity = t < a ? 1 : 0; pin(s2.h2, t, a, { d: 0.3, s0: 1.3 }); var d = W(1, 9); var p = bounce(seg(t, d, d + 0.4)); s2.diamond.style.opacity = s2.dtxt.style.opacity = t < d ? 0 : 1; s2.diamond.style.transform = 'rotate(45deg) scale(' + (0.4 + 0.6 * p) + ')'; s2.dtxt.style.transform = 'scale(' + (0.4 + 0.6 * p) + ')'; return 0; }
function u2(t, len) { var cs = [W(2, 5), W(2, 6), W(2, 7)], pop = W(2, 4); pin(s3.h, t, 0.05, { d: 0.3, s0: 1 }); pin(s3.plate, t, pop, { d: 0.4, y: 120, s0: 0.8 });
  s3.chars.forEach(function (sp, i) { if (sp.textContent === '·') return; var at = pop + 0.25 + i * 0.07; sp.style.borderColor = t >= at ? AM : 'transparent'; });
  var ds = [W(2, 12), W(2, 14), W(2, 17)]; [s3.c1, s3.c2, s3.c3].forEach(function (c, i) { pin(c, t, ds[i], { d: 0.35, y: -140, s0: 0.5 }); }); return Math.max(click(t, ds[0]), click(t, ds[1]), click(t, ds[2])); }
function u3(t, len) { pin(s4.h, t, 0.05, { d: 0.3, s0: 1 }); var dAt = W(3, 11); s4.h.style.opacity = t < dAt - 0.2 ? 1 : 0; s4.dots.forEach(function (d) { var at = +d.dataset.at, p = bounce(seg(t, at, at + 0.3)); d.style.opacity = t < at ? 0 : 1; d.style.transform = 'scale(' + (p) + ')'; });
  var f = W(3, 9); s4.flash.style.opacity = t >= f && t < f + 0.3 ? 1 - (t - f) / 0.3 : 0; var dp = bounce(seg(t, dAt, dAt + 0.45)); s4.diary.style.opacity = t < dAt ? 0 : 1; s4.diary.style.transform = 'translateY(' + ((1 - dp) * 160) + 'px) rotate(' + (-1.5 + 1.5 * dp) + 'deg)';
  s4.lines.forEach(function (l, i) { var at = W(3, 12) + i * 0.22; l.style.opacity = seg(t, at, at + 0.2); }); s4.dots.forEach(function (d) { if (t > dAt) d.style.opacity = 0.35; }); return click(t, f); }
function u4(t, len) { pin(s5.h, t, 0.05, { d: 0.3, s0: 1 }); s5.h.style.opacity = t < W(4, 11) ? 1 : 0; var a1 = W(4, 5), a2 = W(4, 8); pin(s5.c1, t, 0.4, { d: 0.4, x: -400, s0: 1 }); pin(s5.c2, t, a1 + 0.2, { d: 0.4, x: 400, s0: 1 }); pin(s5.st1, t, a1, { d: 0.3, s0: 2, rot: -8 }); pin(s5.st2, t, a2, { d: 0.3, s0: 2, rot: -6 }); pin(s5.h2, t, W(4, 11), { d: 0.35, y: 60, s0: 0.8 }); return Math.max(click(t, a1), click(t, a2)); }
function u5(t, len) { var ty = W(5, 13), te = W(5, 16), sb = W(5, 18), sw = W(5, 19); s6.h1.style.opacity = t < sw - 0.05 ? 1 : 0; pin(s6.h1, t, 0.05, { d: 0.3, s0: 1 }); pin(s6.h2, t, sw, { d: 0.3, s0: 1.3 }); pin(s6.box, t, W(5, 10), { d: 0.4, y: 100, s0: 0.9 }); pin(s6.btn, t, W(5, 10) + 0.12, { d: 0.4, y: 100, s0: 0.9 });
  var txt = 'ABC·1234', n = Math.floor(clamp((t - ty) / (te - ty + 0.5), 0, 1) * txt.length + 0.0001); s6.txt.innerHTML = txt.slice(0, n) + '<span style="color:' + AM + ';opacity:' + (Math.floor(t * 3) % 2 ? 0.2 : 1) + '">▌</span>'; s6.btn.style.transform = t > sb && t < sb + 0.18 ? 'translateY(8px)' : 'none'; s6.fill.style.width = (seg(t, sb, sb + 0.9) * 100) + '%'; show(s6.note, t > W(5, 10)); return click(t, sb); }
function u6(t, len) { pin(s7.h, t, 0.05, { d: 0.3, s0: 1 }); pin(s7.sheet, t, 0.15, { d: 0.45, y: 160, s0: 0.95 }); var sa = W(6, 2), a = W(6, 9), c = W(6, 16); pin(s7.stamp, t, sa, { d: 0.25, s0: 2.4, rot: -9 }); s7.nameBar.style.transform = 'scaleX(' + seg(t, a, a + 0.45) + ')'; s7.reasonBar.style.transform = 'scaleX(' + seg(t, c, c + 0.45) + ')'; s7.nameBar.style.opacity = s7.reasonBar.style.opacity = t < a ? 0 : 1; return click(t, sa); }
function u7(t, len) { var a = W(7, 11), b = W(7, 20); pin(s8.h, t, 0.05, { d: 0.3, s0: 1 }); s8.h.style.opacity = t < a ? 1 : 0; pin(s8.e1, t, a, { d: 0.4, x: -500, s0: 1 }); pin(s8.e2, t, b, { d: 0.4, x: 500, s0: 1 }); s8.stamps.forEach(function (r, i) { var at = W(7, 15) + i * 0.7; pin(r, t, 0.2 + i * 0.12, { d: 0.35, y: 80, s0: 0.95 }); r.style.opacity = t < 0.2 + i * 0.12 ? 0 : 1; var e = r.lastChild; e.style.opacity = t >= at ? 1 : 0; e.style.transform = 'rotate(-6deg) scale(' + (t >= at && t < at + 0.25 ? 2 - (t - at) * 4 : 1) + ')'; }); s8.e1.style.opacity = t < a ? 0 : 1; s8.e2.style.opacity = t < b ? 0 : 1; s8.list.style.opacity = t > W(7, 13) ? 1 : 0; s8.ill.style.opacity = t > W(7, 13) ? 1 : 0; return 0; }
function u8(t, len) { var a = W(8, 7), b = W(8, 15); pin(s9.a, t, 0.1, { d: 0.35, x: -500, s0: 1 }); pin(s9.b, t, a, { d: 0.35, x: 500, s0: 1 }); var p = seg(t, b, b + 1.1), ang = t < b ? -50 : -50 * (1 - sm(p)) + Math.sin((t - b) * 7) * 12 * Math.exp(-(t - b) * 2.5); s9.needle.setAttribute('transform', 'rotate(' + ang + ' 250 270)'); s9.dial.style.opacity = t < W(8, 5) ? 0 : 1; return 0; }
function u9(t, len) { pin(s10.q, t, 0.25, { d: 0.35, y: -60, s0: 0.9 }); pin(s10.ring, t, W(9, 6), { d: 0.4, x: -200, s0: 0.7 }); pin(s10.hd, t, W(9, 9) - 0.1, { d: 0.35, x: 200, s0: 0.8 }); pin(s10.fo, t, W(9, 10), { d: 0.35, y: 60, s0: 0.6 }); s10.fo.style.transform += ' scale(' + (1 + 0.05 * Math.sin(t * 6)) + ')'; return click(t, 0.0); }
})();
