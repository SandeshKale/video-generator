// dump window.EV + scene starts + duration to audio/events.json (for audio_mix.py)
import { chromium } from 'playwright'; import { spawn } from 'node:child_process'; import fs from 'node:fs';
const R = new URL('..', import.meta.url).pathname, root = new URL('../../../../', import.meta.url).pathname;
const srv = spawn('python3', ['-m', 'http.server', '8834', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' }); await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch({ args: ['--no-sandbox'] }), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://127.0.0.1:8834/reels/science/reel-jatayu-flight/site/index.html'); await p.waitForFunction('window.__ready===true', null, { timeout: 120000 });
const d = await p.evaluate(() => ({ ev: window.EV, B: SCN_T0(), dur: window.__reelDurationSec, cue: window.__cue || [] }));
fs.writeFileSync(R + 'audio/events.json', JSON.stringify(d, null, 1)); console.log(d.ev.length, 'events, scenes', d.B.length, 'missed cues', d.cue); await b.close(); srv.kill();
