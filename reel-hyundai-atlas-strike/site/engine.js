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
  if(k!==capKey){capKey=k;capEl.innerHTML=cur.words.map(function(w,i){return '<span class="w">'+w.w+'</span>';}).join(' ');}
  var kids=capEl.children;for(var q=0;q<kids.length;q++){var w=cur.words[q];kids[q].className='w'+((t>=w.s&&t<w.e+.06)?' on':'');kids[q].style.opacity=t>=w.s-.35?1:.5;}
  var a=Math.min(sm((t-(cur.start-.04))/.12),1-sm((t-(cur.end+.12))/.18));
  capBox.style.opacity=a;capEl.style.transform='translateY('+(10*(1-a))+'px)';
}
var sweepEl=document.getElementById('sweep'),g1=document.getElementById('grid'),g2=document.getElementById('grid2');
function seek(t){
  var i=sceneAt(t),sc=S[i];
  // cobalt page-turn sweep at each scene start (not the first)
  var u=(t-sc.start)/.42, x=-100;
  if(i>0&&u>=0&&u<1){x=u<.5?lerp(-100,0,sm(u*2)):lerp(0,100,sm((u-.5)*2));}
  sweepEl.style.transform='translateX('+x+'%)';
  g1.style.transform='translate('+(-(t*7)%54)+'px,'+(-(t*4)%54)+'px)';
  g2.style.transform='translate('+(-(t*7)%270)+'px,'+(-(t*4)%270)+'px)';
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
