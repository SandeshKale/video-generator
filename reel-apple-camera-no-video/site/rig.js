// One rig, two skins. Poses come from CMU mocap tracks (mocap.js) sampled as a pure function of time.
(function(){
'use strict';
var M=window.MOCAP,KEYS=null;
var INK='#101426',PINK='#ff3d7f',YEL='#ffd23f',SKY='#3aa8ff';
function idx(clip){var c=M[clip];if(!c.ix){c.ix={};c.joints.forEach(function(k,i){c.ix[k]=i;});}return c.ix;}
// sample clip at time s (seconds from clip start). opts: loop (wrap with travel carried), inplace (subtract hip x)
function sample(clip,s,o){
  o=o||{};var c=M[clip],n=c.n,ix=idx(clip),dur=(n-1)/c.fps,off=0;
  if(o.loop){var cyc=Math.floor(s/dur);s=Math.max(0,s-cyc*dur);var tx=c.f[n-1][ix.hip*3]-c.f[0][ix.hip*3];off=cyc*tx;}
  else s=Math.max(0,Math.min(dur,s));
  var f=s*c.fps,i=Math.min(n-2,Math.floor(f)),u=f-i,A=c.f[i],B=c.f[i+1],P={};
  c.joints.forEach(function(k,j){P[k]=[A[j*3]+(B[j*3]-A[j*3])*u+off,A[j*3+1]+(B[j*3+1]-A[j*3+1])*u,A[j*3+2]+(B[j*3+2]-A[j*3+2])*u];});
  if(o.inplace){var hx=P.hip[0];for(var k in P)P[k][0]-=hx;}
  return P;
}
function dur(clip){var c=M[clip];return (c.n-1)/c.fps;}
function ln(a,b,w,c,extra){return '<line x1="'+a[0].toFixed(1)+'" y1="'+(-a[1]).toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+(-b[1]).toFixed(1)+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"'+(extra||'')+'/>';}
function dot(p,r,f,s,sw){return '<circle cx="'+p[0].toFixed(1)+'" cy="'+(-p[1]).toFixed(1)+'" r="'+r+'" fill="'+f+'" stroke="'+(s||'none')+'" stroke-width="'+(sw||0)+'"/>';}
// skins: human (mocap suit w/ markers) | robot (steel + yellow actuators) | ghost (outline only, for onion skins)

// Rhubarb mouth shapes (A closed, B teeth, C open, D wide, E rounded, F pucker, G f/v, H l, X rest)
function mouth(v,cx,cy,k){var ink='#2a2438',tg='#e2674a',w='#fff';
  switch(v){
   case 'A':return '<path d="M'+(cx-12*k)+' '+cy+' Q'+cx+' '+(cy+2*k)+' '+(cx+12*k)+' '+cy+'" stroke="'+ink+'" stroke-width="'+4*k+'" fill="none" stroke-linecap="round"/>';
   case 'B':return '<rect x="'+(cx-14*k)+'" y="'+(cy-5*k)+'" width="'+28*k+'" height="'+10*k+'" rx="'+4*k+'" fill="'+ink+'"/><rect x="'+(cx-12*k)+'" y="'+(cy-4*k)+'" width="'+24*k+'" height="'+4*k+'" rx="'+2*k+'" fill="'+w+'"/>';
   case 'C':return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+13*k+'" ry="'+9*k+'" fill="'+ink+'"/><ellipse cx="'+cx+'" cy="'+(cy+4*k)+'" rx="'+8*k+'" ry="'+4*k+'" fill="'+tg+'"/>';
   case 'D':return '<ellipse cx="'+cx+'" cy="'+(cy+2*k)+'" rx="'+15*k+'" ry="'+14*k+'" fill="'+ink+'"/><ellipse cx="'+cx+'" cy="'+(cy+8*k)+'" rx="'+9*k+'" ry="'+5*k+'" fill="'+tg+'"/>';
   case 'E':return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+9*k+'" ry="'+9*k+'" fill="'+ink+'"/><ellipse cx="'+cx+'" cy="'+(cy+3*k)+'" rx="'+5*k+'" ry="'+3*k+'" fill="'+tg+'"/>';
   case 'F':return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+6*k+'" ry="'+6*k+'" fill="'+ink+'"/>';
   case 'G':return '<path d="M'+(cx-13*k)+' '+(cy-3*k)+' Q'+cx+' '+(cy+10*k)+' '+(cx+13*k)+' '+(cy-3*k)+' Z" fill="'+ink+'"/><rect x="'+(cx-10*k)+'" y="'+(cy-3*k)+'" width="'+20*k+'" height="'+4*k+'" rx="'+2*k+'" fill="'+w+'"/>';
   case 'H':return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+12*k+'" ry="'+7*k+'" fill="'+ink+'"/><ellipse cx="'+cx+'" cy="'+(cy-1*k)+'" rx="'+6*k+'" ry="'+3.5*k+'" fill="'+tg+'"/>';
   default:return '<path d="M'+(cx-11*k)+' '+(cy-1*k)+' Q'+cx+' '+(cy+6*k)+' '+(cx+11*k)+' '+(cy-1*k)+'" stroke="'+ink+'" stroke-width="'+4*k+'" fill="none" stroke-linecap="round"/>';
  }}
function hostHead(P,o,ang){var h=P.head,cx=h[0],cy=-h[1],R=44,skin='#ffd9b5',hair='#2a2438',k=1.25;
  var blink=o.blink?1:0,ey=cy-6,ex=15;
  var eyes=blink?'<path d="M'+(cx-ex-7)+' '+ey+' h14 M'+(cx+ex-7)+' '+ey+' h14" stroke="'+hair+'" stroke-width="4" stroke-linecap="round"/>':'<circle cx="'+(cx-ex)+'" cy="'+ey+'" r="6.5" fill="'+hair+'"/><circle cx="'+(cx+ex)+'" cy="'+ey+'" r="6.5" fill="'+hair+'"/><circle cx="'+(cx-ex+2)+'" cy="'+(ey-2)+'" r="2" fill="#fff"/><circle cx="'+(cx+ex+2)+'" cy="'+(ey-2)+'" r="2" fill="#fff"/>';
  return '<g transform="rotate('+ang+' '+cx.toFixed(1)+' '+cy.toFixed(1)+')"><circle cx="'+cx.toFixed(1)+'" cy="'+(cy-2).toFixed(1)+'" r="'+(R+4)+'" fill="'+hair+'"/><circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+R+'" fill="'+skin+'"/><path d="M'+(cx-R)+' '+(cy-8)+' Q'+cx+' '+(cy-R-22)+' '+(cx+R)+' '+(cy-8)+' Q'+cx+' '+(cy-R+2)+' '+(cx-R)+' '+(cy-8)+'" fill="'+hair+'"/><circle cx="'+(cx-R+6)+'" cy="'+(cy+10)+'" r="7" fill="#ffb98f" opacity=".6"/><circle cx="'+(cx+R-6)+'" cy="'+(cy+10)+'" r="7" fill="#ffb98f" opacity=".6"/>'+eyes+mouth(o.vis||'X',cx,cy+22,k*.9)+'</g>';}
function svg(P,skin,o){
  o=o||{};var human=skin==='human'||skin==='host',ghost=skin==='ghost',host=skin==='host';
  var body=host?'#1f8a8a':human?INK:ghost?'none':'#c9d2da',back=host?'#16706f':human?'#2a3050':'#9aa6b1',edge=host?'#16706f':human?INK:'#6d7a87';
  var tint=o.tint;if(tint){body=tint;back=tint;}
  var wA=human?22:20,wL=human?28:26,wT=human?54:50;
  var limbs=function(pairs,w,c){return pairs.map(function(q){return ln(P[q[0]],P[q[1]],w,c);}).join('');};
  var legL=[['hip','kL'],['kL','fL']],legR=[['hip','kR'],['kR','fR']],armL=[['sL','eL'],['eL','hL']],armR=[['sR','eR'],['eR','hR']];
  // depth: smaller z (farther) first
  var zl=(P.kL[2]+P.fL[2])/2,zr=(P.kR[2]+P.fR[2])/2,za=(P.eL[2]+P.hL[2])/2,zb=(P.eR[2]+P.hR[2])/2;
  var farLeg=zl<=zr?legL:legR,nearLeg=zl<=zr?legR:legL,farArm=za<=zb?armL:armR,nearArm=za<=zb?armR:armL;
  var s='';
  if(ghost){var gc=o.stroke||PINK,gw=o.sw||4;
    var all=[].concat(legL,legR,armL,armR,[['hip','neck'],['sL','sR']]);
    return all.map(function(q){return ln(P[q[0]],P[q[1]],gw,gc);}).join('')+'<circle cx="'+P.head[0].toFixed(1)+'" cy="'+(-P.head[1]).toFixed(1)+'" r="30" fill="none" stroke="'+gc+'" stroke-width="'+gw+'"/>';}
  s+=limbs(farArm,wA,back)+limbs(farLeg,wL-2,back);
  // feet
  var foot=function(f,t){return ln(P[f],P[t],human?18:20,body);};
  s+=foot('fL','tL')+foot('fR','tR');
  s+=ln(P.neck,P.hip,wT,body)+ln(P.sL,P.sR,human?28:26,body);
  if(!human)s+=ln(P.neck,P.hip,wT-26,'#aeb9c3')+'<rect x="'+(P.hip[0]-10).toFixed(1)+'" y="'+(-P.hip[1]-6).toFixed(1)+'" width="20" height="12" rx="3" fill="'+INK+'" opacity=".35" transform="rotate('+(Math.atan2(P.neck[1]-P.hip[1],P.neck[0]-P.hip[0])*-180/Math.PI+90).toFixed(1)+' '+P.hip[0].toFixed(1)+' '+(-P.hip[1]).toFixed(1)+')"/>';
  s+=limbs(nearLeg,wL,body)+limbs(nearArm,wA+2,body);
  var jn=['sL','sR','eL','eR','hL','hR','hip','kL','kR','fL','fR'];
  if(human){jn.forEach(function(j){s+=dot(P[j],j==='hip'?9:6,j==='hip'?PINK:'#fff',INK,2);});}
  else{jn.forEach(function(j){s+=dot(P[j],10,YEL,edge,3);});}
  // head
  var h=P.head,hx=h[0].toFixed(1),hy=(-h[1]).toFixed(1),ang=(Math.atan2(h[1]-P.neck[1],h[0]-P.neck[0])*-180/Math.PI+90).toFixed(1);
  if(host)s+=hostHead(P,o,ang);else if(human)s+='<g transform="rotate('+ang+' '+hx+' '+hy+')"><circle cx="'+hx+'" cy="'+hy+'" r="32" fill="'+INK+'" stroke="#fff" stroke-width="5"/><circle cx="'+(h[0]+14).toFixed(1)+'" cy="'+(-h[1]-6).toFixed(1)+'" r="6" fill="#fff"/></g>';
  else s+='<g transform="rotate('+ang+' '+hx+' '+hy+')"><rect x="'+(h[0]-34).toFixed(1)+'" y="'+(-h[1]-28).toFixed(1)+'" width="68" height="56" rx="20" fill="#e3e8ec" stroke="'+edge+'" stroke-width="4"/><rect x="'+(h[0]-24+6).toFixed(1)+'" y="'+(-h[1]-10).toFixed(1)+'" width="48" height="18" rx="9" fill="'+INK+'"/><rect x="'+(h[0]-12+10).toFixed(1)+'" y="'+(-h[1]-5).toFixed(1)+'" width="22" height="8" rx="4" fill="'+SKY+'"/></g>';
  return s;
}
window.RIG={sample:sample,svg:svg,dur:dur};
})();
(function(){
var M=window.MOCAP;
window.RIG.speed=function(clip){var c=M[clip],ix=window.RIG._ix(clip);return (c.f[c.n-1][ix.hip*3]-c.f[0][ix.hip*3])/((c.n-1)/c.fps);};
window.RIG._ix=function(clip){var c=M[clip];if(!c.ix){c.ix={};c.joints.forEach(function(k,i){c.ix[k]=i;});}return c.ix;};
// mean in-place pose of a clip (for the "stiff controller" look: damp motion toward the mean)
var means={};
window.RIG.mean=function(clip){if(means[clip])return means[clip];var c=M[clip],ix=window.RIG._ix(clip),m={};c.joints.forEach(function(k,j){var sx=0,sy=0,sz=0;for(var i=0;i<c.n;i++){sx+=c.f[i][j*3]-c.f[i][ix.hip*3];sy+=c.f[i][j*3+1];sz+=c.f[i][j*3+2];}m[k]=[sx/c.n,sy/c.n,sz/c.n];});return means[clip]=m;};
window.RIG.damp=function(P,clip,a){var m=window.RIG.mean(clip),hx=P.hip[0],o={};for(var k in P)o[k]=[m[k][0]+(P[k][0]-hx-m[k][0])*a+hx,m[k][1]+(P[k][1]-m[k][1])*a,P[k][2]];return o;};
window.RIG.lerpP=function(A,B,u){var o={};for(var k in A)o[k]=[A[k][0]+(B[k][0]-A[k][0])*u,A[k][1]+(B[k][1]-A[k][1])*u,A[k][2]+(B[k][2]-A[k][2])*u];return o;};
window.RIG.shift=function(P,dx,dy){var o={};for(var k in P)o[k]=[P[k][0]+dx,P[k][1]+dy,P[k][2]];return o;};
// rotate whole pose about a point (world coords, y up) by deg (counter-clockwise)
window.RIG.rotate=function(P,cx,cy,deg){var a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a),o={};for(var k in P){var x=P[k][0]-cx,y=P[k][1]-cy;o[k]=[cx+x*c-y*s,cy+x*s+y*c,P[k][2]];}return o;};
})();
