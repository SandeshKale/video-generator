(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,TAU=2*Math.PI;
var BG='#140f1f',PANEL='#1d1630',TXT='#f2ecff',MUTE='#9a90bd',GUEST='#cfc6e8',READ='#3fe0d0',WRITE='#ffd23f',NO='#ff5d6c';
var CLS=[GUEST,READ,WRITE];
var svg=document.getElementById('s');
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function frac(x){return x-Math.floor(x);}
function T(par,x,y,s,size,fill,font,wt,anchor,ls){return E('text',{x:x,y:y,fill:fill,'font-family':font||'IN','font-weight':wt||700,'font-size':size,'text-anchor':anchor||'start','letter-spacing':ls||0},par,s);}
function ICON(par,name,x,y,s,col,sw){var g=E('g',{transform:'translate('+x+','+y+') scale('+s+')',fill:'none',stroke:col,'stroke-width':sw||1.9,'stroke-linecap':'round','stroke-linejoin':'round'},par);g.innerHTML=window.ICONS[name]||'';return g;}
function badge(n,x,y){var g=E('g',{transform:'translate('+x+','+y+')'});var r=E('circle',{r:16,fill:TXT,stroke:BG,'stroke-width':3},g);T(g,0,7,String(n),20,BG,'JB',700,'middle');return {g:g,r:r,x:x,y:y};}
E('rect',{width:1600,height:900,fill:BG});
var df=E('defs',{});
var dp=E('pattern',{id:'dots',width:40,height:40,patternUnits:'userSpaceOnUse'},df);E('circle',{cx:20,cy:20,r:1.8,fill:'#2e2447'},dp);
var hz=E('pattern',{id:'hz',width:24,height:24,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},df);E('rect',{width:12,height:24,fill:WRITE},hz);E('rect',{x:12,width:12,height:24,fill:'#241a3a'},hz);
var bgd=E('rect',{x:-40,y:-40,width:1700,height:1000,fill:'url(#dots)'});
// ---------- header ----------
var ti=T(svg,40,70,'AGENT ',44,TXT,'UN',900);E('tspan',{fill:WRITE},ti,'METRO');
T(svg,40,104,'how a personal AI agent gets through a business’s front door',20,MUTE,'IN',500);
[['GUEST',GUEST],['SIGNED-IN READ',READ],['SIGNED-IN WRITE',WRITE]].forEach(function(c,i){var x=[880,1020,1250][i];
  ICON(svg,'ticket',x,30,1.1,c[1],2);T(svg,x+34,50,c[0],19,c[1],'JB',700);});
T(svg,880,92,'ticket class = how deep the agent may go',19,MUTE,'IN',500);
// ---------- geometry ----------
var LY=[300,405,510],LC=['#ff7a7a','#c77dff','#5aa9ff'],LN=['WEBSITE','API · MCP/OpenAPI','BUSINESS AGENT'];
var CX=[640,900,1160,1420],SX=372,IX=340;
var NAME=['PUBLIC INFO','MY ACCOUNT','CHANGE THINGS','PAYMENTS'];
var SUB=[['inventory, returns'],['my orders, account'],['act on my behalf'],['push alerts,','finer permissions']];
// column guides + headers
var HD=[];
CX.forEach(function(x,i){
  var col=i<3?CLS[i]:NO;
  E('line',{x1:x,y1:226,x2:x,y2:560,stroke:col,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round',opacity:.45});
  var g=E('g',{});var r=E('rect',{x:x-118,y:122,width:236,height:104,rx:12,fill:PANEL,stroke:col,'stroke-width':3},g);if(i==3)r.setAttribute('stroke-dasharray','10 7');
  T(g,x,152,NAME[i],19,col,'UN',800,'middle');
  SUB[i].forEach(function(s,k){T(g,x,181+k*24,s,19,TXT,'IN',500,'middle');});
  HD.push(r);});
// lines / rails
LY.forEach(function(y,i){
  [-11,11].forEach(function(o){E('line',{x1:IX,y1:y+o,x2:1400,y2:y+o,stroke:LC[i],'stroke-width':4,'stroke-linecap':'round',opacity:.85});});
  // sleepers
  E('line',{x1:IX,y1:y,x2:1400,y2:y,stroke:LC[i],'stroke-width':14,'stroke-dasharray':'3 17',opacity:.25});
  var lab=E('g',{});var w=LN[i].length*10.9+28;E('rect',{x:392,y:y-58,width:w,height:30,rx:15,fill:LC[i]},lab);T(lab,406,y-38,LN[i],18,BG,'JB',700);
});
// stations (platform + gate arm)
var ST=[];
LY.forEach(function(y,li){ST[li]=[];
  for(var k=0;k<3;k++){var x=CX[k],g=E('g',{});
    var plat=E('rect',{x:x-26,y:y-27,width:52,height:54,rx:10,fill:BG,stroke:CLS[k],'stroke-width':3.5},g);
    var glow=E('rect',{x:x-26,y:y-27,width:52,height:54,rx:10,fill:CLS[k],opacity:0},g);
    var arm=E('line',{x1:x-19,y1:y-40,x2:x+19,y2:y-40,stroke:CLS[k],'stroke-width':6,'stroke-linecap':'round'},g);
    E('circle',{cx:x-19,cy:y-40,r:5,fill:CLS[k]},g);
    var xm=E('g',{opacity:0},g);E('circle',{cx:x+30,cy:y-44,r:14,fill:NO,stroke:BG,'stroke-width':3},xm);ICON(xm,'x',x+30-9,y-44-9,.75,TXT,3);
    ST[li][k]={arm:arm,glow:glow,x:x,y:y,xm:xm};}
});
// barrier (payments)
var BX=CX[3];
E('rect',{x:BX-20,y:252,width:40,height:306,rx:8,fill:'url(#hz)'}).setAttribute('opacity',.95);
var bst=E('rect',{x:BX-20,y:252,width:40,height:306,rx:8,fill:'none',stroke:BG,'stroke-width':4});
var bflash=E('rect',{x:BX-24,y:248,width:48,height:314,rx:10,fill:'none',stroke:NO,'stroke-width':5,opacity:0});
var lkg=E('g',{});E('circle',{cx:BX,cy:405,r:26,fill:BG,stroke:NO,'stroke-width':4},lkg);var lk=ICON(lkg,'lock',BX-15,405-15,1.25,NO,2);
T(svg,BX,590,'NOT IN v0.1',20,NO,'JB',700,'middle');
// interchange
var ic=E('rect',{x:IX-24,y:262,width:48,height:286,rx:24,fill:PANEL,stroke:TXT,'stroke-width':4});
var ring=E('rect',{x:IX-24,y:262,width:48,height:286,rx:24,fill:'none',stroke:TXT,'stroke-width':3,opacity:0});
[300,405,510].forEach(function(y){E('circle',{cx:IX,cy:y,r:9,fill:TXT});});
var fd=E('g',{});T(fd,262,238,'FRONT DOOR',18,TXT,'UN',800,'start');
T(svg,292,584,'one OAuth session',19,MUTE,'IN',700,'start');
// depot
var dp2=E('g',{});E('rect',{x:40,y:250,width:210,height:310,rx:14,fill:PANEL,stroke:TXT,'stroke-width':3},dp2);
ICON(dp2,'robot',112,268,2.6,TXT,1.6);T(dp2,145,370,'CUSTOMER’S',20,TXT,'UN',800,'middle');T(dp2,145,394,'AGENT',20,TXT,'UN',800,'middle');
var TK=[];[['GUEST',GUEST],['READ',READ],['WRITE',WRITE]].forEach(function(c,i){var y=412+i*44;var g=E('g',{});
  var r=E('rect',{x:60,y:y,width:170,height:36,rx:8,fill:BG,stroke:c[1],'stroke-width':3},g);var f=E('rect',{x:60,y:y,width:170,height:36,rx:8,fill:c[1],opacity:0},g);
  ICON(g,'key',70,y+7,.9,c[1],2.2);T(g,102,y+26,c[0],19,TXT,'JB',700);TK.push({r:r,f:f});});
E('line',{x1:250,y1:405,x2:IX-24,y2:405,stroke:TXT,'stroke-width':4,'stroke-linecap':'round'});
// trunk packets
var TP=[0,1,2,3].map(function(i){return E('circle',{r:6,fill:CLS[i%3]});});
// stream dots on lines
var SD=[];LY.forEach(function(y,li){for(var i=0;i<4;i++){SD.push({e:E('circle',{r:3.5,fill:LC[li],opacity:.9}),y:y-11,li:li,i:i});}});
// ---------- trains ----------
var TR=[{li:0,c:0,off:0},{li:0,c:2,off:4},{li:1,c:1,off:1.3},{li:1,c:0,off:5.3},{li:2,c:2,off:2.6},{li:2,c:1,off:6.6}];
TR.forEach(function(t){var g=E('g',{});E('rect',{x:-34,y:-10,width:68,height:20,rx:8,fill:CLS[t.c],stroke:BG,'stroke-width':3},g);
  [-18,-4,10].forEach(function(wx){E('rect',{x:wx,y:-5,width:9,height:8,rx:2,fill:BG,opacity:.75},g);});
  E('path',{d:'M34 -7L44 0L34 7Z',fill:CLS[t.c]},g);t.g=g;});
// badges
var BD=[badge(1,50,244),badge(2,268,578),badge(3,512,257),badge(4,CX[0]-118,130),badge(5,BX+20,244)];
// ---------- board ----------
var bp=E('g',{});E('rect',{x:40,y:612,width:780,height:260,rx:14,fill:PANEL,stroke:'#3b2f5c','stroke-width':2},bp);
T(bp,62,642,'DEPARTURES · illustrative · which ticket reaches what',20,MUTE,'JB',700);
var ROWS=[['GUEST','read public info',GUEST],['SIGNED-IN READ','see my orders & account',READ],['SIGNED-IN WRITE','act on my behalf',WRITE],['ANY TICKET','payments (extension)',NO]];
var RW=ROWS.map(function(r,i){var y=656+i*54,g=E('g',{});
  var hi=E('rect',{x:54,y:y,width:752,height:46,rx:10,fill:r[2],opacity:0},g);E('rect',{x:54,y:y,width:752,height:46,rx:10,fill:'none',stroke:r[2],'stroke-width':2,opacity:.55},g);
  E('rect',{x:62,y:y+8,width:230,height:30,rx:8,fill:r[2]},g);T(g,74,y+30,r[0],19,BG,'JB',700);
  T(g,320,y+31,r[1],23,TXT,'IN',700);
  var st=T(g,792,y+31,i<3?'OPEN ✓':'CLOSED ✕',20,r[2],'JB',700,'end');return {hi:hi,st:st,i:i};});
// ---------- spec + neighbours ----------
var sp=E('g',{});E('rect',{x:850,y:612,width:710,height:120,rx:14,fill:PANEL,stroke:WRITE,'stroke-width':3},sp);
badge(6,850,612);
T(sp,880,656,'SPEC v0.1',28,WRITE,'UN',900);T(sp,880,690,'LATER IN OCTOBER · no published spec yet',21,TXT,'IN',700);
E('rect',{x:880,y:706,width:650,height:14,rx:7,fill:BG,stroke:'#3b2f5c','stroke-width':2},sp);
var clip=E('clipPath',{id:'bc'},df);E('rect',{x:881,y:707,width:648,height:12,rx:6},clip);
var bar=E('g',{'clip-path':'url(#bc)'},sp);var barS=E('rect',{x:881,y:707,width:1400,height:12,fill:'url(#hz)'},bar);
var np=E('g',{});E('rect',{x:850,y:750,width:710,height:122,rx:14,fill:PANEL,stroke:'#3b2f5c','stroke-width':2},np);
T(np,872,780,'OTHER EFFORTS · separate networks',20,MUTE,'JB',700);
var NB=[['UCP','#ff9f43'],['ACP','#a0e86a'],['TAP','#ff7ad9']],NT=[];
NB.forEach(function(n,i){var x=872+i*226,g=E('g',{});
  E('rect',{x:x,y:796,width:76,height:30,rx:8,fill:n[1]},g);T(g,x+38,818,n[0],20,BG,'JB',700,'middle');
  E('line',{x1:x,y1:850,x2:x+196,y2:850,stroke:n[1],'stroke-width':4,'stroke-dasharray':'8 8',opacity:.8},g);
  var tg=E('g',{},g);E('rect',{x:-16,y:-8,width:32,height:16,rx:6,fill:n[1]},tg);NT.push({g:tg,x:x,n:i+1});});
// ---------- seek ----------
function trainState(t,tr){
  var s=(((t+tr.off)%DUR)+DUR)%DUR,stop=CX[tr.c],a=SX+40,x=a,yo=-11,op=1,dw=0,bump=0;
  if(s<.5){op=sm(s/.5);}
  else if(s<3){x=a+(stop-a)*sm((s-.5)/2.5);}
  else{x=stop;dw=sm((s-3)/.3)*(1-sm((s-4.7)/.3));
    if(s<3.9){}else if(s<4.3){x=stop+38*sm((s-3.9)/.4);bump=sm((s-3.9)/.4);}
    else if(s<4.7){x=stop+38*(1-sm((s-4.3)/.4));bump=1;}
    if(s>=4.7&&s<5.2){yo=-11+22*sm((s-4.7)/.5);}else if(s>=5.2){yo=11;
      if(s<7.5)x=stop+(a-stop)*sm((s-5.2)/2.3);else{x=a;op=1-sm((s-7.5)/.5);}}
    if(s>=4.3&&s<4.7)bump=1-sm((s-4.5)/.2)*0;
  }
  var bf=(s>=3.9&&s<5.0)?Math.sin(clamp((s-3.9)/1.1,0,1)*Math.PI):0;
  return {x:x,yo:yo,op:op,dw:dw,bf:bf,s:s};}
function seek(t){
  t=((t%DUR)+DUR)%DUR;
  bgd.setAttribute('transform','translate('+(t/DUR*40).toFixed(2)+','+(t/DUR*40).toFixed(2)+')');
  var open=[[0,0,0],[0,0,0],[0,0,0]],hdr=[0,0,0,0],row=[0,0,0,0],bumpAt=[[0,0,0,0],[0,0,0,0],[0,0,0,0]];
  TR.forEach(function(tr){var st=trainState(t,tr),y=LY[tr.li]+st.yo;
    tr.g.setAttribute('transform','translate('+st.x.toFixed(1)+','+y.toFixed(1)+')');tr.g.setAttribute('opacity',st.op.toFixed(2));
    for(var k=0;k<3;k++){if(tr.c>=k){var d=Math.abs(st.x-CX[k]);var o=sm((70-d)/40)*st.op*(st.yo<0?1:.0);open[tr.li][k]=Math.max(open[tr.li][k],o);hdr[k]=Math.max(hdr[k],o);}}
    row[tr.c]=Math.max(row[tr.c],st.dw);
    if(st.bf>0){var nk=tr.c+1;bumpAt[tr.li][nk]=Math.max(bumpAt[tr.li][nk],st.bf);if(nk==3){row[3]=Math.max(row[3],st.bf);}}
  });
  for(var li=0;li<3;li++){for(var k=0;k<3;k++){var s=ST[li][k];s.arm.setAttribute('transform','rotate('+(-55*open[li][k]).toFixed(1)+' '+(s.x-19)+' '+(s.y-40)+')');
    s.glow.setAttribute('opacity',(.35*open[li][k]).toFixed(3));s.xm.setAttribute('opacity',bumpAt[li][k].toFixed(2));}}
  var bf=Math.max(bumpAt[0][3],bumpAt[1][3],bumpAt[2][3]);
  bflash.setAttribute('opacity',bf.toFixed(2));HD[3].setAttribute('stroke-width',(3+4*bf).toFixed(1));
  for(var k=0;k<3;k++)HD[k].setAttribute('stroke-width',(3+4*hdr[k]).toFixed(1));
  RW.forEach(function(r,i){r.hi.setAttribute('opacity',(.28*row[i]).toFixed(3));});
  // depot tickets
  TK.forEach(function(k,i){var p=((t/DUR*3)-i)%3;if(p<0)p+=3;var a=p<1?Math.sin(p*Math.PI):0;k.f.setAttribute('opacity',(.55*a).toFixed(3));});
  // trunk packets
  TP.forEach(function(p,i){var f=frac(t/DUR*2+i/4);p.setAttribute('cx',(250+f*(IX-24-250)).toFixed(1));p.setAttribute('cy',405);p.setAttribute('opacity',Math.sin(f*Math.PI).toFixed(2));});
  // stream dots on outbound rails
  SD.forEach(function(d){var f=frac(t/DUR*2+d.i/4+d.li*.13);d.e.setAttribute('cx',(IX+30+f*(1400-IX-40)).toFixed(1));d.e.setAttribute('cy',d.y);d.e.setAttribute('opacity',(.15+.6*Math.sin(f*Math.PI)).toFixed(2));});
  // interchange pulse
  var pp=frac(t/DUR*2);ring.setAttribute('opacity',(.7*(1-pp)).toFixed(2));ring.setAttribute('transform','translate('+IX+',405) scale('+(1+.35*pp).toFixed(3)+','+(1+.12*pp).toFixed(3)+') translate('+(-IX)+',-405)');
  // lock wobble + barrier stripes
  lk.setAttribute('transform','translate('+(BX-15)+',390) scale(1.25) rotate('+(Math.sin(t/DUR*TAU*3)*5)+' 12 12)');
  // badges
  BD.forEach(function(b,i){var p=((t-i*1.3)%DUR+DUR)%DUR;var a=p<1.3?Math.sin(p/1.3*Math.PI):0;b.r.setAttribute('r',(16+5*a).toFixed(1));b.r.setAttribute('fill',a>.5?WRITE:TXT);});
  // spec bar
  barS.setAttribute('transform','translate('+(-((t/DUR)*72%24)*1)+',0)');
  // neighbours
  NT.forEach(function(n){var f=frac(t/DUR*n.n);n.g.setAttribute('transform','translate('+(n.x+f*196).toFixed(1)+',850)');n.g.setAttribute('opacity',Math.sin(f*Math.PI).toFixed(2));});
}
window.__reelDurationSec=DUR;window.__seek=function(t){seek(t);};
function boot(){seek(0);}
Promise.all(["900 40px UN","800 20px UN","500 20px IN","700 20px IN","700 20px JB"].map(function(f){return document.fonts.load(f);})).then(function(){return document.fonts.ready;}).then(boot,boot);
})();
