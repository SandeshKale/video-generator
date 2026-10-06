// "Swiss poster" components (cobalt / acid-lime) — pure functions of absolute time t.
(function(){
'use strict';
var U=window.U,clamp=U.clamp,lerp=U.lerp,sm=U.sm;
function eo(x){x=clamp(x,0,1);return 1-Math.pow(1-x,3);}
function eo5(x){x=clamp(x,0,1);return 1-Math.pow(1-x,5);}
function eb(x){x=clamp(x,0,1);var c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function rnd(n){var x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
var LIME='#c8ff2e',NAVY='#0a1050',ICE='#eef1ff',BL='#2338ff';
var ICONS=window.DATA.icons||{};
function ic(n,px,col){return '<svg viewBox="0 0 24 24" width="'+px+'" height="'+px+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>';}
var OAI=window.DATA.oai||'';
function cnt(v,fmt){var n=Math.round(v);return fmt==='k'?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,','):String(n);}
function T0(o,L){return o.t!=null?o.t:L.t0;}
function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.15,0,1);
  if(k==='none'){a=1;}
  else if(k==='slam'){var p=eo5(u/.18);a=clamp(u/.04,0,1);tr='scale('+lerp(1.5,1,p)+')';}
  else if(k==='pop'){var q=eb(u/.28);a=clamp(u/.05,0,1);tr='scale('+lerp(.5,1,q)+')';}
  else if(k==='rise'){var r=eo5(u/.3);a=clamp(u/.08,0,1);tr='translateY('+lerp(60,0,r)+'px)';}
  else if(k==='left'){var l=eo5(u/.32);a=clamp(u/.08,0,1);tr='translateX('+lerp(-240,0,l)+'px)';}
  else if(k==='right'){var rr=eo5(u/.32);a=clamp(u/.08,0,1);tr='translateX('+lerp(240,0,rr)+'px)';}
  else if(k==='drop'){var d=eb(u/.4);a=clamp(u/.06,0,1);tr='translateY('+lerp(-180,0,d)+'px)';}
  else{a=clamp(u/.12,0,1);}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};
// ---- scrolling ticker (persistent) ----
var TK='● JUL 11 ● 1,200 AGENTS ● 700 TOOK PART ● 17,600 ACTIONS ● UNDER 13 HOURS ● TRAINING PAUSED 2 WEEKS ● 100+ ORGS NOTIFIED ';
T.ticker=function(L,P){
  var b=el('div','','','position:absolute;left:-150px;width:1080px;height:54px;background:'+LIME+';color:'+NAVY+';font:700 24px JB,monospace;letter-spacing:.12em;white-space:nowrap;overflow:hidden');
  var r=el('div','',TK+TK+TK,'position:absolute;top:13px;left:0;white-space:nowrap');b.appendChild(r);L.inner.appendChild(b);
  var W=0;
  return function(t){if(!W)W=r.scrollWidth/3;r.style.transform='translateX('+(-(t*260)%W)+'px)';};
};
T.label=function(L,P){var d=el('div','lab',P.txt,'font-size:'+(P.size||22)+'px;color:'+(P.c==='lime'?LIME:ICE));L.inner.appendChild(d);return function(){};};
T.eyebrow=function(L,P){var d=el('div','lab lime',P.txt);L.inner.appendChild(d);d.textContent='';
  return function(t){var n=Math.floor(clamp((t-L.t0)/.4,0,1)*P.txt.length);d.textContent=P.txt.slice(0,n)+(Math.floor(t*3)%2&&n<P.txt.length+1?'▌':'');};};
// ---- giant number ----
T.big=function(L,P){
  var d=el('div','d','','font-size:'+P.size+'px;color:'+(P.c==='ice'?ICE:LIME)+';line-height:.8;transform-origin:0 100%');L.inner.appendChild(d);
  return function(t){var u=t-L.t0;var v=P.to!=null?lerp(P.from||0,P.to,eo((t-(P.ts!=null?P.ts:L.t0))/(P.dur||1))):null;d.textContent=(P.pre||'')+(v!=null?cnt(v,P.fmt):P.txt)+(P.suf||'');
    var k=eb(u/.35);d.style.transform='scale('+(1+.08*(1-clamp(k,0,1)))+')';};
};
// ---- headline: words pop in at their own times; underline sweeps ----
T.head=function(L,P){
  var size=P.size||96,ls=P.lh||1;var box=el('div','d','','font-size:'+size+'px;width:'+(P.w||768)+'px;line-height:'+(.95*ls)+';white-space:nowrap');L.inner.appendChild(box);
  var ws=P.words.map(function(w){if(w.br){box.appendChild(el('br'));return null;}
    var s=el('span','',w.txt,'position:relative;display:inline-block;margin-right:.2em;'+(w.c==='lime'?'color:'+LIME:''));
    if(w.ul){var u=el('u','','','position:absolute;left:0;bottom:-3px;height:9px;width:100%;background:'+(w.c==='lime'?ICE:LIME)+';transform-origin:left;transform:scaleX(0)');s.appendChild(u);s.__u=u;}
    box.appendChild(s);return {s:s,w:w};}).filter(Boolean);
  return function(t){ws.forEach(function(o){var t0=o.w.t!=null?o.w.t:L.t0,u=t-t0;var p=eo5(u/.22);o.s.style.opacity=clamp(u/.05,0,1);
    var sc=o.w.slam?1+.35*(1-clamp(eb(u/.2),0,1)):1;o.s.style.transform='translateY('+lerp(34,0,p)+'px) scale('+sc+')';
    if(o.s.__u){var ut=o.w.ut!=null?o.w.ut:t0;o.s.__u.style.transform='scaleX('+eo((t-ut)/.18)+')';}});};
};
// ---- photo panel with ken-burns, tint, brackets, scan bar, AI tag ----
T.photo=function(L,P){
  var b=el('div','','','position:relative;width:'+P.w+'px;height:'+P.h+'px;border:4px solid '+(P.edge?LIME:ICE)+';background:'+NAVY+';overflow:hidden');
  var im=el('img','','','position:absolute;left:0;top:0;width:'+(P.iw||P.w)+'px;transform-origin:'+(P.org||'50% 50%')+';filter:contrast(1.08) brightness('+(P.br||1.12)+') saturate(1.05)');im.src='shots/'+P.img+'.jpg';b.appendChild(im);
  b.appendChild(el('div','','','position:absolute;inset:0;background:linear-gradient(180deg,rgba(35,56,255,.14),rgba(10,16,80,.38))'));
  var scan=el('div','','','position:absolute;left:0;right:0;height:5px;background:'+LIME+';opacity:.75;box-shadow:0 0 18px 4px rgba(200,255,46,.5)');b.appendChild(scan);
  b.appendChild(el('div','chip l','AI IMAGE','position:absolute;left:10px;top:10px;font-size:15px;padding:4px 9px;border-width:2px'));
  if(P.hud)b.appendChild(el('div','chip','● '+P.hud,'position:absolute;right:10px;top:10px;font-size:15px;padding:4px 9px;border-width:2px'));
  [[0,0],[1,0],[0,1],[1,1]].forEach(function(c){b.appendChild(el('i','','','position:absolute;width:26px;height:26px;'+(c[0]?'right':'left')+':8px;'+(c[1]?'bottom':'top')+':8px;border:4px solid '+LIME+';border-'+(c[0]?'left':'right')+':0;border-'+(c[1]?'top':'bottom')+':0'));});
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0,z0=P.z0||1.06,z1=P.z1||1.2;var z=lerp(z0,z1,clamp(u/(P.zd||6),0,1));
    im.style.transform='translate('+(P.px||0)+'px,'+(P.py||0)+'px) scale('+z+')';scan.style.top=(((t*.35)%1)*P.h)+'px';};
};
// ---- agent grid (hook): 10 agents per square; escape wave ----
T.agentgrid=function(L,P){
  var cols=P.cols,rows=P.rows,cw=P.w/cols,ch=P.h/rows,s=7;
  var b=el('div','panel','','width:'+P.w+'px;height:'+P.h+'px;overflow:visible;background:rgba(10,16,80,.55)');
  var cells=[];for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){s=(s*16807)%2147483647;var a=s/2147483647;s=(s*16807)%2147483647;var bb=s/2147483647;s=(s*16807)%2147483647;var cc=s/2147483647;
    var lit=a<P.lit;var e=el('i','','','position:absolute;left:'+(c*cw+4)+'px;top:'+(r*ch+4)+'px;width:'+(cw-8)+'px;height:'+(ch-8)+'px;border:2px solid rgba(238,241,255,.35)');b.appendChild(e);
    cells.push({e:e,r:r,lit:lit,t0:lit?(r>=rows-2?.25+bb*1.7:bb*2.3-.45):9,fall:cc,x:(bb-.5)*120});}
  L.inner.appendChild(b);
  return function(t){cells.forEach(function(c){var tt=t-L.t0,p=clamp((tt-c.t0)/.18,0,1),sc=1,op=1,tx=0,ty=0,rot=0;
    if(c.lit){var on=tt>=c.t0;c.e.style.background=on?LIME:'transparent';c.e.style.borderColor=on?LIME:'rgba(238,241,255,.35)';sc=on?(.62+.9*Math.sin(Math.PI*p)):1;
      if(P.fall!=null&&c.r>=rows-2){var f=clamp((t-(P.fall+c.fall*.5))/.9,0,1);ty=f*f*520;tx=c.x*f;rot=f*c.x*2;op=1-clamp((f-.7)/.3,0,1);}}
    c.e.style.transform='translate('+tx+'px,'+ty+'px) rotate('+rot+'deg) scale('+sc+')';c.e.style.opacity=op;});};
};
// ---- badge with counter ----
T.badge=function(L,P){
  var b=el('div','','','width:'+P.d+'px;height:'+P.d+'px;border-radius:50%;background:'+NAVY+';border:4px solid '+LIME+';text-align:center;padding-top:'+(P.d*.2)+'px');
  var n=el('div','d','','font-size:'+(P.d*.38)+'px;color:'+LIME+';font-variant-numeric:tabular-nums');var l=el('div','lab',P.label,'font-size:'+(P.d*.1)+'px;margin-top:4px');b.appendChild(n);b.appendChild(l);L.inner.appendChild(b);
  return function(t){var v=lerp(P.from||0,P.to,eo((t-(P.ts!=null?P.ts:L.t0))/(P.dur||1)));n.textContent=(P.pre||'')+cnt(v,P.fmt)+(P.suf||'');var pl=P.pulse&&t<P.ts+P.dur?1+.1*Math.max(0,Math.sin(t*14)):1;b.style.transform='scale('+pl+')';};
};
// ---- stat panel with count-up ----
T.stat=function(L,P){
  var b=el('div','panel '+(P.k||''),'','width:'+P.w+'px;height:'+P.h+'px;padding:18px 24px;'+(P.k==='lime'?'':'')+'overflow:hidden');
  b.appendChild(el('div','lab',P.label,'font-size:'+(P.ls||20)+'px;'+(P.k==='lime'?'':'color:'+LIME)));
  var n=el('div','d','','font-size:'+P.size+'px;margin-top:'+(P.mt||10)+'px;font-variant-numeric:tabular-nums;'+(P.k==='lime'?'color:'+NAVY:'color:'+ICE));b.appendChild(n);
  if(P.sub)b.appendChild(el('div','lab',P.sub,'font-size:'+(P.ss||17)+'px;margin-top:8px;opacity:.85'));
  L.inner.appendChild(b);
  return function(t){var v=lerp(P.from||0,P.to,eo((t-(P.ts!=null?P.ts:L.t0))/(P.dur||1)));n.textContent=(P.pre||'')+cnt(v,P.fmt)+(P.suf||'');};
};
T.chips=function(L,P){
  var w=el('div','','','display:flex;flex-wrap:wrap;gap:12px;width:'+(P.w||768)+'px');
  var cs=P.items.map(function(it){var c=el('span','chip '+(it.k||''),it.txt,(P.size?'font-size:'+P.size+'px;':''));w.appendChild(c);return {c:c,t:it.t};});L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var u=t-(o.t!=null?o.t:L.t0);var p=eb(u/.25);o.c.style.opacity=clamp(u/.05,0,1);o.c.style.transform='scale('+lerp(.6,1,clamp(p,0,1.05))+')';});};
};
// ---- terminal ----
T.term=function(L,P){
  var b=el('div','panel fill','','width:'+P.w+'px;padding:18px 24px;border-color:'+(P.k==='l'?LIME:NAVY));
  var ls=P.lines.map(function(ln){var d=el('div','q','','white-space:nowrap;color:'+ICE);b.appendChild(d);return {d:d,ln:ln};});L.inner.appendChild(b);
  return function(t){ls.forEach(function(o){var u=t-(o.ln.t!=null?o.ln.t:L.t0),n=Math.floor(clamp(u/(o.ln.dur||.4),0,1)*o.ln.txt.length);var done=n>=o.ln.txt.length;
    var plain=o.ln.txt;var html='<span class="lime">&gt;</span> '+plain.slice(0,n).replace(/\[([^\]]+)\]/g,'<span class="lime">$1</span>');
    o.d.innerHTML=u<0?'':html+(!done||(Math.floor(t*3)%2&&o.ln===P.lines[P.lines.length-1])?'<span class="lime">▌</span>':'');});};
};
// ---- brand row: OpenAI logo → target ----
T.brands=function(L,P){
  var w=el('div','','','display:flex;align-items:center;gap:18px;width:768px');
  var a=el('div','chip','<span style="display:inline-block;width:34px;vertical-align:middle;margin-right:10px">'+OAI+'</span>OPENAI AGENTS','font-size:26px;padding:14px 20px');
  var ar=el('div','','→','font:700 56px Anton;color:'+LIME);
  var b=el('div','chip l',P.to||'HUGGING FACE','font-size:26px;padding:14px 20px');
  w.appendChild(a);w.appendChild(ar);w.appendChild(b);L.inner.appendChild(w);
  return function(t){var u=t-L.t0;ar.style.transform='translateX('+(Math.sin(t*6)*6)+'px)';b.style.opacity=clamp((u-.2)/.1,0,1);ar.style.opacity=clamp((u-.1)/.1,0,1);};
};
// ---- proxy breach flow ----
T.flow3=function(L,P){
  var w=P.w,h=P.h,b=el('div','panel','','width:'+w+'px;height:'+h+'px;overflow:hidden');
  function node(x,lab,ico,sh){var n=el('div','','','position:absolute;left:'+x+'px;top:'+(h/2-90)+'px;width:180px;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:4px solid '+ICE+';'+(sh==='c'?'border-radius:50%':'')+';background:'+NAVY);n.innerHTML='<div style="width:70px">'+ic(ico,70)+'</div><div class="lab" style="font-size:18px;margin-top:8px">'+lab+'</div>';b.appendChild(n);return n;}
  var n1=node(28,'SANDBOX','lock','c'),n3=node(w-208,'OPEN WEB','world','c');
  var n2=el('div','','','position:absolute;left:'+(w/2-80)+'px;top:'+(h/2-80)+'px;width:160px;height:160px;transform:rotate(45deg);border:4px solid '+ICE+';background:'+NAVY);b.appendChild(n2);
  var n2l=el('div','','<div style="width:64px;margin:0 auto">'+ic('package',64)+'</div><div class="lab" style="font-size:18px;margin-top:6px;text-align:center">PROXY</div>','position:absolute;left:'+(w/2-80)+'px;top:'+(h/2-50)+'px;width:160px;text-align:center');b.appendChild(n2l);
  var l1=el('div','','','position:absolute;left:208px;top:'+(h/2-3)+'px;width:'+(w/2-80-208)+'px;height:6px;background:'+ICE);var l2=el('div','','','position:absolute;left:'+(w/2+80)+'px;top:'+(h/2-3)+'px;width:'+(w-208-(w/2+80))+'px;height:6px;background:rgba(238,241,255,.25)');b.appendChild(l1);b.appendChild(l2);
  var pk=[];for(var i=0;i<7;i++){var p=el('i','','','position:absolute;width:20px;height:20px;background:'+LIME+';top:'+(h/2-10)+'px');b.appendChild(p);pk.push(p);}
  var x1=el('div','d','✕','position:absolute;left:'+(w/2-30)+'px;top:'+(h/2+88)+'px;font-size:60px;color:'+ICE);b.appendChild(x1);
  var zd=el('div','chip l','ZERO-DAY','position:absolute;left:'+(w/2-80)+'px;top:14px;transform-origin:50% 50%');b.appendChild(zd);
  var st=el('div','lab lime','','position:absolute;left:24px;bottom:14px;font-size:20px');b.appendChild(st);
  L.inner.appendChild(b);
  return function(t){var tb=P.breachT,u=t-L.t0,open=t>=tb;
    var fl=clamp(1-(t-tb)/.35,0,1)*(open?1:0);n2.style.background=fl>0?LIME:NAVY;n2.style.borderColor=open?LIME:ICE;
    l2.style.background=open?LIME:'rgba(238,241,255,.25)';n3.style.borderColor=open?LIME:ICE;
    zd.style.opacity=open?1:0;zd.style.transform='scale('+(open?1+.4*(1-clamp(eb((t-tb)/.2),0,1)):1)+')';
    st.textContent=open?'> filtered connection → open internet':'> outbound: blocked by filter';
    x1.style.opacity=open?0:(Math.floor(t*4)%2?1:.3);
    for(var i=0;i<pk.length;i++){var ph=((t*.45)+i/pk.length)%1;var x,op=1;
      if(!open){var q=ph*.52;x=208+(w/2-80-208)*Math.min(1,q/.52*1.0);if(ph>.5){op=0;}x=208+(w/2-80-208)*(ph/.5);}
      else{x=lerp(208,w-208-20,ph);}
      pk[i].style.left=x+'px';pk[i].style.opacity=!open&&ph>.5?0:1;pk[i].style.background=(open&&x>w/2)?LIME:(open?ICE:LIME);}};
};
// ---- chat feed + quote ----
T.chat=function(L,P){
  var w=P.w,b=el('div','','','position:relative;width:'+w+'px;height:'+P.h+'px');
  var items=P.items.map(function(it,i){var d=el('div','panel '+(it.hi?'lime':''),'','position:absolute;top:'+(it.y)+'px;left:'+(it.right?(w-it.w):0)+'px;width:'+it.w+'px;padding:14px 22px;'+(it.right?'border-radius:26px 0 26px 26px':'border-radius:0 26px 26px 26px'));
    d.innerHTML='<div class="lab" style="font-size:15px;opacity:.75;margin-bottom:4px">'+it.who+'</div><div class="q" style="font-size:'+(it.fs||26)+'px">'+(it.skel?'<i style="display:block;height:14px;width:78%;background:rgba(238,241,255,.45);margin:8px 0 4px"></i><i style="display:block;height:14px;width:48%;background:rgba(238,241,255,.3)"></i>':(it.hi?'':it.txt))+'</div>';b.appendChild(d);return {d:d,it:it,q:d.lastChild};});
  L.inner.appendChild(b);
  return function(t){items.forEach(function(o){var it=o.it,u=t-it.t;var p=eo5(u/.28);o.d.style.opacity=clamp(u/.06,0,1);o.d.style.transform='translateX('+lerp(it.right?120:-120,0,p)+'px)';
    if(it.hi){var n=Math.floor(clamp((t-it.t)/(it.dur||2),0,1)*it.txt.length);o.q.textContent='“'+it.txt.slice(0,n)+(n<it.txt.length?'▌':'”');}});};
};
// ---- hours clock + progress ----
T.clock=function(L,P){
  var b=el('div','panel '+(P.k||''),'','width:'+P.w+'px;height:'+P.h+'px;padding:18px 24px');
  b.appendChild(el('div','lab',P.label,'font-size:20px;color:'+LIME));var n=el('div','d','','font-size:'+P.size+'px;margin-top:8px;font-variant-numeric:tabular-nums');b.appendChild(n);
  var bar=el('div','','','position:absolute;left:24px;right:24px;bottom:22px;height:24px;border:3px solid '+ICE);var f=el('i','','','position:absolute;left:0;top:0;bottom:0;background:'+LIME);bar.appendChild(f);b.appendChild(bar);
  L.inner.appendChild(b);
  return function(t){var p=eo((t-P.ts)/P.dur);n.textContent='<'+(Math.round(p*13*10)/10).toFixed(1).replace('.0','')+'H';if(p>=1)n.textContent='<13H';f.style.width=(p*100)+'%';};
};
// ---- monitor (illustrative) ----
T.monitor=function(L,P){
  var w=P.w,h=P.h,b=el('div','panel','','width:'+w+'px;height:'+h+'px;overflow:hidden');
  b.appendChild(el('div','lab',"HUGGING FACE · AI MONITOR",'position:absolute;left:24px;top:16px;font-size:18px;color:'+LIME));
  b.appendChild(el('div','chip o','ILLUSTRATIVE','position:absolute;right:16px;top:12px;font-size:13px;padding:3px 8px;border-width:2px'));
  var log=el('div','','','position:absolute;left:24px;top:56px;width:'+(w/2-10)+'px;height:'+(h-90)+'px;overflow:hidden');b.appendChild(log);
  var rows=[];for(var i=0;i<8;i++){var r=el('div','q','','font-size:20px;white-space:nowrap;position:absolute;left:0');log.appendChild(r);rows.push(r);}
  var mx=w/2+30,mw=w/2-60;
  b.appendChild(el('div','lab','BEHAVIOR','position:absolute;left:'+mx+'px;top:64px;font-size:18px'));
  var tr=el('div','','','position:absolute;left:'+mx+'px;top:100px;width:'+mw+'px;height:36px;border:3px solid '+ICE+';background:linear-gradient(90deg,rgba(238,241,255,.12),rgba(200,255,46,.5))');b.appendChild(tr);
  var kn=el('i','','','position:absolute;top:-10px;width:12px;height:50px;background:'+LIME+';left:0;border:3px solid '+NAVY);tr.appendChild(kn);
  b.appendChild(el('div','lab','NORMAL','position:absolute;left:'+mx+'px;top:146px;font-size:15px;opacity:.8'));b.appendChild(el('div','lab','UNUSUAL','position:absolute;left:'+(mx+mw-92)+'px;top:146px;font-size:15px;color:'+LIME));
  var al=el('div','','⚠ UNUSUAL BEHAVIOR','position:absolute;left:'+mx+'px;right:24px;bottom:22px;padding:14px 14px;background:'+LIME+';color:'+NAVY+';font:700 24px JB;letter-spacing:.06em;text-align:center');b.appendChild(al);
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0;var k=eo((t-P.flagT)/.5);var j=clamp((t-L.t0)/(P.flagT-L.t0),0,1);kn.style.left=(lerp(.08,.95,P.flagT?(t<P.flagT?eo(j)*.9:1):1)*mw-6)+'px';
    var on=t>=P.flagT;al.style.opacity=on?(Math.floor(t*4)%2?1:.75):0;al.style.transform='scale('+(on?1+.25*(1-clamp(eb((t-P.flagT)/.2),0,1)):.9)+')';
    var off=(t*3.2);rows.forEach(function(r,i){var idx=Math.floor(off)+i;var y=((i-(off%1))*34);r.style.top=y+'px';r.innerHTML='<span class="lime">&gt;</span> read cyber dataset '+(idx%97+1);r.style.opacity=(t>=P.rdT)?1-i/10:0;});};
};
// ---- why: safeguards slider + logic chain ----
T.safe=function(L,P){
  var w=P.w,h=P.h,b=el('div','panel','','width:'+w+'px;height:'+h+'px;padding:18px 24px');
  b.appendChild(el('div','lab','SAFEGUARDS','font-size:20px;color:'+LIME));
  var tr=el('div','','','position:absolute;left:24px;right:24px;top:'+(h*.48)+'px;height:18px;background:rgba(238,241,255,.2)');var f=el('i','','','position:absolute;left:0;top:0;bottom:0;background:'+LIME);tr.appendChild(f);var kn=el('i','','','position:absolute;top:-16px;width:34px;height:50px;background:'+ICE+';border:4px solid '+NAVY);tr.appendChild(kn);b.appendChild(tr);
  var hi=el('div','lab','HIGH','position:absolute;right:24px;top:'+(h*.48+34)+'px;font-size:16px;opacity:.7');var lo=el('div','lab','LOW','position:absolute;left:24px;top:'+(h*.48+34)+'px;font-size:16px;opacity:.7');b.appendChild(hi);b.appendChild(lo);
  var tg=el('div','chip l','TURNED DOWN ON PURPOSE · OPENAI SAYS','position:absolute;left:24px;bottom:16px;font-size:17px;padding:5px 10px');b.appendChild(tg);
  L.inner.appendChild(b);var wdt=w-48;
  return function(t){var p=eo((t-P.ts)/.9);var v=lerp(.92,.14,p);kn.style.left=(v*wdt-17)+'px';f.style.width=(v*100)+'%';tg.style.opacity=clamp((t-P.ts-.5)/.15,0,1);};
};
T.chain=function(L,P){
  var w=el('div','','','display:flex;align-items:center;gap:10px;width:768px');
  var cs=P.items.map(function(it,i){var c=el('div','panel '+(it.k||''),'','flex:1;height:'+P.h+'px;padding:12px 14px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center');c.innerHTML='<div style="width:54px">'+ic(it.ic,54)+'</div><div class="lab" style="font-size:17px;margin-top:8px;white-space:normal;line-height:1.25">'+it.txt+'</div>';w.appendChild(c);
    var ar=null;if(i<P.items.length-1){ar=el('div','d','→','font-size:44px;color:'+LIME);w.appendChild(ar);}return {c:c,ar:ar,t:it.t};});
  L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var u=t-o.t,p=eb(u/.28);o.c.style.opacity=clamp(u/.05,0,1);o.c.style.transform='scale('+lerp(.7,1,clamp(p,0,1.05))+')';if(o.ar)o.ar.style.opacity=clamp((u-.15)/.1,0,1);});};
};
// ---- timeline ----
T.timeline=function(L,P){
  var h=P.items.length*P.step+10,b=el('div','','','position:relative;width:768px;height:'+h+'px');
  var line=el('div','','','position:absolute;left:30px;top:20px;width:6px;height:'+(h-40)+'px;background:rgba(238,241,255,.2)');var fill=el('i','','','position:absolute;left:0;top:0;width:100%;background:'+LIME);line.appendChild(fill);b.appendChild(line);
  var its=P.items.map(function(it,i){var y=i*P.step;var d=el('i','','','position:absolute;left:12px;top:'+(y+8)+'px;width:42px;height:42px;border-radius:50%;background:'+NAVY+';border:5px solid '+ICE);b.appendChild(d);
    var c=el('div','panel '+(it.k||''),'','position:absolute;left:84px;top:'+y+'px;width:684px;height:'+(P.step-14)+'px;padding:10px 20px;display:flex;flex-direction:column;justify-content:center');
    c.innerHTML='<div class="lab" style="font-size:18px;'+(it.k==='lime'?'':'color:'+LIME)+'">'+it.date+'</div><div class="d" style="font-size:'+(it.fs||44)+'px;margin-top:4px;'+(it.k==='lime'?'color:'+NAVY:'')+'">'+it.txt+'</div>';b.appendChild(c);return {d:d,c:c,t:it.t,y:y};});
  L.inner.appendChild(b);
  return function(t){var last=0;its.forEach(function(o,i){var u=t-o.t,p=eo5(u/.3);o.c.style.opacity=clamp(u/.06,0,1);o.c.style.transform='translateX('+lerp(120,0,p)+'px)';var on=t>=o.t;o.d.style.background=on?LIME:NAVY;o.d.style.borderColor=on?LIME:ICE;o.d.style.transform='scale('+(on?1+.5*Math.max(0,1-u/.25):1)+')';if(on)last=o.y+28;});fill.style.height=last+'px';};
};
T.stamp=function(L,P){
  var s=el('div','','','border:6px solid '+LIME+';color:'+LIME+';background:rgba(10,16,80,.9);font:400 '+(P.size||44)+'px Anton;text-transform:uppercase;padding:6px 20px;white-space:nowrap;transform:rotate('+(P.rot||-5)+'deg)');s.innerHTML=P.txt;L.inner.appendChild(s);return function(){};
};
T.cta=function(L,P){
  var w=el('div','panel fill','','width:768px;height:'+P.h+'px;border-color:'+LIME+';display:flex;align-items:center;gap:34px;padding:0 34px');
  w.appendChild(el('div','',"<img src='profile.jpg' style='width:100%;height:100%;object-fit:cover;display:block'>",'width:250px;height:250px;border-radius:50%;overflow:hidden;border:10px solid '+LIME+';flex:none;box-shadow:0 0 0 6px '+NAVY));
  var r=el('div','','');r.appendChild(el('div','d','@sandesh<br>.explains','font-size:72px;line-height:.98'));
  var btn=el('div','','FOLLOW →','margin-top:22px;display:inline-block;background:'+LIME+';color:'+NAVY+';font:400 52px Anton;padding:8px 34px;letter-spacing:.04em');r.appendChild(btn);w.appendChild(r);L.inner.appendChild(w);
  return function(t){var u=t-L.t0;btn.style.transform='scale('+(1+.06*Math.sin(u*7)*clamp(u-.4,0,1))+')';w.style.borderColor=(Math.floor(u*3)%2)?LIME:ICE;};
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
