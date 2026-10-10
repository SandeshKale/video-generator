# LinkedIn copy: "Agent memory is not RAG" (horizontal GIF, retain / recall / reflect)

## Post (recommended)

Your AI agent doesn't forget because the model is weak. It forgets because "memory" is often just a vector database with a nice name.

Real agent memory is three verbs, not one lookup (follow the numbers in the GIF):

1. Retain. An LLM reads the conversation and extracts facts, entities and timings ("allergic to peanuts", "moved to Pune", "March") instead of dumping raw chat into an index.
2. Memory bank. Each user, agent or project gets an isolated bank: world facts, experiences, observations (beliefs with evidence) and mental models (standing answers).
3. Recall. Four retrievers run in parallel: semantic, keyword (BM25), graph and temporal. Their ranked lists are merged with reciprocal rank fusion, reranked by a cross-encoder and trimmed to a token budget. Items several retrievers agree on rise to the top.
4. One ranked context goes into the prompt, so the model answers with what it actually knows about this user.
5. Reflect. In the background, new facts rewrite the higher-level mental models, so the agent's standing answers keep improving.

This is the pattern the open-source Hindsight project (Vectorize, MIT licence, ~47.7k GitHub stars as of Oct 10, 2026) implements. It is one implementation of the idea, not the only one.

Takeaway: stop asking "which vector DB?" and start asking "what does my agent retain, how does it recall, and what does it learn?"

What does your agent's memory layer look like today? 👇

#AIAgents #AgentMemory #RAG #LLM #SoftwareArchitecture #MCP #GenerativeAI #OpenSource

## Shorter version

Agent memory is not RAG.

RAG fetches text. A memory layer extracts facts, files them in isolated banks, recalls with four retrievers in parallel (semantic, keyword, graph, temporal), fuses and reranks the results into one context, and keeps rewriting its own mental models in the background.

What does your agent retain, recall and learn?

#AIAgents #AgentMemory #RAG #LLM #SoftwareArchitecture

## First comment (sources)

Project shown: Hindsight by Vectorize, github.com/vectorize-io/hindsight (MIT licence; ~47.7k stars, 6.0k forks as of Oct 10, 2026). Paper: arXiv 2512.12818. Retain / recall / reflect, the four memory types (world facts, experiences, observations, mental models) and the four parallel retrieval strategies with reciprocal rank fusion and cross-encoder reranking are as described on the project's README. The project reports state-of-the-art results on LongMemEval as of January 2026; that is the project's own claim, so check the paper for the exact numbers. The diagram is my simplified illustration of the pattern, not the project's official architecture, and the chat example (Pune, peanut allergy) is made up.

## Alt text
Architecture diagram titled "Agent memory is not RAG". On the left, a chat message ("I moved to Pune in March and I'm allergic to peanuts") goes into an LLM extractor that produces fact, entity and time tags. These are filed into a memory bank with four drawers: world facts, experiences, observations and mental models. In the centre, four retrievers (semantic, keyword, graph, temporal) search in parallel, and a fusion and rerank panel merges their ranked lists. On the right, one ranked context list (peanut allergy, lives in Pune, moved in March, likes vegetarian) is trimmed to a token budget and sent to the model as prompt context. A dashed loop labelled reflect feeds new facts back to rewrite the mental models. A banner at the bottom reads "Agent memory is not RAG".
