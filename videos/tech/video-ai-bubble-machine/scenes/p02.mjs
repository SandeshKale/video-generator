export default async function (ctx) {
  const I = {};
  for (const n of ['bolt', 'server', 'chart-bar']) I[n] = await ctx.icon(n);
  const css = `
  .hbar{height:112px;border:4px solid var(--edge);border-radius:16px;box-shadow:7px 7px 0 var(--edge);}
  .hlab{font-family:'Bricolage',sans-serif;font-weight:800;font-size:46px;}
  .tower{width:240px;border:4px solid var(--edge);border-radius:18px 18px 0 0;box-shadow:8px 8px 0 var(--edge);
    background:
      repeating-linear-gradient(0deg, transparent 0 22px, rgba(12,6,20,.55) 22px 26px),
      repeating-linear-gradient(90deg, transparent 0 46px, rgba(12,6,20,.4) 46px 50px),
      var(--c);}
  .tname{font-family:'Bricolage',sans-serif;font-weight:800;font-size:34px;text-align:center;width:340px;}
  .tval{font-family:'Bricolage',sans-serif;font-weight:800;font-size:56px;text-align:center;width:340px;white-space:nowrap;color:var(--cream);text-shadow:0 5px 0 rgba(12,6,20,.9);}
  .ringtxt{font-size:92px;}
  .u41{font-size:230px;}
  `;
  const towers = [
    ['AMAZON', 220, '#35f2b0', '$220B'],
    ['ALPHABET', 200, '#ffc53d', '~$200B'],
    ['MICROSOFT', 175, '#8a6dff', '$175B+'],
    ['META', 145, '#ff5d4d', 'up to $145B'],
  ].map(([n, v, c, l], i) => `
    <div class="abs tower" id="tw${i}" style="left:${100 + i * 400}px;bottom:70px;height:${Math.round(v * 2.3)}px;--c:${c};transform-origin:50% 100%;"></div>
    <div class="abs tval" id="tv${i}" style="left:${50 + i * 400}px;bottom:${Math.round(v * 2.3) + 84}px;">${l}</div>
    <div class="abs tname" id="tn${i}" style="left:${50 + i * 400}px;bottom:14px;">${n}</div>`).join('');
  const R = 170, C = 2 * Math.PI * R;
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl" id="aL1" style="left:0;top:110px;font-size:34px;width:210px;text-align:right;color:var(--cream2);">2025</div>
    <div class="abs hbar" id="aB1" style="left:240px;top:90px;width:0;background:var(--mint);"></div>
    <div class="abs hlab" id="aV1" style="left:276px;top:112px;color:#10241d;opacity:0;">$410B</div>
    <div class="abs lbl" id="aL2" style="left:0;top:330px;font-size:34px;width:210px;text-align:right;color:var(--cream2);">2026 PLAN</div>
    <div class="abs hbar" id="aB2" style="left:240px;top:310px;width:0;background:var(--gold);"></div>
    <div class="abs hlab" id="aV2" style="left:276px;top:332px;color:#2a1c00;opacity:0;">~$725B</div>
    <div class="pill coral" id="aUp" style="left:1260px;top:200px;font-size:44px;padding:16px 32px;rotate:-4deg;">+77%</div>
    <div class="card" id="aNote" style="left:240px;top:500px;width:1220px;height:130px;display:flex;align-items:center;padding:0 36px;">
      <div class="h2" style="font-size:40px;">Amazon · Alphabet · Microsoft · Meta — mostly AI infrastructure</div></div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">${towers}
    <div class="pill cream" id="bTag" style="left:560px;top:0;font-size:24px;">2026 CAPEX GUIDANCE · COMPANY-REPORTED RANGES</div></div>
  <div id="Cc" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <svg class="abs" style="left:150px;top:90px" width="480" height="480" viewBox="0 0 480 480">
      <circle cx="240" cy="240" r="${R}" fill="none" stroke="rgba(244,239,230,.16)" stroke-width="44"/>
      <circle id="ringM" cx="240" cy="240" r="${R}" fill="none" stroke="#35f2b0" stroke-width="44" stroke-linecap="butt" transform="rotate(-90 240 240)" stroke-dasharray="0 ${C}"/>
      <circle id="ringO" cx="240" cy="240" r="${R}" fill="none" stroke="#ff5d4d" stroke-width="52" stroke-linecap="round" transform="rotate(-90 240 240)" stroke-dasharray="0 ${C}"/>
    </svg>
    <div class="abs big ringtxt" id="ringT" style="left:150px;top:268px;width:480px;text-align:center;">0%</div>
    <div class="card dark" id="cCard" style="left:740px;top:150px;width:880px;height:340px;padding:40px 46px;">
      <div class="lbl mint-t" style="font-size:22px;">BIG THREE CLOUDS · 2026</div>
      <div class="h2" style="font-size:66px;margin-top:16px;">Capex ≈ 102% of cloud revenue</div>
      <div class="body dim-t" style="font-size:30px;margin-top:20px;">Every dollar the cloud earns goes straight back into concrete, chips and power.</div>
    </div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs lbl" style="left:120px;top:70px;font-size:24px;color:var(--cream2);">UBS PROJECTION · AI INFRASTRUCTURE SPEND</div>
    <div class="abs lbl" style="left:120px;top:200px;font-size:26px;width:380px;color:var(--cream2);">PREVIOUS SIX YEARS</div>
    <div class="abs hbar" id="dB1" style="left:120px;top:250px;width:0;background:var(--cream);"></div>
    <div class="abs hlab" id="dV1" style="left:150px;top:272px;color:#1a0f26;opacity:0;">$1.3T</div>
    <div class="abs lbl" style="left:120px;top:400px;font-size:26px;width:600px;color:var(--cream2);">2026 → 2028 (THREE YEARS)</div>
    <div class="abs hbar" id="dB2" style="left:120px;top:450px;width:0;background:var(--coral);"></div>
    <div class="abs hlab" id="dV2" style="left:150px;top:472px;color:#1a0f26;opacity:0;">$4.1T</div>
    <div class="pill gold" id="dX" style="left:1180px;top:130px;font-size:52px;padding:18px 36px;rotate:5deg;">≈ 3×</div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card gold" id="eCard" style="left:140px;top:120px;width:360px;height:360px;display:flex;align-items:center;justify-content:center;">
      <div class="icon-sz" id="eBolt" style="width:220px;height:220px;color:#1a0f26">${I['bolt']}</div></div>
    <div class="abs h2" id="eT1" style="left:590px;top:110px;font-size:104px;width:1000px;">Gigawatt</div>
    <div class="abs h2" id="eT2" style="left:590px;top:228px;font-size:104px;width:1000px;color:var(--mint)">campuses.</div>
    <div class="pill cream" id="eP1" style="left:600px;top:400px;font-size:26px;">POWER DRAW OF A MID-SIZED CITY</div>
    <div class="pill mint" id="eP2" style="left:600px;top:478px;font-size:26px;">NOT SERVER ROOMS ANYMORE</div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5,6].map(function(i){return CUE(i);});
  var MOOD=0;
  function render(t){
    // A: 2025 vs 2026 bars
    var a=win(t,K[1]-.1,K[3]-.15,.4); $('A').style.opacity=a;
    $('aB1').style.width=(779*eoc(st(t,K[1]+.1,1.2)))+'px'; fade($('aV1'),st(t,K[1]+1.1,.4));
    $('aB2').style.width=(1378*eoc(st(t,K[2]+.1,1.4)))+'px'; fade($('aV2'),st(t,K[2]+1.3,.4));
    pop($('aUp'),st(t,K[2]+1.4,.5),{dy:40,rot:-10,s0:.3});
    pop($('aNote'),st(t,K[1]+1.8,.5),{dy:40});
    fade($('aL1'),st(t,K[1],.4)); fade($('aL2'),st(t,K[2],.4));
    // B: the four towers
    var b=win(t,K[3]-.1,K[4]-.15,.45); $('B').style.opacity=b;
    pop($('bTag'),st(t,K[3]+.1,.4),{dy:-20});
    for(var i=0;i<4;i++){var e=st(t,K[3]+.25+i*.55,.9);
      $('tw'+i).style.transform='scaleY('+eoc(e)+')';
      pop($('tv'+i),st(t,K[3]+.9+i*.55,.45),{dy:20}); pop($('tn'+i),st(t,K[3]+.4+i*.55,.4),{dy:12});}
    // C: capex vs cloud revenue ring
    var c=win(t,K[4]-.1,K[5]-.15,.45); $('Cc').style.opacity=c;
    var C=${C.toFixed(2)};
    var m=eoc(st(t,K[4]+.2,1.6)); $('ringM').setAttribute('stroke-dasharray',(C*m)+' '+C);
    var o=eoc(st(t,K[4]+1.8,.7)); $('ringO').setAttribute('stroke-dasharray',(C*.03*o)+' '+C);
    $('ringT').textContent=Math.round(102*eio(st(t,K[4]+.2,2.0)))+'%';
    $('ringT').style.color=o>.5?'var(--coral)':'var(--cream)';
    pop($('cCard'),st(t,K[4]+.9,.55),{dx:120,dy:0,s0:.9});
    // D: UBS
    var d=win(t,K[5]-.1,K[6]-.15,.45); $('D').style.opacity=d;
    $('dB1').style.width=(310*eoc(st(t,K[5]+.3,1.0)))+'px'; fade($('dV1'),st(t,K[5]+1.0,.4));
    $('dB2').style.width=(980*eoc(st(t,K[5]+1.2,1.3)))+'px'; fade($('dV2'),st(t,K[5]+2.0,.4));
    pop($('dX'),st(t,K[5]+2.6,.5),{rot:12,s0:.2});
    // E: gigawatt campuses
    var e5=st(t,K[6]-.05,.4); $('E').style.opacity=e5;
    pop($('eCard'),st(t,K[6]+.1,.55),{dx:-100,dy:0,s0:.8,rot:-6});
    $('eBolt').style.transform='scale('+(1+.06*Math.sin(t*5))+')';
    rise($('eT1'),st(t,K[6]+.3,.5),30,60); rise($('eT2'),st(t,K[6]+.6,.5),30,60);
    pop($('eP1'),st(t,K[6]+1.4,.45),{dy:30}); pop($('eP2'),st(t,K[6]+2.1,.45),{dy:30});
  }`;
  return { css, html, js };
}
