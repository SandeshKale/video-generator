export default async function (ctx) {
  const css = `
  .col{border:4px solid var(--edge);border-radius:14px 14px 0 0;box-shadow:8px 8px 0 var(--edge);transform-origin:50% 100%;}
  .col.ghost{background:repeating-linear-gradient(135deg,rgba(255,197,61,.35) 0 14px,rgba(255,197,61,.12) 14px 28px)!important;border-style:dashed;border-color:var(--gold);box-shadow:none;}
  .cv{font-family:'Bricolage',sans-serif;font-weight:800;font-size:50px;text-align:center;width:300px;white-space:nowrap;text-shadow:0 5px 0 rgba(12,6,20,.9);}
  .cn{font-family:'JBMono',monospace;font-weight:700;font-size:21px;letter-spacing:.1em;text-align:center;width:300px;color:var(--cream2);}
  .flowbox{width:430px;height:210px;padding:26px 30px;}
  .flowbox .t{font-family:'Bricolage',sans-serif;font-weight:800;font-size:50px;line-height:1;}
  .flowbox .s{font-family:'JBMono',monospace;font-weight:700;font-size:19px;letter-spacing:.08em;margin-top:12px;line-height:1.3;}
  `;
  const cols = [
    ['2024', 17, '#8a6dff', '$17B', false],
    ['2025', 108, '#35f2b0', '$108B', false],
    ['2026 · THROUGH LATE JULY', 194, '#ffc53d', '$194B', false],
    ['2026 · GOLDMAN EST.', 250, '#ffc53d', '~$250B', true],
    ['2027 · GOLDMAN EST.', 400, '#ffc53d', '~$400B', true],
  ];
  const H = 1.22; // px per $B
  const chart = cols.map(([n, v, c, l, g], i) => `
    <div class="abs col ${g ? 'ghost' : ''}" id="col${i}" style="left:${70 + i * 320}px;bottom:70px;width:230px;height:${Math.round(v * H)}px;background:${c};"></div>
    <div class="abs cv" id="cv${i}" style="left:${35 + i * 320}px;bottom:${Math.round(v * H) + 84}px;color:${g ? 'var(--gold)' : 'var(--cream)'};">${l}</div>
    <div class="abs cn" id="cn${i}" style="left:${35 + i * 320}px;bottom:18px;">${n}</div>`).join('');
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card gold" id="aC" style="left:420px;top:140px;width:860px;height:300px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;">
      <div class="lbl" style="font-size:24px;color:#4a3300;">THE BILL IS INCREASINGLY PAID BY</div>
      <div class="big" style="font-size:150px;color:#1a0f26;">LENDERS</div></div>
    <div class="pill cream" id="aP" style="left:470px;top:500px;font-size:26px;">BONDS · LOANS · PRIVATE CREDIT</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">${chart}
    <div class="pill" id="bTag" style="left:20px;top:0;font-size:22px;">AMAZON + ALPHABET + META + ORACLE · BONDS ISSUED</div>
    <div class="pill coral" id="bUp" style="left:395px;top:340px;font-size:34px;rotate:-6deg;">+535%</div>
    <div class="pill mint" id="bOver" style="left:700px;top:150px;font-size:28px;rotate:3deg;">2026 > ALL OF 2025</div>
  </div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl" style="left:90px;top:0;font-size:26px;color:var(--cream2);">META · HYPERION DATA CENTER</div>
    <div class="card flowbox" id="m1" style="left:40px;top:150px;"><div class="t">Meta</div><div class="s dim-t" style="color:#4a3a60">INVESTMENT-GRADE TENANT</div></div>
    <div class="card flowbox gold" id="m2" style="left:635px;top:150px;"><div class="t">$30B SPV</div><div class="s" style="color:#4a3300">JOINT VENTURE WITH BLUE OWL</div></div>
    <div class="card flowbox mint" id="m3" style="left:1230px;top:150px;"><div class="t">~$27B debt</div><div class="s" style="color:#0a4a38">BONDS + LOANS FROM LENDERS</div></div>
    <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">
      <path id="mp1" d="M470 255 L635 255" stroke="#f4efe6" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 12"/>
      <path id="mp2" d="M1065 255 L1230 255" stroke="#f4efe6" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="12 12"/></svg>
    <div class="card dark" id="mNote" style="left:300px;top:440px;width:1100px;height:170px;display:flex;align-items:center;justify-content:center;gap:30px;padding:0 40px;">
      <div class="big mint-t" style="font-size:80px;">OFF</div><div class="h2" style="font-size:48px;">Meta's own balance sheet</div></div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl" style="left:90px;top:0;font-size:26px;color:var(--cream2);">ORACLE · FISCAL 2026</div>
    <div class="card coral" id="oN" style="left:90px;top:80px;width:880px;height:330px;">
      <div class="abs lbl" style="left:40px;top:30px;font-size:22px;color:#4a1410;">FREE CASH FLOW</div>
      <div class="abs big" id="oV" style="left:34px;top:92px;font-size:178px;color:#1a0f26;">−$23.7B</div>
      <div class="abs body" style="left:42px;top:272px;font-size:28px;color:#3a1410;">about a $250B AI buildout in progress</div></div>
    <div class="card dark" id="oT" style="left:1010px;top:80px;width:600px;height:330px;padding:34px 40px;">
      <div class="lbl coral-t" style="font-size:22px;">ONE DATA CENTER CAMPUS</div>
      <div class="big" style="font-size:150px;margin-top:26px;">$38B</div>
      <div class="body dim-t" style="font-size:28px;margin-top:10px;">of debt banks reportedly struggled to sell</div></div>
    <div class="pill coral" id="oS" style="left:1330px;top:40px;font-size:30px;padding:12px 28px;rotate:7deg;">HARD TO SELL</div>
    <div class="card" id="oQ" style="left:90px;top:470px;width:1520px;height:150px;display:flex;align-items:center;gap:36px;padding:0 44px;">
      <div class="h2" style="font-size:44px;">Cash earned by the cloud business &lt; cash poured into data centers, chips and leases.</div></div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card coral" id="cwB" style="left:90px;top:70px;width:420px;height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div class="lbl" style="font-size:22px;color:#4a1410;">COREWEAVE · S&amp;P RATING</div>
      <div class="big" style="font-size:230px;color:#1a0f26;margin-top:8px;">B+</div>
      <div class="pill cream" style="position:relative;margin-top:6px;font-size:26px;">JUNK</div></div>
    <div class="card dark" id="cwD" style="left:590px;top:70px;width:1020px;height:250px;padding:34px 44px;">
      <div class="lbl mint-t" style="font-size:22px;">FEB 2026 · LANCASTER, PENNSYLVANIA</div>
      <div class="h2" style="font-size:64px;margin-top:16px;">Blue Owl tried to raise <span class="gold-t">$4B</span></div>
      <div class="body dim-t" style="font-size:28px;margin-top:14px;">for a data center with CoreWeave as the main tenant.</div></div>
    <div class="stamp" id="cwS" style="left:1290px;top:215px;font-size:64px;rotate:-7deg;">FAILED</div>
    <div class="card gold" id="cwQ" style="left:590px;top:380px;width:1020px;height:150px;display:flex;align-items:center;padding:0 44px;">
      <div class="h2" style="font-size:62px;color:#1a0f26;">“We saw it. We passed.”</div></div>
    <div class="lbl dim-t abs" id="cwQs" style="left:600px;top:550px;font-size:21px;">— A SPECIALIST LENDER, AS REPORTED</div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5].map(function(i){return CUE(i);});
  function moodAt(t){return clamp(.15+.3*st(t,K[2],4)+.45*st(t,K[4],3),0,1);}
  function render(t){
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('aC'),st(t,K[0]+.2,.6),{rot:-3,s0:.5}); pop($('aP'),st(t,K[0]+2.2,.5),{dy:30});
    var b=win(t,K[1]-.05,K[3]-.15,.45); $('B').style.opacity=b;
    pop($('bTag'),st(t,K[1]+.1,.5),{dy:-20});
    var reveal=[K[1]+1.3,K[1]+4.6,K[1]+9.0,K[2]+1.0,K[2]+3.4];
    for(var i=0;i<5;i++){var e=st(t,reveal[i],1.0);$('col'+i).style.transform='scaleY('+eoc(e)+')';
      pop($('cv'+i),st(t,reveal[i]+.7,.4),{dy:16}); pop($('cn'+i),st(t,reveal[i]-.3,.4),{dy:10});}
    pop($('bUp'),st(t,K[1]+6.2,.5),{rot:-12,s0:.3,dy:0}); pop($('bOver'),st(t,K[1]+11.0,.5),{rot:8,s0:.3,dy:0});
    var c=win(t,K[3]-.05,K[4]-.15,.45); $('C').style.opacity=c;
    pop($('m1'),st(t,K[3]+.2,.5),{dx:-100,dy:0,s0:.9}); pop($('m2'),st(t,K[3]+1.2,.5),{dx:-100,dy:0,s0:.9}); pop($('m3'),st(t,K[3]+2.4,.5),{dx:-100,dy:0,s0:.9});
    $('mp1').setAttribute('stroke-dashoffset',-(t*40)); $('mp2').setAttribute('stroke-dashoffset',-(t*40));
    $('mp1').style.opacity=st(t,K[3]+.9,.3); $('mp2').style.opacity=st(t,K[3]+2.1,.3);
    pop($('mNote'),st(t,K[3]+4.5,.5),{dy:40});
    var d=win(t,K[4]-.05,K[5]-.15,.45); $('D').style.opacity=d;
    pop($('oN'),st(t,K[4]+.2,.55),{dx:-100,dy:0,s0:.9});
    var neg=st(t,K[4]+.9,1.6); $('oV').textContent='−$'+(23.7*eoc(neg)).toFixed(1)+'B';
    pop($('oT'),st(t,K[4]+5.6,.55),{dx:100,dy:0,s0:.9}); pop($('oS'),st(t,K[4]+7.4,.5),{rot:14,s0:.3,dy:0});
    pop($('oQ'),st(t,K[4]+9.0,.5),{dy:40});
    var e5=st(t,K[5]-.05,.4); $('E').style.opacity=e5;
    pop($('cwB'),st(t,K[5]+.5,.55),{dx:-100,dy:0,s0:.8,rot:-5}); pop($('cwD'),st(t,K[5]+3.4,.55),{dx:100,dy:0,s0:.92});
    pop($('cwS'),st(t,K[5]+8.2,.45),{rot:-16,s0:.2,dy:0});
    pop($('cwQ'),st(t,K[5]+10.6,.5),{dy:40}); fade($('cwQs'),st(t,K[5]+11.0,.5));
  }`;
  return { css, html, js };
}
