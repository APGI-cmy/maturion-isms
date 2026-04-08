# IAA Pre-Brief — Normalize maturion-isms Directory Structure

**Pre-Brief ID**: IAA-PREBRIEF-normalize-directory-structure-20260408  
**Wave**: normalize-maturion-isms-directory-structure  
**Branch**: copilot/normalize-maturion-isms-directory-structure  
**Issue**: maturion-isms#1285  
**IAA Session**: Phase 0 — Pre-Brief Mode  
**Date**: 2026-04-08  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Phase**: PRE-BRIEF ONLY — Phases 2–4 assurance NOT executed. This artifact is prospective.

---

## 1. Pre-Brief Invocation Confirmation

This Pre-Brief was generated in response to an explicit `[IAA PRE-BRIEF REQUEST]` comment
on wave `normalize-maturion-isms-directory-structure`. IAA is operating in Phase 0 mode.
Phases 2–4 assurance will NOT be executed during this invocation. Full assurance will be
invoked at PREHANDOVER after the wave's deliverables are committed.

---

## 2. Wave Summary

| Field | Value |
|-------|-------|
| Wave Name | normalize-maturion-isms-directory-structure |
| Branch | copilot/normalize-maturion-isms-directory-structure |
| Issue | maturion-isms#1285 |
| Wave Type | Repo-structure alignment / lifecycle-normalization |
| Production Code Changes | None declared |
| Agent Contract Changes | None declared |
| CI Workflow Changes | None declared |
| Primary Artifact Type | modules/*/BUILD_PROGRESS_TRACKER.md, modules/*/[stage-folder] renames, stage artifact creation |

---

## 3. Qualifying Task Classification

### Step 0.3 — Trigger Analysis

| Trigger Category | Triggered? | Justification |
|-----------------|-----------|---------------|
| AGENT_CONTRACT | NO | No `.github/agents/` or governance/agents/ changes declared |
| CANON_GOVERNANCE | NO | No `governance/canon/` changes declared |
| CI_WORKFLOW | NO | No `.github/workflows/` changes declared |
| AAWP_MAT | NO | Not labelled aawp-deliverable or mat-deliverable; no MAT/AAWP production path |
| AGENT_INTEGRITY | NO | No `governance/quality/agent-integrity/` changes |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` changes declared |
| **PRE_BUILD_STAGE_MODEL** | **YES — MANDATORY** | Wave directly modifies `modules/*/BUILD_PROGRESS_TRACKER.md`; renames all numbered lifecycle stage folders (01-frs→02-frs, 02-architecture→04-architecture, etc.) across 9+ modules; creates Stage 1 (00-app-description) artifacts for retrofit modules; creates Stage 2 (01-ux-workflow-wiring-spec) placeholder locations. Trigger table §7: "any file that defines or advances a module's pre-build lifecycle stage" — this wave is wholesale lifecycle-stage directory surgery. |
| EXEMPT | NO | Not doc-only in governance sense; touches BUILD_PROGRESS_TRACKER.md files and lifecycle stage folder structures that are explicitly named in the PRE_BUILD_STAGE_MODEL trigger condition |
| AMBIGUITY | NO | Classification is unambiguous: PRE_BUILD_STAGE_MODEL |

**IAA Triggered**: YES  
**Primary Category**: `PRE_BUILD_STAGE_MODEL`  
**Applicable Overlay**: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-016)  
**Ambiguity Check**: CLEAR — category unambiguous

---

## 4. Modules In Scope

| Module | Path | Classification | Wave Role |
|--------|------|----------------|-----------|
| amc | modules/amc/ | ACTIVE — FRESH START | Create canonical placeholder folders (01-ux-workflow-wiring-spec/, etc.); update BUILD_PROGRESS_TRACKER.md paths |
| incident-intelligence | modules/incident-intelligence/ | ACTIVE — FRESH START | Rename 01-frs→02-frs, 02-architecture→04-architecture, 03-implementation-plan→07-implementation-plan, 04-builder-appointment→10-builder-appointment, 05-build-evidence→11-build, 90-legacy-assets→_legacy/; create placeholder folders; update tracker |
| xdetect | modules/xdetect/ | ACTIVE — FRESH START | Same rename + create + tracker pattern |
| isms | modules/isms/ | ACTIVE — RETROFIT NOW | Same rename + create + tracker; CREATE app-description.md (Stage 1 artifact missing) |
| pit | modules/pit/ | ACTIVE — RETROFIT NOW | Same rename + create + tracker; CREATE app-description.md; MIGRATE 10-governance-notes, 20-ai to _legacy/ |
| course-crafter | modules/course-crafter/ | ACTIVE — RETROFIT NOW | Same rename + create + tracker; CREATE app-description.md; MIGRATE 10-governance-notes to _legacy/ |
| risk-management | modules/risk-management/ | ACTIVE — RETROFIT NOW | Same rename + create + tracker; CREATE app-description.md |
| MMM | modules/MMM/ | ACTIVE — RETROFIT NOW | Same rename + create + tracker |
| ai-centre | packages/ai-centre/ | ACTIVE — RETROFIT NOW | **SCOPE CLARIFICATION REQUIRED — see §8** |
| mat | modules/mat/ | CLOSED | Minimal touch only — see §8 |
| maturity-roadmap | modules/maturity-roadmap/ | CLOSED | Minimal touch only — see §8 |

---

## 5. Current vs. Canonical Directory Structure

### Folder Rename Map (applies to all ACTIVE modules with legacy structure)

| Legacy Folder | Canonical Folder | Stage | Notes |
|--------------|----------------|-------|-------|
| `00-app-description/` | `00-app-description/` | 1 | No rename — already canonical |
| *(missing)* | `01-ux-workflow-wiring-spec/` | 2 | New placeholder to create |
| `01-frs/` | `02-frs/` | 3 | Rename required |
| *(missing)* | `03-trs/` | 4 | New placeholder to create |
| `02-architecture/` | `04-architecture/` | 5 | Rename required |
| *(missing)* | `05-qa-to-red/` | 6 | New placeholder to create |
| *(missing)* | `06-pbfag/` | 7 | New placeholder to create |
| `03-implementation-plan/` | `07-implementation-plan/` | 8 | Rename required |
| *(missing)* | `08-builder-checklist/` | 9 | New placeholder to create |
| *(missing)* | `09-iaa-pre-brief/` | 10 | New placeholder to create |
| `04-builder-appointment/` | `10-builder-appointment/` | 11 | Rename required |
| `05-build-evidence/` | `11-build/` | 12 | Rename required |
| `90-legacy-assets/` | `_legacy/` | N/A | Migrate contents; rename |

### Module-Specific Anomalies

| Module | Anomaly | Action Required |
|--------|---------|----------------|
| isms | `00-app-description/` is empty — no app-description.md | Create app-description.md; Stage 1 currently NOT_STARTED |
| pit | `00-app-description/` empty; extra folders 10-governance-notes, 20-ai present | Create app-description.md; migrate extra folders to _legacy/ |
| course-crafter | `00-app-description/` empty; 10-governance-notes present | Create app-description.md; migrate 10-governance-notes to _legacy/ |
| risk-management | `00-app-description/` empty | Create app-description.md |
| amc | Only has `00-app-description/` — no legacy numbered folders to rename | Create canonical placeholder stubs only |
| MMM | Has legacy numbered folders like others; 01-frs, 02-architecture present | Standard rename + tracker update |
| ai-centre | Lives at packages/ai-centre/ not modules/ai-centre/ — no numbered folders present | See §8 Scope Clarification |

---

## 6. IAA Trigger Categories for This Wave

**Primary**: `PRE_BUILD_STAGE_MODEL`

**Reason**: The wave:
1. Modifies `modules/*/BUILD_PROGRESS_TRACKER.md` for all in-scope modules (explicitly named in trigger condition)
2. Renames all lifecycle stage numbered folders across 9+ modules — these folders ARE the pre-build lifecycle stage structure
3. Creates Stage 1 (app-description.md) artifacts for 4 retrofit-now modules — directly advances lifecycle stages
4. Creates Stage 2 (01-ux-workflow-wiring-spec/) placeholder locations — defines stage locations per canonical model

**Applicable Overlay**: `PRE_BUILD_GATES` — OVL-PBG-001 through OVL-PBG-016

**No secondary triggers** (AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, AAWP_MAT, KNOWLEDGE_GOVERNANCE are all absent per wave declaration).

---

## 7. FFA Checks Required at Handover

The following checks from OVL-PBG-001 through OVL-PBG-016 are applicable to this wave. IAA will execute all 16 PRE_BUILD_GATES checks plus all core invariants at handover.

### High-Priority (structural correctness of the wave's primary deliverable)

| Check | ID | Priority | Rationale |
|-------|----|----------|-----------|
| module.manifest.json slug matches directory | OVL-PBG-001 | HIGH | Wave may update manifests; slug/dir consistency must survive |
| BUILD_PROGRESS_TRACKER module identity consistent | OVL-PBG-002 | HIGH | Every tracker update must maintain identity consistency |
| Stage gating respected — no skipped stages | OVL-PBG-008 | **CRITICAL** | Folder creation ≠ stage completion. No module may show Stage N COMPLETE without all upstream stages complete and properly gated |
| BUILD_PROGRESS_TRACKER uses full 12-stage model | OVL-PBG-006 | HIGH | Already updated in prior wave; must remain correct post-folder-rename path updates |
| Legacy directory numbering advisory | OVL-PBG-009 | HIGH | This wave resolves the advisory by implementing canonical numbering; IAA confirms resolution at handover |
| Stage 2 UX Wiring Spec present for user-facing builds | OVL-PBG-010 | HIGH | Creating 01-ux-workflow-wiring-spec/ placeholder ≠ completing Stage 2 |
| Change-Propagation Audit | OVL-PBG-014 | HIGH | Creating Stage 1 artifacts for modules that already have Stage 5 work triggers downstream propagation audit obligation |

### Standard (to be executed at handover)

| Check | ID | Notes |
|-------|----|-------|
| Architecture doc module name | OVL-PBG-003 | Verify architecture.md references correct module name post-rename |
| IAA Pre-Brief exists before FRS builder delegation | OVL-PBG-004 | N/A for this wave — no FRS builder delegation; verify N/A at handover |
| AGENT_HANDOVER_AUTOMATION version cited | OVL-PBG-005 | N/A unless knowledge files are updated; verify |
| Architecture doc full lifecycle sequence | OVL-PBG-007 | Architecture files untouched per wave declaration; verify unchanged |
| Stage 6 QA-to-Red suite | OVL-PBG-011 | N/A — wave creates placeholder only; no build advance to Stage 6 |
| Stage 7 PBFAG | OVL-PBG-012 | N/A — wave creates placeholder only |
| Stage 9 Builder Checklist | OVL-PBG-013 | N/A — wave creates placeholder only |
| Runtime/Deployment Contract | OVL-PBG-015 | N/A — no first build wave initiated |
| Golden Path Verification Pack | OVL-PBG-016 | N/A — no first build wave initiated |

### Core Invariants (full checklist applies at handover)

All 25 CORE invariant checks apply. Key checks for this wave:

| Check | ID | Why Relevant |
|-------|----|-------------|
| Complete evidence artifact sweep | CORE-018 | PREHANDOVER + session memory must be git-committed, not just on disk (A-033) |
| Scope declaration match | (CORE-026 / A-026) | All renamed/created files must be declared in SCOPE_DECLARATION.md |
| No production code changes | CORE-023 | Workflow-adjacent file check; verify no src/ or tests/ files appear in diff |
| Pre-Brief stage-readiness declaration | CORE-025 | This pre-brief is the document; IAA verifies it is referenced at handover |
| PHASE_B_BLOCKING_TOKEN in token file | CORE-024 | Token file must contain valid PHASE_B_BLOCKING_TOKEN field |

### FAIL-ONLY-ONCE Rules Applied at Handover

| Rule | Application |
|------|------------|
| A-001 | PREHANDOVER proof must reference IAA invocation (not applicable for AGENT_CONTRACT but PREHANDOVER still required) |
| A-026 / A-031 | All files in `git diff origin/main...HEAD` must appear in SCOPE_DECLARATION.md, or A-031 carve-out note must be present for IAA ceremony artifacts |
| A-029 | PREHANDOVER iaa_audit_token field: pre-populate with expected token reference `IAA-session-normalize-dir-YYYYMMDD-PASS`; NOT PENDING |
| A-033 | IAA will use `git ls-tree -r HEAD` to verify PREHANDOVER is committed, not just disk presence |

---

## 8. Scope Blockers

> ⚠️ These are hard blockers. If any applies at handover, IAA will issue REJECTION-PACKAGE.

### B-001 — NO IMPLICIT STAGE COMPLETION FROM FOLDER CREATION

**Classification**: Substantive  
**Description**: Creating a folder (e.g., `01-ux-workflow-wiring-spec/`, `03-trs/`) is NOT the same as completing the corresponding lifecycle stage. `BUILD_PROGRESS_TRACKER.md` must NOT show any of the newly-created stub folders' stages as COMPLETE. Only stages with prior documented completion may remain COMPLETE.

**Specific Risk**: If the wave updates BUILD_PROGRESS_TRACKER.md path references and inadvertently changes any `NOT_STARTED` stage to `COMPLETE` or `IN_PROGRESS`, OVL-PBG-008 will fail.

**Expected Correct State Post-Wave**:
- Stage status values must NOT advance beyond their pre-wave baseline (per MODULE_CLASSIFICATION.md v1.1.0)
- Only `Location:` path fields in the tracker should change (old folder path → new canonical folder path)
- No checkbox `[x]` that was `[ ]` pre-wave

**What IAA Will Check**: For each module, compare pre-wave stage status (from MODULE_CLASSIFICATION.md) against post-wave tracker status. Any stage advancing = REJECTION-PACKAGE.

---

### B-002 — CLOSED MODULE PROTECTION (mat, maturity-roadmap)

**Classification**: Substantive  
**Description**: `mat` and `maturity-roadmap` are formally CLOSED per CS2 Direction 2026-04-07 (documented in MODULE_CLASSIFICATION.md v1.1.0). No stage progression, no folder renames, and no structural surgery may occur in these modules.

**Permitted**: Adding a `_legacy/` sub-folder to mirror the canonical structure for archival consistency, IF and only if it involves no content creation and no tracker changes.

**Not Permitted**: Renaming any stage folders in `modules/mat/` or `modules/maturity-roadmap/`; updating their BUILD_PROGRESS_TRACKER.md beyond comments; creating any stage artifacts.

**What IAA Will Check**: `git diff origin/main...HEAD` filtered for `modules/mat/` and `modules/maturity-roadmap/`. Any non-trivial change to these paths = REJECTION-PACKAGE citing CS2 Direction 2026-04-07.

---

### B-003 — `src/`, `tests/`, AND DEPLOYMENT-ADJACENT FILE ISOLATION

**Classification**: Substantive  
**Description**: The wave is declared as "No production code changes." Lifecycle stage folder renames are governance/documentation operations only. No file inside any `src/`, `tests/`, `scripts/`, `supabase/`, `package.json`, `tsconfig.json`, or deployment-adjacent path may appear in the PR diff.

**Affected Modules with src/**: pit, xdetect, mat, risk-management, MMM, ai-centre (packages/ai-centre/)

**What IAA Will Check**: `git diff origin/main...HEAD --name-only | grep -E "src/|tests/|scripts/|supabase/|package\.json|tsconfig"`. Any hit = REJECTION-PACKAGE.

---

### B-004 — `module.manifest.json` PATH CONSISTENCY

**Classification**: Substantive  
**Description**: If `BUILD_PROGRESS_TRACKER.md` `Location:` fields are updated to reflect renamed folder paths, any `modules/X/module.manifest.json` that references stage folder paths must also be updated consistently. Both files must agree on the canonical folder names.

**Modules with module.manifest.json**: amc, pit, xdetect, MMM (confirmed from `ls` output); others to be verified.

**What IAA Will Check**: OVL-PBG-001 and OVL-PBG-002 — manifest slug/dir match and tracker-to-manifest identity consistency for all modules with `module.manifest.json`.

---

### B-005 — CHANGE-PROPAGATION AUDIT FOR STAGE 1 CREATION ON RETROFIT MODULES

**Classification**: Substantive  
**Description**: Creating Stage 1 (app-description.md) for `isms`, `pit`, `course-crafter`, and `risk-management` — which already have Stage 5 (Architecture) work in place — triggers the §7.1 Change-Propagation Audit obligation per OVL-PBG-014.

**Requirement**: The wave must include a Change-Propagation Audit declaration for each RETROFIT NOW module where app-description.md is created. The declaration must confirm that the new Stage 1 content is consistent with the existing Stage 5 (Architecture) work, and that no downstream stage artifacts require amendment due to the new Stage 1 introduction.

**Minimum Acceptable Evidence**: A brief Change-Propagation note in the PREHANDOVER proof, per module, stating: "Stage 1 artifact created; reviewed against Stage 5 architecture content; no downstream amendment required because [reason]."

**What IAA Will Check**: OVL-PBG-014. If no Change-Propagation declaration is present in the PREHANDOVER proof for any retrofit module that receives a new app-description.md = REJECTION-PACKAGE.

---

### B-006 — ai-centre SCOPE LOCATION AMBIGUITY ⚠️ CS2 CLARIFICATION REQUESTED

**Classification**: Substantive (Scope)  
**Description**: The wave description classifies `ai-centre` as "ACTIVE RETROFIT" within scope. However, `ai-centre` does NOT exist at `modules/ai-centre/`. It lives at `packages/ai-centre/`, which is a compiled TypeScript package (has `package.json`, `tsconfig.json`, `src/`, `supabase/` sub-directories).

The `packages/ai-centre/BUILD_PROGRESS_TRACKER.md` already has a 12-stage lifecycle section (updated in wave `align-12stage-prebuild-20260406`). It has NO numbered stage sub-folders — only `build-evidence/` (code-level).

**Decision Required from CS2 before wave proceeds**:
- Option A: Add canonical numbered governance folders (00-app-description/, 01-ux-workflow-wiring-spec/, etc.) to `packages/ai-centre/` as documentation/governance stubs alongside the code. (Messy — mixes governance stubs with package code.)
- Option B: Create `modules/ai-centre/` as a pure governance module folder with the canonical lifecycle structure, separate from `packages/ai-centre/` which remains code-only.
- Option C: Exclude `ai-centre` from this wave's folder normalization scope. The BUILD_PROGRESS_TRACKER.md is already 12-stage compliant.

**IAA Recommendation**: Option C is cleanest for this wave — ai-centre's BUILD_PROGRESS_TRACKER.md is already 12-stage compliant. Folder normalization can be addressed in a dedicated wave if CS2 determines governance stubs are needed in packages/. This avoids mixing governance documentation with compiled package structure.

**Impact if Unresolved**: If the wave proceeds to create folders in `packages/ai-centre/src/` or modifies `packages/ai-centre/package.json` = B-003 violation. If a `modules/ai-centre/` directory is created without CS2 direction = unauthorized structural change.

**What IAA Will Check**: If any `packages/ai-centre/src/` or `packages/ai-centre/supabase/` changes appear in diff = REJECTION-PACKAGE (B-003). If scope for ai-centre is not clarified in SCOPE_DECLARATION.md = advisory finding.

---

### B-007 — BUILD_PROGRESS_TRACKER LOCATION FIELD CONSISTENCY (Tracker Path Mismatch)

**Classification**: Ceremony — but with Substantive enforcement at handover  
**Description**: The `amc` BUILD_PROGRESS_TRACKER.md (updated in wave `align-12stage-prebuild-20260406`) currently shows Stage 2 (UX Workflow & Wiring Spec) at `Location: modules/amc/02-ux-workflow-wiring-spec/`. The canonical folder per this wave's target is `01-ux-workflow-wiring-spec/`. This is a path mismatch that this wave must resolve.

**Evidence of Pre-Existing Mismatch**: amc BUILD_PROGRESS_TRACKER.md Stage 2 Location field (`02-ux-workflow-wiring-spec/`) does not match the wave's canonical model (`01-ux-workflow-wiring-spec/`). This suggests a numbering philosophy difference (0-indexed folders vs. 1-indexed labels) that must be resolved definitively in this wave.

**What IAA Will Check**: For every module and every stage, the `Location:` field in BUILD_PROGRESS_TRACKER.md must exactly match the physical folder that exists on the branch. Zero tolerance for tracker-to-filesystem mismatch.

---

## 9. PREHANDOVER Structure Requirements

The producing agent's PREHANDOVER proof for this wave MUST contain the following sections and evidence:

### Mandatory PREHANDOVER Fields

```yaml
prehandover_proof:
  wave: normalize-maturion-isms-directory-structure
  branch: copilot/normalize-maturion-isms-directory-structure
  issue: "maturion-isms#1285"
  session_id: "session-normalize-dir-YYYYMMDD"
  iaa_prebrief_path: ".agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md"
  iaa_audit_token: "IAA-session-normalize-dir-YYYYMMDD-PASS"  # pre-populated; NOT PENDING
  scope_declaration_path: "SCOPE_DECLARATION.md"
  session_memory_path: ".agent-workspace/[producing-agent]/memory/session-normalize-dir-YYYYMMDD.md"
```

### Required Evidence Sections

#### Section A — Per-Module Structural Evidence Table

For each module in scope (amc, incident-intelligence, xdetect, isms, pit, course-crafter, risk-management, MMM, and ai-centre if in scope):

| Module | Folders Renamed | New Stubs Created | Tracker Paths Updated | App-Description Created | Stage Status Unchanged |
|--------|----------------|------------------|----------------------|------------------------|----------------------|
| [module] | [list old→new] | [list new stubs] | [YES/NO] | [YES/NO/N/A] | [CONFIRMED/DEVIATION] |

#### Section B — Stage Status Baseline Confirmation

Declare pre-wave stage status for each module (sourced from MODULE_CLASSIFICATION.md v1.1.0) and confirm post-wave status is UNCHANGED (except for Stage 1 on retrofit modules where app-description.md is created — which may advance from NOT_STARTED to IN_PROGRESS, NOT to COMPLETE, unless authority approval is documented).

#### Section C — Closed Module Treatment Confirmation

Explicit statement for mat and maturity-roadmap:
> "mat: No structural changes made. [describe exact files touched or 'none']."
> "maturity-roadmap: No structural changes made. [describe exact files touched or 'none']."

#### Section D — No Production Code Attestation

> "No files under src/, tests/, scripts/, supabase/, package.json, tsconfig.json, or vercel.json were modified. Evidence: git diff output showing zero matches for these paths."

#### Section E — Change-Propagation Audit Notes (retrofit modules only)

For each of isms, pit, course-crafter, risk-management where app-description.md was created:
> "[Module]: Stage 1 artifact created at [path]. Reviewed against existing Stage 5 architecture content. Change-propagation assessment: [consistent/inconsistent — describe briefly]."

#### Section F — module.manifest.json Consistency Confirmation

For each module with module.manifest.json: confirm `module_slug` matches directory name and BUILD_PROGRESS_TRACKER.md module identity fields are consistent.

#### Section G — ai-centre Scope Resolution

State which Option (A/B/C from §8 B-006) was selected, with CS2 authorisation reference OR state that ai-centre was excluded from scope per IAA recommendation.

#### Section H — A-031 Carve-Out (if applicable)

If IAA ceremony artifacts from a prior rejection session appear in `git diff origin/main...HEAD`, include the A-031 carve-out note:
> "IAA ceremony artifacts from session-NNN rejection committed on branch (IAA session memory, IAA rejection token, IAA parking station update) excluded from declaration per A-031 carve-out."

---

## 10. Stage-Readiness View (Pre-Wave Baseline per OVL-INJ-ADM-003 / CORE-025)

This section declares the current stage-readiness status for all in-scope modules BEFORE the wave executes. This is the baseline IAA will compare against at handover assurance.

### ACTIVE — FRESH START Modules

| Module | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5+ |
|--------|---------|---------|---------|---------|---------|
| amc | ✅ COMPLETE | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED |
| incident-intelligence | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED |
| xdetect | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED | NOT_STARTED |

> Source: MODULE_CLASSIFICATION.md v1.1.0. amc Stage 1 COMPLETE confirmed (app-description.md exists).
> incident-intelligence and xdetect: Stage 1 folder exists but content status not confirmed.

### ACTIVE — RETROFIT NOW Modules

| Module | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|--------|---------|---------|---------|---------|---------|
| isms | NOT_STARTED (empty folder) | NOT_STARTED | NOT_STARTED | NOT_STARTED | IN_PROGRESS |
| pit | NOT_STARTED (empty folder) | NOT_STARTED | NOT_STARTED | NOT_STARTED | IN_PROGRESS |
| course-crafter | NOT_STARTED (empty folder) | NOT_STARTED | NOT_STARTED | NOT_STARTED | IN_PROGRESS |
| risk-management | NOT_STARTED (empty folder) | NOT_STARTED | NOT_STARTED | NOT_STARTED | IN_PROGRESS |
| MMM | COMPLETE | NOT_STARTED | NOT_STARTED | NOT_STARTED | IN_PROGRESS |
| ai-centre | COMPLETE (retrospective) | COMPLETE (retrospective) | COMPLETE (retrospective) | COMPLETE (retrospective) | COMPLETE |

> Source: MODULE_CLASSIFICATION.md v1.1.0 and BUILD_PROGRESS_TRACKER.md review.

### Blockers Preventing Stage 11 (Builder Appointment) for ANY Module

All ACTIVE modules — all blockers. No module may proceed to Builder Appointment because:
1. Stage 1 (App Description) is missing for isms, pit, course-crafter, risk-management
2. Stage 2 (UX Workflow & Wiring Spec) is NOT_STARTED for all modules
3. Stages 3–10 are NOT_STARTED for all modules (except ai-centre which is retrospective)

This wave resolves only the STRUCTURAL PRECONDITION (folder organization). Stage content must be produced in subsequent waves before any module may advance past Stage 1.

### Acceptance Conditions for Handover Assurance

IAA will issue ASSURANCE-TOKEN at handover only if ALL of the following are met:

1. **AC-001**: Every in-scope module's numbered stage folders match the canonical model exactly (00-app-description through 11-build, plus _legacy/)
2. **AC-002**: Every `BUILD_PROGRESS_TRACKER.md` `Location:` field matches the physical folder that exists on the branch for the corresponding stage
3. **AC-003**: No stage status (COMPLETE/IN_PROGRESS/NOT_STARTED) has advanced beyond the pre-wave baseline in §10, except where explicitly authorized (Stage 1 may advance to IN_PROGRESS for retrofit modules that receive app-description.md)
4. **AC-004**: No `src/`, `tests/`, `scripts/`, `supabase/`, `package.json`, `tsconfig.json` files appear in the PR diff
5. **AC-005**: mat and maturity-roadmap show zero structural changes (or only explicitly-declared minimal touch)
6. **AC-006**: Change-Propagation Audit declarations are present for all retrofit modules where app-description.md was created
7. **AC-007**: PREHANDOVER proof is git-committed (verified via `git ls-tree`), contains non-PENDING `iaa_audit_token`, and all ceremony artifacts are declared in SCOPE_DECLARATION.md
8. **AC-008**: ai-centre scope decision is documented (Option A/B/C with CS2 authorisation, or explicit exclusion)
9. **AC-009**: module.manifest.json files are consistent with BUILD_PROGRESS_TRACKER.md identity fields for all modules that have manifests
10. **AC-010**: OVL-PBG-009 legacy numbering advisory is resolved — all active modules now use canonical 00-11 numbering

---

## 11. Anti-Regression Obligations (Step 0.3b)

### Known Recurring Failure Patterns from Prior Sessions

| Pattern | Sessions | Rule | Anti-Regression Obligation |
|---------|---------|------|---------------------------|
| PREHANDOVER untracked on disk but not in git | Session CI-gateway-fix-20260312 | A-033 | IAA will use `git ls-tree -r HEAD` to verify PREHANDOVER commitment. Disk existence alone is not sufficient. |
| iaa_audit_token: PENDING in PREHANDOVER | Multiple prior sessions (pre-A-029) | A-029 | PREHANDOVER must pre-populate iaa_audit_token with expected token reference; PENDING = FAIL |
| Scope mismatch (IAA ceremony artifacts in diff, not declared) | Sessions 142, 146, 148, 149, 150 | A-031 | If IAA rejection artifacts appear on branch, producer must add A-031 carve-out note in SCOPE_DECLARATION.md |
| Stage completion advancing without gate evidence | Novel for this wave type | OVL-PBG-008 | Folder renaming is STRUCTURAL only — tracker stage statuses must not advance beyond pre-wave baseline |

### Anti-Regression Obligations for This Wave

1. **A-033 Mandatory**: IAA WILL run `git ls-tree -r HEAD | grep PREHANDOVER` at handover. No exceptions.
2. **A-029 Mandatory**: PREHANDOVER `iaa_audit_token` must be pre-populated with `IAA-session-normalize-dir-YYYYMMDD-PASS`. PENDING = immediate CORE-018(c) FAIL.
3. **OVL-PBG-008 Novel Enforcement**: This is the first structure-normalization wave of this type. IAA will be especially vigilant for tracker stage status drift during what is a large multi-module filesystem operation.
4. **B-001 Novel Enforcement**: The scale of this wave (9+ modules, 70+ folder operations) creates high risk of a mis-applied completion status. Per-module stage status comparison is mandatory at handover.

### No Recurring Pattern Applicable to: AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, AAWP_MAT — not triggered by this wave.

---

## 12. Required Evidence Artifacts at Handover

The following artifacts MUST be committed on the branch before IAA is invoked for Phase 2–4 assurance:

| Artifact | Path Pattern | Required? | Notes |
|----------|-------------|----------|-------|
| PREHANDOVER Proof | `PREHANDOVER_PROOF_[wave].md` or root-level | MANDATORY | Must be git-committed; must contain all §9 sections |
| Session Memory | `.agent-workspace/[agent]/memory/session-normalize-dir-YYYYMMDD.md` | MANDATORY | Must be git-committed |
| SCOPE_DECLARATION.md | `SCOPE_DECLARATION.md` | MANDATORY | Must list ALL files changed; A-031 note if IAA ceremony artifacts present |
| This Pre-Brief | `.agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md` | MANDATORY (present ✅) | Already committed |
| Module structural evidence | Per-module folder listing confirmation | MANDATORY | Included in PREHANDOVER §A evidence table |
| Change-Propagation declarations | Inline in PREHANDOVER §E | MANDATORY for retrofit modules | isms, pit, course-crafter, risk-management |

---

## 13. Pre-Brief Completion Confirmation

| Step | Status |
|------|--------|
| 0.1 Pre-Brief invocation confirmed | ✅ |
| 0.2 wave-current-tasks.md read | ✅ |
| 0.3 Qualifying task classification | ✅ PRE_BUILD_STAGE_MODEL — MANDATORY |
| 0.3b Anti-regression obligations declared | ✅ |
| 0.4 Pre-Brief artifact generated | ✅ This document |
| 0.5 Commit and confirm | Pending git commit below |
| 0.6 Reply to triggering comment | Pending |

---

*Pre-Brief generated by independent-assurance-agent (Phase 0 mode)*  
*Wave: normalize-maturion-isms-directory-structure | 2026-04-08*  
*Authority: CS2 (Johan Ras / @APGI-cmy)*  
*IAA Contract v6.2.0 | Adoption Phase: PHASE_B_BLOCKING*
