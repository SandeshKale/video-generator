/**
 * The top-level workflow, per BUILD_PLAN.md section 3 (architecture) and
 * section 5.9's "one step = one cache key" rule. Every step.run() body must
 * be wrapped in withCache() (src/orchestration/jobstate/cache.ts) keyed on
 * (videoId, step, inputHash) so a retry never re-bills a paid API.
 *
 * This file is deliberately a skeleton: each stage import below is a stub
 * (see the sibling files under src/stages/**) until its own week in the
 * roadmap (BUILD_PLAN.md section 9) is built and tested in isolation.
 * Do NOT wire real API calls into this function before each stage has its
 * own passing contract test (BUILD_PLAN.md section 10).
 */
import { inngest } from "../client";
import { inputHash, withCache } from "../../jobstate/cache";
// import { researchTopic } from "../../../stages/a-research/research";
// import { generatePackagingConcepts, pickWinningConcept } from "../../../stages/b-packaging/packaging";
// import { generateScript } from "../../../stages/c-script/script";
// import { fetchTts, fetchSfx, fetchBroll, fetchStills, selectMusic } from "../../../stages/d-assets";
// import { normalizeAll, duckAndMaster, buildCaptions } from "../../../stages/e-normalize-mix";
// import { bindEdl } from "../../../stages/f-bind-edl/bind";
// import { renderPreflightStills } from "../../../stages/g-preflight/preflight";
// import { renderMasterVideo } from "../../../stages/h-render/render";
// import { runHardQaSuite } from "../../../stages/i-qa/qa";
// import { publishToYouTube } from "../../../stages/j-publish/youtube";

export const createVideoWorkflow = inngest.createFunction(
  { id: "create-video-workflow" },
  { event: "pipeline/start" },
  async ({ event, step }) => {
    const videoId: string = event.data.videoId;

    const brief = await step.run("research", async () => {
      throw new Error("TODO: wire src/stages/a-research (Week 6)");
    });

    const packaging = await step.run("packaging", async () => {
      throw new Error("TODO: wire src/stages/b-packaging + Jev Score gate (Week 6)");
    });

    const script = await step.run("script", async () => {
      throw new Error("TODO: wire src/stages/c-script + provenance lint + Jev Noul gate (Week 6)");
    });

    // Parallel asset fetch -- independent steps, each individually cached.
    const [tts, sfx, broll, stills, music] = await Promise.all([
      step.run("tts", async () =>
        withCache({ videoId, step: "tts", inputHash: inputHash(script) }, async () => {
          throw new Error("TODO: wire ElevenLabs with-timestamps (Week 3)");
        }),
      ),
      step.run("sfx", async () => {
        throw new Error("TODO: wire Freesound + license filter (Week 3)");
      }),
      step.run("broll", async () => {
        throw new Error("TODO: wire Pexels/Pixabay + 24h cache + hash dedupe (Week 4)");
      }),
      step.run("stills", async () => {
        throw new Error("TODO: wire Flux.1 via fal.ai, thumbnails + metaphor frames only (Week 4)");
      }),
      step.run("music", async () => {
        throw new Error("TODO: select from YouTube Audio Library ledger (Week 4)");
      }),
    ]);

    const normalized = await step.run("normalize-and-mix", async () => {
      throw new Error("TODO: wire src/stages/e-normalize-mix (Week 1-3)");
    });

    const edl = await step.run("bind-edl", async () => {
      throw new Error("TODO: wire src/stages/f-bind-edl -- durationInFrames from mastered audio (Week 7)");
    });

    await step.run("preflight-stills", async () => {
      throw new Error("TODO: wire src/stages/g-preflight -- human/Jev review of hook/mid/payoff frames (Week 7)");
    });

    const rendered = await step.run("render", async () => {
      throw new Error("TODO: wire src/stages/h-render's renderMedia() call (Week 7)");
    });

    const qa = await step.run("hard-qa", async () => {
      throw new Error("TODO: wire src/stages/i-qa -- ffprobe + Jev soft-fail gates (Week 8)");
    });

    await step.run("publish", async () => {
      if (await alreadyUploaded(videoId)) return;
      throw new Error("TODO: wire src/stages/j-publish -- audited YouTube project only (Week 10)");
    });

    return { videoId };
  },
);

async function alreadyUploaded(_videoId: string): Promise<boolean> {
  // TODO(week 9): check the Postgres state store's outputUri for the
  // "publish" step before ever calling videos.insert again.
  return false;
}
