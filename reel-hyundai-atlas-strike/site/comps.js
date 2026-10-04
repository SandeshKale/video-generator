// "Spec Sheet / Teardown" components — pure functions of absolute time t.
(function(){
'use strict';
var U=window.U, clamp=U.clamp, lerp=U.lerp, sm=U.sm;
function eo(x){x=clamp(x,0,1);return x>=1?1:1-Math.pow(2,-10*x);}
function eb(x){x=clamp(x,0,1);var c=2.0;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function fmt(v,d){var s=Number(v).toFixed(d||0);var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return p.join('.');}
var COB='#2f5cff',ORG='#ff5a1f',INK='#101114',MUT='#8a857a',PAPER='#f1ede4';
function C(c){return {cob:COB,org:ORG,ink:INK,mut:MUT}[c]||c||INK;}
function ICON(name,size,col){var p=(window.DATA.icons||{})[name]||'';return '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
function T0(o,i,L,gap){return o.t!=null?o.t:L.t0+.12+(gap||.14)*i;}

function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.2,0,1);
  if(k==='slam'){var p=eo(u/.26);a=clamp(u/.06,0,1);tr='scale('+lerp(1.5,1,p)+')';}
  else if(k==='stampin'){var q=eb(u/.3);a=clamp(u/.05,0,1);tr='scale('+lerp(2.4,1,q)+') rotate('+lerp(-14,0,q)+'deg)';}
  else if(k==='rise'){var r=eo(u/.45);a=clamp(u/.14,0,1);tr='translateY('+lerp(60,0,r)+'px)';}
  else if(k==='left'){var l=eo(u/.5);a=clamp(u/.12,0,1);tr='translateX('+lerp(-220,0,l)+'px)';}
  else if(k==='right'){var rr=eo(u/.5);a=clamp(u/.12,0,1);tr='translateX('+lerp(220,0,rr)+'px)';}
  else if(k==='drop'){var d=eb(u/.55);a=clamp(u/.08,0,1);tr='translateY('+lerp(-200,0,d)+'px) rotate('+lerp(-6,0,d)+'deg)';}
  else{a=clamp(u/.2,0,1);}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};

// ---- header: spec-sheet number + rule ----
T.hud=function(L,P){
  var w=L.inner;w.style.cssText='position:absolute;left:0;top:0;width:1080px;height:200px';
  w.appendChild(el('div','mono','SPEC SHEET Nº <span style="color:'+COB+'">'+P.n+'</span> · ATLAS × HYUNDAI','position:absolute;left:150px;top:150px;font-size:22px;letter-spacing:.1em'));
  w.appendChild(el('div','mono',P.rev||'REV A','position:absolute;right:162px;top:150px;font-size:22px;letter-spacing:.1em'));
  w.appendChild(el('div','',null,'position:absolute;left:150px;right:162px;top:192px;border-top:3px solid '+INK));
  return function(){};
};
// ---- headline lines ----
T.head=function(L,P){
  var ls=P.lines.map(function(ln){var d=el('div','fr',ln.txt,'font-size:'+(ln.size||110)+'px;color:'+C(ln.c)+';'+(ln.i?'font-style:italic;':'')+'white-space:nowrap;'+(ln.mt?'margin-top:'+ln.mt+'px;':''));L.inner.appendChild(d);return {d:d,ln:ln};});
  return function(t){ls.forEach(function(o){var t0=o.ln.t!=null?o.ln.t:L.t0,u=t-t0,p=eo(u/.35);o.d.style.opacity=clamp(u/.08,0,1);o.d.style.transform='translateY('+lerp(46,0,p)+'px)';});};
};
// ---- big counting number with label ----
T.count=function(L,P){
  var n=el('div','fr','','font-size:'+(P.size||120)+'px;color:'+C(P.c)+';white-space:nowrap');L.inner.appendChild(n);
  if(P.label)L.inner.appendChild(el('div','mono',P.label,'font-size:'+(P.ls||20)+'px;color:'+MUT+';letter-spacing:.06em;margin-top:6px'));
  return function(t){var q=eo((t-L.t0-.05)/(P.dur||.9));n.textContent=(P.pre||'')+(P.raw?Math.round(lerp(P.from||0,P.val,q)):fmt(lerp(P.from||0,P.val,q),P.dec))+(P.suf||'');};
};
// ---- pinned photo print ----
T.print=function(L,P){
  var f=el('div','print','','left:0;top:0;width:'+P.w+'px;height:'+P.h+'px;');
  (P.tapes||[[-30,-14,-8],[P.w-90,-10,9]]).forEach(function(tp){f.appendChild(el('div','tape','','left:'+tp[0]+'px;top:'+tp[1]+'px;transform:rotate('+tp[2]+'deg)'));});
  var ph=el('div','ph','','background-image:url(shots/'+P.img+'.jpg);'+(P.pos?'background-position:'+P.pos+';':''));f.appendChild(ph);if(P.cap)f.appendChild(el('div','cap',P.cap));
  L.inner.appendChild(f);L.print=f;
  return function(t){var u=t-L.t0;f.style.transform='rotate('+((P.rot||0)+.5*Math.sin(u*.9))+'deg)';ph.style.backgroundSize=(112+4*Math.min(u/6,1.2))+'%';};
};
// ---- stamp ----
T.stamp=function(L,P){var s=el('div','stamp',P.text,'position:relative;font-size:'+(P.size||44)+'px;color:'+C(P.c||'org')+';border-color:'+C(P.c||'org')+';transform:rotate('+(P.rot||-8)+'deg)');L.inner.appendChild(s);return function(t){var q=eb((t-L.t0)/.3);s.style.transform='rotate('+(P.rot||-8)+'deg) scale('+lerp(2.2,1,q)+')';};};
// ---- chips ----
T.chips=function(L,P){
  var w=el('div','','','display:flex;gap:12px;flex-wrap:wrap;'+(P.col?'flex-direction:column;align-items:flex-start;':''));
  var cs=P.items.map(function(it,i){var c=el('div','chip',it.txt,'font-size:'+(P.size||22)+'px;'+(it.inv?'background:'+INK+';color:'+PAPER+';':'')+(it.c?'border-color:'+C(it.c)+';color:'+(it.inv?PAPER:C(it.c))+';':''));w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.16),p=eb((t-t0)/.35);o.c.style.opacity=clamp((t-t0)/.08,0,1);o.c.style.transform='scale('+lerp(.6,1,p)+')';});};
};
// ---- teardown callouts: dimension line + leader lines to numbers ----
T.callouts=function(L,P){
  var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width',1080);svg.setAttribute('height',1920);svg.style.cssText='position:absolute;left:0;top:0';L.inner.appendChild(svg);
  var dim=P.dim,dl=null;
  if(dim){dl=document.createElementNS(ns,'path');dl.setAttribute('d','M'+dim.x+' '+dim.y1+'V'+dim.y2+'M'+(dim.x-16)+' '+dim.y1+'h32M'+(dim.x-16)+' '+dim.y2+'h32');dl.setAttribute('stroke',COB);dl.setAttribute('stroke-width',3);dl.setAttribute('fill','none');dl.setAttribute('pathLength',1);dl.setAttribute('stroke-dasharray',1);dl.setAttribute('stroke-dashoffset',1);svg.appendChild(dl);
    L.inner.appendChild(el('div','mono',dim.label,'position:absolute;left:'+(dim.x-96)+'px;top:'+((dim.y1+dim.y2)/2)+'px;transform:rotate(-90deg);transform-origin:left top;width:300px;font-size:22px;color:'+COB));}
  var its=P.items.map(function(it,i){
    var pth=document.createElementNS(ns,'path');var kx=it.to[0]-20;pth.setAttribute('d','M'+it.dot[0]+' '+it.dot[1]+'H'+(kx-20)+'L'+kx+' '+(it.to[1]-30)+'H'+(it.to[0]+it.w));pth.setAttribute('stroke',ORG);pth.setAttribute('stroke-width',3);pth.setAttribute('fill','none');pth.setAttribute('pathLength',1);pth.setAttribute('stroke-dasharray',1);pth.setAttribute('stroke-dashoffset',1);svg.appendChild(pth);
    var d=el('div','dot','','left:'+(it.dot[0]-11)+'px;top:'+(it.dot[1]-11)+'px;opacity:0');L.inner.appendChild(d);
    var box=el('div','','','position:absolute;left:'+it.to[0]+'px;top:'+(it.to[1]-120)+'px;opacity:0');var n=el('div','fr','','font-size:'+(it.size||104)+'px;color:'+C(it.c));box.appendChild(n);box.appendChild(el('div','mono',it.label,'font-size:19px;color:'+MUT+';letter-spacing:.04em'));L.inner.appendChild(box);
    return {pth:pth,d:d,box:box,n:n,it:it,i:i};});
  return function(t){if(dl)dl.setAttribute('stroke-dashoffset',1-eo((t-L.t0-.1)/.7));
    its.forEach(function(o){var t0=T0(o.it,o.i,L,.5),u=t-t0;o.d.style.opacity=clamp(u/.1,0,1);o.pth.setAttribute('stroke-dashoffset',1-eo((u-.1)/.5));o.box.style.opacity=clamp((u-.3)/.15,0,1);
      var q=eo((u-.3)/.7);o.n.innerHTML=(o.it.pre||'')+fmt(o.it.val*q,o.it.dec)+(o.it.unit?'<span style="font-size:'+Math.round((o.it.size||104)*.46)+'px"> '+o.it.unit+'</span>':'');});};
};
// ---- generic growing blocks (price ladder) ----
T.blocks=function(L,P){
  var bs=P.items.map(function(it,i){var b=el('div','','','position:absolute;left:'+it.x+'px;top:'+it.y+'px;width:'+it.w+'px;height:0;background:'+C(it.c)+';box-shadow:8px 8px 0 '+INK+';overflow:hidden');
    b.appendChild(el('div','fr',it.big,'color:#fff;font-size:'+(it.size||76)+'px;padding:22px 22px 0;white-space:pre-line'));b.appendChild(el('div','mono',it.small,'color:rgba(255,255,255,.8);padding:10px 22px;font-size:19px;line-height:1.5;white-space:pre-line'));L.inner.appendChild(b);return {b:b,it:it,i:i};});
  var ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('width',1080);svg.setAttribute('height',1920);svg.style.cssText='position:absolute;left:0;top:0';L.inner.appendChild(svg);
  var ar=null;if(P.arrow){ar=document.createElementNS(ns,'path');ar.setAttribute('d',P.arrow.d);ar.setAttribute('stroke',INK);ar.setAttribute('stroke-width',4);ar.setAttribute('fill','none');ar.setAttribute('pathLength',1);ar.setAttribute('stroke-dasharray','0.04 0.02');ar.setAttribute('stroke-dashoffset',1);svg.appendChild(ar);}
  return function(t){bs.forEach(function(o){var t0=T0(o.it,o.i,L,.5),p=eo((t-t0)/.7);o.b.style.height=(o.it.h*p)+'px';});
    if(ar){var p=eo((t-(P.arrow.t!=null?P.arrow.t:L.t0+1))/.7);ar.setAttribute('stroke-dasharray',p+' 2');}};
};
// ---- labelled progress bar ----
T.progress=function(L,P){
  var w=el('div','','','width:'+P.w+'px');w.appendChild(el('div','mono',P.label,'font-size:20px;margin-bottom:10px'));
  var bar=el('div','','','height:34px;border:3px solid '+INK+';position:relative;background:#fff');var f=el('div','','','position:absolute;left:0;top:0;bottom:0;width:0;background:'+C(P.c||'org'));bar.appendChild(f);w.appendChild(bar);
  var tk=el('div','mono','','display:flex;justify-content:space-between;font-size:18px;margin-top:8px');(P.ticks||[]).forEach(function(x){tk.appendChild(el('span','',x));});w.appendChild(tk);L.inner.appendChild(w);
  return function(t){f.style.width=(P.pct*eo((t-L.t0-.1)/(P.dur||1)))+'%';};
};
// ---- square-grid fill (e.g. 25,000 robots) ----
T.grid=function(L,P){
  var w=el('div','','','display:grid;grid-template-columns:repeat('+P.cols+','+P.cell+'px);gap:'+P.gap+'px');var cs=[];
  for(var i=0;i<P.cols*P.rows;i++){var d=el('i','','','display:block;width:'+P.cell+'px;height:'+P.cell+'px;background:transparent;border:2px solid rgba(16,17,20,.25)');w.appendChild(d);cs.push(d);}
  L.inner.appendChild(w);
  return function(t){var tot=P.fill,p=eo((t-L.t0-.15)/(P.dur||1.4));var n=Math.floor(p*tot);cs.forEach(function(d,i){var on=i<n;d.style.background=on?COB:'transparent';d.style.borderColor=on?COB:'rgba(16,17,20,.25)';});};
};
// ---- receipt ----
T.receipt=function(L,P){
  var b=el('div','','','width:'+(P.w||768)+'px;background:#fffdf8;box-shadow:0 20px 40px rgba(16,17,20,.25);padding:34px 40px 40px;transform:rotate(-.8deg)');
  b.appendChild(el('div','mono',P.title,'font-size:19px;letter-spacing:.12em;color:'+MUT));b.appendChild(el('div','',null,'border-top:3px dashed '+INK+';margin:16px 0'));
  var rows=P.rows.map(function(r,i){var d=el('div','','','display:flex;justify-content:space-between;align-items:baseline;padding:13px 0;border-bottom:2px solid rgba(16,17,20,.12);opacity:0');d.appendChild(el('span','mono',r.k,'font-size:22px'));d.appendChild(el('span','fr',r.v,'font-size:'+(r.hl?50:38)+'px;color:'+(r.hl?COB:INK)));b.appendChild(d);return {d:d,r:r,i:i};});
  if(P.foot)b.appendChild(el('div','mono',P.foot,'font-size:15px;color:'+MUT+';margin-top:12px'));
  var vote=null;if(P.vote){vote=el('div','','','margin-top:22px;opacity:0');vote.appendChild(el('div','mono',P.vote.label,'font-size:19px;margin-bottom:8px'));var bar=el('div','','','display:flex;height:46px;border:3px solid '+INK);var y=el('div','','','width:0;background:'+COB),n=el('div','','','flex:1;background:'+ORG);bar.appendChild(y);bar.appendChild(n);vote.appendChild(bar);
    var lb=el('div','mono','','display:flex;justify-content:space-between;font-size:20px;margin-top:6px');lb.appendChild(el('span','',P.vote.yes,'color:'+COB));lb.appendChild(el('span','',P.vote.no,'color:'+ORG));vote.appendChild(lb);b.appendChild(vote);vote.y=y;}
  L.inner.appendChild(b);
  return function(t){rows.forEach(function(o){var t0=T0(o.r,o.i,L,.5),p=eo((t-t0)/.3);o.d.style.opacity=clamp((t-t0)/.1,0,1);o.d.style.transform='translateY('+lerp(14,0,p)+'px)';});
    if(vote){var tv=P.vote.t!=null?P.vote.t:L.t0+3;var p=eo((t-tv)/.8);vote.style.opacity=clamp((t-tv)/.15,0,1);vote.y.style.width=(P.vote.pct*p)+'%';}};
};
// ---- contract/document with typed clause ----
T.doc=function(L,P){
  var b=el('div','','','width:'+(P.w||768)+'px;background:#fffdf8;box-shadow:0 20px 40px rgba(16,17,20,.25);padding:30px 36px 36px');
  b.appendChild(el('div','mono',P.title,'font-size:19px;letter-spacing:.12em;color:'+MUT));b.appendChild(el('div','',null,'border-top:3px solid '+INK+';margin:14px 0 18px'));
  [64,88,52,76].forEach(function(wd){b.appendChild(el('s','','','display:block;height:18px;background:#15130f;width:'+wd+'%;margin-bottom:12px'));});
  var cl=el('div','fr','','margin-top:16px;font-size:'+(P.size||46)+'px;line-height:1.02;border-left:10px solid '+ORG+';padding-left:18px;min-height:'+(P.mh||230)+'px');b.appendChild(cl);
  [58,80].forEach(function(wd){b.appendChild(el('s','','','display:block;height:18px;background:#15130f;width:'+wd+'%;margin-top:12px'));});
  L.inner.appendChild(b);var words=P.clause.split(' ');
  return function(t){var t0=P.th!=null?P.th:L.t0+.6,n=Math.floor(clamp((t-t0)/(P.dur||2),0,1)*words.length);cl.textContent=words.slice(0,n).join(' ');};
};
// ---- calendar strip ----
T.calendar=function(L,P){
  var b=el('div','','','width:'+(P.w||768)+'px;border:3px solid '+INK+';background:#fffdf8;padding:18px 22px 22px');b.appendChild(el('div','mono',P.title,'font-size:20px;letter-spacing:.1em;margin-bottom:12px'));
  var row=el('div','','','display:flex;gap:10px');var ds=P.days.map(function(d,i){var c=el('div','','','flex:1;height:130px;border:2.5px solid '+INK+';text-align:center;padding-top:12px;position:relative;background:'+PAPER);c.appendChild(el('div','fr',String(d.n),'font-size:48px'));c.appendChild(el('div','mono',d.l||'','font-size:14px;margin-top:6px;color:'+MUT));row.appendChild(c);return {c:c,d:d,i:i};});
  b.appendChild(row);L.inner.appendChild(b);
  return function(t){ds.forEach(function(o){if(o.d.hit==null&&o.d.t==null)return;var u=t-(o.d.t!=null?o.d.t:1e9),p=eb(u/.3);var on=u>=0;o.c.style.background=on?ORG:PAPER;o.c.style.color=on?'#fff':INK;o.c.style.transform=on?'scale('+lerp(1.15,1,p)+')':'none';o.c.children[1].style.color=on?'#ffe2d6':MUT;});};
};
// ---- icon row that fills (cars) ----
T.fillicons=function(L,P){
  var w=el('div','','','display:grid;grid-template-columns:repeat('+P.cols+','+P.cell+'px);gap:'+P.gap+'px');var cs=[];
  for(var i=0;i<P.cols*P.rows;i++){var d=el('div','',ICON(P.icon,P.cell-4,ORG),'opacity:0;width:'+P.cell+'px;height:'+P.cell+'px');w.appendChild(d);cs.push(d);}
  L.inner.appendChild(w);return function(t){var p=eo((t-L.t0-.2)/(P.dur||1.4)),n=Math.floor(p*cs.length);cs.forEach(function(d,i){d.style.opacity=i<n?1:0;});};
};
// ---- horizontal flow of steps ----
T.flow=function(L,P){
  var w=el('div','','','display:flex;align-items:flex-start;gap:6px;width:'+(P.w||768)+'px');
  var st=P.steps.map(function(s,i){var c=el('div','','','flex:1;text-align:center;opacity:0');c.appendChild(el('div','',ICON(s.icon,64,i===0?ORG:COB),'width:116px;height:116px;margin:0 auto;border:3px solid '+INK+';background:#fffdf8;display:flex;align-items:center;justify-content:center;box-shadow:6px 6px 0 '+INK));c.appendChild(el('div','mono',s.l,'margin-top:14px;font-size:20px;letter-spacing:.06em'));
    var ar=i<P.steps.length-1?el('div','mono','→','align-self:flex-start;margin-top:36px;font-size:38px;color:'+INK+';opacity:0'):null;w.appendChild(c);if(ar)w.appendChild(ar);return {c:c,ar:ar,s:s,i:i};});
  L.inner.appendChild(w);return function(t){st.forEach(function(o){var t0=T0(o.s,o.i,L,.5),p=eb((t-t0)/.4);o.c.style.opacity=clamp((t-t0)/.1,0,1);o.c.style.transform='translateY('+lerp(26,0,eo((t-t0)/.4))+'px)';if(o.ar)o.ar.style.opacity=clamp((t-t0-.2)/.15,0,1);});};
};
// ---- quote card ----
T.quote=function(L,P){
  var b=el('div','','','width:'+(P.w||768)+'px;background:#fffdf8;border:3px solid '+INK+';box-shadow:8px 8px 0 '+COB+';padding:26px 32px 28px');
  b.appendChild(el('div','fr','“','font-size:110px;line-height:.5;color:'+ORG+';height:50px'));var q=el('div','fr','','font-size:'+(P.size||44)+'px;line-height:1.05');b.appendChild(q);b.appendChild(el('div','mono',P.who,'margin-top:16px;font-size:19px;color:'+MUT+';letter-spacing:.06em'));
  L.inner.appendChild(b);var words=P.text.split(' ');
  return function(t){var t0=P.th!=null?P.th:L.t0+.4,n=Math.floor(clamp((t-t0)/(P.dur||2),0,1)*words.length);q.textContent=words.slice(0,n).join(' ');};
};
// ---- split comparison (Korea vs Georgia) ----
T.split=function(L,P){
  var w=el('div','','','display:flex;gap:22px;width:'+(P.w||768)+'px');
  var ps=[P.left,P.right].map(function(s,i){var c=el('div','','','flex:1;border:3px solid '+INK+';background:#fffdf8;box-shadow:8px 8px 0 '+C(s.c)+';padding:22px 22px 26px;opacity:0');c.appendChild(el('div','',ICON(s.icon,70,C(s.c))));c.appendChild(el('div','fr',s.h,'font-size:62px;margin-top:10px'));c.appendChild(el('div','mono',s.sub,'font-size:19px;line-height:1.5;margin-top:10px;color:'+MUT));w.appendChild(c);return {c:c,s:s,i:i};});
  L.inner.appendChild(w);return function(t){ps.forEach(function(o){var t0=o.s.t!=null?o.s.t:L.t0+.2+.5*o.i,p=eb((t-t0)/.45);o.c.style.opacity=clamp((t-t0)/.1,0,1);o.c.style.transform='translateY('+lerp(40,0,eo((t-t0)/.4))+'px) scale('+lerp(.94,1,p)+')';});};
};
// ---- CTA ----
T.cta=function(L,P){
  var w=el('div','','','width:768px');var row=el('div','','','display:flex;align-items:center;gap:26px');
  row.appendChild(el('div','',"<img src='profile.jpg' style='width:100%;height:100%;border-radius:50%;object-fit:cover;border:6px solid "+PAPER+"'>",'width:230px;height:230px;border-radius:50%;padding:7px;background:conic-gradient('+COB+',#9fb5ff,'+ORG+','+COB+');flex:none'));
  var tx=el('div','','');tx.appendChild(el('div','mono','NEW BREAKDOWN EVERY WEEK','font-size:20px;color:'+MUT+';letter-spacing:.14em'));tx.appendChild(el('div','fr',P.handle,'font-size:56px;margin-top:8px'));row.appendChild(tx);w.appendChild(row);
  var btn=el('div','','','margin-top:40px;display:inline-flex;align-items:center;gap:18px;background:'+INK+';color:'+PAPER+';padding:22px 52px;box-shadow:8px 8px 0 '+COB);btn.appendChild(el('span','fr','FOLLOW','font-size:52px;color:'+PAPER));btn.appendChild(el('span','','＋','font-size:48px'));w.appendChild(btn);
  L.inner.appendChild(w);return function(t){var u=t-L.t0,s=1+.035*Math.sin(u*5)*clamp(u-.6,0,1);btn.style.transform='scale('+s+')';btn.style.boxShadow='8px 8px 0 '+COB;};
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
