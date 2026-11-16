// Dev Deepawali — "Devta bhi Diwali manate hain. Par yahi raat kyon?"  Paper-cut lightbox film.
// Every picture is a stack of flat paper sheets (canvas textures on planes at real depths) lit from behind; lamps, stars and the Moon are holes that burn (additive).
// A real perspective camera gives the parallax. Everything is a pure function of t.
(function () {
'use strict';
var T = THREE, W = 1080, H = 1920, TM = window.TM, IM = window.IM;
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.LinearSRGBColorSpace; R.toneMapping = T.NoToneMapping; R.setClearColor(0x060917, 1);
var FOV = 26, D0 = 960 / Math.tan(FOV * Math.PI / 360), S = new T.Scene(), cam = new T.PerspectiveCamera(FOV, W / H, 50, 30000);
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), fadeEl = document.getElementById('fade'), flashEl = document.getElementById('flash'), scrB = document.getElementById('scrB');
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); } function ramp(t, a, b) { return clamp((t - a) / (b - a), 0, 1); } function lerp(a, b, u) { return a + (b - a) * u; }
function eo(u) { return 1 - Math.pow(1 - u, 3); } function eio(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; } function eob(u) { var c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); }

// ---------- timing ----------
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
window.__cue = [];
function CWW(id, w) { for (var i = 0; i < TM.cap.length; i++) if (TM.cap[i].s === id && TM.cap[i].w.toLowerCase().indexOf(w) === 0) return TM.cap[i].t0; window.__cue.push(id + ':' + w); return ST(id); }
var DUR = TM.end; window.__reelDurationSec = DUR;
var tA = ST('s4'), tQ = ST('s5'), tK = ST('s6'), tK2 = ST('s7'), tS = ST('s8'), tS2 = ST('s9'), tWt = ST('s10'), tP = ST('s11'), tT = ST('s12'), tD = ST('s13'), tD2 = ST('s14'), tM = ST('s15'), tN = ST('s16'), tAs = ST('s17'),
  tO = ST('s18'), tO2 = ST('s19'), tKr = ST('s20'), tKr2 = ST('s21'), tL = ST('s22'), tL2 = ST('s23'), tY = ST('s24'), tY2 = ST('s25'), tF = ST('s26'), tF2 = ST('s27'), tR = ST('s28'), tR2 = ST('s29'), tR3 = ST('s30'), tV = ST('s31'), tV2 = ST('s32'), tEnd = SE('s32') + .35;
var cK = tK - .32, cD = tD - .36, cO = tO - .32, cS = tKr - .32, cR = tR - .36;   // light-off / light-on cuts
var SETS = [[0, 'ghat'], [cK, 'city'], [cD, 'ghat'], [cO, 'orr'], [cS, 'ghat'], [cR, 'roof']];

// ---------- baking ----------
var seed = 7; function Rn() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
function mk(w, h) { var c = document.createElement('canvas'); c.width = Math.max(2, Math.ceil(w)); c.height = Math.max(2, Math.ceil(h)); return c; }
var GR = mk(256, 256); (function () { var g = GR.getContext('2d'), d = g.createImageData(256, 256); for (var i = 0; i < d.data.length; i += 4) { var v = Rn() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 26; } g.putImageData(d, 0, 0); })();
function texOf(c) { var t = new T.CanvasTexture(c); t.colorSpace = T.NoColorSpace; t.anisotropy = 4; t.generateMipmaps = true; return t; }
var PG = new T.PlaneGeometry(1, 1), RO = 0;
function Set(name, ox, light) { var g = new T.Group(); g.position.x = ox; S.add(g); return { name: name, g: g, ox: ox, light: light, em: [], sh: [] }; }
function kz(z) { return (D0 - z) / D0; }
function place(m, set, r, z, parent) { var k = kz(z); m.scale.set((r[2] - r[0]) * k, (r[3] - r[1]) * k, 1); m.position.set(((r[0] + r[2]) / 2 - 540) * k, (960 - (r[1] + r[3]) / 2) * k, z); m.renderOrder = ++RO; (parent || set.g).add(m); return m; }
function sheet(set, o) {
  var r = o.rect, w = r[2] - r[0], h = r[3] - r[1], c = mk(w, h), x = c.getContext('2d'); x.translate(-r[0], -r[1]); x.fillStyle = o.col; o.draw(x); x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalCompositeOperation = 'source-atop'; x.fillStyle = x.createPattern(GR, 'repeat'); x.fillRect(0, 0, w, h);
  if (o.trans) { var L = o.light || set.light, g = x.createRadialGradient(L[0] - r[0], L[1] - r[1], 0, L[0] - r[0], L[1] - r[1], o.rad || 900); g.addColorStop(0, 'rgba(255,186,104,' + o.trans + ')'); g.addColorStop(.55, 'rgba(255,160,90,' + o.trans * .35 + ')'); g.addColorStop(1, 'rgba(255,160,90,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  var f = mk(w, h), y = f.getContext('2d'); y.drawImage(c, 0, 0); y.globalCompositeOperation = 'source-in'; y.fillStyle = 'rgba(255,222,170,.75)'; y.fillRect(0, 0, w, h); y.globalCompositeOperation = 'source-over'; y.drawImage(c, 0, 3);
  var s = mk(w / 4, h / 4), z = s.getContext('2d'); z.filter = 'blur(11px)'; z.drawImage(c, 0, 0, s.width, s.height); z.filter = 'none'; z.globalCompositeOperation = 'source-in'; z.fillStyle = '#02030c'; z.fillRect(0, 0, s.width, s.height);
  var sm = new T.Mesh(PG, new T.MeshBasicMaterial({ map: texOf(s), transparent: true, opacity: o.noShadow ? 0 : .62, depthTest: false, depthWrite: false })); place(sm, set, [r[0], r[1] + 30, r[2], r[3] + 30], o.z - 4, o.parent);
  var m = new T.Mesh(PG, new T.MeshBasicMaterial({ map: texOf(f), transparent: true, depthTest: false, depthWrite: false })); place(m, set, r, o.z, o.parent); m.sh = sm; set.sh.push(m); return m;
}
var EVS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
var EFS = 'uniform sampler2D map;uniform float op,rv,wv,tm,fl;uniform int md;uniform vec2 res,cen;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
  'void main(){vec4 c=texture2D(map,vUv);float h=hash(floor(vUv*res/16.));float on=1.;' +
  'if(md==0)on=smoothstep(0.,.03,rv-(vUv.x*.85+h*.15));else if(md==1)on=smoothstep(0.,.03,rv-(vUv.y*.85+h*.15));else if(md==2)on=smoothstep(0.,.03,rv-((1.-vUv.y)*.85+h*.15));' +
  'else if(md==4){vec2 d=(vUv-cen)*res;on=d.x<-6.?0.:smoothstep(0.,.012,rv-clamp(atan(d.x,d.y)/3.14159,0.,1.));}else if(md==5)on=smoothstep(0.,.02,rv-vUv.y);' +
  'float f=1.+fl*sin(7.3*tm+h*40.)*sin(3.1*tm+h*17.);float w=1.+1.4*exp(-pow((vUv.x-wv)/.07,2.));gl_FragColor=vec4(c.rgb,c.a*op*on*f*w);}';
function emitMat(tex, w, h, md) { return new T.ShaderMaterial({ uniforms: { map: { value: tex }, op: { value: 1 }, rv: { value: 2 }, wv: { value: -9 }, tm: { value: 0 }, fl: { value: 0 }, md: { value: md == null ? 3 : md }, res: { value: new T.Vector2(w, h) }, cen: { value: new T.Vector2(.5, .5) } }, vertexShader: EVS, fragmentShader: EFS, transparent: true, depthTest: false, depthWrite: false, blending: T.AdditiveBlending }); }
function emit(set, o) {
  var r = o.rect, w = r[2] - r[0], h = r[3] - r[1], q = o.q || 1, s = mk(w * q, h * q), x = s.getContext('2d'); x.scale(q, q); x.translate(-r[0], -r[1]); o.draw(x);
  var c = mk(w * q, h * q), y = c.getContext('2d'); y.globalCompositeOperation = 'lighter'; y.drawImage(s, 0, 0);
  if (o.b1 !== 0) { y.filter = 'blur(' + (o.b1 || 7) * q + 'px)'; y.drawImage(s, 0, 0); y.filter = 'blur(' + (o.b2 || 34) * q + 'px)'; y.globalAlpha = .8; y.drawImage(s, 0, 0); }
  var m = new T.Mesh(PG, emitMat(texOf(c), w, h, o.md)); m.u = m.material.uniforms; place(m, set, r, o.z, o.parent); if (o.fl) m.u.fl.value = o.fl; set.em.push(m); return m;
}
function sky(set, cols, hy) { var c = mk(8, 512), x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, cols[0]); g.addColorStop(hy, cols[1]); g.addColorStop(1, cols[2]); x.fillStyle = g; x.fillRect(0, 0, 8, 512);
  var m = new T.Mesh(PG, new T.MeshBasicMaterial({ map: texOf(c), depthTest: false, depthWrite: false })); return place(m, set, [-1500, -2600, 2580, 2400], -1000); }
function dot(x, cx, cy, r, col) { x.fillStyle = col; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); }
function shik(x, cx, base, w, h) { x.beginPath(); x.moveTo(cx - w / 2, base); x.bezierCurveTo(cx - w * .46, base - h * .5, cx - w * .2, base - h * .86, cx - w * .1, base - h * .9); x.lineTo(cx + w * .1, base - h * .9); x.bezierCurveTo(cx + w * .2, base - h * .86, cx + w * .46, base - h * .5, cx + w / 2, base); x.fill();
  x.beginPath(); x.ellipse(cx, base - h * .92, w * .17, h * .035, 0, 0, 7); x.fill(); x.fillRect(cx - w * .03, base - h * 1.06, w * .06, h * .13); dot(x, cx, base - h * .98, w * .05, x.fillStyle);
  x.beginPath(); x.moveTo(cx, base - h * 1.06); x.lineTo(cx + w * .2, base - h * 1.03); x.lineTo(cx, base - h * 1.0); x.fill();
  x.save(); x.globalCompositeOperation = 'destination-out'; x.lineWidth = 2; for (var i = 1; i < 6; i++) { var yy = base - h * (.14 * i); x.beginPath(); x.moveTo(cx - w * .5, yy); x.lineTo(cx + w * .5, yy); x.stroke(); } x.restore(); }
function chhatri(x, cx, base, w) { x.fillRect(cx - w / 2, base - w * .75, w * .08, w * .75); x.fillRect(cx + w / 2 - w * .08, base - w * .75, w * .08, w * .75); x.fillRect(cx - w * .6, base - w * .82, w * 1.2, w * .09); x.beginPath(); x.ellipse(cx, base - w * .82, w * .46, w * .42, 0, Math.PI, 0); x.fill(); x.fillRect(cx - w * .02, base - w * 1.42, w * .04, w * .2); }
function parasol(x, cx, base, w) { x.fillRect(cx - 3, base - w * .9, 6, w * .9); x.beginPath(); x.moveTo(cx - w / 2, base - w * .82); x.quadraticCurveTo(cx, base - w * 1.2, cx + w / 2, base - w * .82); x.fill(); }
function boat(x, cx, y, w) { x.beginPath(); x.moveTo(cx - w / 2, y - 16); x.quadraticCurveTo(cx, y + 26, cx + w / 2, y - 16); x.quadraticCurveTo(cx, y + 2, cx - w / 2, y - 16); x.fill(); x.fillRect(cx - w * .12, y - 44, w * .24, 34); }
function cloud(x, cx, cy, w) { x.beginPath(); x.ellipse(cx, cy, w, w * .16, 0, 0, 7); x.ellipse(cx - w * .4, cy - w * .1, w * .34, w * .16, 0, 0, 7); x.ellipse(cx + w * .3, cy - w * .13, w * .4, w * .2, 0, 0, 7); x.fill(); }
function lampRow(x, y, x0, x1, gap, jit, r) { for (var px = x0; px < x1; px += gap * (.7 + Rn() * .6)) dot(x, px, y + (Rn() - .5) * (jit || 3), (r || 3.2) * (.75 + Rn() * .5), '#ffc56a'); }
function starsDraw(n, r, skip) { return function (x) { for (var i = 0; i < n; i++) { var sx = r[0] + Rn() * (r[2] - r[0]), sy = r[1] + Rn() * (r[3] - r[1]), rr = .9 + Rn() * 2; if (skip && skip(sx, sy)) continue; dot(x, sx, sy, rr, 'rgba(223,233,255,' + (.35 + Rn() * .6) + ')'); } }; }
function radial(cx, cy, rad, c0, c1) { return function (x) { var g = x.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, c0); g.addColorStop(1, c1); x.fillStyle = g; x.fillRect(cx - rad, cy - rad, 2 * rad, 2 * rad); }; }
// Moon and cluster sprites (shared textures)
var moonTex = (function () { var c = mk(512, 512), x = c.getContext('2d'), g = x.createRadialGradient(205, 205, 25, 256, 256, 250); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#cfdcff'); x.fillStyle = g; x.beginPath(); x.arc(256, 256, 250, 0, 7); x.fill(); x.fillStyle = 'rgba(120,140,190,.22)'; [[-.3, -.2, .22], [.25, .1, .3], [-.1, .4, .16], [.35, -.4, .12]].forEach(function (m) { x.beginPath(); x.arc(256 + m[0] * 250, 256 + m[1] * 250, m[2] * 250, 0, 7); x.fill(); }); return texOf(c); })();
var haloTex = (function () { var c = mk(256, 256), x = c.getContext('2d'); radial(128, 128, 128, 'rgba(205,220,255,.55)', 'rgba(205,220,255,0)')(x); return texOf(c); })();
var ringTex = (function () { var c = mk(256, 256), x = c.getContext('2d'); x.strokeStyle = '#ffc56a'; x.lineWidth = 7; x.beginPath(); x.arc(128, 128, 120, 0, 7); x.stroke(); return texOf(c); })();
var PL = [[0, 0, 1], [-.383, -.052, .75], [-.389, .032, .5], [.264, -.157, .65], [.378, .263, .7], [.595, .008, .72], [.519, .362, .6], [.612, .184, .4], [.36, .449, .38]];   // Pleiades: degrees from Alcyone
var clusterTex = (function () { var s = mk(600, 600), x = s.getContext('2d'); PL.forEach(function (p) { var a = .5, px = p[0] * Math.cos(a) - p[1] * Math.sin(a), py = p[0] * Math.sin(a) + p[1] * Math.cos(a); dot(x, 240 + px * 300, 380 - py * 300, 3 + p[2] * 5, '#e6efff'); });
  var c = mk(600, 600), y = c.getContext('2d'); y.globalCompositeOperation = 'lighter'; y.drawImage(s, 0, 0); y.filter = 'blur(5px)'; y.drawImage(s, 0, 0); y.filter = 'blur(22px)'; y.globalAlpha = .9; y.drawImage(s, 0, 0); return texOf(c); })();   // Alcyone at (240,380) of 600, 300 px per degree
function sprite(set, tex, md) { var m = new T.Mesh(PG, emitMat(tex, 600, 600, md)); m.u = m.material.uniforms; m.renderOrder = ++RO; set.g.add(m); return m; }
function at(m, fx, fy, z, sx, sy) { var k = kz(z); m.position.set((fx - 540) * k, (960 - fy) * k, z); m.scale.set(sx * k, (sy == null ? sx : sy) * k, 1); }
function mkChart(set) { var o = {}; o.halo = sprite(set, haloTex); o.moon = sprite(set, moonTex); o.cl = sprite(set, clusterTex, 0); o.line = new T.Mesh(PG, new T.MeshBasicMaterial({ color: 0xffc56a, transparent: true, opacity: 0, depthTest: false, blending: T.AdditiveBlending })); o.line.renderOrder = ++RO; set.g.add(o.line); o.r1 = sprite(set, ringTex); o.r2 = sprite(set, ringTex); return o; }
// chart: af = Alcyone in frame px at the reference pose, sc px per degree, sep in degrees along dir (frame coords, y down)
function setChart(o, af, sc, sep, z, mo, ho, co, lo, ro, t) {
  var dx = -.5, dy = .866, mx = af[0] + dx * sep * sc, my = af[1] + dy * sep * sc, mr = .2785 * sc;
  at(o.moon, mx, my, z, 2 * mr); o.moon.u.op.value = mo; at(o.halo, mx, my, z, mr * 11); o.halo.u.op.value = ho;
  at(o.cl, af[0] + (300 - 240) * sc / 300, af[1] + (300 - 380) * sc / 300, z, 2 * sc); o.cl.u.op.value = co; o.cl.u.tm.value = t; o.cl.u.fl.value = .1;
  var L = sep * sc - mr - 14; at(o.line, mx - dx * (mr + L / 2), my - dy * (mr + L / 2), z, 4, Math.max(1, L)); o.line.rotation.z = Math.atan2(dx, dy) * -1; o.line.material.opacity = lo;
  at(o.r1, mx - dx * mr * 2, my - dy * mr * 2, z, 2 * mr); o.r1.u.op.value = ro[0]; at(o.r2, mx - dx * mr * 4, my - dy * mr * 4, z, 2 * mr); o.r2.u.op.value = ro[1];
  return [mx, my, mr];
}

// ================= SET 1: the ghats and the sky above them =================
var G = Set('ghat', 0, [560, 1010]), Y0 = 900;
sky(G, ['#070b22', '#1c2c66', '#3a4f96'], .62);
G.haze = emit(G, { rect: [-200, 300, 1280, 1720], z: -940, q: .25, b1: 0, draw: radial(560, 1010, 660, 'rgba(255,170,90,.5)', 'rgba(255,170,90,0)') });
G.stars = emit(G, { rect: [-500, -1400, 1580, 960], z: -900, q: .5, b1: 3, b2: 14, fl: .25, draw: starsDraw(520, [-500, -1400, 1580, 960]) });
var AF = [600, 158], SC = 300;
G.name = emit(G, { rect: [300, 330, 900, 560], z: -700, b1: 6, b2: 26, md: 0, draw: function (x) { x.font = '800 150px Baloo'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#ffd58a'; x.fillText('कार्तिक', 600, 448); } });
G.ch = mkChart(G);
G.clouds = sheet(G, { rect: [-300, 120, 1380, 620], z: -620, col: '#56699f', trans: .25, rad: 1200, draw: function (x) { cloud(x, 200, 330, 230); cloud(x, 760, 250, 260); cloud(x, 1010, 470, 200); cloud(x, 430, 520, 210); } });
G.cl = emit(G, { rect: [-300, 120, 1380, 620], z: -616, md: 0, fl: .2, draw: function (x) { lampRow(x, 322, 20, 400, 13, 3, 3); lampRow(x, 240, 560, 990, 13, 3, 3); lampRow(x, 462, 850, 1170, 13, 3, 3); lampRow(x, 512, 250, 610, 13, 3, 3); } });
sheet(G, { rect: [-400, 620, 1480, 1500], z: -440, col: '#6b86c6', trans: .5, draw: function (x) { x.fillRect(-400, Y0 + 20, 1900, 900); for (var i = -4; i < 20; i++) { var w = 40 + Rn() * 50; shik(x, 30 + i * 70 + Rn() * 20, Y0 + 24, w, 70 + Rn() * 90); } } });
var TP = [[120, 150, 250], [330, 110, 190], [520, 190, 330], [735, 130, 230], [930, 160, 280], [-150, 140, 240], [1190, 150, 260]];
sheet(G, { rect: [-400, 500, 1480, 1600], z: -290, col: '#42599a', trans: .36, draw: function (x) { x.fillRect(-400, Y0 + 70, 1900, 900); TP.forEach(function (t) { x.fillRect(t[0] - t[1] * .8, Y0 + 10, t[1] * 1.6, 64); shik(x, t[0], Y0 + 14, t[1], t[2]); }); chhatri(x, 235, Y0 + 72, 60); chhatri(x, 640, Y0 + 72, 70); chhatri(x, 1010, Y0 + 72, 56); } });
G.e1 = emit(G, { rect: [-400, 820, 1480, 1040], z: -286, md: 0, fl: .22, draw: function (x) { TP.forEach(function (t) { lampRow(x, Y0 + 8, t[0] - t[1] * .75, t[0] + t[1] * .75, 13, 2, 2.6); dot(x, t[0], Y0 - 18, 9, '#ffb85a'); }); lampRow(x, Y0 + 68, -380, 1460, 11, 3, 2.8); } });
sheet(G, { rect: [-400, 880, 1480, 1700], z: -150, col: '#253870', trans: .2, draw: function (x) { x.fillRect(-400, Y0 + 120, 1900, 900); chhatri(x, 90, Y0 + 122, 86); chhatri(x, 455, Y0 + 122, 74); chhatri(x, 870, Y0 + 122, 92); x.fillRect(560, Y0 + 84, 200, 40); x.fillRect(585, Y0 + 58, 150, 30); } });
G.e2 = emit(G, { rect: [-400, 940, 1480, 1160], z: -146, md: 0, fl: .22, draw: function (x) { for (var k = 0; k < 5; k++) lampRow(x, Y0 + 126 + k * 22, -380, 1460, 9 + k, 3, 3); lampRow(x, Y0 + 82, 562, 758, 12, 2, 2.6); } });
sheet(G, { rect: [-300, 980, 1380, 2300], z: 0, col: '#0e1634', trans: .07, draw: function (x) { x.fillRect(-300, Y0 + 236, 1700, 1300); [-130, 70, 300, 610, 820, 1000, 1210].forEach(function (px, i) { parasol(x, px, Y0 + 238, 110 + (i % 2) * 30); }); boat(x, 210, Y0 + 300, 230); boat(x, 760, Y0 + 312, 260); } });
G.e3 = emit(G, { rect: [-300, 1100, 1380, 1330], z: 4, md: 0, fl: .22, draw: function (x) { lampRow(x, Y0 + 240, -280, 1360, 12, 3, 3.4); lampRow(x, Y0 + 262, -280, 1360, 15, 3, 3.6); dot(x, 210, Y0 + 262, 7, '#ffb85a'); dot(x, 760, Y0 + 274, 7, '#ffb85a'); x.globalAlpha = .5; for (var i = 0; i < 90; i++) { var px = -280 + Rn() * 1640, l = 12 + Rn() * 34; x.fillStyle = '#ffb45a'; x.fillRect(px, Y0 + 316 + Rn() * 14, 2.5, l); } } });
// the page of the story (beat 7): a paper sheet in front of everything
G.pageG = new T.Group(); G.g.add(G.pageG);
G.page = sheet(G, { rect: [150, 560, 930, 1130], z: 260, col: '#efe3c8', parent: G.pageG, draw: function (x) { x.fillRect(150, 560, 780, 570); x.fillStyle = '#2a2010'; x.font = '400 54px Tiro'; x.fillText('महाभारत · कर्ण पर्व', 200, 660); x.font = '800 20px Inter'; x.fillStyle = '#8a6a2a'; x.fillText('KARNA PARVA 33–34 · GANGULI TRANSLATION', 202, 706);
  x.fillStyle = 'rgba(42,32,16,.5)'; [760, 800, 840, 880].forEach(function (yy, i) { x.fillRect(200, yy, [660, 610, 680, 420][i], 9); }); x.fillStyle = '#2a2010'; x.font = '400 46px Tiro'; x.fillText('तीन शहर · एक तीर', 200, 990); x.font = '400 46px Tiro'; x.fillText('तिथि :', 200, 1076);
  x.strokeStyle = '#b3261e'; x.lineWidth = 5; x.setLineDash([14, 10]); x.strokeRect(350, 1030, 380, 64); x.setLineDash([]); } });
G.blank = emit(G, { rect: [330, 1010, 750, 1114], z: 264, parent: G.pageG, b1: 6, b2: 20, draw: function (x) { x.strokeStyle = '#ff5a3c'; x.lineWidth = 5; x.strokeRect(350, 1030, 380, 64); } });

// ================= SET 2: three flying cities and one arrow =================
var C = Set('city', 9000, [540, 820]);
sky(C, ['#080c26', '#16225a', '#2b3c84'], .55);
emit(C, { rect: [-300, 0, 1380, 1640], z: -940, q: .25, b1: 0, draw: radial(540, 820, 760, 'rgba(255,176,96,.42)', 'rgba(255,176,96,0)') });
C.stars = emit(C, { rect: [-500, -400, 1580, 1500], z: -900, q: .5, b1: 3, b2: 14, fl: .25, draw: starsDraw(330, [-500, -400, 1580, 1500]) });
function cityDraw(cy, w, n, hh) { return function (x) { x.beginPath(); x.moveTo(540 - w / 2, cy); x.bezierCurveTo(540 - w * .42, cy + 90, 540 - w * .1, cy + 120, 540, cy + 128); x.bezierCurveTo(540 + w * .1, cy + 120, 540 + w * .42, cy + 90, 540 + w / 2, cy); x.fill();
  for (var i = 0; i < n; i++) { var px = 540 - w / 2 + w * (i + .5) / n, tw = w / n * .78, th = hh * (.45 + Rn() * .55); if (Math.abs(px - 540) < w / n * .8) th = hh * 1.25; x.fillRect(px - tw / 2, cy - th, tw, th + 2); if (i % 2) { x.beginPath(); x.ellipse(px, cy - th, tw * .5, tw * .42, 0, Math.PI, 0); x.fill(); } else { x.beginPath(); x.moveTo(px - tw / 2, cy - th); x.lineTo(px, cy - th - tw * .9); x.lineTo(px + tw / 2, cy - th); x.fill(); } }
  x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(540, cy + 38, 30, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over'; }; }
function winDraw(cy, w, col) { return function (x) { for (var i = 0; i < 46; i++) { var px = 540 - w * .46 + Rn() * w * .92; if (Math.abs(px - 540) < 40) continue; x.fillStyle = col; x.fillRect(px, cy - 12 - Rn() * 70, 5, 9); } }; }
C.cl1 = sheet(C, { rect: [-300, 380, 1380, 900], z: -520, col: '#b89350', trans: .4, rad: 900, draw: function (x) { cloud(x, 150, 700, 150); cloud(x, 960, 560, 170); } });
C.city = [];
[[610, 400, 9, 96, '#d2a85c', .5, '#fff0c0', -420], [850, 440, 10, 104, '#93a0c2', .3, '#eef4ff', -260], [1090, 470, 10, 108, '#3a4263', .14, '#ff9c5a', -100]].forEach(function (c, i) {
  var g = new T.Group(); C.g.add(g); var o = { g: g, cy: c[0], z: c[7] };
  o.sheet = sheet(C, { rect: [240, c[0] - 190, 840, c[0] + 170], z: c[7], col: c[4], trans: c[5], rad: 800, parent: g, draw: cityDraw(c[0], c[1], c[2], c[3]) });
  o.win = emit(C, { rect: [280, c[0] - 130, 800, c[0] + 30], z: c[7] + 3, parent: g, b1: 4, b2: 18, fl: .2, draw: winDraw(c[0], c[1], c[6]) });
  o.gate = emit(C, { rect: [440, c[0] - 62, 640, c[0] + 138], z: c[7] + 5, parent: g, b1: 8, b2: 30, draw: function (x) { dot(x, 540, c[0] + 38, 27, '#fff3cf'); } });
  C.city.push(o);
  if (i < 2) sheet(C, { rect: [-300, c[0] + 90, 1380, c[0] + 460], z: c[7] + 80, col: i ? '#3a4263' : '#93a0c2', trans: i ? .12 : .28, rad: 900, draw: function (x) { if (i) { cloud(x, 150, 1150, 170); cloud(x, 950, 1170, 150); } else { cloud(x, 960, 930, 170); cloud(x, 110, 860, 130); } } });
});
C.ray = emit(C, { rect: [440, 420, 640, 1290], z: -40, md: 5, b1: 8, b2: 40, draw: function (x) { var g = x.createLinearGradient(0, 1250, 0, 470); g.addColorStop(0, '#ffe9b0'); g.addColorStop(.75, '#ffc56a'); g.addColorStop(1, 'rgba(255,197,106,0)'); x.fillStyle = g; x.fillRect(535, 470, 10, 780); x.beginPath(); x.moveTo(540, 452); x.lineTo(524, 500); x.lineTo(556, 500); x.fillStyle = '#fff3cf'; x.fill(); } });
C.bowG = new T.Group(); C.g.add(C.bowG);
C.bow = sheet(C, { rect: [300, 1100, 780, 1300], z: 0, col: '#7b63b8', trans: .35, rad: 700, parent: C.bowG, draw: function (x) { x.lineWidth = 24; x.strokeStyle = '#7b63b8'; x.lineCap = 'round'; x.beginPath(); x.moveTo(330, 1262); x.quadraticCurveTo(540, 1124, 750, 1262); x.stroke(); x.lineWidth = 4; x.beginPath(); x.moveTo(332, 1262); x.lineTo(748, 1262); x.stroke(); x.fillRect(534, 1150, 12, 120); } });
sheet(C, { rect: [-300, 1262, 1380, 2300], z: 30, col: '#080b1e', draw: function (x) { x.fillRect(-300, 1262, 1700, 1100); } });

// ================= SET 3: half an orbit =================
var O = Set('orr', 18000, [540, 560]), EX = 540, EY = 905, OR = 235;
sky(O, ['#0a0f2c', '#0f1840', '#141f52'], .5);
emit(O, { rect: [-400, -400, 1480, 1560], z: -940, q: .25, b1: 0, draw: function (x) { var g = x.createRadialGradient(540, 560, 0, 540, 560, 950); g.addColorStop(0, 'rgba(255,196,120,.95)'); g.addColorStop(.3, 'rgba(255,176,96,.5)'); g.addColorStop(1, 'rgba(120,150,230,.16)'); x.fillStyle = g; x.fillRect(-400, -400, 1900, 2000); } });
O.sun = emit(O, { rect: [420, 440, 660, 680], z: -200, b1: 8, b2: 40, fl: .0, draw: function (x) { dot(x, 540, 560, 54, '#ffd58a'); } });
O.arc = emit(O, { rect: [240, 600, 840, 1210], z: -200, md: 4, b1: 8, b2: 40, draw: function (x) { x.strokeStyle = '#ffc56a'; x.lineWidth = 13; x.beginPath(); x.arc(EX, EY, OR, -Math.PI / 2, Math.PI / 2); x.stroke(); } });
O.arc.u.cen.value.set(.5, 1 - (EY - 600) / 610);
sheet(O, { rect: [-400, -300, 1480, 2300], z: -120, col: '#16204e', trans: .22, rad: 900, noShadow: true, draw: function (x) { x.fillRect(-400, -300, 1900, 2700); x.globalCompositeOperation = 'destination-out'; x.lineWidth = 13; x.beginPath(); x.arc(EX, EY, OR, 0, 7); x.stroke();
  x.beginPath(); x.arc(540, 560, 56, 0, 7); x.fill(); x.lineCap = 'round'; for (var i = 0; i < 16; i++) { var a = i / 16 * 6.283; x.lineWidth = 7; x.beginPath(); x.moveTo(540 + Math.cos(a) * 74, 560 + Math.sin(a) * 74); x.lineTo(540 + Math.cos(a) * (96 + (i % 2) * 14), 560 + Math.sin(a) * (96 + (i % 2) * 14)); x.stroke(); }
  for (var d = 0; d <= 15; d++) { var b = -Math.PI / 2 + d / 15 * Math.PI; x.lineWidth = d % 5 ? 4 : 8; x.beginPath(); x.moveTo(EX + Math.cos(b) * (OR + 22), EY + Math.sin(b) * (OR + 22)); x.lineTo(EX + Math.cos(b) * (OR + (d % 5 ? 40 : 54)), EY + Math.sin(b) * (OR + (d % 5 ? 40 : 54))); x.stroke(); } x.globalCompositeOperation = 'source-over'; } });
sheet(O, { rect: [470, 835, 610, 975], z: -60, col: '#2c8a86', trans: .25, rad: 700, draw: function (x) { x.beginPath(); x.arc(EX, EY, 50, 0, 7); x.fill(); } });
sheet(O, { rect: [490, 850, 590, 950], z: -40, col: '#1b5e66', draw: function (x) { x.beginPath(); x.moveTo(EX - 30, EY - 20); x.quadraticCurveTo(EX - 5, EY - 44, EX + 16, EY - 18); x.quadraticCurveTo(EX + 30, EY + 10, EX + 6, EY + 30); x.quadraticCurveTo(EX - 22, EY + 18, EX - 30, EY - 20); x.fill(); } });
// the travelling Moon: dark paper disc + a lit face redrawn every frame (phase), plus three stamps left behind
function phaseDraw(x, p, mr, cx, cy) { x.clearRect(0, 0, 2 * cx, 2 * cy); if (p <= 0) return; x.save(); x.beginPath(); x.arc(cx, cy, mr, 0, 7); x.clip(); x.fillStyle = '#e9f0ff'; if (p >= 1) x.fillRect(0, 0, 2 * cx, 2 * cy); else { x.beginPath(); x.arc(cx, cy, mr, Math.PI / 2, -Math.PI / 2, false); x.ellipse(cx, cy, Math.abs(1 - 2 * p) * mr, mr, 0, -Math.PI / 2, Math.PI / 2, p < .5); x.fill(); } x.restore(); }
O.mG = new T.Group(); O.g.add(O.mG);
O.mDark = sheet(O, { rect: [-50, -50, 50, 50], z: -20, col: '#0a0e24', parent: O.mG, draw: function (x) { x.beginPath(); x.arc(0, 0, 38, 0, 7); x.fill(); } });
O.mC = mk(128, 128); O.mT = texOf(O.mC); O.mLit = new T.Mesh(PG, emitMat(O.mT, 128, 128, 3)); O.mLit.u = O.mLit.material.uniforms; O.mLit.renderOrder = ++RO; O.mG.add(O.mLit);
O.mHalo = sprite(O, haloTex);
O.st = [4, 7.5, 11].map(function (d) { var a = -Math.PI / 2 + d / 15 * Math.PI, mx = EX + Math.cos(a) * OR, my = EY + Math.sin(a) * OR, g = new T.Group(); O.g.add(g);
  sheet(O, { rect: [mx - 40, my - 40, mx + 40, my + 40], z: -30, col: '#0a0e24', parent: g, draw: function (x) { x.beginPath(); x.arc(mx, my, 30, 0, 7); x.fill(); } });
  var e = emit(O, { rect: [mx - 60, my - 60, mx + 60, my + 60], z: -28, parent: g, b1: 4, b2: 14, draw: function (x) { x.translate(mx - 60, my - 60); phaseDraw2(x, d / 15, 25, 60, 60); } }); return { g: g, e: e, d: d }; });
function phaseDraw2(x, p, mr, cx, cy) { x.save(); x.beginPath(); x.arc(cx, cy, mr, 0, 7); x.clip(); x.fillStyle = '#e9f0ff'; x.beginPath(); x.arc(cx, cy, mr, Math.PI / 2, -Math.PI / 2, false); x.ellipse(cx, cy, Math.abs(1 - 2 * p) * mr, mr, 0, -Math.PI / 2, Math.PI / 2, p < .5); x.fill(); x.restore(); }

// ================= SET 4: a roof, one diya, a real hand =================
var F = Set('roof', 27000, [262, 1180]), RM = [500, 800], RSC = 330;
sky(F, ['#050818', '#101a4a', '#263878'], .62);
F.stars = emit(F, { rect: [-500, -600, 1580, 1250], z: -900, q: .5, b1: 3, b2: 14, fl: .25, draw: starsDraw(420, [-500, -600, 1580, 1250], function (sx, sy) { return Math.hypot(sx - 500, sy - 800) < 190; }) });
F.ch = mkChart(F);
sheet(F, { rect: [-400, 960, 1480, 1800], z: -300, col: '#3d5596', trans: .3, rad: 700, draw: function (x) { x.fillRect(-400, 1150, 1900, 800); [[60, 150, 90], [250, 110, 60], [690, 170, 80], [900, 140, 110], [-240, 180, 70], [1150, 200, 90]].forEach(function (b) { x.fillRect(b[0], 1150 - b[2], b[1], b[2] + 4); }); shik(x, 480, 1154, 90, 150); } });
F.win = emit(F, { rect: [-300, 1020, 1380, 1160], z: -296, b1: 4, b2: 18, fl: .15, draw: function (x) { [[100, 1100], [160, 1092], [300, 1118], [740, 1104], [800, 1096], [960, 1070], [1010, 1090], [-150, 1100], [1220, 1090]].forEach(function (p) { x.fillStyle = '#ffc56a'; x.fillRect(p[0], p[1], 12, 16); }); } });
F.handG = new T.Group(); F.g.add(F.handG);
F.hand = new T.Mesh(PG, new T.MeshBasicMaterial({ map: (function () { var t = new T.Texture(IM['hand.png']); t.colorSpace = T.NoColorSpace; t.needsUpdate = true; return t; })(), transparent: true, depthTest: false, color: new T.Color(.5, .4, .46) })); place(F.hand, F, [RM[0] - 832, RM[1] - 150, RM[0] - 832 + 1506, RM[1] - 150 + 1799], -80, F.handG);
sheet(F, { rect: [-300, 1120, 1380, 2300], z: 0, col: '#0b1027', trans: .1, rad: 500, draw: function (x) { x.fillRect(-300, 1232, 1700, 1100); x.fillRect(-300, 1206, 1700, 30); x.beginPath(); x.moveTo(190, 1170); x.quadraticCurveTo(262, 1250, 334, 1170); x.lineTo(352, 1160); x.lineTo(172, 1160); x.fill(); } });
F.flame = emit(F, { rect: [130, 960, 400, 1260], z: 4, b1: 8, b2: 46, fl: .5, draw: function (x) { var g = x.createRadialGradient(262, 1130, 2, 262, 1120, 60); g.addColorStop(0, '#fff6d8'); g.addColorStop(.4, '#ffc56a'); g.addColorStop(1, 'rgba(255,150,60,0)'); x.fillStyle = g; x.beginPath(); x.moveTo(262, 1066); x.bezierCurveTo(292, 1110, 286, 1150, 262, 1158); x.bezierCurveTo(238, 1150, 232, 1110, 262, 1066); x.fill(); } });
F.glow = emit(F, { rect: [-100, 840, 620, 1540], z: 6, q: .25, b1: 0, draw: radial(262, 1190, 340, 'rgba(255,170,90,.3)', 'rgba(255,170,90,0)') });

// ---------- camera: authored moves, locked between them ----------
var SO = { ghat: G, city: C, orr: O, roof: F }, P_SKY = [0, 540, D0];
var MOVES = [
  ['ghat', 0, 3.4, [0, 30, D0 + 520], [0, 0, D0], eo],                                  // dolly in on the lit ghats
  ['ghat', tA, tQ - .1, [0, 0, D0], [0, -70, D0 - 300], eio],                           // push toward the lamps
  ['city', cK, tS - .15, [-170, 0, D0 + 260], [170, 0, D0 + 260], eio],                  // lateral travel past the three cities
  ['city', tS, tS2 + .9, [170, 0, D0 + 260], [0, 0, D0], eio],                           // truck back to centre as they line up
  ['ghat', cD, tD + 2.5, [0, 620, D0 + 200], [0, 0, D0], eio],                           // crane down from the lit clouds to the river
  ['ghat', tAs - .05, tAs + 1.25, [0, 0, D0], P_SKY, eio],                               // crane up: "aasmaan ne"
  ['orr', cO, tO + 1.3, [0, 0, D0 + 420], [0, 0, D0], eo],                               // dolly in on the orbit
  ['ghat', cS, tKr + 1.3, [0, 540, D0 + 340], P_SKY, eo],                                // dolly in on the sky
  ['ghat', tY, tY + 1.5, P_SKY, [-40, 520, D0 - 240], eio],                              // push in on the Moon and the cluster
  ['roof', cR, tR + 2.2, [0, -20, D0 + 460], [0, 0, D0], eo],                            // dolly in to the roof
  ['roof', tV, tV + 2.4, [0, 0, D0], [30, 50, D0 - 220], eio]                            // last slow push toward the cluster
];
function setAt(t) { var s = 'ghat', i0 = 0; for (var i = 0; i < SETS.length; i++) if (t >= SETS[i][0]) { s = SETS[i][1]; i0 = i; } return [s, SETS[i0][0], i0 + 1 < SETS.length ? SETS[i0 + 1][0] : 1e9]; }
function poseAt(t) { var sa = setAt(t), p = null, first = null; MOVES.forEach(function (m) { if (m[0] !== sa[0] || m[1] < sa[1] - .01 || m[1] >= sa[2]) return; if (!first) first = m; if (t >= m[1]) { var u = m[5](ramp(t, m[1], m[2])); p = [lerp(m[3][0], m[4][0], u), lerp(m[3][1], m[4][1], u), lerp(m[3][2], m[4][2], u)]; } }); if (!p) p = first ? first[3] : [0, 0, D0]; return [sa[0], p]; }
var _v = new T.Vector3();
function proj(set, fx, fy, z, gx) { var k = kz(z); _v.set(set.ox + (fx - 540) * k + (gx || 0), (960 - fy) * k, z).project(cam); return [(_v.x + 1) * 540, (1 - _v.y) * 960]; }

// ---------- overlays ----------
function E(cls, html, css) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html || ''; if (css) d.style.cssText = css; d.style.display = 'none'; ov.appendChild(d); return d; }
function show(d, u, ty) { if (u <= .005) { d.style.display = 'none'; return; } d.style.display = d._disp || 'block'; d.style.opacity = Math.min(1, u); if (ty != null) d.style.transform = 'translateY(' + ty + 'px)'; }
function io(t, a, b, i, o) { return eo(ramp(t, a, a + (i || .35))) * (1 - ramp(t, b - (o || .22), b)); }
var BADGE = E('badge', '<em>EP 01</em><span id="bS">शास्त्र</span><span id="bV">साइंस?</span>'); BADGE._disp = 'flex';
var HEADS = [
  [0, tA - .1, 'देवताओं की दिवाली <b>बाकी है</b>'], [tA, tQ - .1, '24 नवंबर · <b>काशी के घाट</b>'], [tQ, cK, 'यही रात <b>क्यों?</b>'],
  [cK + .3, tS - .1, 'तीन भाई. <b>तीन उड़ते शहर.</b>'], [tS, tWt - .1, 'हज़ार साल में <b>एक बार</b>'], [tWt, tT - .12, 'सही पल का <b>इंतज़ार</b>'], [tT, cD, 'तीन शहर. <b>एक तीर.</b>'],
  [cD + .3, tM - .1, 'देवताओं ने <b>दीये जलाए</b>'], [tM, tN - .1, 'कथा में <b>तारीख़ नहीं</b>'], [tN, tAs - .05, 'यह रात <b>किसने चुनी?</b>'], [tAs, cO, 'जवाब: <b>आसमान</b>'],
  [cO + .3, cS, 'आधा चक्कर = <b>15 दिन</b>'], [cS + .3, tL - .1, 'कार्तिक = <b>कृत्तिका</b>'], [tL, tY - .1, 'पिछले साल: <b>16° दूर</b>'], [tY, cR, 'इस साल: <b>2° से कम</b>'],
  [cR + .3, tR2 - .1, 'छत पर <b>एक दीया</b>'], [tR2, tV - .1, 'अंगूठे से <b>चाँद ढको</b>'], [tV, tEnd, 'कथा शास्त्र की.<br><b>तारीख़ आसमान की.</b>']
].map(function (h) { return { t0: h[0], t1: h[1], d: E('head', h[2]) }; });
var SRCS = [[0, cK, 'Paper-cut lightbox · schematic ghats, not a map'], [cK + .3, cD, 'Katha · Mahabharata, Karna Parva 33–34 · shown as cut paper'], [cD + .3, tM - .1, 'Katha · Dev Deepawali = the gods’ festival of lamps'], [tM, cO, 'Read first-hand: no date is named in these sections'],
  [cO + .3, cS, 'Not to scale · new moon 9 Nov → full moon 24 Nov, our calculation'], [cS + .3, tL - .1, 'Kartik is named after Krittika (the Pleiades)'], [tL, cR, 'Our calculation · PyEphem · Varanasi, 6–7 pm · cluster drawn brighter'], [cR + .3, tEnd, 'Illustration · the cluster is faint beside a full Moon']];
var SRC = E('src', '');
var TAGS = []; function tag(t0, t1, html, x, y, cool, anchor) { var g = { t0: t0, t1: t1, x: x, y: y, a: anchor, d: E('tag' + (cool ? ' cool' : ''), html, 'left:' + x + 'px;top:' + y + 'px') }; TAGS.push(g); return g; }
var NUM = E('num', '', 'left:162px;top:1196px'), NUM2 = E('num', '', 'left:162px;top:1150px');
var PH1 = E('card', '<img src="img/ghat-real.jpg"><p>Real photo · Dev Deepawali, Varanasi · D. P. Roy, CC0</p>', 'left:162px;top:560px;width:756px'); PH1.setAttribute('data-ov', '1');
var PH2 = E('card', '<img src="img/pleiades.jpg"><p>Real photo · NASA, ESA, AURA/Caltech</p>', 'left:162px;top:900px;width:330px'); PH2.setAttribute('data-ov', '1');
var tPh = lerp(tA, tQ, .42), tPh2 = Math.min(tPh + 2.3, tQ - .05);
tag(tA + .2, tPh - .1, '<small>Reported · Kashi</small>दीये · 24 नवंबर', 560, 1196);
// cities
var tGo = CWW('s7', 'sone'), tSi = CWW('s7', 'chaandi'), tIr = CWW('s7', 'lohe');
var CT = [tag(tGo, cD, '<small>स्वर्ग</small>सोना', 0, 0, 0, 0), tag(tSi, cD, '<small>आकाश</small>चाँदी', 0, 0, 1, 1), tag(tIr, cD, '<small>धरती</small>लोहा', 0, 0, 0, 2)];
tag(tS + .3, tWt - .1, '<small>कथा की शर्त</small>तीनों एक सीध में', 560, 1196);
// page
tag(tM + 1.0, tN - .1, '<small>महाभारत में</small>तारीख़ की जगह ख़ाली', 420, 1160);
// orrery
var tGay = CWW('s18', 'chand'), tHalf = CWW('s19', 'aadha'), tFull = CWW('s19', 'poora');
tag(tO + .5, cS, '<small>दिवाली · 9 नवंबर</small>अमावस्या', 162, 640); tag(tFull, cS, '<small>देव दीपावली · 24 नवंबर</small>पूर्णिमा', 162, 1150, 1); tag(tO + 1.2, cS, '<small>धरती</small>आप', 420, 980);
tag(tFull + .3, cS, '<small>हमारी गणना</small>15.3 दिन', 726, 872);
// sky
var tGu = CWW('s20', 'guchhe'), tKn = CWW('s20', 'krittika'), tNear = CWW('s21', 'chand'), tSol = CWW('s23', 'solah'), tDo = CWW('s24', 'do'), tTeen = CWW('s25', 'teen');
tag(tKn, cR, '<small>Ise kehte hain</small>कृत्तिका · Pleiades', 162, 520, 1);
tag(tNear + .3, tL2 - .1, '<small>कार्तिक पूर्णिमा</small>चाँद', 470, 1010);
tag(tDo, tF - .1, '<small>24 नवंबर · शाम 6–7 बजे</small>चाँद', 470, 1010);
tag(tTeen, tF - .1, '<small>दूरी</small>3–4 चाँद जितनी', 600, 800);
// the degree bar: Krittika at the right end, 16 degrees to the left
var BAR = E('tag', '', 'left:162px;top:1150px;width:756px;height:86px;padding:0;border-left:0'); BAR.setAttribute('data-ov', '1');
BAR.innerHTML = '<div style="position:absolute;left:28px;right:28px;top:52px;height:4px;background:#c9d3f2"></div>' + [0, 4, 8, 12, 16].map(function (d) { return '<div style="position:absolute;left:' + (728 - 28 - d * 43.75 - 1) + 'px;top:44px;width:3px;height:20px;background:#c9d3f2"></div><div style="position:absolute;left:' + (728 - 28 - d * 43.75 - 30) + 'px;top:8px;width:60px;text-align:center;font:800 18px Inter;color:#c9d3f2">' + d + '°</div>'; }).join('') +
  '<div id="bm" style="position:absolute;top:36px;width:36px;height:36px;border-radius:50%;background:#eaf0ff;box-shadow:0 0 18px #cfdcff"></div><div style="position:absolute;right:6px;top:66px;font:800 13px Inter;letter-spacing:.1em;color:#ffd27d">KRITTIKA</div><div id="by" style="position:absolute;left:10px;top:64px;font:800 14px Inter;letter-spacing:.1em;color:#ffd27d"></div>';
// roof
var tDi = CWW('s28', 'diya'), tAn = CWW('s29', 'angoothe'), tGc = CWW('s30', 'guchha');
tag(tDi + .2, tR2 + .6, '<small>छत पर</small>एक दीया', 162, 980);
tag(tGc, tEnd, '<small>कार्तिक का नाम</small>कृत्तिका', 720, 600, 1);
tag(tR2 + 1.1, tV - .1, '<small>साफ़ आसमान चाहिए</small>शहर में दूरबीन मदद करेगी', 520, 1196);
var FOL = E('fol', '<img src="img/profile.jpg">nerdlogic.co<em>FOLLOW</em>'); FOL._disp = 'flex';
var END = E('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="ser">Shastra ya Science? · Ep 01</div><div class="btns"><span id="eF">FOLLOW</span><span id="eS">SHARE</span></div>'); END.setAttribute('data-ov', '1');
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });

// ---------- sound events ----------
var tAl = lerp(tS, tS2, .75), EVL = [[0, 'bell'], [tA + .2, 'chime'], [tPh, 'shutter'], [tQ, 'pop'], [cK, 'click'], [tGo, 'tick'], [tSi, 'tick'], [tIr, 'tick'], [tS, 'rise'], [tAl, 'glint'], [tP, 'slide'], [tT - .55, 'hole'], [tT, 'hit'],
  [cD, 'click'], [tD + .2, 'chime'], [tD2 + .3, 'pop'], [tM, 'slide'], [tM + 1.0, 'tick'], [tAs, 'whoosh'], [cO, 'click'], [tGay, 'thud'], [tO2, 'rise'], [tFull, 'bell'], [cS, 'click'], [tGu, 'chime'], [tKn + .2, 'shutter'], [tNear, 'pop'],
  [tL2, 'slide'], [tSol, 'tick'], [tY, 'whoosh'], [tDo, 'bell'], [tTeen, 'tick'], [tTeen + .3, 'tick'], [tF2, 'pop'], [cR, 'click'], [tDi, 'glint'], [tAn, 'whoosh'], [tAn + .75, 'thud'], [tGc, 'chime'], [tV, 'bell'], [tEnd, 'pop']];
window.EV = EVL.map(function (e) { return { t: +Math.max(0, e[0]).toFixed(3), k: e[1] }; }).sort(function (a, b) { return a.t - b.t; });
window.SCN_T0 = function () { return [0, cK, cD, tM, cO, cS, tL, tY, tF, cR, tV, tEnd]; };
function inr(n) { var s = String(Math.round(n)); if (s.length <= 3) return s; var l = s.slice(-3), r = s.slice(0, -3); return r.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + l; }

// ---------- frame ----------
window.__seek = function (t) {
  t = clamp(t, 0, DUR); var ps = poseAt(t), set = ps[0], p = ps[1], st = SO[set];
  for (var k in SO) SO[k].g.visible = k === set;
  cam.position.set(st.ox + p[0], p[1], p[2]); cam.rotation.set(0, 0, 0); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
  st.em.forEach(function (m) { m.u.tm.value = t; });
  var cut = 0; SETS.forEach(function (s) { if (s[0] > 0) cut = Math.max(cut, 1 - Math.abs(t - s[0]) / .3); }); fadeEl.style.opacity = eio(clamp(cut, 0, 1));
  var fl = 0, shx = 0;
  if (set === 'ghat') {
    var hook = t < cK, dev = t >= cD && t < cO, skyb = t >= cS;
    var lit = 1, lamps = 1, rv = 2, wv = -9, clOp = 0, clRv = 2;
    if (hook) { wv = t >= tA ? lerp(-.2, 1.2, ramp(t, tA + .15, tA + 2.4)) : lerp(-.2, 1.2, ramp(t, .5, 2.6)); }
    if (dev) { var u = ramp(t, tD + .1, tD + 2.6); clOp = 1 - .6 * ramp(t, tM, tM + .6); clRv = lerp(-.05, 1.2, ramp(t, cD + .1, tD + .9)); rv = lerp(-.05, 1.2, eio(ramp(t, tD + .5, tD + 2.7))); if (t >= tM) { lit = lerp(1, .42, ramp(t, tM, tM + .5)) + .58 * ramp(t, tAs - .1, tAs + .5); lamps = lerp(1, .35, ramp(t, tM, tM + .5)) + .65 * ramp(t, tAs - .1, tAs + .5); } }
    G.sh.forEach(function (m) { if (m !== G.page) m.material.color.setScalar(lit); });
    [G.e1, G.e2, G.e3].forEach(function (m, i) { m.u.op.value = lamps; m.u.md.value = dev ? 2 : 0; m.u.rv.value = dev ? rv - i * .12 : 2; m.u.wv.value = wv; });
    G.cl.u.op.value = clOp; G.cl.u.rv.value = clRv; G.clouds.material.opacity = dev ? 1 : 0; G.clouds.sh.material.opacity = dev ? .5 : 0; G.haze.u.op.value = lit;
    // the page
    var pg = dev ? eo(ramp(t, tM, tM + .7)) * (1 - eio(ramp(t, tAs - .25, tAs + .35))) : 0; G.pageG.visible = pg > .01; G.pageG.position.set(lerp(900, 0, pg), lerp(-80, 0, pg), 0); G.pageG.rotation.z = lerp(.18, -.025, pg); G.blank.u.op.value = t >= tM + 1.0 ? .5 + .5 * Math.sin((t - tM) * 7) : 0;
    // sky chart
    var mo = 1, ho = .55, co = 0, lo = 0, ro = [0, 0], sep = 1.6, nameOp = 0;
    if (dev) { mo = 1; }
    if (skyb) {
      co = 1; G.ch.cl.u.rv.value = lerp(-.05, 1.2, ramp(t, tGu - .1, tGu + 1.2)); nameOp = eo(ramp(t, tKr + .9, tKr + 1.6)) * (1 - ramp(t, tKr2 + .2, tKr2 + .9)); G.name.u.rv.value = lerp(-.05, 1.2, ramp(t, tKr + .9, tKr + 1.9));
      mo = eo(ramp(t, tNear - .1, tNear + .5)); ho = .55 * mo;
      var out = eio(ramp(t, tL2 + .1, tL2 + 1.5)), back = eio(ramp(t, tY + .1, tDo + .15)); sep = lerp(lerp(1.6, 16, out), 1.6, back); if (t >= tL && t < tY) mo *= lerp(1, .8, ramp(t, tL, tL + .4));
      lo = .9 * ramp(t, tDo, tDo + .4); ro = [eob(ramp(t, tTeen, tTeen + .3)), eob(ramp(t, tTeen + .3, tTeen + .6))];
      if (t >= tDo && t < tDo + .5) fl = .35 * (1 - ramp(t, tDo, tDo + .5));
    } else G.ch.cl.u.rv.value = 2;
    G.name.u.op.value = nameOp; G.stars.u.op.value = skyb ? 1 : .85;
    setChart(G.ch, AF, SC, sep, -700, mo, ho, co, lo, ro, t);
  } else if (set === 'city') {
    var al = eio(ramp(t, tS + .2, tAl)), off = [-215, 195, -125], shot = t >= tT, dark = shot ? 1 - ramp(t, tT + .15, tT + 1.3) : 1;
    C.city.forEach(function (c, i) { var dr = (1 - al) * 16 * Math.sin(t * .9 + i * 2.1); c.g.position.x = off[i] * (1 - al) + dr; c.g.position.y = (1 - al) * 7 * Math.sin(t * .7 + i) - (shot ? 26 * eio(ramp(t, tT + .2, tT + 1.6)) * (i + 1) * .5 : 0); c.win.u.op.value = dark; c.gate.u.op.value = ramp(t, tAl - .1, tAl + .4) * (shot ? .35 + .65 * dark : 1) * (1 + .15 * Math.sin(t * 5)); c.sheet.material.color.setScalar(shot ? lerp(1, .55, 1 - dark) : 1); });
    var bu = eo(ramp(t, tWt, tWt + .8)), pull = eio(ramp(t, tP, tT - .1)) * (1 - ramp(t, tT, tT + .08)); C.bowG.position.y = lerp(-260, 0, bu) - 22 * pull; C.bowG.visible = t >= tWt - .05;
    C.ray.u.rv.value = shot ? lerp(0, 1.05, eo(ramp(t, tT, tT + .22))) : 0; C.ray.u.op.value = shot ? 1 - .75 * ramp(t, tT + .8, tT + 2.2) : 0;
    if (shot) { fl = .8 * (1 - ramp(t, tT + .02, tT + .5)); shx = 9 * Math.sin((t - tT) * 60) * (1 - ramp(t, tT, tT + .4)); }
  } else if (set === 'orr') {
    var d = 15 * eio(ramp(t, tO2 + .1, tFull + .1)), a = -Math.PI / 2 + d / 15 * Math.PI, mx = EX + Math.cos(a) * OR, my = EY + Math.sin(a) * OR, k20 = kz(-20), ph = d / 15;
    O.mG.position.set((mx - 540) * k20 - 0 * k20, (960 - my) * k20, 0); O.mDark.position.set(0, 0, -20); O.mDark.sh.position.set(0, -30 * kz(-24), -24);
    phaseDraw(O.mC.getContext('2d'), ph, 56, 64, 64); O.mT.needsUpdate = true; O.mLit.position.set(0, 0, -16); O.mLit.scale.setScalar(74 * kz(-16)); O.mLit.u.op.value = 1;
    at(O.mHalo, mx, my, -18, 300); O.mHalo.u.op.value = .5 * ph * ph + (d >= 15 ? .25 * (1 + Math.sin(t * 4)) * .5 : 0);
    O.arc.u.rv.value = ph + .005; O.st.forEach(function (s) { var u = eob(ramp(t, tO2 + .1 + (tFull - tO2) * 0 + 0, 1e9) * 0 + ramp(d, s.d, s.d + .6)); s.g.visible = d > s.d + .3; s.e.u.op.value = Math.min(1, u); });
    O.sun.u.op.value = 1 + .08 * Math.sin(t * 3); if (d >= 15 && t < tFull + .6) fl = .3 * (1 - ramp(t, tFull + .1, tFull + .6));
  } else {
    var lit2 = eo(ramp(t, tDi - .05, tDi + .5)), hu = eo(ramp(t, tAn - .1, tAn + .8)), cov = ramp(t, tAn + .45, tAn + .9), rev = eo(ramp(t, tAn + .7, tAn + 1.6));
    F.flame.u.op.value = lit2; F.glow.u.op.value = lit2 * (1 + .06 * Math.sin(t * 9)); F.handG.position.y = lerp(-1500, 0, hu) + 6 * Math.sin(t * 1.3) * hu; F.handG.position.x = 4 * Math.sin(t * .9) * hu;
    setChart(F.ch, [RM[0] + .5 * 1.6 * RSC, RM[1] - .866 * 1.6 * RSC], RSC, 1.6, -700, 1 - eo(ramp(t, tEnd, tEnd + .4)), .6 * (1 - .78 * cov) * (1 - eo(ramp(t, tEnd, tEnd + .4))), .28 + 1.2 * rev, 0, [0, 0], t); F.ch.cl.u.rv.value = 2;
    F.stars.u.op.value = .7 + .5 * rev; F.win.u.op.value = 1;
    var endU0 = eo(ramp(t, tEnd, tEnd + .5)); F.sh.forEach(function (m) { m.material.color.setScalar(1 - .5 * endU0); }); F.hand.material.color.setRGB(.5 * (1 - .5 * endU0), .4 * (1 - .5 * endU0), .46 * (1 - .5 * endU0)); F.handG.visible = endU0 < .5;
  }
  R.render(S, cam);
  document.getElementById('stage').style.transform = shx ? 'translateX(' + shx.toFixed(1) + 'px)' : ''; flashEl.style.opacity = fl;
  scrB.style.opacity = 1;
  // ----- overlays -----
  var endU = eo(ramp(t, tEnd, tEnd + .5));
  show(BADGE, 1 - endU); document.getElementById('bS').className = t >= tD2 + .3 ? 'on' : ''; document.getElementById('bV').className = t >= tDo ? 'on' : ''; var bp = t >= tV ? 1 + .05 * Math.sin((t - tV) * 6) * (1 - ramp(t, tV + 1.2, tV + 1.6)) : 1; BADGE.style.transform = 'scale(' + bp + ')'; BADGE.style.transformOrigin = '0 50%';
  HEADS.forEach(function (h) { var u = t >= h.t0 && t < h.t1 ? (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .3))) * (1 - ramp(t, h.t1 - .18, h.t1)) * (1 - endU) : 0; show(h.d, u, (1 - (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .3)))) * 18); });
  var s = null; SRCS.forEach(function (q) { if (t >= q[0] && t < q[1]) s = q; }); if (s) { SRC.textContent = s[2]; show(SRC, (s[0] === 0 ? 1 : ramp(t, s[0], s[0] + .4)) * (1 - ramp(t, s[1] - .2, s[1])) * (1 - endU)); } else show(SRC, 0);
  TAGS.forEach(function (g) { var u = t >= g.t0 && t < g.t1 ? io(t, g.t0, g.t1) * (1 - endU) : 0; if (u > .005 && g.a != null) { var c = C.city[g.a], q = proj(C, 200, c.cy - 96, c.z, c.g.position.x); g.d.style.left = clamp(q[0], 162, 700).toFixed(1) + 'px'; g.d.style.top = clamp(q[1] + c.g.position.y * -1, 480, 1200).toFixed(1) + 'px'; } show(g.d, u); });
  // lamp counter (hook)
  var nu = t < cK ? 1 - ramp(t, cK - .25, cK) : 0; if (nu > 0) { var n = t < tA ? 1000000 : 1000000; NUM.innerHTML = (t < tA + .2 ? '' : '') + inr(t < tA ? 0 : Math.round(1000000 * eo(ramp(t, tA + .15, tA + 2.2)) / 1000) * 1000) + (t >= tA + 2.2 ? '+' : ''); show(NUM, t >= tA + .15 && (t < tPh - .1 || t >= tPh2) ? nu * ramp(t, tA + .15, tA + .4) : 0); } else show(NUM, 0);
  // thousand-year dial / day counter
  if (set === 'city' && t >= tS && t < tT) { NUM2.innerHTML = '<small>' + (t < tAl ? 'साल' : 'एक सीध') + '</small>' + inr(Math.round(1000 * eio(ramp(t, tS + .2, tAl)))); show(NUM2, io(t, tS + .1, tWt + .1) * (t < tS + .3 ? 0 : 1) * 0); NUM2.style.top = '500px'; NUM2.style.left = '700px'; show(NUM2, io(t, tS + .15, tWt - .1)); }
  else if (set === 'orr' && t >= tO2) { var dd = 15 * eio(ramp(t, tO2 + .1, tFull + .1)); NUM2.innerHTML = '<small>दिन</small>' + (dd >= 15 ? '15' : dd.toFixed(0)); NUM2.style.top = '500px'; NUM2.style.left = '162px'; show(NUM2, io(t, tO2, cS)); }
  else show(NUM2, 0);
  show(PH1, io(t, tPh, tPh2, .3, .25), 0); PH1.style.transform = 'rotate(' + (-1.2 + .4 * ramp(t, tPh, tPh2)) + 'deg) scale(' + (.96 + .04 * eo(ramp(t, tPh, tPh + .4))) + ')';
  show(PH2, io(t, tKn + .2, Math.min(tKn + 2.6, tNear - .15), .3, .25), 0); PH2.style.transform = 'rotate(-2deg)';
  // degree bar
  var bu2 = set === 'ghat' ? io(t, tL2, tF - .15) : 0; show(BAR, bu2); if (bu2 > 0) { var sp = lerp(lerp(1.6, 16, eio(ramp(t, tL2 + .1, tL2 + 1.5))), 1.6, eio(ramp(t, tY + .1, tDo + .15))); document.getElementById('bm').style.left = (728 - 28 - sp * 43.75 - 18) + 'px'; document.getElementById('by').textContent = t < tY ? '2025 · 16°' : (t >= tDo ? '2026 · UNDER 2°' : ''); }
  var fu = eob(ramp(t, tF2 - .1, tF2 + .35)) * (1 - ramp(t, cR - .3, cR - .05)); show(FOL, fu > .01 ? Math.min(1, fu) : 0); FOL.style.transform = 'scale(' + (fu * (1 + .03 * Math.sin((t - tF2) * 6))).toFixed(3) + ')'; FOL.style.transformOrigin = '0 50%';
  show(END, endU, (1 - endU) * 30); if (endU > 0) { document.getElementById('eF').style.transform = 'scale(' + eob(ramp(t, tEnd + .15, tEnd + .5)) * (1 + .04 * Math.sin((t - tEnd) * 4.2)) + ')'; document.getElementById('eS').style.transform = 'scale(' + eob(ramp(t, tEnd + .4, tEnd + .75)) * (1 + .04 * Math.sin((t - tEnd) * 4.2 + 1.5)) + ')'; }
  capEl.innerHTML = t < TM.groups[TM.groups.length - 1].end + .4 ? CAP.html(t, CAPW, { plain: true, hi: '#ffc659', ink: '#f1f3f8', fs: 40, width: 756 }) : '';
};
window.__dbg = function (c) { return eval(c); };
window.__seek(0); window.__ready = true;
})();
