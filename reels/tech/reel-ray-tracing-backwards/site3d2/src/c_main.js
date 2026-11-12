(function () {
var e = E, S = e.S, clamp = e.clamp, SC = window.SC, GR = window.GR, SCN = window.SCN, TM = window.TM, END = TM.end, SAFE = e.SAFE, B = window.B;
var ov = document.getElementById('ov'), capEl = document.getElementById('cap');
function D(css, html) { var d = document.createElement('div'); d.style.cssText = css; d.innerHTML = html || ''; ov.appendChild(d); return d; }
var hsc = D('left:0;top:0;width:1080px;height:300px;background:linear-gradient(rgba(7,8,18,.92),rgba(7,8,18,.5) 65%,rgba(7,8,18,0))'); hsc.setAttribute('data-ov', '1');
var hdr = D('left:150px;top:150px;width:768px', '<div style="font:400 24px \'Share Tech Mono\';letter-spacing:.14em;color:#b9b2ff;display:flex;align-items:center;gap:14px"><i style="display:inline-block;width:14px;height:14px;background:#b4f000;box-shadow:0 0 12px #b4f000"></i><span id="ebt"></span></div><div id="rd" style="font:400 19px \'Share Tech Mono\';letter-spacing:.08em;color:rgba(185,178,255,.7);margin-top:10px"></div>'), ebt = hdr.querySelector('#ebt'), rd = hdr.querySelector('#rd');
var EYE = ['SCENE SCAN · PUDDLE STREET', 'SCENE SCAN · PUDDLE STREET', 'RAY 01 · FROM THE EYE', 'RAY 01 · THE BOUNCE', 'BVH · BOX INSIDE BOX', 'BVH'], RD = ['WIREFRAME OF LIGHT · SCHEMATIC SCENE', '', 'ONE RAY PER PIXEL · SCHEMATIC', '', 'LEVELS BUILT ON A TORUS KNOT · IDEAL TREE', ''];
function sceneAt(t) { var k = 0; for (var i = 0; i < SC.length - 1; i++) if (t >= SC[i]) k = i; return k; }
window.__reelDurationSec = END; window.EV = []; window.__B = SC; window.__ready = false;
var CAPOPT = { fs: 50, width: 768, lines: 2, chip: '#eef0ff', chipInk: '#070812', keywords: { 'ray': '#b4f000', 'kiran': '#b4f000' } };
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); var sc = sceneAt(t); GR.forEach(function (g) { g.children.forEach(function (c) { if (c.isGroup) c.visible = false; }); }); e.hideLabels(); (SCN[sc] || SCN[0])(t); e.camAt(sc === 1 ? 0 : sc, t); e.applyCam(); SAFE.t = 290; e.clampLabels();
  ebt.textContent = EYE[sc]; rd.textContent = RD[sc]; capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  var cp = e.camP, cl = e.camL; e.POST.half = 0; e.POST.focus = cp.distanceTo(cl); e.POST.aper = .03; e.POST.maxR = 8; e.POST.bloom = .55; e.POST.vig = .45; e.POST.expo = 1.0; e.POST.grain = .012; e.POST.ca = .0007; e.POST.seed = (t * 37) % 97; e.POST.fade = 0;
  if (!window.__skipRender) e.render(); };
Promise.all(['300 40px Rajdhani', '600 30px Rajdhani', '400 30px "Share Tech Mono"', '600 30px Inter', '800 30px Inter'].map(function (f) { return document.fonts.load(f); })).then(function () { window.__ready = true; });
})();
