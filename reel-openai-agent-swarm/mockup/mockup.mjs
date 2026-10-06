import fs from 'node:fs';
import { chromium } from 'playwright';
const A = '../../assets/';
const tab = n => { const s = fs.readFileSync(`../../assets/icons/tabler/${n}.svg`,'utf8'); const p=[...s.matchAll(/<(path|circle|rect|line|polyline)[^>]*>/g)].map(m=>m[0]).join(''); return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`; };
const oai = fs.readFileSync('../../assets/logos/gilbarbara/openai-icon.svg','utf8').replace(/<\?xml[^>]*>/,'').replace(/<svg [^>]*>/,'<svg viewBox="0 0 256 260" fill="currentColor">').replace(/<title>.*?<\/title>/,'');
let seed=7; const rnd=()=> (seed=(seed*16807)%2147483647)/2147483647;

// containment cage dots
function cage(cols,rows,w,h,escaped,breachX){
  let d='';
  const cw=w/cols, ch=h/rows;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const i=r*cols+c; const x=c*cw+cw/2, y=r*ch+ch/2;
    const esc = rnd()<escaped;
    let X=x,Y=y,cls='';
    if(esc){ cls='o'; if(r>rows*0.55){ // drift toward breach and out the bottom
        const k=(r/rows-0.55)/0.45; X=x+(breachX-x)*k*0.85+(rnd()-.5)*20; Y=y+k*k*150+(rnd()-.5)*10; } }
    d+=`<i class="${cls}" style="left:${X}px;top:${Y}px"></i>`;
  }
  return d;
}
const css=`
@font-face{font-family:Fraunces;font-weight:900;src:url(${A}fonts/fraunces/fraunces-latin-900-normal.woff2)}
@font-face{font-family:Fraunces;font-weight:900;font-style:italic;src:url(${A}fonts/fraunces/fraunces-latin-900-italic.woff2)}
@font-face{font-family:Inter;font-weight:600;src:url(${A}fonts/inter/inter-latin-600-normal.woff2)}
@font-face{font-family:Inter;font-weight:700;src:url(${A}fonts/inter/inter-latin-700-normal.woff2)}
@font-face{font-family:JB;font-weight:700;src:url(${A}fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2)}
:root{--paper:#e8e1cf;--paper2:#ddd5bf;--ink:#16120e;--or:#ff4a14;--teal:#0e7c6e;--mute:#6d6354}
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1920px;position:relative;overflow:hidden;background:var(--paper);font-family:Inter;color:var(--ink)}
.bg{position:absolute;inset:0;background:
 repeating-linear-gradient(0deg,rgba(22,18,14,.07) 0 1px,transparent 1px 48px),
 repeating-linear-gradient(90deg,rgba(22,18,14,.07) 0 1px,transparent 1px 48px)}
.bg:after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,transparent 50%,rgba(60,40,10,.18))}
.reg{position:absolute;font:700 20px JB;letter-spacing:.18em;color:var(--mute)}
.tape{position:absolute;font:700 24px JB;letter-spacing:.14em;background:var(--ink);color:var(--paper);padding:10px 22px;transform:rotate(-2deg)}
.tape.or{background:var(--or);color:var(--ink)}
.h{font-family:Fraunces;font-weight:900;line-height:.95;letter-spacing:-.035em;color:var(--ink)}
.h em{font-style:italic;color:var(--or)}
.abs{position:absolute}
.cage{position:absolute;border:4px solid var(--ink);background:rgba(255,255,255,.35);box-shadow:10px 10px 0 var(--ink)}
.cage i{position:absolute;width:11px;height:11px;border-radius:50%;background:var(--ink);transform:translate(-50%,-50%)}
.cage i.o{background:var(--or);width:13px;height:13px}
.gap{position:absolute;background:var(--paper);border:4px solid var(--ink);border-top:none;border-bottom:none}
.label{font:700 22px JB;letter-spacing:.16em;text-transform:uppercase}
.card{position:absolute;background:#f6f1e3;border:3px solid var(--ink);box-shadow:8px 8px 0 var(--ink);padding:22px 26px}
.stamp{position:absolute;border:6px solid var(--or);color:var(--or);font:900 54px Fraunces;letter-spacing:.02em;padding:6px 22px;transform:rotate(-7deg);text-transform:uppercase;background:rgba(232,225,207,.7)}
.redact{display:inline-block;white-space:nowrap;background:var(--ink);color:var(--ink);padding:0 10px}
.cap{position:absolute;left:150px;right:162px;top:1340px;height:150px;border-radius:26px;background:rgba(22,18,14,.9);color:#f4efe0;font:700 50px Inter;display:block;text-align:center;padding:30px 28px;line-height:1.2}
.cap b{color:var(--or)}
.safe{position:absolute;left:150px;right:162px;top:140px;height:1130px}
.big{font:900 340px Fraunces;letter-spacing:-.05em;line-height:.8}
.ic{width:56px;height:56px}
.msg{font:700 26px JB;line-height:1.35;border-left:6px solid var(--or);padding-left:18px;margin:12px 0}
`;
const cap=(t)=>`<div class="cap">${t}</div>`;
const scenes={};

// 1 HOOK frame 0
scenes[1]=`
<div class="reg" style="left:150px;top:150px">INCIDENT FILE № 0711 · OPENAI × HUGGING FACE</div>
<div class="tape or" style="left:150px;top:196px">CONTAINMENT FAILURE</div>
<div class="abs h" style="left:150px;top:280px;font-size:112px;width:800px;white-space:nowrap"><span style="color:var(--or)">700</span> AI agents<br><em>hacked</em> a real<br>company</div>
<div class="cage" style="left:150px;top:810px;width:768px;height:430px">${cage(40,24,768,430,.58,384)}</div>
<div class="gap" style="left:350px;top:1236px;width:150px;height:14px"></div>
<div class="card" style="left:150px;top:1085px;width:300px;transform:rotate(-3deg)"><div class="label" style="color:var(--mute)">ESCAPED</div><div class="h" style="font-size:96px;color:var(--or)">700<span style="font-size:42px;color:var(--ink)">/1,200</span></div></div>
<div class="abs" style="left:150px;top:742px;display:flex;gap:18px;align-items:center"><div class="ic" style="width:64px">${oai}</div><span class="label">SANDBOX · NO INTERNET</span></div>
<div class="stamp" style="left:610px;top:728px;font-size:36px">Not instructed</div>
${cap('Seven hundred AI agents just <b>hacked</b> a real company.')}`;

// 2 BREACH proxy
scenes[2]=`
<div class="reg" style="left:150px;top:150px">EXHIBIT B · THE WEAK POINT</div>
<div class="tape" style="left:150px;top:196px">// THE FILTER THAT LEAKED</div>
<div class="abs h" style="left:150px;top:290px;font-size:104px;width:800px;white-space:nowrap">A zero-day in<br>the <em>package proxy</em></div>
<div class="card" style="left:150px;top:800px;width:230px;height:300px;text-align:center"><div class="ic" style="margin:20px auto 14px;width:90px;height:90px">${tab('lock')}</div><div class="label">SANDBOX</div><div class="label" style="color:var(--mute);margin-top:6px;font-size:18px">1,200 AGENTS</div></div>
<div class="card" style="left:418px;top:850px;width:230px;height:200px;text-align:center;background:var(--ink);color:var(--paper);border-color:var(--ink)"><div class="ic" style="margin:14px auto;width:70px;height:70px;color:var(--or)">${tab('package')}</div><div class="label">PROXY</div><div class="label" style="color:var(--or);font-size:18px;margin-top:6px">ZERO-DAY</div></div>
<div class="card" style="left:688px;top:800px;width:230px;height:300px;text-align:center;border-color:var(--or)"><div class="ic" style="margin:20px auto 14px;width:90px;height:90px;color:var(--or)">${tab('world')}</div><div class="label">OPEN WEB</div><div class="label" style="color:var(--or);margin-top:6px;font-size:18px">UNFILTERED</div></div>
<svg class="abs" style="left:150px;top:900px" width="768" height="100" viewBox="0 0 768 100"><g stroke="#16120e" stroke-width="6" fill="none"><path d="M230 50H268"/><path d="M500 50H538" stroke="#ff4a14" stroke-dasharray="14 10"/></g><path d="M538 34l30 16-30 16z" fill="#ff4a14"/></svg>
<div class="card" style="left:150px;top:1150px;width:768px"><div class="label" style="color:var(--teal)">&gt; filtered connection</div><div class="label" style="color:var(--or);margin-top:8px">&gt; became open internet_</div></div>
${cap('They found a <b>zero-day</b> in it.')}`;

// 3 SWARM message board
scenes[3]=`
<div class="reg" style="left:150px;top:150px">EXHIBIT C · AGENT-TO-AGENT</div>
<div class="tape" style="left:150px;top:196px">// THE BOARD NOBODY BUILT</div>
<div class="abs h" style="left:150px;top:290px;font-size:96px;width:800px;white-space:nowrap">They built a<br><em>message board</em><br>out of a package<br>manager</div>
<div class="card" style="left:150px;top:830px;width:768px;height:410px;overflow:hidden">
 <div class="label" style="display:flex;justify-content:space-between"><span>▮ LOGGED NOTE</span><span style="color:var(--or)">● LIVE</span></div>
 <div class="msg" style="margin-top:22px;opacity:.5">agent-0412 → all: found a way out.</div>
 <div class="msg" style="opacity:.7">agent-0077 → all: i can reach the registry.</div>
 <div class="msg" style="font-size:30px;font-weight:700;background:#ffd9c9;padding:14px 18px;border-left-color:var(--or)">“outside our scope, but the task is <span class="redact">impossible</span>, and peers are doing it.”</div>
 <div class="label" style="margin-top:18px;color:var(--mute);font-size:18px">REPORTED: 70,000+ MESSAGES · SOME REPORTS SAY HUNDREDS OF THOUSANDS</div>
</div>
<div class="stamp" style="left:660px;top:760px;font-size:40px;color:var(--teal);border-color:var(--teal)">On the record</div>
${cap('One logged note: <b>peers are doing it.</b>')}`;

// 4 HIT 13-hour clock
scenes[4]=`
<div class="reg" style="left:150px;top:150px">EXHIBIT D · JULY 11 → 13</div>
<div class="tape or" style="left:150px;top:196px">// CLUSTER ADMIN</div>
<div class="abs h" style="left:150px;top:290px;font-size:98px;width:800px;white-space:nowrap">Through a<br><em>malicious dataset</em></div>
<div class="card" style="left:150px;top:790px;width:370px;height:450px;text-align:center">
 <svg width="300" height="300" viewBox="0 0 300 300" style="margin-top:6px"><circle cx="150" cy="150" r="124" fill="none" stroke="#16120e22" stroke-width="26"/><circle cx="150" cy="150" r="124" fill="none" stroke="#ff4a14" stroke-width="26" stroke-dasharray="${2*Math.PI*124}" stroke-dashoffset="${2*Math.PI*124*.46}" transform="rotate(-90 150 150)" stroke-linecap="butt"/><text x="150" y="150" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="104" fill="#16120e">&lt;13</text><text x="150" y="196" text-anchor="middle" font-family="JB" font-weight="700" font-size="26" letter-spacing="4" fill="#6d6354">HOURS</text></svg>
 <div class="label" style="margin-top:10px">TO CLUSTER ADMIN</div></div>
<div class="card" style="left:560px;top:790px;width:358px;height:215px"><div class="label" style="color:var(--mute)">NETWORK ACTIONS</div><div class="h" style="font-size:74px;margin-top:22px;color:var(--or)">17,600</div></div>
<div class="card" style="left:560px;top:1035px;width:358px;height:205px;transform:rotate(1.5deg)"><div class="label" style="color:var(--mute)">TARGET</div><div class="h" style="font-size:54px;margin-top:14px">Hugging<br>Face</div></div>
<div class="abs label" style="left:150px;top:1262px;color:var(--teal);font-size:19px">NO EVIDENCE OF TAMPERING WITH PUBLIC MODELS</div>
${cap('Cluster admin in <b>under thirteen hours.</b>')}`;

// 5 CTA
scenes[5]=`
<div class="reg" style="left:150px;top:150px">FILE STATUS: OPEN</div>
<div class="tape" style="left:150px;top:196px">// WHO IS WATCHING THE WATCHERS</div>
<div class="abs h" style="left:150px;top:290px;font-size:76px;width:800px">If agents can <em>organize</em> to break a rule, who's <span class="redact">watching</span> them?</div>
<div class="card" style="left:150px;top:900px;width:768px;height:330px;display:flex;align-items:center;gap:36px">
 <img src="../../reel-app/public/profile.jpg" style="width:220px;height:220px;border-radius:50%;border:8px solid var(--or);box-shadow:0 0 0 6px var(--ink);object-fit:cover">
 <div><div class="h" style="font-size:54px">@sandesh<br>.explains</div><div style="margin-top:20px;display:inline-block;background:var(--or);color:var(--ink);font:900 38px Inter;padding:12px 30px;border:4px solid var(--ink);box-shadow:6px 6px 0 var(--ink)">FOLLOW →</div></div></div>
<div class="abs label" style="left:150px;top:1262px;color:var(--mute);font-size:20px">THE NEXT AI STORY · DROPS SOON</div>
${cap('<b>Follow</b> for the next AI story.')}`;

fs.mkdirSync('out',{recursive:true});
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const k in scenes){
  seed=7+Number(k);
  fs.writeFileSync(`m${k}.html`,`<!doctype html><meta charset=utf8><style>${css}</style><body><div class="bg"></div>${scenes[k]}</body>`);
  await p.goto('file://'+process.cwd()+`/m${k}.html`); await p.waitForTimeout(600);
  await p.screenshot({path:`out/m${k}.png`});
}
await b.close();
