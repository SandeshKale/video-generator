# Clone the creator's voice with Qwen3-TTS-12Hz-0.6B-Base (Apache-2.0) on CPU: every line in x-vector mode (speaker embedding
# only, so the reference room's reverb is not copied) and ICL mode, 2 seeds each. Resumable.
# Run with the qwen venv: /tmp/qwenenv/bin/python qgen_all.py <takes_dir> <ref.wav> "<ref text>"
import sys, os, json, time, torch, numpy as np, soundfile as sf
from qwen_tts import Qwen3TTSModel
out, ref, rtext = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
lines = json.load(open(os.path.join(os.path.dirname(__file__), 'lines.json')))
torch.set_num_threads(4)
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-0.6B-Base', device_map='cpu', dtype=torch.float32)
P = {'xvec': m.create_voice_clone_prompt(ref_audio=ref, x_vector_only_mode=True),
     'icl': m.create_voice_clone_prompt(ref_audio=ref, ref_text=rtext, x_vector_only_mode=False)}
for sid, text in lines:
    for mode in ('xvec', 'icl'):
        for seed in (1, 2):
            f = f'{out}/{sid}_{mode}{seed}.wav'
            if os.path.exists(f): continue
            torch.manual_seed(seed); t1 = time.time()
            w, sr = m.generate_voice_clone(text=text, language='English', voice_clone_prompt=P[mode], do_sample=True, temperature=0.8)
            sf.write(f, np.asarray(w[0], dtype=np.float32), sr); print(sid, mode, seed, f'{time.time()-t1:.0f}s', flush=True)
print('ALLDONE', flush=True)
