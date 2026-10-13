# Late-reverb suppression for the cloned voice (creator: "a lot of reverb ... should be clean, sharp"). Habets-style spectral subtraction:
# the late-reverb power in each STFT bin is modelled as the total power ND frames earlier, decayed by the room's RT60, and removed with a
# floored, time-smoothed gain; then a soft expander closes the gaps between words. Pure numpy/scipy, offline.
import numpy as np
from scipy.signal import stft, istft
from scipy.ndimage import uniform_filter1d
def dereverb(x, sr, rt60=.55, nd_ms=50, over=1.6, gmin=.12, nfft=1024, hop=256):
    f, t, X = stft(x, sr, nperseg=nfft, noverlap=nfft - hop); P = np.abs(X) ** 2
    nd = max(1, int(round(nd_ms / 1000 * sr / hop))); delta = 3 * np.log(10) / rt60; dec = np.exp(-2 * delta * nd * hop / sr)
    Pl = np.zeros_like(P); Pl[:, nd:] = dec * P[:, :-nd]
    # recursive: reverb tails accumulate, so use the already-cleaned power for the history (more accurate on long words)
    G = np.ones_like(P); Pc = P.copy()
    for k in range(nd, P.shape[1]):
        late = dec * Pc[:, k - nd]; g = np.sqrt(np.maximum(P[:, k] - over * late, 0) / (P[:, k] + 1e-12)); g = np.maximum(g, gmin); G[:, k] = g; Pc[:, k] = (g ** 2) * P[:, k]
    G = uniform_filter1d(G, 3, axis=1); G = uniform_filter1d(G, 3, axis=0)
    _, y = istft(X * G, sr, nperseg=nfft, noverlap=nfft - hop); y = y[:len(x)]
    return np.pad(y, (0, len(x) - len(y)))
def tail_ratio_db(x, sr, thr_db=-30):
    # median level 120-320 ms after each speech offset relative to the speech level (more negative = drier)
    hop = int(.01 * sr); e = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) + 1e-9 for i in range(0, len(x) - hop, hop)])); pk = np.percentile(e, 98)
    on = e > pk - 22; out = []
    for i in range(1, len(on) - 33):
        if on[i - 1] and not on[i]:
            seg = e[i + 12:i + 32]
            if len(seg) and not on[i + 12:i + 32].any(): out.append(np.mean(seg) - pk)
    return float(np.median(out)) if out else None, len(out)
