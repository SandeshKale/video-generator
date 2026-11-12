/* "Optical Bench" 3D film — Part A: premium render engine (HDR studio environment, physical materials, planar puddle reflection,
   depth-of-field + bloom + grade post chain), authored camera shots, labels, ray primitives. Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3;
var TUNG = 0xffb300, HOT = 0xefe3c8, ICE = 0x2c4bd8, VIO = 0x7b4bd0, COR = 0xe1362f, SAGE = 0x1d9a69, CHALK = 0x13172a, BENCH = 0xead9b4, PLUM = 0x13172a, CREAM = 0xefe3c8;
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
var POST = { half: 1, focus: 14, aper: 1.0, maxR: 26, bloom: .25, expo: .95, grain: .03, ca: .0008, vig: .3, fade: 0, seed: 0 };
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
var RTH = mrt(W, H);
var mHalf = sm('uniform sampler2D tC;uniform float k,ps;varying vec2 vUv;' +
  'float scr(vec2 p,float a,float s,float d){float ca=cos(a),sa=sin(a);vec2 q=mat2(ca,-sa,sa,ca)*p/s;vec2 f=fract(q)-.5;float r=sqrt(clamp(d,0.,1.))*.72;return smoothstep(r+.08,r-.08,length(f));}' +
  'void main(){vec3 c=texture2D(tC,vUv).rgb;float l=dot(c,vec3(.299,.587,.114));float ld=pow(clamp(l,0.,1.5),1./2.2);float dark=1.-smoothstep(.10,.88,ld);vec2 p=vUv*vec2(1080.,1920.);' +
  'float kd=scr(p,.785,ps,dark),cd=scr(p+7.,.26,ps*1.06,dark*.85);vec3 paper=vec3(.80,.62,.36);vec3 base=c+(paper-c)*dark*.5*k;vec3 ink=vec3(.008,.010,.028),cob=vec3(.02,.06,.62);' +
  'vec3 o=mix(base,cob,cd*dark*.6*k);o=mix(o,ink,kd*dark*.92*k);gl_FragColor=vec4(o,1.);}', { tC: { value: null }, k: { value: 1 }, ps: { value: 9 } });
var HOOKS = { pre: [] };
function render() {
  HOOKS.pre.forEach(function (f) { f(); });
  C.layers.set(0); R.setRenderTarget(RT0); R.clear(); R.render(S, C);
  mDof.uniforms.focus.value = POST.focus; mDof.uniforms.aper.value = POST.aper; mDof.uniforms.maxR.value = POST.maxR; pass(mDof, RT1);
  if (POST.half > 0) { mHalf.uniforms.tC.value = RT1.texture; mHalf.uniforms.k.value = POST.half; pass(mHalf, RTH); mDown.uniforms.tC.value = RTH.texture; pass(mDown, RT1); }
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
  if (!e) { var fs = o.fs || 56, f = o.font || '700 ' + fs + 'px "JetBrains Mono"', c = document.createElement('canvas'), x = c.getContext('2d'); x.font = f; var lines = text.split('\n'), tw = 0; lines.forEach(function (l) { tw = Math.max(tw, Math.ceil(x.measureText(l).width)); }); var pad = o.pad || 24, lh = fs * 1.25; c.width = tw + pad * 2; c.height = Math.ceil(lh * lines.length + pad * 1.1); x = c.getContext('2d'); x.font = f;
    x.fillStyle = o.bgc || 'rgba(244,236,216,.97)'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = HEX(col); x.fillRect(0, 0, 10, c.height); x.strokeStyle = 'rgba(11,18,48,.35)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, c.width - 3, c.height - 3);
    x.fillStyle = HEX(o.tcol == null ? PLUM : o.tcol); x.textBaseline = 'middle'; x.textAlign = 'left'; lines.forEach(function (l, i) { x.fillText(l, pad + 8, pad * .55 + lh * (i + .5) + 2); });
    var tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; e = LC[k] = { tx: tx, asp: c.width / c.height }; }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: e.tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * e.asp, hh, 1); s.userData = { lbl: true, kind: 'lab', sx: hh * e.asp, sy: hh, sz: 1, txt: text.slice(0, 24) }; LBL.push(s); return s; }
function card(term, meaning, col, hh) { var c = document.createElement('canvas'), w = 940, h = 340; c.width = w; c.height = h; var x = c.getContext('2d'); x.fillStyle = 'rgba(244,236,216,.98)'; x.fillRect(0, 0, w, h); x.strokeStyle = HEX(col); x.lineWidth = 7; x.strokeRect(3.5, 3.5, w - 7, h - 7);
  x.fillStyle = HEX(col); x.fillRect(0, 0, w, 62); x.fillStyle = '#0b1230'; x.font = '600 27px "JetBrains Mono"'; x.textBaseline = 'middle'; x.fillText('THIS IS CALLED', 30, 33); x.beginPath(); x.arc(w - 40, 31, 11, 0, 6.283); x.fill();
  x.fillStyle = HEX(PLUM); var tfs = 96; x.font = '400 ' + tfs + 'px "Alfa Slab One"'; while (x.measureText(term).width > w - 60 && tfs > 30) { tfs -= 4; x.font = '400 ' + tfs + 'px "Alfa Slab One"'; } x.fillText(term, 30, 150);
  x.fillStyle = 'rgba(11,18,48,.85)'; x.font = '800 36px Inter'; meaning.split('\n').forEach(function (l, i) { x.fillText(l, 30, 232 + i * 50); });
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
/* Ram Setu v2 "Survey Window" (LiDAR Survey grammar) — Part B0: timing helpers, real-data plate (NASA HLS image draped on an image-derived relief), real ICESat-2 photon cloud, instruments. Pure functions of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +TM.words[k][2].toFixed(2)]; return TM.words[k][1] + (TM.words[k][2] - TM.words[k][1]) * (f == null ? 0 : f); } } } window.__ws[id + '|' + subs] = 'MISS'; return s.t0 + (s.t1 - s.t0) * .5; }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
/* ---- palette (LiDAR grammar: cold near-black, desaturated cloud ramp, one amber accent) ---- */
var K = { BG: 0x05080a, FRONT: 0xd4fff0, AMB: 0xffb347, GRN: 0x83c495, SAND: 0xc8b38c, PALE: 0xe2f3dc, TEAL: 0x1f3f35, MID: 0x5c9a7a, SLATE: 0x9db3b0, RED: 0xff6b5e };
var B = window.B = { K: K };
/* ---- geometry of the real plate: NASA HLS (Sentinel-2) 15 Mar 2024, 79.15-80.00 E, 9.00-9.40 N. 1 world unit = 1 km, y = metres * VE ---- */
var SX = 93.4, SZ = 44.2, LON0 = 79.575, LAT0 = 9.2, VE = .12, KMLON = 109.9, KMLAT = 110.6;
B.SX = SX; B.SZ = SZ; B.VE = VE;
B.ll = function (lon, lat) { return new V3((lon - LON0) * KMLON, 0, -(lat - LAT0) * KMLAT); };
B.px = function (px, py) { return new V3((px / 2048 - .5) * SX, 0, (py / 960 - .5) * SZ); };    /* image pixel -> world */
var W = new THREE.Group(); S.add(W); window.GR = [W]; window.W = W; B.W = W;
/* ---- the plate ---- */
var PU = { map: { value: null }, uA: { value: 1 }, uRel: { value: 0 }, uVE: { value: VE }, uFront: { value: -60 }, uFrontOn: { value: 0 }, uCont: { value: 1 }, uDim: { value: 1 }, uWinK: { value: 0 }, uWin: { value: new THREE.Vector4(-8, -4, 14, 14) }, uSun: { value: new V3(-.62, .42, .5).normalize() }, uSea: { value: 0 } };
B.PU = PU;
var plate = null;
B.buildPlate = function (img) {
  /* clouds painted out: normalized blur of the cloud-free colours fills the cloud pixels (disclosed on screen: CLOUDS FILLED) */
  var FW = img.width, FH = img.height, cf = document.createElement('canvas'); cf.width = FW; cf.height = FH; var fx = cf.getContext('2d'); fx.drawImage(img, 0, 0); var fd = fx.getImageData(0, 0, FW, FH), q = fd.data, SW = FW >> 3, SH = FH >> 3, sr = new Float32Array(SW * SH * 3), sc = new Float32Array(SW * SH), mk = new Uint8Array(FW * FH);
  for (var yy = 0; yy < FH; yy++) for (var xx = 0; xx < FW; xx++) { var o = (yy * FW + xx) * 4, cl = Math.min(q[o], q[o + 1], q[o + 2]) > 168; mk[yy * FW + xx] = cl ? 1 : 0; if (!cl) { var si = ((yy >> 3) * SW + (xx >> 3)); sr[si * 3] += q[o]; sr[si * 3 + 1] += q[o + 1]; sr[si * 3 + 2] += q[o + 2]; sc[si] += 1; } }
  for (var it = 0; it < 6; it++) { var tr = new Float32Array(sr.length), tc = new Float32Array(sc.length); for (var j2 = 0; j2 < SH; j2++) for (var i2 = 0; i2 < SW; i2++) { for (var dj = -3; dj <= 3; dj++) for (var di = -3; di <= 3; di++) { var jj = j2 + dj, ii = i2 + di; if (jj < 0 || jj >= SH || ii < 0 || ii >= SW) continue; var k2 = jj * SW + ii; tr[(j2 * SW + i2) * 3] += sr[k2 * 3]; tr[(j2 * SW + i2) * 3 + 1] += sr[k2 * 3 + 1]; tr[(j2 * SW + i2) * 3 + 2] += sr[k2 * 3 + 2]; tc[j2 * SW + i2] += sc[k2]; } } var mx = 0; for (var z = 0; z < tc.length; z++) mx = Math.max(mx, tc[z]); for (z = 0; z < tr.length; z++) tr[z] = tr[z] / (mx || 1) * 1; for (z = 0; z < tc.length; z++) tc[z] = tc[z] / (mx || 1); if (it < 1) { sr = tr; sc = tc; } else { sr = tr; sc = tc; } }
  for (yy = 0; yy < FH; yy++) for (xx = 0; xx < FW; xx++) { var near = 0; if (mk[yy * FW + xx]) near = 1; else { for (var d4 = -5; d4 <= 5 && !near; d4 += 5) for (var d5 = -5; d5 <= 5; d5 += 5) { var y5 = yy + d4, x5 = xx + d5; if (y5 >= 0 && y5 < FH && x5 >= 0 && x5 < FW && mk[y5 * FW + x5]) { near = .6; break; } } } if (near) { var s3 = ((yy >> 3) * SW + (xx >> 3)), w = sc[s3] || 1e-6, o2 = (yy * FW + xx) * 4; q[o2] = q[o2] * (1 - near) + sr[s3 * 3] / w * near; q[o2 + 1] = q[o2 + 1] * (1 - near) + sr[s3 * 3 + 1] / w * near; q[o2 + 2] = q[o2 + 2] * (1 - near) + sr[s3 * 3 + 2] / w * near; } }
  fx.putImageData(fd, 0, 0); img = cf; B.cleanImg = cf;
  var GW = 512, GH = 240, cv = document.createElement('canvas'); cv.width = GW; cv.height = GH; var x = cv.getContext('2d'); x.filter = 'blur(5px)'; x.drawImage(img, 0, 0, GW, GH); x.filter = 'none';
  var d = x.getImageData(0, 0, GW, GH).data, AH = new Float32Array(GW * GH);
  for (var j = 0; j < GH; j++) for (var i = 0; i < GW; i++) { var k = (j * GW + i) * 4, r = d[k] / 255, g = d[k + 1] / 255, b = d[k + 2] / 255, lum = .3 * r + .59 * g + .11 * b, land = (r > b * .9 && r > .24) || (Math.min(r, g, b) > .72) ? 1 : 0;
    var cloud = Math.min(r, g, b) > .72; AH[j * GW + i] = cloud ? .4 : land ? .6 + 2.4 * clamp((lum - .22) / .45) : -(1.0 + 12.5 * (1 - sstep((lum - .10) / .45))); }
  for (var pass = 0; pass < 3; pass++) { var T = new Float32Array(GW * GH); for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { var sm = 0, n = 0; for (var di = -2; di <= 2; di++) { var ii = Math.max(0, Math.min(GW - 1, i + di)); sm += AH[j * GW + ii]; n++; } T[j * GW + i] = sm / n; } for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { var sm2 = 0, n2 = 0; for (var dj = -2; dj <= 2; dj++) { var jj = Math.max(0, Math.min(GH - 1, j + dj)); sm2 += T[jj * GW + i]; n2++; } AH[j * GW + i] = sm2 / n2; } }
  var geo = new THREE.PlaneGeometry(SX, SZ, GW - 1, GH - 1); geo.rotateX(-Math.PI / 2); var GX = new Float32Array(GW * GH), GZ = new Float32Array(GW * GH), dxu = SX / (GW - 1), dzu = SZ / (GH - 1); for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { var i0 = Math.max(0, i - 1), i1 = Math.min(GW - 1, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(GH - 1, j + 1); GX[j * GW + i] = (AH[j * GW + i1] - AH[j * GW + i0]) / ((i1 - i0) * dxu); GZ[j * GW + i] = (AH[j1 * GW + i] - AH[j0 * GW + i]) / ((j1 - j0) * dzu); }
  geo.setAttribute('aH', new THREE.BufferAttribute(AH, 1)); geo.setAttribute('aGx', new THREE.BufferAttribute(GX, 1)); geo.setAttribute('aGz', new THREE.BufferAttribute(GZ, 1));
  var tx = new THREE.CanvasTexture(cf); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; tx.needsUpdate = true; PU.map.value = tx;
  var mat = new THREE.ShaderMaterial({ uniforms: PU, transparent: true, extensions: { derivatives: true },
    vertexShader: 'uniform float uRel,uVE,uFront,uFrontOn;attribute float aH,aGx,aGz;varying vec2 vUv;varying float vH;varying vec3 vW,vN;void main(){vUv=uv;vH=aH;vec3 p=position;float k=uFrontOn>.5?smoothstep(uFront+1.5,uFront-1.5,p.x):1.;p.y=aH*uRel*k*uVE;vN=normalize(vec3(-aGx*uVE*uRel*k,1.,-aGz*uVE*uRel*k));vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: 'uniform sampler2D map;uniform float uA,uFront,uFrontOn,uCont,uDim,uWinK;uniform vec4 uWin;uniform vec3 uSun;varying vec2 vUv;varying float vH;varying vec3 vW,vN;' +
      'void main(){vec3 base=texture2D(map,vUv).rgb;float cl=smoothstep(.55,.78,min(base.r,min(base.g,base.b)));base=mix(base,vec3(.10,.17,.17),cl*.75);vec3 n=normalize(vN);float d=max(dot(n,uSun),0.);float lum=dot(base,vec3(.3,.59,.11));' +
      'vec3 col=mix(vec3(lum),base,.82)*(.30+1.05*d);col=mix(col,col*vec3(.78,.92,1.0),.35);' +
      'float f=abs(fract(vH)-.5);float c1=1.-smoothstep(0.,fwidth(vH)*1.3,f);float f5=abs(fract(vH*.2)-.5);float c5=1.-smoothstep(0.,fwidth(vH*.2)*1.3,f5);float gg=fwidth(vH);float vis=smoothstep(.0004,.003,gg)*(1.-smoothstep(.2,.5,vH));col=mix(col,vec3(.83,1.,.94),(c1*.16+c5*.30)*uCont*vis);' +
      'float ahead=uFrontOn>.5?smoothstep(uFront-.25,uFront+.25,vW.x):0.;col=mix(col,vec3(.02,.04,.045),ahead*.93);col+=vec3(.83,1.,.94)*exp(-pow((vW.x-uFront)/.5,2.))*uFrontOn*1.7;' +
      'float inside=step(uWin.x,vW.x)*step(vW.x,uWin.z)*step(uWin.y,vW.z)*step(vW.z,uWin.w);col*=mix(1.,mix(.20,1.,inside),uWinK);' +
      'vec2 q=abs(vUv-.5)*2.;float edge=1.-smoothstep(.86,1.,max(q.x,q.y));col*=uDim*edge;gl_FragColor=vec4(col,uA*edge);}' });
  plate = new THREE.Mesh(geo, mat); plate.renderOrder = 1; plate.frustumCulled = false; W.add(plate); B.plate = plate; B.AH = AH; B.GW = GW; B.GH = GH; };
/* ---- the real photon cloud (ICESat-2 ATL03, 4 ground tracks x 6 beams, 216,000 of 1,097,777 returns in the window) ---- */
var PT = { uFx: { value: 99 }, uFz: { value: 99 }, uTrack: { value: -1 }, uYs: { value: 1 }, uVis: { value: 0 }, uSize: { value: 3 }, uVE: { value: VE }, uPulse: { value: 0 }, uFrontX: { value: -99 }, uRGT: { value: -1 } };
B.PT = PT;
B.buildPhotons = function () {
  var N = window.PHN, bin = atob(window.PHB64), bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  var u = new Uint16Array(bytes.buffer, 0, N), v = new Uint16Array(bytes.buffer, N * 2, N), h = new Int16Array(bytes.buffer, N * 4, N), ti = bytes.subarray(N * 6, N * 7), BB = window.PHBB;
  var pos = new Float32Array(N * 3), aH = new Float32Array(N), aT = new Float32Array(N), aZ = new Float32Array(N), aR = new Float32Array(N);
  for (i = 0; i < N; i++) { var lon = BB[0] + u[i] / 65535 * (BB[2] - BB[0]), lat = BB[1] + v[i] / 65535 * (BB[3] - BB[1]), p = B.ll(lon, lat), hm = h[i] / 100; pos[i * 3] = p.x; pos[i * 3 + 1] = hm * VE; pos[i * 3 + 2] = p.z; aH[i] = hm; aT[i] = ti[i]; aR[i] = Math.floor(ti[i] / 6); }
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aH', new THREE.BufferAttribute(aH, 1)); g.setAttribute('aT', new THREE.BufferAttribute(aT, 1)); g.setAttribute('aR', new THREE.BufferAttribute(aR, 1));
  var m = new THREE.ShaderMaterial({ uniforms: PT, transparent: true, depthWrite: false,
    vertexShader: 'uniform float uFx,uFz,uTrack,uVis,uSize,uPulse,uRGT,uYs;attribute float aH,aT,aR;varying float vH,vOn,vA;void main(){vH=aH;vec3 pp=position;pp.y*=uYs;vec4 mv=modelViewMatrix*vec4(pp,1.);gl_Position=projectionMatrix*mv;float dist=-mv.z;float inTr=(uTrack<0.&&uRGT<0.)||(aT==uTrack)||(uRGT>=0.&&aR==uRGT)?1.:0.;vOn=inTr*step(position.x,uFx)*step(position.z,uFz)*uVis;vA=vOn;gl_PointSize=clamp(uSize*95./dist,1.4,5.5)*(1.+.45*uPulse*step(.5,fract(aT*.37+position.x*.11)));}',
    fragmentShader: 'varying float vH,vOn,vA;void main(){if(vOn<.5)discard;vec2 c=gl_PointCoord-.5;float r=length(c);if(r>.5)discard;float a=smoothstep(.5,.15,r);vec3 col;' +
      'if(vH>.6)col=vec3(.78,.70,.55);else if(vH>-.7)col=vec3(.36,.55,.55);else{float t=clamp(-vH/22.,0.,1.);col=mix(vec3(.12,.25,.21),mix(vec3(.36,.60,.48),vec3(.89,.95,.86),smoothstep(.45,1.,t)),smoothstep(0.,.45,t));}' +
      'gl_FragColor=vec4(col*1.0,a*.85);}' });
  var pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.renderOrder = 3; W.add(pts); B.pts = pts; B.ph = { pos: pos, aH: aH, aT: aT, N: N }; };
/* ---- satellite stand-in (PBR; not to scale; ICESat-2 is not in NASA's vendored 3D set) ---- */
B.sat = function (sc) { var g = new THREE.Group(), P = function (c, o) { return e.physMat(c, Object.assign({ metalness: .9, roughness: .3, envMapIntensity: 1.2 }, o)); }, gold = P(0xd9b24a), alu = P(0xb8c2cc, { roughness: .26 }), dark = P(0x1b2531, { metalness: .5, roughness: .5 });
  var bus = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 2.8), alu); g.add(bus); var foil = new THREE.Mesh(new THREE.BoxGeometry(1.86, 1.2, 2.2), gold); foil.position.y = -.05; g.add(foil);
  var cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; var x = cv.getContext('2d'); x.fillStyle = '#0d1b3d'; x.fillRect(0, 0, 512, 128); x.strokeStyle = '#4a7bd0'; x.lineWidth = 2; for (var i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, 128); x.stroke(); } for (i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(0, i * 32); x.lineTo(512, i * 32); x.stroke(); } var tx = e.canvasTex(cv);
  [-1, 1].forEach(function (s) { var pn = new THREE.Mesh(new THREE.BoxGeometry(5.2, .06, 1.3), [dark, dark, new THREE.MeshStandardMaterial({ map: tx, metalness: .5, roughness: .35, emissive: 0x08142f, emissiveIntensity: .6 }), dark, dark, dark]); pn.position.set(s * 3.9, 0, 0); g.add(pn); var arm = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.2, 8), alu); arm.rotation.z = Math.PI / 2; arm.position.set(s * 1.4, 0, 0); g.add(arm); });
  var dish = new THREE.Mesh(new THREE.SphereGeometry(.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), alu); dish.rotation.x = Math.PI; dish.position.set(0, .95, -.7); g.add(dish);
  var optic = new THREE.Mesh(new THREE.CylinderGeometry(.42, .5, .5, 24), dark); optic.position.set(0, -.95, .3); g.add(optic); var lens = new THREE.Mesh(new THREE.CircleGeometry(.32, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x7dff9a).multiplyScalar(2.4) })); lens.rotation.x = Math.PI / 2; lens.position.set(0, -1.21, .3); g.add(lens);
  g.scale.setScalar(sc || 1); return g; };
/* ---- pixel-placed labels and authored frames (same contract as the other 3D reels) ---- */
function unp(A, px, py, dist) { return e.unp(A, px, py, dist); }
B.fr = function (c, d, pitch, yaw, fov, rowPx) { fov = fov || 38; rowPx = rowPx || 761; var c3 = new V3(c[0], c[1], c[2]), pr = pitch * Math.PI / 180, yw = (yaw || 0) * Math.PI / 180, dir = new V3(Math.sin(yw) * Math.cos(pr), Math.sin(pr), Math.cos(yw) * Math.cos(pr)), p = c3.clone().add(dir.clone().multiplyScalar(d)), fwd = c3.clone().sub(p).normalize(), right = new V3().crossVectors(fwd, new V3(0, 1, 0)).normalize(), up = new V3().crossVectors(right, fwd).normalize(), wpp = 2 * d * Math.tan(fov * Math.PI / 360) / e.H, l = c3.clone().sub(up.multiplyScalar((960 - rowPx) * wpp)); return [[p.x, p.y, p.z], [l.x, l.y, l.z], fov]; };
B.sh = function (sc, name, t0, t1, A, Bb, ease) { e.shot(sc, name, t0, t1, A[0], A[1], A[2], Bb[0], Bb[1], Bb[2], ease); };
B.lock = function (sc, name, t0, A) { e.shot(sc, name, t0, t0 + .01, A[0], A[1], A[2], A[0], A[1], A[2], 'io'); };
B.PL = function (o, A, px, py, dist, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / e.H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; var q = unp(A, px, py, dist); o.position.copy(q); ud.p0 = null; if (o.parent !== W) W.add(o); return o; };
/* a label in the LiDAR instrument style: dark glass plate, hairline accent bar, mono readout */
B.tag = function (text, col, A, px, py, dist, pxH, o) { o = o || {}; var l = e.lab(text, col, 1, Object.assign({ font: '600 ' + (o.fs || 30) + 'px "IBM Plex Mono"', fs: o.fs || 30, bgc: 'rgba(5,8,10,.90)', tcol: o.tcol == null ? 0xe2f3dc : o.tcol, pad: 22 }, o)); return B.PL(l, A, px, py, dist, pxH); };
B.PW = function (o, A, wp, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, cp = new V3(A[0][0], A[0][1], A[0][2]), dist = cp.distanceTo(wp), wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / e.H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; o.position.copy(wp); ud.p0 = null; if (o.parent !== W) W.add(o); return o; };
B.tagW = function (text, col, A, wp, pxH, o) { o = o || {}; var l = e.lab(text, col, 1, Object.assign({ font: '600 ' + (o.fs || 30) + 'px "IBM Plex Mono"', fs: o.fs || 30, bgc: 'rgba(5,8,10,.90)', tcol: o.tcol == null ? 0xe2f3dc : o.tcol, pad: 22 }, o)); return B.PW(l, A, wp, pxH); };
B.num = function (text, col, A, px, py, dist, pxH, o) { return B.tag(text, col, A, px, py, dist, pxH, Object.assign({ font: '600 ' + ((o && o.fs) || 120) + 'px "Barlow Condensed"', fs: (o && o.fs) || 120, pad: 26 }, o || {})); };
B.buildPhotons();
})();
/* Ram Setu v2 "Survey Window" — Part B1: ONE continuous plate (real NASA HLS image + real ICESat-2 photon cloud); the camera flies it, fronts and planes change what is lit. Pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, eob = e.eob, put = e.put, B = window.B, K = B.K, PU = B.PU, PT = B.PT, W = B.W, fr = B.fr, sh = B.sh, lock = B.lock, tag = B.tag, num = B.num, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS, HEX = e.HEX, VE = B.VE;
var SX = B.SX, SZ = B.SZ; var SC = window.SC = [0, S0('p1') - .4, S0('b1') - .4, S0('m1') - .4, S0('l1') - .4, S0('r1') - .4, S0('e1') - .4, S0('f1') - .4, window.TM.end];
window.SCN = [];
/* lights (only the satellite stand-in is lit by them; the plate is its own raking-sun shader) */
var DL = new THREE.DirectionalLight(0xdff6ff, 2.2); DL.position.set(-30, 50, 20); S.add(DL); S.add(new THREE.AmbientLight(0x6f8f99, .5)); S.background = new THREE.Color(K.BG);
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
function GA(A, px, py) { var p = new V3(A[0][0], A[0][1], A[0][2]), q = e.unp(A, px, py, 100), d = q.clone().sub(p), k = -p.y / d.y; return p.clone().add(d.multiplyScalar(k)); }
function setDefaults() { PU.uA.value = 1; PU.uRel.value = 1; PU.uFrontOn.value = 0; PU.uCont.value = 1; PU.uDim.value = 1; PU.uWinK.value = 0; PT.uVis.value = 0; PT.uFx.value = 99; PT.uFz.value = 99; PT.uTrack.value = -1; PT.uRGT.value = -1; PT.uPulse.value = 0; PT.uSize.value = 3; PT.uYs.value = 1; }
/* ---- world objects ---- */
var CHP = [[720, 590], [760, 610], [830, 650], [900, 700], [980, 735], [1060, 760], [1150, 775], [1220, 755], [1280, 720]].map(function (p) { return B.px(p[0], p[1]); });
var chainLen = 0; for (var q = 1; q < CHP.length; q++) chainLen += CHP[q].distanceTo(CHP[q - 1]); window.__chainLen = chainLen;
var tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(CHP.map(function (p) { return new V3(p.x, .5, p.z); })), 80, .22, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.AMB).multiplyScalar(1.8), transparent: true, opacity: .95 })); tube.renderOrder = 4; W.add(tube); tube.visible = false;
function chainTube(u) { var n = Math.max(1, Math.floor(u * 80)); tube.geometry.setDrawRange(0, n * 8 * 6); }
/* hairline ruler (ticks every km along a straight line, taller every 5) */
function ruler(a, b, col, y, tickEvery) { var g = new THREE.Group(), main = e.ray(new V3(a.x, y, a.z), new V3(b.x, y, b.z), col, .13, .95); g.add(main); var L = a.distanceTo(b), dir = b.clone().sub(a).normalize(), side = new V3(-dir.z, 0, dir.x);
  for (var d = 0; d <= L + .01; d += tickEvery) { var p = a.clone().addScaledVector(dir, d), big = Math.round(d / tickEvery) % 5 === 0; g.add(e.ray(new V3(p.x, y, p.z).addScaledVector(side, -.0), new V3(p.x, y, p.z).addScaledVector(side, big ? 1.4 : .75), col, .06, .95)); }
  [a, b].forEach(function (p) { g.add(e.ray(new V3(p.x, 0, p.z), new V3(p.x, y + 3, p.z), col, .07, .8)); }); g.visible = false; W.add(g); g.userData.L = L; return g; }
var A29 = B.px(720, 590), B29 = B.px(1290, 705), A48 = B.px(330, 230), B48 = B.px(1290, 705), rA = ruler(A29, B29, K.AMB, 1.2, 1), rB = ruler(A48, B48, K.FRONT, 2.4, 2);
/* the satellite pass: stand-in, six beams, footprints */
var sat = B.sat(1.1); W.add(sat); sat.visible = false; var beams = [], foots = [], tm = []; for (q = 0; q < 6; q++) { var bm = e.ray(new V3(), new V3(0, 1, 0), 0x7dff9a, .06, .8); bm.visible = false; W.add(bm); beams.push(bm); var ft = new THREE.Mesh(new THREE.RingGeometry(.28, .38, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x7dff9a).multiplyScalar(2), side: THREE.DoubleSide, transparent: true, opacity: .95, depthWrite: false })); ft.rotation.x = -Math.PI / 2; ft.visible = false; ft.renderOrder = 5; W.add(ft); foots.push(ft); }
var tx0 = []; (function () { var P = B.ph; for (var t = 12; t < 18; t++) { var sx = 0, sz = 0, n = 0; for (var i = 0; i < P.N; i++) if (P.aT[i] === t) { sx += P.pos[i * 3]; sz += P.pos[i * 3 + 2]; n++; } tx0.push([sx / n, sz / n]); } })();
/* volume gauge (99.98 % / 0.02 %): a tall column, hairline amber slice */
var gauge = new THREE.Group(); (function () { var col = new THREE.Mesh(new THREE.BoxGeometry(2.6, 14, 2.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x3f8f9a).multiplyScalar(1.1), transparent: true, opacity: .55 })); col.position.y = 7; gauge.add(col); var sl = new THREE.Mesh(new THREE.BoxGeometry(2.9, .06, 2.9), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.AMB).multiplyScalar(2.4) })); sl.position.y = 14.03; gauge.add(sl);  var fr0 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 14, 2.6)), new THREE.LineBasicMaterial({ color: K.FRONT, transparent: true, opacity: .8 })); fr0.position.y = 7; gauge.add(fr0); })(); gauge.visible = false; W.add(gauge);
/* waterline sheet (S2): a translucent plane at sea level that lifts away */
var wl = new THREE.Mesh(new THREE.PlaneGeometry(SX, SZ), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x2e7f8f).multiplyScalar(1.1), transparent: true, opacity: .35, depthWrite: false, side: THREE.DoubleSide })); wl.rotation.x = -Math.PI / 2; wl.visible = false; wl.renderOrder = 2; W.add(wl);
/* section sheet (S5): a vertical plane across the chain with a hairline edge */
var secX = B.px(1000, 0).x, sec = new THREE.Group(); (function () { var pl = new THREE.Mesh(new THREE.PlaneGeometry(26, 7), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.FRONT).multiplyScalar(.9), transparent: true, opacity: .13, side: THREE.DoubleSide, depthWrite: false })); pl.rotation.y = Math.PI / 2; pl.position.y = -1.0; sec.add(pl); sec.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(26, 7)), new THREE.LineBasicMaterial({ color: new THREE.Color(K.FRONT), transparent: true, opacity: .9 }))); sec.children[1].rotation.y = Math.PI / 2; sec.children[1].position.y = -1.0; })(); sec.position.set(secX, 0, 7.6); sec.visible = false; W.add(sec);
/* sediment arrows (study, reported): thick from the Gulf of Mannar (south), thin from the Palk Strait (north) */
var arrows = []; (function () { function arrow(x, z, dirz, th, L, col) { var g = new THREE.Group(), a0 = new V3(x, .9, z), a1 = new V3(x, .9, z + dirz * L); g.add(e.ray(a0, a1, col, th, .95)); var hd = e.arrowHead(col, th * 5); hd.position.copy(a1); hd.quaternion.setFromUnitVectors(new V3(0, 1, 0), new V3(0, 0, dirz)); g.add(hd); g.visible = false; W.add(g); arrows.push(g); }
  for (var i = 0; i < 5; i++) arrow(B.px(820 + i * 90, 0).x, B.px(0, 960).z - 1, -1, .24, 9, K.GRN); for (i = 0; i < 3; i++) arrow(B.px(860 + i * 130, 0).x, B.px(0, 520).z - 1, 1, .1, 5.5, K.GRN); })();
/* survey window outline (S6) */
var winL = new THREE.Group(); (function () { var w = [-16, 1, 15, 14]; var pts = [new V3(w[0], 1.2, w[1]), new V3(w[2], 1.2, w[1]), new V3(w[2], 1.2, w[3]), new V3(w[0], 1.2, w[3]), new V3(w[0], 1.2, w[1])]; for (var i = 0; i < 4; i++) winL.add(e.ray(pts[i], pts[i + 1], K.AMB, .1, .95)); })(); winL.visible = false; W.add(winL);
/* scale bar (10 km) for the nadir plate */
var sbar = new THREE.Group(); (function () { var a = new V3(-37, .6, 17), b = new V3(-27, .6, 17); sbar.add(e.ray(a, b, K.FRONT, .12, .95)); for (var i = 0; i <= 10; i++) sbar.add(e.ray(new V3(-37 + i, .6, 17), new V3(-37 + i, .6, 17.0 + (i % 5 === 0 ? 1.0 : .5)), K.FRONT, .05, .9)); })(); sbar.visible = false; W.add(sbar);
function RO(o, n) { o.traverse(function (m) { if (m.isMesh || m.isLine || m.isSprite) m.renderOrder = n; }); }
[rA, rB, sbar, winL].forEach(function (o) { RO(o, 6); }); beams.forEach(function (o) { RO(o, 6); }); arrows.forEach(function (o) { RO(o, 6); }); RO(sec, 6); RO(gauge, 7); RO(sat, 8);
window.__dbg = { rA: rA, rB: rB, tube: tube };
var dep = new THREE.Group(); (function () { var Y = VE * 6; dep.add(e.ray(new V3(0, 0, 0), new V3(0, -12 * Y, 0), K.FRONT, .035, .95)); for (var m = 0; m <= 12; m += 2) { dep.add(e.ray(new V3(0, -m * Y, 0), new V3(0, -m * Y, -.7), K.FRONT, .03, .95)); } })(); RO(dep, 7); dep.visible = false; W.add(dep); window.__dep = dep;
/* ========================= scenes ========================= */
var FR = { w: fr([0, 0, 2], 236, 87, 0, 38, 761) };
function hideAll() { [dep, tube, rA, rB, sat, gauge, wl, sec, winL, sbar].forEach(function (o) { o.visible = false; }); beams.forEach(function (b) { b.visible = false; }); foots.forEach(function (f) { f.visible = false; }); arrows.forEach(function (a) { a.visible = false; }); }
/* S0: the plate is a photo; a scan front crosses it; behind the front the place is points and relief */
(function () { var A0 = fr([0, 0, 2], 120, 86, 90, 38, 761), A1 = fr([-3, 0, 5], 66, 50, 70, 38, 761), t0 = 4.6, t1 = 10.6;
  var H1 = num('99.98 %', K.AMB, A1, 540, 410, 66, 150, { fs: 150 }), H2 = tag('PAANI KE NEECHE', K.AMB, A1, 540, 540, 66, 62, { fs: 40 }), R1 = tag('PALK STRAIT · ~9.2°N 79.6°E', K.FRONT, A1, 540, 1100, 66, 56, { fs: 26 }), R2 = B.tagW('SRI LANKA · MANNAR ISLAND', K.SLATE, A1, B.px(1700, 860), 52, { fs: 24 }), R3 = B.tagW('RAMESWARAM ISLAND · INDIA', K.SLATE, A1, B.px(380, 330), 52, { fs: 24 });
  var H0 = num('RAM SETU', K.FRONT, A0, 540, 430, 120, 140, { fs: 140 }), H0b = tag('SATELLITE KO ASAL MEIN KYA DIKHTA HAI?', K.AMB, A0, 540, 570, 120, 56, { fs: 28 }); H0.userData.kind = 'dyn';
  H1.userData.kind = 'dyn'; lock(0, 'locked nadir', 0, A0); sh(0, 'crane-down', t0, t1, A0, A1);
  SCN[0] = function (t) { setDefaults(); hideAll(); PU.uRel.value = 1; PU.uFrontOn.value = 1; PU.uFront.value = lerp(34, 58, eo3(clamp(t / 9.6))); PT.uVis.value = 1; PT.uFx.value = PU.uFront.value; PT.uSize.value = 2.6;
    put(H0, t, -.1, .3, 4.5); put(H0b, t, -.1, .3, 4.5); put(H1, t, WS('h1', 'निन्यानवे', .9) - .1, .4); put(H2, t, WS('h1', 'निन्यानवे', .9) + .35, .4); put(R1, t, S0('h2') + .3, .4); put(R2, t, S0('h2') + .7, .4); put(R3, t, S0('h2') + 1.1, .4); }; })();
/* S1: the pale line — real image from straight above, hairline instruments */
(function () { var A0 = fr([0, 0, 3], 96, 87, 90, 38, 761), a = SC[1];
  var N1 = B.tagW('RAMESWARAM', K.FRONT, A0, B.px(380, 330), 50, { fs: 26 }), N2 = B.tagW('MANNAR', K.FRONT, A0, B.px(1700, 880), 50, { fs: 26 }), N3 = B.tagW('TRACED FROM THE IMAGE · INTERPRETATION', K.AMB, A0, B.px(1000, 800), 46, { fs: 18 }), CH = tag('NASA HLS · SENTINEL-2 · 15 MAR 2024 · 30 m', K.AMB, A0, 540, 330, 100, 52, { fs: 24 }), PL2 = num('HALKI SI PATTI', K.AMB, A0, 540, 440, 100, 110, { fs: 96 }), CR = tag('CREDIT: NASA GIBS / HLS (COPERNICUS SENTINEL-2 DATA) · CLOUDS FILLED', K.SLATE, A0, 540, 1235, 100, 48, { fs: 20 });
  PL2.userData.kind = 'dyn'; lock(1, 'locked nadir', a, A0);
  SCN[1] = function (t) { setDefaults(); hideAll(); PU.uRel.value = .02 + .0 * t; PT.uVis.value = 0; sbar.visible = true; tube.visible = true; chainTube(clamp((t - a - .8) / 3.4));
    put(N1, t, a + 1.0, .4); put(N2, t, a + 1.6, .4); put(N3, t, a + 3.2, .4); put(CH, t, S0('p1') + 1.6, .4); put(PL2, t, S0('p1') + .6, .4, S0('p1') + 4); put(CR, t, a + 1.8, .4); }; })();
/* S2: mostly underwater — the waterline sheet lifts away; the volume gauge shows 99.98 / 0.02 */
(function () { var A0 = fr([0, 0, 3], 96, 87, 90, 38, 761), A1 = fr([4, 0, 5], 74, 54, 100, 38, 761), a = SC[2], gp = GA(A1, 820, 1130); gauge.position.copy(gp); var gt = gp.clone(); gt.y = 14.03 * .72; var gm = gp.clone(); gm.y = 7 * .72;
  var Z1 = num('0.02 %', K.AMB, A1, 540, 410, 70, 150, { fs: 150 }), Z2 = tag('SAMUNDAR KI SATAH SE UPAR (STUDY, REPORTED)', K.FRONT, A1, 540, 540, 70, 52, { fs: 22 }), Z3 = tag('SEA LEVEL', K.FRONT, A1, 240, 1090, 70, 50, { fs: 24 }), Z4 = num('PAANI KE NEECHE KA NAKSHA?', K.AMB, A1, 540, 450, 70, 100, { fs: 64 }), G1 = B.tagW('99.98 % SUBMERGED', K.FRONT, A1, new V3(gm.x - 4.2, gm.y, gm.z), 50, { fs: 24 }), G2 = B.tagW('0.02 % ABOVE SEA LEVEL', K.AMB, A1, new V3(gt.x - 4.6, gt.y + 1.2, gt.z), 50, { fs: 24 }), CR = tag('GAUGE = VOLUME OF THE SHOAL CHAIN · SCHEMATIC · VERTICAL x120', K.SLATE, A1, 540, 1235, 70, 46, { fs: 18 });
  Z1.userData.kind = 'dyn'; Z4.userData.kind = 'dyn'; lock(2, 'locked top', a, A0); sh(2, 'tilt', a + .6, a + 4.6, A0, A1);
  SCN[2] = function (t) { setDefaults(); hideAll(); PU.uRel.value = lerp(.05, 1, sw(a + .2, a + 3, t)); wl.visible = true; wl.position.y = lerp(.05, 6, sw(S0('b2') - .2, S0('b2') + 1.8, t)); wl.material.opacity = .38 * (1 - sw(S0('b2') + 1, S0('b2') + 3, t)); gauge.visible = t > a + 2.2; gauge.scale.set(1, .72 * clamp((t - a - 2.2) / .8), 1);
    put(Z1, t, WS('b1', 'शुन्य|दश्मलव', .55), .4, S0('b2') - .1); put(Z2, t, WS('b1', 'शुन्य|दश्मलव', .55) + .4, .4, S0('b2') - .1); put(Z3, t, a + 1.6, .4); put(Z4, t, S0('b2') + .1, .4); put(G1, t, a + 3.2, .4); put(G2, t, WS('b1', 'शुन्य|दश्मलव', .55) + .1, .4); put(CR, t, a + 2.2, .4); }; })();
/* S3: the laser pass — real photons of one ground track appear behind the satellite, then all four tracks. Labels are placed per frame in the follow-cam frame. */
(function () { var a = SC[3], dur = SC[4] - SC[3], tp0 = a + 1.2, tp1 = a + dur * .60, cx = tx0.reduce(function (s, p) { return s + p[0]; }, 0) / 6, A1 = fr([0, 0, 2], 128, 64, 90, 38, 761);
  var zOf = function (t) { return lerp(-26, 26, clamp((t - tp0) / (tp1 - tp0))); }, pose = function (t) { var z = zOf(t); return [[cx + 20, 38, z + 26], [cx, 10, z + 3], 38]; };
  var L1 = tag('LASER → SEABED', K.AMB, pose(a), 540, 330, 56, 62, { fs: 40 }), L2 = tag('REAL ICESat-2 PHOTONS · 1 TRACK · 6 BEAMS', K.FRONT, pose(a), 540, 430, 56, 54, { fs: 24 }), L3 = tag('GREEN LASER · ~40 m DEPTH (STUDY, REPORTED)', K.FRONT, pose(a), 540, 1090, 56, 52, { fs: 22 }), L4 = tag('SATELLITE = STAND-IN MODEL · NOT TO SCALE', K.SLATE, pose(a), 540, 1240, 56, 46, { fs: 20 }), L5 = tag('4 TRACKS · 24 BEAM-PASSES · 216,000 OF 1.1 M RETURNS SHOWN', K.AMB, A1, 540, 330, 128, 56, { fs: 24 }), L6 = tag('OCT 2018 – OCT 2023 · THE STUDY (REPORTED)', K.FRONT, A1, 540, 1100, 128, 52, { fs: 22 });
  e.follow(3, 'follow-cam (damped)', a, tp1, function (u, t) { var P = pose(t); return { p: new V3(P[0][0], P[0][1], P[0][2]), l: new V3(P[1][0], P[1][1], P[1][2]), f: 38 }; }); sh(3, 'crane-up', tp1 + .2, tp1 + 3.6, [[cx + 20, 38, 50], [cx, 10, 29], 38], A1);
  SCN[3] = function (t) { setDefaults(); hideAll(); var u = clamp((t - tp0) / (tp1 - tp0)), z = lerp(-26, 26, u), after = sw(tp1, tp1 + 2.4, t), P = pose(Math.min(t, tp1)); [L1, L2, L3, L4].forEach(function (l, i) { var y = [335, 405, 1090, 1240][i]; B.PL(l, P, 540, y, 56, [62, 54, 52, 46][i]); });
    PU.uDim.value = lerp(.38, .85, after); PU.uRel.value = 1; PT.uVis.value = 1; PT.uSize.value = 3.4; if (after <= 0) { PT.uRGT.value = 2; PT.uFz.value = z; } else { PT.uRGT.value = -1; PT.uFx.value = lerp(-46, 48, after); }
    if (u > 0 && u < 1.03) { sat.visible = true; sat.position.set(cx, 15, z); sat.rotation.y = 0; sat.scale.setScalar(.9); beams.forEach(function (b, i) { b.visible = true; e.setRay(b, new V3(cx + (i - 2.5) * .12, 14, z), new V3(tx0[i][0], 0, z)); foots[i].visible = true; foots[i].position.set(tx0[i][0], .05, z); }); }
    put(L1, t, a + .3, .4, tp1 + .15); put(L2, t, tp0 + .6, .4, tp1 + .15); put(L3, t, WS('m1', '40', .85), .4, tp1 + .15); put(L4, t, a + 2, .4, tp1 + .15); put(L5, t, tp1 + 1.2, .4); put(L6, t, S0('m2') + 1.4, .4); }; })();
/* S4: two lengths — two hairline rulers on the same plate */
(function () { var A0 = fr([0, 0, 3], 125, 72, 90, 38, 761), a = SC[4];
  var K1 = num('~29 km', K.AMB, A0, 330, 900, 118, 110, { fs: 96 }), K2 = num('~48 km', K.FRONT, A0, 330, 360, 118, 110, { fs: 96 }), N3 = tag('STUDY: DHANUSHKODI → TALAIMANNAR (REPORTED)', K.AMB, A0, 540, 1010, 118, 50, { fs: 20 }), N4 = tag('ESA: RAMESWARAM ISLAND → MANNAR ISLAND (REPORTED)', K.FRONT, A0, 540, 475, 118, 50, { fs: 20 }), N5 = tag('DONO KE CHHOR ALAG HAIN (MERI SAMAJH)', K.SLATE, A0, 540, 1110, 118, 50, { fs: 22 }), CR = tag('END POINTS APPROXIMATE · DRAWN ON THE REAL IMAGE', K.SLATE, A0, 540, 1235, 118, 46, { fs: 18 });
  K1.userData.kind = 'dyn'; K2.userData.kind = 'dyn'; lock(4, 'locked', a, A0);
  SCN[4] = function (t) { setDefaults(); hideAll(); PU.uRel.value = 1; PU.uDim.value = .9; PT.uVis.value = .6; PT.uSize.value = 2.2; var u1 = clamp((t - WS('l1', 'अड़तालीस|48', .25)) / 1.6), u2 = clamp((t - WS('l1', 'उनतीस|29', .8)) / 1.6); rB.visible = u1 > 0; rA.visible = u2 > 0; rB.scale.set(1, 1, 1); tube.visible = true; chainTube(1);
    put(K2, t, WS('l1', 'अड़तालीस|48', .25) + .5, .4); put(K1, t, WS('l1', 'उनतीस|29', .8) + .5, .4); put(N4, t, WS('l1', 'अड़तालीस|48', .25) + 1.0, .4); put(N3, t, WS('l1', 'धनुषकोडि', .5), .4); put(N5, t, S0('l2') + .2, .4); put(CR, t, a + 2, .4); }; })();
/* S5: the section — one real beam seen side-on (vertical x720), then the whole 0081 track set from above; sediment arrows */
(function () { var a = SC[5], ph = B.ph, bx = 0, bn = 0; for (var i = 0; i < ph.N; i++) if (ph.aT[i] === 0) { bx += ph.pos[i * 3]; bn++; } bx /= bn; var A0 = fr([bx, -3.6, 6.4], 120, 2, 90, 11, 761), A1 = fr([bx, -1, 6], 44, 38, 50, 38, 761), A2 = fr([0, 0, 3], 100, 75, 90, 38, 761);
  var Q1 = tag('ONE REAL BEAM · ICESat-2 RGT 0081 · ACROSS THE CHAIN', K.AMB, A0, 540, 330, 120, 52, { fs: 21 }), Q1b = tag('UBAD-KHABAD · ±1.5 km (STUDY, REPORTED)', K.FRONT, A1, 540, 330, 44, 52, { fs: 22 }), Q2 = tag('GULF OF MANNAR: ZYADA MITTI', K.GRN, A2, 540, 1140, 100, 52, { fs: 22 }), Q3 = tag('PALK STRAIT: KAM', K.GRN, A2, 540, 400, 100, 52, { fs: 22 }), Q4 = tag('DHANUSHKODI ↔ TALAIMANNAR', K.FRONT, A2, 540, 330, 100, 54, { fs: 26 }), CR = tag('NOT A SEABED MODEL · APPARENT DEPTH · RELIEF ILLUSTRATIVE', K.SLATE, A2, 540, 1235, 100, 44, { fs: 18 }), CR0 = tag('VERTICAL x720 · APPARENT DEPTH, NOT REFRACTION-CORRECTED', K.SLATE, A0, 540, 1235, 120, 44, { fs: 18 }), Q5 = tag('SEA SURFACE · MOST OF THE RETURNS', K.FRONT, A0, 760, 590, 120, 48, { fs: 22 }), Q6 = tag('FEW RETURNS FROM THE BOTTOM · THE STUDY FILTERED 5 YEARS (REPORTED)', K.AMB, A0, 480, 940, 120, 48, { fs: 20 }), Q7 = tag('0 m', K.FRONT, A0, 130, 620, 120, 44, { fs: 20 }), Q8 = tag('10 m', K.FRONT, A0, 130, 1010, 120, 44, { fs: 20 });
  lock(5, 'locked side-on', a, A0); sh(5, 'orbit', S0('r2') - .4, S0('r2') + 1.8, A0, A1); sh(5, 'crane-top-down', S0('r2') + 2.0, S0('r2') + 5, A1, A2);
  SCN[5] = function (t) { setDefaults(); hideAll(); var k = sw(S0('r2') - .3, S0('r2') + 1.8, t), top = sw(S0('r2') + 2.0, S0('r2') + 4.2, t); PU.uRel.value = 1; PU.uA.value = lerp(.05, 1, k); PU.uDim.value = .85; PT.uVis.value = 1; PT.uTrack.value = k > .5 ? -1 : 0; PT.uRGT.value = k > .5 ? 0 : -1; PT.uYs.value = lerp(6, 1, k); PT.uSize.value = 3.6; dep.visible = k < .4; dep.position.set(bx + .01, 0, 3.2); var su = clamp((t - WS('r2', 'मन्नार', .3)) / 1.5); arrows.forEach(function (g) { g.visible = su > 0; g.scale.setScalar(.3 + .7 * eo3(su)); });
    put(Q1, t, a + .3, .4, S0('r2') - .4); put(Q5, t, a + 1.2, .4, S0('r2') - .4); put(Q6, t, a + 2.0, .4, S0('r2') - .4); put(Q7, t, a + 1.4, .4, S0('r2') - .4); put(Q8, t, a + 1.6, .4, S0('r2') - .4); put(CR0, t, a + 2.2, .4, S0('r2') - .4); put(Q1b, t, S0('r1') + 5.6 > S0('r2') ? S0('r2') + 1.8 : S0('r1') + 5.6, .4, S0('r2') + 5); put(Q2, t, WS('r2', 'मन्नार', .3) + .5, .4); put(Q3, t, WS('r2', 'पाल्क', .6), .4); put(Q4, t, S0('j1') + .3, .4); put(CR, t, S0('r2') + 2.4, .4); }; })();
/* S6: measured vs not measured — a survey window lit inside the dim plate */
(function () { var A0 = fr([0, 0, 4], 96, 72, 90, 38, 761), a = SC[6];
  var T1 = tag('STUDY KYA NAAPTI HAI', K.AMB, A0, 540, 340, 74, 56, { fs: 30 }), M1 = tag('MEASURED\n▪ AAKAAR (SHAPE)\n▪ GEHRAI (DEPTH)\n▪ MATRA ~1 km³', K.AMB, A0, 330, 560, 74, 84, { fs: 24, kind: 'dyn' }), M2 = tag('NOT MEASURED\n▪ KISNE BANAYA?\n▪ KOI KAHANI?\n▪ ORIGIN: ?', K.FRONT, A0, 720, 700, 74, 84, { fs: 24, kind: 'dyn' });
  M1.userData.kind = 'dyn'; M2.userData.kind = 'dyn'; lock(6, 'locked', a, A0);
  SCN[6] = function (t) { setDefaults(); hideAll(); PU.uRel.value = 1; PU.uWin.value.set(-16, 1, 15, 14); PU.uWinK.value = sw(a + .4, a + 2, t); PU.uDim.value = 1; winL.visible = true; PT.uVis.value = 1; PT.uSize.value = 2.6; PT.uRGT.value = -1;
    put(T1, t, a + .5, .4); put(M1, t, S0('e1') + .8, .4); put(M2, t, WS('e1', 'किस', .45) - .4, .4); }; })();
/* S7: lift-out and end card */
(function () { var A0 = fr([0, 0, 3], 100, 70, 90, 38, 640), A1 = fr([0, 0, 2], 150, 78, 90, 38, 700), a = SC[7];
  var C1 = num('~29 km', K.AMB, A0, 300, 420, 92, 110, { fs: 96 }), C2 = tag('99.98 % SUBMERGED', K.FRONT, A0, 700, 540, 92, 52, { fs: 24 }), C3 = tag('LASER-MAPPED · 10 m (REPORTED)', K.GRN, A0, 540, 620, 92, 52, { fs: 22 });
  C1.userData.kind = 'dyn'; lock(7, 'locked', a, A0); sh(7, 'crane-up', a + 3.0, a + 9, A0, A1);
  SCN[7] = function (t) { setDefaults(); hideAll(); PU.uRel.value = 1; PU.uDim.value = 1 - .25 * sw(S0('cta') - 1, S0('cta') + 1, t); PT.uVis.value = 1; PT.uSize.value = 2.6; tube.visible = true; chainTube(1); winL.visible = false;
    put(C1, t, WS('f1', 'उन्स|उनतीस', .5), .4); put(C2, t, WS('f1', 'निन्यानवे', .75), .4); put(C3, t, WS('f1', 'लेज़र', .9), .4); }; })();
})();
/* Ram Setu v2 "Survey Window" — Part C: DOM instruments (eyebrow, readout line, captions), end card (nerdlogic.co), sound events, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, B = window.B;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var LIME = '#b4f000', FR = '#d4fff0', AM = '#ffb347';
var EYE = ['PALK STRAIT · FROM ORBIT', 'THE PALE LINE · WHAT A PHOTO SHOWS', 'ABOVE SEA LEVEL · 0.02 %', 'ICESat-2 · LASER RETURNS', 'TWO LENGTHS · ONE CHAIN', 'THE SHAPE UNDER THE WATER', 'MEASURED · NOT MEASURED', 'THE CHAIN · MAPPED BY LASER'];
var RD = ['NASA HLS · 15 MAR 2024 · VERTICAL x120', 'NASA HLS (SENTINEL-2) · 30 m · TRUE SCALE 1 UNIT = 1 km', 'VOLUME OF THE SHOAL CHAIN · SCHEMATIC', 'ATL03 PHOTONS · 4 TRACKS · REAL POSITIONS', 'RULERS DRAWN ON THE REAL IMAGE', 'RELIEF = ILLUSTRATIVE · PHOTONS = REAL', 'SURVEY WINDOW · THE REST IS UNMEASURED', 'REPORTED NUMBERS · SOURCES IN THE CAPTION'];
var hsc = D('', 'left:0;top:0;width:1080px;height:330px;background:linear-gradient(rgba(5,8,10,.92),rgba(5,8,10,.55) 65%,rgba(5,8,10,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div style="font:600 24px \'IBM Plex Mono\';letter-spacing:.12em;color:' + AM + ';display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:14px;height:14px;background:' + AM + ';border-radius:50%;box-shadow:0 0 12px ' + AM + '"></i><span id="ebt"></span></div><div id="rd" style="font:600 19px \'IBM Plex Mono\';letter-spacing:.06em;color:rgba(212,255,240,.78);margin-top:12px;white-space:nowrap"></div>'), ebt = hdr.querySelector('#ebt'), rd = hdr.querySelector('#rd');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(5,8,10,0),rgba(5,8,10,.93) 22%,rgba(5,8,10,.93) 80%,rgba(5,8,10,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:6px solid ' + LIME + ';box-shadow:0 0 0 6px #05080a,0 0 44px 6px rgba(180,240,0,.45);overflow:hidden;background:#0a0f1d', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:924px;font:800 62px/1 Inter;letter-spacing:-.02em;color:#eaffd0;white-space:nowrap;text-shadow:0 3px 14px rgba(0,0,0,.8)', 'nerdlogic<span style="color:' + LIME + '">.co</span>'), hs = D('', 'left:385px;top:1004px;color:' + FR + ';font:600 24px "IBM Plex Mono";letter-spacing:.14em', 'NERDS EXPLAIN · LOGIC EXPLAINS');
var btns = [['thumb-up', 'LIKE', FR, 190], ['share', 'SHARE', FR, 210], ['bell-ringing', 'SUBSCRIBE', LIME, 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:4px solid ' + c[2] + ';border-radius:12px;background:rgba(5,8,10,.94);display:flex;align-items:center;justify-content:center;gap:10px;font:600 26px "IBM Plex Mono";letter-spacing:.05em;color:' + c[2] + ';box-sizing:border-box', ico(c[0], 34, c[2], 1.9) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#d4fff0', chipInk: '#05080a', keywords: { 'percent': AM, 'laser': FR, 'kilometre': AM, 'nerdlogic': LIME } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { ev(WS('h1', 'निन्यानवे', .9), 'slam'); ev(.2, 'whoosh'); ev(S0('h2') + .3, 'pop'); ev(SC[1] + 1, 'pop'); ev(S0('p1') + 1.8, 'ping'); ev(WS('b1', 'शुन्य|दश्मलव', .55), 'slam'); ev(S0('b2') + .1, 'card'); ev(SC[3] + 1.2, 'whoosh'); for (var k = 0; k < 16; k++) ev(SC[3] + 1.6 + k * .45, 'tick'); ev(S0('m2') + .2, 'pop'); ev(SC[4] + 2, 'pop'); ev(S0('l2') + .2, 'card'); ev(S0('r1') + .5, 'pop'); ev(S0('r2'), 'ping'); ev(S0('e1') + .8, 'tick'); ev(S0('e1') + 1.5, 'tick'); ev(S0('f1') + 1, 'ping'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
EVL.sort(function (a, b) { return a.t - b.t; });
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 2;
  e.hideLabels(); SCN[sc](t); e.camAt(sc, t); e.applyCam(); var ec = last && t >= tCta - .1; SAFE.t = 290; e.clampLabels();
  var u = clamp((t - SC[sc]) / .5); ebt.textContent = EYE[sc]; rd.textContent = RD[sc]; hdr.style.opacity = ec ? 0 : (sc === 0 ? 1 : clamp(.4 + .6 * u)); hsc.style.opacity = ec ? 0 : 1;
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  flash.style.opacity = 0; capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.half = 0; e.POST.focus = cp.distanceTo(cl); e.POST.aper = .035; e.POST.maxR = 8; e.POST.bloom = .38; e.POST.vig = .4; e.POST.expo = 1.0; e.POST.grain = .012; e.POST.ca = .0006; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
function loadImg(src) { return new Promise(function (r) { var im = new Image(); im.onload = function () { r(im); }; im.onerror = function () { r(null); }; im.src = src; }); }
Promise.all([loadImg('img/hls.jpg'), loadImg('img/profile.jpg')]).then(function (a) { if (a[0]) B.buildPlate(a[0]); window.__ready = true; });
})();
