export default async function (ctx) {
  const css = `
  .stat{width:500px;height:250px;padding:30px 36px;}
  .stat .a{font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:.1em;}
  .stat .b{font-family:'Bricolage',sans-serif;font-weight:800;font-size:112px;line-height:1;margin-top:14px;}
  .stat .c{font-family:'Inter',sans-serif;font-weight:600;font-size:25px;margin-top:10px;line-height:1.25;}
  .tile{width:62px;height:62px;border-radius:12px;border:4px solid var(--edge);}
  .dot{width:36px;height:36px;border-radius:50%;border:3px solid var(--edge);}
  .vbar{border:4px solid var(--edge);border-radius:12px 12px 0 0;box-shadow:7px 7px 0 var(--edge);transform-origin:50% 100%;}
  `;
  let tiles = ''; for (let i = 0; i < 20; i++) tiles += `<div class="abs tile" id="tile${i}" style="left:${(i % 10) * 76}px;top:${Math.floor(i / 10) * 76}px;background:${i === 0 ? 'var(--gold)' : '#3a2a58'};opacity:0;"></div>`;
  let dots = ''; for (let i = 0; i < 100; i++) dots += `<div class="abs dot" id="dot${i}" style="left:${(i % 20) * 48}px;top:${Math.floor(i / 20) * 48}px;background:${i < 95 ? 'var(--coral)' : 'var(--mint)'};opacity:0;"></div>`;
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs big" id="aQ" style="left:150px;top:120px;width:1400px;text-align:center;font-size:150px;line-height:.98;">Who pays it <span class="coral-t">back?</span></div>
    <div class="pill gold" id="aP" style="left:520px;top:520px;font-size:30px;rotate:-2deg;">THE ONE QUESTION EVERY LENDER ASKS</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card stat dark" id="s1" style="left:30px;top:20px;"><div class="a mint-t">OPENAI · AUG 2026</div><div class="b">~$40B</div><div class="c dim-t">annualized revenue run rate</div></div>
    <div class="card" id="bBars" style="left:570px;top:20px;width:1100px;height:310px;">
      <div class="abs lbl" style="left:36px;top:24px;font-size:20px;color:#4a3a60;">Q1 2026 · ONE QUARTER</div>
      <div class="abs" id="qb1" style="left:36px;top:80px;height:70px;width:0;background:var(--mint);border:4px solid var(--edge);border-radius:12px;"></div>
      <div class="abs big" id="qv1" style="left:250px;top:96px;font-size:40px;opacity:0;">$5.7B revenue</div>
      <div class="abs" id="qb2" style="left:36px;top:190px;height:70px;width:0;background:var(--coral);border:4px solid var(--edge);border-radius:12px;"></div>
      <div class="abs big" id="qv2" style="left:56px;top:206px;font-size:40px;opacity:0;">$21.3B net loss</div>
      <div class="abs lbl" id="qn" style="left:620px;top:274px;font-size:17px;color:#6a5a80;opacity:0;">~$12.4B OF THE LOSS WAS NON-CASH</div>
    </div>
    <div class="card tl5r dark" id="bTl" style="left:30px;top:400px;width:1640px;height:230px;">
      <div class="abs lbl" style="left:40px;top:26px;font-size:20px;color:var(--cream2);">WHEN OPENAI EXPECTS TO BE CASH-FLOW POSITIVE</div>
      <div class="abs" style="left:60px;top:120px;width:1520px;height:10px;border-radius:5px;background:rgba(244,239,230,.2);"></div>
      <div class="abs" id="tlFill" style="left:60px;top:120px;width:0;height:10px;border-radius:5px;background:var(--mint);"></div>
      ${[2026, 2027, 2028, 2029, 2030].map((y, i) => `<div class="abs lbl" style="left:${60 + i * 380 - 40}px;top:150px;width:80px;text-align:center;font-size:24px;color:${y === 2030 ? 'var(--mint)' : 'var(--cream2)'};">${y}</div><div class="abs" style="left:${60 + i * 380 - 10}px;top:110px;width:20px;height:30px;border-radius:50%;background:${y === 2030 ? 'var(--mint)' : 'var(--cream2)'};border:3px solid var(--edge);"></div>`).join('')}
      <div class="pill mint" id="tlP" style="left:1290px;top:60px;font-size:22px;rotate:-3deg;">≈ 2030</div>
    </div>
  </div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs" id="tiles" style="left:470px;top:60px;width:760px;height:152px;">${tiles}</div>
    <div class="abs lbl" style="left:470px;top:20px;font-size:20px;color:var(--cream2);" id="cLbl">ANNUAL SPENDING · ONE TILE</div>
    <div class="abs big" id="c20" style="left:350px;top:260px;width:1000px;text-align:center;font-size:330px;color:var(--coral);text-shadow:0 12px 0 rgba(12,6,20,.9);">20×</div>
    <div class="card dark" id="cCard" style="left:350px;top:590px;width:1000px;height:110px;display:flex;align-items:center;justify-content:center;"><div class="h2" style="font-size:42px;">long-term compute commitments vs. annual spend</div></div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs" id="dots" style="left:60px;top:40px;width:960px;height:240px;">${dots}</div>
    <div class="card coral" id="dBig" style="left:60px;top:330px;width:960px;height:210px;display:flex;align-items:center;gap:30px;padding:0 40px;">
      <div class="big" style="font-size:150px;color:#1a0f26;">95%</div><div class="h2" style="font-size:44px;color:#1a0f26;">of enterprise AI pilots: no measurable profit impact</div></div>
    <div class="card dark" id="dSrc" style="left:1110px;top:40px;width:520px;height:250px;padding:30px 34px;">
      <div class="lbl mint-t" style="font-size:19px;">MIT · PROJECT NANDA · JULY 2025</div>
      <div class="body" style="font-size:27px;margin-top:16px;line-height:1.3;">150 executive interviews, 300 deployments studied.</div></div>
    <div class="card gold" id="dCav" style="left:1110px;top:330px;width:520px;height:210px;padding:28px 34px;">
      <div class="lbl" style="font-size:19px;color:#4a3300;">THE CAVEAT</div>
      <div class="h2" style="font-size:38px;margin-top:12px;color:#1a0f26;">Critics say the headline is often misread.</div></div>
    <div class="pill cream" id="dP" style="left:60px;top:590px;font-size:26px;">ADOPTION IS LAGGING INFRASTRUCTURE</div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">
      <g id="beam" transform="translate(850 330) rotate(0)">
        <rect x="-520" y="-9" width="1040" height="18" rx="9" fill="#f4efe6" stroke="#0c0614" stroke-width="5"/>
      </g>
      <path d="M850 330 L760 620 L940 620 Z" fill="#f4efe6" stroke="#0c0614" stroke-width="6" stroke-linejoin="round"/>
    </svg>
    <div class="card" id="eL" style="left:0;top:0;width:330px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--mint);">
      <div class="big" style="font-size:62px;">TODAY</div><div class="lbl" style="font-size:18px;">REVENUE</div></div>
    <div class="card" id="eR" style="left:0;top:0;width:430px;height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--coral);">
      <div class="big" style="font-size:54px;">COMMITTED</div><div class="lbl" style="font-size:18px;">SPEND</div></div>
    <div class="pill gold" id="eP" style="left:540px;top:90px;font-size:34px;rotate:-2deg;">THE BET: TOMORROW'S REVENUE CATCHES UP</div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4].map(function(i){return CUE(i);});
  function moodAt(t){return clamp(.45+.4*st(t,K[2],3),0,1);}
  function render(t){
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('aQ'),st(t,K[0]+.3,.7),{s0:.7}); pop($('aP'),st(t,K[0]+2.6,.5),{dy:30});
    var b=win(t,K[1]-.05,K[2]-.15,.45); $('B').style.opacity=b;
    pop($('s1'),st(t,K[1]+.2,.55),{dx:-100,dy:0,s0:.9}); pop($('bBars'),st(t,K[1]+1.6,.55),{dx:100,dy:0,s0:.92});
    $('qb1').style.width=(180*eoc(st(t,K[1]+3.0,.9)))+'px'; fade($('qv1'),st(t,K[1]+3.6,.4));
    $('qb2').style.width=(700*eoc(st(t,K[1]+5.2,1.1)))+'px'; fade($('qv2'),st(t,K[1]+6.0,.4)); fade($('qn'),st(t,K[1]+7.0,.5));
    pop($('bTl'),st(t,K[1]+9.0,.55),{dy:50}); $('tlFill').style.width=(1520*eoc(st(t,K[1]+10.0,3.0)))+'px'; pop($('tlP'),st(t,K[1]+13.2,.45),{rot:-10,s0:.3,dy:0});
    var c=win(t,K[2]-.05,K[3]-.15,.45); $('C').style.opacity=c;
    for(var i=0;i<20;i++){var e=st(t,K[2]+.3+i*.12,.35);var tl=$('tile'+i);tl.style.opacity=e;tl.style.transform='scale('+(.4+.6*eob(e))+')';}
    pop($('c20'),st(t,K[2]+2.8,.6),{s0:.3,rot:-6}); pop($('cCard'),st(t,K[2]+3.6,.5),{dy:40});
    var d=win(t,K[3]-.05,K[4]-.15,.45); $('D').style.opacity=d;
    for(var j=0;j<100;j++){var ee=st(t,K[3]+.4+j*.025,.3);var dd=$('dot'+j);dd.style.opacity=ee;dd.style.transform='scale('+(.3+.7*eob(ee))+')';}
    pop($('dBig'),st(t,K[3]+3.6,.55),{dx:-100,dy:0,s0:.92});
    pop($('dSrc'),st(t,K[3]+.8,.55),{dx:100,dy:0,s0:.92}); pop($('dCav'),st(t,K[3]+9.0,.55),{dx:100,dy:0,s0:.92}); pop($('dP'),st(t,K[3]+12.5,.5),{dy:30});
    var e5=st(t,K[4]-.05,.45); $('E').style.opacity=e5;
    var tilt=lerp(0,7,eio(st(t,K[4]+.5,1.6)))+1.2*Math.sin(t*1.7)*st(t,K[4]+2.4,.5);
    $('beam').setAttribute('transform','translate(850 330) rotate('+tilt+')');
    var ang=tilt*Math.PI/180, cs=Math.cos(ang), sn=Math.sin(ang);
    var lx=850-520*cs, ly=330-520*sn-9-140, rx=850+520*cs, ry=330+520*sn-9-190;
    var eL=$('eL'), eR=$('eR'); var ow=st(t,K[4]+.2,.5);
    eL.style.opacity=ow; eR.style.opacity=ow;
    eL.style.transform='translate('+(lx-165)+'px,'+(ly)+'px) rotate('+tilt+'deg)';
    eR.style.transform='translate('+(rx-215)+'px,'+(ry)+'px) rotate('+tilt+'deg)';
    pop($('eP'),st(t,K[4]+3.4,.5),{dy:-20});
  }`;
  return { css, html, js };
}
