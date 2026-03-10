# IAA Pre-Brief — Wave: wave-criteria-display-bugfix-1049

**Pre-Brief ID**: IAA-PREBRIEF-wave-criteria-display-bugfix-1049-20260310
**Wave**: wave-criteria-display-bugfix-1049 — Bug: Criteria Not Displayed After Parsing — Column Mapping Mismatch
**Issue**: maturion-isms#1049
**Branch**: copilot/fix-column-mapping-issue
**Date**: 2026-03-10
**Produced by**: independent-assurance-agent v6.2.0
**Requested by**: foreman-v2-agent (retroactive — implementation committed pre-protocol, CS2 re-alignment directive issued)
**Authority**: CS2 (@APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## § 0 — Pre-Brief Mode Confirmation

This document is a **PRE-BRIEF artifact only**.
IAA is NOT executing Phase 2–4 assurance in this session.
Full assurance (ASSURANCE-TOKEN or REJECTION-PACKAGE) will be issued at handover
when foreman-v2-agent invokes IAA with the completed PREHANDOVER proof.

This pre-brief declares all trigger categories, FFA checks, PREHANDOVER proof
structure, and governance blockers visible NOW.

---

## § 1 — POLC Violation Record (Precedence — Read First)

> **REGISTERED VIOLATION: INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001**
> Class: INC-BOOTSTRAP-IMPL-001 (eighth occurrence)
>
> foreman-v2-agent committed:
> - `supabase/functions/invoke-ai-parse-criteria/index.ts` (production code)
> - `modules/mat/tests/wave-criteria-display-bugfix/criteria-display-bugfix.test.ts` (tests)
>
> **BEFORE** completing Phase 1 preflight, creating `wave-current-tasks.md`, or
> invoking this IAA Pre-Brief.
>
> **A-031 status**: This Pre-Brief is retroactive. Per A-031, a retroactively committed
> Pre-Brief does NOT satisfy the pre-brief requirement. However, CS2 has issued an explicit
> re-alignment directive authorising retroactive ceremony for this wave. CS2 authority
> supersedes A-031 in this instance. The violation is formally on record.
>
> **A-033 restatement**: There is NO minimum complexity threshold below which pre-wave
> governance sequence may be skipped. A 1-line fix and a 200-file wave require identical
> governance sequence. This applies to this wave.
>
> **Foreman must confirm**: Is INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 registered in
> `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v3.8.0 and committed to
> branch before IAA handover invocation? (Answer per wave-current-tasks.md: YES — being
> committed as part of this retroactive ceremony.)

---

## § 2 — Wave Scope Review

**Source**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (read in full)

### Files in PR Scope

| # | File | Status | Category |
|---|------|--------|----------|
| 1 | `supabase/functions/invoke-ai-parse-criteria/index.ts` | COMMITTED (pre-protocol) | Production code — Supabase Edge Function |
| 2 | `modules/mat/tests/wave-criteria-display-bugfix/criteria-display-bugfix.test.ts` | COMMITTED (pre-protocol) | Regression tests T-WCDB-001 to T-WCDB-005 |
| 3 | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | BEING COMMITTED | Tier 2 knowledge update — v3.8.0 |
| 4 | `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | BEING COMMITTED | Wave admin — session memory |
| 5 | `.agent-admin/assurance/iaa-prebrief-wave-criteria-display-bugfix-1049.md` | THIS DOCUMENT | Pre-Brief artifact |

### Files Confirmed Out of Scope

- No `.github/agents/` files — AGCFPP-001 N/A
- No schema migration files — no A-032 trigger
- No frontend hooks (useCriteria.ts not modified)
- No `SCOPE_DECLARATION.md` update (see A-026 note in § 6 below)
- No `.github/workflows/` changes

---

## § 3 — Trigger Category Declaration

### 3.1 — Primary Trigger Classification

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT / BUILD_DELIVERABLE** | **YES — PRIMARY** | `supabase/functions/invoke-ai-parse-criteria/index.ts` is a MAT pipeline component (Wave 15 AAWP criteria parsing). Fix restores core user-facing functionality (criteria display after parsing). |
| **KNOWLEDGE_GOVERNANCE** | **YES — SECONDARY** | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v3.8.0 — Tier 2 knowledge file created/modified. Per iaa-trigger-table.md: "Any `.agent-workspace/*/knowledge/` file created or modified" triggers KNOWLEDGE_GOVERNANCE. A-015 applies: full PREHANDOVER ceremony required. |
| **MIXED** | **YES** | AAWP_MAT + KNOWLEDGE_GOVERNANCE both active. Ambiguity rule N/A — both categories are unambiguously triggered. MIXED applies per trigger table. |
| **INJECTION_AUDIT_TRAIL** | **YES — ALWAYS** | Applied alongside any T2 qualifying trigger per overlay rules. Pre-Brief existence verified (this document). |
| AGENT_CONTRACT | NO | No `.github/agents/` files in scope |
| CANON_GOVERNANCE | NO | No `governance/canon/` files in scope |
| CI_WORKFLOW | NO | No `.github/workflows/` files in scope |
| AGENT_INTEGRITY | NO | No `governance/quality/agent-integrity/` files in scope |

### 3.2 — A-022 Re-Evaluation Confirmation

A-022 (re-evaluate trigger categories on every invocation) applied. MIXED (AAWP_MAT + KNOWLEDGE_GOVERNANCE) is the correct combined classification. No additional triggers detected.

---

## § 4 — FFA Phases and Checks IAA Will Run at Handover

### 4.1 — Answer to Foreman Question: "Which FFA phases (1–4) are required?"

All four FFA tiers apply. The wave is a BUILD_DELIVERABLE and the BUILD_DELIVERABLE overlay
defines BD-TIER-1 through BD-TIER-5 as the organising framework. For this specific wave
(JS-only bugfix, no schema changes, no new endpoints, no new UI components), the following
narrowing applies:

| FFA Tier | Required? | Applicable Checks | Notes for This Wave |
|----------|-----------|-------------------|---------------------|
| **BD-TIER-1** (Delivery Completeness) | YES | BD-001, BD-002, BD-003 | Scope = fix + 5 regression tests. BD-001 verifies both promised deliverables present. BD-003 asks: does this fix work end-to-end first time? |
| **BD-TIER-2** (Wiring & Integration) | YES (narrowed) | BD-005, BD-009 | BD-005: trace the MPS number resolution chain — normaliseMpsNumber → resolveMpsKey → validCriteriaList.filter() → upsert. BD-006/BD-007/BD-008/BD-010: N/A (no new tables, no auth paths, no FKs, no new components). BD-009: cross-component fit — does the fix break any existing callers of normaliseMpsNumber? |
| **BD-TIER-3** (Test Quality) | YES | BD-011, BD-012, BD-013 | BD-011: all 5 tests GREEN (Foreman claims GREEN — IAA will verify evidence). BD-012: no .skip/.only/todo. BD-013: tests must assert on actual behaviour (T-WCDB-001 regex pattern; T-WCDB-002 negative assertion; T-WCDB-003 isNaN guard — these are meaningful assertions, not vacuous). |
| **BD-TIER-4** (Security) | YES (narrowed) | BD-016, BD-017, BD-018 | BD-015: N/A (no schema/RLS changes). BD-016: no secrets. BD-017/BD-018: `normaliseMpsNumber` processes AI-returned strings via regex — verify regex cannot be exploited (ReDoS check on `/^[A-Za-z]+\s*/`). |
| **BD-TIER-5** (Code Quality) | YES (advisory) | BD-020, BD-021, BD-022, BD-024 | BD-022: architecture alignment — does the fix match the architecture description for the criteria parsing pipeline? BD-024: IAA senior-engineer prerogative — is there a materially better approach? |
| **KNOWLEDGE_GOVERNANCE** | YES | OVL-KG-001 to OVL-KG-004, OVL-KG-ADM-001 to OVL-KG-ADM-003 | Applied to foreman FAIL-ONLY-ONCE v3.8.0 update. Substance first: is INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 clearly stated, traceable to a real incident, and non-duplicating? |
| **INJECTION_AUDIT_TRAIL** | YES | OVL-INJ-001 onwards | Pre-Brief artifact existence (this file), wave-current-tasks.md presence confirmed. |
| **CERT Universal Gate** | YES | CERT-001 to CERT-004 | PREHANDOVER proof, session memory, FAIL-ONLY-ONCE attestation, iaa_audit_token field. |

### 4.2 — A-032 Schema Column Compliance: **NOT TRIGGERED**

**Answer to Foreman Question**: "Is a schema contract check required?"

**NO.** A-032 is not triggered for this wave. Reason:
- No schema migration files in PR scope
- No new DB columns added or removed
- The fix is entirely within JS logic: `normaliseMpsNumber` only changes how an in-memory string
  is normalised before being used as a map key lookup — it does not change any column names,
  INSERT payloads, SELECT column lists, or UPSERT conflict targets
- The `criteria` table upsert payload shape (`domain_id`, `organisation_id`, `number`, etc.)
  is unchanged
- A-032 states: "IAA MUST read migration DDL directly and cross-check every column name" —
  there is no migration DDL to read

IAA confirms: no A-032 check at handover.

---

## § 5 — PREHANDOVER Proof Structure Required

The Foreman must produce a PREHANDOVER proof at `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-criteria-display-bugfix-1049-20260310.md` containing all fields below. IAA will check each field exists (CERT-001 to CERT-004) at handover.

### 5.1 — Required Fields

```yaml
session_id: session-wave-criteria-display-bugfix-1049-20260310
wave: wave-criteria-display-bugfix-1049
branch: copilot/fix-column-mapping-issue
issue: maturion-isms#1049
pr_category: MIXED (AAWP_MAT + KNOWLEDGE_GOVERNANCE)
iaa_prebrief_ref: .agent-admin/assurance/iaa-prebrief-wave-criteria-display-bugfix-1049.md
iaa_prebrief_status: RETROACTIVE — INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 — CS2 re-alignment authorised
iaa_audit_token: PENDING — to be populated with IAA token reference after ASSURANCE-TOKEN issued
polc_violation_registered: INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 in .agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md v3.8.0
```

### 5.2 — Required Evidence Sections

Each section below must be present in the PREHANDOVER proof as a named `##` heading:

| Section | Required Content |
|---------|-----------------|
| `## Build Evidence` | Confirmation that 5 regression tests T-WCDB-001 to T-WCDB-005 GREEN. Provide test runner output excerpt or test run log reference. |
| `## Normalization Fix Verification` | Confirm `normaliseMpsNumber` implementation: (a) strips leading alpha prefix with `/^[A-Za-z]+\s*/`, (b) includes `isNaN` guard, (c) original string returned on non-numeric input. Cite line numbers in the committed file. |
| `## Scope Declaration` | Confirm all files in scope per § 2 are committed to branch. Confirm out-of-scope files are absent. |
| `## POLC Violation Acknowledgement` | Confirm INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 registered in foreman FAIL-ONLY-ONCE v3.8.0. Confirm CS2 re-alignment directive received. |
| `## Knowledge Governance Evidence` | Confirm foreman FAIL-ONLY-ONCE v3.8.0 is on branch and committed. Confirm version bump present (v3.7.x → v3.8.0). |
| `## CI Status` | Confirm `polc-boundary-gate.yml` passes with the pre-brief artifact present (S-023 gate — see § 6 blocker #2). Provide SHA or CI run reference. |
| `## FAIL-ONLY-ONCE Attestation` | State: "I have attested all applicable FAIL-ONLY-ONCE rules for this wave." List rules applied: A-001, A-015, A-021, A-022, A-029, A-031, A-033. |

### 5.3 — iaa_audit_token Field (CERT-004 / A-029)

The PREHANDOVER proof **must** contain an `iaa_audit_token:` field in the YAML block,
even if populated with `PENDING` at time of initial commit.
After IAA issues ASSURANCE-TOKEN, the Foreman updates this field with the token reference.
Per A-029 / §4.3b: the PREHANDOVER proof is **read-only post-commit**. The token field
must be pre-declared as `PENDING` so the proof is committed in a state that accommodates
the update. IAA will NOT edit the PREHANDOVER proof.

---

## § 6 — Scope Blockers and Governance Conflicts

### BLOCKER-1 — A-031 Retroactive Pre-Brief (GOVERNANCE CONFLICT — REQUIRES CS2 ACKNOWLEDGEMENT)

**Status**: ⚠️ ACTIVE GOVERNANCE CONFLICT

Per A-031 (Foreman FAIL-ONLY-ONCE, locked 2026-03-08):
> "A retroactively committed Pre-Brief (created after implementation work has begun) does NOT satisfy this rule."

The implementation (`index.ts` and test file) was committed at SHA `1667e0b` before this Pre-Brief exists. This Pre-Brief is retroactive and therefore technically does NOT satisfy A-031 by its own text.

**Resolution path**: CS2 has issued an explicit re-alignment directive authorising retroactive ceremony for this wave. CS2 authority (as the lock authority for A-031) supersedes the rule in this specific instance. IAA accepts this resolution.

**Required at handover**: The PREHANDOVER proof must cite the CS2 re-alignment directive by reference (issue/comment or PR number where directive was issued). IAA will verify this citation is present.

**IAA position on "is a revert required?"**:
- **NO** — CS2 has issued a re-alignment directive rather than a revert order
- The fix is technically correct per issue #1049 specification (verified: `normaliseMpsNumber` implementation matches the specification in the Pre-Brief request)
- Retroactive ceremony is the authorised remediation path
- The violation is formally registered and on record as INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001

### BLOCKER-2 — S-023 CI Gate (MERGE GATE BLOCKER)

**Status**: ⚠️ MUST BE RESOLVED BEFORE MERGE

Per S-023 (REMEDIATED 2026-03-10, PR #1053): `polc-boundary-gate.yml` now contains a
`builder-involvement-check` job that performs a hard gate check for `iaa-prebrief-*.md`
existence when implementation file changes are present on the branch.

**Current state**: SHA `1667e0b` contains implementation changes but NO pre-brief artifact.
The CI gate is likely failing (or will fail) on this branch in its current state.

**Resolution**: This Pre-Brief artifact
(`.agent-admin/assurance/iaa-prebrief-wave-criteria-display-bugfix-1049.md`)
must be committed to the branch before the CI gate can pass. The Foreman must:
1. Commit this pre-brief artifact to the branch
2. Commit foreman FAIL-ONLY-ONCE v3.8.0
3. Commit wave-current-tasks.md
4. Verify CI passes with all three governance artifacts present
5. Then invoke IAA for full assurance

### BLOCKER-3 — Governance Artifacts Not Yet On Branch (PRE-CONDITION FOR IAA HANDOVER)

**Status**: ⚠️ MUST BE COMMITTED BEFORE IAA HANDOVER INVOCATION

Per wave-current-tasks.md, the following are "BEING COMMITTED" but not yet on the branch:
- `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v3.8.0
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`

These must be committed and pushed before IAA is invoked for Phase 2–4 assurance at
handover. If they are absent at handover invocation, IAA will fail CERT checks and issue
REJECTION-PACKAGE.

### NO-BLOCKER-1 — Schema Contract Check (RESOLVED ABOVE)

No schema contract check (A-032) is required. See § 4.2. This is not a blocker.

### WATCHPOINT-1 — ReDoS Risk on Regex

The new regex `/^[A-Za-z]+\s*/` in `normaliseMpsNumber` processes AI-returned strings.
IAA will check this for ReDoS vulnerability at handover (BD-018).
Preliminary assessment: the regex is anchored (`^`) and uses simple character classes
with no catastrophic backtracking. Low risk. Confirm at handover.

---

## § 7 — Checklist: What IAA Will Verify at Handover (Complete List)

For Foreman reference — these are the exact checks IAA will run when invoked for
Phase 2–4 assurance after PREHANDOVER proof is submitted.

### Universal Ceremony Gate (CERT)
- [ ] CERT-001: PREHANDOVER proof exists at declared path
- [ ] CERT-002: Session memory exists
- [ ] CERT-003: FAIL-ONLY-ONCE attestation declared in session memory preamble
- [ ] CERT-004: `iaa_audit_token:` field present in PREHANDOVER proof (may be PENDING)

### Core Invariants
- All applicable CORE-0xx checks per `iaa-core-invariants-checklist.md`
- CORE-018 evidence artifact sweep
- CORE-016 token file existence

### BUILD_DELIVERABLE (BD-TIER-1)
- [ ] BD-001: All promised deliverables present in diff (fix + 5 tests)
- [ ] BD-002: No stubs or TODOs in production paths
- [ ] BD-003: One-time build compliance (fix works end-to-end without another immediate fix)

### BUILD_DELIVERABLE (BD-TIER-2 — narrowed)
- [ ] BD-005: End-to-end wiring — normaliseMpsNumber → resolveMpsKey → validCriteriaList.filter() → criteria upsert chain is intact
- [ ] BD-009: Cross-component fit — no existing callers broken by the changed function signature or behaviour

### BUILD_DELIVERABLE (BD-TIER-3)
- [ ] BD-011: All 5 regression tests PASS (evidence required — not just a claim)
- [ ] BD-012: Zero test debt (.skip/.only/todo absent)
- [ ] BD-013: No test dodging (assertions are meaningful — verified above in § 4.1)

### BUILD_DELIVERABLE (BD-TIER-4 — narrowed)
- [ ] BD-016: No hardcoded secrets or credentials
- [ ] BD-017: Input validation on AI-returned string (`v.trim()` present)
- [ ] BD-018: No ReDoS or injection vectors in regex `/^[A-Za-z]+\s*/`

### BUILD_DELIVERABLE (BD-TIER-5 — advisory)
- [ ] BD-020: Clean coding structure in normaliseMpsNumber (short function, single responsibility)
- [ ] BD-021: TypeScript strictness — no `any`, no unsafe casts in the fix
- [ ] BD-022: Architecture alignment — does the fix match pipeline architecture in `modules/mat/02-architecture/`?
- [ ] BD-024: Could it be done better? (IAA senior-engineer prerogative)

### KNOWLEDGE_GOVERNANCE (OVL-KG)
- [ ] OVL-KG-001: INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 rule clearly stated and actionable
- [ ] OVL-KG-002: Rule is traceable to real incident (this wave — confirmed)
- [ ] OVL-KG-003: No duplication with existing A-031/A-033 entries
- [ ] OVL-KG-004: No dangling cross-references in the new rule
- [ ] OVL-KG-ADM-001: PREHANDOVER ceremony complete (covered by CERT)
- [ ] OVL-KG-ADM-002: FAIL-ONLY-ONCE version bumped (v3.7.x → v3.8.0)
- [ ] OVL-KG-ADM-003: Index.md updated to reflect v3.8.0

### INJECTION_AUDIT_TRAIL
- [ ] Pre-Brief artifact committed to branch (this document)
- [ ] wave-current-tasks.md committed to branch
- [ ] OVL-INJ: no injection bypass detected in wave execution trail

---

## § 8 — Summary Answer to IAA Specific Questions

| Question | Answer |
|----------|--------|
| Is a revert required? | **NO** — CS2 re-alignment directive authorises retroactive ceremony. Fix is technically correct. Violation is on record as INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001. PREHANDOVER must cite the CS2 directive by reference. |
| Which FFA phases (1–4) are required? | **All four FFA tiers (BD-TIER-1 through BD-TIER-4) are required**, plus BD-TIER-5 advisory. See § 4.1 for per-check narrowing applicable to this JS-only bugfix. |
| Schema contract check (A-032) required? | **NO** — fix is JS logic only. No schema DDL, no column name changes, no INSERT payload changes. A-032 is not triggered. See § 4.2. |

---

## § 9 — Handover Invocation Requirements

When the Foreman is ready to invoke IAA for full Phase 2–4 assurance, the following
must ALL be true:

1. ✅ This pre-brief artifact is committed to branch
2. ✅ `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` v3.8.0 is committed
3. ✅ `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` is committed
4. ✅ PREHANDOVER proof is committed at the declared path with all required sections (§ 5)
5. ✅ CI passes (S-023 gate — polc-boundary-gate.yml builder-involvement-check)
6. ✅ All 5 regression tests GREEN (test run evidence available)

Only then invoke IAA for Phase 2–4 assurance. IAA will issue ASSURANCE-TOKEN or REJECTION-PACKAGE as a binary verdict.

---

**Pre-Brief ID**: IAA-PREBRIEF-wave-criteria-display-bugfix-1049-20260310
**Status**: ISSUED — PHASE_B_BLOCKING
**IAA Version**: 6.2.0
**Authority**: CS2 (@APGI-cmy)
**Next action**: Foreman to commit this artifact and governance files, then invoke IAA at handover with PREHANDOVER proof.
