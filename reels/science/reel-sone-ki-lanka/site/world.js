/* Sone ki Lanka — "Itna sona hai bhi?"  three.js r160. Style: data-physical + teardown, in a bright white-and-gold palace under a real sunrise panorama.
   Every number is built as real objects at computed scale (brick -> cube -> village); the cube and a palace gate are taken apart on one axis. Pure function of t (window.__seek). */
(function () {
var T = THREE, W = 1080, H = 1920, TM = window.TM, IM = window.IM;
var clamp = function (x, a, b) { return Math.min(b == null ? 1 : b, Math.max(a || 0, x)); };
var eio = function (x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
var eo = function (x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
var eob = function (x) { x = clamp(x); var c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
var lerp = function (a, b, u) { return a + (b - a) * u; };
var ramp = function (t, a, b) { return clamp((t - a) / (b - a)); };
var hsh = function (i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
var inr = function (n) { n = Math.round(n); var s = String(n), l = s.slice(-3), r = s.slice(0, -3); return r ? r.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + l : l; };
var glc = document.getElementById('gl');
var R = new T.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = T.SRGBColorSpace; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.15; R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
var S = new T.Scene(), cam = new T.PerspectiveCamera(30, W / H, .08, 6000), V = function (x, y, z) { return new T.Vector3(x, y, z); };
var ov = document.getElementById('ov'), svg = document.getElementById('lines'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');

// ---------- timing ----------
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
function CW(id, frac) { var s = SEN[id], tt = s.t0 + (s.t1 - s.t0) * frac, best = tt, bd = .6; for (var k = s.k0; k <= s.k1; k++) { var d = Math.abs(TM.words[k][1] - tt); if (d < bd) { bd = d; best = TM.words[k][1]; } } return best; }
var DUR = TM.end; window.__reelDurationSec = DUR;

// ---------- real textures ----------
var TXC = {};
function tx(n, rep, srgb) { var k = n + '|' + (rep || '') + '|' + (srgb ? 1 : 0); if (TXC[k]) return TXC[k]; var t = new T.Texture(IM[n]); if (srgb) t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; if (rep) t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; t.needsUpdate = true; return TXC[k] = t; }
function pbr(base, rep, o) { return new T.MeshStandardMaterial(Object.assign({ map: tx('tex/' + base + '_diff.jpg', rep, true), normalMap: tx('tex/' + base + '_nor.jpg', rep), roughnessMap: tx('tex/' + base + '_rough.jpg', rep), roughness: 1, metalness: 0 }, o || {})); }
// light: the real sunrise panorama plus a true-HDR sun so gold gets hard glints
var envT = tx('tex/aarfontein_sunrise.jpg', null, true); envT.mapping = T.EquirectangularReflectionMapping;
(function () { var pm = new T.PMREMGenerator(R), EO = new T.Scene(), sk = new T.Mesh(new T.SphereGeometry(100, 48, 24), new T.MeshBasicMaterial({ map: envT, side: T.BackSide })); sk.scale.x = -1; EO.add(sk);
  var sun = new T.Mesh(new T.SphereGeometry(5, 16, 8), new T.MeshBasicMaterial({ color: new T.Color(0xffd9a0).multiplyScalar(90) })); sun.position.set(55, 42, 60); EO.add(sun);
  var sun2 = new T.Mesh(new T.SphereGeometry(9, 16, 8), new T.MeshBasicMaterial({ color: new T.Color(0xfff2d8).multiplyScalar(14) })); sun2.position.set(-70, 30, 50); EO.add(sun2);
  S.environment = pm.fromScene(EO, 0).texture; })();
S.background = envT; S.backgroundBlurriness = .02; S.backgroundIntensity = 1.25; S.fog = new T.Fog(0xf3dcc0, 420, 1700);
S.add(new T.HemisphereLight(0xfff4e0, 0xd8c8a8, .9));
var key = new T.DirectionalLight(0xffe6bc, 3.4); key.castShadow = true; key.shadow.mapSize.set(4096, 4096); key.shadow.bias = -.0004; key.shadow.normalBias = .03; S.add(key); S.add(key.target);
var LDIR = V(.5, .68, .54).normalize();
function shadowBox(c, r) { key.position.copy(c).addScaledVector(LDIR, r * 3); var sc = key.shadow.camera; sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = .1; sc.far = r * 8; key.target.position.copy(c); key.target.updateMatrixWorld(); sc.updateProjectionMatrix(); }

// ---------- materials ----------
var gold = new T.MeshStandardMaterial({ color: 0xffc04a, metalness: 1, roughness: .16, roughnessMap: tx('tex/metal_plate_rough.jpg', [.6, .6]), envMapIntensity: 1.9 });
gold.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace('#include <roughnessmap_fragment>', 'float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n roughnessFactor = roughness * (0.75 + 0.9 * texture2D( roughnessMap, vRoughnessMapUv ).g);\n#endif'); };
var goldF = new T.MeshStandardMaterial({ color: 0xffc04a, metalness: 1, roughness: .2, envMapIntensity: 1.8 });
var brass = new T.MeshStandardMaterial({ color: 0xc4963f, metalness: 1, roughness: .3, envMapIntensity: 1.6 });
function brickNormals(cols, rows, rep) { var c = document.createElement('canvas'); c.width = 2048; c.height = 2048; var g = c.getContext('2d'), cw = 2048 / cols, rh = 2048 / rows; for (var y = 0; y < rows; y++) for (var x = -1; x < cols; x++) { var i = y * 131 + x * 17, nx = (hsh(i) - .5) * .16, ny = (hsh(i + 9.1) - .5) * .16; g.fillStyle = 'rgb(' + Math.round((nx + 1) * 127.5) + ',' + Math.round((ny + 1) * 127.5) + ',255)'; g.fillRect((x + (y % 2) * .5) * cw, y * rh, cw, rh); g.fillStyle = 'rgba(96,96,200,.9)'; g.fillRect((x + (y % 2) * .5) * cw, y * rh, cw, 2); g.fillRect((x + (y % 2) * .5) * cw, y * rh, 2, rh); } var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; return t; }
var NSLAB = brickNormals(14, 6, [7, 1]), NHOUSE = brickNormals(10, 20, [2.6, 2]);
var slabMat = goldF.clone(); slabMat.normalMap = NSLAB; var houseMat = goldF.clone(); houseMat.normalMap = NHOUSE; var roofMat = goldF.clone(); roofMat.color.set(0xf0b040); roofMat.roughness = .3;
var clay = pbr('red_brick_03', [.16, .1]), marble = function (rep, o) { return pbr('marble_01', rep, Object.assign({ roughness: .42, color: 0xfff6ea }, o || {})); }, stoneM = function (rep) { return pbr('white_sandstone_blocks_02', rep, { color: 0xfffaf0 }); };
var BW = .23, BH = .075, BD = .11;

// ---------- palace kit ----------
function mesh(geo, mat, par, x, y, z) { var m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = m.receiveShadow = true; (par || S).add(m); return m; }
function floor(par, cx, size, rep) { var m = new T.Mesh(new T.PlaneGeometry(size, size), marble([rep, rep])); m.rotation.x = -Math.PI / 2; m.position.set(cx, 0, 0); m.receiveShadow = true; par.add(m); return m; }
function column(par, x, z, h, r) { mesh(new T.CylinderGeometry(r * .86, r, h, 24), stoneM([2, Math.max(1, Math.round(h / (r * 3)))]), par, x, h / 2 + r * .5, z); mesh(new T.BoxGeometry(r * 2.6, r * .5, r * 2.6), stoneM([1, 1]), par, x, r * .25, z); mesh(new T.CylinderGeometry(r * 1.45, r * .9, r * .9, 24), goldF, par, x, h + r * .95, z); mesh(new T.BoxGeometry(r * 3, r * .35, r * 3), goldF, par, x, h + r * 1.55, z); }
function colonnade(par, x, z0, n, gap, h, r) { for (var i = 0; i < n; i++) { column(par, x, z0 - i * gap, h, r); if (i < n - 1) { var ar = mesh(new T.TorusGeometry(gap / 2 - r * .9, r * .28, 12, 36, Math.PI), goldF, par, x, h + r * 1.7, z0 - i * gap - gap / 2); ar.rotation.y = Math.PI / 2; } }
  mesh(new T.BoxGeometry(r * 3.2, r * 1.6, gap * (n - 1) + r * 3.2), stoneM([Math.max(1, Math.round(gap * n / 3)), 1]), par, x, h + r * 1.7 + gap / 2 + r * .6, z0 - gap * (n - 1) / 2); mesh(new T.BoxGeometry(r * 3.5, r * .3, gap * (n - 1) + r * 3.5), goldF, par, x, h + r * 1.7 + gap / 2 + r * 1.55, z0 - gap * (n - 1) / 2); }
function person(par, x, z, col) { var g = new T.Group(); mesh(new T.BoxGeometry(.42, .6, .24), new T.MeshStandardMaterial({ color: col, roughness: .8 }), g, 0, 1.1, 0); mesh(new T.BoxGeometry(.38, .8, .22), new T.MeshStandardMaterial({ color: 0x33384a, roughness: .8 }), g, 0, .4, 0); mesh(new T.BoxGeometry(.28, .28, .28), new T.MeshStandardMaterial({ color: 0x9a6a48, roughness: .8 }), g, 0, 1.56, 0); g.position.set(x, 0, z); par.add(g); return g; }

// ---------- story clock ----------
var t2 = ST('s2'), t3 = ST('s3'), t4 = ST('s4'), t5 = ST('s5'), t5g = CW('s5', .3), t6 = ST('s6'), t7 = ST('s7'), t8 = ST('s8'), t8b = CW('s8', .6), t9 = ST('s9'), t10 = ST('s10'), t11 = ST('s11'), t12 = ST('s12'), t12b = CW('s12', .5),
  t13 = ST('s13'), t13b = CW('s13', .6), t14 = ST('s14'), t14b = CW('s14', .75), t15 = ST('s15'), t16 = ST('s16'), t17 = ST('s17'), t17b = CW('s17', .3), t17c = CW('s17', .62), t17d = CW('s17', .88), t18 = ST('s18'), t19 = ST('s19'), t20 = ST('s20'), t20b = CW('s20', .45),
  t21 = ST('s21'), t22 = ST('s22'), t22b = CW('s22', .6), t23 = ST('s23'), t24 = ST('s24'), t25 = ST('s25'), t25b = CW('s25', .45), t26 = ST('s26'), t26b = CW('s26', .55), t27 = ST('s27');
var tS1 = Math.min(2.5, t2 + 1.2);   // the film still is on screen for at most 2.5 s each time
var XA = 0, XB = 500, XD = 2000, XF = -300, Cb = 22.5, NL = 9, LH = Cb / NL, HX = XB + 34, HZ = 5, VX = XB + 170;

// ---------- station A: palace hall — the film's throne still, then the balance ----------
var GA = new T.Group(); S.add(GA); floor(GA, XA, 160, 34); colonnade(GA, -6.2, 4, 6, 3.6, 6.2, .42); colonnade(GA, 6.2, 4, 6, 3.6, 6.2, .42);
var imS = IM['film/lanka-28.jpg'], SW = 5.0, SH = SW * imS.height / imS.width;
var FS = new T.Mesh(new T.PlaneGeometry(SW, SH), new T.MeshBasicMaterial({ map: tx('film/lanka-28.jpg', null, true), toneMapped: false })); FS.position.set(0, 3.7, -6); GA.add(FS);
var FR = mesh(new T.BoxGeometry(SW + .22, SH + .22, .1), goldF, GA, 0, 3.7, -6.06);
var PLN = new T.Group(); GA.add(PLN); mesh(new T.CylinderGeometry(1.5, 1.6, .5, 64), marble([2, 1], { roughness: .35 }), PLN, 0, .25, 0);
var BAL = new T.Group(); BAL.position.set(0, .5, 0); PLN.add(BAL); mesh(new T.CylinderGeometry(.3, .38, .1, 48), brass, BAL, 0, .05, 0); mesh(new T.CylinderGeometry(.035, .05, 1.3, 24), brass, BAL, 0, .72, 0);
var BEAM = new T.Group(); BEAM.position.y = 1.36; BAL.add(BEAM); mesh(new T.BoxGeometry(2.3, .05, .06), brass, BEAM);
var HANG = [-1, 1].map(function (sd) { var hang = new T.Group(); hang.position.set(sd * 1.1, 0, 0); BEAM.add(hang); for (var k = 0; k < 3; k++) { var a = k * 2.094, ch = mesh(new T.CylinderGeometry(.007, .007, .78, 6), brass, hang, Math.cos(a) * .17, -.37, Math.sin(a) * .17); ch.rotation.z = Math.cos(a) * .42; ch.rotation.x = -Math.sin(a) * .42; } mesh(new T.CylinderGeometry(.36, .3, .035, 48), brass, hang, 0, -.74, 0); return hang; });
var CLAYB = mesh(new T.BoxGeometry(BW, BH, BD), clay, HANG[0], 0, -.74 + .018 + BH * 1.75 / 2, 0); CLAYB.scale.setScalar(1.75); CLAYB.rotation.y = -.35;
var GOLDB = mesh(new T.BoxGeometry(BW, BH, BD), gold, HANG[1], 0, 0, 0); GOLDB.scale.setScalar(1.75); GOLDB.rotation.y = .35;

// ---------- station B: the palace square — all the gold as one cube, then taken apart into a village ----------
var GB = new T.Group(); S.add(GB); floor(GB, XB + 150, 2400, 500); colonnade(GB, XB - 36, 30, 8, 9, 15, 1.1);
colonnade(GB, VX - 200, -150, 8, 26, 46, 3.2); colonnade(GB, VX + 200, -150, 8, 26, 46, 3.2);
var LAY = []; for (var k = 0; k < NL; k++) LAY.push(mesh(new T.BoxGeometry(Cb, LH * .985, Cb), slabMat, GB, XB, 0, 0));
var pitch = new T.Mesh(new T.PlaneGeometry(3.05, 20.12), new T.MeshStandardMaterial({ color: 0xb9d38a, roughness: 1 })); pitch.rotation.x = -Math.PI / 2; pitch.position.set(XB + 17, .03, 3); pitch.receiveShadow = true; GB.add(pitch);
[-1, 1].forEach(function (e) { for (var q = -1; q <= 1; q++) mesh(new T.CylinderGeometry(.04, .04, .71, 8), new T.MeshStandardMaterial({ color: 0x8a5a2a }), GB, XB + 17 + q * .115, .36, 3 + e * 10.06); });
var CLH = new T.Group(); mesh(new T.BoxGeometry(6, 3, 4.5), pbr('red_brick_03', [3, 1.5]), CLH, 0, 1.5, 0); mesh(new T.BoxGeometry(6.6, .22, 5.1), new T.MeshStandardMaterial({ color: 0x9a9084, roughness: .9 }), CLH, 0, 3.1, 0); mesh(new T.BoxGeometry(1, 2, .08), new T.MeshStandardMaterial({ color: 0x2f5d6b, roughness: .7 }), CLH, -.8, 1, 2.27); CLH.position.set(XB - 18, 0, 10); CLH.rotation.y = .3; GB.add(CLH);
person(GB, XB + 12.5, 13, 0xd4521c); person(GB, XB + 3, 14.5, 0x2e7d6b); person(GB, XB - 11.8, 14, 0xe7b53c); person(GB, HX - 5.5, HZ + 4.5, 0x7a2f5a);
// the brick stream (teardown): bricks leave the lifted layers and fly to the first house
var NS = 2400, STR = new T.InstancedMesh(new T.BoxGeometry(.9, .32, .44), goldF, NS); STR.castShadow = true; STR.frustumCulled = false; GB.add(STR);
// the first house, built row by row, then the village: 600 houses at 10,000 bricks each
var H0W = mesh(new T.BoxGeometry(6, 3, 4.5), houseMat, GB, HX, 1.5, HZ), H0R = mesh(new T.BoxGeometry(6.6, .26, 5.1), roofMat, GB, HX, 3.13, HZ), H0D = mesh(new T.BoxGeometry(1, 2, .1), new T.MeshStandardMaterial({ color: 0x8a5a1c, metalness: 1, roughness: .35 }), GB, HX - .8, 1, HZ + 2.27);
var NH = 600, HM = new T.InstancedMesh(new T.BoxGeometry(6, 3, 4.5), houseMat, NH), HR = new T.InstancedMesh(new T.BoxGeometry(6.6, .26, 5.1), roofMat, NH), HD = new T.InstancedMesh(new T.BoxGeometry(1, 2, .1), H0D.material, NH); HM.castShadow = HM.receiveShadow = HR.castShadow = true; HM.frustumCulled = HR.frustumCulled = HD.frustumCulled = false; GB.add(HM); GB.add(HR); GB.add(HD);
var HP = []; (function () { var k5 = 0; for (var gx = -15; gx < 15; gx++) for (var gz = -10; gz < 10; gz++) { var x = VX + gx * 11 + (hsh(k5 * 3.1) - .5) * 3 + (Math.abs(gx) % 5 === 0 ? 5 : 0), z = gz * 9.5 + (hsh(k5 * 5.7) - .5) * 2.4 + (Math.abs(gz) % 4 === 0 ? 5 : 0); HP.push({ x: x, z: z, hh: .85 + hsh(k5 * 2.3) * .5, ry: (hsh(k5 * 7.3) - .5) * .3, d: Math.hypot(x - HX, z - HZ) }); k5++; } HP.sort(function (a, b) { return a.d - b.d; }); HP = HP.filter(function (p) { return p.d > 9; }).slice(0, NH - 1); })();
var M4 = new T.Matrix4(), Q4 = new T.Quaternion(), E4 = new T.Euler(), YAX = V(0, 1, 0), ONE = V(1, 1, 1), ZERO = V(0, 0, 0);

// ---------- station D: a palace gate — solid gold? no: white stone, and a thin gold skin lifted off it ----------
var GD = new T.Group(); S.add(GD); floor(GD, XD, 260, 56); colonnade(GD, XD - 13, -5, 5, 4.4, 7.4, .5); colonnade(GD, XD + 13, -5, 5, 4.4, 7.4, .5);
var GATE = new T.Group(); GATE.position.set(XD, 0, 0); GD.add(GATE);
[-1, 1].forEach(function (sd) { mesh(new T.BoxGeometry(1.0, 5.2, 1.0), stoneM([1, 2]), GATE, sd * 1.9, 2.6, 0); mesh(new T.BoxGeometry(3.4, 4.2, .8), stoneM([2, 2]), GATE, sd * 4.1, 2.1, -.1); mesh(new T.BoxGeometry(1.1, 1.1, .1), new T.MeshStandardMaterial({ color: 0x4a321e, roughness: .8 }), GATE, sd * 4.1, 2.5, .3); });
mesh(new T.BoxGeometry(5.0, .9, 1.05), stoneM([3, 1]), GATE, 0, 5.65, 0); mesh(new T.BoxGeometry(2.76, 3.9, .12), new T.MeshStandardMaterial({ color: 0x6a4428, roughness: .7 }), GATE, 0, 1.95, -.15);
mesh(new T.SphereGeometry(1.25, 40, 20, 0, 6.283, 0, 1.57), stoneM([3, 1]), GATE, 0, 6.1, 0);
var skinM = goldF.clone(); skinM.side = T.DoubleSide; skinM.roughness = .16; skinM.emissive = new T.Color(0x4a3006);
function curved(w, h, bow) { var g = new T.PlaneGeometry(w, h, 16, 1), p = g.attributes.position; for (var i = 0; i < p.count; i++) { var u = p.getX(i) / w; p.setZ(i, bow * (1 - 4 * u * u)); } g.computeVertexNormals(); return g; }
var SKN = [];   // [mesh, rest position, lift direction, lift distance, order]
function skin(geo, x, y, z, dir, dist, ord) { var m = mesh(geo, skinM, GATE, x, y, z); m.receiveShadow = false; SKN.push({ m: m, p: V(x, y, z), d: dir, L: dist, o: ord }); return m; }
skin(curved(2.76, 3.9, .1), 0, 1.95, -.07, V(0, 0, 1), 2.4, 0);
[-1, 1].forEach(function (sd) { skin(curved(1.02, 5.2, .1), sd * 1.9, 2.6, .52, V(sd * .35, 0, 1), 3.4, 1); skin(curved(1.1, 1.1, .03), sd * 4.1, 2.5, .37, V(sd * .3, 0, 1), 2.6, 2); skin(curved(3.4, .34, .02), sd * 4.1, 4.36, .32, V(sd * .2, .5, 1), 2.4, 3); });
skin(new T.TorusGeometry(1.42, .16, 18, 64, Math.PI), 0, 4.0, .2, V(0, .15, 1), 4.3, 2);
skin(curved(5.0, .9, .1), 0, 5.65, .54, V(0, .3, 1), 5.0, 3);
skin(new T.SphereGeometry(1.28, 40, 20, 0, 6.283, 0, 1.57), 0, 6.1, 0, V(0, 1, 0), 2.6, 4);
var FIN = mesh(new T.ConeGeometry(.3, .9, 8), goldF, GATE, 0, 7.7, 0);
// mithai with silver leaf (the everyday version of the same idea)
var MIT = new T.Group(); MIT.position.set(XD + 7, 0, 62); GD.add(MIT); mesh(new T.CylinderGeometry(.5, .56, .95, 40), marble([1, 1]), MIT, 0, .475, 0); mesh(new T.CylinderGeometry(.44, .4, .03, 48), brass, MIT, 0, .965, 0);
var silver = new T.MeshStandardMaterial({ color: 0xf4f4f4, metalness: 1, roughness: .28, envMapIntensity: 1.6 }), barfi = new T.MeshStandardMaterial({ color: 0xf3e3c2, roughness: .85 });
for (var b = 0; b < 7; b++) { var bx = (b % 3 - 1) * .2 + (Math.floor(b / 3) % 2) * .1, bz = (Math.floor(b / 3) - 1) * .2, by = b === 6 ? 1.07 : .995; if (b === 6) { bx = 0; bz = 0; } var bf = mesh(new T.BoxGeometry(.17, .06, .17), barfi, MIT, bx, by + .015, bz); bf.rotation.y = .78 + (hsh(b) - .5) * .2; var sv = mesh(new T.PlaneGeometry(.165, .165), silver, MIT, bx, by + .047, bz); sv.rotation.x = -Math.PI / 2; sv.rotation.z = bf.rotation.y; }
// one gram of gold becomes a leaf the size of a small window
mesh(new T.BoxGeometry(2.2, 2.9, .45), stoneM([1, 1]), GD, XD + 10.6, 1.45, 60.4); mesh(new T.BoxGeometry(.8, .8, .06), new T.MeshStandardMaterial({ color: 0x6a4428, roughness: .7 }), GD, XD + 10.6, 1.6, 60.64);
var BEAD = mesh(new T.SphereGeometry(.06, 24, 12), gold, GD, 0, 0, 0), LEAF = mesh(curved(.74, .74, .02), skinM, GD, 0, 0, 0);

// ---------- station F: the almirah ----------
var GF = new T.Group(); S.add(GF); floor(GF, XF, 160, 34); colonnade(GF, XF - 5.4, -1, 5, 3.6, 6.2, .42); colonnade(GF, XF + 5.4, -1, 5, 3.6, 6.2, .42);
var steel = new T.MeshStandardMaterial({ color: 0x8fa39a, metalness: .7, roughness: .42, envMapIntensity: 1.1 }), dark = new T.MeshStandardMaterial({ color: 0x2a2f2c, roughness: .8 });
var ALM = new T.Group(); ALM.position.set(XF, 0, -.6); GF.add(ALM); mesh(new T.BoxGeometry(1.3, 2.1, .06), steel, ALM, 0, 1.05, -.27); mesh(new T.BoxGeometry(.06, 2.1, .6), steel, ALM, -.65, 1.05, 0); mesh(new T.BoxGeometry(.06, 2.1, .6), steel, ALM, .65, 1.05, 0); mesh(new T.BoxGeometry(1.36, .06, .6), steel, ALM, 0, 2.1, 0); mesh(new T.BoxGeometry(1.36, .08, .6), steel, ALM, 0, .04, 0); mesh(new T.BoxGeometry(1.24, 2.0, .02), dark, ALM, 0, 1.05, -.23);
for (var sh = 0; sh < 3; sh++) { mesh(new T.BoxGeometry(1.24, .03, .52), steel, ALM, 0, .55 + sh * .5, -.02); for (var q2 = 0; q2 < 8; q2++) { var gb = mesh(new T.BoxGeometry(BW, BH, BD), gold, ALM, -.42 + (q2 % 4) * .28, .565 + sh * .5 + BH / 2 + Math.floor(q2 / 4) * (BH + .004), .02 + (hsh(q2 + sh * 9) - .5) * .06); gb.rotation.y = (hsh(q2 * 3 + sh) - .5) * .25; if (sh === 2 && q2 === 6) gb.visible = false; } }
var DOORS = [-1, 1].map(function (sd) { var piv = new T.Group(); piv.position.set(sd * .65, 1.05, .3); ALM.add(piv); mesh(new T.BoxGeometry(.65, 2.04, .04), steel, piv, -sd * .325, 0, 0); mesh(new T.BoxGeometry(.03, .26, .05), brass, piv, -sd * .58, 0, .04); return piv; });
mesh(new T.BoxGeometry(1.5, .28, .9), marble([1, 1]), GF, XF, .14, 1.35);
var NINE = []; for (var n9 = 0; n9 < 9; n9++) { var nb = mesh(new T.BoxGeometry(BW, BH, BD), gold, GF, 0, 0, 0); nb.scale.setScalar(1.5); NINE.push(nb); }

// ---------- camera: authored shots, locked between moves ----------
function P(c, az, el, d, up) { var a = az * Math.PI / 180, e = el * Math.PI / 180; return { p: V(c.x + d * Math.sin(a) * Math.cos(e), c.y + d * Math.sin(e), c.z + d * Math.cos(a) * Math.cos(e)), l: V(c.x, c.y - (up == null ? .021 : up) * d, c.z) }; }
var PO = {
  f0: P(V(0, 3.7, -6), 9, 3, 17), f1: P(V(0, 3.7, -6), -5, 1, 15.6),
  b0: P(V(0, 1.3, 0), 10, 14, 14), b1: P(V(0, 1.3, 0), -4, 6, 11), b2: P(V(.25, 1.2, 0), -14, 4, 9.6),
  c0: P(V(XB - 2, 9.2, 0), 52, 6, 150), c1: P(V(XB + 1, 9.6, 0), 30, 2.5, 142), c2: P(V(XB + 6, 8.8, 0), 12, 2.5, 128),
  d0: P(V(XB + 8, 21, 0), 24, 4, 205), h0: P(V(HX, 2.3, HZ), 30, 8, 44), v0: P(V(HX + 40, 0, 6), 28, 16, 190, .05), v1: P(V(VX - 6, 0, 4), 26, 11, 320, .07),
  g0: P(V(XD, 4.2, .6), 8, 4, 30), g1: P(V(XD, 4.6, 2.2), -30, 6, 33), g2: P(V(XD + 7, 1.2, 62), 28, 13, 6.4), g3: P(V(XD + 10.4, 1.5, 61.2), 24, 6, 6.6),
  a0: P(V(XF, 1.0, .4), -12, 6, 10.4), a1: P(V(XF, .95, .5), 6, 8, 9.6), a2: P(V(XF, 1.0, .4), -4, 5, 12.5)
};
var MOVES = [
  [0, tS1, 'f0', 'f1'],                                  // slow arc across the film still
  [tS1, tS1 + 1.2, 'f1', 'b0'], [t3 - .2, t3 + 1.5, 'b0', 'b1'],      // crane down to the balance, settle
  [t5 - .3, t5 + 1.6, 'b1', 'b2'],                       // macro push to the gold pan as it drops
  [t6 - .5, t6 + .7, 'b2', 'c0'], [t6 + .7, t8 + .6, 'c0', 'c1'],     // whip to the square, low orbit as the cube is stacked
  [t9 - .3, t9 + 1.4, 'c1', 'c2'],                       // truck toward the cricket pitch
  [t10 - .2, t10 + 1.8, 'c2', 'd0'],                     // crane up and back as the cube opens
  [t12 - .5, t12 + 1.1, 'd0', 'h0'],                     // push in on the first house
  [t13 - .2, t13 + 1.6, 'h0', 'v0'], [t13 + 1.6, t14 + 1.2, 'v0', 'v1'],   // pull back: the houses become a village
  [t15 - .5, t15 + .7, 'v1', 'g0'],                      // whip to the palace gate
  [t17 - .2, t18 + 1.6, 'g0', 'g1'],                     // slow orbit while the parts are named and the skin lifts
  [t19 - .4, t19 + .9, 'g1', 'g2'],                      // down to the mithai
  [t20 - .4, t20 + .9, 'g2', 'g3'],                      // across to the window
  [t22 - 1.0, t22 - .1, 'g3', 'f0'], [t22 - .1, t22 + 2.4, 'f0', 'f1'],    // back to the film still
  [t22 + 2.4, t22 + 3.3, 'f1', 'a0'],                    // whip to the almirah
  [t25 - .2, t25 + 1.6, 'a0', 'a1'],                     // push in as the doors open
  [t27 - .3, t27 + 1.6, 'a1', 'a2']
];
function camAt(t, c) { var cur = PO.f0, a = null, u = 0; for (var i = 0; i < MOVES.length; i++) { var m = MOVES[i]; if (t >= m[0]) { if (t < m[1]) { a = PO[m[2]]; cur = PO[m[3]]; var x = (t - m[0]) / (m[1] - m[0]); u = (m[1] - m[0]) > 1.9 ? x * .4 + eio(x) * .6 : eio(x); } else { cur = PO[m[3]]; a = null; } } }
  if (a) { c.position.copy(a.p).lerp(cur.p, u); c.lookAt(a.l.clone().lerp(cur.l, u)); } else { c.position.copy(cur.p); c.lookAt(cur.l); } c.updateMatrixWorld(); }
var cam0 = new T.PerspectiveCamera(30, W / H, .08, 6000), v3 = new T.Vector3();
function scr(p) { v3.copy(p).project(cam); return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H }; }

// ---------- DOM overlays ----------
function el(cls, html) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; d.style.display = 'none'; ov.appendChild(d); return d; }
var HEADS = [
  [0, t3 - .1, 'Ramayana · Part 1 · Ravan ka sinhasan', 'Sone ki Lanka.<br>Itna <b>sona</b><br>hai bhi?'],
  [t3 + .2, t6 - .4, 'Naap ki ikaai · ek eent', 'Ghar ki eent: 3 kilo.<br>Sone ki eent:<br><b>37 kilo</b>.'],
  [t6 + .5, t10 - .1, 'Duniya ka saara sona · ek jagah', 'Sirf ek dibba.<br><b>22 metre</b> ka.'],
  [t10 + .3, t12 - .4, 'Ab ise khol ke dekhte hain', 'Dibba khula.<br><b>60 lakh</b> eentein.'],
  [t12 + .4, t13 - .1, 'Ek pakka ghar', 'Ek ghar mein<br><b>10,000</b> eent.'],
  [t13 + .5, t15 - .4, 'Wahi sona · eenton ke ghar', 'Saara sona:<br>sirf <b>600 ghar</b>.<br>Ek gaon.'],
  [t15 + .5, t18 - .1, 'To kya sone ki Lanka jhooth hai?', 'Valmiki: safed mahal,<br><b>sone</b> ke darwaze.'],
  [t18 + .1, t22 - 1.0, 'Lanka ko khol ke dekhte hain', 'Thos nahi.<br>Sone ki <b>parat</b>.'],
  [t22 - .1, t22 + 2.5, 'Film walon ne bhi yahi kiya', 'Sinhasan: fibre.<br>Upar sone ka <b>vark</b>.'],
  [t24, t27 - .2, 'Asli sone ki Lanka', 'Har 9 mein se<br><b>1 eent</b> hamari.']
].map(function (h) { return { t0: h[0], t1: h[1], k: el('kick', '<i></i>' + h[2]), h: el('head', h[3]) }; });
var HUD = el('hud', ''), SRC = el('src', ''), FOL = el('fol', '<img src="img/profile.jpg">nerdlogic.co<em>FOLLOW</em>');
var SRCS = [[0, tS1 + .3, 'film still © Prime Focus Studios · DNEG · via TMDB · shown for comment'], [t3 + .2, t6 - .4, 'our arithmetic: brick 23 × 11 × 7.5 cm · gold 19.3 g per cm³'],
  [t6 + .5, t10 - .1, 'world gold council: about 219,891 tonnes mined in all history (end 2025) · cube: our arithmetic'], [t10 + .3, t12 - .4, 'our arithmetic: 219,891 tonnes ÷ 37 kg ≈ 60 lakh bricks · bricks drawn larger than life'],
  [t12 + .4, t15 - .4, 'our estimate: 10,000 bricks per two-room house · 60 lakh ÷ 10,000 = 600'], [t15 + .5, t18 - .1, 'Valmiki Ramayana, Sundara Kanda 2 and Yuddha Kanda 3 (prose translation) · gate: our schematic'],
  [t18 + .1, t22 - 1.0, 'gold leaf about 0.1 micron: 1 gram ≈ half a square metre (our arithmetic) · gate: our schematic'], [t22 - .1, t22 + 2.4, 'film still © Prime Focus Studios · via TMDB · throne details: art director R. Andhale, as reported'],
  [t24, t27 - .2, 'household gold about 25,000 tonnes (WGC; estimates 23,000–34,600) · 25,000 ÷ 219,891 ≈ 1 in 9']];
var TAGS = []; function tag(t0, t1, anchor, html, x, y) { var d = el('tag', html); d.style.left = x + 'px'; d.style.top = y + 'px'; TAGS.push({ t0: t0, t1: t1, a: anchor, d: d, x: x, y: y }); }
function A(v) { return function () { return v; }; } function WP(o) { return function () { return o.getWorldPosition(new T.Vector3()); }; }
tag(.5, tS1, A(V(-1.4, 3.0, -6)), '<small>film ka sinhasan</small>sona hi sona', 170, 1060);
tag(t4 + .4, t6 - .5, WP(CLAYB), '<small>mitti ki eent</small>3 kilo', 190, 620);
tag(t5g + .5, t6 - .5, WP(GOLDB), '<small>sone ki eent</small>37 kilo', 640, 1150);
tag(t8b, t10 - .2, A(V(XB - 4, Cb, 11.25)), '<small>aaj tak nikla saara sona</small>lagbhag 2.2 lakh tonne', 170, 520);
tag(t9 + .3, t10 - .2, A(V(XB + 17, 0, 8)), '<small>cricket pitch</small>20 metre', 640, 1150);
tag(t8b + .6, t10 - .2, A(V(XB - 18, 3, 12)), '<small>ek pakka ghar</small>', 170, 1150);
tag(t17, t18 - .2, A(V(XD - 1.9, 4.6, .5)), '<small>safed</small>pathar ka mahal', 170, 640);
tag(t17b, t18 - .2, A(V(XD, 1.4, 0)), '<small>sone ka</small>darwaza', 470, 1150);
tag(t17c, t18 - .2, A(V(XD + 4.1, 2.5, .4)), '<small>sone ki</small>khidki', 700, 700);
tag(t18 + 1.6, t19 - .3, function () { return SKN[0].m.getWorldPosition(new T.Vector3()); }, '<small>upar ki parat</small>sone ka vark', 170, 1150);
tag(t18 + 1.9, t19 - .3, A(V(XD - 1.9, 3.2, .5)), '<small>andar</small>safed pathar', 600, 620);
tag(t19 + .7, t20 - .3, A(V(XD + 7, 1.08, 62)), '<small>mithai par</small>chaandi ka vark', 560, 620);
tag(t20b + .6, t22 - 1.1, function () { return LEAF.position; }, '<small>1 gram sona</small>ek chhoti khidki', 170, 1080);
tag(t22 + .2, t22 + 2.4, A(V(-1.4, 3.0, -6)), '<small>andar</small>fibre', 170, 1060);
tag(Math.min(t22b, t22 + 1.2), t22 + 2.4, A(V(1.3, 4.4, -6)), '<small>upar</small>24 carat sone ka vark', 520, 1150);
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
var END = el('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="ser">Ramayana × Vigyan</div><div class="btns"><span id="bS">SHARE</span><span id="bF">FOLLOW</span></div>');

// ---------- sound events ----------
var tLay = function (k) { return t6 + .9 + k * ((t8b - t6 - .9) / NL); };
var EVL = [[0, 'hit'], [tS1, 'whoosh'], [t3, 'tick'], [t4 + .3, 'pop'], [t5g, 'thud'], [t6 - .3, 'whoosh'], [t8b, 'bell'], [t9 + .2, 'tick'], [t10 + .1, 'rise'], [t11, 'slide'], [t12 - .3, 'whoosh'], [t12b + .9, 'chime'], [t13 + .2, 'rise'], [t13b, 'bell'], [t14b, 'thud'], [t15, 'hole'], [t15 - .3, 'whoosh'],
  [t17, 'pop'], [t17b, 'pop'], [t17c, 'pop'], [t18 + .3, 'glint'], [t19 + .5, 'pop'], [t20b, 'glint'], [t22 - .9, 'whoosh'], [t22, 'shutter'], [t23, 'chime'], [t22 + 2.5, 'whoosh'], [t25 + .2, 'click'], [t25b, 'bell'], [t26b, 'glint'], [t27, 'chime']];
for (var kk = 0; kk < NL; kk++) EVL.push([tLay(kk) + .45, 'thud']);
window.EV = EVL.map(function (e) { return { t: +Math.max(0, e[0]).toFixed(3), k: e[1] }; }).sort(function (a, b) { return a.t - b.t; });
window.SCN_T0 = function () { return [0, t3, t6, t10, t12, t13, t15, t18, t19, t21, t24, t27]; };

// ---------- frame ----------
window.__seek = function (t) {
  t = Math.max(0, Math.min(DUR, t)); camAt(t, cam); camAt(Math.max(0, t - 1 / 30), cam0);
  var spd = cam.position.distanceTo(cam0.position) * 30, cx = cam.position.x, wide = cam.position.distanceTo(PO.v1.p) < 400 && cx > 300;
  var blurpx = spd > 60 ? Math.min(14, (spd - 60) * .02) : 0, endU = eo(ramp(t, t27 - .1, t27 + .6));
  glc.style.filter = (blurpx > .5 || endU > .01) ? 'blur(' + Math.max(blurpx, endU * 7).toFixed(1) + 'px) brightness(' + (1 - endU * .28).toFixed(2) + ')' : 'none';
  GA.visible = cx > -120 && cx < 250; GB.visible = cx > 250 && cx < 1300; GD.visible = cx > 1300; GF.visible = cx < -120;
  // --- A: film still (<= 2.5 s each time), balance
  var fsOn = t < tS1 + .25 || (t >= t22 - .35 && t < t22 + 2.4 + .2); FS.visible = FR.visible = fsOn && GA.visible; PLN.visible = t > tS1 - .05 && t < t20;
  var gl5 = ramp(t, t5g - .45, t5g), land = t - t5g, sw = land > 0 ? -.33 * (1 - Math.exp(-land * 3.2) * Math.cos(land * 7.5)) : 0, th = .12 * eo(ramp(t, t4 + .1, t4 + .8)) + sw;
  BEAM.rotation.z = th; HANG[0].rotation.z = HANG[1].rotation.z = -th; CLAYB.visible = t > t4 + .1; CLAYB.position.y = -.74 + .018 + BH * 1.75 / 2 + (1 - eo(ramp(t, t4 + .1, t4 + .5))) * .9;
  GOLDB.visible = t > t5g - .45; GOLDB.position.y = -.74 + .018 + BH * 1.75 / 2 + (1 - gl5 * gl5) * 1.3;
  // --- B: cube stacked layer by layer, then lifted apart, bricks stream out, houses rise
  if (GB.visible) {
    var open = eio(ramp(t, t10 + .1, t10 + 1.7)), eat = ramp(t, t11 + .3, t14);      // layers are used up from the top as bricks leave
    for (var k = 0; k < NL; k++) { var m = LAY[k], d = eo(ramp(t, tLay(k), tLay(k) + .5)), gone = ramp(eat, (NL - 1 - k) / NL, (NL - k) / NL); m.visible = t >= tLay(k) && gone < .999; m.position.y = LH / 2 + k * LH + (1 - d) * 46 + open * k * 2.7; m.scale.set(1 - gone * .98, 1, 1 - gone * .98); }
    var sOn = ramp(t, t11 - .1, t11 + .5) * (1 - ramp(t, t14 - .6, t14 + .2)), topY = Cb + open * (NL - 1) * 2.7, tgt = t < t13 ? V(HX, 3.4, HZ) : V(lerp(HX, VX - 40, ramp(t, t13, t14)), 6, HZ);
    for (var i = 0; i < NS; i++) { var ph = (t * .42 + hsh(i * 1.3)) % 1, on = hsh(i * 7.1) < sOn; if (!on) { M4.compose(ZERO, Q4.identity(), ZERO); STR.setMatrixAt(i, M4); continue; }
      var sx = XB + (hsh(i * 2.3) - .5) * 20, sz = (hsh(i * 3.7) - .5) * 20, x = lerp(sx, tgt.x + (hsh(i * 5.3) - .5) * 5, ph), z = lerp(sz, tgt.z + (hsh(i * 6.1) - .5) * 4, ph), y = lerp(topY + 1, tgt.y, ph) + Math.sin(ph * Math.PI) * (14 + hsh(i * 9.7) * 10); E4.set(t * 2 + i, t * 1.3 + i * 2, i); Q4.setFromEuler(E4); var sc = Math.min(1, ph * 8, (1 - ph) * 8); M4.compose(V(x, y, z), Q4, V(sc, sc, sc)); STR.setMatrixAt(i, M4); }
    STR.instanceMatrix.needsUpdate = true;
    var hb = ramp(t, t12 - .2, t12b + .9); H0W.visible = hb > .001; H0W.scale.y = Math.max(.001, hb); H0W.position.y = 1.5 * hb; H0R.visible = H0D.visible = hb >= 1; H0R.position.y = 3.13 + (1 - eo(ramp(t, t12b + .9, t12b + 1.3))) * 3;
    var nh = Math.floor(lerp(0, HP.length, eio(ramp(t, t13 + .2, t13b + 1.3)))); window.__nh = hb >= 1 ? nh + 1 : 0;
    for (var j = 0; j < HP.length; j++) { var p = HP[j], u = j < nh ? eo(ramp(t, t13 + .2 + (t13b + 1.3 - t13 - .2) * Math.sqrt(j / HP.length), t13 + .2 + (t13b + 1.3 - t13 - .2) * Math.sqrt(j / HP.length) + .5)) : 0; Q4.setFromAxisAngle(YAX, p.ry);
      if (u <= 0) { M4.compose(ZERO, Q4, ZERO); HM.setMatrixAt(j, M4); HR.setMatrixAt(j, M4); HD.setMatrixAt(j, M4); continue; }
      M4.compose(V(p.x, 1.5 * p.hh * u, p.z), Q4, V(1, p.hh * u, 1)); HM.setMatrixAt(j, M4); M4.compose(V(p.x, 3 * p.hh * u + .13, p.z), Q4, ONE); HR.setMatrixAt(j, M4); M4.compose(V(p.x - .8 * Math.cos(p.ry) + 2.27 * Math.sin(p.ry), 1 * u, p.z + .8 * Math.sin(p.ry) + 2.27 * Math.cos(p.ry)), Q4, V(1, u, 1)); HD.setMatrixAt(j, M4); }
    HM.instanceMatrix.needsUpdate = HR.instanceMatrix.needsUpdate = HD.instanceMatrix.needsUpdate = true;
    if (t < t12 - .5) shadowBox(V(XB + 4, 14, 0), 62); else if (t < t13) shadowBox(V(HX, 2, HZ), 26); else shadowBox(V(VX - 20, 0, 0), 215);
  }
  // --- D: the gate; skins lift off on their axes
  if (GD.visible) { var lift = ramp(t, t18 + .2, t18 + 2.2);
    SKN.forEach(function (s) { var u = eio(clamp((lift * 1.5 - s.o * .1))); s.m.position.copy(s.p).addScaledVector(s.d, s.L * u); }); FIN.position.y = 7.7 + 2.6 * eio(clamp(lift * 1.5 - .4));
    var um = eob(ramp(t, t19 + .1, t19 + .7)); MIT.visible = um > .01; MIT.scale.setScalar(Math.max(.001, um));
    var wb = V(XD + 10.6, 1.6, 60.69), b0 = V(XD + 9.5, 1.5, 61.9), ub = eob(ramp(t, t20 - .1, t20 + .4)), fl = eio(ramp(t, t20b, t20b + .7)), fly = eio(ramp(t, t20b + .8, t20b + 1.6));
    BEAD.visible = ub > .01 && fl < .5; BEAD.position.copy(b0); BEAD.scale.setScalar(Math.max(.001, ub) * (1 + fl * 1.5));
    LEAF.visible = fl > .3; LEAF.position.copy(b0).lerp(wb, fly); LEAF.position.y += Math.sin(fly * Math.PI) * .25; LEAF.scale.setScalar(Math.max(.05, eo((fl - .3) / .7))); LEAF.rotation.set(Math.sin(t * 3) * .12 * (1 - fly), Math.sin(t * 2.2) * .2 * (1 - fly), 0);
    if (t < t19 - .4) shadowBox(V(XD, 4, 3), 15); else if (t < t20 - .4) shadowBox(V(XD + 7, 1, 62), 3); else shadowBox(V(XD + 10.4, 1.5, 61), 4); }
  // --- F: the almirah
  if (GF.visible) { var od = eio(ramp(t, t25 + .1, t25 + 1.3)); DOORS[0].rotation.y = -od * 1.95; DOORS[1].rotation.y = od * 1.95;
    for (var n = 0; n < 9; n++) { var un = eob(ramp(t, t26 + .1 + n * .07, t26 + .45 + n * .07)), bp = V(XF + (n % 3 - 1) * .42, .28 + .06 + .01, 1.35 + (Math.floor(n / 3) - 1) * .22), nbk = NINE[n]; nbk.visible = un > .01; nbk.scale.setScalar(1.5 * Math.max(.001, un)); nbk.position.copy(bp); nbk.rotation.set(0, (hsh(n) - .5) * .2, 0);
      if (n === 4) { var go = eio(ramp(t, t26b, t26b + 1.0)), dst = V(XF + .42 - .14, .565 + 1.0 + BH * 1.5, -.58); nbk.position.lerp(dst, go); nbk.position.y += Math.sin(go * Math.PI) * .5; nbk.scale.setScalar(1.5 * Math.max(.001, un) * lerp(1, .68, go)); nbk.rotation.y += go * 6.283; } }
    shadowBox(V(XF, 1, .4), 5); }
  if (GA.visible) shadowBox(V(0, 2.4, t < tS1 + 1 || t > t21 ? -2.5 : 0), t < tS1 + 1 || t > t21 ? 11 : 5);
  R.render(S, cam);
  flash.style.opacity = (Math.max(0, .5 * (1 - Math.abs(t - t13b - .1) / .18), .4 * (1 - Math.abs(t - t5g - .03) / .12))).toFixed(3);
  // --- DOM
  HEADS.forEach(function (h) { var on = t >= h.t0 && t < h.t1, u = (h.t0 === 0 ? 1 : eo(ramp(t, h.t0, h.t0 + .4))) * (1 - ramp(t, h.t1 - .22, h.t1)); h.k.style.display = h.h.style.display = on ? 'block' : 'none'; if (on) { h.k.style.opacity = h.h.style.opacity = u; h.h.style.transform = 'translateY(' + (1 - u) * 14 + 'px)'; } });
  var s = null; SRCS.forEach(function (q) { if (t >= q[0] && t < q[1]) s = q; }); SRC.style.display = s ? 'block' : 'none'; if (s) { SRC.textContent = s[2]; SRC.style.opacity = (s[0] === 0 ? 1 : eo(ramp(t, s[0], s[0] + .4))) * (1 - ramp(t, s[1] - .2, s[1])); }
  var hud = null, landed = 0; for (var q = 0; q < NL; q++) if (t >= tLay(q) + .45) landed++;
  if (t >= t6 + .9 && t < t9 + .2) hud = [['SONA IKATTHA', inr(219891 * landed / NL) + ' tonne'], ['PARATEIN', landed + ' / ' + NL]];
  else if (t >= t11 && t < t12 - .4) hud = [['SONE KI EENTEIN', inr(Math.round(6000000 * eio(ramp(t, t11, t12 - .8)) / 1000) * 1000)]];
  else if (t >= t12 + .4 && t < t13 + .1) hud = [['IS GHAR MEIN EENTEIN', inr(Math.round(10000 * ramp(t, t12 - .2, t12b + .9) / 100) * 100)]];
  else if (t >= t13 + .2 && t < t15 - .4) hud = [['SONE KE GHAR', inr(Math.min(600, Math.round((window.__nh || 0) / 1) + (t > t13b + 1.3 ? 600 : 0)))], ['HAR GHAR', '10,000 eent']];
  else if (t >= t20b + .5 && t < t22 - 1.1) hud = [['PARAT KI MOTAI', 'baal se 500 guna patli']];
  else if (t >= t25b && t < t27 - .2) hud = [['BHARAT KE GHARON MEIN', '25,000 tonne sona']];
  HUD.style.display = hud ? 'flex' : 'none'; if (hud) HUD.innerHTML = hud.map(function (h) { return '<div><small>' + h[0] + '</small>' + h[1] + '</div>'; }).join('');
  var Ls = ''; TAGS.forEach(function (g) { var on = t >= g.t0 && t < g.t1; g.d.style.display = on ? 'block' : 'none'; if (!on) return; var u = eo(ramp(t, g.t0, g.t0 + .35)) * (1 - ramp(t, g.t1 - .2, g.t1)); g.d.style.opacity = u;
    var a = scr(g.a()), w = g.d.offsetWidth, h = g.d.offsetHeight, bx = clamp(a.x, g.x, g.x + w), by = a.y < g.y ? g.y : g.y + h;
    if (a.x > 120 && a.x < 960 && a.y > 200 && a.y < 1320 && !(a.x > g.x && a.x < g.x + w && a.y > g.y && a.y < g.y + h)) Ls += '<path d="M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' L' + bx.toFixed(1) + ' ' + by.toFixed(1) + '" stroke="#e7b53c" stroke-width="2.5" fill="none" opacity="' + (u * .9).toFixed(2) + '"/><circle cx="' + a.x.toFixed(1) + '" cy="' + a.y.toFixed(1) + '" r="7" fill="none" stroke="#e7b53c" stroke-width="2.5" opacity="' + u.toFixed(2) + '"/>'; });
  svg.innerHTML = Ls;
  var fu = eob(ramp(t, t23, t23 + .45)) * (1 - ramp(t, t24 - .25, t24)); FOL.style.display = fu > .01 ? 'flex' : 'none'; if (fu > .01) { FOL.style.opacity = Math.min(1, fu); FOL.style.transform = 'scale(' + (fu * (1 + .03 * Math.sin((t - t23) * 6))).toFixed(3) + ')'; FOL.style.transformOrigin = '0 50%'; }
  var endOn = t >= t27 - .1; END.style.display = endOn ? 'block' : 'none'; if (endOn) { END.style.opacity = endU; END.style.transform = 'translateY(' + (1 - endU) * 30 + 'px)'; var pu = 1 + .04 * Math.sin((t - t27) * 4.2); document.getElementById('bS').style.transform = 'scale(' + (eob(ramp(t, t27 + .1, t27 + .5)) * pu) + ')'; document.getElementById('bF').style.transform = 'scale(' + (eob(ramp(t, t27 + .5, t27 + .9)) * (2 - pu)) + ')'; }
  capEl.innerHTML = t < TM.groups[TM.groups.length - 1].end + .4 ? CAP.html(t, CAPW, { plain: true, hi: '#f2c14e', ink: '#f4f1e8', fs: 40, width: 756 }) : '';
};
window.__dbg = function (c) { return eval(c); };
window.__seek(0); window.__ready = true;
})();
