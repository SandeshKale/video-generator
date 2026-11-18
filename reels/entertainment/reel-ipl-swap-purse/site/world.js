// IPL swap + purse: caption-news grammar. Real PMO photos, instanced 3D balls and coins, ledger cards, calendar, end card.
// Every frame is a pure function of t; cues come from the voice timing (TM).
(function () {
'use strict';
var T = THREE, W = 1080, H = 1920, TM = window.TM;
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); } function ramp(t, a, b) { return clamp((t - a) / (b - a), 0, 1); } function lerp(a, b, u) { return a + (b - a) * u; }
function eo(u) { return 1 - Math.pow(1 - u, 3); } function eio(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
function eob(u) { var c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); }
function bounce(x) { var n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) { x -= 1.5 / d; return n * x * x + .75; } if (x < 2.5 / d) { x -= 2.25 / d; return n * x * x + .9375; } x -= 2.625 / d; return n * x * x + .984375; }
var CO = { mi: '#2a6df4', pbks: '#e0243a', gold: '#f5b82e', ivory: '#f4f1e8', lime: '#b4f000' };
// ---------- timing ----------
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
window.__cue = [];
function CW(id, w) { for (var i = 0; i < TM.cap.length; i++) if (TM.cap[i].s === id && TM.cap[i].w.toLowerCase().replace(/[^a-z0-9₹.]/g, '').indexOf(w) === 0) return TM.cap[i].t0; window.__cue.push(id + ':' + w); return ST(id) + .3; }
var DUR = TM.end; window.__reelDurationSec = DUR; window.EV = [];
function ev(t, k) { window.EV.push({ t: t, k: k }); }
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
var tEnd = ST('s12') - .05;   // end card from the follow ask
var SC = [['A1', 0, ST('s2')], ['A2', ST('s2'), ST('s3')], ['B1', ST('s3'), ST('s4')], ['B2', ST('s4'), ST('s5')], ['C', ST('s5'), ST('s6')], ['D', ST('s6'), ST('s7')], ['E', ST('s7'), ST('s8')], ['F', ST('s8'), ST('s11')], ['G', ST('s11'), ST('s12')], ['H', ST('s12'), DUR + 1]];
function sceneAt(t) { var k = 'A1'; SC.forEach(function (s) { if (t >= s[1] - .001) k = s[0]; }); return k; }
// ---------- DOM ----------
var ov = document.getElementById('ov'), bg = document.getElementById('bg'), flash = document.getElementById('flash'), glEl = document.getElementById('gl');
function E(cls, html, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; d.style.opacity = 0; ov.appendChild(d); return d; }
function show(d, u, dy, sc, dx) { d.style.opacity = clamp(u, 0, 1).toFixed(3); d.style.transform = 'translate(' + (dx || 0).toFixed(1) + 'px,' + (dy || 0).toFixed(1) + 'px)' + (sc ? ' scale(' + sc.toFixed(3) + ')' : ''); }
function card(img, x, y, w, h, col, pos) { return E('card', '<img src="img/' + img + '" style="object-position:' + (pos || '50% 10%') + '"><div class="cr" data-ov="1">PMO/PIB · GODL-India · cropped</div>', 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;border:5px solid ' + col); }
function chip(txt, col, x, y) { return E('chip', txt, 'left:' + x + 'px;top:' + y + 'px;background:' + col); }
var ALL = [];   // every per-scene element, hidden at the start of each frame
function reg(d) { ALL.push(d); return d; }
// A: swap
var XL = 162, XR = 558, CY = 720;
var HC = reg(card('hardik-pmo-crop.jpg', XL, CY, 360, 520, CO.mi, '50% 8%')), AC = reg(card('arshdeep-pmo-crop.jpg', XR, CY, 360, 520, CO.pbks));
var HCH = reg(chip('MUMBAI', CO.mi, XL, CY - 52)), ACH = reg(chip('PUNJAB', CO.pbks, XR, CY - 52)), HCH2 = reg(chip('→ PUNJAB', CO.pbks, XR, CY - 52)), ACH2 = reg(chip('→ MUMBAI', CO.mi, XL, CY - 52));
var N1a = reg(E('num', '₹<span></span><small>CRORE</small>', 'left:162px;top:470px;font-size:132px')), N1b = reg(E('num', '₹<span></span><small>CRORE</small>', 'left:532px;top:470px;font-size:132px'));
var SL = {}; function slam(id, html, top, fs) { SL[id] = reg(E('slam', html, 'top:' + top + 'px;' + (fs ? 'font-size:' + fs + 'px;' : ''))); }
slam('A1', 'बराबर पैसा.<br>बराबर <i>सौदा?</i>', 218); slam('A2', '<i>स्वैप</i> · 11 नवंबर', 218); slam('B1', 'मुंबई <i>नौवें</i> नंबर पर', 218); slam('B2', 'बुमराह: <i>4</i> विकेट', 218); slam('C', 'पंजाब के लिए<br><i>सबसे ज़्यादा</i>', 520, 84); slam('D', 'पंजाब को<br><i>बैटिंग</i> मिली', 218); slam('E', 'तेईस ओवर,<br><i>4</i> विकेट', 218); slam('F', 'बचा पैसा <i>बराबर</i> नहीं', 150, 92); slam('G', '<i>16 दिसंबर</i> · गोवा', 218);
var MK = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); MK.setAttribute('class', 'm'); MK.setAttribute('viewBox', '0 0 1080 1920'); ov.appendChild(MK);
MK.innerHTML = '<defs><marker id="ar" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#f5b82e"/></marker></defs>' +
  '<path id="mk1" d="M250,1110 C400,1060 600,1060 760,1110" stroke="#f5b82e" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320" marker-end="url(#ar)"/>' +
  '<path id="mk2" d="M830,1190 C680,1240 480,1240 330,1190" stroke="#f5b82e" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320" marker-end="url(#ar)"/>' +
  '<ellipse id="ring2" cx="787" cy="1020" rx="150" ry="60" stroke="#f5b82e" stroke-width="7" fill="none" stroke-dasharray="940" stroke-dashoffset="940" opacity="0"/>' +
  '<ellipse id="ring3" cx="340" cy="960" rx="170" ry="150" stroke="#f5b82e" stroke-width="7" fill="none" stroke-dasharray="1000" stroke-dashoffset="1000" opacity="0"/>';
function mk(id, u, L) { var p = MK.querySelector('#' + id); p.setAttribute('stroke-dashoffset', (L * (1 - u)).toFixed(1)); p.setAttribute('opacity', u > .01 ? 1 : 0); }
// B1: Bumrah + ninth
var BC = reg(card('bumrah-pmo-crop.jpg', XL, CY, 360, 520, CO.mi, '50% 10%')); var L9 = reg(E('led', '<h4>Mumbai · IPL 2026</h4><div class="big" style="left:30px;top:96px;color:#7fa6ff"><span>0</span><em style="font-style:normal;opacity:0">th</em></div><div class="lab" style="left:30px;top:340px">POSITION · REPORTED<br>TABLE NOT OPENED</div>', 'left:558px;top:' + CY + 'px;width:360px;height:520px'));
// B2: bars 2025 vs 2026
var LB = reg(E('led', '<h4>Bumrah · wickets</h4><div style="position:absolute;left:70px;bottom:128px;width:140px;height:280px"><div class="bar" id="b25" style="left:0;width:140px;background:#7fa6ff"></div></div><div style="position:absolute;left:290px;bottom:128px;width:140px;height:280px"><div class="bar" id="b26" style="left:0;width:140px;background:#ff6b7f"></div></div><div class="lab" style="left:70px;bottom:82px;width:140px;text-align:center">2025</div><div class="lab" style="left:290px;bottom:82px;width:140px;text-align:center">2026</div><div id="v25" class="lab" style="left:70px;width:140px;text-align:center;font-size:56px;color:#7fa6ff"></div><div id="v26" class="lab" style="left:290px;width:140px;text-align:center;font-size:56px;color:#ff6b7f"></div><div class="lab" style="left:490px;top:150px;font-size:40px;color:#c9c5ba">AVERAGE</div><div id="avg" class="big" style="left:490px;top:190px;font-size:118px;color:#f5b82e">0</div><div class="lab" style="left:490px;top:360px;color:#c9c5ba">ECONOMY ≈ 8.37<br>13 MATCHES</div><div class="lab" style="left:60px;bottom:20px;font-size:24px;color:#8f8b80">2025: 18 WICKETS · REPORTED</div>', 'left:162px;top:' + CY + 'px;width:756px;height:520px'));
// C: balls
var C_A = reg(card('arshdeep-pmo-crop.jpg', 722, 232, 196, 280, CO.mi, '50% 10%')), C_N = reg(E('stat', '<span>0</span><small>WICKETS · 96 MATCHES</small>', 'left:162px;top:236px;color:' + CO.gold));
// D: Punjab gets
var DC = reg(card('hardik-pmo-crop.jpg', XL, CY, 360, 520, CO.pbks, '50% 8%')), DCH = reg(chip('→ PUNJAB', CO.pbks, XL, CY - 52));
var DT1 = reg(E('led', '<h4>Captain</h4><div class="big" style="left:26px;top:76px;font-size:76px;color:#f4f1e8">SHREYAS<br>IYER</div>', 'left:558px;top:' + CY + 'px;width:360px;height:248px')), DT2 = reg(E('led', '<h4>Coach</h4><div class="big" style="left:26px;top:76px;font-size:76px;color:#f4f1e8">RICKY<br>PONTING</div>', 'left:558px;top:' + (CY + 272) + 'px;width:360px;height:248px'));
// E: 23 overs
var EO = reg(E('led', '<h4>Hardik · IPL 2026 bowling</h4>', 'left:162px;top:' + CY + 'px;width:756px;height:520px')); var OVS = []; (function () { for (var k = 0; k < 23; k++) { var c = k % 8, r = Math.floor(k / 8); var d = E('ov', '', 'left:' + (162 + 36 + c * 88) + 'px;top:' + (CY + 90 + r * 80) + 'px;width:64px;height:56px'); OVS.push(d); } })();
var EW = [2, 8, 14, 20];   // which overs carry a wicket is NOT known: shown as even spacing and labelled
var EN = reg(E('big', '≈<span>0</span><small>RUNS / OVER</small>', 'left:200px;top:' + (CY + 318) + 'px;font-size:128px;color:#ff6b7f')); var EL = reg(E('lab', '4 WICKETS · 23 OVERS · ECONOMY “APPROACHING 12”<br><span style="font-size:18px;color:#8f8b80">ILLUSTRATIVE · OVERS OF THE 4 WICKETS NOT SHOWN</span>', 'left:200px;top:' + (CY + 448) + 'px;font-size:26px'));
// F: purse
var CM = reg(chip('MUMBAI INDIANS', CO.mi, 150, 1170)), CPk = reg(chip('PUNJAB KINGS', CO.pbks, 600, 1170));
var N3a = reg(E('stat', '₹<span></span><small>CR · 9 SLOTS</small>', 'left:162px;top:300px;color:#7fa6ff')), N3b = reg(E('stat', '₹<span></span><small>CR · 6 SLOTS</small>', 'left:558px;top:300px;color:#ff6b7f'));
var SEATS = [[], []]; [[9, 162, CO.mi], [6, 558, CO.pbks]].forEach(function (p, s) { for (var k = 0; k < p[0]; k++) { var d = E('seat', '', 'left:' + (p[1] + k * 38) + 'px;top:1236px;width:28px;height:28px;border:3px solid ' + p[2] + ';border-radius:5px'); SEATS[s].push(reg(d)); } });
var CH = reg(E('tag', 'Aakash Chopra: gap in Punjab\'s bowling', 'left:410px;top:902px;color:#f4f1e8;font-size:18px;text-shadow:0 2px 8px #000'));
// G: calendar
var CAL = reg(E('led', '<h4>December 2026</h4>', 'left:162px;top:' + CY + 'px;width:756px;height:520px')); var DAYS = []; (function () { var names = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; names.forEach(function (n, i) { reg(E('day', n, 'left:' + (162 + 42 + i * 96) + 'px;top:' + (CY + 70) + 'px;color:#8f8b80;font-size:30px')); });
  for (var d = 1; d <= 31; d++) { var idx = d - 1 + 1; var el = E('day', String(d), 'left:' + (162 + 42 + (idx % 7) * 96) + 'px;top:' + (CY + 130 + Math.floor(idx / 7) * 76) + 'px'); DAYS.push(el); } })();
var GP = reg(E('chip', 'GOA · AUCTION', CO.gold && 'left:600px;top:' + (CY + 6) + 'px;background:#f5b82e;color:#10131a')); var GN = reg(E('stat', '<span>0</span><small>DAYS FROM 18 NOV</small>', 'left:162px;top:380px;color:' + CO.gold));
// H: end card
var END = reg(E('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="eF">FOLLOW</span><span id="eS">SHARE</span></div>'));
var FN1 = reg(E('num', '₹18<small>CRORE</small>', 'left:162px;top:300px;font-size:140px')), FN2 = reg(E('num', '₹18<small>CRORE</small>', 'left:532px;top:300px;font-size:140px'));
var TG = E('tag', ''), CAP = E('cap', ''); var CAPEL = document.createElement('div'); CAPEL.style.cssText = 'position:absolute;left:162px;top:1340px;width:756px'; ov.appendChild(CAPEL); CAP.style.display = 'none';
var BGS = { A: 'radial-gradient(900px 700px at 15% 40%,rgba(42,109,244,.26),transparent 65%),radial-gradient(900px 700px at 85% 40%,rgba(224,36,58,.26),transparent 65%),linear-gradient(#0c0f14,#10141b)', B: 'radial-gradient(900px 700px at 50% 45%,rgba(42,109,244,.18),transparent 65%),linear-gradient(#0c0f14,#10141b)', C: 'radial-gradient(1000px 900px at 50% 45%,#1a1f2a,#0c0f14 70%)', D: 'radial-gradient(900px 700px at 25% 40%,rgba(224,36,58,.3),transparent 65%),linear-gradient(#0c0f14,#10141b)', E: 'radial-gradient(900px 700px at 40% 45%,rgba(224,36,58,.2),transparent 65%),linear-gradient(#0c0f14,#10141b)', F: 'radial-gradient(1000px 900px at 50% 50%,#1b2030,#0b0d12 72%)', G: 'radial-gradient(900px 700px at 50% 45%,rgba(245,184,46,.14),transparent 65%),linear-gradient(#0c0f14,#10141b)', H: 'radial-gradient(900px 700px at 50% 45%,rgba(180,240,0,.1),transparent 65%),linear-gradient(#0c0f14,#10141b)' };

// ---------- 3D: renderer, balls, coins ----------
var R = new T.WebGLRenderer({ canvas: glEl, antialias: true, preserveDrawingBuffer: true, alpha: true }); R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.setClearColor(0x000000, 0);
R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
var envScene = new T.Scene(); envScene.add(new T.Mesh(new T.SphereGeometry(30, 32, 16), new T.MeshBasicMaterial({ color: 0x14171e, side: T.BackSide })));
[[0, 14, 6, 14, 3], [-14, 6, 4, 3, 8], [14, 5, -4, 3, 8]].forEach(function (p, i) { var m = new T.Mesh(new T.PlaneGeometry(p[3], p[4]), new T.MeshBasicMaterial({ color: new T.Color(i ? 0xbfd0ff : 0xffffff).multiplyScalar(i ? 9 : 14), side: T.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); envScene.add(m); });
var ENV = new T.PMREMGenerator(R).fromScene(envScene, .03).texture;
function keyLight(sc, ext) { var k = new T.DirectionalLight(0xfff1dc, 2.4); k.position.set(-6, 14, 9); k.castShadow = true; k.shadow.mapSize.set(2048, 2048); k.shadow.camera.left = -ext; k.shadow.camera.right = ext; k.shadow.camera.top = ext; k.shadow.camera.bottom = -ext; k.shadow.camera.near = 1; k.shadow.camera.far = 50; k.shadow.radius = 5; k.shadow.bias = -.0004; sc.add(k); sc.add(new T.HemisphereLight(0xaab8ff, 0x201018, .5)); }
var S2 = new T.Scene(); S2.environment = ENV; var CAM2 = new T.PerspectiveCamera(24, W / H, 1, 400); CAM2.setViewOffset(W, H, 0, -15, W, H);
var COLS = 12, ROWS = 10, CELL = 1.1, N2 = 111; keyLight(S2, 9);
(function () { var c = document.createElement('canvas'); c.width = 1536; c.height = 1280; var x = c.getContext('2d'); x.fillStyle = '#0f131a'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = 'rgba(244,241,232,.08)'; x.lineWidth = 3;
  for (var k = 0; k < COLS * ROWS; k++) { x.beginPath(); x.arc(((k % COLS) + .5) / COLS * c.width, (Math.floor(k / COLS) + .5) / ROWS * c.height, 44, 0, 7); x.stroke(); }
  var tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8; var b = new T.Mesh(new T.PlaneGeometry(COLS * CELL + .6, ROWS * CELL + .6), new T.MeshStandardMaterial({ map: tex, roughness: .55, metalness: .1 })); b.rotation.x = -Math.PI / 2; b.receiveShadow = true; S2.add(b); })();
var ballTex = (function () { var c = document.createElement('canvas'); c.width = 512; c.height = 256; var x = c.getContext('2d'); x.fillStyle = '#a8121c'; x.fillRect(0, 0, 512, 256); x.strokeStyle = '#e9dcc0'; x.lineWidth = 3; for (var i = -1; i <= 1; i += 2) { x.beginPath(); x.moveTo(0, 128 + i * 9); x.lineTo(512, 128 + i * 9); x.stroke(); }
  x.lineWidth = 2; for (var k = 0; k < 64; k++) { var px = k * 8 + 2; x.beginPath(); x.moveTo(px, 114); x.lineTo(px + 4, 124); x.moveTo(px, 142); x.lineTo(px + 4, 132); x.stroke(); } var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; })();
var BALLS = new T.InstancedMesh(new T.SphereGeometry(.46, 40, 24), new T.MeshStandardMaterial({ map: ballTex, roughness: .42, metalness: .05 }), N2); BALLS.castShadow = true; BALLS.frustumCulled = false; S2.add(BALLS);
var tO = new T.Object3D(), tE = new T.Euler(); var BSTEP = .036, BDUR = .6, B0 = ST('s5') + .9;
function slot(k) { return [((k % COLS) - (COLS - 1) / 2) * CELL, (Math.floor(k / COLS) - (ROWS - 1) / 2) * CELL]; }
function ballsAt(t) { var n = 0; for (var k = 0; k < N2; k++) { var s = slot(k), ts = B0 + k * BSTEP, u = clamp((t - ts) / BDUR, 0, 1), vis = t >= ts, e = eo(u), x = lerp(s[0] + 15, s[0], e);
  tO.position.set(x, .46 + (vis && u < 1 ? .18 * Math.sin(u * Math.PI) : 0), s[1]); tE.set(0, 0, -(x - s[0]) / .46 + k); tO.quaternion.setFromEuler(tE); tO.scale.setScalar(vis ? 1 : 0); tO.updateMatrix(); BALLS.setMatrixAt(k, tO.matrix); if (u >= 1) n++; }
  BALLS.instanceMatrix.needsUpdate = true; return n; }
var S3 = new T.Scene(); S3.environment = ENV; var CAM3 = new T.PerspectiveCamera(30, W / H, .5, 200); keyLight(S3, 6);
(function () { var g = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshStandardMaterial({ color: 0x141821, roughness: .32, metalness: .2 })); g.rotation.x = -Math.PI / 2; g.receiveShadow = true; S3.add(g); })();
var NC = [33, 19], CT = .09, CR = .6, STK = [-1.45, 1.45], FRAC = [.6, .6];
var COINS = new T.InstancedMesh(new T.CylinderGeometry(CR, CR, CT, 48, 1), new T.MeshStandardMaterial({ color: 0xf2b230, roughness: .42, metalness: .85, envMapIntensity: 1.1 }), NC[0] + NC[1]); COINS.castShadow = true; COINS.receiveShadow = true; COINS.frustumCulled = false; S3.add(COINS);
var C0 = ST('s8') + .35, CSTEP = .075, CDUR = .5;
function coinsAt(t) { var cn = [0, 0], idx = 0; for (var s = 0; s < 2; s++) for (var i = 0; i < NC[s]; i++) { var ts = C0 + (s === 0 ? i * CSTEP : i * CSTEP * (NC[0] / NC[1]) * .98), u = clamp((t - ts) / CDUR, 0, 1), vis = t >= ts, last = i === NC[s] - 1, th = last ? CT * FRAC[s] : CT, yS = i * CT + th / 2, e = bounce(u);
  tO.position.set(STK[s], yS + 2.6 * (1 - e), 0); tE.set((1 - eo(u)) * (.9 + (i % 3) * .3), (1 - u) * 2.2 * (i % 2 ? 1 : -1), (1 - eo(u)) * .6); tO.quaternion.setFromEuler(tE); tO.scale.set(vis ? 1 : 0, vis ? (last ? FRAC[s] : 1) : 0, vis ? 1 : 0); tO.updateMatrix(); COINS.setMatrixAt(idx++, tO.matrix); if (u >= 1) cn[s]++; }
  COINS.instanceMatrix.needsUpdate = true; return cn; }

// ---------- events for the sound design ----------
ev(0.05, 'hit'); ev(ST('s2') + .1, 'whoosh'); ev(ST('s3') + .05, 'tick'); ev(ST('s4') + .6, 'bars'); ev(B0, 'balls'); ev(ST('s6') + .05, 'tick'); ev(ST('s7') + .05, 'tick'); ev(ST('s8') + .02, 'flash'); ev(C0, 'coins'); ev(CW('s10', 'chopra') , 'ring'); ev(ST('s11') + .1, 'tick'); ev(tEnd, 'ping');

// ---------- seek ----------
window.__seek = function (t) {
  t = clamp(t, 0, DUR); var sc = sceneAt(t), k0 = sc[0]; bg.style.background = BGS[k0]; ALL.forEach(function (d) { show(d, 0); }); OVS.forEach(function (d) { show(d, 0); }); DAYS.forEach(function (d) { show(d, 0); }); MK.style.opacity = 1; mk('mk1', 0, 320); mk('mk2', 0, 320); mk('ring2', 0, 940); mk('ring3', 0, 1000);
  var is3d = sc === 'C' || sc === 'F'; glEl.style.opacity = is3d ? 1 : 0; flash.style.opacity = 0; var tag = '', cap = '';
  var t0 = SC.filter(function (s) { return s[0] === sc; })[0][1], loc = t - t0, endU = eo(ramp(t, tEnd, tEnd + .5));
  function sl(id, a) { show(SL[id], ramp(t, a, a + .12), (1 - eob(ramp(t, a, a + .25))) * -26, 1.25 - .25 * Math.min(1, eob(ramp(t, a, a + .25)))); }
  if (sc === 'A1' || sc === 'A2') {
    var sw = eio(ramp(t, ST('s2') + .9, ST('s2') + 2.0)), u0 = t < .05 ? 1 : eob(ramp(t, 0, .3)); var lift = Math.sin(sw * Math.PI) * 70;
    show(HC, u0, (1 - u0) * 50 - lift, 0, lerp(0, XR - XL, sw)); show(AC, u0, (1 - u0) * 50 + lift, 0, lerp(0, XL - XR, sw));
    show(HCH, 1 - sw, 0, 0, lerp(0, XR - XL, sw)); show(ACH, 1 - sw, 0, 0, lerp(0, XL - XR, sw)); show(HCH2, sw, 0, 0, 0); show(ACH2, sw, 0, 0, 0);
    HC.style.borderColor = sw > .5 ? CO.pbks : CO.mi; AC.style.borderColor = sw > .5 ? CO.mi : CO.pbks;
    if (sc === 'A1') { var nv = 15 + eo(ramp(t, .05, .6)) * 3; [N1a, N1b].forEach(function (n) { n.querySelector('span').textContent = nv.toFixed(0); show(n, 1, 0, 1 + .08 * (1 - eo(ramp(t, .6, 1.0)))); }); sl('A1', 0); tag = 'Reported · both players at ₹18 crore'; cap = ''; }
    else { [N1a, N1b].forEach(function (n) { n.querySelector('span').textContent = '18'; show(n, 1); }); sl('A2', ST('s2') + .05); mk('mk1', eo(ramp(t, ST('s2') + .8, ST('s2') + 1.6)), 320); mk('mk2', eo(ramp(t, ST('s2') + 1.0, ST('s2') + 1.8)), 320); tag = 'Swap announced 11 Nov 2026 · Wisden, Outlook'; }
  } else if (sc === 'B1') {
    show(BC, eob(ramp(t, t0, t0 + .3)), (1 - eob(ramp(t, t0, t0 + .3))) * 50); show(L9, ramp(t, t0 + .15, t0 + .4), 0); var n9 = Math.round(9 * eo(ramp(t, t0 + .3, t0 + 1.0))); L9.querySelector('span').textContent = String(n9); L9.querySelector('em').style.opacity = n9 >= 9 ? 1 : 0; sl('B1', t0 + .05);
    tag = 'IPL 2026 finish: Wisden, Khaleej Times · reported'
  } else if (sc === 'B2') {
    show(LB, ramp(t, t0, t0 + .25), (1 - eo(ramp(t, t0, t0 + .25))) * 40); var g = eo(ramp(t, t0 + .3, t0 + 1.4)); LB.querySelector('#b25').style.height = (g * 280).toFixed(1) + 'px'; LB.querySelector('#b26').style.height = (g * 4 / 18 * 280).toFixed(1) + 'px';
    LB.querySelector('#v25').textContent = Math.round(18 * g); LB.querySelector('#v26').textContent = Math.round(4 * g); LB.querySelector('#v25').style.top = (520 - 128 - 280 * g - 64).toFixed(0) + 'px'; LB.querySelector('#v26').style.top = (520 - 128 - 280 * g * 4 / 18 - 64).toFixed(0) + 'px';
    LB.querySelector('#avg').textContent = (102.5 * eo(ramp(t, CW('s4', 'average') , CW('s4', 'average') + 1.0))).toFixed(1); sl('B2', t0 + .05); tag = 'Wisden, India TV · IPL 2026 and 2025 · as reported';
  } else if (sc === 'C') {
    CAM2.position.set(0, lerp(78, 74, eio(ramp(t, t0, SE('s5')))), lerp(36, 34, eio(ramp(t, t0, SE('s5'))))); CAM2.lookAt(0, 0, 0); var n = ballsAt(t); R.render(S2, CAM2);
    show(C_A, ramp(t, t0 + .1, t0 + .4)); C_N.querySelector('span').textContent = n; show(C_N, ramp(t, t0 + .1, t0 + .4)); sl('C', t0 + 1.0); tag = 'Punjab Kings franchise record · India TV, Outlook · as of Nov 2026';
  } else if (sc === 'D') {
    show(DC, eob(ramp(t, t0, t0 + .3)), (1 - eob(ramp(t, t0, t0 + .3))) * 50); show(DCH, ramp(t, t0 + .2, t0 + .5)); show(DT1, ramp(t, t0 + .5, t0 + .8), (1 - eo(ramp(t, t0 + .5, t0 + .8))) * 40); show(DT2, ramp(t, t0 + 1.0, t0 + 1.3), (1 - eo(ramp(t, t0 + 1.0, t0 + 1.3))) * 40);
    mk('ring3', eo(ramp(t, t0 + 1.4, t0 + 2.2)), 1000); sl('D', t0 + .05); tag = 'Punjab Kings statement as reported · Wisden';
  } else if (sc === 'E') {
    show(EO, ramp(t, t0, t0 + .25)); OVS.forEach(function (d, k) { var a = ramp(t, t0 + .2 + k * .045, t0 + .4 + k * .045); d.style.background = EW.indexOf(k) >= 0 && t > t0 + 1.6 + EW.indexOf(k) * .25 ? CO.gold : 'transparent'; d.style.borderColor = EW.indexOf(k) >= 0 && t > t0 + 1.6 + EW.indexOf(k) * .25 ? CO.gold : 'rgba(244,241,232,.28)'; show(d, a, (1 - a) * 18); });
    EN.querySelector('span').textContent = (12 * eo(ramp(t, t0 + 1.0, t0 + 2.0))).toFixed(0); show(EN, ramp(t, t0 + 1.0, t0 + 1.3)); show(EL, ramp(t, t0 + 1.2, t0 + 1.5)); sl('E', t0 + .05); tag = 'Wisden · Hardik, IPL 2026 for Mumbai · reported';
  } else if (sc === 'F') {
    flash.style.opacity = (.55 * (1 - ramp(t, t0, t0 + .14))).toFixed(3); var tg = ST('s10'), rise = eio(ramp(t, tg + .8, tg + 3.0)); CAM3.position.set(0, lerp(3.4, 5.6, rise), 21); CAM3.lookAt(0, lerp(1.7, 2.3, rise), 0); CAM3.updateProjectionMatrix(); var cc = coinsAt(t); R.render(S3, CAM3);
    show(CM, ramp(t, t0 + .3, t0 + .6)); show(CPk, ramp(t, t0 + .3, t0 + .6)); var vm = cc[0] >= NC[0] ? 32.6 : cc[0] * 32.6 / NC[0], vp = cc[1] >= NC[1] ? 18.6 : cc[1] * 18.6 / NC[1]; N3a.querySelector('span').textContent = vm.toFixed(1); N3b.querySelector('span').textContent = vp.toFixed(1); show(N3a, ramp(t, t0 + .4, t0 + .6)); show(N3b, ramp(t, t0 + .4, t0 + .6));
    var ts1 = CW('s8', 'chhe') + .1, ts2 = CW('s9', 'nau') + .1; SEATS[1].forEach(function (d, k) { show(d, ramp(t, ts1 + k * .1, ts1 + .2 + k * .1)); }); SEATS[0].forEach(function (d, k) { show(d, ramp(t, ts2 + k * .1, ts2 + .2 + k * .1)); });
    if (t < tg) sl('F', t0 + .2); mk('ring2', eo(ramp(t, tg + .6, tg + 1.4)), 940); show(CH, ramp(t, tg + 1.0, tg + 1.3)); tag = 'As of 17 Nov 2026 · Outlook India · 1 coin = ₹1 crore';
  } else if (sc === 'G') {
    show(CAL, ramp(t, t0, t0 + .25)); DAYS.forEach(function (d, k) { var a = ramp(t, t0 + .15 + k * .018, t0 + .3 + k * .018); var hit = k + 1 === 16 && t > t0 + .9; d.style.background = hit ? CO.gold : 'transparent'; d.style.color = hit ? '#10131a' : '#c9c5ba'; d.style.borderRadius = '10px'; show(d, a, 0, hit ? 1 + .12 * (1 - eo(ramp(t, t0 + .9, t0 + 1.3))) : 1); });
    show(GP, ramp(t, t0 + 1.0, t0 + 1.3)); GN.querySelector('span').textContent = String(Math.round(28 * eo(ramp(t, t0 + .3, t0 + 1.4)))); show(GN, ramp(t, t0 + .3, t0 + .6)); sl('G', t0 + .05); tag = 'Mini-auction, Goa · 16 Dec 2026 · Cricinfo, Outlook';
  } else {
    var e2 = eo(ramp(t, tEnd, tEnd + .5)); show(END, e2, (1 - e2) * 30); document.getElementById('eF').style.transform = 'scale(' + (eob(ramp(t, tEnd + .15, tEnd + .5)) * (1 + .04 * Math.sin((t - tEnd) * 4.2))).toFixed(3) + ')'; document.getElementById('eS').style.transform = 'scale(' + (eob(ramp(t, tEnd + .4, tEnd + .75)) * (1 + .04 * Math.sin((t - tEnd) * 4.2 + 1.5))).toFixed(3) + ')';
    if (t >= ST('s13')) { var q = eo(ramp(t, ST('s13') + .05, ST('s13') + .4)); show(FN1, q, 0, 1 + .06 * Math.sin((t - ST('s13')) * 5)); show(FN2, q, 0, 1 + .06 * Math.sin((t - ST('s13')) * 5 + 1)); }
    tag = '';
  }
  TG.textContent = tag; TG.style.left = '162px'; TG.style.top = '1292px'; show(TG, tag ? 1 : 0);
  CAPEL.innerHTML = t < TM.groups[TM.groups.length - 1].end + .4 ? CAP_HTML(t) : '';
};
function CAP_HTML(t) { return window.CAP.html(t, CAPW, { plain: true, hi: '#f5b82e', ink: '#f1f3f8', fs: 40, width: 756 }); }
window.SCN_T0 = function () { return SC.map(function (z) { return z[1]; }).concat([DUR]); };
window.__dbg = function (c) { return eval(c); };
Promise.all(['700 112px Teko', '700 190px Teko', '600 34px Teko', '800 40px Inter', '600 15px Inter', '800 88px Inter'].map(function (f) { return document.fonts.load(f, 'बराबर पैसा सौदा ₹18 Aa 123'); }).concat(['hardik-pmo-crop.jpg', 'arshdeep-pmo-crop.jpg', 'bumrah-pmo-crop.jpg', 'profile.jpg'].map(function (n) { return new Promise(function (res) { var i = new Image(); i.onload = i.onerror = res; i.src = 'img/' + n; }); }))).then(function () { window.__seek(0); window.__ready = true; });
window.__ready = false;
})();
