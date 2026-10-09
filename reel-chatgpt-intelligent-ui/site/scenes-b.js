// Scenes 4-6. Pure functions of t. Stage-local coordinates (768 x 818).
(function(){
'use strict';
var K=window.K,clamp=K.clamp,lerp=K.lerp,sm=K.sm,eb=K.eb,eo5=K.eo5,el=K.el,en=K.en;
window.SCN=window.SCN||[];
function ST(sty,html){return el('div','',html,sty);}
function card(st,cls,sty,html){var c=el('div','card '+(cls||''),html||'',sty);st.appendChild(c);return c;}
var SEG=(window.Intl&&Intl.Segmenter)?new Intl.Segmenter('hi',{granularity:'grapheme'}):null;
function graphemes(s){return SEG?Array.from(SEG.segment(s)).map(function(x){return x.segment;}):Array.from(s);}
function skel(st,sty,lab){var d=el('div','',(lab?'<div class="mono" style="position:absolute;left:20px;top:16px;color:#8b95b8">'+lab+'</div>':'')+'<div class="sk" style="left:20px;top:64px;width:60%"></div><div class="sk" style="left:20px;top:96px;width:44%"></div><div class="sk" style="left:20px;top:128px;width:52%"></div>','border:4px dashed #aab6dc;border-radius:30px;background:rgba(255,255,255,.5);'+sty);st.appendChild(d);d.__sk=[].slice.call(d.querySelectorAll('.sk'));return d;}
function shimmer(d,t){d.__sk.forEach(function(s,i){s.style.setProperty('--sx',(((t*160+i*50)%360)-60)+'px');});}
function stat(sk,real,t,t0,o){var u=sm((t-t0+.05)/.2);sk.style.opacity=(1-u).toFixed(2);sk.style.visibility=u>=1?'hidden':'visible';return en(real,t,t0,o||{dy:40,d:.5,s0:.6});}
// ================= S4: it builds the interface while it is still typing =================
window.SCN[3]={eb:'// the answer is built live',h:[['It builds'],['while it',{t:'types',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,t0=ctx.sc.start,tB=W('बटन'),tF=W('फ़ॉर्म'),tC=W('चार्ट'),tK=W('कैलकुलेटर');
  var MSG=graphemes('Here is your full answer');
  var rep=card(st,'','left:0;top:0;width:768px;height:196px;padding:26px 30px','<div class="mono" style="color:#2b50ff">chatgpt · typing</div><div class="ln dv" style="margin-top:14px;font-size:44px;line-height:1.2;min-height:54px"></div><div class="trk" style="margin-top:18px;height:22px"><div class="f" style="background:#2b50ff;height:22px"></div></div>');
  var ln=rep.querySelector('.ln'),pf=rep.querySelector('.f');
  var sB=skel(st,'left:0;top:226px;width:362px;height:196px','button'),sF=skel(st,'left:392px;top:226px;width:376px;height:196px','form'),sC=skel(st,'left:0;top:452px;width:420px;height:352px','chart'),sK=skel(st,'left:450px;top:452px;width:318px;height:352px','calculator');
  var rB=card(st,'','left:0;top:226px;width:362px;height:196px;padding:22px','<div class="mono" style="color:#ff8a1f">buttons</div><div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap"><span class="btn cob" style="height:54px;font-size:26px">Yes</span><span class="btn tan" style="height:54px;font-size:26px">Maybe</span><span class="btn lem" style="height:54px;font-size:26px">No</span></div>');
  var rF=card(st,'','left:392px;top:226px;width:376px;height:196px;padding:22px','<div class="mono" style="color:#2b50ff">form</div><div style="margin-top:14px;height:46px;border:4px solid #14182b;border-radius:14px;background:#f4f7ff;font:600 24px IN;padding:6px 14px;color:#8b95b8">Your name</div><div style="margin-top:14px;display:flex;align-items:center;gap:12px;font:700 26px FR"><i style="width:34px;height:34px;border:4px solid #14182b;border-radius:10px;background:#ffe14d;display:inline-block"></i>Subscribe</div>');
  var rC=card(st,'','left:0;top:452px;width:420px;height:352px;padding:0','<div class="mono" style="position:absolute;left:24px;top:20px;color:#ff8a1f">chart</div><div class="cb"></div>');
  var rK=card(st,'','left:450px;top:452px;width:318px;height:352px;padding:22px','<div class="mono" style="color:#2b50ff">calculator</div><div class="dsp" style="margin-top:12px;height:62px;border:4px solid #14182b;border-radius:14px;background:#f4f7ff;font:700 40px FR;text-align:right;padding:8px 14px">1,280</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px">'+Array.apply(null,Array(12)).map(function(_,i){return '<i style="height:46px;border:4px solid #14182b;border-radius:12px;background:'+(i%4===3?'#ff8a1f':i===0?'#ffe14d':'#fff')+'"></i>';}).join('')+'</div>');
  var cb=rC.querySelector('.cb'),dsp=rK.querySelector('.dsp');
  ctx.cursor=[[.4,40,120,-10,1,.8,.2,0],[3.6,640,120,-10,0,.8,.2,0],[tB-t0+.05,150,330,-8,1,0,.4,1],[tF-t0+.05,520,330,-8,1,0,.4,1],[tC-t0+.05,200,640,-8,1,0,.4,1],[tK-t0+.05,600,640,-8,1,0,.4,1],[tK-t0+1.4,640,760,6,0,0,.3,0],[11.5,640,760,6,0,0,.3,0]];
  return {upd:function(t,lt){var p=clamp((lt-.2)/4.4,0,1),n=Math.floor(p*MSG.length);
    ln.innerHTML=MSG.slice(0,n).join('')+(((Math.floor(t*2.6)%2)===0||p<1)?'<span style="display:inline-block;width:6px;height:44px;background:#2b50ff;vertical-align:middle;margin-left:4px"></span>':'');
    var done=(t>tB?1:0)+(t>tF?1:0)+(t>tC?1:0)+(t>tK?1:0);pf.style.width=(sm((t-tB)/.2)*.25*600+sm((t-tF)/.2)*.25*600+sm((t-tC)/.2)*.25*600+sm((t-tK)/.2)*.25*600+p*0)+'px';
    [sB,sF,sC,sK].forEach(function(s){shimmer(s,t);});
    stat(sB,rB,t,tB,{dy:50,r:-1,d:.45});stat(sF,rF,t,tF,{dy:50,r:1,d:.45});stat(sC,rC,t,tC,{dy:50,r:-1,d:.45});stat(sK,rK,t,tK,{dy:50,r:1,d:.45});
    var cu=sm((t-tC)/.6);cb.innerHTML='<svg viewBox="0 0 420 300" style="position:absolute;left:0;top:50px;width:420px;height:300px"><g stroke="#14182b" stroke-width="4">'+[0,1,2,3,4].map(function(i){var h=(60+i*34+10*Math.sin(t*2.4+i))*cu;return '<rect x="'+(24+i*74)+'" y="'+(270-h)+'" width="54" height="'+h+'" rx="10" fill="'+['#ffe14d','#2b50ff','#ff8a1f','#2b50ff','#ffe14d'][i]+'"/>';}).join('')+'</g></svg>';
    dsp.textContent=t>tK?['1,280','2,560','9.9k','365'][Math.floor((t-tK)*1.8)%4]:'0';
  }};}};
// ================= S5: three answers you can use =================
window.SCN[4]={eb:'// dinner, bill, trek',h:[['Answers you'],['can',{t:'use',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,t0=ctx.sc.start,tG=W('मेहमान'),tBl=W('बिल'),tSp=W('स्प्लिटर'),tMap=W('नक्शा');
  var rec=card(st,'','left:0;top:0;width:768px;height:332px;padding:24px 30px','<div style="display:flex;justify-content:space-between;align-items:center"><div class="mono" style="color:#ff8a1f">recipe</div><div style="display:flex;align-items:center;gap:14px"><span class="dv" style="font-size:26px">Guests</span><span class="btn mn" style="height:50px;padding:0 20px">−</span><span class="gn" style="font:700 52px FR;min-width:36px;text-align:center">4</span><span class="btn cob pl" style="height:50px;padding:0 20px">+</span></div></div><div class="dv" style="font-size:52px;margin-top:6px;line-height:1.1">Chicken tikka bowls</div><div class="rows" style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;font:700 30px FR"></div>');
  var gn=rec.querySelector('.gn'),rows=rec.querySelector('.rows'),pl=rec.querySelector('.pl');
  var skB=skel(st,'left:0;top:372px;width:366px;height:430px','bill'),skM=skel(st,'left:402px;top:372px;width:366px;height:430px','map');
  var bill=card(st,'','left:0;top:372px;width:366px;height:430px;padding:24px','<div class="mono" style="color:#2b50ff">bill splitter</div><div class="chs" style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap"></div><div class="tot dv" style="margin-top:22px;font:700 78px/1 FR"></div><div class="mono sub" style="margin-top:8px;font-size:20px;color:#5a6488"></div><div class="trk" style="margin-top:26px;height:22px"><div class="f" style="background:#ff8a1f;height:22px"></div></div><div class="mono" style="margin-top:12px;font-size:20px">tip 10%</div>');
  var chs=bill.querySelector('.chs'),tot=bill.querySelector('.tot'),sub=bill.querySelector('.sub'),bf=bill.querySelector('.f');
  var map=card(st,'','left:402px;top:372px;width:366px;height:430px;overflow:hidden','<div class="mono" style="position:absolute;left:24px;top:22px;color:#ff8a1f;z-index:2">trek map</div><svg class="ms" viewBox="0 0 366 430" style="position:absolute;inset:0;width:366px;height:430px"></svg>');
  var ms=map.querySelector('.ms');
  ctx.cursor=[[tG-t0-.5,560,70,-8,0,.2,.3,0],[tG-t0+.05,590,100,-6,1,0,.4,1],[tG-t0+.55,590,100,-6,1,0,.4,1],[tSp-t0-.9,240,500,-8,0,0,.4,0],[tSp-t0-.2,150,560,-8,1,0,.3,1],[tSp-t0+.4,290,560,-8,1,0,.3,1],[tMap-t0-.3,560,430,-6,0,.2,.4,0],[tMap-t0+1.2,640,520,6,0,0,.3,0],[11,640,520,6,0,0,.3,0]];
  var ING=[['Chicken',150,'g'],['Yogurt',50,'g'],['Rice',75,'g'],['Lemons',.5,'']];
  return {upd:function(t,lt){
    en(rec,t,t0+.1,{dy:50,r:-1,d:.5,s0:.9});
    var g=t<tG+.1?4:t<tG+.5?5:6;gn.textContent=g;pl.style.transform='scale('+(1+.12*Math.max(0,Math.sin((t-tG-.05)*14))*((t>tG&&t<tG+.7)?1:0)).toFixed(3)+')';
    rows.innerHTML=ING.map(function(r){var v=r[1]*g;if(r[2]==='')v=Math.round(v);return '<div style="display:flex;justify-content:space-between;border-bottom:4px dashed #c3d0f2;padding-bottom:4px"><span>'+r[0]+'</span><b style="color:#2b50ff">'+v+(r[2]?' '+r[2]:'')+'</b></div>';}).join('');
    shimmer(skB,t);shimmer(skM,t);
    stat(skB,bill,t,tBl,{dy:50,r:1,d:.5});stat(skM,map,t,tMap-.3,{dy:50,r:-1,d:.5});
    var sel=[1,1,t>tSp+.3?1:0],n=sel[0]+sel[1]+sel[2],names=['Ana','Raj','Mia'];
    chs.innerHTML=names.map(function(nm,i){return '<span class="chipc dv" style="background:'+(sel[i]?'#ffe14d':'#fff')+';font-size:26px">'+nm+'</span>';}).join('');
    tot.textContent='₹'+Math.round(1200/n);sub.textContent=n+' people each';bf.style.width=(1200/n/1200*260)+'px';
    var d=sm((t-tMap)/1.3),L=520,s='<rect width="366" height="430" fill="#dff0e6"/><path d="M-10 330 Q80 270 150 310 T380 250 L380 440 L-10 440Z" fill="#bfe3cf"/><path d="M-10 130 Q90 70 180 120 T380 80 L380 -10 L-10 -10Z" fill="#cfe8d9"/>';
    s+='<path d="M50 380 C110 340 90 270 170 260 S270 230 250 160 S300 100 320 70" fill="none" stroke="#14182b" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 24" opacity=".35"/><path d="M50 380 C110 340 90 270 170 260 S270 230 250 160 S300 100 320 70" fill="none" stroke="#2b50ff" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(d*520).toFixed(0)+' 600"/>';
    [[50,380,'#ffe14d','Day 1',0],[170,260,'#ff8a1f','Day 2',.45],[320,70,'#ff8a1f','Day 3',.95]].forEach(function(p){var pu=eb(clamp((d-p[4])*4,0,1));s+='<g transform="translate('+p[0]+' '+(p[1]-(1-pu)*40)+')" opacity="'+pu.toFixed(2)+'"><circle r="15" fill="'+p[2]+'" stroke="#14182b" stroke-width="4"/><text x="22" y="-18" font-family="FR" font-weight="700" font-size="24" fill="#14182b">'+p[3]+'</text></g>';});
    ms.innerHTML=s;
  }};}};
// ================= S6: parts bin -> compiler -> finished card =================
window.SCN[5]={eb:'// a bin of ready-made parts',h:[['Lego for'],[{t:'answers',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,t0=ctx.sc.start,tP=W('पुर्ज़ों'),tL=W('लाइब्रेरी'),tC=W('कंपाइलर'),tJ=W('जोड़ता');
  var bin=card(st,'','left:0;top:0;width:768px;height:236px;padding:22px 26px','<div class="mono" style="color:#2b50ff">parts library</div><div class="tiles" style="position:absolute;left:26px;top:70px;display:flex;gap:18px"></div>');
  var tiles=bin.querySelector('.tiles');
  var PT=[['Button','#ffe14d','<span style="display:block;width:70px;height:34px;border:4px solid #14182b;border-radius:999px;background:#2b50ff"></span>'],['Chart','#b9c7ff','<svg viewBox="0 0 70 50" width="70" height="50"><g stroke="#14182b" stroke-width="4"><rect x="4" y="26" width="14" height="22" fill="#ffe14d"/><rect x="26" y="10" width="14" height="38" fill="#ff8a1f"/><rect x="48" y="18" width="14" height="30" fill="#2b50ff"/></g></svg>'],['Map','#cfe8d9','<svg viewBox="0 0 70 50" width="70" height="50"><path d="M6 40 C20 10 30 44 46 20 S60 14 64 8" fill="none" stroke="#14182b" stroke-width="5" stroke-linecap="round"/><circle cx="6" cy="40" r="6" fill="#ffe14d" stroke="#14182b" stroke-width="3"/></svg>'],['Form','#ffcf9f','<span style="display:block;width:70px;height:30px;border:4px solid #14182b;border-radius:10px;background:#fff"></span>']];
  tiles.innerHTML=PT.map(function(p){return '<div class="tl" style="width:150px;height:130px;border:4px solid #14182b;border-radius:22px;background:'+p[1]+';box-shadow:5px 5px 0 #14182b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font:700 24px FR">'+p[2]+p[0]+'</div>';}).join('');
  var tl=[].slice.call(tiles.children);
  var comp=el('div','','','position:absolute;left:204px;top:262px;width:360px;height:250px');st.appendChild(comp);
  var out=card(st,'','left:0;top:536px;width:768px;height:268px;overflow:hidden;padding:0','<div class="rev" style="position:absolute;inset:0"><div style="position:absolute;left:0;top:0;right:0;height:64px;background:#2b50ff;border-bottom:4px solid #14182b;color:#f3f6ff;font:700 32px FR;padding:12px 26px 0">Your answer</div><div style="position:absolute;left:26px;top:84px;display:flex;gap:14px"><span class="btn cob" style="height:52px;font-size:24px">Open</span><span class="btn tan" style="height:52px;font-size:24px">Edit</span></div><svg viewBox="0 0 330 150" style="position:absolute;left:26px;top:128px;width:330px;height:130px"><g stroke="#14182b" stroke-width="4"><rect x="8" y="70" width="50" height="76" rx="9" fill="#ffe14d"/><rect x="74" y="30" width="50" height="116" rx="9" fill="#ff8a1f"/><rect x="140" y="52" width="50" height="94" rx="9" fill="#2b50ff"/><rect x="206" y="12" width="50" height="134" rx="9" fill="#ffe14d"/></g></svg><div style="position:absolute;left:400px;top:92px;width:340px;height:150px;border:4px solid #14182b;border-radius:20px;overflow:hidden"><svg viewBox="0 0 340 150" style="width:340px;height:150px"><rect width="340" height="150" fill="#dff0e6"/><path d="M20 120 C80 60 120 140 190 70 S290 40 320 20" fill="none" stroke="#2b50ff" stroke-width="7" stroke-linecap="round"/><circle cx="20" cy="120" r="10" fill="#ffe14d" stroke="#14182b" stroke-width="3"/><circle cx="320" cy="20" r="10" fill="#ff8a1f" stroke="#14182b" stroke-width="3"/></svg></div></div>');
  var rev=out.querySelector('.rev');var skO=skel(st,'left:0;top:536px;width:768px;height:268px','answer');var belt=el('div','ov','','position:absolute;left:0;top:300px;width:768px;height:120px;pointer-events:none');st.appendChild(belt);
  ctx.cursor=[[tP-t0+.2,640,200,6,0,-.4,.4,0],[tC-t0+.1,640,330,6,1,-.8,.2,0],[tJ-t0+.3,690,600,-6,0,0,.4,1],[7.2,690,600,-6,0,0,.4,0]];
  return {upd:function(t,lt){
    var pu=sm((t-tP+.15)/.4);tl.forEach(function(e,i){var u=en(e,t,t0+.1+i*.1,{dy:40,r:i%2?2:-2,d:.45});e.style.boxShadow='5px 5px 0 #14182b';});
    bin.style.boxShadow=(t>tL&&t<tL+.9?'0 0 0 8px rgba(255,225,77,.9),':'')+'8px 8px 0 #14182b';
    // compiler: funnel + two gears that spin with t
    var run=sm((t-tC+.1)/.3),sh=run*Math.sin(t*40)*2.5;
    var gear=function(cx,cy,r,ph,col){var s='<g transform="translate('+cx+' '+cy+') rotate('+ph.toFixed(1)+')"><circle r="'+r+'" fill="'+col+'" stroke="#14182b" stroke-width="5"/>';for(var k=0;k<8;k++)s+='<rect x="-9" y="'+(-r-14)+'" width="18" height="22" rx="4" fill="'+col+'" stroke="#14182b" stroke-width="4" transform="rotate('+(k*45)+')"/>';return s+'<circle r="'+(r*.35)+'" fill="#fff" stroke="#14182b" stroke-width="4"/></g>';};
    comp.innerHTML='<svg viewBox="0 0 360 250" style="width:360px;height:250px;overflow:visible" transform="translate('+sh+' 0)"><path d="M10 10 L350 10 L240 150 L240 236 L120 236 L120 150 Z" fill="#fff" stroke="#14182b" stroke-width="6" stroke-linejoin="round" style="filter:drop-shadow(6px 6px 0 #14182b)"/>'+gear(180,110,36,t*90*(run?1:.2),'#ffe14d')+gear(122,64,24,-t*135*(run?1:.2),'#ff8a1f')+gear(240,64,24,-t*135*(run?1:.2),'#b9c7ff')+'<text x="180" y="226" text-anchor="middle" font-family="DM" font-size="22" fill="#14182b" letter-spacing="2">COMPILER</text></svg>';
    en(comp,t,tL-.3,{dy:-30,d:.4,s0:.8});
    // pieces drop through the hopper into the answer card; the card reveals left->right as they land
    var N=4,prog=clamp((t-(tJ-1.25))/1.5,0,1);
    for(var i=0;i<N;i++){var pe=document.getElementById('pc'+i);if(!pe){pe=el('div','','','position:absolute;width:74px;height:56px;border:4px solid #14182b;border-radius:16px;box-shadow:4px 4px 0 #14182b');pe.id='pc'+i;st.appendChild(pe);}
      var u=(t-(tJ-1.4+i*.3))/.8;if(u<=0||u>=1){pe.style.display='none';continue;}pe.style.display='block';pe.style.background=PT[i][1];
      var x0=40+i*168+38,x1=384,x2=100+i*190,y0=130,y1=330,y2=640;var a=u<.5?sm(u/.5):1,b=u<.5?0:sm((u-.5)/.5);
      var x=u<.5?lerp(x0,x1,a):lerp(x1,x2,b),y=u<.5?lerp(y0,y1,a):lerp(y1,y2,b);pe.style.left=(x-37)+'px';pe.style.top=(y-28)+'px';pe.style.transform='rotate('+(Math.sin(u*9+i)*10).toFixed(1)+'deg) scale('+(1-.25*(u>.5?b:0)).toFixed(2)+')';pe.innerHTML=PT[i][2].replace(/width="70" height="50"/,'width="52" height="36"');}
    shimmer(skO,t);var vo=sm((t-(tJ-1.45))/.25);skO.style.opacity=(1-vo).toFixed(2);skO.style.visibility=vo>=1?'hidden':'visible';out.style.opacity=vo.toFixed(2);out.style.visibility=vo>0?'visible':'hidden';
    var bs='';for(var q=0;q<6;q++){var ph=((t*60+q*38)%228);bs+='<path d="M'+(ph)+' 54 l14 -14 v28 z" fill="#2b50ff" stroke="#14182b" stroke-width="3" opacity="'+(.25+.75*sm(ph/228)).toFixed(2)+'"/><path d="M'+(768-ph)+' 54 l-14 -14 v28 z" fill="#ff8a1f" stroke="#14182b" stroke-width="3" opacity="'+(.25+.75*sm(ph/228)).toFixed(2)+'"/>';}belt.innerHTML='<svg viewBox="0 0 768 120" style="width:768px;height:120px;overflow:hidden">'+bs+'</svg>';belt.style.opacity=sm((t-tP)/.4).toFixed(2);
    rev.style.clipPath='inset(0 '+((1-prog)*100).toFixed(1)+'% 0 0)';
  }};}};
})();
