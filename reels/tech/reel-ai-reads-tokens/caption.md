# "AI can't read." — Instagram caption pack

## Caption (recommended)
ChatGPT has never read a single word you've typed. Not one. 🤯

To AI, my name isn't "Sandesh". It's **Sand + esh**: two pieces, called tokens. Every chatbot chops your text into tokens and turns each one into a number. It never sees your words, and it never sees your letters.

That one fact explains a lot:
🍓 **The strawberry fail.** In a sentence, "strawberry" is ONE token. That's why AI famously miscounted its R's: it never saw the letters.
❤️ **"I love you" costs more in Hindi.** 3 tokens in English, 6 in Hindi with today's tokenizer, 24 with an older one. AI is priced in tokens and remembers in tokens, so some languages use up more of both.
✍️ **It writes one token at a time,** picking a likely next piece. Just autocomplete? Not quite. When Anthropic looked inside a Claude model, it had already picked the rhyming word before writing the line.

Try it: search "OpenAI tokenizer", type your name, and comment how many pieces you are. I'm two. 👇

Save this for the next time someone says "AI read my message". Follow for more AI, simply explained.

## Caption (short)
To AI, my name is Sand + esh. 🤯 ChatGPT never reads your words; it reads tokens. "Strawberry" = 1 token (that's the R's fail), "I love you" = 3 tokens in English vs 6 in Hindi, and it writes one token at a time while planning ahead. Type your name into OpenAI's free tokenizer and comment your number. I'm 2. Save + follow.

## Hashtags (28)
#AIexplained #ChatGPT #HowAIWorks #Tokens #Tokenizer #LLM #LargeLanguageModels #GenerativeAI #ArtificialIntelligence #MachineLearning #AIforEveryone #TechExplained #LearnAI #AITips #OpenAI #Claude #Anthropic #PromptEngineering #NLP #Hindi #IndianTech #TechIndia #TechReels #ScienceReels #DidYouKnow #MindBlown #Strawberry #sandeshexplains

## First comment (sources and notes)
📌 How the numbers were measured:
- I counted them myself with OpenAI's open-source tokenizer library (tiktoken, 11 Oct 2026), on o200k_base (GPT-4o family / gpt-oss) and cl100k_base (GPT-4 era). Newer, unpublished tokenizers may split differently.
- "Sandesh" → Sand + esh. " strawberry" in a sentence → 1 token (#101830). "I love you" → 3. "मैं तुमसे प्यार करता हूँ" → 6 (o200k) / 24 (cl100k).
- Rule of thumb from OpenAI's help centre: 1 token ≈ 4 characters of English ≈ ¾ of a word.

📌 Sources:
- **Strawberry:** TechCrunch, "Why AI can't spell 'strawberry'", 27 Aug 2024.
- **Languages:** Petrov et al., "Language Model Tokenizers Introduce Unfairness Between Languages", NeurIPS 2023. The same text can take up to 15× more tokens in some languages.
- **Plans ahead:** Anthropic, "Tracing the thoughts of a large language model", 27 Mar 2025. Claude 3.5 Haiku had picked "rabbit" before writing the second line of a couplet. Their method sees only a fraction of the model's computation.

ℹ️ **Disclosures:**
- The host is my AI avatar, voiced from a script I wrote.
- The type-case image is AI-generated; the typewriter and keyboard photos are real (Unsplash).
- The probability bars are an illustration, not real model odds.
- The script was drafted with help from Claude, the model in the "plans ahead" research.

## Upload notes
- Turn on Instagram's **AI info** label (AI avatar host + one AI-generated image).
- Cover: `cover.png` (grid-first 3:4 crop).
