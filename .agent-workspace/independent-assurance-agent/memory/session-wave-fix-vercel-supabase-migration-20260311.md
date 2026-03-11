---
session_id: session-wave-fix-vercel-supabase-migration-20260311
date: 2026-03-11
agent_version: independent-assurance-agent v6.2.0
pr_reviewed: "copilot/fix-vercel-supabase-migration — maturion-isms#1057"
invoking_agent: foreman-v2-agent
producing_agent: foreman-v2-agent
producing_agent_class: foreman
pr_category: "MIXED (CI_WORKFLOW + AAWP_MAT)"
checks_executed: 24
checks_passed: 19
checks_failed: 3
merge_gate_parity_result: FAIL
verdict: REJECTION-PACKAGE
token_reference: IAA-session-wave-fix-vercel-supabase-migration-20260311-REJECTION
failures_cited:
  - "CORE-018/CORE-015/A-021: PREHANDOVER proof and session memory not committed (untracked files)"
  - "OVL-CI-005: No CI evidence in PREHANDOVER for modified workflow (bare assertion only)"
  - "A-026: SCOPE_DECLARATION.md stale — shows prior wave content, not updated for this PR"
adoption_phase_at_time_of_verdict: PHASE_B_BLOCKING
prior_sessions_reviewed:
  - session-wave-wf-contract-audit-20260310
  - session-wave16-full-batch-20260310
  - session-wave16-orchestration-20260309-R2
  - session-wave16-orchestration-20260309
  - session-waveOVLINJ-20260307
fail_only_once_rules_applied:
  - "A-001 (invocation evidence): ABSENT in committed bundle → contributed to CORE-013/CORE-018 FAIL"
  - "A-021 (commit before invocation): VIOLATED — PREHANDOVER and session memory untracked at invocation time"
  - "A-026 (SCOPE_DECLARATION must match diff): VIOLATED — stale content from prior wave"
  - "A-032 (schema column compliance): APPLIED — ADD CONSTRAINT DDL reviewed; action column verified via CI evidence; PASS"
fail_only_once_updates: none — no new recurring pattern requiring new FAIL-ONLY-ONCE entry; A-021 and A-026 already codified
---

# IAA Session Memory — session-wave-fix-vercel-supabase-migration-20260311

## Context

This session audited the wave-fix-vercel-supabase-migration PR (maturion-isms#1057).
The wave consists of two changes:
1. Migration SQL fix: `NOT VALID` added to `audit_logs_action_check` CHECK constraint
2. CI workflow enhancement: migration error diagnostics added to both migration steps in `deploy-mat-vercel.yml`

POLC violation on record: INC-VERCEL-MIGRATION-PREBRIEF-IMPL-001 (implementation before Pre-Brief).

## Verdict Summary

**REJECTION-PACKAGE** — 3 failures, 19 passes.

## Failures Cited

### FAILURE-1: CORE-018 / CORE-015 / A-021 — PR bundle incomplete

The PREHANDOVER proof and session memory files were NOT committed to the branch at the time of IAA invocation.

Evidence:
- `git status` output: `??` (untracked) for both PREHANDOVER and session memory
- `git show 4bb5070 --name-only`: HEAD commit contains only the Pre-Brief artifact
- `git diff origin/main...HEAD --name-only`: 3 files only (Pre-Brief, workflow, migration SQL)

The PREHANDOVER proof existed on disk but as an untracked file — not part of the committed PR bundle. IAA verifies committed artifacts per FAIL-ONLY-ONCE A-021. Working-tree-only files fail the evidence sweep.

### FAILURE-2: OVL-CI-005 — No CI evidence for modified workflow

`.github/workflows/deploy-mat-vercel.yml` was modified. The workflow triggers on `pull_request:` for paths matching both modified files in this PR. Self-referential exception DOES NOT apply.

PREHANDOVER (on disk, uncommitted) contains only "Verified via file review" — a bare assertion. Pre-Brief §OVL-CI-005 explicitly stated: "Bare claim of 'workflow looks correct' without evidence = REJECTION-PACKAGE."

IAA ran yamllint locally (§4.3 parity): YAML structurally valid; line-length style warnings only (pre-existing). This evidence is available for inclusion in the re-invocation PREHANDOVER.

### FAILURE-3: A-026 — SCOPE_DECLARATION.md stale

Root SCOPE_DECLARATION.md shows wave-criteria-display-bugfix content from a prior wave. Not updated for this PR. Required to match `git diff --name-only origin/main...HEAD` exactly before IAA invocation.

## Substance Assessment (Passed)

The technical changes are correct and do not require rework:

- **NOT VALID constraint fix**: Correct PostgreSQL approach for adding CHECK constraint with pre-existing non-conforming rows. Idempotency guard (`pg_constraint` check) correctly implemented. Semantics verified.
- **CI workflow logic**: SUPABASE_DB_URL empty-check, ON_ERROR_STOP=1 on psql, FAILED_MIGRATION variable pattern with break, ::error:: annotations, symmetric treatment of both migration steps — all correct.
- **No regression**: No pre-existing gates removed; no injection vectors; no hardcoded secrets; no silent failure paths.

The re-invocation should PASS on all substance checks. The failures are governance ceremony only.

## Learning Notes

1. **A-021 third consecutive invocation**: This is the third consecutive Foreman wave where A-021 was violated at IAA invocation time (wave-wf-contract-audit, wave-criteria-display-bugfix, wave-fix-vercel-supabase-migration). The pattern is consistent with the Foreman treating CI-fix/bugfix tasks as exempt from ceremony. A-021 is not a new rule (codified from session-090/091). Machine enforcement via polc-boundary-gate.yml detecting SQL/YAML edits (S-WFVSM-001) is the correct solution. Escalate to CS2.

2. **A-026 persistent**: SCOPE_DECLARATION.md staleness continues to be a recurring finding. The Foreman's PREHANDOVER scope section (when committed) accurately reflects the intent — but the root-level SCOPE_DECLARATION.md requires a separate update step. This step is being missed consistently. Suggest adding an explicit "Update SCOPE_DECLARATION.md" step to the Foreman's pre-IAA checklist.

3. **OVL-CI-005 resolvable quickly**: The yamllint evidence IAA ran during §4.3 parity is sufficient to satisfy OVL-CI-005 Option B. The Foreman can include this in the re-invocation PREHANDOVER without needing a full CI run (given SUPABASE_DB_URL unavailability in PR context).

4. **Substance quality is good**: The technical implementation is correct. The migration fix is the right approach for this PostgreSQL scenario. The CI diagnostic improvements are well-implemented. The re-invocation will pass on all substantive checks if the ceremony issues are resolved.

## Suggestions for Improvement

**S-WFVSM-002** (session-wave-fix-vercel-supabase-migration-20260311): A-021 has now occurred three consecutive times on Foreman CI-fix/bugfix waves. Machine enforcement is the correct deterrent. `polc-boundary-gate.yml` should be extended to detect when `foreman-v2-agent` commits SQL files (`*.sql`) or workflow files (`.github/workflows/*.yml`) without a preceding committed `wave-current-tasks.md` and Pre-Brief artifact on the same branch. This would have caught this violation before IAA invocation.

**S-WFVSM-003**: The OVL-CI-005 self-referential exception criteria should be pre-evaluated and documented in the Pre-Brief artifact (as it was in this pre-brief). The Foreman's PREHANDOVER template should include an OVL-CI-005 mandatory section with three fields: (1) "self-referential exception applies: YES/NO", (2) "evidence type: CI_RUN_URL / YAMLLINT / ACTIONLINT", (3) "evidence content: [paste here]". An empty evidence content field in a submitted PREHANDOVER = automatic OVL-CI-005 fail without requiring a separate IAA finding.

## Parking Station

Entries appended to `.agent-workspace/independent-assurance-agent/parking-station/suggestions-log.md`:
- S-WFVSM-002: Machine enforcement for Foreman CI-fix SQL/YAML commit detection
- S-WFVSM-003: OVL-CI-005 mandatory section in Foreman PREHANDOVER template

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 | Contract v2.2.0
**Adoption Phase**: PHASE_B_BLOCKING
