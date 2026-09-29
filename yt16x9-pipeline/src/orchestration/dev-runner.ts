/**
 * Local dev entry point: register the Inngest function and serve it so
 * `bunx inngest-cli@latest dev` (run in a second terminal) can discover
 * and trigger it. See BUILD_PLAN.md section 3 for the full architecture
 * this wires together once each stage stub is replaced with real code.
 */
import { serve } from "inngest/bun";
import { inngest } from "./inngest/client";
import { createVideoWorkflow } from "./inngest/functions/create-video";

const handler = serve({ client: inngest, functions: [createVideoWorkflow] });

Bun.serve({ port: 3000, fetch: handler as unknown as (req: Request) => Promise<Response> });
console.log("Inngest dev server listening on http://localhost:3000/api/inngest");
