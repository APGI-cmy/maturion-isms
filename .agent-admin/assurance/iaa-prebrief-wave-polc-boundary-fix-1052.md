# IAA Pre-Brief — wave-polc-boundary-fix-1052

**Pre-Brief Type**: RETROACTIVE (CS2-authorized — see §Retroactive Ceremony Declaration below)
**Wave**: wave-polc-boundary-fix-1052
**Branch**: copilot/fix-poll-validation-issue
**Issue**: maturion-isms#1052 — Bug: POLC Boundary Validation fires false positives on Copilot PRs where agent is acting as builder (not Foreman)
**Date**: 2026-03-10
**IAA Session**: session-prebrief-wave-polc-boundary-fix-1052-20260310
**IAA Agent**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Retroactive Ceremony Declaration

This Pre-Brief is **retroactive**. foreman-v2-agent committed the workflow fix (SHA 296f2831)
before completing Phase 1 preflight, creating `wave-current-tasks.md`, or invoking IAA Pre-Brief.

**GOV-BREACH on record**: The commit sequence violated POLC governance ordering (commit before ceremony).
**CS2 Authorization**: Issue #1052 opened by @APGI-cmy, assigns Copilot. CS2 re-alignment/approval directive received 2026-03-10.
**Correction action**: wave-current-tasks.md now committed. IAA Pre-Brief executing retroactively per CS2 directive.
**Scope assessment**: The committed changes are technically correct and within scope for a retroactive pre-brief. The violation is governance sequence only (no pre-brief before commit), not technical correctness. Retroactive ceremony fully valid under CS2 authorization.

**FAIL-ONLY-ONCE Note**: This instance represents an A-021 pattern violation (commit before ceremony invocation). Recorded for learning. Corrective action in progress via this retroactive ceremony.

---

## Wave Scope

**Wave**: wave-polc-boundary-fix-1052 — POLC Boundary Validation False Positive Fix
**Tasks**: 2 (both CI_WORKFLOW category — same file)

| Task ID | Description | File | Status |
|---------|-------------|------|--------|
| T-POLC-FIX-001 | Add `copilot-builder-role` label bypass to `foreman-implementation-check` job | `.github/workflows/polc-boundary-gate.yml` | COMMITTED (SHA 296f283) |
| T-POLC-FIX-002 | Scope `session-memory-check` to PR-introduced new files only (`--diff-filter=A`) | `.github/workflows/polc-boundary-gate.yml` | COMMITTED (SHA 296f283) |

**Files changed**: 1 (CI workflow only — no production code, no agent contracts, no schema)

---

## Step 0.2 — IAA Bootstrap Attestation

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Hard-gate merge blocker. Issues ASSURANCE-TOKEN or REJECTION-PACKAGE only. Binary verdict.
> My class boundary: NOT a builder, foreman, or overseer. Does NOT write code, contracts, schemas, or implementation artifacts. Outputs: verification verdicts and Pre-Brief artifact only.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy).
>
> Independence check: IAA (independent-assurance-agent) did NOT produce any artifact in this PR.
> Producer: foreman-v2-agent. Independence requirement: SATISFIED."

---

## Step 0.3 — Trigger Category Classification

**Applicable category**: **CI_WORKFLOW**

| Classification Check | Result |
|---------------------|--------|
| Agent contract creation or update? | NO |
| Canon / governance document changes? | NO |
| CI / workflow changes? | **YES — `.github/workflows/polc-boundary-gate.yml` modified** |
| AAWP / MAT deliverables (production code)? | NO |
| Doc-only / parking station? | NO |
| Tier 2 knowledge file changes? | NO |
| Ambiguity? | NONE — clearly CI_WORKFLOW |

**IAA Triggered**: YES — CI_WORKFLOW mandatory
**Single primary category: CI_WORKFLOW** (both tasks, same file)

> **IAA will run the CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005) plus all applicable CORE invariants at handover.**

---

## Step 0.4 — Qualifying Tasks Detail

### Tasks T-POLC-FIX-001 + T-POLC-FIX-002

| Field | Value |
|-------|-------|
| `task_id` | T-POLC-FIX-001, T-POLC-FIX-002 |
| `task_summary` | Fix false positives in polc-boundary-gate.yml: (1) label bypass for builder PRs, (2) limit session-memory-check to PR-introduced new files |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Pre-Brief (Phase 0 — this artifact), Final Assurance (Phases 2–4 at handover) |
| `required_evidence_artifacts` | PREHANDOVER proof, wave-current-tasks.md, SCOPE_DECLARATION match |
| `applicable_overlays` | CI_WORKFLOW (OVL-CI-001 to OVL-CI-005), CORE invariants (CORE-001 to CORE-022) |
| `specific_rules` | OVL-CI-001 (no gate weakening), OVL-CI-002 (all 3 named jobs present), OVL-CI-003 (no silent failures), OVL-CI-004 (event type consistency), OVL-CI-005 (CI check run evidence) |

---

## Step 0.5 — FFA Checks at Handover

**CORE Invariants applicable** (CI_WORKFLOW scope — 17 checks):
- CORE-005, CORE-006, CORE-007, CORE-013, CORE-014, CORE-015, CORE-016, CORE-017, CORE-018, CORE-019, CORE-020, CORE-021

**CI_WORKFLOW Overlay** (5 checks):
- **OVL-CI-001**: Is the `copilot-builder-role` label bypass correctly scoped? Does `--diff-filter=A` correctly limit session-memory-check?
- **OVL-CI-002**: All three gate jobs still present and non-weakened after the fix?
- **OVL-CI-003**: No silent failure paths? (label bypass exit 0, zero-new-files case)
- **OVL-CI-004**: Consistent behavior across all event types (PR events + workflow_dispatch)?
- **OVL-CI-005**: CI check run confirming workflow executed successfully on this PR

**Total: ~17 checks at final handover**

---

## Step 0.6 — Required PREHANDOVER Proof Structure

The PREHANDOVER proof MUST contain:
1. Wave identification — wave name, branch, issue, commit SHA 296f283
2. Scope Declaration — must match `git diff --name-only origin/main...HEAD` exactly
3. Implementation evidence — T-POLC-FIX-001 and T-POLC-FIX-002 rationale and commit
4. YAML validation evidence — python3 yaml.safe_load or similar clean output
5. CI evidence (OVL-CI-005) — CI run confirming polc-boundary-gate.yml executed on this PR with PASS on all three jobs after the fix
6. Retroactive ceremony note — acknowledges GOV-BREACH, cites CS2 authorization, references this Pre-Brief
7. IAA audit token (pre-populated per A-029) — `IAA-session-wave-polc-boundary-fix-1052-20260310-PASS`
8. Session memory path — `.agent-workspace/foreman-v2/memory/session-wave-polc-boundary-fix-1052-20260310.md`

---

## Step 0.7 — Scope Blockers / Governance Conflicts

| Type | Item | Status |
|------|------|--------|
| GOV-BREACH | Commit before pre-brief (A-021) | **RESOLVED — CS2-authorized retroactive ceremony** |
| Risk Flag | Label bypass scope | For Phase 3 review — not a pre-brief blocker |
| Risk Flag | diff-filter scoping | For Phase 3 review — not a pre-brief blocker |
| Hard Blocker | NONE | Zero pre-brief blockers |

---

## Pre-Brief Status

**Pre-Brief**: ISSUED — complete. Retroactive ceremony authorized by CS2. No blockers.
**Qualifying tasks**: 2 (T-POLC-FIX-001 and T-POLC-FIX-002 — both CI_WORKFLOW)
**Handover requirements**: PREHANDOVER proof + session memory + IAA final audit (PHASE_B_BLOCKING)
**OVL-CI-005 Standard Requirement**: APPLIES — polc-boundary-gate.yml triggers on `pull_request` events and WILL run when the PR is opened. Standard CI evidence requirement applies (not the Inherent Limitation Exception).

---

*Authority: CS2 (Johan Ras / @APGI-cmy)*
*IAA Agent: independent-assurance-agent v6.2.0*
*Adoption Phase: PHASE_B_BLOCKING*
