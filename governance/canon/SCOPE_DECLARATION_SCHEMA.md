# SCOPE DECLARATION SCHEMA

## Status
Canonical Governance Specification  
Version: v2  
Authority: Governance  
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

---

## 3. Artifact Location (Normative)

A valid Scope Declaration MUST be located at:

governance/scope-declaration.md

yaml
Copy code

No other filename or location is permitted.

---

## 4. Required Sections (Normative)

A valid Scope Declaration MUST contain the following sections **in order**:

1. Header
2. PR Responsibility Domain
3. Explicitly In Scope
4. Explicitly Out of Scope
5. Expected Verification Signal
6. Scope Freeze Declaration

---

## 5. Required Fields (Exact Markers)

### 5.1 Header
- `SCOPE_SCHEMA_VERSION: v1`
- `PR_ID:` (PR number or placeholder)
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

### 5.7 Approved Artifact Paths
- `APPROVED_ARTIFACT_PATHS:`
  Bullet list of exact file paths or parameterised patterns that agents are permitted to create during this PR.

  Each entry must be an explicit file path or a parameterised pattern using `{parameter}` syntax (e.g., `{wave}`, `{date}`, `{id}`).

  Example:
  ```
  APPROVED_ARTIFACT_PATHS:
  - .agent-admin/assurance/iaa-wave-record-gov-simplification-20260413.md
  - .agent-workspace/foreman-v2/memory/session-gov-simplification-20260413.md
  - .agent-workspace/foreman-v2/memory/PREHANDOVER-session-gov-simplification-20260413.md
  - governance/scope-declaration.md
  ```

  **Validation Rules**:
  - MUST list every new file the PR will create in `.agent-admin/assurance/` or `.agent-workspace/`
  - Files not listed here but present in the PR diff trigger a CI gate failure
  - Paths MUST reference patterns from `GOVERNANCE_ARTIFACT_TAXONOMY.md` §21 (Prescriptive Artifact Allowlist)
  - IAA ceremony files (iaa-prebrief-*.md, iaa-token-*.md) are exempt from this requirement per A-033 carve-out

---

## 6. Validity Rules

A Scope Declaration is INVALID if:
- Any required marker is missing
- More than one responsibility domain is declared
- OUT_OF_SCOPE does not include required exclusions
- SCOPE_FROZEN is not YES
- A Scope Declaration with `APPROVED_ARTIFACT_PATHS:` missing is INVALID for any PR that creates new files in `.agent-admin/assurance/` or `.agent-workspace/` paths.

---

## 7. Enforcement

CI MUST block:
- PR merge
- Build-to-Green
- QA pass

If the Scope Declaration is missing or invalid.

---

End of SCOPE DECLARATION SCHEMA
