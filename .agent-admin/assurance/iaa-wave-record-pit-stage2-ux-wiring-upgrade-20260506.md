# IAA Wave Record — pit-stage2-ux-wiring-upgrade-20260506 — 2026-05-06

**Record Version**: 1.0.0
**Wave**: pit-stage2-ux-wiring-upgrade-20260506
**Branch**: copilot/upgrade-pit-stage-2-ux-workflow
**Issue**: maturion-isms#1550
**PR**: maturion-isms#1551
**Date Created**: 2026-05-06
**Authority**: GOVERNANCE_ARTIFACT_TAXONOMY.md v2.0.0
**Ceremony Admin Appointed**: NO — not yet appointed; pre-brief stage only

---

## PRE-BRIEF

### Step 0.1 — Pre-Brief Mode Confirmed

Triggered by: `[IAA PRE-BRIEF REQUEST]` — foreman-v2-agent requesting wave classification.
Mode: **PHASE 0 — PRE-BRIEF ONLY**. Phases 1–4 are NOT executed at this stage.
Authority: IAA contract §Phase 0, Step 0.1.

---

### Step 0.2 — Wave Analysis

**Wave**: pit-stage2-ux-wiring-upgrade-20260506
**Source Request**: Issue #1550 — Foreman: Upgrade PIT Stage 2 UX Workflow & Wiring Spec to gate-ready completeness
**Invoking Agent**: foreman-v2-agent
**Wave Type**: Governance/documentation — Stage 2 spec upgrade from v0.1-draft to v0.2-draft; no code, schema, migration, CI, or builder appointment changes declared.

---

### Step 0.2a — Trigger Classification

**File-by-file trigger analysis** per `iaa-trigger-table.md` v2.5.0:

| # | Artifact Path | Change Type | Trigger Category Contribution |
|---|--------------|------------|-------------------------------|
| 1 | `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` | Upgrade (v0.1-draft → v0.2-draft, 12 additions) | **PRE_BUILD_STAGE_MODEL** — Stage 2 lifecycle advancement |
| 2 | `modules/pit/BUILD_PROGRESS_TRACKER.md` | Update (Stage 2 progress) | **PRE_BUILD_STAGE_MODEL** — tracker alignment |
| 3 | `.admin/prs/pr-1551.json` | Create (PR manifest) | Admin — no trigger |
| 4 | `.agent-admin/scope-declarations/pr-1551.md` | Create (scope declaration) | Admin — no trigger |
| 5 | `.agent-admin/assurance/iaa-wave-record-pit-stage2-ux-wiring-upgrade-20260506.md` | Create (this file) | IAA ceremony artifact — A-031 carve-out |
| 6 | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Update | Foreman workspace |
| 7 | `.agent-workspace/foreman-v2/memory/` | Session memory | Foreman workspace |
| 8 | `.agent-admin/evidence/stage2-upgrade-checklist/pit-stage2-20260506.md` | Create (upgrade checklist evidence) | **PRE_BUILD_STAGE_MODEL** — stage evidence |

**Dominant classification**: `PRE_BUILD_STAGE_MODEL`

No `.github/agents/` changes → AGENT_CONTRACT: **not triggered**
No `.github/workflows/` changes → CI_WORKFLOW: **not triggered**
No `governance/canon/` changes → CANON_GOVERNANCE: **not triggered**
No `.agent-workspace/*/knowledge/` changes → KNOWLEDGE_GOVERNANCE: **not triggered**
No `aawp-deliverable` or `mat-deliverable` label → AAWP_MAT: **not triggered**

**Classification verdict**: `PRE_BUILD_STAGE_MODEL` — UNAMBIGUOUS
**AMBIGUITY RULE (A-003)**: CLEAR — no ambiguity. Single dominant category.
**IAA Required at Handover**: YES — MANDATORY

---

### Step 0.2b — Qualifying Tasks

```
Qualifying tasks:
  T-1: Upgrade modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md
       from v0.1-draft to v0.2-draft with 12 declared additions (see scope §Additions below)
  T-2: Update modules/pit/BUILD_PROGRESS_TRACKER.md to reflect Stage 2 progress
  T-3: Create governance evidence artifacts:
       - .agent-admin/evidence/stage2-upgrade-checklist/pit-stage2-20260506.md
       - .agent-admin/scope-declarations/pr-1551.md
       - .admin/prs/pr-1551.json
       - .agent-workspace/foreman-v2/personal/wave-current-tasks.md (new wave state)

Applicable overlay:
  PRIMARY: PRE_BUILD_GATES — OVL-PBG-001 through OVL-PBG-017
  SUPPLEMENTAL: PRE_BRIEF_ASSURANCE (OVL-INJ-ADM-001–003, stage-readiness view)

Anti-regression obligations:
  NO — this PR contains no code changes.
  FUNCTIONAL-BEHAVIOUR-REGISTRY.md patterns (NBR-001 through NBR-00x) govern BUILD/code PRs
  only. None apply to this documentation-only wave.
  Applicable FAIL-ONLY-ONCE rules: A-003 (ambiguity — CLEAR), A-029 (token field pattern —
  applies at handover, not pre-brief).
```

---

### Step 0.2c — Stage-Readiness View (OVL-INJ-ADM-003)

Per PRE_BUILD_STAGE_MODEL_CANON.md §10, IAA must declare stage-readiness at pre-brief:

| Stage | Name | Status | Evidence |
|-------|------|--------|----------|
| Stage 1 | App Description | ✅ COMPLETE | `docs/governance/PIT_APP_DESCRIPTION.md` v1.0, CS2 Approved 2026-05-06; `modules/pit/00-app-description/app-description.md` v1.0 Authoritative; PR #1541 merged (Issue #1540) |
| Stage 2 | UX Workflow & Wiring Spec | 🔄 IN PROGRESS | v0.1-draft present at `modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`; this wave upgrades to v0.2-draft |
| Stage 3 | FRS | ⏸ NOT STARTED | Blocked by Stage 2 gate clearance |
| Stage 4 | TRS | ⏸ NOT STARTED | Blocked by Stage 3 |
| Stage 5 | Architecture | ⏸ NOT STARTED | Blocked by Stage 4 |
| Stage 6 | QA-to-Red | ⏸ NOT STARTED | Blocked by Stage 5 |
| Stage 7 | PBFAG | ⏸ NOT STARTED | Blocked by Stage 6 |
| Stage 8 | Implementation Plan | ⏸ NOT STARTED | Blocked by Stage 7 |
| Stage 9 | Builder Checklist | ⏸ NOT STARTED | Blocked by Stage 8 |
| Stage 10 | IAA Pre-Brief | ⏸ NOT STARTED | Blocked by Stage 9 |
| Stage 11 | Builder Appointment | ⏸ NOT STARTED | Blocked by Stage 10 |
| Stage 12 | Build Execution & Evidence | ⏸ NOT STARTED | Blocked by Stage 11 |

**Blockers preventing Stage 11 builder appointment**: Stages 2–10 all remain incomplete.
This wave concerns Stage 2 gate advancement only. Builder delegation is not within scope.

---

### Step 0.2d — 12 Required Additions Scope Declaration

The following 12 additions must be verified present and correct at handover assurance:

| # | Addition | Description |
|---|----------|-------------|
| A-01 | My Work journey + Screen 21 | Full screen definition: purpose, user journey, wiring, state behaviour |
| A-02 | Invitation Acceptance screen | Full screen definition: purpose, user journey, wiring, state behaviour |
| A-03 | Expanded five-state matrix | State matrix expanded to full five states (not just three) |
| A-04 | Assignment/Invitation Management in state matrix | These interactions explicitly covered in the state matrix |
| A-05 | Expanded wiring table | Wiring table covers all declared screens including A-01/A-02 |
| A-06 | Route-to-wiring traceability table | New table mapping every declared route to its wiring entry |
| A-07 | FRS/RLS wording fix | "RLS" corrected to "FRS" (or explicit clarification) where misused |
| A-08 | Vercel wording softened | Vercel deployment wording treated as assumption/candidate, not hard requirement |
| A-09 | API names marked as candidates | API endpoint names marked as candidate names subject to TRS confirmation |
| A-10 | AIMC endpoint prerequisite rebalanced | AIMC endpoint described as external dependency prerequisite, not internal Stage 2 deliverable |
| A-11 | Stage 3 prerequisites formally deferred | Stage 3 prerequisites explicitly listed as deferred to FRS wave |
| A-12 | Stage 2 Gate Status section added | New section declaring current Stage 2 gate status, open items, and readiness signal |

---

### Step 0.2e — FFA (Functional-Behaviour-Anti-Regression) Check

**NBR patterns from FUNCTIONAL-BEHAVIOUR-REGISTRY.md**: NOT APPLICABLE.
This wave contains no code, no Supabase mutations, no TanStack Query hooks, no Zustand stores,
no React components. All NBR entries (NBR-001 through current) are scoped to BUILD/code PRs.

---

### Step 0.2f — Scope Blockers

The following conditions must be satisfied before IAA handover assurance can be invoked:

| # | Blocker | Resolution Required |
|---|---------|-------------------|
| SB-01 | `wave-current-tasks.md` shows prior wave (pit-stage1-cs2-approval-stage2-initiation) | Must be updated to reflect the new wave `pit-stage2-ux-wiring-upgrade-20260506` before handover |
| SB-02 | All 12 additions (A-01 through A-12) must be present in v0.2-draft | IAA will verify each at handover. Any missing addition = REJECTION-PACKAGE |
| SB-03 | Version header in `ux-workflow-wiring-spec.md` must read `v0.2-draft` | Status Header must be updated |
| SB-04 | `BUILD_PROGRESS_TRACKER.md` must show Stage 2 at updated state | Must reflect this wave's contribution to Stage 2 advancement |
| SB-05 | Upgrade checklist evidence artifact must be committed | `.agent-admin/evidence/stage2-upgrade-checklist/pit-stage2-20260506.md` must exist and record each addition as verified |
| SB-06 | PREHANDOVER proof must be prepared per A-029 pattern | `iaa_audit_token` pre-populated with expected reference; proof read-only post-commit |

---

### Step 0.3 — Wave Record Registration

**Wave Record Path**: `.agent-admin/assurance/iaa-wave-record-pit-stage2-ux-wiring-upgrade-20260506.md`
**Sections initialised**: `## PRE-BRIEF` (this section), `## TOKEN` (pending), `## REJECTION_HISTORY` (pending)
**Standalone pre-brief file**: PROHIBITED per NO-STANDALONE-PREBRIEF-001 — pre-brief is embedded in this wave record only.
**Ceremony Admin Appointed**: NO — to be determined by Foreman prior to handover.

---

### Pre-Brief Summary Output

```
Qualifying tasks: T-1 (spec upgrade v0.1→v0.2, 12 additions), T-2 (tracker update),
                  T-3 (governance evidence artifacts: checklist, scope declaration,
                  PR manifest, wave-current-tasks.md update)

Applicable overlay: PRE_BUILD_STAGE_MODEL — PRE_BUILD_GATES (OVL-PBG-001–OVL-PBG-017)
                    + stage-readiness view (OVL-INJ-ADM-003)

Anti-regression obligations: NO — documentation-only wave; no code changes;
                              NBR-001 through NBR-00x not applicable.
```

---

## TOKEN

> **TO BE POPULATED BY IAA AT HANDOVER ASSURANCE**
> PREHANDOVER proof is read-only post-commit — IAA appends token HERE (wave record only).
> No standalone token file will be created. Authority: NO-STANDALONE-TOKEN-001.

```
PHASE_B_BLOCKING_TOKEN: PENDING (to be updated at handover)
Token reference format: IAA-session-NNN-pit-stage2-ux-wiring-upgrade-20260506-PASS
```

---

## REJECTION_HISTORY

> No rejections recorded at pre-brief stage. Section reserved for handover assurance use.
> Any REJECTION-PACKAGE findings will be appended here with: date, finding summary, fix required.
