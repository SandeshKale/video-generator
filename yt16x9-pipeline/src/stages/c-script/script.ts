/**
 * BUILD_PLAN.md section 5.3. Generate in chunks: outline -> hook -> each
 * chapter with cues -> payoff, then a global consistency pass. Cue
 * vocabulary is the CueKindSchema enum (src/edl/schema.ts) -- never
 * free-text tags. Prefer GRAPHIC over BROLL whenever the sentence is a
 * mechanism, number, or comparison (the originality lever, section 2).
 * After generation: run the provenance lint (assertNoVoicedGaps) and the
 * Jev cue-verification Noul gate before this script is allowed downstream.
 */
import type { Sentence } from "../../edl/schema";
import { callJev } from "../../lib/jev";

export async function generateScriptChunked(_brief: unknown): Promise<Sentence[]> {
  throw new Error("TODO Week 6: outline -> hook -> per-chapter chunked LLM calls -> global consistency pass.");
}

/** Jev Noul per cue: "this visual cue accurately matches its sentence's
 * content." Never replaces the provenance lint -- a cue can match a
 * fabricated sentence perfectly and still be wrong to voice. */
export async function verifyCuesMatchSentences(sentences: Sentence[]): Promise<Record<string, number>> {
  const questions = Object.fromEntries(
    sentences.map((s) => [
      s.id,
      {
        type: "noul" as const,
        instructions: `Does the visual cue "${s.cue.visual}"${s.cue.graphic ? ` (${s.cue.graphic})` : ""} accurately match this sentence's content: "${s.text}"?`,
        criteria: { true: "the cue represents what the sentence describes", false: "the cue is generic, mismatched, or unrelated" },
      },
    ]),
  );
  const res = await callJev({ sentences }, questions);
  return Object.fromEntries(
    Object.entries(res.answers).map(([id, a]) => [id, (a as { noul: number }).noul]),
  );
}
