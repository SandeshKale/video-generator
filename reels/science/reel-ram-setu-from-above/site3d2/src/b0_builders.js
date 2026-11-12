/* Ram Setu v2 "Survey Window" (LiDAR Survey grammar) — Part B0: timing helpers, real-data plate (NASA HLS image draped on an image-derived relief), real ICESat-2 photon cloud, instruments. Pure functions of t. */
(function () {
var e = E, S = e.S, V3 = e.V3, clamp = e.clamp, lerp = e.lerp, hash = e.hash, sstep = e.sstep, eo3 = e.eo3;
var TM = window.TM, TMs = {}; TM.sentences.forEach(function (s) { TMs[s.id] = s; });
function S0(id) { return TMs[id].t0; } function S1(id) { return TMs[id].t1; } function SP(id, f) { var s = TMs[id]; return s.t0 + (s.t1 - s.t0) * f; }
window.__ws = {}; function WS(id, subs, f, last) { var s = TMs[id], alts = subs.split('|'); for (var a = 0; a < alts.length; a++) { var sub = alts[a]; for (var kk = s.k0; kk <= s.k1; kk++) { var k = last ? s.k1 - (kk - s.k0) : kk; if (TM.words[k][0].replace(/[,.?।:]/g, '') === sub || (sub.length > 2 && TM.words[k][0].indexOf(sub) >= 0)) { window.__ws[id + '|' + subs] = [TM.words[k][0], +TM.words[k][1].toFixed(2), +TM.words[k][2].toFixed(2)]; return TM.words[k][1] + (TM.words[k][2] - TM.words[k][1]) * (f == null ? 0 : f); } } } window.__ws[id + '|' + subs] = 'MISS'; return s.t0 + (s.t1 - s.t0) * .5; }
window.S0 = S0; window.S1 = S1; window.SP = SP; window.WS = WS;
/* ---- palette (LiDAR grammar: cold near-black, desaturated cloud ramp, one amber accent) ---- */
var K = { BG: 0x05080a, FRONT: 0xd4fff0, AMB: 0xffb347, GRN: 0x83c495, SAND: 0xc8b38c, PALE: 0xe2f3dc, TEAL: 0x1f3f35, MID: 0x5c9a7a, SLATE: 0x9db3b0, RED: 0xff6b5e };
var B = window.B = { K: K };
/* ---- geometry of the real plate: NASA HLS (Sentinel-2) 15 Mar 2024, 79.15-80.00 E, 9.00-9.40 N. 1 world unit = 1 km, y = metres * VE ---- */
var SX = 93.4, SZ = 44.2, LON0 = 79.575, LAT0 = 9.2, VE = .12, KMLON = 109.9, KMLAT = 110.6;
B.SX = SX; B.SZ = SZ; B.VE = VE;
B.ll = function (lon, lat) { return new V3((lon - LON0) * KMLON, 0, -(lat - LAT0) * KMLAT); };
B.px = function (px, py) { return new V3((px / 2048 - .5) * SX, 0, (py / 960 - .5) * SZ); };    /* image pixel -> world */
var W = new THREE.Group(); S.add(W); window.GR = [W]; window.W = W; B.W = W;
/* ---- the plate ---- */
var PU = { map: { value: null }, uA: { value: 1 }, uRel: { value: 0 }, uVE: { value: VE }, uFront: { value: -60 }, uFrontOn: { value: 0 }, uCont: { value: 1 }, uDim: { value: 1 }, uWinK: { value: 0 }, uWin: { value: new THREE.Vector4(-8, -4, 14, 14) }, uSun: { value: new V3(-.62, .42, .5).normalize() }, uSea: { value: 0 } };
B.PU = PU;
var plate = null;
B.buildPlate = function (img) {
  /* clouds painted out: normalized blur of the cloud-free colours fills the cloud pixels (disclosed on screen: CLOUDS FILLED) */
  var FW = img.width, FH = img.height, cf = document.createElement('canvas'); cf.width = FW; cf.height = FH; var fx = cf.getContext('2d'); fx.drawImage(img, 0, 0); var fd = fx.getImageData(0, 0, FW, FH), q = fd.data, SW = FW >> 3, SH = FH >> 3, sr = new Float32Array(SW * SH * 3), sc = new Float32Array(SW * SH), mk = new Uint8Array(FW * FH);
  for (var yy = 0; yy < FH; yy++) for (var xx = 0; xx < FW; xx++) { var o = (yy * FW + xx) * 4, cl = Math.min(q[o], q[o + 1], q[o + 2]) > 168; mk[yy * FW + xx] = cl ? 1 : 0; if (!cl) { var si = ((yy >> 3) * SW + (xx >> 3)); sr[si * 3] += q[o]; sr[si * 3 + 1] += q[o + 1]; sr[si * 3 + 2] += q[o + 2]; sc[si] += 1; } }
  for (var it = 0; it < 6; it++) { var tr = new Float32Array(sr.length), tc = new Float32Array(sc.length); for (var j2 = 0; j2 < SH; j2++) for (var i2 = 0; i2 < SW; i2++) { for (var dj = -3; dj <= 3; dj++) for (var di = -3; di <= 3; di++) { var jj = j2 + dj, ii = i2 + di; if (jj < 0 || jj >= SH || ii < 0 || ii >= SW) continue; var k2 = jj * SW + ii; tr[(j2 * SW + i2) * 3] += sr[k2 * 3]; tr[(j2 * SW + i2) * 3 + 1] += sr[k2 * 3 + 1]; tr[(j2 * SW + i2) * 3 + 2] += sr[k2 * 3 + 2]; tc[j2 * SW + i2] += sc[k2]; } } var mx = 0; for (var z = 0; z < tc.length; z++) mx = Math.max(mx, tc[z]); for (z = 0; z < tr.length; z++) tr[z] = tr[z] / (mx || 1) * 1; for (z = 0; z < tc.length; z++) tc[z] = tc[z] / (mx || 1); if (it < 1) { sr = tr; sc = tc; } else { sr = tr; sc = tc; } }
  for (yy = 0; yy < FH; yy++) for (xx = 0; xx < FW; xx++) { var near = 0; if (mk[yy * FW + xx]) near = 1; else { for (var d4 = -5; d4 <= 5 && !near; d4 += 5) for (var d5 = -5; d5 <= 5; d5 += 5) { var y5 = yy + d4, x5 = xx + d5; if (y5 >= 0 && y5 < FH && x5 >= 0 && x5 < FW && mk[y5 * FW + x5]) { near = .6; break; } } } if (near) { var s3 = ((yy >> 3) * SW + (xx >> 3)), w = sc[s3] || 1e-6, o2 = (yy * FW + xx) * 4; q[o2] = q[o2] * (1 - near) + sr[s3 * 3] / w * near; q[o2 + 1] = q[o2 + 1] * (1 - near) + sr[s3 * 3 + 1] / w * near; q[o2 + 2] = q[o2 + 2] * (1 - near) + sr[s3 * 3 + 2] / w * near; } }
  fx.putImageData(fd, 0, 0); img = cf; B.cleanImg = cf;
  var GW = 512, GH = 240, cv = document.createElement('canvas'); cv.width = GW; cv.height = GH; var x = cv.getContext('2d'); x.filter = 'blur(5px)'; x.drawImage(img, 0, 0, GW, GH); x.filter = 'none';
  var d = x.getImageData(0, 0, GW, GH).data, AH = new Float32Array(GW * GH);
  for (var j = 0; j < GH; j++) for (var i = 0; i < GW; i++) { var k = (j * GW + i) * 4, r = d[k] / 255, g = d[k + 1] / 255, b = d[k + 2] / 255, lum = .3 * r + .59 * g + .11 * b, land = (r > b * .9 && r > .24) || (Math.min(r, g, b) > .72) ? 1 : 0;
    var cloud = Math.min(r, g, b) > .72; AH[j * GW + i] = cloud ? .4 : land ? .6 + 2.4 * clamp((lum - .22) / .45) : -(1.0 + 12.5 * (1 - sstep((lum - .10) / .45))); }
  for (var pass = 0; pass < 3; pass++) { var T = new Float32Array(GW * GH); for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { var sm = 0, n = 0; for (var di = -2; di <= 2; di++) { var ii = Math.max(0, Math.min(GW - 1, i + di)); sm += AH[j * GW + ii]; n++; } T[j * GW + i] = sm / n; } for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { var sm2 = 0, n2 = 0; for (var dj = -2; dj <= 2; dj++) { var jj = Math.max(0, Math.min(GH - 1, j + dj)); sm2 += T[jj * GW + i]; n2++; } AH[j * GW + i] = sm2 / n2; } }
  var geo = new THREE.PlaneGeometry(SX, SZ, GW - 1, GH - 1); geo.rotateX(-Math.PI / 2); var GX = new Float32Array(GW * GH), GZ = new Float32Array(GW * GH), dxu = SX / (GW - 1), dzu = SZ / (GH - 1); for (j = 0; j < GH; j++) for (i = 0; i < GW; i++) { var i0 = Math.max(0, i - 1), i1 = Math.min(GW - 1, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(GH - 1, j + 1); GX[j * GW + i] = (AH[j * GW + i1] - AH[j * GW + i0]) / ((i1 - i0) * dxu); GZ[j * GW + i] = (AH[j1 * GW + i] - AH[j0 * GW + i]) / ((j1 - j0) * dzu); }
  geo.setAttribute('aH', new THREE.BufferAttribute(AH, 1)); geo.setAttribute('aGx', new THREE.BufferAttribute(GX, 1)); geo.setAttribute('aGz', new THREE.BufferAttribute(GZ, 1));
  var tx = new THREE.CanvasTexture(cf); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; tx.needsUpdate = true; PU.map.value = tx;
  var mat = new THREE.ShaderMaterial({ uniforms: PU, transparent: true, extensions: { derivatives: true },
    vertexShader: 'uniform float uRel,uVE,uFront,uFrontOn;attribute float aH,aGx,aGz;varying vec2 vUv;varying float vH;varying vec3 vW,vN;void main(){vUv=uv;vH=aH;vec3 p=position;float k=uFrontOn>.5?smoothstep(uFront+1.5,uFront-1.5,p.x):1.;p.y=aH*uRel*k*uVE;vN=normalize(vec3(-aGx*uVE*uRel*k,1.,-aGz*uVE*uRel*k));vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: 'uniform sampler2D map;uniform float uA,uFront,uFrontOn,uCont,uDim,uWinK;uniform vec4 uWin;uniform vec3 uSun;varying vec2 vUv;varying float vH;varying vec3 vW,vN;' +
      'void main(){vec3 base=texture2D(map,vUv).rgb;float cl=smoothstep(.55,.78,min(base.r,min(base.g,base.b)));base=mix(base,vec3(.10,.17,.17),cl*.75);vec3 n=normalize(vN);float d=max(dot(n,uSun),0.);float lum=dot(base,vec3(.3,.59,.11));' +
      'vec3 col=mix(vec3(lum),base,.82)*(.30+1.05*d);col=mix(col,col*vec3(.78,.92,1.0),.35);' +
      'float f=abs(fract(vH)-.5);float c1=1.-smoothstep(0.,fwidth(vH)*1.3,f);float f5=abs(fract(vH*.2)-.5);float c5=1.-smoothstep(0.,fwidth(vH*.2)*1.3,f5);float gg=fwidth(vH);float vis=smoothstep(.0004,.003,gg)*(1.-smoothstep(.2,.5,vH));col=mix(col,vec3(.83,1.,.94),(c1*.16+c5*.30)*uCont*vis);' +
      'float ahead=uFrontOn>.5?smoothstep(uFront-.25,uFront+.25,vW.x):0.;col=mix(col,vec3(.02,.04,.045),ahead*.93);col+=vec3(.83,1.,.94)*exp(-pow((vW.x-uFront)/.5,2.))*uFrontOn*1.7;' +
      'float inside=step(uWin.x,vW.x)*step(vW.x,uWin.z)*step(uWin.y,vW.z)*step(vW.z,uWin.w);col*=mix(1.,mix(.20,1.,inside),uWinK);' +
      'vec2 q=abs(vUv-.5)*2.;float edge=1.-smoothstep(.86,1.,max(q.x,q.y));col*=uDim*edge;gl_FragColor=vec4(col,uA*edge);}' });
  plate = new THREE.Mesh(geo, mat); plate.renderOrder = 1; plate.frustumCulled = false; W.add(plate); B.plate = plate; B.AH = AH; B.GW = GW; B.GH = GH; };
/* ---- the real photon cloud (ICESat-2 ATL03, 4 ground tracks x 6 beams, 216,000 of 1,097,777 returns in the window) ---- */
var PT = { uFx: { value: 99 }, uFz: { value: 99 }, uTrack: { value: -1 }, uYs: { value: 1 }, uVis: { value: 0 }, uSize: { value: 3 }, uVE: { value: VE }, uPulse: { value: 0 }, uFrontX: { value: -99 }, uRGT: { value: -1 } };
B.PT = PT;
B.buildPhotons = function () {
  var N = window.PHN, bin = atob(window.PHB64), bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  var u = new Uint16Array(bytes.buffer, 0, N), v = new Uint16Array(bytes.buffer, N * 2, N), h = new Int16Array(bytes.buffer, N * 4, N), ti = bytes.subarray(N * 6, N * 7), BB = window.PHBB;
  var pos = new Float32Array(N * 3), aH = new Float32Array(N), aT = new Float32Array(N), aZ = new Float32Array(N), aR = new Float32Array(N);
  for (i = 0; i < N; i++) { var lon = BB[0] + u[i] / 65535 * (BB[2] - BB[0]), lat = BB[1] + v[i] / 65535 * (BB[3] - BB[1]), p = B.ll(lon, lat), hm = h[i] / 100; pos[i * 3] = p.x; pos[i * 3 + 1] = hm * VE; pos[i * 3 + 2] = p.z; aH[i] = hm; aT[i] = ti[i]; aR[i] = Math.floor(ti[i] / 6); }
  var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aH', new THREE.BufferAttribute(aH, 1)); g.setAttribute('aT', new THREE.BufferAttribute(aT, 1)); g.setAttribute('aR', new THREE.BufferAttribute(aR, 1));
  var m = new THREE.ShaderMaterial({ uniforms: PT, transparent: true, depthWrite: false,
    vertexShader: 'uniform float uFx,uFz,uTrack,uVis,uSize,uPulse,uRGT,uYs;attribute float aH,aT,aR;varying float vH,vOn,vA;void main(){vH=aH;vec3 pp=position;pp.y*=uYs;vec4 mv=modelViewMatrix*vec4(pp,1.);gl_Position=projectionMatrix*mv;float dist=-mv.z;float inTr=(uTrack<0.&&uRGT<0.)||(aT==uTrack)||(uRGT>=0.&&aR==uRGT)?1.:0.;vOn=inTr*step(position.x,uFx)*step(position.z,uFz)*uVis;vA=vOn;gl_PointSize=clamp(uSize*95./dist,1.4,5.5)*(1.+.45*uPulse*step(.5,fract(aT*.37+position.x*.11)));}',
    fragmentShader: 'varying float vH,vOn,vA;void main(){if(vOn<.5)discard;vec2 c=gl_PointCoord-.5;float r=length(c);if(r>.5)discard;float a=smoothstep(.5,.15,r);vec3 col;' +
      'if(vH>.6)col=vec3(.78,.70,.55);else if(vH>-.7)col=vec3(.36,.55,.55);else{float t=clamp(-vH/22.,0.,1.);col=mix(vec3(.12,.25,.21),mix(vec3(.36,.60,.48),vec3(.89,.95,.86),smoothstep(.45,1.,t)),smoothstep(0.,.45,t));}' +
      'gl_FragColor=vec4(col*1.0,a*.85);}' });
  var pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.renderOrder = 3; W.add(pts); B.pts = pts; B.ph = { pos: pos, aH: aH, aT: aT, N: N }; };
/* ---- satellite stand-in (PBR; not to scale; ICESat-2 is not in NASA's vendored 3D set) ---- */
B.sat = function (sc) { var g = new THREE.Group(), P = function (c, o) { return e.physMat(c, Object.assign({ metalness: .9, roughness: .3, envMapIntensity: 1.2 }, o)); }, gold = P(0xd9b24a), alu = P(0xb8c2cc, { roughness: .26 }), dark = P(0x1b2531, { metalness: .5, roughness: .5 });
  var bus = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 2.8), alu); g.add(bus); var foil = new THREE.Mesh(new THREE.BoxGeometry(1.86, 1.2, 2.2), gold); foil.position.y = -.05; g.add(foil);
  var cv = document.createElement('canvas'); cv.width = 512; cv.height = 128; var x = cv.getContext('2d'); x.fillStyle = '#0d1b3d'; x.fillRect(0, 0, 512, 128); x.strokeStyle = '#4a7bd0'; x.lineWidth = 2; for (var i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, 128); x.stroke(); } for (i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(0, i * 32); x.lineTo(512, i * 32); x.stroke(); } var tx = e.canvasTex(cv);
  [-1, 1].forEach(function (s) { var pn = new THREE.Mesh(new THREE.BoxGeometry(5.2, .06, 1.3), [dark, dark, new THREE.MeshStandardMaterial({ map: tx, metalness: .5, roughness: .35, emissive: 0x08142f, emissiveIntensity: .6 }), dark, dark, dark]); pn.position.set(s * 3.9, 0, 0); g.add(pn); var arm = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1.2, 8), alu); arm.rotation.z = Math.PI / 2; arm.position.set(s * 1.4, 0, 0); g.add(arm); });
  var dish = new THREE.Mesh(new THREE.SphereGeometry(.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), alu); dish.rotation.x = Math.PI; dish.position.set(0, .95, -.7); g.add(dish);
  var optic = new THREE.Mesh(new THREE.CylinderGeometry(.42, .5, .5, 24), dark); optic.position.set(0, -.95, .3); g.add(optic); var lens = new THREE.Mesh(new THREE.CircleGeometry(.32, 24), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x7dff9a).multiplyScalar(2.4) })); lens.rotation.x = Math.PI / 2; lens.position.set(0, -1.21, .3); g.add(lens);
  g.scale.setScalar(sc || 1); return g; };
/* ---- pixel-placed labels and authored frames (same contract as the other 3D reels) ---- */
function unp(A, px, py, dist) { return e.unp(A, px, py, dist); }
B.fr = function (c, d, pitch, yaw, fov, rowPx) { fov = fov || 38; rowPx = rowPx || 761; var c3 = new V3(c[0], c[1], c[2]), pr = pitch * Math.PI / 180, yw = (yaw || 0) * Math.PI / 180, dir = new V3(Math.sin(yw) * Math.cos(pr), Math.sin(pr), Math.cos(yw) * Math.cos(pr)), p = c3.clone().add(dir.clone().multiplyScalar(d)), fwd = c3.clone().sub(p).normalize(), right = new V3().crossVectors(fwd, new V3(0, 1, 0)).normalize(), up = new V3().crossVectors(right, fwd).normalize(), wpp = 2 * d * Math.tan(fov * Math.PI / 360) / e.H, l = c3.clone().sub(up.multiplyScalar((960 - rowPx) * wpp)); return [[p.x, p.y, p.z], [l.x, l.y, l.z], fov]; };
B.sh = function (sc, name, t0, t1, A, Bb, ease) { e.shot(sc, name, t0, t1, A[0], A[1], A[2], Bb[0], Bb[1], Bb[2], ease); };
B.lock = function (sc, name, t0, A) { e.shot(sc, name, t0, t0 + .01, A[0], A[1], A[2], A[0], A[1], A[2], 'io'); };
B.PL = function (o, A, px, py, dist, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / e.H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; var q = unp(A, px, py, dist); o.position.copy(q); ud.p0 = null; if (o.parent !== W) W.add(o); return o; };
/* a label in the LiDAR instrument style: dark glass plate, hairline accent bar, mono readout */
B.tag = function (text, col, A, px, py, dist, pxH, o) { o = o || {}; var l = e.lab(text, col, 1, Object.assign({ font: '600 ' + (o.fs || 30) + 'px "IBM Plex Mono"', fs: o.fs || 30, bgc: 'rgba(5,8,10,.90)', tcol: o.tcol == null ? 0xe2f3dc : o.tcol, pad: 22 }, o)); return B.PL(l, A, px, py, dist, pxH); };
B.PW = function (o, A, wp, pxH) { var ud = o.userData, asp = ud.sx / ud.sy, cp = new V3(A[0][0], A[0][1], A[0][2]), dist = cp.distanceTo(wp), wpp = 2 * dist * Math.tan(A[2] * Math.PI / 360) / e.H, hh = pxH * wpp; o.scale.set(hh * asp, hh, 1); ud.sx = hh * asp; ud.sy = hh; o.position.copy(wp); ud.p0 = null; if (o.parent !== W) W.add(o); return o; };
B.tagW = function (text, col, A, wp, pxH, o) { o = o || {}; var l = e.lab(text, col, 1, Object.assign({ font: '600 ' + (o.fs || 30) + 'px "IBM Plex Mono"', fs: o.fs || 30, bgc: 'rgba(5,8,10,.90)', tcol: o.tcol == null ? 0xe2f3dc : o.tcol, pad: 22 }, o)); return B.PW(l, A, wp, pxH); };
B.num = function (text, col, A, px, py, dist, pxH, o) { return B.tag(text, col, A, px, py, dist, pxH, Object.assign({ font: '600 ' + ((o && o.fs) || 120) + 'px "Barlow Condensed"', fs: (o && o.fs) || 120, pad: 26 }, o || {})); };
B.buildPhotons();
})();
