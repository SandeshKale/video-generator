export default async function (ctx) {
  const I = {};
  for (const n of ['server', 'cpu', 'currency-dollar', 'refresh', 'alert-triangle']) I[n] = await ctx.icon(n);
  const openai = await ctx.mono('logos/gilbarbara/openai-icon.svg');
  let coins = '';
  for (let i = 0; i < 64; i++) coins += `<div class="abs coin" id="coin${i}" style="left:${(i * 83) % 1660 + 10}px;top:-60px;"></div>`;
  const css = `
  .coin{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe9a8,#ffc53d 55%,#c98a00);border:3px solid #0c0614;box-shadow:0 4px 0 #0c0614;opacity:0;}
  #cnt{left:0;top:70px;width:1700px;text-align:center;transform-origin:50% 50%;}
  #cntNum{font-size:330px;color:var(--cream);text-shadow:0 10px 0 rgba(12,6,20,.9), 0 0 60px rgba(53,242,176,.45);}
  #cntNum span{color:var(--mint);}
  #cntSub{margin-top:6px;font-size:28px;color:var(--cream2);}
  .barlbl{font-family:'JBMono',monospace;font-weight:700;font-size:22px;letter-spacing:.06em;}
  .role{width:420px;height:300px;}
  .role .ic{width:96px;height:96px;margin:30px auto 14px;display:block;}
  .role .t{font-family:'Bricolage',sans-serif;font-weight:800;font-size:38px;text-align:center;line-height:1.05;}
  .role .s{font-family:'JBMono',monospace;font-weight:700;font-size:19px;text-align:center;margin-top:12px;letter-spacing:.1em;}
  .promise{left:300px;width:1100px;height:150px;display:flex;align-items:center;gap:30px;padding:0 40px;}
  .promise .n{font-family:'Bricolage',sans-serif;font-weight:800;font-size:92px;color:var(--coral);width:80px;}
  .promise .p{font-family:'Bricolage',sans-serif;font-weight:800;font-size:46px;line-height:1.05;}
  `;
  const html = `
  ${coins}
  <div id="cnt" class="abs"><div id="cntNum" class="big"><span>$</span><b id="cntV">0.00</b><span>T</span></div>
    <div id="cntSub" class="lbl">REPORTED OPENAI COMPUTE COMMITMENTS, 2025–2035</div></div>

  <div id="tallies" class="abs" style="left:0;top:480px;width:1700px;">
    <div class="pill gold" id="tl1" style="left:150px;top:0;font-size:25px;">$1.15T · SEVEN-VENDOR TALLY</div>
    <div class="pill cream" id="tl2" style="left:760px;top:0;font-size:25px;">$665B · LONG-TERM COMPUTE COMMITMENTS</div>
  </div>

  <div id="bars" class="abs" style="left:560px;top:90px;width:1100px;height:560px;">
    <div class="card dark" id="barCard" style="left:0;top:0;width:1100px;height:290px;">
      <div class="lbl" style="position:absolute;left:34px;top:22px;font-size:21px;color:var(--cream2);">COMMITTED vs. EARNED</div>
      <div id="bar1" class="abs" style="left:34px;top:76px;height:62px;width:0;background:var(--mint);border:4px solid var(--edge);border-radius:12px;"></div>
      <div id="bar1l" class="abs barlbl" style="left:54px;top:92px;color:#10241d;">$1.15T COMMITTED</div>
      <div id="bar2" class="abs" style="left:34px;top:178px;height:62px;width:0;background:var(--gold);border:4px solid var(--edge);border-radius:12px;"></div>
      <div id="bar2l" class="abs barlbl gold-t" style="left:114px;top:194px;">≈ $40B ANNUALIZED REVENUE · ~3.5%</div>
    </div>
    <div class="card coral" id="lossCard" style="left:90px;top:360px;width:920px;height:190px;">
      <div class="abs big" id="lossNum" style="left:36px;top:28px;font-size:118px;color:#1a0f26;">−$21.3B</div>
      <div class="abs h2" style="left:470px;top:36px;font-size:40px;color:#1a0f26;width:420px;">net loss in a single quarter</div>
      <div class="abs lbl" style="left:470px;top:128px;font-size:18px;color:#3a1410;">Q1 2026 · ~$12.4B OF IT NON-CASH</div>
    </div>
  </div>

  <div id="roles" class="abs" style="left:0;top:40px;width:1700px;height:640px;">
    <div class="card role" id="r1" style="left:60px;top:40px;rotate:-2deg;"><div class="icon-sz ic">${I.server}</div><div class="t">Builds the data centers</div><div class="s coral-t" style="color:#a3281c">NOT OPENAI</div></div>
    <div class="card role gold" id="r2" style="left:640px;top:0;rotate:1.5deg;"><div class="icon-sz ic">${I.cpu}</div><div class="t">Makes the chips</div><div class="s" style="color:#6b4a00">NOT OPENAI</div></div>
    <div class="card role mint" id="r3" style="left:1220px;top:40px;rotate:-1.5deg;"><div class="icon-sz ic">${I.currency}</div><div class="t">Lends the money</div><div class="s" style="color:#0a5a41">NOT OPENAI</div></div>
    <div class="card dark" id="loopBadge" style="left:470px;top:380px;width:760px;height:210px;display:flex;align-items:center;justify-content:center;gap:34px;">
      <div class="icon-sz" id="loopIc" style="width:110px;height:110px;color:var(--mint)">${I.refresh}</div>
      <div class="big" style="font-size:72px;line-height:1">for each other.</div>
    </div>
  </div>

  <div id="promises" class="abs" style="left:0;top:20px;width:1700px;height:700px;">
    <div class="card promise" id="pr1" style="top:30px;"><div class="n">1</div><div class="p">How the circle actually works</div></div>
    <div class="card promise mint" id="pr2" style="top:230px;"><div class="n" style="color:#1a0f26">2</div><div class="p">Why smart investors think it ends badly</div></div>
    <div class="card promise gold" id="pr3" style="top:430px;"><div class="n" style="color:#1a0f26">3</div><div class="p">Why insiders say this time is different</div></div>
  </div>`.replace('${I.currency}', I['currency-dollar']);
  const js = `
  var CO=[CUE(0),CUE(1),CUE(2),CUE(3),CUE(4),CUE(5)];
  var MOOD=0;
  function moodAt(t){return st(t,CO[2],1.2)*0.55*(1-st(t,CO[5],1));}
  function render(t){
    // ---- counter: rolls up during sentence 0, then shrinks to a corner badge ----
    var e=st(t,CO[0]-.05,ENDT(0)-CO[0]+.5);
    var v=1.15*eio(e);
    $('cntV').textContent=v.toFixed(2);
    var shrink=eio(st(t,CO[2]-.1,.8)), gone=st(t,CO[3]-.1,.6);
    var s=lerp(1,.42,shrink), x=lerp(0,-560,shrink), y=lerp(0,-70,shrink);
    var cn=$('cnt'); cn.style.opacity=clamp(st(t,CO[0]-.1,.25)*(1-gone),0,1);
    cn.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';
    $('cntSub').style.opacity=1-shrink;
    // ---- coin rain while the number lands ----
    for(var i=0;i<64;i++){var c=$('coin'+i);var life=win(t,CO[0]-.1,CO[2]+.4,.4);
      var sp=190+hash(i+3)*260, ph=hash(i+11)*900;
      var y=((t-CO[0])*sp+ph)%900-90;
      c.style.top=y+'px'; c.style.opacity=life*(0.35+0.65*hash(i+7));
      c.style.transform='rotate('+((t*140+i*40)%360)+'deg) scale('+(.7+hash(i+5)*.7)+')';}
    // ---- tally pills ----
    pop($('tl1'),st(t,CO[1]+.5,.4)*1,{dy:30}); pop($('tl2'),st(t,CO[1]+2.2,.4),{dy:30});
    $('tallies').style.opacity=win(t,CO[1]+.4,CO[2]+.3,.35);
    // ---- commitments vs earned bars ----
    var bv=win(t,CO[2]+.2,CO[3]-.1,.4); $('bars').style.opacity=bv;
    pop($('barCard'),st(t,CO[2]+.2,.5),{dy:40});
    $('bar1').style.width=(1032*eoc(st(t,CO[2]+.9,1.1)))+'px';
    $('bar2').style.width=(Math.max(8,1032*(40/1150))*eoc(st(t,CO[2]+2.6,.8)))+'px';
    $('bar1l').style.opacity=st(t,CO[2]+1.6,.4); $('bar2l').style.opacity=st(t,CO[2]+3.2,.4);
    pop($('lossCard'),st(t,CO[2]+4.2,.55),{dy:50,rot:2});
    // ---- roles ----
    var rv=win(t,CO[3]+.1,CO[5]-.1,.4); $('roles').style.opacity=rv;
    pop($('r1'),st(t,CO[3]+1.0,.5),{dy:60}); pop($('r2'),st(t,CO[3]+1.5,.5),{dy:60}); pop($('r3'),st(t,CO[3]+2.0,.5),{dy:60});
    pop($('loopBadge'),st(t,CO[4]+.1,.55),{dy:50});
    $('loopIc').style.transform='rotate('+(t*140)+'deg)';
    // ---- what you'll learn ----
    var pv=st(t,CO[5]-.1,.4); $('promises').style.opacity=pv;
    pop($('pr1'),st(t,CO[5]+1.0,.5),{dx:-160,dy:0,s0:.9}); pop($('pr2'),st(t,CO[5]+4.2,.5),{dx:160,dy:0,s0:.9}); pop($('pr3'),st(t,CO[5]+7.4,.5),{dx:-160,dy:0,s0:.9});
  }`;
  return { css, html, js };
}
