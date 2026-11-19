(function () {
var v = document.getElementById('v'), cv = document.getElementById('c'), cx = cv.getContext('2d'), capEl = document.getElementById('cap'), endEl = document.getElementById('endc'), dip = document.getElementById('dip');
var SEN = {}; TM.sentences.forEach(function (s) { SEN[s.id] = s; });
function CW(id, w) { for (var i = 0; i < TM.cap.length; i++) if (TM.cap[i].s === id && TM.cap[i].w.toLowerCase().replace(/[^a-z0-9]/g, '').indexOf(w) === 0) return TM.cap[i].t0; return SEN[id].t0 + 1; }
var DUR = TM.end; window.__reelDurationSec = DUR; var TEND = CW('s9', 'nerdlogic') - .3;
var CUTS = window.FILM_CUTS || [];
var CAPW = TM.cap.map(function (c) { return { w: c.w, t0: c.t0, t1: c.t1 }; });
function clamp(x) { return Math.max(0, Math.min(1, x)); } function ramp(t, a, b) { return clamp((t - a) / (b - a)); }
function eob(x) { var c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); } function eo3(x) { return 1 - Math.pow(1 - x, 3); }
var FPS = 24, ready = false;
function seekVideo(t) { return new Promise(function (res) { var tt = Math.min(Math.max(0, t), (v.duration || 1e9) - .02); function on() { v.removeEventListener('seeked', on); res(); } v.addEventListener('seeked', on); v.currentTime = (Math.floor(tt * FPS) + .5) / FPS; }); }
window.__seek = async function (t) {
  if (!ready) return;
  await seekVideo(t); cx.drawImage(v, 0, 0, 1080, 1920);
  capEl.innerHTML = t >= TEND ? '' : window.CAP.html(t, CAPW, { plain: true, hi: '#ff9d2e', ink: '#f1f3f8', fs: 40, width: 756 });
  var d = 0; CUTS.forEach(function (c) { if (t >= c - .2 && t < c) d = Math.max(d, (t - (c - .2)) / .2); else if (t >= c && t < c + .22) d = Math.max(d, 1 - (t - c) / .22); }); dip.style.opacity = d;
  var e2 = eo3(ramp(t, TEND, TEND + .5)); endEl.style.display = e2 > 0 ? 'block' : 'none'; endEl.style.opacity = e2; endEl.style.transform = 'translateY(' + ((1 - e2) * 30) + 'px)';
  document.getElementById('eF').style.transform = 'scale(' + (eob(ramp(t, TEND + .15, TEND + .5)) * (1 + .04 * Math.sin((t - TEND) * 4.2))).toFixed(3) + ')';
  document.getElementById('eS').style.transform = 'scale(' + (eob(ramp(t, TEND + .4, TEND + .75)) * (1 + .04 * Math.sin((t - TEND) * 4.2 + 1.5))).toFixed(3) + ')';
};
window.__ready = false;
Promise.all([document.fonts.load('600 40px Inter', 'Aa 0123'), document.fonts.load('800 40px Inter', 'Aa 0123'), new Promise(function (r) { if (v.readyState >= 3) r(); else v.addEventListener('canplaythrough', function () { r(); }, { once: true }); setTimeout(r, 8000); })]).then(function () { ready = true; return window.__seek(0); }).then(function () { window.__ready = true; });
})();
