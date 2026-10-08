// Throwaway mockup (delete once the full build supersedes it): "Studio Slate" visual system, 3 sample scenes. Poses are hand-placed joints; the real build drives the same rig from BVH clips.
import { readFileSync, writeFileSync } from 'node:fs';
const icon = (n) => [...readFileSync(new URL(`../assets/icons/tabler/${n}.svg`, import.meta.url), 'utf8').matchAll(/<path[^>]*\/>/g)].map((m) => m[0].replace(/ stroke="none"/g, '')).filter((p) => !/M0 0h24v24H0z/.test(p)).join('');
const ic = (n, s = 40, c = 'currentColor', sw = 1.8) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${icon(n)}</svg>`;
// ---- one rig, two skins ----  joints in a 300x400 box
const P = {
  cartwheel: { head: [140, 338], neck: [140, 302], hip: [140, 190], sL: [116, 300], sR: [164, 300], eL: [108, 332], eR: [172, 332], hL: [100, 366], hR: [180, 366], kL: [92, 128], kR: [188, 128], fL: [58, 58], fR: [222, 58] },
  kick: { head: [128, 70], neck: [128, 104], hip: [124, 214], sL: [104, 112], sR: [152, 112], eL: [66, 138], eR: [196, 100], hL: [34, 118], hR: [236, 82], kL: [118, 292], kR: [206, 196], fL: [112, 380], fR: [284, 176] },
  walk: { head: [150, 60], neck: [150, 96], hip: [146, 214], sL: [130, 104], sR: [170, 104], eL: [112, 160], eR: [190, 156], hL: [100, 214], hR: [204, 206], kL: [120, 296], kR: [182, 290], fL: [96, 378], fR: [216, 372] },
  star: { head: [150, 60], neck: [150, 96], hip: [150, 214], sL: [128, 104], sR: [172, 104], eL: [102, 66], eR: [198, 66], hL: [70, 26], hR: [230, 26], kL: [112, 300], kR: [188, 300], fL: [78, 396], fR: [222, 396] },
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

const rot = (pose, skin, s, deg, op = 1, extra = '') => `<div style="position:absolute;${extra};transform:rotate(${deg}deg);transform-origin:50% 50%;opacity:${op}">${figure(pose, skin, s, 1)}</div>`;
const eb = (t) => `<div class="eb"><i></i>${t}</div>`, cap = (h) => `<div class="cap"><div>${h}</div></div>`;
const FL = `<div class="floor"></div>`;
// scene 1: cartwheel twin lanes with onion skin
const frames = (skin, y, label, delay) => [0, 1, 2, 3, 4].map((i) => rot('star', skin, .40, i * 72, .25 + i * .19, `left:${24 + i * 146 + delay}px;top:${y + 10}px`)).join('') + `<div class="lab" style="position:absolute;left:20px;top:${y - 26}px;font-size:18px">${label}</div>`;
const trail = (y) => `<svg style="position:absolute;left:0;top:${y}px" width="768" height="120"><path d="M70 100 Q 220 -20 360 100 T 690 100" fill="none" stroke="#ff3d7f" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/></svg>`;
const dust = (x, y) => [0, 1, 2].map((k) => `<i style="position:absolute;left:${x + k * 16}px;top:${y - k * 6}px;width:${26 - k * 6}px;height:${26 - k * 6}px;border-radius:50%;background:#cfd5db;opacity:${.8 - k * .2}"></i>`).join('');
const s1 = `<div class="pg on" id="p1">${eb('A human did it first')}
<div class="h">It learned<br>a <em>cartwheel</em><br>from a human</div>
<div class="card" style="left:150px;top:560px;width:768px;height:600px">${FL}
 ${frames('human', 80, 'human · mocap suit', 0)}${trail(120)}${dust(40, 292)}${dust(600, 292)}
 ${frames('robot', 330, 'robot · same clip, half a second later', 0)}${trail(370)}${dust(40, 542)}
 <div style="position:absolute;right:16px;top:20px;display:flex;gap:6px">${[0, 1, 2].map(() => '<i style="width:30px;height:5px;background:#101426;display:block;margin-top:9px"></i>').join('')}</div>
 </div>
<div class="chip y" style="left:150px;top:1190px">Same clip · two bodies</div>
${cap('This robot just did a <b>cartwheel.</b>')}</div>`;
// scene 2 capture volume
const cam = (x, y, flip) => `<div style="position:absolute;left:${x}px;top:${y}px;color:#101426">${ic('camera', 64, '#101426', 1.7)}</div>`;
const beam = (x1, y1) => `<polygon points="${x1},${y1} 330,300 440,330" fill="rgba(58,168,255,.13)"/>`;
const skel = (pose, s, ox, oy) => { const p = P[pose]; const L = (a, b) => `<line x1="${(p[a][0] * s + ox).toFixed(0)}" y1="${(p[a][1] * s + oy).toFixed(0)}" x2="${(p[b][0] * s + ox).toFixed(0)}" y2="${(p[b][1] * s + oy).toFixed(0)}" stroke="#3aa8ff" stroke-width="4" stroke-linecap="round"/>`; return [['neck', 'hip'], ['sL', 'sR'], ['sL', 'eL'], ['eL', 'hL'], ['sR', 'eR'], ['eR', 'hR'], ['hip', 'kL'], ['kL', 'fL'], ['hip', 'kR'], ['kR', 'fR']].map(([a, b]) => L(a, b)).join(''); };
const tape = ['Hips   0.00  91.4  0.00', 'Chest  3.1  12.0  -4.2', 'LArm  -41.2  8.8  2.0', 'RArm   38.7 -9.1  1.1', 'LLeg  12.4  0.0  -3.3', 'RLeg -18.2  0.0   2.8', 'Head   2.2  -1.0  0.4'].map((r, i) => `<div style="font:700 17px 'SM';color:${i === 3 ? '#ff3d7f' : '#101426'};opacity:${1 - i * .1};white-space:nowrap">${r}</div>`).join('');
const s2 = `<div class="pg" id="p2">${eb('Suited up for 2.5 hours')}
<div class="h">Every move,<br><em>recorded</em></div>
<div class="card" style="left:150px;top:480px;width:768px;height:680px">${FL}
 <svg style="position:absolute;left:0;top:0" width="768" height="680">${beam(70, 70)}${beam(70, 70).replace('330,300 440,330', '330,300 440,330')}<polygon points="690,70 420,330 330,300" fill="rgba(58,168,255,.12)"/><polygon points="70,610 330,420 440,470" fill="rgba(58,168,255,.10)"/><polygon points="690,610 440,420 330,470" fill="rgba(58,168,255,.10)"/>${skel('walk', 1.0, 235, 130)}</svg>
 ${cam(20, 20)}${cam(684, 20)}${cam(20, 590)}${cam(684, 590)}
 <div style="position:absolute;left:235px;top:130px;opacity:.96">${figure('walk', 'human', 1.0)}</div>
 <div style="position:absolute;left:16px;top:300px;padding:10px 12px;background:rgba(255,255,255,.92);border:3px solid #101426;border-radius:12px;line-height:1.35">${tape}</div>
 <div class="chip y" style="left:540px;top:300px;font-size:18px">≈ 2.5 HRS</div>
 </div>
<div class="chip" style="left:150px;top:1190px;font-size:19px">walk</div><div class="chip" style="left:260px;top:1190px;font-size:19px">run</div><div class="chip" style="left:355px;top:1190px;font-size:19px">dance</div><div class="chip y" style="left:480px;top:1190px;font-size:19px">martial arts</div><div class="chip p" style="left:690px;top:1190px;font-size:19px">cartwheel</div>
${cap('Walking, running, dancing, martial arts, <b>cartwheels.</b>')}</div>`;
// scene 8 slip
const sx = [20, 150, 290, 450, 600];
const slip = [[0, 1], [-14, .9], [-38, .8], [-70, .6], [-96, .45]].map(([deg, op], i) => rot('walk', 'robot', .46, deg, op, `left:${sx[i]}px;top:${150 + i * 20}px`)).join('');
const wet = `<svg style="position:absolute;left:285px;top:330px" width="150" height="150" viewBox="0 0 150 150"><polygon points="75,12 140,136 10,136" fill="#ffd23f" stroke="#101426" stroke-width="7" stroke-linejoin="round"/><circle cx="75" cy="52" r="9" fill="#101426"/><path d="M52 92 q12 -22 23 0 q12 22 23 0" fill="none" stroke="#101426" stroke-width="7" stroke-linecap="round"/></svg>`;
const streak = [0, 1, 2].map((k) => `<i style="position:absolute;left:${60 + k * 30}px;top:${400 + k * 14}px;width:${180 - k * 40}px;height:5px;background:#101426;opacity:${.5 - k * .12};display:block"></i>`).join('');
const s8 = `<div class="pg" id="p8">${eb('Flat floors only')}
<div class="h">The catch:<br><em>flat</em> floors</div>
<div class="card" style="left:150px;top:480px;width:768px;height:620px">${FL}<div class="lab" style="position:absolute;left:20px;top:18px;font-size:18px">robot meets wet floor</div>
 ${slip}${wet}${streak}
 <svg style="position:absolute;left:0;top:300px" width="768" height="300"><path d="M40 190 Q 300 170 700 230" fill="none" stroke="#ff3d7f" stroke-width="5" stroke-dasharray="3 12" stroke-linecap="round"/></svg></div>
<div class="chip p" style="left:150px;top:1140px">non-slippery only</div><div class="chip" style="left:470px;top:1140px">nothing unseen</div>
${cap('Flat, non-slippery floors only, and <b>nothing it hasn’t seen.</b>')}</div>`;
writeFileSync(new URL('./mockup.html', import.meta.url), `<!doctype html><html><head><meta charset="utf8"><style>${css}</style></head><body><div id="w">${s1}${s2}${s8}</div><script>var q=new URLSearchParams(location.search).get('s')||'1';document.querySelectorAll('.pg').forEach(function(p){p.classList.toggle('on',p.id==='p'+q);});</script></body></html>`);
console.log('mockup.html');
