# IAA Pre-Brief — DCKIS-IMPL-002: MAT Frontend Components — Knowledge Ingestion Interface

**Document type**: IAA Pre-Brief Artifact (Phase 0 — PRE-BRIEF mode)
**Wave slug**: `dckis-impl-002`
**Declared branch**: `copilot/dckis-impl-002-frontend-components`
**Issue**: [ui-builder] DCKIS-IMPL-002: MAT Frontend Components — Knowledge Ingestion Interface
**Pre-Brief authored by**: independent-assurance-agent v6.2.0
**Date**: 2026-03-20
**Authority**: CS2 (@APGI-cmy) | `INDEPENDENT_ASSURANCE_AGENT_CANON.md`
**Invocation mode**: PHASE 0 — PRE-BRIEF ONLY. Phases 1–4 assurance NOT executed in this session.
**Source strategy**: `Maturion/strategy/DOCUMENT_CHUNKING_AND_KNOWLEDGE_INGESTION_INTEGRATION_STRATEGY.md` v1.0.0 (DCKIS)
**Alignment plan**: `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md`
**Adoption phase**: PHASE_B_BLOCKING — verdicts at handover are hard-blocking.

---

## Phase 0 Pre-Brief Execution Record

### Step 0.1 — Invocation Context Confirmation

> **PRE-BRIEF MODE CONFIRMED.**
> Triggered by: CS2-issued `[IAA PRE-BRIEF REQUEST]` comment for wave `DCKIS-IMPL-002`.
> I am operating in Phase 0 exclusively. I do NOT execute Phases 1–4 in this session.
> I generate the Pre-Brief artifact and commit it. I stop there.

### Step 0.2 — Source Documents Read

| Document | Path | Status |
|----------|------|--------|
| DCKIS Alignment Plan v1.0.0 | `governance/EXECUTION/MAT_KNOWLEDGE_INGESTION_ALIGNMENT_PLAN.md` | READ |
| IAA Trigger Table v2.1.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-trigger-table.md` | READ |
| IAA Core Invariants v2.9.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-core-invariants-checklist.md` | READ |
| IAA Category Overlays v3.6.0 | `.agent-workspace/independent-assurance-agent/knowledge/iaa-category-overlays.md` | READ |
| FAIL-ONLY-ONCE Registry v2.5.0 | `.agent-workspace/independent-assurance-agent/knowledge/FAIL-ONLY-ONCE.md` | READ |
| Functional Behaviour Registry v1.2.0 | `.agent-workspace/independent-assurance-agent/knowledge/FUNCTIONAL-BEHAVIOUR-REGISTRY.md` | READ |
| IAA Knowledge Index | `.agent-workspace/independent-assurance-agent/knowledge/index.md` | READ |
| CANON_INVENTORY | `governance/CANON_INVENTORY.json` | READ — 191 canons, hash check PASS |
| Prior Pre-Brief (DCKIS Alignment Plan) | `.agent-admin/assurance/iaa-prebrief-dckis-alignment-plan.md` | READ — format reference |
| Prior Pre-Brief (DCKIS-QA-RED) | `.agent-admin/assurance/iaa-prebrief-dckis-qa-red.md` | READ — context |
| Most recent session memory | `.agent-workspace/independent-assurance-agent/memory/session-wave20-atomic-write-back-20260318-R2.md` | READ |

> CANON_INVENTORY hash check: **PASS** — no null, empty, or placeholder SHA256 hashes found.
> IAA canon present: **YES** — confirmed in CANON_INVENTORY.
> Adoption phase: **PHASE_B_BLOCKING** — hard gate ACTIVE. All verdicts blocking.

---

## 1. Wave Summary

Wave **DCKIS-IMPL-002** is a **UI implementation wave** delivering the MAT frontend components
for Pipeline 2 (Knowledge Ingestion). It is the second implementation wave in the DCKIS
integration series, following DCKIS-IMPL-001 (Edge Functions + backend hook).

The wave implements five frontend deliverables defined in the DCKIS Alignment Plan §4:

| Deliverable ID | Artefact | Path |
|---|---|---|
| IMPL-002-D1 | `KnowledgeUploadPanel.tsx` | `modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx` |
| IMPL-002-D2 | `DocumentChunkTester.tsx` | `modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx` |
| IMPL-002-D3 | `KnowledgeDocumentsList.tsx` | `modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx` |
| IMPL-002-D4 | MAT routing + nav (new `/knowledge` route) | MAT router config + nav component update |
| IMPL-002-D5 | Domain selector (AIMC source taxonomy) | Inline in `KnowledgeUploadPanel.tsx` or shared component |

Additionally, because **DCKIS-IMPL-001 deliverables are not yet merged**, the following
IMPL-001-origin artefacts are being carried into this wave (see §6 — Scope Blocker A):

| IMPL-001 Deliverable | Artefact | Required for Tests |
|---|---|---|
| IMPL-001-D5 (carried) | `useKnowledgeDocuments.ts` hook | T-KU-003, T-KU-009, T-KU-010 |
| IMPL-001-D1 (carried) | `process-document-v2` Edge Function | T-KU-007, T-KU-008, T-KU-011, T-KU-012 |

**Full GREEN gate target**: All 12 T-KU-xxx tests GREEN at wave acceptance.
Note: T-KU-004 and T-KU-005 are already GREEN (merged in DCKIS-SCH-001, PR #1179).

---

## 2. IAA Trigger Category Declaration

### Trigger Classification

| Category | Required? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY TRIGGER** | Deliverables land in `modules/mat/frontend/src/` and `packages/ai-centre/supabase/functions/`. This is a MAT deliverable PR delivering executable frontend application behaviour. IAA trigger table step 4: files match AAWP/MAT path patterns. |
| **CI_WORKFLOW** | **CONDITIONAL** | CORE-023 workflow integrity ripple check applies because the PR touches frontend source files and Edge Function paths that are referenced by CI workflow `paths:` triggers (`.github/workflows/`). IAA will evaluate this at Step 3.2 (CORE-023). If no workflow file is modified, CORE-023 is N/A-lite (source changes only, paths: filter coverage check). |
| **KNOWLEDGE_GOVERNANCE** | **CONDITIONAL** | If any `.agent-workspace/*/knowledge/` file is modified by ui-builder → this trigger activates. IAA pre-declares this as conditional. ui-builder MUST NOT modify knowledge files; if they appear in the diff, IAA re-classifies as MIXED and applies the overlay. |
| **AGENT_CONTRACT** | **NO — unless diff contains** `.github/agents/` **changes** | ui-builder is not expected to touch agent contracts. CORE-017 will verify no `.github/agents/` modifications are present. If any appear: REJECTION-PACKAGE citing A-005. |
| **MIXED** | **CONDITIONAL** | If any secondary trigger activates alongside AAWP_MAT, the PR becomes MIXED and all applicable overlays stack. Ambiguity rule applies (A-003). |

> **Primary trigger at handover**: `AAWP_MAT` — mandatory. All BD-000 through BD-TIER-6 checks apply.
> **Ambiguity rule**: ACTIVE. Any uncertainty about secondary triggers resolves to mandatory application.

---

## 3. Full FFA Check Declaration

IAA declares all checks it will run at handover invocation. These are binding — IAA will not
reduce or expand this list without a documented rationale in the session memory.

### 3.1 — FAIL-ONLY-ONCE Learning Checks (Phase 3, Step 3.1)

All rules from the FAIL-ONLY-ONCE registry that are applicable to an AAWP_MAT BUILD PR:

| Rule ID | Rule Name | Applicability |
|---------|-----------|---------------|
| A-001 | IAA invocation evidence present | ACTIVE — verify PREHANDOVER proof or token reference in PR artifacts |
| A-003 | Ambiguity resolves to mandatory invocation | ACTIVE — classification check |
| A-005 | Agent file immutability (no `.github/agents/` changes) | ACTIVE — CORE-017 check |
| A-013 | No unauthorised `.github/agents/` modifications | ACTIVE — cross-ref with CORE-017 |
| A-016 | No cross-PR IAA token reuse | ACTIVE — CORE-019 cross-verification |
| A-017 | No REJECTION-PACKAGE session cited as PASS | ACTIVE — session memory integrity |
| A-020 | PREHANDOVER template current with overlay requirements | ACTIVE — verify PREHANDOVER structure |
| A-021 | Commit and push before IAA invocation (CI run evidence) | ACTIVE — CI run must exist before IAA invoked |
| A-022 | Re-evaluate trigger categories on every invocation | ACTIVE — diff-based re-classification |
| A-026 | SCOPE_DECLARATION.md matches PR diff exactly | ACTIVE — verify SCOPE_DECLARATION completeness |
| A-028 | SCOPE_DECLARATION format compliance | ACTIVE — list format, no stale entries |
| A-029 | PREHANDOVER proof is read-only post-commit (§4.3b) | ACTIVE — iaa_audit_token expected reference format |
| A-029b | Carry-forward: leftovers from prior jobs block token | ACTIVE — no unresolved carry-forward items |
| A-033 | CORE-018 verification uses git (not disk) | ACTIVE — IAA uses `git ls-tree HEAD` |
| A-034 | FUNCTIONAL-BEHAVIOUR-REGISTRY reading mandatory | ACTIVE — all NBR entries checked |
| A-035 | Niggle pattern library applied to relevant code areas | ACTIVE — NBR-001 through NBR-005 applied |

### 3.2 — Functional Behaviour Registry Checks (Phase 3, Step 3.1 — NBR patterns)

All NBR entries applicable to this PR:

| NBR ID | Pattern | Applicability to This Wave |
|--------|---------|---------------------------|
| **NBR-001** | TanStack Query: mutation without cache invalidation | **HIGH APPLICABILITY** — `useKnowledgeDocuments.ts` hook will contain mutation(s) for file upload. IAA will verify every `useMutation` has `onSuccess`/`onSettled` calling `queryClient.invalidateQueries` for the `ai_knowledge` entity. |
| **NBR-002** | Supabase: RLS silent write block | **HIGH APPLICABILITY** — `ai_knowledge` INSERT path must check for RLS-blocked write response. IAA will verify write operation result-checking and RLS write policy coverage for all relevant roles. |
| **NBR-003** | Zustand store state not reset between sessions | **MEDIUM APPLICABILITY** — If any Zustand store is introduced for upload state (file selection, domain selection, progress), IAA will verify reset-on-unmount or route-transition-reset logic is present. |
| **NBR-004** | Optimistic update not rolled back on mutation error | **MEDIUM APPLICABILITY** — If `KnowledgeDocumentsList.tsx` uses optimistic updates for status display, IAA will verify `onMutate` rollback with `context.previousData` on error. |
| **NBR-005** | Schema migration column mismatch silently masked | **LOW APPLICABILITY** — No new schema migration expected in this wave. IAA will confirm no migration files are added. If any appear: NBR-005 check activates fully. |

### 3.3 — Core Invariants Checklist (Phase 3, Step 3.2)

All CORE checks applicable to an AAWP_MAT PR:

| Check ID | Check Name | Notes for This Wave |
|----------|-----------|---------------------|
| CORE-005 | Governance block present | Applied to any governance YAML in PR artifacts |
| CORE-006 | CANON_INVENTORY alignment | Any governance references must have valid SHA256 hashes |
| CORE-007 | No placeholder content | All 5 components + hook + Edge Function must be fully implemented. No TODO, FIXME, STUB in production paths |
| CORE-013 | IAA invocation evidence | PREHANDOVER proof or audit token reference must be present |
| CORE-014 | No class exemption claim | ui-builder must not claim class exemption from IAA |
| CORE-015 | Session memory present | ui-builder session memory file path must be in PREHANDOVER proof |
| CORE-016 | IAA verdict evidenced (§4.3b) | Dedicated token file at `.agent-admin/assurance/iaa-token-session-dckis-impl-002-YYYYMMDD.md` |
| CORE-017 | No `.github/agents/` modifications | ADR-005 + A-005: ui-builder must not touch any agent contracts |
| CORE-018 | Complete evidence artifact sweep | (a) PREHANDOVER proof, (b) session memory, (c) iaa_audit_token non-empty, (d) dedicated token file |
| CORE-019 | IAA token cross-verification | First invocation exception applies — token file created this session |
| CORE-020 | Zero partial pass rule | No assumed passes — absence of evidence = FAIL |
| CORE-021 | Zero-severity-tolerance | Any finding = REJECTION-PACKAGE. No "minor" / "trivial" verdicts |
| CORE-023 | Workflow integrity ripple check | **ACTIVE** — frontend source + Edge Function files are workflow-adjacent. IAA will verify workflow files remain valid after changes and path coverage is correct |

### 3.4 — AAWP_MAT / BUILD_DELIVERABLE Overlay Checks (Phase 3, Step 3.3)

All BD checks from the BUILD_DELIVERABLE overlay:

#### BD-000 — User Journey Trace (Blocking)

IAA will trace the following user journeys end-to-end:

| Journey | Flows to Trace |
|---------|---------------|
| **J1: Knowledge Document Upload** | Content Administrator navigates to `/knowledge` → selects file → selects domain → system shows chunk preflight → user approves → upload submits → document appears in list with `approval_status = pending` |
| **J2: Chunk Preflight Tester** | User selects file → chunk preview renders locally (no server call) with `size=2000`, `overlap=200` → user can inspect chunks → user confirms or cancels before submission |
| **J3: Domain Selection** | User sees domain picker with AIMC source taxonomy options (`general`, `iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`) → selection persists through upload flow → value passed to Edge Function as `source` field |
| **J4: Knowledge Documents List** | User navigates to Knowledge section → list shows uploaded documents with `approval_status` badge (`pending`/`approved`/`rejected`) → list refreshes after new upload |
| **J5: Pipeline Isolation** | User on Criteria Upload page → navigates to Knowledge Upload page → no shared state, no shared handler, no route conflict; Criteria Upload continues to function as before |

For each journey IAA will: verify declaration in PR description, trace each step against the diff,
verify edge cases declared and handled (empty state, invalid file type, upload failure, network error).

#### BD-TIER-1 through BD-TIER-6 Checks

| Check ID | Check Name |
|----------|-----------|
| BD-001 | Full scope delivered — all 5 IMPL-002 deliverables + 2 carried IMPL-001 deliverables present |
| BD-002 | No stub/TODO in production paths |
| BD-003 | One-time build compliance — feature works end-to-end without immediate follow-up fix |
| BD-004 | No leftover debt from previous waves |
| BD-005 | End-to-end wiring verified — KnowledgeUploadPanel → useKnowledgeDocuments → process-document-v2 → ai_knowledge → KnowledgeDocumentsList |
| BD-006 | Writers and readers confirmed — ai_knowledge has confirmed INSERT path and confirmed SELECT path |
| BD-007 | Auth guards applied — `/knowledge` route protected; upload hook verifies authenticated session |
| BD-008 | FK and relational integrity — `organisation_id` FK enforced in application layer |
| BD-009 | Cross-component integration fit — new components do not conflict with existing MAT components |
| BD-010 | No orphaned deliverables — all 5 components referenced/consumed; hook referenced by panel |
| BD-011 | 100% test pass rate — all 12 T-KU-xxx tests GREEN with CI run evidence |
| BD-012 | Zero test debt — no `.skip()`, `.only()`, `test.todo()`, commented tests |
| BD-013 | No test dodging — tests assert on actual component behaviour (not vacuous assertions) |
| BD-014 | No deprecation accumulation |
| BD-015 | RLS policies complete — `ai_knowledge` INSERT policy covers Content Administrator role |
| BD-016 | No hardcoded secrets or credentials |
| BD-017 | Input validation present — file type validation, file size validation on upload |
| BD-018 | No injection vectors — file content not rendered as HTML; domain selector uses allowlist, not free-text |
| BD-019 | International standards compliance — WCAG accessibility for all new UI components |
| BD-020 | Clean coding structure |
| BD-021 | International coding best practice — TypeScript strict, no `any`, proper error handling |
| BD-022 | Architecture alignment — implementation matches alignment plan §4 DCKIS-IMPL-002 spec |
| BD-023 | Technology currency |
| BD-024 | Could it be done better — IAA senior-engineer prerogative |

#### ADR-005 Hard Constraint Check (Additional — Alignment Plan §4 Mandate)

This is a **zero-tolerance hard check** specific to this wave and all DCKIS waves:

> **ADR-005 CHECK**: IAA will scan the PR diff for ANY modification to Pipeline 1 files.
> The following files and paths are absolutely prohibited from appearing in this PR diff:
>
> | Prohibited File / Path | Reason |
> |---|---|
> | `modules/mat/frontend/src/components/criteria/CriteriaUpload.tsx` | Pipeline 1 — must not be touched |
> | `supabase/functions/invoke-ai-parse-criteria/**` | Pipeline 1 Edge Function |
> | `apps/mat-ai-gateway/services/parsing.py` | Pipeline 1 parsing service |
> | Any migration touching `criteria`, `domains`, or `mini_performance_standards` tables | Pipeline 1 schema |
> | `modules/mat/frontend/src/lib/hooks/useCriteria.ts` (or similar) | Pipeline 1 hook |
>
> **Verdict if any prohibited file appears in diff**: REJECTION-PACKAGE citing ADR-005.
> This check has the same blocking weight as CORE-021 (zero severity tolerance).
> No exception. No CS2 waiver possible for ADR-005 in this wave.

#### T-KU Test Gate Check (DCKIS-Specific)

IAA will verify the GREEN gate for all 12 T-KU-xxx tests:

| Test ID | Description | Expected Status |
|---------|-------------|-----------------|
| T-KU-001 | KnowledgeUploadPanel renders with file picker and domain selector | Must be GREEN |
| T-KU-002 | DocumentChunkTester shows local chunk preview (size=2000, overlap=200) | Must be GREEN |
| T-KU-003 | Domain selection maps to valid AIMC `source` taxonomy value | Must be GREEN |
| T-KU-004 | Uploaded document in `ai_knowledge` with `approval_status = 'pending'` | Already GREEN (DCKIS-SCH-001 / PR #1179) — must remain GREEN |
| T-KU-005 | Uploaded document with correct `organisation_id` scoping | Already GREEN (DCKIS-SCH-001 / PR #1179) — must remain GREEN |
| T-KU-006 | ARC approval status badge visible in MAT UI | Must be GREEN |
| T-KU-007 | Smart Chunk Reuse triggers on re-upload (no duplicate embedding cost) | Must be GREEN |
| T-KU-008 | Pipeline 2 upload does NOT affect criteria table / Pipeline 1 workflow | Must be GREEN |
| T-KU-009 | File validation rejects invalid file types | Must be GREEN |
| T-KU-010 | Retry flow works after failed upload attempt | Must be GREEN |
| T-KU-011 | process-document-v2 produces correct chunk count from .docx fixture | Must be GREEN |
| T-KU-012 | process-document-v2 produces 1536-dim embedding per chunk | Must be GREEN |

**CI run evidence is mandatory** (FAIL-ONLY-ONCE A-021). IAA will not accept a claim that
tests pass without a verifiable CI run on the branch.

---

## 4. PREHANDOVER Proof Structure Requirements

IAA declares the required structure of the PREHANDOVER proof that ui-builder must produce
**before** invoking IAA at handover. IAA will reject any PREHANDOVER proof that does not
conform to this structure.

### Required PREHANDOVER Proof Fields

```yaml
# Required fields in PREHANDOVER proof
wave: DCKIS-IMPL-002
branch: copilot/dckis-impl-002-frontend-components
producing_agent: ui-builder
session_id: <session-YYYYMMDD or session-NNN>
date: <YYYY-MM-DD>

deliverables:
  - id: IMPL-002-D1
    path: modules/mat/frontend/src/components/knowledge/KnowledgeUploadPanel.tsx
    status: DELIVERED
  - id: IMPL-002-D2
    path: modules/mat/frontend/src/components/knowledge/DocumentChunkTester.tsx
    status: DELIVERED
  - id: IMPL-002-D3
    path: modules/mat/frontend/src/components/knowledge/KnowledgeDocumentsList.tsx
    status: DELIVERED
  - id: IMPL-002-D4
    description: MAT routing + nav (/knowledge route)
    status: DELIVERED
  - id: IMPL-002-D5
    description: Domain selector (AIMC source taxonomy)
    status: DELIVERED
  # Carried IMPL-001 deliverables (CS2-authorised scope expansion)
  - id: IMPL-001-D5-carried
    path: modules/mat/frontend/src/lib/hooks/useKnowledgeDocuments.ts
    status: DELIVERED
  - id: IMPL-001-D1-carried
    path: packages/ai-centre/supabase/functions/process-document-v2/index.ts
    status: DELIVERED

test_gate:
  t_ku_001: GREEN
  t_ku_002: GREEN
  t_ku_003: GREEN
  t_ku_004: GREEN  # was already GREEN from DCKIS-SCH-001
  t_ku_005: GREEN  # was already GREEN from DCKIS-SCH-001
  t_ku_006: GREEN
  t_ku_007: GREEN
  t_ku_008: GREEN
  t_ku_009: GREEN
  t_ku_010: GREEN
  t_ku_011: GREEN
  t_ku_012: GREEN
  ci_run_url: <URL to CI run on branch showing all 12 GREEN>

adr_005_compliance:
  pipeline_1_files_touched: false
  attestation: >
    No Pipeline 1 files modified. CriteriaUpload.tsx, useCriteria.ts,
    invoke-ai-parse-criteria/, and criteria/domains/mps tables are untouched.

user_journey_declaration:
  # Each journey declared explicitly per BD-000-A requirement
  journey_J1_knowledge_upload: >
    Content Administrator navigates to /knowledge → selects .docx/.pdf/.txt/.md file →
    selects AIMC source domain → system shows chunk preview (size=2000, overlap=200) →
    user approves → upload submits to process-document-v2 → record appears in ai_knowledge
    with approval_status='pending' → KnowledgeDocumentsList refreshes and shows new document.
  journey_J2_chunk_preflight: >
    User selects file → DocumentChunkTester splits content client-side (size=2000, overlap=200)
    → chunk count and first N chunks displayed → user inspects and approves or cancels →
    no server call or AI credit consumed until user approves.
  journey_J3_domain_selection: >
    Domain selector presents: general, iso27001, nist, pci-dss, soc2, risk-management →
    user selects → selection held in upload form state → value passed as 'source' to
    process-document-v2 Edge Function on submit → stored in ai_knowledge.source column.
  journey_J4_documents_list: >
    User opens Knowledge section → KnowledgeDocumentsList queries ai_knowledge for
    org-scoped documents → each row shows filename, domain, approval_status badge →
    after upload mutation succeeds, queryClient.invalidateQueries triggers list refresh.
  journey_J5_pipeline_isolation: >
    User visits /criteria and uploads criteria document → Pipeline 1 unaffected →
    user navigates to /knowledge → different route, different handler, different component →
    no shared state or side effects between Pipeline 1 and Pipeline 2 flows.

edge_cases_declared:
  - empty_state_no_documents: KnowledgeDocumentsList shows empty-state UI when no documents exist
  - invalid_file_type: KnowledgeUploadPanel rejects non-.docx/.pdf/.txt/.md files with validation error
  - upload_failure: Upload error surfaced in UI; retry option available (T-KU-010)
  - rls_blocked_write: Write operation checks Supabase response for null/error; surfaces error to user
  - network_error: useKnowledgeDocuments onError handler shows user-facing error state

scope_declaration_path: SCOPE_DECLARATION.md  # must be present and updated

session_memory_path: <path to ui-builder session memory file on branch>

iaa_audit_token: IAA-session-dckis-impl-002-YYYYMMDD-PASS
# ↑ Pre-populated expected reference format per §4.3b (A-029).
# Replace YYYYMMDD with actual date of IAA invocation.
# IAA will write the actual token to .agent-admin/assurance/iaa-token-session-dckis-impl-002-YYYYMMDD.md
```

### PREHANDOVER Proof — Additional Mandatory Sections

The PREHANDOVER proof must also contain:

1. **`## Scope Declaration`** — Explicit list of all files created/modified in the PR diff.
   Must match `SCOPE_DECLARATION.md` exactly (A-026, A-028).

2. **`## CS2 Scope Expansion Authorization`** — Required because this wave carries IMPL-001
   deliverables (see §6 Scope Blocker A). This section must cite CS2 explicit authorisation
   for the scope expansion. If this section is absent or contains only a reference to the
   Pre-Brief request without explicit CS2 confirmation → REJECTION-PACKAGE.

3. **`## ADR-005 Attestation`** — Explicit statement that no Pipeline 1 files were modified,
   with verification method (e.g., `git diff --name-only` output showing only Pipeline 2 paths).

4. **`## T-KU Test Gate Evidence`** — CI run URL or screenshot showing all 12 T-KU-xxx GREEN.
   Not a claim — a verifiable link.

5. **`## NBR Pattern Self-Check`** — ui-builder's self-assessment against applicable NBR patterns:
   - NBR-001: Every `useMutation` in the diff has `queryClient.invalidateQueries` on success.
   - NBR-002: All Supabase write operations check for RLS-blocked response.
   - NBR-003 (if applicable): Any Zustand store resets on route change.

---

## 5. Applicable Governance Rules

### Hard Constraints for This Wave

| Rule | Source | Consequence if Violated |
|------|--------|------------------------|
| ADR-005: No Pipeline 1 file modifications | DCKIS Alignment Plan §4 | REJECTION-PACKAGE (zero tolerance) |
| Chunk size = 2000, overlap = 200 | FR-KU-002, TR-KU-001 | REJECTION-PACKAGE if wrong parameters |
| AIMC source taxonomy only (no free-text domain) | ADR-004, DCKIS §5 | REJECTION-PACKAGE |
| approval_status = 'pending' on insert | ADR-003 | REJECTION-PACKAGE |
| organisation_id scoping required | TR-KU-004 | REJECTION-PACKAGE |
| /knowledge route distinct from /criteria | ADR-005, FR-KU-001 | REJECTION-PACKAGE |
| All 12 T-KU-xxx tests GREEN | DCKIS Alignment Plan §4 exit criteria | REJECTION-PACKAGE |
| CI run evidence before IAA invocation | FAIL-ONLY-ONCE A-021 | REJECTION-PACKAGE |
| SCOPE_DECLARATION.md updated exactly | FAIL-ONLY-ONCE A-026, A-028 | REJECTION-PACKAGE |
| CS2 scope expansion authorization documented | §6 Blocker A requirement | REJECTION-PACKAGE |

---

## 6. Scope Blockers and Governance Conflicts

### ⚠️ SCOPE BLOCKER A — IMPL-001 Deliverables Not Merged (Entry Criteria Gap)

**Status**: ACTIVE — requires CS2 explicit resolution before IAA issues ASSURANCE-TOKEN.

**Finding**: The DCKIS Alignment Plan §4 specifies:

> *"Wave DCKIS-IMPL-002 depends on DCKIS-IMPL-001 (Edge Functions and hook available)"*
> *"Entry Criteria: DCKIS-IMPL-001 merged (backend hook available)"*

The Pre-Brief request explicitly states that **DCKIS-IMPL-001 deliverables are not yet merged**,
and that ui-builder is being asked to also deliver:
- `useKnowledgeDocuments.ts` hook (formally an IMPL-001-D5 deliverable)
- `process-document-v2` Edge Function (formally an IMPL-001-D1 deliverable)

This creates a **scope expansion of DCKIS-IMPL-002 beyond its defined boundary** in the
alignment plan. This is a governance deviation from the planned wave sequencing.

**IAA Position**:
- IAA does **not** block this PR on entry criteria grounds if CS2 explicitly authorises the
  scope expansion in writing (a comment on the issue, a note in the PREHANDOVER proof, or
  an updated alignment plan section).
- IAA **will** block this PR at handover if the PREHANDOVER proof does not contain an explicit
  CS2 authorisation for carrying IMPL-001 deliverables into IMPL-002 scope.
- The scope expansion is technically feasible (all deliverables are coherent as a single PR).
  The governance concern is documentation — the alignment plan must be updated or a CS2
  authorisation note must be present so the deviation is traceable.

**Required resolution**:
One of the following must be present in the PREHANDOVER proof:
1. A quote from CS2 (@APGI-cmy) authorising IMPL-001 deliverables to be carried into IMPL-002, OR
2. An updated alignment plan section formally amending DCKIS-IMPL-002 scope to include
   the IMPL-001 carried deliverables, with CS2 acknowledgment, OR
3. Confirmation that IMPL-001 was indeed merged prior to IMPL-002 handover (in which case
   the scope is no longer expanded — ui-builder builds only IMPL-002-D1 through D5).

### ⚠️ SCOPE CONCERN B — process-document-v2 is an Edge Function (API Boundary)

**Status**: ADVISORY — not blocking pre-brief, but IAA will apply heightened scrutiny.

**Finding**: The `process-document-v2` Edge Function is an `api-builder` class deliverable
per the alignment plan (DCKIS-IMPL-001 assigned to `api-builder`). This wave is assigned to
`ui-builder`. Delivering an Edge Function in a UI wave by a ui-builder agent is an agent
class boundary concern.

**IAA Position**: If ui-builder delivers this Edge Function as part of the carried scope, IAA
will apply BD-TIER-4 security review (BD-016, BD-017, BD-018) with full rigour to the
Edge Function code. The class boundary issue is noted; CS2 scope expansion authorization
(required for Blocker A) should explicitly cover the Edge Function delivery.

### ✅ GOVERNANCE ALIGNMENT CONFIRMED — T-KU-004, T-KU-005 Already GREEN

**Status**: CONFIRMED PASS — no action required.

**Finding**: DCKIS-SCH-001 (PR #1179) is confirmed merged. T-KU-004 (approval_status =
'pending' on insert) and T-KU-005 (organisation_id scoping) are already GREEN. These tests
must not be broken by this wave — ADR-005 and CORE-009 (wiring integrity) will verify they
remain GREEN in the full suite CI run.

### ✅ GOVERNANCE ALIGNMENT CONFIRMED — ADR-005 Is Absolute

**Status**: CONFIRMED — IAA will apply ADR-005 with zero-tolerance enforcement.

**Finding**: The alignment plan states ADR-005 is a HARD constraint with no exceptions.
IAA pre-declares that ANY modification to Pipeline 1 files will trigger immediate REJECTION-PACKAGE,
regardless of the stated reason. No CS2 waiver for ADR-005 in this wave context.

---

## 7. IAA Expected Token File Path

At handover, IAA will write its verdict to:

```
.agent-admin/assurance/iaa-token-session-dckis-impl-002-YYYYMMDD.md
```

(Replace `YYYYMMDD` with the date of the actual handover invocation.)

The PREHANDOVER proof `iaa_audit_token` field must reference this path in the format:
```
iaa_audit_token: IAA-session-dckis-impl-002-YYYYMMDD-PASS
```

Per §4.3b architecture (A-029): the PREHANDOVER proof is **read-only after initial commit**.
IAA will write the token to its dedicated file. IAA will NOT edit the PREHANDOVER proof.

---

## 8. Summary

| Item | Declaration |
|------|-------------|
| **Wave** | DCKIS-IMPL-002 — MAT Frontend Components: Knowledge Ingestion Interface |
| **Primary trigger category** | AAWP_MAT (BUILD_DELIVERABLE overlay) |
| **Conditional triggers** | CI_WORKFLOW (CORE-023 workflow ripple), KNOWLEDGE_GOVERNANCE (if knowledge files appear in diff) |
| **Total FFA checks** | 23 CORE checks + 25 BD overlay checks + 5 NBR patterns + 5 FAIL-ONLY-ONCE rules + ADR-005 hard check + 12 T-KU test gate checks |
| **Hard constraints** | ADR-005 (no Pipeline 1), chunk size=2000/overlap=200, AIMC taxonomy only, all 12 T-KU GREEN |
| **Active scope blockers** | ⚠️ Blocker A: IMPL-001 scope expansion requires CS2 authorization |
| **Advisory concerns** | Concern B: Edge Function delivered by ui-builder (class boundary) |
| **Adoption phase** | PHASE_B_BLOCKING — verdicts are hard-blocking. REJECTION-PACKAGE prevents PR from being opened. |
| **Merge authority** | CS2 ONLY (@APGI-cmy) |

---

**Pre-Brief status**: COMPLETE
**Phases 1–4 assurance**: NOT executed in this session. Awaiting ui-builder handover invocation.
**Authority**: CS2 (Johan Ras / @APGI-cmy) | independent-assurance-agent v6.2.0
