// Shared visual system + runtime for "The AI Bubble Machine" (16:9, 1920x1080).
//
// Visual identity (deliberately new vs every prior reel): aubergine ink ground
// with a drifting isometric diamond grid, cream "sticker" cards with hard
// offset shadows (neo-brutalist), mint = money flowing / coral = debt+risk,
// gold highlights, Bricolage Grotesque display type, animated coin-on-pipe
// flow lines as the signature motion. Every animation is a pure function of t.
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const A = (p) => join(ROOT, 'assets', p);
const read = (p) => readFile(p, 'utf8');

export async function tablerIcon(name) {
  const src = await read(A(`icons/tabler/${name}.svg`));
  const paths = [...src.matchAll(/<(?:path|circle|rect|line|polyline)[^>]*\/>/g)].map((m) => m[0]).join('');
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
// Brand marks keep their own colors; strips a full-bleed white background rect.
export async function logoAsIs(path) {
  const src = await read(A(path));
  const vb = src.match(/viewBox="([^"]+)"/)[1];
  let inner = src.replace(/<\?xml[^>]*\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/g, '');
  inner = inner.replace(/<path fill="#fff" d="M0 0h[\d.]+v[\d.]+H0V0z"\/>/g, '');
  return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}
export async function brandMono(path) {
  const src = await read(A(path));
  const vb = src.match(/viewBox="([^"]+)"/)[1];
  const g = src.match(/<g>([\s\S]*)<\/g>\s*<\/svg>/);
  return `<svg viewBox="${vb}" fill="currentColor">${(g ? g[1] : '').replace(/ fill="#000000"/g, '')}</svg>`;
}

export const FONT_FACES = `
@font-face{font-family:'Bricolage';font-weight:700;src:url('../../assets/fonts/bricolage-grotesque/bricolage-grotesque-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Bricolage';font-weight:800;src:url('../../assets/fonts/bricolage-grotesque/bricolage-grotesque-latin-800-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:500;src:url('../../assets/fonts/inter/inter-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:600;src:url('../../assets/fonts/inter/inter-latin-600-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Inter';font-weight:700;src:url('../../assets/fonts/inter/inter-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:500;src:url('../../assets/fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'JBMono';font-weight:700;src:url('../../assets/fonts/jetbrains-mono/jetbrains-mono-latin-700-normal.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Fraunces';font-weight:900;font-style:italic;src:url('../../assets/fonts/fraunces/fraunces-latin-900-italic.woff2') format('woff2');font-display:block;}
`;

export const BASE_CSS = `
:root{
  --ink:#130a1f; --ink2:#1e1131; --ink3:#2a1844; --cream:#f4efe6; --cream2:#cfc7ba;
  --mint:#35f2b0; --coral:#ff5d4d; --gold:#ffc53d; --violet:#8a6dff; --edge:#0c0614;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;width:1920px;height:1080px;background:var(--ink);overflow:hidden;font-family:'Inter',sans-serif;color:var(--cream);}
#world{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;background:var(--ink);}
.abs{position:absolute;}
svg{overflow:visible;}
.icon-sz{display:inline-flex;flex:0 0 auto;}
.icon-sz svg{width:100%;height:100%;}

/* ---------- background ---------- */
#bg{position:absolute;inset:0;overflow:hidden;}
#bgwash{position:absolute;inset:0;background:radial-gradient(ellipse 1500px 900px at 50% 40%, #24133d 0%, #130a1f 70%);}
#iso{position:absolute;left:-400px;top:-400px;width:2720px;height:1880px;
  background-image:
   repeating-linear-gradient(30deg, rgba(244,239,230,0.055) 0 1.5px, transparent 1.5px 74px),
   repeating-linear-gradient(150deg, rgba(244,239,230,0.055) 0 1.5px, transparent 1.5px 74px),
   repeating-linear-gradient(90deg, rgba(244,239,230,0.03) 0 1px, transparent 1px 74px);}
.glow{position:absolute;border-radius:50%;filter:blur(40px);}
#glowMint{width:1000px;height:760px;background:radial-gradient(closest-side, rgba(53,242,176,0.55), transparent);}
#glowCoral{width:1100px;height:820px;background:radial-gradient(closest-side, rgba(255,93,77,0.55), transparent);}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse 1400px 800px at 50% 48%, transparent 55%, rgba(5,2,10,0.7) 100%);}
#ambient{position:absolute;inset:0;width:1920px;height:1080px;opacity:.9;}

/* ---------- chrome ---------- */
#header{position:absolute;left:110px;top:58px;display:flex;align-items:center;gap:18px;opacity:0;}
#hdrTick{width:10px;height:56px;border-radius:5px;background:var(--mint);box-shadow:0 0 18px rgba(53,242,176,.7);}
#hdrKick{font-family:'JBMono',monospace;font-weight:700;font-size:20px;letter-spacing:.18em;color:var(--mint);}
#hdrTitle{font-family:'Bricolage',sans-serif;font-weight:800;font-size:40px;letter-spacing:-.01em;line-height:1.05;color:var(--cream);text-shadow:0 4px 14px rgba(0,0,0,.6);}
#brand{position:absolute;right:110px;top:70px;text-align:right;font-family:'JBMono',monospace;font-weight:700;font-size:17px;letter-spacing:.2em;color:var(--cream2);opacity:.8;}
#brand b{color:var(--coral);font-weight:700;}
#stage{position:absolute;left:110px;top:170px;width:1700px;height:720px;}
#cap{position:absolute;left:0;right:0;bottom:60px;display:flex;justify-content:center;opacity:0;}
#captxt{max-width:1640px;padding:14px 32px;border-radius:20px;background:rgba(14,6,24,0.78);border:2px solid rgba(244,239,230,.12);
  font-family:'Inter',sans-serif;font-weight:600;font-size:29px;line-height:1.3;text-align:center;color:var(--cream);text-shadow:0 2px 8px rgba(0,0,0,.6);}
#rail{position:absolute;left:110px;right:110px;top:1044px;height:8px;display:flex;gap:6px;}
.seg{flex:1;border-radius:4px;background:rgba(244,239,230,.12);position:relative;overflow:hidden;}
.seg i{position:absolute;left:0;top:0;bottom:0;width:0%;background:var(--mint);box-shadow:0 0 10px rgba(53,242,176,.7);}
#intro{position:absolute;inset:0;pointer-events:none;overflow:hidden;display:none;}
.iwipe{position:absolute;left:0;top:0;width:1920px;height:1080px;}
#iw1{background:var(--coral);} #iw2{background:var(--cream);}
#iText{position:absolute;left:0;top:0;width:1920px;height:1080px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;}
#iKick{font-family:'JBMono',monospace;font-weight:700;font-size:30px;letter-spacing:.3em;color:var(--coral);}
#iTitle{font-family:'Bricolage',sans-serif;font-weight:800;font-size:124px;line-height:.98;letter-spacing:-.025em;color:var(--ink);text-align:center;max-width:1560px;text-transform:uppercase;}

/* ---------- components ---------- */
.card{position:absolute;background:var(--cream);color:#1a0f26;border:4px solid var(--edge);border-radius:24px;box-shadow:9px 9px 0 var(--edge);will-change:transform,opacity;}
.card.mint{background:var(--mint);} .card.coral{background:var(--coral);} .card.gold{background:var(--gold);} .card.violet{background:var(--violet);color:#fff;}
.card.dark{background:var(--ink3);color:var(--cream);border-color:var(--cream);box-shadow:9px 9px 0 rgba(53,242,176,.95);}
.card.darkc{background:var(--ink3);color:var(--cream);border-color:var(--cream);box-shadow:9px 9px 0 rgba(255,93,77,.95);}
.lbl{font-family:'JBMono',monospace;font-weight:700;letter-spacing:.14em;text-transform:uppercase;}
.big{font-family:'Bricolage',sans-serif;font-weight:800;letter-spacing:-.03em;line-height:.95;}
.h2{font-family:'Bricolage',sans-serif;font-weight:800;letter-spacing:-.02em;line-height:1.02;}
.body{font-family:'Inter',sans-serif;font-weight:600;line-height:1.3;}
.mint-t{color:var(--mint);} .coral-t{color:var(--coral);} .gold-t{color:var(--gold);} .dim-t{color:var(--cream2);}
.pill{position:absolute;display:flex;align-items:center;gap:10px;padding:10px 22px;border-radius:999px;border:3px solid var(--edge);background:var(--gold);color:#1a0f26;
  font-family:'JBMono',monospace;font-weight:700;font-size:21px;letter-spacing:.08em;box-shadow:5px 5px 0 var(--edge);white-space:nowrap;will-change:transform,opacity;}
.pill.coral{background:var(--coral);} .pill.mint{background:var(--mint);} .pill.cream{background:var(--cream);}
.stamp{position:absolute;font-family:'Bricolage',sans-serif;font-weight:800;letter-spacing:.02em;text-transform:uppercase;color:var(--coral);
  border:7px solid var(--coral);border-radius:14px;padding:6px 26px;background:rgba(19,10,31,.35);will-change:transform,opacity;}
.logo{display:flex;align-items:center;justify-content:center;}
.logo svg{width:100%;height:100%;}
.wm{font-family:'Bricolage',sans-serif;font-weight:800;letter-spacing:-.02em;}
`;

// Runtime helpers shared by every part page (pure functions of t).
export const RUNTIME_JS = `
function $(id){return document.getElementById(id);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,u){return a+(b-a)*u;}
function st(t,a,d){return clamp((t-a)/d,0,1);}
function eoc(x){x=clamp(x,0,1);return 1-Math.pow(1-x,3);}
function eio(x){x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
function eob(x,s){x=clamp(x,0,1);s=s||1.7;var c=x-1;return 1+(s+1)*c*c*c+s*c*c;}
function eel(x){x=clamp(x,0,1);if(x===0||x===1)return x;return Math.pow(2,-9*x)*Math.sin((x*10-.75)*(2*Math.PI/3))+1;}
function win(t,a,b,d){d=d||.35;return clamp(Math.min(st(t,a,d),1-st(t,b,d)),0,1);}
function hash(i){var x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x);}
function mix(c1,c2,u){return [Math.round(lerp(c1[0],c2[0],u)),Math.round(lerp(c1[1],c2[1],u)),Math.round(lerp(c1[2],c2[2],u))];}
function rgb(c){return 'rgb('+c[0]+','+c[1]+','+c[2]+')';}
// pop-in: scale w/ overshoot + fade + slight rise. e in [0,1]
function pop(el,e,o){o=o||{};if(!el)return;var s0=o.s0==null?.55:o.s0,dy=o.dy==null?26:o.dy,dx=o.dx||0,rot=o.rot||0;
  var k=eob(e,o.back||1.9);el.style.opacity=clamp(e*3.2,0,1);
  el.style.transform='translate('+(dx*(1-eoc(e)))+'px,'+(dy*(1-eoc(e)))+'px) scale('+(s0+(1-s0)*k)+') rotate('+(rot*(1-eoc(e)))+'deg)';}
function rise(el,e,dy,dx){if(!el)return;var k=eoc(e);el.style.opacity=clamp(e*2.6,0,1);el.style.transform='translate('+((dx||0)*(1-k))+'px,'+((dy==null?30:dy)*(1-k))+'px)';}
function fade(el,o){if(el)el.style.opacity=clamp(o,0,1);}
function wipeW(el,e){if(el)el.style.width=(100*clamp(e,0,1))+'%';}
function fmtN(v,d){d=d||0;var s=Math.abs(v).toFixed(d),p=s.split('.');p[0]=p[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g,',');return (v<0?'-':'')+p.join('.');}
function fmtB(v){ // billions -> $12B / $1.15T
  if(Math.abs(v)>=1000)return '$'+(v/1000).toFixed(2)+'T'; return '$'+Math.round(v)+'B';}
function typeText(el,txt,e){if(!el)return;el.textContent=txt.slice(0,Math.floor(clamp(e,0,1)*txt.length));}
function ptOn(path,u){var L=path.getTotalLength();var p=path.getPointAtLength(clamp(u,0,1)*L);return p;}
// coin (svg <g>) at fraction u of a path
function coinAt(g,path,u,vis){var p=ptOn(path,u);g.setAttribute('transform','translate('+p.x+','+p.y+')');g.style.opacity=vis==null?1:vis;}
`;

export const CORE_JS = `
function core(t){
  // ----- background (pure function of t) -----
  var m = (typeof moodAt==='function') ? moodAt(t) : (typeof MOOD!=='undefined'?MOOD:0);
  $('iso').style.transform='translate('+((t*9)%74)+'px,'+((t*5.2)%64)+'px)';
  $('glowMint').style.left=(-260+120*Math.sin(t*.17))+'px'; $('glowMint').style.top=(-200+70*Math.cos(t*.13))+'px';
  $('glowMint').style.opacity=lerp(.5,.1,m);
  $('glowCoral').style.left=(1180+100*Math.cos(t*.15+1))+'px'; $('glowCoral').style.top=(520+60*Math.sin(t*.12))+'px';
  $('glowCoral').style.opacity=lerp(.12,.55,m);
  // ambient coins drifting along three faint pipes
  for(var i=0;i<AMB.length;i++){var a=AMB[i];coinAt(a.g,a.path,(t*a.sp+a.ph)%1,.55);}
  // ----- header / brand -----
  var he=st(t,.8,.5);
  $('header').style.opacity=he; $('header').style.transform='translateX('+(-40*(1-eoc(he)))+'px)';
  $('hdrTick').style.background=m>.5?'var(--coral)':'var(--mint)';
  $('hdrKick').style.color=m>.5?'var(--coral)':'var(--mint)';
  // ----- progress rail -----
  for(var s=0;s<12;s++){var f=s<PIDX?1:(s===PIDX?clamp(t/DUR,0,1):0);$('seg'+s).firstChild.style.width=(f*100)+'%';}
  // ----- caption: show the sentence being spoken -----
  var cur=-1;for(var j=0;j<SENTS.length;j++){if(t>=SENTS[j].start-.08&&t<=SENTS[j].end+.3){cur=j;}}
  if(cur>=0){var S=SENTS[cur];var o=Math.min(st(t,S.start-.08,.2),1-st(t,S.end+.1,.2));
    if($('captxt').getAttribute('data-i')!==String(cur)){$('captxt').textContent=S.text;$('captxt').setAttribute('data-i',String(cur));}
    $('cap').style.opacity=o;$('cap').style.transform='translateY('+(14*(1-eoc(o)))+'px)';}
  else{$('cap').style.opacity=0;}
  // ----- chapter intro wipe (0 .. 1.0s): coral leads in / trails out behind a cream title card -----
  var intro=$('intro');
  if(t<1.05){intro.style.display='block';
    var c1=-100*(1-eio(st(t,0,.28)))+100*eio(st(t,.7,.3));
    var c2=-100*(1-eio(st(t,.06,.28)))+100*eio(st(t,.62,.28));
    $('iw1').style.transform='translateX('+c1+'%)';
    $('iw2').style.transform='translateX('+c2+'%)';
    $('iText').style.opacity=clamp(st(t,.16,.16)*(1-st(t,.6,.12)),0,1);
    $('iText').style.transform='translateX('+(-60*(1-eoc(st(t,.14,.3)))+90*st(t,.6,.3))+'px)';
  } else intro.style.display='none';
  if(typeof render==='function') render(t);
}
`;
