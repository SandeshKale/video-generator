// "Retro RTS Console" components — pure functions of absolute time t.
(function(){
'use strict';
var U=window.U, clamp=U.clamp, lerp=U.lerp, sm=U.sm;
function eo(x){x=clamp(x,0,1);return x>=1?1:1-Math.pow(2,-10*x);}
function eb(x){x=clamp(x,0,1);var c=2.0;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
var VIO='#8b5cff',GOLD='#ffc83d',RED='#ff3b4e',ICE='#ece8ff',INK='#0c0a1a',MINT='#5dffc8',MIST='#b79cff';
function C(c){return {vio:VIO,gold:GOLD,red:RED,ice:ICE,mint:MINT,mist:MIST}[c]||c||ICE;}
function rnd(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var NS='http://www.w3.org/2000/svg';
function T0(o,i,L,gap){return o.t!=null?o.t:L.t0+.12+(gap||.2)*i;}
function sprite(col,dark,hi,size){
  var half=['..oooo','.obbbb','obbhhh','obeeeb','obbbbb','.oooob','..obbb','.obbbb','obbooo','obbo..','obbo..','.ooo..'];
  var Cc={o:dark,b:col,h:hi,e:INK},r='';
  half.forEach(function(row,y){for(var x=0;x<6;x++){var c=Cc[row[x]];if(!c)continue;r+='<rect x="'+(x*size)+'" y="'+(y*size)+'" width="'+size+'" height="'+size+'" fill="'+c+'"/><rect x="'+((11-x)*size)+'" y="'+(y*size)+'" width="'+size+'" height="'+size+'" fill="'+c+'"/>';}});
  return '<svg width="'+(12*size)+'" height="'+(12*size)+'" viewBox="0 0 '+(12*size)+' '+(12*size)+'" shape-rendering="crispEdges">'+r+'</svg>';
}
var SP={astra:[VIO,'#3a1f9e','#c7b3ff'],stardust:[GOLD,'#8a5a00','#fff0b3'],claude:[MINT,'#0f6b52','#c8fff0']};
function spr(k,size){var s=SP[k];return sprite(s[0],s[1],s[2],size);}
function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.15,0,1);
  if(k==='none'){a=1;}
  else if(k==='slam'){var p=eo(u/.2);a=clamp(u/.04,0,1);tr='scale('+lerp(1.4,1,p)+')';}
  else if(k==='pop'){var q=eb(u/.3);a=clamp(u/.05,0,1);tr='scale('+lerp(.5,1,q)+')';}
  else if(k==='rise'){var r=eo(u/.35);a=clamp(u/.1,0,1);tr='translateY('+lerp(50,0,r)+'px)';}
  else if(k==='left'){var l=eo(u/.4);a=clamp(u/.1,0,1);tr='translateX('+lerp(-200,0,l)+'px)';}
  else if(k==='right'){var rr=eo(u/.4);a=clamp(u/.1,0,1);tr='translateX('+lerp(200,0,rr)+'px)';}
  else if(k==='drop'){var d=eb(u/.45);a=clamp(u/.06,0,1);tr='translateY('+lerp(-160,0,d)+'px)';}
  else{a=clamp(u/.15,0,1);}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};
// ---- HUD: mission label + pixel progress ----
T.hud=function(L,P){
  var w=L.inner;w.style.cssText='position:absolute;left:0;top:0;width:1080px;height:230px';
  w.appendChild(el('div','','','position:absolute;left:150px;top:140px;font-size:40px;color:'+GOLD+';letter-spacing:2px;white-space:nowrap'));w.firstChild.textContent=P.left;
  var rt=el('div','',P.right||'● REC','position:absolute;right:162px;top:140px;font-size:40px;color:'+RED+';letter-spacing:2px;white-space:nowrap');w.appendChild(rt);
  var bar=el('div','','','position:absolute;left:150px;right:162px;top:192px;height:18px;border:3px solid '+ICE+';background:'+INK);var fill=el('div','','','position:absolute;left:0;top:0;bottom:0;background:repeating-linear-gradient(90deg,'+VIO+' 0 14px,'+INK+' 14px 17px)');bar.appendChild(fill);w.appendChild(bar);
  return function(t){fill.style.width=(100*clamp(t/window.DATA.total,0,1))+'%';rt.style.opacity=(Math.floor(t*2)%2)?.45:1;};
};
T.eyebrow=function(L,P){var d=el('div','',P.txt,'font-size:40px;color:'+C(P.c||'gold')+';letter-spacing:2px;white-space:nowrap');L.inner.appendChild(d);return function(t){var n=Math.floor(clamp((t-L.t0)/.45,0,1)*P.txt.length);d.textContent=P.txt.slice(0,n)+(Math.floor(t*3)%2?'_':'');};};
T.head=function(L,P){
  var ls=P.lines.map(function(ln){var d=el('div','ps',ln.txt,'font-size:'+(ln.size||56)+'px;color:'+C(ln.c||'ice')+';white-space:nowrap;text-shadow:5px 5px 0 #05030f;'+(ln.mt?'margin-top:'+ln.mt+'px;':''));L.inner.appendChild(d);return {d:d,ln:ln};});
  return function(t){ls.forEach(function(o){var t0=o.ln.t!=null?o.ln.t:L.t0,u=t-t0,p=eo(u/.25);o.d.style.opacity=clamp(u/.05,0,1);o.d.style.transform='translateX('+lerp(-40,0,p)+'px)';});};
};
// ---- stamp with shake/glitch ----
T.stamp=function(L,P){
  var s=el('div','stamp','','font-size:'+(P.size||100)+'px;transform:rotate('+(P.rot||-4)+'deg);'+(P.c?'border-color:'+C(P.c)+';color:'+C(P.c)+';':''));s.innerHTML=P.lines.join('<br>');L.inner.appendChild(s);
  var ghost=el('div','stamp','','position:absolute;left:0;top:0;opacity:0;font-size:'+(P.size||100)+'px;color:'+MINT+';border-color:'+MINT+';background:transparent;mix-blend-mode:screen;transform:rotate('+(P.rot||-4)+'deg)');ghost.innerHTML=P.lines.join('<br>');L.inner.appendChild(ghost);
  return function(t){var u=t-L.t0;var q=Math.floor(t*20);var sh=P.shake?(u<.5?3:1.2):0;var dx=sh*(rnd(q)-.5)*2,dy=sh*(rnd(q+9)-.5)*2;var gl=u<.4||(Math.floor(t*3)%7===0&&rnd(q)>.6);
    s.style.transform='translate('+dx+'px,'+dy+'px) rotate('+(P.rot||-4)+'deg) scale('+(1+(u<.2?.12*(1-u/.2):0))+')';ghost.style.opacity=gl?.55:0;ghost.style.transform='translate('+(-8+dx)+'px,'+(4+dy)+'px) rotate('+(P.rot||-4)+'deg)';};
};
// ---- arena: two bots, VS, HP bars, optional slot swap ----
T.arena=function(L,P){
  var b=el('div','panel'+(P.k?' '+P.k:''),'','width:'+P.w+'px;height:'+P.h+'px');
  b.appendChild(el('div','ps',P.l.name,'position:absolute;left:24px;top:20px;font-size:20px;color:'+MIST));var rn=el('div','ps',P.r.name,'position:absolute;right:24px;top:20px;font-size:20px;color:'+GOLD);b.appendChild(rn);
  var sz=P.size||20,sw=12*sz;var ls=el('div','','','position:absolute;left:24px;top:'+(P.spy||90)+'px');ls.innerHTML=spr(P.l.sp,sz);b.appendChild(ls);
  var lsB=el('div','','','position:absolute;left:24px;top:'+(P.spy||90)+'px;opacity:0');lsB.innerHTML=spr('stardust',sz);b.appendChild(lsB);
  var rs=el('div','','','position:absolute;right:24px;top:'+(P.spy||90)+'px');rs.innerHTML=spr(P.r.sp,sz);b.appendChild(rs);
  var vs=el('div','ps','VS','position:absolute;left:'+(P.w/2-44)+'px;top:'+((P.spy||90)+sw/2-30)+'px;font-size:34px;color:'+RED+';background:'+INK+';border:4px solid '+RED+';padding:12px 10px;z-index:3');b.appendChild(vs);
  var hl=el('div','hp','','position:absolute;left:24px;width:'+(P.w/2-60)+'px;bottom:24px');var hli=el('i','','','background:'+MIST);hl.appendChild(hli);b.appendChild(hl);
  var hr=el('div','hp','','position:absolute;right:24px;width:'+(P.w/2-60)+'px;bottom:24px');var hri=el('i','','','width:100%;background:'+GOLD);hr.appendChild(hri);b.appendChild(hr);
  var lab=el('div','','','position:absolute;left:24px;bottom:62px;font-size:32px;color:'+RED+';opacity:0');b.appendChild(lab);
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0;var bob=(Math.floor(t*3)%2)*6;ls.style.transform='translateY('+bob+'px)';lsB.style.transform='translateY('+bob+'px)';rs.style.transform='translateY('+(6-bob)+'px)';
    var hp=P.hp!=null?P.hp:50;var h=hp;if(P.hpTo!=null)h=lerp(hp,P.hpTo,clamp((t-(P.hpT||L.t0))/(P.hpDur||1.5),0,1));hli.style.width=h+'%';hli.style.background=h<40?RED:MIST;
    var sw_=P.swapT!=null&&t>=P.swapT;var gl=P.swapT!=null&&t>=P.swapT&&t<P.swapT+.4;ls.style.opacity=sw_?0:1;lsB.style.opacity=sw_?1:0;if(sw_){lsB.style.transform='translate('+(gl?(rnd(Math.floor(t*30))-.5)*14:0)+'px,'+bob+'px)';hli.style.background=GOLD;hli.style.width='100%';}
    if(P.l.name2&&sw_)b.children[0].textContent=P.l.name2;
    lab.textContent=P.lost&&t>=P.lost?'MATCH LOST':'';lab.style.opacity=(P.lost&&t>=P.lost)?(Math.floor(t*4)%2?1:.5):0;};
};
// ---- terminal ----
T.term=function(L,P){
  var b=el('div','panel'+(P.k?' '+P.k:''),'','width:'+P.w+'px;height:'+P.h+'px;padding:14px 22px;overflow:hidden');var log=el('div','log','');b.appendChild(log);L.inner.appendChild(b);
  var strip=function(h){return h.replace(/<[^>]+>/g,'');};
  return function(t){var out='';P.lines.forEach(function(ln,i){var t0=T0(ln,i,L,.4),u=t-t0;if(u<0)return;var plain=strip(ln.h),n=Math.floor(clamp(u/(ln.dur||.35),0,1)*plain.length);
      if(n>=plain.length)out+='<div>'+ln.h+'</div>';else{var cnt=0,res='',inTag=false,buf='';for(var k=0;k<ln.h.length;k++){var ch=ln.h[k];if(ch==='<')inTag=true;if(!inTag){if(cnt>=n)break;cnt++;}res+=ch;if(ch==='>')inTag=false;}
        var open=(res.match(/<span[^>]*>/g)||[]).length-(res.match(/<\/span>/g)||[]).length;for(var q=0;q<open;q++)res+='</span>';out+='<div>'+res+'</div>';}});
    log.innerHTML=out+(Math.floor(t*3)%2?'<span class="mint">█</span>':'');};
};
// ---- download progress ----
T.dl=function(L,P){
  var b=el('div','panel'+(P.k?' '+P.k:''),'','width:'+P.w+'px;height:'+(P.h||150)+'px;padding:16px 24px');
  var lab=el('div','ps',P.label,'font-size:18px;color:'+MIST+';white-space:nowrap');b.appendChild(lab);
  var bar=el('div','hp','','margin-top:20px;height:46px;border-color:'+GOLD);var fi=el('i','','','background:repeating-linear-gradient(90deg,'+GOLD+' 0 20px,'+INK+' 20px 24px)');bar.appendChild(fi);b.appendChild(bar);
  var pc=el('div','ps','','position:absolute;right:24px;bottom:12px;font-size:18px;color:'+GOLD);b.appendChild(pc);L.inner.appendChild(b);
  return function(t){var q=clamp((t-(P.ts!=null?P.ts:L.t0))/(P.dur||1),0,1);fi.style.width=(q*100)+'%';pc.textContent=q>=1?'DONE':Math.round(q*100)+'%';pc.style.color=q>=1?MINT:GOLD;};
};
// ---- rank card ----
T.rank=function(L,P){
  var b=el('div','panel g','','width:'+P.w+'px;height:'+P.h+'px');var sp=el('div','','','position:absolute;left:24px;top:'+((P.h-12*(P.size||16))/2)+'px');sp.innerHTML=spr('stardust',P.size||16);b.appendChild(sp);
  var x=24+12*(P.size||16)+26;b.appendChild(el('div','ps','Stardust','position:absolute;left:'+x+'px;top:34px;font-size:28px;color:'+GOLD));
  b.appendChild(el('div','','#1 HUMAN-WRITTEN<br>STARCRAFT BOT','position:absolute;left:'+x+'px;top:92px;font-size:42px;line-height:1.05'));
  b.appendChild(el('div','ps','BASIL ladder','position:absolute;left:'+x+'px;bottom:26px;font-size:16px;color:'+MIST));
  var crown=el('div','ps','#1','position:absolute;right:20px;top:18px;font-size:26px;color:'+INK+';background:'+GOLD+';padding:8px 10px');b.appendChild(crown);L.inner.appendChild(b);
  return function(t){sp.style.transform='translateY('+((Math.floor(t*3)%2)*6)+'px)';crown.style.transform='scale('+(1+.08*Math.sin((t-L.t0)*6))+')';};
};
// ---- two profile cards (model vs humans) ----
T.cards=function(L,P){
  var w=el('div','','','position:relative;width:'+(P.novs?(P.w-48)/2:P.w)+'px;height:'+P.h+'px');
  var cs=P.items.map(function(it,i){var cw=(P.w-48)/2;var c=el('div','panel'+(it.k?' '+it.k:''),'','position:absolute;left:'+(i*(cw+48))+'px;top:0;width:'+cw+'px;height:'+P.h+'px;opacity:0');c.appendChild(el('div','ps',it.name,'position:absolute;left:18px;top:16px;font-size:16px;color:'+C(it.c)));
    var sp=el('div','','','position:absolute;left:'+((cw-12*(P.size||20))/2)+'px;top:64px');sp.innerHTML=spr(it.sp,P.size||20);c.appendChild(sp);c.appendChild(el('div','',it.sub,'position:absolute;left:18px;right:18px;bottom:16px;font-size:36px;line-height:1.05'));w.appendChild(c);return {c:c,sp:sp,it:it,i:i};});
  var vs=el('div','ps','VS','position:absolute;left:'+(P.w/2-36)+'px;top:'+(P.h/2-26)+'px;font-size:26px;color:'+RED+';background:'+INK+';border:4px solid '+RED+';padding:10px 8px;z-index:3;opacity:0');w.appendChild(vs);L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.35),p=eb((t-t0)/.35);o.c.style.opacity=clamp((t-t0)/.08,0,1);o.c.style.transform='translateY('+lerp(40,0,eo((t-t0)/.35))+'px)';o.sp.style.transform='translateY('+((Math.floor(t*3+o.i)%2)*6)+'px)';});vs.style.opacity=P.novs?0:clamp((t-L.t0-.7)/.1,0,1);};
};
// ---- list panel (rules / diff lines) ----
T.list=function(L,P){
  var b=el('div','panel'+(P.k?' '+P.k:''),'','width:'+P.w+'px;height:'+P.h+'px;padding:16px 26px');
  b.appendChild(el('div','ps',P.title,'font-size:'+(P.ts||18)+'px;color:'+C(P.tc||'mist')+';margin-bottom:12px'));
  var rows=P.items.map(function(it,i){var d=el('div','log',it.h,'opacity:0;font-size:'+(P.fs||40)+'px');b.appendChild(d);return {d:d,it:it,i:i};});L.inner.appendChild(b);
  return function(t){rows.forEach(function(o){var t0=T0(o.it,o.i,L,.4),p=eo((t-t0)/.25);o.d.style.opacity=clamp((t-t0)/.06,0,1);o.d.style.transform='translateX('+lerp(-30,0,p)+'px)';});};
};
T.tags=function(L,P){
  var w=el('div','','','display:flex;gap:14px;flex-wrap:wrap;'+(P.col?'flex-direction:column;align-items:flex-start;':''));
  var cs=P.items.map(function(it,i){var c=el('div','tag'+(it.k?' '+it.k:''),it.txt,'font-size:'+(P.size||32)+'px');w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.2),p=eb((t-t0)/.3);o.c.style.opacity=clamp((t-t0)/.06,0,1);o.c.style.transform='scale('+lerp(.6,1,p)+')';});};
};
// ---- clock counting down ----
T.clock=function(L,P){
  var b=el('div','panel'+(P.k?' '+P.k:''),'','width:'+P.w+'px;height:'+P.h+'px;padding:14px 22px');b.appendChild(el('div','ps',P.label,'font-size:16px;color:'+MIST));var n=el('div','ps','','font-size:'+(P.size||48)+'px;color:'+GOLD+';margin-top:14px');b.appendChild(n);L.inner.appendChild(b);
  return function(t){var rem=Math.max(0,3600-Math.floor((t-L.t0)*(P.rate||60)));var m=Math.floor(rem/60),s=rem%60;n.textContent='0:'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;};
};
// ---- difficulty stairs: bot climbs tiers and stalls ----
T.stairs=function(L,P){
  var W=P.w,H=P.h,s=document.createElementNS(NS,'svg');s.setAttribute('width',W);s.setAttribute('height',H);s.style.cssText='position:absolute;left:0;top:0';L.inner.appendChild(s);
  var n=4,sw=(W-20)/n,steps=[];var cols=['#3a2a8a','#5a3fd0',VIO,RED];var names=['TIER D','TIER C','TIER B','TIER A'];
  for(var i=0;i<n;i++){var h=70+i*(H-160)/(n-1);var r=document.createElementNS(NS,'rect');r.setAttribute('x',10+i*sw);r.setAttribute('y',H-h);r.setAttribute('width',sw-10);r.setAttribute('height',h);r.setAttribute('fill',cols[i]);r.setAttribute('stroke',ICE);r.setAttribute('stroke-width',4);s.appendChild(r);steps.push({x:10+i*sw,y:H-h,w:sw-10});
    var tx=document.createElementNS(NS,'text');tx.setAttribute('x',10+i*sw+(sw-10)/2);tx.setAttribute('y',H-14);tx.setAttribute('text-anchor','middle');tx.setAttribute('fill',ICE);tx.setAttribute('font-family','PS');tx.setAttribute('font-size',15);tx.textContent=names[i];s.appendChild(tx);}
  var sp=el('div','','','position:absolute;left:0;top:0');sp.innerHTML=spr('astra',7);L.inner.appendChild(sp);
  var bang=el('div','ps','!','position:absolute;font-size:44px;color:'+RED+';opacity:0');L.inner.appendChild(bang);
  var hops=P.hops;
  return function(t){var u=t-L.t0;var idx=0;for(var i=0;i<hops.length;i++)if(t>=hops[i])idx=i+1;idx=Math.min(idx,3);var tgt=steps[idx];var prev=steps[Math.max(0,idx-1)];var since=idx>0?t-hops[idx-1]:u;var q=idx===0?1:eb(clamp(since/.35,0,1));
    var x=lerp(prev.x,tgt.x,q)+(tgt.w-84)/2+(idx===0?0:0),y=lerp(prev.y,tgt.y,q)-84-(since>0&&since<.35?Math.sin(since/.35*Math.PI)*34:0);
    var stuck=idx>=3&&t>=P.stuckT;var shake=stuck?(rnd(Math.floor(t*20))-.5)*8:0;sp.style.transform='translate('+(x+shake)+'px,'+y+'px)';bang.style.opacity=stuck?(Math.floor(t*4)%2?1:.4):0;bang.style.left=(x+86)+'px';bang.style.top=(y-14)+'px';};
};
// ---- reward-hacking shortcut diagram ----
T.shortcut=function(L,P){
  var W=P.w,H=P.h,s=document.createElementNS(NS,'svg');s.setAttribute('width',W);s.setAttribute('height',H);s.style.cssText='position:absolute;left:0;top:0';L.inner.appendChild(s);
  function path(d,col,w,dash){var p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke',col);p.setAttribute('stroke-width',w);p.setAttribute('stroke-linejoin','miter');if(dash)p.setAttribute('stroke-dasharray',dash);s.appendChild(p);return p;}
  var long=path('M70 80 H250 V320 H110 V440 H600 V160 H700','#46399a',22);
  var longTop=path('M70 80 H250 V320 H110 V440 H600 V160 H700',VIO,6,'18 14');
  var shortP=path('M70 80 L700 160',GOLD,10,'8 10');
  [[70,80],[700,160]].forEach(function(p,i){var r=document.createElementNS(NS,'rect');r.setAttribute('x',p[0]-24);r.setAttribute('y',p[1]-24);r.setAttribute('width',48);r.setAttribute('height',48);r.setAttribute('fill',i?GOLD:VIO);r.setAttribute('stroke',ICE);r.setAttribute('stroke-width',4);s.appendChild(r);});
  var l1=el('div','ps','Task','position:absolute;left:20px;top:8px;font-size:16px;color:'+MIST);var l2=el('div','ps','WIN','position:absolute;left:'+(700-26)+'px;top:'+(160+34)+'px;font-size:22px;color:'+GOLD);
  var l3=el('div','','BUILD IT YOURSELF (slow, hard)','position:absolute;left:150px;top:460px;font-size:38px;line-height:1;color:'+MIST+';white-space:nowrap');var l4=el('div','','DOWNLOAD THE BEST (fast)','position:absolute;left:100px;top:20px;font-size:38px;line-height:1;color:'+GOLD+';opacity:0;white-space:nowrap');
  [l1,l2,l3,l4].forEach(function(x){L.inner.appendChild(x);});
  var sp=el('div','','','position:absolute;left:0;top:0');sp.innerHTML=spr('astra',5);L.inner.appendChild(sp);
  var lenL=long.getTotalLength(),lenS=shortP.getTotalLength();
  return function(t){var u=t-L.t0;var tj=P.jumpT;
    var pos;if(t<tj){var q=clamp(u/(tj-L.t0),0,1)*.62;var pt=long.getPointAtLength(lenL*q);pos=[pt.x,pt.y];}
    else{var lq=clamp((tj-L.t0)/(tj-L.t0),0,1)*.62;var p0=long.getPointAtLength(lenL*.62);var qq=eo((t-tj)/.7);var pt2=shortP.getPointAtLength(lenS*qq);pos=[pt2.x,pt2.y];if(qq<.05){pos=[p0.x,p0.y];}}
    sp.style.transform='translate('+(pos[0]-30)+'px,'+(pos[1]-60)+'px)';
    shortP.setAttribute('opacity',t>=tj-.6?1:.18);shortP.setAttribute('stroke-dashoffset',-(t*40)%18);longTop.setAttribute('stroke-dashoffset',-(t*30)%32);l4.style.opacity=t>=tj-.6?1:.2;l4.style.left='170px';l4.style.top='8px';};
};
// ---- neck-and-neck bars ----
T.neck=function(L,P){
  var b=el('div','panel','','width:'+P.w+'px;height:'+P.h+'px;padding:16px 24px');b.appendChild(el('div','ps','SAME TEST · RANKED','font-size:16px;color:'+MIST+';margin-bottom:6px'));
  var row=el('div','','','position:relative;height:'+(P.h-90)+'px;display:flex;gap:24px;align-items:flex-end');
  var bars=[['astra','GPT-6 ASTRA',MIST],['claude','CLAUDE OPUS 5.5',MINT]].map(function(x){var c=el('div','','','flex:1;position:relative;height:100%');var f=el('div','','','position:absolute;left:0;right:0;bottom:30px;background:'+x[2]+';border:4px solid '+ICE+';height:0');c.appendChild(f);var sp=el('div','','','position:absolute;left:50%;margin-left:-36px;bottom:0;opacity:0');sp.innerHTML=spr(x[0],6);var lb=el('div','ps',x[1],'position:absolute;left:0;right:0;bottom:0;text-align:center;font-size:13px;color:'+x[2]);c.appendChild(lb);row.appendChild(c);return {f:f,lb:lb};});
  b.appendChild(row);var nn=el('div','ps','NECK & NECK','position:absolute;left:0;right:0;top:'+(P.h*.38)+'px;text-align:center;font-size:26px;color:'+GOLD+';text-shadow:4px 4px 0 #05030f;z-index:4;opacity:0');b.appendChild(nn);L.inner.appendChild(b);
  var H0=P.h-150;
  return function(t){var u=t-L.t0,p=eo(u/.9);bars[0].f.style.height=(H0*(.78+.03*Math.sin(u*2.3))*p)+'px';bars[1].f.style.height=(H0*(.78+.03*Math.sin(u*2.3+3))*p)+'px';nn.style.opacity=clamp((u-.9)/.2,0,1);};
};
T.person=function(L,P){
  var b=el('div','panel g','','width:'+P.w+'px;height:'+P.h+'px');b.appendChild(el('div','ps',P.label||'caught by','position:absolute;left:24px;top:20px;font-size:16px;color:'+GOLD));b.appendChild(el('div','ps',P.name,'position:absolute;left:24px;top:56px;font-size:32px;line-height:1.1'));b.appendChild(el('div','',P.sub,'position:absolute;left:24px;bottom:16px;font-size:34px;color:'+MIST));L.inner.appendChild(b);return function(){};
};
T.cta=function(L,P){
  var w=el('div','','','width:768px;text-align:center');
  w.appendChild(el('div','',"<img src='profile.jpg' style='width:100%;height:100%;object-fit:cover;display:block'>",'width:300px;height:300px;margin:0 auto;border:10px solid '+GOLD+';box-shadow:10px 10px 0 #05030f,0 0 0 10px '+INK+';overflow:hidden'));
  w.appendChild(el('div','ps','NEW AI BREAKDOWN EVERY WEEK','font-size:16px;color:'+MIST+';margin-top:34px'));
  w.appendChild(el('div','ps',P.handle,'font-size:34px;margin-top:16px;white-space:nowrap;text-shadow:4px 4px 0 #05030f'));
  var btn=el('div','ps','+ FOLLOW','margin:28px auto 0;width:560px;height:96px;background:'+VIO+';border:6px solid '+ICE+';box-shadow:8px 8px 0 #05030f;font-size:32px;display:flex;align-items:center;justify-content:center');w.appendChild(btn);
  L.inner.appendChild(w);return function(t){var u=t-L.t0,s=1+.04*Math.sin(u*6)*clamp(u-.5,0,1);btn.style.transform='scale('+s+')';btn.style.background=(Math.floor(u*3)%2)?VIO:'#a47dff';};
};
var LAY=[];
window.COMPS={
  build:function(root){window.DATA.scenes.forEach(function(sc){(sc.layers||[]).forEach(function(P){
    var wrap=el('div','c','','left:'+(P.x||0)+'px;top:'+(P.y||0)+'px;display:none;');var inner=el('div','','','');wrap.appendChild(inner);root.appendChild(wrap);if(P.nocheck)wrap.dataset.nc='1';wrap.dataset.type=P.type;wrap.dataset.t0=P.t0;
    var L={wrap:wrap,inner:inner,t0:P.t0,t1:P.t1,fx:P.fx};L.upd=T[P.type](L,P);LAY.push(L);});});},
  update:function(t){for(var i=0;i<LAY.length;i++){var L=LAY[i],on=t>=L.t0-.02&&t<=L.t1;
    if(!on){if(L.on){L.wrap.style.display='none';L.on=false;}continue;}
    if(!L.on){L.wrap.style.display='block';L.on=true;}
    wrapFx(L,t);L.upd(t);}}
};
})();
