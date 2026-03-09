# IAA Pre-Brief — Wave 16 Build (Completeness Gap Resolution)

**Type**: Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave**: wave-16-build
**IAA Session**: session-prebrief-wave-16-build-20260309
**Date**: 2026-03-09
**Branch**: copilot/orchestrate-wave-16-build
**Triggering Issue**: maturion-isms#1026 — "Orchestrate Wave 16 Implementation Build for Completeness Gaps (see PR #1020)"
**IAA Agent**: independent-assurance-agent v6.2.0 / contract v2.2.0
**Authority**: CS2 (@APGI-cmy)
**Adoption Phase**: PHASE_B_BLOCKING — verdicts are hard-blocking gates

---

## Phase 1 Identity Declaration (executed per contract §Phase 1)

> I am independent-assurance-agent, class: assurance, version 6.2.0.
> My role: Independent Assurance Agent.
> My class boundary: NOT a builder, foreman, or overseer. Does NOT write code, contracts,
> schemas, or implementation artifacts. Outputs: verification verdicts and Pre-Brief
> artifact only.
> Independence requirement: Must never review work I produced or contributed to. If
> detected → HALT-001, escalate to CS2.
> STOP-AND-FIX mandate: STOP-AND-FIX gate. REJECTION-PACKAGE stops all work — no PR opens,
> no merge proceeds. No exceptions, no deferrals, no negotiated verdicts.
> No class exceptions: IAA mandatory for ALL agent contracts — Foreman, builder, overseer,
> specialist, every class. Exemption claim = governance violation.
> Ambiguity rule: Ambiguity about IAA requirement resolves to mandatory invocation —
> never to exempt.
> Active constitutional lock: SELF-MOD-IAA-001.
> Authority: CS2 only (@APGI-cmy). I do not act without it.

**Tier 2 Knowledge**: Knowledge version 2.7.0. All 8 required files present (index.md,
FAIL-ONLY-ONCE.md, iaa-core-invariants-checklist.md, iaa-trigger-table.md,
iaa-category-overlays.md, session-memory-template.md, IAA_ZERO_SEVERITY_TOLERANCE.md,
IAA_AGENT_CONTRACT_AUDIT_STANDARD.md). FAIL-ONLY-ONCE registry: PRESENT (v2.5.0, rules
A-001 through A-032 active). Adoption phase: PHASE_B_BLOCKING.

**CANON_INVENTORY check**: 191 entries. No null/placeholder SHA256 hashes. IAA canon
present: YES (INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.4.0, SHA256:
0a5f860b18287ab47692a8d8d088bec39f863bbaa22d72054d4a3787811bbade). PASS.

**Orientation Mandate acknowledged**: Proceeding as quality engineer, not file auditor.
90% effort = substantive build quality. 10% effort = ceremony existence checks.

---

## Step 0.1 — Pre-Brief Invocation Confirmed

Invocation contains `[IAA PRE-BRIEF REQUEST]` — entering PRE-BRIEF mode.
Phase 2–4 assurance work is NOT executed in this session.
This artifact is the complete output of this session.

---

## Step 0.2 — Wave-Current-Tasks.md Read

File: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
Wave: **wave-16-build**
Session declared: `session-wave-16-build-20260309`
Branch: `copilot/orchestrate-wave-16-build`

**Tasks declared (10 total)**:

| ID | Task | Agent | Status |
|----|------|-------|--------|
| T-W16-QA-001 | RED QA tests — Wave 16.1 (Evidence Collection Page Wire) | qa-builder | 🔴 PENDING |
| T-W16-QA-002 | RED QA tests — Wave 16.2 (Frontend UX Completeness) | qa-builder | 🔴 PENDING |
| T-W16-QA-003 | RED QA tests — Wave 16.6 (Schema+Audit Completeness) | qa-builder | 🔴 PENDING |
| T-W16-QA-004 | RED QA tests — Wave 16.7 (ARC Portal Frontend) | qa-builder | 🔴 PENDING |
| T-W16-IMPL-001 | Wave 16.1 implementation — Evidence Collection Page Wire | ui-builder | 🔴 BLOCKED on QA gate |
| T-W16-IMPL-002 | Wave 16.2 implementation — 9 UX gaps | ui-builder | 🔴 BLOCKED on QA gate |
| T-W16-IMPL-003 | Wave 16.6 implementation — Schema+Audit Completeness | schema-builder + api-builder | 🔴 BLOCKED on QA gate |
| T-W16-IMPL-004 | Wave 16.7 implementation — ARC Portal Frontend | ui-builder | 🔴 BLOCKED on QA gate |
| T-W16-DOC-001 | Wave 16.8 — Documentation gaps | mat-specialist | 🔴 PENDING |
| T-W16-FM-001 | Foreman Phase 4 closure — PREHANDOVER, session memory, IAA audit | foreman-v2-agent | 🔴 PENDING |

---

## Step 0.3 — Qualifying Task Classification

Applying INDEPENDENT_ASSURANCE_AGENT_CANON.md §Trigger Table and `iaa-trigger-table.md`:

| Task ID | Classification | Trigger Category | Qualifying? | Reason |
|---------|---------------|-----------------|-------------|--------|
| T-W16-QA-001 | RED test creation — `modules/mat/tests/wave16/` | AAWP_MAT | ✅ QUALIFYING | MAT module test artifacts — executable QA deliverable |
| T-W16-QA-002 | RED test creation — `modules/mat/tests/wave16/` | AAWP_MAT | ✅ QUALIFYING | MAT module test artifacts — executable QA deliverable |
| T-W16-QA-003 | RED test creation — `modules/mat/tests/wave16/` | AAWP_MAT | ✅ QUALIFYING | MAT module test artifacts — executable QA deliverable |
| T-W16-QA-004 | RED test creation — `modules/mat/tests/wave16/` | AAWP_MAT | ✅ QUALIFYING | MAT module test artifacts — executable QA deliverable |
| T-W16-IMPL-001 | React/TypeScript frontend — `apps/mat-frontend/` | AAWP_MAT | ✅ QUALIFYING | Production frontend implementation — executable application behaviour |
| T-W16-IMPL-002 | React/TypeScript frontend — 9 UX gap components | AAWP_MAT | ✅ QUALIFYING | Production frontend implementation — executable application behaviour |
| T-W16-IMPL-003 | Supabase migrations + API endpoint — schema + JWT auth | AAWP_MAT | ✅ QUALIFYING | Schema migration + API — executable application behaviour |
| T-W16-IMPL-004 | React/TypeScript frontend — ARC portal page | AAWP_MAT | ✅ QUALIFYING | Production frontend implementation — executable application behaviour |
| T-W16-DOC-001 | Documentation only (`docs/`) — mat-specialist | EXEMPT | ❌ NOT QUALIFYING | Documentation-only — no executable code, no schema, no governance file |
| T-W16-FM-001 | Foreman ceremony — PREHANDOVER proof, session memory | AAWP_MAT (ceremony) | ✅ QUALIFYING | Wave closure ceremony is part of the AAWP_MAT deliverable bundle; PREHANDOVER proof and IAA token are required artifacts |

**Summary**: 9 qualifying tasks / 1 exempt. Primary trigger category: **AAWP_MAT**.
No AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, or KNOWLEDGE_GOVERNANCE changes are in scope.

---

## Step 0.4 — Pre-Brief Artifact: Per-Task IAA Requirements

---

### TASK GROUP A — RED QA Gate (T-W16-QA-001 through T-W16-QA-004)

**task_id**: T-W16-QA-001, T-W16-QA-002, T-W16-QA-003, T-W16-QA-004  
**task_summary**: qa-builder creates minimum 2 RED test files per sub-wave (16.1, 16.2, 16.6, 16.7). Tests must be genuinely failing before builder delegation is permitted.  
**iaa_trigger_category**: AAWP_MAT  
**required_phases**: Full IAA Phase 2–4 at wave handover (not per-task; RED gate is a foreman gate, not an IAA gate — IAA verifies the QA artifacts are present and RED at handover time)  

**required_evidence_artifacts** (at handover):
- `modules/mat/tests/wave16/wave16.1-evidence-page.test.ts` — ≥2 RED tests confirmed failing  
- `modules/mat/tests/wave16/wave16.2-ux-completeness.test.ts` — ≥2 RED tests confirmed failing  
- `modules/mat/tests/wave16/wave16.6-schema-audit.test.ts` — ≥2 RED tests confirmed failing  
- `modules/mat/tests/wave16/wave16.7-arc-portal.test.ts` — ≥2 RED tests confirmed failing  
- Test run output evidence showing RED status (committed — not just claimed)  

**applicable_overlays**: BD-TIER-3 (test quality), BD-011 through BD-013, A-032  
**specific_rules**:
- RED tests must be genuinely failing on the current codebase — not trivially passing by asserting incorrect behaviour
- BD-013 (no test dodging): test assertions must assert real application routing, component rendering, and database access — not always-pass vacuous checks
- Tests must be committed to branch before builder is delegated (A-021: commit before invoking)

---

### TASK GROUP B — Wave 16.1 Implementation (T-W16-IMPL-001)

**task_id**: T-W16-IMPL-001  
**task_summary**: ui-builder wires `/evidence` route to `EvidenceCollection.tsx`, turning RED gate tests GREEN.  
**gap_addressed**: GAP-003 — Evidence Collection Page currently stub; `EvidenceCollectionPage.tsx` exists but `/evidence` route is not wired to it  
**iaa_trigger_category**: AAWP_MAT  
**required_phases**: Full IAA Phase 2–4 at wave handover  

**required_evidence_artifacts** (at handover):
- `EvidenceCollection.tsx` fully wired component (not stub) present in diff  
- Router configuration diff showing `/evidence` → `EvidenceCollectionPage.tsx`  
- Wave 16.1 RED tests now GREEN with committed test output  
- ui-builder session memory committed to branch  

**applicable_overlays**: BD-001 through BD-024 (full BUILD_DELIVERABLE overlay)  
**specific_rules**:
- BD-003 (one-time build): after merge, navigating to `/evidence` must render the real component — not a placeholder — without further work
- BD-005 (end-to-end wiring): trace route declaration → component → Supabase query hook → data render; every link in the chain must be confirmed in the PR diff
- BD-007 (auth guards): evidence collection page must be behind auth; unauthenticated access must redirect or be blocked
- BD-010 (no orphans): the existing stub or placeholder implementation must be removed or replaced — no dead code alongside the new wiring
- OVL-AM-CST-01: When Wave 16.1 and Wave 16.6 are BOTH delivered, IAA will require a CST checkpoint (see §CST/CWT Requirements below)

---

### TASK GROUP C — Wave 16.2 Implementation (T-W16-IMPL-002)

**task_id**: T-W16-IMPL-002  
**task_summary**: ui-builder implements 9 UX completeness gaps: feedback/recommendations page, reports listing page, toast notification system, CriteriaModal navigation fix, interview playback, global audit context, gap_analysis display, unsaved-changes warnings, useAuditMetrics fix.  
**gaps_addressed**: GAP-006 (feedback/recommendations stub), GAP-007 (reports page stub), GAP-008 (toast notifications absent), GAP-009 (CriteriaModal navigation), GAP-014 (interview playback stub), GAP-015 (global audit context), GAP-020 (gap_analysis display), GAP-024 (unsaved-changes warnings), GAP-025 (useAuditMetrics fix)  
**iaa_trigger_category**: AAWP_MAT  
**required_phases**: Full IAA Phase 2–4 at wave handover  

**required_evidence_artifacts** (at handover):
- Component diffs for all 9 gap deliverables present in PR  
- Wave 16.2 RED tests now GREEN with committed test output  
- ui-builder session memory committed to branch  
- No stub returns, TODO comments, or placeholder values in any of the 9 delivered components  

**applicable_overlays**: BD-001 through BD-024 (full BUILD_DELIVERABLE overlay)  
**specific_rules**:
- BD-001 (full scope): IAA will cross-reference all 9 gap IDs against PR diff — any gap not evidenced in diff = REJECTION-PACKAGE
- BD-002 (no stubs): Each of the 9 components must have real data-bound implementation — no `return <div>Coming soon</div>` or equivalent
- BD-005 (wiring): feedback/recommendations and reports pages must be wired to their Supabase queries; IAA will check hook → component → router chain
- BD-020/BD-021 (code quality): useAuditMetrics fix must be substantive — diagnose and correct root cause, not just suppress the error

---

### TASK GROUP D — Wave 16.6 Schema + Audit Completeness (T-W16-IMPL-003)

**task_id**: T-W16-IMPL-003  
**task_summary**: schema-builder + api-builder delivers: RLS policy verification/completion for `scores` and `audit_scores`, audit logging expansion, JWT auth on `POST /api/ai/request`, `evidence_submissions` migration.  
**gaps_addressed**: GAP-011 (`scores` INSERT/UPDATE RLS), GAP-012 (`audit_scores` INSERT/UPDATE RLS), GAP-016 (audit logging expansion), GAP-017 (`POST /api/ai/request` JWT auth), GAP-019 (`evidence_submissions` table migration)  
**iaa_trigger_category**: AAWP_MAT  
**required_phases**: Full IAA Phase 2–4 at wave handover  

**required_evidence_artifacts** (at handover):
- New migration file in `apps/maturion-maturity-legacy/supabase/migrations/` (with unique timestamp) present in diff  
- `evidence_submissions` table DDL showing all column names  
- Audit logging expansion code showing `evidence_upload`, `score_confirmed`, `score_overridden`, `report_generated` actions
- `POST /api/ai/request` handler diff showing JWT authentication guard added  
- Wave 16.6 RED tests now GREEN with committed test output  
- schema-builder session memory committed to branch  
- api-builder session memory committed to branch  

**applicable_overlays**: BD-001 through BD-024 + A-032 (schema column compliance) — HIGHEST RISK SUB-WAVE  
**specific_rules**:

1. **A-032 HARD CHECK — MANDATORY (schema-builder MUST READ THIS)**:  
   IAA will read the migration DDL directly. For every column name in `evidence_submissions` INSERT/SELECT operations found in the codebase, IAA will cross-check that the column exists in the DDL. A column that does not exist in the migration DDL but is referenced in application code = immediate REJECTION-PACKAGE. This check is non-negotiable and cannot be bypassed by mocked tests.

2. **SCOPE CONFLICT ADVISORY — GAP-011/GAP-012 (read before building)**:  
   > ⚠️ **Pre-existing migration found**: `20260304000004_fix_rls_remaining_tables.sql` from Wave postbuild-fails-02 (TASK-PBF2-005 ✅ DONE) already implements the following policies:
   > - `scores_insert_authenticated` ON public.scores  
   > - `scores_update_own` ON public.scores  
   > - `audit_scores_insert_authenticated` ON public.audit_scores  
   > - `audit_scores_update_own` ON public.audit_scores  
   >
   > **Before building Wave 16.6 GAP-011/GAP-012**: The schema-builder MUST verify whether these existing policies satisfy the GAP-011 and GAP-012 requirements. If the existing policies are sufficient, the schema for these two gaps is ALREADY DONE and the Wave 16.6 migration must NOT attempt to re-create them (which would cause a Postgres conflict on migration apply). If the existing policies are insufficient or missing, proceed with the migration — but document the specific gap.
   >
   > **IAA at handover will verify**: schema-builder has examined the existing migration and either (a) confirmed it satisfies GAP-011/GAP-012 with evidence, or (b) documented why new policies are needed. Absence of this analysis = REJECTION-PACKAGE.

3. **BD-015 (RLS completeness)**: All four policy combinations (SELECT, INSERT, UPDATE, DELETE) must be confirmed for both `scores` and `audit_scores` for all relevant roles. Any missing policy = REJECTION-PACKAGE.

4. **BD-007 (JWT auth on `/api/ai/request`)**: The JWT guard must be applied before any processing. The fix must verify the token, extract the user/org, and return 401/403 on invalid token — not just log the absence.

5. **BD-006 (writers and readers for evidence_submissions)**: Once the table exists, there must be at least one committed writer (INSERT path) and one confirmed reader (SELECT path) in the codebase. An orphaned table with no application wiring = REJECTION-PACKAGE.

---

### TASK GROUP E — Wave 16.7 ARC Portal Frontend (T-W16-IMPL-004)

**task_id**: T-W16-IMPL-004  
**task_summary**: ui-builder implements ARC Review portal page — lists pending feedback items with criteria details, AI recommendations, approve/reject actions wired to existing ARC API endpoints.  
**gap_addressed**: GAP-013 — No ARC portal frontend; feedback approval workflow endpoints exist but have no UI  
**iaa_trigger_category**: AAWP_MAT  
**required_phases**: Full IAA Phase 2–4 at wave handover  

**required_evidence_artifacts** (at handover):
- ARC portal page component present in diff  
- Route wiring to ARC portal page present in diff  
- Role guard: ARC operator role enforced (unauthenticated/non-ARC users cannot access)  
- Wiring evidence: `approve` and `reject` actions wired to existing ARC API endpoints  
- Audit log write: ARC actions logged to `audit_logs`  
- Wave 16.7 RED tests now GREEN with committed test output  
- ui-builder session memory committed to branch  

**applicable_overlays**: BD-001 through BD-024  
**specific_rules**:
- BD-005 (end-to-end wiring): ARC portal must be wired to EXISTING ARC API endpoints (not new ones). IAA will verify the endpoint paths match what is already deployed.
- BD-007 (auth guards): ARC portal MUST be restricted to ARC operator role. Missing role guard = immediate REJECTION-PACKAGE.
- BD-008 / BD-009 (integration fit): Approve/reject responses must update the feedback item state visible to the ARC operator — no fire-and-forget without UI state refresh.
- BD-010 (no orphans): The ARC portal page must be linked from navigation — an unreachable page is an orphan.

---

### TASK GROUP F — Foreman Closure (T-W16-FM-001)

**task_id**: T-W16-FM-001  
**task_summary**: Foreman produces PREHANDOVER proof, session memory, committing all artifacts to branch, then invokes IAA for Phase 4 audit.  
**iaa_trigger_category**: AAWP_MAT (ceremony)  
**required_phases**: Full IAA Phase 2–4  

**required_evidence_artifacts** (at handover):
- `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-wave-16-build-20260309.md` committed  
- `.agent-workspace/foreman-v2/memory/session-wave-16-build-20260309.md` committed  
- All builder session memories committed: qa-builder (×4), ui-builder (×3), schema-builder (×1), api-builder (×1)  
- `SCOPE_DECLARATION.md` updated with accurate file list matching `git diff --name-only origin/main...HEAD` (A-026)  
- `iaa_audit_token` in PREHANDOVER proof pre-populated with expected reference `IAA-session-wave-16-build-20260309-PASS` (A-029)  
- A-031 carve-out note present in SCOPE_DECLARATION.md if any IAA session artifacts are excluded  

**applicable_overlays**: CORE-001 through CORE-022, BD-TIER-1 existence checks  
**specific_rules**:
- A-021: ALL artifacts must be committed BEFORE IAA invocation. Working-tree-only = REJECTION-PACKAGE.
- A-025/A-029: `iaa_audit_token` must use the expected reference format, not `PENDING` or blank.
- A-026: SCOPE_DECLARATION.md must be current — listing wave-specific files only (prior-wave entries trimmed per A-028).
- CORE-018: IAA will sweep for ALL evidence artifacts before proceeding to overlays.

---

## Section 1 — Trigger Categories Active for Wave 16 Build

| Category | Active? | Trigger Source | Sub-waves |
|----------|---------|---------------|-----------|
| **AAWP_MAT** | ✅ YES — PRIMARY | `modules/mat/tests/wave16/`, `apps/mat-frontend/`, `supabase/migrations/`, API handlers | All sub-waves: 16.1, 16.2, 16.6, 16.7 |
| AGENT_CONTRACT | ❌ NO | No `.github/agents/` changes declared in scope | — |
| CANON_GOVERNANCE | ❌ NO | No `governance/canon/` changes declared in scope | — |
| CI_WORKFLOW | ❌ NO | No `.github/workflows/` changes declared in scope | — |
| KNOWLEDGE_GOVERNANCE | ❌ NO | No `.agent-workspace/*/knowledge/` changes declared in scope | — |
| EXEMPT (doc-only) | T-W16-DOC-001 only | Wave 16.8 documentation — mat-specialist — not qualifying for IAA | 16.8 only |

**⚠️ AMBIGUITY RULE**: If any of the builder deliverables inadvertently touch `.github/agents/`, `governance/canon/`, or `.github/workflows/` during implementation, the trigger category becomes MIXED and CI_WORKFLOW/AGENT_CONTRACT/CANON_GOVERNANCE overlays activate. Foreman must ensure builders stay within declared scope.

---

## Section 2 — FFA Checks IAA Will Run at Handover

The following checks will be executed at IAA Phase 3 invocation:

### Core Invariants (CORE-001 through CORE-022 — all applicable)

| Check | Applicable to Wave 16? | Priority |
|-------|----------------------|----------|
| CORE-005 | Governance block in PREHANDOVER | HIGH |
| CORE-007 | No placeholder content in any delivered artifact | HIGH |
| CORE-013 | IAA invocation evidence present | HIGH |
| CORE-015 | All session memories present and committed | HIGH |
| CORE-016 | Dedicated IAA token file exists | HIGH |
| CORE-017 | No `.github/agents/` modifications | HIGH |
| CORE-018 | Complete evidence artifact sweep | CRITICAL — first check |
| CORE-019 | IAA token cross-verification | HIGH |
| CORE-020 | Zero partial pass rule | CRITICAL |
| CORE-021 | Zero-severity-tolerance | CRITICAL |
| CORE-022 | (per current checklist v2.8.0) | HIGH |

### BUILD_DELIVERABLE Overlay (BD-001 through BD-024 — all applicable)

| Check | What IAA Specifically Looks For in Wave 16 |
|-------|-------------------------------------------|
| BD-001 | All 9 Wave 16.1/16.2/16.6/16.7 gap deliverables evidenced in diff |
| BD-002 | No stub returns, TODO comments, or placeholder implementations in any of the 25 gap resolutions |
| BD-003 | One-time build: after merge, evidence page loads real content, 9 UX features function, ARC portal is accessible — no follow-up fix required |
| BD-005 | End-to-end wiring: route → component → hook → Supabase → UI for every new/wired page |
| BD-006 | `evidence_submissions` table has at least one writer (INSERT) and one reader (SELECT) wired |
| BD-007 | Auth guards: evidence page, ARC portal, `POST /api/ai/request` JWT — all three protected |
| BD-008 | FK integrity: `evidence_submissions` FKs to `audits`, `criteria`, `profiles` — application-layer enforcement present |
| BD-009 | Wave 16.2 fixes integrate with existing component architecture — no interface breakage |
| BD-010 | No orphaned components, routes, tables, or endpoints |
| BD-011 | All 4 sets of RED tests are GREEN with committed evidence |
| BD-012 | Zero test debt — no `.skip()`, `.only()`, or incomplete stubs |
| BD-013 | Tests assert real behaviour: routing, component output, DB queries — not vacuous always-pass checks |
| BD-015 | RLS: `scores`, `audit_scores`, `evidence_submissions` — SELECT, INSERT, UPDATE, DELETE for all relevant roles |
| BD-016 | No hardcoded secrets in migration files or API handler diffs |
| BD-017 | Input validation on ARC approve/reject actions and JWT auth endpoint |
| BD-018 | No SQL injection: `evidence_submissions` migration uses parameterised DDL; API handler uses prepared statements or Supabase client |
| BD-022 | Wave 16.1/16.2/16.6/16.7 implementations match Wave 16 architecture definitions in implementation-plan.md v2.7.0 |
| BD-023 | No deprecated API usage in new frontend components |
| BD-024 | Senior engineer judgement applied — IAA may propose improvements for any sub-optimal implementation found |

### FAIL-ONLY-ONCE Mandatory Checks

| Rule | What IAA Specifically Checks |
|------|------------------------------|
| A-021 | Git status: ALL artifacts committed before IAA is invoked — zero untracked/modified items in scope |
| A-026 | SCOPE_DECLARATION.md matches `git diff --name-only origin/main...HEAD` exactly |
| A-028 | SCOPE_DECLARATION.md uses list format; prior-wave entries trimmed |
| A-029 | `iaa_audit_token` = expected reference format; PREHANDOVER is read-only post-commit |
| A-031 | A-031 carve-out note present if IAA artifacts from earlier sessions excluded |
| **A-032** | **HARD CHECK**: Read `evidence_submissions` migration DDL directly; cross-check every column name referenced in INSERT/SELECT operations throughout codebase against DDL column list; any mismatch = immediate REJECTION-PACKAGE |

### CST / CWT Mandatory Checks

| Check | When | Mandatory? |
|-------|------|-----------|
| OVL-AM-CST-01 | When Wave 16.1 (Evidence Page) AND Wave 16.6 (Schema) are BOTH delivered in this PR | REQUIRED — cross-boundary integration point: frontend consuming schema changes |
| OVL-AM-CWT-01 | Before IBWR completion | **MANDATORY** — CWT PASS evidence must be in IBWR artefact |
| OVL-AM-FCWT-01 | Not applicable to this wave — not a final sign-over wave | NOT APPLICABLE |

### Injection Audit Trail Check

| Check | What IAA Checks |
|-------|----------------|
| OVL-INJ-001 | IAA injection audit trail signatures present per `iaa-category-overlays.md` v3.2.0 §INJECTION_AUDIT_TRAIL; PREHANDOVER proof contains required OVL-INJ-001 section |

---

## Section 3 — PREHANDOVER Proof Structure Required

The Foreman's PREHANDOVER proof for Wave 16 build MUST contain the following fields and sections. Absence of any BLOCKING field = REJECTION-PACKAGE.

```markdown
# PREHANDOVER Proof — session-wave-16-build-20260309

## Metadata
- session_id: session-wave-16-build-20260309
- wave: wave-16-build
- branch: copilot/orchestrate-wave-16-build
- triggering_issue: maturion-isms#1026
- commit_sha: [ACTUAL SHA — not placeholder]
- producing_agents: [list all: foreman, qa-builder, ui-builder, schema-builder, api-builder]

## Scope Declaration
- SCOPE_DECLARATION.md path: SCOPE_DECLARATION.md
- A-026 attestation: "SCOPE_DECLARATION.md matches `git diff --name-only origin/main...HEAD` exactly"
- A-028 attestation: "List format. Prior-wave entries trimmed."
- A-031 note (if applicable): [include if any IAA session artifacts excluded]

## Deliverables Manifest (BLOCKING — all must be present)
### RED QA Tests
- [ ] modules/mat/tests/wave16/wave16.1-evidence-page.test.ts — committed SHA: [SHA]
- [ ] modules/mat/tests/wave16/wave16.2-ux-completeness.test.ts — committed SHA: [SHA]
- [ ] modules/mat/tests/wave16/wave16.6-schema-audit.test.ts — committed SHA: [SHA]
- [ ] modules/mat/tests/wave16/wave16.7-arc-portal.test.ts — committed SHA: [SHA]

### Implementation Artifacts
- [ ] Wave 16.1 — route wiring + EvidenceCollection.tsx — committed SHA: [SHA]
- [ ] Wave 16.2 — all 9 UX gap components — committed SHA: [SHA]
- [ ] Wave 16.6 — migration file (evidence_submissions + audit logging + JWT auth) — committed SHA: [SHA]
- [ ] Wave 16.7 — ARC portal page component — committed SHA: [SHA]

## Test Evidence
- Wave 16.1 test run: RED → GREEN confirmed — test output file: [path]
- Wave 16.2 test run: RED → GREEN confirmed — test output file: [path]
- Wave 16.6 test run: RED → GREEN confirmed — test output file: [path]
- Wave 16.7 test run: RED → GREEN confirmed — test output file: [path]

## Schema Column Compliance Statement (A-032 — MANDATORY)
For Wave 16.6 evidence_submissions migration:
- Migration file: [path]
- DDL columns defined: [list all column names]
- INSERT/SELECT operations in codebase referencing evidence_submissions: [list each file:line]
- Column cross-check result: [PASS — all columns match DDL / list any mismatches]

## GAP-011/GAP-012 Pre-existing Migration Analysis (MANDATORY)
- Existing migration examined: 20260304000004_fix_rls_remaining_tables.sql
- Policies already present for scores: [list]
- Policies already present for audit_scores: [list]
- Assessment: [EXISTING POLICIES SUFFICIENT — no new migration needed for GAP-011/GAP-012
              / GAPS REMAIN — specific gaps: ... — new policies needed for: ...]

## Session Memory Files (all BLOCKING)
- Foreman: .agent-workspace/foreman-v2/memory/session-wave-16-build-20260309.md — [SHA]
- qa-builder session (W16-QA-001): [path] — [SHA]
- qa-builder session (W16-QA-002): [path] — [SHA]
- qa-builder session (W16-QA-003): [path] — [SHA]
- qa-builder session (W16-QA-004): [path] — [SHA]
- ui-builder session (W16-IMPL-001): [path] — [SHA]
- ui-builder session (W16-IMPL-002): [path] — [SHA]
- ui-builder session (W16-IMPL-004): [path] — [SHA]
- schema-builder session (W16-IMPL-003): [path] — [SHA]
- api-builder session (W16-IMPL-003): [path] — [SHA]

## CST Checkpoint (required when Wave 16.1 + 16.6 both delivered)
- CST scope: Wave 16.1 (Evidence page) + Wave 16.6 (Schema) cross-boundary integration
- CST result: [PASS / SKIPPED with rationale per COMBINED_TESTING_PATTERN.md §4.2]

## CWT Evidence (MANDATORY before IBWR close)
- CWT scope: All waves through Wave 16, all MAT modules
- CWT result: [PASS — test count: X/X GREEN — date: YYYY-MM-DD]

## OVL-INJ-001 Injection Audit Trail
[Per iaa-category-overlays.md v3.2.0 §INJECTION_AUDIT_TRAIL requirements]

## IAA Audit Token
iaa_audit_token: IAA-session-wave-16-build-20260309-PASS
[pre-populated expected reference per A-029 — IAA will write dedicated token file]
```

---

## Section 4 — Scope Blockers and Governance Conflicts

### BLOCKER-1 — Wave 16.3 / 16.4 / 16.5: HARD BLOCKED — DO NOT COMMISSION

**Status**: These sub-waves are hard-blocked pending AIMC Waves 3–4.  
**Risk**: If any builder is commissioned for Wave 16.3 (AI Scoring Edge Function), 16.4 (Report Generation Edge Function), or 16.5 (AIMC Scoring+Reporting Wiring) in this session, the result will be incomplete architecture-level work with no valid test gate.  
**IAA enforcement**: Any PREHANDOVER proof claiming Wave 16.3/16.4/16.5 deliverables = REJECTION-PACKAGE citing architecture dependency violation.  
**Action required**: Foreman must NOT delegate these sub-waves. wave-current-tasks.md correctly marks them BLOCKED — maintain this status.

---

### BLOCKER-2 — GAP-011/GAP-012 Pre-Existing RLS Migration Conflict

**Status**: ⚠️ ACTIVE GOVERNANCE CONFLICT — requires resolution before schema-builder is commissioned for Wave 16.6.

**Finding**: Migration `20260304000004_fix_rls_remaining_tables.sql` (Wave postbuild-fails-02, TASK-PBF2-005 ✅ DONE, 2026-03-04) already implements:
- `scores_insert_authenticated` on `public.scores`
- `scores_update_own` on `public.scores`
- `audit_scores_insert_authenticated` on `public.audit_scores`
- `audit_scores_update_own` on `public.audit_scores`

Wave 16.6 GAP-011 and GAP-012 in implementation-plan.md v2.7.0 declare these policies as gaps requiring implementation. This creates a conflict: if the schema-builder creates a new migration that attempts to `CREATE POLICY` for these tables, it will likely fail on apply (duplicate policy names) or produce redundant conflicting policies.

**Required resolution**:
1. Foreman must instruct schema-builder to examine `20260304000004_fix_rls_remaining_tables.sql` before building
2. schema-builder must determine: (a) do existing policies satisfy GAP-011/GAP-012 requirements from the Wave 16 completeness report, or (b) are there specific additional policy requirements not covered?
3. If (a): Wave 16.6 scope is reduced — GAP-011/GAP-012 are confirmed resolved by prior migration; schema-builder targets only GAP-016, GAP-017, and GAP-019
4. If (b): schema-builder documents the specific gaps and targets only the missing policies with unique policy names

**IAA enforcement**: At handover, IAA will require the GAP-011/GAP-012 pre-existing migration analysis section in PREHANDOVER proof (see Section 3 template above). Absence = REJECTION-PACKAGE.

---

### ADVISORY-1 — CST Checkpoint Obligation

**Status**: Advisory (planning stage) — becomes blocking at handover.

When Wave 16.1 (frontend — Evidence Collection page) and Wave 16.6 (schema — `evidence_submissions` migration + scores RLS) are BOTH delivered in the same PR, they create a cross-boundary integration point: the frontend Evidence Collection page will attempt to read/write the newly defined schema.

Per `COMBINED_TESTING_PATTERN.md` §4.2 and IAA index §CST Prompting Conditions, a CST checkpoint is warranted before wave completion to confirm:
- The Evidence Collection page hooks query `evidence_submissions` with the correct column names
- RLS policies on `evidence_submissions` allow the Evidence Collection page's operations
- The integration does not silently fail with runtime column-not-found errors

> **Foreman is hereby notified**: Commission a CST covering Wave 16.1 × Wave 16.6 integration before claiming wave completion. Record the CST result in the PREHANDOVER proof. Per `COMBINED_TESTING_PATTERN.md` §4.2, CST may be skipped only with documented rationale that cumulative regression provides sufficient integration assurance.

---

### ADVISORY-2 — evidence_submissions Table Orphan Risk

**Status**: Advisory (planning stage) — becomes blocking at handover under BD-006 and BD-010.

The `evidence_submissions` table is currently referenced in code but has no migration (GAP-019). Once the migration is created, IAA will verify at handover that:
1. At least one writer (INSERT path) exists and is exercised
2. At least one reader (SELECT path) exists and is exercised
3. The Evidence Collection page (Wave 16.1) is the primary consumer — confirm the wiring connects Wave 16.1 to the newly created table

If the table is migrated but no application code is updated to use it, it is an orphan. REJECTION-PACKAGE.

---

### ADVISORY-3 — Wave 16.9 Parked Designation

**Status**: Advisory.

Wave 16.9 (Future Considerations — GAP-021, GAP-022, GAP-023) is PARKED per the wave-current-tasks.md and implementation-plan.md v2.7.0. No builder should be commissioned for these items. They are out of scope for this session.

---

## Section 5 — Session Memory Reference

This Pre-Brief session is recorded at:
`.agent-workspace/independent-assurance-agent/memory/session-prebrief-wave-16-build-20260309.md`

---

## Section 6 — Pre-Brief Completion Summary

| Item | Status |
|------|--------|
| Phase 1 identity declared | ✅ COMPLETE |
| Wave-current-tasks.md read | ✅ COMPLETE (10 tasks extracted) |
| Qualifying tasks classified | ✅ COMPLETE (9 qualifying, 1 exempt) |
| Trigger categories declared | ✅ COMPLETE — primary: AAWP_MAT |
| FFA checks declared | ✅ COMPLETE — CORE + BD + FAIL-ONLY-ONCE + CST/CWT |
| PREHANDOVER structure declared | ✅ COMPLETE (Section 3) |
| Scope blockers identified | ✅ COMPLETE (BLOCKER-1: Wave 16.3/4/5; BLOCKER-2: GAP-011/GAP-012 conflict) |
| Governance conflicts identified | ✅ COMPLETE — pre-existing RLS migration conflict surfaced |
| Pre-Brief artifact written | ✅ THIS FILE |
| Phase 2–4 assurance | ⛔ NOT EXECUTED — Pre-Brief mode only |

**This Pre-Brief is complete. Foreman may proceed with RED QA gate delegation (T-W16-QA-001 through T-W16-QA-004). IAA will be re-invoked at Phase 4 handover.**

---

**IAA Pre-Brief Reference**: `IAA-PREBRIEF-wave-16-build-20260309`  
**Agent**: independent-assurance-agent v6.2.0  
**Authority**: CS2 (@APGI-cmy)  
**Adoption Phase**: PHASE_B_BLOCKING
