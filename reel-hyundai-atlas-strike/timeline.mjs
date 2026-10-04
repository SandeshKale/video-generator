// Times: number = s from scene start; "bN" beat start; "eN" beat end; "wN.K" word K of beat N; "+x"/"-x" offsets.
// Layout rule: content stays above y≈1300 (caption pill sits at y≈1340–1465; IG UI below 1536); x within 150–918.
const hud = (n, rev) => ({ type: 'hud', n, rev, t0: 0, fx: 'fade', nocheck: true });
export const SCENES = {
  s01: { layers: [
    hud('01'),
    { type: 'head', x: 150, y: 250, lines: [{ txt: 'They went', size: 128, t: 'b0' }, { txt: 'on strike.', size: 128, t: 'b0+0.3' }, { txt: 'Over a', size: 128, i: 1, c: 'org', t: 'b1', mt: 20 }, { txt: 'robot.', size: 128, i: 1, c: 'org', t: 'b1+0.3' }], t0: 'b0', fx: 'fade' },
    { type: 'print', x: 450, y: 780, w: 470, h: 520, img: 'atlas-hero', cap: 'FIG. 1 · ATLAS (PRODUCTION)', rot: 3, t0: 'b1+0.3', fx: 'drop' },
    { type: 'chips', x: 150, y: 880, col: 1, items: [{ txt: 'ULSAN · JULY 13–15', t: 'b0+1.0' }, { txt: '~40,000 MEMBERS', inv: 1, t: 'b0+1.5' }], t0: 'b0+1.0', fx: 'fade' },
    { type: 'stamp', x: 130, y: 1010, text: 'First of its kind', size: 38, rot: -8, t0: 'b1+1.0', fx: 'fade' },
  ] },
  s02: { layers: [
    hud('02'),
    { type: 'print', x: 150, y: 250, w: 470, h: 880, img: 'atlas-closeup', cap: 'FIG. 2 · ATLAS, TEARDOWN', rot: -1.5, tapes: [[-26, -12, -8]], t0: 'b0', fx: 'rise' },
    { type: 'callouts', x: 0, y: 0, dim: { x: 120, y1: 300, y2: 1090, label: '190 CM · 6′2″' }, items: [
      { dot: [360, 470], to: [660, 470], w: 230, val: 56, label: 'DEGREES OF FREEDOM', c: 'ink', t: 'w0.5' },
      { dot: [400, 680], to: [660, 680], w: 230, val: 50, unit: 'kg', label: 'PAYLOAD · 30 KG SUSTAINED', c: 'cob', t: 'b1' },
      { dot: [380, 860], to: [660, 860], w: 230, val: 4, unit: 'hrs', label: 'BATTERY · 3-MIN SWAP', c: 'ink', t: 'b1+1.2' }], t0: 'w0.2', fx: 'fade', nocheck: true },
    { type: 'chips', x: 660, y: 1010, items: [{ txt: 'REACH 2.3 M', c: 'org', t: 'b1+2.2' }], t0: 'b1+2.2', fx: 'fade' },
  ] },
  s03: { layers: [
    hud('03'),
    { type: 'count', x: 150, y: 245, val: 25000, size: 150, c: 'cob', label: 'ATLAS ROBOTS · HYUNDAI + KIA PLANTS', t0: 'b0', fx: 'fade' },
    { type: 'grid', x: 150, y: 520, cols: 20, rows: 10, cell: 30, gap: 8, fill: 200, dur: 1.6, t0: 'b0+0.8', fx: 'fade' },
    { type: 'chips', x: 150, y: 920, items: [{ txt: '1 SQUARE = 125 ROBOTS', t: 'b0+1.4', c: 'mut' }], size: 18, t0: 'b0+1.4', fx: 'fade' },
    { type: 'print', x: 150, y: 990, w: 330, h: 300, img: 'georgia-plant', cap: 'GEORGIA', rot: -2.5, tapes: [[-24, -10, -8]], t0: 'b1', fx: 'drop' },
    { type: 'chips', x: 520, y: 1010, col: 1, items: [{ txt: 'METAPLANT · SAVANNAH, GA', inv: 1, t: 'b1+0.1' }, { txt: 'FIRST WAVE: 2028', c: 'org', t: 'b1+0.9' }, { txt: 'KIA GEORGIA: 2029', t: 'b1+1.7' }], size: 22, t0: 'b1+0.1', fx: 'fade' },
  ] },
  s04: { layers: [
    hud('04'),
    { type: 'head', x: 150, y: 245, lines: [{ txt: 'What does one', size: 80, t: 'b0' }, { txt: 'cost? <span style="color:#ff5a1f;font-style:italic">Nobody says.</span>', size: 80, t: 'b0+0.3' }], t0: 'b0', fx: 'fade' },
    { type: 'chips', x: 150, y: 505, items: [{ txt: 'NO OFFICIAL PRICE · ANALYST ESTIMATES', c: 'mut' }], size: 20, t0: 'b0+0.6', fx: 'fade' },
    { type: 'blocks', x: 0, y: 0, items: [{ x: 150, y: 560, w: 360, h: 480, c: 'cob', big: '$130–\n140K', small: 'EARLY UNITS\n(ANALYST EST.)', t: 'b0+0.8' }, { x: 560, y: 880, w: 358, h: 160, c: 'org', big: '~$30K', small: "HYUNDAI'S TARGET", t: 'b1+0.8' }], arrow: { d: 'M520 600C560 600 540 760 560 900', t: 'b1+0.6' }, t0: 'b0+0.8', fx: 'fade', nocheck: true },
    { type: 'print', x: 640, y: 560, w: 270, h: 300, img: 'robot-factory-line', rot: 5, tapes: [[90, -14, -8]], t0: 'b0+1.4', fx: 'drop' },
    { type: 'progress', x: 150, y: 1090, w: 768, label: '…AFTER 50,000 ROBOTS BUILT', pct: 6, c: 'org', ticks: ['0', '25,000', '50,000'], t0: 'b1+1.2', fx: 'fade' },
    { type: 'chips', x: 150, y: 1200, items: [{ txt: 'BOSTON DYNAMICS: PARTS COST −60 TO −80%', t: 'b1+2.2' }], size: 20, t0: 'b1+2.2', fx: 'fade' },
  ] },
  s05: { layers: [
    hud('05'),
    { type: 'head', x: 150, y: 245, lines: [{ txt: 'The union', size: 110, t: 'b0' }, { txt: 'voted.', size: 110, i: 1, c: 'org', t: 'b0+0.3' }], t0: 'b0', fx: 'fade' },
    { type: 'count', x: 150, y: 520, val: 34000, pre: '>', size: 150, c: 'cob', label: 'MEMBERS SAID YES TO A STRIKE', t0: 'b1+0.5', fx: 'fade' },
    { type: 'progress', x: 150, y: 790, w: 768, label: 'OF ~40,000 UNION MEMBERS · 86%', pct: 86, c: 'cob', ticks: ['0', '20,000', '40,000'], t0: 'b1+0.9', fx: 'fade' },
    { type: 'print', x: 150, y: 930, w: 400, h: 360, img: 'factory-gate', cap: 'ULSAN, KOREA', rot: -2, t0: 'b1+0.3', fx: 'drop' },
    { type: 'chips', x: 600, y: 960, col: 1, items: [{ txt: 'JULY 2026', inv: 1, t: 'b0+0.8' }, { txt: 'HYUNDAI MOTOR', t: 'b0+1.3' }, { txt: 'WALKOUT VOTE', c: 'org', t: 'b1+1.8' }], t0: 'b0+0.8', fx: 'fade' },
  ] },
  s06: { layers: [
    hud('06', 'DRAFT'),
    { type: 'doc', x: 150, y: 245, w: 768, title: 'BARGAINING DEMAND · DRAFT', clause: 'No humanoid robot enters a Korean factory without union approval.', size: 44, mh: 220, th: 'b1', dur: 2.6, t0: 'b0', fx: 'rise' },
    { type: 'stamp', x: 640, y: 200, text: 'DEMAND', size: 46, c: 'org', rot: 8, t0: 'b1+2.8', fx: 'fade' },
    { type: 'quote', x: 150, y: 860, w: 768, size: 36, text: '…safeguards are in place before a single robot crosses the factory threshold.', who: 'BYUN JUN-HWAN · UNION LEADER', th: 'b1+1.0', dur: 2.2, t0: 'b1+0.8', fx: 'rise' },
    { type: 'chips', x: 150, y: 1180, items: [{ txt: 'REPORTEDLY A FIRST: CONSENT OVER HUMANOIDS', c: 'cob' }], size: 19, t0: 'b1+3.0', fx: 'fade' },
  ] },
  s07: { layers: [
    hud('07'),
    { type: 'head', x: 150, y: 245, lines: [{ txt: 'Three days.', size: 96, t: 'b0' }], t0: 'b0', fx: 'fade' },
    { type: 'calendar', x: 150, y: 400, w: 768, title: 'JULY 2026 · ULSAN WALKOUTS', days: [{ n: 11 }, { n: 12 }, { n: 13, l: '2 H EARLY', t: 'b0+0.4' }, { n: 14, l: '2 H EARLY', t: 'b0+0.9' }, { n: 15, l: '2 H EARLY', t: 'b0+1.4' }, { n: 16 }], t0: 'b0+0.2', fx: 'rise' },
    { type: 'fillicons', x: 150, y: 640, cols: 20, rows: 5, cell: 34, gap: 4, icon: 'car', dur: 1.6, t0: 'b0+1.0', fx: 'fade' },
    { type: 'count', x: 150, y: 880, pre: '~', val: 5000, suf: ' cars', size: 104, c: 'org', label: 'DISRUPTED · ≈ ₩200B (~$145M) OF OUTPUT', ls: 19, t0: 'b0+1.2', fx: 'fade' },
    { type: 'print', x: 560, y: 1050, w: 360, h: 240, img: 'car-bodies', rot: 3, tapes: [[40, -12, -8]], t0: 'b0+2.0', fx: 'drop' },
  ] },
  s08: { layers: [
    hud('08'),
    { type: 'head', x: 150, y: 245, lines: [{ txt: 'Train them.', size: 70, t: 'w1.2' }, { txt: 'Supervise them.', size: 70, t: 'w1.5' }, { txt: 'Maintain them.', size: 70, i: 1, c: 'org', t: 'w1.7' }], t0: 'b0', fx: 'fade' },
    { type: 'print', x: 690, y: 240, w: 230, h: 300, img: 'robot-hands', rot: 4, tapes: [[40, -14, -8]], t0: 'b1', fx: 'drop' },
    { type: 'flow', x: 150, y: 600, w: 768, steps: [{ icon: 'robot', l: 'ROBOT', t: 'b0+0.4' }, { icon: 'school', l: 'TRAIN', t: 'w1.2' }, { icon: 'users', l: 'SUPERVISE', t: 'w1.5' }, { icon: 'check', l: 'MAINTAIN', t: 'w1.7' }], t0: 'b0+0.4', fx: 'fade' },
    { type: 'quote', x: 150, y: 880, w: 768, size: 38, text: 'Workers will move to training, supervising and maintaining the robots.', who: 'JAEHOON CHANG · HYUNDAI VICE CHAIR · PARAPHRASED', th: 'b1+0.6', dur: 2.2, t0: 'b1+0.4', fx: 'rise' },
  ] },
  s09: { layers: [
    hud('09', 'FINAL'),
    { type: 'receipt', x: 150, y: 240, w: 768, title: 'RECEIPT · HYUNDAI MOTOR × UNION · AUG 2026', rows: [{ k: 'BASE PAY', v: '+₩100,000 /mo', t: 'w1.0' }, { k: 'BONUS', v: '> 400% of monthly pay', t: 'w1.1' }, { k: 'RETIREMENT AGE', v: '60 → 65*', t: 'w1.2' }, { k: 'NEW TECHNICAL JOBS', v: '+500 in 2 yrs', hl: 1, t: 'w1.5' }, { k: 'ROBOT PLANS', v: 'shared with union', t: 'w1.14' }], foot: '*DEPENDS ON LEGAL CHANGES', vote: { label: 'UNION VOTE · AUG 31 · 31,166 BALLOTS', pct: 61.55, yes: '61.55% YES', no: '38.23% NO', t: 'e1-0.8' }, t0: 'b0', fx: 'rise' },
    { type: 'stamp', x: 600, y: 205, text: 'Settled', size: 52, c: 'cob', rot: 10, t0: 'b0+0.8', fx: 'fade' },
    { type: 'print', x: 150, y: 960, w: 400, h: 330, img: 'handshake-table', cap: 'AUG 25 · TENTATIVE DEAL', rot: -2, t0: 'b1+0.2', fx: 'drop' },
    { type: 'chips', x: 580, y: 1000, col: 1, items: [{ txt: 'AUG 25 · TENTATIVE DEAL', t: 'b1+0.5' }, { txt: 'AUG 31 · RATIFIED', inv: 1, t: 'e1-0.6' }], size: 19, t0: 'b1+0.5', fx: 'fade' },
  ] },
  s10: { layers: [
    hud('10'),
    { type: 'split', x: 150, y: 245, w: 768, left: { icon: 'lock', h: 'KOREA', sub: 'NO ROBOT DEPLOYMENT\nANNOUNCED', c: 'org', t: 'b0+0.6' }, right: { icon: 'map-pin', h: 'GEORGIA', sub: 'NON-UNION PLANT\nFIRST IN LINE · 2028', c: 'cob', t: 'b1+0.3' }, t0: 'b0', fx: 'fade' },
    { type: 'print', x: 150, y: 740, w: 480, h: 540, img: 'georgia-plant-night', cap: 'SAVANNAH, GA · METAPLANT', rot: -2, t0: 'b1+0.5', fx: 'drop' },
    { type: 'chips', x: 650, y: 780, col: 1, items: [{ txt: 'PARTS SEQUENCING', t: 'b1+1.2' }, { txt: 'THEN ASSEMBLY', inv: 1, t: 'b1+1.7' }, { txt: 'BY ~2030', c: 'org', t: 'b1+2.2' }], size: 20, t0: 'b1+1.2', fx: 'fade' },
  ] },
  s11: { layers: [
    hud('11', 'END'),
    { type: 'head', x: 150, y: 245, lines: [{ txt: 'Would you', size: 84, t: 'b0' }, { txt: 'work next', size: 84, t: 'b0+0.2' }, { txt: 'to one?', size: 84, i: 1, c: 'org', t: 'b0+0.4' }], t0: 'b0', fx: 'fade' },
    { type: 'print', x: 580, y: 260, w: 330, h: 430, img: 'robot-silhouette', cap: 'FIG. 11 · NEXT SHIFT?', rot: 4, tapes: [[90, -14, -8]], t0: 'b0+0.3', fx: 'drop' },
    { type: 'chips', x: 150, y: 640, items: [{ txt: 'YES', inv: 1, c: 'cob', t: 'b0+1.2' }, { txt: 'NO', inv: 1, c: 'org', t: 'b0+1.5' }], t0: 'b0+1.2', fx: 'fade' },
    { type: 'cta', x: 150, y: 790, handle: '@sandesh<br>.explains', t0: 'b1', fx: 'rise' },
  ] },
};
