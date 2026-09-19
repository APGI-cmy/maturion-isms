# OVL-CI-005 S-033 Evidence — PR #2046 PIT CS2 Controller Pilot

**PR**: #2046
**Branch**: `codex/pit-cs2-controller-pilot`
**Evidence snapshot head**: `CURRENT_HEAD`
**Date**: 2026-09-19

---

## Exception basis

**OVL-CI-005 S-033 Inherent Limitation Exception — INVOKED**

This PR modifies two governance workflows whose active routing cannot be fully proven by a same-PR hosted execution of the modified workflow definitions:

1. `/home/runner/work/maturion-isms/maturion-isms/.github/workflows/pit-cs2-controller.yml`
   - active triggers: `issues`, `issue_comment`, `pull_request_target`, `schedule`, `workflow_dispatch`
   - the `pull_request_target` path executes the workflow definition from the base branch, not the PR head
   - the remaining trusted triggers require live issue/comment/schedule state outside a standard PR check run
2. `/home/runner/work/maturion-isms/maturion-isms/.github/workflows/iaa-prebrief-inject.yml`
   - active triggers: `push` on PR-scoped task files, `issue_comment`, `workflow_dispatch`
   - the modified workflow file itself is not directly self-validating through a standard PR event

Accordingly, the required S-033 substitutes are supplied below.

---

## Substitute 1 — YAML syntax validation

Command executed locally:

```text
python - <<'PY'
import yaml
for f in [
'/home/runner/work/maturion-isms/maturion-isms/.github/workflows/pit-cs2-controller.yml',
'/home/runner/work/maturion-isms/maturion-isms/.github/workflows/iaa-prebrief-inject.yml',
'/home/runner/work/maturion-isms/maturion-isms/.github/ISSUE_TEMPLATE/cs2-work-request.yml']:
    with open(f,'r',encoding='utf-8') as fh:
        yaml.safe_load(fh)
    print(f'YAML OK: {f}')
PY
```

Observed output:

```text
YAML OK: /home/runner/work/maturion-isms/maturion-isms/.github/workflows/pit-cs2-controller.yml
YAML OK: /home/runner/work/maturion-isms/maturion-isms/.github/workflows/iaa-prebrief-inject.yml
YAML OK: /home/runner/work/maturion-isms/maturion-isms/.github/ISSUE_TEMPLATE/cs2-work-request.yml
```

Status: **PASS**

---

## Substitute 2 — Pattern parity

The modified workflows retain the repository's established governance-workflow pattern:

- explicit top-level `permissions`
- `actions/checkout@v5`
- event-context resolution through `actions/github-script@v7` or repository Node scripts
- bounded runtime dispatch rather than inline product-side mutation
- explicit `workflow_dispatch` retention for manual post-merge or deliberate operator exercise

Representative approved parity references:

- `/home/runner/work/maturion-isms/maturion-isms/.github/workflows/producer-next-action-guidance.yml`
  - trusted-default-branch checkout + `actions/github-script@v7` orchestration pattern
- `/home/runner/work/maturion-isms/maturion-isms/.github/workflows/foreman-prehandover-lane-gate.yml`
  - explicit `workflow_dispatch` retention + repository script execution pattern

Status: **PASS**

---

## Substitute 3 — `workflow_dispatch` retained

Confirmed retained on both modified workflows:

| Workflow | Evidence |
|---|---|
| `/home/runner/work/maturion-isms/maturion-isms/.github/workflows/pit-cs2-controller.yml` | `workflow_dispatch: {}` at line 15 |
| `/home/runner/work/maturion-isms/maturion-isms/.github/workflows/iaa-prebrief-inject.yml` | `workflow_dispatch: {}` at line 12 |

Status: **PASS**

---

## Exact-head supporting evidence

Focused controller validation for the same evidence snapshot head:

```text
node --test .github/scripts/pit-cs2-controller.test.js .github/scripts/pit-cs2-controller-workflow.test.js
```

Observed result:

```text
11 pass, 0 fail, 0 skipped, 0 todo
```

Additional contract-alignment/local route regressions executed on the rebased submitted head:

```text
bash .github/scripts/resolve-active-pr-state.test.sh
bash .github/scripts/iaa-preflight-contract-gate.test.sh
```

Observed result:

```text
7 pass, 0 fail
22 pass, 0 fail
```

Rebased submitted head hosted PR checks captured on `9573839a6d51f82d3917f3c5d403448ad9005161`:

- `preflight/phase-1-evidence`
- `preflight/iaa-prebrief-contract-alignment`
- `preflight/foreman-prehandover-lane-gate`
- `preflight/delegation-order-gate`
- `preflight/ecap-admin-boundary-gate`
- `preflight/merge-gate-required-checks-alignment`
- `merge-gate/verdict`
- `governance/alignment`
- `stop-and-fix/enforcement`
- `foreman-implementation-check`
- `builder-involvement-check`
- `session-memory-check`
- `CodeQL`
- `iaa-prebrief/inject`

---

These rebased-head checks are retained as the current-main submitted-head evidence snapshot. Active `CURRENT_HEAD` hosted checks must still be re-checked GREEN after the bounded admin-truth refresh commit and before final IAA/handover posture.

**OVL-CI-005 S-033 exception status**: **COMPLETE**
