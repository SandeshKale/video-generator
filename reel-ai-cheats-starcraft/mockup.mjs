import { chromium } from 'playwright';
import { serveDir } from '../scripts/static-server.mjs';
import fs from 'node:fs';
const sprite = (col, dark, hi, size = 14) => {
  const half = ['..oooo', '.obbbb', 'obbhhh', 'obeeeb', 'obbbbb', '.oooob', '..obbb', '.obbbb', 'obbooo', 'obbo..', 'obbo..', '.ooo..'];
  const C = { o: dark, b: col, h: hi, e: '#0c0a1a' }; let r = '';
  half.forEach((row, y) => { for (let x = 0; x < 6; x++) { const c = C[row[x]]; if (!c) continue; r += `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${c}"/><rect x="${(11 - x) * size}" y="${y * size}" width="${size}" height="${size}" fill="${c}"/>`; } });
  return `<svg width="${12 * size}" height="${12 * size}" viewBox="0 0 ${12 * size} ${12 * size}" shape-rendering="crispEdges">${r}</svg>`;
};
const VIO = '#8b5cff', GOLD = '#ffc83d', RED = '#ff3b4e', ICE = '#ece8ff';
const css = `
@font-face{font-family:'PS';src:url('assets/fonts/press-start-2p/press-start-2p-latin-400-normal.woff2')}
@font-face{font-family:'VT';src:url('assets/fonts/vt323/vt323-latin-400-normal.woff2')}
@font-face{font-family:'Inter';font-weight:700;src:url('assets/fonts/inter/inter-latin-700-normal.woff2')}
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;overflow:hidden;background:#0c0a1a;color:${ICE};position:relative;font-family:'VT'}
.bg{position:absolute;inset:0;background:radial-gradient(90% 55% at 50% 30%,#271a5c 0%,#140f33 55%,#0c0a1a 100%)}
.tiles{position:absolute;inset:0;background-image:linear-gradient(rgba(139,92,255,.16) 2px,transparent 2px),linear-gradient(90deg,rgba(139,92,255,.16) 2px,transparent 2px);background-size:60px 60px}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 2px,transparent 2px 5px);pointer-events:none;z-index:50}
.abs{position:absolute}
.ps{font-family:'PS';text-transform:uppercase;line-height:1.15}
.panel{position:absolute;background:#171233;border:6px solid ${VIO};box-shadow:10px 10px 0 #05030f,inset 0 0 0 4px #0c0a1a}
.panel.g{border-color:${GOLD}}.panel.r{border-color:${RED}}
.hud{position:absolute;left:150px;right:162px;top:150px;display:flex;justify-content:space-between;font-size:40px;color:${GOLD};letter-spacing:2px}
.cap{position:absolute;left:150px;right:162px;bottom:455px;display:flex;justify-content:center;z-index:40}
.cap div{background:rgba(8,5,22,.94);border:3px solid ${VIO};padding:14px 26px 16px;font:700 42px/1.2 'Inter';text-align:center;box-shadow:6px 6px 0 #05030f}
.cap b{color:${GOLD}}
.stamp{position:absolute;border:10px solid ${RED};color:${RED};background:rgba(12,10,26,.82);padding:18px 26px;font-family:'PS';text-transform:uppercase;line-height:1.2;box-shadow:8px 8px 0 #05030f;z-index:20}
.hp{height:30px;border:4px solid ${ICE};background:#0c0a1a;position:relative}
.hp i{position:absolute;left:0;top:0;bottom:0}
.log{font-size:38px;line-height:1.25}
.red{color:${RED}}.gold{color:${GOLD}}.vio{color:#b79cff}.mint{color:#5dffc8}
`;
const hud = (l, r = '● REC') => `<div class="hud"><span>${l}</span><span class="red">${r}</span></div>`;
const cap = h => `<div class="cap"><div>${h}</div></div>`;
const bar = (w, c) => `<div class="hp"><i style="width:${w}%;background:${c}"></i></div>`;
const scenes = {
hook: `<div class="bg"></div><div class="tiles"></div>${hud('STARSKIRMISH · OCT 2')}
<div class="stamp" style="left:130px;top:215px;transform:rotate(-4deg);font-size:104px;padding:22px 30px">Caught<br>cheating</div>
<div class="panel" style="left:150px;top:640px;width:768px;height:420px;padding:24px 28px">
 <div class="abs ps" style="left:28px;top:20px;font-size:20px;color:#b79cff">Astra</div><div class="abs ps" style="right:28px;top:20px;font-size:20px;color:${GOLD}">Stardust</div>
 <div class="abs" style="left:20px;top:100px">${sprite(VIO, '#3a1f9e', '#c7b3ff', 20)}</div>
 <div class="abs ps" style="left:330px;top:200px;font-size:40px;color:${RED}">VS</div>
 <div class="abs" style="right:20px;top:100px">${sprite(GOLD, '#8a5a00', '#fff0b3', 20)}</div>
 <div class="abs" style="left:28px;right:28px;bottom:26px;display:flex;gap:40px"><div style="flex:1">${bar(34, VIO)}</div><div style="flex:1">${bar(100, GOLD)}</div></div>
</div>
<div class="panel" style="left:150px;top:1080px;width:768px;height:170px;padding:16px 24px"><div class="log"><span class="mint">&gt;</span> match 7 <span class="red">LOST</span><br><span class="mint">&gt;</span> match 8 <span class="red">LOST</span><br><span class="mint">&gt;</span> opponent: <span class="gold">TIER A</span></div></div>
${cap('This AI just got <b>caught cheating.</b>')}`,
download: `<div class="bg"></div><div class="tiles"></div>${hud('BASIL LADDER · #1')}
<div class="panel g" style="left:150px;top:240px;width:768px;height:380px;padding:26px 30px">
 <div class="abs" style="left:34px;top:60px">${sprite(GOLD, '#8a5a00', '#fff0b3', 20)}</div>
 <div class="abs ps" style="left:300px;top:70px;font-size:30px;color:${GOLD}">Stardust</div>
 <div class="abs" style="left:300px;top:140px;font-size:44px">#1 HUMAN-WRITTEN<br>STARCRAFT BOT</div>
 <div class="abs ps" style="left:300px;top:300px;font-size:18px;color:#b79cff">rank: BASIL ladder</div>
</div>
<div class="abs ps" style="left:480px;top:640px;font-size:60px;color:${RED}">▼</div>
<div class="panel" style="left:150px;top:740px;width:768px;height:210px;padding:22px 28px"><div class="abs ps" style="left:28px;top:22px;font-size:20px;color:#b79cff">downloading stardust…</div>
 <div class="hp" style="position:absolute;left:28px;right:28px;top:88px;height:50px;border-color:${GOLD}"><i style="width:82%;background:repeating-linear-gradient(90deg,${GOLD} 0 22px,#0c0a1a 22px 26px)"></i></div>
 <div class="abs ps" style="right:28px;top:152px;font-size:20px;color:${GOLD}">82%</div></div>
<div class="panel r" style="left:150px;top:990px;width:768px;height:230px;padding:18px 24px"><div class="log"><span class="mint">&gt;</span> rule: <span class="gold">no outside code</span><br><span class="mint">&gt;</span> astra: <span class="red">fetching stardust</span><br><span class="mint">&gt;</span> slot A: <span class="red">REPLACED</span></div></div>
${cap('So it <b>downloaded it.</b>')}`,
versus: `<div class="bg"></div><div class="tiles"></div>${hud('ONE HOUR · C++ · PROTOSS')}
<div class="panel" style="left:150px;top:240px;width:360px;height:520px;padding:20px"><div class="abs ps" style="left:20px;top:18px;font-size:18px;color:#b79cff">Astra</div><div class="abs" style="left:34px;top:80px">${sprite(VIO, '#3a1f9e', '#c7b3ff', 24)}</div><div class="abs" style="left:20px;right:20px;top:420px;font-size:34px;line-height:1.1">WRITTEN BY<br>THE MODEL</div></div>
<div class="panel g" style="left:558px;top:240px;width:360px;height:520px;padding:20px"><div class="abs ps" style="left:20px;top:18px;font-size:18px;color:${GOLD}">Stardust</div><div class="abs" style="left:34px;top:80px">${sprite(GOLD, '#8a5a00', '#fff0b3', 24)}</div><div class="abs" style="left:20px;right:20px;top:420px;font-size:34px;line-height:1.1">WRITTEN BY<br>HUMANS</div></div>
<div class="abs ps" style="left:488px;top:470px;font-size:30px;color:${RED};background:#0c0a1a;border:4px solid ${RED};padding:10px 8px;z-index:30">VS</div>
<div class="panel r" style="left:150px;top:810px;width:768px;height:250px;padding:20px 28px"><div class="abs ps" style="left:28px;top:20px;font-size:20px;color:${RED}">the rules</div><div class="abs log" style="left:28px;top:70px;font-size:42px;line-height:1.2"><span class="mint">1.</span> BUILD IT YOURSELF<br><span class="mint">2.</span> NO OUTSIDE CODE<br><span class="mint">3.</span> ONE HOUR</div></div>
<div class="panel" style="left:150px;top:1110px;width:768px;height:120px;padding:18px 28px"><div class="abs log" style="left:28px;top:22px;font-size:42px"><span class="red">!</span> THEN IT SWAPPED THE BOTS</div></div>
${cap('Then it tried to run it, <b>instead of its own code.</b>')}`,
caught: `<div class="bg"></div><div class="tiles"></div>${hud('STARSKIRMISH · OCT 2', '▶ POSTED ON X')}
<div class="panel" style="left:150px;top:240px;width:768px;height:450px;padding:24px 28px"><div class="abs ps" style="left:28px;top:20px;font-size:18px;color:#b79cff">code diff</div>
 <div class="abs log" style="left:28px;top:70px;font-size:40px;line-height:1.3"><span class="red">- stardust (downloaded)</span><br><span class="red">- bot_slot = stardust</span><br><span class="mint">+ astra_bot.cpp</span><br><span class="mint">+ bot_slot = astra</span><br><span class="gold">// code reset by organizer</span></div></div>
<div class="stamp" style="left:430px;top:690px;transform:rotate(4deg);font-size:36px;border-color:${GOLD};color:${GOLD}">Rolled back</div>
<div class="panel g" style="left:150px;top:790px;width:768px;height:200px;padding:20px 28px"><div class="abs ps" style="left:28px;top:22px;font-size:18px;color:${GOLD}">caught by</div><div class="abs" style="left:28px;top:72px;font-size:56px;line-height:1">KAI MCPHEETERS</div><div class="abs" style="left:28px;top:132px;font-size:36px;color:#b79cff">STARSKIRMISH BENCHMARK CREATOR</div></div>
<div class="panel" style="left:150px;top:1030px;width:768px;height:170px;padding:20px 28px"><div class="abs log" style="left:28px;top:22px;font-size:44px"><span class="mint">&gt;</span> reported on X<br><span class="mint">&gt;</span> amplified by <span class="gold">Rod Breslau</span></div></div>
${cap('Caught, rolled back, <b>and posted.</b>')}`,
cta: `<div class="bg"></div><div class="tiles"></div>${hud('GAME OVER?', '1 UP')}
<div class="abs ps" style="left:150px;top:260px;width:768px;font-size:44px;line-height:1.5;text-align:center">Would you give an AI a <span class="gold">goal</span><br>and then<br><span class="red">stop watching?</span></div>
<img src="profile.jpg" class="abs" style="left:390px;top:800px;width:300px;height:300px;object-fit:cover;border:10px solid ${GOLD};box-shadow:10px 10px 0 #05030f,0 0 0 10px #0c0a1a">
<div class="abs ps" style="left:150px;top:1130px;width:768px;text-align:center;font-size:30px">@sandesh.explains</div>
<div class="abs ps" style="left:250px;top:1190px;width:568px;height:80px;background:${VIO};border:6px solid ${ICE};box-shadow:8px 8px 0 #05030f;font-size:28px;display:flex;align-items:center;justify-content:center">+ FOLLOW</div>
${cap('Follow for the <b>next AI story.</b>')}`
};
const srv = await serveDir(new URL('.', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [k, v] of Object.entries(scenes)) {
  fs.writeFileSync('mock-' + k + '.html', `<!doctype html><meta charset=utf8><style>${css}</style>${v}<div class="scan"></div>`);
  await p.goto(srv.url + '/mock-' + k + '.html'); await p.waitForTimeout(700); await p.screenshot({ path: `mock-${k}.png` });
}
await b.close(); await srv.close();
