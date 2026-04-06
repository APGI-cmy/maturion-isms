# SCOPE DECLARATION — Wave CL-10 | Session cl10-routing-governance-20260405

**Agent**: foreman-v2-agent
**Wave**: cl-10-routing-governance-ci-enforcement
**Branch**: copilot/cl-10-routing-governance-ci-enforcement
**Date**: 2026-04-05

## Files Added (This Wave)

| Path | Description |
|------|-------------|
| `.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-20260405.md` | IAA Pre-Brief artifact (SHA f9db5ab) |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Updated for CL-10 active wave |
| `modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts` | CL-10-D1 RED gate tests (qa-builder) |
| `.github/workflows/routing-governance-check.yml` | CL-10-D2 provider import CI check (integration-builder) |
| `.github/workflows/stub-detection-check.yml` | CL-10-D3 stub detection CI check (integration-builder) |
| `.agent-workspace/qa-builder/memory/PREHANDOVER-session-cl10-d1-20260405.md` | qa-builder PREHANDOVER proof |
| `.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2d3-20260405.md` | integration-builder PREHANDOVER proof |

## Files Modified

None (governance artifacts only — SCOPE_DECLARATION and wave-current-tasks.md are Foreman-owned)

## Files Excluded

- `node_modules/`
- `dist/`
- Any file not listed above

## Scope Boundaries

- Production code paths touched: None
- CI workflows added: 2 (routing-governance-check.yml, stub-detection-check.yml)
- Existing CI workflows modified: None
- Agent contract files modified: None

## Amendments (Post-IAA R1 REJECTION-PACKAGE)

Following IAA R1 REJECTION-PACKAGE, two amendments were made:

1. **OVL-CI-005 fix**: `workflow_dispatch: {}` added to:
   - `.github/workflows/routing-governance-check.yml`
   - `.github/workflows/stub-detection-check.yml`
   Both files remain YAML valid (re-verified via python yaml.safe_load).

2. **integration-builder PREHANDOVER updated**: OVL-CI-005 S-033 exception section added with YAML evidence + pattern parity evidence.

Ceremony artifacts committed as one batch per IAA required fix sequence.
