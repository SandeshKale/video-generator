/* "VFX ka bill" — engine: timing, renderer + bloom/grade post, analytic scan materials, labels. Everything is a pure function of t. */
(function () {
var W = 1080, H = 1920, V3 = THREE.Vector3, TM = window.TM, V = window.V = { W: W, H: H, V3: V3 };
function clamp(x, a, b) { return Math.max(a == null ? 0 : a, Math.min(b == null ? 1 : b, x)); }
function lerp(a, b, e) { return a + (b - a) * e; }
function eio(x) { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function eo3(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
function ramp(t, a, b) { return clamp((t - a) / (b - a)); }
function eob(x) { x = clamp(x); var c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
function hash(i) { var h = (i * 2654435761) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; return (h >>> 0) / 4294967296; }
V.clamp = clamp; V.lerp = lerp; V.eio = eio; V.eo3 = eo3; V.ramp = ramp; V.eob = eob; V.hash = hash;
V.ICE = new THREE.Color(0xa9d8f0); V.EMB = new THREE.Color(0xffb25b); V.VIO = new THREE.Color(0x9d86ff); V.MINT = new THREE.Color(0x6fe3b0); V.ROSE = new THREE.Color(0xff6b88);

/* ---- timing from the voice ---- */
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
V.ST = function (id) { return SEN[id].t0; }; V.SE = function (id) { return SEN[id].t1; };
window.__cue = [];
V.CW = function (id, w, nth) { var n = nth || 0; for (var i = 0; i < TM.cap.length; i++) if (TM.cap[i].s === id && TM.cap[i].w.toLowerCase().replace(/[^a-z0-9₹.]/g, '').indexOf(w) === 0) { if (n-- === 0) return TM.cap[i].t0; } window.__cue.push(id + ':' + w); return SEN[id].t0 + .3; };
V.DUR = TM.end; window.__reelDurationSec = V.DUR; window.EV = [];
V.ev = function (t, k) { window.EV.push({ t: t, k: k }); };

/* ---- renderer + post ---- */
var R = V.R = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: false, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false); R.outputColorSpace = THREE.LinearSRGBColorSpace; R.toneMapping = THREE.NoToneMapping; R.autoClear = false;
var HF = THREE.HalfFloatType;
function mrt(w, h, s) { return new THREE.WebGLRenderTarget(w, h, { type: HF, samples: s || 0 }); }
var RT0 = V.RT0 = mrt(W, H, 4), B0 = mrt(W / 4, H / 4), B1 = mrt(W / 4, H / 4), B2 = mrt(W / 8, H / 8), B3 = mrt(W / 8, H / 8);
var FS = new THREE.Scene(), FC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), FQ = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); FS.add(FQ);
var VS = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
function sm(frag, u) { return new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: frag, depthTest: false, depthWrite: false }); }
function pass(m, tgt) { FQ.material = m; R.setRenderTarget(tgt); R.setScissorTest(false); R.render(FS, FC); }
var mBright = sm('uniform sampler2D tC;varying vec2 vUv;void main(){vec3 c=texture2D(tC,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(.35,1.1,l),1.);}', { tC: { value: RT0.texture } });
var mBlur = sm('uniform sampler2D tC;uniform vec2 dir;varying vec2 vUv;void main(){vec3 a=texture2D(tC,vUv).rgb*.2270270;a+=(texture2D(tC,vUv+dir*1.3846).rgb+texture2D(tC,vUv-dir*1.3846).rgb)*.3162162;a+=(texture2D(tC,vUv+dir*3.2308).rgb+texture2D(tC,vUv-dir*3.2308).rgb)*.0702703;gl_FragColor=vec4(a,1.);}', { tC: { value: null }, dir: { value: new THREE.Vector2() } });
var mFin = V.mFin = sm('uniform sampler2D tC,tB1,tB2;uniform float bloom,vig,ca,fade;varying vec2 vUv;' +
  'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}' +
  'void main(){vec2 o=(vUv-.5)*ca;vec3 c=vec3(texture2D(tC,vUv+o).r,texture2D(tC,vUv).g,texture2D(tC,vUv-o).b)+(texture2D(tB1,vUv).rgb*.8+texture2D(tB2,vUv).rgb*1.1)*bloom;c*=fade;c=c/(1.+c*.55)*1.45;c=pow(max(c,0.),vec3(1./2.2));' +
  'vec2 q=vUv-.5;c*=1.-vig*dot(q,q)*1.6;c+=(h(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(c,1.);}',
  { tC: { value: RT0.texture }, tB1: { value: B0.texture }, tB2: { value: B2.texture }, bloom: { value: .85 }, vig: { value: .8 }, ca: { value: .002 }, fade: { value: 1 } });
function blurTo(src, tmp, dst, w, h) { mBlur.uniforms.tC.value = src.texture; mBlur.uniforms.dir.value.set(1 / w, 0); pass(mBlur, tmp); mBlur.uniforms.tC.value = tmp.texture; mBlur.uniforms.dir.value.set(0, 1 / h); pass(mBlur, dst); }
V.post = function () { pass(mBright, B0); blurTo(B0, B1, B0, W / 4, H / 4); mBlur.uniforms.tC.value = B0.texture; mBlur.uniforms.dir.value.set(1 / (W / 8), 0); pass(mBlur, B2); blurTo(B2, B3, B2, W / 8, H / 8); R.setRenderTarget(null); R.setScissorTest(false); FQ.material = mFin; R.render(FS, FC); };
/* draw a scene into RT0, optionally only inside a pixel box (x0,y0,x1,y1) ; first = clear everything */
V.draw = function (sc, cam, box, clearAll) {
  R.setRenderTarget(RT0);
  if (box) { R.setScissorTest(true); R.setScissor(box[0], box[1], box[2] - box[0], box[3] - box[1]); } else R.setScissorTest(false);
  R.setClearColor(0x000000, 1); R.clear(true, true, true); R.render(sc, cam); R.setScissorTest(false);
};

/* ---- scan materials: one shared analytic scan per space (plane or radial) ---- */
var SC_GLSL = 'uniform float uS,uMode,uW,uL1,uL2;uniform vec3 uD,uC;varying vec3 vP;' +
  'float scanD(){return uMode<.5?uS-dot(vP,uD):uS-length(vP-uC);}' +
  'float scanI(float d){if(d<0.)return -1.;float f=exp(-d*d/(uW*uW));float g=exp(-d/uL1);float tr=exp(-d/uL2);return f*1.7+g*.5+tr*.3;}';
V.SC_GLSL = SC_GLSL;
V.mkScan = function (mode, D, C, W2) { return { uS: { value: -2 }, uMode: { value: mode }, uW: { value: W2 || .3 }, uL1: { value: 1.2 }, uL2: { value: 7 }, uD: { value: D || new V3(0, 1, 0) }, uC: { value: C || new V3() } }; };
V.U = function (sc, o) { var u = {}; for (var k in sc) u[k] = sc[k]; for (var k2 in o) u[k2] = { value: o[k2] }; return u; };
var VL = 'attribute float aS;varying vec3 vP;varying float vS;void main(){vS=aS;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
V.lineMat = function (sc, col, base) {
  return new THREE.ShaderMaterial({ uniforms: V.U(sc, { uCol: col, uBase: base == null ? .5 : base, uPulse: -100, uAmt: 0 }), vertexShader: VL,
    fragmentShader: SC_GLSL + 'uniform vec3 uCol;uniform float uBase,uPulse,uAmt;varying float vS;void main(){float i=scanI(scanD());if(i<0.)discard;float pl=exp(-pow((vS-uPulse)/.9,2.));float v=uBase*i+uAmt*pl;gl_FragColor=vec4(uCol*v,1.);}',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
};
var VSF = 'varying vec3 vP,vN;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}';
var NOISE = 'float hs(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}float nz(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z);}';
V.surfMat = function (sc, col, rim, tex) {
  return new THREE.ShaderMaterial({ uniforms: V.U(sc, { uCol: col, uRim: rim, uTex: tex ? 1 : 0, uLit: 1 }), vertexShader: VSF,
    fragmentShader: SC_GLSL + 'varying vec3 vN;uniform vec3 uCol,uRim;uniform float uTex,uLit;' + NOISE +
      'void main(){float d=scanD();if(d<0.)discard;float i=scanI(d);vec3 n=normalize(vN),Vv=normalize(cameraPosition-vP);float ndv=abs(dot(n,Vv));float rim=pow(1.-ndv,3.);' +
      'float tx=1.;if(uTex>.5){vec3 q=normalize(vN)*3.2;tx=.55+.45*(nz(q*2.)*.6+nz(q*6.)*.4);}' +
      'vec3 c=uCol*(.05+.55*i*(.4+.6*ndv))*tx+uRim*rim*(.35+.65*min(i,1.))*uLit;gl_FragColor=vec4(c,1.);}' });
};
V.circ = function (r, n, y) { var p = []; for (var i = 0; i < n; i++) { var a = i / n * 6.2832, b = (i + 1) / n * 6.2832; p.push(r * Math.cos(a), y || 0, r * Math.sin(a), r * Math.cos(b), y || 0, r * Math.sin(b)); } return p; };
V.lines = function (pos, mat) { var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); var m = new THREE.LineSegments(g, mat); m.frustumCulled = false; m.renderOrder = 5; return m; };
V.shk = function (t, a, f) { return [Math.sin(t * f + 1.3) * a + Math.sin(t * f * 2.3) * a * .5, Math.sin(t * f * 1.7 + .4) * a + Math.sin(t * f * 3.1) * a * .4, Math.sin(t * f * 1.3 + 2.1) * a * .5]; };
/* a point glow (additive sprite-like points) whose brightness is a function of time per point */
V.glowPoints = function (sc, pos, col, size) {
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); var n = pos.length / 3, a = new Float32Array(n); g.setAttribute('aA', new THREE.BufferAttribute(a, 1));
  var m = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: V.U(sc, { uCol: col, uSize: size || 12 }), vertexShader: 'attribute float aA;uniform float uSize;varying vec3 vP;varying float vA;void main(){vA=aA;vec4 w=modelMatrix*vec4(position,1.);vP=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;gl_PointSize=uSize*aA;}',
    fragmentShader: SC_GLSL + 'uniform vec3 uCol;varying float vA;void main(){float d=scanD();if(d<0.||vA<.01)discard;float f=smoothstep(.5,.0,length(gl_PointCoord-.5));gl_FragColor=vec4(uCol*f*2.4*vA,1.);}', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.frustumCulled = false; m.renderOrder = 7; m.userData.a = a; return m;
};

/* ---- labels written by the scan (DOM, projected from 3D anchors or fixed px) ---- */
var OV = V.OV = document.getElementById('ov'), LBS = V.LBS = [];
V.mk = function (html, cls, st) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (st) d.style.cssText = st; OV.appendChild(d); return d; };
V.lab = function (o) { var el = V.mk('<div class=in>' + o.html + '</div><div class=bar></div>', 'lb'); o.el = el; o.in = el.firstChild; o.bar = el.lastChild; LBS.push(o); return o; };
V.writeIn = function (o, u) { if (u <= 0) { o.el.style.display = 'none'; return; } o.el.style.display = 'block'; var w = o.in.offsetWidth; o.in.style.clipPath = 'inset(0 ' + ((1 - u) * 100) + '% 0 0)'; o.bar.style.left = (w * u) + 'px'; o.bar.style.opacity = u < 1 ? 1 : 0; };
V.proj = function (v, cam) { var p = v.clone().project(cam); return [(p.x * .5 + .5) * W, (1 - (p.y * .5 + .5)) * H]; };
})();
