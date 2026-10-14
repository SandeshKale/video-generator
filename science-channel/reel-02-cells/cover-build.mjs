// Cover for reel #02 (grid-first: designed inside the 3:4 crop y 240-1680, key content y 420-1500, nothing readable in the top-right / bottom-left corners).
// One focal object (a single glossy red cell inside a burst of lime "newly made" sparks), a 4-word Anton title, a #02 slot, the creator chip. Run: bun cover-build.mjs -> cover.png
import { writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
const R = new URL('../../', import.meta.url).pathname, H = new URL('./', import.meta.url).pathname;
mkdirSync(H + 'cover', { recursive: true });
copyFileSync(R + 'assets/fonts/anton/anton-latin-400-normal.woff2', H + 'cover/anton.woff2'); copyFileSync(R + 'assets/fonts/fragment-mono/fragment-mono-latin-400-normal.woff2', H + 'cover/mono.woff2');
copyFileSync(H + 'site/plates/plasma.jpg', H + 'cover/plasma.jpg'); copyFileSync(R + 'reel-app/public/profile.jpg', H + 'cover/profile.jpg');
// lime spark burst around the cell (seeded, static): rays of dots thinning outward
let s = 7; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
let dots = ''; for (let i = 0; i < 520; i++) { const a = rnd() * Math.PI * 2, r = 400 + Math.pow(rnd(), 1.6) * 560, x = 540 + Math.cos(a) * r, y = 700 + Math.sin(a) * r * 1.02, z = 2 + rnd() * 6 * (1 - (r - 400) / 700), o = .25 + rnd() * .7 * (1 - (r - 400) / 760);
  dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${z.toFixed(1)}" fill="${i % 9 === 0 ? '#ffd99a' : '#d6ff6e'}" opacity="${Math.max(.1, o).toFixed(2)}"/>`; }
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Anton;src:url(cover/anton.woff2)}@font-face{font-family:Mono;src:url(cover/mono.woff2)}
*{box-sizing:border-box}body{margin:0;background:#0a0509}#c{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0a0509}
.bg{position:absolute;inset:0;background:url(cover/plasma.jpg) 50% 30%/cover;filter:saturate(1.15) brightness(1.05);transform:scale(1.2)}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 36%,rgba(10,5,9,0),rgba(10,5,9,.55)),linear-gradient(180deg,rgba(10,5,9,0) 52%,rgba(10,5,9,.9) 72%,rgba(10,5,9,.96) 100%)}
svg{position:absolute;inset:0}.glow{position:absolute;left:140px;top:300px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(214,255,110,.38),rgba(214,255,110,0) 68%)}
.cell{position:absolute;left:100px;top:260px;width:880px;height:880px;filter:drop-shadow(0 40px 60px rgba(0,0,0,.55)) drop-shadow(0 0 60px rgba(255,70,50,.5))}
.t1,.t2{position:absolute;left:90px;font:400 158px/1 Anton;white-space:nowrap;letter-spacing:-.005em;text-transform:uppercase;color:#f1ece6;text-shadow:0 8px 40px rgba(0,0,0,.8)}
.t1{top:1060px}.t2{top:1296px}.blk{background:#c6ff4a;color:#0a0f1a;padding:0 .12em;border-radius:.08em;box-shadow:0 0 70px rgba(198,255,74,.5);text-shadow:none}
.no{position:absolute;left:96px;top:290px;font:400 44px/1 Mono;letter-spacing:.12em;color:#0a0f1a;background:#c6ff4a;border-radius:999px;padding:14px 26px}
.chip{position:absolute;left:790px;top:1448px;width:190px;height:190px;border-radius:50%;background:url(cover/profile.jpg) center/cover;border:6px solid #c6ff4a;box-shadow:0 0 0 8px rgba(198,255,74,.2),0 0 50px rgba(198,255,74,.45),0 16px 40px rgba(0,0,0,.6)}
</style><div id=c><div class=bg></div><div class=shade></div><div class=glow></div><svg width=1080 height=1920>${dots}</svg><img class=cell src=cover/cover_rbc.png>
<div class=no>#02</div><div class=t1><span class=blk>4 million.</span></div><div class=t2>Every second.</div><div class=chip></div></div>`;
writeFileSync(H + 'cover.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + H + 'cover.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
console.log(JSON.stringify(await p.evaluate(() => ['.t1', '.t2'].map((q) => { const r = document.querySelector(q).getBoundingClientRect(); return [q, Math.round(r.left), Math.round(r.right), Math.round(r.top), Math.round(r.bottom)]; }))));
await p.screenshot({ path: H + 'cover.png' }); await b.close(); console.log('cover.png written');
