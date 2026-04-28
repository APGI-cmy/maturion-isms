# IAA Wave Record — wave-mps-source-verification

**Wave**: wave-mps-source-verification
**Date**: 2026-04-28
**Branch**: copilot/verify-generic-mps-source-documents
  *(Pre-brief request stated `copilot/verify-mps-canonical-source` — actual git branch differs; Foreman must reconcile branch naming before wave record finalises)*
**Issue**: maturion-isms — CS2 clarification: verify canonical generic MPS source pack in AIMC/KUC before static question bank
**Ceremony Admin Appointed**: NO
**IAA Session**: session-077-20260428

---

## PRE-BRIEF

**Generated**: 2026-04-28
**IAA Session**: session-077-20260428
**Trigger**: `action: "PRE-BRIEF"` — Phase 0 invocation (Phases 1–4 assurance NOT executed)
**Invoked by**: foreman-v2-agent (wave-start request)
**Wave context**: CS2 clarification directive — verify canonical generic MPS source pack in AIMC/KUC before committing to static question bank. Related to PR #1500 (free-assessment replacement work).

---

### Qualifying Tasks

The wave has two structurally sequential tracks. IAA classifies each separately.

| # | Track | Task Description | Trigger Category | IAA Required? |
|---|-------|-----------------|-----------------|---------------|
| A-1 | TRACK A | Search KUC/document-upload storage and metadata tables for generic MPS source documents (MPS 1–25) | EXEMPT (session memory + workspace files only) | NO — if deliverables are pure session memory / workspace documentation of findings |
| A-2 | TRACK A | Confirm whether documents are approved/active and retrievable by MMM/AIMC path; confirm generic MPS (not diamond-specific LDCS) | EXEMPT (research output; no governance state change) | NO — research findings only |
| A-3 | TRACK A | Record migration gap and request CS2 re-upload of 25 Word documents (if absent) | **KNOWLEDGE_GOVERNANCE** if gap notice modifies any `.agent-workspace/*/knowledge/` or governance path; **EXEMPT** if limited to workspace documentation and issue comment | CONDITIONAL — see Scope Blocker SB-001 |
| B-1 | TRACK B | Create structured Domain → MPS → Criteria JSON model derived from KUC sources | **AAWP_MAT** — files in `packages/ai-centre/src/`, `modules/MMM/11-build/`, or equivalent | YES — MANDATORY (AAWP_MAT, BUILD_DELIVERABLE overlay) |
| B-2 | TRACK B | Derive free-assessment diagnostic question bank from structured JSON model | **AAWP_MAT** | YES — MANDATORY |
| B-3 | TRACK B | Add tests proving free-assessment covers all 25 MPSs | **AAWP_MAT** | YES — MANDATORY |
| B-4 | TRACK B | Update BUILD_PROGRESS_TRACKER.md or module.manifest.json for MMM (if applicable) | **PRE_BUILD_STAGE_MODEL** (if stage-advancing artifacts modified) | YES — MANDATORY (adds PRE_BUILD_GATES overlay) |
| MIXED | BOTH | If a single PR delivers BOTH Track A governance artifacts AND Track B implementation artifacts | **MIXED** (AAWP_MAT dominant) | YES — MANDATORY |

**Qualifying tasks**:
- **Track A alone (no implementation)**: 0 qualifying tasks IF deliverables are session memory + workspace documentation + issue comment ONLY. IAA NOT required.
- **Track A with gap-notice in governance path**: 1 qualifying task (KNOWLEDGE_GOVERNANCE). IAA required.
- **Track B (full implementation)**: 3 qualifying tasks (B-1, B-2, B-3) = AAWP_MAT. IAA MANDATORY.
- **MIXED PR (Track A + Track B together)**: All qualifying. AAWP_MAT dominant. IAA MANDATORY.

**Total IAA-qualifying PRs expected**:
- If wave closes at Track A (sources absent): 0–1 (depending on gap notice path)
- If wave proceeds to Track B (sources present): 1 (AAWP_MAT implementation PR)

---

### Applicable Overlay

**Track A (research + gap recording) — Applicable if PR contains NO implementation code:**

| Category | Overlay | Active checks |
|----------|---------|---------------|
| EXEMPT | Universal Ceremony Gate (CERT-001–004) | Existence checks only |
| KNOWLEDGE_GOVERNANCE (conditional) | OVL-KG-001 through OVL-KG-004 | Only if gap notice modifies any knowledge file |

**Track B (implementation) — Applicable overlay:**

| Category | Overlay | Active checks |
|----------|---------|---------------|
| AAWP_MAT (primary) | BUILD_DELIVERABLE: BD-000 through BD-024 | Full FFA required |
| AAWP_MAT | Universal Ceremony Gate CERT-001–004 | Existence checks |
| PRE_BUILD_STAGE_MODEL (conditional) | OVL-PBG-001 through OVL-PBG-017 | Only if BUILD_PROGRESS_TRACKER.md or module.manifest.json is touched |
| MIXED (if Track A + B in same PR) | AAWP_MAT dominant + Ceremony Gate | Full FFA + existence checks |

**PRE_BRIEF_ASSURANCE overlay**: Applies to Track B PR at final audit. Wave record path:
`.agent-admin/assurance/iaa-wave-record-wave-mps-source-verification-20260428.md`

---

### Anti-Regression Obligations

**Anti-regression obligations**: YES (conditional on Track B proceeding)

| Rule | Source | What to Check |
|------|--------|--------------|
| NBR-001 | FUNCTIONAL-BEHAVIOUR-REGISTRY.md | TanStack Query cache invalidation — applies if question bank fetch uses `useMutation` or `useQuery` in the free-assessment flow. |
| NBR-002 | FUNCTIONAL-BEHAVIOUR-REGISTRY.md | Supabase RLS silent write block — applies if free-assessment response storage is modified. |
| NBR-005 | FUNCTIONAL-BEHAVIOUR-REGISTRY.md | Schema migration column mismatch — applies if any Supabase migration is added alongside application write path changes. |
| A-015 | FAIL-ONLY-ONCE.md | PREHANDOVER ceremony required for all triggered (non-EXEMPT) PRs. Track B requires full PREHANDOVER ceremony regardless of how "simple" the change is. |
| A-033 | FAIL-ONLY-ONCE.md | All CORE-018 artifact checks use `git ls-tree HEAD` verification — disk presence alone insufficient. |

**NBR-003, NBR-004**: Apply if Zustand store (free-assessment state) or optimistic updates are involved in question bank presentation.

**FUNCTIONAL-BEHAVIOUR-REGISTRY ref**: NBR-001 through NBR-005 — all five apply to Track B; IAA will confirm relevance at Step 3.1 during final audit.

---

### IAA Answers to Foreman Pre-Brief Questions

#### Q1 — What trigger categories apply?

**Track A (research + gap recording only):**
- **EXEMPT** — if deliverables are session memory, workspace documentation, and issue comments only.
- **KNOWLEDGE_GOVERNANCE** (mandatory IAA) — if the gap notice is committed to any `.agent-workspace/*/knowledge/` path or triggers a governance state update.
- **Ambiguity rule**: If the gap notice creates any file outside session memory / workspace documentation → IAA is required. Do not assume EXEMPT — confirm with Foreman before opening PR.

**Track B (implementation):**
- **AAWP_MAT** — primary category. Files in `packages/ai-centre/src/`, `modules/MMM/11-build/`, test files, and question bank data structures are all AAWP_MAT-triggering paths.
- **MIXED** (adds PRE_BUILD_STAGE_MODEL) — only if BUILD_PROGRESS_TRACKER.md or module.manifest.json is modified as part of the PR. Based on IAA review of MMM BUILD_PROGRESS_TRACKER.md, all 12 MMM stages are COMPLETE (PR #1429 merged 2026-04-21). If Track B is a post-Stage-12 build increment, PRE_BUILD_STAGE_MODEL is NOT triggered unless stage-advancing governance artifacts are explicitly modified.

**If a single PR contains both Track A and Track B content → MIXED → AAWP_MAT dominant → IAA MANDATORY.**

---

#### Q2 — FFA checks for research/analysis only (no code changes)?

If Track A only (pure research, no code, no governance file changes):

**FFA does NOT apply.** The BUILD_DELIVERABLE overlay (BD-000 through BD-024) is only applied to PRs delivering executable application behaviour. A research-only PR with no code changes does not trigger this overlay.

What DOES apply:
- **Universal Ceremony Gate (CERT-001–004)**: Existence checks only (session memory, PREHANDOVER proof if PR is opened, FAIL-ONLY-ONCE attestation).
- **KNOWLEDGE_GOVERNANCE overlay (OVL-KG-001–004)**: Only if the gap notice modifies a knowledge file.
- **Key IAA check for Track A**: Is the research output actionable? Does the gap notice give CS2 a clear, traceable re-upload request (MPS 1–25, Word format, upload path)? Is the absence of documents definitively confirmed (metadata query evidence, not assumption)?

If Track A closes with "sources absent" and the deliverable is a session memory + issue comment only → **no IAA final audit required** (EXEMPT). Foreman may close wave on this basis.

---

#### Q3 — FFA checks if implementation proceeds (structured JSON model + tests)?

Full BUILD_DELIVERABLE overlay applies. Key FFA items for this specific work:

| FFA Item | Check ID | Specific Application to This Wave |
|----------|---------|----------------------------------|
| User Journey Trace | BD-000 (A–D) | Free-assessment flow must be declared end-to-end: user navigates to /mmm/free-assessment → question bank loads → user answers questions → maturity score calculated. EACH step traced against diff. Missing journey declaration = REJECTION-PACKAGE. |
| Delivery Completeness | BD-001 | All 25 MPSs must be represented in the JSON model AND the question bank AND the tests. Partial MPS coverage = REJECTION-PACKAGE. |
| No stub/TODO | BD-002 | No TODO, stub MPS entry, placeholder question, or `// TODO: add questions for MPS-N` in production path. |
| One-time build compliance | BD-003 | Question bank must work end-to-end on first deployment. If derivation pipeline requires manual re-run on each deploy, IAA will flag as not one-time-build compliant. |
| Wiring verification | BD-005–006 | JSON model → question bank API → free-assessment UI → response collection → scoring → results display. Every link in chain verified. |
| Auth guards | BD-007 | Free assessment is unauthenticated (session_id only). Verify no JWT required at any step in the question bank fetch/response path. |
| Test quality | BD-011–013 | Tests must PROVE all 25 MPSs covered — not just that "tests pass". IAA will look for explicit assertions like `expect(coveredMPSIds).toHaveLength(25)`. Vacuous tests = REJECTION-PACKAGE. |
| RLS policies | BD-015 | If any new Supabase table or modification of `free_assessments` table → verify SELECT/INSERT/UPDATE/DELETE policies for all applicable roles. |
| No hardcoded secrets | BD-016 | KUC query credentials, Supabase keys must not appear in source. |
| Architecture alignment | BD-022 | Does the JSON derivation approach match the frozen MMM architecture? If it diverges (e.g., introduces a new data source not in the architecture) → IAA will flag as architecture change requiring CS2 approval. |
| NBR-001 | FAIL-ONLY-ONCE | If `useMutation` in question bank response path: verify `queryClient.invalidateQueries` present in `onSuccess`/`onSettled`. |
| NBR-002 | FAIL-ONLY-ONCE | If Supabase write for response storage: verify RLS policies cover unauthenticated session writes; verify application code checks for RLS-blocked response. |
| NBR-005 | FAIL-ONLY-ONCE | If schema migration added for question bank storage: column names in migration must exactly match application INSERT references. |
| MPS Coverage Proof | IAA-specific | Evidence must explicitly demonstrate all 25 MPSs (MPS-1 through MPS-25) are covered in: (a) JSON model, (b) question bank, (c) test assertions. A coverage table in the PREHANDOVER proof is strongly recommended. |
| KUC Source Traceability | IAA-specific | For each MPS in the JSON model, the source document reference (KUC document ID / title) must be declared. IAA cannot verify derivation correctness without source traceability. |
| Architecture Freeze Compliance | IAA-specific | MMM architecture was frozen per ARCH-FREEZE declarations. Foreman must confirm whether replacing the question bank approach modifies the frozen architecture. If yes → CS2 approval for unfreeze required before implementation PR can be opened. |

---

#### Q4 — PREHANDOVER structure required?

**Track A only (EXEMPT — no formal PREHANDOVER required):**
If the wave closes at Track A with no implementation, the PREHANDOVER is optional. However, IAA recommends:
```
## Header
  session_id: session-NNN
  branch: copilot/verify-generic-mps-source-documents
  wave: wave-mps-source-verification
  category: EXEMPT (research + gap recording only)
  iaa_audit_token: EXEMPT — no IAA final audit required (Track A only)
  ceremony_admin_appointed: NO

## Research Findings
  - Search query / method used
  - Tables / paths queried
  - Documents found (list with metadata): [YES: list] / [NO: "not found"]
  - Retrieval path status: [CONFIRMED/BLOCKED/NOT FOUND]
  - Conclusion: sources PRESENT or ABSENT

## Migration Gap Declaration (if applicable)
  - Gap ID: MIGRATION-GAP-MPS-SOURCE-001
  - Description: 25 generic MPS source Word documents absent from KUC/document-upload
  - Resolution path: CS2 re-upload of MPS 1–25 to KUC before proceeding to structured model
  - Blocking: Track B implementation BLOCKED pending re-upload

## Scope Declaration
  - files_changed: session memory, workspace notes, issue comment (no code)
  - files_changed_count: [N]
```

**Track B (AAWP_MAT — full PREHANDOVER MANDATORY):**
```
## Header
  session_id: session-NNN
  branch: copilot/verify-generic-mps-source-documents
  wave: wave-mps-source-verification
  issue: [issue number]
  iaa_audit_token: IAA-session-NNN-wave-mps-source-verification-20260428-PASS [pre-populated]
  ceremony_admin_appointed: NO

## Track A Evidence (prerequisite — MUST be referenced)
  - KUC source confirmation: [document list with metadata]
  - All 25 MPS sources confirmed present and retrievable

## Scope Declaration
  - files_changed: [enumerate every file with purpose]
  - files_changed_count: [N]
  - Category: AAWP_MAT

## MPS Coverage Declaration (MANDATORY)
  - JSON model: MPS-1 through MPS-25 confirmed in schema
  - Question bank: MPS-1 through MPS-25 confirmed covered
  - Coverage table: [MPS ID | Domain | Criteria Count | Question Count | Test ID]

## BD-000 User Journey Declaration (MANDATORY)
  - Flow: Free Assessment — Unauthenticated user completes diagnostic
  - Journey: User arrives at /mmm/free-assessment → question bank loads for each domain →
    user answers questions → system calculates baseline_maturity → results screen shown
  - Edge cases declared: [at minimum: empty response, partial completion, invalid session_id]

## Test Evidence
  - Test command: [exact command]
  - Total tests: [N] PASS, 0 FAIL
  - MPS coverage tests: [N] / 25 MPSs explicitly asserted
  - CI run: [URL or output snippet]
  - Zero .skip / .only / .todo confirmed: YES

## Architecture Freeze Compliance
  - Frozen architecture consulted: YES / Reference: [freeze document]
  - This change constitutes architecture deviation: YES/NO
  - If YES: CS2 approval reference: [issue/comment reference]

## Anti-Regression Evidence
  - NBR-001 (cache invalidation): [APPLICABLE/N-A] — evidence or justification
  - NBR-002 (RLS write): [APPLICABLE/N-A] — evidence or justification
  - NBR-005 (schema column match): [APPLICABLE/N-A] — evidence or justification

## KUC Source Traceability
  - Per-MPS source document reference (KUC document ID or title)

## Gate Status
  - CI: [PASS/FAIL]
  - Tests: [N] PASS, 0 FAIL
  - QP: [PASS/FAIL]
```

---

#### Q5 — Scope blockers?

| ID | Blocker | Severity | Status | Resolution Path |
|----|---------|----------|--------|----------------|
| SB-001 | **Track A is a hard prerequisite for Track B.** Implementation cannot begin until KUC source verification is complete and confirmed. If sources are absent, Track B is BLOCKED pending CS2 re-upload decision. | HIGH | OPEN — Track A not yet executed | Execute Track A first. Record result. Gate Track B on Track A outcome. |
| SB-002 | **Claim that pre-build stages 5–9 are incomplete is NOT supported by evidence.** IAA reviewed `modules/MMM/BUILD_PROGRESS_TRACKER.md`. All 12 MMM stages are COMPLETE (Stages 1–12, including Stage 5 Architecture, Stage 6 QA-to-Red, Stage 7 PBFAG, Stage 8 Implementation Plan, Stage 9 Builder Checklist — all COMPLETE ✅, confirmed by PR #1429 merged 2026-04-21). If Track B is a post-Stage-12 build increment on MMM, there is **NO PRE_BUILD_STAGE_MODEL blocker** — stages are already complete. | LOW — NOT a blocker (claim refuted) | RESOLVED by evidence | Foreman should amend the wave pre-brief question. PRE_BUILD_STAGE_MODEL overlay will only apply if BUILD_PROGRESS_TRACKER.md or module.manifest.json is touched in the implementation PR. |
| SB-003 | **Architecture freeze status for question bank replacement.** MMM architecture has been frozen (ARCH-FREEZE declarations visible in tracker). If replacing the question bank approach from "static" to "KUC-derived structured JSON" constitutes an architectural change (new data derivation pipeline, new data structure, new KUC runtime dependency), the frozen architecture may need CS2 amendment before implementation begins. | MEDIUM | OPEN — requires Foreman + CS2 declaration | Foreman must confirm: does the KUC-derived question bank approach deviate from frozen architecture? If yes → CS2 approval for architecture amendment required BEFORE Track B builder delegation. |
| SB-004 | **Relationship to PR #1500 unclear.** The pre-brief states this wave provides feedback for PR #1500 (current free-assessment replacement work). If PR #1500 is open and active on a different branch, there is a potential conflict: two parallel efforts modifying the free-assessment feature. Foreman must declare: (a) Does this wave REPLACE PR #1500? (b) Does this wave AMEND PR #1500's branch? (c) Is PR #1500 blocked pending this wave's outcome? | MEDIUM | OPEN — needs Foreman declaration | Foreman must explicitly state PR #1500 relationship in wave-current-tasks.md before delegating Track B implementation. |
| SB-005 | **Branch naming discrepancy.** Pre-brief request states branch `copilot/verify-mps-canonical-source`; actual git branch is `copilot/verify-generic-mps-source-documents`. Wave record must use the actual git branch name. | LOW | OPEN — requires Foreman acknowledgement | Foreman must confirm correct branch name. IAA records actual git branch: `copilot/verify-generic-mps-source-documents`. |

---

#### Q6 — Is research + gap recording alone sufficient, or must implementation proceed in this wave?

**IAA ruling: Track A alone IS sufficient to close this wave IF sources are absent. Track B is mandatory IF sources are confirmed present.**

Reasoning:
- The issue is framed as a CS2 clarification directive: "verify canonical generic MPS source pack BEFORE static question bank". The primary deliverable is a verified determination.
- The issue explicitly uses conditional language: "Architecture/Implementation (if source exists)". This gates Track B on Track A outcome.
- If Track A finds sources ABSENT → the correct action is: (a) record migration gap, (b) request CS2 re-upload, (c) BLOCK Track B pending re-upload. Wave closes. No implementation deficit.
- If Track A finds sources PRESENT → Track B implementation is required in this wave to satisfy the acceptance criteria. Research alone is insufficient when the source exists and the issue requires the structured model + question bank + tests.
- IAA cannot pre-determine which track applies. Only Track A execution produces the answer.

**Recommendation to Foreman:** Structure wave-current-tasks.md to reflect this conditional branching:
```
| Track A | KUC source verification | foreman-v2-agent / mat-specialist | PENDING |
| Track A | Gap recording (if absent) | foreman-v2-agent | CONDITIONAL |
| Gate | TRACK A RESULT: [ABSENT → close wave] [PRESENT → proceed to Track B] | — | — |
| Track B | Architecture amendment (if needed) | foreman + CS2 | CONDITIONAL |
| Track B | Structured JSON model + question bank + tests | mat-specialist / api-builder | CONDITIONAL |
| Track B | PREHANDOVER + IAA final audit | foreman + IAA | CONDITIONAL |
```

---

### PREHANDOVER Structure — Mandatory Sections (Summary)

Per AAWP_MAT overlay (applies to Track B if implementation proceeds):

**Mandatory sections**: Header, Track A Evidence (prerequisite proof), Scope Declaration, MPS Coverage Declaration, BD-000 User Journey Declaration, Test Evidence (100% pass, zero debt, CI URL), Architecture Freeze Compliance, Anti-Regression Evidence (NBR-001/002/005), KUC Source Traceability, Gate Status.

**iaa_audit_token format**: Pre-populated at commit time as `IAA-session-NNN-wave-mps-source-verification-YYYYMMDD-PASS`. IAA will append real token to this wave record under `## TOKEN` after final audit.

**PREHANDOVER proof immutability**: Read-only after initial commit per §4.3b / A-029.

---

### Scope Blockers Summary

| ID | Blocker | Blocking Track B? |
|----|---------|-----------------|
| SB-001 | Track A prerequisite | YES — Track B cannot start until Track A result confirmed |
| SB-002 | Pre-build stages claim (REFUTED) | NO — all 12 MMM stages confirmed COMPLETE |
| SB-003 | Architecture freeze compliance | CONDITIONAL — needs Foreman + CS2 declaration |
| SB-004 | PR #1500 relationship | CONDITIONAL — needs Foreman declaration |
| SB-005 | Branch naming discrepancy | NO (admin) — needs acknowledgement only |

**Hard blockers for Track B**: SB-001 (mandatory), SB-003 (if applicable), SB-004 (if applicable).

---

*Pre-Brief committed: 2026-04-28 | Wave: wave-mps-source-verification | Session: session-077-20260428*
*Anti-regression obligations: YES (Track B conditional) | Ceremony admin: NO*

---

## TOKEN

*(To be appended by IAA after final audit)*

---

## REJECTION_HISTORY

*(To be appended by IAA if rejection package issued)*
