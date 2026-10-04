// Purpose-built YouTube thumbnail (1280x720) in the Control Room system — not a frame grab.
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:'Unb';font-weight:900;src:url('../assets/fonts/unbounded/unbounded-latin-900-normal.woff2');}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');}
*{margin:0;box-sizing:border-box}html,body{width:1280px;height:720px;overflow:hidden;background:#070b12}
.bg{position:absolute;inset:0;background:url(shots/transformer-yard.png) 70% center/cover;filter:saturate(1.1) contrast(1.12) brightness(1.35)}
.sh{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,8,14,.88) 0%,rgba(5,8,14,.55) 40%,rgba(5,8,14,0) 70%),linear-gradient(0deg,rgba(5,8,14,.7),transparent 40%)}
.u{font-family:Unb;font-weight:900;text-transform:uppercase;letter-spacing:-.03em;line-height:.98;position:absolute;left:56px;color:#e6f1ff;text-shadow:0 8px 40px rgba(0,0,0,.8)}
.tag{position:absolute;left:56px;top:44px;font:700 22px JBMono;letter-spacing:.16em;color:#ff8a1f;border-left:6px solid #ff8a1f;padding-left:14px}
.org{color:#ff8a1f}
.chart{position:absolute;right:48px;bottom:48px;width:400px;height:300px;background:linear-gradient(180deg,rgba(14,22,36,.94),rgba(8,13,22,.96));border:1.5px solid #2a3a52;border-top:4px solid #ff8a1f;box-shadow:0 24px 60px rgba(0,0,0,.6);padding:16px 22px}
.chart .t{font:700 14px JBMono;letter-spacing:.14em;color:#7f93ad}
.bar{position:absolute;bottom:50px;width:100px}
.bn{position:absolute;font:900 24px Unb;text-align:center;width:100px;color:#e6f1ff}
.badge{position:absolute;right:70px;top:90px;font:900 84px Unb;color:#ff3355;border:7px solid #ff3355;padding:6px 22px;transform:rotate(7deg);background:rgba(5,8,14,.7)}
.me{position:absolute;left:56px;bottom:46px;display:flex;align-items:center;gap:16px}
.me i{width:84px;height:84px;border-radius:50%;padding:4px;background:conic-gradient(#ff8a1f,#ffd29a,#ff8a1f);display:block}
.me img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:3px solid #070b12}
.me b{font:900 26px Unb;color:#e6f1ff;letter-spacing:-.02em}
</style><body><div class=bg></div><div class=sh></div>
<div class=tag>// THE POWER CRUNCH</div>
<div class=u style="top:104px;font-size:112px">Who pays</div>
<div class=u style="top:214px;font-size:112px">for AI's</div>
<div class=u style="top:330px;font-size:122px" ><span class=org>power?</span></div>
<div class=badge>10×</div>
<div class=chart><div class=t>PJM CAPACITY PRICE · $/MW-DAY</div>
 <div class=bar style="left:36px;height:14px;background:#3dff9a"></div><div class=bn style="left:36px;bottom:70px">$29</div>
 <div class=bar style="left:156px;height:150px;background:linear-gradient(180deg,#ff8a1f,#ff8a1f88)"></div><div class=bn style="left:156px;bottom:206px">$329</div>
 <div class=bar style="left:276px;height:152px;background:linear-gradient(180deg,#ff3355,#ff335588)"></div><div class=bn style="left:276px;bottom:208px">$333</div></div>
<div class=me><i><img src="../reel-app/public/profile.jpg"></i><b>@sandesh.explains</b></div>
</body>`;
await writeFile('thumb.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.goto('file://' + process.cwd() + '/thumb.html'); await p.waitForTimeout(600);
await p.screenshot({ path: 'thumbnail.png' }); await b.close();
