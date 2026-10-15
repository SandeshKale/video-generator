(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,TAU=2*Math.PI;
var BG='#f1f3f8',INK='#14213d',MUTE='#53607a',LINE='#c9d1e3',SIDE='#cdd5e8',NAVY='#1e3a8a',OR='#ee6c2b',TEAL='#0f9d8a',GR='#8791a6',WHITE='#ffffff';
var svg=document.getElementById('s');
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function T(par,x,y,s,size,fill,font,wt,anchor,ls){return E('text',{x:x,y:y,fill:fill,'font-family':font||'IN','font-weight':wt||700,'font-size':size,'text-anchor':anchor||'start','letter-spacing':ls||0},par,s);}
function ICON(par,name,x,y,s,col,sw){var g=E('g',{transform:'translate('+x+','+y+') scale('+s+')',fill:'none',stroke:col,'stroke-width':sw||1.9,'stroke-linecap':'round','stroke-linejoin':'round'},par);g.innerHTML=window.ICONS[name]||'';return g;}
function badge(n,x,y){var g=E('g',{transform:'translate('+x+','+y+')'});E('circle',{r:17,fill:OR},g);T(g,0,8,String(n),22,WHITE,'JB',700,'middle');return g;}
var HEADS=[];function head(n,x,y,txt,w){var hg=E('g',{});E('rect',{x:x-6,y:y-22,width:w,height:36,rx:8,fill:BG},hg);var b=badge(n,x+17,y-4);hg.appendChild(b);T(hg,x+46,y+4,txt,22,INK,'JB',700,'start',.5);HEADS.push(hg);}
// extruded "iso" card: side + front
function card(par,x,y,w,h,fill,stroke,ex){ex=ex==null?9:ex;var g=E('g',{},par);
  E('rect',{x:x+ex,y:y+ex,width:w,height:h,rx:10,fill:SIDE},g);
  var f=E('rect',{x:x,y:y,width:w,height:h,rx:10,fill:fill||WHITE,stroke:stroke||INK,'stroke-width':3},g);return {g:g,f:f};}
E('rect',{width:1080,height:1350,fill:BG});
var df=E('defs',{});var gp=E('pattern',{id:'g',width:40,height:40,patternUnits:'userSpaceOnUse'},df);E('path',{d:'M40 0H0V40',fill:'none',stroke:'#e2e7f1','stroke-width':1.5},gp);
E('rect',{width:1080,height:1350,fill:'url(#g)'});
// ---- title ----
T(svg,54,92,'How AI agents get through',56,INK,'PJ',800,'start',-1.5);
T(svg,54,158,'your front door',56,OR,'PJ',800,'start',-1.5);
T(svg,54,202,'Personal Agent Protocol · Sierra + Meta · announced Oct 6, 2026',23,MUTE,'IN',500);
// ---- ① customer & agent ----
head(1,54,256,'THE CUSTOMER SETS THE LIMITS',450);
var c1=card(svg,54,284,230,100,WHITE);ICON(c1.g,'user',72,306,2.2,NAVY,1.7);T(c1.g,136,322,'Customer',27,INK,'PJ',800);T(c1.g,136,356,'signs in',22,MUTE,'IN',500);
var c2=card(svg,340,284,250,100,WHITE);ICON(c2.g,'robot',358,306,2.2,NAVY,1.7);T(c2.g,422,322,'Personal AI',27,INK,'PJ',800);T(c2.g,422,356,'agent',22,MUTE,'IN',500);
E('path',{d:'M290 334H334',stroke:INK,'stroke-width':3.5,'stroke-linecap':'round'});E('path',{d:'M324 324l12 10l-12 10',fill:'none',stroke:INK,'stroke-width':3.5,'stroke-linecap':'round','stroke-linejoin':'round'});
var TIERS=[['GUEST',GR],['SIGNED-IN READ',TEAL],['SIGNED-IN WRITE',OR]];
TIERS.forEach(function(t,i){var y=284+i*37;var g=E('g',{});
  E('rect',{x:640,y:y,width:386,height:32,rx:7,fill:WHITE,stroke:t[1],'stroke-width':3},g);E('rect',{x:640,y:y,width:12,height:32,rx:5,fill:t[1]},g);
  ICON(g,'key',664,y+4,1.0,t[1],2.1);T(g,694,y+23,t[0],22,INK,'JB',700);});
E('path',{d:'M596 334H634',stroke:LINE,'stroke-width':3.5,'stroke-dasharray':'3 9','stroke-linecap':'round'});
// ---- door bar ----
E('path',{d:'M560 392V470',stroke:INK,'stroke-width':3.5});
var DB=card(svg,54,470,972,104,NAVY,INK);
ICON(DB.g,'building',80,500,2.4,WHITE,1.6);
T(DB.g,152,514,'FRONT DOOR',30,WHITE,'PJ',800,'start',1);T(DB.g,152,552,'one session across every channel',23,'#c9d5f5','IN',500);
T(DB.g,1002,514,'built on OAuth',22,'#c9d5f5','JB',700,'end');
// ---- ② entrances ----
var EN=[{x:54,n:'WEBSITE',s:'the storefront',ic:'world-www',t:TIERS[0]},{x:390,n:'API',s:'MCP · OpenAPI',ic:'plug',t:TIERS[1]},{x:726,n:'BUSINESS AGENT',s:'your own agent',ic:'robot',t:TIERS[2]}];
var ENr=[];
EN.forEach(function(e,i){
  var cx=e.x+150;E('path',{d:'M'+cx+' 574V664',stroke:INK,'stroke-width':3.5});
  var c=card(svg,e.x,664,300,102,WHITE);ICON(c.g,e.ic,e.x+16,690,2.0,NAVY,1.7);
  T(c.g,e.x+76,704,e.n,e.n.length>10?24:27,INK,'PJ',800);T(c.g,e.x+76,738,e.s,22,MUTE,'IN',500);
  var pill=E('g',{});var pr=E('rect',{x:e.x+20,y:790,width:270,height:38,rx:19,fill:e.t[1],opacity:.18},pill);E('rect',{x:e.x+20,y:790,width:270,height:38,rx:19,fill:'none',stroke:e.t[1],'stroke-width':3},pill);
  ICON(pill,'key',e.x+34,796,1.1,e.t[1],2.1);T(pill,e.x+68,816,e.t[0],22,INK,'JB',700);
  E('path',{d:'M'+cx+' 766V790',stroke:e.t[1],'stroke-width':3});
  ENr.push({c:c,pr:pr,cx:cx,col:e.t[1]});});
head(2,54,624,'YOU CHOOSE WHICH ENTRANCES TO OPEN',540);
// ---- ③ systems ----
E('path',{d:'M204 828V904M540 828V904M876 828V904',stroke:LINE,'stroke-width':3.5,'stroke-dasharray':'3 9','stroke-linecap':'round'});
head(3,54,868,'YOU DECIDE WHAT EACH KEYCARD MAY DO',540);
var SY=[['Inventory','database',GR],['Return policy','file-text',GR],['Orders','package',TEAL],['Order changes','package',OR]];
var sb=card(svg,54,904,972,108,WHITE,INK);
SY.forEach(function(s,i){var x=70+i*240;
  ICON(sb.g,s[1],x,938,1.9,NAVY,1.7);T(sb.g,x+56,950,s[0],23,INK,'PJ',800);
  E('circle',{cx:x+66,cy:984,r:8,fill:s[2]},sb.g);T(sb.g,x+82,991,s[2]===GR?'guest can read':s[2]===TEAL?'signed-in read':'signed-in write',20,MUTE,'IN',500);});
// ---- ④ closed ----
var g4=E('g',{});E('rect',{x:54,y:1050,width:972,height:104,rx:10,fill:'#fdeee4',stroke:OR,'stroke-width':3.5,'stroke-dasharray':'12 8'},g4);
badge(4,54,1050);
var lk=ICON(g4,'lock',80,1086,2.5,OR,1.7);
T(g4,152,1094,'NOT IN v0.1 · COMING AS EXTENSIONS',23,OR,'JB',700);
T(g4,152,1132,'payments · push notifications · fine-grained permissions',25,INK,'IN',700);
// ---- ⑤ spec ----
var s5=card(svg,54,1194,520,100,INK,INK,8);badge(5,54,1194);
T(s5.g,86,1236,'SPEC v0.1 · LATER IN OCTOBER',24,WHITE,'JB',700);T(s5.g,86,1274,'no published spec yet',23,'#c9d5f5','IN',500);
T(svg,620,1218,'OTHER EFFORTS NEARBY',22,MUTE,'JB',700,'start',.5);
var NB=['UCP','ACP','TAP'],nbr=[];
NB.forEach(function(n,i){var x=620+i*136;var g=E('g',{});E('rect',{x:x,y:1234,width:122,height:56,rx:9,fill:WHITE,stroke:INK,'stroke-width':3},g);var l=E('rect',{x:x,y:1234,width:122,height:56,rx:9,fill:OR,opacity:0},g);T(g,x+61,1271,n,26,INK,'JB',700,'middle');nbr.push(l);});
// ---- packets ----
var PK=[0,1,2].map(function(i){var g=E('g',{});E('circle',{r:19,fill:TIERS[i][1],stroke:WHITE,'stroke-width':3.5},g);ICON(g,'key',-10,-10,.85,WHITE,2.3);return g;});
HEADS.slice(1).forEach(function(h){svg.appendChild(h);});
function pathPos(i,u){ // agent -> door -> entrance
  var cx=ENr[i].cx, pts=[[560,392],[560,574],[cx,574],[cx,664]];
  var L=[182,Math.abs(cx-560),90],tot=L[0]+L[1]+L[2],d=u*tot;
  for(var k=0;k<3;k++){if(d<=L[k]||k==2){var a=pts[k],b=pts[k+1],f=L[k]?clamp(d/L[k],0,1):1;return [a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];}d-=L[k];}
}
function seek(t){
  t=((t%DUR)+DUR)%DUR;
  for(var i=0;i<3;i++){
    var ph=(((t+1.3)-i*DUR/3)%DUR+DUR)%DUR;      // seconds since this packet launched
    var u=clamp(ph/3.0,0,1),mv=ph<3.0;
    var p=pathPos(i,sm(u)*0+u);                   // linear travel
    PK[i].setAttribute('transform','translate('+p[0].toFixed(1)+','+p[1].toFixed(1)+')');
    PK[i].setAttribute('opacity',mv?Math.min(1,ph/.25):Math.max(0,1-(ph-3.0)/.4));
    var arrive=ph>=3.0?Math.max(0,1-(ph-3.0)/1.8):0;
    var r=ENr[i];r.pr.setAttribute('opacity',(.18+.5*arrive).toFixed(3));
    r.c.f.setAttribute('stroke',arrive>.05?r.col:INK);r.c.f.setAttribute('stroke-width',3+2*arrive);
  }
  nbr.forEach(function(l,i){var q=((t/DUR*3)-i)%3;if(q<0)q+=3;l.setAttribute('opacity',(q<1?.22*Math.sin(q*Math.PI):0).toFixed(3));});
  lk.setAttribute('transform','translate(80,1086) scale(2.5) rotate('+(Math.sin(t/DUR*TAU*3)*4)+' 12 12)');
}
window.__reelDurationSec=DUR;window.__seek=function(t){seek(t);};
function boot(){seek(0);}
Promise.all(["800 40px PJ","700 22px PJ","500 22px IN","700 22px IN","700 22px JB"].map(function(f){return document.fonts.load(f);})).then(function(){return document.fonts.ready;}).then(boot,boot);
})();
