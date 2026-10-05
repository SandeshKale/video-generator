// Deterministic renderer: every pixel is a pure function of t (window.__seek).
(function(){
'use strict';
var D=window.DATA;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,u){return a+(b-a)*u;}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
window.U={clamp:clamp,lerp:lerp,sm:sm};
var S=D.scenes;
function sceneAt(t){for(var i=0;i<S.length;i++){if(t<S[i].end)return i;}return S.length-1;}
var capEl=document.getElementById('capin'), capKey='', capBox=document.getElementById('cap');
function drawCaps(t){
  var cur=null;
  for(var i=0;i<S.length&&!cur;i++){var bs=S[i].caps||S[i].beats;for(var j=0;j<bs.length;j++){var b=bs[j];if(t>=b.start-.04&&t<=b.end+.3){cur=b;break;}}}
  if(!cur){capBox.style.opacity=0;return;}
  var k=cur.start+'';
  if(k!==capKey){capKey=k;capEl.innerHTML=cur.words.map(function(w){return '<span class="w">'+w.w+'</span>';}).join(' ');}
  var kids=capEl.children;for(var q=0;q<kids.length;q++){var w=cur.words[q];kids[q].className='w'+((t>=w.s&&t<w.e+.06)?' on':'');kids[q].style.opacity=t>=w.s-.35?1:.5;}
  var a=Math.min(sm((t-(cur.start-.04))/.12),1-sm((t-(cur.end+.12))/.18));
  capBox.style.opacity=a;capEl.style.transform='translateY('+(10*(1-a))+'px)';
}
var passEl=document.getElementById('pass'),s1=document.getElementById('stars1'),s2=document.getElementById('stars2'),earth=document.getElementById('earth');
function seek(t){
  var i=sceneAt(t),sc=S[i];
  var u=(t-sc.start)/.5, y=-300;
  if(i>0&&u>=0&&u<1){y=lerp(-300,1920,sm(u));}
  passEl.style.transform='translateY('+y+'px)';
  s1.style.transform='translate('+(-(t*9)%260)+'px,'+((t*5)%230)+'px)';
  s2.style.transform='translate('+(-(t*18)%410)+'px,'+((t*11)%370)+'px)';
  earth.style.top=(1500+Math.sin(t*.35)*10)+'px';
  earth.style.boxShadow='0 -6px 0 2px #ffb3d6,0 -18px 60px 10px rgba(255,61,139,'+(.65+.12*Math.sin(t*1.1))+'),0 -60px 160px 40px rgba(93,255,200,.25)';
  window.COMPS.update(t,sc,i);
  drawCaps(t);
}
function loadImg(src){return new Promise(function(res){var i=new Image();i.onload=function(){res();};i.onerror=function(){res();};i.src=src;});}
function boot(){
  var imgs={};S.forEach(function(sc){(sc.layers||[]).forEach(function(l){if(l.img)imgs[l.img]=1;});});
  Promise.all(Object.keys(imgs).map(function(n){return loadImg('shots/'+n+'.jpg');})).then(function(){return document.fonts.ready;}).then(function(){
    window.COMPS.build(document.getElementById('fx'));
    window.__reelDurationSec=D.total;
    window.__seek=function(t){seek(t);};
    seek(0);
  }).catch(function(e){document.title='ERR '+e.message;});
}
window.addEventListener('load',boot);
})();
