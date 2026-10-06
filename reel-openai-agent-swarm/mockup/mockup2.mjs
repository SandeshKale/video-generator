import fs from 'node:fs';
import { chromium } from 'playwright';
const A='../../assets/';
const tab=n=>{const s=fs.readFileSync(`../../assets/icons/tabler/${n}.svg`,'utf8');const p=[...s.matchAll(/<(path|circle|rect|line|polyline)[^>]*>/g)].map(m=>m[0]).join('');return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;};
const oai=fs.readFileSync('../../assets/logos/gilbarbara/openai-icon.svg','utf8').replace(/<\?xml[^>]*>/,'').replace(/<svg [^>]*>/,'<svg viewBox="0 0 256 260" fill="currentColor">').replace(/<title>.*?<\/title>/,'');
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const grid=(cols,rows,w,h,esc)=>{let d='';const cw=w/cols,ch=h/rows;const total=cols*rows;const idx=[...Array(total).keys()].sort(()=>rnd()-.5).slice(0,Math.round(total*esc));const set=new Set(idx);
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const on=set.has(r*cols+c);d+=`<b class="${on?'on':''}" style="left:${c*cw+2}px;top:${r*ch+2}px;width:${cw-4}px;height:${ch-4}px"></b>`;}return d;};
const css=`
@font-face{font-family:Anton;src:url(${A}fonts/anton/anton-latin-400-normal.woff2)}
@font-face{font-family:Inter;font-weight:700;src:url(${A}fonts/inter/inter-latin-700-normal.woff2)}
@font-face{font-family:Inter;font-weight:600;src:url(${A}fonts/inter/inter-latin-600-normal.woff2)}
@font-face{font-family:JB;font-weight:700;src:url(${A}fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2)}
:root{--bl:#2338ff;--bl2:#1a2bd0;--navy:#0a1050;--lime:#c8ff2e;--ice:#eef1ff}
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--bl);font-family:Inter;color:var(--ice)}
.bg{position:absolute;inset:0;background:radial-gradient(circle,rgba(238,241,255,.22) 2.2px,transparent 2.8px) 0 0/36px 36px;-webkit-mask-image:linear-gradient(180deg,#000 0,transparent 55%,#000 100%)}
.bg2{position:absolute;left:0;right:0;top:0;height:1920px;background:linear-gradient(90deg,transparent 0 149px,rgba(200,255,46,.35) 149px 151px,transparent 151px 917px,rgba(200,255,46,.35) 917px 919px,transparent 919px)}
.ticker{position:absolute;left:0;right:0;top:140px;height:54px;background:var(--lime);color:var(--navy);font:700 24px JB;letter-spacing:.12em;white-space:nowrap;overflow:hidden;display:flex;align-items:center}
.ticker span{padding-left:30px}
.d{font-family:Anton;text-transform:uppercase;line-height:.92;letter-spacing:.005em;color:var(--ice)}
.d i{font-style:normal;color:var(--lime)}
.abs{position:absolute}
.lab{font:700 22px JB;letter-spacing:.16em;text-transform:uppercase}
.grid{position:absolute;overflow:hidden}.grid b{position:absolute;border:2px solid rgba(238,241,255,.55)}.grid b.on{background:var(--lime);border-color:var(--lime)}
.panel{position:absolute;border:4px solid var(--ice)}
.panel.fill{background:var(--navy);border-color:var(--navy)}
.panel.lime{background:var(--lime);border-color:var(--lime);color:var(--navy)}
.cap{position:absolute;left:150px;right:162px;top:1340px;height:150px;background:var(--navy);border:4px solid var(--lime);color:var(--ice);font:700 50px Inter;display:block;text-align:center;padding:26px 24px;line-height:1.2}
.cap b{color:var(--lime)}
.circ{position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center}
.q{font:700 30px JB;line-height:1.4}
`;
const cap=t=>`<div class="cap">${t}</div>`;
const tick=t=>`<div class="ticker"><span>${t}</span></div>`;
const T='● JUL 11 ● 1,200 AGENTS ● 700 TOOK PART ● 17,600 ACTIONS ● &lt;13 HOURS ● PAUSED 2 WEEKS ● 100+ ORGS NOTIFIED ● JUL 11 ● 1,200 AGENTS ● 700 TOOK PART';
const S={};
S[1]=`${tick(T)}
<div class="abs d" style="left:150px;top:230px;font-size:430px;color:var(--lime);line-height:.8">700</div>
<div class="abs d" style="left:150px;top:590px;font-size:104px;width:780px">AI agents <i>hacked</i><br>a real company</div>
<div class="abs lab" style="left:150px;top:810px;display:flex;align-items:center;gap:16px"><span style="width:44px;display:inline-block">${oai}</span> 1,200 AGENTS · SANDBOX · NO INTERNET</div>
<div class="grid" style="left:150px;top:880px;width:768px;height:360px">${grid(40,19,768,360,.58)}</div>
<div class="circ" style="left:690px;top:1130px;width:190px;height:190px;background:var(--navy);border:4px solid var(--lime)"><div><div class="d" style="font-size:70px;color:var(--lime)">700</div><div class="lab" style="font-size:16px">ESCAPED</div></div></div>
<div class="abs lab" style="left:150px;top:1262px;color:var(--lime);font-size:20px">■ = AGENT &nbsp;&nbsp;<span style="color:var(--lime)">■</span> = ESCAPED THE SANDBOX</div>
${cap('Seven hundred AI agents just <b>hacked</b> a real company.')}`;
S[2]=`${tick(T)}
<div class="abs lab" style="left:150px;top:230px;color:var(--lime)">02 / THE WEAK POINT</div>
<div class="abs d" style="left:150px;top:276px;font-size:136px;width:780px">A <i>zero-day</i><br>in the package<br>proxy</div>
<div class="circ" style="left:150px;top:830px;width:250px;height:250px;border:4px solid var(--ice);flex-direction:column"><div style="width:84px;color:var(--ice)">${tab('lock')}</div><div class="lab" style="margin-top:8px;font-size:20px">SANDBOX</div></div>
<div class="panel lime" style="left:430px;top:850px;width:210px;height:210px;transform:rotate(45deg)"></div>
<div class="abs" style="left:430px;top:850px;width:210px;height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--navy)"><div style="width:76px">${tab('package')}</div><div class="lab" style="font-size:20px;margin-top:6px">PROXY</div></div>
<div class="circ" style="left:668px;top:830px;width:250px;height:250px;background:var(--lime);color:var(--navy);flex-direction:column"><div style="width:84px">${tab('world')}</div><div class="lab" style="margin-top:8px;font-size:20px">OPEN WEB</div></div>
<div class="abs" style="left:400px;top:952px;width:30px;height:6px;background:var(--ice)"></div>
<div class="abs" style="left:640px;top:952px;width:28px;height:6px;background:var(--lime)"></div>
<div class="panel fill" style="left:150px;top:1130px;width:768px;padding:24px 28px"><div class="q" style="color:var(--ice)">&gt; filtered connection</div><div class="q" style="color:var(--lime)">&gt; became open internet_</div></div>
${cap('They found a <b>zero-day</b> in it.')}`;
S[3]=`${tick(T)}
<div class="abs lab" style="left:150px;top:230px;color:var(--lime)">03 / AGENT-TO-AGENT</div>
<div class="abs d" style="left:150px;top:276px;font-size:112px;width:780px">They built<br>a <i>message<br>board</i> out of<br>a package manager</div>
<div class="panel" style="left:150px;top:870px;width:560px;padding:14px 22px;border-radius:0 28px 28px 28px;opacity:.7"><div class="q" style="font-size:24px">agent-0412: found a way out.</div></div>
<div class="panel" style="left:300px;top:962px;width:618px;padding:14px 22px;border-radius:28px 0 28px 28px;opacity:.85"><div class="q" style="font-size:24px">agent-0077: i can reach the registry.</div></div>
<div class="panel lime" style="left:150px;top:1060px;width:768px;padding:22px 28px;border-radius:0 28px 28px 28px"><div class="q" style="font-size:28px;color:var(--navy)">“outside our scope, but the task is impossible, and peers are doing it.”</div></div>
<div class="abs lab" style="left:150px;top:1258px;font-size:18px;color:var(--lime)">REPORTED 70,000+ MESSAGES · SOME REPORTS: HUNDREDS OF THOUSANDS</div>
${cap('One logged note: <b>peers are doing it.</b>')}`;
const R=120,C=2*Math.PI*R;
S[4]=`${tick(T)}
<div class="abs lab" style="left:150px;top:230px;color:var(--lime)">05 / JULY 11 → 13</div>
<div class="abs d" style="left:150px;top:276px;font-size:136px;width:780px">Through<br>a <i>malicious<br>dataset</i></div>
<div class="panel fill" style="left:150px;top:850px;width:768px;height:200px"></div>
<div class="abs d" style="left:178px;top:872px;font-size:140px;color:var(--lime)">&lt;13H</div>
<div class="abs lab" style="left:560px;top:900px;font-size:20px">TO CLUSTER ADMIN</div>
<div class="abs" style="left:560px;top:950px;width:330px;height:32px;border:3px solid var(--ice)"><div style="width:92%;height:100%;background:var(--lime)"></div></div>
<div class="abs lab" style="left:560px;top:996px;font-size:16px">0H ───────────── 13H</div>
<div class="panel lime" style="left:150px;top:1075px;width:420px;height:165px;padding:20px 24px"><div class="lab" style="font-size:18px">NETWORK ACTIONS</div><div class="d" style="font-size:92px;color:var(--navy);margin-top:8px">17,600</div></div>
<div class="panel" style="left:600px;top:1075px;width:318px;height:165px;padding:20px 24px"><div class="lab" style="font-size:18px">TARGET</div><div class="d" style="font-size:54px;margin-top:14px">HUGGING FACE</div></div>
<div class="abs lab" style="left:150px;top:1262px;font-size:17px;color:var(--lime)">NO EVIDENCE OF TAMPERING WITH PUBLIC MODELS</div>
${cap('Cluster admin in <b>under thirteen hours.</b>')}`;
S[5]=`${tick(T)}
<div class="abs lab" style="left:150px;top:230px;color:var(--lime)">09 / WHO'S WATCHING</div>
<div class="abs d" style="left:150px;top:276px;font-size:112px;width:780px">If agents can <i>organize</i> to break a rule, who's watching them?</div>
<div class="panel fill" style="left:150px;top:900px;width:768px;height:330px;display:flex;align-items:center;gap:36px;padding:0 36px">
 <img src="../../reel-app/public/profile.jpg" style="width:220px;height:220px;border-radius:50%;border:8px solid var(--lime);object-fit:cover">
 <div><div class="d" style="font-size:64px">@sandesh<br>.explains</div><div style="margin-top:20px;display:inline-block;background:var(--lime);color:var(--navy);font:900 36px Inter;padding:10px 28px">FOLLOW →</div></div></div>
<div class="abs lab" style="left:150px;top:1262px;font-size:19px;color:var(--lime)">THE NEXT AI STORY · DROPS SOON</div>
${cap('<b>Follow</b> for the next AI story.')}`;
fs.mkdirSync('out2',{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const k in S){fs.writeFileSync(`n${k}.html`,`<!doctype html><meta charset=utf8><style>${css}</style><body><div class="bg"></div><div class="bg2"></div>${S[k]}</body>`);
 await p.goto('file://'+process.cwd()+`/n${k}.html`);await p.waitForTimeout(500);await p.screenshot({path:`out2/n${k}.png`});}
await b.close();
