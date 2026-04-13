# IAA Pre-Brief — Wave CL-10 Re-execution
## Routing Governance CI Enforcement — Sub-Module Check (CL-10-D2)

**Artifact Path**: `.agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md`
**Wave**: CL-10 (Re-execution)
**Branch**: `copilot/cl-10-routing-governance-ci-enforcement-again`
**Issue**: maturion-isms#1313
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.5.0)
**Pre-Brief Generated**: 2026-04-09
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Pre-Brief Token**: IAA-PREBRIEF-CL10-REEXEC-20260409

---

## Section 1 — Wave Context

This is a **re-execution** of Wave CL-10. The original execution (Issue #1227, branch
`copilot/cl-10-routing-governance-ci-enforcement`) delivered CL-10-D1 and CL-10-D3 and
received ASSURANCE-TOKEN (IAA-session-cl10-routing-governance-20260405-R2-PASS, merged
at commit 8aa76f4).

**Already merged to base (NOT scope of this PR):**
- CL-10-D1: `.github/workflows/routing-governance-check.yml` ✅ in base
- CL-10-D3: `.github/workflows/stub-detection-check.yml` ✅ in base

**New deliverable for this execution:**
- CL-10-D2: `.github/workflows/sub-module-routing-check.yml` (or equivalent filename)
  — CI check that scans `modules/*/package.json` and `apps/*/package.json` for direct
  AI provider SDK dependencies (`openai`, `@anthropic-ai/sdk`, `@langchain/*`) per GRS-016

**CS2 Authorization**: Issue maturion-isms#1313, referencing CS2 wave-start from prior
Issue #1221. Foreman delegation per CEP v1.8.0.

---

## Section 2 — Qualifying Task Classification

### Task Inventory Against INDEPENDENT_ASSURANCE_AGENT_CANON.md §Trigger Table

| Task ID | Deliverable | File Path | IAA Trigger Category | Qualifying? | Rationale |
|---------|------------|-----------|---------------------|-------------|-----------|
| CL-10-D2 | Sub-module routing compliance CI check | `.github/workflows/sub-module-routing-check.yml` | **CI_WORKFLOW** | ✅ YES | `.github/workflows/` file creation → CI_WORKFLOW trigger (step 3 of classification flow). Mandatory. |
| CL-10-D1 | routing-governance-check.yml | Already in base (commit 8aa76f4) | N/A — already merged | ❌ NOT in this PR diff | Merged in prior execution. Will not appear in three-dot diff for this branch. |
| CL-10-D3 | stub-detection-check.yml | Already in base (commit 8aa76f4) | N/A — already merged | ❌ NOT in this PR diff | Merged in prior execution. Will not appear in three-dot diff for this branch. |

**Summary**: One qualifying task. Category: **CI_WORKFLOW**. IAA = MANDATORY.

---

## Section 3 — Required Evidence Artifacts

The following artifacts MUST be committed to the branch **before** IAA final audit invocation.
Any artifact listed as PENDING at T9 (IAA invocation) = automatic FAIL on HFMC-03 (A-033).

### Mandatory Artifacts (PREHANDOVER Evidence Bundle)

| # | Artifact | Required Path | Verification Method |
|---|----------|--------------|---------------------|
| 1 | **CL-10-D2 deliverable** | `.github/workflows/sub-module-routing-check.yml` (or approved equivalent) | `git ls-tree -r HEAD -- .github/workflows/sub-module-routing-check.yml` — A-033 |
| 2 | **PREHANDOVER proof** | `.agent-workspace/foreman-v2/personal/PREHANDOVER-session-[N]-cl10-reexec-YYYYMMDD.md` | `git ls-files --error-unmatch [path]` — A-033 |
| 3 | **integration-builder session memory** | `.agent-workspace/integration-builder/memory/session-[N]-cl10-d2-YYYYMMDD.md` | `git ls-files --error-unmatch [path]` — A-033 |
| 4 | **foreman session memory** | `.agent-workspace/foreman-v2/memory/session-[N]-cl10-reexec-YYYYMMDD.md` | `git ls-files --error-unmatch [path]` — A-033 |
| 5 | **SCOPE_DECLARATION.md** (current wave) | `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` (or equivalent) | Must list exactly the same files as `git diff origin/main...HEAD --name-only` — HFMC-02 / A-026 |
| 6 | **YAML lint / actionlint evidence** | Included in PREHANDOVER or as standalone evidence artifact | OVL-CI-005 S-033 exception condition 1 |
| 7 | **Pattern parity evidence** | Included in PREHANDOVER — compare sub-module-routing-check.yml structure vs routing-governance-check.yml | OVL-CI-005 S-033 exception condition 2 |

### iaa_audit_token Pre-Population (A-029 / §4.3b)

Per FAIL-ONLY-ONCE A-029 and §4.3b architecture, the PREHANDOVER proof MUST contain:
```
iaa_audit_token: IAA-session-[N]-cl10-reexec-YYYYMMDD-PASS
```
This field is pre-populated with the expected reference format. It is NOT a placeholder.
Do NOT populate it as `TBD`, `PENDING`, or leave blank — these will fail CORE-007.

### IAA Token File (Written BY IAA — Not by Foreman)

IAA will write the dedicated token file at:
`.agent-admin/assurance/iaa-token-session-[N]-cl10-reexec-YYYYMMDD.md`
**Foreman MUST NOT create this file.** It is IAA-only (§4.3b / ECAP-001).

### A-031 Carve-Out (IAA Ceremony Artifacts)

The SCOPE_DECLARATION.md MUST include an explicit `### Exempt` or `## IAA Ceremony Artifacts`
section listing any IAA-authored files with A-031 citation. This prevents HFMC-02 false
failures if IAA issues a REJECTION-PACKAGE (which adds IAA session memory and parking station
entries to the branch diff). Failure to include this carve-out was the cause of the REJECTION
in the optimize-iaa-invocation-workflows R1 session (2026-04-09). **Do not repeat this.**

---

## Section 4 — Applicable Overlays

| Overlay | Trigger | Checks |
|---------|---------|--------|
| **CI_WORKFLOW** | `.github/workflows/` file created | OVL-CI-001 through OVL-CI-005 (5 checks) |
| Universal Ceremony Gate | All PRs | CERT-001 through CERT-004 (4 existence checks) |
| Core Invariants | All PRs | CORE-001 through CORE-021 (subset applicable — non-AGENT_CONTRACT skips CORE-001 through CORE-012) |
| HFMC | All PRs | HFMC-01 through HFMC-06 (6 binary checks) |

**Note**: BUILD_DELIVERABLE overlay (BD-000 through BD-TIER-3) does NOT apply —
CL-10-D2 is a CI workflow YAML file, not an executable application build. FUNCTIONAL-BEHAVIOUR-REGISTRY
(A-034) and niggle pattern library (A-035) do NOT apply for this reason.

---

## Section 5 — Specific Rules and FFA Checks

### FFA Checks (Fail-First Attestation — CI_WORKFLOW Category)

These are the checks IAA will execute first at T9. Any single failure = REJECTION-PACKAGE.

#### A-001 — IAA Invocation Evidence
- **Check**: Is IAA invocation evidence present? (PREHANDOVER `iaa_audit_token` field populated,
  plus this Pre-Brief artifact committed to branch)
- **Required evidence**: This pre-brief file committed to git; `iaa_audit_token` in PREHANDOVER
  proof populated with expected reference format (not TBD/PENDING/blank)
- **Verification**: `git ls-files --error-unmatch .agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md`

#### A-002 — No Class Exemption
- **Check**: Has any agent claimed class exemption from IAA?
- **Expected**: NO. Foreman class is NOT exempt. integration-builder class is NOT exempt.
- **Verification**: PREHANDOVER proof must not contain any language claiming IAA exemption.

#### A-033 — Git-Committed Verification (NOT Disk-Only)
- **Applies to**: ALL declared artifacts in PREHANDOVER evidence bundle
- **Check**: Every file cited in PREHANDOVER must be in git, not just on disk
- **Verification command**: `git ls-files --error-unmatch [each path]` for every artifact
- **Background**: Original CL-10 R2 session noted "ceremony-commit-then-invoke discipline"
  as a resolved pattern. Must remain resolved in this execution.
- **Critical**: Do NOT invoke IAA before running `git status` and confirming clean tree with
  all artifacts committed and pushed.

#### A-026 — SCOPE_DECLARATION Parity
- **Check**: SCOPE_DECLARATION.md must list exactly the files in the three-dot diff
- **Verification**: `git diff origin/main...HEAD --name-only | sort` output must match
  SCOPE_DECLARATION.md file list
- **A-031 carve-out**: IAA-authored ceremony files (if present) must be listed in an
  explicit Exempt section with A-031 citation
- **Background**: This was the cause of REJECTION-PACKAGE in optimize-iaa-invocation-workflows R1
  (session-optimize-iaa-invocation-workflows-20260409). Recurring pattern — must not repeat.

### Specific Rules for CI_WORKFLOW — CL-10-D2

#### OVL-CI-001 — Workflow Policy Correctness
- The workflow must scan `modules/*/package.json` and `apps/*/package.json` (not just source
  code imports) for direct AI provider SDK dependencies
- Covered providers per GRS-016: `openai`, `@anthropic-ai/sdk`, `@langchain/*`
- The scan logic must cover all three provider families, not just one
- `grep` or `jq` based scanning of `package.json` `dependencies` and `devDependencies` sections
- **Exclusion scope**: Legacy apps (e.g., `maturion-maturity-legacy`) may have GOV exemption —
  must be explicitly documented in workflow comments if excluded
- **Pass condition**: Workflow exits non-zero (blocks merge) when a direct SDK dep is found
  in a non-exempted module/app

#### OVL-CI-002 — Merge Gate Integrity
- The new workflow must NOT weaken any existing merge gate check
- It MUST enforce failure on detection (not merely warn)
- Confirm that routing-governance-check.yml (D1, already merged) remains present and unmodified

#### OVL-CI-003 — Silent Failure Risk
- Confirm no `continue-on-error: true` on the scan step
- Confirm exit codes are properly propagated
- Confirm the workflow does not silently pass when the target directories (`modules/`,
  `apps/`) do not exist or are empty

#### OVL-CI-004 — Trigger Scope
- Workflow should trigger on `pull_request` events for `paths` that include
  `modules/**/package.json` and `apps/**/package.json`
- Include `workflow_dispatch: {}` for manual post-merge validation (S-033 condition 3)
- Confirm trigger is not over-broad (e.g., triggering on all PRs including those that
  don't touch package.json files is acceptable but must be intentional)

#### OVL-CI-005 — S-033 Exception (Self-Referential Workflow)
- This is a NEW workflow added by the PR — it cannot have a prior CI run URL before merge
- S-033 exception applies: three substitute conditions required in PREHANDOVER:
  1. **YAML lint / actionlint clean output** on `.github/workflows/sub-module-routing-check.yml`
  2. **Pattern parity evidence** — compare structure against `routing-governance-check.yml`
     (approved, previously-run equivalent). Document structural differences and justify.
  3. **`workflow_dispatch:` retained** in the new workflow (enables CS2 manual validation
     post-merge)
- The PREHANDOVER proof MUST explicitly invoke the S-033 exception clause with all three
  conditions documented. A bare "CI not yet run" claim fails OVL-CI-005 without these.

---

## Section 6 — Anti-Regression Obligations

### Recurring Patterns from Prior Sessions

| Pattern | Prior Session | Obligation for This Wave |
|---------|--------------|--------------------------|
| **A-033: Commit before IAA** | session-cl10-routing-governance-20260405 (R1 rejection) | Run `git status` + `git ls-files --error-unmatch [all paths]` before T9 invocation. Clean tree required. |
| **A-026: SCOPE_DECLARATION parity** | session-optimize-iaa-invocation-workflows-20260409 (R1 rejection) | SCOPE_DECLARATION.md must include A-031 carve-out for IAA ceremony files. Run `git diff origin/main...HEAD --name-only` and reconcile with SCOPE_DECLARATION BEFORE T9 invocation. |
| **OVL-CI-005 S-033 documentation** | session-cl10-routing-governance-20260405 (original CL-10 execution) | New workflows cannot produce pre-merge CI run URLs. All three S-033 substitute conditions must be in PREHANDOVER. |
| **SCOPE_DECLARATION A-031 carve-out** | session-optimize-iaa-invocation-workflows-20260409 (R1 rejection) | Add Exempt section with A-031 citation proactively at T5 (PREHANDOVER commit), before T9 invocation — not after a rejection. |

### Mechanical Pre-T9 Verification Checklist

Before invoking IAA at T9, Foreman MUST run and confirm ALL of the following:
```
1. git status → working tree clean, nothing untracked
2. git ls-files --error-unmatch .github/workflows/sub-module-routing-check.yml
3. git ls-files --error-unmatch [PREHANDOVER proof path]
4. git ls-files --error-unmatch [integration-builder session memory path]
5. git ls-files --error-unmatch [foreman session memory path]
6. git diff origin/main...HEAD --name-only | sort → reconcile with SCOPE_DECLARATION.md
7. actionlint .github/workflows/sub-module-routing-check.yml → clean output
8. Confirm iaa_audit_token in PREHANDOVER is non-empty, non-PENDING format
9. Confirm SCOPE_DECLARATION.md has A-031 Exempt section for IAA artifacts
```
Any failure in the above → FIX FIRST, THEN invoke IAA. Do not invoke IAA with open items.

---

## Section 7 — Scope Blockers

### Confirmed Scope Blockers: NONE

No open breaches in `.agent-workspace/independent-assurance-agent/memory/breach-registry.md`.
No REJECTION-PACKAGEs from the prior wave (optimize-iaa-invocation-workflows) carrying
unresolved obligations into this wave.

### Advisory Notes (Not Blockers — For Awareness)

| # | Note | Impact |
|---|------|--------|
| 1 | **GRS-016 scope** | Ensure the workflow scans `dependencies` AND `devDependencies` in each package.json. A scan of only one section may miss SDK deps installed as dev dependencies. |
| 2 | **Legacy exclusion documentation** | If `maturion-maturity-legacy` (or other legacy apps) are excluded from the scan, the exclusion MUST be documented in workflow comments with a GOV reference. Per routing-governance-check.yml precedent. |
| 3 | **Langchain wildcard** | `@langchain/*` is a wildcard scope. The grep/jq pattern must handle all `@langchain/` prefixed packages, not just a single known package. |
| 4 | **Empty directory handling** | The workflow scan must not fail silently if `modules/` or `apps/` contain no `package.json` files (e.g., early in a new module lifecycle). A clean exit (not error) on empty directories is expected. |
| 5 | **Filename confirmation** | Wave context specifies `sub-module-routing-check.yml` as the expected filename. If integration-builder uses a different filename, SCOPE_DECLARATION.md and PREHANDOVER must reflect the actual filename. |

---

## Section 8 — Ceremony Admin

**`ceremony_admin_appointed`**: NOT PRESENT in wave-current-tasks.md → **NO ceremony admin in scope.**

ECAP-001 three-role split check (Step 3.1c) is: **N/A** for this wave.

---

## Section 9 — PREHANDOVER Structure Requirements

The PREHANDOVER proof for T9 invocation MUST contain the following sections:

```markdown
## Wave Summary
- Wave: CL-10 (Re-execution), Issue #1313
- Deliverable: CL-10-D2 — sub-module routing compliance CI check
- Branch: copilot/cl-10-routing-governance-ci-enforcement-again
- Producing agents: integration-builder (D2), foreman-v2-agent (orchestration)

## Deliverable Evidence
- CL-10-D2: .github/workflows/sub-module-routing-check.yml — committed SHA: [SHA]
- integration-builder session memory: [path] — committed SHA: [SHA]

## Pre-IAA Commit Gate (A-033)
- git status output: [paste actual output — must show clean]
- git ls-files --error-unmatch results: [list each path — must all pass]

## SCOPE_DECLARATION Parity (A-026)
- git diff origin/main...HEAD --name-only output: [paste actual list]
- SCOPE_DECLARATION.md matches: [YES/NO]
- Discrepancies: [none / list]

## Ripple/Cross-Agent Assessment (HFMC-01)
- Impact on routing-governance-check.yml (D1, in base): [none — new workflow, no modification]
- Impact on stub-detection-check.yml (D3, in base): [none — no modification]
- Impact on other CI workflows: [assessment]
- Impact on modules/mat/ or apps/*: [none — CI governance only]

## OVL-CI-005 S-033 Exception
- Invoked: YES (new workflow, self-referential, cannot produce pre-merge CI run)
- Condition 1 — YAML lint / actionlint output: [paste clean output]
- Condition 2 — Pattern parity evidence: [structural comparison vs routing-governance-check.yml]
- Condition 3 — workflow_dispatch retained: [YES — line N]

## CS2 Authorization Trail
- Issue: maturion-isms#1313
- Wave-start authorization: Issue maturion-isms#1221 (referenced by #1313)
- CEP v1.8.0 delegation: YES

## Exempt Artifacts (A-031 IAA Ceremony Carve-out)
- .agent-admin/assurance/iaa-prebrief-cl-10-routing-governance-ci-enforcement-again.md
  (IAA Pre-Brief — carve-out per A-031)
- [Any IAA rejection session memory / parking station files if R1 cycle occurs]

## iaa_audit_token
iaa_audit_token: IAA-session-[N]-cl10-reexec-YYYYMMDD-PASS
```

---

## Section 10 — Pre-Brief Status

| Field | Value |
|-------|-------|
| `wave` | CL-10 (Re-execution) |
| `issue` | maturion-isms#1313 |
| `branch` | copilot/cl-10-routing-governance-ci-enforcement-again |
| `qualifying_tasks` | 1 (CL-10-D2) |
| `non_qualifying_tasks` | 2 (CL-10-D1 and D3 — already in base) |
| `iaa_trigger_category` | CI_WORKFLOW |
| `ceremony_admin_appointed` | NO |
| `required_overlays` | CI_WORKFLOW (OVL-CI-001–005), HFMC (01–06), Core Invariants |
| `build_deliverable_overlay` | NOT APPLICABLE (CI YAML — not app code) |
| `adoption_phase` | PHASE_B_BLOCKING |
| `breach_registry_status` | CLEAR — no open breaches |
| `recurring_failure_obligations` | A-033 (commit-gate), A-026 (SCOPE_DECLARATION parity), A-031 carve-out |
| `pre_brief_status` | ✅ COMPLETE |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING
**Generated by**: IAA Phase 0 Pre-Brief Protocol
**Pre-Brief Generated**: 2026-04-09
