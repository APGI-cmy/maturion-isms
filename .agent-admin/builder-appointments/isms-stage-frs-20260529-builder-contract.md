# Builder Appointment — ISMS FRS Derivation

| Field | Value |
|---|---|
| Wave ID | `isms-stage-frs-20260529` |
| Builder | Documentation / Requirements Builder |
| Appointed By | Foreman — ChatGPT acting for ISMS governance workflow |
| Date | 2026-05-29 |
| Status | ACTIVE — bounded FRS artifact creation |

---

## 1. Appointment

The Documentation / Requirements Builder is appointed to create the ISMS Functional Requirements Specification for the public ISMS platform front-door, shared context, pre-subscription, subscription, onboarding, and module-handoff scope.

The builder is bounded by the scope declaration:

```text
.agent-admin/scope-declarations/isms-stage-frs-20260529.md
```

---

## 2. Primary Deliverable

The builder shall create:

```text
modules/isms/02-frs/functional-requirements.md
```

---

## 3. Required Inputs

The builder must derive requirements from:

- `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0
- `FOREMAN_OPERATING_MODEL.md`
- `governance/templates/FRS_TEMPLATE.md`
- `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md`
- `modules/isms/prebuild-harvest-package/harvest-map.md`
- `modules/isms/prebuild-harvest-package/implementation-map.md`
- `modules/isms/08-builder-checklist/builder-checklist.md`

---

## 4. Build Boundaries

The builder must not:

- modify implementation code;
- alter legacy harvest source files;
- mark the FRS approved without CS2 or authorized proxy disposition;
- silently resolve UX, onboarding, MMM handoff, `/assessment`, or `/pit` decisions;
- collapse MMM domain responsibilities into ISMS requirements;
- create technical implementation requirements that belong in TRS.

---

## 5. Required Content

The FRS must include:

1. status header;
2. derivation statement;
3. scope and out-of-scope boundaries;
4. fully functional delivery rule;
5. verifiable functional requirements;
6. public/private route requirements;
7. module-card and marketing-page requirements;
8. free-assessment and subscription path requirements;
9. onboarding and shared-context requirements;
10. module handoff requirements;
11. open issues and risks;
12. approval/sign-off status.

---

## 6. Handover Criteria

Builder handover is acceptable only when:

- the FRS artifact exists;
- all requirements use SHALL-style language;
- requirements are traceable to App Description sections;
- known unresolved decisions are recorded as open issues;
- Foreman QP can review the document against the scope.
