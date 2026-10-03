// Purpose-built cover (not a frame grab): case-file composition, same Incident File system.
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:'Barlow';font-weight:800;src:url('../assets/fonts/barlow-condensed/barlow-condensed-latin-800-normal.woff2');}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
.bg{position:absolute;inset:0;background:url(shots/servers2.png) center/cover;filter:saturate(.9) contrast(1.1) brightness(.75)}
.sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,6,5,.55),rgba(8,6,5,.15) 40%,rgba(8,6,5,.8))}
.vg{position:absolute;inset:0;box-shadow:inset 0 0 280px 50px rgba(0,0,0,.8)}
.d{font-family:Barlow;font-weight:800;text-transform:uppercase;line-height:.86;position:absolute;left:150px;right:150px}
.m{font:700 28px JBMono;letter-spacing:.14em;color:#ffd400;position:absolute;left:150px}
.tape{display:inline-block;padding:12px 30px 8px;transform:rotate(-1.8deg);box-shadow:0 12px 34px rgba(0,0,0,.6)}
.file{position:absolute;left:150px;right:150px;top:1120px;transform:rotate(1.4deg);filter:drop-shadow(0 24px 40px rgba(0,0,0,.7))}
.tab{display:inline-block;font:700 26px JBMono;letter-spacing:.14em;color:#1a1814;background:#ffd400;padding:10px 28px 8px;border-radius:14px 14px 0 0}
.body{background:#e9e3d2;padding:26px 34px 34px;position:relative}
.body s{display:block;height:20px;background:#15130f;margin-top:11px}
.st{position:absolute;right:26px;bottom:22px;font:800 50px/1 Barlow;color:#b80f05;border:6px solid #b80f05;padding:8px 18px 4px;transform:rotate(-8deg);text-transform:uppercase}
.brk{position:absolute;width:80px;height:80px;border:6px solid #ffd400}
</style><body><div class=bg></div><div class=sh></div><div class=vg></div>
<div class=brk style="left:70px;top:150px;border-right:0;border-bottom:0"></div><div class=brk style="right:70px;top:150px;border-left:0;border-bottom:0"></div>
<div class=m style="top:178px">● REC · OPENAI SANDBOX</div>
<div class=d style="top:320px;font-size:176px;color:#f2eee3;text-shadow:0 10px 50px rgba(0,0,0,.8)">Its own<br>AI agents</div>
<div class=d style="top:700px;font-size:176px;white-space:nowrap"><span class=tape style="background:#ff3b2f;color:#fff7ee">broke out</span></div>
<div class=m style="top:1030px;color:#f2eee3;font-size:23px;white-space:nowrap">100+ ORGS NOTIFIED · 55 SITES · 50 PB LOGS</div>
<div class=file><div class=tab>CASE FILE 01</div><div class=body><div style="font:800 84px/1 Barlow;text-transform:uppercase;color:#1a1814">California AG</div><s style="width:62%"></s><s style="width:84%"></s><s style="width:41%"></s><div class=st>Subpoena served</div></div></div>
</body>`;
await writeFile('cover.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + process.cwd() + '/cover.html'); await p.waitForTimeout(500);
await p.screenshot({ path: 'cover.png' }); await b.close();
