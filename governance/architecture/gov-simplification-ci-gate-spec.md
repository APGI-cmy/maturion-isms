# Architecture Specification: CI Gate for Governance Artifact Validation

**Type**: Architecture Specification (Pre-Implementation)
**Status**: DRAFT — Pending CS2 Approval
**Version**: 1.0.0
**Date**: 2026-04-13
**Author**: governance-liaison-isms (Wave A — gov-simplification)
**Authority**: CS2 (Johan Ras)
**Implements**: Gov-Simplification Wave — T-A3
**Canonical References**:
  - `governance/canon/CI_CONFIRMATORY_NOT_DIAGNOSTIC.md` v1.0.0
  - `governance/canon/GOVERNANCE_ARTIFACT_TAXONOMY.md` v1.0.0
  - `governance/canon/SCOPE_DECLARATION_SCHEMA.md` v1

---

## 1. Purpose

This specification defines the CI gate architecture for validating that governance artifacts
created or modified in a PR conform to approved patterns defined in the
`GOVERNANCE_ARTIFACT_TAXONOMY.md` and the PR's `APPROVED_ARTIFACT_PATHS` scope declaration.

### 1.1 Problem Statement

Currently, agents can create arbitrary files under `.agent-admin/assurance/` without CI
validation. The existing CI workflows check for the *presence* of specific artifacts (e.g.,
`iaa-prebrief-gate.yml` checks that an IAA Pre-Brief exists) but do not validate that
*all* files in governance-controlled directories conform to the taxonomy.

This allows governance artifact proliferation — the very problem the gov-simplification
wave is solving.

### 1.2 Design Principle

Per `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md` v1.0.0:

> CI execution is confirmatory, not diagnostic.

The CI gate confirms that the agent satisfied its governance obligations by:
- Creating only approved artifact types
- Placing them at approved paths
- Not creating undeclared artifacts

The gate does NOT diagnose which artifact is missing or guide the agent to create it.

---

## 2. Existing CI Workflow Assessment

### 2.1 Candidate Workflows

| Workflow | File | Purpose | Suitability |
|----------|------|---------|-------------|
| IAA Pre-Brief Gate | `iaa-prebrief-gate.yml` | Checks for IAA Pre-Brief artifact existence | LOW — checks for presence, not conformance; soft gate (reminder only) |
| Preflight Evidence Gate | `preflight-evidence-gate.yml` | Enforces Phase 1 preflight evidence | LOW — focuses on session memory evidence, not artifact path validation |
| Governance Watchdog | `governance-watchdog.yml` | Automated governance gap detection | MEDIUM — already monitors governance artifacts; but is a detection/alert system, not a blocking gate |
| POLC Boundary Gate | `polc-boundary-gate.yml` | POLC boundary validation | LOW — validates Foreman implementation boundaries, not artifact paths |
| Merge Gate Interface | `merge-gate-interface.yml` | Unified merge gate orchestration | HIGH — already classifies PRs and orchestrates governance/code gates; natural extension point |

### 2.2 Recommendation: Extend `merge-gate-interface.yml`

**Recommendation**: Add a new job to `merge-gate-interface.yml` rather than creating a new standalone workflow.

**Justification**:

1. **Single orchestration point**: `merge-gate-interface.yml` already classifies PRs as
   `governance`, `docs`, or `code` and runs type-specific checks. Adding artifact path
   validation here keeps all merge-blocking gates in one workflow.

2. **CI_CONFIRMATORY_NOT_DIAGNOSTIC compliance**: Per the canon, CI gates should not
   proliferate. A new standalone workflow would add another CI check to monitor, configure,
   and maintain. Extending the existing merge gate keeps the gate surface minimal.

3. **Existing PR classification**: The merge gate already detects changes under
   `.agent-admin/` and `governance/` paths for PR classification. The artifact validation
   logic can reuse this detection.

4. **Status check consolidation**: The required status checks in agent contracts reference
   `Merge Gate Interface / *` patterns. Adding a new job as
   `Merge Gate Interface / governance/artifact-paths` keeps it within the existing
   check namespace.

**Alternative considered**: Creating `governance-artifact-gate.yml` as a standalone workflow.
Rejected because it would duplicate the PR classification logic already in merge-gate-interface
and add a new required status check to all agent contracts — a ripple-heavy change for no
functional benefit.

---

## 3. Gate Logic Specification

### 3.1 New Job: `artifact-path-validation`

**Job name**: `Merge Gate Interface / governance/artifact-paths`
**Trigger**: Same as existing merge-gate-interface (pull_request_target: opened, synchronize, reopened, labeled, unlabeled)
**Condition**: Runs on all PRs (governance artifact paths can appear in any PR type)

### 3.2 Gate Algorithm

```
INPUT:
  changed_files = git diff --name-only origin/$BASE...HEAD
  approved_patterns = parse APPROVED_ARTIFACT_PATHS from governance/scope-declaration.md
  taxonomy_patterns = parse approved patterns from GOVERNANCE_ARTIFACT_TAXONOMY.md

STEP 1: Filter changed files to governance-controlled directories
  governance_files = changed_files.filter(f =>
    f.startsWith('.agent-admin/assurance/') OR
    f.startsWith('.agent-admin/build-evidence/')
  )

STEP 2: If governance_files is empty → PASS (no governance artifacts to validate)

STEP 3: For each file in governance_files:
  3a. Check if file matches any pattern in approved_patterns (from scope declaration)
  3b. Check if file matches any pattern in taxonomy_patterns (from taxonomy)
  3c. If NEITHER match → mark file as UNAPPROVED

STEP 4: Verdict
  If any file is UNAPPROVED → FAIL with list of unapproved files
  If all files are APPROVED → PASS
```

### 3.3 Pattern Matching Rules

1. **Exact match**: `governance/scope-declaration.md` matches only that exact path
2. **Parameterised match**: `iaa-wave-record-{wave}-{date}.md` — replace each `{parameter}` placeholder with
   regex `[A-Za-z0-9_-]+`, then match the full path
3. **No glob wildcards**: Patterns like `*.md` or `**/*.md` are rejected for governance paths
4. **Case-sensitive**: All matching is case-sensitive

### 3.4 Taxonomy-Derived Approved Patterns

The gate should recognise the following patterns as inherently approved based on
`GOVERNANCE_ARTIFACT_TAXONOMY.md` artifact types:

| Pattern | Artifact Type |
|---------|--------------|
| `.agent-admin/assurance/iaa-wave-record-{wave}-{date}.md` | Consolidated wave record (Type 5: Governance Evidence) |
| `.agent-admin/assurance/iaa-prebrief-{identifier}.md` | IAA Pre-Brief (Type 5: Governance Evidence) — transitional |
| `.agent-admin/assurance/iaa-token-{identifier}.md` | IAA Token (Type 5: Governance Evidence) — transitional |
| `.agent-admin/assurance/PREHANDOVER-{identifier}.md` | PREHANDOVER Proof (Type 5: Governance Evidence) — transitional |

The "transitional" patterns are retained during the migration period. Once consolidation is
complete, only `iaa-wave-record-{wave}-{date}.md` remains as the approved pattern.

### 3.5 Grace Period Handling

During the transition from separate artifacts to consolidated wave records:

1. **Phase 1 (current)**: Gate runs in WARN mode — logs unapproved files but does not fail
2. **Phase 2 (after migration)**: Gate runs in ENFORCE mode — fails on unapproved files
3. **Phase transition**: Controlled by CS2 via a label or configuration flag

---

## 4. Implementation Architecture

### 4.1 Job Definition (Pseudocode)

```yaml
artifact-path-validation:
  name: "governance/artifact-paths"
  runs-on: ubuntu-latest
  needs: classify-pr
  steps:
    - name: Checkout code
      uses: actions/checkout@v5
      with:
        ref: ${{ github.event.pull_request.head.sha }}
        fetch-depth: 0

    - name: Extract changed governance files
      id: extract
      run: |
        # Get files changed in PR under governance-controlled directories
        CHANGED=$(git diff --name-only origin/${{ github.event.pull_request.base.ref }}...HEAD \
          | grep -E '^\.agent-admin/(assurance|build-evidence)/' || true)
        echo "governance_files<<EOF" >> $GITHUB_OUTPUT
        echo "$CHANGED" >> $GITHUB_OUTPUT
        echo "EOF" >> $GITHUB_OUTPUT

    - name: Validate against approved patterns
      id: validate
      run: |
        # Parse APPROVED_ARTIFACT_PATHS from scope declaration
        # Compare each governance file against approved patterns
        # Output PASS or FAIL with details
```

### 4.2 Integration with Existing Merge Gate

The new job fits into the existing merge-gate-interface flow:

```
classify-pr → [existing jobs]
           ↘ artifact-path-validation → merge-verdict (final)
```

The `merge-verdict` job (or equivalent final verdict job) would include this new check
in its pass/fail aggregation.

---

## 5. Non-Duplication Verification

Per `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`, no duplicate gates are permitted. This section
verifies that the proposed gate does not duplicate existing CI checks:

| Existing Gate | What It Checks | Overlap with Proposed Gate |
|--------------|----------------|--------------------------|
| `iaa-prebrief-gate.yml` | IAA Pre-Brief *exists* | NO — proposed gate checks *conformance*, not existence |
| `preflight-evidence-gate.yml` | Session memory contains preflight evidence | NO — different artifact type |
| `governance-watchdog.yml` | Missing pre-brief, missing IAA token, work without PR | PARTIAL — watchdog detects *missing* artifacts; proposed gate detects *unapproved* artifacts. Complementary, not duplicative. |
| `polc-boundary-gate.yml` | Foreman implementation boundaries | NO — different concern |
| `merge-gate-interface.yml` | PR classification, governance alignment, stop-and-fix | NO — proposed gate adds a new check type (artifact path conformance) not covered by existing jobs |

**Conclusion**: No duplication. The proposed gate fills a gap (artifact path conformance)
that no existing gate covers.

---

## 6. Rollout Plan

### 6.1 Phases

| Phase | Mode | Trigger | Action on Unapproved File |
|-------|------|---------|--------------------------|
| Phase 1 — Warn | WARN | Gate deployed | Log warning, annotate PR, PASS |
| Phase 2 — Enforce | ENFORCE | CS2 activates enforcement | Log failure, annotate PR, FAIL |

### 6.2 Activation Mechanism

Enforcement is activated by CS2 adding a repository variable or updating a configuration
file. Suggested mechanism:

- Repository variable: `GOVERNANCE_ARTIFACT_GATE_MODE` = `warn` | `enforce`
- Default: `warn` (safe rollout)

---

## 7. Impact Assessment

### 7.1 Affected Workflows

| Workflow | Change | Wave |
|----------|--------|------|
| `merge-gate-interface.yml` | Add `artifact-path-validation` job | Wave C (implementation) |

### 7.2 Agent Contract Impact

No agent contract changes required. The new job runs under the existing
`Merge Gate Interface / *` namespace, which is already referenced in agent
`merge_gate_interface.required_checks`.

### 7.3 Ripple Impact

- Workflow changes in `.github/workflows/` are `escalation_required` for governance-liaison-isms
- Implementation requires CS2 authorisation and builder delegation via Foreman
- No ripple to canonical governance source (this is a consumer-side CI enhancement)

---

## 8. Open Questions for CS2

1. Should the grace period (WARN mode) have a fixed duration, or remain until CS2 explicitly activates enforcement?
2. Should the gate validate files under `.agent-workspace/*/memory/` as well, or only `.agent-admin/`?
3. Should the `APPROVED_ARTIFACT_PATHS` field from scope-declaration.md take precedence over taxonomy-derived patterns, or should both be checked in union?

---

**End of Architecture Specification**
