// "Boarding Pass" components (turquoise / ivory / ink / coral) — pure functions of absolute time t.
(function(){
'use strict';
var U=window.U,clamp=U.clamp,lerp=U.lerp;
function eo(x){x=clamp(x,0,1);return 1-Math.pow(1-x,3);}
function eo5(x){x=clamp(x,0,1);return 1-Math.pow(1-x,5);}
function eb(x){x=clamp(x,0,1);var c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function hash(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var IV='#fbf6ea',INK='#0d1f1e',CO='#ff4f4a',TQ='#00b3a3';
var ICONS=window.DATA.icons||{};
function ic(n,px){return '<svg viewBox="0 0 24 24" width="'+px+'" height="'+px+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>';}
function cnt(v,fmt){var n=Math.round(v);return fmt==='k'?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,','):String(n);}
function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.15,0,1);
  if(k==='none'){a=1;}
  else if(k==='slam'){var p=eo5(u/.18);a=clamp(u/.04,0,1);tr='scale('+lerp(1.5,1,p)+') rotate('+lerp(-6,0,p)+'deg)';}
  else if(k==='pop'){var q=eb(u/.28);a=clamp(u/.05,0,1);tr='scale('+lerp(.5,1,q)+')';}
  else if(k==='rise'){var r=eo5(u/.3);a=clamp(u/.08,0,1);tr='translateY('+lerp(60,0,r)+'px)';}
  else if(k==='left'){var l=eo5(u/.32);a=clamp(u/.08,0,1);tr='translateX('+lerp(-240,0,l)+'px)';}
  else if(k==='right'){var rr=eo5(u/.32);a=clamp(u/.08,0,1);tr='translateX('+lerp(240,0,rr)+'px)';}
  else if(k==='drop'){var d=eb(u/.4);a=clamp(u/.06,0,1);tr='translateY('+lerp(-180,0,d)+'px)';}
  else{a=clamp(u/.12,0,1);}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};
T.air=function(L,P){var b=el('div','','','position:absolute;left:0;width:1080px;height:30px;background:repeating-linear-gradient(115deg,'+CO+' 0 26px,'+IV+' 26px 52px,'+INK+' 52px 78px,'+IV+' 78px 104px)');L.inner.appendChild(b);return function(t){b.style.backgroundPosition=((t*50)%104)+'px 0';};};
T.eyebrow=function(L,P){var d=el('div','',P.txt,'font:700 26px SM,monospace;letter-spacing:.08em;color:'+IV+';text-transform:uppercase;white-space:nowrap');L.inner.appendChild(d);d.textContent='';
  return function(t){var n=Math.floor(clamp((t-L.t0)/.4,0,1)*P.txt.length);d.textContent=P.txt.slice(0,n)+(Math.floor(t*3)%2&&n<P.txt.length+1?'▌':'');};};
T.label=function(L,P){L.inner.appendChild(el('div','lab',P.txt,'font-size:'+(P.size||17)+'px;color:'+(P.c==='iv'?IV:'rgba(13,31,30,.62)')));return function(){};};
T.big=function(L,P){var d=el('div','bc','','font-size:'+P.size+'px;color:'+IV+';line-height:.85;text-shadow:0 6px 0 rgba(13,31,30,.35);white-space:nowrap');L.inner.appendChild(d);
  return function(t){var v=lerp(P.from||0,P.to,eo((t-(P.ts!=null?P.ts:L.t0))/(P.dur||1)));d.textContent=(P.pre||'')+cnt(v,P.fmt)+(P.suf||'');};};
T.head=function(L,P){
  var size=P.size||110;var box=el('div','bc','','font-size:'+size+'px;width:'+(P.w||768)+'px;line-height:1.02;color:'+IV+';white-space:nowrap;text-shadow:0 5px 0 rgba(13,31,30,.35)');L.inner.appendChild(box);
  var ws=P.words.map(function(w){if(w.br){box.appendChild(el('br'));return null;}
    var s=el('span','',w.txt,'display:inline-block;margin-right:.2em;'+(w.hl?'background:'+CO+';padding:0 14px;line-height:.95;text-shadow:none;':'')+(w.c==='ink'?'color:'+INK+';text-shadow:none;':''));box.appendChild(s);return {s:s,w:w};}).filter(Boolean);
  return function(t){ws.forEach(function(o){var t0=o.w.t!=null?o.w.t:L.t0,u=t-t0,p=eo5(u/.22);o.s.style.opacity=clamp(u/.05,0,1);
    var sc=(o.w.slam&&u>=0)?1+.3*(1-clamp(eb(u/.2),0,1)):1;o.s.style.transform='translateY('+lerp(34,0,p)+'px) scale('+sc+')';});};
};
T.photo=function(L,P){
  var b=el('div','','','position:relative;width:'+P.w+'px;height:'+P.h+'px;border:5px solid '+IV+';background:'+TQ+';overflow:hidden');
  var im=el('img','','','position:absolute;left:0;top:0;width:'+(P.iw||P.w)+'px;transform-origin:50% 50%;filter:contrast(1.05) saturate(1.05)');im.src='shots/'+P.img+'.jpg';b.appendChild(im);
  b.appendChild(el('div','','','position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,179,163,.25),rgba(13,31,30,.35))'));
  b.appendChild(el('div','','AI IMAGE','position:absolute;left:10px;top:10px;z-index:3;background:'+IV+';color:'+INK+';font:700 15px SM;letter-spacing:.1em;padding:4px 9px'));
  if(P.hud)b.appendChild(el('div','','● '+P.hud,'position:absolute;right:10px;top:10px;z-index:3;background:'+INK+';color:'+IV+';font:700 15px SM;letter-spacing:.1em;padding:4px 9px'));
  
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0,z=lerp(P.z0||1.06,P.z1||1.2,clamp(u/(P.zd||6),0,1));im.style.transform='translate('+(P.px||0)+'px,'+(P.py||0)+'px) scale('+z+')';};
};
T.chips=function(L,P){
  var w=el('div','','','display:flex;flex-wrap:wrap;gap:12px;width:768px');
  var cs=P.items.map(function(it){var c=el('span','chip '+(it.k||''),it.txt,P.size?'font-size:'+P.size+'px;':'');w.appendChild(c);return {c:c,t:it.t};});L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var u=t-(o.t!=null?o.t:L.t0);var p=eb(u/.25);o.c.style.opacity=clamp(u/.05,0,1);o.c.style.transform='scale('+lerp(.6,1,clamp(p,0,1.05))+')';});};
};
T.stamp=function(L,P){
  var s=el('div','bc',P.txt,'border:7px solid '+CO+';color:'+CO+';background:rgba(251,246,234,.94);font-size:'+(P.size||70)+'px;padding:0 22px;white-space:nowrap;transform:rotate('+(P.rot||-8)+'deg);line-height:1.1');L.inner.appendChild(s);return function(){};
};
// ---- boarding pass with split-flap price ----
T.ticket=function(L,P){
  var w=768,h=P.h||250;var b=el('div','card','','width:'+w+'px;height:'+h+'px;border-radius:22px');
  b.appendChild(el('div','','','position:absolute;top:22px;bottom:22px;left:560px;border-left:4px dashed rgba(13,31,30,.35)'));
  [[-22,'left'],[w-22,'left']].forEach(function(n){b.appendChild(el('i','notch','','position:absolute;width:44px;height:44px;border-radius:50%;background:'+TQ+';top:'+(h/2-22)+'px;left:'+n[0]+'px'));});
  b.appendChild(el('div','lab',P.who+' · FICTIONAL PROFILE','position:absolute;left:34px;top:22px'));
  b.appendChild(el('div','bc',P.from,'position:absolute;left:34px;top:62px;font-size:118px;line-height:.9'));
  b.appendChild(el('div','','<svg viewBox="0 0 24 24" width="70" height="70" fill="none" stroke="'+INK+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS.plane||'')+'</svg>','position:absolute;left:210px;top:72px'));
  b.appendChild(el('div','bc',P.to,'position:absolute;left:300px;top:62px;font-size:118px;line-height:.9'));
  b.appendChild(el('div','lab',P.label,'position:absolute;left:34px;top:'+(h-60)+'px'));
  b.appendChild(el('div','lab','EXAMPLE PRICE','position:absolute;left:572px;top:24px'));
  var fw=el('div','','','position:absolute;left:572px;top:54px;display:flex;gap:6px');b.appendChild(fw);
  var digs=P.price.split(''),tiles=digs.map(function(ch,i){var d=el('div','bc','','width:38px;height:74px;background:'+(P.co?CO:INK)+';color:'+IV+';font-size:58px;line-height:74px;text-align:center;border-radius:8px;position:relative');d.appendChild(el('i','','','position:absolute;left:0;right:0;top:36px;height:3px;background:rgba(251,246,234,.25)'));fw.appendChild(d);var sp=el('span','',ch);d.insertBefore(sp,d.firstChild);return {d:d,sp:sp,ch:ch};});
  b.appendChild(el('div','','','position:absolute;left:580px;top:'+(h-74)+'px;width:150px;height:40px;background:repeating-linear-gradient(90deg,'+INK+' 0 3px,transparent 3px 6px,'+INK+' 6px 7px,transparent 7px 11px)'));
  L.inner.appendChild(b);
  return function(t){var n=digs.length;tiles.forEach(function(o,i){if(o.ch==='$'){return;}var set=P.ts+P.dur*(i+1)/n;var txt=o.ch;
      if(t<set){var st=Math.floor(t*16)+i*7;txt=String(Math.floor(hash(st+P.seed*13)*10));}
      o.sp.textContent=txt;var fl=t<set?0:clamp(1-(t-set)/.15,0,1);o.d.style.transform='scaleY('+(1-.12*fl)+')';});};
};
// ---- 13 model dots, 8 light up ----
T.dots=function(L,P){
  var w=el('div','','','display:flex;gap:8px;width:768px;align-items:center');
  var ds=[];for(var i=0;i<13;i++){var d=el('div','','','width:50px;height:50px;border-radius:50%;border:3px solid '+IV+';background:rgba(13,31,30,.55)');w.appendChild(d);ds.push(d);}
  L.inner.appendChild(w);
  return function(t){ds.forEach(function(d,i){var on=i<(P.all?13:8)&&t>=P.ts+i*(P.gap||.14);var u=t-(P.ts+i*(P.gap||.14));d.style.background=on?(P.all?IV:CO):'rgba(13,31,30,.55)';d.style.borderColor=on?(P.all?IV:CO):IV;d.style.transform='scale('+(on?1+.4*Math.max(0,1-u/.2):1)+')';});};
};
T.tiles=function(L,P){
  var w=el('div','','','display:flex;gap:14px;width:768px');
  var ts=P.items.map(function(it){var c=el('div','card','<div style="color:'+INK+';display:flex;justify-content:center">'+ic(it.ic,60)+'</div><div class="lab" style="margin-top:8px;color:'+INK+';font-size:16px;text-align:center">'+it.txt+'</div>','flex:1;padding:18px 10px;');w.appendChild(c);return {c:c,t:it.t};});
  L.inner.appendChild(w);
  return function(t){ts.forEach(function(o){var u=t-o.t,p=eb(u/.28);o.c.style.opacity=clamp(u/.05,0,1);o.c.style.transform='scale('+lerp(.7,1,clamp(p,0,1.05))+')';});};
};
// ---- scoreboard bar card ----
T.score=function(L,P){
  var b=el('div','card','','width:768px;height:'+(P.h||180)+'px;'+(P.hi?'outline:6px solid '+CO+';outline-offset:-6px;':''));
  b.appendChild(el('div','bc',P.name,'position:absolute;left:28px;top:12px;font-size:50px;line-height:1'));
  var rows=[['FLIGHTS',P.f,2.2,'+$','',72],['INSURANCE',P.ins,1.35,'+$','/mo',124]],objs=[];
  rows.forEach(function(r){b.appendChild(el('div','lab',r[0],'position:absolute;left:28px;top:'+(r[5]+8)+'px;font-size:16px'));
    if(r[1]==null){b.appendChild(el('div','bc','NOT IN SOURCE','position:absolute;left:150px;top:'+r[5]+'px;font-size:36px;opacity:.5'));objs.push(null);return;}
    var bar=el('div','','','position:absolute;left:150px;top:'+r[5]+'px;height:40px;background:'+(P.hi?CO:INK));var num=el('div','bc','','position:absolute;top:'+(r[5]-4)+'px;font-size:44px;line-height:1.1;white-space:nowrap');b.appendChild(bar);b.appendChild(num);objs.push({bar:bar,num:num,r:r});});
  L.inner.appendChild(b);
  return function(t){objs.forEach(function(o,i){if(!o)return;var p=eo((t-(i&&P.tsIns!=null?P.tsIns:P.ts+i*.15))/.5);var wd=o.r[1]*o.r[2]*p;o.bar.style.width=wd+'px';o.num.style.left=(150+wd+12)+'px';o.num.textContent=o.r[3]+Math.round(o.r[1]*p)+o.r[4];});};
};
// ---- "find the cheapest" before/after ----
T.cheap=function(L,P){
  var b=el('div','card','','width:768px;height:'+P.h+'px;padding:0');
  var tg=el('div','','','position:absolute;left:28px;top:20px;display:flex;align-items:center;gap:16px');
  var sw=el('div','','','width:96px;height:48px;border-radius:24px;background:rgba(13,31,30,.3);position:relative');var kn=el('i','','','position:absolute;top:5px;left:5px;width:38px;height:38px;border-radius:50%;background:'+IV);sw.appendChild(kn);tg.appendChild(sw);
  var tl=el('div','bc','ASK FOR THE CHEAPEST','font-size:44px;line-height:1');tg.appendChild(tl);b.appendChild(tg);
  var rows=P.rows.map(function(r,i){var y=100+i*92;b.appendChild(el('div','bc',r.name,'position:absolute;left:28px;top:'+(y+4)+'px;font-size:36px;line-height:1;width:200px;white-space:nowrap'));
    var bar=el('div','','','position:absolute;left:250px;top:'+y+'px;height:46px;background:'+INK);var num=el('div','bc','','position:absolute;top:'+(y-2)+'px;font-size:44px;line-height:1.1;white-space:nowrap');b.appendChild(bar);b.appendChild(num);return {bar:bar,num:num,r:r};});
  b.appendChild(el('div','lab','FLIGHTS · AVG. GAP, WEALTHY VS LOW-INCOME','position:absolute;left:28px;bottom:14px;font-size:15px'));
  L.inner.appendChild(b);
  return function(t){var f=eo((t-P.flipT)/.5);kn.style.left=lerp(5,53,f)+'px';sw.style.background=f>0.5?CO:'rgba(13,31,30,.3)';
    rows.forEach(function(o,i){var intro=eo((t-P.ts-i*.12)/.4);var v=lerp(o.r.a,o.r.b,f)*intro;o.bar.style.width=(v*1.6)+'px';o.bar.style.background=f>.5?CO:INK;o.num.style.left=(250+v*1.6+12)+'px';o.num.textContent='+$'+Math.round(v);});};
};
// ---- inbox with highlighted emails + ring ----
T.inbox=function(L,P){
  var b=el('div','card','','width:560px;padding:14px 16px');
  var rows=P.mails.map(function(m){var r=el('div','','<span style="color:'+INK+'">'+ic('mail',34)+'</span><span style="font:700 27px Inter;flex:1;white-space:nowrap">'+m.s+'</span>','display:flex;align-items:center;gap:12px;padding:12px 10px;margin:4px 0;border-radius:12px;');var tag=null;if(m.hi){tag=el('span','chip c','READ FIRST','font-size:14px;padding:3px 8px;opacity:0');r.appendChild(tag);}b.appendChild(r);return {r:r,m:m,tag:tag};});
  L.inner.appendChild(b);
  return function(t){rows.forEach(function(o){var on=o.m.hi&&t>=o.m.t;o.r.style.background=on?'#ffe3e1':'transparent';o.r.style.outline=on?'4px solid '+CO:'none';o.r.style.outlineOffset='-4px';o.r.style.opacity=(o.m.hi||t<P.dimT)?1:.5;if(o.tag){var u=t-o.m.t;o.tag.style.opacity=on?clamp(u/.1,0,1):0;}});};
};
T.ring=function(L,P){
  var R=76,C=2*Math.PI*R;var w=el('div','','','width:188px');
  w.innerHTML='<svg width="188" height="188" viewBox="0 0 188 188"><circle cx="94" cy="94" r="76" fill="none" stroke="rgba(13,31,30,.3)" stroke-width="22"/><circle id="rg" cx="94" cy="94" r="76" fill="none" stroke="'+CO+'" stroke-width="22" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 94 94)"/><text id="rt" x="94" y="110" text-anchor="middle" font-family="BC" font-weight="800" font-size="62" fill="'+IV+'">0%</text></svg><div class="lab" style="color:'+IV+';text-align:center;font-size:14px;margin-top:2px">MONEY MAILS FIRST</div>';
  L.inner.appendChild(w);var rg=w.querySelector('#rg'),rt=w.querySelector('#rt');
  return function(t){var p=eo((t-P.ts)/(P.dur||1));rg.setAttribute('stroke-dashoffset',C*(1-p*P.to/100));rt.textContent=Math.round(P.to*p)+'%';};
};
// ---- hide-attribute switches ----
T.switches=function(L,P){
  var w=el('div','','','width:768px');
  var rs=P.rows.map(function(r,i){var c=el('div','card','','height:170px;margin-bottom:14px;'+(i?'':''));
    var sw=el('div','','','position:absolute;left:28px;top:30px;width:96px;height:48px;border-radius:24px;background:rgba(13,31,30,.3)');var kn=el('i','','','position:absolute;top:5px;left:5px;width:38px;height:38px;border-radius:50%;background:'+IV);sw.appendChild(kn);c.appendChild(sw);
    c.appendChild(el('div','bc','HIDE: '+r.what,'position:absolute;left:150px;top:22px;font-size:54px;line-height:1'));
    var res=el('div','bc',r.res,'position:absolute;left:28px;top:96px;font-size:50px;line-height:1;white-space:nowrap;opacity:0;color:'+(r.good?'#00796b':CO));c.appendChild(res);w.appendChild(c);return {c:c,sw:sw,kn:kn,res:res,r:r};});
  L.inner.appendChild(w);
  return function(t){rs.forEach(function(o){var f=eo((t-o.r.t)/.35);o.kn.style.left=lerp(5,53,f)+'px';o.sw.style.background=f>.5?(o.r.good?'#00796b':CO):'rgba(13,31,30,.3)';if(o.r.res2&&t>=o.r.res2T){o.res.textContent=o.r.res2;}else{o.res.textContent=o.r.res;}o.res.style.opacity=clamp((t-o.r.t-.25)/.15,0,1);o.res.style.transform='translateX('+lerp(30,0,eo((t-o.r.t-.25)/.3))+'px)';});};
};
// ---- caveat cards ----
T.cards=function(L,P){
  var w=el('div','','','width:768px');
  var cs=P.items.map(function(it){var c=el('div','card','','height:'+(P.h||118)+'px;margin-bottom:12px;padding:14px 26px;display:flex;align-items:center;gap:20px;'+(it.hi?'outline:6px solid '+CO+';outline-offset:-6px;':''));c.innerHTML='<div style="color:'+(it.hi?CO:INK)+'">'+ic(it.ic,56)+'</div><div><div class="lab" style="font-size:16px;color:'+(it.hi?CO:'rgba(13,31,30,.62)')+'">'+it.k+'</div><div class="bc" style="font-size:'+(it.fs||46)+'px;line-height:1;margin-top:4px;white-space:nowrap">'+it.txt+'</div></div>';w.appendChild(c);return {c:c,t:it.t};});
  L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var u=t-o.t,p=eo5(u/.3);o.c.style.opacity=clamp(u/.06,0,1);o.c.style.transform='translateY('+lerp(50,0,p)+'px)';});};
};
T.callout=function(L,P){var c=el('div','card','<div class="bc" style="font-size:'+(P.size||60)+'px;line-height:1.02">'+P.html+'</div>','width:768px;padding:24px 30px;');L.inner.appendChild(c);return function(){};};
T.cta=function(L,P){
  var w=768,h=P.h||380;var b=el('div','card','','width:'+w+'px;height:'+h+'px;border-radius:22px');
  b.appendChild(el('div','','','position:absolute;top:22px;bottom:22px;left:560px;border-left:4px dashed rgba(13,31,30,.35)'));
  [-22,w-22].forEach(function(x){b.appendChild(el('i','notch','','position:absolute;width:44px;height:44px;border-radius:50%;background:'+TQ+';top:'+(h/2-22)+'px;left:'+x+'px'));});
  b.appendChild(el('div','',"<img src='profile.jpg' style='width:100%;height:100%;object-fit:cover;display:block'>",'position:absolute;left:34px;top:50px;width:260px;height:260px;border-radius:50%;overflow:hidden;border:10px solid '+CO+';box-shadow:0 0 0 6px '+INK));
  b.appendChild(el('div','lab','PASSENGER','position:absolute;left:320px;top:62px'));
  b.appendChild(el('div','bc','@sandesh<br>.explains','position:absolute;left:320px;top:92px;font-size:56px;line-height:.98'));
  b.appendChild(el('div','lab','GATE · NEXT AI STORY','position:absolute;left:34px;top:'+(h-50)+'px'));
  var btn=el('div','bc','FOLLOW<br>→','position:absolute;left:578px;top:150px;background:'+CO+';color:'+IV+';font-size:46px;line-height:1;padding:10px 16px;border-radius:10px');b.appendChild(btn);
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0;btn.style.transform='rotate(-4deg) scale('+(1+.07*Math.sin(u*7)*clamp(u-.4,0,1))+')';};
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
