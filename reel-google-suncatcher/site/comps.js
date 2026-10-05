// "Orbital Mission Plot" components — pure functions of absolute time t.
(function(){
'use strict';
var U=window.U, clamp=U.clamp, lerp=U.lerp, sm=U.sm;
function eo(x){x=clamp(x,0,1);return x>=1?1:1-Math.pow(2,-10*x);}
function eb(x){x=clamp(x,0,1);var c=2.0;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function fmt(v,d){var s=Number(v).toFixed(d||0);var p=s.split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');return p.join('.');}
var MAG='#ff3d8b',MINT='#5dffc8',ICE='#e9e4ff',DIM='#8d86c4',VOID='#0a0720';
function C(c){return {mag:MAG,mint:MINT,ice:ICE,dim:DIM}[c]||c||ICE;}
var NS='http://www.w3.org/2000/svg';
function sv(w,h,st){var s=document.createElementNS(NS,'svg');s.setAttribute('width',w);s.setAttribute('height',h);s.style.cssText='position:absolute;left:0;top:0;'+(st||'');return s;}
function se(p,tag,at){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);p.appendChild(e);return e;}
function ICON(name,size,col){var p=(window.DATA.icons||{})[name]||'';return '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}
function T0(o,i,L,gap){return o.t!=null?o.t:L.t0+.12+(gap||.14)*i;}
function brackets(box){['left:-2px;top:-2px;border-right:0;border-bottom:0','right:-2px;top:-2px;border-left:0;border-bottom:0','left:-2px;bottom:-2px;border-right:0;border-top:0','right:-2px;bottom:-2px;border-left:0;border-top:0'].forEach(function(s){box.appendChild(el('div','bk','',s));});}
function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.2,0,1);
  if(k==='slam'){var p=eo(u/.26);a=clamp(u/.06,0,1);tr='scale('+lerp(1.5,1,p)+')';}
  else if(k==='stampin'){var q=eb(u/.3);a=clamp(u/.05,0,1);tr='scale('+lerp(2.4,1,q)+') rotate('+lerp(-14,0,q)+'deg)';}
  else if(k==='rise'){var r=eo(u/.45);a=clamp(u/.14,0,1);tr='translateY('+lerp(60,0,r)+'px)';}
  else if(k==='left'){var l=eo(u/.5);a=clamp(u/.12,0,1);tr='translateX('+lerp(-220,0,l)+'px)';}
  else if(k==='right'){var rr=eo(u/.5);a=clamp(u/.12,0,1);tr='translateX('+lerp(220,0,rr)+'px)';}
  else if(k==='drop'){var d=eb(u/.55);a=clamp(u/.08,0,1);tr='translateY('+lerp(-200,0,d)+'px) rotate('+lerp(-6,0,d)+'deg)';}
  else if(k==='iris'){var ir=eo(u/.5);a=clamp(u/.1,0,1);tr='scale('+lerp(.7,1,ir)+')';}
  else{a=clamp(u/.2,0,1);}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};
// ---- HUD: mission clock, scene counter, orbit progress rail ----
T.hud=function(L,P){
  var w=L.inner;w.style.cssText='position:absolute;left:0;top:0;width:1080px;height:230px';
  var clk=el('div','mono','','position:absolute;left:150px;top:150px;font-size:22px;color:'+MINT);w.appendChild(clk);
  w.appendChild(el('div','mono','SUNCATCHER · '+P.n+'/11','position:absolute;right:162px;top:150px;font-size:22px;color:'+MINT));
  var s=sv(1080,230);w.appendChild(s);se(s,'line',{x1:150,y1:198,x2:918,y2:198,stroke:'rgba(93,255,200,.35)','stroke-width':2,'stroke-dasharray':'4 8'});
  var prog=se(s,'line',{x1:150,y1:198,x2:150,y2:198,stroke:MAG,'stroke-width':4});var dot=se(s,'circle',{cx:150,cy:198,r:9,fill:MINT});se(s,'circle',{cx:918,cy:198,r:9,fill:'none',stroke:MINT,'stroke-width':2});
  return function(t){var m=Math.floor(t/60),sec=Math.floor(t%60);clk.textContent='T+'+(m<10?'0':'')+m+':'+(sec<10?'0':'')+sec;var x=150+768*clamp(t/window.DATA.total,0,1);prog.setAttribute('x2',x);dot.setAttribute('cx',x);};
};
T.head=function(L,P){
  var ls=P.lines.map(function(ln){var d=el('div','sy',ln.txt,'font-size:'+(ln.size||90)+'px;color:'+C(ln.c||'ice')+';white-space:nowrap;'+(ln.mt?'margin-top:'+ln.mt+'px;':''));L.inner.appendChild(d);return {d:d,ln:ln};});
  return function(t){ls.forEach(function(o){var t0=o.ln.t!=null?o.ln.t:L.t0,u=t-t0,p=eo(u/.35);o.d.style.opacity=clamp(u/.08,0,1);o.d.style.transform='translateY('+lerp(46,0,p)+'px)';});};
};
T.eyebrow=function(L,P){var d=el('div','mono',P.txt,'font-size:24px;color:'+MAG+';white-space:nowrap');L.inner.appendChild(d);return function(t){var n=Math.floor(clamp((t-L.t0)/.6,0,1)*P.txt.length);d.textContent=P.txt.slice(0,n)+((t*2%1)<.5?'▌':'');};};
// ---- bracket stat panel with counting value ----
T.stat=function(L,P){
  var p=el('div','panel','','width:'+P.w+'px;height:'+(P.h||160)+'px;padding:18px 24px');
  p.appendChild(el('div','mono',P.label,'font-size:'+(P.ls||18)+'px;color:'+DIM));
  var n=el('div','sy','','font-size:'+(P.size||72)+'px;color:'+C(P.c||'mint')+';margin-top:6px;white-space:nowrap');p.appendChild(n);L.inner.appendChild(p);
  return function(t){var q=eo((t-L.t0-.05)/(P.dur||.9));if(P._txt){n.textContent=P._txt.slice(0,Math.floor(clamp((t-L.t0-.2)/.5,0,1)*P._txt.length));return;}n.textContent=(P.pre||'')+(P.raw?Math.round(lerp(P.from||0,P.val,q)):fmt(lerp(P.from||0,P.val,q),P.dec))+(P.suf||'');};
};
// ---- photo window with slow push-in ----
T.photo=function(L,P){
  var f=el('div','photo','','left:0;top:0;width:'+P.w+'px;height:'+P.h+'px;');
  var ph=el('div','ph','','background-image:url(shots/'+P.img+'.jpg);'+(P.pos?'background-position:'+P.pos+';':''));f.appendChild(ph);brackets(f);
  if(P.cap)f.appendChild(el('div','cap mono',P.cap));L.inner.appendChild(f);
  return function(t){var u=t-L.t0;f.style.transform='rotate('+((P.rot||0)+.4*Math.sin(u*.9))+'deg)';ph.style.backgroundSize=(116+5*Math.min(u/6,1.2))+'%';ph.style.backgroundPosition=(P.pos||'50% 50%');};
};
T.tags=function(L,P){
  var w=el('div','','','display:flex;gap:12px;flex-wrap:wrap;'+(P.col?'flex-direction:column;align-items:flex-start;':''));
  var cs=P.items.map(function(it,i){var c=el('div','tag'+(it.k?' '+it.k:''),it.txt,'font-size:'+(P.size||21)+'px');w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);return function(t){cs.forEach(function(o){var t0=T0(o.it,o.i,L,.16),p=eb((t-t0)/.35);o.c.style.opacity=clamp((t-t0)/.08,0,1);o.c.style.transform='scale('+lerp(.6,1,p)+')';});};
};
// ---- mission patch ----
T.patch=function(L,P){
  var s=P.size||160,d=el('div','','','width:'+s+'px;height:'+s+'px;border-radius:50%;border:4px dashed '+C(P.c||'mint')+';display:flex;align-items:center;justify-content:center;text-align:center;background:rgba(10,7,32,.88);box-shadow:0 0 0 6px rgba(10,7,32,.88)');
  d.appendChild(el('div','mono',P.txt,'font-size:'+(P.fs||17)+'px;line-height:1.35;color:'+C(P.c||'mint')));L.inner.appendChild(d);
  return function(t){var q=eb((t-L.t0)/.4);d.style.transform='rotate('+((P.rot||8)+lerp(-60,0,q)+Math.sin((t-L.t0)*1.2)*2)+'deg)';};
};
// ---- orbit tracks with a travelling satellite ----
T.orbit=function(L,P){
  var s=sv(1080,1920);L.inner.appendChild(s);var cx=P.cx,cy=P.cy,rot=P.rot||-18;
  var g=se(s,'g',{transform:'rotate('+rot+' '+cx+' '+cy+')'});
  se(g,'ellipse',{cx:cx,cy:cy,rx:P.rx,ry:P.ry,fill:'none',stroke:MINT,'stroke-opacity':.5,'stroke-width':2,'stroke-dasharray':'6 10'});
  se(g,'ellipse',{cx:cx,cy:cy,rx:P.rx*.78,ry:P.ry*.74,fill:'none',stroke:MAG,'stroke-opacity':.55,'stroke-width':2});
  var dot=se(g,'circle',{r:12,fill:MINT}),ring=se(g,'circle',{r:28,fill:'none',stroke:MINT,'stroke-width':2});
  var tr=[];for(var i=0;i<10;i++)tr.push(se(g,'circle',{r:7-i*.55,fill:MINT,opacity:0}));
  return function(t){var a=(t-L.t0)*(P.sp||.9)+(P.ph||0);function pt(a){return [cx+P.rx*Math.cos(a),cy+P.ry*Math.sin(a)];}
    var p=pt(a);dot.setAttribute('cx',p[0]);dot.setAttribute('cy',p[1]);ring.setAttribute('cx',p[0]);ring.setAttribute('cy',p[1]);ring.setAttribute('r',26+4*Math.sin(t*5));
    tr.forEach(function(c,i){var q=pt(a-(i+1)*.07);c.setAttribute('cx',q[0]);c.setAttribute('cy',q[1]);c.setAttribute('opacity',.5-i*.05);});};
};
// ---- launch timeline rail (T+0 → T+61 min → contact) ----
T.rail=function(L,P){
  var W=P.w,s=sv(W,260);L.inner.appendChild(s);var y=120;
  se(s,'line',{x1:0,y1:y,x2:W,y2:y,stroke:'rgba(93,255,200,.35)','stroke-width':4});
  var prog=se(s,'line',{x1:0,y1:y,x2:0,y2:y,stroke:MAG,'stroke-width':6});var rk=se(s,'circle',{cx:0,cy:y,r:13,fill:MAG});
  var ms=P.marks.map(function(m){var x=W*m.at;se(s,'line',{x1:x,y1:y-22,x2:x,y2:y+22,stroke:MINT,'stroke-width':3});
    var a=el('div','mono',m.top,'position:absolute;left:'+(x-110)+'px;width:220px;text-align:center;top:30px;font-size:21px;color:'+MINT+';opacity:0');var b=el('div','sy',m.big,'position:absolute;left:'+(x-130)+'px;width:260px;text-align:center;top:150px;font-size:'+(m.fs||40)+'px;color:'+C(m.c||'ice')+';opacity:0');L.inner.appendChild(a);L.inner.appendChild(b);return {a:a,b:b,m:m};});
  return function(t){var p=eo((t-L.t0-.2)/P.dur);var x=W*p;prog.setAttribute('x2',x);rk.setAttribute('cx',x);ms.forEach(function(o){var on=t>=o.m.t;o.a.style.opacity=on?1:.25;o.b.style.opacity=on?clamp((t-o.m.t)/.2,0,1):0;});};
};
// ---- satellite schematic: 4 TPUs light up, 1 kW counter ----
T.sat=function(L,P){
  var s=sv(768,430);L.inner.appendChild(s);var g=se(s,'g',{transform:'rotate(-5 384 215)'});
  [[0],[598]].forEach(function(a){var x=a[0];var r=se(g,'rect',{x:x,y:105,width:170,height:230,fill:'#16269a',stroke:'#9ab0ff','stroke-width':2});for(var i=1;i<6;i++)se(g,'line',{x1:x+i*28.3,y1:105,x2:x+i*28.3,y2:335,stroke:'#5b76ff','stroke-width':1.5});for(var j=1;j<4;j++)se(g,'line',{x1:x,y1:105+j*57.5,x2:x+170,y2:105+j*57.5,stroke:'#5b76ff','stroke-width':1.5});});
  se(g,'line',{x1:170,y1:220,x2:210,y2:220,stroke:'#9ab0ff','stroke-width':4});se(g,'line',{x1:558,y1:220,x2:598,y2:220,stroke:'#9ab0ff','stroke-width':4});
  se(g,'rect',{x:210,y:60,width:348,height:320,fill:'#140f45',stroke:MINT,'stroke-width':3});
  var chips=[0,1,2,3].map(function(i){var x=235+(i%2)*160,y=90+Math.floor(i/2)*145;var r=se(g,'rect',{x:x,y:y,width:134,height:115,fill:'rgba(255,61,139,.1)',stroke:MAG,'stroke-width':2});var tx=se(g,'text',{x:x+67,y:y+66,'text-anchor':'middle',fill:MAG,'font-family':'SM','font-weight':700,'font-size':26});tx.textContent='TPU '+(i+1);return {r:r,tx:tx};});
  var kw=el('div','sy','','position:absolute;left:0;top:360px;width:768px;text-align:center;font-size:64px;color:'+MINT);L.inner.appendChild(kw);
  return function(t){var u=t-L.t0;chips.forEach(function(c,i){var on=u>.5+.35*i,fl=on?(.55+.45*Math.sin(u*6+i)):0;c.r.setAttribute('fill',on?'rgba(255,61,139,'+(.25+.3*fl)+')':'rgba(255,61,139,.08)');c.tx.setAttribute('fill',on?'#fff':MAG);});
    kw.textContent='≈ '+(1*eo((u-.3)/1.2)).toFixed(1)+' kW';};
};
// ---- dawn-dusk sunlight diagram ----
T.sundiag=function(L,P){
  var s=sv(768,520);L.inner.appendChild(s);var cx=384,cy=270;
  var rays=[];for(var i=0;i<7;i++){rays.push(se(s,'line',{x1:0,y1:70+i*63,x2:300,y2:cy-150+i*50,stroke:'#ffd36e','stroke-width':3,'stroke-opacity':.7}));}
  se(s,'circle',{cx:-20,cy:cy,r:70,fill:'#ffd36e'});
  se(s,'circle',{cx:cx+30,cy:cy,r:150,fill:'#0d1642',stroke:'#3a55c8','stroke-width':3});
  se(s,'path',{d:'M'+(cx+30)+' '+(cy-150)+'A150 150 0 0 1 '+(cx+30)+' '+(cy+150),fill:'#070b24'});
  se(s,'ellipse',{cx:cx+30,cy:cy,rx:40,ry:230,fill:'none',stroke:MINT,'stroke-width':2,'stroke-dasharray':'6 8'});
  var sat=se(s,'circle',{r:11,fill:MINT}),ring=se(s,'circle',{r:24,fill:'none',stroke:MINT,'stroke-width':2});
  var lbl=el('div','mono','ALWAYS ON THE SUNNY EDGE','position:absolute;left:470px;top:40px;width:300px;font-size:19px;color:'+MINT+';line-height:1.4');L.inner.appendChild(lbl);
  var lb2=el('div','mono','EARTH’S NIGHT SIDE','position:absolute;left:470px;top:460px;font-size:17px;color:'+DIM);L.inner.appendChild(lb2);
  return function(t){var u=t-L.t0,a=u*1.3;var x=cx+30+40*Math.cos(a),y=cy+230*Math.sin(a);sat.setAttribute('cx',x);sat.setAttribute('cy',y);ring.setAttribute('cx',x);ring.setAttribute('cy',y);ring.setAttribute('r',22+4*Math.sin(u*5));
    rays.forEach(function(r,i){r.setAttribute('stroke-opacity',.35+.35*Math.sin(u*3+i));});};
};
// ---- Amazon plant bar: 690 of 1,980 MW ----
T.plant=function(L,P){
  var w=el('div','panel','','width:'+P.w+'px;padding:22px 26px 26px');
  w.appendChild(el('div','mono','AMAZON × CONSTELLATION · CALVERT CLIFFS, MD','font-size:18px;color:'+DIM));
  var row=el('div','','','display:flex;align-items:baseline;gap:18px;margin-top:8px');var n=el('div','sy','','font-size:84px;color:'+MINT);row.appendChild(n);row.appendChild(el('div','mono','MW · 20 YEARS','font-size:22px;color:'+ICE));w.appendChild(row);
  var bar=el('div','','','position:relative;height:44px;border:2px solid '+MINT+';margin-top:14px');var f=el('div','','','position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+MAG+',#ff8fbc)');bar.appendChild(f);w.appendChild(bar);
  var lab=el('div','mono','','display:flex;justify-content:space-between;font-size:17px;margin-top:8px;color:'+DIM);lab.appendChild(el('span','','690 MW'));lab.appendChild(el('span','','1,980 MW AFTER UPRATE'));w.appendChild(lab);
  L.inner.appendChild(w);return function(t){var q=eo((t-L.t0-.2)/1.1);n.textContent=fmt(690*q);f.style.width=(34.85*q)+'%';};
};
// ---- proton-beam radiation test + dose bar ----
T.dose=function(L,P){
  var w=el('div','panel','','width:'+P.w+'px;padding:22px 26px 26px');w.appendChild(el('div','mono','DOSE vs A FIVE-YEAR MISSION','font-size:18px;color:'+DIM));
  var bar=el('div','','','position:relative;height:54px;border:2px solid '+MINT+';margin-top:16px;background:rgba(0,0,0,.25)');var f=el('div','','','position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+MINT+',#b8ffe9)');bar.appendChild(f);
  var mk=el('div','','','position:absolute;left:66.6%;top:-14px;bottom:-14px;border-left:4px dashed '+MAG);bar.appendChild(mk);w.appendChild(bar);
  var l2=el('div','mono','5-YEAR MISSION DOSE','position:absolute;left:'+(26+(P.w-52)*.666-96)+'px;top:118px;font-size:16px;color:'+MAG);w.appendChild(l2);
  w.appendChild(el('div','mono','TRILLIUM TPUs · UC DAVIS PROTON BEAM · RUNNING AI WORKLOADS','font-size:14px;color:'+DIM+';margin-top:44px;line-height:1.5'));
  var v=el('div','sy','','font-size:46px;color:'+MINT+';margin-top:10px;opacity:0');w.appendChild(v);L.inner.appendChild(w);
  return function(t){var q=eo((t-L.t0-.3)/(P.dur||1.8));f.style.width=(96*q)+'%';var on=q>.7;v.textContent='SURVIVED ✔';v.style.opacity=on?clamp((q-.7)/.2,0,1):0;};
};
T.beam=function(L,P){
  var s=sv(768,200);L.inner.appendChild(s);
  se(s,'rect',{x:620,y:50,width:100,height:100,fill:'rgba(255,61,139,.15)',stroke:MAG,'stroke-width':3});var tx=se(s,'text',{x:670,y:110,'text-anchor':'middle',fill:MAG,'font-family':'SM','font-weight':700,'font-size':24});tx.textContent='TPU';
  se(s,'line',{x1:0,y1:100,x2:610,y2:100,stroke:'rgba(93,255,200,.25)','stroke-width':14});
  var ps=[];for(var i=0;i<14;i++)ps.push(se(s,'circle',{r:7,cy:100,fill:MINT}));
  var hit=se(s,'circle',{cx:620,cy:100,r:10,fill:'none',stroke:'#fff','stroke-width':2});
  return function(t){var u=t-L.t0;ps.forEach(function(p,i){var x=((u*420+i*45)%630);p.setAttribute('cx',x);p.setAttribute('cy',100+((i%3)-1)*10*Math.sin(u*8+i));p.setAttribute('opacity',x>600?0:1);});hit.setAttribute('r',10+12*((u*3)%1));hit.setAttribute('opacity',1-((u*3)%1));};
};
// ---- 81-satellite lattice ----
T.lattice=function(L,P){
  var cell=P.cell||60,N=9,s=sv(N*cell+80,N*cell+80);L.inner.appendChild(s);var dots=[];
  for(var r=0;r<N;r++)for(var c=0;c<N;c++){var d=se(s,'circle',{cx:40+c*cell,cy:40+r*cell,r:6,fill:(r*N+c)%7===0?MAG:MINT,opacity:0});dots.push(d);}
  var ring=se(s,'circle',{cx:40+4*cell,cy:40+4*cell,r:0,fill:'none',stroke:MAG,'stroke-width':2,'stroke-dasharray':'4 8'});
  var cnt=el('div','sy','','position:absolute;right:0;top:-6px;font-size:70px;color:'+MINT);L.inner.appendChild(cnt);
  return function(t){var u=t-L.t0,p=eo((u-.1)/(P.dur||1.8)),n=Math.floor(p*81);cnt.textContent=n;dots.forEach(function(d,i){var on=i<n;d.setAttribute('opacity',on?(.75+.25*Math.sin(u*4+i)):0);d.setAttribute('r',on?6+1.2*Math.sin(u*5+i):6);});
    ring.setAttribute('r',4.9*cell*eo((u-1.2)/.8));ring.setAttribute('transform','rotate('+(u*8)+' '+(40+4*cell)+' '+(40+4*cell)+')');};
};
// ---- balance: launch cost vs Earth power bill ----
T.balance=function(L,P){
  var s=sv(768,420);L.inner.appendChild(s);
  se(s,'polygon',{points:'384,380 344,400 424,400',fill:MINT});se(s,'line',{x1:384,y1:130,x2:384,y2:380,stroke:MINT,'stroke-width':6});
  var beam=se(s,'g',{});se(beam,'line',{x1:90,y1:130,x2:678,y2:130,stroke:ICE,'stroke-width':8});
  function pan(x,col){var g=se(beam,'g',{});se(g,'line',{x1:x,y1:130,x2:x-60,y2:230,stroke:col,'stroke-width':3});se(g,'line',{x1:x,y1:130,x2:x+60,y2:230,stroke:col,'stroke-width':3});se(g,'rect',{x:x-84,y:230,width:168,height:16,fill:col});return g;}
  var pl=pan(90,MAG),pr=pan(678,MINT);
  var a=el('div','','','position:absolute;left:0;top:262px;width:200px;text-align:center');a.appendChild(el('div','sy','$200/kg','font-size:34px;color:'+MAG));a.appendChild(el('div','mono','LAUNCH COST','font-size:14px;color:'+DIM+';margin-top:6px'));L.inner.appendChild(a);
  var b=el('div','','','position:absolute;left:578px;top:262px;width:200px;text-align:center');var bn=el('div','sy','','font-size:34px;color:'+MINT);b.appendChild(bn);b.appendChild(el('div','mono','PER kW-YEAR IN ORBIT','font-size:14px;color:'+DIM+';margin-top:6px'));L.inner.appendChild(b);
  var ce=el('div','mono','≈ WHAT US DATA CENTERS PAY FOR POWER','position:absolute;left:0;top:0;width:768px;text-align:center;font-size:19px;color:'+ICE+';opacity:0');L.inner.appendChild(ce);
  return function(t){var u=t-L.t0,tilt=lerp(14,0,eo((u-.5)/1.3));beam.setAttribute('transform','rotate('+tilt+' 384 130)');
    [pl,pr].forEach(function(g,i){g.setAttribute('transform','rotate('+(-tilt)+' '+(i?678:90)+' 130)');});
    bn.textContent='~$'+fmt(810*eo((u-.6)/1.2));ce.style.opacity=clamp((u-1.9)/.3,0,1);};
};
// ---- heat radiates, fans useless ----
T.heat=function(L,P){
  var s=sv(768,420);L.inner.appendChild(s);var cx=384,cy=210;
  var rings=[];for(var i=0;i<4;i++)rings.push(se(s,'circle',{cx:cx,cy:cy,r:80,fill:'none',stroke:MAG,'stroke-width':3,opacity:0}));
  var chip=se(s,'rect',{x:cx-60,y:cy-60,width:120,height:120,fill:'#ff3d8b',stroke:'#ffd0e6','stroke-width':3,rx:6});
  var tx=se(s,'text',{x:cx,y:cy+9,'text-anchor':'middle',fill:'#fff','font-family':'SM','font-weight':700,'font-size':26});tx.textContent='TPU';
  var fan=el('div','',ICON('x',56,MAG),'position:absolute;left:40px;top:30px');L.inner.appendChild(fan);
  L.inner.appendChild(el('div','mono','NO AIR · NO FANS','position:absolute;left:112px;top:46px;font-size:24px;color:'+MAG));
  L.inner.appendChild(el('div','mono','HEAT ESCAPES ONLY AS GLOW','position:absolute;left:0;width:768px;text-align:center;top:392px;font-size:20px;color:'+ICE));
  return function(t){var u=t-L.t0;rings.forEach(function(r,i){var q=((u*.55+i/4)%1);r.setAttribute('r',80+q*280);r.setAttribute('opacity',(1-q)*.7);});var g=.5+.5*Math.sin(u*4);chip.setAttribute('fill','rgb(255,'+Math.round(61+60*g)+','+Math.round(139-40*g)+')');};
};
// ---- telemetry panel: pending readouts ----
T.telem=function(L,P){
  var w=el('div','panel','','width:'+P.w+'px;padding:20px 26px 22px');w.appendChild(el('div','mono','IN-ORBIT DATA · INCOMING','font-size:18px;color:'+DIM+';margin-bottom:10px'));
  var rows=P.rows.map(function(r,i){var d=el('div','','','display:flex;align-items:center;gap:16px;padding:12px 0;border-top:1.5px solid rgba(93,255,200,.2);opacity:0');var lamp=el('i','','','display:block;width:20px;height:20px;border-radius:50%;background:'+MAG);d.appendChild(lamp);d.appendChild(el('span','sy',r.k,'font-size:34px;flex:1'));d.appendChild(el('span','mono',r.v,'font-size:19px;color:'+DIM));w.appendChild(d);return {d:d,lamp:lamp,r:r,i:i};});
  L.inner.appendChild(w);return function(t){rows.forEach(function(o){var t0=T0(o.r,o.i,L,.5),p=eo((t-t0)/.3);o.d.style.opacity=clamp((t-t0)/.1,0,1);o.d.style.transform='translateY('+lerp(14,0,p)+'px)';o.lamp.style.opacity=.45+.55*Math.abs(Math.sin((t-t0)*3));});};
};
T.pending=function(L,P){
  var w=el('div','','','display:grid;grid-template-columns:repeat(9,'+P.cell+'px);gap:'+P.gap+'px');var cs=[];
  for(var i=0;i<81;i++){var d=el('i','','','display:block;width:'+P.cell+'px;height:'+P.cell+'px;border-radius:50%;border:2px solid rgba(93,255,200,.35)');w.appendChild(d);cs.push(d);}
  L.inner.appendChild(w);return function(t){var u=t-L.t0;cs.forEach(function(d,i){var on=i===40;d.style.background=on?MINT:'transparent';d.style.borderColor=on?MINT:'rgba(93,255,200,'+(.2+.2*Math.sin(u*3+i*.7))+')';d.style.boxShadow=on?'0 0 16px 4px rgba(93,255,200,.7)':'none';});};
};
T.logo=function(L,P){
  var d=el('div','',window.DATA.logos[P.name]||'','color:'+C(P.c||'ice')+';width:'+P.w+'px;');var sv0=d.querySelector('svg');if(sv0){sv0.setAttribute('width',P.w);sv0.removeAttribute('height');sv0.style.height='auto';}L.inner.appendChild(d);return function(){};
};
T.ticker=function(L,P){
  var w=el('div','mono','','width:'+P.w+'px;height:46px;border-top:2px solid '+MAG+';border-bottom:2px solid '+MAG+';overflow:hidden;white-space:nowrap;font-size:20px;line-height:42px;color:'+ICE+';position:relative;');
  var inner=el('div','',(P.txt+'   ◆   ').repeat(6),'position:absolute;left:0;top:0;');w.appendChild(inner);L.inner.appendChild(w);
  return function(t){inner.style.transform='translateX('+(-(t*140)%(P.txt.length*13.2+90))+'px)';};
};
T.cta=function(L,P){
  var w=el('div','','','width:768px;text-align:center');
  w.appendChild(el('div','',"<img src='profile.jpg' style='width:100%;height:100%;border-radius:50%;object-fit:cover;border:7px solid "+VOID+"'>",'width:290px;height:290px;border-radius:50%;padding:8px;margin:0 auto;background:conic-gradient('+MINT+','+MAG+','+MINT+');box-shadow:0 0 60px 8px rgba(93,255,200,.45)'));
  w.appendChild(el('div','mono','NEW BREAKDOWN EVERY WEEK','font-size:20px;color:'+DIM+';margin-top:26px'));
  w.appendChild(el('div','sy',P.handle,'font-size:46px;margin-top:10px;white-space:nowrap'));
  var btn=el('div','mono','＋ FOLLOW','margin:26px auto 0;width:520px;height:86px;border-radius:44px;background:'+MAG+';color:#fff;font-size:34px;display:flex;align-items:center;justify-content:center;letter-spacing:.2em');w.appendChild(btn);
  L.inner.appendChild(w);return function(t){var u=t-L.t0,s=1+.04*Math.sin(u*5)*clamp(u-.6,0,1);btn.style.transform='scale('+s+')';btn.style.boxShadow='0 0 '+(20+14*Math.sin(u*5))+'px rgba(255,61,139,.7)';};
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
