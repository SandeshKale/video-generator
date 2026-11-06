/* "Optical Bench" 3D film — Part A: premium render engine (HDR studio environment, physical materials, planar puddle reflection,
   depth-of-field + bloom + grade post chain), authored camera shots, labels, ray primitives. Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3;
var TUNG = 0xe8b53a, HOT = 0xfff7ee, ICE = 0x2fb872, VIO = 0xff5a5f, COR = 0xe03131, SAGE = 0x2fb872, CHALK = 0x2a0f2e, BENCH = 0xffe3dc, PLUM = 0x2a0f2e, CREAM = 0xfff7ee;
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
function lerp(a, b, e) { return a + (b - a) * e; }
function sstep(x) { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); }
function eo3(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function ei3(x) { x = clamp(x); return x * x * x; }
function eob(x) { x = clamp(x); var c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
var HEX = function (h) { return '#' + ('000000' + h.toString(16)).slice(-6); };
var R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.toneMapping = THREE.NoToneMapping; R.outputColorSpace = THREE.LinearSRGBColorSpace;
var S = new THREE.Scene(), C = new THREE.PerspectiveCamera(40, W / H, .1, 400);
/* ---- HDR studio environment (PMREM) : softboxes in a dark room, so metal and glass have something real to reflect ---- */
var ENV = (function () { var s = new THREE.Scene(); var dome = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec3 vP;void main(){float y=normalize(vP).y;vec3 c=mix(vec3(.55,.38,.32),vec3(.62,.5,.5),smoothstep(-.5,.1,y));c=mix(c,vec3(.75,.68,.72),smoothstep(.1,1.,y));gl_FragColor=vec4(c,1.);}' })); s.add(dome);
  function sb(w, h, x, y, z, col, k) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); }
  for (var q = 0; q < 6; q++) { var an = q / 6 * 6.283; sb(2.2, 12, Math.cos(an) * 14, 4, Math.sin(an) * 14, q % 2 ? 0xfff0e6 : 0xffe0b8, q % 2 ? 3 : 4.2); } sb(14, 4, 0, 9, -8, 0xffe2b0, 9); sb(5, 10, -13, 4, 3, 0xbfd8ff, 4); sb(5, 10, 13, 4, 5, 0xffc890, 3.5); sb(18, .8, 0, -2, 12, 0xffffff, 1.6); sb(8, 8, 0, 14, 4, 0xfff6e8, 2.2);
  var pm = new THREE.PMREMGenerator(R); var rt = pm.fromScene(s, .02); pm.dispose(); return rt.texture; })();
S.environment = ENV;
/* ---- render targets and post chain: scene -> DoF -> bloom -> grade (ACES, vignette, chromatic aberration, grain) ---- */
var HF = THREE.HalfFloatType;
var RT0 = new THREE.WebGLRenderTarget(W, H, { type: HF, samples: 4, depthTexture: new THREE.DepthTexture(W, H) }), RT1 = new THREE.WebGLRenderTarget(W, H, { type: HF });
function mrt(w, h) { return new THREE.WebGLRenderTarget(w, h, { type: HF }); }
var B0 = mrt(W / 4, H / 4), B1 = mrt(W / 4, H / 4), B2 = mrt(W / 8, H / 8), B3 = mrt(W / 8, H / 8);
var FS = new THREE.Scene(), FC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), FQ = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); FS.add(FQ);
var VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
function sm(frag, u) { return new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: frag, depthTest: false, depthWrite: false }); }
function pass(m, tgt) { FQ.material = m; R.setRenderTarget(tgt); R.render(FS, FC); }
var POST = { focus: 14, aper: 1.0, maxR: 26, bloom: .25, expo: .95, grain: .03, ca: .0008, vig: .3, fade: 0, seed: 0 };
var mDof = sm('uniform sampler2D tC,tD;uniform float nr,fr,focus,aper,maxR;uniform vec2 px;varying vec2 vUv;' +
  'float lin(float d){float z=d*2.-1.;return 2.*nr*fr/(fr+nr-z*(fr-nr));}' +
  'float coc(vec2 uv){return clamp(abs(lin(texture2D(tD,uv).x)-focus)/lin(texture2D(tD,uv).x)*aper,0.,1.);}' +
  'void main(){float c0=coc(vUv);vec3 acc=texture2D(tC,vUv).rgb;float ws=1.;float ga=2.39996;' +
  'for(int i=1;i<28;i++){float fi=float(i);float r=sqrt(fi/28.)*c0*maxR;float a=fi*ga;vec2 o=vec2(cos(a),sin(a))*r*px;vec2 uv=vUv+o;float cs=coc(uv);float w=smoothstep(0.,1.,cs*maxR/max(r,1.)+.02);w=max(w,step(c0*.9,cs)*.0)+.02;acc+=texture2D(tC,uv).rgb*w;ws+=w;}' +
  'gl_FragColor=vec4(acc/ws,1.);}', { tC: { value: RT0.texture }, tD: { value: RT0.depthTexture }, nr: { value: .1 }, fr: { value: 400 }, focus: { value: 14 }, aper: { value: 1 }, maxR: { value: 26 }, px: { value: new THREE.Vector2(1 / W, 1 / H) } });
var mBright = sm('uniform sampler2D tC;varying vec2 vUv;void main(){vec3 c=texture2D(tC,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(1.,2.2,l),1.);}', { tC: { value: RT1.texture } });
var mBlur = sm('uniform sampler2D tC;uniform vec2 dir;varying vec2 vUv;void main(){vec3 a=texture2D(tC,vUv).rgb*.2270270;a+=(texture2D(tC,vUv+dir*1.3846).rgb+texture2D(tC,vUv-dir*1.3846).rgb)*.3162162;a+=(texture2D(tC,vUv+dir*3.2308).rgb+texture2D(tC,vUv-dir*3.2308).rgb)*.0702703;gl_FragColor=vec4(a,1.);}', { tC: { value: null }, dir: { value: new THREE.Vector2() } });
var mDown = sm('uniform sampler2D tC;varying vec2 vUv;void main(){gl_FragColor=vec4(texture2D(tC,vUv).rgb,1.);}', { tC: { value: null } });
var mFin = sm('uniform sampler2D tC,tB1,tB2;uniform float bloom,expo,grain,ca,vig,fade,seed;varying vec2 vUv;' +
  'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}' +
  'vec3 aces(vec3 x){return clamp(x*(1.+x/6.)/(1.+x),0.,1.);}' +
  'vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}' +
  'void main(){vec2 d=vUv-.5;float r2=dot(d,d);vec3 c;c.r=texture2D(tC,vUv+d*ca*r2*6.).r;c.g=texture2D(tC,vUv).g;c.b=texture2D(tC,vUv-d*ca*r2*6.).b;' +
  'c+=(texture2D(tB1,vUv).rgb*.7+texture2D(tB2,vUv).rgb*1.0)*bloom;c*=expo;c=aces(c);c=srgb(c);float lm=dot(c,vec3(.299,.587,.114));c=mix(vec3(lm),c,1.3);c=clamp((c-.5)*1.08+.5,0.,1.);' +
  'c*=1.-vig*smoothstep(.25,.95,length(d*vec2(1.,.62))*1.55);c+=(h21(vUv*vec2(1080.,1920.)+seed)-.5)*grain;c=mix(c,vec3(0.),fade);gl_FragColor=vec4(c,1.);}',
  { tC: { value: RT1.texture }, tB1: { value: B1.texture }, tB2: { value: B3.texture }, bloom: { value: .9 }, expo: { value: 1 }, grain: { value: .035 }, ca: { value: .0016 }, vig: { value: .55 }, fade: { value: 0 }, seed: { value: 0 } });
var HOOKS = { pre: [] };
function render() {
  HOOKS.pre.forEach(function (f) { f(); });
  C.layers.set(0); R.setRenderTarget(RT0); R.clear(); R.render(S, C);
  mDof.uniforms.focus.value = POST.focus; mDof.uniforms.aper.value = POST.aper; mDof.uniforms.maxR.value = POST.maxR; pass(mDof, RT1);
  var bg = S.background, fg = S.fog; S.background = null; S.fog = null; C.layers.set(1); R.autoClear = false; R.setRenderTarget(RT1); R.render(S, C); R.autoClear = true; C.layers.set(0); S.background = bg; S.fog = fg;
  mDown.uniforms.tC.value = RT1.texture; pass(mBright, B0); mBright.uniforms.tC.value = RT1.texture;
  mBlur.uniforms.tC.value = B0.texture; mBlur.uniforms.dir.value.set(1 / (W / 4), 0); pass(mBlur, B1); mBlur.uniforms.tC.value = B1.texture; mBlur.uniforms.dir.value.set(0, 1 / (H / 4)); pass(mBlur, B0);
  mDown.uniforms.tC.value = B0.texture; pass(mDown, B2); mBlur.uniforms.tC.value = B2.texture; mBlur.uniforms.dir.value.set(1 / (W / 8), 0); pass(mBlur, B3); mBlur.uniforms.tC.value = B3.texture; mBlur.uniforms.dir.value.set(0, 1 / (H / 8)); pass(mBlur, B2);
  mFin.uniforms.tB1.value = B0.texture; mFin.uniforms.tB2.value = B2.texture;
  var u = mFin.uniforms; u.bloom.value = POST.bloom; u.expo.value = POST.expo; u.grain.value = POST.grain; u.ca.value = POST.ca; u.vig.value = POST.vig; u.fade.value = POST.fade; u.seed.value = POST.seed;
  pass(mFin, null); }
/* ---- authored camera shots (named move, from/to, eased; locked between) ---- */
var CAMS = {}, EASE = { io: sstep, o: eo3, i: ei3, lin: clamp };
function shot(sc, name, t0, t1, p0, l0, f0, p1, l1, f1, ease) { (CAMS[sc] = CAMS[sc] || []).push({ name: name, t0: t0, t1: t1, p0: new V3(p0[0], p0[1], p0[2]), l0: new V3(l0[0], l0[1], l0[2]), f0: f0, p1: new V3(p1[0], p1[1], p1[2]), l1: new V3(l1[0], l1[1], l1[2]), f1: f1, ease: ease || 'io' }); }
function follow(sc, name, t0, t1, fn) { (CAMS[sc] = CAMS[sc] || []).push({ name: name, t0: t0, t1: t1, fn: fn }); }
var camP = new V3(), camL = new V3(), camF = 40;
function camAt(sc, t) { var L = CAMS[sc]; if (!L) return; var cur = L[0], i; for (i = 0; i < L.length; i++) if (t >= L[i].t0) cur = L[i];
  if (cur.fn) { var q = cur.fn(clamp((t - cur.t0) / (cur.t1 - cur.t0)), t); camP.copy(q.p); camL.copy(q.l); camF = q.f; return; }
  var e = t <= cur.t0 ? 0 : t >= cur.t1 ? 1 : EASE[cur.ease]((t - cur.t0) / (cur.t1 - cur.t0)); camP.copy(cur.p0).lerp(cur.p1, e); camL.copy(cur.l0).lerp(cur.l1, e); camF = lerp(cur.f0, cur.f1, e); }
function setCam(p, l, f) { camP.set(p[0], p[1], p[2]); camL.set(l[0], l[1], l[2]); camF = f; }
function applyCam() { C.position.copy(camP); C.up.set(0, 1, 0); C.lookAt(camL); C.fov = camF; C.updateProjectionMatrix(); C.updateMatrixWorld(true); }
/* ---- glow sprites, labels, cards ---- */
function glowTex(c0, c1) { var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, c0); g.addColorStop(.4, c1); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
var GL = { t: glowTex('rgba(255,236,190,1)', 'rgba(255,170,70,.55)'), w: glowTex('rgba(255,255,255,1)', 'rgba(255,245,225,.45)'), i: glowTex('rgba(220,245,255,1)', 'rgba(110,200,255,.5)'), v: glowTex('rgba(235,215,255,1)', 'rgba(176,124,255,.5)'), c: glowTex('rgba(255,215,205,1)', 'rgba(255,107,94,.5)'), s: glowTex('rgba(225,255,235,1)', 'rgba(155,227,176,.5)') };
function glow(k, s, op) { var m = new THREE.Sprite(new THREE.SpriteMaterial({ map: GL[k], transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: op == null ? 1 : op })); m.scale.set(s, s, 1); return m; }
var LBL = [], LC = {};
function lab(text, col, hh, o) { o = o || {}; var k = text + col + JSON.stringify(o), e = LC[k];
  if (!e) { var fs = o.fs || 56, f = o.font || '600 ' + fs + 'px "Geist Mono"', c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = o.pad || 24, lh = fs * 1.25; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
    x.fillStyle = o.bgc || 'rgba(255,247,238,.97)'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = HEX(col); x.fillRect(0, 0, 10, c.height); x.strokeStyle = 'rgba(42,15,46,.35)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, c.width - 3, c.height - 3);
    x.fillStyle = HEX(o.tcol == null ? PLUM : o.tcol); x.textBaseline = 'middle'; x.textAlign = 'left'; lines.forEach(function (l, i) { x.fillText(l, pad + 8, pad * .55 + lh * (i + .5) + 2); });
    var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; e = LC[k] = { tx: tx, asp: c.width / c.height }; }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: e.tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * e.asp, hh, 1); s.userData = { lbl: true, kind: 'lab', sx: hh * e.asp, sy: hh, sz: 1, txt: text.slice(0, 24) }; LBL.push(s); return s; }
function card(term, meaning, col, hh) { var c = document.createElement('canvas'), w = 940, h = 340; c.width = w; c.height = h; var x = c.getContext('2d'); x.fillStyle = 'rgba(255,247,238,.98)'; x.fillRect(0, 0, w, h); x.strokeStyle = HEX(col); x.lineWidth = 7; x.strokeRect(3.5, 3.5, w - 7, h - 7);
  x.fillStyle = HEX(col); x.fillRect(0, 0, w, 62); x.fillStyle = '#2a0f2e'; x.font = '600 27px "Geist Mono"'; x.textBaseline = 'middle'; x.fillText('THIS IS CALLED', 30, 33); x.beginPath(); x.arc(w - 40, 31, 11, 0, 6.283); x.fill();
  x.fillStyle = HEX(PLUM); var tfs = 96; x.font = '900 ' + tfs + 'px Unbounded'; while (x.measureText(term).width > w - 60 && tfs > 30) { tfs -= 4; x.font = '900 ' + tfs + 'px Unbounded'; } x.fillText(term, 30, 150);
  x.fillStyle = 'rgba(42,15,46,.85)'; x.font = '600 36px Inter'; meaning.split('\n').forEach(function (l, i) { x.fillText(l, 30, 232 + i * 50); });
  var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 31; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'card', sx: hh * w / h, sy: hh, sz: 1, txt: 'CARD ' + term }; LBL.push(s); return s; }
function put(o, t, tIn, dur, hold) { var u = clamp((t - tIn) / (dur || .4)), ud = o.userData; if (ud.sx == null) { ud.sx = o.scale.x; ud.sy = o.scale.y; ud.sz = o.scale.z; } var vis = u > 0 && (hold == null || t < hold); o.visible = vis; if (!vis) return 0; var k = eob(u); o.scale.set(ud.sx * k, ud.sy * k, ud.sz * k); if (o.material && o.isSprite) o.material.opacity = clamp(u * 3); return u; }
function isVis(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
var SAFE = { l: 156, r: 912, t: 232, b: 1290 }, _v = new V3(), _r = new V3(), _u = new V3();
function labRect(s) { s.getWorldPosition(_v); var cp = _v.clone().applyMatrix4(C.matrixWorldInverse), d = -cp.z; if (d < .1) return null; var wpp = 2 * d * Math.tan(C.fov * Math.PI / 360) / H, p = _v.clone().project(C), cx = (p.x * .5 + .5) * W, cy = (1 - (p.y * .5 + .5)) * H, w = s.scale.x / wpp, h = s.scale.y / wpp; return { cx: cx, cy: cy, w: w, h: h, l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2, wpp: wpp }; }
function clampLabels() { C.matrixWorld.extractBasis(_r, _u, new V3()); LBL.forEach(function (s) { if (s.userData.p0 == null) s.userData.p0 = s.position.clone(); s.position.copy(s.userData.p0); if (!isVis(s)) return; var r = labRect(s); if (!r) { s.visible = false; return; } if (r.cx < SAFE.l - r.w * .3 || r.cx > SAFE.r + r.w * .3 || r.cy < SAFE.t - r.h * 1.2 || r.cy > SAFE.b + r.h * 1.2) { s.visible = false; return; } var kd = s.userData.kind || 'dyn', lo = kd === 'card' ? 250 : kd === 'lab' ? 50 : 110, hi = kd === 'card' ? 340 : kd === 'lab' ? 84 : 150; if (r.h > hi) { s.scale.multiplyScalar(hi / r.h); r = labRect(s); } else if (r.h < lo) { s.scale.multiplyScalar(lo / r.h); r = labRect(s); } if (r.w > 748) { s.scale.multiplyScalar(748 / r.w); r = labRect(s); } var dx = 0, dy = 0; if (r.l < SAFE.l) dx = SAFE.l - r.l; else if (r.r > SAFE.r) dx = SAFE.r - r.r; if (r.t < SAFE.t) dy = SAFE.t - r.t; else if (r.b > SAFE.b) dy = SAFE.b - r.b; if (dx || dy) { s.parent.updateMatrixWorld(); var wsh = _r.clone().multiplyScalar(dx * r.wpp).add(_u.clone().multiplyScalar(-dy * r.wpp)); var wp = new V3(); s.getWorldPosition(wp); wp.add(wsh); s.position.copy(s.parent.worldToLocal(wp)); } }); }
window.__lbRects = function () { var out = []; LBL.forEach(function (s) { if (!isVis(s) || (s.material && s.material.opacity < .3)) return; var r = labRect(s); if (r && r.r > 0 && r.l < W && r.b > 0 && r.t < H) out.push({ l: r.l, r: r.r, t: r.t, b: r.b, txt: s.userData.txt }); }); return out; };
/* ---- primitives ---- */
function ray(a, b, col, r, op) { var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(2.2), transparent: true, opacity: op == null ? .98 : op, depthWrite: false })); m.geometry.translate(0, .5, 0); setRay(m, a, b); return m; }
function setRay(m, a, b) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a); m.scale.set(1, Math.max(L, .0001), 1); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.clone().normalize()); }
function arrowHead(col, s) { var m = new THREE.Mesh(new THREE.ConeGeometry(s * .5, s * 1.4, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(2.2) })); return m; }
function orient(m, dir) { m.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir.clone().normalize()); }
function gridFloor(sz, step, col, op) { var pts = []; for (var i = -sz; i <= sz; i += step) { pts.push(new V3(i, 0, -sz), new V3(i, 0, sz), new V3(-sz, 0, i), new V3(sz, 0, i)); } return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op == null ? .12 : op })); }
function canvasTex(c) { var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
function physMat(col, o) { o = o || {}; return new THREE.MeshPhysicalMaterial(Object.assign({ color: col, metalness: .0, roughness: .5, envMapIntensity: 1.0 }, o)); }
function unp(A, px, py, dist) { var p = new V3(A[0][0], A[0][1], A[0][2]), l = new V3(A[1][0], A[1][1], A[1][2]), cam = new THREE.PerspectiveCamera(A[2], W / H, .05, 500); cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(l); cam.updateMatrixWorld(true); cam.updateProjectionMatrix(); var v = new V3((px / W) * 2 - 1, 1 - (py / H) * 2, .5).unproject(cam), dir = v.sub(p).normalize(), fwd = new V3(); cam.getWorldDirection(fwd); return p.clone().add(dir.multiplyScalar(dist / dir.dot(fwd))); }
function hideLabels() { LBL.forEach(function (l) { l.visible = false; }); }
window.E = { LBL: LBL, hideLabels: hideLabels, SAFE: SAFE, W: W, H: H, V3: V3, R: R, S: S, C: C, ENV: ENV, POST: POST, HOOKS: HOOKS, render: render, shot: shot, follow: follow, camAt: camAt, setCam: setCam, applyCam: applyCam, camP: camP, camL: camL, getF: function () { return camF; },
  clamp: clamp, hash: hash, lerp: lerp, sstep: sstep, eo3: eo3, ei3: ei3, eob: eob, HEX: HEX, glow: glow, lab: lab, card: card, put: put, isVis: isVis, clampLabels: clampLabels, ray: ray, setRay: setRay, arrowHead: arrowHead, orient: orient, gridFloor: gridFloor, canvasTex: canvasTex, physMat: physMat, unp: unp, mrt: mrt, sm: sm, pass: pass, FS: FS, FC: FC,
  col: { TUNG: TUNG, HOT: HOT, ICE: ICE, VIO: VIO, COR: COR, SAGE: SAGE, CHALK: CHALK, BENCH: BENCH } };
})();
