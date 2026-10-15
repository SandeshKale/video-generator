// Cover for reel #01 (grid-first: designed inside the 3:4 crop y 240-1680, key content y 420-1500, nothing readable in the top-right / bottom-left corners).
// One focal object (a magnifier lens on the ear with a coral bone-sound ring), a 4-word Anton title, a #01 slot, an AI IMAGE tag. Run: bun cover-build.mjs  -> cover.png
import { writeFileSync, readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const R = new URL('../../../', import.meta.url).pathname, H = new URL('./', import.meta.url).pathname;
const anton = readdirSync(R + 'assets/fonts/anton').find((f) => f.endsWith('.woff2'));
mkdirSync(H + 'cover', { recursive: true }); copyFileSync(R + 'assets/fonts/anton/' + anton, H + 'cover/anton.woff2'); copyFileSync(R + 'assets/fonts/fragment-mono/fragment-mono-latin-400-normal.woff2', H + 'cover/mono.woff2');
copyFileSync(H + 'shots/head_a.jpg', H + 'cover/head.jpg'); copyFileSync(R + 'prototypes/reel-app/public/profile.jpg', H + 'cover/profile.jpg');
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Anton;src:url(cover/anton.woff2)}@font-face{font-family:Mono;src:url(cover/mono.woff2)}
*{box-sizing:border-box}body{margin:0;background:#070d1a}#c{position:relative;width:1080px;height:1920px;overflow:hidden;background:#070d1a}
.bg{position:absolute;inset:0;background:url(cover/head.jpg) 50% 40%/cover;filter:blur(10px) brightness(.5) saturate(1.1);transform:scale(1.15)}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 40%,rgba(7,13,26,.2),rgba(7,13,26,.85))}
.lens{position:absolute;left:190px;top:420px;width:700px;height:700px;border-radius:50%;overflow:hidden;background:#0b1628;box-shadow:0 0 0 10px #5ce6ff,0 0 0 22px rgba(92,230,255,.35),0 40px 120px rgba(0,0,0,.6),0 0 160px rgba(92,230,255,.45)}
.lens img{position:absolute;left:28px;top:-543px;width:1382px;filter:brightness(1.08) contrast(1.08)}
.ring{position:absolute;left:300px;top:780px;width:0;height:0}
.ring i{position:absolute;border-radius:50%;border:14px solid #ff5a4d;left:-80px;top:-80px;width:160px;height:160px;box-shadow:0 0 40px rgba(255,90,77,.8)}
.ring i:nth-child(2){left:-130px;top:-130px;width:260px;height:260px;border-width:6px;opacity:.6}.ring i:nth-child(3){left:-185px;top:-185px;width:370px;height:370px;border-width:4px;opacity:.3}
.ring b{position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:50%;background:#ff5a4d;box-shadow:0 0 40px #ff5a4d}
.t1,.t2{position:absolute;left:90px;font:400 176px/0.98 Anton;white-space:nowrap;letter-spacing:-.005em;text-transform:uppercase;color:#ecf1f8;text-shadow:0 8px 40px rgba(0,0,0,.7)}
.t1{top:1150px}.t2{top:1330px}
.blk{background:#ff5a4d;color:#070d1a;padding:0 .12em;border-radius:.08em;box-shadow:0 0 60px rgba(255,90,77,.5);text-shadow:none}
.no{position:absolute;left:96px;top:290px;font:400 44px/1 Mono;letter-spacing:.12em;color:#070d1a;background:#5ce6ff;border-radius:999px;padding:14px 26px}
.chip{position:absolute;left:800px;top:1520px;width:150px;height:150px;border-radius:50%;background:url(cover/profile.jpg) center/cover;border:6px solid #bfff45;box-shadow:0 0 0 8px rgba(191,255,69,.2),0 0 50px rgba(191,255,69,.5),0 20px 50px rgba(0,0,0,.6)}.ai{position:absolute;left:96px;top:1100px;font:400 22px/1 Mono;letter-spacing:.12em;color:#ecf1f8;border:2px solid rgba(236,241,248,.55);border-radius:8px;padding:8px 12px;background:rgba(6,11,22,.7)}
</style><div id=c><div class=bg></div><div class=shade></div><div class=lens><img src=cover/head.jpg></div><div class=ring style="left:597px;top:784px"><i></i><i></i><i></i><b></b></div>
<div class=no>#01</div><div class=chip></div><div class=ai>AI IMAGE</div><div class=t1>You've never</div><div class=t2>heard <span class=blk>you</span></div></div>`;
writeFileSync(H + 'cover.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + H + 'cover.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500); await p.screenshot({ path: H + 'cover.png' }); await b.close(); console.log('cover.png');
