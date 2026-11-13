// Cover: grid-first (3:4 crop band y 240-1680, <= 5 words). Pushpak palette: temple gold on lapis night. Hero = our verse-built Pushpak, exploded, from the page.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '../../../'), A = join(H, '../../../assets/fonts/');
const srv = spawn('python3', ['-m', 'http.server', '8815', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); let p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8815/reels/science/reel-pushpak-anatomy/site/index.html'); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
// a frame after the explode settles, before the part labels arrive; hide every DOM overlay, keep the 3D
const T = await p.evaluate(() => { const s = TM.sentences.find(x => x.id === 's7'); return s.t0 - .25; });
await p.evaluate(t => { window.__seek(t); document.getElementById('ov').style.display = 'none'; document.getElementById('lines').style.display = 'none'; document.getElementById('cap').style.display = 'none'; }, T);
await p.waitForTimeout(300); const url = await p.evaluate(() => document.getElementById('gl').toDataURL('image/png')); await p.close();
const prof = fs.readFileSync(join(H, '../../../assets/brand/nerdlogic-profile.jpg')).toString('base64');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:800;src:url(${A}inter/inter-latin-800-normal.woff2);font-display:block}
@font-face{font-family:FM;src:url(${A}fragment-mono/fragment-mono-latin-400-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#07102e}
.hero{position:absolute;left:120px;top:330px;width:1080px;height:1920px;background:url(${url}) 0 0/100% 100%;transform:scale(1.18);transform-origin:50% 40%}
.t{position:absolute;left:84px;top:250px;font:400 196px/.9 Anton;color:#f4ecd8;text-shadow:0 8px 30px rgba(0,0,0,.7)}.t b{font-weight:400;color:#e8b04a}
.tag{position:absolute;left:90px;font:400 30px FM;letter-spacing:.12em;color:#07102e;background:#e8b04a;padding:10px 16px}
.chip{position:absolute;left:300px;top:1545px;height:130px;padding:0 30px 0 210px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 44px Inter;color:#eaffd0;white-space:nowrap}.chip em{color:#b4f000;font-style:normal}
.face{position:absolute;left:285px;top:1525px;width:180px;height:180px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #0d1330;z-index:2}
</style><body><div class="hero"></div><div class="t">PUSHPAK<br><b>KHOL KE</b><br>DEKHA</div><div class="tag" style="top:900px">VALMIKI SE · PART BY PART</div><img class="face" src="data:image/jpeg;base64,${prof}"><div class="chip">nerdlogic<em>.co</em></div></body>`;
fs.writeFileSync(join(H, 'cover.html'), html);
p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(H, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); srv.kill(); console.log('cover ok', T);
