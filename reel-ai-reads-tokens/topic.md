# Topic — "AI can't read." (what a chatbot actually sees when you type) — research log, 11 Oct 2026

**Brief from the creator:** universal, not news; a hack, a simplification, something extremely useful, teachable or mind-blowing; wild and creative; viral and relatable.

## Why this topic
Everyone types to ChatGPT, Gemini or Claude every day, and almost nobody knows the one fact underneath it all: **the model never sees your words or letters. It sees tokens**, chunks of text turned into numbers. That one idea explains a stack of things people have noticed but never understood:
- the famous "how many R's in strawberry" failure;
- why your name gets chopped up;
- why Hindi "costs" more;
- why chats "forget";
- why it writes word by word.

The reel then adds a genuinely mind-blowing twist from interpretability research: **it plans ahead** (it picks the rhyme before writing the line).
- **Hack / viral mechanic:** "Type your name into OpenAI's free tokenizer and comment how many pieces you are. I'm two." People do it, compare, and comment. The host's own name is the hook: **"Hi, I'm Sand… esh."**
- **Relatable, India-first:** "I love you" is 3 tokens in English, 6 in Hindi on today's tokenizer, and was 24 on the older one.
- **Evergreen:** works any week, and the numbers are re-measurable by anyone.

Shortlisted and set aside:
- the clone/safe-word reel (evergreen but not "wow");
- the Anthropic workaround report (news, not universal);
- ChatGPT forging cartoonists' signatures (niche);
- macOS 27's Apple Intelligence removal tool (the tool is unvetted).

## Facts (tier A = primary source, own measurement, or ≥ 2 independent outlets; C = do not say)
| # | Claim as said / shown | Tier | Source |
|---|---|---|---|
| 1 | "Sandesh" → **Sand · esh** (2 tokens) | **A (own measurement)** | `research/measure.py`, tiktoken 0.14.0, `o200k_base` (the GPT-4o-family / gpt-oss tokenizer) and `cl100k_base` (GPT-4 / GPT-3.5 era) both split it the same way |
| 2 | In a sentence, " strawberry" is **one** token; on its own, "strawberry" is st · raw · berry | **A (own)** | same script ("How many r's in strawberry?" = 7 tokens, strawberry is one of them) |
| 3 | AI famously miscounted the R's in "strawberry" because it sees tokens, not letters | **A** | TechCrunch, "Why AI can't spell 'strawberry'" (27 Aug 2024), quoting University of Alberta and Northeastern researchers; widely repeated. Said in the past tense ("famously miscounted"); we don't claim today's models still fail. |
| 4 | "I love you" = **3** tokens; "मैं तुमसे प्यार करता हूँ" = **6** (o200k) / **24** (cl100k, older) | **A (own)** | same script |
| 5 | One test sentence: English **16** tokens vs Hindi **30** (o200k); **17 vs 91** on cl100k | **A (own)** | same script; on screen only |
| 6 | Rule of thumb: 1 token ≈ 4 characters of English; 100 tokens ≈ 75 words; counts vary by model | **A** | OpenAI Help Center, "What are tokens and how to count them" |
| 7 | The same text can need up to **15×** more tokens in some languages than others | **A** | Petrov et al., "Language Model Tokenizers Introduce Unfairness Between Languages", NeurIPS 2023 | on screen only, "up to 15× (some languages)" |
| 8 | AI is **priced in tokens** and its memory (context window) is **measured in tokens** | **A** | OpenAI and Anthropic pricing pages (per million tokens) and model docs (context window in tokens) |
| 9 | Models write one token at a time, each picked from a probability distribution over possible next tokens | **A** | standard; OpenAI docs (logprobs, temperature) |
| 10 | **Plans ahead:** Anthropic's interpretability team found Claude (3.5 Haiku) had already picked "rabbit" before writing the second line of a couplet ending in "grab it"; suppressing "rabbit" gave "habit", injecting "green" gave "green" | **A** | Anthropic, "Tracing the thoughts of a large language model" (27 Mar 2025, read today) + IBM Think, ByteByteGo |
| 11 | Caveat from the same paper: their method "only captures a fraction of the total computation" | **A** | same | on screen as a small footnote |
| 12 | OpenAI's tokenizer page is free to try | **A** | platform.openai.com/tokenizer (linked from the help article) |
| 13 | Exact next-token probabilities in our illustration | **C** | we have no model logits here; the probability bars are labelled **ILLUSTRATION**, with no numbers |
| 14 | "Hindi costs you 2× in ChatGPT" (app pricing) | **C** | subscriptions aren't billed per token; say only "AI is priced in tokens" (API) |
| 15 | "Spell it out letter by letter and it'll count right" | **C** | plausible and widely advised, but not verified here; not used |

**Disclosure:** fact #10 is Anthropic research about Claude, and this script was drafted with Claude. It's a published, widely covered result; the caption says so.
