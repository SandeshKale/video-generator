// Scenes 1-3. Stage-local coordinates (768 x 818). Everything is a pure function of t.
(function(){
'use strict';
var K=window.K,clamp=K.clamp,lerp=K.lerp,sm=K.sm,eb=K.eb,el=K.el,en=K.en;
window.SCN=window.SCN||[];
function ST(sty,html){return el('div','',html,sty);}
function card(st,cls,sty,html){var c=el('div','card '+(cls||''),html||'',sty);st.appendChild(c);return c;}
function bars(n,vals,w){var s='<svg viewBox="0 0 420 200" style="position:absolute;left:24px;top:62px;width:420px;height:200px"><g stroke="#14182b" stroke-width="4">',cols=['#ffe14d','#2b50ff','#ff8a1f','#2b50ff','#ffe14d'];
  for(var i=0;i<n;i++){var h=vals[i];s+='<rect x="'+(10+i*82)+'" y="'+(190-h)+'" width="58" height="'+h+'" rx="10" fill="'+cols[i%5]+'"/>';}return s+'</g></svg>';}
function toggle(on,col){return '<span style="display:inline-block;width:86px;height:46px;border:4px solid #14182b;border-radius:999px;background:'+(on>.5?col:'#f4f7ff')+';position:relative;vertical-align:middle"><i style="position:absolute;top:3px;left:'+(3+on*40)+'px;width:32px;height:32px;border:4px solid #14182b;border-radius:50%;background:#ffe14d"></i></span>';}
// ================= S1: the old chat box is gone =================
window.SCN[0]={eb:'// the old chat box',h:[['Chat box.'],[{t:'Gone.',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,tNo=W('नहीं');st.dataset.collage=1;
  var wall=card(st,'','left:14px;top:30px;width:420px;height:580px;background:#f3f6ff;border-color:#8b95b8;box-shadow:8px 8px 0 #8b95b8;overflow:hidden;transform-origin:30% 100%',
    '<div class="mono" style="position:absolute;left:28px;top:20px;color:#8b95b8">you</div>'+[70,104,138,204,238,272,306,372,406,440,474].map(function(y,i){return '<div class="txt" style="left:28px;right:'+[90,28,140,28,50,28,170,28,80,28,210][i]+'px;top:'+y+'px"></div>';}).join('')+
    '<div style="position:absolute;right:-30px;top:-14px;width:150px;height:150px;background:linear-gradient(225deg,#eaf1ff 50%,#d0d8ef 50%);border-bottom-left-radius:26px;box-shadow:-6px 6px 0 rgba(20,24,43,.15)"></div>');
  var chart=card(st,'','left:292px;top:0;width:476px;height:300px;padding:0','<div class="mono" style="position:absolute;left:26px;top:20px;color:#2b50ff">live chart</div><div class="bars"></div>');
  var calc=card(st,'','left:262px;top:340px;width:262px;height:300px;padding:22px','<div class="mono" style="color:#ff8a1f">calculator</div><div class="dsp dv" style="margin-top:12px;height:58px;border:4px solid #14182b;border-radius:14px;background:#f4f7ff;font:700 38px FR;text-align:right;padding:6px 14px">42.5</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px">'+['#ffe14d','#fff','#fff','#ff8a1f','#fff','#fff','#fff','#ff8a1f'].map(function(c){return '<i style="height:42px;border:4px solid #14182b;border-radius:12px;background:'+c+'"></i>';}).join('')+'</div>');
  var sl=card(st,'','left:522px;top:350px;width:246px;height:176px;padding:22px','<div class="mono" style="color:#2b50ff">visuals</div><div class="trk" style="margin-top:36px"><div class="f" style="background:#2b50ff"></div><div class="k"></div></div>');
  var btns=ST('left:0;top:640px;display:flex;gap:16px','<span class="btn cob">Tap me</span><span class="btn tan">Edit graph</span><span class="btn lem">Split bill</span>');st.appendChild(btns);
  var tg=ST('left:0;top:728px;width:768px;display:flex;gap:26px;align-items:center;font:700 26px FR','');st.appendChild(tg);
  var f=sl.querySelector('.f'),k=sl.querySelector('.k'),dsp=calc.querySelector('.dsp'),bh=chart.querySelector('.bars');
  var tags=['Dark','Alerts','Visuals'];
  ctx.cursor=[[.0,150,330,-14,0,.6,.4,0],[.9,175,300,-14,1,.7,.2,1],[1.5,215,240,-20,0,.6,.1,0],[2.1,330,210,-10,0,.8,.3,1],[2.8,330,210,-10,0,0,0,0]];
  return {upd:function(t,lt){
    var u=sm((t-tNo+.1)/.5);wall.style.transform='rotate('+(-4-u*16+Math.sin(t*18)*(u<1&&u>0?2:0)).toFixed(1)+'deg) translate('+(-u*110).toFixed(1)+'px,'+(u*70).toFixed(1)+'px)';wall.style.opacity=(1-u*.85).toFixed(2);
    chart.style.transform='rotate(3deg)';calc.style.transform='rotate(-3deg)';sl.style.transform='rotate(4deg)';
    var v=[0,1,2,3,4].map(function(i){return 70+80*(.55+.45*Math.sin(t*3+i*1.3));});bh.innerHTML=bars(5,v);
    dsp.textContent=['42.5','1,280','7.9k','365','98.6'][Math.floor(t*2.2)%5];
    var kv=.2+.55*(.5+.5*Math.sin(t*1.7));f.style.width=(kv*190)+'px';k.style.left=(kv*190)+'px';
    btns.children[0].style.transform='translateY('+(-Math.max(0,Math.sin(t*5))*8).toFixed(1)+'px)';btns.children[1].style.transform='translateY('+(-Math.max(0,Math.sin(t*5-1.1))*8).toFixed(1)+'px)';btns.children[2].style.transform='translateY('+(-Math.max(0,Math.sin(t*5-2.2))*8).toFixed(1)+'px)';
    tg.innerHTML=tags.map(function(n,i){return '<span style="display:inline-flex;gap:12px;align-items:center">'+toggle(sm(Math.sin(t*1.3+i*2.1)*2),['#2b50ff','#ff8a1f','#ffe14d'][i])+n+'</span>';}).join('');
  }};}};
// ================= S2: a diagram you can poke =================
window.SCN[1]={eb:'// one question, one wing',h:[['A diagram'],['you can',{t:'poke',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,tWing=W('पंख'),tPar=W('पैराग्राफ़'),tDia=W('डायग्राम'),tTouch=W('छू');
  var q=ST('left:0;top:0;width:768px;height:92px;border:4px solid #14182b;border-radius:30px;background:#2b50ff;color:#f3f6ff;box-shadow:6px 6px 0 #14182b;font:700 40px FR;display:flex;align-items:center;padding:0 28px','How does a wing make lift?');st.appendChild(q);
  var dg=card(st,'','left:0;top:116px;width:768px;height:448px;overflow:hidden','<div class="mono" style="position:absolute;left:28px;top:20px;color:#2b50ff">how a wing makes lift</div><svg class="sv" viewBox="0 0 740 400" style="position:absolute;left:14px;top:50px;width:740px;height:400px;overflow:hidden"></svg>');
  var sv=dg.querySelector('.sv');
  var par=card(st,'ov','left:60px;top:230px;width:648px;height:250px;background:#f3f6ff;border-color:#8b95b8;box-shadow:8px 8px 0 #8b95b8;padding:24px','<div class="mono" style="color:#8b95b8">paragraph</div>'+[54,88,122,156,190].map(function(y,i){return '<div class="txt" style="left:24px;right:'+[40,24,90,24,200][i]+'px;top:'+y+'px"></div>';}).join('')+'<div class="x" style="position:absolute;left:0;top:0;right:0;bottom:0;opacity:0"><svg viewBox="0 0 648 250" style="position:absolute;inset:0"><path d="M24 30 L624 220 M624 30 L24 220" stroke="#ff3b3b" stroke-width="14" stroke-linecap="round"/></svg></div>');
  var row=ST('left:0;top:588px;display:flex;gap:16px;align-items:center','<span class="btn cob b1">Show pressure</span><span class="btn lem b2">Add arrows</span>');st.appendChild(row);
  var sl=card(st,'','left:0;top:676px;width:768px;height:130px;padding:20px 28px','<div class="mono" style="color:#ff8a1f">tilt the wing</div><div class="trk" style="margin-top:22px"><div class="f" style="background:#ff8a1f"></div><div class="k"></div></div>');
  var f=sl.querySelector('.f'),k=sl.querySelector('.k');
  ctx.cursor=[[tPar-ctx.sc.start-.2,560,40,10,0,0,1,0],[tDia-ctx.sc.start+.05,150,640,-6,1,0,0,0],[tDia-ctx.sc.start+.3,150,640,-6,1,0,0,1],[tTouch-ctx.sc.start-.7,430,730,-4,0,.3,0,0],[tTouch-ctx.sc.start-.2,330,730,4,2,.3,0,1],[tTouch-ctx.sc.start+.9,500,730,6,0,.6,0,0],[9.2,500,730,6,0,.6,0,0]];
  function draw(t,th){var cA=36+th*1.2,top=function(y,c){return 'M20 '+y+' C180 '+(y-10)+' 300 '+(y-c)+' 700 '+(y+c*.45)},bot=function(y,c){return 'M20 '+y+' C200 '+(y+20)+' 320 '+(y+c)+' 700 '+(y+c*.6)};
    var dash=-t*140%100,s='<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#2b50ff"/></marker><marker id="ao" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#ff8a1f"/></marker></defs>';
    s+='<g stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="26 18" stroke-dashoffset="'+dash.toFixed(1)+'"><g stroke="#2b50ff" marker-end="url(#ar)"><path d="'+top(110,cA)+'"/><path d="'+top(146,cA*.8)+'"/><path d="'+top(70,cA*1.1)+'"/></g><g stroke="#ff8a1f" marker-end="url(#ao)"><path d="'+bot(250,40+th)+'"/><path d="'+bot(296,46+th)+'"/></g></g>';
    return s;}
  return {upd:function(t,lt){en(q,t,ctx.sc.start+.05,{dy:-30,d:.5});
    var uW=sm((t-tWing+.1)/.7);en(dg,t,ctx.sc.start+.25,{dy:40,d:.5,s0:.9});
    var th=K.kf([[0,5],[tTouch-.7,5],[tTouch+.9,15],[99,13]],lt-0+0);th=K.kf([[0,5],[tTouch-ctx.sc.start-.7,5],[tTouch-ctx.sc.start+.9,15],[99,13]],lt);
    var g='<g transform="rotate('+(-th).toFixed(1)+' 360 190)" style="opacity:'+uW.toFixed(2)+'"><path d="M90 190 C160 100 400 96 650 184 C400 220 200 270 90 190 Z" fill="#ffe14d" stroke="#14182b" stroke-width="6" stroke-linejoin="round"/><circle cx="300" cy="176" r="14" fill="#fff" stroke="#14182b" stroke-width="5"/></g>';
    var tagsOn=sm((t-tDia)/.35),tg='<g style="opacity:'+tagsOn.toFixed(2)+'" transform="translate(0 '+((1-tagsOn)*-14).toFixed(1)+')"><rect x="330" y="26" width="206" height="46" rx="23" fill="#2b50ff" stroke="#14182b" stroke-width="4"/><text x="433" y="58" text-anchor="middle" font-family="FR" font-weight="700" font-size="24" fill="#f3f6ff">LOW PRESSURE</text><rect x="360" y="330" width="216" height="46" rx="23" fill="#ff8a1f" stroke="#14182b" stroke-width="4"/><text x="468" y="362" text-anchor="middle" font-family="FR" font-weight="700" font-size="24" fill="#14182b">HIGH PRESSURE</text></g>';
    sv.innerHTML=draw(t,th)+g+tg;
    // paragraph: appears, gets crossed out, falls away
    var pu=en(par,t,tPar-.15,{dy:40,r:-2,d:.35}),xu=sm((t-tPar-.4)/.25),fall=sm((t-tPar-1.0)/.5);par.querySelector('.x').style.opacity=xu;if(t>tPar-.15){par.style.transform='rotate('+(-2+fall*8)+'deg) translateY('+(fall*420).toFixed(0)+'px)';par.style.opacity=(1-fall).toFixed(2);}
    en(row,t,ctx.sc.start+.6,{dy:30,d:.4});row.children[0].style.transform='scale('+(1+.08*Math.max(0,Math.sin((t-tDia)*9))*(t>tDia&&t<tDia+.5?1:0)).toFixed(3)+')';
    en(sl,t,ctx.sc.start+.85,{dy:40,d:.45});var kv=th/20;f.style.width=(kv*600)+'px';k.style.left=(kv*600)+'px';
  }};}};
// ================= S3: Intelligent UI (a chat bubble unfolds into an interface) =================
window.SCN[2]={eb:'// wednesday, with GPT-6',h:[['Intelligent'],[{t:'UI',hl:1}]],build:function(ctx){
  var st=ctx.st,W=ctx.W,tI=W('Intelligent'),tWed=W('बुधवार'),tG=W('GPT-6'),t0=ctx.sc.start;
  var c=card(st,'','left:8px;top:0;width:752px;height:560px;overflow:hidden;transform-origin:50% 0');
  c.innerHTML='<div class="ghost" style="position:absolute;left:34px;top:34px;right:34px"><div class="mono" style="color:#8b95b8">chatgpt</div>'+[54,90,126,162,198].map(function(y,i){return '<div class="txt" style="left:0;right:'+[40,0,120,0,220][i]+'px;top:'+y+'px"></div>';}).join('')+'</div>'+
   '<div class="ui" style="position:absolute;left:0;top:0;right:0;bottom:0"><div class="hd" style="position:absolute;left:0;top:0;right:0;height:84px;background:#2b50ff;border-bottom:4px solid #14182b;color:#f3f6ff;font:700 40px FR;padding:20px 34px">Intelligent UI</div>'+
   '<div class="b1" style="position:absolute;left:34px;top:112px;display:flex;gap:16px"><span class="btn cob">Compare</span><span class="btn tan">Explain</span><span class="btn lem">Edit graph</span></div>'+
   '<div class="ch" style="position:absolute;left:34px;top:206px;width:420px;height:320px"></div>'+
   '<div class="rg" style="position:absolute;left:490px;top:206px;width:244px"><div class="mono" style="color:#2b50ff">detail</div><div class="trk" style="margin-top:30px"><div class="f" style="background:#2b50ff"></div><div class="k"></div></div><div style="margin-top:46px;font:700 30px FR">'+toggle(1,'#ff8a1f')+'</div><div style="margin-top:22px;font:700 30px FR">'+toggle(0,'#2b50ff')+'</div></div></div>';
  var gh=c.querySelector('.ghost'),ui=c.querySelector('.ui'),ch=c.querySelector('.ch'),b1=c.querySelector('.b1'),hd=c.querySelector('.hd'),rg=c.querySelector('.rg'),f=c.querySelector('.f'),k=c.querySelector('.k');
  var cal=card(st,'','left:30px;top:608px;width:300px;height:196px;transform-origin:50% 100%','<div style="height:56px;background:#ff8a1f;border-bottom:4px solid #14182b;border-radius:24px 24px 0 0;font:700 30px FR;padding:10px 24px;letter-spacing:.08em">WED</div><div style="font:700 92px/1 FR;text-align:center;margin-top:10px">7 <span style="font-size:40px">OCT</span></div>');
  var g6=ST('left:376px;top:620px;width:350px;height:170px;border:4px solid #14182b;border-radius:34px;background:#ffe14d;box-shadow:8px 8px 0 #14182b;display:flex;align-items:center;justify-content:center;font:700 110px FR;letter-spacing:-.02em','GPT-6');st.appendChild(g6);
  var skC=K.skel(st,'left:30px;top:608px;width:300px;height:196px','date'),skG=K.skel(st,'left:376px;top:620px;width:350px;height:170px','model');
  ctx.cursor=[[tI-t0+.2,520,360,-8,0,-.4,.3,0],[tI-t0+.9,300,200,-10,1,.3,.3,1],[tI-t0+1.5,260,160,-10,0,.2,.2,0],[tWed-t0-.2,230,540,-6,0,0,.6,0],[tWed-t0+.1,205,640,-8,1,0,.4,1],[tG-t0+.2,700,690,6,0,0,.3,0],[5.4,700,690,6,0,0,.3,0]];
  return {upd:function(t,lt){
    var m=sm((t-tI+.15)/.7);gh.style.opacity=(1-sm((t-tI+.15)/.35)).toFixed(2);ui.style.opacity=sm((t-tI+.1)/.4).toFixed(2);
    c.style.borderColor=m>.4?'#14182b':'#8b95b8';c.style.boxShadow=(m*8)+'px '+(m*8)+'px 0 '+(m>.4?'#14182b':'#8b95b8');c.style.background=m>.4?'#fff':'#f3f6ff';
    c.style.transform='scale('+(1+.012*Math.sin(m*Math.PI)).toFixed(3)+') rotate('+((1-m)*-1.5)+'deg)';
    var b1u=sm((t-tI-.25)/.3);b1.style.opacity=b1u;b1.style.transform='translateY('+((1-b1u)*18)+'px)';
    var chu=sm((t-tI-.5)/.4);ch.style.opacity=chu;ch.innerHTML='<div class="mono" style="color:#ff8a1f">compare</div><svg viewBox="0 0 420 260" style="position:absolute;left:0;top:34px;width:420px;height:260px"><g stroke="#14182b" stroke-width="4">'+[0,1,2,3].map(function(i){var h=(70+i*46+14*Math.sin(t*2.4+i))*chu;return '<rect x="'+(14+i*100)+'" y="'+(240-h)+'" width="72" height="'+h+'" rx="12" fill="'+['#ffe14d','#2b50ff','#ff8a1f','#2b50ff'][i]+'"/>';}).join('')+'</g></svg>';
    var rgu=sm((t-tI-.7)/.4);rg.style.opacity=rgu;var kv=.25+.5*(.5+.5*Math.sin(t*1.6));f.style.width=(kv*190)+'px';k.style.left=(kv*190)+'px';
    K.shimmer(skC,t);K.shimmer(skG,t);K.stat(skC,cal,t,tWed,{dy:60,r:-5,rf:-12,d:.5,s0:.5});K.stat(skG,g6,t,tG,{dy:60,r:3,rf:10,d:.5,s0:.4});
  }};}};
})();
