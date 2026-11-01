var SCN = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13];
var dipAt = [tCut - .05, tUs - .17, B[4], B[5], B[6], B[7], B[8], B[9], B[12], B[13]];
window.__reelDurationSec = END; window.EV = []; window.__B = B; window.__ready = false;
window.__seek = function (t) {
  t = Math.max(0, Math.min(END - .001, t)); t_g = t; var sc = sceneAt(t);
  allObj.forEach(function (o) { o.visible = false; }); allOv.forEach(function (e) { e.style.display = 'none'; }); earth.visible = true; atmo.visible = true; R.toneMappingExposure = 1.15; padKey.intensity = 0; padWarm.intensity = 0; flash.style.opacity = 0; flash.style.background = '#ffb020';
  SCN[sc](t);
  var dip = 0; dipAt.forEach(function (d) { dip = Math.max(dip, (1 - clamp(Math.abs(t - d - .05) / .22)) * .55); }); if (dip > 0) { flash.style.background = '#031417'; flash.style.opacity = Math.max(parseFloat(flash.style.opacity) || 0, dip); }
  capEl.innerHTML = CAP.html(t, TM.cap, CAPOPT);
  if (!window.__skipRender) R.render(S, C);
};
Promise.all(['800 40px "Big Shoulders Display"', '700 24px "IBM Plex Mono"', '600 24px "IBM Plex Mono"', '800 50px Inter'].map(function (f) { return document.fonts.load(f); })).then(function () { var w = function () { if (loaded >= NEED) { window.__ready = true; } else setTimeout(w, 50); }; w(); });
})();
