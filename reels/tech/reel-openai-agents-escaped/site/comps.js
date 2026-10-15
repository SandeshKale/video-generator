// "Incident File" components — pure functions of absolute time t.
(function(){
'use strict';
var U=window.U, clamp=U.clamp, lerp=U.lerp, sm=U.sm;
function eo(x){x=clamp(x,0,1);return x>=1?1:1-Math.pow(2,-10*x);}
function eb(x){x=clamp(x,0,1);var c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function el(tag,cls,html,st){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;if(st)e.style.cssText=st;return e;}
function pad(n){return (n<10?'0':'')+n;}
function fmt(v,d){var s=Number(v).toFixed(d||0);return s.replace(/\B(?=(\d{3})+(?!\d))/g,',');}
var Y='#ffd400',R='#ff3b2f',CR='#f2eee3';

function wrapFx(L,t){
  var u=t-L.t0,k=L.fx||'slam',a=1,tr='',ex=clamp((L.t1-t)/.2,0,1);
  if(k==='slam'){var p=eo(u/.26);a=clamp(u/.08,0,1);tr='scale('+lerp(1.5,1,p)+') rotate('+lerp(L.rot0||0,L.rot||0,p)+'deg)';}
  else if(k==='stamp'){var q=eb(u/.3);a=clamp(u/.05,0,1);tr='scale('+lerp(2.4,1,q)+') rotate('+lerp((L.rot||0)-14,(L.rot||0),q)+'deg)';}
  else if(k==='rise'){var r=eo(u/.4);a=clamp(u/.12,0,1);tr='translateY('+lerp(80,0,r)+'px)';}
  else if(k==='left'){var l=eo(u/.4);a=clamp(u/.1,0,1);tr='translateX('+lerp(-260,0,l)+'px) rotate('+lerp(-4,L.rot||0,l)+'deg)';}
  else if(k==='right'){var rr=eo(u/.4);a=clamp(u/.1,0,1);tr='translateX('+lerp(260,0,rr)+'px) rotate('+lerp(4,L.rot||0,rr)+'deg)';}
  else{a=clamp(u/.18,0,1);if(L.rot)tr='rotate('+L.rot+'deg)';}
  a*=ex;L.wrap.style.opacity=a;L.wrap.style.transform=tr;
}
var T={};

// camera-style HUD: brackets, rec dot, cam label, running timecode
T.hud=function(L,P){
  var w=L.inner;w.style.cssText='position:absolute;left:0;top:0;width:1080px;height:1920px';
  ['tl','tr','bl','br'].forEach(function(c){var b=el('div','',null,'position:absolute;width:70px;height:70px;border:5px solid '+Y+';opacity:.9;'+
    (c[0]==='t'?'top:150px;':'bottom:400px;')+(c[1]==='l'?'left:70px;border-right:0;':'right:70px;border-left:0;')+(c[0]==='t'?'border-bottom:0;':'border-top:0;'));w.appendChild(b);});
  var rec=el('div','',null,'position:absolute;left:150px;top:182px;width:20px;height:20px;border-radius:50%;background:'+R+';box-shadow:0 0 14px '+R);w.appendChild(rec);
  w.appendChild(el('div','mono',P.cam,'position:absolute;left:184px;top:174px;font-size:26px;letter-spacing:.12em;color:'+Y));
  var tc=el('div','mono','','position:absolute;right:170px;top:174px;font-size:26px;color:#f2eee3;opacity:.85');w.appendChild(tc);
  return function(t){var u=t-L.t0,s=(P.h*3600+P.m*60+P.s)+Math.floor(u);rec.style.opacity=(Math.floor(u*2)%2)?.25:1;
    tc.textContent=P.mon+' · '+pad(Math.floor(s/3600)%24)+':'+pad(Math.floor(s/60)%60)+':'+pad(s%60);};
};
// stacked display lines; each {txt,color,tape,size,t}
T.title=function(L,P){
  var lines=P.lines.map(function(ln){
    var d=el('div','disp','','font-size:'+(ln.size||200)+'px;margin-top:'+(ln.mt||0)+'px;color:'+(ln.color||CR)+';text-shadow:0 8px 40px rgba(0,0,0,.8);text-align:'+(P.align||'left'));
    var inner=ln.tape?el('span','tape','','background:'+ln.tape+';color:'+(ln.fg||'#fff7ee')+';display:inline-block'):d;
    if(ln.tape){d.appendChild(inner);}
    inner.innerHTML=ln.txt;L.inner.appendChild(d);return {d:d,ln:ln,inner:inner};});
  return function(t){lines.forEach(function(o){var t0=o.ln.t!=null?o.ln.t:L.t0;var u=t-t0,p=eo(u/.26);
    o.d.style.opacity=clamp(u/.06,0,1);o.d.style.transform='scale('+lerp(1.35,1,p)+') translateY('+lerp(40,0,p)+'px)';
    if(o.ln.tape)o.inner.style.transform='rotate('+(o.ln.rot||-1.6)+'deg)';});};
};
// typed terminal log: lines [{h:html, t}]
T.log=function(L,P){
  var b=el('div','mono','','font-size:30px;line-height:1.7;color:#d9d4c4;background:rgba(10,8,7,.74);border-left:8px solid '+Y+';padding:24px 32px;');
  var rows=P.lines.map(function(ln){var r=el('div','','','white-space:pre');b.appendChild(r);return {r:r,ln:ln,plain:ln.h.replace(/<[^>]+>/g,'').length};});
  L.inner.appendChild(b);
  function sub(h,n){var out='',cnt=0,i=0;while(i<h.length&&cnt<n){if(h[i]==='<'){var j=h.indexOf('>',i);out+=h.slice(i,j+1);i=j+1;}else{out+=h[i];i++;cnt++;}}
    var open=[];(out.match(/<[^>]+>/g)||[]).forEach(function(tg){if(tg[1]==='/')open.pop();else open.push(tg);});for(var k=open.length;k>0;k--)out+='</span>';return out;}
  return function(t){var last=-1;rows.forEach(function(o,i){var u=t-o.ln.t;if(u>=0)last=i;
    var n=Math.floor(clamp(u/.5,0,1)*o.plain);o.r.innerHTML=u<0?'':sub(o.ln.h,n);});
    rows.forEach(function(o,i){if(i===last&&Math.floor(t*2.5)%2===0)o.r.innerHTML+='<span class="y">▌</span>';});};
};
// big counting number: {pre,val,suf,size,color,from,count,label,labelColor}
T.count=function(L,P){
  var wrap=el('div','','','');if(P.label)wrap.appendChild(el('div','mono',P.label,'font-size:'+(P.ls||26)+'px;letter-spacing:.14em;color:#b9b3a2;margin-bottom:6px'));
  var n=el('div','disp','','font-size:'+(P.size||300)+'px;line-height:.82;color:'+(P.color||Y)+';text-shadow:0 10px 50px rgba(0,0,0,.8);white-space:nowrap');wrap.appendChild(n);
  if(P.sub)wrap.appendChild(el('div','disp',P.sub,'font-size:'+(P.subsize||76)+'px;color:'+CR+';margin-top:8px;text-shadow:0 6px 30px rgba(0,0,0,.8)'));
  L.inner.appendChild(wrap);
  return function(t){var q=eo((t-L.t0-.03)/(P.count||.8));n.textContent=(P.pre||'')+fmt(lerp(P.from||0,P.val,q),P.dec)+(P.suf||'');};
};
// tape labels (yellow masking-tape chips) with pop timing
T.tapes=function(L,P){
  var w=el('div','','','display:flex;flex-wrap:wrap;gap:'+(P.gap||18)+'px;align-items:center');
  var cs=P.items.map(function(it,i){var c=el('span','tape disp',it.txt,'font-size:'+(P.size||54)+'px;background:'+(it.bg||Y)+';color:'+(it.fg||'#0d0c0b')+';line-height:1;padding:10px 24px 6px');w.appendChild(c);return {c:c,it:it,i:i};});
  L.inner.appendChild(w);
  return function(t){cs.forEach(function(o){var t0=o.it.t!=null?o.it.t:L.t0+.1*o.i,p=eb((t-t0)/.3);o.c.style.opacity=clamp((t-t0)/.05,0,1);o.c.style.transform='scale('+lerp(.4,1,p)+') rotate('+((o.i%2?1.4:-1.6)*(1-clamp((t-t0)/.3,0,1)*0+0))+'deg)';});};
};
// 55 (or n) dots lighting in sequence
T.dots=function(L,P){
  var cols=P.cols||11,s=P.s||52,g=P.g||12;
  var b=el('div','','','background:rgba(10,8,7,.74);padding:24px 28px;border:2px solid #4a463d;');
  var grid=el('div','','','display:grid;grid-template-columns:repeat('+cols+','+s+'px);gap:'+g+'px');
  var ds=[];for(var i=0;i<P.n;i++){var d=el('i','','','display:block;width:'+s+'px;height:'+s+'px;border-radius:50%;background:#3a3732');grid.appendChild(d);ds.push(d);}
  b.appendChild(grid);L.inner.appendChild(b);
  return function(t){ds.forEach(function(d,i){var t0=L.t0+(P.delay||.1)+i*(P.step||.03),on=t>=t0,p=clamp((t-t0)/.15,0,1);
    d.style.background=on?R:'#3a3732';d.style.boxShadow=on?'0 0 '+(18*(1-p)+10)+'px '+R:'none';d.style.transform='scale('+(on?lerp(1.5,1,p):1)+')';});};
};
// test sandbox swarm: dots fill a fenced box, then a share escapes to a target node
T.swarm=function(L,P){
  var W=780,H=P.h||420,box=el('div','','','position:relative;width:'+W+'px;height:'+(H+190)+'px');
  var fence=el('div','','','position:absolute;left:0;top:0;width:'+W+'px;height:'+H+'px;border:5px dashed '+Y+';background:rgba(10,8,7,.55)');box.appendChild(fence);
  box.appendChild(el('div','mono','TEST SANDBOX','position:absolute;left:18px;top:-40px;font-size:24px;letter-spacing:.14em;color:'+Y));
  var node=el('div','tape disp','HUGGING FACE','position:absolute;left:'+(W-420)+'px;top:'+(H+70)+'px;font-size:60px;background:'+CR+';line-height:1;padding:12px 28px 8px;');box.appendChild(node);
  var cols=14,rows=8,ds=[];
  for(var i=0;i<cols*rows;i++){var cx=(i%cols),cy=Math.floor(i/cols);var x=34+cx*((W-68)/(cols-1)),y=34+cy*((H-68)/(rows-1));
    var d=el('i','','','position:absolute;display:block;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:'+Y+';box-shadow:0 0 12px '+Y);box.appendChild(d);
    var esc=((i*37)%100)<42; ds.push({d:d,x:x,y:y,esc:esc,k:i});}
  L.inner.appendChild(box);
  return function(t){var tf=P.tFill,te=P.tEsc;
    fence.style.borderColor=t>=te?R:Y;fence.style.boxShadow=t>=te?'0 0 40px '+R+'88':'none';
    node.style.boxShadow=t>=te+.5?'0 0 50px '+R:'none';
    ds.forEach(function(o){var t0=tf+(o.k/ds.length)*P.fillDur,p=eb((t-t0)/.25),x=o.x,y=o.y,col=Y,a=clamp((t-t0)/.05,0,1);
      if(o.esc&&t>=te){var u=clamp((t-te-(o.k%14)*.035)/.7,0,1),e=u*u*(3-2*u),tx=W-280+(o.k%7)*26,ty=H+110;
        var cxm=x+(tx-x)*.2,cym=y-40;var m=1-e;x=m*m*x+2*m*e*cxm+e*e*tx;y=m*m*y+2*m*e*cym+e*e*ty;col=R;a*=1-clamp((u-.9)*10,0,1)*.0;}
      o.d.style.left=x+'px';o.d.style.top=y+'px';o.d.style.opacity=a;o.d.style.transform='scale('+lerp(.2,1,p)+')';o.d.style.background=col;o.d.style.boxShadow='0 0 12px '+col;});};
};
// DNS leak diagram: agent box -> (barrier) -> outside chatbot with packets
T.dns=function(L,P){
  var W=780,H=420,b=el('div','','','position:relative;width:'+W+'px;height:'+H+'px');
  function box(txt,x,c){return el('div','disp',txt,'position:absolute;left:'+x+'px;top:60px;width:250px;height:150px;border:5px solid '+c+';background:rgba(10,8,7,.7);display:flex;align-items:center;justify-content:center;text-align:center;font-size:48px;color:'+c+';line-height:.95;padding:8px');}
  b.appendChild(box('Research agent',0,Y));b.appendChild(box('Outside chatbot',W-250,R));
  var wall=el('div','','','position:absolute;left:'+(W/2-8)+'px;top:20px;width:16px;height:230px;background:repeating-linear-gradient(180deg,'+R+' 0 18px,#0d0c0b 18px 30px)');b.appendChild(wall);
  var gap=el('div','mono','ISOLATED','position:absolute;left:'+(W/2-90)+'px;top:268px;width:180px;text-align:center;font-size:24px;letter-spacing:.14em;color:'+R);b.appendChild(gap);
  var line=el('div','','','position:absolute;left:250px;top:134px;width:'+(W-500)+'px;height:0;border-top:4px dashed '+Y+';opacity:.6');b.appendChild(line);
  var pk=[];for(var i=0;i<5;i++){var p=el('div','mono','DNS','position:absolute;top:112px;padding:3px 10px;background:'+Y+';color:#0d0c0b;font-size:22px;border-radius:4px');b.appendChild(p);pk.push(p);}
  b.appendChild(el('div','mono','> port 53 open','position:absolute;left:0;top:340px;font-size:28px;color:#d9d4c4'));
  L.inner.appendChild(b);
  return function(t){var u=t-L.t0;wall.style.opacity=.9;wall.style.height=(230*eo(u/.4))+'px';
    pk.forEach(function(p,i){var f=((u*0.9+i/5)%1);p.style.left=(250+f*(W-500)-24)+'px';p.style.opacity=u>.5?Math.sin(f*Math.PI):0;});};
};
// stopwatch ring that runs to N minutes
T.ring=function(L,P){
  var S=P.size||520,r=S/2-26,cf=2*Math.PI*r,b=el('div','','','position:relative;width:'+S+'px;height:'+S+'px');
  b.innerHTML='<svg width="'+S+'" height="'+S+'" style="transform:rotate(-90deg)"><circle cx="'+S/2+'" cy="'+S/2+'" r="'+r+'" fill="rgba(10,8,7,.7)" stroke="#3a3732" stroke-width="28"/><circle class="rg" cx="'+S/2+'" cy="'+S/2+'" r="'+r+'" fill="none" stroke="'+Y+'" stroke-width="28" stroke-dasharray="'+cf+'" stroke-dashoffset="'+cf+'"/></svg>';
  var n=el('div','disp','','position:absolute;left:0;right:0;top:'+(S/2-120)+'px;text-align:center;font-size:230px;line-height:1;color:'+CR);b.appendChild(n);
  b.appendChild(el('div','mono',P.unit||'MIN',"position:absolute;left:0;right:0;top:"+(S/2+80)+"px;text-align:center;font-size:34px;letter-spacing:.2em;color:"+Y));
  L.inner.appendChild(b);var rg=b.querySelector('.rg');
  return function(t){var p=eo((t-L.t0)/(P.dur||1.2));rg.setAttribute('stroke-dashoffset',cf*(1-p));n.textContent=Math.round(p*P.val);rg.setAttribute('stroke',p>.98?R:Y);};
};
// log scanner: progress bar + scrolling hex rows
T.scanner=function(L,P){
  var b=el('div','','','width:780px;background:rgba(10,8,7,.8);border:2px solid #4a463d;padding:24px 28px;');
  b.appendChild(el('div','mono',P.title,'font-size:26px;letter-spacing:.14em;color:'+Y+';margin-bottom:14px'));
  var feed=el('div','mono','','height:170px;overflow:hidden;font-size:24px;line-height:1.5;color:#8a8576;position:relative;white-space:nowrap');b.appendChild(feed);
  var rows=[];for(var i=0;i<7;i++){var r=el('div','','');feed.appendChild(r);rows.push(r);}
  var bar=el('div','','','margin-top:18px;height:34px;background:#2a2723;position:relative');var fill=el('div','','','position:absolute;left:0;top:0;bottom:0;background:repeating-linear-gradient(90deg,'+Y+' 0 22px,#c9a700 22px 26px)');bar.appendChild(fill);b.appendChild(bar);
  var val=el('div','disp','','font-size:80px;color:'+CR+';margin-top:10px;line-height:1');b.appendChild(val);
  L.inner.appendChild(b);
  var H='0123456789abcdef';
  function line(k){var s='';var x=k*2654435761>>>0;for(var j=0;j<28;j++){x=(x*1103515245+12345)>>>0;s+=H[(x>>>16)&15];if(j%4===3)s+=' ';}
    return '0x'+(k*4096+0x7f000).toString(16)+'  '+s+(k%7===0?' <span style="color:'+R+'">AGENT</span>':'');}
  return function(t){var u=t-L.t0,sc=Math.floor(u*14);rows.forEach(function(r,i){r.innerHTML=line(sc+i);});
    var p=clamp(u/(P.dur||2),0,1);fill.style.width=(p*100)+'%';val.textContent=Math.round(p*P.val)+' '+P.unit;};
};
// quote with per-word reveal; words array [{w,s}] injected by build
T.wordquote=function(L,P){
  var tpe=null;var b=el('div','','','border-left:12px solid '+R+';padding:6px 0 6px 40px');
  var q=el('div','disp','','font-size:'+(P.size||132)+'px;line-height:.95;color:'+CR+';text-shadow:0 8px 40px rgba(0,0,0,.85)');b.appendChild(q);
  var ws=P.words.map(function(w){var s=el('span','',w.w+' ','display:inline-block;margin-right:.18em;opacity:0');q.appendChild(s);return {s:s,t:w.s};});
  if(P.who){var tp=el('div','','','margin-top:30px;opacity:0');tpe=tp;tp.appendChild(el('span','tape mono',P.who,'font-size:26px;letter-spacing:.12em;padding:10px 20px 8px'));b.appendChild(tp);}
  L.inner.appendChild(b);
  return function(t){if(tpe)tpe.style.opacity=clamp((t-ws[0].t)/.15,0,1);ws.forEach(function(o){var p=eo((t-o.t+.04)/.18);o.s.style.opacity=clamp((t-o.t+.04)/.06,0,1);o.s.style.transform='translateY('+lerp(26,0,p)+'px)';
    o.s.style.color=(t>=o.t&&t<o.t+.35)?Y:CR;});};
};
// paper case folder with redaction bars and a stamp
T.folder=function(L,P){
  var b=el('div','','','width:780px;filter:drop-shadow(0 22px 34px rgba(0,0,0,.65))');
  b.appendChild(el('div','mono',P.tab,'display:inline-block;font-size:26px;letter-spacing:.14em;color:#1a1814;background:'+Y+';padding:10px 28px 8px;border-radius:14px 14px 0 0'));
  var body=el('div','','','background:#e9e3d2;padding:26px 34px 34px;position:relative;border-radius:0 8px 8px 8px;background-image:linear-gradient(180deg,rgba(255,255,255,.35),rgba(0,0,0,.06))');
  body.appendChild(el('div','disp',P.head,'font-size:78px;color:#1a1814'));
  var rd=el('div','','','margin:16px 0 0;display:flex;flex-direction:column;gap:11px');[62,84,41].forEach(function(w){rd.appendChild(el('s','','','display:block;height:20px;background:#15130f;width:'+w+'%'));});body.appendChild(rd);
  var st=el('div','disp',P.stamp,'position:absolute;right:26px;bottom:24px;font-size:44px;line-height:1;color:#b80f05;border:5px solid #b80f05;padding:8px 18px 4px;opacity:0;transform:rotate(-7deg)');body.appendChild(st);
  b.appendChild(body);L.inner.appendChild(b);
  return function(t){var u=t-P.tStamp,p=eb(u/.26);st.style.opacity=clamp(u/.04,0,.92);st.style.transform='rotate(-7deg) scale('+lerp(2.6,1,p)+')';};
};
// permission toggles
T.toggles=function(L,P){
  var b=el('div','','','width:780px;background:#e9e3d2;border-radius:10px;padding:26px 34px;filter:drop-shadow(0 22px 34px rgba(0,0,0,.65))');
  b.appendChild(el('div','',null,'display:flex;justify-content:space-between;align-items:baseline'));
  var hd=b.firstChild;hd.appendChild(el('div','disp','dots','font-size:86px;color:#1a1814'));hd.appendChild(el('div','mono','$100/MO · 4,000+ APPS','font-size:24px;letter-spacing:.08em;color:#1a1814'));
  var rows=P.items.map(function(it){var r=el('div','','','display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-top:3px solid #1a181433');
    r.appendChild(el('div','disp',it.l,'font-size:58px;color:#1a1814'));var sw=el('div','','','width:130px;height:62px;border-radius:31px;background:#a8a28f;position:relative');var kn=el('div','','','position:absolute;top:6px;left:6px;width:50px;height:50px;border-radius:50%;background:#e9e3d2;box-shadow:0 3px 8px rgba(0,0,0,.4)');sw.appendChild(kn);r.appendChild(sw);b.appendChild(r);return {sw:sw,kn:kn,it:it};});
  L.inner.appendChild(b);
  return function(t){rows.forEach(function(o){var p=eo((t-o.it.t)/.18);o.sw.style.background=p>.5?R:'#a8a28f';o.kn.style.left=lerp(6,74,p)+'px';});};
};
// closing call to action
T.cta=function(L,P){
  var b=el('div','','','text-align:center');
  var a=el('div','disp','','font-size:200px;line-height:.9');a.innerHTML='<span class="tape" style="transform:rotate(-2deg);display:inline-block">'+P.q+'</span>';b.appendChild(a);
  b.appendChild(el('div','mono',P.sub,'margin-top:34px;font-size:30px;letter-spacing:.14em;color:#f2eee3;text-shadow:0 4px 20px #000'));
  L.inner.appendChild(b);return function(){};
};
var LAY=[];
window.COMPS={
  build:function(root){window.DATA.scenes.forEach(function(sc){(sc.layers||[]).forEach(function(P){
    var wrap=el('div','c','','left:'+(P.x||0)+'px;top:'+(P.y||0)+'px;display:none;');var inner=el('div','','','');if(P.zoom)inner.style.zoom=P.zoom;wrap.appendChild(inner);root.appendChild(wrap);
    var L={wrap:wrap,inner:inner,t0:P.t0,t1:P.t1,fx:P.fx,rot:P.rot,rot0:P.rot0,cx:P.cx,cy:P.cy};L.upd=T[P.type](L,P);LAY.push(L);});});},
  update:function(t){for(var i=0;i<LAY.length;i++){var L=LAY[i],on=t>=L.t0-.02&&t<=L.t1;
    if(!on){if(L.on){L.wrap.style.display='none';L.on=false;}continue;}
    if(!L.on){L.wrap.style.display='block';L.on=true;if(L.cx!=null||L.cy!=null){var wd=L.inner.offsetWidth,ht=L.inner.offsetHeight;if(L.cx!=null)L.wrap.style.left=(L.cx-wd/2)+'px';if(L.cy!=null)L.wrap.style.top=(L.cy-ht/2)+'px';}}
    wrapFx(L,t);L.upd(t);}}
};
})();
