(function(){
'use strict';
var NS='http://www.w3.org/2000/svg',DUR=8,W=2*Math.PI/DUR;
var YEL='#ffd23f',BLUE='#2b50ff',INK='#101010',WHITE='#fffdf5',PINK='#ff3d81';
function E(tag,at,par,txt){var e=document.createElementNS(NS,tag);for(var k in at)e.setAttribute(k,at[k]);if(txt!=null)e.textContent=txt;(par||svg).appendChild(e);return e;}
var svg=document.getElementById('s');
E('rect',{width:1080,height:1350,fill:YEL});
var defs=E('defs',{});var pat=E('pattern',{id:'ht',width:26,height:26,patternUnits:'userSpaceOnUse'},defs);E('circle',{cx:6.5,cy:6.5,r:3.2,fill:'#f4bd1c'},pat);E('circle',{cx:19.5,cy:19.5,r:3.2,fill:'#f4bd1c'},pat);
var ht=E('rect',{x:-30,y:-30,width:1140,height:1410,fill:'url(#ht)'});
// ---------- headline ----------
function head(txt,y,col,off){E('text',{x:46+4,y:y+5,fill:INK,'font-family':'AN','font-size':112,'letter-spacing':'1'},svg,txt);return E('text',{x:46,y:y,fill:col,'font-family':'AN','font-size':112,'letter-spacing':'1'},svg,txt);}
head('AI MADE YOU FASTER.',128,WHITE);head('THEN THE TREADMILL',240,WHITE);head('SPED UP.',352,PINK);
// ---------- scene panel ----------
E('rect',{x:38,y:408,width:1010,height:560,fill:INK});
E('rect',{x:30,y:400,width:1010,height:560,fill:BLUE,stroke:INK,'stroke-width':6});
var sg=E('g',{});
var cl=E('clipPath',{id:'sc'},defs);E('rect',{x:33,y:403,width:1004,height:554},cl);sg.setAttribute('clip-path','url(#sc)');
// speed lines
var lines=[];for(var i=0;i<9;i++)lines.push(E('rect',{x:0,y:440+i*52,width:120+((i*37)%90),height:6,rx:3,fill:'#ffffff',opacity:.35},sg));
// task docs (flying at the runner)
var docs=[];for(var d=0;d<8;d++){var g=E('g',{},sg);E('rect',{x:0,y:0,width:78,height:98,rx:8,fill:WHITE,stroke:INK,'stroke-width':4},g);for(var q=0;q<4;q++)E('rect',{x:12,y:16+q*18,width:q===0?36:54,height:7,rx:3,fill:q===0?PINK:'#9aa3c7'},g);docs.push({g:g,ph:d/8,y:455+((d*83)%300),sc:.8+((d*13)%5)/10});}
// treadmill
E('rect',{x:250,y:880,width:650,height:56,rx:28,fill:INK},sg);E('rect',{x:262,y:889,width:626,height:38,rx:19,fill:'#1d2a7a'},sg);
var ticks=[];for(var t=0;t<16;t++)ticks.push(E('rect',{x:0,y:896,width:26,height:8,rx:4,fill:WHITE},sg));
E('polygon',{points:'340,936 390,936 330,990 285,990',fill:INK},sg);E('polygon',{points:'760,936 810,936 860,990 815,990',fill:INK},sg);E('rect',{x:230,y:984,width:660,height:14,rx:7,fill:INK},sg);
// console post on right
E('rect',{x:884,y:700,width:14,height:200,fill:INK},sg);
// runner
var rg=E('g',{transform:'translate(360,394) scale(1.1)'},sg);var rin=E('g',{},rg);rin.innerHTML=window.RUNNER;
// sweat drops
var drops=[];for(var s=0;s<4;s++)drops.push(E('path',{d:'M0 -10 C 8 2 8 10 0 10 C -8 10 -8 2 0 -10Z',fill:WHITE,stroke:INK,'stroke-width':2},sg));
// speedometer (left)
var dc={x:190,y:690};
E('circle',{cx:dc.x,cy:dc.y,r:150,fill:WHITE,stroke:INK,'stroke-width':6},sg);
var arcs=[['#46c46b',-180,-120],['#ffd23f',-120,-60],[PINK,-60,0]];
function arc(a0,a1,col){var r=118,x0=dc.x+r*Math.cos(a0*Math.PI/180),y0=dc.y+r*Math.sin(a0*Math.PI/180),x1=dc.x+r*Math.cos(a1*Math.PI/180),y1=dc.y+r*Math.sin(a1*Math.PI/180);E('path',{d:'M'+x0+' '+y0+'A'+r+' '+r+' 0 0 1 '+x1+' '+y1,fill:'none',stroke:col,'stroke-width':26},sg);}
arcs.forEach(function(a){arc(a[1],a[2],a[0]);});
var needle=E('g',{transform:'translate('+dc.x+','+dc.y+')'},sg);E('polygon',{points:'-8,0 8,0 0,-110',fill:INK},needle);E('circle',{r:14,fill:INK},needle);
E('text',{x:dc.x,y:dc.y+52,'text-anchor':'middle',fill:INK,'font-family':'AN','font-size':34},sg,'SPEED');
E('text',{x:dc.x-96,y:dc.y+30,'text-anchor':'middle',fill:INK,'font-family':'MA','font-weight':800,'font-size':18},sg,'PRE-AI');
E('text',{x:dc.x+100,y:dc.y+30,'text-anchor':'middle',fill:INK,'font-family':'MA','font-weight':800,'font-size':18},sg,'AI');
// AI boost badge
var badge=E('g',{transform:'translate(190,880)'},sg);E('rect',{x:-110,y:-34,width:220,height:68,rx:34,fill:PINK,stroke:INK,'stroke-width':5},badge);var bi=E('g',{transform:'translate(-92,-20) scale(1.6)',fill:'none',stroke:WHITE,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},badge);bi.innerHTML=window.ICONS.bolt;E('text',{x:-48,y:12,fill:WHITE,'font-family':'AN','font-size':36},badge,'AI BOOST');
// clock top-right
var ck=E('g',{transform:'translate(950,490)'},sg);E('circle',{r:50,fill:WHITE,stroke:INK,'stroke-width':6},ck);for(var h=0;h<12;h++){E('rect',{x:-2,y:-44,width:4,height:h%3?6:10,fill:INK,transform:'rotate('+h*30+')'},ck);}
var hmin=E('line',{x1:0,y1:0,x2:0,y2:-38,stroke:INK,'stroke-width':5,'stroke-linecap':'round'},ck);var hhr=E('line',{x1:0,y1:0,x2:0,y2:-24,stroke:PINK,'stroke-width':7,'stroke-linecap':'round'},ck);E('circle',{r:6,fill:INK},ck);
// ---------- starburst callouts ----------
function star(cx,cy,ro,ri,n,rot){var pts=[];for(var i=0;i<n*2;i++){var r=i%2?ri:ro,a=(i*Math.PI/n)+rot;pts.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1));}return pts.join(' ');}
var bursts=[{cx:190,big:'77%',lab:'say AI added to their workload',src:'Upwork · 2,500 workers',fill:WHITE,tc:INK,sc:PINK},{cx:540,big:'40',lab:'workers studied: faster pace, wider scope, no breaks',src:'Berkeley / HBR · 2025',fill:INK,tc:YEL,sc:WHITE},{cx:890,big:'1865',lab:'Jevons: efficient engines burned more coal',src:'the original paradox',fill:PINK,tc:WHITE,sc:INK}];
var bEls=bursts.map(function(b,i){var g=E('g',{});var sh=E('polygon',{points:star(b.cx+8,1120,152,132,16,0),fill:INK},g);var p=E('polygon',{points:star(b.cx,1112,152,132,16,0),fill:b.fill,stroke:INK,'stroke-width':5},g);
  E('text',{x:b.cx,y:1090,'text-anchor':'middle',fill:b.sc===PINK?PINK:b.tc,'font-family':'AN','font-size':84},g,b.big);
  var words=b.lab.split(' '),lines=[],cur='';words.forEach(function(w){if((cur+' '+w).trim().length>21){lines.push(cur);cur=w;}else cur=(cur+' '+w).trim();});lines.push(cur);
  lines.forEach(function(l,k){E('text',{x:b.cx,y:1122+k*26,'text-anchor':'middle',fill:b.fill===INK?WHITE:(b.fill===PINK?WHITE:INK),'font-family':'MA','font-weight':800,'font-size':22},g,l);});
  E('text',{x:b.cx,y:1122+lines.length*26+4,'text-anchor':'middle',fill:b.fill===INK?'#9aa3c7':(b.fill===PINK?INK:'#5b5f7a'),'font-family':'MA','font-weight':700,'font-size':16},g,b.src);
  return {p:p,sh:sh,b:b};});
// takeaway
E('rect',{x:38,y:1286,width:1004,height:56,fill:INK});E('rect',{x:30,y:1278,width:1004,height:56,fill:WHITE,stroke:INK,'stroke-width':5});
E('text',{x:52,y:1318,fill:INK,'font-family':'MA','font-weight':800,'font-size':27},svg,"Efficiency doesn't buy rest. It buys more.");
E('clipPath',{id:'ac'},defs).innerHTML='<circle cx="978" cy="1306" r="22"/>';E('image',{href:'profile.jpg',x:956,y:1284,width:44,height:44,'clip-path':'url(#ac)',preserveAspectRatio:'xMidYMid slice'});E('circle',{cx:978,cy:1306,r:22,fill:'none',stroke:BLUE,'stroke-width':3});
E('text',{x:930,y:1312,'text-anchor':'end',fill:'#5b5f7a','font-family':'MA','font-weight':800,'font-size':17},svg,'@sandesh.explains');
// ---------- seek ----------
function seek(t){
  var ph=((t%DUR)+DUR)%DUR,p=ph/DUR;
  ht.setAttribute('transform','translate('+(-(ph*3.25)%26)+','+(-(ph*3.25)%26)+')');
  // belt ticks scroll left (period: 16 ticks spacing 40px -> shift multiple of 40 per loop)
  ticks.forEach(function(k,i){var x=262+((i*40-p*40*8)%640+640)%640;k.setAttribute('x',x.toFixed(1));k.setAttribute('opacity',x>870?0:1);});
  // runner bob + lean
  var bob=Math.abs(Math.sin(W*ph*4))*9;rg.setAttribute('transform','translate(360,'+(394-bob).toFixed(1)+') scale(1.1)');
  rin.setAttribute('transform','rotate('+(Math.sin(W*ph*8)*1.6).toFixed(2)+' 190 300)');
  // speed lines scroll left
  lines.forEach(function(l,i){var len=120+((i*37)%90);var x=((1000-((p*3+i*.13)%1)*1200)+1200)%1200-120;l.setAttribute('x',x.toFixed(0));});
  // docs fly from right towards runner then vanish behind
  docs.forEach(function(d){var u=((p*2+d.ph)%1);var x=1080-u*(1080-690);var y=d.y+14*Math.sin(u*6.28*2+d.ph*6);var a=Math.min(1,u*8,(1-u)*5);d.g.setAttribute('transform','translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+d.sc.toFixed(2)+') rotate('+((u-.5)*14).toFixed(1)+' 39 49)');d.g.setAttribute('opacity',a.toFixed(2));});
  // sweat
  drops.forEach(function(s,i){var u=((p*2+i/4)%1);s.setAttribute('transform','translate('+(560-u*120).toFixed(1)+','+(520-u*70+u*u*150).toFixed(1)+') scale('+(.9-u*.5).toFixed(2)+')');s.setAttribute('opacity',Math.min(1,u*6,(1-u)*3).toFixed(2));});
  // needle sweeps between pre-AI and AI (periodic)
  var ang=-90+ (-70+Math.sin(W*ph-1.2)*0+ (Math.sin(W*ph)>0?1:1)*0) ;
  var v=.5+.5*Math.sin(W*ph-Math.PI/2); v=v*v*(3-2*v); ang=-165+v*150; needle.setAttribute('transform','translate('+dc.x+','+dc.y+') rotate('+(ang+90-90)+') rotate(0)');
  needle.setAttribute('transform','translate('+dc.x+','+dc.y+') rotate('+(ang+90)+')');
  badge.setAttribute('transform','translate(190,'+(880+4*Math.sin(W*ph*2)).toFixed(1)+') scale('+(1+.04*Math.sin(W*ph*4)).toFixed(3)+')');
  // clock spins 4x
  hmin.setAttribute('transform','rotate('+(p*360*4)+')');hhr.setAttribute('transform','rotate('+(p*360*4/12)+')');
  // bursts pulse/rotate
  bEls.forEach(function(o,i){var s=1+.025*Math.sin(W*ph*2+i*2);var r=Math.sin(W*ph+i)*2.2;var tr='translate('+o.b.cx+',1112) rotate('+r.toFixed(2)+') scale('+s.toFixed(3)+') translate('+(-o.b.cx)+',-1112)';o.p.setAttribute('transform',tr);o.sh.setAttribute('transform',tr);});
}
window.__reelDurationSec=DUR;window.__seek=function(t){seek(t);};
function boot(){document.fonts.ready.then(function(){seek(0);}).catch(function(){});}
window.addEventListener('load',boot);
})();
