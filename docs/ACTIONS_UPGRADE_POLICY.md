# GitHub Actions Upgrade Policy

**Authority**: Issue #1463 — Actions deprecation detection gate; Issue #1648 — Node 24 posture refresh
**Applies to**: All `.github/workflows/` and `.github/actions/` files in the `maturion-isms` repository
**Owner**: Foreman / CS2 (APGI-cmy)
**Last Updated**: 2026-05-14

---

## 1. Purpose

This document defines how GitHub Actions versions are managed in the Maturion ISMS repository, including:

- Which versions are currently approved and banned
- How the deprecation gate enforces version standards
- How Dependabot PRs are reviewed and merged
- The composite setup action that centralises common primitives
- The Node.js runtime standard for all workflows

---

## 2. Centralised Standards

### 2.1 Composite Setup Action

The repository provides a reusable composite action at:

```
.github/actions/setup/action.yml
```

**Purpose**: Centralise `actions/checkout`, `pnpm/action-setup`, and `actions/setup-node` in one authoritative place so individual workflow files don't each pin versions independently.

**Usage in a workflow:**

```yaml
steps:
  - name: Setup workspace
    uses: ./.github/actions/setup
    with:
      node-version: '24'   # optional, default: '24'
      fetch-depth: '1'     # optional, default: '1'
```

**Update procedure**: To upgrade the pinned versions in this composite action, open a PR whose implementation change is limited to `.github/actions/setup/action.yml`, together with any governance evidence required by repository gates (for example, `SCOPE_DECLARATION.md`). The deprecation gate will scan the updated action file and verify it uses approved versions before merge.

### 2.2 Approved Versions List

| Action | Minimum Approved Version | Notes |
|--------|--------------------------|-------|
| `actions/checkout` | `@v5` | v1–v4 are banned (v4 uses Node.js 20 runtime) |
| `actions/setup-node` | `@v5` | v1–v4 are banned (v4 uses Node.js 20 runtime) |
| `actions/upload-artifact` | `@v5` | v1–v4 are banned (v4 uses Node.js 20 runtime) |
| `actions/download-artifact` | `@v5` | v1–v4 are banned (v4 uses Node.js 20 runtime) |
| `actions/cache` | `@v5` | v1–v4 are banned (v4 uses Node.js 20 runtime) |
| `pnpm/action-setup` | `@v4` | v1, v2, v3 are banned; v4 is approved |
| `actions/github-script` | `@v7` | current standard |
| `actions/setup-python` | `@v5` | current standard |
| `github/codeql-action/*` | `@v3` | current latest — do not flag |
| `supabase/setup-cli` | `@v1` | current latest — do not flag |
| `peter-evans/create-pull-request` | `@v6` | current standard |

> **Note**: Actions not listed here should default to their current latest major version. When in doubt, check the official action repository for the latest stable release.

---

## 3. Deprecation Gate

### 3.1 What the Gate Does

The CI gate at `.github/workflows/actions-deprecation-gate.yml` scans all YAML files in:

- `.github/workflows/`
- `.github/actions/`

It searches for `uses:` lines containing any banned version strings and **fails with a non-zero exit code** if any are found.

### 3.2 When the Gate Runs

The gate triggers on:

- **Pull requests** that modify any file under `.github/workflows/**` or `.github/actions/**`
- **`workflow_dispatch`** — can be triggered manually from the Actions tab at any time

### 3.3 How to Declare a New Banned Version

1. Open a PR on the `main` branch
2. Edit `.github/workflows/actions-deprecation-gate.yml`
3. Add the new banned pattern to the `BANNED_VERSIONS` array in the scan step:

```bash
BANNED_VERSIONS=(
  # existing entries …
  "actions/checkout@v4"    # ← add new entry here
  "actions/setup-node@v4"  # ← Node.js 20 runtime — ban once v5 is adopted repo-wide
)
```

4. The gate will self-validate on its own PR before merge

### 3.4 Remediation When the Gate Fails

If the gate fails on your PR:

1. Identify the flagged workflow file and line number from the gate output
2. Update the `uses:` line to the approved version (see §2.2)
3. Push the fix — the gate will re-run automatically
4. If you believe the version should be excluded from the banned list, raise a governance issue before bypassing the gate

**The gate must not be bypassed.** There is no `continue-on-error` exception. Silent suppression (`|| true`) is prohibited.

---

## 4. Dependabot Configuration

### 4.1 Schedule

Dependabot is configured to check `github-actions` updates **weekly on Monday at 09:00 SAST**.

### 4.2 PR Grouping

Updates are grouped to reduce PR noise:

| Group | Scope | Update Types |
|-------|-------|--------------|
| `actions-core` | `actions/*` | **major**, minor, patch |
| `pnpm-actions` | `pnpm/*` | minor, patch |
| `peter-evans-actions` | `peter-evans/*` | minor, patch |

> **Note (Issue #1648)**: The `actions-core` group was updated to include `major` updates so that
> Node.js 24-compatible major-version bumps (e.g., `setup-node@v4→v5`) are captured by Dependabot
> grouping rather than creating ungrouped PRs that compete for the open-pull-requests-limit.

### 4.3 Review Process

All Dependabot PRs for `github-actions` must be reviewed by `APGI-cmy` (default reviewer assignment).

**Batch review cadence**: Review grouped Dependabot PRs together each Monday or Tuesday, immediately after the weekly schedule runs.

### 4.4 Auto-Merge Criteria

The following updates **may be auto-merged** (subject to CI passing) without manual review:

- Patch-level updates (`@v5.0.x → @v5.0.y`) for any already-approved action
- Minor-level updates within the same major version (`@v5.0 → @v5.1`) for actions in the approved list (§2.2)

The following updates **require manual review** before merge:

- Any major-version bump (`@v5 → @v6`) — must update the approved versions table in this document and the deprecation gate's `BANNED_VERSIONS` list
- Any action not currently in the approved list
- Any update to `github/codeql-action/*` (security toolchain — requires explicit review)

---

## 5. Node Runtime Standard

All GitHub Actions workflows in this repository must use **Node.js 24** as the minimum runtime.

- Do NOT use `node12`, `node16`, `node20`, or any deprecated runner runtime in composite actions
- All composite actions must use `runs.using: "composite"` — NOT `node20`, `node16` or `docker`
- When calling `actions/setup-node`, always specify `node-version: '24'` or higher
- GitHub will remove Node.js 20 from hosted runners on 16 September 2026; Node.js 24 is the
  replacement runtime for all GitHub-hosted action runners (effective 2 June 2026)

This ensures consistency with Vercel deployment targets and avoids Actions runner deprecation warnings.

### 5.1 Deprecation Timeline

| Date | Event |
|------|-------|
| 2026-06-02 | GitHub Actions runners switch default to Node.js 24 |
| 2026-09-16 | Node.js 20 removed from GitHub-hosted runners — workflows using Node.js 20 actions will fail |

### 5.2 Dependabot Update Failure Diagnosis (Issue #1648)

The Dependabot `github_actions in /` update job was failing because:
- The `open-pull-requests-limit: 5` setting was blocking additional GitHub Actions update PRs once 5 were already open.
- Major-version bumps (e.g., v4→v5) create separate PRs outside the grouping rules (which only cover minor/patch updates), further competing for the PR limit.

**Resolution**: The `open-pull-requests-limit` has been raised to `10` to unblock major-version update PRs from being silently starved. The grouping config now also covers major updates for the core `actions-core` group.

---

## 6. Governance

| Role | Responsibility |
|------|---------------|
| CS2 (APGI-cmy) | Approves changes to this policy, the gate's BANNED_VERSIONS list, and major version transitions |
| Foreman | Delegates implementation tasks; reviews grouped Dependabot PRs |
| QA Builder | Implements and validates gate logic; maintains regression suite |
| All contributors | Must not disable or bypass the deprecation gate; must use approved versions |

Changes to the approved versions list (§2.2) or the banned versions list (§3.3) require a PR reviewed by CS2.

---

*End of ACTIONS_UPGRADE_POLICY.md*
