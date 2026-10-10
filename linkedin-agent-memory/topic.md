# LinkedIn architecture post — topic pick (Oct 10, 2026)

**Pick: "Agent memory is not RAG" — the retain / recall / reflect architecture (Hindsight, vectorize-io).**
Verified on the repo page (fetched Oct 10): MIT, ~47.7k stars, 6.0k forks, 3,569 commits; hit GitHub Trending ~Sept 25.
- Memory banks: isolated per user/agent/project, no cross-bank leakage.
- Memory types: world facts, experiences, observations (consolidated, evidence-backed beliefs), mental models (synthesised standing answers).
- Retain: an LLM extracts facts, temporal data, entities, relationships. Recall: 4 strategies in parallel (semantic, BM25, graph, temporal) → reciprocal rank fusion → cross-encoder rerank → token-trimmed. Reflect: deeper analysis forming new connections.
- Claims SOTA on LongMemEval (Jan 2026), reproduced by Virginia Tech's Sanghani Center and The Washington Post (arXiv 2512.12818). Built-in MCP endpoint `/mcp/{bank_id}/`; 25+ LLM providers.
Caveat: I could not verify "viral on LinkedIn" (no feed access); signal = GitHub trending + dev-writing on agent memory/orchestration layers.

Runner-ups: (2) MCP vs A2A as layers + registry/governance layer (well covered by past GIFs on MCP/security); (3) cost-tiered model routing (frontier for orchestration, mid for tasks, small for high-frequency).
Visual angle (must differ from previous GIFs): horizontal, new palette, layered "recall funnel" with 4 parallel retrievers fusing into one ranked list.
