# Reel: GTA VI "steamy scenes" — what the rating boards actually wrote (~65 s, Hinglish voice-over, nerdlogic.co)

Status: approved by creator ("go ahead"); building the 3-scene Blender mockup. Facts: `research/sources.md` (ESRB = tier A first-hand, PEGI B+, Australia unreachable).

## Treatment (decision on the topic)
The creator asked for "steamy scenes". Made as a **label reel, not a scenes reel**: it reports what ESRB, PEGI and the Australia/NZ listings **wrote**, never what the scenes show. Nothing explicit, suggestive or taken from the game; no jokes about the content. This keeps it factual, Instagram-safe, and honest about what is unverified.

## Story (storytelling gate)
- **Protagonist:** the age label on the box. **Hook:** "GTA 6 mein steamy scenes hain — yeh afwah nahi, rating boards ne khud likha hai."
- **Reversal:** it sounds new, **but** the US label lists the same seven descriptors as GTA V (to confirm), so what changed is the *words*: Australia/NZ store listings say "sex scenes" outright, and Europe's PEGI text appeared then was deleted.
- **Honest ending:** a label is a warning, not proof of what's on screen; ESRB's long summary now exists but this reel deliberately doesn't repeat its scene details, it stays at label level.
- **One-sentence test:** *GTA 6 is officially labelled for sexual content, BUT that label matches GTA V's, THEREFORE the real news is the boards' sharper wording and one deleted listing, not a new kind of game.* ✔
- **Open loops:** "Kya likha hai?" (0 s) → "Naya kya hai?" (≈20 s) → "Aur ek line mita di gayi" (≈35 s) → "label padhiye, afwahein nahi" (≈55 s).

## Script (draft, ear-first, ~165 words)
1. "GTA 6 mein steamy scenes hain. Yeh afwah nahi, rating boards ne khud likha hai."
2. "Pehle America. ESRB ka label: M, yaani Mature, satrah plus."
3. "Label mein saat cheezein likhi hain: khoon-kharaaba, tez hinsa, gaali, nudity, mature humor, nasha, aur strong sexual content."
4. "Sunke lagta hai yeh naya hai. Par GTA 5 ke label par bhi yahi saat cheezein hain."
5. "Toh naya kya hai? Shabd."
6. "Australia aur New Zealand ki store listing mein seedha likha hai: sex scenes."
7. "Europe mein PEGI ne atharah plus ka label lagaya. Uski pehli summary website par thodi der dikhi, phir hata di gayi. Ab wahan ek chhoti, saadi summary hai."
8. "Jo likha bataya gaya: nudity aur intercourse ke scenes. Par PEGI ne yeh confirm nahi kiya."
9. "Yaani ek hi game, alag-alag boards, alag-alag shabd. Aur ek line mita di gayi."
10. "Ek baat aur. Label chetavni hai, taala nahi. Esquire India bhi yahi kehta hai."
11. "Scenes ka poora byora ESRB ki summary mein hai, hum use dohrate nahi. Label padhiye, afwahein nahi."
12. CTA: "Aisi baatein record se padhni hon toh follow kijiye, nerd logic dot co." (IG CTA; Hindi YouTube sheet would add like/share/subscribe.)
TTS notes: "Sensor"-style spelling rules from `docs/HINGLISH-PRONUNCIATION-LEXICON.md`; spell "ESRB", "PEGI" letter by letter in Devanagari; avoid the Urdu nukta words.

## Style (Lemo-Opuscar record)
- **Slug: `visual-investigation`** (Instruments & Evidence). Runner-up: `caption-news`.
- **Why it fits:** topic type = "fact-check / claim vs record"; the story is *sources meeting at one moment*: each board's own wording laid side by side, the **deleted PEGI listing** as the key piece of evidence, and "known vs unknown" kept as separate columns (the style's rule 4: uncertainty is drawn, not apologised for).
- **3 invariants kept:** (1) one finding per layout; (2) one accent colour that only *points* (circles, highlights, the match tick, the unresolved column), everything else restrained and greyscale; (3) re-typeset documents labelled "transcription", never invented sources.
- **What we adapt:** no footage exists or is wanted, so the three source kinds are listing documents, a timeline (PEGI posted → removed) and a data table of the seven descriptors; Chinese type dropped (English labels + Hinglish voice, plain 40 px captions); vertical 1080×1920 with safe zones; own accent (below), not the demo's red.
- **Palette (own):** ground `#0B0C0E`, panels `#14161C`, text `#ECEAE4`, uncertain `#4A4F57`, **the one accent: signal magenta `#FF3D81`** (the "18"/"M" stamp, highlighted line, unresolved column). Fonts: IBM Plex Mono (tags/timecodes) + Noto Sans (headings) + Source Serif-style italic for quotes only if vendored; Inter captions; cover in Anton.
- **Honesty labels:** every panel's tag says `ESRB · listing`, `PEGI · pulled`, `AU/NZ · store` plus "transcription"; the PEGI text is stamped `REPORTED · NOT CONFIRMED`.

## Pipeline note (Blender-first rule, 19 Nov)
Evidence frames are flat panels, so the plan is Blender orthographic/shallow-perspective renders of cards on a desk, emission-light materials, crisp text via `scripts/blender_text.py`, camera as the style's slow push. **Mockup must be three real Blender renders with measured s/frame** (descriptor table with the one highlighted line, the PEGI posted→deleted timeline, the three-board comparison) before any full build.

## Asset families (≥5) — to confirm at mockup
Blender card/desk renders · crisp text overlay · bespoke data objects (7-descriptor table, timeline, same-vs-different comparison) · kinetic type/highlight wipes · paper/grain finish · audio (cold bed, tick/stamp SFX, cloned voice). No photos of the game, deliberately.

## Open items before posting
Open the ESRB (GTA VI and GTA V), PEGI and Classification-board pages first-hand and re-tier; confirm GTA V's descriptor set; check whether PEGI/ESRB have posted anything since; one human listen to the Hinglish and the CTA brand.

## Mockup (22 Nov 2026) — three real Blender renders, `blender/mockup.py`, files in `mockup/`
Scenes A (same 7 ESRB descriptors as GTA V, magenta sweep on the one row, tick columns), B (PEGI posted → pulled → page today, dashed "removed" card with REPORTED · NOT CONFIRMED), C (three boards: ESRB M, PEGI 18, AU/NZ store listing as the unresolved dashed card). Blender 5.3 via `pip install bpy` (python 3.13: run with `/usr/bin/python3`, not the 3.11 default).
- **Measured:** beauty pass 720×1280 at 16 samples ≈ **9.7 s/frame** + crisp text overlay at 1080×1920 ≈ **0.9 s** = **≈ 11.4 s/frame** on 4 CPU cores. A full 65 s film at 12 fps with held frames reused is ≈ 780 frames → **≈ 2.5 h** worst case; most beats are holds, so unique frames are far fewer (est. 1–1.5 h). Cheaper levers if needed: 8 samples, 540×960 beauty.
- **Known mockup issues to fix in the full build:** tick marks are filled squares (draw real ticks; Inter has no ✓ glyph), the PEGI "page today" card was tight (fixed by a taller card), AU/NZ "level: reports differ" line needs a source tag, the bottom third is intentionally empty for captions, camera is locked (full build adds the style's slow push and a match-cut between scenes).
- **Fact changes after reading the boards first-hand:** ESRB descriptor list is the same 7 for GTA V and GTA VI (tier A); ESRB's long summary is now posted but is not quoted; PEGI's page today carries a short generic summary; Australian Classification returned 503 (level not voiced).
