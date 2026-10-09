// "Dollhouse Cutaway": paper-puppet characters on CMU mocap, Rhubarb-synced host. Every pixel is a pure function of t.
(function(){
'use strict';
var K=window.K,R=window.RIG,D=window.DATA,S=D.scenes,P_=window.PUP,C=P_.chars;
var clamp=K.clamp,lerp=K.lerp,eo5=K.eo5,eb=K.eb,sm=K.sm,el=K.el,hash=K.hash;
var INK='#2a2438',TEAL='#1f8a8a',TERRA='#e2674a',BUT='#ffd166',SAGE='#9bc5a5',WALL='#fbf1df',MINT='#bfe8d7',PEACH='#ffd9cf';
function W(si,i){var w=S[si].beats[0].words;return w[Math.min(i,w.length-1)].s;}
var pg=document.getElementById('pg');
var SPD=R.speed('walk'),KP=.8; // walk speed in world units/s; figure scale
function pp(x,m){var y=x%(2*m);return y>m?2*m-y:y;}
function ic(n,px,col){return '<svg viewBox="0 0 24 24" width="'+px+'" height="'+px+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible">'+(D.icons[n]||'')+'</svg>';}
// ---------- scene scaffold ----------
function Scene(si,eyeTxt,lines,o){o=o||{};
  var p=el('div','pg');p.id='p'+si;pg.appendChild(p);
  var eye=el('div','eb','<i></i><span></span>');p.appendChild(eye);var esp=eye.lastChild;
  var h=el('div','h');p.appendChild(h);var words=[];
  lines.forEach(function(ln,li){var line=el('div','');h.appendChild(line);ln.forEach(function(w,wi){var o2=typeof w==='string'?{t:w}:w;var sp=el('span','',o2.t,'display:inline-block;margin-right:.22em');line.appendChild(sp);words.push({s:sp,at:o2.at==null?(si===0?-1:.06+words.length*.1):o2.at});});});
  var room=el('div','room','','left:150px;top:470px;width:768px;height:470px');p.appendChild(room);
  var st=K.Stage(room,0,0,768,470,34);st.box.dataset.noclip=1;
  var hw=el('div','hostwin','','left:150px;top:965px');p.appendChild(hw);var hst=K.Stage(hw,0,0,270,290);hw.appendChild(el('div','tag','PIP · YOUR HOST'));
  var pad=el('div','pad','','left:445px;top:965px;width:473px;height:290px');p.appendChild(pad);
  var notes=[];
  var SLOTS=[[16,10],[232,92],[16,194],[232,196]];
  function note(txt,x,y,rot,col,at,w){var sl=SLOTS[Math.min(notes.length,3)];var n=el('div','note','','left:'+sl[0]+'px;top:'+sl[1]+'px;background:'+(col||BUT)+';--r:'+rot+'deg;');n.dataset.at=at;pad.appendChild(n);var o3={n:n,txt:txt,at:at,rot:rot};notes.push(o3);return o3;}
  function stamp(txt,x,y,rot,at,size,col){var s=el('div','stampp',txt,'left:'+x+'px;top:'+y+'px;'+(size?'font-size:'+size+'px;':'')+(col?'border-color:'+col+';color:'+col:''));p.appendChild(s);var o3={s:s,at:at,rot:rot};stamps.push(o3);return o3;}
  var stamps=[];
  function upd(t,lt,hostGest,hostClip){
    var nE=Math.floor(clamp((lt+(si===0?1:0)-.02)/.4,0,1)*eyeTxt.length);esp.textContent=eyeTxt.slice(0,nE);
    words.forEach(function(w){var u=lt-w.at;w.s.style.opacity=clamp(u/.05,0,1);w.s.style.transform='translateY('+((1-eo5(u/.26))*34).toFixed(1)+'px)';});
    notes.forEach(function(n){var u=t-n.at;if(u<0){n.n.style.opacity=0;return;}var chars=Math.floor(clamp(u/.5,0,1)*n.txt.length);n.n.textContent=n.txt.slice(0,Math.max(1,chars));n.n.style.opacity=1;n.n.style.transform='translateY('+(lerp(-70,0,eb(u/.3))).toFixed(1)+'px) rotate('+n.rot+'deg)';});
    stamps.forEach(function(s){var u=t-s.at;if(u<0){s.s.style.opacity=0;return;}s.s.style.opacity=1;s.s.style.transform='rotate('+s.rot+'deg) scale('+lerp(1.5,1,eo5(u/.18)).toFixed(3)+')';});
    drawHost(hst,t,hostClip);
  }
  return {p:p,room:room,st:st,pad:pad,note:note,stamp:stamp,upd:upd,hw:hw,hst:hst};
}
function drawHost(hst,t,clip){var c=clip||'gest',tt=c==='gest'?pp(t*.55,3.9):(c==='point'?pp(t*.5,5)+.5:0);var P=R.sample(c,tt,{inplace:true});
  hst.draw('<g>'+P_.svg(P,C.pip,{vis:K.viseme(t),blink:K.blink(t),front:1,bust:1})+'</g>',135,405,.8,'<rect width="270" height="290" fill="#cfe9e4"/><circle cx="215" cy="60" r="70" fill="#e6f4ef"/>');}
// ---------- props ----------
function G(x,y,k,inner,rot){return '<g transform="translate('+x+' '+y+') scale('+k+')'+(rot?' rotate('+rot+')':'')+'">'+inner+'</g>';}
function cam(x,y,k,on,rotDeg){var a=rotDeg||0,sx=Math.sin(a*Math.PI/180),face=Math.cos(a*Math.PI/180)>0;
  return G(x,y,k,'<rect x="-26" y="-60" width="52" height="120" rx="26" fill="#d9dde3" stroke="#aab1bb" stroke-width="3"/><rect x="-26" y="-60" width="52" height="30" rx="15" fill="#c3c9d1"/>'+(face?'<g transform="translate('+(sx*16).toFixed(1)+' 0)"><circle cx="0" cy="-12" r="15" fill="'+INK+'"/><circle cx="0" cy="-12" r="8" fill="'+(on?TERRA:'#3a3350')+'"/><circle cx="-3" cy="-15" r="3" fill="#fff"/></g>':'<path d="M-4 -40 V50" stroke="#aab1bb" stroke-width="3"/>'));}
function sofa(x,y){return G(x,y,1,'<rect x="0" y="-70" width="250" height="70" rx="26" fill="'+TERRA+'"/><rect x="-20" y="-50" width="46" height="60" rx="18" fill="#c9523a"/><rect x="224" y="-50" width="46" height="60" rx="18" fill="#c9523a"/><rect x="20" y="-34" width="210" height="38" rx="16" fill="#ee7e63"/>');}
function dogsvg(x,y,k,t,mode,hop){ // mode: 'sit'|'run'; hop in 0..1 arc
  var wag=Math.sin(t*14)*14,leg=mode==='run'?Math.sin(t*16):0,j=hop>0&&hop<1?Math.sin(Math.PI*hop)*60:0;
  var s='<ellipse cx="0" cy="2" rx="'+(54-j*.3)+'" ry="8" fill="rgba(42,36,56,.15)"/><g transform="translate(0 '+(-j)+')">';
  s+='<path d="M-46 -52 Q-76 '+(-70+wag)+' -70 '+(-92+wag)+'" stroke="#b9743c" stroke-width="12" fill="none" stroke-linecap="round"/>';
  [[-30,0],[-12,PI(leg)],[22,-PI(leg)],[40,0]].forEach(function(l){s+='<rect x="'+(l[0]-7)+'" y="-26" width="14" height="'+(28+(l[1]||0)*8)+'" rx="7" fill="#a8622f"/>';});
  s+='<rect x="-54" y="-70" width="108" height="50" rx="25" fill="#c98a52"/><ellipse cx="-4" cy="-38" rx="26" ry="14" fill="#f3d9b5"/>';
  s+='<g transform="translate(46 -78)"><ellipse cx="-10" cy="-8" rx="9" ry="18" fill="#8f5226" transform="rotate(14)"/><circle cx="0" cy="0" r="26" fill="#c98a52"/><ellipse cx="18" cy="8" rx="16" ry="11" fill="#f3d9b5"/><circle cx="29" cy="3" r="5" fill="'+INK+'"/><circle cx="6" cy="-6" r="4" fill="'+INK+'"/></g></g>';
  return G(x,y,k,s);}
function PI(v){return v;}
function floorBg(c1,c2,fy){return '<rect width="768" height="470" fill="'+c1+'"/><rect y="'+fy+'" width="768" height="'+(470-fy)+'" fill="'+c2+'"/>';}
function person(P,ch,o){return P_.svg(P,ch,o);}
function walkAt(ch,x,y,k,t,o){ // foot-locked walk: clip time follows screen x
  var s=Math.max(0,x/(SPD*k)),P=R.sample('walk',s,{loop:true,inplace:true}),P2=R.sample('walk',Math.max(0,(x-3)/(SPD*k)),{loop:true,inplace:true});
  o=o||{};o.blink=K.blink(t);o.sec=P_.secondary(P,P2);return G(x,y,k,person(P,ch,o));}
function idle(ch,x,y,k,t,o){var P=R.sample('shrug',0,{inplace:true});o=o||{};o.blink=K.blink(t);return G(x,y,k,person(P,ch,o));}
function noteIcon(x,y,k,rot,txt,col){return G(x,y,k,'<rect x="-36" y="-30" width="72" height="58" rx="6" fill="'+(col||BUT)+'" transform="rotate('+(rot||0)+')"/><path d="M-22 -14 H22 M-22 0 H12 M-22 14 H20" stroke="'+INK+'" stroke-width="5" stroke-linecap="round" transform="rotate('+(rot||0)+')"/>');}
function printNote(cx,cy,t,at){var u=t-at;if(u<0||u>1.1)return '';var e=eo5(u/.6),a=1-sm((u-.7)/.4);return '<g opacity="'+a.toFixed(2)+'">'+noteIcon(lerp(cx,cx+(a?150:0),e),cy+lerp(0,-18,e),.8+.3*e,lerp(-6,10,e))+'</g>';}
var built=[];
function walkDir(ch,x,y,k,t,dist,face,clip,o){var c=clip||'walk',spd=c==='walk'?SPD:R.speed(c),s=Math.max(0,dist/(Math.abs(spd)*k)),P=R.sample(c,s,{loop:true,inplace:true}),P2=R.sample(c,Math.max(0,(dist-3)/(Math.abs(spd)*k)),{loop:true,inplace:true});
  o=o||{};o.face=face;o.blink=K.blink(t);o.sec=P_.secondary(P,P2);return G(x,y,k,person(P,ch,o));}
function tag(x,y,txt,col,u){u=clamp(u,0,1);if(u<=0)return '';var w=txt.length*13+36;return '<g transform="translate('+x+' '+y+') scale('+lerp(.6,1,eb(u)).toFixed(3)+')" opacity="'+clamp(u*6,0,1)+'"><rect x="'+(-w/2)+'" y="-18" width="'+w+'" height="36" rx="18" fill="'+col+'"/><text x="0" y="6" text-anchor="middle" font-family="SM" font-weight="700" font-size="18" fill="#fff" letter-spacing="1">'+txt+'</text><path d="M-8 18 L0 30 L8 18Z" fill="'+col+'"/></g>';}
// ================= S1 =================
(function(){var si=0,sc=Scene(si,'// A CAMERA WITH NO FILM',[[{t:'NO',at:-1},{t:'VIDEO.',at:-1}],[{t:'AT ALL.',at:-1}]]);
  sc.note('Someone walked in',24,26,-3,BUT,-1);sc.note('Camera: recording OFF',150,120,2,MINT,W(si,4));sc.note('No video saved',250,182,-2,PEACH,W(si,7));
  sc.stamp('NO VIDEO',420,600,-8,W(si,7));
  built.push(function(t,lt){
    var u=clamp((t-W(si,5))/.4,0,1);
    var bg=floorBg(WALL,'#e9cfa6',402)+'<rect x="590" y="70" width="110" height="150" rx="10" fill="#bfe3ef"/><rect x="598" y="78" width="94" height="134" rx="6" fill="#dff3f8"/><rect x="30" y="325" width="170" height="12" rx="6" fill="#c9a26b"/>'+cam(110,255,.95,Math.floor(t*2)%2===0)+'<ellipse cx="110" cy="402" rx="40" ry="8" fill="rgba(42,36,56,.16)"/>'+sofa(440,402);
    var x=lerp(150,420,K.eo(clamp(t/3.4,0,1)));
    var reel='<g transform="translate(650 300)" opacity="'+clamp((t-W(si,5)+.15)/.15,0,1)+'"><circle r="46" fill="#fff" stroke="'+INK+'" stroke-width="6"/><circle r="9" fill="'+INK+'"/>'+[0,60,120,180,240,300].map(function(a){return '<circle cx="'+(24*Math.cos(a*Math.PI/180)).toFixed(1)+'" cy="'+(24*Math.sin(a*Math.PI/180)).toFixed(1)+'" r="8" fill="'+INK+'"/>';}).join('')+'</g><g transform="translate(650 300) scale('+eb(u).toFixed(3)+')" opacity="'+(u>0?1:0)+'"><circle r="62" fill="none" stroke="'+TERRA+'" stroke-width="12"/><path d="M-44 -44 L44 44" stroke="'+TERRA+'" stroke-width="12" stroke-linecap="round"/></g>';
    sc.st.draw('',0,0,1,bg+walkAt(C.maya,x,402,KP,t,{})+reel+printNote(110,255,t,.15));
    sc.upd(t,t-S[si].start);});
})();
// ================= S2 =================
(function(){var si=1,sc=Scene(si,'// J450 · THE LIP-BALM EYE',[['THE','LIP-BALM'],['CAMERA.']]);
  sc.note('Codename: J450',24,24,-3,BUT,W(si,2));sc.note('Per Bloomberg’s Gurman (rumor)',150,92,2,MINT,W(si,6),270);sc.note('Lip-balm size, oversized',90,196,-2,PEACH,W(si,18));
  function screen(x,y,label,col,st4,t,t0){var u=clamp((t-t0)/.35,0,1);if(u<=0)return '';var tt=st4?Math.floor(t*4)/4:t,px=lerp(60,200,((tt*.28)%1));
    var P=R.sample('walk',px/(SPD*.36),{loop:true,inplace:true});
    return '<g opacity="'+u+'"><clipPath id="cl'+x+y+'"><rect x="'+x+'" y="'+y+'" width="280" height="188" rx="18"/></clipPath><rect x="'+x+'" y="'+y+'" width="280" height="188" rx="18" fill="#1d1a26"/><g clip-path="url(#cl'+x+y+')"><rect x="'+x+'" y="'+(y+150)+'" width="280" height="40" fill="#3a3550"/>'+G(x+px,y+168,.36,person(P,C.sam,{blink:false}))+'</g><text x="'+(x+16)+'" y="'+(y+30)+'" font-family="SM" font-weight="700" font-size="17" fill="'+col+'">'+label+'</text></g>';}
  built.push(function(t,lt){
    var bg=floorBg('#f6e7cc','#e6c99b',402)+'<ellipse cx="190" cy="388" rx="120" ry="22" fill="#cdb48a"/><ellipse cx="190" cy="380" rx="120" ry="22" fill="#e2c9a0"/>';
    var bx=lerp(620,340,eo5(clamp((t-S[si].start-.4)/.6,0,1))),balm=G(bx,378,.85,'<rect x="-17" y="-100" width="34" height="100" rx="12" fill="#ff9aa8"/><rect x="-19" y="-120" width="38" height="36" rx="12" fill="'+TERRA+'"/><rect x="-10" y="-70" width="20" height="8" rx="4" fill="#fff" opacity=".7"/>');
    var camx=cam(190,290,1.5,Math.floor(t*2)%2===0,(t-S[si].start)*50);
    sc.st.draw('',0,0,1,bg+camx+balm+screen(450,24,'NORMAL VIDEO','#8fd9c2',false,t,W(si,8))+screen(450,238,'J450 · LOW FRAME RATE','#ff9d86',true,t,W(si,9)));
    sc.upd(t,t-S[si].start);});
})();
// ================= S3 =================
(function(){var si=2,sc=Scene(si,'// NOTES, NOT FOOTAGE',[['IT WATCHES.'],['IT WRITES.']]);
  sc.note('Someone entered the living room',20,18,-2,BUT,W(si,17),250);sc.note('Camera: watching the room',190,112,3,'#e3dcf7',W(si,5),250);sc.note('Dog hopped on the couch',60,196,-2,MINT,W(si,27),250);sc.note('Text only, per Gurman',170,190,1.5,PEACH,W(si,36),290);
  built.push(function(t,lt){
    var q=Math.floor(t*4)/4; // the "slow eye": everything in the viewfinder moves at 4 fps
    var bg='<rect width="768" height="470" fill="#1d1a26"/><rect x="26" y="26" width="716" height="418" rx="14" fill="#2b2738"/><rect x="26" y="360" width="716" height="84" fill="#3a3550"/><path d="M26 74 V26 H74 M694 26 H742 V74 M742 396 V444 H694 M74 444 H26 V396" stroke="#fff" stroke-width="6" fill="none" opacity=".8"/><text x="60" y="64" font-family="SM" font-weight="700" font-size="22" fill="#ff7b6b">● WATCHING · 4 FPS</text>'+sofa(470,395);
    var sx=lerp(-40,400,K.eo(clamp((q-12.7)/3.6,0,1)));
    var fig=walkAt(C.sam,sx,410,KP,q,{});
    var dt=q-17.0,hop=clamp((dt-.4)/.6,0,1),dx=dt<0?0:lerp(700,490,K.eo(clamp(dt/.5,0,1)));
    var dog=dt<0?'':dogsvg(dx,hop>=1?340:410,.7,q,hop<=0&&dt<.5?'run':'sit',hop);
    var seen=t>=W(si,13)?'<g opacity="'+(.5+.5*Math.sin(t*6))+'"><rect x="'+(sx-62)+'" y="150" width="124" height="250" rx="12" fill="none" stroke="#8fd9c2" stroke-width="4" stroke-dasharray="14 10"/></g>':'';
    sc.st.draw('',0,0,1,bg+fig+seen+dog+printNote(700,60,t,W(si,17))+printNote(700,60,t,W(si,27)));
    sc.upd(t,t-S[si].start);});
})();
// ================= S4 =================
(function(){var si=3,sc=Scene(si,'// IT KNOWS WHO LIVES HERE',[['FAMILIAR'],['FACES.']]);
  sc.note('Recognizes the household',24,20,-2,'#e3dcf7',S[si].start+.4,260);sc.note('Maya is home',190,92,2,MINT,W(si,4)+.4);sc.note('The dog is on the rug',20,176,-2,BUT,W(si,9)+.4,230);sc.note('Sam left the house',230,196,2,PEACH,W(si,17),220);
  built.push(function(t,lt){
    var door=clamp((t-S[si].start)/.5,0,1)*clamp(1,0,1);
    var bg=floorBg(WALL,'#e9cfa6',402)+'<rect x="24" y="130" width="96" height="272" rx="10" fill="#c9a26b"/><rect x="34" y="140" width="76" height="252" rx="6" fill="#dcb98a"/><circle cx="96" cy="270" r="6" fill="'+BUT+'"/><rect x="590" y="70" width="110" height="150" rx="10" fill="#bfe3ef"/><ellipse cx="540" cy="404" rx="120" ry="16" fill="#9bc5a5"/>'+cam(660,160,.8,Math.floor(t*2)%2===0)+sofa(300,402);
    var mx=lerp(60,290,K.eo(clamp((t-22.9)/1.8,0,1)));
    var maya=walkAt(C.maya,mx,402,KP,t,{});
    var tags=tag(mx,150,'MAYA · HOUSEHOLD','#1f8a8a',(t-W(si,4))/.3);
    var dog=t>=W(si,9)-.2?dogsvg(560,404,.7,t,'sit',0):'';var dtag=tag(560,262,'DOG · PET','#e2674a',(t-W(si,9))/.3);
    var d0=W(si,15)-.4,dist=clamp((t-d0)*SPD*KP*.95,0,330),sx=470-dist,sam=t>=d0?walkDir(C.sam,sx,410,.86,t,dist,-1):'';
    var stag=t>=d0?tag(sx,150,'SAM · LEAVING','#3d5a80',(t-W(si,16))/.3):'';
    sc.st.draw('',0,0,1,bg+dog+maya+sam+tags+dtag+stag+printNote(660,160,t,W(si,4)+.4)+printNote(660,160,t,W(si,17)));
    sc.upd(t,t-S[si].start);});
})();
// ================= S5 =================
(function(){var si=4,sc=Scene(si,'// NOTHING TO LEAK',[['NOTHING'],['TO LEAK.']]);
  sc.note('No footage to watch or leak',24,22,-2,BUT,W(si,12),270);sc.note('Apple’s pitch (per Gurman)',180,120,2,MINT,S[si].start+.3,250);
  function eye(x,y,k,open,col){return G(x,y,k,'<path d="M-40 0 Q0 '+(open?-34:-6)+' 40 0 Q0 '+(open?34:6)+' -40 0Z" fill="#fff" stroke="'+col+'" stroke-width="6"/>'+(open?'<circle r="13" fill="'+INK+'"/><circle cx="-4" cy="-4" r="4" fill="#fff"/>':''));}
  function reel(x,y,k){return G(x,y,k,'<circle r="30" fill="#fff" stroke="'+INK+'" stroke-width="5"/><circle r="6" fill="'+INK+'"/>'+[0,72,144,216,288].map(function(a){return '<circle cx="'+(16*Math.cos(a*Math.PI/180)).toFixed(1)+'" cy="'+(16*Math.sin(a*Math.PI/180)).toFixed(1)+'" r="5" fill="'+INK+'"/>';}).join(''));}
  function cloud(x,y,k){return G(x,y,k,'<path d="M-50 20 Q-70 20 -64 0 Q-60 -22 -34 -18 Q-24 -46 6 -38 Q34 -42 40 -14 Q70 -12 66 12 Q64 22 50 20Z" fill="#dfeaf0" stroke="#aebfc9" stroke-width="4"/>');}
  built.push(function(t,lt){
    var T0=S[si].start,bg=floorBg(WALL,'#e9cfa6',402)+'<path d="M384 20 V450" stroke="#d9bd8f" stroke-width="4" stroke-dasharray="10 10"/><text x="30" y="40" font-family="SM" font-weight="700" font-size="20" fill="#7a6a58">VIDEO CAMERA</text><text x="414" y="40" font-family="SM" font-weight="700" font-size="20" fill="#7a6a58">J450 (RUMORED)</text>';
    // left: video camera streaming up to a cloud; hacker steals the reel
    var cableL='<path d="M150 300 V140 H200" stroke="#7a6a58" stroke-width="5" fill="none" stroke-dasharray="3 12" stroke-linecap="round"/>';
    var cableR='<path d="M534 300 V140 H584" stroke="#7a6a58" stroke-width="5" fill="none" stroke-dasharray="3 12" stroke-linecap="round"/>';
    var leak=clamp((t-W(si,15))/.9,0,1),streamDots='';for(var i=0;i<5;i++){var ph=((t*.6+i/5)%1);streamDots+='<circle cx="'+lerp(150,200,ph>.7?(ph-.7)/.3:0)+'" cy="'+lerp(300,140,Math.min(1,ph/.7))+'" r="6" fill="'+TERRA+'" opacity="'+(t>=W(si,17)?1:0)+'"/>';}
    var reelPos=leak>0?[lerp(200,150,K.eo(leak)),lerp(140,360,K.eo(leak))]:[190,140];
    var left=cableL+cloud(230,120,1.0)+cam(150,320,1.05,Math.floor(t*2)%2===0)+eye(120,90,.8,t>=W(si,7),'#e2674a')+streamDots+reel(reelPos[0],reelPos[1],.9)+'<ellipse cx="150" cy="404" rx="36" ry="7" fill="rgba(42,36,56,.15)"/>';
    var hackerL=G(150,414,.55,person(R.sample('shrug',t>=W(si,15)?clamp((t-W(si,15))*.9,0,1.9):0,{inplace:true}),C.burglar,{blink:K.blink(t),face:1}));
    var leakChip=leak>.6?'<g transform="translate(260 300)"><rect x="-58" y="-18" width="116" height="36" rx="18" fill="#e2243d"/><text text-anchor="middle" y="6" font-family="SM" font-weight="700" font-size="18" fill="#fff">LEAKED!</text></g>':'';
    // right: no footage, only notes; hacker finds a note and shrugs
    var noteX=t>=W(si,15)?lerp(584,540,K.eo(clamp((t-W(si,15))/.8,0,1))):584,noteY=t>=W(si,15)?lerp(140,340,K.eo(clamp((t-W(si,15))/.8,0,1))):140;
    var ban=t>=W(si,11)?'<g transform="translate(534 230)"><circle r="40" fill="none" stroke="'+TERRA+'" stroke-width="9"/><path d="M-28 -28 L28 28" stroke="'+TERRA+'" stroke-width="9" stroke-linecap="round"/></g>':'';
    var right=cableR+cam(534,320,1.05,Math.floor(t*2)%2===0)+eye(504,90,.8,false,'#7a6a58')+noteIcon(noteX,noteY,.7,-6)+ban+'<ellipse cx="534" cy="404" rx="36" ry="7" fill="rgba(42,36,56,.15)"/>';
    var hackerR=G(640,414,.55,person(R.sample('shrug',t>=W(si,15)+.6?clamp((t-W(si,15)-.6)*.9,0,1.9):0,{inplace:true}),C.burglar,{blink:K.blink(t),face:-1}));
    var lock=t>=W(si,3)?G(384,120,1.2,'<rect x="-18" y="-6" width="36" height="30" rx="8" fill="'+TEAL+'"/><path d="M-11 -6 V-16 a11 11 0 0 1 22 0 V-6" stroke="'+TEAL+'" stroke-width="7" fill="none"/>'):'';
    sc.st.draw('',0,0,1,bg+left+hackerL+leakChip+right+hackerR+lock);
    sc.upd(t,t-T0);});
})();
// ================= S6 =================
(function(){var si=5,sc=Scene(si,'// WHAT DO YOU HAND THE POLICE?',[['THE'],['CATCH.']]);
  sc.note('A break-in (illustration)',24,24,-2,PEACH,S[si].start+.3,230);sc.note('A person entered the kitchen',180,120,2,BUT,W(si,19),270);
  sc.stamp('NO CLIP',200,560,-7,W(si,23),50);sc.stamp('NO PROOF',420,720,-6,W(si,25),44);
  var sspd=R.speed('stealth');
  built.push(function(t,lt){
    var T0=S[si].start,bg=floorBg('#f7e8cc','#e1c595',402)+'<rect x="40" y="90" width="300" height="130" rx="12" fill="#dfe9d9"/><rect x="60" y="250" width="260" height="152" rx="10" fill="#c9d6c5"/><circle cx="110" cy="320" r="22" fill="#b3c4af"/><circle cx="200" cy="320" r="22" fill="#b3c4af"/>'+cam(560,150,.95,Math.floor(t*2)%2===0);
    var bd=clamp((t-34.1)*Math.abs(sspd)*KP*.8,0,900),bx=70+bd;
    var burglar=bx<860?walkDir(C.burglar,bx,402,KP,t,bd,1,'stealth'):'';
    var od=clamp((t-W(si,11))*SPD*KP*.9,0,300),ox=820-od,officer='';
    if(t>=W(si,11)){var shrugT=t>=W(si,21)?clamp((t-W(si,21))*.8,0,1.9):0;
      if(od<299)officer=walkDir(C.officer,ox,402,KP,t,od,-1);
      else officer=G(ox,402,KP,person(R.sample('shrug',shrugT,{inplace:true}),C.officer,{blink:K.blink(t),face:-1,brow:t>=W(si,21)?-4:0}));}
    var bubble=(t>=W(si,13)+.3&&t<W(si,15))?'<g transform="translate('+(ox-50)+' 150)"><rect x="-58" y="-34" width="116" height="52" rx="22" fill="#fff"/><text x="0" y="3" text-anchor="middle" font-family="BR" font-weight="800" font-size="26" fill="'+INK+'">Footage?</text><path d="M18 18 L28 34 L38 18Z" fill="#fff"/></g>':'';
    sc.st.draw('',0,0,1,bg+burglar+officer+bubble+printNote(560,150,t,W(si,19)));
    sc.upd(t,t-T0);});
})();
// ================= S7 =================
(function(){var si=6,sc=Scene(si,'// “RECORDING” IS BEING REDEFINED',[['RECORDING'],['REDEFINED.']]);
  sc.note('Apple, Google: new “recording”',24,20,-2,'#e3dcf7',S[si].start+.4,270);sc.note('Transcribes + summarizes',150,110,2,MINT,W(si,18),250);sc.note('Video: not saved',40,196,-2,BUT,W(si,22),240);
  function recLight(x,y,on,t){return '<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+(on?(Math.floor(t*3)%2?'#e2243d':'#ff7b6b'):'#bdb4a4')+'"/>';}
  function textBubble(x,y,u){u=clamp(u,0,1);if(u<=0)return '';return '<g transform="translate('+x+' '+y+') scale('+lerp(.6,1,eb(u)).toFixed(3)+')"><rect x="-62" y="-52" width="124" height="64" rx="18" fill="#fff"/><path d="M-30 12 L-18 28 L-6 12Z" fill="#fff"/><path d="M-40 -34 H40 M-40 -20 H18 M-40 -6 H30" stroke="'+TEAL+'" stroke-width="6" stroke-linecap="round"/></g>';}
  built.push(function(t,lt){
    var bg=floorBg('#f6e7cc','#e6c99b',402)+'<rect x="30" y="360" width="708" height="16" rx="8" fill="#c9a26b"/>';
    var t1=W(si,18),t2=W(si,20),t3=W(si,22);
    // earbuds case
    var e='<g transform="translate(150 280)"><rect x="-50" y="-42" width="100" height="84" rx="34" fill="#f5f0e8" stroke="#d7cfc0" stroke-width="4"/><path d="M-50 -6 H50" stroke="#d7cfc0" stroke-width="4"/><circle cx="-18" cy="22" r="8" fill="#e8e1d3"/>'+recLight(0,-24,t<t1,t)+'</g>';
    // watch
    var w='<g transform="translate(384 270)"><rect x="-26" y="-92" width="52" height="60" rx="10" fill="#9bc5a5"/><rect x="-26" y="32" width="52" height="60" rx="10" fill="#9bc5a5"/><rect x="-46" y="-52" width="92" height="104" rx="26" fill="'+INK+'"/><rect x="-38" y="-44" width="76" height="88" rx="20" fill="#3a3550"/>'+recLight(0,-14,t<t2,t)+'<text y="22" text-anchor="middle" font-family="SM" font-weight="700" font-size="20" fill="#fff">REC</text></g>';
    // glasses
    var g='<g transform="translate(618 290)"><circle cx="-34" cy="0" r="30" fill="rgba(191,227,239,.7)" stroke="'+INK+'" stroke-width="7"/><circle cx="34" cy="0" r="30" fill="rgba(191,227,239,.7)" stroke="'+INK+'" stroke-width="7"/><path d="M-4 -4 H4 M-64 -4 L-82 -14 M64 -4 L82 -14" stroke="'+INK+'" stroke-width="7" stroke-linecap="round"/>'+recLight(0,-42,t<t3,t)+'</g>';
    sc.st.draw('',0,0,1,bg+e+w+g+textBubble(150,200,(t-t1)/.3)+textBubble(384,170,(t-t2)/.3)+textBubble(618,200,(t-t3)/.3)+tag(150,116,'EARBUDS','#3d5a80',(t-W(si,16))/.3)+tag(384,96,'WATCH','#e2674a',(t-W(si,16)-.2)/.3)+tag(618,120,'GLASSES','#1f8a8a',(t-W(si,16)-.4)/.3));
    sc.upd(t,t-S[si].start);});
})();
// ================= S8 =================
(function(){var si=7,sc=Scene(si,'// RUMOR · UNANNOUNCED',[['NOT'],['YET.']]);
  sc.note('Don’t pencil it in yet',24,20,-2,'#e3dcf7',S[si].start+.3,250);sc.note('Apple: nothing announced',170,104,2,PEACH,W(si,7),250);sc.note('Camera: reportedly 2027',20,176,-2,BUT,W(si,18),230);sc.note('Display: maybe this month',230,196,2,MINT,W(si,30),230);
  sc.stamp('UNANNOUNCED',230,700,-6,W(si,7)+.3,44);
  built.push(function(t,lt){
    var bg=floorBg(WALL,'#e9cfa6',402);
    // wall calendar: flips from "LATER" to "2027"
    var fl=clamp((t-W(si,16))/.5,0,1),page=(fl<.5)?'LATER':'2027';
    var cal='<g transform="translate(130 200)"><rect x="-90" y="-110" width="180" height="210" rx="14" fill="#fff" stroke="#e7d9c0" stroke-width="5"/><rect x="-90" y="-110" width="180" height="46" rx="14" fill="'+TERRA+'"/><circle cx="-50" cy="-110" r="8" fill="'+INK+'"/><circle cx="50" cy="-110" r="8" fill="'+INK+'"/><g transform="translate(0 6) scale(1 '+Math.max(.04,Math.abs(Math.cos(fl*Math.PI))).toFixed(3)+')"><text y="22" text-anchor="middle" font-family="BR" font-weight="800" font-size="'+(page==='LATER'?46:62)+'" fill="'+INK+'">'+page+'</text></g></g>';
    // the camera (outline until announced...) and the display it pairs with
    var camg='<g opacity=".92">'+cam(400,290,1.1,Math.floor(t*2)%2===0)+'</g>';
    var dx=lerp(900,610,eo5(clamp((t-W(si,20))/.6,0,1)));
    var disp=G(dx,300,1,'<rect x="-70" y="-80" width="140" height="100" rx="14" fill="'+INK+'"/><rect x="-62" y="-72" width="124" height="84" rx="8" fill="#3a3550"/><path d="M-30 -40 H30 M-30 -22 H10" stroke="#8fd9c2" stroke-width="6" stroke-linecap="round"/><rect x="-14" y="20" width="28" height="48" rx="8" fill="#9aa0aa"/><rect x="-44" y="62" width="88" height="14" rx="7" fill="#9aa0aa"/>');
    var pairs=t>=W(si,24)?'<path d="M440 280 Q520 230 580 270" stroke="'+TERRA+'" stroke-width="6" fill="none" stroke-dasharray="3 12" stroke-linecap="round"/>':'';
    var rx=((t*40)%900)-120,rumor=G(rx,90+Math.sin(t*2)*8,1,'<path d="M-50 20 Q-70 20 -64 0 Q-60 -22 -34 -18 Q-24 -46 6 -38 Q34 -42 40 -14 Q70 -12 66 12 Q64 22 50 20Z" fill="#e9eef2" stroke="#c4cfd6" stroke-width="4"/><text y="8" text-anchor="middle" font-family="BR" font-weight="800" font-size="26" fill="#7b8794">rumor?</text>');
    sc.st.draw('',0,0,1,bg+cal+camg+(t>=W(si,19)?disp+pairs:'')+rumor);
    sc.upd(t,t-S[si].start);});
})();
// ================= S9 =================
(function(){var si=8,sc=Scene(si,'// FOOTAGE OR PRIVACY?',[['WOULD YOU'],['TRADE IT?']]);
  sc.note('Footage ↔ privacy?',24,20,-2,'#e3dcf7',S[si].start+.3,250);sc.note('Tell me below ↓',190,120,3,BUT,W(si,9),260);
  var cta=el('div','cta','','left:150px;top:470px;width:768px;height:470px');sc.p.appendChild(cta);
  var pic=el('div','','','position:absolute;left:284px;top:20px;width:200px;height:200px;border-radius:50%;border:8px solid #fff;box-shadow:0 14px 28px rgba(42,36,56,.3),0 0 0 8px '+TERRA+';background:url(profile.jpg) center/cover');cta.appendChild(pic);
  cta.appendChild(el('div','','@sandesh.explains','position:absolute;left:0;right:0;top:246px;text-align:center;font:800 56px BR,sans-serif;letter-spacing:-.02em;color:'+INK));
  var btn=el('div','','FOLLOW','position:absolute;left:224px;top:328px;width:320px;height:80px;border-radius:40px;background:'+TERRA+';color:#fff;font:800 46px/80px BR,sans-serif;text-align:center;box-shadow:0 12px 24px rgba(226,103,74,.45)');cta.appendChild(btn);
  cta.appendChild(el('div','','for the next tech story','position:absolute;left:0;right:0;top:424px;text-align:center;font:700 26px IN,sans-serif;color:#6a5f5a'));
  var tC=W(si,12)-.4;
  built.push(function(t,lt){
    var ang=lerp(-9,0,sm((t-W(si,3))/.5));if(t>=W(si,8)-.2)ang=lerp(0,10,sm((t-W(si,8)+.2)/.5));
    var bg=floorBg(WALL,'#e9cfa6',402);
    var sw=G(384,380,1,'<path d="M-30 0 L0 -50 L30 0Z" fill="#c9a26b"/><g transform="rotate('+ang.toFixed(2)+' 0 -50)"><rect x="-300" y="-64" width="600" height="18" rx="9" fill="'+TERRA+'"/>'+G(-230,-120,1.3,'<circle r="34" fill="#fff" stroke="'+INK+'" stroke-width="6"/><circle r="7" fill="'+INK+'"/>'+[0,72,144,216,288].map(function(a){return '<circle cx="'+(19*Math.cos(a*Math.PI/180)).toFixed(1)+'" cy="'+(19*Math.sin(a*Math.PI/180)).toFixed(1)+'" r="6" fill="'+INK+'"/>';}).join(''),-ang)+G(230,-120,1.3,'<rect x="-26" y="-6" width="52" height="42" rx="10" fill="'+TEAL+'"/><path d="M-16 -6 V-22 a16 16 0 0 1 32 0 V-6" stroke="'+TEAL+'" stroke-width="9" fill="none"/>',-ang)+'</g>');
    var lab='<text x="130" y="60" font-family="SM" font-weight="700" font-size="22" fill="#7a6a58">FOOTAGE</text><text x="560" y="60" font-family="SM" font-weight="700" font-size="22" fill="#7a6a58">PRIVACY</text>';
    sc.st.draw('',0,0,1,bg+lab+sw);
    var cu=t-tC;sc.room.style.opacity=cu<0?1:1-clamp(cu/.2,0,1);sc.room.style.display=(cu>.25)?'none':'block';
    cta.style.display=cu<0?'none':'block';cta.style.opacity=clamp(cu/.25,0,1);cta.style.transform='translateY('+((1-eo5(cu/.4))*40).toFixed(1)+'px)';
    btn.style.transform='scale('+(cu>.6?1+.04*Math.sin(t*7):1)+')';
    sc.upd(t,t-S[si].start,'point');});
})();
// ---------- ambient, captions, seek ----------
var amb=document.getElementById('amb'),ambs=[];for(var m=0;m<12;m++){var e=el('i','','','width:'+(8+hash(m)*16)+'px;height:'+(8+hash(m)*16)+'px;left:'+(100+hash(m+3)*880)+'px;top:'+(190+hash(m+7)*1100)+'px');amb.appendChild(e);ambs.push({e:e,x:100+hash(m+3)*880,y:190+hash(m+7)*1100,sp:10+hash(m+9)*16});}
var note=el('div','','ILLUSTRATION · RUMOR, NOT AN APPLE PRODUCT · MOCAP: CMU','position:absolute;left:150px;top:1284px;font:700 17px SM,monospace;letter-spacing:.06em;color:rgba(42,36,56,.6);white-space:nowrap');document.getElementById('w').appendChild(note);
var capEl=document.getElementById('capin'),capBox=document.getElementById('cap'),capKey='';
function drawCaps(t){var cur=null;for(var i=0;i<S.length;i++){var bs=S[i].caps;for(var j=0;j<bs.length;j++){var b=bs[j];if(t>=b.start-.04&&t<=b.end+.3)cur=b;}}
  if(!cur){capBox.style.opacity=0;return;}var k=cur.start+'';if(k!==capKey){capKey=k;capEl.innerHTML=cur.words.map(function(w){return '<span class="w">'+w.w+'</span>';}).join(' ');}
  var kids=capEl.children;for(var q=0;q<kids.length;q++){var w=cur.words[q];kids[q].className='w'+((t>=w.s&&t<w.e+.06)?' on':'');}
  capBox.style.opacity=Math.min(cur.start<.15?1:sm((t-(cur.start-.04))/.1),1-sm((t-(cur.end+.15))/.15));}
function seek(t){var si=0;for(var i=0;i<S.length;i++){if(t>=S[i].start)si=i;}
  S.forEach(function(sc,i){var p=document.getElementById('p'+i);p.style.display=i===si?'block':'none';});
  var p=document.getElementById('p'+si),u=(t-S[si].start)/.22;p.style.transform=si===0?'none':'translateX('+((1-eo5(u))*40).toFixed(1)+'px)';
  built[si](t,t-S[si].start);
  ambs.forEach(function(o){var y=((o.y-t*o.sp-190)%1100+1100)%1100+190;o.e.style.top=y.toFixed(1)+'px';o.e.style.left=(o.x+Math.sin(t*.6+o.sp)*14).toFixed(1)+'px';});
  note.style.opacity=(si===S.length-1&&t>S[si].start+3.6)?0:1;drawCaps(t);}
function boot(){Promise.all([document.fonts.load('800 100px BR'),document.fonts.load('700 30px IN'),document.fonts.load('700 30px SM'),new Promise(function(r){var i=new Image();i.onload=i.onerror=r;i.src='profile.jpg';})]).then(function(){return document.fonts.ready;}).then(function(){window.__reelDurationSec=D.total;window.__seek=seek;seek(0);window.__ready=true;}).catch(function(e){document.title='ERR '+e.message;});}
window.addEventListener('load',boot);
})();
