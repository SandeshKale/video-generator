// "Studio Slate" — one rig, two skins, every pixel a pure function of t. Content stays in x 150..918, y 176..1270.
(function(){
'use strict';
var D=window.DATA,S=D.scenes,R=window.RIG;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,u){return a+(b-a)*u;}
function sm(x){x=clamp(x,0,1);return x*x*(3-2*x);}
function eo(x){x=clamp(x,0,1);return 1-Math.pow(1-x,3);}
function eo5(x){x=clamp(x,0,1);return 1-Math.pow(1-x,5);}
function eb(x){x=clamp(x,0,1);var c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function hash(n){var x=Math.sin(n*91.7+13.1)*43758.5453;return x-Math.floor(x);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
var NS='http://www.w3.org/2000/svg';
function svgEl(w,h,vb){var s=document.createElementNS(NS,'svg');s.setAttribute('width',w);s.setAttribute('height',h);s.setAttribute('viewBox',vb||('0 0 '+w+' '+h));s.style.cssText='position:absolute;left:0;top:0;overflow:hidden';var g=document.createElementNS(NS,'g');s.appendChild(g);return {svg:s,g:g};}
var INK='#101426',PINK='#ff3d7f',YEL='#ffd23f',SKY='#3aa8ff',MINT='#19c37d';
var ICONS=D.icons;
function ic(n,px,col,sw){return '<svg viewBox="0 0 24 24" width="'+px+'" height="'+px+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="'+(sw||2)+'" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible">'+(ICONS[n]||'')+'</svg>';}
function W(si,i){var b=S[si].beats[0].words;return b[Math.min(i,b.length-1)].s;}
function reveal(e,u,dy){e.style.opacity=clamp(u/.1,0,1);e.style.transform='translateY('+((1-eo5(u/.34))*(dy==null?36:dy)).toFixed(1)+'px)';}
function pop(e,u,rot){var q=clamp(eb(u/.26),0,1);e.style.opacity=clamp(u/.05,0,1);e.style.transform='scale('+lerp(.6,1,q).toFixed(3)+')'+(rot!=null?' rotate('+rot+'deg)':'');}
function slam(e,u,rot){if(u<0){e.style.opacity=0;return;}var p=eo5(u/.16);e.style.opacity=clamp(u/.03,0,1);e.style.transform='rotate('+rot+'deg) scale('+lerp(1.5,1,p).toFixed(3)+')';}
// ---- page scaffolding ----
var pages=document.getElementById('pages');
function Page(si,eyeTxt,words){
  var p=el('div','pg');p.id='p'+si;pages.appendChild(p);
  var eyeE=el('div','eb','<i></i><span></span>');p.appendChild(eyeE);var span=eyeE.lastChild;
  var h=el('div','h');p.appendChild(h);
  var ws=[];words.forEach(function(w){if(w==='|'){h.appendChild(el('br'));return;}var o=typeof w==='string'?{t:w}:w;var s=el('span','',o.hl?'<em>'+o.t+'</em>':o.t,'margin-right:.22em');h.appendChild(s);ws.push({s:s,at:o.at==null?0.05+ws.length*.09:o.at});});
  return {el:p,upd:function(lt){var n=Math.floor(clamp((lt-.02+(eyeTxt.indexOf('SAME CARTWHEEL')>0?1:0))/.4,0,1)*eyeTxt.length);span.textContent=eyeTxt.slice(0,n);ws.forEach(function(o){var u=lt-o.at;o.s.style.opacity=clamp(u/.05,0,1);o.s.style.transform='translateY('+((1-eo5(u/.26))*32).toFixed(1)+'px)';});}};
}
function card(p,x,y,w,h,extra){var c=el('div','card','','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;'+(extra||''));p.appendChild(c);return c;}
function chip(p,txt,x,y,cls,st){var c=el('div','chip '+(cls||''),txt,'left:'+x+'px;top:'+y+'px;'+(st||''));p.appendChild(c);return c;}
// a framed rig viewport: svg with group transformed to (ox,oy) scale k; floorLine optional
function Stage(parent,x,y,w,h){var box=el('div','','','position:absolute;left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;overflow:hidden');var s=svgEl(w,h);box.appendChild(s.svg);parent.appendChild(box);return {box:box,g:s.g,svg:s.svg,w:w,h:h,draw:function(fig,ox,oy,k,bg){s.g.innerHTML=(bg||'')+'<g transform="translate('+ox+' '+oy+') scale('+k+')">'+fig+'</g>';}};}
function floorMarks(off,w,y0,y1,col){var s='',gap=60,o=((off%gap)+gap)%gap;for(var x=-o;x<w+gap;x+=gap)s+='<line x1="'+x+'" y1="'+y0+'" x2="'+(x-30)+'" y2="'+y1+'" stroke="'+(col||'rgba(16,20,38,.16)')+'" stroke-width="2"/>';return s;}
// contact dust: puffs at foot/hand touch-downs, from lagged samples (pure function of t)
function dustFor(sampleFn,t,k,keys){var s='';for(var i=1;i<=6;i++){var lag=i*.07,P=sampleFn(t-lag);if(!P)continue;keys.forEach(function(j){if(P[j][1]<9){var r=(10+i*7),op=.5*(1-i/7);s+='<circle cx="'+(P[j][0]).toFixed(1)+'" cy="'+(-P[j][1]-r*.3).toFixed(1)+'" r="'+r+'" fill="#b9c1c9" opacity="'+op.toFixed(2)+'"/>';}});}return s;}
var scenes=[];
// ================= S1: same cartwheel, twice =================
scenes.push(function(si){
  var P=Page(si,'// THE SAME CARTWHEEL, TWICE',[{t:'A',at:-1},{t:'HUMAN',at:-1},'|',{t:'DID IT',at:-1},{t:'FIRST.',hl:1,at:W(0,10)-.1}]);var p=P.el;
  var c=card(p,150,500,768,740);
  var lanes=[{y:0,skin:'human',lab:'HUMAN · MOCAP SUIT',lead:0},{y:370,skin:'robot',lab:'ROBOT · UNITREE G1',lead:.45}];
  var st=lanes.map(function(L){var s=Stage(c,0,L.y,768,370);var lb=el('div','lab',L.lab,'position:absolute;left:22px;top:'+(L.y+16)+'px;z-index:2');c.appendChild(lb);return s;});
  c.appendChild(el('div','','','position:absolute;left:0;right:0;top:368px;height:4px;background:'+INK));
  var stamp=el('div','stamp','HUMAN FIRST','left:530px;top:540px;font-size:46px;z-index:5;transform:rotate(-6deg)');p.appendChild(stamp);
  var k=.62,fl=335;
  function cs(t,lead){return clamp(1.25+(t+.05)*1.0-lead,0,4);}
  return {el:p,upd:function(t,lt){P.upd(lt);
    lanes.forEach(function(L,i){var s=cs(t,L.lead),f=function(tt){return R.sample('cart',cs(tt,L.lead),{});};
      var html='<line x1="0" y1="'+fl+'" x2="768" y2="'+fl+'" stroke="'+INK+'" stroke-width="4"/>';
      var ox=100,gh='';
      if(i===0){for(var g=3;g>=1;g--){var G=R.sample('cart',cs(t-g*.3,0),{});gh+='<g opacity="'+(.5-g*.1).toFixed(2)+'">'+R.svg(G,'ghost',{stroke:PINK,sw:5})+'</g>';}}
      var Pp=R.sample('cart',s,{});
      var du=dustFor(function(tt){return R.sample('cart',cs(tt,L.lead),{});},t,k,['fL','fR','hL','hR']);
      // wrap in a group: world coords scale k at (ox,fl)
      st[i].draw('<g>'+du+gh+R.svg(Pp,L.skin)+'</g>',ox,fl,k,html);
    });
    pop(stamp,t-W(si,10)+.02,-6);if(t<W(si,10)-.02)stamp.style.opacity=0;
    var sh=(t>W(si,10)&&t<W(si,10)+.25)?Math.sin(t*90)*2*(1-(t-W(si,10))/.25):0;c.style.transform='translate('+sh.toFixed(1)+'px,'+(sh*.6).toFixed(1)+'px)';
  }};
});
// ================= S2: suited up =================
scenes.push(function(si){
  var P=Page(si,'// SUITED UP FOR 2.5 HOURS',['SUITED','UP.','|',{t:'RECORDED.',hl:1,at:.3}]);var p=P.el;
  var c=card(p,150,480,768,560);var st=Stage(c,0,0,768,560);
  var moves=[['WALK','walk',W(si,12)],['RUN','run',W(si,13)],['DANCE','dance',W(si,14)],['MARTIAL ARTS','spin',W(si,15)],['CARTWHEELS','cart',W(si,17)]];
  var rec=el('div','','<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:#e2243d;margin-right:10px;vertical-align:-2px"></span>REC','position:absolute;left:22px;top:20px;z-index:3;font:700 22px SM,monospace;color:'+INK);c.appendChild(rec);
  var tc=el('div','','00:00:00','position:absolute;right:22px;top:20px;z-index:3;font:700 22px SM,monospace;color:'+INK+';font-variant-numeric:tabular-nums');c.appendChild(tc);
  var places=[chip(p,'BERKELEY',150,1080,'y'),chip(p,'STANFORD',372,1080,'s')];
  var rows=moves.map(function(m,i){return chip(p,m[0],150+[0,148,300,470,0][i],[1150,1150,1150,1150,1210][i],'');});
  var bar=el('div','','','position:absolute;left:400px;top:1210px;width:518px;height:46px;border:3px solid '+INK+';border-radius:10px;background:#fff;overflow:hidden');var fill=el('div','','','height:100%;width:0;background:'+YEL);bar.appendChild(fill);bar.appendChild(el('div','lab','2.5 HOURS OF MOTION','position:absolute;left:14px;top:9px;font-size:19px'));p.appendChild(bar);var bl=el('div');
  var camAng=[[-1,0],[1,0],[0,-1]];
  return {el:p,upd:function(t,lt){P.upd(lt);
    var cur=moves[0];moves.forEach(function(m){if(t>=m[2])cur=m;});var ci=moves.indexOf(cur),u=t-cur[2];
    var s=Math.max(0,t-cur[2])+({walk:0,run:0,dance:.6,spin:.3,cart:.9})[cur[1]];
    var loop=cur[1]==='walk'||cur[1]==='run';var Pp=R.sample(cur[1],s,{loop:loop,inplace:true});
    // mocap cameras: three scanning beams converging on the figure
    var html='<line x1="0" y1="500" x2="768" y2="500" stroke="'+INK+'" stroke-width="4"/>';
    var cams=[[70,120],[698,120],[384,60]];
    cams.forEach(function(q,i){var on=.5+.5*Math.sin(t*4+i*2);html+='<polygon points="'+q[0]+','+q[1]+' '+(384-70)+','+(300)+' '+(384+70)+','+(300)+'" fill="'+SKY+'" opacity="'+(.07+.05*on).toFixed(3)+'"/><rect x="'+(q[0]-26)+'" y="'+(q[1]-18)+'" width="52" height="36" rx="8" fill="'+INK+'"/><circle cx="'+q[0]+'" cy="'+q[1]+'" r="9" fill="'+(on>.5?PINK:'#6a7188')+'"/>';});
    st.draw('<g>'+R.svg(Pp,'human')+'</g>',384,500,.95,html);
    moves.forEach(function(m,i){var cc=rows[i],uu=t-m[2]+.25,act=(i===ci&&t>=m[2]);cc.style.opacity=clamp(uu/.1,0,1)*(t>=m[2]-.25?1:0);cc.className='chip '+(act?'p':'')+(t>=m[2]&&!act?' y':'');});
    places.forEach(function(q,i){pop(q,t-(W(si,[2,4][i])-.1));});
    var hu=(t-W(si,18))/(W(si,25)-W(si,18)+.2);fill.style.width=(clamp(hu,0,1)*100).toFixed(1)+'%';var mins=Math.round(clamp(hu,0,1)*150);tc.textContent='0'+Math.floor(mins/60)+':'+('0'+(mins%60)).slice(-2)+':00';
    var bu=t-(W(si,18)-.1);bar.style.opacity=clamp(bu/.1,0,1);
    rec.style.opacity=Math.floor(t*2)%2?.35:1;
  }};
});
// ================= S3: follow the ghost, earn points =================
scenes.push(function(si){
  var P=Page(si,'// FOLLOW THE GHOST',['CHASE','|',{t:'THE',at:.2},{t:'GHOST.',hl:1,at:.3}]);var p=P.el;
  var c=card(p,150,500,560,600);var st=Stage(c,0,0,560,600);
  var legend=[el('div','lab','<span style="color:'+PINK+'">━</span> HUMAN GHOST','position:absolute;left:20px;top:18px;z-index:3'),el('div','lab','<span style="color:#7d8a96">▬</span> ROBOT','position:absolute;left:20px;top:46px;z-index:3')];legend.forEach(function(l){c.appendChild(l);});
  // reward meter
  var mc=card(p,740,500,178,600);var mt=el('div','lab','REWARD','position:absolute;left:0;right:0;top:14px;text-align:center');mc.appendChild(mt);
  var track=el('div','','','position:absolute;left:62px;top:56px;width:54px;height:430px;border:3px solid '+INK+';border-radius:14px;background:#f1f3f5;overflow:hidden');var fill=el('div','','','position:absolute;left:0;right:0;bottom:0;height:60%;background:'+MINT);track.appendChild(fill);mc.appendChild(track);
  var tok=el('div','','','position:absolute;left:0;right:0;top:510px;text-align:center;font:800 54px OU,sans-serif');mc.appendChild(tok);
  var pen=[['JERKY MOTION',W(si,20)],['BAD JOINT ANGLES',W(si,22)+.1],['BUMPS ITSELF',W(si,26)]];
  var gain=chip(p,'+ MATCHES THE MOVE',150,1150,'');
  var penCh=pen.map(function(q,i){return chip(p,'− '+q[0],[510,150,470][i],[1150,1205,1205][i],'');});
  var tw=[W(si,10),W(si,13)];
  function rew(t){var v=.14;v+=.62*sm((t-tw[0])/(W(si,16)-tw[0]));pen.forEach(function(q){v-=.17*sm((t-q[1])/.35);});return clamp(v,.04,1);}
  var clipT=function(t){return 1.0+((t-S[si].start)*.9);};
  return {el:p,upd:function(t,lt){P.upd(lt);
    var cs=clipT(t),k=1.0,ox=265,fl=580;
    var human=R.sample('kick',cs,{inplace:true});var rob=R.sample('kick',cs-.3,{inplace:true});
    var jx=0,jy=0,html='<line x1="0" y1="'+fl+'" x2="560" y2="'+fl+'" stroke="'+INK+'" stroke-width="4"/>';
    pen.forEach(function(q,i){var u=t-q[1];if(u>0&&u<.7){var a=1-u/.7;if(i===0){jx=Math.sin(u*80)*12*a;}if(i===1){rob=R.rotate(rob,rob.hip[0],rob.hip[1],Math.sin(u*40)*14*a);}if(i===2){jy=0;}}});
    rob=R.shift(rob,jx,jy);
    // tracking lines between ghost and robot joints
    var lines='';['hL','hR','fL','fR','head'].forEach(function(j){var a=human[j],b=rob[j];lines+='<line x1="'+a[0].toFixed(1)+'" y1="'+(-a[1]).toFixed(1)+'" x2="'+b[0].toFixed(1)+'" y2="'+(-b[1]).toFixed(1)+'" stroke="'+YEL+'" stroke-width="5" stroke-dasharray="6 8" stroke-linecap="round"/>';});
    var coll=(t-pen[2][1]);var burst='';if(coll>0&&coll<.5){var bx=(rob.hR[0]+rob.hip[0])/2,by=-(rob.hR[1]+rob.hip[1])/2,r=20+coll*160;burst='<circle cx="'+bx.toFixed(1)+'" cy="'+by.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="none" stroke="#e2243d" stroke-width="'+(10*(1-coll/.5)).toFixed(1)+'"/>';}
    st.draw('<g>'+R.svg(rob,'robot')+'</g>'+lines+'<g>'+R.svg(human,'ghost',{stroke:PINK,sw:8})+'</g>'+burst,ox,fl,k,html);
    var v=rew(t);fill.style.height=(v*100).toFixed(1)+'%';fill.style.background=v<.35?'#e2243d':MINT;
    var cur=-1;pen.forEach(function(q,i){if(t>=q[1])cur=i;});
    var ru=t-(tw[0]-.2);var onG=(t>=tw[1]-.1&&cur<0);gain.className='chip'+(onG?' g':'');gain.style.opacity=ru<0?0:(onG?1:.4);
    penCh.forEach(function(cc,i){var u=t-pen[i][1];cc.className='chip'+(i===cur?' p':'');cc.style.opacity=ru<0?0:(i===cur?1:.4);});
    var gu=t-tw[0];tok.textContent=(t>=tw[0]&&cur<0)?'+1':(cur>=0?'−1':'');tok.style.color=cur>=0?'#e2243d':MINT;tok.style.opacity=cur>=0?clamp(1-((t-pen[cur][1])/.8),0,1):(t>=tw[0]?clamp(1-(t-tw[0]-.2)/1.6,.3,1):0);
    tok.style.transform='translateY('+(-lerp(0,40,cur>=0?clamp((t-pen[cur][1])/.8,0,1):clamp(gu/1.2,0,1))).toFixed(1)+'px)';
  }};
});
// ================= S4: compact code, new sequences =================
scenes.push(function(si){
  var P=Page(si,'// A VOCABULARY OF MOVES',['ONE','CODE.','|',{t:'ANY',at:.2},{t:'MOVE.',hl:1,at:.3}]);var p=P.el;
  // tape of mini poses scrolling left into the squeeze
  var tape=card(p,150,480,768,190);var ts=Stage(tape,0,0,768,190);ts.box.dataset.noclip=1;
  var tl=el('div','lab','BVH MOCAP TAPE','position:absolute;left:18px;top:12px;z-index:3');tape.appendChild(tl);
  // code cells
  var cc=card(p,150,700,768,120);var cl=el('div','lab','COMPACT CODE','position:absolute;left:18px;top:10px');cc.appendChild(cl);
  var cells=[];for(var i=0;i<12;i++){var d=el('div','','','position:absolute;left:'+(24+i*60)+'px;top:50px;width:48px;height:48px;border:3px solid '+INK+';border-radius:8px');cc.appendChild(d);cells.push(d);}
  // funnel arrow
  var ar=el('div');
  var tiles=[['SPRINT','run',W(si,16)],['SPIN KICK','spin',W(si,17)],['FLIP','flip',W(si,19)],['CARTWHEEL','cart',W(si,20)]].map(function(q,i){var x=150+(i%2)*396,y=850+Math.floor(i/2)*212;var t=card(p,x,y,372,196);var s=Stage(t,0,0,372,196);var l=el('div','lab',q[0],'position:absolute;left:14px;top:10px;z-index:3');t.appendChild(l);return {c:t,s:s,clip:q[1],at:q[2]};});
  var plan=chip(p,'AI PLANNER ▸ NEW SEQUENCE',150,800+10,'k','display:none');
  return {el:p,upd:function(t,lt){P.upd(lt);
    var html='',seq=['walk','run','spin','cart','kick','dance'];
    for(var i=0;i<9;i++){var x=((i*130-lt*90)%1170+1170)%1170-130;var cl=seq[i%6],s=(lt*.8+i*.37),lp=cl==='walk'||cl==='run';var Pp=R.sample(cl,s,{loop:lp,inplace:true});html+='<g transform="translate('+x.toFixed(1)+' 170) scale(.36)">'+R.svg(Pp,i%2?'robot':'human')+'</g>';}
    html+='<line x1="0" y1="172" x2="768" y2="172" stroke="'+INK+'" stroke-width="3"/>';
    ts.draw(html,0,0,1,'');
    cells.forEach(function(d,i){var on=Math.sin(t*5+i*1.3)>.2;d.style.background=on?[PINK,SKY,YEL][i%3]:'#fff';});
    
    tiles.forEach(function(q,i){var u=t-q.at;pop(q.c,u+.1,0);var lt2=Math.max(0,u);var h='',bgl='<line x1="0" y1="178" x2="372" y2="178" stroke="'+INK+'" stroke-width="3"/>';
      if(q.clip==='flip'){var ph=Math.min(1,((lt2/1.5)%1)*1.2),jump=Math.sin(Math.PI*ph)*70,Pp=R.sample('run',.1,{inplace:true});Pp=R.rotate(R.shift(Pp,0,jump),0,215+jump,-360*eo(ph));h+='<g>'+R.svg(Pp,'robot')+'</g>';q.s.draw(h,186,178,.3,bgl);}
      else{var lp=q.clip==='run',Pp=R.sample(q.clip,(q.clip==='cart'?1.0:q.clip==='spin'?.2:0)+lt2*(q.clip==='cart'?1.15:1),{loop:lp,inplace:true});h+='<g>'+R.svg(Pp,'robot')+'</g>';q.s.draw(h,186,178,.3,bgl);}
    });
  }};
});
// ================= S5: joystick steering, obstacles =================
scenes.push(function(si){
  var P=Page(si,'// JOYSTICK, NO RETRAINING',['STEER','IT.','|',{t:'DODGE',at:.2},{t:'IT.',hl:1,at:.3}]);var p=P.el;
  var c=card(p,150,480,768,520);var st=Stage(c,0,0,768,520);
  var jc=card(p,150,1030,300,230);var js=Stage(jc,0,0,300,230);jc.appendChild(el('div','lab','JOYSTICK','position:absolute;left:16px;top:12px'));
  var s1=chip(p,'NO RETRAINING',480,1060,'g','font-size:26px');var s2=chip(p,'REAL ROBOT',480,1130,'k');var s3=chip(p,'OBSTACLES: DODGED',480,1196,'y');
  var obs=[[.5,0],[1.6,1],[2.7,0],[3.7,1]]; // [arrival time since scene start, lane]
  function lane(lt){var l=0;obs.forEach(function(o){var dt=lt-(o[0]+.5);var other=o[1]===0?1:0;/* dodge into the other lane as the obstacle approaches */l=l;});
    // robot lane 0..1 : switches lane before each obstacle: pattern by time
    var v=0;[[.9,1],[1.9,0],[3.0,1],[4.0,0]].forEach(function(s,i){v=lerp(v,s[1],sm((lt-s[0])/.45));});return v;}
  return {el:p,upd:function(t,lt){P.upd(lt);
    var v=lane(lt),sp=R.speed('walk');
    var bg='<rect x="0" y="330" width="768" height="190" fill="#eef1f4"/><line x1="0" y1="330" x2="768" y2="330" stroke="'+INK+'" stroke-width="4"/><line x1="0" y1="425" x2="768" y2="425" stroke="rgba(16,20,38,.3)" stroke-width="3" stroke-dasharray="26 22" stroke-dashoffset="'+(lt*140).toFixed(0)+'"/>'+floorMarks(lt*sp*.55,768,330,520);
    var rx=250;
    // obstacles scroll left in lanes (lane 0 = far/upper at y 380, lane 1 = near/lower at y 470)
    obs.forEach(function(o,i){var x=768+60-(lt-(o[0]-1.4))*sp*.55;var y=o[1]===0?390:490;if(x>-80&&x<860){bg+='<g transform="translate('+x.toFixed(1)+' '+y+') scale(1.25)"><rect x="-34" y="-60" width="68" height="60" rx="8" fill="'+YEL+'" stroke="'+INK+'" stroke-width="4"/><path d="M-34 -30 H34" stroke="'+INK+'" stroke-width="4"/><text x="0" y="-36" text-anchor="middle" font-family="SM" font-weight="700" font-size="22" fill="'+INK+'">!</text></g>';}});
    var ry=lerp(390,490,v),Pp=R.sample('walk',lt*1.0,{loop:true,inplace:true}),sc=lerp(.5,.6,v);
    st.draw('<g>'+R.svg(Pp,'robot')+'</g>',rx,ry,sc,bg);
    // joystick follows lane intent + forward push
    var jx=Math.sin(lt*2.2)*.25,jy=lerp(-.35,.55,v)*1;var jh='<circle cx="150" cy="130" r="80" fill="#f1f3f5" stroke="'+INK+'" stroke-width="4"/><circle cx="150" cy="130" r="50" fill="none" stroke="rgba(16,20,38,.2)" stroke-width="3" stroke-dasharray="6 8"/>';
    var sx=150+jx*56,sy=130+(jy)*56;jh+='<line x1="150" y1="130" x2="'+sx+'" y2="'+sy+'" stroke="'+INK+'" stroke-width="12" stroke-linecap="round"/><circle cx="'+sx+'" cy="'+sy+'" r="30" fill="'+PINK+'" stroke="'+INK+'" stroke-width="4"/>';js.draw('',0,0,1,jh);
    pop(s1,t-W(si,10)+.1);pop(s2,t-W(si,3));pop(s3,t-W(si,7)+.2);
  }};
});
// ================= S6: which walk is human? =================
scenes.push(function(si){
  var P=Page(si,'// WHICH WALK IS HUMAN?',['WHICH','WALK','|',{t:'IS',at:.2},{t:'HUMAN?',hl:1,at:.3}]);var p=P.el;
  var cA=card(p,150,480,372,430),cB=card(p,546,480,372,430);var sA=Stage(cA,0,0,372,430),sB=Stage(cB,0,0,372,430);
  var la=el('div','lab','A · STANDARD','position:absolute;left:14px;top:12px;z-index:3');cA.appendChild(la);var lb=el('div','lab','B · NEW','position:absolute;left:14px;top:12px;z-index:3');cB.appendChild(lb);
  // voters
  var vc=card(p,150,940,768,310);var cnt=24,voters=[];
  var vcap=el('div','lab','PICKED "MORE NATURAL"','position:absolute;left:18px;top:12px');vc.appendChild(vcap);
  var colA=el('div','','','position:absolute;left:20px;top:56px;width:260px;height:230px;border:3px dashed rgba(16,20,38,.35);border-radius:14px');vc.appendChild(colA);
  var colB=el('div','','','position:absolute;left:300px;top:56px;width:450px;height:230px;border:3px dashed '+MINT+';border-radius:14px');vc.appendChild(colB);
  vc.appendChild(el('div','lab','A','position:absolute;left:30px;top:62px;color:#6a7188'));vc.appendChild(el('div','lab','B','position:absolute;left:310px;top:62px;color:'+MINT));
  var dotsDiv=[];for(var i=0;i<cnt;i++){var toB=i%24<17&&((i*7)%24<17);dotsDiv.push(el('div','','','position:absolute;width:26px;height:26px;border-radius:50%;background:'+INK+';border:3px solid #fff;box-shadow:2px 2px 0 rgba(16,20,38,.4)'));vc.appendChild(dotsDiv[i]);}
  // assign: 17 to B, 7 to A deterministic shuffle
  var order=[];for(i=0;i<cnt;i++)order.push(i);order.sort(function(a,b){return hash(a+3)-hash(b+3);});var dest=new Array(cnt);order.forEach(function(idx,k){dest[idx]=k<17?'B':'A';});
  var ia=0,ib=0,slot=new Array(cnt);for(i=0;i<cnt;i++){if(dest[i]==='A'){slot[i]=[34+(ia%8)*30,106+Math.floor(ia/8)*34+10];ia++;}else{slot[i]=[316+(ib%12)*34,106+Math.floor(ib/12)*38+6];ib++;}}
  var tv=el('div','stamp','2/3+ CHOSE B','right:20px;bottom:16px;font-size:34px;border-width:5px');vc.appendChild(tv);
  var t0=W(si,19),t1=W(si,26)+.3;
  var spd=R.speed('walk');
  return {el:p,upd:function(t,lt){P.upd(lt);
    var s=lt*1.0;
    var stiffT=Math.floor(s*9)/9;var PA=R.damp(R.sample('walk',stiffT,{loop:true,inplace:true}),'walk',.42),PB=R.sample('walk',s,{loop:true,inplace:true});
    var fl=405,k=.78;
    sA.draw('<g>'+R.svg(PA,'robot')+'</g>',186,fl,k,'<line x1="0" y1="'+fl+'" x2="372" y2="'+fl+'" stroke="'+INK+'" stroke-width="4"/>'+floorMarks(Math.floor(lt*spd*k*.5/ 8)*8,372,fl,fl+60));
    sB.draw('<g>'+R.svg(PB,'robot')+'</g>',186,fl,k,'<line x1="0" y1="'+fl+'" x2="372" y2="'+fl+'" stroke="'+INK+'" stroke-width="4"/>'+floorMarks(lt*spd*k*.5,372,fl,fl+60));
    dotsDiv.forEach(function(d,i){var at=t0+(t1-t0)*(order.indexOf(i)/cnt),u=clamp((t-at)/.4,0,1);var sx=18+(i%12)*60,sy=250;var x0=sx+ (hash(i)*10),y0=262;var e=eo5(u);d.style.left=lerp(x0+120,slot[i][0],e).toFixed(1)+'px';d.style.top=lerp(y0-4,slot[i][1],e).toFixed(1)+'px';d.style.opacity=t>=at-.15?1:(t>=t0-.8?.5:0);d.style.background=u>=1?(dest[i]==='B'?MINT:'#6a7188'):INK;});
    slam(tv,t-(W(si,12)),-5);if(t<W(si,12))tv.style.opacity=0;
    cA.style.outline='0';cB.style.boxShadow=t>W(si,24)?'10px 10px 0 '+MINT:'10px 10px 0 '+INK;
  }};
});
// ---- authored quadruped (ZEST backflip): body-local drawing, y down ----
function dog(ph,col,edge){
  var crouch=sm(ph/.2)*(1-sm((ph-.85)/.1)),air=sm((ph-.2)/.08)*(1-sm((ph-.84)/.06)),jump=Math.sin(Math.PI*clamp((ph-.2)/.65,0,1))*105*air,rot=-360*eo(clamp((ph-.24)/.6,0,1));
  var hy=-(100-crouch*30+jump),cx=0,s='';
  var legs=[[-52,0],[-36,0],[44,0],[60,0]];
  function leg(hx,fxs,fys,tuck){var fx=lerp(fxs,hx*.55,air*tuck),fy=lerp(fys,-28,air*tuck);var kx=(hx+fx)/2+16,ky=(0+fy)/2;return '<polyline points="'+hx+',0 '+kx.toFixed(1)+','+ky.toFixed(1)+' '+fx.toFixed(1)+','+fy.toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+kx.toFixed(1)+'" cy="'+ky.toFixed(1)+'" r="8" fill="'+YEL+'" stroke="'+edge+'" stroke-width="3"/>';}
  var fy0=100-crouch*30;
  var g='<g transform="translate('+cx+' '+hy.toFixed(1)+') rotate('+rot.toFixed(1)+')">';
  g+=leg(-52,-60,fy0,1)+leg(-34,-26,fy0,1);
  g+='<rect x="-86" y="-34" width="186" height="64" rx="26" fill="#c9d2da" stroke="'+edge+'" stroke-width="5"/><rect x="-60" y="-18" width="110" height="14" rx="7" fill="#aeb9c3"/>';
  g+='<g transform="translate(106 -30)"><rect x="-8" y="-14" width="58" height="46" rx="16" fill="#e3e8ec" stroke="'+edge+'" stroke-width="4"/><rect x="14" y="-2" width="30" height="12" rx="6" fill="'+INK+'"/><rect x="20" y="1" width="14" height="6" rx="3" fill="'+SKY+'"/></g>';
  g+=leg(44,60,fy0,1)+leg(60,96,fy0,1);
  g+='</g>';
  return g;
}
// ================= S7: ZEST — any input, plus a quadruped =================
scenes.push(function(si){
  var P=Page(si,'// ZEST · MOCAP · VIDEO · KEYFRAMES',['SAME','IDEA.','|',{t:'NEW',at:.2},{t:'INPUTS.',hl:1,at:.3}]);var p=P.el;
  var org=[chip(p,'BOSTON DYNAMICS',150,476,'k'),chip(p,'RAI INSTITUTE',420,476,'y')];
  var ins=[['MOCAP',W(si,14)-.1],['VIDEO',W(si,16)-.1],['KEYFRAMES',W(si,19)]].map(function(q,i){var c=card(p,150+i*264,540,240,230);var s=Stage(c,0,0,240,230);c.appendChild(el('div','lab',q[0],'position:absolute;left:12px;top:10px;z-index:3'));return {c:c,s:s,at:S[si].start+.1+i*.12,act:q[1],i:i};});
  var core=el('div','stamp','ZEST','left:432px;top:812px;font-size:56px;transform:rotate(-3deg);background:'+YEL);p.appendChild(core);core.style.transform='translateX(-50%) rotate(-3deg)';core.style.left='534px';
  var wires=svgEl(768,70);wires.svg.style.left='150px';wires.svg.style.top='764px';p.appendChild(wires.svg);
  var dc=card(p,150,900,768,350);var ds=Stage(dc,0,0,768,350);var dl=el('div','lab','QUADRUPED · BACKFLIP','position:absolute;left:16px;top:12px;z-index:3');dc.appendChild(dl);
  var tf=W(si,23)+.35;
  return {el:p,upd:function(t,lt){P.upd(lt);
    org.forEach(function(o,i){pop(o,t-[W(si,0),W(si,4)][i]);});
    ins.forEach(function(q){var u=t-q.at;pop(q.c,u,0);var ac=sm((t-q.act)/.2);q.c.style.opacity=(parseFloat(q.c.style.opacity)*(.6+.4*ac)).toFixed(3);q.c.style.boxShadow=ac>.5?'10px 10px 0 '+PINK:'10px 10px 0 '+INK;var h='',tt=Math.max(0,u)+1.0,i=q.i;
      if(i===0){var Pp=R.sample('walk',tt,{loop:true,inplace:true});q.s.draw('<g>'+R.svg(Pp,'human')+'</g>',120,200,.33,'<line x1="0" y1="200" x2="240" y2="200" stroke="'+INK+'" stroke-width="3"/>');}
      if(i===1){var Pp2=R.sample('run',tt,{loop:true,inplace:true});var sy=40+((tt*180)%140);q.s.draw('<g>'+R.svg(Pp2,'ghost',{stroke:SKY,sw:8})+'</g>',120,200,.33,'<rect x="14" y="40" width="212" height="170" rx="10" fill="none" stroke="'+INK+'" stroke-width="3" stroke-dasharray="12 8"/><rect x="14" y="'+sy+'" width="212" height="4" fill="'+SKY+'" opacity=".7"/><circle cx="214" cy="56" r="7" fill="#e2243d" opacity="'+(Math.floor(tt*2)%2?.3:1)+'"/>');}
      if(i===2){var ph=(tt*.5)%1,px=24+ph*192;var path='M24 170 C 70 40, 110 40, 120 110 S 180 190, 216 70';var kfs=[[24,170],[120,110],[216,70]];var dm=kfs.map(function(k){return '<rect x="'+(k[0]-9)+'" y="'+(k[1]-9)+'" width="18" height="18" transform="rotate(45 '+k[0]+' '+k[1]+')" fill="'+YEL+'" stroke="'+INK+'" stroke-width="3"/>';}).join('');q.s.draw('',0,0,1,'<path d="'+path+'" fill="none" stroke="'+PINK+'" stroke-width="5" stroke-linecap="round"/>'+dm+'<line x1="'+px.toFixed(1)+'" y1="40" x2="'+px.toFixed(1)+'" y2="210" stroke="'+INK+'" stroke-width="3"/><circle cx="'+px.toFixed(1)+'" cy="40" r="8" fill="'+INK+'"/>');}
    });
    var wh='';ins.forEach(function(q,i){var x=120+i*264-0,u=clamp((t-q.at-.3)/.5,0,1);var cxp=[120,384,648][i];wh+='<path d="M'+cxp+' 6 C '+cxp+' 40, 384 24, 384 66" fill="none" stroke="'+INK+'" stroke-width="4" stroke-dasharray="8 8" opacity="'+u+'"/>';if(u>0){var ph=((t*1.2+i*.33)%1);var yy=lerp(6,66,ph),xx=lerp(cxp,384,ph);wh+='<circle cx="'+xx.toFixed(1)+'" cy="'+yy.toFixed(1)+'" r="7" fill="'+PINK+'"/>';}});
    wires.g.innerHTML=wh;
    var cu=t-(S[si].start+.5);core.style.opacity=clamp(cu/.04,0,1);core.style.transform='translateX(-50%) rotate(-3deg) scale('+lerp(1.5,1,eo5(cu/.16)).toFixed(3)+')';if(cu<0)core.style.opacity=0;
    var ph=clamp((t-tf)/1.5,0,1),du=t-(S[si].start+.45);pop(dc,du,0);
    var flo='<line x1="0" y1="300" x2="768" y2="300" stroke="'+INK+'" stroke-width="4"/>';
    var gh='';if(ph>0&&ph<1)for(var g=4;g>=1;g--){var pp=clamp(ph-g*.04,0,1);gh+='<g opacity="'+(.3-g*.06).toFixed(2)+'">'+dog(pp,PINK,PINK)+'</g>';}
    var shw=ph>.2&&ph<.85?Math.sin(Math.PI*(ph-.2)/.65):0;
    ds.draw('<ellipse cx="0" cy="0" rx="'+(90-shw*35).toFixed(1)+'" ry="10" fill="rgba(16,20,38,.2)"/>'+gh+dog(ph,'#9aa6b1','#6d7a87'),384,300,1.0,flo);
  }};
});
// ================= S8: the catch =================
scenes.push(function(si){
  var P=Page(si,'// FLAT FLOORS ONLY',['FLAT','FLOORS','|',{t:'ONLY.',hl:1,at:.2}]);var p=P.el;
  var c=card(p,150,480,768,520);var st=Stage(c,0,0,768,520);
  var items=[['✓','FLAT FLOOR','g',W(si,5)-.05],['✓','NON-SLIPPERY','g',W(si,6)],['✗','NOTHING UNSEEN','p',W(si,10)]];
  var rows=items.map(function(q,i){return chip(p,q[0]+' '+q[1],150,1030+i*76,q[2],'font-size:26px;padding:12px 22px');});
  var sp=R.speed('walk'),tSlip=W(si,7)+.15,tUnk=W(si,10)-.15;
  var bubble=el('div','stamp','?','left:640px;top:600px;font-size:84px;border-radius:50%;padding:0 26px;z-index:4;transform:rotate(8deg)');p.appendChild(bubble);
  var warn=el('div','stamp','SLIPPED','left:230px;top:700px;font-size:50px;z-index:4;background:#fff');p.appendChild(warn);
  return {el:p,upd:function(t,lt){P.upd(lt);
    var fl=430,k=.8,bg='<rect x="0" y="'+fl+'" width="768" height="120" fill="#eef1f4"/><line x1="0" y1="'+fl+'" x2="768" y2="'+fl+'" stroke="'+INK+'" stroke-width="4"/>',fig='';
    if(t<tUnk){
      bg+=floorMarks(lt*sp*k,768,fl,fl+120);
      // level indicator + ice patch scrolling in
      var iceX=330+(tSlip-t)*sp*k;
      bg+='<g transform="translate('+iceX.toFixed(1)+' '+fl+')"><rect x="-90" y="-6" width="180" height="22" rx="8" fill="#bfe6ff" stroke="'+SKY+'" stroke-width="3"/><path d="M-60 6 L-30 -2 M10 8 L40 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>';
      var Pp=R.sample('walk',lt,{loop:true,inplace:true});var rx=330;
      var su=t-tSlip;
      if(su>0){var a=eo(clamp(su/.5,0,1));var fx=Pp.fR[0],fy=0;Pp=R.rotate(Pp,Pp.fR[0]-80*a,0,lerp(0,-84,a));Pp=R.shift(Pp,60*a,0);var mn=1e9;for(var jk in Pp)mn=Math.min(mn,Pp[jk][1]);Pp=R.shift(Pp,0,Math.max(0,12-mn));}
      fig='<g>'+R.svg(Pp,'robot')+'</g>';
      st.draw(fig,rx,fl,k,bg);
    }else{
      var u=t-tUnk,bg2=bg+floorMarks(0,768,fl,fl+120);
      var ob='<g transform="translate(560 '+fl+') scale(1.4)"><path d="M-50 0 L-30 -80 L10 -50 L46 -96 L60 0 Z" fill="'+YEL+'" stroke="'+INK+'" stroke-width="4" stroke-linejoin="round"/><text x="4" y="-30" text-anchor="middle" font-family="OU" font-weight="800" font-size="44" fill="'+INK+'">?</text></g>';
      var Pp3=R.sample('walk',.2,{inplace:true});Pp3=R.rotate(Pp3,Pp3.neck[0],Pp3.neck[1],Math.sin(u*9)*5);
      st.draw('<g>'+R.svg(Pp3,'robot')+'</g>',300,fl,k,bg2+ob);
    }
    rows.forEach(function(r,i){var on=t>=items[i][3];r.style.opacity=on?1:.4*clamp((t-S[si].start-.1)/.15,0,1);r.style.transform=on?'scale('+lerp(.9,1,clamp(eb((t-items[i][3])/.2),0,1)).toFixed(3)+')':'none';});
    slam(warn,t-tSlip-.35,-6);if(t<tSlip+.35||t>tUnk)warn.style.opacity=0;
    slam(bubble,t-tUnk-.1,8);if(t<tUnk+.1)bubble.style.opacity=0;
  }};
});
// ================= S9: whose motion + CTA =================
scenes.push(function(si){
  var P=Page(si,'// SOMEONE\'S DANCE FIRST',['WHOSE','|',{t:'MOTION',hl:1,at:.15},{t:'IS IT?',at:.3}]);var p=P.el;
  var dc=card(p,150,480,768,560);var ds=Stage(dc,0,0,768,560);
  dc.appendChild(el('div','lab','CMU MOCAP · DANCE','position:absolute;left:18px;top:14px;z-index:3'));
  var q=el('div','stamp','WHOSE MOTION?','left:200px;top:1075px;font-size:58px;z-index:5');p.appendChild(q);
  var cta=card(p,150,500,768,740);
  var pic=el('div','','','position:absolute;left:264px;top:50px;width:240px;height:240px;border-radius:50%;border:8px solid '+INK+';box-shadow:10px 10px 0 '+PINK+';background:url(profile.jpg) center/cover');cta.appendChild(pic);
  var hd=el('div','','@sandesh.explains','position:absolute;left:0;right:0;top:330px;text-align:center;font:800 62px OU,sans-serif;letter-spacing:-.02em');cta.appendChild(hd);
  var btn=el('div','','FOLLOW','position:absolute;left:204px;top:440px;width:360px;height:100px;border-radius:18px;background:'+PINK+';border:4px solid '+INK+';box-shadow:8px 8px 0 '+INK+';color:#fff;font:800 56px/92px OU,sans-serif;text-align:center;letter-spacing:.02em');cta.appendChild(btn);
  var sub=el('div','','for the next AI story','position:absolute;left:0;right:0;top:580px;text-align:center;font:700 34px IN,sans-serif');cta.appendChild(sub);
  var cm=el('div','lab','TELL ME BELOW ↓','position:absolute;left:0;right:0;top:650px;text-align:center;color:#4a5170');cta.appendChild(cm);
  var tCta=W(si,14)-.35,tMorph=W(si,5);
  return {el:p,upd:function(t,lt){P.upd(lt);
    var cu=t-tCta;dc.style.opacity=1-sm((t-(tCta-.05))/.18);dc.style.display=dc.style.opacity<=0?'none':'block';
    var m=sm((t-tMorph)/.5);
    var bg='<line x1="0" y1="500" x2="768" y2="500" stroke="'+INK+'" stroke-width="4"/>';
    var fl=R.sample('cart',clamp(.9+lt*1.15,0,4),{inplace:true});var dn=R.sample('dance',lt*.8+.5,{inplace:true});
    var h='<g opacity="'+(1-m).toFixed(3)+'">'+R.svg(fl,'robot')+'</g><g opacity="'+m.toFixed(3)+'">'+R.svg(dn,'human')+'</g>';
    ds.draw(h,384,520,1.0,bg);
    var hq=t-W(si,7);slam(q,hq,-5);if(hq<0||t>tCta)q.style.opacity=0;
    cta.style.opacity=clamp(cu/.1,0,1);cta.style.display=cu<-.05?'none':'block';cta.style.transform='translateY('+((1-eo5(cu/.4))*50).toFixed(1)+'px)';
    var bp=cu>.5?1+.04*Math.sin(t*7):1;btn.style.transform='scale('+bp.toFixed(3)+')';
    pic.style.transform='scale('+lerp(.7,1,clamp(eb(cu/.4),0,1.1)).toFixed(3)+')';
  }};
});
// ---- ambient + captions + seek ----
var dotsEl=document.getElementById('dots'),amb=document.getElementById('amb'),prog=document.querySelector('#prog i');
var ambs=[];for(var m=0;m<14;m++){var e=el('i','','','width:'+(10+hash(m)*14)+'px;height:'+(10+hash(m)*14)+'px;left:'+(120+hash(m+3)*800)+'px;top:'+(190+hash(m+7)*1100)+'px;opacity:.35');amb.appendChild(e);ambs.push({e:e,x:120+hash(m+3)*800,y:190+hash(m+7)*1100,sp:12+hash(m+9)*20});}
var note=el('div','','ILLUSTRATION · NOT THE ROBOT\'S FOOTAGE · MOCAP: CMU','position:absolute;left:150px;top:1284px;font:700 17px SM,monospace;letter-spacing:.06em;color:rgba(16,20,38,.62);white-space:nowrap');document.getElementById('w').appendChild(note);
var capEl=document.getElementById('capin'),capBox=document.getElementById('cap'),capKey='';
function drawCaps(t){var cur=null;for(var i=0;i<S.length;i++){var bs=S[i].caps;for(var j=0;j<bs.length;j++){var b=bs[j];if(t>=b.start-.04&&t<=b.end+.3){cur=b;}}}
  if(!cur){capBox.style.opacity=0;return;}var k=cur.start+'';
  if(k!==capKey){capKey=k;capEl.innerHTML=cur.words.map(function(w){return '<span class="w">'+w.w+'</span>';}).join(' ');}
  var kids=capEl.children;for(var q=0;q<kids.length;q++){var w=cur.words[q];kids[q].className='w'+((t>=w.s&&t<w.e+.06)?' on':'');}
  capBox.style.opacity=Math.min(cur.start<.15?1:sm((t-(cur.start-.04))/.1),1-sm((t-(cur.end+.15))/.15));}
var built=[];
function seek(t){
  var si=0;for(var i=0;i<S.length;i++){if(t>=S[i].start)si=i;}
  var sc=S[si];
  built.forEach(function(b,i){var show=(i===si);b.el.style.display=show?'block':'none';
    if(show){var u=(t-sc.start)/.22;b.el.style.opacity=1;b.el.style.transform=si===0?'none':'translateX('+((1-eo5(u))*40).toFixed(1)+'px)';b.upd(t,t-S[i].start);}});
  dotsEl.style.transform='translate('+((-t*14)%36).toFixed(1)+'px,'+((t*8)%36).toFixed(1)+'px)';
  ambs.forEach(function(o){var y=((o.y-t*o.sp-190)%1100+1100)%1100+190;o.e.style.top=y.toFixed(1)+'px';o.e.style.left=(o.x+Math.sin(t*.6+o.sp)*14).toFixed(1)+'px';});
  prog.style.width=(clamp(t/D.total,0,1)*100).toFixed(2)+'%';
  note.style.opacity=(si===S.length-1&&t>S[si].start+4.2)?0:1;
  drawCaps(t);
}
function boot(){Promise.all([document.fonts.load('800 100px OU'),document.fonts.load('700 30px IN'),document.fonts.load('700 30px SM'),new Promise(function(r){var i=new Image();i.onload=i.onerror=r;i.src='profile.jpg';})]).then(function(){return document.fonts.ready;}).then(function(){
  scenes.forEach(function(f,i){built.push(f(i));});window.__reelDurationSec=D.total;window.__seek=seek;seek(0);}).catch(function(e){document.title='ERR '+e.message;});}
window.addEventListener('load',boot);
})();
