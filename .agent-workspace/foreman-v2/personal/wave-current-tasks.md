# Wave Current Tasks — CL-7: LKIAC-L3 PersonaLoader Improvements

## Active Wave: cl-10-routing-governance-ci-enforcement

wave: cl-10-routing-governance-ci-enforcement
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-20260405.md

### Wave Description
CL-10 — LKIAC-L4: Routing Governance CI Enforcement.
Machine-enforce GRS-016 (no direct AI provider imports in module code) at the CI merge gate level.
Implement stub detection CI check. Resolves GOV-001, GOV-002, FAIL-ONLY-ONCE S-002.

CS2 Authorization: maturion-isms#1221 (2026-04-05) — Item 5: 'CL-7 & CL-10 wave-starts go PARALLEL with CL-6'

### Deliverables

| ID | Artefact | Agent | Status |
|----|---------|-------|--------|
| CL-10-D1 | RED gate test: CI check integration test — test that `import { OpenAI }` in module code fails the gate | qa-builder | ✅ DONE (SHA 501779e, 9/9 GREEN) |
| CL-10-D2 | CI merge gate check: detect direct provider import patterns in `modules/` and `apps/` (excl. `maturion-maturity-legacy`) — fails PR on match | integration-builder | ✅ DONE (SHA 43c2d99, workflow_dispatch added f3eb777) |
| CL-10-D3 | CI merge gate check: detect `expect(true).toBe(true)` stub patterns anywhere in test suite — fails PR on match | integration-builder | ✅ DONE (SHA 43c2d99, workflow_dispatch added f3eb777) |

### Sequencing
- **D1 first** (qa-builder delivers RED gate test BEFORE CI implementation begins)
- **D2+D3 second** (integration-builder delivers CI workflows AFTER D1 is confirmed FAILING)

### Acceptance Criteria
- CL-10-D1 RED before implementation (CI check integration test failing)
- CL-10-D2: CI check active — `import { OpenAI }` in modules/ fails PR
- CL-10-D3: CI check active — stub pattern `expect(true).toBe(true)` fails PR
- Both checks tested GREEN on current codebase (zero violations detected)
- T-B-001 and T-C-010 audit requirements covered by automated enforcement
- Zero linter/deprecation warnings

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-20260405.md, SHA f9db5ab)
- D1 (qa-builder RED gate): ✅ DONE (SHA 501779e)
- D2+D3 (integration-builder CI workflows): ✅ DONE (SHA 43c2d99 + f3eb777)
- Ceremony artifacts: ✅ COMMITTED (SHA f3eb777)
- IAA R1: REJECTION-PACKAGE (SHA 01d530e) — ceremony not committed, OVL-CI-005 absent
- IAA R2: ASSURANCE-TOKEN PASS (SHA df0216c) — IAA-session-cl10-routing-governance-20260405-R2-PASS
- Merge gate: RELEASED — awaiting CS2 review (@APGI-cmy)

### Updated
2026-04-05

---

## Previous Wave (archived): mmm-mat-harvest-20260405

wave: mmm-mat-harvest-20260405
iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-mmm-mat-harvest-20260405.md

### Wave Description
CS2 Directive: MMM/MAT/Roadmap Harvest — One-Issue Execution/Attestation & Permission, with
Governance/Agent Boundaries. Orchestration wave covering 6 action items:
1. Record MMM builds with AI stubs (wiring deferred to CL-12c)
2. Commission CL-11-D3/D4 audit (qa-builder; GAP-008, GAP-009; new issue)
3. Post CL-6 wave-start issue from template
4. Record MAT Wave 13 terminal harvest verdict; MAT closes post-migration
5. Post CL-7 & CL-10 wave-start issues (parallel with CL-6)
6. Record Roadmap decommission plan (no CL-12d; survives as migration anchor only)

CS2 Authorization: GitHub issue "CS2 Directive: MMM/MAT/Roadmap Harvest — One-Issue
Execution/Attestation & Permission, with Governance/Agent Boundaries" opened by CS2 (@APGI-cmy)
and assigned to foreman-v2-agent (Copilot). CS2 attestation 2026-04-05.

### Deliverables

| ID | Artefact | Path | Status |
|----|---------|------|--------|
| D-1 | New GitHub issue: CL-11-D3/D4 audit (qa-builder; GAP-008 & GAP-009) | maturion-isms#1224 | ✅ DONE |
| D-2 | New GitHub issue: CL-6 wave-start (from template) | maturion-isms#1225 | ✅ DONE |
| D-3 | New GitHub issue: CL-7 wave-start (PersonaLoader improvements) | maturion-isms#1226 | ✅ DONE |
| D-4 | New GitHub issue: CL-10 wave-start (Routing Governance CI Enforcement) | maturion-isms#1227 | ✅ DONE |
| D-5 | Governance recording: items 1+4+6 (MAT terminal verdict, MMM AI stubs recorded, Roadmap plan) | governance-liaison-isms-agent — IAA PASS (IAA-session-054-mmm-mat-harvest-20260405-PASS) | ✅ DONE |
| D-6 | Session memory | .agent-workspace/foreman-v2/memory/session-mmm-mat-harvest-20260405.md | ✅ DONE |
| D-7 | PREHANDOVER proof | .agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-mat-harvest-20260405.md | ✅ DONE |

### Acceptance Criteria
- All 4 GitHub issues created with correct content and agent assignments
- governance-liaison-isms-agent delegation artifact produced for T3 recordings
- Session memory and PREHANDOVER proof committed
- IAA ASSURANCE-TOKEN received

### Status
- IAA Pre-Brief: COMMITTED (.agent-admin/assurance/iaa-prebrief-mmm-mat-harvest-20260405.md, SHA 011af75)
- D-1 through D-4 GitHub issues: CREATED (#1224, #1225, #1226, #1227)
- D-5 governance recordings: DELIVERED (governance-liaison IAA PASS — IAA-session-054-mmm-mat-harvest-20260405-PASS)
- D-6 session memory: DELIVERED (.agent-workspace/foreman-v2/memory/session-mmm-mat-harvest-20260405.md)
- D-7 PREHANDOVER proof: DELIVERED (.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-mat-harvest-20260405.md)
- Foreman IAA token: PASS — IAA-session-mmm-mat-harvest-20260405-PASS (SHA 16c06ce)

### Updated
2026-04-05

---

## Previous Wave (archived): aimc-wave-status

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

Implement runtime YAML front-matter validation in `PersonaLoader.ts` with a typed `PersonaValidationError`. Add CI checks for persona registry sync and quarterly freshness review.

**Resolves**: GAP-002, GAP-003, GOV-003, GOV-004

---

## Task Breakdown

| ID | Deliverable | Assigned To | Status |
|---|---|---|---|
| CL-7-D1 | RED gate test: `PersonaValidationError` thrown on missing/invalid YAML fields | `qa-builder` | GREEN ✅ |
| CL-7-D2 | RED gate test: persona registry sync CI check integration test | `qa-builder` | GREEN ✅ |
| CL-7-D3 | Implementation: `PersonaValidationError` type + runtime YAML validation in `PersonaLoader.ts` | `api-builder` | GREEN ✅ |
| CL-7-D4 | CI check: persona registry sync workflow | `integration-builder` | DELIVERED ✅ |
| CL-7-D5 | Scheduled workflow: quarterly persona review freshness check | `integration-builder` | DELIVERED ✅ |

---

## Governance

iaa_prebrief_path: .agent-admin/assurance/iaa-prebrief-cl7-personaloader-20260405.md
fail_only_once_attested: true
fail_only_once_version: v4.0.0
unresolved_breaches: none

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Foreman**: foreman-v2-agent v6.2.0

