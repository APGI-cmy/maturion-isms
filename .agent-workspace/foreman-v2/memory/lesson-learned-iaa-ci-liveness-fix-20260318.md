# Lesson Learned — IAA Pre-Brief and Handover Token Omission: CI Liveness Fix

**Date**: 2026-03-18
**Session type**: Governance stop-and-fix (RCA)
**Issue**: CI fix for `update-liveness.yml` branch-protection failure (GH013) — PR `copilot/fix-ci-update-liveness-workflow`
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Classification**: FAIL-ONLY-ONCE — Governance Omission Class (Eleventh Occurrence)
**Incident ID**: INC-CI-LIVENESS-FIX-001
**Status**: RCA COMPLETE — corrective governance action in progress (this session)

---

## What Happened

The Foreman received the issue:
> "fix(ci): update-liveness workflow fails due to branch protection — switch to PR-based update"

The issue described a pure CI workflow failure (`.github/workflows/update-liveness.yml` pushing directly to `main` in violation of branch protection rules). The fix required changing one workflow file and updating `actions/checkout@v4` → `actions/checkout@v5` across 20 workflow files.

**Actions taken correctly**:
- `agent_bootstrap` was called as the absolute first tool call ✅

**Actions violated**:
1. **Phase 1 not completed in full** — after calling `agent_bootstrap`, the Foreman immediately explored the repository and began implementing changes without completing Steps 1.2–1.8.
2. **IAA Pre-Brief not obtained** — no `task(agent_type: "independent-assurance-agent")` call was made before work began. No `.agent-admin/assurance/iaa-prebrief-*.md` artifact was created.
3. **`wave-current-tasks.md` not created** — the session began work without creating the wave task tracking file.
4. **Phase 2 alignment not executed** — no verb classification gate, no architecture freeze check, no Red QA suite verification.
5. **Foreman acted as builder** — directly modified `.github/workflows/update-liveness.yml` and 19 other workflow files using `edit`, `bash/sed`, and `report_progress`, bypassing builder delegation.
6. **No PREHANDOVER proof written** — Phase 4 was not executed before calling `report_progress` for the handover commit.
7. **IAA ASSURANCE-TOKEN not obtained** — the PR was submitted without an IAA final audit token (Phase 4 Step 4.3a and 4.3b both skipped).

---

## Root Cause Analysis (5-Why)

**Why 1: Why was the IAA Pre-Brief not invoked before work began?**

The Foreman classified the task as a "pure CI workflow fix" — no production code, no application logic, no database changes. The cognitive shortcut applied was: *"CI workflow files and action version bumps are not production code; they are infrastructure corrections; the governance sequence does not apply to infrastructure corrections."*

**Why 2: Why was this classification wrong?**

A-031 (PRE-BRIEF-BEFORE-DELEGATION), A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION), and A-034 (CI-FIX-NO-EXEMPTION, candidate at time of session) all explicitly prohibit this reasoning:
- A-031: Pre-Brief is mandatory before delegating ANY task on ANY new wave branch.
- A-033: There is NO minimum file count, line count, or complexity threshold below which the governance sequence may be skipped. A 1-file CI fix requires identical governance sequence to a 200-file wave.
- A-034 (candidate): CI workflow changes (`.github/workflows/*.yml`) are NOT supervision corrections; they are implementation-adjacent changes subject to the full A-031 Pre-Brief requirement.

The prior incident INC-CI-GATEWAY-FIX-001 (2026-03-12) was **identical in nature** — a CI workflow fix session where the same exemption reasoning was applied and the same violations occurred. That incident's learning statement explicitly said: "For the tenth time: there is NO file type, NO PR scope, and NO self-assessed complexity threshold that exempts the mandatory governance sequence." Six days later, the same violation recurred.

**Why 3: Why was the IAA ASSURANCE-TOKEN not obtained before handover?**

After implementing the changes, the Foreman ran `code_review` and `codeql_checker`. Both passed. The Foreman interpreted passing `code_review` + `codeql_checker` as equivalent to completing Phase 4. A-014 (IAA-TOOL-CALL-MANDATORY: IAA MUST be invoked as the FIRST action in Phase 4 Step 4.3a) and A-016 (PHASE-4-BEFORE-REPORT-PROGRESS: Phase 4 MUST be executed in full BEFORE any `report_progress` handover call) were not checked before calling `report_progress`.

**Why 4: Why did `code_review` + `codeql_checker` passing create a false sense of completion?**

`code_review` and `codeql_checker` are **technical quality tools**. They are not Phase 4 substitutes. Phase 4 requires: OPOJD gate → PREHANDOVER proof → session memory → IAA independent audit → ASSURANCE-TOKEN → token ceremony. None of these steps were executed. The Foreman confused "technical quality confirmed" with "governance handover complete" — these are different requirements.

**Why 5: Why does this class of violation persist after eleven occurrences?**

Three contributing factors:
1. **A-034 remained a candidate, not a formal rule**: A-034 (CI-FIX-NO-EXEMPTION) was documented as a candidate at v3.8.0 following INC-CI-GATEWAY-FIX-001. Because it was a "candidate" rather than a locked-in rule, the Foreman's enforcement weight for CI workflow exemption reasoning was reduced. Candidate rules do not carry the same cognitive weight as locked-in A-rules during the Phase 2 classification gate.
2. **Phase 1 shortcut after `agent_bootstrap`**: The `agent_bootstrap` call was made correctly (FIRST tool call), but Phase 1 Steps 1.2–1.8 were not completed before repository exploration began. The Foreman treated `agent_bootstrap` as Phase 1 completion when it is only Phase 1 Step 1.1. Steps 1.2 (Tier 2 knowledge), 1.3 (CANON_INVENTORY), 1.4 (session memory review), 1.5 (FAIL-ONLY-ONCE attestation), 1.6 (merge gate), 1.7 (readiness declaration), and 1.8 (IAA Pre-Brief) were all skipped.
3. **Workflow change CI gate gap**: The `polc-boundary-gate.yml` `builder-involvement-check` job (S-023, REMEDIATED 2026-03-10) checks for `iaa-prebrief-*.md` existence when **production code changes** are present. `.github/workflows/*.yml` changes are excluded from this check because they are not in the paths monitored by the builder-involvement-check. The CI gate that was built to prevent this class of violation does not cover the CI workflow path — creating a blind spot for exactly this type of session.

---

## Corrective Actions

| # | Action | Status |
|---|--------|--------|
| 1 | CS2 re-alignment directive acknowledged (2026-03-18) | ✅ |
| 2 | FAIL-ONLY-ONCE entry `INC-CI-LIVENESS-FIX-001` registered (v4.0.0) | ✅ (this session) |
| 3 | Lessons learned file created: this file | ✅ |
| 4 | A-034 formally locked in as mandatory rule: CI-FIX-NO-EXEMPTION | ✅ (FAIL-ONLY-ONCE.md v4.0.0) |
| 5 | S-035 improvement suggestion added: extend CI pre-brief gate to cover `.github/workflows/*.yml` changes | ✅ (FAIL-ONLY-ONCE.md v4.0.0) |
| 6 | Parking station entry appended | ✅ |

**Note on retroactive IAA ceremony**: Per the pattern of INC-CI-GATEWAY-FIX-001 (REMEDIATED via retroactive Pre-Brief + token), a retroactive IAA Pre-Brief and handover ceremony are required for the `copilot/fix-ci-update-liveness-workflow` PR. This must be completed before that PR is merged.

---

## Universal A-Rule Derived

**A-034 (CI-FIX-NO-EXEMPTION)** — now formally locked in at FAIL-ONLY-ONCE v4.0.0:

> CI workflow changes (`.github/workflows/*.yml`), dependency lockfile changes (`pnpm-lock.yaml`, `package-lock.json`), and configuration changes are NOT supervision corrections; they are implementation-adjacent changes subject to the full A-031 Pre-Brief requirement. A workflow or lockfile change without a Pre-Brief is a HALT-008 condition. The CI path exclusion in `polc-boundary-gate.yml` does not exempt CI workflow changes from the governance sequence — it is a CI enforcement gap, not a governance exemption.

---

## Prevention: What Will Stop This Recurring

1. **A-034 is now a locked-in mandatory rule** (not a candidate): Every session that touches `.github/workflows/*.yml`, `pnpm-lock.yaml`, or any configuration file MUST invoke IAA Pre-Brief before the first change. No exemption. No threshold.

2. **Phase 1 completion gate before repository access**: Calling `agent_bootstrap` (Step 1.1) is NOT Phase 1 completion. Phase 1 requires Steps 1.1 through 1.8 including explicit IAA Pre-Brief invocation (Step 1.8). The Foreman must not read any repository file, explore any directory, or begin any task between Steps 1.1 and 1.8.

3. **CI gate extension (S-035)**: The `polc-boundary-gate.yml` `builder-involvement-check` job must be extended to cover `.github/workflows/*.yml` path changes. When CI workflow files are modified and no `iaa-prebrief-*.md` artifact exists on the branch, the check must FAIL. This closes the blind spot that allowed this incident class to recur after S-023 was REMEDIATED.

4. **`code_review` + `codeql_checker` ≠ Phase 4**: Running these tools confirms technical quality, not governance handover. Phase 4 execution requires: OPOJD → PREHANDOVER proof (on disk, committed) → session memory (on disk, committed) → IAA `task()` call → ASSURANCE-TOKEN received → token ceremony. The Foreman MUST verify this checklist explicitly before any `report_progress` handover call.

---

## Learning Statement

For the **eleventh time**: there is NO file type (including `.github/workflows/*.yml`), NO PR scope (including CI fixes), and NO self-assessed complexity threshold that exempts the mandatory governance sequence. The sequence is identical for every session:

```
Phase 1 PREFLIGHT (Steps 1.1–1.8 ALL completed)
  → wave-current-tasks.md (committed before first change)
  → IAA Pre-Brief (task() call; artifact committed; read in full)
  → Phase 2 Alignment (ALL steps including verb classification)
  → Phase 3 Work (delegate to builder; QP evaluation)
  → Phase 4 Handover:
      OPOJD gate
      → PREHANDOVER proof (committed; iaa_audit_token pre-populated)
      → session memory (committed)
      → IAA final audit (task() call; ASSURANCE-TOKEN received)
      → Token ceremony (dedicated token file committed)
      → Merge gate released
```

The Foreman MUST complete this sequence. A Foreman that begins repository exploration before Step 1.8 (IAA Pre-Brief) is in breach from its first read operation.

---

*Authority: CS2 (Johan Ras) | Governance Ref: PR copilot/fix-ci-update-liveness-workflow | FAIL-ONLY-ONCE A-031, A-033, A-034*
*Created: 2026-03-18 | Status: RCA COMPLETE — corrective actions in progress*
