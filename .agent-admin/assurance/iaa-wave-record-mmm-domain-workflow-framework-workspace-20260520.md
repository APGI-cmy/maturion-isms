# IAA Wave Record — MMM Domain Workflow Framework Workspace

**Wave ID**: mmm-domain-workflow-framework-workspace
**Date**: 2026-05-20
**Branch**: copilot/wire-existing-mmm-domain-workflow
**PR**: PENDING
**Issue**: PENDING — Wire existing MMM domain workflow into framework workspace
**Authority**: CS2 (@APGI-cmy)
**Mode**: PRE-BRIEF
**ceremony_admin_appointed**: PENDING
**Phase 0 Build Freeze Status**: LIFTED — PR #1688 merged 2026-05-19T15:08:45Z (alignment artifacts confirmed; follow-up implementation now authorized)

---

## PRE-BRIEF

**Generated**: 2026-05-20
**IAA Session**: IAA-pre-brief-mmm-domain-workflow-framework-workspace-20260520

---

### Step 0.2 Output (Canonical)

```
Qualifying tasks:
  1. Wire DomainWorkspacePage (/assessment/framework/domain/:domainId) with existing
     MMM domain workflow data — actionable MPS list, intent statements, and criteria steps
     from mmm_maturity_process_steps + mmm_criteria tables.
  2. Preserve the five-domain page (AssessmentFrameworkHandoffPage) — five canonical domain cards
     must remain intact and tests T-MMM-S6-183 through T-MMM-S6-188 must stay GREEN.
  3. Restore contextually-aware back navigation: DomainWorkspacePage → framework workspace
     at /assessment/framework?framework_id=:id (not /frameworks generic fallback).
  4. Add tests for the wired domain workflow (unit + integration, RED→GREEN).
  5. Add functional evidence (per wave-execution-standard.md v1.2.0 requirements).
  6. Update modules/MMM/BUILD_PROGRESS_TRACKER.md with the manual finding and wave record.
  7. Verify Stage 2, Stage 5, and Stage 6 artifacts authorize the runtime changes before
     implementation proceeds.

Applicable overlay:
  PRIMARY: PRODUCT_BUILD_ASSURANCE
    — This is a product-facing BUILD/T2 wave claiming functional delivery of the
      domain workflow UI. PRODUCT_BUILD_ASSURANCE_STANDARD.md MUST be loaded and applied.
  SECONDARY: PRE_BUILD_STAGE_MODEL
    — BUILD_PROGRESS_TRACKER.md (modules/MMM/) will be modified; PRE_BUILD_GATES overlay
      (OVL-PBG-001 through OVL-PBG-019) applies at handover for the tracker update.
  ALSO APPLICABLE: GOVERNANCE_EVIDENCE
    — OVL-GE-001 through OVL-GE-004 apply; all evidence must be runtime-fidelity-appropriate.

Anti-regression obligations: YES
  — NBR-001 (FUNCTIONAL-BEHAVIOUR-REGISTRY.md): Any useMutation call must invalidate
    affected TanStack query cache via onSuccess/onSettled → queryClient.invalidateQueries.
    Applies if this wave introduces any write operations (mutation unlikely for read-only
    wiring, but must be checked against the actual diff).
  — NBR-003 (FUNCTIONAL-BEHAVIOUR-REGISTRY.md): Zustand store slices used in the domain
    workspace flow must have explicit reset/cleanup on route exit or resource change.
    Stage 5 Architecture §A3.4 (Zustand state management) governs store design.
  — T-MMM-S6-183 through T-MMM-S6-188 (build-to-green-5domain-workspace-20260519):
    Five-domain canonical workspace anti-regression — AssessmentFrameworkHandoffPage must
    continue to render exactly five domain cards. These tests must remain GREEN throughout.
  — T-MMM-S6-051 (qa-to-red-catalog.md): Criterion Drill-Down Navigable From
    Domain→MPS→Criterion — this Stage 6 test directly covers the journey this wave
    implements. Must be addressed (or explicitly noted if this wave only goes to MPS level
    with criteria as a declared next step).
```

---

### IAA_PREFLIGHT_BRIEF

**PR**: PENDING
**Issue**: PENDING — Wire existing MMM domain workflow into framework workspace
**Wave**: mmm-domain-workflow-framework-workspace
**Branch**: copilot/wire-existing-mmm-domain-workflow
**WAVE_TASKS_PATH**: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
**CURRENT_HEAD_SHA**: ef5b29c246ccf4646eb33870e5fcd5ba3079a9f4 (branch head — "Initial plan" commit only)
**PHASE_0_FREEZE_STATUS**: LIFTED (PR #1688 merged 2026-05-19)

---

#### EXPECTED_QA_SCOPE

Files IAA will audit at handover:

**Product code (primary)**
- `apps/mmm/src/pages/DomainWorkspacePage.tsx` — wiring from placeholder to live MPS + intent + criteria data
- `apps/mmm/src/pages/AssessmentFrameworkHandoffPage.tsx` — five-domain preservation anti-regression
- `apps/mmm/src/lib/useFrameworkHandoffContext.ts` (or new hook if introduced) — data fetching contract
- Any new hooks, components, or query files introduced for the domain workflow
- Route configuration (if modified) — confirm /assessment/framework/domain/:domainId is registered

**Tests (mandatory)**
- New test file(s) covering DomainWorkspacePage wired behavior
- Existing tests T-MMM-S6-183 through T-MMM-S6-188 must remain GREEN
- T-MMM-S6-051 coverage or explicit gap note required

**Governance (mandatory)**
- `modules/MMM/BUILD_PROGRESS_TRACKER.md` — manual finding recorded, wave column updated, Phase 0 freeze lift documented, tracker Last Updated refreshed
- `.admin/prs/pr-<N>.json` — PR metadata with evidence_required field
- `.agent-admin/scope-declarations/pr-<N>.md` — per-PR scope declaration (FILES_CHANGED must match actual diff)
- This wave record: `.agent-admin/assurance/iaa-wave-record-mmm-domain-workflow-framework-workspace-20260520.md`
- PREHANDOVER proof (at handover): PREHANDOVER_PROOF_MMM_DOMAIN_WORKFLOW_FRAMEWORK_WORKSPACE.md (or canonical naming)
- Session memory (at handover): `.agent-workspace/<builder>/memory/session-<NNN>-20260520.md`

**Wave execution standard evidence (mandatory per wave-execution-standard.md v1.2.0)**
- Five canonical domain cards visible (screenshot or test evidence)
- Domain-card click-through evidence showing domain workspace renders with MPS/intent/criteria
- Contextual navigation evidence: back link returns to /assessment/framework?framework_id=:id
- Missing/invalid framework_id regression evidence remains intact

---

#### EXPECTED_FAILURE_MODES

IAA has identified the following risk patterns that prior MMM waves have tripped on. Builders must address each explicitly:

1. **Placeholder wiring not replaced**: DomainWorkspacePage currently shows static "Compile MPSs / Compile intent statements / Compile criteria" labels. Risk: builder wires only partial data (e.g., shows MPS names but not intent statements or criteria) and claims functional delivery. IAA will reject a partial wiring that omits any of the three declared layers (MPS, intent statements, criteria steps).

2. **Back navigation regression**: `backPath` in DomainWorkspacePage currently computes correctly from `frameworkId` search param. Risk: modification to the page disrupts the back link logic, causing regression to `/frameworks` fallback instead of `/assessment/framework?framework_id=:id`. This is an explicit preservation requirement.

3. **Five-domain page broken by scope creep**: AssessmentFrameworkHandoffPage is working correctly (5 domain cards, T-MMM-S6-183 through T-MMM-S6-188 GREEN). Risk: builder modifies this page unnecessarily, breaking tests or canonical domain rendering. Scope boundary: modifications to AssessmentFrameworkHandoffPage are NOT required for this wave and must be minimized.

4. **schema_contract gap**: mmm_maturity_process_steps includes `intent_statement` column (per Stage 5 architecture §A5 schema table). Risk: builder queries mmm_maturity_process_steps without selecting `intent_statement`, resulting in null renders. IAA will verify the SELECT statement covers name, code, intent_statement, and sort_order at minimum.

5. **Missing or inadequate tests**: Wave-execution-standard.md v1.2.0 mandates specific evidence types. Risk: builder adds only smoke tests or renders-without-crashing assertions, not behavioral tests that verify MPS + intent + criteria data is rendered. IAA will reject if tests do not verify actual data presence in the rendered component.

6. **BUILD_PROGRESS_TRACKER.md not updated**: The manual finding (domain workflow wiring is now the active build-to-green item) must be recorded in the tracker. Risk: builder omits the tracker update entirely or records it in a stale/vague way. IAA requires: wave column added to Updated By header, Last Updated timestamp refreshed, manual finding entry with DATE and evidence references.

7. **TanStack query cache invalidation missed (NBR-001)**: If any useMutation is introduced (e.g., for marking a criterion as reviewed, or recording progress), the mutation must invalidate relevant queries. Risk: builder adds mutation without onSuccess/onSettled cache invalidation. IAA blocks on missing invalidation.

8. **Phase 0 freeze not documented as lifted**: The tracker §574 Phase 0 Temporary Build Freeze entry is still in place. Risk: reviewer challenges the legitimacy of this build wave. IAA requires the tracker update to explicitly note the freeze lift condition (PR #1688 merged 2026-05-19) and confirm this wave is proceeding under the lifted-freeze authority.

9. **Stage 2/5/6 authorization not verified**: Foreman objective explicitly requires Stage 2, Stage 5, and Stage 6 artifacts to be verified as authorizing runtime changes. Risk: builder proceeds without confirming authorization, creating a governance gap. IAA confirms:
   - Stage 2 (UX Workflow & Wiring Spec v0.4.0): J-10 (Criterion drill-down & evidence), domain selection showing 5 canonical domains — AUTHORIZED
   - Stage 5 (Architecture A3.3a): `/assessment/framework/domain/:domainId` domain workspace click-through explicitly declared; mmm_maturity_process_steps (with intent_statement) and mmm_criteria schema documented — AUTHORIZED
   - Stage 6 (QA-to-Red): T-MMM-S6-051 Criterion Drill-Down Navigable From Domain→MPS→Criterion — AUTHORIZED (test exists; must be addressed or noted)
   Authorization chain is CONFIRMED for this wave. Builder does NOT need to re-verify; but IAA will cross-check at handover.

10. **PRODUCT_BUILD_ASSURANCE_STANDARD.md evidence pack incomplete**: Prior waves (A-043) have failed by delivering patch-level correctness without full workflow correctness. Risk: builder delivers DomainWorkspacePage with MPS list rendered but does not prove the actionable path (click through MPS → see intent statement and criteria steps). IAA will require the full promised user journey to be evidenced, not just component rendering.

---

#### FOREMAN_INSTRUCTIONS

1. **Confirm Phase 0 freeze lifted**: Record in wave-current-tasks.md that the Phase 0 Temporary Build Freeze (§574) is lifted upon PR #1688 merge (confirmed: merged 2026-05-19T15:08:45Z). This wave is the first authorized implementation wave post-freeze-lift.

2. **Builder assignment**: ui-builder is the appointed builder for B3-B6 UI scope (per Stage 11 builder-contract.md). This wave's scope (DomainWorkspacePage wiring, frontend-only) falls within ui-builder's appointment. Foreman must explicitly confirm ui-builder delegation in the issue and wave-current-tasks.md. No new builder appointment ceremony required; existing appointment covers this scope.

3. **Scope boundary enforcement**: This wave is FRONTEND UI WIRING ONLY:
   - `apps/mmm/src/pages/DomainWorkspacePage.tsx` (primary change)
   - New data hooks/queries if needed
   - Tests
   - `modules/MMM/BUILD_PROGRESS_TRACKER.md` (tracker update)
   NO schema migrations, NO new Edge Functions, NO API route changes are authorized in this wave. Any backend changes trigger a separate wave with api-builder delegation.

4. **Backend data source**: The existing Supabase client pattern (`supabase.from('mmm_maturity_process_steps').select(...)`) is the authorized data source for this wave. The mmm_maturity_process_steps table (with intent_statement column) and mmm_criteria table are the canonical sources per Stage 5 Architecture §A5. Edge Function delegation is NOT required for this read-only wiring.

5. **Test framework**: Follow the established vitest/RTL pattern used in B3-B6. New tests must be in the appropriate vitest config (check existing vitest.mmm-b*.config.ts pattern). IAA will verify test files match the wave scope.

6. **Tracker update mandatory**: Foreman must ensure BUILD_PROGRESS_TRACKER.md is updated in this wave. The tracker header "Last Updated" must reflect 2026-05-20. The wave must be recorded in the Updated By header. A new section or finding entry must document: domain workflow wiring status, manual finding (domain card click-through now renders MPS + intent + criteria), and Phase 0 freeze lift confirmation.

7. **PREHANDOVER ceremony**: Builder (ui-builder) is responsible for producing the PREHANDOVER proof at wave closure per AGENT_HANDOVER_AUTOMATION.md. Foreman invokes IAA for handover assurance after PREHANDOVER is committed. ceremony_admin_appointed status must be confirmed before handover.

8. **Stage 6 T-MMM-S6-051 gap note required**: T-MMM-S6-051 specifies full Domain→MPS→Criterion navigation with breadcrumbs. This wave delivers Domain→MPS→Criteria as a displayed list, not a full drill-down navigation hierarchy. Builder must explicitly note in the PREHANDOVER proof whether T-MMM-S6-051 is: (a) satisfied by this wave, (b) partially satisfied with next-wave declaration, or (c) deferred. IAA will not accept silence on this point.

9. **wave-current-tasks.md**: Create a new wave-current-tasks entry for this wave at `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` OR update the file to reflect this wave as the active wave (replacing or alongside admin-control-router). Record `iaa_prebrief_path`, `IAA_PREFLIGHT_BRIEF_PATH`, and `IAA_PREFLIGHT_BRIEF_SHA_OR_TIMESTAMP` pointing to this wave record.

10. **Alignment PR #1688 confirmed merged**: Foreman may proceed. The build-to-green block declared in the record-red-align-mmm-artifacts wave is now lifted. The authorization chain for this wave is CLEAN.

---

#### ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS

**ECAP at wave closure: YES — mandatory**

This is a product-delivery build wave. The builder (ui-builder) must produce the following ceremony bundle at wave closure before Foreman invokes IAA for handover:

| Artifact | Required | Authority |
|---|---|---|
| PREHANDOVER proof (`PREHANDOVER_PROOF_MMM_DOMAIN_WORKFLOW_FRAMEWORK_WORKSPACE.md` or canonical name) | MANDATORY | AGENT_HANDOVER_AUTOMATION.md §4.2 |
| Session memory (`.agent-workspace/<builder>/memory/session-<NNN>-<date>.md`) | MANDATORY | AGENT_HANDOVER_AUTOMATION.md §4.3 |
| Functional evidence pack (per wave-execution-standard.md v1.2.0) | MANDATORY | modules/MMM/11-build/wave-execution-standard.md |
| Scope declaration (`.agent-admin/scope-declarations/pr-<N>.md`) | MANDATORY | per-PR scope model |
| PR metadata (`.admin/prs/pr-<N>.json` with evidence_required field) | MANDATORY | governance protocol |
| BUILD_PROGRESS_TRACKER.md update | MANDATORY | IAA pre-brief instruction #6 |

**ceremony_admin_appointed**: PENDING — Foreman must declare before wave closure.

**ECAP_NOT_REQUIRED_AT_PRE_BRIEF**: No ECAP ceremony artifacts are required before implementation begins. The pre-brief is the only ceremony artifact required at this stage.

---

#### CURRENT_HEAD_CI_EXPECTATIONS

**Current branch head**: `copilot/wire-existing-mmm-domain-workflow` @ ef5b29c ("Initial plan" — no implementation yet)

**Base (main)**: PR #1688 merged 2026-05-19T15:08:45Z — main is in known-good state post-alignment.

**Expected CI behaviour**:

| Check | Expected state at wave start | Expected state at wave close |
|---|---|---|
| All existing tests (982/982) | GREEN | GREEN (no regression permitted) |
| T-MMM-S6-183 through T-MMM-S6-188 (5-domain workspace) | GREEN on main | GREEN (anti-regression mandatory) |
| New domain workflow wiring tests | NOT YET PRESENT | RED → GREEN (RED-first required) |
| TypeScript compilation | PASS | PASS |
| Lint | PASS | PASS |
| preflight-evidence-gate | Passes on main | Must pass on PR branch |
| handover-claim-gate | N/A at wave start | Must pass at handover invocation |

**IAA will verify CI state at handover invocation.** A drift in CI state from main (additional failures beyond the declared scope) will trigger REJECTION-PACKAGE.

**Phase 0 build freeze**: LIFTED as of PR #1688 merge. No CI freeze gate applies to this wave.

---

#### POLC_AND_BUILDER_DELEGATION_EXPECTATIONS

**POLC compliance**:
- Foreman (foreman-v2-agent) must orchestrate and invoke; no builder self-starts
- Builder must not invoke IAA directly — IAA invocation is Foreman's authority
- IAA does not direct implementation — IAA receives the PREHANDOVER bundle and issues verdict
- ceremony_admin_appointed agent (if appointed) handles bundle assembly only — does NOT write IAA tokens

**Builder delegation (existing appointment applies)**:
- **ui-builder**: Appointed in Stage 11 builder-contract.md for B3-B6 UI scope. This wave (DomainWorkspacePage wiring) is within ui-builder's appointment. No re-appointment required.
- **api-builder**: NOT REQUIRED for this wave (frontend-only, no Edge Function changes).
- **qa-builder**: NOT REQUIRED unless Foreman delegates RED-to-GREEN gate supervision. If Foreman chooses to add qa-builder for test gate sign-off, declare in wave-current-tasks.md.
- **schema-builder**: NOT REQUIRED (no schema migrations authorized in this wave).
- **integration-builder**: NOT REQUIRED (no cross-app integration changes in this wave).

**Three-role split compliance**:
- Foreman: readiness judgment, IAA invocation, merge-gate release authority
- Builder (ui-builder): implementation, test authoring, PREHANDOVER bundle production
- IAA: independent assurance gate — binary verdict at handover only

**Authorization chain**:
- Stage 2 UX Workflow & Wiring Spec (J-10, domain selection: five canonical domains) — CONFIRMED
- Stage 5 Architecture (A3.3a domain workspace click-through; mmm_maturity_process_steps.intent_statement; mmm_criteria schema) — CONFIRMED
- Stage 6 QA-to-Red (T-MMM-S6-051 criterion drill-down; D3 Assessment Execution domain T-MMM-S6-051–080) — CONFIRMED
- PR #1688 (alignment merge — build-to-green authorized post-merge) — MERGED 2026-05-19 — CONFIRMED
- Phase 0 freeze: LIFTED — CONFIRMED

---

#### IAA_WILL_QA

At handover invocation, IAA will independently verify all of the following:

**PRODUCT_BUILD_ASSURANCE_STANDARD.md checks (A-043)**
1. Promised user journey end-to-end: user clicks a domain card on AssessmentFrameworkHandoffPage → DomainWorkspacePage renders at /assessment/framework/domain/:domainId → page shows actionable MPS list with intent statements and criteria steps (not static placeholder text). Evidence must prove this journey, not just that the page loads.
2. CTA capability map: Are the rendered MPS/criteria items actionable (links, buttons, or declared as a next-wave scope with explicit gap note)? Placeholder text "Declared next operational layer" must be REPLACED with real data or a functional CTA.
3. Schema contract: SELECT statement on mmm_maturity_process_steps must cover `name`, `code`, `intent_statement`, `sort_order`; SELECT on mmm_criteria must cover `name`, `code`, `sort_order`, `mps_id` (or equivalent join). IAA will check the actual query against the Stage 5 schema table.
4. Async/pending state visibility: Loading state and error state for the data fetch must be present. If data is loading or fetch fails, user must see a loading indicator or error message — not blank content.
5. T-MMM-S6-051 gap note: Builder must declare whether this wave satisfies, partially satisfies, or defers T-MMM-S6-051.

**Anti-regression checks**
6. Five-domain page: AssessmentFrameworkHandoffPage renders exactly five canonical domain cards. T-MMM-S6-183 through T-MMM-S6-188 are GREEN in CI.
7. Back navigation: DomainWorkspacePage back link navigates to /assessment/framework?framework_id=:id (context-preserving), not to /frameworks.

**FAIL-ONLY-ONCE patterns**
8. NBR-001 (TanStack): If any useMutation is present in the diff, verify onSuccess/onSettled calls queryClient.invalidateQueries for all affected query keys.
9. NBR-003 (Zustand): If any Zustand store slice is introduced or modified for the domain workspace, verify explicit reset action or useEffect cleanup on route exit.
10. NBR-002 (Supabase RLS): If any Supabase write operation is present (unlikely for read-only wiring), verify RLS write policy covers all expected roles.

**Governance and ceremony**
11. BUILD_PROGRESS_TRACKER.md: Updated By header includes this wave, Last Updated is 2026-05-20, Phase 0 freeze lift documented, manual finding recorded with evidence references.
12. PREHANDOVER proof: present, non-stale, files_changed count matches actual diff (A-041 diff-first classification).
13. Scope declaration: parity with actual diff (ACR-04 / A-041).
14. Stage 2/5/6 authorization traceability: each of the three stages explicitly cited as authorization source in PREHANDOVER proof.
15. Per-PR scope declaration present and aligned.

**CORE-020 / CORE-021 invariants**
16. CORE-020: Zero partial pass — all evidence must be verifiable; absence of evidence = failing check.
17. CORE-021: Zero severity tolerance — any finding regardless of perceived severity triggers REJECTION-PACKAGE.

---

#### RESULT: PREFLIGHT_BRIEF_COMPLETE

Pre-brief generated. Qualifying task count: **7**. Applicable overlay: PRODUCT_BUILD_ASSURANCE (primary) + PRE_BUILD_STAGE_MODEL (secondary) + GOVERNANCE_EVIDENCE. Anti-regression: YES (NBR-001, NBR-003, T-MMM-S6-183–188, T-MMM-S6-051 gap note). Phase 0 freeze: LIFTED (PR #1688 merged 2026-05-19). Build wave is authorized to proceed.

---

## TOKEN

*To be populated by IAA at Phase 4 verdict — handover assurance session.*

---

## REJECTION_HISTORY

*No rejections recorded — wave has not yet reached handover.*
