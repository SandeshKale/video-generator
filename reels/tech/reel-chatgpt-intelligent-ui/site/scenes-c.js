// Scenes 7-9. Pure functions of t. Stage-local coordinates (768 x 818).
(function(){
'use strict';
var K=window.K,clamp=K.clamp,lerp=K.lerp,sm=K.sm,eb=K.eb,el=K.el,en=K.en;
window.SCN=window.SCN||[];
function ST(sty,html){return el('div','',html,sty);}
function card(st,cls,sty,html){var c=el('div','card '+(cls||''),html||'',sty);st.appendChild(c);return c;}
// ================= S7: paid first, free the next day =================
window.SCN[6]={eb:'// rollout: wednesday, then thursday',h:[['Paid',{t:'first.',hl:1}],['Free',{t:'later.',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,t0=ctx.sc.start,tPaid=W('पेड'),tWed=W('बुधवार'),tFree=W('फ़्री'),tThu=W('गुरुवार');
  var cal=card(st,'','left:0;top:0;width:340px;height:210px;overflow:hidden;transform-origin:50% 100%','<div class="hd" style="height:58px;background:#ff8a1f;border-bottom:4px solid #14182b;font:700 32px FR;padding:10px 26px;letter-spacing:.08em">WED</div><div class="dd" style="font:700 100px/1 FR;text-align:center;margin-top:14px">7 <span style="font-size:42px">OCT</span></div>');
  var hd=cal.querySelector('.hd'),dd=cal.querySelector('.dd');
  var key=ST('left:372px;top:6px;width:396px;display:flex;flex-direction:column;gap:14px;font:700 28px FR','<div style="display:flex;align-items:center;gap:14px"><span class="btn cob" style="height:54px;font-size:26px">SOL</span>Paid plans</div><div style="display:flex;align-items:center;gap:14px"><span class="btn tan" style="height:54px;font-size:26px">LUNA</span>Free &amp; Go</div><div class="mono" style="font-size:20px;color:#5a6488">Chat tab only</div>');st.appendChild(key);
  function lane(top,col,lab,chips,model){return card(st,'','left:0;top:'+top+'px;width:768px;height:270px;padding:26px 30px','<div style="display:flex;justify-content:space-between;align-items:center"><div class="dv" style="font-size:44px">'+lab+'</div><span class="btn '+col+'" style="height:58px">GPT-6 '+model+'</span></div><div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap">'+chips.map(function(c){return '<span class="chipc">'+c+'</span>';}).join('')+'</div><div class="trk" style="margin-top:24px;height:28px;width:520px"><div class="f" style="background:'+(col==='cob'?'#2b50ff':'#ff8a1f')+';height:28px"></div></div><div class="ok" style="position:absolute;right:30px;top:178px;font:700 34px FR;opacity:0"></div>');}
  var A=lane(236,'cob','Paid plans',['Plus','Pro','Business','Enterprise'],'SOL'),B=lane(526,'tan','Free & Go',['Free','Go'],'LUNA');
  var fA=A.querySelector('.f'),fB=B.querySelector('.f'),oA=A.querySelector('.ok'),oB=B.querySelector('.ok');
  ctx.cursor=[[tPaid-t0+.1,700,150,-8,0,0,.5,0],[tWed-t0+.25,640,360,-6,1,0,.4,1],[tFree-t0+.2,640,490,-8,0,0,.5,0],[tThu-t0+.4,640,650,-6,1,0,.4,1],[5,640,650,-6,0,0,.4,0]];
  return {upd:function(t,lt){
    en(cal,t,t0+.1,{dy:40,r:-2,d:.45,s0:.8});var flip=sm((t-(tThu-.3))/.3);var fl=Math.abs(Math.cos(flip*Math.PI));var th=flip>.5;
    if(t>tThu-.3&&t<tThu+.1)cal.style.transform='rotate(-2deg) scaleY('+Math.max(.05,fl).toFixed(2)+')';
    hd.textContent=th?'THU':'WED';dd.innerHTML=(th?'8':'7')+' <span style="font-size:42px">OCT</span>';hd.style.background=th?'#ffe14d':'#ff8a1f';
    en(key,t,t0+.3,{dy:-20,d:.4});
    en(A,t,tPaid-.2,{dy:60,r:-1,d:.5,s0:.85});en(B,t,tFree-.25,{dy:60,r:1,d:.5,s0:.85});
    var a=sm((t-tWed)/1.0),b=sm((t-tThu)/1.0);fA.style.width=(a*510)+'px';fB.style.width=(b*510)+'px';
    oA.textContent=a>.98?'✓ Live':'';oA.style.opacity=a>.98?1:0;oB.textContent=b>.98?'✓ Live':'';oB.style.opacity=b>.98?1:0;oA.style.color='#1a8f4c';oB.style.color='#1a8f4c';
  }};}};
// ================= S8: a pretty chart is not a checked chart =================
window.SCN[7]={eb:'// the catch: pretty is not proof',h:[['Pretty'],['≠',{t:'checked',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,t0=ctx.sc.start,tPech=W('पेच'),tJ=W('जाँचा'),tCr=W('आलोचक'),tLow=W('कम');
  var ch=card(st,'','left:0;top:0;width:768px;height:470px;overflow:hidden','<div class="mono" style="position:absolute;left:28px;top:22px;color:#2b50ff">glossy chart</div><svg class="sv" viewBox="0 0 768 470" style="position:absolute;inset:0;width:768px;height:470px"></svg><div class="plain" style="position:absolute;left:34px;top:70px;right:34px;opacity:0"></div>');
  var sv=ch.querySelector('.sv'),plain=ch.querySelector('.plain');
  plain.innerHTML=[['Quarter 1','fine'],['Quarter 2','better'],['Quarter 3','check me'],['Quarter 4','fine']].map(function(r){return '<div class="dv" style="display:flex;justify-content:space-between;font-size:38px;border-bottom:4px dashed #c3d0f2;padding:12px 0">'+r[0]+'<span>'+r[1]+'</span></div>';}).join('');
  var sl=card(st,'','left:0;top:520px;width:768px;height:190px;padding:24px 30px','<div style="display:flex;justify-content:space-between"><div class="mono" style="color:#ff8a1f">settings · visuals</div><div class="dv lv" style="font-size:30px">More</div></div><div class="trk" style="margin-top:34px"><div class="f" style="background:#ff8a1f"></div><div class="k"></div></div>');
  var f=sl.querySelector('.f'),k=sl.querySelector('.k'),lv=sl.querySelector('.lv');
  var stamp=el('div','stamp','VERIFY FIRST','right:20px;top:726px;transform:rotate(-6deg);background:#ffe14d');st.appendChild(stamp);
  ctx.cursor=[[tPech-t0+.3,640,300,-8,0,-.4,.3,0],[tJ-t0-.1,100,230,-12,2,.6,.2,0],[tJ-t0+1.0,640,250,-8,2,.6,.2,0],[tLow-t0-.9,560,540,-6,0,.3,.4,0],[tLow-t0-.3,540,586,-6,1,.3,.4,1],[tLow-t0+.8,150,586,-6,0,-.3,.4,0],[10.5,150,640,-6,0,-.3,.4,0]];
  return {upd:function(t,lt){
    en(ch,t,t0+.1,{dy:50,r:-1,d:.5,s0:.9});
    var vis=1-sm((t-tLow-.2)/.8),shine=((t*.5)%1.6)-.3;
    var bars=[[60,'#ffe14d'],[180,'#2b50ff'],[260,'#ff8a1f'],[330,'#2b50ff'],[290,'#ffe14d']],s='<defs><linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g opacity="'+vis.toFixed(2)+'"><g stroke="#14182b" stroke-width="5">';
    bars.forEach(function(b,i){var h=b[0]+8*Math.sin(t*2+i);s+='<rect x="'+(50+i*138)+'" y="'+(420-h)+'" width="96" height="'+h+'" rx="14" fill="'+b[1]+'"/>';});s+='</g>';
    s+='<rect x="'+(shine*768-80)+'" y="40" width="160" height="400" fill="url(#gl)" transform="skewX(-14)"/>';
    var cr=sm((t-tCr-.1)/.3);s+='<g transform="translate(600 '+(150-18*cr)+') rotate('+(-4+cr*0)+')" opacity="'+cr.toFixed(2)+'"><rect x="-86" y="-30" width="172" height="52" rx="14" fill="#ff3b3b" stroke="#14182b" stroke-width="4"/><text y="8" text-anchor="middle" font-family="FR" font-weight="700" font-size="30" fill="#fff">CHECK!</text></g></g>';
    // magnifier sweep
    var mu=clamp((t-tJ+.1)/1.1,0,1),mx=lerp(100,640,sm(mu)),my=250+30*Math.sin(mu*6);
    if(t>tJ-.1&&t<tJ+1.4)s+='<g transform="translate('+mx+' '+my+')"><circle r="62" fill="rgba(255,255,255,.25)" stroke="#14182b" stroke-width="9"/><path d="M44 44 L96 96" stroke="#14182b" stroke-width="14" stroke-linecap="round"/></g>';
    sv.innerHTML=s;plain.style.opacity=(1-vis).toFixed(2);
    en(sl,t,tCr+.6,{dy:50,d:.5,s0:.9});
    var kv=1-sm((t-tLow-.1)/.8)*.8;f.style.width=(kv*690)+'px';k.style.left=(kv*690)+'px';lv.textContent=kv>.5?'More':'Less';
    en(stamp,t,tCr+1.0,{dy:20,r:-6,rf:-14,d:.35,s0:1.5});
  }};}};
// ================= S9: read -> use, and the follow card =================
window.SCN[8]={eb:'// from reading to using',h:[['Not to read.'],['To',{t:'use.',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,t0=ctx.sc.start,tR=W('पढ़ने'),tU=W('इस्तेमाल'),tQ=W('चुनेंगे'),tRd=W('पढ़ना'),tTc=W('छूना'),tF=W('अगली'),tFo=W('फ़ॉलो');
  var A=card(st,'','left:0;top:0;width:768px;height:280px;background:#f3f6ff;border-color:#8b95b8;box-shadow:8px 8px 0 #8b95b8;padding:26px 30px','<div style="display:flex;justify-content:space-between"><div class="mono" style="color:#8b95b8">read</div></div>'+[64,100,136,172,208].map(function(y,i){return '<div class="txt" style="left:30px;right:'+[60,30,120,30,260][i]+'px;top:'+y+'px"></div>';}).join(''));
  var B=card(st,'','left:0;top:330px;width:768px;height:330px;padding:26px 30px','<div class="mono" style="color:#2b50ff">touch</div><div style="display:flex;gap:16px;margin-top:20px"><span class="btn cob">Compare</span><span class="btn tan">Edit</span><span class="btn lem">Share</span></div><svg class="mc" viewBox="0 0 420 150" style="position:absolute;left:30px;top:150px;width:420px;height:150px"></svg><div class="trk" style="position:absolute;left:490px;top:200px;width:230px"><div class="f" style="background:#2b50ff"></div><div class="k"></div></div>');
  var mc=B.querySelector('.mc'),f=B.querySelector('.f'),k=B.querySelector('.k');
  var C=card(st,'ov','left:20px;top:60px;width:728px;height:730px;padding:0;text-align:center;box-shadow:10px 10px 0 #14182b','<div style="position:absolute;left:224px;top:40px;width:280px;height:280px;border-radius:50%;border:12px solid #ff8a1f;box-shadow:0 0 0 7px #14182b;background:#fff url(profile.jpg) center/cover"></div><div style="position:absolute;left:0;right:0;top:356px;font:700 66px FR;letter-spacing:-.01em">@sandesh.explains</div><div class="fb" style="position:absolute;left:174px;top:468px;width:380px;height:116px;border:6px solid #14182b;border-radius:999px;background:#ff8a1f;box-shadow:7px 7px 0 #14182b;font:700 62px FR;line-height:104px">FOLLOW</div><div class="dv" style="position:absolute;left:0;right:0;top:620px;font-size:42px">for the next story</div>');
  var fb=C.querySelector('.fb');
  ctx.cursor=[[tU-t0-.5,640,200,-6,0,0,.5,0],[tU-t0+.1,170,430,-8,1,0,.4,1],[tU-t0+1.5,420,500,-8,0,.3,.3,0],[tFo-t0-.7,660,700,-8,0,0,.4,0],[tFo-t0+.15,520,560,-8,1,0,.4,1],[tFo-t0+1.2,600,640,6,0,0,.3,0],[16.5,600,640,6,0,0,.3,0]];
  return {upd:function(t,lt){
    var dim=sm((t-tR)/.6);en(A,t,t0+.1,{dy:50,r:-1,d:.5,s0:.9});if(t>tR)A.style.opacity=(1-dim*.55).toFixed(2);
    en(B,t,t0+.2,{dy:50,r:1,d:.5,s0:.9});
    var lit=sm((t-tU+.1)/.5);var cols=[['#ffe14d','#d8def0'],['#2b50ff','#c9d1ea'],['#ff8a1f','#d8def0'],['#2b50ff','#c9d1ea']];
    var s='<g stroke="#14182b" stroke-width="4">';[50,110,80,126].forEach(function(h,i){var hh=(h+8*Math.sin(t*2+i))*(.35+.65*lit);s+='<rect x="'+(10+i*100)+'" y="'+(146-hh)+'" width="74" height="'+hh+'" rx="12" fill="'+(lit>.5?cols[i][0]:cols[i][1])+'"/>';});mc.innerHTML=s+'</g>';
    var kv=.2+.6*(.5+.5*Math.sin(t*1.5))*lit+.1*(1-lit);f.style.width=(kv*190)+'px';k.style.left=(kv*190)+'px';B.style.boxShadow='8px 8px 0 #14182b';B.style.borderColor='#14182b';
    var pr=sm((t-tF+.3)/.5);
    if(t>tF-.35){var u=en(C,t,tF-.35,{dy:80,r:-1,rf:-6,d:.55,s0:.8});A.style.opacity=(.45*(1-pr)).toFixed(2);B.style.opacity=(1-pr*.75).toFixed(2);}else{C.style.opacity=0;C.style.visibility='hidden';}
    var press=t>tFo+.1&&t<tFo+.55?1:0;fb.style.transform='scale('+(1-.06*press+.04*Math.sin(t*5)*(t>tF+.5?1:0)).toFixed(3)+')';fb.style.background=press?'#ffb25e':'#ff8a1f';
  }};}};
})();
