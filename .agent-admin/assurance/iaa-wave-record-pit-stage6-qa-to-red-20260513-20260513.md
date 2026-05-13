# IAA Wave Record — pit-stage6-qa-to-red-20260513

| Field | Value |
|-------|-------|
| Wave | pit-stage6-qa-to-red-20260513 |
| Date | 2026-05-13 |
| Branch | copilot/create-stage-6-red-test-package |
| Issue | maturion-isms#1634 |
| PR | Not yet created (Pre-Brief only) |
| IAA Session (Pre-Brief) | IAA-session-pit-stage6-qa-to-red-20260513-PREBRIEF |
| Adoption Phase | PHASE_B_BLOCKING |
| Ceremony Admin Appointed | NONE — governance documentation wave (Foreman + pit-specialist direct execution) |

---

## PRE-BRIEF

**Generated**: 2026-05-13
**Invocation type**: PRE-BRIEF (Phase 0 — Wave start)
**Triggered by**: Foreman wave start request, Issue #1634 opened by @APGI-cmy

---

### Qualifying Tasks

| # | Task | Expected Executor | Trigger Classification |
|---|------|------------------|----------------------|
| T-1 | Create `modules/pit/06-qa-to-red/qa-to-red-plan.md` | pit-specialist | PRE_BUILD_STAGE_MODEL (Stage 6 lifecycle artifact) |
| T-2 | Create `modules/pit/06-qa-to-red/red-test-suite-catalog.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-3 | Create `modules/pit/06-qa-to-red/frs-to-red-traceability.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-4 | Create `modules/pit/06-qa-to-red/trs-to-red-traceability.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-5 | Create `modules/pit/06-qa-to-red/architecture-to-red-traceability.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-6 | Create `modules/pit/06-qa-to-red/lfv-to-red-traceability.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-7 | Create `modules/pit/06-qa-to-red/route-screen-state-red-matrix.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-8 | Create `modules/pit/06-qa-to-red/role-denied-path-red-matrix.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-9 | Create `modules/pit/06-qa-to-red/timeline-engine-red-tests.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-10 | Create `modules/pit/06-qa-to-red/live-functional-red-gates.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-11 | Create `modules/pit/06-qa-to-red/stage6-gate-readiness-checklist.md` | pit-specialist | PRE_BUILD_STAGE_MODEL |
| T-12 | Update `modules/pit/BUILD_PROGRESS_TRACKER.md` (Stage 6 posture) | pit-specialist / Foreman | PRE_BUILD_STAGE_MODEL (BUILD_PROGRESS_TRACKER.md explicit trigger) |
| T-A | Create per-PR scope declaration `.agent-admin/scope-declarations/pr-{PR}.md` | Foreman | Standard ceremony |
| T-B | Create `.admin/prs/pr-{PR}.json` manifest | Foreman | Standard ceremony |
| T-C | Create PREHANDOVER proof `.agent-admin/prehandover/proof-pr-{PR}-pit-stage6-qa-to-red-20260513.md` | Foreman | Standard ceremony |

**Total qualifying tasks (substantive)**: 2 (T-12 = BUILD_PROGRESS_TRACKER trigger; T-1–T-11 = Stage 6 lifecycle artifacts)

---

### Applicable Overlay

**Primary category**: `PRE_BUILD_STAGE_MODEL`

**Rationale**: This PR advances PIT module from Stage 5b (LFV) to Stage 6 (QA-to-Red) by:
1. Creating Stage 6 lifecycle artifacts under `modules/pit/06-qa-to-red/` — PRE_BUILD_STAGE_MODEL explicit trigger (pre-build lifecycle stage artifacts)
2. Updating `modules/pit/BUILD_PROGRESS_TRACKER.md` — PRE_BUILD_STAGE_MODEL explicit trigger per iaa-trigger-table.md §8

**Overlay**: PRE_BUILD_GATES — OVL-PBG-001 through OVL-PBG-017 + OVL-PBG-ADM-001

**Secondary categories assessed and cleared**:
- AGENT_CONTRACT: NO — no `.github/agents/*.md` changes in scope
- CANON_GOVERNANCE: NO — no `governance/canon/` or CANON_INVENTORY.json changes in scope
- CI_WORKFLOW: NO — no `.github/workflows/` changes in scope; no workflow installation per wave description
- KNOWLEDGE_GOVERNANCE: NO — no `.agent-workspace/*/knowledge/` changes in scope
- PRODUCT_BUILD_ASSURANCE: NO — governance documentation only; no production code, no UI, no API delivery

**Ambiguity**: CLEAR — PRE_BUILD_STAGE_MODEL unambiguously triggered. No mixed signals.

---

### Anti-Regression Obligations

**Anti-regression obligations**: **NO**

FUNCTIONAL-BEHAVIOUR-REGISTRY.md entries NBR-001 through NBR-005 are NOT triggered by this PR. Justification:
- NBR-001 (TanStack Query cache invalidation): no React Query mutations in scope — governance docs only
- NBR-002 (Supabase RLS silent write block): no Supabase write operations in scope
- NBR-003 (Zustand store state not reset): no Zustand store changes in scope
- NBR-004 (Optimistic update rollback): no optimistic mutations in scope
- NBR-005 (Schema migration column mismatch): no schema migrations in scope

No functional behaviour registry entries apply to this governance-documentation-only wave.

---

### FAIL-ONLY-ONCE Rules Active at Full Assurance

The following FAIL-ONLY-ONCE rules will be enforced at full assurance invocation:

| Rule | Description | Application |
|------|-------------|-------------|
| A-001 | IAA invocation evidence must be present | PREHANDOVER proof must reference IAA token (not PENDING, not blank) |
| A-003 | Ambiguity resolves to mandatory | Ambiguity already resolved above — PRE_BUILD_STAGE_MODEL clear |
| A-021 | Artifacts committed before IAA invocation | All 11 + tracker artifacts must be git-committed before PREHANDOVER proof declared COMPLETE |
| A-033 | Git-committed vs disk existence | IAA will verify via `git ls-tree HEAD` — disk presence alone is insufficient |
| A-036 | Temporal integrity | No future-dated Stage 6 clearance or build authorization claims permitted |
| A-037 | Evidence-type discipline | LIVE_RUNTIME/LIVE_E2E items cannot be satisfied by STATIC_CODE or CONFIG evidence |
| A-039 | Agent claims are not evidence | Acceptance-Criteria Matrix required per governing issue #1634 acceptance criteria |
| A-040 | Evidence-type downgrade prohibition | Runtime evidence cannot be substituted without explicit CS2 written waiver |
| A-041 | Diff-first classification | IAA will independently compute changed files from `git diff main..HEAD` before accepting any declared scope |
| A-042 | Independent risk challenge | Five-question challenge completed before PASS token issued |

---

### PREHANDOVER Structure Requirements

The PREHANDOVER proof (to be created by Foreman before full IAA assurance invocation) MUST include the following sections and fields to avoid ceremony rejection:

#### Mandatory Sections

1. **Wave Identity Block**
   - wave_id, session_id, branch, PR number, issue number
   - `ceremony_admin_appointed: NONE`
   - `final_state: COMPLETE` (only when all tasks done)

2. **Stage Gate Advancement Declaration**
   - Prior stage confirmation: Stage 5 Architecture (PR #1612, token `IAA-session-pit-stage5-architecture-20260511-PASS`)
   - Prior stage confirmation: Stage 5b LFV (**SCOPE BLOCKER SB-01 — see below** — must be MERGED with ASSURANCE-TOKEN before this field can show COMPLETE)
   - Stage 6 advancement: QA-to-Red artifacts created and committed

3. **Artifact Evidence Block**
   All 11 Stage 6 artifacts + BUILD_PROGRESS_TRACKER.md must be listed with:
   - Full file path
   - Git-committed confirmation (not just on-disk — A-033)

4. **CS2 Authorization Statement**
   - Must reference Issue #1634 opened by @APGI-cmy
   - Must accurately describe Issue #1634 scope (QA-to-Red package, not any other issue)
   - **WARNING**: F-01/F-02 of LFV REJECTION-PACKAGE occurred because the CS2 authorization cited the wrong governing issue. Verify issue title matches before declaring complete.

5. **IAA Token Reference Field**
   - `iaa_audit_token`: Must be pre-populated with expected format `IAA-session-pit-stage6-qa-to-red-20260513-PASS`
   - Must NOT be blank, `PENDING`, `[not-yet-populated]`, or `<token>` (ACR-13)

6. **Gate Set Checked** (ACR-09)
   - `gate_set_checked:` must be populated with named gates — not empty

7. **OVL-PBG-008 Stage Gating Evidence**
   - Confirmation that Stages 1–5b are all COMPLETE in BUILD_PROGRESS_TRACKER
   - If Stage 5b LFV is not yet merged at time of PREHANDOVER creation → flag explicitly

---

### Scope Blockers

| ID | Blocker | Severity | Resolution Path |
|----|---------|----------|----------------|
| **SB-01** | **CRITICAL — Stage 5b LFV (PR #1624) has active REJECTION-PACKAGE** (IAA-session-pit-lfv-package-20260512-REJECT-001, 5 failures). OVL-PBG-008 requires all prior stages COMPLETE before Stage 6 can advance. IAA cannot issue ASSURANCE-TOKEN for Stage 6 until Stage 5b LFV has a valid ASSURANCE-TOKEN and is merged. | **HARD BLOCK** — Stage 6 IAA full assurance cannot proceed until resolved | Foreman must resolve all 5 LFV REJECTION failures (F-01: wrong governing issue reference; F-02: CS2 authorization unverifiable; F-03: audit traceability void; F-04: PR draft status + open checklist; F-05: wave-current-tasks T-6 status mismatch), re-invoke IAA for PR #1624, obtain ASSURANCE-TOKEN, and merge PR #1624 before triggering Stage 6 full assurance |
| SB-02 | Stage 6 artifacts must derive from Stages 1–5 FRS/TRS/Architecture and Stage 5b LFV — not generic templates. IAA will verify RED test traceability chains to prior-stage artifacts at full assurance. | HARD — artifact fabrication without genuine traceability = REJECTION-PACKAGE | pit-specialist must derive RED tests from actual PIT FRS IDs, TRS IDs, Architecture ADRs, and LFV journey steps |
| SB-03 | BUILD_PROGRESS_TRACKER.md update must reflect Stage 6 posture only — no build authorization, no Stage 7+ advancement claims | HARD — premature build authorization = REJECTION-PACKAGE | Foreman must ensure Stage 6 = COMPLETE/REVIEW and Stage 7+ = NOT_STARTED |
| SB-04 | No production code, no migrations, no `.github/workflows/` installations permitted per wave description. If any such file appears in the diff, PR re-classification to CI_WORKFLOW or PRODUCT_BUILD_ASSURANCE is required. | HARD — IAA will independently verify via A-041 diff-first classification | Wave must contain only `modules/pit/06-qa-to-red/` files + `modules/pit/BUILD_PROGRESS_TRACKER.md` + ceremony artifacts |
| SB-05 | All 11 Stage 6 artifacts + BUILD_PROGRESS_TRACKER.md must be git-committed (A-033). Disk existence alone will fail. | HARD — IAA verifies via `git ls-tree HEAD` | Foreman must `git add` + `git commit` + `git push` all files before PREHANDOVER declared COMPLETE |

---

### OVL-PBG Checks Active at Full Assurance

The following PRE_BUILD_GATES checks will be applied at full assurance. Pre-brief advisory notes provided:

| Check | Name | Pre-Brief Advisory |
|-------|------|--------------------|
| OVL-PBG-001 | module.manifest.json slug matches directory | Verify `module_slug: "pit"` in `modules/pit/module.manifest.json` |
| OVL-PBG-002 | BUILD_PROGRESS_TRACKER module identity consistent | Verify module name/slug in BUILD_PROGRESS_TRACKER matches manifest |
| OVL-PBG-003 | Architecture doc references correct module name | Not directly applicable to Stage 6 artifacts — advisory |
| OVL-PBG-004 | IAA Pre-Brief exists before FRS wave builder delegation | N/A — no builder delegation in this wave; Stage 6 is pre-Stage 11 |
| OVL-PBG-005 | AGENT_HANDOVER_AUTOMATION version cited matches canonical | Standard check at full assurance |
| OVL-PBG-006 | BUILD_PROGRESS_TRACKER uses full 12-stage model | Verify Stage 6 update does not truncate the 12-stage model |
| OVL-PBG-007 | Architecture doc references full lifecycle sequence | Not directly applicable to Stage 6 — advisory |
| **OVL-PBG-008** | **Stage gating respected (no skipped stages)** | **CRITICAL — SB-01 dependency: Stage 5b LFV must be COMPLETE before Stage 6 advance** |
| OVL-PBG-009 | Legacy directory numbering flagged | Verify `06-qa-to-red/` is correct canonical numbering |
| OVL-PBG-010 | Stage 2 UX Wiring Spec present | Verify Stage 2 documented as COMPLETE in BUILD_PROGRESS_TRACKER |
| **OVL-PBG-011** | **Stage 6 QA-to-Red suite exists before implementation** | **This wave IS creating Stage 6 — verify completeness of RED suite against FRS/TRS/Architecture coverage** |
| OVL-PBG-012 | Stage 7 PBFAG confirmed before builder delegation | N/A — no builder delegation |
| OVL-PBG-013 | Stage 9 Builder Checklist passed before appointment | N/A — no builder appointment |
| OVL-PBG-014 | §7.1 Change-Propagation Audit | N/A — Stage 6 derives from upstream, does not modify upstream artifacts |
| OVL-PBG-015 | §7.2 Runtime/Deployment Contract before first build wave | N/A — not first build wave in this PR |
| OVL-PBG-016 | §7.3 Golden Path Verification Pack before first build wave | N/A — not first build wave in this PR |
| OVL-PBG-017 | §7.4 Deployment Execution Contract before first build wave | N/A — not first build wave in this PR |
| OVL-PBG-ADM-001 | PRE_BUILD_GATES overlay loaded | IAA must confirm OVL-PBG-001–OVL-PBG-017 applied |

---

## TOKEN

*Pre-Brief only — no assurance performed. ASSURANCE-TOKEN will be appended here after full assurance.*

**BLOCKED pending SB-01 resolution**: Stage 5b LFV (PR #1624) must obtain ASSURANCE-TOKEN and be merged before Stage 6 full assurance can be cleared.

---

## REJECTION_HISTORY

*No rejections issued at Pre-Brief stage.*

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Adoption Phase**: PHASE_B_BLOCKING
**Self-Modification Lock**: SELF-MOD-IAA-001 — ACTIVE
