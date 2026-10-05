# Foreman Wave Scope Declaration — PR-2058-SECURITY-CORRECTION

SCOPE_SCHEMA_VERSION: v1
wave_identifier: "PR-2058-SECURITY-CORRECTION"
owner: "foreman-v2-agent"
appointed_agent: "execution-ceremony-admin-agent"
appointment_utc: "2026-10-05T06:12:10Z"
reviewed_substantive_head: "1eb903588c0bfc090925cdceb7414fddcccc615b"
current_pr_head_at_appointment: "ef762b8dd30f6ba4121e1830a9911c876d1eaa60"
ceremony_admin_appointed: true
status: "ECAP_APPOINTED_BUNDLE_PENDING"

## Appointment

The narrowed-scope Foreman QP PASS is accepted by CS2, merge-gate parity is PASS, all primary deliverables are committed, and the working tree was clean at appointment. The canonical pre-brief is `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md`, bound to substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b`.

ECAP's assigned work is ceremony administration only: collate the successful narrowed-scope CI and accepted QP evidence into the two exact return artifacts below. ECAP must not modify product files, write `.agent-admin/assurance`, invoke IAA, issue a quality or merge verdict, or claim readiness.

The appointment is current and does not claim to predate the historical implementation. The delegation-order gate remains technically failed under the one-time PR-scoped CS2 exception in comment `5979822573`; no order proof is manufactured. No live Supabase/database deployment occurred.

## Gate inventory checked

```yaml
gate_set_checked:
  current_submitted_head: "7e71a5b6b6877117c21f98e232f643b2364845b1"
  substantive_scope_head: "1eb903588c0bfc090925cdceb7414fddcccc615b"
  grants: PASS
  codeql: PASS
  supabase_preview: PASS
  vercel_preview_comments: PASS
  merge_gate_verdict: PASS
  governance_alignment: PASS
  ecap_admin_boundary: PASS
  iaa_prebrief_contract_alignment: PASS
  foreman_prehandover_lane: PASS
  merge_gate_required_checks_alignment: PASS
  delegation_order:
    result: FAIL
    disposition: "Historical one-time PR-scoped CS2 exception, comment 5979822573; not PASS or waived."
```

## ECAP-001 appointment fields

```yaml
ceremony_admin_appointed: true
wave_identifier: "PR-2058-SECURITY-CORRECTION"
appointment_utc: "2026-10-05T06:12:10Z"
reviewed_substantive_head: "1eb903588c0bfc090925cdceb7414fddcccc615b"
expected_return_artifact_paths:
  - .agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-2058-data-api-grants-20261005.md
  - .agent-workspace/execution-ceremony-admin-agent/bundles/session-pr-2058-data-api-grants-20261005.md
```

## Approved artifact paths

### Committed primary deliverables and active records

- `supabase/migrations/20260729130000_exclusion_cascade_triggers.sql` - replay-safe trigger definitions
- `supabase/migrations/20260923124227_explicit_data_api_grants.sql` - fixed Data API grants and helper hardening
- `supabase/tests/data-api-grants-access.sql` - role access and RLS regression
- `supabase/tests/data-api-grants-coverage.sql` - replayed schema grant coverage
- `supabase/tests/support/grants-bootstrap.sql` - disposable replay fixtures
- `scripts/test-data-api-grants.py` - disposable migration replay and coverage runner
- `.github/workflows/data-api-grants.yml` - Data API grants regression workflow
- `supabase/DATA_API_GRANTS.md` - Data API grants documentation
- `.agent-admin/scope-declarations/pr-2058.md` - PR scope and appointment record
- `.agent-admin/prs/pr-2058/wave-current-tasks.md` - active PR task record
- `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md` - canonical pre-brief and historical rejection record

### Authorized ceremony outputs

- `.agent-workspace/foreman-v2/personal/scope-declaration-wave-pr-2058-data-api-grants-20261005.md` - this Foreman scope declaration
- `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-pr-2058-data-api-grants-20261005.md` - ECAP return artifact, pending
- `.agent-workspace/execution-ceremony-admin-agent/bundles/session-pr-2058-data-api-grants-20261005.md` - ECAP return artifact, pending
- `.agent-admin/prehandover/proof-pr-2058-data-api-grants-20261005.md` - later PR-scoped CI evidence carrier, pending

No other path is authorized by this declaration.
