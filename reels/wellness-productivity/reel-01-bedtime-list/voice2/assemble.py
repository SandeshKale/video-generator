# Join the picked chunk takes into one paragraph read: whole takes, nothing cut or sped up, short natural gaps only.
import os, json, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 24000; best = json.load(open(f'{HERE}/take_report.json'))['best']
GAP = {'c1': .22, 'c2': .24, 'c3': .20, 'c4': .24}   # silence after each chunk (sentence boundaries of one paragraph)
parts = [np.zeros(int(.03 * SR), np.float32)]
for sid in ['c1', 'c2', 'c3', 'c4', 'c5']:
    y, sr = sf.read(f'{HERE}/takes/{best[sid]}'); assert sr == SR; y = y.astype(np.float32); n = int(.012 * SR); y[:n] *= np.linspace(0, 1, n); y[-n:] *= np.linspace(1, 0, n); parts += [y, np.zeros(int(GAP.get(sid, 0) * SR), np.float32)]
x = np.concatenate(parts + [np.zeros(int(.4 * SR), np.float32)]); x = x / np.abs(x).max() * .9
os.makedirs(f'{HERE}/../audio', exist_ok=True); sf.write(f'{HERE}/../audio/voice.wav', x, SR); print('voice.wav', round(len(x) / SR, 2), 's')
