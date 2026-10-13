# The next 10 reels: plan (written 13 Oct 2026)

This plan builds on `insights/growth-diagnosis.md`. That report found one pattern behind every reel so far: about 200 non-followers see it, 75% swipe away in the first 3 seconds, the rest leave at about 4.5 s, and nobody shares it. So Instagram never shows it to anyone else.
This plan changes the things those numbers point to:
- what the reels are about (things people can use, and want to send to someone)
- the first 3 seconds
- the length
- the presence of a real person and a recognisable series

It also turns each reel into a test, so that by reel 10 the decisions come from your own data.

No plan can guarantee growth. What this one does is remove the measured causes of the stall, and give you a clear rule after every post for what to keep and what to drop.

---

## Part 1: What changes, and why

| Old pattern (measured) | New rule | Why |
|---|---|---|
| AI-company news ("OpenAI just…") | **Something the viewer can use today, or something that protects them or their family.** News only when the viewer can act on it the same day. | 0 shares in 21 reels. People send things that help the person they send them to. Practical-tip reels with a comment-keyword offer are what's getting 300K–500K views in this niche right now (`trends.md`, "high-performing AI reels"). |
| 60–96 s | **20–35 s**, 55–85 spoken words, one idea per reel | Viewers watched about 4.5 s. Industry average is about 8 s. A short reel gets a higher completion %, and Instagram counts both the % watched and the seconds watched. |
| Frame 0 = a designed headline about a company | **Frame 0 = a face, or the result itself, plus at most 6 words aimed at "you".** The voice starts at 0.0 s, and the first real piece of information lands by 1.5 s. | Median 75% skipped in the first 3 s, against about 65% for small accounts. |
| No human until the end card | **Your real face and voice in the first 1.5–2 s** (filmed on your phone), then the screen or demo | People follow people. The only face so far was in the CTA, which 95% of viewers never reached. |
| A brand-new visual identity every reel | **One fixed series frame**: same opening layout, same series badge, same end card, same caption style. Variety happens *inside* the frame. | A viewer who sees 3 of your reels should know they're from the same channel. ⚠ This changes the CLAUDE.md rule "every reel needs its own visual identity". It needs your OK (see Part 7). |
| Recreated "illustrative" interfaces | **Real screen recordings** of the real product wherever possible. Illustrated recreations only for things that can't be filmed. | Real screens are proof. Illustrations ask the viewer to trust you. |
| "Follow for more" / a CTA at the very end | **A share line at about 70% of the runtime** ("Send this to the friend who…"), **plus a comment-keyword CTA** that delivers something useful by DM | It asks for the actions Instagram weighs most for non-followers: sends, then comments. |
| 30 hashtags, captions of 1,500–2,000 characters | **3–5 specific hashtags. Caption of 300–700 characters, with the keyword CTA on line 1** and searchable words (the tool name plus the task) in the first 2 lines | Hashtags are capped at 5 and don't widen reach. Captions and on-screen text feed Instagram search. |

---

## Part 2: The series system

**Series name: "Use It Today".** On-screen badge: `USE IT TODAY · #01`.
The promise in one line, used everywhere (bio, badge, caption): *"One AI trick you can use today, in 30 seconds."*

**Fixed frame (identical in every reel):**
1. **0.0–1.8 s, the face hook.** You, filmed vertically on your phone, chest-up, looking into the lens, saying the hook line.
   - Hook text is burned in on the top third (y 200–520, ≤6 words, the hook's key word in the accent colour).
   - The series badge sits at the top left, at y ≥ 150.
   - If filming isn't possible for a reel, use the result itself as frame 0 (the finished output, the scam message, and so on). Never open on a logo or a title card.
2. **1.8–25 s, the demo.**
   - Real screen recording or a built visual, with a step tracker (`1 / 2 / 3`).
   - Every 1.5–2.5 s something new happens (zoom, cursor, highlight, cut); no shot holds longer than 3 s.
   - Your face stays in a corner circle (bottom left, inside the safe zone), so the person stays on screen.
3. **At about 70% of the runtime, the share line.** Spoken and on screen: "Send this to ___ who ___." The blank is specific to the reel (a parent, a job-hunting friend, a classmate).
4. **Last 3 s, the end card** (identical every reel, held ≥2.5 s):
   - "Comment **KEYWORD** and I'll DM you ___"
   - your profile ring and @sandesh.explains
   - "Save this" icon
   - The last frame should match frame 0 closely, so the reel loops smoothly into a replay.

**What still changes per reel:** the accent colour (from one 4-colour series palette), the demo visuals, the asset families inside the demo, the music cue. Keep each reel's look distinct *inside* the fixed frame.

**Series palette (fixed):** off-black `#121212`, paper `#f4f1ea`, signal yellow `#ffd23f`, and one accent per reel. Fonts: one display face for the series (e.g. Anton for hooks and the badge, same as the covers) plus Inter for captions. This lines the reels up with the covers you already have.

**Voice:**
- Hook lines are your real voice, recorded on your phone in a quiet room with a soft furnishing behind you (cuts the reverb you noticed).
- For the demo voice-over, test both:
  - (a) your real voice recorded in one take from the script
  - (b) the Qwen clone of your voice
- Reels 1–4 alternate between the two (see the test plan). After reel 4, keep whichever wins on average watch.

**Captions (subtitles on screen):** the current dark pill with word highlights stays. Keep it to ≤2 lines, at y 1338–1490, never covering the face or the demo focus.

---

## Part 3: The 10 reels

Rules for every reel:
- Every fact is read first-hand on the vendor's own page **on the day of the build** (tier A); anything else is marked "reported".
- Numbers are never invented.
- UI steps are filmed from the real app, labelled "as of <date>". If the UI has changed, the reel changes with it.

Each reel lists: the hook (A = main, B = alternate for Trial Reels), the beats, the share trigger, the keyword and DM, the test variable, and what to verify first.

### Reel 0 (post now): `reel-synthid-check`, re-captioned
- It's already built (35 s). Post it with the new caption rules: keyword CTA "CHECK" on line 1, 4 hashtags (#SynthID #AIDetection #Deepfake #FactCheck), caption under 700 characters.
- It sets the "before" baseline for the new format (no face, cloned voice).

### Reel 1: "The safe word that beats AI voice-scam calls"
- **Theme:** protecting yourself and your family. **Length:** about 30 s. **Keyword:** SAFE → a DM with how to pick a family safe word, what to say on a suspicious call, and how to report it.
- **Hook A:** (to camera, serious) "If 'I' call you crying for money… ask me this one question." Text: **"ASK THIS ONE QUESTION"**.
- **Hook B:** frame 0 = a fake incoming call screen, "Mom calling…", with the line "This isn't my mom. It's AI."
- **Beats:**
  1. Scammers now clone a voice from a short clip (use a reported figure only if you find a tier-A source, e.g. a government advisory or a major security vendor's study).
  2. Agree a safe word with family **today**, offline, never posted.
  3. On any urgent money call: hang up, call back on the saved number, ask for the word.
  4. **Share line:** "Send this to your parents right now."
  5. End card.
- **Visuals:** your face; a phone call UI built as bespoke DOM; an animated waveform "cloning" (an illustration of the idea, not a real voice); humaaans family (a new pose); a three-step card.
- **Test:** real face plus your real voice throughout (variant F1).
- **Verify:** an Indian advisory on voice-clone fraud (CERT-In / Cyber Dost / RBI or PIB) for a tier-A line. If you can't find one, use no statistic.
- **Why first:** this is the most shareable idea on the list. "Send to parents" is a strong reason to send in India.

### Reel 2: "Make ChatGPT ask YOU questions first"
- **Theme:** use it today. **Length:** about 25 s. **Keyword:** ASK → the exact prompt plus 3 variants (email, trip plan, resume).
- **Hook A:** frame 0 = side by side: a vague bad answer vs a sharp good answer, plus "Same AI. One sentence different." Text: **"ONE SENTENCE FIXES THIS"**.
- **Hook B:** (to camera) "You're using ChatGPT backwards."
- **Beats:**
  1. Type the request.
  2. Add the line "Before you answer, ask me 3 questions that would make this better."
  3. It asks; you answer.
  4. A visibly better output.
  5. **Share line:** "Send this to the friend who says AI is useless."
  6. End card.
- **Visuals:** real ChatGPT screen recording on the free plan, with typing highlighted; a before/after split; a step tracker.
- **Test:** no face, cloned voice (variant C), the opposite of reel 1.
- **Verify:** nothing external to verify; it's your own demo. Record the real output, unedited.

### Reel 3: "Check your resume the way the robot screener does"
- **Theme:** use it today (job seekers). **Length:** about 30 s. **Keyword:** CV → the prompt to score a resume against a job description, plus a keyword-gap table.
- **Hook A:** (to camera) "Your resume gets rejected before a human ever sees it. Fix it in 30 seconds."
- **Hook B:** frame 0 = a resume with red highlights appearing, "Missing 6 keywords."
- **Beats:**
  1. Paste the job description and your resume.
  2. Prompt: "Act as an ATS screener. Score my match out of 100, list missing keywords, rewrite 3 bullets with numbers."
  3. Show the score jumping after the edits.
  4. **Catch:** never invent experience.
  5. **Share line:** "Send this to someone job hunting."
  6. End card.
- **Visuals:** real screen recording; a score gauge built per scene; resume close-ups with highlight sweeps; your face in the corner circle.
- **Test:** face hook, cloned voice for the demo (F2).
- **Verify:** don't state any "75% of resumes are rejected by ATS" claim unless you find a solid primary source (most of those figures are myths).

### Reel 4: "ChatGPT remembers things about you. Here's where to see them"
- **Theme:** protecting yourself (privacy). **Length:** about 25 s. **Keyword:** MEMORY → step-by-step settings for ChatGPT, Gemini and Claude.
- **Hook A:** (to camera) "Ask ChatGPT: 'What do you know about me?' I wasn't ready."
- **Hook B:** frame 0 = a blurred memory list, "It remembered my salary."
- **Beats:**
  1. Ask the question live (screen).
  2. Show where the memory list is.
  3. Delete or turn off.
  4. Temporary chat for sensitive things.
  5. **Share line:** "Send this to the friend who tells ChatGPT everything."
  6. End card.
- **Visuals:** real screen recording of your own account, with personal items blurred; a redaction-bar motif; a settings path built as bespoke DOM.
- **Test:** best of F1 / F2 from reels 1–3, to confirm the result.
- **Verify:** the current memory settings path on the vendor's help page on the day of the build. Features differ by plan, so say which plan you're on.

### Reel 5: "ChatGPT just became a calculator app builder (free plan)"
- **Theme:** new and usable now. **Length:** about 30 s. **Keyword:** BUILD → 5 prompts that make useful mini-tools (EMI, bill split, trip budget, SIP, GST).
- **Hook A:** frame 0 = a working EMI calculator inside ChatGPT, with the slider moving. Text: **"I DIDN'T BUILD THIS. CHATGPT DID."**
- **Hook B:** (to camera) "Stop downloading calculator apps."
- **Beats:**
  1. Prompt: "Make me a home-loan EMI calculator."
  2. It builds an interactive tool.
  3. Change the inputs.
  4. Try it for bill splitting.
  5. Which plan gets it.
  6. **Share line:** "Send this to the friend planning a loan."
  7. End card.
- **Visuals:** real screen recording; numbers in ₹; the tool shown in a phone mockup.
- **Verify:** GPT-6 "Intelligent UI" availability on Free/Go on openai.com and the help page (`trends.md` #1). Record on the free plan if possible.
- **Why now:** GPT-6 Intelligent UI, launched 7 Oct, with 6M+ impressions on X. Timely *and* usable.

### Reel 6: "Delete these words and your writing stops sounding like AI"
- **Theme:** use it today. **Length:** about 25 s. **Keyword:** REAL → the "de-AI" prompt plus a list of the 20 most common giveaway words.
- **Hook A:** frame 0 = an email with words lighting up red: "delve", "seamless", "In today's fast-paced…". Text: **"YOUR BOSS CAN TELL"**.
- **Hook B:** (to camera) "Everyone can tell you used ChatGPT. Here's why."
- **Beats:**
  1. The 5 giveaway patterns (words, em dashes, "not X but Y", groups of three, empty endings).
  2. One prompt that rewrites without them.
  3. Before/after read-out.
  4. **Share line:** "Send this to your coworker who writes like a robot."
  5. End card.
- **Visuals:** kinetic type with words striking out, rough.js strikes; a before/after document; your face in the corner.
- **Note:** this niche's top creator already uses the keyword "HUMAN". Use "REAL", and lead with *your* pattern list, not theirs.

### Reel 7: "Turn a 2-hour lecture into flashcards in 2 minutes"
- **Theme:** use it today (students). **Length:** about 30 s. **Keyword:** STUDY → a step list plus 3 study prompts (flashcards, practice quiz, explain-like-I'm-15).
- **Hook A:** frame 0 = a long YouTube lecture shrinking into a deck of flashcards. Text: **"2 HOURS → 2 MINUTES"**.
- **Hook B:** (to camera) "I stopped rewatching lectures."
- **Beats:**
  1. Paste the lecture link or PDF into a tool that reads sources (verify which, e.g. NotebookLM).
  2. Ask for flashcards and a quiz.
  3. Quiz yourself.
  4. **Catch:** check facts against the source.
  5. **Share line:** "Send this to your study group."
  6. End card.
- **Visuals:** real screen recording; flashcards flipping (Blender or CSS 3D); a timer counter.
- **Verify:** the tool's current features and free availability in India, on its official page, the same day.

### Reel 8: "Every AI that's free in India right now (save this)"
- **Theme:** a reference list worth saving. **Length:** about 30 s. **Keyword:** FREE → the full table as a DM, updated monthly.
- **Hook A:** frame 0 = a ticket-style board of logos with "₹0" stamps slamming down. Text: **"STOP PAYING FOR THESE"**.
- **Hook B:** (to camera) "You're paying for AI you can get free."
- **Beats:** 4–5 rows, each showing the tool, what's free and the limit. One honest "catch" row. **Share line:** "Send this to the friend paying for 3 subscriptions." End card.
- **Visuals:** a bespoke comparison board (the reel's centrepiece), logos used only to identify the products, ₹ stamps.
- **Verify:** every row on its official pricing page **on the day of the build**, plus any India-specific offers (telecom bundles, student plans) on the vendor's or operator's own page. Drop any row you can't verify.
- **Why it works:** the most save-worthy format ("save this"), and very local to India.

### Reel 9: "Practise your interview with AI — it plays the tough interviewer"
- **Theme:** use it today (job seekers; follows reel 3). **Length:** about 30 s. **Keyword:** HIRED → the interviewer prompt plus a scoring rubric.
- **Hook A:** (to camera, nervous then confident) "I failed this interview question 3 times. Then I practised with AI."
- **Hook B:** frame 0 = a voice-mode waveform asking "Tell me about a time you failed."
- **Beats:**
  1. Voice mode with the prompt "Be a strict interviewer for a <role>. One question at a time. Score my answer out of 10 and tell me what to fix."
  2. A live answer.
  3. Feedback.
  4. Retry.
  5. **Share line:** "Send this to someone with an interview this week."
  6. End card.
- **Visuals:** real voice-mode screen recording; a score ring; your face carrying the emotional arc.
- **Verify:** voice-mode availability on the free plan in India.

### Reel 10: decided by the data
- **Reserved slot:** a **part 2 of whichever reel 1–9 got the most shares per reach**, or the next trend that is *usable today* from a fresh `trends.md` pull.
- Use the winning hook style, voice and length, and use whatever the comments on the winner asked for. Pin a comment on the winner saying "Part 2 coming", which gives people a reason to come back.

**Pillar mix:** 6 "use it today" (2, 3, 6, 7, 9, plus 5, which is also timely), 2 "protect yourself" (1, 4), 1 reference list worth saving (8), 1 data-driven sequel (10). No pure company news.

---

## Part 4: Production standard for every reel

**Script:**
- 55–85 spoken words.
- Hook ≤12 words, starting with "you", "your", or a surprising result.
- Short sentences and contractions; one stressed word per sentence.
- Payoff by 15 s; share line at about 70%; one catch (honesty).
- No line that only restates the previous one.

**First 3 seconds (checked before building):**
- Frame 0 shows a face or the result.
- ≤6 words on screen.
- Voice starts at 0.0 s.
- Something moves by 0.5 s.
- First fact by 1.5 s.
- No logo, title card or fade-in.

**Pacing:** a visual change every 1.5–2.5 s, and no static hold longer than 3 s except the end card.

**Safe zones:** content only inside x 150–918 and y 150–1290. Captions in y 1338–1490. Nothing below 1536.

**Sound:**
- Voice is clean and dry, with warmth around 130 Hz and presence around 3 kHz.
- Music is present but under the voice (median about 14–16 dB below).
- A hit on the hook word; SFX on each step.
- The end matches the start so the reel loops.

**Proof:**
- Real screen recordings, labelled with the date.
- AI images labelled "AI IMAGE".
- Unverified claims are cut, not hedged.

**Deliverables:**
- MP4 at 1080×1920, 60 fps.
- Grid-first cover in the series layout.
- `caption.md`: 300–700 characters, keyword CTA on line 1, 3–5 hashtags.
- `dm-prompt.md`: the keyword payoff.

**QA:** `check.mjs` plus contact sheets plus frames inside every cut, as now. Add two new lint checks:
1. Runtime ≤ 35 s.
2. ≤ 6 words visible at t = 0–1.5 s.

---

## Part 5: Posting and distribution

- **Cadence:**
  - One reel every 2 days, at the same time each time.
  - Start at 19:30 IST (an evening scroll slot in India).
  - Move to the best slot once you pass 100 followers, when Instagram starts showing active-hour data.
  - Ten reels take about 3 weeks.
- **Before posting:**
  - Check Account Status (recommendation eligibility).
  - Set up the DM delivery for the keyword (ManyChat or manual).
  - Use Trial Reels for Hook B if your account is eligible (check in the app).
- **In the first hour:**
  - Reply to every comment with a real reply (each counts as a comment, and the thread signals conversation).
  - Share the reel to your Story with a poll sticker.
  - DM it to 5–10 people who would actually use it. Do not mass-DM.
- **First 100 followers from outside Instagram:**
  - Post each reel on LinkedIn (you already have reach there with the GIFs) and YouTube Shorts on the same day.
  - Share it in relevant WhatsApp or college groups only where it really helps people.
  - Leave useful comments on 3 bigger AI creators' reels each day.
- **Collab:** after reel 4, invite one Indian AI or tech creator of similar size to a Collab reel. A collab is shown to both accounts' audiences.
- **Profile:**
  - Bio: "One AI trick you can use today · 30 sec · India 🇮🇳". Add a link to a free resource page (the DM payoffs in one place).
  - Pin your 3 best reels, refreshing as winners change.
  - Keep a Highlight called "Free AI tools".
- **Stop:**
  - Carousels, until reels clear the targets below.
  - More than 5 hashtags.
  - Two posts on the same day.

---

## Part 6: Tests and decision rules

| Reels | What's tested | Variants |
|---|---|---|
| 1 vs 2 | Face + real voice vs no face + cloned voice | F1 vs C |
| 3 | Face hook + cloned demo voice | F2 |
| 4 | Confirm the winner of 1–3 | best |
| 5–9 | Hook type: question vs result-first vs confession, rotated, everything else held | — |
| 10 | Sequel to the best reel by shares/reach | — |

**Measured 48 h after each post** (`python3 scripts/ig_insights.py report`, after a fresh Grok pull):

| Metric | Current median | Target by reel 4 | Target by reel 10 |
|---|---|---|---|
| Skipped in first 3 s | 75% | < 65% | < 50% |
| Average watch, % of runtime | about 7% | > 30% | > 45% |
| Shares per 100 reached | 0 | ≥ 0.5 | ≥ 1.5 |
| Saves per 100 reached | 0.3 | ≥ 1 | ≥ 2 |
| Keyword comments per reel | 0 | ≥ 3 | ≥ 15 |
| Plays per reel | about 200 | one reel > 1,000 | one reel > 5,000 |
| Followers | 6 | 30 | 150+ |

**Decision rules:**
- **Keep** a format choice once it wins on skip rate *and* average watch % in 2 reels.
- **Kill** a topic type after 2 reels under 1× your median plays with 0 shares.
- **Double down:** any reel at 3× the median plays gets a part 2 within 4 days.
- **Change one variable at a time.** Record every variant in `insights/reel-tags.json`:
  - Existing fields: `genre`, `company`, `voice`, `host`, `length`, `cta`.
  - New fields: `face_hook`, `hook_type`, `series`.

---

## Part 7: Repo changes needed (with your OK)

1. **CLAUDE.md:** replace the "new visual identity every reel" rule for `Use It Today` reels. Each reel keeps a fixed series frame (opening, badge, end card, palette base), and visual variety lives inside the demo. The rule stays as written for any one-off reel outside the series.
2. **Shared series shell:** add `series/use-it-today/` with:
   - the opening, badge and end-card components
   - caption styles
   - a template for `check.mjs` that adds the ≤35 s runtime check and the ≤6-words-at-start check
3. **Filmed footage:** you record the hook (5–10 takes, 1080×1920, 30 or 60 fps) and the screen captures on your phone. The pipeline will:
   - transcode them to VP9 and seek them per frame (the same approach as the host videos)
   - add a quick dereverb and EQ pass on your recorded voice
4. **Insights:** extend `scripts/ig_insights.py report` with completion %, shares per 100 reached, keyword comments, and the new tags.
5. **Production effort:** spend it on the script, the hook and real proof, not on heavy 3D. A reel every 2 days needs 1–2 asset families done well, not 10. Use Blender, mocap and image generation only when a beat clearly needs them.

## What I need from you to start
- **Hook takes:** reels 1, 3 and 4 need you on camera (about 2 minutes of filming per reel).
- **Screen recordings:** reels 2–9 need real screen recordings, ideally on the free ChatGPT plan, from your phone or laptop.
- **Approvals:** OK on the series name and on the CLAUDE.md rule change.
- **DM delivery:** ManyChat set up for the keywords, or sending them by hand.

---

## Revision (13 Oct): only Claude and Grok subscriptions, and what "filming" means

**Which tool each reel uses.** Screen recordings come from the Claude and Grok apps you pay for. ChatGPT is optional; a free account works if a reel needs it.

| Reel | Tool | Change |
|---|---|---|
| 1 Safe word | none (your face plus built visuals) | — |
| 2 Ask-me-questions | Claude (Grok as a second demo) | The prompt works in any chat AI. Title changes to "Make AI ask YOU questions first". |
| 3 Resume check | Claude (attach the resume PDF) | — |
| 4 Memory privacy | Claude memory settings, plus Grok's if it has them | Verify each app's memory and incognito settings on the day. Title changes to "Your AI remembers you. Here's where." |
| 5 Calculator builder | **Claude artifacts** ("make me an EMI calculator" gives a working interactive tool) | Replaces the GPT-6 Intelligent UI demo. |
| 6 Sounding like AI | Claude | — |
| 7 Lecture → flashcards | Claude (lecture PDF or transcript → flashcards plus a quiz artifact) | Verify whether Claude can read a YouTube link directly. If not, use the transcript or slides. |
| 8 Free AI in India | none (a built comparison board) | Verify each row on its official page. |
| 9 Interview practice | Claude voice mode or Grok voice mode, whichever handles it better | Verify voice mode availability on the day. |

**Filming: what "about 2 minutes" means.** Only the **hook**, the first 2–3 seconds of the reel, where you say the opening line to camera.
- **What you say:** the hook line of that reel, e.g. reel 1: *"If 'I' call you crying for money… ask me this one question."*
- **How:**
  - Phone held vertically at eye level, face filling the top half of the frame, eyes on the lens.
  - Face a window for light.
  - Record in a room with curtains, a bed or a sofa (less echo).
  - Leave a 1-second pause before and after the line.
  - Say it 5–8 times, varying energy (calm, urgent, smiling). Recording all the takes takes about 2 minutes.
- **Send:** the raw video file(s). I pick the best take, trim it, clean the audio, and build the rest of the reel around it.
- **Optional:** a 2-second reaction shot (a nod or "see?") for the end card.
- **If you'd rather not film:** use your avatar tool for the hook, or open with the result itself (e.g. the finished EMI calculator). We lose the "real person" test, but the reel still works.

**Screen recordings:** use the phone's built-in screen recorder while you do the task in the Claude or Grok app. Follow a short step list I'll give you for each reel. Record a few seconds before and after each step.

## Revision 2 (13 Oct): no filming. Your AI avatar hosts instead
- **Hooks:** every "face hook" (reels 1, 3, 4, and any others that open on a face) uses your avatar clip in place of filmed video:
  - full frame for the first ~2 s
  - then a corner circle while the demo plays
  - The avatar speaks the whole reel (2 parts × 15 s), so the voice stays one voice.
- **Prompts:** follow `AVATAR-PROMPT-TEMPLATE.md` and pass `scripts/check-avatar-prompts.py` with 0 FAIL. Always deliver Part 1 first for review.
- **Test matrix, updated:**
  - **Variant A:** avatar face plus avatar voice (reels 1, 3, 4).
  - **Variant C:** no face, Qwen cloned voice (reel 2).
  - Reels 5–9 use whichever wins on skip rate and average watch %.
- **Screen recordings:** demos in the Claude and Grok apps still need your phone's screen recorder (no camera, no face). I'll give you a short step list for each reel.
- **Reel 1** is ready to generate: `reel-uit-safe-word/avatar-prompts.md`.

## Revision 3 (13 Oct): polish bar = `reel-ai-trading-pipeline`
The creator set the trading-pipeline reel as the **minimum** visual standard (see the CLAUDE.md standing rule). The Use It Today shell adopts its craft grammar:
- graphite ground and a meaning-coded accent system
- a signature through-line object that match-cuts every scene (per reel: a cable, an ink line, a thread)
- a Blender centrepiece that changes state
- typed interface panes, a mono eyebrow, a colour-blocked headline, a chip row, a source line and a colour-coded step tracker
- the avatar tile in a corner when there's a host
- a recap card, then the end card

The series badge, end card and caption style stay fixed across reels.
The first flat mockup (cards on black) is replaced by one built to this bar.
