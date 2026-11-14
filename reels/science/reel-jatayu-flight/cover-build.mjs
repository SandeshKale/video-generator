// Cover: grid-first (3:4 crop band y 240-1680, <= 5 words). Reel palette: real-sky blue, marigold orange block, cream. Hero = the real vulture (photo cut-out), far larger than it ever is in the film.
import { chromium } from 'playwright'; import fs from 'node:fs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), A = join(H, '../../../assets/fonts/');
const b64 = f => fs.readFileSync(f).toString('base64');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:800;src:url(${A}inter/inter-latin-800-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#ff8a1f}
.sun{position:absolute;left:-200px;top:300px;width:1500px;height:1500px;border-radius:50%;background:radial-gradient(circle,#ffd27a 0,#ffab3d 38%,rgba(255,138,31,0) 70%)}
.bird{position:absolute;left:40px;top:800px;width:680px;transform:rotate(-4deg);filter:drop-shadow(0 30px 40px rgba(80,30,0,.45))}
.t{position:absolute;left:84px;top:250px;font:400 176px/1.12 Anton;color:#0d1a36}.t b{font-weight:400;background:#0d1a36;color:#fff3dc;padding:0 18px;margin-left:-18px;display:inline-block;line-height:1.02}
.chip{position:absolute;left:600px;top:1490px;height:120px;padding:0 28px 0 150px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 40px Inter;color:#eaffd0;white-space:nowrap}.chip em{color:#b4f000;font-style:normal}
.face{position:absolute;left:585px;top:1470px;width:160px;height:160px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #0a0f1d;z-index:2}
</style><body><div class="sun"></div><img class="bird" src="data:image/png;base64,${b64(join(H, 'site/img/cut/vulture-hi.png'))}"><div class="t">JATAYU<br><b>UD SAKTA</b><br>THA?</div><img class="face" src="data:image/jpeg;base64,${b64(join(H, '../../../assets/brand/nerdlogic-profile.jpg'))}"><div class="chip">nerdlogic<em>.co</em></div></body>`;
fs.writeFileSync(join(H, 'cover.html'), html);
const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(H, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); console.log('cover ok');
