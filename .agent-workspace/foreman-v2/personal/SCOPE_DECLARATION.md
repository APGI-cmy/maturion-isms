# SCOPE DECLARATION — Wave CL-10 (Re-execution) | Session cl10-d2-20260409

**Agent**: foreman-v2-agent (orchestration) + integration-builder (CL-10-D2)
**Wave**: CL-10 (Re-execution)
**Branch**: copilot/cl-10-routing-governance-ci-enforcement-again
**Date**: 2026-04-09
**Issue**: maturion-isms#1313
**Authority**: A-026 / A-031

> **A-031 NOTE**: IAA ceremony artifacts (Pre-Brief, PREHANDOVER, session memory, token file)
> from this wave are carved out of scope tracking per A-031. See Exempt section below.

## Files Added (This Wave)

| Path | Description |
|------|-------------|
| `.github/workflows/sub-module-routing-check.yml` | CL-10-D2: Sub-module routing compliance CI check (GRS-016) |
| `.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2-20260409.md` | Integration-builder PREHANDOVER proof |
| `.agent-workspace/integration-builder/memory/session-cl10-d2-20260409.md` | Integration-builder session memory |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | This file — updated for CL-10 re-execution scope |

## Files Modified (This Wave)

| Path | Description |
|------|-------------|
| `modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts` | Added T-C-010-010, T-C-010-011, T-C-010-012 RED gate tests for CL-10-D2 |

## Files Already in Base (NOT Scope of This PR)

The following files were delivered in a prior execution and are already in `origin/main`.
They will NOT appear in `git diff origin/main...HEAD --name-only` for this branch:

| Path | Description | Merged At |
|------|-------------|-----------|
| `.github/workflows/routing-governance-check.yml` | CL-10-D1 | commit 8aa76f4 |
| `.github/workflows/stub-detection-check.yml` | CL-10-D3 | commit 8aa76f4 |

## Exempt Artifacts (A-031 IAA Ceremony Carve-out)

The following files are IAA ceremony artifacts exempt from scope parity per A-031.
They may appear in `git diff origin/main...HEAD --name-only` but are NOT builder-produced scope:

| File | Type | A-031 Basis |
|------|------|-------------|
| `.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md` | IAA Pre-Brief | A-031 — IAA ceremony artifact (already in branch from prior commits) |
| `.agent-admin/assurance/iaa-token-session-cl10-reexec-20260409.md` | IAA ASSURANCE-TOKEN | A-031 — IAA-authored, written by IAA only (§4.3b / ECAP-001) |
| `.agent-workspace/independent-assurance-agent/memory/session-cl10-reexec-*.md` | IAA session memory | A-031 — IAA-authored ceremony artifact |
| `.agent-workspace/independent-assurance-agent/parking-station/*.md` | IAA parking station | A-031 — IAA-authored ceremony artifact |

## Files Excluded

- `node_modules/`
- `dist/`
- Any file not listed above (builder scope is exhaustively declared)

## Scope Boundaries

- Production code paths touched: None
- CI workflows added: 1 (sub-module-routing-check.yml)
- CI workflows modified: None (routing-governance-check.yml and stub-detection-check.yml unchanged)
- Agent contract files modified: None
- Database schema modified: None
- Governance canon modified: None

## git diff origin/main...HEAD --name-only (reconciliation)

Expected output at final commit:
```
.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md  ← A-031 exempt
.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md                              ← this file
.agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2-20260409.md   ← evidence
.agent-workspace/integration-builder/memory/session-cl10-d2-20260409.md               ← evidence
.github/workflows/sub-module-routing-check.yml                                         ← D2 deliverable
modules/mat/tests/ci-governance-check/routing-governance-ci.test.ts                   ← RED gate tests
```

SCOPE_DECLARATION parity: ✅ All non-exempt files are declared above.
A-031 carve-out: ✅ IAA ceremony artifacts explicitly listed in Exempt section.
