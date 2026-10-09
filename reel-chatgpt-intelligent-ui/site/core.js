// Shared helpers for the "Widget Toybox" reel. Everything is a pure function of t.
(function(){
'use strict';
var K=window.K={};
K.clamp=function(v,a,b){return Math.max(a,Math.min(b,v));};
K.lerp=function(a,b,u){return a+(b-a)*u;};
K.sm=function(x){x=K.clamp(x,0,1);return x*x*(3-2*x);};
K.eo=function(x){x=K.clamp(x,0,1);return 1-Math.pow(1-x,3);};
K.eo5=function(x){x=K.clamp(x,0,1);return 1-Math.pow(1-x,5);};
K.eb=function(x){x=K.clamp(x,0,1);var c=1.5;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
K.hash=function(n){var x=Math.sin(n*91.7+13.1)*43758.5453;return x-Math.floor(x);};
K.el=function(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;};
// keyframe interpolation: keys=[[t,v],...] smoothstep between keys
K.kf=function(keys,t){if(t<=keys[0][0])return keys[0][1];for(var i=1;i<keys.length;i++){if(t<keys[i][0]){var a=keys[i-1],b=keys[i],u=K.sm((t-a[0])/(b[0]-a[0]));return a[1]+(b[1]-a[1])*u;}}return keys[keys.length-1][1];};
// entrance: opacity + translate + rotate + overshoot scale, from t0
K.en=function(e,t,t0,o){o=o||{};var u=(t-t0)/(o.d||.5);if(u<=0){e.style.opacity=0;e.style.visibility='hidden';return 0;}
  var clamp=K.clamp,eb=K.eb,p=o.lin?clamp(u,0,1):eb(u),q=clamp(p,0,1.25),s0=o.s0==null?.7:o.s0,sc=s0+(1-s0)*q,r=(o.r||0)+(o.rf==null?0:o.rf)*(1-q);
  e.style.visibility='visible';e.style.opacity=clamp(u*6,0,1).toFixed(3);
  e.style.transform='translate('+((o.dx||0)*(1-q)).toFixed(1)+'px,'+((o.dy==null?30:o.dy)*(1-q)).toFixed(1)+'px) rotate('+r.toFixed(2)+'deg) scale('+sc.toFixed(3)+')';return clamp(u,0,1);};
K.skel=function(st,sty,lab){var d=K.el('div','',(lab?'<div class="mono" style="position:absolute;left:20px;top:16px;color:#8b95b8">'+lab+'</div>':'')+'<div class="sk" style="left:20px;top:64px;width:60%"></div><div class="sk" style="left:20px;top:96px;width:44%"></div><div class="sk" style="left:20px;top:128px;width:52%"></div>','border:4px dashed #aab6dc;border-radius:30px;background:rgba(255,255,255,.5);position:absolute;'+sty);st.appendChild(d);d.__sk=[].slice.call(d.querySelectorAll('.sk'));return d;};
K.shimmer=function(d,t){d.__sk.forEach(function(s,i){s.style.setProperty('--sx',(((t*160+i*50)%360)-60)+'px');});};
K.stat=function(sk,real,t,t0,o){var u=K.sm((t-t0+.05)/.2);sk.style.opacity=(1-u).toFixed(2);sk.style.visibility=u>=1?'hidden':'visible';return K.en(real,t,t0,o||{dy:40,d:.5,s0:.6});};
})();
