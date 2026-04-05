# Wave Current Tasks — foreman-v2-agent

## Active Wave: aimc-wave-status

wave: aimc-wave-status
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-aimc-wave-status.md

### Wave Description
Outstanding AIMC/LKIAC Wave Status Confirmation & MMM/MAT/Roadmap Sequencing Risk Analysis.
Produce a complete status matrix of all 17 AIMC/LKIAC waves (CL-0 through CL-15 incl. CL-3.5),
identify sequencing risks for MMM/MAT/Roadmap integration, and produce actionable recommendations
for CS2 per Issue #1209.

CS2 Authorization: GitHub issue #1209 "[Wave Status & Dependency Check] Confirm outstanding
AIMC/LKIAC waves, resolve MMM/MAT/Roadmap sequencing risk" opened by CS2 (@APGI-cmy) and
assigned to foreman-v2-agent (Copilot).

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| AIMC-STATUS-001 | AIMC/LKIAC Wave Status Matrix (17 waves) | .agent-workspace/foreman-v2/personal/AIMC_LKIAC_WAVE_STATUS_MATRIX_20260403.md | DELIVERED |
| AIMC-STATUS-002 | MMM/MAT/Roadmap sequencing risks (embedded in matrix §4) | see above | DELIVERED |
| AIMC-STATUS-003 | Top actionable recommendations for CS2 (matrix §5) | see above | DELIVERED |

### Acceptance Criteria (per IAA Pre-Brief PLAN-FFA checks)

- PLAN-FFA-001: All 17 waves covered
- PLAN-FFA-002: Status classifications accurate vs. CEP §14
- PLAN-FFA-003: All non-COMPLETE waves have outstanding items documented
- PLAN-FFA-004: MMM/MAT/Roadmap sequencing risks documented with severity
- PLAN-FFA-005: Legacy code conflicts for MMM identified
- PLAN-FFA-006: Minimum 3 actionable recommendations produced
- PLAN-FFA-007: No unauthorised scope expansion
- PLAN-FFA-008: No placeholder content

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-aimc-wave-status.md)
- Delegation: COMPLETE (foreman self-produced — planning/analysis wave)
- Wave status matrix: DELIVERED
- IAA Token: PASS (.agent-admin/assurance/iaa-token-session-aimc-wave-status-20260403.md)

### Updated
2026-04-04

---

## Previous Wave (archived): mmm-gov-gaps

wave: mmm-gov-gaps
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-mmm-gov-gaps.md

### Wave Description
Governance Compliance Gaps in MMM App Description: Alignment and Specificity Required.
Close 15 governance compliance gaps in `modules/MMM/00-app-description/MMM_app_description.md`
across Priority 1 (pre-approval showstoppers), Priority 2 (FRS/TRS derivation), and
Priority 3 (consistency/audit) per the issue specification. Documentation-only wave.

CS2 Authorization: GitHub issue "Governance Compliance Gaps in MMM App Description:
Alignment and Specificity Required" opened by CS2 (@APGI-cmy) and assigned to foreman.

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| MMM-GOV-001 | MMM_app_description.md governance gap remediations (P1+P2+P3) | modules/MMM/00-app-description/MMM_app_description.md | DELIVERED / IAA PASS |

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-mmm-gov-gaps.md, SHA 1bc07c8)
- IAA Token (R4): PASS (.agent-admin/assurance/iaa-token-session-mmm-gov-gaps-20260403-R4.md)
- PR: copilot/fix-governance-compliance-gaps — MERGED (#1214)

### Updated
2026-04-04

---

## Previous Wave (archived): DCKIS-CL11

wave: cep-v1.8.0-programme-clearance-20260403
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cep-v1.8.0-programme-clearance-20260403.md

### Wave Description
Programme Clearance — CEP v1.8.0, CP Gate Closures, CL-3.5 Schema, MAT Wave 13 Start.

Combined Foreman orchestration session with 5 parallel workstreams. CS2 authorization: issue
"[Foreman Session] Programme clearance — CEP v1.8.0, CP closures, CL-3.5 schema, MAT Wave 13 start"
opened by CS2 (@APGI-cmy) on 2026-04-03 and assigned to foreman-v2-agent.

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| D-1 | CEP Amendment v1.8.0: CP closures + CL-12c re-scope + §14 update | governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md | PENDING |
| D-2 | AAWP CEP version reference update to v1.8.0 | governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md | PENDING |
| D-3 | DEP-008 status update: PARALLEL-RUN — SCHEMA DELIVERED | governance/aimc/LKIAC_DEPRECATION_REGISTER.md | PENDING |
| D-4 | CP-2 closure artifact | .agent-admin/checkpoints/cp-2-closure-20260403.md | PENDING |
| D-5 | MAT Wave 13 orchestration: qa-builder RED gate delegation, mat-specialist + ui-builder commission | wave-current-tasks.md (Wave 13 section) | PENDING |
| D-6 | CL-6 wave-start issue template | .agent-admin/templates/cl6-wave-start-issue-20260403.md | PENDING |

### Constraints
- Foreman does NOT write production code, schemas, migrations, or tests (NO-IMPLEMENT-001)
- Governance documentation updates only for D-1, D-2, D-3, D-4
- MAT Wave 13 (D-5): delegate RED gate to qa-builder, builders to mat-specialist + ui-builder
- Architecture for Wave 13 is FROZEN (no new features — wiring fixes only)
- IAA Pre-Brief artifact must exist before any report_progress call (A-031)

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-cep-v1.8.0-programme-clearance-20260403.md — SHA 516f404)
- Delegation: IN_PROGRESS

### Updated
2026-04-03T12:43:42Z

---

## Previous Wave (archived): DCKIS-IMPL-002

wave: DCKIS-IMPL-002
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-dckis-impl-002.md

### Wave Description
Pipeline 2 Implementation — MAT Frontend UI for Knowledge Ingestion Interface.
Delivers all UI components and supporting backend artefacts to turn all 12 T-KU-xxx RED gate tests GREEN.

CS2 Authorization: Issue "[ui-builder] DCKIS-IMPL-002: MAT Frontend Components — Knowledge Ingestion Interface" opened by CS2 and assigned to ui-builder.

Scope Expansion (IAA Blocker A resolved): CS2 direct issue opening constitutes authorization to carry DCKIS-IMPL-001 artefacts (useKnowledgeDocuments.ts + process-document-v2) into this wave because IMPL-001 is not yet merged.

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| IMPL-002-D1 | KnowledgeUploadPanel.tsx | modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx | PENDING |
| IMPL-002-D2 | DocumentChunkTester.tsx | modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx | PENDING |
| IMPL-002-D3 | KnowledgeDocumentsList.tsx | modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx | PENDING |
| IMPL-002-D4 | MAT routing + nav | App.tsx + Layout.tsx | PENDING |
| IMPL-002-D5 | Domain selector | Inline in KnowledgeUploadPanel.tsx | PENDING |
| IMPL-001-D5 (carried) | useKnowledgeDocuments.ts | modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts | PENDING |
| IMPL-001-D1 (carried) | process-document-v2 | packages/ai-centre/supabase/functions/process-document-v2/index.ts | PENDING |

### Test Gate

| Test | Status |
|------|--------|
| T-KU-001 KnowledgeUploadPanel exists | PENDING |
| T-KU-002 DocumentChunkTester size=2000 overlap=200 | PENDING |
| T-KU-003 Domain-to-source mapping in hook | PENDING |
| T-KU-004 chunk metadata columns (schema-builder) | GREEN ✅ |
| T-KU-005 INSERT RLS WITH CHECK (schema-builder) | GREEN ✅ |
| T-KU-006 KnowledgeDocumentsList approval_status badge | PENDING |
| T-KU-007 process-document-v2 chunked_from_tester | PENDING |
| T-KU-008 process-document-v2 Pipeline 1 isolation | PENDING |
| T-KU-009 useKnowledgeDocuments file extension validation | PENDING |
| T-KU-010 useKnowledgeDocuments retry + dedup | PENDING |
| T-KU-011 process-document-v2 chunk size=2000 overlap=200 | PENDING |
| T-KU-012 process-document-v2 embedding 1536-dim | PENDING |

### Constraints
- ADR-005: MUST NOT touch Pipeline 1 files (CriteriaUpload.tsx, CriteriaManagementPage.tsx, useCriteria.ts, invoke-ai-parse-criteria)
- QueryClientProvider: provided in main.tsx only (do NOT add another in App.tsx or pages)

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-dckis-impl-002.md)
- Delegation: IN_PROGRESS → ui-builder

### Updated
2026-03-20T07:46:00Z
**Session ID**: session-markdown-rewrite-remediation-20260320
**Wave Slug**: markdown-rewrite-remediation
**Issue**: #1184 — Remediation List for the Markdown Rewrite
**Branch**: copilot/remediation-list-markdown-rewrite
**Date**: 2026-03-20
**Status**: IN PROGRESS

---

## IAA Pre-Brief

```yaml
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-markdown-rewrite-remediation-20260320.md
iaa_prebrief_status: COMMITTED (SHA: c545f24)
```

---

## Wave Objective

Revise `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md` to be more comprehensive and source-faithful to the original Word document, while preserving the existing document's strong structure, clean hierarchy, and readable product-spec style.

---

## Tasks

| ID | Task | Agent | Status |
|----|------|-------|--------|
| T-MRR-001 | Revise ROADMAP_APP_DESCRIPTION_v3.0.md per 10-item remediation list from Issue #1184 | mat-specialist | PENDING |

---

## Task Details

### T-MRR-001 — Revise ROADMAP_APP_DESCRIPTION_v3.0.md

**Agent**: mat-specialist
**File to modify**: `modules/maturity-roadmap/00-app-description/ROADMAP_APP_DESCRIPTION_v3.0.md`
**Source reference**: `modules/maturity-roadmap/00-app-description/Lucara_Diamond_Control_Standard_V4.md` (per IAA pre-brief advisory)

**Priority 1 (Must Fix):**
1. Separate source-derived requirements from inferred enhancements (label inferred content as "Inferred Design Recommendation", "Suggested Enhancement", or "Implementation Proposal")
2. Preserve source ambiguity — "implementation users" vs "build users", "other organisations" phrasing, open conceptual areas
3. Strengthen "continuous live score" concept in Purpose/Overview, Audit Configuration/Scoring Logic, Dashboard, AI, Evidence sections
4. Expand evidence governance section substantially with: upload/connect/classification, acceptance/query/rejection/escalation, override/not-relevant handling, budget/skills constraints, freshness/staleness, re-evaluation, traceability, document vs live evidence, human override logging
5. Strengthen dashboard's company-wide visibility/wow-factor — live display, broad visibility, achievement celebration, company screens

**Priority 2 (Should Fix):**
6. Clarify post-subscription structure note (source has 2 main aspects; Markdown restructures as 3 parts — add acknowledgement note)
7. Clarify free assessment boundary (mainly MPS level, criteria/evidence after subscription, prompt if not done, baseline locked)
8. Preserve open conceptual notes from source in dedicated section ("Open Design Notes from Source" or similar)

**Priority 3 (Nice to Improve):**
9. Reduce over-formalization (label/remove architecture language beyond the Word file)
10. Add "Source Fidelity Notes" appendix

**IAA Pre-Brief acceptance bar**:
- CORE-007: No placeholder content (STUB/TODO/FIXME/TBD)
- DOC-FFA-001: Only ROADMAP_APP_DESCRIPTION_v3.0.md in diff
- DOC-FFA-002: All 5 Priority 1 items visibly addressed
- DOC-FFA-003: Priority 2 items 6–8 addressed
- DOC-FFA-004: Priority 3 items 9–10 (advisory only)
- DOC-FFA-005: Source fidelity — no over-specification beyond source
- DOC-FFA-006: Version header accurate
- DOC-FFA-007: No new stub sections
- PREHANDOVER proof committed before IAA invocation
- Session memory committed before IAA invocation

---

## Exit Criteria

- [ ] T-MRR-001 delivered and QP PASS
- [ ] PREHANDOVER proof written
- [ ] Session memory written  
- [ ] IAA invoked and ASSURANCE-TOKEN received
- [ ] Token ceremony complete
