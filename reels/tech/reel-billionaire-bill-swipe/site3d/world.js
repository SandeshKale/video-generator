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
/* Part B0 (billionaire): timing helpers + shared 3D builders (phone, voxel billionaire, throne, bill cards, stamps, coins) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return TM.words[k][1]; } } } window.__ws[id + '|' + subs] = ['MISS', +SP(id, f == null ? .5 : f).toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return SP(id, f == null ? .5 : f); }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
var GOLD = 0xe8b53a, PLUM = 0x2a0f2e, CREAM = 0xfff7ee, GREEN = 0x2fb872, RED = 0xe03131, BLUSH = 0xffe3dc, CORAL = 0xff5a5f, SKIN = 0xd9a27a;
var K = { GOLD: GOLD, PLUM: PLUM, CREAM: CREAM, GREEN: GREEN, RED: RED, BLUSH: BLUSH, CORAL: CORAL, SKIN: SKIN };
var B = window.B = { K: K };
/* live counter sprite (cream card, coloured edge) */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'dyn', sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s);
  s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(255,247,238,.98)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 12, h); x.strokeStyle = 'rgba(42,15,46,.35)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function rr(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function rbox(w, h, d, r, mat, bev) { var g = new THREE.ExtrudeGeometry(rr(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev || .05, bevelSize: bev || .05, bevelSegments: 3, curveSegments: 10 }); g.translate(0, 0, -d / 2); return new THREE.Mesh(g, mat); }
function tcv(w, h, fn) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); fn(x, w, h); return c; }
function plane(w, h, canvas, tr) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(canvas), transparent: !!tr, toneMapped: false })); return m; }
function M(c, o) { return e.physMat(c, Object.assign({ roughness: .6, metalness: .05 }, o || {})); }
var GM = function () { return M(GOLD, { metalness: .75, roughness: .35, envMapIntensity: .9 }); };
B.rr = rr; B.rbox = rbox; B.tcv = tcv; B.plane = plane; B.M = M; B.GM = GM;
B.floor = function (g, y, r) { var fl = new THREE.Mesh(new THREE.CircleGeometry(r || 60, 64), e.physMat(0xffcbbf, { roughness: .8, metalness: 0, envMapIntensity: .5 })); fl.rotation.x = -Math.PI / 2; fl.position.y = y || 0; g.add(fl); var gr = e.gridFloor(40, 2, 0x2a0f2e, .07); gr.position.y = (y || 0) + .01; g.add(gr); return fl; };
/* the bill card: front face drawn on a canvas. kind: 'bill' | 'rent' | 'water' | 'medical' */
B.card = function (title, amount, sub, o) { o = o || {}; var g = new THREE.Group(), body = rbox(2.6, 1.7, .08, .22, e.physMat(o.paper || CREAM, { roughness: .5 }), .02); g.add(body);
  var f = plane(2.5, 1.62, tcv(520, 340, function (x, w, h) { x.fillStyle = o.paper ? '#' + ('000000' + o.paper.toString(16)).slice(-6) : '#fff7ee'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2a0f2e'; x.lineWidth = 8; x.strokeRect(6, 6, w - 12, h - 12); x.fillStyle = '#2a0f2e'; x.font = '600 30px "Geist Mono"'; x.fillText(title, 34, 66);
    var fs = 86; x.font = '900 ' + fs + 'px Unbounded'; while (x.measureText(amount).width > w - 64 && fs > 30) { fs -= 4; x.font = '900 ' + fs + 'px Unbounded'; } x.fillText(amount, 30, 175);
    x.fillStyle = o.subcol || '#e03131'; x.font = '600 26px "Geist Mono"'; x.fillText(sub || '', 34, 232); x.fillStyle = 'rgba(42,15,46,.14)'; x.fillRect(34, 262, 300, 16); x.fillRect(34, 290, 210, 16); x.fillStyle = 'rgba(42,15,46,.3)'; for (var i = 0; i < 8; i++) x.fillRect(w - 52, 262 + i * 0, 0, 0); })); f.position.z = .06; g.add(f); g.userData.face = f; return g; };
B.stamp = function (txt, col, w, h, fs) { var c = tcv(760, 260, function (x, W, H) { x.strokeStyle = col; x.lineWidth = 16; x.strokeRect(14, 14, W - 28, H - 28); x.fillStyle = col; x.font = '900 ' + (fs || 112) + 'px Unbounded'; x.textAlign = 'center'; x.textBaseline = 'middle'; var ls = txt.split('\n'); ls.forEach(function (l, i) { x.fillText(l, W / 2, H * (i + .5) / ls.length + 4); }); }); return plane(w || 4.2, h || 1.44, c, true); };
/* stamp slam: 0 hidden, drops from above, squashes, settles. u in [0,1] */
B.slam = function (m, u, y0, y1, sc) { m.visible = u > 0; if (u <= 0) return; var k = clamp(u / .35), y = lerp(y0, y1, k * k), s = (u < .35 ? 1.5 - .5 * k : 1 + .08 * Math.exp(-(u - .35) * 14) * Math.cos((u - .35) * 40)); m.position.y = y; m.scale.setScalar(s * (sc || 1)); };
B.phone = function (screen) { var g = new THREE.Group(), body = rbox(3.5, 6.9, .4, .55, e.physMat(0x1b1220, { metalness: .6, roughness: .22, clearcoat: 1, clearcoatRoughness: .08, envMapIntensity: 1.3 }), .06); g.add(body);
  var scr = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 6.52), new THREE.MeshBasicMaterial({ map: e.canvasTex(screen), toneMapped: false })); scr.position.z = .31; g.add(scr); g.userData.scr = scr; return g; };
B.voxel = function (hat, shirt) { var g = new THREE.Group(), b = function (w, h, d, m, x, y, z) { var q = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); q.position.set(x, y, z); g.add(q); return q; }, sh = shirt == null ? PLUM : shirt;
  b(.34, .7, .34, M(PLUM), -.2, .35, 0); b(.34, .7, .34, M(PLUM), .2, .35, 0); g.userData.torso = b(.9, 1.0, .5, M(sh, { roughness: .45 }), 0, 1.2, 0); g.userData.armL = b(.18, .5, .6, M(sh), -.56, 1.2, .1); g.userData.armR = b(.18, .5, .6, M(sh), .56, 1.2, .1);
  b(.22, .22, .06, M(CORAL), 0, 1.5, .28); var head = new THREE.Group(); head.position.set(0, 2.05, 0); g.add(head); g.userData.head = head; var hb = function (w, h, d, m, x, y, z) { var q = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); q.position.set(x, y - 2.05, z); head.add(q); return q; };
  hb(.62, .62, .6, M(SKIN), 0, 2.05, 0); hb(.34, .09, .06, M(0x1b1220), 0, 1.92, .31); hb(.08, .08, .06, M(0x1b1220), -.16, 2.14, .31); hb(.08, .08, .06, M(0x1b1220), .16, 2.14, .31);
  if (hat !== false) { hb(.9, .1, .9, GM(), 0, 2.42, 0); hb(.55, .46, .55, GM(), 0, 2.7, 0); hb(.57, .1, .57, M(RED), 0, 2.52, 0); } return g; };
B.throne = function () { var g = new THREE.Group(), gm = e.physMat(GOLD, { metalness: .75, roughness: .32, envMapIntensity: .9 }), vm = e.physMat(0xa31621, { roughness: .95, metalness: 0 });
  [[2.4, .5, 2.1, 0, .25, 0, gm], [2.2, .4, 1.9, 0, .7, 0, vm], [2.4, 3.4, .5, 0, 2.2, -.95, gm], [2.0, 2.9, .3, 0, 2.2, -.7, vm], [.4, 1.2, 2.0, -1.2, 1.1, 0, gm], [.4, 1.2, 2.0, 1.2, 1.1, 0, gm]].forEach(function (a) { var b = new THREE.Mesh(new THREE.BoxGeometry(a[0], a[1], a[2]), a[6]); b.position.set(a[3], a[4], a[5]); g.add(b); });
  var crown = new THREE.Mesh(new THREE.CylinderGeometry(.35, .5, .5, 6), gm); crown.position.set(0, 4.15, -.95); g.add(crown); return g; };
B.coin = function (n) { var im = new THREE.InstancedMesh(new THREE.CylinderGeometry(.22, .22, .06, 24), e.physMat(GOLD, { metalness: .8, roughness: .3, envMapIntensity: 1.0 }), n); im.frustumCulled = false; return im; };
var _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _s = new V3(), _p = new V3();
B.setI = function (im, i, x, y, z, rx, ry, rz, s) { _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e); _s.set(s == null ? 1 : s, s == null ? 1 : s, s == null ? 1 : s); _p.set(x, y, z); _m.compose(_p, _q, _s); im.setMatrixAt(i, _m); };
B.bgc = function (fog) { S.background = new THREE.Color(BLUSH); S.fog = new THREE.FogExp2(BLUSH, fog == null ? .012 : fog); };
B.sc = null;
})();
/* Part B1 (billionaire): scenes 0-5 (hook, how it works, the myth, conveyor, double swipe + privacy, 3,428 crowd). Everything is a pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS;
var SC = window.SC = [0, S0('p1'), S0('r1'), S0('t1'), S0('t2'), S0('t3'), S0('f1'), S0('f2'), S0('f3'), S0('m1'), S0('e1'), S0('c1')];
window.GR = []; window.SCN = [];
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
window.fmt = fmt; window.grp = grp;
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.sw = sw;
/* ===== scene 0: the hook ===== */
var gA = grp(new THREE.Group()), A = {};
(function () { B.floor(gA, 0, 40); var st = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.8, .5, 64), e.physMat(0xfff0e6, { roughness: .35, envMapIntensity: .9 })); st.position.y = .25; gA.add(st);
  var ring = new THREE.Mesh(new THREE.TorusGeometry(7.6, .12, 12, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.4) })); ring.rotation.x = Math.PI / 2; ring.position.y = .52; gA.add(ring);
  var scr = B.tcv(540, 1100, function (x) { var grd = x.createLinearGradient(0, 0, 0, 1100); grd.addColorStop(0, '#ff7a70'); grd.addColorStop(1, '#ff4f5e'); x.fillStyle = grd; x.fillRect(0, 0, 540, 1100); x.fillStyle = '#fff7ee'; x.font = '900 46px Unbounded'; x.textAlign = 'center'; x.fillText('BILLSWIPE', 270, 96); x.font = '600 20px "Geist Mono"'; x.fillText('ILLUSTRATIVE · NOT A REAL APP', 270, 132);
    x.fillStyle = 'rgba(42,15,46,.18)'; x.fillRect(58, 205, 430, 640); x.fillStyle = '#fff7ee'; x.fillRect(46, 185, 448, 650); x.strokeStyle = '#2a0f2e'; x.lineWidth = 6; x.strokeRect(46, 185, 448, 650); x.fillStyle = '#fff7ee'; x.beginPath(); x.arc(160, 950, 70, 0, 6.283); x.fill(); x.beginPath(); x.arc(380, 950, 70, 0, 6.283); x.fill(); x.fillStyle = '#e03131'; x.font = '900 70px Inter'; x.fillText('✕', 160, 976); x.fillStyle = '#2fb872'; x.fillText('♥', 380, 976); });
  A.ph = B.phone(scr); A.ph.position.set(.9, 3.9, 0); A.ph.rotation.y = -.3; A.ph.scale.setScalar(.82); gA.add(A.ph);
  A.th = B.throne(); A.th.position.set(-3.7, .5, 1.6); A.th.rotation.y = .6; A.th.scale.setScalar(.95); gA.add(A.th); A.bi = B.voxel(); A.bi.position.set(-3.7, 1.6, 1.8); A.bi.rotation.y = .6; gA.add(A.bi);
  A.card = B.card('ELECTRICITY', '₹4,820', '1 MONTH OVERDUE'); A.card.scale.setScalar(.8); gA.add(A.card); A.paid = B.stamp('PAID', '#2fb872', 1.7, .6, 120); A.paid.position.set(.2, -.35, .1); A.card.add(A.paid);
  A.coins = B.coin(46); gA.add(A.coins);
  A.l1 = e.lab('BORED', K.RED, .5); A.l1.position.set(-3.7, 5.4, 1.8); gA.add(A.l1); A.l2 = e.lab('BILL · 1 MONTH OVERDUE', K.CORAL, .46); A.l2.position.set(.9, 8.0, 0); gA.add(A.l2); })();
SCN[0] = function (t) { var g = gA; g.visible = true; B.bgc(.012); var tF = SP('h1', .6), u = clamp((t - tF) / 1.1);
  var px = lerp(.9 + .55, 12, eo3(u)), py = 4.1 + 4.2 * u - 4.6 * u * u + (u < 0 ? 0 : 0), pz = .95; A.card.position.set(u > 0 ? px : 1.45, u > 0 ? py : 4.1 + .08 * Math.sin(t * 2.2), pz); A.card.rotation.set(0, -.3 + u * .3, -u * .9); A.paid.visible = u > .75; A.paid.scale.setScalar(.8 + .2 * eo3((u - .75) * 4));
  A.bi.userData.head.rotation.z = .1 * Math.sin(t * 1.5) - (u > 0 ? .1 : 0); A.bi.userData.head.rotation.y = lerp(.0, -.5, sw(tF, tF + .5, t)); A.bi.userData.armR.rotation.x = -.9 + .15 * Math.sin(t * 1.5);
  var tc = tF + .5; for (var i = 0; i < 46; i++) { var l = clamp((t - tc - hash(i) * .8) / 1.0), x0 = 3.0 + (hash(i + 3) - .5) * 4.4, z0 = 1.0 + (hash(i + 9) - .5) * 3.2, yy = lerp(9 + hash(i + 5) * 4, .62, ei3(l)); if (l <= 0) yy = -5; B.setI(A.coins, i, x0, yy, z0, 1.2 + l * 3, hash(i + 3) * 3, l * 4, 1); } A.coins.instanceMatrix.needsUpdate = true;
  put(A.l1, t, .6, .4); put(A.l2, t, 1.0, .4); };
e.shot(0, 'crane down', 0, 2.8, [4.5, 9.5, 22], [-.3, 4.4, 0], 44, [2.6, 5.4, 18.5], [-.4, 3.9, 0], 44, 'io');
e.shot(0, 'push on the flick', SP('h1', .5), SP('h1', .5) + 2.4, [2.6, 5.4, 18.5], [-.4, 3.9, 0], 44, [2.2, 5.2, 15.5], [1.6, 4.9, 0], 42, 'io');
/* ===== scene 1: how it works (upload -> swipe -> paid) ===== */
var gH = grp(new THREE.Group()), H = {};
(function () { B.floor(gH, 0, 60); [-7, 0, 7].forEach(function (x, i) { var d = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.0, .35, 48), e.physMat(0xfff0e6, { roughness: .4 })); d.position.set(x, .18, 0); gH.add(d); var rg = new THREE.Mesh(new THREE.TorusGeometry(2.85, .07, 10, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color([K.CORAL, K.GOLD, K.GREEN][i]).multiplyScalar(1.5) })); rg.rotation.x = Math.PI / 2; rg.position.set(x, .38, 0); gH.add(rg); });
  var sc2 = B.tcv(540, 1100, function (x) { x.fillStyle = '#ff5a5f'; x.fillRect(0, 0, 540, 1100); x.fillStyle = '#fff7ee'; x.font = '900 44px Unbounded'; x.textAlign = 'center'; x.fillText('UPLOAD BILL', 270, 150); x.strokeStyle = '#fff7ee'; x.lineWidth = 10; x.setLineDash([22, 16]); x.strokeRect(90, 260, 360, 500); });
  H.ph = B.phone(sc2); H.ph.scale.setScalar(.55); H.ph.position.set(-7, 2.4, -.8); gH.add(H.ph); H.bi = B.voxel(); H.bi.position.set(0, .35, -1.0); H.bi.scale.setScalar(.8); gH.add(H.bi);
  H.bld = new THREE.Group(); H.bld.position.set(7, .35, -1.0); var bb = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.4, 1.6), M(K.GREEN)); bb.position.y = 1.2; H.bld.add(bb); var rf = new THREE.Mesh(new THREE.BoxGeometry(3.0, .3, 2.0), M(K.PLUM)); rf.position.y = 2.55; H.bld.add(rf); gH.add(H.bld);
  H.card = B.card('ELECTRICITY', '₹4,820', 'ONE BILL'); gH.add(H.card); H.paid = B.stamp('PAID', '#2fb872', 1.9, .65, 120); H.paid.position.set(.2, -.3, .1); H.card.add(H.paid);
  H.heart = B.plane(1.6, 1.6, B.tcv(256, 256, function (x) { x.fillStyle = '#2fb872'; x.font = '900 220px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('♥', 128, 140); }), true); H.heart.position.set(0, 4.6, 1); gH.add(H.heart);
  H.coins = B.coin(30); gH.add(H.coins);
  H.l = [e.lab('1 · UPLOAD', K.CORAL, .6), e.lab('2 · SWIPE RIGHT', K.GOLD, .6), e.lab('3 · BILL PAID', K.GREEN, .6)]; H.l.forEach(function (l, i) { l.position.set(-7 + i * 7, 5.6, 0); gH.add(l); }); })();
SCN[1] = function (t) { var g = gH; g.visible = true; B.bgc(.01); var L = S1('p1') - SC[1], a = SC[1] + L * .08, b = SC[1] + L * .36, c = SC[1] + L * .66, d = SC[1] + L * .88;
  var x = -7 + 7 * sw(a + .2, b, t) + 7 * sw(c, d, t), y = .9 + (t < b ? 1.5 * sw(a - .1, a + .5, t) : 0) + .2 * Math.sin(t * 3); H.card.position.set(x, y + (x > 1 ? 0 : 0), t < a ? -0.2 : 1.0); H.card.rotation.set(0, .0, .08 * Math.sin(t * 2)); H.card.scale.setScalar(.75);
  var u3 = clamp((t - d) / .5); H.paid.visible = u3 > 0; H.paid.scale.setScalar(.8 + .3 * eo3(u3)); H.heart.visible = t > b + .1 && t < c + .5; H.heart.scale.setScalar(.6 + .5 * eo3((t - b - .1) * 3)); H.bi.userData.head.rotation.y = -.2 + .3 * sw(b - .3, b + .2, t);
  for (var i = 0; i < 30; i++) { var l = clamp((t - d - .1 - hash(i) * .3) / .8); B.setI(H.coins, i, 7 + (hash(i + 1) - .5) * 3, l <= 0 ? -5 : lerp(.9, .5 + 4 * Math.sin(l * 3.14) * (.4 + hash(i + 2)), 1) * (1 - 0) + 0, 1 + (hash(i + 4) - .5) * 2, l * 5, l * 6, 0); } H.coins.instanceMatrix.needsUpdate = true;
  H.l.forEach(function (l, i) { put(l, t, SC[1] + .15 + i * L * .27, .4); }); };
e.shot(1, 'truck along the stages', SC[1], S1('p1') + .2, [-7.8, 5.2, 11.5], [-7, 2.4, 0], 46, [7.8, 5.2, 11.5], [7, 2.4, 0], 46, 'io');
/* ===== scene 2: the myth (never posted) ===== */
var gM = grp(new THREE.Group()), Mv = {};
(function () { B.floor(gM, 0, 60); Mv.slab = B.rbox(6.2, 4.3, .2, .35, e.physMat(0xfff7ee, { roughness: .4 }), .04); Mv.slab.position.set(0, 4.6, 0); Mv.slab.rotation.y = -.12; gM.add(Mv.slab);
  var sp = B.plane(6.0, 4.1, B.tcv(620, 430, function (x) { x.fillStyle = '#fff7ee'; x.fillRect(0, 0, 620, 430); x.fillStyle = 'rgba(42,15,46,.12)'; x.beginPath(); x.arc(70, 76, 40, 0, 6.283); x.fill(); x.fillRect(130, 56, 220, 22); x.fillRect(130, 90, 150, 16); x.fillStyle = '#2a0f2e'; x.font = '900 34px Unbounded'; x.textAlign = 'left'; x.fillText('"app where bored', 40, 190); x.fillText('billionaires swipe', 40, 238); x.fillText('right to pay bills"', 40, 286); x.fillStyle = 'rgba(42,15,46,.55)'; x.font = '600 22px "Geist Mono"'; x.fillText('SCREENSHOT · NO DATE · NO LINK', 40, 340); x.fillText('SHARED ON FACEBOOK, 1 NOV 2026', 40, 376); })); sp.position.z = .16; Mv.slab.add(sp);
  Mv.stamp = B.stamp('NEVER\nPOSTED', '#e03131', 4.2, 1.44, 112); Mv.stamp.position.set(.9, -1.0, .45); Mv.stamp.rotation.z = -.2; Mv.slab.add(Mv.stamp);
  Mv.sb = B.rbox(7.4, 1.1, .2, .5, e.physMat(0xfff7ee, { roughness: .4 }), .03); Mv.sb.position.set(0, 1.9, 3.2); Mv.sb.rotation.x = -.15; Mv.sb.scale.setScalar(.68); gM.add(Mv.sb);
  Mv.q = B.plane(7.2, 1.07, B.tcv(740, 110, function (x) { x.fillStyle = '#fff7ee'; x.fillRect(0, 0, 740, 110); x.fillStyle = '#2a0f2e'; x.font = '600 28px "Geist Mono"'; x.fillText('SEARCH THE ACCOUNT: "bored billionaires"', 28, 66); })); Mv.q.position.z = .2; Mv.sb.add(Mv.q);
  Mv.zero = B.plane(3.2, .8, B.tcv(400, 100, function (x) { x.fillStyle = '#e03131'; x.fillRect(0, 0, 400, 100); x.fillStyle = '#fff7ee'; x.font = '900 52px Unbounded'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('0 RESULTS', 200, 54); })); Mv.zero.position.set(2.0, 0, .24); Mv.sb.add(Mv.zero);
  Mv.src = e.lab('LEAD STORIES · "NEVER POSTED" · 3 NOV 2026', K.GREEN, .42); Mv.src.position.set(0, 7.9, .4); gM.add(Mv.src);
  Mv.tl = [['22 OCT', 'AAM X USER KA\nMAZAAK', K.GOLD, -4.0], ['1 NOV', 'FACEBOOK\nPOST', K.CORAL, 0], ['3 NOV', 'LEAD STORIES:\nNEVER POSTED', K.GREEN, 4.0]].map(function (a) { var m = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .25, 32), M(a[2])); m.position.set(a[3], .15, 10); gM.add(m); var l = e.lab(a[0] + '\n' + a[1], a[2], .62, { fs: 36 }); l.position.set(a[3], 1.7, 10); gM.add(l); return { m: m, l: l }; });
  var line = new THREE.Mesh(new THREE.BoxGeometry(9, .06, .12), M(K.PLUM)); line.position.set(0, .2, 10); gM.add(line); })();
SCN[2] = function (t) { var g = gM; g.visible = true; B.bgc(.012); var tS = WS('r1', 'tweet|ट्वीट|ट्वीट|ट्विट', .8), tQ = S0('r2') + .3, tZ = tQ + 1.6, tT = SP('r2', .55);
  put(Mv.slab, t, SC[2], .5); B.slam(Mv.stamp, clamp((t - tS) / .9), 3, -1.0, 1); Mv.stamp.position.y = Mv.stamp.visible ? Mv.stamp.position.y : -1; Mv.stamp.position.z = .45;
  put(Mv.sb, t, tQ, .5); Mv.zero.visible = t > tZ; Mv.zero.scale.setScalar(.7 + .3 * eo3((t - tZ) * 3)); put(Mv.src, t, tZ + .3, .4);
  Mv.tl.forEach(function (a, i) { put(a.m, t, tT + i * .8, .3); put(a.l, t, tT + i * .8 + .1, .4); }); };
e.shot(2, 'whip-tilt to the slab', SC[2], SC[2] + 1.2, [.8, 12, 17], [0, 3, 1.5], 46, [.8, 5.6, 14.5], [0, 3.6, 1.5], 46, 'io');
e.shot(2, 'push to the search bar', S0('r2') - .2, S0('r2') + 1.6, [.8, 5.6, 14.5], [0, 3.6, 1.5], 46, [.4, 3.8, 11.8], [0, 2.8, 3], 46, 'io');
e.shot(2, 'pull to the timeline', SP('r2', .45), S1('r2') + .2, [.4, 3.8, 11.8], [0, 2.8, 3], 46, [.5, 5.0, 19], [0, 1.4, 6.5], 46, 'io');
/* ===== scene 3: tech lens 1 - the verification conveyor ===== */
var gT = grp(new THREE.Group()), T = {};
(function () { B.floor(gT, 0, 70); var bt = B.tcv(512, 64, function (x) { x.fillStyle = '#2a0f2e'; x.fillRect(0, 0, 512, 64); x.fillStyle = '#6b3a63'; for (var i = 0; i < 8; i++) x.fillRect(i * 64 + 8, 28, 36, 8); }), tx = e.canvasTex(bt); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(5, 1); T.tx = tx;
  var belt = new THREE.Mesh(new THREE.BoxGeometry(24, .4, 3.2), [M(K.PLUM), M(K.PLUM), new THREE.MeshStandardMaterial({ map: tx, roughness: .6 }), M(K.PLUM), M(K.PLUM), M(K.PLUM)]); belt.position.set(0, .3, 0); gT.add(belt);
  /* stations */
  T.scan = new THREE.Group(); T.scan.position.set(-6, 0, 0); [-1.8, 1.8].forEach(function (z) { var p = new THREE.Mesh(new THREE.BoxGeometry(.35, 3.2, .35), M(0xfff0e6, { roughness: .4 })); p.position.set(0, 1.9, z); T.scan.add(p); }); var top = new THREE.Mesh(new THREE.BoxGeometry(.5, .35, 4), M(0xfff0e6)); top.position.y = 3.5; T.scan.add(top);
  T.beam = new THREE.Mesh(new THREE.BoxGeometry(.06, .05, 3.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(2.4) })); T.beam.position.set(0, 1, 0); T.scan.add(T.beam); gT.add(T.scan);
  T.db = new THREE.Group(); T.db.position.set(-.5, 0, 0); for (var i = 0; i < 3; i++) { var d = new THREE.Mesh(new THREE.CylinderGeometry(.7, .7, .45, 32), GM()); d.position.set(0, .7 + i * .55, -2.4); T.db.add(d); } T.gate = new THREE.Mesh(new THREE.TorusGeometry(1.5, .1, 10, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.6), transparent: true, opacity: .7 })); T.gate.position.set(0, 1.9, 0); T.gate.rotation.y = Math.PI / 2; T.db.add(T.gate); gT.add(T.db);
  T.hu = B.voxel(false, K.CORAL); T.hu.position.set(4.6, .5, -2.9); T.hu.scale.setScalar(.9); T.hu.rotation.y = -.5; gT.add(T.hu); var cb = new THREE.Mesh(new THREE.BoxGeometry(.7, .9, .08), M(K.CREAM)); cb.position.set(.5, 1.35, .45); T.hu.add(cb);
  T.biller = new THREE.Group(); T.biller.position.set(10, 0, -.4); var bb = new THREE.Mesh(new THREE.BoxGeometry(3, 3.2, 2.4), M(K.GREEN)); bb.position.y = 1.6; T.biller.add(bb); var rf = new THREE.Mesh(new THREE.BoxGeometry(3.4, .35, 2.8), M(K.PLUM)); rf.position.y = 3.4; T.biller.add(rf); gT.add(T.biller);
  T.real = B.card('ELECTRICITY', '₹4,820', 'BILL #1'); T.real.scale.setScalar(.6); gT.add(T.real); T.fake = B.card('ELECTRICITY', '₹4,820', 'BILL #2', { paper: 0xffd6d6 }); T.fake.scale.setScalar(.6); gT.add(T.fake); T.x = B.stamp('FAKE', '#e03131', 1.9, .65, 120); T.x.position.set(0, 0, .1); T.fake.add(T.x);
  T.venmo = B.card('VENMO LINK', '$ ???', 'NOT ALLOWED', { paper: 0xe8e1ff }); T.venmo.scale.setScalar(.6); gT.add(T.venmo); T.vx = B.stamp('NO', '#e03131', 1.1, .65, 120); T.vx.position.set(0, 0, .1); T.venmo.add(T.vx);
  T.pay = B.stamp('PAID', '#2fb872', 1.9, .65, 120); T.pay.position.set(.2, -.3, .1); T.real.add(T.pay);
  T.l = [['1 · BILL READ', K.CORAL, -6], ['2 · BILLER MATCH', K.GOLD, -.5], ['3 · HUMAN CHECK', K.CORAL, 4.6], ['4 · BILLER PAID', K.GREEN, 10]].map(function (a, i) { var l = e.lab(a[0], a[1], .52, { fs: 40 }); l.position.set(a[2], 5.2, 0); gT.add(l); return l; });
  T.cap = e.lab('PAYS THE BILLER, NOT YOU', K.GREEN, .5, { fs: 40 }); T.cap.position.set(10, 6.1, 0); gT.add(T.cap); })();
SCN[3] = function (t) { var g = gT; g.visible = true; B.bgc(.008); var t0 = SC[3] + .2, L = S1('t1') - SC[3], v = 12 / (L * .5);
  T.tx.offset.x = -(t - SC[3]) * .35;
  var xr = -12 + (t - t0) * v * 1.0; T.real.position.set(Math.min(xr, 9), .85, 0); T.real.visible = t > t0; T.real.rotation.z = 0; T.pay.visible = xr > 8.2; T.pay.scale.setScalar(.8 + .2 * eo3((xr - 8.2)));
  var tf = t0 + 1.4, xf = -12 + (t - tf) * v; T.fake.visible = t > tf; var ej = clamp((xf + .5) / 2.2); if (xf < -.5) T.fake.position.set(xf, .85, 0), T.fake.rotation.set(0, 0, 0); else T.fake.position.set(-.5 + ej * 3, .85 + 3.5 * ej - 3 * ej * ej * 1.3, ej * 9), T.fake.rotation.set(ej * 3, 0, ej * 5);
  T.x.visible = xf > -1.5; T.gate.material.opacity = .45 + .5 * (xf > -2 && xf < 0 ? 1 : 0);
  var tv = SC[3] + L * .72, xv = 6 + (t - tv) * 5; T.venmo.visible = t > tv; var kv = clamp((t - tv - .6) / .8); T.venmo.position.set(Math.min(xv, 8.5) + kv * 2, .85 + kv * 2.5 * (1 - kv) * 2, -kv * 6); T.venmo.rotation.set(0, 0, kv * 4); T.vx.visible = t > tv + .5;
  T.beam.position.z = 1.5 * Math.sin(t * 5); T.hu.userData.head.rotation.y = .3 * Math.sin(t * 1.4); T.hu.userData.armR.rotation.x = -.4 + .3 * Math.sin(t * 4);
  T.l.forEach(function (l, i) { put(l, t, SC[3] + .2 + i * L * .17, .4); }); put(T.cap, t, SC[3] + L * .55, .4); };
e.shot(3, 'follow the belt', SC[3], S1('t1') + .2, [-8.6, 6.4, 11.5], [-5.4, 1.8, 0], 46, [13.4, 6.4, 11.5], [9.2, 1.8, 0], 46, 'io');
/* ===== scene 4: tech lens 2 - double swipe + privacy ===== */
var gD = grp(new THREE.Group()), D = {};
(function () { B.floor(gD, 0, 60); D.ped = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 2.2, 40), e.physMat(0xfff0e6, { roughness: .4 })); D.ped.position.set(0, 1.1, 0); gD.add(D.ped);
  D.card = B.card('ELECTRICITY', '₹4,820', 'ONE BILL'); D.card.position.set(0, 3.4, 0); gD.add(D.card); D.hold = new THREE.Mesh(new THREE.TorusGeometry(2.0, .1, 12, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.8) })); D.hold.position.set(0, 3.4, 0); gD.add(D.hold);
  D.v1 = B.voxel(); D.v1.position.set(-3.6, 0, 0); D.v1.rotation.y = Math.PI / 2; D.v1.scale.setScalar(1.1); gD.add(D.v1); D.v2 = B.voxel(true, K.CORAL); D.v2.position.set(3.6, 0, 0); D.v2.rotation.y = -Math.PI / 2; D.v2.scale.setScalar(1.1); gD.add(D.v2);
  D.dbl = B.stamp('DOUBLE\nPAY ✕', '#e03131', 3.0, 1.05, 96); D.dbl.position.set(2.2, 6.0, 1.2); gD.add(D.dbl);
  D.l1 = e.lab('ONE BILL · ONE HOLD', K.GOLD, .55); D.l1.position.set(0, 7.0, 0); gD.add(D.l1); D.l2 = e.lab('2ND SWIPE BOUNCES', K.RED, .5); D.l2.position.set(2.2, 8.2, 0); gD.add(D.l2);
  D.priv = new THREE.Group(); D.pc = B.card('NAME  A. SAMPLE', '', '14 SAMPLE ROAD', { subcol: '#2a0f2e' }); D.pc.userData.face.material.map = e.canvasTex(B.tcv(520, 340, function (x, w, h) { x.fillStyle = '#fff7ee'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2a0f2e'; x.lineWidth = 8; x.strokeRect(6, 6, w - 12, h - 12); x.fillStyle = '#2a0f2e'; x.font = '600 28px "Geist Mono"'; x.fillText('ELECTRICITY BILL', 34, 62); x.font = '600 32px "Geist Mono"'; x.fillText('NAME   A. SAMPLE', 34, 130); x.fillText('ADDR   14 SAMPLE ROAD', 34, 190); x.fillText('A/C    ••••4821', 34, 250); x.font = '900 34px Unbounded'; x.fillText('₹4,820', 34, 316); })); D.pc.scale.setScalar(1.35); D.pc.position.set(0, 4.6, 0); D.priv.add(D.pc);
  D.bars = [130, 190, 250].map(function (yy, i) { var b = new THREE.Mesh(new THREE.BoxGeometry(2.2, .22, .06), M(K.PLUM)); b.position.set(.3, (172 - yy) / 340 * 1.62 + 0.0, .1); D.pc.add(b); return b; });
  D.lens = new THREE.Mesh(new THREE.TorusGeometry(1.0, .09, 12, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.RED).multiplyScalar(1.8) })); D.priv.add(D.lens);
  D.insta = e.lab('PUBLIC DECK = GHAR KA PATA ONLINE', K.RED, .55, { fs: 42 }); D.insta.position.set(0, 8.4, 0); D.priv.add(D.insta); D.fl = e.lab('ILLUSTRATIVE SAMPLE · NOT A REAL BILL', K.GOLD, .4, { fs: 34 }); D.fl.position.set(0, 1.4, 1.2); D.priv.add(D.fl); gD.add(D.priv); })();
SCN[4] = function (t) { var g = gD, L = S1('t2') - SC[4], tS = SC[4] + L * .5; g.visible = true; B.bgc(.012);
  var first = t < tS; [D.ped, D.card, D.hold, D.v1, D.v2, D.dbl, D.l1, D.l2].forEach(function (o) { o.visible = first; }); D.priv.visible = !first;
  if (first) { var lu = sw(SC[4] + .6, SC[4] + 1.4, t), bk = clamp((t - SC[4] - 1.4) / .8); D.v1.position.x = -3.6 + 1.8 * lu; D.v2.position.x = 3.6 - 1.8 * lu + (bk > 0 ? .9 * eo3(bk) : 0); D.v1.userData.armR.rotation.x = -1.2 * lu; D.v2.userData.armR.rotation.x = -1.2 * lu * (1 - bk);
    D.hold.visible = t > SC[4] + 1.1; D.hold.rotation.set(Math.PI / 2 + .3 * Math.sin(t * 2), 0, t * 1.4); D.card.rotation.y = .2 * Math.sin(t * 1.3); B.slam(D.dbl, clamp((t - SC[4] - 1.6) / .9), 8, 6.2, 1); D.dbl.position.x = 2.2; D.dbl.position.z = 1.2; put(D.l1, t, SC[4] + 1.15, .4); put(D.l2, t, SC[4] + 1.9, .4); }
  else { var lt = t - tS; D.pc.rotation.y = -.25 + .25 * sw(tS, tS + 1, t); D.lens.position.set(-1.6 + 3.2 * ((lt * .5) % 1), 4.6 + .35 * Math.sin(lt * 3), .6); D.lens.rotation.x = 0; D.bars.forEach(function (b, i) { b.visible = lt > L * .3 + i * .3; b.scale.x = eo3((lt - L * .3 - i * .3) * 3) + .001; }); put(D.insta, t, tS + .3, .4); put(D.fl, t, tS + .5, .4); } };
e.shot(4, 'locked wide on the lunge', SC[4], SC[4] + L4(), [0, 5.4, 14.5], [0, 3.6, 0], 46, [0, 5.4, 14.5], [0, 3.6, 0], 46, 'io');
function L4() { return (S1('t2') - SC[4]) * .5 - .1; }
e.shot(4, 'dolly in on the card', SC[4] + L4() + .2, S1('t2') + .2, [0, 5.4, 14.5], [0, 3.6, 0], 46, [.2, 5.6, 12.5], [0, 4.5, 0], 44, 'io');
/* ===== scene 5: scale - 3,428 billionaires ===== */
var gC = grp(new THREE.Group()), C5 = {};
(function () { B.floor(gC, 0, 120); var cols = 60, N = 3428; C5.N = N; C5.cols = cols; C5.im = [[K.PLUM, .5, 1.2, .5, .6], [K.SKIN, .45, .45, .45, 1.65], [K.GOLD, .5, .3, .5, 1.95]].map(function (m) { var im = new THREE.InstancedMesh(new THREE.BoxGeometry(m[1], m[2], m[3]), m[0] === K.GOLD ? GM() : M(m[0], { roughness: .65 }), N); im.frustumCulled = false; im.userData.y = m[4]; gC.add(im); return im; });
  var cw = B.tcv(512, 320, function (x) { x.fillStyle = '#ffc4b8'; x.fillRect(0, 0, 512, 320); for (var j = 0; j < 10; j++) for (var i = 0; i < 16; i++) { x.fillStyle = '#fff7ee'; x.fillRect(i * 32 + 2, j * 32 + 2, 28, 28); x.fillStyle = '#e03131'; x.fillRect(i * 32 + 5, j * 32 + 5, 22, 5); x.fillStyle = '#2a0f2e'; x.fillRect(i * 32 + 5, j * 32 + 14, 14, 3); x.fillRect(i * 32 + 5, j * 32 + 20, 18, 3); } }), wt = e.canvasTex(cw); var wall = new THREE.Mesh(new THREE.BoxGeometry(60, 40, 3), new THREE.MeshStandardMaterial({ map: wt, roughness: .6 })); wall.position.set(0, 20, -52); gC.add(wall);
  C5.fg = B.voxel(); C5.fg.position.set(0, 0, 15); C5.fg.scale.setScalar(1.6); gC.add(C5.fg);
  C5.c1 = e.dyn(.8, 760, 170, K.GOLD, function (x, a) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('FORBES 2026 · BILLIONAIRES', 32, 54); x.font = '900 70px Unbounded'; x.fillText(fmt(a), 32, 138); }); C5.c1.position.set(0, 9.5, 14); gC.add(C5.c1);
  C5.c2 = e.dyn(.95, 880, 220, K.RED, function (x, a, b) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('14 M WITH MEDICAL DEBT OVER $1,000 ÷ 3,428', 32, 52); x.font = '900 60px Unbounded'; x.fillText('≈ ' + fmt(a) + ' BILLS EACH', 32, 130); x.fillStyle = '#e03131'; x.font = '600 22px "Geist Mono"'; x.fillText('ROUGH · NOT TO SCALE · KFF VIA THE GUARDIAN', 32, 186); }); C5.c2.position.set(0, 3.8, 20); gC.add(C5.c2); })();
SCN[5] = function (t) { var g = gC; g.visible = true; B.bgc(.006); var lt = t - SC[5], L = S1('t3') - SC[5], dm = new THREE.Matrix4(), N = C5.N, cols = C5.cols;
  var wave = sw(SC[5] + L * .45, SC[5] + L * .85, t);
  C5.im.forEach(function (im) { for (var i = 0; i < N; i++) { var cx = (i % cols - cols / 2) * .95 + (hash(i) - .5) * .25, cz = (Math.floor(i / cols) - 30) * .95 + (hash(i + 7) - .5) * .25, bob = .09 * Math.sin(t * 3 + hash(i + 2) * 6.28) + wave * .35 * Math.max(0, Math.sin(t * 5 - cz * .35)); dm.makeTranslation(cx, im.userData.y + bob, cz); im.setMatrixAt(i, dm); } im.instanceMatrix.needsUpdate = true; });
  C5.fg.userData.head.rotation.y = .4 * Math.sin(t * 1.2); put(C5.fg, t, SC[5], .2); C5.c1.visible = true; C5.c1.draw(3428 * sw(SC[5] + .4, SC[5] + 1.8, t)); put(C5.c1, t, SC[5] + .3, .3);
  C5.c2.draw(4084 * sw(SC[5] + L * .5, SC[5] + L * .5 + 1.6, t)); put(C5.c2, t, SC[5] + L * .45, .4); };
e.shot(5, 'low look at one', SC[5], SC[5] + 1.6, [1.5, 3.2, 21], [0, 2.6, 15], 44, [1.5, 3.2, 21], [0, 2.6, 15], 44, 'io');
e.shot(5, 'crane up to the crowd', SC[5] + 1.6, SP('t3', .6), [1.5, 3.2, 21], [0, 2.6, 15], 44, [0, 15, 31], [0, .5, -4], 46, 'io');
})();
/* Part B2 (billionaire): scenes 6-11 (fees + tax gates, two paise ruler, 1.1% slice, judgement deck, funding lens, back to the phone) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS, SC = window.SC, grp = window.grp, fmt = window.fmt, sw = window.sw, SCN = window.SCN;
/* ===== scene 6: fee ladder + two tax gates ===== */
var gF = grp(new THREE.Group()), F = {};
(function () { B.floor(gF, 0, 80);
  F.st = []; for (var i = 0; i < 10; i++) { var b = new THREE.Mesh(new THREE.BoxGeometry(.7, .5 * (i + 1), 1.6), GM()); b.position.set(-9 + i * .78, .25 * (i + 1), 0); gF.add(b); F.st.push(b); }
  F.pct = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.6), M(K.CORAL)); F.pct.position.set(-1.0, 5.6, 0); F.pct.userData.y = 5.6; gF.add(F.pct);
  F.l1 = e.lab('£1 FLAT', K.GOLD, .5, { fs: 40 }); F.l1.position.set(-8.5, 2.2, 1.2); gF.add(F.l1); F.l2 = e.lab('UP TO £10', K.GOLD, .5, { fs: 40 }); F.l2.position.set(-3.6, 6.4, 1.2); gF.add(F.l2); F.l3 = e.lab('THEN 10% ON TOP\n(ONLYBILLS, PER THEIR SITE)', K.CORAL, .72, { fs: 36 }); F.l3.position.set(-3.4, 8.1, 1.4); gF.add(F.l3);
  function gate(x, col, z) { var g = new THREE.Group(); g.position.set(x, 0, z); [-1.2, 1.2].forEach(function (zz) { var p = new THREE.Mesh(new THREE.BoxGeometry(.5, 4.2, .5), M(0xfff0e6, { roughness: .4 })); p.position.set(0, 2.1, zz); g.add(p); }); var tp = new THREE.Mesh(new THREE.BoxGeometry(.7, .6, 3.0), M(col)); tp.position.y = 4.5; g.add(tp); gF.add(g); return g; }
  F.gUS = gate(6, K.GREEN, 0); F.gIN = gate(14, K.RED, 0);
  var gl = e.lab('US · $19,000 / YR / PERSON\n(GIFT-TAX EXCLUSION, 2026)', K.GREEN, .78, { fs: 34 }); gl.position.set(6, 6.9, 0); gF.add(gl); F.l4 = gl; var gi = e.lab('INDIA · ₹50,000+ FROM NON-RELATIVES\nTAXED ON RECEIVER · OUR READING, ASK A CA', K.RED, .82, { fs: 30 }); gi.position.set(14, 7.0, 0); gF.add(gi); F.l5 = gi;
  var lane = new THREE.Mesh(new THREE.BoxGeometry(22, .2, 1.8), M(K.PLUM)); lane.position.set(9, .1, 0); gF.add(lane); F.coins = B.coin(24); gF.add(F.coins); F.bite = B.coin(24); F.bite.material = e.physMat(K.RED, { metalness: .2, roughness: .5 }); gF.add(F.bite);
  F.slip = B.card('TAX SLIP', 'YOU', 'FOR A GIFT YOU DID NOT ASK FOR', { subcol: '#e03131' }); F.slip.position.set(17.4, 1.4, 1.5); F.slip.scale.setScalar(.7); gF.add(F.slip); F.l6 = e.lab('BILLIONAIRE KA DAAN,\nAAPKI TAX SLIP', K.RED, .74, { fs: 38 }); F.l6.position.set(17.2, 5.2, 0); gF.add(F.l6); })();
SCN[6] = function (t) { var g = gF; g.visible = true; B.bgc(.006); var tl = SC[6], t2 = S0('f1b');
  F.st.forEach(function (b, i) { var u = clamp((t - tl - .3 - i * .18) / .3); b.visible = u > 0; b.scale.y = Math.max(.01, eo3(u)); b.position.y = .25 * (i + 1) * eo3(u); }); var up = clamp((t - tl - 2.4) / .6); F.pct.visible = up > 0; F.pct.position.y = 5.6 + lerp(6, 0, eo3(up));
  put(F.l1, t, tl + .5, .4); put(F.l2, t, tl + 2.3, .4); put(F.l3, t, tl + 2.9, .4);
  put(F.l4, t, t2 + .4, .4); put(F.l5, t, t2 + 1.8, .4); put(F.l6, t, SP('f1b', .72), .4);
  for (var i = 0; i < 24; i++) { var lane = i % 2, ph = ((t - t2 - .3) * 2.6 - i * .9), x = -1 + ph, ok = ph > 0 && x < 21, y = 1.3 + .12 * Math.sin(t * 4 + i);  B.setI(F.coins, i, ok && lane === 0 ? x : -50, y, 0, 0, 0, Math.PI / 2, 1); var bx = lane === 1 && x > 24 ? 1 : 0; B.setI(F.coins, i, ok ? x : -50, 1.0 + .08 * Math.sin(t * 4 + i), 0, 0, 0, Math.PI / 2, lane === 1 && x > 14 ? 1.1 : 1.6);
    var fall = clamp((x - 14) / 2.5); B.setI(F.bite, i, lane === 1 && ok && x > 14 ? 14.5 + fall * 2 : -50, lane === 1 ? Math.max(.4, 4.3 - fall * fall * 4) : -50, 1.3, 0, 0, Math.PI / 2, .6); } F.coins.instanceMatrix.needsUpdate = true; F.bite.instanceMatrix.needsUpdate = true;
  F.slip.visible = t > SP('f1b', .72); F.slip.position.y = 1.4 + .2 * Math.sin(t * 2.4); F.slip.scale.setScalar(.7 * eo3((t - SP('f1b', .72)) * 3) + .001); };
e.shot(6, 'locked on the ladder', tlz(), SC[6] + 3.6, [-5, 6.8, 14.5], [-5, 3.2, 0], 46, [-5, 6.8, 14.5], [-5, 3.2, 0], 46, 'io');
function tlz() { return SC[6]; }
e.shot(6, 'truck to the gates', SC[6] + 3.8, S0('f1b') + 2.6, [-5, 6.8, 14.5], [-5, 3.2, 0], 46, [6.8, 6.0, 14.5], [6.8, 3.0, 0], 46, 'io');
e.shot(6, 'truck to the tax slip', S0('f1b') + 2.8, S1('f1b') + .3, [6.8, 6.0, 14.5], [6.8, 3.0, 0], 46, [14.8, 5.8, 14.5], [14.8, 3.0, 0], 46, 'io');
/* ===== scene 7: the two-paise ruler (log scale) ===== */
var gR = grp(new THREE.Group()), R7 = {};
(function () { B.floor(gR, 0, 70); var H = 11.4; var rod = new THREE.Mesh(new THREE.BoxGeometry(.4, H, .4), M(K.PLUM)); rod.position.set(0, H / 2, 0); gR.add(rod);
  R7.tk = [['$1', 0], ['$1,000', 3], ['$1 MILLION', 6], ['$1 BILLION', 9]].map(function (a) { var y = a[1] * .9, tkm = new THREE.Mesh(new THREE.BoxGeometry(1.6, .14, .3), M(K.PLUM)); tkm.position.set(0, y, 0); gR.add(tkm); var l = e.lab(a[0], K.PLUM, .62, { fs: 40, bgc: 'rgba(255,247,238,.95)' }); l.position.set(2.4, y, 0); gR.add(l); return l; });
  var y1 = Math.log10(1500) * .9, y2 = Math.log10(839e9) * .9; R7.y1 = y1; R7.y2 = y2; R7.rent = B.card('YOUR RENT', '$1,500', 'LOG SCALE', { subcol: '#2a0f2e' }); R7.rent.scale.setScalar(1.0); R7.rent.position.set(-2.4, y1, 0); gR.add(R7.rent);
  R7.top = B.voxel(); R7.top.scale.setScalar(1.3); R7.top.position.set(-2.2, y2 - 2.6, 0); gR.add(R7.top); R7.tl = e.lab('TOP FORBES · ≈ $839 B', K.GOLD, .5, { fs: 40 }); R7.tl.position.set(0, y2 + 1.8, 0); gR.add(R7.tl);
  R7.br = new THREE.Mesh(new THREE.BoxGeometry(.18, 1, .18), M(K.RED)); R7.br.position.set(.7, 0, 0); gR.add(R7.br); R7.div = e.dyn(.74, 700, 150, K.RED, function (x) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('RENT ÷ TOP FORBES NET WORTH', 30, 50); x.font = '900 58px Unbounded'; x.fillText('1 ÷ 559 M', 30, 118); }); R7.div.position.set(1.4, (y1 + y2) / 2, 1); gR.add(R7.div);
  R7.two = e.dyn(1.0, 900, 260, K.GOLD, function (x, a) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('FOR SOMEONE WORTH ₹1 CRORE', 32, 54); x.font = '900 52px Unbounded'; x.fillText('SAME SHARE =', 32, 124); x.fillStyle = '#e03131'; x.font = '900 82px Unbounded'; x.fillText('≈ ' + (1.8 * a).toFixed(1) + ' PAISE', 32, 214); }); R7.two.position.set(0, 5.4, 4); gR.add(R7.two);
  R7.dot = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .02, 12), GM()); R7.dot.position.set(-1.0, .05, 3.2); gR.add(R7.dot); R7.dl = e.lab('2 PAISE', K.RED, .42, { fs: 34 }); R7.dl.position.set(-1.0, 1.2, 3.2); gR.add(R7.dl); })();
SCN[7] = function (t) { var g = gR; g.visible = true; B.bgc(.006); var L = S1('f2') - SC[7], ta = SC[7] + .4, tb = SC[7] + L * .38, tc = SC[7] + L * .66;
  R7.tk.forEach(function (l, i) { put(l, t, ta + i * .25, .35); }); put(R7.rent, t, ta + .5, .4); put(R7.top, t, tb - .6, .4); put(R7.tl, t, tb - .4, .4);
  var u = clamp((t - tb) / .9); R7.br.visible = u > 0; R7.br.scale.y = Math.max(.01, (R7.y2 - R7.y1) * eo3(u)); R7.br.position.y = R7.y1 + (R7.y2 - R7.y1) * eo3(u) / 2 * 1.0; R7.br.scale.set(1, Math.max(.01, (R7.y2 - R7.y1) * eo3(u)), 1); R7.br.position.y = R7.y1;
  put(R7.div, t, tb + .8, .4); R7.top.userData.head.rotation.y = .5 * Math.sin(t * 1.3);
  R7.two.draw(sw(tc, tc + 1.4, t)); put(R7.two, t, tc, .4); R7.dot.visible = t > tc + 1.2; put(R7.dl, t, tc + 1.4, .35); };
e.shot(7, 'pedestal up the ruler', SC[7], SC[7] + (S1('f2') - SC[7]) * .62, [.5, 2.6, 15], [0, 3.0, 0], 46, [.5, 8.6, 16], [0, 8.0, 0], 46, 'io');
e.shot(7, 'drop to the dot', SC[7] + (S1('f2') - SC[7]) * .64, S1('f2') + .2, [.5, 8.6, 16], [0, 8.0, 0], 46, [.5, 4.2, 14], [0, 3.0, 2], 44, 'io');
/* ===== scene 8: the 1.1% slice + the missing plumbing ===== */
var gP = grp(new THREE.Group()), P8 = {};
(function () { B.floor(gP, 0, 70); var th = .069; P8.main = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, .9, 96, 1, false, th, Math.PI * 2 - th), GM()); P8.main.position.set(0, .45, 0); gP.add(P8.main);
  P8.wd = new THREE.Group(); var wedge = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, .9, 24, 1, false, 0, th), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.RED).multiplyScalar(2.0) })); wedge.position.y = .45; P8.wd.add(wedge); gP.add(P8.wd);
  P8.zoom = new THREE.Group(); var zw = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, .9, 24, 1, false, 0, th), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.RED).multiplyScalar(2.0) })); zw.scale.set(1, 1, 1); zw.position.y = .45; P8.zoom.add(zw); P8.zoom.scale.set(3, 1.2, 3); gP.add(P8.zoom);
  P8.pile = new THREE.Group(); for (var i = 0; i < 14; i++) { var c = B.card('MEDICAL', '₹' + (10 + i * 3) + ',000', '', {}); c.scale.setScalar(.5); c.position.set(-7.5 + (hash(i) - .5) * 2, .1 + i * .06, 5 + (hash(i + 3) - .5) * 1.4); c.rotation.set(-Math.PI / 2, 0, hash(i + 1) * 3); P8.pile.add(c); } gP.add(P8.pile);
  var pm = M(0x6b3a63, { metalness: .3, roughness: .4 }); P8.p1 = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, 3.2, 16), pm); P8.p1.rotation.z = Math.PI / 2; P8.p1.position.set(-5.6, .7, 2.2); gP.add(P8.p1); P8.p2 = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, 1.6, 16), pm); P8.p2.rotation.x = Math.PI / 2; P8.p2.position.set(-7.4, .7, 3.6); gP.add(P8.p2);
  P8.gap = new THREE.Mesh(new THREE.TorusGeometry(.42, .06, 10, 28), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.RED).multiplyScalar(2.4) })); P8.gap.position.set(-7.4, .7, 2.5); gP.add(P8.gap);
  P8.c1 = e.dyn(.78, 860, 180, K.GOLD, function (x, a) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('US MEDICAL DEBT ≥ $220 B  vs  BILLIONAIRES ≈ $20.1 T', 28, 50); x.font = '900 66px Unbounded'; x.fillText('≈ ' + (1.1 * a).toFixed(1) + '%', 28, 134); x.fillStyle = '#e03131'; x.font = '600 22px "Geist Mono"'; x.fillText('KFF / GUARDIAN · FORBES 2026 · OUR ARITHMETIC', 28, 168); }); P8.c1.position.set(0, 6.4, 0); gP.add(P8.c1);
  P8.l = e.lab('PAISA KAM NAHI · PLUMBING KAM HAI', K.CORAL, .56, { fs: 38 }); P8.l.position.set(-7, 3.8, 3.2); gP.add(P8.l); P8.l2 = e.lab('1.1% SLICE', K.RED, .5, { fs: 40 }); P8.l2.position.set(4.6, 2.6, 4.6); gP.add(P8.l2); })();
SCN[8] = function (t) { var g = gP; g.visible = true; B.bgc(.008); var L = S1('f3') - SC[8], pull = sw(SC[8] + .5, SC[8] + 1.6, t), a = -.55, ca = Math.cos(a), sa = Math.sin(a);
  P8.main.rotation.y = 0; P8.wd.rotation.y = 0; P8.wd.position.set(Math.sin(th2() + 0) * pull * 2.2, 0, Math.cos(th2()) * pull * 2.2); P8.zoom.visible = pull > .2; P8.zoom.position.set(Math.sin(th2()) * (2.2 + 6 * pull), 1.0 * pull, Math.cos(th2()) * (2.2 + 6 * pull)); P8.zoom.scale.set(3 * pull + .01, 1.2, 3 * pull + .01);
  P8.c1.draw(sw(SC[8] + 1.0, SC[8] + 2.4, t)); put(P8.c1, t, SC[8] + 1.0, .4); put(P8.l2, t, SC[8] + 1.2, .35); put(P8.l, t, SC[8] + L * .55, .4); P8.gap.rotation.y = t * 2; P8.pile.visible = t > SC[8] + L * .45; P8.p1.visible = P8.p2.visible = P8.gap.visible = t > SC[8] + L * .45; };
function th2() { return .0345; }
e.shot(8, 'orbit the coin', SC[8], S1('f3') + .1, [-8, 11, 19], [0, 1.6, 1.5], 46, [8, 10.5, 19], [0, 1.6, 1.5], 46, 'io');
/* ===== scene 9: the judgement deck (left swipe = someone's rent) ===== */
var gJ = grp(new THREE.Group()), J = {};
(function () { B.floor(gJ, 0, 70); J.cards = [['RENT', '₹18,000'], ['MEDICAL', '₹92,000'], ['SCHOOL FEE', '₹40,000'], ['WATER', '₹3,100']].map(function (a, i) { var c = B.card(a[0] + ' · ILLUSTRATIVE', a[1], 'DUE THIS MONTH', {}); c.scale.setScalar(1.15); gJ.add(c); c.userData.x = B.stamp('NEXT', '#e03131', 2.1, .8, 120); c.userData.x.position.set(0, -.25, .12); c.add(c.userData.x); return c; });
  J.vox = B.voxel(); J.vox.position.set(3.4, 0, 1.4); J.vox.rotation.y = -.7; J.vox.scale.setScalar(1.15); gJ.add(J.vox);
  J.dial = new THREE.Group(); J.dial.position.set(-3.0, 5.3, -1); var face = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48, 0, Math.PI), M(K.CREAM)); J.dial.add(face); J.nd = new THREE.Mesh(new THREE.BoxGeometry(.12, 2.0, .1), M(K.RED)); J.nd.geometry.translate(0, 1.0, 0); J.dial.add(J.nd); var hub = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), M(K.PLUM)); J.dial.add(hub); gJ.add(J.dial);
  J.dl = e.lab('BILLIONAIRE KA MOOD', K.GOLD, .5, { fs: 38 }); J.dl.position.set(-3.0, 9.6, 0); gJ.add(J.dl); J.l2 = e.lab('SWIPE LEFT = KISI KA KIRAYA "NEXT"', K.RED, .56, { fs: 38 }); J.l2.position.set(0, 7.2, 1); gJ.add(J.l2); })();
SCN[9] = function (t) { var g = gJ; g.visible = true; B.bgc(.01); var L = S1('m1') - SC[9], ts = [SC[9] + L * .38, SC[9] + L * .6, SC[9] + L * .8];
  J.cards.forEach(function (c, i) { var tt = ts[i], u = tt == null ? 0 : clamp((t - tt) / .8), depth = i - (t > ts[0] ? 1 : 0) - (t > ts[1] ? 1 : 0) - (t > ts[2] ? 1 : 0); c.visible = u < 1.0; var x = -9 * eo3(u), y = 3.6 - Math.max(depth, 0) * .05 + 1.6 * u * (1 - u) * 0 - 3.2 * ei3(u) * .0, z = Math.max(depth, 0) * -.22 + 0; c.position.set(x, 3.6 + .02 * i - u * 1.5, z); c.rotation.set(0, 0, 0.0 + u * .9); c.userData.x.visible = u > 0; c.userData.x.scale.setScalar(.8 + .3 * eo3(u * 4)); });
  var mood = Math.sin(t * 1.7) * .8 + Math.sin(t * 4.1) * .3; J.nd.rotation.z = mood; J.vox.userData.head.rotation.z = .12 * Math.sin(t * 1.5); J.vox.userData.armR.rotation.x = -1.1 + .5 * Math.sin(t * 3); put(J.dl, t, SC[9] + .5, .4); put(J.l2, t, SC[9] + L * .3, .4); };
e.shot(9, 'locked over the deck', SC[9], S1('m1') + .2, [0, 8.6, 17], [-.5, 3.4, 0], 46, [0, 8.0, 15.5], [-.5, 3.4, 0], 46, 'io');
/* ===== scene 10: ethics - funding lens over a card heat-map ===== */
var gE = grp(new THREE.Group()), E10 = {};
(function () { B.floor(gE, 0, 70); E10.cs = []; for (var j = 0; j < 5; j++) for (var i = 0; i < 6; i++) { var net = (i < 2 && j < 2) ? 1 : 0, fr = net ? .85 + hash(i + j * 7) * .15 : .1 + hash(i * 5 + j * 11) * .4, c = B.card('', '', '', {}); c.scale.setScalar(.62); c.position.set((i - 2.5) * 1.95, .1, (j - 2) * 1.35); c.rotation.x = -Math.PI / 2; var bar = new THREE.Mesh(new THREE.BoxGeometry(1.5 * fr, .08, .3), M(net ? K.GOLD : K.GREEN)); bar.position.set(-.75 + .75 * fr, .2, .55); c.add(bar); gE.add(c); E10.cs.push({ c: c, net: net, bar: bar, fr: fr }); }
  E10.lens = new THREE.Mesh(new THREE.TorusGeometry(2.0, .12, 14, 64), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.RED).multiplyScalar(1.8) })); E10.lens.rotation.x = Math.PI / 2; E10.lens.position.y = 1.6; gE.add(E10.lens);
  E10.meter = e.dyn(1.0, 880, 250, K.RED, function (x, a) { x.fillStyle = '#2a0f2e'; x.font = '600 26px "Geist Mono"'; x.fillText('AVG MEDICAL CAMPAIGN · % OF TARGET RAISED', 28, 52); x.fillStyle = 'rgba(42,15,46,.15)'; x.fillRect(28, 80, 820, 52); x.fillStyle = '#e03131'; x.fillRect(28, 80, 820 * .4 * a, 52); x.font = '900 60px Unbounded'; x.fillStyle = '#2a0f2e'; x.fillText('≈ ' + Math.round(40 * a) + '%', 28, 206); x.font = '600 22px "Geist Mono"'; x.fillText('KFF HEALTH NEWS 2024 · U. WASHINGTON 2017', 300, 206); }); E10.meter.position.set(0, 6.4, 2.5); gE.add(E10.meter);
  E10.l1 = e.lab('NETWORK + "DESERVING" = FUNDED', K.GOLD, .5, { fs: 38 }); E10.l1.position.set(3.0, 2.4, 3.8); gE.add(E10.l1); E10.l2 = e.lab('SWIPE-ABLE = GAREEBI KA FOR YOU PAGE', K.RED, .56, { fs: 36 }); E10.l2.position.set(0, 3.6, 4.2); gE.add(E10.l2); })();
SCN[10] = function (t) { var g = gE; g.visible = true; B.bgc(.01); var L = S1('e1') - SC[10], lt = t - SC[10]; E10.lens.position.x = -4 + 8 * ((lt / (L * .5)) % 1); E10.lens.position.z = .6 * Math.sin(lt * 1.8);
  E10.cs.forEach(function (o, i) { var u = clamp((lt - .2 - i * .04) / .35); o.c.visible = u > 0; o.c.scale.setScalar(.62 * eo3(u) + .001); var near = Math.abs(o.c.position.x - E10.lens.position.x) < 1.6; o.c.position.y = .1 + (near ? .4 : 0) * 1; o.bar.material.color.set(near ? K.RED : (o.net ? K.GOLD : K.GREEN)); });
  E10.meter.draw(sw(SC[10] + L * .45, SC[10] + L * .45 + 1.8, t)); put(E10.meter, t, SC[10] + L * .4, .4); put(E10.l1, t, SC[10] + L * .22, .4); put(E10.l2, t, SC[10] + L * .8, .4); };
e.shot(10, 'orbit over the heat-map', SC[10], S1('e1') + .2, [-7, 12, 13.5], [0, 1.0, 0], 46, [6, 12, 14], [0, 1.0, 0], 46, 'io');
/* ===== scene 11: the toast - paid directly, then the end card ===== */
var gZ = grp(new THREE.Group()), Z = {};
(function () { B.floor(gZ, 0, 40); var st = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 7.8, .5, 64), e.physMat(0xfff0e6, { roughness: .35, envMapIntensity: .9 })); st.position.y = .25; gZ.add(st);
  var scr = B.tcv(540, 1100, function (x) { var grd = x.createLinearGradient(0, 0, 0, 1100); grd.addColorStop(0, '#2fb872'); grd.addColorStop(1, '#1e8f58'); x.fillStyle = grd; x.fillRect(0, 0, 540, 1100); x.fillStyle = '#fff7ee'; x.font = '900 46px Unbounded'; x.textAlign = 'center'; x.fillText('PAID', 270, 330); x.font = '600 22px "Geist Mono"'; x.fillText('TO THE BILLER · NOT TO YOU', 270, 390); x.font = '900 110px Inter'; x.fillText('✓', 270, 620); });
  Z.ph = B.phone(scr); Z.ph.position.set(-1.8, 3.9, 0); Z.ph.rotation.y = .3; Z.ph.scale.setScalar(.82); gZ.add(Z.ph);
  Z.bld = new THREE.Group(); Z.bld.position.set(5.2, .5, 0); var bb = new THREE.Mesh(new THREE.BoxGeometry(3, 3.4, 2.4), M(K.GREEN)); bb.position.y = 1.7; Z.bld.add(bb); var rf = new THREE.Mesh(new THREE.BoxGeometry(3.4, .35, 2.8), M(K.PLUM)); rf.position.y = 3.6; Z.bld.add(rf); gZ.add(Z.bld);
  Z.card = B.card('ELECTRICITY', '₹4,820', 'PAID DIRECT'); Z.card.scale.setScalar(.8); gZ.add(Z.card); Z.ps = B.stamp('PAID', '#2fb872', 1.7, .6, 120); Z.ps.position.set(.2, -.35, .1); Z.card.add(Z.ps);
  Z.coins = B.coin(30); gZ.add(Z.coins);
  Z.l1 = e.lab('SEEDHA BILLER KO > CASH', K.GREEN, .56, { fs: 40 }); Z.l1.position.set(1.8, 9.2, 0); gZ.add(Z.l1); Z.l2 = e.lab('PROBLEM SWIPE NAHI · DAAN KO CONTENT BANANA', K.CORAL, .5, { fs: 32 }); Z.l2.position.set(1.8, 8.2, 0); gZ.add(Z.l2); })();
SCN[11] = function (t) { var g = gZ; g.visible = true; B.bgc(.012); var L = S1('c1') - SC[11], tp = SC[11] + L * .3, u = clamp((t - tp) / 1.3);
  Z.card.position.set(lerp(-1.2, 5.0, eo3(u)), lerp(4.4, 2.6, eo3(u)) + 1.2 * Math.sin(u * 3.14), lerp(1.0, 0, u)); Z.card.rotation.set(0, 0, -u * .3); Z.card.scale.setScalar(lerp(.8, .5, u)); B.slam(Z.ps, clamp((t - tp - 1.3) / .8), 3, -.35, 1); Z.ps.position.x = .2; Z.ps.position.z = .1;
  for (var i = 0; i < 30; i++) { var l = clamp((t - tp - 1.3 - hash(i) * .4) / 1.0); B.setI(Z.coins, i, 5 + (hash(i + 1) - .5) * 3, l <= 0 ? -5 : lerp(7 + hash(i + 2) * 3, .6, ei3(l)), (hash(i + 4) - .5) * 2, l * 5, l * 6, 0); } Z.coins.instanceMatrix.needsUpdate = true;
  put(Z.l1, t, SC[11] + .6, .4); put(Z.l2, t, SC[11] + L * .55, .4); };
e.shot(11, 'pull back from the phone', SC[11], S0('cta') - .3, [-1.0, 5.0, 11], [-.8, 4.4, 0], 42, [2.0, 6.2, 23], [1.4, 4.2, 0], 44, 'io');
e.shot(11, 'hold for the end card', S0('cta') - .3, S0('cta') + 20, [2.0, 6.2, 23], [1.4, 4.2, 0], 44, [2.0, 6.2, 23], [1.4, 4.2, 0], 44, 'io');
})();
/* Part C (billionaire): DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['A BORED BILLIONAIRE · ONE OVERDUE BILL', 'UPLOAD · SWIPE · PAID', 'FAKE TWEET · REAL NERVE', 'LENS 1 · IS THE BILL REAL?', 'LENS 1 · TWO SWIPES, ONE BILL', 'SCALE · 3,428 vs 14 MILLION', 'LENS 2 · FEES AND GIFT-TAX LINES', 'TOP FORBES $839 B vs YOUR $1,500', 'US MEDICAL DEBT vs 1.1% OF WEALTH', 'LENS 3 · A DATING PROFILE FOR RENT', 'LENS 4 · WHO GETS FUNDED', 'PAY THE BILLER · NOT THE FEED'];
var HL = ['Billionaire ka <b>right swipe</b>', 'Bill upload. <b>Swipe.</b> Paid.', 'Elon ne tweet kiya hi <b>nahi</b>', 'Pehle: bill <b>asli</b> hai?', 'Ek bill, ek <b>hold</b>', 'Har billionaire ke <b>4,084 bill</b>', 'Daan par <b>fee</b> aur tax', 'Rent = <b>2 paise</b>', 'Paisa kam nahi, <b>plumbing</b> kam', 'Kiraya, billionaire ke <b>mood</b> par', 'Gareebi ka <b>For You page</b>', 'Seedha <b>biller</b> ko'];
var TAGS = ['ILLUSTRATIVE SCENE · NOT A REAL APP', 'ILLUSTRATIVE · THE IDEA AS DESCRIBED', 'SOURCE: LEAD STORIES, 3 NOV 2026', 'PER THEIR SITE · ILLUSTRATIVE', 'ILLUSTRATIVE · SAMPLE DATA, NOT A REAL BILL', 'FORBES 2026 · KFF VIA THE GUARDIAN · ROUGH MATH', 'ONLYBILLS PER THEIR SITE · TAX: OUR READING, ASK A CA', 'FORBES 2026 · OUR ARITHMETIC · LOG SCALE', 'KFF · FORBES 2026 · OUR ARITHMETIC', 'ILLUSTRATIVE · NOT A REAL APP', 'KFF HEALTH NEWS 2024 · U. WASHINGTON 2017', 'ILLUSTRATIVE SCENE'];
var hsc = D('', 'left:0;top:0;width:1080px;height:430px;background:linear-gradient(rgba(255,227,220,.92),rgba(255,227,220,.75) 55%,rgba(255,227,220,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:600 24px \'Geist Mono\';letter-spacing:.14em;color:#e03131;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#e03131"></i><span id="ebt"></span></div><div id="hl" style="font:900 56px/1.04 Unbounded;letter-spacing:-.02em;margin-top:14px;color:#2a0f2e"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "Geist Mono";letter-spacing:.06em;color:rgba(42,15,46,.72);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(255,227,220,0),rgba(255,227,220,.94) 22%,rgba(255,227,220,.94) 80%,rgba(255,227,220,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #2a0f2e;box-shadow:0 0 0 6px #e8b53a,0 10px 40px rgba(42,15,46,.35);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#2a0f2e;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#e03131;font:600 26px "Geist Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#2a0f2e', 190], ['share', 'SHARE', '#2fb872', 210], ['bell-ringing', 'SUBSCRIBE', '#e03131', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:#fff7ee;display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "Geist Mono";letter-spacing:.05em;color:#2a0f2e;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#e8b53a', chipInk: '#2a0f2e', keywords: { 'billionaire': '#e8b53a', 'billionaires': '#e8b53a', 'bill': '#ff7a70', 'swipe': '#2fb872', 'tweet': '#ff7a70', 'paisa': '#e8b53a' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = []; for (var di = 1; di < SC.length; di++) DIPS.push(SC[di]);
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.1, 'slam'); ev(SP('h1', .6), 'whoosh'); ev(SP('h1', .6) + .6, 'ping'); DIPS.forEach(function (d) { ev(d - .1, 'whoosh'); });
  var L1 = S1('p1') - SC[1]; ev(SC[1] + L1 * .36, 'pop'); ev(SC[1] + L1 * .88, 'slam'); ev(SC[1] + L1 * .9, 'ping');
  ev(WS('r1', 'tweet|ट्वीट|ट्विट', .8), 'slam'); ev(S0('r2') + .3, 'pop'); ev(S0('r2') + 1.9, 'buzz'); for (var i = 0; i < 3; i++) ev(SP('r2', .55) + i * .8, 'pop');
  var L3 = S1('t1') - SC[3]; for (var k = 0; k < 4; k++) ev(SC[3] + .2 + k * L3 * .17, 'tick'); ev(SC[3] + L3 * .45, 'buzz'); ev(SC[3] + L3 * .88, 'ping');
  var L4 = S1('t2') - SC[4]; ev(SC[4] + 1.4, 'whoosh'); ev(SC[4] + 1.7, 'slam'); ev(SC[4] + L4 * .5 + .3, 'pop'); for (var m = 0; m < 3; m++) ev(SC[4] + L4 * .65 + m * .3, 'tick');
  ev(SC[5] + .5, 'ping'); ev(SC[5] + 1.0, 'tick'); ev(SC[5] + 1.4, 'tick'); ev(SC[5] + (S1('t3') - SC[5]) * .5 + 1.4, 'ping');
  for (var s = 0; s < 10; s++) ev(SC[6] + .3 + s * .18 + .3, 'tick'); ev(SC[6] + 2.7, 'pop'); ev(S0('f1b') + .4, 'pop'); ev(SP('f1b', .72), 'buzz');
  var L7 = S1('f2') - SC[7]; for (var q = 0; q < 4; q++) ev(SC[7] + .4 + q * .25, 'tick'); ev(SC[7] + L7 * .38 + .8, 'whoosh'); ev(SC[7] + L7 * .66 + 1.4, 'ping');
  ev(SC[8] + .5, 'whoosh'); ev(SC[8] + 1.2, 'pop'); ev(SC[8] + 2.4, 'ping');
  var L9 = S1('m1') - SC[9]; [.38, .6, .8].forEach(function (f) { ev(SC[9] + L9 * f, 'whoosh'); ev(SC[9] + L9 * f + .3, 'buzz'); });
  var L10 = S1('e1') - SC[10]; ev(SC[10] + L10 * .22, 'pop'); ev(SC[10] + L10 * .45 + .5, 'tick'); ev(SC[10] + L10 * .8, 'buzz');
  var L11 = S1('c1') - SC[11]; ev(SC[11] + L11 * .3, 'whoosh'); ev(SC[11] + L11 * .3 + 1.3, 'slam'); ev(SC[11] + L11 * .3 + 1.5, 'ping');
  ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.1, .1, .1, .1, .1, .06, .08, .08, .1, .1, .1, .1], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); e.camAt(sc, t); e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:900;background:#e8b53a;color:#2a0f2e;padding:0 10px;border-radius:6px'; });
  hdr.style.opacity = ec ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo)); hl.style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (ec ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  var dip = 0; DIPS.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#ffe3dc'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 22; e.POST.bloom = .25; e.POST.vig = .3; e.POST.expo = 1.3; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
