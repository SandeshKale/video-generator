/**
 * Typed client for Jev (TypeSafe AI) System One API. Jev only scores,
 * chooses, or verifies against state you supply -- it never generates text.
 * See BUILD_PLAN.md section 8 for exactly which gates in this pipeline are
 * allowed to call this (packaging score, cue-verification Noul, asset
 * ranking, provenance-support Noul) and which must NEVER call it
 * (anything that would ask it to write content).
 */

const JEV_ENDPOINT = "https://api.typesafe.ai/v1/systemone";

type NoulQuestion = {
  type: "noul";
  instructions: string;
  criteria: { true: string; false: string };
};

type ChoiceQuestion = {
  type: "choice";
  instructions: string;
  criteria: Record<string, string | null>;
};

type ScoreQuestion = {
  type: "score";
  instructions: string;
  criteria: string[];
};

export type JevQuestion = NoulQuestion | ChoiceQuestion | ScoreQuestion;

type NoulAnswer = { type: "noul"; noul: number };
type ChoiceAnswer = {
  type: "choice";
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
};
type ScoreAnswer = {
  type: "score";
  score: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
  confidence: number;
};

export type JevAnswer = NoulAnswer | ChoiceAnswer | ScoreAnswer;

export type JevResponse<Q extends Record<string, JevQuestion>> = {
  model: string;
  answers: { [K in keyof Q]: JevAnswer };
  usage: { input_tokens: number; output_tokens: number };
};

export async function callJev<Q extends Record<string, JevQuestion>>(
  state: string | object,
  questions: Q,
): Promise<JevResponse<Q>> {
  const apiKey = process.env.JEV_API_KEY;
  if (!apiKey) throw new Error("JEV_API_KEY is not set");

  const res = await fetch(JEV_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "jev-latest", state, questions }),
  });

  if (!res.ok) {
    throw new Error(`Jev API error ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as JevResponse<Q>;
}

/** Convenience: the packaging gate from BUILD_PLAN.md section 5.2 --
 * score N title/thumbnail concepts in one parallel call. */
export async function scorePackagingConcepts(
  concepts: { title: string; thumbnailConcept: string }[],
): Promise<Record<number, { score: number; confidence: number }>> {
  const state = { concepts };
  const questions = Object.fromEntries(
    concepts.map((_, i) => [
      `concept_${i}`,
      {
        type: "score" as const,
        instructions: `Rate concept #${i} on: clarity on first glance, curiosity gap without lying, specificity (named object/number), trust (thumbnail matches the actual payoff), thumbnail text under 6 words.`,
        criteria: ["poor", "weak", "adequate", "strong", "excellent"],
      },
    ]),
  );
  const res = await callJev(state, questions);
  const out: Record<number, { score: number; confidence: number }> = {};
  for (let i = 0; i < concepts.length; i++) {
    const a = res.answers[`concept_${i}`] as ScoreAnswer;
    out[i] = { score: a.score, confidence: a.confidence };
  }
  return out;
}
