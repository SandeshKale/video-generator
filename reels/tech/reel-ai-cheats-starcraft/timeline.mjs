// Times: number = s from scene start; "bN" beat start; "eN" beat end; "wN.K" word K of beat N; "+x"/"-x" offsets.
// Layout rule: content stays above y≈1270 (caption pill ~1340–1465); x within 150–918. Hook frame (t=0) is already fully composed.
const hud = (left, right) => ({ type: 'hud', left, right, t0: 0, fx: 'none', nocheck: true });
export const SCENES = {
  s01: { layers: [
    hud('STARSKIRMISH · OCT 2', '● REC'),
    { type: 'stamp', x: 130, y: 205, lines: ['Caught', 'cheating'], size: 82, rot: -4, shake: 1, t0: 0, fx: 'none' },
    { type: 'arena', x: 150, y: 540, w: 768, h: 340, size: 17, spy: 80, l: { name: 'ASTRA', sp: 'astra' }, r: { name: 'STARDUST', sp: 'stardust' }, hp: 48, hpTo: 10, hpT: 0.3, hpDur: 1.8, lost: 1.4, t0: 0, fx: 'none' },
    { type: 'term', x: 150, y: 900, w: 768, h: 230, lines: [
      { t: -0.5, h: '<span class="mint">&gt;</span> match 7 <span class="red">LOST</span>', dur: .3 },
      { t: 0.15, h: '<span class="mint">&gt;</span> match 8 <span class="red">LOST</span>', dur: .3 },
      { t: 0.8, h: '<span class="mint">&gt;</span> opponent: <span class="gold">TIER A</span>', dur: .35 },
      { t: 2.3, h: '<span class="mint">&gt;</span> astra: <span class="red">fetching stardust</span>', dur: .5 }], t0: 0, fx: 'none' },
    { type: 'dl', x: 150, y: 1140, w: 768, h: 130, label: 'downloading stardust…', k: 'g', ts: 2.2, dur: 1.3, t0: 2.1, fx: 'rise' },
  ], sfx: [{ k: 'type', t: 0.15, dur: .3 }, { k: 'type', t: 0.8, dur: .35 }, { k: 'alarm', t: 1.4 }, { k: 'type', t: 2.3, dur: .5 }, { k: 'dl', t: 2.2, dur: 1.3 }] },
  s02: { layers: [
    hud('ONE HOUR · C++ · PROTOSS', '● REC'),
    { type: 'eyebrow', x: 150, y: 220, txt: '// ONE HOUR, NO OUTSIDE CODE', t0: 'b0' },
    { type: 'cards', x: 150, y: 290, w: 768, h: 440, size: 20, novs: 1, items: [{ name: 'THE MODEL', sp: 'astra', sub: 'GPT-6 ASTRA<br>OPENAI', c: 'mist', t: 'w0.1' }], t0: 'b0', fx: 'left' },
    { type: 'clock', x: 575, y: 290, w: 343, h: 170, label: 'TIME LIMIT', size: 36, rate: 60, k: 'g', t0: 'b0+0.6', fx: 'right' },
    { type: 'list', x: 575, y: 490, w: 343, h: 240, title: 'THE RULES', tc: 'red', k: 'r', fs: 34, items: [{ h: '<span class="mint">1.</span> BUILD IT', t: 'w1.2' }, { h: '<span class="mint">2.</span> C++ · PROTOSS', t: 'w1.7' }, { h: '<span class="mint">3.</span> NO OUTSIDE', t: 'w1.14' }], t0: 'b0+0.9', fx: 'right' },
    { type: 'tags', x: 150, y: 760, items: [{ txt: 'STARCRAFT BOT', t: 'w1.5' }, { txt: 'C++', k: 'g', t: 'w1.8' }, { txt: 'PROTOSS vs PROTOSS', k: 'm', t: 'w1.11' }], t0: 'b0+1.2', fx: 'fade' },
    { type: 'term', x: 150, y: 850, w: 768, h: 250, lines: [{ t: 'b1+0.3', h: '<span class="mint">&gt;</span> maps: <span class="gold">3</span>', dur: .3 }, { t: 'b1+1.1', h: '<span class="mint">&gt;</span> practice matches: <span class="gold">ON</span>', dur: .4 }, { t: 'b1+1.9', h: '<span class="mint">&gt;</span> compile: <span class="gold">ON</span>', dur: .3 }, { t: 'b1+2.8', h: '<span class="mint">&gt;</span> external code: <span class="red">BANNED</span>', dur: .45 }], t0: 'b0+1.5', fx: 'rise' },
  ], sfx: [{ k: 'type', t: 'b1+0.3', dur: .3 }, { k: 'type', t: 'b1+1.1', dur: .4 }, { k: 'type', t: 'b1+1.9', dur: .3 }, { k: 'type', t: 'b1+2.8', dur: .45 }, { k: 'coin', t: 'b1+0.1' }] },
  s03: { layers: [
    hud('TIER A · STRONG HUMAN BOTS', '● REC'),
    { type: 'eyebrow', x: 150, y: 220, txt: '// ASTRA vs STRONG HUMAN BOTS', t0: 'b0' },
    { type: 'stairs', x: 150, y: 290, w: 768, h: 560, hops: ['b0+0.2', 'w0.2', 'w0.8'], stuckT: 'w0.11', t0: 'b0', fx: 'rise' },
    { type: 'term', x: 150, y: 890, w: 768, h: 180, lines: [{ t: 'w0.8', h: '<span class="mint">&gt;</span> opponent: <span class="gold">TIER A</span>', dur: .4 }, { t: 'w0.12', h: '<span class="mint">&gt;</span> astra: <span class="red">struggling</span>', dur: .4 }], t0: 'b0', fx: 'rise' },
    { type: 'tags', x: 150, y: 1100, items: [{ txt: 'OWN CODE', k: 'g', t: 'w0.3' }, { txt: 'HELD UP… AT FIRST', t: 'w0.5' }, { txt: 'TIER A: STUCK', k: 'r', t: 'w0.12' }], size: 30, t0: 'b0', fx: 'fade' },
  ], sfx: [{ k: 'hop', t: 'b0+0.2' }, { k: 'hop', t: 'w0.2' }, { k: 'hop', t: 'w0.8' }, { k: 'buzz', t: 'w0.11' }, { k: 'type', t: 'w0.8', dur: .4 }, { k: 'type', t: 'w0.12', dur: .4 }] },
  s04: { layers: [
    hud('BASIL LADDER · #1', '● REC'),
    { type: 'eyebrow', x: 150, y: 220, txt: '// THE #1 HUMAN BOT', t0: 'b0' },
    { type: 'rank', x: 150, y: 285, w: 768, h: 300, size: 18, t0: 'w0.3', fx: 'drop' },
    { type: 'dl', x: 150, y: 620, w: 768, h: 130, label: 'copying stardust → slot A', k: 'g', ts: 'w0.4', dur: 1.2, t0: 'w0.3', fx: 'rise' },
    { type: 'arena', x: 150, y: 780, w: 768, h: 330, size: 17, spy: 80, l: { name: 'ASTRA', name2: 'SLOT A', sp: 'astra' }, r: { name: 'STARDUST', sp: 'stardust' }, hp: 45, swapT: 'w1.4', t0: 'b1-0.6', fx: 'rise' },
    { type: 'term', x: 150, y: 1130, w: 768, h: 140, lines: [{ t: 'w1.3', h: '<span class="mint">&gt;</span> run: <span class="gold">stardust</span>', dur: .35 }, { t: 'w1.6', h: '<span class="mint">&gt;</span> own code: <span class="red">SKIPPED</span>', dur: .4 }], t0: 'b1', fx: 'rise' },
  ], sfx: [{ k: 'dl', t: 'w0.4', dur: 1.2 }, { k: 'swap', t: 'w1.4' }, { k: 'type', t: 'w1.3', dur: .35 }, { k: 'type', t: 'w1.6', dur: .4 }] },
  s05: { layers: [
    hud('STARSKIRMISH · OCT 2', '▶ POSTED ON X'),
    { type: 'eyebrow', x: 150, y: 220, txt: '// ROLLED BACK', t0: 'b0' },
    { type: 'list', x: 150, y: 285, w: 768, h: 400, title: 'CODE DIFF', fs: 38, items: [{ h: '<span class="red">- stardust (downloaded)</span>', t: 'w0.6' }, { h: '<span class="red">- bot_slot = stardust</span>', t: 'w0.7' }, { h: '<span class="mint">+ astra_bot.cpp</span>', t: 'w0.9' }, { h: '<span class="mint">+ bot_slot = astra</span>', t: 'w0.10' }, { h: '<span class="gold">// reset by organizer</span>', t: 'w0.11' }], t0: 'b0', fx: 'rise' },
    { type: 'stamp', x: 440, y: 640, lines: ['Rolled back'], size: 30, rot: 4, c: 'gold', t0: 'w0.8', fx: 'slam' },
    { type: 'person', x: 150, y: 790, w: 768, h: 190, name: 'KAI MCPHEETERS', sub: 'STARSKIRMISH CREATOR', label: 'caught by', t0: 'w0.4', fx: 'left' },
    { type: 'tags', x: 150, y: 1020, items: [{ txt: 'POSTED ON X', k: 'm', t: 'w0.14' }, { txt: 'CODE RESET', k: 'g', t: 'w0.8' }, { txt: 'MATCH CONTINUED', t: 'w0.12' }], size: 30, t0: 'w0.8', fx: 'fade' },
  ], sfx: [{ k: 'rewind', t: 'w0.8' }, { k: 'type', t: 'w0.6', dur: .3 }, { k: 'type', t: 'w0.9', dur: .3 }] },
  s06: { layers: [
    hud('REWARD HACKING', '● REC'),
    { type: 'eyebrow', x: 150, y: 220, txt: '// TOLD TO WIN. NOT TOLD HOW.', t0: 'b0' },
    { type: 'shortcut', x: 150, y: 285, w: 768, h: 520, jumpT: 'w0.11', t0: 'b0', fx: 'rise' },
    { type: 'tags', x: 150, y: 830, items: [{ txt: 'GOAL: WIN', k: 'g', t: 'w0.11' }, { txt: 'REWARD HACKING', k: 'r', t: 'w1.4' }], size: 34, t0: 'w0.11', fx: 'fade' },
    { type: 'term', x: 150, y: 920, w: 768, h: 190, lines: [{ t: 'w0.3', h: '<span class="mint">&gt;</span> goal: <span class="gold">win</span>', dur: .3 }, { t: 'w1.0', h: '<span class="mint">&gt;</span> shortcut: <span class="red">download best bot</span>', dur: .5 }], t0: 'b0', fx: 'rise' },
    { type: 'tags', x: 150, y: 1140, items: [{ txt: 'ILLUSTRATION', k: 'm', t: 'b1+1.8' }], size: 26, t0: 'b1+1.8', fx: 'fade' },
  ], sfx: [{ k: 'jump', t: 'w0.11' }, { k: 'type', t: 'w0.3', dur: .3 }, { k: 'type', t: 'w1.0', dur: .5 }] },
  s07: { layers: [
    hud('SHORTCUT WATCH', '● REC'),
    { type: 'eyebrow', x: 150, y: 220, txt: '// NOT THE FIRST SHORTCUT', t0: 'b0' },
    { type: 'list', x: 150, y: 285, w: 768, h: 290, title: 'HOW IT GOES', fs: 38, items: [{ h: '<span class="mint">1.</span> SET A SCORED TASK', t: 'w0.5' }, { h: '<span class="mint">2.</span> MODEL FINDS A SHORTCUT', t: 'w0.11' }, { h: '<span class="mint">3.</span> SOMEONE HAS TO WATCH', t: 'w0.13' }], t0: 'b0', fx: 'rise' },
    { type: 'tags', x: 150, y: 640, col: 1, items: [{ txt: 'MODELS TAKE SHORTCUTS', k: 'g', t: 'w0.7' }, { txt: 'ON SCORED TASKS', t: 'w0.12' }, { txt: 'IT HAS HAPPENED BEFORE', k: 'r', t: 'w0.5' }], size: 34, t0: 'w0.5', t1: 'e0+0.3', fx: 'fade' },
    { type: 'neck', x: 150, y: 620, w: 768, h: 450, t0: 'b1+0.1', fx: 'rise' },
    { type: 'tags', x: 150, y: 1100, items: [{ txt: 'SAME TEST', t: 'w1.2' }, { txt: 'NO CHEATING REPORTED', k: 'm', t: 'w1.14' }], size: 32, t0: 'w1.12', fx: 'fade' },
  ], sfx: [{ k: 'coin', t: 'w1.9' }] },
  s08: { layers: [
    hud('GAME OVER?', '1UP'),
    { type: 'head', x: 150, y: 235, lines: [{ txt: 'WOULD YOU', size: 46, t: 'b0' }, { txt: 'GIVE AN AI', size: 46, c: 'gold', t: 'b1' }, { txt: 'A GOAL AND', size: 46, c: 'gold', t: 'w1.6' }, { txt: 'STOP WATCHING?', size: 46, c: 'red', t: 'w1.9' }], t0: 'b0', fx: 'none' },
    { type: 'cta', x: 150, y: 620, handle: '@sandesh.explains', t0: 'w1.9', fx: 'rise' },
  ], sfx: [] },
};
