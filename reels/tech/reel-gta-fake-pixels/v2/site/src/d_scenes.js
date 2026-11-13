/* d_scenes: 11 scenes in one lane, timed from the voice (window.TM). Every scene = pose(t) (authored camera) + act(t) (objects, UI). Pure functions of t. */
(function () {
var T = THREE, S = B.S, W = B.WORLD, cam = B.cam, clamp = B.clamp, lerp = B.lerp, eio = B.eio, eo3 = B.eo3, eob = B.eob, hsh = B.hsh, cv = B.cv, C = B.C, TM = window.TM;
var V = function (x, y, z) { return new T.Vector3(x, y, z); };
// ---------- timing ----------
function GR(id) { for (var i = 0; i < TM.groups.length; i++) if (TM.groups[i].group === id) return TM.groups[i]; return null; }
B.GR = GR;
// word start time in group gid matching any of 'a|b' (k-th hit; last=true takes the last hit); falls back to the needle's position in the text
function WS(gid, needle, k, last) {
  var ns = needle.split('|'), hits = [];
  TM.words.forEach(function (w) { if (w[3] === gid && ns.some(function (n) { return w[0].indexOf(n) >= 0; })) hits.push(w[1]); });
  if (hits.length) return last ? hits[hits.length - 1] : hits[Math.min(k || 0, hits.length - 1)];
  var g = GR(gid), tx = TM.B[gid], idx = -1; ns.some(function (n) { idx = tx.indexOf(n); return idx >= 0; });
  (window.__ws = window.__ws || []).push(gid + ':' + needle); if (idx < 0) idx = 0;
  return g.start + (g.end - g.start) * idx / tx.length;
}
B.WS = WS;
// ---------- UI ----------
var UI = document.getElementById('stage');
function el(css, html) { var d = document.createElement('div'); d.style.cssText = 'position:absolute;' + css; if (html != null) d.innerHTML = html; UI.appendChild(d); return d; }
B.el = el;
var SH = 'text-shadow:0 4px 14px rgba(10,12,40,.55),0 1px 3px rgba(10,12,40,.8);';
var kick = el('left:156px;top:236px;font:600 30px Fredoka;letter-spacing:.08em;color:#1b1d3a;background:' + C.real + ';padding:6px 16px 4px;border-radius:10px;opacity:0');
var head = el('left:156px;top:296px;width:740px;font:700 82px/1.18 Fredoka;color:#fff7e6;letter-spacing:-.01em;' + SH + 'opacity:0');
var sub = el('left:156px;top:500px;width:740px;font:600 34px/1.25 Inter;color:#fff7e6;' + SH + 'opacity:0');
var blk = function (txt, col, ink) { return '<span style="background:' + col + ';color:' + (ink || '#fff7e6') + ';padding:0 .16em;border-radius:.14em;text-shadow:none;box-decoration-break:clone;-webkit-box-decoration-break:clone">' + txt + '</span>'; };
var AI = function (x) { return blk(x, C.ai); }, RL = function (x) { return blk(x, C.real, '#1b1d3a'); };
var card = el('left:470px;top:1030px;width:430px;padding:22px 26px 18px;background:#fff7e6;border-radius:6px;box-shadow:0 14px 30px rgba(10,12,40,.45);transform-origin:50% 0;opacity:0;box-sizing:border-box');
card.innerHTML = '<div style="position:absolute;left:150px;top:-16px;width:120px;height:32px;background:rgba(255,210,63,.85);transform:rotate(-4deg)"></div><div style="font:700 40px/1 Caveat;color:#6a5a7a">isko kehte hain:</div><div class="tm" style="font:700 60px/1.05 Fredoka;color:#1b1d3a;margin-top:24px"></div>';
var cardTm = card.querySelector('.tm');
function chalk() { return el('font:700 58px/1 Caveat;color:#fff7e6;' + SH + 'white-space:nowrap;opacity:0'); }
var L1 = chalk(), L2 = chalk(), L3 = chalk();
var big = el('left:162px;width:756px;text-align:center;font:700 120px/1 Fredoka;color:' + C.real + ';' + SH + 'opacity:0;font-variant-numeric:tabular-nums');
var chip = el('font:700 44px Fredoka;padding:8px 22px 6px;border-radius:14px;opacity:0;white-space:nowrap');
var cap = document.getElementById('cap');
// end card
var endc = el('left:162px;top:560px;width:756px;height:700px;opacity:0;text-align:center');
endc.innerHTML = '<div style="width:300px;height:300px;margin:0 auto;border-radius:50%;background:#0d1330;padding:14px;box-sizing:border-box;box-shadow:0 0 0 8px #b4f000,0 18px 40px rgba(0,0,0,.5)"><img src="nerdlogic-profile.jpg" style="width:100%;height:100%;border-radius:50%;display:block"></div>' +
  '<div style="font:700 86px Fredoka;color:#fff7e6;margin-top:46px;' + SH + '">nerdlogic.co</div><div class="btns" style="display:flex;justify-content:center;gap:22px;margin-top:40px"></div>';
var BTN = ['LIKE', 'SHARE', 'SUBSCRIBE'].map(function (x, i) { var b = document.createElement('div'); b.textContent = x; b.style.cssText = 'font:700 40px Fredoka;padding:14px 28px 10px;border-radius:40px;opacity:0;' + (i === 2 ? 'background:#ff3f8e;color:#fff7e6' : 'background:#fff7e6;color:#1b1d3a'); endc.querySelector('.btns').appendChild(b); return b; });

function hideUI() { [kick, head, sub, card, L1, L2, L3, big, chip, endc].forEach(function (d) { d.style.opacity = 0; d.style.transform = ''; }); }
function show(d, t, t0, dur) { var u = clamp((t - t0) / (dur || .35)); d.style.opacity = u; d.style.transform = 'translateY(' + (1 - eo3(u)) * 18 + 'px)'; return u; }
function popCard(t, t0, term, fs) { var u = clamp((t - t0) / .4); card.style.opacity = u > 0 ? 1 : 0; card.style.transform = 'rotate(-3deg) scale(' + (u > 0 ? eob(u) : 0) + ')'; cardTm.textContent = term; cardTm.style.fontSize = (fs || 60) + 'px'; }
function place(d, x, y) { d.style.left = Math.round(x) + 'px'; d.style.top = Math.round(y) + 'px'; }
// a chalk label anchored to a world point, clamped inside the safe box
function lab(d, txt, p, dx, dy, t, t0, t1) { if (t < t0 || (t1 != null && t > t1)) return; var s = B.toScr(p); d.textContent = txt; var w = txt.length * 30; place(d, clamp(s.x + (dx || 0), 160, 918 - w), clamp(s.y + (dy || 0), 560, 1250)); show(d, t, t0); if (t1 != null) d.style.opacity = Math.min(+d.style.opacity, clamp((t1 - t) / .3)); }
function kickHead(t, k, h, t0) { kick.textContent = k; show(kick, t, t0 - .1); head.innerHTML = h; show(head, t, t0); }
B.UIs = { hide: hideUI };

// ---------- shared actors ----------
var GRID = [], REAL = 0;
(function () {
  function tileTex(real) { return cv(128, 128, function (g, w, h) { g.fillStyle = real ? 'rgba(255,178,30,.9)' : 'rgba(255,63,142,.84)'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,247,230,.9)'; g.lineWidth = 5; g.strokeRect(3, 3, w - 6, h - 6); g.fillStyle = real ? '#1b1d3a' : '#fff7e6'; g.font = '700 ' + (real ? 38 : 56) + 'px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(real ? 'ASLI' : 'AI', w / 2, h / 2 + 3); }); }
  var tr = tileTex(true), ta = tileTex(false), sw = .152 / 4, sh = .07 / 4;
  for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var i = r * 4 + c, m = new T.Mesh(new T.PlaneGeometry(sw * .96, sh * .94), new T.MeshBasicMaterial({ map: i === REAL ? tr : ta, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    m.position.set(-.076 + (c + .5) * sw, .035 - (r + .5) * sh, .0052); m.userData = { r: r, c: c, tR: tr, tA: ta }; B.PHONE.add(m); GRID.push(m); }
})();
B.gridOff = function () { gridAt(function () { return 0; }); };
function gridAt(fn, realFn) { GRID.forEach(function (m, i) { var k = fn(m.userData.r, m.userData.c, i); m.material.map = (realFn ? realFn(m.userData.r, m.userData.c, i) : i === REAL) ? GRID[REAL].userData.tR : GRID[REAL].userData.tA; m.material.opacity = k > 0 ? .92 : 0; m.scale.set(1, k > 0 ? eob(Math.min(1, k)) : .001, 1); }); }
var KID = B.KID, KID2 = B.voxel({ s: 1.12, top: 0xffd23f, bot: 0x2f4fa8, skin: 0xa86f48 }); W.add(KID2); B.KID2 = KID2;
function phonePose(t, extraPush) { // first-person POV on the kid's phone
  KID.updateMatrixWorld(true); var pc = new T.Vector3(); B.PHONE.getWorldPosition(pc); var p = KID.localToWorld(V(0, 1.52, .1)); p.lerp(pc, extraPush || 0);
  return { p: p, q: pc.clone().add(V(0, .03, 0)), fov: 40, band: pc, wid: .11, amp: 30, hideHead: true };
}
function gameOnPhone(t, blocks, grid) { B.phoneMat.uniforms.map.value = B.renderGame(t); B.phoneMat.uniforms.blocks.value.set(blocks || 0, blocks ? Math.round(blocks * .46) : 0); B.phoneMat.uniforms.grid.value = grid || 0; }

// ================= 1. HOOK (g1, g2) =================
function hookPose(t, sc) { var cU = eio((t - (sc.t1 - 2.2)) / 2.0), P = phonePose(t, eio(t / 6) * .12 * (1 - cU)); var far = V(2.0, 4.4, 7.6);
  return cU <= 0 ? P : { p: P.p.clone().lerp(far, cU), q: P.q.clone().lerp(V(-.2, 1.0, -2.4), cU), fov: lerp(40, 36, cU), band: P.band.clone().lerp(V(0, 1, 0), cU), wid: lerp(.11, .18, cU), amp: lerp(30, 20, cU), hideHead: cU < .3 }; }
function hookAct(t, sc) {
  gameOnPhone(t, 0, 0);
  var g2 = GR('g2'), tg = WS('g2', 'सोलह|सोला'), tAI = WS('g2', 'एआई|AI|अंदाज़|अन्दा');
  gridAt(function (r, c, i) { return i === REAL ? (t - tg) / .28 : (t - (tg + .5 + ((i * 7) % 16) / 16 * 1.6)) / .28; });
  kick.textContent = 'GTA 6 · 19 NOV'; show(kick, t, -1);
  if (t < tg - .2) { head.innerHTML = 'GTA 6 aa raha hai!'; show(head, t, -1); }
  else { head.innerHTML = '16 mein se 15 pixel<br>' + AI('AI') + ' ka andaaza!'; show(head, t, tg - .2); sub.textContent = 'NVIDIA ka daawa · ek khaas setting par'; show(sub, t, tg + .3); sub.style.top = '500px'; }
}

// ================= 2. PIXEL (g3, g4, g5) — jaali front, then the phone screen as a jaali =================
var tPhone = function () { return WS('g4', 'फ़ोन|फोन') - .35; };
function pixPose(t, sc) {
  if (t < tPhone()) { var u = eio((t - sc.t0) / 4); return { p: V(0, lerp(2.1, 1.75, u), lerp(2.2, .9, u)), q: V(0, 1.5, -7.4), fov: 34, band: V(0, 1.45, -7.4), wid: .14, amp: 26 }; }
  var P = phonePose(t, .1 + eio((t - tPhone()) / 6) * .1); return P;
}
function pixAct(t, sc) {
  var tc = WS('g3', 'छेद|रंग'), tP = tPhone(), tpx = WS('g4', 'पिक्सल|पिक्सेल'), t4 = WS('g5', 'फ़ोर|फोर|4'), t83 = WS('g5', 'तिरासी|83');
  KID2.visible = false;
  // holes fill one flat colour each, row by row from the top
  B.jPix.forEach(function (p) { var k = clamp((t - (tc + (B.JN - 1 - p.r) * .12 + p.c * .03)) / .25); p.m.material.color.copy(p.col || p.m.material.color); p.m.material.opacity = k; });
  if (t < tP) {
    kickHead(t, 'TASVEER KYA HAI?', 'Har chhed se<br>bas ' + RL('ek rang'), sc.t0 + .2);
    lab(L1, '1 chhed = 1 rang', V(.6, 2.45, -7.4), -40, -80, t, tc + .6);
  } else {
    // the phone screen, seen as a jaali: big blocks -> finer -> 4K
    var bl = t < t4 ? 16 : Math.round(lerp(16, 900, eio((t - t4) / 1.8)));
    gameOnPhone(t, bl, t < t4 + 1.2 ? .8 : lerp(.8, 0, clamp((t - t4 - 1.2) / .6)));
    if (t < t83 - .3) kickHead(t, 'PHONE KI SCREEN', 'Screen bhi ek<br>' + RL('jaali') + ' hai', tP + .1);
    else { kickHead(t, '4K SCREEN', RL('83 lakh') + ' chhed!', t83 - .3); var n = Math.round(8294400 * eio((t - t83) / 1.4)); big.textContent = n.toLocaleString('en-IN'); big.style.top = '520px'; big.style.fontSize = '96px'; show(big, t, t83);
      sub.textContent = '3840 × 2160 = 82,94,400 pixel'; sub.style.top = '640px'; show(sub, t, t83 + 1.2); }
    if (t >= tpx - .1 && t < t83 - .4) popCard(t, tpx, 'PIXEL'); card.style.top = '600px'; card.style.left = '480px';
  }
}

// ================= 3. LIGHT (g6, g7) — the moon in the well =================
var RAYP = null, rayL = new T.Mesh(new T.BufferGeometry(), new T.MeshBasicMaterial({ color: new T.Color(2.4, 2.0, 1.2), toneMapped: false })), rayDot = new T.Mesh(new T.SphereGeometry(.06, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(3, 2.6, 1.6), toneMapped: false }));
S.add(rayL); S.add(rayDot); B.rayHide = function () { rayL.visible = false; rayDot.visible = false; };
var rayTube = null;
function lightPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(1.9, 1.6, u), lerp(4.2, 3.9, u), lerp(-7.0, -7.6, u)), q: V(.2, .8, -11.2), fov: 42, band: V(.4, .8, -11.2), wid: .16, amp: 24 }; }
function lightAct(t, sc) {
  KID2.visible = true; KID2.position.set(-1.3, 0, -10.9); KID2.rotation.y = Math.PI / 2; KID2.userData.P.head.rotation.x = .55;
  W.updateMatrixWorld(true); var eye = new T.Vector3(); KID2.userData.P.head.getWorldPosition(eye); eye.y += .2 * 1.12;
  var moonP = B.moon.position.clone(), water = V(.2, .62, -11.35);
  var src = water.clone().add(moonP.clone().sub(water).normalize().multiplyScalar(9));
  var tr = WS('g7', 'रोशनी'), tt = WS('g7', 'टकरा|तकरा'), tm = WS('g7', 'मुड़|मुड|मुढ'), ta = WS('g7', 'आँख|आंख|आख');
  var k1 = clamp((t - tr) / (tt - tr + .2)), k2 = clamp((t - tm) / Math.max(.4, ta - tm + .3));
  var pts = [src.clone()]; var a = src.clone().lerp(water, eo3(k1)); pts.push(a); var cur = a;
  if (k1 >= 1) { cur = water.clone().lerp(eye, eo3(k2)); pts.push(cur); }
  rayL.geometry.dispose(); rayL.geometry = pts.length > 1 && pts[0].distanceTo(pts[pts.length - 1]) > .01 ? new T.TubeGeometry(new T.CurvePath().add ? (function () { var cp = new T.CurvePath(); for (var q = 1; q < pts.length; q++) cp.add(new T.LineCurve3(pts[q - 1], pts[q])); return cp; })() : null, 64, .035, 6, false) : new T.BufferGeometry(); rayL.visible = t >= tr; rayDot.visible = t >= tr && k2 < 1; rayDot.position.copy(cur);
  kickHead(t, 'RANG KAHAAN SE?', t < tr - .2 ? RL('Roshni') + ' se!' : 'Roshni ' + RL('takraati') + ',<br>mudti, aankh tak', sc.t0 + .2);
  if (rayL.visible) lab(L1, 'chaand ki roshni', src.clone().lerp(water, .3), 30, -40, t, tr + .3);
  lab(L2, 'takraayi, mudi', water, -40, -110, t, tt);
  lab(L3, 'aankh', eye, 40, -40, t, ta);
}

// ================= 4. RAY TRACING (g8, g9) — a thread from the eye through every hole =================
var TH = [], thrG = B.thrG = new T.Group(), EYE = new T.Vector3(); S.add(thrG);
B.initThreads = function () {
  KID2.position.set(-.45, 0, -5.2); KID2.rotation.y = Math.PI; KID2.userData.P.head.rotation.set(0, .05, 0);
  W.updateMatrixWorld(true); KID2.userData.P.head.getWorldPosition(EYE); EYE.y += .2 * 1.12; EYE.z -= .14;
  B.jaaliMesh.visible = false; B.jPix.forEach(function (p) { p.m.visible = false; }); KID2.visible = false; B.SPOOLS.visible = false;
  var J = B.JAALI, jc0 = new T.Vector3(0, 1.45, 0).applyMatrix4(J.matrixWorld), ecam = new T.PerspectiveCamera(30, 1, .05, 300);
  ecam.position.copy(EYE); ecam.lookAt(jc0); var dist = EYE.distanceTo(jc0); ecam.fov = 2 * Math.atan(B.JS_HALF / dist) * 180 / Math.PI; ecam.updateProjectionMatrix();
  var R = B.R, N = 256; R.setRenderTarget(null); R.setViewport(0, 0, N, N); R.setScissor(0, 0, N, N); R.setScissorTest(true); R.render(S, ecam); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  var c = document.createElement('canvas'); c.width = N; c.height = N; var g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(R.domElement, 0, B.H - N, N, N, 0, 0, N, N);
  B.jaaliMesh.visible = true; B.jPix.forEach(function (p) { p.m.visible = true; }); KID2.visible = true;
  var rc = new T.Raycaster(), targets = []; W.traverse(function (o) { if (o.isMesh && o !== B.jaaliMesh && B.jPix.every(function (p) { return p.m !== o; })) targets.push(o); });
  KID2.traverse(function (o) { var i = targets.indexOf(o); if (i >= 0) targets.splice(i, 1); });
  B.jPix.forEach(function (p) {
    var hp = new T.Vector3(); p.m.getWorldPosition(hp); var dir = hp.clone().sub(EYE).normalize(); rc.set(EYE, dir); rc.far = 60;
    var hit = rc.intersectObjects(targets, false).filter(function (h) { return h.distance > EYE.distanceTo(hp) + .2; })[0];
    var end = hit ? hit.point : EYE.clone().addScaledVector(dir, 45);
    var sp = hp.clone().project(ecam), px = Math.round((sp.x + 1) / 2 * N), py = Math.round((1 - sp.y) / 2 * N), d = g.getImageData(clamp(px - 3, 0, N - 7), clamp(py - 3, 0, N - 7), 7, 7).data, rr = 0, gg = 0, bb = 0;
    for (var q = 0; q < d.length; q += 4) { rr += d[q]; gg += d[q + 1]; bb += d[q + 2]; } var nq = d.length / 4;
    p.col = new T.Color('rgb(' + Math.round(rr / nq) + ',' + Math.round(gg / nq) + ',' + Math.round(bb / nq) + ')');
    var ln = new T.Line(new T.BufferGeometry().setFromPoints([EYE, end]), new T.LineBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(1.6), transparent: true, opacity: .9, toneMapped: false }));
    thrG.add(ln); var dot = new T.Mesh(new T.SphereGeometry(.035, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(C.thread).multiplyScalar(2.2), toneMapped: false })); thrG.add(dot);
    TH.push({ ln: ln, dot: dot, end: end, ord: (B.JN - 1 - p.r) * B.JN + p.c, p: p });
  });
};
function rtPose(t, sc) { var u = eio((t - (WS('g9', 'पूछो|पूछ') - .3)) / 3.2), jc = V(0, 1.6, -7.4);
  return { p: V(1.3, 3.9, 2.0).lerp(V(2.1, 5.6, -3.6), u), q: jc.clone().lerp(V(.2, .9, -9.4), u), fov: lerp(34, 38, u), band: V(0, 1.45, -7.4).lerp(V(.2, 1.0, -9.0), u), wid: lerp(.1, .2, u), amp: 24 }; }
function rtAct(t, sc) {
  KID2.visible = true; KID2.position.set(-.45, 0, -5.2); KID2.rotation.y = Math.PI; KID2.userData.P.head.rotation.set(0, .05, 0);
  var tb = WS('g8', 'धागा'), n = TH.length, span = Math.max(2.5, WS('g9', 'रोशनी', 0, true) - tb);
  thrG.visible = true;
  TH.forEach(function (h) {
    var t0 = tb + h.ord / n * span * .8, k = clamp((t - t0) / .55);
    var cur = EYE.clone().lerp(h.end, eo3(k)); h.ln.geometry.setFromPoints([EYE, cur]); h.ln.visible = k > 0; h.dot.visible = k > 0 && k < 1; h.dot.position.copy(cur);
    h.ln.material.opacity = k >= 1 ? lerp(.85, .35, clamp((t - t0 - .6) / 1.5)) : .9;
    h.p.m.material.color.copy(h.p.col); h.p.m.material.opacity = clamp((k - .55) / .3);
  });
  kickHead(t, 'GAME ULTA KARTA HAI', 'Har chhed tak<br>ek ' + RL('dhaaga'), sc.t0 + .2);
  lab(L1, 'aankh', EYE, 70, -30, t, tb - .4, WS('g9', 'पूछो|पूछ') - .3);
  lab(L2, 'har chhed = 1 dhaaga', V(.35, 2.55, -7.4), 0, -80, t, tb + 1.0, WS('g9', 'पूछो|पूछ') - .3);
  var trt = WS('g9', 'रे|ट्रेसिंग'); if (t >= trt - .1) popCard(t, trt, 'RAY TRACING');
  card.style.top = '1030px'; card.style.left = '470px';
}

// ================= 5. COST (g10, g11) — spools of thread bury the lane; the Cars clock =================
function costPose(t, sc) { var tc = WS('g11', 'फ़िल्म|फिल्म|कार्स') - .5, u = eio((t - tc) / 1.6);
  var a = { p: V(.3, 4.6, 6.0), q: V(-.2, .4, .9), fov: 40, band: V(0, .4, 1.2), wid: .2, amp: 22 };
  var b = { p: V(1.9, 4.0, 1.6), q: V(-2.2, 4.4, -1.0), fov: 36, band: V(-2.18, 4.15, -1.0), wid: .12, amp: 26 };
  if (u <= 0) { var k = eio((t - sc.t0) / 3); a.p.y -= k * .6; a.p.z -= k * .6; return a; }
  return { p: a.p.clone().lerp(b.p, u), q: a.q.clone().lerp(b.q, u), fov: lerp(a.fov, b.fov, u), band: a.band.clone().lerp(b.band, u), wid: lerp(a.wid, b.wid, u), amp: lerp(a.amp, b.amp, u) };
}
function costAct(t, sc) {
  var t83 = WS('g10', 'तिरासी|83'), t60 = WS('g10', 'साठ|60'), t50 = WS('g11', 'पचास|50'), tc = WS('g11', 'फ़िल्म|फिल्म|कार्स'), t17 = WS('g11', 'सत्रह|17');
  B.SPOOLS.visible = true; B.spoolsAt(clamp((t - t83 + .3) / Math.max(2, t50 - t83 + 1.2)), t);
  B.clockAt(t < tc ? 3 : 3 + 17 * eio((t - t17 + .4) / 2.4));
  kick.textContent = 'KITNA KAAM?'; show(kick, t, sc.t0 + .1);
  if (t < t60 - .2) head.innerHTML = 'Ek tasveer:<br>' + RL('83 lakh') + ' dhaage';
  else if (t < t50 - .2) head.innerHTML = '83 lakh × ' + RL('60') + '<br>har second';
  else if (t < tc - .2) head.innerHTML = '= ' + AI('50 crore') + '<br>dhaage / second!';
  else head.innerHTML = 'Cars film: ' + RL('17 ghante') + '<br>ek tasveer';
  show(head, t, t < t60 - .2 ? sc.t0 + .2 : t < t50 - .2 ? t60 - .2 : t < tc - .2 ? t50 - .2 : tc - .2);
  if (t >= tc) { sub.textContent = 'Pixar Cars (2006), D23 ke mutabiq, average · reported'; sub.style.top = '500px'; show(sub, t, tc + .4); }
  if (t > t60 - .2 && t < tc - .3) { chip.textContent = '× 60 / SECOND'; chip.style.background = C.real; chip.style.color = '#1b1d3a'; place(chip, 156, 540); show(chip, t, t60); }
  if (t >= tc) { var hrs = Math.min(17, Math.floor(17 * eio((t - t17 + .4) / 2.4))); big.textContent = hrs + ' ghante'; big.style.top = '600px'; big.style.fontSize = '88px'; show(big, t, t17 - .2); }
}

// ================= 6. RAY RECONSTRUCTION (g12, g13) — rangoli =================
var rTex = cv(1024, 1024, function () {}), rC = rTex.userData.c, rG = rTex.userData.g, RIMG = null, RDOTS = [], RS = null;
var rang = new T.Mesh(new T.PlaneGeometry(1.6, 1.6), new T.MeshStandardMaterial({ map: rTex, roughness: .95, transparent: true })); rang.rotation.x = -Math.PI / 2; rang.receiveShadow = true; B.RANG.add(rang);
for (var i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2, dx = Math.cos(a) * .95, dz = Math.sin(a) * .95; var dy = new T.Mesh(new T.CylinderGeometry(.05, .03, .04, 12), B.std(0xb87333, .35, .8)); dy.position.set(dx, .02, dz); B.RANG.add(dy); var fl = new T.Mesh(new T.SphereGeometry(.018, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(3, 2, .8), toneMapped: false })); fl.scale.y = 1.8; fl.position.set(dx, .07, dz); B.RANG.add(fl); }
var dl = new T.PointLight(0xffa040, 2.5, 3, 1.5); dl.position.set(0, .35, 0); B.RANG.add(dl);
B.initRangoli = function () {
  RIMG = B.gameToCanvas(3.2);
  var ic = document.createElement('canvas'); ic.width = 128; ic.height = 59; var ig = ic.getContext('2d', { willReadFrequently: true }); ig.drawImage(RIMG, 0, 0, 128, 59); var px = ig.getImageData(0, 0, 128, 59).data;
  for (var k = 0; k < 520; k++) { var x = hsh(k * 3.1) * 127, y = hsh(k * 7.7) * 58, q = (Math.floor(y) * 128 + Math.floor(x)) * 4; RDOTS.push({ x: x / 128, y: y / 59, c: 'rgb(' + px[q] + ',' + px[q + 1] + ',' + px[q + 2] + ')' }); }
  RS = rough.canvas(rC);
};
var FX = 112, FY = 290, FW = 800, FH = 369;
function drawRangoli(nd, lu, fu) {
  var g = rG; g.clearRect(0, 0, 1024, 1024);
  g.fillStyle = 'rgba(255,247,230,.10)'; g.fillRect(40, 40, 944, 944);
  var pet = ['#ff3f8e', '#ffb21e', '#2ec4b6', '#9b7bff'];
  for (var i = 0; i < 28; i++) { var a = i / 28 * Math.PI * 2; g.fillStyle = pet[i % 4]; g.beginPath(); g.ellipse(512 + Math.cos(a) * 470, 512 + Math.sin(a) * 470, 34, 16, a, 0, 7); g.fill(); }
  g.strokeStyle = '#fff7e6'; g.lineWidth = 6; g.setLineDash([2, 18]); g.lineCap = 'round'; g.strokeRect(80, 80, 864, 864); g.setLineDash([]);
  for (var i = 0; i < 4; i++) { var cx = [180, 844, 180, 844][i], cy = [180, 180, 844, 844][i]; for (var k = 0; k < 8; k++) { var a = k / 8 * Math.PI * 2; g.fillStyle = pet[(i + k) % 4]; g.beginPath(); g.ellipse(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, 26, 11, a, 0, 7); g.fill(); } g.fillStyle = '#fff7e6'; g.beginPath(); g.arc(cx, cy, 14, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(255,247,230,.16)'; g.fillRect(FX - 10, FY - 10, FW + 20, FH + 20); g.strokeStyle = '#fff7e6'; g.lineWidth = 5; g.strokeRect(FX - 14, FY - 14, FW + 28, FH + 28);
  if (fu > 0) { g.save(); g.beginPath(); g.rect(FX, FY, FW, FH); g.clip(); g.beginPath(); g.arc(FX + FW / 2, FY + FH / 2, eio(fu) * 560, 0, 7); g.clip(); g.drawImage(RIMG, FX, FY, FW, FH);
    for (var k = 0; k < 1400; k++) { g.fillStyle = 'rgba(255,255,255,' + hsh(k) * .07 + ')'; g.fillRect(FX + hsh(k * 3) * FW, FY + hsh(k * 5) * FH, 3, 3); } g.restore(); }
  if (lu > 0) { var nl = Math.floor(lu * 220); for (var k = 0; k < nl; k++) { var a = RDOTS[k], b = RDOTS[(k * 37 + 11) % RDOTS.length]; if (Math.abs(a.x - b.x) > .09 || Math.abs(a.y - b.y) > .16) continue;
    RS.line(FX + a.x * FW, FY + a.y * FH, FX + b.x * FW, FY + b.y * FH, { stroke: 'rgba(255,247,230,' + (fu > 0 ? .5 * (1 - fu) : .75) + ')', strokeWidth: 2.2, roughness: 1.2, seed: k + 1 }); } }
  for (var k = 0; k < nd; k++) { var d = RDOTS[k], x = FX + d.x * FW, y = FY + d.y * FH; g.fillStyle = d.c; g.beginPath(); g.arc(x, y, 8.5, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,247,230,' + (fu > .6 ? 0 : .55) + ')'; g.lineWidth = 2; g.stroke(); }
  rTex.needsUpdate = true;
}
var MAKER = B.MAKER = B.voxel({ s: 1.05, top: 0xff3f8e, bot: 0xff3f8e, skin: 0x9a6440, hair: 0x18120f }); MAKER.position.set(1.15 - 1.05, 0, .3 + .1); MAKER.rotation.y = Math.PI / 2; W.add(MAKER);
(function () { var P = MAKER.userData.P; P.legL.rotation.x = -1.3; P.legR.rotation.x = -1.3; P.legL.position.y -= .3; P.legR.position.y -= .3; P.torso.position.y -= .33; P.armL.position.y -= .33; P.armR.position.y -= .33; P.head.position.y -= .33; P.armR.rotation.x = -1.0; P.armL.rotation.x = -.6; P.head.rotation.x = .5; })();
var rangRC = V(1.15, 0, .3);
function rrPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(2.35, 1.5, u), lerp(3.6, 3.1, u), lerp(3.3, 1.8, u)), q: V(1.15, 0, .2), fov: 34, band: rangRC, wid: .13, amp: 28 }; }
var rrState = function (t) { var tb = WS('g12b', 'बिंदियों|बिंदि'), tj = WS('g13', 'जोड़|जोड'), tp = WS('g13', 'पूरी'); return { nd: Math.floor(clamp((t - (WS('g12', 'कम') - .1)) / Math.max(1.5, tb - WS('g12', 'कम') + .8)) * RDOTS.length), lu: clamp((t - tj + .8) / 2.4), fu: clamp((t - tp + .2) / 2.6) }; };
function rrAct(t, sc) {
  MAKER.visible = true; var st = rrState(t); drawRangoli(st.nd, st.lu, st.fu); MAKER.userData.P.armR.rotation.x = -1.0 + Math.sin(t * 5) * .12 * (st.lu > 0 && st.fu < 1 ? 1 : 0);
  var tj = WS('g13', 'एआई|फिर');
  kick.textContent = 'JUGAAD 1'; show(kick, t, sc.t0 + .1);
  if (t < tj - .2) { head.innerHTML = 'Kam dhaage =<br>' + AI('bindiyan') + ' hi bindiyan'; show(head, t, sc.t0 + .2); } else { head.innerHTML = 'AI ' + RL('bindu jodkar') + '<br>poori tasveer'; show(head, t, tj - .2); }
  lab(L1, 'sirf thode dhaage', V(.6, 0, 1.25), -80, 10, t, WS('g12', 'कम') + .2, tj - .3);
  lab(L2, 'maahir rangoli wali', V(.05, .7, .4), -40, -90, t, WS('g13', 'माहिर|रंगोली'), WS('g13', 'पूरी') + .3);
  var trr = WS('g13', 'रिकंस्ट्र|रे'); if (t >= trr - .1) popCard(t, trr, 'RAY RECONSTRUCTION', 46);
  card.style.top = '1040px'; card.style.left = '440px';
}

// ================= 7. DLSS SUPER RESOLUTION (g14, g15) — the hoarding painter =================
var POSTER = null, SMALL = null;
B.initPoster = function () {
  POSTER = B.gameShot(3.0, 600, 840, [-14, 3.0, 5.5, 4, 3.2, -6, 62]);
  var s = document.createElement('canvas'); s.width = 150; s.height = 210; s.getContext('2d').drawImage(POSTER, 0, 0, 150, 210); SMALL = s;
  var g = B.smallTex.userData.g, c = B.smallTex.userData.c; c.width = 150; c.height = 210; g.imageSmoothingEnabled = false; g.drawImage(SMALL, 0, 0); B.smallTex.needsUpdate = true;
};
function drawPoster(sk, pu) { // sk: sketch grid strength, pu: painted share (left -> right, top -> bottom sweeps)
  var g = B.posterTex.userData.g, w = 600, h = 840; g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h);
  g.globalAlpha = .7 * sk; g.imageSmoothingEnabled = false; g.drawImage(SMALL, 0, 0, w, h); g.globalAlpha = 1; g.imageSmoothingEnabled = true;
  g.strokeStyle = 'rgba(40,40,60,' + .5 * sk + ')'; g.lineWidth = 2; for (var x = 0; x <= w; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (var y = 0; y <= h; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  if (pu > 0) { var rows = 4, rh = h / rows; for (var r = 0; r < rows; r++) { var k = clamp(pu * rows - r); if (k <= 0) continue; g.save(); g.beginPath(); g.rect(0, r * rh, w * eio(k), rh + 1); g.clip(); g.drawImage(POSTER, 0, 0, w, h); g.restore(); } }
  B.posterTex.needsUpdate = true;
}
function srPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(3.6, 3.2, u), lerp(2.9, 2.8, u), lerp(-12.8, -12.4, u)), q: V(-5.4, 2.5, -11.6), fov: 42, band: V(-5.4, 2.5, -11.6), wid: .2, amp: 20 }; }
function srAct(t, sc) {
  var ts = WS('g14', 'छोटी'), tc4 = WS('g14', 'चार|सिर्फ़|सिर्फ'), tb = WS('g14', 'बड़ा|बडा'), tp = WS('g15', 'पेंटर'), tdl = WS('g15b', 'डीएलएसएस|डी|DLSS');
  var pu = clamp((t - tb + .2) / Math.max(3, tdl - tb + .6)); drawPoster(clamp((t - ts) / .5), pu);
  // painter climbs along the scaffold following the sweep
  var rows = 4, r = Math.min(3, Math.floor(pu * rows)), k = clamp(pu * rows - r), PW = B.HD_PW, PH = B.HD_PH, PY = B.HD_PY;
  var px = -PW / 2 + .2 + eio(k) * (PW - .4), py = PY + PH / 2 - (r + .5) * PH / rows;
  var plank = [.75, 2.05, 3.35].reduce(function (a, b) { return Math.abs(b + .1 - (py - .9)) < Math.abs(a + .1 - (py - .9)) ? b : a; });
  B.PAINTER.visible = true; B.PAINTER.position.set(px, plank + .08, .62); B.PAINTER.userData.P.armR.rotation.set(-2.3 + Math.sin(t * 9) * .25 * (pu > 0 && pu < 1 ? 1 : 0), 0, 0);
  kick.textContent = 'JUGAAD 2'; show(kick, t, sc.t0 + .1);
  if (t < tb - .2) { head.innerHTML = 'Tasveer chhoti:<br>' + RL('4 mein se 1') + ' pixel'; show(head, t, sc.t0 + .2); } else { head.innerHTML = 'AI use banata hai<br>' + AI('bada + saaf'); show(head, t, tb - .2); }
  lab(L1, 'chhoti photo', V(-4.47, 1.6, -10.6), -60, -90, t, ts + .2);
  lab(L2, 'bada poster', V(-5.4, 4.6, -11.6), -100, -60, t, tp);
  if (t >= tdl - .1) popCard(t, tdl, 'DLSS', 64); card.style.top = '1040px'; card.style.left = '470px';
  if (t >= tdl) { sub.textContent = 'DLSS Super Resolution · NVIDIA'; sub.style.top = '500px'; show(sub, t, tdl + .3); }
}

// ================= 8. FRAME GENERATION (g16, g17) — flip-book in the corner of a copy =================
var fbC = V(-.38, .46, 2.25);
function fgPose(t, sc) { var u = eio((t - sc.t0) / (sc.t1 - sc.t0)); return { p: V(lerp(-.05, .05, u), lerp(1.25, 1.05, u), lerp(2.95, 2.75, u)), q: fbC.clone().add(V(0, 0, -.02)), fov: 36, band: fbC, wid: .1, amp: 30 }; }
function fgAct(t, sc) {
  var tr = WS('g16', 'कार्ड'), tai = WS('g16', 'बीच'), tfg = WS('g17', 'फ़्रेम|फ्रेम|जनरेशन');
  // flip speed: slow page-by-page while explained, then a fast riffle
  var f = t < tr ? 0 : t < tai ? eio((t - tr) / (tai - tr)) * 1 : 1 + (t - tai) * 2.2; f = f % 8.9;
  B.FLIP.visible = true; B.flipAt(f);
  kick.textContent = 'JUGAAD 3'; show(kick, t, sc.t0 + .1);
  if (t < tai - .2) { head.innerHTML = 'Copy ke kone ki<br>' + RL('flip-book'); show(head, t, sc.t0 + .2); } else { head.innerHTML = '1 ' + RL('asli') + ' page,<br>3 ' + AI('AI') + ' ke pages'; show(head, t, tai - .2); }
  lab(L1, 'asli', fbC.clone().add(V(-.18, .02, -.1)), -60, -40, t, tr, tai + 1.6);
  lab(L2, 'AI ke 3 page', fbC.clone().add(V(.1, .02, .12)), 0, 60, t, tai + .3);
  if (t >= tfg - .1) popCard(t, tfg, 'FRAME GENERATION', 48); card.style.top = '1040px'; card.style.left = '440px';
}

// ================= 9. MATH (g18, g19) — back to the phone: 1/4 x 1/4 = 1/16 =================
function mathPose(t, sc) { return phonePose(t, .14); }
function mathAct(t, sc) {
  gameOnPhone(t, 0, 0);
  var tp = WS('g18', 'पिक्सल'), tt = WS('g18', 'तस्वीर'), t16 = WS('g18', 'बटा|बता|सोलह|सोला'), tn = WS('g19', 'एनवीडिया|इसीलिए');
  gridAt(function (r, c) { var a = (t - tp) / .25, b = (t - tt - r * .08) / .25; return c > 0 ? a : (r > 0 ? Math.max(a, b) : a); }, function (r, c) { return c === 0 && (r === 0 || t < tt); });
  kick.textContent = 'AB JODO'; show(kick, t, sc.t0 + .1);
  if (t < t16 - .2) { head.innerHTML = (t < tt - .1 ? RL('4 mein 1') + ' pixel' : RL('4 mein 1') + ' pixel<br>× ' + RL('4 mein 1') + ' tasveer'); show(head, t, sc.t0 + .2); }
  else { head.innerHTML = '¼ × ¼ = ' + AI('1 / 16'); show(head, t, t16 - .2); }
  lab(L1, 'pixel →', V(0, 0, 0).copy(B.PHONE.localToWorld(V(-.02, .052, 0))), -60, -70, t, tp, t16 - .2);
  lab(L2, '↓ tasveer', B.PHONE.localToWorld(V(-.11, .0, 0)), -40, -20, t, tt, t16 - .2);
  if (t >= tn - .2) { sub.textContent = 'NVIDIA ka daawa · DLSS Performance + 4× Frame Generation, 4K'; sub.style.top = '520px'; show(sub, t, tn - .2); }
}

// ================= 10. CATCH (g20, g21, g22) — lag, then console vs PC =================
var tTable = function () { return WS('g21', 'जीटीए|और') - .3; };
function catchPose(t, sc) {
  if (t < tTable()) return phonePose(t, .14);
  var u = eio((t - tTable()) / 1.2), tg = V(.9, 1.05, 3.6);
  return { p: V(lerp(1.4, 1.2, u), lerp(2.3, 2.1, u), lerp(7.4, 7.1, u)), q: tg.clone().add(V(0, .25, 0)), fov: 40, band: tg, wid: .13, amp: 26 };
}
function catchAct(t, sc) {
  var tb = WS('g20', 'बटन'), tl = WS('g20', 'लैग|लेग'), tps = WS('g21', 'पीएस|प्ले'), td = WS('g21', 'डीएलएसएस|डी'), tr = WS('g22', 'रॉकस्टार|रॉक');
  kick.textContent = 'PAR EK PENCH'; show(kick, t, sc.t0 + .1);
  if (t < tTable()) {
    // the button is pressed, the pre-drawn AI pages keep going: the car turns late
    B.gameLane = 2.0 * eio((t - (tb + .45)) / .5); gameOnPhone(t, 0, 0); gridAt(function () { return 0; });
    head.innerHTML = 'AI ke pages button<br>' + AI('nahi sunte'); show(head, t, sc.t0 + .2);
    if (t > tb) { chip.textContent = t < tb + .45 ? '● BUTTON DABAYA' : 'LAG +'; chip.style.background = t < tb + .45 ? C.real : C.ai; chip.style.color = t < tb + .45 ? '#1b1d3a' : '#fff7e6'; place(chip, 156, 540); show(chip, t, tb, .15); }
  } else {
    B.TABLE.visible = true; B.KID.visible = false;
    if (t < tr - .2) { head.innerHTML = 'GTA 6: ' + RL('console') + '<br>DLSS: ' + AI('NVIDIA PC'); show(head, t, tTable() + .1); }
    else { head.innerHTML = 'Rockstar:<br>' + RL('confirm nahi'); show(head, t, tr - .2); }
    lab(L1, 'GTA 6 yahan', V(.48, 1.3, 3.6), -160, -150, t, tps);
    lab(L2, 'DLSS yahan', V(1.32, 1.35, 3.6), -40, -70, t, td);
    if (t >= tr) { sub.textContent = 'GTA 6: PS5 + Xbox Series X|S · 19 Nov 2026 · PC date nahi'; sub.style.top = '520px'; show(sub, t, tr + .2); }
  }
}

// ================= 11. CTA (g23) =================
function ctaPose(t, sc) { var u = eio((t - sc.t0) / 3.5); return { p: V(lerp(2.0, .6, u), lerp(2.6, 9.5, u), lerp(6.6, 8.6, u)), q: V(0, .2, lerp(2.0, -3.0, u)), fov: lerp(36, 42, u), band: V(0, 0, lerp(2, -2, u)), wid: .22, amp: 18 }; }
function ctaAct(t, sc) {
  var tl = WS('g23', 'लाइक'), ts = WS('g23', 'शेयर|शेर'), tsu = WS('g23', 'सब्स'), tn = WS('g23', 'नर्ड|लॉजिक');
  endc.style.opacity = clamp((t - (sc.t0 + .3)) / .5); B.TS.fade = Math.max(B.TS.fade, .45 * clamp((t - sc.t0 - .3) / .5));
  [tl, ts, tsu].forEach(function (x, i) { var u = clamp((t - x) / .3); BTN[i].style.opacity = u; BTN[i].style.transform = 'scale(' + (u > 0 ? eob(u) : .5) + ')'; });
  var pulse = 1 + .04 * Math.max(0, Math.sin((t - tn) * 6)) * (t > tn ? 1 : 0); endc.querySelector('img').parentNode.style.transform = 'scale(' + pulse + ')';
}

// ---------- scene list + boundaries ----------
var SC = B.SCN = [
  { g: ['g1', 'g2'], pose: hookPose, act: hookAct },
  { g: ['g3', 'g4', 'g5'], pose: pixPose, act: pixAct, tr: 'fly' },
  { g: ['g6', 'g7'], pose: lightPose, act: lightAct, tr: 'dip' },
  { g: ['g8', 'g9'], pose: rtPose, act: rtAct, tr: 'fly' },
  { g: ['g10', 'g11'], pose: costPose, act: costAct, tr: 'fly' },
  { g: ['g12', 'g12b', 'g13'], pose: rrPose, act: rrAct, tr: 'fly' },
  { g: ['g14', 'g15', 'g15b'], pose: srPose, act: srAct, tr: 'fly' },
  { g: ['g16', 'g17'], pose: fgPose, act: fgAct, tr: 'fly' },
  { g: ['g18', 'g19'], pose: mathPose, act: mathAct, tr: 'dip' },
  { g: ['g20', 'g21', 'g22'], pose: catchPose, act: catchAct, tr: 'none' },
  { g: ['g23'], pose: ctaPose, act: ctaAct, tr: 'fly' }
];
SC.forEach(function (s, i) { var a = GR(s.g[0]); s.t0 = i === 0 ? 0 : (GR(SC[i - 1].g[SC[i - 1].g.length - 1]).end + a.start) / 2; });
SC.forEach(function (s, i) { s.t1 = i < SC.length - 1 ? SC[i + 1].t0 : TM.end; });
B.DUR = TM.end;
// inner dip in scene 2 (jaali -> phone)
B.innerDip = function (t) { var tp = tPhone(); return Math.max(0, 1 - Math.abs(t - tp) / .3); };
B.sceneAt = function (t) { for (var i = SC.length - 1; i >= 0; i--) if (t >= SC[i].t0) return i; return 0; };
B.setCap = function (t) { cap.innerHTML = CAP.html(t, TM.cap, { plain: true, hi: C.real, ink: '#f1f3f8', fs: 40 }); };
})();
