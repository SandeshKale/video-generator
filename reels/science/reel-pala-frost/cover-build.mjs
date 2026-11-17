// Cover: grid-first (3:4 crop band y 240-1680, <= 5 words). Hero = the two-thermometer night field re-shot from the film page with every overlay hidden.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '../../../'), A = join(root, 'assets/fonts/');
const srv = spawn('python3', ['-m', 'http.server', '8847', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); let p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8847/reels/science/reel-pala-frost/site/index.html'); await p.waitForFunction('window.__ready===true', null, { timeout: 150000 });
const T = process.argv[2] || '25.6';
await p.evaluate(t => { window.__seek(+t); document.querySelectorAll('#ov, #cap, .scr').forEach(e => e.style.display = 'none'); }, T);
await p.waitForTimeout(300); const url = await p.evaluate(() => document.getElementById('gl').toDataURL('image/jpeg', .92)); await p.close();
const prof = fs.readFileSync(join(root, 'assets/brand/nerdlogic-profile.jpg')).toString('base64');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Mukta;font-weight:800;src:url(${A}mukta/mukta-devanagari-800-normal.woff2);font-display:block;unicode-range:U+0900-097F}
@font-face{font-family:Mukta;font-weight:800;src:url(${A}mukta/mukta-latin-800-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:800;src:url(${A}inter/inter-latin-800-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#05070d}
.hero{position:absolute;inset:0;background:url(${url}) 0 0/100% 100%}
.sh{position:absolute;left:0;top:0;width:1080px;height:800px;background:linear-gradient(rgba(5,7,13,.88) 24%,rgba(5,7,13,.45) 66%,transparent)}
.sh2{position:absolute;left:0;top:1300px;width:1080px;height:620px;background:linear-gradient(transparent,rgba(5,7,13,.8))}
.t{position:absolute;left:84px;top:262px;font:800 200px/1.06 Mukta;color:#eef6fb;text-shadow:0 8px 30px rgba(0,0,0,.7)}.t b{background:#7fe3ff;color:#06121a;padding:0 24px;margin-left:-24px;display:inline-block;line-height:1.02;text-shadow:none;border-radius:8px}
.chip{position:absolute;left:300px;top:1500px;height:120px;padding:0 28px 0 150px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 40px Inter;color:#eaffd0;white-space:nowrap}.chip em{color:#b4f000;font-style:normal;margin-left:14px}
.face{position:absolute;left:285px;top:1480px;width:160px;height:160px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #0a0f1d;z-index:2}
</style><body><div class="hero"></div><div class="sh"></div><div class="sh2"></div><div class="t">4° में भी<br><b>पाला?</b></div><img class="face" src="data:image/jpeg;base64,${prof}"><div class="chip">nerdlogic<em>.co</em></div></body>`;
fs.writeFileSync(join(H, 'cover.html'), html);
p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(H, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); srv.kill(); console.log('cover ok');
