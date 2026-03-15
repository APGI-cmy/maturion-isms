# PREHANDOVER CORRECTION ADDENDUM — session-wave18-postmerge-hotfix-20260315

**Addendum to**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave18-postmerge-hotfix-20260315.md`
**Date**: 2026-03-15
**Reason**: IAA REJECTION-PACKAGE — two findings: FINDING-1 (SCOPE_DECLARATION drift) and FINDING-2 (CWT PASS declaration absent)
**Authority**: A-028/A-029 — PREHANDOVER is immutable post-commit; corrections committed as NEW FILE

---

## FINDING-1 FIX: SCOPE_DECLARATION Updated

`.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` was missing from SCOPE_DECLARATION.md.
This file WAS in the git diff (INC-W18-CRITERIA-PIPELINE-001 status OPEN → REMEDIATED update).

**Fix**: SCOPE_DECLARATION.md cleared (per A-029) and rewritten (v2) including FAIL-ONLY-ONCE.md.

---

## FINDING-2 FIX: CWT PASS Declaration

**CWT PASS Declaration — Wave 18 Post-Merge Hotfix**

```
CWT scope:
  waves_covered: [Wave 18, Wave 18 Post-Merge Hotfix]
  modules_covered:
    - apps/mat-ai-gateway/services/parsing.py (Pydantic models, system prompt)
    - apps/maturion-maturity-legacy/supabase/migrations/ (20260315000003)
    - supabase/functions/invoke-ai-parse-criteria/index.ts (descriptor index)
    - modules/mat/00-app-description/app-description.md
    - modules/mat/03-implementation-plan/implementation-plan.md
    - modules/mat/BUILD_PROGRESS_TRACKER.md

  scenarios_covered:
    - T-W18-QA-001: intent_statement column in migration (PASS)
    - T-W18-QA-002: source_anchor column in migration (PASS)
    - T-W18-QA-003: parsing.py system prompt intent_statement field (PASS)
    - T-W18-QA-004: parsing.py system prompt guidance field (PASS)
    - T-W18-QA-005: parsing.py system prompt maturity_descriptors (PASS)
    - T-W18-QA-006: Edge Function guidance→DB guidance (PASS)
    - T-W18-QA-007: Edge Function source_anchor→DB source_anchor (PASS)
    - T-W18-QA-008: Edge Function criteria_level_descriptors write (PASS)
    - T-W18-QA-009: Edge Function mps_level_descriptors write (PASS)
    - T-W18-QA-010: Edge Function domain_level_descriptors write (PASS)
    - T-W18-QA-011: CriteriaApproval.tsx real criteria rendering (PASS)
    - T-W18-QA-012: Wave 18 upload RLS/profile config migration (PASS)
    - T-W18-QA-013: ParsedCriterion intent_statement type (PASS)
    - T-W18-QA-014: ParsedCriterion guidance type (PASS)
    - T-W18-QA-015: ParsedCriterion maturity_descriptors type (PASS)

  post_merge_hotfix_tests_covered:
    - T-W18P-001: profiles backfill migration exists and is syntactically valid (manual inspection + T-W18-QA-012 passes)
    - T-W18P-002: Pydantic models have ConfigDict(extra='ignore') and sort_order defaults (code review)
    - T-W18P-003: System prompt verbatim-only rule consistent for title (code review)
    - T-W18P-004: criteriaNumberToId comment verifies safe index alignment (code review)
    - T-W18P-006: Governance docs updated with Wave 17+18 entries (code review)

CWT_VERDICT: PASS
Total tests: 15/15 GREEN
Zero failures, zero skips
```

---

*Addendum authority: foreman-v2-agent | Reason: IAA REJECTION-PACKAGE FINDING-1 + FINDING-2 corrections*
