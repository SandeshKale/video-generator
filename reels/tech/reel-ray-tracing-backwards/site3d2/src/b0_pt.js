/* real shader path tracer (1 / 8 / 64 rays per pixel + edge-aware denoise), carried over from v1 */
(function () {
var e = E, R = e.R, B = window.B;
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

})();
