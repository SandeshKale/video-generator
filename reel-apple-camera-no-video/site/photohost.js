// Animated, lip-synced profile photo ("photo puppet"): Rhubarb cues -> jaw drop + painted mouth interior over the real photo.
// Pure function of t. Source-photo coordinates are for site/profile.jpg (1408x1408).
(function(){
'use strict';
var K=window.K;
var MX=730,MY=797,MW=105; // mouth centre x, lip line y, half width (source px)
var SHAPES={ // d: jaw drop px, w: cavity width factor, teeth 0..1, tongue 0..1
  X:{d:0,w:1,t:0,g:0},A:{d:0,w:1,t:0,g:0},B:{d:9,w:1,t:.9,g:0},C:{d:24,w:.95,t:.7,g:.5},D:{d:42,w:1,t:.55,g:.8},
  E:{d:20,w:.72,t:.4,g:.3},F:{d:14,w:.5,t:0,g:0},G:{d:8,w:1,t:1,g:0},H:{d:18,w:.9,t:.5,g:1}};
function sm(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
function mix(a,b,u){return a+(b-a)*u;}
function paramsAt(t){var M=window.MOUTH,lo=0,hi=M.length-1,i=0;while(lo<=hi){var m=(lo+hi)>>1;if(t<M[m][0])hi=m-1;else if(t>=M[m][1])lo=m+1;else{i=m;break;}if(lo>hi)i=Math.max(0,Math.min(M.length-1,hi));}
  var cur=SHAPES[M[i][2]]||SHAPES.X,prev=SHAPES[(M[i-1]||M[i])[2]]||SHAPES.X,u=sm((t-M[i][0])/.07),o={};
  for(var k in cur)o[k]=mix(prev[k],cur[k],u);return o;}
// crop window (source px) shown in the 270x290 host window
var CX0=250,CY0=170,CW=960,CH=1030,S=270/CW;
var VIS=['X','A','B','C','D','E','F','G','H'],RX=500,RY=720,RW=460,RH=380; // pre-warped mouth region images (tools/mls_visemes.py)
function cueAt(t){var M=window.MOUTH,lo=0,hi=M.length-1,i=0;while(lo<=hi){var m=(lo+hi)>>1;if(t<M[m][0])hi=m-1;else if(t>=M[m][1])lo=m+1;else{i=m;break;}if(lo>hi)i=Math.max(0,Math.min(M.length-1,hi));}
  return {cur:M[i][2],prev:(M[i-1]||M[i])[2],u:sm((t-M[i][0])/.07)};}
function build(win,img){
  var wrap=document.createElement('div');wrap.style.cssText='position:absolute;left:0;top:0;width:270px;height:290px;overflow:hidden;background:#2b1a14';win.insertBefore(wrap,win.firstChild);
  var root=document.createElement('div');root.style.cssText='position:absolute;left:0;top:0;width:1408px;height:1408px;transform-origin:0 0';wrap.appendChild(root);
  var base=document.createElement('div');base.style.cssText='position:absolute;inset:0;background:url('+img+') 0 0/1408px 1408px';root.appendChild(base);
  // mouth region: MLS-warped viseme images, cross-faded; feathered into the base photo
  var mw=document.createElement('div');mw.style.cssText='position:absolute;left:'+RX+'px;top:'+RY+'px;width:'+RW+'px;height:'+RH+'px;-webkit-mask-image:radial-gradient(ellipse 50% 52% at 50% 46%,#000 80%,transparent 100%);mask-image:radial-gradient(ellipse 50% 52% at 50% 46%,#000 80%,transparent 100%)';
  var layers={};VIS.forEach(function(v){var e=document.createElement('img');e.src='vis/v_'+v+'.png';e.style.cssText='position:absolute;left:0;top:0;width:'+RW+'px;height:'+RH+'px;opacity:0';mw.appendChild(e);layers[v]=e;});
  root.appendChild(mw);
  var lids=[[590,554],[840,546]].map(function(p){var e=document.createElement('div');e.style.cssText='position:absolute;left:'+(p[0]-62)+'px;top:'+(p[1]-24)+'px;width:124px;height:48px;opacity:0;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 62%,transparent 100%)';
    var sk=document.createElement('div');sk.style.cssText='position:absolute;inset:0;background:url('+img+') '+(-(p[0]-62))+'px '+(-(p[1]+142))+'px/1408px 1408px;filter:brightness(.97) saturate(1.02)';e.appendChild(sk);
    var ln=document.createElementNS('http://www.w3.org/2000/svg','svg');ln.setAttribute('width',124);ln.setAttribute('height',48);ln.style.cssText='position:absolute;left:0;top:0';ln.innerHTML='<path d="M14 24 Q62 40 110 24" stroke="#241410" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/><path d="M20 22 Q62 32 104 22" stroke="#6a4636" stroke-width="5" fill="none" opacity=".35"/>';e.appendChild(ln);
    root.appendChild(e);return e;});
  return {root:root,layers:layers,lids:lids};
}
function draw(win,t){
  var inst=win.__ph||(win.__ph=build(win,'profile.jpg'));
  var c=cueAt(t);
  VIS.forEach(function(v){inst.layers[v].style.opacity=0;});
  inst.layers[c.prev].style.opacity=1;
  if(c.cur!==c.prev)inst.layers[c.cur].style.opacity=c.u.toFixed(3);
  var bp=(t+1.3)%3.1,bl=bp<.16?Math.min(1,Math.sin(Math.PI*bp/.16)*1.7):0;inst.lids.forEach(function(e){e.style.opacity=bl.toFixed(2);});
  var open=({D:1,C:.6,H:.4,E:.5,B:.2})[c.cur]||0;
  var tilt=Math.sin(t*.9)*1.1+Math.sin(t*.37+1)*.8,bob=-open*2.4+Math.sin(t*1.7)*2,sx=Math.sin(t*.5)*5;
  var cx=CX0+CW/2,cy2=CY0+CH/2;
  inst.root.style.transform='translate('+(135+sx*S).toFixed(2)+'px,'+(145+bob*S).toFixed(2)+'px) scale('+(S*1.06).toFixed(4)+') rotate('+tilt.toFixed(2)+'deg) translate('+(-cx)+'px,'+(-cy2)+'px)';
}
window.PHOTO={draw:draw};
})();
