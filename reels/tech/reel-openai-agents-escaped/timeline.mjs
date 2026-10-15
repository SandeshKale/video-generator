// Per-scene layers. Times: number = s from scene start; "bN" beat start; "eN" beat end; "wN.K" word K of beat N; "+x" offsets.
const hud = (cam, mon, h, m, s) => ({ type: 'hud', cam, mon, h, m, s, t0: 0, fx: 'fade' });
export const SCENES = {
  s1: { move: 5, dim: 0.5, glitch: true, layers: [
    hud('CAM 04 · SANDBOX-EVAL', 'JUL 2026', 3, 14, 7),
    { type: 'title', x: 150, y: 330, lines: [
      { txt: 'Contain-<br>ment', size: 236, color: '#f2eee3', t: 'w0.4' },
      { txt: 'Breach', size: 236, tape: '#ff3b2f', mt: 6, t: 'w0.5+0.1' }], t0: 'w0.4', fx: 'fade' },
    { type: 'log', x: 150, y: 1010, w: 780, lines: [
      { h: '<span class="y">&gt;</span> sandbox .......... <span class="red">ESCAPED</span>', t: 'w0.5+0.4' },
      { h: '<span class="y">&gt;</span> egress filter ..... <span class="red">BYPASSED</span>', t: 'e0-0.6' },
      { h: '<span class="y">&gt;</span> target ............ <span class="y">huggingface</span>', t: 'w1.1' }], t0: 'w0.5+0.4', fx: 'fade' },
  ] },
  s2: { move: 0, dim: 0.5, layers: [
    hud('CAM 09 · HF-INGRESS', 'JUL 2026', 3, 41, 52),
    { type: 'swarm', x: 150, y: 330, tFill: 'w0.0', fillDur: 1.6, tEsc: 'w0.8', h: 420, t0: 'w0.0', fx: 'fade' },
    { type: 'count', cx: 540, cy: 1130, pre: '~', val: 700, size: 300, label: 'AGENTS · REPORTED', sub: 'in the intrusion', subsize: 64, count: 0.9, t0: 'b1', fx: 'slam' },
  ] },
  s3: { move: 3, dim: 0.5, layers: [
    hud('CAM 02 · DNS-EGRESS', 'SEP 2026', 22, 9, 31),
    { type: 'dns', cx: 540, cy: 690, t0: 'b0+0.3', t1: 'b1', fx: 'rise' },
    { type: 'tapes', cx: 540, cy: 1060, size: 66, items: [{ txt: 'TUNNELED VIA DNS', t: 'w0.7' }], t0: 'b0+1.5', t1: 'b1', fx: 'fade' },
    { type: 'ring', cx: 540, cy: 690, size: 560, val: 15, unit: 'MIN', dur: 1.1, t0: 'b1', fx: 'slam' },
    { type: 'title', cx: 540, y: 1050, align: 'center', lines: [{ txt: 'Flagged', size: 150, tape: '#ffd400', fg: '#0d0c0b', t: 'b1+1.0' }], t0: 'b1+1.0', fx: 'fade' },
  ] },
  s4: { move: 2, dim: 0.5, layers: [
    hud('CAM 11 · WEB-TRAFFIC', 'SEP 2026', 22, 41, 55),
    { type: 'count', x: 150, y: 270, val: 55, size: 340, sub: 'websites showed agent traffic', subsize: 76, count: 1.0, t0: 'b0+0.2', fx: 'slam' },
    { type: 'dots', x: 150, y: 790, n: 55, cols: 11, s: 52, g: 12, delay: 0.3, step: 0.035, t0: 'b0+0.4', fx: 'fade' },
    { type: 'tapes', x: 150, y: 1180, size: 54, items: [{ txt: 'SEC', t: 'w1.1' }, { txt: 'CDC', t: 'w1.3' }, { txt: 'CENSUS', t: 'w1.5' }], t0: 'b1', fx: 'fade' },
    { type: 'tapes', x: 150, y: 1275, size: 24, items: [{ txt: 'OBSERVED BY INDEPENDENT RESEARCHERS · NOT CONFIRMED BREACHES', bg: 'transparent', fg: '#b9b3a2', t: 'b1+0.2' }], t0: 'b1', fx: 'fade' },
  ] },
  s5: { move: 1, dim: 0.5, layers: [
    hud('CAM 05 · LOG-ARCHIVE', 'OCT 2026', 8, 15, 3),
    { type: 'count', x: 150, y: 270, pre: '', val: 100, suf: '+', size: 420, sub: 'organizations notified', subsize: 76, count: 0.9, t0: 'w0.4', fx: 'slam' },
    { type: 'tapes', x: 150, y: 790, size: 28, items: [{ txt: 'NOTIFIED ≠ BREACHED · SOME ONLY TOUCHED', bg: '#ff3b2f', fg: '#fff7ee', t: 'w0.8' }], t0: 'w0.4', fx: 'fade' },
    { type: 'scanner', x: 150, y: 860, title: 'LOG REVIEW · IN PROGRESS', val: 50, unit: 'PB', dur: 2.6, t0: 'b1', fx: 'rise' },
  ] },
  s6: { move: 4, dim: 0.5, layers: [
    hud('CAM 03 · STATEMENT', 'OCT 2026', 11, 2, 18),
    { type: 'title', x: 150, y: 460, lines: [{ txt: 'Their<br>explanation?', size: 190, color: '#f2eee3', t: 'b0' }], t0: 'b0', t1: 'b1', fx: 'fade' },
    { type: 'wordquote', x: 150, y: 380, beat: 1, size: 124, who: 'OPENAI STATEMENT', t0: 'b1', fx: 'fade' },
  ] },
  s7: { move: 3, dim: 0.5, layers: [
    hud('CAM 07 · REGULATORS', 'OCT 2026', 9, 2, 31),
    { type: 'folder', x: 150, y: 330, tab: 'CASE FILE 01', head: 'California AG', stamp: 'SUBPOENA SERVED', tStamp: 'w0.4', t0: 'b0', rot: -2, fx: 'left' },
    { type: 'folder', x: 150, y: 700, tab: 'CASE FILE 02', head: 'FTC', stamp: 'WIDER PROBE', tStamp: 'w1.6', t0: 'b1', rot: 1.6, fx: 'right' },
    { type: 'folder', x: 150, y: 1070, tab: 'CASE FILE 03', head: '15 states', stamp: 'RECORDS REQUESTED', tStamp: 'e2-0.5', t0: 'b2', rot: -1.2, fx: 'left' },
  ] },
  s8: { move: 1, dim: 0.5, glitch: true, layers: [
    hud('CAM 01 · PERMISSIONS', 'OCT 2026', 0, 0, 9),
    { type: 'toggles', x: 150, y: 300, items: [{ l: 'Email', t: 'w0.10' }, { l: 'Calendar', t: 'w0.11' }, { l: 'Payments', t: 'w0.12' }, { l: 'Full computer control', t: 'e0-0.2' }], t0: 'b0+0.4', fx: 'rise' },
    { type: 'cta', cx: 540, cy: 1130, q: 'Would you?', sub: 'FOLLOW FOR THE FOLLOW-UP', t0: 'b1', fx: 'stamp' },
  ] },
};
