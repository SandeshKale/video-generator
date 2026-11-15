// Cover: grid-first (3:4 crop band y 240-1680, <= 5 words). Reel look: bright palace gold. Hero = the 22 m gold cube beside one small house, re-shot from the film page with every overlay hidden.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '../../../'), A = join(root, 'assets/fonts/');
const srv = spawn('python3', ['-m', 'http.server', '8845', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); let p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8845/reels/science/reel-sone-ki-lanka/site/index.html'); await p.waitForFunction('window.__ready===true', null, { timeout: 150000 });
await p.evaluate(() => { const t = window.__dbg('t9 + .2'); window.__seek(t); window.__dbg("var q=P(V(XB+3,4.5,0),34,3,118); cam.position.copy(q.p); cam.lookAt(q.l); cam.updateMatrixWorld(); R.render(S,cam)"); });
await p.waitForTimeout(300); const url = await p.evaluate(() => document.getElementById('gl').toDataURL('image/jpeg', .92)); await p.close();
const prof = fs.readFileSync(join(root, 'assets/brand/nerdlogic-profile.jpg')).toString('base64');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:800;src:url(${A}inter/inter-latin-800-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#f1e2c4}
.hero{position:absolute;inset:0;background:url(${url}) 0 0/100% 100%}
.sh{position:absolute;left:0;top:0;width:1080px;height:900px;background:linear-gradient(rgba(60,30,6,.82) 20%,rgba(60,30,6,.5) 62%,transparent)}
.t{position:absolute;left:84px;top:262px;font:400 184px/1.1 Anton;color:#fff6e0;text-shadow:0 8px 30px rgba(40,18,0,.7)}.t b{font-weight:400;background:#f2b632;color:#2a1604;padding:0 18px;margin-left:-18px;display:inline-block;line-height:1.02;text-shadow:none}
.chip{position:absolute;left:560px;top:1490px;height:120px;padding:0 28px 0 150px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 40px Inter;color:#eaffd0;white-space:nowrap}.chip em{color:#b4f000;font-style:normal}
.face{position:absolute;left:545px;top:1470px;width:160px;height:160px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #0a0f1d;z-index:2}
</style><body><div class="hero"></div><div class="sh"></div><div class="t">SONE KI<br><b>LANKA</b><br>JHOOTH?</div><img class="face" src="data:image/jpeg;base64,${prof}"><div class="chip">nerdlogic<em>.co</em></div></body>`;
fs.writeFileSync(join(H, 'cover.html'), html);
p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(H, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); srv.kill(); console.log('cover ok');
