(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,W=2*Math.PI/DUR;
var LIME='#c6ff3d',SKY='#66c7ff',CORAL='#ff6b4a',AMB='#ffc233',TXT='#eef8f2',SUB='#a6c9b8',PANEL='#0d211a',LINE='#2f5646',BG='#07130f';
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||root).appendChild(e);return e;}
var svg=document.getElementById('s');
E('rect',{width:1600,height:900,fill:BG},svg);
var defs=E('defs',{},svg);var pat=E('pattern',{id:'dots',width:40,height:40,patternUnits:'userSpaceOnUse'},defs);E('circle',{cx:2,cy:2,r:1.5,fill:'#1a362b'},pat);
var dots=E('rect',{x:-40,y:-40,width:1700,height:1000,fill:'url(#dots)'},svg);
var root=E('g',{},svg);
// ---------- nodes ----------
var NODES=[];
function node(cx,cy,w,h,col,title,sub,ic,tsz){
  var g=E('g',{},root);var glow=E('rect',{x:cx-w/2-7,y:cy-h/2-7,width:w+14,height:h+14,rx:18,fill:col,opacity:.1},g);
  E('rect',{x:cx-w/2,y:cy-h/2,width:w,height:h,rx:13,fill:PANEL,stroke:col,'stroke-width':2.5},g);
  var ig=E('g',{transform:'translate('+(cx-w/2+11)+','+(cy-h/2+12)+') scale(1.1)',fill:'none',stroke:col,'stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round'},g);ig.innerHTML=window.ICONS[ic]||'';
  E('text',{x:cx-w/2+44,y:cy-h/2+31,fill:TXT,'font-family':'BG','font-weight':800,'font-size':tsz||21},g,title);
  E('text',{x:cx-w/2+12,y:cy+h/2-14,fill:SUB,'font-family':'JB','font-weight':500,'font-size':14},g,sub);
  var o={g:g,glow:glow,ph:NODES.length*.9};NODES.push(o);return o;
}
var A=250,B=540,C=790;
node(130,A,180,86,LIME,'DOCS','pdf·wiki·tickets','file-text');
node(350,A,180,86,LIME,'CHUNK','semantic splits','stack-2');
node(570,A,180,86,CORAL,'EXTRACT','entities+relations','graph');
node(130,B,180,86,LIME,'QUESTION','multi-hop ask','message-circle');
node(350,B,180,86,CORAL,'PLANNER','agent · decompose','brain');
node(570,B,180,86,SKY,'ROUTER','picks the tools','hierarchy');
var SX=[880,1150,1420];
node(880,B,250,86,SKY,'ANN SEARCH','dense · top-k vectors','search');
node(1150,B,250,86,SKY,'GRAPH WALK','multi-hop traversal','share-2');
node(1420,B,250,86,SKY,'BM25','lexical keyword match','filter');
var RX=[1250,1055,860,665,470,275];
node(RX[0],C,150,86,SKY,'FUSE','RRF merge','stack-3',18);
node(RX[1],C,150,86,SKY,'RERANK','cross-encoder','chart-dots',18);
node(RX[2],C,150,86,LIME,'MEMORY','evidence set','notebook',18);
node(RX[3],C,150,86,CORAL,'GENERATE','cited draft','sparkles',18);
node(RX[4],C,150,86,AMB,'VERIFY','grounding','shield-check',18);
node(RX[5],C,150,86,LIME,'ANSWER','+ citations','message-circle',18);
// ---------- stores ----------
var STG=[];
function store(cx,col,label){var g=E('g',{},root);var glow=E('rect',{x:cx-132,y:148,width:264,height:206,rx:18,fill:col,opacity:.1},g);E('rect',{x:cx-125,y:155,width:250,height:190,rx:13,fill:PANEL,stroke:col,'stroke-width':2.5},g);E('text',{x:cx-112,y:181,fill:col,'font-family':'JB','font-weight':700,'font-size':15,'letter-spacing':'1.2'},g,label);STG.push({glow:glow,ph:STG.length*1.7});}
store(880,LIME,'VECTOR INDEX');store(1150,CORAL,'KNOWLEDGE GRAPH');store(1420,AMB,'KEYWORD INDEX');
var rng=function(s){return function(){s=(s*1664525+1013904223)%4294967296;return s/4294967296;};}(11);
var VD=[];for(var i=0;i<54;i++){var cl=i%3,cx0=[-62,40,-8][cl],cy0=[-12,-30,34][cl];VD.push({x:880+cx0+(rng()-.5)*84,y:268+cy0+(rng()-.5)*54,ph:rng()*6.28,el:E('circle',{r:4,fill:LIME},root)});}
var qRing=E('circle',{cx:850,cy:262,r:0,fill:'none',stroke:SKY,'stroke-width':2.5},root);
var GN=[[1075,235],[1120,205],[1180,235],[1100,285],[1160,300],[1215,285],[1135,255],[1085,325],[1230,215],[1195,265]];
var GE=[[0,1],[1,2],[0,3],[3,4],[4,5],[2,5],[1,6],[6,4],[3,7],[2,8],[6,3],[2,9],[9,5]];
var gEdges=GE.map(function(e){return E('line',{x1:GN[e[0]][0],y1:GN[e[0]][1],x2:GN[e[1]][0],y2:GN[e[1]][1],stroke:CORAL,'stroke-width':2,opacity:.8},root);});
var gNodes=GN.map(function(p){return E('circle',{cx:p[0],cy:p[1],r:7,fill:PANEL,stroke:CORAL,'stroke-width':2.5},root);});
var BT=['port','strike','supplier','cost','delay'];
var bRows=BT.map(function(w,i){var y=198+i*29;E('text',{x:1316,y:y+13,fill:SUB,'font-family':'JB','font-weight':500,'font-size':14},root,w);var bars=[0,1,2].map(function(k){return E('rect',{x:1397+k*32,y:y,width:26,height:15,rx:3,fill:AMB},root);});return {bars:bars,y:y};});
// ---------- edges ----------
var EDGES={},ORDER=[];
function edge(k,pts,col,dur){
  var d='M'+pts.map(function(p){return p[0]+' '+p[1];}).join('L');
  var base=E('path',{d:d,fill:'none',stroke:LINE,'stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'},root);
  var flow=E('path',{d:d,fill:'none',stroke:col,'stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round','stroke-dasharray':'1 17',opacity:.95},root);
  var L=base.getTotalLength();var e=base.getPointAtLength(L),e2=base.getPointAtLength(Math.max(0,L-14));var ang=Math.atan2(e.y-e2.y,e.x-e2.x)*180/Math.PI;
  var ah=E('path',{d:'M-13 -9L2 0L-13 9Z',fill:col,transform:'translate('+e.x+','+e.y+') rotate('+ang+')'},root);
  EDGES[k]={base:base,flow:flow,len:L,col:col,dur:dur||(L>300?8:4)};ORDER.push(base,flow,ah);
}
edge('d-c',[[130,A],[350,A]],LIME);edge('c-e',[[350,A],[570,A]],LIME);
SX.forEach(function(x,i){edge('e-s'+i,[[570,A],[570,125],[x,125],[x,155]],[LIME,CORAL,AMB][i]);});
edge('q-p',[[130,B],[350,B]],LIME);edge('p-r',[[350,B],[570,B]],CORAL);
SX.forEach(function(x,i){edge('r-c'+i,[[570,B],[700,B],[700,440],[x+60,440],[x+60,B-43]],SKY);edge('c-s'+i,[[x-60,B-43],[x-60,345]],SKY);edge('s-f'+i,[[x-60,B+43],[x-60,650],[RX[0],650],[RX[0],C-43]],[LIME,CORAL,AMB][i]);});
for(var i=0;i<5;i++)edge('row'+i,[[RX[i],C],[RX[i+1],C]],[SKY,SKY,LIME,CORAL,AMB][i]);
edge('loop',[[RX[4],C-43],[RX[4],700],[420,700],[420,B+43]],CORAL);
// edges beneath nodes
var first=root.firstChild;ORDER.forEach(function(el){root.insertBefore(el,first);});
// ---------- packets ----------
var PK=[];
function addPk(k,off,r){var c=EDGES[k].col;PK.push({k:k,off:off,r:r||7,el:E('circle',{r:r||7,fill:c,stroke:'#07130f','stroke-width':2},root),tl:E('circle',{r:(r||7)*.55,fill:c,opacity:.45},root)});}
Object.keys(EDGES).forEach(function(k){if(k==='loop'){addPk(k,.25);return;}addPk(k,0);addPk(k,.5);});
NODES.forEach(function(n){root.appendChild(n.g);});
// ---------- badges ----------
var BD=[];
function badge(n,x,y){var g=E('g',{},root);var glow=E('circle',{cx:x,cy:y,r:23,fill:'#ffffff',opacity:0},g);E('circle',{cx:x,cy:y,r:17,fill:'#eef8f2',stroke:'#07130f','stroke-width':3},g);E('text',{x:x,y:y+6,'text-anchor':'middle',fill:'#07130f','font-family':'BG','font-weight':800,'font-size':n>9?16:18},g,String(n));BD.push({n:n,glow:glow});}
[[1,240,A],[2,460,A],[3,700,125],[4,240,B],[5,460,B],[6,700,490],[7,820,400],[7,1090,400],[7,1360,400],[8,1000,650],[9,1152,C],[10,957,C],[11,762,C],[12,567,C],[13,372,C],[14,445,700]].forEach(function(b){badge(b[0],b[1],b[2]);});
// ---------- static content ----------
var title=E('text',{x:50,y:64,fill:TXT,'font-family':'BG','font-weight':800,'font-size':44,'letter-spacing':'-.5'},root);title.innerHTML='AGENTIC <tspan fill="'+LIME+'">GRAPH</tspan>RAG';
E('text',{x:50,y:94,fill:SUB,'font-family':'JB','font-weight':500,'font-size':16},root,'how an agentic RAG system answers a hard question · follow the numbers');
[[LIME,'data'],[SKY,'retrieval'],[CORAL,'LLM / agent'],[AMB,'quality gate']].forEach(function(l,i){var x=880+i*160;E('rect',{x:x,y:42,width:14,height:14,rx:4,fill:l[0]},root);E('text',{x:x+22,y:55,fill:SUB,'font-family':'JB','font-weight':500,'font-size':15},root,l[1]);});
E('text',{x:50,y:128,fill:LIME,'font-family':'JB','font-weight':700,'font-size':15,'letter-spacing':'2'},root,'A · INDEXING (OFFLINE)');
E('text',{x:50,y:402,fill:SKY,'font-family':'JB','font-weight':700,'font-size':15,'letter-spacing':'2'},root,'B · QUERY AGENT LOOP (ONLINE)');
E('rect',{x:50,y:416,width:455,height:36,rx:10,fill:'#112b21',stroke:LIME,'stroke-width':2},root);
E('text',{x:64,y:441,fill:TXT,'font-family':'JB','font-weight':500,'font-size':16},root,'“Which suppliers does the port strike hit?”');
function pill(x,y,txt,col,w){E('rect',{x:x,y:y,width:w,height:26,rx:13,fill:PANEL,stroke:col,'stroke-width':2},root);E('text',{x:x+w/2,y:y+18,'text-anchor':'middle',fill:col,'font-family':'JB','font-weight':700,'font-size':14},root,txt);}
pill(415,302,'Supplier A',AMB,106);pill(527,302,'Port of LA',SKY,106);pill(639,302,'Strike',CORAL,84);
pill(255,596,'who is hit?',CORAL,140);pill(255,628,'cost impact?',CORAL,140);
E('text',{x:RX[0],y:866,'text-anchor':'middle',fill:SKY,'font-family':'JB','font-weight':700,'font-size':16},root,'Σ 1/(k+rank)');
var rb=[0,1,2,3,4].map(function(i){return E('rect',{x:RX[1]-40+i*18,y:850,width:13,height:34,rx:3,fill:SKY},root);});
var evc=[LIME,CORAL,AMB].map(function(c,i){return E('rect',{x:RX[2]-36,y:846+i*14,width:72,height:10,rx:3,fill:c},root);});
E('text',{x:RX[3],y:870,'text-anchor':'middle',fill:CORAL,'font-family':'JB','font-weight':700,'font-size':15},root,'draft: A [1] B [2]');
var vt=E('text',{x:RX[4],y:870,'text-anchor':'middle',fill:LIME,'font-family':'JB','font-weight':700,'font-size':15},root,'✓ 6/6 grounded');
E('rect',{x:50,y:842,width:290,height:46,rx:11,fill:'#12301f',stroke:LIME,'stroke-width':2},root);
E('text',{x:64,y:861,fill:TXT,'font-family':'JB','font-weight':700,'font-size':14},root,'2 suppliers exposed [1][2]');
E('text',{x:64,y:879,fill:LIME,'font-family':'JB','font-weight':500,'font-size':12},root,'illustrative example');
E('text',{x:1560,y:112,'text-anchor':'end',fill:'#5a7a6b','font-family':'JB','font-weight':500,'font-size':12},root,'reference architecture synthesised from 2026 agentic-RAG / GraphRAG surveys');
E('text',{x:700,y:735,'text-anchor':'middle',fill:CORAL,'font-family':'JB','font-weight':700,'font-size':13,opacity:.9},root,'');
E('text',{x:480,y:672,fill:CORAL,'font-family':'JB','font-weight':700,'font-size':14},root,'retry if a claim fails');
// ---------- seek (8 s seamless loop) ----------
function seek(t){
  var ph=((t%DUR)+DUR)%DUR,p=ph/DUR;
  dots.setAttribute('transform','translate('+(-(ph*5)%40)+','+(-(ph*5)%40)+')');
  NODES.forEach(function(n){n.glow.setAttribute('opacity',(.12+.1*Math.sin(W*ph*1+n.ph*0.7)).toFixed(3));});
  STG.forEach(function(s,i){s.glow.setAttribute('opacity',(.12+.09*Math.sin(W*ph+s.ph)).toFixed(3));});
  Object.keys(EDGES).forEach(function(k){var e=EDGES[k];e.flow.setAttribute('stroke-dashoffset',(-ph*18*6).toFixed(1));});
  VD.forEach(function(d,i){var hi=(i%9===Math.floor(p*9)%9)?1:0;d.el.setAttribute('cx',(d.x+3*Math.sin(W*ph+d.ph)).toFixed(1));d.el.setAttribute('cy',(d.y+3*Math.cos(W*ph+d.ph)).toFixed(1));d.el.setAttribute('r',hi?6.5:4);d.el.setAttribute('fill',hi?'#ffffff':LIME);});
  var rp=(p*2)%1;qRing.setAttribute('r',(10+70*rp).toFixed(1));qRing.setAttribute('opacity',((1-rp)*.8).toFixed(2));
  var hop=[0,1,6,4,5];var pos=p*hop.length*2;gNodes.forEach(function(n,i){var idx=hop.indexOf(i);var v=0;if(idx>=0){var d=((pos-idx)%(hop.length*2)+hop.length*2)%(hop.length*2);v=Math.max(0,1-d/2);}n.setAttribute('fill',v>.35?'#ffffff':PANEL);n.setAttribute('r',(7+4*v).toFixed(1));});
  gEdges.forEach(function(e,i){var on=(i===0||i===7||i===3||i===1);e.setAttribute('stroke-width',on?2.6:2);e.setAttribute('opacity',(.55+.35*Math.sin(W*ph*2+i)).toFixed(2));});
  bRows.forEach(function(r,i){r.bars.forEach(function(b,k){var v=.5+.5*Math.sin(W*ph*2+i*.9+k*1.3);b.setAttribute('opacity',(.35+.65*v).toFixed(2));b.setAttribute('fill',(i===Math.floor(p*5)%5)?'#ffffff':AMB);});});
  rb.forEach(function(b,i){var h=[1,.8,.62,.45,.3][i]*(1+.08*Math.sin(W*ph*2+i));var H=34*h;b.setAttribute('height',H.toFixed(1));b.setAttribute('y',(884-H).toFixed(1));});
  evc.forEach(function(e,i){e.setAttribute('opacity',(.55+.45*Math.sin(W*ph*2+i*1.2)).toFixed(2));});
  PK.forEach(function(k){var e=EDGES[k.k];var u=((ph/e.dur+k.off)%1+1)%1;var s=u*u*(3-2*u);var pt=e.base.getPointAtLength(e.len*s),pt2=e.base.getPointAtLength(Math.max(0,e.len*s-16));var fade=Math.min(1,u*6,(1-u)*6);k.el.setAttribute('cx',pt.x);k.el.setAttribute('cy',pt.y);k.el.setAttribute('opacity',fade.toFixed(2));k.tl.setAttribute('cx',pt2.x);k.tl.setAttribute('cy',pt2.y);k.tl.setAttribute('opacity',(.45*fade).toFixed(2));});
  BD.forEach(function(b){var d=((p*14-(b.n-1))%14+14)%14;b.glow.setAttribute('opacity',Math.max(0,.75*(1-d/2.2)).toFixed(2));});
}
window.__reelDurationSec=DUR;
window.__seek=function(t){seek(t);};
function boot(){document.fonts.ready.then(function(){seek(0);}).catch(function(){});}
window.addEventListener('load',boot);
})();
