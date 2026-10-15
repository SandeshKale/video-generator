# LinkedIn post — MCP goes stateless (GIF: `mcp-stateless.gif`, 1080×1350, 8 s loop)

## Caption
**MCP just stopped remembering you. On purpose.**

The Model Context Protocol's 2026-07-28 spec swaps a stateful, session-based design for a stateless request/response one. The official post calls it "one of the most highly-requested features from developers who were eager to get better reliability and scalability for their MCP servers."

The GIF is a sorting hub: every request is a letter carrying its own label, and any identical server can answer it.

What changed (per the spec's release notes):
→ No protocol sessions, no `Mcp-Session-Id`, no `initialize` handshake. Each request carries its own protocol version and client info.
→ Servers can sit behind a plain round-robin load balancer. No sticky sessions, no shared session store.
→ `Mcp-Method` and `Mcp-Name` headers let gateways, rate limiters and WAFs route and meter without parsing the JSON body.
→ State didn't vanish, it moved: a tool mints an explicit handle and the model passes it back as an argument. The authors say this works better than session state hidden in the transport.
→ Need to ask the user something mid-call? The tool returns `input_required` and the client retries with the answers, instead of holding a stream open.
→ Auth got stricter (validate the `iss` parameter, credentials bound to their issuer). Roots, Sampling, Logging and the old HTTP+SSE transport are deprecated, with at least a 12-month off-ramp.

If you run MCP servers, the practical homework is dull and valuable: drop sticky routing, stop leaning on session state, treat handles as first-class, and plan the deprecations. SDK support is broad (TypeScript, Python, Go, C# ship it, Rust is in beta), but check whether your SDK needs you to opt in.

The bigger idea: agents scale like web traffic once servers stop remembering them. The hard part moves to *what you let a handle point at*.

Question: how much hidden session state is your MCP server carrying today?

Source: official MCP 2026-07-28 release post and changelog. The picture is illustrative, not an architecture reference.

#MCP #ModelContextProtocol #AIAgents #AgenticAI #SoftwareArchitecture #PlatformEngineering #APIs #DistributedSystems #DevOps #AIEngineering

## First comment
Quick key to the GIF 👇
📬 Letter = one MCP request carrying its own context (protocol version, client info). 
🚪 Gateway = routes on `Mcp-Method` / `Mcp-Name` headers; the body stays sealed.
🖥️ Servers 1–4 = identical, no memory. Round-robin works, so any of them can answer.
🎟️ Brass ticket = a handle the model passes back when work needs state.
❓ Red "?" parcel = `input_required`: the tool needs an answer, the client retries with it.
📞 Top panel = the old world: sticky sessions and a shared store, with `Mcp-Session-Id` now removed.
⏳ Bottom left = Roots, Sampling, Logging and HTTP+SSE still work, but are deprecated with at least 12 months of runway.
🧰 Bottom right = TypeScript, Python, Go and C# SDKs support the revision, Rust in beta; Tier-1 SDKs see about half a billion downloads a month (official figures).

What I did not verify: how many production servers have actually migrated. If you've done it, what bit you? 

Sources: MCP blog "The 2026-07-28 Specification" (blog.modelcontextprotocol.io/posts/2026-07-28/), spec changelog (modelcontextprotocol.io/specification/2026-07-28/changelog), SDK beta notes (blog.modelcontextprotocol.io/posts/sdk-betas-2026-07-28/).

## Alt text (short)
Animated sorting hub: AI client requests, each with its own label, pass a header-reading gateway and reach any of four identical servers.

## Alt text (full)
An animated 8-second loop on a dark background titled "MCP stopped remembering you". At the top a dashed panel marked "Before" shows an old switchboard with cords and the text "sticky sessions, a server remembers each caller"; the tag "Mcp-Session-Id" is struck through and stamped "Removed". Below, four client boxes (Agent, IDE, Chat, Cron) send small envelopes down dashed lanes into a wide gateway bar labelled "Gateway reads headers only, body stays sealed". From the gateway, envelopes drop to any of four identical boxes labelled Server 1 to 4, "no memory", which light up when they answer; green reply envelopes return up to the clients. One reply is a red parcel with a question mark, the "input_required" case, and one envelope carries a brass ticket, a handle. Two cards explain "state is a handle" and "mid-call question, input_required, retry". Bottom cards show a 12-month off-ramp clock for deprecated Roots, Sampling, Logging and HTTP+SSE, and SDK badges for TypeScript, Python, Go, C# and Rust beta with a bar animation for about half a billion monthly downloads. A ticker scrolls key phrases along the bottom.

## Validation
Scripted check every 0.25 s over the loop (text bounds, ≥18 px, overlaps): only line-box touches (title lines, "12/months"), the '?' on its own parcel, and request/reply letters passing behind the "②" pill (hidden by design). Frames reviewed at full size and 432 px wide. 32/32 sampled moments differ.
