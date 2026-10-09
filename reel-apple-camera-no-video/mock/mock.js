// THROWAWAY mockup (delete after approval): Dollhouse Cutaway, scenes 1 (animated, talking host), 3 and 6 (static looks).
(function(){
'use strict';
var K=window.K,R=window.RIG,D=window.DATA,S=D.scenes,clamp=K.clamp,lerp=K.lerp,eo5=K.eo5,eb=K.eb,sm=K.sm,el=K.el;
var INK='#2a2438',TEAL='#1f8a8a',TERRA='#e2674a',BUT='#ffd166',SAGE='#9bc5a5',WALL='#fbf1df';
function W(si,i){var w=S[si].beats[0].words;return w[Math.min(i,w.length-1)].s;}
var pg=document.getElementById('pg');
function page(id){var p=el('div','pg');p.id=id;pg.appendChild(p);return p;}
function head(p,eyeTxt,lines){p.appendChild(el('div','eb','<i></i>'+eyeTxt));var h=el('div','h');lines.forEach(function(l){h.appendChild(el('div','',l));});p.appendChild(h);return h;}
function room(p,x,y,w,h){var r=el('div','room','','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px');p.appendChild(r);return r;}
function hostWin(p,x,y){var w=el('div','hostwin','','left:'+x+'px;top:'+y+'px');p.appendChild(w);var st=K.Stage(w,0,0,270,290);w.appendChild(el('div','tag','PIP · YOUR HOST'));return {w:w,st:st};}
function pp(x,m){var y=x%(2*m);return y>m?2*m-y:y;}
function drawHost(h,t,gest,clip){var P=R.sample(clip||'gest',pp(t*.55,3.9),{inplace:true});h.st.draw('<g>'+PUP.svg(P,PUP.chars.pip,{vis:K.viseme(t),blink:K.blink(t),front:1,bust:1})+'</g>',135,405,.8,'<rect x="0" y="0" width="270" height="290" fill="#cfe9e4"/><circle cx="215" cy="60" r="70" fill="#e6f4ef"/>');}
function notePad(p,x,y,w,h){var n=el('div','pad','','left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px');p.appendChild(n);return n;}
function sticky(par,txt,x,y,rot,col){var s=el('div','note',txt,'left:'+x+'px;top:'+y+'px;background:'+(col||BUT)+';--r:'+rot+'deg');par.appendChild(s);return s;}
function camera(cx,cy,k,blinkOn){return '<g transform="translate('+cx+' '+cy+') scale('+k+')"><rect x="-26" y="-60" width="52" height="120" rx="26" fill="#d9dde3" stroke="#aab1bb" stroke-width="3"/><rect x="-26" y="-60" width="52" height="30" rx="15" fill="#c3c9d1"/><circle cx="0" cy="-12" r="15" fill="'+INK+'"/><circle cx="0" cy="-12" r="8" fill="'+(blinkOn?TERRA:'#3a3350')+'"/><circle cx="-3" cy="-15" r="3" fill="#fff"/></g>';}
function sofa(x,y){return '<g transform="translate('+x+' '+y+')"><rect x="0" y="-70" width="250" height="70" rx="26" fill="'+TERRA+'"/><rect x="-20" y="-50" width="46" height="60" rx="18" fill="#c9523a"/><rect x="224" y="-50" width="46" height="60" rx="18" fill="#c9523a"/><rect x="20" y="-34" width="210" height="38" rx="16" fill="#ee7e63"/></g>';}
// ---------- S1 (animated) ----------
var p1=page('p1');head(p1,'// A CAMERA WITH NO FILM',['NO VIDEO.','AT ALL.']);
var r1=room(p1,150,470,768,470),s1=K.Stage(r1,0,0,768,470),h1=hostWin(p1,150,965),pad1=notePad(p1,445,965,473,290);
var n1=sticky(pad1,'Someone walked in',24,26,-3),n2=sticky(pad1,'Camera: recording OFF',150,120,2,'#bfe8d7'),n3=sticky(pad1,'No video saved',250,182,-2,'#ffd9cf');
var stampEl=el('div','stampp','NO VIDEO','left:420px;top:600px;transform:rotate(-8deg)');p1.appendChild(stampEl);
function S1(t){
  var bg='<rect width="768" height="470" fill="'+WALL+'"/><rect y="400" width="768" height="70" fill="#e9cfa6"/><rect x="590" y="70" width="110" height="150" rx="10" fill="#bfe3ef"/><rect x="598" y="78" width="94" height="134" rx="6" fill="#dff3f8"/><path d="M0 400 H768" stroke="#d6b88a" stroke-width="4"/>'+'<rect x="40" y="330" width="150" height="10" rx="5" fill="#c9a26b"/>';
  bg+=camera(110,255,.95,Math.floor(t*2)%2===0)+'<ellipse cx="115" cy="402" rx="40" ry="8" fill="rgba(42,36,56,.16)"/>'+sofa(440,402);
  var P=R.sample('walk',t*1.05,{loop:true,inplace:true});var wx=lerp(-60,250,eo5(clamp(t/2.4,0,1)));
  var fig='<g>'+PUP.svg(P,PUP.chars.maya,{blink:K.blink(t),sec:PUP.secondary(P,R.sample('walk',t*1.05-.05,{loop:true,inplace:true}))})+'</g>';
  // film reel with a red ban over it
  var u=clamp((t-W(0,5))/.4,0,1),reel='<g transform="translate(650 300)" opacity="'+clamp((t-W(0,5)+.15)/.15,0,1)+'"><circle r="46" fill="#fff" stroke="'+INK+'" stroke-width="6"/><circle r="9" fill="'+INK+'"/>'+[0,60,120,180,240,300].map(function(a){return '<circle cx="'+(24*Math.cos(a*Math.PI/180)).toFixed(1)+'" cy="'+(24*Math.sin(a*Math.PI/180)).toFixed(1)+'" r="8" fill="'+INK+'"/>';}).join('')+'</g><g transform="translate(650 300) scale('+eb(u).toFixed(3)+')" opacity="'+(u>0?1:0)+'"><circle r="62" fill="none" stroke="'+TERRA+'" stroke-width="12"/><path d="M-44 -44 L44 44" stroke="'+TERRA+'" stroke-width="12" stroke-linecap="round"/></g>';
  s1.draw(fig,wx+90,402,.8,bg+reel);
  var nt=[2.0,W(0,4),W(0,7)];[n1,n2,n3].forEach(function(n,i){var uu=t-nt[i];n.style.opacity=uu<0?0:clamp(uu/.05,0,1);n.style.transform='translateY('+((uu<0?-60:lerp(-60,0,eb(uu/.3)))).toFixed(1)+'px) rotate('+getComputedStyle(n).getPropertyValue('--r')+')';});
  var su=t-W(0,7);if(su<0)stampEl.style.opacity=0;else{stampEl.style.opacity=1;stampEl.style.transform='rotate(-8deg) scale('+lerp(1.5,1,eo5(su/.18))+')';}
  drawHost(h1,t,1.2+t*.5);
}
// ---------- S3 (static) ----------
var p3=page('p3');head(p3,'// NOTES, NOT FOOTAGE',['IT WATCHES.','THEN IT WRITES.']);
var r3=room(p3,150,470,768,470),s3=K.Stage(r3,0,0,768,470),h3=hostWin(p3,150,965),pad3=notePad(p3,445,965,473,290);
var m1=sticky(pad3,'Someone entered the living room',20,18,-2),m2=sticky(pad3,'Dog jumped on the couch',160,112,3,'#bfe8d7'),m3=sticky(pad3,'Front door closed',40,196,-1,'#ffd9cf');
function S3(t){
  var bg='<rect width="768" height="470" fill="#1d1a26"/><rect x="26" y="26" width="716" height="418" rx="14" fill="#2b2738"/>'+'<path d="M26 74 V26 H74 M694 26 H742 V74 M742 396 V444 H694 M74 444 H26 V396" stroke="#fff" stroke-width="6" fill="none" opacity=".8"/><text x="60" y="64" font-family="SM" font-weight="700" font-size="22" fill="#ff7b6b">● LIVE · 4 FPS</text>'+'<rect y="360" x="26" width="716" height="84" fill="#3a3550"/>'+sofa(470,395);
  var st=Math.floor(t*4)/4,P=R.sample('walk',st*1.05,{loop:true,inplace:true}),x=lerp(120,360,((st*.3)%1));
  s3.draw('<g>'+PUP.svg(P,PUP.chars.sam,{blink:K.blink(t)})+'</g>',x,410,.78,bg);
  [m1,m2,m3].forEach(function(n,i){var uu=t-[.2,1.3,2.4][i];n.style.opacity=uu<0?0:1;n.style.transform='translateY('+(uu<0?-60:lerp(-60,0,eb(uu/.3)))+'px) rotate('+getComputedStyle(n).getPropertyValue('--r')+')';});
  drawHost(h3,t,4+t*.5);
}
// ---------- S6 (static) ----------
var p6=page('p6');head(p6,'// WHAT DO YOU HAND THE POLICE?',['THE','CATCH.']);
var r6=room(p6,150,470,768,470),s6=K.Stage(r6,0,0,768,470),h6=hostWin(p6,150,965),pad6=notePad(p6,445,965,473,290);
var q1=sticky(pad6,'A person entered the kitchen',20,20,-2),q2=el('div','stampp','NO CLIP','left:200px;top:150px;font-size:44px;transform:rotate(-7deg)');pad6.appendChild(q2);
function S6(t){
  var bg='<rect width="768" height="470" fill="#f7e8cc"/><rect y="400" width="768" height="70" fill="#e1c595"/><rect x="40" y="90" width="300" height="130" rx="12" fill="#dfe9d9"/><rect x="60" y="250" width="260" height="150" rx="10" fill="#c9d6c5"/>'+camera(400,130,.95,Math.floor(t*2)%2===0);
  var Pb=R.sample('stealth',t*.9,{loop:true,inplace:true}),Pc=R.sample('shrug',clamp(t*.8,0,1.9),{inplace:true});
  var burglar='<g transform="translate(500 0)">'+PUP.svg(Pb,PUP.chars.burglar,{blink:K.blink(t),sec:PUP.secondary(Pb,R.sample('stealth',t*.9-.05,{loop:true,inplace:true}))})+'</g>';
  var cop='<g transform="translate(-30 0)">'+PUP.svg(Pc,PUP.chars.officer,{blink:K.blink(t),face:-1})+'</g>';
  s6.draw(cop+burglar,190,405,.8,bg);
  var g=document.createElementNS('http://www.w3.org/2000/svg','g');
  drawHost(h6,t,7+t*.4,'gest');
}
var T={p1:S1,p3:S3,p6:S6};
window.__mock=function(id,t){Object.keys(T).forEach(function(k){document.getElementById(k).style.display=k===id?'block':'none';});T[id](t);if(id!=='p1')drawCaps(t);};
// full animated hook for rendering: scene 1 over [0, S[0].end]
window.__reelDurationSec=10;window.__seek=function(t){window.__mock('p1',t);drawCaps(t);};
var capEl=document.getElementById('capin'),capBox=document.getElementById('cap'),capKey='';
function drawCaps(t){var cur=null;S.forEach(function(sc){sc.caps.forEach(function(b){if(t>=b.start-.04&&t<=b.end+.3)cur=b;});});if(!cur){capBox.style.opacity=0;return;}
  var k=cur.start+'';if(k!==capKey){capKey=k;capEl.innerHTML=cur.words.map(function(w){return '<span class="w">'+w.w+'</span>';}).join(' ');}
  var kids=capEl.children;for(var q=0;q<kids.length;q++){var w=cur.words[q];kids[q].className='w'+((t>=w.s&&t<w.e+.06)?' on':'');}capBox.style.opacity=1;}
window.__ready=true;
})();
