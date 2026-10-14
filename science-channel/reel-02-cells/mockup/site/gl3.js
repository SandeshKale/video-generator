// Cinematic WebGL pipeline: pass 1 plates (depth parallax + depth-of-field + chroma shift + depth wave), pass 2 composite the 2D sprite canvas,
// pass 3 bloom (mip-biased taps) + anamorphic streak + filmic curve + vignette + grain + flash. Pure function of its arguments.
(function () {
'use strict';
var W = 1080, H = 1920, PW = 1024, PH = 2048, cv = document.getElementById('gl'), gl = cv.getContext('webgl', { antialias: false, preserveDrawingBuffer: true, alpha: false });
function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) + s); return o; }
var VS = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
function prog(fs) { var p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p); return p; }
var FS1 = ['precision highp float;varying vec2 vUv;uniform sampler2D uA,uAd,uB,uBd;uniform vec3 camA,camB;uniform vec2 shA,shB;uniform float uMix,uPar,uDim,uDof,uFocus,uCA,uWaveD,uWaveW,uWaveA,uTime;',
'vec3 shot(sampler2D c,sampler2D d,vec3 cam,vec2 sh,vec2 uv){vec2 p=(uv-.5)/cam.z+.5+sh;float dep=texture2D(d,p).r;float coc=uDof*abs(dep-uFocus);vec3 acc=vec3(0.);float wd=0.;',
' for(int i=0;i<10;i++){float a=float(i)*2.39996;float r=sqrt((float(i)+.5)/10.)*coc;vec2 pp=p+vec2(cos(a),sin(a))*r*vec2(1.,.5625);float dd=texture2D(d,pp).r;vec2 off=cam.xy*(dd-.42)*uPar;vec2 q=clamp(pp+off,vec2(.002),vec2(.998));vec2 ca=(uv-.5)*uCA;',
'  acc+=vec3(texture2D(c,clamp(q+ca,vec2(.002),vec2(.998))).r,texture2D(c,q).g,texture2D(c,clamp(q-ca,vec2(.002),vec2(.998))).b);}',
' vec3 col=acc/10.;float wv=smoothstep(uWaveW,0.,abs(dep-uWaveD))*uWaveA;col+=vec3(.42,1.,.18)*wv*(.35+1.2*dot(col,vec3(.333)));return col;}',
'vec3 both(vec2 uv){vec3 a=shot(uA,uAd,camA,shA,uv);if(uMix<=.001)return a;vec3 b=shot(uB,uBd,camB,shB,uv);return mix(a,b,uMix);}',
'void main(){vec3 col=both(vUv)*uDim;gl_FragColor=vec4(col,1.);}'].join('\n');
var FS2 = 'precision highp float;varying vec2 vUv;uniform sampler2D uP,uS;void main(){vec3 c=texture2D(uP,vUv).rgb;vec4 s=texture2D(uS,vUv);gl_FragColor=vec4(c*(1.-s.a)+s.rgb,1.);}';
var FS3 = ['precision highp float;varying vec2 vUv;uniform sampler2D uT;uniform float uBloom,uStreak,uFlash,uTime,uVig;',
'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
'void main(){vec2 uv=vUv;vec3 base=texture2D(uT,uv).rgb;vec3 b=vec3(0.);',
' for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 o=vec2(cos(a),sin(a))*vec2(.03,.017);b+=texture2D(uT,uv+o,4.5).rgb+texture2D(uT,uv+o*2.2,5.5).rgb;}',
' b=max(b/16.-.18,0.)*uBloom;vec3 s=vec3(0.);',
' for(int i=-6;i<=6;i++){float f=float(i);s+=max(texture2D(uT,uv+vec2(f*.022,0.),3.5).rgb-.55,0.)*(1.-abs(f)/7.);}',
' vec3 col=base+b+s*vec3(.35,.8,1.)*uStreak;',
' col=col/(1.+col*.18);col=pow(max(col,0.),vec3(.96));col=mix(vec3(dot(col,vec3(.299,.587,.114))),col,1.08);col=col*vec3(1.03,1.0,.985);',
' float v=smoothstep(1.2,.25,length((uv-.5)*vec2(1.,.8)));col*=mix(.5,1.,v)*mix(1.,v,uVig);',
' float g=hash(uv*vec2(1080.,1920.)+fract(uTime*7.31)*91.7)-.5;col+=g*.04;col+=vec3(uFlash);gl_FragColor=vec4(col,1.);}'].join('\n');
var P1 = prog(FS1), P2 = prog(FS2), P3 = prog(FS3);
var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
function setup(p) { gl.useProgram(p); var l = gl.getAttribLocation(p, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0); var U = {}; var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (var i = 0; i < n; i++) { var nm = gl.getActiveUniform(p, i).name; U[nm] = gl.getUniformLocation(p, nm); } return U; }
var U1 = setup(P1), U2 = setup(P2), U3 = setup(P3);
function tex(unit, mip) { var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; }
function fbo(w, h, mip) { var t = tex(7, mip); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); var f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return { f: f, t: t, w: w, h: h }; }
var FA = fbo(W, H, false), FB = fbo(PW, PH, true); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
var sprTex = tex(6, false); gl.activeTexture(gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, sprTex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
function mk(img, unit) { var t = tex(unit, false); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); return t; }
function load(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
var SH = {};
function loadShots(ids) { return Promise.all(ids.map(function (id) { return Promise.all([load('plates/' + id + '.jpg'), load('plates/' + id + '_depth.png')]).then(function (r) { if (r[0] && r[1]) SH[id] = { c: mk(r[0], 0), d: mk(r[1], 1) }; else console.log('missing plate', id); }); })); }
function bind(id, w) { var s = SH[id]; if (!s) return false; var u0 = w === 'A' ? 0 : 2; gl.activeTexture(gl.TEXTURE0 + u0); gl.bindTexture(gl.TEXTURE_2D, s.c); gl.uniform1i(U1[w === 'A' ? 'uA' : 'uB'], u0); gl.activeTexture(gl.TEXTURE0 + u0 + 1); gl.bindTexture(gl.TEXTURE_2D, s.d); gl.uniform1i(U1[w === 'A' ? 'uAd' : 'uBd'], u0 + 1); return true; }
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
// o: {a,b,mix,camA:[x,y,z],camB,shA,shB,par,dim,dof,focus,ca,wave:[d,w,a],spr:canvas,bloom,streak,flash,vig,t}
function draw(o) {
  gl.useProgram(P1); gl.bindBuffer(gl.ARRAY_BUFFER, buf); setup(P1);
  var okA = bind(o.a, 'A'), okB = o.b ? bind(o.b, 'B') : false;
  gl.bindFramebuffer(gl.FRAMEBUFFER, FA.f); gl.viewport(0, 0, W, H);
  if (!okA) { gl.clearColor(.1, .1, .12, 1); gl.clear(gl.COLOR_BUFFER_BIT); } else {
    var cB = o.camB || o.camA, sB = o.shB || o.shA || [0, 0], w = o.wave || [0, 1, 0];
    gl.uniform3f(U1.camA, o.camA[0], o.camA[1], o.camA[2]); gl.uniform3f(U1.camB, cB[0], cB[1], cB[2]); gl.uniform2f(U1.shA, (o.shA || [0, 0])[0], (o.shA || [0, 0])[1]); gl.uniform2f(U1.shB, sB[0], sB[1]);
    gl.uniform1f(U1.uMix, okB ? (o.mix || 0) : 0); gl.uniform1f(U1.uPar, o.par == null ? .05 : o.par); gl.uniform1f(U1.uDim, o.dim == null ? 1 : o.dim); gl.uniform1f(U1.uDof, o.dof || 0); gl.uniform1f(U1.uFocus, o.focus == null ? .5 : o.focus); gl.uniform1f(U1.uCA, o.ca || 0);
    gl.uniform1f(U1.uWaveD, w[0]); gl.uniform1f(U1.uWaveW, w[1]); gl.uniform1f(U1.uWaveA, w[2]); gl.uniform1f(U1.uTime, o.t || 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
  // pass 2: composite sprites
  gl.useProgram(P2); setup(P2); gl.bindFramebuffer(gl.FRAMEBUFFER, FB.f); gl.viewport(0, 0, PW, PH);
  gl.activeTexture(gl.TEXTURE7); gl.bindTexture(gl.TEXTURE_2D, FA.t); gl.uniform1i(U2.uP, 7);
  gl.activeTexture(gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, sprTex); if (o.spr) { gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, o.spr); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); } gl.uniform1i(U2.uS, 6);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.activeTexture(gl.TEXTURE7); gl.bindTexture(gl.TEXTURE_2D, FB.t); gl.generateMipmap(gl.TEXTURE_2D);
  // pass 3: bloom, streak, grade
  gl.useProgram(P3); setup(P3); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); gl.uniform1i(U3.uT, 7);
  gl.uniform1f(U3.uBloom, o.bloom == null ? 1 : o.bloom); gl.uniform1f(U3.uStreak, o.streak || 0); gl.uniform1f(U3.uFlash, o.flash || 0); gl.uniform1f(U3.uTime, o.t || 0); gl.uniform1f(U3.uVig, o.vig == null ? 1 : o.vig);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
window.GLP = { load: loadShots, draw: draw };
})();
