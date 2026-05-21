# IAA Wave Record — isms-landing-discovery-report — 2026-05-21

**Wave ID**: isms-landing-discovery-report  
**Date**: 2026-05-21  
**PR**: #1728  
**Issue**: #1727 — ISMS Public Landing Harvest Discovery Report  
**Branch**: copilot/create-isms-public-landing-report  
**Producing Agent (expected)**: foreman-v2-agent → mat-specialist (delegated)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

IAA_PREFLIGHT_BRIEF
PR: #1728
ISSUE: #1727 — ISMS Public Landing Harvest Discovery Report
WAVE: isms-landing-discovery-report
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: ee3325c8fd4f4c6f0ac63a6c9e2a9b1e2c3d4e5f

WAVE_TYPE: DOCUMENTATION_DISCOVERY — docs-only diff. All expected changed files are .md (discovery report) and governance admin artifacts (.json, .md). No production code changes. Per iaa-final-assurance-gate.sh, IAA final assurance is N/A for docs-only diffs. IAA classification: EXEMPT (trigger table step 12 — clearly and unambiguously doc-only/admin; no AMBIGUITY RULE applies).

EXPECTED_QA_SCOPE:
- `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md` — PRIMARY DELIVERABLE. New discovery report surveying apps/maturion-maturity-legacy/src and apps/isms-portal/src for public/marketing landing page candidates. Must be committed at this exact path.
- `.admin/prs/pr-1728.json` — PR manifest (admin artifact)
- `.agent-admin/scope-declarations/pr-1728.md` — scope declaration (admin artifact)
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — wave tracker update (personal workspace)
- `.agent-admin/assurance/iaa-wave-record-isms-landing-discovery-20260521.md` — this file (assurance artifact)
- Session memory from producing agent (docs-only PREHANDOVER proof)

EXPECTED_FAILURE_MODES:
- Report committed at wrong path (e.g., root-level, apps/, or docs/ instead of modules/isms/discovery-report/)
- Scope creep: report includes implementation plans, code stubs, or production file changes — would reclassify PR as MIXED → IAA mandatory
- Incomplete source scan: one or both source trees (apps/maturion-maturity-legacy/src OR apps/isms-portal/src) not scanned; report covers only partial discovery
- Missing route inventory: no explicit list of discovered routes/pages with authentication boundary annotation
- Ambiguous auth boundary: report does not clearly mark which pages must remain unauthenticated vs. authenticated
- Report written as narrative summary only — no structured inventory (missing table/list of pages, routes, components, dependencies)
- Session memory or minimal PREHANDOVER proof not present in final PR diff

FOREMAN_INSTRUCTIONS:
- Provide mat-specialist with BOTH source paths explicitly: apps/maturion-maturity-legacy/src AND apps/isms-portal/src
- Require mat-specialist to produce a structured inventory (not just narrative) covering: page/route list, authentication boundary per page, component dependencies, key assets, notes on harvest readiness
- Enforce exact output path: modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md — no deviation
- Reject any mat-specialist delivery that includes non-.md files (*.ts, *.tsx, *.css, etc.) — would reclassify wave as MIXED and trigger IAA final assurance
- Require session memory from mat-specialist (or foreman) and minimal PREHANDOVER proof (docs-only format) before closing wave
- Do NOT appoint execution-ceremony-admin-agent: ECAP_REQUIRED = NO (see below)
- After QP review, commit and push all artifacts in a single clean commit or small commit set

ECAP_REQUIRED: NO
ECAP_EXPECTED_ARTIFACTS: N/A
ECAP_RATIONALE: ceremony_admin_appointed = PENDING in wave-current-tasks.md. This is a documentation-only wave with no production code, no PREHANDOVER bundle requiring reconciliation, and no multi-builder delegation requiring ceremony coordination. Standard docs-only PREHANDOVER proof is sufficient. No ECAP appointment needed.

CURRENT_HEAD_CI_EXPECTATIONS:
- CI gate for docs-only diff: standard format/lint checks applicable to .md files only
- TypeScript compilation gate: N/A — no .ts/.tsx files in diff
- Test suite gate: N/A — no implementation files
- iaa-final-assurance-gate.sh: expected to classify as docs-only → IAA final assurance SKIPPED automatically
- If CI lint/format gate on .md files fails, foreman must fix before merge — this is the only expected CI concern
- No functional delivery claim → PRODUCT_BUILD_ASSURANCE_STANDARD.md not loaded

POLC_AND_BUILDER_DELEGATION_EXPECTATIONS:
- Foreman delegates discovery report creation to mat-specialist (specialist-class agent)
- mat-specialist is the sole builder delegate; no other builder agents required
- No implementation delegation (api-builder, schema-builder, ui-builder, qa-builder) — this is discovery-only
- Foreman must QP-review mat-specialist output before PREHANDOVER
- POLC boundary: mat-specialist scopes and writes only; foreman reviews and commits
- No production code changes in scope; if mat-specialist proposes any, foreman must reject and re-delegate as a separate implementation wave

IAA_WILL_QA:
- IAA final assurance is N/A for this wave (EXEMPT — docs-only diff)
- IAA will NOT issue an ASSURANCE-TOKEN for this wave at final gate unless the diff is reclassified
- RE-CLASSIFICATION TRIGGERS (would convert EXEMPT → MIXED → IAA mandatory):
  - Any .ts, .tsx, .css, .json (non-admin), or other implementation file appearing in the final diff
  - Any .github/agents/ or governance/canon/ file modified
  - Any .agent-workspace/*/knowledge/ file modified
  - Discovery report path deviates to a triggering location
- If re-classification occurs, Foreman MUST re-invoke IAA with action: FULL-ASSURANCE before opening PR for merge
- If wave remains EXEMPT at close: Foreman may merge after CS2 review without IAA final token

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

**Produced by**: independent-assurance-agent  
**Date**: 2026-05-21  
**Action**: PRE-BRIEF  
**Status**: COMPLETE

Qualifying tasks: NONE — no tasks in this wave produce artifacts that trigger IAA under the trigger table. All expected changed files are .md (discovery report) and governance admin artifacts. Wave type DOCUMENTATION_DISCOVERY is unambiguously EXEMPT per trigger table step 12.

Applicable overlay: EXEMPT — no category overlay applies. IAA final assurance is N/A for this wave per iaa-final-assurance-gate.sh. Classification: DOCUMENTATION_DISCOVERY / docs-only.

Anti-regression obligations: NO — FUNCTIONAL-BEHAVIOUR-REGISTRY.md applies to BUILD/AAWP_MAT PRs only. No production code changes in this wave.

ceremony_admin_appointed: PENDING (recorded from wave-current-tasks.md — no ECAP required for docs-only wave)

CURRENT_HEAD_SHA (at pre-brief): ee3325c — branch copilot/create-isms-public-landing-report (1 commit above main: "Initial plan")

PRE-BRIEF PRODUCED BY: independent-assurance-agent | session-iaa-prebrief-isms-landing-discovery-20260521

---

## TOKEN

*(Reserved — IAA final assurance token to be appended here if wave reclassification occurs and IAA is re-invoked. For EXEMPT waves, no token is issued.)*

---

## REJECTION_HISTORY

*(Reserved — no rejections recorded for this wave.)*
