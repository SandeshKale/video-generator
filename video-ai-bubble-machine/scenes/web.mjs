// Shared company-web layout used by chapters 3 (cast), 4 (money loop) and 11 (contagion)
// so the same node positions carry across the video.
export const POS = {
  openai: [850, 360], nvidia: [300, 160], oracle: [1400, 160], amd: [1400, 580],
  coreweave: [300, 580], microsoft: [850, 78], broadcom: [850, 650],
};
export const NODE_W = 350, NODE_H = 150;

export async function webAssets(ctx) {
  return {
    openai: await ctx.mono('logos/gilbarbara/openai-icon.svg'),
    nvidia: await ctx.logo('logos/svg-logos/nvidia.svg'),
    oracle: await ctx.logo('logos/svg-logos/oracle.svg'),
    broadcom: await ctx.logo('logos/svg-logos/broadcom.svg'),
  };
}

const META = {
  openai:    { name: 'OpenAI',    role: 'BIGGEST COMPUTE BUYER', cls: 'dark',  mark: 'logo' },
  nvidia:    { name: 'Nvidia',    role: 'MAKES THE CHIPS',        cls: '',      mark: 'logo' },
  oracle:    { name: 'Oracle',    role: 'BUILDS + RENTS DATA CENTERS', cls: '', mark: 'wm', wm: 'ORACLE', wmStyle: 'font-size:19px;letter-spacing:.02em;color:#d9291d;' },
  coreweave: { name: 'CoreWeave', role: 'RENTS OUT NVIDIA GPUs',  cls: 'mint',  mark: 'wm', wm: 'CW' },
  amd:       { name: 'AMD',       role: 'CHIPS · CHALLENGER',     cls: 'gold',  mark: 'wm', wm: '↗' },
  broadcom:  { name: 'Broadcom',  role: 'CUSTOM AI CHIPS',        cls: '',      mark: 'logo' },
  microsoft: { name: 'Microsoft', role: 'OLDEST BACKER · $250B DEAL', cls: 'violet', mark: 'wm', wm: 'MS' },
};

export function nodeCss() {
  return `
  .node{width:${NODE_W}px;height:${NODE_H}px;display:flex;align-items:center;gap:16px;padding:0 20px;}
  .node .mk{width:84px;height:84px;flex:0 0 84px;display:flex;align-items:center;justify-content:center;}
  .node .mk svg{width:100%;height:100%;}
  .node .mk .wmk{font-family:'Bricolage',sans-serif;font-weight:800;font-size:40px;letter-spacing:-.03em;}
  .node .nm{font-family:'Bricolage',sans-serif;font-weight:800;font-size:35px;line-height:1;white-space:nowrap;}
  .node .rl{font-family:'JBMono',monospace;font-weight:700;font-size:14px;letter-spacing:.05em;margin-top:8px;line-height:1.25;opacity:.8;}
  .node.dark .mk{color:var(--cream);} .node.dark .rl{color:var(--mint);}
  .edgeLbl{font-size:21px;padding:8px 18px;}
  .coinG text{font-family:'Bricolage',sans-serif;font-weight:800;font-size:15px;fill:#1a0f26;text-anchor:middle;}
  `;
}

export function nodeHtml(id, logos, extraStyle = '') {
  const m = META[id]; const [x, y] = POS[id];
  const mark = m.mark === 'logo' ? logos[id] : `<div class="wmk" style="${m.wmStyle || ''}">${m.wm}</div>`;
  return `<div class="card node ${m.cls}" id="n_${id}" style="left:${x - NODE_W / 2}px;top:${y - NODE_H / 2}px;${extraStyle}">
    <div class="mk">${mark}</div><div><div class="nm">${m.name}</div><div class="rl">${m.role}</div></div></div>`;
}

// quadratic edge between two nodes with a signed bulge; returns path data + midpoint
export function edge(a, b, bulge = 0, lu = 0.5) {
  const [ax, ay] = POS[a], [bx, by] = POS[b];
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const cx = (ax + bx) / 2 + nx * bulge, cy = (ay + by) / 2 + ny * bulge;
  const p = (u, A, C, B) => (1 - u) * (1 - u) * A + 2 * (1 - u) * u * C + u * u * B;
  return { d: `M ${ax} ${ay} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${bx} ${by}`, mx: p(lu, ax, cx, bx), my: p(lu, ay, cy, by) };
}
