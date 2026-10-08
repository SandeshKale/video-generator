// Throwaway mockup (delete once the full build supersedes it): "Studio Slate" visual system, 3 sample scenes. Poses are hand-placed joints; the real build drives the same rig from BVH clips.
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ic = (n, s = 40, c = 'currentColor', sw = 1.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icon(n)}</svg>`;
// ---- one rig, two skins ----  joints in a 300x400 box
const P = {
  cartwheel: { head: [140, 338], neck: [140, 302], hip: [140, 190], sL: [116, 300], sR: [164, 300], eL: [108, 332], eR: [172, 332], hL: [100, 366], hR: [180, 366], kL: [92, 128], kR: [188, 128], fL: [58, 58], fR: [222, 58] },
  kick: { head: [128, 70], neck: [128, 104], hip: [124, 214], sL: [104, 112], sR: [152, 112], eL: [66, 138], eR: [196, 100], hL: [34, 118], hR: [236, 82], kL: [118, 292], kR: [206, 196], fL: [112, 380], fR: [284, 176] },
  walk: { head: [150, 60], neck: [150, 96], hip: [146, 214], sL: [130, 104], sR: [170, 104], eL: [112, 160], eR: [190, 156], hL: [100, 214], hR: [204, 206], kL: [120, 296], kR: [182, 290], fL: [96, 378], fR: [216, 372] },
  run: { head: [168, 64], neck: [160, 98], hip: [140, 210], sL: [144, 104], sR: [178, 108], eL: [96, 138], eR: [214, 150], hL: [64, 100], hR: [250, 130], kL: [196, 262], kR: [92, 290], fL: [176, 352], fR: [30, 330] },
};
const INK = '#101426', PINK = '#ff3d7f', YEL = '#ffd23f', SKY = '#3aa8ff';
function figure(pose, skin = 'human', s = 1, op = 1) {
  const p = P[pose], L = (a, b, w, c) => `<line x1="${p[a][0]}" y1="${p[a][1]}" x2="${p[b][0]}" y2="${p[b][1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const human = skin === 'human', body = human ? INK : '#c9d2da', edge = human ? INK : '#7d8a96';
  const limbs = [['sL', 'eL'], ['eL', 'hL'], ['hip', 'kL'], ['kL', 'fL'], ['hip', 'kR'], ['kR', 'fR'], ['sR', 'eR'], ['eR', 'hR']];
  const back = limbs.filter((_, i) => [0, 1, 2, 3].includes(i)).map(([a, b]) => L(a, b, human ? 24 : 22, human ? '#2a3050' : '#9aa6b1')).join('');
  const front = limbs.filter((_, i) => i >= 4).map(([a, b]) => L(a, b, human ? 26 : 24, body)).join('');
  const torso = `<line x1="${p.neck[0]}" y1="${p.neck[1]}" x2="${p.hip[0]}" y2="${p.hip[1]}" stroke="${body}" stroke-width="${human ? 48 : 46}" stroke-linecap="round"/>` + `<line x1="${p.sL[0]}" y1="${p.sL[1]}" x2="${p.sR[0]}" y2="${p.sR[1]}" stroke="${body}" stroke-width="26" stroke-linecap="round"/>`;
  const joints = ['sL', 'sR', 'eL', 'eR', 'hL', 'hR', 'hip', 'kL', 'kR', 'fL', 'fR', 'neck'];
  const dots = joints.map((j) => human ? `<circle cx="${p[j][0]}" cy="${p[j][1]}" r="${j === 'hip' ? 8 : 6}" fill="${j === 'hip' ? PINK : '#fff'}" stroke="${INK}" stroke-width="2"/>` : `<circle cx="${p[j][0]}" cy="${p[j][1]}" r="9" fill="${YEL}" stroke="${edge}" stroke-width="3"/>`).join('');
  const hd = human ? `<circle cx="${p.head[0]}" cy="${p.head[1]}" r="32" fill="${INK}" stroke="#fff" stroke-width="5"/><circle cx="${p.head[0] + 14}" cy="${p.head[1] - 6}" r="6" fill="#fff"/>` : `<rect x="${p.head[0] - 34}" y="${p.head[1] - 28}" width="68" height="56" rx="20" fill="#e3e8ec" stroke="${edge}" stroke-width="4"/><rect x="${p.head[0] - 24}" y="${p.head[1] - 10}" width="48" height="18" rx="9" fill="${INK}"/><rect x="${p.head[0] - 12}" y="${p.head[1] - 5}" width="24" height="8" rx="4" fill="${SKY}"/>`;
  return `<svg viewBox="0 0 300 420" width="${300 * s}" height="${420 * s}" style="opacity:${op}">${back}${torso}${front}${hd}${dots}</svg>`;
}
const css = `
@font-face{font-family:'OU';font-weight:800;src:url('../assets/fonts/outfit/outfit-latin-800-normal.woff2');font-display:block}
@font-face{font-family:'IN';font-weight:700;src:url('../assets/fonts/inter/inter-latin-700-normal.woff2');font-display:block}
@font-face{font-family:'SM';font-weight:700;src:url('../assets/fonts/space-mono/space-mono-latin-700-normal.woff2');font-display:block}
:root{--ink:#101426;--pink:#ff3d7f;--yel:#ffd23f;--sky:#3aa8ff;--bg:#e9ecef}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--bg);font-family:'IN',sans-serif;color:var(--ink)}
#w{position:absolute;inset:0;background:radial-gradient(900px 600px at 20% 0%,#fff 0%,transparent 70%),radial-gradient(circle,#cfd5db 1.6px,transparent 1.7px) 0 0/36px 36px,var(--bg)}
.pg{position:absolute;inset:0;display:none}.pg.on{display:block}
.eb{position:absolute;left:150px;top:176px;font:700 24px 'SM';letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.eb i{display:inline-block;width:18px;height:18px;background:var(--pink);margin-right:12px;vertical-align:-2px}
.h{position:absolute;left:150px;top:222px;font:800 100px/1.0 'OU';letter-spacing:-.035em;text-transform:uppercase;white-space:nowrap}
.h em{font-style:normal;background:var(--yel);padding:0 14px;margin:0 -4px;box-shadow:6px 6px 0 var(--ink)}
.card{position:absolute;background:#fff;border:4px solid var(--ink);border-radius:22px;box-shadow:10px 10px 0 var(--ink);overflow:hidden}
.floor{position:absolute;left:0;right:0;bottom:0;height:230px;background:repeating-linear-gradient(90deg,rgba(16,20,38,.14) 0 2px,transparent 2px 60px),repeating-linear-gradient(0deg,rgba(16,20,38,.14) 0 2px,transparent 2px 46px),linear-gradient(180deg,#dfe4e9,#f4f6f8);transform-origin:50% 100%}
.lab{font:700 20px 'SM';letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
.chip{position:absolute;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:3px solid var(--ink);border-radius:12px;background:#fff;box-shadow:5px 5px 0 var(--ink);font:700 21px 'SM';letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.chip.y{background:var(--yel)}.chip.p{background:var(--pink);color:#fff}
.stamp{position:absolute;border:6px solid var(--pink);color:var(--pink);background:rgba(255,255,255,.94);font:800 60px/1 'OU';text-transform:uppercase;padding:6px 20px;white-space:nowrap;box-shadow:6px 6px 0 var(--ink);transform:rotate(-6deg)}
.cap{position:absolute;left:150px;right:162px;top:1340px;display:flex;justify-content:center}
.cap div{background:var(--ink);border:3px solid #fff;border-radius:22px;padding:20px 26px;font:700 46px/1.18 'IN';text-align:center;color:#f5f7fa;box-shadow:6px 6px 0 rgba(16,20,38,.35)}
.cap b{color:var(--yel)}
`;
const eb = (t) => `<div class="eb"><i></i>${t}</div>`, cap = (h) => `<div class="cap"><div>${h}</div></div>`;
// scene 1
const s1 = `<div class="pg on" id="p1">${eb('2.5 hours of human motion')}
<div class="h">It learned<br>a <em>cartwheel</em><br>from a human</div>
<div class="card" style="left:150px;top:560px;width:768px;height:560px"><div class="floor"></div>
 <div style="position:absolute;left:-6px;top:80px">${figure('cartwheel', 'human', .92)}</div>
 <div style="position:absolute;left:500px;top:80px">${figure('cartwheel', 'robot', .92)}</div>
 <div class="lab" style="position:absolute;left:26px;top:20px">Human · mocap suit</div><div class="lab" style="position:absolute;right:24px;top:20px">Robot · same moves</div>
 </div>
<div class="stamp" style="left:372px;top:700px;font-size:44px;text-align:center;line-height:1.05">2.5 HRS<br>OF MOCAP</div>
<div class="card" style="left:150px;top:1150px;width:768px;height:104px;border-radius:18px;box-shadow:8px 8px 0 var(--ink)">
 <div class="lab" style="position:absolute;left:22px;top:16px">BVH · clip 04 · cartwheel</div>
 <div style="position:absolute;left:22px;top:60px;width:724px;height:10px;background:#dfe4e9;border-radius:5px"></div><div style="position:absolute;left:22px;top:60px;width:420px;height:10px;background:var(--pink);border-radius:5px"></div>
 ${[0, 90, 180, 270, 360, 450, 540, 630, 720].map((x) => `<i style="position:absolute;left:${x + 18}px;top:52px;width:14px;height:14px;background:var(--yel);border:3px solid var(--ink);transform:rotate(45deg)"></i>`).join('')}
 <div style="position:absolute;left:432px;top:44px;width:6px;height:44px;background:var(--ink)"></div></div>
${cap('This robot just did a <b>cartwheel.</b>')}</div>`;
// scene 4 : latent grid
const cells = ['walk', 'run', 'kick', 'cartwheel', 'run', 'walk', 'kick', 'cartwheel', 'kick', 'cartwheel', 'walk', 'run'];
const pickIdx = [1, 6, 7, 9];
const grid = cells.map((p, i) => { const x = 22 + (i % 4) * 180, y = 56 + Math.floor(i / 4) * 186; const on = pickIdx.includes(i); return `<div style="position:absolute;left:${x}px;top:${y}px;width:166px;height:170px;border:3px solid ${on ? '#ff3d7f' : '#101426'};border-radius:14px;background:${on ? '#fff0f5' : '#f4f6f8'};overflow:hidden"><div style="position:absolute;left:34px;top:6px">${figure(p, 'human', .36)}</div></div>`; }).join('');
const pts = pickIdx.map((i) => [22 + (i % 4) * 180 + 83, 56 + Math.floor(i / 4) * 186 + 85]);
const s4 = `<div class="pg" id="p4">${eb('A vocabulary of moves')}
<div class="h">Moves<br>become a <em>code</em></div>
<div class="card" style="left:150px;top:480px;width:768px;height:664px"><div class="lab" style="position:absolute;left:22px;top:16px">latent space · 12 of ∞ moves</div>${grid}
 <svg style="position:absolute;left:0;top:0" width="768" height="640"><polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#ff3d7f" stroke-width="7" stroke-dasharray="4 14" stroke-linecap="round"/>${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="11" fill="#ffd23f" stroke="#101426" stroke-width="4"/>`).join('')}</svg>
 <div style="position:absolute;left:22px;top:612px" class="lab">path planned by a diffusion model →</div></div>
<div class="chip y" style="left:150px;top:1184px">VAE · compact code</div><div class="chip" style="left:470px;top:1184px">Diffusion · plans moves</div>
${cap('Sprints. Spin kicks. Aerial <b>cartwheels.</b>')}</div>`;
// scene 6 : ring
const ring = `<svg width="330" height="330" viewBox="0 0 330 330"><circle cx="165" cy="165" r="140" fill="none" stroke="#dfe4e9" stroke-width="34"/><circle cx="165" cy="165" r="140" fill="none" stroke="#ff3d7f" stroke-width="34" stroke-linecap="round" stroke-dasharray="${(0.708 * 2 * Math.PI * 140).toFixed(1)} 2000" transform="rotate(-90 165 165)"/></svg>`;
const ppl = Array.from({ length: 77 }, (_, i) => `<i style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#101426;margin:3px"></i>`).join('');
const s6 = `<div class="pg" id="p6">${eb('70.8% more human-like')}
<div class="h">Does it look<br><em>human?</em></div>
<div class="card" style="left:150px;top:480px;width:768px;height:600px">
 <div style="position:absolute;left:219px;top:30px">${ring}<div style="position:absolute;left:0;right:0;top:100px;text-align:center;font:800 100px/1 'OU';letter-spacing:-.04em">70.8%</div><div class="lab" style="position:absolute;left:0;right:0;top:204px;text-align:center;font-size:17px">of comparisons</div></div>
 <div style="position:absolute;left:12px;top:100px">${figure('walk', 'robot', .55)}</div><div class="lab" style="position:absolute;left:14px;top:350px;font-size:16px">standard controller</div>
 <div style="position:absolute;left:556px;top:100px">${figure('run', 'robot', .55)}</div><div class="lab" style="position:absolute;left:560px;top:350px;font-size:16px;color:#ff3d7f">beyondmimic</div>
 <div class="lab" style="position:absolute;left:24px;top:392px">77 people · walking + running</div>
 <div style="position:absolute;left:20px;top:432px;width:728px;line-height:0">${ppl}</div></div>
<div class="chip y" style="left:150px;top:1130px">Walking + running vs Unitree’s standard controller</div>
${cap('In 70.8% of comparisons, it looked <b>more natural.</b>')}</div>`;
writeFileSync(new URL('./mockup.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><style>${css}</style></head><body><div id="w">${s1}${s4}${s6}</div><script>var q=new URLSearchParams(location.search).get('s')||'1';document.querySelectorAll('.pg').forEach(function(p){p.classList.toggle('on',p.id==='p'+q);});</script></body></html>`);
console.log('mockup.html');
