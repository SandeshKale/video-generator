export default async function (ctx) {
  const I = {};
  for (const n of ['world', 'bolt', 'server', 'chart-line']) I[n] = await ctx.icon(n);
  const css = `
  .cb{border:4px solid var(--edge);border-radius:14px 14px 0 0;box-shadow:8px 8px 0 var(--edge);transform-origin:50% 100%;}
  .cv9{font-family:'Bricolage',sans-serif;font-weight:800;font-size:52px;text-align:center;width:300px;white-space:nowrap;text-shadow:0 5px 0 rgba(12,6,20,.9);}
  .cn9{font-family:'JBMono',monospace;font-weight:700;font-size:19px;letter-spacing:.08em;text-align:center;width:330px;color:var(--cream2);line-height:1.25;}
  .asset{width:440px;height:330px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;}
  .asset .t{font-family:'Bricolage',sans-serif;font-weight:800;font-size:50px;text-align:center;line-height:1;}
  `;
  const cols = [['2025 FULL YEAR · REVENUE', 10, '#8a6dff', '~$10B'], ['APR 2026 · RUN RATE', 30, '#35f2b0', '$30B'], ['MAY 2026 · RUN RATE', 47, '#35f2b0', '$47B'], ['JUL 2026 · RUN RATE', 65, '#ffc53d', '$65B']];
  const H = 7.2;
  const chart = cols.map(([n, v, c, l], i) => `
    <div class="abs cb" id="cb${i}" style="left:${120 + i * 340}px;bottom:80px;width:230px;height:${Math.round(v * H)}px;background:${c};"></div>
    <div class="abs cv9" id="cv${i}" style="left:${85 + i * 340}px;bottom:${Math.round(v * H) + 94}px;">${l}</div>
    <div class="abs cn9" id="cn${i}" style="left:${70 + i * 340}px;bottom:18px;">${n}</div>`).join('');
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card mint" id="aC" style="left:380px;top:150px;width:940px;height:330px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;">
      <div class="lbl" style="font-size:24px;color:#0a4a38;">AND NOW</div><div class="big" style="font-size:130px;color:#1a0f26;">The other side.</div></div>
    <div class="pill cream" id="aP" style="left:470px;top:540px;font-size:28px;rotate:-2deg;">STRONGER THAN SKEPTICS USUALLY ADMIT</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">${chart}
    <div class="pill gold" id="bX" style="left:1060px;top:20px;font-size:48px;padding:16px 34px;rotate:4deg;">≈ 7× A YEAR AGO</div>
    <div class="pill cream" id="bN" style="left:40px;top:0;font-size:21px;">ANTHROPIC · TOLD INVESTORS · ANNUALIZED, NOT RECOGNIZED REVENUE</div></div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs" id="cA" style="left:130px;top:150px;height:120px;width:0;background:var(--gold);border:4px solid var(--edge);border-radius:14px 0 0 14px;"></div>
    <div class="abs" id="cO" style="left:130px;top:150px;height:120px;width:0;background:var(--mint);border:4px solid var(--edge);border-radius:0 14px 14px 0;"></div>
    <div class="abs big" id="cAl" style="left:160px;top:176px;font-size:46px;color:#2a1c00;opacity:0;">ANTHROPIC $65B</div>
    <div class="abs big" id="cOl" style="left:930px;top:176px;font-size:46px;color:#10241d;opacity:0;">OPENAI $40B</div>
    <div class="abs big" id="cT" style="left:150px;top:300px;width:1400px;text-align:center;font-size:280px;color:var(--cream);text-shadow:0 12px 0 rgba(12,6,20,.9);">~$100B</div>
    <div class="card dark" id="cS" style="left:200px;top:622px;width:1300px;height:84px;display:flex;align-items:center;justify-content:center;"><div class="h2" style="font-size:34px;white-space:nowrap;">per year · two labs · from almost nothing three years ago</div></div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <svg class="abs" style="left:300px;top:0px;transform:scale(.7);transform-origin:50% 0;" width="1100" height="560" viewBox="0 0 1100 560">
      <path d="M100 460 A450 450 0 0 1 1000 460" fill="none" stroke="rgba(244,239,230,.2)" stroke-width="56" stroke-linecap="round"/>
      <path id="gArc" d="M100 460 A450 450 0 0 1 1000 460" fill="none" stroke="#35f2b0" stroke-width="56" stroke-linecap="round"/>
      <g id="needle" transform="translate(550 460) rotate(-90)"><path d="M-14 0 L0 -400 L14 0 Z" fill="#f4efe6" stroke="#0c0614" stroke-width="5" stroke-linejoin="round"/><circle r="34" fill="#f4efe6" stroke="#0c0614" stroke-width="6"/></g>
      <text x="100" y="530" font-family="JetBrains Mono, JBMono" font-weight="700" font-size="24" fill="#cfc7ba" text-anchor="middle">IDLE</text>
      <text x="1000" y="530" font-family="JBMono" font-weight="700" font-size="24" fill="#35f2b0" text-anchor="middle">SOLD OUT</text></svg>
    <div class="card gold" id="dQ" style="left:290px;top:430px;width:1120px;height:150px;display:flex;align-items:center;padding:0 40px;"><div class="h2" style="font-size:48px;color:#1a0f26;">“We can't build fast enough to meet demand.”</div></div>
    <div class="lbl dim-t abs" id="dS" style="left:300px;top:590px;font-size:20px;">— CLOUD PROVIDER EXECUTIVES, AS REPORTED · UNLIKE 2002'S DARK FIBER</div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card asset" id="e1" style="left:60px;top:50px;"><div class="icon-sz" style="width:110px;height:110px;">${I['world']}</div><div class="t">Land</div></div>
    <div class="card asset gold" id="e2" style="left:630px;top:50px;"><div class="icon-sz" style="width:110px;height:110px;">${I['bolt']}</div><div class="t">Power contracts</div></div>
    <div class="card asset mint" id="e3" style="left:1200px;top:50px;"><div class="icon-sz" style="width:110px;height:110px;">${I['server']}</div><div class="t">Buildings</div></div>
    <div class="card dark" id="eB" style="left:200px;top:440px;width:1300px;height:200px;display:flex;align-items:center;justify-content:center;gap:34px;">
      <div class="pill coral" style="position:relative;font-size:30px;">TENANT FAILS</div><div class="big" style="font-size:80px;color:var(--gold);" id="eArr">→</div><div class="pill mint" style="position:relative;font-size:30px;">SOMEONE ELSE MOVES IN</div></div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4].map(function(i){return CUE(i);});
  function moodAt(t){return .05;}
  function render(t){
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('aC'),st(t,K[0]+.2,.6),{rot:3,s0:.5}); pop($('aP'),st(t,K[0]+2.4,.5),{dy:30});
    var b=win(t,K[1]-.05,K[2]-.15,.45); $('B').style.opacity=b;
    pop($('bN'),st(t,K[1]+.1,.5),{dy:-20});
    var at=[K[1]+1.2,K[1]+4.2,K[1]+6.4,K[1]+8.6];
    for(var i=0;i<4;i++){$('cb'+i).style.transform='scaleY('+eoc(st(t,at[i],1.1))+')';pop($('cv'+i),st(t,at[i]+.8,.4),{dy:16});pop($('cn'+i),st(t,at[i]-.3,.4),{dy:10});}
    pop($('bX'),st(t,K[1]+12.2,.5),{rot:10,s0:.3,dy:0});
    var c=win(t,K[2]-.05,K[3]-.15,.45); $('C').style.opacity=c;
    $('cA').style.width=(650*eoc(st(t,K[2]+.3,1.1)))+'px';
    $('cO').style.width=(400*eoc(st(t,K[2]+1.6,1.0)))+'px'; $('cO').style.left=(130+650)+'px';
    $('cAl').style.left='160px'; $('cOl').style.left='800px'; fade($('cAl'),st(t,K[2]+1.0,.4)); fade($('cOl'),st(t,K[2]+2.4,.4));
    pop($('cT'),st(t,K[2]+3.2,.6),{s0:.5}); pop($('cS'),st(t,K[2]+5.0,.5),{dy:30});
    var d=win(t,K[3]-.05,K[4]-.15,.45); $('D').style.opacity=d;
    var ne=eoc(st(t,K[3]+.6,2.2)); var ang=-90+180*ne+3*Math.sin(t*9)*ne;
    $('needle').setAttribute('transform','translate(550 460) rotate('+ang+')');
    var arcLen=1414; $('gArc').setAttribute('stroke-dasharray',(arcLen*ne)+' '+arcLen);
    pop($('dQ'),st(t,K[3]+3.8,.55),{dy:40}); fade($('dS'),st(t,K[3]+4.6,.5));
    var e=st(t,K[4]-.05,.4); $('E').style.opacity=e;
    pop($('e1'),st(t,K[4]+.4,.5),{dy:60,rot:-3}); pop($('e2'),st(t,K[4]+1.0,.5),{dy:60,rot:2}); pop($('e3'),st(t,K[4]+1.6,.5),{dy:60,rot:-2});
    pop($('eB'),st(t,K[4]+3.2,.55),{dy:50}); $('eArr').style.transform='translateX('+(10*Math.sin(t*5))+'px)';
  }`;
  return { css, html, js };
}
