/* Part B0 (Nvidia case file): timing helpers + dossier builders (folders, sheets, rubber stamps, plates, pins). Everything is a pure function of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return TM.words[k][1]; } } } window.__ws[id + '|' + subs] = ['MISS', +SP(id, f == null ? .5 : f).toFixed(2), +s.t0.toFixed(2), +s.t1.toFixed(2)]; return SP(id, f == null ? .5 : f); }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
var INK = 0x13172a, MANILA = 0xead9b4, PAPER = 0xf3ead2, COBALT = 0x2c4bd8, MARI = 0xffb300, TOMATO = 0xe1362f, GREEN = 0x1d9a69, VIOLET = 0x7b4bd0, GREY = 0x8a7a62;
var K = { INK: INK, MANILA: MANILA, PAPER: PAPER, COBALT: COBALT, MARI: MARI, TOMATO: TOMATO, GREEN: GREEN, VIOLET: VIOLET, GREY: GREY, HEX: e.HEX };
var B = window.B = { K: K };
/* live counter sprite (paper card, coloured edge) */
e.dyn = function (hh, w, h, col, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; var tx = e.canvasTex(c), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false, depthWrite: false })); s.renderOrder = 30; s.layers.set(1); s.scale.set(hh * w / h, hh, 1); s.userData = { lbl: true, kind: 'dyn', sx: hh * w / h, sy: hh, sz: 1, txt: 'DYN' }; e.LBL.push(s);
  s.draw = function (a, b, cc) { var x = c.getContext('2d'); x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(243,234,210,.98)'; x.fillRect(0, 0, w, h); x.fillStyle = e.HEX(col); x.fillRect(0, 0, 12, h); x.strokeStyle = 'rgba(19,23,42,.5)'; x.lineWidth = 3; x.strokeRect(1.5, 1.5, w - 3, h - 3); draw(x, a, b, cc, w, h); tx.needsUpdate = true; }; return s; };
function tcv(w, h, fn) { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); fn(x, w, h); return c; }
function plane(w, h, canvas, tr) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(canvas), transparent: !!tr, toneMapped: true })); }
function M(c, o) { return e.physMat(c, Object.assign({ roughness: .85, metalness: 0, envMapIntensity: .55 }, o || {})); }
function box(w, h, d, col, o) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(col, o)); }
B.tcv = tcv; B.plane = plane; B.M = M; B.box = box;
/* wrap text for canvas */
function wrap(x, txt, maxW) { var words = txt.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines; }
B.wrap = wrap;
/* paper mottling for the desk */
B.deskTex = function () { var c = tcv(1024, 1024, function (x, W, H) { x.fillStyle = '#ead9b4'; x.fillRect(0, 0, W, H); for (var i = 0; i < 2600; i++) { var g = hash(i * 3), a = hash(i * 7 + 1) * .1; x.fillStyle = 'rgba(' + (g > .5 ? '120,90,40' : '255,248,220') + ',' + a + ')'; var r = 3 + hash(i * 5 + 2) * 40; x.beginPath(); x.arc(hash(i * 11) * W, hash(i * 13 + 4) * H, r, 0, 6.283); x.fill(); } for (var j = 0; j < 7000; j++) { x.fillStyle = 'rgba(90,60,20,' + hash(j * 17) * .12 + ')'; x.fillRect(hash(j * 19) * W, hash(j * 23 + 3) * H, 1.5, 1.5); } });
  var t = e.canvasTex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 4); return t; };
/* a sheet of paper lying flat (+Y up), drawn from a canvas; w,h in world units, ppu pixels per unit */
B.sheet = function (w, h, draw, o) { o = o || {}; var ppu = o.ppu || 110, g = new THREE.Group(), cw = Math.round(w * ppu), ch = Math.round(h * ppu);
  var c = tcv(cw, ch, function (x) { x.fillStyle = o.bg || '#f3ead2'; x.fillRect(0, 0, cw, ch); for (var i = 0; i < 500; i++) { x.fillStyle = 'rgba(120,90,40,' + hash(i * 3) * .06 + ')'; x.fillRect(hash(i * 5) * cw, hash(i * 7 + 2) * ch, 2, 2); } draw(x, cw, ch); });
  var pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: e.canvasTex(c) })); pl.rotation.x = -Math.PI / 2; pl.position.y = .04; g.add(pl);
  var sh = new THREE.Mesh(new THREE.PlaneGeometry(w + .35, h + .35), new THREE.MeshBasicMaterial({ color: 0x3a2a10, transparent: true, opacity: .28 })); sh.rotation.x = -Math.PI / 2; sh.position.set(.12, .015, .14); g.add(sh);
  g.userData.canvas = c; g.userData.tex = pl.material.map; g.userData.paint = function (fn) { var x = c.getContext('2d'); x.fillStyle = o.bg || '#f3ead2'; x.fillRect(0, 0, cw, ch); fn(x, cw, ch); pl.material.map.needsUpdate = true; }; return g; };
/* manila folder lying on the desk (cover faces up), label plate on the cover */
B.folder = function (label, sub, o) { o = o || {}; var w = o.w || 6, h = o.h || 8.2, g = new THREE.Group();
  var back = box(w, .12, h, 0xd6bf86); back.position.y = .06; g.add(back); var tab = box(w * .34, .12, .7, 0xd6bf86); tab.position.set(-w * .26, .06, -h / 2 - .34); g.add(tab);
  var cov = box(w * .98, .1, h * .96, 0xe3cd96); cov.position.set(0, .17, .05); g.add(cov);
  var cv = tcv(512, Math.round(512 * h / w), function (x, W, H) { x.fillStyle = 'rgba(0,0,0,0)'; x.fillRect(0, 0, W, H); x.fillStyle = '#f3ead2'; x.fillRect(W * .08, H * .08, W * .84, H * .2); x.strokeStyle = '#13172a'; x.lineWidth = 5; x.strokeRect(W * .08, H * .08, W * .84, H * .2);
    x.fillStyle = '#13172a'; x.textBaseline = 'middle'; var fs = o.fs || 62; x.font = '700 ' + fs + 'px "JetBrains Mono"'; while (x.measureText(label).width > W * .78 && fs > 20) { fs -= 3; x.font = '700 ' + fs + 'px "JetBrains Mono"'; } x.fillText(label, W * .12, H * .15);
    if (sub) { x.font = '700 30px "JetBrains Mono"'; x.fillStyle = '#2c4bd8'; x.fillText(sub, W * .12, H * .245); }
    x.strokeStyle = 'rgba(19,23,42,.5)'; x.lineWidth = 4; x.setLineDash([14, 10]); x.strokeRect(W * .12, H * .36, W * .76, H * .5); x.setLineDash([]); if (o.slot) { x.fillStyle = 'rgba(19,23,42,.55)'; x.font = '700 ' + Math.round(W * .13) + 'px "Alfa Slab One"'; x.textAlign = 'center'; x.fillText(o.slot, W * .5, H * .6); x.font = '700 24px "JetBrains Mono"'; x.fillText('EVIDENCE', W * .5, H * .78); } });
  var lb = plane(w * .98, h * .96, cv, true); lb.rotation.x = -Math.PI / 2; lb.position.set(0, .225, .05); g.add(lb); g.userData.w = w; g.userData.h = h; return g; };
/* status stamp impression: double rounded rectangle + heavy text, rough edge, slightly tilted */
B.impress = function (txt, col, w, o) { o = o || {}; var h = w * (o.asp || .36), cw = 900, ch = Math.round(cw * (o.asp || .36));
  var c = tcv(cw, ch, function (x, W, H) { x.strokeStyle = col; x.fillStyle = col; x.lineWidth = 18; x.strokeRect(14, 14, W - 28, H - 28); x.lineWidth = 6; x.strokeRect(46, 46, W - 92, H - 92);
    x.textAlign = 'center'; x.textBaseline = 'middle'; var fs = o.fs || 150; x.font = '400 ' + fs + 'px "Alfa Slab One"'; while (x.measureText(txt).width > W - 130 && fs > 30) { fs -= 4; x.font = '400 ' + fs + 'px "Alfa Slab One"'; } x.fillText(txt, W / 2, H / 2 + 6);
    x.globalCompositeOperation = 'destination-out'; for (var i = 0; i < 1900; i++) { x.fillStyle = 'rgba(0,0,0,' + (.25 + hash(i * 3) * .6) + ')'; var r = 1 + hash(i * 7 + 1) * 5; x.beginPath(); x.arc(hash(i * 11) * W, hash(i * 13 + 5) * H, r, 0, 6.283); x.fill(); } });
  var m = plane(w, h, c, true); m.material.opacity = .94; m.userData.base = w; return m; };
/* rubber stamp tool (handle + block) that the slam animation moves; visual only */
B.stampTool = function (col) { var g = new THREE.Group(), blk = box(3.2, .7, 1.4, 0x1a1a22, { roughness: .5 }); blk.position.y = .35; g.add(blk); var rub = box(3.0, .18, 1.25, col == null ? TOMATO : col, { roughness: .9 }); rub.position.y = .0; g.add(rub); var hd = new THREE.Mesh(new THREE.CylinderGeometry(.45, .6, 1.8, 18), M(0x6b3a1c, { roughness: .45 })); hd.position.y = 1.5; g.add(hd); var kn = new THREE.Mesh(new THREE.SphereGeometry(.62, 18, 14), M(0x6b3a1c, { roughness: .45 })); kn.position.y = 2.5; g.add(kn); return g; };
/* slam: stamp tool drops (u in 0..1 over `dur`), impression pops on contact; returns contact flag. t absolute, t0 contact time */
B.slam = function (tool, imp, t, t0, sx, sz, rot, o) { o = o || {}; var dt = t - (t0 - .22), vis = dt > 0; if (tool) tool.visible = vis && t < t0 + .5; imp.visible = t >= t0;
  if (tool && tool.visible) { var u = clamp(dt / .22), y = lerp(5, 0.2, u * u); var up = clamp((t - t0 - .05) / .35); y += eo3(up) * 4; tool.position.set(sx, y, sz); tool.rotation.y = rot || 0; }
  if (imp.visible) { var k = clamp((t - t0) / .09), s = lerp(2.6, 1, k * k); var bn = t > t0 + .09 ? 1 + .05 * Math.exp(-(t - t0 - .09) * 14) * Math.cos((t - t0) * 40) : s; imp.scale.set(bn, bn, 1); imp.position.set(sx, o.y == null ? .27 : o.y, sz); imp.rotation.set(-Math.PI / 2, 0, (rot || 0) + (o.tilt || 0)); imp.material.opacity = .94 * clamp((t - t0) / .05); } return t >= t0; };
/* paperclip, pencil, coffee ring: clutter */
B.pencil = function () { var g = new THREE.Group(); var b = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, 5.2, 6), M(MARI, { roughness: .5 })); b.rotation.z = Math.PI / 2; g.add(b); var tip = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 6), M(0xe3c9a0)); tip.rotation.z = -Math.PI / 2; tip.position.x = 2.85; g.add(tip); var er = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .35, 6), M(0xd45a6a)); er.rotation.z = Math.PI / 2; er.position.x = -2.75; g.add(er); g.position.y = .2; return g; };
B.clip = function () { var m = new THREE.Mesh(new THREE.TorusGeometry(.35, .045, 8, 20), M(0xb8bcc8, { metalness: .8, roughness: .3 })); m.rotation.x = Math.PI / 2; m.scale.set(1, 1.8, 1); m.position.y = .22; return m; };
B.ring = function (r) { var m = new THREE.Mesh(new THREE.RingGeometry(r * .88, r, 40), new THREE.MeshBasicMaterial({ color: 0x6b4a22, transparent: true, opacity: .22, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.position.y = .03; return m; };
/* name plate (brass-like block with engraved text) */
B.plate = function (txt, sub) { var g = new THREE.Group(), b = box(4.6, .55, 1.5, 0x3a3346, { roughness: .45, metalness: .3 }); b.position.y = .28; g.add(b); var f = plane(4.3, 1.2, tcv(520, 150, function (x, W, H) { x.fillStyle = '#c7a24a'; x.fillRect(0, 0, W, H); x.fillStyle = '#2a2110'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.font = '700 70px "JetBrains Mono"'; x.fillText(txt, W / 2, H * .38); x.font = '700 28px "JetBrains Mono"'; x.fillText(sub, W / 2, H * .78); })); f.rotation.x = -Math.PI / 2; f.position.y = .565; g.add(f); return g; };
})();
