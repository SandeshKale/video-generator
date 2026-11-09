/* "Optical Bench" 3D film — Part A: premium render engine (HDR studio environment, physical materials, planar puddle reflection,
   depth-of-field + bloom + grade post chain), authored camera shots, labels, ray primitives. Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3;
var TUNG = 0xff8a1f, HOT = 0xf4ecd8, ICE = 0x3de0a8, VIO = 0x6a7bff, COR = 0xff4d5e, SAGE = 0x3de0a8, CHALK = 0x0b1230, BENCH = 0x0d1433, PLUM = 0x0b1230, CREAM = 0xf4ecd8;
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
  if (!e) { var fs = o.fs || 56, f = o.font || '600 ' + fs + 'px "DM Mono"', c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = o.pad || 24, lh = fs * 1.25; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
    x.fillStyle = o.bgc || 'rgba(244,236,216,.97)'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = HEX(col); x.fillRect(0, 0, 10, c.height); x.strokeStyle = 'rgba(11,18,48,.35)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, c.width - 3, c.height - 3);
    x.fillStyle = HEX(o.tcol == null ? PLUM : o.tcol); x.textBaseline = 'middle'; x.textAlign = 'left'; lines.forEach(function (l, i) { x.fillText(l, pad + 8, pad * .55 + lh * (i + .5) + 2); });
    var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; e = LC[k] = { tx: tx, asp: c.width / c.height }; }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: e.tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * e.asp, hh, 1); s.userData = { lbl: true, kind: 'lab', sx: hh * e.asp, sy: hh, sz: 1, txt: text.slice(0, 24) }; LBL.push(s); return s; }
function card(term, meaning, col, hh) { var c = document.createElement('canvas'), w = 940, h = 340; c.width = w; c.height = h; var x = c.getContext('2d'); x.fillStyle = 'rgba(244,236,216,.98)'; x.fillRect(0, 0, w, h); x.strokeStyle = HEX(col); x.lineWidth = 7; x.strokeRect(3.5, 3.5, w - 7, h - 7);
  x.fillStyle = HEX(col); x.fillRect(0, 0, w, 62); x.fillStyle = '#0b1230'; x.font = '600 27px "DM Mono"'; x.textBaseline = 'middle'; x.fillText('THIS IS CALLED', 30, 33); x.beginPath(); x.arc(w - 40, 31, 11, 0, 6.283); x.fill();
  x.fillStyle = HEX(PLUM); var tfs = 96; x.font = '900 ' + tfs + 'px Chakra Petch'; while (x.measureText(term).width > w - 60 && tfs > 30) { tfs -= 4; x.font = '900 ' + tfs + 'px Chakra Petch'; } x.fillText(term, 30, 150);
  x.fillStyle = 'rgba(11,18,48,.85)'; x.font = '600 36px Inter'; meaning.split('\n').forEach(function (l, i) { x.fillText(l, 30, 232 + i * 50); });
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
var GOLD = 0xff8a1f, PLUM = 0x0b1230, CREAM = 0xf4ecd8, GREEN = 0x3de0a8, RED = 0xff4d5e, BLUSH = 0x0d1433, CORAL = 0x6a7bff, SKIN = 0xd9a27a;
var K = { GOLD: GOLD, PLUM: PLUM, CREAM: CREAM, GREEN: GREEN, RED: RED, BLUSH: BLUSH, CORAL: CORAL, SKIN: SKIN };
var B = window.B = { K: K };
/* live counter sprite (cream card, coloured edge) */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'dyn', sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s);
  s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(244,236,216,.98)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 12, h); x.strokeStyle = 'rgba(11,18,48,.35)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function rr(w, h, r) { var s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function rbox(w, h, d, r, mat, bev) { var g = new THREE.ExtrudeGeometry(rr(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: bev || .05, bevelSize: bev || .05, bevelSegments: 3, curveSegments: 10 }); g.translate(0, 0, -d / 2); return new THREE.Mesh(g, mat); }
function tcv(w, h, fn) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); fn(x, w, h); return c; }
function plane(w, h, canvas, tr) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(canvas), transparent: !!tr, toneMapped: false })); return m; }
function M(c, o) { return e.physMat(c, Object.assign({ roughness: .6, metalness: .05 }, o || {})); }
var GM = function () { return M(GOLD, { metalness: .75, roughness: .35, envMapIntensity: .9 }); };
B.rr = rr; B.rbox = rbox; B.tcv = tcv; B.plane = plane; B.M = M; B.GM = GM;
B.floor = function (g, y, r) { var fl = new THREE.Mesh(new THREE.CircleGeometry(r || 60, 64), e.physMat(0x1a2250, { roughness: .8, metalness: 0, envMapIntensity: .5 })); fl.rotation.x = -Math.PI / 2; fl.position.y = y || 0; g.add(fl); var gr = e.gridFloor(40, 2, 0x6a7bff, .16); gr.position.y = (y || 0) + .01; g.add(gr); return fl; };
/* the bill card: front face drawn on a canvas. kind: 'bill' | 'rent' | 'water' | 'medical' */
B.card = function (title, amount, sub, o) { o = o || {}; var g = new THREE.Group(), body = rbox(2.6, 1.7, .08, .22, e.physMat(o.paper || CREAM, { roughness: .5 }), .02); g.add(body);
  var f = plane(2.5, 1.62, tcv(520, 340, function (x, w, h) { x.fillStyle = o.paper ? '#' + ('000000' + o.paper.toString(16)).slice(-6) : '#f4ecd8'; x.fillRect(0, 0, w, h); x.strokeStyle = '#0b1230'; x.lineWidth = 8; x.strokeRect(6, 6, w - 12, h - 12); x.fillStyle = '#0b1230'; x.font = '600 30px "DM Mono"'; x.fillText(title, 34, 66);
    var fs = 86; x.font = '900 ' + fs + 'px Chakra Petch'; while (x.measureText(amount).width > w - 64 && fs > 30) { fs -= 4; x.font = '900 ' + fs + 'px Chakra Petch'; } x.fillText(amount, 30, 175);
    x.fillStyle = o.subcol || '#ff4d5e'; x.font = '600 26px "DM Mono"'; x.fillText(sub || '', 34, 232); x.fillStyle = 'rgba(11,18,48,.14)'; x.fillRect(34, 262, 300, 16); x.fillRect(34, 290, 210, 16); x.fillStyle = 'rgba(11,18,48,.3)'; for (var i = 0; i < 8; i++) x.fillRect(w - 52, 262 + i * 0, 0, 0); })); f.position.z = .06; g.add(f); g.userData.face = f; return g; };
B.stamp = function (txt, col, w, h, fs) { var c = tcv(760, 260, function (x, W, H) { x.strokeStyle = col; x.lineWidth = 16; x.strokeRect(14, 14, W - 28, H - 28); x.fillStyle = col; x.font = '900 ' + (fs || 112) + 'px Chakra Petch'; x.textAlign = 'center'; x.textBaseline = 'middle'; var ls = txt.split('\n'); ls.forEach(function (l, i) { x.fillText(l, W / 2, H * (i + .5) / ls.length + 4); }); }); return plane(w || 4.2, h || 1.44, c, true); };
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
/* spam-call additions: headset agent, phone screen, sign plane */
(function () { var e = E, B = window.B, K = B.K, M = B.M;
B.agent = function (shirt, hat) { var g = B.voxel(false, shirt == null ? K.GOLD : shirt); var hd = g.userData.head; var band = new THREE.Mesh(new THREE.BoxGeometry(.7, .08, .66), M(0x1b1220)); band.position.set(0, .34, 0); hd.add(band); [-.36, .36].forEach(function (x) { var c = new THREE.Mesh(new THREE.BoxGeometry(.12, .3, .3), M(0x1b1220)); c.position.set(x, 0, 0); hd.add(c); }); var mic = new THREE.Mesh(new THREE.BoxGeometry(.06, .06, .3), M(0x1b1220)); mic.position.set(.3, -.2, .3); hd.add(mic); return g; };
B.sign = function (txt, col, w, h, fs, tcol) { return B.plane(w, h, B.tcv(512, Math.round(512 * h / w), function (x, W, H) { x.fillStyle = col; x.fillRect(0, 0, W, H); x.strokeStyle = '#0b1230'; x.lineWidth = 10; x.strokeRect(5, 5, W - 10, H - 10); x.fillStyle = tcol || '#0b1230'; x.font = '700 ' + (fs || 150) + 'px "Chakra Petch"'; x.textAlign = 'center'; x.textBaseline = 'middle'; var ls = txt.split('\n'); ls.forEach(function (l, i) { x.fillText(l, W / 2, H * (i + .5) / ls.length + 4); }); })); };
B.callScreen = function (title, sub, col) { return B.tcv(540, 1100, function (x) { x.fillStyle = '#10183d'; x.fillRect(0, 0, 540, 1100); x.fillStyle = col || '#ff8a1f'; x.beginPath(); x.arc(270, 330, 130, 0, 6.283); x.fill(); x.fillStyle = '#0b1230'; x.font = '700 150px "Chakra Petch"'; x.textAlign = 'center'; x.fillText('?', 270, 385); x.fillStyle = '#f4ecd8'; x.font = '700 58px "Chakra Petch"'; x.fillText(title, 270, 600); x.font = '600 30px "DM Mono"'; x.fillText(sub, 270, 660); x.fillStyle = '#ff4d5e'; x.beginPath(); x.arc(150, 900, 70, 0, 6.283); x.fill(); x.fillStyle = '#3de0a8'; x.beginPath(); x.arc(390, 900, 70, 0, 6.283); x.fill(); x.fillStyle = '#0b1230'; x.font = '700 70px Inter'; x.fillText('✕', 150, 925); x.fillText('✆', 390, 925); }); };
B.bgc = function (fog) { e.S.background = new THREE.Color(K.BLUSH); e.S.fog = new THREE.FogExp2(K.BLUSH, fog == null ? .014 : fog); };
})();
/* Part B1 (spam call): scenes 0-3 (hook, 41.7 billion, the 1400/1600 street, the reversal) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS;
var SC = window.SC = [0, S0('s1'), S0('t1'), S0('r1'), S0('f1'), S0('d1'), S0('x1'), S0('c1')];
window.GR = []; window.SCN = [];
function grp(g) { g.visible = false; S.add(g); GR.push(g); return g; }
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.fmt = fmt; window.grp = grp; window.sw = sw;
function dm(d) { return d; }
/* ===== scene 0: the hook ===== */
var gA = grp(new THREE.Group()), A = {};
(function () { B.floor(gA, 0, 40);
  var desk = new THREE.Mesh(new THREE.BoxGeometry(9, .5, 3.6), M(0x2b3678, { roughness: .5 })); desk.position.set(0, 1.9, 0); gA.add(desk); [-4, 4].forEach(function (x) { var l = new THREE.Mesh(new THREE.BoxGeometry(.4, 1.9, 3), M(0x2b3678)); l.position.set(x, .95, 0); gA.add(l); });
  A.user = B.voxel(false, K.CORAL); A.user.position.set(-2.8, 2.15, -.4); A.user.scale.setScalar(1.15); A.user.rotation.y = .35; gA.add(A.user);
  var lap = new THREE.Mesh(new THREE.BoxGeometry(2.2, .12, 1.5), M(0x7f89c8)); lap.position.set(-2.8, 2.2, 1.0); gA.add(lap); var lscr = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, .1), M(0x7f89c8)); lscr.position.set(-2.8, 2.9, .3); lscr.rotation.x = -.15; gA.add(lscr);
  A.ph = B.phone(B.callScreen('UNKNOWN', '+91 ·····  · 2:47 PM')); A.ph.position.set(2.3, 4.6, .4); A.ph.scale.setScalar(.62); A.ph.rotation.y = -.2; gA.add(A.ph);
  A.rings = [0, 1, 2].map(function () { var r = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.8), transparent: true, depthWrite: false })); r.position.set(2.3, 4.6, .8); gA.add(r); return r; });
  A.agent = B.agent(K.GOLD); A.agent.position.set(4.6, 2.15, 1.5); A.agent.scale.setScalar(.9); A.agent.rotation.y = -.5; gA.add(A.agent);
  A.card = B.card('LOAN · PRE-APPROVED', '₹5,00,000', 'NOBODY ASKED', { subcol: '#ff4d5e' }); A.card.scale.setScalar(.8); gA.add(A.card);
  A.l1 = e.lab('YOU · IN A MEETING', K.CORAL, .5, { fs: 40 }); A.l1.position.set(-2.8, 6.3, 0); gA.add(A.l1); A.l2 = e.lab('"SIR, LOAN CHAHIYE?"', K.GOLD, .6, { fs: 44 }); A.l2.position.set(4.2, 6.6, 1); gA.add(A.l2); A.l3 = e.lab('LOAN NE AAPKO DHOONDHA', K.RED, .56, { fs: 40 }); A.l3.position.set(0, 8.6, 1); gA.add(A.l3); })();
SCN[0] = function (t) { var g = gA; g.visible = true; B.bgc(.014); var t2 = S0('h2'), t3 = S0('h3');
  A.rings.forEach(function (r, i) { var u = ((t * 1.1 + i / 3) % 1); r.scale.setScalar(.4 + u * 1.8); r.material.opacity = (1 - u) * .8; }); A.ph.position.x = 2.3 + .05 * Math.sin(t * 38) * (t < t3 ? 1 : .0); A.ph.rotation.z = .04 * Math.sin(t * 36) * (t < t3 ? 1 : 0);
  put(A.agent, t, t2 - .1, .4); A.agent.userData.head.rotation.z = .1 * Math.sin(t * 5); A.agent.userData.armR.rotation.x = -1.2 + .3 * Math.sin(t * 6);
  var u = clamp((t - t3) / 1.3); A.card.visible = t > t3 - .05; A.card.position.set(lerp(4.4, -2.4, eo3(u)), lerp(4.4, 4.6, u) + 2.2 * Math.sin(u * 3.14), lerp(1.8, .9, u)); A.card.rotation.set(0, 0, (1 - u) * -.5 + .08 * Math.sin(t * 3));
  A.user.userData.head.rotation.y = lerp(.0, -.6, sw(t2, t2 + .4, t)); A.user.userData.armR.rotation.x = -.6 * sw(t3, t3 + .8, t);
  put(A.l1, t, .5, .35); put(A.l2, t, t2 + .2, .35); put(A.l3, t, t3 + .8, .35); };
e.shot(0, 'push on the ringing phone', 0, 2.4, [3.4, 7.2, 22], [.2, 3.9, 0], 44, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, 'io');
e.shot(0, 'hold', 2.4, S0('h3') - .3, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, 'io');
e.shot(0, 'swing to the user', S0('h3') - .3, S0('h3') + 1.8, [1.0, 6.0, 17.5], [.4, 4.0, 0], 44, [-.4, 5.6, 16.5], [-.8, 3.9, 0], 44, 'io');
/* ===== scene 1: 41.7 billion ===== */
var gC = grp(new THREE.Group()), C = {};
(function () { B.floor(gC, 0, 60); var cols = 40, rows = 25, N = cols * rows; C.N = N; C.cols = cols; C.im = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .8, .2), M(0xffffff, { roughness: .5 }), N); C.im.frustumCulled = false; gC.add(C.im); C.im.setColorAt(0, new THREE.Color(1, 1, 1));
  C.c1 = e.dyn(.95, 860, 200, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('SPAM CALLS IN INDIA, 2025 (PER TRUECALLER REPORT)', 28, 52); x.font = '700 76px "Chakra Petch"'; x.fillText((a).toFixed(1) + ' BILLION', 28, 140); x.fillStyle = '#7a4a10'; x.font = '600 22px "DM Mono"'; x.fillText('4,168 CRORE · 1 DOT = 40 MILLION · NOT TO SCALE', 28, 182); }); C.c1.position.set(0, 10.8, 3); gC.add(C.c1);
  C.c2 = e.dyn(.8, 860, 170, K.CORAL, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('ITS USERS ALONE ≈ 42 B · 350 M+ USERS', 28, 50); x.font = '700 64px "Chakra Petch"'; x.fillText('≈ ' + Math.round(10 * a) + ' / USER / MONTH', 28, 126); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('OUR ROUGH MATH · SELF-SELECTED USERS', 28, 156); }); C.c2.position.set(0, 1.4, 6); gC.add(C.c2);
  C.mer = e.lab('EMI SE KAM YAAD AATA HAI', K.RED, .46, { fs: 36 }); C.mer.position.set(0, 12.5, 3); gC.add(C.mer); })();
SCN[1] = function (t) { var g = gC; g.visible = true; B.bgc(.01); var L = S1('s2') - SC[1], u = sw(SC[1] + .3, SC[1] + L * .55, t), lit = Math.floor(u * 1042), m = new THREE.Matrix4(), N = C.N, cols = C.cols, col = new THREE.Color();
  for (var i = 0; i < N; i++) { var x = (i % cols - cols / 2 + .5) * .62, y = (Math.floor(i / cols)) * .95 + .6, on = i < lit; m.makeTranslation(x, y + (on ? .06 * Math.sin(t * 3 + i * .3) : 0), 0); C.im.setMatrixAt(i, m); col.set(on ? K.GOLD : 0x28326e); if (on && hash(i + 5) < .06) col.set(K.RED); C.im.setColorAt(i, col); } C.im.instanceMatrix.needsUpdate = true; C.im.instanceColor.needsUpdate = true;
  C.c1.draw(41.7 * u); put(C.c1, t, SC[1] + .2, .3); put(C.mer, t, S0('s3') + .8, .35); var t3 = S0('s3'); C.c2.draw(sw(t3 + .3, t3 + 1.8, t)); put(C.c2, t, t3 + .2, .35); };
e.shot(1, 'rise along the dot wall', SC[1], S0('s3') - .3, [0, 3.2, 28], [0, 5.0, 0], 46, [0, 9.5, 33], [0, 9.0, 0], 46, 'io');
e.shot(1, 'drop to the per-user line', S0('s3') - .3, S1('s3') + .3, [0, 9.5, 33], [0, 9.0, 0], 46, [0, 6.2, 30], [0, 6.5, 0], 46, 'io');
/* ===== scenes 2 + 3: the street (built twice: the promise, then the catch) ===== */
function street(withDoors) { var g = new THREE.Group(); B.floor(g, 0, 60); var s = {}; var road = new THREE.Mesh(new THREE.BoxGeometry(24, .08, 5), M(0x2a3470)); road.position.set(0, .06, 3.2); g.add(road);
  function shop(x, col, label) { var b = new THREE.Mesh(new THREE.BoxGeometry(5, 4.2, 3), M(0x1f2858)); b.position.set(x, 2.1, -1.4); g.add(b); var aw = new THREE.Mesh(new THREE.BoxGeometry(5.4, .35, 1.6), M(col)); aw.position.set(x, 4.2, .1); g.add(aw); var door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, .2), M(0x0b1230)); door.position.set(x, 1.3, .15); g.add(door); var sg = B.sign(label, '#' + col.toString(16).padStart(6, '0'), 4.2, 1.5, 150); sg.position.set(x, 5.4, .2); g.add(sg); return { b: b, door: door, sign: sg }; }
  s.a = shop(-3.4, K.GOLD, '1400'); s.b = shop(3.4, K.GREEN, '1600'); s.g = g; return s; }
var gS = grp(new THREE.Group()), SS = street(); gS.add(SS.g); SS.g.parent.remove(SS.g); gS.add(SS.g);
SS.ag = []; for (var i = 0; i < 6; i++) { var a = B.agent(K.GOLD); a.scale.setScalar(.7); SS.g.add(a); SS.ag.push(a); }
SS.l1 = e.lab('TELEMARKETING', K.GOLD, .5, { fs: 40 }); SS.l1.position.set(-3.4, 7.2, 0); SS.g.add(SS.l1); SS.l2 = e.lab('SERVICE + TRANSACTIONS', K.GREEN, .5, { fs: 36 }); SS.l2.position.set(3.4, 8.0, 0); SS.g.add(SS.l2); SS.l3 = e.card('1400 · 1600', 'business-only number series:\nyou can tell a company is calling', K.GOLD, 1.7); SS.l3.position.set(0, 9.4, 2); SS.g.add(SS.l3);
SCN[2] = function (t) { var g = gS; g.visible = true; B.bgc(.01); var L = S1('t2') - SC[2];
  SS.ag.forEach(function (a, i) { var u = clamp(((t - SC[2] - .4 - i * .5) / 2.2)); a.visible = u > 0 && u < 1; a.position.set(lerp(-9, -3.4, u), .15, 3.3 - .15 * i); a.rotation.y = Math.PI / 2 + .1; a.userData.armR.rotation.x = Math.sin(t * 8 + i) * .5; });
  put(SS.l1, t, SC[2] + .4, .35); put(SS.l2, t, S0('t1') + L * .45, .35); put(SS.l3, t, S0('t2') + .2, .35); };
e.shot(2, 'truck along the street', SC[2], S1('t2') + .3, [-4, 6.4, 20], [-2, 3.4, 0], 46, [2, 6.4, 20], [1.4, 3.6, 0], 46, 'io');
var gR = grp(new THREE.Group()), RR = street(); gR.add(RR.g);
RR.sh = [RR.a, RR.b].map(function (sp, i) { var sh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, .2), M(0x59608f, { metalness: .6, roughness: .4 })); sh.position.set(i ? 3.4 : -3.4, 4.4, .3); RR.g.add(sh); return sh; });
RR.walk = []; for (var j = 0; j < 7; j++) { var p = B.voxel(false, j % 2 ? K.CREAM : K.CORAL); p.scale.setScalar(.7); RR.g.add(p); RR.walk.push(p); }
RR.b1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, .8), M(K.GOLD)); RR.b2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, .8), M(K.GREEN)); RR.b1.position.set(-3.4, .5, 5.6); RR.b2.position.set(3.4, .5, 5.6); RR.g.add(RR.b1); RR.g.add(RR.b2);
RR.p1 = e.dyn(.7, 520, 150, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1400 · CALLS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(81 * a) + '%', 22, 118); }); RR.p1.position.set(-3.4, 7.2, 2); RR.g.add(RR.p1);
RR.p2 = e.dyn(.7, 520, 150, K.GREEN, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1600 · CALLS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(79 * a) + '%', 22, 118); }); RR.p2.position.set(3.4, 7.2, 2); RR.g.add(RR.p2);
RR.st = B.stamp('FREQUENTLY\nBLOCKED', '#ff4d5e', 4.4, 1.5, 96); RR.g.add(RR.st); RR.cl = e.lab("TRUECALLER CEO'S CLAIM · 8 MONTHS", K.RED, .46, { fs: 34 }); RR.cl.position.set(0, 10.0, 0); RR.g.add(RR.cl); RR.cd = e.card('FREQUENTLY BLOCKED', 'the label Truecaller may use:\nit cannot say "spam" for these series', K.RED, 1.7); RR.cd.position.set(0, 9.6, 2); RR.g.add(RR.cd);
SCN[3] = function (t) { var g = gR; g.visible = true; B.bgc(.01); var L = S1('r3') - SC[3], t2 = S0('r2'), t3 = S0('r3');
  RR.sh.forEach(function (sh, i) { var u = sw(SC[3] + .3 + i * .3, SC[3] + 1.1 + i * .3, t); sh.position.y = lerp(7.2, 1.45, u); sh.scale.y = 1; });
  RR.walk.forEach(function (p, i) { var u = ((t * .13 + i / 7) % 1); p.position.set(lerp(-9, 9, u), .15, 3.4 + (i % 2) * .8); p.rotation.y = Math.PI / 2; p.userData.armR.rotation.x = Math.sin(t * 6 + i) * .4; p.visible = true; });
  RR.p1.draw(sw(t2, t2 + 1.6, t)); RR.p2.draw(sw(t2 + .3, t2 + 1.9, t)); put(RR.p1, t, t2, .35); put(RR.p2, t, t2 + .3, .35); RR.b1.scale.y = .2 + 3.2 * sw(t2, t2 + 1.6, t) * .81; RR.b2.scale.y = .2 + 3.2 * sw(t2 + .3, t2 + 1.9, t) * .79; RR.b1.position.y = .5 * RR.b1.scale.y; RR.b2.position.y = .5 * RR.b2.scale.y;
  B.slam(RR.st, clamp((t - t3 - .6) / .8), 6.5, 3.8, 1); RR.st.position.x = 0; RR.st.position.z = 2.4; put(RR.cl, t, t2 + 1.2, .35, t3 + .2); put(RR.cd, t, t3 + 1.4, .4); };
e.shot(3, 'locked on the shuttered street', SC[3], S0('r2') - .2, [0, 6.4, 22], [0, 3.4, 0], 46, [0, 6.4, 22], [0, 3.4, 0], 46, 'io');
e.shot(3, 'push on the bars', S0('r2') - .2, S1('r3') + .3, [0, 6.4, 22], [0, 3.4, 0], 46, [0, 6.4, 17], [0, 3.8, 0], 44, 'io');
})();
/* Part B2 (spam call): scenes 4-7 (fraud, who picks up, the 18 Sep fix, declared) */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS, SC = window.SC, grp = window.grp, sw = window.sw, SCN = window.SCN;
/* ===== scene 4: fraud ===== */
var gF = grp(new THREE.Group()), F = {};
(function () { B.floor(gF, 0, 60); var cn = new THREE.Mesh(new THREE.BoxGeometry(5, 1.6, 1.6), M(0x2b3678)); cn.position.set(-2.4, .8, 0); gF.add(cn);
  F.fr = B.agent(K.RED); F.fr.position.set(-2.4, 1.6, -.4); F.fr.scale.setScalar(1.15); gF.add(F.fr);
  F.sg = [['BANK', '#3de0a8'], ['POLICE', '#6a7bff'], ['PAY APP', '#ff8a1f']].map(function (a) { var s = B.sign(a[0], a[1], 3.0, 1.1, 120); s.position.set(-2.4, 5.6, .6); gF.add(s); return s; });
  F.c1 = e.dyn(.78, 760, 170, K.RED, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('FRAUD CALLS IDENTIFIED, 2025', 28, 52); x.font = '700 70px "Chakra Petch"'; x.fillText(fmt(a) + ' CRORE', 28, 132); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('PER TRUECALLER REPORT', 28, 160); }); F.c1.position.set(0, 7.6, 1); gF.add(F.c1);
  F.sw = new THREE.Group(); F.sw.position.set(2.4, 3.4, .6); F.sw.scale.setScalar(.8); var ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .12, 12, 60), M(K.CREAM)); F.sw.add(ring); F.hand = new THREE.Mesh(new THREE.BoxGeometry(.1, 1.3, .1), M(K.RED)); F.hand.geometry.translate(0, .65, 0); F.sw.add(F.hand); gF.add(F.sw);
  F.l1 = e.lab('1.8 MIN PER CALL (AVG)', K.CREAM, .42, { fs: 34 }); F.l1.position.set(2.4, 1.4, 1); gF.add(F.l1);
  F.yr = new THREE.InstancedMesh(new THREE.BoxGeometry(.26, .26, .26), M(K.GOLD), 247); F.yr.frustumCulled = false; gF.add(F.yr);
  F.c2 = e.dyn(.74, 820, 160, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('BLOCKING SAVES 21.7 LAKH HOURS / DAY', 28, 50); x.font = '700 62px "Chakra Petch"'; x.fillText('≈ ' + Math.round(247 * a) + ' YEARS / DAY', 28, 124); x.fillStyle = '#7a4a10'; x.font = '600 22px "DM Mono"'; x.fillText('÷ 8,766 H/YEAR · OUR ARITHMETIC', 28, 150); }); F.c2.position.set(0, 10.2, 1); gF.add(F.c2); })();
SCN[4] = function (t) { var g = gF; g.visible = true; B.bgc(.01); var t1 = S0('f1'), t2 = S0('f2'), t3 = S0('f3'), L = S1('f1') - t1;
  F.sg.forEach(function (s, i) { var a = t1 + .3 + i * L * .28; s.visible = t > a && t < a + L * .28; s.scale.setScalar(eo3((t - a) * 4) + .01); }); F.fr.userData.head.rotation.z = .12 * Math.sin(t * 4); F.fr.userData.armR.rotation.x = -1.3 + .3 * Math.sin(t * 7);
  F.c1.draw(770 * sw(t2, t2 + 1.2, t)); put(F.c1, t, t2, .35); put(F.sw, t, t3, .35); F.hand.rotation.z = -clamp((t - t3) / 3) * 6.283 * 1.8 / 2 * 2 * .0 - (t - t3) * 2.1; put(F.l1, t, t3 + .3, .3);
  var m = new THREE.Matrix4(), u = sw(t3 + 1.0, t3 + 3.2, t), n = Math.floor(u * 247); for (var i = 0; i < 247; i++) { var cx = (i % 19 - 9) * .32 - 2.6, cy = Math.floor(i / 19) * .32 + 2.0 + .0; m.makeTranslation(i < n ? cx : -99, i < n ? cy : -99, 2.2); F.yr.setMatrixAt(i, m); } F.yr.instanceMatrix.needsUpdate = true; F.c2.draw(u); put(F.c2, t, t3 + .8, .35); };
e.shot(4, 'locked on the counter', SC[4], S0('f3') - .2, [0, 5.6, 15], [0, 3.6, 0], 46, [0, 5.6, 15], [0, 3.6, 0], 46, 'io');
e.shot(4, 'rise to the years', S0('f3') - .2, S1('f3') + .3, [0, 5.6, 15], [0, 3.6, 0], 46, [0, 6.8, 16], [0, 5.2, 0], 46, 'io');
/* ===== scene 5: who picks up ===== */
var gU = grp(new THREE.Group()), U = {};
(function () { B.floor(gU, 0, 60); U.un = B.voxel(false, K.CREAM); U.un.position.set(-1.8, 0, 0); U.un.scale.setScalar(1.5); gU.add(U.un); var hair = new THREE.Mesh(new THREE.BoxGeometry(.66, .14, .64), M(0xdddddd)); hair.position.set(0, .34, 0); U.un.userData.head.add(hair);
  U.ph = new THREE.Mesh(new THREE.BoxGeometry(.28, .5, .06), M(0x10183d)); U.ph.position.set(.62, 2.5, .3); U.un.add(U.ph);
  U.sc = B.agent(K.RED); U.sc.position.set(6.0, 0, -1); U.sc.scale.setScalar(1.2); U.sc.rotation.y = -.9; gU.add(U.sc);
  U.cable = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.6) })); gU.add(U.cable);
  U.bub = ['HELLO? HAAN BOLO', 'ARRE BETA, KAUN?', 'AAP KAUN BOL RAHE?'].map(function (tx, i) { var l = e.lab(tx, K.CREAM, .5, { fs: 38 }); l.position.set(-1.8 + (i % 2) * 1.6, 5.6 + i * 1.1, 1); gU.add(l); return l; });
  U.l = e.lab('PAPA PICKS UP. EVERY TIME.', K.GOLD, .56, { fs: 40 }); U.l.position.set(0, 9.6, 1); gU.add(U.l); U.l2 = e.lab('OPINION · NOT A STATISTIC', K.CREAM, .4, { fs: 32 }); U.l2.position.set(0, 1.0, 3.6); gU.add(U.l2); })();
SCN[5] = function (t) { var g = gU, L = S1('d1') - SC[5]; g.visible = true; B.bgc(.012); U.un.userData.head.rotation.z = .08 * Math.sin(t * 2); U.un.userData.armR.rotation.x = -1.2;
  var pa = new V3(-1.2, 2.6, .3), pb = new V3(5.6, 2.4, -.8), d = pb.clone().sub(pa); U.cable.position.copy(pa); U.cable.scale.set(1, d.length(), 1); U.cable.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); U.cable.visible = t > SC[5] + L * .45;
  U.bub.forEach(function (l, i) { put(l, t, SC[5] + .6 + i * L * .17, .35); }); put(U.l, t, SC[5] + L * .5, .35); put(U.l2, t, SC[5] + L * .6, .3); U.sc.userData.armR.rotation.x = -1 + .3 * Math.sin(t * 6); };
e.shot(5, 'locked wide', SC[5], S1('d1') + .3, [1.6, 6.0, 15.5], [1.6, 3.6, 0], 46, [1.6, 6.0, 14.5], [1.6, 3.8, 0], 46, 'io');
/* ===== scene 6: the 18 Sep fix ===== */
var gT = grp(new THREE.Group()), T = {};
(function () { B.floor(gT, 0, 60); T.box = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.6, 3), M(0x2b3678)); T.box.position.set(2.7, 1.8, -1.6); gT.add(T.box); T.bs = B.sign('TELCO\nPLATFORM', '#6a7bff', 3.0, 1.5, 110); T.bs.position.set(2.7, 2.2, .0); gT.add(T.bs);
  T.rep = []; for (var i = 0; i < 8; i++) { var c = B.card('', '', '', {}); c.scale.setScalar(.35); gT.add(c); T.rep.push(c); }
  T.app = B.phone(B.callScreen('FLAGGED', 'SPAM · USER REPORT', '#ff4d5e')); T.app.scale.setScalar(.5); T.app.position.set(-3.2, 2.6, 0); gT.add(T.app);
  T.l1 = e.lab('APPS MUST SHARE USER SPAM REPORTS', K.GREEN, .5, { fs: 34 }); T.l1.position.set(0, 7.8, 0); gT.add(T.l1); T.cd = e.card('A2P CALL', 'application-to-person: a machine dials,\nnot a person. Declare it in advance.', K.GREEN, 1.7); T.cd.position.set(0, 9.0, 2); gT.add(T.cd);
  T.bar = new THREE.Group(); T.bar.position.set(-.6, 0, 2.4); var post = new THREE.Mesh(new THREE.BoxGeometry(.4, 3, .4), M(K.CREAM)); post.position.set(-1.4, 1.5, 0); T.bar.add(post); T.arm = new THREE.Mesh(new THREE.BoxGeometry(3, .2, .2), M(K.RED)); T.arm.geometry.translate(1.5, 0, 0); T.arm.position.set(-1.4, 3.0, 0); T.bar.add(T.arm); gT.add(T.bar);
  T.rb = B.voxel(false, K.GOLD); T.rb.scale.setScalar(.7); gT.add(T.rb); var ant = new THREE.Mesh(new THREE.BoxGeometry(.06, .5, .06), M(K.RED)); ant.position.set(0, .5, 0); T.rb.userData.head.add(ant);
  T.pr = e.dyn(.7, 700, 150, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('UNDECLARED ROBOCALL = SPAM', 24, 46); x.font = '700 60px "Chakra Petch"'; x.fillText('≤ 5 PAISE / MIN', 24, 120); }); T.pr.position.set(-.4, 5.4, 2.4); gT.add(T.pr);
  T.q = B.sign('?', '#f4ecd8', 2, 2, 260); T.q.position.set(1.6, 4.2, 3.0); gT.add(T.q); T.td = e.lab('TRUECALLER CALLS IT ANTI-COMPETITIVE', K.RED, .44, { fs: 32 }); T.td.position.set(0, 9.0, 0); gT.add(T.td); })();
SCN[6] = function (t) { var g = gT, t1 = S0('x1'), t2 = S0('x2'), t3 = S0('x3'), t4 = S0('x4'); g.visible = true; B.bgc(.012); put(T.l1, t, t1 + .4, .35, t2 - .1); put(T.cd, t, t2, .4, t3 + .2);
  T.rep.forEach(function (c, i) { var a = t1 + .8 + i * .35, u = clamp((t - a) / 1.0); c.visible = u > 0 && u < 1; c.position.set(lerp(-2.8, 2.4, eo3(u)), lerp(2.6, 2.4, u) + 1.4 * Math.sin(u * 3.14), 1.0); c.rotation.z = .5 * Math.sin(u * 6); });
  put(T.pr, t, t3, .4); var arm = sw(t3 + .6, t3 + 1.6, t) * 1.2; T.arm.rotation.z = arm; var ru = clamp((t - t2 + .4) / 2.4); T.rb.visible = t > t2 - .4; T.rb.position.set(lerp(-6, 6, ru), .1, 3.6); T.rb.rotation.y = Math.PI / 2; T.rb.userData.armR.rotation.x = Math.sin(t * 7) * .4;
  put(T.q, t, t4, .4); T.q.rotation.z = .1 * Math.sin(t * 3); put(T.td, t, t4 + 1.2, .35); };
e.shot(6, 'truck from the app to the platform', SC[6], S0('x3') - .3, [0, 5.8, 17], [0, 3.0, 0], 46, [0, 5.8, 17], [0, 3.0, 0], 46, 'io');
e.shot(6, 'pull to the toll booth', S0('x3') - .3, S1('x4') + .3, [0, 5.8, 17], [0, 3.0, 0], 46, [0, 5.4, 14.5], [0, 3.2, 1], 44, 'io');
/* ===== scene 7: the toast ===== */
var gZ = grp(new THREE.Group()), Z = {};
(function () { B.floor(gZ, 0, 40); var scr = B.callScreen('UNKNOWN', '+91 ·····  · DECLARED', '#3de0a8'); Z.ph = B.phone(scr); Z.ph.position.set(0, 4.3, 0); Z.ph.scale.setScalar(.95); gZ.add(Z.ph);
  Z.tag = B.stamp('DECLARED', '#3de0a8', 4.6, 1.5, 110); gZ.add(Z.tag); Z.l = e.lab('AB LOAN KO BHI DECLARE KARNA PADEGA', K.GREEN, .5, { fs: 34 }); Z.l.position.set(0, 9.4, 1); gZ.add(Z.l);
  Z.rings = [0, 1, 2].map(function () { var r = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(1.6), transparent: true, depthWrite: false })); r.position.set(0, 4.3, .8); gZ.add(r); return r; }); })();
SCN[7] = function (t) { var g = gZ, L = S1('c1') - SC[7]; g.visible = true; B.bgc(.012); Z.rings.forEach(function (r, i) { var u = ((t * .7 + i / 3) % 1); r.scale.setScalar(.8 + u * 3.6); r.material.opacity = (1 - u) * .7; }); B.slam(Z.tag, clamp((t - SC[7] - L * .5) / .8), 9, 4.4, 1); Z.tag.position.z = 1.2; Z.tag.rotation.z = -.12; put(Z.l, t, SC[7] + .5, .35); };
e.shot(7, 'pull back from the phone', SC[7], S0('cta') - .3, [0, 5.2, 12], [0, 4.4, 0], 42, [0, 6.0, 20], [0, 2.6, 0], 44, 'io');
e.shot(7, 'hold for the end card', S0('cta') - .3, S0('cta') + 30, [0, 6.0, 20], [0, 2.6, 0], 44, [0, 6.0, 20], [0, 2.6, 0], 44, 'io');
})();
/* Part C (billionaire): DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['UNKNOWN NUMBER · 2:47 PM', 'SPAM CALLS · INDIA, 2025', 'THE 2024 FIX · 1400 AND 1600', 'THE CATCH · NOBODY ANSWERS THE OFFICIAL STREET', 'FRAUD CALLS · 770 CRORE', 'WHO PICKS UP · EVERY TIME', 'TRAI · 18 SEPTEMBER 2026', 'DECLARE YOURSELF']
var HL = ['Loan ne aapko <b>dhoondha</b>', '41.7 arab <b>spam calls</b>', 'Telemarketers ki <b>alag gali</b>', 'Wahi gali sabse <b>badnaam</b>', 'Bank, police, <b>payment app</b>', 'Scammer ko chahiye <b>baat</b>', 'Spam ke liye <b>call rate</b>', 'Ab loan ko <b>declare</b> karo']
var TAGS = ['ILLUSTRATIVE SCENE · NOT A REAL CALL', 'TRUECALLER REPORT 2025 · ROUGH MATH', 'TRAI FRAMEWORK 2024 · VIA TECHCRUNCH', 'TRUECALLER CEO CLAIM · 8 JUL 2026', 'TRUECALLER REPORT · OUR ARITHMETIC', 'OUR OPINION · ILLUSTRATIVE', 'TECHCRUNCH, 18 SEP 2026 · TRAI AMENDMENT', 'ILLUSTRATIVE SCENE']
var hsc = D('', 'left:0;top:0;width:1080px;height:430px;background:linear-gradient(rgba(13,20,51,.92),rgba(13,20,51,.75) 55%,rgba(13,20,51,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:600 24px \'DM Mono\';letter-spacing:.14em;color:#ff8a1f;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#ff8a1f"></i><span id="ebt"></span></div><div id="hl" style="font:900 56px/1.04 Chakra Petch;letter-spacing:-.02em;margin-top:14px;color:#f4ecd8;text-shadow:0 4px 18px rgba(0,0,0,.6)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "DM Mono";letter-spacing:.06em;color:rgba(244,236,216,.7);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(13,20,51,0),rgba(13,20,51,.94) 22%,rgba(13,20,51,.94) 80%,rgba(13,20,51,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f4ecd8;box-shadow:0 0 0 6px #ff8a1f,0 10px 40px rgba(0,0,0,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f4ecd8;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#ff8a1f;font:600 26px "DM Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#f4ecd8', 190], ['share', 'SHARE', '#3de0a8', 210], ['bell-ringing', 'SUBSCRIBE', '#ff8a1f', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:#0b1230;display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "DM Mono";letter-spacing:.05em;color:#f4ecd8;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ff8a1f', chipInk: '#0b1230', keywords: { 'spam': '#ff4d5e', 'loan': '#ff8a1f', 'Truecaller': '#3de0a8', 'TRAI': '#6a7bff', 'fraud': '#ff4d5e' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = []; for (var di = 1; di < SC.length; di++) DIPS.push(SC[di]);
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(.15, 'ping'); ev(.85, 'ping'); ev(1.6, 'ping'); DIPS.forEach(function (d) { ev(d - .1, 'whoosh'); }); ev(S0('h2'), 'pop'); ev(S0('h3'), 'whoosh'); ev(S0('h3') + 1.1, 'slam');
  ev(SC[1] + .5, 'tick'); for (var a = 0; a < 6; a++) ev(SC[1] + .8 + a * .5, 'tick'); ev(S0('s3') + .8, 'pop');
  ev(SC[2] + .5, 'pop'); ev(S0('t2') + .2, 'ping'); ev(SC[3] + .4, 'slam'); ev(SC[3] + .7, 'slam'); ev(S0('r2') + .2, 'tick'); ev(S0('r3') + 1.4, 'slam');
  ev(S0('f1') + .5, 'pop'); ev(S0('f1') + 1.5, 'pop'); ev(S0('f2') + .2, 'ping'); for (var b = 0; b < 5; b++) ev(S0('f3') + 1.0 + b * .45, 'tick');
  ev(SC[5] + 1.0, 'pop'); ev(SC[5] + 2.5, 'pop'); ev(SC[5] + 4.0, 'buzz');
  ev(S0('x1') + 1.0, 'tick'); ev(S0('x1') + 2.4, 'tick'); ev(S0('x3') + 1.0, 'slam'); ev(S0('x4') + .1, 'pop');
  ev(SC[7] + (S1('c1') - SC[7]) * .5 + .3, 'slam'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.1, .08, .1, .1, .1, .1, .1, .1], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); e.camAt(sc, t); e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:900;background:#ff8a1f;color:#0b1230;padding:0 10px;border-radius:6px;text-shadow:none'; });
  hdr.style.opacity = ec ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo)); hl.style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (ec ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  var dip = 0; DIPS.forEach(function (d) { dip = Math.max(dip, 1 - clamp(Math.abs(t - d) / .16)); }); flash.style.background = '#0d1433'; flash.style.opacity = dip * .96;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 22; e.POST.bloom = .25; e.POST.vig = .3; e.POST.expo = 1.3; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
