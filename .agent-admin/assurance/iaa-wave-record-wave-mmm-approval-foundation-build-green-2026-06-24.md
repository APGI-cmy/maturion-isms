# IAA Wave Record - MMM Approval Foundation Build-to-GREEN

Wave: `wave-mmm-approval-foundation-build-green-2026-06-24`
Date: 2026-06-24
Repository: `APGI-cmy/maturion-isms`
Branch: `foreman/mmm-approval-foundation-build-green`
PR: pending
CURRENT_HEAD_SHA: pending
Scope record: `.agent-admin/scope-declarations/wave-mmm-approval-foundation-build-green-2026-06-24.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify executable failing tests are created before runtime implementation.
- Verify tests cover canonical approval function names from `approval-workflow-db-api-contract.md`.
- Verify tests reject non-canonical approval aliases.
- Verify tests cover approval round, proposed change, decision, Level 1 response, and lock transition request/response contracts.
- Verify tests cover notification, audit, and AI learning event expectations.
- Verify implementation stays within approval foundation scope and does not implement Level 2 UI, Level 3 UI, published view, or evidence modal runtime.

EXPECTED_FAILURE_MODES:
- Runtime implementation before executable tests.
- Non-canonical approval API/function names.
- Direct frontend fetches that bypass typed integration client expectations.
- Approval state changes without notification/audit/AI learning events.
- Lock transition behavior that allows final-lock bypass.
- Scope creep into UI/runtime areas reserved for later implementation waves.

FOREMAN_INSTRUCTIONS:
- Build one foundation wave only.
- Require red executable tests before runtime code.
- Keep implementation minimal enough to turn scoped tests green.
- Do not implement UI-specific approval workspaces, e-mail delivery, published model runtime, or evidence modal runtime.

IAA_WILL_QA:
- IAA will verify test-first ordering.
- IAA will verify canonical naming and route/client boundaries.
- IAA will verify build scope against the Step 8 alignment addendum.
- IAA will verify no unauthorized runtime surface is introduced.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "wave-mmm-approval-foundation-build-green-2026-06-24"
  pr: "pending"
  current_head_sha: "pending"
  branch: "foreman/mmm-approval-foundation-build-green"
  qualifying_tasks:
    - "Create executable failing tests for approval workflow foundation."
    - "Implement minimal approval foundation runtime to pass tests."
    - "Preserve canonical API names, typed client boundaries, and event/lock contracts."
  required_build_gates:
    - "Executable tests before runtime code."
    - "Canonical API/function names only."
    - "No Level 2 UI runtime."
    - "No Level 3 UI runtime."
    - "No published view runtime."
    - "No evidence modal runtime."
  expected_qa_scope:
    - "Approval foundation executable tests."
    - "Typed approval client contract."
    - "Notification/audit/AI event expectations."
    - "Lock/unlock state transition expectations."
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
