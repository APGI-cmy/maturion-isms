# SCOPE_DECLARATION - Wave CL-10 (Re-execution) — Routing Governance CI Enforcement

**Session**: session-cl10-reexec-20260409
**Wave**: CL-10 (Re-execution)
**Issue**: maturion-isms#1313
**Branch**: copilot/cl-10-routing-governance-ci-enforcement-again
**Date**: 2026-04-09 / 2026-04-10
**Authority**: A-026 / A-031

## Files Changed in This Wave

- `.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md` - IAA Pre-Brief for CL-10 re-execution (IAA-authored, A-031 exempt)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl10-reexec-20260409.md` - Foreman PREHANDOVER proof (R1)
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-cl10-reexec-R2-20260409.md` - Foreman PREHANDOVER proof (R2, post-rejection fix)
- `.agent-workspace/foreman-v2/memory/session-cl10-reexec-20260409.md` - Foreman session memory
- `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` - Foreman personal SCOPE_DECLARATION (governance artifact)
- `.agent-workspace/foreman-v2/personal/cl10-d2-builder-checklist.md` - Foreman Stage-9 Builder Checklist for CL-10-D2
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` - Foreman wave-current-tasks updated for CL-10 re-execution
- `.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2-20260409.md` - Integration-builder PREHANDOVER proof for CL-10-D2
- `.agent-workspace/integration-builder/memory/session-cl10-d2-20260409.md` - Integration-builder session memory for CL-10-D2
- `.github/workflows/sub-module-routing-check.yml` - CL-10-D2: Sub-module routing compliance CI check (GRS-016)
- `modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts` - RED gate tests T-C-010-010/011/012 for CL-10-D2
- `SCOPE_DECLARATION.md` - This file (updated for CL-10 re-execution wave)

## Exempt from Scope Declaration (A-031 carve-out)

IAA ceremony files are exempt from scope declaration requirements per A-031:
- `.agent-admin/assurance/iaa-token-session-cl10-reexec-20260409.md` - IAA ASSURANCE-TOKEN (IAA-authored, §4.3b)
- `.agent-workspace/independent-assurance-agent/memory/session-cl10-reexec-R2-20260409.md` - IAA session memory (IAA-authored, A-031 exempt)

## Scope Notes

CL-10 re-execution wave. Adds CL-10-D2 (sub-module routing compliance CI check) which enforces
GRS-016 at the package.json dependency level. D1 (routing-governance-check.yml) and D3
(stub-detection-check.yml) are already in main from the original CL-10 execution.
No production code modified. One CI workflow added. Three tests added to existing test file.

