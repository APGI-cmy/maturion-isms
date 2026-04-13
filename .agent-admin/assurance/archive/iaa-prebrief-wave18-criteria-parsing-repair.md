# IAA Pre-Brief — Wave 18: MAT Criteria Parsing Pipeline End-to-End Repair

**Pre-Brief ID**: IAA-PREBRIEF-wave18-criteria-parsing-repair-20260315
**Wave**: Wave 18 — MAT Criteria Parsing Pipeline End-to-End Repair (LDCS Implementation)
**Branch**: `copilot/repair-mat-criteria-parsing-pipeline`
**Triggering Issue**: maturion-isms#1114
**Date**: 2026-03-15
**Produced by**: independent-assurance-agent v6.2.0
**Session**: session-prebrief-wave18-criteria-parsing-20260315
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)

---

## § 0 — Pre-Brief Mode Confirmation

This document is a **PRE-BRIEF artifact only**.

IAA is **NOT** executing Phase 2–4 assurance in this session.
Full assurance (ASSURANCE-TOKEN or REJECTION-PACKAGE) will be issued **per batch PR**
at handover when the Foreman invokes IAA with a completed PREHANDOVER proof.

This Pre-Brief declares:
- All trigger categories applicable to Wave 18
- All FFA / core-invariant / overlay checks IAA will run at handover
- The required PREHANDOVER proof structure Foreman and builder agents must satisfy
- Scope blockers and governance conflicts visible at wave-start

---

## § 1 — Phase 1 Identity Attestation

> "I am **independent-assurance-agent**, class: **assurance**, version **6.2.0**.
> My role: Independent hard-gate assurance for all maturion-isms PRs in scope.
> My class boundary: I do not produce, draft, or contribute to any artifact under review.
> Independence requirement: I must not be the same agent that produced the work under review.
> STOP-AND-FIX mandate: ACTIVE — one fail = REJECTION-PACKAGE, no exceptions.
> No class exceptions: All agent classes subject to IAA without exception.
> Ambiguity rule: Ambiguity resolves to mandatory invocation, never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001 — CONSTITUTIONAL — CANNOT BE OVERRIDDEN.
> Authority: CS2 only (@APGI-cmy). I do not act without it."

**Tier 2 Knowledge**: Knowledge version 2.9.0 — all 8 required files PRESENT.
**FAIL-ONLY-ONCE registry**: v2.5.0 — A-001 through A-032 ACTIVE.
**PHASE_B_BLOCKING**: Hard gate enforcement ACTIVE — REJECTION-PACKAGE prevents PR open.
**Prior sessions reviewed**: session-wave16-full-batch-20260310, session-wave16-orchestration-20260309-R2,
session-wave16-orchestration-20260309, session-wave15r-gov-20260308-R2, session-wave15r-impl-R2-20260308.
**Open REJECTION-PACKAGEs carried forward**: NONE.
**Breach registry**: No open breaches.

---

## § 2 — Wave 18 Scope Review

### Issue Authority

Issue maturion-isms#1114 was opened by CS2 (@APGI-cmy) on 2026-03-15 and assigns `foreman-v2-agent`.
This constitutes valid CS2 wave-start authorization per Foreman contract §2.1.

### Confirmed Failures (8 Gaps)

| # | Gap | Layer | Severity |
|---|-----|-------|----------|
| 1 | Upload fails: `Failed to upload file: Failed to fetch` — RLS/bucket/profile config | Frontend → Storage | 🔴 CRITICAL |
| 2 | `guidance` column receives `source_anchor` (page reference), not guidance text | Edge Function write-back | 🔴 CRITICAL |
| 3 | `criteria` table missing `intent_statement` column | DB Schema | 🔴 CRITICAL |
| 4 | AI system prompt does not extract `intent_statement` or `guidance` as distinct fields | AI Gateway (parsing.py) | 🔴 CRITICAL |
| 5 | AI system prompt does not extract 5-level maturity descriptors per criterion | AI Gateway (parsing.py) | 🔴 HIGH |
| 6 | Descriptor tables exist but Edge Function never writes to them | Edge Function write-back | 🔴 HIGH |
| 7 | No Criteria Review/Approval screen — user cannot see/edit/approve extracted structure | Frontend UX | 🔴 HIGH |
| 8 | `source_anchor` not stored separately — lost when repurposed as `guidance` | DB Schema | 🟡 MEDIUM |

### Delegated Builder Tasks

| Task ID | Description | Builder(s) | Status at Pre-Brief |
|---------|-------------|------------|---------------------|
| T-W18-004 | Red QA test suite for all 8 gaps | qa-builder | PENDING |
| T-W18-005 | Schema migration: add `intent_statement`, `source_anchor` to `criteria` table | schema-builder | PENDING |
| T-W18-006 | Fix upload RLS/bucket/profile config (Gaps 1, 8) | schema-builder + api-builder | PENDING |
| T-W18-007 | Fix AI system prompt: extract `intent_statement`, `guidance`, 5-level maturity descriptors | api-builder (mat-specialist assist) | PENDING |
| T-W18-008 | Fix Edge Function write-back: `guidance` field + descriptor table writes (Gaps 2, 5, 6) | api-builder | PENDING |
| T-W18-009 | Frontend: Criteria Review/Approval screen (Gap 7) | ui-builder | PENDING |

---

## § 3 — IAA Trigger Categories Declared for Wave 18

### Primary Trigger Category

| Category | Status | Authority |
|----------|--------|-----------|
| **AAWP_MAT** (BUILD_DELIVERABLE overlay) | ✅ ACTIVE — ALL 6 build tasks qualify | iaa-category-overlays.md §BUILD_DELIVERABLE |

### Secondary Mandatory Triggers

| Trigger | Applies To | Mandate Level | Authority |
|---------|-----------|---------------|-----------|
| **A-032 Schema Column Compliance** | T-W18-005 (criteria migration DDL) + T-W18-008 (Edge Function writes to 3 descriptor tables) | **HARD-MANDATORY** — IAA MUST read migration DDL and cross-check every INSERT/SELECT column name | FAIL-ONLY-ONCE A-032 |
| **BD-015 RLS Policies Complete** | T-W18-006 (upload fix), T-W18-005 (new `source_anchor` column, `intent_statement` column) | **HARD-MANDATORY** — SELECT/INSERT/UPDATE/DELETE policies required for every role on every affected table | iaa-category-overlays.md §BD-TIER-4 |
| **PRE_BRIEF_ASSURANCE (OVL-INJ-001)** | This artifact (must be committed before first builder task artifact) | **MANDATORY** — Pre-Brief existence checked at handover | iaa-category-overlays.md §PRE_BRIEF_ASSURANCE |
| **OVL-AM-CST-01 CST Checkpoint** | End of T-W18-008 + T-W18-009 (cross-boundary convergence: AI → Edge Function → DB → UI) | **WARRANTED** — cross-module integration point requires CST before wave completion | index.md §CST/CWT/FCWT |
| **OVL-AM-CWT-01 CWT Mandatory** | Before IBWR / wave closure | **MANDATORY** — IBWR cannot close without CWT PASS evidence | index.md §CWT |

### Categories NOT Triggered

| Category | Status | Justification |
|----------|--------|---------------|
| AGENT_CONTRACT | ❌ NOT triggered | No `.github/agents/*.md` files in wave 18 scope |
| CANON_GOVERNANCE | ❌ NOT triggered | No governance/canon changes in wave 18 scope |
| CI_WORKFLOW | ❌ NOT triggered | No `.github/workflows/*.yml` changes in wave 18 scope — **CONDITION**: if any builder task touches a workflow-adjacent path (Edge Function, test runner config), CORE-023 will activate at handover |
| KNOWLEDGE_GOVERNANCE | ❌ NOT triggered | No Tier 2 knowledge changes in wave 18 scope |

> **A-022 Mandatory Re-Evaluation Note**: These classifications are declared at wave-start based on currently known scope. Per FAIL-ONLY-ONCE A-022, IAA MUST re-evaluate all trigger categories at handover invocation. New commits can introduce new trigger categories. If any wave 18 PR includes unexpected `.github/agents/` modifications, CI workflow changes, or canon updates, those categories activate immediately.

---

## § 4 — FFA Checks IAA Will Run at Handover

IAA will execute **all** of the following at handover. Foreman and builders should self-check
against this list before invoking IAA.

### 4.1 — CORE Invariants (CORE-001 to CORE-023)

All 23 core invariants apply to every handover invocation. Critical ones for Wave 18 context:

| Check | Specific Wave 18 Relevance |
|-------|---------------------------|
| CORE-007 No placeholder content | AI system prompt, Edge Function logic, schema migration — no TODO/STUB in production paths |
| CORE-013 IAA invocation evidence | PREHANDOVER proof must contain `iaa_audit_token` referencing this wave18 pre-brief and final token |
| CORE-015 Session memory present | Foreman + each builder session memory file must be on branch |
| CORE-016 IAA token file existence | Dedicated `.agent-admin/assurance/iaa-token-session-wave18-*` file must be written at verdict |
| CORE-018 Complete evidence sweep | PREHANDOVER + session memory + iaa_audit_token + token file — all 4 must be present |
| CORE-023 Workflow integrity ripple | If Edge Function path or test config changes — affected workflow `paths:` triggers must be verified |

### 4.2 — BUILD_DELIVERABLE Overlay Checks (BD-001 to BD-024 + FFA)

IAA will execute all 24 BD checks. Highest-risk checks for Wave 18:

#### BD-TIER-1 Delivery Completeness

| Check | Wave 18 Specific Application |
|-------|------------------------------|
| **BD-001 Full scope delivered** | All 8 gaps must be addressed. A PR that claims "Wave 18 complete" but leaves any of the 8 gaps unresolved = REJECTION-PACKAGE citing the specific missing gap(s). |
| **BD-002 No stub/TODO in production paths** | AI system prompt must be fully implemented — no placeholder extraction patterns. Edge Function write-back must write all 4 targets: `criteria.guidance`, `criteria.intent_statement`, `criteria.source_anchor`, plus all 3 descriptor tables. |
| **BD-003 One-time build compliance** | The pipeline must work end-to-end after merge: upload → parse → write-back → review screen — first time deployed. |

#### BD-TIER-2 Wiring & Integration

| Check | Wave 18 Specific Application |
|-------|------------------------------|
| **BD-005 End-to-end wiring** | Trace: File upload UI → Supabase Storage → Edge Function invocation → AI Gateway (parsing.py) → structured JSON response → Edge Function write-back → `criteria` + descriptor tables → Criteria Review/Approval screen. Every link in this chain must be verifiable in the diff or existing code. |
| **BD-006 Writers and readers** | New columns `intent_statement`, `source_anchor`: must have verified INSERT path (Edge Function) AND SELECT path (Criteria Review screen or hook). New descriptor table rows: must have verified INSERT path (Edge Function) AND reader (Review screen). |
| **BD-009 Cross-component fit** | AI Gateway response JSON schema must match what Edge Function expects. Edge Function write-back column names must match DB migration DDL exactly (A-032 gate). Review screen query must match the actual table/column structure. |

#### BD-TIER-3 Test Quality

| Check | Wave 18 Specific Application |
|-------|------------------------------|
| **BD-011 100% test pass rate** | qa-builder Red QA suite must be GREEN before handover. Zero failures. |
| **BD-012 Zero test debt** | No `.skip()`, `.only()`, or `test.todo()` in the submitted test suite. |
| **BD-013 No test dodging** | Upload test must actually attempt upload and verify file appears in storage. Parse test must verify `intent_statement` and `guidance` contain extracted document text, not page references. Descriptor tests must verify the 5-level structure is populated. Review screen tests must render the approval workflow. |

#### BD-TIER-4 Security

| Check | Wave 18 Specific Application |
|-------|------------------------------|
| **BD-015 RLS policies complete** | `criteria` table RLS must cover all roles for SELECT/INSERT/UPDATE on new columns. Supabase Storage bucket must have correct RLS for the upload path — `authenticated` role must be permitted. All 3 descriptor tables must have RLS policies verified. |
| **BD-017 Input validation** | File upload must validate file type/size before submission. AI response parsing must validate structure before writing to DB. |

#### BD-TIER-5 Code Quality (IAA Judgement)

| Check | Wave 18 Specific Application |
|-------|------------------------------|
| **BD-022 Architecture alignment** | AI system prompt changes must align with the mat-specialist / criteria-generator domain model for LDCS. Edge Function write-back refactor must follow the existing pattern established in prior waves. |
| **BD-024 Could it be done better** | IAA will flag any prompt-engineering antipatterns in parsing.py if a materially cleaner extraction structure is available. |

#### BD-TIER-6 FFA Summary (required at handover)

At handover IAA will produce:

```
FFA Result:
  FFA-01 Delivery Completeness: [PASS|FAIL] — <all 8 gaps addressed>
  FFA-02 Wiring Verification: [PASS|FAIL] — <upload → parse → write-back → review chain complete>
  FFA-03 Integration Fit: [PASS|FAIL] — <AI JSON schema ↔ Edge Function ↔ DB DDL ↔ UI>
  FFA-04 Security: [PASS|FAIL] — <RLS policies + input validation>
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL] — <prompt engineering + write-back pattern>
  FFA-06 One-Time Build: [PASS|FAIL] — <pipeline works end-to-end on first deploy>
  FFA-CARRY-FORWARD: [NONE|ISSUED] — <any pre-existing broken state outside this scope>
```

### 4.3 — A-032 Schema Column Compliance Check (MANDATORY HARD GATE)

Per FAIL-ONLY-ONCE A-032, **IAA MUST read migration DDL directly** for every PR that includes
INSERT or SELECT operations on named Supabase tables.

**Wave 18 A-032 Scope:**

| Table | New Columns Expected | Edge Function Operation | DDL Verification Required |
|-------|---------------------|------------------------|--------------------------|
| `criteria` | `intent_statement` (text), `source_anchor` (text) | INSERT (write-back) + SELECT (review screen) | ✅ IAA reads migration file directly |
| `criteria_level_descriptors` | Existing — confirm column names used in write-back match DDL | INSERT (write-back) | ✅ IAA reads DDL directly |
| `mps_level_descriptors` | Existing — confirm column names used in write-back match DDL | INSERT (write-back) | ✅ IAA reads DDL directly |
| `domain_level_descriptors` | Existing — confirm column names used in write-back match DDL | INSERT (write-back) | ✅ IAA reads DDL directly |

> **A-032 Fail condition**: Any column name used in INSERT/SELECT that does not exist in the actual
> migration DDL = **immediate REJECTION-PACKAGE**. Mocked tests do NOT satisfy this check.
> IAA reads the DDL file. Silent try/catch does NOT exempt.

### 4.4 — PRE_BRIEF_ASSURANCE Overlay

| Check | Wave 18 Application |
|-------|---------------------|
| **OVL-INJ-001 Pre-Brief artifact existence** | This artifact (committed at wave-start, before any builder task artifact) must be present on branch at handover invocation |
| **OVL-INJ-ADM-001 Non-empty** | This artifact is substantive — IAA will verify it is not a stub |
| **OVL-INJ-ADM-002 Wave reference match** | This artifact's header declares Wave 18 and matches `wave-current-tasks.md` |

### 4.5 — CST / CWT Obligations

| Gate | Trigger | IAA Mandate |
|------|---------|-------------|
| **CST** — Combined Subwave Test | After T-W18-008 and T-W18-009 deliver (AI→Edge Function→DB→UI chain complete) | **WARRANTED** — Foreman must commission CST covering the upload→parse→review end-to-end path before wave completion. IAA will check for CST evidence or documented skip rationale at handover. |
| **CWT** — Combined Wave Test | Before IBWR / wave closure certification | **MANDATORY** — IBWR cannot close without CWT PASS covering all modules through Wave 18. Missing CWT PASS = REJECTION-PACKAGE (OVL-AM-CWT-01). |

---

## § 5 — Required PREHANDOVER Proof Structure

The Foreman MUST produce a PREHANDOVER proof before invoking IAA at handover. It must contain
**all** of the following. Missing any item = REJECTION-PACKAGE before assurance checks begin.

```markdown
# PREHANDOVER Proof — Wave 18: MAT Criteria Parsing Pipeline End-to-End Repair

## Mandatory Fields

session_id: session-wave18-[YYYYMMDD]
wave: wave18-criteria-parsing-repair
branch: copilot/repair-mat-criteria-parsing-pipeline
pr_number: [PR number — filled when PR is opened]
invoking_agent: foreman-v2-agent
producing_agents: [list all builders who contributed]
iaa_prebrief_artifact: .agent-admin/assurance/iaa-prebrief-wave18-criteria-parsing-repair.md
iaa_audit_token: IAA-session-wave18-criteria-parsing-[YYYYMMDD]-PASS
  # Pre-populate this reference format before commit. IAA writes the actual token file.
  # Per A-029: PREHANDOVER is READ-ONLY after commit — do NOT edit iaa_audit_token post-commit.

## Scope Declaration

SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly.
Per A-026: stale SCOPE_DECLARATION = BL-027 merge gate parity failure.
Per A-028: list format required; prior-wave entries must be trimmed.

## Gap Closure Attestation (all 8 must be attested)

| Gap # | Description | Builder | Fix Artifact | Status |
|-------|-------------|---------|-------------|--------|
| 1 | Upload fails — RLS/bucket/profile fix | schema-builder + api-builder | [path] | COMPLETE |
| 2 | `guidance` receives `source_anchor` — Edge Function write-back fix | api-builder | [path] | COMPLETE |
| 3 | `intent_statement` column missing — schema migration | schema-builder | [path] | COMPLETE |
| 4 | AI prompt does not extract intent_statement/guidance — prompt fix | api-builder | [path] | COMPLETE |
| 5 | AI prompt does not extract 5-level descriptors — prompt fix | api-builder | [path] | COMPLETE |
| 6 | Descriptor tables not written — Edge Function fix | api-builder | [path] | COMPLETE |
| 7 | No Review/Approval screen — UI build | ui-builder | [path] | COMPLETE |
| 8 | `source_anchor` not stored — schema migration | schema-builder | [path] | COMPLETE |

## A-032 Self-Check Evidence

Foreman must attest:
- [ ] schema-builder migration DDL for `criteria` table reviewed — `intent_statement` (text) and `source_anchor` (text) columns confirmed present
- [ ] Edge Function write-back column names cross-checked against `criteria_level_descriptors` DDL
- [ ] Edge Function write-back column names cross-checked against `mps_level_descriptors` DDL
- [ ] Edge Function write-back column names cross-checked against `domain_level_descriptors` DDL

## RLS Self-Check Evidence (BD-015)

Foreman must attest:
- [ ] `criteria` table: SELECT/INSERT/UPDATE/DELETE policies present for all relevant roles including new columns
- [ ] Supabase Storage bucket: `authenticated` role permitted for upload path
- [ ] All 3 descriptor tables: SELECT/INSERT policies present for all relevant roles

## Test Evidence

- qa-builder test suite: [path to test file(s)]
- Test run result: ALL PASS — zero failures, zero skips, zero debt
- Evidence of test run: [path to test output or CI run reference]

## CST / CWT Evidence

- CST checkpoint: [RECORDED — scope: upload→parse→review | SKIP with rationale: ]
- CWT PASS verdict: [PENDING until CWT run | PASS — scope: [waves covered]]
  # CWT is MANDATORY. IBWR cannot close without CWT PASS.

## Session Memory Files

- Foreman session memory: .agent-workspace/foreman-v2-agent/memory/session-wave18-[YYYYMMDD].md
- qa-builder session memory: [path]
- schema-builder session memory: [path]
- api-builder session memory: [path]
- ui-builder session memory: [path]

## Pre-IAA Commit Gate Evidence (A-021 / A-027)

git status output (must show clean working tree):
[paste git status here]

git log --oneline -5 output (must show all artifacts committed):
[paste git log here]
```

> **A-029 Reminder**: After committing the PREHANDOVER proof, it is **READ-ONLY**.
> Do NOT edit `iaa_audit_token` or any other field post-commit.
> IAA writes its token to a **dedicated new file** at `.agent-admin/assurance/iaa-token-session-wave18-*-YYYYMMDD.md`.

---

## § 6 — Scope Blockers and Governance Conflicts

### Blocker B-01: No Build Work Before IAA Pre-Brief Committed

**Status**: BLOCKING until this artifact is committed to branch.
**Rule**: Issue #1114 declares "NO implementation, migration, or build work may commence until
Phase 2 (IAA Pre-Brief approval) is issued." This artifact IS the Pre-Brief issuance.
**Resolution**: This artifact must be committed. Foreman may proceed to delegate builder tasks
only after this commit is confirmed on branch.

### Blocker B-02: Governance Overlays Must Be Written Before Implementation

**Status**: Per issue #1114 Phase 1 requirements — Foreman must document:
1. Which files will be modified per gap
2. Layer-by-layer change plan
3. Risk surface and rollback plan

If governance overlays are not complete before api-builder/schema-builder/ui-builder are
invoked, any resulting PREHANDOVER proof will fail BD-022 (architecture alignment).

**Resolution**: Foreman completes Phase 1 governance overlays before delegating T-W18-004 onwards.

### Advisory A-01: CORE-023 Workflow Integrity — Conditional Activation

**Status**: ADVISORY at wave-start.
**Condition**: If api-builder's changes to `parsing.py` (AI Gateway Edge Function) touch any
file path referenced by `.github/workflows/` `paths:` triggers — CORE-023 activates as a
**hard gate** at handover. IAA will verify affected workflow files remain syntactically valid.
**Resolution**: api-builder must note any workflow-adjacent path changes in its session memory.
Foreman must include workflow verification in PREHANDOVER proof if any such changes exist.

### Advisory A-02: Mat-Specialist Assist Boundary

**Status**: ADVISORY.
**Condition**: Issue #1114 lists `mat-specialist` as "assist" on T-W18-007. Per POLC boundaries,
mat-specialist provides domain knowledge guidance (LDCS criteria structure, 5-level descriptor
semantics) but does NOT produce code artifacts. All code artifacts must be produced by api-builder.
**Resolution**: Foreman ensures mat-specialist output is advisory only; api-builder commits
all production code changes.

### Advisory A-03: CST Commissioning Responsibility

**Status**: ADVISORY — must be actioned before wave completion.
**Condition**: After T-W18-008 (Edge Function) and T-W18-009 (Review screen) are both complete,
a CST is warranted covering the full upload→parse→review chain. Per `COMBINED_TESTING_PATTERN.md`
§4.2, the Foreman must commission this CST. Absence of CST evidence at handover will be noted
as a finding. If CST is skipped, a documented rationale must be present in the PREHANDOVER proof.
**Resolution**: Foreman schedules CST after T-W18-008 and T-W18-009 both reach COMPLETE status.

### Advisory A-04: `source_anchor` Traceability — Gap 8 Is Not Cosmetic

**Status**: ADVISORY — medium severity as declared but with high audit risk.
**Condition**: Gap 8 (`source_anchor` stored separately) is listed as MEDIUM severity. However,
`source_anchor` is a traceability reference for LDCS compliance. Loss of `source_anchor` breaks
audit traceability. IAA will treat Gap 8 as a BD-001 (full scope) check — it is NOT optional
for LDCS compliance even though severity is MEDIUM.
**Resolution**: schema-builder must add `source_anchor` column in the same migration as
`intent_statement`. They CANNOT be split into separate PRs.

---

## § 7 — FAIL-ONLY-ONCE Rules Pre-Declared for Wave 18

The following FAIL-ONLY-ONCE rules are most likely to be triggered in Wave 18. Foreman and
builders should self-check against all rules before invoking IAA.

| Rule | Description | Wave 18 Risk |
|------|-------------|--------------|
| **A-001** | IAA invocation evidence must be present | HIGH — PREHANDOVER must have `iaa_audit_token` |
| **A-021** | Commit before invoking IAA | HIGH — all artifacts must be committed, not just in working tree |
| **A-026** | SCOPE_DECLARATION must match PR diff exactly | HIGH — 6 build tasks span multiple files |
| **A-028** | SCOPE_DECLARATION format compliance (list format, prior-wave entries trimmed) | MEDIUM |
| **A-029** | PREHANDOVER immutability — READ-ONLY post-commit | HIGH — pre-populate token reference |
| **A-032** | Schema Column Compliance — read DDL directly for INSERT/SELECT operations | **CRITICAL** — 4 tables affected |

---

## § 8 — Pre-Brief Verdict

This Pre-Brief is **ISSUED**. Wave 18 build tasks may commence following Foreman's Phase 1
governance overlay documentation per issue #1114 §Phase 1.

No scope blockers exist that prevent wave start. Blockers B-01 and B-02 will be resolved
by committing this artifact (B-01) and Foreman completing governance overlays (B-02)
before delegating builder tasks.

IAA will be invoked at handover for full Phase 2–4 assurance when the PREHANDOVER proof
is complete and all builder tasks are committed to branch.

---

**IAA Pre-Brief Status**: ✅ ISSUED
**Token**: IAA-PREBRIEF-wave18-criteria-parsing-repair-20260315
**Next IAA Action**: Phase 2–4 assurance at handover when Foreman invokes with completed PREHANDOVER proof
**Authority**: CS2 (@APGI-cmy)
**independent-assurance-agent v6.2.0 | PHASE_B_BLOCKING | STOP-AND-FIX MANDATE ACTIVE**
