# Scope Declaration — Wave pit-market-comparison-hardening-20260517
# PR: #1651
# Branch: copilot/harden-pit-market-comparison
# Date: 2026-05-17
# Authority: foreman-v2-agent (POLC-Orchestration)
# CS2 Authorization: CS2 direct issue assignment/instruction

## Wave Summary

Targeted PIT pre-build documentation hardening to produce a defensible market-comparison feature inventory and explicit capability classifications without overclaiming v1 scope. No runtime code, DB migrations, deployment config, builder appointment for implementation, QA-to-Red gate-pass, PBFAG pass, implementation-plan approval, or build execution.

## IN_SCOPE

```
.admin/prs/pr-1651.json
.agent-admin/assurance/iaa-wave-record-pit-market-comparison-hardening-20260517-20260517.md
.agent-admin/scope-declarations/pr-1651.md
.agent-workspace/foreman-v2/personal/wave-current-tasks.md
.agent-workspace/foreman-v2/personal/scope-declaration-wave-pit-market-comparison-hardening-20260517.md
modules/pit/_readiness/pit-market-comparison-feature-inventory.md
modules/pit/00-app-description/app-description.md
modules/pit/02-frs/functional-requirements.md
modules/pit/03-trs/technical-requirements-specification.md
modules/pit/04-architecture/architecture.md
modules/pit/BUILD_PROGRESS_TRACKER.md
modules/pit/_readiness/pit-build-process-improvement-register.md
```

## OUT_OF_SCOPE

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
  - .admin/prs/pr-1651.json
  - .agent-admin/assurance/iaa-wave-record-pit-market-comparison-hardening-20260517-20260517.md
  - .agent-admin/scope-declarations/pr-1651.md
  - .agent-workspace/foreman-v2/personal/wave-current-tasks.md
  - .agent-workspace/foreman-v2/personal/scope-declaration-wave-pit-market-comparison-hardening-20260517.md
  - modules/pit/_readiness/pit-market-comparison-feature-inventory.md
  - modules/pit/00-app-description/app-description.md
  - modules/pit/02-frs/functional-requirements.md
  - modules/pit/03-trs/technical-requirements-specification.md
  - modules/pit/04-architecture/architecture.md
  - modules/pit/BUILD_PROGRESS_TRACKER.md
  - modules/pit/_readiness/pit-build-process-improvement-register.md
```

## Build Authorization

```
build_authorization: NOT CLEARED
implementation_blocked: YES
builder_delegation: DOCUMENTATION-ONLY
architecture_gate_pass: NONE
qa_to_red_gate_pass: NONE
pbfag_pass: NONE
deployment_authorisation: NONE
```
