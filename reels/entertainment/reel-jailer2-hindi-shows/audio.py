# Score + SFX + voice chain for the Jailer 2 reel. Voice = avatar audio (audio/voice.wav).
# Voice chain (ffmpeg): high-pass, de-mud, presence, compression. Music: drone + driving pulse (gains a layer per act), ducked by voice activity
# with a 1.2-4.5 kHz carve. SFX on scene cuts and key beats. Master -14 LUFS / -1.5 dBTP. Output audio/mix.wav + audio/mix-report.json
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
t=np.arange(N)/SR; rng=np.random.default_rng(7)
def env(a,b,x): return np.clip((x-a)/(b-a),0,1)
def tone(f,x): return np.sin(2*np.pi*f*x)
# drone A1/E2/A2 + slow swell
d=sum(tone(f,t+0.002*np.sin(t*.3+f))*a for f,a in ((55,.55),(82.4,.3),(110,.25),(164.8,.08)))
d*=.65+.35*np.sin(2*np.pi*t/7.0)
BPM=112; beat=60/BPM
pulse=np.zeros(N); hats=np.zeros(N); clap=np.zeros(N)
def kick(at,g=1):
    i=int(at*SR)
    if i>=N: return
    x=np.arange(min(int(.45*SR),N-i))/SR; pulse[i:i+len(x)]+=g*np.sin(2*np.pi*(48+110*np.exp(-x*32))*x)*np.exp(-x*8)
def hat(at,g=.2):
    i=int(at*SR); L=int(.04*SR)
    if i+L<N: hats[i:i+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*90)*g
def snr(at,g=.3):
    i=int(at*SR); L=int(.18*SR)
    if i+L<N: clap[i:i+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*22)*g
a=0.0; k=0
while a<END-1:
    kick(a,.95 if k%4==0 else .7)
    if k>=4+8 and S[0]<a: hat(a+beat/2,.22)
    if a>S[3]-.1 and k%2==1: snr(a,.3)
    a+=beat; k+=1
bass=np.zeros(N)
for st in range(len(S)):  # bass note per scene, root walks A-C-D-E
    a0=S[st]; a1=S[st+1] if st+1<len(S) else END
    f=[55,65.4,73.4,82.4][st%4]; m=(t>=a0)&(t<a1)
    bass[m]+=np.sin(2*np.pi*f*t[m])*.5*(.6+.4*np.sin(2*np.pi*t[m]/beat*2))
music=d*.5+pulse*.55*env(.3,1.2,t)+bass*.25*env(S[1]-.5,S[1]+.5,t)+hats*.5+clap*.5
music*=env(0,.4,t)*(1-env(END-2.4,END,t))
# carve 1.2-4.5 kHz from music
sos=butter(2,[1200,4500],'bandstop',fs=SR,output='sos'); music=sosfilt(sos,music)
# voice-activity ducking
act=np.abs(voice); kk=int(.1*SR); sm=np.convolve(act,np.ones(kk)/kk,'same'); on=(sm>0.01).astype(float)
k2=int(.22*SR); duck=np.clip(np.convolve(on,np.ones(k2)/k2,"same")*2.2,0,1)
music*=10**((-3-17*duck)/20)
# SFX
sfx=np.zeros(N)
def whoosh(at,dur=.45,g=.5):
    i=int((at-dur*.6)*SR); L=int(dur*SR)
    if i<0 or i+L>N: return
    x=rng.standard_normal(L); w=np.convolve(x,np.ones(36)/36,'same'); e=np.sin(np.linspace(0,np.pi,L))**2
    sfx[i:i+L]+=w*e*g*np.linspace(.5,1.2,L)
def stamp(at,g=.9):
    i=int(at*SR); L=int(.45*SR)
    if i+L>N: return
    x=np.arange(L)/SR; sfx[i:i+L]+=g*(np.sin(2*np.pi*(55+120*np.exp(-x*40))*x)*np.exp(-x*9)+rng.standard_normal(L)*np.exp(-x*60)*.5)
def tick(at,g=.25,f=1800):
    i=int(at*SR); L=int(.06*SR)
    if i+L<N: x=np.arange(L)/SR; sfx[i:i+L]+=g*np.sin(2*np.pi*f*x)*np.exp(-x*70)
for s in S[1:]: whoosh(s-.15)
stamp(.55,.7)                     # ticket tear
stamp(S[4]+1.8,.8)                # 10x stamp
stamp(S[1]+3.2,.5)                # WHY?
for a in (S[8]+.9,S[8]+1.9): stamp(a,.5)   # chain strikes
for j in range(8): tick(S[9]+.6+j*.14,.25,1300+j*80)
for j in range(14): tick(S[3]+1.2+j*.18,.15,1700)
tick(S[10]+2,.4,1800); tick(S[10]+3.2,.4,2100); stamp(S[10]+.9,.5)
sfx*=10**(-12/20)
mix=voice+music+sfx
sf.write('audio/premix.wav',mix,SR)
p1=subprocess.run(['ffmpeg','-i','audio/premix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
q=json.loads(re.search(r'\{[^}]*input_i[^}]*\}',p1,re.S).group(0))
subprocess.check_call(['ffmpeg','-v','error','-y','-i','audio/premix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true'%(q['input_i'],q['input_tp'],q['input_lra'],q['input_thresh'],q['target_offset']),'-ar','48000','-ac','1','audio/mix.wav'])
# report on the final mix: scale stems by the same gain
fm,_=sf.read('audio/mix.wav'); fm=fm if fm.ndim==1 else fm.mean(1)
g=np.sqrt(np.mean(fm**2)/np.mean(mix[:len(fm)]**2)); vm=on>0
rv=np.sqrt(np.mean(voice[vm]**2)); rm=np.sqrt(np.mean((music+sfx)[vm]**2))
fr=int(.25*SR); n=len(voice)//fr; vals=[]
for i in range(n):
    sl=slice(i*fr,(i+1)*fr)
    if on[sl].mean()>.9:
        a=np.sqrt(np.mean(voice[sl]**2)); b=np.sqrt(np.mean((music+sfx)[sl]**2))+1e-9; vals.append(20*np.log10(a/b))
rep={'voice_over_music_overall_db':round(20*np.log10(rv/rm),1),'median_db':round(float(np.median(vals)),1),'min_db':round(float(np.min(vals)),1)}
j=subprocess.run(['ffmpeg','-i','audio/mix.wav','-af','loudnorm=I=-14:TP=-1.5:print_format=json','-f','null','-'],capture_output=True,text=True).stderr
m=re.search(r'\{[^}]*input_i[^}]*\}',j,re.S); lj=json.loads(m.group(0)); rep['LUFS']=lj['input_i']; rep['TP']=lj['input_tp']
json.dump(rep,open('audio/mix-report.json','w'),indent=1); print(rep)
