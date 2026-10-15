# LinkedIn GIF post — "The agent writes its own orchestration code" (Claude Managed Agents: dynamic workflows) — research, 2026-10-11

## Why this topic (LinkedIn fit)
- **Fresh:** public beta on **Oct 9, 2026** (Claude Platform release notes). It moved from a Claude Code research preview (June) to a managed background service. Coverage Oct 9–10: AlphaSignal, Digg, Kingy AI, FourWeekMBA and others.
- **The architecture idea is new and drawable:** the orchestrator isn't a fixed graph you design. **The agent writes a program** that:
  - fans out many agents in parallel;
  - passes their results from phase to phase;
  - repeats a step until a review passes;
  - handles failures;
  - hands one combined result back.
  It is "map → reduce → verify" written by the model, on demand.
- **Hard, primary numbers** (Anthropic docs), plus one striking Anthropic-reported benchmark: **66 of 70 planted bugs found in each of 3 runs, vs 14–27 for a single agent.**
- **Not a repeat of `gif-agent-coworkers`:** that one was *governance* (identity, gateway, policy, audit). This one is *execution*: code-as-orchestration, fan-out concurrency, phases, a review loop, and an event stream. The shared overlap (budget pause) is a footnote here, not the hero.
- **Disclosure:** the topic is Anthropic's product, and the copy is drafted with Claude. Say so in the first comment, as with the tokens reel.

## Fact table
**A — Anthropic primary docs/release notes, read today**
- Oct 9, 2026 release note: "For work with many pieces, such as reviewing hundreds of documents, the agent can write a workflow. A workflow is a program that runs many agents in phases and combines their results. The server runs it in the background as a workflow run."
- Enabled per agent:
  - `"multiagent": {"type": "multiagent_20261001", "workflows": {"type": "enabled"}}`;
  - beta header `managed-agents-2026-04-01`.
  - You guide *when* it starts a run through the system prompt.
- **What the program can do** (docs, "How dynamic workflows work"):
  - run agents at the same time ("fanning out");
  - pass one agent's result to another;
  - take the next step itself, since results go to the program, not to the session's agent;
  - repeat and choose ("have a draft revised until a review passes or a set number of rounds is used up");
  - handle a failed agent.
- **Layers:**
  - **workflow run** → named **phases** (e.g. "Read the contracts", "Reconcile the findings") → **agent threads**, each in its own session thread on a prompt the program wrote.
  - Agents are inline (defined by the program) or predefined (`workflows.predefined_agents`).
  - **All threads share the session's sandbox files** (including a mounted memory store).
- **Events** on the session stream:
  - `workflow_run.created` (with the phase list);
  - `workflow_run.status_running` / `workflow_run.status_idle`;
  - `workflow_run.phase_started` / `workflow_run.phase_ended`;
  - `session.thread_created` (carries `workflow_run_id`);
  - `workflow_run.status_ended` (`result`: `completed` | `stopped` | `error`);
  - `workflow_run.error`.
- **Limits:**
  - **64 threads working at once** in one run (not guaranteed);
  - **1,000 agents** started over a run's life (`thread_limit_error` beyond);
  - run lifetime **24 h** by default;
  - **10 open runs** per session by default.
- **Budget:** a run's tokens count toward the session's budget. At the budget **every open run pauses** (idle), and raising or removing the budget resumes them. When a run ends, the session's agent gets a turn to read what it did.
- "`completed` … doesn't say whether the work passed": the docs tell you to read the threads to find failed work.

**A/B — Anthropic-reported benchmark, via ≥2 outlets** (AlphaSignal, Digg; citing the ClaudeDevs announcement)
- Synthetic test: **70 bugs planted in a 116,000-line codebase**, 3 runs each.
- **Workflow: 66, 66, 66 (94.3%). Single agent: 14, 15, 27 (20–38.6%).**
- On screen it must say "Anthropic's synthetic test".
- The coverage's own caveats: higher token use and runtime; no cost-matched comparison; doesn't establish results on every codebase.

**B — single outlet; avoid or label**
- "$0.08 per session-hour": one outlet only, not on the pricing page I read. **Don't use.**
- The research preview's "~16 concurrent subagents locally" (AlphaSignal) could be used as "preview: local; beta: managed". Skip the number.

**C — do not say**
- "1,000 agents run at once" (it's 64 at once, 1,000 over the run's life).
- That a `completed` run means the work passed.
- Any cost-per-run figure.

## Sources
- Claude Platform release notes (Oct 9, 2026): https://platform.claude.com/docs/en/release-notes/overview
- Docs, Workflow runs: https://platform.claude.com/docs/en/managed-agents/workflow-runs
- Docs, Multiagent orchestration: https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration
- AlphaSignal, "Anthropic's Claude Now Orchestrates 1,000 Agents, Finding 66 of 70 Bugs" (Oct 9): https://alphasignal.ai/news/anthropic-s-claude-now-orchestrates-1-000-agents-finding-66-of-70-bugs
- Digg summary of the benchmark: https://digg.com/ai/tk1yhm34

## Alternatives considered
- **Anthropic's anti-exfiltration rules (Oct 7):**
  - `web_fetch` only opens URLs that already appeared in the session;
  - `allowed_hosts` now also gates search and fetch.
  A sharp, niche security story, but too narrow for a full GIF. It could be one panel of a later security GIF.
- **Dell AI Data Platform semantic layer (week of Oct 9):** a vendor product update with thin detail.
- **Durable execution for agents (LangGraph checkpoints vs Temporal/DBOS):** evergreen, no news peg.

## How this GIF tops `gif-agent-coworkers` (the benchmark)
| Coworkers GIF had | This one adds |
|---|---|
| ~12 request dots, 3 sub-agents | **64 live agent cells** fanning out in phase 1 (each fills, finishes and frees a slot as the queue refills), a **"working now 64/64"** gauge and an **"agents started N/1,000"** counter |
| fixed diagram | **code that becomes the diagram**: the lead agent types the workflow program and each `phase(...)` line lights the stage it creates |
| one-way flow | a **review loop**: phase 2's draft is rejected once, revised and passes (the "repeat until a review passes" rule), with a round counter |
| audit tape | a **live event stream** with the real event names (`workflow_run.created`, `phase_started`…) |
| one stat (cap %) | a **data payoff**: bug counters climb, the workflow lane to 66/70 and the single-agent lane to 27/70 (best of 3), labelled "Anthropic's synthetic test" |

Rules honoured:
- **Horizontal 1600×900.**
- A **new dark palette** and new type.
- ≤5 numbered items.
- Legible at the final scale (≥18 px at 1600 wide).
- Every motion is a real step of the system.
- A seamless ~10 s loop.

**Palette (new, dark):**
- espresso `#15100d` background, with a fine dot grid;
- cream text `#f3e6d3`;
- **ember** `#ff7a3d` (the program and the lead agent);
- **cobalt** `#5b8cff` (agent threads);
- **jade** `#2ed3a0` (passed / found);
- **magenta** `#ff4fa3` (review rejected);
- **gold** `#ffc845` (budget, counters).

**Type:** **Outfit 800** headlines, **DM Mono** code and labels, Inter body. Neither has been used in a GIF before.

## Concept proposals (need approval before building)
### A. "The agent writes the score" (recommended)
Orchestration as an orchestra, drawn as a clean architecture diagram.
- **Left: Lead agent and program.** The lead agent types a short program:
  ```
  phase("Read the files")
  fanOut(files, reviewer)
  phase("Reconcile")
  reviseUntil(review.pass)
  ```
  As each line types, the stage it creates lights up on the right.
- **Phase 1 (fan-out).**
  - A grid of 64 agent cells; work items stream in from a queue of 116k lines split into chunks.
  - Cells fill, finish (a jade tick or a found-bug dot) and free their slot as the queue refills.
  - A concurrency gauge shows 64/64, and a "started" counter climbs toward 1,000.
- **Phase 2 (reconcile + review loop).**
  - Results funnel into one reconcile agent, then a reviewer.
  - Round 1 is rejected (magenta ✗) and loops back; round 2 passes (jade ✓).
- **Shared sandbox files:** a band under both phases that every thread reads and writes, with small file glyphs flickering.
- **Right: event stream.** Real event names print as they happen.
- **Bottom: payoff bars.** "Bugs found (Anthropic's synthetic test, 70 planted)": the workflow climbs to 66, a single agent to 27 (best of three runs).
- **Numbered items:**
  1. the agent writes the program;
  2. fan-out, 64 at once;
  3. phases pass results on;
  4. review loop;
  5. one result back, plus the budget pausing every run as a footnote.

### B. "Assembly line"
- The program prints a factory floor: phase stations on a conveyor.
- Work packets split into 64 lanes, merge at a reconcile station, and loop at a QA gate.
- Clear, but a common metaphor and less striking than A.

### C. "Mission control"
- The program is a flight plan; agents are drones launched in waves.
- More cinematic, but drones read as decoration rather than threads.
