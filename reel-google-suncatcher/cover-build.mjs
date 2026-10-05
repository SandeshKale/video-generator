// Standalone cover (not a frame grab): orbiting ring of four chips around the satellite, title lockup, handle.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const here = new URL('.', import.meta.url).pathname;
const icon = (n) => [...readFileSync(`${here}../assets/icons/tabler/${n}.svg`, 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const cpu = `<svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="#5dffc8" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icon('cpu')}</svg>`;
const cx = 540, cy = 760, R = 360;
const nodes = [0, 1, 2, 3].map((i) => { const a = (-90 + i * 90 + 18) * Math.PI / 180; const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a); return `<div class="node" style="left:${x - 62}px;top:${y - 62}px">${cpu}</div>`; }).join('');
const stars = Array.from({ length: 90 }, (_, i) => `<i style="left:${(i * 197) % 1080}px;top:${(i * 331) % 1500}px;width:${1 + (i % 3)}px;height:${1 + (i % 3)}px;opacity:${.3 + (i % 5) / 8}"></i>`).join('');
const html = `<!doctype html><meta charset="utf8"><style>
@font-face{font-family:'Syne';font-weight:800;src:url('assets/fonts/syne/syne-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'SM';font-weight:700;src:url('assets/fonts/space-mono/space-mono-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'Inter';font-weight:700;src:url('assets/fonts/inter/inter-latin-700-normal.woff2');font-display:block}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;overflow:hidden;background:radial-gradient(120% 70% at 50% 100%,#2a0f4d 0%,#120a33 45%,#0a0720 80%);position:relative;color:#e9e4ff;font-family:Inter}
i{position:absolute;background:#fff;border-radius:50%}
.mono{font-family:SM;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.sy{font-family:Syne;font-weight:800;letter-spacing:-.035em;line-height:.95;text-shadow:0 6px 24px rgba(0,0,0,.7)}
.earth{position:absolute;left:-760px;width:2600px;height:2600px;border-radius:50%;top:1280px;background:radial-gradient(circle at 50% 0%,#1b2d6b 0%,#0d1642 35%,#070b24 70%);box-shadow:0 -6px 0 2px #ffb3d6,0 -18px 70px 12px rgba(255,61,139,.8),0 -70px 180px 50px rgba(93,255,200,.28)}
.hero{position:absolute;left:${cx - 230}px;top:${cy - 230}px;width:460px;height:460px;border-radius:50%;background:url(shots/small-satellite.jpg) center/cover;border:8px solid #5dffc8;box-shadow:0 0 0 10px #0a0720,0 0 90px 14px rgba(93,255,200,.45)}
.node{position:absolute;width:124px;height:124px;border-radius:50%;border:4px solid #ff3d8b;background:#0a0720;display:flex;align-items:center;justify-content:center;box-shadow:0 0 36px rgba(255,61,139,.6)}
.tag{position:absolute;right:8px;top:8px}
</style>${stars}<div class="earth"></div>
<svg style="position:absolute;left:0;top:0" width="1080" height="1920"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#5dffc8" stroke-opacity=".55" stroke-width="3" stroke-dasharray="8 12"/><circle cx="${cx}" cy="${cy}" r="${R - 70}" fill="none" stroke="#ff3d8b" stroke-opacity=".55" stroke-width="2"/></svg>
<div class="hero"></div>${nodes}
<div class="mono" style="position:absolute;left:150px;top:190px;font-size:26px;color:#5dffc8">// PROJECT SUNCATCHER · LIVE</div>
<div class="sy" style="position:absolute;left:100px;top:1230px;width:880px;font-size:112px">AI CHIPS<br><span style="color:#ff3d8b">IN ORBIT.</span></div>
<div style="position:absolute;left:100px;top:1560px;width:880px;font:700 38px/1.25 Inter;color:#efeaff;text-shadow:0 4px 16px rgba(0,0,0,.8)">Google launched four TPUs on Oct 1. What it's testing, and what could break.</div>
<div class="mono" style="position:absolute;left:100px;top:1695px;font-size:20px;color:#8d86c4">LAUNCH → RADIATION → 81 SATS → $200/KG → HEAT</div>
<div style="position:absolute;left:100px;top:1760px;display:flex;align-items:center;gap:22px"><img src="profile.jpg" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:5px solid #5dffc8;box-shadow:0 0 0 5px #0a0720,0 0 30px rgba(93,255,200,.6)"><div class="sy" style="font-size:40px;white-space:nowrap">@sandesh.explains</div></div>`;
writeFileSync(`${here}cover.html`, html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(`file://${here}cover.html`); await p.waitForTimeout(800);
await p.screenshot({ path: `${here}cover.png` }); await b.close(); console.log('cover.png');
