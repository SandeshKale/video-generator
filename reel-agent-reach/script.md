# Script — "Give your AI agent eyes" (Agent-Reach) — target 60–66 s, English VO

Topic facts (verified at research time; re-check on render day): repo `Panniantong/Agent-Reach`, MIT, ~94.5k stars, Python 3.10+, "no paid API keys".
Works out of the box: web pages (Jina Reader), YouTube + Bilibili (yt-dlp), RSS (feedparser), public GitHub (gh CLI), V2EX.
Needs login/cookies: Twitter (twitter-cli), Reddit (rdt-cli), XiaoHongShu. Install: paste the install-doc link into your agent, or `pip install agent-reach` + `agent-reach install --channels=all`; check with `agent-reach doctor`. Caveat: script access on login sites can get accounts banned → burner account; may breach platform ToS. CTA keyword: **REACH**.

Layouts: A = host full, B = split (graphic top / host bottom), C = graphic full. `crop` = host punch-in. Times are estimates at ~2.6 words/s; real cuts come from TTS timing.

| # | ~t | Spoken line (VO = on-screen captions) | Layout / graphic (EDL) | Performance track (host) | Audio |
|---|---|---|---|---|---|
| 1 | 0–3.2 | "Your AI agent is basically blind. This free tool gives it eyes on the whole internet." | A, crop 100→118 on "eyes". Frame 0 already composed: caption live, Reach hand peeks in from right edge on "eyes" | Brow raise + lean-in on "blind"; dead-on camera; no blink; nod on "eyes" | Sub bed starts; whoosh on first cut |
| 2 | 3.2–8 | "It's called Agent Reach. Ninety-four thousand GitHub stars, MIT licensed, zero API fees." | B: repo card (name, ★ 94.5k counter ticks up, MIT stamp, "$0 API" stamp slam) | Calm nod on "stars"; brow up on "zero" | Tick per stat, stamp thud |
| 3 | 8–13 | "Setup is one line. You paste the install link into your agent, and it sets itself up." | C: step cards `1 COPY THE INSTALL LINK` → `2 PASTE IN YOUR AGENT` → `3 DONE` (1 s each, terminal line types `> agent installs agent-reach…`) | Blink at sentence end; small head tilt on "one line" | Card ticks |
| 4 | 13–20 | "Out of the box it reads web pages, watches YouTube, searches GitHub, and follows RSS feeds." | B→C: Reach hand pokes to four platform tiles in turn (web / YouTube / GitHub / RSS), each lights green ✓ on its word | Nod on each list item (3 small), eyes on lens | Pop per tile |
| 5 | 20–25 | "Twitter, Reddit and Xiaohongshu need your browser cookies." | B: three tiles locked 🔒 → cookie icon drops in → unlock; step tag `LOGIN NEEDED` | Slight brow furrow ("catch") on "need" | Lock click, soft whoosh |
| 6 | 25–30 | "But use a burner account. Scripts on login sites can get you banned." | A, punch-in 125 %; red ban-hammer stamp `BAN RISK` over a tile corner (not on host face) | Serious: brows down, slow single nod on "burner", no smile | Low hit on "banned" |
| 7 | 30–38 | "Here's the trick. It isn't a new scraper. It's a switchboard over tools like yt-dlp, Jina Reader and the GitHub CLI. One breaks? It routes to the next." | C: switchboard diagram — agent node → patch cords → 3 tool nodes; one cord sparks red ✗, cord re-routes to the next ✓ on "routes" | Lean back, brow up on "trick"; nod on "routes" | Riser building to montage |
| 8 | 38–50 | "Ask it what Reddit really thinks of a tool. Summarise a two-hour YouTube talk. Track a competitor's tweets. All from one prompt." | C dark montage, 4 × ~2.5 s result panels (illustrated Reddit thread / transcript summary with timestamps / tweet tracker / "1 prompt" chip), white flash between | Off-screen (host hidden; small PiP optional) | Montage bed lift, flash whoosh |
| 9 | 50–55 | "Run agent-reach doctor and it tells you what's ready." | B: terminal `$ agent-reach doctor` → checklist ✓✓✓ ✗✗ filling line by line | Eyes on lens, easy smile, one nod on "ready" | Typing ticks |
| 10 | 55–62 | "Want the link? Comment REACH below and I'll send it to you. Follow for more free tools." | A. Profile photo ring ≥ 200 px + @sandesh.explains + big `COMMENT "REACH"` bubble; Reach hand points down; held ≥ 2.5 s | Lean-in, dead-on camera, warm brow raise on "Want the link?", slow nod at the end, no blink in the ask | Pop on bubble, bed resolves |

Word count ≈ 150 → ~58–62 s at 2.5 w/s with pauses. Hook sentence 1 ≈ 3.3 s: if it runs long, drop "whole" before speeding up (standing rule).

## Eyebrow / tag copy (content-specific, nothing generic)
`// ZERO API FEES`, `// COOKIES REQUIRED`, `// BURNER ACCOUNT ADVISED`, `// ONE TOOL FAILS, NEXT TAKES OVER`, `// ONE PROMPT, FOUR SOURCES`.

## Production notes
- Voice: confirm user-clone vs Kokoro; per-sentence generation; breaths between 5↔6 and 7↔8.
- Host chunks cut at sentence ends (≈ 1,3,5,6,7,9,10) — beats 8 has no host, so MoDA/LatentSync only needs ≈ 40 s of host audio.
- Captions: 2–4 words, emphasis words in serif italic: *eyes*, *zero*, *burner*, *trick*, *REACH*.
- Cover (grid-first, 3:4 centre crop, ≤5 words): `GIVE AI EYES` with the cherry glove hand reaching toward a camera-lens eye; palette from the reel.
- Instagram caption + ~28 hashtags written after the final cut.
- Compliance: no scraping demo of real individuals; example panels labelled "illustration"; the burner/ToS caveat is spoken and shown.

## Open questions before build
1. Which model does your working Kaggle notebook run (MoDA + LatentSync as before, or something with gestures)? Share the notebook name/steps.
2. Voice: clone your own voice (send a clean 15–30 s sample) or use a generated male voice?
3. Approve keyword `REACH` and the "Field Notebook" look (bone/ink/cherry) → I'll mock up scenes 1, 4, 10 first.
4. Do you want to record one 20–30 s gesturing clip to use as the driving video?
