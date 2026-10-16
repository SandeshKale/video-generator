// Ramayana trailer review. Every visual is a pure function of t (window.__seek). Host video is seeked per frame.
(function(){
var TM=window.TM, S=TM.S, END=TM.END, TR=.4;
var $=function(id){return document.getElementById(id)};
function cl(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))}
var E={o3:function(x){return 1-Math.pow(1-x,3)},o5:function(x){return 1-Math.pow(1-x,5)},io:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
 bk:function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}};
function seg(t,a,b){return cl((t-a)/(b-a))}
function ent(el,t,t0,d,o){o=o||{};var u=E.o5(seg(t,t0,t0+d));el.style.opacity=u;
 el.style.transform='translate('+((o.x||0)*(1-u))+'px,'+((o.y==null?36:o.y)*(1-u))+'px) scale('+(1-(1-(o.s||1))*(1-u))+') rotate('+((o.r||0)*(1-u))+'deg)'}
function pop(el,t,t0,d,r){var u=seg(t,t0,t0+d);var s=E.bk(u);el.style.opacity=u>0?1:0;el.style.transform='rotate('+(r||0)+'deg) scale('+(u>0?s:.3)+')'}
var sceneEls=[], sceneDefs=[];
function mk(html){var d=document.createElement('div');d.className='sc';d.innerHTML=html;$('scenes').appendChild(d);return d}
function q(sc,s){return sc.querySelector(s)}
function frame(img,id){return '<div class="fr" id="'+id+'"><img src="frames/'+img+'.png"><div class="vig"></div><div class="sweep"></div><svg viewBox="0 0 1080 608"></svg></div>'}
function kb(fr,lt,dur,z0,z1,x0,x1,y0,y1){var u=E.io(seg(lt,0,dur)),im=fr.querySelector('img');im.style.transform='translate('+(x0+(x1-x0)*u)+'px,'+(y0+(y1-y0)*u)+'px) scale('+(z0+(z1-z0)*u)+')';
 var sw=fr.querySelector('.sweep');if(sw){var p=seg(lt,.3,2.1);sw.style.left=(-300+1700*E.io(p))+'px';sw.style.opacity=p>0&&p<1?1:0}}
function draw(el,u,len){el.setAttribute('stroke-dasharray',len);el.setAttribute('stroke-dashoffset',len*(1-u))}
var ELL=function(cx,cy,rx,ry){return '<ellipse class="a" cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="#ff4d2e" stroke-width="7"/>'};
var RCT=function(x,y,w,h){return '<rect class="a" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="none" stroke="#ff4d2e" stroke-width="7"/>'};
function T(a,b){return {a:a,b:b}}
// ---------- scenes ----------
// 0 hook
sceneDefs.push(function(){var d=mk('<div class="eye">// NEW TRAILER · OCT 15</div><div class="h">New trailer.<br><b>Better than July?</b></div>'+frame('g_42','f0')+'<div class="stat">OCT 15<small>SONY · IN THEATRES NOV 5</small></div>');
 return function(t,lt){ent(q(d,'.eye'),lt,-.4,.5,{y:14});ent(q(d,'.h'),lt,-.3,.7,{y:50});ent(q(d,'.stat'),lt,.2,.7,{y:30});kb(q(d,'.fr'),lt,5.4,1.02,1.12,-6,-24,0,-8)}});
// 1 July vs Oct
sceneDefs.push(function(){var d=mk('<div class="eye">// JULY vs OCTOBER</div><div class="h">Two trailers.<br><b>One gap.</b></div>'+
 '<div class="col" id="cj" style="left:60px;border-color:#ff4d2e"><h3 style="color:#ff4d2e">JULY 30</h3><p>Reactions split</p><p>VFX debated</p><p>Producer: VFX not finished</p></div>'+
 '<div class="col" id="co" style="left:550px"><h3 style="color:#ffb703">OCT 15</h3><p>Snow and sky shots strong</p><p>Big monsters kept dark</p><p>Release: Nov 5 (Sony)</p></div>'+
 '<div class="stamp" id="s10" style="left:300px;top:880px;background:#12100d;transform-origin:50% 50%">10×?</div>'+
 '<div class="lab" id="hm" style="left:120px;top:1090px;font-size:28px">HARD TO MEASURE · CLEARLY BETTER (MY READ)</div>'+
 '<div class="src" style="top:1130px">JULY: press coverage (Onmanorama, Outlook India). OCT: my read of the new trailer.</div>');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);ent(q(d,'#cj'),lt,.3,.8,{x:-90,y:0});ent(q(d,'#co'),lt,.7,.8,{x:90,y:0});
  pop(q(d,'#s10'),t,S[1]+1.82,.5,-6);ent(q(d,'#hm'),t,S[1]+4.3,.5,{y:20});q(d,'.src').style.opacity=E.o3(seg(lt,1.4,2))}});
// 2 July complaint
sceneDefs.push(function(){var d=mk('<div class="eye">// WHAT JULY GOT CRITICISED FOR</div><div class="h">The <b>July</b><br>complaint</div>'+
 '<div class="stamp" id="r1" style="left:120px;top:520px;font-size:112px">FLAT ARMIES</div><div class="stamp" id="r2" style="left:120px;top:720px;font-size:112px">FLAT GIANT</div>'+
 '<div class="stamp" id="r3" style="left:120px;top:920px;font-size:70px;color:#ffb703;border-color:#ffb703">“VFX NOT FINISHED” · PRODUCER</div>'+
 '<div class="src" style="top:1100px">PRESS, 30–31 JUL 2026: ONMANORAMA, KHALEEJ TIMES, OUTLOOK INDIA (TIER B).</div>');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);pop(q(d,'#r1'),lt,.9,.45,-3);pop(q(d,'#r2'),lt,1.9,.45,2);pop(q(d,'#r3'),lt,3,.45,-1);q(d,'.src').style.opacity=E.o3(seg(lt,3.4,4))}});
// 3 snow + sky
sceneDefs.push(function(){var d=mk('<div class="eye">// THIS TIME: SNOW + SKY</div><div class="h">The big shots<br><b>land now</b></div>'+frame('g_17','f3a')+'<div class="fr" id="f3b" style="opacity:0"><img src="frames/g_112.png"><div class="vig"></div></div><div class="lab" id="l3" style="left:60px;top:480px">SNOW PEAKS</div><div class="stat">POLISHED<small>MY READ</small></div>');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);var a=q(d,'#f3a'),b=q(d,'#f3b'),x=E.io(seg(lt,1.5,2.0));b.style.opacity=x;a.style.opacity=1-x*.0;
  kb(a,lt,3.5,1.02,1.1,0,-30,0,0);var ib=b.querySelector('img');ib.style.transform='scale('+(1.14-.1*seg(lt,1.5,3.5))+') translate('+(20-30*seg(lt,1.5,3.5))+'px,0)';
  q(d,'#l3').textContent=lt<1.75?'SNOW PEAKS':'SKY AND WINGS';ent(q(d,'#l3'),lt,.5,.4,{x:-30,y:0});ent(q(d,'.stat'),lt,.6,.6,{y:26})}});
// 4 monsters in the dark
sceneDefs.push(function(){var d=mk('<div class="eye">// THE BIG MONSTERS</div><div class="h">Kept <b>in the dark</b></div>'+frame('g_70','f4')+'<div class="stat">26<small>/ 255 BRIGHTNESS IN THIS SHOT</small></div>'+
 '<div class="chips" style="top:1180px"></div><div class="src" style="top:1175px;left:120px;width:440px">TRAILER AVERAGE: 64.5 / 255. MEASURED FROM THE UPLOADED FILE.</div>');
 var fr=q(d,'.fr'),svg=fr.querySelector('svg');svg.innerHTML=ELL(920,330,200,160)+'<rect id="bar0" x="60" y="560" width="400" height="14" fill="#2a251c"/><rect id="bar1" x="60" y="560" width="0" height="14" fill="#ff4d2e"/><rect id="bar2" x="60" y="578" width="0" height="14" fill="#ffb703"/>';
 var el=svg.querySelector('.a');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);kb(fr,lt,5.4,1.0,1.1,-10,10,0,-10);draw(el,E.io(seg(lt,.9,2)),1200);
  svg.querySelector('#bar1').setAttribute('width',400*26/255*E.o3(seg(lt,1.2,2.2)));svg.querySelector('#bar2').setAttribute('width',400*64.5/255*E.o3(seg(lt,1.8,2.8)));ent(q(d,'.stat'),lt,.4,.6,{y:26});q(d,'.src').style.opacity=E.o3(seg(lt,2.2,2.8))}});
// 5 Ravana 0:39
sceneDefs.push(function(){var d=mk('<div class="eye">// WHO IS NAMED FIRST</div><div class="h">Ravana, <b>0:39</b></div>'+frame('g_42','f5')+'<div class="stat">OPEN LIGHT<small>SNOW · DAYLIGHT</small></div><div class="lab" id="l5" style="left:560px;top:480px">0:39 · “RAVANA…”</div>');
 var fr=q(d,'.fr'),svg=fr.querySelector('svg');svg.innerHTML=ELL(515,250,100,85);var el=svg.querySelector('.a');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);kb(fr,lt,4.6,1.0,1.14,10,-10,0,0);draw(el,E.io(seg(lt,.7,1.5)),700);ent(q(d,'.stat'),lt,.5,.6,{y:26});ent(q(d,'#l5'),lt,1.1,.4,{x:30,y:0})}});
// 6 Ram 1:13
sceneDefs.push(function(){var d=mk('<div class="eye">// WHEN RAM ARRIVES</div><div class="h">Ram, <b>1:13</b></div>'+frame('g_68','f6')+'<div class="stat">DARK FOREST<small>DARK · QUIET</small></div><div class="lab" id="l6" style="left:60px;top:480px">1:13 · “RAM.”</div>');
 var fr=q(d,'.fr'),svg=fr.querySelector('svg');svg.innerHTML=RCT(440,230,200,330);var el=svg.querySelector('.a');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);kb(fr,lt,4.3,1.0,1.16,0,0,0,-16);draw(el,E.io(seg(lt,.7,1.5)),1100);ent(q(d,'.stat'),lt,.5,.6,{y:26});ent(q(d,'#l6'),lt,1.1,.4,{x:-30,y:0})}});
// 7 timeline
sceneDefs.push(function(){var W=840;var xr=W*39.3/156.6,xm=W*73.5/156.6;
 var d=mk('<div class="eye">// ENTRY ORDER</div><div class="h"><b>34 seconds</b><br>apart</div>'+
 '<div style="position:absolute;left:120px;top:470px;width:330px;height:190px;border:6px solid #ff4d2e;overflow:hidden" id="p1"><img src="frames/g_42.png" style="width:100%;height:100%;object-fit:cover"></div>'+
 '<div style="position:absolute;left:630px;top:470px;width:330px;height:190px;border:6px solid #ffb703;overflow:hidden" id="p2"><img src="frames/g_68.png" style="width:100%;height:100%;object-fit:cover"></div>'+
 '<svg id="tl" style="position:absolute;left:120px;top:690px;width:840px;height:330px" viewBox="0 0 840 330"><rect x="0" y="120" width="840" height="24" fill="#2a251c"/><rect id="b1" x="0" y="120" width="0" height="24" fill="#ff4d2e"/><rect id="b2" x="'+xr+'" y="120" width="0" height="24" fill="#ffb703"/>'+
 '<circle id="c1" cx="'+xr+'" cy="132" r="0" fill="#ff4d2e" stroke="#12100d" stroke-width="6"/><circle id="c2" cx="'+xm+'" cy="132" r="0" fill="#ffb703" stroke="#12100d" stroke-width="6"/>'+
 '<text id="t1" x="'+(xr+30)+'" y="90" fill="#ff4d2e" font-family="Anton" font-size="56" text-anchor="end">RAVANA 0:39</text><text id="t2" x="'+(xm-30)+'" y="190" fill="#ffb703" font-family="Anton" font-size="56" text-anchor="start">RAM 1:13</text><text x="0" y="175" fill="#9a917c" font-family="JB" font-weight="700" font-size="24">0:00</text><text x="840" y="175" fill="#9a917c" font-family="JB" font-weight="700" font-size="24" text-anchor="end">2:36</text>'+
 '<text id="t3" x="'+(xr+xm)/2+'" y="262" fill="#f3ecdc" font-family="JB" font-weight="700" font-size="44" text-anchor="middle">34 s</text></svg>'+
 '<div class="chips" style="top:1040px"><div class="chip r" id="k1">LOUD · BRIGHT</div><div class="chip" id="k2">QUIET · DARK</div></div>'+
 '<div class="stamp" id="q8" style="left:610px;top:975px;font-size:100px;padding:0 20px;background:#12100d">WHY?</div>');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);ent(q(d,'#p1'),lt,.2,.6,{x:-60,y:0});ent(q(d,'#p2'),lt,.5,.6,{x:60,y:0});
  var s=q(d,'#tl'),g=function(i){return s.querySelector(i)};g('#b1').setAttribute('width',xr*E.io(seg(lt,.5,1.3)));g('#c1').setAttribute('r',26*E.bk(seg(lt,1.1,1.5)));g('#t1').setAttribute('opacity',seg(lt,1.1,1.5));
  g('#b2').setAttribute('width',(xm-xr)*E.io(seg(lt,1.5,2.7)));g('#c2').setAttribute('r',26*E.bk(seg(lt,2.6,3)));g('#t2').setAttribute('opacity',seg(lt,2.6,3));g('#t3').setAttribute('opacity',seg(lt,2.8,3.2));
  ent(q(d,'#k1'),lt,1.2,.4,{y:16});ent(q(d,'#k2'),lt,2.7,.4,{y:16});pop(q(d,'#q8'),t,S[7]+2.18,.5,6)}});
// 8 my guess
sceneDefs.push(function(){var d=mk('<div class="eye">// MY GUESS (OPINION)</div><div class="h">Noise first.<br><b>Strength later?</b></div>'+
 '<div style="position:absolute;left:120px;top:520px;width:840px"><div style="font:700 30px JB;color:#ff4d2e;margin-bottom:10px">RAVANA · LOUD, FIRST</div><div style="height:90px;background:#2a251c"><div id="g1" style="height:90px;width:0;background:#ff4d2e"></div></div>'+
 '<div style="font:700 30px JB;color:#ffb703;margin:90px 0 10px">RAM · QUIET, THEN RISING</div><div style="height:90px;background:#2a251c"><div id="g2" style="height:90px;width:0;background:#ffb703"></div></div>'+
 '<div style="font:700 26px JB;color:#9a917c;margin-top:60px">ILLUSTRATIVE · THE FILM MAY DO OTHERWISE</div></div>');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);q(d,'#g1').style.width=(100*E.o3(seg(lt,.4,1.6)))+'%';q(d,'#g2').style.width=(12*E.o3(seg(lt,.8,1.6))+88*E.io(seg(lt,2.2,5.2)))+'%'}});
// 9 glimpse / date
sceneDefs.push(function(){var d=mk('<div class="eye">// WHAT THIS IS</div><div class="h">Just <b>a glimpse</b></div>'+frame('end','f9')+'<div class="stat">NOV 5<small>IMAX · TICKETS ON SALE NOW</small></div>');
 var fr=q(d,'.fr'),svg=fr.querySelector('svg');svg.innerHTML=RCT(340,445,320,100);var el=svg.querySelector('.a');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);kb(fr,lt,4.2,1.0,1.1,0,0,0,-18);draw(el,E.io(seg(lt,2.4,3.3)),900);ent(q(d,'.stat'),lt,.4,.6,{y:26})}});
// 10 CTA
sceneDefs.push(function(){var d=mk('<div class="eye">// YOUR TURN</div><div class="h">What’s your <b>guess?</b></div>'+
 '<div id="pp" style="position:absolute;left:120px;top:500px;width:280px;height:280px;border-radius:50%;border:10px solid #ffb703;overflow:hidden;box-shadow:0 0 50px rgba(255,183,3,.45)"><img src="profile.jpg" style="width:100%;height:100%;object-fit:cover"></div>'+
 '<div id="hd" style="position:absolute;left:440px;top:540px;font:400 74px/1 Anton;color:#f3ecdc">@sandesh_explains</div><div id="sb" style="position:absolute;left:440px;top:650px;font:700 28px JB;color:#ffb703">FILM BREAKDOWNS · NO HYPE</div>'+
 '<div class="chips" style="top:830px"><div class="chip" id="k3">COMMENT YOUR GUESS</div></div><div id="fl" style="position:absolute;left:120px;top:930px;font:400 90px/1 Anton;background:#ff4d2e;color:#12100d;padding:14px 40px">FOLLOW</div>');
 return function(t,lt){ent(q(d,'.eye'),lt,0,.4,{y:14});ent(q(d,'.h'),lt,.05,.6);pop(q(d,'#pp'),lt,.3,.6,0);ent(q(d,'#hd'),lt,.7,.6,{x:40,y:0});ent(q(d,'#sb'),lt,1,.5,{y:14});ent(q(d,'#k3'),lt,1.3,.5,{y:18});
  var u=seg(lt,1.8,2.3),p=1+.06*Math.sin(lt*6)*seg(lt,2.4,9);q(d,'#fl').style.opacity=u;q(d,'#fl').style.transform='scale('+(E.bk(u)*p)+')';q(d,'#fl').style.transformOrigin='0 50%'}});
// ---------- build ----------
var upd=[];for(var i=0;i<sceneDefs.length;i++){var f=sceneDefs[i]();upd.push(f)}
sceneEls=[].slice.call(document.querySelectorAll('#scenes > .sc'));
var emb=$('embers');for(var i=0;i<22;i++){var e=document.createElement('div');e.className='ember';e.id='e'+i;emb.appendChild(e)}
var vid=document.createElement('video');vid.muted=true;vid.preload='auto';vid.src='host.webm';var avc=$('avc'),cx=avc.getContext('2d');var lastF=-1;
function hostSeek(t){var f=Math.floor(t*24);if(f===lastF)return Promise.resolve();lastF=f;var ft=(f+.5)/24;if(vid.duration)ft=Math.min(ft,vid.duration-.02);
 return new Promise(function(res){var d=function(){vid.removeEventListener('seeked',d);cx.drawImage(vid,0,0,544,544);res()};vid.addEventListener('seeked',d);vid.currentTime=ft})}
window.__reelDurationSec=END;
window.__seek=function(t){
 t=Math.max(0,Math.min(END-1e-3,t));
 // background drift + embers (pure t)
 $('bg').style.backgroundPosition=(Math.sin(t*.2)*30)+'px '+(Math.cos(t*.15)*20)+'px';
 for(var i=0;i<22;i++){var ph=(t*(.025+(i%5)*.006)+i/22)%1;var el=$('e'+i);el.style.left=((i*163+Math.sin(t*.5+i)*40)%1000+40)+'px';el.style.top=(1500-ph*1300)+'px';el.style.opacity=(.5*Math.sin(ph*Math.PI)).toFixed(3);el.style.transform='scale('+(.6+(i%3)*.4)+')'}
 for(var i=0;i<sceneEls.length;i++){var s0=S[i],s1=i+1<S.length?S[i+1]:END,el=sceneEls[i],raw=t-s0,op=0,tf='';
  if(raw>=-TR&&t<=s1+.001){
   if(raw<0){var p=E.o3(seg(t,s0-TR*.6,s0));op=p;tf='scale('+(1.05-.05*p)+')'}
   else if(i<sceneEls.length-1&&t>s1-TR){var p=E.o3(seg(t,s1-TR,s1-TR*.5));op=1-p;tf='scale('+(1+.04*p)+')'}else op=1;
   upd[i](t,raw)}
  el.style.opacity=op;el.style.transform=tf;el.style.display=op>0?'block':'none'}
 var c='';for(var k=0;k<TM.C.length;k++)if(t>=TM.C[k][0]&&t<TM.C[k][1]){c=TM.C[k][2];var u=E.o3(seg(t,TM.C[k][0],TM.C[k][0]+.18));$('cap').style.opacity=u;$('cap').style.transform='translateY('+(8*(1-u))+'px)'}
 $('cap').textContent=c;$('cap').style.display=c?'block':'none';$('caprule').style.display=c?'block':'none';
 var au=E.o3(seg(t,0,.5));$('av').style.opacity=au;
 return hostSeek(t)};
function ready(){window.__ready=true}
var fp=['600 20px Inter','700 20px Inter','400 90px Anton','700 26px JB'].map(function(f){return document.fonts.load(f)});
Promise.all(fp.concat([new Promise(function(r){vid.addEventListener('loadeddata',r);setTimeout(r,8000)})])).catch(function(){}).then(function(){window.__seek(0);ready()});
window.__ready=false;
})();
