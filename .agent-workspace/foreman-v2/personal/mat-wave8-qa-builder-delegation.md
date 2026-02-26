# MAT Wave 8 — qa-builder Delegation Specification (RED Gate)

**Issued by**: foreman-v2-agent  
**Issued to**: `qa-builder`  
**Date**: 2026-02-26  
**Wave**: MAT Wave 8 — AIMC Analysis Integration  
**Authority**: modules/mat/03-implementation-plan/implementation-plan.md §2.9 | ai-architecture.md v2.0.0  
**Status**: AUTHORIZED — AIMC Wave 4 confirmed GREEN, CS2 wave-start authorization confirmed (Issue #[Wave 8 MAT AIMC Analysis Integration] by @APGI-cmy)

> ⚠️ **MANDATORY PREFLIGHT FIRST**
> Read your agent contract file FIRST: `.github/agents/qa-builder.md`
> Complete Phase 1 PREFLIGHT in full before any other action.
> Failure to execute Phase 1 first is a POLC breach and will result in QP FAIL.

---

## Step 0 — Mandatory Preflight (BLOCKING — execute before any other action)

Read your agent contract file FIRST: `.github/agents/qa-builder.md`
Complete Phase 1 PREFLIGHT in full. Produce declared output for every step.
Record Phase 1 evidence in session memory at `.agent-workspace/qa-builder/memory/session-mat-wave8-red-20260226.md`

**Failure to execute Phase 1 first is a POLC breach and will result in QP FAIL on delivery.**

---

## Context

Wave 7 (AIMC Advisory Integration) is complete. AIMC Wave 4 (Analysis Gateway) is GREEN
in `packages/ai-centre` — `wave4-cst.test.ts` passes and `Capability.ANALYSIS` is live in
`OpenAIAdapter.ts`.

Wave 8 objective: Refactor MAT criteria parsing and maturity scoring to call
`@maturion/ai-centre` Analysis Gateway instead of any direct provider calls.

Current state of target files:
- `modules/mat/src/services/criteria-management.ts`: Has `parseCriteriaDocument()` with comment
  "In production, this would call GPT-4 Turbo via AI Gateway" — no AIMC wiring yet.
- `modules/mat/src/services/ai-scoring.ts`: Has `scoreMaturity()` with direct model name
  references (`gpt-4-turbo`, `gpt-4o-mini`) in a routing table — no AIMC wiring.

Pattern to follow: `modules/mat/tests/aimc-advisory/aimc-advisory.test.ts` — same structure,
same file-existence checks, same import checks.

---

## Deliverable — `aimc-analysis.test.ts` (RED gate)

**Path**: `modules/mat/tests/aimc-analysis/aimc-analysis.test.ts`

**Tests**: MAT-T-AIMC-011 to MAT-T-AIMC-020 (10 tests)

| Test ID | Description | RED condition (pre-implementation) |
|---------|-------------|-------------------------------------|
| MAT-T-AIMC-011 | `analysis-service.ts` file exists at `modules/mat/src/services/analysis-service.ts` | RED — file does not exist yet |
| MAT-T-AIMC-012 | `analysis-service.ts` exports `parseCriteriaDocument` function | RED — file does not exist yet |
| MAT-T-AIMC-013 | `analysis-service.ts` exports `scoreMaturity` function | RED — file does not exist yet |
| MAT-T-AIMC-014 | `analysis-service.ts` imports from `@maturion/ai-centre` or relative ai-centre path (AICentre gateway) — no direct OpenAI/GPT imports | RED — file does not exist yet |
| MAT-T-AIMC-015 | `criteria-management.ts` does NOT contain hardcoded model names (`gpt-4-turbo`, `gpt-4o-mini`, `whisper-1`) | RED — model names present in routing table at lines ~349–355 |
| MAT-T-AIMC-016 | `ai-scoring.ts` does NOT contain hardcoded model names (`gpt-4-turbo`, `gpt-4o-mini`) | RED — model names present in ai-scoring.ts |
| MAT-T-AIMC-017 | No direct provider SDK imports (`openai`, `@anthropic-ai/*`, `@mistralai/*`) in MAT src files | GREEN — regression guard (currently passes) |
| MAT-T-AIMC-018 | `modules/mat/.env.example` does NOT contain `OPENAI_API_KEY` or raw model key variables | GREEN — regression guard (Wave 7 already cleaned this) |
| MAT-T-AIMC-019 | `BUILD_PROGRESS_TRACKER.md` Wave 8 entry is NOT "COMPLETE" yet (must remain BLOCKED until api-builder delivers) | RED — entry currently says "BLOCKED — Awaiting AIMC Wave 4" (this RED will flip to GREEN after implementation) |
| MAT-T-AIMC-020 | `analysis-service.ts` imports `AICentre` (or `AICentreGateway`) — gateway pattern confirmed | RED — file does not exist yet |

**Test implementation pattern** (follow Wave 7 aimc-advisory.test.ts exactly):
- Use `vitest` (`describe`, `it`, `expect`)
- Use `node:fs` and `node:path` for file existence/content checks
- `process.cwd()` resolves from repo root
- File existence tests: `expect(fs.existsSync(filePath)).toBe(true)`
- Content checks: `expect(content).toContain('...')` or `expect(content).not.toContain('...')`
- Import checks: `expect(content).toMatch(/import.*AICentre/)`

---

## Expected RED Test Run Output

After delivery, running the MAT tests should show:

```
FAIL  modules/mat/tests/aimc-analysis/aimc-analysis.test.ts
  MAT-T-AIMC-011 ❌ FAIL — analysis-service.ts does not exist
  MAT-T-AIMC-012 ❌ FAIL — analysis-service.ts does not exist
  MAT-T-AIMC-013 ❌ FAIL — analysis-service.ts does not exist
  MAT-T-AIMC-014 ❌ FAIL — analysis-service.ts does not exist
  MAT-T-AIMC-015 ❌ FAIL — gpt-4-turbo found in criteria-management.ts
  MAT-T-AIMC-016 ❌ FAIL — gpt-4-turbo found in ai-scoring.ts
  MAT-T-AIMC-017 ✅ PASS — regression guard (no direct SDK imports)
  MAT-T-AIMC-018 ✅ PASS — regression guard (.env.example clean)
  MAT-T-AIMC-019 ❌ FAIL — Wave 8 entry says BLOCKED (RED — expected pre-implementation)
  MAT-T-AIMC-020 ❌ FAIL — analysis-service.ts does not exist

8 failing, 2 passing — RED gate confirmed
```

All prior Wave 1–7 tests (modules/mat/tests/) MUST remain GREEN (no regressions).

---

## Acceptance Criteria (Foreman QP Review)

- [ ] Phase 1 PREFLIGHT evidenced in deliverable (preflight attestation block present)
- [ ] `modules/mat/tests/aimc-analysis/aimc-analysis.test.ts` created
- [ ] 10 tests present: MAT-T-AIMC-011 to MAT-T-AIMC-020
- [ ] Tests MAT-T-AIMC-017 and MAT-T-AIMC-018 pass GREEN (regression guards)
- [ ] Tests MAT-T-AIMC-011–016, MAT-T-AIMC-019, MAT-T-AIMC-020 fail RED (expected)
- [ ] All prior Wave 1–7 tests pass GREEN (zero regressions)
- [ ] Session memory present and complete
- [ ] Parking station entry appended

---

*Issued by: foreman-v2-agent v6.2.0 | Authority: CS2 (@APGI-cmy) | 2026-02-26*
