# PR-SCOPED ADMIN PROOF — PR #1933

PR: #1933
ISSUE: #1932
BRANCH: codexadvisor-issue-1932-maturion-thin-core
WAVE: maturion-thin-core-20260713
STATUS: DRAFT_STOP_AND_FIX

## ECAP waiver

protected_path_touched: true
ecap_required: true
ecap_invoked: false
ceremony_admin_appointed: false
ecap_verdict: PASS_WITH_CS2_WAIVER
ecap_waiver_ref: Issue #1932 contract-only draft gate remediation

The waiver applies only to the separate ECAP bundle artifact. It does not waive current-state evidence, hosted checks, or independent IAA.

## Corrected protected state

The Maturion contract was changed after the original proof to satisfy active contract-format requirements. Those changes are substantive and are now included in this evidence.

- Current substantive protected-file commit: `213f5cb5b94461b19cbd860a706a99e5bdb45042`
- Current protected contract blob: `c6a6a086d192eee2e0c872ec268eee767a407637`
- Current immutable PREHANDOVER: `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-065-20260720.md`
- Prior IAA result: REJECTION-PACKAGE in session 1283
- Fresh independent IAA: REQUIRED after hosted checks pass on the frozen head

## Rejection remediation

- RP-1933-01: current protected commit/blob recorded.
- RP-1933-02: new immutable PREHANDOVER created.
- RP-1933-03: prior contradictory no-change statement removed.
- RP-1933-04: hosted checks must complete against the frozen post-remediation head.

## Scope

FILES_CHANGED: 11

1. `.github/agents/maturion-agent.md`
2. `.agent-admin/governance/agent-contract-diffs/diff-20260712-maturion-agent-thin-core.md`
3. `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-064-20260712.md`
4. `.agent-workspace/CodexAdvisor-agent/memory/session-064-20260712.md`
5. `.agent-admin/assurance/iaa-wave-record-maturion-thin-core-20260712.md`
6. `.admin/prs/pr-1933.json`
7. `.agent-admin/scope-declarations/pr-1933.md`
8. `.agent-admin/prs/pr-1933/wave-current-tasks.md`
9. `.agent-admin/prehandover/proof-pr-1933-maturion-thin-core-20260713.md`
10. `.agent-workspace/independent-assurance-agent/memory/session-1283-20260720.md`
11. `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-065-20260720.md`

No runtime, Tier 2, schema, migration, provider, Supabase, Vercel, or deployment change is included.

SCOPE_PARITY: RECONCILED
HANDOVER_ALLOWED: no
MERGE_AUTHORITY: CS2
FINAL_STATE: PENDING_HOSTED_CHECKS_AND_FRESH_INDEPENDENT_IAA