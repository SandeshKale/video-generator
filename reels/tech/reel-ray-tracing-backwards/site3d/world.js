/* "Optical Bench" 3D film — Part A: premium render engine (HDR studio environment, physical materials, planar puddle reflection,
   depth-of-field + bloom + grade post chain), authored camera shots, labels, ray primitives. Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3;
var TUNG = 0xffc46b, HOT = 0xfffaf0, ICE = 0x7fd6ff, VIO = 0xb07cff, COR = 0xff6b5e, SAGE = 0x9be3b0, CHALK = 0xeef2ee, BENCH = 0x07080b;
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
var ENV = (function () { var s = new THREE.Scene(); var dome = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec3 vP;void main(){float y=normalize(vP).y;vec3 c=mix(vec3(.12,.07,.04),vec3(.05,.07,.11),smoothstep(-.5,.1,y));c=mix(c,vec3(.16,.22,.36),smoothstep(.1,1.,y));gl_FragColor=vec4(c,1.);}' })); s.add(dome);
  function sb(w, h, x, y, z, col, k) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); }
  for (var q = 0; q < 6; q++) { var an = q / 6 * 6.283; sb(2.2, 12, Math.cos(an) * 14, 4, Math.sin(an) * 14, q % 2 ? 0xbfd8ff : 0xffd9a8, q % 2 ? 3 : 4.2); } sb(14, 4, 0, 9, -8, 0xffe2b0, 9); sb(5, 10, -13, 4, 3, 0xbfd8ff, 4); sb(5, 10, 13, 4, 5, 0xffc890, 3.5); sb(18, .8, 0, -2, 12, 0xffffff, 1.6); sb(8, 8, 0, 14, 4, 0xfff6e8, 2.2);
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
var POST = { focus: 14, aper: 1.0, maxR: 26, bloom: .9, expo: 1.0, grain: .035, ca: .0012, vig: .55, fade: 0, seed: 0 };
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
  'vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}' +
  'vec3 srgb(vec3 c){return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}' +
  'void main(){vec2 d=vUv-.5;float r2=dot(d,d);vec3 c;c.r=texture2D(tC,vUv+d*ca*r2*6.).r;c.g=texture2D(tC,vUv).g;c.b=texture2D(tC,vUv-d*ca*r2*6.).b;' +
  'c+=(texture2D(tB1,vUv).rgb*.7+texture2D(tB2,vUv).rgb*1.0)*bloom;c*=expo;c=aces(c);c=srgb(c);' +
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
  if (!e) { var fs = o.fs || 56, f = o.font || '600 ' + fs + 'px "Martian Mono"', c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = o.pad || 24, lh = fs * 1.25; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
    x.fillStyle = o.bgc || 'rgba(6,7,10,.92)'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = HEX(col); x.fillRect(0, 0, 9, c.height); x.strokeStyle = 'rgba(238,242,238,.22)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, c.width - 3, c.height - 3);
    x.fillStyle = HEX(o.tcol == null ? CHALK : o.tcol); x.textBaseline = 'middle'; x.textAlign = 'left'; lines.forEach(function (l, i) { x.fillText(l, pad + 8, pad * .55 + lh * (i + .5) + 2); });
    var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; e = LC[k] = { tx: tx, asp: c.width / c.height }; }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: e.tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * e.asp, hh, 1); s.userData = { lbl: true, kind: 'lab', sx: hh * e.asp, sy: hh, sz: 1, txt: text.slice(0, 24) }; LBL.push(s); return s; }
function card(term, meaning, col, hh) { var c = document.createElement('canvas'), w = 940, h = 340; c.width = w; c.height = h; var x = c.getContext('2d'); x.fillStyle = 'rgba(6,7,10,.95)'; x.fillRect(0, 0, w, h); x.strokeStyle = HEX(col); x.lineWidth = 7; x.strokeRect(3.5, 3.5, w - 7, h - 7);
  x.fillStyle = HEX(col); x.fillRect(0, 0, w, 62); x.fillStyle = '#07080b'; x.font = '600 27px "Martian Mono"'; x.textBaseline = 'middle'; x.fillText('THIS IS CALLED', 30, 33); x.beginPath(); x.arc(w - 40, 31, 11, 0, 6.283); x.fill();
  x.fillStyle = HEX(CHALK); var tfs = 104; x.font = '400 ' + tfs + 'px "Instrument Serif"'; while (x.measureText(term).width > w - 60 && tfs > 36) { tfs -= 4; x.font = '400 ' + tfs + 'px "Instrument Serif"'; } x.fillText(term, 30, 150);
  x.fillStyle = 'rgba(238,242,238,.82)'; x.font = '600 36px Inter'; meaning.split('\n').forEach(function (l, i) { x.fillText(l, 30, 232 + i * 50); });
  var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 31; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'card', sx: hh * w / h, sy: hh, sz: 1, txt: 'CARD ' + term }; LBL.push(s); return s; }
function put(o, t, tIn, dur, hold) { var u = clamp((t - tIn) / (dur || .4)), ud = o.userData; if (ud.sx == null) { ud.sx = o.scale.x; ud.sy = o.scale.y; ud.sz = o.scale.z; } var vis = u > 0 && (hold == null || t < hold); o.visible = vis; if (!vis) return 0; var k = eob(u); o.scale.set(ud.sx * k, ud.sy * k, ud.sz * k); if (o.material && o.isSprite) o.material.opacity = clamp(u * 3); return u; }
function isVis(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
var SAFE = { l: 156, r: 912, t: 232, b: 1290 }, _v = new V3(), _r = new V3(), _u = new V3();
function labRect(s) { s.getWorldPosition(_v); var cp = _v.clone().applyMatrix4(C.matrixWorldInverse), d = -cp.z; if (d < .1) return null; var wpp = 2 * d * Math.tan(C.fov * Math.PI / 360) / H, p = _v.clone().project(C), cx = (p.x * .5 + .5) * W, cy = (1 - (p.y * .5 + .5)) * H, w = s.scale.x / wpp, h = s.scale.y / wpp; return { cx: cx, cy: cy, w: w, h: h, l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2, wpp: wpp }; }
function clampLabels() { C.matrixWorld.extractBasis(_r, _u, new V3()); LBL.forEach(function (s) { if (s.userData.p0 == null) s.userData.p0 = s.position.clone(); s.position.copy(s.userData.p0); if (!isVis(s)) return; var r = labRect(s); if (!r) { s.visible = false; return; } if (r.cx < SAFE.l - r.w * .3 || r.cx > SAFE.r + r.w * .3 || r.cy < SAFE.t - r.h * 1.2 || r.cy > SAFE.b + r.h * 1.2) { s.visible = false; return; } var kd = s.userData.kind || 'dyn', lo = kd === 'card' ? 250 : kd === 'lab' ? 42 : 110, hi = kd === 'card' ? 340 : kd === 'lab' ? 70 : 150; if (r.h > hi) { s.scale.multiplyScalar(hi / r.h); r = labRect(s); } else if (r.h < lo) { s.scale.multiplyScalar(lo / r.h); r = labRect(s); } if (r.w > 748) { s.scale.multiplyScalar(748 / r.w); r = labRect(s); } var dx = 0, dy = 0; if (r.l < SAFE.l) dx = SAFE.l - r.l; else if (r.r > SAFE.r) dx = SAFE.r - r.r; if (r.t < SAFE.t) dy = SAFE.t - r.t; else if (r.b > SAFE.b) dy = SAFE.b - r.b; if (dx || dy) { s.parent.updateMatrixWorld(); var wsh = _r.clone().multiplyScalar(dx * r.wpp).add(_u.clone().multiplyScalar(-dy * r.wpp)); var wp = new V3(); s.getWorldPosition(wp); wp.add(wsh); s.position.copy(s.parent.worldToLocal(wp)); } }); }
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
/* Part B0: timing helpers, buildings, puddle street, ray bench, shader path-tracer panels, ray fans, GPU */
(function () {
var e = E, S = e.S, V3 = e.V3, R = e.R, K = e.col, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var k = s.k0; k <= s.k1; k++) if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return TM.words[k][1]; } } window.__ws[id + '|' + subs] = ['MISS', +SP(id, f == null ? .5 : f).toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return SP(id, f == null ? .5 : f); }
var B = {};
/* ---- windows + buildings ---- */
function winTex(seed, cols, rows, warm) { var c = document.createElement('canvas'); c.width = cols * 8; c.height = rows * 8; var x = c.getContext('2d'); x.fillStyle = '#05060a'; x.fillRect(0, 0, c.width, c.height);
  for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) { var h = hash(seed * 997 + j * 131 + i * 7); if (h < (warm || .38)) { var k = hash(seed + j * 3 + i * 11); x.fillStyle = k < .72 ? 'rgb(255,' + (190 + k * 50 | 0) + ',' + (110 + k * 60 | 0) + ')' : 'rgb(170,215,255)'; x.fillRect(i * 8 + 1, j * 8 + 1, 5, 5); } }
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.anisotropy = 4; return t; }
function building(w, h, d, seed, o) { o = o || {}; var cols = Math.max(4, Math.round(w * 1.6)), rows = Math.max(6, Math.round(h * 1.3)), tex = winTex(seed, cols, rows, o.warm);
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: o.col || 0x14161d, roughness: .55, metalness: .35, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: o.ei || 1.5 })); }
B.building = building;
/* ---- puddle street (planar reflection in a shader) ---- */
B.street = function () { var g = new THREE.Group();
  for (var side = -1; side <= 1; side += 2) { var z = 8; for (var i = 0; i < 14; i++) { var w = 7 + hash(i * 3 + side) * 5, h = 9 + hash(i * 5 + side * 9) * 20, b = building(w, h, 9, i * 2 + (side > 0 ? 40 : 0)); b.position.set(side * (9 + w / 2), h / 2, z - 5); g.add(b); z -= 9 + hash(i) * 3; }
    var sw = new THREE.Mesh(new THREE.BoxGeometry(3.2, .25, 160), e.physMat(0x14161c, { roughness: .6, envMapIntensity: .2 })); sw.position.set(side * 6.4, .125, -60); g.add(sw); }
  var tw = new THREE.Group(), tb = building(12, 46, 12, 77, { ei: 1.2, warm: .55 }); tb.position.y = 23; tw.add(tb);
  for (var q = 0; q < 7; q++) { var band = new THREE.Mesh(new THREE.BoxGeometry(12.4, 1.3, 12.4), new THREE.MeshBasicMaterial({ color: new THREE.Color(q % 2 ? K.TUNG : K.ICE).multiplyScalar(3.4) })); band.position.y = 6 + q * 6.2; tw.add(band); }
  var fin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 44, .5), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.COR).multiplyScalar(3) })); fin.position.set(0, 23, 6.3); tw.add(fin);
  var spire = new THREE.Mesh(new THREE.CylinderGeometry(.18, .4, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.COR).multiplyScalar(3) })); spire.position.y = 52; tw.add(spire); tw.position.set(0, 0, -46); g.add(tw);
  for (var s2 = -1; s2 <= 1; s2 += 2) for (var l = 0; l < 9; l++) { var lz = 4 - l * 12, post = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, 6.4, 8), e.physMat(0x2a2d36, { metalness: .8, roughness: .35 })); post.position.set(s2 * 5.2, 3.2, lz); g.add(post);
    var head = new THREE.Mesh(new THREE.SphereGeometry(.34, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.TUNG).multiplyScalar(3.2) })); head.position.set(s2 * 4.7, 6.5, lz); g.add(head); var gl = e.glow('t', 5.2, .9); gl.position.copy(head.position); g.add(gl); }
  for (var d2 = 0; d2 < 18; d2++) { var dash = new THREE.Mesh(new THREE.BoxGeometry(.18, .02, 2.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xdfe6ee).multiplyScalar(.7) })); dash.position.set(0, .012, -8 - d2 * 5); g.add(dash); }
  var rtR = new THREE.WebGLRenderTarget(540, 960, { type: THREE.HalfFloatType }), vcam = new THREE.PerspectiveCamera(40, 1080 / 1920, .1, 400);
  var pm = new THREE.ShaderMaterial({ uniforms: { uRef: { value: rtR.texture }, uVP: { value: new THREE.Matrix4() }, uCam: { value: new V3() }, uT: { value: 0 }, uFog: { value: new THREE.Color(0x0a0e1a) }, uFd: { value: .011 } }, vertexShader: 'varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}',
    fragmentShader: 'uniform sampler2D uRef;uniform mat4 uVP;uniform vec3 uCam,uFog;uniform float uT,uFd;varying vec3 vW;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}' +
    'void main(){float m=fbm(vW.xz*.22+vec2(3.1,1.7));float ell=1.-length((vW.xz-vec2(.3,-4.5))/vec2(5.2,8.5));float pud=smoothstep(.52,.58,max(m,ell*.9+.2));' +
    'vec2 rip=vec2(fbm(vW.xz*5.+uT*.35),fbm(vW.xz*5.+7.-uT*.35))-.5;vec2 rip2=(vec2(n(vW.xz*14.),n(vW.xz*14.+9.))-.5);' +
    'vec4 cl=uVP*vec4(vW,1.);vec2 uv=cl.xy/cl.w*.5+.5;uv+=rip*mix(.05,.006,pud)+rip2*mix(.02,.0,pud);uv=clamp(uv,.001,.999);vec3 refl=texture2D(uRef,uv).rgb;' +
    'vec3 V=normalize(uCam-vW);float F=.04+.96*pow(1.-max(V.y,0.),5.);vec3 asph=vec3(.028,.03,.036)*(.7+.7*fbm(vW.xz*3.));' +
    'float rk=mix(.55*F+.07,.78+.22*F,pud);vec3 col=mix(asph,refl*mix(.55,1.,pud),clamp(rk,0.,1.));float dist=length(uCam-vW);col=mix(uFog,col,exp(-uFd*dist*.55));gl_FragColor=vec4(col,1.);}' });
  var pud = new THREE.Mesh(new THREE.PlaneGeometry(60, 220), pm); pud.rotation.x = -Math.PI / 2; pud.position.set(0, 0, -60); g.add(pud);
  e.HOOKS.pre.push(function () { if (!g.visible) return; var cp = e.camP, cl = e.camL; vcam.fov = e.getF(); vcam.position.set(cp.x, -cp.y, cp.z); vcam.up.set(0, -1, 0); vcam.lookAt(cl.x, -cl.y, cl.z); vcam.updateProjectionMatrix(); vcam.updateMatrixWorld(true);
    var vis = []; e.rayObjs.forEach(function (o) { vis.push(o.visible); }); pud.visible = false; var bg = S.background; R.setRenderTarget(rtR); R.clear(); R.render(S, vcam); pud.visible = true; pm.uniforms.uVP.value.multiplyMatrices(vcam.projectionMatrix, vcam.matrixWorldInverse); pm.uniforms.uCam.value.copy(cp); });
  g.userData.pm = pm; g.userData.tower = tw; return g; };
e.rayObjs = [];
/* ---- the ray bench (geometry shared by the flip / reflection / shadow scenes) ---- */
B.bench = function () { var g = new THREE.Group(), o = { g: g };
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), e.physMat(0x08090c, { roughness: .38, metalness: .35, envMapIntensity: .32 })); floor.rotation.x = -Math.PI / 2; g.add(floor); g.add(e.gridFloor(30, 1, 0x7f8aa0, .1));
  var rS = 1.3, Cs = new V3(0, 1.3, 0), d = new V3(.12, -.22, .97).normalize(), n = new V3(.4, .25, -.88).normalize(), P = Cs.clone().add(n.clone().multiplyScalar(rS)), Rd = d.clone().sub(n.clone().multiplyScalar(2 * d.dot(n))).normalize(), E0 = P.clone().sub(d.clone().multiplyScalar(5.6)), Bp = P.clone().add(Rd.clone().multiplyScalar(5.0));
  o.Cs = Cs; o.rS = rS; o.d = d; o.n = n; o.P = P; o.Rd = Rd; o.E0 = E0;
  var chrome = new THREE.Mesh(new THREE.SphereGeometry(rS, 96, 64), e.physMat(0xffffff, { metalness: 1, roughness: .03, envMapIntensity: 1.7 })); chrome.position.copy(Cs); g.add(chrome); o.chrome = chrome;
  var glass = new THREE.Mesh(new THREE.SphereGeometry(.7, 64, 48), e.physMat(0xaed8ff, { metalness: 0, roughness: .02, envMapIntensity: 2.4, transparent: true, opacity: .3, clearcoat: 1, clearcoatRoughness: .02 })); glass.position.set(-2.3, .7, 2.2); g.add(glass);
  var brass = new THREE.Mesh(new THREE.CylinderGeometry(.5, .55, .46, 48), e.physMat(0xc79a4b, { metalness: 1, roughness: .28, envMapIntensity: 1.5 })); brass.position.set(2.2, .23, 2.6); g.add(brass);
  var eye = new THREE.Group(), body = new THREE.Mesh(new THREE.BoxGeometry(1.3, .9, 1.0), e.physMat(0x14161c, { metalness: .8, roughness: .35 })); eye.add(body);
  var barrel = new THREE.Mesh(new THREE.CylinderGeometry(.3, .36, .6, 40), e.physMat(0x20232b, { metalness: .9, roughness: .25 })); barrel.rotation.x = Math.PI / 2; barrel.position.z = -.75; eye.add(barrel);
  var lens = new THREE.Mesh(new THREE.CircleGeometry(.28, 40), new THREE.MeshPhysicalMaterial({ color: 0x0a1630, metalness: .2, roughness: .02, clearcoat: 1, envMapIntensity: 3 })); lens.position.z = -1.06; lens.rotation.y = Math.PI; eye.add(lens);
  var ring = new THREE.Mesh(new THREE.TorusGeometry(.34, .04, 12, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(2.4) })); ring.position.z = -1.05; eye.add(ring); eye.position.copy(E0); eye.lookAt(E0.clone().add(d)); eye.rotateY(Math.PI); g.add(eye); o.eye = eye;
  var Pc = E0.clone().add(d.clone().multiplyScalar(2.9)), cell = .28, cols = 10, rows = 12, plane = new THREE.Group(); plane.position.copy(Pc); plane.lookAt(Pc.clone().add(d)); g.add(plane); o.Pc = Pc; o.plane = plane;
  var pts = []; for (var i = -cols / 2; i <= cols / 2; i++) pts.push(new V3(i * cell - cell / 2, -rows * cell / 2, 0), new V3(i * cell - cell / 2, rows * cell / 2, 0)); for (var j = -rows / 2; j <= rows / 2; j++) pts.push(new V3(-cols * cell / 2 - cell / 2, j * cell - cell / 2, 0), new V3(cols * cell / 2 - cell / 2, j * cell - cell / 2, 0));
  var lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(K.CHALK).multiplyScalar(1.3), transparent: true, opacity: .6 })); plane.add(lines);
  var glassP = new THREE.Mesh(new THREE.PlaneGeometry(cols * cell, rows * cell), new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: .07, side: THREE.DoubleSide, depthWrite: false })); glassP.position.set(-cell / 2, -cell / 2, 0); plane.add(glassP); o.lines = lines; o.glassP = glassP;
  var hot = new THREE.Mesh(new THREE.BoxGeometry(cell * .94, cell * .94, .05), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(3) })); plane.add(hot); o.hot = hot;
  var bld = building(2.0, 5.4, 2.0, 5, { ei: 1.7, warm: .5 }); bld.position.set(Bp.x + 1.0, 2.7, Bp.z); g.add(bld); o.bld = bld;
  var crown = new THREE.Mesh(new THREE.BoxGeometry(2.25, .26, 2.25), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.ICE).multiplyScalar(2.8) })); crown.position.set(Bp.x + 1.0, 5.5, Bp.z); g.add(crown); o.crown = crown;
  o.rEnd = P.clone().add(Rd.clone().multiplyScalar(((Bp.x + 1.0 - 1.0 - P.x) / Rd.x) - .05)); o.eStart = E0.clone().add(d.clone().multiplyScalar(.8));
  o.rayP = e.ray(o.eStart, P, K.HOT, .06); o.rayR = e.ray(P, o.rEnd, K.ICE, .06); o.rayN = e.ray(P, P.clone().add(n.clone().multiplyScalar(1.7)), K.SAGE, .04); g.add(o.rayP); g.add(o.rayR); g.add(o.rayN);
  o.ah1 = e.arrowHead(K.HOT, .26); o.ah2 = e.arrowHead(K.ICE, .26); g.add(o.ah1); g.add(o.ah2); o.hit = e.glow('w', 1.5, 1); o.hit.position.copy(P); g.add(o.hit);
  /* the lamp + a blocker for the shadow-ray scene */
  var Lp = P.clone().add(new V3(-2.4, 3.0, -2.2)); o.Lp = Lp; var lamp = new THREE.Mesh(new THREE.SphereGeometry(.38, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.TUNG).multiplyScalar(3.4) })); lamp.position.copy(Lp); g.add(lamp); o.lamp = lamp; o.lampGl = e.glow('t', 4.6, .95); o.lampGl.position.copy(Lp); g.add(o.lampGl);
  o.rayS = e.ray(P, Lp, K.VIO, .05); g.add(o.rayS); o.ah3 = e.arrowHead(K.VIO, .24); g.add(o.ah3);
  var blk = new THREE.Mesh(new THREE.BoxGeometry(1.0, .22, 1.0), e.physMat(0xc79a4b, { metalness: 1, roughness: .28, envMapIntensity: 1.5 })); o.blk = blk; g.add(blk);
  o.sw = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .06), new THREE.MeshBasicMaterial({ color: 0xffffff })); o.sw.userData.sw = true; g.add(o.sw);
  o.bpt = Bp; return o; };
/* ---- shader path tracer panels (1 / 8 / 64 spp, G-buffer, 2-pass denoise) ---- */
B.pt = function () { var PTV = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
  var PTF = 'precision highp float;uniform vec2 uRes;uniform float uSpp,uSeed;uniform int uMode;varying vec2 vUv;float sd;' +
  'float rnd(){sd+=1.;return fract(sin(dot(vec2(sd,gl_FragCoord.x*.37+gl_FragCoord.y*1.71+uSeed),vec2(12.9898,78.233)))*43758.5453);}' +
  'bool sph(vec3 ro,vec3 rd,vec3 c,float r,out float t){vec3 oc=ro-c;float b=dot(oc,rd);float cc=dot(oc,oc)-r*r;float h=b*b-cc;if(h<0.)return false;h=sqrt(h);t=-b-h;if(t<1e-3)t=-b+h;return t>1e-3;}' +
  'vec3 sky(vec3 rd){return mix(vec3(.05,.055,.08),vec3(.16,.19,.28),rd.y*.5+.5);}' +
  'vec3 cosd(vec3 n){float u=rnd(),v=rnd();float r=sqrt(u),a=6.28318*v;vec3 t=normalize(abs(n.y)<.99?cross(n,vec3(0,1,0)):cross(n,vec3(1,0,0)));vec3 b=cross(n,t);return normalize(t*r*cos(a)+b*r*sin(a)+n*sqrt(1.-u));}' +
  'void scene(vec3 ro,vec3 rd,out float T,out vec3 N,out vec3 A,out float K){T=1e9;K=-1.;float t;' +
  'if(sph(ro,rd,vec3(-.75,.55,0.),.55,t)&&t<T){T=t;N=normalize(ro+rd*t-vec3(-.75,.55,0.));A=vec3(.95);K=1.;}' +
  'if(sph(ro,rd,vec3(.55,.45,.35),.45,t)&&t<T){T=t;N=normalize(ro+rd*t-vec3(.55,.45,.35));A=vec3(.85,.16,.11);K=0.;}' +
  'if(sph(ro,rd,vec3(.05,.28,1.05),.28,t)&&t<T){T=t;N=normalize(ro+rd*t-vec3(.05,.28,1.05));A=vec3(.35,.85,.55);K=0.;}' +
  'if(sph(ro,rd,vec3(1.5,2.4,.2),.7,t)&&t<T){T=t;N=normalize(ro+rd*t-vec3(1.5,2.4,.2));A=vec3(1.);K=2.;}' +
  'if(rd.y<-1e-4){t=-ro.y/rd.y;if(t>1e-3&&t<T){T=t;vec3 p=ro+rd*t;N=vec3(0,1,0);float ck=mod(floor(p.x*2.)+floor(p.z*2.),2.);A=mix(vec3(.10,.105,.12),vec3(.5,.5,.52),ck);K=0.;}}}' +
  'vec3 trace(vec3 ro,vec3 rd){vec3 col=vec3(0.),thr=vec3(1.);for(int b=0;b<4;b++){float T;vec3 N,A;float K;scene(ro,rd,T,N,A,K);if(K<-.5){col+=thr*sky(rd);break;}if(K>1.5){col+=thr*vec3(1.,.86,.66)*(b==0?1.5:9.);break;}vec3 p=ro+rd*T;if(K>.5){rd=reflect(rd,N);ro=p+N*1e-3;thr*=vec3(.93,.95,1.);}else{thr*=A;rd=cosd(N);ro=p+N*1e-3;}}return col;}' +
  'void main(){sd=0.;vec3 cam=vec3(.2,1.1,3.7),tg=vec3(0,.5,0);vec3 f=normalize(tg-cam),r=normalize(cross(f,vec3(0,1,0))),u=cross(r,f);float asp=uRes.x/uRes.y;' +
  'if(uMode>=1){vec2 q=(gl_FragCoord.xy/uRes*2.-1.)*vec2(asp,1.);vec3 rd=normalize(f*1.9+r*q.x+u*q.y);float T;vec3 N,A;float K;scene(cam,rd,T,N,A,K);if(uMode==2){gl_FragColor=vec4(K<-.5?vec3(0.):A,1.);return;}gl_FragColor=vec4(K<-.5?vec3(0.):N*.5+.5,K<-.5?0.:T*.2);return;}' +
  'vec3 acc=vec3(0.);for(int i=0;i<64;i++){if(float(i)>=uSpp)break;vec2 q=((gl_FragCoord.xy+vec2(rnd(),rnd()))/uRes*2.-1.)*vec2(asp,1.);vec3 rd=normalize(f*1.9+r*q.x+u*q.y);acc+=min(trace(cam,rd),vec3(40.));}gl_FragColor=vec4(acc/max(uSpp,1.),1.);}';
  var U = { uRes: { value: new THREE.Vector2(512, 512) }, uSpp: { value: 1 }, uSeed: { value: 0 }, uMode: { value: 0 } }, ptM = new THREE.ShaderMaterial({ uniforms: U, vertexShader: PTV, fragmentShader: PTF, depthTest: false, depthWrite: false });
  var DNF = 'precision highp float;uniform sampler2D tC,tN,tA;uniform vec2 px;varying vec2 vUv;void main(){vec3 c0=texture2D(tC,vUv).rgb;vec4 n0=texture2D(tN,vUv);vec3 a0=texture2D(tA,vUv).rgb;vec3 acc=vec3(0.);float ws=0.;' +
  'for(int j=-7;j<=7;j++)for(int i=-7;i<=7;i++){vec2 o=vec2(float(i),float(j));vec2 uv=vUv+o*px;vec4 nn=texture2D(tN,uv);vec3 cc=min(texture2D(tC,uv).rgb,vec3(2.2));vec3 dn=nn.rgb-n0.rgb;vec3 da=texture2D(tA,uv).rgb-a0;float w=exp(-dot(o,o)/(2.*14.))*exp(-dot(da,da)*90.)*exp(-dot(dn,dn)*70.)*exp(-abs(nn.a-n0.a)*10.);acc+=cc*w;ws+=w;}gl_FragColor=vec4(acc/ws,1.);}';
  var dnM = new THREE.ShaderMaterial({ uniforms: { tC: { value: null }, tN: { value: null }, tA: { value: null }, px: { value: new THREE.Vector2(1 / 512, 1 / 512) } }, vertexShader: PTV, fragmentShader: DNF, depthTest: false, depthWrite: false });
  function mk() { return new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType }); }
  var rt = [mk(), mk(), mk()], noisy = mk(), gb = mk(), ga = mk(), dn1 = mk(), dn2 = mk();
  function ren(spp, tgt, seed) { U.uSpp.value = spp; U.uSeed.value = seed; U.uMode.value = 0; e.pass(ptM, tgt); }
  ren(1, rt[0], 11); ren(8, rt[1], 23); ren(64, rt[2], 37); ren(1, noisy, 11); U.uMode.value = 1; e.pass(ptM, gb); U.uMode.value = 2; e.pass(ptM, ga); U.uMode.value = 0;
  dnM.uniforms.tN.value = gb.texture; dnM.uniforms.tA.value = ga.texture; dnM.uniforms.tC.value = noisy.texture; e.pass(dnM, dn1); dnM.uniforms.tC.value = dn1.texture; e.pass(dnM, dn2); R.setRenderTarget(null);
  return { t1: rt[0].texture, t8: rt[1].texture, t64: rt[2].texture, noisy: noisy.texture, clean: dn2.texture }; };
window.B = B; window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
})();
/* Part B1: scenes 0-4 (puddle hook, nature's rays, the flip, reflection, shadow). Everything is a pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, K = e.col, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, put = e.put, B = window.B;
var SC = window.SC = [0, S0('p1'), S0('r1'), S0('b1'), S0('s1'), S0('v1'), S0('y1'), S0('y2'), S0('n1'), S0('e1'), S0('f1')];
window.GR = []; window.SCN = []; window.POSES = {}; window.SCFG = {};
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
/* dynamic text sprite (a counter / readout) that the label clamp can also place */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1);
  s.userData = { lbl: true, sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s); s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(6,7,10,.92)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 10, h); x.strokeStyle = 'rgba(238,242,238,.22)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function fitPose(pts, dir, fov, box) { var c = new V3(); pts.forEach(function (p) { c.add(p); }); c.multiplyScalar(1 / pts.length); var look = c.clone(), dist = 6, cp, cam = new THREE.PerspectiveCamera(fov, 1080 / 1920, .1, 400);
  function put2() { cp = look.clone().add(dir.clone().multiplyScalar(dist)); cam.position.copy(cp); cam.up.set(0, 1, 0); cam.lookAt(look); cam.updateMatrixWorld(true); cam.updateProjectionMatrix(); }
  function ok() { return pts.every(function (p) { var q = p.clone().project(cam), x = (q.x * .5 + .5) * 1080, y = (1 - (q.y * .5 + .5)) * 1920; return x > box[0] && x < box[2] && y > box[1] && y < box[3]; }); }
  for (var it = 0; it < 5; it++) { var lo = 2, hi = 90; for (var k = 0; k < 24; k++) { dist = (lo + hi) / 2; put2(); if (ok()) hi = dist; else lo = dist; } dist = hi; put2();
    var mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9; pts.forEach(function (p) { var q = p.clone().project(cam), x = (q.x * .5 + .5) * 1080, y = (1 - (q.y * .5 + .5)) * 1920; mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); });
    var wpp = 2 * dist * Math.tan(fov * Math.PI / 360) / 1920, r = new V3(), u = new V3(), f = new V3(); cam.matrixWorld.extractBasis(r, u, f); look.add(r.multiplyScalar(((mnx + mxx) / 2 - 540) * wpp)).add(u.multiplyScalar(-(((mny + mxy) / 2 - (box[1] + box[3]) / 2)) * wpp)); }
  put2(); return { p: [cp.x, cp.y, cp.z], l: [look.x, look.y, look.z], f: fov }; }
B.fitPose = fitPose;
var v3 = function (a) { return new V3(a[0], a[1], a[2]); };
/* ================= scene 0 + 10: the puddle street ================= */
var gS = grp(B.street()), pm = gS.userData.pm, tower = gS.userData.tower;
/* ================= scene 1: nature's rays ================= */
var gN = grp(new THREE.Group()), NR = 520, LP = new V3(0, 3.0, -6.4), EY = new V3(0, 1.6, 5.8), RM = { x0: -6, x1: 6, y0: 0, y1: 6, z0: -7.5, z1: 8 };
(function () { var fl = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), e.physMat(0x1c1f27, { roughness: .5, metalness: .2, envMapIntensity: .35 })); fl.rotation.x = -Math.PI / 2; gN.add(fl); gN.add(e.gridFloor(30, 1, 0x7f8aa0, .1));
  var lamp = new THREE.Mesh(new THREE.SphereGeometry(.5, 28, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.TUNG).multiplyScalar(3.6) })); lamp.position.copy(LP); gN.add(lamp); var pl = new THREE.PointLight(0xffc46b, 160, 26, 1.6); pl.position.copy(LP); gN.add(pl); var lg = e.glow('t', 6, .95); lg.position.copy(LP); gN.add(lg); gN.userData.lamp = lamp; gN.userData.lg = lg;
  var ey = new THREE.Group(), bd = new THREE.Mesh(new THREE.BoxGeometry(1.3, .9, 1.0), e.physMat(0x4a505e, { metalness: .8, roughness: .3, envMapIntensity: 1.6 })); ey.add(bd); var br = new THREE.Mesh(new THREE.CylinderGeometry(.3, .36, .6, 40), e.physMat(0x5a6070, { metalness: .9, roughness: .22, envMapIntensity: 1.8 })); br.rotation.x = Math.PI / 2; br.position.z = -.75; ey.add(br); var eg = e.glow('w', 2.6, .75); eg.position.z = -1.1; ey.add(eg);
  var rg = new THREE.Mesh(new THREE.TorusGeometry(.34, .04, 12, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(2.4) })); rg.position.z = -1.05; ey.add(rg); ey.position.copy(EY); ey.lookAt(LP); ey.rotateY(Math.PI); gN.add(ey); gN.userData.eye = ey;
  var pos = new Float32Array(NR * 6), col = new Float32Array(NR * 6), dirs = [], lens = [], hitEye = [];
  function slab(o, d) { var t = 1e9; [['x', 'x0', 'x1'], ['y', 'y0', 'y1'], ['z', 'z0', 'z1']].forEach(function (a) { var dd = d[a[0]], oo = o[a[0]]; if (Math.abs(dd) > 1e-6) { var t1 = ((dd > 0 ? RM[a[2]] : RM[a[1]]) - oo) / dd; if (t1 > 0 && t1 < t) t = t1; } }); return t; }
  for (var i = 0; i < NR; i++) { var d; if (i < 4) { d = EY.clone().add(new V3((i - 1.5) * .06, (i % 2 - .5) * .1, (i - 1.5) * .05)).sub(LP).normalize(); } else { var an = Math.pow(hash(i * 3 + 1), .8) * 1.35, ph = hash(i * 7 + 2) * 6.2832; d = new V3(Math.sin(an) * Math.cos(ph), Math.sin(an) * Math.sin(ph) * .55 + .1, Math.cos(an)).normalize(); }
    dirs.push(d); lens.push(i < 4 ? EY.distanceTo(LP) - .9 : slab(LP, d)); }
  var geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); var lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); lines.frustumCulled = false; gN.add(lines);
  var ep = new Float32Array(NR * 3), ec = new Float32Array(NR * 3), eg2 = new THREE.BufferGeometry(); eg2.setAttribute('position', new THREE.BufferAttribute(ep, 3)); eg2.setAttribute('color', new THREE.BufferAttribute(ec, 3)); var pts2 = new THREE.Points(eg2, new THREE.PointsMaterial({ size: 7, sizeAttenuation: false, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); pts2.frustumCulled = false; gN.add(pts2);
  gN.userData.rays = { pos: pos, col: col, dirs: dirs, lens: lens, geo: geo, ep: ep, ec: ec, eg: eg2 };
  gN.userData.hot = [0, 1, 2, 3].map(function (i) { var r = e.ray(LP, EY.clone().sub(dirs[i].clone().multiplyScalar(.9)), K.HOT, .05); gN.add(r); return r; });
  gN.userData.c1 = e.dyn(.62, 760, 150, K.TUNG, function (x, a, b) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.TUNG); x.fillText('ONE BULB · BILLIONS OF RAYS', 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 50px "Martian Mono"'; x.fillText(a + ' drawn', 30, 112); });
  gN.userData.c2 = e.dyn(.62, 760, 150, K.HOT, function (x, a, b) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.HOT); x.fillText('REACHED THE EYE', 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 50px "Martian Mono"'; x.fillText(a + ' of ' + b, 30, 112); });
  gN.userData.l1 = e.lab('LAMP', K.TUNG, .5); gN.userData.l1.position.copy(LP.clone().add(new V3(0, 1.5, 0))); gN.add(gN.userData.l1); gN.userData.l2 = e.lab('EYE', K.HOT, .5); gN.userData.l2.position.copy(EY.clone().add(new V3(0, 1.3, 0))); gN.add(gN.userData.l2);
  gN.userData.l3 = e.lab('WASTED', K.COR, .5); gN.userData.l3.position.set(3.6, 4.0, -.5); gN.add(gN.userData.l3);
  gN.userData.c1.position.set(-2.7, .4, 9.5); gN.add(gN.userData.c1); gN.userData.c2.position.set(2.7, .4, 9.5); gN.add(gN.userData.c2); })();
/* ================= scenes 2-4: the ray bench ================= */
var bn = B.bench(), gB = grp(bn.g); window.BN = bn;
var PA = fitPose([bn.E0.clone().add(new V3(0, .6, -.6)), bn.P, bn.rEnd.clone().add(new V3(3.6, 3.0, -1.2)), bn.bpt.clone().setY(0).add(new V3(1.2, 0, 1.4)), bn.Pc.clone().add(new V3(-1.6, 1.2, 0)), bn.Pc.clone().add(new V3(2.6, -1.2, 0)), bn.Cs.clone().add(new V3(-1.4, -1.2, 1.4)), bn.Cs.clone().add(new V3(1.4, -1.2, 1.4)), bn.Lp.clone().add(new V3(-1.5, 1.2, -1.2))], new V3(.1, .85, .5).normalize(), 50, [190, 330, 890, 1230]);
POSES.PA = PA;
var bl = { l1: e.lab('PRIMARY RAY', K.HOT, .5), l2: e.lab('NORMAL', K.SAGE, .4), l3: e.lab('REFLECTION RAY', K.ICE, .5), l4: e.lab('ONE PIXEL', K.HOT, .4), l5: e.lab('BUILDING BEHIND YOU', K.ICE, .42), l6: e.lab('SHADOW RAY', K.VIO, .5), l7: e.lab('WHAT AM I?', K.HOT, .42), l8: e.lab('PIXEL = BUILDING', K.TUNG, .4), l9: e.lab('BLOCKED = SHADOW', K.COR, .42), l10: e.lab('CLEAR = LIGHT', K.TUNG, .42) };
bl.l1.position.copy(bn.E0.clone().add(bn.d.clone().multiplyScalar(3.4)).add(new V3(-2.3, .4, 0))); bl.l2.position.copy(bn.P.clone().add(bn.n.clone().multiplyScalar(1.4)).add(new V3(1.5, .5, -.9))); bl.l3.position.copy(bn.P.clone().add(bn.Rd.clone().multiplyScalar(2.6)).add(new V3(0, .6, -.9))); bl.l4.position.copy(bn.Pc.clone().add(new V3(2.1, .8, -.5))); bl.l5.position.copy(bn.bpt.clone().add(new V3(1.0, 3.5, -.2)));
bl.l6.position.copy(bn.P.clone().add(bn.Lp).multiplyScalar(.5).add(new V3(-1.9, .9, 0))); bl.l7.position.copy(bn.P.clone().add(new V3(1.8, .5, -1.7))); bl.l8.position.copy(bn.Pc.clone().add(new V3(-2.3, 1.1, 0))); bl.l9.position.copy(bn.P.clone().add(bn.Lp).multiplyScalar(.5).add(new V3(2.0, 1.2, 1.0))); bl.l10.position.copy(bn.P.clone().add(bn.Lp).multiplyScalar(.5).add(new V3(2.0, 1.2, 1.0)));
Object.keys(bl).forEach(function (k) { bn.g.add(bl[k]); });
var cardP = e.card('PRIMARY RAY', 'ek kiran, aankh se, ek pixel ke raaste', K.HOT, 1.7); cardP.position.copy(bn.Pc.clone().add(new V3(1.6, 3.8, -.4))); bn.g.add(cardP);
var cardS = e.card('SHADOW RAY', 'roshni tak seedhi raah hai ya nahi?', K.VIO, 1.7); cardS.position.copy(bn.P.clone().add(new V3(2.0, 3.8, -1.5))); bn.g.add(cardS);
/* ================= camera shots ================= */
var tS0 = SC[0], tHook = WS('h1', 'उल्टी|उल्टा|उलटी', .8);
e.shot(0, 'crane-down + tilt', 0, 3.6, [3, 10, 17], [0, 11, -40], 46, [.4, 1.35, 7.4], [.1, -2.9, -3.2], 44, 'io');
e.shot(0, 'push-in', Math.max(4.2, tHook - .6), Math.max(6.4, tHook + 1.8), [.4, 1.35, 7.4], [.1, -2.9, -3.2], 44, [.3, .95, 5.5], [.1, -3.2, -3.6], 44, 'io');
var tOrb = SC[1];
e.shot(1, 'orbit', tOrb, tOrb + 6.5, [-8, 10.5, 15], [0, 1.0, 0], 52, [7, 10.5, 15.5], [0, 1.0, 0], 52, 'io');
var tPush = WS('p1', 'आँख|आंख|पहुँचती', .8) - .4;
e.shot(1, 'push-in to the eye', tPush, tPush + 2.6, [7, 10.5, 15.5], [0, 1.0, 0], 52, [2.4, 4.4, 11.8], [0, 1.6, 5.5], 44, 'io');
var tRay = WS('r1', 'बाहर|तरफ़|भेजो', .65);
e.shot(2, 'plan view', SC[2], SC[2] + 1, PA.p, PA.l, 50, PA.p, PA.l, 50, 'io');
var BP = bn.E0.clone().add(bn.d.clone().multiplyScalar(.5)).add(new V3(7.6, 6.6, 1.2)), BL = bn.P.clone().add(new V3(0, .2, -.3));
e.shot(2, 'dolly with the ray', tRay - .2, tRay + 2.4, PA.p, PA.l, 50, [BP.x, BP.y, BP.z], [BL.x, BL.y, BL.z], 44, 'io');
var tR3 = SC[3], tRefl = WS('b1', 'उछलकर|उछल', .25), CPp = bn.P.clone().add(new V3(-8.6, 6.6, 6.6)), CLp = bn.P.clone().add(bn.rEnd).multiplyScalar(.5);
e.shot(3, 'orbit to the bounce', tR3 + .1, tR3 + 1.8, [BP.x, BP.y, BP.z], [BL.x, BL.y, BL.z], 44, [CPp.x, CPp.y, CPp.z], [CLp.x, CLp.y, CLp.z], 46, 'io');
var tBld = WS('b1', 'बिल्डिंग', .55), tPud = WS('b1', 'पडल|पुडल|पड्डल|पडल्', .8);
e.shot(3, 'pull-back to the building', tBld - .3, tBld + 2.2, [CPp.x, CPp.y, CPp.z], [CLp.x, CLp.y, CLp.z], 46, PA.p, PA.l, 50, 'io');
var SP0 = bn.P.clone().add(bn.Lp).multiplyScalar(.5), TP = SP0.clone().add(new V3(-9.6, 6.4, 9.6));
e.shot(4, 'truck along the shadow ray', SC[4] + .1, SC[4] + 2.6, PA.p, PA.l, 50, [TP.x, TP.y, TP.z], [SP0.x, SP0.y, SP0.z], 46, 'io');
/* ================= scene functions ================= */
SCN[0] = function (t) { (window.__r10 || []).forEach(function (o) { o.visible = false; }); gS.visible = true; tower.visible = true; S.fog = new THREE.FogExp2(0x0a0e1a, .011); S.background = new THREE.Color(0x0a0e1a); pm.uniforms.uT.value = t; };
SCN[1] = function (t) { gN.visible = true; S.fog = new THREE.FogExp2(0x07080b, .02); S.background = new THREE.Color(0x07080b); var ud = gN.userData, R = ud.rays, t0 = SC[1] + .2, tW = WS('p2', 'नुकसान|बड़ा', .4), w = clamp((t - tW) / .9);
  for (var i = 0; i < NR; i++) { var tb = t0 + (i / NR) * 3.2, u = clamp((t - tb) / .5), ln = R.lens[i] * u, d = R.dirs[i], j = i * 6, special = i < 4;
    var ex = LP.x + d.x * ln, ey = LP.y + d.y * ln, ez = LP.z + d.z * ln; R.pos[j] = LP.x; R.pos[j + 1] = LP.y; R.pos[j + 2] = LP.z; R.pos[j + 3] = ex; R.pos[j + 4] = ey; R.pos[j + 5] = ez;
    var a = special ? 0 : (u > 0 ? .55 : 0); var r = lerp(1, 1, w) * a, g2 = lerp(.62, .24, w) * a, b2 = lerp(.28, .2, w) * a; var fade = 1 - w * .45; R.col[j] = r * fade; R.col[j + 1] = g2 * fade; R.col[j + 2] = b2 * fade; R.col[j + 3] = r * fade * .3; R.col[j + 4] = g2 * fade * .3; R.col[j + 5] = b2 * fade * .3; }
  for (var q = 0; q < NR; q++) { R.ep[q * 3] = R.pos[q * 6 + 3]; R.ep[q * 3 + 1] = R.pos[q * 6 + 4]; R.ep[q * 3 + 2] = R.pos[q * 6 + 5]; var uu = clamp((t - (t0 + (q / NR) * 3.2)) / .5), c0 = q < 4 ? 0 : (uu >= 1 ? 1 : 0); R.ec[q * 3] = c0 * lerp(1, 1, w) * (1 - w * .4); R.ec[q * 3 + 1] = c0 * lerp(.7, .26, w) * (1 - w * .4); R.ec[q * 3 + 2] = c0 * lerp(.3, .2, w) * (1 - w * .4); } R.eg.attributes.position.needsUpdate = true; R.eg.attributes.color.needsUpdate = true; R.geo.attributes.position.needsUpdate = true; R.geo.attributes.color.needsUpdate = true;
  var tHit = WS('p1', 'आँख|आंख|पहुँचती', .8); ud.hot.forEach(function (r, i) { var u = clamp((t - (tHit - .4 + i * .08)) / .6); r.visible = u > 0; if (u > 0) e.setRay(r, LP, LP.clone().add(R.dirs[i].clone().multiplyScalar((EY.distanceTo(LP) - .9) * u))); });
  var n = Math.floor(Math.min(NR, Math.max(0, (t - t0) / 3.2 * NR))); ud.c1.draw(n); ud.c2.draw(t >= tHit ? 4 : 0, NR); ud.c1.visible = t > t0 + .2; ud.c2.visible = t > t0 + .2; put(ud.l1, t, t0, .4); put(ud.l2, t, t0 + .3, .4); put(ud.l3, t, tW, .4); };
function benchBase(t) { gB.visible = true; S.fog = new THREE.FogExp2(0x07080b, .028); S.background = new THREE.Color(0x07080b); }
function setRays(P1, P2) { e.setRay(bn.rayP, bn.eStart, bn.eStart.clone().lerp(bn.P, P1)); bn.rayP.visible = P1 > 0; bn.ah1.visible = P1 >= 1; bn.ah1.position.copy(bn.P.clone().sub(bn.d.clone().multiplyScalar(.2))); e.orient(bn.ah1, bn.d); }
SCN[2] = function (t) { benchBase(t); var t0 = SC[2], tPix = WS('r1', 'पिक्सल|पिक्सेल', .5), tPR = WS('r1', 'प्राइमरी|प्राइमरी', .9), tH = S0('r2');
  bn.g.children.forEach(function (c) { if (c.userData && c.userData.keep) return; });
  /* stage: eye first, then the pixel grid, then the ray */
  bn.eye.visible = t >= t0 + .15; var ue = clamp((t - t0 - .15) / .5); bn.eye.scale.setScalar(eo3(ue) || .001);
  var ug = clamp((t - (t0 + .8)) / .6); bn.plane.visible = ug > 0; bn.lines.material.opacity = .6 * ug; bn.glassP.material.opacity = .07 * ug; bn.hot.visible = t >= tPix - .6; bn.hot.scale.setScalar(1 + .25 * Math.max(0, Math.sin((t - tPix) * 6)) * clamp(1 - (t - tPix) / 2));
  bn.chrome.visible = true; bn.lamp.visible = false; bn.lampGl.visible = false; bn.rayS.visible = false; bn.ah3.visible = false; bn.blk.visible = false; bn.sw.visible = false; bn.bld.visible = false; bn.crown.visible = false; bn.rayR.visible = false; bn.rayN.visible = false; bn.ah2.visible = false; bn.hit.visible = t >= tRay + 1.2;
  var p1 = clamp((t - tRay) / 1.3); setRays(sstep(p1)); bn.hit.material.opacity = clamp((t - tRay - 1.2) / .3); bn.hit.scale.setScalar(1.5 + .3 * Math.sin(t * 5));
  put(bl.l1, t, tPR - .5, .4); put(bl.l4, t, tPix, .4); put(cardP, t, tPR, .5, tH + 2.8); put(bl.l7, t, tH + .2, .4); bn.hot.material.color.set(K.HOT).multiplyScalar(3); bn.hot.material.color.copy(new THREE.Color(K.HOT).multiplyScalar(3)); };
SCN[3] = function (t) { benchBase(t); var t0 = SC[3]; bn.eye.visible = true; bn.eye.scale.setScalar(1); bn.plane.visible = true; bn.lines.material.opacity = .6; bn.glassP.material.opacity = .07; bn.hot.visible = true; bn.lamp.visible = false; bn.lampGl.visible = false; bn.rayS.visible = false; bn.ah3.visible = false; bn.blk.visible = false; bn.sw.visible = false;
  setRays(1); bn.hit.visible = true; bn.hit.material.opacity = 1; bn.hit.scale.setScalar(1.5);
  var un = clamp((t - t0) / .5); bn.rayN.visible = un > 0; e.setRay(bn.rayN, bn.P, bn.P.clone().add(bn.n.clone().multiplyScalar(1.7 * sstep(un))));
  var ur = clamp((t - tRefl) / 1.5); e.setRay(bn.rayR, bn.P, bn.P.clone().lerp(bn.rEnd, sstep(ur))); bn.rayR.visible = ur > 0; bn.ah2.visible = ur >= 1; bn.ah2.position.copy(bn.rEnd); e.orient(bn.ah2, bn.Rd);
  var ub = clamp((t - (tRefl + .9)) / .6); bn.bld.visible = ub > 0; bn.crown.visible = ub > 0; bn.bld.scale.setScalar(eo3(ub) || .001); bn.crown.scale.setScalar(eo3(ub) || .001); bn.bld.position.y = 2.7 * (eo3(ub) || .001); bn.crown.position.y = 5.5 * (eo3(ub) || .001);
  put(bl.l2, t, t0 + .4, .4); put(bl.l3, t, tRefl + .5, .4); put(bl.l5, t, tBld, .4); put(bl.l8, t, tPud, .4); var up = sstep(clamp((t - tPud) / .8)); bn.hot.material.color.copy(new THREE.Color(K.HOT).multiplyScalar(3).lerp(new THREE.Color(K.TUNG).multiplyScalar(3.4), up)); };
SCN[4] = function (t) { benchBase(t); var t0 = SC[4], tBl = WS('s1', 'छाया|छाया,', .45), tCl = WS('s1', 'रोशनी|रोशनी।|रोशनी,', .8); bn.eye.visible = true; bn.eye.scale.setScalar(1); bn.plane.visible = true; bn.lines.material.opacity = .6; bn.glassP.material.opacity = .07; bn.hot.visible = true; setRays(1); bn.hit.visible = true; bn.hit.material.opacity = 1;
  bn.rayN.visible = true; bn.rayR.visible = true; bn.ah2.visible = true; bn.bld.visible = true; bn.crown.visible = true; bn.bld.scale.setScalar(1); bn.crown.scale.setScalar(1); bn.bld.position.y = 2.7; bn.crown.position.y = 5.5; bn.hot.material.color.copy(new THREE.Color(K.TUNG).multiplyScalar(3.4));
  var ul = clamp((t - t0) / .5); bn.lamp.visible = bn.lampGl.visible = ul > 0; bn.lamp.scale.setScalar(eo3(ul) || .001); bn.lampGl.scale.set(4.6 * eo3(ul) || .01, 4.6 * eo3(ul) || .01, 1);
  var mid = bn.P.clone().lerp(bn.Lp, .52), us = clamp((t - (t0 + .5)) / 1.0), ub = clamp((t - (tBl - .5)) / .6), ua = clamp((t - (tCl - .1)) / .8), blocked = t >= tBl - .1 && t < tCl - .1;
  var bpos = mid.clone().add(new V3(0, 2.8 * (1 - eo3(ub)) + 2.8 * eo3(ua), 0)); bn.blk.visible = t >= tBl - .6 && ua < 1; bn.blk.position.copy(bpos); bn.blk.rotation.y = 0; var endPt = blocked ? mid.clone().add(new V3(0, -.05, 0)) : bn.Lp; var dir2 = endPt.clone().sub(bn.P);
  var reach = blocked ? clamp((t - (tBl - .1)) / .01) : 1; var fullU = sstep(us); var e2 = bn.P.clone().lerp(blocked ? mid : bn.Lp, blocked ? 1 : fullU); if (!blocked && t < tBl - .1) e2 = bn.P.clone().lerp(bn.Lp, fullU); e.setRay(bn.rayS, bn.P, e2); bn.rayS.visible = us > 0; bn.ah3.visible = us >= 1 && !blocked; bn.ah3.position.copy(bn.Lp.clone().sub(bn.Lp.clone().sub(bn.P).normalize().multiplyScalar(.5))); e.orient(bn.ah3, bn.Lp.clone().sub(bn.P));
  bn.rayS.material.color.copy(new THREE.Color(blocked ? K.COR : K.VIO).multiplyScalar(2.2)); var lit = t >= tCl; bn.hot.material.color.copy(new THREE.Color(K.TUNG).multiplyScalar(lit || t < tBl ? 3.4 : .5)); bn.lampGl.material.opacity = .95; bn.hit.material.opacity = lit || t < tBl ? 1 : .25;
  put(bl.l6, t, t0 + .8, .4); put(cardS, t, t0 + .2, .5, tBl + 1.2); put(bl.l9, t, tBl + .1, .4, tCl); put(bl.l10, t, tCl + .1, .4); };
window.__gS = gS; window.__tower = tower; window.__pm = pm;
})();
/* Part B2: scenes 5-10 (BVH, history, GPU + the math, noise + denoiser, hybrid limit, return to the puddle) */
(function () {
var e = E, S = e.S, V3 = e.V3, K = e.col, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, put = e.put, B = window.B, SC = window.SC;
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
function floorFor(g, y) { var fl = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), e.physMat(0x08090c, { roughness: .38, metalness: .35, envMapIntensity: .32 })); fl.rotation.x = -Math.PI / 2; fl.position.y = y || 0; g.add(fl); g.add(e.gridFloor(30, 1, 0x7f8aa0, .1)); g.children[g.children.length - 1].position.y = y || 0; }
function bg(t) { S.fog = new THREE.FogExp2(0x07080b, .028); S.background = new THREE.Color(0x07080b); }
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
/* ================= scene 5: BVH ================= */
var gV = grp(new THREE.Group()), V = {};
(function () { floorFor(gV, -2.6); var tk = new THREE.TorusKnotGeometry(1.5, .5, 90, 10, 2, 3).toNonIndexed(); var pos = tk.attributes.position, nt = pos.count / 3; var tri = [];
  for (var i = 0; i < nt; i++) { var a = new V3().fromBufferAttribute(pos, i * 3), b = new V3().fromBufferAttribute(pos, i * 3 + 1), c = new V3().fromBufferAttribute(pos, i * 3 + 2); tri.push({ a: a, b: b, c: c, m: a.clone().add(b).add(c).multiplyScalar(1 / 3) }); }
  tk.computeVertexNormals(); var mesh = new THREE.Mesh(tk, new THREE.MeshPhysicalMaterial({ color: 0x9a8566, metalness: .85, roughness: .34, envMapIntensity: .8, flatShading: true })); gV.add(mesh); V.mesh = mesh;
  var wf = new THREE.LineSegments(new THREE.WireframeGeometry(tk), new THREE.LineBasicMaterial({ color: K.COR, transparent: true, opacity: 0 })); gV.add(wf); V.wf = wf;
  function box(list) { var mn = new V3(1e9, 1e9, 1e9), mx = new V3(-1e9, -1e9, -1e9); list.forEach(function (t) { [t.a, t.b, t.c].forEach(function (p) { mn.min(p); mx.max(p); }); }); return { mn: mn, mx: mx }; }
  var levels = [[{ list: tri, bx: box(tri) }]]; for (var L = 1; L <= 6; L++) { var nx = []; levels[L - 1].forEach(function (n) { var sz = n.bx.mx.clone().sub(n.bx.mn), ax = sz.x > sz.y && sz.x > sz.z ? 'x' : sz.y > sz.z ? 'y' : 'z', s2 = n.list.slice().sort(function (p, q) { return p.m[ax] - q.m[ax]; }), h = s2.length >> 1, A = s2.slice(0, h), Bb = s2.slice(h); nx.push({ list: A, bx: box(A), par: n }, { list: Bb, bx: box(Bb), par: n }); }); levels.push(nx); }
  V.levels = levels; V.tri = tri; V.lines = [];
  for (var L2 = 0; L2 <= 6; L2++) { var pts = []; levels[L2].forEach(function (n) { var a = n.bx.mn, b = n.bx.mx, c = [[a.x, a.y, a.z], [b.x, a.y, a.z], [b.x, b.y, a.z], [a.x, b.y, a.z], [a.x, a.y, b.z], [b.x, a.y, b.z], [b.x, b.y, b.z], [a.x, b.y, b.z]]; [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (ed) { pts.push(new V3(c[ed[0]][0], c[ed[0]][1], c[ed[0]][2]), new V3(c[ed[1]][0], c[ed[1]][1], c[ed[1]][2])); }); });
    var ln = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(K.ICE).multiplyScalar(1.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); gV.add(ln); V.lines.push(ln); }
  /* the ray, its path through the boxes and the triangle it finally hits */
  V.o = new V3(-6.5, .8, 1.8); V.dir = new V3(1.5, .15, -.2).normalize(); function slabHit(bx) { var t0 = 0, t1 = 1e9; ['x', 'y', 'z'].forEach(function (a) { var d = V.dir[a], o = V.o[a]; if (Math.abs(d) < 1e-8) { if (o < bx.mn[a] || o > bx.mx[a]) t1 = -1; } else { var u = (bx.mn[a] - o) / d, w = (bx.mx[a] - o) / d; t0 = Math.max(t0, Math.min(u, w)); t1 = Math.min(t1, Math.max(u, w)); } }); return t1 >= t0 && t1 > 0 ? t0 : -1; }
  V.path = []; var cur = levels[0]; var hitSet = [levels[0][0]]; V.hitLevels = [[levels[0][0]]]; for (var L3 = 1; L3 <= 6; L3++) { var hs = []; levels[L3].forEach(function (n) { if (V.hitLevels[L3 - 1].indexOf(n.par) >= 0 && slabHit(n.bx) >= 0) hs.push(n); }); V.hitLevels.push(hs); }
  var hl = [], leaf = V.hitLevels[6]; var best = 1e9, ht = null; leaf.forEach(function (n) { n.list.forEach(function (t) { var e1 = t.b.clone().sub(t.a), e2 = t.c.clone().sub(t.a), pv = V.dir.clone().cross(e2), det = e1.dot(pv); if (Math.abs(det) < 1e-9) return; var inv = 1 / det, tv = V.o.clone().sub(t.a), u = tv.dot(pv) * inv; if (u < 0 || u > 1) return; var qv = tv.clone().cross(e1), v = V.dir.dot(qv) * inv; if (v < 0 || u + v > 1) return; var tt = e2.dot(qv) * inv; if (tt > 0 && tt < best) { best = tt; ht = t; } }); });
  V.hitT = best < 1e8 ? best : V.o.distanceTo(new V3(0, 0, 0)); V.tri1 = ht; V.hitP = V.o.clone().add(V.dir.clone().multiplyScalar(V.hitT));
  V.hl = V.hitLevels.map(function (L, i) { var pts = []; L.forEach(function (n) { var a = n.bx.mn, b = n.bx.mx, c = [[a.x, a.y, a.z], [b.x, a.y, a.z], [b.x, b.y, a.z], [a.x, b.y, a.z], [a.x, a.y, b.z], [b.x, a.y, b.z], [b.x, b.y, b.z], [a.x, b.y, b.z]]; [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (ed) { pts.push(new V3(c[ed[0]][0], c[ed[0]][1], c[ed[0]][2]), new V3(c[ed[1]][0], c[ed[1]][1], c[ed[1]][2])); }); });
    var ln = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(2.6), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); gV.add(ln); return ln; });
  V.ray = e.ray(V.o, V.hitP, K.HOT, .035); gV.add(V.ray);
  if (V.tri1) { var tg = new THREE.BufferGeometry().setFromPoints([V.tri1.a, V.tri1.b, V.tri1.c]); tg.computeVertexNormals(); V.tm = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(3), side: THREE.DoubleSide })); gV.add(V.tm); }
  V.glow = e.glow('w', 1.2, 1); V.glow.position.copy(V.hitP); gV.add(V.glow);
  V.c1 = e.dyn(.62, 780, 150, K.COR, function (x, a, b) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.COR); x.fillText(b, 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 50px "Martian Mono"'; x.fillText(a, 30, 112); });
  V.c2 = e.dyn(.62, 780, 150, K.ICE, function (x, a, b) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.ICE); x.fillText(b, 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 50px "Martian Mono"'; x.fillText(a, 30, 112); });
  V.c1.position.set(-1.3, 3.9, 0); V.c2.position.set(-1.3, 3.0, 0); gV.add(V.c1); gV.add(V.c2);
  V.card = e.card('BVH', 'dibbe ke andar dibbe: sahi triangle jaldi mile', K.ICE, 1.7); V.card.position.set(0, 5.6, 0); gV.add(V.card);
  V.note = e.lab('~27 BOX CHECKS FOR 100 M TRIANGLES\n(IDEAL BINARY TREE: log2 of 100,000,000)', K.ICE, .7, { fs: 40 }); V.note.position.set(0, -1.7, 1.2); gV.add(V.note);
  V.tl = e.lab('ILLUSTRATIVE MODEL · 2,880 TRIANGLES', K.CHALK, .34, { fs: 36 }); V.tl.position.set(-1.2, -2.3, 1.6); gV.add(V.tl); })();
e.shot(5, 'locked wide', SC[5], S0('v2'), [-.3, 2.8, 15.5], [-.4, .6, 0], 46, [-.3, 2.8, 15.5], [-.4, .6, 0], 46, 'io');
var tLeaf = S0('v2') + 7.0; e.shot(5, 'crane through the boxes', S0('v2') + .4, Math.max(S0('v2') + 6.6, S1('v2') - 1.6), [-.3, 2.8, 15.5], [-.4, .6, 0], 46, [-3.0, 1.8, 8.6], [V.hitP.x - .2, V.hitP.y, V.hitP.z], 40, 'io');
SCN[5] = function (t) { gV.visible = true; bg(t); var tv1 = S0('v1'), tv2 = S0('v2'), scan = t >= tv1 + .6 && t < tv2 + .1, n = clamp((t - (tv1 + .6)) / (tv2 - tv1 - .7));
  V.wf.material.opacity = scan ? .5 + .3 * Math.sin(t * 30) : 0; V.c1.visible = t > tv1 + .3; V.c1.draw(scan ? fmt(n * 100000000) + '+' : t >= tv2 ? '100,000,000+' : '0', 'TRIANGLES CHECKED, ONE BY ONE');
  var rp = sstep(clamp((t - (tv1 + .2)) / 1.1)); e.setRay(V.ray, V.o, V.o.clone().lerp(V.hitP, rp)); V.ray.visible = rp > 0; V.glow.visible = rp >= 1 && t > tLeaf; V.glow.scale.setScalar(1.2 + .3 * Math.sin(t * 6));
  for (var L = 0; L <= 6; L++) { var tl = tv2 + 1.0 + L * .85, u = clamp((t - tl) / .5); V.lines[L].material.opacity = (L === 0 ? .55 : .5 / (1 + L * .3)) * u * (t >= tLeaf ? .45 : 1); V.lines[L].visible = u > 0; var uh = clamp((t - (tl + .35)) / .4); V.hl[L].material.opacity = uh * .95; V.hl[L].visible = uh > 0; }
  var lvl = Math.max(0, Math.min(6, Math.floor((t - (tv2 + 1.0)) / .85) + 1)); V.c2.visible = t > tv2 + .9; V.c2.draw(t >= tLeaf ? '~27 (IDEAL)' : String(Math.min(27, lvl * 4)), 'BOX CHECKS (BOXES INSIDE BOXES)');
  if (V.tm) { V.tm.visible = t >= tLeaf; } V.mesh.material.opacity = 1; put(V.card, t, tv2 + .2, .5, tv2 + 4.4); put(V.note, t, WS('v2', 'सत्ताईस|सत्ताइस|सताईस', .75), .5); put(V.tl, t, tv1 + .3, .4); };
/* ================= scene 6: history rail ================= */
var gH = grp(new THREE.Group()), HT = [];
(function () { floorFor(gH, 0); var rail = new THREE.Mesh(new THREE.BoxGeometry(3.4, .12, 60), e.physMat(0x15171d, { metalness: .8, roughness: .3, envMapIntensity: .9 })); rail.position.set(0, .06, -22); gH.add(rail); var edge = new THREE.Mesh(new THREE.BoxGeometry(3.5, .04, 60), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.TUNG).multiplyScalar(1.1) })); edge.position.set(0, .0, -22); gH.add(edge);
  var defs = [{ z: 0, x: -1.25, yr: '1968', nm: 'APPEL', mat: e.physMat(0x8d939e, { roughness: .9, metalness: 0 }), col: K.CHALK }, { z: -6, x: 1.25, yr: '1979-80', nm: 'WHITTED', mat: e.physMat(0xffffff, { metalness: 1, roughness: .04, envMapIntensity: 1.7 }), col: K.ICE }, { z: -12, x: -1.25, yr: '2006', nm: 'PIXAR · CARS', mat: e.physMat(0xc0261c, { metalness: .2, roughness: .25, clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 1.6 }), col: K.COR }, { z: -18, x: 1.25, yr: '2018', nm: 'NVIDIA · RTX', mat: new THREE.MeshPhysicalMaterial({ color: 0x76b900, metalness: .6, roughness: .15, clearcoat: 1, envMapIntensity: 1.8, emissive: 0x76b900, emissiveIntensity: .25 }), col: K.SAGE }];
  defs.forEach(function (d, i) { var g = new THREE.Group(); var pil = new THREE.Mesh(new THREE.CylinderGeometry(.5, .6, 1.5, 36), e.physMat(0x20232b, { metalness: .9, roughness: .3, envMapIntensity: 1.2 })); pil.position.y = .8; g.add(pil); var sp = new THREE.Mesh(new THREE.SphereGeometry(.9, 64, 48), d.mat); sp.position.y = 2.3; g.add(sp);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(.9, .03, 10, 60), new THREE.MeshBasicMaterial({ color: new THREE.Color(d.col).multiplyScalar(2.4) })); ring.rotation.x = Math.PI / 2; ring.position.y = 1.55; g.add(ring);
    var gl = e.glow(i === 2 ? 'c' : i === 3 ? 's' : i === 1 ? 'i' : 'w', 4.4, .5); gl.position.y = 2.3; g.add(gl);
    var ly = e.lab(d.yr, d.col, .72, { fs: 64 }); ly.position.set(0, 4.5, 0); g.add(ly); var ln = e.lab(d.nm, d.col, .46); ln.position.set(0, 3.7, 0); g.add(ln); g.position.set(d.x, 0, d.z); gH.add(g); HT.push({ g: g, ly: ly, ln: ln, sp: sp }); });
  var cl = e.dyn(.7, 760, 170, K.COR, function (x, a, b, c, w, h) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.COR); x.fillText('ONE FRAME OF CARS (AVERAGE)', 30, 46); x.fillStyle = e.HEX(K.CHALK); x.font = '600 62px "Martian Mono"'; x.fillText(a, 30, 122); x.fillStyle = 'rgba(238,242,238,.15)'; x.fillRect(30, 140, w - 60, 10); x.fillStyle = e.HEX(K.COR); x.fillRect(30, 140, (w - 60) * b, 10); }); cl.position.set(0, 6.4, -12); gH.add(cl); HT.cl = cl; })();
e.shot(6, 'low track in', SC[6], SC[6] + 1, [0, 1.9, 9.5], [0, 2.2, -8], 44, [0, 1.9, 9.5], [0, 2.2, -8], 44, 'io');
var tAp = WS('y1', 'अड़सठ|अडसठ|अरसठ', .12), tWh = WS('y1', 'व्हिटेड|विटेड|व्हाइटेड|विट|टर्नर', .4), tCa = WS('y1', 'कार्स|कारस|कार', .8), tHr = WS('y1', 'सत्रह|सतरह', .93);
e.shot(6, 'truck down the rail', tAp - .2, tHr + 2.0, [0, 1.9, 9.5], [0, 2.2, -8], 44, [.6, 2.3, -4.6], [0, 2.4, -22], 44, 'io');
SCN[6] = function (t) { gH.visible = true; bg(t); var cues = [tAp, tWh, tCa, tHr + 1.4]; HT.forEach(function (h, i) { var u = clamp((t - cues[i]) / .5); h.g.visible = u > 0; h.g.scale.setScalar(eo3(u) || .001); h.g.position.y = (1 - eo3(u)) * -1.2; h.sp.rotation.y = t * .6; put(h.ly, t, cues[i] + .1, .4); put(h.ln, t, cues[i] + .25, .4); });
  var uc = clamp((t - (tCa + .5)) / 1.2); HT.cl.visible = uc > 0; HT.cl.draw('17 HOURS', sstep(clamp((t - (tCa + .8)) / 2.2)), 0); put(HT.cl, t, tCa + .5, .4); };
/* ================= scene 7: the GPU and the math ================= */
var gG = grp(new THREE.Group()), GP = {};
(function () { floorFor(gG, 0); var body = new THREE.Mesh(new THREE.BoxGeometry(5.4, .55, 2.5), e.physMat(0x101216, { metalness: .85, roughness: .32, envMapIntensity: 1.2 })); body.position.y = .55; gG.add(body);
  var plate = new THREE.Mesh(new THREE.BoxGeometry(5.5, .08, 2.6), e.physMat(0x2a2e38, { metalness: 1, roughness: .22, envMapIntensity: 1.6 })); plate.position.y = .88; gG.add(plate);
  GP.fans = []; [-1.35, 1.35].forEach(function (x) { var f = new THREE.Group(); var hub = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .1, 32), e.physMat(0x0c0d10, { metalness: .9, roughness: .3 })); f.add(hub); for (var i = 0; i < 9; i++) { var bl = new THREE.Mesh(new THREE.BoxGeometry(.52, .03, .2), e.physMat(0x1a1d24, { metalness: .8, roughness: .35 })); bl.position.set(.5, 0, 0); var pv = new THREE.Group(); pv.rotation.y = i / 9 * 6.2832; bl.rotation.y = .4; pv.add(bl); f.add(pv); } var rim = new THREE.Mesh(new THREE.TorusGeometry(.95, .06, 12, 64), e.physMat(0x20232b, { metalness: 1, roughness: .2 })); rim.rotation.x = Math.PI / 2; f.add(rim); f.position.set(x, 1.0, 0); gG.add(f); GP.fans.push(f); });
  var die = new THREE.Mesh(new THREE.BoxGeometry(.9, .12, .9), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x76b900).multiplyScalar(2.2) })); die.position.set(0, 1.06, 0); gG.add(die); GP.die = die; GP.dg = e.glow('s', 3.2, .8); GP.dg.position.set(0, 1.2, 0); gG.add(GP.dg);
  GP.c = e.dyn(.64, 800, 150, K.SAGE, function (x, a) { x.font = '600 26px "Martian Mono"'; x.fillStyle = e.HEX(K.SAGE); x.fillText('NVIDIA CLAIMS · PEAK', 30, 44); x.fillStyle = e.HEX(K.CHALK); x.font = '600 48px "Martian Mono"'; x.fillText(a, 30, 112); }); GP.c.position.set(0, 4.7, 0); gG.add(GP.c);
  GP.l1 = e.lab('RT CORE · BVH + TRIANGLE TESTS', K.SAGE, .42); GP.l1.position.set(0, 2.6, 0); gG.add(GP.l1);
  GP.e1 = e.lab('1920 × 1080 × 60', K.CHALK, .66, { fs: 56 }); GP.e1.position.set(0, 4.2, 1.2); gG.add(GP.e1); GP.e2 = e.lab('= 124.4 MILLION PIXELS / SEC', K.ICE, .52, { fs: 44 }); GP.e2.position.set(0, 3.4, 1.2); gG.add(GP.e2);
  GP.e3 = e.lab('10 B ÷ 124.4 M ≈ 80 RAYS / PIXEL', K.SAGE, .56, { fs: 46 }); GP.e3.position.set(0, 2.5, 1.2); gG.add(GP.e3); GP.e4 = e.lab('ON PAPER · AT THE CLAIMED PEAK', K.COR, .4, { fs: 38 }); GP.e4.position.set(0, 1.7, 1.4); gG.add(GP.e4); })();
var tC = WS('y2', 'अरब|दस', .8), tM1 = WS('m1', 'फ़ुल|फुल|फ्ल', .15), tM2 = WS('m1', 'करोड़|करोर', .62), tM3 = WS('m1', 'अस्सी|अस्सि|अससी', .92);
e.shot(7, 'orbit the card', SC[7], tC + 2.4, [-6.5, 3.6, 7.5], [0, .9, 0], 44, [5.8, 3.4, 7.4], [0, 1.1, 0], 44, 'io');
e.shot(7, 'rise to the math', tM1 - .5, tM1 + 1.6, [5.8, 3.4, 7.4], [0, 1.1, 0], 44, [0, 3.2, 10.2], [0, 1.3, 0], 46, 'io');
SCN[7] = function (t) { gG.visible = true; bg(t); GP.fans.forEach(function (f, i) { f.rotation.y = t * (i ? 6 : -6); }); var pulse = .5 + .5 * Math.sin(t * 5); GP.die.material.color.copy(new THREE.Color(0x76b900).multiplyScalar(1.8 + pulse * 1.2)); GP.dg.material.opacity = .55 + pulse * .3;
  var uc = clamp((t - tC) / .9); GP.c.visible = uc > 0; GP.c.draw(fmt(10000000000 * sstep(uc)) + ' RAYS / SEC'); put(GP.l1, t, SC[7] + .8, .4, tM1 - .3); put(GP.e1, t, tM1, .45); put(GP.e2, t, tM2, .45); put(GP.e3, t, tM3, .5); put(GP.e4, t, tM3 + .6, .4); GP.c.visible = uc > 0 && t < tM1 + 5 && true; };
/* ================= scene 8: noise + denoiser ================= */
var gP = grp(new THREE.Group()), PN = {};
(function () { var tx = B.pt(); floorFor(gP, -4.4); var panels = [{ x: -1.72, y: 2.05, lbl: '1 RAY / PIXEL', col: K.COR, map: tx.t1 }, { x: 1.72, y: 2.05, lbl: '8 RAYS / PIXEL', col: K.TUNG, map: tx.t8 }, { x: -1.72, y: -1.9, lbl: '64 RAYS / PIXEL', col: K.ICE, map: tx.t64 }, { x: 1.72, y: -1.9, lbl: '1 RAY + DENOISER', col: K.SAGE, map: null }]; PN.p = [];
  var wipeMat = new THREE.ShaderMaterial({ uniforms: { a: { value: tx.noisy }, b: { value: tx.clean }, m: { value: 0 } }, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'uniform sampler2D a,b;uniform float m;varying vec2 vUv;void main(){vec3 ca=texture2D(a,vUv).rgb,cb=texture2D(b,vUv).rgb;float w=smoothstep(m-.02,m+.02,vUv.x);vec3 c=mix(cb,ca,w);c+=vec3(1.,.95,.7)*exp(-pow((vUv.x-m)*30.,2.))*step(.001,m)*step(m,.999)*.9;gl_FragColor=vec4(c,1.);}' }); PN.wipe = wipeMat;
  panels.forEach(function (p, i) { var g = new THREE.Group(), fr = new THREE.Mesh(new THREE.BoxGeometry(3.28, 3.28, .22), e.physMat(0x15171d, { metalness: .85, roughness: .3, envMapIntensity: 1.2 })); g.add(fr); var scr = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), i === 3 ? wipeMat : new THREE.MeshBasicMaterial({ map: p.map, toneMapped: false })); scr.position.z = .115; g.add(scr);
    var ed = new THREE.Mesh(new THREE.BoxGeometry(3.4, .07, .26), new THREE.MeshBasicMaterial({ color: new THREE.Color(p.col).multiplyScalar(2.4) })); ed.position.set(0, -1.7, 0); g.add(ed); var l = e.lab(p.lbl, p.col, .36); l.position.set(0, -2.12, .3); g.add(l); g.position.set(p.x, p.y, 0); g.rotation.y = (p.x < 0 ? 1 : -1) * .1; gP.add(g); PN.p.push({ g: g, l: l }); });
  PN.card = e.card('DENOISER', 'daane-daane tasveer ko saaf karta hai', K.SAGE, 1.7); PN.card.position.set(0, 2.2, .6); gP.add(PN.card); PN.note = e.lab('A DENOISER GUESSES: SOFTER, NOT PERFECT', K.SAGE, .36, { fs: 34 }); PN.note.position.set(0, -3.9, .4); gP.add(PN.note); })();
var tN1 = S0('n1'), tDn = WS('n1', 'डीनॉइज़र|डिनोइज़र|डीनोइज़र|डीनॉइजर|डीनॉयज़र', .72), tDa = WS('n1', 'दाने|दाना|दानेदार', .3);
e.shot(8, 'locked front', tN1, tDn - .3, [0, -1.0, 20.5], [0, -1.2, 0], 40, [0, -1.0, 20.5], [0, -1.2, 0], 40, 'io');
e.shot(8, 'push to the clean panel', tDn - .2, tDn + 2.2, [0, -1.0, 20.5], [0, -1.2, 0], 40, [.9, -1.8, 13.8], [.5, -1.7, 0], 40, 'io');
SCN[8] = function (t) { gP.visible = true; bg(t); var cues = [tN1 + .1, tDa, tDa + 1.0, tDn + 1.6]; PN.p.forEach(function (p, i) { var u = i === 3 ? clamp((t - (tDn + .3)) / .6) : clamp((t - cues[i]) / .5), top = i < 2 && t > tDn + .2, k = top ? 1 - sstep(clamp((t - (tDn + .2)) / .5)) : 1; p.g.visible = u > 0 && k > .01; p.g.scale.setScalar(eo3(u) * k || .001); put(p.l, t, cues[i] + .2, .35); if (top) p.l.visible = false; });
  PN.wipe.uniforms.m.value = clamp((t - (tDn + .7)) / 1.8); put(PN.card, t, tDn + .15, .5, tDn + 3.4); put(PN.note, t, tDn + 2.6, .4); };
/* ================= scene 9: hybrid limit ================= */
var gL = grp(new THREE.Group()), LM = {};
(function () { floorFor(gL, -2.4); var cols = 22, rows = 14, cw = .3; LM.cols = cols; LM.rows = rows; function slab(y, col, em) { var im = new THREE.InstancedMesh(new THREE.BoxGeometry(cw * .86, .1, cw * .86), new THREE.MeshStandardMaterial({ color: col, metalness: .3, roughness: .4, emissive: em, emissiveIntensity: .5 }), cols * rows); var m = new THREE.Matrix4(); for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) { m.setPosition((i - cols / 2) * cw, y, (j - rows / 2) * cw); im.setMatrixAt(j * cols + i, m); } im.userData.base = []; return im; }
  LM.rast = slab(0, 0x1d2c45, 0x2a4a80); gL.add(LM.rast); LM.rayL = slab(1.6, 0x3b4d3f, 0x9be3b0); gL.add(LM.rayL); var col = new THREE.Color(); for (var i = 0; i < cols * rows; i++) { var real = hash(i * 13 + 5) < .07; LM.rayL.setColorAt(i, col.set(real ? new THREE.Color(K.HOT).multiplyScalar(2.2) : new THREE.Color(0x35423a))); LM.rast.setColorAt(i, col.set(0x1d2c45)); }
  LM.real = []; for (var q = 0; q < cols * rows; q++) if (hash(q * 13 + 5) < .07) LM.real.push(q);
  LM.l1 = e.lab('REAL RAYS (FEW)', K.HOT, .46); LM.l1.position.set(-1.6, 2.7, 2.7); gL.add(LM.l1); LM.l2 = e.lab('GUESSED BY THE DENOISER', K.SAGE, .46); LM.l2.position.set(.2, 2.2, -2.9); gL.add(LM.l2); LM.l3 = e.lab('OLDER METHOD (RASTER)', K.ICE, .46); LM.l3.position.set(0, .6, 3.4); gL.add(LM.l3); LM.l4 = e.lab('MOST GAMES = HYBRID', K.TUNG, .62, { fs: 52 }); LM.l4.position.set(0, 4.5, 0); gL.add(LM.l4); LM.l5 = e.lab('SCHEMATIC · NOT A MEASUREMENT', K.CHALK, .34, { fs: 34 }); LM.l5.position.set(0, -1.1, 3.9); gL.add(LM.l5); })();
var tA1 = WS('e1', 'असली|असल', .45), tA2 = WS('e1', 'अंदाज़ा|अंदाजा|अंदाज', .8), tA3 = WS('e1', 'पुराने|पुरान', .4);
e.shot(9, 'top-down', SC[9], tA3 - .5, [0, 17, 2.6], [0, 0, 0], 42, [0, 17, 2.6], [0, 0, 0], 42, 'io');
e.shot(9, 'tilt up to show the layers', tA3 - .4, tA3 + 2.6, [0, 17, 2.6], [0, 0, 0], 42, [7.2, 6.4, 11.5], [0, 1.1, 0], 44, 'io');
SCN[9] = function (t) { gL.visible = true; bg(t); var c = new THREE.Color(); LM.real.forEach(function (q) { var u = clamp((t - (tA1 + (hash(q) * .8))) / .3); LM.rayL.setColorAt(q, c.copy(new THREE.Color(0x35423a)).lerp(new THREE.Color(K.HOT).multiplyScalar(2.2), u)); });
  var ug = clamp((t - tA2) / 1.4); for (var i = 0; i < LM.cols * LM.rows; i++) if (LM.real.indexOf(i) < 0) LM.rayL.setColorAt(i, c.copy(new THREE.Color(0x35423a)).lerp(new THREE.Color(K.SAGE).multiplyScalar(.55 + .25 * hash(i)), clamp(ug * 1.4 - hash(i * 3) * .4)));
  LM.rayL.instanceColor.needsUpdate = true; var lift = sstep(clamp((t - (tA3 - .3)) / 1.6)); LM.rayL.position.y = lift * 1.4; LM.rast.visible = t >= tA3 - .6; LM.rast.position.y = -lift * .1; put(LM.l1, t, tA1, .4); put(LM.l2, t, tA2 + .2, .4); put(LM.l3, t, tA3 + .5, .4); put(LM.l4, t, tA3 + 1.2, .45); put(LM.l5, t, SC[9] + .6, .4); };
/* ================= scene 10: back to the puddle - the whole trace ================= */
var gS = window.__gS, tw = window.__tower, EYEP = new V3(.7, 1.15, 6.4), QP = new V3(.1, 0, -3.4), TP2 = new V3(0, 17, -46 + 6.3);
var r1 = e.ray(EYEP, QP, K.HOT, .035), r2 = e.ray(QP, TP2, K.ICE, .035); gS.add(r1); gS.add(r2); var ql = e.glow('w', 1.4, 1); ql.position.copy(QP); gS.add(ql); var t10 = SC[10], tTr = WS('f1', 'उल्टी|उल्टा|उलटी', .45), tQ = WS('f1', 'पिक्सल|पिक्सेल', .7);
e.shot(10, 'hold on the puddle', t10, tTr - .2, [.3, .95, 5.5], [.1, -3.2, -3.6], 44, [.3, .95, 5.5], [.1, -3.2, -3.6], 44, 'io');
e.shot(10, 'crane up and back', tTr, S0('cta') - .2, [.3, .95, 5.5], [.1, -3.2, -3.6], 44, [4, 5.4, 17], [0, 10, -40], 46, 'io');
SCN[10] = function (t) { gS.visible = true; tw.visible = true; S.fog = new THREE.FogExp2(0x0a0e1a, .011); S.background = new THREE.Color(0x0a0e1a); window.__pm.uniforms.uT.value = t; var u1 = clamp((t - tTr) / 1.2), u2 = clamp((t - (tTr + 1.0)) / 1.6); e.setRay(r1, EYEP, EYEP.clone().lerp(QP, sstep(u1))); r1.visible = u1 > 0; e.setRay(r2, QP, QP.clone().lerp(TP2, sstep(u2))); r2.visible = u2 > 0; ql.visible = u1 >= 1; ql.scale.setScalar(1.4 + .3 * Math.sin(t * 6)); };
window.__r10 = [r1, r2, ql];
})();
/* Part C: DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, eo3 = e.eo3, sstep = e.sstep, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['A PUDDLE · A MISSING BUILDING', 'ONE BULB · BILLIONS OF RAYS', 'THE FLIP · EYE → PIXEL → WORLD', 'THE BOUNCE · WHAT THE BALL SHOWS', 'SHADOW RAY · LIGHT OR BLOCKED', 'BVH · BOXES INSIDE BOXES', '1968 → 2018 · FIFTY YEARS OF RAYS', 'RTX · 10 BILLION RAYS (CLAIMED)', '1 RAY OR 64 · NOISE AND DENOISE', 'REAL RAYS + GUESSES', 'THE WHOLE TRACE · ONE PIXEL'];
var HL = ['Puddle mein woh <b>building</b> jo screen par hai hi nahi', 'Ek bulb, arbon kirnein, <b>kam</b> kaam ki', 'Kiran <b>aankh</b> se, ulti taraf', 'Sheeshe se <b>uchhal</b> kar doosri kiran', 'Shadow bhi ek <b>sawaal</b> hai', 'Karodon triangles, <b>dibbe</b> ke andar dibbe', 'Idea <b>purana</b>, hardware naya', '10 arab kirnein? <b>Math</b> karo', 'Kam kirnein = <b>daane</b>', 'Asli kirnein + <b>andaza</b>', 'Puddle ka <b>raaz</b>'];
var hdr = D('', 'left:150px;top:150px;width:780px', '<div id="eb" style="font:600 25px \'Martian Mono\';letter-spacing:.14em;color:#ffc46b;display:flex;align-items:center;gap:14px;text-shadow:0 2px 10px #000"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#ffc46b;box-shadow:0 0 14px #ffc46b"></i><span id="ebt"></span></div><div id="hl" style="font:400 92px/.98 \'Instrument Serif\',serif;letter-spacing:-.01em;margin-top:16px;text-shadow:0 4px 22px rgba(0,0,0,.75)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "Martian Mono";letter-spacing:.06em;color:rgba(238,242,238,.62);text-shadow:0 2px 8px #000;white-space:nowrap', '');
hl.style.setProperty('--b', '1');
var TAGS = ['ILLUSTRATIVE SCENE', 'ILLUSTRATIVE · 520 RAYS DRAWN FOR BILLIONS', 'ILLUSTRATIVE SCENE', 'ILLUSTRATIVE SCENE', 'ILLUSTRATIVE SCENE', 'ILLUSTRATIVE MODEL · NOT A GAME SCENE', 'SOURCES: APPEL 1968 · WHITTED 1980 · D23 (CARS) · REPORTED', 'NVIDIA SIGGRAPH 2018 CLAIM · PEAK, NOT A BENCHMARK', 'REAL PATH TRACER · SAME SCENE · 4 SETTINGS', 'SCHEMATIC · NOT A MEASUREMENT', 'ILLUSTRATIVE SCENE'];
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(7,8,11,0),rgba(7,8,11,.9) 22%,rgba(7,8,11,.9) 80%,rgba(7,8,11,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #eef2ee;box-shadow:0 0 0 6px #ffc46b,0 0 60px 8px rgba(255,196,107,.45);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#eef2ee;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#ffc46b;font:600 26px "Martian Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#eef2ee', 190], ['share', 'SHARE', '#7fd6ff', 210], ['bell-ringing', 'SUBSCRIBE', '#ffc46b', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:rgba(7,8,11,.9);display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "Martian Mono";letter-spacing:.05em;color:#eef2ee;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ffc46b', chipInk: '#07080b', keywords: { 'ray': '#7fd6ff', 'pixel': '#fffaf0', 'kirnein': '#ffc46b', 'kiran': '#ffc46b', 'shadow': '#b07cff', 'BVH': '#7fd6ff', 'RTX': '#9be3b0', 'denoiser': '#9be3b0' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = [1, 2, 5, 6, 7, 8, 9, 10].map(function (k) { return SC[k]; }), tCta = S0('cta');
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.1, 'slam'); ev(3.4, 'ping'); DIPS.forEach(function (d) { ev(d - .1, 'whoosh'); });
  var t1 = SC[1] + .2; for (var i = 0; i < 8; i++) ev(t1 + i * .4, 'tick'); ev(WS('p1', 'आँख|आंख|पहुँचती', .8), 'ping'); ev(WS('p2', 'नुकसान|बड़ा', .4), 'buzz');
  var t2 = SC[2]; ev(t2 + .2, 'pop'); ev(t2 + .9, 'pop'); ev(WS('r1', 'बाहर|तरफ़|भेजो', .65), 'whoosh'); ev(WS('r1', 'प्राइमरी', .9), 'card'); ev(S0('r2') + .2, 'ping');
  ev(SC[3] + .3, 'pop'); ev(WS('b1', 'उछलकर|उछल', .25), 'whoosh'); ev(WS('b1', 'उछलकर|उछल', .25) + 1.0, 'pop'); ev(WS('b1', 'पडल|पुडल|पड्डल|पडल्', .8), 'ping');
  ev(SC[4] + .1, 'pop'); ev(SC[4] + .3, 'card'); ev(WS('s1', 'छाया', .45), 'buzz'); ev(WS('s1', 'रोशनी', .8), 'ping');
  var v2 = S0('v2'); for (var k = 0; k < 8; k++) ev(S0('v1') + .8 + k * .4, 'tick'); ev(v2 + .2, 'card'); for (var L = 0; L <= 6; L++) ev(v2 + 1.0 + L * .85, 'pop'); ev(v2 + 7.0, 'ping');
  ev(WS('y1', 'अड़सठ|अडसठ', .12), 'pop'); ev(WS('y1', 'व्हिटेड|विटेड|टर्नर', .4), 'pop'); ev(WS('y1', 'कार्स|कारस', .8), 'pop'); for (var m = 0; m < 6; m++) ev(WS('y1', 'कार्स|कारस', .8) + .8 + m * .35, 'tick'); ev(WS('y1', 'सत्रह|सतरह', .93) + 1.4, 'pop');
  ev(WS('y2', 'अरब|दस', .8), 'card'); for (var n = 0; n < 6; n++) ev(WS('y2', 'अरब|दस', .8) + n * .15, 'tick'); ev(WS('m1', 'फ़ुल|फुल', .15), 'pop'); ev(WS('m1', 'करोड़', .62), 'pop'); ev(WS('m1', 'अस्सी', .92), 'ping');
  var n1 = S0('n1'); ev(n1 + .1, 'pop'); ev(WS('n1', 'दाने|दाना', .3), 'pop'); ev(WS('n1', 'दाने|दाना', .3) + 1, 'pop'); var dn = WS('n1', 'डीनॉइज़र|डिनोइज़र|डीनोइज़र', .72); ev(dn + .15, 'card'); ev(dn + .7, 'whoosh'); ev(dn + 1.6, 'ping');
  ev(WS('e1', 'असली|असल', .45), 'ping'); ev(WS('e1', 'अंदाज़ा|अंदाजा', .8), 'pop'); ev(WS('e1', 'पुराने', .4), 'whoosh');
  var f1 = WS('f1', 'उल्टी|उल्टा', .45); ev(f1, 'whoosh'); ev(f1 + 1.0, 'whoosh'); ev(f1 + 2.5, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्सक्राइब|सबस्क्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.2, .12, .1, .1, .1, .1, .12, .12, .06, .08, .2], FOC = { 8: 20, 9: 14 };
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t);
  GR.forEach(function (g) { g.visible = false; }); window.__lbAll && 0; e.hideLabels();
  S.fog = null; SCN[sc](t); e.camAt(sc, t); e.applyCam(); var hv = (t - SC[sc]) < 4.2 && !(sc === 10 && t > S0('cta') - 1); SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:400;background:#ffc46b;color:#07080b;padding:0 12px;border-radius:2px;text-shadow:none'; });
  hdr.style.opacity = (sc === 10 && t >= tCta - .1) ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo * 1 + 0)); hdr.querySelector('#hl').style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u) * (sc === 10 && t >= tCta - .1 ? 0 : 1);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (sc === 10 && t >= tCta - .1 ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); }, ec = sc === 10 && t >= tCta - .1;
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्सक्राइब|सबस्क्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  var dip = 0; DIPS.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#07080b'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 22; e.POST.bloom = sc === 8 ? .6 : 1.0; e.POST.seed = (t * 37) % 97; e.POST.fade = ec ? .0 : 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
