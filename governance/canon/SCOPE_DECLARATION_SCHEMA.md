# SCOPE DECLARATION SCHEMA

## Status
Canonical Governance Specification  
Version: v2.0.0  
Authority: Governance  
Amended: 2026-04-29 — v2.0.0: Updated §3 artifact location to per-PR path (.agent-admin/scope-declarations/pr-<PR_NUMBER>.md); §4 required sections updated to include Files Changed (section 7); §5.1 header fields updated from v1 to v2 (PR_NUMBER, ISSUE, BRANCH); §5.7 Files Changed subsection added with three-way consistency rule; §6 Validity Rules extended with numeric field checks; authority: CS2 — issue #1359 (per-PR immutable scope declaration model).  
Applies To: All PRs, All Builders, All Repositories

---

## 1. Purpose

This schema defines the mandatory structure for a Scope Declaration.

The Scope Declaration exists to:
- Prevent scope explosion
- Preserve causality
- Ensure failures are attributable to a single responsibility
- Protect diagnostic clarity in CI and QA

A PR may not exist without a valid Scope Declaration.

---

## 2. Core Invariants

1. A PR MUST declare exactly ONE responsibility domain.
2. All work MUST be traceable to that domain.
3. Anything not explicitly in scope is OUT of scope.
4. Scope may not expand after PR creation.
5. If scope must expand, the PR MUST be closed and restarted.
6. Each PR MUST own its own immutable scope declaration file — the global shared model is abolished.

---

## 3. Artifact Location (Normative)

A valid Scope Declaration MUST be located at:

```
.agent-admin/scope-declarations/pr-<PR_NUMBER>.md
```

Examples:

```
.agent-admin/scope-declarations/pr-1360.md
.agent-admin/scope-declarations/pr-1361.md
```

No other filename or location is permitted as the authoritative per-PR scope artifact.

> **Deprecated path**: `governance/scope-declaration.md` (global shared file) — no longer permitted
> as the per-PR scope evidence source. See `governance/scope-declaration.md` for the migration notice.

Each PR must introduce or update **exactly one** scope declaration file matching its own PR number.
The file is immutable once committed — it is not overwritten by subsequent PRs.

---

## 4. Required Sections (Normative)

A valid Scope Declaration MUST contain the following sections **in order**:

1. Header
2. PR Responsibility Domain
3. Explicitly In Scope
4. Explicitly Out of Scope
5. Expected Verification Signal
6. Scope Freeze Declaration
7. Files Changed

---

## 5. Required Fields (Exact Markers)

### 5.1 Header
- `SCOPE_SCHEMA_VERSION: v2`
- `PR_NUMBER:` (PR number)
- `ISSUE:` (issue number — issue title)
- `BRANCH:` (branch name)
- `OWNER:` (Builder or Agent)
- `DATE_UTC:`

### 5.2 PR Responsibility Domain
- `RESPONSIBILITY_DOMAIN:`  
  Must be a **single noun phrase**.

❌ Multiple domains are forbidden  
❌ Compound domains are forbidden  
❌ “System improvements” is forbidden

---

### 5.3 Explicitly In Scope
- `IN_SCOPE:`  
  Bullet list of items directly related to the responsibility domain.

---

### 5.4 Explicitly Out of Scope
- `OUT_OF_SCOPE:`  
  Bullet list that MUST include (at minimum):

  - Tests (unless tests are the responsibility)
  - CI
  - Migrations
  - Email
  - Logging
  - Audit
  - Deployment
  - Infra

Anything not listed here is implicitly **ambiguous** and invalid.

---

### 5.5 Expected Verification Signal
- `EXPECTED_VERIFICATION:`
  - `CI: GREEN`
  - `TESTS: UNCHANGED | GREEN`
  - `GOVERNANCE_GATES: GREEN`

---

### 5.6 Scope Freeze Declaration
- `SCOPE_FROZEN: YES`

This is a binding declaration.
If scope changes, the PR must be closed.

---

### 5.7 Files Changed
- `## FILES_CHANGED` section header
- `FILES_CHANGED: N` (numeric count of changed files — must equal the count of bullet entries and `git diff --name-only origin/main...HEAD | wc -l`)
- One `- <path>` bullet entry per changed file

All three values MUST be consistent: the numeric `FILES_CHANGED: N` field, the count of bullet entries, and the actual git diff count.

---

## 6. Validity Rules

A Scope Declaration is INVALID if:
- Any required marker is missing
- More than one responsibility domain is declared
- OUT_OF_SCOPE does not include required exclusions
- SCOPE_FROZEN is not YES
- `FILES_CHANGED: N` does not match the count of bullet entries under `## FILES_CHANGED`
- `FILES_CHANGED: N` does not match `git diff --name-only origin/main...HEAD | wc -l`

---

## 7. Enforcement

CI MUST block:
- PR merge
- Build-to-Green
- QA pass

If the Scope Declaration is missing or invalid.

---

End of SCOPE DECLARATION SCHEMA
