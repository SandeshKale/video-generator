// Cover: bun cover-build.mjs  -> cover.png (1080x1920; key content inside the 3:4 grid crop y 240-1680)
import { chromium } from 'playwright'; import fs from 'node:fs'; import path from 'node:path';
const H = path.dirname(new URL(import.meta.url).pathname), A = '/home/user/video-generator/assets/fonts/';
const f = (n) => 'data:font/woff2;base64,' + fs.readFileSync(A + n).toString('base64');
const anton = fs.readdirSync(A + 'anton').find(x => x.includes('latin-400-normal')); const slab = fs.readdirSync(A + 'alfa-slab-one').find(x => x.includes('latin-400')); const mono = fs.readdirSync(A + 'jetbrains-mono').find(x => x.includes('latin-700'));
const prof = 'data:image/jpeg;base64,' + fs.readFileSync('/home/user/video-generator/prototypes/reel-app/public/profile.jpg').toString('base64');
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Anton;src:url(${f('anton/' + anton)})}@font-face{font-family:Slab;src:url(${f('alfa-slab-one/' + slab)})}@font-face{font-family:Mono;font-weight:700;src:url(${f('jetbrains-mono/' + mono)})}
body{margin:0;width:1080px;height:1920px;background:#ead9b4;position:relative;overflow:hidden;font-family:Anton}
.bg{position:absolute;inset:0;background:radial-gradient(circle,rgba(44,75,216,.16) 2.2px,transparent 2.6px) 0 0/22px 22px,radial-gradient(circle at 50% 40%,#f3e6c2,#d9c28f 85%)}
.folder{position:absolute;left:170px;top:430px;width:740px;height:700px;background:#e3cd96;border:8px solid #13172a;box-shadow:22px 22px 0 rgba(44,75,216,.55);transform:rotate(-2.5deg)}
.tab{position:absolute;left:170px;top:370px;width:250px;height:70px;background:#e3cd96;border:8px solid #13172a;border-bottom:none;transform:rotate(-2.5deg)}
.lab{position:absolute;left:230px;top:480px;width:620px;background:#f3ead2;border:6px solid #13172a;font:700 46px Mono;color:#13172a;padding:20px 26px;transform:rotate(-2.5deg)}
.lab small{display:block;color:#2c4bd8;font-size:28px;margin-top:6px}
.st{position:absolute;font:400 92px Slab;border:12px double;padding:6px 26px;opacity:.93;white-space:nowrap}
.title{position:absolute;left:80px;top:1170px;width:920px;font:400 178px/1.2 Anton;color:#13172a;text-transform:uppercase;text-shadow:12px 12px 0 rgba(44,75,216,.6)}
.title b{background:#ffb300;padding:0 18px;font-weight:400;box-shadow:12px 12px 0 rgba(44,75,216,.6);text-shadow:none}
</style><div class=bg></div><div class=tab></div><div class=folder></div>
<div class=lab>FILE NVDA-1108<small>CASE NO. 14</small></div>
<div class=st style="left:200px;top:640px;color:#1d9a69;transform:rotate(-8deg)">CONFIRMED</div>
<div class=st style="left:340px;top:770px;color:#7b4bd0;transform:rotate(6deg)">ALLEGED</div>
<div class=st style="left:200px;top:900px;color:#e1362f;transform:rotate(-5deg)">DENIED</div>
<div class=title>BAYAAN HAIN,<br><b>SABOOT NAHI</b></div></html>`;
fs.writeFileSync(H + '/cover.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.setContent(html); await p.waitForTimeout(400); await p.screenshot({ path: H + '/cover.png' }); await b.close();
