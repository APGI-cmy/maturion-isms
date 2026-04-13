# IAA Pre-Brief — CI Gateway Fix Wave

**Artifact Type**: IAA Pre-Brief (Phase 0 — Retroactive, per CS2 Re-Alignment Directive 2026-03-12)
**Wave**: ci-gateway-fix-20260312
**Branch**: copilot/fix-ci-gateway-failure
**Issue**: maturion-isms#1085 — CI Gateway Failure: Deploy Preview & agent-contract/authority-check
**PR**: maturion-isms#1086 (open — target: main)
**Pre-Brief Session**: session-prebrief-ci-gateway-fix-20260312
**Date**: 2026-03-12
**IAA Version**: independent-assurance-agent v6.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## ⚠️ RETROACTIVE NOTICE

This Pre-Brief is issued **retroactively** per the CS2 Re-Alignment Directive of 2026-03-12.

The prior foreman-v2-agent session (`session-ci-gateway-fix-20260312`) made CI file changes
(`.github/workflows/deploy-mat-vercel.yml`) and a lockfile change (`pnpm-lock.yaml`) and
committed session memory before this Pre-Brief existed on the branch. This constitutes:

| Violation | Rule | Status |
|-----------|------|--------|
| Pre-Brief absent when implementation work commenced | A-031 (PRE-BRIEF-BEFORE-DELEGATION) | CONFIRMED — acknowledged |
| No minimum complexity threshold for governance sequence | A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION) | CONFIRMED — acknowledged |
| Violation class | INC-BOOTSTRAP-IMPL-001 | CONFIRMED |

**Per A-031 permanent rule**: "A retroactively committed Pre-Brief created after implementation
work has begun does **NOT** satisfy this rule." This Pre-Brief therefore serves as:
1. A governance evidence artifact — confirming the CS2 FAIL-ONLY-ONCE learning loop activation
2. The required final audit scaffolding — declaring all checks IAA will run before merge
3. A permanent incident record in the CI gateway wave governance chain

This Pre-Brief does **NOT** retroactively cure the A-031/A-033 violations. The violations are
recorded and acknowledged. CS2 has directed the retroactive ceremony be completed before merge.

---

## Phase 1 Preflight Attestation

```yaml
agent_id: independent-assurance-agent
agent_version: 6.2.0
contract_version: 2.2.0
bootstrap_called_first: true
contract_yaml_read: true
tier2_knowledge_loaded: true
tier2_files_present:
  - index.md: PRESENT
  - FAIL-ONLY-ONCE.md: PRESENT (v2.5.0 — A-032 current, A-033 in foreman registry)
  - iaa-core-invariants-checklist.md: PRESENT (v2.8.0)
  - iaa-trigger-table.md: PRESENT (v2.1.0)
  - iaa-category-overlays.md: PRESENT
  - session-memory-template.md: PRESENT
  - IAA_AGENT_CONTRACT_AUDIT_STANDARD.md: PRESENT
  - IAA_ZERO_SEVERITY_TOLERANCE.md: PRESENT
canon_inventory_check: PASS (191 canons, 0 null/placeholder hashes; canon_entry_schema key is a schema definition, not a canon entry)
iaa_canon_present: PRESENT (governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md)
breach_registry_status: CLEAR — no open breaches (stub created session-153; no entries)
recent_sessions_reviewed:
  - session-wave-upload-doclist-fix-20260308-R2
  - session-wave-upload-doclist-fix-20260308
  - session-wave-wf-contract-audit-20260310
  - session-wave15r-gov-20260308-R2
  - session-wave15r-gov-20260308
unresolved_items_from_prior_sessions: none
open_rejection_packages: none
adoption_phase: PHASE_B_BLOCKING — hard gate ACTIVE
```

---

## Wave Task Declaration

Tasks declared in `wave-current-tasks.md` and `session-ci-gateway-fix-20260312.md`:

| Task ID | Task Summary | Files Changed |
|---------|-------------|---------------|
| T-CI-001 | Investigate typecheck-api failure root cause | Investigation only (no file change) |
| T-CI-002 | Investigate authority-check never-fires root cause | Investigation only (no file change) |
| T-CI-003 | Sync pnpm-lock.yaml @testing-library/dom specifier | `pnpm-lock.yaml` (+3 lines) |
| T-CI-004 | Confirm --no-frozen-lockfile fix in main (PR #1084) | Confirmation only (no file change in this PR) |
| T-CI-005 | Confirm authority-check job in agent-contract-audit.yml | Confirmation only (no file change in this PR) |
| T-CI-006 | Add pnpm-lock.yaml to deploy-mat-vercel.yml paths filter | `.github/workflows/deploy-mat-vercel.yml` (+2 lines) |

**Note**: T-CI-006 is implicit in the session memory ("Filed as part of Fix B") but not listed as
an explicit task ID in wave-current-tasks.md. The `.github/workflows/deploy-mat-vercel.yml` change
IS present in commit `f865a85`. This gap (task not explicitly registered before implementation)
is consistent with the A-031/A-033 violations and is noted here for the final audit record.

---

## Trigger Category Classification

Per `iaa-trigger-table.md` v2.1.0, applying the classification decision flow:

```
1. PR contains .github/agents/ changes? → NO
2. PR contains governance/canon/ or CANON_INVENTORY.json changes? → NO
3. PR contains .github/workflows/ changes? → YES → CI_WORKFLOW → IAA MANDATORY
4. AAWP/MAT deliverable artifacts? → NO
5. governance/quality/agent-integrity/ changes? → NO
6. .agent-workspace/*/knowledge/ changes? → NO
7. N/A — step 3 already triggered
```

| Trigger Category | Applies? | Basis |
|-----------------|----------|-------|
| **CI_WORKFLOW** | **YES — MANDATORY** | `.github/workflows/deploy-mat-vercel.yml` modified |
| AGENT_CONTRACT | NO | No `.github/agents/*.md` changes |
| CANON_GOVERNANCE | NO | No `governance/canon/` or `CANON_INVENTORY.json` changes |
| AAWP_MAT | NO | No module/package deliverables |
| AGENT_INTEGRITY | NO | No `governance/quality/agent-integrity/` changes |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` changes |
| EXEMPT | NO | CI_WORKFLOW trigger fires; AMBIGUITY RULE supersedes any exemption claim |

**Primary category**: `CI_WORKFLOW`
**Secondary category**: N/A (pnpm-lock.yaml and foreman session memory are not independently triggering)
**IAA required**: YES — MANDATORY
**AMBIGUITY CHECK**: None required. Classification is unambiguous.

---

## Qualifying Tasks for IAA Final Audit

### Task T-CI-006 (implicit) — deploy-mat-vercel.yml paths filter

| Field | Value |
|-------|-------|
| `task_id` | T-CI-006 (implicit) |
| `task_summary` | Add `pnpm-lock.yaml` to `paths:` filter on both `push` and `pull_request` triggers in `deploy-mat-vercel.yml` — ensures future lockfile changes trigger the Vercel deploy workflow |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Verdict + Handover) |
| `applicable_overlays` | CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005) |
| `specific_rules` | OVL-CI-005 Inherent Limitation Exception (S-033) applies — see §OVL-CI-005 Guidance below |

### Task T-CI-003 — pnpm-lock.yaml specifier sync

| Field | Value |
|-------|-------|
| `task_id` | T-CI-003 |
| `task_summary` | Add missing `@testing-library/dom ^10.4.0` specifier to `modules/mat/frontend` importers section in `pnpm-lock.yaml` — resolves Vercel frozen-lockfile failure |
| `iaa_trigger_category` | NOT independently triggering — carried as part of the CI_WORKFLOW PR |
| `required_phases` | Covered under CI_WORKFLOW substantive review |
| `applicable_overlays` | OVL-CI-001 (policy correctness — does the fix actually resolve the stated root cause?) |
| `specific_rules` | IAA verifies that the specifier addition matches the dependency already resolved in the lockfile; no new dependencies introduced |

---

## Checks IAA Will Run at Final Audit Handover

### FAIL-ONLY-ONCE Learning Checks

| Rule ID | Check | What IAA Verifies |
|---------|-------|------------------|
| A-001 | IAA invocation evidence present | PREHANDOVER proof or IAA token reference in PR artifacts — at minimum this Pre-Brief artifact itself, plus a PREHANDOVER proof referencing expected IAA token |
| A-002 | No class exemption claim | Foreman (foreman-v2-agent) has not claimed class exemption from IAA — foreman class is explicitly non-exempt |
| A-003 | Ambiguity resolves to mandatory invocation | N/A — category is unambiguous (CI_WORKFLOW) |
| A-031 | PRE-BRIEF-BEFORE-DELEGATION corrective action documented | Pre-Brief exists (this file); violation acknowledged; A-031 is NOT cured retroactively but corrective action evidence is present |
| A-033 | NO-COMPLEXITY-THRESHOLD-EXEMPTION — no threshold claimed | The PREHANDOVER proof must not invoke any complexity/size exemption to justify skipping governance steps |

### Core Invariant Checks (CORE-001 through CORE-022)

All 22 core invariants will be applied. The primary checks with specific relevance to this wave:

| Check ID | Check Name | Specific Relevance |
|----------|-----------|-------------------|
| CORE-005 | Governance block present | N/A for this PR category (no agent contract) — checked as baseline |
| CORE-006 | CANON_INVENTORY alignment | Confirm no canon artifacts were inadvertently modified |
| CORE-007 | No placeholder content | PREHANDOVER `iaa_audit_token` must be pre-populated with expected format, not TBD/blank |
| CORE-013 | IAA invocation evidence | This Pre-Brief artifact is evidence; PREHANDOVER proof must additionally reference expected IAA token |
| CORE-014 | No class exemption claim | Foreman is not exempt |
| CORE-015 | Session memory present | Foreman session memory `session-ci-gateway-fix-20260312.md` already committed (✅ present on branch) |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-prebrief-ci-gateway-fix-20260312.md` required (created by IAA during verdict step) |
| CORE-017 | No unauthorized .github/agents/ modifications | Confirmed — no `.github/agents/` files in PR diff |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof + session memory + `iaa_audit_token` field + dedicated token file |
| CORE-019 | IAA token cross-verification | FIRST INVOCATION EXCEPTION applies — token file will be created during this pre-brief session's output |
| CORE-020 | Zero partial pass rule | All checks executed to binary verdict |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE |

### CI_WORKFLOW Overlay Checks (OVL-CI-001 through OVL-CI-005)

| Check ID | Check Name | What IAA Will Verify |
|----------|-----------|---------------------|
| OVL-CI-001 | Workflow policy correctness | Does adding `pnpm-lock.yaml` to the `paths:` filter actually solve the stated problem? Does the filter apply to both `push` and `pull_request` triggers as required? Is the `workflow_dispatch:` trigger retained? |
| OVL-CI-002 | Merge gate integrity | Confirm no existing gate checks are removed, weakened, or made optional. Confirm the `paths:` addition is additive only. |
| OVL-CI-003 | Silent failure risk | Scan workflow for `continue-on-error: true` without justification; check that the paths filter expansion does not introduce conditions where the deploy step silently skips |
| OVL-CI-004 | Environment parity | Verify `push` trigger paths and `pull_request` trigger paths are identical (symmetric) — asymmetry would cause different behaviour in dev vs. production |
| OVL-CI-005 | CI evidence present | **Self-referential exception applies** (see §OVL-CI-005 Guidance below) |

---

## OVL-CI-005 Guidance — Self-Referential Workflow Exception (S-033)

This PR modifies `deploy-mat-vercel.yml`. The modified workflow's `push` trigger fires only on
merges to `main`. The `pull_request` trigger fires on PRs touching `modules/**`, `api/**`, etc.
This PR does NOT touch those paths (only `pnpm-lock.yaml` and `.github/workflows/deploy-mat-vercel.yml`
itself), meaning the modified workflow **will not re-fire** against this PR under the new `paths:`
filter before merge.

The `workflow_dispatch:` trigger IS present on the modified workflow (confirmed from file content).

**For the PREHANDOVER proof, Foreman must provide:**
1. **YAML syntax validation** — `actionlint` or `yamllint` clean run on the modified
   `.github/workflows/deploy-mat-vercel.yml`, with output included in PREHANDOVER
2. **Pattern parity evidence** — confirmation that the `paths:` blocks on both `push` and
   `pull_request` triggers are now symmetric (both include `pnpm-lock.yaml`), and that this
   pattern matches the established convention in other workflow files
3. **`workflow_dispatch:` confirmation** — explicitly state that `workflow_dispatch:` is
   present on the modified workflow (it is — confirmed: line present after `pull_request` block)

A bare claim of "CI passed" without these three items is insufficient per OVL-CI-005.

---

## PREHANDOVER Proof Structure Required

The Foreman must commit a PREHANDOVER proof before invoking IAA for the final audit.
The proof MUST be a new file committed to the branch. It MUST contain:

| Section | Required Content |
|---------|----------------|
| `wave` | ci-gateway-fix-20260312 |
| `branch` | copilot/fix-ci-gateway-failure |
| `session_id` | session-prebrief-ci-gateway-fix-20260312 (or the final handover session ID) |
| `issue` | maturion-isms#1085 |
| `pr` | maturion-isms#1086 |
| `iaa_prebrief_artifact` | `.agent-admin/assurance/iaa-prebrief-ci-gateway-fix-20260312.md` (this file) |
| `iaa_audit_token` | Pre-populated with expected reference: `IAA-session-prebrief-ci-gateway-fix-20260312-YYYYMMDD-PASS` |
| Artifacts table | All files changed in this PR declared explicitly (pnpm-lock.yaml, deploy-mat-vercel.yml, session memory, wave-current-tasks.md, this Pre-Brief, PREHANDOVER proof itself, IAA session memory, IAA token file) |
| A-031 acknowledgement | Explicit statement: "A-031 violation (INC-BOOTSTRAP-IMPL-001) acknowledged. Retroactive Pre-Brief committed per CS2 Re-Alignment Directive 2026-03-12." |
| A-033 acknowledgement | Explicit statement: "A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION) confirmed as violated. No complexity threshold exemption is claimed for this PR." |
| OVL-CI-005 evidence | YAML lint / actionlint output OR explicit self-referential exception claim with all 3 conditions addressed |
| SCOPE_DECLARATION note | The `SCOPE_DECLARATION.md` currently on branch belongs to wave-16.2-gap-remediation — NOT to this wave. Foreman must either: (a) add a wave-specific SCOPE_DECLARATION for ci-gateway-fix-20260312, or (b) explicitly declare all files in the PREHANDOVER artifacts table as the scope declaration for this wave. Option (b) is acceptable for CI-only waves per established practice. |

**PREHANDOVER proof file path**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-ci-gateway-fix-20260312.md`
(or equivalent — must be a new file, not the existing session memory file)

**IAA token file to be created by IAA during verdict**: `.agent-admin/assurance/iaa-token-session-prebrief-ci-gateway-fix-20260312-20260312.md`

---

## Scope Blockers and Governance Conflicts

### BLOCKER 1 — A-031 Violation (ACKNOWLEDGED — NOT a merge blocker by itself)

**Status**: ACKNOWLEDGED per CS2 directive
**Impact**: The A-031 violation is confirmed. A retroactive Pre-Brief does NOT cure A-031.
However, CS2 has directed the retroactive ceremony to be completed as a corrective action
per the FAIL-ONLY-ONCE learning loop. Merge may proceed after IAA issues ASSURANCE-TOKEN.
**Action required**: None — A-031 violation is already recorded in foreman-v2-agent's
`FAIL-ONLY-ONCE.md`. This Pre-Brief serves as the corrective action evidence artifact.

### BLOCKER 2 — PREHANDOVER Proof Missing (BLOCKING — must be resolved before IAA final audit)

**Status**: OPEN — BLOCKING
**Impact**: No PREHANDOVER proof exists on the branch for this wave. This fails CORE-018.
**Action required**: Foreman must commit a PREHANDOVER proof (structure above) before
invoking IAA for the final audit. No ASSURANCE-TOKEN can be issued without it.

### BLOCKER 3 — SCOPE_DECLARATION mismatch (MUST ADDRESS before final audit)

**Status**: OPEN — ADVISORY (not hard-blocking on its own if PREHANDOVER artifacts table covers all files)
**Impact**: The `SCOPE_DECLARATION.md` on the branch header states wave `wave-16.2-gap-remediation`
and branch `copilot/fix-criteria-modal-backend`. This file is from a prior wave and does not
correspond to this wave. At A-026 evaluation during final audit, IAA will check all files in
`git diff --name-only origin/main...HEAD` against the declared scope.
**Action required**: Foreman must either add a wave-specific SCOPE_DECLARATION.md or explicitly
address this in the PREHANDOVER proof artifacts table, invoking Option B per established practice
for CI-only waves.

### POTENTIAL FLAG — Job-Level `permissions:` Blocks (OVL-CI-006 CANDIDATE — ADVISORY)

**Status**: ADVISORY (pending CS2 formalisation as A-032/OVL-CI-006)
**Impact**: The `deploy-mat-vercel.yml` file may not have explicit `permissions:` blocks on
all jobs. IAA will verify at final audit and flag as STRONG RECOMMENDATION. This will NOT
cause REJECTION-PACKAGE unless OVL-CI-006 is formally locked before the audit runs.
**Action required**: Foreman should check and add `permissions: contents: read` to jobs
missing explicit permissions. Pre-emptive fix removes audit risk.

### NO OTHER SCOPE CONFLICTS IDENTIFIED

The pnpm-lock.yaml and deploy-mat-vercel.yml changes are contained, additive, and do not
touch production application logic, database schema, authentication, or authorization code.

---

## Scope Acceptability Assessment

| Change | Acceptable? | Basis |
|--------|-------------|-------|
| `pnpm-lock.yaml` — Add `@testing-library/dom ^10.4.0` specifier for `modules/mat/frontend` | **YES** | CI maintenance — synchronizes a dependency specifier that was missing for the package already resolved in the lockfile. The package is a dev/test dependency (`@testing-library`), not a production runtime dependency. No new package versions introduced (version `10.4.1` already present in lockfile resolutions). Root cause of Vercel frozen-lockfile failure is addressed. |
| `.github/workflows/deploy-mat-vercel.yml` — Add `pnpm-lock.yaml` to `paths:` filters | **YES** | CI maintenance — additive change to trigger paths. Both `push` and `pull_request` triggers are updated symmetrically. `workflow_dispatch:` is retained. No jobs removed or weakened. No gates softened. Fix addresses the logical gap where a lockfile change would not trigger the Vercel deploy workflow. |
| `.agent-workspace/foreman-v2/memory/session-ci-gateway-fix-20260312.md` | **YES** | Foreman session memory — governance artifact, required by foreman contract. |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | **YES** | Foreman wave tracking — governance artifact, required by foreman contract. |

**Overall scope assessment**: CI maintenance wave. No production logic changes. No schema
changes. No authentication or authorization changes. No agent contract changes. No canon
changes. **Changes are within acceptable scope for a CI maintenance PR.**

---

## Final Audit Invocation Instructions

When ready for the final IAA audit, the Foreman must:

1. **Commit PREHANDOVER proof** (structure above) to branch `copilot/fix-ci-gateway-failure`
2. **Commit SCOPE_DECLARATION or address scope in PREHANDOVER artifacts table**
3. **Invoke IAA** via task tool with action: final audit (not Pre-Brief) referencing:
   - This Pre-Brief artifact path
   - PR number: maturion-isms#1086
   - Branch: copilot/fix-ci-gateway-failure
4. **IAA will run**: Core invariants (CORE-001 through CORE-022) + CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005) + FAIL-ONLY-ONCE rules (A-001, A-002, A-031, A-033)
5. **IAA will issue**: ASSURANCE-TOKEN (if all checks pass) or REJECTION-PACKAGE (if any check fails)
6. **Merge**: CS2 authority only — after ASSURANCE-TOKEN issued

---

## Session Memory Reference

IAA session memory for this Pre-Brief invocation will be written at:
`.agent-workspace/independent-assurance-agent/memory/session-prebrief-ci-gateway-fix-20260312.md`

---

**Pre-Brief Status**: COMPLETE
**Qualifying tasks found**: 2 (T-CI-006 implicit + T-CI-003, under CI_WORKFLOW category)
**IAA adoption phase**: PHASE_B_BLOCKING — hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 | Contract 2.2.0
**Pre-Brief Date**: 2026-03-12
