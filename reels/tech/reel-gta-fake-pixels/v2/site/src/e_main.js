/* e_main: load props, build, scene switching with authored camera flights / dips, the render contract, the sound-event list */
(function () {
var T = THREE, clamp = B.clamp, lerp = B.lerp, eio = B.eio, WS = B.WS, GR = B.GR, SC = B.SCN;
window.__reelDurationSec = B.DUR;
window.__ready = false;
var FLY = 1.1;
function applyPose(P) { B.cam.position.copy(P.p); B.cam.lookAt(P.q); B.cam.fov = P.fov; B.cam.updateProjectionMatrix(); B.bandOn(P.band, P.wid, P.amp); B.KID.userData.P.head.visible = !P.hideHead; }
function blendPose(a, b, u) { return { p: a.p.clone().lerp(b.p, u), q: a.q.clone().lerp(b.q, u), fov: lerp(a.fov, b.fov, u), band: a.band.clone().lerp(b.band, u), wid: lerp(a.wid, b.wid, u), amp: lerp(a.amp, b.amp, u), hideHead: u < .5 ? a.hideHead : b.hideHead }; }
// sound events for audio_mix.py (dumped by tools/events.mjs)
function buildEV() {
  var E = [];
  SC.forEach(function (s, i) { if (i) E.push({ t: s.t0, k: s.tr === 'dip' ? 'whoosh' : 'swish' }); });
  E.push({ t: WS('g2', 'सोलह'), k: 'slam' }); for (var i = 0; i < 6; i++) E.push({ t: WS('g2', 'सोलह') + .5 + i * .27, k: 'tick' });
  E.push({ t: WS('g3', 'छेद|रंग'), k: 'sparkle' }); E.push({ t: WS('g4', 'पिक्सल|पिक्सेल'), k: 'card' }); E.push({ t: WS('g5', 'तिरासी|83'), k: 'count' });
  E.push({ t: WS('g7', 'टकरा'), k: 'ping' }); E.push({ t: WS('g7', 'आँख|आंख'), k: 'ping2' });
  E.push({ t: WS('g8', 'धागा'), k: 'zip' }); E.push({ t: WS('g9', 'रे|ट्रेसिंग'), k: 'card' });
  E.push({ t: WS('g10', 'तिरासी|83'), k: 'rumble' }); E.push({ t: WS('g11', 'पचास|50'), k: 'slam' }); E.push({ t: WS('g11', 'सत्रह|17'), k: 'clock' });
  E.push({ t: WS('g12', 'कम'), k: 'sparkle' }); E.push({ t: WS('g13', 'पूरी'), k: 'swell' }); E.push({ t: WS('g13', 'रिकंस्ट्र|रे'), k: 'card' });
  E.push({ t: WS('g14', 'बड़ा|बडा'), k: 'brush' }); E.push({ t: WS('g15', 'डीएलएसएस|डी'), k: 'card' });
  E.push({ t: WS('g16', 'कार्ड'), k: 'flip' }); E.push({ t: WS('g16', 'बीच'), k: 'riffle' }); E.push({ t: WS('g17', 'फ़्रेम|फ्रेम|जनरेशन'), k: 'card' });
  E.push({ t: WS('g18', 'पिक्सल'), k: 'tick' }); E.push({ t: WS('g18', 'तस्वीर'), k: 'tick' }); E.push({ t: WS('g18', 'सोलह|बटा'), k: 'slam' });
  E.push({ t: WS('g20', 'बटन'), k: 'click' }); E.push({ t: WS('g20', 'लैग|लेग'), k: 'buzz' }); E.push({ t: WS('g22', 'रॉकस्टार|रॉक'), k: 'stamp' });
  E.push({ t: WS('g23', 'लाइक'), k: 'pop' }); E.push({ t: WS('g23', 'शेयर'), k: 'pop' }); E.push({ t: WS('g23', 'सब्स'), k: 'pop' });
  E.sort(function (a, b) { return a.t - b.t; }); return E;
}
B.loadModels(['tea_set_01', 'vintage_electric_kettle', 'brass_pot_01', 'brass_pot_02', 'plastic_crate_02', 'plastic_crate_03', 'barrel_03', 'street_lamp_02', 'utility_box_02', 'wicker_basket_01', 'delivery_scooter', 'SportsCar', 'Taxi', 'SUV', 'Streetlight_Single']).then(function () {
  return B.loadLogos();
}).then(function () {
  B.placeProps(); B.placeGame(); B.initThreads(); B.initRangoli(); B.initPoster();
  window.EV = buildEV();
  window.__seek = function (t) {
    var i = B.sceneAt(t), s = SC[i];
    B.UIs.hide(); B.TS.fade = 0; B.gameLane = 0;
    B.KID.visible = true; B.thrG.visible = false; B.SPOOLS.visible = false; B.KID2.visible = false; B.gridOff(); B.phoneMat.uniforms.blocks.value.set(0, 0); B.phoneMat.uniforms.grid.value = 0;
    s.act(t, s);
    var P = s.pose(t, s);
    if (i > 0 && s.tr === 'fly' && t < s.t0 + FLY) { var pv = SC[i - 1]; P = blendPose(pv.pose(s.t0, pv), P, eio((t - s.t0) / FLY)); }
    applyPose(P);
    if (s.tr === 'dip') B.TS.fade = Math.max(B.TS.fade, clamp(1 - (t - s.t0) / .3));
    if (i + 1 < SC.length && SC[i + 1].tr === 'dip') B.TS.fade = Math.max(B.TS.fade, clamp(1 - (s.t1 - t) / .3));
    if (i === 1) B.TS.fade = Math.max(B.TS.fade, B.innerDip(t));
    B.setCap(t);
    B.bulbs.forEach(function (b, k) { b.scale.setScalar(.85 + .3 * (0.5 + 0.5 * Math.sin(t * 3 + k * 1.7))); });
    if (!window.__skipRender) B.render(t);
  };
  window.__seek(0); window.__ready = true;
}).catch(function (e) { console.error('LOAD FAIL', e && e.stack || e); });
window.__view = function (p, q, fov, t) { window.__seek(t || 0); B.cam.position.set(p[0], p[1], p[2]); B.cam.lookAt(q[0], q[1], q[2]); B.cam.fov = fov || 40; B.cam.updateProjectionMatrix(); B.TS.amp = 0; B.render(t || 0); };
})();
