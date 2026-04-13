# Architecture Specification: Scope Declaration Extension for Approved Artifact Paths

**Type**: Architecture Specification (Pre-Implementation)
**Status**: DRAFT — Pending CS2 Approval
**Version**: 1.0.0
**Date**: 2026-04-13
**Author**: governance-liaison-isms (Wave A — gov-simplification)
**Authority**: CS2 (Johan Ras)
**Implements**: Gov-Simplification Wave — T-A2
**Target Documents**:
  - `governance/canon/SCOPE_DECLARATION_SCHEMA.md` (v1 → v2)
  - `governance/canon/scope-declaration.template.md` (v1 → v2)

---

## 1. Purpose

This specification defines the architecture for extending `SCOPE_DECLARATION_SCHEMA.md` with a new
**Section 5.7 — Approved Artifact Paths** field. This field declares the exact file paths that a PR
is authorised to create or modify, enabling CI to validate that no undeclared files appear in the
changeset.

### 1.1 Problem Statement

Currently, the Scope Declaration constrains PRs by responsibility domain and in/out-of-scope
declarations, but does not enumerate the specific file paths that the PR is allowed to touch.
This leads to:

- Governance artifact proliferation — agents create files at arbitrary paths without declaration
- CI cannot validate whether a new file is expected or a scope violation
- `.agent-admin/assurance/` accumulates undeclared artifacts that bypass taxonomy validation

### 1.2 Design Goal

Add a machine-readable field to the Scope Declaration that CI can parse and validate against the
actual PR changeset. If a file appears in the PR diff but is not listed in `APPROVED_ARTIFACT_PATHS`,
the CI gate fails.

---

## 2. Schema Extension: Section 5.7

### 2.1 Field Definition

The following section is to be added to `SCOPE_DECLARATION_SCHEMA.md` as **Section 5.7**, immediately
after the existing Section 5.6 (Scope Freeze Declaration):

```markdown
### 5.7 Approved Artifact Paths

- `APPROVED_ARTIFACT_PATHS:`
  Explicit list of file paths (or parameterised path patterns) that this PR is authorised to
  create or modify. Each path must be listed on its own bullet line.

**Rules**:
1. Every file created or modified by the PR MUST appear in this list (or match a listed pattern).
2. Path patterns use `{parameter}` syntax for variable segments (e.g., `{wave}`, `{date}`, `{id}`).
3. Wildcards (`*`, `**`) are NOT permitted for governance artifact paths under `.agent-admin/` or `governance/`.
4. Application code paths MAY use directory-level patterns (e.g., `apps/mat-app/src/lib/**`).
5. If the PR modifies files not listed here, the CI gate MUST fail.
6. The list is frozen at PR creation time — if new files are needed, the PR must be closed and restarted per Core Invariant 5.

**Validation**: CI MUST extract this field and compare it against `git diff --name-only` for the PR.
```

### 2.2 Path Pattern Syntax

Patterns use `{parameter}` for variable segments. These are NOT glob wildcards — they are
named placeholders that match exactly one path segment value.

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `.agent-admin/assurance/iaa-wave-record-{wave}-{date}.md` | `iaa-wave-record-waveA-20260413.md` | `iaa-wave-record-waveA-20260413-extra.md` |
| `.agent-workspace/foreman-v2/memory/session-{id}-{date}.md` | `session-064-20260413.md` | `session-064-20260413-backup.md` |
| `governance/scope-declaration.md` | (exact match) | `governance/scope-declaration-v2.md` |

### 2.3 Governance Path Restrictions

For paths under the following directories, wildcards are prohibited — every file must be
individually declared:

- `.agent-admin/assurance/`
- `.agent-admin/build-evidence/`
- `.agent-workspace/*/memory/`
- `.agent-workspace/*/personal/`
- `governance/`

This prevents agents from declaring broad patterns that bypass taxonomy validation.

---

## 3. Template Extension

### 3.1 Addition to `scope-declaration.template.md`

The following section is to be appended after the `SCOPE_FROZEN: YES` line in the template:

```markdown
## Approved Artifact Paths
APPROVED_ARTIFACT_PATHS:
- {path_1}
- {path_2}
```

### 3.2 Example: Populated Scope Declaration

```markdown
## Approved Artifact Paths
APPROVED_ARTIFACT_PATHS:
- .agent-admin/assurance/iaa-wave-record-{wave}-{date}.md
- .agent-workspace/foreman-v2/personal/wave-current-tasks.md
- .agent-workspace/foreman-v2/memory/session-{id}-{date}.md
- governance/scope-declaration.md
- governance/templates/iaa-wave-record.template.md
- governance/architecture/gov-simplification-scope-declaration-extension.md
- governance/architecture/gov-simplification-ci-gate-spec.md
```

---

## 4. Validation Rule

### 4.1 CI Gate Behaviour

The CI gate that consumes `APPROVED_ARTIFACT_PATHS` must implement the following logic:

1. **Parse**: Extract the `APPROVED_ARTIFACT_PATHS:` field from `governance/scope-declaration.md`.
2. **Expand**: For each pattern, generate a regex by replacing `{parameter}` with `[^/]+`.
3. **Diff**: Run `git diff --name-only origin/$BASE_BRANCH...HEAD` to get the PR changeset.
4. **Match**: For each changed file, check if it matches at least one approved pattern.
5. **Verdict**:
   - **PASS**: All changed files match an approved pattern, OR no files are in governance-controlled paths.
   - **FAIL**: Any file in the changeset does not match any approved pattern.

### 4.2 Failure Output

On failure, the CI gate must output:

```
APPROVED_ARTIFACT_PATHS gate: FAIL
Unapproved files detected:
  - path/to/unapproved-file.md (no matching pattern in APPROVED_ARTIFACT_PATHS)
```

### 4.3 Exemptions

The following files are always implicitly approved (do not need to be listed):

- `governance/scope-declaration.md` (the scope declaration itself)
- Files matching patterns declared in the Scope Declaration schema as mandatory

---

## 5. Impact Assessment

### 5.1 Affected Documents

| Document | Change Type | Wave |
|----------|------------|------|
| `governance/canon/SCOPE_DECLARATION_SCHEMA.md` | Add Section 5.7 | Wave B |
| `governance/canon/scope-declaration.template.md` | Add APPROVED_ARTIFACT_PATHS field | Wave B |
| CI workflow (TBD per T-A3) | Add validation step | Wave C |

### 5.2 Backward Compatibility

- Existing scope declarations without `APPROVED_ARTIFACT_PATHS` remain valid during transition
- CI gate should treat missing field as "all paths approved" (permissive default) during rollout
- After rollout period (defined by CS2), the field becomes mandatory

### 5.3 Ripple Impact

- This is a schema change to a canonical document — ripple to all consumer repositories required
- Consumer repositories must update their scope declaration templates
- No impact on application code or test suites

---

## 6. Open Questions for CS2

1. Should `APPROVED_ARTIFACT_PATHS` be mandatory from day one, or should there be a transition period?
2. Should application code paths (e.g., `apps/mat-app/src/`) be allowed to use directory wildcards?
3. Should the CI gate run as part of the existing merge-gate-interface or as a standalone workflow?

---

**End of Architecture Specification**
