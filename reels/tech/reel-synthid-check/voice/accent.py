# Accent ID (SpeechBrain ECAPA on CommonAccent, 16 English accents incl. "indian"). The model outputs cosine scores, so we
# report the margin = score(indian) - best other accent (positive = classified Indian) and the top label.
import sys, torch, librosa
from speechbrain.inference.classifiers import EncoderClassifier
clf = EncoderClassifier.from_hparams(source='Jzuluaga/accent-id-commonaccent_ecapa', savedir='/tmp/accent_model', run_opts={'device': 'cpu'})
labs = clf.hparams.label_encoder; IND = labs.lab2ind['indian']
def margin(f):
    y, _ = librosa.load(f, sr=16000); s = clf.classify_batch(torch.tensor(y)[None])[0][0]
    other = torch.cat([s[:IND], s[IND + 1:]]).max(); return float(s[IND] - other), labs.ind2lab[int(s.argmax())]
if __name__ == '__main__':
    for f in sys.argv[1:]:
        m, top = margin(f); print('%-40s indian-margin %+.3f  top %s' % (f.split('/')[-1][-40:], m, top), flush=True)
