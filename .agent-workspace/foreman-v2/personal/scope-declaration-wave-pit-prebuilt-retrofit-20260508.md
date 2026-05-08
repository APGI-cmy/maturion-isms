# Scope Declaration — PR #1576
# Wave: pit-prebuilt-retrofit-20260508
# Branch: copilot/foreman-retrofit-pit-artifacts
# Date: 2026-05-08
# Authority: foreman-v2-agent (POLC-Orchestration)
# CS2 Authorization: CS2-direct-assignment (issue assigned to foreman-v2-agent)

## Wave Summary

Governance-only retrofit of PIT pre-build artifacts to align with the functional-app-delivery
hardening standard applied to MMM. No code, no schema migrations, no CI changes, no builder
delegation, no architecture gate-pass, no build authorisation.

## IN_SCOPE

The following paths are explicitly in scope for this wave:

```
modules/pit/BUILD_PROGRESS_TRACKER.md
modules/pit/00-app-description/app-description.md
modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md
modules/pit/02-frs/functional-requirements.md
modules/pit/03-trs/technical-requirements-specification.md
modules/pit/03-trs/frs-to-trs-traceability.md
modules/pit/_readiness/functional-delivery-retrofit-checklist.md
modules/pit/_readiness/pit-functional-delivery-gap-register.md
.admin/prs/pr-1576.json
.agent-admin/assurance/iaa-wave-record-pit-prebuilt-retrofit-20260508.md
.agent-admin/scope-declarations/pr-1576.md
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
.agent-workspace/foreman-v2/personal/wave-current-tasks-pit-prebuilt-retrofit-20260508.md
.agent-workspace/foreman-v2/personal/scope-declaration-wave-pit-prebuilt-retrofit-20260508.md
.agent-workspace/foreman-v2/memory/PREHANDOVER-session-pit-prebuilt-retrofit-20260508.md
.agent-workspace/foreman-v2/memory/session-pit-prebuilt-retrofit-20260508.md
```

## OUT_OF_SCOPE

The following are explicitly NOT in scope and must be absent from the PR diff:

```
src/**
apps/**
packages/**
supabase/**
.github/workflows/**
.github/agents/**
```

## Approved Artifact Paths

```yaml
approved_artifact_paths:
  - modules/pit/BUILD_PROGRESS_TRACKER.md
  - modules/pit/00-app-description/app-description.md
  - modules/pit/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md
  - modules/pit/02-frs/functional-requirements.md
  - modules/pit/03-trs/technical-requirements-specification.md
  - modules/pit/03-trs/frs-to-trs-traceability.md
  - modules/pit/_readiness/functional-delivery-retrofit-checklist.md
  - modules/pit/_readiness/pit-functional-delivery-gap-register.md
  - .admin/prs/pr-1576.json
  - .agent-admin/assurance/iaa-wave-record-pit-prebuilt-retrofit-20260508.md
  - .agent-admin/scope-declarations/pr-1576.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks-pit-prebuilt-retrofit-20260508.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-pit-prebuilt-retrofit-20260508.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-pit-prebuilt-retrofit-20260508.md
  - .agent-workspace/foreman-v2/memory/session-pit-prebuilt-retrofit-20260508.md
```

## Build Authorization

```
build_authorization: NOT CLEARED
implementation_blocked: YES
builder_delegation: NONE
architecture_gate_pass: NONE
qa_to_red_gate_pass: NONE
pbfag_pass: NONE
deployment_authorisation: NONE
```

## Governing Issue

Closes #[GOVERNING_ISSUE_NUMBER]

*This scope declaration was created at wave start, before any substantive file changes.*
*Wave: pit-prebuilt-retrofit-20260508 | PR: #1576 | Date: 2026-05-08*
