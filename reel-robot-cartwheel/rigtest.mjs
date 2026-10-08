import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const clips = [['cart', [0.3, 1, 1.6, 2.2, 2.8, 3.4]], ['walk', [0, .3, .6, .9]], ['spin', [0.4, 0.9, 1.3, 1.7]], ['kick', [0.5, 1.5, 2.5, 3.2]]];
let h = '<html><body style="margin:0;background:#e9ecef"><script src="site/mocap.js"></script><script src="site/rig.js"></script><div id=o></div><script>';
h += `var C=${JSON.stringify(clips)};var o=document.getElementById('o');C.forEach(function(c){var row='<div style="display:flex;border-bottom:2px solid #999">';c[1].forEach(function(t,i){var P=RIG.sample(c[0],t,{inplace:true});row+='<svg width="280" height="500" viewBox="-180 -480 360 520" style="background:#f6f7f8;margin-right:4px"><line x1="-170" x2="170" y1="0" y2="0" stroke="#999"/>'+RIG.svg(P,i%2?'robot':'human')+'</svg>';});o.innerHTML+=row+'</div>';});</script></body></html>`;
writeFileSync('rigtest.html', h);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1700, height: 2040 } }); p.on('pageerror', e => console.log(e.message));
await p.goto('file://' + process.cwd() + '/rigtest.html'); await p.screenshot({ path: 'rigtest.png' }); await b.close();
