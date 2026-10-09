// Layered "paper puppet" characters: clothed, shaded body parts placed on the mocap joints (two-point transforms).
// Replaces the stick/capsule skins. Pure function of the pose P + a character spec.
(function(){
'use strict';
var R=window.RIG;
function hex(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function shade(c,a){var h=hex(c),o=h.map(function(v){return Math.max(0,Math.min(255,Math.round(a>0?v+(255-v)*a:v*(1+a))));});return '#'+o.map(function(v){return ('0'+v.toString(16)).slice(-2);}).join('');}
function f(n){return n.toFixed(1);}
// local-frame part: origin at A, +x toward B, y perpendicular (svg coords)
function seg(A,B,inner){var dx=B[0]-A[0],dy=-(B[1]-A[1]),L=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx)*180/Math.PI;return '<g transform="translate('+f(A[0])+' '+f(-A[1])+') rotate('+f(ang)+')">'+inner(L)+'</g>';}
function tube(L,w0,w1,fill,extra){var a=w0/2,b=w1/2;return '<path d="M0 '+(-a)+' L'+f(L)+' '+(-b)+' A'+b+' '+b+' 0 0 1 '+f(L)+' '+b+' L0 '+a+' A'+a+' '+a+' 0 0 1 0 '+(-a)+' Z" fill="'+fill+'"'+(extra||'')+'/>';}
function shine(L,w0,w1,col){return '<path d="M'+f(L*.08)+' '+(-w0*.22)+' L'+f(L*.92)+' '+(-w1*.22)+'" stroke="'+col+'" stroke-width="'+Math.max(3,w1*.14)+'" stroke-linecap="round" opacity=".45"/>';}
function mid(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,0];}
function arm(P,side,C,dark){var s=P['s'+side],e=P['e'+side],h=P['h'+side],col=dark?C.topD:C.top,skin=dark?C.skinD:C.skin;
  return '<circle cx="'+f(s[0])+'" cy="'+f(-s[1])+'" r="21" fill="'+col+'"/>'+seg(s,e,function(L){return tube(L,32,27,col)+shine(L,32,27,'#fff');})+
   seg(e,h,function(L){var sleeve=C.longSleeve?tube(L,27,24,col):tube(L,25,21,skin);return sleeve+(C.longSleeve?'<rect x="'+f(L-14)+'" y="-13" width="12" height="26" rx="5" fill="'+shade(col,-.18)+'"/>':'')+shine(L,25,21,'#fff');})+
   seg(e,h,function(L){return '<ellipse cx="'+f(L+8)+'" cy="0" rx="17" ry="14" fill="'+skin+'"/><ellipse cx="'+f(L+14)+'" cy="-9" rx="8" ry="6" fill="'+skin+'" transform="rotate(-20 '+f(L+14)+' -9)"/>';});}
function leg(P,side,C,dark){var h=P.hip,k=P['k'+side],a=P['f'+side],t=P['t'+side],col=dark?C.pantsD:C.pants,sh=dark?shade(C.shoes,-.2):C.shoes;
  return seg(h,k,function(L){return tube(L,46,38,col)+shine(L,46,38,'#fff');})+
   seg(k,a,function(L){return tube(L,38,30,col)+'<rect x="'+f(L-16)+'" y="-16" width="14" height="32" rx="5" fill="'+shade(col,-.2)+'"/>';})+
   seg(a,t,function(L){var l=Math.max(L,18);return '<path d="M-12 -16 L'+f(l-4)+' -14 Q'+f(l+22)+' -10 '+f(l+22)+' 6 Q'+f(l+22)+' 15 '+f(l+6)+' 15 L-12 15 Z" fill="'+sh+'"/><path d="M-12 11 L'+f(l+18)+' 11" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>';});}
function torso(P,C,wide){var n=P.neck,h=P.hip,up=[n[0]-(h[0]-n[0])*.1,n[1]-(h[1]-n[1])*.1,0];var out='';
  var id=C.id||'c';
  out+=seg(h,up,function(L){var g=tube(L+12,wide?86:66,wide?118:80,C.top);
    var details='';
    if(C.style==='stripes'){for(var i=1;i<8;i++)details+='<rect x="'+f(L*i/8)+'" y="-40" width="9" height="80" fill="'+C.topD+'"/>';details='<g clip-path="url(#cp'+id+')">'+details+'</g>';}
    if(C.style==='hoodie')details+='<rect x="'+f(L*.12)+'" y="-22" width="'+f(L*.34)+'" height="44" rx="12" fill="'+C.topD+'" opacity=".55"/>';
    if(C.style==='uniform')details+='<rect x="'+f(L*.5)+'" y="-34" width="10" height="68" fill="'+C.accent+'"/><circle cx="'+f(L*.62)+'" cy="-14" r="6" fill="'+C.accent+'"/><circle cx="'+f(L*.62)+'" cy="12" r="6" fill="'+C.accent+'"/>';
    var clip='<clipPath id="cp'+id+'"><path d="M-6 -28 L'+f(L+10)+' -33 A33 33 0 0 1 '+f(L+10)+' 33 L-6 28 A28 28 0 0 1 -6 -28Z"/></clipPath>';
    return clip+g+details+shine(L,wide?86:66,wide?118:80,'#fff')+'<rect x="-6" y="-29" width="12" height="58" rx="5" fill="'+shade(C.top,-.2)+'"/>';});
  if(C.style==='hoodie')out='<g>'+seg(n,[n[0]-(h[0]-n[0])*.2,n[1]-(h[1]-n[1])*.2,0],function(L){return '<ellipse cx="'+f(L*.2)+'" cy="0" rx="26" ry="34" fill="'+C.topD+'"/>';})+'</g>'+out;
  return out;}
function head(P,C,o){var h=P.head,n=P.neck,ang=Math.atan2(h[1]-n[1],h[0]-n[0])*-180/Math.PI+90,cx=h[0],cy=-h[1],R0=46,fc=o.face==null?1:o.face,front=o.front?0:fc;
  var s='';
  var neck=seg(n,h,function(L){return '<rect x="-4" y="-13" width="'+f(L*.7)+'" height="26" rx="10" fill="'+C.skinD+'"/>';});
  var hair=C.hair,hs=C.hairStyle||'short',eyeY=cy-4,ex=14,sx=front*9;
  var back='',frontHair='';
  var HS={
   short:'<path d="M'+f(cx-R0-3)+' '+f(cy-4)+' A'+(R0+3)+' '+(R0+3)+' 0 0 1 '+f(cx+R0+3)+' '+f(cy-4)+' Q'+f(cx+R0-6)+' '+f(cy-30)+' '+f(cx-4)+' '+f(cy-R0+6)+' Q'+f(cx-R0+6)+' '+f(cy-24)+' '+f(cx-R0-3)+' '+f(cy-4)+'Z" fill="'+hair+'"/>',
   bun:'<circle cx="'+f(cx-fc*10)+'" cy="'+f(cy-R0-14)+'" r="19" fill="'+hair+'"/><path d="M'+f(cx-R0-3)+' '+f(cy)+' A'+(R0+3)+' '+(R0+3)+' 0 0 1 '+f(cx+R0+3)+' '+f(cy)+' Q'+f(cx+R0-4)+' '+f(cy-28)+' '+f(cx)+' '+f(cy-R0+8)+' Q'+f(cx-R0+4)+' '+f(cy-26)+' '+f(cx-R0-3)+' '+f(cy)+'Z" fill="'+hair+'"/>',
   bob:'<path d="M'+f(cx-R0-9)+' '+f(cy+26)+' L'+f(cx-R0-8)+' '+f(cy-6)+' A'+(R0+8)+' '+(R0+8)+' 0 0 1 '+f(cx+R0+8)+' '+f(cy-6)+' L'+f(cx+R0+9)+' '+f(cy+26)+' Q'+f(cx+R0-2)+' '+f(cy+14)+' '+f(cx+R0-6)+' '+f(cy-14)+' Q'+f(cx)+' '+f(cy-34)+' '+f(cx-R0+6)+' '+f(cy-14)+' Q'+f(cx-R0+2)+' '+f(cy+14)+' '+f(cx-R0-9)+' '+f(cy+26)+'Z" fill="'+hair+'"/>',
   beanie:'<path d="M'+f(cx-R0-4)+' '+f(cy-10)+' A'+(R0+4)+' '+(R0+4)+' 0 0 1 '+f(cx+R0+4)+' '+f(cy-10)+' Z" fill="'+hair+'"/><rect x="'+f(cx-R0-6)+'" y="'+f(cy-20)+'" width="'+(R0*2+12)+'" height="14" rx="7" fill="'+shade(hair,.25)+'"/><circle cx="'+f(cx)+'" cy="'+f(cy-R0-8)+'" r="9" fill="'+shade(hair,.25)+'"/>',
   cap:'<path d="M'+f(cx-R0-3)+' '+f(cy-10)+' A'+(R0+3)+' '+(R0+3)+' 0 0 1 '+f(cx+R0+3)+' '+f(cy-10)+' Z" fill="'+hair+'"/><path d="M'+f(cx+fc*8)+' '+f(cy-12)+' L'+f(cx+fc*(R0+26))+' '+f(cy-8)+' L'+f(cx+fc*(R0+22))+' '+f(cy-1)+' L'+f(cx+fc*8)+' '+f(cy-3)+'Z" fill="'+shade(hair,-.2)+'"/><circle cx="'+f(cx+fc*2)+'" cy="'+f(cy-R0+10)+'" r="7" fill="'+C.accent+'"/>'
  };
  var skinPath='<circle cx="'+f(cx)+'" cy="'+f(cy)+'" r="'+R0+'" fill="'+C.skin+'"/><ellipse cx="'+f(cx-R0+2)+'" cy="'+f(cy+6)+'" rx="8" ry="11" fill="'+C.skin+'"/><ellipse cx="'+f(cx+R0-2)+'" cy="'+f(cy+6)+'" rx="8" ry="11" fill="'+C.skin+'"/>';
  var cheeks='<circle cx="'+f(cx-22+sx)+'" cy="'+f(cy+12)+'" r="8" fill="#ff9d86" opacity=".45"/><circle cx="'+f(cx+22+sx)+'" cy="'+f(cy+12)+'" r="8" fill="#ff9d86" opacity=".45"/>';
  var eyes=o.blink?'<path d="M'+f(cx-ex-7+sx)+' '+f(eyeY)+' h14 M'+f(cx+ex-7+sx)+' '+f(eyeY)+' h14" stroke="#2a2438" stroke-width="4" stroke-linecap="round"/>':
    '<ellipse cx="'+f(cx-ex+sx)+'" cy="'+f(eyeY)+'" rx="6.5" ry="8" fill="#2a2438"/><ellipse cx="'+f(cx+ex+sx)+'" cy="'+f(eyeY)+'" rx="6.5" ry="8" fill="#2a2438"/><circle cx="'+f(cx-ex+sx+2)+'" cy="'+f(eyeY-3)+'" r="2.4" fill="#fff"/><circle cx="'+f(cx+ex+sx+2)+'" cy="'+f(eyeY-3)+'" r="2.4" fill="#fff"/>';
  var brows='<path d="M'+f(cx-ex-8+sx)+' '+f(eyeY-15+(o.brow||0))+' q8 -5 16 0 M'+f(cx+ex-8+sx)+' '+f(eyeY-15+(o.brow||0))+' q8 -5 16 0" stroke="'+shade(hair,-.1)+'" stroke-width="4" fill="none" stroke-linecap="round"/>';
  var nose='<path d="M'+f(cx+sx+fc*2)+' '+f(eyeY+8)+' q'+(fc*7)+' 9 0 12" stroke="'+shade(C.skin,-.25)+'" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  var mouth=o.vis?R.mouth(o.vis,cx+sx,cy+25,1.05):R.mouth('X',cx+sx,cy+25,1);
  var glasses=C.glasses?'<circle cx="'+f(cx-ex+sx)+'" cy="'+f(eyeY)+'" r="13" fill="none" stroke="'+INKC+'" stroke-width="3.5"/><circle cx="'+f(cx+ex+sx)+'" cy="'+f(eyeY)+'" r="13" fill="none" stroke="'+INKC+'" stroke-width="3.5"/><path d="M'+f(cx+sx-1)+' '+f(eyeY)+' h2" stroke="'+INKC+'" stroke-width="3.5"/>':'';
  var mask=C.mask?'<path d="M'+f(cx-R0+2)+' '+f(eyeY-14)+' Q'+f(cx)+' '+f(eyeY-24)+' '+f(cx+R0-2)+' '+f(eyeY-14)+' L'+f(cx+R0-4)+' '+f(eyeY+12)+' Q'+f(cx)+' '+f(eyeY+4)+' '+f(cx-R0+4)+' '+f(eyeY+12)+'Z" fill="#1a1626"/><ellipse cx="'+f(cx-ex+sx)+'" cy="'+f(eyeY)+'" rx="6" ry="4.5" fill="#fff"/><ellipse cx="'+f(cx+ex+sx)+'" cy="'+f(eyeY)+'" rx="6" ry="4.5" fill="#fff"/>':'';
  var backHair=(hs==='bob')?HS.bob:'';
  var tophair=(hs==='bob')?'<path d="M'+f(cx-R0-2)+' '+f(cy-6)+' A'+(R0+2)+' '+(R0+2)+' 0 0 1 '+f(cx+R0+2)+' '+f(cy-6)+' Q'+f(cx+R0-10)+' '+f(cy-22)+' '+f(cx-4)+' '+f(cy-R0+8)+' Q'+f(cx-R0+8)+' '+f(cy-20)+' '+f(cx-R0-2)+' '+f(cy-6)+'Z" fill="'+hair+'"/>':HS[hs];
  return '<g transform="translate('+f(n[0])+' '+f(-n[1])+') scale(1.3) translate('+f(-n[0])+' '+f(n[1])+')">'+neck+'<g transform="rotate('+f(ang)+' '+f(cx)+' '+f(cy)+')">'+backHair+skinPath+cheeks+eyes+brows+nose+(C.mask?'':glasses)+mask+(C.mask?'':mouth)+(C.mask?'<path d="M'+f(cx-12+sx)+' '+f(cy+25)+' q12 5 24 0" stroke="#2a2438" stroke-width="4" fill="none" stroke-linecap="round"/>':'')+tophair+'</g></g>';}
var INKC='#2a2438';
// P = pose (from RIG.sample); C = character spec; o = {vis, blink, face, front, brow}
function svg(P,C0,o){o=o||{};var C={};for(var k in C0)C[k]=C0[k];
  C.skinD=shade(C.skin,-.12);C.topD=shade(C.top,-.18);C.pantsD=shade(C.pants,-.18);C.accent=C.accent||'#ffd166';
  if(o.front){var Q={};for(var q in P)Q[q]=P[q].slice();[['s',-60],['e',-66],['h',-72]].forEach(function(r){Q[r[0]+'L'][0]+=r[1];Q[r[0]+'R'][0]-=r[1];});P=Q;}
  var zl=(P.kL[2]+P.fL[2])/2,zr=(P.kR[2]+P.fR[2])/2,za=(P.eL[2]+P.hL[2])/2,zb=(P.eR[2]+P.hR[2])/2;
  var farLeg=zl<=zr?'L':'R',nearLeg=farLeg==='L'?'R':'L',farArm=za<=zb?'L':'R',nearArm=farArm==='L'?'R':'L';
  return arm(P,farArm,C,true)+(o.bust?'':leg(P,farLeg,C,true))+torso(P,C,o.front)+(o.bust?'':leg(P,nearLeg,C,false))+arm(P,nearArm,C,false)+head(P,C,o);}
window.PUP={svg:svg,shade:shade,
 chars:{
  pip:{id:'pip',skin:'#ffd9b5',hair:'#2a2438',hairStyle:'short',top:'#1f8a8a',pants:'#3a3550',shoes:'#f4efe6',style:'tee',glasses:true,accent:'#ffd166'},
  maya:{id:'maya',skin:'#c98a62',hair:'#3a2418',hairStyle:'bun',top:'#e2674a',pants:'#5b6d8a',shoes:'#fff',style:'hoodie',accent:'#ffd166'},
  sam:{id:'sam',skin:'#f0c39a',hair:'#8a5a2b',hairStyle:'short',top:'#ffd166',pants:'#2f5d62',shoes:'#e2674a',style:'tee',longSleeve:false},
  burglar:{id:'bur',skin:'#e3b896',hair:'#1a1626',hairStyle:'beanie',top:'#f5f0e8',pants:'#2a2438',shoes:'#1a1626',style:'stripes',mask:true,longSleeve:true},
  officer:{id:'off',skin:'#a8704c',hair:'#243b5c',hairStyle:'cap',top:'#3d5a80',pants:'#243b5c',shoes:'#1a1626',style:'uniform',accent:'#ffd166',longSleeve:true}
 }};
})();
