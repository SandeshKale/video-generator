#!/usr/bin/env python3
"""Pronunciation lexicon experiment: each risky word in 2-4 Devanagari spellings, in a short carrier sentence, 2 seeds each, cloned from the liked reference voice.
Evidence = Whisper (hi) heard text + fuzzy match of the target word; NOT a listen by a person. Writes voice/lex_results.json (resumable)."""
import os, sys, re, json, numpy as np, soundfile as sf, torch, librosa
from rapidfuzz import fuzz
from omnivoice import OmniVoice
from faster_whisper import WhisperModel
torch.set_num_threads(4)
H = os.path.dirname(os.path.abspath(__file__)); SR = 24000
WORDS = {  # key: (list of spellings, carrier format)
 'karz': ['कर्ज़', 'क़र्ज़', 'कर्ज़ा', 'कर्जा', 'लोन'], 'kharcha': ['ख़र्चा', 'खर्चा'], 'tankhwah': ['तनख़्वाह', 'तनख्वाह', 'सैलरी'],
 'byaaj': ['ब्याज', 'बियाज'], 'munafa': ['मुनाफ़ा', 'मुनाफा', 'प्रॉफ़िट'], 'nuksaan': ['नुक़सान', 'नुकसान', 'घाटा'],
 'dneg': ['डी-नेग', 'डी एन ई जी', 'डीनेग'], 'oscar': ['ऑस्कर', 'ओस्कर'], 'primefocus': ['प्राइम फ़ोकस', 'प्राइम फोकस'], 'vfx': ['वी एफ़ एक्स', 'वीएफ़एक्स'],
 'spac': ['स्पैक', 'एस पी ए सी'], 'percent': ['परसेंट', 'प्रतिशत'], 'revenue': ['रेवेन्यू', 'आमदनी'], 'crore': ['करोड़', 'क्रोड़'], 'year95': ['उन्नीस सौ पचानवे', 'उन्नीस सौ पंचानवे'],
 'garage': ['गैराज', 'गेराज'], 'budget': ['बजट', 'बजेट'], 'boxoffice': ['बॉक्स ऑफ़िस', 'गल्ला'], 'strike': ['हड़ताल', 'स्ट्राइक'],
}
CAR = 'सुनिए, {w}, बस यही शब्द बोलना है।'
rp = os.path.join(H, 'lex_results.json'); res = json.load(open(rp)) if os.path.exists(rp) else {}
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32); wh = WhisperModel('medium', device='cpu', compute_type='int8', cpu_threads=4)
ref, _ = sf.read('/home/user/video-generator/reels/tech/reel-quick-commerce-itna-jaldi/audio/takes3/h1_ref.wav')
P = m.create_voice_clone_prompt(ref_audio=(torch.tensor(ref.astype('float32')).unsqueeze(0), SR), ref_text='ब्लिंकिट और ज़ेप्टो से कहा गया, दस मिनट बोलना बंद करो।')
MERGE = {'ट':'त','ठ':'थ','ड':'द','ढ':'ध','ष':'स','श':'स','ज़':'ज','फ़':'फ','क़':'क','ख़':'ख','ग़':'ग','ड़':'र','ढ़':'र'}
def skel(t):
    t = re.sub(r'[़्ँंःा-ौ॑-॔।,.?!\'"’‘ \-]', '', t); return ''.join(MERGE.get(c, c) for c in t)
for key, vs in WORDS.items():
    for v in vs:
        for seed in (11, 12):
            k = f'{key}|{v}|{seed}'
            if k in res: continue
            torch.manual_seed(seed); a = np.asarray(m.generate(text=CAR.format(w=v), language='hi', num_step=32, speed=1.0, voice_clone_prompt=P)[0]).astype('float32')
            y = librosa.resample(a, orig_sr=SR, target_sr=16000); segs, _ = wh.transcribe(y, language='hi', beam_size=5, condition_on_previous_text=False)
            tx = ' '.join(s.text.strip() for s in segs); w = skel(v); hit = fuzz.partial_ratio(w, skel(tx)) if w else 0
            sf.write(f'/tmp/lexw/lex_{key}_{vs.index(v)}_{seed}.wav', a, SR)
            res[k] = dict(heard=tx, hit=hit, dur=round(len(a)/SR, 2)); json.dump(res, open(rp, 'w'), ensure_ascii=False, indent=1); print(k, '->', tx, hit, flush=True)
print('DONE', flush=True)
