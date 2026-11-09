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
/* Part B1 (spam call v2): ONE continuous 3D colony ("mohalla") the camera travels through. Your house + doorbell, the marked lane (1400/1600), the watchman hut, the entrance gates. Pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, put = e.put, B = window.B, K = B.K, M = B.M, GM = B.GM, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS;
var SC = window.SC = [0, S0('a1'), S0('t1'), S0('r1'), S0('w1'), S0('f1'), S0('x1'), S0('c1')];
window.GR = []; window.SCN = [];
function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.fmt = fmt; window.sw = sw;
var W = new THREE.Group(); S.add(W); GR.push(W);
function add(o, x, y, z) { o.position.set(x, y, z); W.add(o); return o; }
function box(w, h, d, col, o) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(col, o)); }
/* ---------- sky, ground, roads ---------- */
(function () { var sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 20), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', fragmentShader: 'varying vec3 vP;void main(){float h=clamp(normalize(vP).y,0.,1.);vec3 hor=vec3(.98,.5,.22),mid=vec3(.20,.18,.45),top=vec3(.03,.05,.16);vec3 c=mix(hor,mid,smoothstep(0.,.18,h));c=mix(c,top,smoothstep(.12,.7,h));float st=step(.9985,fract(sin(dot(floor(vP.xz*.35+vP.y*.2),vec2(12.9,78.2)))*43758.5));c+=st*smoothstep(.25,.6,h);gl_FragColor=vec4(c,1.);}' })); W.add(sky);
  var g = new THREE.Mesh(new THREE.CircleGeometry(120, 64), M(0x1a2a58, { roughness: .95, envMapIntensity: .4 })); g.rotation.x = -Math.PI / 2; W.add(g);
  add(box(130, .08, 7, 0x2e3a78, { roughness: .8 }), -15, .05, 17); for (var i = 0; i < 22; i++) add(box(1.6, .02, .25, 0xf4ecd8), -62 + i * 5.5, .1, 17);
  add(box(6, .08, 36, 0x34417f, { roughness: .8 }), 14, .06, -2); add(box(2.6, .06, 14, 0x55609b), 0, .08, 10.2);
  W.laneEdge = [-3, 3].map(function (dx) { var m = new THREE.Mesh(new THREE.BoxGeometry(.25, .12, 34), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(2.2), transparent: true, opacity: 0 })); add(m, 14 + dx, .16, -2); return m; }); })();
/* ---------- trees and lamp posts (foreground parallax) ---------- */
(function () { function tree(x, z, s) { var t = new THREE.Group(); var tr = box(.5, 2, .5, 0x4a3a2a); tr.position.y = 1; t.add(tr); for (var i = 0; i < 3; i++) { var c = new THREE.Mesh(new THREE.ConeGeometry(2.2 - i * .5, 2.6, 7), M(0x1d6a62, { roughness: .8 })); c.position.y = 2.6 + i * 1.5; t.add(c); } t.scale.setScalar(s); return add(t, x, 0, z); }
  [[-6, 7, .8], [6, 6, .9], [24, 2, .9], [-20, 8, .8], [-34, 10, .9], [28, -10, .9], [-12, 34, 1.0], [34, 30, 1.0], [-46, 28, 1.0], [10, 36, 1.0]].forEach(function (a) { tree(a[0], a[1], a[2]); });
  function lamp(x, z) { var p = box(.22, 6.4, .22, 0x2a2f55); add(p, x, 3.2, z); var h = new THREE.Mesh(new THREE.SphereGeometry(.4, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(3) })); add(h, x, 6.6, z); var gl = e.glow('t', 6, .9); gl.position.set(x, 6.6, z); W.add(gl); }
  for (var i = -5; i <= 2; i++) if (i !== 0) lamp(i * 9 + 4, 13.2); [-2, -10, 6].forEach(function (z) { lamp(10.6, z); }); })();
/* ---------- your house ---------- */
var H = {};
(function () { var g = new THREE.Group(); W.add(g); H.g = g; var body = box(8.4, 5.2, 7, 0x5a6bb5, { roughness: .7 }); body.position.set(0, 2.6, 0); g.add(body);
  var roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 6.6, 3.2, 4), M(0xb5541a, { roughness: .8 })); roof.rotation.y = Math.PI / 4; roof.position.set(0, 6.8, 0); roof.scale.set(1.12, 1, .96); g.add(roof);
  [-2.9, 2.9].forEach(function (x) { var w = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.5), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.5) })); w.position.set(x, 3.2, 3.52); g.add(w); H[x < 0 ? 'wl' : 'wr'] = w; });
  var fr = box(2.0, 3.5, .3, 0x1b1f40); fr.position.set(0, 1.75, 3.5); g.add(fr); var inner = box(1.7, 3.2, .1, 0xffc27a); inner.position.set(0, 1.6, 3.4); inner.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.1) }); g.add(inner);
  H.door = new THREE.Group(); H.door.position.set(-.85, 0, 3.7); var dm = box(1.7, 3.2, .16, 0xc86a2a, { roughness: .6 }); dm.position.set(.85, 1.6, 0); H.door.add(dm); g.add(H.door);
  var plate = box(.8, 1.15, .14, 0xf4ecd8); plate.position.set(2.4, 2.4, 3.65); g.add(plate); H.btn = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .12, 20), M(K.GOLD, { emissive: K.GOLD, emissiveIntensity: .6 })); H.btn.rotation.x = Math.PI / 2; H.btn.position.set(2.4, 2.6, 3.76); g.add(H.btn); var d2 = new THREE.Mesh(new THREE.PlaneGeometry(.55, .22), new THREE.MeshBasicMaterial({ color: 0x0b1230 })); d2.position.set(2.4, 2.1, 3.73); g.add(d2);
  H.rings = [0, 1, 2].map(function () { var r = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 10, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(2), transparent: true, depthWrite: false })); r.position.set(2.4, 2.6, 3.9); g.add(r); return r; });
  H.light = new THREE.PointLight(0xffb060, 40, 18, 1.6); H.light.position.set(0, 2.8, 6.5); g.add(H.light); var pg = e.glow('t', 7, .55); pg.position.set(0, 3, 5); g.add(pg);
  H.user = B.voxel(false, K.CORAL); H.user.position.set(0, 0, 2.2); H.user.scale.setScalar(1.05); g.add(H.user);
  H.lb = e.lab('DOORBELL = YOUR PHONE NUMBER', K.GOLD, .5, { fs: 36 }); H.lb.position.set(2.4, 5.6, 4.2); g.add(H.lb); })();
/* ---------- the salesman at your door + other callers ---------- */
var SM = {};
(function () { SM.sm = B.agent(K.GOLD); SM.sm.scale.setScalar(1.0); W.add(SM.sm); SM.case = box(.9, .6, .3, 0xf4ecd8); SM.case.position.set(.6, 1.0, .4); SM.sm.add(SM.case); var tex = B.plane(.8, .5, B.tcv(256, 160, function (x) { x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, 256, 160); x.fillStyle = '#0b1230'; x.font = '700 64px "Chakra Petch"'; x.textAlign = 'center'; x.fillText('LOAN', 128, 104); })); tex.position.set(0, 0, .17); SM.case.add(tex);
  SM.say = e.lab('"SIR, LOAN CHAHIYE?"', K.GOLD, .6, { fs: 44 }); SM.say.position.set(0, 7.6, 7); W.add(SM.say); SM.nm = e.lab('LOAN NE AAPKO DHOONDHA', K.RED, .5, { fs: 40 }); SM.nm.position.set(0, 8.8, 7); W.add(SM.nm);
  SM.badge = B.stamp('DECLARED', '#3de0a8', 3.0, 1.0, 100); SM.badge.position.set(0, 4.2, 7); W.add(SM.badge); })();
/* ---------- the rain of calls (1 dot = 35 million) ---------- */
var RN = {};
(function () { var N = 1200; RN.N = N; RN.im = new THREE.InstancedMesh(new THREE.BoxGeometry(.5, .8, .15), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.8) }), N); RN.im.frustumCulled = false; W.add(RN.im); RN.o = []; for (var i = 0; i < N; i++) { var a = hash(i) * 6.283, r = 22 + hash(i + 3) * 40; RN.o.push([Math.cos(a) * r + 6, 4 + hash(i + 7) * 20, Math.sin(a) * r * .7 + 14]); }
  RN.c1 = e.dyn(.95, 860, 200, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('TRUECALLER USERS · RINGS IN 2025', 28, 52); x.font = '700 76px "Chakra Petch"'; x.fillText('≈ ' + Math.round(a) + ' BILLION', 28, 140); x.fillStyle = '#7a4a10'; x.font = '600 22px "DM Mono"'; x.fillText('1 BOX = 35 MILLION RINGS · NOT TO SCALE', 28, 182); }); RN.c1.position.set(2.4, 11, 4); W.add(RN.c1);
  RN.c2 = e.dyn(.8, 860, 170, K.CORAL, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('42 B ÷ 350 M+ USERS ÷ 12', 28, 50); x.font = '700 64px "Chakra Petch"'; x.fillText('≈ ' + Math.round(10 * a) + ' RINGS / MONTH', 28, 126); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('OUR ROUGH MATH · SELF-SELECTED USERS', 28, 156); }); RN.c2.position.set(2.4, 11, 4); W.add(RN.c2);
  RN.cd = e.card('SPAM CALL', 'a ring you did not ask for:\nnobody invited it', K.RED, 1.7); RN.cd.position.set(2.4, 14.5, 6); W.add(RN.cd); })();
/* ---------- the marked lane (gali) ---------- */
var L = {};
(function () { var gate = new THREE.Group(); W.add(gate); L.gate = gate;
  [11, 17].forEach(function (x) { var p = box(.6, 6, .6, 0xf4ecd8); p.position.set(x, 3, 14.5); gate.add(p); }); var beam = box(7.4, .8, .8, 0x2b3678); beam.position.set(14, 6.4, 14.5); gate.add(beam);
  L.s14 = B.sign('1400', '#ff8a1f', 3.2, 1.3, 130); L.s14.position.set(12.2, 5.1, 14.95); gate.add(L.s14); L.s16 = B.sign('1600', '#3de0a8', 3.2, 1.3, 130); L.s16.position.set(15.8, 5.1, 14.95); gate.add(L.s16);
  L.booths = []; for (var i = 0; i < 5; i++) [[11, 0xb5601a], [17, 0x1e8f72]].forEach(function (a, k) { var b = new THREE.Group(); var bx = box(3.2, 3.4, 3.2, a[0] === 11 ? 0x7a4a22 : 0x1a5c52); bx.position.y = 1.7; b.add(bx); var aw = box(3.6, .3, 1.6, a[1]); aw.position.set(a[0] === 11 ? 1.4 : -1.4, 3.3, 0); b.add(aw); var win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(a[1]).multiplyScalar(1.4) })); win.position.set(a[0] === 11 ? 1.62 : -1.62, 2.2, 0); win.rotation.y = a[0] === 11 ? Math.PI / 2 : -Math.PI / 2; b.add(win); b.position.set(a[0] === 11 ? 10.4 : 17.6, 0, 8 - i * 6.6); W.add(b); L.booths.push(b); });
  L.ag = []; for (var j = 0; j < 8; j++) { var a = B.agent(K.GOLD); a.scale.setScalar(.8); W.add(a); L.ag.push(a); }
  L.cd = e.card('1400 · 1600 GALI', 'a marked street only for sellers:\nyou can tell a shop is calling', K.GOLD, 1.7); L.cd.position.set(14, 11.5, 12); W.add(L.cd);
  L.l1 = e.lab('1400 = TELEMARKETING', K.GOLD, .46, { fs: 34 }); L.l1.position.set(11, 8.8, 14.5); W.add(L.l1); L.l2 = e.lab('1600 = SERVICE', K.GREEN, .46, { fs: 34 }); L.l2.position.set(17, 8.0, 14.5); W.add(L.l2); })();
/* ---------- neighbours (doors that close) and walkers ---------- */
var N = {};
(function () { N.h = [-14, -26].map(function (x, i) { var g = new THREE.Group(); var b = box(7, 4.6, 6, i ? 0x4f7a8f : 0x7a5aa8, { roughness: .7 }); b.position.y = 2.3; g.add(b); var r = new THREE.Mesh(new THREE.CylinderGeometry(0, 5.4, 2.8, 4), M(0x6a2e2e)); r.rotation.y = Math.PI / 4; r.position.y = 6; g.add(r); var w = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.3), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.3) })); w.position.set(-2.4, 3, 3.02); g.add(w); var door = new THREE.Group(); door.position.set(-.8, 0, 3.1); var d = box(1.6, 3, .14, 0xc86a2a); d.position.set(.8, 1.5, 0); door.add(d); var inn = box(1.6, 3, .1, 0xffc27a); inn.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GOLD).multiplyScalar(1.1) }); inn.position.set(0, 1.5, 3.04); g.add(inn); g.add(door); g.position.set(x, 0, 0); W.add(g); return { g: g, door: door }; });
  N.wk = []; for (var i = 0; i < 7; i++) { var p = B.voxel(false, i % 2 ? K.CREAM : K.CORAL); p.scale.setScalar(.85); W.add(p); N.wk.push(p); }
  N.b1 = box(2, 1, 1.6, K.GOLD); N.b2 = box(2, 1, 1.6, K.GREEN); N.b1.position.set(23, .5, 10); N.b2.position.set(27, .5, 10); W.add(N.b1); W.add(N.b2);
  N.p1 = e.dyn(.7, 520, 150, K.GOLD, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1400 · RINGS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(81 * a) + '%', 22, 118); }); N.p1.position.set(23, 12, 10); W.add(N.p1);
  N.p2 = e.dyn(.7, 520, 150, K.GREEN, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 24px "DM Mono"'; x.fillText('1600 · RINGS IGNORED', 22, 46); x.font = '700 64px "Chakra Petch"'; x.fillText(Math.round(79 * a) + '%', 22, 118); }); N.p2.position.set(27, 13.4, 10); W.add(N.p2);
  N.cl = e.lab("TRUECALLER CEO'S CLAIM · 8 MONTHS", K.RED, .44, { fs: 32 }); N.cl.position.set(25, 15.4, 10); W.add(N.cl); N.sh = e.lab('NOBODY OPENS THE DOOR', K.CREAM, .46, { fs: 34 }); N.sh.position.set(-20, 8.6, 4); W.add(N.sh); })();
/* ---------- the watchman ---------- */
var G = {};
(function () { var g = new THREE.Group(); W.add(g); var hut = box(3.4, 3.4, 3.2, 0x2a7a6a); hut.position.y = 1.7; g.add(hut); var rf = box(4.2, .4, 4, 0x1b4a42); rf.position.y = 3.6; g.add(rf); var win = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(1.4) })); win.position.set(0, 2.2, 1.62); g.add(win); g.position.set(7.4, 0, 12.2); G.g = g;
  G.guard = B.voxel(false, K.GREEN); G.guard.position.set(7.4, 0, 14.6); G.guard.scale.setScalar(.95); G.guard.rotation.y = .2; W.add(G.guard); var cap = box(.8, .3, .8, 0x0b1230); cap.position.set(0, .45, 0); G.guard.userData.head.add(cap);
  G.tag = e.lab('TRUECALLER = THE CHOWKIDAAR', K.GREEN, .46, { fs: 34 }); G.tag.position.set(7.4, 7.6, 12.2); W.add(G.tag);
  G.st = B.stamp('FREQUENTLY\nBLOCKED', '#ff4d5e', 4.4, 1.5, 96); W.add(G.st);
  G.cd = e.card('FREQUENTLY BLOCKED', 'the label Truecaller may use:\nit cannot say "spam" for 1400 / 1600', K.RED, 1.7); G.cd.position.set(7.4, 10.6, 12.2); W.add(G.cd); })();
/* ---------- fraud ---------- */
var F = {};
(function () { F.ag = [['BANK', 0x3de0a8], ['POLICE', 0x6a7bff], ['PAY APP', 0xff8a1f]].map(function (a) { var p = B.agent(K.RED); p.scale.setScalar(1.0); W.add(p); var s = B.sign(a[0], '#' + a[1].toString(16).padStart(6, '0'), 2.6, 1.0, 100); s.position.set(0, 4.6, 0); p.add(s); var m = box(1.0, .42, .1, 0x0b1230); m.position.set(0, 2.1, .33); p.userData.head.add(m); m.position.y = -.1; return p; });
  F.c1 = e.dyn(.78, 760, 170, K.RED, function (x, a) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('FRAUD CALLS IDENTIFIED, 2025', 28, 52); x.font = '700 70px "Chakra Petch"'; x.fillText(fmt(a) + ' CRORE', 28, 132); x.fillStyle = '#a02838'; x.font = '600 22px "DM Mono"'; x.fillText('PER TRUECALLER REPORT', 28, 160); }); F.c1.position.set(3.4, 9.6, 8); W.add(F.c1); })();
/* ---------- the entrance: three rules as three gates + telco tower ---------- */
var X = {};
(function () { X.tw = new THREE.Group(); var mast = new THREE.Mesh(new THREE.CylinderGeometry(.35, .7, 22, 8), M(0xc9d2ff, { metalness: .6, roughness: .35 })); mast.position.y = 11; X.tw.add(mast); var base = box(5, 1.4, 5, 0x2b3678); base.position.y = .7; X.tw.add(base); [6, 10, 14].forEach(function (y, i) { var d = new THREE.Mesh(new THREE.CylinderGeometry(.01, 1.4, .5, 16), M(0xf4ecd8)); d.position.set(i % 2 ? 1.1 : -1.1, y + 2, 0); d.rotation.z = i % 2 ? -.8 : .8; X.tw.add(d); }); var tip = new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.CORAL).multiplyScalar(2.4) })); tip.position.y = 22.4; X.tw.add(tip); X.tw.position.set(-14, 0, 34); W.add(X.tw);
  X.ts = B.sign('TELCO\nPLATFORM', '#6a7bff', 5, 2.4, 120); X.ts.position.set(-14, 5.4, 36.6); W.add(X.ts);
  var curve = new THREE.CatmullRomCurve3([new V3(7.4, 3.8, 12.2), new V3(-2, 15, 20), new V3(-14, 17, 28), new V3(-14, 14, 34)]); X.curve = curve; X.pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, .14, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.GREEN).multiplyScalar(1.8), transparent: true, opacity: 0 })); W.add(X.pipe);
  X.rep = []; for (var i = 0; i < 6; i++) { var c = B.card('', '', '', {}); c.scale.setScalar(.45); W.add(c); X.rep.push(c); }
  function arch(x, col, label) { var g = new THREE.Group(); [-3.6, 3.6].forEach(function (dz) { var p = box(.6, 6, .6, 0xf4ecd8); p.position.set(0, 3, dz); g.add(p); }); var b = box(.8, .8, 8.4, col); b.position.set(0, 6.4, 0); g.add(b); g.position.set(x, 0, 17); W.add(g); var s = B.sign(label, '#' + col.toString(16).padStart(6, '0'), 3.4, 1.2, 96); s.position.set(x, 8.2, 17); s.rotation.y = 0; W.add(s); return g; }
  X.a1 = arch(-8, K.GREEN, '1 · REPORT'); X.a2 = arch(-18, K.CORAL, '2 · DECLARE'); X.a3 = arch(-28, K.GOLD, '3 · TOLL');
  X.arm = box(7, .35, .35, K.RED); X.arm.geometry.translate(3.5, 0, 0); X.arm.position.set(-28, 3.4, 20.4); W.add(X.arm); var pl = box(.5, 3.4, .5, 0xf4ecd8); pl.position.set(-28.2, 1.7, 20.4); W.add(pl);
  X.rb = B.voxel(false, K.GOLD); X.rb.scale.setScalar(1.0); var ant = box(.1, .9, .1, K.RED); ant.position.set(0, .7, 0); X.rb.userData.head.add(ant); W.add(X.rb);
  X.pr = e.dyn(.7, 700, 150, K.GOLD, function (x) { x.fillStyle = '#0b1230'; x.font = '600 26px "DM Mono"'; x.fillText('ROBOT CALL TOLL', 24, 46); x.font = '700 60px "Chakra Petch"'; x.fillText('≤ 5 PAISE / MIN', 24, 120); }); X.pr.position.set(-28, 12.6, 17); W.add(X.pr);
  X.c1 = e.card('A2P CALL', 'application-to-person: a machine dials,\nnot a person. Declare it in advance.', K.CORAL, 1.7); X.c1.position.set(-18, 13.6, 17); W.add(X.c1);
  X.q = B.sign('?', '#f4ecd8', 2.6, 2.6, 260); X.q.position.set(-18, 12, 24); W.add(X.q); X.td = e.lab('TRUECALLER CALLS IT ANTI-COMPETITIVE', K.RED, .44, { fs: 32 }); X.td.position.set(-18, 8.4, 24); W.add(X.td); })();
/* ---------- per-frame world state (all pure functions of t) ---------- */
var P_PATH = function (u) { return new V3(0, 0, lerp(17, 5.2, u)); };
SCN[0] = SCN[1] = SCN[2] = SCN[3] = SCN[4] = SCN[5] = SCN[6] = SCN[7] = function (t) { W.visible = true; S.background = new THREE.Color(0x0d1433); S.fog = new THREE.FogExp2(0x1a2150, .0055);
  var th1 = S0('h1'), th2 = S0('h2'), th3 = S0('h3'), ta1 = S0('a1'), ta2 = S0('a2'), ta3 = S0('a3'), tt1 = S0('t1'), tt2 = S0('t2'), tr1 = S0('r1'), tr2 = S0('r2'), tw1 = S0('w1'), tw2 = S0('w2'), tf1 = S0('f1'), tf2 = S0('f2'), tx1 = S0('x1'), tx2 = S0('x2'), tx3 = S0('x3'), tx4 = S0('x4'), tx5 = S0('x5'), tc1 = S0('c1'), tcta = S0('cta');
  /* doorbell + door */
  var ringing = (t < th2 + .6) || (t > ta1 && t < tt1 + .5) || (t > tf1 && t < tf2 + 3), flick = ringing ? 1 : 0;
  H.rings.forEach(function (r, i) { var u = ((t * 1.3 + i / 3) % 1); r.scale.setScalar(.4 + u * 2.2); r.material.opacity = flick * (1 - u) * .9; }); H.btn.scale.z = 1 + (ringing ? .5 * Math.sin(t * 18) : 0);
  var doorU = sw(th2 - .5, th2 + .1, t) * (1 - sw(tc1 + 3.5, tc1 + 4.5, t) * 0); H.door.rotation.y = -1.7 * doorU; H.user.visible = doorU > .2 || t > th2; H.user.userData.head.rotation.y = .3 * Math.sin(t * 1.3) - .15 * sw(th3, th3 + .5, t); H.user.userData.armR.rotation.x = -.6 * sw(th3, th3 + .8, t);
  H.light.intensity = 30 + 12 * doorU; H.wl.material.color.setScalar(1); put(H.lb, t, th1 + .8, .4, th2 + .2);
  /* the salesman: walks up the path, delivers the line, leaves; at the end he comes back declared */
  var wu = sw(th1 + .2, th2 - .3, t), leave = sw(th3 + 1.2, ta1 + 1.6, t), back = sw(tc1 + .2, tc1 + 2.6, t); var smz = lerp(17, 7.4, wu); if (t > th3) smz = lerp(7.4, 17, leave); if (t > tc1 - .5) smz = lerp(17, 7.4, back);
  SM.sm.position.set(0, 0, smz); SM.sm.rotation.y = (t > th3 && t < tc1 - .5) ? Math.PI : 0; SM.sm.visible = !(t > ta1 + 1.6 && t < tc1 - .5); SM.sm.userData.armR.rotation.x = -.4 + .3 * Math.sin(t * 6) * (wu > .01 && wu < .99 ? 1 : .2); SM.sm.userData.head.rotation.z = .08 * Math.sin(t * 4);
  put(SM.say, t, th2 + .1, .35, th3 - .1); put(SM.nm, t, th3 + .5, .35, ta1 - .1); var dec = clamp((t - tc1 - 3.0) / .9); B.slam(SM.badge, dec, 8, 4.2, 1); SM.badge.position.set(0, SM.badge.position.y, 7.8); SM.badge.rotation.z = -.1;
  /* the rain of rings (a1-a3) */
  var m = new THREE.Matrix4(), NR = RN.N, vis = t > ta1 - .2 && t < tt1 + .3, fl = sw(ta1, ta1 + 1.2, t); for (var i = 0; i < NR; i++) { if (!vis) { m.makeTranslation(0, -50, 0); RN.im.setMatrixAt(i, m); continue; } var u = (((t - ta1) * .22 + hash(i + 11)) % 1), o = RN.o[i], b = [2.4, 2.6, 4.2], c = [(o[0] + b[0]) / 2, o[1] + 8, (o[2] + b[2]) / 2], q = 1 - u, px = q * q * o[0] + 2 * q * u * c[0] + u * u * b[0], py = q * q * o[1] + 2 * q * u * c[1] + u * u * b[1], pz = q * q * o[2] + 2 * q * u * c[2] + u * u * b[2], s = Math.min(1, u * 8) * (u > .92 ? (1 - u) * 12 : 1) * fl; m.compose(new V3(px, py, pz), new THREE.Quaternion(), new V3(s, s, s)); RN.im.setMatrixAt(i, m); } RN.im.instanceMatrix.needsUpdate = true;
  RN.c1.draw(42 * sw(ta2, ta2 + 2.4, t)); put(RN.c1, t, ta2 - .1, .4, ta3 - .1); RN.c2.draw(sw(ta3, ta3 + 1.4, t)); put(RN.c2, t, ta3, .4, tt1 - .2); put(RN.cd, t, ta1 + .4, .4, ta2 - .2);
  /* the lane (t1-t2) */
  var lu = sw(tt1 - .2, tt1 + 1.2, t); W.laneEdge.forEach(function (m2) { m2.material.opacity = Math.min(1, lu * 1.2) * (t > tr1 + 6 ? .4 : 1); }); L.s14.visible = L.s16.visible = lu > 0; L.s14.scale.setScalar(.01 + eo3(lu)); L.s16.scale.setScalar(.01 + eo3(sw(tt1 + .3, tt1 + 1.4, t)));
  L.ag.forEach(function (a, j) { var u = clamp((t - tt1 - .5 - j * .38) / 2.6), side = j % 2, bz = 8 - Math.floor(j / 2) * 6.6, bx = side ? 17.6 : 10.4; var pos = u < .5 ? new V3(lerp(27, 14, sstep(u * 2)), 0, 19.4) : new V3(lerp(14, bx + (side ? -1.8 : 1.8), sstep(u * 2 - 1)), 0, lerp(19.4, bz, sstep(u * 2 - 1))); a.visible = t > tt1 + .3 && t < tr1 + 8; a.position.copy(pos); a.rotation.y = u < .5 ? -Math.PI / 2 : (side ? Math.PI / 2 : -Math.PI / 2) + (u < .5 ? 0 : 0); a.userData.armR.rotation.x = Math.sin(t * 8 + j) * .5; });
  put(L.cd, t, tt2 - .2, .4, tr1 - .1); put(L.l1, t, tt1 + .6, .35, tt2); put(L.l2, t, tt1 + 1.2, .35, tt2);
  /* the catch (r1-r2): neighbours walk past, doors close, bars rise */
  N.h.forEach(function (h, i) { h.door.rotation.y = -1.6 * (1 - sw(tr1 + .5 + i * .6, tr1 + 1.3 + i * .6, t)) * (t > tr1 - 4 ? 1 : 1) - 0; if (t < tr1 + .4) h.door.rotation.y = -1.6; });
  N.wk.forEach(function (p, i) { var u = (((t - tr1) * .12 + i / 7) % 1 + 1) % 1; p.visible = t > tr1 - .4 && t < tw1 + 2; p.position.set(lerp(34, -34, u), 0, 19.6 + (i % 2) * 1.2); p.rotation.y = -Math.PI / 2; p.userData.armR.rotation.x = Math.sin(t * 6 + i) * .4; });
  N.b1.visible = N.b2.visible = t > tr2 - .2 && t < tw1 + 1; var bu1 = sw(tr2, tr2 + 1.8, t), bu2 = sw(tr2 + .3, tr2 + 2.1, t); N.b1.scale.y = Math.max(.02, 8.1 * bu1); N.b1.position.y = N.b1.scale.y * .5; N.b2.scale.y = Math.max(.02, 7.9 * bu2); N.b2.position.y = N.b2.scale.y * .5; N.p1.draw(bu1); N.p2.draw(bu2); put(N.p1, t, tr2, .35, tw1); put(N.p2, t, tr2 + .3, .35, tw1); put(N.cl, t, tr2 + 1.2, .35, tw1); put(N.sh, t, tr1 + 1.2, .35, tr2);
  /* the watchman (w1-w2) */
  put(G.tag, t, tw1 + .2, .35, tw2 + 1.5); G.guard.userData.head.rotation.y = .4 * Math.sin(t * 1.1); G.guard.userData.armR.rotation.x = -.5 * sw(tw1 + 1, tw1 + 2, t); B.slam(G.st, clamp((t - tw2 - .3) / .8), 10, 6.4, 1); G.st.position.set(7.4, G.st.position.y, 13.4); put(G.cd, t, tw2 + 1.3, .4, tf1 - .1); if (t > S0('x1')) { G.st.visible = false; }
  /* fraud (f1-f2) */
  F.ag.forEach(function (a, j) { var u = clamp((t - tf1 - j * 1.1) / 2.2); a.visible = t > tf1 && t < tf2 + 2.6; a.position.set(lerp(-16 - j * 4, 0, sstep(u)) * (1 - u) + 0 * u, 0, lerp(17, 7.6 + j * 1.2, sstep(u))); a.position.x = lerp(-9 + j * 4, j * 3 - 3, sstep(u)); a.rotation.y = 0; a.userData.armR.rotation.x = -.8 + Math.sin(t * 7 + j) * .3; }); F.c1.draw(770 * sw(tf2, tf2 + 1.6, t)); put(F.c1, t, tf2, .4, tx1 - .2);
  /* the entrance (x1-x5) */
  var pu = sw(tx2, tx2 + 1, t); X.pipe.material.opacity = pu; X.rep.forEach(function (c, i) { var u = (((t - tx2 - .6) * .5 + i / 6) % 1 + 1) % 1; c.visible = t > tx2 + .4 && t < tx3 + 1.5; var p = X.curve.getPoint(u); c.position.copy(p); c.rotation.y = t * 2 + i; });
  put(X.c1, t, tx3 + .1, .4, tx4 - .1); var ru = clamp((t - tx3) / 3.4); X.rb.visible = t > tx3 - .3 && t < tx5; X.rb.position.set(lerp(-3, -33, sstep(ru)), 0, 19.4); X.rb.rotation.y = -Math.PI / 2; X.rb.userData.armR.rotation.x = Math.sin(t * 7) * .4;
  X.arm.rotation.z = sw(tx4 + .6, tx4 + 1.6, t) * 1.2; put(X.pr, t, tx4, .4, tx5); put(X.q, t, tx5, .4); X.q.rotation.z = .1 * Math.sin(t * 3); put(X.td, t, tx5 + 1.2, .35); X.a1.visible = X.a2.visible = X.a3.visible = true; };
/* ---------- the camera: one continuous travelling shot list (named moves, eased, locked between) ---------- */
function V(a) { return new V3(a[0], a[1], a[2]); }
function mv(pA, lA, fA, pB, lB, fB, o) { o = o || {}; return function (u) { var k = sstep(u), p = V(pA).lerp(V(pB), k); p.y += (o.up || 0) * Math.sin(Math.PI * k); p.x += (o.side || 0) * Math.sin(Math.PI * k); return { p: p, l: V(lA).lerp(V(lB), k), f: lerp(fA, fB, k) }; }; }
function orb(c, r, a0, a1, h0, h1, lA, lB, f) { return function (u) { var k = sstep(u), a = lerp(a0, a1, k) * Math.PI / 180; return { p: new V3(c[0] + r * Math.sin(a), lerp(h0, h1, k), c[2] + r * Math.cos(a)), l: V(lA).lerp(V(lB), k), f: f }; }; }
var th2 = S0('h2'), th3 = S0('h3');
e.follow(0, 'dolly in on the doorbell, slight arc', 0, th2 + .2, mv([-9, 4.2, 26], [1, 3.2, 5], 40, [3.4, 3.9, 21], [.6, 2.8, 4.2], 38, { side: 1.5, up: .4 }));
e.follow(0, 'crane up and pull back to the colony', th3 + .3, S0('a1') + 2.6, mv([3.4, 3.9, 21], [.6, 2.8, 4.2], 38, [26, 19, 46], [4, 2, 8], 44, { up: 8, side: -4 }));
e.follow(0, 'slow high orbit over the house', S0('a1') + 2.6, S0('t1') - .4, orb([4, 0, 10], 40, 38, -12, 17, 21, [3, 3, 8], [6, 3, 10], 42));
e.follow(0, 'swoop down to the lane gate', S0('t1') - .4, S0('t1') + 2.2, mv([37, 21, 36], [6, 3, 10], 42, [16, 6.5, 33], [14, 4, 12], 40, { side: 3, up: 3 }));
e.follow(0, 'truck along the lane', S0('t1') + 2.2, S0('r1') - .1, mv([16, 6.5, 33], [14, 4, 12], 40, [26, 4.5, 31], [13, 3, 12], 42, { side: -2 }));
e.follow(0, 'hold at the junction', S0('r1') - .1, S0('r2') - .3, mv([26, 4.5, 31], [13, 3, 12], 42, [24, 4.5, 30], [13, 3, 12], 42, {}));
e.follow(0, 'crane up to the bars', S0('r2') - .3, S0('w1') - .2, mv([24, 4.5, 30], [13, 3, 12], 42, [34, 12, 28], [24, 4, 10], 42, { up: 4, side: 2 }));
e.follow(0, 'swing across to the watchman hut', S0('w1') - .2, S0('f1') - .3, mv([34, 12, 28], [24, 4, 10], 42, [-6, 7.5, 32], [6.5, 3.4, 12.2], 42, { up: 3, side: -6 }));
e.follow(0, 'push to the door as the callers come', S0('f1') - .3, S0('f2') + 2.2, mv([-6, 7.5, 32], [6.5, 3.4, 12.2], 42, [-4, 4, 28], [1.5, 3, 8], 40, { side: -2 }));
e.follow(0, 'dolly along the road to gate 1', S0('f2') + 2.2, S0('x2') + .2, mv([-4, 4, 28], [1.5, 3, 8], 40, [0, 6.8, 37], [-9, 5, 17], 40, { up: 1.5 }));
e.follow(0, 'look back along the report pipe', S0('x2') + .2, S0('x3') - .2, mv([0, 6.8, 37], [-9, 5, 17], 40, [8, 10, 38], [-5, 12, 22], 44, { up: 2 }));
e.follow(0, 'tracking move to gate 2', S0('x3') - .2, S0('x4') - .2, mv([8, 10, 38], [-5, 12, 22], 44, [-8, 6.8, 38], [-18, 5.4, 17], 40, { side: -3 }));
e.follow(0, 'tracking move to the toll gate', S0('x4') - .2, S0('x5') - .1, mv([-8, 6.8, 38], [-18, 5.4, 17], 40, [-16, 6.8, 38], [-28, 5, 18], 40, { side: -2 }));
e.follow(0, 'crane up over the three gates', S0('x5') - .1, S0('c1') - .1, mv([-16, 6.8, 38], [-28, 5, 18], 40, [-4, 22, 46], [-16, 6, 18], 42, { up: 7 }));
e.follow(0, 'fly back to your door', S0('c1') - .1, S0('c1') + 3.0, mv([-4, 22, 46], [-16, 6, 18], 42, [7, 5.0, 17.5], [.2, 3.2, 6.6], 36, { side: 7, up: -2 }));
e.follow(0, 'settle at the door', S0('c1') + 3.0, S0('cta') - .2, mv([7, 5.0, 17.5], [.2, 3.2, 6.6], 36, [7, 5.0, 17.5], [.2, 3.2, 6.6], 36, {}));
e.follow(0, 'crane up and back', S0('cta') - .2, S0('cta') + 3.0, mv([7, 5.0, 17.5], [.2, 3.2, 6.6], 36, [14, 15, 42], [2, 1.5, 6], 42, { up: 3 }));
})();
/* Part C (billionaire): DOM header, captions, end card, sound events, dips, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['DOORBELL · 2:47 PM', 'YOUR NUMBER = YOUR DOORBELL', 'THE 2024 FIX · A MARKED STREET', 'THE CATCH · NOBODY OPENS FOR THE MARKED STREET', 'THE CHOWKIDAAR CANNOT SAY SPAM', 'SOME RINGS ARE PLAIN FRAUD', 'TRAI · 18 SEPTEMBER 2026 · THREE GATES', 'DECLARE YOURSELF'];
var HL = ['Loan ne aapko <b>dhoondha</b>', '42 arab baar <b>ghanti</b>', 'Sellers ki <b>alag gali</b>', 'Gali ka naam hi <b>badnaam</b>', 'Chowkidaar bol nahi <b>sakta</b>', 'Bank, police, <b>payment app</b>', 'Gate par <b>teen niyam</b>', 'Ab loan ko <b>naam</b> batao'];
var TAGS = ['ILLUSTRATIVE · THE PHONE AS A DOORBELL', 'TRUECALLER REPORT 2025 · ROUGH MATH', 'TRAI FRAMEWORK 2024 · VIA TECHCRUNCH', 'TRUECALLER CEO CLAIM · 8 JUL 2026', 'TECHCRUNCH, 8 JUL 2026', 'TRUECALLER REPORT · FEB 2026', 'TECHCRUNCH, 18 SEP 2026 · TRAI AMENDMENT', 'ILLUSTRATIVE SCENE'];
var hsc = D('', 'left:0;top:0;width:1080px;height:430px;background:linear-gradient(rgba(13,20,51,.92),rgba(13,20,51,.75) 55%,rgba(13,20,51,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:600 24px \'DM Mono\';letter-spacing:.14em;color:#ff8a1f;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#ff8a1f"></i><span id="ebt"></span></div><div id="hl" style="font:900 56px/1.04 Chakra Petch;letter-spacing:-.02em;margin-top:14px;color:#f4ecd8;text-shadow:0 4px 18px rgba(0,0,0,.6)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:600 21px "DM Mono";letter-spacing:.06em;color:rgba(244,236,216,.7);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(13,20,51,0),rgba(13,20,51,.94) 22%,rgba(13,20,51,.94) 80%,rgba(13,20,51,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #f4ecd8;box-shadow:0 0 0 6px #ff8a1f,0 10px 40px rgba(0,0,0,.5);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#f4ecd8;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#ff8a1f;font:600 26px "DM Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#f4ecd8', 190], ['share', 'SHARE', '#3de0a8', 210], ['bell-ringing', 'SUBSCRIBE', '#ff8a1f', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:14px;background:#0b1230;display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "DM Mono";letter-spacing:.05em;color:#f4ecd8;box-sizing:border-box', ico(c[0], 36, c[2], 1.8) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ff8a1f', chipInk: '#0b1230', keywords: { 'spam': '#ff4d5e', 'loan': '#ff8a1f', 'Truecaller': '#3de0a8', 'TRAI': '#6a7bff', 'fraud': '#ff4d5e' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = [];
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { var th2 = S0('h2'), th3 = S0('h3'), ta1 = S0('a1'), ta2 = S0('a2'), tt1 = S0('t1'), tr1 = S0('r1'), tr2 = S0('r2'), tw2 = S0('w2'), tf1 = S0('f1'), tf2 = S0('f2'), tx2 = S0('x2'), tx3 = S0('x3'), tx4 = S0('x4'), tx5 = S0('x5'), tc1 = S0('c1');
  for (var k = 0; k < 7; k++) ev(.3 + k * 1.2, 'ping'); ev(th2 - .3, 'pop'); ev(th3, 'whoosh'); ev(ta1 + .6, 'whoosh'); for (var a = 0; a < 6; a++) ev(ta1 + 1.0 + a * .5, 'tick'); ev(ta2 + 2.4, 'ping');
  ev(tt1 + .3, 'pop'); ev(tt1 + 1.2, 'pop'); ev(tt1 + 4, 'whoosh'); ev(tr1 + .5, 'slam'); ev(tr1 + 1.1, 'slam'); ev(tr2 + 1.0, 'tick'); ev(tw2 + .6, 'slam'); ev(tf1 + 1.0, 'pop'); ev(tf1 + 2.2, 'pop'); ev(tf2 + .2, 'ping');
  ev(tx2 + .2, 'pop'); ev(tx3 + .2, 'pop'); ev(tx4 + .8, 'slam'); ev(tx5 + .1, 'pop'); ev(tc1 + 3.0, 'slam'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
var AP = [.22, .18, .18, .18, .2, .2, .18, .2], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); if (window.__camO) e.setCam(window.__camO.p, window.__camO.l, window.__camO.f); else e.camAt(0, t); e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
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
