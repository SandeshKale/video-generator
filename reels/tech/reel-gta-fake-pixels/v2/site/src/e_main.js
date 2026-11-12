/* e_main: load props, build, expose the render contract */
(function () {
window.__reelDurationSec = 32;
window.__ready = false;
B.loadModels(['tea_set_01', 'vintage_electric_kettle', 'brass_pot_01', 'brass_pot_02', 'plastic_crate_02', 'plastic_crate_03', 'barrel_03', 'street_lamp_02', 'utility_box_02', 'wicker_basket_01', 'delivery_scooter', 'SportsCar', 'Taxi', 'SUV', 'Streetlight_Single']).then(function () {
  B.placeProps(); B.placeGame(); B.initThreads(); B.initRangoli();
  window.__seek = function (t) {
    var sc = B.SCN.filter(function (s) { return t >= s.t0 && t < s.t1; })[0] || B.SCN[B.SCN.length - 1];
    B.thrG.visible = sc === B.SCN[1]; B.MAKER.visible = sc === B.SCN[2];
    sc.f(t); B.bulbs.forEach(function (b, i) { b.scale.setScalar(.85 + .3 * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.7))); });
    if (!window.__skipRender) B.render(t);
  };
  window.__seek(0); window.__ready = true;
}).catch(function (e) { console.error('LOAD FAIL', e && e.message); });
})();
window.__view = function (p, q, fov, t) { window.__seek(t || 0); B.cam.position.set(p[0], p[1], p[2]); B.cam.lookAt(q[0], q[1], q[2]); B.cam.fov = fov || 40; B.cam.updateProjectionMatrix(); B.TS.amp = 0; B.render(t || 0); };
