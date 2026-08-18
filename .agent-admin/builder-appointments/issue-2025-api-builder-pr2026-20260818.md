# Builder Appointment — Issue #2025 API/Server Bounded Ingestion Fix (PR #2026)

- issue: 2025
- child_task_issue: 2029
- wave_id: issue-2025-fix-organisation-context-mixed-document
- appointed_builder_agent: api-builder
- appointment_timestamp_utc: 2026-08-18T15:05:00Z
- authority: CS2-authorized UAT remediation (issue #2025, authored by @APGI-cmy, OWNER)
- iaa_prebrief_commit_sha: 51385abb25808e717df751a4a925a32e78da6170
- qa_to_red_commit_sha: 1a2fdbd87c57e84f4df38d5e57b9dc165b4c7dc5
- ui_builder_commit_sha: 70d102ef1833dda3a09755a8fb5c6f058d3dbcc9
- task_ref: T-2025-API (.agent-admin/prs/pr-2026/wave-current-tasks.md)
- task_ref_issue: "#2029"
- task_scope:
  - Server-side only. Redesign supabase/functions/mmm-subject-knowledge-reprocess/index.ts
    (and shared helpers in supabase/functions/_shared/mmm-subject-knowledge.ts) to be
    bounded/resource-safe so no supported document format can exhaust the Edge Function worker
    resource limit (production fault: HTTP 546 WORKER_RESOURCE_LIMIT at ~125.6s).
  - Preserve durable per-file status writes backing the already-implemented client UI contract.
  - Preserve existing single-document happy path and RLS/storage scoping exactly as-is.
- out_of_scope:
  - Any client/UI change (apps/mmm/src/pages/OrganisationContextPage.tsx) unless a genuine
    contract mismatch is found; report to Foreman first if so.
  - Any RLS/storage policy relaxation.
  - Any unrelated file/module/lane (issue #2019 or other in-flight work).
- required_ordering:
  1. IAA pre-brief commit (51385abb25808e717df751a4a925a32e78da6170)
  2. QA-to-Red commit (1a2fdbd87c57e84f4df38d5e57b9dc165b4c7dc5)
  3. ui-builder implementation commit (70d102ef1833dda3a09755a8fb5c6f058d3dbcc9)
  4. Builder appointment commit (this file)
  5. First API implementation commit (must come strictly after this appointment commit)
