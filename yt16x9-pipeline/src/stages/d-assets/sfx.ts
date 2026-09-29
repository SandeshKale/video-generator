/**
 * BUILD_PLAN.md section 5.5. Build against Freesound's current unified
 * `GET /apiv2/search/` endpoint (NOT the deprecated `/search/text/` path).
 * Hard-filter license via isFreesoundLicenseSafe() before a result is ever
 * downloaded. Prefer a curated ID allowlist per category (whoosh, click,
 * impact, riser, paper, UI) over live keyword search -- generic-keyword
 * result quality is documented as inconsistent; live search is fallback only.
 */
import { isFreesoundLicenseSafe, requiresAttribution } from "../../lib/licensing/filters";

const CURATED_ALLOWLIST: Record<string, string[]> = {
  // TODO: fill in vetted Freesound sound IDs per category before relying
  // on live search in production.
  whoosh: [],
  click: [],
  impact: [],
  riser: [],
  paper: [],
  ui: [],
};

export async function searchSfx(_query: string): Promise<{ id: string; uri: string; license: string }[]> {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) throw new Error("FREESOUND_API_KEY is not set");
  throw new Error(
    "TODO Week 3: GET /apiv2/search/?query=...&fields=id,previews,license&token=... " +
      "then filter every result through isFreesoundLicenseSafe() before returning it.",
  );
}

export { CURATED_ALLOWLIST, isFreesoundLicenseSafe, requiresAttribution };
