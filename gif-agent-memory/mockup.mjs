// Throwaway layout mockup (delete once the animated build supersedes it): hero frame of the "Agent memory is not RAG" GIF, 1600x900.
import fs from 'node:fs'; import { chromium } from 'playwright';
const ico = n => fs.readFileSync(`../assets/icons/tabler/${n}.svg`, 'utf8').replace(/<svg[^>]*>/, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">');
const C = { bg: '#f5efe6', ink: '#1d2530', rasp: '#c2185b', saf: '#f0a500', slate: '#35557a', sage: '#6f9a74', card: '#fffdf9' };
const lane = (y, color, icon, name, sub, ranks) => `
 <div class=lane style="top:${y}px;border-color:${color}"><div class=lh style="background:${color}"><i>${ico(icon)}</i></div>
  <div class=lt><b>${name}</b><span>${sub}</span></div>
  ${ranks.map((r, i) => `<div class=res style="left:${262 + i * 64}px;border-color:${color};color:${color}">${r}</div>`).join('')}
  <div class=courier style="background:${color};left:${262 + ranks.length * 64 + 8}px"></div></div>`;
const html = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Sora;src:url('../assets/fonts/sora/sora-latin-800-normal.woff2');font-weight:800}
@font-face{font-family:Sora;src:url('../assets/fonts/sora/sora-latin-700-normal.woff2');font-weight:700}
@font-face{font-family:Inter;src:url('../assets/fonts/inter/inter-latin-600-normal.woff2');font-weight:600}
@font-face{font-family:Inter;src:url('../assets/fonts/inter/inter-latin-500-normal.woff2');font-weight:500}
@font-face{font-family:JB;src:url('../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2');font-weight:700}
*{box-sizing:border-box;margin:0}body{width:1600px;height:900px;background:${C.bg};position:relative;overflow:hidden;font-family:Inter;color:${C.ink};
 background-image:radial-gradient(rgba(29,37,48,.10) 1.5px,transparent 1.6px);background-size:36px 36px}
.abs{position:absolute}svg{width:100%;height:100%}
h1{position:absolute;left:60px;top:34px;font:800 58px/1 Sora;letter-spacing:-.03em}h1 em{font-style:normal;color:${C.rasp}}
.sub{position:absolute;left:62px;top:104px;font:600 24px Inter;color:#4a5563}
.chips{position:absolute;right:60px;top:40px;display:flex;gap:12px}.chip{font:700 20px JB;background:${C.ink};color:${C.bg};padding:10px 16px;border-radius:10px}
.chip.l{background:transparent;color:${C.ink};border:2px solid ${C.ink}}
.step{position:absolute;font:700 20px JB;letter-spacing:.08em;display:flex;align-items:center;gap:10px}.step b{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:${C.ink};color:${C.bg};font:800 18px Sora}
.panel{position:absolute;background:${C.card};border:2.5px solid ${C.ink};border-radius:18px;box-shadow:6px 6px 0 ${C.ink}}
.msg{position:absolute;width:250px;background:#fff;border:2px solid ${C.ink};border-radius:14px;padding:10px 14px;font:600 19px/1.25 Inter}
.msg.u{border-radius:14px 14px 14px 2px}.msg.a{background:${C.ink};color:${C.bg};border-radius:14px 14px 2px 14px}
.tag{display:inline-block;font:700 17px JB;padding:5px 10px;border-radius:8px;color:#fff}
.lane{position:absolute;left:680px;width:520px;height:74px;background:${C.card};border:2.5px solid;border-radius:14px}
.lh{position:absolute;left:-2px;top:-2px;bottom:-2px;width:64px;border-radius:14px 0 0 14px;display:grid;place-items:center;color:#fff}.lh i{width:34px;height:34px}
.lt{position:absolute;left:76px;top:10px;width:180px}.lt b{display:block;font:700 22px Sora}.lt span{font:500 18px Inter;color:#4a5563}
.res{position:absolute;top:19px;width:56px;height:34px;border:2.5px solid;border-radius:9px;background:#fff;font:700 19px JB;display:grid;place-items:center}
.courier{position:absolute;top:27px;width:20px;height:20px;border-radius:50%;box-shadow:0 0 0 6px rgba(194,24,91,.15)}
.drawer{position:absolute;width:280px;height:100px;border-radius:14px;border:2.5px solid ${C.ink};background:${C.card};box-shadow:5px 5px 0 ${C.ink}}
.drawer b{position:absolute;left:84px;top:14px;font:700 23px Sora}.drawer span{position:absolute;left:84px;top:46px;font:500 18px/1.2 Inter;color:#4a5563;width:185px}
.drawer i{position:absolute;left:16px;top:25px;width:50px;height:50px;border-radius:12px;display:grid;place-items:center;color:#fff}.drawer i svg{width:30px;height:30px}
.fused{position:absolute;left:1250px;width:310px;height:54px;background:#fff;border:2.5px solid ${C.ink};border-radius:12px;font:700 21px Sora;display:flex;align-items:center;padding-left:16px;gap:12px}
.fused em{font:700 19px JB;color:#fff;background:${C.ink};border-radius:7px;padding:3px 9px;font-style:normal}
.gauge{position:absolute;left:1250px;top:716px;width:310px;height:34px;border:2.5px solid ${C.ink};border-radius:10px;background:#fff;overflow:hidden}.gauge div{height:100%;width:72%;background:${C.saf}}
.note{position:absolute;font:600 20px/1.25 Inter;color:#3a4552}
</style><body>
<div id=dg style="position:absolute;inset:0;transform:translateY(-122px)">
<!-- 1 RETAIN -->
<div class=step style="left:60px;top:168px"><b>1</b>RETAIN</div>
<div class=msg style="left:60px;top:212px;width:270px" ><span class=tag style="background:${C.slate}">user</span><br>I moved to Pune in March and I'm allergic to peanuts.</div>
<div class=msg style="left:60px;top:346px;width:270px;background:${C.ink};color:#f5efe6" ><span class=tag style="background:${C.rasp}">agent</span><br>Noted. Want Pune-based vegetarian places?</div>
<div class="panel" style="left:60px;top:476px;width:270px;height:196px;padding:16px 18px">
 <div style="font:700 21px Sora;margin-bottom:10px">LLM extractor</div>
 <span class=tag style="background:${C.sage}">fact</span> <span style="font:600 19px Inter">allergic: peanuts</span><br><div style="height:7px"></div>
 <span class=tag style="background:${C.slate}">entity</span> <span style="font:600 19px Inter">Pune</span><br><div style="height:7px"></div>
 <span class=tag style="background:${C.saf};color:${C.ink}">time</span> <span style="font:600 19px Inter">moved · March</span></div>

<!-- MEMORY BANK -->
<div class=step style="left:360px;top:168px"><b>2</b>MEMORY BANK</div>
<div class=drawer style="left:360px;top:212px"><i style="background:${C.sage}">${ico('database')}</i><b>World facts</b><span>what is true</span></div>
<div class=drawer style="left:360px;top:324px"><i style="background:${C.slate}">${ico('clock')}</i><b>Experiences</b><span>what happened, when</span></div>
<div class=drawer style="left:360px;top:436px"><i style="background:${C.saf};color:${C.ink}">${ico('layers-intersect')}</i><b>Observations</b><span>beliefs with evidence</span></div>
<div class=drawer style="left:360px;top:548px"><i style="background:${C.rasp}">${ico('brain')}</i><b>Mental models</b><span>standing answers, rewritten</span></div>
<div class=note style="left:360px;top:664px;width:230px;font-size:18px">One isolated bank per user, agent or project.</div>

<!-- RECALL -->
<div class=step style="left:680px;top:168px"><b>3</b>RECALL · 4 RETRIEVERS IN PARALLEL</div>
${lane(212, C.rasp, 'search', 'Semantic', 'vector similarity', ['#1', '#4', '#9'])}
${lane(300, C.saf, 'hash', 'Keyword', 'BM25 exact terms', ['#2', '#3', '#7'])}
${lane(388, C.slate, 'layers-intersect', 'Graph', 'entities & links', ['#1', '#2', '#6'])}
${lane(476, C.sage, 'clock', 'Temporal', 'time phrases', ['#3', '#5', '#8'])}
<div class="panel" style="left:680px;top:580px;width:520px;height:128px;padding:16px 22px">
 <div style="font:700 21px Sora">Rank fusion + cross-encoder rerank</div>
 <div class=note style="position:static;margin-top:8px;width:480px">Four ranked lists become one. Items that several retrievers agree on rise to the top.</div></div>

<!-- FUSED + OUTPUT -->
<div class=step style="left:1250px;top:168px"><b>4</b>ONE RANKED CONTEXT</div>
<div class=fused style="top:212px"><em>1</em>peanut allergy</div>
<div class=fused style="top:278px"><em>2</em>lives in Pune</div>
<div class=fused style="top:344px"><em>3</em>moved · March</div>
<div class=fused style="top:410px;opacity:.6"><em>4</em>likes vegetarian</div>
<div class=fused style="top:476px;opacity:.35"><em>5</em>…</div>
<div class=note style="left:1250px;top:548px;width:310px;font-weight:700">Trimmed to a token budget:</div>
<div class=gauge style="top:590px"><div></div></div>
<div class="panel" style="left:1250px;top:650px;width:310px;height:86px;background:${C.ink};color:${C.bg};display:flex;align-items:center;gap:16px;padding-left:20px"><i style="width:44px;height:44px;display:block;color:${C.saf}">${ico('sparkles')}</i><span style="font:700 22px/1.15 Sora">Prompt context<br><span style="font:500 18px Inter">→ the LLM answers</span></span></div>

<!-- REFLECT loop -->
<svg class=abs style="left:0;top:0;width:1600px;height:900px;pointer-events:none" viewBox="0 0 1600 900" fill="none">
 <path d="M1405 740 V800 H620 V652" stroke="${C.rasp}" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/>
 <path d="M612 664 l8 -14 l8 14" stroke="${C.rasp}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M330 398 H358" stroke="${C.ink}" stroke-width="4"/><path d="M330 600 H358" stroke="${C.ink}" stroke-width="4"/>
 <path d="M1202 249 H1248 M1202 337 H1248 M1202 425 H1248 M1202 513 H1248" stroke="${C.ink}" stroke-width="3"/>
 <path d="M692 200 V212 M692 200 H692" stroke="${C.ink}"/></svg>
<div class=step style="left:680px;top:818px;color:${C.rasp}"><b style="background:${C.rasp}">5</b>REFLECT · new facts rewrite the mental models</div>
<div class=note style="left:60px;top:696px;width:270px"><b>Why it is not RAG:</b> RAG fetches text. This layer extracts, links, ranks and keeps learning.</div>
</div>
<div style="position:absolute;left:0;right:0;top:752px;height:148px;background:${C.ink};color:${C.bg};border-top:6px solid ${C.rasp}">
 <div style="position:absolute;left:60px;top:22px;font:800 62px/1 Sora;letter-spacing:-.03em">Agent memory is <span style="color:#ff5c93">not</span> RAG</div>
 <div style="position:absolute;left:62px;top:96px;font:600 22px Inter;color:#d6cfc3">Retain → Recall → Reflect · open-source Hindsight project</div>
 <div style="position:absolute;right:60px;top:24px;display:grid;grid-template-columns:auto auto;gap:10px 12px;justify-items:stretch">
  <div class=chip style="background:${C.bg};color:${C.ink};text-align:center">MIT</div><div class=chip style="background:${C.bg};color:${C.ink};text-align:center">47.7k ★</div>
  <div class=chip style="grid-column:span 2;background:transparent;color:${C.bg};border:2px solid ${C.bg};text-align:center">4 retrievers · in parallel</div></div>
</div>
</body>`;
fs.writeFileSync('mockup.html', html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('file://' + process.cwd() + '/mockup.html'); await p.waitForTimeout(600); await p.screenshot({ path: 'mockup.png' }); await b.close();
