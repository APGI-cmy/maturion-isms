# IAA Wave Record — MMM Stage 6 QA-to-Red

**Wave**: mmm-stage6-qa-to-red-20260415
**Issue**: maturion-isms#1384
**Branch**: copilot/fix-253484265-1108482416-7f518b23-7345-4cfd-a1c8-8403d856d34d
**Date**: 2026-04-15
**Foreman Session**: session-mmm-stage6-qa-to-red-20260415
**Model**: SINGLE-FILE WAVE RECORD (per NO-STANDALONE-PREBRIEF-001)

---

## PRE-BRIEF

**Pre-Brief Invocation Date**: 2026-04-15
**IAA Session**: session-mmm-stage6-qa-to-red-prebrief-20260415
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Ceremony-Admin Appointed**: NO — not yet declared for this wave (required before Phase 4)
**Foreman Request**: Declare trigger categories, FFA checks, PREHANDOVER structure, scope blockers.
**Wave Context**: MMM Stage 6 QA-to-Red wave. Two scopes:
  - Scope A: BUILD_PROGRESS_TRACKER normalization for Stage 5 approval-readiness — COMPLETE
  - Scope B: Stage 6 QA-to-Red artifact production (delegated to qa-builder) — IN PROGRESS

---

### §1 — Qualifying Tasks

The following tasks in wave-current-tasks.md qualify for IAA oversight at final handover:

| Task ID | Description | IAA Trigger |
|---------|-------------|-------------|
| Scope A — BUILD_PROGRESS_TRACKER.md update | Stage 5 normalization, metadata correction | PRE_BUILD_STAGE_MODEL |
| D1 | Stage 6 artifact directory: modules/MMM/05-qa-to-red/ | PRE_BUILD_STAGE_MODEL |
| D2 | Full RED test suite (qa-to-red-catalog.md) derived from FRS/TRS/Architecture | PRE_BUILD_STAGE_MODEL + AAWP_MAT |
| D3 | Journey coverage: all 17 Stage 2 user journeys → RED test IDs (journey-coverage.md) | PRE_BUILD_STAGE_MODEL + AAWP_MAT |
| D4 | Requirement traceability matrix (requirement-traceability.md) | PRE_BUILD_STAGE_MODEL + AAWP_MAT |
| D5 | QA Catalog alignment confirmation (qa-catalog-alignment.md) | AAWP_MAT |
| D6 | Foreman sign-off package (foreman-signoff-package.md) | PRE_BUILD_STAGE_MODEL + AAWP_MAT |
| D7 | BUILD_PROGRESS_TRACKER.md Stage 6 status update | PRE_BUILD_STAGE_MODEL |
| Governance artifacts | wave-current-tasks.md, scope-declaration, this wave record | PRE_BRIEF_ASSURANCE |

**Total qualifying tasks**: 9 (spanning Scope A, all Scope B deliverables, governance artifacts)

---

### §2 — Applicable Overlays

**Primary category**: `PRE_BUILD_STAGE_MODEL`
— Triggered by: `modules/MMM/BUILD_PROGRESS_TRACKER.md` modification (Scope A) and `modules/MMM/05-qa-to-red/` directory advancement (Scope B). This wave advances the module's pre-build lifecycle to Stage 6.

**Secondary category**: `AAWP_MAT`
— Triggered by: Stage 6 artifacts are MAT module deliverables (qa-to-red-catalog.md, journey-coverage.md, requirement-traceability.md, qa-catalog-alignment.md, foreman-signoff-package.md) produced under a CS2-authorized MAT wave.

**Tertiary overlay**: `PRE_BRIEF_ASSURANCE`
— Triggered by: IAA wave record and scope declaration are governance wave artifacts; pre-brief existence is enforced by OVL-INJ-001.

**AMBIGUITY RULE**: N/A — Classification is unambiguous. PRE_BUILD_STAGE_MODEL is dominant.

**Overlays to apply at final IAA audit**:
1. **PRE_BUILD_GATES** — OVL-PBG-001 through OVL-PBG-016, plus OVL-PBG-ADM-001
2. **PRE_BRIEF_ASSURANCE** — OVL-INJ-001, OVL-INJ-ADM-001, OVL-INJ-ADM-002, OVL-INJ-ADM-003
3. **AAWP_MAT build-deliverable checks** — substance evaluation of QA-to-Red artifact completeness, journey coverage, traceability depth

---

### §3 — Anti-Regression Obligations (FAIL-ONLY-ONCE / NBR Registry)

**NBR-001 through NBR-005 status**: NOT APPLICABLE to this wave.

Rationale: All five registered NBR patterns (TanStack Query cache invalidation, Supabase RLS write blocks, Zustand store leakage, optimistic update rollback, schema migration column mismatch) require executable application code area triggers — `useMutation`, Supabase INSERT/UPDATE/DELETE, Zustand store slices, schema migration files. This wave produces exclusively markdown governance and QA specification documents. No application code is in scope. Pattern matching: zero matches.

**Anti-regression obligations**: NO NBR obligations. ✅

FAIL-ONLY-ONCE rules that DO apply (A-series — process rules, not code rules):

| Rule | Description | Application |
|------|-------------|-------------|
| A-001 | IAA invocation evidence must be in PREHANDOVER | Verify at handover: PREHANDOVER references this pre-brief invocation |
| A-002 | No class-based IAA exemptions | Not applicable — no class exemption claims present |
| A-003 | Ambiguity → mandatory invocation | Applied: classification is unambiguous |
| A-006 | Detect fabricated PHASE_A_ADVISORY tokens | Verify at handover: no self-certified PHASE_A_ADVISORY pattern in PREHANDOVER |
| A-015 | PREHANDOVER ceremony required — no content-type exemption | Enforce at handover: PREHANDOVER proof + session memory must be committed before IAA invocation |
| A-029 | PREHANDOVER proof read-only post-commit; iaa_audit_token pre-populated | Enforce at handover: `iaa_audit_token` must be pre-populated with expected reference (not PENDING) |
| A-033 | PREHANDOVER git-committed verification (not disk-only) | Enforce at handover: use `git ls-tree -r HEAD` to verify PREHANDOVER is committed, not just on disk |

---

### §4 — Stage-Readiness View (OVL-INJ-ADM-003)

**Module**: MMM (Maturity Management Module)
**Wave goal**: Produce Stage 6 QA-to-Red artifacts

| Stage | Name | Status | Evidence Reviewed |
|-------|------|--------|-------------------|
| Stage 1 | App Description | ✅ COMPLETE | CS2 approved #1298 — `modules/MMM/00-app-description/MMM_app_description.md` v0.5.0 confirmed present on branch |
| Stage 2 | UX Workflow & Wiring Spec | ✅ COMPLETE | CS2 approved #1352 — `modules/MMM/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md` v0.1.0 confirmed present on branch |
| Stage 3 | FRS | ✅ COMPLETE | CS2 approved #1366 — `modules/MMM/02-frs/functional-requirements.md` v0.1.0 confirmed present on branch |
| Stage 4 | TRS | ✅ COMPLETE | CS2 approved #1378 — `modules/MMM/03-trs/technical-requirements-specification.md` v0.1.0 confirmed present on branch |
| Stage 5 | Architecture | ⚠️ PRODUCED / PENDING CS2 MERGE | `modules/MMM/04-architecture/architecture.md` committed (wave mmm-stage5-architecture-20260414); IAA ASSURANCE-TOKEN issued (IAA-session-212-mmm-stage5-architecture-20260414-PASS); formal CS2 merge not yet completed. Stage 6 authorized by CS2 (#1384) while Stage 5 merge is pending — this constitutes the CS2-approved OVL-PBG-008 exception. **IAA will verify at handover that either: (a) Stage 5 has been formally merged to main, OR (b) issue #1384 is re-confirmed as the explicit CS2 exception for Stage 6 proceeding before Stage 5 merge.** |
| Stage 6 | QA-to-Red | 🔄 IN PROGRESS — this wave | `modules/MMM/05-qa-to-red/` directory initialized; primary artifacts not yet produced (Scope B pending qa-builder delegation) |
| Stage 7 | PBFAG | ❌ NOT STARTED | — |
| Stage 8 | Implementation Plan | ❌ NOT STARTED | — |
| Stage 9 | Builder Checklist | ❌ NOT STARTED | — |
| Stage 10 | IAA Pre-Brief (builder-level) | ❌ NOT STARTED | — |
| Stage 11 | Builder Appointment | ❌ NOT STARTED | — |
| Stage 12 | Build Execution & Evidence | ❌ NOT STARTED | — |

**Blockers preventing Stage 11 builder appointment (as of this Pre-Brief)**:

1. Stage 5 Architecture: pending formal CS2 merge — CS2 exception via issue #1384 covers Stage 6 parallel work only
2. Stage 6 QA-to-Red: artifacts not yet produced — this wave must complete
3. Stage 7 PBFAG: not yet started
4. Stage 8 Implementation Plan: not yet started
5. Stage 9 Builder Checklist: not yet started
6. Stage 10 IAA Pre-Brief (builder-level): not yet started

**Current wave scope**: Stage 6 only. Stage 7–12 are explicitly out of scope per scope-declaration-wave-mmm-stage6-qa-to-red.md.

---

### §5 — FFA Checks Required at Final IAA Audit

The following checks must be executed and PASS at IAA final audit (handover):

#### 5.1 — FAIL-ONLY-ONCE Process Checks

| Check | Rule | Evidence Required |
|-------|------|-------------------|
| FFA-001 | A-001 — IAA invocation evidence in PREHANDOVER | PREHANDOVER proof references this pre-brief invocation by wave slug |
| FFA-002 | A-006 — No fabricated PHASE_A_ADVISORY | `iaa_audit_token` in PREHANDOVER is NOT bare `PHASE_A_ADVISORY — date` without IAA token file |
| FFA-003 | A-015 — PREHANDOVER ceremony present | PREHANDOVER proof at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage6-qa-to-red-20260415.md` committed before IAA invocation |
| FFA-004 | A-029 — iaa_audit_token pre-populated | `iaa_audit_token` field contains `IAA-session-mmm-stage6-qa-to-red-20260415-PASS` (expected reference format, not PENDING) |
| FFA-005 | A-033 — PREHANDOVER git-committed (not disk-only) | `git ls-tree -r HEAD` confirms PREHANDOVER file is a tracked, committed git object — not untracked on disk only |

#### 5.2 — PRE_BUILD_GATES Overlay Checks (OVL-PBG-001 to OVL-PBG-016)

| Check | ID | Scope for this wave |
|-------|----|---------------------|
| module.manifest.json slug match | OVL-PBG-001 | Verify `module_slug: "MMM"` matches `modules/MMM/` |
| BUILD_PROGRESS_TRACKER identity consistent | OVL-PBG-002 | Verify BPT module name and slug match manifest |
| Architecture doc module name correct | OVL-PBG-003 | Verify architecture.md references "MMM" not legacy name |
| IAA Pre-Brief exists before delegation | OVL-PBG-004 | This wave record IS the pre-brief artifact — verify committed before qa-builder deliverables |
| AGENT_HANDOVER_AUTOMATION version consistent | OVL-PBG-005 | Apply if knowledge files reference AGENT_HANDOVER_AUTOMATION version |
| BPT uses full 12-stage model | OVL-PBG-006 | Verify all 12 stages present in BUILD_PROGRESS_TRACKER.md |
| Architecture doc full lifecycle sequence | OVL-PBG-007 | Verify architecture.md §Canonical Sequence lists all 12 stages |
| Stage gating respected | OVL-PBG-008 | Stages 1–5 documented as COMPLETE (Stage 5 pending merge: CS2 exception via #1384 must be confirmed) |
| Legacy directory numbering | OVL-PBG-009 | Advisory only — flag if 00-/01-/02- numbering conflicts with canonical stage numbers |
| Stage 2 UX Wiring Spec present | OVL-PBG-010 | Confirmed present at Stage 6 — verify at handover |
| Stage 6 QA-to-Red suite exists | OVL-PBG-011 | All 5 primary artifacts present under modules/MMM/05-qa-to-red/ |
| Stage 7 PBFAG | OVL-PBG-012 | NOT applicable this wave — Stage 7 not in scope |
| Stage 9 Builder Checklist | OVL-PBG-013 | NOT applicable this wave — Stage 9 not in scope |
| §7.1 Change-Propagation Audit | OVL-PBG-014 | NOT triggered — no upstream FRS/TRS/Architecture modification in Scope A or B |
| §7.2 Runtime/Deployment Contract | OVL-PBG-015 | NOT applicable — first build wave not beginning this wave |
| §7.3 Golden Path Verification Pack | OVL-PBG-016 | NOT applicable — first build wave not beginning this wave |

#### 5.3 — PRE_BRIEF_ASSURANCE Checks

| Check | ID | Evidence Required |
|-------|----|-------------------|
| Pre-Brief artifact committed before builder delegation | OVL-INJ-001 | `git ls-tree -r HEAD` confirms this wave record committed before any qa-builder deliverable is committed |
| Pre-Brief artifact non-empty | OVL-INJ-ADM-001 | This document contains substantive content (not stub/placeholder) |
| Pre-Brief references correct wave | OVL-INJ-ADM-002 | Wave slug `mmm-stage6-qa-to-red-20260415` matches wave-current-tasks.md |
| Stage-readiness view declared | OVL-INJ-ADM-003 | Present in §4 above ✅ |

#### 5.4 — Scope B Substance Checks (AAWP_MAT / QA-to-Red Completeness)

| Check | Description |
|-------|-------------|
| QA-001 | `qa-to-red-catalog.md` exists, is non-empty, contains RED test cases with unique test IDs (e.g., TC-001 etc.), each traced to at least one FRS FR-ID and/or TRS TR-ID |
| QA-002 | `journey-coverage.md` covers all 17 Stage 2 user journeys — each journey mapped to one or more RED test case IDs. Coverage must be 17/17 (zero gaps) |
| QA-003 | `requirement-traceability.md` contains a traceability matrix covering FRS (FR-001 and beyond), TRS (TR-001 through TR-064), and Architecture constraints — each requirement traced to at least one RED test case |
| QA-004 | `qa-catalog-alignment.md` explicitly confirms alignment between Stage 6 RED test cases and the governing QA Catalog — no unexplained gaps |
| QA-005 | `foreman-signoff-package.md` contains: (a) scope statement, (b) coverage map summary, (c) declared gaps if any with justification, (d) explicit "no-implementation" statement confirming no executable code is introduced |
| QA-006 | No executable application code appears anywhere in `modules/MMM/05-qa-to-red/` — all artifacts are governance/specification documents only. Implementation code in QA-to-Red = immediate REJECTION-PACKAGE |
| QA-007 | BUILD_PROGRESS_TRACKER.md Stage 6 entry updated with status, artifacts list, and wave reference |
| QA-008 | RED test cases are genuinely RED — they are specifications of tests that do not yet have passing implementations. Artifacts must not claim tests are GREEN or currently passing |

---

### §6 — PREHANDOVER Structure Requirements

At handover, the following artifacts must exist, be committed to git, and contain the specified content:

**A. PREHANDOVER Proof**
Path: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-stage6-qa-to-red-20260415.md`

Required sections:
- `iaa_audit_token: IAA-session-mmm-stage6-qa-to-red-20260415-PASS` (per A-029 — pre-populated expected reference at commit time; NOT "PENDING")
- `ceremony_admin_appointed: YES` with appointed agent name
- All Scope A and Scope B artifacts listed with paths
- Stage 6 status confirmed: all 5 primary artifacts present
- BUILD_PROGRESS_TRACKER Stage 6 update confirmed
- Wave record reference: `.agent-admin/assurance/iaa-wave-record-mmm-stage6-qa-to-red-20260415.md`

**B. Session Memory**
Path: `.agent-workspace/foreman-v2/memory/session-mmm-stage6-qa-to-red-20260415.md`
Must be committed before IAA final audit invocation.

**C. IAA Wave Record Token Section**
Path: `.agent-admin/assurance/iaa-wave-record-mmm-stage6-qa-to-red-20260415.md` (this file)
IAA will append token to `## TOKEN` section post-verdict. PREHANDOVER proof is read-only once committed — IAA will NOT edit the PREHANDOVER proof.

**D. Ceremony Admin Appointment**
`ceremony_admin_appointed` must be `true` in wave-current-tasks.md before PREHANDOVER is committed.

---

### §7 — Scope Blockers

**Current scope blockers for wave mmm-stage6-qa-to-red-20260415**:

| Blocker | Status | Resolution |
|---------|--------|------------|
| Stage 5 Architecture pending formal CS2 merge | ⚠️ CONDITIONAL | CS2 issue #1384 authorizes Stage 6 parallel work. Foreman MAY delegate to qa-builder. IAA will verify OVL-PBG-008 exception at handover by confirming issue #1384 explicitly authorizes Stage 6 before Stage 5 formal merge. |
| ceremony_admin_appointed not yet declared | ⚠️ REQUIRED BEFORE PHASE 4 | Must be appointed before PREHANDOVER proof is committed. Not a current blocker for Scope B delegation. |

**No hard blockers preventing qa-builder delegation for Scope B.**

Foreman is cleared to proceed with qa-builder delegation.

---

**Pre-Brief Status**: COMPLETE ✅
**IAA Pre-Brief Issued By**: independent-assurance-agent (session-mmm-stage6-qa-to-red-prebrief-20260415)
**Date**: 2026-04-15
**Adoption Phase**: PHASE_B_BLOCKING — all checks at final audit are hard-blocking

---

## TOKEN

**Token Status**: PENDING — to be issued after IAA final audit (Phase 4 Step 4.3b)
**PHASE_B_BLOCKING_TOKEN**: PENDING

---

## REJECTION_HISTORY

*(No rejections recorded — wave in progress)*
