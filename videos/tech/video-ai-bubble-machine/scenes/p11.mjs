import { POS, nodeCss, nodeHtml, webAssets, edge } from './web.mjs';
export default async function (ctx) {
  const logos = await webAssets(ctx);
  const ids = ['openai', 'nvidia', 'oracle', 'coreweave', 'amd'];
  const E = [
    ['x1', 'coreweave', 'nvidia', 0], ['x2', 'nvidia', 'openai', 0], ['x3', 'openai', 'oracle', 0],
    ['x4', 'openai', 'amd', 0], ['x5', 'oracle', 'nvidia', 190],
  ].map(([id, a, b, bu]) => ({ id, a, b, ...edge(a, b, bu) }));
  const css = nodeCss() + `
  .node{overflow:visible;}
  .ring{position:absolute;left:0;top:0;border-radius:50%;border:8px solid var(--coral);opacity:0;pointer-events:none;translate:-50% -50%;}
  .tg{position:absolute;translate:-50% -50%;font-size:20px;padding:9px 20px;}
  .spread{width:1000px;height:70px;}
  .tgt{width:480px;height:330px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;}
  `;
  const base = E.map((e) => `<path d="${e.d}" fill="none" stroke="rgba(244,239,230,.35)" stroke-width="5" stroke-linecap="round"/>`).join('');
  const hot = E.map((e) => `<path id="${e.id}" d="${e.d}" fill="none" stroke="#ff5d4d" stroke-width="9" stroke-linecap="round"/>`).join('');
  const rings = ids.map((id) => `<div class="ring" id="rg_${id}" style="left:${POS[id][0]}px;top:${POS[id][1]}px;width:100px;height:100px;"></div>`).join('');
  const tags = [
    ['tCW1', 300, 676, 'coral', "CAN'T REFINANCE"], ['tCW2', 690, 600, '', 'LENDERS TAKE LOSSES'], ['tCW3', 690, 662, '', 'PROJECTS STALL'],
    ['tNV', 300, 52, 'coral', 'SUPPLIER + SHAREHOLDER: HIT'],
    ['tOA', 850, 470, 'coral', 'GROWTH SLOWS'],
    ['tOR1', 1400, 262, 'coral', 'CAPACITY BUILT FOR ONE CUSTOMER'], ['tOR2', 1400, 316, '', 'NEGATIVE FREE CASH FLOW'],
  ].map(([id, x, y, c, l]) => `<div class="pill ${c} tg" id="${id}" style="left:${x}px;top:${y}px;">${l}</div>`).join('');
  const html = `
  <div id="W" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">${base}${hot}</svg>
    ${ids.map((id) => nodeHtml(id, logos)).join('')}
    ${rings}${tags}
  </div>
  <div id="S" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="lbl dim-t abs" style="left:250px;top:30px;font-size:24px;">20-YEAR+ HYPERSCALER BONDS · SPREAD OVER RISK-FREE RATES</div>
    <div class="abs lbl" style="left:250px;top:130px;font-size:24px;color:var(--cream2);">A YEAR AGO</div>
    <div class="abs" id="sb1" style="left:250px;top:170px;width:0;height:100px;background:var(--mint);border:4px solid var(--edge);border-radius:14px;box-shadow:7px 7px 0 var(--edge);"></div>
    <div class="abs big" id="sv1" style="left:270px;top:188px;font-size:56px;color:#10241d;opacity:0;">~108 bps</div>
    <div class="abs lbl" style="left:250px;top:330px;font-size:24px;color:var(--cream2);">NOW</div>
    <div class="abs" id="sb2" style="left:250px;top:370px;width:0;height:100px;background:var(--coral);border:4px solid var(--edge);border-radius:14px;box-shadow:7px 7px 0 var(--edge);"></div>
    <div class="abs big" id="sv2" style="left:270px;top:388px;font-size:56px;color:#1a0f26;opacity:0;">~118 bps</div>
    <div class="pill gold" id="sP" style="left:1170px;top:250px;font-size:44px;padding:16px 32px;rotate:5deg;">+10 bps</div>
    <div class="card dark" id="sC" style="left:250px;top:560px;width:1100px;height:110px;display:flex;align-items:center;justify-content:center;"><div class="h2" style="font-size:44px;">The bond market is getting tired.</div></div>
  </div>
  <div id="V" class="abs" style="left:0;top:0;width:1700px;height:720px;">
    <div class="card coral tgt" id="v1" style="left:70px;top:60px;"><div class="big" style="font-size:80px;color:#1a0f26;">Lenders</div><div class="lbl" style="font-size:20px;color:#4a1410;">FIRST TO TAKE LOSSES</div></div>
    <div class="card coral tgt" id="v2" style="left:610px;top:60px;"><div class="big" style="font-size:80px;color:#1a0f26;">Suppliers</div><div class="lbl" style="font-size:20px;color:#4a1410;">ORDERS DRY UP</div></div>
    <div class="card coral tgt" id="v3" style="left:1150px;top:60px;"><div class="big" style="font-size:80px;color:#1a0f26;">Shareholders</div><div class="lbl" style="font-size:20px;color:#4a1410;">VALUATIONS RESET</div></div>
    <div class="card mint" id="v4" style="left:310px;top:430px;width:1080px;height:200px;display:flex;align-items:center;justify-content:center;gap:30px;">
      <div class="big" style="font-size:70px;color:#1a0f26;text-decoration:line-through;text-decoration-thickness:10px;text-decoration-color:var(--coral);">The person using the chatbot</div></div>
    <div class="pill cream" id="v5" style="left:560px;top:650px;font-size:28px;rotate:-2deg;">NOT WHO GETS HIT FIRST</div>
  </div>`;
  const js = `
  var K=[0,1,2,3,4,5].map(function(i){return CUE(i);});
  var IDS=['openai','nvidia','oracle','coreweave','amd'];
  var INF={coreweave:K[1]+1.2, nvidia:K[1]+8.8, openai:K[2]+.8, oracle:K[2]+6.0, amd:K[4]+6.0};
  function moodAt(t){return clamp(.15+.5*st(t,K[1]+1,6)+.35*st(t,K[2],8),0,1);}
  function infected(id,t){return st(t,INF[id],.6);}
  function render(t){
    // web visibility: full for s0..s2 and s4; dimmed during bond-market (s3) and consequences (s5)
    var wv=clamp(Math.min(st(t,.8,.5),1)-.96*win(t,K[3]-.05,K[4]-.1,.4)-.9*st(t,K[5]-.05,.5),.05,1);
    $('W').style.opacity=wv;
    IDS.forEach(function(id,i){
      var n=$('n_'+id);var e=st(t,.9+i*.15,.6);pop(n,e,{dy:30,s0:.7});
      var f=infected(id,t);
      if(e>=1){n.style.transform='translate('+(f>0&&f<1?(6*Math.sin(t*60)):0)+'px,'+(2.5*Math.sin(t*1.7+i))+'px)';}
      n.style.boxShadow='9px 9px 0 rgba('+Math.round(lerp(12,255,f))+','+Math.round(lerp(6,93,f))+','+Math.round(lerp(20,77,f))+',1)';
      n.style.borderColor=f>.5?'var(--coral)':'var(--edge)';
    });
    // red flow along edges after the source node is hit
    var src={x1:'coreweave',x2:'nvidia',x3:'openai',x4:'openai',x5:'oracle'};
    for(var k=1;k<=5;k++){var p=$('x'+k);var L=p.getTotalLength();var s0=INF[src['x'+k]]+.9;
      if(k===5){s0=INF.oracle+.9;} var e=eoc(st(t,s0,1.2));
      p.setAttribute('stroke-dasharray',L+' '+L);p.setAttribute('stroke-dashoffset',L*(1-e));}
    // tags
    pop($('tCW1'),st(t,INF.coreweave+.2,.45),{s0:.4,dy:0}); pop($('tCW2'),st(t,K[1]+4.6,.45),{s0:.4,dy:0}); pop($('tCW3'),st(t,K[1]+6.6,.45),{s0:.4,dy:0});
    pop($('tNV'),st(t,INF.nvidia+.3,.45),{s0:.4,dy:0});
    pop($('tOA'),st(t,INF.openai+.2,.45),{s0:.4,dy:0});
    pop($('tOR1'),st(t,INF.oracle+.3,.45),{s0:.4,dy:0}); pop($('tOR2'),st(t,INF.oracle+2.4,.45),{s0:.4,dy:0});
    // shockwave rings along every arrow (sentence 4)
    var order=['coreweave','nvidia','openai','oracle','amd'];
    order.forEach(function(id,i){var r=$('rg_'+id);var u=st(t,K[4]+1.0+i*.9,1.4);
      r.style.opacity=(u>0&&u<1)?(1-u)*.9:0; var s=100+520*eoc(u); r.style.width=s+'px'; r.style.height=s+'px';});
    // bond spreads card
    var s=win(t,K[3]-.05,K[4]-.1,.4); $('S').style.opacity=s;
    $('sb1').style.width=(1000*108/118*eoc(st(t,K[3]+.6,1.0)))+'px'; fade($('sv1'),st(t,K[3]+1.3,.4));
    $('sb2').style.width=(1000*eoc(st(t,K[3]+3.2,1.1)))+'px'; fade($('sv2'),st(t,K[3]+4.0,.4));
    pop($('sP'),st(t,K[3]+5.2,.5),{rot:12,s0:.3,dy:0}); pop($('sC'),st(t,K[3]+7.0,.5),{dy:30});
    // who gets hit first
    var v=st(t,K[5]-.05,.45); $('V').style.opacity=v;
    pop($('v1'),st(t,K[5]+.6,.5),{dy:60,rot:-2}); pop($('v2'),st(t,K[5]+1.4,.5),{dy:60}); pop($('v3'),st(t,K[5]+2.2,.5),{dy:60,rot:2});
    pop($('v4'),st(t,K[5]+4.6,.55),{dy:50}); pop($('v5'),st(t,K[5]+6.4,.5),{rot:-6,s0:.4,dy:0});
  }`;
  return { css, html, js };
}
