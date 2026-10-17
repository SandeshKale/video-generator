// Ramayana booking reel. Every visual is a pure function of t (window.__seek). Host cut-out video + dust overlay are seeked per frame.
(function(){
var TM=window.TM,S=TM.S,END=TM.END,TR=.35,NS='http://www.w3.org/2000/svg';
var $=function(id){return document.getElementById(id)};
function cl(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))}
var E={o3:function(x){return 1-Math.pow(1-x,3)},o5:function(x){return 1-Math.pow(1-x,5)},io:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},bk:function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
function seg(t,a,b){return cl((t-a)/(b-a))}
function lerp(a,b,u){return a+(b-a)*u}
function ent(el,t,t0,d,o){o=o||{};var u=E.o5(seg(t,t0,t0+d));el.style.opacity=u;el.style.transform='translate('+((o.x||0)*(1-u))+'px,'+((o.y==null?28:o.y)*(1-u))+'px) scale('+(1-(1-(o.s||1))*(1-u))+') rotate('+((o.r||0)*(1-u))+'deg)'}
function pop(el,t,t0,d,r){var u=seg(t,t0,t0+d);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u>0?E.bk(u):.3)+')'}
function mk(html){var d=document.createElement('div');d.className='sc';d.innerHTML=html;$('scenes').appendChild(d);return d}
function q(sc,s){return sc.querySelector(s)}
function sv(tag,at,p){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(p)p.appendChild(e);return e}
function fmt(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function typed(s,t,t0,cps){var n=Math.floor(Math.max(0,t-t0)*(cps||26));return s.slice(0,Math.min(s.length,n))}
var DAYS=Math.ceil((Date.UTC(2026,10,5)-Date.parse(TM.POST+'T00:00:00Z'))/864e5);
var head=function(eye,h,top){return '<div class="eye" data-b="eye"><i></i>'+eye+'</div><div class="h" data-b="h" style="'+(top?'top:'+top+'px':'')+'">'+h+'</div>'};
var upd=[];
// 0 hook ------------------------------------------------------------------
(function(){var s0=S[0],el=mk(head('// ADVANCE BOOKING · INDIA','RAMAYANA <span class="k">BOOKINGS</span> OPEN')+
 '<div class="lab" id="stamp" data-b="stamp" style="left:122px;top:930px;font:800 62px/1 Bod;border:7px solid var(--kum);color:var(--kum);padding:6px 22px;letter-spacing:.02em">ADVANCE BOOKING</div>'+
 '<div class="lab" id="t1" data-b="t1" style="left:110px;top:1070px;color:var(--gold);font-size:22px"></div><div class="lab" id="t2" data-b="t2" style="left:110px;top:1112px;color:var(--cream);font-size:22px"></div><div class="lab" id="t3" data-b="t3" style="left:110px;top:1154px;color:var(--teal);font-size:22px"></div>');
 upd[0]=function(t){var l=t-s0;ent(q(el,'.eye'),l,-1,.3,{y:0});ent(q(el,'.h'),l,-1,.4);pop(q(el,'#stamp'),l,-.5,.4,-3);
  q(el,'#t1').textContent=typed('> checking the india booking window...',l,.1,30);q(el,'#t2').textContent=typed('> advance booking: opens on dussehra',l,1.4,30);q(el,'#t3').textContent=typed('> ticket covers: part 1 of 2',l,2.6,30)}})();
// 1 date ------------------------------------------------------------------
(function(){var s0=S[1],el=mk(head('// DUSSEHRA · TUE 20 OCT','THIS <span class="g">TUESDAY</span>')+
 '<div id="cal" data-b="cal" style="position:absolute;left:128px;top:900px;width:290px;height:300px;background:var(--cream);color:var(--ink);border-radius:16px;box-shadow:0 18px 34px rgba(0,0,0,.55);overflow:hidden"><div style="height:62px;background:var(--kum);color:var(--cream);font:700 26px/62px CM;letter-spacing:.14em;text-align:center">OCT 2026</div><div style="font:800 150px/1 Bod;text-align:center;margin-top:10px">20</div><div style="font:700 26px CM;letter-spacing:.2em;text-align:center">TUESDAY</div><div style="font:700 20px CM;letter-spacing:.14em;text-align:center;color:var(--kum);margin-top:8px">DUSSEHRA</div></div>'+
 '<div class="chip" id="c1" data-b="c1" style="left:440px;top:910px;border-color:var(--gold);color:var(--gold)">INDIA · BOOKING OPENS</div><div class="chip" id="c2" data-b="c2" style="left:440px;top:1000px;border-color:var(--teal);color:var(--teal)">OVERSEAS · ON SALE NOW</div>'+
 '<div class="src" id="s1" data-b="src" style="top:1215px;left:110px;font-size:14px">India: makers\' announcement (DTNext, Outlook India) · Overseas: trailer end card</div>');
 upd[1]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);pop(q(el,'#cal'),l,.25,.45,-4);ent(q(el,'#c1'),l,1.0,.35,{x:60,y:0});ent(q(el,'#c2'),l,1.9,.35,{x:60,y:0});ent(q(el,'#s1'),l,2.6,.3,{y:0})}})();
// 2 ticket tear ------------------------------------------------------------
(function(){var s0=S[2],el=mk(head('// WHAT YOU ARE BUYING','HALF THE <span class="k">STORY</span>')+
 '<div class="tk" id="tl" data-b="tl" style="left:116px;top:930px;width:474px"><div class="a">RAMAYANA · ADMIT ONE</div><div class="b">PART 1</div><div class="c">IN CINEMAS 5 NOV 2026</div></div>'+
 '<div class="tk" id="tr" data-b="tr" style="left:590px;top:930px;width:298px;background:#d9cfb8"><div class="a" style="left:40px">LATER</div><div class="b" style="left:40px">PART 2</div><div class="c" style="left:40px">DIWALI 2027</div></div>'+
 '<div class="lab" id="tag" data-b="tag" style="left:110px;top:1140px;color:var(--gold);font-size:26px">ONE FILM · TWO TICKETS · TWO YEARS</div>');
 upd[2]=function(t){var l=t-s0,tear=E.o5(seg(l,2.6,3.1));ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);ent(q(el,'#tl'),l,.25,.5,{x:-70,y:0});ent(q(el,'#tr'),l,.4,.5,{x:70,y:0});
  var a=q(el,'#tl'),b=q(el,'#tr');a.style.transform='translate('+(-6*tear)+'px,'+(4*tear)+'px) rotate('+(-3*tear)+'deg)'+(l<.75?'':'');b.style.transform='translate('+(12*tear)+'px,'+(8*tear)+'px) rotate('+(4*tear)+'deg)';b.style.opacity=lerp(1,.62,tear);
  if(l<.75){a.style.opacity=E.o5(seg(l,.25,.75));b.style.opacity=E.o5(seg(l,.4,.9))}ent(q(el,'#tag'),l,3.2,.4,{y:10})}})();
// 3 five november ----------------------------------------------------------
var gen=rough.generator();
(function(){var s0=S[3],el=mk(head('// PART 1 · RELEASE','PART 1: <span class="k">5 NOV</span>')+
 '<div class="tk" id="st" data-b="st" style="left:110px;top:920px;width:520px"><div class="a">PART 1 · IN CINEMAS</div><div class="b" id="d5">5 NOV 2026</div><div class="c">TICKETS: OVERSEAS ON SALE, INDIA DUSSEHRA</div></div>'+
 '<svg id="rc" data-b="rc" style="position:absolute;left:120px;top:930px;width:360px;height:130px;overflow:visible" viewBox="0 0 360 130"></svg>'+
 '<div id="od" data-b="od" style="position:absolute;left:660px;top:920px;width:268px;height:170px;background:var(--gold);color:var(--ink);border-radius:18px;box-shadow:0 18px 34px rgba(0,0,0,.55);text-align:center;padding-top:18px"><div id="odn" style="font:800 96px/1 Bod;font-variant-numeric:tabular-nums">0</div><div style="font:700 22px CM;letter-spacing:.12em">DAYS TO GO</div></div>'+
 '<div class="src" id="s3" data-b="src" style="top:1130px;font-size:16px">Release date: trailer end card and the makers\' 11 Oct announcement. Days counted from the posting day.</div>');
 var d=gen.ellipse(190,62,345,112,{seed:5,roughness:1.6,stroke:'#e8341c',strokeWidth:6,fill:'none'}),ps=gen.toPaths(d),P=ps.map(function(p){var e=sv('path',{d:p.d,fill:'none',stroke:'#e8341c','stroke-width':6,'stroke-linecap':'round'},q(el,'#rc'));var L=e.getTotalLength();e.style.strokeDasharray=L;e.style.strokeDashoffset=L;return [e,L]});
 upd[3]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);ent(q(el,'#st'),l,.2,.45,{x:-50,y:0});ent(q(el,'#od'),l,.5,.45,{x:50,y:0});ent(q(el,'#s3'),l,1.7,.3,{y:0});
  var u=E.io(seg(l,.9,1.7));P.forEach(function(p){p[0].style.strokeDashoffset=p[1]*(1-u)});
  var cu=E.o3(seg(l,.7,2.0));q(el,'#odn').textContent=Math.round(DAYS+14*(1-cu))}})();
// 4 imax -------------------------------------------------------------------
(function(){var s0=S[4],el=mk(head('// FORMATS','IN <span class="g">IMAX</span> + PREMIUM')+
 '<div class="chip" id="ci" data-b="ci" style="left:122px;top:910px;font:800 64px/1.1 Bod;border-color:var(--gold);color:var(--gold);padding:8px 24px">IMAX</div><div class="chip" id="cp" data-b="cp" style="left:420px;top:925px;border-color:var(--cream)">PREMIUM FORMATS</div>'+
 '<div class="lab" id="l1" data-b="l1" style="left:110px;top:1060px;color:var(--dim);font-size:19px">STANDARD SCREEN</div><div style="position:absolute;left:110px;top:1092px;width:818px;height:26px;border:3px solid var(--dim);border-radius:6px" data-b="trk"></div><div id="bar" style="position:absolute;left:113px;top:1095px;height:20px;width:0;background:var(--kum);border-radius:3px"></div>'+
 '<div class="lab" id="l2" data-b="l2" style="left:110px;top:1128px;color:var(--kum);font-size:19px">IMAX SCREEN · ILLUSTRATIVE</div><div class="src" id="s4" data-b="src" style="top:1170px;font-size:15px">Trailer end card: "only in theatres, in premium formats and IMAX".</div>');
 upd[4]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);pop(q(el,'#ci'),l,.2,.4,-2);ent(q(el,'#cp'),l,.55,.35,{x:60,y:0});ent(q(el,'#l1'),l,1.0,.3,{y:0});ent(q(el,'#l2'),l,1.4,.3,{y:0});ent(q(el,'#s4'),l,2.2,.3,{y:0});
  q(el,'#bar').style.width=(lerp(430,806,E.io(seg(l,1.4,3.0))))+'px'}})();
// 5 part 2 -----------------------------------------------------------------
(function(){var s0=S[5],el=mk(head('// PART 2','PART 2: <span class="k">DIWALI 2027</span>')+
 '<div class="tk" id="p2" data-b="p2" style="left:122px;top:930px;width:560px;background:#d9cfb8"><div class="a">PART 2 · NEXT DIWALI</div><div class="b" style="font-size:60px">DIWALI 2027</div><div class="c">ONE STORY, TWO FILMS</div></div>'+
 '<svg id="dy" data-b="dy" style="position:absolute;left:730px;top:920px;width:190px;height:190px" viewBox="0 0 190 190"><path d="M20 120 Q95 190 170 120 Q95 140 20 120Z" fill="#ffb300" stroke="#e8341c" stroke-width="5"/><path id="fl" d="M95 112 C70 85 85 60 95 30 C105 60 120 85 95 112Z" fill="#ffb300" opacity="0"/></svg>'+
 '<div class="lab" id="tg" data-b="tg" style="left:110px;top:1130px;color:var(--gold);font-size:24px">PART 1 FIRST. THEN WE WAIT A YEAR.</div>');
 upd[5]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);ent(q(el,'#p2'),l,.25,.5,{x:-60,y:0});ent(q(el,'#dy'),l,.6,.4,{y:20});
  var on=seg(l,2.6,3.0),fl=q(el,'#fl');fl.setAttribute('opacity',on);fl.setAttribute('transform','translate(95 112) scale('+(1+.08*Math.sin(l*18))+' '+(1+.14*Math.sin(l*13+1))+') translate(-95 -112)');ent(q(el,'#tg'),l,3.2,.4,{y:10})}})();
// 6 languages --------------------------------------------------------------
var LANG=[['HINDI','#ffb300',.7],['TAMIL','#2ee6c0',1.6],['TELUGU','#a58bff',2.2],['KANNADA','#c6f432',2.87],['MALAYALAM','#ff7aa8',3.54]];
(function(){var s0=S[6],pos=[[122,905],[392,905],[662,905],[122,1062],[392,1062]],h='';
 LANG.forEach(function(L,i){h+='<div class="tk" id="lg'+i+'" data-b="lg'+i+'" style="left:'+pos[i][0]+'px;top:'+pos[i][1]+'px;width:250px;height:140px"><div class="a" style="top:14px;left:20px;font-size:16px">LANGUAGE '+(i+1)+'</div><div class="b" style="top:44px;left:20px;font-size:'+(L[0].length>=9?30:(L[0].length>=6?40:50))+'px">'+L[0]+'</div></div>'});
 var el=mk(head('// IN FIVE LANGUAGES','FIVE <span class="k">LANGUAGES</span>')+h+'<div id="cn" data-b="cn" style="position:absolute;left:662px;top:1062px;width:250px;height:140px;background:var(--gold);color:var(--ink);border-radius:18px;text-align:center;padding-top:14px"><div id="cnn" style="font:800 74px/1 Bod">0/5</div><div style="font:700 18px CM;letter-spacing:.1em">LIT UP</div></div>');
 upd[6]=function(t){var l=t-s0,n=0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);ent(q(el,'#cn'),l,.4,.4,{y:20});
  LANG.forEach(function(L,i){var e=q(el,'#lg'+i),a=E.o5(seg(l,.2+i*.12,.6+i*.12)),on=seg(l,L[2],L[2]+.25);if(on>=1)n++;
   e.style.opacity=a;e.style.background=on>0?L[1]:'#f6ecd5';e.style.transform='translateY('+(18*(1-a)-12*E.o3(on))+'px) rotate('+(on>0?(i%2?1.5:-1.5):0)+'deg) scale('+(1+.06*Math.sin(Math.PI*on))+')'});
  q(el,'#cnn').textContent=n+'/5'}})();
// 7 budget -----------------------------------------------------------------
(function(){var s0=S[7],el=mk(head('// THE BUDGET · REPORTED','THE <span class="k">BUDGET</span>')+
 '<div id="bw" data-b="bw" style="position:absolute;left:110px;top:920px;width:818px;height:104px;border:3px solid var(--teal);border-radius:10px;overflow:hidden"><div id="b1" style="position:absolute;left:0;top:0;height:100%;width:0;background:var(--teal)"></div><div style="position:absolute;left:50%;top:0;bottom:0;border-left:4px dashed var(--ink);opacity:0" id="bs"></div><div style="position:absolute;left:20px;top:34px;font:700 26px CM;letter-spacing:.1em;color:var(--ink)" id="p1l">PART 1</div><div style="position:absolute;left:440px;top:34px;font:700 26px CM;letter-spacing:.1em;color:var(--ink)" id="p2l">PART 2</div></div>'+
 '<div id="bn" data-b="bn" style="position:absolute;left:110px;top:1040px;font:800 118px/1 Bod;color:var(--teal);font-variant-numeric:tabular-nums;white-space:nowrap">₹— CR</div>'+
 '<div class="chip" id="rp" data-b="rp" style="left:110px;top:1172px;border-color:var(--teal);color:var(--teal);font-size:19px;padding:6px 12px">REPORTED · BOTH PARTS COMBINED</div>');
 upd[7]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.4);ent(q(el,'#bw'),l,.3,.4,{y:20});ent(q(el,'#rp'),l,.9,.3,{x:40,y:0});
  q(el,'#b1').style.width=(100*E.io(seg(l,2.9,4.5)))+'%';q(el,'#bs').style.opacity=seg(l,4.4,4.7);
  var n=4000*E.o3(seg(l,4.6,6.1)),b=q(el,'#bn');b.textContent=l<4.6?'₹— CR':'₹'+fmt(n)+' CR';ent(b,l,.8,.4,{y:20})}})();
// 8-10 cast (stills in the window) ------------------------------------------
function cast(i,role,name){var s0=S[i],el=mk(head('// THE CAST · FROM THE TRAILER',role)+
 '<div class="tk" id="np" data-b="np" style="left:116px;top:905px;width:806px;height:190px;background:var(--gold)"><div class="a" style="font-size:22px">ROLE · '+role.replace(/<[^>]+>/g,'')+'</div><div class="b" style="top:56px;font-size:'+(name.length>12?72:84)+'px">'+name+'</div><div class="c" style="color:#5a4a1a">SEEN IN THE TRAILER</div></div>');
 upd[i]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.25,{y:0});ent(q(el,'.h'),l,.03,.3);ent(q(el,'#np'),l,.15,.35,{x:80,y:0})}}
cast(8,'<span class="k">RAM</span>','RANBIR KAPOOR');cast(9,'<span class="g">SITA</span>','SAI PALLAVI');cast(10,'<span class="k">RAVANA</span>','YASH');
// 11 hanuman card -----------------------------------------------------------
(function(){var s0=S[11],el=mk(head('// THE CAST','AND <span class="g">HANUMAN</span>')+
 '<div id="hc" data-b="hc" style="position:absolute;left:112px;top:400px;width:816px;height:461px;background:linear-gradient(135deg,#1a1d52,#0d1030);border:5px solid var(--gold);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:14px;box-shadow:0 24px 50px rgba(0,0,0,.6)"><div style="font:700 24px CM;letter-spacing:.2em;color:var(--gold)">HANUMAN</div><div style="font:800 96px/1 Bod;color:var(--cream)">SUNNY DEOL</div><div class="chip" style="position:static;border-color:var(--kum);color:var(--kum);font-size:21px">NOT SHOWN IN THIS TRAILER</div></div>');
 upd[11]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.25,{y:0});ent(q(el,'.h'),l,.03,.3);ent(q(el,'#hc'),l,.1,.4,{s:.96,y:20})}})();
// 12 CTA -------------------------------------------------------------------
var CL=['HINDI','TAMIL','TELUGU','KANNADA','MALAYALAM'];
(function(){var s0=S[12],el=mk(head('// YOUR TURN','WHICH <span class="k">LANGUAGE</span>?')+
 '<div id="pf" data-b="pf" style="position:absolute;left:110px;top:430px;width:210px;height:210px;border-radius:50%;border:9px solid var(--gold);box-shadow:0 0 0 8px rgba(13,16,48,.85),0 14px 40px rgba(0,0,0,.6);overflow:hidden"><img src="profile.jpg" style="width:100%;height:100%;object-fit:cover"></div>'+
 '<div id="hd" data-b="hd" style="position:absolute;left:350px;top:476px;font:800 54px/1 Bod;color:var(--cream);white-space:nowrap">@sandesh_explains</div><div id="sb" data-b="sb" style="position:absolute;left:350px;top:550px;font:700 22px CM;color:var(--gold);letter-spacing:.1em">BOX OFFICE, EXPLAINED</div>'+
 '<div id="bx" data-b="bx" style="position:absolute;left:110px;top:700px;width:818px;height:110px;border:4px solid var(--cream);background:rgba(0,0,0,.45);border-radius:10px;padding:14px 22px"><div style="font:700 18px CM;color:var(--dim);letter-spacing:.14em">COMMENT YOUR LANGUAGE</div><div id="ty" style="font:700 44px/1.2 CM;color:var(--gold)"></div></div>'+
 '<div id="ch" data-b="ch" style="position:absolute;left:110px;top:840px;width:818px;height:90px"></div>'+
 '<div class="chip" id="fo" data-b="fo" style="left:122px;top:980px;background:var(--kum);border-color:var(--kum);color:var(--cream);font:800 56px/1.1 Bod;padding:8px 34px;letter-spacing:.04em">FOLLOW</div>');
 var chips=CL.map(function(n,i){var c=document.createElement('div');c.className='chip';c.style.cssText='position:relative;display:inline-block;margin-right:10px;font-size:20px;padding:6px 12px;border-color:'+LANG[i][1]+';color:'+LANG[i][1];c.textContent=n;q(el,'#ch').appendChild(c);return c});
 upd[12]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.25,{y:0});ent(q(el,'.h'),l,.05,.4);ent(q(el,'#pf'),l,.15,.4,{s:.85,y:0});ent(q(el,'#hd'),l,.3,.4,{x:40,y:0});ent(q(el,'#sb'),l,.5,.3,{y:0});ent(q(el,'#bx'),l,.7,.35,{y:20});
  var k=Math.floor(Math.max(0,l-1.4)/1.0)%5,sub=(l-1.4)%1;q(el,'#ty').textContent=l<1.4?'':(typed(CL[k],sub+1.4,1.4,14)+(Math.floor(l*3)%2?'_':' '));
  chips.forEach(function(c,i){var u=E.o5(seg(l,1.2+i*.25,1.5+i*.25));c.style.opacity=u;c.style.transform='translateY('+(14*(1-u))+'px)'});
  var fo=q(el,'#fo');ent(fo,l,2.0,.35,{y:20});if(l>2.4)fo.style.transform='scale('+(1+.05*Math.sin((l-2.4)*7))+')'}})();
// shared layers -------------------------------------------------------------
var order=[];for(var i=0;i<13;i++)order.push(i);var els=[].slice.call(document.querySelectorAll('#scenes > .sc'));
var vid=document.createElement('video');vid.muted=true;vid.preload='auto';vid.src='host.webm';var avc=$('avc'),cx=avc.getContext('2d'),lastF=-1;
function hostSeek(t){var f=Math.floor(t*24);if(f===lastF)return Promise.resolve();lastF=f;var ft=(f+.5)/24;if(vid.duration)ft=Math.min(ft,vid.duration-.02);
 return new Promise(function(res){var dn=function(){vid.removeEventListener('seeked',dn);cx.clearRect(0,0,544,544);cx.drawImage(vid,0,0,544,544);res()};vid.addEventListener('seeked',dn);vid.currentTime=ft})}
var dust=$('dust'),lastD=-1;
function dustSeek(t){var vis=t>=S[5]&&t<=S[6]+.2;dust.style.opacity=vis?.28:0;if(!vis||!dust.duration)return Promise.resolve();
 var f=Math.floor(t*30),ft=((f+.5)/30)%dust.duration;if(f===lastD)return Promise.resolve();lastD=f;return new Promise(function(res){var dn=function(){dust.removeEventListener('seeked',dn);res()};dust.addEventListener('seeked',dn);dust.currentTime=ft})}
var pc=$('pet').getContext('2d');
function petals(t){pc.clearRect(0,0,1080,1000);if(!(t>=S[1]-.2&&t<=S[2]+.2))return;var a=cl(Math.min(seg(t,S[1],S[1]+.4),1-seg(t,S[2]-.4,S[2])));for(var i=0;i<34;i++){var sp=60+(i*37)%70,x0=(i*149)%1080,y=((t*sp+i*91)%1100)-80,x=x0+Math.sin(t*1.3+i)*40;pc.save();pc.globalAlpha=.8*a;pc.translate(x,y);pc.rotate(t*1.6+i);pc.fillStyle=i%3?'#ffb300':'#ff7aa8';pc.beginPath();pc.ellipse(0,0,11,6,0,0,6.283);pc.fill();pc.restore()}}
function shotAt(t){var s=TM.SHOTS;for(var i=0;i<s.length;i++)if(t>=s[i][0]&&t<s[i][1])return i;return -1}
function camOf(k,p){var d=k%2?-1:1;return [d*(p-.5)*1.5,.25*Math.sin(p*3+k),lerp(1.07,1.2,E.io(p))]}
function winDraw(t){var k=shotAt(t),on=k>=0&&t<S[11];$('win').style.opacity=on?(1-seg(t,S[11]-.2,S[11]))*Math.min(1,seg(t,0,.01)+1):0;$('wcr').style.opacity=on?1:0;if(!on||!window.GLP)return;var sh=TM.SHOTS,a=sh[k],p=(t-a[0])/(a[1]-a[0]),nx=sh[k+1]&&t>a[1]-.2?sh[k+1]:null;
 GLP.draw({a:a[2],b:nx?nx[2]:null,mix:nx?seg(t,a[1]-.2,a[1]):0,camA:camOf(k,p),camB:camOf(k+1,0),par:.07,dim:1,t:t})}
window.__reelDurationSec=END;
window.__seek=function(t){
 t=Math.max(0,Math.min(END-1e-3,t));
 var bx=50+24*Math.sin(t*1.3),by=30+10*Math.cos(t*1.0);$('bg').style.background='radial-gradient(ellipse 70% 46% at '+bx+'% '+by+'%,#2b2f86 0,#0d1030 70%)';
 $('rang').style.backgroundPosition=((t*46)%64)+'px '+((t*30)%64)+'px';var sw=(t/3.0)%1;$('sweep').style.left=(-380+1800*sw)+'px';$('sweep').style.opacity=(.4+.6*Math.sin(sw*Math.PI)).toFixed(3);
 order.forEach(function(si){var s0=S[si],s1=si+1<S.length?S[si+1]:END,el=els[si],raw=t-s0,op=0,tf='';
  if(raw>=-TR&&t<=s1+.001){if(raw<0){var p=E.o3(seg(t,s0-TR,s0));op=p;tf='translateY('+(14*(1-p))+'px)'}else if(si<12&&t>s1-TR){var p=E.o3(seg(t,s1-TR,s1-.1));op=1-p;tf='translateY('+(-10*p)+'px)'}else op=1;upd[si](t)}
  el.style.opacity=op;el.style.transform=tf;el.style.display=op>0?'block':'none'});
 petals(t);winDraw(t);
 var c='';for(var k=0;k<TM.C.length;k++)if(t>=TM.C[k][0]&&t<TM.C[k][1]){c=TM.C[k][2];var u=E.o3(seg(t,TM.C[k][0],TM.C[k][0]+.18));$('cap').style.opacity=u;$('cap').style.transform='translateY('+(8*(1-u))+'px)'}
 $('cap').textContent=c;$('cap').style.display=c?'block':'none';$('caprule').style.display=c?'block':'none';
 $('av').style.opacity=E.o3(seg(t,0,.5));
 return Promise.all([hostSeek(t),dustSeek(t)])};
window.__ready=false;
var fp=['800 80px Bod','700 24px CM','500 16px CM','700 30px Inter','600 18px Inter'].map(function(f){return document.fonts.load(f)});
var ids=TM.SHOTS.map(function(s){return s[2]}).filter(function(v,i,a){return a.indexOf(v)===i});
Promise.all(fp.concat([GLP.load(ids),new Promise(function(r){vid.addEventListener('loadeddata',r);setTimeout(r,8000)}),new Promise(function(r){dust.addEventListener('loadeddata',r);setTimeout(r,8000)})])).catch(function(){}).then(function(){window.__seek(0);window.__ready=true});
})();
