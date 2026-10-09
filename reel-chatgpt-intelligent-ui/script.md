# Reel script — "The chat box turned into an app" (ChatGPT Intelligent UI + GPT-6)

Working title: **ChatGPT stopped being a chat box** · target 68–72 s · 1080×1920@60 · voice: Kokoro `am_michael`, base ≈1.08 (sentence-level takes, no filler clips)
Status: **script only — nothing built.** Design system to be mocked up (2–3 scenes) and approved before the full build.

## Why this topic (research, 9 Oct 2026)
- Announced **Wed 7 Oct 2026**: GPT-6 + **Intelligent UI** in ChatGPT (OpenAI on X: "now rolling out in ChatGPT for everyone"). Two days old, covered by TechCrunch, MacRumors, Gizmodo, Dataconomy, MacRumors-style aggregators.
- It is the most **visual** story of the week: answers stop being paragraphs and become tappable diagrams, calculators and editable graphs. Fits this repo's strength (motion + components), needs almost no numbers.
- Other candidates considered and parked: Jev (viral "decision model", 38M-view claim is single-source), fired-OpenAI-researchers/CoT-monitoring (sensitive, details not verifiable), Claude Haiku 5.5 (spec-sheet story), Meta "Hatch"/"Watermelon" (unconfirmed codenames).

## Fact table (every on-screen claim must come from here)
| # | Fact | Tier | Source |
|---|------|------|--------|
| 1 | OpenAI calls it **Intelligent UI**; ChatGPT answers with "fully interactive user interfaces" | A | MacRumors, TechCrunch, OpenAI X post |
| 2 | Visuals can be tappable buttons, forms, interactive charts, task-specific calculators, editable graphs, diagrams, maps | A | TechCrunch, MacRumors |
| 3 | Demo: PM **Aarush Selvan** asked how an airplane wing generates lift → ChatGPT quickly produced several diagrams | B | TechCrunch (OpenAI briefing) |
| 4 | Selvan: ChatGPT "has predominantly been a text-based interface"; most helpful answers "aren't just text" | B | TechCrunch (direct quote) |
| 5 | OpenAI samples: recipe widget that rescales ingredients by guest count, checklists, integrated maps, multiple-choice follow-ups, a bill splitter, small games, a calculator; bike-mechanics diagram, multi-day hike map, personal savings calculator | A | MacRumors, TechCrunch |
| 6 | How: a library of **native, streamable UI components** + a **compiler** that processes the interface *as the model generates it*; GPT-6 can start answering while still thinking | A | MacRumors (OpenAI's description) |
| 7 | Rolled out **Wed 7 Oct** to Plus/Pro/Business/Enterprise (**GPT-6 Sol**); **Free and Go** the next day (**GPT-6 Luna**); Chat tab only — Work and Codex models unchanged | A | MacRumors, TechCrunch |
| 8 | Users can **turn the visuals down**, like other personality settings | B | TechCrunch |
| 9 | Caveat (commentary, not OpenAI): visuals may use more tokens and add a new place for hallucinations to hide; TechCrunch's piece has no independent testing | C — say as "critics say"/"worth watching", never as fact | secondary coverage |

Not used: Common Sense Media "ChatGPT for Teens" rating (separate story), "Astra thinking mode disables Intelligent UI" (single unverified report), any benchmark or revenue figure.

## Voice-over (≈185 words)
1. **Hook (0–3 s):** "ChatGPT just stopped being a chat box."
2. "Ask how a plane wing makes lift, and you don't get a paragraph. You get a diagram you can poke."
3. "It's called Intelligent UI, and it launched Wednesday with GPT-6."
4. "The model decides when words aren't enough. Then it builds the interface right there, while it's still answering. Buttons. Forms. Charts. Even a calculator."
5. "Planning dinner? Change the guest count, and the recipe rescales. Splitting a bill? It builds the splitter. Hiking trip? Here's the map."
6. "Under the hood, it's a library of ready-made pieces, and a compiler that snaps them together as the answer streams in."
7. "Paid plans got it Wednesday. Free users, Thursday."
8. "The catch? A slick chart isn't a checked chart. Critics say a pretty widget can hide a wrong answer. So you can turn the visuals down in settings."
9. "That's the real shift. The answer isn't something you read anymore. It's something you use."
10. **CTA (held ≥3 s):** "So, would you rather read a reply, or touch one? Follow for the next one."

## Scene plan — one bespoke object per scene, no number cards
| # | Time | Eyebrow (content-specific) | Headline | The object on screen | Motion / character |
|---|------|---------------------------|----------|----------------------|--------------------|
| 1 | 0–4 | `// THE OLD CHAT BOX` | CHAT BOX. **GONE.** | A wall of grey chat text; at the first word it *pops* — paragraphs peel off like sticky labels and a live widget grid assembles in their place (frame 0 already composed) | Mascot **Cursor** (arrow with eyes) drops in and pokes the text; text jiggles |
| 2 | 4–13 | `// ONE QUESTION, ONE WING` | A DIAGRAM YOU CAN POKE | Airplane-wing cross-section drawn live; airflow lines stream over/under; tapping a button toggles *pressure above / pressure below* labels; a draggable "angle" handle tilts the wing and the arrows react (t-driven) | Cursor taps the handle, wing tilts, flow bends |
| 3 | 13–19 | `// WEDNESDAY, WITH GPT-6` | INTELLIGENT UI | Chat bubble that *morphs* into a UI card: a text answer → button row → mini chart sliding in, with the name stamped in the corner and an ChatGPT-style mark (no logo implying endorsement; generic icon) | Bubble unfolds like paper |
| 4 | 19–29 | `// WHEN WORDS AREN'T ENOUGH` | IT BUILDS WHILE IT TYPES | The streaming moment: a typewriter line starts, and *mid-sentence* component blocks (button, form field, chart, calculator keypad) get stamped in by an assembly arm; progress shimmer on unfinished blocks | Cursor rides the typing caret |
| 5 | 29–42 | `// DINNER, BILL, HIKE` | THREE ANSWERS YOU CAN USE | Three bespoke widgets in sequence, one per sentence: **recipe** (guest-count stepper → ingredient amounts rescale live), **bill splitter** (tap people chips → shares update), **hike map** (route line draws itself, day pins drop) | Cursor taps; widgets bounce in |
| 6 | 42–51 | `// THE PARTS BIN` | LEGO FOR ANSWERS | A parts bin of native components (button, chart, map, form) flying into a compiler hopper and snapping into a finished card, streaming left-to-right | Pieces tumble; conveyor motion |
| 7 | 51–55 | `// WHO GETS IT FIRST` | PAID FIRST. FREE NEXT DAY. | Two-lane conveyor: lane 1 *Plus · Pro · Business · Enterprise → Sol* arrives Wed; lane 2 *Free · Go → Luna* arrives Thu; calendar page flips Wed → Thu | Calendar flip; badges slide |
| 8 | 55–63 | `// A PRETTY CHART ISN'T A CHECKED ONE` | WATCH THE WIDGET | A glossy chart with a tiny wrong label; a magnifier sweeps and a red "check me" tag appears; then a **slider** labelled *visuals* turned down one notch | Cursor squints through magnifier, then drags the slider down |
| 9 | 63–72 | `// READ → USE` | NOT TO READ. TO USE. | Split: a paragraph fading out on the left, the live widget lighting up on the right; ends on the CTA card — profile photo (≥200 px) + **@sandesh.explains** + FOLLOW, held ≥3 s, safe zone | Cursor presses FOLLOW |

Host: optional small picture-in-picture of the creator (MoDA/LatentSync video) in scenes 2, 5, 9 only if the lip-sync pass lands; otherwise Cursor is the only character.

## Visual-identity proposal (must differ from every earlier reel; approve via mockup first)
- **Palette:** soft ice-blue paper (#eaf1ff) + cobalt (#2b50ff) + tangerine (#ff8a1f) + lemon highlight (#ffe14d); ink #14182b. (Earlier: navy/green/amber, cyan/magenta/black, indigo/magenta/mint, slate/yellow/pink, umber/amber, cream/terracotta/teal.)
- **Background language:** *wireframe-to-filled* — faint grey wireframe boxes (the old text UI) that fill with colour as widgets arrive; drifting "skeleton loader" shimmer bars. No dots, no graph-paper, no scanlines.
- **Components:** chunky toy-UI widgets — thick ink outlines, hard offset shadow, pill toggles and sliders; rounded but **sticker-like**, not the paper-puppet look.
- **Type (to vendor):** a rounded display face (e.g. Gabarito/Fredoka 800) + Inter body + Geist/DM Mono labels.
- **Character:** **Cursor**, an arrow pointer with googly eyes, drawn as an SVG puppet driven by pure-`t` motion (poke, tap, squint, drag) — no humaaans, no CMU rig, no repeated host look.

## Caption notes
Say "OpenAI says" for fact 6; label the critics' point as commentary; link to nothing unverifiable; add "AI-generated voice" if the platform requires it. Hashtags (~28) to be written after the final cut.
