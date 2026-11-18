/* "Sahi jagah par maaro" — gilli-danda x a bat's sweet spot. precise-mechanism grammar (clay ground, flat colour per system, own-colour outlines),
   CMU mocap figurines, true-physics sims. Everything is a pure function of t; scene times come from the voice (timing.js). */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3, TM = window.TM;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function lerp(a, b, e) { return a + (b - a) * e; }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function eo3(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function eob(x) { x = clamp(x); var c = 1.3; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function ramp(t, a, b) { return clamp((t - a) / (b - a)); }
var GROUND = 0xF1E6D3, NEUT = 0xDCCDB4, INK = 0x2A2118, ENERGY = 0xE7B53C, SAGE = 0x7FA58E, VIO = 0x8F86C9, ACC = 0xE8472A, SKIN = 0xC9A27A, PANTS = 0x6c5a45;
/* ---- timing helpers ---- */
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; }); function ST(id) { return SEN[id].t0; } function SE(id) { return SEN[id].t1; }
window.__cue = [];
function CW(id, w, nth) { var n = nth || 0; for (var i = 0; i < TM.cap.length; i++) if (TM.cap[i].s === id && TM.cap[i].w.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(w) === 0) { if (n-- === 0) return TM.cap[i].t0; } window.__cue.push(id + ':' + w); return ST(id) + .4; }
var DUR = TM.end; window.__reelDurationSec = DUR; window.EV = []; function ev(t, k) { window.EV.push({ t: t, k: k }); }
var TB = ST('s2') - .25, TC = ST('s3') - .25, TD = ST('s5') - .25, TF = ST('s8') - .25, TEND = CW('s10', 'nerdlogic') - .3;
window.SCN_T0 = function () { return [0, TB, TC, TD, TF, DUR]; };

/* ---- renderer / scene ---- */
var R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true }); R.setPixelRatio(1); R.setSize(W, H, false); R.setClearColor(GROUND, 1);
var S = new THREE.Scene(); S.background = new THREE.Color(GROUND); var cam = new THREE.PerspectiveCamera(30, W / H, .1, 600);
var grad = new THREE.DataTexture(new Uint8Array([120, 190, 255]), 3, 1, THREE.RedFormat); grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
var sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-4, 8, 6); S.add(sun); S.add(new THREE.AmbientLight(0xffffff, .9));
function toon(c, vc) { return new THREE.MeshToonMaterial({ color: c, gradientMap: grad, vertexColors: !!vc }); }
function outl(mesh, c, th) { var m = new THREE.Mesh(mesh.geometry, new THREE.ShaderMaterial({ uniforms: { c: { value: new THREE.Color(c) }, th: { value: th } }, vertexShader: 'uniform float th;void main(){vec3 p=position+normalize(normal)*th;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}', fragmentShader: 'uniform vec3 c;void main(){gl_FragColor=vec4(c,1.);}', side: THREE.BackSide })); mesh.add(m); return m; }
function dark(c, k) { return new THREE.Color(c).multiplyScalar(k || .52).getHex(); }
function box(w, h, d, c, th) { var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), toon(c)); outl(m, dark(c), th == null ? .035 : th); return m; }
function flat(w, h, d, c) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: c })); }
function shadow(r, x, z) { var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(60,45,25,.28)'); gr.addColorStop(1, 'rgba(60,45,25,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); var m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); m.position.set(x, .003, z); S.add(m); return m; }
var gnd = new THREE.Mesh(new THREE.PlaneGeometry(900, 900).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: GROUND })); gnd.position.y = -.001; S.add(gnd);
function laneMarks(ox) { for (var i = -6; i <= 6; i++) { var m = new THREE.Mesh(new THREE.PlaneGeometry(.06, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: NEUT })); m.position.set(ox + i * 1.5, 0, -10); S.add(m); } }
/* ---- mocap figurines (CMU, converted by tools/bvh3d.mjs) ---- */
var M3 = window.MOCAP3, JN = M3.swingA.joints, JI = {}; JN.forEach(function (n, i) { JI[n] = i; });
function sampleClip(cl, tc, loop) { var n = cl.n, f = tc * cl.fps, cyc = 0; if (loop) { var L = n - 1; cyc = Math.floor(f / L); f = f - cyc * L; } else f = clamp(f, 0, n - 1); var i0 = Math.floor(f), i1 = Math.min(n - 1, i0 + 1), u = f - i0, a = cl.f[i0], b = cl.f[i1], r = new Array(a.length); for (var k = 0; k < a.length; k++) r[k] = a[k] + (b[k] - a[k]) * u;
  if (loop) { var h0x = cl.f[0][0], h0z = cl.f[0][2]; for (var q0 = 0; q0 < r.length; q0 += 3) { r[q0] -= h0x; r[q0 + 2] -= h0z; } } if (loop && cyc) { var dx = cl.f[n - 1][0] - cl.f[0][0], dz = cl.f[n - 1][2] - cl.f[0][2]; for (var q = 0; q < r.length; q += 3) { r[q] += dx * cyc; r[q + 2] += dz * cyc; } } return r; }
function jp(r, n, S_, o) { var k = JI[n] * 3; return new V3(r[k] * S_ + o[0], r[k + 1] * S_ + o[1], r[k + 2] * S_ + o[2]); }
var UP = new V3(0, 1, 0);
function mkFig(parent, shirt, skin, pants) {
  var g = new THREE.Group(); parent.add(g); var B = [];
  function bone(c, sph) { var m = new THREE.Mesh(sph ? new THREE.SphereGeometry(1, 14, 10) : new THREE.CylinderGeometry(1, 1, 1, 12), toon(c)); outl(m, dark(c), .16); g.add(m); return m; }
  var d = { torso: bone(shirt), shoul: bone(shirt), hipb: bone(pants), head: bone(skin, 1), uaL: bone(skin), uaR: bone(skin), faL: bone(skin), faR: bone(skin), thL: bone(pants), thR: bone(pants), shL: bone(pants), shR: bone(pants), ftL: bone(0x3a2f24), ftR: bone(0x3a2f24) };
  var jn = ['eL', 'eR', 'hL', 'hR', 'kL', 'kR', 'fL', 'fR', 'sL', 'sR'].map(function (n) { var c = (n[0] === 'k' || n[0] === 'f') ? pants : (n[0] === 's' ? shirt : skin); return { n: n, m: bone(c, 1), r: n[0] === 'h' ? .1 : .12 }; });
  function seg(m, r, a, b) { var dd = b.clone().sub(a), L = dd.length(); m.position.copy(a).addScaledVector(dd, .5); m.quaternion.setFromUnitVectors(UP, dd.clone().normalize()); m.scale.set(r, L, r); }
  return { g: g, pose: function (row, S_, o) { var P = function (n) { return jp(row, n, S_, o); };
    seg(d.torso, .27 * S_, P('hip'), P('neck')); seg(d.shoul, .16 * S_, P('sL'), P('sR')); seg(d.hipb, .17 * S_, P('uL'), P('uR')); d.head.position.copy(P('head')); d.head.scale.setScalar(.26 * S_);
    seg(d.uaL, .1 * S_, P('sL'), P('eL')); seg(d.uaR, .1 * S_, P('sR'), P('eR')); seg(d.faL, .085 * S_, P('eL'), P('hL')); seg(d.faR, .085 * S_, P('eR'), P('hR'));
    seg(d.thL, .13 * S_, P('uL'), P('kL')); seg(d.thR, .13 * S_, P('uR'), P('kR')); seg(d.shL, .105 * S_, P('kL'), P('fL')); seg(d.shR, .105 * S_, P('kR'), P('fR')); seg(d.ftL, .09 * S_, P('fL'), P('tL')); seg(d.ftR, .09 * S_, P('fR'), P('tR'));
    jn.forEach(function (j) { j.m.position.copy(P(j.n)); j.m.scale.setScalar(j.r * S_ * .9); }); } };
}
var FS = 1.05;
function clubDir(row, o) { var gp = jp(row, 'hL', FS, o).add(jp(row, 'hR', FS, o)).multiplyScalar(.5), el = jp(row, 'eL', FS, o).add(jp(row, 'eR', FS, o)).multiplyScalar(.5); return { gp: gp, d: gp.clone().sub(el).normalize() }; }
/* a striker: figure + danda locked to a swing clip; the danda tip meets `target` (lane-local) at time tHit */
function mkStriker(parent, clipName, shirt, target, tHit) {
  var cl = M3[clipName], fig = mkFig(parent, shirt, SKIN, PANTS), DL = 2.6, club = box(DL, .16, .16, SAGE, .03); parent.add(club);
  var r = cl.f[cl.impact], c = clubDir(r, [0, 0, 0]), p0 = c.gp.clone().addScaledVector(c.d, -.3); if (c.d.y < -.05) DL = clamp((target.y - p0.y) / c.d.y, 1.8, 3.8);
  var tip = p0.clone().addScaledVector(c.d, DL), off = [target.x - tip.x, 0, target.z - tip.z]; club.geometry.dispose(); club.geometry = new THREE.BoxGeometry(DL, .16, .16);
  var tImp = cl.impact / cl.fps;
  return { fig: fig, club: club, at: function (t) { var row = sampleClip(cl, t - tHit + tImp, false); fig.pose(row, FS, off); var cd = clubDir(row, off), q0 = cd.gp.clone().addScaledVector(cd.d, -.3), mid = q0.clone().addScaledVector(cd.d, DL / 2); club.position.copy(mid); club.quaternion.setFromUnitVectors(new V3(1, 0, 0), cd.d); return mid; } };
}
/* ===== set L (ox 0): the lane — scenes A, B ===== */
var LANE = new THREE.Group(); S.add(LANE); laneMarks(0);
var stone = new THREE.Mesh(new THREE.SphereGeometry(.34, 18, 12).scale(1, .62, 1), toon(NEUT)); outl(stone, dark(NEUT), .03); stone.position.set(-.05, .2, 0); LANE.add(stone); shadow(.9, 0, 0);
var gilli = box(1.5, .15, .15, ACC, .03); LANE.add(gilli); var ghosts = []; for (var gk = 0; gk < 6; gk++) { var gm = new THREE.Mesh(new THREE.BoxGeometry(1.5, .15, .15), new THREE.MeshBasicMaterial({ color: ACC, transparent: true, opacity: .32 * (1 - gk / 7), depthWrite: false })); LANE.add(gm); ghosts.push(gm); }
(function () { for (var i = 0; i < 4; i++) { var tw = box(1.6, 26, 1.6, NEUT, .06); tw.position.set(-30 + i * 20, 13, -90); LANE.add(tw); var lamp = new THREE.Mesh(new THREE.BoxGeometry(5, 2.4, .6), new THREE.MeshBasicMaterial({ color: ENERGY })); lamp.position.set(-30 + i * 20, 27, -89); LANE.add(lamp); } var bowl = box(60, 5, 6, NEUT, .08); bowl.position.set(-12, 2.5, -90); LANE.add(bowl); })();
var TS = CW('s2', 'maaro') + .05, SM = .35, C0 = new V3(0, .387, 0), A0 = 25 * Math.PI / 180, V0 = [1.7, 6.6], OM = -14;
function gilliAt(t) { if (t < TS) return { x: C0.x, y: C0.y, a: A0, on: 1 }; var tau = (t - TS) * SM, x = C0.x + V0[0] * tau, y = C0.y + V0[1] * tau - 4.9 * tau * tau, a = A0 + OM * tau; if (y < .075) { var tl = (V0[1] + Math.sqrt(V0[1] * V0[1] + 2 * 9.8 * (C0.y - .075))) / 9.8; x = C0.x + V0[0] * tl; y = .075; a = Math.round((A0 + OM * tl) / Math.PI) * Math.PI + .02; } return { x: x, y: y, a: a, on: 0 }; }
function setG(m, g) { m.position.set(g.x, g.y, 0); m.rotation.z = g.a; }
var STK1 = mkStriker(LANE, 'swingA', ENERGY, new V3(.68, .70, 0), TS);
/* ===== set C (ox 100): centre strike lane (s3) ===== */
var LC = new THREE.Group(); S.add(LC); LC.position.x = 100; laneMarks(100);
var stoneC = stone.clone(); LC.add(stoneC); shadow(.9, 100, 0); var gilliC = box(1.5, .15, .15, ACC, .03); LC.add(gilliC);
var TC1 = CW('s3', 'beech') + .6, GC0 = new V3(0, .075 + .02, 0);
function gilliCAt(t) { if (t < TC1) return { x: GC0.x, y: .1, a: .07 }; var tt = (t - TC1) * .6, v = 2.6, x = v * tt - 1.6 * tt * tt; if (tt > v / 3.2) x = v * v / 6.4; return { x: x, y: .1, a: .07 }; }
var STK2 = mkStriker(LC, 'swingB', SAGE, new V3(0, .11, 0), TC1);
/* ===== set T (ox 140): torque card — two gillis seen from above (s4) ===== */
var TQ = new THREE.Group(); S.add(TQ); TQ.position.x = 140;
var tqG1 = box(2.4, .16, .2, ACC, .03), tqG2 = box(2.4, .16, .2, ACC, .03); tqG1.position.set(0, .1, -2.2); tqG2.position.set(0, .1, 1.5); TQ.add(tqG1, tqG2);
function arrow(x0, z0, len, col, dirx, dirz) { var g = new THREE.Group(), sh = flat(len, .08, .1, col), hd = new THREE.Mesh(new THREE.ConeGeometry(.2, .45, 4).rotateZ(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: col })); sh.position.x = -len / 2; hd.position.x = .22; g.add(sh, hd); g.position.set(x0, .25, z0); g.rotation.y = Math.atan2(-dirz, dirx); TQ.add(g); return g; }
var aF1 = arrow(0, 0, 1.9, ENERGY, 1, 0), aF2 = arrow(0, 0, 1.9, ENERGY, 1, 0);
aF1.rotation.y = -Math.PI / 2; aF2.rotation.y = -Math.PI / 2; aF1.position.set(1.2, .25, -2.2 - .5); aF2.position.set(0, .25, 1.5 - .5);
var rulerA = flat(1.2, .06, .08, VIO), comA = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 8), new THREE.MeshBasicMaterial({ color: INK })), comB = comA.clone(); rulerA.position.set(.6, .3, -2.2); comA.position.set(0, .3, -2.2); comB.position.set(0, .3, 1.5); TQ.add(rulerA, comA, comB);
var spinArc = new THREE.Mesh(new THREE.TorusGeometry(.9, .06, 8, 28, 4.2), new THREE.MeshBasicMaterial({ color: VIO })); spinArc.rotation.x = Math.PI / 2; spinArc.position.set(0, .3, -2.2); TQ.add(spinArc);
var slideA = arrow(.0, 1.5, 2.2, SAGE, 1, 0); slideA.rotation.y = 0; slideA.position.set(2.9, .3, 1.5 + .75);
/* ===== set D (ox 200): the bat, three impacts (shake / quiet spot / edge) ===== */
var BAT = new THREE.Group(); BAT.position.set(200, 0, 0); S.add(BAT); laneMarks(200);
var BL = 2.7, N = 90, YT = 1.9, bgeo = new THREE.BoxGeometry(1, BL, .5, 1, N, 1), brest = bgeo.attributes.position.array.slice(), bcol = new Float32Array(bgeo.attributes.position.count * 3); bgeo.setAttribute('color', new THREE.BufferAttribute(bcol, 3));
var bat = new THREE.Mesh(bgeo, toon(0xffffff, true)); outl(bat, dark(SAGE), .03); BAT.add(bat);
function prof(u) { var sh = clamp((u - .58) / .14), sm = sh * sh * (3 - 2 * sh); return lerp(.38, .13, sm); }
function gs(u) { if (u < .176) return u / .176 * .224; if (u < .8) return .224 + (u - .176) / .624 * (.776 - .224); return .776 + (u - .8) / .2 * .224; }
function mode(s) { var b = 4.730, x = b * s, sg = .9825; return Math.cosh(x) + Math.cos(x) - sg * (Math.sinh(x) + Math.sin(x)); }
var NODEU = .176, node = new THREE.Mesh(new THREE.TorusGeometry(.62, .035, 8, 40).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: INK })); node.position.set(0, YT + NODEU * BL, 0); BAT.add(node);
var HITS = [{ t: CW('s5', 'kaanpta'), u: .42 }, { t: CW('s6', 'sweet'), u: NODEU }, { t: CW('s7', 'kaanpna'), u: .04 }], OMG = 2 * Math.PI * 1.1, W42 = mode(gs(.42)), balls = [];
HITS.forEach(function () { var b = new THREE.Mesh(new THREE.SphereGeometry(.36, 20, 14), toon(ACC)); outl(b, dark(ACC), .035); BAT.add(b); balls.push(b); });
var hand = box(.8, .6, .8, SKIN); BAT.add(hand); shadow(2.5, 200, 0);
var ruler150 = new THREE.Group(); (function () { var L = .15 / .85 * BL, a = flat(.05, L, .05, INK), t1 = flat(.4, .05, .05, INK), t2 = flat(.4, .05, .05, INK); a.position.set(1.15, YT + L / 2, 0); t1.position.set(1.15, YT, 0); t2.position.set(1.15, YT + L, 0); ruler150.add(a, t1, t2); BAT.add(ruler150); })();
function batAt(t) { var pos = bgeo.attributes.position, amp = [], k, tot = 0; HITS.forEach(function (h) { var tt = t - h.t, A = tt < 0 ? 0 : clamp(mode(gs(h.u)) / W42 * .5, -.8, .8) * Math.exp(-tt / 1.4) * Math.sin(OMG * tt); amp.push(A); tot += A; });
  for (var i = 0; i < pos.count; i++) { var ry = brest[i * 3 + 1], u = (ry + BL / 2) / BL, w = mode(gs(u)) / W42, dx = tot * w; pos.array[i * 3] = brest[i * 3] * prof(u) + dx; pos.array[i * 3 + 1] = ry + YT + BL / 2; pos.array[i * 3 + 2] = brest[i * 3 + 2]; var kk = clamp(Math.abs(dx) / .5 * 1.1), c = new THREE.Color(u > .74 ? 0x4a3d2e : SAGE).lerp(new THREE.Color(VIO), kk); bcol[i * 3] = c.r; bcol[i * 3 + 1] = c.g; bcol[i * 3 + 2] = c.b; }
  pos.needsUpdate = true; bgeo.attributes.color.needsUpdate = true; bgeo.computeVertexNormals(); var hd = tot * mode(gs(1)) / W42; hand.position.set(hd, YT + BL + .1, 0); return Math.abs(hd); }
/* ===== set F (ox 300): runners + the SMAT board ===== */
var FL = new THREE.Group(); S.add(FL); FL.position.x = 300; laneMarks(300);
var RUN = [mkFig(FL, ENERGY, SKIN, PANTS), mkFig(FL, SAGE, 0xB98E62, 0x4f5f66), mkFig(FL, VIO, 0xD3AE88, 0x6c5a45)];
var board = box(3.6, 2.2, .3, NEUT, .05); board.position.set(2.2, 3.1, -6); FL.add(board); var post = box(.3, 2.2, .3, NEUT, .04); post.position.set(2.2, 1.1, -6); FL.add(post); var strip = flat(3.2, .12, .1, ENERGY); strip.position.set(2.2, 3.9, -5.8); FL.add(strip);
/* ===== DOM ===== */
var OV = document.getElementById('ov'); function mk(cls, html, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; OV.appendChild(d); return d; }
var figEl = mk('fig', ''), head = mk('head', ''), capEl = mk('cap', ''), wipe = mk('wipe', ''), meter = mk('meter', 'Hand shock<div class="tr"><div class="bar"></div></div>'), eq = mk('eq', 'τ = <span style="color:#E7B53C">F</span> × <span style="color:#8F86C9">d</span>');
var END = mk('endc', '<img src="img/profile.jpg"><div class="hn">nerdlogic.co</div><div class="btns"><span id="eF">FOLLOW</span><span id="eS">SHARE</span></div>'); END.style.display = 'none';
function tag(html, col) { var d = mk('lbl', html), dot = mk('dot', '', 'background:' + col), ld = mk('ld', ''); return { d: d, dot: dot, ld: ld }; }
function place(tg, wp, dx, dy, u) { var p = wp.clone().project(cam), x = (p.x * .5 + .5) * W, y = (1 - (p.y * .5 + .5)) * H, on = u > 0; [tg.d, tg.dot, tg.ld].forEach(function (e) { e.style.display = on ? 'block' : 'none'; }); if (!on) return; tg.dot.style.left = x + 'px'; tg.dot.style.top = y + 'px'; var len = Math.hypot(dx, dy) * u; tg.ld.style.left = x + 'px'; tg.ld.style.top = y + 'px'; tg.ld.style.width = len + 'px'; tg.ld.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)'; var w = tg.d.offsetWidth; tg.d.style.left = Math.max(156, Math.min(918 - w, x + dx + (dx < 0 ? -w - 8 : 8))) + 'px'; tg.d.style.top = Math.max(232, Math.min(1290, y + dy - 20)) + 'px'; tg.d.style.opacity = u; }
var tStone = tag('Stone<small>pivot · neutral</small>', '#DCCDB4'), tGilli = tag('Gilli<small>the protagonist</small>', '#E8472A'), tDanda = tag('Danda<small>transmission</small>', '#7FA58E'), tAuc = tag('IPL auction · 16 Dec · Goa<small>reported</small>', '#E7B53C'),
  tSlide = tag('Slides · no spin<small>illustration · not to scale</small>', '#7FA58E'), tNode = tag('≈ 150 mm from the tip<small>quiet spot · measured on one bat</small>', '#2A2118'), tShake = tag('Shake<small>bend exaggerated · illustration</small>', '#8F86C9'), tSmat = tag('Syed Mushtaq Ali Trophy<small>14 Nov – 6 Dec · reported</small>', '#E7B53C'), tAuc2 = tag('IPL mini-auction · 16 Dec<small>Goa · reported</small>', '#E8472A'),
  tF = tag('Force F<small>same push, both gillis</small>', '#E7B53C'), tD = tag('Distance d<small>centre → strike point</small>', '#8F86C9'), tD0 = tag('d ≈ 0<small>no spin</small>', '#8F86C9');
/* ---- authored camera: keys [t, [pos], [look], fov]; eased between, locked when equal ---- */
function camKeys(t, K) { var i = 0; while (i < K.length - 2 && t >= K[i + 1][0]) i++; var a = K[i], b = K[i + 1], u = eio((t - a[0]) / Math.max(1e-6, b[0] - a[0])); cam.fov = lerp(a[3], b[3], u); cam.updateProjectionMatrix(); cam.position.set(lerp(a[1][0], b[1][0], u), lerp(a[1][1], b[1][1], u), lerp(a[1][2], b[1][2], u)); cam.up.set(0, 1, 0); cam.lookAt(lerp(a[2][0], b[2][0], u), lerp(a[2][1], b[2][1], u), lerp(a[2][2], b[2][2], u)); }
var K_AB = [[0, [.9, .9, 4.8], [.3, .6, 0], 28], [3.2, [-.5, 2.6, 17.5], [-.5, 1.9, 0], 34], [TS - 1.0, [-.5, 2.6, 17.5], [-.5, 1.9, 0], 34], [TS - .1, [-.5, 2.2, 14.8], [-.5, 1.7, 0], 34], [TS + 1.2, [-.3, 2.4, 14.8], [-.4, 1.7, 0], 34], [TC - .1, [6.5, 3.2, 13.5], [1.4, 1.5, 0], 34], [TC + 9, [6.5, 3.2, 13.5], [1.4, 1.5, 0], 34]];
var K_C = [[TC, [100.4, 2.4, 15], [100, 1.3, 0], 34], [TC1 - .1, [100.4, 2.4, 15], [100, 1.3, 0], 34], [TC1 + 1.5, [101.6, 2.0, 11.5], [100.8, 1.0, 0], 34], [ST('s4') - .35, [101.6, 2.0, 11.5], [100.8, 1.0, 0], 34]];
var K_T = [[ST('s4') - .3, [140, 15, 2.5], [140, 0, -.4], 36], [ST('s4') + 2, [140, 15, 2.5], [140, 0, -.4], 36], [TD, [140, 14, 3.5], [140, 0, -.4], 36]];
var TH1 = HITS[0].t, TH2 = HITS[1].t, TH3 = HITS[2].t;
var K_D = [[TD, [200, 10, 9], [200, 2.9, 0], 36], [TD + 2, [201, 3.9, 12.5], [200, 2.9, 0], 36], [TH2 + .6, [201, 3.9, 12.5], [200, 2.9, 0], 36], [TH3 - 1.2, [201.6, 3.2, 11], [200.3, 2.9, 0], 36], [TH3 + 1.0, [200.8, 4.4, 10], [200, 3.3, 0], 36], [TF + 9, [200.8, 4.4, 10], [200, 3.3, 0], 36]];
var K_F = [[TF, [303, 3.6, 17.5], [303, 1.9, 0], 34], [TEND - .5, [303, 3.6, 17.5], [303, 1.9, 0], 34], [TEND + 1.2, [303, 6.5, 23], [303, 2.6, 0], 34], [DUR + 5, [303, 6.5, 23], [303, 2.6, 0], 34]];
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
function capHtml(t) { return window.CAP.html(t, CAPW, { plain: true, hi: '#E8472A', ink: '#2A2118', fs: 40, width: 756 }).replace(/text-shadow:[^"]*"/, 'text-shadow:0 0 8px rgba(241,230,211,.95),0 1px 2px rgba(241,230,211,.9)"'); }
ev(.05, 'hit'); [TB, TC, TD, TF].forEach(function (b) { ev(b - .15, 'whoosh'); }); ev(TS, 'thwack'); ev(TC1, 'thud'); ev(TH1, 'thwack'); ev(TH2, 'chime'); ev(TH3, 'thwack'); ev(CW('s4', 'torque'), 'tick'); ev(CW('s6', 'pandrah'), 'tick'); ev(TEND, 'ping');
var scnTag = function (t) { return t < TC ? 'L' : t < ST('s4') - .25 ? 'C' : t < TD ? 'T' : t < TF ? 'D' : 'F'; };
window.__seek = function (t) {
  var sc = scnTag(t); LANE.visible = sc === 'L'; LC.visible = sc === 'C'; TQ.visible = sc === 'T'; BAT.visible = sc === 'D'; FL.visible = sc === 'F';
  if (sc === 'L') camKeys(t, K_AB); else if (sc === 'C') camKeys(t, K_C); else if (sc === 'T') camKeys(t, K_T); else if (sc === 'D') camKeys(t, K_D); else camKeys(t, K_F);
  cam.updateMatrixWorld(true);
  var shown = {}; /* lane */
  if (sc === 'L') { var g = gilliAt(t); setG(gilli, g); ghosts.forEach(function (m, k) { setG(m, gilliAt(t - (k + 1) * .1)); m.visible = !g.on && t > TS && t < TS + 3; }); var cm = STK1.at(t); shown.club = cm; }
  if (sc === 'C') { var gc = gilliCAt(t); gilliC.position.set(gc.x, gc.y, 0); gilliC.rotation.z = gc.a; shown.clubC = STK2.at(t); }
  if (sc === 'T') { var u1 = ramp(t, CW('s4', 'taaqat'), CW('s4', 'taaqat') + .6), u2 = ramp(t, CW('s4', 'doori'), CW('s4', 'doori') + .6), u3 = ramp(t, CW('s4', 'ghumaav'), CW('s4', 'ghumaav') + .6); aF1.scale.set(u1 + .001, 1, 1); aF2.scale.set(u1 + .001, 1, 1); rulerA.scale.x = u2 + .001; spinArc.visible = u3 > 0; spinArc.scale.setScalar(.4 + .6 * u3); slideA.visible = u3 > 0; }
  var hs = 0; if (sc === 'D') { hs = batAt(t); balls.forEach(function (b, i) { var h = HITS[i], tt = t - h.t, y = YT + h.u * BL; b.visible = tt > -1.1 && tt < 2.2; b.position.set(tt < 0 ? lerp(.45, 7, clamp(-tt)) : .45 + 4.5 * eo3(tt / 1.6), y, 0); }); ruler150.visible = t > CW('s6', 'pandrah') - .3; node.visible = t > CW('s5', 'khaas') - .2; }
  if (sc === 'F') { RUN.forEach(function (f, i) { var tc = (t - TF) * .9 + i * .35, row = sampleClip(M3.run, tc, true), x = ((i * 2.67 + 2.88 * (t - TF)) % 8 + 8) % 8 - 1, z = [.5, -.7, .2][i]; var hx = 0; f.pose(row, FS, [x - row[0] * FS, 0, z - row[2] * FS]); }); }
  /* hand-shock meter (illustration) */
  meter.style.display = sc === 'D' ? 'block' : 'none'; meter.querySelector('.bar').style.width = Math.min(100, hs * 190) + '%';
  eq.style.display = sc === 'T' ? 'block' : 'none'; eq.style.opacity = sc === 'T' ? ramp(t, CW('s4', 'torque') - .1, CW('s4', 'torque') + .5) : 0;
  /* headline / figure line */
  var HD = { L: t < TB ? 'The IPL secret is in your <i>village lane</i>' : 'Hit the <i>end</i>: it flies', C: 'Hit the <i>middle</i>: it slides', T: 'Same push. <i>Different</i> spin', D: t < TH3 - .8 ? 'One spot on a bat <i>doesn’t shake</i>' : 'Hit the <i>edge</i>: hand goes numb', F: t < TEND ? 'Right spot. <i>Right now.</i>' : '' };
  head.innerHTML = HD[sc]; figEl.textContent = { L: t < TB ? 'FIG. 1 · the lane' : 'FIG. 2 · a flip: force × distance', C: 'FIG. 3 · centre strike · illustration', T: 'FIG. 3 · torque = force × distance', D: 'FIG. 4 · first bending mode of a bat', F: 'FIG. 5 · where the game is played now' }[sc]; if (t >= TEND) figEl.textContent = '';
  capEl.innerHTML = t >= TEND ? '' : capHtml(t);
  /* labels */
  var oneIf = function (c) { return c ? 1 : 0; }, L1 = sc === 'L';
  place(tStone, stone.position.clone(), -90, -100, L1 && t < TB ? ramp(t, 1.0, 1.7) : 0); place(tGilli, gilli.position.clone().add(new V3(.3, .1, 0)), 120, -90, L1 ? ramp(t, 1.2, 1.9) * oneIf(t < TS + 1) : 0); place(tAuc, new V3(-12, 5.2, -90), 60, 50, L1 && t < TB ? ramp(t, CW('s1', 'ipl') + .2, CW('s1', 'ipl') + .8) : 0);
  place(tDanda, shown.club || new V3(0, 0, 0), -40, -120, L1 && t > TB ? ramp(t, TB + .4, TB + 1) * oneIf(t < TS + .5) : 0);
  place(tSlide, new V3(101.1, .3, 0), 80, -140, sc === 'C' ? ramp(t, TC1 + .8, TC1 + 1.5) : 0);
  var ud = ramp(t, CW('s4', 'taaqat') + .2, CW('s4', 'taaqat') + .8); place(tF, new V3(140, .4, 1.1), 150, -60, sc === 'T' ? ud : 0); place(tD, new V3(140.5, .3, -2.2), 150, 120, sc === 'T' ? ramp(t, CW('s4', 'doori') + .2, CW('s4', 'doori') + .8) : 0); place(tD0, new V3(140, .3, 1.5), 150, -80, sc === 'T' ? ramp(t, CW('s4', 'doori') + .5, CW('s4', 'doori') + 1.1) : 0);
  place(tNode, new V3(200.35, YT + NODEU * BL, 0), 150, -110, sc === 'D' ? ramp(t, CW('s6', 'pandrah') - .2, CW('s6', 'pandrah') + .5) * oneIf(t < TH3 - 1) : 0); place(tShake, new V3(199.4, YT + .55 * BL, 0), -120, -90, sc === 'D' ? ramp(t, TH1 + .3, TH1 + 1) * oneIf(t < TH2 - .2) : 0);
  place(tSmat, new V3(300 + 2.2, 3.5, -5.8), -40, -170, sc === 'F' ? ramp(t, CW('s8', 'syed') + .1, CW('s8', 'syed') + .7) * oneIf(t < TEND - .3) : 0); place(tAuc2, new V3(300 + 2.2, 2.7, -5.8), 30, 120, sc === 'F' ? ramp(t, CW('s8', 'neelaami'), CW('s8', 'neelaami') + .6) * oneIf(t < TEND - .3) : 0);
  /* scene cut: ink-brown ground panel rises and falls */
  var wp = 0; [TB, TC, ST('s4') - .25, TD, TF].forEach(function (b) { if (b !== TB) { var d = Math.abs(t - b); if (d < .22) wp = Math.max(wp, 1 - d / .22); } }); wipe.style.height = (wp * 1920) + 'px'; wipe.style.opacity = wp > 0 ? .98 : 0;
  var e2 = eo3(ramp(t, TEND, TEND + .5)); END.style.display = e2 > 0 ? 'block' : 'none'; END.style.opacity = e2; END.style.transform = 'translateY(' + ((1 - e2) * 30) + 'px)'; document.getElementById('eF').style.transform = 'scale(' + (eob(ramp(t, TEND + .15, TEND + .5)) * (1 + .04 * Math.sin((t - TEND) * 4.2))).toFixed(3) + ')'; document.getElementById('eS').style.transform = 'scale(' + (eob(ramp(t, TEND + .4, TEND + .75)) * (1 + .04 * Math.sin((t - TEND) * 4.2 + 1.5))).toFixed(3) + ')';
  R.render(S, cam);
};
window.__ready = false;
(document.fonts && document.fonts.load ? Promise.all(['800 76px Brico', '500 22px PM', '600 30px Inter', '800 40px Inter'].map(function (f) { return document.fonts.load(f, 'Hit the end: it flies 150 mm ≈ τ ×'); })) : Promise.resolve()).then(function () { window.__ready = true; window.__seek(0); }).catch(function () { window.__ready = true; window.__seek(0); });
})();
