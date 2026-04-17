# IAA Wave Record — mmm-stage8-implementation-plan-20260417

**Wave**: mmm-stage8-implementation-plan-20260417
**Issue**: maturion-isms#1400
**Branch**: copilot/mmm-stage-8-implementation-plan
**Date Created**: 2026-04-17
**IAA Session (Pre-Brief)**: session-mmm-stage8-implementation-plan-prebrief-20260417
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Record Pattern**: Single-file wave record (NO-STANDALONE-PREBRIEF-001 compliant)

---

## PRE-BRIEF

**Pre-Brief Mode**: PHASE_0 — triggered by wave-start request `action: "PRE-BRIEF"`
**Pre-Brief Issued**: 2026-04-17
**IAA Phase**: PHASE_B_BLOCKING (hard-gate ACTIVE)

---

### §1 — Wave Identity

| Field | Value |
|-------|-------|
| Wave | mmm-stage8-implementation-plan-20260417 |
| Module | MMM (Maturity Management Module) |
| Stage | Stage 8 — Implementation Plan |
| Issue | maturion-isms#1400 |
| CS2 Authorization | maturion-isms#1400 — IAA assumes CS2-opened per wave pattern (confirm before PREHANDOVER) |
| Stage 7 IAA Token | IAA-session-mmm-stage7-pbfag-20260415-PASS (confirmed in iaa-wave-record-mmm-stage7-pbfag-20260415.md) |
| Delegating Agent | foreman-v2-agent |
| Producing Agent | mat-specialist (D1–D2) + foreman-v2-agent (ceremony governance) + execution-ceremony-admin-agent (C1–C2) |

---

### §2 — Trigger Classification

**Primary Category**: `PRE_BUILD_STAGE_MODEL`

**Rationale** (trigger table v2.4.0 decision flow):
- **Step 1** — No `.github/agents/` or `governance/agents/` changes → AGENT_CONTRACT: NO.
- **Step 2** — No `governance/canon/` or `CANON_INVENTORY.json` changes → CANON_GOVERNANCE: NO.
- **Step 3** — No `.github/workflows/` changes → CI_WORKFLOW: NO.
- **Step 4** — No AAWP/MAT path pattern changes (no `packages/ai-centre/` or `modules/mat/`) → AAWP_MAT: NO.
- **Step 8** — PR produces `modules/MMM/07-implementation-plan/implementation-plan.md` (canonical Stage 8 artifact) and updates `modules/MMM/BUILD_PROGRESS_TRACKER.md` — **PRE_BUILD_STAGE_MODEL trigger fires**. Stage 8 (Implementation Plan) is explicitly listed in the 12-stage canonical sequence in `iaa-trigger-table.md` v2.4.0.
- **Step 11** — EXEMPT does not apply: PRE_BUILD_STAGE_MODEL trigger is unambiguous.
- No AGENT_CONTRACT, CANON_GOVERNANCE, CI_WORKFLOW, KNOWLEDGE_GOVERNANCE, or LIAISON_ADMIN triggers in scope.
- No class exemption claimed or applicable.

**IAA Required**: YES — MANDATORY
**Applicable Overlay**: PRE_BUILD_GATES (OVL-PBG-001 through OVL-PBG-016) + PRE_BRIEF_ASSURANCE (OVL-INJ-ADM-001 through OVL-INJ-ADM-003)
**Secondary category note**: This is a planning/governance documentation wave — no functional code, no schema migrations, no test changes, no CI workflow changes. BUILD_DELIVERABLE overlay does NOT apply. NBR-001 through NBR-005 (FUNCTIONAL-BEHAVIOUR-REGISTRY) do NOT apply to this wave directly (no functional code).

---

### §3 — Qualifying Tasks (for Final Handover Assurance)

The following deliverables qualify for IAA final audit at Phase 4:

| Task ID | Artifact Path | Overlay Checks Applicable | Notes |
|---------|--------------|--------------------------|-------|
| D1 | `modules/MMM/07-implementation-plan/implementation-plan.md` | OVL-PBG-008 (stage gating), OVL-PBG-011 (Stage 6 QA-to-Red confirmed), OVL-PBG-012 (Stage 7 PBFAG confirmed), OVL-PBG-015 (§7.2 Deployment Contract referenced), OVL-PBG-016 (§7.3 Golden Path referenced) | PRIMARY Stage 8 artifact — must contain explicit delivery waves, dependency declarations, sequencing rationale, handoff conditions for Stages 9, 10, and 11. Must reference builder classes (ui-builder, api-builder, schema-builder, qa-builder). Must NOT be `concurrent-prebuild-and-legacy-plan.md` (that is a partial plan). |
| D2 | `modules/MMM/BUILD_PROGRESS_TRACKER.md` | OVL-PBG-002 (identity consistent), OVL-PBG-006 (full 12-stage model), OVL-PBG-008 (stage gating respected) | Stage 8 must be marked IN_PROGRESS → COMPLETE with IAA token reference field pre-populated to expected reference; full 12-stage model must remain intact; no stages regressed. |
| C1 | PREHANDOVER proof — path TBD by execution-ceremony-admin-agent (expected: `.agent-workspace/execution-ceremony-admin-agent/bundles/PREHANDOVER-session-mmm-stage8-implementation-plan-20260417.md`) | CORE-020, CORE-021, CERT-001, CERT-004 | Ceremony gate — must exist and contain `iaa_audit_token` pre-populated with expected reference `IAA-session-mmm-stage8-implementation-plan-20260417-PASS` (per A-029 architecture). Must NOT use `PENDING` pattern. |
| C2 | Session memory — path TBD by foreman (expected: `.agent-workspace/foreman-v2/memory/session-mmm-stage8-implementation-plan-20260417.md`) | CERT-002, CERT-003 | Existence check; `fail_only_once_attested` declaration required |

**Total qualifying tasks**: 4 (D1, D2, C1, C2)

---

### §4 — PREHANDOVER Structure Requirements

The PREHANDOVER proof (C1) must conform to the following structure before IAA Phase 4 is invoked:

1. **Required fields**:
   - `wave`: mmm-stage8-implementation-plan-20260417
   - `issue`: maturion-isms#1400
   - `branch`: copilot/mmm-stage-8-implementation-plan
   - `iaa_audit_token`: pre-populated with expected reference `IAA-session-mmm-stage8-implementation-plan-20260417-PASS` (per FAIL-ONLY-ONCE A-029 architecture — NOT `PENDING`)
   - `stage`: Stage 8 — Implementation Plan
   - `producing_agents`: mat-specialist, foreman-v2-agent, execution-ceremony-admin-agent
   - `artifacts_produced`: list of D1–D2 paths with commit SHAs
   - `stage8_implementation_plan_complete`: COMPLETE (explicit)

2. **PREHANDOVER proof is read-only post-commit**: IAA will NOT edit the PREHANDOVER proof after it is committed. IAA appends token to `## TOKEN` section of THIS wave record only.

3. **Ceremony admin (`execution-ceremony-admin-agent`) produces the PREHANDOVER proof and session memory**. Token writing is IAA-only (ECAP-001). `execution-ceremony-admin-agent` MUST NOT write the ASSURANCE-TOKEN.

4. **`ceremony_admin_appointed`** must be declared `true` in `wave-current-tasks-mmm-stage8-implementation-plan-20260417.md` (or the active wave-current-tasks.md) before PREHANDOVER ceremony begins.

---

### §5 — Anti-Regression Obligations

**FUNCTIONAL-BEHAVIOUR-REGISTRY.md** — applicable niggles assessed for this wave:

| Niggle | Applies to Stage 8 Wave? | Assessment |
|--------|--------------------------|-----------|
| NBR-001 — TanStack Query mutation cache invalidation | **NOT APPLICABLE** — Stage 8 is a governance/planning wave, no UI or functional code in scope | NOT APPLICABLE |
| NBR-002 — Supabase RLS silent write block | **NOT APPLICABLE** — Stage 8 is a governance/planning wave, no DB code in scope | NOT APPLICABLE |
| NBR-003 — Zustand store reset | **NOT APPLICABLE** | NOT APPLICABLE |
| NBR-004 — Optimistic update rollback | **NOT APPLICABLE** | NOT APPLICABLE |
| NBR-005 — Schema migration column mismatch | **NOT APPLICABLE** | NOT APPLICABLE |

**Anti-regression obligations for Stage 8**: NO direct FBR obligations (no functional code in this wave).

**Forward obligation**: `implementation-plan.md` (D1) SHOULD explicitly reference NBR-001 through NBR-005 as mandatory verification items for each build wave to ensure the upcoming build (Stage 12) proactively catches these patterns. This is advisory, not blocking — IAA will note absence but not reject on this basis alone for a planning document.

**FAIL-ONLY-ONCE active rules applicable to this wave**:
- **A-001**: IAA invocation evidence must be present in PREHANDOVER proof (`iaa_audit_token` field) → enforced at Phase 4 CERT-004
- **A-002**: No class exemption claimed or applicable (no AGENT_CONTRACT in scope) → N/A this wave
- **A-003**: Ambiguity resolves to mandatory invocation → PRE_BUILD_STAGE_MODEL classification is unambiguous, no ambiguity
- **A-029**: `iaa_audit_token` must use expected-reference pattern `IAA-session-mmm-stage8-implementation-plan-20260417-PASS` — NOT `PENDING`, NOT `PHASE_A_ADVISORY` → enforced at Phase 4 CERT-004

---

### §6 — Stage-Readiness View (OVL-INJ-ADM-003)

Per PRE_BRIEF_ASSURANCE overlay (OVL-INJ-ADM-003) and trigger table v2.3.0+ requirements, IAA declares:

**Upstream stages complete assessment** (for Stage 8 readiness):

| Stage | Name | Status | Evidence |
|-------|------|--------|---------|
| Stage 1 | App Description | ✅ COMPLETE | CS2 approved maturion-isms#1298 (2026-04-08) |
| Stage 2 | UX Workflow & Wiring Spec | ✅ COMPLETE | CS2 approved maturion-isms#1352 (2026-04-13) |
| Stage 3 | FRS | ✅ COMPLETE | CS2 approved maturion-isms#1366 (2026-04-14) |
| Stage 4 | TRS | ✅ COMPLETE | CS2 carry-forward approved maturion-isms#1378 (2026-04-14) |
| Stage 5 | Architecture | ⚠️ ARTIFACTS COMPLETE — CS2 merge pending | Artifacts produced; IAA PBFAG token confirms dependency chain; pending CS2 approval/merge |
| Stage 6 | QA-to-Red | ⚠️ ARTIFACTS COMPLETE — CS2 merge pending | RED suite 176 tests produced; pending CS2 formal approval/merge |
| Stage 7 | PBFAG | ⚠️ ARTIFACTS COMPLETE — CS2 merge pending | IAA token IAA-session-mmm-stage7-pbfag-20260415-PASS issued; pending CS2 approval/merge |
| Stage 8 | Implementation Plan | 🔄 IN_PROGRESS (this wave) | This wave produces D1 and D2 |
| Stage 9 | Builder Checklist | ⬜ NOT_STARTED | Depends on Stage 8 completion |
| Stage 10 | IAA Pre-Brief | ⬜ NOT_STARTED | Depends on Stage 9 completion |
| Stage 11 | Builder Appointment | ⬜ NOT_STARTED | Depends on Stage 10 completion |
| Stage 12 | Build | ⬜ NOT_STARTED | Depends on Stage 11 completion |

**Artifacts reviewed to establish this view**:
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` (stage status matrix, lines 28–39)
- `.agent-admin/assurance/iaa-wave-record-mmm-stage7-pbfag-20260415.md` (Stage 7 IAA token confirmed)
- Stage 5 CS2 approval fields in BUILD_PROGRESS_TRACKER (IN_PROGRESS — pending merge)
- Stage 6 QA-to-Red status (COMPLETE artifacts, pending CS2 approval)

**OVL-PBG-008 stage gating assessment**: Stage 8 artifact production is authorized. All prerequisite stages (1–7) have either formal CS2 approval or IAA-confirmed artifact completion with CS2 approval pending. This is consistent with the pattern established in Stage 7 (Stage 5/6 also had CS2 approval pending at that time). The IAA token for Stage 7 (IAA-session-mmm-stage7-pbfag-20260415-PASS) explicitly states "Stage 8 authorized upon CS2 merge approval" — IAA accepts this as sufficient gate for beginning Stage 8 artifact production.

**Blockers preventing builder appointment (Stage 11)**:

| Blocker ID | Description | Severity | Resolution Path |
|------------|-------------|----------|----------------|
| BLOCKER-S8-001 | Stages 5, 6, 7 awaiting CS2 formal merge/approval | ⚠️ Required before Stage 11 builder appointment | CS2 must merge/approve Stage 5–7 PRs. Not a blocker for Stage 8 artifact production. |
| BLOCKER-S8-002 | Stage 9 Builder Checklist not yet produced | ⬜ Future gate | After Stage 8 completes. |
| BLOCKER-S8-003 | Stage 10 IAA Pre-Brief (final build pre-brief) not yet produced | ⬜ Future gate | After Stage 9 completes. |
| BLOCKER-S8-004 | `wave-current-tasks-mmm-stage8-implementation-plan-20260417.md` not yet confirmed in foreman personal workspace | ⚠️ Required before PREHANDOVER | Foreman must create dedicated wave-current-tasks for Stage 8 with `ceremony_admin_appointed: true`. The active `wave-current-tasks.md` points to `wave-ecap-cde-completion-20260417` (a different wave). |

**Hard blockers for Stage 8 artifact production**: NONE — mat-specialist delegation is cleared.

**Soft blockers before PREHANDOVER ceremony**:
- BLOCKER-S8-004: Foreman must create `wave-current-tasks-mmm-stage8-implementation-plan-20260417.md` with `ceremony_admin_appointed: true` declared.

---

### §7 — Scope Blockers Summary

**Is mat-specialist cleared to begin D1 (implementation-plan.md) production?** ✅ YES — no hard blockers.

**Scope boundary declaration** (what DOES and DOES NOT belong in this wave):

| In Scope | Out of Scope |
|----------|-------------|
| `modules/MMM/07-implementation-plan/implementation-plan.md` (NEW — canonical Stage 8 artifact) | Any changes to `.github/agents/` (AGENT_CONTRACT trigger — separate wave) |
| `modules/MMM/BUILD_PROGRESS_TRACKER.md` (Stage 8 status update only) | Any changes to `governance/canon/` (CANON_GOVERNANCE trigger) |
| Governance ceremony artifacts (wave-current-tasks, scope-declaration, PREHANDOVER, session memory, this wave record) | Any changes to `.github/workflows/` (CI_WORKFLOW trigger) |
| | Any schema migrations, test changes, or functional code |
| | Stage 9, 10, 11 artifacts (future waves) |

**Important scope clarification**: The existing `modules/MMM/07-implementation-plan/concurrent-prebuild-and-legacy-plan.md` is a PARTIAL concurrent-programme planning artifact from 2026-04-08 (mmm-cpa wave). It is NOT the canonical Stage 8 Implementation Plan artifact. D1 (`implementation-plan.md`) must be a NEW file — the primary canonical Stage 8 artifact.

---

### §8 — Acceptance Conditions (Phase 4 IAA will verify)

At final handover assurance (Phase 4), IAA will verify the following:

1. **D1 — implementation-plan.md exists and is substantive**:
   - File is present at `modules/MMM/07-implementation-plan/implementation-plan.md`
   - Contains explicit delivery waves (not just titles)
   - Includes dependency declarations between waves
   - Includes sequencing rationale for Stages 9, 10, 11
   - Specifies handoff conditions for each downstream stage
   - Names builder classes required: ui-builder, api-builder, schema-builder, qa-builder
   - References the Stage 6 QA-to-Red RED suite as the implementation contract
   - References the PBFAG artifacts (golden paths, deployment contract) from Stage 7

2. **D2 — BUILD_PROGRESS_TRACKER.md Stage 8 entry**:
   - Stage 8 row updated from `NOT_STARTED` to `COMPLETE`
   - IAA token reference field pre-populated to `IAA-session-mmm-stage8-implementation-plan-20260417-PASS`
   - Full 12-stage model intact (no regression)
   - Module identity fields (slug, name) unchanged

3. **C1 — PREHANDOVER proof**:
   - File exists at declared path
   - `iaa_audit_token` field is `IAA-session-mmm-stage8-implementation-plan-20260417-PASS` (not PENDING)
   - `stage8_implementation_plan_complete: COMPLETE` declared

4. **C2 — Session memory**:
   - File exists at declared path
   - `fail_only_once_attested` declaration present

5. **OVL-PBG-001 through OVL-PBG-009** — module identity consistency checks (applied at Phase 4)

6. **CORE-020 + CORE-021** — zero partial pass; zero severity tolerance

---

### §9 — Pre-Brief Completion

**Pre-Brief Status**: COMPLETE ✅
**Qualifying tasks**: 4 (D1, D2, C1, C2)
**Applicable overlay**: PRE_BUILD_STAGE_MODEL → PRE_BUILD_GATES (OVL-PBG-001 to OVL-PBG-016) + PRE_BRIEF_ASSURANCE (OVL-INJ-ADM-001 to OVL-INJ-ADM-003)
**Anti-regression obligations**: NO — planning/governance wave only; no functional code; NBR-001 through NBR-005 do not apply
**Hard blockers**: NONE — mat-specialist delegation cleared
**Soft blockers**: BLOCKER-S8-004 — Foreman must create dedicated `wave-current-tasks-mmm-stage8-implementation-plan-20260417.md` with `ceremony_admin_appointed: true` before PREHANDOVER ceremony
**IAA Pre-Brief Issued By**: independent-assurance-agent (session-mmm-stage8-implementation-plan-prebrief-20260417)
**Date**: 2026-04-17
**Adoption Phase**: PHASE_B_BLOCKING — all checks at final audit are hard-blocking

---

## TOKEN

**PHASE_B_BLOCKING_TOKEN**: IAA-session-mmm-stage8-implementation-plan-20260417-PASS

```
═══════════════════════════════════════
ASSURANCE-TOKEN
PR: copilot/mmm-stage-8-implementation-plan | Issue maturion-isms#1400
Wave: mmm-stage8-implementation-plan-20260417
All 38 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-mmm-stage8-implementation-plan-20260417-PASS
Adoption phase: PHASE_B_BLOCKING
Date: 2026-04-17
═══════════════════════════════════════
```

**Checks run**: 38 total — 38 PASS, 0 FAIL
**Overlay applied**: PRE_BUILD_STAGE_MODEL → PRE_BUILD_GATES (OVL-PBG-001–016) + ACR-01–08 (ceremony-admin appointed) + CORE-020 + CORE-021
**FAIL-ONLY-ONCE**: A-001 PRESENT | A-002 CONFIRMED | A-029 CONFIRMED
**Independence**: IAA did not produce any artifact in this wave — CONFIRMED
**Git state at audit**: HEAD dd30a8b — tree clean

---

## REJECTION_HISTORY

*(No rejections recorded — wave in progress)*
