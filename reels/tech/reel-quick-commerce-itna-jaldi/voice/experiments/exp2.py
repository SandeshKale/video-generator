import os, json, time, numpy as np, soundfile as sf, torch, librosa, re
from omnivoice import OmniVoice
from faster_whisper import WhisperModel
torch.set_num_threads(4)
OUT='/tmp/scr/qc/exp2'; os.makedirs(OUT, exist_ok=True); INS='male, middle-aged, low pitch, indian accent'
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
wh = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
res={}; rp=OUT+'/results.json'
def save(): json.dump(res, open(rp,'w'), ensure_ascii=False, indent=1)
def f0stats(a):
    y=librosa.resample(a,orig_sr=24000,target_sr=16000); f0,_,_=librosa.pyin(y,fmin=70,fmax=400,sr=16000,frame_length=1024,hop_length=160); f=f0[~np.isnan(f0)]
    return (round(float(np.median(f))), round(float(12*np.log2(np.percentile(f,90)/np.percentile(f,10))),1), round(float(np.nanstd(12*np.log2(f0/np.nanmedian(f0)))),2)) if len(f)>20 else (None,None,None)
def asr(a, lang='hi'):
    segs,_=wh.transcribe(a, language=lang, beam_size=5, condition_on_previous_text=False); return ' '.join(s.text for s in segs).strip()
def gen(text, **kw):
    torch.manual_seed(7); return np.asarray(m.generate(text=text, language='hi', num_step=32, **kw)[0]).astype('float32')
SENT = ["फिर भी आपका दूध उतनी ही जल्दी आता है। कैसे?",
        "राइडर की speed असली राज़ नहीं है। असली खेल, आपके order करने से पहले ही हो चुका होता है।",
        "पहला फ़ैसला, कौन सा store। हर dark store का नक्शे पर एक घेरा होता है, जिसे geofence कहते हैं।",
        "अंडे? सबसे आख़िर में उठाए जाते हैं, ताकि टूटें नहीं।"]
# --- A. voice lock: 4 design takes (different seeds per sentence) vs clone-prompt takes
f0s_design=[]; 
for i,s in enumerate(SENT):
    torch.manual_seed(100+i); a=np.asarray(m.generate(text=s, instruct=INS, language='hi', num_step=32)[0]).astype('float32'); sf.write(f'{OUT}/design_{i}.wav',a,24000); f0s_design.append(f0stats(a)[0])
res['voice_lock_design_f0']=f0s_design; save(); print('design f0', f0s_design, flush=True)
# pick the design take whose f0 is closest to the reference male 112 Hz as the anchor
anchor=min(range(4), key=lambda i: abs((f0s_design[i] or 999)-112)); aw,_=sf.read(f'{OUT}/design_{anchor}.wav'); aw=aw.astype('float32')
anchor_text=SENT[anchor]; res['anchor']=anchor; print('anchor',anchor,f0s_design[anchor], flush=True)
prompt=m.create_voice_clone_prompt(ref_audio=(torch.tensor(aw).unsqueeze(0),24000), ref_text=anchor_text)
f0s_clone=[]
for i,s in enumerate(SENT):
    torch.manual_seed(200+i); a=np.asarray(m.generate(text=s, voice_clone_prompt=prompt, language='hi', num_step=32)[0]).astype('float32'); sf.write(f'{OUT}/clone_{i}.wav',a,24000); f0s_clone.append(f0stats(a)[0])
res['voice_lock_clone_f0']=f0s_clone; save(); print('clone f0', f0s_clone, flush=True)
# --- B. phoneme tags for brand/loan words (CMU) vs plain Latin vs Devanagari respell
BR = {'plain':"Blinkit, Zepto और Swiggy से कहा, geofence और PIN code।",
      'cmu':"[B L IH1 NG K IH0 T], [Z EH1 P T OW0] और [S W IH1 G IY0] से कहा, [JH IY1 OW0 F EH2 N S] और PIN code।",
      'deva':"ब्लिंकिट, ज़ेप्टो और स्विगी से कहा, जियोफेंस और पिन कोड।"}
for k,t in BR.items():
    a=gen(t, voice_clone_prompt=prompt); sf.write(f'{OUT}/brand_{k}.wav',a,24000); res['brand_'+k]=dict(text=t, tx=asr(a), dur=round(len(a)/24000,2), f0=f0stats(a)[0]); save(); print('brand',k,res['brand_'+k]['tx'], flush=True)
# --- C. non-verbal tags inside Hinglish lines
NV = {'nv_none':"अंडे? सबसे आख़िर में उठाए जाते हैं, ताकि टूटें नहीं।", 'nv_qah':"[question-ah] अंडे? सबसे आख़िर में उठाए जाते हैं, ताकि टूटें नहीं।",
      'nv_conf':"[confirmation-en] सबसे आख़िर में उठाए जाते हैं, ताकि टूटें नहीं।", 'nv_surp':"[surprise-oh] सरकार ने कहा, दस minute बोलना बंद करो।", 'nv_sigh':"[sigh] घड़ी बदल गई, system नहीं।"}
for k,t in NV.items():
    a=gen(t, voice_clone_prompt=prompt); sf.write(f'{OUT}/{k}.wav',a,24000); res[k]=dict(text=t, tx=asr(a), dur=round(len(a)/24000,2)); save(); print(k,res[k]['dur'],res[k]['tx'], flush=True)
# --- D. fixed duration vs natural vs speed on one line
D=SENT[2]; base=gen(D, voice_clone_prompt=prompt); nat=len(base)/24000; res['dur_natural']=round(nat,2); sf.write(f'{OUT}/dur_natural.wav',base,24000)
for fac in (0.85,1.0,1.15):
    a=gen(D, voice_clone_prompt=prompt, duration=round(nat*fac,2)); sf.write(f'{OUT}/dur_{fac}.wav',a,24000); res[f'dur_{fac}']=dict(target=round(nat*fac,2), got=round(len(a)/24000,2), tx=asr(a)); save(); print('dur',fac,res[f'dur_{fac}'], flush=True)
# --- E. 'term reveal' line: explicit pause after the term via punctuation vs ellipsis, with the locked voice
TR={'tr_plain':"इसे geofence कहते हैं और ये सबसे ज़रूरी चीज़ है।", 'tr_comma':"इसे, geofence कहते हैं, और ये सबसे ज़रूरी चीज़ है।", 'tr_dots':"इसे... geofence कहते हैं... और ये सबसे ज़रूरी चीज़ है।", 'tr_split':"इसे geofence कहते हैं।\n\nऔर ये सबसे ज़रूरी चीज़ है।"}
def pz(a):
    y=librosa.resample(a,orig_sr=24000,target_sr=16000); rms=librosa.feature.rms(y=y,frame_length=400,hop_length=160)[0]; db=20*np.log10(rms+1e-8); v=db>db.max()-40
    runs=[];s=None
    for i,x in enumerate(v):
        if x and s is None:s=i
        if not x and s is not None: runs.append([s,i]);s=None
    if s is not None: runs.append([s,len(v)])
    mg=[]
    for a0,b0 in runs:
        if mg and (a0-mg[-1][1])*0.01<0.08: mg[-1][1]=b0
        else: mg.append([a0,b0])
    sp=[(a0*0.01,b0*0.01) for a0,b0 in mg if (b0-a0)*0.01>=0.08]; return [round((sp[i+1][0]-sp[i][1])*1000) for i in range(len(sp)-1) if sp[i+1][0]-sp[i][1]>=0.2]
for k,t in TR.items():
    a=gen(t, voice_clone_prompt=prompt); sf.write(f'{OUT}/{k}.wav',a,24000); res[k]=dict(text=t, dur=round(len(a)/24000,2), pauses_ms=pz(a)); save(); print(k,res[k], flush=True)
print('EXP2_DONE')
