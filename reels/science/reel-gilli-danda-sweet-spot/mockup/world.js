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
var kid = new THREE.Group(); LANE.add(kid); (function () { var t = box(.9, 1.1, .6, ENERGY), h = box(.6, .6, .6, 0xC9A27A), l1 = box(.32, 1.0, .32, 0x6c5a45), l2 = box(.32, 1.0, .32, 0x6c5a45); t.position.y = 1.55; h.position.y = 2.4; l1.position.set(-.2, .5, 0); l2.position.set(.2, .5, 0); var arm = box(.62, .2, .22, 0xC9A27A); arm.position.set(.62, .45, 0); t.add(arm); kid.add(t, h, l1, l2); kid.position.set(-2.3, 0, .35); shadow(1.2, -2.3, .35); })();
var HAND = new V3(-1.45, 2.1, .35), DL = 2.55, danda = new THREE.Group(); LANE.add(danda); (function () { var d = box(DL, .16, .16, SAGE, .03); d.position.x = DL / 2; danda.add(d); danda.position.copy(HAND); })();
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
  danda.rotation.z = dAng(t); if (t > TS + .5) danda.rotation.z = lerp(dAng(TS + .5), -70 * Math.PI / 180, ramp(t, TS + .5, TS + 1.2)); kid.position.z = .35;
  var bs = batAt(t); var tt = Math.max(0, t - 10.5);
  ball.position.set(t < TH ? lerp(7, .45, ramp(t, 10.9, TH)) : .45 + 4.5 * eo3(ramp(t, TH, TH + 1.6)), YT + UH * BL, 0);
  /* DOM */
  fig.textContent = scn === 'D' ? 'FIG. 4 · first bending mode of a bat' : scn === 'B' ? 'FIG. 2 · a flip: force × distance' : 'FIG. 1 · the lane';
  head.innerHTML = scn === 'A' ? 'The IPL secret is in your <i>village lane</i>' : scn === 'B' ? 'Hit the <i>end</i>: it flies' : 'One spot on a bat <i>doesn’t shake</i>';
  var c = ''; CAPS.forEach(function (x) { if (t >= x[0] && t <= x[1]) c = x[2]; }); cap.textContent = c;
  var uA = ramp(t, .8, 1.5) * (scn === 'A' ? 1 : 0), uB = (scn === 'B' ? 1 : 0) * ramp(t, 5.2, 5.8), uD = scn === 'D' ? ramp(t, 11, 11.6) : 0, uN = scn === 'D' ? ramp(t, 12.6, 13.3) : 0;
  place(tStone, stone.position.clone(), -80, 70, uA); place(tGilli, gilli.position.clone().add(new V3(.3, .1, 0)), 120, -90, uA || uB); place(tDanda, new V3(-1.2, 2.0, .35), -40, -120, uB); place(tAuc, new V3(-12, 29, -90), 40, 60, uA > 0 ? ramp(t, 1.8, 2.6) : 0);
  place(tNode, new V3(200 + .35, YT + NODEU * BL, 0), 150, 120, uN); place(tShake, new V3(200 - .6, YT + .55 * BL, 0), -120, -80, ramp(t, TH + .3, TH + 1.1) * (scn === 'D' ? 1 : 0));
  R.render(S, cam);
};
(document.fonts && document.fonts.load ? Promise.all(['800 76px Brico', '500 22px PM', '600 30px Inter', '800 40px Inter'].map(function (f) { return document.fonts.load(f, 'Hit the end: it flies 150 mm ≈'); })) : Promise.resolve()).then(function () { window.__ready = true; window.__seek(0); }).catch(function () { window.__ready = true; });
window.__ready = false;
})();
