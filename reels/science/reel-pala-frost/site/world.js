// Pala: "4 degree mein bhi pala?" Photoreal Cycles plates + inverse-depth maps, rendered as displaced meshes under authored camera moves.
// Every frame is a pure function of t.
(function () {
'use strict';
var T = THREE, W = 1080, H = 1920, TM = window.TM, IM = window.IM;
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.LinearSRGBColorSpace; R.toneMapping = T.NoToneMapping; R.autoClear = false; R.setClearColor(0x05070d, 1);
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); } function ramp(t, a, b) { return clamp((t - a) / (b - a), 0, 1); } function lerp(a, b, u) { return a + (b - a) * u; }
function eo(u) { return 1 - Math.pow(1 - u, 3); } function eio(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; } function eob(u) { var c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); }
function io(t, a, b, fi, fo) { return ramp(t, a, a + (fi || .28)) * (1 - ramp(t, b - (fo || .22), b)); }
function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

// ---------- timing ----------
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
var DUR = TM.end; window.__reelDurationSec = DUR;
var tEnd = TM.groups[TM.groups.length - 1].end + .45;
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
window.EV = [];

// ---------- the plate mesh (displaced by depth; xy rescaled so the rest pose equals the render) ----------
var FOV = 24, D0 = 960 / Math.tan(FOV * Math.PI / 360), AMP = 1300;
var VS = 'uniform sampler2D dm;uniform float amp,d0;varying vec2 vUv;varying float vH;void main(){vUv=uv;float h=texture2D(dm,uv).r;vH=h;float z=(h*h-.2)*amp;vec3 p=position;float k=(d0-z)/d0;p.xy*=k;p.z=z;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}';
var FS = 'uniform sampler2D map;uniform float op,foc,apr;varying vec2 vUv;varying float vH;void main(){float b=max(0.,abs(vH-foc)-.10)*apr;vec4 c=texture2D(map,vUv,b);gl_FragColor=vec4(c.rgb,op);}';
function tex(img, mip) { var t = new T.Texture(img); t.colorSpace = T.NoColorSpace; t.generateMipmaps = !!mip; t.minFilter = mip ? T.LinearMipmapLinearFilter : T.LinearFilter; t.magFilter = T.LinearFilter; t.anisotropy = 4; t.needsUpdate = true; return t; }
var TX = {}; 'ABCDEFGI'.split('').forEach(function (k) { TX[k] = { c: tex(IM['plate_' + k + '.jpg'], true), d: tex(IM['d8_' + k + '.png'], false) }; });
var PG = new T.PlaneGeometry(1350, 2400, 180, 320);
function slot() { var s = new T.Scene(), cam = new T.PerspectiveCamera(FOV, W / H, 50, 30000), m = new T.Mesh(PG, new T.ShaderMaterial({ uniforms: { map: { value: TX.A.c }, dm: { value: TX.A.d }, amp: { value: AMP }, d0: { value: D0 }, op: { value: 1 }, foc: { value: .5 }, apr: { value: 7 } }, vertexShader: VS, fragmentShader: FS, transparent: true, depthTest: true, depthWrite: true })); s.add(m); return { s: s, cam: cam, m: m }; }
var SL = [slot(), slot()];

// ---------- shot list: [u, camX, camY, zoom(px toward the plate), focus] ----------
// a/b = sentence ids the shot covers; the next shot dissolves in during the last .35 s before its start.
var SHOTS = [
  { p: 'A', a: 's1',  k: [[0, 0, 0, 0, .55], [1, 30, -30, 520, .5]] },
  { p: 'B', a: 's3',  k: [[0, -26, 20, 0, .85], [.55, -6, 6, 120, .85], [1, 12, -6, 220, .9]] },
  { p: 'I', a: 's6',  k: [[0, 0, 0, 40, .4], [1, 0, 0, 40, .4]] },
  { p: 'C', a: 's7',  k: [[0, -70, 10, 0, .45], [.4, -20, 14, 140, .45], [.62, 20, 16, 160, .78], [1, 70, 24, 260, .78]] },
  { p: 'D', a: 's10', k: [[0, 0, 40, 0, .7], [.28, 0, -150, 80, .0], [.62, 0, -150, 80, .0], [1, 0, 20, 140, .7]] },
  { p: 'E', a: 's14', k: [[0, 0, 110, 0, .35], [1, 0, -20, 320, .35]] },
  { p: 'F', a: 's16', k: [[0, 0, 0, 0, .6], [1, 0, 0, 300, .6]] },
  { p: 'G', a: 's18', k: [[0, -40, 0, 0, .8], [1, 30, 0, 260, .8]] },
  { p: 'I', a: 's19', k: [[0, 0, 0, 160, .4], [1, 0, 0, 0, .4]] },
  { p: 'C', a: 's22', k: [[0, 60, 20, 300, .6], [1, 0, 0, 0, .55]] },
  { p: 'A', a: 's25', k: [[0, 0, 0, 560, .5], [1, 0, 0, 0, .55]] }
];
SHOTS.forEach(function (s, i) { s.t0 = i === 0 ? 0 : ST(s.a) - .35; s.t1 = i === SHOTS.length - 1 ? DUR : ST(SHOTS[i + 1].a) - .35; });
function pose(s, t) { var u = clamp((t - s.t0) / Math.max(.01, s.t1 - s.t0), 0, 1), k = s.k, i = 0; while (i < k.length - 2 && u > k[i + 1][0]) i++;
  var a = k[i], b = k[i + 1], v = eio(clamp((u - a[0]) / Math.max(.001, b[0] - a[0]), 0, 1)); return [lerp(a[1], b[1], v), lerp(a[2], b[2], v), lerp(a[3], b[3], v), lerp(a[4], b[4], v)]; }
function setSlot(sl, s, t, op) { var p = pose(s, t); sl.cam.position.set(p[0], p[1], D0 - p[2]); sl.cam.rotation.set(0, 0, 0); sl.cam.updateMatrixWorld(); sl.cam.updateProjectionMatrix();
  var u = sl.m.material.uniforms; u.map.value = TX[s.p].c; u.dm.value = TX[s.p].d; u.foc.value = p[3]; u.op.value = op; }

// ---------- DOM overlays ----------
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), fadeEl = document.getElementById('fade');
var fx = document.createElement('canvas'); fx.width = W; fx.height = H; fx.style.cssText = 'position:absolute;left:0;top:0'; document.getElementById('stage').insertBefore(fx, document.getElementById('ov')); var X = fx.getContext('2d');
function E(cls, html, st, tag) { var d = document.createElement(tag || 'div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; d.style.opacity = 0; ov.appendChild(d); return d; }
function show(d, u, dy) { d.style.opacity = u.toFixed(3); d.style.transform = dy ? 'translateY(' + dy.toFixed(1) + 'px)' : ''; }
var SER = E('ser', '<i></i>खेत का विज्ञान');
var HEADS = [
  ['s1', 's3', '4°C पर भी <b>पाला</b>?'], ['s3', 's6', 'पाला पड़ा, <b class="w">फ़सल</b> जली'], ['s6', 's7', 'आख़िर में: <b>टेस्ट</b>'],
  ['s7', 's10', 'थर्मामीटर <b>बनाम</b> पत्ता'], ['s10', 's14', 'पत्ता <b class="w">गर्मी</b> छोड़ता है'], ['s14', 's15', 'सबसे <b>ख़तरनाक</b> रात'],
  ['s15', 's16', 'ठंडी हवा <b>नीचे</b> भरती है'], ['s16', 's19', 'क्या <b>काम</b> करता है?'], ['s19', 's21', 'धुआँ: <b>सबूत</b> नहीं'],
  ['s22', 's25', 'आज रात का <b>टेस्ट</b>'], ['s25', 's26', 'कल का <b>मौसम</b>'], ['s26', 'END', 'पाला <b>साफ़ आसमान</b> से']
].map(function (h) { return { t0: h[0] === 's1' ? 0 : ST(h[0]) - .05, t1: h[1] === 'END' ? tEnd : ST(h[1]) - .05, d: E('head', h[2]) }; });
var SRC = E('src', ''), SRCS = [
  ['s1', 's3', 'Illustrative reading · air temperature'], ['s4', 's6', 'Down To Earth · 4 Feb 2024 · KVK Bihar · reported · cold + fog'],
  ['s7', 's10', 'Illustrative readings · not a measurement'], ['s10', 's15', 'Illustrative · heat-flow schematic'],
  ['s15', 's16', 'FAO · Frost Protection, vol. 1, ch. 8'], ['s16', 's19', 'FAO · Frost Protection, vol. 1, ch. 8'], ['s19', 's21', 'Rajasthan agriculture dept, Dec 2024 · FAO Frost Protection vol. 1'],
  ['s22', 's25', 'Illustrative · the gap depends on the night'], ['s25', 's26', 'ICAR Kisan Call Centre · Meghdoot: IMD + IITM + ICAR']
].map(function (q) { return [ST(q[0]), ST(q[1]) - .05, q[2]]; });
// readouts
var RDA = E('rd', '<small>हवा · छाती की ऊँचाई</small><em>4°C</em>', 'left:162px;top:560px'), RDB = E('rd w', '<small>पत्ता · ज़मीन के पास</small><em>−1°C</em>', 'left:618px;top:560px');
var RD0 = E('rd', '<small>थर्मामीटर · हवा</small><em>4°C</em>', 'left:162px;top:520px;width:330px');
var STAMP = E('stamp', 'ज़मीनी पाला', 'left:300px;top:760px');
var TG1 = E('tag', '<small>छाती की ऊँचाई</small>हवा का तापमान', 'left:162px;top:760px'), TG2 = E('tag w', '<small>ज़मीन के पास</small>पत्ता, खुले आसमान के नीचे', 'left:162px;top:860px');
var BARS = E('bars', '<div class="h">Bihar, Jan 2024 · reported · cold + fog</div><div class="b" id="b1" style="left:110px;background:#9fb8c7"><span id="v1" style="color:#c9dbe6">15%</span></div><div class="b" id="b2" style="left:436px;background:#ff8a3d"><span id="v2" style="color:#ffb98a">25–40%</span></div><div class="l" style="left:85px">जल्दी बोया आलू</div><div class="l" style="left:411px">देर से बोया आलू</div>');
var CH1 = E('chip', '<small>FAO · सिंचाई</small>पाले से पहले की सिंचाई: 3–4°C तक बचाव', 'top:1010px'), CH2 = E('chip', '<small>FAO · ढकना</small>कवर रात में +1–5°C जोड़ता है', 'top:1010px');
var SM1 = E('chip w', '<small>राजस्थान कृषि विभाग · दिसं 2024</small>हल्का धुआँ करें', 'top:900px'), SM2 = E('chip', '<small>FAO · शोध</small>धुएँ से फ़ायदा नहीं मिला, प्रदूषण होता है', 'top:1040px');
var TS1 = E('rd', '<small>रात 1 · साफ़ आसमान</small><p>फ़र्क़ बड़ा</p>', 'left:162px;top:560px;width:330px'), TS2 = E('rd', '<small>रात 2 · बादल</small><p>फ़र्क़ कम</p>', 'left:588px;top:560px;width:330px');
var KCC = E('tag', '<small>किसान कॉल सेंटर · टोल-फ़्री</small>1800-180-1551', 'left:162px;top:740px;font-size:44px'), MGD = E('tag w', '<small>मेघदूत ऐप</small>IMD + IITM + ICAR', 'left:162px;top:880px');
var FOL = E('fol', '<img src="img/profile.jpg"><span>नर्डलॉजिक</span><em>nerdlogic.co</em>');
var END = E('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="sr">खेत · मौसम · विज्ञान</div><div class="btns"><span id="eF">FOLLOW</span><span id="eS">SHARE</span></div>');
var ARR = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ARR.setAttribute('class', 'ar'); ARR.setAttribute('viewBox', '0 0 1080 1920'); ARR.style.opacity = 0; ov.appendChild(ARR);
ARR.innerHTML = '<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ff8a3d"/></marker></defs>' +
  '<path id="aDown" d="M300,520 C380,640 470,760 560,900" stroke="#ff8a3d" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#ah)" stroke-dasharray="900" stroke-dashoffset="900"/>' +
  '<path id="aUp1" d="M520,1010 C500,900 470,760 440,620" stroke="#ff8a3d" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#ah)" stroke-dasharray="900" stroke-dashoffset="900"/>' +
  '<path id="aUp2" d="M600,1010 C620,900 650,760 690,600" stroke="#ff8a3d" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#ah)" stroke-dasharray="900" stroke-dashoffset="900"/>' +
  '<path id="aBack" d="M470,760 C490,830 520,900 540,990" stroke="#ff8a3d" stroke-width="12" fill="none" stroke-linecap="round" marker-end="url(#ah)" stroke-dasharray="900" stroke-dashoffset="900"/>' +
  '<g id="cld" fill="#e6f0f7" opacity="0"><ellipse cx="0" cy="0" rx="220" ry="46"/><ellipse cx="-110" cy="-34" rx="100" ry="50"/><ellipse cx="60" cy="-48" rx="130" ry="62"/></g>' +
  '<text id="aLb1" x="170" y="506" font-family="Mukta" font-weight="800" font-size="38" fill="#ffd1ad" opacity="0">दिन: धूप से गर्मी</text><text id="aLb2" x="590" y="520" font-family="Mukta" font-weight="800" font-size="38" fill="#ffd1ad" opacity="0">रात: गर्मी आसमान में</text>';
var $ = function (i) { return document.getElementById(i); };
function draw(id, u) { var p = $(id), L = 900; p.setAttribute('stroke-dashoffset', (L * (1 - u)).toFixed(1)); p.style.opacity = u > .02 ? 1 : 0; }

// ---------- events for the sound design ----------
[['s9', .15, 'stamp'], ['s1', 0, 'hit'], ['s3', 0, 'whoosh'], ['s6', 0, 'tick'], ['s12', .1, 'cloud'], ['s14', 0, 'low'], ['s17', .2, 'drop'], ['s21', 0, 'ping']].forEach(function (e) { window.EV.push({ t: ST(e[0]) + e[1], k: e[2] }); });
SHOTS.forEach(function (s, i) { if (i) window.EV.push({ t: s.t0 + .2, k: 'whoosh' }); });
window.EV.push({ t: tEnd, k: 'ping' }); window.EV.sort(function (a, b) { return a.t - b.t; });

// ---------- seek ----------
window.__seek = function (t) {
  t = clamp(t, 0, DUR);
  var i = 0; SHOTS.forEach(function (s, k) { if (t >= s.t0) i = k; });
  var s = SHOTS[i], nxt = SHOTS[i + 1], dis = nxt ? ramp(t, nxt.t0, nxt.t0 + .5) : 0;
  setSlot(SL[0], s, t, 1);
  R.clear(); R.render(SL[0].s, SL[0].cam);
  if (i > 0 && t < s.t0 + .5) { // dissolve in from the previous shot
    var pv = SHOTS[i - 1], u = ramp(t, s.t0, s.t0 + .5);
    setSlot(SL[1], pv, Math.min(t, pv.t1 + .5), 1); R.clear(); R.render(SL[1].s, SL[1].cam);
    setSlot(SL[0], s, t, eio(u)); R.clearDepth(); R.render(SL[0].s, SL[0].cam);
  }
  var endU = eo(ramp(t, tEnd, tEnd + .5));
  fadeEl.style.opacity = (.55 * endU).toFixed(3);
  X.clearRect(0, 0, W, H);
  // ---- headlines, source, series ----
  show(SER, 1 - endU);
  HEADS.forEach(function (h) { var u = t >= h.t0 && t < h.t1 ? (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .3))) * (1 - ramp(t, h.t1 - .18, h.t1)) * (1 - endU) : 0; show(h.d, u, (1 - (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .3)))) * 18); });
  var q = null; SRCS.forEach(function (z) { if (t >= z[0] && t < z[1]) q = z; }); if (q) { SRC.textContent = q[2]; show(SRC, ramp(t, q[0], q[0] + .4) * (1 - ramp(t, q[1] - .2, q[1])) * (1 - endU)); } else show(SRC, 0);
  // ---- hook readout ----
  show(RD0, io(t, 0, ST('s3') - .05, .01, .25) * (1 - endU)); RD0.querySelector('em').textContent = '4°C';
  // ---- Bihar bars ----
  var bu = io(t, ST('s5') - .2, ST('s6') - .1, .35, .25), g1 = eo(ramp(t, ST('s5'), ST('s5') + 1.6)); show(BARS, bu, (1 - bu) * 14);
  $('b1').style.height = (g1 * 15 * 7.6).toFixed(1) + 'px'; $('b2').style.height = (g1 * 40 * 7.6).toFixed(1) + 'px'; $('v1').style.opacity = g1 > .95 ? 1 : 0; $('v2').style.opacity = g1 > .95 ? 1 : 0;
  // ---- two thermometers ----
  var c1 = io(t, ST('s7'), ST('s10') - .1, .3, .3); show(TG1, io(t, ST('s7'), ST('s8') - .05, .3, .2), 0); show(TG2, io(t, ST('s8'), ST('s9') - .05, .3, .2), 0);
  show(RDA, io(t, ST('s9') - .1, ST('s10') - .1, .3, .25)); show(RDB, io(t, ST('s9') + .1, ST('s10') - .1, .3, .25), 0);
  var sp = eob(ramp(t, ST('s9') + .15, ST('s9') + .5)); show(STAMP, t >= ST('s9') + .15 && t < ST('s10') - .1 ? Math.min(1, sp) : 0, 0); STAMP.style.transform = 'scale(' + (1.6 - .6 * Math.min(1, sp)).toFixed(3) + ') rotate(-4deg)'; STAMP.style.top = '900px'; STAMP.style.left = '300px';
  // ---- heat-flow schematic (s10..s13) ----
  var a0 = ST('s10'), a1 = ST('s11'), a2 = ST('s12'), a3 = ST('s13'), au = io(t, a0, ST('s14') - .05, .3, .3); ARR.style.opacity = au.toFixed(3);
  draw('aDown', eo(ramp(t, a0 + .1, a0 + 1.0))); $('aDown').style.opacity = t < a1 - .05 ? 1 : Math.max(0, 1 - ramp(t, a1 - .05, a1 + .25));
  draw('aUp1', eo(ramp(t, a1 + .1, a1 + 1.0)) * (1 - ramp(t, a2 + .5, a2 + .9) * (1 - ramp(t, a3 + .1, a3 + .5)))); draw('aUp2', eo(ramp(t, a1 + .3, a1 + 1.2)));
  var bk = ramp(t, a2 + .7, a2 + 1.4) * (1 - ramp(t, a3 - .1, a3 + .3)); draw('aBack', eo(bk)); $('aBack').style.opacity = bk > .02 ? 1 : 0;
  var cx = lerp(1250, 600, eo(ramp(t, a2 - .1, a2 + .7))) + lerp(0, 700, ramp(t, a3, a3 + .9)), cOp = ramp(t, a2 - .1, a2 + .3) * (1 - ramp(t, a3 + .5, a3 + .9));
  $('cld').setAttribute('transform', 'translate(' + cx.toFixed(1) + ',640)'); $('cld').setAttribute('opacity', (cOp * .92).toFixed(3));
  $('aLb1').setAttribute('opacity', (ramp(t, a0 + .3, a0 + .6) * (1 - ramp(t, a1, a1 + .3))).toFixed(3)); $('aLb2').setAttribute('opacity', (ramp(t, a1 + .4, a1 + .7) * (1 - ramp(t, a2, a2 + .3))).toFixed(3));
  // ---- cold air flowing downhill (s15) ----
  var fu = io(t, ST('s14') + .3, ST('s16') - .05, .5, .3);
  if (fu > .01) { X.lineCap = 'round'; for (var n = 0; n < 46; n++) { var ph = ((t * (.16 + .1 * hash(n)) + hash(n * 3.1)) % 1), x0 = 1010 - 1010 * hash(n * 7.3) * 1.0, y0 = 600 + 70 * hash(n * 2.3), L = 90 + 80 * hash(n * 5.9);
    var px = lerp(x0, x0 - 340 - 160 * hash(n * 1.7), ph), py = lerp(y0, y0 + 330 + 90 * hash(n * 4.4), eio(ph)), al = Math.sin(ph * Math.PI) * .75 * fu; X.strokeStyle = 'rgba(127,227,255,' + al.toFixed(3) + ')'; X.lineWidth = 3 + 3 * hash(n * 8.8); X.beginPath(); X.moveTo(px, py); X.lineTo(px + L * .5, py - L * .26); X.stroke(); } }
  // ---- remedy chips ----
  show(CH1, io(t, ST('s17') + .1, ST('s18') - .05, .3, .2), 0); show(CH2, io(t, ST('s18') + .2, ST('s19') - .05, .3, .2), 0);
  // ---- smoke vs FAO (s19..s20) ----
  var su = io(t, ST('s19'), ST('s21') - .05, .4, .3);
  if (su > .01) { for (var m = 0; m < 22; m++) { var ph2 = ((t * (.07 + .04 * hash(m)) + hash(m * 3.7)) % 1), sx = 900 - 300 * hash(m * 2.2) + 60 * Math.sin(ph2 * 6 + m), sy = lerp(1150, 520, ph2), r = 50 + 120 * ph2, g = X.createRadialGradient(sx, sy, 0, sx, sy, r); g.addColorStop(0, 'rgba(180,186,190,' + (.34 * Math.sin(ph2 * Math.PI) * su).toFixed(3) + ')'); g.addColorStop(1, 'rgba(180,186,190,0)'); X.fillStyle = g; X.fillRect(sx - r, sy - r, 2 * r, 2 * r); } }
  show(SM1, io(t, ST('s19') + .1, ST('s20') - .05, .3, .2)); show(SM2, io(t, ST('s20') + .1, ST('s21') - .05, .3, .2));
  // ---- the follow chip ----
  var fu2 = eob(ramp(t, ST('s21') + .15, ST('s21') + .5)) * (1 - ramp(t, ST('s22') - .25, ST('s22') - .05)); show(FOL, fu2 > .01 ? Math.min(1, fu2) : 0); FOL.style.transform = 'scale(' + clamp(fu2, 0, 1.08).toFixed(3) + ')'; FOL.style.transformOrigin = '0 50%';
  // ---- the test (s22..s24) ----
  show(TS1, io(t, ST('s23') - .1, ST('s24') - .05, .3, .2)); show(TS2, io(t, ST('s24') + .1, ST('s25') - .05, .3, .2));
  show(KCC, io(t, ST('s25') + .5, ST('s26') - .05, .3, .2)); show(MGD, io(t, ST('s25') + .1, ST('s26') - .05, .3, .2));
  show(END, endU, (1 - endU) * 30); if (endU > 0) { $('eF').style.transform = 'scale(' + eob(ramp(t, tEnd + .15, tEnd + .5)) * (1 + .04 * Math.sin((t - tEnd) * 4.2)) + ')'; $('eS').style.transform = 'scale(' + eob(ramp(t, tEnd + .4, tEnd + .75)) * (1 + .04 * Math.sin((t - tEnd) * 4.2 + 1.5)) + ')'; }
  capEl.innerHTML = t < TM.groups[TM.groups.length - 1].end + .4 ? CAP.html(t, CAPW, { plain: true, hi: '#7fe3ff', ink: '#eef6fb', fs: 40, width: 756 }) : '';
};
window.__dbg = function (c) { return eval(c); };
window.__seek(0); window.__ready = true;
})();
