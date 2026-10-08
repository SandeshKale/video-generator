# LinkedIn caption (draft v1) — for the "front door" GIF

**AI agents are about to knock on your company's front door. Do you know which door you want them to use?**

This week Sierra and Meta announced the Personal Agent Protocol (PAP): an open, OAuth-based standard for how a customer's personal AI agent signs in and interacts with a business. Walmart, Shopify, Stripe, Genesys and a few others are on board.

What I like about the design (as announced):
→ The customer decides what access their agent gets: guest, signed-in read-only, or signed-in write.
→ The company decides what that agent may do, and which door it comes through: the website, an API (MCP / OpenAPI), or the company's own agent.
→ Sessions carry across channels, so "check my order" doesn't start from zero each time.

What's still missing, and worth saying out loud:
→ There's no published spec yet. v0.1 is due later this month. Payments, push notifications and finer-grained permissions are listed as future extensions.
→ No licence or governing body has been announced, and OpenAI, Anthropic, Amazon and Google aren't named partners.
→ It sits next to other efforts (Google/Shopify's UCP, OpenAI/Stripe's ACP, Visa's Trusted Agent Protocol), so the question for builders is less "which one wins" and more "what's our agent posture meanwhile".

My takeaway: whatever protocol wins, treat agent access like any other access. Start with guest-read, add signed-in read, allow reversible writes with logs, and keep irreversible actions (purchases, transfers) behind a human confirmation until the rails exist.

Where does your business stand today: welcome agents, tolerate them, or block them?

Source notes: announcement coverage (Techzine, Forkast, CMSWire) and one independent analysis (Beri.net) for the protocol comparison and permission-tier suggestion. Details may change once v0.1 is published.

#AIAgents #AgenticAI #APIs #MCP #Ecommerce #DigitalTransformation #Security
