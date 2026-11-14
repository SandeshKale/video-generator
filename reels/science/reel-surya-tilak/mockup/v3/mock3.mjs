import { chromium } from 'playwright'; import { spawn } from 'node:child_process';
const root = new URL('../../../../../', import.meta.url).pathname, out = process.argv[2];
const srv = spawn('python3', ['-m', 'http.server', '8836', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('http://127.0.0.1:8836/reels/science/reel-surya-tilak/site/index.html'); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
await p.evaluate(() => window.__dbg(`(function(){ var gm = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, uniforms: { c: { value: new T.Color(1.0, .78, .55) } },
  vertexShader: 'varying vec3 vN, vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
  fragmentShader: 'uniform vec3 c; varying vec3 vN, vV; void main(){ float f=1.-abs(dot(normalize(vN),normalize(vV))); gl_FragColor=vec4(c*(.035+.55*pow(f,2.6)),1.); }' });
  TEM.traverse(function(m){ if (m.isMesh && !m.isInstancedMesh && (m.material===STONE||m.material===STONE_D||m.material===CARVE||m.material===CUT||(m.material.map&&m.material.map===sTex))) { m.material=gm; m.castShadow=false; m.receiveShadow=false; } });
  S.background = new T.Color(0x070304); window.__ghost=1; })()`));
for (const s of process.argv[3].split(',')) { await p.evaluate(t => window.__seek(+t), s); await p.waitForTimeout(150); await p.screenshot({ path: `${out}/g_${s}.png` }); }
await b.close(); srv.kill();
