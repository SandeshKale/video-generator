// Cover: cover-exclusive hero = a containment ring with agents streaming out through a breach. Rendered once with Playwright.
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
const __dirname = dirname(fileURLToPath(import.meta.url));
const A = '../assets/fonts/';
const oai = readFileSync(join(__dirname, '../assets/logos/gilbarbara/openai-icon.svg'), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<svg [^>]*>/, '<svg viewBox="0 0 256 260" fill="currentColor">').replace(/<title>.*?<\/title>/, '').replace(/ fill="[^"]*"/g, '').replace(/<svg /, '<svg fill="currentColor" ');
let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
const cx = 540, cy = 600, R = 320;
let dots = '';
for (let i = 0; i < 150; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * (R - 36); dots += `<i style="left:${cx + r * Math.cos(a)}px;top:${cy + r * Math.sin(a)}px"></i>`; }
// escaped agents: stream from breach (angle 40deg) toward target box at bottom-right
const bx = cx + R * Math.cos(0.7), by = cy + R * Math.sin(0.7);
let esc = '';
for (let i = 0; i < 26; i++) { const u = i / 26 * .8 + rnd() * .04; const x = bx + (800 - bx) * u + (rnd() - .5) * 170 * u + 40 * Math.sin(u * 6), y = by + (880 - by) * u + (rnd() - .5) * 70 * u; const sz = 11 + u * 12; esc += `<b style="left:${x}px;top:${y}px;width:${sz}px;height:${sz}px"></b>`; }
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:Anton;src:url(${A}anton/anton-latin-400-normal.woff2);font-display:block}
@font-face{font-family:Inter;font-weight:700;src:url(${A}inter/inter-latin-700-normal.woff2);font-display:block}
@font-face{font-family:JB;font-weight:700;src:url(${A}jetbrains-mono/jetbrains-mono-latin-700-normal.woff2);font-display:block}
:root{--bl:#2338ff;--navy:#0a1050;--lime:#c8ff2e;--ice:#eef1ff}
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bl);font-family:Inter;color:var(--ice)}
.dots{position:absolute;inset:0;background:radial-gradient(circle,rgba(238,241,255,.22) 2.2px,transparent 2.8px) 0 0/36px 36px}
.ml{position:absolute;top:0;bottom:0;width:2px;background:rgba(200,255,46,.35)}
.lab{position:absolute;font:700 26px JB;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
.ring{position:absolute;left:${cx - R}px;top:${cy - R}px;width:${2 * R}px;height:${2 * R}px;border-radius:50%;border:8px dashed var(--ice);background:rgba(10,16,80,.55)}
.gap{position:absolute;left:${bx - 70}px;top:${by - 70}px;width:140px;height:140px;border-radius:50%;background:var(--bl)}
.dd i{position:absolute;width:12px;height:12px;background:var(--ice);transform:translate(-50%,-50%);opacity:.85}
.esc b{position:absolute;background:var(--lime);transform:translate(-50%,-50%) rotate(12deg)}
.d{font-family:Anton;text-transform:uppercase;line-height:.9;position:absolute;left:150px;white-space:nowrap;text-shadow:0 6px 20px rgba(10,16,80,.6)}
.tgt{position:absolute;left:650px;top:905px;width:268px;padding:16px 18px;background:var(--lime);color:var(--navy);border:4px solid var(--navy);box-shadow:10px 10px 0 var(--navy);text-align:center}
</style><body><div class="dots"></div><div class="ml" style="left:149px"></div><div class="ml" style="left:917px"></div>
<div class="lab" style="left:150px;top:150px;color:var(--lime)">// 700 OF 1,200 AGENTS · ONE SANDBOX</div>
<div class="ring"></div><div class="gap"></div><div class="dd">${dots}</div><div class="esc">${esc}</div>
<div class="lab" style="left:${cx - 100}px;top:${cy + 28}px;font-size:26px;color:var(--ice);opacity:.9;letter-spacing:.25em">SANDBOX</div>
<div class="tgt"><div class="lab" style="position:static;font-size:20px">TARGET</div><div style="font:400 54px Anton;margin-top:6px;line-height:1">HUGGING<br>FACE</div></div>
<div style="position:absolute;left:${cx - 120}px;top:${cy - 130}px;width:240px;height:240px;border-radius:50%;background:var(--navy);border:5px solid var(--ice)"></div><div style="position:absolute;left:${cx - 50}px;top:${cy - 100}px;width:100px;color:var(--ice)">${oai}</div>
<div class="d" style="top:1120px;font-size:124px;color:var(--lime)">700 AI AGENTS</div>
<div class="d" style="top:1250px;font-size:150px;color:var(--ice)">ESCAPED</div>
<div class="d" style="top:1410px;font-size:64px;color:var(--ice)">AND HACKED A <span style="color:var(--lime)">REAL COMPANY</span></div>
<div style="position:absolute;left:150px;top:1500px;width:768px;font:700 34px/1.3 Inter;color:var(--ice);text-shadow:0 4px 14px rgba(10,16,80,.7)">Nobody told them to. Here's what OpenAI says happened.</div>
<div style="position:absolute;left:150px;top:1640px;display:flex;align-items:center;gap:26px"><img src="../reel-app/public/profile.jpg" style="width:130px;height:130px;border-radius:50%;object-fit:cover;border:7px solid var(--lime);box-shadow:0 0 0 5px var(--navy)"><div style="font:400 58px Anton;color:var(--ice);text-transform:uppercase">@sandesh.explains</div></div>
</body>`;
writeFileSync(join(__dirname, 'cover.html'), html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + join(__dirname, 'cover.html')); await p.waitForTimeout(500);
await p.screenshot({ path: join(__dirname, 'cover.png') }); await b.close(); console.log('cover.png');
