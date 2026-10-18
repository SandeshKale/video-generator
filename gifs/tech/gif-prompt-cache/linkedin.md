# LinkedIn copy: "Don't break the cache." (horizontal GIF `prompt-cache.gif`, 1600×900, 12 s loop, 120 frames, 1.9 MB)

Post it as a native GIF upload. Only the first ~200 characters show before "see more", so the hook carries the post. Links go in the first comment, not the body.

## Post (recommended)

Your AI agent pays for the same 10,000-token prompt on every turn.
One timestamp in the wrong place is why it pays full price.

Every turn, an agent re-sends its tools, its system prompt and the whole conversation. Prompt caching lets the model provider reuse that prefix instead of re-processing it. But it only works if the prefix is byte-for-byte identical.

Think of it as a pre-cast tower (the GIF):
1. The prefix is built in order: tools → system prompt → messages.
2. If nothing below the new turn changed, the cached prefix is read at 0.1× the normal input price.
3. If something changed, that level and everything after it is re-written at 1.25×.
4. The classic mistake: "Current time: 18:04:07" at the top of the system prompt. It changes on every request, so nothing above the tools is ever reused.
5. The fix: static first, dynamic last. Put the time, user data and tool results at the end.

Is it worth the effort? A January 2026 study ran 500+ long agent sessions with 10,000-token system prompts across providers. Smart cache placement cut API cost by 41–80% and made the first token 13–31% faster. Caching the whole context naively was less consistent and could even add latency.

Prices and lifetimes differ by provider (Anthropic's cache lives 5 minutes and refreshes free on every hit; OpenAI keeps a prefix for about 30 minutes on newer models), but the rule is the same everywhere: the order of your prompt is part of your architecture.

What's the most "dynamic" thing hiding in your system prompt?

#AIEngineering #LLM #AIAgents #PromptEngineering #CloudCost #SoftwareArchitecture

## Shorter version

Your AI agent re-sends the same long prompt every turn. Prompt caching makes the repeat ~10× cheaper, unless one timestamp at the top of the system prompt breaks it.

The rule (see the GIF): static first, dynamic last.
1. Prefix order: tools → system → messages.
2. Unchanged prefix = read at 0.1×.
3. One changed byte = that level and everything after it re-written at 1.25×.

Measured on 500+ agent runs: cost −41% to −80%, first token 13–31% faster.

What's dynamic in your system prompt?

#AIEngineering #LLM #AIAgents #CloudCost

## Hashtags
#AIEngineering #LLM #AIAgents #PromptEngineering #CloudCost #SoftwareArchitecture

## First comment (sources, how to read the GIF, caveats)

Sources (read 18 Oct 2026):
• Anthropic, prompt caching docs: prefix order tools → system → messages; cache reads 0.1× base input (0.05× on Opus/Sonnet 5.5); 5-min writes 1.25×, 1-hour writes 2×; 5-min lifetime refreshed free on each use; "changes at each level invalidate that level and all subsequent levels". https://platform.claude.com/docs/en/build-with-claude/prompt-caching
• OpenAI, prompt caching guide: cached input up to 95% cheaper; on GPT-5.6+ reads 0.1×, writes 1.25×; prefixes reusable ~30 min after last use; "put stable developer instructions and shared reference material first". https://developers.openai.com/api/docs/guides/prompt-caching
• Lumer et al., "Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks", arXiv 2601.06007 (Jan 2026): −41% to −80% cost, 13–31% faster time to first token. https://arxiv.org/abs/2601.06007

How to read the GIF: each slab is one part of the prompt (bottom = sent first). Green = read from cache, red = miss, orange = re-written once, yellow = new this turn. The bars on the left are the cost of the prefix per turn (1× = normal input price).

Caveats: the tower and the bar heights are a schematic, not a measurement of a real bill. Exact multipliers, minimum prompt lengths and lifetimes differ by provider and model, so check your provider's current docs.

## Alt text (896 characters)

Animated architecture diagram titled "Don't break the cache." A crane builds a tower of prompt slabs: TOOLS and SYSTEM at the bottom, then one floor per conversation turn. When a turn lands and nothing below it changed, a green scan runs up the tower and every slab reads "READ 0.1×". Then a red brick with a timestamp, 18:04:07, is pushed into the SYSTEM slab. It cracks, every floor above turns red ("MISS") and is re-poured at "WRITE 1.25×", and a cost chart on the left shows a tall red bar. The crane lifts the timestamp out and places it on the newest floor. After one re-write, the tower turns green again. Side panels list five rules: prefix order tools, system, messages; hits cost 0.1×; misses re-write at 1.25×; one changed byte invalidates everything after it; static first, dynamic last. A dark box notes measured savings of 41 to 80 percent and 13 to 31 percent faster first tokens.
