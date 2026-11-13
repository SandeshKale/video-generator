/* b2_props: scene props for the full build — phone pixel shader, thread spools, wall clock, hoarding + scaffold + painter, flip-book, console vs PC */
(function () {
var T = THREE, S = B.S, W = B.WORLD, std = B.std, box = B.box, cyl = B.cyl, cv = B.cv, hsh = B.hsh, C = B.C;

// ---- phone screen: game texture with optional pixelation + grid (pixel = one hole of the jaali) ----
B.phoneMat = new T.ShaderMaterial({
  uniforms: { map: { value: null }, blocks: { value: new T.Vector2(0, 0) }, grid: { value: 0 }, dim: { value: 1 } },
  vertexShader: 'varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform sampler2D map; uniform vec2 blocks; uniform float grid, dim; varying vec2 vU;' +
    'void main(){ vec2 uv = vU; vec2 f = vec2(.5); if (blocks.x > .5) { uv = (floor(vU*blocks)+.5)/blocks; f = fract(vU*blocks); }' +
    ' vec3 c = texture2D(map, uv).rgb*dim; float e = min(min(f.x,1.-f.x)*blocks.x, min(f.y,1.-f.y)*blocks.y)/max(1.,blocks.x/40.);' +
    ' c = mix(c, vec3(.02,.02,.05), grid*(1.-smoothstep(.0,.08,min(min(f.x,1.-f.x), min(f.y,1.-f.y))))); gl_FragColor = vec4(c,1.); }'
});
B.phoneScreen.material = B.phoneMat;

// ---- thread spools that rain into the lane (instanced; positions are a pure function of t) ----
var NSP = B.NSP = 520, spG = new T.CylinderGeometry(.075, .075, .13, 14); spG.rotateZ(Math.PI / 2);
spG.scale(1.6, 1.6, 1.6); var spM = new T.MeshStandardMaterial({ roughness: .7 }), SP = B.SPOOLS = new T.InstancedMesh(spG, spM, NSP); SP.castShadow = SP.receiveShadow = true; S.add(SP);
var SPC = ['#ffb21e', '#fff1b8', '#ff3f8e', '#2ec4b6', '#5aa9ff', '#ffd23f'], cols = [];
B.SPD = [];
for (var i = 0; i < NSP; i++) {
  var x = -1.9 + hsh(i * 1.3) * 3.8, z = -1.2 + hsh(i * 2.7) * 4.6, layer = Math.floor(i / 70);
  B.SPD.push({ x: x, z: z, y: .12 + layer * .2 + hsh(i * 5.1) * .03, ry: hsh(i * 9.9) * 6.28, d: hsh(i * 4.4) });
  SP.setColorAt(i, new T.Color(SPC[i % SPC.length]));
}
SP.instanceColor.needsUpdate = true; SP.visible = false;
var m4 = new T.Matrix4(), q4 = new T.Quaternion(), e4 = new T.Euler(), v4 = new T.Vector3(), s4 = new T.Vector3(1, 1, 1);
// u in [0,1]: share of spools that have landed (they drop from above in order)
B.spoolsAt = function (u, t) {
  for (var i = 0; i < NSP; i++) {
    var d = B.SPD[i], ti = i / NSP, k = B.clamp((u - ti) / .07), y = k >= 1 ? d.y : d.y + 7 * (1 - k * k);
    e4.set(k < 1 ? t * 6 + i : 0, d.ry, 0); q4.setFromEuler(e4); v4.set(d.x, k > 0 ? y : -5, d.z); m4.compose(v4, q4, s4); SP.setMatrixAt(i, m4);
  }
  SP.instanceMatrix.needsUpdate = true;
};

// ---- wall clock on the yellow house (for "Cars: 17 ghante / tasveer") ----
var CLK = B.CLOCK = new T.Group(); CLK.position.set(-2.18, 4.15, -1.0); CLK.rotation.y = Math.PI / 2; W.add(CLK);
var face = cv(512, 512, function (g, w, h) { g.fillStyle = '#fff7e6'; g.beginPath(); g.arc(256, 256, 250, 0, 7); g.fill(); g.strokeStyle = '#1b1d3a'; g.lineWidth = 18; g.stroke();
  g.fillStyle = '#1b1d3a'; g.font = '700 64px Fredoka'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (var k = 1; k <= 12; k++) { var a = k / 12 * Math.PI * 2; g.fillText(String(k), 256 + Math.sin(a) * 190, 256 - Math.cos(a) * 190); } });
var cf = new T.Mesh(new T.CircleGeometry(.55, 48), new T.MeshStandardMaterial({ map: face, roughness: .6 })); cf.position.z = .05; CLK.add(cf);
var rim = new T.Mesh(new T.TorusGeometry(.56, .045, 10, 48), std(0xc8402e, .5)); rim.position.z = .05; CLK.add(rim);
var back = cyl(.58, .58, .08, std(0x3a2a22, .6), 0, 0, 0, 40, CLK); back.rotation.x = Math.PI / 2;
B.hHour = new T.Group(); B.hMin = new T.Group(); B.hHour.position.z = B.hMin.position.z = .07; CLK.add(B.hHour); CLK.add(B.hMin);
box(.04, .3, .02, std(0x1b1d3a, .5), 0, .14, 0, B.hHour); box(.03, .44, .02, std(0xff3f8e, .5), 0, .21, .01, B.hMin);
B.clockAt = function (hours) { B.hMin.rotation.z = -hours * Math.PI * 2; B.hHour.rotation.z = -hours / 12 * Math.PI * 2; };

// ---- cinema hoarding (portrait poster) on bamboo scaffolding, chowk left wall ----
var HD = B.HOARD = new T.Group(); HD.position.set(-5.42, 0, -11.6); HD.rotation.y = Math.PI / 2; W.add(HD);
var PW = 2.6, PH = 3.64, PY = 2.75;
var poster = B.posterTex = cv(600, 840, function (g, w, h) { g.fillStyle = '#efe6d2'; g.fillRect(0, 0, w, h); });
var pm = new T.Mesh(new T.PlaneGeometry(PW, PH), new T.MeshStandardMaterial({ map: poster, roughness: .85 })); pm.position.set(0, PY, .04); pm.receiveShadow = true; HD.add(pm);
box(PW + .2, PH + .2, .06, std(0x2a2a33, .5, .4), 0, PY, 0, HD); // frame
[-1, 1].forEach(function (s) { box(.08, PY + PH / 2 + .3, .08, std(0x2a2a33, .5, .4), s * (PW / 2 + .05), (PY + PH / 2 + .3) / 2, -.05, HD); });
var bamboo = std(0xc9a25a, .7);
[-1.55, 1.55].forEach(function (x) { cyl(.035, .035, 5.2, bamboo, x, 2.6, .75, 8, HD); });
[.75, 2.05, 3.35].forEach(function (y) { var c = cyl(.03, .03, 3.4, bamboo, 0, y, .75, 8, HD); c.rotation.z = Math.PI / 2; box(3.3, .05, .38, std(0x8a6a3a, .8), 0, y + .05, .6, HD); });
// the small photo clipped to the scaffold (what the painter copies)
var small = B.smallTex = cv(120, 168, function (g, w, h) { g.fillStyle = '#ccc'; g.fillRect(0, 0, w, h); });
small.magFilter = T.NearestFilter; small.minFilter = T.NearestFilter;
var sp = B.smallPhoto = new T.Mesh(new T.PlaneGeometry(.42, .59), new T.MeshBasicMaterial({ map: small, toneMapped: false, color: new T.Color(.95, .95, .95) })); sp.position.set(-1.0, 1.25, .95); sp.rotation.y = .2; HD.add(sp);
box(.5, .67, .02, std(0xfff7e6, .7), -1.0, 1.25, .935, HD).rotation.y = .2;
var PAINTER = B.PAINTER = B.voxel({ s: 1.0, top: 0x2ec4b6, bot: 0x3a3a48, skin: 0x8a5a3a, hair: 0xf3ead8 }); HD.add(PAINTER); PAINTER.rotation.y = Math.PI;
var brush = new T.Mesh(new T.BoxGeometry(.05, .3, .05), std(0x8a5a32, .7)); brush.position.set(0, -.5, 0); PAINTER.userData.P.armR.add(brush);
var tip = new T.Mesh(new T.BoxGeometry(.07, .08, .07), std(0xff3f8e, .5)); tip.position.set(0, -.67, 0); PAINTER.userData.P.armR.add(tip);
B.HD_PW = PW; B.HD_PH = PH; B.HD_PY = PY;

// ---- flip-book: an exercise "copy" on the stall bench, its corner pages flip (rough.js drawings) ----
var FB = B.FLIP = new T.Group(); FB.position.set(-.38, .455, 2.25); FB.rotation.y = .35; W.add(FB);
var cover = box(.25, .012, .33, std(0x2f5bd6, .6), 0, .006, 0, FB);
var label = cv(256, 128, function (g, w, h) { g.fillStyle = '#fff7e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f5bd6'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#1b1d3a'; g.font = '700 46px Caveat'; g.textAlign = 'center'; g.fillText('Rough Copy', w / 2, 72); });
var lb = new T.Mesh(new T.PlaneGeometry(.14, .07), new T.MeshStandardMaterial({ map: label })); lb.rotation.x = -Math.PI / 2; lb.position.set(0, .0125, -.07); FB.add(lb);
// 8 pages hinged at the spine (left edge); drawn: a cricket ball flying across, stumps at the right
B.flipPages = [];
var NP = 8, pgW = .24, pgH = .32;
for (var i = 0; i < NP; i++) {
  var real = i % 4 === 0;
  var tx = cv(384, 512, (function (i, real) { return function (g, w, h) {
    g.fillStyle = '#fffdf3'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,120,220,.35)'; g.lineWidth = 2; for (var y = 60; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = 'rgba(220,60,60,.5)'; g.beginPath(); g.moveTo(44, 0); g.lineTo(44, h); g.stroke();
    var rc = rough.canvas(g.canvas);
    rc.line(60, 430, 360, 430, { stroke: '#2a5a2a', strokeWidth: 3, roughness: 1.5, seed: 3 }); // ground
    [318, 334, 350].forEach(function (x, k) { rc.line(x, 430, x, 330, { stroke: '#7a4a22', strokeWidth: 5, roughness: .8, seed: 10 + k }); });
    var u = i / (NP - 1), bx = 80 + u * 220, by = 300 - Math.sin(u * Math.PI) * 170 + u * 40;
    rc.circle(bx, by, 44, { fill: '#d8342a', fillStyle: 'solid', stroke: '#7a1010', strokeWidth: 2, roughness: 1.2, seed: 20 + i });
    rc.line(bx - 14, by - 8, bx + 14, by + 8, { stroke: '#fff', strokeWidth: 2, seed: 40 + i });
    g.fillStyle = real ? '#ffb21e' : '#ff3f8e'; g.fillRect(0, 0, w, 54); g.fillStyle = real ? '#1b1d3a' : '#fff7e6'; g.font = '700 40px Fredoka'; g.textAlign = 'center'; g.fillText(real ? 'ASLI ' + (i / 4 + 1) : 'AI', w / 2, 41);
    g.strokeStyle = real ? '#ffb21e' : '#ff3f8e'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
  }; })(i, real));
  var hinge = new T.Group(); hinge.position.set(-pgW / 2, .013 + (NP - i) * .0012, 0); FB.add(hinge);
  var pg = new T.Mesh(new T.PlaneGeometry(pgW, pgH), new T.MeshStandardMaterial({ map: tx, roughness: .9, side: T.DoubleSide })); pg.rotation.x = -Math.PI / 2; pg.position.x = pgW / 2; pg.castShadow = true; hinge.add(pg);
  B.flipPages.push({ h: hinge, m: pg, real: real });
}
// flip position f (pages 0..NP): pages with index < f are turned over (rotated about the spine), the current one is mid-flip
B.flipAt = function (f) { B.flipPages.forEach(function (p, i) { var k = B.clamp(f - i); p.h.rotation.z = Math.PI * B.eio(k) * .985; p.h.position.y = .013 + (k > .5 ? i : B.flipPages.length - i) * .0012; }); };

// ---- console vs PC on a small table in the lane ----
var TB = B.TABLE = new T.Group(); TB.position.set(.9, 0, 3.6); W.add(TB);
box(1.6, .06, .8, std(0x8a5a32, .7), 0, .76, 0, TB); [[-.72, -.33], [.72, -.33], [-.72, .33], [.72, .33]].forEach(function (p) { box(.06, .76, .06, std(0x5e3a1e, .7), p[0], .38, p[1], TB); });
function logoTex(path, w, h, bg, fg, txt, sub) { return cv(w, h, function (g) { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.textAlign = 'center'; g.font = '700 ' + Math.round(h * .16) + 'px Fredoka'; g.fillText(txt, w / 2, h * .78); if (sub) { g.font = '600 ' + Math.round(h * .09) + 'px Inter'; g.fillText(sub, w / 2, h * .92); } }); }
B.consoleTex = logoTex(null, 256, 400, '#f3f3f6', '#1b1d3a', 'PS5 · XBOX', 'CONSOLE');
B.pcTex = logoTex(null, 256, 400, '#121418', '#76b900', 'NVIDIA', 'PC + GPU');
var cons = B.CONS = new T.Group(); cons.position.set(-.42, .79, 0); TB.add(cons);
var cb = new T.Mesh(new T.BoxGeometry(.2, .46, .36), [std(0xf3f3f6, .4), std(0xf3f3f6, .4), std(0xf3f3f6, .4), std(0xf3f3f6, .4), new T.MeshStandardMaterial({ map: B.consoleTex, roughness: .4 }), std(0xf3f3f6, .4)]); cb.position.y = .23; cb.castShadow = true; cons.add(cb);
box(.08, .47, .37, std(0x15151a, .4), 0, .235, 0, cons);
var pc = B.PC = new T.Group(); pc.position.set(.42, .79, 0); TB.add(pc);
var pb = new T.Mesh(new T.BoxGeometry(.24, .5, .44), [std(0x121418, .4, .3), std(0x121418, .4, .3), std(0x121418, .4, .3), std(0x121418, .4, .3), new T.MeshStandardMaterial({ map: B.pcTex, roughness: .4 }), std(0x121418, .4, .3)]); pb.position.y = .25; pb.castShadow = true; pc.add(pb);
B.gpuGlow = new T.Mesh(new T.BoxGeometry(.01, .06, .3), new T.MeshBasicMaterial({ color: new T.Color(.6, 1.6, .2), toneMapped: false })); B.gpuGlow.position.set(-.125, .22, 0); pc.add(B.gpuGlow);
// load real brand marks (nominative use) onto the fronts
B.loadLogos = function () {
  function draw(tex, url, col, x, y, s) { return new Promise(function (res) { fetch(url).then(function (r) { return r.text(); }).then(function (svg) { svg = svg.replace('<svg ', '<svg fill="' + col + '" '); var im = new Image(); im.onload = function () { tex.userData.g.drawImage(im, x, y, s, s); tex.needsUpdate = true; res(); }; im.onerror = res; im.src = 'data:image/svg+xml;base64,' + btoa(svg); }).catch(res); }); }
  return Promise.all([draw(B.consoleTex, 'logos/playstation5.svg', '#1b1d3a', 48, 60, 160), draw(B.pcTex, 'logos/nvidia.svg', '#76b900', 48, 60, 160)]);
};

// ---- game frames as canvases (portrait for the poster, low-res for the small photo) ----
B.gameShot = function (t, w, h, pose) {
  var R = B.R, gc = B.gcam, ox = gc.aspect, of = gc.fov; B.renderGame(t);
  if (pose) { gc.position.set(pose[0], pose[1], pose[2]); gc.lookAt(pose[3], pose[4], pose[5]); }
  gc.aspect = w / h; gc.fov = pose ? pose[6] : of; gc.updateProjectionMatrix();
  R.setRenderTarget(null); R.setViewport(0, 0, w, h); R.setScissor(0, 0, w, h); R.setScissorTest(true); R.render(B.GS, gc); R.setScissorTest(false); R.setViewport(0, 0, B.W, B.H);
  gc.aspect = ox; gc.fov = of; gc.updateProjectionMatrix();
  var c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(R.domElement, 0, B.H - h, w, h, 0, 0, w, h); return c;
};
})();
