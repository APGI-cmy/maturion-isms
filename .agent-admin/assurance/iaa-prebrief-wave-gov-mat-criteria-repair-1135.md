# IAA Pre-Brief Artifact
## Wave: wave-gov-mat-criteria-repair-1135

**Agent**: independent-assurance-agent v6.2.0  
**Pre-Brief Generated**: 2026-03-17  
**Branch**: `copilot/gov-mat-criteria-repair`  
**Triggering Issue**: #1135 — [GOV] MAT Criteria Parsing Holistic Repair — Gap Register + Governance Updates + Foreman Plan (NO IMPLEMENTATION)  
**CS2 Authorization**: Issue opened by @APGI-cmy  
**Wave Nature**: Governance/Planning ONLY — no production code, migrations, tests, or CI changes  
**Adoption Phase**: PHASE_B_BLOCKING  

---

## Phase 0 — Pre-Brief Execution Evidence

### Step 0.1 — Pre-Brief Invocation Confirmed

Invoked via `[IAA PRE-BRIEF REQUEST]` comment on issue #1135.  
Mode: **PRE-BRIEF ONLY**. I do NOT execute Phases 1–4 assurance at this stage.  
Assurance phases (1–4) will be executed when Foreman submits the completed PR for handover review.

### Step 0.2 — Wave Scope Read

Wave-current-tasks.md reviewed. Current tasks file shows the prior wave (wave-node-cli-ripple, ASSURANCE-TOKEN PASS). This new wave `wave-gov-mat-criteria-repair-1135` supersedes it.  
**Foreman action required**: Update `wave-current-tasks.md` to reflect this new wave before handover.

### Step 0.3 — Qualifying Task Classification

Per INDEPENDENT_ASSURANCE_AGENT_CANON.md §Trigger Table and `iaa-trigger-table.md`:

| Task | Description | Qualifying? | Category |
|------|-------------|------------|----------|
| T-CGMR-001 | Survey MAT criteria parsing pipeline, produce fault tree | YES | AAWP_MAT |
| T-CGMR-002 | Produce gap register (GAP-PARSE-001 through GAP-PARSE-007+) | YES | AAWP_MAT |
| T-CGMR-003 | Update `modules/mat/00-app-description/app-description.md` | YES | AAWP_MAT |
| T-CGMR-004 | Update `modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md` | YES | AAWP_MAT |
| T-CGMR-005 | Update `modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md` | YES | AAWP_MAT |
| T-CGMR-006 | Update FRS / TRS documents relevant to parsing | YES | AAWP_MAT |
| T-CGMR-007 | Add QA RED suite spec additions for "no silent success" etc. | YES | AAWP_MAT |
| T-CGMR-008 | Update Implementation Plan with new wave/tasks list | YES | AAWP_MAT |
| T-CGMR-009 | Produce Wave Plan Proposal for Issue #2 | YES | AAWP_MAT |

**All nine tasks qualify.** No tasks are exempt.  
**AAWP_MAT is the primary trigger category.**  
**PRE_BRIEF_ASSURANCE overlay** always applies alongside AAWP_MAT (OVL-INJ-001).  
**CANON_GOVERNANCE** does NOT apply unless Foreman touches `governance/canon/` constitutional files — scoped MAT module docs are AAWP_MAT, not CANON_GOVERNANCE.  
**AGENT_CONTRACT / CI_WORKFLOW / KNOWLEDGE_GOVERNANCE**: NOT triggered (no agent contract changes, no CI/workflow changes, no Tier 2 knowledge file changes in scope).

---

## Section 1 — IAA Trigger Categories Declared

| Category | Triggered? | Reason |
|----------|-----------|--------|
| **AAWP_MAT** | ✅ YES — PRIMARY | All deliverables are MAT domain planning artifacts (gap register, governance doc updates, wave plan proposal) within `modules/mat/` |
| **PRE_BRIEF_ASSURANCE** | ✅ YES — MANDATORY OVERLAY | Always applied alongside AAWP_MAT; this artifact is the required pre-brief (OVL-INJ-001) |
| CANON_GOVERNANCE | ❌ NO — unless `governance/canon/` touched | MAT module docs in `modules/mat/` are not constitutional canon; if Foreman adds entries to `governance/CANON_INVENTORY.json` or `governance/canon/` files, this category becomes triggered |
| AGENT_CONTRACT | ❌ NO | No agent contract changes in scope |
| CI_WORKFLOW | ❌ NO | No CI/workflow changes in scope |
| KNOWLEDGE_GOVERNANCE | ❌ NO | No Tier 2 knowledge file changes in scope |

> ⚠️ **AMBIGUITY RULE NOTE**: If Foreman updates any `governance/canon/` constitutional file during this wave, CANON_GOVERNANCE overlay MUST also be applied at handover (A-022: re-evaluate categories on every invocation). Foreman must flag any such addition in the PREHANDOVER proof.

---

## Section 2 — FFA Checks at Handover (Full Declared Set)

### 2a — CORE Invariants (Applied to All PRs)

The following CORE checks will be executed at handover. Checks CORE-001 through CORE-012 are AGENT_CONTRACT-specific and are **NOT applicable** to this governance-documentation wave. The applicable CORE checks are:

| Check ID | Check Name | Applicable? | Notes |
|----------|-----------|------------|-------|
| CORE-001 to CORE-012 | Agent contract structure checks | ❌ N/A | No agent contract in PR |
| CORE-013 | IAA invocation evidence | ✅ YES — BLOCKING | PREHANDOVER proof or IAA token reference must be present |
| CORE-014 | No class exemption claim | ✅ YES — BLOCKING | Foreman class not exempt |
| CORE-015 | Session memory present | ✅ YES — BLOCKING | Session memory artifact must be in PR bundle |
| CORE-016 | IAA verdict evidenced (§4.3b) | ✅ YES — BLOCKING | Dedicated IAA token file at `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` |
| CORE-017 | No `.github/agents/` modifications by unauthorized agent | ✅ YES — BLOCKING | Foreman must not modify agent contract files |
| CORE-018 | Complete evidence artifact sweep | ✅ YES — BLOCKING | PREHANDOVER proof, session memory, `iaa_audit_token` field, token file — all must be present and non-empty |
| CORE-019 | IAA token cross-verification | ✅ YES — BLOCKING | Token file must reference this PR; FIRST INVOCATION EXCEPTION applies at initial handover |
| CORE-020 | Zero partial pass rule | ✅ YES — BLOCKING | No assumed passes on missing evidence |
| CORE-021 | Zero-severity-tolerance | ✅ YES — BLOCKING | All findings = REJECTION-PACKAGE regardless of severity |

### 2b — BUILD_DELIVERABLE Overlay (AAWP_MAT — Docs-Only Scope)

Because this wave is **governance-documentation-only** (no production code, no migrations, no tests), the BUILD_DELIVERABLE overlay applies but most code-specific BD checks are **N/A with explicit justification**. The following table declares which checks apply and how they will be scoped:

#### BD-TIER-1 — Delivery Completeness (APPLIES — full scope)

| Check ID | Check Name | Applies? | Governance-Wave Scope |
|----------|-----------|---------|----------------------|
| BD-001 | Full scope delivered | ✅ YES — BLOCKING | Every governance doc listed in issue #1135 must be present in the diff. Gap register must cover all 7 seed gaps + any additional found. Wave plan proposal must be present. Missing doc = REJECTION-PACKAGE. |
| BD-002 | No stub/TODO in governance artifacts | ✅ YES — BLOCKING | No `TODO:`, `TBD`, `FIXME:`, or "to be completed" placeholders in the gap register or wave plan. Every gap entry must have a complete root cause, proposed fix, owner agent class, and acceptance test. |
| BD-003 | One-time plan completeness | ✅ YES — BLOCKING | Does the wave plan proposal provide enough specificity for Issue #2 to be actioned without requiring another planning wave? If vague or incomplete = REJECTION-PACKAGE. |
| BD-004 | No leftover debt from prior jobs | ✅ YES — ADVISORY | IAA will check if prior wave findings affecting MAT criteria pipeline exist but are unaddressed. If known open items are not captured in the gap register = advisory finding. |

#### BD-TIER-2 — Wiring & Integration (SCOPED for docs-only)

| Check ID | Check Name | Applies? | Governance-Wave Scope |
|----------|-----------|---------|----------------------|
| BD-005 | End-to-end traceability verified | ✅ YES — BLOCKING (adapted) | The gap register's field mapping matrix (Source → AI output → Edge fn → DB column → UI rendering) must be traceable end-to-end. A gap register that describes symptoms without tracing them to specific pipeline stages is incomplete. |
| BD-006 through BD-010 | Code wiring checks | ❌ N/A | No code in this wave. |

#### BD-TIER-3 — Test Quality (N/A — docs-only wave)

| Check ID | Check Name | Applies? |
|----------|-----------|---------|
| BD-011 through BD-014 | Test pass rate, debt, dodging, deprecation | ❌ N/A — No executable tests in this wave. QA RED suite spec is a specification document, not an executed test suite. |

#### BD-TIER-4 — Security Review (N/A — docs-only wave)

| Check ID | Check Name | Applies? |
|----------|-----------|---------|
| BD-015 through BD-019 | RLS, secrets, injection, standards | ❌ N/A — No code, no DB migrations, no endpoints in this wave. |
| BD-016 (partial) | No hardcoded secrets | ✅ YES — BLOCKING (adapted) | Gap register and runbook appendices must not contain actual secret values, connection strings, or credentials. SQL probes must use parameterized examples only. |

#### BD-TIER-5 — Code Quality (N/A — docs-only wave)

| Check ID | Check Name | Applies? |
|----------|-----------|---------|
| BD-020 through BD-024 | Code structure, architecture, tech currency | ❌ N/A — No production code in this wave. |

#### BD-TIER-6 — FFA Summary Template (will be produced at handover)

IAA will produce the following FFA Summary at handover:

```
FFA Result (Governance-Documentation Wave Adaptation):
  FFA-01 Delivery Completeness: [PASS|FAIL] — All scoped governance docs present and non-stub
  FFA-02 Pipeline Traceability: [PASS|FAIL] — Gap register maps all 7 seed gaps with field mapping matrix
  FFA-03 Plan Actionability:    [PASS|FAIL] — Wave plan proposal has sufficient detail for Issue #2 commissioning
  FFA-04 No Secrets Exposed:    [PASS|FAIL] — No credentials/secrets in any committed artifact
  FFA-05 Code Quality:          [N/A] — Governance-documentation-only wave; no code in PR
  FFA-06 One-Time Plan:         [PASS|FAIL] — Plan complete enough to action without additional planning wave
  FFA-CARRY-FORWARD: [NONE|ISSUED] — Any pre-existing open MAT pipeline gaps not in scope of Issue #2
```

### 2c — PRE_BRIEF_ASSURANCE Overlay (Always Applied)

| Check ID | Check Name | Will Run? |
|----------|-----------|----------|
| OVL-INJ-001 | Pre-Brief Artifact Existence | ✅ YES — BLOCKING | Confirmed: this artifact is the Pre-Brief. IAA will verify it is non-empty and was committed before any builder task artifact on the branch. |
| OVL-INJ-ADM-001 | Pre-Brief artifact non-empty | ✅ YES | Confirmed: this artifact is substantive. |
| OVL-INJ-ADM-002 | Pre-Brief references correct wave | ✅ YES | This artifact declares `wave-gov-mat-criteria-repair-1135`. |

### 2d — FAIL-ONLY-ONCE Learning Checks (Always Applied)

| Rule | Applied at Handover |
|------|-------------------|
| A-001 | IAA invocation evidence must be present in PREHANDOVER proof |
| A-002 | No class exemption — Foreman class covered |
| A-003 | Ambiguity resolves to mandatory — no exempt claim accepted |
| A-021 | All fixes committed before IAA invocation — working-tree-only = FAIL |
| A-022 | Re-evaluate trigger categories at handover — new commits may add new categories |
| A-025 | `iaa_audit_token` must use PENDING format or expected reference, not blank |
| A-026 | `SCOPE_DECLARATION.md` must match `git diff --name-only origin/main...HEAD` exactly |
| A-028 | SCOPE_DECLARATION format: list format, prior-wave entries trimmed |
| A-029 | PREHANDOVER proof immutable post-commit; IAA writes dedicated token file |
| A-031 | IAA's own ceremony files (this Pre-Brief) excluded from SCOPE_DECLARATION per A-031 carve-out |

---

## Section 3 — Required PREHANDOVER Proof Structure

Foreman must produce a PREHANDOVER proof file committed to the branch before invoking IAA for handover. The proof must contain **all** of the following sections:

```markdown
# PREHANDOVER Proof — wave-gov-mat-criteria-repair-1135
## Metadata
- wave: wave-gov-mat-criteria-repair-1135
- branch: copilot/gov-mat-criteria-repair
- issue: #1135
- producing_agent: foreman-v2-agent
- producing_agent_class: foreman
- date: YYYY-MM-DD

## Phase 1 + Phase 2 Evidence
[Foreman's Phase 1 identity declaration + Phase 2 alignment output per foreman contract]

## IAA Pre-Brief Attestation
- Pre-Brief artifact: `.agent-admin/assurance/iaa-prebrief-wave-gov-mat-criteria-repair-1135.md`
- Pre-Brief committed before builder task delegation: [YES — date/commit SHA]

## Deliverables Manifest
[List every file modified or created on the branch — must match `git diff --name-only origin/main...HEAD` exactly]

## Gap Register Attestation
[Confirm all seed gaps GAP-PARSE-001 through GAP-PARSE-007 are documented, plus any additional gaps found]
[Confirm every gap entry has: Gap ID, Symptom, Root cause hypothesis, Evidence links, Required fix, Owner agent class, Acceptance tests, Risk severity]

## Governance Docs Updated
[List each governance file updated with one-line description of what was added/changed]
- modules/mat/00-app-description/app-description.md — [description]
- modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md — [description]
- modules/mat/00-app-description/BUILD_PROGRESS_TRACKER.md — [description]
- [FRS file path] — [description]
- [TRS file path] — [description]
- [QA RED suite spec file path] — [description]
- [Implementation plan file path] — [description]

## Wave Plan Proposal Completeness
[Confirm wave plan for Issue #2 contains: task breakdown by builder agent type, required RED QA suites, required artifacts, merge gates]

## No Secrets Attestation
[Confirm no credentials, secret values, or connection strings are present in any committed artifact]

## SCOPE_DECLARATION.md Compliance (A-026 + A-028)
- SCOPE_DECLARATION.md updated: [YES]
- Format: list format, prior-wave entries trimmed
- Matches git diff --name-only origin/main...HEAD: [YES — verified]
- A-031 carve-out noted: [IAA's own Pre-Brief and token files excluded from scope declaration]

## Session Memory Reference
- Session memory file: `.agent-workspace/foreman-v2/memory/session-[NNN]-[YYYYMMDD].md`
- Session committed: [YES — commit SHA]

## IAA Audit Token (Pre-Populated — A-029)
iaa_audit_token: IAA-session-wave-gov-mat-criteria-repair-1135-20260317-PASS
[Note: Pre-populated as expected reference per A-029. IAA will write dedicated token file post-verdict. This field is not a placeholder — it is the anticipated token reference.]

## Pre-IAA Commit Gate (A-021 compliance)
- git status: [output showing working tree clean]
- git log --oneline -5: [output showing all deliverables committed]
```

---

## Section 4 — Scope Blockers and Governance Conflicts Visible Now

### Blocker 1 — wave-current-tasks.md Stale (Action Required Before Handover)

**Status**: ⚠️ PRE-BLOCKER  
**Description**: `wave-current-tasks.md` currently references the completed `wave-node-cli-ripple` wave (ASSURANCE-TOKEN PASS, 2026-03-16). Foreman must update this file to reflect `wave-gov-mat-criteria-repair-1135` before handover.  
**Blocking?**: Not a hard blocker now. Will cause CORE-018 inconsistency at handover if not addressed.  
**Resolution**: Foreman updates `wave-current-tasks.md` as part of wave setup and includes it in committed deliverables.

### Blocker 2 — SCOPE_DECLARATION.md Must Match Diff Exactly (A-026 Hard Rule)

**Status**: ⚠️ PRE-BLOCKER  
**Description**: Rule A-026 requires `SCOPE_DECLARATION.md` to match `git diff --name-only origin/main...HEAD` exactly before IAA invocation. If Foreman commits deliverables without updating SCOPE_DECLARATION.md, or if the file contains stale entries from prior waves, IAA will issue a REJECTION-PACKAGE.  
**Blocking?**: Will be hard-blocking at handover if not addressed.  
**Resolution**: Foreman updates SCOPE_DECLARATION.md as a final step before IAA invocation, with A-031 carve-out noted to exclude IAA ceremony artifacts.

### Blocker 3 — "No Implementation" Boundary Must be Strictly Observed

**Status**: ⚠️ GOVERNANCE BOUNDARY  
**Description**: Issue #1135 is explicitly scoped to governance/planning artifacts only. Any production code, migration DDL, test files, or CI workflow changes committed to this branch would:
1. Trigger additional IAA overlay checks (BD code checks, CORE-032 schema compliance, etc.)
2. Change the wave category from planning-only to implementation
3. Likely require a REJECTION-PACKAGE if the implementation is not IAA-approved  
**Blocking?**: Not a blocker now. Becomes a hard blocker if scope creep occurs.  
**Resolution**: Foreman must not delegate implementation tasks in this wave. The wave plan proposal is a document for Issue #2, not a trigger to implement in Issue #1.

### Blocker 4 — No Prior Pre-Brief on This Branch (Resolved by This Artifact)

**Status**: ✅ RESOLVED by this artifact  
**Description**: OVL-INJ-001 requires a Pre-Brief artifact to be committed before any builder task artifact. This artifact is that Pre-Brief.  
**Evidence**: `.agent-admin/assurance/iaa-prebrief-wave-gov-mat-criteria-repair-1135.md` committed to `copilot/gov-mat-criteria-repair` branch.

### Blocker 5 — GAP-PARSE-001 "integer" schema constraint is known production defect

**Status**: ℹ️ ADVISORY (not a governance blocker for this wave)  
**Description**: `public.criteria.number` is `integer NOT NULL` in production, which cannot represent LDCS hierarchical IDs like `1.4.1`. This is a known schema defect. For this wave: Foreman must document it as GAP-PARSE-001 with full evidence but must NOT fix it (schema migrations are out of scope for Issue #1).  
**IAA observation at handover**: IAA will verify GAP-PARSE-001 is documented with the production evidence cited in issue #1135 (SQL query screenshots showing no rows). A gap entry that says "schema may be wrong" without citing the evidence is incomplete.

### Blocker 6 — FRS/TRS "relevant files" Must Be Explicitly Named (not "relevant files")

**Status**: ⚠️ PREHANDOVER PROOF REQUIREMENT  
**Description**: Issue #1135 says "FRS / TRS documents relevant to parsing + error surfacing + schema constraints (list exact files)". The PREHANDOVER proof must list the exact file paths touched, not a generic description. IAA will verify each listed FRS/TRS file is actually modified in the diff.  
**Candidates based on existing file structure**:
- `modules/mat/01-frs/functional-requirements.md`
- `modules/mat/01.5-trs/technical-requirements-specification.md`
- `modules/mat/01.5-trs/frs-to-trs-traceability.md`  
**Blocking?**: Will be a REJECTION-PACKAGE finding at handover if PREHANDOVER proof says "FRS/TRS updated" without exact file paths that match the diff.

---

## Summary

| Item | Status |
|------|--------|
| Wave category | `wave-gov-mat-criteria-repair-1135` — Governance/Planning Only |
| Primary trigger category | **AAWP_MAT** |
| Secondary overlay | **PRE_BRIEF_ASSURANCE** (OVL-INJ-001) |
| CANON_GOVERNANCE | Not triggered (unless `governance/canon/` files are touched) |
| AGENT_CONTRACT | Not triggered |
| CI_WORKFLOW | Not triggered |
| KNOWLEDGE_GOVERNANCE | Not triggered |
| Adoption phase | **PHASE_B_BLOCKING** — hard gate active |
| FFA checks | BD-001, BD-002, BD-003, BD-004 (advisory), BD-005 (adapted), BD-016 (adapted) + FFA Summary |
| Pre-blockers identified | 4 (see Section 4) |
| Hard blockers now | 0 (all are pre-emptive advisories for Foreman) |
| This pre-brief artifact | **COMMITTED** — OVL-INJ-001 satisfied |

---

**IAA Pre-Brief Signoff**:  
`independent-assurance-agent` v6.2.0 | PHASE_B_BLOCKING | 2026-03-17  
Wave: `wave-gov-mat-criteria-repair-1135` | Issue: #1135 | Branch: `copilot/gov-mat-criteria-repair`  
Authority: CS2 (@APGI-cmy) | SELF-MOD-IAA-001 ACTIVE  
