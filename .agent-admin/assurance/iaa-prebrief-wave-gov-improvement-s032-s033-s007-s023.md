# IAA Pre-Brief — Wave gov-improvement-s032-s033-s007-s023
# Governance Improvements: CI Token Pattern Fix, OVL-CI-005 Exception Documentation, POLC Boundary Machine Enforcement

**Artifact Type**: IAA Pre-Brief (Phase 0 output)
**Wave**: wave-gov-improvement-s032-s033-s007-s023
**Branch**: `copilot/implement-governance-improvements`
**IAA Session**: session-prebrief-wave-gov-improvement-s032-s033-s007-s023-20260310
**Date**: 2026-03-10
**IAA Agent Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Invocation Trigger**: CS2 re-alignment directive — pre-brief invoked retroactively after commit SHA 9172453
**Retroactive Ceremony**: YES — per INC-WCA-PREBRIEF-IMPL-001 corrective procedure and CS2 mandate
**CS2 Authorization**: Issue opened by @APGI-cmy, CS2 re-alignment directive issued on PR `copilot/implement-governance-improvements`
**Issue**: "Implement governance improvements: CI token pattern fix, OVL-CI-005 limitation documentation, POLC boundary machine enforcement (S-032, S-033, S-007/S-023)"
**Status**: ISSUED — Pre-Brief complete. Producing agent (foreman-v2-agent) must complete PREHANDOVER ceremony before invoking IAA for final verdict.
**Pre-Brief Phase Mode**: PHASE_B_BLOCKING (verdicts at handover are hard-blocking)

---

## PHASE 1 BOOTSTRAP ATTESTATION

> "I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Hard-gate merge blocker. Issues ASSURANCE-TOKEN or REJECTION-PACKAGE only. Binary verdict, no partial verdicts. No self-review. Mandatory for ALL agent contracts without exception. Ambiguity resolves to mandatory invocation.
> My class boundary: NOT a builder, foreman, or overseer. Does NOT write code, contracts, schemas, or implementation artifacts. Outputs: verification verdicts and Pre-Brief artifact only.
> STOP-AND-FIX mandate: ACTIVE. No class exceptions. Ambiguity resolves to mandatory invocation.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy).
>
> Tier 2 loaded. Knowledge version: 2.8.0. All 8 required files present.
> CANON_INVENTORY hash check: PASS (191 entries, 0 placeholder hashes).
> IAA canon: PRESENT — INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.4.0.
> FAIL-ONLY-ONCE registry: PRESENT (A-001 through A-032 active, next ID: A-033).
> Breach registry: CLEAR — no open breaches.
> Adoption phase: PHASE_B_BLOCKING.
>
> Independence check: IAA (independent-assurance-agent) did NOT produce any artifact in this PR.
> Producer: foreman-v2-agent. Independence requirement: SATISFIED."

---

## ⚠️ RETROACTIVE CEREMONY DECLARATION

**POLC Violation on Record**: foreman-v2-agent committed all wave artifacts (SHA 9172453) to branch
`copilot/implement-governance-improvements` BEFORE invoking IAA Pre-Brief, creating
`wave-current-tasks.md`, or completing Phase 1 preflight. This is a GOV-BREACH-AIMC-W5-002
class violation, seventh occurrence of pattern INC-WCA-PREBRIEF-IMPL-001 (same class as
INC-LDCS-PREBRIEF-IMPL-001 and all prior pre-brief-skip incidents).

**CS2 Re-Alignment Directive**: Received 2026-03-10 on PR `copilot/implement-governance-improvements`.
CS2 explicitly authorized retroactive governance ceremony. The committed changes are
technically correct per issue requirements. The violation is governance sequence only —
pre-brief was not issued before commit.

**Corrective Action In Progress**: This Pre-Brief is the corrective ceremony artifact.
FAIL-ONLY-ONCE A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION) was already added to
`foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v3.7.0 as part of the committed changes (T-GOV-004).

**Effect on Handover**: Retroactive pre-brief does NOT relax any PREHANDOVER requirements.
All handover checks apply with full Phase_B_Blocking force. The PREHANDOVER proof MUST
explicitly acknowledge the retroactive ceremony and cite this artifact's path.

---

## ⚠️ SELF-REFERENTIAL REVIEW NOTICE

This PR modifies IAA's own Tier 2 knowledge files:
- `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` (v3.3.0 — T-GOV-002)
- `.agent-workspace/independent-assurance-agent/knowledge/index.md` (v2.8.0 — version bump)

IAA is being asked to assure a change to rules IAA itself loads and executes at every invocation.

**Independence confirmation**: foreman-v2-agent produced all content in this PR.
IAA (independent-assurance-agent) contributed nothing. Independence requirement: **SATISFIED**.

**Special review obligation at handover**: Because the change modifies IAA's own operational
rules (OVL-CI-005 Inherent Limitation Exception), IAA will apply heightened scrutiny to
verify the exception clause does not introduce any softening path that an agent could exploit
to circumvent OVL-CI-005 without satisfying all three required substitutes.

---

## Wave Scope Classification

### Files Changed (SHA 9172453 — verified via `git show --name-only HEAD`)

| File | Task | IAA Trigger Category | Qualifying? |
|------|------|---------------------|-------------|
| `.github/workflows/agent-contract-audit.yml` | T-GOV-001 (S-032) | CI_WORKFLOW | ✅ YES |
| `.github/workflows/polc-boundary-gate.yml` | T-GOV-003 (S-007/S-023) | CI_WORKFLOW | ✅ YES |
| `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | T-GOV-002 (S-033) | KNOWLEDGE_GOVERNANCE | ✅ YES |
| `.agent-workspace/independent-assurance-agent/knowledge/index.md` | T-GOV-002 (version bump) | KNOWLEDGE_GOVERNANCE | ✅ YES |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | T-GOV-004 | KNOWLEDGE_GOVERNANCE | ✅ YES |
| `.agent-admin/assurance/gov-improvement-s032-s033-s007-s023-20260310.md` | Evidence artifact | IAA ceremony (not separately triggering) | COVERED BY WAVE |

**Overall PR Classification**: **MIXED — CI_WORKFLOW + KNOWLEDGE_GOVERNANCE**
**All tasks**: QUALIFYING — no EXEMPT tasks in this wave.
**IAA Triggered at Handover**: **YES — MANDATORY (both categories trigger independently)**
**Phases Required at Handover**: Phase 1 (Preflight) + Phase 2 (Alignment) + Phase 3 (Assurance) + Phase 4 (Verdict & Handover)

---

## Qualifying Task Pre-Brief Entries

---

### T-GOV-001 — S-032: CI Token File Pattern Fix

| Field | Value |
|-------|-------|
| `task_id` | T-GOV-001 |
| `task_summary` | Fix `agent-contract-audit.yml` Check 1 token search pattern to match both `iaa-token-session-*.md` (canonical IAA output) and `assurance-token-*.md` (legacy format), resolving false-negative CI failures when IAA ceremony produces `iaa-token-session-*.md` files |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Phase 1 + Phase 2 + Phase 3 (overlay) + Phase 4 (verdict) |
| `required_evidence_artifacts` | (1) YAML syntax validation output for `.github/workflows/agent-contract-audit.yml`; (2) pattern parity evidence — excerpt of updated `find` command showing both `-name "iaa-token-session-*.md"` and `-name "assurance-token-*.md"` patterns; (3) OVL-CI-005 Inherent Limitation Exception invocation (workflow fires post-merge, not on PR branch changes); (4) `workflow_dispatch` retention confirmed |
| `applicable_overlays` | OVL-CI-001, OVL-CI-002, OVL-CI-003, OVL-CI-004, OVL-CI-005 (Inherent Limitation Exception) |
| `specific_rules` | **OVL-CI-001**: Verify the token search logic actually covers both file name formats without introducing a false-positive OR false-negative path. **OVL-CI-003**: Verify no silent failure path exists (e.g., unguarded `continue-on-error`, missing exit-code propagation). **OVL-CI-005 exception**: Self-referential workflow — this workflow fires on PR-to-main events, NOT on changes to workflow files in a PR branch. Full pre-merge CI run of the *modified* workflow is physically impossible. Exception applies if all three substitutes are provided: (1) YAML validation, (2) pattern parity, (3) `workflow_dispatch` confirmed. |

---

### T-GOV-002 — S-033: OVL-CI-005 Inherent Limitation Exception Documentation

| Field | Value |
|-------|-------|
| `task_id` | T-GOV-002 |
| `task_summary` | Document OVL-CI-005 "Inherent Limitation Exception" in `iaa-category-overlays.md` v3.3.0: self-referential workflow PRs where modified workflow's trigger path is orthogonal to PR file paths may satisfy OVL-CI-005 via three required substitutes (YAML validation, pattern parity, `workflow_dispatch` retention) rather than a live CI run evidence |
| `iaa_trigger_category` | KNOWLEDGE_GOVERNANCE |
| `required_phases` | Phase 1 + Phase 2 + Phase 3 (overlay) + Phase 4 (verdict) |
| `required_evidence_artifacts` | (1) `iaa-category-overlays.md` version bumped to v3.3.0 (OVL-KG-ADM-002); (2) `index.md` updated to reflect v3.3.0 for `iaa-category-overlays.md` (OVL-KG-ADM-003); (3) PREHANDOVER ceremony complete (OVL-KG-ADM-001) |
| `applicable_overlays` | OVL-KG-001, OVL-KG-002, OVL-KG-003, OVL-KG-004, OVL-KG-ADM-001, OVL-KG-ADM-002, OVL-KG-ADM-003 |
| `specific_rules` | **OVL-KG-001 (Rule clarity)**: IAA will verify the three substitute conditions (YAML validation, pattern parity, `workflow_dispatch` retention) are stated unambiguously. A vague exception = a loophole. Any clause that an agent could interpret as "CI evidence optional" without fully satisfying all three substitutes must be tightened. **OVL-KG-002 (Real incident)**: Exception is grounded in real incident — self-referential PRs (e.g., POLC boundary gate, agent-contract-audit) cannot produce pre-merge CI run evidence for the modified workflow. Traceability: present. **OVL-KG-003 (No duplication)**: Verify no existing exception clause in the overlays duplicates this. **OVL-KG-004 (Cross-references)**: Verify all file references (e.g., `iaa-category-overlays.md` section references, index.md version numbers) are accurate and consistent. |

---

### T-GOV-003 — S-007/S-023: POLC Boundary Gate Refactor

| Field | Value |
|-------|-------|
| `task_id` | T-GOV-003 |
| `task_summary` | Refactor `.github/workflows/polc-boundary-gate.yml` from a single monolithic job into 3 separate named jobs: `foreman-implementation-check` (S-007 HARD FAIL gate), `builder-involvement-check` (includes S-023 pre-brief existence gate), `session-memory-check`. Job names must match `merge_gate_interface.required_checks` in the foreman-v2-agent contract exactly |
| `iaa_trigger_category` | CI_WORKFLOW |
| `required_phases` | Phase 1 + Phase 2 + Phase 3 (overlay) + Phase 4 (verdict) |
| `required_evidence_artifacts` | (1) YAML syntax validation output for `.github/workflows/polc-boundary-gate.yml`; (2) Job name parity evidence — list all 3 job names from workflow vs. foreman contract `required_checks` (must match exactly: `POLC Boundary Validation / foreman-implementation-check`, `POLC Boundary Validation / builder-involvement-check`, `POLC Boundary Validation / session-memory-check`); (3) OVL-CI-005 Inherent Limitation Exception invocation (polc-boundary-gate fires on PR/push events, not on its own modification); (4) `workflow_dispatch` confirmed retained; (5) S-023 pre-brief existence gate logic verified present in `builder-involvement-check` job |
| `applicable_overlays` | OVL-CI-001, OVL-CI-002, OVL-CI-003, OVL-CI-004, OVL-CI-005 (Inherent Limitation Exception) |
| `specific_rules` | **OVL-CI-001 (Policy correctness)**: IAA will verify that: (a) `foreman-implementation-check` correctly hard-fails on any commit authored by foreman-v2-agent touching implementation file paths; (b) `builder-involvement-check` verifies at minimum one builder agent was delegated AND a pre-brief artifact exists in `.agent-admin/assurance/`; (c) `session-memory-check` validates session memory presence. Each job must match its stated contract obligation. A job that claims to check X but actually checks Y = OVL-CI-001 FAIL. **OVL-CI-002 (Merge gate integrity)**: All 3 gate jobs must be hard-fail (no `continue-on-error`, no `if: always()` bypass). **OVL-CI-003 (Silent failure)**: Each job's exit codes must propagate correctly. Spot-check for unguarded `|| true` or `exit 0` patterns that silence real failures. **OVL-CI-005 exception**: Same self-referential rationale as T-GOV-001. This workflow fires on PR events, not on modifications to itself — pre-merge CI run of the *refactored* workflow is not producible before merge. Exception applies if all three substitutes are satisfied. |

---

### T-GOV-004 — FAIL-ONLY-ONCE Registry Update (foreman-v2)

| Field | Value |
|-------|-------|
| `task_id` | T-GOV-004 |
| `task_summary` | Update `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` to v3.7.0: mark S-007, S-023, S-032, S-033 as REMEDIATED; add A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION) rule codifying that no wave size threshold exempts from mandatory pre-brief + governance sequence |
| `iaa_trigger_category` | KNOWLEDGE_GOVERNANCE |
| `required_phases` | Phase 1 + Phase 2 + Phase 3 (overlay) + Phase 4 (verdict) |
| `required_evidence_artifacts` | (1) `foreman-v2/knowledge/FAIL-ONLY-ONCE.md` version confirmed at v3.7.0; (2) S-007, S-023, S-032, S-033 rows confirmed REMEDIATED status; (3) A-033 rule present and clearly stated; (4) Cross-references in A-033 to INC-WCA-PREBRIEF-IMPL-001 and S-007/S-023 are accurate |
| `applicable_overlays` | OVL-KG-001, OVL-KG-002, OVL-KG-003, OVL-KG-004, OVL-KG-ADM-001, OVL-KG-ADM-002 |
| `specific_rules` | **OVL-KG-002 (Real incident traceability)**: A-033 must be traceable to INC-WCA-PREBRIEF-IMPL-001 and the 7th-occurrence pattern. **OVL-KG-001 (Rule clarity)**: A-033 must define "complexity threshold" unambiguously — no agent should be able to claim a 1-file or 1-line change is below the governance threshold. **OVL-KG-004 (Cross-references)**: Verify the incident ID (INC-WCA-PREBRIEF-IMPL-001) and all S-register references (S-007, S-023, S-032, S-033) exist and are consistent with other governance artifacts. |

---

## FFA Checks IAA Will Run at Handover

### Core Invariant Checks (non-AGENT_CONTRACT scope — applies to ALL categories)

| Check ID | Check Name | Notes |
|----------|-----------|-------|
| CORE-005 | Governance block present | Applied to all changed knowledge/workflow files |
| CORE-006 | CANON_INVENTORY alignment | Verify no new canon files added without CANON_INVENTORY update |
| CORE-007 | No placeholder content | Scan for STUB/TODO/FIXME/TBD in all changed files |
| CORE-013 | IAA invocation evidence | PREHANDOVER must reference this pre-brief artifact |
| CORE-014 | No class exemption claim | Confirm no exemption claim for foreman class |
| CORE-015 | Session memory present | Session memory artifact for this wave must be on branch |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated token file at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` |
| CORE-017 | No unauthorized `.github/agents/` modifications | PR diff must NOT contain `.github/agents/` file changes |
| CORE-018 | Complete evidence artifact sweep | PREHANDOVER proof + session memory + IAA token reference all present and non-empty |
| CORE-019 | IAA token cross-verification | First invocation exception applies — token file created this session |
| CORE-020 | Zero partial pass rule | No assumed passes; absence of evidence = failing check |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE; no "minor/trivial/cosmetic" softening |

**CORE checks NOT applicable** (AGENT_CONTRACT-only): CORE-001 through CORE-004, CORE-008 through CORE-012, CORE-022.

---

### CI_WORKFLOW Overlay Checks (T-GOV-001, T-GOV-003)

| Check ID | Check Name | Applies To |
|----------|-----------|-----------|
| OVL-CI-001 | Workflow policy correctness | Both workflow files — logic must match stated intent |
| OVL-CI-002 | Merge gate integrity | Both workflow files — no gates removed or softened |
| OVL-CI-003 | Silent failure risk | Both workflow files — spot-check exit code propagation |
| OVL-CI-004 | Environment parity | Both workflow files — consistent behaviour across contexts |
| OVL-CI-005 | CI evidence present (Inherent Limitation Exception) | Both workflow files — self-referential exception must be explicitly invoked with all 3 substitutes; see §OVL-CI-005 Requirements below |

#### OVL-CI-005 Substitutes Required (Inherent Limitation Exception — S-033)

For **each** modified workflow file, the PREHANDOVER proof MUST include:

1. **YAML syntax validation evidence**: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/<file>.yml'))"` output — must show no syntax errors.
2. **Pattern parity evidence**: Structural comparison demonstrating the modified workflow is logically equivalent to or a refinement of an approved predecessor. For `agent-contract-audit.yml`: show the `find` command now includes both token patterns. For `polc-boundary-gate.yml`: show the 3 new job names and that each covers the same or expanded policy surface as the prior single job.
3. **`workflow_dispatch` retention**: Confirm `workflow_dispatch:` trigger is present in both modified workflow files to enable CS2 manual post-merge validation.

**PREHANDOVER must explicitly invoke the OVL-CI-005 Inherent Limitation Exception** for each workflow file by name, providing justification (self-referential — fires post-merge on `push` to `main`, not on PR branch modifications). A bare claim of "CI passed" without this explicit invocation = REJECTION-PACKAGE.

---

### KNOWLEDGE_GOVERNANCE Overlay Checks (T-GOV-002, T-GOV-004)

| Check ID | Check Name | Applies To |
|----------|-----------|-----------|
| OVL-KG-001 | Rule clarity | `iaa-category-overlays.md` OVL-CI-005 exception; `foreman FAIL-ONLY-ONCE.md` A-033 |
| OVL-KG-002 | Triggered by real incident | `foreman FAIL-ONLY-ONCE.md` A-033 traceable to INC-WCA-PREBRIEF-IMPL-001 |
| OVL-KG-003 | No duplication | `iaa-category-overlays.md` — verify OVL-CI-005 exception is not duplicated elsewhere |
| OVL-KG-004 | Cross-reference consistency | All file path references, rule IDs, incident IDs, and version numbers in changed knowledge files must exist and be accurate |
| OVL-KG-ADM-001 | PREHANDOVER ceremony complete | PREHANDOVER proof must be present on branch (FAIL-ONLY-ONCE A-015) |
| OVL-KG-ADM-002 | Knowledge version bumped | `iaa-category-overlays.md` must be at v3.3.0; `foreman FAIL-ONLY-ONCE.md` must be at v3.7.0 |
| OVL-KG-ADM-003 | index.md updated | `independent-assurance-agent/knowledge/index.md` must reflect v3.3.0 for `iaa-category-overlays.md` and version 2.8.0 for the index itself |

---

### FAIL-ONLY-ONCE Rules Explicitly Attest at Handover

| Rule | Relevance |
|------|-----------|
| A-001 | IAA invocation evidence — PREHANDOVER must reference this pre-brief artifact path |
| A-002 | No class exceptions — foreman class is NOT exempt |
| A-015 | Tier 2 knowledge patches require PREHANDOVER ceremony — applies to T-GOV-002 and T-GOV-004 |
| A-021 | Commit before invocation — violated in this wave (retroactive ceremony). A-021 is noted ON THE RECORD. PREHANDOVER must acknowledge A-021 violation explicitly |
| A-026 | SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly — must be present and accurate |
| A-029 | PREHANDOVER proof immutability §4.3b — PREHANDOVER must be committed before IAA invocation; IAA writes dedicated token file post-verdict; PREHANDOVER is READ-ONLY post-commit |
| A-031 | IAA ceremony artifacts (this pre-brief file) excluded from SCOPE_DECLARATION A-026 requirement when A-031 carve-out note is present |
| A-033 | NO-COMPLEXITY-THRESHOLD-EXEMPTION (new in T-GOV-004) — existence and quality check |

---

## Required PREHANDOVER Proof Structure

The PREHANDOVER proof submitted to IAA at handover MUST contain all of the following sections,
populated with actual evidence (no blank fields, no TBD/PENDING except the `iaa_audit_token`
field per A-029):

### Mandatory Sections

```
## Header
wave: wave-gov-improvement-s032-s033-s007-s023
session: session-gov-improvement-s032-s033-s007-s023-20260310
date: 2026-03-10
branch: copilot/implement-governance-improvements
producing_agent: foreman-v2-agent
pr_title: [exact PR title]
iaa_audit_token: IAA-session-prebrief-wave-gov-improvement-s032-s033-s007-s023-20260310-PASS
  # Pre-populated expected reference per A-029. IAA writes dedicated token file post-verdict.

## Retroactive Ceremony Acknowledgment
- Reference to CS2 re-alignment directive (date + PR)
- Acknowledgment of GOV-BREACH (POLC violation — pre-brief skipped)
- Confirmation that A-021 violation is on record (INC-WCA-PREBRIEF-IMPL-001)
- Path to this pre-brief artifact: .agent-admin/assurance/iaa-prebrief-wave-gov-improvement-s032-s033-s007-s023.md

## SCOPE_DECLARATION Compliance (A-026)
- Confirm SCOPE_DECLARATION.md is present on branch
- Confirm it matches git diff --name-only origin/main...HEAD (list exact files)
- Confirm A-031 carve-out note is present (IAA ceremony artifacts excluded from diff comparison)

## T-GOV-001: S-032 Evidence (agent-contract-audit.yml)
- YAML syntax validation: [command output — must show PASS, no syntax errors]
- Pattern parity: [excerpt of updated find command showing both -name patterns]
- OVL-CI-005 Inherent Limitation Exception invocation:
  "Invoking OVL-CI-005 Inherent Limitation Exception for agent-contract-audit.yml.
   Justification: This workflow fires on pull_request to main and push to main — it does NOT
   fire on modifications to the workflow file itself in a PR branch. A pre-merge CI run of the
   modified workflow is physically impossible. Substitutes satisfied: (1) YAML validation PASS,
   (2) pattern parity — find command excerpt shows iaa-token-session-*.md AND assurance-token-*.md,
   (3) workflow_dispatch trigger: [CONFIRMED/line number]"
- workflow_dispatch confirmed: [line number in workflow file]

## T-GOV-002: S-033 Evidence (iaa-category-overlays.md + index.md)
- iaa-category-overlays.md version: [must be v3.3.0]
- OVL-CI-005 exception clause present: [YES — cite section heading]
- Three substitutes enumerated clearly: [YES/NO with brief description]
- Retroactive incident acceptance policy present: [YES/NO]
- index.md version: [must be v2.8.0 with correct iaa-category-overlays.md entry]
- OVL-KG cross-reference check: [all file path references verified accurate]

## T-GOV-003: S-007/S-023 Evidence (polc-boundary-gate.yml)
- YAML syntax validation: [command output — must show PASS, no syntax errors]
- Job name parity table:
  | Foreman Contract required_check | Workflow Job Name | Match? |
  |--------------------------------|-------------------|--------|
  | POLC Boundary Validation / foreman-implementation-check | foreman-implementation-check | ✅/❌ |
  | POLC Boundary Validation / builder-involvement-check | builder-involvement-check | ✅/❌ |
  | POLC Boundary Validation / session-memory-check | session-memory-check | ✅/❌ |
- S-023 pre-brief gate present in builder-involvement-check: [YES — cite logic]
- OVL-CI-005 Inherent Limitation Exception invocation:
  "Invoking OVL-CI-005 Inherent Limitation Exception for polc-boundary-gate.yml.
   Justification: This workflow fires on pull_request events — it does NOT fire on modifications
   to itself in a PR branch. Pre-merge CI run of the refactored jobs is physically impossible.
   Substitutes satisfied: (1) YAML validation PASS, (2) pattern parity — 3 new jobs cover the
   same/expanded policy surface as prior single job [excerpt], (3) workflow_dispatch: [CONFIRMED/line number]"
- workflow_dispatch confirmed: [line number in workflow file]

## T-GOV-004: FAIL-ONLY-ONCE v3.7.0 Evidence
- foreman-v2 FAIL-ONLY-ONCE.md version: [must be v3.7.0]
- S-032 status: REMEDIATED — [confirmed present]
- S-033 status: REMEDIATED — [confirmed present]
- S-007 status: REMEDIATED — [confirmed present]
- S-023 status: REMEDIATED — [confirmed present]
- A-033 rule present: [YES — cite rule text summary]
- A-033 incident traceability: INC-WCA-PREBRIEF-IMPL-001 [confirmed]

## Evidence Artifact
- gov-improvement-s032-s033-s007-s023-20260310.md: [PRESENT — path confirmed]

## Session Memory
- session_memory_path: .agent-workspace/independent-assurance-agent/memory/session-XXX-[wave]-YYYYMMDD.md
  # OR foreman session memory — must be present on branch

## CORE-017 Confirmation
- git diff --name-only HEAD confirms NO .github/agents/ files modified: [YES — verified]
```

**CRITICAL**: The `iaa_audit_token` field MUST be pre-populated with the expected reference
format `IAA-session-prebrief-wave-gov-improvement-s032-s033-s007-s023-20260310-PASS` per A-029.
Do NOT leave it blank or as `PENDING` — that triggers CORE-007 FAIL.

---

## Scope Blockers and Governance Conflicts

### SB-001 — Retroactive Pre-Brief (Pre-Existing POLC Violation)

**Type**: Governance sequence violation (not a blocking stopper for this wave)
**Severity**: MAJOR (GOV-BREACH class)
**Status**: ACKNOWLEDGED — corrective ceremony in progress
**Description**: foreman-v2-agent committed all wave artifacts before invoking IAA Pre-Brief.
This is the seventh occurrence of INC-WCA-PREBRIEF-IMPL-001 class pattern.
**Resolution**: A-033 added to foreman FAIL-ONLY-ONCE. Retroactive ceremony authorized by CS2.
Wave may proceed under CS2 explicit mandate. The retroactive ceremony does NOT relax
any handover requirement — full PHASE_B_BLOCKING force applies.
**A-021 Implication**: PREHANDOVER proof MUST acknowledge A-021 violation explicitly by name.

---

### SB-002 — OVL-CI-005 Substitute Completeness (Hard Requirement for Both Workflows)

**Type**: Anticipated handover risk (not a current stopper — preventive declaration)
**Severity**: REJECTION-PACKAGE risk if not satisfied
**Description**: Both `.github/workflows/agent-contract-audit.yml` and `.github/workflows/polc-boundary-gate.yml`
are self-referential workflows — they fire post-merge on `push`/`pull_request` events,
not on their own modification in a PR branch. OVL-CI-005 Inherent Limitation Exception
applies to both, but the PREHANDOVER proof MUST explicitly invoke the exception for EACH
workflow file separately, and MUST provide all three substitutes for EACH.

**Risk**: A PREHANDOVER proof that groups both workflows under a single exception invocation
without per-workflow evidence will fail OVL-CI-005. IAA will require per-workflow evidence.

**Pre-emptive action for foreman**: Provide separate exception invocations for each workflow
(see PREHANDOVER structure above). Do NOT use a single combined "both workflows" invocation.

---

### SB-003 — Self-Referential IAA Knowledge Modification

**Type**: Independence boundary notice (not a blocker)
**Status**: RESOLVED — independence confirmed
**Description**: T-GOV-002 modifies IAA's own Tier 2 knowledge file (`iaa-category-overlays.md`).
This means IAA is assuring a change to its own operational rules.
**Resolution**: Producer is foreman-v2-agent — IAA did not contribute to these changes.
Independence requirement is satisfied. However, IAA will apply heightened scrutiny to the
OVL-CI-005 exception clause wording (OVL-KG-001) to ensure no softening loophole exists.

---

### SB-004 — FAIL-ONLY-ONCE A-033 IAA-Side Registration (Advisory)

**Type**: Advisory — IAA self-governance action recommended
**Severity**: Low (IAA administrative)
**Description**: A-033 (NO-COMPLEXITY-THRESHOLD-EXEMPTION) was added to the **foreman-v2**
FAIL-ONLY-ONCE registry (T-GOV-004). The same learning may warrant a complementary entry
in **IAA's own** FAIL-ONLY-ONCE registry if the pattern is relevant to IAA's own invocation
behaviour (e.g., IAA must not allow a producing agent to claim "small wave = no pre-brief needed"
as a reason to skip A-001/A-002 checks). IAA will evaluate at handover whether a
corresponding IAA-side rule addition is warranted. This does NOT block the wave.

---

### SB-005 — SCOPE_DECLARATION.md Must Be Present and Accurate (A-026)

**Type**: REJECTION-PACKAGE risk if absent
**Description**: A-026 requires SCOPE_DECLARATION.md to match `git diff --name-only origin/main...HEAD`
exactly. This file was not listed in the wave-current-tasks.md task register as a deliverable.
IAA will check for its presence and accuracy at handover.
**Pre-emptive action for foreman**: Ensure SCOPE_DECLARATION.md is present on branch and
lists all 6 changed files. Include A-031 carve-out note for IAA ceremony artifacts (this
pre-brief file and any IAA token file written post-verdict). SCOPE_DECLARATION.md must use
list format per A-028.

---

## Pre-Brief Verdict

> **Status: ISSUED**
>
> All 5 qualifying tasks classified. All trigger categories declared. All FFA checks enumerated.
> PREHANDOVER proof structure declared. Scope blockers SB-001 through SB-005 documented.
>
> Foreman-v2-agent may proceed to complete the PREHANDOVER ceremony using the structure above.
> This pre-brief does NOT constitute an ASSURANCE-TOKEN. The ASSURANCE-TOKEN will only be
> issued after IAA executes full Phase 2–4 assurance against the committed PREHANDOVER proof.
>
> Wave may proceed under CS2 explicit mandate and retroactive ceremony authorization.
> All PHASE_B_BLOCKING enforcement remains active at handover.

---

## Session Reference

**Pre-Brief Session ID**: session-prebrief-wave-gov-improvement-s032-s033-s007-s023-20260310
**Pre-Brief Artifact Path**: `.agent-admin/assurance/iaa-prebrief-wave-gov-improvement-s032-s033-s007-s023.md`
**Authority**: CS2 only (@APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Adoption Phase at Pre-Brief Time**: PHASE_B_BLOCKING
**STOP-AND-FIX mandate**: ACTIVE — no class exceptions — ambiguity resolves to mandatory invocation

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Created**: 2026-03-10
**Living Agent System**: v6.2.0
