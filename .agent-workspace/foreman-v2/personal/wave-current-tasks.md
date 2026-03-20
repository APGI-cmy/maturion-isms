# Wave Current Tasks — foreman-v2-agent

**Session ID**: session-markdown-rewrite-remediation-20260320
**Wave Slug**: markdown-rewrite-remediation
**Issue**: #1184 — Remediation List for the Markdown Rewrite
**Branch**: copilot/remediation-list-markdown-rewrite
**Date**: 2026-03-20
**Status**: IN PROGRESS

---

## IAA Pre-Brief

```yaml
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-markdown-rewrite-remediation-20260320.md
iaa_prebrief_status: COMMITTED (SHA: c545f24)
```

---

## Wave Objective

Revise `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` to be more comprehensive and source-faithful to the original Word document, while preserving the existing document's strong structure, clean hierarchy, and readable product-spec style.

---

## Tasks

| ID | Task | Agent | Status |
|----|------|-------|--------|
| T-MRR-001 | Revise ROADMAP_APP_DESCRIPTION_v3.0.md per 10-item remediation list from Issue #1184 | mat-specialist | PENDING |

---

## Task Details

### T-MRR-001 — Revise ROADMAP_APP_DESCRIPTION_v3.0.md

**Agent**: mat-specialist
**File to modify**: `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md`
**Source reference**: `modules/maturity-roadmap/00-app-description/Lucara_Diamond_Control_Standard_V4.md` (per IAA pre-brief advisory)

**Priority 1 (Must Fix):**
1. Separate source-derived requirements from inferred enhancements (label inferred content as "Inferred Design Recommendation", "Suggested Enhancement", or "Implementation Proposal")
2. Preserve source ambiguity — "implementation users" vs "build users", "other organisations" phrasing, open conceptual areas
3. Strengthen "continuous live score" concept in Purpose/Overview, Audit Configuration/Scoring Logic, Dashboard, AI, Evidence sections
4. Expand evidence governance section substantially with: upload/connect/classification, acceptance/query/rejection/escalation, override/not-relevant handling, budget/skills constraints, freshness/staleness, re-evaluation, traceability, document vs live evidence, human override logging
5. Strengthen dashboard's company-wide visibility/wow-factor — live display, broad visibility, achievement celebration, company screens

**Priority 2 (Should Fix):**
6. Clarify post-subscription structure note (source has 2 main aspects; Markdown restructures as 3 parts — add acknowledgement note)
7. Clarify free assessment boundary (mainly MPS level, criteria/evidence after subscription, prompt if not done, baseline locked)
8. Preserve open conceptual notes from source in dedicated section ("Open Design Notes from Source" or similar)

**Priority 3 (Nice to Improve):**
9. Reduce over-formalization (label/remove architecture language beyond the Word file)
10. Add "Source Fidelity Notes" appendix

**IAA Pre-Brief acceptance bar**:
- CORE-007: No placeholder content (STUB/TODO/FIXME/TBD)
- DOC-FFA-001: Only ROADMAP_APP_DESCRIPTION_v3.0.md in diff
- DOC-FFA-002: All 5 Priority 1 items visibly addressed
- DOC-FFA-003: Priority 2 items 6–8 addressed
- DOC-FFA-004: Priority 3 items 9–10 (advisory only)
- DOC-FFA-005: Source fidelity — no over-specification beyond source
- DOC-FFA-006: Version header accurate
- DOC-FFA-007: No new stub sections
- PREHANDOVER proof committed before IAA invocation
- Session memory committed before IAA invocation

---

## Exit Criteria

- [ ] T-MRR-001 delivered and QP PASS
- [ ] PREHANDOVER proof written
- [ ] Session memory written  
- [ ] IAA invoked and ASSURANCE-TOKEN received
- [ ] Token ceremony complete
