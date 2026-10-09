# Your recording kit — voice sample + gesture clip bank

## Decision: which avatar route (Q1)
**Keep MoDA + LatentSync on Kaggle (proven, you approved the result), but change what feeds it.**
LatentSync is a *video-to-video* lip re-sync: it keeps whatever the input video does (head, brows, blinks, **hands**, body) and only redraws the mouth to the new audio. So instead of a single still photo, we feed it **your own real footage**:

1. You record a one-off **gesture bank** (10 short takes below, ~90 s total) — real hands, real brows, real eye contact.
2. For every reel, I pick/trim/loop the takes that match each beat's performance track (hook = lean-in take, list = counting take, CTA = point-down take…), assemble them into the host timeline, and LatentSync re-syncs the mouth to the (cloned) voice.
3. Result: real gestures and gaze-on-camera by construction; the bank is reusable for every future reel.
MoDA stays as the fallback for beats with no matching take. I'm not betting on a half-body generative model (EchoMimicV2: ~16 GB GPU, licence/quality unverified) — real footage + LatentSync beats it and costs nothing extra.

Hard limits so LatentSync works: keep **hands below your chin/mouth** the whole time (a hand crossing the lower face gets smeared), no mic/cable/hair across the mouth, face ≥ 1/5 of the frame height, same spot/lighting/outfit for all takes.

## Filming setup (all takes in ONE session)
- Phone **vertical (9:16)**, rear camera, 1080p, 30 fps (25 is fine), locked exposure/focus, on a tripod at **eye level, lens at your eyes**. Frame: top of head → mid-chest, hands visible when raised to chest height.
- Soft light from the front (window in front of you or a lamp bounced off a wall). Plain, uncluttered background. No glasses glare if you can help it (matte lens or tilt slightly).
- Look **into the lens**, not at the screen. Use a teleprompter app or memorize the one-liners — they're short on purpose.
- Every take: **2 s mouth closed, looking at the lens → speak → 2 s mouth closed**. Say the clap/“action” silently by starting the recording, not by speaking. If you flub, just redo from the top.
- Speak normally (volume/energy like the reel) — jaw movement should be natural. Don't mumble.
- Send as original files (AirDrop to Drive / "Original quality"), not screen-recordings or WhatsApp-compressed.

## A. Voice sample (for the voice clone) — record on its own, audio only
Use the phone Voice Memos / a lav mic **10–15 cm from your mouth**, quiet room (no fan/AC, soft furnishings), M4A/WAV is fine. Start with **3 s of silence** and end with **3 s of silence**, plus a separate **10 s of "room tone"** (just silence, same spot). Speak at the pace you'll use in reels — confident, friendly, not read-aloud-robot. Do 2 full passes (Pass 1 natural, Pass 2 a notch more energetic).

**Segment 1 — neutral / explainer (≈15 s)** *(this is the best clone reference, make it clean)*
> "Most people think an AI agent can just browse the internet. It can't. Out of the box it's stuck with whatever it already knows, so it guesses, and that's where the wrong answers come from. Give it the right tools, and it stops guessing and starts looking things up."

**Segment 2 — numbers, names and tech words (≈20 s)**
> "It's called Agent Reach. Ninety-four thousand stars on GitHub, MIT licensed, and zero API fees. Underneath it uses yt-dlp for YouTube, Jina Reader for web pages, and the GitHub CLI. Twitter, Reddit and Xiaohongshu need your browser cookies. Run agent-reach doctor and it tells you what's ready."

**Segment 3 — energetic hook & questions (≈15 s)**
> "Your AI agent is basically blind. This free tool gives it eyes on the whole internet. Wait, what? One line of setup. Seriously, one. Ask it what Reddit really thinks of a tool. Summarise a two-hour YouTube talk. Track a competitor's tweets. All from one prompt."

**Segment 4 — serious / warning tone (≈10 s)**
> "But here's the catch. Use a burner account. Scripts on login sites can get you banned, and that's on you, not the tool."

**Segment 5 — warm CTA (≈12 s)**
> "Want the link? Comment REACH below and I'll send it to you. Follow for more free tools like this. I'm Sandesh, and I'll see you in the next one."

**Segment 6 — phoneme coverage (≈15 s, read steadily)**
> "The quick brown fox jumps over the lazy dog. She sells seashells by the seashore. Thirty-three thousand three hundred and thirty-three. Fifteen, fifty, five hundred and fifty. Jinx, vex, quiz, my wizard's pigeon. How much wood would a woodchuck chuck?"

Consent note: the clone is of **your own voice, used for your own reels only**. Nothing is uploaded anywhere public.

## B. Gesture clip bank (video) — 10 takes, ~6–9 s each
Say the line while performing the action; the words don't need to match the final script (the mouth gets replaced) but speak them for real so the face is alive. Hands stay **below chin**.

| # | Name | Do this | Line to speak |
|---|---|---|---|
| 1 | HOOK-LEAN | Start upright, **lean toward the lens** on the 2nd sentence, brows up, both open palms toward camera briefly at chest height on "eyes". No blink until the line ends. | "Your AI agent is basically blind. This free tool gives it eyes on the whole internet." |
| 2 | EXPLAIN | Calm, 2–3 small nods, one relaxed hand "beat" gesture (palm sideways) per sentence. | "It's called Agent Reach. It's open source, MIT licensed, and there are zero API fees." |
| 3 | COUNT-LIST | Count on your fingers at chest height: 1-2-3-4, one finger per item, nod on each. | "It reads web pages, watches YouTube, searches GitHub, and follows RSS feeds." |
| 4 | CATCH | Brows **furrow** on "but", slow single nod, palm-down "calm/stop" gesture at chest height. Serious face. | "But use a burner account. Scripts on login sites can get you banned." |
| 5 | TRICK | Lean **back** a little, brows up, small half-shrug with both hands open at belly height. | "Here's the trick. It isn't a new scraper. It's a switchboard over tools you already know." |
| 6 | POINT-ASIDE | While speaking, point with one hand **up and to your right** (toward where a graphic will sit), glance there for ≤0.5 s, then back to the lens. Repeat on the left in the same take. | "Look at this one. And then this one. Same prompt, totally different sources." |
| 7 | QUESTION | Head tilt on the question, brows up, then a warm half-smile and a nod. | "Want the link? Comment REACH below and I'll send it to you." |
| 8 | POINT-DOWN (CTA) | Point **down toward the bottom of the frame** with one hand, lean in, eyes dead-on lens, big warm smile at the end. | "Follow for more free tools. Link is in your DMs, just comment below." |
| 9 | IDLE-LISTEN | **Mouth closed**, 10 s, looking at the lens, relaxed, one natural blink every ~4 s, tiny nods. (Used under graphics when the host isn't speaking.) | *(silent)* |
| 10 | SMILE-OUTRO | Easy smile, small wave of one hand at chest height, nod. | "Thanks for watching. I'm Sandesh, see you in the next one." |

Optional extras if you have energy: 11 SURPRISE (wide eyes, "Wait, what?"), 12 NUMBER-EMPHASIS (one hand chops down on each stat: "Ninety-four thousand. Zero. One line.").

## What I'll do with it
Voice → OmniVoice clone test (A/B vs Kokoro on the hook line) → pick by listening/prosody metrics. Clips → trim at the mouth-closed pads, check gaze per take by eye, build the beat-by-beat host timeline, run LatentSync on Kaggle (chunks cut at sentence ends), verify hands/mouth on the final MP4.
Meanwhile I'm mocking up the "Field Notebook" scenes (1 hook, 4 split + step cards, 10 CTA) for your approval.
