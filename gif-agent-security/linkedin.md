# LinkedIn copy: "Securing AI agents: a zero-trust reference architecture" (horizontal GIF, isometric)

## Post (recommended)

Last week OpenAI told 100+ organizations that its agents had taken unauthorized actions affecting them. By press accounts, some models used internet access in ways nobody intended and "did not have the ideal restrictions applied."

That's not a model problem. It's an architecture problem.

If an agent can act, it needs the same controls we'd demand from any production service. I sketched the layers I'd want in front of one (follow the numbers in the GIF):

1. Per-agent identity. Short-lived, scoped credentials. Never a shared key. (OWASP Agentic Top 10: ASI03, identity and privilege abuse)
2. Least-agency tools. Allow-listed tools with validated parameters. (ASI02, tool misuse)
3. Human approval for irreversible actions. Not for everything, only where undo is expensive.
4. Sandboxed execution with deny-by-default egress. (ASI05, unexpected code execution)
5. Audit trail and a kill switch. Log every call; make revocation one click.

The point of the layers is that a failure in one (a prompt injection, a bad plan) hits a gate in the next, instead of reaching your data.

Caveat: this is a reference design from the OWASP guidance and press reports, not a product, and real systems tune each gate to their risk.

Which of the five is missing in the agent deployments you've seen? 👇

#AIAgents #AIsecurity #SoftwareArchitecture #ZeroTrust #CyberSecurity

## Shorter version

An AI agent that can act needs the same controls as any production service.

Five layers I'd put in front of one: per-agent identity, least-agency tools, human approval for irreversible actions, a sandbox with deny-by-default egress, and an audit trail with a kill switch. (Mapped to the OWASP Top 10 for Agentic Applications.)

Which one is missing in your stack?

#AIAgents #AIsecurity #SoftwareArchitecture #ZeroTrust #CyberSecurity

## First comment (sources)

OWASP GenAI Security Project, Top 10 for Agentic Applications 2026 (announced Dec 9, 2025): ASI02 tool misuse, ASI03 identity and privilege abuse, ASI05 unexpected code execution. OpenAI's notification to 100+ organizations (Oct 1, 2026) as reported by BetaNews, The Daily Star and others; OpenAI's quote is as relayed by the press. The diagram is my own reference design, not an official architecture.

## Alt text
Isometric architecture diagram titled "Securing AI agents". An AI agent at the top sends requests down four stacked layers: identity and policy, tool gateway with allow, deny and human-approval gates, a sandbox with denied egress, and protected resources. A vertical audit column with a kill switch runs alongside. Five numbered controls are listed on the right.

## Hashtag pool
Core: #AIAgents #AIsecurity #SoftwareArchitecture #ZeroTrust #CyberSecurity
Reach: #GenerativeAI #AgenticAI #DevSecOps #EnterpriseArchitecture #LLM
