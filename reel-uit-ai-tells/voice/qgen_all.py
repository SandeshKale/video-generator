# Clone the creator's voice with Qwen3-TTS-12Hz-0.6B-Base (Apache-2.0) on CPU: every line in x-vector mode (speaker embedding
# only, so the reference room's reverb is not copied) and ICL mode, 2 seeds each. Resumable.
# Creator feedback (12 Oct): x-vector takes lose the creator's Indian accent, so use MODES=iclAB with the joined A+B reference.
# Run with the qwen venv: /tmp/qwenenv/bin/python qgen_all.py <takes_dir> <ref.wav> "<ref text>"
import sys, os, json, time, torch, numpy as np, soundfile as sf
from qwen_tts import Qwen3TTSModel
out, ref, rtext = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
lines = json.load(open(os.environ.get('LINES', os.path.join(os.path.dirname(__file__), 'lines.json'))))
torch.set_num_threads(4)
m = Qwen3TTSModel.from_pretrained('Qwen/Qwen3-TTS-12Hz-0.6B-Base', device_map='cpu', dtype=torch.float32)
MODES = os.environ.get('MODES', 'xvec,icl').split(','); SEEDS = [int(x) for x in os.environ.get('SEEDS', '1,2').split(',')]
P = {}
for md in MODES:   # 'xvec' = speaker embedding only; 'icl*' = in-context cloning (keeps the speaker's accent and rhythm)
    P[md] = m.create_voice_clone_prompt(ref_audio=ref, x_vector_only_mode=True) if md == 'xvec' else m.create_voice_clone_prompt(ref_audio=ref, ref_text=rtext, x_vector_only_mode=False)
for sid, text in lines:
    for mode in MODES:
        for seed in SEEDS:
            f = f'{out}/{sid}_{mode}{seed}.wav'
            if os.path.exists(f): continue
            torch.manual_seed(seed); t1 = time.time()
            cap = int((len(text.split()) / 1.8 + 2.5) * 12 * 1.4)   # 12 Hz codec frames; caps a run that misses its end token
            w, sr = m.generate_voice_clone(text=text, language='English', voice_clone_prompt=P[mode], do_sample=True, temperature=0.8, max_new_tokens=cap)
            sf.write(f, np.asarray(w[0], dtype=np.float32), sr); print(sid, mode, seed, f'{time.time()-t1:.0f}s', flush=True)
print('ALLDONE', flush=True)
