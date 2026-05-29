# Scope Declaration — ISMS FRS Derivation Wave

| Field | Value |
|---|---|
| Wave ID | `isms-stage-frs-20260529` |
| Repository | `APGI-cmy/maturion-isms` |
| Product / Module | ISMS — Integrated Security Management System |
| Foreman | ChatGPT acting as Foreman for ISMS |
| Requested By / CS2 Authority | Johan Ras |
| Date | 2026-05-29 |
| Status | ACTIVE — FRS artifact creation and governance review |

---

## 1. Trigger

Johan Ras requested a complete independent overview evaluation of the ISMS App Description and, if fit for progression, creation of the Functional Requirements Specification for the ISMS build.

User wording used “Stage 2, i.e. create the FRS”. The local ISMS operating model defines:

- Stage 2 = UX Workflow & Wiring Spec
- Stage 3 = Functional Requirements Specification

This wave follows the user’s explicit intent to create the FRS while recording the stage-number mismatch for later tracker reconciliation.

---

## 2. Authority Loaded

Primary authority:

- `FOREMAN_OPERATING_MODEL.md`
- `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0
- `modules/isms/BUILD_PROGRESS_TRACKER.md`
- `governance/templates/FRS_TEMPLATE.md`

Supporting authority:

- `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md`
- `apps/maturion-maturity-legacy/src/App.tsx`
- `modules/isms/prebuild-harvest-package/harvest-map.md`
- `modules/isms/prebuild-harvest-package/implementation-map.md`
- `modules/isms/08-builder-checklist/builder-checklist.md`

---

## 3. Scope In

This wave includes:

1. Independent overview evaluation of the ISMS App Description for FRS readiness.
2. Creation of the ISMS Functional Requirements Specification at:
   - `modules/isms/02-frs/functional-requirements.md`
3. Requirements derivation from App Description v1.2.0.
4. Functional requirements for:
   - public landing and module discovery;
   - public learning / journey flow;
   - free assessment;
   - module marketing pages;
   - subscription and checkout;
   - auth/sign-up entry;
   - get-to-know-you onboarding;
   - shared context envelope;
   - public/private route boundaries;
   - post-onboarding subscribed module entry;
   - module handoff boundaries;
   - Ask Maturion affordances;
   - auditability and governance-visible events.
5. Creation of Foreman QP, ECAP, IAA prebrief, and IAA review artifacts.

---

## 4. Scope Out

This wave does not implement code, UI, routes, database tables, edge functions, CI workflows, production deployment, or module workspace internals.

This wave does not approve the FRS on behalf of CS2. No AI-assisted CS2 proxy approval is recorded unless Johan Ras explicitly authorizes proxy approval.

This wave does not silently reconcile `modules/isms/BUILD_PROGRESS_TRACKER.md`; it records the mismatch and recommends a dedicated tracker reconciliation.

---

## 5. Acceptance Conditions

The wave is successful when:

- the App Description has been evaluated independently;
- a draft FRS exists with clear derivation from App Description v1.2.0;
- requirements are written as verifiable SHALL statements;
- known gaps are preserved as open issues rather than hidden;
- Foreman QP, ECAP, IAA prebrief, and IAA review are filed;
- CI status is honestly stated as not applicable / not run for this documentation-only wave unless a PR or workflow run exists.

---

## 6. Current Disposition

Proceed with FRS drafting.

App Description readiness: PASS WITH CONDITIONS.

Conditions:

1. Stage-number mismatch must be tracked: local canon calls FRS Stage 3, user requested Stage 2 as FRS.
2. Missing UX Workflow & Wiring Spec should be backfilled or created as a follow-up Stage 2 artifact.
3. `/onboarding`, MMM handoff, `/assessment`, `MATURITY_SETUP`, and future `/pit` entry decisions remain open downstream requirements.
