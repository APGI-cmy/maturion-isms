# MMM FRS Addendum — DMC Subject Knowledge Wiring

- **Module**: MMM
- **Stage**: 3 (FRS Addendum)
- **Date**: 2026-05-25
- **Status**: ACTIVE
- **Purpose**: Clarify and lock functional behavior for restoring the legacy Document Management Centre into MMM as `DMC`.

## Scope

This addendum extends existing FRS requirements:

- `FR-055` (MMM ↔ KUC boundary)
- `FR-056` (framework-source ingestion)
- `FR-057` (evidence-source ingestion)
- `FR-060`–`FR-062` (roles and permissions)

It does not replace the framework mode flow. `/frameworks/upload` remains the criteria-mode entry from framework-origin decision.

## Functional Clarifications

1. **Top Navigation Behavior**
   - The main authenticated navigation label `Upload` is replaced by `DMC`.
   - `DMC` route target is `/dmc`.

2. **DMC Purpose**
   - `/dmc` is the Subject Knowledge management surface for Maturion AI.
   - It supports uploading and managing global knowledge documents used for MPS, Intent, and Criteria generation quality.

3. **Role Boundary**
   - Subject Knowledge upload/management is restricted to superuser-admin class roles (`ADMIN` or stricter equivalent).
   - Non-superuser roles may be denied write actions and must receive explicit UI feedback.

4. **Legacy Continuity Rule**
   - DMC wiring must use legacy-compatible document contracts (`ai_documents`, `ai_upload_audit`, processing trigger path) to preserve historical knowledge management workflows.

5. **No Workflow Regression**
   - Framework criteria mode generation (Mode A/B/C) remains reachable via `/frameworks/upload` and framework-origin flow.

## QA-to-Red Binding

This addendum is bound to:

- `modules/MMM/05-qa-to-red/dmc-subject-knowledge-qa-to-red.md`
- `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
