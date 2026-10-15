// Grid-first cover: charcoal runway with teal glow, giant open Blender laptop showing a Wi-Fi-OFF badge, cream title block, face chip bottom-right.
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'AN';src:url('site/fonts/anton-latin-400-normal.woff2');font-display:block}
@font-face{font-family:'SM';font-weight:700;src:url('site/fonts/space-mono-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden}
body{background:#15181b;position:relative;font-family:'AN',sans-serif}
.glow{position:absolute;left:-200px;top:300px;width:1480px;height:1100px;background:radial-gradient(ellipse at 50% 45%,rgba(25,194,180,.55),transparent 62%)}
.dash{position:absolute;left:0;right:0;top:1040px;height:10px;background:repeating-linear-gradient(90deg,#f4ecd8 0 70px,transparent 70px 140px);opacity:.25}
.lap{position:absolute;left:30px;top:330px;width:1020px;filter:drop-shadow(0 50px 40px rgba(0,0,0,.65))}
.off{position:absolute;left:170px;top:420px;width:300px;height:300px;transform:rotate(-8deg);background:#ff5a45;border:8px solid #f4ecd8;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f4ecd8;font-size:92px;line-height:.95;box-shadow:12px 12px 0 #15181b;z-index:2}
.off small{font:700 28px/1 SM,monospace;letter-spacing:.14em}
.blk{position:absolute;left:60px;right:60px;top:1060px;height:470px;background:#f4ecd8;padding:30px 48px;box-shadow:16px 16px 0 #19c2b4}
.t{font-size:196px;line-height:.98;color:#15181b;text-transform:uppercase}.t b{font-weight:400;color:#e8412d}
.face{position:absolute;right:84px;top:1330px;width:170px;height:170px;border-radius:50%;border:10px solid #f4ecd8;box-shadow:10px 10px 0 #19c2b4;background:url(site/profile.jpg) center/cover;z-index:3}
</style><div class="glow"></div><div class="dash"></div>
<img class="lap" src="site/3d/lap_11.png">
<div class="off"><svg width="130" height="110" viewBox="0 0 24 24" fill="none" stroke="#f4ecd8" stroke-width="2.2" stroke-linecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/><path d="M3 3l18 18" stroke="#15181b" stroke-width="3.4"/><path d="M3 3l18 18"/></svg>OFF</div>
<div class="blk"><div class="t">Wi-Fi off.<br><b>AI on.</b></div></div><div class="face"></div>`;
writeFileSync(new URL('./cover.html', import.meta.url), html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(new URL('./cover.html', import.meta.url).href); await p.waitForTimeout(800);
await p.screenshot({ path: new URL('./cover.png', import.meta.url).pathname }); await b.close();
