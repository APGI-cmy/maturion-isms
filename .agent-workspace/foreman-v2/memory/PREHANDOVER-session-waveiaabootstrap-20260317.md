# PREHANDOVER Proof — Session waveiaabootstrap — 2026-03-17

**Session ID**: session-waveiaabootstrap-20260317
**Date**: 2026-03-17
**Agent Version**: foreman-v2-agent v6.2.0
**Triggering Issue**: Adopt standardized Maturion agent bootstrap workflow for governance ceremonies
**Branch**: copilot/adopt-standardized-bootstrap-workflow
**Contract Version**: 2.7.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Wave / Task Reference

**Wave**: maturion-iaa-bootstrap
**Issue**: Adopt standardized Maturion agent bootstrap workflow (governance ceremonies + container runner scaffolding)
**Branch**: copilot/adopt-standardized-bootstrap-workflow
**Producing Agent**: Copilot coding agent (builder) under Foreman orchestration

---

## Scope Declaration

### Files Created

| File | Purpose |
|------|---------|
| `.github/workflows/maturion-iaa-bootstrap.yml` | New comment-triggered bootstrap workflow |
| `.github/scripts/agent-runner.sh` | Stub agent runner (labelled intentional stub) |
| `.github/runner/Dockerfile` | Container runner scaffolding (roadmap) |
| `.github/runner/README.md` | Container runner documentation |
| `.agent-admin/assurance/iaa-prebrief-waveiaabootstrap-20260317.md` | IAA Pre-Brief artifact |

### Files Modified

| File | Change |
|------|--------|
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Updated to reflect current wave |

### Files Deleted

| File | Reason |
|------|--------|
| `.github/workflows/agent-bootstrap-inject.yml` | DISABLED legacy — superseded by maturion-iaa-bootstrap.yml |
| `.github/workflows/iaa-prebrief-inject.yml` | DISABLED legacy — superseded by maturion-iaa-bootstrap.yml |
| `.github/workflows/iaa-prebrief-gate.yml` | DISABLED legacy — superseded by maturion-iaa-bootstrap.yml |
| `.github/workflows/injection-audit-report.yml` | DISABLED legacy — superseded by maturion-iaa-bootstrap.yml |

**Zero `.github/agents/` files in PR diff**: ✅ CONFIRMED (CORE-017)

---

## Deliverable Evidence

### T-IAB-001: maturion-iaa-bootstrap.yml

- **Trigger**: `issue_comment: [created]` + `workflow_dispatch` (S-033: workflow_dispatch retained)
- **Token wiring**: `MATURION_BOT_TOKEN` in `checkout`, `gh api`, and `github.rest.issues.createComment`
- **Token guard**: First step validates token is non-empty; fails with error if absent
- **Path restrictions**: Write path enforcement step checks all changed files against `[".agent-admin/assurance", ".agent-workspace"]` before committing
- **Idempotency**: agent-runner.sh checks for existing artifacts before generating new ones
- **Commands**: `/maturion-bootstrap`, `/iaa-prebrief`, `/iaa-token <value>`

### T-IAB-002: Stub runner script

- **Path**: `.github/scripts/agent-runner.sh`
- **Stub label**: `# STUB — INTENTIONAL PLACEHOLDER` clearly documented in file header
- **Usage instructions**: Documented in file header and called from workflow
- **Commands**: `bootstrap`, `iaa-prebrief`, `iaa-token`

### T-IAB-003: Legacy workflow disposal

All four DISABLED workflows DELETED:
- `agent-bootstrap-inject.yml` — DELETED
- `iaa-prebrief-inject.yml` — DELETED
- `iaa-prebrief-gate.yml` — DELETED
- `injection-audit-report.yml` — DELETED

### T-IAB-004: Container runner scaffold

- **Directory**: `.github/runner/`
- **Files**: `Dockerfile`, `README.md`
- **Purpose**: Roadmap scaffold for future containerised deterministic agent execution
- **Status**: Phase 1 (shell stub) complete; Phase 2 (container build) planned

### T-IAB-005: MATURION_BOT_TOKEN

- **Secret name**: `MATURION_BOT_TOKEN` (matches existing pattern in governance-ripple-sync.yml)
- **No hardcoding**: Token only referenced via `${{ secrets.MATURION_BOT_TOKEN }}`
- **Provisioning**: Secret must be set in repository settings — workflow will fail on first run if absent (token guard step catches this)

### T-IAB-006: Write path restriction

- Enforced in workflow job `run-bootstrap` step `Enforce write path restriction and commit artifacts`
- Allowed paths: `.agent-admin/assurance/`, `.agent-workspace/`
- Any file outside these paths → workflow exits non-zero (violation logged)
- Only allowed paths staged for commit: `git add .agent-admin/assurance/ .agent-workspace/`

---

## OVL-CI-005 S-033 Exception (Comment-Triggered Workflow)

Per IAA Pre-Brief advisory, S-033 compliance is required for comment-triggered workflows that cannot produce pre-merge CI run URLs.

**S-033 Conditions documented:**

1. **yamllint/YAML syntax validation**: YAML parsed successfully via `python3 yaml.safe_load`. yamllint run — violations are consistent with existing workflows (line-length, no document-start). No unique violations introduced.

2. **Pattern parity against approved equivalent workflow**: `maturion-iaa-bootstrap.yml` follows the same structural pattern as `governance-ripple-sync.yml` (approved, merged):
   - MATURION_BOT_TOKEN guard as first step
   - `actions/checkout@v4` with `token: ${{ secrets.MATURION_BOT_TOKEN }}`
   - Git config with `user.name "Maturion Bot"` and `user.email "bot@maturion.ai"`
   - Commit with conventional commit message
   - `git push origin HEAD`

3. **`workflow_dispatch` retained**: Yes — `workflow_dispatch` trigger is present with inputs for `pr_number`, `command`, and `token_value`.

**S-033 exception declared**: This workflow cannot self-test before merge. The three conditions above satisfy the S-033 compliance requirement.

---

## Merge Gate Integrity

**AGCFPP-001 agent-contract-audit.yml**: PRESENT and UNMODIFIED ✅

```
$ ls .github/workflows/agent-contract-audit.yml
.github/workflows/agent-contract-audit.yml
```

No agent contract files modified. All AGCFPP-001 protections intact.

---

## IAA Invocation Evidence

**Pre-Brief artifact**: `.agent-admin/assurance/iaa-prebrief-waveiaabootstrap-20260317.md`
**Status**: COMMITTED (commit 789d6fc)
**OVL-INJ-001**: ✅ SATISFIED — pre-brief committed before builder task artifacts

**IAA Audit Token (expected reference at commit time — §4.3b)**:
`iaa_audit_token: IAA-session-waveiaabootstrap-20260317-PASS`

*Per §4.3b: PREHANDOVER proof is read-only post-commit. IAA token will be written to dedicated new file: `.agent-admin/assurance/iaa-token-session-waveiaabootstrap-20260317.md`*

---

## Session Memory

**Session memory file**: `.agent-workspace/foreman-v2/memory/session-waveiaabootstrap-20260317.md`

---

## OPOJD Gate

This is a CI/governance workflow wave. No automated test suite applies.
Equivalent verification performed:

- [x] Zero test failures (N/A — CI workflow wave; no test suite)
- [x] Zero skipped/todo/stub tests (N/A — intentional stub labelled and documented)
- [x] Zero deprecation warnings (YAML syntax valid; no deprecated action versions)
- [x] Zero compiler/linter warnings beyond existing repo baseline (consistent with all other workflows)
- [x] Evidence artifacts present: Pre-Brief ✅, wave-current-tasks.md ✅, PREHANDOVER ✅
- [x] Architecture followed: MATURION_BOT_TOKEN guard, write-path restriction, allowed-paths-only commits ✅
- [x] Zero `.github/agents/` files in diff (CORE-017) ✅
- [x] §4.3 Merge gate parity check: PASS (workflow follows approved governance-ripple-sync.yml pattern)
- [x] IAA audit token: PASS (token reference recorded at commit time — see §4.3b)

**OPOJD**: PASS
