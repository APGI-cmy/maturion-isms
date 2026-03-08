# Wave Current Tasks — foreman-v2-agent — wave15r-impl

**Wave**: wave15r-impl
**Branch**: copilot/commission-api-ui-qa-builders
**Issue**: maturion-isms#997 — Wave 15R: Foreman orchestration — commission api-builder, ui-builder, and qa-builder for end-to-end criteria parsing pipeline
**Date**: 2026-03-08
**Session**: session-wave15r-impl-20260308
**CS2 Authorization**: Issue #997 opened directly by @APGI-cmy
**Protocol Reference**: IAA_PRE_BRIEF_PROTOCOL.md v1.1.0 §Trigger
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave15r-impl.md` — COMMITTED (SHA fa924ed)
**Ceremony Model**: Option B — Consolidated PR (all batches on single PR copilot/commission-api-ui-qa-builders)

---

## Wave Context

**Wave Slug**: wave15r-impl
**Summary**: Wave 15 was declared complete on 2026-03-06 but confirmed FAILED in production on 2026-03-08 by CS2.
Root cause: Edge Function never deployed; `AI_GATEWAY_URL` not configured; UI missing document list, retry mechanism, and inline error log.
This implementation session commissions Batch A (api-builder), Batch B (ui-builder), and Batch C (qa-builder) to fully remediate INC-WAVE15-PARSE-001.

**Remediation of**: INC-WAVE15-PARSE-001 (OPEN → REMEDIATED upon wave closure)

---

## Outstanding Tasks

| # | Task ID | Task | Builder | Status |
|---|---------|------|---------|--------|
| 1 | T-W15R-API-001 | Verify `invoke-ai-parse-criteria` Edge Function is deployed and returns HTTP 200 for valid input | api-builder | 🔴 PENDING |
| 2 | T-W15R-API-002 | Confirm `AI_GATEWAY_URL` resolves correctly from Edge Function runtime | api-builder | 🔴 PENDING |
| 3 | T-W15R-API-003 | End-to-end verification: Edge Function → AI Gateway → DB write-back | api-builder | 🔴 PENDING |
| 4 | T-W15R-API-004 | Verify/fix any stub issues in `apps/mat-ai-gateway/services/parsing.py` (may be N/A) | api-builder | 🔴 PENDING |
| 5 | T-W15R-API-PLAN | Update `modules/mat/03-implementation-plan/implementation-plan.md` with Batch A findings | api-builder | 🔴 PENDING |
| 6 | T-W15R-UI-001 | Add uploaded documents list to `CriteriaUpload.tsx` with parse status badge per document | ui-builder | ⛔ BLOCKED (Batch A gate) |
| 7 | T-W15R-UI-002 | Add per-document "Parse Now" retry button | ui-builder | ⛔ BLOCKED (Batch A gate) |
| 8 | T-W15R-UI-003 | Add inline error log per document in `CriteriaUpload.tsx` (FR-103 full implementation) | ui-builder | ⛔ BLOCKED (Batch A gate) |
| 9 | T-W15R-UI-004 | Ensure `useParseStatus` polling hook reflects real Edge Function status (not silent failure) | ui-builder | ⛔ BLOCKED (Batch A gate) |
| 10 | T-W15R-QA-001 | Write 5 RED→GREEN tests (T-W15R-UX-001 to T-W15R-UX-005) | qa-builder | ⛔ BLOCKED (Batch B gate) |
| 11 | T-W15R-QA-002 | Confirm all 14 original Wave 15 tests (T-W15-CP-001 to T-W15-CP-014) remain GREEN | qa-builder | ⛔ BLOCKED (Batch B gate) |
| 12 | T-W15R-QA-003 | All 5 new Wave 15R tests GREEN after Batch B implementation | qa-builder | ⛔ BLOCKED (Batch B gate) |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE | ❌ BLOCKED (hard gate) | ⛔ BLOCKED (gated on prior batch)

---

## Wave Completion Gate

- [x] IAA Pre-Brief committed (`.agent-admin/assurance/iaa-prebrief-wave15r-impl.md`)
- [x] wave-current-tasks.md updated for wave15r-impl
- [x] Ceremony model declared: Option B (consolidated PR)
- [ ] Batch A: T-W15R-API-001 through T-W15R-API-PLAN — api-builder DELIVERED
- [ ] Batch A QP evaluation: PASS
- [ ] CST Gate A→B: PASS evidence committed to branch
- [ ] Batch B: T-W15R-UI-001 through T-W15R-UI-004 — ui-builder DELIVERED
- [ ] Batch B QP evaluation: PASS
- [ ] CST Gate B→C: PASS evidence committed to branch
- [ ] Batch C: T-W15R-QA-001 through T-W15R-QA-003 — qa-builder DELIVERED
- [ ] Batch C QP evaluation: PASS
- [ ] All 19 tests GREEN (14 original + 5 new)
- [ ] QP evaluation: PASS
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] IAA ASSURANCE-TOKEN received
- [ ] CS2 notified for merge approval
- [ ] INC-WAVE15-PARSE-001 status updated to REMEDIATED

## Re-Anchor Pulse Data

**Last Re-Anchor**: 2026-03-08T12:42:00Z
**Branch**: copilot/commission-api-ui-qa-builders
**Active PREHANDOVER**: PENDING
**Wave Completion**: IN PROGRESS
