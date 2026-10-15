# Research — next LinkedIn GIF topic (Oct 8, 2026)

## Recommended: MCP goes stateless (spec 2026-07-28) — "the protocol stopped remembering you"
**Why this one:** architecture-shaped (sessions, load balancers, gateways), directly useful to builders and platform leads, not covered by our earlier agent GIFs (GraphRAG, treadmill, security controls, front door), and rich in diagram-able mechanisms (handshake removed, per-request context, headers for routing, handle pattern, multi-round-trip retry).
**Freshness caveat:** the spec shipped Jul 28, 2026 (RC May 21). Not breaking news; the hook is "what it means now that SDKs ship it and teams must migrate" and the 12-month deprecation clocks. Pair with the Personal Agent Protocol story? No — different post.

### Fact table
**A — official sources (MCP blog post "The 2026-07-28 Specification", changelog, SDK-betas post)**
- Dates: roadmap Mar 9 2026 → release candidate May 21 → **final Jul 28, 2026**.
- Headline: *"MCP is transforming from a bidirectional stateful protocol into a request/response stateless protocol."* Motivation: *"one of the most highly-requested features from developers who were eager to get better reliability and scalability for their MCP servers."*
- Protocol-level **sessions and the `Mcp-Session-Id` header are removed** from Streamable HTTP; the `initialize` handshake is dropped. Each request carries its own protocol version and client info (`_meta`). Beta-SDK notes: servers can run behind a **plain round-robin load balancer, no sticky sessions or shared session store**.
- **Stateful apps still possible:** *"mint an explicit handle from a tool and have the model pass it back as an argument… works better than session state hidden in the transport."*
- **Multi Round-Trip Requests (SEP-2322):** instead of holding bidirectional streams open, a tool returns `resultType: "input_required"`; the client retries with `inputResponses`. Replaces server-initiated sampling / elicitation / roots requests.
- **Routing headers:** `Mcp-Method` and `Mcp-Name` required on Streamable HTTP, so gateways, rate limiters and WAFs can *"route and meter on those headers instead of parsing JSON bodies."*
- **Extensions framework:** Tasks moved out of the experimental core into the `io.modelcontextprotocol/tasks` extension; others: MCP Apps, Enterprise Managed Authorization (EMA).
- **Auth hardening:** servers should return `iss` (RFC 9207) and clients must validate it; client credentials bound to the issuer that minted them; Dynamic Client Registration formally deprecated in favour of CIMD (to be removed in a future version).
- **Deprecations:** Roots, Sampling, Logging deprecated but *"keep working for at least twelve months"*; legacy HTTP+SSE transport deprecated with a year-long off-ramp.
- **Adoption:** Tier-1 SDKs ≈ **half a billion downloads a month**; TypeScript and Python SDKs each past **1 billion total downloads**. TypeScript, Python, Go, C# support 2026-07-28; Rust in beta.
**B — secondary (ppc.land, community GitHub issues; label as such)**
- Serving the new revision is an explicit opt-in in the TypeScript and Go SDKs, while Python v2 answers both revisions from one endpoint.
- Downstream projects (e.g. Microsoft's MCP gateway and agent-framework repos) have open issues to adopt the revision. Do not claim they've shipped.
**C — do NOT say:** that all servers migrate automatically; that sessions "disappear" for apps (state moves to explicit handles); any adoption % of servers on the new spec (no data found); an October release (none exists).

### GIF angle ideas (to be approved)
1. **Sorting hub** — letters (requests) each carrying a full return label roll down a conveyor to any of N identical workers; the old "operator who remembers every caller" corner is dark and unplugged. Cloakroom tickets = handles; red "input_required" parcels bounce back and return with answers.
2. **Lighthouse fleet** — identical lighthouses; ships (requests) carry their own charts; no keeper ledger.
3. **Switchboard → postcards** — old plug-board with tangled cords fading into a grid of postcards.

## Runner-up: Oracle Fusion Claw (announced Sep 29, 2026) — governed autonomy inside the ERP
- Oracle announced **Fusion Claw**, a governed execution runtime for Fusion Agentic Applications; **25 new Claw-powered apps**, portfolio now **75**; finance, HR, supply chain, sales.
- Governance trio: **Enterprise Operating Envelope** (policies, permissions, risk thresholds, decision rights, escalation boundaries) → **Outcome Trust Harness** (applies it to each run: identity, capabilities, data, actions) → **Outcome Receipt** (authority applied, evidence used, decisions, transactions, result).
- Reasoning by frontier models (Gemini and OpenAI named), **deterministic computation** for execution steps; automation level configurable from assistance to governed full-auto. Apps available in Q4, priced via AI-unit consumption; pricing impact unverified.
- Analysts: Mark Vigoroso (The Enterprise Edge) called it "a milestone"; Keith Kirkpatrick (Futurum) "an evolutionary step… some ways away" from end-to-end automation; *"It comes down to whether the organization understands what the limits need to be."* Everything performance-related is Oracle's claim, untested.
- Fresher (9 days) and more leader-oriented; weaker diagram story than MCP, but "receipt for every agent run" is a strong visual.

## Other items seen this week (not recommended)
- Deloitte/IBM/Kyndryl/"88% of agents fail" figures: only secondhand/vendor summaries; do not use without primary reports. Gartner ">40% of agentic projects cancelled by 2027" also cited secondhand.
- SAP buying TechWolf ("context graph for work"), Microsoft Copilot Studio "Hooks", Manus orchestration rebuild: single-source news-brief items.

## Sources
- MCP blog: https://blog.modelcontextprotocol.io/posts/2026-07-28/ · changelog: https://modelcontextprotocol.io/specification/2026-07-28/changelog · SDK betas: https://blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/
- ppc.land analysis: https://ppc.land/mcp-forces-ad-tech-to-rebuild-agent-servers-as-sessions-disappear/
- Oracle announcement (Sep 29, 2026) via ERP Today https://erp.today/fusion-claw-oracles-new-runtime-for-autonomous-governed-enterprise-work/ and TechTarget https://www.techtarget.com/it-strategy/news/366651382/Oracle-Fusion-Claw-the-new-grab-for-fully-autonomous-agentic-AI-in-ERP
- Week roundup: https://aiagentsdirectory.com/news/ai-agents-news-brief-october-6-2026
