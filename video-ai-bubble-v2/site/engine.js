// Deterministic renderer: every pixel is a pure function of t (window.__seek).
(function(){
'use strict';
var D=window.DATA, W=1920, H=1080;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,u){return a+(b-a)*u;}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
window.U={clamp:clamp,lerp:lerp,sm:sm};

// ---------------- WebGL photo layer ----------------
var cv=document.getElementById('gl');
var gl=cv.getContext('webgl',{antialias:false,preserveDrawingBuffer:true,alpha:false});
function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
var VS='attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
var FS=[
'precision highp float;varying vec2 vUv;',
'uniform sampler2D uA,uAd,uB,uBd;uniform vec3 camA,camB;uniform float uMix,uWhip,uPar,uTime,uDim,uFlash,uSplit,uPulse;uniform vec2 uWdir;',
'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
'vec3 shot(sampler2D c,sampler2D d,vec3 cam,vec2 uv){',
'  vec2 p=(uv-.5)/cam.z+.5; float dep=texture2D(d,p).r;',
'  vec2 off=cam.xy*(dep-.42)*uPar; vec2 q=clamp(p+off,vec2(.002),vec2(.998));',
'  return texture2D(c,q).rgb;}',
'vec3 both(vec2 uv){vec3 a=shot(uA,uAd,camA,uv); if(uMix<=.001)return a; vec3 b=shot(uB,uBd,camB,uv); return mix(a,b,uMix);}',
'void main(){',
'  vec2 uv=vUv; vec3 col;',
'  if(uWhip>.001){ col=vec3(0.); for(int i=0;i<9;i++){float f=float(i)/8.-.5; col+=both(uv+uWdir*f*uWhip);} col/=9.; }',
'  else if(uSplit>.001){ vec2 o=vec2(uSplit,0.); col=vec3(both(uv+o).r,both(uv).g,both(uv-o).b);} else col=both(uv);',
'  float l=dot(col,vec3(.299,.587,.114));',
'  col=pow(max(col,0.),vec3(.94)); col=mix(vec3(l),col,1.14);',
'  vec3 st=vec3(-.02,.05,.14), ht=vec3(.14,.07,-.02); col+=mix(st,ht,smoothstep(.15,.85,l))*.30;',
'  col*=uDim*(1.+uPulse*.5);',
'  float v=smoothstep(1.2,.3,length((uv-.5)*vec2(1.22,1.)));col*=mix(.50,1.,v);',
'  col*=mix(.50,1.,smoothstep(0.,.36,uv.y));',
'  float g=hash(uv*vec2(1920.,1080.)+fract(uTime*7.31)*91.7)-.5; col+=g*.05;',
'  col+=vec3(uFlash);',
'  gl_FragColor=vec4(col,1.);}'
].join('\n');
var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
var U={};['uA','uAd','uB','uBd','camA','camB','uMix','uWhip','uPar','uTime','uDim','uFlash','uSplit','uPulse','uWdir'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n);});
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
var TEX={};
function mkTex(img,unit){var t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
function loadImg(src){return new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i);};i.onerror=function(){rej(new Error('load '+src));};i.src=src;});}
var SH={};  // shot id -> {c:tex,d:tex}
function bindShot(id,which){var s=SH[id];var u0=which==='A'?0:2;
  gl.activeTexture(gl.TEXTURE0+u0);gl.bindTexture(gl.TEXTURE_2D,s.c);gl.uniform1i(U[which==='A'?'uA':'uB'],u0);
  gl.activeTexture(gl.TEXTURE0+u0+1);gl.bindTexture(gl.TEXTURE_2D,s.d);gl.uniform1i(U[which==='A'?'uAd':'uBd'],u0+1);}

// ---------------- camera moves ----------------
// returns [x,y,zoom]; x,y in -1..1 (parallax drivers); u in 0..1 across the scene (may exceed slightly for overlap)
var MOVES=[
 function(u){return [lerp(-.55,.55,u),lerp(.10,-.05,u),lerp(1.10,1.26,u)];},   // push in + drift right
 function(u){return [lerp(.55,-.55,u),lerp(-.05,.10,u),lerp(1.26,1.10,u)];},   // pull out + drift left
 function(u){return [lerp(-.9,.9,u),0,1.16];},                                  // lateral slide
 function(u){return [lerp(.9,-.9,u),0,1.16];},
 function(u){return [lerp(.2,-.2,u),lerp(-.6,.6,u),lerp(1.12,1.22,u)];},       // crane up
 function(u){return [Math.sin(u*Math.PI)*.8-.3,lerp(.15,-.15,u),lerp(1.18,1.30,u)];}, // arc
];
function cam(sc,i,t){var u=(t-sc.start)/Math.max(.01,sc.end-sc.start);var m=MOVES[sc.move%MOVES.length];
  var e=u<0?0:u; var c=m(e); // ease: slow-in/out feel but keep motion alive
  return c;}

// ---------------- scene lookup ----------------
var S=D.scenes, TR=.34;
function sceneAt(t){for(var i=0;i<S.length;i++){if(t<S[i].end)return i;}return S.length-1;}

// ---------------- dust motes (2D canvas) ----------------
var dc=document.getElementById('dust').getContext('2d');
var N=70, MOTES=[];for(var i=0;i<N;i++){MOTES.push({x:H1(i*3.1)*W,y:H1(i*7.7)*H,z:.3+H1(i*5.3)*.9,s:.6+H1(i*2.2)*1.6,ph:H1(i*9.9)*6.28});}
function H1(i){var x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x);}
var spr=document.createElement('canvas');spr.width=spr.height=64;(function(){var g=spr.getContext('2d');var r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,240,215,.9)');r.addColorStop(.35,'rgba(255,225,190,.28)');r.addColorStop(1,'rgba(255,220,180,0)');g.fillStyle=r;g.fillRect(0,0,64,64);})();
function drawDust(t){dc.clearRect(0,0,W,H);for(var i=0;i<N;i++){var m=MOTES[i];
  var x=((m.x+t*(14+30*m.z)*(i%2?1:-1))%W+W)%W, y=((m.y-t*(10+22*m.z))%H+H)%H;
  var a=.25+.35*Math.sin(t*.9+m.ph); var sz=18*m.s*m.z*1.6; dc.globalAlpha=clamp(a,0,.6)*m.z;dc.drawImage(spr,x-sz/2,y-sz/2,sz,sz);}dc.globalAlpha=1;}

// ---------------- captions (word-highlighted) ----------------
var capEl=document.getElementById('capin'), capKey='';
function drawCaps(t){
  var cur=null;
  for(var i=0;i<S.length&&!cur;i++){var bs=S[i].beats;for(var j=0;j<bs.length;j++){var b=bs[j];if(t>=b.start-.04&&t<=b.end+.28){cur=b;break;}}}
  var box=document.getElementById('cap');
  if(!cur){box.style.opacity=0;return;}
  var k=cur.start+'';
  if(k!==capKey){capKey=k;capEl.innerHTML=cur.words.map(function(w,i){return '<span class="w" data-i="'+i+'">'+w.w+'</span>';}).join(' ');}
  var kids=capEl.children;for(var q=0;q<kids.length;q++){var w=cur.words[q];kids[q].className='w'+((t>=w.s&&t<w.e+.06)?' on':(t>=w.s?' ':'')); kids[q].style.opacity=t>=w.s-.35?1:.55;}
  var a=Math.min(sm((t-(cur.start-.04))/.12),1-sm((t-(cur.end+.1))/.18));
  box.style.opacity=a;capEl.style.transform='translateY('+(10*(1-a))+'px)';
}

// ---------------- main seek ----------------
var started=false, flashEl=document.getElementById('flash'), leakEl=document.getElementById('leak');
function seek(t){
  var i=sceneAt(t), sc=S[i], nx=S[i+1];
  var tw=nx?clamp((t-(sc.end-TR))/TR,0,1):0, m=sm(tw);
  var cA=cam(sc,i,t);
  bindShot(sc.shot,'A');
  gl.uniform3f(U.camA,cA[0],cA[1],cA[2]);
  if(nx&&tw>0){bindShot(nx.shot,'B');var cB=cam(nx,i+1,nx.start+(t-(sc.end-TR))*0.0+0);gl.uniform3f(U.camB,cB[0],cB[1],cB[2]);}
  else{bindShot(sc.shot,'B');gl.uniform3f(U.camB,cA[0],cA[1],cA[2]);}
  gl.uniform1f(U.uMix,nx?m:0);
  var whip=nx&&tw>0&&tw<1?Math.sin(tw*Math.PI)*(.05+.03*(sc.hard?1:0)):0;
  gl.uniform1f(U.uWhip,whip);
  var dirx=(i%2?-1:1); gl.uniform2f(U.uWdir,dirx,.0);
  gl.uniform1f(U.uPar,.05); gl.uniform1f(U.uTime,t); gl.uniform1f(U.uDim,sc.dim||.64);
  var fl=(nx&&tw>0&&tw<1)?Math.sin(tw*Math.PI)*.10:0; gl.uniform1f(U.uFlash,fl);
  // glitch split at the start of scenes flagged glitch
  var sp=sc.glitch&&t<sc.start+.5?(.012*(1-(t-sc.start)/.5)*(Math.sin(t*90)>0?1:-1)):0; gl.uniform1f(U.uSplit,Math.abs(sp));
  gl.uniform1f(U.uPulse,0);
  gl.viewport(0,0,W,H);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  leakEl.style.opacity=.55+.25*Math.sin(t*.35);
  drawDust(t);
  window.COMPS.update(t,sc,i);
  drawCaps(t);
}

// ---------------- boot ----------------
var shots={};S.forEach(function(s){shots[s.shot]=1;});
var ids=Object.keys(shots);
Promise.all(ids.map(function(id){return Promise.all([loadImg('shots/'+id+'.jpg'),loadImg('depth/'+id+'.png')]).then(function(r){SH[id]={c:mkTex(r[0],0),d:mkTex(r[1],1)};});}))
.then(function(){return document.fonts.ready;})
.then(function(){
  window.COMPS.build(document.getElementById('fx'));
  window.__reelDurationSec=D.total;
  window.__seek=function(t){seek(t);};
  seek(0);
}).catch(function(e){document.title='ERR '+e.message;console.error(e);});
})();
