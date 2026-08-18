# IAA Wave Record — issue-2025-fix-organisation-context-mixed-document — 2026-08-18

**PR:** #2026 (draft) — https://github.com/APGI-cmy/maturion-isms/pull/2026
**Governing issue:** #2025 — Fix organisation-context mixed-document ingestion and repeatable supplementary uploads
**Branch:** apgi-cmy-issue-2025-fix-organisation-context-mixed-document-b10067
**Base branch:** main
**CS2 authority:** Johan Ras (@APGI-cmy), per issue #2025 ("CS2-authorized UAT remediation")
**Invoked by:** foreman-v2-agent
**IAA session action:** PRE-BRIEF (Phase 0 only — no builder appointed yet, no implementation exists)

---

## PRE-BRIEF

```yaml
IAA_PREFLIGHT_BRIEF:
  schema_version: "1.0.0"
  wave: "issue-2025-fix-organisation-context-mixed-document"
  pr: "2026"
  issue: "2025 - Fix organisation-context mixed-document ingestion and repeatable supplementary uploads"
  branch: "apgi-cmy-issue-2025-fix-organisation-context-mixed-document-b10067"
  qualifying_tasks:
    - task_id: "T-2025-QA-RED"
      summary: "qa-builder: functional QA-to-Red suite covering repeatable optional upload rows (3+, add/remove), all 11 accepted formats incl. JSON MIME-fallback-by-filename, mixed-batch per-file isolation, durable per-file status, bounded/async resource-failure recovery (no Edge Worker exhaustion), exact inline context-save error UX (no browser alerts), RLS/security regression, and existing single-document happy-path regression. Tests must assert functional behavior/output, not source-text or static presence."
      assurance_category: "AAWP_MAT"
    - task_id: "T-2025-UI"
      summary: "ui-builder (after QA-to-Red is red/committed): client UI/state only - repeatable optional row rendering/removal, per-file status display, inline save-error rendering. MUST NOT implement server-side parsing/normalization logic."
      assurance_category: "AAWP_MAT"
    - task_id: "T-2025-API"
      summary: "api-builder and/or document-parser-agent (after QA-to-Red is red/committed): bounded/resource-safe, async-capable ingestion/parsing/normalization changes to mmm-subject-knowledge-reprocess (and shared parsing helpers) so no supported document causes Edge Worker resource-limit exhaustion; durable per-file status persistence backing the UI contract from T-2025-QA-RED. MUST NOT implement client UI."
      assurance_category: "AAWP_MAT"
  required_build_gates:
    - "QA-to-Red before any builder implementation"
    - "UI/API strict separation (no cross-layer implementation by either builder)"
    - "Delegation-order proof (PR-scoped delegation-orders/pr-2026.json)"
    - "Foreman Quality Professor (QP) PASS"
    - "ECAP admin validation (execution-ceremony-admin-agent Phase 4 bundle)"
    - "Pre-handover lane gate (handover-allowed.json)"
    - "IAA final assurance"
  expected_qa_scope:
    - "Repeatable optional upload rows: 3+ files addable, individually removable, no picker reopen/replace required"
    - "All 11 accepted formats (PDF, DOC, DOCX, TXT, MD, CSV, JSON, PPT, PPTX, XLS, XLSX) including JSON with MIME-fallback-by-filename for at least one format lacking reliable browser MIME detection"
    - "Mixed-batch per-file isolation: one file's failure does not roll back or block other files' successful ingestion"
    - "Durable, actionable per-file processing status/error persistence that survives page refresh"
    - "Recoverable bounded/async resource-failure handling: resource-heavy/complex document scenario proven not to exhaust the Edge Function worker resource limit"
    - "Exact inline context-save error UX: no window.alert/browser alert usage for this flow"
    - "RLS/storage isolation/security regression coverage; no policy relaxation"
    - "Existing single-primary-document happy-path regression coverage"
  high_risk_failure_modes:
    - "Edge Worker resource-limit (WORKER_RESOURCE_LIMIT / HTTP 546) exhaustion recurrence in mmm-subject-knowledge-reprocess or shared parsing helpers"
    - "Regression of existing single-document happy path due to bounded/async redesign"
    - "RLS/storage isolation weakening or introduction of a new public/permissive policy"
    - "UI/API contract mismatch on per-file status shape (parallel builder collision)"
    - "Schema/table change for durable per-file status introduced without QA-to-Red-first and without schema-builder/RLS review"
  required_builder_evidence:
    - "Targeted test output (QA-to-Red RED, then Build-to-Green GREEN) pasted into PREHANDOVER proof"
    - "Build output for affected app(s)"
    - "CWT/cross-wave anti-regression evidence"
    - "RLS policy diff review (no policy relaxation)"
    - "No-browser-alert grep evidence (no window.alert usage in the organisation-context save/upload flow)"
    - "Format-completeness evidence (all 11 formats + MIME-fallback-by-filename proof)"
  required_foreman_qp_checks:
    - "100% green targeted tests"
    - "Zero skip/todo/stub"
    - "Full diff review"
    - "Architecture/scope conformance against scope-declarations/issue-2025.md"
    - "Zero warnings"
  ecap_required: true
  ecap_expected_artifacts:
    - "PREHANDOVER proof bundle for PR #2026"
  final_iaa_focus:
    - "Bounded/async resource-safety proof for the mmm-subject-knowledge-reprocess Edge Function fix (no worker resource-limit exhaustion for any accepted format)"
    - "RLS/security parity (no policy relaxation, storage isolation preserved)"
    - "Inline error UX proof (no browser alerts for organisation-context save/upload failures)"
    - "Delegation-order strict ancestry proof (QA-to-Red before UI/API; UI/API strict separation maintained)"
  result: PREFLIGHT_BRIEF_COMPLETE
```

---

## Anti-regression / recurring-pattern review (FAIL-ONLY-ONCE.md, FUNCTIONAL-BEHAVIOUR-REGISTRY.md)

- Reviewed `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` (rules A-001 through A-044): no open, unresolved breach applicable to this PR at pre-brief stage. No rule specifically pre-registers a "Edge Worker resource exhaustion" or "organisation-context mixed-document" niggle prior to this PR; this pre-brief establishes the anti-regression obligation explicitly in `high_risk_failure_modes` and `expected_qa_scope` above so it is captured going forward.
- Reviewed `.agent-workspace/independent-assurance-agent/knowledge/FUNCTIONAL-BEHAVIOUR-REGISTRY.md`: no existing registry entry matches `WORKER_RESOURCE_LIMIT`, `window.alert`, `organisation-context`, or `mixed-document` ingestion. No registered niggle pattern currently applies as a mandatory check for this PR; this will be re-checked at final assurance (Phase 3.1) once builder implementation exists.
- **Anti-regression obligation:** YES — existing single-primary-document happy path for organisation-context upload must not regress (explicitly captured in `expected_qa_scope` and `high_risk_failure_modes` above, and in the frozen acceptance contract at `.agent-admin/scope-declarations/issue-2025.md`).

## Ceremony-admin appointment status

- `ceremony_admin_appointed`: not present in `.agent-admin/prs/pr-2026/wave-current-tasks.md` at time of this pre-brief. No `execution-ceremony-admin-agent` appointment recorded yet. ECAP is required later (`ecap_required: true` above, per wave-current-tasks.md gate #12) but has not yet been appointed at Phase 0 pre-brief time. This will be re-verified at IAA final assurance (Phase 2.1 / Step 3.3a).

## Qualifying tasks (summary)

3 qualifying tasks classified: `T-2025-QA-RED`, `T-2025-UI`, `T-2025-API` (all category `AAWP_MAT` per `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` — MAT/AAWP deliverable work under governed sequence, ambiguity resolves to mandatory IAA per contract Phase 2.3).

**Status:** PRE-BRIEF only. No ASSURANCE-TOKEN or REJECTION-PACKAGE issued at this stage. No builder appointed. No implementation exists in this PR as of this pre-brief.
