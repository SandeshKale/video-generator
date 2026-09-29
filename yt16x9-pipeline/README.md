# yt16x9-pipeline

Automated 16:9 (1920×1080) long-form YouTube video pipeline. Bun + TypeScript + Remotion.

**Read [`BUILD_PLAN.md`](./BUILD_PLAN.md) first** — it is the canonical, source-cited spec this scaffold was built from (fact-checked against Remotion's/Google's/YouTube's/Epidemic Sound's own primary sources, with the contested judgment calls independently arbitrated via a live Jev API call — see `pipeline-critique-validation-and-final-decisions.md` in the parent repo's scratchpad for that trail).

## Quick start

```bash
bun install
cp .env.example .env   # fill in API keys — see BUILD_PLAN.md section 6 for what each one gates
bun test                # EDL contract tests
bunx tsc --noEmit        # typecheck
bun run remotion:studio  # opens the hello-world composition in the Remotion Studio UI
bun run remotion:still src/stages/h-render/index.ts MasterVideo out/still.png --frame=15
```

## Where things live

- `src/edl/schema.ts` — the one contract every stage reads/writes. Read this second, after `BUILD_PLAN.md`.
- `src/stages/{a..k}-*/` — one directory per pipeline stage, lettered to match `BUILD_PLAN.md` section 3's architecture diagram. Most are stubs (`throw new Error("TODO Week N: ...")`) pointing at the exact week/section to implement them — this is a real, typechecked, tested scaffold, not a finished pipeline.
- `src/lib/jev.ts` — typed Jev (TypeSafe AI) client. Score/Choice/Noul gates only; Jev never generates content in this codebase.
- `src/orchestration/` — Inngest workflow + the idempotency cache every paid call must go through.
- `test/edl.contract.test.ts` — grow this file first whenever a bug turns out to be an EDL-shape problem, which `BUILD_PLAN.md` section 10 notes is the most common failure class here.

## Status

Week 1 of the `BUILD_PLAN.md` roadmap: EDL schema + contract tests pass, hello-world Remotion composition renders end-to-end (`bun test` and `bunx tsc --noEmit` are both clean). Everything past that is stubbed per stage, ready to build in the order `BUILD_PLAN.md` section 9 lays out.
