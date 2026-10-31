import os, sys, re, json, time, numpy as np, soundfile as sf, torch, librosa
from faster_whisper import WhisperModel
from omnivoice import OmniVoice
torch.set_num_threads(4)
OUT = '/tmp/scr/qc/exp'; INS = 'male, middle-aged, low pitch, indian accent'; SEED = 7
# (id, A mixed-script, B all-Devanagari, C romanized Hinglish)
L = [
 ('s1', "जनवरी में सरकार ने Blinkit, Zepto और Swiggy से कहा, अब से '10 minute' मत बोलो।",
        "जनवरी में सरकार ने ब्लिंकिट, ज़ेप्टो और स्विगी से कहा, अब से 'दस मिनट' मत बोलो।",
        "January mein sarkar ne Blinkit, Zepto aur Swiggy se kaha, ab se '10 minute' mat bolo."),
 ('s2', "फिर भी आपका दूध इतनी जल्दी कैसे आ जाता है?",
        "फिर भी आपका दूध इतनी जल्दी कैसे आ जाता है?",
        "Phir bhi aapka doodh itni jaldi kaise aa jaata hai?"),
 ('s3', "राइडर की speed असली राज़ नहीं है। असली खेल तो उसके निकलने से पहले हो चुका होता है।",
        "राइडर की स्पीड असली राज़ नहीं है। असली खेल तो उसके निकलने से पहले हो चुका होता है।",
        "Rider ki speed asli raaz nahi hai. Asli khel toh uske nikalne se pehle ho chuka hota hai."),
 ('s4', "आपका order सबसे पहले आपके सबसे पास वाला dark store ढूँढता है, जहाँ वो चीज़ stock में हो।",
        "आपका ऑर्डर सबसे पहले आपके सबसे पास वाला डार्क स्टोर ढूँढता है, जहाँ वो चीज़ स्टॉक में हो।",
        "Aapka order sabse pehle aapke sabse paas wala dark store dhoondhta hai, jahaan woh cheez stock mein ho."),
 ('s5', "हर store का एक geofence होता है, मतलब नक्शे पर एक घेरा।",
        "हर स्टोर का एक जियोफेंस होता है, मतलब नक्शे पर एक घेरा।",
        "Har store ka ek geofence hota hai, matlab nakshe par ek ghera."),
 ('s6', "और shelf पर क्या रखना है, ये हर PIN code के हिसाब से पहले से तय होता है। त्योहार हो या cricket match, demand का अंदाज़ा पहले ही लग जाता है।",
        "और शेल्फ पर क्या रखना है, ये हर पिन कोड के हिसाब से पहले से तय होता है। त्योहार हो या क्रिकेट मैच, डिमांड का अंदाज़ा पहले ही लग जाता है।",
        "Aur shelf par kya rakhna hai, yeh har PIN code ke hisaab se pehle se tay hota hai. Tyohaar ho ya cricket match, demand ka andaaza pehle hi lag jaata hai."),
 ('s7', "Packer के handheld पर bin की location आती है। हर item का barcode scan होता है, और अंडे सबसे आख़िर में उठाए जाते हैं।",
        "पैकर के हैंडहेल्ड पर बिन की लोकेशन आती है। हर आइटम का बारकोड स्कैन होता है, और अंडे सबसे आख़िर में उठाए जाते हैं।",
        "Packer ke handheld par bin ki location aati hai. Har item ka barcode scan hota hai, aur ande sabse aakhir mein uthaaye jaate hain."),
 ('s8', "Rider store के अंदर आता ही नहीं। वो बस pigeonhole से अपना bag scan करता है, और निकल जाता है।",
        "राइडर स्टोर के अंदर आता ही नहीं। वो बस पिजनहोल से अपना बैग स्कैन करता है, और निकल जाता है।",
        "Rider store ke andar aata hi nahi. Woh bas pigeonhole se apna bag scan karta hai, aur nikal jaata hai."),
 ('s9', "तो सवाल ये है, क्या 10 minute का वादा वापस आना चाहिए? कमेंट में बताओ।",
        "तो सवाल ये है, क्या दस मिनट का वादा वापस आना चाहिए? कमेंट में बताओ।",
        "Toh sawaal yeh hai, kya 10 minute ka vaada wapas aana chahiye? Comment mein batao."),
 ('s10', "Like, share और subscribe करना, Sandesh Explains को।",
         "लाइक, शेयर और सब्सक्राइब करना, संदेश एक्सप्लेन्स को।",
         "Like, share aur subscribe karna, Sandesh Explains ko."),
]
# canonical Devanagari (= format B) for scoring; english-term lists in Devanagari
TERMS = {'s1':['ब्लिंकिट','जेप्टो','स्विगी','मिनट'],'s3':['राइडर','स्पीड'],'s4':['ऑर्डर','डार्क','स्टोर','स्टॉक'],'s5':['स्टोर','जियोफेंस'],
         's6':['शेल्फ','पिन','कोड','क्रिकेट','मैच','डिमांड'],'s7':['पैकर','हैंडहेल्ड','बिन','लोकेशन','आइटम','बारकोड','स्कैन'],
         's8':['राइडर','स्टोर','पिजनहोल','बैग','स्कैन'],'s9':['मिनट','कमेंट'],'s10':['लाइक','शेयर','सब्सक्राइब','एक्सप्लेन']}
# coarse phonetic skeleton: drop matras/nukta/virama/nasal marks; merge dental/retroflex, v/w, sibilants
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ण':'न','ञ':'न','ङ':'न','व':'व','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र','ळ':'ल','ऑ':'ओ','ऐ':'ए','औ':'ओ','ई':'इ','ऊ':'उ','ऋ':'र','आ':'अ','ऍ':'ए'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!\'"’‘ \-]', '', t)
    t = ''.join(MERGE.get(c, c) for c in t); return t
def tokens_skel(t): return [skel(w) for w in re.split(r'\s+', re.sub(r'[।,.?!\'"]', ' ', t)) if skel(w)]
from rapidfuzz import fuzz
if __name__ == '__main__':
    m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
    wh = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
    res = {}; rp = f'{OUT}/results.json'
    if os.path.exists(rp): res = json.load(open(rp))
    def gen(text, speed=1.0, seed=SEED):
        torch.manual_seed(seed)
        return np.asarray(m.generate(text=text, instruct=INS, language='hi', num_step=32, speed=speed)[0]).astype('float32')
    def analyse(a, canon, terms):
        segs, _ = wh.transcribe(a, language='hi', beam_size=5, word_timestamps=False, condition_on_previous_text=False)
        tx = ' '.join(s.text for s in segs)
        whole = fuzz.ratio(skel(canon), skel(tx))
        tk = skel(tx); tm = [fuzz.partial_ratio(skel(t), tk) for t in terms]
        return tx, whole, (float(np.mean(tm)) if tm else None), tm
    def prosody(a):
        y = librosa.resample(a, orig_sr=24000, target_sr=16000); hop = 160
        rms = librosa.feature.rms(y=y, frame_length=400, hop_length=hop)[0]; db = 20*np.log10(rms+1e-8); voiced = db > db.max()-40
        runs=[]; s=None
        for i,v in enumerate(voiced):
            if v and s is None: s=i
            if not v and s is not None: runs.append([s,i]); s=None
        if s is not None: runs.append([s,len(voiced)])
        merged=[]
        for a0,b0 in runs:
            if merged and (a0-merged[-1][1])*hop/16000 < 0.08: merged[-1][1]=b0
            else: merged.append([a0,b0])
        sp=[(a0*hop/16000,b0*hop/16000) for a0,b0 in merged if (b0-a0)*hop/16000>=0.08]
        pz=[sp[i+1][0]-sp[i][1] for i in range(len(sp)-1)]
        f0,_,_=librosa.pyin(y, fmin=70, fmax=400, sr=16000, frame_length=1024, hop_length=hop); f=f0[~np.isnan(f0)]
        st=12*np.log2(f0/np.nanmedian(f0)) if len(f)>20 else np.array([0.0])
        return dict(dur=round(len(a)/24000,2), speech=round(sum(b-a for a,b in sp),2), pauses_ms=[round(p*1000) for p in pz if p>=0.2], f0=round(float(np.median(f))) if len(f)>20 else None,
                    semi_std=round(float(np.nanstd(st)),2), p10_90=round(float(12*np.log2(np.percentile(f,90)/np.percentile(f,10))),1) if len(f)>20 else None)
    # --- 1. script-format experiment
    for sid, A, B, C in L:
        for fmt, text in (('A', A), ('B', B), ('C', C)):
            key = f'{sid}_{fmt}'
            if key in res: continue
            t0 = time.time(); a = gen(text); sf.write(f'{OUT}/{key}.wav', a, 24000)
            tx, whole, tm, tms = analyse(a, B, TERMS.get(sid, []))
            res[key] = dict(text=text, tx=tx, whole=round(whole,1), terms=None if tm is None else round(tm,1), **prosody(a))
            json.dump(res, open(rp,'w'), ensure_ascii=False, indent=1); print(key, res[key]['whole'], res[key]['terms'], res[key]['dur'], f'{time.time()-t0:.0f}s', flush=True)
    # --- 2. pause/punctuation experiment (same words, different marks)
    P = {'p_plain':"इसे dark store कहते हैं और ये सबसे ज़रूरी चीज़ है", 'p_comma':"इसे, dark store कहते हैं, और ये सबसे ज़रूरी चीज़ है", 'p_danda':"इसे dark store कहते हैं। और ये सबसे ज़रूरी चीज़ है।",
         'p_dots':"इसे... dark store कहते हैं... और ये सबसे ज़रूरी चीज़ है...", 'p_newline':"इसे dark store कहते हैं।\n\nऔर ये सबसे ज़रूरी चीज़ है।", 'p_dash':"इसे dark store कहते हैं — और ये सबसे ज़रूरी चीज़ है।",
         'p_exclaim':"इसे dark store कहते हैं! और ये सबसे ज़रूरी चीज़ है!", 'p_q':"इसे dark store क्यों कहते हैं? क्योंकि ये सबसे ज़रूरी चीज़ है।"}
    for k, text in P.items():
        if k in res: continue
        a = gen(text); sf.write(f'{OUT}/{k}.wav', a, 24000); res[k] = dict(text=text, **prosody(a)); json.dump(res, open(rp,'w'), ensure_ascii=False, indent=1); print(k, res[k]['dur'], res[k]['pauses_ms'], flush=True)
    # --- 3. speed experiment on one long line
    base = L[5][1]
    for sp_ in (0.9, 1.0, 1.1, 1.2):
        k = f'speed_{sp_}'
        if k in res: continue
        a = gen(base, speed=sp_); sf.write(f'{OUT}/{k}.wav', a, 24000); tx, whole, tm, _ = analyse(a, L[5][2], TERMS['s6'])
        res[k] = dict(text=base, whole=round(whole,1), terms=round(tm,1), **prosody(a)); json.dump(res, open(rp,'w'), ensure_ascii=False, indent=1); print(k, res[k]['dur'], res[k]['whole'], flush=True)
    print('ALL_DONE')
