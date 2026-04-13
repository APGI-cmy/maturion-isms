# IAA Pre-Brief — Wave CL-2: Legacy Knowledge Inventory and Domain Tagging Plan

**Document Type**: IAA Pre-Brief Artifact  
**Wave**: CL-2 (LKIAC Wave 2 — Legacy Knowledge Inventory and Domain Tagging Plan)  
**IAA Session**: session-wave-cl2-20260313  
**Date**: 2026-03-13  
**Branch**: `copilot/cl-2-initiate-knowledge-inventory`  
**Triggering Issue**: Wave CL-2 — LKIAC Wave 2: Legacy Knowledge Inventory and Domain Tagging Plan (Parallel Execution Start)  
**Invoked By**: foreman-v2-agent (Pre-Brief request)  
**IAA Phase**: PHASE_0 — PRE-BRIEF (Phases 1–4 full assurance NOT executed in this session)  
**Adoption Phase**: PHASE_B_BLOCKING  
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Phase 1 — Identity & Preflight (Pre-Brief Attestation)

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent Assurance Agent.
> My class boundary: NOT a builder, foreman, or overseer. Does NOT write code, contracts,
> schemas, or implementation artifacts. Outputs: verification verdicts and Pre-Brief artifact only.
> Independence requirement: Must never review work I produced or contributed to.
> If detected → HALT-001, escalate to CS2.
> STOP-AND-FIX mandate: ACTIVE. REJECTION-PACKAGE stops all work — no PR opens, no merge proceeds.
> No class exceptions: IAA mandatory for ALL agent contracts — Foreman, builder, overseer,
> specialist, every class. Exemption claim = governance violation.
> Ambiguity rule: Ambiguity about IAA requirement resolves to mandatory invocation — never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it."

**Preflight attestation:**

| Check | Result |
|-------|--------|
| Contract YAML loaded (agent_bootstrap) | ✅ agent.id=independent-assurance-agent, version 6.2.0, contract_version 2.2.0 |
| Tier 2 knowledge loaded | ✅ All 7 required files present — index.md v2.9.0, FAIL-ONLY-ONCE.md v2.5.0, iaa-core-invariants-checklist.md v2.9.0 (CORE-001–CORE-023), iaa-trigger-table.md v2.1.0, iaa-category-overlays.md v3.4.0, session-memory-template.md, IAA_AGENT_CONTRACT_AUDIT_STANDARD.md |
| CANON_INVENTORY hash check | ✅ 191 canons, 0 placeholder hashes — PASS |
| IAA canon present in CANON_INVENTORY | ✅ INDEPENDENT_ASSURANCE_AGENT_CANON.md — PRESENT |
| AGCFPP-001 confirmed | ✅ AGENT_CONTRACT_FILE_PROTECTION_POLICY.md — PRESENT |
| Breach registry | ✅ CLEAR — no open breaches (stub created session-153; no entries since) |
| FAIL-ONLY-ONCE A-001 (IAA invocation evidence) | ✅ ATTESTED |
| FAIL-ONLY-ONCE A-002 (no class exceptions) | ✅ ATTESTED |
| FAIL-ONLY-ONCE A-003 (ambiguity = mandatory) | ✅ ATTESTED |
| Last 5 IAA sessions reviewed | ✅ session-waveOVLINJ, session-wave16-orchestration (x2), session-wave16-full-batch, session-wave15r-impl-R2 — no unresolved items |
| Open REJECTION-PACKAGEs from prior sessions | ✅ NONE affecting CL-2 scope |
| Orientation Mandate acknowledged | ✅ Proceeding as quality engineer, not file auditor |

---

## Phase 0 — Pre-Brief Output

### Step 0.1 — Pre-Brief Invocation Confirmed

This session was triggered by an explicit `[IAA PRE-BRIEF REQUEST]` for Wave CL-2.
IAA enters PHASE_0 PRE-BRIEF mode. Full assurance (Phases 2–4) will NOT execute in this
session. The Pre-Brief artifact is generated, committed, and IAA stops.

---

### Step 0.2 — Wave Summary

| Field | Value |
|-------|-------|
| Wave ID | CL-2 |
| Wave Name | LKIAC Wave 2 — Legacy Knowledge Inventory and Domain Tagging Plan |
| Wave Mode | POLC-Orchestration |
| Branch | `copilot/cl-2-initiate-knowledge-inventory` |
| Parallel Wave | CL-4 (runs concurrently per acceptance criteria) |
| Entry State | CL-1 COMPLETE; Combined Plan v1.4.0 in `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`; Prior session-078 produced draft CL-2 deliverables (D1/D2/D3) in `.agent-workspace/audit/` — DRAFT, awaiting CS2 review |
| Production code / schemas / migrations expected | NO — POLC-Orchestration only |

**Declared Tasks from Pre-Brief Request:**

| Task ID | Description | Qualification Status |
|---------|-------------|---------------------|
| T-CL2-001 | Update `wave-current-tasks.md` with CL-2 task register | ADMIN — NOT QUALIFYING for IAA |
| T-CL2-002 | Commission sub-agents: legacy knowledge extraction, domain tag curation, inventory consolidation | DELEGATION — NOT QUALIFYING directly |
| T-CL2-003 | Surface existing plan staleness or blockers | ANALYSIS — NOT QUALIFYING |
| T-CL2-004 | Prepare acceptance gate CL-2-A1 and governance requirements | **CONDITIONALLY QUALIFYING** — if acceptance gate doc placed in `governance/` → CANON_GOVERNANCE fires |
| T-CL2-005 | Log jobs in plan registry | **CONDITIONALLY QUALIFYING** — if plan registry is `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` → CANON_GOVERNANCE fires |
| T-CL2-006 | Governance ceremony (session memory + PREHANDOVER proof) | CEREMONY — NOT QUALIFYING (ceremony artifacts) |
| T-CL2-007 | IAA Pre-Brief artifact committed | **ALWAYS QUALIFYING** — PRE_BRIEF_ASSURANCE (OVL-INJ-001 existence check) |

---

### Step 0.3 — Trigger Category Classification

| Trigger Category | Status | Basis | IAA Triggered at Handover? |
|-----------------|--------|-------|---------------------------|
| **PRE_BRIEF_ASSURANCE** | **CONFIRMED — ALWAYS APPLIES** | This Pre-Brief artifact is committed to the branch. OVL-INJ-001 (artifact existence check only) applies at handover for any qualifying PR. | YES — existence check only (OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002) |
| **CANON_GOVERNANCE** | **CONDITIONAL — HIGH PROBABILITY** | The plan registry (`governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`) is a governance document. If Foreman updates it to log CL-2 jobs (T-CL2-005), this trigger fires. Also fires if acceptance gate CL-2-A1 documents are placed in any `governance/` path. | FIRES if ANY `governance/` file is added or modified |
| **KNOWLEDGE_GOVERNANCE** | **CONDITIONAL — LOW PROBABILITY** | Fires only if files are added or modified in `.agent-workspace/*/knowledge/` directories. The existing LKIAC-W2 audit files in `.agent-workspace/audit/` do NOT trigger this category (audit ≠ knowledge). | FIRES only if `*/knowledge/` dir files are modified |
| **AGENT_CONTRACT** | NOT APPLICABLE | No `.github/agents/` modifications declared or expected. | NO |
| **CI_WORKFLOW** | NOT APPLICABLE | No `.github/workflows/` changes declared or expected. | NO |
| **AAWP_MAT** | NOT APPLICABLE | No production code, schemas, or migrations expected per wave description. | NO |
| **EXEMPT** | CONDITIONAL — BASELINE | If the final PR contains ONLY: wave-current-tasks.md, session memory, PREHANDOVER proof, and this Pre-Brief artifact — then only OVL-INJ-001 applies (PRE_BRIEF_ASSURANCE). No full assurance overlay required beyond PRE_BRIEF_ASSURANCE. | APPLIES if no governance docs modified |

**AMBIGUITY RULE applied**: If the Foreman adds ANY file to `governance/` (including updating the plan registry), CANON_GOVERNANCE fires regardless of how the change is characterised. Per FAIL-ONLY-ONCE A-003, ambiguity resolves to mandatory IAA invocation. The Foreman must declare all modified `governance/` files explicitly in the PREHANDOVER proof.

---

### Step 0.4 — FFA Checks Declared for Handover

IAA declares the following checks that will be executed at handover. All are blocking (PHASE_B_BLOCKING).

#### Universal Core Invariants (all PRs — regardless of category)

| Check ID | Check Name | Expected at Handover |
|----------|-----------|---------------------|
| CORE-005 | Governance block present | Baseline — standard governance field verification |
| CORE-006 | CANON_INVENTORY alignment | All referenced governance artifacts must have non-null SHA256 hashes |
| CORE-007 | No placeholder content | A-029 carve-out applies: `iaa_audit_token: IAA-session-wave-cl2-YYYYMMDD-PASS` is a valid pre-populated reference, not a placeholder |
| CORE-013 | IAA invocation evidence | THIS Pre-Brief artifact satisfies A-001 invocation evidence requirement |
| CORE-014 | No class exemption claim | Foreman class is NOT exempt from IAA — per A-002 and AGCFPP-001 |
| CORE-015 | Session memory present | Foreman session memory must be committed on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file must exist at `.agent-admin/assurance/iaa-token-session-wave-cl2-YYYYMMDD.md` after handover IAA verdict |
| CORE-017 | No `.github/agents/` modifications | Not expected — will verify PR diff |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof + session memory + `iaa_audit_token` field + dedicated token file — ALL four must be present |
| CORE-019 | IAA token cross-verification | §4.3b first-invocation exception may apply for this session |
| CORE-020 | Zero partial pass rule | No assumed passes — absence of evidence = FAIL |
| CORE-021 | Zero-severity-tolerance | No soft-pass language accepted |
| CORE-023 | Workflow integrity ripple check | Expected N/A — no code changes declared. Will record `CORE-023: N/A — no workflow-adjacent changes detected` at handover |

#### PRE_BRIEF_ASSURANCE Overlay (always applies when ANY triggering category present)

| Check ID | Check Name | Pass Condition |
|----------|-----------|---------------|
| OVL-INJ-001 | Pre-Brief Artifact Existence | This artifact at `.agent-admin/assurance/iaa-prebrief-cl2-knowledge-inventory.md` — committed before any builder task artifact on branch |
| OVL-INJ-ADM-001 | Pre-Brief artifact non-empty | Confirmed — this document contains substantive content |
| OVL-INJ-ADM-002 | Pre-Brief references correct wave | Wave CL-2 declared — must match `wave-current-tasks.md` wave ID at handover |

#### CANON_GOVERNANCE Overlay (applies if ANY `governance/` file is modified)

If CANON_GOVERNANCE fires, IAA will load the full CANON_GOVERNANCE overlay from
`iaa-category-overlays.md` at handover. Key checks include:
- Canon document format and version compliance
- Change rationale documented and traceable to wave authorisation
- No contradictions with existing canonical governance documents
- Version history updated in modified documents
- PREHANDOVER proof declares all modified `governance/` files

#### KNOWLEDGE_GOVERNANCE Overlay (applies only if `*/knowledge/` dir files modified)

If KNOWLEDGE_GOVERNANCE fires, IAA will apply OVL-KG-001 through OVL-KG-005:
- OVL-KG-001: Rule clarity — new rules clearly stated
- OVL-KG-002: Triggered by real incident
- OVL-KG-003: No duplication with existing rules
- OVL-KG-004: Cross-reference consistency
- Plus admin existence checks

---

### Step 0.5 — Required PREHANDOVER Proof Structure

The Foreman's PREHANDOVER proof at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-cl2-YYYYMMDD.md`
MUST contain ALL of the following. Missing fields = REJECTION-PACKAGE at CORE-018.

```yaml
wave_id: CL-2
session_id: session-wave-cl2-20260313
branch: copilot/cl-2-initiate-knowledge-inventory
date: 2026-03-13
producing_agent: foreman-v2-agent v6.2.0
pr_title: "Wave CL-2: LKIAC Wave 2 — Legacy Knowledge Inventory and Domain Tagging Plan"

# REQUIRED — list ALL committed artifacts (A-026 + CORE-018)
# This list must exactly match `git diff --name-only origin/main...HEAD` at commit time
artifacts_committed:
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md        # REQUIRED — must be updated for CL-2
  - .agent-workspace/foreman-v2/memory/session-wave-cl2-YYYYMMDD.md  # REQUIRED — session memory
  - .agent-admin/assurance/iaa-prebrief-cl2-knowledge-inventory.md    # REQUIRED — this file
  # CONDITIONAL — include if plan registry updated:
  # - governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md
  # CONDITIONAL — include if acceptance gate doc created:
  # - [path to CL-2-A1 acceptance gate document]
  # CONDITIONAL — include if any other governance files modified:
  # - [list all modified governance/ paths]

# A-026 compliance — MANDATORY (verify with git diff --name-only origin/main...HEAD)
scope_declaration_matches_pr_diff: YES

# A-029 compliance — pre-populated expected reference (NOT a placeholder per A-029)
iaa_audit_token: IAA-session-wave-cl2-20260313-PASS

# IAA Pre-Brief evidence
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-cl2-knowledge-inventory.md
iaa_prebrief_committed_sha: [SHA of Pre-Brief commit — to be populated after commit]

# Trigger category declared (Foreman must declare final category at PREHANDOVER time)
pr_trigger_category: PRE_BRIEF_ASSURANCE  # + CANON_GOVERNANCE if any governance/ files modified

# CL-2 Acceptance Criteria attestation
acceptance_criteria_met:
  - CL-2 started: YES
  - Jobs logged in plan registry: [YES / NO]
  - No blockers present: [YES / NO]
  - Parallel execution with CL-4 confirmed: [YES / NO]

# CS2 authorisation reference
cs2_authorisation: maturion-isms issue CL-2 opened by CS2 (@APGI-cmy)
```

**MANDATORY FIELD NOTES:**
1. **`scope_declaration_matches_pr_diff`** (A-026): Run `git diff --name-only origin/main...HEAD` immediately before committing the PREHANDOVER proof. Stale scope declarations = REJECTION-PACKAGE at BL-027.
2. **`iaa_audit_token`** (A-029): The pre-populated reference `IAA-session-wave-cl2-20260313-PASS` is the expected reference format — this is NOT a placeholder. Do NOT write `PENDING` or `TBD` here.
3. **PREHANDOVER proof immutability (§4.3b)**: The PREHANDOVER proof is READ-ONLY after initial commit. IAA will write its verdict to a separate dedicated token file — the PREHANDOVER proof is never edited by IAA.

---

### Step 0.6 — Scope Blockers and Governance Conflicts

**No hard blockers found. Wave CL-2 may proceed.**

| # | Finding | Severity | Blocking? | Required Action |
|---|---------|----------|-----------|-----------------|
| B-CL2-001 | `wave-current-tasks.md` currently shows prior wave (wave-status-sweep-20260312) as the active record. Foreman must update this for CL-2 before PREHANDOVER. | INFO | ❌ NON-BLOCKING | Foreman standard task — update before PREHANDOVER ceremony |
| B-CL2-002 | Wave 17 (`copilot/implement-user-guided-ai-parsing`) status = `ASSURANCE_TOKEN_PENDING` on a separate branch. Independent workstream — no conflict with CL-2. | INFO | ❌ NON-BLOCKING | No action required |
| B-CL2-003 | Combined Execution Plan (`governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`) at v1.4.0 already exists. If Foreman logs CL-2 jobs into this document (T-CL2-005), it constitutes a governance document modification and **CANON_GOVERNANCE fires**. Foreman must declare this file in PREHANDOVER if modified. | ADVISORY | ❌ NON-BLOCKING (but CANON_GOVERNANCE trigger requires declaration) | Declare in PREHANDOVER `artifacts_committed` list if modified |
| B-CL2-004 | Prior CL-2 draft deliverables exist on `main`: `LKIAC-W2-legacy-inventory-20260301.md` (CL-2-D1) and `LKIAC-W2-domain-tag-map-20260301.md` (CL-2-D2/D3) in `.agent-workspace/audit/`. Status: DRAFT — Awaiting CS2 Review (CP-2). These files are in `.agent-workspace/audit/` — NOT in `*/knowledge/` — so modifying them does NOT trigger KNOWLEDGE_GOVERNANCE. However, if any are moved into `governance/`, CANON_GOVERNANCE fires. | ADVISORY | ❌ NON-BLOCKING | Foreman should assess whether CL-2 modifies these drafts; declare any modified audit docs in PREHANDOVER |
| B-CL2-005 | IAA breach registry is CLEAR. No open REJECTION-PACKAGEs affecting CL-2 scope. | INFO | ❌ NON-BLOCKING | None required |

**Parallel Wave CL-4 Governance Note:**
- CL-2 and CL-4 are declared as independent parallel workstreams
- If any artifact is shared between CL-2 and CL-4 PRs, Foreman must declare the dependency explicitly in the PREHANDOVER proof for the wave that modifies the shared artifact
- Separate IAA invocations are required for each wave's handover — cross-wave token reuse = REJECTION-PACKAGE per FAIL-ONLY-ONCE A-016

---

## Pre-Brief Summary

```yaml
pre_brief_status: COMPLETE
wave: CL-2
date: 2026-03-13
iaa_agent: independent-assurance-agent v6.2.0
adoption_phase: PHASE_B_BLOCKING

qualifying_tasks:
  T-CL2-007:
    status: ALWAYS QUALIFYING
    category: PRE_BRIEF_ASSURANCE
    check: OVL-INJ-001 (existence only)
  T-CL2-004:
    status: CONDITIONALLY QUALIFYING
    condition: if acceptance gate doc placed in governance/
    category: CANON_GOVERNANCE
  T-CL2-005:
    status: CONDITIONALLY QUALIFYING
    condition: if plan registry (AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md) modified
    category: CANON_GOVERNANCE

trigger_categories_declared:
  PRE_BRIEF_ASSURANCE: CONFIRMED — applies at handover
  CANON_GOVERNANCE: CONDITIONAL — fires if any governance/ file modified
  KNOWLEDGE_GOVERNANCE: CONDITIONAL — fires only if knowledge/ dir files modified
  AGENT_CONTRACT: NOT APPLICABLE
  CI_WORKFLOW: NOT APPLICABLE
  AAWP_MAT: NOT APPLICABLE

iaa_invocation_at_handover: REQUIRED
hard_blockers: NONE
governance_conflicts: NONE
parallel_execution_conflict: NONE (CL-2 and CL-4 independent)
this_artifact_path: .agent-admin/assurance/iaa-prebrief-cl2-knowledge-inventory.md
prehandover_proof_required: true
prehandover_proof_path: .agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-cl2-YYYYMMDD.md
session_memory_required: true
session_memory_path: .agent-workspace/foreman-v2/memory/session-wave-cl2-YYYYMMDD.md
dedicated_token_file_required_at_handover: true
dedicated_token_file_pattern: .agent-admin/assurance/iaa-token-session-wave-cl2-YYYYMMDD.md
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Version**: independent-assurance-agent v6.2.0  
**Contract Version**: 2.2.0  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  
**STOP-AND-FIX Mandate**: ACTIVE — No class exceptions — Ambiguity resolves to mandatory invocation
