# PR #2026 Wave Current Tasks

PR: #2026
WAVE: issue-2025-fix-organisation-context-mixed-document
GOVERNING_ISSUE: #2025
BASE_BRANCH: main
BRANCH: apgi-cmy-issue-2025-fix-organisation-context-mixed-document-b10067
STATUS: DRAFT_PR_OPEN — SCOPE_DECLARED — IAA_PREBRIEF_PENDING
CS2_AUTHORITY: Johan Ras (@APGI-cmy), per issue #2025 ("CS2-authorized UAT remediation")

## Production fault (authoritative)

`mmm-subject-knowledge-reprocess` Edge Function returns HTTP 546 `WORKER_RESOURCE_LIMIT` after
~125.6 seconds during document reprocessing. This is a resource/time-exhaustion fault in the
ingestion/parsing path, not a metadata/context-save fault. The generic browser alert
`Edge Function returned a non-2xx status code` observed in production is a downstream symptom.

## Qualifying tasks (explicit, frozen)

1. `T-2025-QA-RED` — qa-builder: functional QA-to-Red suite covering:
   - repeatable optional upload rows (reveal-next-row-on-select; remove selected row; 3+ files)
   - all 11 accepted formats (PDF, DOC, DOCX, TXT, MD, CSV, JSON, PPT, PPTX, XLS, XLSX) incl.
     MIME-fallback-by-filename for at least one format lacking reliable browser MIME detection
   - mixed-batch per-file isolation (one file's failure does not roll back others)
   - durable actionable per-file status persistence (survives refresh)
   - recoverable bounded/async resource-failure handling (no Edge Worker exhaustion)
   - exact inline context-save error UX (assert no `window.alert`/browser alert usage)
   - RLS/storage isolation/security regression coverage
   - existing single-primary-document happy-path regression coverage
   Tests must assert functional behavior/output, not source-text or static presence.

2. `T-2025-UI` — ui-builder (after QA-to-Red is red/committed): client UI/state only —
   repeatable optional row rendering/removal, per-file status display, inline save-error
   rendering. MUST NOT implement server-side parsing/normalization logic.

3. `T-2025-API` — api-builder and/or document-parser-agent (after QA-to-Red is red/committed):
   bounded/resource-safe, async-capable ingestion/parsing/normalization changes to
   `mmm-subject-knowledge-reprocess` (and any shared parsing helpers) so no supported document
   causes Edge Worker resource-limit exhaustion; durable per-file status persistence backing the
   UI contract from task 1. MUST NOT implement client UI.

## Architecture decision / acceptance contract

See `.agent-admin/scope-declarations/issue-2025.md` for the full frozen scope, architecture
decision note, acceptance contract, risks, and evidence requirements. That document is
authoritative and must not be contradicted by builder-level task briefs.

## Appointment / gate requirements

1. [x] Fresh clean-worktree branch cut from current main.
2. [x] Scope declaration committed: `.agent-admin/scope-declarations/issue-2025.md`.
3. [x] Foreman session memory committed: `.agent-workspace/foreman-v2/memory/session-issue-2025-fix-organisation-context-mixed-document-20260818.md`.
4. [x] PR #2026 opened (draft) from current main.
5. [x] Canonical IAA PRE-BRIEF committed inside `.agent-admin/assurance/iaa-wave-record-issue-2025-20260818.md` (no standalone prebrief file), bound to PR #2026 and issue #2025. Commit `51385abb25808e717df751a4a925a32e78da6170`.
6. [x] qa-builder appointed (issue #2027) via appointment commit `65a9eb91504acaf7977f74606d4167650393f53b`; QA-to-Red committed (RED) at `1a2fdbd87c57e84f4df38d5e57b9dc165b4c7dc5` — 7 RED / 2 GREEN (regression guards), independently reproduced by Foreman.
7. [x] PR-scoped delegation-order evidence committed: `.agent-admin/control/delegation-orders/pr-2026.json` (prebrief -> appointment -> first-implementation strict ancestor chain verified).
8. [x] ui-builder appointed (issue #2028) via appointment commit `f54f848ac8b427a4fcabb156ee74b26d84c9cd6b`; UI implementation committed at `70d102ef1833dda3a09755a8fb5c6f058d3dbcc9` (client-only, no server/schema files touched) — 9/9 tests GREEN, independently reproduced by Foreman.
9. [ ] api-builder and/or document-parser-agent appointed with a linked GitHub issue; bounded ingestion implementation committed (server-only).
10. [ ] Foreman Quality Professor review — PASS (full diff, 100% green targeted tests, zero skip/todo/stub, architecture/scope conformant).
11. [ ] Targeted tests, app build, CWT/cross-wave anti-regression, compatibility/security/compliance evidence collected and pasted into PREHANDOVER proof.
12. [ ] execution-ceremony-admin-agent Phase 4 admin bundle (PREHANDOVER proof) — administrative only.
13. [ ] `/prepare-handover` triggered; refreshed current-head `PRE_HANDOVER_CHECKPOINT_RESULT` obtained.
14. [ ] IAA final assurance invoked on this PR's current head.
15. [ ] Handover to CS2 for review/merge decision only — no autonomous merge.

## Risks (see scope declaration for full detail)

- Bounded/async redesign of `mmm-subject-knowledge-reprocess` regressing the existing
  single-document happy path.
- Possible need for a new durable per-file status column/table (schema-builder review required
  if triggered; QA-to-Red-first still applies).
- UI/API builder contract collision on per-file status shape — mitigated by QA-to-Red defining
  the contract first.

## CWT / cross-wave / compatibility / security / compliance requirements

- CWT/cross-wave anti-regression suite must be run and green at current PR head before handover.
- Compatibility: existing organisation-context behavior for already-supported single-document
  upload must not regress.
- Security: RLS and storage isolation policies must not be weakened; no new public/permissive
  policy introduced. Any policy diff must be reviewed and cited in PREHANDOVER evidence.
- Compliance: no removal of audit-log/status visibility (per FAIL-ONLY-ONCE S-027
  WRITE-EVIDENCE-EARLY-INVARIANT) — durable per-file status must be written before/independent of
  optional downstream processing succeeding.

## Phase-4 / IAA requirements

- ECAP administrative bundle required (implementation PR) — admin-only, cannot substitute for
  Foreman QP PASS or IAA final assurance.
- Pre-handover lane gate (`handover-allowed.json`) required before any handover/completion
  language, per Wave 2 overlay.
- IAA final assurance token required in the wave record before CS2 handover claim.
- No handover, completion, ready-for-review, or merge-readiness language until all of the above
  are true and evidenced at current PR head.

No production code, schema, migration, or CI-behaviour change is authorised or present in this
PR until the above IAA pre-brief and builder appointment evidence exist.
