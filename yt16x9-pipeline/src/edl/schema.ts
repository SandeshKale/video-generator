/**
 * The EDL (Edit Decision List) is the one contract every pipeline stage reads
 * and writes. See BUILD_PLAN.md section 4 for the full rationale: without a
 * versioned schema, captions/asset-IDs/durationInFrames drift out of sync
 * across stages silently. Every stage function in src/stages/** takes an
 * EDL (or a partial slice of one) in and returns a validated EDL out --
 * never an informal object shape agreed on by convention.
 *
 * Bump `schema` (e.g. "yt16x9.edl.v2") on any breaking field change and add
 * a migration in src/edl/migrate.ts -- never silently reinterpret an old EDL.
 */
import { z } from "zod";

export const ProvenanceSchema = z.enum(["FACT", "STAGE", "GAP"]);

export const CueKindSchema = z.enum([
  "GRAPHIC",
  "BROLL",
  "STILL",
  "SFX",
  "TEXTPOP",
  "ZOOM",
  "CUT",
]);

export const SentenceSchema = z.object({
  id: z.string(),
  text: z.string(),
  provenance: ProvenanceSchema,
  source: z.string().url().optional(),
  cue: z.object({
    visual: CueKindSchema,
    graphic: z.string().nullable().optional(),
    brollQuery: z.string().nullable().optional(),
    sfx: z.string().nullable().optional(),
    textPop: z.string().nullable().optional(),
  }),
});

export const ChapterSchema = z.object({
  t: z.string().regex(/^\d{1,2}:\d{2}(:\d{2})?$/),
  label: z.string(),
});

export const LicensedAssetSchema = z.object({
  id: z.string(),
  uri: z.string(),
  license: z.enum(["CC0", "CC-BY", "AUDIO_LIBRARY", "SAFELISTED", "COMMERCIAL_STOCK"]),
  attribution: z.string().optional(),
});

export const IdentitySchema = z.object({
  palette: z.array(z.string()).min(3),
  typePair: z.tuple([z.string(), z.string()]),
  motionMotif: z.string(),
  lutId: z.string(),
  lutMix: z.number().min(0).max(1),
  grainOpacity: z.number().min(0).max(0.3),
});

export const AudioSchema = z.object({
  voiceUri: z.string().optional(),
  musicUri: z.string().optional(),
  sfx: z.array(LicensedAssetSchema).optional().default([]),
  masterUri: z.string().optional(),
  durationSec: z.number().positive().optional(),
  lufsIntegrated: z.number().optional(),
  truePeakDb: z.number().optional(),
  alignment: z.string().optional(), // uri to character-level alignment json
});

export const WordSchema = z.object({
  t0: z.number(),
  t1: z.number(),
  w: z.string(),
});

export const CaptionsSchema = z.object({
  srtUri: z.string().optional(),
  words: z.array(WordSchema).default([]),
});

export const VisualSchema = z.object({
  sentenceId: z.string(),
  kind: z.enum(["graphic", "broll", "still"]),
  component: z.string().optional(),
  assetUri: z.string().optional(),
  fromSec: z.number(),
  toSec: z.number(),
});

/** 30fps is the pipeline-wide default -- see BUILD_PLAN.md section 3.1.
 * Do not introduce a second fps value anywhere in this codebase without
 * updating that section's rationale first. */
export const PIPELINE_FPS = 30 as const;
export const PIPELINE_WIDTH = 1920 as const;
export const PIPELINE_HEIGHT = 1080 as const;

export const RenderSchema = z.object({
  fps: z.literal(PIPELINE_FPS).default(PIPELINE_FPS),
  width: z.literal(PIPELINE_WIDTH).default(PIPELINE_WIDTH),
  height: z.literal(PIPELINE_HEIGHT).default(PIPELINE_HEIGHT),
  durationInFrames: z.number().int().positive().optional(),
  tailPadFrames: z.number().int().nonnegative().default(30),
});

export const LegalSchema = z.object({
  licenses: z.array(LicensedAssetSchema).optional().default([]),
  attributionBlock: z.string().optional().default(""),
  aiDisclosure: z.enum(["none", "photoreal", "animated"]).optional().default("none"),
  madeForKids: z.boolean().optional().default(false),
});

export const PackagingSchema = z.object({
  title: z.string(),
  titleScore: z.number().min(0).max(10).optional(),
  thumbnailStill: z.string().optional(),
  thumbnailConcept: z.string().optional(),
});

export const EdlSchema = z.object({
  schema: z.literal("yt16x9.edl.v1"),
  videoId: z.string(),
  identity: IdentitySchema,
  packaging: PackagingSchema.optional(),
  script: z.object({
    language: z.string().default("en"),
    chapters: z.array(ChapterSchema).default([]),
    sentences: z.array(SentenceSchema).default([]),
  }).optional(),
  audio: AudioSchema.optional().transform((v) => v ?? AudioSchema.parse({})),
  captions: CaptionsSchema.default({ words: [] }),
  visuals: z.array(VisualSchema).default([]),
  render: RenderSchema,
  legal: LegalSchema.optional().transform((v) => v ?? LegalSchema.parse({})),
});

export type Edl = z.infer<typeof EdlSchema>;
export type Sentence = z.infer<typeof SentenceSchema>;
export type Identity = z.infer<typeof IdentitySchema>;

/** durationInFrames must always be derived from the mastered audio, never
 * guessed upfront. See BUILD_PLAN.md principle 6 ("Audio is the clock"). */
export function computeDurationInFrames(masterDurationSec: number, tailPadFrames: number): number {
  return Math.floor(masterDurationSec * PIPELINE_FPS) + tailPadFrames;
}

/** Every EDL cue must resolve to a real asset before render -- a cue with
 * no resolved visual is a hard fail, never a silent skip. */
export function assertAllCuesResolved(edl: Edl): void {
  const resolvedSentenceIds = new Set(edl.visuals.map((v) => v.sentenceId));
  for (const s of edl.script?.sentences ?? []) {
    if (!resolvedSentenceIds.has(s.id)) {
      throw new Error(`EDL cue unresolved for sentence ${s.id} ("${s.text.slice(0, 40)}...")`);
    }
  }
}

/** No GAP-tagged sentence may ever be voiced. See BUILD_PLAN.md principle 12. */
export function assertNoVoicedGaps(edl: Edl): void {
  const gaps = (edl.script?.sentences ?? []).filter((s) => s.provenance === "GAP");
  if (gaps.length > 0) {
    throw new Error(
      `${gaps.length} GAP-tagged sentence(s) present in a script bound for voicing -- rewrite or cut: ${gaps
        .map((s) => s.id)
        .join(", ")}`,
    );
  }
}

/** Identity must differ from the previously shipped video on >=2 axes.
 * See BUILD_PLAN.md section 2 ("per-video identity rule, enforced in code"). */
export function identityDiffersEnough(prev: Identity, next: Identity): boolean {
  let diffs = 0;
  if (prev.lutId !== next.lutId) diffs++;
  if (prev.motionMotif !== next.motionMotif) diffs++;
  if (JSON.stringify(prev.palette) !== JSON.stringify(next.palette)) diffs++;
  if (JSON.stringify(prev.typePair) !== JSON.stringify(next.typePair)) diffs++;
  return diffs >= 2;
}
