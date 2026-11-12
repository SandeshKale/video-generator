/* d_scenes: mockup scenes A (hook: phone grid), B (jaali + threads), C (rangoli) — each a pure function of t */
(function () {
var T = THREE, S = B.S, W = B.WORLD, cam = B.cam, clamp = B.clamp, lerp = B.lerp, eio = B.eio, eo3 = B.eo3, eob = B.eob, hsh = B.hsh, cv = B.cv, C = B.C;
var UI = document.getElementById('ui');
function el(css, html) { var d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; if (html != null) d.innerHTML = html; UI.appendChild(d); return d; }
B.el = el;
var SH = 'text-shadow:0 4px 14px rgba(10,12,40,.55),0 1px 3px rgba(10,12,40,.8);';
// header: kicker chip + headline (Fredoka), key word in a solid block
var kick = el('left:156px;top:236px;font:600 30px Fredoka;letter-spacing:.08em;color:#1b1d3a;background:' + C.real + ';padding:6px 16px 4px;border-radius:10px;opacity:0');
var head = el('left:156px;top:296px;width:768px;font:700 84px/1.04 Fredoka;color:#fff7e6;letter-spacing:-.01em;' + SH + 'opacity:0');
var blk = function (txt, col, ink) { return '<span style="background:' + col + ';color:' + (ink || '#fff7e6') + ';padding:0 .16em;border-radius:.14em;text-shadow:none;box-decoration-break:clone">' + txt + '</span>'; };
// "ISKO KEHTE HAIN" paper tag with tape
var card = el('left:470px;top:560px;width:420px;padding:22px 26px 18px;background:#fff7e6;border-radius:6px;box-shadow:0 14px 30px rgba(10,12,40,.45);transform-origin:50% 0;opacity:0');
card.innerHTML = '<div style="position:absolute;left:150px;top:-16px;width:120px;height:32px;background:rgba(255,210,63,.85);transform:rotate(-4deg)"></div><div style="font:700 40px Caveat;color:#6a5a7a">isko kehte hain:</div><div class="tm" style="font:700 64px/1 Fredoka;color:#1b1d3a;margin-top:4px"></div>';
var cardTm = card.querySelector('.tm');
// handwritten world labels (chalk) with an arrow line
function chalkLabel() { var d = el('font:700 60px/1 Caveat;color:#fff7e6;' + SH + 'white-space:nowrap;opacity:0'); return d; }
var lab1 = chalkLabel(), lab2 = chalkLabel(), lab3 = chalkLabel();
var cap = document.getElementById('cap');
function setCap(t, words) { cap.innerHTML = words ? CAP.html(t, words, { plain: true, hi: C.real, ink: '#f1f3f8', fs: 40 }) : ''; }
function hideUI() { [kick, head, card, lab1, lab2, lab3].forEach(function (d) { d.style.opacity = 0; }); cap.innerHTML = ''; }
function show(d, t, t0, dur) { var u = clamp((t - t0) / (dur || .35)); d.style.opacity = u; d.style.transform = 'translateY(' + (1 - eo3(u)) * 18 + 'px)'; return u; }
function popCard(t, t0, term) { var u = clamp((t - t0) / .4); card.style.opacity = u > 0 ? 1 : 0; card.style.transform = 'rotate(-3deg) scale(' + (u > 0 ? eob(u) : 0) + ')'; cardTm.textContent = term; }
function place(d, x, y) { d.style.left = x + 'px'; d.style.top = y + 'px'; }
// simple word timing for the mockup captions (the real build uses the voice's Whisper times)
function wordsOf(txt, t0, t1) { var w = txt.split(' '), n = w.length; return w.map(function (x, i) { return { w: x, t0: t0 + (t1 - t0) * i / n, t1: t0 + (t1 - t0) * (i + 1) / n }; }); }

// ================= A: hook — the phone becomes a 4x4 grid; 15 AI, 1 real =================
var GRID = [], REAL = 5;
(function () {
  function tileTex(real) { return cv(128, 128, function (g, w, h) { g.fillStyle = real ? 'rgba(255,178,30,.86)' : 'rgba(255,63,142,.80)'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,247,230,.9)'; g.lineWidth = 5; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = real ? '#1b1d3a' : '#fff7e6'; g.font = '700 ' + (real ? 38 : 56) + 'px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(real ? 'ASLI' : 'AI', w / 2, h / 2 + 3); }); }
  var tr = tileTex(true), ta = tileTex(false), sw = .152 / 4, sh = .07 / 4;
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var i = r * 4 + c, m = new T.Mesh(new T.PlaneGeometry(sw * .96, sh * .94), new T.MeshBasicMaterial({ map: i === REAL ? tr : ta, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    m.position.set(-.076 + (c + .5) * sw, .035 - (r + .5) * sh, .0052); B.PHONE.add(m); GRID.push(m); }
})();
var kidHead = new T.Vector3();
function scnA(t) {
  var tex = B.renderGame(t); B.phoneScreen.material.map = tex; B.phoneScreen.material.needsUpdate = true;
  var K = B.KID, ph = B.PHONE; K.updateMatrixWorld(true);
  var pc = new T.Vector3(); ph.getWorldPosition(pc);
  // over-the-shoulder, then a crane up to show the lane (6.0 -> 8.0)
  var u = eio((t - 5.9) / 2.1), pClose = K.localToWorld(new T.Vector3(0, 1.52, .1)), pFar = new T.Vector3(2.4, 4.2, 7.8);
  var p = pClose.clone().lerp(pFar, u), tg = pc.clone().lerp(new T.Vector3(-.4, 1.0, -1.4), u);
  var push = (1 - u) * eio(t / 6) * .12; p.lerp(pc, push);
  cam.position.copy(p); cam.lookAt(tg.clone().add(new T.Vector3(0, .03 * (1 - u), 0))); cam.fov = lerp(40, 34, u); cam.updateProjectionMatrix();
  K.userData.P.head.visible = u > .3;
  B.bandOn(pc, lerp(.11, .16, u), lerp(30, 20, u));
  GRID.forEach(function (m, i) { var t0 = i === REAL ? 2.1 : 2.6 + (((i * 7) % 16) / 16) * 2.2, k = clamp((t - t0) / .28); m.material.opacity = k > 0 ? (i === REAL ? .95 : .9) : 0; m.scale.set(1, k > 0 ? eob(k) : .001, 1); });
  hideUI();
  kick.textContent = 'GTA 6 · 19 NOV'; show(kick, t, -1);
  if (t < 2.2) { head.innerHTML = 'GTA 6 aa raha hai!'; show(head, t, -1); }
  else { head.innerHTML = '16 mein se 15 dabbe<br>' + blk('AI', C.ai) + ' ne banaye!'; show(head, t, 2.25); }
  setCap(t, t < 1.6 ? wordsOf('GTA 6 aa raha hai! Par ek baat sunke chaunk jaoge.', 0, 1.6) : wordsOf('Aise game ki tasveer ke har 16 dabbon mein se 15 computer ne banaye hi nahi. AI ne andaaza lagaya!', 1.6, 7.6));
}

// ================= B: jaali — a thread from the eye through every hole =================
var KID2 = B.voxel({ s: 1.12, top: 0xffd23f, bot: 0x2f4fa8, skin: 0xa86f48 }); KID2.position.set(-.45, 0, -5.2); KID2.rotation.y = Math.PI; W.add(KID2);
KID2.userData.P.head.rotation.y = .05;
var TH = [], thrG = B.thrG = new T.Group(), EYE = new T.Vector3(); S.add(thrG);
B.initThreads = function () {
  W.updateMatrixWorld(true); KID2.userData.P.head.getWorldPosition(EYE); EYE.y += .2 * 1.12; EYE.z -= .14;
  // colour of each hole = what the eye really sees through it: render the lane from the eye with the jaali hidden
  B.jaaliMesh.visible = false; B.jPix.forEach(function (p) { p.m.visible = false; }); KID2.visible = false;
  var J = B.JAALI, jc0 = new T.Vector3(0, 1.45, 0).applyMatrix4(J.matrixWorld), ecam = new T.PerspectiveCamera(30, 1, .05, 300);
  ecam.position.copy(EYE); ecam.lookAt(jc0); var dist = EYE.distanceTo(jc0); ecam.fov = 2 * Math.atan(B.JS_HALF / dist) * 180 / Math.PI; ecam.updateProjectionMatrix();
  var R = B.R, N = 256; R.setRenderTarget(null); R.setViewport(0, 0, N, N); R.setScissor(0, 0, N, N); R.setScissorTest(true); R.render(S, ecam); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  var c = document.createElement('canvas'); c.width = N; c.height = N; var g = c.getContext('2d'); g.drawImage(R.domElement, 0, B.H - N, N, N, 0, 0, N, N);
  B.jaaliMesh.visible = true; B.jPix.forEach(function (p) { p.m.visible = true; }); KID2.visible = true;
  var rc = new T.Raycaster(), targets = []; W.traverse(function (o) { if (o.isMesh && o !== B.jaaliMesh && B.jPix.every(function (p) { return p.m !== o; })) targets.push(o); });
  KID2.traverse(function (o) { var i = targets.indexOf(o); if (i >= 0) targets.splice(i, 1); });
  B.jPix.forEach(function (p, k) {
    var hp = new T.Vector3(); p.m.getWorldPosition(hp); var dir = hp.clone().sub(EYE).normalize(); rc.set(EYE, dir); rc.far = 60;
    var hit = rc.intersectObjects(targets, false).filter(function (h) { return h.distance > EYE.distanceTo(hp) + .2; })[0];
    var end = hit ? hit.point : EYE.clone().addScaledVector(dir, 45);
    var sp = hp.clone().project(ecam), px = Math.round((sp.x + 1) / 2 * N), py = Math.round((1 - sp.y) / 2 * N), d = g.getImageData(clamp(px - 3, 0, N - 7), clamp(py - 3, 0, N - 7), 7, 7).data, rr = 0, gg = 0, bb = 0;
    for (var q = 0; q < d.length; q += 4) { rr += d[q]; gg += d[q + 1]; bb += d[q + 2]; } var nq = d.length / 4;
    var col = new T.Color('rgb(' + Math.round(rr / nq) + ',' + Math.round(gg / nq) + ',' + Math.round(bb / nq) + ')');
    var geo = new T.BufferGeometry().setFromPoints([EYE, end]); var ln = new T.Line(geo, new T.LineBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(1.6), transparent: true, opacity: .9, toneMapped: false }));
    thrG.add(ln); var dot = new T.Mesh(new T.SphereGeometry(.035, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(2.2), toneMapped: false })); thrG.add(dot);
    TH.push({ ln: ln, dot: dot, end: end, hp: hp, col: col, ord: (B.JN - 1 - p.r) * B.JN + p.c, p: p });
  });
};
function scnB(t) { B.KID.userData.P.head.visible = true;
  var lt = t - 8; W.updateMatrixWorld(true);
  var jc = new T.Vector3(0, 1.45, -7.4);
  // shot 1 (0-6): behind the kid's head, the jaali fills the frame; shot 2 (6-12): truck right + crane to see threads reach the well
  var u = eio((lt - 6.2) / 4.5);
  var p1 = new T.Vector3(1.3, 3.9, 2.0), p2 = new T.Vector3(2.1, 5.6, -3.6);
  cam.position.copy(p1.clone().lerp(p2, u)); cam.lookAt(jc.clone().add(new T.Vector3(0, .15, 0)).lerp(new T.Vector3(.2, .9, -9.4), u)); cam.fov = lerp(34, 38, u); cam.updateProjectionMatrix();
  B.bandOn(jc.clone().lerp(new T.Vector3(.2, 1.0, -9.0), u), lerp(.1, .2, u), 24);
  var n = TH.length;
  TH.forEach(function (h) {
    var t0 = 1.6 + h.ord / n * 4.2, k = clamp((lt - t0) / .55); // thread grows eye -> hole -> what it hits
    var cur = EYE.clone().lerp(h.end, eo3(k)); h.ln.geometry.setFromPoints([EYE, cur]); h.ln.visible = k > 0; h.dot.visible = k > 0 && k < 1; h.dot.position.copy(cur);
    h.ln.material.opacity = k >= 1 ? lerp(.85, .35, clamp((lt - t0 - .6) / 1.5)) : .9;
    var f = clamp((k - .55) / .3); h.p.m.material.color.copy(h.col).multiplyScalar(1.05); h.p.m.material.opacity = f;
  });
  hideUI();
  kick.textContent = 'TASVEER KAISE BANTI HAI?'; show(kick, t, 8.1);
  head.innerHTML = 'Har chhed tak<br>ek ' + blk('dhaaga', C.real, '#1b1d3a'); show(head, t, 8.2);
  var e = B.toScr(EYE), j = B.toScr(new T.Vector3(.35, 2.55, -7.4));
  lab1.textContent = 'aankh'; place(lab1, clamp(e.x + 70, 160, 760), clamp(e.y - 30, 480, 1220)); if (lt < 6) show(lab1, t, 9.2);
  lab2.textContent = 'har chhed = 1 rang'; place(lab2, clamp(j.x, 160, 560), clamp(j.y - 70, 480, 1220)); if (lt < 6) show(lab2, t, 10.4);
  if (lt > 7.4) popCard(t, 15.6, 'RAY TRACING'); card.style.top = '1030px'; card.style.left = '470px';
  setCap(t, wordsOf('Aankh se har chhed ki taraf ek dhaaga bhejo. Dhaaga jahaan takraaye, wahaan se poochho: yahaan kitni roshni hai?', 8.4, 19.6));
}

// ================= C: rangoli — few dots, then the AI joins them into the full picture =================
var rTex = cv(1024, 1024, function () {}), rC = rTex.userData.c, rG = rTex.userData.g, RIMG = null, RDOTS = [], RS = null;
var rang = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), new T.MeshStandardMaterial({ map: rTex, roughness: .95, transparent: true })); rang.rotation.x = -Math.PI / 2; rang.receiveShadow = true; B.RANG.add(rang);
// brass diyas around the rangoli
for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2, dx = Math.cos(a) * .95, dz = Math.sin(a) * .95; var dy = new T.Mesh(new T.CylinderGeometry(.05, .03, .04, 12), B.std(0xb87333, .35, .8)); dy.position.set(dx, .02, dz); B.RANG.add(dy); var fl = new T.Mesh(new T.SphereGeometry(.018, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(3, 2, .8), toneMapped: false })); fl.scale.y = 1.8; fl.position.set(dx, .07, dz); B.RANG.add(fl); }
var dl = new T.PointLight(0xffa040, 2.5, 3, 1.5); dl.position.set(0, .35, 0); B.RANG.add(dl);
B.initRangoli = function () {
  RIMG = B.gameToCanvas(3.2); // a real frame of our game, used as the picture inside the rangoli
  var ic = document.createElement('canvas'); ic.width = 128; ic.height = 59; var ig = ic.getContext('2d'); ig.drawImage(RIMG, 0, 0, 128, 59); var px = ig.getImageData(0, 0, 128, 59).data;
  for (var k = 0; k < 520; k++) { var x = hsh(k * 3.1) * 127, y = hsh(k * 7.7) * 58, q = (Math.floor(y) * 128 + Math.floor(x)) * 4; RDOTS.push({ x: x / 128, y: y / 59, c: 'rgb(' + px[q] + ',' + px[q + 1] + ',' + px[q + 2] + ')', s: k }); }
  RS = rough.canvas(rC);
};
var FX = 112, FY = 290, FW = 800, FH = 369; // picture frame inside the rangoli square (game aspect)
function drawRangoli(lt) {
  var g = rG; g.clearRect(0, 0, 1024, 1024);
  // traditional border: concentric dotted rings + petals, always present (the rangoli wali's frame)
  g.fillStyle = 'rgba(255,247,230,.10)'; g.fillRect(40, 40, 944, 944);
  var pet = ['#ff3f8e', '#ffb21e', '#2ec4b6', '#9b7bff'];
  for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; g.fillStyle = pet[i % 4]; g.beginPath(); g.ellipse(512 + Math.cos(a) * 470, 512 + Math.sin(a) * 470, 34, 16, a, 0, 7); g.fill(); }
  g.strokeStyle = '#fff7e6'; g.lineWidth = 6; g.setLineDash([2, 18]); g.lineCap = 'round'; g.strokeRect(80, 80, 864, 864); g.setLineDash([]);
  for (var i = 0; i < 4; i++) { var cx = [180, 844, 180, 844][i], cy = [180, 180, 844, 844][i]; for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; g.fillStyle = pet[(i + k) % 4]; g.beginPath(); g.ellipse(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 26, 11, a, 0, 7); g.fill(); } g.fillStyle = '#fff7e6'; g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fill(); }
  // the frame
  g.fillStyle = 'rgba(255,247,230,.16)'; g.fillRect(FX - 10, FY - 10, FW + 20, FH + 20); g.strokeStyle = '#fff7e6'; g.lineWidth = 5; g.strokeRect(FX - 14, FY - 14, FW + 28, FH + 28);
  // phase 1: dots appear (few rays)
  var nd = Math.floor(clamp(lt / 2.6) * RDOTS.length);
  // phase 2: AI fill spreads outward from the centre (a reveal of the full image, powder-textured)
  var fu = clamp((lt - 4.2) / 4.2);
  if (fu > 0) { g.save(); g.beginPath(); g.rect(FX, FY, FW, FH); g.clip(); var rad = eio(fu) * 560; g.beginPath(); g.arc(FX + FW / 2, FY + FH / 2, rad, 0, 7); g.clip(); g.drawImage(RIMG, FX, FY, FW, FH);
    for (var k = 0; k < 1400; k++) { g.fillStyle = 'rgba(255,255,255,' + hsh(k) * .07 + ')'; g.fillRect(FX + hsh(k * 3) * FW, FY + hsh(k * 5) * FH, 3, 3); } g.restore(); }
  // chalk lines joining neighbouring dots (the AI "joining the dots"), drawn just ahead of the fill
  var lu = clamp((lt - 2.8) / 3.0);
  if (lu > 0) { var nl = Math.floor(lu * 220); for (var k = 0; k < nl; k++) { var a = RDOTS[k], b = RDOTS[(k * 37 + 11) % RDOTS.length]; if (Math.abs(a.x - b.x) > .09 || Math.abs(a.y - b.y) > .16) continue;
    RS.line(FX + a.x * FW, FY + a.y * FH, FX + b.x * FW, FY + b.y * FH, { stroke: 'rgba(255,247,230,' + (fu > 0 ? .5 * (1 - fu) : .75) + ')', strokeWidth: 2.2, roughness: 1.2, seed: k + 1 }); } }
  for (var k = 0; k < nd; k++) { var d = RDOTS[k], x = FX + d.x * FW, y = FY + d.y * FH; g.fillStyle = d.c; g.beginPath(); g.arc(x, y, 8.5, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,247,230,' + (fu > .6 ? 0 : .55) + ')'; g.lineWidth = 2; g.stroke(); }
  rTex.needsUpdate = true;
}
var MAKER = B.voxel({ s: 1.05, top: 0xff3f8e, bot: 0xff3f8e, skin: 0x9a6440, hair: 0x18120f }); MAKER.position.set(1.15 - 1.05, 0, .3 + .1); MAKER.rotation.y = Math.PI / 2; W.add(MAKER);
(function () { var P = MAKER.userData.P; P.legL.rotation.x = -1.3; P.legR.rotation.x = -1.3; P.legL.position.y -= .3; P.legR.position.y -= .3; P.torso.position.y -= .33; P.armL.position.y -= .33; P.armR.position.y -= .33; P.head.position.y -= .33; P.armR.rotation.x = -1.0; P.armL.rotation.x = -.6; P.head.rotation.x = .5; })();
MAKER.visible = false; B.MAKER = MAKER;
function scnC(t) {
  var lt = t - 20; MAKER.visible = true; drawRangoli(lt);
  var rc = new T.Vector3(1.15, 0, .3);
  var u = eio(lt / 12); // slow, authored descent from a high oblique to nearly top-down
  cam.position.set(lerp(1.15 + 1.2, 1.15 + .35, u), lerp(3.6, 3.1, u), lerp(.3 + 3.0, .3 + 1.5, u)); cam.lookAt(rc.x, 0, rc.z - .1); cam.fov = 34; cam.updateProjectionMatrix();
  var P = MAKER.userData.P; P.armR.rotation.x = -1.0 + Math.sin(lt * 5) * .12;
  B.bandOn(rc, .13, 28);
  hideUI();
  kick.textContent = 'JUGAAD 1'; show(kick, t, 20.1);
  if (lt < 4.2) head.innerHTML = 'Kam dhaage =<br>' + blk('bindiyan', C.ai) + ' hi bindiyan'; else head.innerHTML = 'AI ' + blk('bindu jodkar', C.real, '#1b1d3a') + '<br>poori tasveer banata hai';
  show(head, t, lt < 4.2 ? 20.2 : 24.2);
  var s = B.toScr(new T.Vector3(rc.x - .55, 0, rc.z + .95)); lab1.textContent = 'sirf thode dhaage'; place(lab1, clamp(s.x - 80, 160, 600), clamp(s.y + 10, 480, 1230)); if (lt < 4.2) show(lab1, t, 21.6);
  if (lt > 8.4) { popCard(t, 28.4, 'RAY RECONSTRUCTION'); card.style.top = '1040px'; card.style.left = '420px'; cardTm.style.fontSize = '50px'; }
  setCap(t, wordsOf('Tasveer bindiyon wali banti hai, jaise rangoli ke bindu. Phir AI, ek maahir rangoli wali ki tarah, bindu jodkar poori tasveer bana deta hai.', 20.3, 31.6));
}
B.SCN = [{ t0: 0, t1: 8, f: scnA }, { t0: 8, t1: 20, f: scnB }, { t0: 20, t1: 32, f: scnC }];
})();
