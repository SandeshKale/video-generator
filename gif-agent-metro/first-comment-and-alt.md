# First comment + alt text — Agent Metro GIF

## First comment (post right after publishing)

How to read the GIF 👇

🚉 The map is illustrative, not the spec. Here is the mapping:
• Three lines = the three ways in that Sierra and Meta describe: your website, your APIs (MCP / OpenAPI) and your own business agent. The business chooses which to open.
• Train colour = the keycard (session) the customer gave their agent: guest (read public info), signed-in read-only, signed-in write.
• Gates = what the business allows each session to do. A train that tries to go past its ticket gets turned back (the red ✕).
• Boarded-up station = items the announcement lists as later extensions: payments, push notifications and finer-grained permissions.
• Dashed networks at the bottom = other agent-commerce efforts (Google/Shopify's UCP, OpenAI/Stripe's ACP, Visa/Cloudflare's Trusted Agent Protocol). Separate efforts today.

What is confirmed vs. not:
✅ Announced Oct 6, 2026 by Sierra and Meta; built on OAuth; named partners include Genesys, Shopify, Stripe and Walmart.
✅ Three ways in (website, API, business agent) and guest / signed-in read / signed-in write sessions.
⏳ No published spec yet. v0.1 is due later in October, along with a reference implementation and design workshops.
❓ Governance, licence, and whether OpenAI, Anthropic, Amazon or Google join are all open. They are not named partners today.
The four capabilities on the map (public info, my account, change things, payments) are my illustration of the idea, not the protocol's own list.

If you run a product or platform team, a practical starting point is the same ladder the GIF shows: guest read → signed-in read → reversible writes with logs → irreversible actions behind a human step-up.

Sources: Techzine and Forkast coverage of the announcement (Oct 6–7, 2026), CMSWire for the partner list, and Beri.net for the UCP / ACP / TAP comparison (one analyst's view). Details may change when v0.1 lands.

Question for you: which door would you open to agents first, the website, the API, or your own agent? And what would be your first "closed station"?

## Alt text

### Short (fits LinkedIn's alt-text field, ~120 chars)
Animated transit map: AI-agent trains with guest, read and write tickets pass gates; the payments station is closed.

### Full description (use in comments / accessibility notes / doc)
An animated 8-second looping graphic titled "Agent Metro", on a dark purple background, showing how a personal AI agent gets through a business's front door. On the left, a box labelled "Customer's agent" holds three keycards: guest, read and write. They feed into a vertical interchange labelled "Front door — one OAuth session". From there three coloured rail lines run to the right: Website, API (MCP/OpenAPI) and Business Agent. Small trains in grey, aqua and yellow, one colour per ticket class, travel along the lines to stations under three column headings: "Public info" (inventory, returns), "My account" (my orders, account) and "Change things" (act on my behalf). Gates at each station lift only for trains whose ticket is high enough; a train that tries to go further bumps back and a red cross appears. The fourth column, "Payments — push alerts, finer permissions", is blocked by a yellow-and-black hazard barrier with a padlock and the label "Not in v0.1". Below, a departures board lists which ticket reaches what: guest can read public info, signed-in read can see orders and account, signed-in write can act on the customer's behalf, and any ticket is closed for payments. A card reads "Spec v0.1, later in October, no published spec yet" with a moving progress stripe. A smaller panel, "Other efforts, separate networks", shows UCP, ACP and TAP as three dashed lines with small trains. The map is illustrative.
