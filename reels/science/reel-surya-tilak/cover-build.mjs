// Cover: grid-first (3:4 crop band y 240-1680, <= 5 words). Reel palette: ivory stone, saffron light on garnet-black. Hero = the cut-away temple with the whole light path.
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const H = dirname(fileURLToPath(import.meta.url)), root = join(H, '../../../'), A = join(H, '../../../assets/fonts/');
const srv = spawn('python3', ['-m', 'http.server', '8835', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); let p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8835/reels/science/reel-surya-tilak/site/index.html'); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
// the whole light path, built, in the cut-away view; hide every DOM overlay, keep the 3D
const T = await p.evaluate(() => TM.sentences.find(x => x.id === 's19').t0 + .3);
await p.evaluate(t => { window.__skipRender = true; window.__seek(t); window.__skipRender = false; window.__dbg("var q=P([2.7,7.6,-3],[.3,.15,1],74); cam.position.copy(q.p); cam.lookAt(q.l); cam.updateMatrixWorld(); render(" + t + ")"); ['ov','lines','cap'].forEach(i => document.getElementById(i).style.display = 'none'); }, T);
await p.waitForTimeout(300); const url = await p.evaluate(() => document.getElementById('gl').toDataURL('image/png')); await p.close();
const prof = fs.readFileSync(join(H, '../../../assets/brand/nerdlogic-profile.jpg')).toString('base64');
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:800;src:url(${A}inter/inter-latin-800-normal.woff2);font-display:block}
@font-face{font-family:MM;src:url(${A}martian-mono/martian-mono-latin-500-normal.woff2);font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#120709}
.hero{position:absolute;left:0;top:330px;width:1080px;height:1920px;background:url(${url}) 0 0/100% 100%}
.sh{position:absolute;left:0;top:0;width:1080px;height:900px;background:linear-gradient(#120709 30%,rgba(18,7,9,.75) 70%,transparent)}
.t{position:absolute;left:84px;top:262px;font:400 190px/.92 Anton;color:#f6ecd9;text-shadow:0 8px 30px rgba(0,0,0,.8)}.t b{font-weight:400;color:#ffb347}
.tag{position:absolute;left:90px;top:838px;font:500 30px MM;letter-spacing:.1em;color:#120709;background:#ffc56b;padding:10px 16px}
.chip{position:absolute;left:300px;top:1545px;height:130px;padding:0 30px 0 210px;display:flex;align-items:center;background:#0a0f1d;border:4px solid #b4f000;border-radius:8px;font:800 44px Inter;color:#eaffd0;white-space:nowrap}.chip em{color:#b4f000;font-style:normal}
.face{position:absolute;left:285px;top:1525px;width:180px;height:180px;border-radius:50%;object-fit:cover;border:8px solid #b4f000;box-shadow:0 0 0 8px #0d1330;z-index:2}
</style><body><div class="hero"></div><div class="sh"></div><div class="t"><b>SOORAJ</b><br>ANDAR<br>KAISE?</div><div class="tag">NA BULB · NA TAAR</div><img class="face" src="data:image/jpeg;base64,${prof}"><div class="chip">nerdlogic<em>.co</em></div></body>`;
fs.writeFileSync(join(H, 'cover.html'), html);
p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto('file://' + join(H, 'cover.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600); await p.screenshot({ path: join(H, 'cover.png') }); await b.close(); srv.kill(); console.log('cover ok', T);
