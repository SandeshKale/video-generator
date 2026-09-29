/**
 * BUILD_PLAN.md section 5.1. Ingest a brief (working title, audience,
 * 5-15 source URLs/notes, claims the creator will stand behind). Every
 * numeric/historical claim gets tagged FACT/STAGE/GAP before scripting --
 * this file is where that tagging starts, not an afterthought bolted onto
 * the script stage.
 */
import { ProvenanceSchema } from "../../edl/schema";
import { z } from "zod";

export const BriefSchema = z.object({
  workingTitle: z.string(),
  audience: z.string(),
  sources: z.array(z.string().url()).min(1),
  standByClaims: z.array(z.object({ text: z.string(), source: z.string().url() })),
});
export type Brief = z.infer<typeof BriefSchema>;

export const TaggedClaimSchema = z.object({
  text: z.string(),
  provenance: ProvenanceSchema,
  source: z.string().url().optional(),
});

export async function tagClaims(_brief: Brief): Promise<z.infer<typeof TaggedClaimSchema>[]> {
  throw new Error("TODO Week 6: LLM drafts claims from brief.sources; a human or a Jev Noul check verifies each against its cited source span before it's allowed provenance FACT.");
}
