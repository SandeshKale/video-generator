(function () {
'use strict';
var BL = '#2b3bff', CO = '#ff5a36', YE = '#ffd23f', IK = '#14123a', CR = '#f6efe2', FPS = 24;
var st = document.getElementById('st');
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
function seg(t, a, b) { return sm((t - a) / (b - a)); }
function bounce(x) { x = clamp(x, 0, 1); var s = 1.70158 * 1.4; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); }   // back-out
function D(css, html, par, tag) { var e = document.createElement(tag || 'div'); e.style.cssText = 'position:absolute;' + (css || ''); if (html != null) e.innerHTML = html; (par || st).appendChild(e); return e; }
function set(e, x, y, rot, sc, op) { e.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (rot || 0) + 'deg) scale(' + (sc == null ? 1 : sc) + ')'; if (op != null) e.style.opacity = op; }
function seeded(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }

// ---------------- timeline (replace with timing.json-derived values once the voice-over exists) ----------------
var BEATS = window.BEATS || [[0, 4.6], [4.6, 9.6], [9.6, 16], [16, 20.5], [20.5, 28], [28, 34], [34, 41], [41, 48], [48, 58], [58, 68]];
var CAPS = window.CAPS || [
  ['This robot cage fight', 'went viral.', 'But no AI', 'was fighting.'], ['A content creator', 'stepped into a cage', 'in San Francisco,', 'and fought three humanoids.'],
  ['A small Unitree G1 first.', 'Then two modified T800s,', 'kicks up to 850 pounds,', 'the company says.'], ['Robots versus humans, right?', "Here's the twist."],
  ['Every robot had a human pilot,', 'driving it live with VR gear', 'or a gamepad,', 'its partner says.'], ['The AI?', 'It only keeps the robot', 'upright.'],
  ['Balance is the hard part.', 'The fighting?', 'A video game with a body.'], ['Its pilots even qualified', 'in a simulator.', '3,670 matches.'],
  ['8 million views later,', 'California stepped in.', 'A cease-and-desist,', '12 days after the fight.'], ['So is it a robot fight,', 'or a video game', 'with a body?', 'Tell me below.']];
CAPS = CAPS.map(function (ls) { var out = [], cur = ''; ls.join(' ').split(' ').forEach(function (w) { if ((cur + ' ' + w).trim().length > 34) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); out.push(cur); return out; });
var DUR = BEATS[BEATS.length - 1][1];
window.__reelDurationSec = DUR;

// ---------------- persistent layers ----------------
var ht1 = D('', null, st); ht1.className = 'ht1 mx'; var ht2 = D('', null, st); ht2.className = 'ht2 mx';
var grain = D('position:absolute;inset:0;opacity:.07;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%272%27 seed=%273%27/></filter><rect width=%27200%27 height=%27200%27 filter=%27url(%23n)%27/></svg>")', null, st);
var scenes = [];
function scene() { var s = D('left:0;top:0;width:1080px;height:1920px', null, st); s.className = 'sc'; scenes.push(s); return s; }
// video helper
var vids = [];
function V(par, src, w, css) { var v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.playsInline = true; v.src = 'clips/' + src + '.webm'; v.style.cssText = 'width:' + w + 'px;height:' + w + 'px;' + (css || ''); par.appendChild(v); var o = { el: v, frames: 0, ready: false }; v.addEventListener('loadedmetadata', function () { o.frames = Math.round(v.duration * FPS); o.ready = true; }); vids.push(o); return o; }
function seekV(o, tc, loop) { var n = Math.max(1, o.frames || 1), f = Math.floor(tc * FPS); f = loop ? ((f % n) + n) % n : clamp(f, 0, n - 1); if (o.last === f) return Promise.resolve(); o.last = f; return new Promise(function (res) { var done = false; function fin() { if (done) return; done = true; o.el.removeEventListener('seeked', fin); res(); } o.el.addEventListener('seeked', fin); o.el.currentTime = (f + 0.5) / FPS; setTimeout(fin, 400); }); }

// ---------------- reusable bits ----------------
function eyebrow(par, txt) { var e = D('', txt, par); e.className = 'eb'; return e; }
function ropes(par, y) { var g = D('', null, par); [[0, BL, 12], [-52, CO, 12], [-104, IK, 14]].forEach(function (r) { D('position:absolute;left:-20px;right:-20px;top:' + (y + r[0]) + 'px;height:' + r[2] + 'px;background:' + r[1], null, g).className = 'mx'; }); return g; }
function stamp(par, txt, css) { var e = D(css, txt, par); e.className = 'stamp'; return e; }
function stub(par, txt, css) { var e = D(css, txt, par); e.className = 'stub'; return e; }
function burst(par, css, col) { return D(css, '<svg viewBox="0 0 100 100" width="100%" height="100%"><polygon fill="' + (col || YE) + '" points="50,2 58,30 86,14 70,40 98,50 70,60 86,86 58,70 50,98 42,70 14,86 30,60 2,50 30,40 14,14 42,30"/></svg>', par); }
function wobble(t, k) { return Math.sin(t * 7 + k) * 1.6; }

// ---------------- scene 1: hook ----------------
var S1 = scene(), s1 = {};
s1.eb = eyebrow(S1, '// 1 HUMAN, 3 ROBOTS');
s1.l1 = D('left:130px;top:250px;color:' + BL, 'No AI was', S1); s1.l1.className = 'big'; s1.l2 = D('left:130px;top:392px;color:' + CO, 'fighting.', S1); s1.l2.className = 'big';
s1.rope = ropes(S1, 1160);
s1.hu = V(S1, 'human_idle', 760, 'left:-70px;top:470px'); s1.ro = V(S1, 'robotb_idle', 760, 'left:390px;top:480px;transform:scaleX(-1)');
s1.burst = burst(S1, 'left:300px;top:740px;width:480px;height:480px'); s1.vs = D('left:430px;top:910px;font:800 110px/1 BC;color:' + IK + ';border:10px solid ' + IK + ';padding:4px 22px;', 'VS', S1);
s1.h0 = D('left:130px;top:250px;color:' + IK, 'ROBOT CAGE FIGHT<br><span style="color:' + CO + '">WENT VIRAL.</span>', S1); s1.h0.className = 'big'; s1.h0.style.fontSize = '110px'; s1.h0.style.lineHeight = '1.0';
s1.st1 = stub(S1, 'SF · SEPT 18', 'left:150px;top:1150px'); s1.st2 = stub(S1, 'ILLUSTRATION · NOT FOOTAGE', 'left:150px;top:1215px;font-size:24px');

// ---------------- scene 2: three robots ----------------
var S2 = scene(), s2 = {};
s2.eb = eyebrow(S2, '// THREE ROBOTS, ONE CAGE'); s2.rope = ropes(S2, 1180);
s2.h = V(S2, 'human_punch', 700, 'left:-80px;top:500px'); s2.r1 = V(S2, 'robot_idle', 560, 'left:300px;top:600px;transform:scaleX(-1)'); s2.r2 = V(S2, 'robotb_idle', 520, 'left:480px;top:630px;transform:scaleX(-1)'); s2.r3 = V(S2, 'robot_idle', 480, 'left:640px;top:660px;transform:scaleX(-1)');
s2.n = D('left:130px;top:250px;font:400 400px/.9 An;color:' + BL, '0', S2); s2.nl = D('left:420px;top:380px;font:800 62px/1 BC;color:' + CO + ';letter-spacing:.06em', 'ROBOTS', S2); s2.nl2 = D('left:420px;top:450px;font:800 62px/1 BC;color:' + BL + ';letter-spacing:.06em', 'VS 1 HUMAN', S2);
s2.stub = stub(S2, 'SAN FRANCISCO · SEPT 18', 'left:150px;top:1200px;transform:rotate(-2deg)');

// ---------------- scene 3: 850 lb ----------------
var S3 = scene(), s3 = {};
s3.eb = eyebrow(S3, '// A KICK, ON PAPER'); s3.rope = ropes(S3, 1180);
s3.g1 = V(S3, 'robotb_idle', 340, 'left:30px;top:850px'); s3.t1 = V(S3, 'robot_punch', 640, 'left:230px;top:560px;transform:scaleX(-1)'); s3.t2 = V(S3, 'robot_idle', 640, 'left:520px;top:560px;transform:scaleX(-1)');
s3.lab1 = D('left:100px;top:1150px;font:800 36px BC;color:' + IK, 'UNITREE G1', S3); s3.lab2 = D('left:430px;top:1170px;font:800 36px BC;color:' + IK, 'T800 · MODIFIED', S3);
s3.gauge = D('left:140px;top:200px;width:800px;height:480px', '', S3);
s3.gauge.innerHTML = '<svg viewBox="0 0 800 480" width="800" height="480"><path d="M60 420 A340 340 0 0 1 740 420" fill="none" stroke="' + IK + '" stroke-width="20"/><path d="M200 420 A200 200 0 0 1 600 420" fill="none" stroke="' + CO + '" stroke-width="20" opacity=".5"/><g id="g3n"><path d="M400 420 L400 110" stroke="' + BL + '" stroke-width="16" stroke-linecap="round"/><circle cx="400" cy="420" r="26" fill="' + BL + '"/></g></svg>';
s3.n = D('left:200px;top:330px;font:400 200px/1 An;color:' + BL, '0', S3); s3.u = D('left:560px;top:410px;font:800 66px BC;color:' + CO + ';letter-spacing:.06em', 'LB', S3); s3.cl = stamp(S3, 'COMPANY CLAIM', 'left:520px;top:590px;font-size:46px;transform:rotate(-6deg)');

// ---------------- scene 4: the twist (poster tear) ----------------
var S4 = scene(), s4 = {};
s4.eb = eyebrow(S4, '// WHO IS REALLY FIGHTING');
s4.back = D('left:90px;top:300px;width:900px;height:900px;background:' + IK + ';border-radius:20px', '', S4);
s4.bk = D('left:90px;top:300px;width:900px;height:900px;overflow:hidden;border-radius:20px', '', S4);
s4.hu = V(s4.bk, 'human_work', 760, 'left:-60px;top:190px'); s4.ro = V(s4.bk, 'robot_idle', 760, 'left:230px;top:200px;transform:scaleX(-1)');
s4.txt = D('left:110px;top:330px;font:400 120px/.95 An;color:' + CR, 'HERE\'S THE<br><span style="color:' + YE + '">TWIST.</span>', S4);
s4.pa = D('left:90px;top:300px;width:900px;height:900px;background:' + CR + ';border:6px solid ' + IK + ';border-radius:20px;overflow:hidden;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)', '<div style="position:absolute;left:60px;top:70px;font:400 170px/.95 An;color:' + BL + '">ROBOTS<br><span style="color:' + CO + '">vs</span> HUMANS</div><div style="position:absolute;left:60px;right:60px;bottom:50px;height:14px;background:' + CO + '"></div><div style="position:absolute;left:60px;right:60px;bottom:90px;height:14px;background:' + BL + '"></div><div style="position:absolute;left:60px;bottom:140px;font:800 54px BC;color:' + IK + ';letter-spacing:.08em">THE FIRST CAGE FIGHT*</div>', S4);

// ---------------- scene 5: pilot mirror ----------------
var S5 = scene(), s5 = {};
s5.eb = eyebrow(S5, '// PILOTED, NOT AUTONOMOUS');
s5.pil = V(S5, 'human_punch', 640, 'left:20px;top:200px'); s5.hmd = D('left:312px;top:262px;width:120px;height:56px;background:' + IK + ';border-radius:16px;border:5px solid ' + BL, '', S5);
s5.rob = V(S5, 'robot_punch', 720, 'left:340px;top:640px;transform:scaleX(-1)');
s5.str = D('left:0;top:0;width:1080px;height:1920px;pointer-events:none', '', S5);
s5.str.innerHTML = '<svg width=1080 height=1920 fill=none stroke="' + IK + '" stroke-width=5 stroke-dasharray="4 14" stroke-linecap=round><path id="st1"/><path id="st2"/><path id="st3"/></svg>';
s5.pl = stub(S5, 'PILOT · VR + GAMEPAD', 'left:560px;top:330px;transform:rotate(3deg)'); s5.bt = [];
['A', 'B', 'X', 'Y'].forEach(function (b, i) { var e = D('left:' + (100 + i * 100) + 'px;top:1210px;width:84px;height:84px;border-radius:50%;border:6px solid ' + BL + ';font:800 46px/72px BC;text-align:center;color:' + BL, b, S5); s5.bt.push(e); });
s5.sig = D('left:480px;top:1215px;font:800 34px BC;color:' + IK + ';letter-spacing:.06em', 'SOURCE: ITS PARTNER', S5);

// ---------------- scene 6: balance dial ----------------
var S6 = scene(), s6 = {};
s6.eb = eyebrow(S6, "// THE AI'S ONLY JOB"); s6.rope = ropes(S6, 1190);
s6.h = V(S6, 'human_punch', 640, 'left:-90px;top:600px'); s6.r = V(S6, 'robot_idle', 700, 'left:300px;top:560px;transform:scaleX(-1)');
s6.dial = D('left:190px;top:200px;width:700px;height:420px', '<svg viewBox="0 0 700 420" width="700" height="420"><path d="M40 370 A310 310 0 0 1 660 370" fill="none" stroke="' + IK + '" stroke-width="22"/><path d="M230 370 A120 120 0 0 1 470 370" fill="none" stroke="' + CO + '" stroke-width="22"/><g id="nd"><path d="M350 370 L350 90" stroke="' + BL + '" stroke-width="16" stroke-linecap="round"/><circle cx="350" cy="370" r="24" fill="' + BL + '"/></g></svg>', S6);
s6.lab = D('left:0;right:0;top:548px;text-align:center;font:800 54px BC;color:' + IK + ';letter-spacing:.08em', 'AI = BALANCE ONLY', S6);

// ---------------- scene 7: gamepad = body ----------------
var S7 = scene(), s7 = {};
s7.eb = eyebrow(S7, '// BALANCE IS THE HARD PART');
s7.pad = D('left:80px;top:330px;width:420px;height:300px', '<svg viewBox="0 0 420 300" width="420" height="300"><g fill="none" stroke="' + BL + '" stroke-width="12" stroke-linejoin="round"><path d="M70 90 Q60 250 120 250 Q160 250 180 200 H240 Q260 250 300 250 Q360 250 350 90 Q330 60 290 70 H130 Q90 60 70 90Z" fill="' + CR + '"/><circle cx="130" cy="130" r="26"/><circle cx="270" cy="170" r="22"/><circle cx="310" cy="120" r="14" fill="' + CO + '" stroke="' + CO + '"/><circle cx="280" cy="100" r="14" fill="' + YE + '"/></g></svg>', S7);
s7.bh = D('left:100px;top:330px;font:400 150px/.95 An;color:' + BL, 'BALANCE<br><span style="color:' + CO + '">IS THE<br>HARD PART</span>', S7); s7.eq = D('left:470px;top:380px;font:400 200px/1 An;color:' + CO, '=', S7);
s7.bd = V(S7, 'robot_dance', 640, 'left:440px;top:200px'); s7.cbl = D('left:300px;top:740px;width:520px;height:120px', '<svg viewBox="0 0 520 120" width=520 height=120 fill=none stroke="' + IK + '" stroke-width=8 stroke-dasharray="3 14" stroke-linecap=round><path d="M10 20 C150 120 300 120 330 40"/></svg>', S7);
s7.t1 = D('left:120px;top:900px;font:400 100px/1 An;color:' + BL, '<span id="l1">THE FIGHTING:</span><br><span id="l2" style="color:' + CO + '">A VIDEO GAME</span><br><span id="l3">WITH A BODY.</span>', S7);

// ---------------- scene 8: 3,670 simulator matches ----------------
var S8 = scene(), s8 = {};
s8.eb = eyebrow(S8, '// QUALIFIED IN A SIMULATOR');
s8.cv = D('left:90px;top:540px;width:900px;height:640px;background:' + CR + ';border:6px solid ' + IK + ';border-radius:16px;box-shadow:10px 10px 0 ' + BL, '', S8); var cvEl = document.createElement('canvas'); cvEl.width = 840; cvEl.height = 580; cvEl.style.cssText = 'position:absolute;left:30px;top:30px'; s8.cv.appendChild(cvEl); s8.c2 = cvEl.getContext('2d');
s8.n = D('left:100px;top:230px;font:400 240px/1 An;color:' + BL, '0', S8); s8.nl = D('left:100px;top:478px;font:800 52px BC;color:' + CO + ';letter-spacing:.08em', 'SIMULATOR MATCHES', S8);
s8.tk = stub(S8, 'WINNERS → REAL ROBOTS · REK2 · AUGUST', 'left:150px;top:1190px;font-size:30px;transform:rotate(-2deg)');

// ---------------- scene 9: letter + views ----------------
var S9 = scene(), s9 = {};
s9.eb = eyebrow(S9, '// 12 DAYS TO A CEASE-AND-DESIST');
s9.let = D('left:190px;top:280px;width:700px;height:760px;background:#fbf4e3;border:5px solid ' + IK + ';box-shadow:14px 14px 0 ' + BL + ';padding:50px 48px;color:' + IK, '<div style="font:800 38px BC;letter-spacing:.1em">STATE ATHLETIC COMMISSION</div><div style="height:6px;background:' + IK + ';margin:14px 0 22px"></div><div id="lt" style="font:600 28px/1.5 IN"></div>', S9);
s9.lt = s9.let.querySelector('#lt'); s9.dates = D('position:absolute;left:48px;bottom:40px;font:800 36px BC;letter-spacing:.08em', 'SEPT 18 → SEPT 30 · 12 DAYS', s9.let);
s9.stp = stamp(S9, 'APPROVAL<br>REQUIRED', 'left:300px;top:640px;font-size:96px;text-align:center');
s9.yt = D('left:190px;top:330px;width:700px;height:620px;background:' + CO + ';border:6px solid ' + IK + ';border-radius:48px;box-shadow:14px 14px 0 ' + IK, '<svg viewBox="0 0 100 100" width="100%" height="100%"><polygon points="38,28 38,72 76,50" fill="' + CR + '"/></svg>', S9); s9.d12 = stamp(S9, '12 DAYS LATER', 'left:520px;top:960px;font-size:56px;transform:rotate(5deg)');
s9.vn = D('left:110px;top:1090px;font:400 190px/1 An;color:' + BL, '0M', S9); s9.vl = D('left:640px;top:1180px;font:800 54px BC;color:' + CO + ';letter-spacing:.06em', 'VIEWS', S9); s9.vs = stub(S9, 'YOUTUBE · AS OF OCT 7', 'left:610px;top:1110px;font-size:26px;transform:rotate(3deg)');
var LTXT = 'Re: unsanctioned human vs. humanoid cage match. Barred from "holding, promoting, or advertising any boxing or mixed martial arts contest match or exhibition" involving humans without prior approval.';

// ---------------- scene 10: CTA ----------------
var S10 = scene(), s10 = {};
s10.rope = ropes(S10, 1160); s10.rd = V(S10, 'robot_death', 760, 'left:300px;top:500px;transform:scaleX(-1)'); s10.hu = V(S10, 'human_idle', 720, 'left:-70px;top:500px');
s10.q = D('left:110px;top:230px;font:400 124px/.92 An;color:' + BL, 'ROBOT FIGHT<br><span style="color:' + CO + '">OR A VIDEO GAME</span><br>WITH A BODY?', S10);
s10.ring = D('z-index:6;left:130px;top:1040px;width:220px;height:220px;border-radius:50%;background:url(profile.jpg) center/cover;border:10px solid ' + CR + ';box-shadow:0 0 0 6px ' + IK + ',10px 10px 0 6px ' + BL, '', S10);
s10.hd = D('z-index:6;left:380px;top:1050px;font:800 56px BC;color:' + IK + ';background:' + CR + ';padding:2px 14px;border:4px solid ' + IK + ';letter-spacing:.04em', '@sandesh.explains', S10); s10.fo = D('z-index:6;left:380px;top:1140px;font:800 70px/1 BC;color:' + CR + ';background:' + CO + ';padding:6px 26px;box-shadow:8px 8px 0 ' + IK, 'FOLLOW', S10);
// ---------------- avatar corner + captions + wipe ----------------
var av = D('position:absolute;width:250px;height:250px;border-radius:44% 56% 52% 48%;background:url(avatar.jpg) 50% 14%/190% auto;border:10px solid ' + CR + ';box-shadow:0 0 0 6px ' + IK + ',12px 12px 0 6px ' + BL, '', st);
var avh = stub(st, '@sandesh.explains', 'font-size:28px;transform:none'); 
var cap = D('', '', st); cap.className = 'cap'; var wipe = D('position:absolute;inset:0;background:' + BL + ';opacity:0;mix-blend-mode:multiply', '', st); var wipe2 = D('position:absolute;inset:0;background:' + CO + ';opacity:0;mix-blend-mode:multiply', '', st);

// ---------------- the pure function of t ----------------
var UPD = [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10];
function W(bi, i) { return window.WORDS[bi][Math.min(i, window.WORDS[bi].length - 1)][0] - BEATS[bi][0]; }
function pin(el, t, at, o) { o = o || {}; var p = bounce(seg(t, at, at + (o.d || 0.35))); el.style.opacity = t < at ? 0 : 1; set(el, (o.x || 0) * (1 - p), (o.y || 0) * (1 - p), (o.r || 0) * (1 - p) + (o.rot || 0), (o.s0 == null ? 0.6 : o.s0) + (1 - (o.s0 == null ? 0.6 : o.s0)) * p); }
function pinV(o, t, at, x) { o.el.style.opacity = t < at ? 0 : 1; var p = bounce(seg(t, at, at + 0.45)); o.el.style.marginLeft = ((1 - p) * (x || 0)) + 'px'; }
function u1(t, T) { var n = W(0, 7), e = bounce(seg(t, 0, 0.3));
  set(s1.burst, 0, 0, t * 12, 0.9 + 0.1 * bounce(seg(t, 0, 0.5)), 1); set(s1.vs, 0, 0, -6, 0.9 + 0.1 * bounce(seg(t, 0, 0.5)), 1); s1.h0.style.opacity = t < n ? 1 : 0; set(s1.h0, 0, 0, -1, 1 + 0.05 * Math.sin(t * 6));
  var a1 = bounce(seg(t, n, n + 0.25)); s1.l1.style.opacity = t < n ? 0 : 1; set(s1.l1, 0, 0, -1.5, 1 + 0.25 * (1 - a1)); var a2 = bounce(seg(t, W(0, 10), W(0, 10) + 0.25)); s1.l2.style.opacity = t < W(0, 10) ? 0 : 1; set(s1.l2, 0, 0, 1, 1 + 0.25 * (1 - a2));
  var hit = Math.max(0, t - W(0, 3)); s1.hu.el.style.transform = 'translateX(' + (Math.sin(hit * 30) * 6 * Math.exp(-hit * 4)) + 'px)';
  return Promise.all([seekV(s1.hu, T, true), seekV(s1.ro, T, true)]); }
function u2(t, T) { var c = [W(1, 11), W(1, 12), W(1, 13)], k = (t >= c[0]) + (t >= c[1]) + (t >= c[2]); s2.n.textContent = String(k || 1); s2.nl.textContent = k ? 'ROBOTS' : 'HUMAN'; s2.nl2.textContent = k ? 'VS 1 HUMAN' : 'CONTENT CREATOR'; s2.nl2.style.fontSize = k ? '62px' : '40px';
  s2.rope.style.opacity = t < W(1, 6) ? 0 : 1; set(s2.stub, 0, 0, -2, 1, null); s2.stub.style.opacity = t < W(1, 9) ? 0 : 1; pin(s2.h.el, t, 0.05, { x: -500 }); s2.h.el.style.opacity = 1;
  [s2.r1, s2.r2, s2.r3].forEach(function (r, i) { var at = c[i], p = bounce(seg(t, at, at + 0.4)); r.el.style.opacity = t < at ? 0 : 1; r.el.style.marginLeft = ((1 - p) * 700) + 'px'; });
  s2.nl.style.opacity = s2.nl2.style.opacity = t < 0.3 ? 0 : 1;
  return Promise.all([seekV(s2.h, T, true), seekV(s2.r1, T, true), seekV(s2.r2, T + 0.3, true), seekV(s2.r3, T + 0.6, true)]); }
function u3(t, T) { var a = W(2, 13), b = W(2, 16) + 0.3, p = seg(t, a, b), v = Math.round(850 * p); s3.n.textContent = t < a ? '?' : String(v);
  var ang = -88 + 176 * ((t < a ? 0 : v) / 1000) + (t < a ? Math.sin(t * 5) * 2 : (p < 1 ? 0 : Math.sin((t - b) * 18) * 3 * Math.exp(-(t - b) * 2))); s3.gauge.querySelector('#g3n').setAttribute('transform', 'rotate(' + ang + ' 400 420)');
  pin(s3.gauge, t, 0.1, { y: -80 }); pin(s3.n, t, 0.2, { y: -60 }); pin(s3.u, t, 0.3, { y: -60 }); set(s3.cl, 0, 0, -6, 0.6 + 0.4 * bounce(seg(t, W(2, 18), W(2, 18) + 0.4)), seg(t, W(2, 18), W(2, 18) + 0.1));
  pinV(s3.g1, t, W(2, 2), -500); s3.lab1.style.opacity = t < W(2, 3) ? 0 : 1; pinV(s3.t1, t, W(2, 6), 700); pinV(s3.t2, t, W(2, 8) - 0.5, 700); s3.lab2.style.opacity = t < W(2, 8) ? 0 : 1;
  var kick = Math.max(0, t - W(2, 10)); return Promise.all([seekV(s3.g1, T, true), seekV(s3.t1, t < W(2, 10) ? T : kick, t < W(2, 10)), seekV(s3.t2, T + 0.4, true)]); }
function u4(t, T) { var a = W(3, 4), p = seg(t, a, a + 0.6); s4.pa.style.clipPath = 'polygon(0 0,' + (100 - 60 * p) + '% 0,' + (100 - 100 * p) + '% 100%,0 100%)'; s4.pa.style.transform = 'translate(' + (-90 * p) + 'px,' + (30 * p) + 'px) rotate(' + (-4 * p) + 'deg)'; s4.pa.style.opacity = 1 - 0.2 * p; s4.txt.style.opacity = seg(t, W(3, 5), W(3, 5) + 0.3); set(s4.txt, 0, 0, -2, 1 + 0.2 * (1 - bounce(seg(t, W(3, 5), W(3, 5) + 0.3))));
  return Promise.all([seekV(s4.hu, T, true), seekV(s4.ro, T, true)]); }
function u5(t, T) { var tc = T, rt = Math.max(0, tc - 0.3), live = W(4, 6), pa = W(4, 4);
  pinV(s5.rob, t, W(4, 1) - 0.2, 600); pinV(s5.pil, t, pa, -600); s5.hmd.style.opacity = t < W(4, 10) ? 0 : 1; set(s5.hmd, 0, 0, 0, 0.5 + 0.5 * bounce(seg(t, W(4, 10), W(4, 10) + 0.3)));
  s5.pl.style.opacity = t < W(4, 5) ? 0 : 1; s5.pl.textContent = t < W(4, 10) ? 'HUMAN PILOT' : 'PILOT · VR + GAMEPAD';
  s5.str.style.opacity = seg(t, live, live + 0.3);
  [['st1', 350, 600, 300, 860, 360, 940], ['st2', 640, 600, 760, 860, 720, 940], ['st3', 540, 420, 540, 700, 540, 900]].forEach(function (q) { var d = s5.str.querySelector('#' + q[0]); d.setAttribute('d', 'M' + q[1] + ' ' + q[2] + ' C ' + (q[1] - 90 + 20 * Math.sin(t * 5)) + ' ' + (q[2] + 120) + ' ' + (q[3] - 60) + ' ' + (q[4] - 60) + ' ' + q[5] + ' ' + q[6]); });
  var g0 = W(4, 14), cyc = ((t - g0) * 1.7) % 1, btn = Math.floor(cyc * 4); s5.bt.forEach(function (b, i) { var on = t >= g0 && i === btn && cyc < 0.6; b.style.opacity = t < g0 ? 0 : 1; b.style.background = on ? CO : 'transparent'; b.style.color = on ? CR : BL; b.style.borderColor = on ? CO : BL; });
  s5.sig.style.opacity = t < W(4, 16) ? 0 : 1;
  return Promise.all([seekV(s5.pil, tc, true), seekV(s5.rob, t < live ? 0 : rt, t >= live)]); }
function u6(t, T) { var hit = Math.max(0, t - 0.75), up = W(5, 7) - 0.1, wob = t < 0.75 ? 0 : Math.sin(hit * 14) * 34 * Math.exp(-hit * 1.6) * (t < up ? 1 : Math.max(0, 1 - (t - up) * 8));
  s6.dial.querySelector('#nd').setAttribute('transform', 'rotate(' + wob + ' 350 370)'); pin(s6.dial, t, 0.05, { y: -80 });
  s6.lab.textContent = t < W(5, 3) ? 'AI = ?' : 'AI = BALANCE ONLY'; s6.lab.style.color = t >= up + 0.3 ? BL : IK; s6.r.el.style.transform = 'scaleX(-1) rotate(' + (-wob * 0.12) + 'deg)';
  return Promise.all([seekV(s6.h, Math.max(0, (t - 0.6)) * 0.9, false), seekV(s6.r, T, true)]); }
function u7(t, T) { var f = W(6, 5), e = W(6, 8), b = W(6, 12) - 0.3; var shake = t < f ? Math.sin(t * 9) * 6 * (1 - seg(t, f - 0.3, f)) : 0;
  s7.bd.el.style.transform = 'rotate(' + shake + 'deg)'; s7.bd.el.style.transformOrigin = '50% 90%';
  s7.bh.style.opacity = t < f - 0.1 ? 1 : 0; s7.pad.style.opacity = t < f ? 0 : 1; s7.pad.style.marginLeft = ((1 - bounce(seg(t, f, f + 0.4))) * -500) + 'px'; s7.pad.style.transform = 'rotate(' + (Math.sin(t * 2.4) * 4) + 'deg)';
  s7.eq.style.opacity = t < e ? 0 : 1; set(s7.eq, 0, 0, Math.sin(t * 3) * 4, (0.5 + 0.5 * bounce(seg(t, e, e + 0.3))) * (1 + 0.06 * Math.sin(t * 5)));
  s7.cbl.style.opacity = seg(t, e, e + 0.3);
  var l1 = s7.t1.querySelector('#l1'), l2 = s7.t1.querySelector('#l2'), l3 = s7.t1.querySelector('#l3'); l1.style.opacity = t < W(6, 5) ? 0 : 1; l2.style.opacity = t < W(6, 8) ? 0 : 1; l3.style.opacity = t < W(6, 11) ? 0 : 1; s7.t1.style.opacity = 1;
  return seekV(s7.bd, T, true); }
function u8(t, T) { var a = W(7, 7), b = W(7, 12) + 0.3, p = seg(t, a, b), n = t < a ? 0 : Math.round(3670 * p); s8.n.textContent = n.toLocaleString('en-US'); pin(s8.cv, t, 0.15, { y: 80 }); pin(s8.nl, t, W(7, 3), { x: -300, s0: 1 }); s8.tk.style.opacity = t < W(7, 12) + 0.3 ? 0 : 1;
  var c = s8.c2; c.clearRect(0, 0, 840, 580); var cols = 70, sz = 12; for (var i = 0; i < 3670; i++) { var x = (i % cols) * sz, y = Math.floor(i / cols) * 11; var on = i < n; c.fillStyle = on ? (i % 7 === 0 ? CO : BL) : '#2b3bff22'; c.fillRect(x, y, sz - 2, 9); }
  return Promise.resolve(); }
function u9(t, T) { var vp = seg(t, W(8, 0), W(8, 2) + 0.4); s9.vn.textContent = (8.2 * vp).toFixed(1) + 'M'; set(s9.vn, 0, 0, 0, 1 + 0.03 * Math.sin(t * 6));
  var ls = W(8, 4); s9.yt.style.opacity = t < ls ? 1 : 0; set(s9.yt, 0, 0, Math.sin(t * 3) * 1.5, 1 + 0.03 * Math.sin(t * 8)); s9.let.style.opacity = t < ls ? 0 : 1; s9.let.style.marginLeft = ((1 - bounce(seg(t, ls, ls + 0.45))) * 800) + 'px';
  var k = Math.floor(seg(t, ls + 0.4, W(8, 8)) * LTXT.length); s9.lt.textContent = LTXT.slice(0, k);
  var sa = W(8, 8); set(s9.stp, 0, 0, -8, 0.5 + 0.5 * bounce(seg(t, sa, sa + 0.4)), seg(t, sa, sa + 0.1)); var d = W(8, 9); set(s9.d12, 0, 0, 5, 0.5 + 0.5 * bounce(seg(t, d, d + 0.4)), seg(t, d, d + 0.1)); return Promise.resolve(); }
function u10(t, T) { var q = s10.q; q.style.opacity = t < 0.1 ? 0 : 1; var r = W(9, 4), o = W(9, 6);
  q.innerHTML = 'ROBOT FIGHT' + (t >= o ? '<br><span style="color:' + CO + '">OR A VIDEO GAME</span><br>WITH A BODY?' : ''); set(q, 0, 0, 0, 1 + 0.04 * (1 - bounce(seg(t, 0.1, 0.4))));
  var rp = W(9, 13) - 0.1; pin(s10.ring, t, rp, { y: 120 }); s10.ring.style.transform += ' rotate(' + (-3 + Math.sin(t * 3) * 1.5) + 'deg)'; pin(s10.hd, t, W(9, 16) - 0.1, { x: 200 }); set(s10.fo, 0, 0, -2, (t < W(9, 16) ? 0 : 1) * (1 + 0.06 * Math.sin(t * 6))); s10.fo.style.opacity = t < W(9, 16) ? 0 : 1;
  var dead = Math.max(0, t - W(9, 8)); return Promise.all([seekV(s10.hu, T, true), seekV(s10.rd, Math.min(dead, 0.95), false)]); }
// avatar visibility per beat: [beat index, x, y, size, rot]
var AVB = { 0: [650, 930, 240, 3], 3: [730, 1000, 210, -3], 6: [700, 985, 200, 3] };
var OLD = [4.6, 5, 6.4, 4.5, 7.5, 6, 7, 7, 10, 10];

window.__seek = function (t) {
  t = clamp(t, 0, DUR - 0.001);
  var bi = 0; for (var i = 0; i < BEATS.length; i++) if (t >= BEATS[i][0]) bi = i;
  var b = BEATS[bi], lt = t - b[0], len = b[1] - b[0], ps = [];
  scenes.forEach(function (s, i) { s.style.display = i === bi ? 'block' : 'none'; });
  // two-ink print misregistration + halftone drift
  ht1.style.transform = 'translate(' + (Math.sin(t * 1.3) * 3) + 'px,' + (Math.cos(t * 1.1) * 3 + (t * 6) % 22) + 'px)'; ht2.style.transform = 'translate(' + (11 + Math.cos(t * 1.2) * 3) + 'px,' + (11 + Math.sin(t * 1.4) * 3 + (t * 4) % 22) + 'px)';
  // eyebrow slam-in
  var eb = scenes[bi].querySelector('.eb'); if (eb) { var q = bounce(seg(lt, 0, 0.35)); eb.style.transform = 'rotate(-1.5deg) translateX(' + ((1 - q) * -120) + 'px)'; eb.style.opacity = seg(lt, 0, 0.1); }
  ps.push(UPD[bi](lt, lt));
  // wipe between scenes (first 0.3 s of a beat, not the first beat)
  var w = bi > 0 ? 1 - seg(lt, 0, 0.32) : 0; wipe.style.display = wipe2.style.display = w > 0.01 ? 'block' : 'none'; wipe.style.opacity = w * 0.9; wipe.style.transform = 'translateX(' + ((1 - w) * 110) + '%)'; wipe2.style.opacity = w * 0.7; wipe2.style.transform = 'translateX(' + ((1 - w) * 140) + '%)';
  // avatar corner
  var A = AVB[bi]; if (A) { var ap = bounce(seg(lt, 0.25, 0.75)) * (1 - seg(lt, len - 0.25, len)); av.style.display = 'block'; avh.style.display = 'block'; av.style.left = A[0] + 'px'; av.style.top = A[1] + 'px'; av.style.width = av.style.height = A[2] + 'px'; var nod = 0; (window.WORDS && window.WORDS[bi] || []).forEach(function (w) { nod += Math.exp(-Math.pow((t - w[0] - 0.05) / 0.07, 2)); }); av.style.transform = 'translateY(' + (nod * 6) + 'px) scale(' + ap + ') rotate(' + (A[3] + Math.sin(t * 2.2) * 1.2 + nod * 1.5) + 'deg)'; avh.style.left = (A[0] - 20) + 'px'; avh.style.top = (A[1] + A[2] + 12) + 'px'; avh.style.opacity = ap > 0.6 ? 1 : 0; } else { av.style.display = 'none'; avh.style.display = 'none'; }
  // captions: word-by-word within the beat
  var lines = CAPS[bi], dw = lines.join(' ').split(' '), sw = (window.WORDS && window.WORDS[bi]) || [], out = '', c = 0, n;
  if (sw.length) { var s0 = sw[0][0], s1 = sw[sw.length - 1][1], pr = clamp((t - s0 + 0.04) / Math.max(0.3, s1 - s0), 0, 1); n = t < s0 ? 0 : Math.max(1, Math.min(dw.length, Math.ceil(pr * dw.length))); }
  else n = Math.max(1, Math.ceil(clamp((lt - 0.15) / Math.max(0.5, len - 0.6), 0, 1) * dw.length));
  lines.forEach(function (ln, li) { var ws = ln.split(' '), seg_ = []; ws.forEach(function (wd, wi) { c++; if (c <= n) seg_.push(c === n ? '<b>' + wd + '</b>' : wd); }); if (seg_.length) out += (out ? '<br>' : '') + seg_.join(' '); });
  cap.innerHTML = out; var nl = (out.match(/<br>/g) || []).length + 1; cap.style.top = '1310px';
  return Promise.all(ps);
};
window.__seek(0);
})();
