# IAA Wave Record — harden-qa-deployment-workflow-20260427

**Wave**: harden-qa-deployment-workflow-20260427
**Branch**: copilot/harden-qa-handover-requirements
**Issue**: maturion-isms#1479 — Harden QA and handover requirements for deployment/workflow PRs
**Agent**: independent-assurance-agent v6.2.0
**Wave Record Created**: 2026-04-27
**Governed by**: `capabilities.wave_record_path_pattern` (contract §capabilities.assurance)
**Standalone artifacts prohibited**: YES — all IAA output for this wave lives in this file only

---

## PRE-BRIEF

**Pre-Brief Date**: 2026-04-27
**Triggered by**: Foreman-v2-agent wave-start pre-brief request (wave-current-tasks.md — Task 4: IAA Pre-Brief, issue maturion-isms#1479)
**Pre-Brief Mode**: PHASE_0 — Do NOT proceed to Phase 1–4 assurance

---

### Step 0.1 — Pre-Brief Mode Confirmed

Invocation type: Wave-start PRE-BRIEF (action: "PRE-BRIEF").
Phase 0 only. Phases 1–4 assurance deferred to final IAA invocation (Task 8: IAA Final Audit).

---

### Step 0.2 — Qualifying Tasks and Trigger Classification

**Trigger table applied**: `iaa-trigger-table.md` v2.5.0
**Classification decision flow**: Steps 2 (CANON_GOVERNANCE), 6 (KNOWLEDGE_GOVERNANCE)

#### QUALIFYING TASKS (IAA triggered at final audit)

| Task | Deliverable Path(s) | Trigger Category | IAA Required? | Notes |
|------|-------------------|-----------------|---------------|-------|
| D1 | `governance/canon/DEPLOYMENT_WORKFLOW_QA_HARDENING.md` | **CANON_GOVERNANCE** | YES — MANDATORY | New canon document in `governance/canon/`; trigger table step 2 |
| D2 | `governance/checklists/deployment-workflow-qa-checklist.md` | **CANON_GOVERNANCE** | YES — MANDATORY | New file in `governance/checklists/` — governance operational tree; AMBIGUITY RULE applied → mandatory. Content defines enforcement policy; not purely doc-only. |
| D3 | `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` (per issue) OR `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` (per scope declaration) | **KNOWLEDGE_GOVERNANCE** and/or **CANON_GOVERNANCE** | YES — MANDATORY | **⚠️ SCOPE BLOCKER SB-001** — path discrepancy between issue description and scope declaration (see below). Both paths are individually triggering. Regardless of resolution: IAA is mandatory. |
| D4 | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | **KNOWLEDGE_GOVERNANCE** | YES — MANDATORY | Agent workspace Tier 2 knowledge file; trigger table step 6; OVL-KG overlay applies; next sequential rule ID must follow the current FAIL-ONLY-ONCE registry state (currently A-042 based on A-039, A-040, and A-041 already being present, unless a newer ID has since been added) |
| D5 | `governance/CANON_INVENTORY.json` | **CANON_GOVERNANCE** | YES — MANDATORY | Explicitly named in trigger table step 2; must reflect new file hashes with no null/zeroed entries |

#### NON-QUALIFYING TASKS (IAA not triggered for these artifacts in isolation)

| Task | Deliverable Path(s) | Trigger Category | Rationale |
|------|-------------------|-----------------|-----------|
| SCOPE | `.agent-workspace/foreman-v2/personal/scope-declaration-wave-harden-qa-deployment-workflow-20260427.md` | EXEMPT | Admin scope artifact; operational planning record |
| WAVE-TASKS | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | EXEMPT | Session planning artifact |
| SESSION-MEM | `.agent-workspace/foreman-v2/memory/session-074-20260427.md` | GOVERNANCE_AUDIT (EXEMPT solo) | Retrospective session record only |
| PREHANDOVER | `.agent-admin/prehandover/proof-session-074-harden-qa-deployment-workflow-20260427.md` and/or `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-074-harden-qa-deployment-workflow-20260427.md` | GOVERNANCE_AUDIT (EXEMPT solo) | Ceremony proof — exempt only in isolation; MIXED rule applies with triggering artifacts in same PR |
| ECAP-BUNDLE | `.agent-workspace/execution-ceremony-admin-agent/bundles/*` (Phase 4) | GOVERNANCE_AUDIT (EXEMPT solo) | Ceremony administrative record; ECAP-001 write prohibition applies |
| IAA-WAVE-REC | `.agent-admin/assurance/iaa-wave-record-harden-qa-deployment-workflow-20260427.md` (this file) | GOVERNANCE_AUDIT / A-031 carve-out | IAA-generated ceremony artifact |

**MIXED classification result**: PR contains CANON_GOVERNANCE (D1, D2, D5) + KNOWLEDGE_GOVERNANCE (D3 partial, D4).
**Primary overlay**: CANON_GOVERNANCE.
**Secondary overlay**: KNOWLEDGE_GOVERNANCE (D3/D4).
**All five qualifying deliverables are in scope for IAA-FINAL.**

---

### ⚠️ SCOPE BLOCKER SB-001 — PREHANDOVER Template Path Discrepancy

**Severity**: BLOCKING — must be resolved before governance-liaison-isms-agent begins D3 implementation.

**Conflict**:
- Issue #1479 §B states: update `.agent-workspace/foreman-v2/knowledge/prehandover-template.md`
- Scope declaration `approved_artifact_paths` declares: `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`

**These are two distinct files.** The foreman-v2 knowledge path (`.agent-workspace/foreman-v2/knowledge/prehandover-template.md`) is an agent-private template and triggers **KNOWLEDGE_GOVERNANCE**. The governance templates path (`governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`) is a shared governance canonical template and triggers **CANON_GOVERNANCE**.

**Required resolution** (foreman-v2-agent must clarify before governance-liaison-isms-agent proceeds):
1. Are BOTH files being updated? (If yes, both must appear in scope declaration; D3 becomes KNOWLEDGE_GOVERNANCE + CANON_GOVERNANCE dual-trigger.)
2. Is only the governance template being updated? (If yes, remove the `.agent-workspace/foreman-v2/knowledge/prehandover-template.md` reference from issue description and proceed with CANON_GOVERNANCE only for D3.)
3. Is only the foreman knowledge file being updated? (If yes, update scope declaration to reflect the correct path and classify D3 as KNOWLEDGE_GOVERNANCE only.)

**IAA will check both paths at final audit** and will REJECT if either is modified without corresponding scope declaration entry.

---

### ⚠️ SCOPE BLOCKER SB-002 — ceremony-admin status changed after pre-brief

**Severity**: LOW — not blocking for governance-liaison work, but must be resolved before PREHANDOVER proof is committed.

**Observation**: At pre-brief time, SB-002 was recorded against `wave-current-tasks.md` with `ceremony_admin_appointed: PENDING`. The current `wave-current-tasks.md` in this PR now declares `ceremony_admin_appointed: NO`. Accordingly, ACR-01 through ACR-11 are **not currently in scope** on the tracker state as of this wave record revision; they become applicable only if an execution-ceremony-admin-agent is later appointed during this wave, at which point the ECAP reconciliation summary (ACR-01) will be mandatory in the Tier 3 proof bundle.

**No action required from producing agent now.** IAA records this status change for tracking.

---

### Step 0.2 — Pre-Brief Output (Canon Format)

```
Qualifying tasks: D1 (CANON_GOVERNANCE — new canon), D2 (CANON_GOVERNANCE — governance checklist),
                  D3 (⚠️ SB-001 — KNOWLEDGE_GOVERNANCE and/or CANON_GOVERNANCE — path TBD),
                  D4 (KNOWLEDGE_GOVERNANCE — foreman-v2 FAIL-ONLY-ONCE.md),
                  D5 (CANON_INVENTORY.json — CANON_GOVERNANCE)
                  Non-qualifying: SCOPE/WAVE-TASKS (EXEMPT), SESSION-MEM/PREHANDOVER/ECAP
                                  (GOVERNANCE_AUDIT/EXEMPT-solo), IAA wave record (A-031 carve-out)

Applicable overlay: CANON_GOVERNANCE (primary — D1, D2, D5, and D3 if governance/templates/ path)
                    KNOWLEDGE_GOVERNANCE (secondary — D4, and D3 if .agent-workspace/ path)

Anti-regression obligations: YES
  — A-020: PREHANDOVER template modification (D3) must not reduce or remove any currently
    required sections. Applicable required sections (overlay v3.0.0 + A-020):
    iaa_audit_token (pre-populated, A-029), ## Architecture Ripple/Impact Assessment (OVL-AM-004),
    ## Wave Gap Register (OVL-AM-005), ## Environment Parity (OVL-AM-006/OVL-CI-006).
    The new ## Deployment Surface Enumeration section must be ADDED — absence of this section
    in the template post-wave = REJECTION-PACKAGE at final audit (anti-regression for D3's
    stated purpose).
  — D4 (FAIL-ONLY-ONCE.md): new rule A-042 must not contradict, duplicate, or orphan any
    of A-001 through A-038. Dangling cross-references = FAIL (OVL-KG-004). The next
    sequential rule ID as of v2.9.0 is A-039; if other rules have been added between
    v2.9.0 and the time of this wave, the producing agent must confirm the actual next ID.
  — D1 (new canon): must not contradict existing enforcement canon. Any overlap with
    existing deployment/CI canon (e.g., OVL-CI-* checks, A-037 Evidence-Type Discipline)
    must be explicitly cross-referenced, not duplicated (OVL-CG-002, OVL-CG-003).
```

---

### Step 0.2 — FAIL-ONLY-ONCE Checks Applicable at Final Audit (Pre-Brief Projection)

The following FFA rules are pre-projected as applicable at IAA-FINAL for this wave. This list is informational — IAA will re-derive and confirm all applicable rules at Step 3.1.

| Rule | Applicable? | Trigger Reason |
|------|------------|----------------|
| A-001 | YES | IAA invocation evidence must be present in PR artifacts |
| A-004 | YES | Bootstrap directive check (Phase 1 preflight) |
| A-005 | CHECK | No `.github/agents/` files expected — IAA will confirm diff clean |
| A-006 | YES | PHASE_A_ADVISORY fabrication detection |
| A-015 | YES | PREHANDOVER ceremony required — KNOWLEDGE_GOVERNANCE triggered |
| A-016 | YES | Cross-PR token reuse check |
| A-019 | YES | Trigger table misapplication guard |
| A-020 | YES | PREHANDOVER template staleness — D3 directly modifies the template |
| A-021 | YES | Commit and push before IAA invocation |
| A-026 | YES | SCOPE_DECLARATION must match PR diff exactly |
| A-028 | YES | SCOPE_DECLARATION format compliance |
| A-029 | YES | PREHANDOVER proof iaa_audit_token immutability (expected reference format) |
| A-031 | YES | IAA ceremony artifact carve-out (this wave record) |
| A-033 | YES | Git-committed verification (CORE-018) — not disk only |
| A-036 | CHECK | Temporal integrity — any completion claims in D1/D2 must not be future-dated |
| A-037 | CHECK | Evidence-type discipline — D1/D2 define evidence requirements; the canon must not set evidence standards lower than LIVE_RUNTIME/LIVE_E2E for deployment items |
| A-038 | CHECK | §7.x-OVL-PBG coupling — D1/D4 do NOT touch PRE_BUILD_STAGE_MODEL_CANON.md; expected NOT applicable. IAA will confirm at final audit. |
| A-034/A-035 | NOT APPLICABLE | No BUILD/AAWP_MAT content in this wave — pure governance |
| NBR-001–005 | NOT APPLICABLE | No application code changes — pure governance |

---

### Step 0.2 — PREHANDOVER Structure Requirements (For Producing Agents)

The PREHANDOVER proof committed for this wave MUST contain all of the following sections. Absence of any mandatory section = REJECTION-PACKAGE at IAA-FINAL.

| Section | Required? | Basis |
|---------|-----------|-------|
| `iaa_audit_token: IAA-session-NNN-waveY-YYYYMMDD-PASS` (pre-populated) | **MANDATORY** | A-029 (§4.3b architecture) |
| `## Architecture Ripple/Impact Assessment` | **MANDATORY** | OVL-AM-004 / A-020 |
| `## Wave Gap Register` | **MANDATORY** | OVL-AM-005 / A-020 |
| `## Environment Parity` | **MANDATORY** | OVL-AM-006/OVL-CI-006 / A-020 |
| `## Deployment Surface Enumeration` | **NOT REQUIRED FOR THIS WAVE** | This section is the deliverable being CREATED by this wave for use in FUTURE deployment waves. This PREHANDOVER proof is exempt from requiring it. It will become MANDATORY for all post-wave deployment PRs. IAA will verify the template adds this section (D3 anti-regression check), not that the proof uses it. |
| `## Scope Declaration Cross-Reference` | **MANDATORY** | A-026 gate — SCOPE_DECLARATION must match committed diff |
| `## Version Bump Evidence` | **MANDATORY** | OVL-CG-ADM-002 (canon), OVL-KG-ADM-002 (knowledge) — all modified files must declare incremented versions |
| `## CANON_INVENTORY Hash Verification` | **MANDATORY** | OVL-CG-ADM-001 — CANON_INVENTORY.json must reflect new file hashes; no null/zeroed/empty values |
| `## CI Check Run Evidence` | **NOT REQUIRED** | No CI_WORKFLOW artifacts in this wave; OVL-CI-005 does not apply |

---

### Step 0.2 — Admin Ceremony Contract

**`ceremony_admin_appointed`**: PENDING (per wave-current-tasks.md at pre-brief time)

If `execution-ceremony-admin-agent` is appointed before PREHANDOVER is committed:
- ACR-01 through ACR-11 apply at IAA-FINAL (Step 3.3a)
- ECAP reconciliation summary is MANDATORY in the proof bundle (ACR-01)
- ECAP-001 write prohibition enforced: execution-ceremony-admin-agent MUST NOT write IAA tokens or verdicts

If no ECAP agent is appointed (wave closes without it):
- ACR-01 through ACR-11 are NOT applicable
- Standard PREHANDOVER ceremony (foreman-v2-agent + IAA) applies

**Foreman-v2-agent must declare `ceremony_admin_appointed` status before invoking IAA-FINAL.**

---

### Step 0.3 — Wave Record Committed

**Wave record path**: `.agent-admin/assurance/iaa-wave-record-harden-qa-deployment-workflow-20260427.md`
**Qualifying task count**: 5 qualifying tasks (D1–D5)
**Scope blockers**: 2 declared (SB-001 BLOCKING, SB-002 LOW)
**Pre-brief status**: COMPLETE

---

## TOKEN

*Reserved — populated by IAA at final audit (IAA-FINAL, Task 8). Per §4.3b: IAA writes ASSURANCE-TOKEN here after all checks PASS.*

---

## REJECTION_HISTORY

*Reserved — populated by IAA if REJECTION-PACKAGE is issued at any point during this wave.*

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Living Agent System**: v6.2.0
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
