/* b_world: the mohalla (lane + chowk) at dusk, built procedurally + real GLB props */
(function () {
var T = THREE, S = B.S, cv = B.cv, hsh = B.hsh;
var W = B.WORLD = new T.Group(); S.add(W);
function std(c, r, m, e, ei) { return new T.MeshStandardMaterial({ color: c, roughness: r == null ? .85 : r, metalness: m || 0, emissive: e || 0, emissiveIntensity: ei == null ? 1 : ei }); }
B.std = std;
function box(w, h, d, mat, x, y, z, par) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; (par || W).add(o); return o; }
B.box = box;
function cyl(rt, rb, h, mat, x, y, z, seg, par) { var o = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg || 24), mat); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; (par || W).add(o); return o; }
B.cyl = cyl;

// ---- ground: stone-slab lane with drains, dusty chowk ----
var slab = cv(1024, 1024, function (g, w, h) {
  g.fillStyle = '#8f8a86'; g.fillRect(0, 0, w, h);
  for (var r = 0; r < 8; r++) for (var c = 0; c < 4; c++) { var k = hsh(r * 9 + c); g.fillStyle = 'hsl(' + (20 + k * 20) + ',' + (8 + k * 8) + '%,' + (50 + k * 10) + '%)'; g.fillRect(c * 256 + 4 + (r % 2) * 60, r * 128 + 4, 248, 120); }
  for (var i = 0; i < 2500; i++) { g.fillStyle = 'rgba(40,30,30,' + (hsh(i) * .12) + ')'; g.fillRect(hsh(i * 3) * w, hsh(i * 7) * h, 3, 3); }
});
slab.wrapS = slab.wrapT = T.RepeatWrapping; slab.repeat.set(2, 10);
var lane = new T.Mesh(new T.PlaneGeometry(4.4, 24), new T.MeshStandardMaterial({ map: slab, roughness: .9 })); lane.rotation.x = -Math.PI / 2; lane.position.set(0, 0, -2); lane.receiveShadow = true; W.add(lane);
var dust = new T.Mesh(new T.PlaneGeometry(60, 60), std(0xb08a6a, .95)); dust.rotation.x = -Math.PI / 2; dust.position.set(0, -.01, -10); dust.receiveShadow = true; W.add(dust);
[-2.25, 2.25].forEach(function (x) { box(.18, .06, 24, std(0x4b4a52, .7), x, .03, -2); });

// ---- houses: plastered blocks in saturated paint, windows, balconies, water tanks, parapets ----
var PAINT = [0x2ec4b6, 0xff6f91, 0xffd23f, 0x5aa9ff, 0x9b7bff, 0xff9248, 0x56d68c, 0xf7f0e3];
function winTex(lit) { return cv(128, 160, function (g, w, h) { g.fillStyle = lit ? '#ffcf7a' : '#1d2440'; g.fillRect(0, 0, w, h); if (lit) { var gr = g.createRadialGradient(64, 60, 4, 64, 80, 90); gr.addColorStop(0, '#fff2c8'); gr.addColorStop(1, '#ff9c3c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); } g.fillStyle = '#2b2b33'; for (var i = 1; i < 5; i++) g.fillRect(i * w / 5 - 2, 0, 4, h); g.fillRect(0, h / 2 - 2, w, 4); }); }
var WIN = [winTex(false), winTex(true)];
B.houses = [];
function house(side, z0, len, dep, flo, col, seed, opt) {
  opt = opt || {};
  var g = new T.Group(), fh = 3.1, h = flo * fh, xf = side * 2.25; // facade plane x
  var mW = std(col, .92), mT = std(new T.Color(col).multiplyScalar(.75), .9);
  box(dep, h, len, mW, xf + side * dep / 2, h / 2, z0, g);
  box(dep + .1, .35, len + .1, mT, xf + side * dep / 2, h + .17, z0, g); // parapet
  box(.06, .25, len, std(0xf3ead8, .8), xf + side * .03, fh - .1, z0, g); // floor band
  var nW = Math.max(1, Math.round(len / 2.2));
  for (var f = 0; f < flo; f++) for (var i = 0; i < nW; i++) {
    var z = z0 - len / 2 + (i + .5) * len / nW, y = f * fh + (f === 0 ? 1.35 : 1.6), lit = hsh(seed + f * 7 + i) > .45;
    if (f === 0 && i === opt.door) { box(.08, 2.1, 1.0, std(0x6b3b22, .7), xf + side * .02, 1.05, z, g); box(.04, 2.3, 1.2, std(0xf3ead8, .8), xf + side * .01, 1.15, z, g); continue; }
    if (f === 0 && opt.shutter === i) { var sh = cv(256, 256, function (gg, w, hh) { gg.fillStyle = '#9aa3ad'; gg.fillRect(0, 0, w, hh); for (var k = 0; k < 32; k++) { gg.fillStyle = k % 2 ? '#7f8892' : '#b3bcc5'; gg.fillRect(0, k * 8, w, 4); } }); box(.06, 2.3, 1.7, new T.MeshStandardMaterial({ map: sh, roughness: .6, metalness: .3 }), xf + side * .02, 1.15, z, g); continue; }
    box(.05, 1.25, .95, std(0xf3ead8, .8), xf + side * .02, y, z, g); // frame
    var gl = new T.Mesh(new T.PlaneGeometry(.8, 1.05), new T.MeshStandardMaterial({ map: WIN[lit ? 1 : 0], emissive: 0xffffff, emissiveMap: WIN[lit ? 1 : 0], emissiveIntensity: lit ? .9 : 0, roughness: .3 }));
    gl.position.set(xf + side * .05 * -1 + side * .1, y, z); gl.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(gl);
    box(.18, .06, 1.05, std(0xf3ead8, .8), xf - side * .06, y - .66, z, g); // sill
    if (f > 0 && hsh(seed + i * 3 + f) > .5) { // balcony + railing
      box(.8, .1, 1.5, std(0xe8e0d0, .8), xf - side * .4, y - .78, z, g);
      for (var k = 0; k < 7; k++) box(.03, .55, .03, std(0x2a2a33, .5, .6), xf - side * .78, y - .48, z - .7 + k * .233, g);
      box(.04, .04, 1.5, std(0x2a2a33, .5, .6), xf - side * .78, y - .2, z, g);
    }
  }
  // black water tank on the roof (Indian rooftop) + pipe
  if (!opt.noTank) { var tx = xf + side * (dep * .55), tz = z0 + (hsh(seed) - .5) * len * .4; cyl(.45, .5, .9, std(0x16161a, .45), tx, h + .8, tz, 20, g); box(.95, .35, .95, std(0x9a9488, .9), tx, h + .17 + .18, tz, g); }
  W.add(g); B.houses.push(g); return g;
}
// left (side -1) and right (side +1) of the lane, front (z+) to the chowk (z-)
house(-1, 3.6, 4.2, 5, 2, PAINT[0], 11, { shutter: 0 });
house(-1, -.9, 4.8, 5, 3, PAINT[2], 23, { door: 1 });
house(-1, -5.6, 4.6, 5, 2, PAINT[1], 37, { door: 0 });
house(1, 4.1, 3.2, 5, 3, PAINT[3], 41, {});
house(1, .3, 4.4, 5, 2, PAINT[6], 53, { door: 1 });
house(1, -4.4, 5.0, 5, 3, PAINT[4], 67, { shutter: 1 });
// chowk back walls (behind the well)
var back = [[-6, -15.5, 5, PAINT[6], 2], [-1, -16, 5, PAINT[1], 1], [4.5, -15.5, 5, PAINT[3], 2]];
back.forEach(function (q, i) { var mW = std(q[3], .92); var hgt = q[4] * 3.1; box(q[2], hgt, 3, mW, q[0], hgt / 2, q[1], W);
  for (var f = 0; f < q[4]; f++) for (var k = 0; k < 2; k++) { var lit = hsh(i * 9 + f * 3 + k) > .4; var gl = new T.Mesh(new T.PlaneGeometry(.8, 1.05), new T.MeshStandardMaterial({ map: WIN[lit ? 1 : 0], emissive: 0xffffff, emissiveMap: WIN[lit ? 1 : 0], emissiveIntensity: lit ? 1 : 0 })); gl.position.set(q[0] - 1.2 + k * 2.4, f * 3.1 + 1.6, q[1] + 1.52); W.add(gl); }
  cyl(.45, .5, .9, std(0x16161a, .45), q[0] + 1, hgt + .45, q[1], 20, W); });
// side walls closing the chowk
box(3, 6.2, 9, std(PAINT[0], .92), -7, 3.1, -11.5); box(3, 6.2, 9, std(PAINT[2], .92), 7, 3.1, -11.5);

// ---- overhead electric wires (catenary) ----
function wire(a, b, sag, col) { var pts = []; for (var i = 0; i <= 24; i++) { var u = i / 24, p = new T.Vector3().lerpVectors(a, b, u); p.y -= sag * 4 * u * (1 - u); pts.push(p); } var m = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, .012, 4), std(col || 0x15151a, .6)); W.add(m); return m; }
[[-2.25, 6.6, 4, 2.25, 6.4, 3], [-2.25, 6.9, 1, 2.25, 6.2, 2.5], [-2.25, 6.3, -2, 2.25, 6.8, -1.2], [-2.25, 6.5, -4.6, 2.25, 6.6, -3.2], [-2.25, 6.2, 2, 2.25, 6.6, -2]].forEach(function (q, i) { wire(new T.Vector3(q[0], q[1], q[2]), new T.Vector3(q[3], q[4], q[5]), .45 + i * .08); });
// festive bulb string over the chowk
B.bulbs = [];
(function () { var a = new T.Vector3(-5.5, 5, -9), b = new T.Vector3(5.5, 5.2, -9.4); for (var i = 0; i < 18; i++) { var u = (i + .5) / 18, p = new T.Vector3().lerpVectors(a, b, u); p.y -= 1.0 * 4 * u * (1 - u); var bb = new T.Mesh(new T.SphereGeometry(.06, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(['#ffd76a', '#ff6fa8', '#7fe0ff', '#9dff8a'][i % 4]).multiplyScalar(2.2), toneMapped: false })); bb.position.copy(p); W.add(bb); B.bulbs.push(bb); } wire(a, b, 1.0); })();

// ---- moon (for the well) ----
var moonTex = cv(256, 256, function (g, w, h) { var gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, '#fffbe8'); gr.addColorStop(.62, '#fff3cc'); gr.addColorStop(.7, 'rgba(255,240,200,.35)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(200,190,160,.35)'; [[100, 110, 18], [150, 90, 12], [140, 150, 22]].forEach(function (c) { g.beginPath(); g.arc(c[0], c[1], c[2], 0, 7); g.fill(); }); });
var moon = B.moon = new T.Mesh(new T.PlaneGeometry(9, 9), new T.MeshBasicMaterial({ map: moonTex, transparent: true, depthWrite: false, toneMapped: false, color: new T.Color(1.6, 1.6, 1.5) }));
moon.position.set(-14, 34, -70); moon.lookAt(0, 1, 0); S.add(moon);

// ---- the well (chowk centre) ----
var WELL = B.WELL = new T.Group(); WELL.position.set(.4, 0, -11.2); W.add(WELL);
var wTex = cv(512, 128, function (g, w, h) { g.fillStyle = '#f2ece0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8402e'; g.fillRect(0, h * .62, w, h * .14); for (var i = 0; i < 400; i++) { g.fillStyle = 'rgba(120,100,80,' + hsh(i) * .15 + ')'; g.fillRect(hsh(i * 3) * w, hsh(i * 5) * h, 4, 2); } });
var ring = new T.Mesh(new T.CylinderGeometry(1.0, 1.05, .85, 40, 1, true), new T.MeshStandardMaterial({ map: wTex, roughness: .9, side: T.DoubleSide })); ring.position.y = .425; ring.castShadow = ring.receiveShadow = true; WELL.add(ring);
var lip = new T.Mesh(new T.TorusGeometry(1.02, .09, 8, 40), std(0xe9e2d4, .85)); lip.rotation.x = Math.PI / 2; lip.position.y = .86; lip.castShadow = true; WELL.add(lip);
var inner = new T.Mesh(new T.CylinderGeometry(.93, .93, .8, 40, 1, true), std(0x2b2622, .95)); inner.material.side = T.BackSide; inner.position.y = .42; WELL.add(inner);
var waterTex = cv(512, 512, function (g, w, h) { g.fillStyle = '#0c1430'; g.fillRect(0, 0, w, h); var gr = g.createRadialGradient(w * .42, h * .4, 4, w * .42, h * .4, 70); gr.addColorStop(0, '#fffbe6'); gr.addColorStop(.45, '#fff2c0'); gr.addColorStop(.6, 'rgba(255,240,190,.3)'); gr.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(160,190,255,.25)'; g.lineWidth = 2; for (var r = 1; r < 6; r++) { g.beginPath(); g.ellipse(w * .42, h * .4, 40 + r * 34, 30 + r * 26, 0, 0, 7); g.stroke(); } });
var water = B.water = new T.Mesh(new T.CircleGeometry(.93, 40), new T.MeshBasicMaterial({ map: waterTex, toneMapped: false })); water.rotation.x = -Math.PI / 2; water.position.y = .62; WELL.add(water);
// pulley frame + bucket
[-1, 1].forEach(function (s) { box(.12, 1.6, .12, std(0x5a3a22, .8), s * .95, 1.2, 0, WELL); });
box(2.1, .12, .12, std(0x5a3a22, .8), 0, 2.0, 0, WELL);
var pul = new T.Mesh(new T.TorusGeometry(.13, .035, 8, 20), std(0x3a3a40, .4, .7)); pul.position.set(0, 1.86, 0); WELL.add(pul);
var rope = new T.Mesh(new T.CylinderGeometry(.008, .008, 1.0, 5), std(0xc9a46a, .9)); rope.position.set(.13, 1.36, 0); WELL.add(rope);
var bucket = new T.Mesh(new T.CylinderGeometry(.16, .12, .24, 16), std(0x9aa0a8, .35, .8)); bucket.position.set(.13, .98, 0); bucket.castShadow = true; WELL.add(bucket);
B.wellPick = [ring, lip, water, bucket];

// ---- the jaali: freestanding carved sandstone screen at the chowk mouth ----
var J = B.JAALI = new T.Group(); J.position.set(0, 0, -7.4); W.add(J);
var JN = B.JN = 8, JS = 1.7; B.JS_HALF = JS / 2 + .02; var jc = JS / JN, jh = jc * .66;
(function () {
  var sh = new T.Shape(); sh.moveTo(-JS / 2 - .12, -JS / 2 - .12); sh.lineTo(JS / 2 + .12, -JS / 2 - .12); sh.lineTo(JS / 2 + .12, JS / 2 + .12); sh.lineTo(-JS / 2 - .12, JS / 2 + .12); sh.lineTo(-JS / 2 - .12, -JS / 2 - .12);
  for (var r = 0; r < JN; r++) for (var c = 0; c < JN; c++) { var cx = -JS / 2 + (c + .5) * jc, cy = -JS / 2 + (r + .5) * jc, hh = new T.Path(), q = jh / 2, k = q * .35;
    hh.moveTo(cx - q + k, cy - q); hh.lineTo(cx + q - k, cy - q); hh.quadraticCurveTo(cx + q, cy - q, cx + q, cy - q + k); hh.lineTo(cx + q, cy + q - k); hh.quadraticCurveTo(cx + q, cy + q, cx + q - k, cy + q); hh.lineTo(cx - q + k, cy + q); hh.quadraticCurveTo(cx - q, cy + q, cx - q, cy + q - k); hh.lineTo(cx - q, cy - q + k); hh.quadraticCurveTo(cx - q, cy - q, cx - q + k, cy - q); sh.holes.push(hh); }
  var stTex = cv(512, 512, function (g, w, h) { g.fillStyle = '#d8915a'; g.fillRect(0, 0, w, h); for (var i = 0; i < 3000; i++) { g.fillStyle = 'rgba(' + (hsh(i) > .5 ? '255,220,170' : '120,60,30') + ',' + hsh(i * 3) * .18 + ')'; g.fillRect(hsh(i * 5) * w, hsh(i * 7) * h, 3, 2); } });
  stTex.wrapS = stTex.wrapT = T.RepeatWrapping; stTex.repeat.set(1.2, 1.2);
  var geo = new T.ExtrudeGeometry(sh, { depth: .09, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 2, curveSegments: 4 });
  var m = new T.Mesh(geo, new T.MeshStandardMaterial({ map: stTex, roughness: .88, color: 0xffffff })); m.position.set(0, 1.45, -.045); m.castShadow = m.receiveShadow = true; J.add(m); B.jaaliMesh = m;
  box(JS + .5, .6, .4, std(0xc47c48, .9), 0, .3, 0, J); // plinth
  box(JS + .55, .14, .3, std(0xc47c48, .9), 0, 1.45 + JS / 2 + .2, 0, J); // top cornice
  [-1, 1].forEach(function (s) { box(.18, JS + .5, .26, std(0xc47c48, .9), s * (JS / 2 + .2), 1.45, 0, J); });
})();
// one flat-colour "pixel" tile inside every hole (invisible until its thread arrives)
B.jPix = [];
for (var r = 0; r < JN; r++) for (var c = 0; c < JN; c++) {
  var pm = new T.Mesh(new T.PlaneGeometry(jh * .98, jh * .98), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false }));
  pm.position.set(-JS / 2 + (c + .5) * jc, 1.45 - JS / 2 + (r + .5) * jc, .0); J.add(pm); B.jPix.push({ m: pm, r: r, c: c });
}

// ---- rangoli doorstep (in front of the right house's door) ----
B.RANG = new T.Group(); B.RANG.position.set(1.15, .006, .3); W.add(B.RANG);

// ---- chai stall (left, front) ----
var STALL = B.STALL = new T.Group(); STALL.position.set(-1.55, 0, 2.6); W.add(STALL);
box(1.3, .95, 2.4, std(0x8a5a32, .75), 0, .475, 0, STALL); // wooden counter
box(1.4, .06, 2.5, std(0x5e3a1e, .6), 0, .98, 0, STALL);
var tarpT = cv(256, 256, function (g, w, h) { for (var i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#1f6fd6' : '#ff8a1f'; g.fillRect(0, i * 32, w, 32); } });
var tarp = new T.Mesh(new T.PlaneGeometry(1.7, 2.6), new T.MeshStandardMaterial({ map: tarpT, roughness: .8, side: T.DoubleSide })); tarp.position.set(.25, 2.6, 0); tarp.rotation.set(0, Math.PI / 2, 0); tarp.rotateX(-.35); tarp.castShadow = true; STALL.add(tarp);
[[-.6, 1.2], [-.6, -1.2], [1.1, 1.2], [1.1, -1.2]].forEach(function (p) { box(.05, 2.4, .05, std(0x3b3b44, .5, .5), p[0], 1.2, p[1], STALL); });
var bulb = new T.Mesh(new T.SphereGeometry(.07, 12, 10), new T.MeshBasicMaterial({ color: new T.Color(3, 2.4, 1.4), toneMapped: false })); bulb.position.set(.35, 2.05, 0); STALL.add(bulb);
var bl = new T.PointLight(0xffb060, 6, 6, 1.6); bl.position.set(.35, 1.95, 0); STALL.add(bl);
var bench = box(.4, .45, 1.6, std(0x6b4426, .8), 1.2, .225, -.2, STALL);
// glass jars of biscuits on the counter
for (var i = 0; i < 3; i++) { var jar = new T.Mesh(new T.CylinderGeometry(.09, .09, .22, 16), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .05, transmission: .7, thickness: .05 })); jar.position.set(-.3, 1.12, -.9 + i * .22); STALL.add(jar); var bis = new T.Mesh(new T.CylinderGeometry(.075, .075, .14, 12), std(['#e0a050', '#d8604a', '#f0d070'][i], .8)); bis.position.set(-.3, 1.08, -.9 + i * .22); STALL.add(bis); }
B.placeProps = function () {
  B.prop('tea_set_01', -.05, 1.01, .35, Math.PI / 2, 1, STALL);
  B.prop('vintage_electric_kettle', -.2, 1.01, -.35, .4, 1.1, STALL);
  B.prop('brass_pot_01', .15, 1.01, -.65, 0, 1, STALL);
  B.prop('brass_pot_02', .3, 1.01, .85, 0, 1, STALL);
  B.prop('plastic_crate_02', .9, 0, 1.25, .3, 1, STALL);
  B.prop('plastic_crate_03', .95, .25, 1.2, -.2, 1, STALL);
  B.prop('barrel_03', -2.6, 0, -3.2, .4, .85);
  B.prop('utility_box_02', 2.42, 0, 1.9, -Math.PI / 2, .9);
  B.prop('wicker_basket_01', 1.9, .0, -1.6, .5, 1.2);
  B.prop('delivery_scooter', -1.5, 0, -2.6, .25, .9);
  var lamps = [[-2.2, 3.0, -3.2, Math.PI / 2], [2.2, 3.0, -1.4, -Math.PI / 2], [-2.2, 3.0, -7.2, Math.PI / 2]];
  lamps.forEach(function (q) { B.prop('street_lamp_02', q[0], q[1], q[2], q[3], 1); var pl = new T.PointLight(0xffb870, 5, 7, 1.7); pl.position.set(q[0] + (q[0] > 0 ? -.55 : .55), q[1] + 1.2, q[2]); W.add(pl); var g = new T.Mesh(new T.SphereGeometry(.09, 10, 8), new T.MeshBasicMaterial({ color: new T.Color(3, 2.3, 1.3), toneMapped: false })); g.position.copy(pl.position); g.position.y -= .1; W.add(g); });
};

// ---- voxel figures (blocky, faceless) ----
B.voxel = function (o) {
  o = o || {}; var s = o.s || 1, g = new T.Group(), P = {};
  var mSkin = std(o.skin || 0xb57a52, .8), mTop = std(o.top || 0xffd23f, .8), mBot = std(o.bot || 0x2f4fa8, .8), mHair = std(o.hair || 0x1a1412, .9), mShoe = std(0x22222a, .7);
  function part(w, h, d, m, x, y, z, par) { var b = new T.Mesh(new T.BoxGeometry(w * s, h * s, d * s), m); b.position.set(x * s, y * s, z * s); b.castShadow = true; b.receiveShadow = true; (par || g).add(b); return b; }
  function pivot(x, y, z) { var p = new T.Group(); p.position.set(x * s, y * s, z * s); g.add(p); return p; }
  P.legL = pivot(-.09, .62, 0); part(.15, .56, .17, mBot, 0, -.28, 0, P.legL); part(.16, .08, .24, mShoe, 0, -.58, .03, P.legL);
  P.legR = pivot(.09, .62, 0); part(.15, .56, .17, mBot, 0, -.28, 0, P.legR); part(.16, .08, .24, mShoe, 0, -.58, .03, P.legR);
  P.torso = part(.36, .48, .22, mTop, 0, .86, 0);
  P.armL = pivot(-.23, 1.06, 0); part(.11, .44, .13, mTop, 0, -.12, 0, P.armL); part(.1, .14, .11, mSkin, 0, -.38, 0, P.armL);
  P.armR = pivot(.23, 1.06, 0); part(.11, .44, .13, mTop, 0, -.12, 0, P.armR); part(.1, .14, .11, mSkin, 0, -.38, 0, P.armR);
  P.head = pivot(0, 1.12, 0); part(.3, .3, .28, mSkin, 0, .17, 0, P.head); part(.32, .1, .3, mHair, 0, .34, -.01, P.head); part(.32, .2, .08, mHair, 0, .24, -.13, P.head);
  g.userData.P = P; g.userData.s = s; return g;
};
var kid = B.KID = B.voxel({ s: 1.12, top: 0xffd23f, bot: 0x2f4fa8, skin: 0xa86f48 }); kid.position.set(.45, 0, 1.9); kid.rotation.y = Math.PI * .92; W.add(kid);
// phone held in both hands, landscape
var KP = kid.userData.P; KP.armL.rotation.set(-1.42, 0, .42); KP.armR.rotation.set(-1.42, 0, -.42); KP.head.rotation.x = .15;
var phone = B.PHONE = new T.Group(); phone.position.set(0, 1.06 * 1.12, .46 * 1.12); phone.rotation.set(.8, Math.PI, 0); kid.add(phone);
var pBody = new T.Mesh(new T.BoxGeometry(.165, .078, .009), std(0x15151c, .3, .6)); phone.add(pBody);
B.phoneScreen = new T.Mesh(new T.PlaneGeometry(.152, .07), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); B.phoneScreen.position.z = .0047; phone.add(B.phoneScreen);
})();
