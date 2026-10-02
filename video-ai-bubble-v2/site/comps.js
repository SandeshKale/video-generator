// Motion-graphics components. Every component is a pure function of absolute time t.
(function(){
'use strict';
var U=window.U, clamp=U.clamp, lerp=U.lerp, sm=U.sm;
function eo(x){x=clamp(x,0,1);return x>=1?1:1-Math.pow(2,-10*x);}           // expo out
function eb(x){x=clamp(x,0,1);var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);} // back out
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function fmt(v,dec,comma){var s=Number(v).toFixed(dec||0);if(comma!==false){var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');s=p.join('.');}return s;}
var COL={mint:'#35f2b0',coral:'#ff5d4d',gold:'#ffc53d',cyan:'#5ad7ff',cream:'#f4f1ea',dim:'#b9b3c6',violet:'#b48cff'};
function C(c){return COL[c]||c||COL.cream;}

var BRANDS={openai:['O','#35f2b0','OpenAI'],nvidia:['N','#8fd400','Nvidia'],oracle:['Or','#ff5d4d','Oracle'],amd:['A','#ff9a3d','AMD'],coreweave:['CW','#5ad7ff','CoreWeave'],microsoft:['M','#6cc7ff','Microsoft'],broadcom:['B','#ff6b8a','Broadcom'],
  amazon:['Az','#ffc53d','Amazon'],alphabet:['G','#5ad7ff','Alphabet'],meta:['Me','#7ea8ff','Meta'],anthropic:['An','#ffb48a','Anthropic']};

// entrance / exit applied to the wrapper
function wrapFx(L,t){
  var u=t-L.t0, d=L.t1-L.t0, k=L.fx||'slam', p;
  var ex=clamp((L.t1-t)/.22,0,1);               // exit fade
  var a=1, tr='';
  if(k==='slam'){p=eo(u/.32);var s=lerp(1.45,1,p);a=clamp(u/.1,0,1);tr='scale('+s+')';}
  else if(k==='pop'){p=eb(u/.42);a=clamp(u/.08,0,1);tr='scale('+lerp(.55,1,p)+')';}
  else if(k==='rise'){p=eo(u/.45);a=clamp(u/.15,0,1);tr='translateY('+lerp(70,0,p)+'px)';}
  else if(k==='left'){p=eo(u/.45);a=clamp(u/.12,0,1);tr='translateX('+lerp(-160,0,p)+'px)';}
  else if(k==='right'){p=eo(u/.45);a=clamp(u/.12,0,1);tr='translateX('+lerp(160,0,p)+'px)';}
  else {a=clamp(u/.2,0,1);}
  a*=ex; if(ex<1)tr+=' scale('+lerp(.97,1,ex)+')';
  L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}

var T={}; // type builders: (L,P) -> update(t) ; they append into L.inner

// ---- big number ----
T.num=function(L,P){
  var lab=el('div','lbl',P.label||'','text-align:center;margin-bottom:14px;color:'+C(P.lc||'dim'));
  var n=el('div','num glow-'+(P.glow||'w'),'', 'font-size:'+(P.size||200)+'px;text-align:center;white-space:nowrap;color:'+C(P.color));
  var sub=el('div','',P.sub||'','margin-top:16px;font:700 '+(P.subsize||34)+'px Inter;text-align:center;color:#e9e5f2;text-shadow:0 4px 18px rgba(0,0,0,.85);line-height:1.2');
  if(P.label)L.inner.appendChild(lab);L.inner.appendChild(n);if(P.sub)L.inner.appendChild(sub);
  return function(t){var q=eo((t-L.t0-.04)/(P.count||.9));var v=lerp(P.from||0,P.val,q);n.textContent=(P.pre||'')+fmt(v,P.dec,P.comma)+(P.suf||'');};
};
// ---- horizontal bars ----
T.bars=function(L,P){
  var box=el('div','glass','', 'padding:30px 36px 26px;');
  if(P.title)box.appendChild(el('div','lbl',P.title,'margin-bottom:18px'));
  var rows=P.items.map(function(it,i){
    var r=el('div','','','display:flex;align-items:center;gap:22px;height:'+(P.rowh||62)+'px;');
    var l=el('div','',it.l,'width:'+(P.lw||250)+'px;font:700 28px Inter;color:#e9e5f2;flex:none');
    var tr=el('div','','','flex:1;height:36px;border-radius:9px;background:rgba(255,255,255,.07);position:relative;overflow:hidden');
    var b=el('div','','','position:absolute;left:0;top:0;bottom:0;border-radius:9px;background:linear-gradient(90deg,'+C(it.c)+'99,'+C(it.c)+');box-shadow:0 0 24px '+C(it.c)+'88');
    tr.appendChild(b);var v=el('div','num','','font-size:38px;width:'+(P.vw||170)+'px;text-align:right;flex:none;color:'+C(it.c));
    r.appendChild(l);r.appendChild(tr);r.appendChild(v);box.appendChild(r);return {r:r,b:b,v:v,it:it,i:i};});
  L.inner.appendChild(box);
  return function(t){rows.forEach(function(o){var t0=(o.it.t!=null?o.it.t:L.t0+.12+.16*o.i);var p=eo((t-t0)/.7);
    o.b.style.width=(100*clamp(o.it.v/P.max,0,1)*p)+'%';o.v.textContent=o.it.txt!=null?(p>.4?o.it.txt:''):(o.it.pre!=null?o.it.pre:(P.pre||''))+fmt(o.it.v*p,o.it.dec!=null?o.it.dec:(P.dec||0))+(o.it.suf!=null?o.it.suf:(P.suf||''));
    o.r.style.opacity=clamp((t-t0+.05)/.15,0,1);});};
};
// ---- vertical columns ----
T.cols=function(L,P){
  var H=P.h||420, box=el('div','glass','','padding:26px 40px 30px;');
  if(P.title)box.appendChild(el('div','lbl',P.title,'margin-bottom:14px'));
  var row=el('div','','','display:flex;align-items:flex-end;justify-content:space-around;gap:'+(P.gap||46)+'px;height:'+H+'px');
  var cs=P.items.map(function(it,i){
    var c=el('div','','','display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:'+(P.cw||200)+'px');
    var v=el('div','num','','font-size:'+(P.vs||56)+'px;margin-bottom:10px;color:'+C(it.c)+';white-space:nowrap');
    var b=el('div','','','width:100%;border-radius:12px 12px 0 0;height:0;background:linear-gradient(180deg,'+C(it.c)+','+C(it.c)+'55);box-shadow:0 0 36px '+C(it.c)+'66');
    var l=el('div','',it.l,'margin-top:14px;font:700 26px Inter;color:#e9e5f2;text-align:center;white-space:nowrap');
    c.appendChild(v);c.appendChild(b);row.appendChild(c);c._l=l;return {c:c,v:v,b:b,it:it,i:i,l:l};});
  box.appendChild(row);var lr=el('div','','','display:flex;justify-content:space-around;gap:'+(P.gap||46)+'px');
  cs.forEach(function(o){var w=el('div','','','width:'+(P.cw||200)+'px;text-align:center');w.appendChild(o.l);lr.appendChild(w);});
  box.appendChild(lr);L.inner.appendChild(box);
  return function(t){cs.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.12+.2*o.i;var p=eo((t-t0)/.75);
    o.b.style.height=((H-90)*clamp(o.it.v/P.max,0,1)*p)+'px';o.v.textContent=(P.pre||'')+fmt(o.it.v*p,o.it.dec!=null?o.it.dec:(P.dec||0))+(P.suf||'');
    o.c.style.opacity=clamp((t-t0+.05)/.12,0,1);});};
};
// ---- ring ----
T.ring=function(L,P){
  var S=P.size||380, r=S/2-22, cf=2*Math.PI*r;
  var box=el('div','','','position:relative;width:'+S+'px;height:'+S+'px');
  box.innerHTML='<svg width="'+S+'" height="'+S+'" style="transform:rotate(-90deg)"><circle cx="'+S/2+'" cy="'+S/2+'" r="'+r+'" fill="rgba(7,5,13,.6)" stroke="rgba(255,255,255,.12)" stroke-width="26"/><circle class="rg" cx="'+S/2+'" cy="'+S/2+'" r="'+r+'" fill="none" stroke="'+C(P.c)+'" stroke-width="26" stroke-linecap="round" stroke-dasharray="'+cf+'" stroke-dashoffset="'+cf+'" style="filter:drop-shadow(0 0 16px '+C(P.c)+')"/></svg>';
  var ctr=el('div','num glow-w','','position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:'+(P.fs||96)+'px;color:'+C(P.c));
  box.appendChild(ctr);var cap=el('div','',P.label||'','text-align:center;margin-top:18px;font:700 30px Inter;color:#e9e5f2;text-shadow:0 4px 18px rgba(0,0,0,.9)');
  L.inner.appendChild(box);if(P.label)L.inner.appendChild(cap);var rg=box.querySelector('.rg');
  return function(t){var p=eo((t-L.t0-.05)/1.0);rg.setAttribute('stroke-dashoffset',cf*(1-clamp(P.val/100,0,1)*p));ctr.textContent=(P.pre||'')+fmt(P.val*p,P.dec||0)+(P.suf||'%');};
};
// ---- quote ----
T.quote=function(L,P){
  var b=el('div','glass','','padding:40px 54px;border-left:8px solid '+C(P.c||'gold'));
  b.appendChild(el('div','h','“'+P.text+'”','font-size:'+(P.fs||54)+'px;color:#f4f1ea;line-height:1.12'));
  if(P.who)b.appendChild(el('div','lbl',P.who,'margin-top:22px;color:'+C(P.c||'gold')));
  L.inner.appendChild(b);return function(){};
};
// ---- stamp ----
T.stamp=function(L,P){
  var s=el('div','stamp',P.text,'font-size:'+(P.fs||84)+'px;color:'+C(P.c||'coral')+';transform:rotate('+(P.rot||-8)+'deg);box-shadow:0 0 50px '+C(P.c||'coral')+'55');
  L.inner.appendChild(s);return function(){};
};
// ---- card ----
T.card=function(L,P){
  var b=el('div','glass','','padding:34px 42px;');
  if(P.kicker)b.appendChild(el('div','lbl',P.kicker,'margin-bottom:12px;color:'+C(P.c)));
  if(P.head)b.appendChild(el('div','h',P.head,'font-size:'+(P.fs||60)+'px;color:#f4f1ea'));
  (P.lines||[]).forEach(function(s){b.appendChild(el('div','',s,'margin-top:14px;font:600 30px Inter;color:#d8d3e4;line-height:1.25'));});
  L.inner.appendChild(b);return function(){};
};
// ---- chips ----
T.chips=function(L,P){
  var w=el('div','','','display:flex;flex-direction:'+(P.dir||'row')+';gap:18px;flex-wrap:wrap;align-items:'+(P.align||'stretch')+';justify-content:'+(P.just||'center'));
  var cs=P.items.map(function(it,i){var c=el('div','chip',it.txt,'color:'+C(it.c)+';border-color:'+C(it.c)+'88;font-size:'+(P.fs||24)+'px');w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.1+.13*o.i;var p=eb((t-t0)/.4);o.c.style.opacity=clamp((t-t0)/.08,0,1);o.c.style.transform='scale('+lerp(.5,1,p)+')';});};
};
// ---- list (numbered rows) ----
T.list=function(L,P){
  var w=el('div','','','display:flex;flex-direction:column;gap:20px');
  var rs=P.items.map(function(it,i){var r=el('div','glass','','display:flex;align-items:center;gap:28px;padding:22px 34px;');
    r.appendChild(el('div','num',String(i+1),'font-size:84px;color:'+C(it.c)+';width:70px;text-align:center'));
    var tx=el('div','','','');tx.appendChild(el('div','h',it.h,'font-size:'+(P.fs||44)+'px;color:#f4f1ea'));if(it.s)tx.appendChild(el('div','',it.s,'margin-top:6px;font:600 26px Inter;color:#cfc9dc'));
    r.appendChild(tx);w.appendChild(r);return {r:r,it:it,i:i};});
  L.inner.appendChild(w);
  return function(t){rs.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.15+.3*o.i;var p=eo((t-t0)/.45);o.r.style.opacity=clamp((t-t0)/.1,0,1);o.r.style.transform='translateX('+lerp(150,0,p)+'px)';});};
};
// ---- versus ----
T.vs=function(L,P){
  var w=el('div','','','display:flex;align-items:center;gap:34px;');
  function side(s){var b=el('div','glass','','padding:30px 40px;text-align:center;min-width:'+(P.sw||400)+'px');b.appendChild(el('div','lbl',s.l,'color:'+C(s.c)));
    var n=el('div','num glow-w','','font-size:'+(P.fs||120)+'px;margin:12px 0 8px;color:'+C(s.c));b.appendChild(n);if(s.sub)b.appendChild(el('div','',s.sub,'font:600 26px Inter;color:#d8d3e4'));return {b:b,n:n,s:s};}
  var A=side(P.a),B=side(P.b);var mid=el('div','num',P.mid||'VS','font-size:64px;color:#f4f1ea;text-shadow:0 0 30px rgba(255,255,255,.4)');
  w.appendChild(A.b);w.appendChild(mid);w.appendChild(B.b);L.inner.appendChild(w);
  return function(t){[A,B].forEach(function(o,i){var t0=(o.s.t!=null?o.s.t:L.t0+.15+.3*i);var p=eo((t-t0)/.8);o.n.textContent=(o.s.pre||'')+fmt(o.s.v*p,o.s.dec||0)+(o.s.suf||'');o.b.style.opacity=clamp((t-t0)/.1,0,1);o.b.style.transform='scale('+lerp(.8,1,eb((t-t0)/.45))+')';});
    mid.style.opacity=clamp((t-L.t0-.3)/.15,0,1);};
};
// ---- gauge ----
T.gauge=function(L,P){
  var S=P.size||620, cx=S/2, cy=S/2, r=S/2-40;
  var svg=el('div','','','position:relative;width:'+S+'px;height:'+(S/2+90)+'px');
  function arc(a0,a1,col){var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);return '<path d="M'+x0+' '+y0+' A'+r+' '+r+' 0 0 1 '+x1+' '+y1+'" fill="none" stroke="'+col+'" stroke-width="34" stroke-linecap="butt"/>';}
  var zones=(P.zones||[['mint',0,.4],['gold',.4,.7],['coral',.7,1]]).map(function(z){return arc(Math.PI+Math.PI*z[1],Math.PI+Math.PI*z[2]-.012,C(z[0]));}).join('');
  svg.innerHTML='<svg width="'+S+'" height="'+(S/2+40)+'"><g opacity=".85" style="filter:drop-shadow(0 0 14px rgba(0,0,0,.6))">'+zones+'</g><g class="nd"><line x1="'+cx+'" y1="'+cy+'" x2="'+(cx-r+34)+'" y2="'+cy+'" stroke="#f4f1ea" stroke-width="10" stroke-linecap="round"/><circle cx="'+cx+'" cy="'+cy+'" r="18" fill="#f4f1ea"/></g></svg>';
  var val=el('div','num glow-w','','position:absolute;left:0;right:0;top:'+(cy-120)+'px;text-align:center;font-size:'+(P.fs||110)+'px;color:'+C(P.c));
  svg.appendChild(val);var nd=svg.querySelector('.nd');
  var lab=el('div','lbl',P.label||'','position:absolute;left:0;right:0;top:'+(cy+40)+'px;text-align:center;font-size:24px;color:#e9e5f2');svg.appendChild(lab);
  L.inner.appendChild(svg);
  return function(t){var p=eo((t-L.t0-.08)/(P.dur||1.1));var q=lerp(P.from||0,P.to,p); // q 0..1
    nd.setAttribute('transform','rotate('+(q*180)+' '+cx+' '+cy+')'); var shake=p>=.98?Math.sin(t*60)*1.2:0; if(shake)nd.setAttribute('transform','rotate('+(q*180+shake)+' '+cx+' '+cy+')');
    val.textContent=(P.pre||'')+fmt(lerp(P.vfrom!=null?P.vfrom:0,P.val,p),P.dec||0)+(P.suf||'');};
};
// ---- timeline ----
T.timeline=function(L,P){
  var W=P.w||1300, w=el('div','','','position:relative;width:'+W+'px;height:'+(P.h||260)+'px');
  var line=el('div','','','position:absolute;left:0;top:110px;height:6px;border-radius:3px;background:linear-gradient(90deg,#5ad7ff,#ffc53d);box-shadow:0 0 24px rgba(90,215,255,.6);width:0');w.appendChild(line);
  var n=P.items.length, ps=P.items.map(function(it,i){var x=(i/(n-1))*(W-200)+100;var up=i%2===0;
    var d=el('div','','','position:absolute;left:'+(x-16)+'px;top:98px;width:32px;height:32px;border-radius:50%;background:'+C(it.c)+';box-shadow:0 0 0 7px rgba(7,5,13,.8),0 0 28px '+C(it.c));
    var lb=el('div','','','position:absolute;left:'+(x-170)+'px;width:340px;text-align:center;'+(up?'bottom:178px':'top:150px'));
    lb.appendChild(el('div','num',it.d,'font-size:'+(P.fs||52)+'px;color:'+C(it.c)));lb.appendChild(el('div','',it.l,'font:700 26px Inter;color:#e9e5f2;margin-top:6px;text-shadow:0 3px 14px rgba(0,0,0,.9)'));
    w.appendChild(d);w.appendChild(lb);return {d:d,lb:lb,it:it,x:x,i:i};});
  L.inner.appendChild(w);
  return function(t){var last=0;ps.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.2+.5*o.i;var p=eb((t-t0)/.45);o.d.style.transform='scale('+p+')';o.lb.style.opacity=clamp((t-t0)/.12,0,1);o.lb.style.transform='translateY('+lerp(o.i%2?24:-24,0,eo((t-t0)/.4))+'px)';if(t>=t0)last=o.x;});
    var tgt=ps.reduce(function(m,o){var t0=o.it.t!=null?o.it.t:L.t0+.2+.5*o.i;return t>=t0?Math.max(m,o.x):m;},0);var f=ps.length?Math.max(0,tgt):0;line.style.width=(f?f+60:0)+'px';};
};
// ---- cells (grid, N cells, K lit) ----
T.cells=function(L,P){
  var cols=P.cols||25, rows=Math.ceil(P.n/cols), s=P.s||38, g=P.g||7;
  var w=el('div','glass','','padding:30px 34px;');w.appendChild(el('div','lbl',P.title||'','margin-bottom:16px'));
  var grid=el('div','','','display:grid;grid-template-columns:repeat('+cols+','+s+'px);gap:'+g+'px');
  var cs=[];for(var i=0;i<P.n;i++){var c=el('div','','','height:'+s+'px;border-radius:7px;background:rgba(255,255,255,.07)');grid.appendChild(c);cs.push(c);}
  w.appendChild(grid);L.inner.appendChild(w);
  var lit={};(P.lit||[]).forEach(function(k){lit[k]=1;});
  return function(t){var p=clamp((t-L.t0-.1)/.8,0,1);var tl=P.litT!=null?P.litT:L.t0+1.0;
    for(var i=0;i<cs.length;i++){var on=lit[i]&&t>=tl;var a=clamp((p*cs.length-i)/6,0,1);
      cs[i].style.opacity=a;cs[i].style.background=on?C(P.c||'mint'):'rgba(255,255,255,.07)';cs[i].style.boxShadow=on?'0 0 22px '+C(P.c||'mint'):'none';}};
};
// ---- dominoes ----
T.dominoes=function(L,P){
  var w=el('div','','','display:flex;gap:'+(P.gap||26)+'px;align-items:flex-end;height:'+(P.h||340)+'px');
  var bs=P.items.map(function(it,i){var b=el('div','glass','','width:'+(P.bw||190)+'px;height:'+(P.h||340)+'px;display:flex;align-items:center;justify-content:center;text-align:center;padding:18px;transform-origin:100% 100%;border-color:'+C(it.c)+'99');
    b.appendChild(el('div','h',it.l,'font-size:34px;color:'+C(it.c)));w.appendChild(b);return {b:b,it:it,i:i};});
  L.inner.appendChild(w);
  return function(t){bs.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.3+.55*o.i;var p=clamp((t-t0)/.5,0,1);var a=p*p*(P.ang||34);o.b.style.transform='rotate('+a+'deg) translateY('+(p*14)+'px)';o.b.style.opacity=1-.25*p;
    o.b.style.boxShadow=p>0?'0 0 50px '+C(o.it.c)+'66':'';});};
};
// ---- ledger: one dollar counted three times ----
T.ledger=function(L,P){
  var w=el('div','','','display:flex;align-items:center;gap:28px');
  var bs=P.items.map(function(it,i){var b=el('div','glass','','width:370px;padding:30px 30px 26px;text-align:center;border-color:'+C(it.c)+'99');
    b.appendChild(el('div','lbl',it.l,'color:'+C(it.c)));b.appendChild(el('div','num glow-w','$1','font-size:150px;margin:10px 0 6px;color:'+C(it.c)));b.appendChild(el('div','',it.s,'font:700 28px Inter;color:#e9e5f2'));
    var plus=el('div','num',i<P.items.length-1?'+':'','font-size:76px;color:#f4f1ea');if(i)w.appendChild(plus);w.appendChild(b);return {b:b,it:it,i:i,plus:plus};});
  L.inner.appendChild(w);
  return function(t){bs.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.2+.5*o.i;var p=eb((t-t0)/.45);o.b.style.opacity=clamp((t-t0)/.08,0,1);o.b.style.transform='scale('+lerp(.6,1,p)+') translateY('+lerp(50,0,eo((t-t0)/.4))+'px)';});};
};
// ---- graph ----
T.graph=function(L,P){
  var W=P.w||1000,H=P.h||680, NS=P.ns||112;
  var box=el('div','','','position:relative;width:'+W+'px;height:'+H+'px');
  var svgNS='http://www.w3.org/2000/svg';var svg=document.createElementNS(svgNS,'svg');svg.setAttribute('width',W);svg.setAttribute('height',H);svg.style.cssText='position:absolute;left:0;top:0';box.appendChild(svg);
  var nodes={};
  P.nodes.forEach(function(n,i){var b=BRANDS[n.id]||[n.id[0],'#fff',n.id];var d=el('div','','','position:absolute;left:'+(n.x-NS/2)+'px;top:'+(n.y-NS/2)+'px;width:'+NS+'px;height:'+NS+'px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#241a3a,#0b0814);border:5px solid '+b[1]+';display:flex;align-items:center;justify-content:center;box-shadow:0 0 36px '+b[1]+'88,0 20px 50px rgba(0,0,0,.6)');
    d.appendChild(el('div','num',b[0],'font-size:'+(b[0].length>1?44:56)+'px;color:'+b[1]));
    var lb=el('div','',b[2],'position:absolute;left:'+(n.x-120)+'px;top:'+(n.y+NS/2+8)+'px;width:240px;text-align:center;font:800 26px Bricolage;color:#f4f1ea;text-shadow:0 3px 14px #000,0 0 3px #000');
    box.appendChild(d);box.appendChild(lb);nodes[n.id]={n:n,d:d,lb:lb,c:b[1],t:n.t!=null?n.t:L.t0+.08*i};});
  var ed=(P.edges||[]).map(function(e,i){
    var A=nodes[e.a].n,B=nodes[e.b].n;var dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;var bend=e.bend!=null?e.bend:46;
    // shorten ends to node edge
    var ux=dx/len,uy=dy/len,r=NS/2+10;var a={x:A.x+ux*r,y:A.y+uy*r},b={x:B.x-ux*(r+8),y:B.y-uy*(r+8)};
    var c={x:(a.x+b.x)/2+nx*bend,y:(a.y+b.y)/2+ny*bend};var col=C(e.c||nodes[e.a].c);
    var path=document.createElementNS(svgNS,'path');path.setAttribute('d','M'+a.x+' '+a.y+' Q'+c.x+' '+c.y+' '+b.x+' '+b.y);path.setAttribute('fill','none');path.setAttribute('stroke',col);path.setAttribute('stroke-width','7');path.setAttribute('stroke-linecap','round');path.setAttribute('pathLength','1');path.setAttribute('stroke-dasharray','1');path.setAttribute('stroke-dashoffset','1');path.style.filter='drop-shadow(0 0 8px '+col+')';svg.appendChild(path);
    var ah=document.createElementNS(svgNS,'polygon');var ang=Math.atan2(b.y-c.y,b.x-c.x);var tipx=b.x+Math.cos(ang)*8,tipy=b.y+Math.sin(ang)*8;
    function pt(k){return [Math.cos(ang)*k[0]-Math.sin(ang)*k[1]+tipx,Math.sin(ang)*k[0]+Math.cos(ang)*k[1]+tipy];}
    ah.setAttribute('points',[pt([0,0]),pt([-30,-17]),pt([-30,17])].map(function(q){return q.join(',');}).join(' '));ah.setAttribute('fill',col);ah.style.filter='drop-shadow(0 0 8px '+col+')';ah.style.opacity=0;svg.appendChild(ah);
    var coins=[];if(e.coin!==false){for(var k=0;k<3;k++){var cn=el('div','num','$','position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#ffc53d;color:#3a2600;font-size:19px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px #ffc53d,inset 0 -3px 0 rgba(0,0,0,.25);opacity:0');box.appendChild(cn);coins.push(cn);}}
    var lab=null;if(e.label){lab=el('div','',e.label,'position:absolute;padding:7px 15px;border-radius:10px;background:rgba(7,5,13,.88);border:1.5px solid '+col+'99;font:700 23px JBMono;color:'+col+';white-space:nowrap;opacity:0;transform:translate(-50%,-50%)');
      var lp=e.lp!=null?e.lp:.5,m1=1-lp;var mx=m1*m1*a.x+2*m1*lp*c.x+lp*lp*b.x,my=m1*m1*a.y+2*m1*lp*c.y+lp*lp*b.y;lab.style.left=mx+'px';lab.style.top=my+'px';box.appendChild(lab);}
    return {e:e,a:a,b:b,c:c,path:path,ah:ah,coins:coins,lab:lab,t:e.t!=null?e.t:L.t0+.5+.5*i};});
  L.inner.appendChild(box);
  function Q(a,b,c,k){var m=1-k;return [m*m*a.x+2*m*k*c.x+k*k*b.x,m*m*a.y+2*m*k*c.y+k*k*b.y];}
  return function(t){
    for(var id in nodes){var o=nodes[id];var p=eb((t-o.t)/.45);o.d.style.transform='scale('+clamp(p,0,1.2)+')';o.d.style.opacity=clamp((t-o.t)/.08,0,1);o.lb.style.opacity=clamp((t-o.t-.05)/.15,0,1);}
    ed.forEach(function(o){var p=eo((t-o.t)/.55);o.path.setAttribute('stroke-dashoffset',1-clamp(p,0,1));o.ah.style.opacity=p>.97?1:0;
      if(o.lab)o.lab.style.opacity=clamp((t-o.t-.3)/.15,0,1);
      o.coins.forEach(function(cn,k){var tt=t-o.t-.5;if(tt<0){cn.style.opacity=0;return;}var f=((tt*.6+k/3)%1);var q=Q(o.a,o.b,o.c,f);cn.style.left=q[0]+'px';cn.style.top=q[1]+'px';cn.style.opacity=Math.sin(f*Math.PI)>.1?1:Math.sin(f*Math.PI)*10;});});
  };
};
// ---- kicker (chapter tag) ----
T.kicker=function(L,P){
  var b=el('div','','','display:flex;align-items:center;gap:16px;');
  b.appendChild(el('div','num',P.n,'font-size:52px;color:'+C(P.c||'gold')));
  b.appendChild(el('div','',"",'width:4px;height:44px;background:'+C(P.c||'gold')));
  b.appendChild(el('div','lbl',P.txt,'color:#f4f1ea;font-size:26px;text-shadow:0 3px 14px rgba(0,0,0,.9)'));
  L.inner.appendChild(b);return function(){};
};
// ---- headline text ----
T.head=function(L,P){
  L.inner.appendChild(el('div','h glow-w',P.txt,'font-size:'+(P.fs||96)+'px;color:#f4f1ea;text-align:'+(P.align||'center')+';white-space:pre-line'));return function(){};
};
// ---- progress bar (OpenAI runway / counter) ----
T.meter=function(L,P){
  var b=el('div','glass','','padding:28px 36px;width:100%');b.appendChild(el('div','lbl',P.title,'margin-bottom:14px'));
  var tr=el('div','','','height:48px;border-radius:12px;background:rgba(255,255,255,.07);position:relative;overflow:hidden');
  var f=el('div','','','position:absolute;left:0;top:0;bottom:0;border-radius:12px;background:linear-gradient(90deg,'+C(P.c)+'99,'+C(P.c)+');box-shadow:0 0 28px '+C(P.c)+'88');tr.appendChild(f);b.appendChild(tr);
  var v=el('div','num','','font-size:'+(P.fs||64)+'px;margin-top:14px;color:'+C(P.c));b.appendChild(v);L.inner.appendChild(b);
  return function(t){var p=eo((t-L.t0-.1)/(P.dur||1));f.style.width=(100*P.fill*p)+'%';v.textContent=(P.pre||'')+fmt(P.val*p,P.dec||0)+(P.suf||'');};
};

// ---------------- registry ----------------
var LAY=[];
window.COMPS={
  build:function(root){
    window.DATA.scenes.forEach(function(sc){(sc.layers||[]).forEach(function(P){
      var wrap=el('div','c','','left:'+(P.x||0)+'px;top:'+(P.y||0)+'px;'+(P.w?'width:'+P.w+'px;':'')+'display:none;');
      var inner=el('div','','','');wrap.appendChild(inner);root.appendChild(wrap);
      var L={wrap:wrap,inner:inner,t0:P.t0,t1:P.t1,fx:P.fx,sc:sc};
      if(P.cx!=null){wrap.style.transform='';}
      L.upd=T[P.type](L,P);L.cx=P.cx;L.cy=P.cy;L.P=P;LAY.push(L);});});
  },
  update:function(t){
    for(var i=0;i<LAY.length;i++){var L=LAY[i];var on=t>=L.t0-.02&&t<=L.t1;
      if(!on){if(L.on){L.wrap.style.display='none';L.on=false;}continue;}
      if(!L.on){L.wrap.style.display='block';L.on=true;
        if(L.cx!=null||L.cy!=null){var wd=L.wrap.offsetWidth,ht=L.wrap.offsetHeight;if(L.cx!=null)L.wrap.style.left=(L.cx-wd/2)+'px';if(L.cy!=null)L.wrap.style.top=(L.cy-ht/2)+'px';}}
      wrapFx(L,t);L.upd(t);}
  }
};
})();
