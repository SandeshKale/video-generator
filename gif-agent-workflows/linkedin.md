# LinkedIn copy: "This agent writes its own orchestration code" (horizontal GIF `agent-workflows.gif`, 1600×900, 12 s loop)

Post it as a native GIF upload. Only the first ~200 characters show before "see more", so the hook carries the post.

## Post (recommended)

The orchestrator isn't a diagram you draw anymore. The agent writes it.

On Oct 9, Anthropic put "dynamic workflows" for Claude Managed Agents into public beta. For a big job, the agent writes a small program, and the server runs that program in the background. Follow the numbers in the GIF:

1. The agent writes the workflow program itself, a new one for each task.
2. The program fans out: up to 64 agents working at once, and up to 1,000 over one run. Each one gets a prompt the program wrote, and its result goes back to the program, not to the chat.
3. Work moves in named phases, and results pass from one phase to the next. Every agent works with the same sandbox files.
4. It can repeat a step until a review passes, or until the rounds run out. It can also decide what to do when an agent fails.
5. One result comes back, and the lead agent gets a turn to read what the run did. You follow it all as events on the session stream.

The number that made me look: in Anthropic's own synthetic test (70 bugs planted in a 116,000-line codebase, three runs each), the workflow found 66 every time. A single agent found 14, 15 and 27.

Two honest caveats: it uses more tokens and takes longer, and there's no cost-matched comparison yet. A run that "completed" also doesn't mean the work passed. You still read the threads.

Where would you let an agent write its own fan-out: code review, contract review, research?

#AIAgents #AgenticAI #MultiAgentSystems #SoftwareArchitecture #Claude #Anthropic #LLM #GenerativeAI

## Shorter version

The agent now writes its own orchestration code.

Claude Managed Agents' dynamic workflows (public beta, Oct 9): the agent writes a program that fans out up to 64 agents at once (1,000 per run), passes results through phases, repeats until a review passes, and hands one result back. In Anthropic's synthetic test it found 66 of 70 planted bugs in each of three runs, vs 14 to 27 for a single agent. It costs more tokens, and there's no cost-matched comparison yet.

## Hashtags
#AIAgents #AgenticAI #MultiAgentSystems #SoftwareArchitecture #Claude #Anthropic #LLM #GenerativeAI

## First comment (sources and how to read the GIF)
📌 How to read the GIF (12-second loop):
- The lead agent writes the workflow, and the highlighted line shows which part is running.
- Phase 1 fans out over a queue of code chunks: each blue cell is an agent thread, filling as it works. A gold dot means it found a bug; a green tick means the chunk was clean. Never more than 64 cells work at once.
- Each result flies back to the program, the "collected" box in phase 2.
- Phase 2 merges the results. The reviewer rejects round 1 ("missing evidence"), the draft is revised, and round 2 passes.
- The report is written to the shared files and returned to the lead agent, which then reads what the run did.
- The strip shows the real event names as they happen. The bars show Anthropic's synthetic benchmark.

📌 Sources:
- Claude Platform release notes, Oct 9, 2026 (dynamic workflows in beta).
- Claude docs, "Workflow runs" and "Multiagent orchestration" (64 working at once, 1,000 agents per run, 24-hour default lifetime, 10 open runs per session; budget pauses open runs).
- AlphaSignal and Digg coverage of Anthropic's test: 70 planted bugs, 116,000 lines, workflow 66/66/66 vs single agent 14/15/27.

ℹ️ Caveats and disclosure:
- The benchmark is Anthropic's own synthetic test. It doesn't establish results on every codebase, and it isn't cost-matched.
- The program text, chunk counts and timings in the GIF are illustrative, not a real run.
- This is Anthropic's product, and I drafted this post with help from Claude.

## Alt text (≈ 880 characters)
Animated architecture diagram on a dark espresso background, titled "This agent writes its own orchestration code." On the left, a lead agent types a short workflow program; a highlight shows which line is running. In the centre, "Phase 1, read the code": work items leave a queue and fill an 8 by 8 grid of agent cells. A counter shows up to 64 working at once and a started count out of 1,000. Finished cells flash a gold dot for a found bug or a green tick, and each result flies to a "collected" box. On the right, "Phase 2, reconcile": merge, then review. Round 1 is rejected ("missing evidence"), revised, and round 2 passes. The report goes through a shared sandbox files band back to the lead agent. A strip of session events scrolls along the bottom. Bars show Anthropic's synthetic test: the workflow finds 66 of 70 bugs, a single agent 27 of 70.
