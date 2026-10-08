(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,TAU=2*Math.PI;
var BG='#0f1318',PANEL='#171d25',LINE='#2b3644',TXT='#eef2f6',MUTE='#8a97a8',RED='#ff5a47',BLUE='#4a8dff',KRAFT='#e2b46a',GREEN='#5fe0a0',AMB='#ffb84a';
var svg=document.getElementById('s');
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function frac(x){return x-Math.floor(x);}
function T(par,x,y,s,size,fill,font,wt,anchor,ls){return E('text',{x:x,y:y,fill:fill,'font-family':font||'IN','font-weight':wt||700,'font-size':size,'text-anchor':anchor||'start','letter-spacing':ls||0},par,s);}
function ICON(par,name,x,y,s,col,sw){var g=E('g',{transform:'translate('+x+','+y+') scale('+s+')',fill:'none',stroke:col,'stroke-width':sw||1.9,'stroke-linecap':'round','stroke-linejoin':'round'},par);g.innerHTML=window.ICONS[name]||'';return g;}
var PILLS=[];function pill(n,x,y,w,txt){var g=E('g',{});PILLS.push(g);E('rect',{x:x,y:y,width:w,height:36,rx:18,fill:BG,stroke:LINE,'stroke-width':2},g);E('circle',{cx:x+20,cy:y+18,r:14,fill:RED},g);T(g,x+20,y+25,String(n),19,'#fff','JB',700,'middle');T(g,x+44,y+25,txt,20,TXT,'JB',700);return g;}
E('rect',{width:1080,height:1350,fill:BG});
var df=E('defs',{});var dp=E('pattern',{id:'dots',width:36,height:36,patternUnits:'userSpaceOnUse'},df);E('circle',{cx:18,cy:18,r:1.6,fill:'#222c38'},dp);
var bgd=E('rect',{x:-40,y:-40,width:1160,height:1430,fill:'url(#dots)'});
// ---- title ----
T(svg,54,84,'MCP stopped',64,TXT,'BR',800,'start',-1.5);
var t2=T(svg,54,150,'remembering ',64,TXT,'BR',800,'start',-1.5);E('tspan',{fill:RED},t2,'you');
T(svg,54,188,'spec 2026-07-28 · every request now carries its own label',22,MUTE,'IN',500);
// ---- BEFORE panel ----
var bp=E('g',{});E('rect',{x:54,y:208,width:972,height:122,rx:14,fill:PANEL,stroke:RED,'stroke-width':2.5,'stroke-dasharray':'10 8'},bp);
E('rect',{x:74,y:196,width:104,height:30,rx:15,fill:RED},bp);T(bp,126,217,'BEFORE',19,BG,'JB',700,'middle');
E('rect',{x:80,y:240,width:250,height:76,rx:8,fill:'#1f2834',stroke:LINE,'stroke-width':2},bp);
var jacks=[];for(var r=0;r<2;r++)for(var c=0;c<5;c++){var jx=106+c*48,jy=262+r*34;E('circle',{cx:jx,cy:jy,r:9,fill:BG,stroke:'#46566a','stroke-width':2.5},bp);jacks.push(E('circle',{cx:jx,cy:jy,r:4,fill:RED,opacity:.0},bp));}
var cords=[0,1,2].map(function(i){return E('path',{d:'',fill:'none',stroke:['#7a8aa0','#5d6f87','#93a3b8'][i],'stroke-width':3.5,'stroke-linecap':'round'},bp);});
ICON(bp,'user',352,252,2.2,MUTE,1.7);
T(bp,410,266,'sticky sessions',22,TXT,'IN',700);T(bp,410,298,'a server remembers each caller',21,MUTE,'IN',500);
var tag=E('g',{},bp);E('rect',{x:776,y:236,width:228,height:42,rx:8,fill:BG,stroke:LINE,'stroke-width':2},tag);T(tag,790,265,'Mcp-Session-Id',20,TXT,'JB',700);
var strike=E('line',{x1:786,y1:257,x2:994,y2:257,stroke:RED,'stroke-width':6,'stroke-linecap':'round'},bp);
var stamp=E('g',{},bp);E('rect',{x:830,y:286,width:150,height:30,rx:5,fill:'none',stroke:RED,'stroke-width':3},stamp);T(stamp,905,308,'REMOVED',19,RED,'JB',700,'middle');
// ---- clients / gateway / workers ----
var XS=[225,435,645,855],CL=[['AGENT','robot'],['IDE','device-desktop'],['CHAT','user'],['CRON','cpu']];
pill(1,54,338,500,'EVERY REQUEST CARRIES ITS OWN LABEL');
var clg=E('g',{});
XS.forEach(function(x,i){var g=E('g',{},clg);E('rect',{x:x-78,y:392,width:156,height:56,rx:12,fill:PANEL,stroke:BLUE,'stroke-width':2.5},g);ICON(g,CL[i][1],x-62,404,1.35,BLUE,1.8);T(g,x-20,428,CL[i][0],20,TXT,'JB',700);});
// lanes
var lanes=[];
function lane(x1,y1,x2,y2,col){return E('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:col,'stroke-width':3,'stroke-dasharray':'5 11','stroke-linecap':'round',opacity:.55});}
XS.forEach(function(x){lanes.push({e:lane(x-30,448,x-30,578,BLUE),dir:1});lanes.push({e:lane(x-30,608,x-30,700,BLUE),dir:1});lanes.push({e:lane(x+30,448,x+30,640,GREEN),dir:-1});lanes.push({e:lane(x+30,640,x+30,700,GREEN),dir:-1});});
lanes.push({e:lane(255,640,885,640,GREEN),dir:1});
// gateway
var gw=E('g',{});E('rect',{x:105,y:520,width:870,height:88,rx:14,fill:PANEL,stroke:'#46566a','stroke-width':3},gw);
var beam=E('rect',{x:105,y:524,width:46,height:80,rx:10,fill:BLUE,opacity:.22},gw);
var lamps=XS.map(function(x){return E('circle',{cx:x-30,cy:598,r:6,fill:BLUE,opacity:.25},gw);});
for(var tk0=0;tk0<58;tk0++){E('line',{x1:125+tk0*14.5,y1:530,x2:125+tk0*14.5,y2:(tk0%5==0?546:538),stroke:'#3a4a5e','stroke-width':2},gw);}
pill(2,54,470,640,'GATEWAY READS HEADERS ONLY · body stays sealed');
// workers
var WK=[];
XS.forEach(function(x,i){var g=E('g',{});E('rect',{x:x-92,y:700,width:184,height:92,rx:12,fill:PANEL,stroke:GREEN,'stroke-width':2.5},g);
 var gl=E('rect',{x:x-92,y:700,width:184,height:92,rx:12,fill:GREEN,opacity:0},g);
 ICON(g,'server',x-80,738,1.5,GREEN,1.7);T(g,x-38,745,'SERVER '+(i+1),20,TXT,'JB',700);T(g,x-38,775,'no memory',19,MUTE,'IN',500);WK.push(gl);});
pill(3,54,806,720,'ANY SERVER CAN ANSWER · round-robin, no stickiness');
// legend row 4 & 5
var l4=E('g',{});E('rect',{x:54,y:862,width:478,height:72,rx:14,fill:PANEL,stroke:KRAFT,'stroke-width':2.5},l4);
ICON(l4,'ticket',72,880,1.9,KRAFT,1.7);E('circle',{cx:70,cy:870,r:14,fill:RED},l4);T(l4,70,877,'4',19,'#fff','JB',700,'middle');
T(l4,128,893,'state is a handle',22,TXT,'IN',700);T(l4,128,919,'the model passes it back',19,MUTE,'IN',500);
var l5=E('g',{});E('rect',{x:548,y:862,width:478,height:72,rx:14,fill:PANEL,stroke:RED,'stroke-width':2.5},l5);
E('rect',{x:568,y:882,width:46,height:32,rx:5,fill:RED},l5);T(l5,591,906,'?',24,'#fff','JB',700,'middle');E('circle',{cx:564,cy:870,r:14,fill:RED},l5);T(l5,564,877,'5',19,'#fff','JB',700,'middle');
T(l5,632,893,'mid-call question',22,TXT,'IN',700);T(l5,632,919,'input_required → retry',19,MUTE,'IN',500);
// ---- bottom cards ----
var c1=E('g',{});E('rect',{x:54,y:954,width:468,height:214,rx:14,fill:PANEL,stroke:LINE,'stroke-width':2},c1);
T(c1,76,988,'12-MONTH OFF-RAMP',20,AMB,'JB',700);
E('circle',{cx:150,cy:1074,r:52,fill:'none',stroke:LINE,'stroke-width':8},c1);
var sweep=E('circle',{cx:150,cy:1074,r:52,fill:'none',stroke:AMB,'stroke-width':8,'stroke-dasharray':'82 245','stroke-linecap':'round'},c1);
T(c1,150,1076,'12',34,TXT,'BR',800,'middle');T(c1,150,1100,'months',18,MUTE,'IN',500,'middle');
var DEP=['Roots','Sampling','Logging','HTTP+SSE'],depR=[];
DEP.forEach(function(d,i){var y=1030+i*31,g=E('g',{},c1);E('rect',{x:240,y:y-21,width:262,height:27,rx:7,fill:AMB,opacity:.0},g);T(g,252,y,d,21,TXT,'JB',700);T(g,490,y,'deprecated',18,AMB,'IN',500,'end');depR.push(g.firstChild);});
T(c1,240,1164,'still work for at least a year',18,MUTE,'IN',500);
var c2=E('g',{});E('rect',{x:558,y:954,width:468,height:214,rx:14,fill:PANEL,stroke:LINE,'stroke-width':2},c2);
T(c2,580,988,'SDKs ON 2026-07-28',20,GREEN,'JB',700);
var SDK=[['TS',GREEN],['PY',GREEN],['GO',GREEN],['C#',GREEN],['RUST β',AMB]],sdkE=[];
SDK.forEach(function(s,i){var x=580+i*86,w=i<4?74:96;if(i==4)x=580+4*86-0;var g=E('g',{},c2);var r=E('rect',{x:x,y:1006,width:w,height:40,rx:9,fill:BG,stroke:s[1],'stroke-width':2.5},g);T(g,x+w/2,1033,s[0],19,TXT,'JB',700,'middle');sdkE.push(r);});
var bars=[];for(var b=0;b<18;b++){bars.push(E('rect',{x:582+b*23,y:1090,width:15,height:10,rx:4,fill:BLUE,opacity:.9},c2));}
T(c2,580,1160,'≈ 0.5B downloads / month (Tier-1 SDKs)',20,TXT,'IN',700);
// ticker
E('rect',{x:54,y:1192,width:972,height:48,rx:12,fill:PANEL,stroke:LINE,'stroke-width':2});
var cp=E('clipPath',{id:'tk'},df);E('rect',{x:60,y:1194,width:960,height:44},cp);
var tk=E('g',{'clip-path':'url(#tk)'});
var MSG='NO Mcp-Session-Id  ·  NO initialize  ·  ANY SERVER ANSWERS  ·  HANDLES, NOT SESSIONS  ·  input_required → RETRY  ·  ROUND-ROBIN WORKS  ·  ';
var tk1=T(tk,0,1224,MSG,20,KRAFT,'JB',700),tk2=T(tk,0,1224,MSG,20,KRAFT,'JB',700);
tk1.setAttribute('textLength',1500);tk2.setAttribute('textLength',1500);tk1.setAttribute('lengthAdjust','spacing');tk2.setAttribute('lengthAdjust','spacing');
T(svg,54,1285,'illustrative sketch · based on the official MCP 2026-07-28 release notes',19,MUTE,'IN',500);
// ---- letters ----
function env(col){var g=E('g',{});var body=E('rect',{x:-23,y:-15,width:46,height:30,rx:5,fill:'#f2e6c9',stroke:col,'stroke-width':3.5},g);E('path',{d:'M-22 -13L0 3L22 -13',fill:'none',stroke:col,'stroke-width':2.5},g);
  var q=T(g,0,8,'?',22,'#fff','JB',700,'middle');q.setAttribute('opacity',0);
  var tkt=E('g',{opacity:0},g);E('rect',{x:10,y:-28,width:26,height:18,rx:4,fill:KRAFT,stroke:BG,'stroke-width':2},tkt);E('circle',{cx:16,cy:-19,r:2.5,fill:BG},tkt);
  var ans=E('circle',{cx:-17,cy:-14,r:6,fill:GREEN,stroke:BG,'stroke-width':2,opacity:0},g);
  return {g:g,body:body,q:q,tkt:tkt,ans:ans};}
var IT=[];
for(var i=0;i<4;i++)for(var j=0;j<2;j++)IT.push({i:i,j:j,s:i*1.0+j*4,w:(i+1+j)%4,e:env(BLUE)});
PILLS.forEach(function(g){svg.appendChild(g);});
function along(pts,u){var L=[],tot=0,k;for(k=0;k<pts.length-1;k++){var l=Math.abs(pts[k+1][0]-pts[k][0])+Math.abs(pts[k+1][1]-pts[k][1]);L.push(l);tot+=l;}
  var d=clamp(u,0,1)*tot;for(k=0;k<L.length;k++){if(d<=L[k]||k==L.length-1){var f=L[k]?clamp(d/L[k],0,1):1;return [pts[k][0]+(pts[k+1][0]-pts[k][0])*f,pts[k][1]+(pts[k+1][1]-pts[k][1])*f];}d-=L[k];}}
function seek(t){
  t=((t%DUR)+DUR)%DUR;
  bgd.setAttribute('transform','translate('+(t/DUR*36).toFixed(2)+','+(t/DUR*36).toFixed(2)+')');
  // old panel
  cords.forEach(function(c,i){var sw=Math.sin(t/DUR*TAU*2+i)*7;c.setAttribute('d','M'+(106+i*96)+' 262Q'+(230+i*20)+' '+(300+sw)+' 352 276');});
  jacks.forEach(function(j,i){j.setAttribute('opacity',(.18+.15*Math.sin(t/DUR*TAU*3+i*1.7)).toFixed(2));});
  var p=1;if(t>5&&t<6.4){p=1-sm((t-5)/.4)*(1-sm((t-6)/.4));}
  strike.setAttribute('x2',(786+208*p).toFixed(1));stamp.setAttribute('transform','rotate('+(-3+Math.sin(t/DUR*TAU*2)*1.5)+' 905 301)');
  // lanes
  lanes.forEach(function(l){l.e.setAttribute('stroke-dashoffset',(-l.dir*frac(t/DUR*2)*16*-1).toFixed(2));});
  beam.setAttribute('x',(105+frac(t/4)*(870-46)).toFixed(1));
  var wl=[0,0,0,0],lp=[0,0,0,0];
  IT.forEach(function(it){var ph=((t-it.s)%DUR+DUR)%DUR,cx=XS[it.i],wx=XS[it.w],pos,op=1,
      reqPts=[[cx-30,448],[cx-30,578],[wx-30,578],[wx-30,700]],repPts=[[wx+30,700],[wx+30,640],[cx+30,640],[cx+30,448]];
    var special=(it.i==2&&it.j==1),retry=(it.i==2&&it.j==0),tick0=(it.i==0&&it.j==0),tick1=(it.i==0&&it.j==1);
    var col=BLUE,reply=false;
    if(ph<1.5){pos=along(reqPts,ph/1.5);op=sm(ph/.12);
      var inG=ph/1.5;if(inG>.3&&inG<.64){var xr=pos[0];for(var k=0;k<4;k++){if(Math.abs(xr-(XS[k]-30))<50)lp[k]=Math.max(lp[k],1-Math.abs(xr-(XS[k]-30))/50);}}}
    else if(ph<2.0){pos=[wx-30,700+ (ph-1.5)/.5*22];op=1-sm((ph-1.7)/.3);wl[it.w]=Math.max(wl[it.w],Math.sin(sm((ph-1.5)/.5)*Math.PI));}
    else if(ph<3.7){reply=true;pos=along(repPts,(ph-2.0)/1.7);op=sm((ph-2.0)/.2)*(1-sm((ph-3.5)/.2));wl[it.w]=Math.max(wl[it.w],0.5*(1-sm((ph-2.0)/.3)));}
    else {pos=[cx-30,448];op=0;}
    it.e.g.setAttribute('transform','translate('+pos[0].toFixed(1)+','+pos[1].toFixed(1)+')');it.e.g.setAttribute('opacity',op.toFixed(2));
    var rc=reply?(special?RED:GREEN):BLUE;it.e.body.setAttribute('stroke',rc);if(reply&&special){it.e.body.setAttribute('fill',RED);}else it.e.body.setAttribute('fill','#f2e6c9');
    it.e.q.setAttribute('opacity',(reply&&special)?1:0);
    it.e.tkt.setAttribute('opacity',((tick0&&reply)||(tick1&&!reply))?1:0);
    it.e.ans.setAttribute('opacity',(retry&&!reply)?1:0);
  });
  WK.forEach(function(w,i){w.setAttribute('opacity',(.3*wl[i]).toFixed(3));});
  lamps.forEach(function(l,i){l.setAttribute('opacity',(.25+.75*lp[i]).toFixed(2));});
  // off-ramp ring + rows
  sweep.setAttribute('transform','rotate('+(t/DUR*360-90)+' 150 1074)');
  depR.forEach(function(r,i){var q=((t/DUR*4)-i)%4;if(q<0)q+=4;r.setAttribute('opacity',(q<1?.22*Math.sin(q*Math.PI):0).toFixed(3));});
  // sdk checks + bars
  sdkE.forEach(function(r,i){var q=((t/DUR*5)-i)%5;if(q<0)q+=5;r.setAttribute('stroke-width',(2.5+(q<1?3*Math.sin(q*Math.PI):0)).toFixed(1));});
  bars.forEach(function(b,i){var h=10+26*(.5+.5*Math.sin(t/DUR*TAU*2+i*.7))*(.6+.4*Math.sin(t/DUR*TAU+i*1.3));b.setAttribute('height',h.toFixed(1));b.setAttribute('y',(1126-h).toFixed(1));});
  // ticker
  var sh=frac(t/DUR)*1500;tk1.setAttribute('x',(66-sh).toFixed(1));tk2.setAttribute('x',(66-sh+1500).toFixed(1));
}
window.__reelDurationSec=DUR;window.__seek=function(t){seek(t);};
function boot(){seek(0);}
Promise.all(["800 40px BR","500 20px IN","700 20px IN","700 20px JB"].map(function(f){return document.fonts.load(f);})).then(function(){return document.fonts.ready;}).then(boot,boot);
})();
