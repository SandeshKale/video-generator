// Purpose-built cover (not a frame grab): spec-sheet composition with a new hero arrangement.
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const html = `<!doctype html><meta charset=utf8><style>
@font-face{font-family:'Fr';font-weight:900;src:url('../assets/fonts/fraunces/fraunces-latin-900-normal.woff2');}
@font-face{font-family:'Fr';font-weight:900;font-style:italic;src:url('../assets/fonts/fraunces/fraunces-latin-900-italic.woff2');}
@font-face{font-family:'JBMono';font-weight:700;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');}
:root{--paper:#f1ede4;--ink:#101114;--cob:#2f5cff;--org:#ff5a1f;--mut:#8a857a}
*{box-sizing:border-box;margin:0}html,body{width:1080px;height:1920px;overflow:hidden;background:var(--paper)}
.g{position:absolute;inset:0;background-image:linear-gradient(rgba(16,17,20,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(16,17,20,.07) 1px,transparent 1px);background-size:54px 54px}
.fr{font-family:Fr;font-weight:900;letter-spacing:-.035em;line-height:.9;position:absolute;left:100px}
.mono{font-family:JBMono;font-weight:700}
.print{position:absolute;background:#fff;padding:16px 16px 54px;box-shadow:0 26px 46px rgba(16,17,20,.3)}
.print .ph{width:100%;height:100%;background-size:cover;background-position:50% 20%}
.tape{position:absolute;width:140px;height:38px;background:rgba(255,220,120,.75);box-shadow:0 2px 6px rgba(0,0,0,.2)}
.stamp{position:absolute;border:7px solid var(--org);color:var(--org);font:900 56px/1 Fr;padding:10px 24px;text-transform:uppercase;background:rgba(241,237,228,.7);transform:rotate(-9deg)}
.chip{position:absolute;font:700 24px JBMono;letter-spacing:.1em;padding:12px 20px;border:3px solid var(--ink);background:var(--paper)}
</style><body><div class=g></div>
<div class="mono" style="position:absolute;left:100px;top:210px;font-size:26px;letter-spacing:.12em">SPEC SHEET Nº <span style="color:var(--cob)">00</span> · ATLAS × HYUNDAI</div>
<div style="position:absolute;left:100px;right:100px;top:256px;border-top:4px solid var(--ink)"></div>
<div class=fr style="top:320px;font-size:176px">Workers</div>
<div class=fr style="top:482px;font-size:176px">struck</div>
<div class=fr style="top:644px;font-size:176px;color:var(--org);font-style:italic">over a</div>
<div class=fr style="top:806px;font-size:176px;color:var(--org);font-style:italic">robot.</div>
<div class=print style="left:540px;top:1010px;width:420px;height:500px;transform:rotate(4deg)"><div class=tape style="left:-28px;top:-14px;transform:rotate(-8deg)"></div><div class=tape style="right:-28px;top:-10px;transform:rotate(9deg)"></div><div class=ph style="background-image:url(shots/atlas-closeup.png)"></div></div>
<div class=stamp style="left:100px;top:1090px">First of its kind</div>
<div class=chip style="left:100px;top:1230px">40,000 UNION MEMBERS</div>
<div class=chip style="left:100px;top:1310px;background:var(--ink);color:var(--paper)">25,000 ROBOTS PLANNED</div>
<div style="position:absolute;left:100px;bottom:210px;display:flex;align-items:center;gap:20px"><div style="width:96px;height:96px;border-radius:50%;padding:5px;background:conic-gradient(var(--cob),#9fb5ff,var(--org),var(--cob))"><img src="../reel-app/public/profile.jpg" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:4px solid var(--paper)"></div><div class=fr style="position:static;font-size:42px;letter-spacing:-.02em">@sandesh.explains</div></div>
</body>`;
await writeFile('cover.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + process.cwd() + '/cover.html'); await p.waitForTimeout(600);
await p.screenshot({ path: 'cover.png' }); await b.close();
