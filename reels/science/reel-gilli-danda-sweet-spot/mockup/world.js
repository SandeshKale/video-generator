/* Gilli-danda mockup — precise-mechanism grammar: pale clay ground, flat colour per system, own-colour outlines, true-physics sims. Pure function of t. */
(function () {
var W = 1080, H = 1920, DUR = 16.5, V3 = THREE.Vector3;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function lerp(a, b, e) { return a + (b - a) * e; }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function eo3(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function ramp(t, a, b) { return clamp((t - a) / (b - a)); }
var GROUND = 0xF1E6D3, NEUT = 0xDCCDB4, INK = 0x2A2118, ENERGY = 0xE7B53C, SAGE = 0x7FA58E, VIO = 0x8F86C9, ACC = 0xE8472A;
var R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true }); R.setPixelRatio(1); R.setSize(W, H, false); R.setClearColor(GROUND, 1);
var S = new THREE.Scene(); S.background = new THREE.Color(GROUND); var cam = new THREE.PerspectiveCamera(30, W / H, .1, 400);
var grad = new THREE.DataTexture(new Uint8Array([120, 190, 255]), 3, 1, THREE.RedFormat); grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
var sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-4, 8, 6); S.add(sun); S.add(new THREE.AmbientLight(0xffffff, .9));
function toon(c, vc) { return new THREE.MeshToonMaterial({ color: c, gradientMap: grad, vertexColors: !!vc }); }
function outl(mesh, c, th) { var m = new THREE.Mesh(mesh.geometry, new THREE.ShaderMaterial({ uniforms: { c: { value: new THREE.Color(c) }, th: { value: th } }, vertexShader: 'uniform float th;void main(){vec3 p=position+normalize(normal)*th;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}', fragmentShader: 'uniform vec3 c;void main(){gl_FragColor=vec4(c,1.);}', side: THREE.BackSide })); mesh.add(m); return m; }
function dark(c, k) { return new THREE.Color(c).multiplyScalar(k || .52).getHex(); }
function box(w, h, d, c, th) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), toon(c)); outl(m, dark(c), th == null ? .035 : th); return m; }
/* ground + lane marks */
(function () { var g = new THREE.Mesh(new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: GROUND })); g.position.y = -.001; S.add(g);
  var p = []; for (var i = -6; i <= 6; i++) { var m = new THREE.Mesh(new THREE.PlaneGeometry(.06, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: NEUT })); m.position.set(i * 1.5, 0, -10); S.add(m); } })();
function shadow(r, x, z) { var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(60,45,25,.28)'); gr.addColorStop(1, 'rgba(60,45,25,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); var m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); m.position.set(x, .003, z); S.add(m); return m; }
/* ===== lane set (scenes A, B): stone, gilli, voxel kid, danda, stadium ===== */
var LANE = new THREE.Group(); S.add(LANE);
var stone = new THREE.Mesh(new THREE.SphereGeometry(.34, 18, 12).scale(1, .62, 1), toon(NEUT)); outl(stone, dark(NEUT), .03); stone.position.set(-.05, .2, 0); LANE.add(stone); shadow(.9, 0, 0).parent !== LANE && 0;
var GL = .75, gilli = box(1.5, .15, .15, ACC, .03); LANE.add(gilli);
var ghosts = []; for (var gk = 0; gk < 6; gk++) { var gm = new THREE.Mesh(new THREE.BoxGeometry(1.5, .15, .15), new THREE.MeshBasicMaterial({ color: ACC, transparent: true, opacity: .32 * (1 - gk / 7), depthWrite: false })); LANE.add(gm); ghosts.push(gm); }

/* ===== mocap figurine (CMU golf swing standing in for the danda strike) ===== */
var M3 = window.MOCAP3, JN = M3.swingA.joints, JI = {}; JN.forEach(function (n, i) { JI[n] = i; });
function sampleClip(cl, tc, loop) { var n = cl.n, f = tc * cl.fps; if (loop) f = ((f % (n - 1)) + (n - 1)) % (n - 1); else f = clamp(f, 0, n - 1); var i0 = Math.floor(f), i1 = Math.min(n - 1, i0 + 1), u = f - i0, a = cl.f[i0], b = cl.f[i1], r = new Array(a.length); for (var k = 0; k < a.length; k++) r[k] = a[k] + (b[k] - a[k]) * u; return r; }
function jp(r, n, S, o) { var k = JI[n] * 3; return new V3(r[k] * S + o[0], r[k + 1] * S + o[1], r[k + 2] * S + o[2]); }
function mkFig(shirt, skin, pants) {
  var g = new THREE.Group(); LANE.add(g); var B = [];
  function bone(c, r, sph) { var m = new THREE.Mesh(sph ? new THREE.SphereGeometry(1, 14, 10) : new THREE.CylinderGeometry(1, 1, 1, 12), toon(c)); outl(m, dark(c), .16); g.add(m); B.push({ m: m, r: r, sph: sph }); return m; }
  var def = { torso: bone(shirt, .27), shoul: bone(shirt, .16), hipb: bone(pants, .17), head: bone(skin, .26, 1), uaL: bone(skin, .1), uaR: bone(skin, .1), faL: bone(skin, .085), faR: bone(skin, .085), thL: bone(pants, .13), thR: bone(pants, .13), shL: bone(pants, .105), shR: bone(pants, .105), ftL: bone(0x3a2f24, .09), ftR: bone(0x3a2f24, .09) };
  var joints = ['eL', 'eR', 'hL', 'hR', 'kL', 'kR', 'fL', 'fR', 'sL', 'sR'].map(function (n) { return { n: n, m: bone(/^[hef]/.test(n) && n[0] !== 'f' ? skin : (n[0] === 'k' || n[0] === 'f' ? pants : skin), n[0] === 'h' ? .1 : .12, 1) }; });
  function seg(m, r, a, b) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a).addScaledVector(d, .5); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); m.scale.set(r, L, r); }
  return { g: g, pose: function (row, S, o) {
    var P = function (n) { return jp(row, n, S, o); }; seg(def.torso, .27 * S, P('hip'), P('neck')); seg(def.shoul, .16 * S, P('sL'), P('sR')); seg(def.hipb, .17 * S, P('uL'), P('uR'));
    var h = P('head'); def.head.position.copy(h); def.head.scale.setScalar(.26 * S); def.head.quaternion.identity();
    seg(def.uaL, .1 * S, P('sL'), P('eL')); seg(def.uaR, .1 * S, P('sR'), P('eR')); seg(def.faL, .085 * S, P('eL'), P('hL')); seg(def.faR, .085 * S, P('eR'), P('hR'));
    seg(def.thL, .13 * S, P('uL'), P('kL')); seg(def.thR, .13 * S, P('uR'), P('kR')); seg(def.shL, .105 * S, P('kL'), P('fL')); seg(def.shR, .105 * S, P('kR'), P('fR')); seg(def.ftL, .09 * S, P('fL'), P('tL')); seg(def.ftR, .09 * S, P('fR'), P('tR'));
    joints.forEach(function (j) { j.m.position.copy(P(j.n)); j.m.scale.setScalar((j.n[0] === 'h' ? .1 : .12) * S * .9); });
  } };
}
var FS_ = 1.05, FIG = mkFig(ENERGY, 0xC9A27A, 0x6c5a45), SW = M3.swingA, DL = 2.6, E_END = new V3(.68, .70, 0), club = box(DL, .16, .16, SAGE, .03); LANE.add(club);
var OFF = [0, 0, 0], tImp = SW.impact / SW.fps, GRIPK = .3;
function clubAt(row, o) { var gp = jp(row, 'hL', FS_, o).add(jp(row, 'hR', FS_, o)).multiplyScalar(.5), el = jp(row, 'eL', FS_, o).add(jp(row, 'eR', FS_, o)).multiplyScalar(.5), d = gp.clone().sub(el).normalize(); return { gp: gp, d: d }; }
(function () { var r = SW.f[SW.impact], c = clubAt(r, [0, 0, 0]); var p0 = c.gp.clone().addScaledVector(c.d, -GRIPK); if (c.d.y < -.05) { DL = clamp((E_END.y - p0.y) / c.d.y, 1.8, 3.8); } var tip = p0.clone().addScaledVector(c.d, DL); OFF = [E_END.x - tip.x, 0, -tip.z]; console.log('club', DL.toFixed(2), 'dy', c.d.y.toFixed(2), 'tip', tip.x.toFixed(2), tip.y.toFixed(2), 'OFF', OFF.map(function (v) { return v.toFixed(2); })); club.geometry.dispose(); club.geometry = new THREE.BoxGeometry(DL, .16, .16); })();
function figAt(t) { var row = sampleClip(SW, t - TS + tImp, false); FIG.pose(row, FS_, OFF); var c = clubAt(row, OFF), p0 = c.gp.clone().addScaledVector(c.d, -GRIPK), mid = p0.clone().addScaledVector(c.d, DL / 2); club.position.copy(mid); club.quaternion.setFromUnitVectors(new V3(1, 0, 0), c.d); return mid; }
(function () { /* far stadium: four towers + bowl, neutral with warm lamps */ for (var i = 0; i < 4; i++) { var tw = box(1.6, 26, 1.6, NEUT, .06), x = -34 + i * 22; tw.position.set(x, 13, -90); LANE.add(tw); var lamp = new THREE.Mesh(new THREE.BoxGeometry(5, 2.4, .6), new THREE.MeshBasicMaterial({ color: ENERGY })); lamp.position.set(x, 27, -89); LANE.add(lamp); } var bowl = box(60, 5, 6, NEUT, .08); bowl.position.set(-12, 2.5, -90); LANE.add(bowl); })();
/* gilli physics: rest on stone, then end-strike launch (slow motion factor SM) */
var TS = 5.9, SM = .35, C0 = new V3(0, .387, 0), A0 = 25 * Math.PI / 180, V0 = [1.7, 6.6], OM = -14;
function gilliAt(t) { if (t < TS) return { x: C0.x, y: C0.y, a: A0, on: 1 }; var tau = (t - TS) * SM, x = C0.x + V0[0] * tau, y = C0.y + V0[1] * tau - 4.9 * tau * tau, a = A0 + OM * tau; if (y < .075) { var tl = (V0[1] + Math.sqrt(V0[1] * V0[1] + 2 * 9.8 * (C0.y - .075))) / 9.8; x = C0.x + V0[0] * tl; y = .075; a = A0 + OM * tl; a = Math.round((a - 0) / Math.PI) * Math.PI + .02; } return { x: x, y: y, a: a, on: 0 }; }
function setG(m, g) { m.position.set(g.x, g.y, 0); m.rotation.z = g.a; }
function dAng(t) { var up = 40 * Math.PI / 180, hit = -33 * Math.PI / 180; if (t < TS - 1.5) return lerp(10, 40, ramp(t, 0, TS - 1.5)) * Math.PI / 180; if (t < TS) { var u = ramp(t, TS - .5, TS); return t < TS - .5 ? up : lerp(up, hit, u * u); } return lerp(hit, -50 * Math.PI / 180, ramp(t, TS, TS + .5)); }
/* ===== bat set (scene D) at x = 200 ===== */
var BAT = new THREE.Group(); BAT.position.set(200, 0, 0); S.add(BAT);
var BL = 3.6, N = 90, YT = 1.9; /* tip at y = YT, handle end at YT+BL */
var bgeo = new THREE.BoxGeometry(1, BL, .5, 1, N, 1), brest = bgeo.attributes.position.array.slice(), bcol = new Float32Array(bgeo.attributes.position.count * 3); bgeo.setAttribute('color', new THREE.BufferAttribute(bcol, 3));
var bat = new THREE.Mesh(bgeo, toon(0xffffff, true)); outl(bat, dark(SAGE), .03); BAT.add(bat);
function prof(u) { return u < .62 ? .66 : lerp(.66, .22, clamp((u - .62) / .12)); }
function gs(u) { /* position along bat (0 tip .. 1 handle) -> free-free mode coordinate s, node at u = .176 (tip) and .8 */ if (u < .176) return u / .176 * .224; if (u < .8) return .224 + (u - .176) / .624 * (.776 - .224); return .776 + (u - .8) / .2 * .224; }
function mode(s) { var b = 4.730, x = b * s, sg = .9825; return Math.cosh(x) + Math.cos(x) - sg * (Math.sinh(x) + Math.sin(x)); }
var m0 = mode(0), wmax = Math.abs(m0);
var NODEU = .176, node = new THREE.Mesh(new THREE.TorusGeometry(.62, .035, 8, 40).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: INK })); node.position.set(0, YT + NODEU * BL, 0); BAT.add(node);
var ball = new THREE.Mesh(new THREE.SphereGeometry(.36, 20, 14), toon(ACC)); outl(ball, dark(ACC), .035); BAT.add(ball);
var hand = box(.8, .6, .8, 0xC9A27A); BAT.add(hand); shadow(2.5, 200, 0);
var TH = 11.9, UH = .42, OMG = 2 * Math.PI * 1.1; /* hit time, contact position along the bat, mode frequency (slowed) */
function batAt(t) { var tt = Math.max(0, t - TH), A = (t < TH ? 0 : .5) * Math.exp(-tt / 1.6), ph = Math.sin(OMG * tt), pos = bgeo.attributes.position, wh = mode(gs(UH));
  var maxw = 0; for (var i = 0; i < pos.count; i++) { var ry = brest[i * 3 + 1], u = (ry + BL / 2) / BL, w = mode(gs(u)) / wh, dx = A * ph * w; pos.array[i * 3] = brest[i * 3] * prof(u) + dx; pos.array[i * 3 + 1] = ry + YT + BL / 2; pos.array[i * 3 + 2] = brest[i * 3 + 2]; var k = clamp(Math.abs(A * w) / .5 * 1.25 + (t < TH ? 0 : 0)), c = new THREE.Color(SAGE).lerp(new THREE.Color(VIO), k * (A > .02 ? 1 : 0)); bcol[i * 3] = c.r; bcol[i * 3 + 1] = c.g; bcol[i * 3 + 2] = c.b; }
  pos.needsUpdate = true; bgeo.attributes.color.needsUpdate = true; bgeo.computeVertexNormals(); var hd = A * ph * mode(gs(1)) / wh; hand.position.set(hd, YT + BL + .1, 0); return { hd: hd, A: A }; }
/* labels */
var OV = document.getElementById('ov'); function mk(cls, html, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; OV.appendChild(d); return d; }
var fig = mk('fig', ''), head = mk('head', ''), cap = mk('cap', '');
function tag(html, col) { var d = mk('lbl', html), dot = mk('dot', '', 'background:' + col), ld = mk('ld', ''); return { d: d, dot: dot, ld: ld }; }
function place(tg, wp, dx, dy, u) { var p = wp.clone().project(cam), x = (p.x * .5 + .5) * W, y = (1 - (p.y * .5 + .5)) * H; var on = u > 0; [tg.d, tg.dot, tg.ld].forEach(function (e) { e.style.display = on ? 'block' : 'none'; }); if (!on) return; tg.dot.style.left = x + 'px'; tg.dot.style.top = y + 'px'; var len = Math.hypot(dx, dy) * u; tg.ld.style.left = x + 'px'; tg.ld.style.top = y + 'px'; tg.ld.style.width = len + 'px'; tg.ld.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)'; tg.d.style.left = Math.max(156, Math.min(760, x + dx + (dx < 0 ? -tg.d.offsetWidth - 8 : 8))) + 'px'; tg.d.style.top = (y + dy - 20) + 'px'; tg.d.style.opacity = u; }
var tStone = tag('Stone<small>pivot · neutral</small>', '#DCCDB4'), tGilli = tag('Gilli<small>the protagonist</small>', '#E8472A'), tDanda = tag('Danda<small>transmission</small>', '#7FA58E'), tNode = tag('≈ 150 mm from the tip<small>quiet spot · measured on one bat</small>', '#2A2118'), tShake = tag('Shake<small>bend exaggerated · illustration</small>', '#8F86C9'), tAuc = tag('IPL auction · 16 Dec · Goa<small>reported</small>', '#E7B53C');
var capEl = cap, CAPS = [[0, 5, 'Ek anjaan naam crorepati banega. Uska raaz gaon ki gali mein hai.'], [5, 10.4, 'Gilli ko kinare par maaro — wo hawa mein uchhalti hai.'], [10.9, 16.4, 'Bat ka ek khaas hissa hai, jahan kaanpna lagbhag ruk jaata hai.']];
function camA(t) { var u = eo3(clamp(t / 3.4)); cam.fov = lerp(26, 34, u); cam.updateProjectionMatrix(); cam.position.set(lerp(.9, -.5, u), lerp(.7, 2.6, u), lerp(3.2, 17.5, u)); cam.up.set(0, 1, 0); cam.lookAt(lerp(.3, -.5, u), lerp(.5, 1.9, u), 0); }
function camB(t) { var a = eio(ramp(t, 5, 5.9)), b = eio(ramp(t, 5.9, 9.8)), g = gilliAt(Math.min(t, 9.6)); cam.fov = 34; cam.updateProjectionMatrix(); var az = lerp(0, .12, a) + .55 * b, r = lerp(lerp(17.5, 14.5, a), 15, b), y = lerp(lerp(2.6, 2.2, a), 3.2, b); cam.position.set(Math.sin(az) * r - .5, y, Math.cos(az) * r); cam.up.set(0, 1, 0); cam.lookAt(lerp(-.5, g.x * .5, b), lerp(1.7, 1.6, b) + (g.y - 1) * .3 * b, 0); }
function camD(t) { var u = eio(ramp(t, 10.5, 12.4)), o = eio(ramp(t, 13.2, 16)); cam.fov = 30; cam.updateProjectionMatrix(); cam.position.set(200 + lerp(.0, 1.2, u) + 2.2 * o, lerp(12, 4.6, u), lerp(9, 12.5, u)); cam.up.set(0, 1, 0); cam.lookAt(200, lerp(3.4, 4.2, u), 0); }
window.__reelDurationSec = DUR;
window.__seek = function (t) {
  var scn = t < 5 ? 'A' : t < 10.5 ? 'B' : 'D';
  LANE.visible = scn !== 'D'; BAT.visible = scn === 'D';
  if (scn === 'A') camA(t); else if (scn === 'B') camB(t); else camD(t);
  cam.updateMatrixWorld(true);
  var g = gilliAt(t); setG(gilli, g); ghosts.forEach(function (m, k) { var gg = gilliAt(t - (k + 1) * .1); setG(m, gg); m.visible = !g.on && t > TS && t < TS + 3; });
  var clubMid = figAt(t);
  var bs = batAt(t); var tt = Math.max(0, t - 10.5);
  ball.position.set(t < TH ? lerp(7, .45, ramp(t, 10.9, TH)) : .45 + 4.5 * eo3(ramp(t, TH, TH + 1.6)), YT + UH * BL, 0);
  /* DOM */
  fig.textContent = scn === 'D' ? 'FIG. 4 · first bending mode of a bat' : scn === 'B' ? 'FIG. 2 · a flip: force × distance' : 'FIG. 1 · the lane';
  head.innerHTML = scn === 'A' ? 'The IPL secret is in your <i>village lane</i>' : scn === 'B' ? 'Hit the <i>end</i>: it flies' : 'One spot on a bat <i>doesn’t shake</i>';
  var c = ''; CAPS.forEach(function (x) { if (t >= x[0] && t <= x[1]) c = x[2]; }); cap.textContent = c;
  var uA = ramp(t, .8, 1.5) * (scn === 'A' ? 1 : 0), uB = (scn === 'B' ? 1 : 0) * ramp(t, 5.2, 5.8), uD = scn === 'D' ? ramp(t, 11, 11.6) : 0, uN = scn === 'D' ? ramp(t, 12.6, 13.3) : 0;
  place(tStone, stone.position.clone(), -80, 70, uA); place(tGilli, gilli.position.clone().add(new V3(.3, .1, 0)), 120, -90, uA || uB); place(tDanda, club.position.clone(), -40, -120, uB); place(tAuc, new V3(-12, 29, -90), 40, 60, uA > 0 ? ramp(t, 1.8, 2.6) : 0);
  place(tNode, new V3(200 + .35, YT + NODEU * BL, 0), 150, 120, uN); place(tShake, new V3(200 - .6, YT + .55 * BL, 0), -120, -80, ramp(t, TH + .3, TH + 1.1) * (scn === 'D' ? 1 : 0));
  R.render(S, cam);
};
(document.fonts && document.fonts.load ? Promise.all(['800 76px Brico', '500 22px PM', '600 30px Inter', '800 40px Inter'].map(function (f) { return document.fonts.load(f, 'Hit the end: it flies 150 mm ≈'); })) : Promise.resolve()).then(function () { window.__ready = true; window.__seek(0); }).catch(function () { window.__ready = true; });
window.__ready = false;
})();
