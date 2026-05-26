# MMM QA-to-Red Addendum — DMC Subject Knowledge

- **Module**: MMM
- **Stage**: 6 QA-to-Red Addendum
- **Date**: 2026-05-25
- **Status**: RED definition artifact

## Test Catalog (DMC)

### T-MMM-DMC-001 — DMC Route Exists as Protected Navigation Target
- **Source**: FRS addendum (top navigation behavior), TR addendum route contract
- **Layer**: Unit/static
- **RED Condition**: `/dmc` route missing in `App.tsx`; Upload tab still points directly to framework upload page.
- **GREEN Acceptance**: `App.tsx` contains protected `/dmc` route; nav links point to `/dmc`.

### T-MMM-DMC-002 — Framework Upload Flow Remains Intact
- **Source**: FRS addendum (no workflow regression)
- **Layer**: Unit/static
- **RED Condition**: `/frameworks/upload` route removed or repurposed.
- **GREEN Acceptance**: `/frameworks/upload` remains registered; framework CTA still routes there.

### T-MMM-DMC-003 — Subject Knowledge Surface Rendered in DMC
- **Source**: FRS addendum (DMC purpose)
- **Layer**: Unit/static
- **RED Condition**: DMC page missing or generic placeholder with no subject-knowledge context.
- **GREEN Acceptance**: DMC page contains explicit Subject Knowledge upload and inventory behavior.

### T-MMM-DMC-004 — Inventory Reads Legacy/AIMC-Compatible Sources
- **Source**: TR addendum data contract
- **Layer**: Unit/static
- **RED Condition**: DMC reads only local mocks or unrelated tables.
- **GREEN Acceptance**: DMC attempts `list-all-documents` and falls back to `ai_documents`; filters `context_level = 'global'`.

### T-MMM-DMC-005 — Upload Pipeline Persists and Triggers Processing
- **Source**: TR addendum upload + processing contracts
- **Layer**: Unit/static
- **RED Condition**: Upload does not create `ai_documents` metadata record or never triggers ingestion.
- **GREEN Acceptance**: DMC writes `ai_documents`, records `ai_upload_audit`, invokes `process-ai-document`.

### T-MMM-DMC-006 — Superuser Boundary Enforced for Subject Knowledge Writes
- **Source**: FRS/TR addendum role boundary
- **Layer**: Unit/static
- **RED Condition**: Any authenticated role can upload/archive/reprocess subject knowledge.
- **GREEN Acceptance**: DMC contains explicit superuser role guard and denial messaging for non-superuser roles.

## Execution Mapping

- Test file:
  - `modules/MMM/tests/B4-framework/dmc-subject-knowledge-routing.test.ts`
