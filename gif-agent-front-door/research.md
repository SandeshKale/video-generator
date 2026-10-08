# LinkedIn GIF post — "The front door for AI agents" (Personal Agent Protocol) — research, 2026-10-08

## Why this topic (LinkedIn fit)
- **Fresh:** announced Oct 6, 2026 (Sierra + Meta); coverage Oct 6–7 (Techzine, Forkast, CMSWire, CNBC quotes).
- **Architecture-shaped:** it is about *interfaces and trust boundaries* (auth, channels, permission tiers) — exactly the diagram-able, builder/leader topic the LinkedIn register wants.
- **Open question with stakes:** protocol fragmentation (PAP vs UCP vs ACP vs TAP), missing governance, key players absent.
- Differs from our recent agent stories (security controls GIF, StarCraft, swarm, rich-upsell): this one is about **how agents get invited in**, not how they misbehave.

## Fact table
**A — multiple outlets agree**
- Announced **Oct 6, 2026** by **Sierra and Meta** as an *open standard* for how **personal AI agents authenticate with and interact with businesses**. Built on **OAuth**.
- **Spec not published yet** — **v0.1 due "later this month"** (October) with design workshops and a reference implementation.
- Named partners: **Genesys, Instinct, Rocket, Shopify, Stripe, Walmart** (Meta's list names NiCE and Decagon instead of Instinct). Partner-specific roles not detailed (Stripe: helping businesses recognise customers' agents).
- **Session model:** consumer chooses what access an agent gets; company decides what the agent may do. **Guest** (read public info, e.g. inventory/return policy) vs **signed-in** with **read-only or write** access; sessions persist across channels.
- **Three ways in — the business chooses:** (1) its **website**, (2) **APIs** on standards like **MCP / OpenAPI**, (3) its **own agent** for tasks needing conversation.
- Roadmap/extensions (not v0.1): **payments, push notifications, finer-grained permissions.**
- **Absent from the coalition:** OpenAI, Anthropic, Amazon, Google (per Beri.net; Forkast: Amazon, OpenAI, Anthropic).
- Quotes: **Bret Taylor** (Sierra), to CNBC: *"It is kind of chaos until such a standard exists."* **David Singleton** (Meta Superintelligence Labs), to CNBC: *"We're defining rails that we hope personal agents and business agents can run over for the future."* **Tony Bates** (Genesys CEO): personal AI is *"a new front door to the enterprise."*
**B — single-source (Beri.net analysis; label as "one analyst")**
- Comparison with existing efforts: **UCP** (Google/Shopify, Jan 11 2026; discovery→checkout; council later adds Amazon, Meta, Microsoft, Salesforce, Stripe), **ACP** (OpenAI/Stripe, Sept 29 2025; in-agent checkout with scoped payment token), **TAP** (Visa/Cloudflare, Oct 14 2025; signed agent identity via HTTP Message Signatures).
- At launch **no spec, licence or governing body** published; critic's test for Jan 2027: a non-Meta agent completing authorised transactions with non-Sierra businesses, no sponsor-controlled registry/allowlist.
- Suggested four permission tiers for retailers/banks: guest-read → signed-in read → signed-in write (reversible) → signed-in write (irreversible, human step-up).
- Context: Meta's Muse agent (released Sept 8) was blocked by Amazon on Sept 20 (Amazon cited no notice, no self-identification, possible credential capture; Meta says Muse can't see passwords/payment methods — unverified).
**C — unverified / do not state as fact:** adoption numbers, partner roles, timing beyond "later in October", that OpenAI/Anthropic will join (Taylor reportedly *expects* it; paraphrase only).

## Do NOT say
- "PAP is live / ratified / the standard" — it has **no published spec** yet.
- That any partner "built" or "shipped" support; that payments work (not in v0.1).
- That Amazon/OpenAI/Anthropic/Google "rejected" it — they simply aren't named partners.
- Anything about security guarantees: permission enforcement and governance are unspecified.

## Sources
- Techzine, "Personal agent protocol introduced" (Oct 7) — https://www.techzine.eu/news/applications/144823/personal-agent-protocol-introduced-visibility-into-what-ai-agents-do/
- Forkast, "Sierra and Meta's Personal Agent Protocol Gives Commerce a Common Front Door" — https://forkast.news/sierra-and-metas-personal-agent-protocol-gives-commerce-a-common-front-door-for-those-willing-to-open-it/
- Beri.net analysis (UCP/ACP/TAP comparison) — https://www.beri.net/article/meta-sierra-personal-agent-protocol-oauth-guest-read-write-access-vs-ucp-acp-trusted-agent-protocol-retail-banks
- CMSWire (Genesys, NiCE join), TimesOfAI, MLQ, PANews coverage; CNBC quotes as relayed by Forkast.

## GIF concept (proposal — needs approval before building)
Rules honoured: **vertical** (last GIF was horizontal) 4:5, **new style + palette**, leads with a **visual metaphor** (not a text slide), professional/architecture register, legible (≥22 px at 1080 wide), uses the space, ≤5 numbered items, seamless 8 s loop, populated from frame 0.
- **Metaphor:** an architectural *elevation drawing* of a building facade — "the front door to the enterprise".
- **Style:** warm drafting-paper cream, charcoal linework, one copper/terracotta accent + a muted teal for "allowed" — (previous GIFs: forest-green dark; pop-art yellow/blue/pink; light indigo isometric).
- **Elements (numbered 1–5):** ① a **keycard reader** at the door (OAuth session) · ② **three entrances** side by side — WEBSITE (the regular door), API (MCP · OpenAPI, a service hatch), BUSINESS AGENT (a reception desk) · ③ agent figures arriving with **keycards in three colours** = GUEST (read public info) / SIGNED-IN READ / SIGNED-IN WRITE · ④ a gate that stays **closed to "payments · push · fine-grained permissions — not in v0.1"** · ⑤ a signboard **"SPEC v0.1: later in October"** plus a mini row of neighbouring "doors" labelled UCP · ACP · TAP (existing protocols) — one lit door per loop beat.
- **Motion:** agents walk in, tap the reader, door state changes (guest only opens the lobby; read opens counter; write opens back office), numbered markers pulse in order; loop resets with the card colours cycling.
