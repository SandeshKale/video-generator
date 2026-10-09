// Scene engine: pages, headline words, wireframe-to-filled background, Cursor mascot, captions, seek(). Pure function of t.
(function(){
'use strict';
var K=window.K,D=window.DATA,S=D.scenes,clamp=K.clamp,lerp=K.lerp,eb=K.eb,sm=K.sm,el=K.el;
var SX=150,SY=452; // stage origin in page px
window.SCN=window.SCN||[];
// ---------- helpers exposed to scenes ----------
function wordT(si,key,nth){var ws=[];S[si].beats.forEach(function(b){ws=ws.concat(b.words);});var n=0;key=key.toLowerCase();
  for(var i=0;i<ws.length;i++){if(ws[i].w.toLowerCase().indexOf(key)>=0){if(n===(nth||0))return ws[i].s;n++;}}throw new Error('word '+key+' not in scene '+si);}
// ---------- background: wireframe boxes that fill with colour as the story progresses ----------
var bg=document.getElementById('bg'),COL=['#b9c7ff','#ffcf9f','#fff0a0'];
var BOX=[[40,60,300,250,0],[390,10,260,150,0],[740,80,300,300,0],[-80,470,210,270,1],[900,420,220,260,2],[-70,830,230,200,3],[900,1010,220,200,4],[40,1500,300,280,5],[400,1590,270,300,6],[760,1500,300,320,7],[20,1060,200,300,0],[840,1600,230,200,8]];
var boxes=BOX.map(function(b,i){var d=el('div','wf','','left:'+b[0]+'px;top:'+b[1]+'px;width:'+b[2]+'px;height:'+b[3]+'px');
  for(var k=0;k<4;k++){var s=el('i','','','top:'+(26+k*34)+'px;width:'+(40+((k*37+i*11)%50))+'%');d.appendChild(s);}
  var f=el('div','','','position:absolute;inset:-3px;border-radius:26px;border:3px solid #14182b;background:'+COL[i%3]+';opacity:0;box-shadow:6px 6px 0 #14182b');d.appendChild(f);bg.appendChild(d);return {d:d,f:f,x:b[0],y:b[1],at:b[4],ph:i*1.7};});
function drawBg(t,si){boxes.forEach(function(b,i){var u=b.at?sm((t-S[Math.min(b.at,S.length-1)].start)/.7):0;
  b.f.style.opacity=(u*(b.at?1:0)).toFixed(3);b.d.style.transform='translateY('+(Math.sin(t*.8+b.ph)*7).toFixed(1)+'px)';});}
// ---------- Cursor mascot (arrow with googly eyes) ----------
var cur=document.getElementById('cur'),rip=document.getElementById('rip'),CS=.9;
function curSvg(look,mouth,sq){var lx=look[0]*5,ly=look[1]*5,m=mouth===1?'<ellipse cx="64" cy="102" rx="12" ry="10" fill="#14182b"/>':mouth===2?'<path d="M44 100 L84 100" stroke="#14182b" stroke-width="6" stroke-linecap="round"/>':'<path d="M44 98 Q62 114 84 96" fill="none" stroke="#14182b" stroke-width="5" stroke-linecap="round"/>';
  var eh=mouth===2?.45:1;return '<path d="M18 12 L18 150 L52 118 L78 176 L108 163 L82 106 L128 106 Z" fill="#fff" stroke="#14182b" stroke-width="7" stroke-linejoin="round"/>'+
  '<ellipse cx="48" cy="62" rx="17" ry="'+(17*eh)+'" fill="#fff" stroke="#14182b" stroke-width="5"/><ellipse cx="82" cy="70" rx="15" ry="'+(15*eh)+'" fill="#fff" stroke="#14182b" stroke-width="5"/>'+
  '<circle cx="'+(48+lx)+'" cy="'+(62+ly*eh)+'" r="7" fill="#14182b"/><circle cx="'+(82+lx*.9)+'" cy="'+(70+ly*eh)+'" r="6" fill="#14182b"/>'+m;}
var curKey='';
function drawCursor(t,lt,C){ // C = scene cursor keys [[lt,x,y,rot,mouth,lx,ly,tap],...] stage-local
  if(!C||!C.length||lt<C[0][0]-.35){cur.style.display='none';rip.innerHTML='';return;}
  var ch=function(i){return C.map(function(k){return [k[0],k[i]];});};
  var enter=sm((lt-(C[0][0]-.35))/.35),x=K.kf(ch(1),lt),y=K.kf(ch(2),lt),r=K.kf(ch(3),lt),lx=K.kf(ch(5),lt),ly=K.kf(ch(6),lt),mo=0,tap=0,rr='';
  for(var i=0;i<C.length;i++){if(C[i][0]<=lt)mo=C[i][4];if(C[i][7]&&lt-C[i][0]>=0&&lt-C[i][0]<.45){tap=Math.max(tap,1-(lt-C[i][0])/.45);var u=(lt-C[i][0])/.45;rr+='<i style="left:'+(SX+C[i][1]+14)+'px;top:'+(SY+C[i][2]+8)+'px;transform:scale('+(1+u*5).toFixed(2)+');opacity:'+(1-u).toFixed(2)+'"></i>';}}
  y+=Math.sin(t*3.1)*3;var sc=CS*(1-.1*tap)*(.6+.4*enter);cur.style.display='block';cur.style.opacity=enter.toFixed(2);
  cur.style.left=(SX+x-18*sc)+'px';cur.style.top=(SY+y-12*sc)+'px';cur.style.transformOrigin=(18*sc)+'px '+(12*sc)+'px';cur.style.transform='rotate('+r.toFixed(1)+'deg) scale('+(sc/CS).toFixed(3)+')';
  var key=mo+'|'+lx.toFixed(1)+'|'+ly.toFixed(1);if(key!==curKey){curKey=key;cur.innerHTML=curSvg([lx,ly],mo);}
  if(rip.__s!==rr){rip.__s=rr;rip.innerHTML=rr;}}
// ---------- captions ----------
var cap=document.getElementById('cap'),capin=document.getElementById('capin'),capSig='';
var CAPS=[];S.forEach(function(s){s.caps.forEach(function(c){CAPS.push(c);});});
function drawCaps(t){var c=null;for(var i=0;i<CAPS.length;i++){if(t>=CAPS[i].start-.05&&t<CAPS[i].end+.25){c=CAPS[i];}}
  if(!c){cap.style.display='none';return;}cap.style.display='block';var sig=CAPS.indexOf(c)+'';
  if(sig!==capSig){capSig=sig;capin.innerHTML=c.words.map(function(w){return '<span>'+w.w+'</span>';}).join('');}
  var sp=capin.children;for(var j=0;j<sp.length;j++){var w=c.words[j];sp[j].className=(t>=w.s&&t<w.e+.05)?'on':'';}}
// ---------- pages ----------
var pg=document.getElementById('pg'),built=[];
S.forEach(function(sc,si){var def=window.SCN[si];var p=el('div','pg');p.id='p'+si;pg.appendChild(p);
  var eye=el('div','eb','<b></b><span></span>');p.appendChild(eye);var esp=eye.lastChild;
  var h=el('div','h');p.appendChild(h);var hw=[];
  def.h.forEach(function(line,li){var L=el('div','l');h.appendChild(L);line.forEach(function(w,wi){var o=typeof w==='string'?{t:w}:w;var s=el('span','w'+(o.hl?' hl':''),o.t);L.appendChild(s);hw.push(s);});});
  var st=el('div','stage');p.appendChild(st);
  var ctx={si:si,st:st,p:p,W:function(k,n){return wordT(si,k,n);},sc:sc,cursor:null};
  var api=def.build(ctx);
  built.push({p:p,esp:esp,hw:hw,def:def,api:api,ctx:ctx,start:sc.start});});
document.getElementById('note').textContent='Illustration · not OpenAI’s actual interface';
function seek(t){var si=0;for(var i=0;i<S.length;i++){if(t>=S[i].start)si=i;}
  built.forEach(function(b,i){b.p.style.display=i===si?'block':'none';});
  var b=built[si],lt=t-b.start,u=lt/.25;b.p.style.transform=si===0?'none':'translateY('+((1-K.eo5(u))*34).toFixed(1)+'px)';b.p.style.opacity=si===0?1:clamp(u*3,0,1);
  var nE=Math.floor(clamp((lt+(si===0?.6:0)+.02)/.35,0,1)*b.def.eb.length);b.esp.textContent=b.def.eb.slice(0,nE);
  b.hw.forEach(function(w,i){var uu=(lt+(si===0?.5:0)-.04*i)/.32;w.style.opacity=clamp(uu*4,0,1);w.style.transform='translateY('+((1-eb(uu))*40).toFixed(1)+'px)';});
  b.api.upd(t,lt);drawBg(t,si);drawCursor(t,lt,b.ctx.cursor);drawCaps(t);
  document.getElementById('note').style.display=(si===S.length-1&&lt>5.6)?'none':'block';}
window.__reelDurationSec=D.total;window.__seek=seek;
function boot(){document.fonts.ready.then(function(){return Promise.all([document.fonts.load('700 100px FR'),document.fonts.load('700 30px FR'),document.fonts.load('600 30px IN'),document.fonts.load('500 30px DM'),new Promise(function(r){var i=new Image();i.onload=i.onerror=r;i.src='profile.jpg';})]);}).then(function(){seek(0);window.__ready=true;}).catch(function(e){document.title='ERR '+e.message;});}
window.addEventListener('load',boot);
})();
