// Timeline: one scene per spoken group; scene boundaries come from the real voice timing (timing.js). Pure function of t.
(function () {
var VT = window.VT, DUR = VT.end, GS = VT.groups;   // [{g, t0}]
var TRC = [C.gold, C.teal, C.red, C.blue];
function caption(t, dark) { var cs = VT.caps || [], c = null; for (var i = 0; i < cs.length; i++) if (t >= cs[i].t0 && t < cs[i].t1) c = cs[i]; if (!c) return; var a = Math.min(1, (t - c.t0) / .15, (c.t1 - t) / .15); cx.save(); cx.globalAlpha = a; cx.font = '800 40px ' + CAPF; cx.textAlign = 'center'; if (dark === 2) { cx.save(); cx.beginPath(); cx.rect(0, 0, 960, H); cx.clip(); cx.fillStyle = C.ink; cx.fillText(c.text, W / 2, 1040); cx.restore(); cx.save(); cx.beginPath(); cx.rect(960, 0, 960, H); cx.clip(); cx.fillStyle = '#EDEFF5'; cx.fillText(c.text, W / 2, 1040); cx.restore(); } else { cx.fillStyle = dark ? '#EDEFF5' : C.ink; cx.fillText(c.text, W / 2, 1040); } cx.restore(); }
var DARK = { 7: 1, 10: 1, 18: 1, 19: 1, 20: 1, 21: 1, 29: 1, 31: 1, 33: 1, 34: 1, 35: 1, 38: 1, 40: 1, 44: 1, 45: 1 }, SPLIT = { 1: 1, 2: 1, 42: 1 };
function sceneAt(t) { var i = 0; for (var k = 0; k < GS.length; k++) if (t >= GS[k].t0 - 1e-6) i = k; return i; }
function render(t) {
  t = cl(t, 0, DUR - 1e-3); var i = sceneAt(t), TB = .2, show = i, nxt = i + 1 < GS.length ? GS[i + 1].t0 : null;
  if (nxt !== null && t > nxt - TB * .0 && false) show = i;
  var inTrans = false, tp = 0; if (nxt !== null && t >= nxt - TB && t < nxt + TB) { inTrans = true; tp = (t - (nxt - TB)) / (2 * TB); show = t < nxt ? i : i + 1; }
  var s0 = GS[show].t0, s1 = show + 1 < GS.length ? GS[show + 1].t0 : DUR, u = Math.max(0, t - s0), p = cl((t - s0) / (s1 - s0));
  cx.clearRect(0, 0, W, H); var g = GS[show].g; SCN[g](p, u);
  caption(t, SPLIT[g] ? 2 : DARK[g] ? 1 : 0);
  if (inTrans) { var x = lerp(-W * 1.2, W * 1.2, eio(tp)); cx.save(); cx.fillStyle = TRC[show % 4]; cx.beginPath(); cx.moveTo(x - 200, 0); cx.lineTo(x + W, 0); cx.lineTo(x + W - 200, H); cx.lineTo(x - 400, H); cx.closePath(); cx.fill(); cx.restore(); }
}
window.__reelDurationSec = DUR; window.__ready = false; window.__seek = function (t) { render(t); };
var img = new Image(); window.__logo = img; var imgP = new Promise(function (r) { img.onload = r; img.onerror = r; }); img.src = 'logo.jpg';
Promise.all([imgP, document.fonts.load('170px Anton', '0123456789,–?₹%'), document.fonts.load('800 40px Poppins', 'Aa%'), document.fonts.load('600 24px Plex', 'AB0')]).then(function () { render(0); window.__ready = true; });
})();
