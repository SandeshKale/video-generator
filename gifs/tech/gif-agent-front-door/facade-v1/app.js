(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,TAU=2*Math.PI;
var BG='#f3ead9',PAPER2='#e9dcc0',INK='#2a2724',MUTE='#6b6355',CU='#c4622d',TEAL='#2f7f79',GUEST='#8a8272',DARK='#4a3f36';
var svg=document.getElementById('s');
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function T(par,x,y,s,size,fill,font,wt,anchor,ls){return E('text',{x:x,y:y,fill:fill,'font-family':font||'IN','font-weight':wt||700,'font-size':size,'text-anchor':anchor||'start','letter-spacing':ls||0},par,s);}
function ICON(par,name,x,y,s,col,sw){var g=E('g',{transform:'translate('+x+','+y+') scale('+s+')',fill:'none',stroke:col,'stroke-width':sw||1.9,'stroke-linecap':'round','stroke-linejoin':'round'},par);g.innerHTML=window.ICONS[name]||'';return g;}
function badge(par,n,x,y){var g=E('g',{transform:'translate('+x+','+y+')'},par);var c=E('circle',{r:19,fill:CU},g);T(g,0,8,String(n),23,'#fff5e6','JB',700,'middle');return g;}
E('rect',{width:1080,height:1350,fill:BG});
// drafting grid
var df=E('defs',{});var gp=E('pattern',{id:'g',width:30,height:30,patternUnits:'userSpaceOnUse'},df);E('path',{d:'M30 0H0V30',fill:'none',stroke:'#e8dcc3','stroke-width':1},gp);
E('rect',{width:1080,height:1350,fill:'url(#g)'});
// ---------- header ----------
T(svg,54,92,'The front door',78,INK,'FR',900,'start',-2);
T(svg,54,168,'for AI agents',78,CU,'FR',900,'start',-2).setAttribute('font-style','italic');
T(svg,1026,70,'PERSONAL AGENT PROTOCOL',22,MUTE,'JB',700,'end',1);
T(svg,1026,102,'Sierra + Meta · Oct 6, 2026',24,INK,'IN',700,'end');
T(svg,1026,134,'built on OAuth · you choose the door',22,MUTE,'IN',500,'end');
// ---------- facade ----------
var FY=262, GY=800; // facade top / ground line
E('rect',{x:54,y:FY-26,width:972,height:26,fill:INK});               // cornice
E('rect',{x:54,y:FY,width:972,height:GY-FY,fill:PAPER2,stroke:INK,'stroke-width':4});
E('rect',{x:30,y:GY,width:1020,height:14,fill:INK});
// building name plate
T(svg,540,FY+54,'YOUR BUSINESS',26,MUTE,'JB',700,'middle',6);
var BAYS=[
 {x:72, w:276, name:'WEBSITE',  sub:'the regular door',  ic:'world-www', tier:'GUEST',      tcol:GUEST, open:.38, off:2.4},
 {x:402,w:276, name:'API',      sub:'MCP · OpenAPI',     ic:'plug',      tier:'SIGNED-IN READ', tcol:TEAL, open:.68, off:4.6},
 {x:732,w:276, name:'AGENT DESK',sub:'your own agent',   ic:'robot',     tier:'SIGNED-IN WRITE',tcol:CU, open:1, off:6.8}];
var BAYR=[];
BAYS.forEach(function(b,i){
  var g=E('g',{});
  // sign
  E('rect',{x:b.x,y:FY+82,width:b.w,height:84,rx:4,fill:BG,stroke:INK,'stroke-width':3},g);
  ICON(g,b.ic,b.x+16,FY+104,1.7,INK,1.7);
  T(g,b.x+66,FY+120,b.name,29,INK,'IN',700);
  T(g,b.x+66,FY+152,b.sub,22,MUTE,'IN',500);
  // doorway
  var dx=b.x+30,dw=b.w-110,dy=FY+200,dh=GY-dy;
  E('rect',{x:dx-8,y:dy-8,width:dw+16,height:dh+8,fill:INK},g);
  var inner=E('rect',{x:dx,y:dy,width:dw,height:dh,fill:DARK},g);
  var glow=E('rect',{x:dx,y:dy,width:dw,height:dh,fill:'#ffd9a0',opacity:0},g);
  var depth=E('rect',{x:dx,y:dy,width:dw,height:dh,fill:'none'},g);
  // door leaf (hinged left)
  var leaf=E('g',{},g);
  var lr=E('rect',{x:dx,y:dy,width:dw,height:dh,fill:i==0?'#d9c9a6':i==1?'#cfd9d2':'#e4c7b0',stroke:INK,'stroke-width':3},leaf);
  if(i==0){E('rect',{x:dx+16,y:dy+16,width:dw-32,height:dh*.38,fill:'none',stroke:INK,'stroke-width':2},leaf);E('rect',{x:dx+16,y:dy+dh*.5,width:dw-32,height:dh*.38,fill:'none',stroke:INK,'stroke-width':2},leaf);}
  if(i==1){for(var s=0;s<7;s++)E('line',{x1:dx+10,y1:dy+24+s*(dh-48)/6,x2:dx+dw-10,y2:dy+24+s*(dh-48)/6,stroke:INK,'stroke-width':2.5},leaf);}
  if(i==2){E('rect',{x:dx+14,y:dy+dh*.45,width:dw-28,height:14,fill:INK},leaf);}
  E('circle',{cx:dx+dw-16,cy:dy+dh*.55,r:6,fill:INK},leaf);
  // reader
  var rx=b.x+b.w-64,ry=dy+dh*.42;
  E('rect',{x:rx,y:ry,width:44,height:78,rx:6,fill:INK},g);
  var rl=E('circle',{cx:rx+22,cy:ry+22,r:10,fill:GUEST},g);
  ICON(g,'key',rx+8,ry+40,1.2,'#f3ead9',2);
  BAYR.push({b:b,dx:dx,dw:dw,dy:dy,dh:dh,leaf:leaf,glow:glow,rl:rl,rx:rx,ry:ry});
});
// ① badge on first reader, ② on sign row, ③ on agents, ④, ⑤
var B1=badge(svg,1,BAYS[0].x+BAYS[0].w-42,FY+318);
var B2=badge(svg,2,BAYS[0].x+12,FY+60);
// ---------- agents (③) ----------
var AG=[];
BAYR.forEach(function(r,i){
  var b=r.b;var g=E('g',{});
  var body=E('g',{},g);
  E('rect',{x:-26,y:-92,width:52,height:62,rx:12,fill:b.tcol,stroke:INK,'stroke-width':3},body);
  ICON(body,'robot',-17,-84,1.45,'#fff5e6',1.8);
  var legL=E('line',{x1:-10,y1:-30,x2:-10,y2:0,stroke:INK,'stroke-width':6,'stroke-linecap':'round'},body);
  var legR=E('line',{x1:10,y1:-30,x2:10,y2:0,stroke:INK,'stroke-width':6,'stroke-linecap':'round'},body);
  var card=E('g',{transform:'translate(28,-70) rotate(-12)'},body);
  E('rect',{x:0,y:0,width:38,height:25,rx:4,fill:b.tcol,stroke:INK,'stroke-width':2.5},card);
  E('rect',{x:5,y:6,width:12,height:9,rx:2,fill:'#fff5e6'},card);
  AG.push({g:g,body:body,legL:legL,legR:legR,card:card,r:r});
});
// ---------- tier legend (③) ----------
var LY=872;
E('line',{x1:54,y1:LY-24,x2:1026,y2:LY-24,stroke:INK,'stroke-width':2,'stroke-dasharray':'3 9','stroke-linecap':'round'});
badge(svg,3,54+19,LY+36);
T(svg,100,LY+22,'Every agent carries a keycard:',26,INK,'IN',700);
T(svg,100,LY+54,'you pick what it may do · the company picks what it can',22,MUTE,'IN',500);
var TIERS=[['GUEST','read public info',GUEST],['SIGNED-IN READ','orders · account',TEAL],['SIGNED-IN WRITE','change · cancel',CU]];
TIERS.forEach(function(t,i){
  var x=54+i*330,y=LY+80,w=312;
  var g=E('g',{});
  E('rect',{x:x,y:y,width:w,height:88,rx:8,fill:BG,stroke:INK,'stroke-width':3},g);
  E('rect',{x:x,y:y,width:12,height:88,fill:t[2]},g);
  var cd=E('g',{transform:'translate('+(x+28)+','+(y+22)+')'},g);
  E('rect',{width:44,height:28,rx:4,fill:t[2],stroke:INK,'stroke-width':2.5},cd);E('rect',{x:6,y:7,width:14,height:10,rx:2,fill:'#fff5e6'},cd);
  T(g,x+84,y+40,t[0],t[0].length>10?22:24,INK,'JB',700);
  T(g,x+84,y+70,t[1],22,MUTE,'IN',500);
});
// ---------- closed gate (④) ----------
var GY2=1090;
E('rect',{x:54,y:GY2,width:972,height:112,rx:6,fill:PAPER2,stroke:INK,'stroke-width':4});
var shutter=E('g',{});
for(var k=0;k<24;k++)E('line',{x1:60+k*40.5,y1:GY2+6,x2:60+k*40.5,y2:GY2+106,stroke:'#c9b88f','stroke-width':3});
E('rect',{x:54,y:GY2,width:972,height:112,rx:6,fill:'none'});
var plate=E('g',{});
E('rect',{x:84,y:GY2+16,width:912,height:80,rx:4,fill:BG,stroke:CU,'stroke-width':3.5,'stroke-dasharray':'12 7'},plate);
badge(svg,4,54,GY2);
var lk=ICON(plate,'lock',106,GY2+34,1.9,CU,1.8);
T(plate,170,GY2+50,'GATE CLOSED · NOT IN v0.1',24,CU,'JB',700);
T(plate,170,GY2+82,'payments · push alerts · fine-grained permissions',24,INK,'IN',700);
// ---------- spec sign (⑤) + neighbours ----------
var SY=1226;
badge(svg,5,54+19,SY+40);
var sign=E('g',{});
E('rect',{x:92,y:SY+6,width:456,height:92,rx:6,fill:INK},sign);
T(sign,114,SY+42,'SPEC v0.1 · LATER IN OCTOBER',24,'#f3ead9','JB',700);
T(sign,114,SY+78,'no published spec yet',22,'#e6c9a8','IN',500);
T(svg,580,SY+30,'NEIGHBOURING DOORS',22,MUTE,'JB',700,'start',1);
var NB=['UCP','ACP','TAP'],nbr=[];
NB.forEach(function(n,i){
  var x=580+i*150,g=E('g',{});
  E('rect',{x:x,y:SY+44,width:136,height:56,rx:5,fill:BG,stroke:INK,'stroke-width':3},g);
  var lit=E('rect',{x:x,y:SY+44,width:136,height:56,rx:5,fill:CU,opacity:0},g);
  T(g,x+68,SY+82,n,26,INK,'JB',700,'middle');
  nbr.push(lit);
});
// ---------- seek ----------
function seek(t){
  t=((t%DUR)+DUR)%DUR;
  // numbered badge pulse (stagger)
  [B1,B2].forEach(function(b,i){});
  BAYR.forEach(function(r,i){
    var b=r.b,a=AG[i];
    var ph=(t+b.off)%DUR;               // 0..8 local cycle
    var homeX=r.dx+r.dw/2, startX=r.dx-6, stopX=homeX-26;
    var walk=sm(ph/2.2);                 // 0..2.2 walk in
    var x=startX+(stopX-startX)*walk;
    var tap=sm((ph-2.4)/.5);             // tap at 2.4
    var op=sm((ph-3.0)/1.1)*b.open;      // door open 3..4.1
    var enter=sm((ph-5.2)/1.2);          // step through 5.2..6.4
    var reset=sm((ph-7.2)/.8);           // close + fade 7.2..8
    var opened=op*(1-reset);
    // walking bob
    var moving=(ph<2.2)?1:0;
    var bob=moving?Math.abs(Math.sin(ph*TAU*1.4))*5:0;
    var ax=x+enter*60, ay=GY-bob;
    var vis=(1-sm((ph-6.0)/.7))*sm(ph/.01+0) ;
    if(ph<.01)vis=1;
    // keep populated: agent present before walking ends; show agent through ph<6.7, hidden after until restart
    a.g.setAttribute('transform','translate('+ax.toFixed(1)+','+ay.toFixed(1)+') scale(1.45)');
    a.g.setAttribute('opacity',(ph<6.7?(1-sm((ph-5.8)/.9)):0)*(ph>7.9?0:1)+(ph>7.2?0:0));
    var sw=Math.sin(ph*TAU*1.4)*(moving?9:0);
    a.legL.setAttribute('x2',-10+sw);a.legR.setAttribute('x2',10-sw);
    // door leaf
    var sx=1-opened*.82;
    r.leaf.setAttribute('transform','translate('+r.dx+',0) scale('+sx.toFixed(3)+',1) translate('+(-r.dx)+',0)');
    r.glow.setAttribute('opacity',(.55*opened).toFixed(3));
    // reader light
    var lit=tap*(1-reset);
    r.rl.setAttribute('fill',lit>.5?b.tcol:GUEST);
    r.rl.setAttribute('r',10+ (lit>.5? 3*Math.sin(clamp((ph-2.4)/.9,0,1)*Math.PI):0));
    a.card.setAttribute('transform','translate(28,-70) rotate('+(-12-tap*28*(1-reset))+')');
  });
  // badge pulses
  var bs=svg.querySelectorAll('g > circle[r="19"]');
  bs.forEach(function(c,i){var k=1+.16*Math.max(0,Math.sin(((t-i*1.5)/DUR)*TAU*1))*0; });
  // neighbouring doors: one lit per 8/3 s window
  nbr.forEach(function(l,i){var p=((t/DUR*3)-i)%3;if(p<0)p+=3;l.setAttribute('opacity',(p<1?.18*Math.sin(p*Math.PI):0).toFixed(3));});
  // closed gate: lock wobble
  lk.setAttribute('transform','translate(106,'+(GY2+34)+') scale(1.9) rotate('+(Math.sin(t*TAU/DUR*3)*3)+' 12 12)');
}
window.__reelDurationSec=DUR;
window.__seek=function(t){seek(t);};
function boot(){seek(0);}
var fams=["900 40px FR","italic 900 40px FR","500 22px IN","700 22px IN","700 22px JB"];
Promise.all(fams.map(function(f){return document.fonts.load(f);})).then(function(){return document.fonts.ready;}).then(boot,boot);
})();
