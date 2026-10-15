(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,W=2*Math.PI/DUR;
var BG='#eef1f7',INK='#0f172a',MUTE='#475569',LINE='#c4cbe0',IND='#4f46e5',BLU='#2563eb',TEAL='#0d9488',SLATE='#475569',OK='#10b981',NO='#f43f5e',AMB='#f59e0b';
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
var svg=document.getElementById('s');
E('rect',{width:1600,height:900,fill:BG});
var defs=E('defs',{});var gp=E('pattern',{id:'grid',width:40,height:40,patternUnits:'userSpaceOnUse'},defs);E('path',{d:'M40 0H0V40',fill:'none',stroke:'#e1e6f0','stroke-width':1.5},gp);
var grid=E('rect',{x:-40,y:-40,width:1700,height:1000,fill:'url(#grid)'});
// ---------- iso helpers ----------
var CX=470,U=34,AX=.866*U,AY=.28*U;
function P(x,y,z,cy){return [CX+((x-4)-(y-4))*AX,cy+((x-4)+(y-4))*AY-(z||0)];}
function poly(pts,fill,stroke,sw,par,op){return E('polygon',{points:pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' '),fill:fill,stroke:stroke||'none','stroke-width':sw||0,opacity:op==null?1:op},par);}
function shade(hex,f){var n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;return '#'+[r,g,b].map(function(v){return Math.max(0,Math.min(255,Math.round(v*f))).toString(16).padStart(2,'0');}).join('');}
function ICON(par,name,x,y,s,col){var g=E('g',{transform:'translate('+x+','+y+') scale('+s+')',fill:'none',stroke:col,'stroke-width':1.9,'stroke-linecap':'round','stroke-linejoin':'round'},par);g.innerHTML=window.ICONS[name]||'';return g;}
function cube(par,gx,gy,s,h,cy,col,ic,label){
  var g=E('g',{},par);
  poly([P(gx,gy+s,0,cy),P(gx+s,gy+s,0,cy),P(gx+s,gy+s,h,cy),P(gx,gy+s,h,cy)],shade(col,.78),'none',0,g);
  poly([P(gx+s,gy,0,cy),P(gx+s,gy+s,0,cy),P(gx+s,gy+s,h,cy),P(gx+s,gy,h,cy)],shade(col,.6),'none',0,g);
  poly([P(gx,gy,h,cy),P(gx+s,gy,h,cy),P(gx+s,gy+s,h,cy),P(gx,gy+s,h,cy)],col,'none',0,g);
  var c=P(gx+s/2,gy+s/2,h,cy);if(ic)ICON(g,ic,c[0]-11,c[1]-12,.95,'#ffffff');
  return g;}
// ---------- plates ----------
var LAYERS=[{cy:250,col:IND,name:'L1 · IDENTITY & POLICY'},{cy:430,col:BLU,name:'L2 · TOOL GATEWAY'},{cy:610,col:TEAL,name:'L3 · SANDBOX'},{cy:790,col:SLATE,name:'L4 · RESOURCES'}];
var plateEls=[];
for(var li=LAYERS.length-1;li>=0;li--){}
LAYERS.forEach(function(L,i){
  var g=E('g',{});var cy=L.cy,th=16;
  poly([P(0,8,0,cy),P(8,8,0,cy),P(8,8,-th,cy),P(0,8,-th,cy)],'#cfd6ea','none',0,g);
  poly([P(8,0,0,cy),P(8,8,0,cy),P(8,8,-th,cy),P(8,0,-th,cy)],'#b9c2dd','none',0,g);
  poly([P(0,0,0,cy),P(8,0,0,cy),P(8,8,0,cy),P(0,8,0,cy)],'#ffffff',L.col,3,g);
  for(var k=1;k<8;k++){E('line',{x1:P(k,0,0,cy)[0],y1:P(k,0,0,cy)[1],x2:P(k,8,0,cy)[0],y2:P(k,8,0,cy)[1],stroke:'#e6eaf5','stroke-width':1.5},g);E('line',{x1:P(0,k,0,cy)[0],y1:P(0,k,0,cy)[1],x2:P(8,k,0,cy)[0],y2:P(8,k,0,cy)[1],stroke:'#e6eaf5','stroke-width':1.5},g);}
  poly([P(0,0,0,cy),P(8,0,0,cy),P(8,8,0,cy),P(0,8,0,cy)],L.col,'none',0,g,.07);
  // layer chip
  var cw=232,chip=E('g',{},g);E('rect',{x:20,y:cy-82,width:cw,height:36,rx:18,fill:L.col},chip);E('text',{x:36,y:cy-58,fill:'#ffffff','font-family':'PJ','font-weight':800,'font-size':16,'letter-spacing':'.4'},chip,L.name);
  plateEls.push(g);});
// ---------- plate contents ----------
var LX=[CX-95,CX,CX+95];
function gate(cy,x,col,ic,w,h){var g=E('g',{});E('rect',{x:x-w/2,y:cy-h,width:w,height:h,rx:8,fill:col,opacity:.14,stroke:col,'stroke-width':3});E('rect',{x:x-w/2,y:cy-h,width:w,height:h,rx:8,fill:'none',stroke:col,'stroke-width':3});ICON(g,ic,x-11,cy-h+8,.95,col);return g;}
// L1 identity: three key gates + IAM/Policy cubes
var gates1=LX.map(function(x,i){return gate(250,x,IND,'key',46,66);});
cube(svg,.6,5.6,1.5,30,250,IND,'shield-check');cube(svg,5.8,5.6,1.5,30,250,IND,'brain');
// L2 gateway: allow gate, deny barrier, approval booth
var g2a=gate(430,LX[0],OK,'checklist',46,66);
var g2d=E('g',{});E('rect',{x:LX[1]-30,y:430-52,width:60,height:52,rx:6,fill:NO,opacity:.15});E('rect',{x:LX[1]-30,y:430-52,width:60,height:52,rx:6,fill:'none',stroke:NO,'stroke-width':3.5});ICON(g2d,'x',LX[1]-12,430-44,1.05,NO);
var g2p=gate(430,LX[2],AMB,'user',50,70);
cube(svg,.6,5.6,1.5,30,430,BLU,'settings');cube(svg,5.8,5.6,1.5,30,430,BLU,'terminal-2');
// L3 sandbox
var sbx=E('g',{});var cy3=610;poly([P(1.2,1.4,0,cy3),P(6.8,1.4,0,cy3),P(6.8,6.6,0,cy3),P(1.2,6.6,0,cy3)],TEAL,TEAL,3,sbx,.12);
poly([P(1.2,1.4,0,cy3),P(6.8,1.4,0,cy3),P(6.8,6.6,0,cy3),P(1.2,6.6,0,cy3)],'none',TEAL,3,sbx).setAttribute('stroke-dasharray','10 8');
var sbp=P(1.7,5.0,0,cy3);var sbL=ICON(sbx,'lock',sbp[0]-8,sbp[1]-12,.95,TEAL);E('text',{x:sbp[0]+20,y:sbp[1]+6,fill:TEAL,'font-family':'JB','font-weight':700,'font-size':14},sbx,'ISOLATED');
cube(svg,.6,6.2,1.3,26,610,TEAL,'package');cube(svg,6,6.2,1.3,26,610,TEAL,'terminal-2');
// egress denied arrow (right side of plate 3)
var eg=E('g',{});var ex=P(6.8,3.8,26,610);E('path',{d:'M'+ex[0]+' '+ex[1]+'L'+(ex[0]+70)+' '+(ex[1]-14),fill:'none',stroke:NO,'stroke-width':4,'stroke-dasharray':'8 7','stroke-linecap':'round'},eg);E('circle',{cx:ex[0]+80,cy:ex[1]-16,r:15,fill:'#ffffff',stroke:NO,'stroke-width':4},eg);ICON(eg,'x',ex[0]+68,ex[1]-28,1.0,NO);
E('text',{x:ex[0]+4,y:ex[1]-38,fill:NO,'font-family':'JB','font-weight':700,'font-size':14},eg,'EGRESS: DENY');
// L4 resources
var res=[cube(svg,1.2,2.4,1.6,36,790,SLATE,'database'),cube(svg,3.4,2.4,1.6,36,790,SLATE,'plug'),cube(svg,5.6,2.4,1.6,36,790,SLATE,'file-text')];
// agent
var agentY=108;var ag=cube(svg,3.1,3.1,1.8,46,agentY,IND,'robot');
var agtxt=E('text',{x:CX+72,y:agentY+8,fill:INK,'font-family':'PJ','font-weight':800,'font-size':17},svg,'AI AGENT');
// ---------- audit column ----------
var AU=812;E('rect',{x:AU-28,y:120,width:56,height:700,rx:28,fill:'#ffffff',stroke:LINE,'stroke-width':3});
var logs=[];for(var q=0;q<12;q++)logs.push(E('rect',{x:AU-14,y:0,width:28,height:7,rx:3,fill:IND,opacity:.5}));
var clp=E('clipPath',{id:'auc'},defs);E('rect',{x:AU-28,y:150,width:56,height:640},clp);logs.forEach(function(l){l.setAttribute('clip-path','url(#auc)');});
var eye=ICON(svg,'eye',AU-14,128,1.15,IND);
var kill=E('g',{});E('circle',{cx:AU,cy:830,r:26,fill:NO,stroke:'#ffffff','stroke-width':4},kill);E('circle',{cx:AU,cy:830,r:34,fill:'none',stroke:NO,'stroke-width':3,opacity:.5},kill);ICON(kill,'player-stop',AU-12,818,1.0,'#ffffff');
// ---------- right panel ----------
var title=E('text',{x:960,y:96,fill:INK,'font-family':'PJ','font-weight':800,'font-size':58,'letter-spacing':'-1.2'},svg,'Securing AI agents');
E('text',{x:960,y:136,fill:MUTE,'font-family':'IN','font-weight':600,'font-size':23},svg,'A zero-trust reference architecture');
var news=E('g',{});E('rect',{x:960,y:158,width:600,height:62,rx:12,fill:'#ffffff',stroke:NO,'stroke-width':2.5},news);var nd=E('circle',{cx:986,cy:189,r:7,fill:NO},news);
E('text',{x:1006,y:184,fill:INK,'font-family':'IN','font-weight':600,'font-size':18},news,'Oct 2026: OpenAI notified 100+ organizations of');E('text',{x:1006,y:207,fill:INK,'font-family':'IN','font-weight':600,'font-size':18},news,'unauthorized agent activity ("not the ideal restrictions")');
var ITEMS=[
 {n:1,t:'Per-agent identity',d:'Short-lived, scoped credentials. Never a shared key. (OWASP ASI03)',col:IND,by:250,bx:690},
 {n:2,t:'Least-agency tools',d:'Allow-listed tools, validated parameters. (OWASP ASI02)',col:BLU,by:430,bx:690},
 {n:3,t:'Human approval',d:'A person signs off on irreversible actions.',col:AMB,by:480,bx:640},
 {n:4,t:'Sandboxed execution',d:'Isolated runtime, deny-by-default egress. (OWASP ASI05)',col:TEAL,by:610,bx:690},
 {n:5,t:'Audit + kill switch',d:'Immutable logs of every call. Revoke in one click.',col:NO,by:140,bx:AU+28}];
var IY=[290,400,510,620,730],lead=[];
ITEMS.forEach(function(it,i){var y=IY[i];
  var path='M'+it.bx+' '+it.by+'H'+(870+i*13)+'V'+(y+4)+'H935';
  var l=E('path',{d:path,fill:'none',stroke:it.col,'stroke-width':3,'stroke-dasharray':'2 12','stroke-linecap':'round'});lead.push(l);
  E('rect',{x:940,y:y-38,width:620,height:92,rx:14,fill:'#ffffff',stroke:'#dfe4f1','stroke-width':2});
  E('rect',{x:940,y:y-38,width:8,height:92,rx:4,fill:it.col});
  E('circle',{cx:986,cy:y+8,r:22,fill:it.col});E('text',{x:986,y:y+16,'text-anchor':'middle',fill:'#ffffff','font-family':'PJ','font-weight':800,'font-size':24},svg,String(it.n));
  E('text',{x:1026,y:y-6,fill:INK,'font-family':'PJ','font-weight':800,'font-size':26},svg,it.t);
  var words=it.d.split(' '),lines=[],cur='';words.forEach(function(w){if((cur+' '+w).trim().length>46){lines.push(cur);cur=w;}else cur=(cur+' '+w).trim();});lines.push(cur);
  lines.forEach(function(ln,k){E('text',{x:1026,y:y+22+k*22,fill:MUTE,'font-family':'IN','font-weight':500,'font-size':18},svg,ln);});
  // badge on diagram
  var b=E('g',{});E('circle',{cx:it.bx,cy:it.by,r:17,fill:it.col,stroke:'#ffffff','stroke-width':3.5},b);E('text',{x:it.bx,y:it.by+6,'text-anchor':'middle',fill:'#ffffff','font-family':'PJ','font-weight':800,'font-size':18},b,String(it.n));it.glow=E('circle',{cx:it.bx,cy:it.by,r:26,fill:it.col,opacity:0},b);});
E('text',{x:960,y:852,fill:'#7c8aa5','font-family':'IN','font-weight':500,'font-size':15},svg,'Sources: OWASP Top 10 for Agentic Applications (2026);');E('text',{x:960,y:872,fill:'#7c8aa5','font-family':'IN','font-weight':500,'font-size':15},svg,'OpenAI disclosure via press reports (Oct 1, 2026). Reference design.');
E('text',{x:1560,y:812,'text-anchor':'end',fill:INK,'font-family':'PJ','font-weight':800,'font-size':20},svg,'@sandesh.explains');
// ---------- packets ----------
function kf(frames,u){for(var i=0;i<frames.length-1;i++){var a=frames[i],b=frames[i+1];if(u>=a[0]&&u<=b[0]){var q=sm((u-a[0])/(b[0]-a[0]||1));return a[1]+(b[1]-a[1])*q;}}return frames[frames.length-1][1];}
var ALLOW=[[0,agentY+10],[.12,250],[.26,430],[.52,610],[.72,790],[1,790]];
var DENY=[[0,agentY+10],[.12,250],[.34,418],[.46,418],[.64,250],[.8,150],[1,150]];
var APPR=[[0,agentY+10],[.1,250],[.22,430],[.5,430],[.6,610],[.8,790],[1,790]];
function pk(col,lane){var g=E('g',{});var tr=E('circle',{r:7,fill:col,opacity:.35},g);var c=E('circle',{r:10,fill:col,stroke:'#ffffff','stroke-width':3.5},g);return {g:g,c:c,tr:tr,lane:lane,col:col};}
var pAllow=[pk(OK,0),pk(OK,0)],pDeny=pk(NO,1),pAppr=pk(AMB,2);
var tagDeny=E('g',{opacity:0});E('rect',{x:CX-60,y:340,width:120,height:30,rx:15,fill:NO},tagDeny);E('text',{x:CX,y:360,'text-anchor':'middle',fill:'#fff','font-family':'JB','font-weight':700,'font-size':15},tagDeny,'DENIED');
var tagOk=E('g',{opacity:0});E('rect',{x:LX[2]-44,y:340,width:100,height:30,rx:15,fill:AMB},tagOk);E('text',{x:LX[2]+6,y:360,'text-anchor':'middle',fill:'#fff','font-family':'JB','font-weight':700,'font-size':15},tagOk,'APPROVED');
var tagAllow=E('g',{opacity:.0});
function place(p,frames,u,x){var y=kf(frames,u);var a=u<.04?u/.04:(u>.92?Math.max(0,(1-u)/.08):1);p.c.setAttribute('cx',x);p.c.setAttribute('cy',y.toFixed(1));p.c.setAttribute('opacity',a.toFixed(2));p.tr.setAttribute('cx',x);p.tr.setAttribute('cy',(y-16).toFixed(1));p.tr.setAttribute('opacity',(a*.35).toFixed(2));}
// ---------- seek ----------
function seek(t){
  var ph=((t%DUR)+DUR)%DUR,p=ph/DUR;
  grid.setAttribute('transform','translate('+(-(ph*5)%40)+','+(-(ph*5)%40)+')');
  // plates float
  plateEls.forEach(function(g,i){g.setAttribute('transform','translate(0,'+(1.2*Math.sin(W*ph+i*.8)).toFixed(2)+')');});
  ag.setAttribute('transform','translate(0,'+(3*Math.sin(W*ph*2)).toFixed(2)+')');
  // packets (allowed: two, period 4s => u cycles twice per loop)
  pAllow.forEach(function(q,i){place(q,ALLOW,((p*2+i*.5)%1),LX[0]);});
  place(pDeny,DENY,((p+.15)%1),LX[1]);
  var ua=((p+.0)%1);place(pAppr,APPR,ua,LX[2]);
  // tags
  var ud=((p+.15)%1);tagDeny.setAttribute('opacity',(ud>.34&&ud<.7?sm((ud-.34)/.05)*(1-sm((ud-.62)/.08)):0).toFixed(2));tagDeny.setAttribute('transform','translate(0,'+(ud>.34&&ud<.5?(Math.sin(ud*200)*2).toFixed(1):0)+')');
  tagOk.setAttribute('opacity',(ua>.5&&ua<.68?sm((ua-.5)/.04)*(1-sm((ua-.62)/.06)):0).toFixed(2));
  // approval ring pulse during dwell
  var dw=ua>.22&&ua<.5;g2p.setAttribute('transform',dw?'translate(0,'+(-3*Math.abs(Math.sin(ph*9))).toFixed(1)+')':'');
  // gates glow when packets near (subtle global pulse)
  gates1.forEach(function(g,i){g.setAttribute('opacity',(.8+.2*Math.sin(W*ph*2+i)).toFixed(2));});
  // audit logs scroll
  logs.forEach(function(l,i){var y=150+((i*54+ph/DUR*DUR*54*12/DUR*0+ (ph/DUR)*648)%648);l.setAttribute('y',y.toFixed(1));l.setAttribute('opacity',(.25+.5*((i%3)/2)).toFixed(2));l.setAttribute('width',(14+14*((i*7)%3)/2).toFixed(1));});
  kill.setAttribute('transform','translate('+AU+',830) scale('+(1+.06*Math.sin(W*ph*2)).toFixed(3)+') translate('+(-AU)+',-830)');
  nd.setAttribute('opacity',(.55+.45*Math.sin(W*ph*4)).toFixed(2));
  // leaders flow + badge glow in order
  lead.forEach(function(l,i){l.setAttribute('stroke-dashoffset',(-ph*14*6).toFixed(1));});
  ITEMS.forEach(function(it,i){var d=((p*5-i)%5+5)%5;it.glow.setAttribute('opacity',Math.max(0,.45*(1-d/.8)).toFixed(2));it.glow.setAttribute('r',(20+10*Math.max(0,1-d/.8)).toFixed(1));});
  eg.setAttribute('opacity',(.8+.2*Math.sin(W*ph*4)).toFixed(2));
}
window.__reelDurationSec=DUR;window.__seek=function(t){seek(t);};
function boot(){document.fonts.ready.then(function(){seek(0);}).catch(function(){});}
window.addEventListener('load',boot);
})();
