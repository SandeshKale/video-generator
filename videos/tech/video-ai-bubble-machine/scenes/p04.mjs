import { POS, nodeCss, nodeHtml, webAssets, edge } from './web.mjs';
export default async function (ctx) {
  const logos = await webAssets(ctx);
  const ids = ['openai', 'nvidia', 'oracle', 'coreweave', 'amd'];
  // [id, from, to, bulge, color, label, sentenceIndex, delay]
  // [id, from, to, bulge, color, label, sentence, delay, labelX, labelY]  (label coords are hand-placed in stage space)
  const E = [
    ['e1', 'nvidia', 'openai', 70, '#35f2b0', 'invests up to $100B', 0, .3, 640, 236],
    ['e2', 'openai', 'nvidia', 70, '#ffc53d', 'buys Nvidia chips', 1, .3, 640, 176],
    ['e3', 'openai', 'oracle', 60, '#ffc53d', '$300B cloud deal', 2, .3, 1068, 232],
    ['e4', 'oracle', 'nvidia', 190, '#ffc53d', '~$40B of Nvidia chips', 2, 4.6, 850, 60],
    ['e5', 'openai', 'amd', 60, '#ffc53d', '6 GW of AMD chips', 3, .3, 1092, 505],
    ['e6', 'amd', 'openai', 60, '#35f2b0', 'warrant: ~10% of AMD', 3, 4.2, 1066, 590],
    ['e7', 'nvidia', 'coreweave', 80, '#35f2b0', 'investor + supplier', 4, .3, 150, 372],
    ['e8', 'coreweave', 'nvidia', 80, '#ffc53d', 'also a customer', 4, 3.2, 480, 372],
  ].map(([id, a, b, bu, col, lbl, si, dl, lx, ly]) => ({ id, a, b, bu, col, lbl, si, dl, ...edge(a, b, bu), mx: lx, my: ly }));
  const css = nodeCss() + `
  .edgeLbl{position:absolute;translate:-50% -50%;font-size:19px;padding:8px 16px;}
  .stampbig{font-size:58px;right:20px;top:330px;rotate:-5deg;}
  `;
  const paths = E.map((e) => `<path id="${e.id}" d="${e.d}" fill="none" stroke="${e.col}" stroke-opacity=".9" stroke-width="6" stroke-linecap="round"/>`).join('');
  const coins = E.map((e) => [0, 1, 2].map((k) => `<g class="coinG" id="c_${e.id}_${k}" style="opacity:0"><circle r="15" fill="${e.col}" stroke="#0c0614" stroke-width="3.5"/><text y="5.5">$</text></g>`).join('')).join('');
  const lbls = E.map((e) => `<div class="pill ${e.col === '#35f2b0' ? 'mint' : ''} edgeLbl" id="l_${e.id}" style="left:${e.mx}px;top:${e.my}px;">${e.lbl}</div>`).join('');
  const html = `
  <svg class="abs" style="left:0;top:0" width="1700" height="720" viewBox="0 0 1700 720">${paths}${coins}</svg>
  ${ids.map((id) => nodeHtml(id, logos)).join('')}
  ${lbls}
  <div class="pill coral stampbig abs" id="stampbig" style="left:300px;top:652px;font-size:26px;padding:10px 26px;">SAME HANDFUL OF LOGOS. EVERY ARROW.</div>`;
  const js = `
  var K=[0,1,2,3,4,5].map(function(i){return CUE(i);});
  var E=${JSON.stringify(E.map((e) => ({ id: e.id, si: e.si, dl: e.dl })))};
  var MOOD=0;
  function moodAt(t){return .35*st(t,K[1],2);}
  function render(t){
    ['openai','nvidia','oracle','coreweave','amd'].forEach(function(id,i){
      var at={openai:.9,nvidia:1.1,oracle:1.3,coreweave:1.5,amd:1.7}[id];
      var n=$('n_'+id);var e=st(t,at,.6);pop(n,e,{dy:40,s0:.6});
      if(e>=1)n.style.transform='translateY('+(2.5*Math.sin(t*1.7+i*1.3))+'px)';});
    E.forEach(function(ed,ei){
      var t0=K[ed.si]+ed.dl; var p=$('e'+(ei+1)); var L=p.getTotalLength();
      var e=eoc(st(t,t0,.9));
      p.setAttribute('stroke-dasharray',L+' '+L); p.setAttribute('stroke-dashoffset',L*(1-e));
      pop($('l_'+ed.id),st(t,t0+.35,.45),{s0:.4,dy:0});
      var nxt=(ed.si<5)?K[ed.si+1]:1e9; var dim=st(t,nxt,.5)*(1-st(t,K[5],.6)); // dim after its sentence, relight at the end
      p.style.opacity=1-.62*dim; $('l_'+ed.id).style.opacity=Math.min(parseFloat($('l_'+ed.id).style.opacity||1),1-.55*dim);
      for(var k=0;k<3;k++){var g=$('c_'+ed.id+'_'+k);var u=((t-t0)*.22+k/3)%1;
        coinAt(g,p,u,t>t0+.5?1:0);}
    });
    // highlight the closed loop between Nvidia and OpenAI while sentence 1 plays
    var pulse=win(t,K[1]+.2,K[1]+4,.3);
    $('n_openai').style.boxShadow='9px 9px 0 rgba(53,242,176,'+(.95)+')';
    pop($('stampbig'),st(t,K[5]+.5,.5),{rot:-3,s0:.3,dy:0});
  }`;
  return { css, html, js };
}
