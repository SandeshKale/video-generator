# Hack Zone #01 "Brain won't switch off? Write this." — v2 script (15 Oct 2026, rewritten after creator feedback)

**Creator feedback on v1 ("pathetic output"):** cloned voice muffled → switch to OmniVoice with the Adam voice; background music and SFX poor; voice-over incoherent → write it as one paragraph; visuals messy, with no sense of physics, ergonomics or motion.

## Voice-over (one paragraph, read by OmniVoice cloned from the Adam voice = Kokoro `am_adam`, the reference used on earlier reels)
> It's one in the morning, you're exhausted, and your brain is still running about a hundred tabs. Here's a five minute fix with actual science behind it. Grab a pen and paper, and write down everything that's still hanging over you. But don't just write "taxes". Write the next step: call the accountant at ten. Unfinished things keep looping in your head, and a specific plan is what quiets them down. In a sleep lab, people who wrote a to-do list fell asleep faster than people who listed what they'd already done, and the more specific the list, the faster they went. It was only fifty-seven healthy adults, so try it as an experiment, not a cure. Save this for tonight, send it to someone who's always up at two a.m., and comment tonight for the printable list. Follow for more hacks like this.

Generated as 5 whole takes (chunks at sentence boundaries), 2 seeds each, picked by a Whisper flow check (transcript equal, no break inside a phrase, 2.4-4.3 words/s) then closest to the Adam reference; nothing cut or sped up; 0.2-0.24 s gaps only.

## Facts (unchanged from the approved brief; tier A, abstract level)
F1-F6 as in the previous version: Scullin et al. 2018 (57 healthy adults 18-30, to-do list vs completed list, fell asleep significantly faster, more specific = faster; generalisation to insomnia unknown) and Masicampo & Baumeister 2011 (specific plans remove the cognitive effects of unfulfilled goals). No minutes figure is claimed; the sleep-lab traces on screen are labelled ILLUSTRATIVE, NOT DATA.

## Visual system v2 — "one desk, one lamp, real motion"
A single top-down camera over a walnut desk with one warm lamp (upper left): every shadow falls lower-right and grows with an object's height. Objects obey simple physics:
- Eight sticky notes (the open loops) **fall under gravity and bounce once**, arriving at irregular times while the voice describes the racing mind; the counter rises with each landing.
- The notebook **slides in and decelerates** (friction); the pen is **picked up and carried**, then writes (strokes follow the pen's real speed).
- Each note is **lifted and flicked off the desk** as its line is written (cause and effect: written = cleared).
- "Taxes": marker highlight, strike-through, then the specific next action with a checkbox that ticks.
- As the mind quiets, the lamp pool narrows and the thought-loop (∞) slows to a point.
- The camera **rises** (zoom out) for the comparison: two notebooks, sleep-lab style traces that slow sooner for the to-do group, a stamp, 57 dots for the sample, the catch chip.
- The desk **clears** (notebooks slide off), a recap note drops onto it, then the full call to action (save, send, comment, follow).
Palette unchanged (spruce, tangerine = open, mint = done, amber = caveat); fonts Manrope 800, Instrument Serif italic, Martian Mono.

## Audio v2
Composed score at 66 BPM in F major: tension (anxious pulse, clock, Dm(b9) cluster, whispering murmur whose loudness follows the open-loop count) -> build (bass and brush groove arrive with the pen, Rhodes with the first line) -> release at the quiet bar (Fmaj7-Em7-Dm9-Cmaj9, celesta lullaby) -> groove and lullaby up an octave for the comparison and call to action -> last bar rings out on Fmaj7. Bars are aligned to story cues. SFX: card taps scale with fall speed, pen scratch follows the pen's real speed, notebook slide follows its speed, doppler flicks, peel, marker, strike; CC0 UI samples (assets/sfx/uisfx) for check, badge, chips, typing, press.
Measured (voiced frames): voice over bed+SFX median 27.9 dB, minimum 13.6 dB, -14.0 LUFS, -2.6 dBTP. Not auditioned by ear.
