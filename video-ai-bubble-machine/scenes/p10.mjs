export default async function (ctx) {
  const css = `
  .yr{width:560px;height:360px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .cell{width:40px;height:40px;border-radius:9px;border:3px solid var(--edge);}
  .tomb{width:420px;height:300px;padding:30px;border-radius:200px 200px 24px 24px;text-align:center;}
  .tomb .n{font-family:'Bricolage',sans-serif;font-weight:800;font-size:46px;line-height:1;margin-top:60px;}
  .tomb .s{font-family:'JBMono',monospace;font-weight:700;font-size:19px;letter-spacing:.1em;margin-top:14px;}
  .verdict{width:700px;height:360px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:0 40px;text-align:center;}
  `;
  let cells = '';
  for (let i = 0; i < 100; i++) cells += `<div class="abs cell" id="fc${i}" style="left:${(i % 20) * 54}px;top:${Math.floor(i / 20) * 54}px;background:#2f1f4a;opacity:0;"></div>`;
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card yr dark" id="a26" style="left:130px;top:130px;"><div class="big" style="font-size:230px;">2026</div></div>
    <div class="big abs" id="aQ" style="left:760px;top:140px;width:180px;text-align:center;font-size:270px;color:var(--gold);text-shadow:0 10px 0 rgba(12,6,20,.9);">?</div>
    <div class="card yr gold" id="a99" style="left:1010px;top:130px;"><div class="big" style="font-size:230px;color:#1a0f26;">1999</div></div>
    <div class="pill cream" id="aP" style="left:330px;top:560px;font-size:28px;">WHAT DID THE LAST INFRASTRUCTURE BUBBLE LEAVE BEHIND?</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl dim-t" id="bL" style="left:100px;top:0;font-size:24px;">FIBER-OPTIC CABLE · 1995–2000 · "PERHAPS AS MUCH AS"</div>
    <div class="abs big" id="bV" style="left:100px;top:50px;font-size:380px;color:var(--gold);text-shadow:0 14px 0 rgba(12,6,20,.9);">$2T</div>
    <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">
      <path id="cable" d="M60 640 C400 560 520 700 880 630 S1300 560 1650 640" fill="none" stroke="#35f2b0" stroke-width="12" stroke-linecap="round"/>
      <path d="M60 640 C400 560 520 700 880 630 S1300 560 1650 640" fill="none" stroke="#f4efe6" stroke-width="3" stroke-linecap="round" stroke-dasharray="3 22" id="cable2"/></svg>
    <div class="card dark" id="bM" style="left:830px;top:90px;width:760px;height:300px;padding:34px 44px;"><div class="lbl mint-t" style="font-size:22px;">LAID IN FIVE YEARS</div><div class="big" style="font-size:150px;margin-top:10px;" id="bMv">0M</div><div class="body dim-t" style="font-size:30px;">miles of fiber, 80–90 million</div></div>
  </div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl dim-t" id="cL" style="left:310px;top:0;font-size:22px;">100 STRANDS OF FIBER · 2002</div>
    <div class="abs" id="cells" style="left:310px;top:50px;width:1080px;height:270px;">${cells}</div>
    <div class="abs big" id="cV" style="left:150px;top:370px;width:1400px;text-align:center;font-size:250px;color:var(--cream);text-shadow:0 10px 0 rgba(12,6,20,.9);">2.7%</div>
    <div class="card dark" id="cS" style="left:380px;top:640px;width:940px;height:70px;display:flex;align-items:center;justify-content:center;"><div class="h2" style="font-size:30px;white-space:nowrap;">in use, per the Wall Street Journal · other estimates: ~95% dark</div></div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card coral" id="dP" style="left:60px;top:70px;width:640px;height:520px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div class="lbl" style="font-size:22px;color:#4a1410;">BANDWIDTH PRICES</div><div class="big" id="dV" style="font-size:186px;color:#1a0f26;margin-top:8px;">−90%</div><div class="body" style="font-size:28px;color:#3a1410;">at the worst, within the bust</div></div>
    <div class="card dark tomb" id="t1" style="left:770px;top:150px;"><div class="n">Global Crossing</div><div class="s coral-t">BANKRUPT</div></div>
    <div class="card dark tomb" id="t2" style="left:1220px;top:150px;"><div class="n">WorldCom</div><div class="s coral-t">BANKRUPT</div></div>
    <div class="stamp" id="dS" style="left:880px;top:520px;font-size:56px;rotate:-5deg;">BUST</div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl dim-t" id="eL" style="left:310px;top:0;font-size:22px;">THE SAME FIBER · LATER</div>
    <div class="abs" id="ecells" style="left:310px;top:50px;width:1080px;height:270px;">${cells.replace(/fc/g, 'ec')}</div>
    <div class="card mint" id="eC" style="left:150px;top:380px;width:1400px;height:210px;display:flex;align-items:center;justify-content:center;"><div class="h2" style="font-size:66px;color:#1a0f26;text-align:center;">Streaming · Cloud · The modern internet</div></div>
    <div class="pill gold" id="eP" style="left:430px;top:620px;font-size:30px;rotate:-2deg;">BOUGHT AT FIRE-SALE PRICES BY WHOEVER SURVIVED</div>
  </div>
  <div id="F" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card verdict mint" id="f1" style="left:90px;top:170px;"><div class="big" style="font-size:90px;color:#1a0f26;">The infrastructure</div><div class="big" style="font-size:150px;color:#1a0f26;">won.</div></div>
    <div class="card verdict coral" id="f2" style="left:910px;top:170px;"><div class="big" style="font-size:90px;color:#1a0f26;">The investors who built it</div><div class="big" style="font-size:110px;color:#1a0f26;">mostly didn't.</div></div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5].map(function(i){return CUE(i);});
  function moodAt(t){return clamp(.5*st(t,K[2],2)+.2*st(t,K[3],1)-.4*st(t,K[4],2)+.5*st(t,K[5],2),0,1);}
  function render(t){
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('a26'),st(t,K[0]+.2,.55),{dx:-120,dy:0,s0:.85}); pop($('a99'),st(t,K[0]+.6,.55),{dx:120,dy:0,s0:.85});
    pop($('aQ'),st(t,K[0]+1.2,.6),{s0:.2,rot:20}); $('aQ').style.rotate=(7*Math.sin(t*2.4))+'deg'; pop($('aP'),st(t,K[0]+3.2,.5),{dy:30});
    var b=win(t,K[1]-.05,K[2]-.15,.45); $('B').style.opacity=b;
    fade($('bL'),st(t,K[1]+.1,.4)); pop($('bV'),st(t,K[1]+.3,.6),{s0:.5});
    var cl=$('cable'); var Lc=cl.getTotalLength(); cl.setAttribute('stroke-dasharray',Lc+' '+Lc); cl.setAttribute('stroke-dashoffset',Lc*(1-eoc(st(t,K[1]+1.0,3.2))));
    $('cable2').setAttribute('stroke-dashoffset',-(t*30));
    pop($('bM'),st(t,K[1]+3.6,.55),{dx:120,dy:0,s0:.92}); $('bMv').textContent=Math.round(85*eoc(st(t,K[1]+4.2,2.4)))+'M';
    var c=win(t,K[2]-.05,K[3]-.15,.45); $('C').style.opacity=c;
    fade($('cL'),st(t,K[2]+.1,.4));
    for(var i=0;i<100;i++){var e=st(t,K[2]+.3+i*.018,.25);var cc=$('fc'+i);cc.style.opacity=e;
      var lit=(i===3||i===47||i===88); cc.style.background=lit?'#35f2b0':'#2f1f4a'; cc.style.transform='scale('+(.5+.5*eob(e))+')';}
    pop($('cV'),st(t,K[2]+3.6,.6),{s0:.5}); pop($('cS'),st(t,K[2]+5.0,.5),{dy:30});
    var d=win(t,K[3]-.05,K[4]-.15,.45); $('D').style.opacity=d;
    pop($('dP'),st(t,K[3]+.2,.55),{dx:-120,dy:0,s0:.9}); $('dV').style.transform='translateY('+(18*(1-eoc(st(t,K[3]+.6,.9))))+'px)';
    pop($('t1'),st(t,K[3]+2.0,.6),{dy:80,s0:.7}); pop($('t2'),st(t,K[3]+2.8,.6),{dy:80,s0:.7}); pop($('dS'),st(t,K[3]+4.2,.45),{rot:-14,s0:.2,dy:0});
    var e5=win(t,K[4]-.05,K[5]-.15,.45); $('E').style.opacity=e5;
    fade($('eL'),st(t,K[4]+.1,.4));
    for(var j=0;j<100;j++){var ee=st(t,K[4]+.3,.3);var ec=$('ec'+j);ec.style.opacity=ee;
      var tl=st(t,K[4]+1.0+hash(j+9)*5.0,.4); ec.style.background=tl>0?'#35f2b0':'#2f1f4a'; ec.style.transform='scale('+(1+.12*Math.sin(tl*Math.PI))+')';}
    pop($('eC'),st(t,K[4]+2.4,.55),{dy:50}); pop($('eP'),st(t,K[4]+5.0,.5),{dy:30});
    var f=st(t,K[5]-.05,.45); $('F').style.opacity=f;
    pop($('f1'),st(t,K[5]+.3,.6),{dx:-140,dy:0,s0:.88,rot:-2}); pop($('f2'),st(t,K[5]+2.6,.6),{dx:140,dy:0,s0:.88,rot:2});
  }`;
  return { css, html, js };
}
