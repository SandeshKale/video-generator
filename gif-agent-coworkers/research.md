# LinkedIn GIF post — "Your next hire is an agent: it gets a badge, a sandbox and a budget" (Google's Gemini agent) — research, 2026-10-11

## Why this topic (LinkedIn fit)
- **Fresh:** announced **Oct 8, 2026** at Gemini at Work 2026 (Thomas Kurian keynote). Coverage Oct 8–10: Google Cloud blog, Reworked, CIO.com/Computerworld, Constellation Research, AI Magazine.
- **Architecture-shaped:** the announcement is mostly *control-plane* design. One orchestrating agent spawns sub-agents, and every agent has an identity, a permission set, a sandbox, a gateway, an audit trail, a memory model and a budget. All of it can be drawn as a diagram, and builders and CIOs both care.
- **A real debate:** analyst Carmi Levy says Google wants to be "the gatekeeper of the new enterprise operating system", and asks whether CIOs and CISOs can trust it with mission-critical processes. Good comment bait without dunking on anyone.
- **Not a repeat:**
  - `gif-agent-security` was generic zero-trust layers.
  - `gif-agent-front-door` was external agents knocking on a company's door.
  - `gif-agent-memory` was one memory library.
  - This one is the *internal* lifecycle: an agent becomes a governed member of staff, with temporary helpers vs persistent coworkers, policy written once, and a spend cap.

## Fact table
**A — primary source (Google Cloud blog, Oct 8) + ≥1 independent outlet**
- **One agent, many surfaces.** It works as chat, as an autonomous worker and as a coding agent in one interface. It runs on web, mobile, desktop and the command line, inside Workspace, Microsoft 365 and Slack, and also headless.
- **Runs in the cloud.** "Work that takes hours or days keeps running after you close your laptop."
- **Model is a separate choice.** The agent "orchestrates across our Gemini family of models and Claude models from Anthropic today", with other models later. Users pick a model, or the agent picks one per job (Smart Routing sends simple tasks to cheaper models). Reworked: companies can switch models later without losing data or settings.
- **Sub-agents.** It "can dynamically create a roster of sub-agents — temporary, job-specific agents, each with their own identity", running parallel and sequential steps "for hours or days". Reworked: each sub-agent gets its own identity *for auditing*.
- **Coworker agents.** A persistent role across days and sessions. Each has its own `@agents.company.com` email, calendar, Drive and directory entry, and "only ha[s] access to the context that you or your team members provide". It appears under its own name in edit history.
- **Identity.** "Every agent gets its own identity, cryptographically attested and governed like an employee, with least-privilege permissions." The identity is stamped into its logs and into any VM spun up for it. External systems see it through OAuth ("signs in as itself", per Reworked).
- **Permissions.** Fine-grained, role-based, approved by the organisation's security admins.
- **Policy once.** "agents may not open documents classified Need to Know". It is written once and applied to every agent.
- **Sandbox + gateway.** Every agent runs in an **Agent Sandbox** with its own network boundary. "All traffic — in, out, and between agents — passes through **Agent Gateway**, an AI network firewall enforcing your organization's policies in real time."
- **Audit.** Every action goes to an audit trail "attributed to the agent rather than to a person"; it can be monitored in real time.
- **Four questions** every deployer should answer: *Who is the agent? What may it do? What did it do? What must it never touch?*
- **Four kinds of memory:**
  - **session** (the current task, even across days);
  - **semantic** (a knowledge base built from documents, people and other agents);
  - **procedural** (how jobs get done, including skills it writes for itself);
  - **episodic** (everything it has done before).
- **Tools and skills.**
  - Built-in connectors: Slack, Teams, Office, Workspace, Confluence, Git, Jira, Salesforce, ServiceNow, BigQuery, Databricks, Postgres, Snowflake, desktop files.
  - **Any MCP server**, inside or outside the network.
  - Shared **tools registry** and **skills registry**, plus personal skills.
- **Cost controls.** A **real-time spend cap** per project: when it's hit, that project's agent **pauses** until someone resumes it with one click. Spending is tracked per project for chargeback.
- **Availability.** Private preview for a limited set of customers, with no GA date. It will be included in Gemini Enterprise "at no additional charge". Financial services and legal versions are in preview.

**A — attributed analyst quotes (CIO.com, syndicating Computerworld; also in Reworked)**
- Carmi Levy: Google is trying to become "the gatekeeper of the new enterprise operating system, powered by whatever model makes the most sense." And: whether CIOs and CISOs "can rely on it for mission-critical business processes without a damaging failure is another story altogether."

**B — single-source; label or avoid**
- Ecosistema Startup: sub-agents write their results to a *shared state*. Only this outlet says it, so it's not used.
- Exact role of Agent Gateway beyond "AI network firewall" (e.g. prompt-injection filtering) comes only from low-quality sites. **Do not state it.**

**C — do not say**
- That it is generally available, or any price (none was given).
- That sub-agents share or inherit the parent's identity. Google says *each has its own*.
- That Claude runs "inside Google" in any specific way beyond "Claude models from Anthropic" being selectable.
- Any number of agents per company as a Gemini-agent figure. SOMPO's 10,000 agents and the CDAO's 100,000 were Gemini Enterprise custom agents, not this product.

## Sources
- Google Cloud blog, "Welcome to Gemini at Work 2026: Introducing the Gemini agent" (Oct 8, 2026): https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026
- Reworked, "Google debuts its all-purpose Gemini agent for work": https://www.reworked.co/collaboration-productivity/google-debuts-its-all-purpose-gemini-agent-for-work/
- CIO.com, "Google wants to be the gatekeeper for enterprise AI agents" (syndicated Computerworld; Carmi Levy quotes): https://cio.com/article/4232839/google-wants-to-be-the-gatekeeper-for-enterprise-ai-agents-2.html
- Constellation Research, "Google Cloud launches Gemini agent to work across enterprise systems": https://constellationr.com/insights/news/google-cloud-launches-gemini-agent-work-across-enterprise-systems

## Alternatives considered (not recommended now)
- **OpenAI DevDay: Agents API + Decisions API (Luna routing).** The architecture details are thin in coverage (InfoQ, Oct 2), and the "dots" internals are unreported.
- **MCP roadmap: server-initiated events + agent identity** (maintainers' roadmap, Aug 22). It's a roadmap, not shipped, and we just did MCP stateless.
- **Disaggregated inference (prefill/decode split, shared KV-cache tier; llm-d, Mooncake).** Evergreen and very diagrammable, but no news peg this week. Keep it for a quiet week.

## GIF concept — PROPOSALS (need approval before building)
Rules honoured:
- **Vertical 4:5, 1080×1350** (the last GIF, `gif-agent-memory`, was horizontal).
- **A new palette and new type** (none used in earlier GIFs).
- The professional, light **architecture-diagram register** the user approved for LinkedIn.
- It leads with a **visual metaphor**.
- **≤5 numbered items.**
- Legible at the final scale (≥22 px at 1080 wide).
- No dead corners, but not cluttered.
- **Dense continuous motion** (graphrag-level, ~20+ moving parts).
- A seamless ~8 s loop.

**Palette (new):**
- bone `#f6f3ec` background with a faint drafting grid;
- graphite ink `#1f2421`;
- **pine** `#2f6b4f` (identity/approved);
- **rosewood** `#b8325a` (policy/blocked);
- **saffron** `#f2a516` (budget/spend);
- **slate blue** `#5b7fa6` (traffic/tools).

**Type (new for GIFs):** **Space Grotesk 700** headlines, **IBM Plex Mono** labels, Inter body.

### A. "The org chart that grows itself" (recommended)
A live org chart drawn as a clean architecture diagram:
- At the top, one **Gemini agent** node with a small model switch (Gemini ⇄ Claude) that flips once per loop.
- **Sub-agents sprout** under it as dashed, temporary boxes, each with a tiny ID badge and a countdown ring. They finish and fold away (temporary).
- Beside them, two **coworker agents** sit as solid, permanent boxes with `@agents.company.com` badges, a calendar and a drive icon.
- **Every connector line routes through one Agent Gateway bar** that runs across the chart (traffic dots pass through it). Above the gateway hangs a single **policy ribbon**: "may not open: NEED TO KNOW". One dot hits it, turns rosewood and bounces off.
- Along the right edge, an **audit tape** prints a line for each action, signed by the agent's own badge ID, not a person's.
- Along the bottom, a **saffron budget bar** fills. When it hits the cap, the whole chart pauses for a beat ("PAUSED · resume") and then resumes, which closes the loop.
- Numbered items:
  1. one agent, model is a choice;
  2. sub-agents with their own identity;
  3. coworker agents;
  4. gateway + policy written once;
  5. audit trail + spend cap.

### B. "Badge office"
A security desk that issues agents' badges:
- An orchestrator "badge printer" stamps cryptographic ID cards onto sub-agents and coworkers.
- Each badge walks through a turnstile (Agent Gateway) into a glass sandbox room of tools (MCP, Jira, BigQuery…).
- One badge is refused at a "Need to Know" door.
- Every swipe prints an entry in a visitor log.

It's more illustrative and playful, but less of an architecture diagram.

### C. "Four drawers" (memory-led)
- A filing cabinet with four drawers: session, semantic, procedural and episodic memory.
- They open as the agent works, while sub-agents run errands around it.
- It leans on memory, which overlaps the `gif-agent-memory` GIF, so I don't recommend it.

### Post angle (draft hook)
"Google just gave AI agents an employee badge. Here's the architecture under it." The post walks through the 5 numbered items. It closes on Levy's question (can you trust it with mission-critical work?) and the four questions every deployer should answer.
