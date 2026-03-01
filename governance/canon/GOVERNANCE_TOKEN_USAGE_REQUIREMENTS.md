# GOVERNANCE TOKEN USAGE REQUIREMENTS

## Status
**Type**: Canonical Governance Policy  
**Authority**: CS2 (Johan Ras)  
**Version**: 1.0.0  
**Effective Date**: 2026-03-01  
**Owner**: Governance Administrator  
**Precedence**: Subordinate to CONSTITUTION.md; Extends MATURION_BOT_EXECUTION_IDENTITY_MODEL.md  
**Layer-Down Status**: PUBLIC_API — Mandatory propagation to all consumer repositories

---

## 1. Purpose

This canon establishes the **universal enforcement requirement** that all automated write operations across all Maturion repositories MUST use `MATURION_BOT_TOKEN` as the execution identity. It closes the enforcement gap that allowed `GITHUB_TOKEN` (`github.token` / `secrets.GITHUB_TOKEN`) to be used for mutation operations, which caused CI failures due to restricted scope.

---

## 2. Policy Statement

### REQ-TU-001: MATURION_BOT_TOKEN Mandatory for Write Operations
**Statement**: All workflow jobs that perform write operations (commit, branch creation, PR creation, issue creation/update, merge, label, repository dispatch) MUST authenticate using `secrets.MATURION_BOT_TOKEN`.  
**Severity**: CRITICAL  
**Enforcement**: Merge gate block  
**Rationale**: `GITHUB_TOKEN` has restricted scope and cannot push to protected branches, open cross-repo PRs, or trigger downstream workflows. Token scope restriction was the root cause of maturion-isms CI failures.

### REQ-TU-002: GITHUB_TOKEN Prohibited for Automated Write Operations  
**Statement**: `github.token` and `secrets.GITHUB_TOKEN` are PROHIBITED for any automated step that mutates repository state. This applies to `actions/checkout` `token:` field, `env: GH_TOKEN:`, and any `with: token:` on write-capable actions.  
**Severity**: CRITICAL  
**Enforcement**: Merge gate block  
**Exceptions**: Read-only operations (fetch, advisory integration, code review assistance) MAY use `GITHUB_TOKEN` where the intent is explicitly documented.

### REQ-TU-003: Token Identity Evidence Step Required  
**Statement**: Every mutation job MUST include a step that prints the token identity being used (without revealing the token value). The evidence step MUST appear before any write operation.  
**Severity**: HIGH  
**Enforcement**: Merge gate block  
**Evidence format**: `echo "EXEC_IDENTITY: MATURION_BOT_TOKEN in use for write operations"`

### REQ-TU-004: Explicit Write Permissions Declaration  
**Statement**: Workflow jobs that perform write operations MUST declare explicit `permissions:` with at minimum `contents: write` and/or `pull-requests: write` as required by the job scope.  
**Severity**: HIGH  
**Enforcement**: Merge gate block  
**Rationale**: Default permissions are permissive-but-limited. Explicit declaration is required for audit clarity and least-privilege enforcement.

### REQ-TU-005: Read-Only Job Isolation  
**Statement**: Read-only jobs (fetch, advisory, scanning) SHOULD be isolated from write jobs. Where isolation is not possible, the job MUST document the intent and use `GITHUB_TOKEN` only for read-scoped steps.  
**Severity**: MEDIUM  
**Enforcement**: Advisory  

---

## 3. Enforcement Scope

### 3.1 Covered Operations
All of the following operations are **write operations** and require `MATURION_BOT_TOKEN`:

| Operation | GitHub API / Action | Prohibited Token |
|-----------|---------------------|-----------------|
| Git push / branch creation | `git push`, `actions/checkout` with write | `github.token` |
| Pull request creation | `gh pr create`, `octokit`, `gh api /pulls` | `secrets.GITHUB_TOKEN` |
| Issue creation / update | `gh issue create`, `gh api /issues` | `secrets.GITHUB_TOKEN` |
| Merge (auto or manual trigger) | `gh pr merge` | `secrets.GITHUB_TOKEN` |
| Label assignment | `gh api /labels` | `secrets.GITHUB_TOKEN` |
| Repository dispatch | `gh api /dispatches` | `secrets.GITHUB_TOKEN` |
| Workflow run trigger | `gh api /actions/workflows/.../dispatches` | `secrets.GITHUB_TOKEN` |
| Comment on PR/issue | `gh api /comments` (write) | `secrets.GITHUB_TOKEN` |

### 3.2 Permitted GITHUB_TOKEN Uses (Read-Only)
`GITHUB_TOKEN` MAY be used for:
- `actions/checkout@v4` without a `token:` override in read-only jobs
- Fetching PR metadata, issue lists, commit information
- Advisory integration (runtime AI advisory calls)
- Status reporting (read-only GitHub API calls)
- Any operation explicitly documented as read-only in the workflow step name

---

## 4. Consumer Repository Requirements

All consumer repositories registered in `governance/CONSUMER_REPO_REGISTRY.json` MUST:

1. Configure `MATURION_BOT_TOKEN` as a repository or organisation secret
2. Replace any `github.token` / `GITHUB_TOKEN` usage in write steps with `MATURION_BOT_TOKEN`
3. Add the token identity evidence step (REQ-TU-003) to all mutation jobs
4. Declare explicit permissions per REQ-TU-004
5. Deploy the `token-usage-enforcement.yml` workflow template provided in this layer-down

---

## 5. Enforcement Workflow

The enforcement lint check is implemented in:
- **Script**: `.github/scripts/validate-token-usage.sh`
- **Merge gate job**: `governance/token-usage-check` in `.github/workflows/merge-gate-interface.yml`
- **Gate requirement**: `governance_token_usage` in `governance/GATE_REQUIREMENTS_INDEX.json`

The check scans all workflow YAML files in `.github/workflows/` for violations and reports:
- `GITHUB_TOKEN` in write-capable step positions
- `github.token` in `env:` or `with: token:` on write steps
- Missing explicit permissions on write jobs

---

## 6. Motivating Failure

This policy directly resolves the root cause identified in the maturion-isms CI failure investigation:

> CI/automation steps relying on `GITHUB_TOKEN` encountered restricted scope and failed to push PRs, branches, or perform automated merges.

See `governance/reports/ripple-malfunction-investigation-2026-02-14.md` for full failure analysis.

---

## 7. Related Canon

- `MATURION_BOT_EXECUTION_IDENTITY_MODEL.md` — Execution identity model and token rotation
- `GOVERNANCE_REPO_ADMINISTRATOR_REQUIREMENTS.md` — REQ-SS-001 (token management)
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` — Layer-down execution protocol
- `STOP_AND_FIX_DOCTRINE.md` — Blocking gate philosophy
- `ZERO_TOLERANCE_FINDING_PROTOCOL.md` — All findings are blocking

---

**Authority**: CS2 (Johan Ras) | Contract v2.0.0 | File: governance/canon/GOVERNANCE_TOKEN_USAGE_REQUIREMENTS.md
