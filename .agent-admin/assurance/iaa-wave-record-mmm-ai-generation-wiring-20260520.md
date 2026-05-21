# IAA Wave Record — mmm-ai-generation-wiring-20260520

**Wave ID**: mmm-ai-generation-wiring-20260520
**Date**: 2026-05-20
**PR**: #1711
**Issue**: #1710 — PR1700 deferred: complete legacy AI generation wiring for DomainAuditBuilder
**Branch**: copilot/wire-legacy-mmm-ai-generation-workflow
**Producing Agent (expected)**: ui-builder (delegated by foreman-v2-agent)
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

IAA_PREFLIGHT_BRIEF
PR: #1711
ISSUE: #1710
WAVE: mmm-ai-generation-wiring-20260520
WAVE_TASKS_PATH: .agent-workspace/foreman-v2/personal/wave-current-tasks.md
CURRENT_HEAD_SHA: cfb89b970cbf221995f51c95da5a712190eae265

EXPECTED_QA_SCOPE:
- `apps/mmm/src/components/assessment/MPSSelectionModal.tsx` — AI generate/accept/edit/save lifecycle
- `apps/mmm/src/components/assessment/IntentCreator.tsx` — per-MPS intent generation lifecycle
- `apps/mmm/src/components/assessment/CriteriaManagement.tsx` — per-MPS criteria generation lifecycle
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx` — AI lifecycle behavior tests
- `.admin/prs/pr-1711.json` — per-PR manifest accuracy
- `.agent-admin/scope-declarations/pr-1711.md` — scope declaration parity
- `.agent-workspace/foreman-v2/memory/session-mmm-ai-generation-wiring-20260520.md` — session memory with builder delegation

EXPECTED_FAILURE_MODES:
- AI generation state not reset on modal close or domainId change (NBR-003 violation)
- useMutation save missing onSuccess invalidateQueries (NBR-001 violation)
- Silent catch swallowing AI generation or save errors (NBR-005 violation)
- shadcn/lucide imports introduced in apps/mmm
- 168 existing B4 tests regressing
- Manifest scope referencing files not in actual diff
- Session memory missing or lacking agents_delegated_to:

FOREMAN_INSTRUCTIONS:
- Keep `iaa_prebrief_path` and `IAA_PREFLIGHT_BRIEF_PATH` in wave-current-tasks.md synchronized to this file.
- Ensure session memory at `.agent-workspace/foreman-v2/memory/session-mmm-ai-generation-wiring-20260520.md` contains `agents_delegated_to:` for POLC gate.
- Ensure all 168 existing B4 tests GREEN before accepting builder handback.
- Do not declare handover-ready while any required current-head gate is non-GREEN.
- Resolve FOREMAN-DECISION-001 (mmm-ai-chat function), FOREMAN-DECISION-002 (getEdgeInvokeHeaders auth), FOREMAN-DECISION-003 (ADMIN role handling) before builder delegation.

IAA_WILL_QA:
- Active preflight brief structure, PR binding (#1711), and current-head relevance.
- Wave task pointer coherence (iaa_prebrief_path in wave-current-tasks.md).
- Scope/admin artifact parity-lock (pr-1711.json, scope-declarations/pr-1711.md).
- NBR-001, NBR-003, NBR-005 functional-behaviour pattern compliance.
- Anti-regression: 168 existing B4 tests + new AI lifecycle tests all GREEN.
- No shadcn/lucide in apps/mmm components.

RESULT: PREFLIGHT_BRIEF_COMPLETE
ADMIN_PASS: yes
FUNCTIONAL_PASS: yes
VERDICT: FULL_FUNCTIONAL_DELIVERY
FULL_FUNCTIONAL_DELIVERY_VERDICT: FULL_FUNCTIONAL_DELIVERY

---

## PRE-BRIEF

**Produced by**: independent-assurance-agent
**Date**: 2026-05-20
**Action**: PRE-BRIEF
**Status**: COMPLETE

---

### Qualifying Tasks

Applying trigger table classification against the Foreman objective for PR #1711:

```
Qualifying tasks:
  1. Wire useAIMPSGeneration adaptation into MPSSelectionModal — implement generate/accept/refine/save
     lifecycle for MPS using current-app edge function (see FOREMAN_INSTRUCTIONS for function mapping
     decision required before builder delegation)
  2. Wire useIntentGeneration adaptation into IntentCreator — implement generate/accept/refine/save
     lifecycle for intent statements, mapped to mmm-ai-chat or equivalent current-app function
  3. Wire AIGeneratedCriteriaCards adaptation into CriteriaManagement — implement generate/accept/
     refine/save lifecycle for criteria, without shadcn/lucide dependencies
  4. Wire EnhancedCriteriaGenerator adaptation into CriteriaManagement — adapted without shadcn/
     lucide (Button, Card, Textarea, Badge), without useBestPracticeComparator and
     useSmartFeedbackLoop (legacy-only hooks not present in apps/mmm)
  5. Extend useDomainAuditBuilder.ts (or introduce companion hook(s)) to carry AI generation state
     (generating, generated result, accepted/rejected, loading, error) through the builder workflow
  6. Preserve legacy step order: step 1 (MPSs) → step 2 (intent) → step 3 (criteria); routing
     must not change
  7. Add / extend behavior coverage tests in modules/MMM/tests/ — AI generation lifecycle paths
     (generate trigger, accept, refine, error state, loading state) for each of the three steps
  8. Update modules/MMM/BUILD_PROGRESS_TRACKER.md to record wave state
  9. Update .agent-workspace/foreman-v2/personal/wave-current-tasks.md for this wave
 10. Create PREHANDOVER proof for this wave
 11. Create session memory for this wave

Applicable overlay:
  PRIMARY: PRODUCT_BUILD_ASSURANCE (product-facing BUILD/T2 — UI/app behaviour delivery,
    AI generation workflow wiring, React hooks and components)
    → PRODUCT_BUILD_ASSURANCE_STANDARD.md mandatory loading at Phase 3
    → BD-000 through BD-024 + FFA summary apply
    → NBR functional-behaviour pattern checks at Step 3.1 apply
  SECONDARY: PRE_BUILD_STAGE_MODEL (BUILD_PROGRESS_TRACKER.md modified)

Anti-regression obligations: YES
  NBR-001: Any useMutation for accepting/saving generated MPS, intent, or criteria must include
           onSuccess → queryClient.invalidateQueries for affected mmm_maturity_process_steps /
           mmm_criteria / mmm_domains queries. REGISTRY REF: NBR-001 ACTIVE.
  NBR-002: Any Supabase INSERT/UPDATE for saving accepted AI results must be checked against RLS
           policies. REGISTRY REF: NBR-002 ACTIVE.
  NBR-003: Any generation state (generatedMPS, generatedIntent, generatedCriteria, loading, error)
           introduced via hook or component must be reset on modal close / step navigation.
           REGISTRY REF: NBR-003 ACTIVE.
  NBR-005: No try/catch block that silently swallows AI generation or save errors.
           REGISTRY REF: NBR-005 ACTIVE.
  Anti-regression T-MMM-B4 168: All 168 passing tests from PR #1700 (vitest.mmm-b4.config.ts) must
           remain GREEN after this wave. The 3-step workflow structure, step rendering, loading state,
           and error state tests must not regress.
```

---

### EXPECTED_QA_SCOPE

Files IAA expects to be present in the PR diff:

```
MODIFIED:
  apps/mmm/src/hooks/useDomainAuditBuilder.ts
    — Must gain AI generation state (isGenerating, generatedResult, acceptedResult) for each
      step, or a companion hook useAIMPSGeneration, useIntentGeneration is added. The hook
      must expose generate/accept/refine/save callbacks to the modal components.

  apps/mmm/src/components/assessment/MPSSelectionModal.tsx
    — Must gain: "Generate with AI" trigger button, loading state display, generated MPS
      list (with accept/reject per item or all), refine input, and save-to-DB action.
      Must NOT import shadcn/lucide — use plain HTML/CSS elements matching existing
      apps/mmm coding style.

  apps/mmm/src/components/assessment/IntentCreator.tsx
    — Must gain: per-MPS "Generate intent" trigger, loading state, generated intent text,
      accept/edit/reject, save-to-DB action updating mmm_maturity_process_steps.intent_statement.
      Must NOT import shadcn/lucide.

  apps/mmm/src/components/assessment/CriteriaManagement.tsx
    — Must gain: per-MPS "Generate criteria" trigger, loading state, generated criteria list,
      accept/reject per item, save-to-DB action writing to mmm_criteria.
      Must NOT import shadcn/lucide.

NEW OR MODIFIED (hooks):
  apps/mmm/src/hooks/useAIMPSGeneration.ts  — current-app adaptation
    OR inline AI generation logic added to useDomainAuditBuilder.ts or MPSSelectionModal.tsx.
    Regardless of file location, the generation path must call a current-app edge function
    (NOT legacy 'search-ai-context' or 'maturion-ai-chat' directly — see FOREMAN_INSTRUCTIONS
    for edge function mapping decision).

  apps/mmm/src/hooks/useIntentGeneration.ts — current-app adaptation
    OR inline. Must call mmm-ai-chat (ADMIN scope — see FOREMAN_INSTRUCTIONS for auth strategy).

NEW (tests):
  modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx  — EXTENDED
    OR a new test file (e.g., modules/MMM/tests/B5-assessment/ai-generation-lifecycle.test.tsx)
    covering AI generation behavior tests:
      - MPS generation: trigger, loading state, generated list rendered, accept/reject cycle
      - Intent generation: trigger, loading state, generated text rendered, accept/edit cycle
      - Criteria generation: trigger, loading state, generated list rendered, accept/reject cycle
      - Error state: AI function failure → error message shown, no crash
      - Save path: accept → mutation fires → invalidateQueries called for affected entity

MODIFIED:
  modules/MMM/BUILD_PROGRESS_TRACKER.md — wave state update
  .agent-workspace/foreman-v2/personal/wave-current-tasks.md — wave update
  PREHANDOVER_PROOF_<wave>.md (root or .agent-workspace) — ceremony artifact
```

---

### EXPECTED_FAILURE_MODES

Critical failure risks the Foreman must brief the builder to avoid:

```
FAILURE-001 — LEGACY FUNCTION NAME DIRECT COPY (REJECTION-PACKAGE RISK)
  Pattern: Builder copies useAIMPSGeneration.ts verbatim and calls
           supabase.functions.invoke('search-ai-context') or 'maturion-ai-chat' unchanged.
  Impact:  'search-ai-context' does not exist in the current app's Supabase edge function
           registry (supabase/functions/). Runtime failure on first invoke.
           'maturion-ai-chat' is the LEGACY function name. Current app uses 'mmm-ai-chat'
           which requires JWT + ADMIN role validation — a direct swap without auth wiring
           will fail with 401 or 403 at runtime.
  Fix:     Foreman must specify edge function mapping before builder starts (see
           FOREMAN_INSTRUCTIONS). Builder uses only mmm-* functions.

FAILURE-002 — SHADCN/LUCIDE IMPORT IN MMM CURRENT APP (REJECTION-PACKAGE RISK)
  Pattern: Builder adapts AIGeneratedCriteriaCards.tsx or EnhancedCriteriaGenerator.tsx
           by keeping shadcn imports (Card, CardContent, Button, Badge, Textarea, etc.) or
           lucide-react icons (Wand2, CheckCircle, XCircle, RotateCcw, etc.).
  Impact:  apps/mmm has NO shadcn/ui components directory and no lucide-react dependency.
           TypeScript build fails. Import resolution fails. No UI renders.
  Fix:     All UI must use plain HTML elements with className strings.
           Icon replacements via text characters, Unicode, or simple SVG inline.
           Builder must NOT add shadcn or lucide-react packages to apps/mmm.

FAILURE-003 — MISSING useOrganization / useAuth IN CURRENT APP (REJECTION-PACKAGE RISK)
  Pattern: Builder copies hooks referencing useOrganization() or AuthContext/useAuth().
  Impact:  apps/mmm has no useOrganization hook and no AuthContext/useAuth references.
           The legacy hooks call currentOrganization.id, refetchOrganization(), user.id, etc.
           These will be undefined references at runtime if copied naively.
  Fix:     Builder must derive org/user context from the existing apps/mmm auth pattern.
           Check apps/mmm/src/lib/supabase.ts — getEdgeInvokeHeaders() provides JWT auth
           headers. Organization context must be sourced from the current app's session/
           query patterns (not legacy useOrganization). Foreman must confirm the correct
           org context sourcing strategy.

FAILURE-004 — MISSING HOOK DEPENDENCIES (EnhancedCriteriaGenerator)
  Pattern: Builder includes useBestPracticeComparator, useSmartFeedbackLoop,
           useBestPracticeComparator, AIFeedbackInterface, FallbackTraceabilityPanel,
           AdminTestMode, QADebugHub, MPSTargetedReprocessor, RedAlertMonitor.
  Impact:  None of these exist in apps/mmm. Import failure at build time.
  Fix:     These are legacy-only feedback and QA debug features. The current-app
           adaptation must reduce to core: generate → display → accept/reject → save.
           The feedback loop and QA debug layers are NOT in scope for this wave.

FAILURE-005 — NO CACHE INVALIDATION ON SAVE (NBR-001 VIOLATION)
  Pattern: Builder wires "accept + save" as a direct supabase.from().insert() or
           supabase.from().update() call without a TanStack Query mutation wrapper,
           or wraps it without invalidateQueries in onSuccess.
  Impact:  MPS/intent/criteria list in DomainAuditBuilder does not refresh after AI
           generation + save. User sees stale counts (0 MPS, 0 criteria) after
           completing the AI workflow.
  Fix:     All saves must use useMutation with onSuccess → queryClient.invalidateQueries
           for ['domain-audit-mps', domainId] / ['domain-audit-criteria', mpsIds] as
           appropriate. This is a blocking NBR-001 check at IAA review.

FAILURE-006 — GENERATION STATE NOT RESET ON MODAL CLOSE (NBR-003 VIOLATION)
  Pattern: generatedMPS[], generatedIntent string, generatedCriteria[] state held in hook
           or component is not cleared when modal closes or step changes.
  Impact:  User opens MPS generation modal, generates, closes without accepting. Opens
           again for a different domain — previous generation shown for new domain.
  Fix:     All generation state must reset on modal close (onClose callback) and on
           domainId change (useEffect cleanup). NBR-003 blocking check at IAA review.

FAILURE-007 — AI FUNCTIONS REQUIRE ADMIN ROLE — WRONG INVOCATION PATTERN
  Pattern: Builder calls mmm-ai-chat without passing JWT auth headers from current
           session. Legacy app called functions with anon key; current app functions
           require validateJWT + ADMIN role (see supabase/functions/mmm-ai-chat/index.ts).
  Impact:  401/403 response from edge function. Generation silently fails or crashes.
  Fix:     Use getEdgeInvokeHeaders() from apps/mmm/src/lib/supabase.ts to obtain
           Authorization + apikey headers for all supabase.functions.invoke() calls
           in the current app. This is the established pattern.

FAILURE-008 — STUBS / TODOS IN PRODUCTION PATHS (BD-002 VIOLATION)
  Pattern: Builder wires buttons as "// TODO: implement generation" placeholders, or
           returns empty arrays/null from generation hooks as stubs.
  Impact:  BD-002 — no stubs in production paths. REJECTION-PACKAGE.
  Fix:     Every generate/accept/save path must be fully implemented end-to-end.

FAILURE-009 — TEST COVERAGE ONLY ON HAPPY PATH (BD-012 VIOLATION)
  Pattern: Tests only check that the "Generate" button renders and the loading spinner
           appears. No tests for: error state rendering, accept/reject cycles, save
           mutation firing, state reset on close.
  Impact:  BD-012 zero test debt. IAA will check all lifecycle states are covered.
  Fix:     Tests must cover: idle state, loading state, generated result rendered,
           accept action, reject/refine action, error state (function failure),
           save confirmation, and state after close.

FAILURE-010 — wave-current-tasks.md NOT UPDATED
  Pattern: Builder or Foreman does not update wave-current-tasks.md to
           mmm-ai-generation-wiring-20260520 before PR opens.
  Impact:  IAA checks wave-current-tasks.md for ceremony_admin_appointed and wave
           coherence. Stale wave record = CERT ceremony finding.
  Fix:     Foreman must update wave-current-tasks.md before delegating to builder.
```

---

### FOREMAN_INSTRUCTIONS

Mandatory decisions and instructions Foreman must resolve before delegating to builder:

```
FOREMAN-DECISION-001 — EDGE FUNCTION MAPPING (BLOCKING — decide before builder starts)

  The legacy hooks call two edge functions that do NOT exist in the current app:
  - 'search-ai-context'  → no equivalent in supabase/functions/
  - 'maturion-ai-chat'   → current app uses 'mmm-ai-chat' (ADMIN role required)

  Available current-app AI edge functions:
  - mmm-ai-chat              (POST, JWT + ADMIN role, calls AIMC /api/ai/chat)
  - mmm-ai-framework-generate (POST, JWT + ADMIN role, creates proposed_domains — framework-level,
                               NOT per-domain MPS generation in isolation)
  - invoke-ai-parse-criteria  (criteria parsing from AI output)
  - mmm-ai-recommend          (for recommendations)
  - mmm-ai-explain            (for explanations)

  IAA cannot determine which function the builder should use for per-domain MPS generation.
  Foreman must make this architectural decision:

  OPTION A: Adapt MPS generation to use mmm-ai-chat with a domain-specific prompt
            (builder constructs prompt: "Generate 5 MPSs for domain: [domainName]") and
            parses the AI reply for MPS structure. Auth: getEdgeInvokeHeaders().
  OPTION B: Use mmm-ai-framework-generate — but note this generates PROPOSED domains
            (mmm_proposed_domains table), not MPSs for existing domains. Builder would
            need to write new insertion logic or the Foreman must clarify if proposed
            MPS output from this function can be adapted.
  OPTION C: Declare that MPS AI generation is scoped to mmm-ai-chat with a structured
            prompt, matching the intent generation pattern — consistent across all three
            lifecycle steps.

  IAA RECOMMENDATION (advisory): Option A/C is architecturally cleaner and consistent.
  mmm-ai-framework-generate creates proposed_domains which is for NEW framework setup,
  not per-existing-domain MPS generation. Foreman must confirm and specify this in the
  builder delegation before work starts.

FOREMAN-DECISION-002 — ORGANIZATION CONTEXT SOURCING (BLOCKING)

  Legacy hooks rely heavily on useOrganization() for org ID. This hook does not exist
  in apps/mmm. The builder must source org context differently.

  Decision required: Foreman must specify how the builder obtains currentOrganization.id
  in the current app. Options:
  - From TanStack Query (supabase.from('mmm_organizations').select() scoped to user)
  - From an existing session claim in the JWT (accessible via getEdgeInvokeHeaders or
    supabase.auth.getUser())
  - From the frameworkId / domainId already passed as props to DomainAuditBuilder

  If the orgId is already available from supabase.auth.getSession() claims, Foreman
  should instruct builder to source it that way. Foreman must explicitly state which
  pattern to use — not leave this as a builder-discretion decision.

FOREMAN-DECISION-003 — ADMIN ROLE CONSTRAINT ON AI FUNCTIONS (MANDATORY NOTICE)

  mmm-ai-chat and mmm-ai-framework-generate both require JWT + ADMIN role (see
  supabase/functions/mmm-ai-chat/index.ts: requireRole(claims.role, ['ADMIN'])).

  Foreman must confirm: Is the DomainAuditBuilder AI generation feature intended for
  ADMIN-role users only? If yes, the generate buttons should be conditionally rendered
  only when the current user has ADMIN role. If the AI generation is intended for all
  roles, a different edge function strategy (or a new function) is required.

  IAA will check at review that the auth boundary is correctly implemented — AI generate
  buttons must not be rendered/invocable by non-admin users if the backend is admin-only.

FOREMAN-INSTRUCTION-001 — NO SHADCN / NO LUCIDE IN apps/mmm

  Explicitly instruct builder: apps/mmm has NO shadcn/ui and NO lucide-react.
  All AI generation UI (buttons, cards, loading indicators, status badges) must use
  plain HTML elements with className attributes. Builder must NOT add new npm packages.
  Use existing apps/mmm styling conventions (see existing DomainAuditBuilder, MPSSelectionModal
  for the established pattern of modal-overlay / modal-content / modal-header classes).

FOREMAN-INSTRUCTION-002 — LEGACY SUB-COMPONENT EXCLUSIONS

  Explicitly instruct builder: the following legacy components are NOT to be adapted
  or included in the current app:
  - AdminTestMode (QA debug overlay, admin-only debug panel)
  - QADebugHub (QA debug hub component)
  - MPSTargetedReprocessor (admin MPS reprocessing tool)
  - RedAlertMonitor / useRedAlertMonitor (QA red alert framework)
  - AIFeedbackInterface (AI feedback loop UI)
  - FallbackTraceabilityPanel (fallback traceability display)
  These are legacy QA/admin debug tools not relevant to the current-app adaptation scope.

FOREMAN-INSTRUCTION-003 — AUTH HEADER PATTERN FOR EDGE FUNCTION CALLS

  Instruct builder to use getEdgeInvokeHeaders() from apps/mmm/src/lib/supabase.ts
  for all supabase.functions.invoke() calls. This pattern is established in the current
  app and provides JWT Bearer + apikey headers. Do NOT use the legacy pattern of passing
  only { organization_id } in the body without auth headers.

FOREMAN-INSTRUCTION-004 — NBR-001/NBR-003 COMPLIANCE MANDATORY

  Foreman must explicitly brief builder:
  - Every save-to-DB action after AI acceptance must use useMutation with onSuccess →
    queryClient.invalidateQueries. This is not optional — it is a registered FAIL-ONLY-ONCE
    blocking pattern (NBR-001).
  - All generation state (generatedMPS, generatedIntent, generatedCriteria) must be reset
    on modal close and on domainId prop change (NBR-003). Builder must implement explicit
    reset in useEffect or onClose callback.

FOREMAN-INSTRUCTION-005 — TEST SUITE EXTENSION SCOPE

  The existing vitest.mmm-b4.config.ts covers domain-workflow-behavior.test.tsx (321 lines,
  168 tests). All 168 tests must remain GREEN (anti-regression).

  New tests for the AI generation lifecycle should either:
  (a) Extend domain-workflow-behavior.test.tsx with new describe blocks for the AI
      generation lifecycle, OR
  (b) Add a new test file under modules/MMM/tests/B4-framework/ or B5-assessment/
      covered by an appropriate vitest config.

  Foreman must specify to builder which test file location to use. IAA will reject if
  tests are missing for any of the declared lifecycle states.

FOREMAN-INSTRUCTION-006 — WAVE-CURRENT-TASKS.MD UPDATE BEFORE BUILDER DELEGATION

  Foreman must update .agent-workspace/foreman-v2/personal/wave-current-tasks.md to
  reflect wave mmm-ai-generation-wiring-20260520 BEFORE delegating to builder.
  Include: ceremony_admin_appointed declaration (YES or NO for this wave).
  IAA will verify wave coherence at review time.
```

---

### ECAP_REQUIRED / ECAP_EXPECTED_ARTIFACTS

```
ECAP_REQUIRED: CONDITIONAL
  — Required IF Foreman appoints execution-ceremony-admin-agent for this wave.
  — wave-current-tasks.md ceremony_admin_appointed field must declare YES or NO.

ECAP_EXPECTED_ARTIFACTS (if appointed):
  1. PREHANDOVER proof file (root or .agent-workspace location, consistent with wave)
     Required fields: wave_id, pr_number, branch, final_state, iaa_audit_token (pre-populated
     with expected reference IAA-session-NNN-mmm-ai-generation-wiring-20260520-PASS)
  2. IAA token file at: .agent-admin/assurance/iaa-token-session-NNN-mmm-ai-generation-wiring-20260520.md
     (written by IAA at verdict time — ECAP must NOT pre-populate with verdict content)
  3. Wave record updated: THIS FILE (.agent-admin/assurance/iaa-wave-record-mmm-ai-generation-wiring-20260520.md)
     → IAA appends ## TOKEN section at verdict time

ECAP_TOKEN_WRITING_INVARIANT (ECAP-001/ECAP-002):
  execution-ceremony-admin-agent MUST NOT write IAA tokens or verdicts.
  Token authority is IAA-only. Any pre-written verdict in the bundle = ACR-13 auto-reject.

PREHANDOVER_PROOF_READ_ONLY_POST_COMMIT:
  Per A-029: PREHANDOVER proof is read-only after initial commit. IAA will NOT edit it.
  iaa_audit_token field should be pre-populated with expected reference only.
```

---

### CURRENT_HEAD_CI_EXPECTATIONS

```
Current HEAD SHA: 8c1e255 (copilot/wire-legacy-mmm-ai-generation-workflow)
  Note: HEAD is currently "Initial plan" commit — implementation not yet started.
  Branch base: 63ba38b (main, post PR #1700 merge)

CI SUITE EXPECTATIONS AT PR OPEN:

1. vitest.mmm-b4.config.ts — ALL 168 tests must pass (ANTI-REGRESSION)
   Test file: modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx
   Scope: DomainWorkspacePage → DomainAuditBuilder 3-step workflow rendering, step click,
          loading states, error states, domain data loading.
   Failure = REJECTION-PACKAGE (BD-011 zero test debt + anti-regression).

2. NEW AI generation lifecycle tests — ALL must pass (GREEN on open)
   Location: modules/MMM/tests/B4-framework/ or B5-assessment/ (per Foreman instruction)
   Minimum coverage required:
   - MPS generation trigger → loading state → generated list rendered
   - MPS accept → mutation fires → invalidateQueries called
   - MPS error state → error message rendered, no crash
   - Intent generation trigger → loading state → generated text rendered
   - Intent accept → mutation fires → intent_statement updated
   - Intent error state → error message shown
   - Criteria generation trigger → loading state → criteria list rendered
   - Criteria accept → mutation fires → criteria saved
   - Criteria error state → error message shown
   - Generation state reset on modal close (NBR-003 test)

3. TypeScript strict compilation — ZERO type errors (BD-021)
   apps/mmm must compile without errors.
   No `any` types without justification. No unsafe casts masking AI response shapes.

4. Existing test suites (B1–B3, B5–B9, wiring-invariants) — NO REGRESSIONS
   The AI generation wiring must not break any previously passing test suites.

KNOWN CI RISK:
  mmm-b4 tests mock supabase.from() — new supabase.functions.invoke() calls in
  AI generation hooks will also need to be mocked in tests. Builder must add
  vi.hoisted() / vi.mock() for supabase.functions.invoke to the test mock setup.
  Forgetting this mock = runtime error in test runner, not just test failure.
```

---

### POLC_AND_BUILDER_DELEGATION_EXPECTATIONS

```
POLC AUTHORITY:
  CS2 Authorization: Issue #1710 opened by CS2 (@APGI-cmy), assigns Copilot. CONFIRMED.
  Wave is CS2-authorized. Foreman may delegate to builder without additional CS2 gate.

DELEGATION CHAIN EXPECTED:
  CS2 (#1710) → Foreman (foreman-v2-agent) → ui-builder (implementation)
  IAA (independent-assurance-agent) is the hard gate before merge.

POLC BOUNDARY — WHAT FOREMAN MUST NOT DO:
  Foreman must NOT implement the AI generation hooks or UI changes directly.
  Foreman's role: Architecture decisions (FOREMAN-DECISION-001 through -003), then
  delegation brief to builder with complete context. No implementation by Foreman.

POLC BOUNDARY — WHAT BUILDER MUST NOT DO:
  Builder must NOT change the step order (MPS → Intent → Criteria).
  Builder must NOT add new npm packages to apps/mmm (no shadcn, no lucide-react).
  Builder must NOT modify the Supabase schema or edge function signatures.
  Builder must NOT introduce agent contract, governance/canon, or CI workflow changes.
  All of the above would trigger additional IAA categories (AGENT_CONTRACT,
  CANON_GOVERNANCE, CI_WORKFLOW) and require separate pre-brief and review.

BUILDER CLASS: ui-builder
  This is a UI/frontend implementation task. ui-builder is the correct builder class.
  No schema-builder or api-builder delegation required for this wave.
  If Foreman determines a new edge function is needed (see FOREMAN-DECISION-001 Option B),
  integration-builder may need to be invoked separately — but IAA advises against scope
  creep; the existing mmm-ai-chat function should be sufficient with correct prompt
  construction.

PRE-BRIEF CONSUMED: Foreman must mark FOREMAN_CONSUMED_PREFLIGHT_BEFORE_IMPLEMENTATION: yes
  in wave-current-tasks.md before delegating to builder.
```

---

### IAA_WILL_QA

At handover (Phase 2–4 assurance), IAA will execute the following checks:

```
CORE:
  CORE-020: Zero partial pass — no assumed evidence
  CORE-021: Zero severity tolerance — no "minor" or "trivial" findings

CERT (Universal Ceremony Gate):
  CERT-001: PREHANDOVER proof present
  CERT-002: Session memory present
  CERT-003: FAIL-ONLY-ONCE attestation declared in session memory preamble
  CERT-004: iaa_audit_token field present in PREHANDOVER proof

BD-000 USER JOURNEY TRACE (ALL AFFECTED FLOWS):
  Flow 1: User opens DomainAuditBuilder Step 1 (MPSs) → clicks Generate with AI →
           system calls edge function → loading indicator shown → MPS list rendered →
           user accepts/rejects items → user saves → MPS records written to DB →
           step count updates.
  Flow 2: User opens Step 2 (Intent) → selects MPS → clicks Generate intent →
           loading shown → generated intent text displayed → user accepts or edits →
           saves → intent_statement updated in mmm_maturity_process_steps.
  Flow 3: User opens Step 3 (Criteria) → selects MPS → clicks Generate criteria →
           loading shown → generated criteria list displayed → user accepts per item →
           saves → criteria written to mmm_criteria.
  Flow 4 (error path): Edge function returns error → error message displayed → no crash →
           user can retry.
  Flow 5 (close without saving): User generates, does not accept, closes modal →
           generation state resets → no partial data in DB.

BD-001: Full scope delivered — all 11 qualifying tasks present in diff
BD-002: No stubs/TODOs in generation, acceptance, or save paths
BD-003: One-time build — feature works end-to-end on first deploy
BD-004: No leftover debt from previous waves in touched files
BD-005: End-to-end wiring — generation call → response parse → UI render → save → DB write
BD-006: Writers and readers confirmed for AI-generated MPS/intent/criteria save paths
BD-007: Auth guards — generate buttons not invocable by non-admin if mmm-ai-chat is ADMIN-only
BD-009: Cross-component integration fit — new hooks/state do not break existing DomainAuditBuilder
         step rendering, count display, or data loading
BD-010: No orphaned files — all new hooks/components consumed
BD-011: ALL 168 B4 tests GREEN (anti-regression) + ALL new AI lifecycle tests GREEN
BD-012: Zero test debt — no .skip(), .only(), .todo() or missing lifecycle coverage
BD-013: No test dodging — each test asserts on actual behavior not vacuous pass conditions
BD-015: N/A — no new Supabase schema changes expected
BD-016: No hardcoded credentials in AI function invoke calls
BD-017: Input validation on any user-editable criteria/intent text before save
BD-018: No XSS vectors in rendered AI-generated content (must be escaped/sanitised before render)
BD-020: No god functions — generation logic separated from render logic
BD-021: TypeScript strict — no `any`, no unsafe casts on AI response shapes

NBR-001: Every save mutation has onSuccess → queryClient.invalidateQueries (BLOCKING)
NBR-002: Supabase write for AI-accepted content checked for RLS-blocked response (BLOCKING)
NBR-003: Generation state reset on modal close and on domainId change (BLOCKING)
NBR-005: No silent try/catch swallowing AI generation or save errors (BLOCKING)
```

---

### RESULT: PREFLIGHT_BRIEF_COMPLETE

```
Wave:              mmm-ai-generation-wiring-20260520
PR:                #1711
Issue:             #1710
Qualifying tasks:  11
Applicable overlay: PRODUCT_BUILD_ASSURANCE (primary) + PRE_BUILD_STAGE_MODEL (secondary)
Anti-regression:   YES — NBR-001, NBR-002, NBR-003, NBR-005 + 168 B4 tests
Ceremony admin:    NOT YET DECLARED — Foreman must declare ceremony_admin_appointed in
                   wave-current-tasks.md update
IAA phase:         PHASE_B_BLOCKING — hard gate ACTIVE
Foreman decisions  FOREMAN-DECISION-001, -002, -003 must be resolved before builder delegation
required before
builder delegation:
```

---

## TOKEN

*Awaiting IAA verdict at handover review. Token to be appended by independent-assurance-agent
after Phase 2–4 assurance of PR #1711.*

---

## REJECTION_HISTORY

*No rejections recorded for this wave (pre-brief only).*

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: 6.2.0
**Wave Record Version**: 1.0 — PRE-BRIEF COMPLETE
**Last Updated**: 2026-05-20
