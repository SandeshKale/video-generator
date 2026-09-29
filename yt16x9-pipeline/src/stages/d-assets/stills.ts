/**
 * BUILD_PLAN.md section 5.7 / 3.3. Flux.1 via fal.ai -- NEVER Midjourney
 * (no official API, explicit ToS ban on automation, documented real ban
 * history). Thumbnails and metaphor frames only; photoreal "this place
 * exists" frames require legal.aiDisclosure = "photoreal" on upload
 * (verified real policy, effective and auto-detected since May 2026 --
 * see the validation doc). Prefer stylized/graphic Flux prompts, which
 * stay on the lighter disclosure path, over photoreal fake B-roll.
 */

export async function generateFluxStill(
  prompt: string,
  opts: { photoreal: boolean; negativePrompt?: string } = { photoreal: false },
): Promise<{ uri: string; aiDisclosure: "photoreal" | "animated" }> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) throw new Error("FAL_KEY is not set");
  throw new Error(
    `TODO Week 4: call fal.ai FLUX.1 [dev] ($0.025/MP) or FLUX1.1 [pro] ($0.04/MP). ` +
      `For thumbnails, prompt strictly for subject/background with explicit negative-space ` +
      `instructions and "--no text, words, letters, logos" -- title type is rendered separately ` +
      `by Remotion (src/stages/h-render), never by Flux. opts.photoreal=${opts.photoreal}`,
  );
}
