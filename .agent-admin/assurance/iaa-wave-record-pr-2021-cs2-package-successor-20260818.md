# IAA Wave Record - PR #2021 CS2 Package Successor Evidence

Wave: `pr-2021-cs2-package-successor-20260818`
Date: 2026-08-18
Repository: `APGI-cmy/maturion-isms`
Branch: `apgi-cmy-mmm-2000-replacement-lane`
PR: #2021
CURRENT_HEAD_SHA: `5edeaffa751ee0e431451024a20c63095bad84e4`
Scope record: `.agent-admin/scope-declarations/scope-declaration-interim-cs2-iaa-remediation-20260814.md`

## PRE-BRIEF

EXPECTED_QA_SCOPE:
- Verify the live PR head is the exact package successor head `5edeaffa751ee0e431451024a20c63095bad84e4` rather than the stale tracker-only `349fa085` substitution.
- Verify `35a888f4` and `5edeaffa` remain the exact active package lineage in this branch.
- Verify the replacement PR is bound to the current head and that the current head is revalidated after branch restoration.
- Verify hosted checks are green on the exact live head before any merge posture assertion.
- Verify IAA evidence is generated only after the replacement PR and live head are aligned.

EXPECTED_FAILURE_MODES:
- Stale substitution head with unrelated tracker-only edit remains live on the PR.
- A valid package head is present but the live PR head is not exactly bound to it.
- Hosted check evidence is stale or unbound to the actual PR head.
- IAA verdicts are generated without exact-head continuity or before a valid replacement PR exists.

FOREMAN_INSTRUCTIONS:
- Restore the live PR to the safeguarded CS2 package head before any merge claim.
- Treat exact SHA equality as the authoritative truth source.
- Only proceed to IAA when the live PR head matches the expected package head and all hosted checks are green.

IAA_WILL_QA:
- IAA will verify the exact live head matches the approved package head.
- IAA will verify the replacement PR is the active evidence carrier for this closure.
- IAA will verify hosted checks are green on that exact head.
- IAA will verify the evidence chain is coherent and not stale.

RESULT: PREFLIGHT_BRIEF_COMPLETE

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "pr-2021-cs2-package-successor-20260818"
  pr: "#2021"
  current_head_sha: "5edeaffa751ee0e431451024a20c63095bad84e4"
  branch: "apgi-cmy-mmm-2000-replacement-lane"
  qualifying_tasks:
    - "Restore live PR evidence to the exact CS2 package successor head."
    - "Rebind hosted checks to the replacement PR head."
    - "Issue IAA PASS only after exact-head and hosted-check continuity is proven."
  expected_qa_scope:
    - "Exact SHA continuity"
    - "Replacement PR authorization"
    - "Hosted CI verification on exact head"
    - "Final IAA PASS token issuance"
  result: "PREFLIGHT_BRIEF_COMPLETE"
```
