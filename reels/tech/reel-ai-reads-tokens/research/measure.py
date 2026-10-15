# First-hand token counts used in the reel (run: python3 research/measure.py). tiktoken 0.14.0, 11 Oct 2026.
import tiktoken
EN = "Artificial intelligence does not read words. It reads tokens, small pieces of text."
HI = "कृत्रिम बुद्धिमत्ता शब्द नहीं पढ़ती। यह टोकन पढ़ती है, यानी टेक्स्ट के छोटे टुकड़े।"
for name in ["o200k_base", "cl100k_base"]:
    enc = tiktoken.get_encoding(name)
    print(f"== {name}")
    for s in ["Sandesh", "strawberry", " strawberry", "How many r's in strawberry?", "ChatGPT", "unbelievable", "I love you", "मैं तुमसे प्यार करता हूँ"]:
        ids = enc.encode(s)
        print(f"{s!r:34} {len(ids):3}  {[enc.decode([i]) for i in ids]}  ids={ids}")
    print(f"EN sentence {len(enc.encode(EN))} tokens | HI sentence {len(enc.encode(HI))} tokens")
