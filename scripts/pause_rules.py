"""Natural-pause rules for Hinglish/Hindi voice-overs (study: docs/HINGLISH-VOICEOVER-GUIDE.md section 1 + scripts/voice_pause_report.py).
Reference (a real explainer voice): ~31% silence, a stop >= 0.4 s about every 3 s, 0.8-1.2 s after a named term / question / reveal, 0.2-0.3 s at commas.
Our cloned takes (one take per 1-2 sentences, punctuation does almost nothing inside a take) measured 22% silence and a stop >= 0.4 s every 6.6 s, with only
10 comma-sized pauses in 106 s. These rules set the TARGET total pause after each punctuation mark; scripts/pause_inject.py adds only what the take lacks."""
import re
CLAUSE = .26      # , (and ;)
COLON = .45       # :  (an intro that must land: "Technology." / "Ek chhoti si dikkat:")
SENT = .55        # sentence end (।  .)
QUEST = .90       # ?
EXCL = .70        # !
REVEAL = .95      # after a named term or reveal ("... jise X kehte hain।")
REVEAL_PATTERNS = ['कहते हैं', 'कहते है']
LAST_JITTER = .12 # +-12% deterministic variation so no two pauses are identical
def mark_kind(tok):
    t = tok.rstrip()
    if not t: return None
    c = t[-1]
    if c in '?': return 'Q'
    if c in '!': return 'E'
    if c in '।.': return 'S'
    if c in ':': return 'K'
    if c in ',;': return 'C'
    return None
def target(kind, sent_text='', override=None):
    if override is not None: return override
    if kind in ('S', 'E', 'Q') and any(p in sent_text for p in REVEAL_PATTERNS): return REVEAL
    return {'C': CLAUSE, 'K': COLON, 'S': SENT, 'Q': QUEST, 'E': EXCL}[kind]
def jitter(seed, x):
    h = (seed * 2654435761) & 0xffffffff; h ^= h >> 15; h = (h * 2246822519) & 0xffffffff; h ^= h >> 13; u = (h & 0xffff) / 65535.0
    return x * (1 + (u * 2 - 1) * LAST_JITTER)
def gap_for(sentences_B, override=None):
    """silence between two takes (breath groups), from the last sentence's end mark"""
    last = sentences_B[-1].strip(); k = mark_kind(last) or 'S'
    return target(k, last, override)
