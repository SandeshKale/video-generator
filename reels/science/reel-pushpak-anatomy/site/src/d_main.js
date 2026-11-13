
// ======================= scene table =======================
var SCN = [['A', 's1', 's4'], ['B', 's5', 's14'], ['C', 's15', 's16'], ['D', 's17', 's22'], ['E', 's23', 's26'], ['F', 's27', 's29'], ['G', 's30', 's33'], ['H', 's34', 's35'], ['I', 's36', 's37']].map(function (q) { return { k: q[0], a: q[1], b: q[2] }; });
SCN.forEach(function (s, i) { s.t0 = i ? (SE(SCN[i - 1].b) + ST(s.a)) / 2 : 0; }); SCN.forEach(function (s, i) { s.t1 = i + 1 < SCN.length ? SCN[i + 1].t0 : DUR; });
window.SCN_T0 = function () { return SCN.map(function (s) { return s.t0; }).concat([DUR]); };
var CUT = { B: 1, D: 1, E: 1, F: 1, G: 1, H: 1, I: 1 };          // scenes entered with a short dip (C continues B's set)
function sceneAt(t) { for (var i = SCN.length - 1; i >= 0; i--) if (t >= SCN[i].t0) return i; return 0; }
var ORDER = ['engine', 'lotus', 'stairs', 'deck', 'pillars', 'crystal', 'frame', 'peaks'];
function explodeAt(t, tA, tClose) { var tot = 0; ORDER.forEach(function (n, k) { var o = eob((t - tA - k * .2) / 1.4, 1.1), c = tClose == null ? 0 : eio((t - tClose - (ORDER.length - 1 - k) * .08) / 1.2), e = Math.max(0, o * (1 - c));
    L[n].position.y = ASM[n] + (EXP[n] - ASM[n]) * e; if (n === 'lotus') L.petals.forEach(function (q) { var cc = q.ri ? 2.95 : 2.85, oo = q.ri ? 1.62 : 1.32; q.m.rotation.x = cc + (oo - cc) * clamp(e * 1.4); }); tot += e; }); return tot / ORDER.length; }
function eob(x, k) { x = clamp(x); k = k || 1.4; return 1 + (k + 1) * Math.pow(x - 1, 3) + k * Math.pow(x - 1, 2); }
// pre-solved camera poses for the teardown (assembled close-up, exploded wide, crystal macro, engine)
var PB = {};
(function () { var P0 = P.position.clone(); P.position.copy(OB).add(new T.Vector3(0, -2.15, 0)); P.rotation.y = .5; cam.fov = 26; cam.updateProjectionMatrix();
  function fit(e, yTop, yBot, a, b, dir) { explodeAt(e ? 99 : -99, 0); P.updateMatrixWorld(true); var top = new T.Vector3(0, ASM.peaks + e * (EXP.peaks - ASM.peaks) + 2.75, 0), bot = new T.Vector3(0, e ? EXP.engine - .5 : -1.3, 0); P.localToWorld(top); P.localToWorld(bot);
    fitV(OB.clone().add(new T.Vector3(0, 1.5, 0)), (dir || new T.Vector3(0, .2, 1)).normalize(), top, bot, a, b); return poseOf(); }
  PB.close0 = fit(0, 0, 0, 470, 1240, new T.Vector3(.5, .55, 1)); PB.close = fit(0, 0, 0, 520, 1200, new T.Vector3(.15, .25, 1)); PB.wide = fit(1, 0, 0, 470, 1240);
  explodeAt(99, 0); P.updateMatrixWorld(true);
  var w = PB.wide, WP = V(w.p), WQ = V(w.q), Q0 = new T.Vector3(); P.updateMatrixWorld(true);
  function focus(ly, dolly, side) { var f = new T.Vector3(0, ly, 0); P.localToWorld(f); var dir = WP.clone().sub(f).normalize(), dist = WP.distanceTo(f) * (1 - dolly), p = f.clone().addScaledVector(dir, dist); if (side) p.x += side; return { p: p.toArray(), q: f.toArray(), fov: 26 }; }
  PB.top = focus(EXP.peaks + 1.0, .38); PB.low = focus(EXP.deck + .4, .38); PB.macro = focus(EXP.crystal + .55, .62, 1.0); PB.engine = focus(EXP.engine + .5, .5);
  P.position.copy(P0); })();

// ======================= the render contract =======================
window.__reelDurationSec = DUR; window.__ready = false;
var capEl = document.getElementById('cap'), CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
window.__seek = function (t) {
  var si = sceneAt(t), sc = SCN[si], k = sc.k; hideAll(); STACK = { L: 430, R: 430 }; SHAKE = 0; var fade = 0;
  [gA, gB, gD, gE, gF, gG, gH].forEach(function (g) { g.visible = false; }); P.visible = false; RINGS.forEach(function (r) { r.visible = false; }); CAR.visible = false; STAMP.visible = true; AIR.visible = false; balloon.visible = true; DIYA.parent && DIYA.parent.remove(DIYA); lampD.parent && lampD.parent.remove(lampD);
  if (CUT[k]) fade = Math.max(fade, 1 - clamp((t - sc.t0) / .32)); if (si + 1 < SCN.length && CUT[SCN[si + 1].k]) fade = Math.max(fade, 1 - clamp((sc.t1 - t) / .28));
  SC_FN[k](t, sc);
  window.__STARS.position.copy(cam.position); bg.position.copy(cam.position);
  capEl.innerHTML = CAP.html(t, CAPW, { plain: true, hi: '#e8b04a', ink: '#f1f3f8', fs: 40, width: 756 });
  mGrade.uniforms.fade.value = fade; mGrade.uniforms.shake.value.set(SHAKE * Math.sin(t * 91) * .004, SHAKE * Math.cos(t * 77) * .003);
  if (!window.__skipRender) render(t);
};

var SC_FN = {
  // ---------- A: the hook ----------
  A: function (t) {
    gA.visible = true; keyAt(OA); key.intensity = .6; S.environmentIntensity = .4; bg.visible = false;
    var t1 = ST('s1'), nIn = 12;    // 12 sheets already down at frame 0, the rest drop in during s1
    SHEETS.forEach(function (m, i0) { var i = (i0 * 17) % 50, d = m.userData, tin = i < nIn ? -1 : t1 + (i - nIn) / (50 - nIn) * 2.3, u = eio((t - tin) / .45); m.visible = u > 0; m.position.set(d.x, d.y + (1 - u) * 1.6, d.z); m.rotation.set(-Math.PI / 2, 0, d.rz + (1 - u) * .6); });
    shots(t, [{ p: [0, 14.0, 6.0], q: [0, 0, -.4], fov: 30 }, { t: t1 + .2, d: 2.6, p: [0, 16.4, 7.4], q: [0, 0, -.6], fov: 30 }, { t: ST('s4') - .2, d: 2.2, p: [0, 15.4, 6.6], q: [0, 0, -.8], fov: 30 }]);
    var nShown = Math.min(50, Math.max(nIn, Math.floor(nIn + clamp((t - t1) / 2.3) * (50 - nIn) + .5)));
    headline(t, -1, 'RAMAYANA · PART 1 · 5 NOV 2026', 'Pushpak ke <b>' + (t < t1 + 2.2 ? nShown : '40-50') + '</b> design');
    show('c2', 'tag', '<small>SIRF DESIGN</small><span style="font:800 56px Syne;color:#1a1530">2 saal</span>', t, CUE('s2', 'दो') - .1, 'left:162px;top:1000px');
    show('c65', 'tag', '<small>RAVAN-JATAYU SCENE</small><span style="font:800 56px Syne;color:#b43a1e">6.5 saal</span>', t, CUE('s3', 'साढ़े') - .1, 'left:480px;top:1000px');
    show('q', 'tag q', '<small>NITESH TIWARI, DIRECTOR</small>"We wanted some kind of<br>science to go into it."', t, CUE('s4', 'हम') - .2, 'left:162px;top:1150px;background:rgba(7,16,46,.85)');
    show('srcA', 'src', 'Shreyas Media interview, via India.com (1 Nov 2026) · sheets are our sketches', t, CUE('s4', 'हम'), 'top:1286px');
  },
  // ---------- B: the teardown ----------
  B: function (t, sc) {
    gB.visible = true; P.visible = true; keyAt(OB); key.intensity = 2.6; S.environmentIntensity = 1; bg.visible = true;
    P.position.copy(OB).add(new T.Vector3(0, -2.15, 0)); floorB.position.y = -2.15 + EXP.engine - 1.05 - OB.y; P.scale.setScalar(1);
    var tEx = CUE('s6', 'खोलकर') - .15, e = explodeAt(t, tEx);
    P.rotation.y = .5 + .06 * Math.sin((t - sc.t0) * .35);    // a breath of life on the turntable, not a camera drift
    L.engine.children[0].material.opacity = .9 * clamp((t - CUE('s14', 'इंजन') + .2) / .6);
    shots(t, [PB.close0, { t: ST('s5') - .1, d: 2.4, p: PB.close.p, q: PB.close.q, fov: 26 }, { t: tEx - .1, d: 2.6, p: PB.wide.p, q: PB.wide.q, fov: 26 },
      { t: ST('s7') - .2, d: 1.4, p: PB.top.p, q: PB.top.q, fov: 26 }, { t: ST('s9'), d: 3.4, p: PB.low.p, q: PB.low.q, fov: 26 },
      { t: CUE('s12', 'खिड़कियाँ') - .3, d: 1.9, p: PB.macro.p, q: PB.macro.q, fov: 26 }, { t: ST('s14') - .1, d: 2.0, p: PB.engine.p, q: PB.engine.q, fov: 26 }]);
    var macro = t > CUE('s12', 'खिड़कियाँ') + .4 && t < ST('s14') + .3;
    headline(t, sc.t0, 'OUR 3D · BUILT FROM VALMIKI\'S WORDS', 'Pushpak, <b>part by part</b>', macro ? CUE('s12', 'खिड़कियाँ') + .2 : ST('s14') - .3);
    function tag(id, layer, lp, side, idx, verse, txt, tIn, tOut, cls, col) { var p = new T.Vector3(lp[0], lp[1], lp[2]); L[layer].localToWorld(p);
      return tagAt(id, '<small><b style="color:' + (col || '#c2780e') + '">' + idx + '</b> · ' + verse + '</small>' + txt, t, tIn, p, side, cls, tOut, col === '#3fd0c9' || col === '#e8b04a' ? col : null); }
    P.updateMatrixWorld(true);
    var tm0 = CUE('s12', 'खिड़कियाँ') + .1, tm1 = ST('s14') - .1;
    var eng = t > ST('s14') - .2;
    if (!macro) {
      if (!eng) {
      tag('t1', 'peaks', [1.3, 1.3, .6], 'R', '01', '5.8.5', 'Pahaad jaisa,<br>kai shikhar', CUE('s7', 'पहाड़') - .1);
      tag('t2', 'frame', [1.8, .05, .8], 'R', '02', '5.8.1 · 6.124', 'Sona, heere,<br>ghantiyaan', CUE('s8', 'सोना') - .1);
      tag('t4', 'pillars', [-1.6, .6, .8], 'L', '03', '5.9.13', 'Bhediyon ki<br>nakkaashi', CUE('s9', 'भेड़ि') - .1);
      tag('t5', 'stairs', [-1.6, -.25, 1.2], 'L', '04', '5.9.15', 'Sone ki<br>seedhiyaan', CUE('s10', 'सीढ़') - .1);
      tag('t6', 'deck', [1.6, -.05, .8], 'R', '05', '5.9.17 · 6.123.1', 'Moonge ka farsh,<br>hans ke chitra', CUE('s11', 'मूँग') - .1);
      }
      if (eng) { tag('t7', 'lotus', [-2.0, -.45, .6], 'L', '06', 'OUR TOUCH · NOT IN VERSE', 'Kamal-peeth', ST('s14'), null, 'tag q', '#e8b04a');
        tag('t8', 'engine', [1.1, 0, 0], 'R', '07', 'ENGINE?', 'Text mein nahi', CUE('s14', 'इंजन') - .05, null, 'tag q', '#3fd0c9'); }
    } else {
      tag('t3', 'crystal', [1.3, .45, .9], 'R', '06', '5.9.16', 'Crystal khidkiyaan', CUE('s12', 'क्रिस्टल') - .1);
      tag('t3b', 'crystal', [-1.3, .85, .9], 'L', '06', '5.9.16', 'Hawa ke chhed<br>(ventilation)', CUE('s12', 'हवा') - .1);
      show('kickM', 'kick', '<i></i>CLOSE-UP · 5.9.16', t, tm0 + .2, '');
      // air streaks through the vent holes
      AIR.visible = true; var vp = new T.Vector3(); for (var i = 0; i < NA; i++) { var ph = ((t - tm0) * .55 + hsh(i)) % 1, v = i % 8, a2 = v / 8 * 6.283 + Math.PI / 8, vh = (i >> 3) % 4;
        vp.set(Math.cos(a2) * 1.62 + Math.cos(a2) * (ph - .3) * 1.4, .82 + (hsh(i + 9) - .5) * .05, Math.sin(a2) * 1.62 + Math.sin(a2) * (ph - .3) * 1.4); var lx = -.33 + vh * .22; vp.x += -Math.sin(a2) * lx; vp.z += Math.cos(a2) * lx;
        L.crystal.localToWorld(vp); airP[i * 3] = vp.x; airP[i * 3 + 1] = vp.y; airP[i * 3 + 2] = vp.z; } airG.attributes.position.needsUpdate = true; AIR.material.opacity = clamp((t - CUE('s13', 'वेंटि') + .3) / .4) * .9;
    }
    show('srcB', 'src', 'Valmiki Ramayana 5.8-5.9, 6.123-124 · our model, not the film\'s design', t, sc.t0 + .4, 'top:1286px');
  },
  // ---------- C: moved by thought, carried by sky-roamers ----------
  C: function (t, sc) {
    gB.visible = true; P.visible = true; keyAt(OB); key.intensity = 2.6; S.environmentIntensity = 1; bg.visible = true;
    explodeAt(t, -99, sc.t0 - .1); var lift = eio((t - ST('s15') - 1.0) / 3.5) * 1.3; P.position.copy(OB).add(new T.Vector3(0, -2.15 + lift, 0)); P.rotation.y = .5 + (t - sc.t0) * .07;
    shots(t, [PB.engine, { t: sc.t0, d: 2.0, p: PB.close.p, q: PB.close.q, fov: 26 }, { t: ST('s16') - .2, d: 2.6, p: [PB.close.p[0], PB.close.p[1] - 2.2, PB.close.p[2] + 2.0], q: [PB.close.q[0], PB.close.q[1] - .6, PB.close.q[2]], fov: 28 }]);
    var tr = CUE('s15', 'मन'); RINGS.forEach(function (r, i) { var ph = ((t - tr) / 2.0 + i / 3) % 1; r.visible = t > tr; r.position.set(0, lift + 1.2 + ph * .6, 0); r.scale.setScalar(.5 + ph * 1.5); r.material.opacity = (1 - ph) * .8 * clamp((t - tr) / .4); });
    var tc = CUE('s16', 'राक्षस') - .4; CAR.visible = t > tc; for (var i = 0; i < NC; i++) { var a = hsh(i) * 6.283 + (t - tc) * (.5 + hsh(i + 3) * .5), r = 1.2 + hsh(i + 5) * 2.0, y = lift - 2.6 + hsh(i + 7) * 1.6 + Math.sin(t * 2 + i) * .06;
      carP[i * 3] = Math.cos(a) * r; carP[i * 3 + 1] = y; carP[i * 3 + 2] = Math.sin(a) * r; } carG.attributes.position.needsUpdate = true; CAR.material.opacity = clamp((t - tc) / .8) * .95;
    headline(t, sc.t0, 'HOW DOES IT MOVE? · VALMIKI', 'Soch se <b>chalta hai</b>');
    P.updateMatrixWorld(true); var pt = new T.Vector3(1.0, 4.4, 0); P.localToWorld(pt);
    tagAt('m1', '<small>5.8.4</small>Mann ke vichaar se', t, CUE('s15', 'मन') - .1, pt, 'R');
    tagAt('m2', '<small>6.124</small>Soch jitna tez', t, CUE('s15', 'सोच') - .1, pt, 'R');
    var pc = new T.Vector3(-1.6, -1.2, .6); P.localToWorld(pc); tagAt('m3', '<small>5.8.6</small>Rakshas aur bhootgan<br>uthaate hain', t, CUE('s16', 'राक्षस') - .1, pc, 'L', 'tag q', null, '#3fd0c9');
  },
  // ---------- D: the film's hot-air dome, tested ----------
  D: function (t, sc) {
    gD.visible = true; keyAt(OD); key.intensity = 2.2; S.environmentIntensity = .9; bg.visible = true;
    var tS = sc.t0 + .15, tB = tS + 2.35, tH = CUE('s20', 'गरम') - .1, tC = CUE('s20', 'ठंडी') - .1, tU = CUE('s20', 'ऊपर') - .1, tG = CUE('s21', 'सोना') - .3, tN = CUE('s22', 'पच्चीस') - .6;
    var inf = eio((t - tB) / 1.6), rise = eio((t - tU) / 1.6) * .6; balloon.scale.set(.25 + .75 * inf, .2 + .8 * inf, .25 + .75 * inf); balloon.position.y = rise; balloon.visible = t > tB;
    balloon.userData.flame.scale.setScalar(.8 + .25 * Math.sin(t * 23) * Math.sin(t * 7)); HOT.visible = t > tH; HOT.material.opacity = clamp((t - tH) / .5); HOT.position.y = rise + Math.sin(t * 1.3) * .05;
    COLD.visible = t > tC; COLD.material.opacity = clamp((t - tC) / .5) * .9; LIFT.visible = t > tU; LIFT.position.y = 2.9 + rise;
    var drop = eob((t - tG) / .7, 0); CUBE.visible = t > tG; CUBE.position.set(3.2, -1.25 + (1 - drop) * 5, 0); CUBE.rotation.y = .4;
    MINI.forEach(function (b, i) { var ti = tN + i * .085, u = eob((t - ti) / .45, 1.6); b.visible = u > 0; var r = i % 5, c = (i / 5) | 0; b.position.set(4.4 + r * .7, -.6 + c * .9 + Math.sin(t * 1.4 + i) * .04, -1.2); b.scale.setScalar(.2 * u); });
    shots(t, [{ p: [OD.x, .7, 20.5], q: [OD.x, .5, 0], fov: 28 }, { t: tG - .4, d: 2.2, p: [OD.x + 5.3, 1.0, 23], q: [OD.x + 5.3, .6, 0], fov: 28 }]);
    // film still (credited), at most 2.5 s on screen
    var stillOn = t > tS && t < tS + 2.5;
    headline(t, sc.t0, 'FILM KA JAWAAB · PER REVIEWS', 'Gumbad: <b>hot-air balloon</b>');
    show('still', '', '<img src="img/film-pushpak.jpg" style="width:756px;height:425px;object-fit:cover;display:block;border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.6)">', t, tS, 'position:absolute;left:162px;top:470px', tS + 2.2);
    show('stillC', 'label', '© Prime Focus / Sony Pictures · VFX DNEG · via TMDB', t, tS, 'left:162px;top:904px;color:#c9b8ff;font-size:17px', tS + 2.2);
    show('stillQ', 'tag', '<small>THEPRINT, 2 APR 2026 (TEASER)</small>"lotus-cum-hot air balloon"', t, tS + .4, 'left:162px;top:940px;background:#ff6a4a;color:#1a0a06', tS + 2.2);
    if (!stillOn) {
      show('d1', 'tag', '<small>100°C ANDAR</small><span style="font:800 34px Syne">0.95 kg/m³</span>', t, tH, 'left:162px;top:520px', tG - .2);
      show('d2', 'tag', '<small>15°C BAAHAR</small><span style="font:800 34px Syne">1.23 kg/m³</span>', t, tC, 'left:630px;top:520px;background:#cfe8ff', tG - .2);
      show('d3', 'tag q', '<small>LIFT · HAR m³</small><span style="font:800 34px Syne;color:#3fd0c9">0.28 kg</span>', t, tU, 'left:690px;top:700px;background:rgba(7,16,46,.85)', tG - .2);
      show('d4', 'tag', '<small>1 m³ SONA</small><span style="font:800 46px Syne">19.3 tonne</span>', t, CUE('s21', 'उन्नीस') - .1, 'left:162px;top:520px;background:#e8b04a');
      var n = Math.max(0, Math.min(25, Math.ceil((t - tN) / .085)));
      show('d5', 'tag q', '<small>PASSENGER BALLOONS</small><span style="font:800 46px Syne;color:#3fd0c9">× ' + n + '</span>', t, tN, 'left:600px;top:520px;background:rgba(7,16,46,.85)');
      show('d6', 'tag', '<small>OUR CALC · ENVELOPE, FUEL IGNORED</small><span style="font:800 34px Syne">≈ 69,000 m³ garam hawa</span>', t, CUE('s22', 'गरम') - .1, 'left:162px;top:1130px;background:#e8b04a');
    }
    show('srcD', 'src', 'Air density: ideal gas, sea level · gold 19.3 g/cm³', t, tH, 'top:1286px', stillOn ? -1 : null);
  },
  // ---------- E: the 1918 "manual" ----------
  E: function (t, sc) {
    gE.visible = true; keyAt(OE); key.intensity = .5; S.environmentIntensity = .45; bg.visible = false; lampE.target.position.set(0, 0, 0);
    var tR = CUE('s24', 'उन्नीस') - .2, tY = CUE('s24', 'अठारह'), t74 = CUE('s25', 'उन्नीस') - .2, tSt = CUE('s26', 'फ़ैसला') + .25;
    drawRuler(eio((t - tR) / 1.2), eio((t - tY) / .5), eio((t - t74) / 1.2));
    var slide = eio((t - sc.t0) / 1.0); sheetE.position.set(0, 0, (1 - slide) * 6);
    var up = cam.up; up.set(0, 0, -1); var hgt = SH / 2 / Math.tan(10 * Math.PI / 180);
    shots(t, [{ p: [OE.x, hgt * 1.12, OE.z + .6], q: [OE.x, 0, OE.z + .6], fov: 20 }, { t: sc.t0 + .2, d: 2.2, p: [OE.x, hgt, OE.z], q: [OE.x, 0, OE.z], fov: 20 }]);
    var u = eob((t - tSt) / .45, 0), sp = S2W(735, 690, 0); STAMP.visible = t > tSt - .05; STAMP.position.set(sp.x, .15 + (1 - u) * 6, sp.z); STAMP.rotation.set(0, .3, 0); IMP.visible = t > tSt + .4; IMP.material.opacity = clamp((t - tSt - .4) / .15);
    if (t > tSt + .4) { var up2 = eio((t - tSt - .5) / .6); STAMP.position.y = .15 + up2 * 2.2; STAMP.position.x = sp.x + up2 * 1.4; }
    SHAKE = Math.max(0, 1 - Math.abs(t - tSt - .42) / .22);
    headline(t, sc.t0, '"PRACHIN VIMAAN SHASTRA"?', 'Ye kitaab <b>1918</b> ki hai');
    show('e1', 'tag q', '<small>1974 · IISc, BENGALURU</small>5 vaigyanik, 4 vimaan', t, t74 + .5, 'left:600px;top:1176px;background:rgba(7,16,46,.85)', tSt - .1);
    show('e2', 'tag q', '<small>THIS IS CALLED</small><span style="font:800 40px Syne;color:#f4ecd8">MYTH</span>', t, CUE('s26', 'उड़'), 'left:162px;top:1176px;background:rgba(7,16,46,.85);border-color:#ff6a4a');
    show('srcE', 'src', 'Vaimanika Shastra: dictated 1918-23, public 1952 · Mukunda et al., IISc, Scientific Opinion, 1974', t, tR, 'top:1286px');
  },
  // ---------- F: film vs Valmiki ----------
  F: function (t, sc) {
    gF.visible = true; keyAt(OF); key.intensity = 2.4; S.environmentIntensity = .7; bg.visible = true; cam.up.set(0, 1, 0);
    var tFilm = CUE('s27', 'फ़िल्म') - .2, tR = ST('s29') - .1, tK = CUE('s29', 'तोड़') - .05;
    charG.visible = t > tR; var inC = eob((t - tR) / .7, 1.2); charG.scale.setScalar(Math.max(.001, inC));
    CHAR.forEach(function (m, i) { var h = m.userData.h, u = clamp((t - tK) / 1.4), dir = new T.Vector3(h.p.x + hsh(i) - .5, .6 + hsh(i + 3), h.p.z + hsh(i + 5) - .5).normalize();
      if (u <= 0) { m.position.copy(h.p); m.rotation.copy(h.r); return; } var d = u * 3.2; m.position.set(h.p.x + dir.x * d, Math.max(.15, h.p.y + dir.y * d * 1.4 - 4.9 * u * u * 1.4), h.p.z + dir.z * d); m.rotation.set(h.r.x + u * (hsh(i) * 6 - 3), h.r.y + u * 2, h.r.z + u * (hsh(i + 1) * 6 - 3)); });
    DUST.visible = t > tK; for (var i = 0; i < NDU; i++) { var u = clamp((t - tK) / 1.6), a = hsh(i) * 6.283, r = u * (1 + hsh(i + 1) * 2.5); duP[i * 3] = Math.cos(a) * r; duP[i * 3 + 1] = .2 + u * hsh(i + 2) * 1.6; duP[i * 3 + 2] = Math.sin(a) * r; } duG.attributes.position.needsUpdate = true; DUST.material.opacity = (1 - clamp((t - tK) / 1.6)) * .9;
    shots(t, [{ p: [OF.x + 8.5, 5.0, 16.5], q: [OF.x, .4, 0], fov: 30 }, { t: tR, d: 1.8, p: [OF.x + 7.2, 4.2, 14.0], q: [OF.x, .5, 0], fov: 30 }, { t: tK + .1, d: 1.2, p: [OF.x + 8.5, 5.2, 17.0], q: [OF.x, .3, 0], fov: 30 }]);
    SHAKE = Math.max(0, 1 - Math.abs(t - tK - .05) / .25) * .8;
    headline(t, sc.t0, 'FILM VS VALMIKI', 'Ek Pushpak, <b>do roop</b>');
    show('fs', '', '<img src="img/film-pushpak.jpg" style="width:520px;height:292px;object-fit:cover;display:block;border-radius:6px;box-shadow:0 10px 30px rgba(0,0,0,.6)">', t, tFilm, 'position:absolute;left:162px;top:470px', tFilm + 2.3);
    show('fsC', 'label', '© Prime Focus Studios / Sony Pictures · VFX DNEG', t, tFilm, 'left:162px;top:770px;color:#c9b8ff;font-size:17px', tFilm + 2.3);
    show('f1', 'tag', '<small>FILM</small>Sita haran: Pushpak mein', t, tFilm + .3, 'left:162px;top:810px;background:#ff6a4a;color:#1a0a06', tR - .2);
    show('f2', 'tag', '<small>FILM</small>Jatayu ladte hain usi par', t, CUE('s28', 'जटायु') - .1, 'left:162px;top:920px;background:#ff6a4a;color:#1a0a06', tR - .2);
    var cp = OF.clone().add(new T.Vector3(.4, 2.9, 0));
    tagAt('f3', '<small>VALMIKI 3.51 · OUR MODEL</small>Rath, gadhon se khincha', t, tR + .2, cp, 'R');
    tagAt('f4', '<small>3.51.15-16</small>Jatayu ne tod diya', t, tK - .1, OF.clone().add(new T.Vector3(-.4, 1.2, 0)), 'L', 'tag q', null, '#ff6a4a');
    show('srcF', 'src', 'Valmiki Ramayana, Aranya Kanda 3.51 · film per reviews (Hollywood Reporter India, 6 Nov 2026)', t, tFilm, 'top:1286px');
  },
  // ---------- G: the flight home ----------
  G: function (t, sc) {
    gG.visible = true; P.visible = true; keyAt(OG); key.intensity = 2.4; S.environmentIntensity = .9; bg.visible = true; cam.up.set(0, 1, 0);
    var tS = STOPS.map(function (s, i) { return i ? CUE('s32', s[3]) : ST('s32') - .1; });
    var uRoute = 0; for (var i = 1; i < STOPS.length; i++) { var a = tS[i - 1], b = tS[i]; if (t >= b) uRoute = STOPU[i]; else if (t > a) { uRoute = lerp(STOPU[i - 1], STOPU[i], eio((t - a) / (b - a))); break; } else break; }
    var cnt = routeM.geometry.index.count; routeM.geometry.setDrawRange(0, Math.floor(cnt * uRoute / 6) * 6); routeGl.geometry.setDrawRange(0, Math.floor(cnt * uRoute / 6) * 6); routeM.visible = routeGl.visible = uRoute > 0;
    PINS.forEach(function (p, i) { var u = eob((t - tS[i]) / .4, 1.6); p.visible = u > 0; p.scale.setScalar(Math.max(.001, u)); });
    var tip = ROUTE.getPointAt(Math.max(.001, uRoute)); explodeAt(-99, 0); P.scale.setScalar(.7); P.position.set(OG.x + tip.x, 1.2 + tip.y, tip.z); P.rotation.y = 1.1 + t * .2; P.visible = uRoute > 0;
    var top = [OG.x + .3, 70, 14], obl = [OG.x + .6, 66, 26];
    shots(t, [{ p: top, q: [OG.x + .3, 0, 2.6], fov: 30 }, { t: ST('s31') - .2, d: 2.8, p: obl, q: [OG.x + .4, 0, 3.5], fov: 30 }]);
    headline(t, sc.t0, 'YUDDHA KANDA 6.123 · THE FLIGHT HOME', 'Raasta, <b>upar se</b>', ST('s32') + 1.2);
    STOPS.forEach(function (s, i) { if (t < tS[i]) return; var p = scr(P3(s[1], s[2], .2).add(OG)), right = (s[1] < 79 || i === 1 || s[0] === 'PRAYAG') && s[0] !== 'LANKA';
      show('st' + i, 'label', s[0], t, tS[i], 'top:' + (p.y - 13) + 'px;' + (right ? 'left:' + (p.x + 26) + 'px' : 'left:' + (p.x - 26) + 'px;margin-left:-' + (s[0].length * 12.2) + 'px') + (i === 1 ? ';color:#3fd0c9' : '')); });
    var tK = ST('s33') - .2, km = Math.round(eio((t - tK) / 1.3) * 2700 / 10) * 10;
    show('km', 'tag', '<small>OUR MEASUREMENT · 2,751 km</small><span style="font:800 42px Syne">~' + km.toLocaleString('en-IN') + ' km</span>', t, tK, 'left:520px;top:760px');
    show('srcG', 'label', 'TRAD. SITES · MAP: NASA GIBS', t, tK + .4, 'left:520px;top:856px;color:#c9b8ff;font-size:17px');
  },
  // ---------- H: ISRO's Pushpak lands itself ----------
  H: function (t, sc) {
    gH.visible = true; keyAt(OH); key.position.set(OH.x - 30, 10, OH.z - 20); key.intensity = 2.8; S.environmentIntensity = .8; bg.visible = true; cam.up.set(0, 1, 0);
    var tTD = CUE('s34', 'उतरता') + .1, tt = t - tTD, z, y; RLV.scale.setScalar(1.1);
    if (tt < 0) { z = tt * 12; y = .55 + Math.pow(-tt, 1.4) * .9; } else { var v = 12, dec = 2.4, tc = Math.min(tt, v / dec); z = v * tc - .5 * dec * tc * tc; y = .55; }
    RLV.position.set(0, y, z); RLV.rotation.set(tt < 0 ? .1 : .1 * (1 - clamp(tt / .6)), 0, 0);
    var wp = RLV.position.clone().add(OH), cp = OH.clone().add(new T.Vector3(5.5, 3.0, 22));
    cam.position.copy(cp); cam.lookAt(OH.x, .5 + RLV.position.y * .5, OH.z + Math.max(-30, RLV.position.z) * .6 - 2); if (cam.fov !== 32) { cam.fov = 32; cam.updateProjectionMatrix(); } cam.updateMatrixWorld();
    headline(t, sc.t0, 'ISRO · RLV LEX-03 · 2024', 'Aaj ka <b>Pushpak</b>');
    tagAt('h1', '<small>AUTONOMOUS LANDING</small>Khud runway par utra', t, tTD - .1, RLV.position.clone().add(OH).add(new T.Vector3(0, 1.2, 0)), 'R');
    tagAt('h2', '<small>NAAM</small><span style="font:800 46px Syne">PUSHPAK</span>', t, CUE('s35', 'पुष्पक') - .15, RLV.position.clone().add(OH).add(new T.Vector3(-.4, .1, .2)), 'L');
    show('srcH', 'src', 'ISRO RLV LEX-03 (as reported) · our simple model', t, sc.t0 + .4, 'top:1286px');
  },
  // ---------- I: Part 2 + end card ----------
  I: function (t, sc) {
    gB.visible = true; P.visible = true; keyAt(OB); key.intensity = 2.0; S.environmentIntensity = .9; bg.visible = true; cam.up.set(0, 1, 0);
    explodeAt(-99, 0); P.scale.setScalar(1); P.position.copy(OB).add(new T.Vector3(0, -1.2, 0)); P.rotation.y = .5 + (t - sc.t0) * .16; floorB.position.y = -2.15 + EXP.engine - 1.05;
    S.add(DIYA); DIYA.position.copy(OB).add(new T.Vector3(1.9, -4.3, 2.4)); DIYA.scale.setScalar(.8); DIYA.userData.fl.scale.set(1 + .08 * Math.sin(t * 17), 2.1 + .2 * Math.sin(t * 11), 1); S.add(lampD); lampD.position.copy(DIYA.position).add(new T.Vector3(.3, .6, 0));
    shots(t, [{ p: [PB.close.p[0], PB.close.p[1] + .4, PB.close.p[2] + 3], q: [PB.close.q[0], PB.close.q[1] - .4, PB.close.q[2]], fov: 28 }, { t: ST('s37') - .5, d: 1.8, p: [PB.close.p[0], PB.close.p[1] + 11, PB.close.p[2] + 6], q: [PB.close.q[0], PB.close.q[1] + 13, PB.close.q[2]], fov: 28 }]);
    var tE = ST('s37') - .2;
    headline(t, sc.t0, 'RAMAYANA · PART 2', 'Diwali <b>2028</b>', tE);
    show('i1', 'tag', '<small>AS REPORTED · THE WEEK, 5 NOV 2026</small>Part 2: Diwali 2028', t, CUE('s36', 'अट्ठाईस') - .2, 'left:162px;top:1110px', tE);
    var a = function (w) { return CUE('s37', w) - .1; };
    show('end', 'endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="bL">LIKE</span><span id="bS">SHARE</span><span id="bU">SUBSCRIBE</span></div>', t, tE, '');
    ['bL', 'bS', 'bU'].forEach(function (id, i) { var b = document.getElementById(id); if (!b) return; var u = clamp((t - a(['लाइक', 'शेयर', 'सब्स'][i])) / .3); b.style.opacity = .25 + .75 * u; b.style.transform = 'scale(' + (1 + .12 * Math.sin(Math.PI * clamp((t - a(['लाइक', 'शेयर', 'सब्स'][i])) / .4))) + ')'; });
  }
};
// sound events for audio_mix.py (dumped by tools/events.mjs)
window.EV = (function () { var E = [], add = function (t, k) { E.push({ t: +t.toFixed(3), k: k }); };
  SCN.forEach(function (s, i) { if (i && CUT[s.k]) add(s.t0, 'whoosh'); });
  add(ST('s1'), 'riffle'); add(CUE('s2', 'दो') - .1, 'card'); add(CUE('s3', 'साढ़े') - .1, 'slam'); add(CUE('s4', 'हम') - .2, 'card');
  var tEx = CUE('s6', 'खोलकर') - .15; add(tEx, 'rise'); ORDER.forEach(function (n, k) { add(tEx + k * .2 + .55, 'clunk'); });
  [['s7', 'पहाड़'], ['s8', 'सोना'], ['s9', 'भेड़ि'], ['s10', 'सीढ़'], ['s11', 'मूँग'], ['s12', 'क्रिस्टल'], ['s12', 'हवा']].forEach(function (q) { add(CUE(q[0], q[1]) - .1, 'tick'); });
  add(CUE('s13', 'वेंटि') - .3, 'air'); add(CUE('s14', 'इंजन') - .05, 'hollow'); add(ST('s15') - .1, 'close'); add(CUE('s15', 'मन'), 'shimmer'); add(CUE('s16', 'राक्षस') - .3, 'swirl');
  add(CUE('s18', 'पुष्पक') - .35, 'card'); add(SCN[3].t0 + 2.5, 'inflate'); add(CUE('s20', 'गरम') - .1, 'burner'); add(CUE('s21', 'सोना') - .3 + .55, 'thud');
  for (var i = 0; i < 25; i++) add(CUE('s22', 'पच्चीस') - .6 + i * .085, 'pop');
  add(CUE('s24', 'उन्नीस') - .2, 'draw'); add(CUE('s25', 'उन्नीस') - .2, 'draw'); add(CUE('s26', 'फ़ैसला') + .25 + .42, 'stamp'); add(CUE('s26', 'उड़'), 'card');
  add(CUE('s27', 'फ़िल्म') - .2, 'card'); add(ST('s29') - .1, 'card'); add(CUE('s29', 'तोड़') - .05, 'crash');
  STOPS.forEach(function (st, i) { add(i ? CUE('s32', st[3]) : ST('s32') - .1, i === 1 ? 'ping2' : 'ping'); }); add(ST('s33') - .2, 'count');
  add(CUE('s34', 'उतरता') + .1, 'touch'); add(SE('s35') + .03, 'slam');
  add(CUE('s36', 'अट्ठाईस') - .2, 'card'); ['लाइक', 'शेयर', 'सब्स'].forEach(function (w) { add(CUE('s37', w) - .1, 'pop'); });
  E.sort(function (a, b) { return a.t - b.t; }); return E; })();
window.__dbg = function (s) { return eval(s); };
window.__seek(0); window.__ready = true;
})();
