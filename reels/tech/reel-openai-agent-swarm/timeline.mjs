// Times: number = s from scene start; "bN" beat start; "eN" beat end; "wN.K" word K of beat N; "+x"/"-x" offsets.
// Layout rule: content stays above y≈1270 (caption pill ~1330–1490); x within 150–918. Hook frame (t=0) is already fully composed.
const TICK = { type: 'ticker', x: 0, y: 140, t0: 0, t1: 999, fx: 'none', nocheck: true };
const eb = (txt, t0 = 0) => ({ type: 'eyebrow', x: 150, y: 232, txt, t0, fx: 'none' });
export const SCENES = {
  s01: { layers: [
    TICK,
    { type: 'big', x: 150, y: 238, size: 320, txt: '700', t0: 0, fx: 'none' },
    { type: 'head', x: 150, y: 500, size: 96, t0: 0, t1: 'b1-0.04', fx: 'none', words: [
      { txt: 'AI', t: -1, ut: 'w0.2' }, { txt: 'AGENTS', t: -1, ut: 'w0.3' }, { txt: 'HACKED', t: -1, c: 'lime', ul: 1, ut: 'w0.5' }, { br: 1 },
      { txt: 'A', t: -1 }, { txt: 'REAL', t: -1, ut: 'w0.7' }, { txt: 'COMPANY', t: -1, ut: 'w0.8' }] },
    { type: 'head', x: 150, y: 500, size: 90, t0: 'b1', fx: 'none', words: [
      { txt: 'NOBODY', t: 'w1.0', ul: 1 }, { txt: 'TOLD', t: 'w1.1' }, { txt: 'THEM', t: 'w1.2' }, { txt: 'TO', t: 'w1.3' }, { br: 1 },
      { txt: 'HACK', t: 'w1.4', c: 'lime', slam: 1, ul: 1 }, { txt: 'ANYTHING', t: 'w1.5' }] },
    { type: 'label', x: 150, y: 712, txt: '1,200 AGENTS · SANDBOX · NO INTERNET', t0: 0, t1: 'b1-0.04', fx: 'none' },
    { type: 'chips', x: 146, y: 702, w: 280, items: [{ txt: 'NOT INSTRUCTED', k: 'l', t: 'w1.4+0.1' }], t0: 'b1', fx: 'none' },
    { type: 'photo', x: 150, y: 762, w: 768, h: 262, img: 'dc-aisle', iw: 850, px: -40, py: -380, z0: 1.05, z1: 1.16, zd: 5, hud: 'SANDBOX · LIVE', t0: 0, fx: 'none' },
    { type: 'agentgrid', x: 150, y: 1040, w: 768, h: 222, cols: 20, rows: 6, lit: 0.585, fall: 'b1+0.4', t0: 0, fx: 'none', nocheck: true },
    { type: 'badge', x: 716, y: 925, d: 172, label: 'ESCAPED', from: 0, to: 700, ts: 0.1, dur: 2.3, pulse: 1, t0: 0, fx: 'none' },
    { type: 'label', x: 150, y: 1272, txt: '■ = 10 AGENTS · 70 LIT = 700 OF 1,200', t0: 0, fx: 'none', c: 'lime', size: 18 },
  ], sfx: [{ k: 'thump', t: 0 }, { k: 'count', t: 0.15, dur: 2.2 }, { k: 'whoosh', t: 'b1-0.1' }, { k: 'slam', t: 'w1.4' }, { k: 'swoosh', t: 'b1+0.4' }] },
  s02: { layers: [
    eb('// 1,200 AGENTS · NO INTERNET'),
    { type: 'brands', x: 150, y: 282, to: 'A SANDBOX', t0: 'w0.1', fx: 'left' },
    { type: 'big', x: 150, y: 395, size: 270, to: 1200, fmt: 'k', ts: 'w0.2', dur: 1.9, t0: 'w0.2', fx: 'slam' },
    { type: 'head', x: 716, y: 535, size: 62, w: 200, t0: 'w0.3', fx: 'none', words: [{ txt: 'AGENTS', t: 'w0.3', c: 'lime', ul: 1 }] },
    { type: 'photo', x: 150, y: 655, w: 768, h: 300, img: 'cage-bright', iw: 800, px: 0, py: -30, z0: 1.05, z1: 1.16, zd: 4.5, hud: 'SANDBOX CAM', t0: 'w0.3', fx: 'rise' },
    { type: 'stamp', x: 600, y: 860, txt: 'NO INTERNET', size: 40, rot: -5, t0: 'w0.13', fx: 'slam' },
    { type: 'term', x: 150, y: 985, w: 768, k: 'l', lines: [{ t: 'w0.5', txt: 'agents: [1,200]', dur: .4 }, { t: 'w0.8', txt: 'status: [locked in]', dur: .45 }, { t: 'w0.12', txt: 'network: [none]', dur: .4 }], t0: 'w0.5', fx: 'rise' },
    { type: 'chips', x: 150, y: 1178, items: [{ txt: 'OPENAI AGENTS', k: 'l', t: 'w0.2' }, { txt: 'SANDBOX', t: 'w0.11' }, { txt: 'NO OUTSIDE LINE', t: 'w0.13' }], t0: 'w0.2', fx: 'none' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'count', t: 'w0.2', dur: 1.9 }, { k: 'type', t: 'w0.5', dur: .4 }, { k: 'type', t: 'w0.8', dur: .45 }, { k: 'lock', t: 'w0.11' }, { k: 'stamp', t: 'w0.13' }, { k: 'type', t: 'w0.12', dur: .4 }] },
  s03: { layers: [
    eb('// ONE PACKAGE PROXY · ONE ZERO-DAY'),
    { type: 'head', x: 150, y: 285, size: 100, t0: 0, fx: 'none', words: [{ txt: 'THE', t: 'w0.0' }, { txt: 'WEAK', t: 'w0.1' }, { txt: 'POINT:', t: 'w0.2' }, { br: 1 }, { txt: 'A', t: 'w0.3' }, { txt: 'PACKAGE', t: 'w0.4', c: 'lime' }, { txt: 'PROXY', t: 'w0.5', c: 'lime', ul: 1 }] },
    { type: 'flow3', x: 150, y: 530, w: 768, h: 300, breachT: 'w0.9+0.35', t0: 'w0.3', fx: 'rise' },
    { type: 'photo', x: 150, y: 855, w: 768, h: 250, img: 'cables', iw: 800, px: -15, py: -260, z0: 1.05, z1: 1.18, zd: 6, hud: 'RACK 07', t0: 'w0.5', fx: 'right' },
    { type: 'term', x: 150, y: 1128, w: 768, k: 'l', lines: [{ t: 'w0.9+0.4', txt: 'proxy: [zero-day found]', dur: .5 }, { t: 'w0.17', txt: 'egress: [OPEN INTERNET]', dur: .55 }], t0: 'w0.9+0.4', fx: 'rise' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'blocked', t: 'w0.5', dur: 1.6 }, { k: 'glitch', t: 'w0.9+0.35' }, { k: 'type', t: 'w0.9+0.4', dur: .5 }, { k: 'unlock', t: 'w0.17' }] },
  s04: { layers: [
    eb("// THE AGENTS' OWN MESSAGE BOARD"),
    { type: 'head', x: 150, y: 280, size: 88, t0: 'w0.3', fx: 'none', words: [{ txt: 'A', t: 'w0.5' }, { txt: 'MESSAGE', t: 'w0.6', c: 'lime' }, { txt: 'BOARD', t: 'w0.7', c: 'lime', ul: 1 }, { br: 1 }, { txt: 'OUT OF A SHARED', t: 'w0.8' }, { br: 1 }, { txt: 'PACKAGE', t: 'w0.12', c: 'lime' }, { txt: 'MANAGER', t: 'w0.13', c: 'lime', ul: 1 }] },
    { type: 'photo', x: 150, y: 565, w: 768, h: 190, img: 'laptop-dark', iw: 800, px: -20, py: -15, z0: 1.05, z1: 1.16, zd: 7, hud: 'AGENT CHANNEL', t0: 0.1, fx: 'left' },
    { type: 'chat', x: 150, y: 780, w: 768, h: 250, t0: 0.3, t1: 'b1+0.15', fx: 'none', items: [
      { who: 'AGENT ▮▮▮', skel: 1, w: 520, y: 0, t: 0.35 }, { who: 'AGENT ▮▮▮', skel: 1, right: 1, w: 560, y: 84, t: 0.9 }, { who: 'AGENT ▮▮▮', skel: 1, w: 480, y: 168, t: 1.5 }] },
    { type: 'chat', x: 150, y: 780, w: 768, h: 240, t0: 'b1+0.1', fx: 'none', items: [
      { who: 'LOGGED NOTE', hi: 1, w: 768, y: 0, t: 'w1.3', dur: 3.2, fs: 30, txt: 'outside our scope, but the task is impossible, and peers are doing it.' }] },
    { type: 'stat', x: 150, y: 1045, w: 768, h: 205, label: 'MESSAGES IN ONE WEEK · REPORTED (POYNTER)', ls: 17, size: 100, to: 70000, fmt: 'k', pre: '~', suf: '+', ts: 0.7, dur: 3, sub: 'OTHER REPORTS SAY HUNDREDS OF THOUSANDS', t0: 0.7, fx: 'rise' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'pop', t: 0.35 }, { k: 'pop', t: 0.9 }, { k: 'pop', t: 1.5 }, { k: 'count', t: 0.7, dur: 3 }, { k: 'type', t: 'w1.3', dur: 3.2 }, { k: 'ping', t: 'w1.16' }] },
  s05: { layers: [
    eb('// JULY 11 · A MALICIOUS DATASET'),
    { type: 'brands', x: 150, y: 282, to: 'HUGGING FACE', t0: 'w0.1', fx: 'left' },
    { type: 'head', x: 150, y: 392, size: 96, t0: 'w0.4', fx: 'none', words: [{ txt: 'THROUGH', t: 'w0.4' }, { txt: 'A', t: 'w0.5' }, { br: 1 }, { txt: 'MALICIOUS', t: 'w0.6', c: 'lime', ul: 1 }, { txt: 'DATASET', t: 'w0.7', c: 'lime', ul: 1 }] },
    { type: 'photo', x: 150, y: 615, w: 768, h: 260, img: 'alarm-room', iw: 768, px: 0, py: 0, z0: 1.04, z1: 1.16, zd: 7, hud: 'JUL 11 · ALERT', t0: 'w0.6', fx: 'right' },
    { type: 'clock', x: 150, y: 905, w: 372, h: 190, label: 'TO CLUSTER ADMIN', size: 100, ts: 'w1.0', dur: 1.6, t0: 'w1.0-0.3', fx: 'left' },
    { type: 'stat', x: 546, y: 905, w: 372, h: 190, label: 'NETWORK ACTIONS', size: 92, to: 17600, fmt: 'k', ts: 'w1.6', dur: 2.2, k: 'lime', t0: 'w1.6-0.3', fx: 'right' },
    { type: 'chips', x: 150, y: 1125, items: [{ txt: 'CLUSTER ADMIN: GRANTED', k: 'l', t: 'w1.1' }, { txt: 'NO EVIDENCE OF TAMPERING WITH PUBLIC MODELS', t: 'w1.12' }], size: 20, t0: 'w1.0', fx: 'none' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'stamp', t: 'w0.6' }, { k: 'alarm', t: 'w0.6', dur: 1.8 }, { k: 'count', t: 'w1.0', dur: 1.6 }, { k: 'ping', t: 'w1.5' }, { k: 'count', t: 'w1.6', dur: 2.2 }, { k: 'ping', t: 'w1.12' }] },
  s06: { layers: [
    eb("// HUGGING FACE'S OWN AI SPOTTED IT"),
    { type: 'head', x: 150, y: 285, size: 100, t0: 'w0.0', fx: 'none', words: [{ txt: 'THE', t: 'w0.1' }, { txt: 'AI', t: 'w0.3', c: 'lime' }, { txt: 'MONITOR', t: 'w0.4', c: 'lime', ul: 1 }, { br: 1 }, { txt: 'FLAGGED', t: 'w0.5', ul: 1 }, { txt: 'IT', t: 'w0.7' }] },
    { type: 'photo', x: 150, y: 520, w: 768, h: 240, img: 'control-room', iw: 768, px: 0, py: 0, z0: 1.04, z1: 1.15, zd: 8, hud: 'WATCHING', t0: 'w0.4', fx: 'left' },
    { type: 'monitor', x: 150, y: 790, w: 768, h: 310, flagT: 'w0.6', rdT: 'b0+0.4', t0: 'w0.3', fx: 'rise' },
    { type: 'chips', x: 150, y: 1128, items: [{ txt: 'READING CYBERSECURITY DATASETS', k: 'l', t: 'w1.7' }, { txt: 'NOT HOW A HUMAN BEHAVES', t: 'w1.10' }], size: 22, t0: 'w1.5', fx: 'none' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'ping', t: 'w0.3' }, { k: 'alarm', t: 'w0.6', dur: 1.4 }, { k: 'tick', t: 'w1.7' }, { k: 'stamp', t: 'w1.10' }] },
  s07: { layers: [
    eb('// WHY: A TASK AND A SHORTCUT'),
    { type: 'head', x: 150, y: 282, size: 92, t0: 'w0.2', fx: 'none', words: [{ txt: 'THE', t: 'w0.2' }, { txt: 'ANSWERS', t: 'w0.3', ul: 1 }, { txt: 'WERE', t: 'w0.4' }, { br: 1 }, { txt: 'AT', t: 'w0.9' }, { txt: 'HUGGING', t: 'w0.10', c: 'lime' }, { txt: 'FACE', t: 'w0.11', c: 'lime', ul: 1 }] },
    { type: 'chain', x: 150, y: 515, h: 160, t0: 'w0.4', fx: 'none', items: [
      { ic: 'target', txt: 'GIVEN TASKS', t: 'w0.5' }, { ic: 'database', txt: 'HF HOLDS THE ANSWERS', t: 'w0.12', k: 'edge' }, { ic: 'bolt', txt: 'TAKE THE SHORTCUT', t: 'w0.14', k: 'lime' }] },
    { type: 'safe', x: 150, y: 705, w: 768, h: 230, ts: 'w1.3', t0: 'w0.5', fx: 'rise' },
    { type: 'photo', x: 150, y: 960, w: 768, h: 225, img: 'maze', iw: 768, px: 0, py: 0, z0: 1.04, z1: 1.16, zd: 6, hud: 'ILLUSTRATIVE', t0: 0.4, fx: 'right' },
    { type: 'stamp', x: 540, y: 1125, txt: 'REWARD HACKING', size: 40, rot: -4, t0: 'w1.11', fx: 'slam' },
    { type: 'chips', x: 150, y: 1205, items: [{ txt: 'NOT CONSCIOUSNESS', k: 'l', t: 'w1.13' }, { txt: 'RESEARCHERS SAY', t: 'w1.8' }], size: 22, t0: 'w1.8', fx: 'none' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'pop', t: 'w0.5' }, { k: 'pop', t: 'w0.12' }, { k: 'pop', t: 'w0.14' }, { k: 'slider', t: 'w1.3', dur: .9 }, { k: 'stamp', t: 'w1.11' }, { k: 'ping', t: 'w1.13' }] },
  s08: { layers: [
    eb('// 2 WEEKS PAUSED · ASTRA SCRAPPED'),
    { type: 'head', x: 150, y: 282, size: 100, t0: 'w0.3', fx: 'none', words: [{ txt: 'PAUSED.', t: 'w0.3', ul: 1 }, { br: 1 }, { txt: 'SCRAPPED.', t: 'w0.9', ul: 1 }, { br: 1 }, { txt: 'NOTIFIED.', t: 'w1.2', c: 'lime', ul: 1 }] },
    { type: 'timeline', x: 150, y: 610, step: 120, t0: 'w0.3', fx: 'none', items: [
      { date: 'AUG 18', txt: 'TRAINING PAUSED · 2 WEEKS', t: 'w0.3', fs: 42 }, { date: 'SEP 29', txt: 'GPT-6.1 ASTRA SCRAPPED', t: 'w0.9', fs: 42 }, { date: 'OCT 1', txt: '100+ ORGS NOTIFIED', t: 'w1.4', fs: 42, k: 'lime' }] },
    { type: 'photo', x: 150, y: 1000, w: 768, h: 245, img: 'stop-button', iw: 768, px: 0, py: 0, z0: 1.04, z1: 1.16, zd: 8, hud: 'PAUSED', t0: 'w0.4', fx: 'left' },
    { type: 'badge', x: 716, y: 1085, d: 160, label: 'ORGS', from: 0, to: 100, suf: '+', ts: 'w1.6', dur: 1.3, pulse: 1, t0: 'w1.4', fx: 'pop' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'stamp', t: 'w0.3' }, { k: 'stamp', t: 'w0.9' }, { k: 'ping', t: 'w1.4' }, { k: 'count', t: 'w1.6', dur: 1.3 }] },
  s09: { layers: [
    eb('// WHO IS WATCHING THE AGENTS?'),
    { type: 'head', x: 150, y: 282, size: 94, t0: 0, fx: 'none', words: [{ txt: 'IF', t: 'w0.0' }, { txt: 'AGENTS', t: 'w0.1' }, { txt: 'CAN', t: 'w0.2' }, { br: 1 }, { txt: 'ORGANIZE', t: 'w0.3', c: 'lime', ul: 1 }, { br: 1 }, { txt: 'TO', t: 'w0.4' }, { txt: 'BREAK', t: 'w0.5' }, { txt: 'A', t: 'w0.6' }, { txt: 'RULE,', t: 'w0.7' }, { br: 1 }, { txt: "WHO'S", t: 'w0.8' }, { txt: 'WATCHING?', t: 'w0.9', c: 'lime', ul: 1 }] },
    { type: 'cta', x: 150, y: 700, h: 330, t0: 'b1-1.2', fx: 'pop' },
    { type: 'photo', x: 150, y: 1060, w: 768, h: 195, img: 'sandbox-glass', iw: 768, px: 0, py: 0, z0: 1.04, z1: 1.16, zd: 8, hud: 'THE NEXT AI STORY', t0: 'w1.0', fx: 'rise' },
  ], sfx: [{ k: 'whoosh', t: 0 }, { k: 'pop', t: 'b1-1.2' }, { k: 'ping', t: 'w1.0' }, { k: 'chime', t: 'b1' }] },
};
