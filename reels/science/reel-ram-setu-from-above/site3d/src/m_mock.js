/* MOCKUP scenes (stills only): A orbit plate, B photon-to-surface, C two rulers + sediment */
ground.visible = false; gridF.visible = false; beams.forEach(function (b) { b.visible = false; }); motes.visible = false; S.fog.density = .0004; S.background.set(0x06141f);
var INK = 0x06141f, TURQ = 0x3fd0c9, SAND = 0xe8d9a8, ORG = 0xff7a1a, CHALK = 0xeef2ee, DEEP = 0x0b3a5a;
function fr(c, d, pitch, yaw, fov, rowPx) { fov = fov || 38; rowPx = rowPx || 761; var c3 = new V3(c[0], c[1], c[2]), pr = pitch * Math.PI / 180, yw = (yaw || 0) * Math.PI / 180, dir = new V3(Math.sin(yw) * Math.cos(pr), Math.sin(pr), Math.cos(yw) * Math.cos(pr)), p = c3.clone().add(dir.clone().multiplyScalar(d)), fwd = c3.clone().sub(p).normalize(), right = new V3().crossVectors(fwd, new V3(0, 1, 0)).normalize(), up = new V3().crossVectors(right, fwd).normalize(), wpp = 2 * d * Math.tan(fov * Math.PI / 360) / H, l = c3.clone().sub(up.multiplyScalar((960 - rowPx) * wpp)); return [[p.x, p.y, p.z], [l.x, l.y, l.z], fov]; }
var G = {};
function grp(n) { var g = new THREE.Group(); g.visible = false; S.add(g); G[n] = g; return g; }
function setCam(A) { camP.set(A[0][0], A[0][1], A[0][2]); camL.set(A[1][0], A[1][1], A[1][2]); camF = A[2]; applyCam(); }
/* ---- A: orbit plate ---- */
(function () { var g = grp('A'), tx = new THREE.TextureLoader().load('img/region.jpg', function () { window.__texok = true; }); tx.colorSpace = THREE.SRGBColorSpace; var pl = new THREE.Mesh(new THREE.PlaneGeometry(56, 48), new THREE.MeshBasicMaterial({ map: tx })); pl.rotation.x = -Math.PI / 2; g.add(pl);
  var sx = (79.4 - 80) * 2, sz = -(9.2 - 14) * 2; var ring = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.5, 64), new THREE.MeshBasicMaterial({ color: ORG, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.set(sx, .05, sz); g.add(ring);
  var ring2 = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.7, 64), new THREE.MeshBasicMaterial({ color: ORG, side: THREE.DoubleSide, transparent: true, opacity: .5 })); ring2.rotation.x = -Math.PI / 2; ring2.position.set(sx, .05, sz); g.add(ring2);
  var A = fr([sx + 6, 0, sz - 2], 100, 88, 0, 38, 800);
  var H1 = lab('99.98%', CHALK, 1, { font: '400 120px "Archivo Black"', bg: true, bcol: ORG }), H2 = lab('PAANI KE NEECHE', CHALK, 1, { font: '400 54px "Archivo Black"', bg: true, bcol: ORG }), R1 = lab('PALK STRAIT · ~9.2°N 79.4°E', ORG, 1, { font: '600 34px "Martian Mono"', bg: true }), R2 = lab('INDIA', CHALK, 1, { font: '600 34px "Martian Mono"' }), R3 = lab('SRI LANKA', CHALK, 1, { font: '600 34px "Martian Mono"' });
  PL(g, H1, A, 540, 300, 100, 150); PL(g, H2, A, 540, 440, 100, 80); PL(g, R1, A, 540, 1160, 100, 56); PL(g, R2, A, 250, 640, 100, 44); PL(g, R3, A, 760, 940, 100, 44);
  var cr = lab('SOURCE: NASA BLUE MARBLE · ILLUSTRATIVE ZOOM', CHALK, 1, { font: '600 26px "Martian Mono"' }); PL(g, cr, A, 540, 1235, 100, 40);
  G.A.cam = A; })();
/* ---- B: photon to surface ---- */
function ridgeZ(x) { return Math.sin(x * .22) * 2.2 + x * .05; }
function hfun(x, z) { var d = z - ridgeZ(x), base = -6 + Math.max(0, 1 - Math.abs(d) / 9) * 2.0, r = Math.exp(-(d * d) / 2.2) * (4.4 + Math.sin(x * 1.3) * .9 + Math.sin(x * 3.1 + 1) * .5); return base + r; }
(function () { var g = grp('B'); g.position.set(200, 0, 0);
  var geo = new THREE.PlaneGeometry(40, 26, 260, 170); geo.rotateX(-Math.PI / 2); var P = geo.attributes.position; for (var i = 0; i < P.count; i++) P.setY(i, hfun(P.getX(i), P.getZ(i))); geo.computeVertexNormals();
  var mat = new THREE.ShaderMaterial({ uniforms: {}, vertexShader: 'varying float vh; varying vec3 vn; void main(){ vh = position.y; vn = normal; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}', fragmentShader: 'varying float vh; varying vec3 vn; void main(){ float t = clamp((vh+6.0)/10.4,0.0,1.0); vec3 deep=vec3(0.043,0.227,0.353), mid=vec3(0.15,0.55,0.62), sh=vec3(0.25,0.82,0.79); vec3 c = t<0.5 ? mix(deep,mid,t*2.0) : mix(mid,sh,(t-0.5)*2.0); float l = max(0.0,dot(normalize(vn),normalize(vec3(-0.4,0.9,0.3)))); c*=0.55+0.6*l; float f = abs(fract(vh*1.0)-0.5); float line = 1.0-smoothstep(0.0,0.035,f); c = mix(c, vec3(0.93,0.95,0.93), line*0.55); gl_FragColor=vec4(c,1.0);}' });
  var m = new THREE.Mesh(geo, mat); g.add(m);
  var pts = []; for (var k = 0; k < 3400; k++) { var tx = (Math.random() - .5) * 38; if (Math.random() < .7) { var tz = ridgeZ(tx) + (Math.random() - .5) * 6; } else tz = (Math.random() - .5) * 24; pts.push(tx, hfun(tx, tz) + .06, tz); }
  var pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); g.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: ORG, size: .22, transparent: true, opacity: .95 })));
  var tracks = [[-6, -5.3], [-3, -2.3], [0, .7]]; var sat = new THREE.Group(); var body = box(1.6, .9, 2.4, 0x8a96a3, 0, { m: .8, r: .35 }); sat.add(body); var wing = box(5.4, .06, 1.1, 0x1a2f55, 0x0a1a3a, { m: .3 }); sat.add(wing); sat.position.set(-4, 14, -1); g.add(sat);
  for (var q = 0; q < 6; q++) { var bx = -9 + q * 1.8 + (q % 2) * .3; var a = new V3(-4 + (q - 2.5) * .35, 13.6, -1), b = new V3(-4 + (q - 2.5) * 2.2, 0, -1); g.add(bar(a, new V3(-4 + (q - 2.5) * 2.2, hfun(-4 + (q - 2.5) * 2.2, -1) + .1, -1), ORG, .035, .8)); }
  var A = fr([200, 0, 0], 66, 62, 18, 38, 820); G.B.cam = A; var A2 = fr([200, 0, 0], 66, 84, 0, 38, 820); G.B.cam2 = A2;
  var L1 = lab('LASER → SEABED', ORG, 1, { font: '400 56px "Archivo Black"', bg: true }), L2 = lab('~0.2 MILLION PHOTONS · 10 m GRID', CHALK, 1, { font: '600 30px "Martian Mono"', bg: true }), L3 = lab('DEPTH', CHALK, 1, { font: '600 28px "Martian Mono"' }), L4 = lab('ICESat-2 · ILLUSTRATIVE MODEL · SHAPE SCHEMATIC', CHALK, 1, { font: '600 24px "Martian Mono"' });
  PL(g, L1, A, 540, 320, 66, 90); PL(g, L2, A, 540, 430, 66, 58); PL(g, L4, A, 540, 1240, 66, 38); })();
/* ---- C: two rulers ---- */
(function () { var g = grp('C'); g.position.set(400, 0, 0);
  function land(pts, col) { var s = new THREE.Shape(); pts.forEach(function (p, i) { if (i) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); }); var m = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color: col })); m.rotation.x = -Math.PI / 2; m.position.y = .02; g.add(m); return m; }
  var sea = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshBasicMaterial({ color: 0x0f4b66 })); sea.rotation.x = -Math.PI / 2; g.add(sea);
  land([[-30, -20], [-9, -20], [-9, -7], [-12, -5], [-18, -4], [-30, -4]], SAND); land([[-18, -4], [-12, -5], [-9, -7], [-8, -4], [-11, -2], [-16, -2]], SAND); land([[30, 20], [11, 20], [10, 8], [13, 3], [19, 2], [30, 2]], SAND);
  var chain = []; for (var i = 0; i <= 40; i++) { var t = i / 40, x = -9 + t * 22, z = -4 + t * 7 + Math.sin(t * 9) * .9; chain.push(new V3(x, .05, z)); } var cg = new THREE.BufferGeometry().setFromPoints(chain); g.add(new THREE.Line(cg, new THREE.LineBasicMaterial({ color: TURQ })));
  for (i = 0; i <= 40; i++) { var d = new THREE.Mesh(new THREE.CircleGeometry(.32 + .12 * Math.abs(Math.sin(i * 1.7)), 12), new THREE.MeshBasicMaterial({ color: 0x66e8e0 })); d.rotation.x = -Math.PI / 2; d.position.set(chain[i].x, .06, chain[i].z + Math.sin(i * 2.3) * .35); g.add(d); }
  var A = fr([400, 0, 1], 80, 88, 0, 38, 780); G.C.cam = A;
  function ruler(x0, z0, x1, z1, col, y) { var a = new V3(x0, y, z0), b = new V3(x1, y, z1); g.add(bar(a, b, col, .16, .95)); [a, b].forEach(function (p) { var e = box(.3, .3, 1.8, col, col, { ei: .6 }); e.position.copy(p); g.add(e); }); }
  ruler(-9, -3.2, 13, 3.3, ORG, .3); ruler(-17, -2.2, 13, 3.3, 0xeef2ee, .45);
  var K1 = lab('~29 km', ORG, 1, { font: '400 70px "Archivo Black"', bg: true }), K2 = lab('~48 km', CHALK, 1, { font: '400 70px "Archivo Black"', bg: true }), N1 = lab('DHANUSHKODI', CHALK, 1, { font: '600 30px "Martian Mono"' }), N2 = lab('TALAIMANNAR', CHALK, 1, { font: '600 30px "Martian Mono"' }), N3 = lab('STUDY: DHANUSHKODI → TALAIMANNAR', ORG, 1, { font: '600 28px "Martian Mono"', bg: true }), N4 = lab('ESA: RAMESWARAM ISLAND → MANNAR ISLAND', CHALK, 1, { font: '600 28px "Martian Mono"', bg: true }), N5 = lab('SOURCES DIFFER ON WHERE TO MEASURE FROM', CHALK, 1, { font: '600 28px "Martian Mono"', bg: true });
  PL(g, K1, A, 330, 560, 80, 100); PL(g, K2, A, 330, 1000, 80, 100); PL(g, N3, A, 600, 380, 80, 52); PL(g, N4, A, 600, 1120, 80, 52); PL(g, N5, A, 540, 290, 80, 50);
  /* sediment arrows from Mannar (south) heavy, Palk (north) light */
  for (i = 0; i < 6; i++) { var xs = -6 + i * 3.2, zc = -4 + (xs + 9) / 22 * 7; g.add(bar(new V3(xs, .2, zc + 12), new V3(xs, .2, zc + 3.2), TURQ, .22, .8)); }
  for (i = 0; i < 3; i++) { var xs2 = -4 + i * 6, zc2 = -4 + (xs2 + 9) / 22 * 7; g.add(bar(new V3(xs2, .2, zc2 - 9), new V3(xs2, .2, zc2 - 3.6), TURQ, .1, .55)); } })();
window.__mock = function (n, v) { Object.keys(G).forEach(function (k) { G[k].visible = false; }); LBL.forEach(function (l) { l.visible = true; }); G[n].visible = true; var A = (v && G[n]['cam' + v]) || G[n].cam; setCam(A); clampLabels(); R.render(S, C); };
Promise.all(['400 40px "Archivo Black"', '600 30px "Martian Mono"', '600 30px Inter'].map(function (f) { return document.fonts.load(f); })).then(function () { setTimeout(function () { window.__ready = true; }, 1200); });
})();
