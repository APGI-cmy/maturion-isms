# IAA Pre-Brief — CP-1 Persona Gate Closure

**Wave Slug**: cp-1-persona-gate-closure-20260313
**Wave Number**: CP-1
**Pre-Brief Date**: 2026-03-13
**IAA Version**: 6.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Triggering Issue**: CP-1 — CS2 Sign-Off — maturion-advisor.md Persona Gate Closure
**Issue Description**: CS2 Checkpoint for maturion-advisor.md persona gate closure. CL-1 delivered the maturion-advisor.md file (226 tests GREEN, IAA-session-027-20260301-PASS). Wave requires Foreman to confirm file completeness, produce CP-1 closure artifact, and update execution plan CL-1 status to reflect CP-1 COMPLETE pending CS2 approval.

---

## Step 0.3 — Task Classification

| # | Task ID | Task Summary | Qualifying? | Reason |
|---|---------|-------------|-------------|--------|
| 1 | T-CP1-001 | Read `packages/ai-centre/src/agents/maturion-advisor.md` and confirm completeness at expected version | NOT QUALIFYING (read-only verification — no artifact produced) | Read-only check; no file changes |
| 2 | T-CP1-002 | Produce CP-1 gate closure summary at `.agent-admin/checkpoints/cp-1-closure-20260313.md` | **QUALIFYING** | New governance document in `.agent-admin/` path — governance artifact creation |
| 3 | T-CP1-003 | Update `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` CL-1 status field to reflect CP-1 COMPLETE (pending CS2 approval) | **QUALIFYING** | Execution plan is a governance document → CANON_GOVERNANCE trigger |
| 4 | T-CP1-004 | Update `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | NOT QUALIFYING | Session memory / admin file — explicitly excluded per trigger table |
| 5 | T-CP1-005 | PREHANDOVER proof and session memory ceremony | NOT QUALIFYING (ceremony files themselves) — but **triggers IAA invocation** | Ceremony files signal readiness for IAA assurance; the substantive artifacts (T-CP1-002, T-CP1-003) are the qualifying deliverables |

**Qualifying Tasks**: T-CP1-002, T-CP1-003
**Primary IAA Trigger Category**: CANON_GOVERNANCE
**Secondary IAA Trigger Category**: PRE_BRIEF_ASSURANCE (this pre-brief is on record; OVL-INJ-001 artifact-existence-only check applies at assurance time)

---

## Step 0.4 — Pre-Brief Artifact: Qualifying Task Detail

---

### Task T-CP1-002 — CP-1 Gate Closure Summary

| Field | Value |
|-------|-------|
| `task_id` | T-CP1-002 |
| `task_summary` | Create `.agent-admin/checkpoints/cp-1-closure-20260313.md` as the formal CP-1 gate closure certification for Foreman to present to CS2 |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 (Alignment) + Phase 3 (Assurance Work) + Phase 4 (Merge Gate Parity, Verdict, Handover) |
| `required_evidence_artifacts` | (1) PREHANDOVER proof committed to branch; (2) SCOPE_DECLARATION.md matching `git diff --name-only origin/main...HEAD` exactly (A-026); (3) cp-1-closure-20260313.md committed and present at correct path |
| `applicable_overlays` | CANON_GOVERNANCE overlay (iaa-category-overlays.md), PRE_BRIEF_ASSURANCE overlay (OVL-INJ-001) |
| `specific_rules` | A-021 (commit before invocation), A-026 (SCOPE_DECLARATION must match PR diff), A-028 (SCOPE_DECLARATION list format), A-029 (PREHANDOVER immutability §4.3b), A-025 (ceremony PENDING — no pre-fill) |

---

### Task T-CP1-003 — Execution Plan CL-1 Status Update

| Field | Value |
|-------|-------|
| `task_id` | T-CP1-003 |
| `task_summary` | Update `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` to record CP-1 COMPLETE (pending CS2 approval) against the CL-1 wave entry |
| `iaa_trigger_category` | CANON_GOVERNANCE |
| `required_phases` | Phase 2 (Alignment) + Phase 3 (Assurance Work) + Phase 4 (Merge Gate Parity, Verdict, Handover) |
| `required_evidence_artifacts` | (1) git diff showing the exact field(s) changed — no unrelated changes; (2) PREHANDOVER proof references this change explicitly; (3) SCOPE_DECLARATION includes this file |
| `applicable_overlays` | CANON_GOVERNANCE overlay |
| `specific_rules` | A-026 (SCOPE_DECLARATION must match PR diff exactly — execution plan update must appear in diff and in SCOPE_DECLARATION), A-021 (commit before invocation) |

---

## FFA Checks IAA Will Run at Handover

The following checks will be executed at assurance time. This section is a forward declaration — IAA will execute ALL core invariants (CORE-001 through CORE-022) plus the category overlay checks. The checks most directly relevant to this wave are called out below.

### Core Invariants (CORE — all 22 applied)

| Check | Relevance to CP-1 |
|-------|-------------------|
| CORE-001 | Scope declaration present and not stale |
| CORE-002 | No `.github/agents/` files modified (AGCFPP-001) |
| CORE-003 | No production code, schema, migration, test, or CI changes present (scope boundary) |
| CORE-004 | All committed changes listed in PREHANDOVER proof |
| CORE-005 | No secrets or credentials in any committed file |
| CORE-006 | No forbidden patterns in committed markdown |
| CORE-007 | Branch is up to date with base (merge conflicts resolved) |
| CORE-008 | PREHANDOVER proof format compliance |
| CORE-009 | Session memory committed and complete |
| CORE-010 | All tasks declared in PREHANDOVER are DONE |
| CORE-011 | No scope creep — only declared files changed |
| CORE-012 | Governance documents not corrupted or truncated |
| CORE-013 | IAA invocation evidence present in ceremony artifacts |
| CORE-014 | No agent class exceptions claimed |
| CORE-015 | IAA adoption phase correctly recorded |
| CORE-016 | Token reference in PREHANDOVER uses PENDING (A-029 carve-out) |
| CORE-017 | Token reference format correct |
| CORE-018 | Complete evidence artifact sweep — all required files present |
| CORE-019 | No re-invocation without correction addendum (if this is a re-invocation) |
| CORE-020 | No INC pattern present from prior sessions affecting this wave |
| CORE-021 | Zero-Severity-Tolerance rule — no prohibited language in artifacts |
| CORE-022 | `secret:` field absent from all agent files touched (A-024) |

### CANON_GOVERNANCE Overlay (category-specific)

| Check | Relevance to CP-1 |
|-------|-------------------|
| OVL-CG-001 | Execution plan amendment is correctly versioned (version bump present if required) |
| OVL-CG-002 | Status field change is precisely scoped — no unintended edits to other wave entries |
| OVL-CG-003 | CP-1 closure artifact contains all required fields (wave, date, deliverables confirmed, IAA token reference, CS2 sign-off placeholder) |
| OVL-CG-004 | Amendment history updated in execution plan if a new amendment version is required |

### PRE_BRIEF_ASSURANCE Overlay (OVL-INJ-001)

| Check | Relevance to CP-1 |
|-------|-------------------|
| OVL-INJ-001 | This pre-brief artifact (`iaa-prebrief-cp-1-persona-gate-closure-20260313.md`) is present and committed — existence-only check ✅ (satisfied by this pre-brief) |

### FAIL-ONLY-ONCE Checks (standing — applied to every invocation)

| Rule | Check at Assurance Time |
|------|------------------------|
| A-021 | git log confirms all substantive changes committed before IAA invocation — no working-tree-only files |
| A-025 | PREHANDOVER token reference field is `PENDING` (not pre-filled with anticipated PASS token) |
| A-026 | SCOPE_DECLARATION.md matches `git diff --name-only origin/main...HEAD` output exactly |
| A-028 | SCOPE_DECLARATION uses list format; prior-wave entries trimmed |
| A-029 | PREHANDOVER proof is read-only post-commit; IAA writes its own token file |
| A-031 | IAA's own pre-brief/ceremony files excluded from SCOPE_DECLARATION per carve-out note |

---

## PREHANDOVER Proof Structure Required

The Foreman must produce a PREHANDOVER proof at:
`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cp-1-persona-gate-closure-20260313.md`

**Required fields:**

```
wave: cp-1-persona-gate-closure-20260313
session: session-cp-1-persona-gate-closure-20260313
branch: [current PR branch]
date: 2026-03-13
producing_agent: foreman-v2-agent
producing_agent_class: foreman
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-cp-1-persona-gate-closure-20260313.md

tasks_completed:
  - T-CP1-001: [description — read-only verification of maturion-advisor.md]
  - T-CP1-002: .agent-admin/checkpoints/cp-1-closure-20260313.md CREATED
  - T-CP1-003: governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md UPDATED (CL-1 CP-1 COMPLETE)
  - T-CP1-004: .agent-workspace/foreman-v2/personal/wave-current-tasks.md UPDATED

files_changed:
  - .agent-admin/checkpoints/cp-1-closure-20260313.md (NEW)
  - governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md (UPDATED — CL-1 CP-1 status)
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md (UPDATED)
  - .agent-workspace/foreman-v2/memory/session-cp-1-persona-gate-closure-20260313.md (NEW)
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-cp-1-persona-gate-closure-20260313.md (NEW)
  [IAA ceremony files excluded per A-031 carve-out]

scope_declaration_ref: SCOPE_DECLARATION.md (must match git diff output exactly — A-026)

iaa_token: PENDING
iaa_token_reference: PENDING
```

**Required content in cp-1-closure-20260313.md (T-CP1-002):**
- Wave: CP-1
- Date: 2026-03-13
- Deliverables confirmed:
  - CL-1-D1: PersonaLoader RED gate tests → GREEN ✅ (226/226 tests — session-078)
  - CL-1-D2: `packages/ai-centre/src/agents/maturion-advisor.md` confirmed present, version 1.0.0 ✅ _(see Scope Note below)_
  - CL-1-D3: AIMC_PERSONA_LIFECYCLE.md §2 registry updated to v1.1.0 ✅
- IAA token reference: IAA-session-027-20260301-PASS (CL-1 delivery token)
- CS2 sign-off placeholder: `PENDING — awaiting CS2 approval`
- Foreman confirmation statement
- CP-1 closure assertion

---

## Scope Blockers and Governance Conflicts

### ⚠️ SCOPE NOTE — Path Discrepancy (Advisory, Not a Blocker)

| Item | Details |
|------|---------|
| **Nature** | Path discrepancy between execution plan deliverables table and actual delivered file location |
| **Execution plan CL-1-D2 spec (deliverables table)** | `packages/ai-centre/agents/maturion-advisor.md` (no `src/`) |
| **Actual delivered file** | `packages/ai-centre/src/agents/maturion-advisor.md` (with `src/`) |
| **Execution plan CL-1 status record** | Correctly states `packages/ai-centre/src/agents/` (with `src/`) — consistent with actual file |
| **Classification** | Advisory alignment gap only. The file was delivered at the correct path (confirmed by git history). The deliverables table has a stale spec. The Foreman should note the actual path in the CP-1 closure artifact and may optionally correct the deliverables table spec in the execution plan update. |
| **IAA ruling** | This discrepancy will NOT block ASSURANCE-TOKEN if: (1) the closure artifact states the correct actual path, and (2) the file exists at `packages/ai-centre/src/agents/maturion-advisor.md` and is confirmed complete. |

---

### ⚠️ INFRASTRUCTURE NOTE — `.agent-admin/checkpoints/` Directory Absent

| Item | Details |
|------|---------|
| **Nature** | The `.agent-admin/checkpoints/` directory does not currently exist |
| **Impact** | Foreman must `mkdir -p .agent-admin/checkpoints/` before creating `cp-1-closure-20260313.md` |
| **Classification** | Minor prerequisite — not a governance blocker. Directory creation is expected as part of T-CP1-002. |
| **Action required** | Foreman creates directory as part of normal file creation. No separate task required. |

---

### ✅ NO AGENT CONTRACT CHANGES

No `.github/agents/` files are in scope. AGCFPP-001 boundary is intact. AGENT_CONTRACT trigger category does NOT apply to this wave.

---

### ✅ NO CI/WORKFLOW CHANGES

No `.github/workflows/` files are in scope. CI_WORKFLOW trigger category does NOT apply.

---

### ✅ NO PRODUCTION CODE, SCHEMA, OR TEST CHANGES

Scope is governance documentation artifacts only. AAWP_MAT trigger category does NOT apply (no new test coverage required for this ceremony wave).

---

### ✅ CL-1 STATUS ALREADY COMPLETE IN EXECUTION PLAN

The execution plan already records CL-1 as COMPLETE (Amendment v1.4.0, 2026-03-01). The CP-1 update is an addendum to the COMPLETE status to record the CS2 gate review outcome. This is a narrow, targeted status field update. Foreman should ensure no other wave entries are modified in the diff.

---

## Classification Summary

| Category | Triggered? | Reason |
|----------|-----------|--------|
| AGENT_CONTRACT | NO | No `.github/agents/` files in scope |
| CANON_GOVERNANCE | **YES — PRIMARY** | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` update + new `.agent-admin/checkpoints/` governance artifact |
| CI_WORKFLOW | NO | No workflow files in scope |
| AAWP_MAT | NO | No new production code, schema, migrations, or tests |
| KNOWLEDGE_GOVERNANCE | NO | No Tier 2 knowledge files being patched |
| PRE_BRIEF_ASSURANCE | **YES — SECONDARY** | This pre-brief is on record; OVL-INJ-001 existence check applicable |
| EXEMPT | NO | CANON_GOVERNANCE trigger is active |

**IAA Adoption Phase at time of assurance**: PHASE_B_BLOCKING — Hard gate ACTIVE. REJECTION-PACKAGE will block PR open.

---

## CST/CWT/FCWT Assessment

This CP-1 wave is a governance checkpoint ceremony (documentation only). It does not introduce any new cross-boundary integration points, new schemas, new API routes, or new frontend components. **No CST, CWT, or FCWT is warranted or required for this wave.**

---

## Pre-Brief Status

```yaml
prebrief_artifact: .agent-admin/assurance/iaa-prebrief-cp-1-persona-gate-closure-20260313.md
wave: cp-1-persona-gate-closure-20260313
date: 2026-03-13
qualifying_tasks: [T-CP1-002, T-CP1-003]
primary_trigger_category: CANON_GOVERNANCE
secondary_trigger_category: PRE_BRIEF_ASSURANCE
scope_blockers: NONE (advisory path note only)
governance_conflicts: NONE
iaa_invocation_required: YES — PHASE_B_BLOCKING
prebrief_status: COMPLETE
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Pre-Brief Version**: 1.0.0
**Canonical Source**: `APGI-cmy/maturion-foreman-governance`
