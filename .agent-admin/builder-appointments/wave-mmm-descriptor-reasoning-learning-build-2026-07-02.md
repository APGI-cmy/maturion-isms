# Builder Appointment — MMM Descriptor Reasoning + Governed Learning Retrieval Build

Wave ID: `wave-mmm-descriptor-reasoning-learning-build-2026-07-02`  
Issue: #1900  
Module: MMM  
Builder: `ui-builder`  
Status: appointed for bounded implementation after merged pre-build / QA-to-red authority

---

## 1. Appointment authority

This builder appointment is created after PR #1898 merged the CS2-requested pre-build / QA-to-red baseline for MMM Descriptor Reasoning + Governed Learning Retrieval.

Baseline authority:

- Successor implementation issue: #1900
- Baseline descriptor grammar issue: #1871
- Merged pre-build PR: #1898
- FRS addendum: `modules/MMM/02-frs/descriptor-reasoning-learning-frs-addendum.md`
- QA-to-red expansion: `modules/MMM/05-qa-to-red/descriptor-reasoning-learning-qa-to-red.md`
- Existing grammar QA: `modules/MMM/05-qa-to-red/descriptor-grammar-closure-qa-to-red.md`
- Build tracker: `modules/MMM/BUILD_PROGRESS_TRACKER.md`

---

## 2. Builder assignment

The appointed builder must build the MMM descriptor reasoning and governed learning retrieval behaviour to green.

The implementation must ensure Maturion:

1. detects and passes selected source mode into descriptor generation and learning retrieval;
2. treats `verbatim_source` criteria as preserved source material requiring interpretation before descriptor generation;
3. reconstructs raw / awkward / nominal / gerund / passive / instruction-style criteria into observable evidence-state clauses;
4. preserves criterion actor/action/object semantics;
5. strips `Note:`, `Guidance:`, and `Reference:` material from descriptor evidence subjects while retaining it as context;
6. prevents raw malformed criterion stems such as `Evidence that Review and approval...`;
7. supports consent-gated descriptor-learning capture;
8. persists descriptor-learning records with transformation metadata, correction category, scope, lifecycle, consent, and conflict status where the learning store is in scope and available;
9. retrieves governed learning records before descriptor generation where available;
10. ranks, scopes, and bounds retrieved learning examples;
11. prevents cross-tenant learning retrieval except for approved global methodology patterns;
12. avoids silently merging conflicting learning records;
13. uses deterministic methodology fallback when learning retrieval is unavailable and avoids claiming that learning was applied;
14. preserves descriptor editability after save until a future explicit signoff lock exists.

---

## 3. Authorised files

Primary authorised implementation files:

- `apps/mmm/src/components/assessment/CriteriaManagement.tsx`
- `modules/MMM/tests/B4-framework/domain-workflow-behavior.test.tsx`

Conditional extension only if justified by red tests and existing architecture:

- Supabase edge-function or descriptor-learning retrieval logic related to reusable accepted descriptor corrections.
- Additional MMM test fixture files required to prove the QA-to-red expectations.

Any other file change requires explicit justification in the implementation PR body and must remain inside the MMM descriptor reasoning / governed learning retrieval scope.

---

## 4. Required QA-to-red implementation coverage

The builder must satisfy the merged QA groups from `descriptor-reasoning-learning-qa-to-red.md`, including at minimum:

- T-MMM-DRGL-001: verbatim nominal phrase is reconstructed;
- T-MMM-DRGL-002: verbatim source mode preserves raw criterion but reasons over it;
- T-MMM-DRGL-003: source mode is included in generation context and retrieval query;
- T-MMM-DRGL-004: notes and guidance are stripped from descriptor subject but retained as context;
- T-MMM-DRGL-005: gerund and instruction wording remain covered;
- T-MMM-DRGL-006: learning consent gates memory write;
- T-MMM-DRGL-007: learning record stores transformation evidence;
- T-MMM-DRGL-008: learning reuse scope prevents uncontrolled globalisation;
- T-MMM-DRGL-009: prior accepted correction influences similar future descriptor;
- T-MMM-DRGL-010: learning retrieval uses priority order;
- T-MMM-DRGL-011: retrieval is bounded to high-signal examples;
- T-MMM-DRGL-012: conflicting learning is not silently merged;
- T-MMM-DRGL-013: tenant isolation governs learning retrieval;
- T-MMM-DRGL-014: memory unavailable fallback is honest and deterministic;
- T-MMM-DRGL-015: maturity levels remain distinct operating states;
- T-MMM-DRGL-016: descriptor editing remains available after save;
- T-MMM-DRGL-017: learning capture does not self-promote to Subject Knowledge Domain;
- T-MMM-DRGL-018: descriptor generation context includes current framework state.

---

## 5. Required build evidence

The implementation PR must include or report:

1. red tests added before or with implementation;
2. exact command evidence for relevant MMM tests;
3. build / typecheck / lint status where applicable;
4. proof that the exact `Review and approval of facility design changes...` case no longer produces `Evidence that Review and approval...`;
5. proof that cross-tenant learning retrieval excludes `anonymised_global_pattern_candidate` unless promoted to approved global methodology;
6. proof that descriptor editability after save still works;
7. explicit non-scope confirmation.

---

## 6. Exclusions

The builder must not implement or modify:

- ISMS public landing / module overview routes;
- subscription, authentication, onboarding, dashboard, or entitlement handoff;
- PIT, RADAM, Risk, Incident, APW, or other module behaviour;
- signoff route implementation;
- Vercel workflow changes;
- `.github/agents/` files;
- direct AI provider integration outside AIMC governance;
- global Subject Knowledge promotion without explicit governed approval.

---

## 7. Order gate intent

This appointment package must exist before the first implementation commit for issue #1900.

No runtime completion, production readiness, handover, ready-for-review, or merge-ready claim may be made until build-to-green evidence exists.

Future implementation PR must preserve the normal governance path: QA-to-red -> builder appointment -> implementation -> QP -> ECAP/IAA/CS2 review as applicable.
