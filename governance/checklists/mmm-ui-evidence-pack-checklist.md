# MMM Live UI Evidence Pack Checklist

**Version**: 1.0.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Type**: Governance Checklist — Tier 1 Enforcement
**Effective Date**: 2026-04-30
**Canon ref**: `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md`
**Applies To**: All MMM waves where the PREHANDOVER proof claims L2 (Deployment Commissioned) or L3 (Operationally Closed) completion, or uses any of the prohibited completion phrases
**Owner**: CS2 (@APGI-cmy) (evidence provision) / Foreman QP (per-PR verification) / IAA (final-audit verification)
**Issue**: maturion-isms#1523

---

## Instructions

This checklist MUST be completed before any MMM PREHANDOVER proof claiming L2 or L3 completion is committed. Complete every section in order. Mark each item `[x]` when confirmed, or `[N/A]` with a documented justification when genuinely not applicable. Any `[ ]` (incomplete) item renders the PREHANDOVER proof non-compliant.

**Prohibited completion phrases** (any of these in a PREHANDOVER proof triggers this checklist):
- `handover ready`
- `operationally closed`
- `L2 complete`
- `L3 complete`
- `deployment commissioned`
- `operational-complete`

---

## Section 1: Pre-Pack Checklist — Deployment Accessibility

Confirm the MMM deployment is accessible before gathering any evidence. All items in this section MUST be confirmed before the LUIEP template is filled.

| # | Check | Status | Evidence / Notes |
|---|-------|--------|-----------------|
| 1.1 | MMM deployment URL is known and accessible via HTTPS | `[ ]` | URL: |
| 1.2 | Deployment is the live platform (not local dev server, not Storybook, not CI preview only) | `[ ]` | Confirmed by: |
| 1.3 | The deployment URL resolves in a browser without connection errors | `[ ]` | Verified by: CS2 (@APGI-cmy) |
| 1.4 | Supabase project is connected and responding (backend is live, not just frontend) | `[ ]` | |
| 1.5 | CS2 (@APGI-cmy) is available to provide live evidence and sign-off | `[ ]` | |

**Pre-pack status**: `[ ]` READY TO GATHER EVIDENCE / `[ ]` BLOCKED — reason:

---

## Section 2: Evidence Pack Fields (Rule U-001 through U-005)

One row per LUIEP field. Each field MUST be populated in the committed LUIEP artifact before the PREHANDOVER proof is submitted for QP evaluation.

| # | Field | Evidence Type | Required Value (L2) | Required Value (L3) | Populated? | Value |
|---|-------|---------------|---------------------|---------------------|------------|-------|
| 2.1 | `deployment_url` | LIVE_RUNTIME | Live HTTPS URL | Live HTTPS URL | `[ ]` | |
| 2.2 | `deployment_url_confirmed` | LIVE_RUNTIME | `YES` | `YES` | `[ ]` | |
| 2.3 | `ui_renders_correctly` | LIVE_RUNTIME | `YES` | `YES` | `[ ]` | |
| 2.4 | `auth_flow_confirmed` | LIVE_RUNTIME | `YES` | `YES` | `[ ]` | |
| 2.5 | `e2e_workflow_confirmed` | LIVE_E2E | `PENDING` (permitted) | `YES` (REQUIRED) | `[ ]` | |
| 2.6 | `e2e_workflow_description` | LIVE_E2E | Description or "PENDING" | Workflow description | `[ ]` | |
| 2.7 | `screenshots_provided` | LIVE_RUNTIME | `YES` | `YES` | `[ ]` | |
| 2.8 | `cs2_sign_off` | LIVE_RUNTIME | Date `YYYY-MM-DD` | Date `YYYY-MM-DD` | `[ ]` | |
| 2.9 | `evidence_pack_version` | CONFIG | Semver (e.g. `1.0.0`) | Semver | `[ ]` | |
| 2.10 | `evidence_pack_date` | CONFIG | `YYYY-MM-DD` | `YYYY-MM-DD` | `[ ]` | |

**Evidence type key**: `LIVE_RUNTIME` — requires direct browser/HTTP interaction with live platform; `LIVE_E2E` — requires complete user journey on live platform; `CONFIG` — administrative metadata.

> ⚠️ **Evidence Type Fidelity (A-041)**: No LIVE_RUNTIME or LIVE_E2E field MAY be satisfied by a merged-PR reference, CI test output, static code review, or local development server screenshot. Only live deployed platform evidence satisfies these fields.

> ⚠️ **Temporal Integrity (A-040)**: All fields for items not yet confirmed MUST use `PENDING`. Do NOT pre-populate `YES` or a date for items not yet verified on the live platform.

**Evidence fields populated**: `[ ]` ALL POPULATED / `[ ]` INCOMPLETE — list incomplete fields:

---

## Section 3: CS2 Sign-Off Requirements (Rule U-002)

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 3.1 | CS2 (@APGI-cmy) has personally verified the deployment URL in a live browser | `[ ]` | |
| 3.2 | CS2 has confirmed the UI renders without errors on the live platform | `[ ]` | |
| 3.3 | CS2 has confirmed the authentication flow (login/signup) functions on the live platform | `[ ]` | |
| 3.4 | CS2 has confirmed at least one end-to-end workflow on the live platform (for L3 claims) | `[ ]` / `[N/A — L2 only]` | Workflow: |
| 3.5 | CS2 sign-off date has been entered in `cs2_sign_off` field (format: `YYYY-MM-DD`) | `[ ]` | Date: |
| 3.6 | `cs2_sign_off: PENDING` is NOT present in the committed LUIEP (if PREHANDOVER proof claims L2/L3) | `[ ]` | |

> ⚠️ **CS2 Authority (Rule U-002)**: CS2 (@APGI-cmy) is the **sole authority** to confirm live UI evidence. No builder agent, Foreman, or IAA agent may substitute their own confirmation for CS2 sign-off.

**CS2 sign-off status**: `[ ]` CONFIRMED (date entered) / `[ ]` PENDING — do NOT claim L2/L3 until confirmed

---

## Section 4: CI Gate Verification

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 4.1 | LUIEP artifact committed to branch at the expected path referenced in PREHANDOVER proof | `[ ]` | Path: |
| 4.2 | `.github/scripts/validate-mmm-ui-evidence-pack.sh` run locally — result: PASS | `[ ]` | Output: |
| 4.3 | CI gate `preflight/mmm-ui-evidence-pack-gate` passes (or expected to pass based on local run) | `[ ]` | CI run: |
| 4.4 | No prohibited completion phrase in PREHANDOVER proof without corresponding LUIEP | `[ ]` | |
| 4.5 | LUIEP artifact version and date populated correctly | `[ ]` | Version: |

**CI gate status**: `[ ]` PASS / `[ ]` FAIL — reason:

---

## Section 5: Final Sign-Off

| Check | Status |
|-------|--------|
| All Section 1–4 items marked `[x]` or `[N/A]` with justification | `[ ]` |
| No items left blank or marked `[ ]` (incomplete) | `[ ]` |
| LUIEP artifact committed to branch before PREHANDOVER proof submission | `[ ]` |
| Checklist completion committed to branch before IAA invocation | `[ ]` |
| Foreman QP sign-off: | `[ ]` APPROVED / `[ ]` REFERRED (QP-FAIL-010) |
| IAA verification: | `[ ]` PASS / `[ ]` REJECTION-PACKAGE |

---

**Authority**: `governance/canon/MMM_UI_EVIDENCE_PACK_GATE.md` v1.0.0
**Living Agent System**: v6.2.0
**Version**: 1.0.0
**Effective Date**: 2026-04-30
**FAIL-ONLY-ONCE cross-ref**: A-043
**Template**: `modules/MMM/12-phase4-ecap/mmm-ui-evidence-pack-template.md`
