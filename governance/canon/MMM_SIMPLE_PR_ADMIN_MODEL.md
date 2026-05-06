# MMM Simple PR Admin Model

**Version**: 1.1.0  
**Authority**: APGI-cmy/maturion-foreman-governance#1361 — Simplify MMM governance: replace legacy ceremony with single PR admin manifest  
**Status**: ACTIVE  
**Effective Date**: 2026-05-04  
**Amended**: 2026-05-05 — v1.1.0: CI gate integration section added (maturion-isms#1531)  
**Reference Failure Case**: `maturion-isms` PR #1515 — closed unmerged after a fix/fail governance loop

---

## Purpose

Replace repeated markdown ceremony and brittle PR-body parsing with a **single machine-readable PR admin manifest** (`**.admin/pr.json**`) and one simple validator.

The current MMM governance/admin model became too complex, self-referential, and fragile. Agents repeatedly failed simple admin jobs because the system had too many duplicated sources of truth. This model resets that.

---

## Problem this model solves

### Legacy duplication sources (now frozen for MMM product-fix PRs)

The following sources duplicated the same facts across multiple files, creating mismatch failures:

- PR body prose
- Scope declarations
- IAA wave records
- ECAP bundles
- PREHANDOVER proofs
- Lifecycle JSON files
- Delta-assurance files
- Merge-ready prose scanning
- Issue/PR/wave/SHA fields repeated across multiple files

### Failure modes eliminated

- PR body says one issue, scope declaration says another
- IAA token reviewed SHA is stale relative to HEAD
- ECAP says PASS but the gate expects a different field
- A gate emits BLOCKED state but exits successfully
- A fix creates a new artifact path that another gate rejects
- PR body parsing mistakes a reference PR for the governing issue

---

## The four questions every governed PR must answer

1. **What is this PR meant to do?** → `type`, `issue`, `pr` fields
2. **What files is it allowed to change?** → `scope` array
3. **What evidence proves it works?** → `evidence_required` array
4. **Who may approve/merge it?** → `merge_authority` field

---

## Manifest: `.admin/pr.json`

Every governed PR in the MMM context MUST have exactly one admin manifest at `.admin/pr.json`.

### Schema

```json
{
  "pr": <number>,
  "issue": <number>,
  "type": "<pr-type>",
  "owner": "<owner>",
  "scope": ["<file-path>", ...],
  "risk": "<risk-level>",
  "requires_iaa": <boolean>,
  "requires_ecap": <boolean>,
  "evidence_required": ["<evidence-item>", ...],
  "merge_authority": "CS2"
}
```

### Field definitions

| Field | Type | Required | Description |
|---|---|---|---|
| `pr` | number | yes | PR number |
| `issue` | number | yes | Governing issue number |
| `type` | string | yes | One of the accepted PR types (see below) |
| `owner` | string | yes | Agent or person responsible for the PR |
| `scope` | string[] | yes | Non-empty list of files this PR is allowed to change |
| `risk` | string | yes | One of `low`, `medium`, `high` |
| `requires_iaa` | boolean | yes | Whether Independent Assurance Agent sign-off is required |
| `requires_ecap` | boolean | yes | Whether ECAP bundle is required |
| `evidence_required` | string[] | yes | Non-empty list of evidence items proving the PR works |
| `merge_authority` | string | yes | Must be `CS2` for all MMM governance/product recovery work |

### Accepted PR types

| Type | IAA Default | ECAP Default |
|---|---:|---:|
| `product-fix` | no | no |
| `test-only` | no | no |
| `deployment-change` | maybe | no |
| `database-migration` | yes | no |
| `governance-change` | yes | yes |
| `agent-contract-change` | yes | yes |

---

## Example manifests

### Product fix

```json
{
  "pr": 1525,
  "issue": 1361,
  "type": "product-fix",
  "owner": "Copilot",
  "scope": [
    "apps/mmm/src/pages/DashboardPage.tsx",
    "modules/MMM/tests/B6-findings/b6-findings.test.ts"
  ],
  "risk": "medium",
  "requires_iaa": false,
  "requires_ecap": false,
  "evidence_required": [
    "tests pass",
    "screenshot or DOM proof of dashboard empty state",
    "route works after login"
  ],
  "merge_authority": "CS2"
}
```

### Governance-control change

```json
{
  "pr": 1526,
  "issue": 1523,
  "type": "governance-change",
  "owner": "Copilot",
  "scope": [
    ".github/scripts/validate-mmm-ui-evidence-pack.sh",
    ".github/workflows/preflight-evidence-gate.yml"
  ],
  "risk": "high",
  "requires_iaa": true,
  "requires_ecap": true,
  "evidence_required": [
    "negative tests fail without evidence pack",
    "positive fixture passes with valid evidence pack"
  ],
  "merge_authority": "CS2"
}
```

---

## Policy decisions

### 1. Single source of truth

`.admin/pr.json` is authoritative for:

- PR number
- Governing issue
- PR type
- Scope/files allowed
- Risk classification
- IAA/ECAP requirement
- Evidence required
- Merge authority

**No required gate may derive these facts from the PR body prose.**

### 2. Legacy ceremony freeze for MMM product-fix PRs

For MMM `product-fix` PRs, the following legacy ceremony artifacts are **frozen** — they are not required as merge evidence unless explicitly listed in `.admin/pr.json`:

- IAA wave records
- ECAP bundles
- PREHANDOVER proofs
- Lifecycle JSON files
- Delta-assurance files
- Agent memory/session artifacts

These may remain as historical artifacts but new MMM product-fix PRs do not need them to merge.

### 3. IAA/ECAP only for high-risk classes

The `requires_iaa` and `requires_ecap` fields in `.admin/pr.json` are the only authoritative signals. The default values (from the type table above) are a starting point — the manifest overrides them.

### 4. Stop-loss rule

If a governance PR fails more than 3 fix cycles after first review, close it and restart smaller. This is to avoid another PR #1515-style loop.

---

## Validator

The validator script `.github/scripts/validate-simple-pr-admin.sh`:

- Fails if `.admin/pr.json` is missing
- Validates all required JSON fields exist
- Validates `issue` is a number
- Validates `scope` is a non-empty list
- Validates changed files are within the declared scope
- Validates `type` is one of the accepted values
- Validates `risk` is one of `low`, `medium`, `high`
- Fails if governance-control files are changed and `requires_iaa`/`requires_ecap` are not `true`
- Fails if `merge_authority` is missing or not `CS2`

The validator does **not**:
- Parse PR body prose
- Parse markdown
- Perform token archaeology
- Check IAA wave records or ECAP bundles

---

## Scope of this model

This model applies to PRs in the MMM governance/product recovery context. It does not replace the broader governance system. After this model is stable, MMM product-fix PRs will migrate to `.admin/pr.json` and resume MMM app recovery work.

---

## CI gate integration

The following CI gates read `.admin/pr.json` and skip or downgrade their checks when the manifest declares the relevant ceremony as not required. This is the authoritative bypass mechanism — no other bypass (e.g. label-based) is needed for MMM product-fix PRs.

| CI gate | Bypass condition | Notes on preserved enforcement |
|---|---|---|
| `preflight/iaa-final-assurance` (`iaa-final-assurance-gate.sh`) | `requires_iaa: false` | Token, PR, issue, and reviewed-SHA linkage checks still run when `requires_iaa: true` |
| `preflight/ecap-admin-ceremony` (`ecap-admin-ceremony-gate.sh`) | `requires_ecap: false` | Protected-path classification and ECAP bundle checks still run when `requires_ecap: true` |
| `preflight/iaa-prebrief-existence` (workflow inline) | `requires_iaa: false` | wave-current-tasks.md and iaa-wave-record pre-brief checks still run when `requires_iaa: true` |
| `preflight/iaa-token-self-certification` (workflow inline) | `requires_iaa: false` | PHASE_B_BLOCKING_TOKEN and PHASE_A_ADVISORY checks still run when `requires_iaa: true` |
| `preflight/hfmc-ripple-presence` (workflow inline) | `requires_iaa: false` | Ripple/Cross-Agent Assessment section presence check still runs when `requires_iaa: true` |

**Stronger controls preserved**: `validate-simple-pr-admin.sh` (CHECK 8) requires `requires_iaa: true` and `requires_ecap: true` for `governance-change`, `agent-contract-change`, and any PR that changes governance-control paths (`.github/workflows/`, `.github/scripts/`, `.github/agents/`, `governance/`, `.agent-admin/`). This means the bypass cannot be self-certified for high-risk PR types.

---

## Non-goals

This model intentionally does NOT add:

- New IAA wave-record formats
- New ECAP bundle formats
- New PREHANDOVER proof formats
- New lifecycle JSON formats
- New delta-assurance formats
- New PR-body parsers
- New merge-ready prose scanners
- New multi-artifact token schemes

---

*Authority: APGI-cmy/maturion-foreman-governance#1361 | Reference failure: PR #1515 (maturion-isms)*
