// WebGL photo layer: depth-parallax + grade + vignette + grain; two shots (A/B) with crossfade and a whip blur. Pure function of its arguments.
(function () {
'use strict';
var W = 1080, H = 1920, cv = document.getElementById('gl'), gl = cv.getContext('webgl', { antialias: false, preserveDrawingBuffer: true, alpha: false });
function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
var VS = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
var FS = ['precision highp float;varying vec2 vUv;',
'uniform sampler2D uA,uAd,uB,uBd;uniform vec3 camA,camB;uniform float uMix,uWhip,uPar,uTime,uDim,uFlash;uniform vec2 uWdir;',
'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
'vec3 shot(sampler2D c,sampler2D d,vec3 cam,vec2 uv){vec2 p=(uv-.5)/cam.z+.5;float dep=texture2D(d,p).r;vec2 off=cam.xy*(dep-.42)*uPar;vec2 q=clamp(p+off,vec2(.002),vec2(.998));return texture2D(c,q).rgb;}',
'vec3 both(vec2 uv){vec3 a=shot(uA,uAd,camA,uv);if(uMix<=.001)return a;vec3 b=shot(uB,uBd,camB,uv);return mix(a,b,uMix);}',
'void main(){vec2 uv=vUv;vec3 col;',
' if(uWhip>.001){col=vec3(0.);for(int i=0;i<9;i++){float f=float(i)/8.-.5;col+=both(uv+uWdir*f*uWhip);}col/=9.;}else col=both(uv);',
' float l=dot(col,vec3(.299,.587,.114));col=pow(max(col,0.),vec3(.94));col=mix(vec3(l),col,1.08);',
' vec3 st=vec3(-.02,.05,.12),ht=vec3(.12,.07,-.02);col+=mix(st,ht,smoothstep(.15,.85,l))*.28;col*=uDim;',
' float v=smoothstep(1.25,.3,length((uv-.5)*vec2(1.,.82)));col*=mix(.55,1.,v);',
' float g=hash(uv*vec2(1080.,1920.)+fract(uTime*7.31)*91.7)-.5;col+=g*.045;col+=vec3(uFlash);gl_FragColor=vec4(col,1.);}'].join('\n');
var pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
var U = {}; ['uA', 'uAd', 'uB', 'uBd', 'camA', 'camB', 'uMix', 'uWhip', 'uPar', 'uTime', 'uDim', 'uFlash', 'uWdir'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
function mk(img, unit) { var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; }
function load(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
var SH = {};
function loadShots(ids) { return Promise.all(ids.map(function (id) { return Promise.all([load('shots/' + id + '.jpg'), load('depth/' + id + '.png')]).then(function (r) { if (r[0] && r[1]) SH[id] = { c: mk(r[0], 0), d: mk(r[1], 1) }; }); })); }
function bind(id, which) { var s = SH[id]; if (!s) return false; var u0 = which === 'A' ? 0 : 2; gl.activeTexture(gl.TEXTURE0 + u0); gl.bindTexture(gl.TEXTURE_2D, s.c); gl.uniform1i(U[which === 'A' ? 'uA' : 'uB'], u0); gl.activeTexture(gl.TEXTURE0 + u0 + 1); gl.bindTexture(gl.TEXTURE_2D, s.d); gl.uniform1i(U[which === 'A' ? 'uAd' : 'uBd'], u0 + 1); return true; }
// o: {a,b,mix,camA:[x,y,z],camB,whip,wdir:[x,y],par,dim,flash,t}
function draw(o) {
  var okA = bind(o.a, 'A'), okB = o.b ? bind(o.b, 'B') : false; if (!okA) { gl.clearColor(.08, .09, .11, 1); gl.clear(gl.COLOR_BUFFER_BIT); return; }
  gl.uniform3f(U.camA, o.camA[0], o.camA[1], o.camA[2]); gl.uniform3f(U.camB, (o.camB || o.camA)[0], (o.camB || o.camA)[1], (o.camB || o.camA)[2]);
  gl.uniform1f(U.uMix, okB ? (o.mix || 0) : 0); gl.uniform1f(U.uWhip, o.whip || 0); gl.uniform2f(U.uWdir, (o.wdir || [1, 0])[0], (o.wdir || [1, 0])[1]); gl.uniform1f(U.uPar, o.par == null ? 0.06 : o.par);
  gl.uniform1f(U.uTime, o.t || 0); gl.uniform1f(U.uDim, o.dim == null ? 1 : o.dim); gl.uniform1f(U.uFlash, o.flash || 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
window.GLP = { load: loadShots, draw: draw };
})();
