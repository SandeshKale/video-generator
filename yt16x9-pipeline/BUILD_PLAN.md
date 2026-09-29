# BUILD_PLAN.md — Automated 16:9 YouTube Pipeline

**Status:** canonical. Supersedes `16x9-youtube-pipeline-implementation-plan.md`, the Qwen/Gemini critiques, and `16x9-youtube-pipeline-hardened-spec.md` — this document folds in everything validated from all of those (see `pipeline-critique-validation-and-final-decisions.md` for the fact-check/arbitration trail) plus the decisions made while actually scaffolding this repo. Read this before writing any stage. Every source file under `src/` carries a docstring pointing back to the relevant section here — treat drift between a file's comment and this document as a bug, not a style choice.

**Runtime: Bun, throughout.** `bun install`, `bun test`, `bunx tsc --noEmit`, `bunx remotion ...` — never `npm`/`node` directly. This repo is deliberately separate from the parent repo's 9:16 Playwright/ffmpeg pipeline (`../CLAUDE.md`) — it shares that pipeline's philosophy (determinism, per-video visual identity, license discipline) but none of its rendering code, since Remotion's React/`useCurrentFrame()` model replaces `window.__seek(t)`/Playwright entirely for this format.

**Goal, stated precisely:** not "make videos" — produce monetization-safe, highest-quality, highest-creativity 16:9 long-form YouTube explainers, automated end-to-end, where "highest quality/creativity" means *original motion graphics as the primary visual language* (not stock-footage-plus-TTS with a filter on top) and every optimization in this document exists to protect that, not to trade it away for throughput.

---

## 1. Non-negotiable design principles

1. **Determinism.** `MasterVideo` (`src/stages/h-render/MasterVideo.tsx`) is a pure function of `(edl, frame)`. No wall-clock, no `Date.now()`, no unseeded randomness inside the render path. (Randomness at asset-selection time, before rendering, is fine — see `src/stages/d-assets/music.ts` for the one place this repo uses `Math.random()` and why that's safe.)
2. **Every video needs its own visual identity.** Enforced in code, not just style guide: `identityDiffersEnough()` (`src/edl/schema.ts`) hard-fails EDL binding if the new video's palette/type/motif/LUT don't differ from the previous shipped video on ≥2 axes.
3. **Graphic-first, stock-secondary.** Stock B-roll (`src/stages/d-assets/broll.ts`) illustrates; it is never the primary visual language. This is both a monetization-policy requirement (§2 below) and, independently, the higher-retention choice — see the validation doc's finding 2.5.
4. **License-check before ingest, not after.** `src/lib/licensing/filters.ts` — every Freesound/Pexels/Pixabay/LUT asset is filtered *before* it can enter an EDL, never reviewed after the fact.
5. **YouTube-specific safe zones, verified, not assumed.** §11.
6. **Audio is the clock.** `durationInFrames` is always `computeDurationInFrames(masterAudioDurationSec, tailPadFrames)` (`src/edl/schema.ts`) — never a guessed "8–10 minutes." `src/stages/f-bind-edl/bind.ts` enforces this.
7. **One EDL, many consumers.** `src/edl/schema.ts` is the only object that crosses stage boundaries. Prompts, tags, and ad-hoc filenames are not the contract — if a new piece of state needs to pass between two stages, it goes in the EDL schema (bump `schema` to `v2`+ on any breaking change), not a side-channel file.
8. **Normalize once, render many.** Raw stock/TTS/SFX/music never reach Remotion directly. `src/stages/e-normalize-mix/normalize.ts` transcodes everything to 1920×1080 CFR H.264 (video) / 48kHz 16-bit PCM WAV (audio) first.
9. **Idempotent and content-addressed.** Every paid call is wrapped in `withCache({videoId, step, inputHash}, fn)` (`src/orchestration/jobstate/cache.ts`). A retry replays from cache; it never re-bills ElevenLabs/Flux/Claude/Jev.
10. **Transform or reject.** If a video would be "TTS over stock with a LUT," kill it before it renders. §2.
11. **Deterministic checks first, Jev second, human last.** `src/stages/i-qa/qa.ts`'s hard-fail suite (ffprobe/loudnorm/duration/license-ledger — zero models) always runs before any Jev soft-fail check, which always runs before a human is asked to look at anything.
12. **Facts have provenance.** Every scripted claim is `FACT`/`STAGE`/`GAP` (`src/edl/schema.ts` `ProvenanceSchema`). `assertNoVoicedGaps()` is a hard build-time assertion, not a linter suggestion.

---

## 2. Why "graphic-first" is not optional

Verified against YouTube's own current monetization policy (`support.google.com/youtube/answer/1311392`, last updated 2025-07-15): the *reused content* policy requires stock footage to carry "significant original commentary, substantive modifications, or educational or entertainment value" beyond the footage itself; the separately-worded *inauthentic content* policy (renamed from "repetitious content") flags anything "mass-produced" or "produced using a template." A LUT, a grain overlay, and a purpose-built thumbnail are cosmetic — they don't satisfy either clause, and an independent Jev `Noul` evaluation against this exact policy text agreed at 0.06 confidence-of-truth (i.e., strongly false) that they would. Full trail in `pipeline-critique-validation-and-final-decisions.md` §2.1.

**Product shape:** primary visual language = original motion graphics — diagrams, labeled systems, kinetic typography, scene-specific graphic metaphors — built as real Remotion components (`src/stages/h-render/components/`, starting from `GraphicScene.tsx`). Stock B-roll is secondary illustration. Flux stills are for packaging (thumbnails) and occasional metaphor frames, never fake photoreal "documentary footage." Cue vocabulary (`CueKindSchema` in `src/edl/schema.ts`) is an enum — `GRAPHIC | BROLL | STILL | SFX | TEXTPOP | ZOOM | CUT` — and the script generator (`src/stages/c-script/script.ts`) should reach for `GRAPHIC` whenever a sentence describes a mechanism, number, or comparison. That's the actual originality lever, not the color grade.

---

## 3. Architecture

```
A. RESEARCH + PROVENANCE     src/stages/a-research/research.ts
        │  brief -> FACT/STAGE/GAP-tagged claims
        ▼
B. PACKAGING                 src/stages/b-packaging/packaging.ts
        │  10 title×thumb concepts -> Jev Score gate (>=8/10, else regen once, else kill topic)
        │  human picks winner (auto-pick unlocks after 10 published videos' CTR data)
        │  Flux background (src/stages/d-assets/stills.ts) + Remotion type overlay
        ▼
C. SCRIPTED EDL               src/stages/c-script/script.ts
        │  chunked LLM: outline -> hook -> each chapter w/ cues -> payoff
        │  Jev Noul per cue (verifyCuesMatchSentences) + provenance lint
        ▼
D. PARALLEL ASSET BUILD       src/stages/d-assets/{tts,sfx,broll,stills,music}.ts
        │  TTS+alignment | SFX | music | B-roll | Flux stills — independent, cached
        ▼
E. NORMALIZE + MIX            src/stages/e-normalize-mix/{normalize,duck-and-master,captions}.ts
        │  1920x1080 CFR H.264 | 48kHz PCM WAV | sidechain duck | loudnorm -14 LUFS
        │  word-level captions from ElevenLabs character alignment
        ▼
F. BIND EDL                   src/stages/f-bind-edl/bind.ts
        │  durationInFrames = f(masterAudioDurationSec); provenance + cue + identity asserts
        ▼
G. PREFLIGHT STILLS           src/stages/g-preflight/preflight.ts
        │  remotion still at hook/mid/payoff; human (v1) or Jev Noul review
        ▼
H. RENDER                     src/stages/h-render/{Root,MasterVideo,index}.tsx + components/
        │  Remotion renderMedia(); mux the single pre-mastered audio, never re-mix in Chromium
        ▼
I. HARD QA                    src/stages/i-qa/qa.ts
        │  ffprobe + loudnorm print + duration delta + cue/license ledger checks (deterministic)
        │  then Jev soft-fail checks on sampled stills
        ▼
J. PUBLISH                    src/stages/j-publish/youtube.ts
        │  audited YouTube API project only; private+publishAt; MadeForKids; AI disclosure; chapters
        ▼
K. LEARN                      src/stages/k-learn/analytics.ts
           retention curve -> next video's packaging/pacing prompts

Orchestration: src/orchestration/inngest/functions/create-video.ts (Inngest steps,
  one step = one cache key via src/orchestration/jobstate/cache.ts).
State store:   Postgres, DATABASE_URL (videoId, step, inputHash, outputUri, costCents) — TODO Week 9.
Artifact store: content-addressed files under ARTIFACT_STORE_ROOT (local disk for v1).
```

---

## 4. The EDL — full schema is `src/edl/schema.ts`, not duplicated here

Zod-validated, versioned (`schema: "yt16x9.edl.v1"`), with helper assertions (`assertAllCuesResolved`, `assertNoVoicedGaps`, `identityDiffersEnough`, `computeDurationInFrames`) that are called from `src/stages/f-bind-edl/bind.ts` and `src/stages/i-qa/qa.ts`, and unit-tested in `test/edl.contract.test.ts`. Any new field a stage needs goes here first, as a reviewed schema change, never as an informal property bag.

---

## 5. Phase-by-phase notes (implementation detail lives in each stage's own file docstring)

### 5.1 Research (`a-research/research.ts`)
Ingest a brief: working title, audience, 5–15 sources, claims the creator will stand behind (`BriefSchema`). Tag every claim FACT/STAGE/GAP before scripting — Jev `Noul` can check "this sentence is supported by the attached source span," it cannot create the source.

### 5.2 Packaging (`b-packaging/packaging.ts`)
10 concepts, `scorePackagingConcepts()` (`src/lib/jev.ts`) scores them in one parallel Jev call, gate at `SCORE_THRESHOLD = 8`. Regenerate once on failure, then kill the topic — do not lower the bar to keep the pipeline moving. Hybrid thumbnail only: Flux for background/subject with explicit negative-space + `--no text, words, letters, logos` instructions; title type is a Remotion `still` render, never Flux-generated text (diffusion models are unreliable at brand-consistent typography). Human picks the winning concept by default; `AUTO_PICK_UNLOCKED_AFTER_N_VIDEOS = 10` gates auto-pick until real CTR data exists.

### 5.3 Script (`c-script/script.ts`)
Chunked generation (outline → hook → per-chapter → payoff → global consistency pass) reduces hallucinated/generic cue tags versus one giant prompt. `verifyCuesMatchSentences()` runs a Jev `Noul` per cue. Chapters are plain `0:00`-prefixed lines in the YouTube description (`ChapterSchema` — confirmed there is no separate chapters API object).

### 5.4 Voice (`d-assets/tts.ts` + `e-normalize-mix/captions.ts`)
ElevenLabs `.../with-timestamps` (non-websocket — full script known upfront, streaming only adds latency). Alignment is **character-level only**; `groupCharsIntoWords()` groups it and drops `[audio-tag]` characters (v3's `[whispers]`-style directives). Assert `sum(word durations) ≈ audio duration` within 250ms (`assertCaptionCoverage`) — on failure, fall back to a WhisperX pass rather than shipping drifting captions. Always CBR WAV (`normalizeAudioToCbrWav`) — VBR MP3 into Remotion is a documented audio-drift failure mode. Azure TTS (native `WordBoundary` events) is the fallback when word-level timestamp reliability matters more than v3's audio-tag expressiveness.

### 5.5 SFX (`d-assets/sfx.ts`)
Freesound's current unified `GET /apiv2/search/` (the `/search/text/` path is deprecated, Nov 2025). `isFreesoundLicenseSafe()` hard-excludes CC-BY-NC before download — monetized YouTube is commercial use. Prefer the `CURATED_ALLOWLIST` per category over live keyword search; generic-keyword result quality is documented as inconsistent.

### 5.6 Music (`d-assets/music.ts`) — mandatory, was missing from the original plan entirely
**v1: YouTube Audio Library only**, downloaded manually into `assets/music/`, tracked in a ledger (`MusicLedgerEntrySchema`) tagged by energy (low/mid/high), selected per chapter — zero Content ID risk. **v2: Epidemic Sound Partner API** (`developers.epidemicsound.com` — confirmed real, but partnership-gated; don't plan on it before a signed partnership). **Never** Suno/Udio/"no copyright" MP3 sites as a production bed. Note from the validation pass: Audio Library tracks are recognizable *because* so many channels use them — weigh moving to v2 sooner than "when volume justifies it" if a distinct sonic identity matters from video 1.

### 5.7 Visual assets (`d-assets/broll.ts`, `d-assets/stills.ts`)
Pexels: header auth, 200 req/hr / 20,000/mo. Pixabay: query-param auth, 100 req/60s, and its docs *require* 24h result caching (`pixabayCache` in `broll.ts` enforces this). `dedupeByIdAndHash()` — same clip in two cues is a fail. Flux.1 via **fal.ai/Replicate only** — Midjourney has no official API and its ToS explicitly bans automation with a documented real ban history; do not integrate it, ever. Photoreal Flux stills require `legal.aiDisclosure = "photoreal"` (confirmed real policy, YouTube now auto-detects undisclosed synthetic content as of May 2026 via C2PA/SynthID signals) — stylized/graphic Flux prompts stay on the lighter disclosure path and are preferred for exactly that reason.

### 5.8 Normalize + mix (`e-normalize-mix/*`)
Order: voice stem (CBR WAV) → music bed trimmed to `voiceDuration + 1.5s` fade → SFX placed on EDL cue times → `duckMusicUnderVoice()` (ffmpeg `sidechaincompress` — **Pedalboard does not do this**, `spotify/pedalboard#254` is open and unresolved since 2023) → SFX bus mixed in → `masterLoudness()` (`loudnorm=I=-14:TP=-1.5:LRA=11`, run **last**). Tune/verify the ducking threshold against the pre-`loudnorm` signal, not the final mastered file — mastering afterward changes the gain structure and can silently drift the calibration. Pedalboard's legitimate role: optional per-track polish (compression/limiting/EQ on the voice stem) *before* ducking, never the ducking itself.

### 5.9 Render (`h-render/*`)
`MasterVideo` consumes `edl.audio.masterUri` as a single pre-mastered file via `<Audio>` — **never re-mix stems inside Chromium**. One `<Sequence>` per `edl.visuals[]` entry. `PIPELINE_FPS = 30` (`src/edl/schema.ts`) is a hard pipeline-wide constant — confirmed via an independent Jev `Choice` call (92% probability) that 30fps is right for this content's diagram/kinetic-type/Ken-Burns motion language; 60fps (used by the sibling 9:16 repo for punchy short-form entrances) would double render cost/RAM for motion that doesn't benefit from it here. Benchmark real hardware (`bun run remotion:benchmark`) before touching concurrency settings — Remotion's own documented plateau (GitHub #4949, #4300) is hardware/workload-dependent, tested at up to 224 cores; **do not** default to "render every frame individually and stitch with ffmpeg" preemptively (confirmed premature by an independent Jev `Noul` call at 0.94 confidence) — that's a Week-5+ fallback only if a real soak test on target hardware shows the plateau actually bites at this pipeline's scale.

### 5.10 QA (`i-qa/qa.ts`)
Hard fail (no model, checked first): resolution/fps/audio-rate via ffprobe, duration delta <250ms vs. mastered audio, integrated LUFS in [−16, −13], every cue resolved, no disallowed license in the ledger. Soft fail (Jev, then human if low confidence): sampled-still descriptions ("not glitched, text not clipped"). Human (v1, non-optional): packaging pick, three preflight stills, first public video of any new graphic component.

### 5.11 Publish (`j-publish/youtube.ts`)
**Launch blocker, do this in Week 1–2, not Week 10:** a YouTube API project created after 2020-07-28 uploads videos as forced-private until it clears Google's compliance audit (`developers.google.com/youtube/v3/guides/quota_and_compliance_audits`) — there's no published SLA, so submit the audit application immediately and in parallel with everything else, and publish through YouTube Studio manually until it clears (`isApiProjectAudited()` gates `uploadVideo()` on exactly this). `status.privacyStatus = "private"` + `status.publishAt` for scheduling (ignored unless private). `status.selfDeclaredMadeForKids` set explicitly. Chapters live in the description, not a separate field.

### 5.12 Learn (`k-learn/analytics.ts`)
v2 priority, not a launch blocker. Pull retention curve 48–72h post-publish, store against EDL chapter timestamps, feed concrete drop-off data into the next script-generation prompt.

---

## 6. Secrets & config (`.env.example` is authoritative — keep this table in sync with it)

| Key | Gates | Cost model |
|---|---|---|
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | script, packaging concepts, provenance drafting | per-token, negligible per video |
| `JEV_API_KEY` | `src/lib/jev.ts` — Score/Choice/Noul gates only | $0.042/M input tokens |
| `ELEVENLABS_API_KEY` | `d-assets/tts.ts` | ~$0.05–0.10/1k chars |
| `AZURE_SPEECH_KEY`/`REGION` | TTS fallback | ~$16–22/1M chars |
| `FREESOUND_API_KEY` | `d-assets/sfx.ts` | free, rate-limited |
| `PEXELS_API_KEY` / `PIXABAY_API_KEY` | `d-assets/broll.ts` | free, rate-limited |
| `FAL_KEY` | `d-assets/stills.ts` | $0.025–0.04/megapixel |
| `EPIDEMIC_SOUND_PARTNER_KEY` | music v2 only | partnership-gated |
| `INNGEST_EVENT_KEY`/`SIGNING_KEY` | orchestration | free tier: 50k executions/mo |
| `YOUTUBE_CLIENT_ID`/`SECRET`/`REFRESH_TOKEN` | `j-publish/youtube.ts` | free, quota-based |
| `DATABASE_URL` | `orchestration/jobstate` state store | infra cost only |

**Remotion license**: solo builder / ≤3-person team = Free License, covers automation at $0 (confirmed verbatim against `remotion.dev/docs/license/faq`). The Automators tier ($0.01/render, $100/mo minimum) only applies to a Company License at 4+ employees, and freelancer/agency headcount aggregates into that threshold.

---

## 7. Cost model (per ~10 minute video, solo, self-hosted render)

| Item | Estimate |
|---|---|
| LLM script + packaging | ~$0.02–0.08 |
| ElevenLabs (~9k chars) | ~$0.45–0.90 |
| Flux thumbnails + a few stills | ~$0.10–0.40 |
| Pexels/Pixabay/Freesound | $0 |
| Music (Audio Library v1) | $0 |
| Jev gates | <$0.01 |
| Remotion license | $0 (solo/≤3) |
| Compute | amortized electricity/box |
| **Total** | **~$0.60–1.50/video** |

Do not plan a volume target that only makes sense to "amortize Remotion" — that pattern (30 near-identical videos/month against one template) is exactly what the inauthentic-content policy targets.

---

## 8. Legal gates (all programmatic, `src/lib/licensing/filters.ts` + inline stage checks)

1. Freesound: drop NC, attribute BY.
2. Pexels/Pixabay: commercial+modified OK, flag identifiable people/brands for manual review (`flagForManualReview`).
3. Music: Audio Library or channel-safelisted paid library only, logged in the EDL's `legal.licenses`.
4. LUT: per-file license text confirmed before vendoring into `assets/luts/`.
5. Midjourney: never, under any circumstance.
6. Remotion: recheck headcount if the team grows past 3.
7. Voice cloning: only with documented consent.
8. YPP: both the reused-content and inauthentic-content clauses apply, separately — §2.
9. AI disclosure: `legal.aiDisclosure` set correctly at publish time.
10. API audit: no public `videos.insert` from an unaudited project, ever.

---

## 9. Roadmap (single builder, ~12 weeks)

| Weeks | Milestone |
|---|---|
| 1 | `bun install`, EDL schema + contract tests (done — this scaffold), Remotion hello-world render (done), **submit the YouTube API compliance audit application** (has no SLA — start it now, don't wait) |
| 2 | Normalization CLI + `remotion:benchmark` on real target hardware + a 3-minute render soak test |
| 3 | ElevenLabs + word grouping + SRT writer + Freesound allowlist + sidechain duck + loudnorm |
| 4 | Music ledger (Audio Library) + Pexels/Pixabay cache + hash dedupe + Flux thumbnail pipeline |
| 5 | 2–3 real `GraphicScene` components (replace the placeholder) + Ken Burns on normalized stills |
| 6 | Chunked script generator + provenance lint + Jev cue/packaging gates |
| 7 | `bind-edl` wired to real audio duration + preflight stills + first full 8–10 min render |
| 8 | Hard QA suite fleshed out (`blackdetect`/`silencedetect` thresholds tuned against real renders) + license ledger + identity-diff check |
| 9 | Postgres-backed `jobstate/cache.ts` (replace the in-memory stub) + Inngest wiring with real `inputHash` keys on every paid call |
| 10 | YouTube API client wired for real (contingent on the Week-1 audit having cleared — publish via Studio manually if not) + MadeForKids + chapters + SRT upload |
| 11 | First 2 unlisted, then 1 public video. Real on-device safe-zone screenshots (desktop, iOS, Android, with end screens/cards on) — §11 |
| 12 | Analytics pull, prompt updates from real drop-off data, legal pass, only then consider Remotion Lambda/Cloud Run for scale |

---

## 10. Test strategy

`test/edl.contract.test.ts` is the seed — grow it every time a bug turns out to be an EDL-shape problem in disguise (the single most common failure class in this kind of pipeline). Add as each stage is built:
- Audio fixtures: known WAV + alignment JSON → SRT snapshot.
- FFmpeg fixtures: ducking + loudnorm on a 30s toy mix, assert the LUFS band.
- Remotion still fixtures: one checked-in reference PNG per locked `GraphicScene` component, fail CI on pixel-hash drift above a tight threshold.
- Golden 60s render: rebuilt on every Remotion version bump, compare duration/loudness/three stills.
- Chaos test: kill the render step mid-way, assert ElevenLabs is not called again on retry (proves the `withCache` idempotency actually works, not just compiles).

No test, no "production-ready."

---

## 11. Safe zones — verify, don't assume

`src/stages/h-render/components/CaptionBand.tsx`'s current caption placement (`paddingBottom: 220`) is a starting guess, not a verified value. Before shipping: screenshot the desktop watch page (default player, with end screens/cards enabled) and the iOS/Android app playing a real 16:9 upload, note where YouTube's own chrome actually sits, and write the measured pixel values back into that component and this section. Do not reuse the sibling 9:16 repo's Instagram-Reels safe-zone numbers — different app, different chrome, verified for a different aspect ratio entirely.

---

## 12. Open items — do not paper over

- Exact current `@remotion/transitions` shader-transition API name — check `remotion.dev` the week you implement transitions; ship hard cuts/simple fades first.
- Per-file LUT licenses — confirm on each individual download page before adding to `assets/luts/`.
- Face/logo detector on stock B-roll — start with manual review (`flagForManualReview`'s output) on v1; don't build a detector before deliberately choosing one.
- YouTube's precise LUFS implementation — no single official spec found; `-14 LUFS integrated / -1.5 dBTP` is a well-corroborated working target, measure against your own first real uploads.
- Postgres schema for the state store (`orchestration/jobstate`) — not yet designed; needed by Week 9.

---

## 13. What to build first if time collapses

1. **Keep:** EDL schema + contract tests, normalization layer, audio clock (durationInFrames from real audio), license filters, hybrid thumbnail, 2–3 real graphic-first scene components, hard QA suite, human packaging gate, the Week-1 API audit submission.
2. **Cut first:** AnimateDiff/Deforum (never in scope here), Pedalboard polish, shader transitions, the Jev sentence-length pacing signal, OCR-based caption QA, Remotion Lambda/Cloud Run, extra Flux B-roll beyond thumbnails.
3. **Cut only if desperate:** Inngest itself (fall back to a bare Postgres job table — `orchestration/jobstate/cache.ts`'s shape survives either way), the Jev packaging score (a human can score 10 titles by hand).

One original, well-timed, legally clean 8-minute video per week beats a pipeline that can emit fourteen templated ones.
