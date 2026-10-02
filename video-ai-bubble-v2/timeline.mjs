// Per-scene motion-graphics spec. Times: number = seconds from scene start;
// "bN" beat N start, "eN" beat N end, "bN+x" offset, "wN.K" word K of beat N, "end" scene end.
const NODES = [
  { id: 'openai', x: 500, y: 330 }, { id: 'nvidia', x: 130, y: 130 }, { id: 'oracle', x: 870, y: 130 },
  { id: 'amd', x: 130, y: 540 }, { id: 'coreweave', x: 870, y: 540 }, { id: 'microsoft', x: 500, y: 60 }, { id: 'broadcom', x: 500, y: 610 },
];
const old = (n) => NODES.map((x) => ({ ...x, t: -100 }));
const E = {
  nvOa: (t, o = {}) => ({ a: 'nvidia', b: 'openai', label: '$100B INVEST', bend: 42, t, ...o }),
  oaNv: (t, o = {}) => ({ a: 'openai', b: 'nvidia', label: 'BUYS CHIPS', bend: 42, t, ...o }),
  oaOr: (t, o = {}) => ({ a: 'openai', b: 'oracle', label: '$300B · 5 YRS', bend: 42, t, ...o }),
  orNv: (t, o = {}) => ({ a: 'oracle', b: 'nvidia', label: '$40B OF CHIPS', bend: 60, t, ...o }),
  oaAm: (t, o = {}) => ({ a: 'openai', b: 'amd', label: '6 GW ORDER', bend: 42, t, ...o }),
  amOa: (t, o = {}) => ({ a: 'amd', b: 'openai', label: '10% WARRANTS', bend: 42, t, ...o }),
  nvCw: (t, o = {}) => ({ a: 'nvidia', b: 'coreweave', label: 'INVESTOR + SUPPLIER', bend: 60, t, ...o }),
  cwNv: (t, o = {}) => ({ a: 'coreweave', b: 'nvidia', label: 'CUSTOMER', bend: 60, t, ...o }),
  msOa: (t, o = {}) => ({ a: 'microsoft', b: 'openai', label: 'BACKS', bend: 30, t, ...o }),
  oaBr: (t, o = {}) => ({ a: 'openai', b: 'broadcom', label: 'CUSTOM CHIPS', bend: 30, t, ...o }),
};
const G = (nodes, edges) => ({ type: 'graph', cx: 960, cy: 440, w: 1000, h: 680, nodes, edges, t0: 0, fx: 'fade' });
const K = (n, txt, c) => ({ type: 'kicker', x: 90, y: 64, n, txt, c, t0: 0.15, t1: 2.8, fx: 'left' });

export const SCENES = {
  s01: { move: 0, dim: 0.6, glitch: true, layers: [
    K('01', 'THE $1.15 TRILLION PROMISE', 'gold'),
    { type: 'num', cx: 960, cy: 400, pre: '$', val: 1.15, dec: 2, suf: 'T', size: 250, color: 'gold', glow: 'gold', label: "OPENAI'S COMPUTE COMMITMENTS · NEXT 10 YEARS", t0: 'b0', t1: 'b2' },
    { type: 'vs', cx: 960, cy: 430, a: { l: 'PROMISED TO SPEND', v: 1150, pre: '$', suf: 'B', c: 'coral', sub: 'over ~10 years' }, b: { l: 'REVENUE PER YEAR', v: 40, pre: '$', suf: 'B', c: 'mint', sub: 'about' }, t0: 'b2', fx: 'pop' },
  ] },
  s02: { move: 1, dim: 0.58, layers: [
    { type: 'head', cx: 960, cy: 380, txt: "WHO'S PAYING\nFOR ALL OF THIS?", fs: 130, t0: 'b0', t1: 'b1+0.2', fx: 'slam' },
    { type: 'head', cx: 960, cy: 380, txt: 'THE ANSWER IS <span class="gold">A CIRCLE</span>', fs: 130, t0: 'b1+1.9', t1: 'b2', fx: 'slam' },
    { type: 'chips', cx: 960, cy: 640, w: 1500, items: [{ txt: 'NVIDIA', c: 'mint', t: 'w2.0' }, { txt: '→ OPENAI', c: 'cyan', t: 'w2.4' }, { txt: '→ ORACLE', c: 'coral', t: 'w2.6' }, { txt: '→ AMD', c: 'gold', t: 'w2.8' }, { txt: '→ COREWEAVE', c: 'violet', t: 'w2.9' }, { txt: '→ NVIDIA', c: 'mint', t: 'w2.10' }], t0: 'b2' },
  ] },
  s03: { move: 2, dim: 0.58, layers: [
    { type: 'list', x: 330, y: 150, w: 1260, fs: 48, items: [
      { h: 'Every arrow in the circle', s: 'who pays whom, and how much', c: 'mint', t: 'b0' },
      { h: 'The smartest investors betting against it', s: 'and the numbers behind their case', c: 'coral', t: 'b1' },
      { h: 'Why the insiders say you\'re missing the point', s: 'the bull case, honestly told', c: 'gold', t: 'b2' }], t0: 'b0', fx: 'fade' },
  ] },
  s04: { move: 4, dim: 0.6, layers: [
    K('02', 'THE SPENDING BOOM', 'cyan'),
    { type: 'cols', x: 520, y: 130, w: 880, title: 'AMAZON · ALPHABET · MICROSOFT · META  —  AI CAPEX', max: 725, pre: '$', suf: 'B', h: 460, cw: 260, vs: 74, items: [{ l: 'LAST YEAR', v: 410, c: 'cyan', t: 'b1+1.8' }, { l: 'THIS YEAR', v: 725, c: 'coral', t: 'b2+0.4' }], t0: 'b1+0.3' },
    { type: 'stamp', x: 1440, y: 250, text: '+77%', fs: 120, c: 'coral', rot: -8, t0: 'b2+1.6', fx: 'pop' },
    { type: 'chips', cx: 960, cy: 780, items: [{ txt: 'BIGGER THAN THE ECONOMY OF MOST COUNTRIES', c: 'gold' }], t0: 'b3' },
  ] },
  s05: { move: 5, dim: 0.6, layers: [
    { type: 'bars', x: 110, y: 140, w: 1040, title: 'THIS YEAR\'S CAPEX GUIDANCE', max: 240, pre: '$', suf: 'B', lw: 220, items: [
      { l: 'AMAZON', v: 220, c: 'gold', t: 'w0.0' }, { l: 'ALPHABET', v: 200, c: 'cyan', t: 'w0.11' }, { l: 'MICROSOFT', v: 175, suf: 'B+', c: 'mint', t: 'w0.15' }, { l: 'META', v: 145, c: 'violet', t: 'w0.21' }], t0: 'b0' },
    { type: 'ring', cx: 1560, cy: 420, size: 400, val: 102, c: 'coral', fs: 100, label: 'OF CLOUD REVENUE → CAPEX', t0: 'b1+0.3', fx: 'pop' },
    { type: 'chips', cx: 960, cy: 780, items: [{ txt: 'CONCRETE', c: 'cream', t: 'w2.6' }, { txt: 'CHIPS', c: 'cyan', t: 'w2.8' }, { txt: 'POWER', c: 'gold', t: 'w2.10' }], t0: 'b2' },
    { type: 'chips', cx: 960, cy: 780, items: [{ txt: 'GIGAWATT CAMPUSES — NOT SERVER ROOMS', c: 'mint' }], t0: 'b3' },
  ] },
  s06: { move: 0, dim: 0.56, layers: [
    { type: 'num', cx: 960, cy: 400, pre: '$', val: 4.1, dec: 1, suf: 'T', size: 260, color: 'gold', glow: 'gold', label: 'UBS · AI INFRASTRUCTURE SPEND THROUGH 2028', t0: 'b0', t1: 'b1' },
    { type: 'head', cx: 960, cy: 430, txt: 'FOLLOW <span class="cyan">THE ARROWS</span>', fs: 150, t0: 'b1+1.0', fx: 'slam' },
  ] },
  s07: { move: 3, dim: 0.4, layers: [
    K('03', 'THE CIRCLE, ARROW BY ARROW', 'mint'),
    G(NODES.map((n) => ({ ...n, t: { openai: 'w1.0', nvidia: 'w1.4', oracle: 'w2.0', coreweave: 'w2.2', amd: 'w3.0', broadcom: 'w3.2', microsoft: 'w3.6' }[n.id] })), []),
    { type: 'head', x: 300, y: 130, w: 1320, txt: 'SEVEN NAMES', fs: 110, t0: 'b0', t1: 'b1', fx: 'slam' },
  ].map((l) => (l.type === 'graph' ? { ...l, t0: 'b0+1.0' } : l)) },
  s08: { move: 1, dim: 0.4, layers: [
    G(old(), [E.msOa(-100), E.nvOa('b1+2.0'), E.oaNv('b2+0.1')]),
    { type: 'chips', cx: 960, cy: 80, items: [{ txt: 'LIKE A CAR DEALER LENDING YOU MONEY TO BUY HIS OWN CARS', c: 'gold' }], t0: 'b3+0.4' },
  ] },
  s09: { move: 2, dim: 0.4, layers: [
    G(old(), [E.msOa(-100), E.nvOa(-100), E.oaNv(-100), E.oaOr('b0+0.3'), E.orNv('b1+0.4')]),
  ] },
  s10: { move: 3, dim: 0.4, layers: [
    G(old(), [E.msOa(-100), E.nvOa(-100), E.oaNv(-100), E.oaOr(-100), E.orNv(-100), E.oaAm('b0+0.3'), E.amOa('w0.10'), E.nvCw('b1+1.2'), E.cwNv('b1+2.8'), E.oaBr('b2+0.1')]),
  ] },
  s11: { move: 4, dim: 0.6, layers: [
    { type: 'head', cx: 960, cy: 400, txt: 'WHY DOES <span class="gold">THAT</span> MATTER?', fs: 120, t0: 'b0', t1: 'b1', fx: 'slam' },
    { type: 'head', cx: 960, cy: 180, txt: 'ONE DOLLAR · COUNTED <span class="coral">THREE TIMES</span>', fs: 78, t0: 'b1', fx: 'rise' },
    { type: 'ledger', cx: 960, cy: 470, items: [{ l: 'BALANCE SHEET A', s: 'counts it as investment', c: 'mint', t: 'w2.0' }, { l: 'BALANCE SHEET B', s: 'counts it as revenue', c: 'cyan', t: 'w2.5' }, { l: 'BALANCE SHEET C', s: 'counts it as growth', c: 'gold', t: 'w2.8' }], t0: 'b2-0.3' },
    { type: 'stamp', cx: 960, cy: 770, text: 'NOT NECESSARILY FRAUD', fs: 58, c: 'gold', rot: -3, t0: 'b3+0.2', fx: 'pop' },
  ] },
  s12: { move: 5, dim: 0.5, glitch: true, layers: [
    K('04', 'THE LOOP THAT LOOSENED', 'coral'),
    { type: 'quote', cx: 960, cy: 430, w: 1240, text: 'Never a binding commitment.', who: 'JENSEN HUANG · NVIDIA CEO · ON THE $100B', c: 'gold', fs: 78, t0: 'b1', t1: 'b2', fx: 'slam' },
    { type: 'quote', cx: 960, cy: 430, w: 1240, text: 'Probably not in the cards.', who: 'JENSEN HUANG · MARCH', c: 'coral', fs: 78, t0: 'b2', t1: 'b3', fx: 'slam' },
    { type: 'chips', cx: 960, cy: 450, dir: 'column', align: 'center', fs: 30, items: [{ txt: 'NVIDIA → OPENAI $100B: LOOSENED', c: 'gold', t: 'b3' }, { txt: 'ORACLE · AMD · COREWEAVE: STILL TIGHT', c: 'coral', t: 'w3.4' }], t0: 'b3' },
  ] },
  s13: { move: 4, dim: 0.58, layers: [
    K('05', 'THE BORROWED MONEY', 'coral'),
    { type: 'head', cx: 960, cy: 400, txt: 'INCREASINGLY:\n<span class="coral">LENDERS</span>', fs: 150, t0: 'b0+0.8', t1: 'b1', fx: 'slam' },
    { type: 'cols', cx: 960, cy: 470, w: 860, title: 'AMAZON · ALPHABET · META · ORACLE  —  BOND ISSUANCE', max: 200, pre: '$', suf: 'B', h: 440, cw: 270, vs: 78, items: [{ l: 'BY LATE JULY', v: 194, c: 'coral', t: 'w1.4' }, { l: 'ALL OF LAST YEAR', v: 108, c: 'cyan', t: 'b2+0.6' }], t0: 'b1+0.3' },
  ] },
  s14: { move: 1, dim: 0.56, layers: [
    { type: 'bars', x: 110, y: 150, w: 1020, title: 'GOLDMAN SACHS · EXPECTED HYPERSCALER BONDS', max: 400, pre: '$', suf: 'B', lw: 220, items: [{ l: 'THIS YEAR', v: 250, c: 'gold', t: 'w0.3' }, { l: 'NEXT YEAR', v: 400, c: 'coral', t: 'w0.8' }], t0: 'b0' },
    { type: 'gauge', cx: 1500, cy: 400, size: 600, from: 0.2, to: 0.72, val: 118, suf: ' bps', c: 'gold', fs: 96, label: 'LONG HYPERSCALER BOND SPREAD', zones: [['mint', 0, 0.4], ['gold', 0.4, 0.7], ['coral', 0.7, 1]], t0: 'b1+0.4', fx: 'pop' },
    { type: 'stamp', cx: 760, cy: 640, text: 'BOND MARKET: TIRED', fs: 64, c: 'coral', rot: -4, t0: 'b2+0.4', fx: 'pop' },
  ] },
  s15: { move: 0, dim: 0.55, layers: [
    { type: 'card', x: 80, y: 190, w: 560, kicker: 'META · OFF ITS BALANCE SHEET', head: '$30B', fs: 150, c: 'gold', lines: ['data center financing moved into a joint venture'], t0: 'b0+0.2', fx: 'rise' },
    { type: 'card', x: 680, y: 190, w: 560, kicker: 'ORACLE · FREE CASH FLOW', head: '−$23.7B', fs: 130, c: 'coral', lines: ['last fiscal year'], t0: 'b1+0.2', fx: 'rise' },
    { type: 'card', x: 1280, y: 190, w: 560, kicker: 'ONE ORACLE CAMPUS · DEBT', head: '$38B', fs: 150, c: 'coral', lines: ['banks reportedly struggled to sell it'], t0: 'b2+0.2', fx: 'rise' },
  ] },
  s16: { move: 2, dim: 0.5, layers: [
    { type: 'chips', cx: 960, cy: 180, items: [{ txt: 'COREWEAVE · AI CLOUD FOR RENT', c: 'cyan' }], t0: 'b0' },
    { type: 'quote', cx: 960, cy: 420, w: 1200, text: 'We saw it. We passed.', who: 'A LENDER · ON A COREWEAVE DATA CENTER · FEBRUARY', c: 'coral', fs: 96, t0: 'b1', t1: 'b2', fx: 'slam' },
    { type: 'head', cx: 760, cy: 430, txt: '<span class="coral">B+</span>', fs: 340, t0: 'b2', fx: 'slam' },
    { type: 'stamp', cx: 1260, cy: 470, text: 'JUNK', fs: 120, c: 'coral', rot: -9, t0: 'b2+0.6', fx: 'pop' },
    { type: 'chips', cx: 960, cy: 740, items: [{ txt: "COREWEAVE'S CREDIT RATING", c: 'gold' }], t0: 'b2+0.2' },
  ] },
  s17: { move: 5, dim: 0.56, layers: [
    K('06', 'THE REVENUE GAP', 'gold'),
    { type: 'meter', x: 360, y: 150, w: 1200, title: "OPENAI · LAST QUARTER'S LOSS", val: 21, pre: '$', suf: 'B+', fill: 1, c: 'coral', t0: 'b1', fx: 'left' },
    { type: 'meter', x: 360, y: 340, w: 1200, title: '…OF WHICH NON-CASH', val: 12, pre: '~$', suf: 'B', fill: 0.57, c: 'gold', t0: 'w1.9', fx: 'left' },
    { type: 'num', cx: 960, cy: 680, val: 2030, comma: false, size: 150, color: 'mint', glow: 'w', label: 'OPENAI · EXPECTED CASH-FLOW POSITIVE', t0: 'b2', t1: 'b3', count: 0.6 },
    { type: 'num', cx: 960, cy: 680, pre: '~', val: 20, suf: '×', size: 170, color: 'coral', glow: 'coral', label: 'COMMITMENTS vs. ANNUAL SPENDING', t0: 'b3', fx: 'slam' },
  ] },
  s18: { move: 2, dim: 0.55, layers: [
    { type: 'ring', cx: 560, cy: 440, size: 440, val: 95, c: 'coral', fs: 130, label: 'OF CORPORATE AI PILOTS', t0: 'b0+0.2', fx: 'pop' },
    { type: 'card', x: 940, y: 240, w: 800, kicker: 'MIT REPORT · 2025', head: 'No measurable<br>profit impact', fs: 76, c: 'coral', t0: 'b0+1.4', fx: 'right' },
    { type: 'chips', x: 940, y: 640, w: 800, dir: 'column', align: 'flex-start', fs: 26, just: 'flex-start', items: [{ txt: 'CRITICS: THE HEADLINE IS MISREAD', c: 'gold', t: 'w1.0' }, { txt: 'BUT ADOPTION IS LAGGING THE BUILDOUT', c: 'coral', t: 'w1.7' }], t0: 'b1' },
  ] },
  s19: { move: 0, dim: 0.55, layers: [
    K('07', 'THE DEPRECIATION BET', 'violet'),
    { type: 'card', x: 110, y: 210, w: 800, kicker: 'THE MAN WHO SHORTED HOUSING', head: 'MICHAEL<br>BURRY', fs: 108, c: 'violet', lines: ['Now betting against Nvidia'], t0: 'b0+0.3', fx: 'left' },
    { type: 'head', x: 960, y: 270, w: 880, txt: '<span class="mint">NOT DEMAND.</span>\n<span class="coral">ACCOUNTING.</span>', fs: 120, align: 'left', t0: 'b1+0.3', fx: 'right' },
  ] },
  s20: { move: 4, dim: 0.56, layers: [
    { type: 'bars', x: 110, y: 150, w: 1000, title: 'HOW LONG DOES AN AI CHIP LAST?', max: 6, lw: 250, vw: 190, items: [{ l: 'CLOUD GIANTS SAY', v: 6, txt: '5–6 YRS', c: 'mint', t: 'w0.6' }, { l: 'BURRY SAYS', v: 3, txt: '2–3 YRS', c: 'coral', t: 'w0.8' }], t0: 'b0' },
    { type: 'num', cx: 1500, cy: 340, pre: '$', val: 176, suf: 'B', size: 190, color: 'coral', glow: 'coral', label: 'PROFIT OVERSTATED THROUGH 2028', sub: 'if Burry is right', t0: 'b1+0.5', fx: 'slam' },
    { type: 'chips', cx: 960, cy: 740, fs: 28, items: [{ txt: 'A 6-YEAR-OLD A100 STILL RESELLS FOR ≈ $5,000', c: 'gold' }], t0: 'b2+1.8' },
  ] },
  s21: { move: 1, dim: 0.52, layers: [
    K('08', 'THE OPTIMIST CASE', 'mint'),
    { type: 'head', cx: 960, cy: 430, txt: "WHY THE OPTIMISTS\n<span class=\"mint\">AREN'T SCARED</span>", fs: 120, t0: 'b0', t1: 'b1', fx: 'slam' },
    { type: 'cols', x: 420, y: 130, w: 900, title: 'ANNUAL REVENUE RUN-RATE', max: 110, pre: '$', suf: 'B', h: 520, cw: 220, vs: 72, gap: 40, items: [{ l: 'ANTHROPIC', v: 65, c: 'violet', t: 'w1.4' }, { l: 'OPENAI', v: 40, c: 'mint', t: 'w2.2' }, { l: 'COMBINED', v: 100, pre: '≈ $', c: 'gold', t: 'w2.7' }], t0: 'b1' },
    { type: 'stamp', x: 1370, y: 260, text: '7× IN A YEAR', fs: 64, c: 'violet', rot: -7, t0: 'w1.10', fx: 'pop' },
  ] },
  s22: { move: 3, dim: 0.54, layers: [
    { type: 'cells', cx: 960, cy: 330, title: 'AI COMPUTE · IN USE', n: 100, cols: 20, s: 36, g: 7, lit: Array.from({ length: 100 }, (_, i) => i), c: 'mint', litT: 'b0+1.0', t0: 'b0' },
    { type: 'chips', cx: 960, cy: 640, items: [{ txt: 'CLOUD EXECUTIVES: "CAN\'T BUILD FAST ENOUGH"', c: 'cyan' }], t0: 'b1' },
    { type: 'chips', cx: 960, cy: 740, items: [{ txt: 'LAND', c: 'gold', t: 'w2.2' }, { txt: 'POWER', c: 'cyan', t: 'w2.4' }, { txt: 'BUILDINGS', c: 'mint', t: 'w2.6' }, { txt: 'STAY — SOMEONE ELSE MOVES IN', c: 'cream', t: 'w2.10' }], t0: 'b2' },
  ] },
  s23: { move: 5, dim: 0.5, layers: [
    K('09', 'THE FIBER PRECEDENT', 'cyan'),
    { type: 'head', cx: 960, cy: 400, txt: "WE'VE SEEN <span class=\"coral\">THIS MOVIE</span>", fs: 130, t0: 'b0', t1: 'b1', fx: 'slam' },
    { type: 'num', cx: 960, cy: 215, pre: 'UP TO $', val: 2, suf: ' TRILLION', size: 120, color: 'cyan', glow: 'w', label: '1999 · FIBER-OPTIC CABLE BUILDOUT', t0: 'b1', fx: 'slam' },
    { type: 'cells', cx: 960, cy: 600, title: 'FIBER LIT BY 2002 · 2.7%', n: 200, cols: 25, s: 38, g: 7, lit: [37, 91, 148, 163, 12], c: 'mint', litT: 'b2+1.4', t0: 'b2', fx: 'rise' },
  ] },
  s24: { move: 2, dim: 0.5, layers: [
    { type: 'stamp', cx: 640, cy: 330, text: 'BANKRUPT', fs: 100, c: 'coral', rot: -7, t0: 'b0+0.8', fx: 'pop' },
    { type: 'chips', cx: 640, cy: 470, items: [{ txt: 'GLOBAL CROSSING', c: 'cream', t: 'b0+1.0' }, { txt: 'WORLDCOM', c: 'cream', t: 'b0+1.3' }], t0: 'b0' },
    { type: 'chips', cx: 960, cy: 230, items: [{ txt: 'THAT DARK FIBER LATER CARRIED', c: 'dim' }], t0: 'b1', t1: 'b2' },
    { type: 'chips', cx: 960, cy: 420, fs: 40, items: [{ txt: 'NETFLIX', c: 'coral', t: 'w1.4' }, { txt: 'THE CLOUD', c: 'cyan', t: 'w1.6' }, { txt: 'THE MODERN INTERNET', c: 'mint', t: 'w1.9' }], t0: 'b1', t1: 'b2' },
    { type: 'stamp', cx: 960, cy: 330, text: 'INFRASTRUCTURE: WON', fs: 78, c: 'mint', rot: -5, t0: 'w2.0', fx: 'pop' },
    { type: 'stamp', cx: 960, cy: 520, text: 'BUILDERS: MOSTLY LOST', fs: 78, c: 'coral', rot: 4, t0: 'w2.3', fx: 'pop' },
  ] },
  s25: { move: 0, dim: 0.46, glitch: true, layers: [
    K('10', 'IF ONE LINK SNAPS', 'coral'),
    { type: 'dominoes', cx: 960, cy: 470, bw: 190, h: 330, ang: 30, items: [{ l: "CoreWeave can't refinance", c: 'cyan', t: 'w1.1' }, { l: 'Lenders take losses', c: 'gold', t: 'w1.4' }, { l: 'Nvidia takes a hit', c: 'mint', t: 'w1.9' }, { l: 'OpenAI growth slows', c: 'violet', t: 'w2.0' }, { l: 'Oracle stuck with capacity', c: 'coral', t: 'w2.4' }], t0: 'b0+0.5' },
    { type: 'stamp', cx: 960, cy: 760, text: 'THE SHOCKWAVE RUNS BACKWARD', fs: 54, c: 'coral', rot: -2, t0: 'b3+0.3', fx: 'pop' },
  ] },
  s26: { move: 1, dim: 0.56, layers: [
    { type: 'list', x: 460, y: 150, w: 1000, fs: 56, items: [{ h: 'LENDERS', c: 'coral', t: 'w0.0' }, { h: 'SUPPLIERS', c: 'gold', t: 'w0.1' }, { h: 'SHAREHOLDERS', c: 'cyan', t: 'w0.3' }], t0: 'b0', t1: 'b1' },
    { type: 'chips', cx: 960, cy: 700, fs: 30, items: [{ txt: 'HIT FIRST — NOT THE PERSON USING THE CHATBOT', c: 'mint' }], t0: 'w0.6', t1: 'b1' },
    { type: 'num', cx: 960, cy: 440, val: 3, size: 400, color: 'gold', glow: 'gold', label: 'THINGS TO WATCH', t0: 'b1', count: 0.4, fx: 'slam' },
  ] },
  s27: { move: 3, dim: 0.56, layers: [
    K('11', 'THE WATCHLIST', 'gold'),
    { type: 'list', x: 330, y: 190, w: 1260, fs: 54, items: [
      { h: "Nvidia's earnings", s: 'any crack in chip demand', c: 'mint', t: 'b0' },
      { h: 'Revenue ÷ compute commitments', s: 'OpenAI and Anthropic', c: 'gold', t: 'b1' },
      { h: 'Credit ratings of the borrowers', s: 'starting with CoreWeave and Oracle', c: 'coral', t: 'b2' }], t0: 'b0', fx: 'fade' },
  ] },
  s28: { move: 4, dim: 0.5, layers: [
    { type: 'timeline', cx: 960, cy: 340, w: 1300, h: 260, items: [{ d: '1996', l: 'MORE RUNWAY', c: 'mint', t: 'w0.5' }, { d: '?', l: 'WHERE ARE WE NOW?', c: 'gold', t: 'w0.6' }, { d: '1999', l: 'THE TOP', c: 'coral', t: 'w0.8' }], t0: 'b0' },
    { type: 'chips', cx: 960, cy: 680, dir: 'column', align: 'center', fs: 30, items: [{ txt: 'SUBSCRIBE', c: 'coral', t: 'w2.0' }, { txt: 'NEXT: THE CUSTOM CHIP WAR', c: 'cyan', t: 'w2.9' }, { txt: 'OR: THE DATA CENTER POWER CRISIS', c: 'gold', t: 'w2.13' }], t0: 'b2' },
  ] },
};
