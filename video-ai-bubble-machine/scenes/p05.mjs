export default async function (ctx) {
  const I = {};
  for (const n of ['refresh', 'coin', 'arrows-exchange', 'alert-triangle']) { try { I[n] = await ctx.icon(n); } catch (e) { I[n] = ''; } }
  const css = `
  .cyc{width:350px;height:112px;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 18px;}
  .cyc .t{font-family:'Bricolage',sans-serif;font-weight:800;font-size:31px;line-height:1.05;}
  .cyc .n{position:absolute;left:-22px;top:-22px;width:50px;height:50px;border-radius:50%;background:var(--coral);border:4px solid var(--edge);color:#1a0f26;
    font-family:'Bricolage',sans-serif;font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;}
  .ledger{width:470px;height:300px;padding:30px 34px;}
  .ledger .a{font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:.12em;}
  .ledger .b{font-family:'Bricolage',sans-serif;font-weight:800;font-size:56px;line-height:1;margin-top:14px;}
  .ledger .c{font-family:'Inter',sans-serif;font-weight:600;font-size:26px;margin-top:14px;line-height:1.25;}
  .bigcoin{width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a8,#ffc53d 55%,#c98a00);border:6px solid var(--edge);box-shadow:0 9px 0 var(--edge);
    display:flex;align-items:center;justify-content:center;font-family:'Bricolage',sans-serif;font-weight:800;font-size:90px;color:#6b4a00;}
  .minicoin{width:64px;height:64px;font-size:40px;border-width:4px;box-shadow:0 5px 0 var(--edge);}
  .swapcard{width:480px;height:240px;padding:28px 34px;}
  .swapcard .h{font-family:'Bricolage',sans-serif;font-weight:800;font-size:48px;line-height:1;}
  .swapcard .s{font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:.08em;margin-top:12px;}
  .tl5{width:1120px;height:112px;padding:0 36px;display:flex;align-items:center;gap:30px;}
  .tl5 .d{font-family:'JBMono',monospace;font-weight:700;font-size:24px;letter-spacing:.1em;width:200px;}
  .tl5 .q{font-family:'Bricolage',sans-serif;font-weight:800;font-size:35px;line-height:1.05;}
  .edgeRow{width:1120px;height:104px;display:flex;align-items:center;gap:26px;padding:0 34px;}
  .edgeRow .n{font-family:'Bricolage',sans-serif;font-weight:800;font-size:38px;flex:1;}
  `;
  const cx = 850, cy = 360;
  const cyc = [
    ['1', 'Invests in a customer', cx, 78, ''],
    ['2', 'Customer buys your product', 1330, cy, 'gold'],
    ['3', 'Revenue up. Stock up.', cx, 642, 'mint'],
    ['4', 'Funds the next investment', 370, cy, 'violet'],
  ];
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card gold" id="aCard" style="left:540px;top:170px;width:620px;height:380px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;">
      <div class="icon-sz" id="aIc" style="width:140px;height:140px;color:#1a0f26">${I.refresh}</div>
      <div class="big" style="font-size:86px;color:#1a0f26;">Circular?</div></div>
    <div class="pill coral" id="aPill" style="left:600px;top:590px;font-size:28px;">THIS IS WHAT MAKES PEOPLE NERVOUS</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">
      <path id="loopP" d="M850 134 C1180 134 1330 190 1330 360 C1330 530 1180 586 850 586 C520 586 370 530 370 360 C370 190 520 134 850 134" fill="none" stroke="rgba(244,239,230,.35)" stroke-width="6" stroke-dasharray="2 16" stroke-linecap="round"/>
      <g id="loopCoin"><circle r="22" fill="#ffc53d" stroke="#0c0614" stroke-width="5"/><text y="9" text-anchor="middle" font-family="Bricolage" font-weight="800" font-size="26" fill="#6b4a00">$</text></g>
    </svg>
    ${cyc.map(([n, t, x, y, c], i) => `<div class="card cyc ${c}" id="cy${i}" style="left:${x - 175}px;top:${y - 56}px;"><div class="n">${n}</div><div class="t">${t}</div></div>`).join('')}
    <div class="abs h2" id="bMid" style="left:560px;top:300px;width:580px;text-align:center;font-size:54px;line-height:1.05;">Each lap makes the<br>numbers look bigger.</div>
  </div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="bigcoin abs" id="cCoin" style="left:775px;top:20px;">$</div>
    <div class="abs lbl" id="cCap" style="left:500px;top:190px;width:700px;text-align:center;font-size:26px;color:var(--cream2);">ONE DOLLAR</div>
    ${['mint', 'gold', 'coral'].map((c, i) => `<div class="bigcoin minicoin abs" id="mc${i}" style="left:818px;top:50px;opacity:0;">$</div>`).join('')}
    <div class="card ledger" id="L0" style="left:60px;top:300px;"><div class="a">BALANCE SHEET A</div><div class="b">Investment</div><div class="c">Counted as capital deployed into the customer.</div></div>
    <div class="card ledger mint" id="L1" style="left:615px;top:300px;"><div class="a">BALANCE SHEET B</div><div class="b">Revenue</div><div class="c">Counted as a sale of product to the customer.</div></div>
    <div class="card ledger coral" id="L2" style="left:1170px;top:300px;"><div class="a">BALANCE SHEET C</div><div class="b">Growth</div><div class="c">Counted as proof demand is exploding.</div></div>
    <div class="pill gold" id="cX" style="left:640px;top:650px;font-size:30px;rotate:-2deg;">SAME DOLLAR · COUNTED 3×</div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card swapcard dark" id="sA" style="left:70px;top:180px;"><div class="h">Telecom A</div><div class="s mint-t">SELLS CAPACITY TO B</div><div class="pill mint" style="position:relative;display:inline-flex;margin-top:22px;">+ REVENUE</div></div>
    <div class="card swapcard darkc" id="sB" style="left:1150px;top:180px;"><div class="h">Telecom B</div><div class="s coral-t">SELLS CAPACITY TO A</div><div class="pill mint" style="position:relative;display:inline-flex;margin-top:22px;">+ REVENUE</div></div>
    <div class="icon-sz abs" id="sIc" style="left:775px;top:230px;width:150px;height:150px;color:var(--gold)">${I['arrows-exchange']}</div>
    <div class="abs h2" id="sT" style="left:350px;top:470px;width:1000px;text-align:center;font-size:58px;">Booked as <span class="coral-t">real demand.</span></div>
    <div class="pill cream" id="sP" style="left:560px;top:600px;font-size:24px;">THE TELECOM BOOM · CAPACITY SWAPS</div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs big" id="eBig" style="left:200px;top:0;width:860px;text-align:center;font-size:200px;color:var(--cream);text-shadow:0 10px 0 rgba(12,6,20,.9);">$100B</div>
    <div class="abs" id="eStrike" style="left:210px;top:100px;width:0;height:18px;background:var(--coral);border:4px solid var(--edge);border-radius:6px;rotate:-4deg;"></div>
    <div class="pill coral" id="eStamp" style="left:1110px;top:70px;font-size:40px;padding:14px 32px;rotate:-5deg;">NEVER BINDING</div>
    <div class="card tl5 dark" id="e1" style="left:290px;top:250px;"><div class="d mint-t">SEPT 2025</div><div class="q">Letter of intent: <span class="mint-t">up to $100B</span></div></div>
    <div class="card tl5 darkc" id="e2" style="left:290px;top:384px;"><div class="d coral-t">FEB 2026</div><div class="q">CEO: “never a binding commitment”</div></div>
    <div class="card tl5 darkc" id="e3" style="left:290px;top:518px;"><div class="d coral-t">MAR 2026</div><div class="q">“Probably not in the cards” · far smaller stake</div></div>
  </div>
  <div id="F" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card edgeRow" id="f1" style="left:290px;top:60px;background:#3a3050;color:var(--cream2);border-style:dashed;"><div class="n">Nvidia → OpenAI · $100B</div><div class="pill coral" style="position:relative;">LOOSENED</div></div>
    <div class="card edgeRow mint" id="f2" style="left:290px;top:210px;"><div class="n">OpenAI ⇄ Oracle · $300B</div><div class="pill cream" style="position:relative;">STILL THERE</div></div>
    <div class="card edgeRow gold" id="f3" style="left:290px;top:360px;"><div class="n">OpenAI ⇄ AMD · warrants</div><div class="pill cream" style="position:relative;">STILL THERE</div></div>
    <div class="card edgeRow violet" id="f4" style="left:290px;top:510px;"><div class="n">Nvidia ⇄ CoreWeave</div><div class="pill cream" style="position:relative;">STILL THERE</div></div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5].map(function(i){return CUE(i);});
  function moodAt(t){return clamp(.2+.55*st(t,K[2],3)-.35*st(t,K[5],2),0,1);}
  function render(t){
    // A
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('aCard'),st(t,K[0]+.2,.6),{rot:-5,s0:.4}); $('aIc').style.transform='rotate('+(t*120)+'deg)';
    pop($('aPill'),st(t,K[0]+2.8,.5),{dy:30});
    // B cycle
    var b=win(t,K[1]-.05,K[2]-.15,.45); $('B').style.opacity=b;
    for(var i=0;i<4;i++){pop($('cy'+i),st(t,K[1]+.3+i*1.9,.55),{dy:0,s0:.55});}
    var lp=$('loopP'); var u=(st(t,K[1]+.6,9.0)*1.9)%1; coinAt($('loopCoin'),lp,u,st(t,K[1]+.5,.3));
    var act=Math.floor(clamp((t-(K[1]+.6))/2.2,0,3.99)); for(var j=0;j<4;j++){var s=(j===act&&t>K[1]+.6)?1.06:1;$('cy'+j).style.scale=s;}
    pop($('bMid'),st(t,K[1]+8.2,.5),{dy:20});
    // C coin split
    var c=win(t,K[2]-.05,K[3]-.15,.45); $('C').style.opacity=c;
    pop($('cCoin'),st(t,K[2]+.1,.45),{s0:.3}); fade($('cCap'),st(t,K[2]+.3,.4));
    var tx=[60+235-32,615+235-32,1170+235-32], ty=300+40;
    for(var m=0;m<3;m++){var e=eio(st(t,K[2]+.9+m*.9,.9)); var mc=$('mc'+m);
      mc.style.opacity=st(t,K[2]+.9+m*.9,.1); mc.style.left=(818+(tx[m]-818)*e)+'px'; mc.style.top=(50+(ty-50+0)*e-80*Math.sin(e*Math.PI))+'px';}
    for(var q=0;q<3;q++){pop($('L'+q),st(t,K[2]+1.6+q*.9,.55),{dy:50,rot:q-1});}
    pop($('cX'),st(t,K[2]+5.0,.5),{rot:-6,s0:.4,dy:0});
    // D telecom swap
    var d=win(t,K[3]-.05,K[4]-.15,.45); $('D').style.opacity=d;
    pop($('sA'),st(t,K[3]+.2,.55),{dx:-120,dy:0,s0:.85}); pop($('sB'),st(t,K[3]+.5,.55),{dx:120,dy:0,s0:.85});
    $('sIc').style.transform='rotate('+(t*90)+'deg)'; fade($('sIc'),st(t,K[3]+.9,.4));
    pop($('sT'),st(t,K[3]+4.0,.5),{dy:20}); pop($('sP'),st(t,K[3]+.8,.45),{dy:20});
    // E twist
    var e5=win(t,K[4]-.05,K[5]-.15,.45); $('E').style.opacity=e5;
    pop($('eBig'),st(t,K[4]+.1,.5),{s0:.6});
    $('eStrike').style.width=(840*eoc(st(t,K[4]+3.2,.7)))+'px';
    $('eBig').style.opacity=1-.6*st(t,K[4]+4.0,.6);
    pop($('eStamp'),st(t,K[4]+4.2,.5),{rot:-12,s0:.2,dy:0});
    pop($('e1'),st(t,K[4]+.9,.5),{dx:-120,dy:0,s0:.9}); pop($('e2'),st(t,K[4]+2.8,.5),{dx:-120,dy:0,s0:.9}); pop($('e3'),st(t,K[4]+6.2,.5),{dx:-120,dy:0,s0:.9});
    // F still there
    var f=st(t,K[5]-.05,.4); $('F').style.opacity=f;
    for(var k=1;k<=4;k++){pop($('f'+k),st(t,K[5]+.2+k*.6,.5),{dx:140,dy:0,s0:.92});}
    $('f1').style.opacity=lerp(1,.55,st(t,K[5]+1.8,.6))*clamp(st(t,K[5]+.5,.4)*3,0,1);
  }`;
  return { css, html, js };
}
