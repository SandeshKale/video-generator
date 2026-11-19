/* "Nakli shehar, asli jagah" — GTA VI x Florida. One three.js world; studio sets at x offsets; authored camera keys; word-timed cues. Pure function of t. */
(function () {
var T = THREE, V3 = T.Vector3, W = 1080, H = 1920;
var clamp = function (x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); };
var ramp = function (t, a, b) { return clamp((t - a) / (b - a)); }, eo3 = function (x) { return 1 - Math.pow(1 - clamp(x), 3); }, eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
var eob = function (x) { x = clamp(x); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; }); function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
window.__cue = [];
function CW(id, w, nth) { var n = nth || 0; for (var i = 0; i < TM.cap.length; i++) if (TM.cap[i].s === id && TM.cap[i].w.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(w) === 0) { if (n-- === 0) return TM.cap[i].t0; } window.__cue.push(id + ':' + w); return ST(id) + .4; }
var DUR = TM.end; window.__reelDurationSec = DUR; window.EV = []; function ev(t, k) { window.EV.push({ t: t, k: k }); }
var TB = ST('s2') - .2, TC = ST('s3') - .2, TD = ST('s4') - .2, TE = ST('s5') - .2, TF = ST('s6') - .2, TG = ST('s8') - .2, TH = ST('s9') - .2, TEND = CW('s10', 'nerdlogic') - .3;
window.SCN_T0 = function () { return [0, TB, TC, TD, TE, TF, TG, TH, DUR]; };
var CUTS = [TB, TC, TD, TF, TG, TH];
var R = new T.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true }); R.setSize(W, H, false); R.setPixelRatio(1); R.outputColorSpace = T.SRGBColorSpace;
var S = new T.Scene(), CAM = new T.PerspectiveCamera(38, W / H, .05, 600);
var OV = document.getElementById('stage');
function mk(h, c) { var d = document.createElement('div'); d.className = c; d.innerHTML = h; OV.appendChild(d); return d; }
var texL = new T.TextureLoader();
function tex(u) { var t = texL.load(u); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
function txt(str, font, col, w, h, ppu) { var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'); g.font = font; g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, w / 2, h / 2); var t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return new T.Mesh(new T.PlaneGeometry(w / ppu, h / ppu), new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); }
/* ---- Florida plane (origin) ---- */
var PW = 8.02, PH = 9, FL = new T.Group(); S.add(FL);
var night = new T.Mesh(new T.PlaneGeometry(PW, PH), new T.MeshBasicMaterial({ map: tex('img/fl_night.jpg') })); night.rotation.x = -Math.PI / 2; FL.add(night);
var day = new T.Mesh(new T.PlaneGeometry(PW, PH), new T.MeshBasicMaterial({ map: tex('img/fl_true.jpg'), transparent: true, opacity: 0 })); day.rotation.x = -Math.PI / 2; day.position.y = .002; FL.add(day);
function ll(lon, lat) { return new V3((lon + 88) / 9 * PW - PW / 2, 0, -(lat - 26.5)); }
var MIA = ll(-80.19, 25.78), KEYS = ll(-81.1, 24.72), EVG = ll(-80.95, 25.75);
function beam(p, col, h) { var m = new T.Mesh(new T.CylinderGeometry(.012, .012, h, 8), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 })); m.position.set(p.x, h / 2, p.z); FL.add(m); var r = new T.Mesh(new T.RingGeometry(.07, .085, 48), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, side: T.DoubleSide })); r.rotation.x = -Math.PI / 2; r.position.set(p.x, .012, p.z); FL.add(r); return { b: m, r: r }; }
var bMIA = beam(MIA, 0xffa21f, .7), bKEY = beam(KEYS, 0xffa21f, .7), bEVG = beam(EVG, 0xffa21f, .7);
var rMIA = new T.Mesh(new T.RingGeometry(.1, .115, 64), new T.MeshBasicMaterial({ color: 0xffa21f, transparent: true, opacity: 0 })); rMIA.rotation.x = -Math.PI / 2; rMIA.position.set(MIA.x, .01, MIA.z); FL.add(rMIA);
/* alligator dots: 130 instanced, 1 dot = 10,000 (illustrative); cluster in the Everglades then spread along the peninsula spine */
var NG = 130, gMesh = new T.InstancedMesh(new T.SphereGeometry(.016, 10, 8), new T.MeshBasicMaterial({ color: 0xffa21f }), NG); gMesh.frustumCulled = false; FL.add(gMesh);
function hs(k) { var x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var SPINE = [[-87, 30.4], [-85, 30.3], [-83.5, 30.0], [-82.4, 29.4], [-81.7, 28.2], [-81.5, 27.2], [-81.2, 26.4], [-80.95, 25.75]].map(function (p) { return ll(p[0], p[1]); });
function spinePt(f) { var s = f * (SPINE.length - 1), i = Math.min(SPINE.length - 2, Math.floor(s)), u = s - i; return SPINE[i].clone().lerp(SPINE[i + 1], u); }
var gA = [], gB = [];
for (var gi = 0; gi < NG; gi++) { var a = hs(gi) * 6.283, r = Math.sqrt(hs(gi + 500)) * .5; gA.push(new V3(EVG.x + Math.cos(a) * r * .8, .02, EVG.z + Math.sin(a) * r)); var q = spinePt(hs(gi + 900)); gB.push(new V3(q.x + (hs(gi + 1300) - .5) * .5, .02, q.z + (hs(gi + 1700) - .5) * .5)); }
var gDum = new T.Object3D();
/* ---- studio materials ---- */
S.add(new T.HemisphereLight(0x9ed6ff, 0x203040, .95)); var sun = new T.DirectionalLight(0xffc27a, 1.8); sun.position.set(-30, 40, 30); S.add(sun);
function studio(x) { var g = new T.Group(); g.position.x = x; S.add(g); var gnd = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshStandardMaterial({ color: 0x0c2a40, roughness: .9 })); gnd.rotation.x = -Math.PI / 2; g.add(gnd); var gr = new T.GridHelper(400, 80, 0x1c5a7a, 0x103a52); gr.position.y = .02; g.add(gr); return g; }
/* ---- B: pillars ---- */
var OB = 200, SB = studio(OB), slabsV = [], slabsT = [];
var SL_H = .5, SLG = new T.BoxGeometry(3.6, SL_H - .07, 3.6);
function pillar(x, n, col) { var arr = []; for (var i = 0; i < Math.ceil(n); i++) { var f = n - i >= 1 ? 1 : n - i; var m = new T.Mesh(new T.BoxGeometry(3.6, (SL_H - .07) * f, 3.6), new T.MeshStandardMaterial({ color: col, roughness: .45, emissive: col, emissiveIntensity: .12 })); m.position.set(x, i * SL_H + (SL_H - .07) * f / 2, 0); m.visible = false; SB.add(m); arr.push(m); } return arr; }
slabsV = pillar(-7, 22, 0x2fb3b0); slabsT = pillar(7, 47.5, 0xffa21f);
/* ---- C: arena + sign + helicopter ---- */
var OC = 400, SC_ = studio(OC);
var bowl = new T.Mesh(new T.CylinderGeometry(15, 17, 9, 64), new T.MeshStandardMaterial({ color: 0xd9e4ea, roughness: .55 })); bowl.scale.z = .72; bowl.position.y = 4.5; SC_.add(bowl);
var roofM = new T.Mesh(new T.CylinderGeometry(15.4, 15.4, .8, 64), new T.MeshStandardMaterial({ color: 0x2fb3b0, roughness: .4, metalness: .3 })); roofM.scale.z = .72; roofM.position.y = 9.4; SC_.add(roofM);
var band = new T.Mesh(new T.CylinderGeometry(17.05, 17.05, 1.2, 64, 1, true), new T.MeshBasicMaterial({ color: 0xffa21f, side: T.DoubleSide })); band.scale.z = .72; band.position.y = 6.2; SC_.add(band);
var sign = new T.Group(); SC_.add(sign);
sign.add(new T.Mesh(new T.BoxGeometry(17, 5.2, .8), new T.MeshStandardMaterial({ color: 0x0a1018, roughness: .5 })));
var sf1 = txt('WELCOME TO', '800 150px Man', '#ffa21f', 1500, 260, 100); sf1.position.set(0, 1.35, .45); sign.add(sf1);
var sf2 = txt('VICE CITY', '800 210px Man', '#2fe0d6', 1500, 300, 100); sf2.position.set(0, -.95, .45); sign.add(sf2);
sign.add(new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(17.4, 5.6, 1)), new T.LineBasicMaterial({ color: 0xffa21f })));
var heli = new T.Group(); SC_.add(heli);
var hb = new T.Mesh(new T.CapsuleGeometry(1.1, 3, 6, 12), new T.MeshStandardMaterial({ color: 0xe8452c, roughness: .4 })); hb.rotation.z = Math.PI / 2; heli.add(hb);
var tailM = new T.Mesh(new T.BoxGeometry(4.2, .3, .3), new T.MeshStandardMaterial({ color: 0xe8452c })); tailM.position.set(-3.8, .2, 0); heli.add(tailM);
var rotor = new T.Mesh(new T.CylinderGeometry(4.2, 4.2, .05, 32), new T.MeshBasicMaterial({ color: 0xcfe6f2, transparent: true, opacity: .25 })); rotor.position.y = 1.5; heli.add(rotor);
var blade = new T.Mesh(new T.BoxGeometry(8.4, .06, .22), new T.MeshBasicMaterial({ color: 0xcfe6f2 })); blade.position.y = 1.56; heli.add(blade);
var cab = [0, 1, 2, 3].map(function () { var l = new T.Mesh(new T.CylinderGeometry(.03, .03, 1, 4), new T.MeshBasicMaterial({ color: 0xffa21f })); SC_.add(l); return l; });
/* ---- F: parchment ---- */
var OF = 600, SF = studio(OF);
var par = new T.Mesh(new T.BoxGeometry(11, .15, 9), new T.MeshStandardMaterial({ color: 0xe9d9b6, roughness: .9 })); SF.add(par);
var X21 = -3, X35 = 3, ZA = 1.4;
function pm(w, d, col, x, z, y) { var m = new T.Mesh(new T.BoxGeometry(w, .05, d), new T.MeshBasicMaterial({ color: col })); m.position.set(x, y || .12, z); SF.add(m); return m; }
function ptx(s, font, col, w, h, x, z) { var m = txt(s, font, col, w, h, 100); m.rotation.x = -Math.PI / 2; m.position.set(x, .14, z); SF.add(m); return m; }
var axisM = pm(8.4, .08, 0x2b2119, 0, ZA), k21 = pm(.09, 1.3, 0x2b2119, X21, ZA), k35 = pm(.09, 1.3, 0xa02a15, X35, ZA), spanBar = pm(1, .18, 0xe8452c, 0, .75, .13);
var t21 = ptx('1521', '800 120px Man', '#2b2119', 640, 180, X21, 2.65), t35 = ptx('1535', '800 120px Man', '#a02a15', 640, 180, X35, 2.65);
var l21 = ptx('PONCE DIES', '700 48px Az', '#2b2119', 480, 80, X21 + 1.1, -.2), l35 = ptx('STORY WRITTEN', '700 48px Az', '#a02a15', 520, 80, X35 - 1.2, -.2);
var yrs = ptx('14 YEARS', '800 150px Man', '#a02a15', 700, 200, 0, -1.0), ttl = ptx('FOUNTAIN OF YOUTH?', '800 80px Man', '#2b2119', 900, 120, 0, -3.5);
var stamp = new T.Group(); SF.add(stamp);
stamp.add(new T.Mesh(new T.BoxGeometry(4.6, .5, 2.0), new T.MeshStandardMaterial({ color: 0xe8452c, roughness: .5 })));
var stT = txt('MYTH', '800 230px Man', '#fff3ea', 700, 300, 100); stT.rotation.x = -Math.PI / 2; stT.position.y = .27; stamp.add(stT);
var stFace = txt('MYTH', '800 230px Man', 'rgba(190,45,28,0.92)', 700, 300, 100); stFace.rotation.x = -Math.PI / 2; stFace.position.set(0, .09, -2.4); SF.add(stFace);
/* ---- H: consoles ---- */
var OH = 800, SH = studio(OH);
function bx(g, w, h, d, col, x, y, z) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshStandardMaterial({ color: col, roughness: .4, metalness: .2 })); m.position.set(x, y, z); g.add(m); return m; }
var ps = new T.Group(); bx(ps, 3, 9, 1.8, 0xe8eef2, 0, 4.5, 0); bx(ps, .5, 9.4, 2, 0x1a2a3a, 1.1, 4.7, 0); ps.position.set(-4.4, 0, 0); ps.scale.setScalar(.8); SH.add(ps);
var xb = new T.Group(); bx(xb, 3.4, 7, 3.4, 0x111820, 0, 3.5, 0); var xl = new T.Mesh(new T.CircleGeometry(1, 32), new T.MeshBasicMaterial({ color: 0x2fe07a })); xl.rotation.x = -Math.PI / 2; xl.position.set(0, 7.02, 0); xb.add(xl); xb.position.set(4.4, 0, 0); xb.scale.setScalar(.8); SH.add(xb);
var mon = new T.Group(); mon.position.set(0, 0, 0); mon.scale.setScalar(.5); SH.add(mon); var scr = new T.Mesh(new T.BoxGeometry(8, 5, .3), new T.MeshStandardMaterial({ color: 0x1a2430, roughness: .5 })); scr.position.y = 5; mon.add(scr); var stand = new T.Mesh(new T.BoxGeometry(.6, 2.2, .6), new T.MeshStandardMaterial({ color: 0x1a2430 })); stand.position.y = 1.1; mon.add(stand);
var nod = txt('NO DATE', '800 160px Man', '#ff8c6a', 900, 220, 100); nod.position.set(0, 5, .2); mon.add(nod);
function gring(x, col) { var r = new T.Mesh(new T.RingGeometry(2.1, 2.5, 48), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, side: T.DoubleSide })); r.rotation.x = -Math.PI / 2; r.position.set(x, .06, 0); SH.add(r); return r; }
var gR1 = gring(-4.4, 0x2fe07a), gR2 = gring(4.4, 0x2fe07a), gR3 = gring(0, 0xff6a4a);
var okP = txt('✓', '800 220px Inter', '#2fe07a', 300, 300, 100); okP.position.set(-9, 11.3, 1.1); SH.add(okP); var okX = okP.clone(); okX.position.set(9, 9.3, 1.8); SH.add(okX);
/* ---- camera keys ---- */
var K = [];
function key(t, p, l, fov) { K.push({ t: t, p: new V3(p[0], p[1], p[2]), l: new V3(l[0], l[1], l[2]), f: fov || 38 }); }
var MX = MIA.x, MZ = MIA.z, CB = [0, 7.7, 80];
key(0, [1.3, 11, -.76], [1.3, 0, -1]); key(TB - .5, [MX, 2.4, MZ + 2.03], [MX, 0, MZ - .65]); key(TB - .01, [MX, 2.4, MZ + 2.03], [MX, 0, MZ - .65]);
key(TB, [OB, 7.7, 80], [OB, 7.7, 0]); key(TC - .2, [OB, 7.7, 80], [OB, 7.7, 0]);
key(TC, [OC - 14, 26, 120], [OC, 9, 0]); key(CW('s3', 'helicopter') + 3.0, [OC + 6, 7.7, 84], [OC, 7.7, 0]); key(TD - .2, [OC + 6, 7.7, 84], [OC, 7.7, 0]);
key(TD, [2.1, 5.0, 2.5], [2.1, 0, 1.4]); key(TE - .3, [2.1, 5.0, 2.5], [2.1, 0, 1.4]); key(TE + 1.8, [EVG.x + .1, 2.4, EVG.z + 2.1], [EVG.x + .05, 0, EVG.z - .2]); key(TF - .3, [EVG.x + .1, 2.4, EVG.z + 2.1], [EVG.x + .05, 0, EVG.z - .2]);
key(TF, [OF, 44, 14], [OF, 0, 2.2]); key(TF + 3.2, [OF, 40, 12.9], [OF, 0, 2.3]); key(TG - .2, [OF, 40, 12.9], [OF, 0, 2.3]);
key(TG, [1.9, 8.5, 4.6], [1.9, 0, 1.0]); key(TH - .2, [1.9, 8.5, 4.6], [1.9, 0, 1.0]);
key(TH, [OH, 2.1, 42], [OH, 2.1, 0]); key(DUR + 5, [OH, 2.1, 42], [OH, 2.1, 0]);
function camAt(t) {
  var i = 0; for (var j = 0; j < K.length; j++) if (t >= K[j].t) i = j;
  var a = K[i], b = K[Math.min(K.length - 1, i + 1)]; var u = b.t > a.t ? eio((t - a.t) / (b.t - a.t)) : 0;
  CAM.position.lerpVectors(a.p, b.p, u); var l = new V3().lerpVectors(a.l, b.l, u); CAM.fov = a.f + (b.f - a.f) * u; CAM.updateProjectionMatrix(); CAM.lookAt(l);
}
/* ---- DOM ---- */
var eyeEl = mk('', 'eye'), headEl = mk('', 'head'), srcEl = mk('', 'src'), capEl = mk('', 'cap'), dip = mk('', 'dip'); capEl.id = 'cap'; dip.setAttribute('data-ov', '1');
var endEl = mk('<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="eF">FOLLOW</span><span id="eS">SHARE</span></div>', 'endc'); endEl.style.display = 'none';
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
var LBL = [];
function L(html, col, tOn, tOff, f, cls) { var e = mk(html, 'lb' + (cls ? ' ' + cls : '')); e.style.color = col; e.style.borderColor = col; e.style.display = 'none'; LBL.push({ e: e, tOn: tOn, tOff: tOff, f: f }); return e; }
function proj(p) { var v = p.clone().project(CAM); return [(v.x * .5 + .5) * W, (-v.y * .5 + .5) * H]; }
function setT(e, h) { if (e._h !== h) { e.innerHTML = h; e._h = h; } }
/* world->screen anchored labels; f(t) -> {p:V3 world (abs), dx, dy, u} or {x,y,u} px */
var HD = [
  [0, TB, 'Real place · NASA night lights', 'नकली शहर,<br><i>असली</i> जगह', 'Florida · VIIRS Black Marble · NASA GIBS'],
  [TB, TC, 'The numbers · GTA V vs trailer 2', 'GTA 5: <i>22 करोड़+</i>', '1 slab = 1 crore · Take-Two figures'],
  [TC, TD, 'Miami · arena roof', 'छत पर उतरा<br><i>Vice City</i>', 'Sign drawn by us · deal reported · Local10, WLRN'],
  [TD, TE, 'Game map ↔ real map · reported mapping', 'लियोनिडा = <i>फ़्लोरिडा</i>', 'Mapping reported by press, not a Rockstar table'],
  [TE, TF, 'Everglades · FWC estimate', '<i>13 लाख</i> मगरमच्छ', 'FWC, UF-IFAS estimate · dots illustrative'],
  [TF, TG, 'The famous story · Florida', 'जवानी का झरना?', 'History.com · NPS · New World Encyclopedia'],
  [TG, TH, 'Fake city · real place', '<i>नकली</i> शहर<br>असली जगह', 'Vice City = Miami (reported) · fountain story = myth'],
  [TH, 1e9, 'Where to play it · launch day', 'सिर्फ़ <i>PS5</i> और Xbox', 'Via press reports · India price not confirmed']
];
function hdIdx(t) { var r = 0; HD.forEach(function (h, i) { if (t >= h[0]) r = i; }); return r; }
/* labels */
var tS1 = CW('s1', 'duniya'), tMia = CW('s4', 'miami');
L('GAME · VICE CITY<small>REAL · MIAMI</small>', '#ffa21f', CW('s4', 'vice'), TE - .3, function () { var p = proj(MIA.clone().setY(.7)); return { x: p[0] + 36, y: p[1] - 150 }; });
L('GAME · LEONIDA KEYS<small>REAL · FLORIDA KEYS</small>', '#2fe0d6', CW('s4', 'leonida', 1), TE - .3, function () { var p = proj(KEYS.clone().setY(.7)); return { x: p[0] + 30, y: p[1] - 90 }; });
L('GAME · GRASSRIVERS<small>REAL · EVERGLADES</small>', '#ffd27a', CW('s4', 'grassrivers'), TE - .3, function () { var p = proj(EVG.clone().setY(.7)); return { x: p[0] - 400, y: p[1] - 160 }; });
L('1 DOT = 10,000 GATORS<small>ILLUSTRATIVE · FWC ESTIMATE ~1.3 M</small>', '#ffa21f', CW('s5', 'terah'), TF - .3, function () { return { x: 162, y: 1120 }; });
var cnt = L('0 / 67 COUNTIES', '#2fe0d6', CW('s5', 'zile'), TF - .3, function () { return { x: 162, y: 1190 }; }, 'big');
L('HIS OWN RECORDS: <b>NO FOUNTAIN</b>', '#ffa21f', CW('s6', 'kaagzon'), TG - .3, function () { return { x: 162, y: 1090 }; });
L('FIRST TIED TO HIM IN 1535 · HE DIED 1521', '#2fe0d6', CW('s7', 'jharne'), TG - .3, function () { return { x: 162, y: 1165 }; });
L('FAKE CITY · VICE CITY', '#ffa21f', CW('s8', 'nakli'), TH - .3, function () { var p = proj(MIA.clone().setY(.9)); return { x: p[0] + 40, y: p[1] - 130 }; });
L('REAL PLACE · MIAMI, FLORIDA', '#2fe0d6', CW('s8', 'asli'), TH - .3, function () { var p = proj(MIA.clone().setY(.1)); return { x: p[0] + 40, y: p[1] + 50 }; });
L('FAKE LEGEND · FOUNTAIN OF YOUTH', '#ff6a4a', CW('s8', 'nikli'), TH - .3, function () { return { x: 162, y: 1225 }; });
var lPS = L('PS5 ✓', '#2fe07a', CW('s9', 'ps5'), TEND, function () { return { x: 162, y: 500 }; }, 'big');
var lXB = L('XBOX SERIES ✓', '#2fe07a', CW('s9', 'xbox'), TEND, function () { return { x: 520, y: 620 }; }, 'big');
L('PC · NO DATE ANNOUNCED', '#ff8c6a', CW('s9', 'pc'), TEND, function () { return { x: 330, y: 770 }; });
L('INDIA ₹5,999 · REPORTED<small>NOT CONFIRMED BY ROCKSTAR/SONY · CHECK PS STORE</small>', '#ffa21f', CW('s9', 'paanch'), TEND - .3, function () { return { x: 162, y: 1165 }; });
/* pillar labels */
L('GTA V · COPIES SOLD<small>TAKE-TWO · ~220 M · 22 SLABS</small>', '#2fe0d6', CW('s2', 'baais'), TC - .3, function (w) { return { x: 162, y: 700 }; });
L('TRAILER 2 · 24 H VIEWS<small>ALL PLATFORMS · TAKE-TWO CLAIM<br>47.5 CRORE</small>', '#ffa21f', CW('s2', 'saintaalis'), TC - .3, function (w) { return { x: 732 - 70 - w, y: 430 }; });
L('$975,000 · REPORTED', '#ffa21f', CW('s3', 'saade'), TD - .3, function () { return { x: 162, y: 1175 }; });
L('WORDS BARRED: "GRAND THEFT AUTO"', '#2fe0d6', CW('s3', 'poora'), TD - .3, function () { return { x: 162, y: 1235 }; });
function vis(arr) { var n = 0; arr.forEach(function (m) { if (m.visible) n++; }); return n; }
/* events */
ev(.05, 'hit'); CUTS.forEach(function (c) { ev(c - .12, 'whoosh'); });
for (var si = 0; si < 22; si++) ev(CW('s2', 'baais') + .1 + si * .09, 'tick');
for (var sj = 0; sj < 16; sj++) ev(CW('s2', 'saintaalis') + sj * .17, 'tick');
var tLand = CW('s3', 'helicopter') + 2.6; ev(tLand, 'thud'); ev(CW('s4', 'vice') + .45, 'ping'); ev(CW('s4', 'leonida', 1) + .5, 'ping'); ev(CW('s4', 'grassrivers') + .6, 'ping');
ev(CW('s5', 'zile'), 'tick'); ev(CW('s7', 'mithak'), 'stamp'); ev(CW('s8', 'nikli'), 'stamp'); ev(CW('s9', 'ps5'), 'ping'); ev(CW('s9', 'xbox'), 'ping'); ev(CW('s9', 'paanch'), 'tick'); ev(TEND, 'ping');
/* ---- seek ---- */
window.__seek = function (t) {
  var sc = 'A'; if (t >= TB) sc = 'B'; if (t >= TC) sc = 'C'; if (t >= TD) sc = 'D'; if (t >= TE) sc = 'E'; if (t >= TF) sc = 'F'; if (t >= TG) sc = 'G'; if (t >= TH) sc = 'H';
  S.background = new T.Color(sc === 'A' ? 0x040a14 : 0x071a2b);
  FL.visible = sc === 'A' || sc === 'D' || sc === 'E' || sc === 'G'; SB.visible = sc === 'B'; SC_.visible = sc === 'C'; SF.visible = sc === 'F'; SH.visible = sc === 'H';
  /* A: relight */
  var dayO = sc === 'A' ? eio(ramp(t, TB - 1.6, TB - .4)) * .0 : .9; day.material.opacity = dayO; if (sc === 'A') night.material.opacity = 1;
  var rp = (t * 1.1) % 1; var rs = 1 + rp * 4; rMIA.scale.set(rs, rs, rs); rMIA.material.opacity = (sc === 'A' ? ramp(t, ST('s1') + 4.6, ST('s1') + 5.2) : 0) * (1 - rp) * (sc === 'A' ? 1 : 0);
  function beamSet(b, on) { b.b.material.opacity = eo3(on) * .9; b.r.material.opacity = eo3(on) * .9; b.b.scale.y = Math.max(.001, eo3(on)); b.b.position.y = .35 * eo3(on); }
  var onM = sc === 'D' ? ramp(t, CW('s4', 'vice'), CW('s4', 'vice') + .5) : (sc === 'G' ? 1 : (sc === 'E' ? 1 : 0));
  beamSet(bMIA, onM); beamSet(bKEY, sc === 'D' || sc === 'E' ? ramp(t, CW('s4', 'leonida', 1), CW('s4', 'leonida', 1) + .5) : 0); beamSet(bEVG, sc === 'D' || sc === 'E' ? ramp(t, CW('s4', 'grassrivers'), CW('s4', 'grassrivers') + .5) : 0);
  if (sc === 'E') { bMIA.b.material.opacity = 0; bMIA.r.material.opacity = 0; bKEY.b.material.opacity = 0; bKEY.r.material.opacity = 0; }
  /* E: gators */
  gMesh.visible = sc === 'E';
  if (sc === 'E') {
    var e0 = CW('s5', 'terah'), sp = eio(ramp(t, CW('s5', 'zile') - .1, CW('s5', 'zile') + 1.6));
    for (var g = 0; g < NG; g++) { var born = ramp(t, e0 + g * .012, e0 + g * .012 + .25); var p = gA[g].clone().lerp(gB[g], sp); p.x += Math.sin(t * .8 + g) * .01 * (1 - sp); p.z += Math.cos(t * .7 + g * 1.3) * .01 * (1 - sp); gDum.position.copy(p); gDum.scale.setScalar(Math.max(.0001, born * (1 + .2 * Math.sin(t * 3 + g)))); gDum.updateMatrix(); gMesh.setMatrixAt(g, gDum.matrix); }
    gMesh.instanceMatrix.needsUpdate = true;
    cnt.firstChild.nodeValue = Math.round(67 * eo3(ramp(t, CW('s5', 'zile'), CW('s5', 'zile') + 1.4))) + ' / 67 COUNTIES';
  }
  /* B: slabs */
  if (sc === 'B') {
    var tb0 = CW('s2', 'baais'), tb1 = CW('s2', 'saintaalis');
    slabsV.forEach(function (m, i) { var a = tb0 + i * .09; m.visible = t >= a; var u = eob(ramp(t, a, a + .25)); if (m.visible) m.scale.set(1, Math.max(.01, u), 1); });
    slabsT.forEach(function (m, i) { var a = tb1 + i * .06; m.visible = t >= a; var u = eob(ramp(t, a, a + .22)); if (m.visible) m.scale.set(1, Math.max(.01, u), 1); });
  }
  /* C: sign + heli */
  if (sc === 'C') {
    var tl = CW('s3', 'helicopter'), u = eio(ramp(t, tl, tl + 2.6)), by = sign.position.y;
    sign.position.set(0, 12.3 + 11 * (1 - u), 8.2); sign.rotation.z = Math.sin(t * 3) * .03 * (1 - u); heli.position.set(0, sign.position.y + 7 + 14 * ramp(t, tl + 2.6, tl + 4.6), 8.2); rotor.rotation.y = t * 30; blade.rotation.y = t * 40;
    var ends = [[-8, 1], [8, 1], [-8, -1], [8, -1]];
    cab.forEach(function (c, i) { var a = new V3(heli.position.x + (i % 2 ? 1 : -1) * .6, heli.position.y - 1.2, heli.position.z), b = new V3(sign.position.x + ends[i][0], sign.position.y + ends[i][1] * 2.6, sign.position.z); var d = b.clone().sub(a), Ln = d.length(); c.scale.set(1, Ln, 1); c.position.copy(a.clone().add(b).multiplyScalar(.5)); c.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); c.visible = t < tl + 2.7; });
  }
  /* F: parchment */
  if (sc === 'F') {
    var tk = ST('s6'); function pop(m, a) { var e = eob(ramp(t, a, a + .4)); m.visible = t >= a; m.scale.set(e, 1, e); }
    pop(t21, tk + .3); pop(l21, tk + .5); pop(ttl, tk); k21.visible = t >= tk + .3; axisM.visible = t >= tk + .2;
    var tp = CW('s7', 'pehli'), uu = eo3(ramp(t, tp, tp + 1.6)), wv = (X35 - X21) * uu; spanBar.scale.x = Math.max(.001, wv); spanBar.position.x = X21 + wv / 2; spanBar.visible = t >= tp; k35.visible = t >= tp; pop(t35, tp + 1.3); pop(l35, tp + 1.4);
    var ty = CW('s7', 'chaudah'); pop(yrs, ty);
    var tm = CW('s7', 'mithak'), dr = ramp(t, tm - .35, tm); stamp.position.set(0, .3 + 8 * (1 - dr * dr), -2.4); stamp.visible = t > tm - .4 && t < tm + .15; stFace.visible = t >= tm; stT.visible = true;
  }
  /* H */
  if (sc === 'H') { okP.visible = false; okX.visible = false; gR1.material.opacity = .9 * eo3(ramp(t, CW('s9', 'ps5'), CW('s9', 'ps5') + .5)) * (.6 + .4 * Math.sin(t * 5)); gR2.material.opacity = .9 * eo3(ramp(t, CW('s9', 'xbox'), CW('s9', 'xbox') + .5)) * (.6 + .4 * Math.sin(t * 5 + 1)); gR3.material.opacity = .9 * eo3(ramp(t, CW('s9', 'pc'), CW('s9', 'pc') + .5)) * (.6 + .4 * Math.sin(t * 5 + 2)); nod.visible = t >= CW('s9', 'pc'); okP.scale.setScalar(eob(ramp(t, CW('s9', 'ps5'), CW('s9', 'ps5') + .4))); okX.scale.setScalar(eob(ramp(t, CW('s9', 'xbox'), CW('s9', 'xbox') + .4))); }
  camAt(t);
  var sh = 0; if (sc === 'F') { var tm2 = CW('s7', 'mithak'); if (t >= tm2 && t < tm2 + .3) sh = Math.sin((t - tm2) * 90) * (1 - (t - tm2) / .3) * .12; } CAM.position.y += sh; CAM.position.x += sh * .6;
  if (!window.__skipRender) R.render(S, CAM);
  /* DOM */
  var hi = HD[hdIdx(t)]; setT(eyeEl, hi[2]); setT(headEl, (sc === 'F' && t >= CW('s7', 'mithak')) ? 'झरना: <i>मिथक</i>' : hi[3]); setT(srcEl, hi[4]);
  headEl.style.opacity = 1;
  LBL.forEach(function (o) {
    var on = t >= o.tOn && t < o.tOff && t < TEND + 5; if (!on) { o.e.style.display = 'none'; return; }
    o.e.style.display = 'block'; var w = o.e.offsetWidth, h = o.e.offsetHeight, p = o.f(w, h), u = eob(ramp(t, o.tOn, o.tOn + .45)) * (t > o.tOff - .25 ? clamp((o.tOff - t) / .25) : 1);
    var x = Math.max(156, Math.min(918 - w, p.x)), y = Math.max(232, Math.min(1290 - h, p.y)); o.e.style.left = x + 'px'; o.e.style.top = y + 'px'; o.e.style.opacity = clamp(u * 1.4); o.e.style.transform = 'scale(' + (.85 + .15 * Math.min(1, u)).toFixed(3) + ')';
  });
  capEl.innerHTML = t >= TEND ? '' : window.CAP.html(t, CAPW, { plain: true, hi: '#ffa21f', ink: '#eef3f6', fs: 40, width: 756 });
  var d = 0; CUTS.forEach(function (c) { if (t >= c - .2 && t < c) d = Math.max(d, (t - (c - .2)) / .2); else if (t >= c && t < c + .22) d = Math.max(d, 1 - (t - c) / .22); }); dip.style.opacity = d;
  var e2 = eo3(ramp(t, TEND, TEND + .5)); endEl.style.display = e2 > 0 ? 'block' : 'none'; endEl.style.opacity = e2; endEl.style.transform = 'translateY(' + ((1 - e2) * 30) + 'px)';
  document.getElementById('eF').style.transform = 'scale(' + (eob(ramp(t, TEND + .15, TEND + .5)) * (1 + .04 * Math.sin((t - TEND) * 4.2))).toFixed(3) + ')';
  document.getElementById('eS').style.transform = 'scale(' + (eob(ramp(t, TEND + .4, TEND + .75)) * (1 + .04 * Math.sin((t - TEND) * 4.2 + 1.5))).toFixed(3) + ')';
};
window.__ready = false; setTimeout(function () { window.__ready = true; window.__seek(0); }, 900);
})();
