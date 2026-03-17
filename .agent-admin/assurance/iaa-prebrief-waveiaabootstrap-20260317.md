# IAA Pre-Brief Artifact — Wave: maturion-iaa-bootstrap

**Artifact Type**: IAA_PRE_BRIEF
**Wave**: maturion-iaa-bootstrap
**Issue**: maturion-isms#1124 — Adopt standardized Maturion agent bootstrap workflow
**Branch**: copilot/fix-1124-maturion-iaa-bootstrap (declared) / copilot/adopt-standardized-bootstrap-workflow (actual working branch)
**Date**: 2026-03-17
**IAA Version**: 6.2.0
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Status**: PRE-BRIEF COMPLETE

---

## Step 0.1 — Invocation Mode Confirmed

This session was triggered by a direct PRE-BRIEF request from CS2 via agent task invocation.
Mode: **PRE-BRIEF ONLY** — Phase 1–4 assurance is NOT executed in this session.
This Pre-Brief declares IAA's expectations for the handover assurance invocation that follows
after the builder agent completes the deliverables.

---

## Step 0.2 — Wave Summary (from issue context + wave-current-tasks.md)

The wave-current-tasks.md on this branch reflects a prior wave (Wave Node/CLI Ripple). This
Pre-Brief is for the **new** wave initiated by issue #1124, which is separate from and does
not inherit the prior wave's status.

**Wave objective**: Adopt a standardized Maturion agent bootstrap workflow. Replace four
DISABLED legacy injection workflows with a single, comment-triggered `maturion-iaa-bootstrap.yml`
workflow. Add container runner scaffolding and a stub agent runner script. Use
`MATURION_BOT_TOKEN` for artifact commit pushes. Restrict write scope to
`.agent-admin/assurance/**` and `.agent-workspace/**`.

**Scope boundaries (confirmed from issue)**:
- IN SCOPE: `.github/workflows/`, `.github/scripts/`, `.github/runner/` (new directory)
- OUT OF SCOPE: `.github/agents/` (no agent contract modifications), `governance/canon/`
- Producing agent: Copilot coding agent (builder class)
- No CANON_INVENTORY changes declared

---

## Step 0.3 — Task Classification

### Declared Tasks

| Task ID | Task Summary | Qualifying? | IAA Trigger Category |
|---------|-------------|-------------|----------------------|
| T-IAB-001 | Create `.github/workflows/maturion-iaa-bootstrap.yml` (comment-triggered, MATURION_BOT_TOKEN, restricted write scope) | ✅ YES | CI_WORKFLOW |
| T-IAB-002 | Provide stub agent runner script (`.github/scripts/` or `.github/runner/`) | ✅ YES | CI_WORKFLOW (infrastructure for the workflow) |
| T-IAB-003 | Remove or refactor four DISABLED legacy workflows: `agent-bootstrap-inject.yml`, `iaa-prebrief-inject.yml`, `iaa-prebrief-gate.yml`, `injection-audit-report.yml` | ✅ YES | CI_WORKFLOW |
| T-IAB-004 | Add container runner scaffolding directory (`.github/runner/`) | ✅ YES | CI_WORKFLOW (scaffolding supports workflow execution) |
| T-IAB-005 | Wire MATURION_BOT_TOKEN for artifact commit pushes (secrets config + workflow step) | ✅ YES | CI_WORKFLOW |
| T-IAB-006 | Restrict write permissions to `.agent-admin/assurance/**` and `.agent-workspace/**` | ✅ YES | CI_WORKFLOW |

**Classification result**: All tasks are qualifying. Single category: **CI_WORKFLOW — MANDATORY**.

**AMBIGUITY CHECK**: No ambiguity. No `.github/agents/` files are being modified. No
`governance/canon/` files are being modified. The PRE_BRIEF_ASSURANCE overlay applies
alongside CI_WORKFLOW (this Pre-Brief artifact satisfies OVL-INJ-001).

---

## Step 0.4 — Pre-Brief Artifact: Full IAA Expectations at Handover

### Trigger Category Summary

| Category | Triggered | Reason |
|----------|-----------|--------|
| CI_WORKFLOW | ✅ YES — MANDATORY | PR modifies `.github/workflows/` files (creates new, removes/refactors four existing) |
| AGENT_CONTRACT | ❌ NO | No `.github/agents/` or `governance/agents/` files being modified per declared scope |
| CANON_GOVERNANCE | ❌ NO | No `governance/canon/` or `CANON_INVENTORY.json` changes declared |
| AAWP_MAT | ❌ NO | No AAWP/MAT path deliverables |
| AGENT_INTEGRITY | ❌ NO | No `governance/quality/agent-integrity/` changes |
| KNOWLEDGE_GOVERNANCE | ❌ NO | No `.agent-workspace/*/knowledge/` changes declared |
| PRE_BRIEF_ASSURANCE | ✅ YES — MANDATORY (alongside CI_WORKFLOW) | OVL-INJ-001: this artifact satisfies the Pre-Brief existence requirement |

---

### FFA Checks IAA Will Run at Handover

IAA declares the following checks will be executed at handover assurance. Builder agent
MUST ensure all pass before invoking IAA for Phase 2–4.

#### Core Invariants (applied to ALL PRs)

| Check ID | Name | What Builder Must Provide |
|----------|------|--------------------------|
| CORE-005 | Governance block present | Not applicable for CI_WORKFLOW — no agent contract YAML being modified. IAA will confirm no spurious governance files are touched. |
| CORE-007 | No placeholder content | No `STUB`, `TODO`, `FIXME`, `TBD`, or `placeholder` values in delivered artifacts. Stub runner script must be clearly labelled as intentional stub with explicit instructions, not a silent placeholder. |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof must reference an IAA audit token. Token will be created in this session at Step 4.3b. Pre-Brief artifact (this file) counts as evidence that IAA was engaged pre-wave. |
| CORE-014 | No class exemption claim | Builder must not claim CI_WORKFLOW is exempt from IAA. |
| CORE-015 | Session memory present | Session memory artifact must be on branch or referenced in PREHANDOVER proof. |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated IAA token file must exist at `.agent-admin/assurance/iaa-token-session-NNN-waveiaabootstrap-YYYYMMDD.md` **after** IAA runs. Builder should pre-populate `iaa_audit_token` field with expected reference. |
| CORE-017 | No `.github/agents/` modifications by unauthorized agent | Builder must confirm zero `.github/agents/` files are in the PR diff. Any such file = auto-REJECTION-PACKAGE. |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof + session memory + `iaa_audit_token` field + dedicated IAA token file: all must be present and non-empty. |
| CORE-019 | IAA token cross-verification | First-invocation exception applies (token file does not yet exist). IAA will create it. |
| CORE-020 | Zero partial pass rule | Any absent/unverifiable evidence = REJECTION-PACKAGE. No assumed passes. |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE. No soft-pass language. |

#### CI_WORKFLOW Category Overlay

| Check ID | Name | What Builder Must Provide |
|----------|------|--------------------------|
| OVL-CI-001 | Workflow policy correctness | `maturion-iaa-bootstrap.yml` must actually implement the stated policy: comment-triggered, correct agent dispatch, correct write-path restriction, correct secret wiring. Logic must match intent. |
| OVL-CI-002 | Merge gate integrity | No existing merge gate checks may be weakened or removed. AGCFPP-001 (`agent-contract-audit.yml`) must remain intact. |
| OVL-CI-003 | Silent failure risk | No unguarded `continue-on-error`, no swallowed exit codes, no missing error checks in any modified workflow. **IAA will read every step of every new workflow for this.** |
| OVL-CI-004 | Environment parity | New workflow must not behave differently across environments in undocumented ways. Token secret reference must be consistent. |
| OVL-CI-005 | CI evidence present | **Inherent Limitation Exception (S-033) will almost certainly apply** — the new workflow is comment-triggered and cannot be pre-run before merge. Builder must provide: (1) `actionlint`/`yamllint` output for new workflow, (2) pattern parity evidence against an approved equivalent workflow, (3) `workflow_dispatch` retained on new workflow for CS2 manual validation. PREHANDOVER must invoke S-033 explicitly with all three conditions documented. |

#### PRE_BRIEF_ASSURANCE Overlay

| Check ID | Name | Pass Condition |
|----------|------|---------------|
| OVL-INJ-001 | Pre-Brief Artifact Existence | ✅ THIS ARTIFACT satisfies OVL-INJ-001. It must be committed before any builder task artifact on this branch. Builder should not create any task artifacts before this Pre-Brief is committed. |

---

### PREHANDOVER Proof Structure Required

The builder agent's PREHANDOVER proof MUST contain the following sections. IAA will check
for each at handover. Missing section = REJECTION-PACKAGE.

```markdown
## Wave / Task Reference
- Wave: maturion-iaa-bootstrap
- Issue: maturion-isms#1124
- Branch: [working branch]
- Producing agent: [agent name and class]

## Scope Declaration
- Files created: [list each file in .github/workflows/, .github/scripts/, .github/runner/]
- Files modified: [list any existing workflows modified or removed]
- Files NOT touched: .github/agents/ (confirm zero agent contract modifications)
- CANON_INVENTORY.json: NOT modified (confirm)

## Deliverable Evidence

### T-IAB-001: maturion-iaa-bootstrap.yml
- [Brief description of trigger mechanism implemented]
- [Confirmation: MATURION_BOT_TOKEN wired for commit pushes]
- [Confirmation: write paths restricted to .agent-admin/assurance/** and .agent-workspace/**]

### T-IAB-002: Stub Agent Runner Script
- Path: [file path]
- [Confirmation: clearly labelled stub with usage instructions — NOT a silent placeholder]

### T-IAB-003: Legacy Workflow Disposal
For each of the four DISABLED workflows (agent-bootstrap-inject.yml, iaa-prebrief-inject.yml,
iaa-prebrief-gate.yml, injection-audit-report.yml):
- [Confirm: DELETED or REFACTORED — state which and why]
- [If refactored: describe the change and its purpose]

### T-IAB-004: Container Runner Scaffolding
- Directory created: .github/runner/
- [List scaffold files created and their purpose]

### T-IAB-005: MATURION_BOT_TOKEN
- [Confirm secret name used in workflow]
- [Confirm no secret value is hardcoded or logged]

### T-IAB-006: Write Path Restriction
- [Confirm paths-filter or permissions block restricts writes to declared paths]

## OVL-CI-005 Self-Referential Exception (S-033)
- Invoke: "This PR modifies comment-triggered workflows. OVL-CI-005 Inherent Limitation Exception (S-033) applies."
- Condition 1 (YAML validation): [actionlint or yamllint output — paste or reference]
- Condition 2 (Pattern parity): [comparison against approved equivalent workflow]
- Condition 3 (workflow_dispatch retained): [confirm workflow_dispatch trigger present on maturion-iaa-bootstrap.yml]

## Merge Gate Integrity Confirmation
- AGCFPP-001 (agent-contract-audit.yml): [PRESENT / UNMODIFIED]
- [List any other gate workflows and confirm status]

## IAA Invocation Evidence
- IAA Pre-Brief: .agent-admin/assurance/iaa-prebrief-waveiaabootstrap-20260317.md (THIS FILE — committed before builder tasks)
- IAA Audit Token (expected reference): IAA-session-waveiaabootstrap-YYYYMMDD-PASS

## Session Memory
- Session memory file: [path to session memory file on branch]
```

---

## Step 0.5 — Scope Blockers and Governance Conflicts (Visible Now)

### Blocker 1 — NONE: Legacy Workflow Disposal is Clean
The four DISABLED workflows (agent-bootstrap-inject.yml, iaa-prebrief-inject.yml,
iaa-prebrief-gate.yml, injection-audit-report.yml) are already disabled via `workflow_dispatch`
only, per Wave: disable-automatic-injections-and-reinforce-contract (issue #1061). Their
deletion or refactor does NOT require CANON_INVENTORY update and does NOT constitute an
AGENT_CONTRACT change. **No governance conflict.**

### Blocker 2 — ADVISORY: MATURION_BOT_TOKEN Secret Must Exist in Repository
The new workflow will reference `MATURION_BOT_TOKEN` as a repository or organisation secret.
If this secret is not provisioned in the repository secrets settings, the workflow will fail
silently or throw an auth error at the commit step. **IAA recommends the PREHANDOVER proof
include confirmation that the secret is provisioned (or a CS2 note that it will be provisioned
before the first workflow run).** This is an advisory notice at Pre-Brief stage — not a
blocker if the secret is provisioned before the workflow's first activation.

### Blocker 3 — ADVISORY: Self-Referential Workflow — OVL-CI-005 S-033 Compliance Required
The new `maturion-iaa-bootstrap.yml` is comment-triggered and cannot produce a CI run URL
before merge. The S-033 exception is the correct vehicle, but the builder must explicitly
invoke it in the PREHANDOVER proof with all three required conditions. If the PREHANDOVER
proof claims "CI passed" without meeting S-033 conditions → **REJECTION-PACKAGE at handover.**
Builder should plan for actionlint/yamllint validation as part of the build task.

### Blocker 4 — ADVISORY: No .github/agents/ Drift
The scope statement explicitly excludes `.github/agents/` modifications. IAA will check
CORE-017 (no unauthorized agent file modifications) via PR diff inspection. If any agent
contract file appears in the diff — even incidentally — IAA will issue REJECTION-PACKAGE
citing A-005 and A-013. Builder must confirm at PREHANDOVER that zero agent contract files
were touched.

### Blocker 5 — MONITORING: Four DISABLED Workflows May Be Referenced Elsewhere
Removing the four legacy workflows may break cross-references in:
- Documentation files that reference the workflow names
- Comments in other workflows referencing the injection pipeline
- The `iaa-category-overlays.md` which previously described the injection pipeline before the
  v3.4.0 rename to PRE_BRIEF_ASSURANCE

These are documentation/reference inconsistencies only — they do not constitute REJECTION-PACKAGE
triggers unless an active governance artifact contains a broken reference that creates a
functional gap. IAA will check for this during substantive review at handover.

---

## Summary — What Builder Agent Needs to Do

1. **Commit THIS Pre-Brief artifact first** before creating any task deliverables on the branch.
2. **Deliver all T-IAB-001 through T-IAB-006 tasks** as scoped.
3. **Run actionlint or yamllint** on the new workflow file and include output in PREHANDOVER.
4. **Invoke S-033 exception** in PREHANDOVER with all three conditions documented.
5. **Confirm zero .github/agents/ drift** in PREHANDOVER.
6. **Confirm MATURION_BOT_TOKEN** is provisioned or will be provisioned before first run.
7. **Write PREHANDOVER proof** following the structure declared above.
8. **Invoke IAA** for Phase 2–4 assurance at handover by tagging `@independent-assurance-agent`.

---

## Pre-Brief Status

```yaml
iaa_prebrief:
  wave: maturion-iaa-bootstrap
  issue: "maturion-isms#1124"
  branch: "copilot/fix-1124-maturion-iaa-bootstrap"
  date: "2026-03-17"
  status: COMPLETE
  primary_trigger_category: CI_WORKFLOW
  secondary_overlay: PRE_BRIEF_ASSURANCE
  qualifying_tasks: 6
  scope_blockers: 0
  advisories: 4
  iaa_required_at_handover: true
  adoption_phase: PHASE_B_BLOCKING
  pre_brief_artifact: ".agent-admin/assurance/iaa-prebrief-waveiaabootstrap-20260317.md"
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Agent**: independent-assurance-agent v6.2.0
**Contract**: 2.2.0
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE
