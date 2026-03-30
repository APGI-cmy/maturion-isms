# IAA Pre-Brief — Wave DCKIS-CL11

**Agent**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Pre-Brief Version**: 1.0.0
**Date**: 2026-03-20
**Wave**: DCKIS-CL11 — Programme Close-Out: LKIAC CEP & Documentation Finalisation
**Branch**: `copilot/update-aimc-lkiac-combined-execution-plan`
**Issue**: [governance-liaison] DCKIS-CL11: Programme Close-Out — LKIAC CEP & Documentation Finalisation
**Producing Agent**: governance-liaison-isms-agent
**Invoking Agent**: foreman-v2-agent
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## Phase 0 — Pre-Brief Invocation Confirmation

This document is produced in response to a PRE-BRIEF invocation (Phase 0). IAA is NOT executing
Phases 2–4 assurance at this time. This artifact is committed as the pre-brief gate before
governance-liaison-isms-agent is delegated any deliverable work.

IAA will execute Phases 2–4 at handover (post-delivery) when invoked by foreman-v2-agent.

---

## Step 0.2 — Wave Scope (from wave-current-tasks.md)

**Wave**: DCKIS-CL11 — Programme Close-Out: LKIAC CEP & Documentation Finalisation

**Description**: Governance-liaison-isms-agent updates the AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md
with CL-11 status documentation (Amendment v1.7.0) and prepares CL-3 deprecation entries in
LKIAC_DEPRECATION_REGISTER.md.

**Entry Criterion**: DCKIS-IMPL-002 merged to main (PR #1182 — must be confirmed).

**Deliverables**:

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| CL11-D1 | AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md Amendment v1.7.0: CL-11 documentation | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | PENDING |
| CL11-D2 | LKIAC_DEPRECATION_REGISTER.md: CL-3 deprecation entries prepared | `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` | PENDING |
| CL11-D3 | Close-out summary posted as issue comment | GitHub issue comment | PENDING — not a git artifact |

**Constraints**:
- governance-liaison-isms-agent handles all documentation (Foreman NO-IMPLEMENT-001)
- Architecture document updates only — no code changes
- No AAWP/MAT deliverables in scope

---

## Step 0.3 — Trigger Category Classification

### Classification Analysis

| File | Path | Trigger Check |
|------|------|--------------|
| CL11-D1 | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | Within `governance/` directory; programme governance tracking document; NOT in `governance/canon/`; NOT matching `*ARCHITECTURE*.md` or `*STRATEGY*.md`; NOT in CANON_INVENTORY.json |
| CL11-D2 | `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` | Within `governance/aimc/` directory; programme governance register; NOT in `governance/canon/`; NOT in CANON_INVENTORY.json |
| CL11-D3 | GitHub issue comment | Not a git artifact; IAA cannot verify at merge gate |

### Classification Result

**Primary Category: CANON_GOVERNANCE**

**Rationale**: Although neither deliverable file resides in `governance/canon/` strictly, both
files are programme governance documents within the `governance/` directory that record the
authoritative execution state of the AIMC/LKIAC programme. The wave explicitly frames these
as governance documentation requiring IAA invocation. Furthermore, FAIL-ONLY-ONCE **A-003**
(Ambiguity Resolves to Mandatory Invocation) applies: any governance document within the
`governance/` directory structure that is not unambiguously EXEMPT resolves to mandatory IAA
invocation. These files are not "pure doc-only changes outside governance" — they ARE governance
programme tracking records within a formal directory structure.

**AMBIGUITY RULE applied**: Classification falls between CANON_GOVERNANCE (closest structural
match for governance/ documents) and EXEMPT (no canon/ files touched). A-003 resolves to
MANDATORY INVOCATION. Category: CANON_GOVERNANCE.

**Secondary Overlays Triggered**:
- PRE_BRIEF_ASSURANCE (OVL-INJ-001) — applies alongside all triggering categories

**IAA Required at Handover**: YES — PHASE_B_BLOCKING (hard gate)

---

## Step 0.4 — Qualifying Tasks

### CL11-TASK-1: CL11-D1 — AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md Amendment v1.7.0

```yaml
task_id: CL11-TASK-1
task_summary: >
  governance-liaison-isms-agent updates AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md to add
  Amendment v1.7.0 recording CL-11 wave status, entry criteria, deliverable completion,
  and close-out notes.
iaa_trigger_category: CANON_GOVERNANCE
qualifying: true
required_phases: [2, 3, 4]
```

### CL11-TASK-2: CL11-D2 — LKIAC_DEPRECATION_REGISTER.md CL-3 Entries

```yaml
task_id: CL11-TASK-2
task_summary: >
  governance-liaison-isms-agent adds CL-3 deprecation entries to LKIAC_DEPRECATION_REGISTER.md,
  including relevant components, status transitions, and audit trail rows.
iaa_trigger_category: CANON_GOVERNANCE
qualifying: true
required_phases: [2, 3, 4]
```

### CL11-TASK-3: CL11-D3 — Close-Out Issue Comment

```yaml
task_id: CL11-TASK-3
task_summary: >
  governance-liaison-isms-agent posts a close-out summary comment on the GitHub issue
  confirming all deliverables complete and wave exit criteria met.
iaa_trigger_category: EXEMPT (GitHub comment — not a git artifact)
qualifying: false
note: >
  CL11-D3 is a GitHub issue comment, not a git-tracked artifact. IAA cannot verify this
  at the PR merge gate. governance-liaison-isms-agent should reference CL11-D3 completion
  in the PREHANDOVER proof as an out-of-band deliverable. IAA will accept a screenshot URL
  or issue link as evidence — it cannot hard-block on absence of a comment.
```

---

## Step 0.5 — FFA (FAIL-ONLY-ONCE A-Rule) Checks at Handover

The following FAIL-ONLY-ONCE rules will be explicitly verified when IAA is invoked at handover:

### Mandatory A-Rules for This Wave

| Rule | Check at Handover | Blocking |
|------|------------------|----------|
| **A-003** | AMBIGUITY RULE: Confirm no class exemption claim was made; confirm CANON_GOVERNANCE classification was accepted | YES |
| **A-019** | Trigger table not misapplied — CANON_GOVERNANCE correctly triggers IAA; producing agent did not self-assess as EXEMPT | YES |
| **A-021** | All artifacts (deliverables + PREHANDOVER proof + session memory) committed to git BEFORE IAA invocation. IAA will verify via `git ls-tree HEAD` | YES |
| **A-026** | SCOPE_DECLARATION.md updated to exactly match PR diff for this branch. ⚠️ CURRENT STATE: SCOPE_DECLARATION.md contains DCKIS-IMPL-002 content (IMPL-002 entries) — it MUST be rewritten for CL11 before IAA invocation | YES |
| **A-028** | SCOPE_DECLARATION.md uses list format; prior-wave entries trimmed | YES |
| **A-029** | PREHANDOVER proof is committed before IAA invocation and is read-only post-commit | YES |
| **A-029b** | No unresolved carry-forward items from prior sessions — check session-wave20-atomic-write-back-20260318-R2 for any open items | YES |
| **A-033** | CORE-018 verification uses `git ls-tree HEAD`, not disk `-f` check | YES |

### Applicable A-Rules (Context-Dependent)

| Rule | Check at Handover | Blocking |
|------|------------------|----------|
| **A-001** | IAA invocation evidence present in PR artifacts (PREHANDOVER proof must reference this pre-brief and expected IAA token) | YES |
| **A-022** | Re-evaluate trigger categories on every invocation — confirm no new triggering artifacts added between Pre-Brief and handover | YES |

---

## Step 0.6 — Required PREHANDOVER Proof Structure

governance-liaison-isms-agent MUST produce a PREHANDOVER proof with the following structure
before invoking IAA at handover:

```markdown
# PREHANDOVER PROOF — DCKIS-CL11

**Agent**: governance-liaison-isms-agent
**Wave**: DCKIS-CL11
**Session**: session-dckis-cl11-YYYYMMDD
**Branch**: copilot/update-aimc-lkiac-combined-execution-plan
**Date**: YYYY-MM-DD
**Authority**: CS2 (@APGI-cmy) via Foreman delegation

## Entry Criterion Confirmation

- PR #1182 (DCKIS-IMPL-002) merged to main: [YES — confirmed / NOT CONFIRMED — BLOCKER]
  - Evidence: [link or SHA confirming merge]

## Deliverables Manifest

| ID | Artefact | Path | Status | Notes |
|----|---------|------|--------|-------|
| CL11-D1 | AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md v1.7.0 | governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md | DELIVERED | Amendment v1.7.0 section present |
| CL11-D2 | LKIAC_DEPRECATION_REGISTER.md CL-3 entries | governance/aimc/LKIAC_DEPRECATION_REGISTER.md | DELIVERED | New CL-3 rows in register and audit trail |
| CL11-D3 | Close-out issue comment | GitHub issue URL: [link] | POSTED (out-of-band) | Cannot be verified at PR gate — link provided |

## Governance Document Version Check

- AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md header declares: v1.7.0 (must exceed prior v1.6.0)
- LKIAC_DEPRECATION_REGISTER.md header declares: [new version] (must exceed prior v1.2.0)

## CANON_INVENTORY Status

- CL11-D1 and CL11-D2 are NOT listed in CANON_INVENTORY.json — confirmed NOT canon files
- No CANON_INVENTORY update required — justified: these are programme tracking documents,
  not canonical governance rules

## SCOPE_DECLARATION.md Compliance (A-026, A-028)

Confirmed: SCOPE_DECLARATION.md rewritten for CL11, contains ONLY files in this PR diff.
Prior DCKIS-IMPL-002 entries have been removed (A-028 compliance).

## Pre-Brief Artifact Reference (OVL-INJ-001)

Pre-Brief artifact committed at: `.agent-admin/assurance/iaa-prebrief-dckis-cl11.md`
Pre-Brief committed before any deliverable work on this branch: [YES — confirm SHA ordering]

## Git Commit Evidence (A-021, A-033)

All artifacts committed before IAA invocation:
- PREHANDOVER proof SHA: [git SHA]
- Session memory SHA: [git SHA]
- CL11-D1 SHA: [git SHA]
- CL11-D2 SHA: [git SHA]
Verification: `git ls-tree HEAD` output confirms all files listed above are tracked.

## Session Memory Reference

Session memory committed at: `.agent-workspace/governance-liaison-isms-agent/memory/session-dckis-cl11-YYYYMMDD.md`

## IAA Audit Token (pre-populated — A-029)

iaa_audit_token: IAA-session-dckis-cl11-YYYYMMDD-PASS

(This is the expected reference. IAA will write the actual token to:
`.agent-admin/assurance/iaa-token-session-dckis-cl11-YYYYMMDD.md`)
```

---

## Step 0.7 — Required Evidence Artifacts at Handover

IAA will require ALL of the following to be committed to git on the branch before invocation:

| Artifact | Path | Purpose | Hard Gate |
|---------|------|---------|-----------|
| Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-dckis-cl11.md` | OVL-INJ-001 | YES |
| PREHANDOVER proof | Root level `PREHANDOVER_PROOF_DCKIS_CL11.md` or similar | CORE-013, CORE-018 | YES |
| Session memory | `.agent-workspace/governance-liaison-isms-agent/memory/session-dckis-cl11-YYYYMMDD.md` | CORE-015, CORE-018 | YES |
| SCOPE_DECLARATION.md | `SCOPE_DECLARATION.md` | A-026, A-028 | YES |
| CL11-D1 | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` | Subject matter | YES |
| CL11-D2 | `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` | Subject matter | YES |

---

## Step 0.8 — Applicable Checklists at Handover

### Core Invariants (all-PR layer)

| Check | Applies | Expected Verdict |
|-------|---------|-----------------|
| CORE-005 | YES — governance block present | Confirm no agent-YAML blocks in these doc files (N/A) |
| CORE-006 | YES — confirm CL11-D1/D2 are NOT in CANON_INVENTORY; if they are → FAIL | Confirm absent → no CANON_INVENTORY update needed |
| CORE-007 | YES — no placeholder content in CL11-D1 or CL11-D2 | No STUB/TODO/TBD/FIXME |
| CORE-013 | YES — IAA invocation evidence | PREHANDOVER proof references IAA token |
| CORE-014 | YES — no class exemption claim | Confirm governance-liaison accepted CANON_GOVERNANCE category |
| CORE-015 | YES — session memory present | Memory file committed |
| CORE-016 | YES — IAA token file exists | Created during this handover invocation |
| CORE-017 | YES — no .github/agents/ modifications | Confirm diff contains no agent files |
| CORE-018 | YES — full evidence sweep | All 4 evidence items present via `git ls-tree HEAD` |
| CORE-019 | YES — token cross-verification | First invocation → token file created this session |
| CORE-020 | YES — zero partial pass | All or nothing |
| CORE-021 | YES — zero-severity-tolerance | No softening of findings |
| CORE-023 | YES (N/A expected) | No workflow-adjacent files → N/A |

### CANON_GOVERNANCE Overlay

| Check | What IAA Will Verify |
|-------|---------------------|
| OVL-CG-001 | Strategy alignment: does the v1.7.0 amendment correctly reflect CL-11 execution status per AIMC/LKIAC strategy? Is the recorded state accurate? |
| OVL-CG-002 | No contradictions: does the CL-11 documentation contradict any existing canon rule or prior programme state? |
| OVL-CG-003 | Enforcement gap: are the new CL-3 deprecation entries in LKIAC_DEPRECATION_REGISTER.md actionable and traceable? |
| OVL-CG-004 | Ripple impact: does this close-out require any corresponding updates in agent contracts, knowledge files, or other programme documents? If yes — are they included? |
| OVL-CG-005 | ISMS layer-down: were all documents affected by the CL-11 status change touched? |
| OVL-CG-ADM-001 | CANON_INVENTORY: NOT expected to update (files not in canon) — IAA confirms this is justified |
| OVL-CG-ADM-002 | Version bump: CL11-D1 header must declare v1.7.0 (> v1.6.0); CL11-D2 must declare version exceeding v1.2.0 |

### PRE_BRIEF_ASSURANCE Overlay

| Check | What IAA Will Verify |
|-------|---------------------|
| OVL-INJ-001 | This pre-brief artifact exists at `.agent-admin/assurance/iaa-prebrief-dckis-cl11.md` and was committed before any deliverable |
| OVL-INJ-ADM-001 | This file is non-empty (confirmed — it is this document) |
| OVL-INJ-ADM-002 | This file declares wave DCKIS-CL11 (confirmed in header) |

---

## Step 0.9 — Scope Blockers and Governance Conflicts

### BLOCKER-1: SCOPE_DECLARATION.md Rewrite Required (BLOCKING)

**Status**: 🔴 MUST FIX BEFORE DELIVERABLES

The current `SCOPE_DECLARATION.md` at root contains DCKIS-IMPL-002 content from the prior wave
(ui-builder, session-dckis-impl-002-20260320). Per **FAIL-ONLY-ONCE A-026** and **A-028**:

- SCOPE_DECLARATION.md MUST be rewritten to declare only the CL11 PR diff before IAA invocation
- All DCKIS-IMPL-002 entries must be removed (A-028 format compliance)
- Governance-liaison-isms-agent must update SCOPE_DECLARATION.md as part of this wave's work

**Action required**: governance-liaison-isms-agent rewrites SCOPE_DECLARATION.md for CL11
before committing PREHANDOVER proof.

---

### BLOCKER-2: Entry Criterion Verification Required (BLOCKING)

**Status**: 🔴 MUST CONFIRM IN PREHANDOVER PROOF

The wave entry criterion is: **DCKIS-IMPL-002 merged to main (PR #1182)**.
This must be explicitly confirmed in the PREHANDOVER proof with evidence (PR link or SHA).
If PR #1182 is NOT merged, governance-liaison-isms-agent must NOT proceed with CL11 deliverables.

**Action required**: PREHANDOVER proof must include explicit confirmation of PR #1182 merge
status with evidence link.

---

### ADVISORY-1: CL11-D3 Out-of-Band Deliverable (NON-BLOCKING — INFO)

**Status**: 🟡 ADVISORY

CL11-D3 (close-out issue comment) is a GitHub comment, not a git-tracked artifact. IAA cannot
verify it at the PR merge gate. governance-liaison-isms-agent should:
1. Post the close-out comment on the GitHub issue
2. Include the issue comment URL in the PREHANDOVER proof
3. IAA will record the URL as advisory evidence — it WILL NOT hard-block on the comment's content

---

### ADVISORY-2: CANON_INVENTORY Not Required for These Files (NON-BLOCKING — INFO)

**Status**: 🟡 ADVISORY

Confirmed: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` and
`governance/aimc/LKIAC_DEPRECATION_REGISTER.md` are NOT listed in `governance/CANON_INVENTORY.json`.
These are programme tracking documents, not canon rules. OVL-CG-ADM-001 will be satisfied
by governance-liaison confirming no CANON_INVENTORY update is needed (not by updating it).

This must be explicitly stated in the PREHANDOVER proof.

---

### ADVISORY-3: Ripple Impact Check Required (NON-BLOCKING — PRE-EMPTIVE GUIDANCE)

**Status**: 🟡 ADVISORY

Per OVL-CG-004: governance-liaison-isms-agent must assess whether the CL-11 close-out requires
corresponding updates in:
- Any agent contracts that reference LKIAC programme status
- The `wave-current-tasks.md` (status update from PENDING → COMPLETE)
- Any other programme documents that reference DCKIS implementation waves

If no ripple updates are needed, this must be explicitly stated in the PREHANDOVER proof.
If ripple updates ARE needed and NOT included → REJECTION-PACKAGE at handover.

---

## Pre-Brief Summary

```yaml
wave: DCKIS-CL11
iaa_required: true
trigger_category: CANON_GOVERNANCE
ambiguity_rule_applied: true  # A-003 — governance docs within governance/ structure
iaa_phase: PHASE_B_BLOCKING
qualifying_tasks: [CL11-TASK-1, CL11-TASK-2]
non_qualifying_tasks: [CL11-TASK-3]  # GitHub comment — out-of-band
scope_blockers:
  - BLOCKER-1: SCOPE_DECLARATION.md rewrite required (BLOCKING)
  - BLOCKER-2: Entry criterion PR #1182 confirmation required (BLOCKING)
advisories:
  - ADVISORY-1: CL11-D3 out-of-band — cannot hard-block
  - ADVISORY-2: CANON_INVENTORY not required — must be justified in PREHANDOVER
  - ADVISORY-3: Ripple impact assessment required in PREHANDOVER proof
prehandover_proof_structure: declared above in Step 0.6
evidence_artifacts_required:
  - .agent-admin/assurance/iaa-prebrief-dckis-cl11.md  # THIS FILE
  - PREHANDOVER_PROOF_DCKIS_CL11.md (or equivalent)
  - .agent-workspace/governance-liaison-isms-agent/memory/session-dckis-cl11-YYYYMMDD.md
  - SCOPE_DECLARATION.md (rewritten for CL11)
  - governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md (v1.7.0)
  - governance/aimc/LKIAC_DEPRECATION_REGISTER.md (new version > v1.2.0)
```

---

**Pre-Brief Status**: COMPLETE — Committed to `.agent-admin/assurance/iaa-prebrief-dckis-cl11.md`
**Next Action**: foreman-v2-agent delegates CL11 to governance-liaison-isms-agent; agent delivers
CL11-D1 and CL11-D2; produces PREHANDOVER proof per Step 0.6 structure; invokes IAA at handover.

---

*IAA Pre-Brief produced under Phase 0 protocol. Phases 2–4 assurance deferred to handover invocation.*
*Authority: CS2 (Johan Ras / @APGI-cmy) | IAA v6.2.0 | PHASE_B_BLOCKING*
