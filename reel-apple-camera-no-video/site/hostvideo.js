// Host = the creator's photo animated by a hosted talking-head model (MoDA), pre-generated per voice-over chunk
// and stitched into site/host.webm (25 fps, VP9 — headless Chromium cannot decode H.264). Deterministic seek:
// currentTime = (frame+.5)/fps, resolved on the 'seeked' event. Only the visible scene's <video> is ever seeked.
(function(){
var FPS=25,N=1718;
function build(win){
  var v=document.createElement('video');v.muted=true;v.preload='auto';v.playsInline=true;v.src='host.webm';
  v.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:50% 38%;transform:scale(1.12);transform-origin:50% 40%';
  win.insertBefore(v,win.firstChild);return v;
}
function seekTo(v,tt){return new Promise(function(res){
  if(Math.abs(v.currentTime-tt)<1e-4&&v.readyState>=2){res();return;}
  var done=false;function fin(){if(done)return;done=true;v.removeEventListener('seeked',fin);res();}
  v.addEventListener('seeked',fin);v.currentTime=tt;setTimeout(fin,4000);});}
function draw(win,t){
  var v=win.__hv||(win.__hv=build(win));
  var f=Math.max(0,Math.min(N-1,Math.floor(t*FPS+1e-6)));
  return seekTo(v,(f+.5)/FPS);
}
window.HOSTV={draw:draw};
})();
