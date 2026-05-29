# ECAP — ISMS FRS Derivation Wave

| Field | Value |
|---|---|
| Wave ID | `isms-stage-frs-20260529` |
| Repository | `APGI-cmy/maturion-isms` |
| Date | 2026-05-29 |
| Foreman | ChatGPT acting as Foreman for ISMS |
| Status | FILED |

---

## 1. Purpose

This ECAP preserves the administrative record for the ISMS App Description independent overview evaluation and FRS derivation wave.

---

## 2. Trigger

Johan Ras requested:

1. complete independent overview evaluation of the ISMS App Description;
2. if sound, implementation of the next functional requirements artifact for the build.

User wording referred to “Stage 2, i.e. create the FRS.” Local ISMS governance defines FRS as Stage 3. The wave proceeded with the requested FRS while documenting the mismatch.

---

## 3. Files Created

- `.agent-admin/scope-declarations/isms-stage-frs-20260529.md`
- `.agent-admin/builder-appointments/isms-stage-frs-20260529-builder-contract.md`
- `.agent-admin/assurance/iaa-prebrief-isms-stage-frs-20260529.md`
- `modules/isms/02-frs/functional-requirements.md`
- `.agent-admin/quality/isms-stage-frs-20260529-foreman-qp.md`
- `.agent-admin/ecap/isms-stage-frs-20260529-ecap.md`

IAA review is expected as the final companion artifact after ECAP creation.

---

## 4. App Description Evaluation Summary

The ISMS App Description v1.2.0 is sufficient to derive a draft FRS because it defines:

- ISMS as platform front door;
- public pre-subscription flow;
- module card model;
- subscription/sign-up/get-to-know-you flow;
- module ownership boundaries;
- shared context envelope;
- Ask Maturion shared assistant model;
- route and handoff principles;
- legacy harvest authority;
- known downstream gaps.

The App Description is not yet sufficient for implementation handover by itself because Stage 2 UX Workflow & Wiring Spec remains missing and several handoff decisions are still open.

---

## 5. Decisions Made

1. Proceeded with draft FRS creation.
2. Did not claim CS2 approval.
3. Did not modify implementation code.
4. Did not update the tracker automatically due to known tracker reconciliation risk.
5. Recorded Stage 2/Stage 3 numbering mismatch in scope and FRS.
6. Preserved known gaps as open issues.

---

## 6. Evidence Reviewed

- `FOREMAN_OPERATING_MODEL.md`
- `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0
- `modules/isms/BUILD_PROGRESS_TRACKER.md`
- `governance/templates/FRS_TEMPLATE.md`
- `modules/MMM/02-frs/functional-requirements.md` as example FRS style
- `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md`

---

## 7. Open Risks

| Risk | Status | Follow-Up |
|---|---|---|
| Stage numbering mismatch | Open | Tracker reconciliation / CS2 decision |
| Missing ISMS UX Workflow & Wiring Spec | Open | Create Stage 2 artifact or record waiver |
| `/onboarding` route missing | Open | Resolve in UX/TRS/implementation plan |
| MMM handoff unresolved | Open | Resolve in UX/TRS/architecture |
| Free assessment to `/assessment` ambiguity | Open | Define public result vs private assessment path |
| PIT authenticated entry missing | Open | Reserve future entry route |
| FRS not CS2-approved | Open | Seek CS2 or explicit proxy approval |

---

## 8. CI / Status

This was a documentation-only repository update.

- Local build: Not run.
- Typecheck: Not run.
- Tests: Not run.
- CI: Not inspected because no PR was opened during this wave.

Do not report CI as passing.

---

## 9. Recommended Next Action

1. Complete IAA review of the FRS.
2. Ask CS2 whether to approve the FRS draft, authorize AI-assisted proxy review, or request changes.
3. Reconcile tracker state.
4. Decide whether to backfill Stage 2 UX Workflow & Wiring Spec before proceeding to TRS.
