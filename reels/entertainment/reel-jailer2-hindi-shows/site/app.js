// Jailer 2 Hindi-shows reel. All visuals are pure functions of t (window.__seek). Host video + dust overlay are seeked per frame.
(function(){
var TM=window.TM,S=TM.S,END=TM.END,TR=.4,NS='http://www.w3.org/2000/svg';
var T={tk:S[0],bars:S[1],cast:S[2],shows:S[3],tenx:S[4],money:S[5],occ:S[6],per:S[7],chain:S[8],win:S[9],cta:S[10]};
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
defs[1]=function(){var X0=160,W=750,hw=Math.max(22,W*3.5/125),iw=W*59.7/125,st=T.bars;
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
  pop(q(d,'#why'),t,T.cast-.0,.5,-6);ent(q(d,'#ch'),t,st+3.4,.6,{y:20});q(d,'.src').style.opacity=E.o3(seg(t,st+.6,st+1.2))}};
// polaroid helper (real photos from Wikimedia Commons, licence + author credited on the card)
function pol(id,src,x,y,w,h,rot,cap,cr,ph){return '<div class="pol" id="'+id+'" data-b="'+id+'" style="left:'+x+'px;top:'+y+'px;width:'+w+'px"><img src="photos/'+src+'" style="height:'+h+'px" onerror="this.parentNode.classList.add(\'nop\')"><div class="ph" style="height:'+h+'px">'+(ph||'?')+'</div><div class="cap">'+cap+'</div><div class="cr">'+cr+'</div></div>'}
function polT(el,t,t0,rot,ph0){var u=E.o5(seg(t,t0,t0+.7)),f=Math.sin(t*1.3+(ph0||0));el.style.opacity=u;el.style.transform='translate('+((1-u)*40)+'px,'+((1-u)*60+f*5)+'px) rotate('+(rot*(2-u)+f*.8)+'deg) scale('+(.9+.1*u)+')'}
var CR=window.CREDITS||{};
defs[2]=function(){var st=T.cast;
 var d=mk('<div class="eye" data-b="eye"><i></i>THE FILM</div><div class="h" data-b="h">Who made<br><span class="k">Jailer 2?</span></div>'+
 pol('p1','rajini.jpg',125,470,240,260,-4,'LEAD · RAJINIKANTH',CR.rajini||'',"R")+pol('p2','nelson.png',389,500,240,260,2,'DIRECTOR · NELSON DILIPKUMAR',CR.nelson||'',"N")+pol('p3','anirudh.jpg',653,470,240,260,-2,'MUSIC · ANIRUDH',CR.anirudh||'',"A")+
 '<div class="chip" id="m1" data-b="m1" style="left:125px;top:900px">SUN PICTURES · TAMIL · 15 OCT 2026</div>'+
 '<div class="chip" id="m2" data-b="m2" style="left:125px;top:970px;border-color:#8a7378;color:#f3e9d2">SEQUEL TO THE 2023 HIT JAILER</div>'+
 '<div class="src" data-b="src" style="top:1180px">CAST/CREW AS ANNOUNCED BY SUN PICTURES (14 JAN 2025) · PHOTOS: WIKIMEDIA COMMONS</div>');
 return function(t){ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);polT(q(d,'#p1'),t,st-.2,-4,0);polT(q(d,'#p2'),t,st,2,1.2);polT(q(d,'#p3'),t,st+.2,-2,2.4);
  ent(q(d,'#m1'),t,st+1.2,.5,{y:16});ent(q(d,'#m2'),t,st+1.7,.5,{y:16});q(d,'.src').style.opacity=E.o3(seg(t,st+.6,st+1.2))}};
defs[3]=function(){var st=T.shows,GX=150,GY=520,P=36,R=14;
 var d=mk('<div class="eye" data-b="eye"><i></i>SHOWS ON DAY ONE</div><div class="h" data-b="h" style="width:480px">Shows on<br><span class="k">day one</span></div>'+
 pol('pt','theatre-single.jpg',640,160,270,170,3,'A SINGLE-SCREEN THEATRE, PUNE',CR.theatre||'',"S")+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:1000px" viewBox="0 0 1080 1000"></svg>'+
 '<div id="n1" data-b="n1" style="position:absolute;left:560px;top:520px;font:400 84px/1 Archivo;font-variant-numeric:tabular-nums">0</div><div class="lab" id="n1l" data-b="n1l" style="left:562px;top:612px;color:#f3e9d2">SHOWS IN INDIA, DAY 1</div>'+
 '<div id="n2" data-b="n2" style="position:absolute;left:560px;top:670px;font:400 84px/1 Archivo;color:#ff3d7f;font-variant-numeric:tabular-nums">0</div><div class="lab" id="n2l" data-b="n2l" style="left:562px;top:762px;color:#ff3d7f">OF THEM IN HINDI</div>'+
 '<div class="stamp" id="q4" data-b="q4" style="left:560px;top:830px;font-size:70px;border-width:6px;background:#1a0c10">1 in 4</div>'+
 '<div class="chip" id="lg" data-b="lg" style="left:150px;top:940px;border-color:#8a7378;color:#f3e9d2;font-size:22px">TAMIL 9,326 · TELUGU 2,792 · KANNADA 110</div>'+
 '<div class="src" data-b="src" style="top:1180px">SHOWS: SACNILK VIA THE WEEK & IWMBUZZ, 16 OCT 2026 (ONE TRACKER) · 100 DOTS = 100 SHOWS</div>');
 var svg=q(d,'#sv'),D=[];
 for(var i=0;i<100;i++){D.push(sv('circle',{cx:GX+(i%10)*P+R,cy:GY+Math.floor(i/10)*P+R,r:R,fill:i<26?C.hindi:C.paper,opacity:0},svg))}
 return function(t){var lt=t-st;
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);polT(q(d,'#pt'),t,st-.1,3,.5);
  for(var i=0;i<100;i++){var a=seg(lt,.1+i/100*1.1,.1+i/100*1.1+.3),pu=(i<26)?(1+.18*Math.sin(t*5+i*.4)*seg(lt,4.2,5)):1;D[i].setAttribute('opacity',a>0?1:0);D[i].setAttribute('r',R*E.bk(a)*pu)}
  q(d,'#n1').textContent=fmt(Math.round(16599*E.o3(seg(lt,2.4,4.0))));q(d,'#n1').style.opacity=seg(lt,2.2,2.6);q(d,'#n1l').style.opacity=E.o3(seg(lt,2.8,3.4));
  q(d,'#n2').textContent=fmt(Math.round(4371*E.o3(seg(lt,4.2,5.4))));q(d,'#n2').style.opacity=seg(lt,4.1,4.5);q(d,'#n2l').style.opacity=E.o3(seg(lt,4.8,5.4));
  pop(q(d,'#q4'),t,st+6.9,.5,-5);ent(q(d,'#lg'),t,st+1.4,.5,{y:14});q(d,'.src').style.opacity=E.o3(seg(lt,.8,1.4))}};
defs[4]=function(){var st=T.tenx,X0=150,W=700;
 var d=mk('<div class="eye" data-b="eye"><i></i>HINDI OPENING VS THE FIRST JAILER</div><div class="h" data-b="h">Hindi opening:<br><span class="k">10×</span> bigger</div>'+
 '<div class="lab" id="a1" data-b="a1" style="left:'+X0+'px;top:470px;color:#f3e9d2">JAILER (2023) · HINDI DAY 1</div>'+
 '<div id="b1" data-b="b1" style="position:absolute;left:'+X0+'px;top:508px;width:'+(W*.1)+'px;height:76px;background:#8f7f6a;transform-origin:0 50%"></div><div id="v1" data-b="v1" style="position:absolute;left:'+(X0+W*.1+16)+'px;top:514px;font:400 44px Archivo;color:#f3e9d2;white-space:nowrap">₹35 LAKH</div>'+
 '<div class="lab" id="a2" data-b="a2" style="left:'+X0+'px;top:640px;color:#ff3d7f">JAILER 2 (2026) · HINDI DAY 1</div>'+
 '<div id="b2" data-b="b2" style="position:absolute;left:'+X0+'px;top:678px;width:'+W+'px;height:76px;background:#ff3d7f;transform-origin:0 50%"><div style="position:absolute;right:20px;top:11px;font:400 44px Archivo;color:#1a0c10">₹3.50 CR</div></div>'+
 '<div class="stamp" id="x10" data-b="x10" style="left:150px;top:810px;font-size:150px;background:#1a0c10">10×</div>'+
 '<div class="chip" id="c1" data-b="c1" style="left:150px;top:1010px;border-color:#8a7378;color:#f3e9d2;font-size:22px">2023 FIGURE: ONE TRACKER (SACNILK VIA THE WEEK)</div>'+
 '<div class="chip" id="c2" data-b="c2" style="left:150px;top:1070px;border-color:#8a7378;color:#f3e9d2;font-size:22px">2023 HINDI 5-DAY TOTAL ≈ ₹1.25 CR (CONSISTENT)</div>'+
 '<div class="src" data-b="src" style="top:1180px">SACNILK VIA THE WEEK (16 OCT 2026) · 2023 FIGURES FROM TRACKER REPORTS</div>');
 return function(t){var lt=t-st;
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);ent(q(d,'#a1'),t,st-.1,.5,{y:14});
  var u1=E.o5(seg(t,st+.1,st+.8));q(d,'#b1').style.transform='scaleX('+u1+')';q(d,'#v1').style.opacity=E.o3(seg(t,st+.7,st+1.2));
  ent(q(d,'#a2'),t,st+.7,.5,{y:14});var u2=E.o5(seg(t,st+1.2,st+2.8));q(d,'#b2').style.transform='scaleX('+u2+')';q(d,'#b2').style.opacity=u2>0?1:0;
  pop(q(d,'#x10'),t,st+3.84,.5,-5);ent(q(d,'#c1'),t,st+2.4,.5,{y:14});ent(q(d,'#c2'),t,st+2.9,.5,{y:14});q(d,'.src').style.opacity=E.o3(seg(lt,.6,1.2))}};
// ---- scene 4: dots fly from 100 shows to 100 rupees (FLIP) ----
defs[5]=function(){var st=T.money,GX=[150,562],GY=560,P=36,R=14;
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
defs[6]=function(){var st=T.occ;
 var d=mk('<div class="eye" data-b="eye"><i></i>OCCUPANCY</div><div class="h" data-b="h">Hindi shows:<br><span class="k">20% full</span></div>'+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:1200px" viewBox="0 0 1080 1200"></svg>'+
 '<div class="lab" id="l1" data-b="l1" style="left:150px;top:850px;color:#ff3d7f">HINDI · 4,371 SHOWS</div><div class="lab" id="l2" data-b="l2" style="left:560px;top:850px;color:#2ee6d6">TAMIL · 9,326 SHOWS</div>'+
 '<div class="lab" id="l3" data-b="l3" style="left:150px;top:1075px;color:#a58bff;font-size:20px">TELUGU 56.2%</div><div class="lab" id="l4" data-b="l4" style="left:560px;top:1075px;color:#c6f432;font-size:20px">KANNADA 54%</div>'+
 '<div class="chip" id="gp" data-b="gp" style="left:150px;top:1120px;border-color:#ff3d7f;color:#ff3d7f">BIG GAP: 20% vs 70.8%</div>'+
 '<div class="src" data-b="src" style="top:1185px">OCCUPANCY: SACNILK VIA IWMBUZZ, 16 OCT 2026 (ONE TRACKER) · ALL INDIA 55.4%</div>');
 var svg=q(d,'#sv'),rings=[[260,640,120,20,C.hindi,34.3],[690,640,120,70.8,C.tamil,37.1],[255,985,62,56.2,C.telugu,38.7],[690,985,62,54,C.kannada,39.1]],R=[];
 rings.forEach(function(r,i){var c=2*Math.PI*r[2];sv('circle',{cx:r[0],cy:r[1],r:r[2],fill:'none',stroke:'#3a2229','stroke-width':i<2?30:18},svg);
  var arc=sv('circle',{cx:r[0],cy:r[1],r:r[2],fill:'none',stroke:r[4],'stroke-width':i<2?30:18,'stroke-linecap':'round','stroke-dasharray':c,'stroke-dashoffset':c,transform:'rotate(-90 '+r[0]+' '+r[1]+')'},svg);
  var tx=sv('text',{x:r[0],y:r[1]+(i<2?26:14),'text-anchor':'middle',fill:r[4],'font-family':'Archivo','font-size':i<2?72:36,opacity:0},svg);tx.textContent='0%';R.push({arc:arc,tx:tx,c:c,p:r[3],t0:r[5]})});
 return function(t){ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);
  R.forEach(function(o,i){var u=E.o5(seg(t,o.t0,o.t0+1.1));o.arc.setAttribute('stroke-dashoffset',o.c*(1-u*o.p/100));o.tx.setAttribute('opacity',u>0?1:0);o.tx.textContent=(Math.round(u*o.p*10)/10).toFixed(o.p%1?1:0)+'%'});
  ent(q(d,'#l1'),t,st+.5,.5,{y:14});ent(q(d,'#l2'),t,st+3.1,.5,{y:14});ent(q(d,'#l3'),t,st+4.7,.5,{y:14});ent(q(d,'#l4'),t,st+5.1,.5,{y:14});ent(q(d,'#gp'),t,st+6.5,.5,{y:16});q(d,'.src').style.opacity=E.o3(seg(t,st+.6,st+1.2))}};
// ---- scene 6: per-show towers + 100-seat map ----
defs[7]=function(){var st=T.per,BASE=775,TW=150,TX=135,GAP=60,K=250/46.5;
 var data=[['TAMIL',46.5,C.tamil,1.2],['TELUGU',44.8,C.telugu,1.5],['KANNADA',31.8,C.kannada,1.8],['HINDI',8.0,C.hindi,3.9]];
 var d=mk('<div class="eye" data-b="eye"><i></i>AVERAGE TAKE PER SHOW</div><div class="h" data-b="h">Average take<br>per <span class="k">show</span></div>'+
 '<div class="chip" id="mine" data-b="mine" style="left:120px;top:400px;border-color:#c6f432;color:#c6f432">MY ARITHMETIC FROM TRACKER FIGURES</div>'+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:1100px" viewBox="0 0 1080 1100"><defs><pattern id="coin" width="150" height="22" patternUnits="userSpaceOnUse"><rect x="0" y="2" width="150" height="19" rx="5" fill="#fff"/></pattern></defs></svg>'+
 '<div class="lab" data-b="sl" style="left:167px;top:828px;color:#f3e9d2;font-size:22px">A TYPICAL HINDI SHOW · 100 SEATS</div>'+
 '<div class="chip" id="emp" data-b="emp" style="left:150px;top:1050px;border-color:#ff3d7f;color:#ff3d7f">20% SOLD · 80% EMPTY</div>'+
 '<div class="src" data-b="src" style="top:1130px">NET PER SHOW = NET ÷ SHOWS · SACNILK, 16 OCT 2026</div>');
 var svg=q(d,'#sv'),TWR=[],V=[];
 data.forEach(function(r,i){var x=TX+i*(TW+GAP),h=r[1]*K;
  var rect=sv('rect',{x:x,y:BASE,width:TW,height:0,fill:r[2]},svg);rect.setAttribute('mask','');
  var g=sv('g',{},svg);var rr=sv('rect',{x:x,y:BASE,width:TW,height:0,fill:r[2]},g);
  svg.removeChild(rect);
  var cv=sv('text',{x:x+TW/2,y:BASE-h-14,'text-anchor':'middle',fill:r[2],'font-family':'MM','font-weight':700,'font-size':28,opacity:0},svg);cv.textContent=i==3?'₹8K':('₹'+r[1].toFixed(1)+'K');
  var lb=sv('text',{x:x+TW/2,y:BASE+32,'text-anchor':'middle',fill:C.paper,'font-family':'MM','font-weight':700,'font-size':22,opacity:0},svg);lb.textContent=r[0];
  var lines=[];for(var k=0;k<Math.ceil(h/22);k++){lines.push(sv('rect',{x:x,y:BASE-(k+1)*22+2,width:TW,height:19,rx:5,fill:r[2],opacity:0},svg))}
  TWR.push({rr:rr,cv:cv,lb:lb,lines:lines,h:h,x:x});rr.setAttribute('opacity',0)});
 var seatsC=[],rng=function(i){var s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)};
 var order=[];for(var i=0;i<100;i++)order.push(i);order.sort(function(a,b){return rng(a)-rng(b)});var sold={};for(var i=0;i<20;i++)sold[order[i]]=1;
 for(var i=0;i<100;i++){var c=i%20,r=Math.floor(i/20),el=sv('rect',{x:167+c*38,y:868+r*32,width:24,height:24,rx:7,fill:'none',stroke:'#b39da3','stroke-width':3,opacity:0},svg);seatsC.push(el)}
 return function(t){var lt=t-st;
  ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);ent(q(d,'#mine'),t,st+.4,.5,{y:14});
  TWR.forEach(function(o,i){var r=data[i],u=E.bk(seg(lt,r[3],r[3]+.9));var n=o.lines.length;
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
defs[8]=function(){var st=T.chain;
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
defs[9]=function(){var st=T.win,X0=150,WK=88;
 var d=mk('<div class="eye" data-b="eye"><i></i>THE WINDOW</div><div class="h" data-b="h"><span class="k">8 weeks</span><br>vs 4 weeks</div>'+
 '<div class="lab" id="a1" data-b="a1" style="left:'+X0+'px;top:470px;color:#2ee6d6">CHAINS WANT: 8 WEEKS IN THEATRES (REPORTED)</div>'+
 '<svg id="sv" style="position:absolute;left:0;top:0;width:1080px;height:1100px" viewBox="0 0 1080 1100"></svg>'+
 '<div class="lab" id="a2" data-b="a2" style="left:'+X0+'px;top:690px;color:#ff3d7f">FILM: OTT AFTER 4 WEEKS (REPORTED)</div>'+
 '<div class="chip" id="c1" data-b="c1" style="left:150px;top:920px;border-color:#c6f432;color:#c6f432">OTT PREMIERE EXPECTED NOVEMBER (REPORTED)</div>'+
 '<div class="chip" id="c2" data-b="c2" style="left:150px;top:990px;border-color:#8a7378;color:#f3e9d2;font-size:22px">THE FILM\'S TEAM SAID THE HINDI RELEASE WENT AHEAD</div>'+
 '<div class="src" data-b="src" style="top:1180px">DECCAN HERALD, THE WEEK (12 OCT), HIGH ON FILMS · REPORTED, NOT CONFIRMED</div>');
 var svg=q(d,'#sv'),A=[],B=[];
 for(var i=0;i<8;i++){var r=sv('rect',{x:X0+i*WK,y:510,width:WK-8,height:80,rx:8,fill:C.tamil,opacity:0},svg);var tx=sv('text',{x:X0+i*WK+(WK-8)/2,y:560,'text-anchor':'middle','font-family':'MM','font-weight':700,'font-size':22,fill:C.ink,opacity:0},svg);tx.textContent='W'+(i+1);r.tx=tx;A.push(r)}
 for(var i=0;i<4;i++){var r2=sv('rect',{x:X0+i*WK,y:730,width:WK-8,height:80,rx:8,fill:C.hindi,opacity:0},svg);var tx2=sv('text',{x:X0+i*WK+(WK-8)/2,y:780,'text-anchor':'middle','font-family':'MM','font-weight':700,'font-size':22,fill:C.ink,opacity:0},svg);tx2.textContent='W'+(i+1);r2.tx=tx2;B.push(r2)}
 var gap=sv('rect',{x:X0+4*WK,y:730,width:4*WK-8,height:80,rx:8,fill:'none',stroke:'#8a7378','stroke-width':3,'stroke-dasharray':'10 8',opacity:0},svg),gt=sv('text',{x:X0+6*WK-4,y:780,'text-anchor':'middle','font-family':'MM','font-weight':700,'font-size':22,fill:'#8a7378',opacity:0},svg);gt.textContent='OTT';
 return function(t){var lt=t-st;ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);ent(q(d,'#a1'),t,st-.1,.5,{y:14});
  A.forEach(function(r,i){var u=seg(t,st+.1+i*.15,st+.1+i*.15+.4);r.setAttribute('opacity',u>0?1:0);r.setAttribute('transform','translate(0,'+((1-E.o3(u))*-24)+')');r.tx.setAttribute('opacity',u>0?1:0)});
  ent(q(d,'#a2'),t,st+1.4,.5,{y:14});
  B.forEach(function(r,i){var u=seg(t,st+1.5+i*.2,st+1.5+i*.2+.4);r.setAttribute('opacity',u>0?1:0);r.setAttribute('transform','translate(0,'+((1-E.o3(u))*-24)+')');r.tx.setAttribute('opacity',u>0?1:0)});
  var g=E.o3(seg(t,st+2.6,st+3.2));gap.setAttribute('opacity',g);gt.setAttribute('opacity',g);
  ent(q(d,'#c1'),t,st+3.3,.5,{y:16});ent(q(d,'#c2'),t,st+3.9,.5,{y:16});q(d,'.src').style.opacity=E.o3(seg(lt,.6,1.2))}};
defs[10]=function(){var st=T.cta,CITIES=['PUNE · SINGLE SCREEN','CHENNAI · PVR','LUCKNOW · NOT FOUND','DELHI · SINGLE SCREEN','MUMBAI · CINEPOLIS?'];
 var d=mk('<img class="plate" id="pl" src="photos/plate-cta.jpg" onerror="this.style.display=\'none\'"><div class="eye" data-b="eye"><i></i>YOUR TURN</div><div class="h" data-b="h">Where is it<br>playing <span class="k">near you?</span></div>'+
 '<div id="pp" data-b="pp" style="position:absolute;left:150px;top:520px;width:230px;height:230px;border-radius:50%;border:10px solid #ff3d7f;overflow:hidden;box-shadow:0 0 50px rgba(255,61,127,.45)"><img src="profile.jpg" style="width:100%;height:100%;object-fit:cover"></div>'+
 '<div id="hd" data-b="hd" style="position:absolute;left:410px;top:540px;font:400 56px/1 Archivo;color:#f3e9d2;white-space:nowrap">@sandesh_explains</div><div id="sb" data-b="sb" style="position:absolute;left:410px;top:620px;font:700 24px MM;color:#ff3d7f">BOX OFFICE, EXPLAINED</div>'+
 '<div id="cb" data-b="cb" style="position:absolute;left:150px;top:800px;width:760px;height:110px;border:3px solid #f3e9d2;border-radius:14px;background:rgba(26,12,16,.9)"><div style="position:absolute;left:22px;top:12px;font:700 18px MM;color:#8a7378">COMMENT YOUR CITY</div><div id="ty" style="position:absolute;left:22px;top:48px;font:700 34px MM;color:#f3e9d2;white-space:nowrap"></div></div>'+
 '<div id="fl" data-b="fl" style="position:absolute;left:150px;top:960px;font:400 80px/1 Archivo;background:#ff3d7f;color:#1a0c10;padding:12px 38px;transform-origin:0 50%">FOLLOW</div>'+
 '<div class="src" data-b="src" style="top:1180px">NUMBERS: SACNILK VIA THE WEEK / IWMBUZZ, 16 OCT 2026 · TRADE ESTIMATES · PHOTOS: WIKIMEDIA COMMONS</div>');
 return function(t){var lt=t-st;ent(q(d,'.eye'),t,st-.3,.5,{y:14});ent(q(d,'.h'),t,st-.25,.65);q(d,'#pl').style.opacity=.28*E.o3(seg(lt,0,1));
  pop(q(d,'#pp'),t,st+.3,.6,0);ent(q(d,'#hd'),t,st+.7,.6,{x:40,y:0});ent(q(d,'#sb'),t,st+1,.5,{y:14});ent(q(d,'#cb'),t,st+1.2,.6,{y:20});
  var k=Math.floor((lt-1.6)/1.5),ph=((lt-1.6)%1.5)/1.5;if(k>=0){var s=CITIES[k%CITIES.length],n=Math.min(s.length,Math.round(ph*1.6*s.length));q(d,'#ty').textContent=s.slice(0,n)+(Math.floor(t*3)%2?'▌':'')}else q(d,'#ty').textContent=(Math.floor(t*3)%2?'▌':'');
  var u=seg(lt,2.2,2.8),p=1+.06*Math.sin(lt*6)*seg(lt,2.9,9);q(d,'#fl').style.opacity=u;q(d,'#fl').style.transform='scale('+(E.bk(u)*p)+')';q(d,'.src').style.opacity=E.o3(seg(lt,.6,1.2))}};
var upd=[];for(var i=0;i<11;i++){upd.push(defs[i]?defs[i]():null)}
var sceneEls=[],k=0;[].slice.call(document.querySelectorAll('#scenes > .sc')).forEach(function(e){});
var order=[];for(var i=0;i<11;i++)if(defs[i])order.push(i);
var els=[].slice.call(document.querySelectorAll('#scenes > .sc'));var byIdx={};order.forEach(function(si,j){byIdx[si]=els[j]});
var vid=document.createElement('video');vid.muted=true;vid.preload='auto';vid.src='host.webm';var avc=$('avc'),cx=avc.getContext('2d'),lastF=-1;
function hostSeek(t){var f=Math.floor(t*24);if(f===lastF)return Promise.resolve();lastF=f;var ft=(f+.5)/24;if(vid.duration)ft=Math.min(ft,vid.duration-.02);
 return new Promise(function(res){var dn=function(){vid.removeEventListener('seeked',dn);cx.clearRect(0,0,544,544);cx.drawImage(vid,0,0,544,544);res()};vid.addEventListener('seeked',dn);vid.currentTime=ft})}
var dust=$('dust'),lastD=-1;
function dustSeek(t){var vis=t>=T.chain-.2&&t<=T.win+.2;dust.style.opacity=vis?.22:0;if(!vis||!dust.duration)return Promise.resolve();
 var f=Math.floor(t*30),ft=((f+.5)/30)%dust.duration;if(f===lastD)return Promise.resolve();lastD=f;return new Promise(function(res){var dn=function(){dust.removeEventListener('seeked',dn);res()};dust.addEventListener('seeked',dn);dust.currentTime=ft})}
window.__reelDurationSec=END;
window.__seek=function(t){
 t=Math.max(0,Math.min(END-1e-3,t));
 $('seats').style.backgroundPosition=(Math.sin(t*.5)*40)+'px '+(-(t*38)%56)+'px';var bx=50+22*Math.sin(t*.9),by=26+9*Math.cos(t*.7);$('bg').style.background='radial-gradient(ellipse 72% 46% at '+bx+'% '+by+'%,#4a1a26 0,#1a0c10 72%)';var sw=(t/4.2)%1;$('sweep').style.left=(-420+1900*sw)+'px';$('sweep').style.opacity=(.35+.65*Math.sin(sw*Math.PI)).toFixed(3);
 order.forEach(function(si){var s0=S[si],s1=si+1<S.length?S[si+1]:END,el=byIdx[si],raw=t-s0,op=0,tf='';
  if(raw>=-TR&&t<=s1+.001){
   if(raw<0){var p=E.o3(seg(t,s0-.3,s0));op=p;tf='scale('+(1.05-.05*p)+')'}
   else if(si<10&&t>s1-TR){var p=E.o3(seg(t,s1-TR,s1-.15));op=1-p;tf='scale('+(1+.04*p)+')'}else op=1;
   upd[si](t)}
  el.style.opacity=op;el.style.transform=tf;el.style.display=op>0?'block':'none'});
 var c='';for(var k=0;k<TM.C.length;k++)if(t>=TM.C[k][0]&&t<TM.C[k][1]){c=TM.C[k][2];var u=E.o3(seg(t,TM.C[k][0],TM.C[k][0]+.18));$('cap').style.opacity=u;$('cap').style.transform='translateY('+(8*(1-u))+'px)'}
 $('cap').textContent=c;$('cap').style.display=c?'block':'none';$('caprule').style.display=c?'block':'none';
 $('av').style.opacity=E.o3(seg(t,0,.5));
 return Promise.all([hostSeek(t),dustSeek(t)])};
window.__ready=false;
var fp=['400 90px Archivo','700 24px MM','600 18px MM','700 30px Inter','600 12px MM'].map(function(f){return document.fonts.load(f)});
Promise.all(fp.concat([new Promise(function(r){vid.addEventListener('loadeddata',r);setTimeout(r,8000)}),new Promise(function(r){dust.addEventListener('loadeddata',r);setTimeout(r,8000)})])).catch(function(){}).then(function(){window.__seek(0);window.__ready=true});
})();
