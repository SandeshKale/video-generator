/**
 * BUILD_PLAN.md section 5.2. Generate 10 title/thumbnail concepts (direct
 * LLM call, not an agent framework), score them with Jev (scorePackagingConcepts
 * in src/lib/jev.ts), gate on >=8/10 -- regenerate once, then kill the topic
 * rather than lowering the bar. Human picks the winner by default; auto-pick
 * unlocks only after the first 10 published videos' CTR data justifies it
 * (BUILD_PLAN.md section 5.2, last bullet).
 */
import { scorePackagingConcepts } from "../../lib/jev";

export type PackagingConcept = { title: string; thumbnailConcept: string };

const SCORE_THRESHOLD = 8;
const AUTO_PICK_UNLOCKED_AFTER_N_VIDEOS = 10;

export async function generateConcepts(_brief: unknown): Promise<PackagingConcept[]> {
  throw new Error("TODO Week 6: direct Claude/GPT call generating 10 title+thumbnail-concept pairs.");
}

export async function scoreAndGate(
  concepts: PackagingConcept[],
): Promise<{ passed: boolean; scores: Record<number, { score: number; confidence: number }> }> {
  const scores = await scorePackagingConcepts(concepts);
  const passed = Object.values(scores).some((s) => s.score >= SCORE_THRESHOLD);
  return { passed, scores };
}

export { AUTO_PICK_UNLOCKED_AFTER_N_VIDEOS };
