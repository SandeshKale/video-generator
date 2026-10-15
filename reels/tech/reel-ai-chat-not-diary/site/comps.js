// "Glass Diary by Lamplight" components — pure functions of absolute time t. Content stays in x 150..918, y 176..1270.
(function(){
'use strict';
var U=window.U,clamp=U.clamp,lerp=U.lerp;
function eo(x){x=clamp(x,0,1);return 1-Math.pow(1-x,3);}
function eo5(x){x=clamp(x,0,1);return 1-Math.pow(1-x,5);}
function eb(x){x=clamp(x,0,1);var c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st,inner){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;if(inner!=null)e.innerHTML=inner;return e;}
function frac(x){return x-Math.floor(x);}
var AM='#ffbf5e',TXT='#fff0d6',MUTE='#c9b48a',ICE='#bfeaf5',SEAL='#c8353f',NO='#ff8a92';
var ICONS=window.DATA.icons||{},LOGOS=window.DATA.logos||{};
function ic(n,px,col,sw){return '<svg viewBox="0 0 24 24" width="'+px+'" height="'+px+'" fill="none" stroke="'+(col||'currentColor')+'" stroke-width="'+(sw||1.7)+'" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>';}
function pop(u,from){var q=eb(u/.28);return {a:clamp(u/.05,0,1),s:lerp(from||.5,1,clamp(q,0,1))};}
function slam(u){if(u<0)return {a:0,tr:'scale(1)'};var p=eo5(u/.18);return {a:clamp(u/.04,0,1),tr:'scale('+lerp(1.6,1,p)+') rotate('+lerp(-8,0,p)+'deg)'};}
function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'rise',a=1,tr='',ex=clamp((L.t1-t)/.15,0,1);
  if(k==='none'){a=1;}
  else if(k==='slam'){var s=slam(u);a=s.a;tr=s.tr;}
  else if(k==='pop'){var q=eb(u/.28);a=clamp(u/.05,0,1);tr='scale('+lerp(.5,1,q)+')';}
  else if(k==='rise'){var r=eo5(u/.32);a=clamp(u/.1,0,1);tr='translateY('+lerp(60,0,r)+'px)';}
  else if(k==='left'){var l=eo5(u/.34);a=clamp(u/.1,0,1);tr='translateX('+lerp(-240,0,l)+'px)';}
  else if(k==='right'){var rr=eo5(u/.34);a=clamp(u/.1,0,1);tr='translateX('+lerp(240,0,rr)+'px)';}
  else{a=clamp(u/.12,0,1);}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};
T.eyebrow=function(L,P){var d=el('div','',P.txt,'font:700 24px JB,monospace;letter-spacing:.16em;color:'+AM+';text-transform:uppercase;white-space:nowrap');L.inner.appendChild(d);d.textContent='';
  return function(t){var n=Math.floor(clamp((t-L.t0)/.45,0,1)*P.txt.length);d.textContent=P.txt.slice(0,n)+(Math.floor(t*3)%2&&n<P.txt.length+1?'▌':'');};};
T.label=function(L,P){L.inner.appendChild(el('div','lab',P.txt,'font-size:'+(P.size||20)+'px;'+(P.c?'color:'+P.c:'')));return function(){};};
T.head=function(L,P){
  var size=P.size||96;var box=el('div','hd','','font-size:'+size+'px;line-height:1.02;width:768px');L.inner.appendChild(box);
  var ws=P.words.map(function(w){if(w.br){box.appendChild(el('br'));return null;}
    var s=el('span',w.hl?'hl':'',w.txt,'display:inline-block;margin-right:.2em');box.appendChild(s);return {s:s,w:w};}).filter(Boolean);
  return function(t){ws.forEach(function(o){var t0=o.w.t!=null?o.w.t:L.t0,u=t-t0,p=eo5(u/.24);o.s.style.opacity=clamp(u/.05,0,1);
    var sc=(o.w.slam&&u>=0)?1+.3*(1-clamp(eb(u/.2),0,1)):1;o.s.style.transform='translateY('+lerp(34,0,p)+'px) scale('+sc+')';});};
};
T.chips=function(L,P){
  var w=el('div','','','display:flex;flex-wrap:wrap;gap:12px;width:768px');
  var cs=P.items.map(function(it){var c=el('span','chip '+(it.k||''),it.txt,P.size?'font-size:'+P.size+'px;':'');w.appendChild(c);return {c:c,t:it.t};});L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var u=t-(o.t!=null?o.t:L.t0),p=pop(u,.6);o.c.style.opacity=p.a;o.c.style.transform='scale('+p.s+')';});};
};
T.stamp=function(L,P){
  var s=el('div','stampbox',P.txt,'font-size:'+(P.size||54)+'px;transform:rotate('+(P.rot||-6)+'deg);'+(P.sub?'text-align:center':''));L.inner.appendChild(s);return function(){};
};
// ----- scene 1: the glass diary -----
T.diary=function(L,P){
  var W=768,H=476,b=el('div','','','position:relative;width:'+W+'px;height:'+H+'px;border-radius:26px;background:linear-gradient(160deg,#4a2c15,#2b190b);box-shadow:0 36px 70px rgba(0,0,0,.65),inset 0 2px 0 rgba(255,200,140,.25)');
  var pg=function(side){return el('div','','','position:absolute;top:22px;height:432px;width:350px;'+side+';background:repeating-linear-gradient(180deg,transparent 0 37px,rgba(36,31,77,.18) 37px 39px),linear-gradient(90deg,#ead9b3,#f6ebd0 40%,#f0e1bd);box-shadow:inset 0 0 30px rgba(120,80,30,.28);'+(side.indexOf('left')>=0?'border-radius:12px 4px 4px 12px':'border-radius:4px 12px 12px 4px'));};
  var pl=pg('left:20px'),pr=pg('right:20px');b.appendChild(pl);b.appendChild(pr);
  b.appendChild(el('div','','','position:absolute;left:50%;top:22px;width:34px;height:432px;margin-left:-17px;background:linear-gradient(90deg,transparent,rgba(60,35,12,.55) 50%,transparent)'));
  var i1=el('div','ink','','left:24px;top:12px'),i2=el('div','ink','','left:24px;top:52px;font-size:34px'),i3=el('div','ink','','left:28px;top:150px;font-size:30px;color:#6a5f9a');pl.appendChild(i1);pl.appendChild(i2);pr.appendChild(i3);
  var bars=[[pl,24,104,296],[pl,24,143,246],[pl,24,182,300],[pl,24,221,188],[pr,28,30,280],[pr,28,69,230],[pr,28,195,250]].map(function(x,i){var d=el('div','rd','','left:'+x[1]+'px;top:'+x[2]+'px;width:'+x[3]+'px;transform:scaleX(0)'+(x[0]===pr&&i<6?';background:#2a2147':''));x[0].appendChild(d);return d;});
  var gl=el('div','glass','','position:absolute;left:372px;top:40px;width:356px;height:372px;border-radius:24px;background:linear-gradient(135deg,rgba(191,234,245,.34),rgba(191,234,245,.08) 60%);transform:rotate(-2deg)');b.appendChild(gl);
  var bub=[['left:22px;top:30px;width:230px;height:50px;background:rgba(255,255,255,.22);border:1.5px solid rgba(255,255,255,.5)'],['left:84px;top:100px;width:250px;height:50px;background:rgba(255,191,94,.45);border:1.5px solid rgba(255,225,170,.7)'],['left:22px;top:170px;width:130px;height:50px;background:rgba(255,255,255,.22);border:1.5px solid rgba(255,255,255,.5)']].map(function(x){var d=el('div','','','position:absolute;border-radius:26px;'+x[0]);gl.appendChild(d);return d;});
  var dots=[0,1,2].map(function(i){var d=el('i','','','position:absolute;top:190px;width:10px;height:10px;border-radius:50%;background:#fff;left:'+(42+i*20)+'px');gl.appendChild(d);return d;});
  var mag=el('div','','','position:absolute;left:0;top:0;color:'+AM+';filter:drop-shadow(0 0 12px rgba(255,191,94,.7))',ic('search',120,AM,1.5));b.appendChild(mag);
  var seal=el('div','seal','<div style="position:relative">'+ic('eye',70,'#ffe8e0',1.6)+'</div>','position:absolute;left:16px;top:372px;width:150px;height:150px');b.appendChild(seal);
  var st=el('div','chip s','HUMAN REVIEW','position:absolute;left:178px;top:424px;font-size:24px');b.appendChild(st);
  L.inner.appendChild(b);
  return function(t){var u=t-P.ts;
    i1.textContent='Sept. 26'.slice(0,Math.floor(clamp(u/.5,0,1)*8));i2.textContent='dear diary,'.slice(0,Math.floor(clamp((u-.5)/.5,0,1)*11));i3.textContent=u>1.6?'sept. 27 —'.slice(0,Math.floor(clamp((u-1.6)/.5,0,1)*10)):'';
    bars.forEach(function(d,i){d.style.transform='scaleX('+eo((u-1.0-i*.13)/.22)+')';});
    bub.forEach(function(d,i){var p=pop(u-.3-i*.35,.7);d.style.opacity=p.a;d.style.transform='scale('+p.s+')';});
    dots.forEach(function(d,i){d.style.opacity=u>1.0?(.35+.65*Math.max(0,Math.sin(t*7-i*.8))):0;});
    var mu=t-(P.stampT-.9);mag.style.opacity=clamp(mu/.2,0,1);
    mag.style.transform='translate('+(520+90*Math.sin(t*1.5))+'px,'+(262+40*Math.sin(t*2.1+1))+'px) rotate('+(8*Math.sin(t*1.5))+'deg)';
    var us=t-P.sealT;seal.style.opacity=us<0?0:clamp(us/.04,0,1);seal.style.transform='scale('+(us<0?1:lerp(1.2,1,eo5(us/.18)))+') rotate('+(us<0?-8:lerp(-20,-8,eo5(us/.18)))+'deg)';
    var s2=slam(t-P.stampT);st.style.opacity=s2.a;st.style.transform=s2.tr+' rotate(-3deg)';};
};
T.msg=function(L,P){
  var c=el('div','glass','','width:768px;height:92px;border-radius:24px');
  c.appendChild(el('div','lab',P.k,'position:absolute;left:26px;top:30px'));
  var bars=[0,1,2].map(function(i){var d=el('div','rd','','left:'+(300+i*0)+'px;top:'+(18+i*0)+'px;width:0px;height:26px;background:rgba(10,8,6,.92)');return d;});
  var rr=[[340,16,150],[500,16,100],[340,50,230]].map(function(x){var d=el('div','rd','','left:'+x[0]+'px;top:'+x[1]+'px;width:'+x[2]+'px;background:rgba(10,8,6,.92);transform:scaleX(0)');c.appendChild(d);return d;});
  c.appendChild(el('div','lab',P.tag,'position:absolute;right:26px;top:30px;display:none'));
  L.inner.appendChild(c);return function(t){var u=t-L.t0;rr.forEach(function(d,i){d.style.transform='scaleX('+eo((u-.3-i*.15)/.25)+')';});};
};
// ----- scene 2: two entries on a thread -----
T.entries=function(L,P){
  var W=768,card=function(date,day,k,txt,ico,y){var c=el('div','glass','','position:absolute;left:0;top:'+y+'px;width:'+W+'px;height:190px');
    c.appendChild(el('div','','<div class="lab" style="color:#2a1706;font-size:22px;text-align:center;margin-top:20px">'+date+'</div><div class="hd" style="font-size:78px;color:#2a1706;text-shadow:none;text-align:center;line-height:1;margin-top:6px;letter-spacing:-.04em">'+day+'</div>','position:absolute;left:24px;top:24px;width:140px;height:142px;border-radius:20px;background:linear-gradient(160deg,#ffd68a,#ff9d2e);box-shadow:0 10px 24px rgba(0,0,0,.45)'));
    c.appendChild(el('div','lab',ic(ico,30,AM,1.8)+'<span style="margin-left:10px;vertical-align:8px">'+k+'</span>','position:absolute;left:196px;top:30px;color:'+AM));
    c.appendChild(el('div','','','position:absolute;left:196px;top:76px;font:900 italic 42px/1.12 FR,serif;color:#ffe6a8;width:540px;white-space:normal')).innerHTML=txt;return c;};
  var box=el('div','','','position:relative;width:'+W+'px;height:520px');
  var a=card('SEP','26','ALLEGED ENTRY','“shoot up” a sheriff’s office','message-circle',0),b=card('SEP','27','NEXT DAY · ALLEGED','mentioned a new gun','alert-triangle',280);
  var line=el('div','','','position:absolute;left:94px;top:190px;width:6px;height:90px;background:linear-gradient(180deg,'+AM+',rgba(255,191,94,.2));border-radius:3px;transform-origin:0 0;transform:scaleY(0)');
  box.appendChild(line);box.appendChild(a);box.appendChild(b);
  var wh=el('div','lab','THREAT TEXT ABOVE IS AS REPORTED · NOT VERIFIED','position:absolute;left:0;top:500px;font-size:19px');box.appendChild(wh);
  L.inner.appendChild(box);
  return function(t){var p1=pop(t-P.e1,.9),p2=pop(t-P.e2,.9);a.style.opacity=p1.a;a.style.transform='translateY('+(t<P.e1?0:lerp(40,0,eo5((t-P.e1)/.3)))+'px)';b.style.opacity=p2.a;b.style.transform='translateY('+(t<P.e2?0:lerp(40,0,eo5((t-P.e2)/.3)))+'px)';
    line.style.transform='scaleY('+eo((t-P.e1-.5)/(P.e2-P.e1-.3))+')';wh.style.opacity=clamp((t-P.e2)/.3,0,1);};
};
// ----- scene 3: flag -> human -> police -----
T.funnel=function(L,P){
  var W=768,SH=124,GAP=60,box=el('div','','','position:relative;width:'+W+'px;height:'+(4*SH+3*GAP)+'px');
  var def=[['message-circle','The chat','sent like a private diary entry',ICE],['flag','Automated flag','key phrases · threatening content',AM],['eye','Human reviewer','serious flags only · decides what next','#ffd48a'],['shield-check','Report to police','if a credible threat is judged',NO]];
  var st=def.map(function(d,i){var y=i*(SH+GAP),c=el('div','glass','','position:absolute;left:0;top:'+y+'px;width:'+W+'px;height:'+SH+'px');
    c.appendChild(el('div','','','position:absolute;left:28px;top:28px;color:'+d[3],ic(d[0],68,d[3],1.6)));
    c.appendChild(el('div','hd',d[1],'position:absolute;left:128px;top:22px;font-size:36px;letter-spacing:-.02em;text-shadow:none'));
    c.appendChild(el('div','','','position:absolute;left:128px;top:72px;font:700 24px IN,sans-serif;color:'+MUTE)).textContent=d[2];
    box.appendChild(c);return c;});
  var tubes=[0,1,2].map(function(i){var y=(i+1)*SH+i*GAP,tb=el('div','','','position:absolute;left:370px;top:'+y+'px;width:28px;height:'+GAP+'px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.04));border:1.5px solid rgba(220,245,255,.4);overflow:hidden');
    var ds=[0,1,2].map(function(k){var d=el('i','','','position:absolute;left:6px;width:12px;height:12px;border-radius:50%;background:'+AM+';box-shadow:0 0 10px 2px rgba(255,191,94,.7)');tb.appendChild(d);return d;});box.appendChild(tb);return {tb:tb,ds:ds};});
  var seal=el('div','seal','<div style="position:relative">'+ic('search',60,'#ffe8e0',1.7)+'</div>','position:absolute;left:600px;top:'+(2*(SH+GAP)-18)+'px;width:132px;height:132px');box.appendChild(seal);
  L.inner.appendChild(box);
  return function(t){
    st.forEach(function(c,i){var u=t-P.ts[i],p=pop(u,.88),nxt=i<3?P.ts[i+1]:1e9;var act=clamp(u/.25,0,1)*(i==2?1:1-clamp((t-nxt)/.4,0,1)*.55);
      c.style.opacity=.3+.7*p.a;c.style.transform='scale('+(.94+.06*p.s)+')';
      c.style.borderColor=act>.5?(i==2?'#ffd48a':'rgba(255,225,170,.8)'):'rgba(220,245,255,.42)';
      c.style.boxShadow='inset 0 1.5px 0 rgba(255,255,255,.55),0 0 '+(70*act*(i==2?1:.6))+'px rgba(255,170,60,'+(.45*act)+'),0 26px 54px rgba(0,0,0,.5)';});
    tubes.forEach(function(o,i){var on=clamp((t-P.ts[i+1]+.5)/.3,0,1);o.tb.style.opacity=.3+.7*clamp((t-P.ts[i])/.3,0,1);o.ds.forEach(function(d,k){var f=frac(t*1.6+k/3);d.style.top=(f*(GAP-8))+'px';d.style.opacity=(.25+.75*on)*Math.sin(f*Math.PI);});});
    var s=slam(t-P.sealT);seal.style.opacity=s.a;seal.style.transform=s.tr+' rotate(10deg)';};
};
// ----- scene 4: case file -----
T.casefile=function(L,P){
  var W=768,H=640,c=el('div','glass','','width:'+W+'px;height:'+H+'px');
  c.appendChild(el('div','','','position:absolute;left:0;top:0;width:'+W+'px;height:78px;background:linear-gradient(180deg,rgba(255,191,94,.28),rgba(255,191,94,.05));border-bottom:1.5px solid rgba(255,225,170,.4)'));
  c.appendChild(el('div','hd','CASE FILE','position:absolute;left:28px;top:20px;font-size:38px;text-shadow:none;color:'+AM));
  c.appendChild(el('div','lab','ALLEGATION · NOT A CONVICTION','position:absolute;right:26px;top:30px;font-size:18px'));
  var rows=[['CHARGE','FELONY',P.r[0]],['DATE','SEP 30',P.r[1]],['STATUTE','FLORIDA 836.10',P.r[2]],['ALLEGED','WRITTEN MASS-SHOOTING THREAT',P.r[3]]];
  var rs=rows.map(function(r,i){var d=el('div','','<div class="lab" style="font-size:18px">'+r[0]+'</div><div class="hd" style="font-size:'+(i==3?27:44)+'px;text-shadow:none;margin-top:4px;'+(i==3?'white-space:normal;line-height:1.08;width:430px':'')+'">'+r[1]+'</div>','position:absolute;left:28px;top:'+(110+i*124)+'px;width:440px');c.appendChild(d);return {d:d,t:r[2]};});
  var cal=el('div','','<div style="background:#c8353f;color:#ffe8e0;font:700 20px JB,monospace;letter-spacing:.14em;text-align:center;padding:8px 0;border-radius:16px 16px 0 0">ARRAIGNMENT</div><div class="hd" style="font-size:96px;color:#2a1706;text-shadow:none;text-align:center;line-height:1.05;letter-spacing:-.04em">2</div><div class="lab" style="text-align:center;color:#2a1706;font-size:22px;padding-bottom:12px">NOV</div>','position:absolute;left:500px;top:104px;width:236px;border-radius:16px;background:linear-gradient(170deg,#fff3d6,#f2d9a2);box-shadow:0 14px 30px rgba(0,0,0,.5)');c.appendChild(cal);
  var stp=el('div','stampbox','ALLEGATION<br>NOT A<br>CONVICTION','position:absolute;left:486px;top:380px;font-size:30px;text-align:center;transform:rotate(-6deg)');c.appendChild(stp);
  L.inner.appendChild(c);
  return function(t){rs.forEach(function(o){var u=t-o.t,p=eo5(u/.28);o.d.style.opacity=clamp(u/.06,0,1);o.d.style.transform='translateX('+lerp(-40,0,p)+'px)';});
    var pc=pop(t-P.cal,.8);cal.style.opacity=pc.a;cal.style.transform='scale('+pc.s+')';var s=slam(t-P.stampT);stp.style.opacity=s.a;stp.style.transform=s.tr+' rotate(-6deg)';};
};
// ----- scene 5: other chats -----
T.ladder=function(L,P){
  var W=768,box=el('div','','','position:relative;width:'+W+'px;height:800px');
  var big=el('div','hd','0','position:absolute;left:0;top:0;font-size:230px;line-height:.9;letter-spacing:-.05em;color:'+AM+';text-shadow:0 10px 40px rgba(255,157,46,.4)');box.appendChild(big);
  box.appendChild(el('div','lab','OTHER CHATS REPORTEDLY<br>REACHED POLICE SINCE AUGUST','position:absolute;left:190px;top:46px;font-size:22px;line-height:1.35;color:'+TXT));
  var row=function(date,day,city,tag,k,y){var c=el('div','glass','','position:absolute;left:0;top:'+y+'px;width:'+W+'px;height:170px');
    c.appendChild(el('div','','<div class="lab" style="color:#2a1706;font-size:20px;text-align:center;margin-top:16px">'+date+'</div><div class="hd" style="font-size:64px;color:#2a1706;text-shadow:none;text-align:center;line-height:1;margin-top:4px">'+day+'</div>','position:absolute;left:22px;top:20px;width:124px;height:130px;border-radius:18px;background:linear-gradient(160deg,#ffd68a,#ff9d2e)'));
    c.appendChild(el('div','hd',city,'position:absolute;left:176px;top:30px;font-size:40px;text-shadow:none'));
    c.appendChild(el('div','chip '+k,tag,'position:absolute;left:176px;top:94px;font-size:21px'));return c;};
  var r1=row('AUG','11','SAN ANTONIO','MAN, 22 · ARRESTED','s',440),r2=row('AUG','14','SAN FRANCISCO','NO ARREST · NO CHARGES','',630);
  var r3=row('SEP','26','FLORIDA','THIS CASE · CHARGED','a',250);box.appendChild(r1);box.appendChild(r2);box.appendChild(r3);L.inner.appendChild(box);
  return function(t){big.textContent=String(Math.round(2*eo((t-P.cnt)/.8)));var a=pop(t-P.e1,.9),b=pop(t-P.e2,.9);
    r1.style.opacity=a.a;r1.style.transform='translateY('+(t<P.e1?0:lerp(40,0,eo5((t-P.e1)/.3)))+'px)';r2.style.opacity=b.a;r2.style.transform='translateY('+(t<P.e2?0:lerp(40,0,eo5((t-P.e2)/.3)))+'px)';var p3=pop(t-P.e3,.9);r3.style.opacity=p3.a;r3.style.transform='translateY('+(t<P.e3?0:lerp(40,0,eo5((t-P.e3)/.3)))+'px)';};
};
// ----- scene 6: two labs -----
T.vs=function(L,P){
  var W=372,H=640,box=el('div','','','position:relative;width:768px;height:'+H+'px');
  function card(x,name,logo,sub,steps,col,tt){var c=el('div','glass','','position:absolute;left:'+x+'px;top:0;width:'+W+'px;height:'+H+'px');
    c.appendChild(el('div','','<div class="lg" style="width:46px;height:46px;color:'+col+'">'+(LOGOS[logo]||'')+'</div><div class="hd" style="font-size:36px;text-shadow:none;margin-left:14px">'+name+'</div>','position:absolute;left:24px;top:28px;display:flex;align-items:center'));
    c.appendChild(el('div','lab',sub,'position:absolute;left:24px;top:100px;font-size:18px;color:'+col));
    var ss=steps.map(function(s,i){var d=el('div','','<span style="color:'+col+';margin-right:10px">'+(i+1)+'</span>'+s,'position:absolute;left:24px;top:'+(150+i*152)+'px;width:324px;min-height:124px;border-radius:18px;padding:16px 18px;font:700 23px/1.25 JB,monospace;letter-spacing:.04em;text-transform:uppercase;background:linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.04));border:1.5px solid '+col+';display:flex;align-items:center');c.appendChild(d);return {d:d,t:tt+.25+i*.35};});
    box.appendChild(c);return {c:c,ss:ss,t:tt};}
  var A=card(0,'ANTHROPIC','anthropic','SAYS IT MONITORS CHATS',['AUTO-FLAG','HUMAN REVIEW','REPORT TO POLICE IF CREDIBLE'],AM,P.ta),O=card(396,'OPENAI','openai','HAS SAID',['AUTO-FLAG','HUMAN REVIEW TEAM','POLICE: IMMINENT HARM TO OTHERS ONLY'],ICE,P.to);
  L.inner.appendChild(box);
  return function(t){[A,O].forEach(function(o){var p=pop(t-o.t,.9);o.c.style.opacity=p.a;o.c.style.transform='translateY('+(t<o.t?0:lerp(50,0,eo5((t-o.t)/.32)))+'px)';
    o.ss.forEach(function(s){var q=pop(t-s.t,.8);s.d.style.opacity=q.a;s.d.style.transform='scale('+q.s+')';});});};
};
// ----- scene 7: the privacy clause -----
T.clause=function(L,P){
  var W=768,H=640,c=el('div','glass','','width:'+W+'px;height:'+H+'px');
  c.appendChild(el('div','chip a','PRIVACY POLICY','position:absolute;left:28px;top:28px;font-size:22px'));
  c.appendChild(el('div','chip','EFFECTIVE SEP 10','position:absolute;left:300px;top:28px;font-size:22px'));
  var pr=el('div','','','position:absolute;left:34px;top:110px;width:700px;font:500 40px/1.5 IN,sans-serif;color:'+MUTE);
  pr.innerHTML='Disclosure to law enforcement is allowed with a good-faith belief <span id="hl1" style="background:linear-gradient(90deg,rgba(255,191,94,.55),rgba(255,191,94,.55)) no-repeat;background-size:0% 100%;color:'+TXT+';padding:2px 0;-webkit-box-decoration-break:clone;box-decoration-break:clone">“that disclosure is reasonably necessary to … prevent serious harm to any person or to property.”</span>';
  c.appendChild(pr);var hl=pr.querySelector('#hl1');
  c.appendChild(el('div','','','position:absolute;left:34px;top:490px;color:'+AM,ic('scale',70,AM,1.5)));
  c.appendChild(el('div','lab','QUOTED EXCERPT AS REPORTED BY TECH PRESS<br>LEAD-IN IS A PARAPHRASE','position:absolute;left:124px;top:498px;font-size:18px;line-height:1.4'));
  L.inner.appendChild(c);
  return function(t){hl.style.backgroundSize=(100*eo((t-P.hlT)/1.4))+'% 100%';};
};
// ----- scene 8: jars -----
T.jars=function(L,P){
  var W=768,box=el('div','','','position:relative;width:768px;height:680px');
  function jar(x,hatch,lbl){var j=el('div','glass','','position:absolute;left:'+x+'px;top:0;width:360px;height:400px;border-radius:44px 44px 70px 70px');
    var fill=el('div','','','position:absolute;left:0;right:0;bottom:0;height:0;background:repeating-linear-gradient(135deg,rgba(255,191,94,.55) 0 14px,rgba(255,191,94,.18) 14px 28px)');if(hatch)j.appendChild(fill);
    var num=el('div','hd','','position:absolute;left:0;right:0;top:'+(hatch?96:116)+'px;text-align:center;font-size:'+(hatch?84:180)+'px;line-height:1;text-shadow:0 8px 28px rgba(0,0,0,.5)');j.appendChild(num);
    var lb=el('div','lab',lbl,'position:absolute;left:'+x+'px;top:416px;width:360px;text-align:center;font-size:20px;line-height:1.3;color:'+TXT);box.appendChild(j);box.appendChild(lb);return {j:j,fill:fill,num:num,lb:lb};}
  var a=jar(0,0,'POLICE EMERGENCY REQUESTS<br>H2 2025'),b=jar(408,1,'REPORTS THE COMPANY<br>MAKES ITSELF');
  var chip=el('div','chip s','NOT COUNTED','position:absolute;left:470px;top:-26px;font-size:24px');box.appendChild(chip);
  var q=el('div','glass','','position:absolute;left:0;top:520px;width:768px;height:150px');q.appendChild(el('div','lab','EMERGENCY STANDARD IN THE REPORT','position:absolute;left:28px;top:20px;font-size:18px'));
  q.appendChild(el('div','','','position:absolute;left:28px;top:54px;width:712px;font:900 italic 34px/1.15 FR,serif;color:#ffe6a8')).textContent='“danger of death or serious physical injury to a person”';box.appendChild(q);
  L.inner.appendChild(box);
  return function(t){a.num.textContent='0';a.num.style.color=TXT;var pa=pop(t-P.ta,.9);a.j.style.opacity=pa.a;a.lb.style.opacity=pa.a;a.j.style.transform='scale('+pa.s+')';
    var pb=pop(t-P.tb,.9);b.j.style.opacity=pb.a;b.lb.style.opacity=pb.a;b.j.style.transform='scale('+pb.s+')';b.fill.style.height=(240*eo((t-P.tb-.2)/1.2))+'px';b.num.textContent='?';b.num.style.color='#ffe6a8';b.num.style.transform='scale('+(.96+.04*Math.sin(t*4))+')';
    var un=t-P.nc;chip.style.opacity=un<0?0:clamp(un/.04,0,1);chip.style.transform='scale('+(un<0?1:lerp(1.25,1,eo5(un/.18)))+') rotate(5deg)';var pq=pop(t-P.q,.9);q.style.opacity=pq.a;q.style.transform='translateY('+(t<P.q?0:lerp(40,0,eo5((t-P.q)/.3)))+'px)';};
};
// ----- scene 9: the sheriff's line + unknowns -----
T.quote=function(L,P){
  var W=768,box=el('div','','','position:relative;width:768px;height:780px');
  var q=el('div','glass','','position:absolute;left:0;top:0;width:768px;height:360px');
  q.appendChild(el('div','','“','position:absolute;left:24px;top:-34px;font:900 italic 200px/1 FR,serif;color:'+AM+';opacity:.55'));
  q.appendChild(el('div','','','position:absolute;left:48px;top:84px;width:680px;font:900 italic 64px/1.08 FR,serif;color:#ffe6a8')).textContent='never truly anonymous.”';
  q.appendChild(el('div','lab','LEE COUNTY SHERIFF CARMINE MARCENO<br>ON WHAT YOU SHARE WITH AI · TO WINK NEWS','position:absolute;left:48px;top:262px;font-size:19px;line-height:1.45'));
  box.appendChild(q);
  box.appendChild(el('div','lab','WHAT WE DON’T KNOW','position:absolute;left:0;top:402px;color:'+AM));
  var items=['HOW OFTEN CHATS GET FLAGGED','THE EXACT MESSAGES','ARREST REPORT NOT IN THE COURT FILE YET'].map(function(txt,i){var d=el('div','glass','','position:absolute;left:0;top:'+(444+i*108)+'px;width:768px;height:92px;border-radius:24px');
    d.appendChild(el('div','','','position:absolute;left:24px;top:22px;color:'+AM,ic('alert-triangle',46,AM,1.7)));d.appendChild(el('div','','','position:absolute;left:92px;top:28px;font:700 22px JB,monospace;letter-spacing:.06em;color:'+TXT)).textContent=txt;box.appendChild(d);return {d:d,t:P.ts[i]};});
  L.inner.appendChild(box);
  return function(t){var pq=pop(t-L.t0,.9);q.style.opacity=pq.a;q.style.transform='scale('+pq.s+')';items.forEach(function(o){var p=pop(t-o.t,.9);o.d.style.opacity=p.a;o.d.style.transform='translateY('+(t<o.t?0:lerp(40,0,eo5((t-o.t)/.3)))+'px)';});};
};
// ----- scene 10: CTA -----
T.compare=function(L,P){
  var box=el('div','','','position:relative;width:768px;height:270px');
  function card(x,ico,ttl,k,lines,col,ts){var d=el('div','glass','','position:absolute;left:'+x+'px;top:0;width:372px;height:270px');
    d.appendChild(el('div','','','position:absolute;left:24px;top:22px;color:'+col,ic(ico,54,col,1.6)));d.appendChild(el('div','hd',ttl,'position:absolute;left:92px;top:26px;font-size:34px;text-shadow:none'));
    d.appendChild(el('div','lab',k,'position:absolute;left:24px;top:98px;font-size:18px;color:'+col));
    d.appendChild(el('div','','','position:absolute;left:24px;top:136px;width:330px;font:700 24px/1.3 IN,sans-serif;color:'+TXT)).innerHTML=lines;box.appendChild(d);return {d:d,t:ts};}
  var A=card(0,'notebook','DIARY','WHO READS IT','you.<br>lock and key.',ICE,P.ta),B=card(396,'message-circle','AI CHAT','WHO MAY READ IT','automated flags. A human, if serious.',AM,P.tb);
  L.inner.appendChild(box);
  return function(t){[A,B].forEach(function(o){var p=pop(t-o.t,.9);o.d.style.opacity=p.a;o.d.style.transform='scale('+p.s+')';});};
};
T.cta=function(L,P){
  var W=768,h=P.h||410,b=el('div','glass','','width:'+W+'px;height:'+h+'px');
  b.appendChild(el('div','',"<img src='profile.jpg' style='width:100%;height:100%;object-fit:cover;display:block'>",'position:absolute;left:34px;top:70px;width:250px;height:250px;border-radius:50%;overflow:hidden;border:10px solid '+AM+';box-shadow:0 0 0 6px rgba(20,12,4,.9),0 0 50px rgba(255,191,94,.5)'));
  b.appendChild(el('div','lab','FOLLOW FOR THE NEXT AI STORY','position:absolute;left:316px;top:62px;font-size:19px;color:'+AM));
  b.appendChild(el('div','hd','@sandesh<br>.explains','position:absolute;left:316px;top:102px;font-size:60px;line-height:1;text-shadow:none'));
  var btn=el('div','chip a','FOLLOW →','position:absolute;left:316px;top:262px;font-size:32px;padding:16px 30px');b.appendChild(btn);
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0;btn.style.transform='scale('+(1+.06*Math.sin(u*7)*clamp(u-.4,0,1))+')';};
};
var LAY=[];
window.COMPS={
  build:function(root){window.DATA.scenes.forEach(function(sc){(sc.layers||[]).forEach(function(P){
    var wrap=el('div','c','','left:'+(P.x||0)+'px;top:'+(P.y||0)+'px;display:none;');var inner=el('div','','','');wrap.appendChild(inner);root.appendChild(wrap);if(P.nocheck)wrap.dataset.nc='1';wrap.dataset.type=P.type;wrap.dataset.t0=P.t0;
    var L={wrap:wrap,inner:inner,t0:P.t0,t1:P.t1,fx:P.fx};L.upd=T[P.type](L,P);LAY.push(L);});});},
  update:function(t){for(var i=0;i<LAY.length;i++){var L=LAY[i],on=t>=L.t0-.02&&t<=L.t1;
    if(!on){if(L.on){L.wrap.style.display='none';L.on=false;}continue;}
    if(!L.on){L.wrap.style.display='block';L.on=true;}
    wrapFx(L,t);L.upd(t);}}
};
})();
