# "I was asleep when Claude wrote this." — the 7 a.m. brief (tutorial reel, no avatar, ~60 s)

**Genre:** tutorial / how-to (standing rule).
**Promise to the viewer:** in four steps, Claude reads your Gmail and Google Calendar every weekday at 7 a.m. and leaves you a short brief: your meetings, the emails that need you, and anything you promised someone.

**Why this topic:**
- It's the natural next step after `reel-teach-a-skill`. Last time Claude learned a task; this time it does the task on a schedule without being asked.
- The payoff is visible on screen: a finished brief.
- The setup is four steps the viewer can copy tonight.

## Facts (tier A: read first-hand today, 12 Oct 2026)
**Claude Help Center, "Schedule recurring tasks in Claude Cowork"** (support.claude.com/en/articles/13854387):
1. Scheduled tasks are available on **paid plans (Pro, Max, Team, Enterprise)**.
2. **Create with Claude:** describe the task and how often it should run, answer Claude's questions, review the proposed name, schedule and instructions, then click **"Schedule"**.
   - In Cowork the path is: "Scheduled" in the left sidebar → "New task" → "Create with Claude".
   - In the new Claude experience (since 6 Oct; Pro and Max), you just describe it in the chat.
3. **Set up manually:** the "Create scheduled task" modal has these fields:
   - Task name;
   - Prompt;
   - Approval mode;
   - **Frequency: hourly, daily, weekly, on weekdays, or manually**;
   - Model (optional);
   - Folder (optional).
4. **"Tasks run remotely, so they run on schedule even when your computer is asleep or the Claude Desktop app is closed."** Tasks that need local files or apps run only locally.
5. **"Each run is its own Cowork session"**; you review the results there when they're ready. The article does not describe notifications, so we never say it "texts" or "pings" you.
6. Tasks can use the connectors you've set up.
7. Under "Scheduled" you can:
   - view tasks;
   - see upcoming and past runs;
   - edit instructions or cadence;
   - pause and resume;
   - delete;
   - run on demand.
8. On Team and Enterprise, admins control Cowork access.

**Claude Help Center, "Use Google Workspace connectors"** (support.claude.com/en/articles/10166901):
9. Gmail, Google Calendar and Google Drive connectors are available for all users on Claude and Claude Desktop. On Team and Enterprise plans, an Owner or Primary Owner must enable them first.
10. **Gmail can:**
    - search and read emails;
    - **draft emails**;
    - send, reply and forward;
    - manage labels and threads;
    - list saved drafts.
    **It cannot access attachment content** (metadata only).
11. **Calendar can:**
    - view events, including shared calendars;
    - create, update and delete events;
    - find mutual availability;
    - respond to invitations.
12. **Sending, replying to and forwarding email "require your explicit approval by default."** On Team and Enterprise, owners decide whether members can skip that.
13. **Claude can only access the data of the one Google account you connected.**
14. Reconnect path: **"Customize > Connectors"**. Claude also redirects you to Google to sign in when a request needs it.
15. **Privacy:**
    - Anthropic does not train on Gmail, Drive or Calendar connector data.
    - Retrieved data is kept with its chat and deleted when you delete the chat.

**Don't say (C):**
- that it notifies or texts you;
- a setup time ("2 minutes");
- that it can read attachments;
- that it works on free plans;
- that it auto-sends replies;
- that it handles several Google accounts.

**Creator check before posting:** the menu label in your own app ("Customize → Connectors" is the Help Center's wording).

## Benchmark to beat: `reel-teach-a-skill` (Card Catalogue)
**Its weaknesses:**
1. The mocap robot read as a crude stick figure.
2. Every cut dipped through a dark, near-empty frame.
3. The jar scene was sparse until its words arrived.
4. The hook frame was a messy pile of overlapping bubbles.
5. It finished at −14.6 LUFS, not −14.
6. The palette was dark all the way through.

**This reel does what none did before:**
1. **A reel-long wall clock drives the whole look.** One function maps `t` to a time of day, 6:58 → 8:00 a.m. The sky gradient, light direction, window glow and shadows all follow it, so the reel visibly goes from pre-dawn indigo to bright morning. It's the first reel whose palette changes across its runtime, and the first bright second half.
2. **A Blender bedroom diorama rendered in four lighting states** (night, blue hour, sunrise, morning) and cross-faded on the clock. The same set is lit four ways, so the change reads as time passing, not as a cut.
3. **A better mocap character.** A "night-shift mail sorter" robot with a rounded shell, a mail satchel and a proper hand. It carries envelopes into three trays (MEETINGS / NEEDS ME / PROMISES), driven by the CMU walk plus an IK carry. It's built to fix the stick-figure complaint.
4. **The brief is a real object:** the "7 a.m. Edition", a folded morning paper whose columns are the three sections. It's laid out in step 2, printed in step 4 and becomes the recap card.
5. **Cuts:** a sunrise wipe. A soft horizontal band of warm light sweeps up the frame, and the next scene is revealed under it. No dark dip and no double exposure.
6. **Hook frame 0 is composed and calm:** the dark bedroom, a clock at 6:59 and the brief card already half typed. The payoff (7:00, card complete) lands by 2.6 s.

## Voice-over (the creator's cloned voice, same OmniVoice refs as `reel-teach-a-skill`; 11 lines; 157 words, ~62 s)
1. (hook, a touch faster) "I was asleep when Claude wrote this."
2. "It read my inbox and calendar, and it runs every weekday at seven. Here's the setup."
3. "Step one. Connect Gmail and Google Calendar. In Claude, that's Customize, then Connectors."
4. "Step two. Write the brief like you'd brief a person: today's meetings, emails that need me, and anything I promised someone."
5. "Three sections, five lines each, and skip the newsletters."
6. "Step three. Tell Claude: every weekday at seven, run this. Answer its questions, then hit Schedule."
7. "It runs in the cloud, so your laptop can sleep too."
8. "Step four. Read it with your coffee. Every run waits for you as its own session."
9. "The clever part? Ask it to draft your replies. Sending still waits for your okay."
10. (slower) "The catch. Scheduling needs a paid plan. It sees one Google account. It can't open attachments. And on work accounts, your admin has to switch it on."
11. (warm) "Save this, and follow for more."

**Claim check per line:**
- 2: facts 2, 3 (weekdays is a listed frequency), 6.
- 3: facts 9, 14.
- 4–5: the prompt is our example; facts 10–11 cover what it can read.
- 6: facts 2, 3.
- 7: fact 4.
- 8: fact 5.
- 9: facts 10, 12 ("by default"; the caption carries the nuance).
- 10: facts 1, 13, 10, 8 and 9.

**Spoken forms:**
- "Gmail" → "G-mail".
- "7" → "seven".
- No URLs or menu arrows are spoken.

## The first 3 seconds (hook design)
- **0.0 s, frame 0:** the dark bedroom diorama (night state). An alarm clock reads 6:59. On the nightstand, the "7 a.m. EDITION" card is already half typed: "3 MEETINGS ·" is visible and "2 NEED A REPLY" is typing. The caption "I was asleep" is already on screen. The voice starts at 0.0.
- **1.6 s:** on "Claude", the Anthropic mark stamps onto the card's byline: "WRITTEN BY CLAUDE · 6:59 AM".
- **2.4 s:** the clock flips to 7:00 and the window's first light warms the room. The card finishes: "1 THING YOU PROMISED". A soft chime plays.
- **No cut before 3.2 s.** One question carries the viewer forward: how?

## Screenplay
**Family codes:**
- A: photoreal AI still + depth parallax
- B: Blender 3D
- C: mocap rig
- D: humaaans
- E: logos/icons
- F: bespoke SVG/DOM objects
- G: kinetic type
- H: real-footage overlay
- I: real Unsplash photo
- K: audio

Times are estimates and will be retimed from the voice.

| # | Time | Primary visual | Layers keyed to words | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|
| 1 | 0–3.2 | **Blender bedroom diorama, night → first light** (lighting states cross-faded on the clock) | Brief card types itself; Anthropic byline stamp; clock 6:59→7:00 | 7 A.M. EDITION · 3 MEETINGS · 2 NEED A REPLY · 1 THING YOU PROMISED | — (hook) | B F G K |
| 2 | 3.2–8.0 | **The night shift:** mocap mail-sorter robot carries envelopes from an inbox chute into 3 trays; calendar pages flip on a spike | Gmail (mail icon + name chip) and Google Calendar mark (nominative) on the chute and spike; tracker drops in on "setup" | MEETINGS · NEEDS ME · PROMISES | // WHILE YOU SLEEP | C E F |
| 3 | 8.0–13.0 | **Two plugs into one socket:** Gmail and Calendar cards slide in and lock with a green LED each | Path chip **Customize → Connectors** (held ≥ 2 s); "GMAIL: READ · SEARCH · DRAFT", "CALENDAR: EVENTS · INVITES" | 1 · CONNECT TWO APPS | // STEP 1 · GMAIL + CALENDAR | E F G |
| 4 | 13.0–21.5 | **Laying out the edition:** a newspaper dummy page gets three column heads as they're spoken; the brief prompt types in big and holds ≥ 2 s | Prompt: "Every weekday: my meetings today, emails that need me, anything I promised. 3 sections, 5 lines each. Skip newsletters." · a "NEWSLETTERS" strip is crossed out on "skip" | 2 · WRITE THE BRIEF | // STEP 2 · THREE COLUMNS, FIVE LINES | F G K |
| 5 | 21.5–28.0 | **Blender alarm clock** (turntable frames scrubbed by `t`); the hand sweeps to 7:00 | Frequency selector: HOURLY · DAILY · WEEKLY · **WEEKDAYS ✓** · MANUALLY; a "Schedule" button presses on "Schedule" | 3 · SCHEDULE IT | // STEP 3 · WEEKDAYS AT 7:00 | B F G |
| 6 | 28.0–31.5 | **Photoreal nightstand, closed laptop in moonlight** (AI still + depth parallax) | A small cloud badge "RUNNING REMOTELY" with a progress ring; "AI IMAGE" tag | YOUR LAPTOP CAN SLEEP | // RUNS IN THE CLOUD | A F H |
| 7 | 31.5–37.0 | **Real Unsplash latte (top-down)**; the 7 a.m. Edition unfolds beside the cup; sunlight + light leak | Session list MON · TUE · WED stacking ("each run = its own session"); tracker 4/4 | 4 · READ IT WITH COFFEE | // STEP 4 · YOUR 7 A.M. EDITION | I F H |
| 8 | 37.0–42.5 | **humaaans figure** (standing pose, coffee) reviews two draft envelopes; a Gmail "Drafts 2" counter | SEND button locked: "WAITS FOR YOUR OK" padlock; it unlocks only on a tap | DRAFTS, NOT SENDS | // REPLIES ALREADY WRITTEN | D F E |
| 9 | 42.5–52.5 | **Four torn calendar pages pinned to a board**, one per catch | PAID PLANS: PRO · MAX · TEAM · ENTERPRISE / ONE GOOGLE ACCOUNT / ATTACHMENTS: NAME ONLY / WORK ACCOUNTS: ADMIN SWITCHES IT ON | THE CATCH | // BEFORE YOU SET IT UP | F G E |
| 10 | 52.5–end | **Recap: the full 7 A.M. EDITION front page** (save-worthy, ≥ 2.5 s): 4 numbered steps + the prompt | **CTA:** profile ring + @sandesh.explains + SAVE + FOLLOW (≥ 3 s); morning light leak | SAVE THIS · FOLLOW FOR MORE | (none: CTA) | F G H K |

**Asset-mix audit:**
- Families used: **10** (A, B, C, D, E, F, G, H, I, K).
- Primary visual by scene: B · C · F · F · B · A · I · D · F · F. Neighbours 3/4 and 9/10 share F with different objects (a socket vs a newspaper dummy, pinned pages vs a front page).
- Every scene has ≥ 3 families, and no family is primary in more than 4 scenes.

## Visual identity: "Dawn Edition" (checked against every prior reel)
- **Palette:** the background changes with the clock: **night indigo `#141b3a` → blue hour `#3b3f7a` → dawn peach `#ffb38a` → morning cream `#fff4e6`**. The fixed accents are:
  - **sunrise coral `#ff5a3c`** (time, schedule);
  - **sky blue `#4a9dff`** (mail);
  - **leaf green `#2fae7a`** (connected, done);
  - **newsprint ink `#1d1d24`**.
  No prior reel changes palette over its runtime, and none has used a cream morning ground.
- **Texture / motion language:**
  - light, not pattern: a moving window-light parallelogram and long soft shadows that rotate with the clock;
  - dust in the sunbeam;
  - paper grain on the edition.
  No grids, cables, dots or wood grain.
- **Component language:**
  - folded newsprint (column rules, masthead, datelines);
  - envelopes and trays;
  - a plug and socket;
  - an alarm clock;
  - torn calendar pages;
  - a padlocked send button.
- **Typography (new to reels):**
  - **Newsreader** (display serif, 600–800, with italic accents; a masthead feel that stays legible);
  - **Red Hat Mono** (datelines, paths, the prompt);
  - **Inter** (captions);
  - cover in **Anton**.
  Both new fonts vendored via `@fontsource` (OFL).
- **Characters:**
  - the mocap mail-sorter robot (new rounded skin with a satchel; not the previous reel's brass stick figure);
  - one humaaans standing pose with a mug (a pose not used before; checked at mockup).
- **Cover (grid-first, ≤ 5 words):**
  - options: **"CLAUDE WRITES MY MORNINGS"**, **"MY AI WAKES UP FIRST"** or **"7 A.M. BRIEF, AUTOMATIC"**;
  - hero: the alarm clock at 7:00 beside the folded edition;
  - bright peach ground.

## Audio plan
- **Score:** a "sunrise" cue that grows with the light:
  - a soft music-box ostinato in the dark hook;
  - then mallets + brushed shaker as the night shift sorts mail;
  - then acoustic-guitar-like plucks and a warm pad as morning arrives;
  - a single low drone under the catch;
  - a bright resolve under the CTA.
  Beat-locked cuts.
- **SFX:**
  - clock tick and a soft alarm chime at 7:00;
  - envelope swishes and tray drops;
  - plug clicks and LED blips;
  - typing;
  - paper unfold;
  - a padlock click;
  - pins into a cork board.
  Peak-aligned.
- **Targets:**
  - voice over music + SFX: median ≥ 19 dB, min ≥ 11 dB;
  - **−14.0 LUFS** (fix the last reel's −14.6 with the make-up stage), ≤ −1 dBTP;
  - a mix report.

## Honesty guardrails
- The brief, chat and app screens are recreated generically and labelled ILLUSTRATIVE; they are not real screenshots.
- The example brief contains invented, generic items only (no real names or emails).
- Logos are used nominatively (Google Calendar, Anthropic); Gmail appears as a mail icon + name chip (there's no Gmail logo in the library).
- The photoreal nightstand is labelled AI IMAGE; the latte is a real Unsplash photo.
- The caption says:
  - it's about Claude's own feature and was made with Claude;
  - sending needs approval by default;
  - Team and Enterprise admins set the rules.

## Decisions for the creator
1. **Voice:** your cloned voice again (same pipeline as the last reel)? I can generate the 11 lines as soon as you say yes.
2. **Menu wording:** does your Claude app show "Customize → Connectors"? If it differs, tell me what it says.
3. **Next step:** a mockup of scenes 1, 2 and 5 (Blender bedroom hook, mocap mail sorter, Blender alarm clock + frequency selector). That's three families, plus one bright-morning scene (7) to show the palette shift.
