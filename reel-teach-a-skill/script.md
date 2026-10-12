# "Stop re-explaining. Teach it once." Build your own Claude Skill in 4 steps (tutorial reel, no avatar, ~64 s)

**Logline:** you keep pasting the same instructions into AI. A **Skill** is a small instruction file Claude pulls out only when it's needed. In four steps, with no code:
1. Pick a task you repeat.
2. Ask Claude to build the skill (format, tone, one example).
3. Save it and switch it on.
4. Test it in a new chat.

Then the clever part (it costs ~100 tokens until used), the catches, and a save-worthy recap.

**Format:** tutorial / how-to (standing rule):
- a step tracker throughout;
- every prompt and path typed big and held ≥ 2 s;
- an honest catches beat;
- a recap card held ≥ 2.5 s;
- CTA = Save + Follow.

**No avatar:**
- The voice is Kokoro `am_michael`, base speed 1.08 and the hook at 1.12, with sentence-level synthesis, no fillers, and word timestamps driving captions and cues.
- The CTA still shows the profile photo + @sandesh.explains.

## Facts (tier A: read first-hand today, 12 Oct 2026)
**Agent Skills overview** (platform.claude.com/docs/en/agents-and-tools/agent-skills/overview):
1. "Skills are reusable, filesystem-based resources that give Claude domain-specific expertise." "Unlike prompts… Skills load on demand."
2. **Every Skill needs a `SKILL.md` with YAML frontmatter:**
   - **`name`**: max 64 characters; lowercase letters, numbers and hyphens; can't contain "anthropic" or "claude".
   - **`description`**: non-empty, max 1024 characters. It "must include both what the Skill does and when Claude should use it".
3. **Progressive disclosure:**
   - Level 1, metadata: **~100 tokens per Skill**, always loaded.
   - Level 2, instructions: **under 5k tokens**, loaded when triggered.
   - Level 3, files/scripts: **no tokens until accessed**, and a script's code never enters context.
   - "you can install many Skills without context penalty".
4. **Pre-built skills:** PowerPoint, Excel, Word and PDF.
5. **Custom skills don't sync across surfaces.** claude.ai, the API and Claude Code are separate. claude.ai skills are individual to each user.
6. **Security:** use skills only from trusted sources. "a malicious Skill can direct Claude to invoke tools or execute code in ways that don't match the Skill's stated purpose."

**Claude Help Center, "How to create custom Skills":**
7. Code execution must be enabled.
8. Upload a ZIP whose root is the skill folder. Upload and turn it on in **Customize > Skills**.
9. Help Center limits: `name` 64 characters, **`description` 200 characters** (stricter than the API's 1,024; on screen we say "one or two sentences").
10. Testing: try several prompts, and check Claude's thinking to confirm it loads the skill; revise the description if it doesn't trigger.
11. Tips:
    - keep each skill to one workflow;
    - include example inputs and outputs;
    - **don't hardcode API keys or passwords**;
    - review downloaded skills before enabling them.

**Anthropic Academy, "Teach Claude your way of working using Skills":**
12. **You can create a skill by conversation:** describe the task, and "Claude will build and structure it into a properly formatted skill file." Include three things: **format, tone, and one example**.
13. Its sample request: "Create a skill for my weekly team update". Format: wins, blockers, priorities, max 3 bullets each. Tone: "direct and factual, written for my manager to skim". Plus one pasted example.
14. **Test** in a new conversation: look for **"Reading [your skill's name]"** in Claude's thinking. If it's missing, adjust the name or description.

**Claude Code** (code.claude.com/docs/en/skills):
15. Personal skills: `~/.claude/skills/<skill-name>/SKILL.md`; project skills: `.claude/skills/<skill-name>/SKILL.md`.
16. Invoke automatically when relevant, or type `/skill-name`.
17. Keep `SKILL.md` under 500 lines.

**Inconsistency to handle:**
- The settings path differs between pages: Help Center "Customize > Skills"; Academy "Settings > Capabilities > Skills"; platform docs "Settings > Features".
- Plan wording also differs (the Help Center lists Free; the overview says Pro/Max/Team/Enterprise).
- **On screen (creator decision, 12 Oct):** the chip reads **"Skills settings"**, matching the voice line. No plan claims; say only "needs code execution on".

**Don't say (C):**
- that skills work on every plan;
- that they sync across apps;
- any speed or quality gain (none is published);
- "no limits".

## Benchmark to beat (standing rule)
The last two scripts:
- `reel-ai-trading-pipeline` (70 s, 11 families, cable match cuts, a Blender rack);
- `reel-robot-brain` (not built yet; IK arms + robot-POV HUD).

**Trading reel weaknesses:**
1. 70 s is long.
2. An abstract metaphor (rack and cables) that needed narration.
3. Blender state swaps instead of motion.
4. Commands appeared as plain terminal panes.

**This reel does what none did before:**
1. **A metaphor everyone already knows: a library card catalogue.**
   - Each skill is an index card in a drawer.
   - The brass **label plate** is the `name` + `description`, always visible (~100 tokens).
   - The **card** is the instructions, pulled only when a matching request comes in.
   - The **envelope stapled to the card** holds scripts and files, opened only if needed.
   That is progressive disclosure as a physical object.
2. **A Blender card-catalogue cabinet with moving drawers.** A procedural walnut cabinet with 24 brass-plated drawers. Frame sequences per drawer (slide out, card lifts, slide back) are scrubbed by `t`. It's the first 3D set in the repo whose parts move independently on cue.
3. **A live "context window" meter**, a jar that only fills when a card is pulled. Viewers *see* that unused skills cost ~nothing (100-token sliver vs < 5k when loaded). It's a new data object built from the docs' own token table.
4. **The SKILL.md written live on a typewriter card.** Frontmatter keys type out, a ruler checks `name` ≤ 64 / lowercase-hyphen and the description "what + when". Held ≥ 2.5 s for screenshots.
5. **The real test signal on screen:** a mock thinking strip showing "Reading weekly-team-update…" (labelled ILLUSTRATIVE), as the Academy describes.

## Voice-over (the creator's cloned voice, OmniVoice zero-shot from their own 15 s recording; 11 lines; ~164 words, ~64 s)
1. (hook, 1.12) "You keep explaining the same thing to AI. Teach it once instead."
2. "A skill is a small instruction file Claude pulls out only when needed. Four steps."
3. "Step one. Pick a task you've explained more than twice, like your weekly update."
4. "Step two. Ask Claude: create a skill for my weekly team update. Add the format, the tone, and one example you liked."
5. "Claude writes the skill file. A short name, and a description of what it does, and when."
6. "Step three. Save it, and switch it on in Skills settings. In Claude Code, it's just a folder."
7. "Step four. Test it in a new chat. If Claude doesn't pick it up, sharpen the description."
8. "The clever part? Until it's needed, a skill costs about a hundred tokens. So keep dozens."
9. (slower, 1.0) "The catch. Code execution must be on. Skills don't sync between apps. And only install ones you trust. They can run code."
10. "Never put passwords in one."
11. (warm) "Save this, and follow for more."

**Claim check per line:**
- 2: facts 1, 3.
- 3: fact 12 ("a task you've explained more than once"; we say "more than twice").
- 4: facts 12–13 (format, tone, one example).
- 5: facts 2, 12.
- 6: facts 8, 15.
- 7: facts 10, 14.
- 8: fact 3 (~100 tokens per skill; "without context penalty").
- 9: facts 5, 6, 7.
- 10: fact 11.

**TTS spoken forms:**
- "AI" → "A I".
- "Claude Code" as written.
- "SKILL.md" is never spoken (screen only).
- `~/.claude/skills/` is screen only.

## Screenplay
Family codes:
- A: photoreal AI still + depth parallax
- B: Blender 3D
- C: mocap rig
- D: humaaans
- E: logos/icons
- F: bespoke SVG/DOM objects
- G: kinetic type
- H: real-footage overlays
- I: real Unsplash photo
- K: audio

Times are estimates (≈ 2.55 words/s) and will be retimed from the TTS word timestamps.

| # | Time | Primary visual | Layers (pure functions of `t`, keyed to words) | SFX | On-screen words | Eyebrow | Families |
|---|---|---|---|---|---|---|---|
| 1 | 0–3.0 | **Frame 0 composed:** a humaaans figure at a laptop with **the same instruction bubble pasted 4 times** (stacked copies, a "×4" counter ticking on "again") | The stack topples into one index card on "Teach it once" | paste clicks ×4, card flick | TEACH IT ONCE | — (hook frame) | D F G K |
| 2 | 3.0–7.0 | **Blender card catalogue reveal:** the camera glides down a walnut cabinet with 24 brass-plated drawers | One drawer slides out; a card lifts; the label reads "SKILL"; step tracker 1·2·3·4 drops in | drawer slide, brass clink | A SKILL = AN INSTRUCTION CARD | // WHAT A SKILL IS | B F G |
| 3 | 7.0–10.8 | **Photoreal desk** (AI still, no people: a notebook with "weekly update" written three times, a coffee, a laptop) with parallax | Tracker 1/4; a "REPEATED ×3" stamp on the notebook | stamp | 1 · PICK A TASK YOU REPEAT | // STEP 1 · THE TASK | A F G H |
| 4 | 10.8–16.8 | **Chat composer, typed big and held ≥ 2 s:** "Create a skill for my weekly team update." Then three attachment chips type in: **FORMAT** (wins · blockers · priorities, ≤ 3 bullets) · **TONE** ("direct, for my manager to skim") · **EXAMPLE** (a pasted update) | Tracker 2/4; Claude mark (nominative); source chip "Anthropic Academy example" | typing, chip pops ×3 | 2 · ASK CLAUDE TO BUILD IT | // STEP 2 · FORMAT, TONE, EXAMPLE | F E G |
| 5 | 16.8–22.0 | **Typewriter index card:** the SKILL.md types itself: `---` / `name: weekly-team-update` / `description: Drafts my weekly update (wins, blockers, priorities). Use when I ask for my team update.` / `---` / `## Instructions…` | A brass ruler slides under `name` (✓ ≤ 64 · ✓ lowercase-hyphens); two highlighter marks on the description: WHAT ✓ WHEN ✓; held ≥ 2.5 s | typewriter keys, bell | NAME + DESCRIPTION (WHAT + WHEN) | // THE CARD CLAUDE WRITES | F G K |
| 6 | 22.0–27.8 | **The card filed:** Blender drawer opens, the new card drops in, the drawer closes; the brass plate engraves "weekly-team-update" | Two paths on screen: **APP:** Skills settings · toggle ON / **CLAUDE CODE:** `~/.claude/skills/weekly-team-update/SKILL.md` (held ≥ 2 s); tracker 3/4 | drawer thunk, toggle click | 3 · SAVE IT, SWITCH IT ON | // STEP 3 · FILE THE CARD | B F G |
| 7 | 27.8–33.0 | **Mocap "librarian" robot** (CMU walk + reach) answers a new-chat request "draft this week's update from these notes": it walks to the cabinet and pulls the right card | A thinking strip types "Reading weekly-team-update…" (ILLUSTRATIVE); the output card matches the example ✓; a fallback chip: "NOT TRIGGERED? SHARPEN THE DESCRIPTION"; tracker 4/4 | footsteps, drawer, ding | 4 · TEST IN A NEW CHAT | // STEP 4 · DOES IT PICK THE CARD? | C F G |
| 8 | 33.0–39.0 | **The context jar** (bespoke data object): 24 drawer labels each pour a thin ~100-token sliver into a glass "context window" jar, which stays nearly empty; only the pulled card pours its < 5k block in; envelopes (scripts) stay sealed at 0 | Level legend: LABEL ~100 TOKENS · ALWAYS / CARD < 5K · WHEN NEEDED / ENVELOPE 0 · UNTIL OPENED | soft pours, glass tick | ~100 TOKENS UNTIL NEEDED | // WHY DOZENS COST ALMOST NOTHING | F G K |
| 9 | 39.0–48.5 | **The catches,** a real Unsplash photo of a locked drawer or desk (plate with parallax) behind three catalogue "warning cards" | CODE EXECUTION ON · DON'T SYNC: APP ≠ API ≠ CLAUDE CODE · ONLY SKILLS YOU TRUST (THEY CAN RUN CODE), then a red stamp **NO PASSWORDS** | low drone, card thuds, stamp | THE CATCH | // BEFORE YOU INSTALL ONE | I F G |
| 10 | 48.5–end | **Recap card** (save-worthy, ≥ 2.5 s): the cabinet with four labelled drawers 1 PICK · 2 ASK (format/tone/example) · 3 SAVE & SWITCH ON · 4 TEST (Reading…?) + the name/description rule | **CTA:** profile ring + @sandesh.explains + SAVE + FOLLOW (≥ 3 s); film-grain overlay | warm resolve chord, drawer close | SAVE THIS · FOLLOW FOR MORE | (none: CTA) | B F G H K |

**Asset-mix audit:**
- Families used: **10** (A, B, C, D, E, F, G, H, I, K).
- Primary visual by scene: D · B · A · F · F · B · C · F · I · B. Neighbours 4/5 share F with very different objects (chat composer → typewriter card).
- Primary counts: F 3, B 3, the rest 1 each.
- Every scene has ≥ 3 families.

## Visual identity: "Card Catalogue" (checked against every prior reel)
- **Palette (new):**
  - **walnut `#2b1a12`** cabinet wood;
  - **brass `#c9a04f`** label plates;
  - **card stock `#f5eedb`** index cards;
  - **typewriter navy `#20396b`** ink;
  - **rubber-stamp red `#d1442f`** for catches and NO PASSWORDS;
  - **library green `#3e7a5a`** for ✓ and "switched on".
  No reel has used wood + brass + card stock.
- **Texture / motion language:**
  - wood grain and a soft reading-lamp vignette;
  - paper fibre on the cards;
  - motion comes from **drawers, cards and typewriter keys**: physical, tactile and quiet.
  No cables, dots, glass or HUD.
- **Component language:**
  - index cards with ruled lines and a red margin;
  - brass label plates;
  - a typewriter card;
  - rubber stamps;
  - a glass context jar;
  - a chat composer with attachment chips;
  - catalogue "warning cards".
- **Typography (new to reels):**
  - **DM Serif Display** headlines (library signage);
  - **Courier Prime 700** (typewriter) for SKILL.md, paths and prompts;
  - **Inter 700** captions;
  - cover in **Anton** (house rule).
  Vendored via `@fontsource` (OFL).
- **Characters:**
  - one humaaans pose at a laptop (unused in recent reels);
  - a CMU mocap robot "librarian" (walk + reach), recoloured brass/navy.
- **Cover (grid-first, ≤ 5 words):**
  - options: **"TEACH YOUR AI ONCE"**, **"STOP RE-EXPLAINING TO AI"** or **"YOUR AI'S FIRST SKILL"**;
  - hero: an open catalogue drawer with one glowing card labelled "weekly-team-update";
  - face chip bottom-right.

## Audio plan
- **Score:** a quiet library-lofi cue (brushed snare, upright bass, a soft typewriter rhythm used as percussion) that brightens a little per step, drops to a low drone for the catch, then a warm resolve. Beat-locked cuts.
- **SFX:** paste clicks, drawer slides, brass clinks, typewriter keys and bell, stamps, glass pours, footsteps, a toggle click. Peak-aligned and carved under the voice.
- **Targets:**
  - voice over music + SFX: median ≥ 19 dB, min ≥ 11 dB;
  - −14 LUFS, ≤ −1 dBTP;
  - mix report.

## Honesty guardrails
- The chat UI, thinking strip and app menu are recreated generically and labelled ILLUSTRATIVE, not genuine screenshots.
- The Claude logo is used nominatively.
- The settings path is shown generically as "Skills settings" (creator decision), since the menu name differs between Anthropic's own pages.
- The caption discloses that the reel was made with Claude and is about Claude's own feature.

## Decisions for the creator (answered 12 Oct)
1. **Voice:** the creator's own voice, cloned with OmniVoice (offline, CPU) from their 15 s reference recording. Takes are picked by Whisper word accuracy and closeness to their pitch; output in `vo/`.
2. **App path:** "Skills settings" on screen.
3. **Mockup:** yes. Scenes 2, 5, 7 and 8 (cabinet, typewriter card, mocap librarian, context jar), so the mockup shows 3+ asset families.
