// "Control Room" components — every one is a pure function of absolute time t.
(function(){
'use strict';
var U=window.U, clamp=U.clamp, lerp=U.lerp, sm=U.sm;
function eo(x){x=clamp(x,0,1);return x>=1?1:1-Math.pow(2,-10*x);}
function eb(x){x=clamp(x,0,1);var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function fmt(v,d){var s=Number(v).toFixed(d||0);var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return p.join('.');}
var COL={org:'#ff8a1f',grn:'#3dff9a',red:'#ff3355',ice:'#e6f1ff',dim:'#7f93ad',blu:'#5ab4ff',yel:'#ffd23d'};
function C(c){return COL[c]||c||COL.ice;}
function ICON(name,size,col){var p=(window.DATA.icons||{})[name]||'';return '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
function T0(o,i,L,gap){return o.t!=null?o.t:L.t0+.12+(gap||.14)*i;}

function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.22,0,1),clip='';
  if(k==='slam'){var p=eo(u/.28);a=clamp(u/.08,0,1);tr='scale('+lerp(1.4,1,p)+')';}
  else if(k==='pop'){var q=eb(u/.4);a=clamp(u/.08,0,1);tr='scale('+lerp(.6,1,q)+')';}
  else if(k==='rise'){var r=eo(u/.45);a=clamp(u/.14,0,1);tr='translateY('+lerp(60,0,r)+'px)';}
  else if(k==='left'){var l=eo(u/.5);a=clamp(u/.12,0,1);tr='translateX('+lerp(-200,0,l)+'px)';}
  else if(k==='right'){var rr=eo(u/.5);a=clamp(u/.12,0,1);tr='translateX('+lerp(200,0,rr)+'px)';}
  else if(k==='wipe'){var w=eo(u/.6);a=1;clip='inset(0 '+((1-w)*100)+'% 0 0)';}
  else{a=clamp(u/.2,0,1);}
  a*=ex; if(ex<1)tr+=' scale('+lerp(.98,1,ex)+')';
  L.wrap.style.opacity=a;L.wrap.style.transform=tr;L.wrap.style.clipPath=clip||'none';
}
var T={};

// ---- HUD: persistent top bar + eyebrow ----
T.hud=function(L,P){
  var w=L.inner;w.style.cssText='position:absolute;left:0;top:0;width:1920px;height:140px';
  w.appendChild(el('div','mono','<span class="org">●</span> GRID // CONTROL ROOM','position:absolute;left:60px;top:32px;font-size:20px;letter-spacing:.12em;color:#7f93ad'));
  w.appendChild(el('div','mono',P.loc,'position:absolute;left:0;right:0;top:32px;text-align:center;font-size:20px;letter-spacing:.12em;color:#7f93ad'));
  var hz=el('div','mono','','position:absolute;right:60px;top:32px;font-size:20px;letter-spacing:.12em;color:'+COL.grn);w.appendChild(hz);
  w.appendChild(el('div','mono',P.eb,'position:absolute;left:60px;top:82px;font-size:24px;letter-spacing:.16em;color:'+COL.org+';border-left:6px solid '+COL.org+';padding-left:16px'));
  return function(t){hz.textContent=(60+0.02*Math.sin(t*3.1)+0.012*Math.sin(t*7.7)).toFixed(2)+' Hz · NOMINAL';};
};
// ---- big headline, lines timed ----
T.title=function(L,P){
  var ls=P.lines.map(function(ln){var d=el('div','u',ln.txt,'font-size:'+(ln.size||84)+'px;white-space:nowrap;color:#e6f1ff;text-shadow:0 8px 40px rgba(0,0,0,.7);'+(ln.mt?'margin-top:'+ln.mt+'px;':''));L.inner.appendChild(d);return {d:d,ln:ln};});
  return function(t){ls.forEach(function(o){var t0=o.ln.t!=null?o.ln.t:L.t0,u=t-t0,p=eo(u/.3);o.d.style.opacity=clamp(u/.08,0,1);o.d.style.transform='translateY('+lerp(34,0,p)+'px) scale('+lerp(1.12,1,p)+')';o.d.style.transformOrigin='0 50%';});};
};
// ---- status cards ----
T.cards=function(L,P){
  var w=el('div','','','display:flex;gap:'+(P.gap||30)+'px');
  var cs=P.items.map(function(it,i){var c=el('div','panel','','width:'+(P.cw||400)+'px;height:'+(P.ch||210)+'px;padding:22px 26px;border-top-color:'+C(it.c));
    c.appendChild(el('div','tag',it.tag));c.appendChild(el('div','u',it.name,'font-size:29px;margin-top:8px;white-space:nowrap'));
    c.appendChild(el('div','mono','● '+it.status,'margin-top:16px;font-size:26px;color:'+C(it.c)));c.appendChild(el('div','tag',it.sub,'margin-top:10px'));w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.3),p=eb((t-t0)/.4);o.c.style.opacity=clamp((t-t0)/.1,0,1);o.c.style.transform='translateY('+lerp(40,0,eo((t-t0)/.4))+'px) scale('+lerp(.9,1,p)+')';
    if(o.it.c==='red'){var f=.5+.5*Math.sin(t*5);o.c.style.boxShadow='0 26px 70px rgba(0,0,0,.6),0 0 '+(10+16*f)+'px rgba(255,51,85,'+(.15+.25*f)+')';}});};
};
// ---- single-line diagram with flow dots ----
T.diagram=function(L,P){
  var W=P.w||1200,H=P.h||150,n=P.nodes.length,step=(W-120)/(n-1),y=H/2-10;
  var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width',W);svg.setAttribute('height',H);
  function sym(k,x,c){var g='';
    if(k==='gen')g='<circle cx="'+x+'" cy="'+y+'" r="40" fill="#0b1422" stroke="'+c+'" stroke-width="4"/><path d="M'+(x-20)+' '+y+'q10 -22 20 0t20 0" stroke="'+c+'" stroke-width="4" fill="none"/>';
    else if(k==='brk')g='<rect x="'+(x-30)+'" y="'+(y-30)+'" width="60" height="60" fill="#0b1422" stroke="'+c+'" stroke-width="4"/><path d="M'+(x-18)+' '+(y+14)+'L'+(x+18)+' '+(y-14)+'" stroke="'+c+'" stroke-width="4"/>';
    else if(k==='xfmr')g='<circle cx="'+(x-18)+'" cy="'+y+'" r="32" fill="#0b1422" stroke="'+c+'" stroke-width="4"/><circle cx="'+(x+18)+'" cy="'+y+'" r="32" fill="none" stroke="'+c+'" stroke-width="4"/>';
    else if(k==='load')g='<rect x="'+(x-32)+'" y="'+(y-40)+'" width="64" height="80" fill="#0b1422" stroke="'+c+'" stroke-width="4"/><path d="M'+(x-18)+' '+(y-22)+'h36M'+(x-18)+' '+(y-4)+'h36M'+(x-18)+' '+(y+14)+'h36" stroke="'+c+'" stroke-width="3"/>';
    else if(k==='turb')g='<circle cx="'+x+'" cy="'+y+'" r="40" fill="#0b1422" stroke="'+c+'" stroke-width="4"/><path d="M'+x+' '+y+'L'+x+' '+(y-30)+'M'+x+' '+y+'L'+(x+26)+' '+(y+15)+'M'+x+' '+y+'L'+(x-26)+' '+(y+15)+'" stroke="'+c+'" stroke-width="5"/>';
    else if(k==='sun')g='<circle cx="'+x+'" cy="'+y+'" r="22" fill="#0b1422" stroke="'+c+'" stroke-width="4"/><path d="M'+x+' '+(y-40)+'v12M'+x+' '+(y+28)+'v12M'+(x-40)+' '+y+'h12M'+(x+28)+' '+y+'h12" stroke="'+c+'" stroke-width="4"/>';
    else g='<rect x="'+(x-8)+'" y="'+(y-34)+'" width="16" height="68" fill="'+c+'"/>';
    return g;}
  var html='',nodes=[];
  P.nodes.forEach(function(nd,i){var x=60+i*step;nodes.push({x:x,nd:nd});});
  html+=nodes.map(function(o,i){return i?'<path class="ln'+i+'" d="M'+(nodes[i-1].x+50)+' '+y+'H'+(o.x-50)+'" stroke="#7f93ad" stroke-width="4" fill="none"/>':'';}).join('');
  svg.innerHTML=html+nodes.map(function(o,i){var c=C(o.nd.state==='fault'?'red':o.nd.state==='ok'?'ice':'dim');return '<g class="nd'+i+'">'+sym(o.nd.k,o.x,c)+'<text x="'+o.x+'" y="'+(H-6)+'" text-anchor="middle" fill="'+(o.nd.state==='fault'?COL.red:COL.dim)+'" font-family="JBMono" font-weight="700" font-size="17" letter-spacing="2">'+o.nd.l+'</text></g>';}).join('');
  var dots=[];for(var k=0;k<14;k++){var d=document.createElementNS(ns,'circle');d.setAttribute('r',7);d.setAttribute('cy',y);d.setAttribute('fill',COL.org);svg.appendChild(d);dots.push(d);}
  L.inner.appendChild(svg);
  var fi=P.nodes.findIndex(function(x){return x.state==='fault';});
  return function(t){var u=t-L.t0;P.nodes.forEach(function(nd,i){var g=svg.querySelector('.nd'+i),p=eb((u-.08*i)/.4);g.style.opacity=clamp((u-.08*i)/.1,0,1);});
    var limit=fi>=0?nodes[fi].x-60:nodes[n-1].x;var span=nodes[n-1].x-nodes[0].x;
    dots.forEach(function(d,k){var f=((u*.28+k/14)%1),x=nodes[0].x+f*span;if(x>limit){d.setAttribute('opacity',0);return;}d.setAttribute('cx',x);d.setAttribute('opacity',u>.5?1:0);});
    if(fi>=0){var f2=.55+.45*Math.sin(t*6);svg.querySelector('.nd'+fi).style.opacity=clamp((u-.08*fi)/.1,0,1)*f2+(1-f2)*.6;}};
};
// ---- live ticker panel ----
T.ticker=function(L,P){
  var b=el('div','panel','','width:'+(P.w||520)+'px;padding:22px 26px');b.appendChild(el('div','tag',P.title));
  var rows=P.rows.map(function(r,i){var d=el('div','mono','','margin-top:12px;font-size:24px;color:#e6f1ff;display:flex;justify-content:space-between;gap:16px');d.appendChild(el('span','',r.l));d.appendChild(el('span','',r.v,'color:'+C(r.c)));b.appendChild(d);return {d:d,r:r,i:i};});
  L.inner.appendChild(b);return function(t){rows.forEach(function(o){var t0=T0(o.r,o.i,L,.25);o.d.style.opacity=clamp((t-t0)/.15,0,1);o.d.style.transform='translateX('+lerp(30,0,eo((t-t0)/.35))+'px)';});};
};
// ---- photo inset with slow drift ----
T.inset=function(L,P){
  var f=el('div','','','width:'+P.w+'px;height:'+P.h+'px;border:2px solid '+C(P.c||'org')+';box-shadow:0 24px 60px rgba(0,0,0,.65),0 0 0 6px rgba(7,11,18,.7);position:relative;overflow:hidden;background:#000');
  var im=el('div','','','position:absolute;inset:-6%;background:url(shots/'+P.img+'.jpg) center/cover');f.appendChild(im);
  if(P.label)f.appendChild(el('div','mono',P.label,'position:absolute;left:0;right:0;bottom:0;padding:8px 14px;font-size:16px;letter-spacing:.12em;background:rgba(7,11,18,.86);color:'+C(P.c||'org')));
  L.inner.appendChild(f);return function(t){var u=t-L.t0,s=1.04+.07*Math.min(u/6,1.4);im.style.transform='scale('+s+') translate('+(-12*Math.sin(u*.3))+'px,'+(-8*u*.1)+'px)';};
};
// ---- semicircle dial ----
T.dial=function(L,P){
  var W=P.w||560,cx=W/2,cy=W/2-20,r=W/2-50,ns='http://www.w3.org/2000/svg';
  var b=el('div','panel','','width:'+(W+60)+'px;padding:22px 30px');if(P.title)b.appendChild(el('div','tag',P.title));
  var svg=document.createElementNS(ns,'svg');svg.setAttribute('width',W);svg.setAttribute('height',W/2+30);
  function arc(a0,a1){var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);return 'M'+x0+' '+y0+' A'+r+' '+r+' 0 '+(a1-a0>Math.PI?1:0)+' 1 '+x1+' '+y1;}
  svg.innerHTML='<path d="'+arc(Math.PI,2*Math.PI)+'" stroke="#2a3a52" stroke-width="34" fill="none"/><path class="a" d="" stroke="'+C(P.c||'org')+'" stroke-width="34" fill="none" style="filter:drop-shadow(0 0 12px '+C(P.c||'org')+')"/>'+
   '<text class="v" x="'+cx+'" y="'+(cy-30)+'" text-anchor="middle" fill="#e6f1ff" font-family="Unb" font-weight="900" font-size="84"></text><text x="'+cx+'" y="'+(cy+2)+'" text-anchor="middle" fill="'+C(P.c||'org')+'" font-family="JBMono" font-weight="700" font-size="22" letter-spacing="3">'+(P.unit||'')+'</text>'+
   '<text x="'+(cx-r)+'" y="'+(cy+28)+'" text-anchor="middle" fill="#7f93ad" font-family="JBMono" font-weight="700" font-size="17">0</text><text x="'+(cx+r)+'" y="'+(cy+28)+'" text-anchor="middle" fill="#7f93ad" font-family="JBMono" font-weight="700" font-size="17">'+fmt(P.max)+'</text>';
  b.appendChild(svg);if(P.sub)b.appendChild(el('div','mono',P.sub,'font-size:21px;color:#7f93ad;margin-top:2px'));
  L.inner.appendChild(b);var pa=svg.querySelector('.a'),pv=svg.querySelector('.v');
  return function(t){var p=eo((t-L.t0-.15)/1.1),v=P.val*p;pa.setAttribute('d',v>0.5?arc(Math.PI,Math.PI+Math.PI*clamp(v/P.max,0,1)):'');pv.textContent=(P.pre||'')+fmt(v,P.dec)+(P.suf||'');};
};
// ---- stat tile ----
T.stat=function(L,P){
  var b=el('div','panel','','width:'+(P.w||350)+'px;padding:20px 24px;border-top-color:'+C(P.c||'org'));
  var n=el('div','u','','font-size:'+(P.size||70)+'px;color:'+C(P.c||'org')+';white-space:nowrap');b.appendChild(n);
  if(P.u)b.appendChild(el('div','mono',P.u,'font-size:26px;color:#e6f1ff'));if(P.s)b.appendChild(el('div','tag',P.s,'margin-top:8px'));
  L.inner.appendChild(b);return function(t){var q=eo((t-L.t0-.05)/(P.count||.8));n.textContent=(P.pre||'')+fmt(lerp(P.from||0,P.val,q),P.dec)+(P.suf||'');};
};
// ---- timeline with markers ----
T.timeline=function(L,P){
  var W=P.w||1100,b=el('div','panel','','width:'+(W+56)+'px;padding:20px 28px 26px;height:'+(P.h||200)+'px');b.appendChild(el('div','tag',P.title));
  var bar=el('div','','','position:relative;margin-top:60px;height:8px;background:#2a3a52;border-radius:4px;width:'+W+'px');var fill=el('div','','','position:absolute;left:0;top:0;height:8px;background:'+COL.org+';border-radius:4px;width:0');bar.appendChild(fill);
  var ms=P.items.map(function(it,i){var d=el('div','','','position:absolute;left:'+it.p+'%;top:-34px;transform:translateX('+(it.p>88?'-100%':'-6px')+');opacity:0');
    d.appendChild(el('div','',null,'width:16px;height:16px;border-radius:50%;background:'+(it.hl?COL.org:COL.ice)+';margin-bottom:22px;box-shadow:0 0 12px '+(it.hl?COL.org:'transparent')+';'+(it.p>88?'margin-left:auto':'')));
    d.appendChild(el('div','u',it.y,'font-size:22px;white-space:nowrap'));d.appendChild(el('div','tag',it.l,'white-space:nowrap'));bar.appendChild(d);return {d:d,it:it,i:i};});
  b.appendChild(bar);L.inner.appendChild(b);
  return function(t){var mx=0;ms.forEach(function(o){var t0=T0(o.it,o.i,L,.5),p=clamp((t-t0)/.3,0,1);o.d.style.opacity=p;o.d.style.transform=(o.it.p>88?'translateX(-100%)':'translateX(-6px)')+' translateY('+lerp(12,0,p)+'px)';if(t>=t0)mx=Math.max(mx,o.it.p);});fill.style.width=mx+'%';};
};
// ---- vertical bars (price staircase) ----
T.stairs=function(L,P){
  var W=P.w||1000,H=P.h||520,b=el('div','panel','','width:'+W+'px;height:'+(H+60)+'px;padding:20px 28px');b.appendChild(el('div','tag',P.title));
  var plot=el('div','','','position:absolute;left:28px;right:28px;top:110px;bottom:64px;border-bottom:3px solid #2a3a52');b.appendChild(plot);
  var ph=H-174;
  if(P.cap){var cl=el('div','','','position:absolute;left:0;right:0;top:'+(ph*(1-P.cap.v/P.max))+'px;border-top:2px dashed '+COL.red+';opacity:0');cl.appendChild(el('div','mono',P.cap.l,'position:absolute;right:0;top:-30px;font-size:20px;color:'+COL.red));plot.appendChild(cl);}
  var bw=P.bw||230,gap=(W-56-bw*P.items.length)/(P.items.length+1);
  var bs=P.items.map(function(it,i){var x=gap+i*(bw+gap);var bar=el('div','','','position:absolute;left:'+x+'px;bottom:0;width:'+bw+'px;height:0;background:linear-gradient(180deg,'+C(it.c)+','+C(it.c)+'66);box-shadow:0 0 36px '+C(it.c)+'55');
    var v=el('div','u','','position:absolute;left:'+x+'px;width:'+bw+'px;text-align:center;font-size:40px');var l=el('div','mono',it.y,'position:absolute;left:'+x+'px;bottom:-44px;width:'+bw+'px;text-align:center;font-size:22px;color:#7f93ad');
    plot.appendChild(bar);plot.appendChild(v);plot.appendChild(l);return {bar:bar,v:v,it:it,i:i};});
  L.inner.appendChild(b);
  return function(t){bs.forEach(function(o){var t0=T0(o.it,o.i,L,.5),p=eo((t-t0)/.7),h=Math.max(14,o.it.v/P.max*ph)*p;o.bar.style.height=h+'px';o.v.style.bottom=(h+12)+'px';o.v.style.opacity=clamp((t-t0)/.15,0,1);o.v.textContent='$'+fmt(o.it.v*p,2);});
    if(P.cap){plot.firstChild.style.opacity=clamp((t-(P.cap.t!=null?P.cap.t:L.t0+1))/.3,0,1);}};
};
// ---- utility bill ----
T.bill=function(L,P){
  var b=el('div','panel','','width:'+(P.w||750)+'px;padding:22px 30px;border-top-color:'+COL.red);b.appendChild(el('div','tag',P.title));
  P.lines.forEach(function(ln){var r=el('div','','','display:flex;justify-content:space-between;align-items:center;margin-top:20px;font:700 26px Inter;color:#7f93ad');r.appendChild(el('span','',ln.l));r.appendChild(el('span','',null,'display:block;height:20px;width:'+(ln.w*3)+'px;background:#25344b'));b.appendChild(r);});
  var hl=el('div','','','margin-top:28px;border:3px solid '+COL.red+';background:rgba(255,51,85,.10);padding:20px 24px;opacity:0');
  hl.appendChild(el('div','mono',P.hl.label,'font-size:20px;color:'+COL.red+';letter-spacing:.12em'));hl.appendChild(el('div','u',P.hl.val,'font-size:68px;margin-top:8px'));hl.appendChild(el('div','tag',P.hl.sub,'margin-top:6px'));b.appendChild(hl);
  if(P.foot)b.appendChild(el('div','mono',P.foot,'margin-top:20px;font-size:21px;color:#e6f1ff'));
  L.inner.appendChild(b);return function(t){var t0=P.th!=null?P.th:L.t0+.6,p=eb((t-t0)/.4);hl.style.opacity=clamp((t-t0)/.1,0,1);hl.style.transform='scale('+lerp(1.15,1,p)+')';};
};
// ---- donut with legend ----
T.donut=function(L,P){
  var S=P.size||340,r=S/2-30,cf=2*Math.PI*r,ns='http://www.w3.org/2000/svg';
  var b=el('div','panel','','width:'+(P.w||700)+'px;padding:22px 30px;display:flex;gap:34px;align-items:center');
  var left=el('div','','','position:relative;width:'+S+'px;height:'+S+'px;flex:none');var svg=document.createElementNS(ns,'svg');svg.setAttribute('width',S);svg.setAttribute('height',S);svg.style.transform='rotate(-90deg)';
  var tot=P.segs.reduce(function(a,s){return a+s.v;},0),acc=0,arcs=[];
  P.segs.forEach(function(s){var c=document.createElementNS(ns,'circle');c.setAttribute('cx',S/2);c.setAttribute('cy',S/2);c.setAttribute('r',r);c.setAttribute('fill','none');c.setAttribute('stroke',C(s.c));c.setAttribute('stroke-width',36);
    c.setAttribute('stroke-dasharray','0 '+cf);c.setAttribute('stroke-dashoffset',-acc/tot*cf);if(s.hatch)c.setAttribute('opacity',.8);svg.appendChild(c);arcs.push({c:c,len:s.v/tot*cf,s:s});acc+=s.v;});
  left.appendChild(svg);left.appendChild(el('div','u',P.center.n,'position:absolute;left:0;right:0;top:'+(S/2-40)+'px;text-align:center;font-size:54px'));left.appendChild(el('div','mono',P.center.l,'position:absolute;left:0;right:0;top:'+(S/2+20)+'px;text-align:center;font-size:18px;color:#7f93ad;letter-spacing:.1em'));
  b.appendChild(left);var lg=el('div','','','');P.segs.forEach(function(s){var d=el('div','','','display:flex;align-items:center;gap:12px;margin:12px 0;font:700 24px Inter');d.appendChild(el('span','',null,'width:18px;height:18px;background:'+C(s.c)));d.appendChild(el('span','',s.l));lg.appendChild(d);});b.appendChild(lg);
  if(P.title){var tg=el('div','tag',P.title,'position:absolute;left:30px;top:-0px;transform:translateY(-100%);');}
  L.inner.appendChild(b);
  return function(t){var p=eo((t-L.t0-.1)/1.0);arcs.forEach(function(a,i){var q=clamp(p*P.segs.length-i,0,1);a.c.setAttribute('stroke-dasharray',(a.len*q)+' '+cf);});};
};
// ---- Gantt: two bars with different speeds ----
T.gantt=function(L,P){
  var W=P.w||1100,b=el('div','panel','','width:'+W+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var rows=P.rows.map(function(r,i){var wr=el('div','','','margin-top:'+(i?30:22)+'px');wr.appendChild(el('div','u',r.l,'font-size:30px;margin-bottom:10px'));
    var tr=el('div','','','height:46px;background:#1a2638;position:relative;width:100%');var f=el('div','','','position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+C(r.c)+'88,'+C(r.c)+');box-shadow:0 0 24px '+C(r.c)+'66');tr.appendChild(f);
    var lab=el('div','mono','','position:absolute;right:14px;top:10px;font-size:22px;color:#07101a');f.appendChild(lab);wr.appendChild(tr);b.appendChild(wr);return {f:f,lab:lab,r:r,i:i};});
  var ax=el('div','','','display:flex;justify-content:space-between;margin-top:10px');(P.axis||[]).forEach(function(a){ax.appendChild(el('span','tag',a));});b.appendChild(ax);
  L.inner.appendChild(b);return function(t){rows.forEach(function(o){var t0=o.r.t!=null?o.r.t:L.t0+.3,p=eo((t-t0)/o.r.dur);o.f.style.width=(o.r.w*p)+'%';o.lab.textContent=p>.85?o.r.end:'';});};
};
// ---- US tile map (PJM footprint) ----
var TILES={AK:[0,0],ME:[10,0],WI:[5,1],VT:[9,1],NH:[10,1],WA:[0,2],ID:[1,2],MT:[2,2],ND:[3,2],MN:[4,2],IL:[5,2],MI:[6,2],NY:[8,2],MA:[9,2],OR:[0,3],NV:[1,3],WY:[2,3],SD:[3,3],IA:[4,3],IN:[5,3],OH:[6,3],PA:[7,3],NJ:[8,3],CT:[9,3],RI:[10,3],CA:[0,4],UT:[1,4],CO:[2,4],NE:[3,4],MO:[4,4],KY:[5,4],WV:[6,4],VA:[7,4],MD:[8,4],DE:[9,4],AZ:[1,5],NM:[2,5],KS:[3,5],AR:[4,5],TN:[5,5],NC:[6,5],SC:[7,5],DC:[8,5],OK:[3,6],LA:[4,6],MS:[5,6],AL:[6,6],GA:[7,6],HI:[0,7],TX:[3,7],FL:[8,7]};
T.tilemap=function(L,P){
  var s=P.s||64,g=6,b=el('div','panel','','padding:20px 24px;width:'+(11*(s+g)+48)+'px');b.appendChild(el('div','tag',P.title));
  var grid=el('div','','','position:relative;margin-top:16px;height:'+(8*(s+g))+'px');var ts={};
  Object.keys(TILES).forEach(function(k){var p=TILES[k];var d=el('div','mono',k,'position:absolute;left:'+(p[0]*(s+g))+'px;top:'+(p[1]*(s+g))+'px;width:'+s+'px;height:'+s+'px;background:#16233a;color:#4d6382;font-size:19px;display:flex;align-items:center;justify-content:center;border-radius:6px');grid.appendChild(d);ts[k]=d;});
  b.appendChild(grid);if(P.note)b.appendChild(el('div','mono',P.note,'margin-top:14px;font-size:20px;color:#e6f1ff'));L.inner.appendChild(b);
  return function(t){Object.keys(ts).forEach(function(k){ts[k].style.background='#16233a';ts[k].style.color='#4d6382';ts[k].style.boxShadow='none';});
    P.groups.forEach(function(g2){var t0=g2.t!=null?g2.t:L.t0+.4;g2.list.forEach(function(k,i){var u=t-t0-i*.06;if(u>0&&ts[k]){var p=eb(u/.3);ts[k].style.background=C(g2.c);ts[k].style.color='#07101a';ts[k].style.boxShadow='0 0 18px '+C(g2.c)+'88';ts[k].style.transform='scale('+lerp(.6,1,p)+')';}});});};
};
// ---- horizontal region bars ----
T.hbars=function(L,P){
  var b=el('div','panel','','width:'+(P.w||900)+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var rows=P.items.map(function(it,i){var r=el('div','','','display:flex;align-items:center;gap:20px;height:64px');r.appendChild(el('div','u',it.l,'width:210px;font-size:26px;flex:none'));
    var tr=el('div','','','flex:1;height:34px;background:#1a2638;position:relative');var f=el('div','','','position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+C(it.c)+'88,'+C(it.c)+')');tr.appendChild(f);r.appendChild(tr);var v=el('div','u','','width:190px;text-align:right;font-size:30px;color:'+C(it.c));r.appendChild(v);b.appendChild(r);return {f:f,v:v,it:it,i:i};});
  if(P.foot)b.appendChild(el('div','tag',P.foot,'margin-top:12px'));L.inner.appendChild(b);
  return function(t){rows.forEach(function(o){var t0=T0(o.it,o.i,L,.2),p=eo((t-t0)/.7);o.f.style.width=(o.it.v/P.max*100*p)+'%';o.v.textContent=(o.it.pre||'+')+fmt(o.it.v*p)+(P.suf||'');});};
};
// ---- vote tally ----
T.votes=function(L,P){
  var W=P.w||1000,b=el('div','panel','','width:'+W+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var bar=el('div','','','display:flex;height:70px;margin-top:20px;width:'+(W-60)+'px;background:#1a2638');var a=el('div','','','height:100%;width:0;background:'+COL.grn);var r=el('div','','','height:100%;width:0;background:'+COL.red);bar.appendChild(a);bar.appendChild(r);b.appendChild(bar);
  var row=el('div','','','display:flex;justify-content:space-between;margin-top:14px');var na=el('div','u','','font-size:84px;color:'+COL.grn),nb=el('div','u','','font-size:84px;color:'+COL.red);row.appendChild(na);row.appendChild(nb);b.appendChild(row);
  row=el('div','','','display:flex;justify-content:space-between');row.appendChild(el('span','tag','YEA'));row.appendChild(el('span','tag','NAY'));b.appendChild(row);L.inner.appendChild(b);
  return function(t){var p=eo((t-L.t0-.1)/.9),tot=P.a+P.b;a.style.width=(P.a/tot*(W-60)*p)+'px';r.style.width=Math.max(4,P.b/tot*(W-60))*p+'px';na.textContent=Math.round(P.a*p);nb.textContent=Math.round(P.b*p);};
};
// ---- load curve with data-center flexibility ----
T.curve=function(L,P){
  var W=P.w||1000,H=P.h||360,ns='http://www.w3.org/2000/svg',b=el('div','panel','','width:'+W+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var svg=document.createElementNS(ns,'svg');svg.setAttribute('width',W-60);svg.setAttribute('height',H);svg.style.marginTop='10px';
  var w=W-60,N=48;function base(i){var x=i/N;return .45+.22*Math.sin((x-.2)*Math.PI*2)*.9+.2*Math.exp(-Math.pow((x-.74)*7,2));}
  var cap=.93;function yv(v){return H-20-v*(H-60);}
  var bp='',dp='';for(var i=0;i<=N;i++){bp+=(i?'L':'M')+(i/N*w)+' '+yv(base(i));}
  svg.innerHTML='<line x1="0" x2="'+w+'" y1="'+yv(cap)+'" y2="'+yv(cap)+'" stroke="'+COL.red+'" stroke-width="2" stroke-dasharray="8 6"/><text x="'+w+'" y="'+(yv(cap)-8)+'" text-anchor="end" fill="'+COL.red+'" font-family="JBMono" font-weight="700" font-size="17">GRID CAPACITY</text>'+
   '<path class="dc" d="" fill="'+COL.org+'" opacity=".85"/><path d="'+bp+'" stroke="'+COL.ice+'" stroke-width="4" fill="none"/><rect class="pk" x="'+(.66*w)+'" y="0" width="'+(.18*w)+'" height="'+(H-20)+'" fill="'+COL.red+'" opacity="0"/><text class="pt" x="'+(.75*w)+'" y="30" text-anchor="middle" fill="'+COL.red+'" font-family="JBMono" font-weight="700" font-size="18" opacity="0">PEAK · AI PAUSES</text>';
  b.appendChild(svg);b.appendChild(el('div','mono',P.foot,'font-size:21px;color:#e6f1ff;margin-top:6px'));L.inner.appendChild(b);var dc=svg.querySelector('.dc'),pk=svg.querySelector('.pk'),pt=svg.querySelector('.pt');
  return function(t){var u=clamp((t-L.t0)/.8,0,1),cut=eo((t-(P.tCut!=null?P.tCut:L.t0+2))/.5);var top='',bot='';
    for(var i=0;i<=N;i++){var x=i/N,pkw=(x>.66&&x<.84)?1:0,add=.2*u*(1-cut*pkw);top+=(i?'L':'M')+(x*w)+' '+yv(base(i)+add);}
    for(var j=N;j>=0;j--){bot+='L'+(j/N*w)+' '+yv(base(j));}
    dc.setAttribute('d',top+bot+'Z');pk.setAttribute('opacity',.14*cut);pt.setAttribute('opacity',cut);};
};
// ---- reliability shortfall bar ----
T.shortfall=function(L,P){
  var W=P.w||1000,b=el('div','panel','','width:'+W+'px;padding:22px 30px;border-top-color:'+COL.red);b.appendChild(el('div','tag',P.title));
  var bar=el('div','','','position:relative;height:64px;margin-top:70px;width:'+(W-60)+'px;background:#1a2638');var have=el('div','','','position:absolute;left:0;top:0;bottom:0;width:0;background:'+COL.org);var gap=el('div','','','position:absolute;top:0;bottom:0;width:0;background:repeating-linear-gradient(45deg,'+COL.red+' 0 12px,#3a0f1a 12px 24px)');
  var tg=el('div','','','position:absolute;top:-34px;bottom:-14px;width:4px;background:'+COL.ice);tg.appendChild(el('div','mono',P.targetLabel,'position:absolute;top:-6px;right:12px;white-space:nowrap;font-size:19px;color:#e6f1ff;transform:translateY(-100%)'));
  bar.appendChild(have);bar.appendChild(gap);bar.appendChild(tg);b.appendChild(bar);
  var num=el('div','u','','margin-top:30px;font-size:84px;color:'+COL.red);b.appendChild(num);b.appendChild(el('div','tag',P.sub,'margin-top:4px'));L.inner.appendChild(b);
  var inner=W-60,fh=P.have/P.target*(inner*.84);tg.style.left=(inner*.84)+'px';
  return function(t){var p=eo((t-L.t0-.1)/.9),g=clamp((t-L.t0-1.0)/.5,0,1);have.style.width=(fh*p)+'px';gap.style.left=fh+'px';gap.style.width=((inner*.84-fh)*g)+'px';num.textContent=g>0?'−'+fmt(P.gapMw*eo(g))+' MW':'';num.style.opacity=g;};
};
// ---- price compare (two bars: capped vs uncapped) ----
T.compare=function(L,P){
  var b=el('div','panel','','width:'+(P.w||700)+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var wrap=el('div','','','display:flex;gap:50px;align-items:flex-end;height:'+(P.h||300)+'px;margin-top:20px');
  var bs=P.items.map(function(it,i){var c=el('div','','','flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%');var v=el('div','u','','font-size:44px;margin-bottom:8px');var br=el('div','','','width:100%;height:0;background:'+(it.hatch?'repeating-linear-gradient(45deg,'+C(it.c)+' 0 14px,'+C(it.c)+'55 14px 28px)':'linear-gradient(180deg,'+C(it.c)+','+C(it.c)+'66)'));c.appendChild(v);c.appendChild(br);c.appendChild(el('div','mono',it.l,'margin-top:10px;font-size:20px;color:#7f93ad'));wrap.appendChild(c);return {v:v,br:br,it:it,i:i};});
  b.appendChild(wrap);L.inner.appendChild(b);
  return function(t){bs.forEach(function(o){var t0=T0(o.it,o.i,L,.6),p=eo((t-t0)/.7);o.br.style.height=((P.h||300)-90)*(o.it.v/P.max)*p+'px';o.v.textContent='$'+fmt(o.it.v*p);o.v.style.color=C(o.it.c);o.v.style.opacity=clamp((t-t0)/.1,0,1);});};
};
// ---- dual analog clocks ----
T.clocks=function(L,P){
  var b=el('div','panel','','width:'+(P.w||1000)+'px;padding:22px 30px;display:flex;justify-content:space-around;gap:20px');
  var cl=P.items.map(function(it){var d=el('div','','','text-align:center');var S=260,ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width',S);svg.setAttribute('height',S);
    var ticks='';for(var i=0;i<12;i++){var a=i/12*Math.PI*2;ticks+='<line x1="'+(S/2+100*Math.sin(a))+'" y1="'+(S/2-100*Math.cos(a))+'" x2="'+(S/2+116*Math.sin(a))+'" y2="'+(S/2-116*Math.cos(a))+'" stroke="#7f93ad" stroke-width="4"/>';}
    svg.innerHTML='<circle cx="'+S/2+'" cy="'+S/2+'" r="124" fill="#0b1422" stroke="'+C(it.c)+'" stroke-width="5"/>'+ticks+'<line class="h" x1="'+S/2+'" y1="'+S/2+'" x2="'+S/2+'" y2="'+(S/2-92)+'" stroke="'+C(it.c)+'" stroke-width="7" stroke-linecap="round"/><circle cx="'+S/2+'" cy="'+S/2+'" r="9" fill="'+C(it.c)+'"/>';
    d.appendChild(svg);d.appendChild(el('div','u',it.big,'font-size:44px;color:'+C(it.c)));d.appendChild(el('div','tag',it.l,'margin-top:4px'));b.appendChild(d);return {h:svg.querySelector('.h'),it:it,S:S};});
  L.inner.appendChild(b);return function(t){var u=t-L.t0;cl.forEach(function(o){o.h.setAttribute('transform','rotate('+(u*o.it.rate)+' '+o.S/2+' '+o.S/2+')');});};
};
// ---- watch cards ----
T.watch=function(L,P){
  var w=el('div','','','display:flex;flex-direction:column;gap:22px;width:'+(P.w||900)+'px');
  var cs=P.items.map(function(it,i){var c=el('div','panel','','display:flex;align-items:center;gap:26px;padding:20px 28px;border-top-color:'+C(it.c));c.appendChild(el('div','u',String(it.n),'font-size:84px;color:'+C(it.c)+';width:80px'));
    var m=el('div','','','flex:1');m.appendChild(el('div','u',it.h,'font-size:36px'));m.appendChild(el('div','mono',it.s,'font-size:21px;color:#7f93ad;margin-top:6px'));c.appendChild(m);
    c.appendChild(el('div','',ICON(it.icon,64,C(it.c)),'flex:none'));w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.6),p=eo((t-t0)/.45);o.c.style.opacity=clamp((t-t0)/.1,0,1);o.c.style.transform='translateX('+lerp(120,0,p)+'px)';});};
};
// ---- two-state flexibility switch + stress thermometer ----
T.flex=function(L,P){
  var b=el('div','panel','','width:'+(P.w||800)+'px;padding:22px 30px;display:flex;gap:40px;align-items:center');
  var l=el('div','','','flex:1');l.appendChild(el('div','tag','DATA CENTER MODE'));var st=el('div','u','','font-size:68px;margin-top:8px');l.appendChild(st);var sw=el('div','','','margin-top:18px;width:200px;height:70px;border-radius:35px;background:#25344b;position:relative');var kn=el('div','','','position:absolute;top:7px;left:7px;width:56px;height:56px;border-radius:50%;background:#e6f1ff');sw.appendChild(kn);l.appendChild(sw);b.appendChild(l);
  var r=el('div','','','width:200px;text-align:center');r.appendChild(el('div','tag','GRID STRESS'));var th=el('div','','','margin:14px auto 0;width:56px;height:230px;background:#1a2638;position:relative;border-radius:28px;overflow:hidden');var lvl=el('div','','','position:absolute;left:0;right:0;bottom:0;height:20%;background:'+COL.grn);th.appendChild(lvl);r.appendChild(th);var rd=el('div','mono','','margin-top:10px;font-size:22px');r.appendChild(rd);b.appendChild(r);
  L.inner.appendChild(b);
  return function(t){var tt=P.tPause!=null?P.tPause:L.t0+2.2,p=eo((t-tt)/.5),peak=eo((t-L.t0-.6)/.8)*(1-p*.65);var run=p<.5;
    st.textContent=run?'RUN':'PAUSE';st.style.color=run?COL.grn:COL.org;kn.style.left=lerp(7,137,p)+'px';sw.style.background=run?'#1f4a39':'#5b3a1a';
    lvl.style.height=(20+70*peak)+'%';var col=peak>.6?COL.red:peak>.35?COL.org:COL.grn;lvl.style.background=col;rd.textContent=peak>.6?'CRITICAL':peak>.35?'STRAINED':'STABLE';rd.style.color=col;};
};
// ---- node-field map (illustrative) ----
T.field=function(L,P){
  var W=P.w||800,H=P.h||420,b=el('div','panel','','width:'+W+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var cv=el('div','','','position:relative;height:'+H+'px;margin-top:14px;overflow:hidden');var N=P.n||260,ds=[];
  function rnd(i){var x=Math.sin(i*127.1)*43758.5453;return x-Math.floor(x);}
  var cs=[[.28,.45],[.72,.55]];
  for(var i=0;i<N;i++){var x=rnd(i)*.96+.02,y=rnd(i+999)*.9+.05;var near=cs.some(function(c){return Math.hypot((x-c[0])*W/H,(y-c[1]))<.3;});
    var d=el('i','','','position:absolute;left:'+(x*100)+'%;top:'+(y*100)+'%;width:9px;height:9px;border-radius:50%;background:#3a4c66');cv.appendChild(d);ds.push({d:d,near:near,i:i});}
  cs.forEach(function(c){cv.appendChild(el('div','','','position:absolute;left:'+(c[0]*100)+'%;top:'+(c[1]*100)+'%;width:'+(.6*H)+'px;height:'+(.6*H)+'px;margin:'+(-.3*H)+'px 0 0 '+(-.3*H)+'px;border:2px dashed '+COL.org+'88;border-radius:50%'));cv.appendChild(el('div','mono','DATA CENTER CLUSTER','position:absolute;left:'+(c[0]*100)+'%;top:'+(c[1]*100)+'%;transform:translate(-50%,-50%);font-size:16px;color:'+COL.org+';background:rgba(7,11,18,.8);padding:4px 8px'));});
  b.appendChild(cv);b.appendChild(el('div','mono',P.foot,'margin-top:12px;font-size:21px;color:#e6f1ff'));L.inner.appendChild(b);
  return function(t){var u=t-L.t0;ds.forEach(function(o){var p=clamp((u-.3-o.i*.004)/.3,0,1);var hot=o.near&&u>1.4;o.d.style.background=hot?COL.org:'#3a4c66';o.d.style.boxShadow=hot?'0 0 10px '+COL.org:'none';o.d.style.opacity=p;});};
};
// ---- orbit diagram ----
T.orbit=function(L,P){
  var S=P.s||560,ns='http://www.w3.org/2000/svg',b=el('div','panel','','width:'+(S+60)+'px;padding:22px 30px');b.appendChild(el('div','tag',P.title));
  var svg=document.createElementNS(ns,'svg');svg.setAttribute('width',S);svg.setAttribute('height',S*.75);var cx=S/2,cy=S*.40,rx=S*.44,ry=S*.28;
  svg.innerHTML='<circle cx="'+cx+'" cy="'+cy+'" r="'+S*.17+'" fill="#12304f" stroke="#5ab4ff" stroke-width="3"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="#7f93ad" stroke-width="2" stroke-dasharray="6 8"/><g class="sat"><rect x="-18" y="-10" width="36" height="20" fill="#e6f1ff"/><rect x="-46" y="-6" width="26" height="12" fill="'+COL.org+'"/><rect x="20" y="-6" width="26" height="12" fill="'+COL.org+'"/></g><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" fill="#9fd0ff" font-family="JBMono" font-weight="700" font-size="16">EARTH</text>';
  b.appendChild(svg);b.appendChild(el('div','mono',P.foot,'font-size:21px;color:#e6f1ff;margin-top:6px'));L.inner.appendChild(b);var sat=svg.querySelector('.sat');
  return function(t){var a=(t-L.t0)*.9-1.2;sat.setAttribute('transform','translate('+(cx+rx*Math.cos(a))+' '+(cy+ry*Math.sin(a))+')');};
};
// ---- brand lockup ----
T.lockup=function(L,P){
  var d=el('div','u','','font-size:'+(P.size||56)+'px;white-space:nowrap;text-shadow:0 8px 40px rgba(0,0,0,.7)');d.innerHTML=P.a+' <span class="org">×</span> '+P.b;L.inner.appendChild(d);
  if(P.sub)L.inner.appendChild(el('div','mono',P.sub,'font-size:24px;color:#e6f1ff;letter-spacing:.1em;margin-top:8px'));return function(){};
};
// ---- stamp ----
T.stamp=function(L,P){var s=el('div','u',P.text,'font-size:'+(P.size||60)+'px;color:'+C(P.c||'red')+';border:6px solid '+C(P.c||'red')+';padding:8px 24px;background:rgba(7,11,18,.7);white-space:nowrap');s.style.transform='rotate('+(P.rot||-6)+'deg)';L.inner.appendChild(s);return function(t){var u=t-L.t0,p=eb(u/.3);s.style.transform='rotate('+(P.rot||-6)+'deg) scale('+lerp(2,1,p)+')';};};
// ---- chips ----
T.chips=function(L,P){
  var w=el('div','','','display:flex;gap:16px;flex-wrap:wrap;'+(P.col?'flex-direction:column;align-items:flex-start;':''));
  var cs=P.items.map(function(it,i){var c=el('div','mono',it.txt,'padding:12px 22px;border:2px solid '+C(it.c)+';color:'+C(it.c)+';background:rgba(7,11,18,.85);font-size:'+(P.size||24)+'px;letter-spacing:.08em;white-space:nowrap');w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.16),p=eb((t-t0)/.35);o.c.style.opacity=clamp((t-t0)/.08,0,1);o.c.style.transform='scale('+lerp(.6,1,p)+')';});};
};
// ---- icon row with labels ----
T.icons=function(L,P){
  var w=el('div','','','display:flex;gap:'+(P.gap||34)+'px;align-items:flex-start');
  var cs=P.items.map(function(it,i){var c=el('div','','','text-align:center;width:'+(P.iw||150)+'px');c.appendChild(el('div','',ICON(it.icon,70,C(it.c)),'width:110px;height:110px;margin:0 auto;border:2px solid '+C(it.c)+';background:rgba(7,11,18,.85);display:flex;align-items:center;justify-content:center;border-radius:16px'));c.appendChild(el('div','mono',it.l,'margin-top:10px;font-size:19px;letter-spacing:.08em;color:#e6f1ff'));w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.2),p=eb((t-t0)/.4);o.c.style.opacity=clamp((t-t0)/.1,0,1);o.c.style.transform='translateY('+lerp(30,0,eo((t-t0)/.4))+'px) scale('+lerp(.8,1,p)+')';});};
};
// ---- branded CTA ----
T.cta=function(L,P){
  var w=el('div','','','width:900px');var row=el('div','','','display:flex;align-items:center;gap:44px');
  row.appendChild(el('div','',"<img src='"+P.img+"' style='width:100%;height:100%;border-radius:50%;object-fit:cover;border:6px solid #070b12'>",'width:270px;height:270px;border-radius:50%;padding:8px;background:conic-gradient('+COL.org+',#ffd29a,'+COL.org+');box-shadow:0 0 60px rgba(255,138,31,.55);flex:none'));
  var tx=el('div','','');tx.appendChild(el('div','mono','LIKED THE BREAKDOWN?','font-size:26px;color:'+COL.org+';letter-spacing:.16em'));tx.appendChild(el('div','u',P.handle,'font-size:78px;margin-top:10px;line-height:1.02'));row.appendChild(tx);w.appendChild(row);
  var btn=el('div','','','margin-top:50px;display:inline-flex;align-items:center;gap:20px;background:'+COL.org+';color:#1a0d00;border-radius:60px;padding:22px 54px');btn.appendChild(el('span','u','FOLLOW','font-size:54px'));btn.appendChild(el('span','','＋','font-size:54px'));w.appendChild(btn);
  w.appendChild(el('div','mono',P.line,'margin-top:24px;font-size:24px;color:#e6f1ff'));L.inner.appendChild(w);
  return function(t){var u=t-L.t0,s=1+.04*Math.sin(u*5)*clamp(u-.8,0,1);btn.style.transform='scale('+s+')';btn.style.boxShadow='0 0 '+(20+20*Math.abs(Math.sin(u*3)))+'px rgba(255,138,31,.7)';};
};
// ---- next-episode teaser ----
T.teaser=function(L,P){
  var b=el('div','panel','','width:'+(P.w||760)+'px;padding:26px 34px');b.appendChild(el('div','tag','UP NEXT · NEW EPISODE'));b.appendChild(el('div','u',P.head,'font-size:62px;margin-top:14px'));
  var l=el('div','mono','','margin-top:20px;font-size:24px;line-height:1.9;color:#e6f1ff');l.innerHTML=P.lines.join('<br>');b.appendChild(l);L.inner.appendChild(b);return function(){};
};

var LAY=[];
window.COMPS={
  build:function(root){window.DATA.scenes.forEach(function(sc){(sc.layers||[]).forEach(function(P){
    var wrap=el('div','c','','left:'+(P.x||0)+'px;top:'+(P.y||0)+'px;display:none;'+(P.w&&P.type!=='hud'?'':''));var inner=el('div','','','');wrap.appendChild(inner);root.appendChild(wrap);if(P.nocheck)wrap.dataset.nc='1';wrap.dataset.type=P.type;wrap.dataset.t0=P.t0;
    var L={wrap:wrap,inner:inner,t0:P.t0,t1:P.t1,fx:P.fx,cx:P.cx,cy:P.cy};L.upd=T[P.type](L,P);LAY.push(L);});});},
  update:function(t){for(var i=0;i<LAY.length;i++){var L=LAY[i],on=t>=L.t0-.02&&t<=L.t1;
    if(!on){if(L.on){L.wrap.style.display='none';L.on=false;}continue;}
    if(!L.on){L.wrap.style.display='block';L.on=true;if(L.cx!=null||L.cy!=null){var wd=L.inner.offsetWidth,ht=L.inner.offsetHeight;if(L.cx!=null)L.wrap.style.left=(L.cx-wd/2)+'px';if(L.cy!=null)L.wrap.style.top=(L.cy-ht/2)+'px';}}
    wrapFx(L,t);L.upd(t);}}
};
})();
