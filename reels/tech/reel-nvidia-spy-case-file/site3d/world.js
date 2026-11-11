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
/* Part B0 (Nvidia case file): timing helpers + dossier builders (folders, sheets, rubber stamps, plates, pins). Everything is a pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return TM.words[k][1]; } } } window.__ws[id + '|' + subs] = ['MISS', +SP(id, f == null ? .5 : f).toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return SP(id, f == null ? .5 : f); }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
var INK = 0x13172a, MANILA = 0xead9b4, PAPER = 0xf3ead2, COBALT = 0x2c4bd8, MARI = 0xffb300, TOMATO = 0xe1362f, GREEN = 0x1d9a69, VIOLET = 0x7b4bd0, GREY = 0x8a7a62;
var K = { INK: INK, MANILA: MANILA, PAPER: PAPER, COBALT: COBALT, MARI: MARI, TOMATO: TOMATO, GREEN: GREEN, VIOLET: VIOLET, GREY: GREY, HEX: e.HEX };
var B = window.B = { K: K };
/* live counter sprite (paper card, coloured edge) */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'dyn', sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s);
  s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(243,234,210,.98)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 12, h); x.strokeStyle = 'rgba(19,23,42,.5)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function tcv(w, h, fn) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); fn(x, w, h); return c; }
function plane(w, h, canvas, tr) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(canvas), transparent: !!tr, toneMapped: true })); }
function M(c, o) { return e.physMat(c, Object.assign({ roughness: .85, metalness: 0, envMapIntensity: .55 }, o || {})); }
function box(w, h, d, col, o) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(col, o)); }
B.tcv = tcv; B.plane = plane; B.M = M; B.box = box;
/* wrap text for canvas */
function wrap(x, txt, maxW) { var words = txt.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines; }
B.wrap = wrap;
/* paper mottling for the desk */
B.deskTex = function () { var c = tcv(1024, 1024, function (x, W, H) { x.fillStyle = '#ead9b4'; x.fillRect(0, 0, W, H); for (var i = 0; i < 2600; i++) { var g = hash(i * 3), a = hash(i * 7 + 1) * .1; x.fillStyle = 'rgba(' + (g > .5 ? '120,90,40' : '255,248,220') + ',' + a + ')'; var r = 3 + hash(i * 5 + 2) * 40; x.beginPath(); x.arc(hash(i * 11) * W, hash(i * 13 + 4) * H, r, 0, 6.283); x.fill(); } for (var j = 0; j < 7000; j++) { x.fillStyle = 'rgba(90,60,20,' + hash(j * 17) * .12 + ')'; x.fillRect(hash(j * 19) * W, hash(j * 23 + 3) * H, 1.5, 1.5); } });
  var t = e.canvasTex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 4); return t; };
/* a sheet of paper lying flat (+Y up), drawn from a canvas; w,h in world units, ppu pixels per unit */
B.sheet = function (w, h, draw, o) { o = o || {}; var ppu = o.ppu || 110, g = new THREE.Group(), cw = Math.round(w * ppu), ch = Math.round(h * ppu);
  var c = tcv(cw, ch, function (x) { x.fillStyle = o.bg || '#f3ead2'; x.fillRect(0, 0, cw, ch); for (var i = 0; i < 500; i++) { x.fillStyle = 'rgba(120,90,40,' + hash(i * 3) * .06 + ')'; x.fillRect(hash(i * 5) * cw, hash(i * 7 + 2) * ch, 2, 2); } draw(x, cw, ch); });
  var pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(c) })); pl.rotation.x = -Math.PI / 2; pl.position.y = .04; g.add(pl);
  var sh = new THREE.Mesh(new THREE.PlaneGeometry(w + .35, h + .35), new THREE.MeshBasicMaterial({ color: 0x3a2a10, transparent: true, opacity: .28 })); sh.rotation.x = -Math.PI / 2; sh.position.set(.12, .015, .14); g.add(sh);
  g.userData.canvas = c; g.userData.tex = pl.material.map; g.userData.paint = function (fn) { var x = c.getContext('2d'); x.fillStyle = o.bg || '#f3ead2'; x.fillRect(0, 0, cw, ch); fn(x, cw, ch); pl.material.map.needsUpdate = true; }; return g; };
/* manila folder lying on the desk (cover faces up), label plate on the cover */
B.folder = function (label, sub, o) { o = o || {}; var w = o.w || 6, h = o.h || 8.2, g = new THREE.Group();
  var back = box(w, .12, h, 0xd6bf86); back.position.y = .06; g.add(back); var tab = box(w * .34, .12, .7, 0xd6bf86); tab.position.set(-w * .26, .06, -h / 2 - .34); g.add(tab);
  var cov = box(w * .98, .1, h * .96, 0xe3cd96); cov.position.set(0, .17, .05); g.add(cov);
  var cv = tcv(512, Math.round(512 * h / w), function (x, W, H) { x.fillStyle = 'rgba(0,0,0,0)'; x.fillRect(0, 0, W, H); x.fillStyle = '#f3ead2'; x.fillRect(W * .08, H * .08, W * .84, H * .2); x.strokeStyle = '#13172a'; x.lineWidth = 5; x.strokeRect(W * .08, H * .08, W * .84, H * .2);
    x.fillStyle = '#13172a'; x.textBaseline = 'middle'; var fs = o.fs || 62; x.font = '700 ' + fs + 'px "JetBrains Mono"'; while (x.measureText(label).width > W * .78 && fs > 20) { fs -= 3; x.font = '700 ' + fs + 'px "JetBrains Mono"'; } x.fillText(label, W * .12, H * .15);
    if (sub) { x.font = '700 30px "JetBrains Mono"'; x.fillStyle = '#2c4bd8'; x.fillText(sub, W * .12, H * .245); }
    x.strokeStyle = 'rgba(19,23,42,.5)'; x.lineWidth = 4; x.setLineDash([14, 10]); x.strokeRect(W * .12, H * .36, W * .76, H * .5); x.setLineDash([]); if (o.slot) { x.fillStyle = 'rgba(19,23,42,.55)'; x.font = '700 ' + Math.round(W * .13) + 'px "Alfa Slab One"'; x.textAlign = 'center'; x.fillText(o.slot, W * .5, H * .6); x.font = '700 24px "JetBrains Mono"'; x.fillText('EVIDENCE', W * .5, H * .78); } });
  var lb = plane(w * .98, h * .96, cv, true); lb.rotation.x = -Math.PI / 2; lb.position.set(0, .225, .05); g.add(lb); g.userData.w = w; g.userData.h = h; return g; };
/* status stamp impression: double rounded rectangle + heavy text, rough edge, slightly tilted */
B.impress = function (txt, col, w, o) { o = o || {}; var h = w * (o.asp || .36), cw = 900, ch = Math.round(cw * (o.asp || .36));
  var c = tcv(cw, ch, function (x, W, H) { x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 18; x.strokeRect(14, 14, W - 28, H - 28); x.lineWidth = 6; x.strokeRect(46, 46, W - 92, H - 92);
    x.textAlign = 'center'; x.textBaseline = 'middle'; var fs = o.fs || 150; x.font = '400 ' + fs + 'px "Alfa Slab One"'; while (x.measureText(txt).width > W - 130 && fs > 30) { fs -= 4; x.font = '400 ' + fs + 'px "Alfa Slab One"'; } x.fillText(txt, W / 2, H / 2 + 6);
    x.globalCompositeOperation = 'destination-out'; for (var i = 0; i < 1900; i++) { x.fillStyle = 'rgba(0,0,0,' + (.25 + hash(i * 3) * .6) + ')'; var r = 1 + hash(i * 7 + 1) * 5; x.beginPath(); x.arc(hash(i * 11) * W, hash(i * 13 + 5) * H, r, 0, 6.283); x.fill(); } });
  var m = plane(w, h, c, true); m.material.opacity = .94; m.userData.base = w; return m; };
/* rubber stamp tool (handle + block) that the slam animation moves; visual only */
B.stampTool = function (col) { var g = new THREE.Group(), blk = box(3.2, .7, 1.4, 0x1a1a22, { roughness: .5 }); blk.position.y = .35; g.add(blk); var rub = box(3.0, .18, 1.25, col == null ? TOMATO : col, { roughness: .9 }); rub.position.y = .0; g.add(rub); var hd = new THREE.Mesh(new THREE.CylinderGeometry(.45, .6, 1.8, 18), M(0x6b3a1c, { roughness: .45 })); hd.position.y = 1.5; g.add(hd); var kn = new THREE.Mesh(new THREE.SphereGeometry(.62, 18, 14), M(0x6b3a1c, { roughness: .45 })); kn.position.y = 2.5; g.add(kn); return g; };
/* slam: stamp tool drops (u in 0..1 over `dur`), impression pops on contact; returns contact flag. t absolute, t0 contact time */
B.slam = function (tool, imp, t, t0, sx, sz, rot, o) { o = o || {}; var dt = t - (t0 - .22), vis = dt > 0; if (tool) tool.visible = vis && t < t0 + .5; imp.visible = t >= t0;
  if (tool && tool.visible) { var u = clamp(dt / .22), y = lerp(5, 0.2, u * u); var up = clamp((t - t0 - .05) / .35); y += eo3(up) * 4; tool.position.set(sx, y, sz); tool.rotation.y = rot || 0; }
  if (imp.visible) { var k = clamp((t - t0) / .09), s = lerp(2.6, 1, k * k); var bn = t > t0 + .09 ? 1 + .05 * Math.exp(-(t - t0 - .09) * 14) * Math.cos((t - t0) * 40) : s; imp.scale.set(bn, bn, 1); imp.position.set(sx, o.y == null ? .27 : o.y, sz); imp.rotation.set(-Math.PI / 2, 0, (rot || 0) + (o.tilt || 0)); imp.material.opacity = .94 * clamp((t - t0) / .05); } return t >= t0; };
/* paperclip, pencil, coffee ring: clutter */
B.pencil = function () { var g = new THREE.Group(); var b = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, 5.2, 6), M(MARI, { roughness: .5 })); b.rotation.z = Math.PI / 2; g.add(b); var tip = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 6), M(0xe3c9a0)); tip.rotation.z = -Math.PI / 2; tip.position.x = 2.85; g.add(tip); var er = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .35, 6), M(0xd45a6a)); er.rotation.z = Math.PI / 2; er.position.x = -2.75; g.add(er); g.position.y = .2; return g; };
B.clip = function () { var m = new THREE.Mesh(new THREE.TorusGeometry(.35, .045, 8, 20), M(0xb8bcc8, { metalness: .8, roughness: .3 })); m.rotation.x = Math.PI / 2; m.scale.set(1, 1.8, 1); m.position.y = .22; return m; };
B.ring = function (r) { var m = new THREE.Mesh(new THREE.RingGeometry(r * .88, r, 40), new THREE.MeshBasicMaterial({ color: 0x6b4a22, transparent: true, opacity: .22, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.position.y = .03; return m; };
/* name plate (brass-like block with engraved text) */
B.plate = function (txt, sub) { var g = new THREE.Group(), b = box(4.6, .55, 1.5, 0x3a3346, { roughness: .45, metalness: .3 }); b.position.y = .28; g.add(b); var f = plane(4.3, 1.2, tcv(520, 150, function (x, W, H) { x.fillStyle = '#c7a24a'; x.fillRect(0, 0, W, H); x.fillStyle = '#2a2110'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.font = '700 70px "JetBrains Mono"'; x.fillText(txt, W / 2, H * .38); x.font = '700 28px "JetBrains Mono"'; x.fillText(sub, W / 2, H * .78); })); f.rotation.x = -Math.PI / 2; f.position.y = .565; g.add(f); return g; };
})();
/* Part B1 (Nvidia case file): ONE continuous 3D desk; the camera travels along it from exhibit to exhibit. Halftone print look comes from the post pass. Pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, ei3 = e.ei3, eob = e.eob, put = e.put, B = window.B, K = B.K, M = B.M, box = B.box, S0 = window.S0, S1 = window.S1, SP = window.SP, WS = window.WS, HEX = e.HEX;
var SC = window.SC = [0, S0('c1'), S0('n1'), S0('e1'), S0('s1'), S0('u1'), S0('r1')];
window.GR = []; window.SCN = []; window.SHAKES = [];
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
window.sw = sw;
var W = new THREE.Group(); S.add(W); GR.push(W);
function add(o, x, y, z) { o.position.set(x, y, z); W.add(o); return o; }
var CS = { green: '#1d9a69', violet: '#7b4bd0', red: '#e1362f', grey: '#8a7a62', ink: '#13172a', cobalt: '#2c4bd8', mari: '#ffb300' };
/* lights + ground */
var DL = new THREE.DirectionalLight(0xfff0d0, 2.4); DL.position.set(-12, 24, 14); S.add(DL); S.add(new THREE.AmbientLight(0xffe8c0, .55));
var desk = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), new THREE.MeshStandardMaterial({ map: B.deskTex(), roughness: .95, metalness: 0, envMapIntensity: .3 })); desk.rotation.x = -Math.PI / 2; W.add(desk);
/* stamps: every stamp = tool + impression, contact time, position */
var STAMPS = [];
function stamp(txt, col, w, x, z, rot, tc, o) { var imp = B.impress(txt, col, w, o), tool = B.stampTool(new THREE.Color(col).getHex()); W.add(imp); W.add(tool); imp.visible = false; tool.visible = false; var s = { imp: imp, tool: tool, x: x, z: z, rot: rot, tc: tc, y: o && o.y }; STAMPS.push(s); return s; }
/* ---------- SCENE 1: the case folder (x = 0) ---------- */
var F0 = B.folder('FILE NVDA-1108', 'CASE NO. 14', { w: 6.2, h: 8.4 }); add(F0, 0, 0, 0); F0.rotation.y = .03;
for (var q = 0; q < 3; q++) { var fq = B.folder(['FILE 1107', 'FILE 1106', 'FILE 1105'][q], '', { w: 6, h: 8, fs: 50 }); add(fq, -9.4 - q * .5, q * .22, -1 + q * .5); fq.rotation.y = .12 - q * .09; }
add(B.pencil(), 5.6, 0, -4.5).rotation.y = .5; add(B.clip(), 4.2, 0, 3.6); add(B.clip(), -4.6, 0, 5.4).rotation.y = 1; add(B.ring(1.1), 6.5, 0, 3.5); add(B.ring(.9), -6.6, 0, -6);
var tH1 = S0('h1'), tH2 = S0('h2');
var tS1 = [WS('h1', 'चिठ्ठी|चिठ', .2), WS('h1', 'जांच|जाँच', .55), WS('h1', 'बयान', .88), WS('h2', 'सबूत', .15)];
var st1 = [stamp('CONFIRMED', CS.green, 4.8, 0, -.5, -.12, tS1[0]), stamp('ALLEGED', CS.violet, 4.0, .2, 1.2, .10, tS1[1]), stamp('DENIED', CS.red, 3.6, -.3, 2.8, -.07, tS1[2]), stamp('UNPROVEN', CS.grey, 4.8, 0, 4.0, .05, tS1[3], { fs: 130 })];
/* ---------- SCENE 2: the letter (x = 17) ---------- */
var LX = 17, tC1 = S0('c1'), tC2 = S0('c2');
var QT = 'I was unfaithful to my wife. My actions hurt her and our children.';
var LET = B.sheet(7.4, 9.6, function () { }, { ppu: 100 }); add(LET, LX, 0, 0); LET.rotation.y = -.03; LET.scale.setScalar(.84);
function paintLetter(frac) { LET.userData.paint(function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 26px "JetBrains Mono"'; x.fillText('NVIDIA · OPEN LETTER · 8 NOV 2026', 50, 70); x.fillStyle = '#2c4bd8'; x.fillText('AS REPORTED (AP, THE NEURON)', 50, 108); x.fillStyle = 'rgba(19,23,42,.55)'; x.fillRect(50, 130, W_ - 100, 4);
  x.fillStyle = '#13172a'; x.font = '400 56px "Alfa Slab One"'; var lines = B.wrap(x, QT, W_ - 110), n = Math.floor(QT.length * frac), used = 0; lines.forEach(function (l, i) { var seg = l.slice(0, Math.max(0, Math.min(l.length, n - used))); used += l.length + 1; x.fillText(seg, 50, 250 + i * 76); });
  if (frac >= 1) { x.fillStyle = 'rgba(255,179,0,.5)'; x.fillRect(46, 400, 560, 14); } x.fillStyle = '#13172a'; x.font = '700 28px "JetBrains Mono"'; x.fillText('"I support the investigation and will', 50, 700); x.fillText(' cooperate fully."', 50, 738); x.fillStyle = 'rgba(19,23,42,.6)'; x.fillText('— HUANG, SAME LETTER', 50, 800); }); }
paintLetter(0); var lastFrac = -1;
var NOTE = B.sheet(4.6, 3.4, function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 24px "JetBrains Mono"'; x.fillText('NVIDIA BOARD · 8 NOV', 24, 44); x.font = '800 30px Inter'; x.fillText('Independent directors', 24, 100); x.fillText('+ outside lawyers', 24, 142); x.fillStyle = '#2c4bd8'; x.font = '700 24px "JetBrains Mono"'; x.fillText('INVESTIGATION OPENED', 24, 196); }, { ppu: 100, bg: '#fbe7a0' }); add(NOTE, LX + 3.4, .06, 6.1); NOTE.rotation.y = .1; NOTE.scale.setScalar(.8);
var st2 = [stamp('CONFIRMED', CS.green, 4.2, LX + .5, .9, -.1, WS('c2', 'कंफरमड|कंफर', .5)), stamp('REPORTEDLY', CS.violet, 4.4, LX + .2, 3.6, .1, WS('c2', 'रिपोटेडली|रिपोट', .95), { fs: 120 })];
/* ---------- SCENE 3: allegation (x = 34) ---------- */
var AX = 34, tN1 = S0('n1');
var PA = B.plate('A.H.', 'FORMER MEGASPEED EXEC'); add(PA, AX, 0, -6.4); var PJ = B.plate('J.H.', 'NVIDIA CEO'); add(PJ, AX, 0, -1.9);
var TAGP = B.sheet(3.4, 1.3, function (x, W_, H_) { x.fillStyle = '#13172a'; x.textAlign = 'center'; x.font = '700 38px "JetBrains Mono"'; x.fillText('NOT RELATED', W_ / 2, 70); x.font = '700 22px "JetBrains Mono"'; x.fillText('same surname only', W_ / 2, 108); }, { ppu: 100, bg: '#ffd966' }); add(TAGP, AX, .6, -4.15); TAGP.rotation.y = .05;
var MF = B.folder('MEGASPEED', 'SINGAPORE · CHIP BUYER', { w: 4.6, h: 6.2, fs: 44 }); add(MF, AX - 1.2, 0, 3.6); MF.rotation.y = -.08;
/* export gate + crates */
var GATE = new THREE.Group(); W.add(GATE); GATE.position.set(AX + .2, 0, 10.2); var pl1 = box(.5, 3.4, .5, 0x2c3a60), pl2 = box(.5, 3.4, .5, 0x2c3a60), bm = box(5.6, .5, .6, 0x2c3a60); pl1.position.set(-2.4, 1.7, 0); pl2.position.set(2.4, 1.7, 0); bm.position.set(0, 3.6, 0); GATE.add(pl1, pl2, bm);
var gsign = B.plane(5.2, .9, B.tcv(780, 135, function (x, W_, H_) { x.fillStyle = '#ffb300'; x.fillRect(0, 0, W_, H_); x.fillStyle = '#13172a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 40px "JetBrains Mono"'; x.fillText('EXPORT LIMITS · ILLUSTRATIVE', W_ / 2, H_ / 2); })); gsign.position.set(0, 3.6, .32); GATE.add(gsign);
var belt = box(9, .25, 1.8, 0x3b3f55); belt.position.set(0, .13, 0); GATE.add(belt); var CR = []; for (var c = 0; c < 6; c++) { var cr = box(1.0, .9, .9, 0xc89a55); GATE.add(cr); CR.push(cr); }
var st3 = [stamp('ALLEGED', CS.violet, 4.0, AX, -9.3, -.08, WS('n1', 'चीन|इंटेलिजेंस', .75)), stamp('MEMO NOT PUBLISHED', CS.grey, 4.4, AX - 1.1, 4.4, .06, WS('n2', 'पब्लिक', .3), { fs: 72, asp: .26 })];
/* ---------- SCENE 4: the evidence board (x = 56) ---------- */
var BX = 56, BZ = -10, tE1 = S0('e1');
var cork = new THREE.Mesh(new THREE.PlaneGeometry(13.5, 18), new THREE.MeshBasicMaterial({ map: e.canvasTex(B.tcv(1024, 512, function (x, W_, H_) { x.fillStyle = '#b98a52'; x.fillRect(0, 0, W_, H_); for (var i = 0; i < 4200; i++) { x.fillStyle = 'rgba(' + (hash(i) > .5 ? '90,56,24' : '230,190,130') + ',' + hash(i * 3) * .35 + ')'; x.beginPath(); x.arc(hash(i * 5) * W_, hash(i * 7 + 1) * H_, 1 + hash(i * 11) * 3, 0, 6.283); x.fill(); } x.strokeStyle = '#5b3a1b'; x.lineWidth = 22; x.strokeRect(0, 0, W_, H_); })) })); cork.position.set(BX, 7.6, BZ); W.add(cork);
var CARDS = [['NVIDIA BOARD', '"No reason to believe', 'secrets were compromised"', CS.green, 'STATEMENT'], ['CHINA FOREIGN MINISTRY', '"Unsubstantiated.', 'Nothing but smears"', CS.red, 'DENIED'], ['SINGAPORE MHA · 31 OCT', '"Never investigated her', 'over intelligence ties"', CS.violet, 'STATEMENT'], ['US INTELLIGENCE MEMO', 'Reported by NYT.', 'Not public.', CS.grey, 'UNPROVEN']];
var CP = CARDS.map(function (cd, i) { var g = new THREE.Group(), pl = B.plane(4.0, 5.7, B.tcv(560, 800, function (x, W_, H_) { x.fillStyle = '#f3ead2'; x.fillRect(0, 0, W_, H_); x.fillStyle = cd[3]; x.fillRect(0, 0, W_, 92); x.fillStyle = '#f3ead2'; x.font = '700 29px "JetBrains Mono"'; x.fillText(cd[0], 22, 56); x.fillStyle = '#13172a'; x.font = '800 36px Inter'; x.fillText(cd[1], 24, 190); x.fillText(cd[2], 24, 240); x.strokeStyle = 'rgba(19,23,42,.6)'; x.lineWidth = 5; x.setLineDash([16, 12]); x.strokeRect(24, 330, W_ - 48, 370); x.setLineDash([]); x.fillStyle = 'rgba(19,23,42,.45)'; x.font = '700 24px "JetBrains Mono"'; x.fillText('EVIDENCE ATTACHED:', 40, 372); x.fillStyle = 'rgba(19,23,42,.55)'; x.font = '400 190px "Alfa Slab One"'; x.textAlign = 'center'; x.fillText('?', W_ / 2, 590); x.font = '700 28px "JetBrains Mono"'; x.fillText('NONE PUBLISHED', W_ / 2, 665); })); g.add(pl); var pin = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 10), M(0xd0342c, { roughness: .35 })); pin.position.set(0, 2.6, .2); g.add(pin); g.position.set(BX + (i % 2 ? 2.25 : -2.25), 9.8 - (i > 1 ? 5.3 : 0), BZ + .15); g.rotation.z = [.03, -.04, .05, -.02][i]; g.userData.y0 = g.position.y; W.add(g); return g; });
var STR = []; for (var si = 0; si < 3; si++) { var ln = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 1, 6), new THREE.MeshBasicMaterial({ color: 0xc02a24 })); W.add(ln); STR.push(ln); }
function seg(m, a, b) { var d = b.clone().sub(a), L = d.length(); m.position.copy(a.clone().add(b).multiplyScalar(.5)); m.scale.set(1, L, 1); m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize()); }
var tCard = [S0('e1') + .6, WS('e1', 'चीन', .5) - .2, WS('e1', 'सिंगापुर', .5) - .2, S0('e2') + .3];
/* ---------- SCENE 5: the chart (x = 80) ---------- */
var CX = 80, tSt1 = S0('s1');
var chartBoard = B.plane(9.6, 10.6, B.tcv(720, 795, function (x, W_, H_) { x.fillStyle = '#f3ead2'; x.fillRect(0, 0, W_, H_); x.strokeStyle = '#13172a'; x.lineWidth = 10; x.strokeRect(5, 5, W_ - 10, H_ - 10); x.fillStyle = '#13172a'; x.font = '700 30px "JetBrains Mono"'; x.fillText('NVDA · PRE-MARKET', 36, 66); x.fillText('MON 9 NOV (AP)', 36, 106); x.fillStyle = '#2c4bd8'; x.font = '700 24px "JetBrains Mono"'; x.fillText('ABOUT -5%, AS REPORTED', 36, 146); x.fillText('BARS ILLUSTRATIVE', 36, 180); x.fillStyle = 'rgba(19,23,42,.25)'; x.fillRect(36, 735, W_ - 72, 5); })); add(chartBoard, CX, 6.0, BZ + .2);
var BARS = []; for (var bi = 0; bi < 6; bi++) { var bh = [4.6, 4.8, 4.7, 4.9, 4.8, 4.6][bi], bar = box(1.1, 1, .5, bi === 5 ? 0xe1362f : 0x2c4bd8, { roughness: .9 }); bar.userData.h = bh; W.add(bar); BARS.push(bar); }
var crate = box(3.2, 2.4, 3.0, 0xc89a55); add(crate, CX + 2.6, 1.2, 2.2); var crl = B.plane(2.8, 1.0, B.tcv(420, 150, function (x, W_, H_) { x.fillStyle = '#13172a'; x.fillRect(0, 0, W_, H_); x.fillStyle = '#ffb300'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '700 44px "JetBrains Mono"'; x.fillText('AI CHIPS', W_ / 2, H_ * .35); x.font = '700 22px "JetBrains Mono"'; x.fillText('ILLUSTRATIVE', W_ / 2, H_ * .75); })); crl.position.set(CX + 2.6, 1.4, 3.72); W.add(crl);
/* ---------- SCENE 6: what we don't know (x = 100) ---------- */
var UX = 100, tU1 = S0('u1'), tU2 = S0('u2');
var LST = ['NO CHARGE', 'NO PUBLIC FINDING SHE WORKED FOR CHINA', 'NO PUBLIC EVIDENCE HE SHARED A SECRET'];
var UL = B.sheet(7.6, 9.4, function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 28px "JetBrains Mono"'; x.fillText('WHAT IS NOT KNOWN · 9 NOV', 44, 66); x.fillStyle = 'rgba(19,23,42,.55)'; x.fillRect(44, 90, W_ - 88, 4); }, { ppu: 100 }); add(UL, UX, 0, 0); UL.scale.setScalar(.8);
function paintList(n) { UL.userData.paint(function (x, W_, H_) { x.fillStyle = '#13172a'; x.font = '700 28px "JetBrains Mono"'; x.fillText('WHAT IS NOT KNOWN · 9 NOV', 44, 66); x.fillStyle = 'rgba(19,23,42,.55)'; x.fillRect(44, 90, W_ - 88, 4);
  for (var i = 0; i < 3; i++) { var by = 170 + i * 190; x.fillStyle = '#13172a'; x.font = '800 44px Inter'; var ls = B.wrap(x, LST[i], W_ - 150); ls.forEach(function (l, k) { x.fillText(l, 100, by + k * 52); }); x.strokeStyle = '#13172a'; x.lineWidth = 5; x.strokeRect(44, by - 38, 36, 36); var f = clamp(n - i); if (f > 0) { x.strokeStyle = '#e1362f'; x.lineWidth = 9; x.beginPath(); x.moveTo(44, by - 20); x.lineTo(44 + (W_ - 88) * f, by - 20 + (hash(i) - .5) * 10); x.stroke(); x.beginPath(); x.moveTo(50, by - 34); x.lineTo(76, by - 6); x.moveTo(76, by - 34); x.lineTo(50, by - 6); x.stroke(); } } }); }
var st6 = [stamp('UNPROVEN', CS.grey, 4.8, UX, 2.6, -.06, WS('u2', 'पता|नहीं', .9, true), { fs: 140 })];
/* ---------- SCENE 7: closing desk (x = 120) ---------- */
var EX = 120, tR1 = S0('r1'), tCta = S0('cta');
add(B.folder('FILE NVDA-1108', 'CASE NO. 14', { w: 6.2, h: 8.4 }), EX, 0, -1);
var st7 = [stamp('CASE OPEN', CS.red, 4.8, EX, .2, -.1, tCta + .1, { fs: 120 })];
window.STAMPT = STAMPS.map(function (s) { return s.tc; }); window.HOLEAT = [st1[3].tc, st6[0].tc, st7[0].tc];
/* per-frame world state */
SCN[0] = SCN[1] = SCN[2] = SCN[3] = SCN[4] = SCN[5] = SCN[6] = function (t) {
  W.visible = true; S.background = new THREE.Color(0xcdb98c); S.fog = null; e.POST.half = window.__noHalf ? 0 : 1;
  STAMPS.forEach(function (s) { B.slam(s.tool, s.imp, t, s.tc, s.x, s.z, s.rot, { y: s.y }); });
  window.SHAKES = STAMPS.map(function (s) { return { t: s.tc, a: s.imp.userData.base > 5 ? .5 : .35 }; });
  /* letter typing */
  var fr = clamp((t - (tC1 + .5)) / 2.6); fr = Math.round(fr * QT.length) / QT.length; if (fr !== lastFrac) { paintLetter(fr); lastFrac = fr; }
  /* scene 3: crates flow through the gate, 2 stop before the beam */
  CR.forEach(function (cr, i) { var u = ((t * .5 + i / CR.length) % 1), x = lerp(-4.2, 4.2, u); cr.position.set(x, .8, 0); cr.visible = t > tN1 - 1; });
  /* scene 4: cards drop in, strings link them to the first card */
  CP.forEach(function (g, i) { var u = clamp((t - tCard[i]) / .45), k = eob(u); g.visible = u > 0; g.scale.setScalar(Math.max(.001, k) * .9); g.position.y = g.userData.y0 + (1 - eo3(u)) * 6; });
  var c0 = CP[0].position.clone(); c0.z += .5; for (var q2 = 0; q2 < 3; q2++) { var a = CP[q2].position.clone(), b2 = CP[q2 + 1].position.clone(); a.z += .5; a.y += 2.6; b2.z += .5; b2.y += 2.6; STR[q2].visible = CP[q2 + 1].visible; seg(STR[q2], a, b2); }
  /* scene 5: bars grow, last one drops ~5 % */
  var d5 = sw(S0('s2') + .2, S0('s2') + 1.4, t); BARS.forEach(function (b, i) { var u = clamp((t - (tSt1 + .3 + i * .18)) / .5), h = b.userData.h * eo3(u) * (i === 5 ? 1 - .05 * eo3(d5) * 6 : 1); h = Math.max(.001, h); b.scale.y = h; b.position.set(CX - 3.35 + i * 1.34, .85 + h / 2, BZ + .55); b.visible = u > 0; });
  /* scene 6 list */
  paintList(clamp((t - (tU1 + 1.2)) / 8) * 3);
};
/* ---------- authored camera ---------- */
function shot(name, t0, t1, p0, l0, f0, p1, l1, f1, ez) { e.shot(0, name, t0, t1, p0, l0, f0, p1, l1, f1, ez || 'io'); }
var h2 = S0('h2'), c1 = S0('c1'), c2 = S0('c2'), n1 = S0('n1'), n3 = S0('n3'), e1 = S0('e1'), e2 = S0('e2'), s1 = S0('s1'), s2 = S0('s2'), u1 = S0('u1'), u2 = S0('u2'), r1 = S0('r1'), cta = S0('cta');
function over(x, z, d, up) { return { p: [x, d * .78, z + d * .62], l: [x, 0, z + d * (up == null ? .07 : up)] }; }
function sh2(name, t0, t1, A, B2, f0, f1, ez) { shot(name, t0, t1, A.p, A.l, f0 || 38, B2.p, B2.l, f1 || f0 || 38, ez); }
var O1 = over(0, 0, 25), O1b = over(0, 2.4, 20), OL = over(LX, 0, 25), OLb = over(LX + .3, .6, 21), OA = over(AX, -5, 25), OB = over(AX, 5, 30, .12), OBo = over(BX, 7, 1), OC = over(CX, 0, 27), OU = over(UX, 0, 26), OUb = over(UX, .6, 22), OE = over(EX, -1, 26, .24), OEb = over(EX, -1, 30, .28);
var BD = function (z) { return { p: [BX, 7.4, BZ + 33], l: [BX, 6.2, BZ] }; };
sh2('locked wide on the case folder', 0, h2 - .2, O1, O1);
sh2('slow push to the last stamp', h2 - .2, c1 - .15, O1, O1b);
sh2('pan across the desk to the letter', c1 - .15, c1 + 2.2, O1b, OL);
sh2('slow push on the quote', c1 + 2.2, c2 + 2.8, OL, OLb);
sh2('hold on the letter', c2 + 2.8, n1 - .1, OLb, OLb);
sh2('pan to the name plates', n1 - .1, n1 + 2.4, OLb, OA);
sh2('hold on plates and tag', n1 + 2.4, WS('n4', 'सपीट|मेगा', .1) - .3, OA, OA);
sh2('track to the folder and gate', WS('n4', 'सपीट|मेगा', .1) - .3, e1 - .1, OA, OB);
shot('crane to the evidence board', e1 - .1, e1 + 1.8, OB.p, OB.l, 38, [BX, 7.4, BZ + 33], [BX, 6.2, BZ], 38, 'io');
shot('slow push on the board', e1 + 1.8, s1 - .1, [BX, 7.4, BZ + 33], [BX, 6.2, BZ], 38, [BX, 7.2, BZ + 30], [BX, 6.0, BZ], 36, 'io');
shot('pan to the chart', s1 - .1, s1 + 2.0, [BX, 7.2, BZ + 30], [BX, 6.0, BZ], 36, [CX, 6.4, BZ + 31], [CX, 4.7, BZ], 38, 'io');
shot('hold on the chart', s1 + 2.0, u1 - .1, [CX, 6.4, BZ + 31], [CX, 4.7, BZ], 38, [CX, 6.4, BZ + 31], [CX, 4.7, BZ], 38, 'io');
sh2('pan to the list', u1 - .1, u1 + 2.0, { p: [CX, 6.4, BZ + 31], l: [CX, 4.7, BZ] }, OU);
sh2('slow push on the list', u1 + 2.0, r1 - .1, OU, OUb);
sh2('pan back to the closing desk', r1 - .1, r1 + 2.2, OUb, OE);
sh2('pull back, locked for the end card', r1 + 2.2, cta + 3.0, OE, OEb, 40, 40, 'o');
})();
/* Part C (Nvidia case file): DOM header, captions, end card, sound events, stamp shake/flash, __seek */
(function () {
var e = E, S = e.S, clamp = e.clamp, eo3 = e.eo3, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, S0 = window.S0, WS = window.WS, SP = window.SP, S1 = window.S1;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap'), flash = document.getElementById('flash');
function D(cls, css, html) { var d = document.createElement('div'); d.className = cls; d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
function ico(name, size, color, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round">' + IC[name] + '</svg>'; }
var EYE = ['FILE NVDA-1108 · FOUR STATUS STAMPS', 'EXHIBIT 1 · THE LETTER', 'EXHIBIT 2 · THE ALLEGATION', 'EXHIBIT 3 · EVERYONE\'S EVIDENCE', 'EXHIBIT 4 · WHY THE MARKET FLINCHED', 'EXHIBIT 5 · WHAT IS NOT KNOWN', 'CASE STATUS · OPEN'];
var HL = ['Sabke paas <b>bayaan</b>, saboot nahi', 'Jo <b>pakka</b> hai', 'Ab shuru hota hai <b>reportedly</b>', 'Chaar bayaan, saboot <b>khaali</b>', 'Share lagbhag <b>5%</b> gira', 'Abhi tak <b>pata nahi</b>', 'Pehle dekho <b>kisne kaha</b>'];
var TAGS = ['AS REPORTED · SOURCES IN THE CAPTION', 'AP / THE NEURON · 8 NOV 2026 · AS REPORTED', 'NYT VIA AP · MEMO NOT PUBLISHED · DENIED BY CHINA', 'AP · THE NEURON · AS REPORTED', 'AP · PRE-MARKET, MON 9 NOV · APPROX.', 'THE NEURON · NO CHARGE · NO PUBLIC FINDING', 'CASE REMAINS OPEN'];
var hsc = D('', 'left:0;top:0;width:1080px;height:420px;background:linear-gradient(rgba(234,217,180,.94),rgba(234,217,180,.8) 60%,rgba(234,217,180,0))', ''); hsc.setAttribute('data-ov', '1');
var hdr = D('', 'left:150px;top:150px;width:768px', '<div id="eb" style="font:700 23px \'JetBrains Mono\';letter-spacing:.12em;color:#2c4bd8;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#e1362f"></i><span id="ebt"></span></div><div id="hl" style="font:400 56px/1.05 \'Alfa Slab One\';letter-spacing:-.02em;margin-top:14px;color:#13172a;text-shadow:5px 5px 0 rgba(44,75,216,.55)"></div>'),
  ebt = hdr.querySelector('#ebt'), hl = hdr.querySelector('#hl'), tag = D('', 'left:150px;top:1296px;width:768px;font:700 20px "JetBrains Mono";letter-spacing:.05em;color:rgba(19,23,42,.8);white-space:nowrap', '');
var tCta = S0('cta');
var scrim = D('', 'left:0;top:850px;width:1080px;height:470px;background:linear-gradient(rgba(234,217,180,0),rgba(234,217,180,.95) 22%,rgba(234,217,180,.95) 80%,rgba(234,217,180,0))', ''), pf = D('', 'left:150px;top:900px;width:210px;height:210px;border-radius:50%;border:8px solid #13172a;box-shadow:0 0 0 6px #ffb300,8px 10px 0 rgba(44,75,216,.6);overflow:hidden', '<img src="img/profile.jpg" style="width:100%;height:100%;object-fit:cover">'),
  hn = D('', 'left:385px;top:920px;font:800 50px/1 Inter;letter-spacing:-.01em;color:#13172a;white-space:nowrap', '@sandeshexplains'), hs = D('', 'left:385px;top:988px;color:#2c4bd8;font:700 26px "JetBrains Mono";letter-spacing:.12em', 'SANDESH EXPLAINS');
var btns = [['thumb-up', 'LIKE', '#1d9a69', 190], ['share', 'SHARE', '#7b4bd0', 210], ['bell-ringing', 'SUBSCRIBE', '#e1362f', 290]].map(function (c, k) { var l = 158 + [0, 210, 440][k]; return D('', 'left:' + l + 'px;top:1160px;width:' + c[3] + 'px;height:84px;border:5px solid ' + c[2] + ';border-radius:10px;background:#f3ead2;display:flex;align-items:center;justify-content:center;gap:10px;font:700 25px "JetBrains Mono";letter-spacing:.05em;color:' + c[2] + ';box-sizing:border-box;box-shadow:5px 5px 0 rgba(19,23,42,.35)', ico(c[0], 34, c[2], 2) + c[1]); });
var CAPOPT = { fs: 54, width: 768, lines: 2, chip: '#ffb300', chipInk: '#13172a', keywords: { 'confirmed': '#1d9a69', 'reportedly': '#7b4bd0', 'DENIED': '#e1362f', 'saboot': '#ffb300', 'memo': '#ffb300', 'China': '#e1362f' } };
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length; i++) if (t >= SC[i]) k = i; return k; }
var DIPS = [];
var EVL = []; function ev(t, k) { EVL.push({ t: +t.toFixed(3), k: k }); }
(function () { (window.STAMPT || []).forEach(function (tc, i) { ev(tc, 'stamp'); }); var hs_ = window.HOLEAT || []; hs_.forEach(function (tc) { ev(tc, 'hole'); }); ev(S0('h1') + .02, 'pop');
  ev(S0('c1'), 'whoosh'); for (var k = 0; k < 9; k++) ev(S0('c1') + .6 + k * .28, 'tick'); ev(S0('n1'), 'whoosh'); ev(S0('e1') - .1, 'whoosh'); ev(S0('e1') + .6, 'pop'); ev(WS('e1', 'चीन', .5) - .2, 'pop'); ev(WS('e1', 'सिंगापुर', .5) - .2, 'pop'); ev(S0('e2') + .3, 'pop'); ev(S0('s1') - .1, 'whoosh'); for (var b = 0; b < 6; b++) ev(S0('s1') + .3 + b * .18, 'tick'); ev(S0('s2') + .3, 'slam');
  ev(S0('u1') - .1, 'whoosh'); ev(S0('u1') + 1.2, 'tick'); ev(S0('u1') + 4.2, 'tick'); ev(S0('u1') + 7.2, 'tick'); ev(S0('r1') - .1, 'whoosh'); ev(S0('cta'), 'whoosh'); ev(WS('cta', 'लाइक', .45), 'ping'); ev(WS('cta', 'शेयर|शेर', .6), 'ping'); ev(WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75), 'ping'); })();
var AP = [.09, .08, .08, .08, .09, .09, .08], FOC = {};
window.__reelDurationSec = END; window.EV = EVL; window.__B = SC; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t), last = sc === SC.length - 1;
  GR.forEach(function (g) { g.visible = false; }); e.hideLabels();
  S.fog = null; SCN[sc](t); if (window.__camO) e.setCam(window.__camO.p, window.__camO.l, window.__camO.f); else { e.camAt(0, t); var sx = 0, sy = 0, fl = 0; (window.SHAKES || []).forEach(function (s) { var d = t - s.t; if (d >= 0 && d < .7) { var a = s.a * Math.exp(-d * 9); sx += a * Math.sin(d * 90); sy += a * Math.cos(d * 77 + 1); fl = Math.max(fl, .35 * Math.exp(-d * 16) * (s.a > .4 ? 1 : .6)); } }); e.camP.x += sx; e.camP.y += sy; e.camL.x += sx; e.camL.y += sy; window.__fl = fl; }
  e.applyCam(); var ec = last && t >= tCta - .1, hv = (t - SC[sc]) < 4.2 && !ec; SAFE.t = hv ? 400 : 232; e.clampLabels();
  var u = sc === 0 ? 1 : clamp((t - SC[sc]) / .5), uo = 1 - clamp((t - (SC[sc] + 3.6)) / .5); ebt.textContent = EYE[sc]; hl.innerHTML = HL[sc]; hl.querySelectorAll('b').forEach(function (b) { b.style.cssText = 'font-weight:400;background:#ffb300;color:#13172a;padding:0 10px;text-shadow:none;box-shadow:4px 4px 0 rgba(44,75,216,.55)'; });
  hdr.style.opacity = ec ? 0 : (sc === 0 ? uo : Math.min(u + .2, uo)); hl.style.opacity = clamp(Math.min(u, uo)); hdr.querySelector('#eb').style.opacity = clamp(.35 + .65 * u);
  tag.textContent = TAGS[sc]; tag.style.opacity = clamp((t - SC[sc]) / .5) * (ec ? 0 : 1);
  var ue = function (x) { return clamp((t - x) / .35); };
  scrim.setAttribute('data-ov', '1'); scrim.style.display = ec ? 'block' : 'none'; scrim.style.opacity = ec ? ue(tCta) : 0;
  [pf, hn, hs].forEach(function (x, i) { var uu = ec ? ue(tCta + .1 + i * .25) : 0; x.style.display = uu > 0 ? 'block' : 'none'; x.style.opacity = uu; x.style.transform = 'translateY(' + ((1 - eo3(uu)) * 24) + 'px)'; });
  var bt = [WS('cta', 'लाइक', .45), WS('cta', 'शेयर|शेर', .6), WS('cta', 'सब्स्क्राइब|सब्सक्राइब', .75)]; btns.forEach(function (b, i) { var uu = ec ? ue(bt[i] - .1) : 0; b.style.display = uu > 0 ? 'flex' : 'none'; b.style.opacity = uu; var pulse = uu >= 1 ? 1 + .04 * Math.max(0, Math.sin((t - bt[i]) * 5)) * Math.exp(-(t - bt[i]) * .3) : .85 + .15 * eo3(uu); b.style.transform = 'scale(' + pulse.toFixed(3) + ')'; });
  flash.style.background = '#fffaf0'; flash.style.opacity = window.__fl || 0;
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.focus = FOC[sc] || cp.distanceTo(cl); e.POST.aper = AP[sc]; e.POST.maxR = 14; e.POST.bloom = .12; e.POST.vig = .3; e.POST.expo = 1.05; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render();
};
window.__lbAll = 0;
var imgp = new Image(); imgp.onload = imgp.onerror = function () { window.__ready = true; }; imgp.src = 'img/profile.jpg';
})();
