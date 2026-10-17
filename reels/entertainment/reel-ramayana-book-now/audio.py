# Score + SFX + voice chain for the Ramayana booking reel. Voice = avatar audio (audio/voice.wav).
# Voice chain (ffmpeg): high-pass, de-mud, presence, compression. Music: temple-bell drone + soft dhol pulse that gains a layer per act,
# ducked by voice activity with a 1.2-4.5 kHz carve. SFX on the page's own events. Master -14 LUFS / -1.5 dBTP (2-pass loudnorm).
import numpy as np, soundfile as sf, subprocess, json, re
from scipy.signal import butter, sosfilt
SR=48000
tm=open('site/timing.js').read(); END=float(re.search(r'END:([\d.]+)',tm).group(1))
S=[float(x) for x in re.search(r'S:\[([^\]]+)\]',tm).group(1).split(',')]
subprocess.check_call(['ffmpeg','-v','error','-y','-i','audio/voice.wav','-af',
 'highpass=f=90,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=4,alimiter=limit=0.9',
 '-ar',str(SR),'-ac','1','audio/voice_fx.wav'])
v,_=sf.read('audio/voice_fx.wav'); v=v if v.ndim==1 else v.mean(1)
N=int(END*SR); voice=np.zeros(N); voice[:min(N,len(v))]=v[:N]
t=np.arange(N)/SR; rng=np.random.default_rng(11)
def env(a,b,x): return np.clip((x-a)/(b-a),0,1)
def tone(f,x): return np.sin(2*np.pi*f*x)
# drone: D2 + A2 + D3 (+ shimmer), slow swell
d=sum(tone(f,t+0.0025*np.sin(t*.35+f))*a for f,a in ((73.4,.55),(110,.32),(146.8,.2),(293.7,.05)))
d*=.65+.35*np.sin(2*np.pi*t/8.0)
BPM=96; beat=60/BPM
pulse=np.zeros(N); hats=np.zeros(N); bells=np.zeros(N)
def dhol(at,g=1,f0=70):
    i=int(at*SR)
    if i>=N: return
    x=np.arange(min(int(.5*SR),N-i))/SR; pulse[i:i+len(x)]+=g*np.sin(2*np.pi*(f0+90*np.exp(-x*28))*x)*np.exp(-x*7)
def shaker(at,g=.18):
    i=int(at*SR); L=int(.05*SR)
    if i+L<N: hats[i:i+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*80)*g
def bell(at,f=587,g=.35):
    i=int(at*SR); L=int(1.6*SR)
    if i+L>=N: return
    x=np.arange(L)/SR; m=np.sin(2*np.pi*f*x*1.5)*2.2*np.exp(-x*5); bells[i:i+L]+=g*np.sin(2*np.pi*f*x+m)*np.exp(-x*2.6)
a=0.0; k=0
while a<END-1:
    dhol(a,.9 if k%4==0 else (.55 if k%2==0 else .35))
    if a>S[2]-.1: shaker(a+beat/2,.2)
    if a>S[6]-.1 and k%2==1: dhol(a,.3,110)
    a+=beat; k+=1
for s in S: bell(s+.02,587 if S.index(s)%2==0 else 440,.3)
bass=np.zeros(N)
for st in range(len(S)):
    a0=S[st]; a1=S[st+1] if st+1<len(S) else END; f=[73.4,87.3,98,110][st%4]; m=(t>=a0)&(t<a1)
    bass[m]+=np.sin(2*np.pi*f*t[m])*.45*(.6+.4*np.sin(2*np.pi*t[m]/beat*2))
music=d*.5+pulse*.5*env(.3,1.2,t)+bass*.22*env(S[2]-.5,S[2]+.5,t)+hats*.5+bells*.5
music*=env(0,.4,t)*(1-env(END-2.4,END,t))
sos=butter(2,[1200,4500],'bandstop',fs=SR,output='sos'); music=sosfilt(sos,music)
act=np.abs(voice); kk=int(.1*SR); sm=np.convolve(act,np.ones(kk)/kk,'same'); on=(sm>0.01).astype(float)
k2=int(.22*SR); duck=np.clip(np.convolve(on,np.ones(k2)/k2,'same')*2.2,0,1)
music*=10**((-3-17*duck)/20)
sfx=np.zeros(N)
def whoosh(at,dur=.4,g=.45):
    i=int((at-dur*.6)*SR); L=int(dur*SR)
    if i<0 or i+L>N: return
    x=rng.standard_normal(L); w=np.convolve(x,np.ones(34)/34,'same'); e=np.sin(np.linspace(0,np.pi,L))**2; sfx[i:i+L]+=w*e*g*np.linspace(.5,1.2,L)
def hit(at,g=.8,f=55):
    i=int(at*SR); L=int(.45*SR)
    if i+L>N: return
    x=np.arange(L)/SR; sfx[i:i+L]+=g*(np.sin(2*np.pi*(f+110*np.exp(-x*40))*x)*np.exp(-x*9)+rng.standard_normal(L)*np.exp(-x*60)*.5)
def tick(at,g=.22,f=1700):
    i=int(at*SR); L=int(.06*SR)
    if i+L<N: x=np.arange(L)/SR; sfx[i:i+L]+=g*np.sin(2*np.pi*f*x)*np.exp(-x*70)
def ding(at,f=1318,g=.3):
    i=int(at*SR); L=int(.7*SR)
    if i+L<N: x=np.arange(L)/SR; sfx[i:i+L]+=g*np.sin(2*np.pi*f*x)*np.exp(-x*7)
def rip(at,g=.5):
    i=int(at*SR); L=int(.35*SR)
    if i+L<N: x=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*9); sfx[i:i+L]+=np.convolve(x,np.ones(6)/6,'same')*g
for s in S[1:]: whoosh(s-.12)
hit(S[0]+.15,.7)                                   # stamp
for j in range(3): tick(S[0]+.1+j*1.3,.2,1500)
hit(S[1]+.25,.8)                                   # calendar slam
rip(S[2]+2.6,.7); hit(S[2]+2.62,.5,70)             # ticket tear
for j in range(8): tick(S[3]+.7+j*.18,.18,1200+j*70)  # odometer
hit(S[3]+1.2,.4,90)                                # circle
hit(S[4]+.2,.8,50)                                 # IMAX
ding(S[5]+2.6,1046,.4)                             # diya lights
for i,tt in enumerate([.7,1.6,2.2,2.87,3.54]): ding(S[6]+tt,880+i*110,.3)   # languages
for j in range(14): tick(S[7]+4.6+j*.1,.16,1900)   # budget count
ding(S[7]+6.1,1568,.4)
for i in (8,9,10): hit(S[i]+.15,.55,60)            # nameplates
hit(S[11]+.1,.5,60)
for j in range(5): tick(S[12]+1.4+j*1.0,.2,1600)
ding(S[12]+2.4,1318,.35)
sfx*=10**(-12/20)
mix=voice+music+sfx
sf.write('audio/premix.wav',mix,SR)
p1=subprocess.run(['ffmpeg','-i','audio/premix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
q=json.loads(re.search(r'\{[^}]*input_i[^}]*\}',p1,re.S).group(0))
subprocess.check_call(['ffmpeg','-v','error','-y','-i','audio/premix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true'%(q['input_i'],q['input_tp'],q['input_lra'],q['input_thresh'],q['target_offset']),'-ar','48000','-ac','1','audio/mix.wav'])
vm=on>0; rv=np.sqrt(np.mean(voice[vm]**2)); rm=np.sqrt(np.mean((music+sfx)[vm]**2))
fr=int(.25*SR); vals=[]
for i in range(len(voice)//fr):
    sl=slice(i*fr,(i+1)*fr)
    if on[sl].mean()>.9: a=np.sqrt(np.mean(voice[sl]**2)); b=np.sqrt(np.mean((music+sfx)[sl]**2))+1e-9; vals.append(20*np.log10(a/b))
rep={'voice_over_music_overall_db':round(20*np.log10(rv/rm),1),'median_db':round(float(np.median(vals)),1),'min_db':round(float(np.min(vals)),1)}
j=subprocess.run(['ffmpeg','-i','audio/mix.wav','-af','loudnorm=I=-14:TP=-1.5:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
lj=json.loads(re.search(r'\{[^}]*input_i[^}]*\}',j,re.S).group(0)); rep['LUFS']=lj['input_i']; rep['TP']=lj['input_tp']
json.dump(rep,open('audio/mix-report.json','w'),indent=1); print(rep)
