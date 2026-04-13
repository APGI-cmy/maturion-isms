# IAA Pre-Brief — Wave 14 Execution Start (UX Workflow Gap Remediation)

**Artifact Type**: Pre-Brief (Phase 0 — IAA_PRE_BRIEF_PROTOCOL)
**Wave**: Wave 14 — UX Workflow Gap Remediation (GAP-W01–W14)
**Branch**: `copilot/start-ux-workflow-gap-remediation`
**Issue**: #1094 — MAT Wave 14: UX Workflow Gap Remediation — Execution Start (GAP-W01–W14)
**IAA Session**: session-prebrief-wave14-execution-start-20260313
**Date**: 2026-03-13
**Agent**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING — verdicts are hard-blocking

---

## 1. Pre-Brief Scope Declaration

This pre-brief covers the **Execution Start** phase of Wave 14 (UX Workflow Gap Remediation).
The planning artifacts (FRS FR-089–FR-102, TRS TR-089–TR-102, RED QA spec, Wave 14 section of
implementation plan) are declared previously COMPLETE. This wave phase commissions builder agents
to deliver 14 UX workflow gap fixes (GAP-W01 through GAP-W14) as specified in T-W14-UX-001 to
T-W14-UX-016 (16 RED tests).

**Critical Context from IAA Prior Session Review**:
Wave 14 has a complex history. Sessions 140–143 (2026-03-04/05) delivered Wave 14 on feature
branches (`copilot/implement-onboarding-and-assignment`,
`copilot/implement-evidence-interaction-model`, `copilot/finalise-mat-gap-closure`) and an
IBWR (In-Between Wave Reconciliation) artifact was committed declaring Wave 14 COMPLETE
(`.agent-admin/assurance/ibwr-wave14-session-143-20260305.md`). IAA tokens were issued for
all three batches. However, the implementation plan (`modules/mat/03-implementation-plan/
implementation-plan.md`) still shows ALL Wave 14 tasks (14.1–14.14) as `🔴 PENDING`.
Schema migrations from Wave 14 ARE present in main (9 migration files with prefix
`20260305*_wave14_*`), but no Wave 14 frontend components were found in the current codebase.

This discrepancy is a **SCOPE BLOCKER** (see §5 below). The Foreman must resolve it before
first builder delegation.

---

## 2. Trigger Categories Declared for This Wave

| Trigger Category | Applicable? | Rationale |
|-----------------|-------------|-----------|
| **AAWP_MAT** | ✅ YES — PRIMARY | Wave 14 delivers executable MAT application behaviour: UI components (onboarding guard, invite modals, evidence panels, AI evaluation triggers, audit results table, scoring tables, level descriptor cards, responsibility cascade), schema (9 Wave 14 migrations present; any new additions require A-032), API/Edge Functions (invite-acceptance, AI evaluation wiring), QA gate confirmation | 
| **PRE_BRIEF_ASSURANCE** (OVL-INJ-001) | ✅ YES — ALWAYS APPLIED with AAWP_MAT | This artifact IS the pre-brief required by OVL-INJ-001. Presence of this committed file satisfies OVL-INJ-001 for all sub-wave PRs originating from this wave. |
| AGENT_CONTRACT | ❌ NOT triggered | No agent contract modifications are in scope for this wave |
| CANON_GOVERNANCE | ❌ NOT triggered | No canon/governance document changes are in scope |
| CI_WORKFLOW | ⚠️ CONDITIONAL | Not triggered unless Foreman or builder modifies `.github/workflows/`. CORE-023 applies if workflow-adjacent files (test runners, migrations, Edge Functions) are modified — assess at handover per CORE-023 scope trigger |
| KNOWLEDGE_GOVERNANCE | ❌ NOT triggered | No Tier 2 IAA knowledge file changes in scope |

**Primary verdict category at handover: AAWP_MAT**

---

## 3. FFA Checks Declared for Handover

IAA will execute the following checks at the PR handover invocation for this wave
(or for each sub-wave PR if delivered in batches):

### 3.1 — Core Invariants (CORE-001 to CORE-023 — ALL executed)

| Check ID | Name | Notes for This Wave |
|----------|------|---------------------|
| CORE-001 | Agent identity declared | Verify PREHANDOVER proof includes producing agent(s) and IAA identity |
| CORE-002 | Phase 1 executed | PREHANDOVER proof shows Phase 1 preflight complete |
| CORE-003 | Tier 1 governance loaded | PREHANDOVER proof attests CANON_INVENTORY loaded |
| CORE-004 | Session memory present | Session memory file for producing agent committed to branch |
| CORE-005 | PR scope matches scope declaration | SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly (A-026) |
| CORE-006 | PREHANDOVER proof present | Standard ceremony artifact committed on branch |
| CORE-007 | iaa_audit_token pre-populated | PREHANDOVER proof contains expected reference token (A-029 §4.3b architecture) |
| CORE-008 | No .github/agents/ modifications | Diff must not modify agent contracts unless CodexAdvisor+CS2 authorized |
| CORE-009 | No secrets committed | Diff contains no credentials, tokens, or sensitive values |
| CORE-010 | Tier 2 knowledge indexed | (N/A for AAWP_MAT — skip) |
| CORE-011 | Four-phase structure present | (N/A for AAWP_MAT — skip) |
| CORE-012 | Self-modification lock present | (N/A for AAWP_MAT — skip) |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or IAA token references this invocation |
| CORE-014 | No class exemption claim | No claim that any agent class is exempt from IAA |
| CORE-015 | Session memory present | Session memory file path present in PREHANDOVER proof |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-wave14-YYYYMMDD.md` |
| CORE-017 | No unauthorized .github/agents/ modifications | Diff must not contain agent contract edits without CodexAdvisor+CS2 |
| CORE-018 | Complete evidence artifact sweep | All 4 evidence items present and non-empty (PREHANDOVER, session memory, iaa_audit_token, token file) |
| CORE-019 | IAA token cross-verification | Token file references current PR branch/number; verdict = ASSURANCE-TOKEN |
| CORE-020 | Zero partial pass rule | No assumed passes — absent evidence = failing check |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE; prohibited language list in force |
| CORE-022 | Secret field naming | (N/A for AAWP_MAT unless agent contract also modified — skip unless diff includes .github/agents/) |
| CORE-023 | Workflow integrity ripple check | **APPLIES** — Wave 14 includes test files, migrations, and frontend source all referenced by workflows. IAA will verify workflow syntax validity and path filter alignment at handover |

### 3.2 — AAWP_MAT Category Overlay (BD-001 to BD-014 — ALL executed)

| Check ID | Name | Wave 14 Specific Focus |
|----------|------|------------------------|
| BD-001 | Full scope delivered | All 14 GAPs (W01–W14) must have corresponding implementation + test evidence. Partial delivery = REJECTION-PACKAGE citing specific missing GAPs |
| BD-002 | No stub/TODO in production paths | All 16 test files, all frontend components, all migrations must be complete — no placeholder returns |
| BD-003 | One-time build compliance | OnboardingGuard, invite flows, evidence panels, AI triggers, audit results, scoring, level descriptors, responsibility cascade — all must work end-to-end from first merge |
| BD-004 | No leftover debt from prior waves | Check for broken wiring from Waves 5.5, 5.6, 16 visible in diff context |
| BD-005 | End-to-end wiring verified | Trace each GAP feature: schema → RLS → API/Edge Function → hook → UI component. Any broken chain = REJECTION-PACKAGE |
| BD-006 | Writers and readers confirmed | All 9 Wave 14 migration tables must have confirmed writers AND readers wired |
| BD-007 | Auth guards applied end-to-end | OnboardingGuard, invite-acceptance routes, domain assignment gates — all protected |
| BD-008 | FK and relational integrity | Wave 14 FKs (invitations→profiles, assignments→domains, evaluations→criteria, etc.) must have cascade logic |
| BD-009 | Cross-component integration fit | Wave 14 components must fit against Waves 5.5/5.6 existing UI shell; no shape/type conflicts |
| BD-010 | No orphaned deliverables | No unreferenced components, unimported hooks, unused migrations |
| BD-011 | 100% test pass rate | T-W14-UX-001 to T-W14-UX-016 must all pass; all regression tests must remain GREEN |
| BD-012 | Zero test debt | No .skip(), .only(), test.todo(), commented-out tests |
| BD-013 | No test dodging | Tests assert on actual behaviour — not vacuous; mocked tests do NOT satisfy A-032 column compliance |
| BD-014 | Schema column compliance (A-032) | **MANDATORY** — For any INSERT/SELECT in Wave 14 migrations or application code: IAA will read DDL directly and cross-check every column name against actual migration files. Non-existent column = REJECTION-PACKAGE |

### 3.3 — PRE_BRIEF_ASSURANCE Overlay (OVL-INJ-001)

| Check ID | Name | Evidence Required |
|----------|------|-------------------|
| OVL-INJ-001 | Pre-Brief Artifact Existence | This file (`.agent-admin/assurance/iaa-prebrief-wave14-execution-start-20260313.md`) must be committed to branch BEFORE any builder task artifact. SHA of this commit is the evidence. |
| OVL-INJ-ADM-001 | Artifact non-empty | File is substantive — confirmed (this document). |

### 3.4 — CST / CWT / FCWT Obligations

| Obligation | Applicability | What IAA Will Check |
|------------|--------------|---------------------|
| **CST** (discretionary) | APPLICABLE at each sub-wave convergence | Wave 14 introduces schema + API + UI chains for 14 GAPs simultaneously. CST checkpoint is warranted when first convergent sub-wave (schema + UI) is delivered. IAA will prompt Foreman at appropriate sub-wave PR |
| **CWT** (mandatory before IBWR) | **MANDATORY** | Wave 14 is declared the final MAT delivery wave. CWT covering ALL waves through Wave 14 must be executed and PASS evidence recorded in the IBWR before IBWR can close. Absence of CWT PASS = REJECTION-PACKAGE |
| **FCWT** (mandatory before production sign-over) | **MANDATORY** | Task 6.4 (production sign-over/CWT-on-production) requires FCWT PASS evidence. IAA will flag this at final IBWR review |

---

## 4. PREHANDOVER Proof Structure Required at Handover

The producing agent(s) (Foreman + builder delegates) must commit a PREHANDOVER proof with
the following mandatory fields before invoking IAA at handover:

```yaml
# PREHANDOVER PROOF — Wave 14 Execution Start (or sub-wave batch)
artifact_type: PREHANDOVER_PROOF
wave: 14
sub_wave_batch: "[A / B / C / FINAL — as applicable]"
session_id: "[session-NNN-wave14-YYYYMMDD]"
date: "[YYYY-MM-DD]"
branch: copilot/start-ux-workflow-gap-remediation
issue_number: "1094"
producing_agent: "[foreman-v2-agent + builders as applicable]"
iaa_audit_token: "IAA-[session-NNN]-wave14-[YYYYMMDD]-PASS"  # pre-populate expected reference per A-029

# Required evidence fields
preflight_complete: true
wave_current_tasks_updated: true  # wave-current-tasks.md updated with full Wave 14 task register

# RED gate evidence (required before first builder delegation)
red_gate_confirmation:
  agent: qa-builder
  result: "[RED CONFIRMED / GREEN CONFIRMED — with test output artifact path]"
  test_files_path: "modules/mat/tests/wave14/"
  tests_confirmed_red: "[T-W14-UX-001, T-W14-UX-002, ... list confirmed RED tests]"

# Builder delegation evidence (per sub-wave batch)
builder_delegations:
  - task_id: "[TASK-W14-NNN]"
    gap_id: "[GAP-WNN]"
    builder: "[schema-builder / ui-builder / api-builder]"
    delegation_artifact: "[path to delegation brief]"
    status: "[DELEGATED / COMPLETE]"

# Implementation evidence (per sub-wave batch)
gaps_closed:
  - gap_id: "[GAP-WNN]"
    test_id: "[T-W14-UX-NNN]"
    migration: "[migration filename if applicable]"
    component_path: "[src/components/... path]"
    test_result: "[GREEN]"

# Schema column compliance evidence (A-032)
schema_column_compliance:
  wave14_tables_checked: true
  migrations_read_directly: true
  column_cross_check_result: "[PASS — all columns verified / FAIL — discrepancies listed]"

# Session memory
session_memory_file: "[.agent-workspace/[builder]/memory/session-NNN-wave14-YYYYMMDD.md]"
foreman_session_memory: "[.agent-workspace/foreman-v2/memory/session-NNN-wave14-YYYYMMDD.md]"

# SCOPE_DECLARATION compliance (A-026)
scope_declaration_file: "SCOPE_DECLARATION.md"
scope_declaration_matches_diff: true
scope_declaration_format_compliant: true  # list format, prior-wave entries trimmed (A-028)

# CWT/FCWT (for final IBWR only)
cwt_executed: "[YES — result artifact path / NOT YET — pending]"
cwt_result: "[PASS / PENDING]"
fcwt_executed: "[YES — result artifact path / NOT YET — deferred to Task 6.4]"
```

---

## 5. Scope Blockers and Governance Conflicts

### BLOCKER-W14-001 — CRITICAL: Prior Wave 14 Completion vs. Current Execution Start Discrepancy

**Severity**: HIGH — Must resolve before first builder delegation

**Finding**: The Wave 14 IBWR (`.agent-admin/assurance/ibwr-wave14-session-143-20260305.md`,
session-143, 2026-03-05) declares Wave 14 **COMPLETE** with all 15 GAPs (W01–W15) closed,
three delivery batches delivered, and IAA ASSURANCE-TOKENs issued for all batches
(session-140, 141-v4, 142-v3). 9 Wave 14 schema migrations ARE present in the current main
branch (`20260305*_wave14_*.sql`).

**However**: The implementation plan (`modules/mat/03-implementation-plan/implementation-plan.md`)
still lists ALL Wave 14 tasks (14.1–14.14) as `🔴 PENDING`. No Wave 14 frontend components were
found in the current codebase (`apps/maturion-maturity-legacy/src/`). Issue #1094 requests Wave 14
execution start as if no implementation has occurred.

**Possible explanations (Foreman must determine)**:
1. Sessions 140–143 delivered on branches that were never merged into main — only the schema
   migration commits landed; all frontend work is still on unmerged branches
2. The implementation plan was not updated to reflect the prior session-140–143 deliveries
3. The IBWR in session-143 was premature — it declared completion before frontend work was
   fully implemented and tested

**Required Foreman action before first builder delegation**:
- Run `git log --oneline --all | grep -E "wave14|batch[ABC]|onboarding|evidence-interaction"` to confirm branch/merge status
- Run RED gate test suite (`modules/mat/tests/wave14/`) to confirm T-W14-UX-001–016 actual status
- Declare in wave-current-tasks.md whether this is: (a) a net-new execution of Wave 14 from scratch; (b) continuation/restart after partial prior delivery; or (c) cleanup/plan-update only
- If (a) or (b): proceed with standard builder delegation protocol
- If (c): an implementation plan update PR may be the primary deliverable

**IAA guidance**: Until this discrepancy is resolved and declared in wave-current-tasks.md,
any builder delegation artifact submitted for assurance review will receive a REJECTION-PACKAGE
citing this unresolved governance conflict as a BD-001 (scope completeness) and CORE-005
(scope declaration accuracy) failure.

---

### BLOCKER-W14-002 — A-032 Schema Column Compliance (Standing Requirement)

**Severity**: STANDING REQUIREMENT — applies to all Wave 14 delivery PRs

**Finding**: Wave 14 tables include: `organisations`, `audit_invitations`, `domain_assignments`,
`invitation_acceptance`, `excluded_criteria`, `excluded_mps_nodes`, `evidence_files`,
`criteria_evaluations`, `level_descriptors`, `audit_reports`, `scoring_methods`,
`scoring_ratings` (plus RLS on existing tables). Any PR containing INSERT or SELECT operations
against these tables — whether in migrations, Edge Functions, API routes, or frontend hooks —
requires IAA to read the migration DDL directly and cross-check every column.

**Required evidence**: PREHANDOVER proof must include `schema_column_compliance` block
(see §4 above) for all batches involving these tables.

---

### BLOCKER-W14-003 — CWT Required Before IBWR Closure

**Severity**: MANDATORY — IBWR cannot close without CWT PASS

**Finding**: Wave 14 is identified in the IBWR (session-143) as the final MAT wave.
Per `COMBINED_TESTING_PATTERN.md` §5.2 and IAA index §CST/CWT/FCWT Orchestration Prompting:
a Combined Wave Test (CWT) covering all waves through Wave 14 and all modules is a
constitutional requirement before IBWR completion. CWT PASS evidence must be present in the
IBWR artifact before IAA issues an ASSURANCE-TOKEN for the final IBWR.

**Required evidence**: CWT execution record with scope (waves covered, modules covered,
pass/fail per test category) committed to the wave's evidence bundle.

---

### ADVISORY-W14-001 — Implementation Plan Status Field Maintenance

**Severity**: ADVISORY — not a hard blocker but required before final IBWR

**Finding**: Once Wave 14 implementation is confirmed complete, the implementation plan
must be updated to mark tasks 14.1–14.14 as `✅ COMPLETE`. Stale PENDING status after
confirmed delivery is a governance inconsistency. This update does not require IAA review
(doc-only amendment if no structural content changes).

---

## 6. Summary Declarations

### 6.1 — Trigger Categories at Handover

| Category | Triggered | Mandatory Checks |
|----------|-----------|------------------|
| AAWP_MAT | ✅ YES | CORE-001–CORE-023, BD-001–BD-014, A-032, CWT obligation |
| PRE_BRIEF_ASSURANCE | ✅ YES (OVL-INJ-001) | Pre-Brief artifact existence — this file satisfies OVL-INJ-001 |
| CI_WORKFLOW | ⚠️ CONDITIONAL | CORE-023 scope trigger applies if workflow-adjacent files modified |
| AGENT_CONTRACT | ❌ NO | Not in scope |
| CANON_GOVERNANCE | ❌ NO | Not in scope |

### 6.2 — FFA Check Summary

| Checklist Section | Count | Notes |
|------------------|-------|-------|
| CORE invariants | 23 (CORE-001–CORE-023) | CORE-010, 011, 012, 022 N/A for AAWP_MAT unless agent contracts modified |
| AAWP_MAT overlay | 14 (BD-001–BD-014) | All 14 apply; BD-014 = A-032 schema column compliance |
| PRE_BRIEF_ASSURANCE | 2 (OVL-INJ-001, OVL-INJ-ADM-001) | This file satisfies both at handover |
| CST/CWT/FCWT | 3 (OVL-AM-CST-01, OVL-AM-CWT-01, OVL-AM-FCWT-01) | CWT mandatory before IBWR; FCWT mandatory before Task 6.4 |
| **Total** | **~42** | Exact count confirmed at Phase 3 Step 3.4 during actual assurance |

### 6.3 — PREHANDOVER Proof Required Fields (Summary)

At minimum, each sub-wave batch PREHANDOVER proof must contain:
1. `session_id`, `date`, `branch`, `issue_number`, `producing_agent`
2. `iaa_audit_token` — pre-populated expected reference (A-029)
3. `wave_current_tasks_updated: true`
4. `red_gate_confirmation` block — qa-builder test output artifact referenced
5. `builder_delegations` list — one entry per GAP delegated
6. `gaps_closed` list — one entry per GAP with test result GREEN
7. `schema_column_compliance` block (A-032)
8. `session_memory_file` paths committed
9. `scope_declaration_matches_diff: true` (A-026)
10. `scope_declaration_format_compliant: true` (A-028)
11. For final IBWR: `cwt_executed: YES`, `cwt_result: PASS`

### 6.4 — Scope Blockers Summary

| Blocker ID | Severity | Description | Pre-Delegation? |
|------------|----------|-------------|-----------------|
| BLOCKER-W14-001 | 🔴 CRITICAL | Prior Wave 14 completion vs. current execution start discrepancy — must be declared by Foreman in wave-current-tasks.md before first builder delegation | YES — resolve first |
| BLOCKER-W14-002 | 🟡 STANDING | A-032 schema column compliance mandatory for all Wave 14 table operations | At every batch handover |
| BLOCKER-W14-003 | 🟠 MANDATORY | CWT required before IBWR closure — not a pre-delegation blocker but must be planned now | Before final IBWR |
| ADVISORY-W14-001 | ℹ️ ADVISORY | Implementation plan task status must be updated to COMPLETE after delivery | Before or with final IBWR |

---

## 7. Phase 0 Completion Declaration

This Pre-Brief artifact has been generated per Phase 0 of the IAA contract (§Phase 0 Steps
0.1–0.6). IAA enters STANDBY mode after committing this artifact. No Phase 2–4 assurance
work will be performed until the Foreman invokes IAA at sub-wave batch handover with a
committed PREHANDOVER proof satisfying the structure declared in §4 above.

**IAA will perform hard-gate assurance at handover for every qualifying batch PR.**
PHASE_B_BLOCKING is in effect. No batch merges without ASSURANCE-TOKEN.

**Pre-Brief SHA**: To be confirmed after commit.

---

**Agent**: independent-assurance-agent v6.2.0
**Contract Version**: 2.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Date**: 2026-03-13
**Phase**: Phase 0 — PRE-BRIEF only. Phases 2–4 deferred to handover invocation.
