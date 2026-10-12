import os, sys, time, json, torch, numpy as np, soundfile as sf
from omnivoice import OmniVoice
V = sys.argv[1]; only = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] else None
TAKES = int(os.environ.get('TAKES', '1'))
torch.set_num_threads(4)
REFS = {
 'A': "Okay, here's the thing, I don't need this perfect, I just need it to sound like me.",
 'B': "I speed up when I'm excited and I drop my voice when I'm sure, yeah, right, you know what I mean?",
}
LINES = [  # id, spoken text, speed
 ('l01', "You keep explaining the same thing to A I. Teach it once instead.", 1.05),
 ('l02', "A skill is a small instruction file Claude pulls out only when needed. Four steps.", 1.0),
 ('l03', "Step one. Pick a task you've explained more than twice, like your weekly update.", 1.0),
 ('l04', "Step two. Ask Claude: create a skill for my weekly team update. Add the format, the tone, and one example you liked.", 1.0),
 ('l05', "Claude writes the skill file. A short name, and a description of what it does, and when.", 1.0),
 ('l06', "Step three. Save it, and switch it on in Skills settings. In Claude Code, it's just a folder.", 1.0),
 ('l07', "Step four. Test it in a new chat. If Claude doesn't pick it up, sharpen the description.", 1.0),
 ('l08', "The clever part? Until it's needed, a skill costs about a hundred tokens. So keep dozens.", 1.0),
 ('l09', "The catch. Code execution must be on. Skills don't sync between apps. And only install ones you trust. They can run code.", 0.94),
 ('l10', "Never put passwords in one.", 0.97),
 ('l11', "Save this, and follow for more.", 0.97),
]
json.dump([list(l) for l in LINES], open(f'{V}/lines.json', 'w'), indent=1)
t0 = time.time()
model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
print('loaded', round(time.time() - t0), flush=True)
for sid, say, speed in LINES:
    if only and sid not in only: continue
    for rk, rt in REFS.items():
        for ti in range(TAKES):
            out = f'{V}/takes/{sid}_{rk}{ti}.wav'
            if os.path.exists(out): continue
            torch.manual_seed(1000 * int(sid[1:]) + 10 * ti + ord(rk))
            t1 = time.time()
            audio = model.generate(text=say, ref_audio=f'{V}/ref_{rk}.wav', ref_text=rt, num_step=32, speed=speed)
            sf.write(out, np.asarray(audio[0]).astype(np.float32), 24000)
            print(sid, rk, ti, f'{time.time()-t1:.0f}s', f'{len(audio[0])/24000:.2f}s audio', flush=True)
print('done', round(time.time() - t0), flush=True)
