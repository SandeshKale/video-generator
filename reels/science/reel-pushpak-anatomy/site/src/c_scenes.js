
// ======================= timing helpers (voice-driven) =======================
var lerp = function (a, b, u) { return a + (b - a) * u; };
var V = function (a) { return new T.Vector3(a[0], a[1], a[2]); };
var SN = {}; TM.sentences.forEach(function (s) { SN[s.id] = s; });
function ST(id) { return SN[id].t0; } function SE(id) { return SN[id].t1; }
// cue = time of a word inside a sentence: proportional position in the Devanagari text, snapped to the nearest real word start (Whisper) within 0.6 s
function CUE(id, sub) { var s = SN[id], b = TM.B[id], i = b.indexOf(sub); if (i < 0) { (window.__cue = window.__cue || []).push(id + ':' + sub); i = 0; }
  var p = s.t0 + (s.t1 - s.t0) * i / b.length, best = p, bd = .6; for (var k = s.k0; k <= s.k1; k++) { var w = TM.words[k]; if (w && Math.abs(w[1] - p) < bd) { bd = Math.abs(w[1] - p); best = w[1]; } } return best; }
var DUR = TM.end;
// ======================= DOM overlay system (pure function of t) =======================
var UIE = {};
function U(id, cls) { var d = UIE[id]; if (!d) { d = document.createElement('div'); ov.appendChild(d); UIE[id] = d; } if (d.className !== cls) d.className = cls; return d; }
function show(id, cls, html, t, tIn, css, tOut) { var d = U(id, cls); if (d._h !== html) { d.innerHTML = html; d._h = html; } if (d._c !== (css || '')) { d.style.cssText = css || ''; d._c = css || ''; }
  var a = clamp((t - tIn) / .35) * (tOut == null ? 1 : 1 - clamp((t - tOut) / .3)); d._a = a; d.style.display = a > 0 ? '' : 'none'; d.style.opacity = a; d.style.transform = 'translateY(' + ((1 - eio(a)) * 14).toFixed(1) + 'px)'; return d; }
function hideAll() { for (var k in UIE) UIE[k].style.display = 'none'; while (svg.firstChild) svg.removeChild(svg.firstChild); }
function lead(a, b, col, op) { if (op <= 0) return; leader(a, b, col); svg.lastChild.setAttribute('opacity', op); svg.lastChild.previousSibling.setAttribute('opacity', op * .8); }
// a card attached to a world point: card on side L/R, stacked under the previous card of that side
var STACK; function tagAt(id, html, t, tIn, wp, side, cls, tOut, col) {
  var sp = scr(wp), d = show(id, cls || 'tag', html, t, tIn, 'left:0;top:0', tOut); if (d._a <= 0) return d;
  var h = d.offsetHeight, w = d.offsetWidth, tx = side === 'R' ? 918 - w : 162, ty = clamp(sp.y - h / 2, STACK[side] + 12, 1250 - h); STACK[side] = ty + h;
  d.style.left = tx + 'px'; d.style.top = ty + 'px'; if (d._a > .3) lead(sp, { x: side === 'R' ? tx : tx + w, y: ty + h / 2 }, col, d._a); return d; }
function headline(t, t0, kick, head, t1) { show('kick', 'kick', '<i></i>' + kick, t, t0, '', t1); show('head', 'head', head, t, t0 + .12, 'font-size:64px', t1); }
// ======================= camera: authored shots, locked between moves =======================
function shots(t, K) { var p = V(K[0].p), q = V(K[0].q), f = K[0].fov || 28;
  for (var i = 1; i < K.length; i++) { var k = K[i], u = eio((t - k.t) / k.d); if (u <= 0) break; p.lerp(V(k.p), u); q.lerp(V(k.q), u); f = lerp(f, k.fov || f, u); if (u < 1) break; }
  cam.position.copy(p); cam.lookAt(q); if (cam.fov !== f) { cam.fov = f; cam.updateProjectionMatrix(); } cam.updateMatrixWorld(); }
function poseOf() { var d = new T.Vector3(); cam.getWorldDirection(d); return { p: cam.position.toArray(), q: cam.position.clone().addScaledVector(d, 12).toArray(), fov: cam.fov }; }
function keyAt(off) { key.position.set(off.x - 6, 12, off.z + 8); key.target.position.copy(off); key.target.updateMatrixWorld(); }
var SHAKE = 0;

// ======================= SCENE GROUPS (far apart) =======================
var OA = new T.Vector3(0, 0, 0), OB = new T.Vector3(70, 0, 0), OD = new T.Vector3(140, 0, 0), OE = new T.Vector3(210, 0, 0), OF = new T.Vector3(280, 0, 0), OG = new T.Vector3(350, 0, 0), OH = new T.Vector3(420, 0, 0);
function grp(o) { var g = new T.Group(); g.position.copy(o); S.add(g); g.visible = false; return g; }
var gA = grp(OA), gB = grp(OB), gD = grp(OD), gE = grp(OE), gF = grp(OF), gG = grp(OG), gH = grp(OH);

// ---------- A: drafting table + 50 design sheets ----------
function sheetTex(i) { return cv(512, 724, function (g, w, h, c) { g.fillStyle = '#efe6cf'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(30,60,140,.18)'; g.lineWidth = 1; for (var x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (var y = 0; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  var rc = rough.canvas(c), o = { seed: i + 1, stroke: '#1f3f9a', strokeWidth: 6, roughness: 1.4 }, cx = w / 2, cy = h * .48, k = hsh(i);
  if (k < .25) { rc.ellipse(cx, cy, 300, 110, o); rc.polygon([[cx - 60, cy - 50], [cx, cy - 170], [cx + 60, cy - 50]], o); }
  else if (k < .5) { rc.circle(cx, cy, 240, o); rc.ellipse(cx, cy, 380, 60, o); rc.ellipse(cx, cy, 300, 40, o); }
  else if (k < .75) { for (var j = 0; j < 5; j++) rc.rectangle(cx - 150 + j * 15, cy - j * 50, 300 - j * 30, 46, o); rc.line(cx - 220, cy + 60, cx + 220, cy + 60, o); }
  else { rc.polygon([[cx - 170, cy + 40], [cx + 170, cy + 40], [cx + 90, cy - 40], [cx - 90, cy - 40]], o); rc.arc(cx, cy - 40, 180, 180, Math.PI, Math.PI * 2, false, o); rc.line(cx - 200, cy + 80, cx + 200, cy + 80, o); }
  g.fillStyle = '#1f3f9a'; g.font = '34px FM'; g.fillText('DESIGN ' + String(i + 1).padStart(2, '0') + ' / 50', 28, 52); g.font = '24px FM'; g.fillText('OUR SKETCH', w - 170, h - 26); }); }
var table = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshStandardMaterial({ color: 0x2a1810, roughness: .55, metalness: .05, map: cv(512, 512, function (g, w, h) { g.fillStyle = '#3a2216'; g.fillRect(0, 0, w, h); for (var i = 0; i < 240; i++) { g.strokeStyle = 'rgba(' + (60 + hsh(i) * 40 | 0) + ',30,18,.35)'; g.lineWidth = 1 + hsh(i + 1) * 3; g.beginPath(); var y = hsh(i * 3) * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 8, w * .6, y - 8, w, y + 4); g.stroke(); } }) }));
table.rotation.x = -Math.PI / 2; table.receiveShadow = true; gA.add(table);
var SHEETS = []; for (var i = 0; i < 50; i++) { var m = new T.Mesh(new T.PlaneGeometry(2.1, 2.97), new T.MeshStandardMaterial({ map: sheetTex(i), roughness: .9 })); m.castShadow = true; m.receiveShadow = true;
  var u = i / 49, a = -1.0 + u * 2.0; m.userData = { rz: a * .55 + (hsh(i) - .5) * .1, x: Math.sin(a) * 3.2 + (hsh(i + 4) - .5) * .3, y: .004 * i + .01, z: -Math.cos(a) * 1.2 + 1.6 + (hsh(i + 8) - .5) * .3 }; m.rotation.x = -Math.PI / 2; gA.add(m); SHEETS.push(m); }
var lampA = new T.SpotLight(0xffd29a, 150, 30, .6, .6, 1.6); lampA.position.set(-3, 9, 3); lampA.target.position.set(0, 0, .6); lampA.castShadow = true; gA.add(lampA); gA.add(lampA.target);

// ---------- B: studio floor for the teardown ----------
var floorB = new T.Mesh(new T.CircleGeometry(22, 96), new T.MeshStandardMaterial({ color: 0x0b1440, roughness: .35, metalness: .4 })); floorB.rotation.x = -Math.PI / 2; floorB.receiveShadow = true; gB.add(floorB);
// thought rings + carriers
var RINGS = []; for (var i = 0; i < 3; i++) { var r = new T.Mesh(new T.TorusGeometry(1, .025, 8, 96), new T.MeshBasicMaterial({ color: new T.Color(1, .8, .4).multiplyScalar(2.2), transparent: true, depthWrite: false })); r.rotation.x = Math.PI / 2; gB.add(r); RINGS.push(r); }
var DOT = cv(64, 64, function (g, w, h) { var r = g.createRadialGradient(32, 32, 0, 32, 32, 30); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.5, 'rgba(255,255,255,.6)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
var NC = 260, carG = new T.BufferGeometry(), carP = new Float32Array(NC * 3); carG.setAttribute('position', new T.BufferAttribute(carP, 3));
var CAR = new T.Points(carG, new T.PointsMaterial({ color: new T.Color(.25, .85, .8).multiplyScalar(2), size: 9, sizeAttenuation: false, map: DOT, transparent: true, depthWrite: false })); gB.add(CAR);
// airflow streaks through the vents
var NA = 60, airG = new T.BufferGeometry(), airP = new Float32Array(NA * 3); airG.setAttribute('position', new T.BufferAttribute(airP, 3));
var AIR = new T.Points(airG, new T.PointsMaterial({ color: new T.Color(.7, .95, 1).multiplyScalar(2), size: 10, sizeAttenuation: false, map: DOT, transparent: true, depthWrite: false })); S.add(AIR);

// ---------- D: balloon physics ----------
var balloon = new T.Group(); gD.add(balloon);
(function () { var pts = []; for (var i = 0; i <= 40; i++) { var u = i / 40, y = -1.6 + u * 4.2, r = u < .18 ? .35 + u * 3.2 : 1.6 * Math.sin(Math.min(1, (u - .02) / .98) * Math.PI * .92 + .12) * (1 - Math.pow(u, 6) * .15); pts.push(new T.Vector2(Math.max(.02, r), y)); } pts.push(new T.Vector2(0, 2.62));
  var gore = cv(1024, 256, function (g, w, h) { for (var k = 0; k < 16; k++) { g.fillStyle = k % 2 ? '#e8b04a' : '#0e2a7a'; g.fillRect(k * w / 16, 0, w / 16, h); } g.fillStyle = 'rgba(255,255,255,.08)'; for (var y = 0; y < h; y += 16) g.fillRect(0, y, w, 2); });
  var env = new T.Mesh(new T.LatheGeometry(pts, 64), new T.MeshStandardMaterial({ map: gore, roughness: .55, metalness: .05, side: T.DoubleSide, transparent: true, opacity: .55, depthWrite: false })); balloon.add(env); balloon.userData.env = env;
  var basket = new T.Mesh(new T.BoxGeometry(.6, .45, .6), new T.MeshStandardMaterial({ color: 0x8a5a2a, roughness: .8 })); basket.position.y = -2.5; balloon.add(basket);
  for (var k = 0; k < 4; k++) { var a = k * Math.PI / 2 + Math.PI / 4, ln = new T.Mesh(new T.CylinderGeometry(.008, .008, .9, 4), GOLD2); ln.position.set(Math.cos(a) * .33, -1.95, Math.sin(a) * .33); balloon.add(ln); }
  var flame = new T.Mesh(new T.ConeGeometry(.16, .7, 16), new T.MeshBasicMaterial({ color: new T.Color(1, .55, .15).multiplyScalar(4) })); flame.position.y = -1.85; balloon.add(flame); balloon.userData.flame = flame; })();
function cloud(n, inside, col, sz, seed) { var a = []; for (var i = 0; i < n * 3; i++) { var ang = hsh(i + seed) * 6.283, rad = Math.sqrt(hsh(i + seed + 7)), x = Math.cos(ang) * rad * 3.6, y = .6 + Math.sin(ang) * rad * 3.4, z = (hsh(i + seed + 13) - .5) * 1.2;
    var ins = y > -1.5 && y < 2.5 && Math.abs(x) < 1.5 * Math.sin(Math.min(1, (y + 1.6) / 4.2) * Math.PI * .92 + .12) * .95; if (ins === inside) a.push(x, y, z); if (a.length >= n * 3) break; }
  var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(a, 3)); var p = new T.Points(g, new T.PointsMaterial({ color: col, size: sz, sizeAttenuation: false, transparent: true, depthWrite: false, map: DOT })); gD.add(p); return p; }
var HOT = cloud(420, true, new T.Color(1, .5, .15).multiplyScalar(2.4), 9, 1), COLD = cloud(1400, false, new T.Color(.35, .7, 1).multiplyScalar(1.2), 7, 50000);
var LIFT = new T.ArrowHelper(new T.Vector3(0, 1, 0), new T.Vector3(0, 2.9, 0), 1.2, 0x3fd0c9, .35, .25); gD.add(LIFT);
var CUBE = new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ color: 0xffc35a, metalness: .85, roughness: .3, emissive: 0x7a4c00, emissiveIntensity: .7 })); CUBE.castShadow = true; gD.add(CUBE);
var MINI = []; for (var i = 0; i < 25; i++) { var b = balloon.userData.env.clone(); b.material = b.material.clone(); b.material.opacity = .9; b.scale.setScalar(.22); gD.add(b); MINI.push(b); }
var floorD = new T.Mesh(new T.CircleGeometry(30, 96), new T.MeshStandardMaterial({ color: 0x0a1238, roughness: .4, metalness: .3 })); floorD.rotation.x = -Math.PI / 2; floorD.position.y = -1.75; floorD.receiveShadow = true; gD.add(floorD);

// ---------- E: the 1918 "manual" sheet ----------
var SW = 7, SH = 7 * 1920 / 1080, BPK = 1.3, bpBase = document.createElement('canvas'); bpBase.width = W * BPK; bpBase.height = H * BPK;
(function () { var g = bpBase.getContext('2d'); g.scale(BPK, BPK); g.fillStyle = '#163f86'; g.fillRect(0, 0, W, H);
  for (var i = 0; i < 9000; i++) { g.fillStyle = 'rgba(255,255,255,' + (hsh(i) * .05) + ')'; g.fillRect(hsh(i * 3) * W, hsh(i * 7) * H, 2, 2); }
  g.strokeStyle = 'rgba(220,235,255,.14)'; g.lineWidth = 1; for (var x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (var y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  var rc = rough.canvas(bpBase), o = { seed: 7, stroke: '#eaf3ff', strokeWidth: 2.4, roughness: 1.1 }, cx = 470, cy = 680;
  rc.ellipse(cx, cy, 520, 150, o); rc.ellipse(cx, cy - 110, 290, 96, o); rc.circle(cx, cy - 196, 80, o);
  for (var k = 0; k < 6; k++) { rc.line(cx - 220 + k * 88, cy + 70, cx - 240 + k * 96, cy + 180, o); rc.circle(cx - 240 + k * 96, cy + 196, 30, o); }
  for (var s2 = 0; s2 < 3; s2++) rc.arc(cx, cy - 196, 130 + s2 * 48, 130 + s2 * 48, Math.PI * 1.1, Math.PI * 1.9, false, Object.assign({}, o, { strokeWidth: 1.6 }));
  g.fillStyle = '#eaf3ff'; g.font = '20px FM'; g.fillText('FIG. ?  "VIMANA" · MANUAL-STYLE SKETCH', 162, 958); g.fillText('ILLUSTRATIVE, NOT THE BOOK\'S DRAWING', 162, 986); })();
var bpTex = new T.CanvasTexture(document.createElement('canvas')); bpTex.image.width = W * BPK; bpTex.image.height = H * BPK; bpTex.colorSpace = T.SRGBColorSpace; bpTex.anisotropy = 8;
var bpG = bpTex.image.getContext('2d'), bpState = '';
function drawRuler(u1, u2, u3) { var k = u1.toFixed(2) + u2.toFixed(2) + u3.toFixed(2); if (k === bpState) return; bpState = k; var g = bpG; g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(bpBase, 0, 0); g.scale(BPK, BPK);
  var y0 = 1086, x0 = 162, x1 = 918; function X(yr) { return x0 + (yr - 1895) / (1980 - 1895) * (x1 - x0); }
  var xe = lerp(x0, X(1925), u1) + (x1 - X(1925)) * u3; g.strokeStyle = '#eaf3ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(xe, y0); g.stroke();
  g.font = '22px FM'; g.fillStyle = '#eaf3ff';
  [[1903, 'WRIGHTS', 0], [1918, '', 0], [1952, 'PUBLIC', 1], [1974, 'IISc', 1]].forEach(function (q) { if (X(q[0]) > xe) return; g.fillRect(X(q[0]) - 1.5, y0 - 16, 3, 32); g.fillText(q[0], X(q[0]) - 24, y0 + 46); if (q[1]) g.fillText(q[1], X(q[0]) - 24, y0 + 74); });
  if (u2 > 0) { g.fillStyle = 'rgba(232,176,74,' + (.9 * u2) + ')'; g.fillRect(X(1918), y0 - 22, X(1923) - X(1918), 44); g.fillStyle = 'rgba(255,210,122,' + u2 + ')'; g.font = '24px FM'; g.fillText('DICTATED 1918-23', X(1918) - 40, y0 - 38); }
  bpTex.needsUpdate = true; }
var sheetE = new T.Mesh(new T.PlaneGeometry(SW, SH), new T.MeshStandardMaterial({ map: bpTex, roughness: .85 })); sheetE.rotation.x = -Math.PI / 2; sheetE.receiveShadow = true; gE.add(sheetE);
var deskE = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshStandardMaterial({ color: 0x120c08, roughness: .8 })); deskE.rotation.x = -Math.PI / 2; deskE.position.y = -.02; gE.add(deskE);
function S2W(sx, sy, y) { return new T.Vector3((sx / W - .5) * SW, y || 0, (sy / H - .5) * SH); }
var inkE = cv(700, 700, function (g, w, h) { g.translate(w / 2, h / 2); g.rotate(-.18); g.strokeStyle = '#ff4a2e'; g.fillStyle = '#ff4a2e'; g.lineWidth = 16; g.beginPath(); g.arc(0, 0, 300, 0, 7); g.stroke(); g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 262, 0, 7); g.stroke();
  g.textAlign = 'center'; g.font = '800 92px Syne'; g.fillText('IISc 1974', 0, -50); g.font = '800 60px Syne'; g.fillText('CAN\'T FLY', 0, 40); g.font = '28px FM'; g.fillText('"NONE ... CAPABLE OF', 0, 108); g.fillText('BEING FLOWN"', 0, 146); });
var IMP = new T.Mesh(new T.PlaneGeometry(330 / W * SW, 330 / W * SW), new T.MeshBasicMaterial({ map: inkE, transparent: true, depthWrite: false })); IMP.rotation.x = -Math.PI / 2; IMP.position.copy(S2W(735, 690, .02)); gE.add(IMP);
var STAMP = new T.Group(); (function () { var rub = new T.Mesh(new T.CylinderGeometry(.95, .95, .25, 48), new T.MeshStandardMaterial({ color: 0x2a1a14, roughness: .6 })); STAMP.add(rub);
  var hdl = lathe([[.85, .12], [.9, .3], [.42, .5], [.32, 1.4], [.5, 1.8], [.36, 2.1], [0, 2.15]], new T.MeshStandardMaterial({ color: 0x8a5228, roughness: .45 }), 32); STAMP.add(hdl); STAMP.scale.setScalar(.75); STAMP.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); })(); gE.add(STAMP);
var lampE = new T.SpotLight(0xfff0d8, 420, 60, .7, .6, 1.3); lampE.position.set(-4, 14, -3); lampE.castShadow = true; gE.add(lampE); gE.add(lampE.target);

// ---------- F: Valmiki's chariot (our model) that Jatayu breaks ----------
var CHAR = [], charG = new T.Group(); gF.add(charG);
(function () { var wood = new T.MeshStandardMaterial({ color: 0x6a3a1c, roughness: .6 }), add = function (m, x, y, z, rx, ry, rz) { m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0); m.castShadow = true; charG.add(m); m.userData.h = { p: m.position.clone(), r: m.rotation.clone() }; CHAR.push(m); return m; };
  add(new T.Mesh(new T.BoxGeometry(1.6, .5, 1.2), wood), 0, 1.0, 0); add(new T.Mesh(new T.BoxGeometry(1.7, .08, 1.3), GOLD), 0, 1.28, 0);
  for (var s = -1; s <= 1; s += 2) { var wh = new T.Group(); wh.add(new T.Mesh(new T.TorusGeometry(.75, .06, 8, 40), GOLD2)); for (var k = 0; k < 8; k++) { var sp = new T.Mesh(new T.CylinderGeometry(.025, .025, 1.45, 6), wood); sp.rotation.z = k * Math.PI / 8; wh.add(sp); } add(wh, 0, .75, s * .72); }
  add(new T.Mesh(new T.CylinderGeometry(.05, .05, 2.6, 8), wood), 1.9, .9, 0, 0, 0, Math.PI / 2 - .12);
  add(new T.Mesh(new T.CylinderGeometry(.03, .03, 1.6, 6), GOLD2), -.6, 2.0, 0); add(new T.Mesh(new T.ConeGeometry(.75, .35, 16, 1, false), new T.MeshStandardMaterial({ color: 0xb4321e, roughness: .6, side: T.DoubleSide })), -.6, 2.85, 0);
  add(new T.Mesh(new T.BoxGeometry(.08, .9, 1.2), GOLD2), -.78, 1.55, 0); })();
var floorF = new T.Mesh(new T.CircleGeometry(30, 96), new T.MeshStandardMaterial({ color: 0x1a120c, roughness: .9 })); floorF.rotation.x = -Math.PI / 2; floorF.receiveShadow = true; gF.add(floorF);
var NDU = 160, duG = new T.BufferGeometry(), duP = new Float32Array(NDU * 3); duG.setAttribute('position', new T.BufferAttribute(duP, 3));
var DUST = new T.Points(duG, new T.PointsMaterial({ color: new T.Color(1, .75, .45).multiplyScalar(1.6), size: 8, sizeAttenuation: false, map: DOT, transparent: true, depthWrite: false })); gF.add(DUST);

// ---------- G: the flight home on NASA's relief map ----------
var mapTex = new T.TextureLoader().load('img/india.jpg'); mapTex.colorSpace = T.SRGBColorSpace; mapTex.anisotropy = 8;
function P3(lon, lat, y) { return new T.Vector3((lon - 79) * .95, y || 0, -(lat - 18)); }
var mapG = new T.Mesh(new T.PlaneGeometry(26 * .95, 28), new T.MeshStandardMaterial({ map: mapTex, roughness: .9 })); mapG.rotation.x = -Math.PI / 2; mapG.receiveShadow = true; gG.add(mapG);
var STOPS = [['LANKA', 80.7, 7.9, 'लंका'], ['SETU', 79.42, 9.17, 'सेतु'], ['KISHKINDHA', 76.46, 15.33, 'किष्किंधा'], ['PANCHAVATI', 73.79, 20.0, 'पंचवटी'], ['CHITRAKOOT', 80.85, 25.2, 'चित्रकूट'], ['PRAYAG', 81.85, 25.43, 'प्रयाग'], ['AYODHYA', 82.2, 26.8, 'अयोध्या']];
var ROUTE = new T.CatmullRomCurve3(STOPS.map(function (s) { return P3(s[1], s[2], .18); }), false, 'centripetal', .3);
var routeM = new T.Mesh(new T.TubeGeometry(ROUTE, 400, .07, 10, false), new T.MeshBasicMaterial({ color: new T.Color(0xffc35a).multiplyScalar(2.2) })); gG.add(routeM);
var routeGl = new T.Mesh(new T.TubeGeometry(ROUTE, 400, .22, 10, false), new T.MeshBasicMaterial({ color: 0xffb040, transparent: true, opacity: .18, depthWrite: false })); gG.add(routeGl);
// parameter u along the route for each stop (closest curve point)
var STOPU = STOPS.map(function (s) { var p = P3(s[1], s[2], .18), best = 0, bd = 1e9; for (var i = 0; i <= 600; i++) { var d = ROUTE.getPointAt(i / 600).distanceTo(p); if (d < bd) { bd = d; best = i / 600; } } return best; });
var PINS = STOPS.map(function (s, i) { var g = new T.Group(); g.add(new T.Mesh(new T.CylinderGeometry(.16, .16, .06, 24), new T.MeshBasicMaterial({ color: new T.Color(i === 1 ? 0x3fd0c9 : 0xfff1c8).multiplyScalar(2) })));
  var ring = new T.Mesh(new T.RingGeometry(.28, .34, 32), new T.MeshBasicMaterial({ color: 0xfff1c8, transparent: true, opacity: .7, side: T.DoubleSide })); ring.rotation.x = -Math.PI / 2; g.add(ring); g.position.copy(P3(s[1], s[2], .2)); gG.add(g); return g; });

// ---------- H: ISRO's Pushpak (RLV) on a runway, our simple model ----------
var rwTex = cv(256, 2048, function (g, w, h) { g.fillStyle = '#26282e'; g.fillRect(0, 0, w, h); g.fillStyle = '#e9e6dc'; for (var y = 40; y < h; y += 120) g.fillRect(w / 2 - 4, y, 8, 60); g.fillRect(14, 0, 6, h); g.fillRect(w - 20, 0, 6, h); for (var k = 0; k < 8; k++) { g.fillRect(30 + k * 12, h - 140, 7, 110); g.fillRect(w - 37 - k * 12, h - 140, 7, 110); } });
var runway = new T.Mesh(new T.PlaneGeometry(8, 160), new T.MeshStandardMaterial({ map: rwTex, roughness: .8 })); runway.rotation.x = -Math.PI / 2; runway.receiveShadow = true; gH.add(runway);
var grassH = new T.Mesh(new T.PlaneGeometry(200, 200), new T.MeshStandardMaterial({ color: 0x1c2a14, roughness: 1 })); grassH.rotation.x = -Math.PI / 2; grassH.position.y = -.02; grassH.receiveShadow = true; gH.add(grassH);
var RLV = new T.Group(); gH.add(RLV);
(function () { var white = new T.MeshStandardMaterial({ color: 0xe9ecef, roughness: .45, metalness: .2 }), black = new T.MeshStandardMaterial({ color: 0x1b1d22, roughness: .5 });
  var body = lathe([[0, 0], [.18, .25], [.32, .7], [.4, 1.4], [.42, 3.2], [.38, 3.6], [.0, 3.62]], white, 24); body.rotation.x = Math.PI / 2; body.position.z = 1.8; RLV.add(body);
  var nose = lathe([[0, 0], [.1, .08], [.18, .25], [0, .26]], black, 24); nose.rotation.x = -Math.PI / 2; nose.position.z = 1.8; RLV.add(nose);
  var sh = new T.Shape(); sh.moveTo(0, 1.4); sh.lineTo(.5, .2); sh.lineTo(1.7, -1.5); sh.lineTo(1.7, -1.8); sh.lineTo(-1.7, -1.8); sh.lineTo(-1.7, -1.5); sh.lineTo(-.5, .2); sh.lineTo(0, 1.4);
  var wing = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: .05, bevelEnabled: false }), white); wing.rotation.x = Math.PI / 2; wing.position.set(0, -.1, -.1); RLV.add(wing);
  [-1, 1].forEach(function (s) { var f = new T.Shape(); f.moveTo(0, 0); f.lineTo(.6, 0); f.lineTo(.2, .75); f.lineTo(0, .75); var fin = new T.Mesh(new T.ExtrudeGeometry(f, { depth: .04, bevelEnabled: false }), white); fin.rotation.y = Math.PI / 2; fin.rotation.z = s * -.3; fin.position.set(s * .32, .25, -1.45); RLV.add(fin); });
  RLV.traverse(function (m) { if (m.isMesh) m.castShadow = true; }); RLV.scale.setScalar(.9); })();
var NAME = new T.Mesh(new T.PlaneGeometry(1.6, .32), new T.MeshBasicMaterial({ map: cv(512, 102, function (g, w, h) { g.fillStyle = '#16213f'; g.font = '800 74px Syne'; g.textAlign = 'center'; g.fillText('PUSHPAK', w / 2, 78); }), transparent: true, depthWrite: false })); NAME.rotation.y = -Math.PI / 2; NAME.position.set(-.425, .05, .2); RLV.add(NAME);
// the diya for the end
var DIYA = new T.Group(); (function () { var clay = new T.MeshStandardMaterial({ color: 0xb0582a, roughness: .7 }); DIYA.add(lathe([[0, 0], [.5, .02], [.62, .2], [.55, .28], [0, .12]], clay, 32));
  var fl = new T.Mesh(new T.SphereGeometry(.09, 16, 12), new T.MeshBasicMaterial({ color: new T.Color(1, .7, .3).multiplyScalar(5) })); fl.scale.set(1, 2.1, 1); fl.position.set(.38, .45, 0); DIYA.add(fl); DIYA.userData.fl = fl; })();
var lampD = new T.PointLight(0xffa040, 8, 8, 1.6);
