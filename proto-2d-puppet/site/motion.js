// Deterministic, smoothed mocap: critically damped spring per joint coordinate, simulated at 240 Hz from t=-0.4 (pure function of t; memoised for sequential seeks).
(function(){
var CLIP='boxB',T0=1.5,OMEGA=30,DT=1/240,st=null,MAXRATE=15*24*Math.PI/180,OPT={yaw:0.17,guardSpread:1.0,legSpread:0.65};   // forearm angle: rate limited to 15 deg/frame @24fps
function target(s){var d=RIG.dur(CLIP)-0.05;return RIG.sample(CLIP,Math.max(0,Math.min(d,T0+s)),{inplace:true});}
function pose(t){
 if(!st||t<st.t-1e-9){var P=target(-0.4),X={},V={};for(var k in P){X[k]=P[k].slice();V[k]=[0,0,0];}st={t:-0.4,X:X,V:V,fa:PUPPET.faAngles(P,OPT)};}
 while(st.t<t-1e-9){var h=Math.min(DT,t-st.t),Tg=target(st.t+h);for(var k in Tg){for(var c=0;c<3;c++){var a=OMEGA*OMEGA*(Tg[k][c]-st.X[k][c])-2*OMEGA*st.V[k][c];st.V[k][c]+=a*h;st.X[k][c]+=st.V[k][c]*h;}}st.t+=h;var tg2=PUPPET.faAngles(st.X,OPT);['R','L','uR','uL'].forEach(function(s){var d=tg2[s]-st.fa[s];while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;var lim=MAXRATE*h;st.fa[s]+=Math.max(-lim,Math.min(lim,d));});}
 var out={};for(var k in st.X)out[k]=st.X[k].slice();return out;}
window.MOTION={pose:pose,fa:function(){return {R:st.fa.R,L:st.fa.L,uR:st.fa.uR,uL:st.fa.uL};}};
})();
