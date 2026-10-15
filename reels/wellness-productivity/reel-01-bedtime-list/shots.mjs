import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('site'); const M={'.html':'text/html','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.webm':'video/webm','.woff2':'font/woff2'};
const srv = http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':M[path.extname(p)]||'application/octet-stream'});r.end(d);});}).listen(0);
const port = srv.address().port;
const b = await chromium.launch({args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const pg = await b.newPage({viewport:{width:1080,height:1920}});
pg.on('console',m=>console.log('C:',m.text())); pg.on('pageerror',e=>console.log('ERR:',e.message));
await pg.goto(`http://127.0.0.1:${port}/`);
await pg.waitForFunction('window.__ready===true',null,{timeout:60000});
const ts=(process.argv[2]||'0.5,3,6.5,9,11.8,14,16.5').split(',').map(Number);
fs.mkdirSync('shots',{recursive:true});
for(const t of ts){await pg.evaluate(t=>window.__seek(t),t);await pg.screenshot({path:`shots/t${String(t).replace('.','_')}.png`});}
await b.close(); srv.close();
