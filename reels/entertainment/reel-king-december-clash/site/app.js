// December box-office war ("Premiere Night"). Every visual is a pure function of t (window.__seek).
// Through-line: the December film strip at the top, which scrolls to the date each scene is about. Scene times and cues come from timing.js.
(function(){
var TM=window.TM,S=TM.S,C=TM.CUE,END=TM.END,TR=.3,NS='http://www.w3.org/2000/svg',IC=window.IC,CL=window.CLAP;
var $=function(id){return document.getElementById(id)};
function cl(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))}
var E={o3:function(x){return 1-Math.pow(1-x,3)},o5:function(x){return 1-Math.pow(1-x,5)},i3:function(x){return x*x*x},io:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
 bk:function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
function seg(t,a,b){return cl((t-a)/(b-a))}
function lerp(a,b,u){return a+(b-a)*u}
function ent(el,t,t0,d,o){o=o||{};var u=E.o5(seg(t,t0,t0+d));el.style.opacity=u;el.style.transform='translate('+((o.x||0)*(1-u))+'px,'+((o.y==null?24:o.y)*(1-u))+'px) scale('+(1-(1-(o.s||1))*(1-u))+') rotate('+((o.r||0)*(1-u)+(o.rr||0))+'deg)'}
function pop(el,t,t0,d,r){var u=seg(t,t0,t0+d);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u>0?E.bk(u):.3)+')'}
function slam(el,t,t0,r){var u=seg(t,t0,t0+.2);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u<1?lerp(2.3,1,E.o3(u)):1+.04*Math.max(0,1-(t-t0-.2)/.2))+')'}
function flip(el,t,t0,r){var u=E.o3(seg(t,t0,t0+.45));el.style.opacity=t<t0?0:1;el.style.transform='perspective(1200px) rotate('+(r||0)+'deg) rotateY('+lerp(80,0,u)+'deg) scale('+lerp(.9,1,u)+')'}
function mk(html){var d=document.createElement('div');d.className='sc';d.innerHTML=html;$('scenes').appendChild(d);return d}
function q(sc,s){return sc.querySelector(s)}
function sv(tag,at,p){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(p)p.appendChild(e);return e}
function ic(n,sz,col,sty){return '<span class="ic" style="width:'+sz+'px;height:'+sz+'px;color:'+col+';'+(sty||'')+'">'+(IC[n]||'')+'</span>'}
var head=function(eye,h,dot){return '<div class="eye" data-b="eye"><i style="background:'+(dot||'var(--gold)')+'"></i>'+eye+'</div><div class="h" data-b="h">'+h+'</div>'};
var EV=[];function ev(t,k){EV.push([+t.toFixed(3),k])}
var FILM={king:['img/king.jpg','var(--king)','#ff2e4d'],aveng:['img/avengers.jpg','var(--aveng)','#8bff4a'],dune:['img/dune.jpg','var(--dune)','#ffae3d'],fauzi:['img/fauzi.jpg','var(--fauzi)','#3fa9ff']};

// ---- marquee poster frame: poster inside a frame of chasing bulbs ------------------------------------------------------
// The poster itself carries data-b (lint box); bulbs are created once and lit per frame.
function marquee(id,f,x,y,w,h,label,r){var P=14,c=FILM[f];return '<div class="mq" id="'+id+'" data-b="'+id+'" style="left:'+(x-P)+'px;top:'+(y-P)+'px;width:'+(w+2*P)+'px;height:'+(h+2*P)+'px;transform:rotate('+(r||0)+'deg)" data-w="'+w+'" data-h="'+h+'" data-c="'+c[2]+'">'+
 '<div class="post" style="left:'+(P-4)+'px;top:'+(P-4)+'px;width:'+w+'px;height:'+h+'px;background-image:url('+c[0]+')"><div class="lab" style="background:'+c[1]+'">'+label+'</div></div></div>'}
var BULBS=[];
function bulbs(el){var w=+el.dataset.w+8,h=+el.dataset.h+8,arr=[],per=2*(w+h),n=Math.round(per/34);
 for(var i=0;i<n;i++){var d=i/n*per,x,y;if(d<w){x=d;y=0}else if(d<w+h){x=w;y=d-w}else if(d<2*w+h){x=w-(d-w-h);y=h}else{x=0;y=h-(d-2*w-h)}
  var b=document.createElement('div');b.className='bulb';b.style.left=(x+6)+'px';b.style.top=(y+6)+'px';el.appendChild(b);arr.push(b)}
 var o={el:el,b:arr,c:el.dataset.c};BULBS.push(o);return o}
function chase(o,t,on){var k=Math.floor(t*12);o.b.forEach(function(b,i){var lit=on>0&&((i+k)%3===0);b.style.background=lit?'#fff2c4':(on>0?'#8a6a3c':'#4a3a2a');b.style.boxShadow=lit?'0 0 10px 3px rgba(255,211,77,'+(.85*on)+')':'none'})}

// ---- rough.js strokes (fixed seeds), drawn on by stroke-dashoffset ------------------------------------------------------
var RS=$('rough'),rc=rough.svg(RS),RG=[];
function rk(node){RS.appendChild(node);var ps=[].slice.call(node.querySelectorAll('path')),L=ps.map(function(p){var l=p.getTotalLength();p.style.strokeDasharray=l;return l});var o={n:node,p:ps,L:L};RG.push(o);return o}
function draw(o,u,op){o.n.style.opacity=op==null?(u>0?1:0):op;o.p.forEach(function(p,i){p.style.strokeDashoffset=o.L[i]*(1-cl(u))})}
function hide(o){o.n.style.opacity=0}

// ---- through-line: December film strip ----------------------------------------------------------------------------------
var FW=92,rs=$('ribs'),DOW=['SUN','MON','TUE','WED','THU','FRI','SAT'],MARK={3:['#3fa9ff','#8d8296'],16:['#ffae3d'],18:['#8bff4a','#ffae3d'],24:['#ff2e4d']},FR=[];
rs.style.width=(31*FW)+'px';
for(var d=1;d<=31;d++){var f=document.createElement('div');f.className='fr';f.style.left=((d-1)*FW+4)+'px';var dw=new Date(Date.UTC(2026,11,d)).getUTCDay();
 f.innerHTML='<b>'+d+'</b><i>'+DOW[dw]+'</i>'+(MARK[d]?MARK[d].map(function(c,i,a){return '<div class="bar" style="background:'+c+';left:'+(i*100/a.length)+'%;right:'+((a.length-1-i)*100/a.length)+'%"></div>'}).join(''):'');rs.appendChild(f);FR.push(f)}
for(var x=6;x<31*FW;x+=23){var a=document.createElement('div');a.className='sp';a.style.left=x+'px';a.style.top='3px';rs.appendChild(a);var b=a.cloneNode();b.style.top='92px';rs.appendChild(b)}
var FK=[[0,18],[1.05,23],[C.xmas,24],[S[1]+.15,3],[S[1]+.7,16],[S[1]+1.2,18],[S[1]+1.7,24],[S[2],3],[S[3],16],[C.aveng2,18],[S[4],24]];
function focus(t){var v=FK[0][1];for(var k=1;k<FK.length;k++){var d=k===1?1.9:.5;v=lerp(v,FK[k][1],E.io(seg(t,FK[k][0],FK[k][0]+d)))}return v}
function drawRib(t){var v=focus(t);rs.style.transform='translateX('+(409-(v-.5)*FW)+'px)';var n=Math.round(v);
 FR.forEach(function(f,i){var on=i+1===n,c=MARK[i+1]?MARK[i+1][0]:'#ffd34d';f.style.background=on?'#2e2036':'#1c1322';f.style.boxShadow=on?'inset 0 0 0 3px '+c+', 0 0 18px '+c:'none';f.style.transform='scale('+(on?1.06:1)+')'})}
FK.slice(1).forEach(function(k){ev(k[0],'tick')});

// ---- searchlights + dust ---------------------------------------------------------------------------------------------------
function lights(t){[['b1',300,-1],['b2',780,1]].forEach(function(b,i){var e=$(b[0]);e.style.transform='translate('+(b[1]-170)+'px,-380px) rotate('+(b[2]*(14+18*Math.sin(t*.55+i*2.1)))+'deg)'});
 $('folds').style.transform='translateX('+(Math.sin(t*.3)*18)+'px)'}

// ---- scenes -------------------------------------------------------------------------------------------------------------------
var upd=[];
// 0 hook: 6 days between Doomsday and King --------------------------------------------------------------------------------------
(function(){var s0=S[0],cells='';for(var i=0;i<7;i++){var d=18+i,dw=DOW[new Date(Date.UTC(2026,11,d)).getUTCDay()];
  cells+='<div class="card dc" style="left:'+(130+i*114)+'px;top:952px;width:104px;height:92px;text-align:center"><div style="font:400 50px/56px BB;margin-top:6px">'+d+'</div><div style="font:600 14px PM;letter-spacing:.12em;color:var(--dim)">'+dw+'</div></div>'}
 var el=mk(head('// 18 DEC → 24 DEC · TWO GIANTS','JUST <span>6 DAYS</span>')+
  marquee('pa','aveng',144,452,272,408,'DOOMSDAY · 18 DEC',-2)+
  '<div class="mq" id="pk0" data-b="pk0" style="left:618px;top:438px;width:300px;height:436px;transform:rotate(2deg)" data-w="272" data-h="408" data-c="#ff2e4d"><div class="post" style="left:10px;top:10px;width:272px;height:408px;background:#1a0f1d;text-align:center">'+
   '<div style="font:400 160px/1 BB;color:#3a2b42;margin-top:90px">?</div><div style="font:600 20px PM;letter-spacing:.2em;color:var(--dim)">24 DEC</div></div></div>'+
  marquee('pk','king',632,452,272,408,'KING · 24 DEC',2)+
  '<div id="six" data-b="six" style="position:absolute;left:442px;top:540px;width:156px;text-align:center"><div style="font:400 250px/.9 BB;color:var(--gold);text-shadow:0 0 40px rgba(255,211,77,.45)">6</div><div style="font:600 24px PM;letter-spacing:.3em">DAYS</div></div>'+
  '<div id="dbar" data-b="dbar" style="position:absolute;left:130px;top:952px;width:788px;height:92px"></div>'+cells+
  '<div class="tk" id="xm" data-b="xm" style="left:130px;top:1086px">'+ic('calendar-dots',28,'#120b17')+'24 DEC · CHRISTMAS EVE · THURSDAY</div>');
 var A=bulbs(q(el,'#pa')),K=bulbs(q(el,'#pk')),K0=bulbs(q(el,'#pk0')),dc=[].slice.call(el.querySelectorAll('.dc'));
 var ul=rk(rc.line(110,530,560,522,{stroke:'#ffd34d',strokeWidth:6,roughness:1.6,seed:3}));
 upd[0]=function(t){var l=t-s0;q(el,'.eye').style.opacity=1;q(el,'.h').style.opacity=1;
  var ap=q(el,'#pa');ap.style.opacity=1;ap.style.transform='rotate(-2deg) scale('+(1+.012*Math.sin(t*1.7))+')';chase(A,t,1);
  var six=q(el,'#six');six.style.opacity=1;var pu=Math.max(0,1-Math.abs(t-C.six2-.1)/.25);six.style.transform='scale('+(1+.12*pu+.02*Math.sin(t*3))+')';
  dc.forEach(function(c,i){var on=i===0?1:(i<6?(t>=.7+i*.38?1:0):(t>=C.xmas?1:0)),col=i===0?'#8bff4a':(i===6?'#ff2e4d':'#ffd34d');
   c.style.borderColor=on?col:'#3a2b42';c.style.background=on?(i===6||i===0?col+'33':'#2a1f30'):'#1f1428';var t1=i===6?C.xmas:.7+i*.38;c.style.transform='scale('+(on&&i>0&&t>=t1?1+.08*Math.max(0,1-(t-t1)/.25):1)+')'});
  ent(q(el,'#xm'),t,C.xmas+.1,.35,{y:20});
  var kp=q(el,'#pk');flip(kp,t,C.srk,2);K0.el.style.opacity=t<C.srk?1:0;chase(K0,t,0);chase(K,t,t>=C.king?1:.0);
  if(t>=C.king){var k=E.o3(seg(t,C.king,C.king+.25));kp.style.transform='rotate(2deg) scale('+(1+.006*Math.sin(t*1.7))+') translateY('+(-10*(1-k))+'px)'}
  draw(ul,E.o3(seg(t,C.six2,C.six2+.4)))}
 ev(0,'boom');ev(C.aveng,'whoosh');for(var i=1;i<6;i++)ev(.7+i*.38,'tick');ev(C.xmas,'chime');ev(C.srk,'flip');ev(C.king,'boom');ev(C.six2,'pop')})();

// 1 the month: four flags on the calendar ---------------------------------------------------------------------------------------
(function(){var s0=S[1],g='',hd='',F={3:['fauzi','+2'],16:['dune','INTL'],18:['aveng','+DUNE'],24:['king','']},T={3:.25,16:.75,18:1.25,24:1.75};
 ['MON','TUE','WED','THU','FRI','SAT','SUN'].forEach(function(d,i){hd+='<div style="position:absolute;left:'+(116+i*116)+'px;top:566px;width:110px;text-align:center;font:600 16px PM;letter-spacing:.16em;color:var(--dim)">'+d+'</div>'});
 for(var d=1;d<=31;d++){var dw=(new Date(Date.UTC(2026,11,d)).getUTCDay()+6)%7,wk=Math.floor((d-1+1)/7),idx=d-1+1,row=Math.floor(idx/7),col=idx%7,x=116+col*116,y=600+row*98,f=F[d];
  g+='<div class="card cc" data-d="'+d+'" style="left:'+x+'px;top:'+y+'px;width:110px;height:92px;overflow:hidden">'+(f?'<div class="th" style="position:absolute;inset:0;background:url('+FILM[f[0]][0]+') center 22%/cover"></div>':'')+
   '<div style="position:absolute;left:8px;top:4px;font:400 34px/1 BB;'+(f?'color:#fff;text-shadow:0 2px 6px #000':'color:#6d6075')+'">'+d+'</div>'+(f&&f[1]?'<div class="tag" style="right:4px;bottom:4px;padding:3px 6px;font-size:13px;background:'+FILM[f[0]][1]+'">'+f[1]+'</div>':'')+'</div>'}
 var el=mk(head('// 3 → 24 DEC · SIX BIG FILMS','THIS DECEMBER:<br><span>BOX-OFFICE WAR</span>')+hd+'<div id="cal" data-b="cal" style="position:absolute;left:116px;top:600px;width:806px;height:484px"></div>'+g+
  '<div class="tk" id="w6" data-b="w6" style="left:130px;top:1112px">'+ic('flag-banner',28,'#120b17')+'4 DATES · 6 FILMS · 22 DAYS</div>');
 var cc=[].slice.call(el.querySelectorAll('.cc'));
 upd[1]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);
  cc.forEach(function(c,i){var d=+c.dataset.d,th=c.querySelector('.th');ent(c,l,.02+i*.006,.3,{y:14});
   if(th){var u=seg(t,s0+T[d],s0+T[d]+.3),j=t>=C.jung?Math.sin((t-C.jung)*30)*3*Math.max(0,1-(t-C.jung)/.5):0;th.style.opacity=u>0?1:0;c.style.borderColor=u>0?FILM[F[d][0]][2]:'#3a2b42';
    c.style.transform='translate('+j+'px,0) scale('+(u>0&&u<1?E.bk(u):1)+')';c.style.zIndex=u>0?2:1}});
  ent(q(el,'#w6'),t,C.war,.35,{y:20})};
 [.25,.75,1.25,1.75].forEach(function(x){ev(s0+x,'flag')});ev(C.war,'pop');ev(C.jung,'drum')})();

// 2 clash 1: 3 Dec, three films ---------------------------------------------------------------------------------------------------
(function(){var s0=S[2];
 function tcard(id,x,r,title,who,note,col){return '<div class="card" id="'+id+'" data-b="'+id+'" style="left:'+x+'px;top:470px;width:260px;height:390px;transform:rotate('+r+'deg);text-align:center;padding-top:70px;border-color:'+col+'">'+
  '<div style="font:600 16px PM;letter-spacing:.2em;color:var(--dim)">3 DEC 2026</div><div style="font:400 '+(title.length>7?58:76)+'px/1 BB;margin-top:16px;color:'+col+'">'+title+'</div><div style="font:600 19px/1.4 PM;margin:14px 18px 0">'+who+'</div>'+
  '<div style="position:absolute;left:0;right:0;bottom:22px;font:600 14px PM;letter-spacing:.12em;color:var(--dim)">'+note+'</div></div>'}
 var el=mk(head('// CLASH 1 OF 3 · THURSDAY 3 DEC','<span class="f">3 FILMS</span>, 1 DAY','var(--fauzi)')+
  tcard('rg',160,-8,'RANGER','AJAY DEVGN','POSTER NOT OUT YET','#c9bfd0')+tcard('av',620,8,'UNTITLED','AKSHAY KUMAR<br>+ VIDYA BALAN','TITLE NOT ANNOUNCED','#c9bfd0')+
  '<div class="card" id="gh1" style="left:160px;top:470px;width:260px;height:390px;border:4px dashed #6d6075;background:rgba(31,20,40,.6);text-align:center;padding-top:150px;font:400 90px/1 BB;color:#6d6075">?</div>'+
  '<div class="card" id="gh2" style="left:620px;top:470px;width:260px;height:390px;border:4px dashed #6d6075;background:rgba(31,20,40,.6);text-align:center;padding-top:150px;font:400 90px/1 BB;color:#6d6075">?</div>'+
  marquee('pf','fauzi',404,452,272,408,'FAUZI · PRABHAS',0)+
  '<div class="stamp" id="sd" data-b="sd" style="left:300px;top:930px;color:var(--fauzi)">SAME DAY · 3 DEC</div>'+
  '<div class="src" id="s2" data-b="src" style="top:1176px">Fauzi poster: TMDB · Dates: The Week, Free Press Journal (Jul 2026)</div>');
 var Fz=bulbs(q(el,'#pf'));
 upd[2]=function(t){var l=t-s0;pop(q(el,'#gh1'),t,s0+1.3,.35,-8);pop(q(el,'#gh2'),t,s0+2.4,.35,8);q(el,'#gh1').style.visibility=t>=C.ajay+.3?'hidden':'visible';q(el,'#gh2').style.visibility=t>=C.ajay+.7?'hidden':'visible';ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);
  flip(q(el,'#pf'),t,Math.min(C.prabhas,s0+.5),0);chase(Fz,t,t>=C.fauzi?1:.4);
  ent(q(el,'#rg'),t,C.ajay,.4,{x:0,y:30,r:-14,rr:-8});ent(q(el,'#av'),t,C.ajay+.4,.4,{x:60,y:0,r:14,rr:8});
  slam(q(el,'#sd'),t,C.same,-3);ent(q(el,'#s2'),l,.6,.3,{y:0})}
 ev(Math.min(C.prabhas,s0+.5),'flip');ev(s0+1.3,'pop');ev(s0+2.4,'pop');ev(C.same,'stamp');ev(C.ajay,'whoosh');ev(C.ajay+.4,'whoosh')})();

// 3 clash 2: Dunesday ----------------------------------------------------------------------------------------------------------------
(function(){var s0=S[3];
 var el=mk(head('// CLASH 2 OF 3 · 16–18 DEC · ONE WEEKEND','<span class="d">DUNES</span><span class="a">DAY</span>','var(--dune)')+
  '<div class="card" id="k16" style="left:136px;top:438px;width:298px;height:434px;border:4px dashed var(--dune);text-align:center;padding-top:150px"><div style="font:400 110px/1 BB;color:var(--dune)">16</div><div style="font:600 18px PM;letter-spacing:.2em">DEC</div></div>'+
  '<div class="card" id="k18" style="left:626px;top:438px;width:298px;height:434px;border:4px dashed var(--aveng);text-align:center;padding-top:150px"><div style="font:400 110px/1 BB;color:var(--aveng)">18</div><div style="font:600 18px PM;letter-spacing:.2em">DEC</div></div>'+
  marquee('pd','dune',150,452,270,406,'DUNE · 16 DEC',-2)+marquee('pa3','aveng',630,452,270,406,'DOOMSDAY · 18 DEC',2)+
  '<div id="vs" data-b="vs" style="position:absolute;left:470px;top:560px;width:124px;text-align:center">'+ic('monitor-play',92,'#ffd34d')+'<div style="font:400 64px/1 BB;margin-top:8px">VS</div></div>'+
  '<div id="tl" data-b="tl" style="position:absolute;left:130px;top:892px;font:600 20px PM;letter-spacing:.14em">WHO GETS THE BIG SCREENS?</div>'+
  '<div id="tug" data-b="tug" style="position:absolute;left:130px;top:928px;width:788px;height:64px;border-radius:12px;overflow:hidden;border:3px solid #3a2b42">'+
   '<div id="tu1" style="position:absolute;left:0;top:0;bottom:0;background:var(--dune)"></div><div id="tu2" style="position:absolute;right:0;top:0;bottom:0;background:var(--aveng)"></div>'+
   '<div id="knot" style="position:absolute;top:-4px;width:14px;height:72px;background:var(--bone);margin-left:-7px"></div></div>'+
  '<div id="tn" data-b="tn" style="position:absolute;left:130px;top:1006px;width:788px;font:600 17px/1.5 PM;color:var(--dim)"><span style="color:var(--dune)">DUNE</span> 16 DEC INTL · 18 DEC N. AMERICA<span style="float:right"><span style="color:var(--aveng)">DOOMSDAY</span> 18 DEC</span></div>'+
  '<div class="tag" id="il" data-b="il" style="left:130px;top:1060px;background:#3a2b42;color:var(--bone)">ILLUSTRATION · NOT SCREEN-COUNT DATA</div>'+
  '<div class="src" id="s3" data-b="src" style="top:1176px">Posters: TMDB · Dates: Variety India, Siasat (Sep 2026)</div>');
 var D=bulbs(q(el,'#pd')),A=bulbs(q(el,'#pa3'));
 upd[3]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);
  pop(q(el,'#k16'),t,Math.max(s0+.15,C.d16-.1),.35,-2);pop(q(el,'#k18'),t,C.d18-.1,.35,2);
  flip(q(el,'#pd'),t,C.dune,-2);flip(q(el,'#pa3'),t,C.aveng2,2);chase(D,t,t>=C.dune?1:0);chase(A,t,t>=C.aveng2?1:0);
  q(el,'#k16').style.visibility=t>=C.dune+.45?'hidden':'visible';q(el,'#k18').style.visibility=t>=C.aveng2+.45?'hidden':'visible';
  var v=q(el,'#vs');pop(v,t,C.aveng2+.3,.35,0);
  ent(q(el,'#tl'),l,.3,.3,{y:0});ent(q(el,'#tug'),l,.35,.35,{y:16});ent(q(el,'#tn'),l,.5,.3,{y:0});ent(q(el,'#il'),l,.6,.3,{y:0});ent(q(el,'#s3'),l,.7,.3,{y:0});
  var sh=.5+(t>=C.weekend?.13*Math.sin((t-C.weekend)*2.6)+.04*Math.sin((t-C.weekend)*7.1):.03*Math.sin(t*1.3));q(el,'#tu1').style.width=(sh*100)+'%';q(el,'#tu2').style.width=((1-sh)*100)+'%';q(el,'#knot').style.left=(sh*100)+'%'}
 ev(C.d16,'pop');ev(C.d18,'pop');ev(C.dune,'flip');ev(C.aveng2,'flip');ev(C.aveng2+.3,'boom');ev(C.weekend,'rope')})();

// 4 clash 3: King and its cast (name cards, no likeness beyond the official poster) -----------------------------------------------
(function(){var s0=S[4],cast=[['SHAH RUKH KHAN','THE LEAD'],['SUHANA KHAN','THEATRICAL DEBUT'],['DEEPIKA PADUKONE','CAST'],['ABHISHEK BACHCHAN','REPORTEDLY THE VILLAIN'],['RANI MUKERJI','CAST']],ch='';
 cast.forEach(function(c,i){ch+='<div class="card cs" id="c'+i+'" data-b="c'+i+'" style="left:508px;top:'+(452+i*94)+'px;width:410px;height:84px;padding:10px 18px">'+
  '<div style="font:400 40px/1 BB;letter-spacing:.02em">'+c[0]+'</div><div style="font:600 15px PM;letter-spacing:.12em;color:'+(i===3?'var(--gold)':'var(--dim)')+';margin-top:6px">'+c[1]+'</div></div>'});
 var el=mk(head('// CLASH 3 OF 3 · THURSDAY 24 DEC','AND THEN, <span>KING</span>')+marquee('pk4','king',144,452,320,480,'KING · 24 DEC',0)+ch+
  '<div class="tag" id="db" data-b="db" style="left:770px;top:552px;background:var(--king);font-size:20px">DEBUT</div>'+
  '<div class="tk" id="pp" data-b="pp" style="left:130px;top:986px">'+ic('crown-simple',28,'#120b17')+'SRK + SUHANA · SAME FILM</div>'+
  '<div class="tk" id="dr" data-b="dr" style="left:130px;top:1066px">'+ic('film-strip',28,'#120b17')+'DIR. SIDDHARTH ANAND</div>'+
  '<div class="src" id="s4" data-b="src" style="top:1176px">Poster: TMDB · Cast: Wikipedia · villain role: reported (Gulf News)</div>');
 var K=bulbs(q(el,'#pk4'));var br=rk(rc.path('M 500 498 C 470 520, 470 580, 500 602',{stroke:'#ff2e4d',strokeWidth:5,roughness:1.2,seed:7}));
 upd[4]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);
  var kp=q(el,'#pk4'),u=E.o3(seg(t,s0+.1,Math.max(s0+.4,C.king2+.1)));kp.style.opacity=u;kp.style.transform='scale('+lerp(1.12,1,u)+')';chase(K,t,t>=C.king2?1:.3);
  for(var i=0;i<5;i++)ent(q(el,'#c'+i),t,(i===1?C.suhana-.1:C.king2+.15+i*.22),.35,{x:24,y:0});
  for(var i=0;i<5;i++){var cd=q(el,'#c'+i),foc=t>=C.suhana&&t<S[5]-TR?(i===1||(i===0&&t>=C.papa)?1:0):-1;cd.style.background=foc===1?'#4a1424':'';cd.style.borderColor=foc===1?'#ff2e4d':'';if(foc===0)cd.style.opacity=Math.min(+cd.style.opacity,.45)}
  pop(q(el,'#db'),t,C.debut,.3,-4);ent(q(el,'#pp'),t,C.papa,.35,{y:16});ent(q(el,'#dr'),l,.7,.35,{y:16});ent(q(el,'#s4'),l,.8,.3,{y:0});
  draw(br,E.o3(seg(t,C.papa,C.papa+.4)),t>=S[5]-TR?0:null)}
 ev(C.king2,'boom');[0,2,3,4].forEach(function(i){ev(C.king2+.15+i*.22,'tick')});ev(C.suhana-.1,'tick');ev(C.debut,'stamp');ev(C.papa,'pop')})();

// 5 the money ladder (all reported) -----------------------------------------------------------------------------------------------
(function(){var s0=S[5],rows=[['b1','BUDGET','₹350–400 CR','var(--gold)'],['b2','THEATRICAL RIGHTS · PEN MARUDHAR','₹250 CR','var(--king)'],['b3','STREAMING · NETFLIX','FEE NOT DISCLOSED','#8d8296']],rh='';
 rows.forEach(function(r,i){var y=764+i*112;rh+='<div id="'+r[0]+'" data-b="'+r[0]+'" style="position:absolute;left:130px;top:'+y+'px;width:788px;height:100px">'+
  '<div style="font:600 17px PM;letter-spacing:.12em">'+r[1]+'<span class="tag" style="position:static;margin-left:12px;padding:3px 8px;font-size:13px;background:#3a2b42;color:var(--bone)">REPORTED</span></div>'+
  '<div style="position:absolute;left:0;top:34px;width:788px;height:58px;border-radius:10px;background:#1f1428;border:3px solid #3a2b42;overflow:hidden"><div class="fill" style="position:absolute;left:0;top:0;bottom:0;background:'+r[3]+'"></div>'+
  (i===0?'<div class="ext" style="position:absolute;top:0;bottom:0;background:repeating-linear-gradient(135deg,var(--gold) 0 10px,transparent 10px 20px)"></div>':'')+
  (i===2?'<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,#3a2b42 0 12px,transparent 12px 24px)"></div>':'')+
  '<div class="val" style="position:absolute;right:16px;top:6px;font:400 44px/1 BB;color:var(--bone);text-shadow:0 2px 8px #000"></div></div></div>'});
 var rn='';for(var i=0;i<26;i++)rn+='<div class="rg" style="position:absolute;left:0;top:0;font:700 '+(30+(i%4)*10)+'px Inter;color:var(--gold)">₹</div>';
 var el=mk(rn+head('// FIGURES REPORTED, NOT OFFICIAL','THE <span class="g">MONEY</span>','var(--gold)')+
  '<div id="bn" data-b="bn" style="position:absolute;left:130px;top:452px;width:788px;height:280px;border-radius:14px;overflow:hidden;background:url(img/king_wide.jpg) 30% 40%/cover">'+
   '<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,11,23,.25),rgba(18,11,23,.92) 62%)"></div>'+
   '<div style="position:absolute;right:28px;top:40px;text-align:right"><div style="font:600 18px PM;letter-spacing:.2em;color:var(--gold)">KING · BUDGET</div><div id="cnt" style="font:400 128px/1 BB;color:var(--bone);font-variant-numeric:tabular-nums"></div><div style="font:600 18px PM;letter-spacing:.2em">CRORE RUPEES</div></div></div>'+rh+
  '<div class="src" id="s5" data-b="src" style="top:1176px">Reported: Bollywood Hungama ₹350 cr · Filmibeat, Gulf News ₹400 cr · Sacnilk ₹250 cr</div>');
 function rup(n){return '<span class="rs" style="font-size:.7em">₹</span>'+n}
 upd[5]=function(t){var l=t-s0;var gl=el.querySelectorAll('.rg');for(var i=0;i<gl.length;i++){var sp=170+(i%5)*40,y=((t-s0)*sp+i*97)%720;gl[i].style.transform='translate('+(140+((i*173)%740)+Math.sin(t*1.3+i)*14)+'px,'+(440+y)+'px) rotate('+((t*50+i*40)%360)+'deg)';gl[i].style.opacity=(.5*Math.sin(y/720*Math.PI)).toFixed(3)}ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);ent(q(el,'#bn'),l,.05,.4,{y:20});
  var c=Math.round(350*E.io(seg(t,s0+.3,C.n350+.3))),r4=t>=C.n400;q(el,'#cnt').innerHTML=rup(r4?'350–'+Math.round(lerp(350,400,E.o3(seg(t,C.n400,C.n400+.4)))):c);
  ent(q(el,'#b1'),l,.2,.35,{x:-40,y:0});ent(q(el,'#b2'),t,C.reports+.1,.35,{x:-40,y:0});ent(q(el,'#b3'),t,C.reports+.6,.35,{x:-40,y:0});
  var f1=q(el,'#b1 .fill'),e1=q(el,'#b1 .ext');f1.style.width=(c/400*782)+'px';e1.style.left=(350/400*782)+'px';e1.style.width=(r4?E.o3(seg(t,C.n400,C.n400+.4))*50/400*782:0)+'px';
  q(el,'#b1 .val').innerHTML=c>0?rup(r4?'350–400 CR':c+' CR'):'';
  var u2=E.o3(seg(t,C.reports+.3,C.reports+1.1));q(el,'#b2 .fill').style.width=(u2*250/400*782)+'px';q(el,'#b2 .val').innerHTML=rup(Math.round(250*u2)+' CR');
  q(el,'#b3 .val').textContent='FEE NOT DISCLOSED';ent(q(el,'#s5'),l,.8,.3,{y:0})}
 ev(s0+.3,'roll');ev(C.n350,'cash');ev(C.n400,'cash');ev(C.reports+.1,'pop');ev(C.reports+.6,'pop')})();

// 6 date locked: the Blender clapperboard snaps shut on "बदलेगी" ------------------------------------------------------------------
(function(){var s0=S[6],SC=1.2,OX=86,OY=337,P=CL.P,im='';for(var i=0;i<9;i++)im+='<img class="cf" src="3d/clap'+i+'.png" style="position:absolute;left:0;top:0;width:912px;height:840px;opacity:0">';
 function bx(a,b){return 'left:'+(OX+P[a][0]*SC)+'px;top:'+(OY+P[a][1]*SC)+'px;width:'+((P[b][0]-P[a][0])*SC)+'px;height:'+((P[b][1]-P[a][1])*SC)+'px'}
 var el=mk(head('// INJURED ON SET · FINAL SCHEDULE: OCT','DATE <span>LOCKED</span>')+
  '<div id="clw" style="position:absolute;left:'+OX+'px;top:'+OY+'px;width:912px;height:840px;transform-origin:50% 60%">'+im+'</div>'+
  '<div id="clb" data-b="clb" style="position:absolute;left:284px;top:445px;width:514px;height:658px"></div>'+
  '<div id="r1" style="position:absolute;'+bx('r1tl','r1br')+';display:flex;align-items:center;justify-content:center;font:400 84px/1 BB;color:var(--king);letter-spacing:.08em">KING</div>'+
  '<div id="r2" style="position:absolute;'+bx('r2tl','r2br')+';display:flex;align-items:center;justify-content:center;font:400 66px/1 BB;color:#f3ece0;letter-spacing:.06em">24 · 12 · 2026</div>'+
  '<div id="r3" style="position:absolute;'+bx('r3tl','r3m')+';padding:22px 0 0 18px"><div style="font:600 14px PM;letter-spacing:.16em;color:#a99db0">DIRECTOR</div><div style="font:400 34px/1.05 BB;margin-top:6px">SIDDHARTH<br>ANAND</div></div>'+
  '<div id="r4" style="position:absolute;left:'+(OX+P.r3m[0]*SC)+'px;top:'+(OY+P.r3tl[1]*SC)+'px;width:'+((P.r3br[0]-P.r3m[0])*SC)+'px;padding:22px 0 0 18px"><div style="font:600 14px PM;letter-spacing:.16em;color:#a99db0">SCHEDULE</div><div style="font:400 34px/1.05 BB;margin-top:6px">FINAL<br>OCT 2026</div></div>'+
  '<div class="stamp" id="lk" data-b="lk" style="left:318px;top:520px;color:var(--king)">'+ic('lock-simple',56,'var(--king)','vertical-align:-6px;margin-right:12px')+'NO DELAY</div>'+
  '<div class="tk" id="hu" data-b="hu" style="left:130px;top:1112px">'+ic('bandaids',28,'#120b17')+'SRK INJURED DURING THE SHOOT</div>'+
  '<div class="src" id="s6" data-b="src" style="top:1176px">Outlook India (Sep 2026): no delay · 123telugu (Oct): final schedule</div>');
 var cf=[].slice.call(el.querySelectorAll('.cf')),spk=rk(rc.path('M 0 0 L 40 -30 M 6 18 L 56 6 M -4 30 L 30 52',{stroke:'#ffd34d',strokeWidth:5,roughness:.8,seed:11}));
 upd[6]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);
  var f=8*E.i3(seg(t,C.change-.24,C.change)),a=Math.floor(f),u=f-a;cf.forEach(function(im,i){im.style.opacity=i===a?1:(i===a+1?u:0)});
  var w=q(el,'#clw'),hit=t>=C.change?Math.max(0,1-(t-C.change)/.35):0;var e=E.o5(seg(t,s0,s0+.45));w.style.opacity=e;
  w.style.transform='translate('+(Math.sin(t*41)*8*hit)+'px,'+(30*(1-e)+Math.sin(t*1.4)*4*(t<C.change?1:0))+'px) rotate('+(t<C.change?Math.sin(t*1.1)*1.2:0)+'deg) scale('+(1+.03*hit)+')';
  ['#r1','#r2','#r3','#r4'].forEach(function(s,i){var r=q(el,s);r.style.opacity=Math.min(e,seg(t,s0+.35+i*.18,s0+.6+i*.18));r.style.transform=w.style.transform});
  slam(q(el,'#lk'),t,C.change+.05,-6);ent(q(el,'#hu'),t,C.hurt,.35,{y:16});ent(q(el,'#s6'),l,.8,.3,{y:0});
  var tp=CL.A[8].tip;spk.n.setAttribute('transform','translate('+(OX+tp[0]*SC+10)+','+(OY+tp[1]*SC-30)+')');draw(spk,E.o3(seg(t,C.change,C.change+.15)),t>=C.change&&t<C.change+.7?1-seg(t,C.change+.4,C.change+.7):0)}
 ev(C.hurt,'pop');ev(C.change-.02,'clap');ev(C.change+.05,'stamp')})();

// 7 poll + CTA -----------------------------------------------------------------------------------------------------------------------
(function(){var s0=S[7],P=[['fauzi','FAUZI'],['dune','DUNE'],['aveng','AVENGERS'],['king','KING']],ph='';
 P.forEach(function(p,i){var x=127+i*200;ph+='<div class="post pp" id="q'+i+'" data-b="q'+i+'" style="left:'+x+'px;top:452px;width:186px;height:279px;background-image:url('+FILM[p[0]][0]+');border:4px solid '+FILM[p[0]][1]+'"></div>'+
  '<div class="pl" id="ql'+i+'" style="position:absolute;left:'+x+'px;top:742px;width:186px;text-align:center;font:400 38px/1 BB;color:'+FILM[p[0]][1]+'">'+p[1]+'</div>'});
 var el=mk(head('// COMMENT YOUR PICK','WHICH ONE <span class="g">FIRST?</span>','var(--gold)')+ph+
  '<div id="pf" data-b="pf" style="position:absolute;left:130px;top:810px;width:180px;height:180px;border-radius:50%;border:7px solid var(--bg);box-shadow:0 0 0 6px var(--gold),0 0 30px rgba(255,211,77,.5);background:url(profile.jpg) center/cover"></div>'+
  '<div id="hd" data-b="hd" style="position:absolute;left:340px;top:836px;font:700 50px/1 Inter;letter-spacing:-.02em;color:var(--bone)">@sandeshexplains</div>'+
  '<div id="fo" data-b="fo" style="position:absolute;left:340px;top:906px;padding:12px 36px 8px;background:var(--king);color:#fff;border-radius:999px;font:400 44px/1 BB;letter-spacing:.08em">'+ic('user-plus',34,'#fff','vertical-align:-4px;margin-right:12px')+'FOLLOW</div>'+
  '<div class="tk" id="cm" data-b="cm" style="left:130px;top:1040px;transform-origin:0 50%">'+ic('chat-circle-dots',30,'#120b17')+'COMMENT: FAUZI · DUNE · AVENGERS · KING</div>');
 var ring=[];P.forEach(function(p,i){ring.push(rk(rc.rectangle(117+i*200,442,206,299,{stroke:'#ffd34d',strokeWidth:6,roughness:1.4,seed:20+i})))});
 upd[7]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.03,.35);
  var k=t>=C.which?Math.floor((t-C.which)/.55)%4:-1;
  for(var i=0;i<4;i++){var p=q(el,'#q'+i);ent(p,l,.08+i*.1,.35,{y:30});if(l>.5+i*.1)p.style.transform='scale('+(i===k?1.05:1)+')';ent(q(el,'#ql'+i),l,.2+i*.1,.3,{y:10});
   var u=i===k?E.o3(seg((t-C.which)%.55,0,.25)):0;if(i===k)draw(ring[i],u,1);else hide(ring[i])}
  pop(q(el,'#pf'),t,C.q+.6,.4,0);ent(q(el,'#hd'),t,C.q+.75,.35,{x:40,y:0});ent(q(el,'#fo'),t,C.q+.9,.35,{y:20});
  var fo=q(el,'#fo');if(t>C.follow){var b=(t-C.follow)%1.6;fo.style.transform='scale('+(1+.08*Math.sin(Math.min(b,.4)/.4*Math.PI))+')'}
  var cm=q(el,'#cm'),cu=seg(t,C.comment-.1,C.comment+.25);cm.style.opacity=cu>0?1:0;var pb=t>C.comment+.3?(t-C.comment-.3)%1.5:9;cm.style.transform='scale('+(cu<1?(cu>0?E.bk(cu):.3):1+.05*Math.sin(Math.min(pb,.4)/.4*Math.PI))+')'}
 ev(s0+.1,'whoosh');ev(C.q+.6,'pop');ev(C.comment-.1,'pop');ev(C.follow,'chime');for(var x=C.which;x<END-.4;x+=.55)ev(x,'tick')})();
for(var i=1;i<S.length;i++)ev(S[i]-.12,'swish');

// ---- captions ---------------------------------------------------------------------------------------------------------------------
function cap(t){var CP=TM.CAP,k=-1;for(var i=0;i<CP.length;i++)if(t>=CP[i][0]-.05)k=i;var c=$('cap');if(k<0){c.style.opacity=0;return}
 var ws=CP[k][2],h='';ws.forEach(function(w,j){var on=t>=w[1]&&(j===ws.length-1||t<ws[j+1][1]);h+=(j?' ':'')+(on?'<b>'+w[0]+'</b>':w[0])});c.innerHTML=h;var u=E.o3(seg(t,CP[k][0]-.05,CP[k][0]+.12));c.style.opacity=1;c.style.transform='translateY('+(6*(1-u))+'px)'}

// ---- host, dust and seek (sequential cuts: outgoing clears in the first half, incoming arrives in the second) -----------------------
var els=[].slice.call(document.querySelectorAll('#scenes > .sc'));
var vid=$('hostv'),avc=$('avc'),hx=avc.getContext('2d'),lastF=-1,dv=$('dust'),lastD=-1;
function vseek(v,ft){return new Promise(function(res){var dn=function(){v.removeEventListener('seeked',dn);res()};v.addEventListener('seeked',dn);v.currentTime=ft})}
function hostSeek(t){if(!vid.duration)return Promise.resolve();var f=Math.floor(t*24);if(f===lastF)return Promise.resolve();lastF=f;var ft=Math.min((f+.5)/24,vid.duration-.02);
 return vseek(vid,ft).then(function(){hx.clearRect(0,0,544,544);hx.drawImage(vid,0,0,544,544)})}
function dustSeek(t){if(!dv.duration)return Promise.resolve();var f=Math.floor(t*30);if(f===lastD)return Promise.resolve();lastD=f;return vseek(dv,((f+.5)/30)%(dv.duration-.1))}
window.EV=EV.sort(function(a,b){return a[0]-b[0]});
window.__reelDurationSec=END;
window.__seek=function(t){
 t=Math.max(0,Math.min(END-1e-3,t));
 lights(t);drawRib(t);
 RG.forEach(hide);
 els.forEach(function(el,si){var s0=S[si],s1=si+1<S.length?S[si+1]:END,raw=t-s0,op=0,tf='';
  if((raw>=-TR||si===0)&&t<=s1+.001){if(raw<0&&si>0){var p=E.o3(seg(t,s0-.15,s0+.02));op=p;tf='translateY('+(18*(1-p))+'px) scale('+lerp(.985,1,p)+')'}else if(si<S.length-1&&t>s1-TR){var p=E.o3(seg(t,s1-TR,s1-.15));op=1-p;tf='translateY('+(-12*p)+'px)'}else op=1;
   upd[si](t);if(op<1)RG.forEach(function(r){if(+r.n.style.opacity>0)r.n.style.opacity=+r.n.style.opacity*op})}
  el.style.opacity=op;el.style.transform=tf;el.style.display=op>0?'block':'none'});
 var fl=0;for(var i=1;i<S.length;i++)fl=Math.max(fl,.14*Math.max(0,1-Math.abs(t-S[i]+.15)/.06));
 [C.king,C.king2,C.change].forEach(function(x){fl=Math.max(fl,.45*Math.max(0,1-(t-x)/.18)*(t>=x?1:0))});$('flash').style.opacity=fl.toFixed(3);
 var sw=(t%1.8)/.65;$('sweep').style.opacity=sw<1?Math.sin(sw*Math.PI).toFixed(3):0;$('sweep').style.backgroundPosition=(100-100*cl(sw))+'% 0';  // projector-light sweep, every 1.8 s
 cap(t);
 return Promise.all([hostSeek(t),dustSeek(t)])};
window.__ready=false;
var fp=['400 104px BB','600 22px PM','700 30px Inter','600 20px Inter'].map(function(f){return document.fonts.load(f)});
var srcs=['img/king.jpg','img/avengers.jpg','img/dune.jpg','img/fauzi.jpg','img/king_wide.jpg','profile.jpg'].concat([0,1,2,3,4,5,6,7,8].map(function(i){return '3d/clap'+i+'.png'}));
var imgs=srcs.map(function(s){return new Promise(function(r){var im=new Image();im.onload=r;im.onerror=r;im.src=s})});
function vready(v){return new Promise(function(r){if(v.readyState>=2)r();v.addEventListener('loadeddata',r);setTimeout(r,8000)})}
Promise.all(fp.concat(imgs,[vready(vid),vready(dv)])).catch(function(){}).then(function(){return window.__seek(0)}).then(function(){window.__ready=true});
})();
