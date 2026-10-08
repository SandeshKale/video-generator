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
  var a=Math.min(cur.start<.15?1:sm((t-(cur.start-.04))/.12),1-sm((t-(cur.end+.12))/.18));
  capBox.style.opacity=a;capEl.style.transform='translateY('+(10*(1-a))+'px)';
}
// dust motes in the lamp cone: slow upward drift, twinkle, all from t
var moteWrap=document.getElementById('motes'),motes=[];
function hash(n){var x=Math.sin(n*91.7+13.1)*43758.5453;return x-Math.floor(x);}
for(var m=0;m<44;m++){var e=document.createElement('i'),sz=2+hash(m*3+3)*4;e.style.width=e.style.height=sz+'px';moteWrap.appendChild(e);motes.push({e:e,x:360+hash(m*3+1)*580,y:160+hash(m*3+2)*1180,sp:6+hash(m+9)*16,ph:hash(m+5)*6.28,s:sz});}
var cone=document.getElementById('cone'),cone2=document.getElementById('cone2'),pane=document.getElementById('pane');
function lamp(t){
  var fl=.93+.05*Math.sin(t*2.1)+.03*Math.sin(t*5.3+1)+.02*Math.sin(t*11.7+2);
  cone.style.opacity=fl;cone2.style.opacity=fl*.9;
  for(var i=0;i<motes.length;i++){var o=motes[i],y=((o.y-t*o.sp)%1180+1180)%1180+160,x=o.x+Math.sin(t*.5+o.ph)*18-(y-160)*.1;
    o.e.style.left=x.toFixed(1)+'px';o.e.style.top=y.toFixed(1)+'px';o.e.style.opacity=(.2+.5*(.5+.5*Math.sin(t*1.3+o.ph))).toFixed(2);}
}
function seek(t){
  var i=sceneAt(t),sc=S[i];
  var u=(t-(sc.start-.1))/.36,x=-1700;
  if(i>0&&sc.start>3&&u>=0&&u<1)x=lerp(-460,1120,u);
  pane.style.transform='translateX('+x+'px)';
  lamp(t);
  window.COMPS.update(t,sc,i);
  drawCaps(t);
}
function loadImg(src){return new Promise(function(res){var i=new Image();i.onload=function(){res();};i.onerror=function(){res();};i.src=src;});}
function boot(){
  loadImg('profile.jpg').then(function(){return Promise.all([document.fonts.load('800 100px SO'),document.fonts.load('700 30px SO'),document.fonts.load('italic 900 40px FR'),document.fonts.load('700 30px IN'),document.fonts.load('500 30px IN'),document.fonts.load('700 30px JB')]);}).then(function(){return document.fonts.ready;}).then(function(){
    window.COMPS.build(document.getElementById('fx'));
    window.__reelDurationSec=D.total;
    window.__seek=function(t){seek(t);};
    seek(0);
  }).catch(function(e){document.title='ERR '+e.message;});
}
window.addEventListener('load',boot);
})();
