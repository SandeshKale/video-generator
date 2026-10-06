(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=22;
var LIME='#c6ff3d',SKY='#66c7ff',CORAL='#ff6b4a',AMB='#ffc233',TXT='#e8f5ee',DIM='#7fa393',PANEL='#0d211a',LINE='#2a4a3d',BG='#07130f';
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function lerp(a,b,u){return a+(b-a)*u;}
function pr(t,a,b){return clamp((t-a)/(b-a),0,1);}
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||root).appendChild(e);return e;}
var svg=document.getElementById('s'),root=E('g',{},svg);
// ---------- background ----------
var defs=E('defs',{},svg);
function grad(id,c){var g=E('radialGradient',{id:id},defs);E('stop',{offset:'0','stop-color':c,'stop-opacity':.35},g);E('stop',{offset:'1','stop-color':c,'stop-opacity':0},g);}
grad('b1',LIME);grad('b2',SKY);grad('b3',CORAL);
var pat=E('pattern',{id:'dots',width:32,height:32,patternUnits:'userSpaceOnUse'},defs);E('circle',{cx:2,cy:2,r:1.3,fill:'#1d3a2f'},pat);
root.parentNode.removeChild(root);
E('rect',{width:1280,height:720,fill:BG},svg);
var blobs=[E('circle',{r:1,fill:'none'},svg),E('circle',{r:1,fill:'none'},svg),E('circle',{r:1,fill:'none'},svg)];
var dots=E('rect',{x:-40,y:-40,width:1360,height:800,fill:'url(#dots)'},svg);
svg.appendChild(root);
// ---------- layout ----------
function node(id,cx,cy,w,h,col,title,sub,ic){
  var g=E('g',{},root);
  var glow=E('rect',{x:cx-w/2-6,y:cy-h/2-6,width:w+12,height:h+12,rx:16,fill:col,opacity:0,filter:'none'},g);
  E('rect',{x:cx-w/2,y:cy-h/2,width:w,height:h,rx:12,fill:PANEL,stroke:col,'stroke-width':2},g);
  var ig=E('g',{transform:'translate('+(cx-w/2+9)+','+(cy-h/2+9)+') scale(.9)',fill:'none',stroke:col,'stroke-width':1.9,'stroke-linecap':'round','stroke-linejoin':'round'},g);ig.innerHTML=window.ICONS[ic]||'';
  E('text',{x:cx-w/2+34,y:cy-h/2+24,fill:TXT,'font-family':'BG','font-weight':800,'font-size':15,'letter-spacing':'.3'},g,title);
  E('text',{x:cx-w/2+10,y:cy+h/2-11,fill:DIM,'font-family':'JB','font-weight':500,'font-size':10.5},g,sub);
  return {g:g,glow:glow,cx:cx,cy:cy,w:w,h:h,col:col};
}
var N={};
var A=195,B=400,C=570;
N.docs=node('docs',95,A,150,64,LIME,'DOCS','pdf · wiki · tickets','file-text');
N.chunk=node('chunk',265,A,150,64,LIME,'CHUNK','semantic splits','stack-2');
N.extract=node('extract',435,A,150,64,CORAL,'EXTRACT','LLM → entities+relations','graph');
N.q=node('q',95,B,150,64,LIME,'QUESTION','multi-hop · user','message-circle');
N.plan=node('plan',265,B,150,64,CORAL,'PLANNER','agent · decompose','brain');
N.route=node('route',435,B,150,64,SKY,'ROUTER','picks the tools','hierarchy');
var SX=[700,910,1120];
N.c0=node('c0',700,B,190,64,SKY,'ANN SEARCH','dense · top-k','search');
N.c1=node('c1',910,B,190,64,SKY,'GRAPH WALK','multi-hop traversal','share-2');
N.c2=node('c2',1120,B,190,64,SKY,'BM25','lexical match','filter');
var RX=[930,775,620,465,310,155];
N.fuse=node('fuse',RX[0],C,128,64,SKY,'FUSE','reciprocal rank','stack-3');
N.rank=node('rank',RX[1],C,128,64,SKY,'RERANK','cross-encoder','chart-dots');
N.mem=node('mem',RX[2],C,128,64,LIME,'MEMORY','evidence set','notebook');
N.gen=node('gen',RX[3],C,128,64,CORAL,'GENERATE','LLM · cited draft','sparkles');
N.ver=node('ver',RX[4],C,128,64,AMB,'VERIFY','grounding check','shield-check');
N.ans=node('ans',RX[5],C,128,64,LIME,'ANSWER','+ citations','message-circle');
// stores
var ST=[];
function store(i,cx,col,label){
  var g=E('g',{},root);
  var glow=E('rect',{x:cx-101,y:114,width:202,height:162,rx:16,fill:col,opacity:0},g);
  E('rect',{x:cx-95,y:120,width:190,height:150,rx:12,fill:PANEL,stroke:col,'stroke-width':2},g);
  E('text',{x:cx-85,y:138,fill:col,'font-family':'JB','font-weight':700,'font-size':11,'letter-spacing':'1.2'},g,label);
  ST[i]={g:g,glow:glow,cx:cx,col:col};
}
store(0,700,LIME,'VECTOR INDEX');store(1,910,CORAL,'KNOWLEDGE GRAPH');store(2,1120,AMB,'KEYWORD INDEX');
// vector dots
var rng=function(s){return function(){s=(s*1664525+1013904223)%4294967296;return s/4294967296;};}(7);
var VD=[];for(var i=0;i<42;i++){var cl=i%3,cxs=[-45,25,-5][cl],cys=[-15,-25,25][cl];VD.push({x:700+cxs+(rng()-.5)*62,y:200+cys+(rng()-.5)*44,el:E('circle',{r:3.4,fill:LIME,opacity:0},root),ph:rng()*6.28});}
var qRing=E('circle',{cx:690,cy:195,r:0,fill:'none',stroke:SKY,'stroke-width':2,opacity:0},root);
// graph
var GN=[[865,175],[900,150],[945,175],[880,215],[925,225],[965,215],[900,185],[860,235],[955,160]];
var GE=[[0,1],[1,2],[0,3],[3,4],[4,5],[2,5],[1,6],[6,4],[3,7],[2,8],[6,3]];
var gEdges=GE.map(function(e){return E('line',{x1:GN[e[0]][0],y1:GN[e[0]][1],x2:GN[e[1]][0],y2:GN[e[1]][1],stroke:CORAL,'stroke-width':1.6,opacity:0},root);});
var gNodes=GN.map(function(p){return E('circle',{cx:p[0],cy:p[1],r:6,fill:PANEL,stroke:CORAL,'stroke-width':2,opacity:0},root);});
// bm25 rows
var BT=['port','strike','supplier','cost','delay'];
var bRows=BT.map(function(w,i){var y=156+i*21;var t=E('text',{x:1038,y:y+9,fill:DIM,'font-family':'JB','font-weight':500,'font-size':10.5,opacity:0},root,w);var bars=[0,1,2].map(function(k){return E('rect',{x:1098+k*26,y:y,width:20,height:11,rx:2,fill:AMB,opacity:0},root);});return {t:t,bars:bars,y:y};});
// ---------- edges ----------
var EDGES={};
function edge(k,pts,col){var d='M'+pts.map(function(p){return p[0]+' '+p[1];}).join('L');var p=E('path',{d:d,fill:'none',stroke:col||LINE,'stroke-width':2,'stroke-dasharray':'3 7','stroke-linecap':'round',opacity:.9},root);EDGES[k]={p:p,len:p.getTotalLength()};}
edge('d-c',[[95,A],[265,A]]);edge('c-e',[[265,A],[435,A]]);
SX.forEach(function(x,i){edge('e-s'+i,[[435,A],[435,100],[x,100],[x,120]]);});
edge('q-p',[[95,B],[265,B]]);edge('p-r',[[265,B],[435,B]]);
SX.forEach(function(x,i){edge('r-c'+i,[[435,B],[548,B],[548,318],[x+50,318],[x+50,B-32],[x+50,B]]);edge('c-s'+i,[[x-50,B],[x-50,276]]);edge('s-f'+i,[[x-50,276],[x-50,B],[x-50,500],[RX[0],500],[RX[0],C]]);});
for(var i=0;i<5;i++)edge('row'+i,[[RX[i],C],[RX[i+1],C]]);
edge('loop',[[RX[4],C],[RX[4],B+32]]);
edge('wholerow',[[RX[0],C],[RX[1],C],[RX[2],C],[RX[3],C],[RX[4],C]]);
// order: edges below nodes
root.insertBefore(E('g',{},root),root.firstChild);
Object.keys(EDGES).forEach(function(k){root.insertBefore(EDGES[k].p,root.firstChild);});
// ---------- packets ----------
var PK=[];
function P(k,t0,dur,col,r,rev){PK.push({k:k,t0:t0,dur:dur,col:col,r:r||5,rev:rev,el:E('circle',{r:r||5,fill:col,opacity:0},root),tl:E('circle',{r:(r||5)*.6,fill:col,opacity:0},root)});}
// indexing
[1.0,1.15,1.3].forEach(function(t){P('d-c',t,.8,LIME,5);});
[1.9,2.0,2.1,2.2,2.3].forEach(function(t){P('c-e',t,.7,LIME,4);});
P('e-s0',3.4,1.1,LIME,6);P('e-s1',3.4,1.1,CORAL,6);P('e-s2',3.4,1.1,AMB,6);
P('e-s0',3.9,1.1,LIME,4);P('e-s1',3.9,1.1,CORAL,4);P('e-s2',3.9,1.1,AMB,4);
// query
P('q-p',6.6,.6,LIME,6);P('p-r',7.7,.6,CORAL,6);P('p-r',7.85,.6,CORAL,5);
SX.forEach(function(x,i){P('r-c'+i,8.2+i*.05,1.0,SKY,6);});
SX.forEach(function(x,i){P('c-s'+i,9.2,.5,SKY,5);});
SX.forEach(function(x,i){[0,.12,.24].forEach(function(d,j){P('s-f'+i,9.7+d,1.5,[LIME,CORAL,AMB][i],5-j*.6);});});
P('row0',11.55,.45,SKY,6);P('row1',12.45,.45,SKY,6);P('row2',13.35,.45,LIME,6);P('row3',14.55,.5,CORAL,6);
P('loop',15.45,.7,CORAL,7,true);
P('p-r',16.3,.5,CORAL,6);P('r-c1',16.7,.9,SKY,6);P('c-s1',17.4,.4,SKY,5);
[0,.12].forEach(function(d){P('s-f1',17.6+d,1.5,CORAL,5);});
P('wholerow',19.3,1.2,SKY,6);
P('row4',20.5,.45,LIME,7);
// ---------- text layers ----------
var title=E('text',{x:40,y:48,fill:TXT,'font-family':'BG','font-weight':800,'font-size':32,'letter-spacing':'-.5'},root);title.innerHTML='AGENTIC <tspan fill="'+LIME+'">GRAPH</tspan>RAG';
E('text',{x:40,y:70,fill:DIM,'font-family':'JB','font-weight':500,'font-size':12},root,'how a 2026-style agentic RAG system answers a hard question');
var lg=[[LIME,'data'],[SKY,'retrieval'],[CORAL,'LLM / agent'],[AMB,'quality gate']];lg.forEach(function(l,i){var x=840+i*100;E('rect',{x:x,y:38,width:10,height:10,rx:3,fill:l[0]},root);E('text',{x:x+16,y:47,fill:DIM,'font-family':'JB','font-weight':500,'font-size':11},root,l[1]);});
E('text',{x:40,y:100,fill:LIME,'font-family':'JB','font-weight':700,'font-size':12,'letter-spacing':'1.5'},root,'① INDEXING · OFFLINE');
E('text',{x:40,y:310,fill:SKY,'font-family':'JB','font-weight':700,'font-size':12,'letter-spacing':'1.5'},root,'② QUERY AGENT LOOP · ONLINE');
// question card
var qcard=E('g',{opacity:0},root);E('rect',{x:40,y:318,width:360,height:30,rx:8,fill:'#112b21',stroke:LIME,'stroke-width':1.5},qcard);
var qtxt=E('text',{x:52,y:338,fill:TXT,'font-family':'JB','font-weight':500,'font-size':12},qcard,'');
var QS='“Which suppliers does the port strike hit?”';
// entity pills
var EP=[['Supplier A',AMB],['Port of LA',SKY],['Strike',CORAL]].map(function(e,i){var g=E('g',{opacity:0},root);var x=363+i*0;E('rect',{x:370+i*0,y:236+i*0,width:10,height:10,opacity:0},g);return {g:g,e:e,i:i};});
EP.forEach(function(o){var g=o.g;g.innerHTML='';var w=o.e[0].length*7.4+16;E('rect',{x:0,y:0,width:w,height:20,rx:10,fill:'#0d211a',stroke:o.e[1],'stroke-width':1.5},g);E('text',{x:8,y:14,fill:o.e[1],'font-family':'JB','font-weight':700,'font-size':10.5},g,o.e[0]);o.w=w;});
// sub-query pills
var SQ=[['sub-q1 suppliers',CORAL],['sub-q2 impact',CORAL]].map(function(s,i){var g=E('g',{opacity:0},root);E('rect',{x:0,y:0,width:112,height:18,rx:9,fill:'#2a1510',stroke:CORAL,'stroke-width':1.3},g);E('text',{x:8,y:13,fill:CORAL,'font-family':'JB','font-weight':700,'font-size':9.5},g,s[0]);return g;});
// under-row visuals (y 612+)
var fuseTxt=E('text',{x:RX[0],y:628,fill:SKY,'font-family':'JB','font-weight':700,'font-size':12,'text-anchor':'middle',opacity:0},root,'Σ 1 / (k + rank)');
var rb=[0,1,2,3,4].map(function(i){return E('rect',{x:RX[1]-35+i*15,y:610,width:10,height:30,rx:2,fill:SKY,opacity:0},root);});
var RH0=[.4,.9,.25,.7,.55],RH1=[1,.8,.62,.45,.3];
var evc=[0,1,2].map(function(i){var g=E('g',{opacity:0},root);E('rect',{x:RX[2]-30,y:610+i*10,width:60,height:8,rx:2,fill:[LIME,CORAL,AMB][i],opacity:.9},g);return g;});
var gtok=E('text',{x:RX[3],y:632,fill:CORAL,'font-family':'JB','font-weight':500,'font-size':10.5,'text-anchor':'middle',opacity:0},root,'');
var vtxt=E('text',{x:RX[4],y:632,fill:AMB,'font-family':'JB','font-weight':700,'font-size':11,'text-anchor':'middle',opacity:0},root,'');
var acard=E('g',{opacity:0},root);E('rect',{x:30,y:606,width:222,height:50,rx:10,fill:'#12301f',stroke:LIME,'stroke-width':2},acard);
E('text',{x:42,y:626,fill:TXT,'font-family':'JB','font-weight':700,'font-size':11},acard,'2 suppliers exposed [1][2]');
E('text',{x:42,y:643,fill:LIME,'font-family':'JB','font-weight':500,'font-size':10},acard,'illustrative example · cited');
// caption strip
var capBg=E('rect',{x:30,y:672,width:1220,height:34,rx:10,fill:'#0b1c15',stroke:LINE,'stroke-width':1.5},root);
var cap=E('text',{x:48,y:694,fill:TXT,'font-family':'JB','font-weight':700,'font-size':14},root,'');
var prog=E('rect',{x:30,y:710,width:0,height:3,fill:LIME},root);
E('text',{x:1250,y:716,'text-anchor':'end',fill:'#4f6e60','font-family':'JB','font-weight':500,'font-size':9.5},root,'reference architecture synthesised from 2026 agentic-RAG / GraphRAG surveys');
var CAPS=[[0,'① INDEXING (offline): documents are split into chunks'],[1.9,'An LLM extracts entities and relations from every chunk'],[3.4,'Three stores: vectors, a knowledge graph, a keyword index'],[5.6,'② QUERY: a multi-hop question arrives'],[7.0,'A planner agent splits it up; a router picks the tools'],[9.0,'Three retrievers run in parallel: ANN · graph walk · BM25'],[11.0,'RRF fusion merges the lists; a cross-encoder reranks the top hits'],[12.9,'Evidence goes to working memory; the LLM drafts a cited answer'],[14.9,'The verifier checks each claim against the evidence… one fails'],[16.1,'Loop reopens: the planner asks for one more graph hop'],[17.8,'New evidence flows back through fuse → rerank → memory → generate'],[19.1,'Verified ✓  The answer ships with citations']];
// ---------- helpers ----------
function pulse(n,t,a,b){var v=sm((t-a)/.15)*(1-sm((t-b)/.35));n.glow.setAttribute('opacity',(.28*v).toFixed(3));n.g.setAttribute('transform','translate(0,'+(-2*v).toFixed(2)+')');return v;}
function win(t,a,b){return sm((t-a)/.2)*(1-sm((t-b)/.3));}
function hold(t,a,b){return sm((t-a)/.25)*(1-sm((t-b)/.4));}
function seek(t){
  var A_=sm(t/.8)*(1-sm((t-21.2)/.8));root.setAttribute('opacity',A_.toFixed(3));
  // background
  blobs[0].setAttribute('cx',300+90*Math.sin(t*.3));blobs[0].setAttribute('cy',250+60*Math.cos(t*.25));
  blobs[1].setAttribute('cx',900+80*Math.cos(t*.27));blobs[1].setAttribute('cy',500+70*Math.sin(t*.22));
  blobs[2].setAttribute('cx',1100+60*Math.sin(t*.2));blobs[2].setAttribute('cy',150+50*Math.cos(t*.3));
  dots.setAttribute('transform','translate('+(-(t*6)%32)+','+(-(t*3)%32)+')');
  // edges flow
  Object.keys(EDGES).forEach(function(k){EDGES[k].p.setAttribute('stroke-dashoffset',(-t*14).toFixed(1));});
  // node pulses
  pulse(N.docs,t,.9,1.6);pulse(N.chunk,t,1.6,2.5);var ex=pulse(N.extract,t,2.4,3.6);
  pulse(N.q,t,5.6,6.8);pulse(N.plan,t,7.0,7.9);pulse(N.route,t,8.0,8.6);
  [0,1,2].forEach(function(i){pulse(N['c'+i],t,8.9,10.6);});
  pulse(N.fuse,t,11.0,11.9);pulse(N.rank,t,11.9,12.8);pulse(N.mem,t,12.8,13.7);pulse(N.gen,t,13.7,14.8);
  var pv=pulse(N.ver,t,14.8,15.9);pulse(N.plan,t,16.1,16.9);
  if(t>16.2)pulse(N.c1,t,16.5,17.5);
  pulse(N.fuse,t,17.8,18.6);pulse(N.rank,t,18.4,19.0);pulse(N.ver,t,19.1,19.9);pulse(N.ans,t,19.7,21.0);
  // entity pills
  EP.forEach(function(o,i){var a=2.7+i*.25,v=hold(t,a,4.4);var x=360+o.i*0;o.g.setAttribute('opacity',v.toFixed(3));var xs=[360,360,360];o.g.setAttribute('transform','translate('+(360)+','+(236+i*24+(1-sm((t-a)/.3))*8)+')');});
  // stores build
  var vb=pr(t,4.2,5.4),gb=pr(t,4.2,5.6),bb=pr(t,4.2,5.4);
  var vecHit=win(t,9.5,11.8),vec2=win(t,16.4,17.4);
  VD.forEach(function(d,i){var on=clamp(vb*42-i,0,1);var hi=(i%9===0)?Math.max(vecHit,0):0;d.el.setAttribute('opacity',on.toFixed(2));d.el.setAttribute('cx',(d.x+2*Math.sin(t*.9+d.ph)).toFixed(1));d.el.setAttribute('cy',(d.y+2*Math.cos(t*.8+d.ph)).toFixed(1));d.el.setAttribute('r',(3.4+2.4*hi).toFixed(1));d.el.setAttribute('fill',hi>.3?'#ffffff':LIME);});
  var rp=pr(t,9.4,10.4);qRing.setAttribute('r',(10+60*rp).toFixed(1));qRing.setAttribute('opacity',(rp>0&&rp<1?(1-rp)*.9:0).toFixed(2));
  gEdges.forEach(function(e,i){var on=clamp(gb*GE.length-i,0,1);var lit=0;var path=[[0,1],[1,6],[6,4]];e.setAttribute('opacity',(on*.8).toFixed(2));var w1=win(t,9.7,11.8);var w2=win(t,16.6,17.8);var inP=(i===0||i===7||i===3)&&w1>0;var inP2=(i===10||i===8)&&w2>0;e.setAttribute('stroke',inP||inP2?'#ffffff':CORAL);e.setAttribute('stroke-width',(1.6+(inP?w1:0)*1.8+(inP2?w2:0)*1.8).toFixed(1));});
  gNodes.forEach(function(n,i){var on=clamp(gb*GN.length-i,0,1);var hot=[0,1,6,4,5].indexOf(i)>=0?win(t,9.7+[0,0,0,0,0][0],11.8):0;var hot2=[3,7].indexOf(i)>=0?win(t,16.6,17.8):0;var h=Math.max(hot,hot2);n.setAttribute('opacity',on.toFixed(2));n.setAttribute('fill',h>.4?'#ffffff':PANEL);n.setAttribute('r',(6+3*h).toFixed(1));});
  var bmHit=win(t,9.5,11.8);
  bRows.forEach(function(r,i){var on=clamp(bb*5-i,0,1);r.t.setAttribute('opacity',on.toFixed(2));r.t.setAttribute('fill',(i<2&&bmHit>.4)?'#ffffff':DIM);r.bars.forEach(function(b,k){b.setAttribute('opacity',(on*(.45+.55*((i+k)%2)) *(1-0)).toFixed(2));b.setAttribute('fill',(i<2&&bmHit>.4)?'#ffffff':AMB);b.setAttribute('width',(8+12*clamp(on*3-k,0,1)).toFixed(1));});});
  ST[0].glow.setAttribute('opacity',(.25*Math.max(win(t,9.4,10.0),win(t,3.9,4.7)*0)).toFixed(2));
  ST[1].glow.setAttribute('opacity',(.25*Math.max(win(t,9.4,10.0),win(t,16.5,17.0))).toFixed(2));
  ST[2].glow.setAttribute('opacity',(.25*win(t,9.4,10.0)).toFixed(2));
  // question typing
  qcard.setAttribute('opacity',hold(t,5.6,12.0).toFixed(3));qtxt.textContent=QS.slice(0,Math.floor(pr(t,5.7,6.9)*QS.length));
  // sub-queries
  SQ.forEach(function(g,i){var a=hold(t,7.2+i*.2,12.2);g.setAttribute('opacity',a.toFixed(3));g.setAttribute('transform','translate(190,'+(442+i*22)+')');});
  var sq3=win(t,16.3,18.2);
  // fuse/rerank/memory/gen/verify bits
  fuseTxt.setAttribute('opacity',(hold(t,11.0,13)+hold(t,17.8,19.3)).toFixed(3));
  var sorted=sm(pr(t,11.9,12.7)),sorted2=sm(pr(t,18.4,19));
  rb.forEach(function(b,i){var h0=RH0[i],h1=RH1[i];var hh=lerp(h0,h1,Math.max(sorted,sorted2));b.setAttribute('height',(30*hh).toFixed(1));b.setAttribute('y',(640-30*hh).toFixed(1));b.setAttribute('opacity',(hold(t,11.9,13.6)+hold(t,18.4,19.9)).toFixed(3));b.setAttribute('fill',i===0&&sorted>.8?LIME:SKY);});
  evc.forEach(function(g,i){var a=hold(t,12.9+i*.15,16,0);g.setAttribute('opacity',Math.max(hold(t,12.9+i*.15,16),hold(t,18.8,20)).toFixed(3));g.setAttribute('transform','translate('+(lerp(-14,0,sm(pr(t,12.9+i*.15,13.4+i*.15))))+',0)');});
  var G1='draft: A [1] B [2]',G2='+ reroute [3]';var gs=t<16?G1.slice(0,Math.floor(pr(t,13.8,14.6)*G1.length)):G2.slice(0,Math.floor(pr(t,18.6,19.2)*G2.length));gtok.textContent=gs;gtok.setAttribute('opacity',(Math.max(hold(t,13.8,16),hold(t,18.6,20))).toFixed(3));
  var vm=t<17?'✗ 1 unsupported':'✓ 6/6 grounded';vtxt.textContent=vm;vtxt.setAttribute('fill',t<17?CORAL:LIME);vtxt.setAttribute('opacity',(Math.max(hold(t,15.0,16.9),hold(t,19.2,21.2))).toFixed(3));
  acard.setAttribute('opacity',hold(t,19.7,21.2).toFixed(3));acard.setAttribute('transform','translate(0,'+((1-sm(pr(t,19.7,20.2)))*14).toFixed(1)+')');
  // loop edge highlight
  EDGES.loop.p.setAttribute('stroke',t>15.2&&t<17?CORAL:LINE);EDGES.loop.p.setAttribute('stroke-width',t>15.2&&t<17?3:2);
  // packets
  PK.forEach(function(p){var u=(t-p.t0)/p.dur;if(u<0||u>1){p.el.setAttribute('opacity',0);p.tl.setAttribute('opacity',0);return;}var e=u*u*(3-2*u);var L=EDGES[p.k].len;var q=EDGES[p.k].p;if(p.rev)e=e;var pt=q.getPointAtLength(L*e),pt2=q.getPointAtLength(Math.max(0,L*e-12));p.el.setAttribute('cx',pt.x);p.el.setAttribute('cy',pt.y);p.el.setAttribute('opacity',Math.min(1,u*8,(1-u)*8).toFixed(2));p.tl.setAttribute('cx',pt2.x);p.tl.setAttribute('cy',pt2.y);p.tl.setAttribute('opacity',(.4*Math.min(1,u*8,(1-u)*8)).toFixed(2));});
  // caption
  var ci=0;for(var i=0;i<CAPS.length;i++)if(t>=CAPS[i][0])ci=i;var c0=CAPS[ci][0];cap.textContent=CAPS[ci][1];cap.setAttribute('opacity',(sm((t-c0)/.2)).toFixed(3));
  prog.setAttribute('width',(1220*clamp(t/DUR,0,1)).toFixed(1));
}
window.__reelDurationSec=DUR;
window.__seek=function(t){seek(t);};
function boot(){document.fonts.ready.then(function(){seek(0);window.__reelDurationSec=DUR;}).catch(function(){});}
window.addEventListener('load',boot);
})();
