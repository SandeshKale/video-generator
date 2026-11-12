/* c_game: our own made-up sunny coast "crime-game" city, rendered into the phone's screen (render target) */
(function () {
var T = THREE, R = B.R, std = B.std, hsh = B.hsh, cv = B.cv;
var GS = B.GS = new T.Scene(), GW = 1024, GH = 472;
var gcam = B.gcam = new T.PerspectiveCamera(52, GW / GH, .1, 600);
var gRT = B.gRT = new T.WebGLRenderTarget(GW, GH, { samples: 4, type: T.HalfFloatType });
GS.add(new T.Mesh(new T.SphereGeometry(400, 32, 16), B.skyMat(0x3d8bff, 0x8fd0ff, 0xfff0c8)));
var sunL = new T.DirectionalLight(0xfff0d0, 3.2); sunL.position.set(40, 60, 30); GS.add(sunL);
GS.add(new T.HemisphereLight(0xbfe4ff, 0xffd9a0, 1.1));
function gbox(w, h, d, m, x, y, z) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); GS.add(o); return o; }
// sea + beach + road along x
var sea = new T.Mesh(new T.PlaneGeometry(800, 300), new T.MeshStandardMaterial({ color: 0x18b6d8, roughness: .15, metalness: .1 })); sea.rotation.x = -Math.PI / 2; sea.position.set(0, -.2, -170); GS.add(sea);
var sand = new T.Mesh(new T.PlaneGeometry(800, 30), std(0xf4d79a, .95)); sand.rotation.x = -Math.PI / 2; sand.position.set(0, -.1, -16); GS.add(sand);
var grass = new T.Mesh(new T.PlaneGeometry(800, 200), std(0x5ccf6a, .95)); grass.rotation.x = -Math.PI / 2; grass.position.set(0, -.12, 100); GS.add(grass);
var roadT = cv(512, 128, function (g, w, h) { g.fillStyle = '#3a3d48'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd34a'; for (var i = 0; i < 8; i++) g.fillRect(i * 64 + 8, h / 2 - 3, 36, 6); g.fillStyle = '#f2f2f2'; g.fillRect(0, 6, w, 4); g.fillRect(0, h - 10, w, 4); });
roadT.wrapS = T.RepeatWrapping; roadT.repeat.set(60, 1);
var road = new T.Mesh(new T.PlaneGeometry(800, 10), new T.MeshStandardMaterial({ map: roadT, roughness: .7 })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, 0); GS.add(road);
var walk = new T.Mesh(new T.PlaneGeometry(800, 4), std(0xd9d2c4, .9)); walk.rotation.x = -Math.PI / 2; walk.position.set(0, .02, 7); GS.add(walk);
// pastel art-deco towers behind the walk
var DECO = [0xff9ec7, 0x7fe0d0, 0xfff1a8, 0xb7a8ff, 0xffb27a, 0x9fd8ff];
function winT(seed, col) { return cv(128, 256, function (g, w, h) { g.fillStyle = col; g.fillRect(0, 0, w, h); for (var r = 0; r < 12; r++) for (var c = 0; c < 4; c++) { g.fillStyle = hsh(seed + r * 5 + c) > .3 ? '#2a5a8a' : '#9fd6ff'; g.fillRect(8 + c * 30, 8 + r * 20, 22, 13); } }); }
for (var i = 0; i < 26; i++) {
  var x = -150 + i * 12 + hsh(i) * 4, h = 10 + hsh(i * 7) * 34, w = 7 + hsh(i * 3) * 4, col = DECO[i % DECO.length];
  var m = new T.MeshStandardMaterial({ map: winT(i * 13, '#' + new T.Color(col).getHexString()), roughness: .6 });
  gbox(w, h, 8, m, x, h / 2, 16 + hsh(i * 5) * 8);
  if (hsh(i * 11) > .5) gbox(w * .6, 4, 5, std(col, .6), x, h + 2, 16 + hsh(i * 5) * 8);
}
// palms along the beach side
function palm(x, z, h) { var g = new T.Group(); var tr = new T.Mesh(new T.CylinderGeometry(.18, .3, h, 7), std(0x8a6a44, .9)); tr.position.y = h / 2; tr.rotation.z = .08; g.add(tr);
  for (var k = 0; k < 8; k++) { var f = new T.Mesh(new T.BoxGeometry(3.4, .08, .7), std(0x2fae4a, .8)); f.position.set(Math.cos(k * .8) * 1.5, h, Math.sin(k * .8) * 1.5); f.rotation.set(0, -k * .8, -.45); g.add(f); }
  g.position.set(x, 0, z); GS.add(g); }
for (var i = 0; i < 30; i++) palm(-140 + i * 10, -8 - hsh(i) * 3, 7 + hsh(i * 3) * 3);
// boats on the sea
for (var i = 0; i < 6; i++) { var bt = gbox(4, 1, 1.6, std(0xffffff, .5), -60 + i * 30, .2, -40 - hsh(i) * 40); gbox(1.4, .9, 1.2, std(0xff6f91, .6), -60 + i * 30, .9, -40 - hsh(i) * 40); }
B.gameCars = [];
B.placeGame = function () {
  var hero = B.prop('SportsCar', 0, 0, 2.3, Math.PI / 2, 1, GS); hero.traverse(function (m) { if (m.isMesh && m.material && m.material.color) { m.material = m.material.clone(); if (m.material.color.r > .5 && m.material.color.g < .4) m.material.color.set(0xff3f8e); } });
  B.gameHero = hero;
  [['Taxi', -18, -2.3, -Math.PI / 2], ['SUV', 26, 2.3, Math.PI / 2], ['Taxi', 48, -2.3, -Math.PI / 2], ['SUV', -40, 2.3, Math.PI / 2]].forEach(function (q) { var c = B.prop(q[0], q[1], 0, q[2], q[3], 1, GS); B.gameCars.push({ o: c, x0: q[1], v: q[3] > 0 ? 6 : -9 }); });
  for (var i = 0; i < 14; i++) B.prop('Streetlight_Single', -60 + i * 10, 0, 5.4, 0, 3.2, GS);
};
// the "game": hero car drives along the coast road, chase cam behind it
B.renderGame = function (t) {
  var x = -30 + t * 11; if (B.gameHero) B.gameHero.position.set(x, 0, 2.3);
  B.gameCars.forEach(function (c) { c.o.position.x = c.x0 + c.v * t; });
  gcam.position.set(x - 10.5, 4.2, 6.5); gcam.lookAt(x + 6, 1.2, -1);
  R.setRenderTarget(gRT); R.render(GS, gcam); R.setRenderTarget(null);
  return gRT.texture;
};
// read the current game frame into a 2D canvas (used by the rangoli scene)
B.gameToCanvas = function (t) {
  B.renderGame(t); var x = B.gameHero ? B.gameHero.position.x : 0;
  R.setRenderTarget(null); R.setViewport(0, 0, GW, GH); R.setScissor(0, 0, GW, GH); R.setScissorTest(true); R.render(GS, gcam); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  var c = document.createElement('canvas'); c.width = GW; c.height = GH; c.getContext('2d').drawImage(R.domElement, 0, B.H - GH, GW, GH, 0, 0, GW, GH); return c;
};
})();
