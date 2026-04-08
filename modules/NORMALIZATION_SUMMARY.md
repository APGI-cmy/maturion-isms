# Module Folder Normalization Summary

**Wave**: normalize-maturion-isms-directory-structure
**Issue**: [maturion-isms#1285](https://github.com/APGI-cmy/maturion-isms/issues/1285)
**Date**: 2026-04-08
**Agent**: governance-liaison-isms-agent (session-058)
**Delegated By**: foreman-v2-agent (session-160)

---

## Canonical 12-Stage Folder Structure

All active modules now conform to:
```
00-app-description/   01-ux-workflow-wiring-spec/   02-frs/   03-trs/
04-architecture/      05-qa-to-red/                 06-pbfag/ 07-implementation-plan/
08-builder-checklist/ 09-iaa-pre-brief/             10-builder-appointment/ 11-build/
_legacy/
```

---

## Per-Module Changes

| Module | Classification | Actions Taken |
|--------|---------------|---------------|
| `amc` | ACTIVE — FRESH START | Created scaffold: 01–11 + _legacy |
| `incident-intelligence` | ACTIVE — FRESH START | Renamed folders + created scaffold |
| `xdetect` | ACTIVE — FRESH START | Renamed folders + created scaffold |
| `isms` | ACTIVE — RETROFIT | Created app-description stub + renamed + scaffold |
| `pit` | ACTIVE — RETROFIT | Created app-description stub + renamed + moved governance-notes/ai to _legacy + scaffold |
| `course-crafter` | ACTIVE — RETROFIT | Created app-description stub + renamed + moved governance-notes to _legacy + scaffold |
| `risk-management` | ACTIVE — RETROFIT | Created app-description stub + renamed + scaffold |
| `MMM` | ACTIVE — RETROFIT | Renamed folders + scaffold (MMM_app_description.md preserved) |
| `mat` | CLOSED | **NOT TOUCHED** (B-002) |
| `maturity-roadmap` | CLOSED | **NOT TOUCHED** (B-002) |
| `packages/ai-centre` | EXCLUDED | Not in modules/ scope; already 12-stage compliant (B-006) |

---

## Folder Rename Mapping Table

| Old Name | New Name | Canonical Stage |
|----------|----------|-----------------|
| `01-frs/` | `02-frs/` | Stage 3: FRS |
| `02-architecture/` | `04-architecture/` | Stage 5: Architecture |
| `03-implementation-plan/` | `07-implementation-plan/` | Stage 8: Implementation Plan |
| `04-builder-appointment/` | `10-builder-appointment/` | Stage 11: Builder Appointment |
| `05-build-evidence/` | `11-build/` | Stage 12: Build Execution |
| `90-legacy-assets/` | `_legacy/` | Legacy assets |
| *(non-canonical)* `10-governance-notes/` | `_legacy/10-governance-notes/` | Moved to legacy (pit, course-crafter) |
| *(non-canonical)* `20-ai/` | `_legacy/20-ai/` | Moved to legacy (pit) |

**New scaffold folders created** (all with `.gitkeep`):
`01-ux-workflow-wiring-spec/`, `03-trs/`, `05-qa-to-red/`, `06-pbfag/`, `08-builder-checklist/`, `09-iaa-pre-brief/`

---

## App Description Retrofit Stubs Created

| Module | File Created | Notes |
|--------|-------------|-------|
| `isms` | `00-app-description/app-description.md` | Stage 1 status: RETROFIT_STUB_CREATED |
| `pit` | `00-app-description/app-description.md` | Stage 1 status: RETROFIT_STUB_CREATED |
| `course-crafter` | `00-app-description/app-description.md` | Stage 1 status: RETROFIT_STUB_CREATED |
| `risk-management` | `00-app-description/app-description.md` | Stage 1 status: RETROFIT_STUB_CREATED |

All retrofit stubs require CS2 (@APGI-cmy) approval before Stage 2 can begin.

---

## Constraint Compliance

| Constraint | Status |
|-----------|--------|
| OVL-PBG-008: No stage completions advanced | ✅ COMPLIANT — scaffold ≠ completion |
| OVL-PBG-002: BUILD_PROGRESS_TRACKER Location fields updated | ✅ COMPLIANT |
| CORE-023: Zero src/tests/scripts/supabase/package.json touched | ✅ COMPLIANT |
| B-002: mat + maturity-roadmap untouched | ✅ COMPLIANT |
| B-004: module.manifest.json reviewed (no path refs to renamed folders) | ✅ COMPLIANT |
| B-006: ai-centre excluded | ✅ COMPLIANT |

---

**Authority**: Foreman delegation (session-160) under CS2 authorization (maturion-isms#1285)
