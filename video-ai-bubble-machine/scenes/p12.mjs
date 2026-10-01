import { POS, nodeCss, nodeHtml, webAssets, edge } from './web.mjs';
export default async function (ctx) {
  const I = {};
  for (const n of ['chart-line', 'scale', 'alert-triangle', 'cpu', 'bolt', 'eye', 'refresh']) I[n] = await ctx.icon(n);
  const logos = await webAssets(ctx);
  const ids = ['openai', 'nvidia', 'oracle', 'coreweave', 'amd'];
  const E = [['nvidia', 'openai', 0], ['openai', 'oracle', 0], ['openai', 'amd', 0], ['coreweave', 'nvidia', 0], ['oracle', 'nvidia', 190]].map(([a, b, bu]) => edge(a, b, bu));
  const css = nodeCss() + `
  .yr2{width:560px;height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .both{width:730px;height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:0 40px;}
  .watch{width:1500px;height:176px;display:flex;align-items:center;gap:40px;padding:0 44px;}
  .watch .nn{font-family:'Bricolage',sans-serif;font-weight:800;font-size:120px;line-height:1;width:100px;color:var(--coral);}
  .watch .tt{font-family:'Bricolage',sans-serif;font-weight:800;font-size:54px;line-height:1.02;}
  .watch .ss{font-family:'JBMono',monospace;font-weight:700;font-size:21px;letter-spacing:.08em;margin-top:10px;}
  .watch .ic{width:96px;height:96px;margin-left:auto;}
  .nextc{width:640px;height:230px;display:flex;align-items:center;gap:30px;padding:0 40px;}
  `;
  const base = E.map((e) => `<path d="${e.d}" fill="none" stroke="rgba(244,239,230,.5)" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"/>`).join('');
  const html = `
  <div id="A" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card yr2 dark" id="a96" style="left:130px;top:130px;"><div class="big" style="font-size:200px;">1996</div><div class="lbl mint-t" style="font-size:20px;">EARLY · INFRASTRUCTURE BOOM</div></div>
    <div class="big abs" id="aQ" style="left:760px;top:140px;width:180px;text-align:center;font-size:270px;color:var(--gold);text-shadow:0 10px 0 rgba(12,6,20,.9);">?</div>
    <div class="card yr2 darkc" id="a99" style="left:1010px;top:130px;"><div class="big" style="font-size:200px;">1999</div><div class="lbl coral-t" style="font-size:20px;">LATE · BEFORE THE BUST</div></div>
    <div class="pill gold" id="aP" style="left:480px;top:560px;font-size:30px;rotate:-2deg;">NOBODY KNOWS YET WHICH ONE THIS IS</div>
  </div>
  <div id="B" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card both mint" id="b1" style="left:50px;top:110px;"><div class="big" style="font-size:78px;color:#1a0f26;">The buildings</div><div class="h2" style="font-size:44px;color:#1a0f26;">might power the next two decades of technology</div></div>
    <div class="big abs" id="bP" style="left:790px;top:240px;width:120px;text-align:center;font-size:130px;color:var(--gold);text-shadow:0 8px 0 rgba(12,6,20,.9);">+</div>
    <div class="card both coral" id="b2" style="left:920px;top:110px;"><div class="big" style="font-size:78px;color:#1a0f26;">The borrowers</div><div class="h2" style="font-size:44px;color:#1a0f26;">some overleveraged companies get restructured</div></div>
    <div class="pill cream" id="bT" style="left:480px;top:540px;font-size:30px;rotate:-2deg;">BOTH OUTCOMES CAN BE TRUE AT ONCE</div>
  </div>
  <div id="C" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs big" id="cN" style="left:200px;top:-20px;width:600px;text-align:center;font-size:640px;color:var(--gold);text-shadow:0 20px 0 rgba(12,6,20,.9);line-height:1;">3</div>
    <div class="abs h2" id="cT1" style="left:820px;top:210px;width:800px;font-size:112px;">things to</div><div class="abs h2 mint-t" id="cT2" style="left:820px;top:330px;width:800px;font-size:112px;">watch.</div>
    <div class="icon-sz abs" id="cE" style="left:830px;top:490px;width:100px;height:100px;color:var(--cream)">${I['eye']}</div>
  </div>
  <div id="D" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card watch" id="w1" style="left:100px;top:20px;"><div class="nn">1</div><div><div class="tt">Nvidia's earnings</div><div class="ss dim-t" style="color:#4a3a60">ANY CRACK IN CHIP DEMAND</div></div><div class="icon-sz ic">${I['chart-line']}</div></div>
    <div class="card watch gold" id="w2" style="left:100px;top:260px;"><div class="nn" style="color:#1a0f26">2</div><div><div class="tt" style="color:#1a0f26">Revenue ÷ compute commitments</div><div class="ss" style="color:#4a3300">OPENAI + ANTHROPIC</div></div><div class="icon-sz ic" style="color:#1a0f26">${I['scale']}</div></div>
    <div class="card watch coral" id="w3" style="left:100px;top:500px;"><div class="nn" style="color:#1a0f26">3</div><div><div class="tt" style="color:#1a0f26">Credit spreads + ratings</div><div class="ss" style="color:#4a1410">THE DATA CENTER BORROWERS · COREWEAVE · ORACLE</div></div><div class="icon-sz ic" style="color:#1a0f26">${I['alert-triangle']}</div></div>
  </div>
  <div id="E" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="abs" id="eW" style="left:0;top:0;width:1700px;height:720px;">
      <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">${base}</svg>
      ${ids.map((id) => nodeHtml(id, logos)).join('')}</div>
    <div class="card dark" id="eC" style="left:230px;top:260px;width:1240px;height:200px;display:flex;align-items:center;justify-content:center;"><div class="big" style="font-size:96px;text-align:center;">You'll have seen the <span class="mint-t">wiring.</span></div></div>
  </div>
  <div id="F" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card coral" id="fB" style="left:370px;top:20px;width:960px;height:210px;display:flex;align-items:center;justify-content:center;gap:34px;">
      <div class="icon-sz" id="fBell" style="width:110px;height:110px;color:#1a0f26">${I['refresh']}</div><div class="big" style="font-size:118px;color:#1a0f26;">SUBSCRIBE</div></div>
    <div class="abs lbl dim-t" id="fL" style="left:100px;top:272px;width:1500px;text-align:center;font-size:26px;">NEXT BREAKDOWN · YOU PICK IN THE COMMENTS</div>
    <div class="card nextc dark" id="f1" style="left:110px;top:340px;"><div class="icon-sz" style="width:110px;height:110px;color:var(--mint)">${I['cpu']}</div><div class="big" style="font-size:58px;line-height:1;">The custom chip war</div></div>
    <div class="card nextc darkc" id="f2" style="left:950px;top:340px;"><div class="icon-sz" style="width:110px;height:110px;color:var(--gold)">${I['bolt']}</div><div class="big" style="font-size:58px;line-height:1;">The data center power crisis</div></div>
    <div class="pill cream" id="fP" style="left:560px;top:620px;font-size:28px;">THE AI BUBBLE MACHINE · THANKS FOR WATCHING</div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5].map(function(i){return CUE(i);});
  function moodAt(t){return clamp(.6-.55*st(t,K[4],3),0,1)*(1-st(t,K[2],1.5))+.1*st(t,K[2],1.5);}
  function render(t){
    var a=win(t,K[0]-.05,K[1]-.1,.4); $('A').style.opacity=a;
    pop($('a96'),st(t,K[0]+.2,.55),{dx:-120,dy:0,s0:.85}); pop($('a99'),st(t,K[0]+.6,.55),{dx:120,dy:0,s0:.85});
    pop($('aQ'),st(t,K[0]+1.2,.6),{s0:.2,rot:20}); $('aQ').style.rotate=(8*Math.sin(t*2.4))+'deg'; pop($('aP'),st(t,K[0]+3.4,.5),{dy:30});
    var b=win(t,K[1]-.05,K[2]-.1,.4); $('B').style.opacity=b;
    pop($('b1'),st(t,K[1]+.3,.6),{dx:-140,dy:0,s0:.88}); pop($('b2'),st(t,K[1]+2.0,.6),{dx:140,dy:0,s0:.88});
    pop($('bP'),st(t,K[1]+1.4,.5),{s0:.2,rot:90,dy:0}); pop($('bT'),st(t,K[1]+5.0,.5),{rot:-6,s0:.4,dy:0});
    var c=win(t,K[2]-.05,K[3]-.1,.4); $('C').style.opacity=c;
    pop($('cN'),st(t,K[2]+.2,.6),{s0:.2,rot:-12}); rise($('cT1'),st(t,K[2]+.9,.5),30,60); rise($('cT2'),st(t,K[2]+1.3,.5),30,60);
    fade($('cE'),st(t,K[2]+2.4,.4)); $('cE').style.transform='scale('+(1+.08*Math.sin(t*4))+')';
    var d=win(t,K[3]-.05,K[4]-.1,.4); $('D').style.opacity=d;
    pop($('w1'),st(t,K[3]+.8,.55),{dx:-160,dy:0,s0:.92}); pop($('w2'),st(t,K[3]+5.4,.55),{dx:160,dy:0,s0:.92}); pop($('w3'),st(t,K[3]+10.4,.55),{dx:-160,dy:0,s0:.92});
    var e=win(t,K[4]-.05,K[5]-.1,.4); $('E').style.opacity=e;
    $('eW').style.opacity=.35;
    ['openai','nvidia','oracle','coreweave','amd'].forEach(function(id,i){var n=$('n_'+id);pop(n,st(t,K[4]+.2+i*.15,.5),{dy:20,s0:.8});});
    pop($('eC'),st(t,K[4]+1.8,.6),{dy:50,s0:.85});
    var f=st(t,K[5]-.05,.45); $('F').style.opacity=f;
    pop($('fB'),st(t,K[5]+.6,.6),{s0:.5,dy:40}); $('fB').style.scale=String(1+.025*Math.sin(t*4));
    $('fBell').style.transform='rotate('+(15*Math.sin(t*6))+'deg)';
    fade($('fL'),st(t,K[5]+1.8,.5)); pop($('f1'),st(t,K[5]+2.4,.55),{dx:-120,dy:0,s0:.9}); pop($('f2'),st(t,K[5]+3.4,.55),{dx:120,dy:0,s0:.9}); pop($('fP'),st(t,K[5]+5.4,.5),{dy:30});
  }`;
  return { css, html, js };
}
