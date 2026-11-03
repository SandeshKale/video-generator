/* District ticket-rush — "Showtime" 3D film. Part A: engine (renderer, timing helpers, authored camera shots, labels, crowd, phone, token, terminal...).
   world.js = a_engine + b_scenes + c_main (tools/build_world.sh). Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, MAG = 0xff2d78, CYN = 0x22e1ff, AMB = 0xffb800, LIME = 0x9dff3a, RED = 0xff3b30, IVO = 0xf2f4ff, SLATE = 0x3b4668, V3 = THREE.Vector3;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
function lerp(a, b, e) { return a + (b - a) * e; }
function sstep(x) { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); }
function eo3(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function ei3(x) { x = clamp(x); return x * x * x; }
function eob(x) { x = clamp(x); var c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
var HEX = function (h) { return '#' + ('000000' + h.toString(16)).slice(-6); };
var R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
var S = new THREE.Scene(); S.background = new THREE.Color(0x07080c); S.fog = new THREE.FogExp2(0x07080c, .012);
var C = new THREE.PerspectiveCamera(40, W / H, .05, 500);
S.add(new THREE.HemisphereLight(0x6a78b8, 0x0a0a16, .95));
var key = new THREE.DirectionalLight(0xbfd8ff, 1.15); key.position.set(8, 16, 10); S.add(key);
var rim = new THREE.DirectionalLight(0xff2d78, .9); rim.position.set(-10, 6, -12); S.add(rim);
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, sub, f) { var s = TMs[id]; for (var k = s.k0; k <= s.k1; k++) if (TM.words[k][0].replace(/[,.?।]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + sub] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return TM.words[k][1]; } window.__ws[id + '|' + sub] = ['MISS', +SP(id, f == null ? .5 : f).toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return SP(id, f == null ? .5 : f); }
var END = TM.end;
/* ---- authored camera shots: named move, from/to pose, start/end time, ease; locked off between shots; no drift ---- */
var CAMS = {};
function shot(sc, name, t0, t1, p0, l0, f0, p1, l1, f1, ease) { (CAMS[sc] = CAMS[sc] || []).push({ name: name, t0: t0, t1: t1, p0: new V3(p0[0], p0[1], p0[2]), l0: new V3(l0[0], l0[1], l0[2]), f0: f0, p1: new V3(p1[0], p1[1], p1[2]), l1: new V3(l1[0], l1[1], l1[2]), f1: f1, ease: ease || 'io' }); }
function follow(sc, name, t0, t1, fn) { (CAMS[sc] = CAMS[sc] || []).push({ name: name, t0: t0, t1: t1, fn: fn }); }
var EASE = { io: sstep, o: eo3, i: ei3, lin: clamp };
var camP = new V3(), camL = new V3(), camF = 40;
function camAt(sc, t) { var L = CAMS[sc]; if (!L) return; var cur = L[0], i, pose = null;
  for (i = 0; i < L.length; i++) { if (t >= L[i].t0) cur = L[i]; }
  if (t < L[0].t0) { cur = L[0]; }
  if (cur.fn) { var q = cur.fn(clamp((t - cur.t0) / (cur.t1 - cur.t0)), t); camP.copy(q.p); camL.copy(q.l); camF = q.f; return; }
  var e = t <= cur.t0 ? 0 : t >= cur.t1 ? 1 : EASE[cur.ease]((t - cur.t0) / (cur.t1 - cur.t0));
  camP.copy(cur.p0).lerp(cur.p1, e); camL.copy(cur.l0).lerp(cur.l1, e); camF = lerp(cur.f0, cur.f1, e); }
function applyCam() { C.position.copy(camP); C.up.set(0, 1, 0); C.lookAt(camL); C.fov = camF; C.updateProjectionMatrix(); C.updateMatrixWorld(true); }
/* ---- textures / glow ---- */
function glowTex(c0, c1) { var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, c0); g.addColorStop(.4, c1); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
var GL = { c: glowTex('rgba(200,250,255,1)', 'rgba(34,225,255,.5)'), m: glowTex('rgba(255,190,220,1)', 'rgba(255,45,120,.5)'), a: glowTex('rgba(255,236,170,1)', 'rgba(255,184,0,.5)'), l: glowTex('rgba(230,255,190,1)', 'rgba(157,255,58,.5)'), r: glowTex('rgba(255,200,190,1)', 'rgba(255,59,48,.5)'), w: glowTex('rgba(255,255,255,1)', 'rgba(200,210,255,.4)') };
function glow(k, s, op) { var m = new THREE.Sprite(new THREE.SpriteMaterial({ map: GL[k], transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: op == null ? 1 : op })); m.scale.set(s, s, 1); m.userData.op = op == null ? 1 : op; return m; }
function put3(o, x, y, z) { o.position.set(x || 0, y || 0, z || 0); return o; }
/* ---- 3D labels (sprites with cached canvas textures), auto-clamped into the safe box after the camera is placed ---- */
var LBL = [], LC = {};
function lab(text, col, hh, o) { o = o || {}; var k = text + col + JSON.stringify(o), e = LC[k];
  if (!e) { var fs = o.fs || 56, f = o.font || '600 ' + fs + 'px Inter', c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = o.pad || 22, lh = fs * 1.2; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
    if (o.bg) { x.fillStyle = o.bgc || 'rgba(7,8,12,.93)'; x.fillRect(0, 0, c.width, c.height); x.strokeStyle = HEX(o.bcol == null ? col : o.bcol); x.lineWidth = 5; x.strokeRect(2.5, 2.5, c.width - 5, c.height - 5); } x.fillStyle = HEX(col); x.textBaseline = 'middle'; x.textAlign = o.center ? 'center' : 'left';
    lines.forEach(function (l, i) { x.fillText(l, o.center ? c.width / 2 : pad, pad * .55 + lh * (i + .5) + 2); }); var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; e = LC[k] = { tx: tx, asp: c.width / c.height }; }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: e.tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.scale.set(hh * e.asp, hh, 1); s.userData = { lbl: true, sx: hh * e.asp, sy: hh, sz: 1, noClamp: !!o.noClamp, txt: text.slice(0, 24) }; LBL.push(s); return s; }
/* a "THIS IS CALLED" card: eyebrow + term + one-line meaning, one sprite */
function card(term, meaning, col, hh) { var c = document.createElement('canvas'), x = c.getContext('2d'), w = 920, h = 330; c.width = w; c.height = h; x = c.getContext('2d'); x.fillStyle = 'rgba(7,8,12,.95)'; x.fillRect(0, 0, w, h); x.strokeStyle = HEX(col); x.lineWidth = 7; x.strokeRect(3.5, 3.5, w - 7, h - 7);
  x.fillStyle = HEX(col); x.fillRect(0, 0, w, 62); x.fillStyle = '#07080c'; x.font = '400 30px "Cutive Mono"'; x.textBaseline = 'middle'; x.fillText('THIS IS CALLED', 30, 33);
  x.beginPath(); x.arc(w - 40, 31, 11, 0, 6.283); x.fill();
  x.fillStyle = HEX(IVO); var tfs = 86; x.font = '400 ' + tfs + 'px Bungee'; while (x.measureText(term).width > w - 60 && tfs > 30) { tfs -= 4; x.font = '400 ' + tfs + 'px Bungee'; } x.fillText(term, 30, 150); x.fillStyle = 'rgba(242,244,255,.82)'; x.font = '600 38px Inter'; meaning.split('\n').forEach(function (l, i) { x.fillText(l, 30, 232 + i * 50); });
  var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 31; s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, sx: hh * w / h, sy: hh, sz: 1, txt: 'CARD ' + term }; LBL.push(s); return s; }
/* entrance: eased scale pop; labels also fade */
function put(o, t, tIn, dur, hold) { var u = clamp((t - tIn) / (dur || .4)), ud = o.userData; if (ud.sx == null) { ud.sx = o.scale.x; ud.sy = o.scale.y; ud.sz = o.scale.z; }
  var vis = u > 0 && (hold == null || t < hold); o.visible = vis; if (!vis) return 0; var k = eob(u); o.scale.set(ud.sx * k, ud.sy * k, ud.sz * k); if (o.material && o.isSprite) o.material.opacity = clamp(u * 3); return u; }
function showIf(o, c) { o.visible = !!c; return !!c; }
function isVis(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
var SAFE = { l: 156, r: 912, t: 232, b: 1290 }, _v = new THREE.Vector3(), _r = new THREE.Vector3(), _u = new THREE.Vector3();
function labRect(s) { s.getWorldPosition(_v); var cp = _v.clone().applyMatrix4(C.matrixWorldInverse), d = -cp.z; if (d < .1) return null; var wpp = 2 * d * Math.tan(C.fov * Math.PI / 360) / H, p = _v.clone().project(C), cx = (p.x * .5 + .5) * W, cy = (1 - (p.y * .5 + .5)) * H, w = s.scale.x / wpp, h = s.scale.y / wpp; return { cx: cx, cy: cy, w: w, h: h, l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2, wpp: wpp }; }
function clampLabels() { C.matrixWorld.extractBasis(_r, _u, new THREE.Vector3()); LBL.forEach(function (s) { if (s.userData.noClamp) { if (isVis(s)) { var r0 = labRect(s); if (!r0 || r0.l < SAFE.l - 4 || r0.r > SAFE.r + 4 || r0.t < SAFE.t - 4 || r0.b > SAFE.b + 4) s.visible = false; } return; } if (s.userData.p0 == null) s.userData.p0 = s.position.clone(); s.position.copy(s.userData.p0); if (!isVis(s)) return; var r = labRect(s); if (!r) { s.visible = false; return; } if (r.cx < SAFE.l - r.w * .3 || r.cx > SAFE.r + r.w * .3 || r.cy < SAFE.t - r.h * 1.2 || r.cy > SAFE.b + r.h * 1.2) { s.visible = false; return; } if (r.w > 748) { s.scale.multiplyScalar(748 / r.w); r = labRect(s); } var dx = 0, dy = 0; if (r.l < SAFE.l) dx = SAFE.l - r.l; else if (r.r > SAFE.r) dx = SAFE.r - r.r; if (r.t < SAFE.t) dy = SAFE.t - r.t; else if (r.b > SAFE.b) dy = SAFE.b - r.b; if (dx || dy) { s.parent.updateMatrixWorld(); var wsh = _r.clone().multiplyScalar(dx * r.wpp).add(_u.clone().multiplyScalar(-dy * r.wpp)); var wp = new THREE.Vector3(); s.getWorldPosition(wp); wp.add(wsh); s.position.copy(s.parent.worldToLocal(wp)); } }); }
window.__lbRects = function () { var out = []; LBL.forEach(function (s) { if (!isVis(s) || (s.material && s.material.opacity < .3)) return; var r = labRect(s); if (r && r.r > 0 && r.l < W && r.b > 0 && r.t < H) out.push({ l: r.l, r: r.r, t: r.t, b: r.b, txt: s.userData.txt }); }); return out; };
/* ---- primitives ---- */
function plane(w, h, col, op) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op == null ? 1 : op, depthWrite: false, side: THREE.DoubleSide })); }
function box(w, h, d, col, emi, o) { o = o || {}; return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: col, emissive: emi == null ? 0 : emi, emissiveIntensity: o.ei == null ? 1.2 : o.ei, metalness: o.m == null ? .3 : o.m, roughness: o.r == null ? .5 : o.r, transparent: o.op != null, opacity: o.op == null ? 1 : o.op })); }
function basicBox(w, h, d, col, op) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: col, transparent: op != null, opacity: op == null ? 1 : op })); }
function bar(a, b, col, r, op) { var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op == null ? .95 : op, depthWrite: false })); m.geometry.translate(0, .5, 0); var d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, Math.max(L, .0001), 1); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); return m; }
function setBar(m, a, b) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, Math.max(L, .0001), 1); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); }
function gridFloor(sz, step, col, op) { var pts = []; for (var i = -sz; i <= sz; i += step) { pts.push(new V3(i, 0, -sz), new V3(i, 0, sz), new V3(-sz, 0, i), new V3(sz, 0, i)); } return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op == null ? .16 : op })); }
function roundRect(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function canvasTex(c) { var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
/* voxel (Minecraft-like) people, instanced: torso + head + legs share one matrix buffer; positions are a pure function of t */
function Crowd(n, tint, seed) { seed = seed || 1; var g = new THREE.Group(), mk = function (w, h, d, y) { var gm = new THREE.BoxGeometry(w, h, d); gm.translate(0, y, 0); var m = new THREE.InstancedMesh(gm, new THREE.MeshStandardMaterial({ roughness: .7, metalness: .05 }), n); m.frustumCulled = false; return m; };
  var bo = mk(.5, .62, .3, .86), he = mk(.36, .36, .36, 1.35), le = mk(.4, .55, .26, .28); he.instanceMatrix = bo.instanceMatrix; le.instanceMatrix = bo.instanceMatrix; var col = new THREE.Color(), hue = { mag: .93, cy: .52, lime: .25, red: .0, amb: .11 }[tint] || .93;
  for (var i = 0; i < n; i++) { col.setHSL(hue + (hash(i + seed) - .5) * .06, .85, .33 + hash(i + 3 + seed) * .12); bo.setColorAt(i, col); col.setHSL(.07, .5, .30 + hash(i + 9 + seed) * .12); he.setColorAt(i, col); col.setHSL(.62, .3, .18 + hash(i + 13 + seed) * .08); le.setColorAt(i, col); }
  g.add(bo); g.add(he); g.add(le); var A = bo.instanceMatrix.array;
  g.userData.n = n; g.update = function (fn) { var o = { x: 0, y: 0, z: 0, ry: 0, s: 1 }; for (var i = 0; i < n; i++) { o.y = 0; o.s = 1; o.ry = 0; fn(i, o); var c = Math.cos(o.ry) * o.s, sn = Math.sin(o.ry) * o.s, j = i * 16; A[j] = c; A[j + 1] = 0; A[j + 2] = -sn; A[j + 3] = 0; A[j + 4] = 0; A[j + 5] = o.s; A[j + 6] = 0; A[j + 7] = 0; A[j + 8] = sn; A[j + 9] = 0; A[j + 10] = c; A[j + 11] = 0; A[j + 12] = o.x; A[j + 13] = o.y; A[j + 14] = o.z; A[j + 15] = 1; } bo.instanceMatrix.needsUpdate = true; };
  return g; }
/* the viewer's phone with a canvas screen */
function Phone() { var g = new THREE.Group(), body = new THREE.Mesh(new THREE.ExtrudeGeometry(roundRect(2.0, 4.1, .34), { depth: .16, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 3, curveSegments: 12 }), new THREE.MeshStandardMaterial({ color: 0x2b3238, metalness: .9, roughness: .28 })); body.position.z = -.16; g.add(body);
  var c = document.createElement('canvas'); c.width = 512; c.height = 1024; var tex = canvasTex(c); var scr = new THREE.Mesh(new THREE.PlaneGeometry(1.84, 3.7), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); scr.position.z = .045; g.add(scr); g.userData.c = c; g.userData.tex = tex; g.userData.scr = scr;
  g.draw = function (mode, a, f, t) { var x = c.getContext('2d'); x.clearRect(0, 0, 512, 1024); x.fillStyle = '#080a12'; x.fillRect(0, 0, 512, 1024); x.fillStyle = '#10131f'; x.fillRect(0, 0, 512, 110); x.font = '400 40px Bungee'; x.fillStyle = HEX(IVO); x.textAlign = 'left'; x.fillText('district', 34, 74); x.textAlign = 'center';
    if (mode === 'queue') { x.font = '600 34px Inter'; x.fillStyle = 'rgba(242,244,255,.75)'; x.fillText('Samay Raina Live · Mumbai', 256, 230); x.font = '600 40px Inter'; x.fillStyle = HEX(IVO); x.fillText('Aapke aage', 256, 410); x.font = '400 138px Bungee'; x.fillStyle = HEX(MAG); x.fillText(a, 256, 570); x.font = '600 36px Inter'; x.fillStyle = HEX(CYN); x.fillText('lagbhag 10 minute', 256, 650); x.fillStyle = '#1a1e30'; x.fillRect(56, 730, 400, 18); x.fillStyle = HEX(CYN); x.fillRect(56, 730, 400 * f, 18); x.font = '600 28px Inter'; x.fillStyle = 'rgba(242,244,255,.6)'; x.fillText('is page ko refresh mat karna', 256, 830); }
    else if (mode === 'safe') { x.font = '600 34px Inter'; x.fillStyle = 'rgba(242,244,255,.75)'; x.fillText('Samay Raina Live · Mumbai', 256, 230); x.font = '600 40px Inter'; x.fillStyle = HEX(IVO); x.fillText('Aapke aage', 256, 410); x.font = '400 138px Bungee'; x.fillStyle = HEX(CYN); x.fillText(a, 256, 570); x.font = '600 34px Inter'; x.fillStyle = HEX(LIME); x.fillText('seat protected ✓', 256, 650); x.fillStyle = '#1a1e30'; x.fillRect(56, 730, 400, 18); x.fillStyle = HEX(LIME); x.fillRect(56, 730, 400 * f, 18); }
    else if (mode === 'pay') { x.font = '600 34px Inter'; x.fillStyle = 'rgba(242,244,255,.75)'; x.fillText('Block B \u00b7 Seat 14', 256, 230); x.font = '400 110px Bungee'; x.fillStyle = HEX(IVO); x.fillText('\u20b91,299', 256, 420); x.fillStyle = a ? HEX(LIME) : HEX(CYN); x.fillRect(66, 560, 380, 130); x.font = '400 62px Bungee'; x.fillStyle = '#07080c'; x.fillText(a ? 'PAID \u2713' : 'PAY', 256, 648); x.font = '600 28px Inter'; x.fillStyle = 'rgba(242,244,255,.55)'; x.fillText(f ? 'network atka...' : 'ILLUSTRATIVE SCREEN', 256, 790); }
    else { x.font = '400 64px Bungee'; x.fillStyle = HEX(LIME); x.fillText('CONFIRMED', 256, 360); x.font = '600 40px Inter'; x.fillStyle = HEX(IVO); x.fillText('Block B · Seat 14', 256, 460); x.fillStyle = '#10131f'; x.fillRect(86, 540, 340, 280); x.strokeStyle = HEX(LIME); x.lineWidth = 6; x.strokeRect(86, 540, 340, 280); x.font = '400 40px "Cutive Mono"'; x.fillStyle = HEX(LIME); x.fillText('1 ticket · paid', 256, 690); x.font = '600 26px Inter'; x.fillStyle = 'rgba(242,244,255,.5)'; x.fillText('ILLUSTRATIVE SCREEN', 256, 900); }
    tex.needsUpdate = true; };
  return g; }
/* the ticket token (through-line) */
function Ticket(col) { var w = 2.6, h = 1.3, s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, -.2); s.absarc(w / 2, 0, .2, -Math.PI / 2, Math.PI / 2, true); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.lineTo(-w / 2, .2); s.absarc(-w / 2, 0, .2, Math.PI / 2, -Math.PI / 2, true); s.lineTo(-w / 2, -h / 2);
  var mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .9, metalness: .3, roughness: .35 }), m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .08, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 2 }), mat), g = new THREE.Group(); g.add(m);
  for (var i = 0; i < 8; i++) { var d = new THREE.Mesh(new THREE.BoxGeometry(.04, .1, .09), new THREE.MeshBasicMaterial({ color: 0x07080c })); d.position.set(.55, -h / 2 + .12 + i * .15, .05); g.add(d); } g.userData.mat = mat; var gl = glow('c', 4.4, .6); gl.position.z = .2; g.add(gl); g.userData.gl = gl;
  g.setCol = function (c) { mat.color.setHex(c); mat.emissive.setHex(c); gl.material.map = GL[c === LIME ? 'l' : c === AMB ? 'a' : c === MAG ? 'm' : c === RED ? 'r' : 'c']; }; return g; }
/* terminal pane with typed lines. lines = [[text, col, tStart, cps]] */
function Term(title, w3) { var c = document.createElement('canvas'); c.width = 1024; c.height = 640; var tex = canvasTex(c), m = new THREE.Mesh(new THREE.PlaneGeometry(w3 || 8.4, (w3 || 8.4) * .625), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true })); m.userData.keepMap = true;
  m.draw = function (lines, t, foot) { var x = c.getContext('2d'); x.fillStyle = 'rgba(8,10,16,.97)'; x.fillRect(0, 0, 1024, 640); x.strokeStyle = HEX(CYN); x.lineWidth = 6; x.strokeRect(3, 3, 1018, 634); x.fillStyle = '#12151f'; x.fillRect(6, 6, 1012, 64); ['#ff5f57', '#febc2e', '#28c840'].forEach(function (cc, i) { x.fillStyle = cc; x.beginPath(); x.arc(40 + i * 40, 38, 12, 0, 6.283); x.fill(); });
    x.font = '400 30px "Cutive Mono"'; x.fillStyle = '#9fb0d0'; x.textAlign = 'left'; x.fillText(title, 190, 48); x.font = '400 40px "Cutive Mono"'; var y = 140, shown = 0;
    lines.forEach(function (l) { var n = Math.floor(clamp((t - l[2]) / Math.max(.01, l[3] || .5)) * l[0].length); if (t < l[2]) return; x.fillStyle = HEX(l[1]); x.fillText(l[0].slice(0, n), 36, y); y += 88; shown++; });
    var blink = Math.floor(t * 2.2) % 2; if (blink) { x.fillStyle = HEX(CYN); x.fillRect(36 + (lines.length && t >= lines[lines.length - 1][2] ? x.measureText(lines[lines.length - 1][0].slice(0, Math.floor(clamp((t - lines[lines.length - 1][2]) / Math.max(.01, lines[lines.length - 1][3] || .5)) * lines[lines.length - 1][0].length)) ).width : 0), y - 34, 20, 40); }
    if (foot) { x.fillStyle = '#12151f'; x.fillRect(6, 560, 1012, 74); x.font = '400 34px "Cutive Mono"'; x.fillStyle = HEX(foot[1]); x.fillText(foot[0], 36, 608); }
    tex.needsUpdate = true; }; return m; }
/* generic canvas panel (dashboard / ledger / split card) */
function Panel(cw, ch, w3) { var c = document.createElement('canvas'); c.width = cw; c.height = ch; var tex = canvasTex(c), m = new THREE.Mesh(new THREE.PlaneGeometry(w3, w3 * ch / cw), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true })); m.userData.keepMap = true; m.ctx = c.getContext('2d'); m.tex = tex; m.cw = cw; m.ch = ch; return m; }
function gate(wd) { wd = wd || 7.2; var g = new THREE.Group(), chrome = new THREE.MeshStandardMaterial({ color: 0xaab4c8, metalness: .9, roughness: .25 }); [-wd / 2, wd / 2].forEach(function (x) { var p = new THREE.Mesh(new THREE.BoxGeometry(.7, 4.2, .7), chrome); p.position.set(x, 2.1, 0); g.add(p); }); var arch = new THREE.Mesh(new THREE.BoxGeometry(wd + .8, .35, .5), new THREE.MeshStandardMaterial({ color: CYN, emissive: CYN, emissiveIntensity: 1.6 })); arch.position.set(0, 4.3, 0); g.add(arch); var strip = plane(wd - .8, 10, CYN, .16); strip.rotation.x = -Math.PI / 2; strip.position.set(0, .02, -5.2); g.add(strip); g.add(put3(glow('c', 7, .6), 0, 4.3, 0)); return g; }
/* shared stage: ground, grid, far beams, dust motes */
var ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x0b0c14, roughness: .85 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -.02; S.add(ground);
var gridF = gridFloor(120, 2, CYN, .12); S.add(gridF);
var beams = []; [[-30, 0xff2d78], [-12, 0x22e1ff], [8, 0xff2d78], [26, 0x22e1ff], [44, 0xff2d78]].forEach(function (b, i) { var m = new THREE.Mesh(new THREE.CylinderGeometry(.6, 5.5, 70, 24, 1, true), new THREE.MeshBasicMaterial({ color: b[1], transparent: true, opacity: .05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); m.position.set(b[0], 36, -70 - (i % 2) * 14); m.rotation.z = (i - 2) * .06; S.add(m); beams.push(m); });
var motes = (function () { var n = 360, pos = new Float32Array(n * 3); for (var i = 0; i < n; i++) { pos[i * 3] = (hash(i) - .5) * 80; pos[i * 3 + 1] = hash(i + 7) * 30; pos[i * 3 + 2] = -60 + hash(i + 13) * 90; } var gm = new THREE.BufferGeometry(); gm.setAttribute('position', new THREE.BufferAttribute(pos, 3)); var p = new THREE.Points(gm, new THREE.PointsMaterial({ color: 0xbfd8ff, size: .14, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending })); S.add(p); return p; })();

/* place a label by SCREEN position for a given camera pose A=[pos,look,fov]: px,py = wanted centre, dist = distance along the view axis, pxH = wanted height in pixels */
function unp(A, px, py, dist) { var p = new V3(A[0][0], A[0][1], A[0][2]), l = new V3(A[1][0], A[1][1], A[1][2]), cam = new THREE.PerspectiveCamera(A[2], W / H, .05, 500); cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(l); cam.updateMatrixWorld(true); cam.updateProjectionMatrix(); var v = new V3((px / W) * 2 - 1, 1 - (py / H) * 2, .5).unproject(cam), dir = v.sub(p).normalize(), fwd = new V3(); cam.getWorldDirection(fwd); return p.clone().add(dir.multiplyScalar(dist / dir.dot(fwd))); }
function PL(g, o, A, px, py, dist, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; var q = unp(A, px, py, dist); o.position.copy(q); ud.p0 = null; if (o.parent !== g) g.add(o); return o; }
window.__proj = function (x, y, z) { var v = new V3(x, y, z).project(C); return [Math.round((v.x * .5 + .5) * W), Math.round((1 - (v.y * .5 + .5)) * H)]; };

function PLM(g, o, A, px, py, dist, pxW) { var gw = o.geometry.parameters.width, wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / H, k = pxW * wpp / gw; o.scale.set(k, k, k); o.position.copy(unp(A, px, py, dist)); o.lookAt(new V3(A[0][0], A[0][1], A[0][2])); o.userData.sx = k; o.userData.sy = k; o.userData.sz = k; if (o.parent !== g) g.add(o); return o; }
/* Part B1: scene boundaries, camera framing helper, scenes 1-4 */
var LEAD = .4, SC = [0, S0('n1') - LEAD, S0('s1a') - LEAD, S0('q1') - LEAD, S0('t1') - LEAD, S0('p1') - LEAD, S0('e1') - LEAD, S0('r1') - LEAD, S0('r2') - LEAD, END];
var G = [], SCN = [];
function grp() { var g = new THREE.Group(); g.visible = false; S.add(g); G.push(g); return g; }
/* fr(): frame a point so it sits at screen row rowPx (usable area is y 232-1290, so its centre is ~761) */
function fr(c, d, pitch, yaw, fov, rowPx) { fov = fov || 38; rowPx = rowPx || 761; var c3 = new V3(c[0], c[1], c[2]), pr = pitch * Math.PI / 180, yw = (yaw || 0) * Math.PI / 180, dir = new V3(Math.sin(yw) * Math.cos(pr), Math.sin(pr), Math.cos(yw) * Math.cos(pr)), p = c3.clone().add(dir.clone().multiplyScalar(d)), fwd = c3.clone().sub(p).normalize(), right = new V3().crossVectors(fwd, new V3(0, 1, 0)).normalize(), up = new V3().crossVectors(right, fwd).normalize(), wpp = 2 * d * Math.tan(fov * Math.PI / 360) / H, l = c3.clone().sub(up.multiplyScalar((960 - rowPx) * wpp)); return [[p.x, p.y, p.z], [l.x, l.y, l.z], fov]; }
function sh(sc, name, t0, t1, A, B, ease) { shot(sc, name, t0, t1, A[0], A[1], A[2], B[0], B[1], B[2], ease); }
function lock(sc, name, t0, A) { shot(sc, name, t0, t0 + .01, A[0], A[1], A[2], A[0], A[1], A[2], 'io'); }
function fmt(n) { n = Math.max(0, Math.round(n)); var s = String(n); if (s.length > 3) { var a = s.slice(0, -3), b = s.slice(-3); a = a.replace(/\B(?=(\d\d)+(?!\d))/g, ','); return a + ',' + b; } return s; }
var TK = Ticket(CYN); TK.visible = false; S.add(TK);
function mat(o, f) { o.traverse(function (n) { if (n.material) f(n.material); }); }
function brow(i, t) { return Math.abs(Math.sin(6.283 * (t * 1.7 + hash(i + 51)))) * .09; }

/* ===== S1 the hook: the phone with the queue number, push-in, the token emerges ===== */
(function () { var g = grp(), P = Phone(); P.position.set(0, 2.6, 0); g.add(P);
  var fc = Crowd(1600, 'mag', 5); fc.update(function (i, o) { o.x = (hash(i) - .5) * 62; o.z = -16 - hash(i + 1) * 36; o.ry = hash(i + 2) * 6.28; }); g.add(fc); var sc2 = Crowd(900, 'mag', 17); sc2.update(function (i, o) { var sd = hash(i) < .5 ? -1 : 1; o.x = sd * (3.0 + hash(i + 1) * 9); o.z = -2 + hash(i + 2) * 11; o.ry = Math.PI + (hash(i + 3) - .5) * .8; o.s = .95 + hash(i + 4) * .3; }); g.add(sc2);
  g.add(put3(glow('m', 26, .22), 0, 6, -14)); g.add(put3(glow('c', 18, .16), -7, 3, -16));
  var L1 = lab('1,00,000+ TICKETS', IVO, .5, { font: '400 60px Bungee', bg: true }), L2 = lab('< 1 HOUR', AMB, .42, { font: '400 52px Bungee', bg: true }), D1 = lab('DISTRICT ✓', LIME, .36, { font: '400 44px Bungee', bg: true }), D2 = lab('BOOKMYSHOW ✗', 0x9aa3b8, .36, { font: '400 44px Bungee', bg: true }), SS = lab('SAMAY KA SCREENSHOT · ~10 MIN', CYN, .3, { fs: 40, bg: true }),
    CR = lab('CRASH?', RED, .7, { font: '400 100px Bungee', bg: true }), SD = lab('SYSTEM DESIGN', CYN, .5, { font: '400 74px Bungee', bg: true }), Q1 = lab('Q1 · APP KYUN NAHI TOOTI?', MAG, .34, { fs: 44, bg: true }), Q2 = lab('Q2 · EK SEAT, DO LOG KAISE NAHI?', AMB, .34, { fs: 44, bg: true });
  g.add(put3(L1, 0, 5.15, .4)); g.add(put3(L2, 0, 4.58, .4)); g.add(put3(D1, -1.2, 0.35, .4)); g.add(put3(D2, 1.35, 0.35, .4)); g.add(put3(SS, 0, 5.15, .6)); g.add(put3(CR, 0, 2.6, .7)); g.add(put3(SD, 0, 2.6, .7)); g.add(put3(Q1, 0, 5.2, .5)); g.add(put3(Q2, 0, 4.7, .5));
  CR.material.rotation = -.16; SD.material.rotation = -.1;
  var tA = S0('h2'), tB = S0('h3'), tC = S1('h3') - 2.0, A0 = fr([0, 2.6, 0], 16.4, 3, 0), A1 = fr([0, 2.6, 0], 14.0, 3, 0), A2 = fr([0, 3.0, 0], 20, 8, 0);
  lock(0, 'locked wide', 0, A0); sh(0, 'push-in', tA, tA + 2.6, A0, A1); sh(0, 'pull-back', tB + 1.2, tB + 4.2, A1, A2);
  SCN[0] = function (t) { g.visible = true; var ahead = 12569 - 21 * t; P.draw('queue', fmt(ahead), .26 + .004 * t, t); P.rotation.y = 0;
    put(L1, t, -1, .3, S0('h2') - .1); put(L2, t, WS('h1', 'घंटे', .4), .35, S0('h2') - .1); put(D1, t, WS('h1', 'दिस्ट्रिक्ट', .75), .35, S0('h3') + .2); put(D2, t, WS('h1', 'बुक्माइशो', .85), .35, S0('h3') + .2);
    put(SS, t, S0('h2') + .1, .4, S0('h3')); var tc = WS('h3', 'क्रैश', .0), ts = WS('h3', 'system', .3); put(CR, t, tc, .3, ts); put(SD, t, ts, .35); put(Q1, t, WS('h3', 'तुटी', .5), .35); put(Q2, t, WS('h3', 'सीट', .75), .35);
    var u = clamp((t - tC) / 2.0); TK.visible = u > 0; if (u > 0) { TK.setCol(CYN); TK.position.set(0, 2.6 + .6 * eo3(u), .2 + 3.2 * eo3(u)); TK.rotation.set(-.1, .35 * eo3(u), .1); TK.scale.setScalar(.35 + .9 * eo3(u)); } }; })();

/* ===== S2 the math, then the stampede (the crowd is 9,000 figures standing for 1 lakh) ===== */
(function () { var g = grp(), N = 9000, cr = Crowd(N, 'mag', 7), line = Crowd(30, 'cy', 91); g.add(cr); g.add(line); var gt = gate(); g.add(gt);
  var rack = new THREE.Group(), rb = box(1.7, 4.4, 1.5, 0x1b2030, 0, { m: .6, r: .4 }); rb.position.y = 2.2; rack.add(rb); var leds = []; for (var k = 0; k < 14; k++) { var l = basicBox(.9, .12, .05, LIME); l.position.set(0, .6 + k * .27, .78); rack.add(l); leds.push(l); } rack.position.set(7.0, 0, -3); g.add(rack);
  var spineMat = new THREE.MeshBasicMaterial({ color: CYN, transparent: true, opacity: .55 }), lane = bar(new V3(0, .06, 40), new V3(0, .06, 0), CYN, .05, .5); g.add(lane);
  var E1 = lab('1,00,000 TICKETS', IVO, 1.45, { font: '400 54px Bungee', bg: true }), E2 = lab('÷ 3,600 SECONDS', IVO, 1.45, { font: '400 54px Bungee', bg: true }), E3 = lab('≈ 28 / SECOND', AMB, 1.9, { font: '400 74px Bungee', bg: true }),
    LS = lab('28 / SEC · EK TIDY LINE', CYN, 1.1, { fs: 44, bg: true }), RK = lab('EK CHHOTA SERVER: OK ✓', LIME, 1.1, { fs: 40, bg: true }), RKX = lab('EK PAL, EK GATE ✗', RED, 1.1, { fs: 40, bg: true }), CD = card('CONCURRENCY', 'sabka ek hi pal mein aana,\nek hi seat ke liye', MAG, 3.4);
  var a = SC[1], tS = WS('n3', 'सबका', .3), A0 = fr([0, 2, 8], 40, 24, 0, 38, 930), A1 = fr([0, 1.5, 10], 34, 7, 0, 38, 880);
  PL(g, E1, A0, 540, 300, 36, 84); PL(g, E2, A0, 540, 405, 36, 84); PL(g, E3, A0, 540, 530, 36, 112); PL(g, LS, A0, 540, 880, 36, 70); PL(g, RK, A0, 700, 640, 36, 62); PL(g, RKX, A1, 540, 740, 34, 74); PL(g, CD, A1, 540, 430, 34, 250);
  lock(1, 'locked high', a, A0); sh(1, 'crane-out', tS - .2, tS + 3.4, A0, A1);
  SCN[1] = function (t) { g.visible = true; put(E1, t, WS('n1', 'लाग', .45), .35, tS - .3); put(E2, t, WS('n1', 'घंटा', .6), .35, tS - .3); put(E3, t, WS('n1', 'अथाइस', .85), .45, tS - .3); put(LS, t, WS('n1', 'यानी', .75) + .2, .4, tS); put(RK, t, WS('n2', 'सर्वर', .5), .4, tS); put(RKX, t, tS + 1.6, .4);
    put(CD, t, WS('n3', 'एक', .35) + 1.5, .5, WS('n3', 'पाँच', .6) + .5);
    line.update(function (i, o) { var z = ((t * 3.2 + i * 1.3) % 40); o.z = 40 - z; o.x = Math.sin(i * 7.1) * .12; o.y = z < 40 ? brow(i, t) : 0; o.ry = Math.PI; o.s = o.z < -3 ? 0 : 1; });
    var tt = t - tS; cr.visible = t >= WS('n3', 'सबका', .3) - 3.0; if (cr.visible) { cr.update(function (i, o) { var sx = (hash(i) - .5) * 52, sz = 26 + hash(i + 1) * 62, gx = (hash(i + 2) - .5) * 13, gz = 3 + hash(i + 3) * 17, dl = hash(i + 4) * 2.2, u = clamp((tt - dl + 1.6) / 3.0); var e = eo3(u); o.x = lerp(sx, gx, e); o.z = lerp(sz, gz, e); o.ry = Math.PI + (hash(i + 5) - .5) * .5; o.y = u > 0 && u < 1 ? brow(i, t) : 0; o.s = .9 + hash(i + 6) * .25; }); }
    var over = clamp((t - tS - .6) / 2); leds.forEach(function (l, k) { var on = hash(k + Math.floor(t * 8)) > .3; l.material.color.setHex(over > .3 ? (hash(k + Math.floor(t * 14)) > .5 ? RED : 0x401010) : (on ? LIME : 0x14301a)); }); rack.position.x = 7.0 + Math.sin(t * 60) * .05 * over;
    var th = SP('n3', 0); lane.visible = true; }; })();
/* Part B2: scenes 3-4 */
/* ===== S3 spread the crowd: a 48-hour ruler, registration arch, pre-sale lane, truck shot along the ruler ===== */
(function () { var g = grp(), N = 300, cm = Crowd(N, 'mag', 21), cc = Crowd(N, 'cy', 33); g.add(cm); g.add(cc);
  var rz = 3.6, segs = [[-10, -1, 0x1d5b6b], [-1, 9, CYN], [9, 12, MAG]]; segs.forEach(function (sg) { var b = box(sg[1] - sg[0], .34, .5, sg[2], sg[2], { ei: .5, m: .2 }); b.position.set((sg[0] + sg[1]) / 2, .17, rz); g.add(b); });
  for (var k = 0; k <= 10; k++) { var tk = basicBox(.06, .7, .06, IVO, .8); tk.position.set(-1 + k, .55, rz); g.add(tk); } g.add(put3(glow('c', 22, .2), 4, 1, rz));
  var arch = gate(3.6); arch.position.set(-6.5, 0, 1.0); arch.scale.set(1, .62, 1); g.add(arch); var AS = lab('REGISTER', CYN, .5, { font: '400 44px Bungee', bg: true, noClamp: true }); AS.position.set(-6.5, 3.0, 1.0); g.add(AS);
  var cols = []; for (k = 0; k < 10; k++) { var cb = box(.8, 1, .8, CYN, CYN, { ei: .7, m: .2 }); cb.geometry.translate(0, .5, 0); cb.position.set(-.5 + k, .36, rz - .8); cb.visible = false; g.add(cb); cols.push(cb); }
  var lane = plane(10, 1.6, CYN, .12); lane.rotation.x = -Math.PI / 2; lane.position.set(4, .02, 1.0); g.add(lane);
  var LA = lab('27 SEP \u00b7 11 PM\nREGISTRATION CLOSES', AMB, .85, { fs: 36, bg: true }), LB = lab('28 SEP \u00b7 2 PM\nPRE-SALE OPENS', CYN, .85, { fs: 36, bg: true }), LC2 = lab('30 SEP \u00b7 2 PM\n48 HOURS LATER', CYN, .85, { fs: 36, bg: true }), WA = lab('WhatsApp \u2192 booking link', LIME, .5, { fs: 40, bg: true }), SPR = lab('48 GHANTE MEIN BAANTA GAYA', IVO, .52, { fs: 42, bg: true }),
    TMQ = lab('TICKETMASTER \u00b7 2023 (REPORTED)\n\u201cstaggering the sales over a\nlonger period of time\u201d', MAG, 1.5, { fs: 36, bg: true }), PS = card('PRE-SALE', 'sirf registered fans,\nsabse pehle', CYN, 1.35);
  var a = SC[2], tb = S0('s1b'), tc = S0('s1c'), A0 = fr([-4, 1.4, 1.5], 36, 14, 0, 38, 800), A1 = fr([4, 1.4, 1.5], 36, 14, 0, 38, 800);
  PL(g, LA, A0, 400, 330, 34, 150); PL(g, LB, A1, 250, 1190, 34, 110); PL(g, LC2, A1, 800, 1190, 34, 110); PL(g, WA, A1, 540, 330, 34, 74); PL(g, SPR, A1, 540, 440, 34, 74); PL(g, PS, A1, 540, 640, 34, 250); PL(g, TMQ, A1, 540, 600, 34, 160);
  lock(2, 'locked', a, A0); sh(2, 'truck right', tb - .3, tb + 3.2, A0, A1);
  var tReg = a + 1.0;
  SCN[2] = function (t) { g.visible = true; var rate = 2.2;
    cm.update(function (i, o) { var x = -17 - hash(i) * 22 + rate * (t - tReg + 4); o.z = -.3 + hash(i + 1) * 2.2; o.x = x; o.y = brow(i, t); o.ry = Math.PI / 2; o.s = x < -6.6 ? .95 : 0; });
    cc.update(function (i, o) { var xslot = -.6 + 9 * hash(i + 3), dly = tb - 1.0 + (xslot + .6) / 9 * 7.5, xs = -6.4 + hash(i + 5) * .8, u = clamp((t - dly) / 2.6); var x = lerp(xs, xslot, eo3(u)), arrived = rate * (t - tReg + 4) - 17 - hash(i + 0) * 22 > -6.6;
      o.x = x; o.z = lerp(1.0 + hash(i + 7) * .8, -.3 + hash(i + 1) * 2.2, eo3(u)); o.y = u > 0 && u < 1 ? brow(i, t) : 0; o.ry = u > 0 && u < 1 ? Math.PI / 2 : Math.PI; o.s = (arrived && t >= tReg) ? .95 : 0; });
    cols.forEach(function (cb, k) { var u = clamp((t - (tb - .6 + k * .7)) / .9); cb.visible = u > 0; cb.scale.y = Math.max(.01, 2.3 * eo3(u) * (.92 + .16 * hash(k + 5))); });
    put(LA, t, a + .6, .4, tb - .5); put(LB, t, tb + .2, .4); put(LC2, t, tb + 2.4, .4); put(WA, t, WS('s1b', 'वाटसेब', .9), .4, tc - .3); put(SPR, t, tb + 3.4, .45, tc - .3); put(PS, t, WS('s1b', 'प्री', .1), .5, WS('s1b', 'बुकिंग', .6)); put(TMQ, t, WS('s1c', 'टिकेटमास्टर', .2), .5); AS.visible = t < WS('s1b', 'प्री', .1) - .1;
    arch.children[2].material.emissiveIntensity = 1.4 + .5 * Math.sin(t * 5); }; })();

/* ===== S4 the virtual waiting room: a serpentine line, a valve admitting ~21/s, a live dashboard ===== */
(function () { var g = grp(), N = 140, cr = Crowd(N, 'mag', 41); g.add(cr);
  var rows = 6, rx = 6, z0 = 4, P = [[0, 1.5]]; P.push([0, 4]); for (var k = 0; k < rows; k++) { var zz = z0 + 2.4 * k, xe = (k % 2 == 0) ? rx : -rx; if (k == 0) P.push([xe, zz]); else { P.push([P[P.length - 1][0], zz]); P.push([xe, zz]); } }
  var seg = [], tot = 0; for (k = 1; k < P.length; k++) { var dx = P[k][0] - P[k - 1][0], dz = P[k][1] - P[k - 1][1], L = Math.hypot(dx, dz); seg.push([tot, L, P[k - 1], P[k]]); tot += L; }
  function path(s, o) { if (s < 0) { o.x = 0; o.z = 1.5 + s; return; } if (s >= tot) s = tot - .001; for (var q = 0; q < seg.length; q++) { var sg = seg[q]; if (s >= sg[0] && s < sg[0] + sg[1]) { var f = (s - sg[0]) / sg[1]; o.x = lerp(sg[2][0], sg[3][0], f); o.z = lerp(sg[2][1], sg[3][1], f); o.ry = Math.atan2(sg[2][0] - sg[3][0], sg[2][1] - sg[3][1]); return; } } }
  for (k = 0; k < seg.length; k++) { var sg = seg[k], dx2 = sg[3][0] - sg[2][0], dz2 = sg[3][1] - sg[2][1], len = sg[1]; [-.5, .5].forEach(function (off) { var r = basicBox(Math.abs(dx2) > .01 ? len : .06, .1, Math.abs(dz2) > .01 ? len : .06, CYN, .55); r.position.set((sg[2][0] + sg[3][0]) / 2 + (Math.abs(dx2) > .01 ? 0 : off), .06, (sg[2][1] + sg[3][1]) / 2 + (Math.abs(dz2) > .01 ? 0 : off)); g.add(r); }); }
  var gt = gate(); gt.position.set(0, 0, 1.5); g.add(gt); var vl = box(2.6, 1.6, .4, 0x151826, CYN, { ei: .6, m: .6 }); vl.position.set(-3.2, 1.2, 1.5); g.add(vl); var vr = vl.clone(); vr.position.x = 3.2; g.add(vr);
  var dash = Panel(640, 520, 6.4); g.add(dash);
  function drawDash(ahead, adm, held, sold, t) { var x = dash.ctx; x.fillStyle = 'rgba(7,8,12,.94)'; x.fillRect(0, 0, 640, 520); x.strokeStyle = HEX(CYN); x.lineWidth = 6; x.strokeRect(3, 3, 634, 514); x.font = '400 34px Bungee'; x.fillStyle = HEX(CYN); x.textAlign = 'left'; x.fillText('LIVE · ILLUSTRATIVE', 28, 58); x.fillStyle = Math.floor(t * 2) % 2 ? HEX(RED) : '#4a1a16'; x.beginPath(); x.arc(600, 44, 12, 0, 6.283); x.fill();
    var rows = [['IN QUEUE', ahead, MAG], ['ADMITTED / s', adm, CYN], ['SEATS HELD', held, AMB], ['SOLD', sold, LIME]]; rows.forEach(function (r, i) { x.font = '600 26px Inter'; x.fillStyle = 'rgba(242,244,255,.7)'; x.fillText(r[0], 28, 128 + i * 100); x.font = '400 56px Bungee'; x.fillStyle = HEX(r[2]); x.fillText(r[1], 28, 186 + i * 100); }); dash.tex.needsUpdate = true; }
  var CV = card('VIRTUAL WAITING ROOM', 'pehle line mein, phir booking page', CYN, 1.3), CF = card('FIFO', 'first in, first out — browser cookie\nyaad rakhta hai aap kab aaye', AMB, 1.35),
    FG = lab('1 FIGURE ≈ 90 PEOPLE · NOT TO SCALE', 0x9aa3b8, .6, { fs: 32, bg: true }), RT = lab('~21 LOG / SECOND ANDAR', LIME, .8, { fs: 40, bg: true }), EQ = lab('12,569 ÷ 600 s ≈ 21 / s', AMB, .9, { font: '400 52px Bungee', bg: true }), BG = lab('BUG ✗', RED, 1.3, { font: '400 90px Bungee', bg: true }), OK = lab('SYSTEM KA KAAM ✓', LIME, .9, { font: '400 56px Bungee', bg: true }),
    T1 = lab('14:00:03', AMB, .5, { fs: 34, bg: true, noClamp: true }), T2 = lab('14:00:05', AMB, .5, { fs: 34, bg: true, noClamp: true }), T3 = lab('14:00:09', AMB, .5, { fs: 34, bg: true, noClamp: true }), YOU = lab('AAP', CYN, .5, { font: '400 36px Bungee', bg: true, noClamp: true });
  [T1, T2, T3, YOU].forEach(function (l) { g.add(l); });
  var a = SC[3], tq1 = S0('q1'), tq2 = S0('q2'), tq3 = S0('q3'), tq4 = S0('q4'), tq5 = S0('q5'), A0 = fr([0, 0, 8], 30, 40, 0, 38, 1010), A1 = fr([0, 0, 5], 22, 44, 0, 38, 1010), A2 = fr([0, 0, 8], 34, 56, 0, 38, 1010);
  PLM(g, dash, A1, 540, 470, 23, 520); PL(g, CV, A0, 540, 480, 30, 270); PL(g, CF, A0, 540, 880, 30, 250); PL(g, FG, A0, 540, 1235, 30, 52); PL(g, RT, A0, 540, 790, 30, 66); PL(g, EQ, A0, 540, 890, 30, 72); PL(g, BG, A1, 540, 880, 22, 170); PL(g, OK, A1, 540, 880, 22, 90);
  lock(3, 'locked high', a, A0); sh(3, 'dolly to the gate', tq3 - .2, tq4 + 3.0, A0, A1); sh(3, 'crane up', tq5 + .2, tq5 + 4.0, A1, A2);
  SCN[3] = function (t) { g.visible = true; var tf = tq2 + 1.0, ahead = 12569 - 21 * Math.max(0, t - tq2);
    cr.update(function (i, o) { var sx = (hash(i) - .5) * 11, sz = 3 + hash(i + 1) * 9, v = 1.1, s = .75 * i - v * Math.max(0, t - tf) + .2, pp = { x: 0, z: 0, ry: 0 }; path(s, pp); var u = sstep((t - (tq2 - .2 + hash(i + 2) * .8)) / 2.0); o.x = lerp(sx, pp.x, u); o.z = lerp(sz, pp.z, u); o.ry = lerp(hash(i + 4) * 6.28, pp.ry, u); o.y = brow(i, t) * (u > .3 ? 1 : 0); o.s = (s < -6) ? 0 : (.9 + hash(i + 6) * .15); });
    drawDash(fmt(t < tq2 ? 12569 : ahead), t < tq4 - 1 ? '—' : '~21', fmt(0 + Math.floor(t * 3.2)), fmt(Math.floor(t * 1.1)), t); dash.visible = t >= WS('q2', 'आगे', .5);
    put(CV, t, WS('q1', 'वेटिंग', .8), .5, WS('q2', 'आप', .2)); put(FG, t, tq2 + 2.4, .4); put(CF, t, WS('q3', 'पहले', .15), .5, tq4 - .2); put(RT, t, WS('q4', 'सेंट', .5), .45, tq5 - .1); put(EQ, t, WS('q4', 'बांटो', .5), .45, tq5 - .1); put(BG, t, WS('q5', 'बग', .75) - 1.5, .35, WS('q5', 'बग', .75) + .6); put(OK, t, Math.max(WS('q5', 'काम', .9), WS('q5', 'बग', .75) + .7), .45);
    var f = [0, 2, 5]; [T1, T2, T3].forEach(function (l, j) { var pp = { x: 0, z: 0, ry: 0 }; path(.75 * f[j] - 1.1 * Math.max(0, t - tf) + .2, pp); l.position.set(pp.x + 2.1, 2.9, pp.z); put(l, t, WS('q3', 'कुकी', .5) + j * .5, .35, tq4 - .2); });
    var pp2 = { x: 0, z: 0, ry: 0 }; path(.75 * (N - 1) - 1.1 * Math.max(0, t - tf) + .2, pp2); YOU.position.set(pp2.x, 2.5, pp2.z); put(YOU, t, tq2 + 2.6, .35); TK.visible = YOU.visible; if (TK.visible) { TK.setCol(CYN); TK.position.set(pp2.x, 1.9, pp2.z); TK.rotation.set(-.5, 0, 0); TK.scale.setScalar(.3); } }; })();
/* Part B3: scenes 5-9 */
var TK2 = Ticket(MAG); TK2.visible = false; S.add(TK2);
function bez(a, b, c, u) { var x = (1 - u) * (1 - u), y = 2 * (1 - u) * u, z = u * u; return new V3(a.x * x + b.x * y + c.x * z, a.y * x + b.y * y + c.y * z, a.z * x + b.z * y + c.z * z); }
/* ===== S5 the seat hold: the arena bowl, two tokens, one Redis command, a timer ring ===== */
(function () { var g = grp(), rings = [[9, 52], [11.2, 64], [13.4, 76], [15.6, 88], [17.8, 100]], pos = [];
  rings.forEach(function (r, ri) { for (var i = 0; i < r[1]; i++) { var a = i / r[1] * 6.2832; pos.push([Math.cos(a) * r[0], 1.2 + ri * .9, Math.sin(a) * r[0], a, ri, i]); } });
  var im = new THREE.InstancedMesh(new THREE.BoxGeometry(.7, .45, .7), new THREE.MeshStandardMaterial({ roughness: .5, metalness: .1 }), pos.length), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color(); im.frustumCulled = false;
  pos.forEach(function (p, i) { m4.compose(new V3(p[0], p[1], p[2]), q.setFromAxisAngle(new V3(0, 1, 0), -p[3]), new V3(1, 1, 1)); im.setMatrixAt(i, m4); im.setColorAt(i, col.setHex(SLATE)); }); g.add(im);
  var stage = new THREE.Mesh(new THREE.BoxGeometry(6, .6, 4), new THREE.MeshStandardMaterial({ color: 0x151826, emissive: CYN, emissiveIntensity: .3 })); stage.position.set(0, .3, 0); g.add(stage); g.add(put3(glow('c', 12, .35), 0, 3, 0));
  var tgt = pos.filter(function (q) { return q[4] == 2; }).sort(function (a, b) { return b[2] - a[2]; })[0], tidx = pos.indexOf(tgt), sp = new V3(tgt[0], tgt[1] + .3, tgt[2]);
  var halo = glow('a', 3.4, .0); halo.position.copy(sp).add(new V3(0, .3, 0)); g.add(halo); var ring = new THREE.Mesh(new THREE.RingGeometry(.95, 1.15, 56, 1, 0, 6.283), new THREE.MeshBasicMaterial({ color: AMB, side: THREE.DoubleSide, transparent: true })); ring.rotation.x = -Math.PI / 2; ring.position.copy(sp).add(new V3(0, .45, 0)); g.add(ring);
  var pulse = glow('w', 2, 0); pulse.position.copy(ring.position); g.add(pulse);
  var tm = Term('redis-cli \u00b7 ILLUSTRATIVE', 4.2); g.add(tm); var link1 = bar(new V3(), new V3(0, 1, 0), CYN, .03, .6), link2 = bar(new V3(), new V3(0, 1, 0), MAG, .03, .6); g.add(link1); g.add(link2);
  var LB = lab('SEAT B14', IVO, .46, { font: '400 46px Bungee', bg: true }), LY = lab('AAP', CYN, .3, { fs: 34, bg: true, noClamp: true }), LO = lab('DOOSRA', MAG, .3, { fs: 34, bg: true, noClamp: true }), LH = lab('HOLD: PAISA NAHI \u2192 SEAT WAPAS', AMB, .36, { fs: 38, bg: true }),
    CH = card('HOLD (LOCK)', 'ek seat par ek waqt mein\nek hi owner', AMB, 1.2), CN = card('NX', 'only if it does not exist\n(pehle koi nahi, tab hi set)', CYN, 1.2), CT = card('TTL \u00b7 EXPIRE', 'timer khatam, hold khud chhoot', LIME, 1.2);
  g.add(LY); g.add(LO);
  var a = SC[4], t1 = S0('t1'), t2 = S0('t2'), t3 = S0('t3'), t4 = S0('t4'), tOK = WS('t3', 'के', .45), tNil = WS('t3', 'निल', .75), tExp = WS('t4', 'छुट', .55);
  var A0 = fr([0, 2, 8], 42, 36, 0, 38, 800), A1 = fr([sp.x, sp.y, sp.z], 15, 24, 0, 38, 1090); lock(4, 'locked wide', a, A0); sh(4, 'crane down', t1 + 1.6, t1 + 5.2, A0, A1);
  PLM(g, tm, A1, 540, 625, 15, 700); PL(g, CH, A1, 540, 340, 14, 210); PL(g, CN, A1, 540, 340, 14, 210); PL(g, CT, A1, 540, 340, 14, 210); PL(g, LB, A1, 540, 1185, 14, 64); PL(g, LH, A1, 540, 1255, 14, 50); LB.userData.p0 = null;
  var enter = new V3(-9, 13, 34), arc = new V3(-6, 17, 24), arc2 = new V3(8, 16, 26), en2 = new V3(11, 13, 36);
  SCN[4] = function (t) { g.visible = true;
    var held = t >= tOK && t < tExp, u1 = clamp((t - (t1 + .6)) / 1.4), u2 = clamp((t - (t1 + 1.9)) / 1.3);
    pos.forEach(function (p, i) { var h = hash(i * 7 + 3), c = 0; if (i === tidx) { c = held ? AMB : SLATE; } else if (h < .38) c = 0x6fa81f; else { var cyc = (t * .5 + hash(i + 11) * 20) % 14; c = (cyc < 3.2 && hash(i + 17) < (t > t4 - 2 ? .5 : .22)) ? AMB : SLATE; } col.setHex(c); im.setColorAt(i, col); }); im.instanceColor.needsUpdate = true;
    var hv1 = sp.clone().add(new V3(-1.5, 1.15, .6)), hv2 = sp.clone().add(new V3(1.5, 1.15, .6));
    var p1 = bez(enter, arc, hv1, eo3(u1)), p2 = bez(en2, arc2, hv2, eo3(u2)); if (t >= tOK) { var uu = clamp((t - tOK) / .5); p1 = hv1.clone().lerp(sp.clone().add(new V3(0, .9, 0)), eo3(uu)); } if (t >= tNil) { var vv = clamp((t - tNil) / 1.0); p2 = hv2.clone().add(new V3(2.2 * eo3(vv), 1.0 * eo3(vv), 1.4 * eo3(vv))); }
    if (t >= tExp) { var ex = clamp((t - tExp) / 1.0); p1 = sp.clone().add(new V3(0, .9 + 2.0 * eo3(ex), 0)); }
    TK.position.copy(p1); TK.rotation.set(-.3, .5, 0); TK.scale.setScalar(.3 * (t >= tExp ? 1 - .9 * clamp((t - tExp - .4) / 1.2) : 1)); TK2.position.copy(p2); TK2.rotation.set(-.3, -.5, 0); TK2.scale.setScalar(.3 * (t >= tNil + 1 ? 1 - clamp((t - tNil - 1) / 1.0) : 1)); TK.setCol(held ? AMB : CYN);
    TK.visible = t > t1 + .6 && !(t > tExp + 1.6); TK2.visible = t > t1 + 1.9 && t < tNil + 2.2;
    setBar(link1, TK.position, sp); setBar(link2, TK2.position, sp); link1.visible = TK.visible && t < tOK; link2.visible = TK2.visible && t < tNil;
    LY.position.copy(TK.position).add(new V3(0, -.55, .3)); LO.position.copy(TK2.position).add(new V3(0, -.55, .3)); put(LY, t, t1 + 1.4, .3, tExp + 1.4); put(LO, t, t1 + 2.6, .3, tNil + 2);
    var tTy = WS('t2', 'रेडिस', .6), lines = [['> SET seat:B14 you NX EX 300', IVO, tTy, 2.2], ['OK', LIME, tOK, .15], ['> SET seat:B14 other NX EX 300', IVO, tOK + .5, 1.6], ['(nil)', RED, tNil, .15], ['# key expires \u2192 seat free', AMB, tExp - .6, 1.3]];
    var rem = held ? 1 - (t - tOK) / (tExp - tOK) : (t >= tExp ? 0 : 1), sec = Math.round(300 * clamp(rem)); tm.draw(lines, t, t >= tOK - .2 && t < tExp + 1.2 ? ['TTL ' + Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2) + ' \u00b7 TIMER SPED UP', AMB] : null); tm.visible = t > tTy - .4;
    halo.material.opacity = held ? .8 : (t > tExp ? Math.max(0, .8 - (t - tExp)) : 0); ring.visible = t >= tOK && t < tExp + .2; if (ring.visible) { ring.geometry.dispose(); ring.geometry = new THREE.RingGeometry(.95, 1.15, 56, 1, 0, Math.max(.05, 6.283 * rem)); }
    pulse.material.opacity = t >= tExp ? Math.max(0, .9 - (t - tExp) * 1.2) : 0; pulse.scale.setScalar(2 + 5 * clamp((t - tExp) / .9));
    put(LB, t, t1 + .3, .4); put(CH, t, WS('t2', 'होल', .5) + .2, .5, tTy - .2); put(CN, t, WS('t3', 'NX', .0) - .1, .5, tOK - .3); put(CT, t, WS('t4', 'टाइमर', .15), .5, WS('t4', 'पेमेंट', .45)); put(LH, t, WS('t4', 'पेमेंट', .45) + .2, .45); }; })();

/* ===== S6 payment: one key, one charge (phone <-> server across a wire, key store ledger, lost reply, retry, seat state chain) ===== */
(function () { var g = grp(), A = fr([0, 6, 0], 21, 0, 0, 38, 761), W3 = function (px, py) { return unp(A, px, py, 21); };
  var ph = Phone(); ph.scale.setScalar(.95); ph.position.copy(W3(290, 650)); g.add(ph);
  var rack = new THREE.Group(), rb = box(1.6, 3.2, 1.4, 0x1b2030, 0, { m: .6, r: .4 }); rb.position.y = 1.6; rack.add(rb); var leds = []; for (var k = 0; k < 10; k++) { var l = basicBox(.8, .1, .05, LIME); l.position.set(0, .5 + k * .27, .73); rack.add(l); leds.push(l); } rack.scale.setScalar(1.15); rack.position.copy(W3(775, 911)); g.add(rack);
  var led = Panel(640, 440, 3.0); led.position.copy(W3(700, 1070)); g.add(led);
  var wa = W3(430, 560), wb = W3(645, 560), wire = bar(wa, wb, CYN, .04, .5); g.add(wire); wa.z += .3; wb.z += .3;
  var pk = [], pc = [AMB, AMB, LIME, LIME]; for (k = 0; k < 4; k++) { var pb = box(.34, .34, .34, pc[k], pc[k], { ei: 1.6 }); pb.visible = false; g.add(pb); pk.push(pb); }
  var brk = lab('NETWORK ATKA \u2717', RED, .42, { fs: 36, bg: true }), TO = lab('JAWAB KHO GAYA', RED, .36, { fs: 32, bg: true }), SK = lab('SAME KEY \u2192 SAME JAWAB', LIME, .42, { fs: 38, bg: true }), CH = lab('CHARGED \u00d7 1', LIME, .5, { font: '400 48px Bungee', bg: true }), CK = card('IDEMPOTENCY KEY', 'same key = same result,\nek hi charge', CYN, 1.15);
  PL(g, brk, A, 540, 700, 21, 56); PL(g, TO, A, 540, 765, 21, 44); PL(g, SK, A, 540, 335, 21, 62); PL(g, CH, A, 540, 335, 21, 84); PL(g, CK, A, 540, 335, 21, 230);
  var r1 = Panel(300, 180, 1.5), r2 = Panel(300, 180, 1.5); function drawR(p, n) { var x = p.ctx; x.fillStyle = '#e9e4d6'; x.fillRect(0, 0, 300, 180); x.fillStyle = '#15181f'; x.font = '400 26px "Cutive Mono"'; x.textAlign = 'left'; x.fillText('RECEIPT #' + n, 16, 38); x.fillText('\u20b91,299 \u00b7 Seat B14', 16, 80); x.fillStyle = '#a3261c'; x.font = '400 30px Bungee'; x.fillText('KEY a9f3-77c2', 16, 140); p.tex.needsUpdate = true; } drawR(r1, 1); drawR(r2, 2); var pr1 = W3(290, 1045), pr2 = W3(470, 1070); g.add(r1); g.add(r2);
  var chain = Panel(760, 200, 4.3); chain.position.copy(W3(540, 1045)); g.add(chain);
  function drawChain(stage, t) { var x = chain.ctx; x.fillStyle = 'rgba(7,8,12,.94)'; x.fillRect(0, 0, 760, 200); x.strokeStyle = HEX(IVO); x.lineWidth = 5; x.strokeRect(2.5, 2.5, 755, 195); x.font = '400 26px Bungee'; x.fillStyle = 'rgba(242,244,255,.6)'; x.textAlign = 'left'; x.fillText('SEAT STATE \u00b7 ILLUSTRATIVE', 20, 38); var st = [['FREE', SLATE], ['HELD', AMB], ['HALF PAID', MAG], ['CONFIRMED', LIME]]; st.forEach(function (s, i) { var x0 = 20 + i * 184, on = stage >= i; x.fillStyle = on ? HEX(s[1]) : '#1a1e30'; x.fillRect(x0, 70, 172, 100); x.fillStyle = on ? '#07080c' : 'rgba(242,244,255,.45)'; x.font = '400 26px Bungee'; x.textAlign = 'center'; x.fillText(s[0], x0 + 86, 128); if (i < 3) { x.fillStyle = 'rgba(242,244,255,.6)'; x.fillText('\u25b8', x0 + 178, 122); } }); chain.tex.needsUpdate = true; }
  var a = SC[5], p1 = S0('p1'), p2 = S0('p2'), p3 = S0('p3'), p4 = S0('p4'), tTap1 = WS('p1', 'दबाया', .35), tBrk = WS('p1', 'कटका', .6), tTap2 = WS('p1', 'फिर', .75), tOne = WS('p2', 'चार', .8), tKey = WS('p2', 'आइडम', .35);
  lock(5, 'locked', a, A); sh(5, 'slow push', p3, p3 + 5, A, fr([0, 6, 0], 19.5, 0, 0, 38, 761));
  SCN[5] = function (t) { g.visible = true; var paid = t >= tTap2 + 1.6; ph.draw('pay', paid ? 1 : 0, t > tBrk && !paid ? 1 : 0, t);
    leds.forEach(function (l, k) { l.material.color.setHex(hash(k + Math.floor(t * 6)) > .3 ? LIME : 0x14301a); });
    var x = led.ctx; x.fillStyle = 'rgba(7,8,12,.94)'; x.fillRect(0, 0, 640, 440); x.strokeStyle = HEX(CYN); x.lineWidth = 6; x.strokeRect(3, 3, 634, 434); x.font = '400 56px Bungee'; x.fillStyle = HEX(CYN); x.textAlign = 'left'; x.fillText('KEY STORE', 24, 72); x.font = '400 34px "Cutive Mono"'; x.fillStyle = 'rgba(242,244,255,.6)'; x.fillText('key \u2192 saved response', 24, 124);
    if (t > tTap1 + .9) { x.fillStyle = HEX(IVO); x.font = '400 50px "Cutive Mono"'; x.fillText('a9f3-77c2', 24, 206); x.fillStyle = HEX(LIME); x.fillText('\u2192 \u20b91,299 charged', 24, 266); } if (t > tTap2 + 1.0) { x.fillStyle = HEX(AMB); x.font = '400 48px "Cutive Mono"'; x.fillText('KEY MILI \u2192 saved', 24, 352); x.fillStyle = HEX(LIME); x.font = '400 40px "Cutive Mono"'; x.fillText('same jawab, no new charge', 24, 408); } led.tex.needsUpdate = true;
    var seq = function (b, t0, d, a1, b1) { var u = clamp((t - t0) / d); b.visible = u > 0 && u < 1; if (b.visible) b.position.set(lerp(a1.x, b1.x, u), lerp(a1.y, b1.y, u), lerp(a1.z, b1.z, u)); return u; };
    seq(pk[0], tTap1, .9, wa, wb); var ru = seq(pk[2], tTap1 + 1.1, 1.2, wb, wa); pk[2].visible = ru > 0 && ru < .5; seq(pk[1], tTap2, .9, wa, wb); seq(pk[3], tTap2 + 1.0, .9, wb, wa);
    put(brk, t, tBrk, .35, tTap2 + .3); put(TO, t, tBrk + .35, .3, tTap2 + .3); put(SK, t, tTap2 + 1.1, .4, tKey - .1); put(CK, t, tKey, .5, tOne - .2); put(CH, t, tOne, .45, p3 - .3);
    r1.visible = t > tTap1 + .2; r2.visible = t > tTap2 + .2; r1.position.copy(pr1); var mu = clamp((t - tOne) / 1.2); r2.position.set(lerp(pr2.x, pr1.x + .08, eo3(mu)), lerp(pr2.y, pr1.y - .05, eo3(mu)), pr2.z + .05); r2.visible = r2.visible && mu < 1;
    var stg = t >= p4 ? 3 : t >= p3 ? 2 : t >= p1 ? 1 : 0; drawChain(stg, t); chain.visible = t >= p3 - .6; led.visible = t < p3 - .6; r1.visible = r1.visible && t < p3 - .6; r2.visible = r2.visible && t < p3 - .6; }; })();

/* ===== S7 bots: plan view of a wall with a narrow slit (the rate limit); only invite tokens pass ===== */
(function () { var g = grp(), N = 110, bots = new THREE.InstancedMesh(new THREE.BoxGeometry(.4, .4, .4), new THREE.MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: .8 }), N), ok = new THREE.InstancedMesh(new THREE.BoxGeometry(.7, .25, .45), new THREE.MeshStandardMaterial({ color: CYN, emissive: CYN, emissiveIntensity: 1.0 }), 14), m4 = new THREE.Matrix4(); bots.frustumCulled = ok.frustumCulled = false; g.add(bots); g.add(ok);
  [-1, 1].forEach(function (sd) { var wl = box(4.4, 1.3, .7, 0x1c2234, CYN, { ei: .2, m: .6 }); wl.position.set(sd * (.25 + 2.2), .65, 0); g.add(wl); }); var slit = basicBox(.5, .05, .7, CYN, .7); slit.position.set(0, .03, 0); g.add(slit); g.add(put3(glow('c', 4, .6), 0, 1.2, 0));
  var pad = plane(8, 4, CYN, .13); pad.rotation.x = -Math.PI / 2; pad.position.set(0, .02, -3.2); g.add(pad); var PADL = lab('BOOKING PAGE', CYN, .4, { fs: 38, bg: true }), RL = card('RATE LIMIT', 'har kisi ko ek hi taraf se,\nek hi raftaar se', RED, 1.2), TMQ = lab('TICKETMASTER, 2023 (REPORTED)\n\u201cthree times the amount\nof bot traffic\u201d', MAG, 1.4, { fs: 34, bg: true }), RG = lab('INVITE \u2192 PASS \u2713', CYN, .5, { fs: 36, bg: true }), BX = lab('BOTS \u2717 BOUNCE', RED, .5, { fs: 36, bg: true });
  var a = SC[6], A0 = fr([0, 0, 1], 22, 74, 0, 38, 761), A1 = fr([0, 0, 1], 18, 74, 0, 38, 761);
  PL(g, RL, A0, 540, 340, 20, 230); PL(g, TMQ, A0, 540, 340, 20, 160); PL(g, PADL, A0, 540, 610, 20, 52); PL(g, RG, A0, 540, 905, 20, 56); PL(g, BX, A0, 540, 1130, 20, 56);
  lock(6, 'locked plan view', a, A0); sh(6, 'push-in', S0('e1') + 3.5, S0('e1') + 6.5, A0, A1);
  SCN[6] = function (t) { g.visible = true; var tb = S0('e1'); for (var i = 0; i < N; i++) { var p = ((t - tb + hash(i) * 6) * .22) % 1, z, y = .25 + Math.abs(Math.sin((t + hash(i)) * 5)) * .25, x = (hash(i + 1) - .5) * 9.6; if (p < .6) z = 11 - 9.6 * eo3(p / .6); else z = 1.4 + 3.2 * sstep((p - .6) / .4); if (Math.abs(x) < .45) x = x < 0 ? -.8 : .8; m4.makeTranslation(x, y, z); bots.setMatrixAt(i, m4); } bots.instanceMatrix.needsUpdate = true;
    for (i = 0; i < 14; i++) { var u = ((t * .3 + i / 14) % 1), z2 = lerp(11, -5.5, u); m4.makeTranslation(0, .3, z2); ok.setMatrixAt(i, m4); } ok.instanceMatrix.needsUpdate = true;
    put(BX, t, WS('e1', 'BOT', .0) + .3, .4); put(TMQ, t, WS('e1', 'Ticketmaster', .2), .5, WS('e1', 'लिंक', .6)); put(PADL, t, WS('e1', 'लिंक', .6), .4); put(RG, t, WS('e1', 'रजिस्टर', .65), .4); put(RL, t, WS('e1', 'रेट', .85), .5); }; })();

/* ===== S8 what is real: WE CAN SEE vs COMMONLY BUILT, with the unverified claim struck off ===== */
(function () { var g = grp(), A = fr([0, 6, 0], 17.5, 0, 0, 38, 761), W3 = function (px, py) { return unp(A, px, py, 17.5); }, wpp = 2 * 17.5 * Math.tan(19 * Math.PI / 180) / H, pa = Panel(840, 420, 756 * wpp), pb = Panel(840, 420, 756 * wpp), st = Panel(840, 130, 756 * wpp);
  pa.position.copy(W3(540, 520)); pb.position.copy(W3(540, 900)); st.position.copy(W3(540, 1190)); g.add(pa); g.add(pb); g.add(st);
  var HD = lab('DISTRICT NE APNA DESIGN PUBLIC NAHI KIYA', IVO, .42, { fs: 34, bg: true }); PL(g, HD, A, 540, 280, 17.5, 52);
  function draw(p, title, col, rows, t0, t) { var x = p.ctx; x.fillStyle = 'rgba(7,8,12,.95)'; x.fillRect(0, 0, 840, 420); x.strokeStyle = HEX(col); x.lineWidth = 7; x.strokeRect(3.5, 3.5, 833, 413); x.fillStyle = HEX(col); x.fillRect(0, 0, 840, 66); x.fillStyle = '#07080c'; x.font = '400 36px Bungee'; x.textAlign = 'left'; x.fillText(title, 24, 46); x.font = '600 38px Inter'; rows.forEach(function (r, i) { if (t < t0 + i * .75) return; var u = clamp((t - t0 - i * .75) / .35); x.globalAlpha = u; x.fillStyle = HEX(col); x.fillText('\u25aa', 24, 130 + i * 72); x.fillStyle = HEX(IVO); x.fillText(r, 66, 130 + i * 72); x.globalAlpha = 1; }); p.tex.needsUpdate = true; }
  var a = SC[7]; lock(7, 'locked', a, A);
  SCN[7] = function (t) { g.visible = true; var r1 = S0('r1'); put(HD, t, r1 + .1, .4);
    draw(pa, 'WE CAN SEE', CYN, ['Registration \u2192 48 h pre-sale', 'WhatsApp booking link', '\u201c12,569 fans ahead\u201d screenshot', '50% pay-now option'], WS('r1', 'स्क्रीन्शॉट', .5) - 2.8, t);
    draw(pb, 'COMMONLY BUILT (DOCS)', AMB, ['Waiting room (Cloudflare)', 'Redis SET NX EX hold', 'Idempotency keys (Stripe)', 'Rate limits + bot checks'], WS('r1', 'इंडस्ट्री', .5) - 1.6, t);
    var x = st.ctx; x.fillStyle = 'rgba(7,8,12,.95)'; x.fillRect(0, 0, 840, 130); x.strokeStyle = HEX(RED); x.lineWidth = 6; x.strokeRect(3, 3, 834, 124); x.fillStyle = 'rgba(242,244,255,.8)'; x.font = '600 36px Inter'; x.textAlign = 'left'; x.fillText('2 lakh tickets \u00b7 \u20b940 crore', 28, 52); x.fillStyle = HEX(RED); x.font = '400 40px Bungee'; x.fillText('UNVERIFIED \u2014 NOT USED', 28, 106); var k = clamp((t - WS('r1', 'अन्वेरिफाईड', .93) + .9) / .5); x.strokeStyle = HEX(RED); x.lineWidth = 8; x.beginPath(); x.moveTo(20, 40); x.lineTo(20 + 560 * k, 40); x.stroke(); st.tex.needsUpdate = true;
    pa.visible = t > r1 + 1.5; pb.visible = t > WS('r1', 'इंडस्ट्री', .5) - 2.2; st.visible = t > WS('r1', 'दोलाक', .8) - .4; }; })();

/* ===== S9 the reframe: the same phone as frame 0, the queue now reads "seat protected", the token lands ===== */
(function () { var g = grp(), P = Phone(); P.position.set(0, 2.6, 0); g.add(P); var fc = Crowd(1600, 'mag', 5); fc.update(function (i, o) { o.x = (hash(i) - .5) * 62; o.z = -16 - hash(i + 1) * 36; o.ry = hash(i + 2) * 6.28; }); g.add(fc); g.add(put3(glow('m', 26, .2), 0, 6, -14)); g.add(put3(glow('l', 20, .14), 0, 3, -10));
  var L1 = lab('LINE = SEAT KI SECURITY', LIME, .46, { fs: 52, bg: true }), L2 = lab('WAHI LINE SEAT BACHA RAHI HAI', IVO, .36, { fs: 38, bg: true }), L3 = lab('SEAT B14 · CONFIRMED', LIME, .46, { font: '400 46px Bungee', bg: true });
  g.add(put3(L1, 0, 5.2, .6)); g.add(put3(L2, 0, 4.65, .6)); g.add(put3(L3, 0, 5.0, .6)); var a = SC[8], cta = S0('cta'), r2 = S0('r2');
  var A0 = fr([0, 2.6, 0], 16.4, 3, 0), A1 = fr([0, 3.4, 0], 22, 5, 0, 38, 520); lock(8, 'locked', a, A0); sh(8, 'pull-back', cta - .4, cta + 1.6, A0, A1);
  SCN[8] = function (t) { g.visible = true; var landT = WS('r2', 'सीट', .85), done = t >= landT + 1.0; P.draw(done ? 'done' : 'safe', fmt(12569 - 21 * (t - a)), .5 + .02 * (t - a), t); put(L1, t, a + .5, .4, landT + .6); put(L2, t, WS('r2', 'वही', .6), .4, landT + .6); put(L3, t, landT + 1.0, .45, cta - .2);
    var u = clamp((t - (landT - 1.2)) / 2.2); TK.visible = u > 0; if (u > 0) { TK.setCol(done ? LIME : CYN); var tp = new V3(0, 2.6 + 2.2 * (1 - eo3(u)), .3 + 3.0 * (1 - eo3(u))); TK.position.copy(tp); TK.rotation.set(-.1, .3 * (1 - eo3(u)), 0); TK.scale.setScalar(.35 + .5 * (1 - eo3(u)) + (done ? .15 * Math.sin((t - landT) * 4) : 0)); if (u >= 1) { TK.position.set(0, 2.6, .7); TK.scale.setScalar(.9); } } }; })();
/* Part C: DOM strip (eyebrow, step tracker, captions, end card), dips, __seek */
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function E(cls, css, html) { var e = document.createElement('div'); e.className = cls; e.style.cssText = css; e.innerHTML = html || ''; ov.appendChild(e); return e; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['// SAMAY RAINA LIVE · PRE-SALE', '// 1 LAKH ÷ 1 HOUR', '// STEP 1 · SPREAD THE SALE', '// STEP 2 · THE WAITING ROOM', '// STEP 3 · ONE SEAT, ONE HOLD', '// STEP 4 · ONE KEY, ONE CHARGE', '// STEP 5 · BOTS AT THE DOOR', '// WHAT IS KNOWN VS STANDARD', '// 12,569 AHEAD, REREAD'];
var STEPOF = [0, 0, 1, 2, 3, 4, 5, 0, 0], STEPCOL = ['#22e1ff', '#22e1ff', '#ffb800', '#9dff3a', '#ff3b30'];
var eye = E('mono', 'left:156px;top:166px;color:#22e1ff;font:600 23px "Cutive Mono",monospace;letter-spacing:.1em;white-space:nowrap;text-shadow:0 2px 10px rgba(0,0,0,.9)', ''), dot = E('', 'left:150px;top:0;width:0;height:0', '');
var chips = [1, 2, 3, 4, 5].map(function (n, i) { return E('chip', 'left:' + (918 - 5 * 44 + i * 44) + 'px;top:160px;width:38px;height:38px;border:3px solid ' + STEPCOL[i] + ';border-radius:6px;box-sizing:border-box;text-align:center;font:400 22px/32px Bungee;color:#f2f4ff;background:rgba(7,8,12,.85)', n); });
var pf = E('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f2f4ff;box-shadow:0 0 0 6px #ff2d78,0 0 60px 8px rgba(255,45,120,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = E('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f2f4ff;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', '@sandeshexplains'), hs = E('mono', 'left:385px;top:988px;color:#ffb800;font:400 26px "Cutive Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#9dff3a', 190], ['share', 'SHARE', '#22e1ff', 210], ['bell-ringing', 'SUBSCRIBE', '#ff2d78', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return E('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:rgba(7,8,12,.9);display:flex;align-items:center;justify-content:center;gap:10px;font:400 28px "Cutive Mono";letter-spacing:.05em;color:#f2f4ff;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#f2f4ff', chipInk: '#07080c', keywords: { lakh: '#ff2d78', ghante: '#ffb800', seat: '#9dff3a', crash: '#ff3b30' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var dipAt = SC.slice(1, 9);
var tCta = S0('cta');
/* sound events (the audio script reads window.EV through tools/events.mjs, so SFX land on the same words as the picture) */
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { var tb;
  ev(WS('h1', 'घंटे', .4), 'pop'); ev(WS('h1', 'दिस्ट्रिक्ट', .75), 'pop'); ev(S0('h2') + .1, 'pop'); ev(WS('h3', 'क्रैश', .0), 'slam'); ev(WS('h3', 'system', .3), 'ping'); ev(WS('h3', 'तुटी', .5), 'pop'); ev(WS('h3', 'सीट', .75), 'pop'); ev(S1('h3') - 2.0, 'whoosh');
  ev(WS('n1', 'लाग', .45), 'pop'); ev(WS('n1', 'घंटा', .6), 'pop'); ev(WS('n1', 'अथाइस', .85), 'ping'); ev(WS('n2', 'सर्वर', .5), 'ping'); var tS = WS('n3', 'सबका', .3); ev(tS - 2.2, 'rumble'); ev(tS + 1.6, 'buzz'); ev(WS('n3', 'एक', .35) + 1.5, 'card');
  tb = S0('s1b'); ev(SC[2] + .6, 'pop'); for (var k = 0; k < 10; k++) ev(tb - .6 + k * .7 + .3, 'tick'); ev(WS('s1b', 'वाटसेब', .9), 'ping'); ev(WS('s1b', 'प्री', .1), 'card'); ev(WS('s1c', 'टिकेटमास्टर', .2), 'pop');
  ev(WS('q1', 'वेटिंग', .8), 'card'); ev(WS('q2', 'आगे', .5), 'ping'); ev(WS('q3', 'पहले', .15), 'card'); for (k = 0; k < 3; k++) ev(WS('q3', 'कुकी', .5) + k * .5, 'tick'); ev(WS('q4', 'सेंट', .5), 'ping'); ev(WS('q4', 'बांटो', .5), 'pop'); ev(WS('q5', 'बग', .75) - 1.5, 'slam'); ev(Math.max(WS('q5', 'काम', .9), WS('q5', 'बग', .75) + .7), 'ping');
  var tTy = WS('t2', 'रेडिस', .6); ev(WS('t2', 'होल', .5) + .2, 'card'); for (k = 0; k < 14; k++) ev(tTy + k * .15, 'tick'); ev(WS('t3', 'NX', .0) - .1, 'card'); ev(WS('t3', 'के', .45), 'ping'); ev(WS('t3', 'निल', .75), 'buzz'); ev(WS('t4', 'टाइमर', .15), 'card'); ev(WS('t4', 'छुट', .55), 'drop');
  var t1x = WS('p1', 'दबाया', .35); ev(t1x, 'tick'); ev(WS('p1', 'कटका', .6), 'buzz'); ev(WS('p1', 'फिर', .75), 'tick'); ev(WS('p1', 'फिर', .75) + 1.1, 'ping'); ev(WS('p2', 'आइडम', .35), 'card'); ev(WS('p2', 'चार', .8), 'slam'); ev(S0('p3'), 'pop'); ev(S0('p4'), 'ping');
  var tE = S0('e1'); ev(WS('e1', 'BOT', .0) + .3, 'buzz'); ev(WS('e1', 'Ticketmaster', .2), 'pop'); ev(WS('e1', 'रेट', .85), 'card');
  var r1 = S0('r1'); ev(r1 + .1, 'pop'); for (k = 0; k < 4; k++) ev(WS('r1', 'स्क्रीन्शॉट', .5) - 2.8 + k * .75, 'tick'); for (k = 0; k < 4; k++) ev(WS('r1', 'इंडस्ट्री', .5) - 1.6 + k * .75, 'tick'); ev(WS('r1', 'अन्वेरिफाईड', .93) - .4, 'slam');
  ev(WS('r2', 'सीट', .85) + 1.0, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });

window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__SC = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t);
  G.forEach(function (g) { g.visible = false; }); TK.visible = TK2.visible = false; LBL.forEach(function (l) { l.visible = false; });
  motes.position.y = 0; R.toneMappingExposure = 1.05;
  SCN[sc](t); camAt(sc, t); applyCam(); clampLabels();
  /* strip */
  var e = EYE[sc]; eye.textContent = e; eye.style.color = STEPOF[sc] ? STEPCOL[STEPOF[sc] - 1] : '#22e1ff'; eye.style.opacity = clamp((t - SC[sc]) / .4 + .3); chips.forEach(function (c, i) { var on = STEPOF[sc] === i + 1, past = STEPOF[sc] > i + 1; c.style.display = sc >= 2 && sc <= 6 ? 'block' : 'none'; c.style.background = on ? STEPCOL[i] : 'rgba(7,8,12,.85)'; c.style.color = on ? '#07080c' : '#f2f4ff'; c.style.opacity = on ? 1 : (past ? .9 : .45); });
  /* end card */
  var ue = function (x) { return clamp((t - x) / .35); }, ec = sc === 8 && t >= tCta - .1;
  [pf, hn, hs].forEach(function (x, i) { var u = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = u > 0 ? 'block' : 'none'; x.style.opacity = u; x.style.transform = 'translateY(' + ((1 - eo3(u)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेर', .6), WS('cta', 'सब्स्क्राइब', .75)]; btns.forEach(function (b, i) { var u = ec ? ue(bt[i] - .1) : 0; b.style.display = u > 0 ? 'flex' : 'none'; b.style.opacity = u; var pulse = u >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(u); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  /* dips (hide the cut) */
  var dip = 0; dipAt.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#07080c'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  if (!window.__skipRender) R.render(S, C);
};
Promise.all(['400 40px Bungee', '600 30px Inter', '800 30px Inter', '400 30px "Cutive Mono"'].map(function (f) { return document.fonts.load(f); })).then(function () { var im = new Image(); im.onload = im.onerror = function () { window.__ready = true; }; im.src = 'img/profile.jpg'; });
})();
