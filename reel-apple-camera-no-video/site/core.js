// "Dollhouse Cutaway" shared helpers. Everything is a pure function of t.
(function(){
'use strict';
var K=window.K={};
K.clamp=function(v,a,b){return Math.max(a,Math.min(b,v));};
K.lerp=function(a,b,u){return a+(b-a)*u;};
K.sm=function(x){x=K.clamp(x,0,1);return x*x*(3-2*x);};
K.eo=function(x){x=K.clamp(x,0,1);return 1-Math.pow(1-x,3);};
K.eo5=function(x){x=K.clamp(x,0,1);return 1-Math.pow(1-x,5);};
K.eb=function(x){x=K.clamp(x,0,1);var c=1.4;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
K.hash=function(n){var x=Math.sin(n*91.7+13.1)*43758.5453;return x-Math.floor(x);};
K.el=function(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;};
var NS='http://www.w3.org/2000/svg';
K.Stage=function(parent,x,y,w,h,clipR){var box=K.el('div','','','position:absolute;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;overflow:hidden;'+(clipR?'border-radius:'+clipR+'px':''));var s=document.createElementNS(NS,'svg');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('viewBox','0 0 '+w+' '+h);s.style.cssText='position:absolute;left:0;top:0;overflow:hidden';var g=document.createElementNS(NS,'g');s.appendChild(g);box.appendChild(s);parent.appendChild(box);
  return {box:box,w:w,h:h,draw:function(fig,ox,oy,k,bg){g.innerHTML=(bg||'')+'<g transform="translate('+ox+' '+oy+') scale('+k+')">'+fig+'</g>';}};};
// mouth viseme at time t from Rhubarb cues (binary search)
K.viseme=function(t){var M=window.MOUTH||[];var lo=0,hi=M.length-1;while(lo<=hi){var m=(lo+hi)>>1;if(t<M[m][0])hi=m-1;else if(t>=M[m][1])lo=m+1;else return M[m][2];}return 'X';};
// deterministic blink: ~every 3.1 s, 0.14 s long
K.blink=function(t){var p=(t+1.3)%3.1;return p<.14;};
})();
