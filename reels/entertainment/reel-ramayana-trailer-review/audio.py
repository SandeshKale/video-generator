# Score + SFX for the review. Voice = avatar audio (audio/voice.wav). Music is kept simple under speech: warm drone pad, soft pulse that
# gains a layer per act, ducked by voice activity; SFX on the page's own beats. Output audio/mix.wav (48 kHz mono, -14 LUFS target).
import numpy as np, soundfile as sf, subprocess, json, re
SR=48000; END=55.167
v,sr=sf.read('audio/voice.wav'); v=v if v.ndim==1 else v.mean(1)
N=int(END*SR); voice=np.zeros(N); voice[:min(N,len(v))]=v[:N]
t=np.arange(N)/SR
def env(a,b,x): return np.clip((x-a)/(b-a),0,1)
def tone(f,x): return np.sin(2*np.pi*f*x)
# drone: D2 + A2 + D3 with slow detune; filtered by simple one-pole low-pass
d=sum(tone(f,t+0.002*np.sin(t*.3+f))*a for f,a in ((73.4,.5),(110,.3),(146.8,.22),(220.5,.08)))
d*=.6+.4*np.sin(2*np.pi*t/9.0)
# pulse: soft low tom each 0.75 s from 5.4 s, gets denser from 26.9 s; hats from 40.2 s
pulse=np.zeros(N)
def hit(at,f=62,g=.9,dec=7):
    i=int(at*SR); L=int(.5*SR); 
    if i>=N: return
    x=np.arange(min(L,N-i))/SR; pulse[i:i+len(x)]+=g*np.sin(2*np.pi*(f+60*np.exp(-x*30))*x)*np.exp(-x*dec)
at=5.4
while at<END-1:
    hit(at,g=.7 if int(at/.75)%2 else .95); at+=.75
at=26.9
while at<END-1: hit(at+.375,f=90,g=.35,dec=11); at+=.75
hats=np.zeros(N); rng=np.random.default_rng(3)
at=40.2
while at<END-1.5:
    i=int(at*SR); L=int(.05*SR); hats[i:i+L]+=rng.standard_normal(L)*np.exp(-np.arange(L)/SR*80)*.25; at+=.375
pad_gain=.35+.65*env(2,6,t)
music=(d*.55*pad_gain+pulse*.55*env(5.4,6.5,t)+hats*.5)
# fade in 0-1, out last 2 s
music*=env(0,1,t)*(1-env(END-2.2,END,t))
# voice-activity ducking
act=np.abs(voice); k=int(.12*SR); sm=np.convolve(act,np.ones(k)/k,'same'); on=(sm>0.012).astype(float)
k2=int(.25*SR); duck=np.convolve(on,np.ones(k2)/k2,'same'); duck=np.clip(duck*1.6,0,1)
music*=10**((-6-14*duck)/20)  # -6 dB in gaps, -20 dB under speech
# SFX: whoosh at scene cuts, stamp hits, ticks
sfx=np.zeros(N)
def whoosh(at,dur=.5,g=.5):
    i=int((at-dur*.6)*SR); L=int(dur*SR)
    if i<0: return
    x=rng.standard_normal(L); w=np.convolve(x,np.ones(40)/40,'same'); e=np.sin(np.linspace(0,np.pi,L))**2
    sfx[i:i+L]+=w*e*g*(np.linspace(.5,1.2,L))
def stamp(at,g=.9):
    i=int(at*SR); L=int(.45*SR); x=np.arange(L)/SR
    sfx[i:i+L]+=g*(np.sin(2*np.pi*(55+120*np.exp(-x*40))*x)*np.exp(-x*9)+rng.standard_normal(L)*np.exp(-x*60)*.5)
def tick(at,g=.25,f=1800):
    i=int(at*SR); L=int(.06*SR); x=np.arange(L)/SR; sfx[i:i+L]+=g*np.sin(2*np.pi*f*x)*np.exp(-x*70)
S=[0,5.38,13.417,18.057,21.517,26.917,31.497,35.757,40.167,45.807,50.007]
for s in S[1:]: whoosh(s-.2)
stamp(5.38+1.82); stamp(5.38+4.3,.5)
for k in (.9,1.9,3.0): stamp(13.417+k,.55)           # FLAT ARMIES / GIANT / VFX
tick(35.757+1.1,.35,1400); tick(35.757+2.6,.35,1400); stamp(35.757+2.18,.8)
tick(26.917+.7,.3,1000); tick(26.917+.7+0.12,.3,1200); tick(31.497+.7,.3,900)
tick(50.007+1.8,.5,1600); tick(50.007+2.3,.5,2000)
sfx*=10**(-14/20)
mix=voice*1.0+music+sfx
sf.write('audio/premix.wav',mix,SR)
subprocess.check_call(['ffmpeg','-v','error','-y','-i','audio/premix.wav','-af','loudnorm=I=-14:TP=-1.5:LRA=7','-ar','48000','-ac','1','audio/mix.wav'])
# report: voice over (music+sfx) on voiced frames
vm=(on>0)
rv=np.sqrt(np.mean(voice[vm]**2)); rm=np.sqrt(np.mean((music+sfx)[vm]**2))
print('voice over music+sfx on voiced frames: %.1f dB'%(20*np.log10(rv/rm)))
