# Wave Current Tasks — foreman-v2-agent — Wave 18 Post-Merge Hotfix

**Wave**: Wave 18 Post-Merge Hotfix — RLS, AI Pydantic, Prompt, Index, Artifacts, IAA
**Session**: session-wave18-postmerge-hotfix-20260315
**Date**: 2026-03-15
**Branch**: copilot/fix-wave-18-post-merge-hotfixes
**Triggering Issue**: maturion-isms#1116 — "Wave 18 Post-Merge Hotfix & QA/Governance Tasks"
**CS2 Authorization**: Issue opened by CS2 (@APGI-cmy) and references Wave 18 merge (PR #1115); constitutes valid CS2 wave-start authorization per foreman contract §2.1
**Agent**: foreman-v2-agent v6.2.0
**Mode**: POLC-Orchestration
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md` — COMMITTED

---

## Wave Scope

Post-merge hotfixes for Wave 18 (PR #1115 merged). Seven tasks identified by CS2:

| # | Task ID | Description | Delegated To | Status |
|---|---------|-------------|--------------|--------|
| 1 | T-W18P-001 | Fix RLS: restore org-path-prefix isolation, address profiles row gaps | schema-builder | PENDING |
| 2 | T-W18P-002 | Verify/fix Pydantic serialization for AI fields (CriterionResult, MpsResult, DomainResult) | api-builder | PENDING |
| 3 | T-W18P-003 | Eliminate verbatim-only rule contradictions in AI system prompt | api-builder | PENDING |
| 4 | T-W18P-004 | Verify/correct descriptor index alignment in Edge Function | api-builder | PENDING |
| 5 | T-W18P-005 | IAA QA invocation — Wave 18 overall QA review + IAA token | independent-assurance-agent | PENDING |
| 6 | T-W18P-006 | Update governance artifacts (FRS/TRS, App Description, Implementation Plan, Progress Tracker) | mat-specialist | PENDING |
| 7 | T-W18P-007 | IAA Pre-Brief confirmed at .agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md | Foreman | COMPLETE ✅ |

---

## Re-Anchor Pulse

```yaml
re_anchor_pulse:
  status: IAA_PRE_BRIEF_COMMITTED
  tasks_done: 1
  tasks_pending: 6
  iaa_prebrief: .agent-admin/assurance/iaa-prebrief-wave18-postmerge-hotfix-20260315.md
  iaa_assurance_token: PENDING
  session: session-wave18-postmerge-hotfix-20260315
  date: 2026-03-15
```

---

*Wave authorized by CS2 — maturion-isms#1116. POLC-Orchestration mode. No Foreman implementation.*
