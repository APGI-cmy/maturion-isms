# Parking Station — Improvement Suggestions Log

**Agent**: api-builder
**Repository**: APGI-cmy/maturion-isms
**Purpose**: Append-only index of improvement suggestions from agent session handovers. One line per suggestion. Canonical detail in referenced session memory file.
**Pattern**: Per-agent parking station (migrated from global on 2026-03-03 per issue [Propagation][Parking Station]).
**Aggregation (planned)**: Future CI reporting will aggregate all `.agent-workspace/*/parking-station/suggestions-log.md` files once implemented.

---

| Date | Agent | Session | Summary | Detail |
|------|-------|---------|---------|--------|
| 2026-02-25 | api-builder | session-wave5 | [SESSION-END] | Wave 5 OpenAIAdapter embeddings + MemoryLifecycle RAG step 4 delivered — builder contract compliance (Phase 1/2/4) was initially skipped and corrected on re-delegation; locked-in learning recorded | session-wave5-20260225.md |
| 2026-02-25 | api-builder | session-wave7-20260225 | Consider codifying the FetchFn export requirement as a mandatory pattern in adapter architecture docs to prevent future omissions | session-wave7-20260225.md |
| 2026-02-26 | api-builder | session-wave8-20260226 | [DELEGATION-IMPROVEMENT] When qa-builder writes static import-path checks (MAT-T-AIMC-014 pattern), delegation spec should include the exact regex/suffix requirement to prevent rework cycles | session-wave8-20260226.md |
