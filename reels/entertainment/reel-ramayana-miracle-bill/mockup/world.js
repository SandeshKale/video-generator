/* "VFX ka bill" mockup — dark-documentary grammar: the world is black until an analytic scan passes; echoes persist.
   Three scenes: A cost comparison (plane scan), B light bending round a mass (radial scan, Schwarzschild rays), C 42 capture cameras round a voxel performer.
   Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3, DUR = 16.5;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function lerp(a, b, e) { return a + (b - a) * e; }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function eo3(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function ramp(t, a, b) { return clamp((t - a) / (b - a)); }
var ICE = new THREE.Color(0xa9d8f0), EMB = new THREE.Color(0xffb25b), WHITE = new THREE.Color(0xe8f6ff);

var R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.LinearSRGBColorSpace; R.toneMapping = THREE.NoToneMapping; R.autoClear = false;
var HF = THREE.HalfFloatType;
function mrt(w, h, s) { return new THREE.WebGLRenderTarget(w, h, { type: HF, samples: s || 0 }); }
var RT0 = mrt(W, H, 4), B0 = mrt(W / 4, H / 4), B1 = mrt(W / 4, H / 4), B2 = mrt(W / 8, H / 8), B3 = mrt(W / 8, H / 8);
var FS = new THREE.Scene(), FC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), FQ = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); FS.add(FQ);
var VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
function sm(frag, u) { return new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: frag, depthTest: false, depthWrite: false }); }
function pass(m, tgt) { FQ.material = m; R.setRenderTarget(tgt); R.setScissorTest(false); R.render(FS, FC); }
var mBright = sm('uniform sampler2D tC;varying vec2 vUv;void main(){vec3 c=texture2D(tC,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(.35,1.1,l),1.);}', { tC: { value: RT0.texture } });
var mBlur = sm('uniform sampler2D tC;uniform vec2 dir;varying vec2 vUv;void main(){vec3 a=texture2D(tC,vUv).rgb*.2270270;a+=(texture2D(tC,vUv+dir*1.3846).rgb+texture2D(tC,vUv-dir*1.3846).rgb)*.3162162;a+=(texture2D(tC,vUv+dir*3.2308).rgb+texture2D(tC,vUv-dir*3.2308).rgb)*.0702703;gl_FragColor=vec4(a,1.);}', { tC: { value: null }, dir: { value: new THREE.Vector2() } });
var mFin = sm('uniform sampler2D tC,tB1,tB2;uniform float bloom,vig;varying vec2 vUv;' +
  'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}' +
  'void main(){vec3 c=texture2D(tC,vUv).rgb+(texture2D(tB1,vUv).rgb*.8+texture2D(tB2,vUv).rgb*1.1)*bloom;c=c/(1.+c*.55)*1.45;c=pow(max(c,0.),vec3(1./2.2));' +
  'vec2 q=vUv-.5;c*=1.-vig*dot(q,q)*1.6;c+=(h(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(c,1.);}',
  { tC: { value: RT0.texture }, tB1: { value: B0.texture }, tB2: { value: B2.texture }, bloom: { value: .85 }, vig: { value: .8 } });
function blurTo(src, tmp, dst, w, h) { mBlur.uniforms.tC.value = src.texture; mBlur.uniforms.dir.value.set(1 / w, 0); pass(mBlur, tmp); mBlur.uniforms.tC.value = tmp.texture; mBlur.uniforms.dir.value.set(0, 1 / h); pass(mBlur, dst); }
function post() {
  pass(mBright, B0); blurTo(B0, B1, B0, W / 4, H / 4);
  mBlur.uniforms.tC.value = B0.texture; mBlur.uniforms.dir.value.set(1 / (W / 8), 0); pass(mBlur, B2); blurTo(B2, B3, B2, W / 8, H / 8);
  R.setRenderTarget(null); R.setScissorTest(false); FQ.material = mFin; R.render(FS, FC);
}

/* ---- scan materials: one shared scan function per space ---- */
var SC_GLSL = 'uniform float uS,uMode,uW,uL1,uL2;uniform vec3 uD,uC;varying vec3 vP;' +
  'float scanD(){return uMode<.5?uS-dot(vP,uD):uS-length(vP-uC);}' +
  'float scanI(float d){if(d<0.)return -1.;float f=exp(-d*d/(uW*uW));float g=exp(-d/uL1);float tr=exp(-d/uL2);return f*1.7+g*.5+tr*.3;}';
function mkScan(mode, D, C, W2) { return { uS: { value: -2 }, uMode: { value: mode }, uW: { value: W2 || .3 }, uL1: { value: 1.2 }, uL2: { value: 7 }, uD: { value: D || new V3(0, 1, 0) }, uC: { value: C || new V3() } }; }
function U(sc, o) { var u = {}; for (var k in sc) u[k] = sc[k]; for (var k2 in o) u[k2] = { value: o[k2] }; return u; }
var VL = 'attribute float aS;varying vec3 vP;varying float vS;void main(){vS=aS;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
function lineMat(sc, col, base) {
  return new THREE.ShaderMaterial({ uniforms: U(sc, { uCol: col, uBase: base == null ? .5 : base, uPulse: -100, uAmt: 0 }), vertexShader: VL,
    fragmentShader: SC_GLSL + 'uniform vec3 uCol;uniform float uBase,uPulse,uAmt;varying float vS;void main(){float i=scanI(scanD());if(i<0.)discard;float pl=exp(-pow((vS-uPulse)/.9,2.));float v=uBase*i+uAmt*pl;gl_FragColor=vec4(uCol*v,1.);}',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
}
var VSF = 'varying vec3 vP,vN;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}';
var NOISE = 'float hs(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}float nz(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z);}';
function surfMat(sc, col, rim, tex) {
  return new THREE.ShaderMaterial({ uniforms: U(sc, { uCol: col, uRim: rim, uTex: tex ? 1 : 0, uLit: 1 }), vertexShader: VSF,
    fragmentShader: SC_GLSL + 'varying vec3 vN;uniform vec3 uCol,uRim;uniform float uTex,uLit;' + NOISE +
      'void main(){float d=scanD();if(d<0.)discard;float i=scanI(d);vec3 n=normalize(vN),V=normalize(cameraPosition-vP);float ndv=abs(dot(n,V));float rim=pow(1.-ndv,3.);' +
      'float tx=1.;if(uTex>.5){vec3 q=normalize(vN)*3.2;tx=.55+.45*(nz(q*2.)*.6+nz(q*6.)*.4);}' +
      'vec3 c=uCol*(.05+.55*i*(.4+.6*ndv))*tx+uRim*rim*(.35+.65*min(i,1.))*uLit;gl_FragColor=vec4(c,1.);}' });
}
function circ(r, n, y) { var p = []; for (var i = 0; i < n; i++) { var a = i / n * 6.2832, b = (i + 1) / n * 6.2832; p.push(r * Math.cos(a), y || 0, r * Math.sin(a), r * Math.cos(b), y || 0, r * Math.sin(b)); } return p; }
function lines(pos, mat) { var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); var m = new THREE.LineSegments(g, mat); m.frustumCulled = false; m.renderOrder = 5; return m; }

/* ================= scene A: cost comparison ================= */
var SA = new THREE.Scene(), CA = new THREE.PerspectiveCamera(38, W / H, .1, 200), scA = mkScan(0, new V3(0, 1, 0));
var HB_L = 3.69, HB_R = 5.01, HB_R2 = 5.4, BX = 2.6;
function barBox(x, h, col, rim) { var m = new THREE.Mesh(new THREE.BoxGeometry(1.5, h, 1.5), surfMat(scA, col, rim)); m.position.set(x, h / 2, 0); SA.add(m); var e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, h, 1.5)), lineMat(scA, rim, .9)); e.position.copy(m.position); e.renderOrder = 5; SA.add(e); return m; }
barBox(-BX, HB_L, ICE.clone().multiplyScalar(.9), ICE); barBox(BX, HB_R, ICE.clone().multiplyScalar(.9), ICE);
(function () { /* the reported range band on the film bar: ember */
  var h = HB_R2 - HB_R, m = new THREE.Mesh(new THREE.BoxGeometry(1.5, h, 1.5), surfMat(scA, EMB.clone().multiplyScalar(.9), EMB)); m.position.set(BX, HB_R + h / 2, 0); SA.add(m);
  var e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, h, 1.5)), lineMat(scA, EMB, .9)); e.position.copy(m.position); e.renderOrder = 5; SA.add(e); })();
[2.4, 3.6, 4.8].forEach(function (r, k) { [-BX, BX].forEach(function (x) { var l = lines(circ(r, 72, .01), lineMat(scA, x < 0 ? ICE : EMB, .22)); l.position.x = x; SA.add(l); }); });
var gridP = []; for (var gi = -9; gi <= 9; gi++) { gridP.push(gi, 0, -9, gi, 0, 9, -9, 0, gi, 9, 0, gi); } SA.add(lines(gridP, lineMat(scA, ICE, .1)));
var moon = new THREE.Mesh(new THREE.SphereGeometry(.75, 40, 28), surfMat(scA, ICE.clone().multiplyScalar(1.1), ICE, true)); moon.position.set(-BX, HB_L + .85, 0); SA.add(moon);
var film = new THREE.Group(); (function () { var fw = 2.5, fh = fw / 2.39; var g = new THREE.BoxGeometry(fw, fh, .06); var m = new THREE.Mesh(g, surfMat(scA, ICE.clone().multiplyScalar(.25), EMB)); film.add(m);
  var e = new THREE.LineSegments(new THREE.EdgesGeometry(g), lineMat(scA, EMB, 1)); e.renderOrder = 5; film.add(e);
  var perf = []; for (var i = 0; i < 9; i++) { var x = -fw / 2 + (i + .5) * fw / 9; perf.push(x, fh / 2 + .12, .04, x, fh / 2 + .22, .04, x, -fh / 2 - .12, .04, x, -fh / 2 - .22, .04); } film.add(lines(perf, lineMat(scA, EMB, .8)));
  film.position.set(BX, HB_R2 + 1.05, 0); SA.add(film); })();
var pingMat = new THREE.ShaderMaterial({ uniforms: { uR: { value: 0 }, uA: { value: 0 } }, vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);}',
  fragmentShader: 'varying vec3 vP;uniform float uR,uA;void main(){float r=length(vP.xz);float f=exp(-pow((r-uR)/.18,2.));gl_FragColor=vec4(vec3(.66,.85,.94)*f*uA*1.6,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
var ping = new THREE.Mesh(new THREE.PlaneGeometry(40, 40).rotateX(-Math.PI / 2), pingMat); ping.position.y = .02; SA.add(ping);

/* ================= scene B: light bent round a mass (Schwarzschild, rs = 1) ================= */
var SB = new THREE.Scene(), CB = new THREE.PerspectiveCamera(36, W / H, .1, 200), scB = mkScan(1, null, new V3(0, 0, 0), .45);
var bh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), new THREE.MeshBasicMaterial({ color: 0x000000 })); bh.renderOrder = 1; SB.add(bh);
var rays = [];
(function () { /* null geodesics u'' + u = 3Mu^2, M = .5; closed-form in t only through the travelling pulse */
  var Mm = .5, bs = [1.4, 2.0, 2.4, 2.52, 2.6, 2.66, 2.8, 3.1, 3.6, 4.4, 5.4, 6.6];
  bs.forEach(function (b0, k) { [1, -1].forEach(function (sg) {
    var b = b0, r0 = 17, ph = Math.asin(b / r0), u = 1 / r0, du = Math.cos(ph) / b, pts = [], dphi = .004, cap = false;
    function acc(u_) { return -u_ + 3 * Mm * u_ * u_; }
    for (var it = 0; it < 4200; it++) { var r = 1 / u; if (r < 1.02) { cap = true; break; } var th = Math.PI - ph; pts.push([r * Math.cos(th), sg * r * Math.sin(th), 0]);
      if (r > 19 && it > 50) break;
      var k1u = du, k1d = acc(u), k2u = du + k1d * dphi / 2, k2d = acc(u + k1u * dphi / 2), k3u = du + k2d * dphi / 2, k3d = acc(u + k2u * dphi / 2), k4u = du + k3d * dphi, k4d = acc(u + k3u * dphi);
      u += (k1u + 2 * k2u + 2 * k3u + k4u) * dphi / 6; du += (k1d + 2 * k2d + 2 * k3d + k4d) * dphi / 6; ph += dphi; }
    var pos = [], as = [], s = 0, step = 3; for (var i = 0; i < pts.length; i += step) { if (i > 0) { var a = pts[i - step], c = pts[i]; s += Math.hypot(c[0] - a[0], c[1] - a[1]); } pos.push(pts[i][0], pts[i][1], pts[i][2]); as.push(s); }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aS', new THREE.Float32BufferAttribute(as, 1));
    var capt = cap, m = new THREE.Line(g, lineMat(scB, capt ? EMB : ICE, capt ? 1.0 : 1.0)); m.frustumCulled = false; m.renderOrder = 5; SB.add(m); rays.push({ m: m, len: s, k: k + (sg > 0 ? 0 : .5) }); }); });
})();
var disc = new THREE.Mesh(new THREE.RingGeometry(1.6, 4.4, 128, 1).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({ uniforms: U(scB, { uT: 0 }), vertexShader: 'varying vec3 vP;varying vec2 vL;void main(){vL=position.xz;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: SC_GLSL + 'varying vec2 vL;uniform float uT;void main(){float d=scanD();if(d<0.)discard;float i=scanI(d);float r=length(vL),a=atan(vL.y,vL.x);float sw=.5+.5*sin(a*3.+uT*(4./max(r,1.))*1.8-r*3.);float f=smoothstep(4.4,2.2,r)*smoothstep(1.6,2.0,r);' +
    'vec3 col=mix(vec3(1.,.66,.28),vec3(.66,.85,.94),smoothstep(1.8,4.2,r));gl_FragColor=vec4(col*f*(.25+.9*sw)*(.35+.65*min(i,1.4))*1.4,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
disc.rotation.x = .38; disc.renderOrder = 4; SB.add(disc);
var pring = lines(circ(1.5, 96, 0), lineMat(scB, EMB, 1.5)); pring.rotation.x = Math.PI / 2; SB.add(pring);
var halo = new THREE.Mesh(new THREE.RingGeometry(1.55, 2.5, 128, 1), new THREE.ShaderMaterial({ uniforms: U(scB, { uT: 0 }), vertexShader: 'varying vec3 vP;varying vec2 vL;void main(){vL=position.xy;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader: SC_GLSL + 'varying vec2 vL;uniform float uT;void main(){float d=scanD();if(d<0.)discard;float i=scanI(d);float r=length(vL),a=atan(vL.y,vL.x);float f=smoothstep(2.5,1.6,r)*smoothstep(1.52,1.75,r);float sw=.55+.45*sin(a*2.+uT*.9);' +
    'gl_FragColor=vec4(mix(vec3(1.,.7,.35),vec3(.66,.85,.94),smoothstep(1.6,2.4,r))*f*sw*(.3+.7*min(i,1.4))*1.5,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); halo.renderOrder = 4; SB.add(halo);
var starP = []; (function () { for (var i = 0; i < 900; i++) { var a = Math.random(), b = Math.random(); var th = a * 6.2832, ph = Math.acos(2 * b - 1), r = 24 + (i % 7); starP.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)); } })();
(function () { var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(starP, 3)); var m = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: U(scB, {}), vertexShader: 'varying vec3 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;gl_PointSize=2.;}',
  fragmentShader: SC_GLSL + 'void main(){float d=scanD();if(d<0.)discard;gl_FragColor=vec4(vec3(.7,.85,1.)*(.2+.6*clamp(scanI(d),0.,1.)),1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); m.frustumCulled = false; SB.add(m); })();

/* ================= scene C: 42 capture cameras round a voxel performer ================= */
var SCn = new THREE.Scene(), CC = new THREE.PerspectiveCamera(36, W / H, .1, 200), scC = mkScan(0, new V3(0, 1, 0), null, .35);
var floorP = []; [1.5, 3, 4.5, 6, 7.5].forEach(function (r) { floorP = floorP.concat(circ(r, 96, 0)); }); for (var sp = 0; sp < 24; sp++) { var an = sp / 24 * 6.2832; floorP.push(0, 0, 0, 7.5 * Math.cos(an), 0, 7.5 * Math.sin(an)); } SCn.add(lines(floorP, lineMat(scC, ICE, .18)));
var cones = [], CT = new V3(0, 1.3, 0);
(function () { var tiers = [.55, 1.9, 3.3], per = 14; var cg = new THREE.ConeGeometry(.17, .5, 12).rotateX(-Math.PI / 2);
  for (var ti = 0; ti < 3; ti++) for (var i = 0; i < per; i++) { var an = (i + (ti % 2) * .5) / per * 6.2832, r = 6.3 - ti * .35, idx = ti * per + i;
    var mat = surfMat(scC, ICE.clone().multiplyScalar(.7), EMB); var m = new THREE.Mesh(cg, mat); m.position.set(r * Math.cos(an), tiers[ti], r * Math.sin(an)); m.lookAt(CT); SCn.add(m);
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(cg), lineMat(scC, ICE, .7)); e.position.copy(m.position); e.quaternion.copy(m.quaternion); e.renderOrder = 5; SCn.add(e);
    var fl = lineMat(scC, EMB, .0); fl.uniforms.uBase.value = 0; var fgeo = new THREE.BufferGeometry(); fgeo.setAttribute('position', new THREE.Float32BufferAttribute([m.position.x, m.position.y, m.position.z, CT.x, CT.y, CT.z], 3)); var fline = new THREE.LineSegments(fgeo, fl); fline.frustumCulled = false; fline.renderOrder = 5; SCn.add(fline);
    cones.push({ m: m, mat: mat, e: e, fl: fl, t: 11.9 + idx * .043 }); } })();
/* voxel performer rig: shared by the solid figure and its wireframe after-images */
var rig = new THREE.Object3D(), parts = [];
function part(par, size, c, piv) { var pv = new THREE.Object3D(); pv.position.set(piv[0], piv[1], piv[2]); par.add(pv); var g = new THREE.BoxGeometry(size[0], size[1], size[2]); var m = new THREE.Mesh(g, surfMat(scC, ICE.clone().multiplyScalar(.9), ICE)); m.position.set(c[0], c[1], c[2]); pv.add(m); parts.push({ m: m, g: g }); return pv; }
var hips = new THREE.Object3D(); rig.add(hips);
part(hips, [.5, .62, .28], [0, .31, 0], [0, 0, 0]); part(hips, [.26, .28, .26], [0, .78, 0], [0, 0, 0]);
var armL = part(hips, [.16, .56, .16], [0, -.28, 0], [-.33, .58, 0]), armR = part(hips, [.16, .56, .16], [0, -.28, 0], [.33, .58, 0]);
var legL = part(hips, [.2, .92, .2], [0, -.46, 0], [-.14, 0, 0]), legR = part(hips, [.2, .92, .2], [0, -.46, 0], [.14, 0, 0]);
SCn.add(rig);
var ghosts = []; for (var gk = 0; gk < 6; gk++) { var gm = lineMat(scC, EMB, .55 * (1 - gk / 7)), arr = []; parts.forEach(function (p) { var l = new THREE.LineSegments(new THREE.EdgesGeometry(p.g), gm); l.matrixAutoUpdate = false; l.renderOrder = 5; SCn.add(l); arr.push(l); }); ghosts.push({ arr: arr, mat: gm }); }
function setRig(tt) { var th = tt * .9, rad = 1.25; rig.position.set(rad * Math.cos(th), 0, rad * Math.sin(th)); rig.rotation.y = -th + Math.PI; var ph = tt * 5.2;
  hips.position.y = .93 + .04 * Math.abs(Math.sin(ph)); legL.rotation.x = Math.sin(ph) * .7; legR.rotation.x = -Math.sin(ph) * .7; armL.rotation.x = -Math.sin(ph) * .6; armR.rotation.x = Math.sin(ph) * .6; rig.updateMatrixWorld(true); }

/* ================= labels written by the scan ================= */
var OV = document.getElementById('ov'), LBS = [];
function mk(html, cls, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; OV.appendChild(d); return d; }
function lab(o) { var el = mk('<div class=in>' + o.html + '</div><div class=bar></div>', 'lb'); o.el = el; o.in = el.firstChild; o.bar = el.lastChild; LBS.push(o); return o; }
function writeIn(o, u) { if (u <= 0) { o.el.style.display = 'none'; return; } o.el.style.display = 'block'; var w = o.in.offsetWidth; o.in.style.clipPath = 'inset(0 ' + ((1 - u) * 100) + '% 0 0)'; o.bar.style.left = (w * u) + 'px'; o.bar.style.opacity = u < 1 ? 1 : 0; }
var title = mk('VFX <b>ka</b> bill', 'title'), capEl = mk('', 'cap'), wipeEl = mk('', 'wipe');
var LA1 = lab({ html: '<div class=tag>Chandrayaan-3</div><div class=big><span>0</span><small>CR</small></div><div class=src>ISRO chairman’s figure<br>reported · ₹ crore</div>', sc: 'A', t0: .55, t1: 5.5, anchor: new V3(-BX, HB_L + 3.0, 0), dx: -20, dy: 0, align: 'c' });
var LA2 = lab({ html: '<div class=tag>Ramayana · Part 1</div><div class=big em><span></span><small>CR</small></div><div class=src>Trade reports · range<br>reported · ₹ crore</div>', sc: 'A', t0: .95, t1: 5.5, anchor: new V3(BX, HB_R2 + 3.0, 0), dx: 0, dy: 0, align: 'c' });
LA2.in.querySelector('.big').className = 'big em';
var LB1 = lab({ html: '<div class=tag>Illustration · Schwarzschild<br>non-spinning mass</div>', sc: 'B', t0: 5.9, t1: 10.9, px: [162, 260] });
var LB2 = lab({ html: '<div class=tag>Interstellar frames</div><div class=big>~100<small>H</small></div><div class=src>Up to · per frame · reported<br>Wired via press</div>', sc: 'B', t0: 7.0, t1: 10.9, px: [162, 850] });
var LB3 = lab({ html: '<div class=src>2 papers · same code<br>Class. Quantum Grav. 32 (2015) 065001<br>Am. J. Phys. (2015)</div>', sc: 'B', t0: 8.6, t1: 10.9, px: [162, 1090] });
var LC1 = lab({ html: '<div class=tag>Capture floor</div><div class=big><span>0</span></div><div class=tag style="margin-top:2px">infrared cameras · about</div><div class=src style="margin-top:8px">Cinematographer Pankaj Kumar<br>THR India · reported</div>', sc: 'C', t0: 11.7, t1: 16.6, px: [162, 250] });
var LC2 = lab({ html: '<div class=src>Illustration · voxel stand-in</div>', sc: 'C', t0: 12.4, t1: 16.6, px: [162, 1230] });
var CAPS = [[0, 5.4, 'Chandrayaan-3: <i>₹615 crore</i>. Ramayana Part 1: <i>₹835 se 900 crore</i>, reports ke mutabik.'], [5.9, 10.8, 'Interstellar ka black hole: kuch frame <i>sau ghante</i> tak. Aur <i>do asli science paper</i>.'], [11.5, 16.5, 'Motion capture floor par karib <i>42 infrared camera</i>.']];
function proj(v, cam) { var p = v.clone().project(cam); return [(p.x * .5 + .5) * W, (1 - (p.y * .5 + .5)) * H]; }

/* ================= cameras: authored moves ================= */
function camA(t) { var u = eio(t / 5.8); CA.position.set(lerp(-1.4, .5, u), lerp(5.4, 6.0, u), lerp(34, 27.5, u)); CA.lookAt(lerp(-.3, 0, u), lerp(3.0, 3.5, u), 0); CA.updateMatrixWorld(true); }
function camB(t) { var u = eio((t - 5.4) / 5.6), az = lerp(-.12, 1.05, u), r = lerp(20.5, 10.5, eio((t - 5.4) / 5.6)), y = lerp(1.2, 3.4, u); CB.position.set(r * Math.sin(az), y, r * Math.cos(az)); CB.lookAt(0, 0, 0); CB.updateMatrixWorld(true); }
function camC(t) { var u = eio((t - 10.9) / 5.7), az = lerp(.35, 3.7, u), r = lerp(14, 9.8, u), y = lerp(4.2, 2.2, u); CC.position.set(r * Math.cos(az), y, r * Math.sin(az)); CC.lookAt(0, 1.2, 0); CC.updateMatrixWorld(true); }

function renderScene(sc, cam, x0, x1) { R.setRenderTarget(RT0); if (x1 - x0 < W) { R.setScissorTest(true); R.setScissor(x0, 0, x1 - x0, H); } else R.setScissorTest(false); R.setClearColor(0x000000, 1); R.clear(true, true, true); R.render(sc, cam); R.setScissorTest(false); }

window.__reelDurationSec = DUR;
window.__seek = function (t) {
  var wAB = ramp(t, 5.4, 5.95), wBC = ramp(t, 10.9, 11.45);
  /* scan states */
  scA.uS.value = 1.3 + 13 * (1 - Math.pow(1 - ramp(t, .05, 1.6), 3)) + .2 * Math.max(0, t - 1.6);
  scB.uS.value = 24 * Math.pow(ramp(t, 5.55, 8.0), .8) - 1; scB.uC.value.set(0, 0, 0);
  scC.uS.value = -1 + 9 * (1 - Math.pow(1 - ramp(t, 10.95, 12.6), 3)) + .25 * Math.max(0, t - 12.6);
  pingMat.uniforms.uR.value = 16 * ramp(t, 0, 1.7); pingMat.uniforms.uA.value = (1 - ramp(t, 0, 1.7));
  moon.rotation.y = t * .25; film.rotation.y = Math.sin(t * .6) * .12;
  /* rays: a travelling pulse per ray */
  rays.forEach(function (r) { var ph = ((t * 3.0 + r.k * 1.3) % (r.len + 4)) - 2; r.m.material.uniforms.uPulse.value = ph; r.m.material.uniforms.uAmt.value = 4.5; });
  disc.material.uniforms.uT.value = t; halo.material.uniforms.uT.value = t;
  /* performer + after-images */
  var tc = Math.max(t, 10.9);
  for (var k = 5; k >= 0; k--) { setRig(tc - (k + 1) * .17); ghosts[k].arr.forEach(function (l, i) { l.matrix.copy(parts[i].m.matrixWorld); l.matrixWorldNeedsUpdate = true; }); }
  setRig(tc);
  var litN = 0; cones.forEach(function (c) { var u = ramp(t, c.t, c.t + .25), lit = u > 0; if (lit) litN++; c.mat.uniforms.uLit.value = .5 + 1.2 * Math.exp(-(t - c.t) * 2.2) * (lit ? 1 : 0); c.mat.uniforms.uCol.value.copy(lit ? EMB : ICE).multiplyScalar(lit ? .35 : .5); c.fl.uniforms.uBase.value = lit ? .22 * u : 0; });
  /* render with scan wipes (two live renders, a 1 px bright edge) */
  camA(Math.min(t, 5.95)); camB(Math.max(5.4, Math.min(t, 11.45))); camC(Math.max(t, 10.9));
  if (t < 5.4) renderScene(SA, CA, 0, W);
  else if (t < 5.95) { var ex = Math.round(W * wAB); renderScene(SA, CA, ex, W); R.setRenderTarget(RT0); R.setScissorTest(true); R.setScissor(0, 0, ex, H); R.render(SB, CB); R.setScissorTest(false); }
  else if (t < 10.9) renderScene(SB, CB, 0, W);
  else if (t < 11.45) { var ex2 = Math.round(W * (1 - wBC)); renderScene(SB, CB, 0, ex2); R.setRenderTarget(RT0); R.setScissorTest(true); R.setScissor(ex2, 0, W - ex2, H); R.render(SCn, CC); R.setScissorTest(false); }
  else renderScene(SCn, CC, 0, W);
  post();
  /* wipe line */
  if (t >= 5.4 && t < 5.95) { wipeEl.style.display = 'block'; wipeEl.style.left = (W * wAB) + 'px'; } else if (t >= 10.9 && t < 11.45) { wipeEl.style.display = 'block'; wipeEl.style.left = (W * (1 - wBC)) + 'px'; } else wipeEl.style.display = 'none';
  /* DOM */
  title.style.opacity = t < 5.2 ? Math.min(1, t / .5) : Math.max(0, 1 - (t - 5.2) / .3); title.style.display = t < 5.6 ? 'block' : 'none';
  var cap = '', capA = 0; CAPS.forEach(function (c) { if (t >= c[0] && t <= c[1]) { cap = c[2]; capA = Math.min(1, (t - c[0]) / .3, (c[1] - t) / .25); } }); capEl.innerHTML = cap; capEl.style.opacity = capA;
  LA1.in.querySelector('span').textContent = Math.round(615 * eo3(ramp(t, .7, 1.9)));
  LA2.in.querySelector('span').textContent = t < 1.1 ? '' : (Math.round(835 * eo3(ramp(t, 1.1, 2.3))) + '–' + Math.round(900 * eo3(ramp(t, 1.1, 2.3))));
  LC1.in.querySelector('span').textContent = litN;
  var sceneOf = t < 5.4 ? 'A' : t < 10.9 ? 'B' : 'C';
  LBS.forEach(function (o) {
    if (o.sc !== sceneOf && !(o.sc === 'A' && t < 5.95) && !(o.sc === 'B' && t < 11.45 && t >= 5.4)) { o.el.style.display = 'none'; return; }
    var u = ramp(t, o.t0, o.t0 + .55); if (t > o.t1 - .2) u = u * clamp((o.t1 - t) / .2);
    var w = o.in.offsetWidth || 300, h = o.in.offsetHeight || 100, x, y;
    if (o.anchor) { var c = o.sc === 'A' ? CA : CB; var p = proj(o.anchor, c); x = p[0] - w / 2 + (o.dx || 0); y = p[1] - h; } else { x = o.px[0]; y = o.px[1]; }
    x = Math.max(156, Math.min(918 - w, x)); y = Math.max(232, Math.min(1290 - h, y)); o.el.style.left = x + 'px'; o.el.style.top = y + 'px'; writeIn(o, u);
  });
};
(document.fonts && document.fonts.load ? Promise.all(['200 76px IntT', '300 38px IntT', '600 40px IntT', '300 20px JBM', '500 23px JBM'].map(function (f) { return document.fonts.load(f, 'VFX ka bill 0123456789 ₹–·'); })) : Promise.resolve()).then(function () { window.__ready = true; window.__seek(0); }).catch(function () { window.__ready = true; window.__seek(0); });
window.__ready = false;
})();
