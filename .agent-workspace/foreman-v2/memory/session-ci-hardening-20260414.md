# Foreman Session Memory — CI Hardening

date: 2026-04-14
session: ci-hardening
wave: gov-simplification-ci-enforcement

agents_delegated_to:
  - agent: api-builder
    task: "Add CI enforcement for wave record count cap, scope declaration validation, and canon file ceiling in existing workflow files"

## Summary

Three governance rules from the GOV-SIMPLIFICATION wave were contractual-only with no CI enforcement. This session adds machine checks for each:
1. Wave record count cap (polc-boundary-gate.yml)
2. Scope declaration validation (polc-boundary-gate.yml)
3. Canon file ceiling (governance-watchdog.yml)

## Decisions

- All changes made in existing workflow files — no new workflows created.
- Gap 1 and Gap 2 are blocking; Gap 3 is advisory.
- Bypass patterns and job naming conventions match existing jobs.

## POLC Evidence

- Pre-brief: Existing IAA pre-brief artifacts in .agent-admin/assurance/ cover this wave.
- Implementation: Workflow file modifications only (polc-boundary-gate.yml, governance-watchdog.yml).
- Scope: CI enforcement additions — no application code changes.
