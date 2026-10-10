# Runs LivePortrait's own inference.py with InsightFace replaced by OpenCV YuNet (MIT) so no non-commercial detection models are used.
import sys, os, types, runpy, cv2, numpy as np
LP = os.environ['LP_DIR']; YUNET = os.environ['YUNET_ONNX']
sys.path.insert(0, LP); os.chdir(LP)
class _Face:
    def __init__(self, lmk, bbox): self.landmark_2d_106 = lmk; self.bbox = bbox
class FaceAnalysisDIY:
    def __init__(self, *a, **k): pass
    def prepare(self, ctx_id=0, det_size=(512, 512), det_thresh=0.5): self.thr = 0.5
    def warmup(self): pass
    def get(self, img_bgr, **kw):
        h, w = img_bgr.shape[:2]
        det = cv2.FaceDetectorYN.create(YUNET, '', (w, h), 0.5, 0.3, 5000); det.setInputSize((w, h))
        _, faces = det.detect(np.ascontiguousarray(img_bgr))
        if faces is None: return []
        faces = sorted(faces, key=lambda f: -f[2] * f[3]); mx = kw.get('max_face_num', 0) or 1; faces = faces[:mx]
        return [_Face(f[4:14].reshape(5, 2).astype(np.float32), f[:4]) for f in faces]
m = types.ModuleType('src.utils.face_analysis_diy'); m.FaceAnalysisDIY = FaceAnalysisDIY; sys.modules['src.utils.face_analysis_diy'] = m
import onnxruntime as ort
_I = ort.InferenceSession
def _S(path, *a, **k):
    k['providers'] = ['CPUExecutionProvider']; k.pop('provider_options', None); return _I(path, *a, **k)
ort.InferenceSession = _S
sys.argv = ['inference.py'] + sys.argv[1:]
runpy.run_path(os.path.join(LP, 'inference.py'), run_name='__main__')
