# IAA Wave Record — mmm-dab-harvest-implementation-20260521

**Wave ID**: mmm-dab-harvest-implementation-20260521
**Date**: 2026-05-21
**PR**: #1731
**Issue**: #1726 — Harvest legacy DomainAuditBuilder/MPS/Intent/Criteria generation components with behaviour parity
**Branch**: copilot/harvest-domain-audit-builder-again
**Producing Agent (expected)**: ui-builder (delegated by foreman-v2-agent)
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**CS2 Authorization**: Issue #1726 opened by CS2 / @APGI-cmy; issue #1722 (dependency) closed by CS2 on 2026-05-21

---

IAA_PREFLIGHT_BRIEF
PR: #1731
ISSUE: #1726
WAVE: mmm-dab-harvest-implementation-20260521
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: 504816e61cf53c482b193999a12ae8885c14f865

CURRENT_HEAD_CONTEXT:
- predecessor_wave: mmm-domainauditbuilder-legacy-harvest-red-recovery-20260521 (PR #1723, merged)
- dependency_issue: #1722 closed by CS2 on 2026-05-21
- current_implementation_state: 195 B4 tests passing; all AI lifecycle tests passing
- gap_identified: DomainAuditBuilder uses ol/li (list-based) not card-grid as legacy required

EXPECTED_QA_SCOPE:
- DomainAuditBuilder renders three CARD-based step items (div grid, not ol/li ordered list)
- data-testid="domain-audit-step-card" present on each step card for test targeting
- Test T-MMM-S6-AI-005 added: "three generation step cards render" proves card layout not list
- Test T-MMM-S6-AI-001 strengthened: generated MPS items show intent AND rationale (not just title)
- All 195 existing tests remain passing (no regression)
- The UI is recognisably card-based as per legacy DomainAuditBuilder.tsx grid layout
- Behaviour parity: generate/accept/edit/save lifecycle unchanged

EXPECTED_FAILURE_MODES:
- DomainAuditBuilder keeping ol/li structure and claiming card parity
- Tests only checking titles, not intent/rationale display on generated MPS items
- New tests added but not actually failing before the fix (RED tests added after implementation = not valid RED)
- Existing tests broken by structural change

FOREMAN_INSTRUCTIONS:
- Change DomainAuditBuilder steps container from ol to div; step wrapper from li to div; add data-testid="domain-audit-step-card"
- Add test suite T-MMM-S6-AI-005 for three generation step cards with data-testid assertion
- Strengthen T-MMM-S6-AI-001 to assert intent and rationale text visible in generated MPS items
- Run full B4 vitest suite; must show all tests passing (zero failures)
- Do NOT change MPSSelectionModal or other components beyond what is required

IAA_WILL_QA:
- DomainAuditBuilder structural change (ol→div; li→div; data-testid added)
- T-MMM-S6-AI-005 test validity: verifies DOM presence of data-testid="domain-audit-step-card" (3 items)
- T-MMM-S6-AI-001 strengthening: intent+rationale verified in generated items
- Full B4 vitest run: 0 failures, 0 skipped
- No regression against existing 195-test baseline

RESULT: PREFLIGHT_BRIEF_COMPLETE

---

## PRE-BRIEF

**Produced by**: independent-assurance-agent (Phase 0 — PRE-BRIEF mode)
**Date**: 2026-05-21
**Action**: PRE-BRIEF
**Status**: COMPLETE
**IAA Session**: PRE-BRIEF-mmm-dab-harvest-implementation-20260521

---

### Step 0.1 — Pre-Brief Mode Confirmed

Action `PRE-BRIEF` received. Phase 0 ONLY. Phases 1–4 assurance NOT executed. Pre-brief produced below. Final assurance invocation is deferred until Foreman re-invokes IAA after builder deliverable is committed.

---

### Step 0.2 — Wave Tasks Assessment

**Wave-current-tasks.md read**: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
**Wave**: mmm-dab-harvest-implementation-20260521
**PR**: #1731
**Issue**: #1726 — Harvest legacy DomainAuditBuilder/MPS/Intent/Criteria generation components with behaviour parity
**Branch**: copilot/harvest-domain-audit-builder-again
**Head SHA at pre-brief**: 133e2f9

**Trigger Table Applied** (iaa-trigger-table.md v2.6.0):

| Step | Check | Result |
|------|-------|--------|
| 1 | `.github/agents/` changes? | NO — AGENT_CONTRACT not triggered |
| 2 | `governance/canon/` or CANON_INVENTORY.json changes? | NO — CANON_GOVERNANCE not triggered |
| 3 | `.github/workflows/` changes? | NO — CI_WORKFLOW not triggered |
| 4 | AAWP/MAT deliverable label or path pattern? | AMBIGUOUS — modules/MMM/ is MMM MAT module path; AMBIGUITY RULE → treat as co-triggered |
| 5 | `governance/quality/agent-integrity/` changes? | NO |
| 6 | `.agent-workspace/*/knowledge/` changes? | NO |
| 7 | Governance liaison artifacts? | NO |
| 8 | Pre-build stage governance artifacts? | NO |
| 9 | Product-facing BUILD/T2 claim? | YES — apps/mmm/ UI component delivery → PRODUCT_BUILD_ASSURANCE triggered |
| 10 | Cross-app component governance? | NO |

**Primary Category**: PRODUCT_BUILD_ASSURANCE (MANDATORY)
**Co-trigger (Ambiguity Rule A-003)**: AAWP_MAT — modules/MMM/ test path maps to MAT deliverable scope; ambiguity resolves to mandatory
**Ceremony-admin status**: PENDING (not yet appointed — ACR-01–16 checks will NOT apply unless ECAP is appointed before final assurance invocation)

---

### Qualifying Tasks

```
Qualifying tasks:
  - Task 4: IAA pre-brief (current — Phase 0, generating this artifact)
  - Task 6: ui-builder delegation → DomainAuditBuilder card layout + parity tests (builder deliverable)
  - Task 7: Quality Professor review of builder deliverable
  - Task 8: ECAP / PREHANDOVER / IAA final assurance (will be full Phases 2–4 invocation)

Applicable overlay:
  PRIMARY: PRODUCT_BUILD_ASSURANCE — load PRODUCT_BUILD_ASSURANCE_STANDARD.md before verdict
  CO-TRIGGER: AAWP_MAT — MAT deliverable overlay checks apply

Anti-regression obligations:
  NO — FUNCTIONAL-BEHAVIOUR-REGISTRY NBR-001–005 checked:
    NBR-001 (TanStack Query cache invalidation): NO useMutation changes in scope → NOT TRIGGERED
    NBR-002 (Supabase RLS silent write): NO Supabase write operations in scope → NOT TRIGGERED
    NBR-003 (Zustand store reset): useDomainAuditBuilder has NO Zustand usage (no zustand imports found) → NOT TRIGGERED
    NBR-004 (Optimistic update rollback): NO optimistic mutations in scope → NOT TRIGGERED
    NBR-005 (Schema column mismatch): NO schema migrations in scope → NOT TRIGGERED
  Anti-regression obligation verdict: NO active NBR patterns apply to this wave's deliverable scope.
```

---

### EXPECTED_QA_SCOPE (IAA at final assurance will verify ALL of the following)

**Structural change — DomainAuditBuilder.tsx**:
1. Outer container changed: `<ol className="domain-audit-builder__steps">` → `<div className="domain-audit-builder__steps">` (or equivalent div-based container; ordered list semantics removed)
2. Step wrapper changed: `<li key={step.id} className="domain-audit-builder__step">` → `<div key={step.id} className="domain-audit-builder__step">` (or equivalent)
3. `data-testid="domain-audit-step-card"` added to each step card element (the inner `domain-audit-builder__step-card` div)
4. Inner `ol/li` for `previewItems` MAY remain — these are content lists, not step containers
5. No other components modified (MPSSelectionModal, IntentCreator, CriteriaManagement, hooks unchanged)
6. TypeScript compiles without errors

**New test T-MMM-S6-AI-005**:
7. New `describe('T-MMM-S6-AI-005: DomainAuditBuilder renders three card-based step items', ...)` suite present
8. Test queries `screen.getAllByTestId('domain-audit-step-card')` and asserts `length === 3`
9. Test uses DomainAuditBuilder component (not DomainWorkspacePage wrapper) to isolate the structural assertion
10. Test must be a valid RED-THEN-GREEN test: was written when `data-testid` was absent, passes after the fix

**Strengthened T-MMM-S6-AI-001**:
11. At least one `it(...)` within `T-MMM-S6-AI-001` that asserts generated MPS items display both intent AND rationale (not just title)
12. The assertion must query for a specific intent-text or rationale-text pattern in the generated item rendering
13. Test passes after the strengthening (intent + rationale now visible in generated MPS item cards)

**Regression baseline**:
14. Full vitest run (B4 framework suite): ALL 195 prior tests passing, zero failures, zero skipped
15. New tests contribute to passing total (195+ → ≥197 passing after additions)

---

### EXPECTED_FAILURE_MODES (IAA will hard-reject if any of these are detected)

```
FM-001: ol/li structure NOT changed — component still renders <ol>/<li> as step container.
        Claim: "card-grid equivalent" without structural change → REJECTION-PACKAGE.
        Fix: ol → div outer, li → div inner, data-testid added.

FM-002: data-testid="domain-audit-step-card" absent — T-MMM-S6-AI-005 cannot assert DOM presence.
        Fix: Add data-testid to the step card div.

FM-003: T-MMM-S6-AI-005 test written AFTER the structural fix, not before.
        Evidence of RED-THEN-GREEN required: the test must reference data-testid that was absent before the impl change.
        Fix: Builder must confirm test was written to fail before the fix, then pass after.

FM-004: T-MMM-S6-AI-001 strengthening only checks title, not intent + rationale.
        Fix: Assert on intent text AND rationale text in generated item rendering.

FM-005: Any of 195 existing tests fail after the structural change.
        Fix: Structural change must be backward-compatible — step-action buttons, step-summary, step-preview testids unchanged.

FM-006: No PREHANDOVER proof committed before IAA final invocation (FAIL-ONLY-ONCE A-015).
        Fix: ui-builder / Foreman must commit PREHANDOVER proof with iaa_audit_token pre-populated.

FM-007: SCOPE_DECLARATION.md absent, stale, or format non-compliant (FAIL-ONLY-ONCE A-026/A-028).
        Fix: List format, exactly matches git diff --name-only origin/main...HEAD.

FM-008: PRODUCT_BUILD_ASSURANCE_STANDARD gates not addressed in PREHANDOVER proof.
        Specifically: PROMISED_USER_JOURNEY, USER_CAN_COMPLETE_JOURNEY, visible state, and
        CODE_PASS / ADMIN_PASS / FUNCTIONAL_PASS split verdict fields required.
        Note: FUNCTIONAL_PASS/deployed preview may be scoped to CODE_PASS for this structural change
        if CS2 accepts test evidence as functional proof — but the fields MUST be present.
```

---

### FOREMAN_INSTRUCTIONS (pre-build stage gate)

**Mandatory before builder delegation (Task 6)**:
1. ✅ This pre-brief committed to wave record (current task completing)
2. ⏳ Update `IAA_PREFLIGHT_BRIEF_REVIEWED: yes` and `FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes` in wave-current-tasks.md (already present — confirm state)
3. ⏳ Delegate to ui-builder with explicit scope: DomainAuditBuilder.tsx structural change (ol→div, li→div, data-testid); T-MMM-S6-AI-005 new test suite; T-MMM-S6-AI-001 strengthening
4. ⏳ Builder must run full B4 vitest suite and provide pass evidence before handover
5. ⏳ Commit all deliverables BEFORE invoking IAA (FAIL-ONLY-ONCE A-021)
6. ⏳ SCOPE_DECLARATION.md must match `git diff --name-only origin/main...HEAD` exactly (A-026/A-028)
7. ⏳ PREHANDOVER proof must include: `iaa_audit_token: IAA-[session]-mmm-dab-harvest-impl-20260521-PASS` (pre-populated expected reference per A-029); `ADMIN_PASS`, `CODE_PASS`, `FUNCTIONAL_PASS`, `VERDICT` fields (PRODUCT_BUILD_ASSURANCE_STANDARD); Ripple/Cross-Agent Assessment section (A-023)
8. ⏳ ECAP: if ceremony_admin_appointed is updated before final IAA invocation, ACR-01–16 will apply — ensure ECAP reconciliation summary is included in bundle

**Minimal PREHANDOVER proof mandatory sections for final assurance**:
- `## Promised User Journey` — with PROMISED_USER_JOURNEY, ENTRY_POINT, FINAL_EXPECTED_STATE, USER_CAN_COMPLETE_JOURNEY
- `## Split Verdict` — ADMIN_PASS, CODE_PASS, FUNCTIONAL_PASS, VERDICT
- `## Architecture Ripple/Impact Assessment` — OVL-AM-004
- `## Wave Gap Register` — OVL-AM-005
- `## Environment Parity` — OVL-AM-006
- `iaa_audit_token: IAA-[session]-mmm-dab-harvest-impl-20260521-PASS` (pre-populated, read-only post-commit)
- Vitest run evidence: test count, pass count, 0 failures

---

### ECAP_REQUIRED

```
ceremony_admin_appointed: PENDING
ECAP status: NOT YET APPOINTED
ACR-01–16 checks: WILL NOT APPLY unless ceremony_admin_appointed is set before final assurance invocation.
If ECAP is appointed: ACR-01 (ECAP reconciliation summary in bundle) becomes auto-reject trigger.
Recommendation: Foreman should appoint ECAP only if wave has sufficient complexity to warrant it.
For this wave (narrow structural change + 2 tests), ECAP appointment is NOT required.
```

---

### CURRENT_HEAD_CI_EXPECTATIONS

```
Current state (HEAD 133e2f9):
  - 195 B4 tests passing (all AI lifecycle tests passing)
  - DomainAuditBuilder.tsx: ol/li structure (GAP IDENTIFIED — this is what the wave fixes)
  - T-MMM-S6-AI-005: ABSENT (does not yet exist)
  - T-MMM-S6-AI-001 strengthening: ABSENT

After builder deliverable:
  - B4 vitest suite: ≥197 passing (195 existing + T-MMM-S6-AI-005 suite + T-MMM-S6-AI-001 assertion)
  - 0 failures, 0 skipped
  - TypeScript: no compile errors
  - DomainAuditBuilder.tsx: div-based step container with data-testid="domain-audit-step-card"
```

---

### POLC_AND_BUILDER_DELEGATION_EXPECTATIONS

```
Delegation path: foreman-v2-agent → ui-builder (builder-class, correct for UI component work)
POLC compliance: YES — ui-builder is the appropriate class for apps/mmm/ component changes
Builder must NOT: modify .github/agents/, governance/canon/, .github/workflows/
Builder must NOT: touch MPSSelectionModal, IntentCreator, CriteriaManagement beyond what is required
Builder must NOT: change useDomainAuditBuilder hook behaviour
Foreman role at handover: substantive review of builder deliverable before IAA invocation
IAA role: independent assurance only — no code review substitution, binary verdict only
```

---

### IAA_WILL_QA (at final assurance — Phases 2–4)

At final IAA invocation IAA will verify:

1. **Structural change evidence**: Read DomainAuditBuilder.tsx — confirm `ol` → `div`, `li` → `div`, `data-testid="domain-audit-step-card"` present on step cards
2. **T-MMM-S6-AI-005 validity**: Confirm new `describe('T-MMM-S6-AI-005...')` suite exists; reads `getAllByTestId('domain-audit-step-card')` asserting count === 3
3. **T-MMM-S6-AI-001 strengthening**: Confirm at minimum one new assertion for intent text AND rationale text in generated MPS items
4. **Test baseline**: Vitest evidence showing ≥197 passing, 0 failing, 0 skipped
5. **No unintended changes**: diff confined to `DomainAuditBuilder.tsx`, `domain-workflow-behavior.test.tsx`, and governance artifacts
6. **PREHANDOVER proof**: all required sections, iaa_audit_token pre-populated correctly
7. **SCOPE_DECLARATION**: list format, matches diff
8. **FAIL-ONLY-ONCE rules**: A-001, A-015, A-021, A-026, A-028, A-029 active
9. **PRODUCT_BUILD_ASSURANCE_STANDARD gates**: split verdict fields present; promised user journey documented
10. **NBR-001–005**: confirmed not triggered (no Supabase writes, no mutations, no Zustand, no schema migrations)

---

### RESULT

```
RESULT: PREFLIGHT_BRIEF_COMPLETE
Qualifying tasks: 4 (pre-brief current; ui-builder delegation; QP review; ECAP/PREHANDOVER/final assurance)
Applicable overlay: PRODUCT_BUILD_ASSURANCE (primary) + AAWP_MAT (co-trigger via ambiguity rule)
Anti-regression obligations: NO — NBR-001–005 not triggered by this wave's scope
ECAP: NOT APPOINTED — ACR-01–16 checks deferred unless appointment made before final IAA invocation
Pre-brief artifact committed to: .agent-admin/assurance/iaa-wave-record-mmm-dab-harvest-implementation-20260521.md ## PRE-BRIEF
```

---

## PRE-BRIEF (IAA Response)

**Produced by**: independent-assurance-agent (Phase 0)
**Date**: 2026-05-21
**Status**: COMPLETE

Qualifying tasks: 4
Applicable overlay: PRODUCT_BUILD_ASSURANCE (primary) + AAWP_MAT (co-trigger)
Anti-regression obligations: NO — NBR-001–005 not triggered
ECAP: NOT APPOINTED — ACR-01–16 deferred

Structural change confirmed required:
- `ol` → `div`, `li` → `div`
- `data-testid="domain-audit-step-card"` on each of 3 step cards
- T-MMM-S6-AI-005 new test: `getAllByTestId('domain-audit-step-card')` → 3 elements
- T-MMM-S6-AI-001 strengthened: assert intent + rationale text visible
- ≥197 pass, 0 fail, 0 skip

RESULT: PREFLIGHT_BRIEF_COMPLETE

## TOKEN

PHASE_B_BLOCKING_TOKEN: IAA-session-1280-mmm-dab-harvest-implementation-20260521-2026-05-21-PASS
**PR**: #1731
**Issue**: #1726
**Reviewed SHA**: 504816e61cf53c482b193999a12ae8885c14f865
Session: session-1280-mmm-dab-harvest-re-invocation-20260521
Date: 2026-05-21
Checks: 16 total — 16 PASS, 0 FAIL
Verdict: ASSURANCE-TOKEN (PASS) — FULL_FUNCTIONAL_DELIVERY
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE
Merge authority: CS2 ONLY
PREFLIGHT_BRIEF_REVIEWED: yes
PREFLIGHT_BRIEF_PATH: .agent-admin/assurance/iaa-wave-record-mmm-dab-harvest-implementation-20260521.md
PREFLIGHT_EXPECTATIONS_MET: yes
UNMET_PREFLIGHT_EXPECTATIONS: none
FINAL_IAA_RESULT: PASS
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY
CURRENT_HEAD_SHA: 504816e61cf53c482b193999a12ae8885c14f865

IAA_IDENTITY_BINDING_VERDICT
ACTUAL_PR: #1731
ACTIVE_PREFLIGHT_PR: #1731
ADMIN_MANIFEST_PR: #1731
SCOPE_DECLARATION_PR: #1731
BRANCH: copilot/harvest-domain-audit-builder-again
HEAD_SHA: 504816e61cf53c482b193999a12ae8885c14f865
ALL_MATCH: yes

## REJECTION_HISTORY

### REJECTION-001 — 2026-05-21

**Session**: session-1279-mmm-dab-harvest-20260521
**Reviewed SHA**: c351fcdd5d5fd626d90fa2ba1b7e30ff3172173d
**Total checks**: 14 substance/ceremony checks: 13 PASS, 1 FAIL
**Substantive deliverables**: CLEAN — all 7 ACs met, 200 tests pass, structural change verified

**Finding F-001 (SYSTEMIC — Ceremony)**:
- Scope declaration at `.agent-admin/scope-declarations/pr-1731.md` does NOT conform to SCOPE_DECLARATION_SCHEMA v2.0.0
- CI simulation (validate-scope-to-diff.sh): "empty or malformed — 0 files declared vs 10 in git diff"
- Missing schema markers: SCOPE_SCHEMA_VERSION: v2, PR_NUMBER:, RESPONSIBILITY_DOMAIN:, IN_SCOPE:, OUT_OF_SCOPE:, EXPECTED_VERIFICATION:, SCOPE_FROZEN: YES, FILES_CHANGED: N
- File declaration format wrong: plain paths used; script requires `- \`backtick\`` format
- 4 undeclared ceremony files: ECAP PREHANDOVER bundle, foreman/memory PREHANDOVER copy, foreman/memory session memory, foreman parking station (suggestions-log.md)
- A-031 carve-out NOT applicable (not IAA artifacts)
- Pattern: SYSTEMIC — matches session-217 recurring pattern; promoted to FAIL-ONLY-ONCE A-044

**Fix required**:
Rewrite `.agent-admin/scope-declarations/pr-1731.md` to full SCOPE_DECLARATION_SCHEMA v2.0.0 format:
- Add all required markers (SCOPE_SCHEMA_VERSION: v2, PR_NUMBER: 1731, RESPONSIBILITY_DOMAIN:, IN_SCOPE:, OUT_OF_SCOPE:, EXPECTED_VERIFICATION:, SCOPE_FROZEN: YES)
- Set `FILES_CHANGED: 10` with all 10 files in `` - `path` `` format
- Include all 4 previously undeclared ceremony files

**FFA-05 Carry-Forward Mandate**:
Pre-existing CSS gap: `domain-audit-builder__*` BEM classes have no CSS rules anywhere in `apps/mmm/src/index.css`. Originated in prior wave (PR #1711), NOT introduced by this wave. Next wave must add CSS rules for domain-audit-builder components OR file a tracked issue.

**Re-invocation**: Required after F-001 fix. TOKEN section remains PENDING.
