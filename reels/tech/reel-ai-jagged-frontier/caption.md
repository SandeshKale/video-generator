Last week an AI model scored gold at the International Math Olympiad.

The same class of model — same architecture, same training approach, sometimes the literal same weights — will still confidently tell you 9.11 is bigger than 9.9, or that "strawberry" has two r's.

This isn't a bug that gets patched away next release. It's called "jagged intelligence," and it's one of the most important things to understand if you use AI for anything that matters.

Here's why it happens: these models don't read letter-by-letter the way we do. They read in tokens — chunks of text, closer to word-shapes than spelled-out words. "Strawberry" isn't seven letters to a model, it's two or three token-chunks. Ask it to count letters and you're asking it to reverse-engineer information it was never actually looking at. Same root cause behind the 9.11 vs 9.9 stumble — digit-by-digit comparison gets tangled with version-number-style pattern matching from training data.

The actual danger isn't the mistake itself. It's that the mistake is delivered with exactly the same fluent, confident tone as the correct answer. There's no stutter, no hedge, no visible drop in certainty when the model goes from "solved an Olympiad problem" to "got basic arithmetic wrong." Two-thirds of people take an AI's confident-sounding answer at face value without double-checking — and jagged intelligence is exactly why that's risky.

So here's the actual takeaway: trust the peaks, verify the valleys. Use AI as a genuinely brilliant, occasionally-unreliable collaborator — not an oracle. The smartest way to work with these tools isn't blind trust or blanket skepticism. It's knowing where the jagged edges are.

Follow for more AI news that actually changes how you build. 🔻

Sources & further reading in the comments.
