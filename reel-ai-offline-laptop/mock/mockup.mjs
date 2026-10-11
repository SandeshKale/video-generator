// THROWAWAY mockup (delete once the full build supersedes it): 3 scenes, 3 families, "Airplane Mode" identity.
import fs from 'node:fs';
import { chromium } from 'playwright';
import { serveDir } from '../../scripts/static-server.mjs';
const hasBg = fs.existsSync(new URL('../shots/runway.jpg', import.meta.url));
const html = `<!doctype html><meta charset="utf8"><style>
@font-face{font-family:UB;font-weight:900;src:url('../site/fonts/unbounded-latin-900-normal.woff2')}
@font-face{font-family:UB;font-weight:800;src:url('../site/fonts/unbounded-latin-800-normal.woff2')}
@font-face{font-family:SM;font-weight:700;src:url('../site/fonts/space-mono-latin-700-normal.woff2')}
@font-face{font-family:SM;font-weight:400;src:url('../site/fonts/space-mono-latin-400-normal.woff2')}
@font-face{font-family:IN;font-weight:700;src:url('../site/fonts/inter-latin-700-normal.woff2')}
:root{--rw:#15181b;--cr:#f4ecd8;--te:#19c2b4;--co:#ff5a45;--am:#ffbf3c}
*{box-sizing:border-box;margin:0}body{background:#222}
.f{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--rw);font-family:IN;color:var(--cr);margin-bottom:20px}
.bg{position:absolute;inset:0;background:${hasBg ? "url(../shots/runway.jpg) center/cover" : "linear-gradient(180deg,#0b1316 0,#15181b 45%,#101214)"}}
.run{position:absolute;left:0;right:0;top:620px;height:1300px;perspective:700px;overflow:hidden}
.run i{position:absolute;left:50%;width:80px;margin-left:-40px;height:1700px;top:-300px;transform-origin:50% 0;transform:rotateX(66deg);background:repeating-linear-gradient(180deg,rgba(244,236,216,.75) 0 80px,transparent 80px 190px)}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(21,24,27,.82) 0,rgba(21,24,27,.2) 28%,rgba(21,24,27,.25) 62%,rgba(21,24,27,.9) 100%)}
.eb{position:absolute;left:150px;top:166px;background:var(--cr);color:var(--rw);font:700 24px/1 SM;letter-spacing:.06em;padding:13px 26px 13px 22px;border-radius:8px;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,.45)}
.eb:before,.eb:after{content:"";position:absolute;top:50%;width:18px;height:18px;margin-top:-9px;border-radius:50%;background:var(--rw)}.eb:before{left:-9px}.eb:after{right:-9px}
.h{position:absolute;font:900 96px/1 UB;letter-spacing:-.02em;white-space:nowrap;text-shadow:0 8px 26px rgba(0,0,0,.6)}
.cap{position:absolute;left:90px;right:90px;top:1316px;text-align:center;font:700 52px/1.12 IN;background:var(--rw);padding:18px 26px;border-radius:14px;border:3px solid rgba(244,236,216,.22);border-bottom:8px solid var(--te)}.cap b{color:var(--te)}
.tag{position:absolute;font:700 18px/1 SM;letter-spacing:.1em;background:rgba(21,24,27,.9);padding:8px 12px;border-radius:5px;white-space:nowrap}
.pass{position:absolute;background:var(--cr);color:var(--rw);border-radius:18px;box-shadow:0 22px 50px rgba(0,0,0,.55);overflow:hidden}
.pass .st{height:44px;background:var(--te);color:var(--rw);font:700 17px/44px SM;letter-spacing:.12em;padding:0 16px;display:flex;justify-content:space-between}
.pass .bc{position:absolute;left:12px;right:12px;bottom:10px;height:20px;background:repeating-linear-gradient(90deg,var(--rw) 0 2px,transparent 2px 5px,var(--rw) 5px 6px,transparent 6px 9px)}
.term{position:absolute;background:#0b0d0e;border:3px solid #2c3236;border-radius:14px;box-shadow:0 24px 50px rgba(0,0,0,.6);overflow:hidden}
.term .tb{height:42px;background:#1c2125;font:700 18px/42px SM;color:#8d979c;padding:0 16px;letter-spacing:.04em}
.mono{font-family:SM;font-weight:700}
</style><body><div class="f" id="s1"></div><div class="f" id="s5"></div><div class="f" id="s7"></div>
<script src="../site/mocap.js"></script><script src="../site/rig.js"></script><script src="../site/hum.js"></script><script>
function el(p,css,h,c){var d=document.createElement('div');d.style.cssText='position:absolute;'+(css||'');if(c)d.className=c;if(h!=null)d.innerHTML=h;p.appendChild(d);return d}
function bg(f,run){el(f,'','', 'bg');if(run){var r=el(f,'','', 'run');var a=el(r,'','');a.outerHTML='';var i=document.createElement('i');r.appendChild(i)}el(f,'','', 'scrim')}
function wifi(f,css,bars,off){var s='<svg width="200" height="150" viewBox="0 0 200 150">';for(var i=0;i<4;i++){var on=i<bars;s+='<rect x="'+(18+i*42)+'" y="'+(110-i*26-18)+'" width="28" height="'+(18+i*26)+'" rx="5" fill="'+(on?'#19c2b4':'#3a4247')+'"/>'}if(off)s+='<line x1="10" y1="140" x2="190" y2="10" stroke="#ff5a45" stroke-width="12" stroke-linecap="round"/>';s+='</svg>';return el(f,css,s)}
function sw(f,css,on){var c=on?'#19c2b4':'#3a4247';return el(f,css,'<div style="width:190px;height:84px;border-radius:42px;background:'+c+';position:relative;box-shadow:inset 0 0 0 4px rgba(0,0,0,.25)"><div style="position:absolute;top:8px;'+(on?'right:8px':'left:8px')+';width:68px;height:68px;border-radius:50%;background:#f4ecd8;display:flex;align-items:center;justify-content:center"><svg width="40" height="40" viewBox="0 0 24 24" fill="#15181b"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg></div></div><div class="mono" style="font-size:20px;margin-top:8px;letter-spacing:.1em;color:'+c+'">AIRPLANE MODE '+(on?'ON':'OFF')+'</div>')}
function host(f,css,lab){var h=el(f,css,'<div class="st"><span>PASSENGER</span><span>'+lab+'</span></div><div style="height:calc(100% - 44px);background:url(../site/profile.jpg) center 28%/cover"></div><div class="bc"></div>','pass');return h}
// ================= SCENE 1 =================
(function(){var f=document.getElementById('s1');bg(f,true);el(f,'', '// WI-FI OFF, AI ON','eb');
 el(f,'left:150px;top:236px','WI-FI OFF.','h').style.fontSize='88px';var a=el(f,'left:150px;top:340px;color:var(--te)','AI ON.','h');a.style.fontSize='88px';
 el(f,'left:60px;top:420px;width:760px;height:680px;background:url(../site/3d/laptop.png) center/contain no-repeat;filter:drop-shadow(0 30px 24px rgba(0,0,0,.55))');
 el(f,'left:140px;top:1000px;width:520px;height:90px;background:radial-gradient(ellipse,rgba(25,194,180,.45),transparent 70%);filter:blur(10px)');
 wifi(f,'left:770px;top:150px;transform:scale(.8);transform-origin:0 0',0,true);sw(f,'left:150px;top:1090px',true);
 host(f,'left:618px;top:914px;width:300px;height:360px','GATE 1');el(f,'left:150px;top:1252px','ILLUSTRATIVE · 3D RENDER','tag');el(f,'','','cap').innerHTML='Here\\'s an AI that still answers when <b>the Wi-Fi is off.</b>';
})();
// ================= SCENE 5 =================
(function(){var f=document.getElementById('s5');bg(f,true);el(f,'', '// STEP 2 · WILL IT FIT?','eb');
 el(f,'left:150px;top:232px','WILL IT','h').style.fontSize='92px';el(f,'left:150px;top:336px;color:var(--te)','FIT?','h').style.fontSize='92px';
 var trk=el(f,'left:640px;top:240px;width:278px;display:flex;gap:8px','', '');['1','2','3'].forEach(function(n,i){el(trk,'position:relative;flex:1;height:86px;background:'+(i==1?'#19c2b4':'#1e2428')+';color:'+(i==1?'#15181b':'#6c777c')+';font:900 54px/86px UB;text-align:center;border-radius:8px;border-bottom:6px solid rgba(0,0,0,.35)',n)});
 var S=12; [['8 GB',8,[['gemma4:e2b','7.5',7.5,1]]],['16 GB',16,[['gpt-oss:20b','14',14,1]]],['24 GB',24,[['gemma4:31b','20',20,1]]]].forEach(function(b,i){var x=150+i*262,h=b[1]*S+30,top=900-h;
  el(f,'left:'+x+'px;top:'+top+'px;width:234px;height:'+h+'px;border:5px solid #f4ecd8;border-top:none;border-radius:0 0 14px 14px;background:rgba(244,236,216,.06)');
  el(f,'left:'+x+'px;top:'+(top-44)+'px;font:900 34px/1 UB;color:#f4ecd8',b[0]);
  var y=900;b[2].forEach(function(c){var ch=c[2]*S;y-=ch;el(f,'left:'+(x+10)+'px;top:'+y+'px;width:214px;height:'+(ch-4)+'px;background:#19c2b4;color:#15181b;border-radius:6px;font:700 20px/1.25 SM;padding:8px 10px;box-shadow:0 8px 16px rgba(0,0,0,.4)','<div>'+c[0]+'</div><div style="font-size:30px">'+c[1]+' GB</div>')});});
 el(f,'left:150px;top:925px;width:480px;background:rgba(255,90,69,.15);border:3px dashed #ff5a45;border-radius:12px;padding:12px 16px;font:700 22px/1.3 SM;color:#ff5a45','gpt-oss:120b · 65 GB<br><span style="color:#f4ecd8">fits none of these</span>');
 [[560,1150,.6],[330,1190,.74]].forEach(function(c,i){var P=RIG.sample('walk',i*.6,{loop:true,inplace:true}),sc=c[2];var g=el(f,'left:'+(c[0]-250*sc)+'px;top:'+(c[1]-430*sc)+'px;width:'+(520*sc)+'px;height:'+(480*sc)+'px');var mx=(P.hL[0]+P.hR[0])/2+10,my=-(P.hL[1]+P.hR[1])/2-8;g.innerHTML='<svg width="'+(520*sc)+'" height="'+(480*sc)+'" viewBox="-260 -430 520 480">'+RIG.svg(P,'robot',{pal:{body:'#f4ecd8',back:'#9a948a',edge:'#15181b',joint:'#19c2b4',inner:'#ffbf3c'}})+'<g transform="translate('+mx+','+my+')"><rect x="-60" y="-44" width="120" height="88" rx="6" fill="#ffbf3c" stroke="#15181b" stroke-width="6"/><text x="0" y="-8" font-family="SM" font-weight="700" font-size="15" text-anchor="middle" fill="#15181b">'+(i?'gemma4:e4b':'gpt-oss:20b')+'</text><text x="0" y="26" font-family="UB" font-weight="900" font-size="28" text-anchor="middle" fill="#15181b">'+(i?'9.5':'14')+' GB</text></g></svg>'});
 host(f,'left:668px;top:944px;width:250px;height:300px','GATE 2');
 el(f,'left:150px;top:1252px','ILLUSTRATIVE · SIZES FROM OLLAMA.COM','tag');el(f,'','','cap').innerHTML='Got sixteen gigs of RAM? Run <b>G-P-T O-S-S,</b> twenty B.';
})();
// ================= SCENE 7 =================
(function(){var f=document.getElementById('s7');bg(f,true);el(f,'', '// STEP 3 · WI-FI OFF','eb');
 el(f,'left:150px;top:236px','STILL','h').style.fontSize='92px';el(f,'left:150px;top:340px;color:var(--te)','ANSWERS.','h').style.fontSize='92px';
 var t=el(f,'left:150px;top:480px;width:768px;height:440px','<div class="tb">terminal — ollama run gpt-oss:20b</div><div class="mono" style="padding:18px 22px;font-size:26px;line-height:1.45"><div style="color:#8d979c">>>> Explain DNS like I\\'m ten</div><div style="margin-top:14px;color:#f4ecd8">DNS is the internet\\'s phonebook. You type a name, and DNS looks up the number so your computer knows where to call<span style="color:#19c2b4">▌</span></div></div><div class="mono" style="position:absolute;left:22px;bottom:14px;font-size:16px;color:#6c777c;letter-spacing:.1em">STREAMING · ILLUSTRATIVE OUTPUT</div>','term');
 wifi(f,'left:150px;top:960px;transform:scale(.8);transform-origin:0 0',0,true);sw(f,'left:360px;top:960px',true);
 el(f,'left:150px;top:1090px;display:flex;gap:12px;opacity:.8','<svg width="90" height="60" viewBox="0 0 24 24" fill="none" stroke="#5b656a" stroke-width="2" stroke-linecap="round"><path d="M7 18a4 4 0 0 1-.9-7.9A5 5 0 0 1 16 9a4.5 4.5 0 0 1 1 9z"/></svg><div class="mono" style="font-size:20px;color:#5b656a;line-height:60px;letter-spacing:.08em">CLOUD · NOT USED</div>');
 host(f,'left:618px;top:914px;width:300px;height:360px','WI-FI OFF');
 el(f,'left:628px;top:960px;background:#ff5a45;color:#15181b;font:700 16px/1 SM;padding:6px 8px;border-radius:4px;letter-spacing:.08em','NO SIGNAL');
 el(f,'left:150px;top:1252px','ILLUSTRATIVE OUTPUT','tag');el(f,'','','cap').innerHTML='Turn the Wi-Fi off. <b>Ask it anything.</b>';
})();
</script>`;
fs.writeFileSync(new URL('./mock.html', import.meta.url), html);
const srv = await serveDir(new URL('../', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(srv.url + '/mock/mock.html'); await p.waitForTimeout(1500);
for (const id of ['s1', 's5', 's7']) await (await p.$('#' + id)).screenshot({ path: new URL(`./${id}.png`, import.meta.url).pathname });
await b.close(); await srv.close(); console.log('ok');
