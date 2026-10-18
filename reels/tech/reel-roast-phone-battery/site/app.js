// Roast of Your Phone Battery ("Kitchen Timer"). Every visual is a pure function of t (window.__seek).
// Through-line: the heat dial (top right) and the googly-eyed battery mascot. Scene times and word cues come from timing.js.
(function(){
var TM=window.TM,S=TM.S,C=TM.CUE,END=TM.END,TR=.3,NS='http://www.w3.org/2000/svg',BED=window.BED,IC=window.IC;
var $=function(id){return document.getElementById(id)};
function cl(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))}
var E={o3:function(x){return 1-Math.pow(1-x,3)},o5:function(x){return 1-Math.pow(1-x,5)},io:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
 bk:function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)},bo:function(x){var n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375}};
function seg(t,a,b){return cl((t-a)/(b-a))}
function lerp(a,b,u){return a+(b-a)*u}
function ent(el,t,t0,d,o){o=o||{};var u=E.o5(seg(t,t0,t0+d));el.style.opacity=u;el.style.transform='translate('+((o.x||0)*(1-u))+'px,'+((o.y==null?24:o.y)*(1-u))+'px) scale('+(1-(1-(o.s||1))*(1-u))+') rotate('+((o.r||0)*(1-u)+(o.rr||0))+'deg)'}
function pop(el,t,t0,d,r){var u=seg(t,t0,t0+d);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u>0?E.bk(u):.3)+')'}
function slam(el,t,t0,r){var u=seg(t,t0,t0+.22);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u<1?lerp(2.2,1,E.o3(u)):1+.04*Math.max(0,1-(t-t0-.22)/.2))+')'}
function mk(html){var d=document.createElement('div');d.className='sc';d.innerHTML=html;$('scenes').appendChild(d);return d}
function q(sc,s){return sc.querySelector(s)}
function sv(tag,at,p){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(p)p.appendChild(e);return e}
function ic(n,sz,col,sty){return '<span class="ic" style="width:'+sz+'px;height:'+sz+'px;color:'+col+';'+(sty||'')+'">'+(IC[n]||'')+'</span>'}
function rnd(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
var head=function(eye,h,dot){return '<div class="eye" data-b="eye"><i style="background:'+(dot||'var(--heat)')+'"></i>'+eye+'</div><div class="h" data-b="h">'+h+'</div>'};
var head2=function(h){return '<div class="h h2" data-b="h2" style="opacity:0">'+h+'</div>'};
function swapH(el,t,t0,t1){var a=q(el,'.h'),b=q(el,'.h2');var u=E.o5(seg(t,t1+.06,t1+.36));if(t<t1){ent(a,t,t0,.35);b.style.opacity=0}else{a.style.opacity=1-seg(t,t1,t1+.08);a.style.transform='';b.style.opacity=u;b.style.transform='translateY('+(18*(1-u))+'px) scale('+(1+.06*(1-u))+')'}}
var EV=[];function ev(t,k){EV.push([+t.toFixed(3),k])}

// ---- mascot: googly-eyed battery (viewBox 200x300), all state set per frame -------------------------------------------
var MID=0;
function mascot(parent,w){var id='m'+(MID++),d=document.createElement('div');d.className='mas';d.style.width=w+'px';d.style.height=(w*1.5)+'px';parent.appendChild(d);
 var s=sv('svg',{viewBox:'0 0 200 300',width:w,height:w*1.5,overflow:'visible'},d);
 var df=sv('defs',{},s),cp=sv('clipPath',{id:id+'c'},df);sv('rect',{x:40,y:44,width:120,height:226,rx:20},cp);
 var g=sv('g',{},s);
 sv('rect',{x:78,y:8,width:44,height:28,rx:7,fill:'#141414'},g);
 sv('rect',{x:28,y:30,width:144,height:252,rx:30,fill:'#fffaf0',stroke:'#141414','stroke-width':9},g);
 var fill=sv('rect',{x:40,y:44,width:120,height:226,fill:'#1fbf5b','clip-path':'url(#'+id+'c)'},g);
 var shine=sv('rect',{x:52,y:60,width:14,height:150,rx:7,fill:'#fff',opacity:.35},g);
 var pct=sv('text',{x:100,y:256,'text-anchor':'middle','font-family':'Unb','font-weight':900,'font-size':30,fill:'#141414'},g);
 var ch=[sv('ellipse',{cx:58,cy:158,rx:13,ry:8,fill:'#ff7aa8',opacity:.0},g),sv('ellipse',{cx:142,cy:158,rx:13,ry:8,fill:'#ff7aa8',opacity:.0},g)];
 var eyes=[],pup=[];[[72,116],[128,116]].forEach(function(p){var eg=sv('g',{},g);sv('circle',{cx:p[0],cy:p[1],r:25,fill:'#fff',stroke:'#141414','stroke-width':6},eg);pup.push(sv('circle',{cx:p[0],cy:p[1],r:10,fill:'#141414'},eg));eyes.push([eg,p])});
 var brow=sv('path',{fill:'none',stroke:'#141414','stroke-width':7,'stroke-linecap':'round'},g);
 var mouth=sv('path',{fill:'none',stroke:'#141414','stroke-width':7,'stroke-linecap':'round','stroke-linejoin':'round'},g);
 var sweat=[sv('path',{d:'M0 0 C-7 10 -9 16 0 20 C9 16 7 10 0 0Z',fill:'#7cc7ff',stroke:'#141414','stroke-width':3},g),sv('path',{d:'M0 0 C-7 10 -9 16 0 20 C9 16 7 10 0 0Z',fill:'#7cc7ff',stroke:'#141414','stroke-width':3},g)];
 var belt=sv('g',{opacity:0},g);sv('rect',{x:22,y:196,width:156,height:24,rx:4,fill:'#7a4a24',stroke:'#141414','stroke-width':4},belt);var buck=sv('rect',{x:86,y:192,width:28,height:32,rx:4,fill:'#e8c15a',stroke:'#141414','stroke-width':4},belt);
 var gl=sv('g',{opacity:0},g);sv('rect',{x:40,y:98,width:62,height:40,rx:12,fill:'#141414'},gl);sv('rect',{x:98,y:98,width:62,height:40,rx:12,fill:'#141414'},gl);sv('rect',{x:96,y:108,width:8,height:6,fill:'#141414'},gl);sv('path',{d:'M50 108 L66 108',stroke:'#fff','stroke-width':4,opacity:.6},gl);
 var MO={grin:'M66 170 Q100 210 134 170',smile:'M76 178 Q100 198 124 178',worry:'M74 194 Q100 174 126 194',wavy:'M66 186 q9 -10 17 0 t17 0 t17 0 t17 0',o:'M88 186 a12 14 0 1 0 24 0 a12 14 0 1 0 -24 0',smug:'M78 186 Q104 198 126 176',flat:'M80 186 L120 186'};
 var BR={n:'M52 86 L90 80 M110 80 L148 86',up:'M50 76 L92 74 M108 74 L150 76',worry:'M54 90 L92 80 M108 80 L146 90',smug:'M50 74 L92 80 M108 90 L150 88'};
 return {el:d,set:function(o,t){var tf='translate('+o.x+'px,'+o.y+'px)';d.style.left='0';d.style.top='0';d.style.transformOrigin='50% 60%';
  d.style.transform=tf+' rotate('+(o.rot||0)+'deg) scale('+((o.s||1)*(1+(o.bloat||0)*.22))+','+((o.s||1)*(o.sy==null?1:o.sy))+')';d.style.opacity=o.op==null?1:o.op;
  var lv=cl(o.level==null?1:o.level);fill.setAttribute('y',44+226*(1-lv));fill.setAttribute('height',226*lv);fill.setAttribute('fill',o.col||'#1fbf5b');
  pct.textContent=o.pct==null?'':o.pct;pct.setAttribute('fill',lv>.25?'#fffaf0':'#141414');
  var lk=o.look||[Math.sin(t*1.3)*.5,Math.sin(t*.9+1)*.3],bl=1;var bp=(t+(o.ph||0))%3.4;if(bp<.14)bl=Math.abs(bp-.07)/.07;
  eyes.forEach(function(e,i){e[0].setAttribute('transform','translate(0,'+(e[1][1]*(1-bl))+') scale(1,'+Math.max(.08,bl)+')');pup[i].setAttribute('cx',e[1][0]+lk[0]*10);pup[i].setAttribute('cy',e[1][1]+lk[1]*10)});
  mouth.setAttribute('d',MO[o.mouth||'smile']);mouth.setAttribute('fill',o.mouth==='o'?'#141414':'none');brow.setAttribute('d',BR[o.brow||'n']);
  var sw=o.sweat||0;sweat.forEach(function(p,i){var c=((t*.8+i*.5)%1);p.setAttribute('transform','translate('+(i?34:166)+','+(i?132:88)+(c*40)+')');p.setAttribute('opacity',sw*(1-c))});
  ch.forEach(function(c){c.setAttribute('opacity',(o.blush||0)*.8)});
  belt.setAttribute('opacity',o.belt||0);buck.setAttribute('transform','translate(0,'+(o.pop||0)*-120+') rotate('+(o.pop||0)*200+' 100 208)');gl.setAttribute('opacity',o.glasses||0)}}}

// ---- shared layers: bed (Blender frames), steam, heat glow, dial -----------------------------------------------------
var bw=$('bedw'),bimg=[];for(var i=0;i<9;i++){var im=document.createElement('img');im.src='3d/bed_a'+i+'.png';bw.appendChild(im);bimg.push(im)}
var bedB=new Image();bedB.src='3d/bed_b.png';
function bedFrame(f){f=cl(f,0,8);var a=Math.floor(f),u=f-a;bimg.forEach(function(im,i){im.style.opacity=i===a?1:(i===a+1?u:0)});return f}
function bedPt(f,k){var A=BED.A,a=Math.floor(cl(f,0,8)),b=Math.min(8,a+1),u=cl(f,0,8)-a,p=A[a][k],r=A[b][k];return [160+lerp(p[0],r[0],u)*760/820,372+lerp(p[1],r[1],u)*649/700]}
function pillowF(t){if(t<S[4])return 8*E.io(seg(t,.35,.95));return 8-8*E.bo(seg(t,C.pillow2,C.pillow2+.5))}
var st=$('steam'),hg=sv('defs',{},st),rg=sv('radialGradient',{id:'hotg'},hg);sv('stop',{offset:'0','stop-color':'#ff6a2b','stop-opacity':.9},rg);sv('stop',{offset:'.45','stop-color':'#ff8a3a','stop-opacity':.35},rg);sv('stop',{offset:'1','stop-color':'#ff6a2b','stop-opacity':0},rg);
var glow=sv('ellipse',{rx:200,ry:120,fill:'url(#hotg)',opacity:0},st);
var wisps=[];for(var i=0;i<4;i++)wisps.push(sv('path',{d:'M0 0 c-16 -26 16 -44 0 -70 c-16 -26 16 -44 0 -70',fill:'none',stroke:'#9b928a','stroke-width':9,'stroke-linecap':'round',opacity:0},st));
function steam(x,y,a,t){wisps.forEach(function(w,i){var c=(t*.62+i*.25)%1;w.setAttribute('transform','translate('+(x-60+i*40+Math.sin(t*2+i)*8)+','+(y-c*90)+') scale('+(.7+c*.5)+')');w.setAttribute('opacity',a*Math.sin(c*Math.PI)*.75)})}
// heat dial: OFF / LOW / MED / OVEN / ROAST
var LV={OFF:[-135,'#1e9bff',0],LOW:[-60,'#ff9a4a',.35],MED:[0,'#ff6a2b',.55],OVEN:[62,'#e8401f',.82],ROAST:[128,'#d7261e',1]};
var DS=[[0,'LOW'],[S[3],'MED'],[C.oven,'OVEN'],[C.roasting,'ROAST'],[C.fix,'OFF']];
var lbl={OFF:'OFF',LOW:'LOW',MED:'MED',OVEN:TM.LADDER.rung2,ROAST:TM.LADDER.rung3};
var dl=$('dial');sv('circle',{cx:71,cy:71,r:64,fill:'#fffaf0',stroke:'#141414','stroke-width':6},dl);
for(var k=0;k<11;k++){var a=(-135+k*27)*Math.PI/180;sv('line',{x1:71+Math.sin(a)*50,y1:71-Math.cos(a)*50,x2:71+Math.sin(a)*58,y2:71-Math.cos(a)*58,stroke:'#141414','stroke-width':3},dl)}
var arc=sv('path',{fill:'none','stroke-width':9,'stroke-linecap':'round'},dl);
var knob=sv('g',{},dl);sv('circle',{cx:71,cy:71,r:36,fill:'#141414'},knob);sv('rect',{x:67,y:38,width:8,height:30,rx:4,fill:'#fffaf0'},knob);
var lbg=sv('rect',{x:6,y:146,width:130,height:38,rx:19},dl),ltx=sv('text',{x:71,y:173,'text-anchor':'middle','font-family':'GM','font-weight':600,'font-size':21,fill:'#fffaf0','letter-spacing':'1.5'},dl);
function dialAt(t){var i=0;for(var k=0;k<DS.length;k++)if(t>=DS[k][0])i=k;var cur=LV[DS[i][1]],prv=i?LV[DS[i-1][1]]:cur,u=i?E.bk(seg(t,DS[i][0],DS[i][0]+.4)):1;
 return {ang:lerp(prv[0],cur[0],u),col:cur[1],heat:lerp(prv[2],cur[2],cl(u)),name:DS[i][1]}}
function drawDial(t){var d=dialAt(t),w=d.heat>.7?Math.sin(t*23)*2*d.heat:0,a=d.ang+w;knob.setAttribute('transform','rotate('+a+' 71 71)');
 var a0=-135*Math.PI/180,a1=a*Math.PI/180,r=44,big=(a-(-135))>180?1:0;arc.setAttribute('d','M'+(71+Math.sin(a0)*r)+' '+(71-Math.cos(a0)*r)+' A'+r+' '+r+' 0 '+big+' 1 '+(71+Math.sin(a1)*r)+' '+(71-Math.cos(a1)*r));arc.setAttribute('stroke',d.col);
 lbg.setAttribute('fill',d.col);ltx.textContent=lbl[d.name];
 var cool=(t>=S[7]-.2&&t<S[9])?1:(t>=S[9]?.45:0);$('warm').style.opacity=(d.heat*(1-cool)*(d.heat>.5?.72+.28*Math.sin(t*3.4):1)).toFixed(3);$('cool').style.opacity=(cool*E.o3(seg(t,S[7]-.2,S[7]+.3))).toFixed(3);return d}
DS.slice(1).forEach(function(d){ev(d[0],'click')});

// ---- scenes ---------------------------------------------------------------------------------------------------------
var upd=[],M=[];
// 0 hook: under the pillow, then sarcastic congrats ------------------------------------------------------------------
(function(){var s0=S[0],el=mk(head('// 2:47 AM · STILL CHARGING','UNDER THE <span>PILLOW</span>?')+head2('<span class="m">CONGRATS.</span>')+
 '<div class="tag" id="nc" data-b="nc" style="left:110px;top:290px;background:var(--ink)">NOT A COMPLIMENT</div>'+
 '<div class="chip" id="c1" data-b="c1" style="left:150px;top:1050px">'+ic('moon-stars',30,'#141414','vertical-align:-6px;margin-right:10px')+'2:47 AM</div>'+
 '<div class="chip" id="c2" data-b="c2" style="left:420px;top:1050px;border-color:var(--mag);color:var(--mag);box-shadow:5px 5px 0 var(--mag)">CHARGING · 100%</div>');
 var m=mascot(el,130);M[0]=m;
 upd[0]=function(t){var l=t-s0;ent(q(el,'.eye'),l,-1,.3,{y:0});swapH(el,t,-1,C.congrats);ent(q(el,'#nc'),t,C.congrats+.35,.3,{x:-30,y:0});if(t<C.congrats+.3)q(el,'#nc').style.opacity=0;
  pop(q(el,'#c1'),t,.9,.35,-2);pop(q(el,'#c2'),t,C.night,.35,2);
  var f=pillowF(t),p=bedPt(f,'phone'),u=E.o5(seg(t,.55,1.05));
  m.set({x:p[0]+90,y:p[1]-190+60*(1-u),op:u,level:1,col:'#e0218a',pct:'100%',mouth:t<C.congrats?'o':'worry',brow:t<C.congrats?'up':'worry',sweat:u,look:t<C.congrats?[-.6,.3]:[0,0],ph:.3},t)}
 ev(.35,'whoosh');ev(.6,'boing');ev(.9,'pop');ev(C.night,'pop');ev(C.congrats,'party')})();
// 1 slow cooking --------------------------------------------------------------------------------------------------------
(function(){var s0=S[1],el=mk(head('// LOW HEAT · ALL NIGHT LONG','YOU\'RE <span>SLOW-COOKING</span> IT')+
 '<div class="stamp" id="st" data-b="st" style="left:150px;top:860px;color:var(--heat);font-size:44px">EVERY. SINGLE. NIGHT.</div>'+
 '<div class="chip" id="cn" data-b="cn" style="left:150px;top:1050px;font-variant-numeric:tabular-nums">NIGHTS AT 100% THIS YEAR: <b id="nn">1</b></div>');
 var m=mascot(el,130);M[1]=m;
 upd[1]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.35);slam(q(el,'#st'),t,C.every,-5);if(t<C.every)q(el,'#st').style.opacity=0;
  ent(q(el,'#cn'),t,s0+.3,.35,{y:20});q(el,'#nn').textContent=Math.round(lerp(1,365,E.io(seg(t,C.every,C.single+.9))));
  var p=bedPt(8,'phone');m.set({x:p[0]+90,y:p[1]-190,level:1,col:'#e0218a',pct:'100%',mouth:'wavy',brow:'worry',sweat:1,blush:.3,ph:1.1},t)}
 ev(C.slow,'sizzle');ev(C.every,'stamp')})();
// 2 two worst enemies ---------------------------------------------------------------------------------------------------
(function(){var s0=S[2];
 function wanted(id,x,r,icn,col,name,no,det){return '<div class="card" id="'+id+'" data-b="'+id+'" style="left:'+x+'px;top:400px;width:370px;height:560px;transform:rotate('+r+'deg);overflow:hidden">'+
  '<div style="background:var(--ink);color:var(--paper);font:900 44px/76px Unb;text-align:center;letter-spacing:.06em">WANTED</div>'+
  '<div style="text-align:center;margin-top:24px">'+ic(icn,150,col)+'</div><div style="font:600 20px GM;letter-spacing:.16em;text-align:center;color:var(--dim);margin-top:8px">'+no+'</div>'+
  '<div style="font:800 40px/1.05 Unb;text-align:center;color:'+col+';margin-top:6px;letter-spacing:-.02em">'+name+'</div>'+
  '<div style="font:600 21px/1.4 GM;margin:16px 26px 0;text-align:center">'+det+'</div></div>'}
 var el=mk(head('// ENEMY #1 HEAT · #2 FULL CHARGE','ITS TWO WORST <span class="m">ENEMIES</span>')+
  wanted('w1',130,-2,'thermometer-hot','var(--heat)','HEAT','ENEMY #1','Above 35 °C can permanently damage capacity.<br>— Apple')+
  wanted('w2',534,2,'battery-full','var(--mag)','FULL<br>CHARGE','ENEMY #2','Sitting at 100% for hours ages it faster.<br>— Battery University')+
  '<div class="stamp" id="rf" data-b="rf" style="left:300px;top:1000px;color:var(--green);font-size:46px">REAL FACT</div>'+
  '<div class="src" id="s2" data-b="src" style="top:1110px">apple.com/batteries/maximizing-performance · batteryuniversity.com BU-808</div>');
 upd[2]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.35);ent(q(el,'#w1'),t,C.heat,.4,{x:-80,y:0,r:-8,rr:-2});ent(q(el,'#w2'),t,C.full,.4,{x:80,y:0,r:8,rr:2});
  slam(q(el,'#rf'),t,C.enemies,-4);if(t<C.enemies)q(el,'#rf').style.opacity=0;ent(q(el,'#s2'),t,C.enemies+.4,.3,{y:0})}
 ev(C.heat,'slap');ev(C.full,'slap');ev(C.enemies,'stamp')})();
// 3 buffet ---------------------------------------------------------------------------------------------------------------
(function(){var s0=S[3],el=mk(head('// ANALOGY · STUFFED, THEN LYING DOWN','<span class="m">100%</span> FOR HOURS')+head2('BUFFET <span class="m">COMA</span>')+
 '<svg id="pl" data-b="pl" style="position:absolute;left:150px;top:800px;width:766px;height:190px" viewBox="0 0 780 190"><ellipse cx="390" cy="96" rx="370" ry="84" fill="#fffaf0" stroke="#141414" stroke-width="8"/><ellipse cx="390" cy="92" rx="270" ry="54" fill="none" stroke="#e7e0d2" stroke-width="8"/></svg>'+
 '<div id="fk" data-b="fk" style="position:absolute;left:150px;top:610px">'+ic('fork-knife',130,'#141414')+'</div>'+
 '<div class="tag" id="an" data-b="an" style="left:118px;top:372px;background:var(--ink)">ANALOGY</div>'+'<div id="sg" data-b="sg" style="position:absolute;left:300px;top:362px;width:620px;padding:12px 0;text-align:center;background:var(--mag);color:#fffaf0;border:5px solid var(--ink);border-radius:14px;font:600 25px GM;letter-spacing:.08em;box-shadow:6px 6px 0 var(--ink)">ALL-YOU-CAN-CHARGE · OPEN ALL NIGHT</div>'+
 '<div class="chip" id="hc" data-b="hc" style="left:150px;top:1030px;font-variant-numeric:tabular-nums;border-color:var(--mag);box-shadow:5px 5px 0 var(--mag)">HOURS AT 100%: <b id="hh">0</b> · OVERNIGHT</div>'+
 '<div class="src" id="s3" data-b="src" style="top:1112px">Battery University BU-808: a battery held at full charge ages faster, worse when warm.</div>');
 var m=mascot(el,250);M[3]=m;
 upd[3]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});swapH(el,t,s0+.05,C.lying);pop(q(el,'#an'),t,s0+.25,.35,-3);ent(q(el,'#sg'),t,s0+.4,.4,{y:-30});var sg=q(el,'#sg');if(t>s0+.8){var bl=Math.floor((t-s0)*1.6)%2;sg.style.boxShadow=bl?'6px 6px 0 #ff6a2b':'6px 6px 0 #141414';sg.style.background=bl?'#ff6a2b':'#e0218a'}ent(q(el,'#pl'),t,s0+.1,.4,{y:40});ent(q(el,'#fk'),t,s0+.35,.4,{x:-40,y:0});
  ent(q(el,'#hc'),t,s0+.3,.35,{y:20});ent(q(el,'#s3'),t,C.buffet+.2,.3,{y:0});q(el,'#hh').textContent=Math.round(lerp(0,8,E.io(seg(t,C.hours,C.lying+.6))));
  var bl=E.o5(seg(t,C.buffet-.1,C.buffet+.35)),ly=E.bk(seg(t,C.lying,C.lying+.55)),bp=seg(t,C.buffet+.15,C.buffet+.9);
  m.set({x:470+lerp(0,20,ly),y:lerp(470,560,ly)+(1-E.o5(seg(t,s0+.15,s0+.6)))*-140,op:E.o5(seg(t,s0+.15,s0+.4)),rot:lerp(0,-90,ly),level:1,col:'#e0218a',pct:'100%',bloat:bl+.04*Math.sin(t*5)*bl,belt:1,pop:bp,
   mouth:t<C.buffet?'smile':(t<C.lying?'o':'wavy'),brow:t<C.buffet?'n':'worry',blush:bl,ph:2},t)}
 ev(C.hours,'tick');ev(C.buffet,'pop');ev(C.buffet+.2,'boing');ev(C.lying,'thud')})();
// 4 the oven ------------------------------------------------------------------------------------------------------------
(function(){var s0=S[4],L2=TM.LADDER.rung2;
 var el=mk(head('// HEAT STACKS UP','STACK THE <span>HEAT</span>')+head2('THAT\'S AN <span class="r">'+L2+'</span>')+
 '<div id="gp" data-b="gp" style="position:absolute;left:0;top:0">'+ic('game-controller',120,'#ff6a2b')+'</div>'+
 '<div id="cs" data-b="cs" style="position:absolute;left:0;top:0;width:96px;height:170px;border:16px solid #141414;border-radius:26px;background:rgba(255,106,43,.25)"></div>'+
 '<svg id="ov" data-b="ov" style="position:absolute;left:152px;top:400px;width:764px;height:626px;overflow:visible" viewBox="0 0 780 660" preserveAspectRatio="none"><rect x="14" y="14" width="752" height="632" rx="46" fill="none" stroke="#141414" stroke-width="28"/><rect x="62" y="96" width="656" height="510" rx="26" fill="rgba(255,106,43,.22)" stroke="#141414" stroke-width="10"/><rect x="230" y="38" width="320" height="30" rx="15" fill="#d7261e" stroke="#141414" stroke-width="6"/></svg>'+
 '<div class="chip" id="k1" data-b="k1" style="left:150px;top:1050px;border-color:var(--heat);box-shadow:5px 5px 0 var(--heat)">+ GAMING</div><div class="chip" id="k2" data-b="k2" style="left:375px;top:1050px;border-color:var(--heat);box-shadow:5px 5px 0 var(--heat)">+ THICK CASE</div><div class="chip" id="k3" data-b="k3" style="left:650px;top:1050px;border-color:var(--red);box-shadow:5px 5px 0 var(--red)">+ PILLOW</div>'+
 '<div id="hm" data-b="hm" style="position:absolute;left:150px;top:1140px;width:760px;height:28px;border:4px solid #141414;border-radius:14px;background:var(--paper);overflow:hidden"><div id="hmf" style="height:100%;width:0;background:linear-gradient(90deg,#ff9a4a,#d7261e)"></div></div>'+
 '<div id="hml" data-b="hml" style="position:absolute;left:150px;top:1180px;width:760px;font:600 17px GM;color:var(--dim);letter-spacing:.06em;white-space:nowrap">HEAT · ILLUSTRATIVE<span style="position:absolute;left:400px">▲ 35 °C: APPLE\'S LIMIT</span></div><div id="hmk" style="position:absolute;left:612px;top:1132px;width:5px;height:44px;background:#141414"></div>');
 var m=mascot(el,120);M[4]=m;
 upd[4]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});swapH(el,t,s0+.05,C.oven);
  var f=pillowF(t),p=bedPt(f,'phone');
  var gu=E.bo(seg(t,C.gaming,C.gaming+.55)),gp=q(el,'#gp');gp.style.opacity=t>=C.gaming?1:0;gp.style.transform='translate('+(p[0]-200)+'px,'+(lerp(-300,p[1]-80,gu))+'px) rotate('+lerp(-40,-12,gu)+'deg)';
  var cu=E.bo(seg(t,C.case,C.case+.55)),cs=q(el,'#cs');cs.style.opacity=t>=C.case?1:0;cs.style.transform='translate('+(p[0]-48)+'px,'+(lerp(-300,p[1]-95,cu))+'px) rotate('+lerp(30,-12,cu)+'deg)';
  pop(q(el,'#k1'),t,C.gaming,.35,-2);pop(q(el,'#k2'),t,C.case,.35,1);pop(q(el,'#k3'),t,C.pillow2,.35,-1);
  var hv=.3+.12*E.o3(seg(t,C.gaming,C.gaming+.6))+.15*E.o3(seg(t,C.case,C.case+.6))+.33*E.o3(seg(t,C.pillow2,C.pillow2+.8));q(el,'#hmf').style.width=(hv*100+(hv>.8?Math.sin(t*9)*1.2:0))+'%';
  ent(q(el,'#hm'),l,.2,.35,{y:16});ent(q(el,'#hml'),l,.3,.35,{y:10});q(el,'#hmk').style.opacity=q(el,'#hm').style.opacity;
  var ov=q(el,'#ov'),ou=E.bo(seg(t,C.oven-.05,C.oven+.4));ov.style.opacity=t>=C.oven-.05?1:0;ov.style.transform='translateY('+lerp(-700,0,ou)+'px)';
  m.set({x:p[0]+110,y:p[1]-170,op:E.o5(seg(t,s0,s0+.35))*(1-.0),level:1,col:'#e0218a',pct:'100%',mouth:t<C.pillow2?'worry':'o',brow:'worry',sweat:1,blush:.5,ph:.7,look:t<C.pillow2?[-.7,.6]:[0,-.6]},t)}
 ev(C.gaming,'drop');ev(C.case,'drop');ev(C.pillow2,'thud');ev(C.oven,'ding');ev(C.oven-.05,'slam')})();
// 5 the lab numbers ----------------------------------------------------------------------------------------------------
(function(){var s0=S[5];var COL=[[25,40,96,'#1fbf5b',C.twentyfive,C.ninetysix,1],[25,100,80,'#e0218a',C.left+.2,C.left+1.1,0],[40,40,85,'#ff9a4a',C.left+.4,C.left+1.3,0],[40,100,65,'#d7261e',C.forty,C.sixtyfive,1]];
 var html='';COL.forEach(function(c,i){var x=140+i*195;html+='<div id="b'+i+'" data-b="b'+i+'" style="position:absolute;left:'+x+'px;top:430px;width:170px;height:560px">'+
  '<div style="position:absolute;left:55px;top:0;width:60px;height:26px;border-radius:8px;background:#141414"></div><div style="position:absolute;left:0;top:22px;width:170px;height:500px;border:7px solid #141414;border-radius:26px;background:var(--paper);overflow:hidden"><div class="f" style="position:absolute;left:0;bottom:0;width:100%;height:100%;background:#1fbf5b"></div></div>'+
  '<div class="v" style="position:absolute;left:0;top:60px;width:170px;text-align:center;font:900 52px Unb;color:#141414;font-variant-numeric:tabular-nums">100</div>'+
  '<div style="position:absolute;left:0;top:534px;width:170px;text-align:center;font:600 21px/1.25 GM">'+c[0]+' °C<br>at '+c[1]+'%</div></div>'});
 var el=mk(head('// 1-YEAR LAB STORAGE TEST','CAPACITY AFTER <span class="r">1 YEAR</span>')+html+
  '<div id="sw5" style="position:absolute;left:140px;top:452px;width:150px;height:500px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0));mix-blend-mode:screen;pointer-events:none"></div>'+'<svg id="rc" style="position:absolute;left:705px;top:420px;width:220px;height:200px;overflow:visible" viewBox="0 0 220 200"></svg>'+
  '<div class="src" id="s5" data-b="src" style="top:1110px">Battery University BU-808: estimated capacity after one year of storage at each temperature and charge level.</div>');
 var gen=rough.generator(),dd=gen.ellipse(110,100,200,150,{seed:7,roughness:1.4,stroke:'#d7261e',strokeWidth:7}),RP=gen.toPaths(dd).map(function(p){var e=sv('path',{d:p.d,fill:'none',stroke:'#d7261e','stroke-width':7,'stroke-linecap':'round'},q(el,'#rc'));var L=e.getTotalLength();e.style.strokeDasharray=L;e.style.strokeDashoffset=L;return [e,L]});
 upd[5]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.35);
  COL.forEach(function(c,i){var b=q(el,'#b'+i),u=E.io(seg(t,c[4],c[5])),v=lerp(100,c[2],u);ent(b,l,.15+i*.1,.4,{y:40});if(l>.6)b.style.opacity=c[6]?1:lerp(1,.5,seg(t,C.forty,C.forty+.4));
   var f=q(b,'.f');f.style.height=v+'%';f.style.background=u>0?c[3]:'#1fbf5b';q(b,'.v').textContent=Math.round(v);
   if(i===3&&u>=1){b.style.transform='translateX('+(Math.sin(t*30)*1.5*(1-seg(t,c[5],c[5]+.6)))+'px)'}});
  var sw=q(el,'#sw5'),sp=((t-s0)/1.7)%1;sw.style.transform='translateX('+(sp*760-60)+'px)';sw.style.opacity=l>.9?Math.sin(sp*Math.PI):0;var ru=E.io(seg(t,C.sixtyfive+.15,C.sixtyfive+.75));RP.forEach(function(p){p[0].style.strokeDashoffset=p[1]*(1-ru)});ent(q(el,'#s5'),l,.6,.3,{y:0});
  var p3=[140+3*195+85,430+22+500*(1-.65)];steamLab=[p3[0],p3[1],seg(t,C.sixtyfive,C.sixtyfive+.4)]}
 ev(C.forty,'drain');ev(C.sixtyfive,'sizzle');ev(C.twentyfive,'drain');ev(C.ninetysix,'ding2')})();
var steamLab=null;
// 6 roasting -------------------------------------------------------------------------------------------------------------
(function(){var s0=S[6],L3=TM.LADDER.rung3;var fl='';for(var i=0;i<7;i++)fl+='<div class="fl" style="position:absolute;left:'+(205+i*95)+'px;top:820px;transform-origin:50% 100%">'+ic('fire',110,i%2?'#ff6a2b':'#d7261e')+'</div>';
 var el=mk(head('// HEAT + 100% = THE WORST COMBO','NOT CHARGING. <span class="r">ROASTING.</span>')+
 '<div id="rod" data-b="rod" style="position:absolute;left:150px;top:600px;width:760px;height:16px;border-radius:8px;background:#141414"></div><div style="position:absolute;left:170px;top:600px;width:14px;height:330px;background:#141414;border-radius:7px"></div><div style="position:absolute;left:876px;top:600px;width:14px;height:330px;background:#141414;border-radius:7px"></div>'+fl+
 '<div class="stamp" id="rs" data-b="rs" style="left:400px;top:400px;color:var(--red)">'+L3+'</div>'+
 '<div id="qt" data-b="qt" style="position:absolute;left:110px;top:960px;width:810px;font:700 30px/1.35 Inter">“The worst situation is keeping a fully charged battery at elevated temperatures.”<div style="font:600 19px GM;color:var(--dim);margin-top:8px;letter-spacing:.04em">— BATTERY UNIVERSITY, BU-808</div></div>');
 var m=mascot(el,170);M[6]=m;
 upd[6]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.35);slam(q(el,'#rs'),t,C.roasting,-6);if(t<C.roasting)q(el,'#rs').style.opacity=0;ent(q(el,'#qt'),l,.4,.4,{y:20});
  [].forEach.call(el.querySelectorAll('.fl'),function(f,i){f.style.transform='scale('+(.85+.18*Math.sin(t*11+i*1.7))+','+(.8+.3*Math.abs(Math.sin(t*7+i)))+')'});
  var th=(t-s0)*5.2,cs=Math.cos(th);m.set({x:455,y:480,sy:cs,level:.9,col:'#d7261e',pct:'',mouth:'o',brow:'worry',sweat:1,blush:1,ph:.2},t)}
 ev(s0+.1,'whoosh');ev(C.roasting,'stamp');ev(C.roasting+.05,'sizzle')})();
// 7 the fix: 80% limit -------------------------------------------------------------------------------------------------
(function(){var s0=S[7];var ticks='';[80,85,90,95,100].forEach(function(v,i){ticks+='<div style="position:absolute;left:'+(40+i*170-20)+'px;top:198px;width:40px;text-align:center;font:600 20px GM;color:var(--dim)">'+v+'</div>'});
 var el=mk(head('// SETTINGS › BATTERY › CHARGING','THE FIX: <span class="c">80% LIMIT</span>','var(--cyan)')+
 '<div class="card" id="pn" data-b="pn" style="left:130px;top:390px;width:780px;height:420px;overflow:hidden">'+
  '<div style="height:66px;background:#141414;color:#fffaf0;font:600 22px/66px GM;padding-left:24px;letter-spacing:.06em">'+ic('gear-six',28,'#fffaf0','vertical-align:-6px;margin-right:10px')+'BATTERY › CHARGING<span style="float:right;margin-right:22px;color:#9fd2ff">ILLUSTRATIVE</span></div>'+
  '<div style="position:absolute;left:40px;top:96px;font:700 34px Inter">Charge Limit</div><div id="pv" style="position:absolute;right:40px;top:92px;font:900 42px Unb;color:var(--cyan);font-variant-numeric:tabular-nums">100%</div>'+
  '<div style="position:absolute;left:40px;top:166px;width:700px;height:14px;border-radius:7px;background:#e7e0d2"></div><div id="sf" style="position:absolute;left:40px;top:166px;height:14px;border-radius:7px;background:var(--cyan)"></div><div id="kn" style="position:absolute;top:150px;width:46px;height:46px;border-radius:50%;background:#fffaf0;border:6px solid #141414"></div>'+ticks+
  '<div style="position:absolute;left:40px;top:262px;width:700px;border-top:3px solid #e7e0d2"></div>'+
  '<div style="position:absolute;left:40px;top:290px;font:700 30px Inter">Optimized Battery Charging</div><div style="position:absolute;left:40px;top:336px;font:600 20px GM;color:var(--dim)">iPhone 14 and earlier</div>'+
  '<div id="tg" style="position:absolute;right:40px;top:296px;width:96px;height:54px;border-radius:27px;background:#ccc;border:4px solid #141414"><div id="td" style="position:absolute;top:4px;left:4px;width:38px;height:38px;border-radius:50%;background:#fffaf0;border:3px solid #141414"></div></div></div>'+
 '<div class="chip" id="g1" data-b="g1" style="left:130px;top:850px;border-color:var(--cyan);box-shadow:5px 5px 0 var(--cyan)">'+ic('apple-logo',26,'#141414','vertical-align:-4px;margin-right:8px')+'IPHONE 15+ · CHARGE LIMIT</div>'+
 '<div class="chip" id="g2" data-b="g2" style="left:130px;top:930px;border-color:var(--cyan);box-shadow:5px 5px 0 var(--cyan)">'+ic('apple-logo',26,'#141414','vertical-align:-4px;margin-right:8px')+'OLDER IPHONES · OPTIMIZED</div>'+
 '<div class="chip" id="g3" data-b="g3" style="left:130px;top:1010px;border-color:var(--green);box-shadow:5px 5px 0 var(--green)">'+ic('android-logo',26,'#141414','vertical-align:-4px;margin-right:8px')+'MANY ANDROIDS · "PROTECT BATTERY"</div>'+
 '<div class="src" id="s7" data-b="src" style="top:1110px">Apple Support 108055 · Android: the setting name and limit vary by phone</div>');
 upd[7]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.35);ent(q(el,'#pn'),l,.1,.4,{y:40});
  var u=E.bk(seg(t,C.eighty,C.eighty+.5)),v=lerp(100,80,u),x=40+(v-80)/20*680;q(el,'#kn').style.left=(x-23)+'px';q(el,'#sf').style.width=(x-40)+'px';q(el,'#pv').textContent=Math.round(cl(v,80,100))+'%';
  var tu=E.o5(seg(t,C.limit+.3,C.limit+.6));q(el,'#td').style.left=(4+tu*42)+'px';q(el,'#tg').style.background=tu>.5?'#1fbf5b':'#ccc';
  ent(q(el,'#g1'),t,C.eighty+.2,.35,{x:-40,y:0});ent(q(el,'#g2'),t,C.limit+.3,.35,{x:-40,y:0});ent(q(el,'#g3'),t,C.limit+.9,.35,{x:-40,y:0});ent(q(el,'#s7'),t,C.limit+1.1,.3,{y:0})}
 ev(C.eighty,'slide');ev(C.limit+.35,'toggle');ev(C.eighty+.2,'pop')})();
// 8 sleep somewhere cool -> happy battery ------------------------------------------------------------------------------
(function(){var s0=S[8];var sn='';for(var i=0;i<6;i++)sn+='<div class="sn" style="position:absolute;left:0;top:0">'+ic('snowflake',44+(i%3)*14,'#1e9bff')+'</div>';
 var el=mk(head('// IDEAL ZONE 16–22 °C (APPLE)','LET IT SLEEP <span class="c">COOL</span>','var(--cyan)')+head2('HAPPY BATTERY, <span class="g">HAPPY YOU</span>').replace('class="h h2"','class="h h2" style="font-size:54px"')+
 '<img id="bb" data-b="bb" src="3d/bed_b.png" style="position:absolute;left:120px;top:380px;width:560px;height:478px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent),linear-gradient(transparent,#000 10%,#000 88%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent),linear-gradient(transparent,#000 10%,#000 88%,transparent);mask-composite:intersect">'+sn+
 '<div class="card" id="my" data-b="my" style="left:130px;top:890px;width:780px;height:150px;padding:22px 26px"><div style="font:700 29px/1.3 Inter"><span class="tag" style="position:static;background:var(--red);margin-right:12px">MYTH</span>Drain it to 0% to “reset” it.</div>'+
 '<div id="mf" style="font:700 29px/1.3 Inter;margin-top:18px"><span class="tag" style="position:static;background:var(--green);margin-right:12px">REAL FACT</span>Partial charging is fine.</div></div>'+
 '<div class="src" id="s8" data-b="src" style="top:1110px">apple.com/batteries · Battery University BU-808</div>');
 var m=mascot(el,170);M[8]=m;
 upd[8]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});swapH(el,t,s0+.05,C.happy);ent(q(el,'#bb'),l,.05,.45,{x:-60,y:0});
  ent(q(el,'#my'),t,C.cool+.5,.4,{y:30});ent(q(el,'#mf'),t,C.cool+1.3,.35,{x:-30,y:0});ent(q(el,'#s8'),t,C.cool+1.5,.3,{y:0});
  [].forEach.call(el.querySelectorAll('.sn'),function(s,i){var c=((t*.18+i/6)%1);s.style.transform='translate('+(160+((i*137)%520)+Math.sin(t+i)*20)+'px,'+(380+c*420)+'px) rotate('+(t*40+i*30)+'deg)';s.style.opacity=.7*Math.sin(c*Math.PI)});
  var cu=E.io(seg(t,C.sleep,C.cool+.8)),hp=t>=C.happy,dance=hp?Math.sin((t-C.happy)*9)*6:0;
  m.set({x:700,y:470+(hp?-Math.abs(Math.sin((t-C.happy)*4.5))*26:0),rot:dance,op:E.o5(seg(t,s0+.15,s0+.45)),level:lerp(1,.8,cu),col:cu<.5?'#ff9a4a':'#1fbf5b',pct:Math.round(lerp(100,80,cu))+'%',
   mouth:hp?'grin':(cu>.6?'smile':'flat'),brow:hp?'up':'n',sweat:1-cu,glasses:E.o5(seg(t,C.happy,C.happy+.3)),blush:hp?.6:0,ph:1.7},t)}
 ev(C.sleep,'whoosh');ev(C.cool,'chime');ev(C.cool+.5,'pop');ev(C.cool+1.3,'pop');ev(C.happy,'party')})();
// 9 CTA: recap + send + follow -----------------------------------------------------------------------------------------
(function(){var s0=S[9],L=TM.LADDER.cta;var rows=['Turn on the <b>80% charge limit</b>','Keep it cool: <b>16–22 °C</b> is ideal','Never charge it <b>under a pillow</b> (Apple)'],rh='';
 rows.forEach(function(r,i){rh+='<div class="rw" style="position:absolute;left:30px;top:'+(96+i*66)+'px;font:600 29px Inter;white-space:nowrap">'+ic('check-circle',38,'#1fbf5b','vertical-align:-9px;margin-right:14px')+r+'</div>'});
 var el=mk(head('// SAVE THIS · SEND THIS','SEND IT TO <span class="m">THAT FRIEND</span>','var(--mag)').replace('class="h"','class="h" style="font-size:56px"')+
 '<div class="card" id="rc9" data-b="rc9" style="left:110px;top:390px;width:810px;height:320px"><div style="position:absolute;left:30px;top:26px;font:800 34px Unb;letter-spacing:-.02em">THE 10-SECOND FIX</div>'+rh+'</div>'+
 '<div id="pf" data-b="pf" style="position:absolute;left:110px;top:752px;width:190px;height:190px;border-radius:50%;border:8px solid var(--ink);box-shadow:0 0 0 7px var(--heat);background:url(profile.jpg) center/cover"></div>'+
 '<div id="hd" data-b="hd" style="position:absolute;left:336px;top:772px;font:800 42px Unb;letter-spacing:-.03em">@sandesh_explains</div>'+
 '<div id="fo" data-b="fo" style="position:absolute;left:336px;top:846px;padding:14px 34px;background:var(--ink);color:#fffaf0;border-radius:999px;font:800 30px Unb;letter-spacing:.04em">FOLLOW</div>'+
 '<div id="sd" data-b="sd" style="position:absolute;left:126px;top:990px;transform-origin:0 50%;width:560px;padding:20px 0;text-align:center;background:var(--mag);color:#fffaf0;border:5px solid var(--ink);border-radius:999px;font:800 30px Unb;letter-spacing:.02em;box-shadow:7px 7px 0 var(--ink)">'+ic('paper-plane-tilt',38,'#fffaf0','vertical-align:-8px;margin-right:12px')+'SEND TO: THAT FRIEND</div>'+
 '<div id="ovn" data-b="ovn" style="position:absolute;left:720px;top:968px;width:150px;height:130px;text-align:center">'+ic(L==='OVEN'?'oven':'fire',120,'#d7261e')+'<div id="zz" style="position:absolute;left:96px;top:-16px;font:900 30px Unb;color:var(--cyan)">z</div></div>');
 upd[9]=function(t){var l=t-s0;ent(q(el,'.eye'),l,0,.3,{y:0});ent(q(el,'.h'),l,.05,.35);ent(q(el,'#rc9'),l,.1,.4,{y:40});
  [].forEach.call(el.querySelectorAll('.rw'),function(r,i){ent(r,l,.45+i*.75,.35,{x:-30,y:0})});
  pop(q(el,'#pf'),t,C.friend-.6,.4,0);ent(q(el,'#hd'),t,C.friend-.4,.35,{x:40,y:0});ent(q(el,'#fo'),t,C.friend-.2,.35,{y:20});
  var sd=q(el,'#sd'),su=seg(t,C.send,C.send+.4);sd.style.opacity=su>0?1:0;var pl=t>C.send+.4?(t-C.send-.4)%1.5:9;sd.style.transform='scale('+(su<1?E.bk(su):1+.07*Math.max(0,Math.sin(Math.min(pl,.5)/.5*Math.PI)))+')';
  var o=q(el,'#ovn');pop(o,t,C.oven2-.3,.4,0);if(t>C.oven2+.2)o.style.transform='rotate('+(Math.sin(t*6)*3)+'deg)';var z=q(el,'#zz'),zc=(t*.7)%1;z.style.transform='translate('+(zc*20)+'px,'+(-zc*40)+'px)';z.style.opacity=Math.sin(zc*Math.PI)}
 ev(s0+.45,'check');ev(s0+1.2,'check');ev(s0+1.95,'check');ev(C.send,'pop');ev(C.friend-.6,'pop');ev(C.oven2-.3,'ding')})();
for(var i=1;i<S.length;i++)ev(S[i]-.12,'swish');

// ---- confetti (sarcastic congrats) ----------------------------------------------------------------------------------
var cx2=$('conf').getContext('2d'),CC=['#ff6a2b','#e0218a','#1e9bff','#1fbf5b','#ffcf3a'];
function confetti(t,bursts,dur){cx2.clearRect(0,0,1080,1300);bursts.forEach(function(t0,bi){var l=t-t0;if(l<0||l>dur)return;var a=1-seg(l,dur-.4,dur);
 for(var i=0;i<70;i++){var vx=(rnd(i)-.5)*900,vy=-500-rnd(i+9)*700,x=540+vx*l,y=330+vy*l+900*l*l,r=t*6+i;cx2.save();cx2.globalAlpha=a;cx2.translate(x,y);cx2.rotate(r);cx2.fillStyle=CC[i%5];cx2.fillRect(-9,-5,18,10);cx2.restore()}})}

// ---- captions ---------------------------------------------------------------------------------------------------------
function cap(t){var CP=TM.CAP,k=-1;for(var i=0;i<CP.length;i++)if(t>=CP[i][0]-.05)k=i;var c=$('cap');if(k<0||t>CP[k][1]+1.2&&(k===CP.length-1||t<CP[k+1][0]-.05)){if(k<0){c.style.opacity=0;return}}
 var ws=CP[k][2],h='';ws.forEach(function(w,j){var on=t>=w[1]&&(j===ws.length-1||t<ws[j+1][1]);h+=(j?' ':'')+(on?'<b>'+w[0]+'</b>':w[0])});c.innerHTML=h;var u=E.o3(seg(t,CP[k][0]-.05,CP[k][0]+.12));c.style.opacity=1;c.style.transform='translateY('+(6*(1-u))+'px)'}

// ---- host + seek (cuts are sequential: the outgoing scene clears in the first half, the incoming arrives in the second, so text never double-exposes) ----
var els=[].slice.call(document.querySelectorAll('#scenes > .sc'));
var vid=$('hostv'),avc=$('avc'),hx=avc.getContext('2d'),lastF=-1;
function hostSeek(t){if(!vid.duration)return Promise.resolve();var f=Math.floor(t*24);if(f===lastF)return Promise.resolve();lastF=f;var ft=(f+.5)/24;if(vid.duration)ft=Math.min(ft,vid.duration-.02);
 return new Promise(function(res){var dn=function(){vid.removeEventListener('seeked',dn);hx.clearRect(0,0,544,544);hx.drawImage(vid,0,0,544,544);res()};vid.addEventListener('seeked',dn);vid.currentTime=ft})}
window.EV=EV.sort(function(a,b){return a[0]-b[0]});
window.__reelDurationSec=END;
window.__seek=function(t){
 t=Math.max(0,Math.min(END-1e-3,t));
 $('tiles').style.transform='translate('+(-(t*9)%130)+'px,'+(-(t*5)%130)+'px)';
 var d=drawDial(t);
 els.forEach(function(el,si){var s0=S[si],s1=si+1<S.length?S[si+1]:END,raw=t-s0,op=0,tf='';
  if((raw>=-TR||si===0)&&t<=s1+.001){if(raw<0&&si>0){var p=E.o3(seg(t,s0-.15,s0+.02));op=p;tf='translateY('+(16*(1-p))+'px) scale('+lerp(.985,1,p)+')'}else if(si<S.length-1&&t>s1-TR){var p=E.o3(seg(t,s1-TR,s1-.15));op=1-p;tf='translateY('+(-10*p)+'px)'}else op=1;upd[si](t)}
  el.style.opacity=op;el.style.transform=tf;el.style.display=op>0?'block':'none'});
 // bed layer: hook + slow-cook, and again for the oven scene
 var bo=0,f=pillowF(t);if(t<S[2])bo=1-seg(t,S[2]-TR,S[2]-.15);else if(t>=S[4]-.15&&t<S[5])bo=Math.min(seg(t,S[4]-.15,S[4]+.02),1-seg(t,S[5]-TR,S[5]-.15));
 bw.style.opacity=bo;bw.style.display=bo>0?'block':'none';if(bo>0){bedFrame(f);var jt=t>C.pillow2+.5&&t<C.oven?seg(t,C.pillow2+.5,C.oven):0;bw.style.transform='translate('+(Math.sin(t*37)*5*jt)+'px,'+(Math.sin(t*29)*3*jt)+'px) scale('+(1+.012*Math.sin(t*.8)+.03*jt*(.5+.5*Math.sin(t*6)))+')'}
 var p=bedPt(f,'phone'),hot=bo*(t<S[2]?lerp(.55,1,seg(t,.35,1)):lerp(.6,1,seg(t,C.pillow2,C.oven)));glow.setAttribute('cx',p[0]);glow.setAttribute('cy',p[1]);glow.setAttribute('opacity',hot*(.75+.25*Math.sin(t*4)));
 if(bo>0)steam(p[0],p[1]-30,bo*(t<S[1]?seg(t,1,1.6)*.6:1),t);else steam(0,0,0,t);
 confetti(t,[C.congrats,C.happy],1.6);
 cap(t);
 $('av').style.opacity=1;
 return hostSeek(t)};
window.__ready=false;
var fp=['800 62px Unb','900 62px Unb','600 22px GM','700 30px Inter','600 20px Inter'].map(function(f){return document.fonts.load(f)});
var imgs=bimg.concat([bedB]).map(function(im){return new Promise(function(r){if(im.complete)r();else{im.onload=r;im.onerror=r}})});
Promise.all(fp.concat(imgs,[new Promise(function(r){vid.addEventListener('loadeddata',r);setTimeout(r,8000)})])).catch(function(){}).then(function(){window.__seek(0);window.__ready=true});
})();
