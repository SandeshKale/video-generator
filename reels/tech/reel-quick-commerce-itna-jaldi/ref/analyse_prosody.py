import numpy as np, librosa, json, soundfile as sf
y, sr = librosa.load('ref16.wav', sr=16000)
dur = len(y)/sr
# voice activity from RMS with hysteresis
hop = 160; frame = 400
rms = librosa.feature.rms(y=y, frame_length=frame, hop_length=hop)[0]
db = 20*np.log10(rms+1e-8)
thr = np.percentile(db, 30) + 6      # speech threshold relative to noise floor
voiced = db > max(thr, db.max()-45)
# smooth: close gaps < 80 ms, drop blips < 80 ms
def runs(mask):
    out=[]; s=None
    for i,v in enumerate(mask):
        if v and s is None: s=i
        if not v and s is not None: out.append([s,i]); s=None
    if s is not None: out.append([s,len(mask)])
    return out
r = runs(voiced); merged=[]
for a,b in r:
    if merged and (a-merged[-1][1])*hop/sr < 0.08: merged[-1][1]=b
    else: merged.append([a,b])
merged=[m for m in merged if (m[1]-m[0])*hop/sr>=0.08]
spans=[(a*hop/sr,b*hop/sr) for a,b in merged]
pauses=[spans[i+1][0]-spans[i][1] for i in range(len(spans)-1)]
speech_t=sum(b-a for a,b in spans)
print('duration',round(dur,1),'speech time',round(speech_t,1),'ratio',round(speech_t/dur,2),'n spans',len(spans))
P=np.array(pauses)
for lo,hi,name in [(0.08,0.2,'micro 80-200ms'),(0.2,0.4,'short 200-400ms'),(0.4,0.8,'mid 400-800ms'),(0.8,1.5,'long 0.8-1.5s'),(1.5,99,'>1.5s')]:
    print(f'  pauses {name}: {int(((P>=lo)&(P<hi)).sum())}')
print('median pause',round(float(np.median(P)),2),'mean',round(float(P.mean()),2))
# pitch
f0, vf, vp = librosa.pyin(y, fmin=70, fmax=400, sr=sr, frame_length=1024, hop_length=160)
f = f0[~np.isnan(f0)]
print('f0 median Hz',round(float(np.median(f))),'p10',round(float(np.percentile(f,10))),'p90',round(float(np.percentile(f,90))),'range semitones p10-p90',round(12*np.log2(np.percentile(f,90)/np.percentile(f,10)),1))
# pitch variability per 2-s window (semitone std)
st = 12*np.log2(f0/np.nanmedian(f0))
win=int(2*sr/160); sds=[np.nanstd(st[i:i+win]) for i in range(0,len(st)-win,win) if np.sum(~np.isnan(st[i:i+win]))>40]
print('semitone std per 2s window: median',round(float(np.median(sds)),2),'min',round(float(min(sds)),2),'max',round(float(max(sds)),2))
# loudness variation
print('dB range (p10..p90, voiced)',round(float(np.percentile(db[voiced],10)),1),round(float(np.percentile(db[voiced],90)),1))
json.dump(dict(spans=spans,pauses=pauses),open('prosody.json','w'))
# final-fall: pitch at end of each span vs its median (declination / question rise)
falls=[]
for a,b in spans:
    if b-a<1.0: continue
    i0,i1=int(a*sr/160),int(b*sr/160); seg=st[i0:i1]
    if np.sum(~np.isnan(seg))<30: continue
    n=len(seg); head=np.nanmean(seg[:n//4]); tail=np.nanmean(seg[-n//5:]); falls.append(tail-head)
falls=np.array([x for x in falls if not np.isnan(x)])
print('phrase tail minus head (semitones): median',round(float(np.median(falls)),2),'share falling',round(float((falls<0).mean()),2),'n',len(falls))
