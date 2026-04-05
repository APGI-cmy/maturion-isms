# IAA Pre-Brief — Wave mmm-mat-harvest-20260405

**Artifact Type**: IAA Pre-Brief (Phase 0 — PRE-BRIEF mode)
**Wave**: mmm-mat-harvest-20260405
**Wave Description**: CS2 Directive: MMM/MAT/Roadmap Harvest — One-Issue Execution/Attestation &
Permission, with Governance/Agent Boundaries
**Branch**: copilot/cs2-directive-mmm-mat-roadmap
**CS2 Authorization Issue**: #1221 — "CS2 Directive: MMM/MAT/Roadmap Harvest — One-Issue
Execution/Attestation & Permission, with Governance/Agent Boundaries" (opened 2026-04-05 by
@APGI-cmy; assigned to foreman-v2-agent / Copilot)
**Date**: 2026-04-05
**IAA Version**: independent-assurance-agent v6.2.0 / contract 2.3.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 only (@APGI-cmy)

---

## 1. Wave Scope Confirmation

**Declared scope (per wave-current-tasks.md and CS2 issue #1221):**

This is an **orchestration-only wave**. No production code, schemas, migrations, tests, CI
workflows, or agent contracts are modified.

| Deliverable ID | Artefact | Path / Destination | Producing Agent |
|---------------|---------|-------------------|----------------|
| D-1 | New GitHub issue: CL-11-D3/D4 audit (qa-builder; GAP-008 & GAP-009) | GitHub issue (number TBD at creation) | foreman-v2-agent |
| D-2 | New GitHub issue: CL-6 wave-start (from template) | GitHub issue (number TBD at creation) | foreman-v2-agent |
| D-3 | New GitHub issue: CL-7 wave-start (PersonaLoader improvements) | GitHub issue (number TBD at creation) | foreman-v2-agent |
| D-4 | New GitHub issue: CL-10 wave-start (Routing Governance CI Enforcement) | GitHub issue (number TBD at creation) | foreman-v2-agent |
| D-5 | Governance recording: items 1+4+6 via governance-liaison-isms-agent delegation | `.agent-workspace/governance-liaison-isms-agent/` and/or governance programme records | governance-liaison-isms-agent (delegated by foreman) |
| D-6 | Session memory | `.agent-workspace/foreman-v2/memory/session-mmm-mat-harvest-20260405.md` | foreman-v2-agent |
| D-7 | PREHANDOVER proof | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-mat-harvest-20260405.md` | foreman-v2-agent |

**Scope boundaries confirmed:**
- Items 1, 4, 6 (recording deliverables): T3 programme recordings only — no T1/T2 mutations
- D-1 through D-4: GitHub issue creation only — no repo files committed for issue creation itself
- No production code changes: confirmed per wave description
- No CI or agent contract changes: confirmed per wave description

---

## 2. Trigger Category Classification

**Classification decision flow (per `iaa-trigger-table.md` v2.1.0):**

| Step | Check | Result |
|------|-------|--------|
| 1 | Any `.github/agents/` or `governance/agents/` changes? | NO — orchestration-only |
| 2 | Any `governance/canon/` or `CANON_INVENTORY.json` changes? | CONDITIONAL — depends on governance-liaison D-5 file scope (see Blocker B-001) |
| 3 | Any `.github/workflows/` changes? | NO |
| 4 | AAWP/MAT deliverable artifacts? | NO — pure orchestration |
| 5 | Any `governance/quality/agent-integrity/` changes? | NO |
| 6 | Any `.agent-workspace/*/knowledge/` changes? | NO — recordings go to programme records, not knowledge tier |
| 7 | Clearly and unambiguously doc-only outside governance/canon? | AMBIGUOUS — D-5 governance recordings scope not fully pre-declared |

**Classification: AMBIGUOUS → IAA MANDATORY (FAIL-ONLY-ONCE A-003)**

**Rationale**: This wave includes:
1. Foreman-level orchestration output (D-7 PREHANDOVER) that formally attests wave completion —
   consistent with prior precedent (aimc-wave-status wave: same class of artefact, IAA mandatory).
2. D-5 governance-liaison delegation involving T3 programme state changes across 3 action items
   (MAT terminal verdict, MMM AI stubs, Roadmap decommission). The exact files governance-liaison
   will commit are not pre-declared in `wave-current-tasks.md`. This creates ambiguity about
   whether `governance/EXECUTION/` or `governance/aimc/` files are touched. AMBIGUITY RULE applies:
   ambiguity resolves to mandatory invocation.
3. Consistent with all prior foreman orchestration waves in this repository: IAA has been
   mandatory for every wave producing a PREHANDOVER proof regardless of category.

**IAA trigger category (resolved)**: **AMBIGUOUS → MANDATORY** (orchestration governance output).

**Conditional escalation**: If D-5 governance-liaison commits touch `governance/canon/` or
`CANON_INVENTORY.json`, the category escalates to **CANON_GOVERNANCE** and the corresponding
overlay (OVL-CG-001 through OVL-CG-005) applies in addition.

---

## 3. Qualifying Tasks

All deliverables are QUALIFYING for this wave. IAA must verify all of the following at handover:

| Task ID | Summary | IAA Trigger Category | Required Phases |
|---------|---------|----------------------|-----------------|
| D-1 | CL-11-D3/D4 audit GitHub issue | AMBIGUOUS → MANDATORY | P0 (pre-brief), P2–P4 |
| D-2 | CL-6 wave-start GitHub issue (from template) | AMBIGUOUS → MANDATORY | P0, P2–P4 |
| D-3 | CL-7 wave-start GitHub issue | AMBIGUOUS → MANDATORY | P0, P2–P4 |
| D-4 | CL-10 wave-start GitHub issue | AMBIGUOUS → MANDATORY | P0, P2–P4 |
| D-5 | Governance recordings (items 1, 4, 6) via governance-liaison | AMBIGUOUS → MANDATORY (escalates to CANON_GOVERNANCE if canon files touched) | P0, P2–P4 |
| D-6 | Foreman session memory | AMBIGUOUS → MANDATORY (wave-level ceremony) | P0, P2–P4 |
| D-7 | Foreman PREHANDOVER proof | AMBIGUOUS → MANDATORY (wave-level ceremony) | P0, P2–P4 |

---

## 4. FFA Checks IAA Will Run at Handover

### 4.1 Universal Ceremony Gate (CERT — Binary Existence Checks)

| Check | Requirement | Failure Action |
|-------|-------------|----------------|
| CERT-001 | PREHANDOVER proof file present on branch at declared path | State once: "PREHANDOVER proof not found — create it." |
| CERT-002 | Session memory file present on branch at declared path | State once: "Session memory not found — create it." |
| CERT-003 | FAIL-ONLY-ONCE attestation declared in session memory preamble | State once: "Add fail_only_once_attested declaration." |
| CERT-004 | `iaa_audit_token` field present in PREHANDOVER proof with expected reference format | State once: "Add iaa_audit_token field." |

### 4.2 Core Invariants (CORE — All Applicable)

| Check | What IAA Verifies |
|-------|------------------|
| CORE-007 | No STUB/TODO/FIXME/TBD/placeholder content in any delivered artefact. `iaa_audit_token: IAA-session-mmm-mat-harvest-20260405-PASS` format is exempt from this check. |
| CORE-013 | PREHANDOVER proof or IAA token reference present in PR artifacts (FAIL-ONLY-ONCE A-001) |
| CORE-014 | No class exemption claim present in PR (FAIL-ONLY-ONCE A-002) |
| CORE-015 | Session memory present in PR bundle |
| CORE-016 | Dedicated IAA token file exists at `.agent-admin/assurance/iaa-token-session-mmm-mat-harvest-20260405.md` |
| CORE-017 | No `.github/agents/` modifications by unauthorized agent |
| CORE-018 | Complete evidence artifact sweep: PREHANDOVER present + non-empty, session memory present + non-empty, `iaa_audit_token` non-empty/non-bare-placeholder, dedicated IAA token file exists |
| CORE-019 | IAA token cross-verification (first invocation exception applies — token file created this session) |
| CORE-020 | Zero partial pass rule — all checks verifiable from PR artifacts |
| CORE-021 | Zero-severity-tolerance — no finding characterised as trivial/minor/cosmetic |

### 4.3 Orchestration FFA Checks (ORC-FFA — PRIMARY REVIEW FOCUS)

These are the substantive checks for this orchestration wave. They represent IAA's 90% effort.

| Check ID | Check Name | Pass Condition | Priority |
|----------|-----------|----------------|----------|
| ORC-FFA-001 | All 4 GitHub issues created | D-1 through D-4 GitHub issues all exist and are referenced by number in PREHANDOVER proof or session memory | BLOCKING |
| ORC-FFA-002 | CL-11-D3/D4 issue scoped correctly | D-1 issue explicitly names: GAP-008 (ARC approval endpoint 403 check), GAP-009 (episodic memory audit), assigned to qa-builder, declared audit-only / no code changes | BLOCKING |
| ORC-FFA-003 | CL-6 issue matches template | D-2 issue content matches or correctly derives from `.agent-admin/templates/cl6-wave-start-issue-20260403.md`; no material deviation from CS2-authorised template | BLOCKING |
| ORC-FFA-004 | CL-7 issue scope accurate | D-3 issue covers PersonaLoader improvements scope as declared in wave description; no undeclared scope | BLOCKING |
| ORC-FFA-005 | CL-10 issue scope accurate | D-4 issue covers Routing Governance CI Enforcement scope as declared; no undeclared scope | BLOCKING |
| ORC-FFA-006 | Governance-liaison delegation artifact present | D-5 delegation artifact exists on branch, identifies governance-liaison-isms-agent as executing agent, and explicitly lists items 1, 4, and 6 as recording targets | BLOCKING |
| ORC-FFA-007 | MAT Wave 13 terminal verdict recorded (item 4) | The terminal harvest verdict for MAT Wave 13 is explicitly declared (COMPLETE, CLOSED, or equivalent verdict with date) in the governance recording artefact; verdict is not inferred, deferred, or TBD | BLOCKING |
| ORC-FFA-008 | MMM AI stubs recording references CL-12c deferral (item 1) | The recording for MMM builds with AI stubs explicitly states that wiring is deferred to CL-12c wave; recording does not imply current functionality or active wiring | BLOCKING |
| ORC-FFA-009 | Roadmap decommission plan recorded correctly (item 6) | Recording declares: no CL-12d, Roadmap survives as migration anchor only; plan does not authorise any new Roadmap development beyond migration anchor role | BLOCKING |
| ORC-FFA-010 | No unauthorised scope expansion | PR diff contains no changes to: production code, schema migrations, CI workflows, agent contracts (`.github/agents/`), canon files, T2 knowledge files, or any artefact outside the declared deliverables list | BLOCKING |
| ORC-FFA-011 | CS2 authorization explicit in PREHANDOVER | PREHANDOVER proof cites CS2 issue #1221 explicitly; explicit permission grants for CodexAdvisor (T1/T2 changes) and governance-liaison-agent (T3 changes) referenced | BLOCKING |
| ORC-FFA-012 | No placeholder content in governance recordings | All T3 governance recording artefacts in D-5 are substantive — no TBD, STUB, TODO, or deferred sections that should be populated | BLOCKING |
| ORC-FFA-013 | Governance-liaison file paths declared | D-5 delegation artefact or session memory declares the exact file paths governance-liaison-isms-agent will commit (resolves Blocker B-001) | BLOCKING |

### 4.4 Conditional CANON_GOVERNANCE Overlay (applies if D-5 touches `governance/canon/`)

If governance-liaison-isms-agent's D-5 recordings include any file in `governance/canon/` or
`CANON_INVENTORY.json`, the following additional checks apply:

| Check ID | Check Name | Pass Condition |
|----------|-----------|----------------|
| OVL-CG-001 | Strategy alignment | Canon change correctly implements the strategy it serves; no gap between strategy requirement and canon delivery |
| OVL-CG-002 | No contradictions with existing canon | Change does not contradict any constitutional rule or existing canon |
| OVL-CG-ADM-001 | CANON_INVENTORY updated | `governance/CANON_INVENTORY.json` reflects the new file state |
| OVL-CG-ADM-002 | Version bump present | Modified canon document has incremented version number |

---

## 5. PREHANDOVER Proof Structure Requirements

The Foreman PREHANDOVER proof at
`.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-mat-harvest-20260405.md`
**MUST** contain the following fields/sections. IAA will reject the PR if any are absent.

```yaml
# Required PREHANDOVER proof fields

agent_id: foreman-v2-agent
session_id: session-mmm-mat-harvest-20260405
wave: mmm-mat-harvest-20260405
branch: copilot/cs2-directive-mmm-mat-roadmap
cs2_authorization_issue: "#1221"
cs2_authorization_text: "[verbatim extract of permission grants for CodexAdvisor T1/T2 and governance-liaison T3]"
date: 2026-04-05

# Deliverables manifest — all items must be present with status
deliverables_manifest:
  - id: D-1
    artefact: "GitHub issue: CL-11-D3/D4 audit (qa-builder; GAP-008 & GAP-009)"
    github_issue_number: "[actual issue number]"
    status: DELIVERED
  - id: D-2
    artefact: "GitHub issue: CL-6 wave-start"
    github_issue_number: "[actual issue number]"
    status: DELIVERED
  - id: D-3
    artefact: "GitHub issue: CL-7 wave-start (PersonaLoader improvements)"
    github_issue_number: "[actual issue number]"
    status: DELIVERED
  - id: D-4
    artefact: "GitHub issue: CL-10 wave-start (Routing Governance CI Enforcement)"
    github_issue_number: "[actual issue number]"
    status: DELIVERED
  - id: D-5
    artefact: "T3 governance recordings: items 1, 4, 6"
    delegation_artifact_path: "[path to governance-liaison delegation artefact on branch]"
    governance_liaison_files_committed:
      - "[exact file path 1]"
      - "[exact file path 2]"
      - "[etc.]"
    status: DELIVERED
  - id: D-6
    artefact: "Foreman session memory"
    path: ".agent-workspace/foreman-v2/memory/session-mmm-mat-harvest-20260405.md"
    status: DELIVERED
  - id: D-7
    artefact: "This PREHANDOVER proof"
    path: ".agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-mat-harvest-20260405.md"
    status: DELIVERED

# Governance confirmations
no_production_code_confirmed: true
no_ci_changes_confirmed: true
no_agent_contract_changes_confirmed: true
no_canon_changes_confirmed: true  # OR: "canon_changes: [list if D-5 touches canon — escalate CANON_GOVERNANCE overlay]"
fail_only_once_attested: true

# IAA invocation (§4.3b architecture — pre-populated expected reference)
iaa_audit_token: "IAA-session-mmm-mat-harvest-20260405-PASS"
# NOTE: IAA will write the actual verdict to the dedicated token file.
# This field must contain the expected reference at commit time — NOT "PENDING" or blank.
```

**Additional required sections in PREHANDOVER proof body:**
1. **Wave Summary**: one paragraph describing what was executed and what was not
2. **Delegation Summary**: confirm governance-liaison executed items 1, 4, 6 with file paths
3. **Issue Creation Summary**: list each GitHub issue by number and title
4. **Scope Boundary Attestation**: explicit statement that no production code, schema, CI, or
   agent contract files were modified in this wave
5. **CS2 Authorization Reference**: explicit citation of issue #1221 with permission grant text

---

## 6. Scope Blockers and Governance Conflicts Visible Now

### B-001 — Governance-Liaison File Paths Not Pre-Declared ⚠️ ADVISORY

**Status**: ADVISORY (must be resolved before IAA handover, not blocking Pre-Brief)

**Issue**: `wave-current-tasks.md` lists D-5 as "governance-liaison-isms-agent delegation" with
no declared file paths. IAA cannot pre-classify the D-5 governance recordings as EXEMPT,
CANON_GOVERNANCE, or other category without knowing which files governance-liaison will commit.

**Risk**: If governance-liaison commits to `governance/canon/` or `CANON_INVENTORY.json`, the
CANON_GOVERNANCE overlay (OVL-CG-001 through OVL-CG-ADM-002) activates and adds blocking checks.
If governance-liaison commits only to `.agent-workspace/governance-liaison-isms-agent/memory/`
and similar non-canon paths, the overlay does not activate.

**Required resolution**: Foreman must instruct governance-liaison-isms-agent to declare exact
file paths in its delegation artefact **before** committing. The PREHANDOVER proof field
`governance_liaison_files_committed` (see §5) must be populated with actual paths.

**IAA action at handover**: ORC-FFA-013 will verify this is resolved. If file paths are absent
or vague → REJECTION-PACKAGE.

---

### B-002 — GitHub Issue Numbers Unknown Until Created ℹ️ INFORMATIONAL

**Status**: INFORMATIONAL (expected at wave execution time — not a blocker)

**Issue**: GitHub issue numbers for D-1 through D-4 are not yet known. The PREHANDOVER proof
template in §5 includes placeholder `[actual issue number]` fields.

**Required resolution**: Foreman must populate all 4 GitHub issue numbers in the PREHANDOVER
proof after creating the issues. Bare placeholders or TBD values in the PREHANDOVER proof
at handover time = CORE-007 FAIL.

---

### B-003 — CL-11-D3/D4 Audit Must Be Audit-Only — No Code Change Scope ⚠️ ADVISORY

**Status**: ADVISORY (scoping risk to flag at issue creation time)

**Issue**: The CL-11-D3/D4 issue (D-1) commissions qa-builder to execute GAP-008 (ARC approval
endpoint 403 check) and GAP-009 (episodic memory audit). The wave description states
"audit-only, no code changes." However, audit execution by qa-builder may surface findings
that require code fixes.

**Risk**: If D-1 issue is written ambiguously, qa-builder may interpret it as a remediation
commission rather than an audit commission. This could cause qa-builder to introduce code
changes that require a separate IAA invocation.

**Required resolution**: D-1 issue body must explicitly state:
- Commission type: AUDIT ONLY — findings report, no remediation in this commission
- A separate CS2-authorised issue will be required for any remediation work
- qa-builder must produce a findings report (not a PR with code changes) as its deliverable

**IAA action at handover**: ORC-FFA-002 will verify this scoping is explicit in D-1.

---

### B-004 — MAT Wave 13 Terminal Verdict Must Be Authorised by CS2, Not Self-Declared ⚠️ ADVISORY

**Status**: ADVISORY (governance integrity check)

**Issue**: Item 4 records "MAT Wave 13 terminal harvest verdict — MAT closes post-migration."
This is a significant programme milestone. Recording a terminal verdict requires explicit CS2
authorization — it cannot be self-declared by foreman or governance-liaison.

**Required resolution**: The governance recording for item 4 must cite CS2 issue #1221 (or
another CS2 statement) as the authority for the terminal verdict declaration. The recording
must not read as a unilateral closure by the agent system.

**IAA action at handover**: ORC-FFA-007 will verify the terminal verdict is CS2-authorised
and not agent-self-declared.

---

### B-005 — CL-6 Template Compliance Must Be Verified at Time of Issue Creation ℹ️ INFORMATIONAL

**Status**: INFORMATIONAL (standard requirement)

**Issue**: D-2 uses the template at `.agent-admin/templates/cl6-wave-start-issue-20260403.md`.
The wave description states the template is "already authorised" and "template exists."

**Required resolution**: Foreman must not deviate materially from the template content when
creating D-2. If any deviation is needed, it must be documented and traceable to CS2 direction.

**IAA action at handover**: ORC-FFA-003 will check template compliance.

---

## 7. Evidence Artifacts IAA Will Require on Branch at Handover

The following files must be present and non-empty on the PR branch when IAA is invoked
(CORE-018 sweep):

| Required File | Path | Source |
|--------------|------|--------|
| PREHANDOVER proof | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-mmm-mat-harvest-20260405.md` | foreman-v2-agent |
| Session memory | `.agent-workspace/foreman-v2/memory/session-mmm-mat-harvest-20260405.md` | foreman-v2-agent |
| Governance-liaison delegation artefact | Path to be declared in PREHANDOVER (see B-001) | governance-liaison-isms-agent |
| T3 recording artefacts (items 1, 4, 6) | Paths to be declared in PREHANDOVER | governance-liaison-isms-agent |
| IAA Pre-Brief (this file) | `.agent-admin/assurance/iaa-prebrief-mmm-mat-harvest-20260405.md` | IAA (already committed) |
| IAA token file (to be created by IAA) | `.agent-admin/assurance/iaa-token-session-mmm-mat-harvest-20260405.md` | IAA at handover |

**IAA does NOT require** on-branch evidence of GitHub issue content (D-1 through D-4) — these
are verified via GitHub issue numbers cited in the PREHANDOVER proof.

---

## 8. PHASE_A_ADVISORY vs PHASE_B_BLOCKING Status

**Current adoption phase**: PHASE_B_BLOCKING

All FFA checks declared in this pre-brief are **hard-blocking**. IAA will issue REJECTION-PACKAGE
if any ORC-FFA check fails at handover. No advisory passes. No partial tokens.

---

## 9. IAA Pre-Brief Sign-off

**Pre-Brief status**: COMMITTED
**Generated by**: independent-assurance-agent v6.2.0 / contract 2.3.0
**Session type**: Phase 0 PRE-BRIEF — no Phase 2–4 assurance executed this session
**Next IAA action**: Await foreman-v2-agent handover on branch `copilot/cs2-directive-mmm-mat-roadmap`

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Contract**: 2.3.0
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE — CONSTITUTIONAL
**STOP-AND-FIX Mandate**: ACTIVE — PHASE_B_BLOCKING — No class exceptions
