# Reference clip of Kokoro "am_adam" (the Adam voice used in earlier reels) for OmniVoice zero-shot cloning, plus a plain Kokoro read of the whole paragraph for A/B.
import numpy as np, soundfile as sf, re
from kokoro import KPipeline
pipe = KPipeline(lang_code='a')
REF = "Okay, so here's the thing. I don't need this to be perfect. I just want it to sound like a real person talking to you, calm and clear, like a friend explaining something over a cup of tea."
def synth(text, speed=1.0):
    out = [np.asarray(a, dtype=np.float32) for _, _, a in pipe(text, voice='am_adam', speed=speed)]
    return np.concatenate(out)
y = synth(REF); sf.write('ref_adam.wav', y, 24000); open('ref_adam.txt', 'w').write(REF); print('ref', round(len(y) / 24000, 1), 's')
full = synth(open('voiceover.txt').read().strip().replace('\n', ' ')); sf.write('kokoro_adam_full.wav', full, 24000); print('kokoro full', round(len(full) / 24000, 1), 's')
