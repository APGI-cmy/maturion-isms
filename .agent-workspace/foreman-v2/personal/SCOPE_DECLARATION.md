# SCOPE DECLARATION — wave-wf-contract-audit-20260310

**Wave**: wave-wf-contract-audit-20260310
**Branch**: copilot/update-agent-contract-audit-workflow
**Date**: 2026-03-10
**Fresh overwrite**: YES (cat /dev/null > before writing — per A-029)

## Files Modified (git diff origin/main...HEAD --name-only)

| File | Type | Justification |
|------|------|---------------|
| `.github/workflows/agent-contract-audit.yml` | CI workflow | PRIMARY — trigger migration `pull_request` → `pull_request_target` + checkout ref |
| `.agent-admin/assurance/iaa-prebrief-wave-wf-contract-audit-20260310.md` | IAA governance artifact | PRE-BRIEF — written by IAA agent (excluded per A-031 carve-out) |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | Governance knowledge | GOVERNANCE — breach registration INC-WCA-PREBRIEF-IMPL-001 + A-033 rule |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Governance personal | GOVERNANCE — wave task register (excluded per A-031 carve-out) |

## Out of Scope

- No `.github/agents/` files (A-013 — N/A)
- No product code (apps/, modules/, supabase/, packages/)
- No schema migrations
- No frontend changes
- No test files
