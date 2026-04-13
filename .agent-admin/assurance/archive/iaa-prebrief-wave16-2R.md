# IAA Pre-Brief — Wave 16.2R Remediation: Deferred Frontend UX Gaps

**Pre-Brief ID**: IAA-PREBRIEF-wave16-2R-20260310
**Wave**: wave16-2R — Wave 16.2R Remediation: Implement Deferred Frontend UX Gaps (GAP-009, GAP-014, GAP-015, GAP-024)
**Branch**: copilot/implement-deferred-frontend-ux-gaps
**Date**: 2026-03-10
**Produced by**: independent-assurance-agent v6.2.0
**Requested by**: foreman-v2-agent (wave16-2R pre-brief invocation)
**Authority**: CS2 (@APGI-cmy)
**Issue**: Wave 16.2R — Remediation: Implement Deferred Frontend UX Gaps (GAP-009, GAP-014, GAP-015, GAP-024)
**Prior wave**: wave16-full-batch (PR #1038 merged — GAPs explicitly deferred)
**wave-current-tasks.md read at**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` (wave16-2R section, top of file)
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE

---

## § 0 — Pre-Brief Mode Confirmation

This document is a **PRE-BRIEF artifact only**.

IAA is NOT executing Phase 2–4 assurance in this session. This pre-brief is issued in
response to `[IAA PRE-BRIEF REQUEST]` from foreman-v2-agent per `IAA_PRE_BRIEF_PROTOCOL.md §Trigger`.

Full assurance (ASSURANCE-TOKEN or REJECTION-PACKAGE) will be issued at handover when
Foreman invokes IAA with the completed PREHANDOVER proof on this branch, after all 4 gaps
are implemented and QA gates are green.

This pre-brief declares: trigger categories, FFA checks, PREHANDOVER structure required,
governance blockers visible now, and per-task evidence requirements.

---

## § 1 — Wave Scope Review

**Source**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` — wave16-2R section, read in full.

### Gap Register

| Gap ID | Component | Description | Change Type | New File? |
|--------|-----------|-------------|-------------|-----------|
| GAP-009 | `CriteriaModal.tsx` | Wire to `useCriteria`, `useEvaluations`, `useScores` hooks — remove mock/hardcoded data | Enhancement | NO |
| GAP-014 | `EvidenceCollection.tsx` | Add `<audio>` player for `type='interview'` and `type='audio'` items with accessible controls | Enhancement | NO |
| GAP-015 | `contexts/AuditContext.tsx` + `App.tsx` + consuming pages | Create `AuditContext` provider; provide `selectedAuditId` + setter; wire consuming pages away from local state | New file + wiring | YES |
| GAP-024 | `AuditList.tsx`, `EvidenceCollection.tsx` | Replace `window.confirm()` / `confirm()` with state-based inline confirmation banners; ARIA-labelled confirm/cancel controls | Enhancement | NO |

### Files in Scope (Confirmed)

| File | Gap(s) | Confirmed Present? |
|------|--------|--------------------|
| `modules/mat/frontend/src/components/criteria/CriteriaModal.tsx` | GAP-009 | ✅ YES |
| `modules/mat/frontend/src/components/evidence/EvidenceCollection.tsx` | GAP-014, GAP-024 | ✅ YES |
| `modules/mat/frontend/src/components/audits/AuditList.tsx` | GAP-024 | ✅ YES |
| `modules/mat/frontend/src/contexts/AuditContext.tsx` | GAP-015 | ✅ NEW (AuthContext.tsx confirmed in contexts/ — AuditContext.tsx absent = new file required) |
| `modules/mat/frontend/src/App.tsx` | GAP-015 | Expected present |
| Consuming pages using local `auditId` state | GAP-015 | IAA to verify completeness at handover |

### Files Confirmed Out of Scope

- `.github/agents/` — NO (A-013: agent contract immutability)
- `governance/canon/` — NO
- `.github/workflows/` — NO
- `supabase/migrations/` — NO
- `apps/mat-ai-gateway/` — NO
- Any backend API route — NO

---

## § 2 — Trigger Category Declaration

### 2.1 — Wave-Level Trigger

| Category | Triggered? | Basis |
|----------|-----------|-------|
| **AAWP_MAT** | **YES — PRIMARY** | All changes in `modules/mat/frontend/` — delivers executable MAT application behaviour |
| AGENT_CONTRACT | NO | No `.github/agents/` changes expected or in scope |
| CANON_GOVERNANCE | NO | No `governance/canon/` changes expected |
| CI_WORKFLOW | NO | No `.github/workflows/` changes expected |
| KNOWLEDGE_GOVERNANCE | NO | No `.agent-workspace/*/knowledge/` changes expected |
| AGENT_INTEGRITY | NO | No `governance/quality/agent-integrity/` changes expected |
| EXEMPT | NO — AAWP_MAT applies |

**Watchpoints**: If the ui-builder unexpectedly touches `.github/agents/`, `governance/`, or
`.github/workflows/` — category escalates to **MIXED** and IAA must be re-informed by
Foreman before handover invocation. A-013 prohibits agent contract modifications by
unauthorised builders. Any such change = immediate REJECTION-PACKAGE at CORE-017.

### 2.2 — Per-Task Trigger Confirmation

| Task | Builder | Trigger Category | IAA Required? |
|------|---------|-----------------|---------------|
| T-W162R-QA-001 — RED QA suite | qa-builder | AAWP_MAT | YES (included in main PR bundle — IAA verifies RED state) |
| T-W162R-UI-001 — GAP-009 | ui-builder | AAWP_MAT | YES |
| T-W162R-UI-002 — GAP-014 | ui-builder | AAWP_MAT | YES |
| T-W162R-UI-003 — GAP-015 | ui-builder | AAWP_MAT | YES |
| T-W162R-UI-004 — GAP-024 | ui-builder | AAWP_MAT | YES |

---

## § 3 — FFA Checks to be Run at Handover

IAA will execute the full AAWP_MAT overlay (BD-001 through BD-024) at handover.
The following checks have **heightened focus** for this wave given the nature of the 4 gaps:

### 3.1 — Tier 1 (Delivery Completeness) — All Four Gaps

| FFA Check | Specific Focus for Wave 16.2R |
|-----------|-------------------------------|
| **BD-001** (Full scope delivered) | All 4 gaps (GAP-009, 014, 015, 024) must be present in the diff. Partial delivery of any single gap = REJECTION-PACKAGE citing which gap is missing |
| **BD-002** (No stub/TODO) | CriteriaModal.tsx must have zero remaining mock data or hardcoded stubs; AuditContext.tsx must be substantively implemented; no TODO in audio player or confirmation banner paths |
| **BD-003** (One-time build compliance) | If merged today: can a user (1) open CriteriaModal and see real data, (2) play audio from evidence, (3) switch audits via AuditContext without page reload, (4) confirm/cancel destructive actions via accessible banner — all without an immediate follow-up fix? |

### 3.2 — Tier 2 (Wiring & Integration) — Gap-Specific Verification

| FFA Check | Specific Focus for Wave 16.2R |
|-----------|-------------------------------|
| **BD-005** (End-to-end wiring) | **GAP-009**: CriteriaModal must call real hooks (`useCriteria` / `useCriteriaEvaluations` / `useScores` or equivalent); data must flow from Supabase → hook → modal tabs. IAA traces the complete chain. **GAP-015**: AuditContext provider must wrap the router; all pages that used local `auditId` state must consume `useAuditContext()` — IAA verifies consuming pages are updated, not just the context file created |
| **BD-006** (Writers and readers) | **GAP-015**: AuditContext must expose a setter (writer) and at minimum 2 consuming pages must read from it (readers). Context with no consumers = orphaned deliverable |
| **BD-009** (Cross-component integration) | **GAP-015**: Verify that switching `selectedAuditId` via AuditContext correctly propagates to all previously local-state pages; no stale state or double-source-of-truth for auditId remains |
| **BD-010** (No orphaned deliverables) | AuditContext.tsx must be consumed — not created and unused. Any new hook or helper created for GAP-014 must be invoked from EvidenceCollection.tsx |

### 3.3 — Tier 3 (Test Quality) — Red→Green Gate

| FFA Check | Specific Focus for Wave 16.2R |
|-----------|-------------------------------|
| **BD-011** (100% test pass rate) | All tests in the qa-builder RED suite must be GREEN after ui-builder implementation. Zero failures. The minimum per the task register: ≥ 2 per gap = ≥ 8 tests total. IAA counts passing tests from CI/test run output |
| **BD-012** (Zero test debt) | No `.skip()`, `.only()`, or `test.todo()` in any test file added by qa-builder or ui-builder; every gap has at least its minimum test count confirmed failing (RED) before build, then confirmed passing (GREEN) after |
| **BD-013** (No test dodging) | **GAP-024 specific**: Tests that assert `window.confirm` is NOT called must be genuine. IAA will check that the test spy/mock actually observes call count and that the assertion would fail if `window.confirm` remained. Vacuous not-called checks = test dodging |

### 3.4 — Tier 4 (Security) — Accessibility & Input Safety

| FFA Check | Specific Focus for Wave 16.2R |
|-----------|-------------------------------|
| **BD-016** (No hardcoded secrets) | No API keys or Supabase credentials hardcoded in any new code |
| **BD-017** (Input validation) | **GAP-014**: `src` URL for `<audio>` element must come from validated/controlled data (not raw user input). If the audio URL is derived from Supabase storage: confirm path is sanity-checked before rendering |
| **BD-018** (No injection vectors) | **GAP-014**: Audio src must not be an unvalidated string passed directly from user-controlled input. **GAP-024**: Confirmation banner content must not render user-controlled strings as HTML (XSS vector). IAA checks for `dangerouslySetInnerHTML` or unescaped interpolation |
| **BD-019** (International standards — WCAG) | **GAP-024**: Confirmation banner MUST have ARIA labels on confirm and cancel buttons per acceptance criteria. **GAP-014**: `<audio>` element must have accessible controls (`controls` attribute or equivalent ARIA pattern). WCAG 2.1 AA applies to all MAT UI. Missing ARIA on new interactive elements = REJECTION-PACKAGE |

### 3.5 — Tier 5 (Code Quality) — Architecture Fit

| FFA Check | Specific Focus for Wave 16.2R |
|-----------|-------------------------------|
| **BD-022** (Architecture alignment) | **GAP-024**: Pattern must match `CriteriaUpload.tsx` confirmation banner pattern as specified in acceptance criteria. Divergence requires explicit justification in PREHANDOVER proof or IAA raises as finding |
| **BD-021** (TypeScript strictness) | No `any` casts introduced; no unsafe type assertions masking real type errors in new context/hook/component code |

### 3.6 — Complete FFA Output Expected at Handover

```
FFA Result:
  FFA-01 Delivery Completeness: [PASS|FAIL] — all 4 gaps delivered in diff
  FFA-02 Wiring Verification: [PASS|FAIL] — hooks wired, context consumed, audio src validated
  FFA-03 Integration Fit: [PASS|FAIL] — AuditContext propagates correctly, no double-state
  FFA-04 Security: [PASS|FAIL] — ARIA present, no XSS vectors, no hardcoded secrets
  FFA-05 Code Quality: [PASS|ADVISORY|FAIL] — TypeScript strict, CriteriaUpload pattern match
  FFA-06 One-Time Build: [PASS|FAIL] — all 4 features work first-time on merge
  FFA-CARRY-FORWARD: [NONE|ISSUED] — any pre-existing broken state from prior waves
```

---

## § 4 — PREHANDOVER Proof Structure Required

The Foreman must commit a PREHANDOVER proof before invoking IAA at handover.
The PREHANDOVER proof must contain ALL of the following sections — absence of any section
is immediate REJECTION-PACKAGE at CORE-018.

### 4.1 — Mandatory PREHANDOVER Proof Fields

```yaml
prehandover_proof:
  wave: wave16-2R
  branch: copilot/implement-deferred-frontend-ux-gaps
  session_id: <session-NNN-wave16-2R-YYYYMMDD>
  producing_agent: foreman-v2-agent
  builder_agents:
    - qa-builder (T-W162R-QA-001)
    - ui-builder (T-W162R-UI-001 through T-W162R-UI-004)
  pr_title: <actual PR title>
  pr_number: <PR number once opened — or "pending" if pre-open>
  iaa_audit_token: "IAA-session-<NNN>-wave16-2R-<YYYYMMDD>-PASS"  # pre-populated expected ref
```

### 4.2 — Mandatory Evidence Sections

The PREHANDOVER proof body must contain these sections:

| Section | Required Content |
|---------|-----------------|
| **§ Task Completion Register** | All 5 tasks (T-W162R-QA-001, T-W162R-UI-001 through 004) declared DONE with evidence link or commit SHA per task |
| **§ RED QA Gate Evidence** | Confirmation that T-W162R-QA-001 (RED suite) was committed and all tests were confirmed failing BEFORE ui-builder delegation; minimum counts met (≥ 2 per gap) |
| **§ QP Evaluation** | Foreman confirms: 100% GREEN test pass rate; zero failures; zero `.skip()` / `.only()`; zero warnings tolerated |
| **§ Scope Compliance** | Explicit declaration that no `.github/agents/`, `governance/canon/`, `.github/workflows/`, schema migration, or Edge Function files are in the PR diff |
| **§ GAP-009 Evidence** | CriteriaModal.tsx wired to real hooks; mock data removed; link to specific file diff or commit |
| **§ GAP-014 Evidence** | Audio player implemented in EvidenceCollection.tsx for type='audio' and type='interview'; accessible controls present; link to diff |
| **§ GAP-015 Evidence** | AuditContext.tsx created; App.tsx wraps router with provider; list of consuming pages updated to use `useAuditContext()`; local `auditId` state removed from those pages |
| **§ GAP-024 Evidence** | `window.confirm()` / `confirm()` removed from AuditList.tsx and EvidenceCollection.tsx; confirmation banners implemented; ARIA labels present; matches CriteriaUpload.tsx pattern |
| **§ §4.3 Merge Gate Parity** | Foreman certifies all CI checks pass locally; result of local run (pass/fail per check) |
| **§ Session Memory** | Path to session memory file committed on this branch |

### 4.3 — IAA Token File Path

IAA will write its verdict to:
```
.agent-admin/assurance/iaa-token-session-<NNN>-wave16-2R-<YYYYMMDD>.md
```

The PREHANDOVER proof must pre-populate `iaa_audit_token` with the expected reference
in the format above (not `PENDING` — per A-029 §4.3b architecture).

---

## § 5 — Scope Blockers and Governance Conflicts Visible Now

### 5.1 — No Hard Blockers Identified

IAA has reviewed the wave-current-tasks.md in full and the confirmed file inventory.
No hard governance blockers are visible at pre-brief time.

### 5.2 — Risk Register (Watchpoints — Not Blockers)

| Risk ID | Description | Mitigation Required |
|---------|-------------|---------------------|
| **RISK-W162R-001** | **GAP-015 consumer completeness**: AuditContext.tsx will be created but if any consuming page is missed (still uses local auditId state), BD-006 (readers) and BD-009 (integration fit) will FAIL | Foreman must enumerate all pages consuming local `auditId` state before delegating to ui-builder; PREHANDOVER proof must list every updated page |
| **RISK-W162R-002** | **GAP-024 CriteriaUpload pattern compliance**: Acceptance criteria explicitly states the confirmation banner must match the `CriteriaUpload.tsx` pattern. If ui-builder invents a divergent pattern, IAA will fail BD-022 | Foreman must reference `CriteriaUpload.tsx` explicitly in the ui-builder delegation prompt |
| **RISK-W162R-003** | **GAP-014 audio src safety**: If the audio element src is passed from unvalidated user input, BD-018 (injection vectors) will FAIL | ui-builder must source audio URLs from Supabase storage paths or validated hook responses only |
| **RISK-W162R-004** | **RED gate sequence**: If ui-builder is delegated before T-W162R-QA-001 RED tests are committed and confirmed failing, Foreman halts per the wave's own HALT-005 rule. IAA will verify RED gate evidence at handover | Foreman must not delegate to ui-builder without confirmed RED test run |
| **RISK-W162R-005** | **TypeScript `any` leakage**: AuditContext is a new generic context file. If ui-builder uses `any` for the context type or the setter, BD-021 will FAIL | Foreman prompt must require strict TypeScript typing for AuditContext |

### 5.3 — A-013 (Agent Contract Immutability) Reminder

No `.github/agents/*.md` file is in scope. If either qa-builder or ui-builder touches any
agent contract file, IAA will issue REJECTION-PACKAGE at CORE-017 regardless of the rest
of the PR state. This is non-negotiable.

### 5.4 — Deferred Gap Provenance

These 4 gaps were explicitly deferred from wave16-full-batch (PR #1038, merged). The
acceptance criteria for each gap are authoritatively defined in:
- `docs/completeness-review/compliance-workflow-completeness-report-20260309.md`
- `modules/mat/03-implementation-plan/implementation-plan.md` v2.7.0

Architecture is confirmed frozen for this wave. Any deviation from the acceptance criteria
defined in those documents will be treated as a scope deviation, not an improvement, unless
documented with explicit CS2 authorisation in the PREHANDOVER proof.

---

## § 6 — Qualifying Task Summary

All 5 tasks qualify as AAWP_MAT. No task is EXEMPT.

| Task ID | Task Summary | IAA Trigger Category | Required Evidence Artifacts | Applicable Overlays |
|---------|-------------|----------------------|-----------------------------|---------------------|
| T-W162R-QA-001 | RED QA suite for GAP-009, 014, 015, 024 | AAWP_MAT | RED test run output (all failing); test file(s) committed on branch; min counts met (≥ 2/gap) | BD-011, BD-012, BD-013 |
| T-W162R-UI-001 | GAP-009: Wire CriteriaModal to backend hooks | AAWP_MAT | CriteriaModal.tsx diff; hook calls present; mock data absent; tests GREEN | BD-001, BD-002, BD-005, BD-010 |
| T-W162R-UI-002 | GAP-014: Audio playback in EvidenceCollection | AAWP_MAT | EvidenceCollection.tsx diff; `<audio>` element with controls; src from validated source; tests GREEN | BD-003, BD-017, BD-018, BD-019 |
| T-W162R-UI-003 | GAP-015: AuditContext global provider | AAWP_MAT | AuditContext.tsx (new file); App.tsx wrapping diff; list of consuming pages updated; tests GREEN | BD-005, BD-006, BD-009, BD-010 |
| T-W162R-UI-004 | GAP-024: Replace confirm() with state-based banners | AAWP_MAT | AuditList.tsx + EvidenceCollection.tsx diffs; no `window.confirm()` remaining; ARIA labels present; matches CriteriaUpload pattern; tests GREEN | BD-013, BD-018, BD-019, BD-022 |

---

## § 7 — Execution Sequence Confirmed

IAA confirms the wave execution sequence is governance-compliant:

```
1. ✅ IAA Pre-Brief (THIS DOCUMENT) → committed before any builder delegation
2. 🔴 T-W162R-QA-001 → qa-builder writes RED tests → Foreman confirms all failing
3. 🔴 T-W162R-UI-001 to 004 → ui-builder implements all 4 gaps (parallel/independent)
4. 🟡 QP Evaluation → Foreman: 100% GREEN, zero warnings, zero skipped
5. 🟡 §4.3 Merge Gate Parity → Foreman runs CI checks locally
6. 🟡 PREHANDOVER proof committed (per § 4 above)
7. 🟡 IAA Final Audit → full Phase 2–4 assurance invocation
8. 🟢 ASSURANCE-TOKEN → PR opened and submitted to CS2
9. 🟢 CS2 merge approval
```

**HALT-005 Gate**: ui-builder delegation MUST NOT occur before T-W162R-QA-001 RED state
is confirmed. IAA will verify the RED gate evidence at handover. If RED evidence is absent
or unconvincing, REJECTION-PACKAGE is mandatory at BD-011 / BD-012.

---

## § 8 — Summary

**Wave 16.2R is a pure AAWP_MAT wave. No secondary governance trigger categories apply.**

4 qualifying tasks. 5 builders (qa-builder × 1, ui-builder × 4). All require full IAA assurance
at handover via the PREHANDOVER + session memory ceremony.

Primary FFA focus areas:
1. **Wiring completeness** (BD-005, BD-006) — especially AuditContext consumer coverage (GAP-015)
2. **Accessibility compliance** (BD-019) — ARIA on confirmation banners (GAP-024) and audio controls (GAP-014)
3. **Injection safety** (BD-018) — audio src and confirmation banner content
4. **Test authenticity** (BD-013) — GAP-024 confirm() spy assertions must be genuine

Pre-Brief status: **COMPLETE**
IAA is now in STANDBY — awaiting final handover invocation with PREHANDOVER proof.

---

**Pre-Brief Reference**: IAA-PREBRIEF-wave16-2R-20260310
**Produced by**: independent-assurance-agent v6.2.0
**Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE
**Authority**: CS2 (@APGI-cmy)
**Next IAA action**: Full Phase 2–4 assurance at handover (ASSURANCE-TOKEN or REJECTION-PACKAGE)
