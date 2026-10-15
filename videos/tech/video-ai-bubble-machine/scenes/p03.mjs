import { POS, nodeCss, nodeHtml, webAssets, edge } from './web.mjs';
export default async function (ctx) {
  const logos = await webAssets(ctx);
  const order = ['openai', 'nvidia', 'oracle', 'coreweave', 'amd', 'broadcom', 'microsoft'];
  const css = nodeCss() + `
  .num7{font-family:'Bricolage',sans-serif;font-weight:800;font-size:210px;color:var(--gold);line-height:.8;text-shadow:0 8px 0 rgba(12,6,20,.9);}
  `;
  const spokes = ['nvidia', 'oracle', 'coreweave', 'amd', 'broadcom', 'microsoft'].map((id, i) => {
    const e = edge('openai', id, 0);
    return `<path id="sp_${id}" d="${e.d}" fill="none" stroke="#f4efe6" stroke-opacity=".55" stroke-width="4" stroke-dasharray="1400" stroke-dashoffset="1400" stroke-linecap="round"/>`;
  }).join('');
  const html = `
  <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">${spokes}</svg>
  <div class="abs" id="seven" style="left:520px;top:210px;width:660px;text-align:center;"><div class="num7">7</div>
    <div class="h2" style="font-size:54px;margin-top:22px;">names. That's all.</div></div>
  ${order.map((id) => nodeHtml(id, logos)).join('')}`;
  const js = `
  var K=[0,1,2,3].map(function(i){return CUE(i);});
  var IDS=${JSON.stringify(order)};
  var APPEAR={openai:K[1]+.2,nvidia:K[1]+3.0,oracle:K[1]+5.2,coreweave:K[1]+7.4,amd:K[2]+.2,broadcom:K[2]+2.6,microsoft:K[2]+5.2};
  function render(t){
    var seven=win(t,K[0]-.05,K[1]+.1,.4);
    $('seven').style.opacity=seven; $('seven').style.transform='scale('+(.8+.2*eob(st(t,K[0]+.05,.6)))+')';
    IDS.forEach(function(id,i){var e=st(t,APPEAR[id],.55);var n=$('n_'+id);
      pop(n,e,{dy:50,rot:(i%2?3:-3),s0:.5});
      // gentle idle bob once settled
      if(e>=1){n.style.transform='translateY('+(3*Math.sin(t*1.6+i))+'px)';}
    });
    // spokes draw in during the last sentence: "draw the actual lines"
    ['nvidia','oracle','coreweave','amd','broadcom','microsoft'].forEach(function(id,i){
      var p=$('sp_'+id);var e=eoc(st(t,K[3]+.4+i*.35,.9));var L=p.getTotalLength();
      p.setAttribute('stroke-dasharray',L+' '+L);p.setAttribute('stroke-dashoffset',L*(1-e));});
  }`;
  return { css, html, js };
}
