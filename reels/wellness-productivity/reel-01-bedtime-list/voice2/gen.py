# OmniVoice zero-shot clone of the Adam reference (voice2/ref_adam.wav) -> takes/<id>_s<seed>.wav. Resumable. Run with /tmp/ttsenv/bin/python.
import os, sys, json, time, torch, numpy as np, soundfile as sf
from omnivoice import OmniVoice
torch.set_num_threads(4)
HERE = os.path.dirname(os.path.abspath(__file__)); os.makedirs(f'{HERE}/takes', exist_ok=True)
LINES = json.load(open(f'{HERE}/lines.json')); REF = f'{HERE}/ref_adam.wav'; RT = open(f'{HERE}/ref_adam.txt').read().strip()
SEEDS = [int(x) for x in os.environ.get('SEEDS', '1,2,3').split(',')]; SPEED = float(os.environ.get('SPEED', 1.0))
t0 = time.time(); model = OmniVoice.from_pretrained('k2-fsa/OmniVoice', device_map='cpu', dtype=torch.float32); print('loaded', round(time.time() - t0), flush=True)
for seed in SEEDS:
    for sid, text in LINES:
        out = f'{HERE}/takes/{sid}_s{seed}.wav'
        if os.path.exists(out): continue
        torch.manual_seed(seed * 100 + int(sid[1:])); t1 = time.time()
        audio = model.generate(text=text, ref_audio=REF, ref_text=RT, num_step=32, speed=SPEED)
        sf.write(out, np.asarray(audio[0]).astype(np.float32), 24000); print(sid, seed, f'{time.time()-t1:.0f}s {len(audio[0])/24000:.1f}s audio', flush=True)
print('ALLDONE', flush=True)
