# IAA Pre-Brief — Wave CL-10: LKIAC-L4 — Routing Governance CI Enforcement

**Artifact Type**: IAA Phase 0 Pre-Brief Artifact
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.3.0)
**Date**: 2026-04-05
**Wave**: CL-10 — LKIAC-L4 — Routing Governance CI Enforcement
**Branch**: `copilot/cl-10-routing-governance-ci-enforcement`
**CS2 Authorization Issue**: #1221 — Item 5: 'CL-7 & CL-10 wave-starts go PARALLEL with CL-6'
  (also #1227 — Wave-Start Authorization issue)
**Programme**: LKIAC-L4 (part of AIMC + LKIAC Combined Execution Plan v1.8.0)
**Produced By**: independent-assurance-agent (Phase 0 — PRE-BRIEF mode ONLY)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## Phase 0 Execution Confirmation

> This artifact was generated in **PRE-BRIEF mode** (Phase 0 only).
> IAA has NOT executed Phases 1–4 assurance in this session.
> Full Phase 2–4 assurance will execute at handover when the producing agents submit their
> completed PREHANDOVER proof(s) and IAA is formally re-invoked.

---

## Step 0.2 — Wave Scope Confirmation

**Source**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.8.0, Wave CL-10
**CS2 Authorization**: Issue #1221 (2026-04-05), Item 5 — CL-10 wave-start AUTHORISED parallel with CL-6

**Wave Objective**: Machine-enforce GRS-016 (no direct AI provider imports in module code) at the
CI merge gate level. Implement stub detection CI check. This resolves GOV-001, GOV-002, and
FAIL-ONLY-ONCE S-002.

**Entry Gate State**: CL-4 ✅ CLOSED — direct import scan baseline established, current codebase
confirmed clean.

**Declared Deliverables** (per CEP v1.8.0 §Wave CL-10):

| ID | Deliverable | Assigned To | Location |
|----|------------|-------------|---------|
| CL-10-D1 | RED gate test: CI check integration test — test that a PR with `import { OpenAI }` in module code fails the gate | `qa-builder` | CI check integration test file(s) |
| CL-10-D2 | CI merge gate check: detect direct provider import patterns (`import { OpenAI }`, `import Anthropic`) in `modules/` and `apps/` (excluding `maturion-maturity-legacy`) — fails PR on match (GOV-001, GOV-002, T-C-010) | `integration-builder` | `.github/workflows/` |
| CL-10-D3 | CI merge gate check: detect `expect(true).toBe(true)` stub patterns anywhere in test suite — fails PR on match (FAIL-ONLY-ONCE S-002) | `integration-builder` | `.github/workflows/` |

**Mandatory Sequencing**:
- CL-10-D1 (RED gate test) MUST be committed and confirmed FAILING before integration-builder
  begins CL-10-D2 or CL-10-D3 implementation.
- Only after D1 exists as a committed FAILING test does integration-builder proceed.

---

## Step 0.3 — Trigger Category Classification

**Classification decision flow** (per `iaa-trigger-table.md` v2.1.0):

| Step | Check | CL-10-D1 | CL-10-D2 | CL-10-D3 |
|------|-------|-----------|-----------|-----------|
| 1 | `.github/agents/` or `governance/agents/` changes? | NO | NO | NO |
| 2 | `governance/canon/` or `CANON_INVENTORY.json` changes? | NO | NO | NO |
| 3 | `.github/workflows/` changes? | NO (test file only) | **YES** | **YES** |
| 4 | AAWP/MAT deliverable artifacts (test files, executable CI)? | **YES** — RED gate test | YES — CI executable | YES — CI executable |
| 5 | `governance/quality/agent-integrity/` changes? | NO | NO | NO |
| 6 | `.agent-workspace/*/knowledge/` changes? | NO | NO | NO |
| 7 | Unambiguously doc-only/admin? | NO | NO | NO |

**Per-deliverable classifications**:

| Deliverable | IAA Trigger Category | IAA Required? | Basis |
|------------|---------------------|---------------|-------|
| CL-10-D1 | AAWP_MAT | YES — MANDATORY | RED gate test file is an executable test deliverable under the AIMC/LKIAC programme. Constitutes a T2 build deliverable. |
| CL-10-D2 | CI_WORKFLOW | YES — MANDATORY | New `.github/workflows/` file (direct provider import check). Any workflow creation = CI_WORKFLOW trigger. |
| CL-10-D3 | CI_WORKFLOW | YES — MANDATORY | New `.github/workflows/` file (stub pattern detection check). Any workflow creation = CI_WORKFLOW trigger. |
| Wave Ceremony (PREHANDOVER, session memory) | CANON_GOVERNANCE (T1 orchestration artifact) | YES — MANDATORY | PREHANDOVER proof is a formal programme closure artifact. Consistent with all prior CL-wave precedent. |

**Overall Wave Classification**: **MIXED** (CI_WORKFLOW primary + AAWP_MAT)
**IAA Invocation**: **MANDATORY** — no class exceptions. No EXEMPT deliverables.
**Ambiguity check**: CLEAR — all deliverables unambiguously trigger IAA. No ambiguity resolution required.

---

## Step 0.4 — Qualifying Tasks Detail

### Task CL-10-D1 — RED Gate Test (qa-builder)

| Field | Detail |
|-------|--------|
| `task_id` | CL-10-D1 |
| `task_summary` | qa-builder writes a CI check integration test that FAILS when `import { OpenAI }` (or similar direct provider import) appears in module code. Must be committed as FAILING before D2/D3 implementation. |
| `iaa_trigger_category` | AAWP_MAT |
| `required_phases` | Phase 2–4 at wave handover |
| `required_evidence_artifacts` | (1) Test file committed to branch; (2) Test run output showing RED (FAIL) state before CI implementation; (3) PREHANDOVER proof from qa-builder attesting RED gate delivery |
| `applicable_overlays` | AAWP_MAT overlay (OVL-AAWP-*); PRE_BRIEF_ASSURANCE overlay (OVL-INJ-001) |
| `specific_rules` | **RED gate sequencing**: qa-builder MUST demonstrate the test was committed and FAILING before integration-builder implements the workflow. IAA will `git log` to verify commit timestamps. A test delivered after CI implementation is NOT a valid RED gate and will trigger REJECTION-PACKAGE. |

---

### Task CL-10-D2 — Direct Provider Import CI Check (integration-builder)

| Field | Detail |
|-------|--------|
| `task_id` | CL-10-D2 |
| `task_summary` | integration-builder creates a `.github/workflows/` CI check that detects `import { OpenAI }`, `import Anthropic`, and similar direct AI provider import patterns in `modules/` and `apps/` (excluding `maturion-maturity-legacy`). PR fails on any match. Resolves GOV-001, GOV-002, T-C-010. |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Phase 2–4 at wave handover |
| `required_evidence_artifacts` | (1) Workflow YAML committed to `.github/workflows/`; (2) `actionlint` or `yamllint` clean run output; (3) GREEN evidence — workflow run against current codebase showing zero violations; (4) RED gate confirmation — D1 test (or manual evidence) showing the check FAILS on a violating input; (5) PREHANDOVER proof from integration-builder |
| `applicable_overlays` | CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005); PRE_BRIEF_ASSURANCE overlay (OVL-INJ-001) |
| `specific_rules` | **OVL-CI-001 (policy correctness)**: The regex/grep pattern MUST match BOTH `import { OpenAI }` and `import Anthropic` as stated in CEP. Underscan (missing one variant) = REJECTION-PACKAGE. **OVL-CI-003 (silent failure risk)**: exit code must be non-zero on match. Any `continue-on-error: true` or swallowed exit code = REJECTION-PACKAGE. **OVL-CI-005 (CI evidence)**: Self-referential workflow exception (S-033) applies IF the workflow only triggers on `push: main`. Evidence substitutes: (1) actionlint/yamllint clean, (2) pattern parity against existing `provider-model-ban.yml`, (3) `workflow_dispatch` retained for CS2 post-merge validation. **Exclusion correctness**: `maturion-maturity-legacy` MUST be excluded per CEP spec. Any failure to exclude = REJECTION-PACKAGE. **Scope correctness**: Check must cover BOTH `modules/` AND `apps/` per spec — partial coverage = REJECTION-PACKAGE. |

---

### Task CL-10-D3 — Stub Pattern Detection CI Check (integration-builder)

| Field | Detail |
|-------|--------|
| `task_id` | CL-10-D3 |
| `task_summary` | integration-builder creates a `.github/workflows/` CI check that detects `expect(true).toBe(true)` stub patterns anywhere in the test suite. PR fails on any match. Resolves FAIL-ONLY-ONCE S-002. |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Phase 2–4 at wave handover |
| `required_evidence_artifacts` | (1) Workflow YAML committed to `.github/workflows/`; (2) `actionlint` or `yamllint` clean run output; (3) GREEN evidence — workflow run against current codebase showing zero violations (or if violations found: pre-existing violations flagged and tracked, not silently ignored); (4) Evidence that pattern matches `expect(true).toBe(true)` — a test or dry-run; (5) PREHANDOVER proof from integration-builder |
| `applicable_overlays` | CI_WORKFLOW overlay (OVL-CI-001 through OVL-CI-005); PRE_BRIEF_ASSURANCE overlay (OVL-INJ-001) |
| `specific_rules` | **OVL-CI-001 (policy correctness)**: Pattern MUST match the exact string `expect(true).toBe(true)`. If pattern is over-broad (false positives) OR under-specific (misses the pattern) = REJECTION-PACKAGE. **GREEN state prerequisite**: Before this check can be enforced, the current codebase must contain ZERO instances of `expect(true).toBe(true)`. IAA will independently verify with `grep -rn 'expect(true).toBe(true)' --include='*.ts' --include='*.spec.ts'` before issuing verdict. If violations exist in the current codebase, they MUST be resolved FIRST or the check must be scoped to a future clean-state enforcement. Shipping an always-failing gate = REJECTION-PACKAGE. **OVL-CI-003**: Same silent failure constraint as D2. **Relationship to S-002**: S-002 is listed in the CEP §8 gap table as a FAIL-ONLY-ONCE rule to be enforced by CI. This check is the CI enforcement mechanism for S-002. IAA will cross-check against the FAIL-ONLY-ONCE registry to confirm S-002 is appropriately referenced. |

---

## Step 0.5 — FFA Checks Declared for Handover

IAA declares the following FAIL-ONLY-ONCE and CORE checks that will be executed at Phase 3
during handover assurance. This list is pre-declared so producers can self-audit before submission.

### Universal CORE Checks (All Deliverables)

| Check ID | Check Name | What Produces This |
|----------|-----------|-------------------|
| CORE-013 / A-021 | PREHANDOVER proof committed before IAA invocation | Foreman + producing agents |
| CORE-015 | Session memory committed | qa-builder + integration-builder |
| CORE-016 | IAA verdict evidence (iaa_audit_token field) | IAA (issued at handover) |
| CORE-018 | Complete evidence artifact sweep via `git ls-tree -r HEAD` | IAA verifies all artifacts |
| CORE-019 | IAA token cross-verification | IAA (internal) |
| CORE-023 | Workflow integrity ripple check | IAA (checks existing workflows not broken) |
| A-001 | IAA invocation evidence present | This pre-brief IS the evidence |
| A-002 | No class exceptions (all agents subject to IAA) | IAA enforces |
| A-021 | Working tree clean before IAA invocation | Producing agents must commit before invoking |
| A-026 | SCOPE_DECLARATION matches git diff exactly | Producing agents |
| A-033 | All artifact verification via `git ls-tree -r HEAD` | IAA verifies, not `ls` |

### CERT Gate Checks (Ceremony — Existence Only)

| Check ID | Check Name | Evidence Required |
|----------|-----------|------------------|
| CERT-001 | PREHANDOVER proof committed | `git ls-tree -r HEAD \| grep PREHANDOVER` |
| CERT-002 | Session memory committed | `git ls-tree -r HEAD \| grep session-` |
| CERT-003 | SCOPE_DECLARATION committed | `git ls-tree -r HEAD \| grep SCOPE_DECLARATION` |
| CERT-004 | IAA pre-brief committed | This artifact — `git ls-tree -r HEAD \| grep iaa-prebrief-cl-10` |
| OVL-INJ-001 | Pre-Brief artifact existence | This artifact committed before any builder task artifact |

### CI_WORKFLOW Overlay Checks (CL-10-D2 and CL-10-D3)

| Check ID | Check Name | Evidence Required |
|----------|-----------|------------------|
| OVL-CI-001 | Workflow policy correctness | Workflow logic matches stated policy (IAA reads the YAML) |
| OVL-CI-002 | Merge gate integrity | All existing gates remain present and non-weakened |
| OVL-CI-003 | Silent failure risk | No unguarded `continue-on-error`, exit codes checked |
| OVL-CI-004 | Environment parity | Consistent behaviour across contexts |
| OVL-CI-005 | CI evidence present (or S-033 exception invoked) | Run URL OR (actionlint + pattern parity + `workflow_dispatch`) |

### AAWP_MAT Overlay Checks (CL-10-D1)

| Check ID | Check Name | Evidence Required |
|----------|-----------|------------------|
| OVL-AAWP-* | Test quality, RED gate confirmation, test file committed | Test run output showing FAIL; test content correct |
| RED Gate sequencing | D1 committed FAILING before D2/D3 | `git log --date-order` showing D1 commit precedes workflow commits |

### Wave-Specific FFA Checks (Declared Now)

| Check ID | Check Name | Basis |
|----------|-----------|-------|
| CL10-FFA-001 | RED gate sequencing | D1 commit timestamp PRECEDES any D2/D3 workflow commit. Verified via `git log`. Failure = REJECTION-PACKAGE. |
| CL10-FFA-002 | Direct import pattern completeness | D2 workflow catches BOTH `import { OpenAI }` AND `import Anthropic` (at minimum). Underscan = REJECTION-PACKAGE. |
| CL10-FFA-003 | Exclusion correctness | D2 workflow explicitly excludes `maturion-maturity-legacy`. Missing exclusion = REJECTION-PACKAGE. |
| CL10-FFA-004 | Scope completeness | D2 workflow scans BOTH `modules/` AND `apps/`. Partial scope = REJECTION-PACKAGE. |
| CL10-FFA-005 | Stub pattern GREEN state | Current codebase must contain ZERO `expect(true).toBe(true)` instances before D3 enforcement activates. IAA will grep independently. Violations found without resolution plan = REJECTION-PACKAGE. |
| CL10-FFA-006 | Existing provider-model-ban.yml not weakened | CL-10-D2 is additive — it must not replace, narrow, or weaken the existing `provider-model-ban.yml` workflow. IAA will compare before/after. |
| CL10-FFA-007 | S-002 registry cross-check | IAA will confirm S-002 is listed in the CEP §8 gap table AND that D3 implementation references it. Untraced implementation = REJECTION-PACKAGE. |

---

## Step 0.6 — PREHANDOVER Proof Structure Required

Producing agents MUST provide the following PREHANDOVER structure. IAA will check each field
exists and is non-empty via `git ls-tree -r HEAD` before issuing any verdict.

### From qa-builder (CL-10-D1 PREHANDOVER)

```yaml
prehandover_artifact: .agent-workspace/qa-builder/memory/PREHANDOVER-session-cl10-d1-YYYYMMDD.md

required_fields:
  - wave: CL-10
  - deliverable: CL-10-D1
  - task_id: CL-10-D1
  - red_gate_evidence:
      test_file_path: <committed path to test file>
      test_run_output: |
        <output showing test FAILS before CI workflow exists>
      commit_sha: <SHA of the D1 test commit — BEFORE any workflow commit>
  - scope_declaration:
      files_added: [<list of all added test files>]
      files_modified: [<list, or "none">]
  - session_memory_path: .agent-workspace/qa-builder/memory/session-cl10-d1-YYYYMMDD.md
  - iaa_audit_token: PENDING (expected reference format per A-029)
  - working_tree_clean_at_invocation: true
```

**IAA will verify**:
1. `git ls-tree -r HEAD | grep PREHANDOVER-session-cl10-d1` returns a blob entry
2. `red_gate_evidence.commit_sha` precedes any workflow file commit SHA in `git log`
3. Test file itself exists at the declared path in git tree
4. Test output confirms FAIL state (not a passing test being called "RED")

---

### From integration-builder (CL-10-D2 + CL-10-D3 PREHANDOVER)

```yaml
prehandover_artifact: .agent-workspace/integration-builder/memory/PREHANDOVER-session-cl10-d2d3-YYYYMMDD.md

required_fields:
  - wave: CL-10
  - deliverables: [CL-10-D2, CL-10-D3]
  - d2_workflow:
      path: .github/workflows/<workflow-name>.yml
      policy_implemented: "Detect direct provider import patterns (import { OpenAI }, import Anthropic) in modules/ and apps/ excluding maturion-maturity-legacy"
      resolves: [GOV-001, GOV-002, T-C-010]
      actionlint_output: <clean output — no errors>
      green_evidence: <CI run URL OR S-033 exception with all 3 substitutes documented>
      pattern_tested_red: <evidence that the pattern catches a violating input>
      exclusion_confirmed: "maturion-maturity-legacy explicitly excluded"
  - d3_workflow:
      path: .github/workflows/<workflow-name>.yml
      policy_implemented: "Detect expect(true).toBe(true) stub patterns anywhere in test suite"
      resolves: [S-002]
      actionlint_output: <clean output — no errors>
      green_evidence: <CI run URL OR S-033 exception>
      green_state_baseline: <grep output showing zero violations in current codebase>
      pattern_tested_red: <evidence that the pattern catches stub input>
  - scope_declaration:
      files_added: [<all workflow files added>]
      files_modified: [<any existing workflow files modified, or "none">]
      files_deleted: ["none"]
  - existing_gates_not_weakened: true
  - provider_model_ban_yml_unchanged: true  # or: "modified — change described"
  - session_memory_path: .agent-workspace/integration-builder/memory/session-cl10-d2d3-YYYYMMDD.md
  - iaa_audit_token: PENDING (expected reference format per A-029)
  - working_tree_clean_at_invocation: true
```

**IAA will verify**:
1. `git ls-tree -r HEAD | grep PREHANDOVER-session-cl10-d2d3` returns a blob entry
2. Both workflow YAML files exist at declared paths in git tree
3. `actionlint` or `yamllint` evidence is present (not claimed — IAA will also run it locally)
4. D2 workflow: grep pattern covers `import { OpenAI }` AND `import Anthropic`
5. D2 workflow: `maturion-maturity-legacy` excluded via path expression
6. D2 workflow: scans `modules/` AND `apps/`
7. D3 workflow: `expect(true).toBe(true)` pattern is correct (not over-broad, not under-specific)
8. D3: independent `grep -rn 'expect(true).toBe(true)'` on current codebase confirms GREEN baseline
9. `provider-model-ban.yml` not weakened (IAA will diff before/after)

---

## Step 0.7 — Scope Blockers and Governance Conflicts

### Blocker Assessment

| Blocker ID | Description | Status | Resolution |
|-----------|-------------|--------|------------|
| B-001 | **Entry gate CL-4** — CEP specifies CL-4 must be CLOSED before CL-10 begins. | ✅ CLEAR | CL-4 is confirmed CLOSED in CEP §14 workstream table. Direct import scan baseline is established. Entry gate is met. |
| B-002 | **Existing `provider-model-ban.yml`** — A workflow already exists at `.github/workflows/provider-model-ban.yml` that detects banned provider model *strings* (e.g., `gpt-4o`, `claude-3`). CL-10-D2 adds a different check for provider *import patterns* (`import { OpenAI }`). | ⚠️ ADVISORY | These are complementary, not duplicating. D2 MUST NOT replace or narrow `provider-model-ban.yml`. IAA will verify both are present and non-weakened at handover. Integration-builder MUST acknowledge this explicitly in their PREHANDOVER proof field `provider_model_ban_yml_unchanged`. |
| B-003 | **S-002 is not yet in IAA FAIL-ONLY-ONCE.md** — S-002 is listed in the CEP §8 gap table as a FAIL-ONLY-ONCE rule pending CI enforcement. It does NOT appear in `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` under a `## S-002` heading. | ⚠️ ADVISORY | S-002 resolution via CL-10-D3 is sufficient for the CEP exit criterion. IAA will cross-check that D3 correctly references S-002. However, after D3 merges, a follow-up FAIL-ONLY-ONCE registry update to formally add `## S-002` to the IAA knowledge registry would constitute best practice. This is not a blocker for CL-10 handover. |
| B-004 | **Stub baseline state** — If `expect(true).toBe(true)` already exists in the test suite at wave-start, CL-10-D3 cannot be shipped as an immediately-enforcing gate without first resolving those violations. | ⚠️ ADVISORY — requires verification at handover | qa-builder or integration-builder MUST provide a `grep` baseline scan confirming zero violations before D3 is submitted. If violations are found, a remediation plan must be included and the gate must either: (a) be shipped with those violations resolved first, or (b) include a documented timeline with violation count declared. IAA will independently grep. |
| B-005 | **No open REJECTION-PACKAGEs** on this branch from prior IAA sessions. | ✅ CLEAR | Branch is new (`copilot/cl-10-routing-governance-ci-enforcement`), initial commit only. No prior rejections to resolve. |
| B-006 | **CS2 Checkpoint CP-10** — CEP specifies CS2 reviews CI check implementation QP verdict (CP-10) after CL-10 closes. | ℹ️ FOR CS2 NOTE | IAA's ASSURANCE-TOKEN at handover is a prerequisite for CP-10 but does not substitute for it. CS2 must still review and close CP-10 before CL-12/CL-13 module integration begins. |

### Governance Conflict Assessment

| Conflict ID | Description | Verdict |
|-------------|-------------|---------|
| GC-001 | CL-10 runs parallel with CL-6 and CL-7 per CS2 authorization (#1221 Item 5). This is an unconventional parallel wave execution. | NO CONFLICT — explicitly CS2-authorized. IAA notes that CL-12/CL-13 module integration has a declared dependency on CL-10 being CLOSED. This is a planning dependency, not a governance conflict. |
| GC-002 | CL-10-D2 adds a new import-detection workflow. The existing `provider-model-ban.yml` already bans model *strings* (GRS-016 partial enforcement). The new D2 workflow bans import *statements* (GRS-016 full enforcement). | NO CONFLICT — complementary enforcement layers. Both must coexist. |
| GC-003 | FAIL-ONLY-ONCE S-002 references "Stub detection CI check" as a gap to be resolved. The CEP maps it to CL-10-D3. | NO CONFLICT — CL-10-D3 is the designated resolution mechanism. The only risk is that S-002 in the CEP describes it as a FAIL-ONLY-ONCE rule, not a test result — integration-builder must ensure D3 references GOV resolution correctly. |

---

## Step 0.8 — Adoption Phase and IAA Status

**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Verdicts at handover**: BLOCKING (not advisory)
**Authority**: CS2 only (@APGI-cmy)

This pre-brief is a **read-only** artifact post-commit per §4.3b. It will not be modified after
commit. IAA's ASSURANCE-TOKEN or REJECTION-PACKAGE at handover will be written to a separate
token file: `.agent-admin/assurance/iaa-token-session-cl10-<date>.md`

---

## Summary Table

| Deliverable | Category | IAA Required | Key Specific Rule | PREHANDOVER Producing Agent |
|------------|---------|-------------|------------------|---------------------------|
| CL-10-D1 (RED gate test) | AAWP_MAT | YES — MANDATORY | D1 commit MUST precede D2/D3 workflow commits (CL10-FFA-001) | qa-builder |
| CL-10-D2 (provider import CI) | CI_WORKFLOW | YES — MANDATORY | Pattern must cover OpenAI AND Anthropic; both modules/ AND apps/; exclude maturion-maturity-legacy (CL10-FFA-002/003/004) | integration-builder |
| CL-10-D3 (stub detection CI) | CI_WORKFLOW | YES — MANDATORY | Baseline must be GREEN; S-002 reference present; pattern correctness verified (CL10-FFA-005/007) | integration-builder |
| Wave ceremony | CANON_GOVERNANCE | YES — MANDATORY | CERT-001 through CERT-004; OVL-INJ-001 | foreman-v2-agent (wave orchestration) |

**Total qualifying tasks**: 3 deliverables + ceremony = FULLY QUALIFYING  
**IAA trigger activated**: YES — CI_WORKFLOW (primary) + AAWP_MAT  
**STOP-AND-FIX mandate**: ACTIVE for this wave's handover

---

*End of IAA Pre-Brief — Wave CL-10*
*Authority: CS2 (Johan Ras / @APGI-cmy)*
*Pre-Brief committed by: independent-assurance-agent*
*Next action: IAA awaits PREHANDOVER submissions from qa-builder (D1) and integration-builder (D2+D3)*
