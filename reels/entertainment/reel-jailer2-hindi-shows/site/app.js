// Jailer 2 Hindi-shows reel. All visuals are pure functions of t (window.__seek). Host video + dust overlay are seeked per frame.
(function(){
var TM=window.TM,S=TM.S,END=TM.END,TR=.4,NS='http://www.w3.org/2000/svg';
var $=function(id){return document.getElementById(id)};
function cl(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))}
var E={o3:function(x){return 1-Math.pow(1-x,3)},o5:function(x){return 1-Math.pow(1-x,5)},io:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
 bk:function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
function seg(t,a,b){return cl((t-a)/(b-a))}
function lerp(a,b,u){return a+(b-a)*u}
function ent(el,t,t0,d,o){o=o||{};var u=E.o5(seg(t,t0,t0+d));el.style.opacity=u;
 el.style.transform='translate('+((o.x||0)*(1-u))+'px,'+((o.y==null?30:o.y)*(1-u))+'px) scale('+(1-(1-(o.s||1))*(1-u))+') rotate('+((o.r||0)*(1-u))+'deg)'}
function pop(el,t,t0,d,r){var u=seg(t,t0,t0+d);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u>0?E.bk(u):.3)+')'}
function mk(html){var d=document.createElement('div');d.className='sc';d.innerHTML=html;$('scenes').appendChild(d);return d}
function q(sc,s){return sc.querySelector(s)}
function sv(tag,at,parent){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(parent)parent.appendChild(e);return e}
function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
var C={hindi:'#ff3d7f',tamil:'#2ee6d6',telugu:'#a58bff',kannada:'#c6f432',paper:'#f3e9d2',ink:'#1a0c10',dim:'#8a7378'};
var defs=[];
// ---- scene 0: ticket (kinetic type + CSS-3D ticket) ----
defs[0]=function(){
 var d=mk('<div class="eye" data-b="eye"><i></i>JAILER 2 · DAY ONE</div><div class="h" data-b="h">Jailer 2:<br><span class="k">Day one</span></div>'+
 '<div id="tkwrap" style="position:absolute;left:130px;top:470px;width:780px;height:540px;perspective:1400px"><div id="tk" style="position:absolute;inset:0;transform-style:preserve-3d">'+
 '<div id="tkm" data-b="ticket" style="position:absolute;left:0;top:0;width:540px;height:540px;background:#f3e9d2;border-radius:20px 0 0 20px;color:#1a0c10;box-shadow:0 26px 50px rgba(0,0,0,.55)">'+
  '<div style="position:absolute;left:36px;top:30px;font:700 19px MM;letter-spacing:.06em">ADMIT ONE · WORLDWIDE · DAY 1</div>'+
  '<div id="odo" style="position:absolute;left:36px;top:110px;font:400 150px/1 Archivo;font-variant-numeric:tabular-nums">₹0</div>'+
  '<div style="position:absolute;left:40px;top:285px;font:700 30px MM">CRORE + GROSS</div>'+
  '<div style="position:absolute;left:40px;top:345px;font:600 20px/1.5 MM;color:#5b3a40">TRACKERS RANGE ₹124–130 CR<br>NO OFFICIAL FIGURE YET</div>'+
  '<div style="position:absolute;left:36px;bottom:30px;width:468px;height:34px;background:repeating-linear-gradient(90deg,#1a0c10 0 3px,transparent 3px 7px,#1a0c10 7px 8px,transparent 8px 13px)"></div>'+
  '<div style="position:absolute;right:-22px;top:248px;width:44px;height:44px;border-radius:50%;background:#1a0c10"></div></div>'+
 '<div id="tks" data-b="stub" style="position:absolute;left:540px;top:0;width:240px;height:540px;background:#f3e9d2;border-radius:0 20px 20px 0;border-left:4px dashed #b9a98c;color:#1a0c10;box-shadow:0 26px 50px rgba(0,0,0,.55);transform-origin:0 50%">'+
  '<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-90deg);font:400 62px Archivo;white-space:nowrap">JAILER 2</div>'+
  '<div style="position:absolute;right:-22px;top:248px;width:44px;height:44px;border-radius:50%;background:#1a0c10"></div></div></div></div>'+
 '<div class="chip" id="k1" data-b="k1" style="left:130px;top:1050px">INDIA NET ₹59.70 CR</div><div class="chip" id="k2" data-b="k2" style="left:500px;top:1050px">OVERSEAS ≈ US$6.0M</div>'+
 '<div id="tick" data-b="tick" style="position:absolute;left:120px;top:1122px;width:800px;height:40px;overflow:hidden;border-top:2px solid #8a7378;border-bottom:2px solid #8a7378"><div id="tickin" style="position:absolute;left:0;top:7px;white-space:nowrap;font:700 20px MM;letter-spacing:.08em;color:#8a7378"></div></div>'+
 '<div class="src" data-b="src" style="top:1180px">SACNILK · PINKVILLA · IWMBUZZ · TRACKTOLLYWOOD (16 OCT 2026)</div>');
 var TK='TRACKER FIGURES · NOT OFFICIAL · 16 OCT 2026 · JAILER 2 · DAY ONE · '; q(d,'#tickin').textContent=TK+TK+TK+TK;
 return function(t){var lt=t;
  ent(q(d,'.eye'),t,-.3,.5,{y:14});ent(q(d,'.h'),t,-.25,.65);
  var wr=q(d,'#tkwrap');ent(wr,t,-.3,.8,{y:60,s:.92});
  q(d,'#tk').style.transform='rotateY('+(-9+6*Math.sin(t*.9))+'deg) rotateX('+(3*Math.sin(t*.7))+'deg)';
  var n=Math.round(125*E.o3(seg(t,-.2,3.9)));q(d,'#odo').textContent='₹'+n;
  var tear=E.io(seg(t,5.0,5.75)),st=q(d,'#tks');
  st.style.transform='translateX('+(tear*250)+'px) rotate('+(tear*16)+'deg)';st.style.opacity=1-tear;
  q(d,'#tkm').style.transform='translateX('+(-tear*20)+'px)';
  q(d,'.src').style.opacity=E.o3(seg(t,1.2,1.8));ent(q(d,'#k1'),t,.9,.5,{y:16});ent(q(d,'#k2'),t,1.2,.5,{y:16});q(d,'#tick').style.opacity=E.o3(seg(t,1.4,2));q(d,'#tickin').style.transform='translateX('+(-((t*70)%(TK.length*12.2)))+'px)'}};
// ---- scene 1: worldwide bar vs Hindi sliver ----
defs[1]=function(){var X0=160,W=750,hw=Math.max(22,W*3.5/125),iw=W*59.7/125,st=S[1];
 var d=mk('<div class="eye" data-b="eye"><i></i>HINDI VERSION · INDIA NET</div><div class="h" data-b="h">Hindi share:<br><span class="k">₹3.5 cr</span></div>'+
 '<div class="lab" id="l1" data-b="l1" style="left:'+X0+'px;top:456px;color:#f3e9d2">WORLDWIDE GROSS (TRACKERS ₹124–130 CR)</div>'+
 '<div id="bw" data-b="barw" style="position:absolute;left:'+X0+'px;top:494px;width:'+W+'px;height:76px;background:#f3e9d2;transform-origin:0 50%"><div style="position:absolute;left:20px;top:11px;font:400 44px Archivo;color:#1a0c10">₹125 CR+</div></div>'+
 '<div class="lab" id="l3" data-b="l3" style="left:'+X0+'px;top:606px;color:#f3e9d2">INDIA NET · ALL LANGUAGES (SACNILK)</div>'+
 '<div id="bi" data-b="bari" style="position:absolute;left:'+X0+'px;top:644px;width:'+iw+'px;height:76px;background:#8f7f6a;transform-origin:0 50%"><div style="position:absolute;left:20px;top:11px;font:400 44px Archivo;color:#1a0c10;white-space:nowrap">₹59.70 CR</div></div>'+
 '<div class="lab" id="l2" data-b="l2" style="left:'+X0+'px;top:756px;color:#ff3d7f">HINDI VERSION · INDIA NET (SACNILK)</div>'+
 '<div id="bh" data-b="barh" style="position:absolute;left:'+X0+'px;top:794px;width:'+hw+'px;height:76px;background:#ff3d7f;transform-origin:0 50%"></div>'+
 '<div id="bv" data-b="val" style="position:absolute;left:'+(X0+hw+18)+'px;top:800px;font:400 48px Archivo;color:#ff3d7f;white-space:nowrap">₹3.5 CR</div>'+
 '<div class="lab" id="ptr" data-b="ptr" style="left:'+X0+'px;top:890px;color:#ff3d7f">▲ THIS SLIVER IS HINDI</div>'+
 '<div class="stamp" id="why" data-b="stamp" style="left:470px;top:950px;background:#1a0c10">Why?</div>'+
 '<div class="chip" id="ch" data-b="chip" style="left:'+X0+'px;top:1124px;border-color:#8a7378;color:#f3e9d2">HINDI ≈ 5.9% OF INDIA NET</div>'+
 '<div class="src" data-b="src" style="top:1180px">SACNILK · PINKVILLA · IWMBUZZ · TRACKTOLLYWOOD (16 OCT 2026)</div>');
 return function(t){
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);
  ent(q(d,'#bw'),t,st-.2,.7,{x:-80,y:0});ent(q(d,'#l1'),t,st-.1,.5,{y:14});
  ent(q(d,'#l3'),t,st+.5,.5,{y:14});var ui=E.o5(seg(t,st+.6,st+1.5));q(d,'#bi').style.transform='scaleX('+ui+')';q(d,'#bi').style.opacity=ui>0?1:0;
  var u=E.o5(seg(t,st+1.15,st+2.2));q(d,'#bh').style.transform='scaleX('+u+')';q(d,'#bh').style.opacity=u>0?1:0;
  q(d,'#bv').style.opacity=E.o3(seg(t,st+1.9,st+2.5));ent(q(d,'#l2'),t,st+.9,.5,{y:14});
  ent(q(d,'#ptr'),t,st+2.4,.5,{y:12});var pu=.5+.5*Math.sin(t*5);q(d,'#ptr').style.letterSpacing=(.06+.02*pu)+'em';
  pop(q(d,'#why'),t,10.28,.5,-6);ent(q(d,'#ch'),t,st+3.4,.6,{y:20});q(d,'.src').style.opacity=E.o3(seg(t,st+.6,st+1.2))}};
// ---- scene 4: dots fly from 100 shows to 100 rupees (FLIP) ----
defs[4]=function(){var st=S[4],GX=[150,562],GY=560,P=36,R=14;
 var d=mk('<div class="eye" data-b="eye"><i></i>WHO GOT THE MONEY</div><div class="h" data-b="h">Who got the<br><span class="k">money?</span></div>'+
 '<div class="lab" id="l1" data-b="l1" style="left:150px;top:500px">100 SHOWS</div><div class="lab" data-b="l2" style="left:562px;top:500px">₹100 EARNED</div>'+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:1000px" viewBox="0 0 1080 1000"></svg>'+
 '<div id="ar" data-b="arrow" style="position:absolute;left:512px;top:690px;font:400 44px Archivo;color:#f3e9d2">→</div>'+
 '<div id="c1" data-b="c1" style="position:absolute;left:150px;top:945px;font:400 100px/1 Archivo;color:#ff3d7f;font-variant-numeric:tabular-nums">26</div><div class="lab" data-b="s1" style="left:150px;top:1062px;color:#f3e9d2;font-size:20px">OF 100 SHOWS ARE HINDI</div>'+
 '<div id="c2" data-b="c2" style="position:absolute;left:562px;top:945px;font:400 100px/1 Archivo;color:#ff3d7f;font-variant-numeric:tabular-nums">6</div><div class="lab" data-b="s2" style="left:562px;top:1062px;color:#f3e9d2;font-size:20px">OF ₹100 GO TO HINDI</div>'+
 '<div class="chip" id="gp" data-b="gp" style="left:150px;top:1104px;border-color:#ff3d7f;color:#ff3d7f">26% OF SHOWS → 6% OF MONEY</div>'+
 '<div class="src" data-b="src" style="top:1172px">HINDI: 4,371 OF 16,599 SHOWS · ₹3.50 CR OF ₹59.70 CR NET · MY ARITHMETIC</div>');
 var svg=q(d,'#sv'),L=[],F=[];
 function pos(g,i){return [GX[g]+(i%10)*P+R,GY+Math.floor(i/10)*P+R]}
 for(var i=0;i<100;i++){var p=pos(0,i);L.push(sv('circle',{cx:p[0],cy:p[1],r:R,fill:i<26?C.hindi:C.paper},svg))}
 for(var i=0;i<100;i++){var p=pos(0,i);F.push(sv('circle',{cx:p[0],cy:p[1],r:R,fill:i<26?C.hindi:C.paper,opacity:0},svg))}
 var Tf=3.05;
 return function(t){var lt=t-st;
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);ent(q(d,'#l1'),t,st-.1,.5,{y:14});
  for(var i=0;i<100;i++){var a=seg(lt,.15+i/100*.9,.15+i/100*.9+.3),fl=seg(lt,Tf+i/100*1.0,Tf+i/100*1.0+.7),e=E.io(fl);
   var p0=pos(0,i),p1=pos(1,i);
   L[i].setAttribute('r',R*E.bk(a));L[i].setAttribute('opacity',fl>0?.22:(a>0?1:0));
   var cx=lerp(p0[0],p1[0],e),cy=lerp(p0[1],p1[1],e)-Math.sin(e*Math.PI)*(26+(i%7)*3);
   F[i].setAttribute('cx',cx);F[i].setAttribute('cy',cy);F[i].setAttribute('opacity',fl>0?1:0);F[i].setAttribute('r',R*(1+.25*Math.sin(e*Math.PI)));
   var col=(i<6)?C.hindi:(i<26?(e>.6?C.paper:C.hindi):C.paper);F[i].setAttribute('fill',col)}
  ent(q(d,'#c1'),t,st+1.5,.5,{y:20});ent(q(d,'#c2'),t,st+4.6,.5,{y:20});
  q(d,'.lab[data-b=s1]').style.opacity=E.o3(seg(lt,1.6,2.1));q(d,'.lab[data-b=s2]').style.opacity=E.o3(seg(lt,4.7,5.2));
  q(d,'#ar').style.opacity=E.o3(seg(lt,2.6,3.0))*(1);q(d,'#ar').style.transform='translateX('+(Math.sin(t*6)*6)+'px)';
  ent(q(d,'#gp'),t,st+5.2,.5,{y:14});q(d,'.src').style.opacity=E.o3(seg(lt,.8,1.4))}};
// ---- scene 6: per-show towers + 100-seat map ----
defs[6]=function(){var st=S[6],BASE=775,TW=150,TX=135,GAP=60,K=250/46.5;
 var data=[['TAMIL',46.5,C.tamil,1.2],['TELUGU',44.8,C.telugu,1.5],['KANNADA',31.8,C.kannada,1.8],['HINDI',8.0,C.hindi,3.9]];
 var d=mk('<div class="eye" data-b="eye"><i></i>AVERAGE TAKE PER SHOW</div><div class="h" data-b="h">Average take<br>per <span class="k">show</span></div>'+
 '<div class="chip" id="mine" data-b="mine" style="left:120px;top:400px;border-color:#c6f432;color:#c6f432">MY ARITHMETIC FROM TRACKER FIGURES</div>'+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:1100px" viewBox="0 0 1080 1100"><defs><pattern id="coin" width="150" height="22" patternUnits="userSpaceOnUse"><rect x="0" y="2" width="150" height="19" rx="5" fill="#fff"/></pattern></defs></svg>'+
 '<div class="lab" data-b="sl" style="left:167px;top:828px;color:#f3e9d2;font-size:22px">A TYPICAL HINDI SHOW · 100 SEATS</div>'+
 '<div class="chip" id="emp" data-b="emp" style="left:150px;top:1050px;border-color:#ff3d7f;color:#ff3d7f">20% SOLD · 80% EMPTY</div>'+
 '<div class="src" data-b="src" style="top:1130px">NET PER SHOW = NET ÷ SHOWS · SACNILK, 16 OCT 2026</div>');
 var svg=q(d,'#sv'),T=[],V=[];
 data.forEach(function(r,i){var x=TX+i*(TW+GAP),h=r[1]*K;
  var rect=sv('rect',{x:x,y:BASE,width:TW,height:0,fill:r[2]},svg);rect.setAttribute('mask','');
  var g=sv('g',{},svg);var rr=sv('rect',{x:x,y:BASE,width:TW,height:0,fill:r[2]},g);
  svg.removeChild(rect);
  var cv=sv('text',{x:x+TW/2,y:BASE-h-14,'text-anchor':'middle',fill:r[2],'font-family':'MM','font-weight':700,'font-size':28,opacity:0},svg);cv.textContent=i==3?'₹8K':('₹'+r[1].toFixed(1)+'K');
  var lb=sv('text',{x:x+TW/2,y:BASE+32,'text-anchor':'middle',fill:C.paper,'font-family':'MM','font-weight':700,'font-size':22,opacity:0},svg);lb.textContent=r[0];
  var lines=[];for(var k=0;k<Math.ceil(h/22);k++){lines.push(sv('rect',{x:x,y:BASE-(k+1)*22+2,width:TW,height:19,rx:5,fill:r[2],opacity:0},svg))}
  T.push({rr:rr,cv:cv,lb:lb,lines:lines,h:h,x:x});rr.setAttribute('opacity',0)});
 var seatsC=[],rng=function(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
 var order=[];for(var i=0;i<100;i++)order.push(i);order.sort(function(a,b){return rng(a)-rng(b)});var sold={};for(var i=0;i<20;i++)sold[order[i]]=1;
 for(var i=0;i<100;i++){var c=i%20,r=Math.floor(i/20),el=sv('rect',{x:167+c*38,y:868+r*32,width:24,height:24,rx:7,fill:'none',stroke:'#b39da3','stroke-width':3,opacity:0},svg);seatsC.push(el)}
 return function(t){var lt=t-st;
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);ent(q(d,'#mine'),t,st+.4,.5,{y:14});
  T.forEach(function(o,i){var r=data[i],u=E.bk(seg(lt,r[3],r[3]+.9));var n=o.lines.length;
   o.lines.forEach(function(l,k){var ku=seg(lt,r[3]+k*.045,r[3]+k*.045+.25);l.setAttribute('opacity',ku>0?1:0);l.setAttribute('transform','translate(0,'+((1-E.o3(ku))*-30)+')')});
   o.cv.setAttribute('opacity',E.o3(seg(lt,r[3]+.3+n*.045,r[3]+.7+n*.045)));o.lb.setAttribute('opacity',E.o3(seg(lt,r[3]-.4,r[3]+.1)));
   if(i==3){var pl=1+.06*Math.sin(t*6)*seg(lt,5.4,6);o.cv.setAttribute('transform','translate(0,'+(-(pl-1)*40)+')')}});
  var seatT=8.1,tarmac=seg(lt,seatT-.4,seatT+.6);q(d,'.lab[data-b=sl]').style.opacity=E.o3(tarmac);
  seatsC.forEach(function(el,i){var c=i%20,r=Math.floor(i/20),a=seg(lt,seatT+(c+r)*.02,seatT+(c+r)*.02+.3);
   var sd=!!sold[i],f=seg(lt,seatT+1.4+rng(i+9)*.6,seatT+1.4+rng(i+9)*.6+.3);
   el.setAttribute('opacity',a>0?(sd?1:lerp(1,.45,f)):0);el.setAttribute('fill',sd&&f>0?C.hindi:'none');el.setAttribute('stroke',sd&&f>0?C.hindi:'#b39da3');
   el.setAttribute('transform','translate(0,'+((1-E.o3(a))*14)+')')});
  ent(q(d,'#emp'),t,st+10.2,.6,{y:16});q(d,'.src').style.opacity=E.o3(seg(lt,.8,1.4))}};
// ---- scene 7: chains struck out (rough.js strokes + dust footage overlay) ----
defs[7]=function(){var st=S[7];
 var d=mk('<div class="eye" data-b="eye"><i></i>WHERE DID THE HINDI SHOWS GO</div><div class="h" data-b="h">Where did the<br><span class="k">Hindi</span> shows go?</div>'+
 '<div class="chip" id="c1" data-b="c1" style="left:120px;top:480px;width:380px;height:150px;font:400 46px/144px Archivo;text-align:center;padding:0;border-color:#f3e9d2">PVR INOX</div>'+
 '<div class="chip" id="c2" data-b="c2" style="left:530px;top:480px;width:380px;height:150px;font:400 46px/144px Archivo;text-align:center;padding:0;border-color:#f3e9d2">CINEPOLIS</div>'+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:900px" viewBox="0 0 1080 900"></svg>'+
 '<div class="chip" id="r1" data-b="r1" style="left:120px;top:680px;font-size:28px;border-style:dashed;border-color:#ff3d7f;color:#ff3d7f">REPORTED: OTT-WINDOW DISPUTE</div>'+
 '<div class="chip" id="r2" data-b="r2" style="left:120px;top:770px;font-size:28px;border-color:#c6f432;color:#c6f432">TEAM: HINDI RELEASE WENT AHEAD</div>'+
 '<div class="chip" id="r3" data-b="r3" style="left:120px;top:860px;font-size:28px;border-color:#8a7378;color:#f3e9d2">NOT EVERY CINEMA IS AFFECTED</div>'+
 '<div class="stamp" id="rp" data-b="stamp" style="left:420px;top:950px;font-size:64px;border-width:6px">REPORTED</div>'+
 '<div class="src" data-b="src" style="top:1180px">DECCAN HERALD, THE WEEK (12 OCT) · BH (14 OCT) · REPORTED, NOT CONFIRMED</div>');
 var svg=q(d,'#sv'),paths=[];
 if(window.rough){var rc=rough.svg(svg);
  [[132,494,488,616],[488,494,132,616],[542,494,898,616],[898,494,542,616]].forEach(function(l,i){var g=rc.line(l[0],l[1],l[2],l[3],{stroke:C.hindi,strokeWidth:7,roughness:1.8,seed:11+i});svg.appendChild(g);
   [].slice.call(g.querySelectorAll('path')).forEach(function(p){var L=p.getTotalLength?p.getTotalLength():400;p.setAttribute('stroke-dasharray',L);p.setAttribute('data-len',L);paths.push({p:p,i:i,L:L})})})}
 return function(t){var lt=t-st;
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);ent(q(d,'#c1'),t,st-.1,.5,{x:-50,y:0});ent(q(d,'#c2'),t,st+.1,.5,{x:50,y:0});
  paths.forEach(function(o){var s0=(o.i<2?.7:1.1)+(o.i%2)*.25,u=E.io(seg(lt,s0,s0+.3));o.p.setAttribute('stroke-dashoffset',o.L*(1-u))});
  ent(q(d,'#r1'),t,st+1.4,.45,{y:16});ent(q(d,'#r2'),t,st+2.0,.45,{y:16});ent(q(d,'#r3'),t,st+2.6,.45,{y:16});pop(q(d,'#rp'),t,st+2.9,.4,-5);q(d,'.src').style.opacity=E.o3(seg(lt,.8,1.4))}};
var upd=[];for(var i=0;i<10;i++){upd.push(defs[i]?defs[i]():null)}
var sceneEls=[],k=0;[].slice.call(document.querySelectorAll('#scenes > .sc')).forEach(function(e){});
var order=[];for(var i=0;i<10;i++)if(defs[i])order.push(i);
var els=[].slice.call(document.querySelectorAll('#scenes > .sc'));var byIdx={};order.forEach(function(si,j){byIdx[si]=els[j]});
var vid=document.createElement('video');vid.muted=true;vid.preload='auto';vid.src='host.webm';var avc=$('avc'),cx=avc.getContext('2d'),lastF=-1;
function hostSeek(t){var f=Math.floor(t*24);if(f===lastF)return Promise.resolve();lastF=f;var ft=(f+.5)/24;if(vid.duration)ft=Math.min(ft,vid.duration-.02);
 return new Promise(function(res){var dn=function(){vid.removeEventListener('seeked',dn);cx.drawImage(vid,0,0,380,380);res()};vid.addEventListener('seeked',dn);vid.currentTime=ft})}
var dust=$('dust'),lastD=-1;
function dustSeek(t){var vis=t>=S[7]-.2&&t<=S[8]+.2;dust.style.opacity=vis?.22:0;if(!vis||!dust.duration)return Promise.resolve();
 var f=Math.floor(t*30),ft=((f+.5)/30)%dust.duration;if(f===lastD)return Promise.resolve();lastD=f;return new Promise(function(res){var dn=function(){dust.removeEventListener('seeked',dn);res()};dust.addEventListener('seeked',dn);dust.currentTime=ft})}
window.__reelDurationSec=END;
window.__seek=function(t){
 t=Math.max(0,Math.min(END-1e-3,t));
 $('seats').style.backgroundPosition='0 '+(-(t*8)%56)+'px';$('bg').style.backgroundPosition=(Math.sin(t*.2)*30)+'px 0';
 order.forEach(function(si){var s0=S[si],s1=si+1<S.length?S[si+1]:END,el=byIdx[si],raw=t-s0,op=0,tf='';
  if(raw>=-TR&&t<=s1+.001){
   if(raw<0){var p=E.o3(seg(t,s0-.3,s0));op=p;tf='scale('+(1.05-.05*p)+')'}
   else if(si<9&&t>s1-TR){var p=E.o3(seg(t,s1-TR,s1-.15));op=1-p;tf='scale('+(1+.04*p)+')'}else op=1;
   upd[si](t)}
  el.style.opacity=op;el.style.transform=tf;el.style.display=op>0?'block':'none'});
 var c='';for(var k=0;k<TM.C.length;k++)if(t>=TM.C[k][0]&&t<TM.C[k][1]){c=TM.C[k][2];var u=E.o3(seg(t,TM.C[k][0],TM.C[k][0]+.18));$('cap').style.opacity=u;$('cap').style.transform='translateY('+(8*(1-u))+'px)'}
 $('cap').textContent=c;$('cap').style.display=c?'block':'none';$('caprule').style.display=c?'block':'none';
 $('av').style.opacity=E.o3(seg(t,0,.5));
 return Promise.all([hostSeek(t),dustSeek(t)])};
window.__ready=false;
var fp=['400 90px Archivo','700 24px MM','600 18px MM','700 30px Inter'].map(function(f){return document.fonts.load(f)});
Promise.all(fp.concat([new Promise(function(r){vid.addEventListener('loadeddata',r);setTimeout(r,8000)}),new Promise(function(r){dust.addEventListener('loadeddata',r);setTimeout(r,8000)})])).catch(function(){}).then(function(){window.__seek(0);window.__ready=true});
})();
