# IAA Pre-Brief Binding — PR #2040 / Issue #2039

PR: #2040
WAVE_TASKS_PATH: .agent-admin/prs/pr-2040/wave-current-tasks.md

```yaml
pr_number: 2040
issue: 2039
branch: "copilot/isms-migration-recovery-bootstrap"
current_head_sha: "CURRENT_HEAD"
scope_declaration: ".agent-admin/scope-declarations/pr-2040.md"
manifest: ".admin/prs/pr-2040.json"
active_state: ".agent-admin/prs/pr-2040/active-state.json"
builder_handback: ".agent-admin/evidence/pr-2040-builder-handback.md"
status: "PREBRIEF_BOUND — FINAL ASSURANCE NOT AUTHORIZED"
```

## Assurance boundary

This pre-brief binds assurance resolution to PR #2040 / Issue #2039 and excludes the
non-active Issue #2016 / PR #2017 identity. The accepted seven-line migration remains
unchanged. Final independent assurance is not requested or issued by this record.

## Frozen acceptance questions

1. Is there exactly one ordered source bootstrap before
   `20260530000002_mmm_security_advisor_hardening.sql`?
2. Does it preserve the required primary key, timestamp default, and RLS-only security contract?
3. Are the focused test, affected regression, and administration/identity validations green on
   the frozen current head?
4. Has a clean isolated replay been separately demonstrated after Foreman acceptance?
