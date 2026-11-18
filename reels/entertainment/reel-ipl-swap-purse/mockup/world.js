// IPL swap mockup: caption-news grammar. Scene 1 photo cards + rolling counters + telestrator arrows, scene 2 instanced 3D balls, scene 3 instanced 3D coins and seats.
// Every frame is a pure function of t.
(function () {
'use strict';
var T = THREE, W = 1080, H = 1920, DUR = 16;
window.__reelDurationSec = DUR;
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); } function ramp(t, a, b) { return clamp((t - a) / (b - a), 0, 1); } function lerp(a, b, u) { return a + (b - a) * u; }
function eo(u) { return 1 - Math.pow(1 - u, 3); } function eio(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
function eob(u) { var c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); }
function bounce(x) { var n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) { x -= 1.5 / d; return n * x * x + .75; } if (x < 2.5 / d) { x -= 2.25 / d; return n * x * x + .9375; } x -= 2.625 / d; return n * x * x + .984375; }
var CO = { mi: '#2a6df4', pbks: '#e0243a', gold: '#f5b82e', ivory: '#f4f1e8' };
var ov = document.getElementById('ov'), bg = document.getElementById('bg'), flash = document.getElementById('flash');
function E(cls, html, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; d.style.opacity = 0; ov.appendChild(d); return d; }
function show(d, u, dy, sc) { d.style.opacity = clamp(u, 0, 1).toFixed(3); d.style.transform = 'translateY(' + (dy || 0).toFixed(1) + 'px)' + (sc ? ' scale(' + sc.toFixed(3) + ')' : ''); }
function inr(n, dp) { return n.toFixed(dp || 0); }

// ---------- renderer ----------
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true, alpha: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.setClearColor(0x000000, 0);
R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
var envScene = new T.Scene(); (function () { var dome = new T.Mesh(new T.SphereGeometry(30, 32, 16), new T.MeshBasicMaterial({ color: 0x14171e, side: T.BackSide })); envScene.add(dome);
  [[0, 14, 6, 14, 3], [-14, 6, 4, 3, 8], [14, 5, -4, 3, 8]].forEach(function (p, i) { var m = new T.Mesh(new T.PlaneGeometry(p[3], p[4]), new T.MeshBasicMaterial({ color: new T.Color(i ? 0xbfd0ff : 0xffffff).multiplyScalar(i ? 9 : 14), side: T.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.lookAt(0, 0, 0); envScene.add(m); }); })();
var pm = new T.PMREMGenerator(R), ENV = pm.fromScene(envScene, .03).texture;

// ---------- scene 2: 111 balls ----------
var S2 = new T.Scene(); S2.environment = ENV;
var CAM2 = new T.PerspectiveCamera(24, W / H, 1, 400); CAM2.setViewOffset(W, H, 0, 60, W, H);
var COLS = 12, ROWS = 10, CELL = 1.1, N2 = 111;
(function () {
  var c = document.createElement('canvas'); c.width = 1536; c.height = 1280; var x = c.getContext('2d'); x.fillStyle = '#0f131a'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = 'rgba(244,241,232,.08)'; x.lineWidth = 3;
  for (var k = 0; k < COLS * ROWS; k++) { var cx = ((k % COLS) + .5) / COLS * c.width, cy = (Math.floor(k / COLS) + .5) / ROWS * c.height; x.beginPath(); x.arc(cx, cy, 44, 0, 7); x.stroke(); }
  var tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8;
  var board = new T.Mesh(new T.PlaneGeometry(COLS * CELL + .6, ROWS * CELL + .6), new T.MeshStandardMaterial({ map: tex, roughness: .55, metalness: .1 })); board.rotation.x = -Math.PI / 2; board.receiveShadow = true; S2.add(board);
  var key = new T.DirectionalLight(0xfff1dc, 2.2); key.position.set(-6, 16, 8); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -9; key.shadow.camera.right = 9; key.shadow.camera.top = 9; key.shadow.camera.bottom = -9; key.shadow.camera.near = 1; key.shadow.camera.far = 40; key.shadow.radius = 5; key.shadow.bias = -.0004; S2.add(key);
  S2.add(new T.HemisphereLight(0xaab8ff, 0x201018, .5));
})();
var ballTex = (function () { var c = document.createElement('canvas'); c.width = 512; c.height = 256; var x = c.getContext('2d'); x.fillStyle = '#a8121c'; x.fillRect(0, 0, 512, 256); var g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(.5, 'rgba(0,0,0,.0)'); g.addColorStop(1, 'rgba(0,0,0,.12)'); x.fillStyle = g; x.fillRect(0, 0, 512, 256);
  x.strokeStyle = '#e9dcc0'; x.lineWidth = 3; for (var i = -1; i <= 1; i += 2) { x.beginPath(); x.moveTo(0, 128 + i * 9); x.lineTo(512, 128 + i * 9); x.stroke(); }
  x.lineWidth = 2; for (var k = 0; k < 64; k++) { var px = k * 8 + 2; x.beginPath(); x.moveTo(px, 128 - 14); x.lineTo(px + 4, 128 - 4); x.moveTo(px, 128 + 14); x.lineTo(px + 4, 128 + 4); x.stroke(); }
  var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; })();
var BALLS = new T.InstancedMesh(new T.SphereGeometry(.46, 40, 24), new T.MeshStandardMaterial({ map: ballTex, roughness: .42, metalness: .05 }), N2); BALLS.castShadow = true; BALLS.frustumCulled = false; S2.add(BALLS);
var tmpO = new T.Object3D(), tmpQ = new T.Quaternion(), tmpE = new T.Euler();
var B0 = 4.7, BSTEP = .036, BDUR = .6;
function slot(k) { return [((k % COLS) - (COLS - 1) / 2) * CELL, (Math.floor(k / COLS) - (ROWS - 1) / 2) * CELL]; }
function ballsAt(t) {
  var arrived = 0;
  for (var k = 0; k < N2; k++) {
    var s = slot(k), ts = B0 + .3 + k * BSTEP, u = clamp((t - ts) / BDUR, 0, 1), vis = t >= ts;
    var e = eo(u), x = lerp(s[0] + 15, s[0], e), y = .46 + (u < 1 ? .0 : 0) + (u > .85 ? 0 : 0) + (vis && u < 1 ? .18 * Math.sin(u * Math.PI) : 0);
    tmpO.position.set(x, y, s[1]); tmpE.set(0, 0, -(x - s[0]) / .46 + k); tmpO.quaternion.setFromEuler(tmpE); tmpO.scale.setScalar(vis ? 1 : 0); tmpO.updateMatrix(); BALLS.setMatrixAt(k, tmpO.matrix);
    if (u >= 1) arrived++;
  }
  BALLS.instanceMatrix.needsUpdate = true; return arrived;
}
// ---------- scene 3: coin stacks ----------
var S3 = new T.Scene(); S3.environment = ENV;
var CAM3 = new T.PerspectiveCamera(30, W / H, .5, 200);
(function () {
  var gr = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshStandardMaterial({ color: 0x141821, roughness: .32, metalness: .2 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; S3.add(gr);
  var key = new T.DirectionalLight(0xfff0dc, 2.6); key.position.set(-5, 12, 9); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.camera.left = -6; key.shadow.camera.right = 6; key.shadow.camera.top = 6; key.shadow.camera.bottom = -6; key.shadow.camera.near = 1; key.shadow.camera.far = 40; key.shadow.radius = 5; key.shadow.bias = -.0004; S3.add(key);
  S3.add(new T.HemisphereLight(0x9fb0ff, 0x1a0e12, .55));
})();
var NC = [33, 19], CT = .09, CR = .6, STK = [-1.45, 1.45], FRAC = [.6, .6];   // 32.6 and 18.6: ₹1 crore per coin, the last one scaled to its fraction
var COINS = new T.InstancedMesh(new T.CylinderGeometry(CR, CR, CT, 48, 1), new T.MeshStandardMaterial({ color: 0xf2b230, roughness: .3, metalness: .9, envMapIntensity: 2.2 }), NC[0] + NC[1]); COINS.castShadow = true; COINS.receiveShadow = true; COINS.frustumCulled = false; S3.add(COINS);
var C0 = 10.45, CSTEP = .082, CDUR = .5;
function coinsAt(t) {
  var counts = [0, 0], idx = 0;
  for (var s = 0; s < 2; s++) for (var i = 0; i < NC[s]; i++) {
    var ts = C0 + (s === 0 ? i * CSTEP : i * CSTEP * (NC[0] / NC[1]) * .98), u = clamp((t - ts) / CDUR, 0, 1), vis = t >= ts, last = i === NC[s] - 1, th = last ? CT * FRAC[s] : CT;
    var yS = i * CT + th / 2, e = bounce(u), y = yS + 6.5 * (1 - e);
    tmpO.position.set(STK[s], y, 0); tmpE.set((1 - eo(u)) * (.9 + (i % 3) * .3), (1 - u) * 2.2 * (i % 2 ? 1 : -1), (1 - eo(u)) * .6); tmpO.quaternion.setFromEuler(tmpE); tmpO.scale.set(1, last ? FRAC[s] : 1, 1); if (!vis) tmpO.scale.setScalar(0);
    tmpO.updateMatrix(); COINS.setMatrixAt(idx++, tmpO.matrix); if (u >= 1) counts[s]++;
  }
  COINS.instanceMatrix.needsUpdate = true; return counts;
}

// ---------- overlays ----------
var BGS = { 1: 'radial-gradient(900px 700px at 15% 40%,rgba(42,109,244,.28),transparent 65%),radial-gradient(900px 700px at 85% 40%,rgba(224,36,58,.28),transparent 65%),linear-gradient(#0c0f14,#10141b)', 2: 'radial-gradient(1000px 900px at 50% 45%,#1a1f2a,#0c0f14 70%)', 3: 'radial-gradient(1000px 900px at 50% 50%,#1b2030,#0b0d12 72%)' };
// scene 1
var S1 = [];
function card(img, x, y, w, h, col, cr, pos) { var d = E('card', '<img src="img/' + img + '" style="object-position:' + (pos || '50% 12%') + '"><div class="cr">' + cr + '</div>', 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;border:5px solid ' + col); return d; }
var A1 = card('arshdeep-pmo-crop.jpg', 162, 720, 360, 520, CO.mi, 'PMO/PIB · GODL-India · cropped'), H1 = card('hardik-pmo-crop.jpg', 558, 720, 360, 520, CO.pbks, 'PMO/PIB · GODL-India · cropped', '50% 8%');
var AC = E('chip', '→ MUMBAI', 'left:162px;top:668px;background:' + CO.mi), HC = E('chip', '→ PUNJAB', 'left:558px;top:668px;background:' + CO.pbks);
var N1a = E('num', '₹<span></span><small>CRORE</small>', 'left:162px;top:470px'), N1b = E('num', '₹<span></span><small>CRORE</small>', 'left:558px;top:470px');
var SL1 = E('slam', 'बराबर पैसा.<br>बराबर <i>सौदा?</i>', 'top:218px'); var MK = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); MK.setAttribute('class', 'm'); MK.setAttribute('viewBox', '0 0 1080 1920'); ov.appendChild(MK);
MK.innerHTML = '<defs><marker id="ar" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#f5b82e"/></marker></defs>' +
  '<path id="mk1" d="M250,1110 C400,1060 600,1060 760,1110" stroke="#f5b82e" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320" marker-end="url(#ar)"/>' +
  '<path id="mk2" d="M830,1190 C680,1240 480,1240 330,1190" stroke="#f5b82e" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320" marker-end="url(#ar)"/>' +
  '<ellipse id="ring2" cx="787" cy="1150" rx="150" ry="52" stroke="#f5b82e" stroke-width="7" fill="none" stroke-dasharray="940" stroke-dashoffset="940" opacity="0"/>';
var TG = E('tag', ''), CAP = E('cap', '');
// scene 2
var A2 = card('arshdeep-pmo-crop.jpg', 722, 232, 196, 280, CO.mi, 'PMO/PIB · GODL-India'), N2d = E('stat', '<span></span><small>WICKETS · 96 MATCHES</small>', 'left:162px;top:236px;color:' + CO.gold);
var SL2 = E('slam', 'पंजाब के लिए <i>सबसे ज़्यादा</i>', 'top:520px;font-size:84px;width:600px');
// scene 3
var CM = E('chip', 'MUMBAI INDIANS', 'left:150px;top:1170px;background:' + CO.mi), CP = E('chip', 'PUNJAB KINGS', 'left:628px;top:1170px;background:' + CO.pbks);
var N3a = E('stat', '₹<span></span><small>CR · 9 SLOTS</small>', 'left:162px;top:300px;color:' + CO.mi.replace('#2a6df4', '#7fa6ff')), N3b = E('stat', '₹<span></span><small>CR · 6 SLOTS</small>', 'left:558px;top:300px;color:#ff6b7f');
var SL3 = E('slam', 'बचा पैसा <i>बराबर</i> नहीं', 'top:90px;font-size:0;');
var SEATS = [[], []]; (function () { [[9, 162, CO.mi], [6, 558, CO.pbks]].forEach(function (p, s) { for (var k = 0; k < p[0]; k++) { var d = E('seat', '', 'left:' + (p[1] + k * 38) + 'px;top:1236px;width:28px;height:28px;border:3px solid ' + p[2] + ';border-radius:5px'); SEATS[s].push(d); } }); })();
var CH = E('tag', 'Chopra: a big gap in Punjab\'s bowling', 'left:520px;top:1040px;color:#f5b82e;font-size:17px');

var CP1 = ['Hardik: ₹18 crore. Arshdeep: ₹18 crore.<br>Barabar paisa. Par <b>sauda</b> barabar hai?', 'Gyaarah November: Hardik gaye Punjab,<br>Arshdeep aaye Mumbai.'], CP2 = ['Arshdeep Singh: Punjab ke liye <b>sabse zyada wicket</b>,<br>ek sau gyaarah, chhiyaanbe match mein.'], CP3 = ['Punjab ke paas ₹18.6 crore aur 6 jagah.<br>Mumbai ke paas ₹32.6 crore aur 9.', 'Yaani Punjab ko <b>bowling</b> auction se<br>khareedni padegi.'];
window.__seek = function (t) {
  t = clamp(t, 0, DUR); var sc = t < 4.5 ? 1 : t < 10 ? 2 : 3; bg.style.background = BGS[sc];
  // scene visibility
  [A1, H1, AC, HC, N1a, N1b, SL1].forEach(function (d) { show(d, 0); }); MK.style.opacity = 0;
  [A2, N2d, SL2].forEach(function (d) { show(d, 0); }); [CM, CP, N3a, N3b, CH].forEach(function (d) { show(d, 0); }); MK.querySelector('#mk1').setAttribute('stroke-dashoffset', 320); MK.querySelector('#mk2').setAttribute('stroke-dashoffset', 320); MK.querySelector('#ring2').setAttribute('opacity', 0); SEATS[0].concat(SEATS[1]).forEach(function (d) { show(d, 0); });
  document.getElementById('gl').style.opacity = sc === 1 ? 0 : 1;
  var tag = '', cap = '';
  if (sc === 1) {
    var u0 = eob(ramp(t, 0, .35)); MK.style.opacity = 1;
    show(A1, u0, (1 - u0) * 60); show(H1, u0, (1 - u0) * 60); show(AC, ramp(t, .3, .6)); show(HC, ramp(t, .3, .6));
    var nv = eo(ramp(t, .12, .6)) * 18; N1a.querySelector('span').textContent = inr(nv, 0); N1b.querySelector('span').textContent = inr(nv, 0); show(N1a, ramp(t, .08, .2), 0, 1 + .08 * (1 - eo(ramp(t, .6, 1.0)))); show(N1b, ramp(t, .08, .2), 0, 1 + .08 * (1 - eo(ramp(t, .6, 1.0))));
    var sl = t >= .7 ? eob(ramp(t, .7, .95)) : 0; show(SL1, t >= .7 ? 1 : 0, (1 - Math.min(1, sl)) * -30, t >= .7 ? 1.3 - .3 * Math.min(1, sl) : 1);
    MK.querySelector('#mk1').setAttribute('stroke-dashoffset', (320 * (1 - eo(ramp(t, 2.2, 2.9)))).toFixed(1)); MK.querySelector('#mk2').setAttribute('stroke-dashoffset', (320 * (1 - eo(ramp(t, 2.5, 3.2)))).toFixed(1)); MK.querySelector('#ring2').setAttribute('opacity', 0);
    tag = t < 2.2 ? 'Reported · both players at ₹18 crore' : 'Swap announced 11 Nov 2026 · Wisden, Outlook'; cap = t < 2.2 ? CP1[0] : CP1[1];
  } else if (sc === 2) {
    var lt = t - 4.5; CAM2.position.set(0, lerp(78, 74, eio(ramp(t, 4.5, 10))), lerp(36, 34, eio(ramp(t, 4.5, 10)))); CAM2.lookAt(0, 0, 0); var n = ballsAt(t); R.render(S2, CAM2);
    show(A2, ramp(t, 4.6, 5.0), 0); N2d.querySelector('span').textContent = n; show(N2d, ramp(t, 4.6, 4.9)); show(SL2, ramp(t, 5.6, 5.9), (1 - eo(ramp(t, 5.6, 5.9))) * 20);
    tag = 'Punjab Kings franchise record · India TV, Outlook · as of Nov 2026'; cap = CP2[0];
  } else {
    var lt3 = t - 10; flash.style.opacity = (.55 * (1 - ramp(t, 10, 10.14))).toFixed(3);
    var rise = eio(ramp(t, 14.0, 15.8)); CAM3.position.set(0, lerp(3.4, 5.6, rise), 21); CAM3.lookAt(0, lerp(1.7, 2.3, rise), 0); CAM3.updateProjectionMatrix(); var cc = coinsAt(t); R.render(S3, CAM3);
    show(CM, ramp(t, 10.3, 10.6)); show(CP, ramp(t, 10.3, 10.6));
    var vm = cc[0] >= NC[0] ? 32.6 : cc[0] * 32.6 / NC[0], vp = cc[1] >= NC[1] ? 18.6 : cc[1] * 18.6 / NC[1]; N3a.querySelector('span').textContent = vm.toFixed(1); N3b.querySelector('span').textContent = vp.toFixed(1); show(N3a, ramp(t, 10.4, 10.6)); show(N3b, ramp(t, 10.4, 10.6));
    SEATS[0].forEach(function (d, k) { show(d, ramp(t, 12.2 + k * .12, 12.4 + k * .12)); }); SEATS[1].forEach(function (d, k) { show(d, ramp(t, 12.2 + k * .12, 12.4 + k * .12)); });
    MK.style.opacity = 1; MK.querySelector('#ring2').setAttribute('stroke-dashoffset', (940 * (1 - eo(ramp(t, 13.4, 14.2)))).toFixed(1)); MK.querySelector('#ring2').setAttribute('opacity', t >= 13.4 ? 1 : 0); show(CH, ramp(t, 14.2, 14.5));
    tag = 'As of 17 Nov 2026 · Outlook India · 1 coin = ₹1 crore'; cap = t < 13.0 ? CP3[0] : CP3[1];
  }
  TG.textContent = tag; TG.style.left = '162px'; TG.style.top = '1292px'; show(TG, 1); CAP.innerHTML = cap; show(CAP, 1);
  if (sc !== 3) flash.style.opacity = 0;
};
Promise.all(['700 112px Teko', '700 190px Teko', '600 34px Teko', '800 40px Inter', '600 15px Inter'].map(function (f) { return document.fonts.load(f, 'बराबर पैसा सौदा ₹18 Aa 123'); })).then(function () {
  Array.prototype.forEach.call(document.images, function () {}); window.__seek(0); window.__ready = true; });
window.__ready = false;
})();
