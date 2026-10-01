export default async function (ctx) {
  const I = {};
  for (const n of ['cpu', 'trending-down']) I[n] = await ctx.icon(n);
  const css = `
  .gl{font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:.1em;}
  .bar8{height:92px;border:4px solid var(--edge);border-radius:14px;box-shadow:7px 7px 0 var(--edge);}
  .gen{width:96px;height:96px;display:flex;align-items:center;justify-content:center;}
  .gen svg{width:54px;height:54px;}
  `;
  const X0 = 360, YR = 190; // axis origin x, px per year
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card dark" id="aCard" style="left:150px;top:110px;width:1400px;height:300px;display:flex;align-items:center;gap:56px;padding:0 60px;">
      <div style="width:190px;height:190px;border-radius:50%;background:var(--coral);border:6px solid var(--edge);display:flex;align-items:center;justify-content:center;flex:0 0 190px;"><div class="big" style="font-size:96px;color:#1a0f26;">MB</div></div>
      <div><div class="lbl coral-t" style="font-size:22px;">THE INVESTOR WHO SHORTED THE HOUSING MARKET</div>
        <div class="big" style="font-size:112px;margin-top:12px;">Michael Burry</div></div></div>
    <div class="pill coral" id="aP" style="left:480px;top:480px;font-size:30px;rotate:-2deg;">NOW PUBLICLY BETTING AGAINST AI STOCKS</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card coral" id="b1" style="left:230px;top:90px;width:560px;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div class="lbl" style="font-size:22px;color:#4a1410;">SHORT</div><div class="big" style="font-size:96px;color:#1a0f26;">NVIDIA</div></div>
    <div class="card coral" id="b2" style="left:910px;top:90px;width:560px;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div class="lbl" style="font-size:22px;color:#4a1410;">SHORT</div><div class="big" style="font-size:96px;color:#1a0f26;">PALANTIR</div></div>
    <div class="card dark" id="bQ" style="left:230px;top:380px;width:1240px;height:210px;display:flex;align-items:center;justify-content:center;padding:0 50px;">
      <div class="h2" style="font-size:64px;text-align:center;">His sharpest argument isn't <span class="coral-t" style="text-decoration:line-through;">demand.</span><br>It's <span class="gold-t">accounting.</span></div></div>
  </div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl dim-t" style="left:${X0}px;top:0;font-size:22px;">YEARS OF USEFUL LIFE FOR AN AI SERVER</div>
    ${[0, 1, 2, 3, 4, 5, 6].map((y) => `<div class="abs" style="left:${X0 + y * YR}px;top:60px;width:3px;height:430px;background:rgba(244,239,230,.16);"></div><div class="abs gl" style="left:${X0 + y * YR - 20}px;top:496px;width:44px;text-align:center;color:var(--cream2);">${y}</div>`).join('')}
    <div class="abs gl" style="left:0;top:96px;width:330px;color:var(--mint);font-size:22px;line-height:1.2;text-align:right;">WHAT CLOUD GIANTS BOOK</div>
    <div class="abs bar8" id="cb1" style="left:${X0}px;top:80px;width:0;background:var(--mint);"></div>
    <div class="abs big" id="cv1" style="left:${X0 + 20}px;top:98px;font-size:48px;color:#10241d;opacity:0;">5–6 YEARS</div>
    <div class="abs gl" style="left:0;top:246px;width:330px;color:var(--coral);font-size:22px;line-height:1.2;text-align:right;">BURRY: REAL ECONOMIC LIFE</div>
    <div class="abs bar8" id="cb2" style="left:${X0}px;top:230px;width:0;background:var(--coral);"></div>
    <div class="abs big" id="cv2" style="left:${X0 + 20}px;top:248px;font-size:48px;color:#1a0f26;opacity:0;">2–3 YEARS</div>
    ${[1, 2, 3].map((y, i) => `<div class="card gold gen" id="gen${i}" style="left:${X0 + y * YR - 48}px;top:380px;width:96px;height:96px;border-radius:20px;"><div class="icon-sz" style="width:54px;height:54px;color:#1a0f26">${I['cpu']}</div></div>`).join('')}
    <div class="pill cream" id="cGen" style="left:${X0 + 700}px;top:400px;font-size:23px;">NEW NVIDIA GENERATION · ~EVERY YEAR</div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs big" id="dV" style="left:150px;top:30px;width:1400px;text-align:center;font-size:330px;color:var(--coral);text-shadow:0 12px 0 rgba(12,6,20,.9);">$0B</div>
    <div class="card dark" id="dC" style="left:260px;top:400px;width:1180px;height:140px;display:flex;align-items:center;justify-content:center;"><div class="h2" style="font-size:46px;text-align:center;">of depreciation understated, 2026–2028<span class="dim-t" style="font-size:30px;"> · Burry's estimate</span></div></div>
    <div class="pill gold" id="dP" style="left:470px;top:580px;font-size:30px;rotate:-2deg;">FLATTERS REPORTED PROFITS</div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs big coral-t" id="eMark" style="left:60px;top:-60px;font-size:420px;line-height:1;opacity:.9;">“</div>
    <div class="abs h2" id="eQ" style="left:200px;top:140px;width:1300px;font-size:92px;line-height:1.05;">one of the more common frauds of the modern era</div>
    <div class="pill cream" id="eS" style="left:200px;top:520px;font-size:24px;">MICHAEL BURRY · ON STRETCHED DEPRECIATION SCHEDULES · AS REPORTED</div>
  </div>
  <div id="F" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card mint" id="fH" style="left:60px;top:70px;width:560px;height:210px;padding:34px 40px;"><div class="lbl" style="font-size:20px;color:#0a4a38;">NVIDIA CEO · JENSEN HUANG</div><div class="big" style="font-size:78px;margin-top:14px;color:#1a0f26;">Disagrees.</div></div>
    <div class="card dark" id="fA" style="left:660px;top:70px;width:980px;height:520px;">
      <div class="abs lbl mint-t" style="left:40px;top:28px;font-size:21px;">RESALE VALUE · SIX-YEAR-OLD A100 GPU</div>
      <svg class="abs" style="left:40px;top:80px" width="900" height="300" viewBox="0 0 900 300">
        <path id="fLine" d="M0 20 C150 40 260 170 420 230 C520 262 600 268 900 268" fill="none" stroke="#35f2b0" stroke-width="10" stroke-linecap="round"/>
        <line id="fMark" x1="560" y1="20" x2="560" y2="290" stroke="#ffc53d" stroke-width="4" stroke-dasharray="10 10"/>
        <g id="fDot"><circle r="14" fill="#ffc53d" stroke="#0c0614" stroke-width="4"/></g></svg>
      <div class="pill gold" id="fTag" style="left:470px;top:96px;font-size:21px;">PRICES STOPPED FALLING · LATE 2025</div>
      <div class="abs big" id="fV" style="left:40px;top:392px;font-size:92px;">~$5,000</div>
      <div class="abs lbl dim-t" style="left:40px;top:488px;font-size:18px;width:880px;line-height:1.5;">SOURCE: SILICON DATA · CURVE SHAPE ILLUSTRATIVE</div></div>
  </div>
  <div id="G" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card coral" id="g1" style="left:130px;top:150px;width:560px;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div class="big" style="font-size:150px;color:#1a0f26;">2–3</div><div class="lbl" style="font-size:22px;color:#4a1410;">YEARS · BURRY</div></div>
    <div class="vs-q abs big" id="gq" style="left:760px;top:170px;width:180px;text-align:center;font-size:260px;color:var(--gold);text-shadow:0 10px 0 rgba(12,6,20,.9);">?</div>
    <div class="card mint" id="g2" style="left:1010px;top:150px;width:560px;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;"><div class="big" style="font-size:150px;color:#1a0f26;">5–6</div><div class="lbl" style="font-size:22px;color:#0a4a38;">YEARS · CLOUD GIANTS</div></div>
    <div class="pill cream" id="gP" style="left:330px;top:540px;font-size:30px;">THE MOST IMPORTANT ACCOUNTING ARGUMENT IN TECH?</div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5,6].map(function(i){return CUE(i);});
  function moodAt(t){return .85;}
  function render(t){
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('aCard'),st(t,K[0]+.2,.6),{dy:50,s0:.8}); pop($('aP'),st(t,K[0]+3.8,.5),{dy:30,rot:-4});
    var b=win(t,K[1]-.05,K[2]-.1,.4); $('B').style.opacity=b;
    pop($('b1'),st(t,K[1]+.2,.5),{dx:-120,dy:0,s0:.85}); pop($('b2'),st(t,K[1]+.6,.5),{dx:120,dy:0,s0:.85}); pop($('bQ'),st(t,K[1]+3.6,.55),{dy:50});
    var c=win(t,K[2]-.05,K[3]-.15,.45); $('C').style.opacity=c;
    $('cb1').style.width=(${YR}*6*eoc(st(t,K[2]+.5,1.3)))+'px'; fade($('cv1'),st(t,K[2]+1.4,.4));
    $('cb2').style.width=(${YR}*3*eoc(st(t,K[2]+3.5,1.0)))+'px'; fade($('cv2'),st(t,K[2]+4.3,.4));
    for(var i=0;i<3;i++){pop($('gen'+i),st(t,K[2]+7.0+i*.9,.5),{dy:-40,rot:i*8-8,s0:.4});} pop($('cGen'),st(t,K[2]+9.8,.5),{dy:20});
    var d=win(t,K[3]-.05,K[4]-.15,.45); $('D').style.opacity=d;
    var v=176*eoc(st(t,K[3]+.4,2.2)); $('dV').textContent='$'+Math.round(v)+'B';
    pop($('dC'),st(t,K[3]+2.2,.5),{dy:40}); pop($('dP'),st(t,K[3]+8.5,.5),{rot:-8,s0:.3,dy:0});
    var e=win(t,K[4]-.05,K[5]-.15,.45); $('E').style.opacity=e;
    pop($('eMark'),st(t,K[4]+.1,.5),{s0:.5}); rise($('eQ'),st(t,K[4]+.5,.7),30); pop($('eS'),st(t,K[4]+3.2,.5),{dy:20});
    var f=win(t,K[5]-.05,K[6]-.15,.45); $('F').style.opacity=f;
    pop($('fH'),st(t,K[5]+.2,.5),{dx:-120,dy:0,s0:.9}); pop($('fA'),st(t,K[5]+1.5,.55),{dx:120,dy:0,s0:.92});
    var L=$('fLine'); var Ll=L.getTotalLength(); var ge=eoc(st(t,K[5]+3.0,3.0)); L.setAttribute('stroke-dasharray',Ll+' '+Ll); L.setAttribute('stroke-dashoffset',Ll*(1-ge));
    var p=L.getPointAtLength(Ll*ge); $('fDot').setAttribute('transform','translate('+p.x+','+p.y+')'); $('fDot').style.opacity=st(t,K[5]+3.0,.3);
    $('fMark').style.opacity=st(t,K[5]+5.5,.5); pop($('fTag'),st(t,K[5]+6.0,.5),{dy:20});
    pop($('fV'),st(t,K[5]+8.4,.6),{s0:.6});
    var g=st(t,K[6]-.05,.45); $('G').style.opacity=g;
    pop($('g1'),st(t,K[6]+.2,.5),{dx:-120,dy:0,s0:.9}); pop($('g2'),st(t,K[6]+.5,.5),{dx:120,dy:0,s0:.9});
    pop($('gq'),st(t,K[6]+1.1,.6),{s0:.2,rot:20}); $('gq').style.rotate=(6*Math.sin(t*2.6))+'deg';
    pop($('gP'),st(t,K[6]+2.8,.5),{dy:30});
  }`;
  return { css, html, js };
}
