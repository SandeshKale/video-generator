(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,W=2*Math.PI/DUR;
var PAPER='#f3ede2',INK='#14213d',CORAL='#ff5a47',MUST='#f4b400',TEAL='#0f9d8a',NIGHT='#26286b',MUTE='#5d6178',CARD='#fffaf0';
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
var svg=document.getElementById('s');
E('rect',{width:1080,height:1350,fill:PAPER});
var defs=E('defs',{});var pat=E('pattern',{id:'ht',width:24,height:24,patternUnits:'userSpaceOnUse'},defs);E('circle',{cx:6,cy:6,r:2.6,fill:'#e4d9c4'},pat);E('circle',{cx:18,cy:18,r:2.6,fill:'#e4d9c4'},pat);
var ht=E('rect',{x:-30,y:-30,width:1140,height:1410,fill:'url(#ht)'});
var cp=E('clipPath',{id:'cl'},defs);E('rect',{x:30,y:470,width:1020,height:430,rx:0},cp);
// riso blob misregistered behind headline
var blobA=E('circle',{cx:1010,cy:100,r:170,fill:CORAL,opacity:.9});var blobB=E('circle',{cx:1022,cy:110,r:170,fill:'none',stroke:INK,'stroke-width':4});
// ---------- headline ----------
E('text',{x:50,y:70,fill:INK,'font-family':'JB','font-weight':700,'font-size':22,'letter-spacing':'3'},svg,'THE JEVONS TRAP · AI AT WORK');
E('text',{x:46,y:190,fill:INK,'font-family':'AN','font-size':128,'letter-spacing':'1'},svg,"AI DOESN'T CUT");
E('text',{x:46,y:318,fill:INK,'font-family':'AN','font-size':128,'letter-spacing':'1'},svg,'THE WORK.');
var hl=E('text',{x:560,y:318,fill:CORAL,'font-family':'AN','font-size':128,'letter-spacing':'1'},svg,'IT GROWS IT.');
hl.setAttribute('x',0);hl.textContent='';
E('text',{x:46,y:430,fill:CORAL,'font-family':'AN','font-size':96,'letter-spacing':'1'},svg,'IT GROWS IT.');
var ul=E('rect',{x:46,y:444,width:0,height:10,fill:MUST});
// ---------- centerpiece: workday bars ----------
E('rect',{x:30,y:490,width:1020,height:430,rx:18,fill:CARD,stroke:INK,'stroke-width':4});
E('text',{x:56,y:532,fill:INK,'font-family':'JB','font-weight':700,'font-size':22,'letter-spacing':'2'},svg,'ONE WORKDAY · BEFORE vs AFTER AI (ILLUSTRATIVE)');
var X0=70,SC=70; // px per hour; 9am at X0
function bar(y,label,sub,col){
  E('text',{x:X0,y:y-12,fill:col,'font-family':'MA','font-weight':800,'font-size':26},svg,label);
  E('text',{x:X0+190,y:y-12,fill:MUTE,'font-family':'MA','font-weight':700,'font-size':22},svg,sub);
  E('rect',{x:X0,y:y,width:SC*8,height:78,fill:'#efe5cf',stroke:INK,'stroke-width':3});
}
// night zone for after-AI bar (5pm→9pm)
E('rect',{x:X0+SC*8,y:712,width:SC*4,height:78,fill:NIGHT,stroke:INK,'stroke-width':3});
E('text',{x:X0+SC*8+4,y:701,fill:NIGHT,'font-family':'JB','font-weight':700,'font-size':22},svg,'EVENING · UNPLANNED');
var moon=E('g',{transform:'translate('+(X0+SC*12+22)+',730) scale(1.8)',fill:'none',stroke:MUST,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'});moon.innerHTML=window.ICONS['moon-stars'];
bar(590,'BEFORE','4 big tasks · done by 5pm',TEAL);
bar(712,'AFTER','11 small tasks · still going at 9pm',CORAL);
// axis
['9AM','1PM','5PM','9PM'].forEach(function(t,i){E('text',{x:X0+SC*4*i+8,y:848,fill:MUTE,'font-family':'JB','font-weight':700,'font-size':20,'text-anchor':'start'},svg,t);E('rect',{x:X0+SC*4*i,y:798,width:3,height:28,fill:INK});});
// before blocks
var B1=[];for(var i=0;i<4;i++){B1.push(E('rect',{x:X0+4+i*SC*2,y:594,width:SC*2-8,height:70,fill:TEAL}));var ic=E('g',{transform:'translate('+(X0+i*SC*2+SC-18)+',610) scale(1.5)',fill:'none',stroke:'#fff','stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round'});ic.innerHTML=window.ICONS[['file-text','mail','message-circle','file-text'][i]];}
// after blocks (11) flowing conveyor inside clip
var cg=E('g',{});var blocks=[];var cols=[CORAL,MUST,CORAL,MUST,CORAL,MUST,CORAL,MUST,CORAL,MUST,CORAL];
var BW=SC*12/11;
for(var j=0;j<22;j++){blocks.push(E('rect',{x:0,y:716,width:BW-6,height:70,fill:cols[j%11],stroke:INK,'stroke-width':2},cg));}
E('rect',{x:X0,y:600,width:0,height:0});
// overflow clip for conveyor
var cl2=E('clipPath',{id:'cl2'},defs);E('rect',{x:X0,y:712,width:SC*12,height:78},cl2);cg.setAttribute('clip-path','url(#cl2)');
// bracket showing "saved time" ghost on after bar? time saved label
E('text',{x:X0,y:896,fill:INK,'font-family':'MA','font-weight':800,'font-size':26},svg,'Faster tasks → more tasks. The saved hours get spent.');
var clock=E('g',{transform:'translate(985,560)'});E('circle',{r:36,fill:CARD,stroke:INK,'stroke-width':4},clock);var hand=E('line',{x1:0,y1:0,x2:0,y2:-24,stroke:CORAL,'stroke-width':6,'stroke-linecap':'round'},clock);E('line',{x1:0,y1:0,x2:16,y2:0,stroke:INK,'stroke-width':6,'stroke-linecap':'round'},clock);E('circle',{r:6,fill:INK},clock);
// ---------- findings cards ----------
var cards=[
 {n:'1',big:'77%',lab:'of workers say AI added to their workload',src:'UPWORK · ~2,500 WORKERS · 2024',col:CORAL},
 {n:'2',big:'40',lab:'workers tracked for 8 months: faster pace, wider scope',src:'BERKELEY/HBR · 200-PERSON FIRM',col:TEAL},
 {n:'3',big:'1865',lab:'Jevons: efficient engines, more coal burned',src:'THE ORIGINAL PARADOX',col:MUST}];
var CW=324,GAP=24,CX0=30,CY=950;
var cardEls=cards.map(function(c,i){var x=CX0+i*(CW+GAP);
  E('rect',{x:x+8,y:CY+8,width:CW,height:270,fill:INK});
  var g=E('g',{});E('rect',{x:x,y:CY,width:CW,height:270,fill:CARD,stroke:INK,'stroke-width':4},g);E('rect',{x:x,y:CY,width:CW,height:14,fill:c.col},g);
  E('text',{x:x+20,y:CY+104,fill:INK,'font-family':'AN','font-size':86},g,c.big);
  wrap(g,c.lab,x+20,CY+142,CW-40,25,'MA',800,INK);
  wrap(g,c.src,x+20,CY+250,CW-40,15,'JB',700,MUTE,1.25);
  return {g:g,x:x,col:c.col};});
function wrap(par,txt,x,y,w,fs,ff,fw,col,lh){var words=txt.split(' '),line='',ly=y,cw=fs*(ff==='JB'?.62:.54);var t=E('text',{x:x,y:y,fill:col,'font-family':ff,'font-weight':fw,'font-size':fs},par);
  var lines=[];words.forEach(function(wd){if((line+' '+wd).trim().length*cw>w){lines.push(line);line=wd;}else line=(line+' '+wd).trim();});lines.push(line);
  lines.forEach(function(l,k){var ts=E('tspan',{x:x,dy:k?fs*(lh||1.22):0},t,l);});}
// connectors with numbers between cards (flowing dots)
var conn=[];
[0,1].forEach(function(i){var x1=CX0+i*(CW+GAP)+CW,x2=x1+GAP;var p=E('path',{d:'M'+(x1-60)+' '+(CY-18)+'H'+(x2+60),fill:'none',stroke:INK,'stroke-width':4,'stroke-dasharray':'2 14','stroke-linecap':'round'});conn.push(p);});
cards.forEach(function(c,i){var x=c.x||CX0+i*(CW+GAP);var g=E('g',{});E('circle',{cx:x+40,cy:CY-18,r:24,fill:c.col,stroke:INK,'stroke-width':4},g);E('text',{x:x+40,y:CY-9,'text-anchor':'middle',fill:INK,'font-family':'AN','font-size':28},g,String(i+1));c.badge=g;});
// takeaway
E('rect',{x:30,y:1238,width:1020,height:62,fill:INK});
E('text',{x:56,y:1280,fill:PAPER,'font-family':'MA','font-weight':800,'font-size':27},svg,'Efficiency gains get spent, not saved.  Protect your pauses.');
var av=E('g',{});E('clipPath',{id:'ac'},defs).innerHTML='<circle cx="990" cy="1269" r="24"/>';E('image',{href:'profile.jpg',x:966,y:1245,width:48,height:48,'clip-path':'url(#ac)',preserveAspectRatio:'xMidYMid slice'},av);E('circle',{cx:990,cy:1269,r:24,fill:'none',stroke:MUST,'stroke-width':3},av);
E('text',{x:30,y:1328,fill:MUTE,'font-family':'JB','font-weight':700,'font-size':18},svg,'@sandesh.explains  ·  HBR/Berkeley 2026 · Upwork 2024 · Fortune');
// ---------- seek ----------
function seek(t){
  var ph=((t%DUR)+DUR)%DUR,p=ph/DUR;
  ht.setAttribute('transform','translate('+(-(ph*3)%24)+','+(-(ph*3)%24)+')');
  blobA.setAttribute('cy',100+8*Math.sin(W*ph));blobB.setAttribute('cx',1022+5*Math.sin(W*ph+1));blobB.setAttribute('cy',110+5*Math.cos(W*ph));
  ul.setAttribute('width',(560*(.5+.5*Math.sin(W*ph-1.2))).toFixed(1));
  // conveyor: blocks scroll right → left, wrapping, loop-period 8 s => shift = BW*11 per 8 s
  var shift=(ph/DUR)*BW*11;
  blocks.forEach(function(b,j){var x=X0+(j*BW-shift)%(BW*22);if(x<X0-BW)x+=BW*22;b.setAttribute('x',x.toFixed(1));});
  // clock hand: 2 full turns per loop
  hand.setAttribute('transform','rotate('+(ph/DUR*720)+')');
  moon.setAttribute('transform','translate('+(X0+SC*12+22)+','+(730+3*Math.sin(W*ph*2))+') scale(1.8)');
  B1.forEach(function(b,i){b.setAttribute('opacity',(.82+.18*Math.sin(W*ph+i)).toFixed(2));});
  conn.forEach(function(c){c.setAttribute('stroke-dashoffset',(-ph*16*3).toFixed(1));});
  cards.forEach(function(c,i){var d=((p*3-i)%3+3)%3;var v=Math.max(0,1-d/.9);c.badge.setAttribute('transform','translate(0,'+(-6*v).toFixed(1)+')');});
  cardEls.forEach(function(c,i){var d=((p*3-i)%3+3)%3;var v=Math.max(0,1-d/.9);c.g.setAttribute('transform','translate(0,'+(-5*v).toFixed(1)+')');});
}
window.__reelDurationSec=DUR;window.__seek=function(t){seek(t);};
function boot(){document.fonts.ready.then(function(){seek(0);}).catch(function(){});}
window.addEventListener('load',boot);
})();
