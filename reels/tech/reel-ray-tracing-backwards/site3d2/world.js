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
/* Ray tracing v2 "Light Scan" (hologram-hud grammar) — Part B0: timing helpers, wireframe-of-light builders, rolling values, target boxes, label helpers. Pure functions of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, R = e.R, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
R.localClippingEnabled = true;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2)]; return TM.words[k][1] + (TM.words[k][2] - TM.words[k][1]) * (f == null ? 0 : f); } } } window.__ws[id + '|' + subs] = 'MISS'; return s.t0 + (s.t1 - s.t0) * .5; }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
var K = { BG: 0x070812, HUE: 0x7c6cff, HUE2: 0xb9b2ff, ACC: 0xb4f000, WHT: 0xeef0ff, DIM: 0x4a4488, RED: 0xff5a7a };
var B = window.B = { K: K }; var W = new THREE.Group(); S.add(W); window.GR = [W]; B.W = W;
S.background = new THREE.Color(K.BG);
/* ---- line materials (additive light) ---- */
var SCAN = new THREE.Plane(new V3(0, -1, 0), 99); B.SCAN = SCAN;
B.lm = function (c, op, clip) { return new THREE.LineBasicMaterial({ color: new THREE.Color(c).multiplyScalar(1.5), transparent: true, opacity: op == null ? .8 : op, blending: THREE.AdditiveBlending, depthWrite: false, clippingPlanes: clip ? [SCAN] : null }); };
B.wire = function (geo, c, op, clip, thr) { var m = new THREE.LineSegments(new THREE.EdgesGeometry(geo, thr == null ? 20 : thr), B.lm(c, op, clip)); return m; };
B.floorLines = function (w, h, d, n, c, op, clip) { var p = []; for (var i = 1; i < n; i++) { var y = h * i / n; p.push(new V3(-w / 2, y, -d / 2), new V3(w / 2, y, -d / 2), new V3(w / 2, y, -d / 2), new V3(w / 2, y, d / 2), new V3(w / 2, y, d / 2), new V3(-w / 2, y, d / 2), new V3(-w / 2, y, d / 2), new V3(-w / 2, y, -d / 2)); } return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(p), B.lm(c, op, clip)); };
B.building = function (w, h, d, n, c, op, clip) { var g = new THREE.Group(), bx = B.wire(new THREE.BoxGeometry(w, h, d), c, (op || .9), clip); bx.position.y = h / 2; g.add(bx); g.add(B.floorLines(w, h, d, n, c, (op || .9) * .45, clip)); return g; };
B.ring = function (r, c, op, seg, dash) { var p = []; seg = seg || 96; for (var i = 0; i < seg; i++) { if (dash && i % 2) continue; var a = i / seg * 6.2832, b = (i + 1) / seg * 6.2832; p.push(new V3(Math.cos(a) * r, 0, Math.sin(a) * r), new V3(Math.cos(b) * r, 0, Math.sin(b) * r)); } return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(p), B.lm(c, op)); };
B.pad = function (r) { var g = new THREE.Group(); g.add(B.ring(r, K.HUE, .9)); g.add(B.ring(r * .84, K.HUE, .45, 120, true)); g.add(B.ring(r * .52, K.HUE, .35)); var t = []; for (var i = 0; i < 72; i++) { var a = i / 72 * 6.2832, L = i % 6 === 0 ? .55 : .25; t.push(new V3(Math.cos(a) * r, 0, Math.sin(a) * r), new V3(Math.cos(a) * (r - L), 0, Math.sin(a) * (r - L))); } g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(t), B.lm(K.HUE2, .7))); var rays = []; for (i = 0; i < 12; i++) { var a2 = i / 12 * 6.2832; rays.push(new V3(Math.cos(a2) * r * .52, 0, Math.sin(a2) * r * .52), new V3(Math.cos(a2) * r * .84, 0, Math.sin(a2) * r * .84)); } g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(rays), B.lm(K.HUE, .22))); return g; };
/* a fading dot grid under everything */
B.dots = function (R_) { var pts = [], st = 1.6, n = Math.floor(R_ / st); for (var i = -n; i <= n; i++) for (var j = -n; j <= n; j++) { var x = i * st, z = j * st; if (Math.hypot(x, z) < R_) pts.push(x, 0, z); } var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); return new THREE.Points(g, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uR: { value: R_ } }, vertexShader: 'varying float vA;uniform float uR;void main(){vA=1.-smoothstep(uR*.15,uR,length(position.xz));vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(120./-mv.z,1.,3.);}', fragmentShader: 'varying float vA;void main(){vec2 c=gl_PointCoord-.5;if(length(c)>.5)discard;gl_FragColor=vec4(.49,.42,1.,.28*vA);}' })); };
/* ---- pixel-placed labels and authored frames (same contract as the other 3D reels) ---- */
B.fr = function (c, d, pitch, yaw, fov, rowPx) { fov = fov || 38; rowPx = rowPx || 761; var c3 = new V3(c[0], c[1], c[2]), pr = pitch * Math.PI / 180, yw = (yaw || 0) * Math.PI / 180, dir = new V3(Math.sin(yw) * Math.cos(pr), Math.sin(pr), Math.cos(yw) * Math.cos(pr)), p = c3.clone().add(dir.clone().multiplyScalar(d)), fwd = c3.clone().sub(p).normalize(), right = new V3().crossVectors(fwd, new V3(0, 1, 0)).normalize(), up = new V3().crossVectors(right, fwd).normalize(), wpp = 2 * d * Math.tan(fov * Math.PI / 360) / e.H, l = c3.clone().sub(up.multiplyScalar((960 - rowPx) * wpp)); return [[p.x, p.y, p.z], [l.x, l.y, l.z], fov]; };
B.sh = function (sc, name, t0, t1, A, Bb, ease) { e.shot(sc, name, t0, t1, A[0], A[1], A[2], Bb[0], Bb[1], Bb[2], ease); };
B.lock = function (sc, name, t0, A) { e.shot(sc, name, t0, t0 + .01, A[0], A[1], A[2], A[0], A[1], A[2], 'io'); };
B.PL = function (o, A, px, py, dist, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / e.H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; o.position.copy(e.unp(A, px, py, dist)); ud.p0 = null; if (o.parent !== W) W.add(o); return o; };
B.PW = function (o, A, wp, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, cp = new V3(A[0][0], A[0][1], A[0][2]), dist = cp.distanceTo(wp), wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / e.H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; o.position.copy(wp); ud.p0 = null; if (o.parent !== W) W.add(o); return o; };
var LF = function (fs, w) { return (w || 500) + ' ' + fs + 'px "Rajdhani"'; };
B.LF = LF;
B.tag = function (text, col, A, px, py, dist, pxH, o) { o = o || {}; var l = e.lab(text, col, 1, Object.assign({ font: LF(o.fs || 32, 600), fs: o.fs || 32, bgc: 'rgba(8,9,22,.9)', tcol: o.tcol == null ? K.WHT : o.tcol, pad: 22 }, o)); return B.PL(l, A, px, py, dist, pxH); };
B.tagW = function (text, col, A, wp, pxH, o) { o = o || {}; var l = e.lab(text, col, 1, Object.assign({ font: LF(o.fs || 32, 600), fs: o.fs || 32, bgc: 'rgba(8,9,22,.9)', tcol: o.tcol == null ? K.WHT : o.tcol, pad: 22 }, o)); return B.PW(l, A, wp, pxH); };
/* ---- rolling value (glyphs scramble every frame at 24 fps, lock right to left, turn accent on the downbeat) ---- */
var GL = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ#%$&@';
B.roll = function (hh, w, h, label) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'dyn', sx: hh * w / h, sy: hh, sz: 1, txt: 'ROLL' }; e.LBL.push(s);
  s.draw = function (t, t0, dur, finalText, unit, hot) { var x = c.getContext('2d'), n = finalText.length, f = Math.floor(t * 24); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(8,9,22,.92)'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(124,108,255,.55)'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2); x.fillStyle = e.HEX(K.HUE2); [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]].forEach(function (q) { x.fillRect(q[0] - (q[2] < 0 ? 22 : 0), q[1] - (q[3] < 0 ? 3 : 0), 22, 3); x.fillRect(q[0] - (q[2] < 0 ? 3 : 0), q[1] - (q[3] < 0 ? 22 : 0), 3, 22); });
    x.font = '400 22px "Share Tech Mono"'; x.fillStyle = e.HEX(K.HUE2); x.textBaseline = 'top'; x.fillText(label, 24, 14); var fs = Math.min(h * .52, 150), done = true, lockedFrame = false; x.font = '300 ' + fs + 'px "Rajdhani"'; x.textBaseline = 'alphabetic'; var cw = x.measureText('0').width, X0 = 24, mono = /^[0-9. ,%]+$/.test(finalText);
    for (var i = 0; i < n; i++) { var tl = t0 + dur * (1 - i / n), ch = finalText[i], lk = t >= tl; if (!lk) { done = false; if (/[0-9]/.test(ch) || /[A-Za-z]/.test(ch)) ch = GL[(f * 7 + i * 13 + (hash(f * 31 + i) * 38 | 0)) % GL.length]; } else if (t - tl < 1 / 12) lockedFrame = true; var accent = t >= t0 + dur; x.fillStyle = e.HEX(accent && hot ? K.ACC : K.WHT); if (ch === '.') { x.fillRect(X0 + 4, h * .78 - 12, 12, 12); X0 += 20; continue; } x.fillText(ch, X0, h * .78); X0 += mono ? cw : x.measureText(ch).width + 2; }
    x.font = '400 26px "Share Tech Mono"'; x.fillStyle = e.HEX(K.HUE2); x.fillText(unit || '', X0 + 14, h * .78); if (lockedFrame || (done && t - (t0 + dur) < 1 / 12)) { x.fillStyle = 'rgba(255,255,255,.28)'; x.fillRect(0, 0, w, h); } tx.needsUpdate = true; }; return s; };
/* ---- target box: oversized, rotated 45 deg, snaps to fit in 0.2 s, flashes on the downbeat ---- */
B.box = function (size) { var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d'); x.strokeStyle = '#eef0ff'; x.lineWidth = 7; x.lineCap = 'square'; [[16, 16, 1, 1], [240, 16, -1, 1], [16, 240, 1, -1], [240, 240, -1, -1]].forEach(function (q) { x.beginPath(); x.moveTo(q[0], q[1] + q[3] * 52); x.lineTo(q[0], q[1]); x.lineTo(q[0] + q[2] * 52, q[1]); x.stroke(); }); var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending })); s.renderOrder = 29; s.layers.set(1); s.userData = { size: size }; s.lock = function (t, t0) { var u = clamp((t - t0) / .2); s.visible = t >= t0 - .001; var k = 1 + (1 - eo3(u)) * 1.2; s.scale.set(size * k, size * k, 1); s.material.rotation = (1 - eo3(u)) * .785; s.material.opacity = u < 1 ? .35 + u * .65 : (t - t0 < .26 ? 1 : .85); s.material.color.setRGB(1, 1, 1); if (t - t0 > .2 && t - t0 < .26) s.material.color.setRGB(2, 2, 2); }; return s; };
})();
/* Ray tracing v2 "Light Scan" — mockup scenes: A puddle street scanned in (hook), B one primary ray + bounce, C BVH teardown. Pure functions of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3, put = e.put, B = window.B, K = B.K, W = B.W, fr = B.fr, sh = B.sh, lock = B.lock, tag = B.tag, tagW = B.tagW, S0 = window.S0, WS = window.WS, SCAN = B.SCAN;
var SC = window.SC = [0, S0('p1'), S0('r1'), S0('b1'), S0('v1'), S0('y1')]; window.SCN = [];
var DL = new THREE.DirectionalLight(0xffffff, 1); S.add(DL);
function sw(a, b, t) { return sstep((t - a) / Math.max(.001, b - a)); }
function grp() { var g = new THREE.Group(); g.visible = false; W.add(g); return g; }
function setLine(m, a, b) { m.geometry.setFromPoints([a, b]); m.visible = true; }
function L(a, b, c, op) { var m = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), B.lm(c, op == null ? .95 : op)); m.frustumCulled = false; return m; }
/* ================= scene A: the puddle street, scanned into light ================= */
var gA = grp(), tower = null, mirrored = null;
(function () { gA.add(B.pad(15)); gA.add(B.dots(34));
  var H = [7, 10, 6, 12, 8, 9, 7, 11]; for (var i = 0; i < 8; i++) { var side = i % 2 ? 1 : -1, z = 5 - Math.floor(i / 2) * 5.2, b = B.building(3, H[i], 3.4, Math.round(H[i] * .9), K.HUE, .9, true); b.position.set(side * 4.6, 0, z); gA.add(b); }
  var cl = [new V3(-2.7, 0, 8), new V3(-2.7, 0, -26), new V3(2.7, 0, 8), new V3(2.7, 0, -26)]; gA.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(cl), B.lm(K.HUE2, .6, true)));
  tower = B.building(4.2, 17, 4.2, 15, K.WHT, 1, true); tower.position.set(0, 0, -20); gA.add(tower);
  mirrored = B.building(4.2, 17, 4.2, 15, K.HUE2, .5, false); mirrored.scale.y = -1; mirrored.position.set(0, 0, -20); gA.add(mirrored);
  for (i = 1; i <= 3; i++) { var r = B.ring(i * .85, K.HUE2, .8 - i * .15, 64); r.scale.z = .55; r.position.set(0, .02, 2.2); gA.add(r); }
  var sr = B.ring(15, K.WHT, .95, 128); sr.name = 'scanring'; gA.add(sr); gA.userData.sr = sr; })();
(function () { var A0 = fr([0, 6, -8], 58, 20, 0, 38, 761), A1 = fr([0, 9, -12], 50, 9, 0, 38, 761), t1 = S0('h1') + 4.2;
  var H1 = B.tag('PUDDLE', K.HUE, A0, 540, 400, 52, 150, { font: B.LF(150, 300), fs: 150, tcol: K.WHT, pad: 26 }), H2 = tag('SCREEN PAR NAHI · PHIR BHI DIKH RAHI', K.ACC, A0, 540, 540, 52, 52, { fs: 30 }), T1 = B.tagW('NOT ON SCREEN · 17 m TOWER', K.ACC, A1, new V3(0, 19.5, -20), 48, { fs: 26 }), T2 = B.tagW('REFLECTION IN THE PUDDLE', K.HUE2, A1, new V3(0, -4.5, -20), 46, { fs: 26 });
  H1.userData.kind = 'dyn'; lock(0, 'locked 3/4', 0, A0); sh(0, 'crane-down', t1, t1 + 4, A0, A1);
  SCN[0] = SCN[1] = function (t) { gA.visible = true; var h = lerp(-1, 22, eo3(clamp(t / 5.4))); SCAN.constant = h; gA.userData.sr.position.y = clamp(h, 0, 20); gA.userData.sr.visible = h < 20; gA.userData.sr.material.opacity = .95 * (1 - clamp((h - 17) / 3));
    put(H1, t, -.1, .3, t1 + 2); put(H2, t, -.1, .3, t1 + 2); put(T1, t, t1 + 1.6, .4); put(T2, t, t1 + 2.2, .4); }; })();
/* ================= scene B: ONE ray from the eye ================= */
var gB = grp(), EY = new V3(0, 2.4, 11), SPH = new V3(0, 1.9, -1), SR = 1.9, PXC = [11, 3], SCR = { w: 6.4, h: 3.6, z: 7.4, cx: 16, cy: 9 }, hit, nrm, rdir, endp, pr, rr;
(function () { gB.add(B.pad(15)); gB.add(B.dots(34));
  var ey = new THREE.Group(), cone = B.wire(new THREE.ConeGeometry(.75, 1.7, 14), K.WHT, 1, false, 1); cone.rotation.x = -Math.PI / 2; ey.add(cone); var lens = B.ring(.5, K.HUE2, .9, 24); lens.rotation.x = Math.PI / 2; lens.position.z = -.9; ey.add(lens); ey.position.copy(EY); gB.add(ey);
  var gp = []; for (var i = 0; i <= SCR.cx; i++) { var x = (i / SCR.cx - .5) * SCR.w; gp.push(new V3(x, EY.y - SCR.h / 2, SCR.z), new V3(x, EY.y + SCR.h / 2, SCR.z)); } for (var j = 0; j <= SCR.cy; j++) { var y = EY.y + (j / SCR.cy - .5) * SCR.h; gp.push(new V3(-SCR.w / 2, y, SCR.z), new V3(SCR.w / 2, y, SCR.z)); } gB.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gp), B.lm(K.HUE, .38)));
  var cs = [new V3(-SCR.w / 2, EY.y - SCR.h / 2, SCR.z), new V3(SCR.w / 2, EY.y - SCR.h / 2, SCR.z), new V3(SCR.w / 2, EY.y + SCR.h / 2, SCR.z), new V3(-SCR.w / 2, EY.y + SCR.h / 2, SCR.z)]; cs.forEach(function (c) { gB.add(L(EY, c, K.HUE, .2)); });
  var sp = B.wire(new THREE.SphereGeometry(SR, 28, 18), K.HUE2, .75, false, 1); sp.position.copy(SPH); gB.add(sp);
  var bd = B.building(4, 7, 3, 7, K.WHT, .9, false); bd.position.set(1.5, 0, -14); gB.add(bd);
  var pxx = (PXC[0] + .5) / SCR.cx - .5, pyy = (PXC[1] + .5) / SCR.cy - .5, P = new V3(pxx * SCR.w, EY.y - pyy * SCR.h * -1 * -1 + 0, SCR.z); P.y = EY.y + (.5 - (PXC[1] + .5) / SCR.cy) * SCR.h; var d = P.clone().sub(EY).normalize(), oc = EY.clone().sub(SPH), bq = oc.dot(d), cq = oc.dot(oc) - SR * SR, disc = bq * bq - cq, tt = -bq - Math.sqrt(Math.max(0, disc)); hit = EY.clone().add(d.clone().multiplyScalar(tt)); nrm = hit.clone().sub(SPH).normalize(); rdir = d.clone().sub(nrm.clone().multiplyScalar(2 * d.dot(nrm))).normalize(); var t2 = (-12.5 - hit.z) / rdir.z; endp = hit.clone().add(rdir.clone().multiplyScalar(t2)); gB.userData.P = P;
  var pq = [new V3(P.x - .5 * SCR.w / SCR.cx, P.y - .5 * SCR.h / SCR.cy, SCR.z), new V3(P.x + .5 * SCR.w / SCR.cx, P.y - .5 * SCR.h / SCR.cy, SCR.z), new V3(P.x + .5 * SCR.w / SCR.cx, P.y + .5 * SCR.h / SCR.cy, SCR.z), new V3(P.x - .5 * SCR.w / SCR.cx, P.y + .5 * SCR.h / SCR.cy, SCR.z), new V3(P.x - .5 * SCR.w / SCR.cx, P.y - .5 * SCR.h / SCR.cy, SCR.z)]; var pxl = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pq), B.lm(K.ACC, 1)); gB.add(pxl); gB.userData.pxl = pxl;
  pr = L(EY, hit, K.WHT, 1); rr = L(hit, endp, K.ACC, 1); gB.add(pr); gB.add(rr); var nl = L(hit, hit.clone().add(nrm.clone().multiplyScalar(1.6)), K.HUE2, .9); gB.add(nl); gB.userData.nl = nl;
  var hr = B.ring(.35, K.ACC, 1, 24); hr.position.copy(hit); hr.lookAt(hit.clone().add(nrm)); hr.rotation.x += 0; gB.add(hr); gB.userData.hr = hr; var er = B.ring(.5, K.ACC, 1, 32); er.position.copy(endp); er.rotation.set(0, 0, 0); er.rotation.x = Math.PI / 2; gB.add(er); gB.userData.er = er; })();
(function () { var a = SC[2], A0 = fr([0, 2.6, 2], 30, 24, 168, 38, 761), A1 = fr([0, 3, -4], 30, 16, 168, 38, 761), tL = a + 2.6, hitP = hit;
  var box = B.box(2.6); box.visible = false; W.add(box); var rl = B.roll(1, 760, 190, 'RAY 01 / PIXEL (11,3)'); rl.scale.set(190 / 1 * 760 / 190 * 0.0, 0, 1); rl.userData.sx = 3; rl.userData.sy = .75;
  var R1 = B.PL(rl, A0, 540, 400, 24, 150), T1 = tag('PRIMARY RAY', K.WHT, A0, 540, 540, 24, 52, { fs: 30 }), T2 = B.tagW('NORMAL', K.HUE2, A0, hit.clone().add(nrm.clone().multiplyScalar(1.9)), 44, { fs: 24 }), T3 = B.tagW('REFLECTED RAY', K.ACC, A1, endp.clone().add(new V3(0, 1.6, 0)), 46, { fs: 24 }), T4 = B.tagW('BUILDING · NOT ON SCREEN', K.WHT, A1, new V3(1.5, 8.2, -14), 46, { fs: 24 });
  lock(2, 'locked oblique', a, A0); sh(2, 'push + yaw', a + 6, a + 10, A0, A1);
  SCN[2] = function (t) { gB.visible = true; var u1 = clamp((t - a - 1.0) / 1.6), u2 = clamp((t - a - 4.6) / 1.4); gB.userData.pxl.visible = t > a + .5; setLine(pr, EY, EY.clone().lerp(hit, eo3(u1))); pr.visible = u1 > 0; setLine(rr, hit, hit.clone().lerp(endp, eo3(u2))); rr.visible = u2 > 0; gB.userData.nl.visible = u1 >= 1; gB.userData.hr.visible = u1 >= 1; gB.userData.er.visible = u2 >= 1;
    box.visible = false; if (u1 >= 1) { box.position.copy(hit); box.lock(t, a + 2.6); } rl.draw(t, a + 2.6, .7, 'PRIMARY RAY', '', true);
    put(R1, t, a + .2, .3); put(T1, t, a + 1.2, .3); put(T2, t, a + 3.7, .3); put(T3, t, a + 6.3, .3); put(T4, t, a + 6.7, .3); }; })();
/* ================= scene C: the BVH, one level deeper at a time ================= */
var gC = grp(), BV = [];
(function () { gC.add(B.pad(13)); gC.add(B.dots(30)); var geo = new THREE.TorusKnotGeometry(2.2, .7, 220, 16); var kn = B.wire(geo, K.HUE2, .5, false, 12); kn.position.y = 3.6; gC.add(kn); gC.userData.kn = kn;
  var pos = geo.attributes.position, idx = geo.index.array, tris = []; for (var i = 0; i < idx.length; i += 3) { var a = idx[i], b = idx[i + 1], c = idx[i + 2], p0 = new V3().fromBufferAttribute(pos, a), p1 = new V3().fromBufferAttribute(pos, b), p2 = new V3().fromBufferAttribute(pos, c); tris.push({ c: p0.clone().add(p1).add(p2).multiplyScalar(1 / 3), min: p0.clone().min(p1).min(p2), max: p0.clone().max(p1).max(p2) }); }
  function build(list, depth, path) { var mn = new V3(1e9, 1e9, 1e9), mx = new V3(-1e9, -1e9, -1e9); list.forEach(function (t) { mn.min(t.min); mx.max(t.max); }); var node = { depth: depth, mn: mn, mx: mx, path: path, n: list.length }; (BV[depth] = BV[depth] || []).push(node); if (depth >= 5 || list.length < 40) return node; var ext = mx.clone().sub(mn), ax = ext.x > ext.y && ext.x > ext.z ? 'x' : ext.y > ext.z ? 'y' : 'z'; list.sort(function (p, q) { return p.c[ax] - q.c[ax]; }); var m = list.length >> 1; node.l = build(list.slice(0, m), depth + 1, path + '0'); node.r = build(list.slice(m), depth + 1, path + '1'); return node; }
  var root = build(tris, 0, ''); gC.userData.root = root; gC.userData.lv = []; for (var d = 0; d < Math.min(BV.length, 5); d++) { var seg = []; BV[d].forEach(function (nd) { var a = nd.mn, b = nd.mx, v = [[a.x, a.y, a.z], [b.x, a.y, a.z], [b.x, b.y, a.z], [a.x, b.y, a.z], [a.x, a.y, b.z], [b.x, a.y, b.z], [b.x, b.y, b.z], [a.x, b.y, b.z]].map(function (q) { return new V3(q[0], q[1] + 3.6, q[2]); }); [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (q) { seg.push(v[q[0]], v[q[1]]); }); }); var col = d === 0 ? K.WHT : K.HUE2, ls = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), B.lm(d === 0 ? K.WHT : K.HUE, .75 - d * .06)); gC.add(ls); gC.userData.lv.push(ls); }
  var pth = [], nd = root; while (nd) { pth.push(nd); nd = nd.l && nd.l.mn.x < 0.5 ? nd.l : nd.r || nd.l; } var seg2 = []; pth.forEach(function (nd) { var a = nd.mn, b = nd.mx, v = [[a.x, a.y, a.z], [b.x, a.y, a.z], [b.x, b.y, a.z], [a.x, b.y, a.z], [a.x, a.y, b.z], [b.x, a.y, b.z], [b.x, b.y, b.z], [a.x, b.y, b.z]].map(function (q) { return new V3(q[0], q[1] + 3.6, q[2]); }); [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (q) { seg2.push(v[q[0]], v[q[1]]); }); }); var hot = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg2), B.lm(K.ACC, 1)); gC.add(hot); gC.userData.hot = hot; })();
(function () { var a = SC[4], A0 = fr([0, 3.6, 0], 22, 32, 20, 38, 761), A1 = fr([0, 3.6, 0], 20, 20, 120, 38, 761);
  var rl = B.roll(1, 760, 190, 'BOXES CHECKED / RAY (100 M TRIANGLES)'); rl.userData.sx = 3; rl.userData.sy = .75; var R1 = B.PL(rl, A0, 540, 400, 17, 150), T1 = tag('BVH · BOX INSIDE BOX', K.WHT, A0, 540, 540, 17, 52, { fs: 30 }), T2 = tag('IDEAL BALANCED TREE · log2(100 M) ≈ 27', K.HUE2, A0, 540, 1100, 17, 48, { fs: 24 });
  lock(4, 'orbit', a, A0); sh(4, 'orbit', a + 1, a + 14, A0, A1);
  SCN[4] = function (t) { gC.visible = true; gC.userData.lv.forEach(function (ls, d) { ls.visible = t > a + 1.0 + d * .9; }); gC.userData.hot.visible = t > a + 7; rl.draw(t, a + 7, .8, '27', 'CHECKS', true); put(R1, t, a + .2, .3); put(T1, t, a + 1.0, .3); put(T2, t, a + 5, .3); }; })();
})();
(function () {
var e = E, S = e.S, clamp = e.clamp, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, B = window.B;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap');
function D(css, html) { var d = document.createElement('div'); d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
var hsc = D('left:0;top:0;width:1080px;height:300px;background:linear-gradient(rgba(7,8,18,.92),rgba(7,8,18,.5) 65%,rgba(7,8,18,0))'); hsc.setAttribute('data-ov', '1');
var hdr = D('left:150px;top:150px;width:768px', '<div style="font:400 24px \'Share Tech Mono\';letter-spacing:.14em;color:#b9b2ff;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:14px;height:14px;background:#b4f000;box-shadow:0 0 12px #b4f000"></i><span id="ebt"></span></div><div id="rd" style="font:400 19px \'Share Tech Mono\';letter-spacing:.08em;color:rgba(185,178,255,.7);margin-top:10px"></div>'), ebt = hdr.querySelector('#ebt'), rd = hdr.querySelector('#rd');
var EYE = ['SCENE SCAN · PUDDLE STREET', 'SCENE SCAN · PUDDLE STREET', 'RAY 01 · FROM THE EYE', 'RAY 01 · THE BOUNCE', 'BVH · BOX INSIDE BOX', 'BVH'], RD = ['WIREFRAME OF LIGHT · SCHEMATIC SCENE', '', 'ONE RAY PER PIXEL · SCHEMATIC', '', 'LEVELS BUILT ON A TORUS KNOT · IDEAL TREE', ''];
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
window.__reelDurationSec = END; window.EV = []; window.__B = SC; window.__ready = false;
var CAPOPT = { fs: 50, width: 768, lines: 2, chip: '#eef0ff', chipInk: '#070812', keywords: { 'ray': '#b4f000', 'kiran': '#b4f000' } };
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t); GR.forEach(function (g) { g.children.forEach(function (c) { if (c.isGroup) c.visible = false; }); }); e.hideLabels(); (SCN[sc] || SCN[0])(t); e.camAt(sc === 1 ? 0 : sc, t); e.applyCam(); SAFE.t = 290; e.clampLabels();
  ebt.textContent = EYE[sc]; rd.textContent = RD[sc]; capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.half = 0; e.POST.focus = cp.distanceTo(cl); e.POST.aper = .03; e.POST.maxR = 8; e.POST.bloom = .55; e.POST.vig = .45; e.POST.expo = 1.0; e.POST.grain = .012; e.POST.ca = .0007; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render(); };
Promise.all(['300 40px Rajdhani', '600 30px Rajdhani', '400 30px "Share Tech Mono"', '600 30px Inter', '800 30px Inter'].map(function (f) { return document.fonts.load(f); })).then(function () { window.__ready = true; });
})();
