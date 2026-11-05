/* mockup scenes: (a) the puddle hook, (b) the primary ray + reflection ray on the bench, (c) 1 / 8 / 64 rays per pixel + denoise (a real path tracer in a shader) */
(function () {
var e = E, S = e.S, V3 = e.V3, R = e.R, K = e.col, clamp = e.clamp;
var $ = function (id) { return document.getElementById(id); };
function overlay(eb, hl, src, cap) { $('ebt').textContent = eb; $('hl').innerHTML = hl; $('src').textContent = src || ''; $('cap').innerHTML = cap ? '<span>' + cap + '</span>' : ''; }
/* ---------- window textures ---------- */
function winTex(seed, cols, rows, warm) { var c = document.createElement('canvas'); c.width = cols * 8; c.height = rows * 8; var x = c.getContext('2d'); x.fillStyle = '#05060a'; x.fillRect(0, 0, c.width, c.height);
  for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) { var h = e.hash(seed * 997 + j * 131 + i * 7); if (h < (warm || .38)) { var k = e.hash(seed + j * 3 + i * 11); x.fillStyle = k < .72 ? 'rgb(' + (255) + ',' + (190 + k * 50 | 0) + ',' + (110 + k * 60 | 0) + ')' : 'rgb(170,215,255)'; x.fillRect(i * 8 + 1, j * 8 + 1, 5, 5); } }
  var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
function building(w, h, d, seed, o) { o = o || {}; var cols = Math.max(4, Math.round(w * 1.6)), rows = Math.max(6, Math.round(h * 1.3)), tex = winTex(seed, cols, rows, o.warm);
  var m = new THREE.MeshStandardMaterial({ color: o.col || 0x14161d, roughness: .55, metalness: .35, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: o.ei || 1.5 });
  var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); return mesh; }
/* ================= (a) puddle street ================= */
var gA = new THREE.Group(); S.add(gA);
(function () {
  S.fog = new THREE.FogExp2(0x0a0e1a, .011); S.background = new THREE.Color(0x0a0e1a);
  for (var side = -1; side <= 1; side += 2) { var z = 8; for (var i = 0; i < 14; i++) { var w = 7 + e.hash(i * 3 + side) * 5, h = 9 + e.hash(i * 5 + side * 9) * 20, b = building(w, h, 9, i * 2 + (side > 0 ? 40 : 0)); b.position.set(side * (9 + w / 2), h / 2, z - 5); gA.add(b); z -= 9 + e.hash(i) * 3; }
    var sw = new THREE.Mesh(new THREE.BoxGeometry(3.2, .25, 160), e.physMat(0x20232b, { roughness: .55 })); sw.position.set(side * 6.4, .125, -60); gA.add(sw); }
  /* the tower at the end of the street: banded so its reflection reads as a building */
  var tw = new THREE.Group(); var tb = building(12, 46, 12, 77, { ei: 1.2, warm: .55 }); tb.position.y = 23; tw.add(tb);
  for (var q = 0; q < 7; q++) { var band = new THREE.Mesh(new THREE.BoxGeometry(12.4, 1.3, 12.4), new THREE.MeshBasicMaterial({ color: new THREE.Color(q % 2 ? K.TUNG : K.ICE).multiplyScalar(3.4) })); band.position.y = 6 + q * 6.2; tw.add(band); }
  var fin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 44, .5), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.COR).multiplyScalar(3) })); fin.position.set(0, 23, 6.3); tw.add(fin);
  var spire = new THREE.Mesh(new THREE.CylinderGeometry(.18, .4, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.COR).multiplyScalar(3) })); spire.position.y = 52; tw.add(spire); tw.position.set(0, 0, -46); gA.add(tw);
  for (var s2 = -1; s2 <= 1; s2 += 2) for (var l = 0; l < 9; l++) { var lz = 4 - l * 12; var post = new THREE.Mesh(new THREE.CylinderGeometry(.09, .12, 6.4, 8), e.physMat(0x2a2d36, { metalness: .8, roughness: .35 })); post.position.set(s2 * 5.2, 3.2, lz); gA.add(post);
    var head = new THREE.Mesh(new THREE.SphereGeometry(.34, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.TUNG).multiplyScalar(3.2) })); head.position.set(s2 * 4.7, 6.5, lz); gA.add(head); var g = e.glow('t', 5.2, .9); g.position.copy(head.position); gA.add(g); }
  for (var d2 = 0; d2 < 18; d2++) { var dash = new THREE.Mesh(new THREE.BoxGeometry(.18, .02, 2.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xdfe6ee).multiplyScalar(.7) })); dash.position.set(0, .012, -8 - d2 * 5); gA.add(dash); }
  var rtR = new THREE.WebGLRenderTarget(540, 960, { type: THREE.HalfFloatType }); var vcam = new THREE.PerspectiveCamera(40, 1080 / 1920, .1, 400);
  var pm = new THREE.ShaderMaterial({ uniforms: { uRef: { value: rtR.texture }, uVP: { value: new THREE.Matrix4() }, uCam: { value: new V3() }, uT: { value: 0 }, uFog: { value: new THREE.Color(0x0a0e1a) }, uFd: { value: .011 } }, vertexShader: 'varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}',
    fragmentShader: 'uniform sampler2D uRef;uniform mat4 uVP;uniform vec3 uCam,uFog;uniform float uT,uFd;varying vec3 vW;' +
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}' +
    'void main(){float m=fbm(vW.xz*.22+vec2(3.1,1.7));float ell=1.-length((vW.xz-vec2(.3,-4.5))/vec2(5.2,8.5));float pud=smoothstep(.52,.58,max(m,ell*.9+.2));' +
    'vec2 rip=vec2(fbm(vW.xz*5.+uT*.35),fbm(vW.xz*5.+7.-uT*.35))-.5;vec2 rip2=(vec2(n(vW.xz*14.),n(vW.xz*14.+9.))-.5);' +
    'vec4 cl=uVP*vec4(vW,1.);vec2 uv=cl.xy/cl.w*.5+.5;uv+=rip*mix(.05,.006,pud)+rip2*mix(.02,.0,pud);uv=clamp(uv,.001,.999);vec3 refl=texture2D(uRef,uv).rgb;' +
    'vec3 V=normalize(uCam-vW);float F=.04+.96*pow(1.-max(V.y,0.),5.);vec3 asph=vec3(.028,.03,.036)*(.7+.7*fbm(vW.xz*3.));' +
    'float rk=mix(.55*F+.07,.78+.22*F,pud);vec3 col=mix(asph,refl*mix(.55,1.,pud),clamp(rk,0.,1.));float dist=length(uCam-vW);col=mix(uFog,col,exp(-uFd*uFd*dist*dist*.0+-uFd*dist*.55));gl_FragColor=vec4(col,1.);}' });
  var pud = new THREE.Mesh(new THREE.PlaneGeometry(60, 220), pm); pud.rotation.x = -Math.PI / 2; pud.position.set(0, 0, -60); gA.add(pud);
  e.HOOKS.pre.push(function () { if (!gA.visible) return; var cp = e.camP, cl = e.camL; vcam.fov = e.getF(); vcam.position.set(cp.x, -cp.y, cp.z); vcam.up.set(0, -1, 0); vcam.lookAt(cl.x, -cl.y, cl.z); vcam.updateProjectionMatrix(); vcam.updateMatrixWorld(true);
    pud.visible = false; R.setRenderTarget(rtR); R.clear(); R.render(S, vcam); pud.visible = true; pm.uniforms.uVP.value.multiplyMatrices(vcam.projectionMatrix, vcam.matrixWorldInverse); pm.uniforms.uCam.value.copy(cp); });
  gA.userData.pm = pm;
})();
/* ================= (b) the bench: primary ray + reflection ray ================= */
var gB = new THREE.Group(); S.add(gB); gB.visible = false;
(function () {
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), e.physMat(0x08090c, { roughness: .38, metalness: .35, envMapIntensity: .32 })); floor.rotation.x = -Math.PI / 2; gB.add(floor); gB.add(e.gridFloor(30, 1, 0x7f8aa0, .1));
  var rS = 1.3, Cs = new V3(0, 1.3, 0), d = new V3(.12, -.22, .97).normalize(), n = new V3(.4, .25, -.88).normalize(), P = Cs.clone().add(n.clone().multiplyScalar(rS)), Rd = d.clone().sub(n.clone().multiplyScalar(2 * d.dot(n))).normalize(), E0 = P.clone().sub(d.clone().multiplyScalar(5.6)), Bp = P.clone().add(Rd.clone().multiplyScalar(5.0));
  var chrome = new THREE.Mesh(new THREE.SphereGeometry(rS, 96, 64), e.physMat(0xffffff, { metalness: 1, roughness: .03, envMapIntensity: 1.7 })); chrome.position.copy(Cs); gB.add(chrome);
  var glass = new THREE.Mesh(new THREE.SphereGeometry(.7, 64, 48), e.physMat(0xaed8ff, { metalness: 0, roughness: .02, envMapIntensity: 2.4, transparent: true, opacity: .3, clearcoat: 1, clearcoatRoughness: .02 })); glass.position.set(-2.3, .7, 2.2); gB.add(glass);
  var brass = new THREE.Mesh(new THREE.CylinderGeometry(.5, .55, .46, 48), e.physMat(0xc79a4b, { metalness: 1, roughness: .28, envMapIntensity: 1.5 })); brass.position.set(2.2, .23, 2.6); gB.add(brass);
  var eye = new THREE.Group(); var body = new THREE.Mesh(new THREE.BoxGeometry(1.3, .9, 1.0), e.physMat(0x14161c, { metalness: .8, roughness: .35 })); eye.add(body);
  var barrel = new THREE.Mesh(new THREE.CylinderGeometry(.3, .36, .6, 40), e.physMat(0x20232b, { metalness: .9, roughness: .25 })); barrel.rotation.x = Math.PI / 2; barrel.position.z = -.75; eye.add(barrel);
  var lens = new THREE.Mesh(new THREE.CircleGeometry(.28, 40), new THREE.MeshPhysicalMaterial({ color: 0x0a1630, metalness: .2, roughness: .02, clearcoat: 1, envMapIntensity: 3 })); lens.position.z = -1.06; lens.rotation.y = Math.PI; eye.add(lens);
  var ring = new THREE.Mesh(new THREE.TorusGeometry(.34, .04, 12, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(2.4) })); ring.position.z = -1.05; eye.add(ring); eye.position.copy(E0); eye.lookAt(E0.clone().add(d)); eye.rotateY(Math.PI); gB.add(eye);
  var Pc = E0.clone().add(d.clone().multiplyScalar(2.9)), cell = .28, cols = 10, rows = 12, plane = new THREE.Group(); plane.position.copy(Pc); plane.lookAt(Pc.clone().add(d)); gB.add(plane);
  var pts = []; for (var i = -cols / 2; i <= cols / 2; i++) pts.push(new V3(i * cell - cell / 2, -rows * cell / 2, 0), new V3(i * cell - cell / 2, rows * cell / 2, 0)); for (var j = -rows / 2; j <= rows / 2; j++) pts.push(new V3(-cols * cell / 2 - cell / 2, j * cell - cell / 2, 0), new V3(cols * cell / 2 - cell / 2, j * cell - cell / 2, 0));
  var lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: new THREE.Color(K.CHALK).multiplyScalar(1.3), transparent: true, opacity: .6 })); plane.add(lines);
  var glassP = new THREE.Mesh(new THREE.PlaneGeometry(cols * cell, rows * cell), new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: .07, side: THREE.DoubleSide, depthWrite: false })); glassP.position.set(-cell / 2, -cell / 2, 0); plane.add(glassP);
  var hot = new THREE.Mesh(new THREE.BoxGeometry(cell * .94, cell * .94, .05), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.HOT).multiplyScalar(3) })); plane.add(hot);
  var bld = building(2.0, 5.4, 2.0, 5, { ei: 1.7, warm: .5 }); bld.position.set(Bp.x + 1.0, 2.7, Bp.z); gB.add(bld);
  var crown = new THREE.Mesh(new THREE.BoxGeometry(2.25, .26, 2.25), new THREE.MeshBasicMaterial({ color: new THREE.Color(K.ICE).multiplyScalar(2.8) })); crown.position.set(Bp.x + 1.0, 5.5, Bp.z); gB.add(crown);
  var rEnd = P.clone().add(Rd.clone().multiplyScalar(((Bp.x + 1.0 - 1.0 - P.x) / Rd.x) - .05)); var eStart = E0.clone().add(d.clone().multiplyScalar(.8));
  gB.add(e.ray(eStart, P, K.HOT, .06)); gB.add(e.ray(P, rEnd, K.ICE, .06)); gB.add(e.ray(P, P.clone().add(n.clone().multiplyScalar(1.7)), K.SAGE, .04));
  var ah1 = e.arrowHead(K.HOT, .26); ah1.position.copy(P.clone().sub(d.clone().multiplyScalar(.2))); e.orient(ah1, d); gB.add(ah1);
  var ah2 = e.arrowHead(K.ICE, .26); ah2.position.copy(rEnd); e.orient(ah2, Rd); gB.add(ah2);
  var hit = e.glow('w', 1.4, 1); hit.position.copy(P); gB.add(hit);
  var up = new V3(0, 1, 0);
  var l1 = e.lab('PRIMARY RAY', K.HOT, .5); l1.position.copy(E0.clone().add(d.clone().multiplyScalar(3.4)).add(new V3(-2.3, .4, 0))); gB.add(l1);
  var l2 = e.lab('NORMAL', K.SAGE, .4); l2.position.copy(P.clone().add(n.clone().multiplyScalar(1.4)).add(new V3(1.5, .5, -.9))); gB.add(l2);
  var l3 = e.lab('REFLECTION RAY', K.ICE, .5); l3.position.copy(P.clone().add(Rd.clone().multiplyScalar(2.6)).add(new V3(0, .6, -.9))); gB.add(l3);
  var l4 = e.lab('ONE PIXEL', K.HOT, .4); l4.position.copy(Pc.clone().add(new V3(2.1, .8, -.5))); gB.add(l4);
  var l5 = e.lab('BUILDING BEHIND YOU', K.ICE, .42); l5.position.copy(Bp.clone().add(new V3(1.0, 3.5, -.2))); gB.add(l5);
  gB.userData = { pts: [E0.clone().add(new V3(0, .6, -.6)), P, Bp.clone().add(new V3(2.2, 3.0, -1.2)), Bp.clone().setY(0).add(new V3(1, 0, 1.2)), Pc.clone().add(new V3(-1.6, 1.2, 0)), Pc.clone().add(new V3(2.6, -1.2, 0)), Cs.clone().add(new V3(-1.4, -1.2, 1.4)), Cs.clone().add(new V3(1.4, -1.2, 1.4))] };
})();
/* ================= (c) 1 / 8 / 64 rays per pixel : a real path tracer in a shader ================= */
var gC = new THREE.Group(); S.add(gC); gC.visible = false;
var PTV = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
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
var PTU = { uRes: { value: new THREE.Vector2(512, 512) }, uSpp: { value: 1 }, uSeed: { value: 0 }, uMode: { value: 0 } }; var ptM = new THREE.ShaderMaterial({ uniforms: PTU, vertexShader: PTV, fragmentShader: PTF, depthTest: false, depthWrite: false });
var DNF = 'precision highp float;uniform sampler2D tC,tN,tA;uniform vec2 px;varying vec2 vUv;void main(){vec3 c0=texture2D(tC,vUv).rgb;vec4 n0=texture2D(tN,vUv);vec3 a0=texture2D(tA,vUv).rgb;vec3 acc=vec3(0.);float ws=0.;' +
  'for(int j=-7;j<=7;j++)for(int i=-7;i<=7;i++){vec2 o=vec2(float(i),float(j));vec2 uv=vUv+o*px;vec4 nn=texture2D(tN,uv);vec3 cc=min(texture2D(tC,uv).rgb,vec3(2.2));vec3 dn=nn.rgb-n0.rgb;float w=exp(-dot(o,o)/(2.*14.))*exp(-dot(dn,dn)*70.)*exp(-dot(texture2D(tA,uv).rgb-a0,texture2D(tA,uv).rgb-a0)*90.)*exp(-abs(nn.a-n0.a)*10.)*exp(-pow(abs(nn.a-n0.a),2.)*0.);acc+=cc*w;ws+=w;}gl_FragColor=vec4(acc/ws,1.);}';
var dnM = new THREE.ShaderMaterial({ uniforms: { tC: { value: null }, tN: { value: null }, tA: { value: null }, px: { value: new THREE.Vector2(1 / 512, 1 / 512) } }, vertexShader: PTV, fragmentShader: DNF, depthTest: false, depthWrite: false });
function mk() { return new THREE.WebGLRenderTarget(512, 512, { type: THREE.HalfFloatType }); }
var ptRT = [mk(), mk(), mk(), mk()], gbRT = mk(), gaRT = mk();
function renderPT(spp, tgt, seed) { PTU.uSpp.value = spp; PTU.uSeed.value = seed || 0; PTU.uMode.value = 0; e.pass(ptM, tgt); }
(function () {
  var panels = [{ x: -1.72, y: 2.05, lbl: '1 RAY / PIXEL', col: K.COR }, { x: 1.72, y: 2.05, lbl: '8 RAYS / PIXEL', col: K.TUNG }, { x: -1.72, y: -1.9, lbl: '64 RAYS / PIXEL', col: K.ICE }, { x: 1.72, y: -1.9, lbl: '1 RAY + DENOISER', col: K.SAGE }];
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), e.physMat(0x090a0e, { roughness: .3, metalness: .6, envMapIntensity: .6 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -4.4; gC.add(floor);
  panels.forEach(function (p, i) { var g = new THREE.Group(), fr = new THREE.Mesh(new THREE.BoxGeometry(3.28, 3.28, .22), e.physMat(0x15171d, { metalness: .85, roughness: .3, envMapIntensity: 1.2 })); g.add(fr);
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 3.0), new THREE.MeshBasicMaterial({ map: ptRT[i].texture, toneMapped: false })); scr.position.z = .115; g.add(scr);
    var edge = new THREE.Mesh(new THREE.BoxGeometry(3.4, .07, .26), new THREE.MeshBasicMaterial({ color: new THREE.Color(p.col).multiplyScalar(2.4) })); edge.position.set(0, -1.7, 0); g.add(edge);
    var l = e.lab(p.lbl, p.col, .36); l.position.set(0, -2.12, .3); g.add(l); g.position.set(p.x, p.y, 0); g.rotation.y = (p.x < 0 ? 1 : -1) * .1; gC.add(g); });
})();
function buildC() { PTU.uRes.value.set(512, 512); renderPT(1, ptRT[0], 11); renderPT(8, ptRT[1], 23); renderPT(64, ptRT[2], 37); renderPT(1, ptRT[3], 11); PTU.uMode.value = 1; e.pass(ptM, gbRT); PTU.uMode.value = 2; e.pass(ptM, gaRT); PTU.uMode.value = 0; dnM.uniforms.tA.value = gaRT.texture; var dn = mk(), dn2 = mk(); dnM.uniforms.tC.value = ptRT[3].texture; dnM.uniforms.tN.value = gbRT.texture; e.pass(dnM, dn); dnM.uniforms.tC.value = dn.texture; e.pass(dnM, dn2); var fin = mk(); e.pass(new THREE.ShaderMaterial({ uniforms: { t: { value: dn2.texture } }, vertexShader: PTV, fragmentShader: 'varying vec2 vUv;uniform sampler2D t;void main(){gl_FragColor=texture2D(t,vUv);}', depthTest: false }), ptRT[3]); R.setRenderTarget(null); }
/* ================= shots ================= */
var SHOT = {
  a: { p: [.4, 1.35, 7.4], l: [.1, -2.9, -3.2], f: 44, eb: 'THE PUDDLE', hl: 'Puddle mein woh <b>building</b> jo screen par hai hi nahi', src: 'ILLUSTRATIVE SCENE', cap: 'Yeh kaise mumkin hai?', foc: 11 },
  b: { p: [-9.5, 6.4, 11], l: [.8, 2.0, -1.2], f: 54, eb: 'THE FLIP', hl: 'Kiran <b>aankh</b> se, ulti taraf', src: 'ILLUSTRATIVE SCENE', cap: 'Har pixel se <em>ek kiran</em> bahar', foc: 18 },
  c: { p: [0, -1.0, 20.5], l: [0, -1.2, 0], f: 40, eb: 'FEWER RAYS, MORE GRAIN', hl: 'Kam kirnein = <b>daane</b>', src: 'REAL PATH TRACER · SAME SCENE · 4 SETTINGS', cap: 'Ek kiran, aath kirnein, chaunsath kirnein', foc: 14.5 }
};
function fitCam(pts, dir, fov, box) { var c = new V3(); pts.forEach(function (p) { c.add(p); }); c.multiplyScalar(1 / pts.length); var look = c.clone(), dist = 6, cp;
  function ok() { return pts.every(function (p) { var q = p.clone().project(e.C); var x = (q.x * .5 + .5) * 1080, y = (1 - (q.y * .5 + .5)) * 1920; return x > box[0] && x < box[2] && y > box[1] && y < box[3]; }); }
  function put() { cp = look.clone().add(dir.clone().multiplyScalar(dist)); e.setCam([cp.x, cp.y, cp.z], [look.x, look.y, look.z], fov); e.applyCam(); }
  for (var it = 0; it < 5; it++) { var lo = 2, hi = 90; for (var k = 0; k < 24; k++) { dist = (lo + hi) / 2; put(); if (ok()) hi = dist; else lo = dist; } dist = hi * 1.0; put();
    var mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9; pts.forEach(function (p) { var q = p.clone().project(e.C), x = (q.x * .5 + .5) * 1080, y = (1 - (q.y * .5 + .5)) * 1920; mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); mny = Math.min(mny, y); mxy = Math.max(mxy, y); });
    var wpp = 2 * dist * Math.tan(fov * Math.PI / 360) / 1920, r = new V3(), u = new V3(), f = new V3(); e.C.matrixWorld.extractBasis(r, u, f); var dx = ((mnx + mxx) / 2 - 540) * wpp, dy = ((mny + mxy) / 2 - (box[1] + box[3]) / 2) * wpp; look.add(r.multiplyScalar(dx)).add(u.multiplyScalar(-dy)); }
  put(); return { p: [cp.x, cp.y, cp.z], l: [look.x, look.y, look.z] }; }
window.__mock = function (n, v) { var s = SHOT[n]; if (n === 'b') { var fc = fitCam(gB.userData.pts, new V3(.1, .85, .5).normalize(), 50, [190, 330, 890, 1230]); s.p = fc.p; s.l = fc.l; s.f = 52; s.foc = new V3(fc.p[0], fc.p[1], fc.p[2]).distanceTo(new V3(fc.l[0], fc.l[1], fc.l[2])); } gA.visible = n === 'a'; gB.visible = n === 'b'; gC.visible = n === 'c';
  if (n === 'a') { S.fog = new THREE.FogExp2(0x0a0e1a, .011); S.background = new THREE.Color(0x0a0e1a); } else { S.fog = new THREE.FogExp2(0x07080b, .028); S.background = new THREE.Color(0x07080b); }
  e.setCam(s.p, s.l, s.f); e.applyCam(); if (n === 'a') gA.userData.pm.uniforms.uT.value = 2.0; if (n === 'c') buildC();
  e.clampLabels(); overlay(s.eb, s.hl, s.src, s.cap);
  e.POST.focus = s.foc; e.POST.aper = n === 'c' ? .1 : n === 'a' ? .2 : .2; e.POST.maxR = 22; e.POST.ca = .0009; e.POST.bloom = n === 'c' ? .6 : 1.0; e.POST.seed = 1.7; e.render(); };
window.__ready = true;
})();
