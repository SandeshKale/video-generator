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
