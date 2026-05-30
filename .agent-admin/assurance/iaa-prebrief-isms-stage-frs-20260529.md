# IAA Pre-Brief — ISMS FRS Derivation Wave

| Field | Value |
|---|---|
| Wave ID | `isms-stage-frs-20260529` |
| Subject | Independent assurance pre-brief for ISMS FRS creation |
| Date | 2026-05-29 |
| Requested By | Foreman — ChatGPT acting for ISMS governance workflow |
| Status | ACTIVE |

---

## 1. Assurance Context

The Foreman has initiated a documentation/pre-build wave to evaluate the ISMS App Description and create an ISMS Functional Requirements Specification.

The App Description is `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0.

The target FRS artifact is:

```text
modules/isms/02-frs/functional-requirements.md
```

---

## 2. Assurance Questions

IAA must independently review whether:

1. The App Description is sufficiently complete to derive a functional requirements baseline.
2. The FRS scope remains inside ISMS top-level authority and does not absorb downstream module internals.
3. The FRS preserves public/private route boundaries.
4. The FRS preserves the public pre-subscription flow through learning, practical exercise, subscription, sign-up, get-to-know-you, and module entry.
5. Known gaps are disclosed instead of hidden.
6. The FRS is suitable for downstream UX/TRS/Architecture work, subject to explicit CS2 approval.

---

## 3. Specific Risk Areas

IAA must check the following known risks:

- Stage numbering mismatch: user referred to Stage 2 as FRS, while local canon defines Stage 2 as UX and Stage 3 as FRS.
- Missing formal UX Workflow & Wiring Spec for ISMS.
- Tracker may be stale relative to the App Description.
- `/onboarding` route and context contract are missing.
- MMM handoff contract is unresolved.
- Free assessment to `/assessment` route may be broken or ambiguous.
- PIT authenticated entry route is not yet defined.
- Non-MMM module practical exercises are conceptual only.

---

## 4. Assurance Expected Output

IAA review should produce:

- disposition;
- material findings;
- evidence reviewed;
- open issues;
- whether FRS is supportable as a draft artifact;
- whether it may be treated as approved without CS2/proxy sign-off.

---

## 5. Pre-Brief Disposition

IAA is authorized to review the FRS artifact once created.

IAA is not authorized to approve the stage on behalf of CS2 unless Johan Ras explicitly authorizes AI-assisted CS2 proxy approval.
