# LinkedIn copy: "Google gave AI agents an employee badge" (vertical GIF `agent-coworkers.gif`, 1080×1350, 10 s loop)

Post it as a native GIF upload. Only the first ~200 characters show before "see more", so the hook carries the post.

## Post (recommended)

Google just gave AI agents an employee badge. The interesting part isn't the agent. It's the control plane around it.

On Oct 8, Google announced the Gemini agent (private preview). Strip away the demo and it's an architecture for treating agents like staff. Follow the numbers in the GIF:

1. One agent, many models. The agent is separate from the model underneath. Today that's Gemini or Anthropic's Claude, chosen by you or routed per job (simple steps go to cheaper models).
2. Temporary sub-agents. For big jobs it spawns job-specific helpers that run in parallel, each with its own identity, then disappear.
3. Coworker agents. Persistent roles with their own @agents.company.com email, calendar and Drive. They only see what the team shares with them.
4. One front door for traffic. Every agent runs in a sandbox, and all traffic (in, out and between agents) passes through Agent Gateway, an AI network firewall. Policy is written once ("agents may not open Need to Know documents") and applies to every agent.
5. Receipts and a budget. Every action is logged to the agent, not to a person. Each project has a spend cap; when it's hit, the agent pauses until someone resumes it.

Google frames it as four questions every deployer should be able to answer: who is the agent, what may it do, what did it do, and what must it never touch?

The open question is the one analyst Carmi Levy raised: can CIOs and CISOs trust it with mission-critical processes "without a damaging failure"? Identity and audit don't make an agent right. They make it accountable.

If your agents ran on this model tomorrow, which of the four questions could you answer today? 👇

#AIAgents #AgenticAI #SoftwareArchitecture #EnterpriseAI #AIGovernance #ZeroTrust #MCP #GenerativeAI

## Shorter version

Google just gave AI agents an employee badge.

The Gemini agent (announced Oct 8, private preview) treats agents like staff: each one gets its own attested identity, temporary sub-agents spin up with their own IDs, coworker agents get their own email and calendar, all traffic goes through one AI firewall with policy written once, every action is logged to the agent, and a spend cap pauses it.

Who is your agent, what may it do, what did it do, and what must it never touch?

## Hashtags
#AIAgents #AgenticAI #SoftwareArchitecture #EnterpriseAI #AIGovernance #ZeroTrust #MCP #GenerativeAI

## First comment (sources and how to read the GIF)
📌 How to read the GIF (10-second loop): your team sends an objective. The agent plans (model switch flips to Claude), then routes routine steps to Gemini. It spawns three sub-agents, each stamped with its own ID. Every request travels down the internal bus, past the policy, through a gateway lane to a tool, and each crossing prints a signed line in the audit trail and charges the project meter. One request tries to open a "Need to Know" document and is blocked by the policy. When the meter hits the cap, everything pauses until an admin resumes. Sub-agents report back and fold away, and the result goes back to the team.

📌 Sources:
- Google Cloud blog, "Welcome to Gemini at Work 2026: Introducing the Gemini agent" (Oct 8, 2026).
- Reworked, "Google debuts its all-purpose Gemini agent for work."
- CIO.com / Computerworld, "Google wants to be the gatekeeper for enterprise AI agents" (Carmi Levy quotes).
- Constellation Research, "Google Cloud launches Gemini agent to work across enterprise systems."

ℹ️ Caveats: the Gemini agent is in private preview, with no GA date or price announced. The diagram is my illustration of the architecture Google describes, not Google's own drawing; the tools, agent names, timings and the 64% cap are illustrative.

## Alt text (≈ 860 characters)
Animated architecture diagram on a dark background titled "Google gave AI agents an employee badge." A "Your team" box sends an objective into a dashed "Agent sandbox." Inside, a Gemini agent box has a model switch that flips between Gemini and Claude. It spawns three temporary sub-agents, each stamped "ID ✓," beside two persistent coworker agents named events and finance. Glowing request dots travel down an internal bus, past a red policy bar reading "No Need to Know docs," through an "Agent Gateway, AI network firewall," to tool tiles: MCP, Jira, BigQuery, CRM, Slack and a locked Need to Know document. One request is blocked at the policy bar. Each request adds a line to an audit trail on the right and fills a project spend meter; at the cap everything pauses until an admin cursor clicks resume. A numbered legend explains the five parts.
