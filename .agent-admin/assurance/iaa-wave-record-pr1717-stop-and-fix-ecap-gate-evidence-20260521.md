# IAA Wave Record — pr1717-stop-and-fix-ecap-gate-evidence-20260521

## PRE-BRIEF
IAA_PREFLIGHT_BRIEF
PR: #1717
ISSUE: #1718
WAVE: pr1717-stop-and-fix-ecap-gate-evidence-20260521
WAVE_TASKS_PATH: .agent-admin/prs/pr-1717/wave-current-tasks.md
CURRENT_HEAD_SHA: ACTIVE_HEAD_RESOLVED_BY_GATE
FOREMAN_OBJECTIVE: Complete STOP_AND_FIX ECAP/admin ceremony evidence and strict gate-change proof for protected-path governance PR
EXPECTED_QA_SCOPE:
- Validate resolver-selected active artifact role checks in pre-handover checkpoint
- Validate PR-scoped wave-current-tasks push/safety-net routing in iaa-prebrief-inject workflow
- Verify ECAP/admin ceremony evidence present and PR-bound for protected-path changes
EXPECTED_FAILURE_MODES:
- Missing ECAP artifacts for protected-path PR
- Gate-change evidence incomplete or no-weakening assurance missing
- Historical artifact bleed-through in active-state selection
FOREMAN_INSTRUCTIONS:
- Keep PR-scoped active-state artifacts authoritative
- Do not regenerate evidence solely for rebase/admin-only SHA movement
- Require strict gate-change evidence for script/workflow control updates
IAA_WILL_QA:
- ECAP/admin evidence presence and current PR identity binding
- Gate-change evidence completeness and test coverage
- Active-state artifact role integrity
RESULT: PREFLIGHT_BRIEF_COMPLETE

Status: ACTIVE
