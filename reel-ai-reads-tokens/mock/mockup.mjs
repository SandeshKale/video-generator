// THROWAWAY mockup (delete once the full build supersedes it): 4 scenes, 4 different primary families, "Letterpress Tokenizer" identity.
// s1 hook (avatar host + chat message shattering into tokens/IDs) · s2 Blender SAND|ESH block · s6 mocap token race · s9 X-ray rhyme (humaaans + bespoke)
import fs from 'node:fs';
import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const anth = fs.readFileSync(new URL('../../assets/logos/gilbarbara/anthropic-icon.svg', import.meta.url), 'utf8').replace(/<\?xml[^>]*>/, '').replace(/fill="#181818"/, 'fill="currentColor"');
const html = `<!doctype html><meta charset="utf8"><style>
@font-face{font-family:AS;src:url('../site/fonts/alfa-slab-one-latin-400-normal.woff2');font-display:block}
@font-face{font-family:PM;font-weight:600;src:url('../site/fonts/ibm-plex-mono-latin-600-normal.woff2');font-display:block}
@font-face{font-family:PM;font-weight:700;src:url('../site/fonts/ibm-plex-mono-latin-700-normal.woff2');font-display:block}
@font-face{font-family:PM;font-weight:500;src:url('../site/fonts/ibm-plex-mono-latin-500-normal.woff2');font-display:block}
@font-face{font-family:IN;font-weight:700;src:url('../site/fonts/inter-latin-700-normal.woff2');font-display:block}
@font-face{font-family:IN;font-weight:600;src:url('../site/fonts/inter-latin-600-normal.woff2');font-display:block}
@font-face{font-family:ND;font-weight:700;src:url('../site/fonts/noto-sans-devanagari-devanagari-700-normal.woff2');font-display:block}
:root{--np:#f3efe4;--ink:#17171a;--pe:#ffc79a;--mi:#9be8cf;--li:#c4b5ff;--sk:#9fd6ff;--red:#e8432e;--lead:#5d6066}
*{box-sizing:border-box;margin:0}body{background:#888}
.f{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--np);font-family:IN;color:var(--ink);margin-bottom:20px}
.fib{position:absolute;inset:0;opacity:.55;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45  0 0 0 0 .40  0 0 0 0 .32  0 0 0 .22 0'/></filter><rect width='400' height='400' filter='url(%23n)'/></svg>")}
.ht{position:absolute;inset:0;background:radial-gradient(circle,rgba(23,23,26,.09) 2.2px,transparent 2.6px) 0 0/22px 22px;-webkit-mask:linear-gradient(160deg,#000 0,transparent 38%,transparent 70%,#000 100%)}
.eb{position:absolute;left:150px;top:166px;background:var(--ink);color:var(--np);font:700 24px/1 PM;letter-spacing:.08em;padding:13px 20px 13px 52px;white-space:nowrap;box-shadow:6px 6px 0 rgba(23,23,26,.18)}
.eb:before{content:"";position:absolute;left:14px;top:50%;width:22px;height:22px;margin-top:-11px;border:2.5px solid var(--np);border-radius:50%;background:linear-gradient(var(--np),var(--np)) 50%/2.5px 100% no-repeat,linear-gradient(var(--np),var(--np)) 50%/100% 2.5px no-repeat}
.h{position:absolute;font:400 92px/1.02 AS;letter-spacing:-.01em;white-space:nowrap;color:var(--ink)}
.h .k{background:var(--pe);padding:0 14px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.tk{display:inline-block;padding:4px 6px 6px;margin:0 1px;border-radius:6px;white-space:pre}
.stick{position:absolute;left:96px;right:96px;top:1300px;background:#2a2b30;border-radius:18px;padding:22px 24px 16px;box-shadow:0 14px 30px rgba(23,23,26,.35),inset 0 3px 0 rgba(255,255,255,.12)}
.stick .row{text-align:center;font:700 46px/1.38 IN;color:var(--ink)}
.stick .row .tk{margin:3px 1px}
.stick .meta{margin-top:10px;font:600 17px/1 PM;letter-spacing:.12em;color:#a9abb2;text-align:center}
.stick:before,.stick:after{content:"";position:absolute;top:-10px;bottom:-10px;width:22px;background:#1b1c20;border-radius:8px}.stick:before{left:-12px}.stick:after{right:-12px}
.tag{position:absolute;font:600 17px/1 PM;letter-spacing:.1em;background:var(--ink);color:var(--np);padding:7px 10px;white-space:nowrap}
.case{position:absolute;background:#1d1d21;border:10px solid #2c2c31;border-radius:20px;box-shadow:0 22px 46px rgba(23,23,26,.35);overflow:hidden}
.case .lab{position:absolute;left:0;right:0;bottom:0;height:46px;background:var(--ink);color:var(--np);font:700 18px/46px PM;letter-spacing:.12em;padding:0 16px;display:flex;justify-content:space-between}
.case .img{position:absolute;left:0;right:0;top:0;bottom:46px;background:url(../site/profile.jpg) center 22%/cover}
.proof{position:absolute;background:#fbf8f0;border:3px solid var(--ink);box-shadow:10px 10px 0 var(--ink)}
.mono{font-family:PM}
.chip{position:absolute;font:700 20px/1 PM;letter-spacing:.08em;padding:9px 12px;border:3px solid var(--ink);background:#fbf8f0;white-space:nowrap}
</style><body>
<div class="f" id="s1"></div><div class="f" id="s2"></div><div class="f" id="s6"></div><div class="f" id="s9"></div>
<script src="../site/tok.js"></script><script src="../site/mocap.js"></script><script src="../site/rig.js"></script><script src="../site/hum.js"></script><script>
var PAST=['#ffc79a','#9be8cf','#c4b5ff','#9fd6ff'],ANTH=${JSON.stringify(anth)};
function el(p,css,h,c){var d=document.createElement('div');d.style.cssText='position:absolute;'+(css||'');if(c)d.className=c;if(h!=null)d.innerHTML=h;p.appendChild(d);return d}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function toks(arr,o){o=o||{};return arr.map(function(t,i){var s=esc(t[0]);return '<span class="tk" style="background:'+PAST[i%4]+(o.font?';font-family:'+o.font:'')+'">'+s+'</span>'}).join('')}
function base(f){el(f,'','','fib');el(f,'','','ht')}
function stick(f,key,n){var s=el(f,'','','stick');s.innerHTML='<div class="row">'+toks(TOK[key])+'</div><div class="meta">CAPTION SET IN REAL TOKENS · o200k · '+TOK[key].length+' TOKENS</div>';return s}
function host(f,css,lab){return el(f,css,'<div class="img"></div><div class="lab"><span>'+(lab||'HOST')+'</span><span>AI AVATAR</span></div>','case')}
// ================= S1 · hook =================
(function(){var f=document.getElementById('s1');base(f);
 host(f,'left:150px;top:150px;width:768px;height:760px','HOST · PLACEHOLDER STILL');
 el(f,'left:182px;top:182px;background:var(--red);color:var(--np);font:400 46px/1 AS;padding:12px 18px;transform:rotate(-3deg);box-shadow:6px 6px 0 var(--ink)','NEVER READ.');
 // chat composer
 var c=el(f,'left:150px;top:950px;width:768px;height:118px;background:#fff;border:3px solid var(--ink);border-radius:60px;box-shadow:8px 8px 0 var(--ink)');
 el(c,'left:34px;top:14px;font:600 18px/1 PM;color:#9a9a9f;letter-spacing:.1em','YOU TYPED');el(c,'left:34px;top:42px;font:700 46px/1 IN;color:#c9c4b8;text-decoration:line-through;text-decoration-color:var(--red);text-decoration-thickness:4px','explain my phone bill');
 el(c,'right:18px;top:18px;width:76px;height:76px;border-radius:50%;background:var(--ink)','<svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#f3efe4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V7M7.5 11.5 12 7l4.5 4.5" transform="translate(0 0)"/></svg>');
 // shattered token chips flying out of the composer, each with its ID
 var xs=[150,252,404,546,742],ys=[1094,1118,1098,1122,1092],rot=[-8,5,-4,7,-6];
 TOK.chat.forEach(function(t,i){var d=el(f,'left:'+xs[i]+'px;top:'+ys[i]+'px;transform:rotate('+rot[i]+'deg);text-align:center','<div class="tk" style="background:'+PAST[i%4]+';font:700 42px/1.1 IN;border:3px solid var(--ink);box-shadow:5px 5px 0 var(--ink)">'+esc(t[0]).replace(/^ /,'␣')+'</div><div class="mono" style="margin-top:10px;font-weight:700;font-size:28px">'+t[1]+'</div>')});
 el(f,'left:150px;top:1240px','"explain my phone bill" → 5 TOKENS → 5 NUMBERS','tag');
 stick(f,'cap1');
})();
// ================= S2 · Blender SAND|ESH =================
(function(){var f=document.getElementById('s2');base(f);el(f,'','// SAND + ESH = ME','eb');
 var h=el(f,'left:150px;top:236px','','h');h.innerHTML='TO AI, I\\'M<br><span class="k">2 TOKENS.</span>';
 el(f,'left:40px;top:420px;width:1000px;height:640px;background:url(../site/3d/sand_01.png) center/contain no-repeat;-webkit-mask:radial-gradient(ellipse 52% 50% at 50% 48%,#000 70%,transparent 100%)');
 el(f,'left:150px;top:470px','BLENDER · LETTERPRESS TYPE','tag');
 // token readout under the blocks
 var r=el(f,'left:150px;top:1020px;width:440px;padding:18px 20px','', 'proof');
 r.innerHTML='<div class="mono" style="font-weight:700;font-size:20px;letter-spacing:.1em;color:#6b6b70">"Sandesh" →</div><div style="margin-top:10px;font:700 46px/1.1 IN">'+'<span class="tk" style="background:#ffc79a">Sand</span><span class="tk" style="background:#9be8cf">esh</span>'+'</div><div class="mono" style="margin-top:10px;font-weight:700;font-size:26px">54311 · 8382</div>';
 host(f,'left:640px;top:960px;width:278px;height:300px','HOST');
 el(f,'left:150px;top:966px','MEASURED · OpenAI TOKENIZER (o200k) · 11 OCT 2026','tag');
 stick(f,'cap2');
})();
// ================= S6 · token race =================
(function(){var f=document.getElementById('s6');base(f);el(f,'','// "I LOVE YOU" IN TOKENS','eb');
 var h=el(f,'left:150px;top:236px','','h');h.style.fontSize='84px';h.innerHTML='SAME WORDS.<br><span class="k" style="background:#c4b5ff">MORE STEPS.</span>';
 var lanes=[{k:'love',lab:'ENGLISH',n:3,prog:1,font:'IN'},{k:'hi',lab:'HINDI · TODAY',n:6,prog:.55,font:'ND'},{k:'hi_old',lab:'HINDI · OLDER MODEL',n:24,prog:.2,font:'IN'}];
 lanes.forEach(function(L,li){var y=560+li*235,x0=150,x1=820,arr=TOK[L.k],n=arr.length,w=(x1-x0)/n;
  el(f,'left:150px;top:'+(y-24)+'px;font:700 19px/1 PM;letter-spacing:.12em',L.lab);
  // stones
  arr.forEach(function(t,i){var sx=x0+i*w,big=n<10;el(f,'left:'+(sx+3)+'px;top:'+(y+118)+'px;width:'+(w-6)+'px;height:'+(big?62:46)+'px;background:'+PAST[i%4]+';border:3px solid var(--ink);border-radius:8px;transform:skewX(-12deg);box-shadow:0 6px 0 var(--ink);display:flex;align-items:center;justify-content:center;font:700 '+(big?(L.font==='ND'?30:32):14)+'px/1 '+(L.font==='ND'?'ND':'IN')+';overflow:hidden;white-space:pre',big?esc(t[0].trim()):'')});
  // count
  el(f,'left:840px;top:'+(y+92)+'px;font:400 76px/1 AS;color:'+(li?'var(--red)':'var(--ink)'),String(n));
  // runner (mocap run), placed by progress
  var P=RIG.sample('run',li*.23+.1,{loop:true,inplace:true}),sc=li==2?.34:.38,rx=x0+L.prog*(x1-x0)-(L.prog==1?60:0);
  var g=el(f,'left:'+(rx-260*sc)+'px;top:'+(y+130-430*sc)+'px;width:'+(520*sc)+'px;height:'+(480*sc)+'px;'+(li==2?'opacity:.55':''));
  g.innerHTML='<svg width="'+(520*sc)+'" height="'+(480*sc)+'" viewBox="-260 -430 520 480">'+RIG.svg(P,'human',{tint:'#17171a'})+'</svg>';
  if(L.prog==1)el(f,'left:'+(x1-40)+'px;top:'+(y+20)+'px;font:400 30px/1 AS;background:var(--mi);padding:6px 10px;border:3px solid var(--ink)','DONE');
 });
 el(f,'left:150px;top:1236px','OWN MEASUREMENT · o200k vs cl100k · tiktoken','tag');
 stick(f,'cap6');
})();
// ================= S9 · X-ray rhyme =================
(function(){var f=document.getElementById('s9');base(f);el(f,'','// IT PLANS AHEAD','eb');
 var h=el(f,'left:150px;top:236px','','h');h.style.fontSize='80px';h.innerHTML='IT PICKED THE<br><span class="k" style="background:#9be8cf">RHYME FIRST.</span>';
 // paper with the couplet
 var p=el(f,'left:150px;top:450px;width:768px;height:300px;padding:26px 28px','','proof');
 p.innerHTML='<div class="mono" style="font-weight:700;font-size:18px;letter-spacing:.12em;color:#6b6b70">LINE 1 · WRITTEN</div><div style="margin-top:10px;font:700 34px/1.5 IN">'+toks(TOK.l1)+'</div><div class="mono" style="margin-top:16px;font-weight:700;font-size:18px;letter-spacing:.12em;color:#6b6b70">LINE 2 · NOT STARTED YET</div><div style="margin-top:10px;font:700 34px/1.4 IN;color:#b7b2a6">His hunger was like a starving <span style="border-bottom:5px dashed var(--red);color:var(--red)">______</span><span style="display:inline-block;width:4px;height:36px;background:var(--ink);vertical-align:-6px;margin-left:4px"></span></div>';
 // x-ray board of feature lamps
 var b=el(f,'left:390px;top:800px;width:528px;height:372px;background:#17171a;border-radius:18px;padding:22px;box-shadow:0 18px 40px rgba(23,23,26,.4)');
 el(b,'left:22px;bottom:16px;font:700 17px/1 PM;letter-spacing:.12em;color:#9fd6ff','X-RAY · ACTIVE BEFORE LINE 2 IS WRITTEN');
 var L=[['rabbit',1],['habit',0],['carrot',0],['grab',0],['green',0],['hungry',0]];
 L.forEach(function(w,i){var cx=22+(i%2)*250,cy=20+Math.floor(i/2)*104,on=w[1];
  el(b,'left:'+cx+'px;top:'+cy+'px;width:236px;height:96px;border-radius:14px;background:'+(on?'#2b2420':'#222226')+';border:2px solid '+(on?'#ffc79a':'#3a3a40'),'<div style="position:absolute;left:16px;top:24px;width:46px;height:46px;border-radius:50%;background:'+(on?'radial-gradient(circle,#fff3e6 0,#ffc79a 45%,#e8432e 100%)':'#3a3a40')+';box-shadow:'+(on?'0 0 30px 10px rgba(255,199,154,.55)':'none')+'"></div><div style="position:absolute;left:80px;top:30px;font:700 30px/1 PM;color:'+(on?'#ffc79a':'#6d6d74')+'">'+w[0]+'</div>')});
 // arrow from lamp up to the blank
 el(f,'left:0;top:0;width:1080px;height:1920px;pointer-events:none','<svg width="1080" height="1920"><path d="M530 822 C 540 760, 720 760, 732 690" fill="none" stroke="#e8432e" stroke-width="6" stroke-dasharray="14 10"/><path d="M718 700 L732 672 L748 702 Z" fill="#e8432e"/></svg>');
 // poet
 el(f,'left:110px;top:800px;width:300px;height:380px',HUM.sit5.replace('<svg ','<svg width="300" height="380" '));
 el(f,'left:150px;top:1188px;width:768px;display:flex;gap:10px;align-items:center','<div class="chip" style="position:relative;display:flex;align-items:center;gap:10px"><span style="width:34px;height:24px;color:#17171a;display:inline-block">'+ANTH.replace('<svg ','<svg width="34" height="24" ')+'</span>ANTHROPIC RESEARCH · MAR 2025 · CLAUDE 3.5 HAIKU</div>');
 el(f,'left:150px;top:1252px;font:600 15px/1 PM;letter-spacing:.06em;color:#6b6b70','Their method sees only a fraction of the computation.');
 stick(f,'cap9');
})();
</script>`;
fs.writeFileSync(new URL('./mock.html', import.meta.url), html);
const srv = await serveDir(new URL('../', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/mock/mock.html'); await p.waitForTimeout(1500);
for (const id of ['s1', 's2', 's6', 's9']) await (await p.$('#' + id)).screenshot({ path: new URL(`./${id}.png`, import.meta.url).pathname });
await b.close(); await srv.close(); console.log('ok');
