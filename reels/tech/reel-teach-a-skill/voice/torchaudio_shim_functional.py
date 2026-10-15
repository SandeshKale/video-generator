import math
import numpy as np
import torch
from scipy.signal import resample_poly

def resample(waveform, orig_freq, new_freq, **kw):
    orig_freq, new_freq = int(orig_freq), int(new_freq)
    if orig_freq == new_freq:
        return waveform
    g = math.gcd(orig_freq, new_freq)
    x = waveform.detach().cpu().to(torch.float32).numpy()
    y = resample_poly(x, new_freq // g, orig_freq // g, axis=-1).astype(np.float32)
    return torch.from_numpy(y).to(waveform.device, dtype=waveform.dtype)
