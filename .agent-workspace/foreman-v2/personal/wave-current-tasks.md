# Wave Current Tasks — Issue 1285 (normalize-maturion-isms-directory-structure)

wave: normalize-maturion-isms-directory-structure
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md
branch: copilot/normalize-maturion-isms-directory-structure
date: 2026-04-08
cs2_authorization: Issue #1285 opened and assigned by @APGI-cmy (CS2)

## Active Wave: normalize-maturion-isms-directory-structure

### Wave Description

Normalize all active `modules/*` directory structures in maturion-isms to match
the canonical 12-stage pre-build lifecycle folder numbering pattern.

### Module Classification

| Module | Classification | App Description | Key Action |
|--------|---------------|-----------------|-----------|
| amc | ACTIVE — FRESH START | ✅ EXISTS | Create canonical stage scaffolding (01-11 + _legacy) |
| incident-intelligence | ACTIVE — FRESH START | ✅ EXISTS | Rename: 01-frs→02-frs, 02-arch→04-arch, etc. + scaffold missing |
| xdetect | ACTIVE — FRESH START | ✅ EXISTS | Same as incident-intelligence |
| isms | ACTIVE — RETROFIT NOW | ❌ EMPTY — create stub | Rename folders + create app-description.md retrofit stub |
| pit | ACTIVE — RETROFIT NOW | ❌ EMPTY — create stub | Rename folders + create app-description.md retrofit stub |
| course-crafter | ACTIVE — RETROFIT NOW | ❌ EMPTY — create stub | Rename folders + create app-description.md retrofit stub |
| risk-management | ACTIVE — RETROFIT NOW | ❌ EMPTY — create stub | Rename folders + create app-description.md retrofit stub |
| MMM | ACTIVE — RETROFIT NOW | ✅ EXISTS | Rename folders + preserve existing artifacts |
| mat | CLOSED | N/A | DO NOT TOUCH |
| maturity-roadmap | CLOSED | N/A | DO NOT TOUCH |

### Canonical Folder Renaming Map

| Old Name | New Canonical Name | Notes |
|----------|-------------------|-------|
| 00-app-description/ | 00-app-description/ | No change |
| (missing) | 01-ux-workflow-wiring-spec/ | Create empty scaffold |
| 01-frs/ | 02-frs/ | Rename |
| (missing) | 03-trs/ | Create empty scaffold |
| 02-architecture/ | 04-architecture/ | Rename |
| (missing) | 05-qa-to-red/ | Create empty scaffold |
| (missing) | 06-pbfag/ | Create empty scaffold |
| 03-implementation-plan/ | 07-implementation-plan/ | Rename |
| (missing) | 08-builder-checklist/ | Create empty scaffold |
| (missing) | 09-iaa-pre-brief/ | Create empty scaffold |
| 04-builder-appointment/ | 10-builder-appointment/ | Rename |
| 05-build-evidence/ | 11-build/ | Rename |
| 90-legacy-assets/ | _legacy/ | Rename (merge with existing _legacy if any) |
| 10-governance-notes/ | _legacy/ or 07-governance-notes | Per-module decision: move to _legacy |
| 20-ai/ | _legacy/ | Move to _legacy (non-canonical stage folder) |

### Tasks for governance-liaison-isms-agent

T-NORM-001: Normalize amc module folder structure
T-NORM-002: Normalize incident-intelligence module folder structure
T-NORM-003: Normalize xdetect module folder structure
T-NORM-004: Normalize isms module folder structure + create app-description.md stub
T-NORM-005: Normalize pit module folder structure + create app-description.md stub
T-NORM-006: Normalize course-crafter module folder structure + create app-description.md stub
T-NORM-007: Normalize risk-management module folder structure + create app-description.md stub
T-NORM-008: Normalize MMM module folder structure (preserve existing artifacts)
T-NORM-009: Update all BUILD_PROGRESS_TRACKER.md Location fields to match new folder names
T-NORM-010: Create repo-level summary artifact (modules/NORMALIZATION_SUMMARY.md)

### IAA Pre-Brief Artifact
.agent-admin/assurance/iaa-prebrief-normalize-directory-structure-20260408.md

---

# Previous Wave Tasks — Issue 1277

wave: mmm-39b-frs-derivation-fix
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-wave1277-20260407.md

## Active Wave: mmm-39b-frs-derivation-fix

### Wave Description
Surgical doc-governance fix to modules/MMM/00-app-description/MMM_app_description.md Section 39B.
Add UX Workflow & Wiring Spec as upstream input to FRS in the Requirements Derivation Chain.
Bump version v0.3.0 → v0.4.0.

CS2 Authorization: Issue maturion-isms#1277 opened by @APGI-cmy (CS2 = Johan Ras) and assigned to
foreman-v2-agent (Copilot). Issue author is CS2 (Johan Ras / @APGI-cmy).
Parent Issue: #1266 (MMM build lifecycle reconciliation)

### Tasks
- [x] IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-wave1277-20260407.md
- [x] governance-liaison-isms-agent: update MMM_app_description.md Section 39B —
      change "FRS derives functional requirements from the App Description"
      to "FRS derives functional requirements from the App Description and the UX Workflow & Wiring Spec (Stage 2)";
      bump version v0.3.0 → v0.4.0 with Last Updated 2026-04-07
- [x] IAA REJECTION-PACKAGE: CORE-018(a)(b) — PREHANDOVER/session memory untracked → REMEDIATED
- [x] IAA ASSURANCE-TOKEN: IAA-session-1277-mmm-39b-20260407-r2-PASS
      Token file: .agent-admin/assurance/iaa-token-session-1277-mmm-39b-20260407-r2.md
- [x] WAVE COMPLETE — awaiting CS2 merge (@APGI-cmy)

### IAA Pre-Brief Summary (from iaa-prebrief-wave1277-20260407.md)
- Trigger Category: PRE_BUILD_STAGE_MODEL
- Applicable Overlay: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-009)
- OVL-PBG-006: BUILD_PROGRESS_TRACKER Stage 2 present — PASS
- All 21 checks PASS at final audit
