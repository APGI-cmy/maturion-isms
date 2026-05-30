# Builder Appointment — ISMS Stage Alignment and UX Backfill

| Field | Value |
|---|---|
| Wave ID | `isms-stage-alignment-20260529` |
| Builder | UX / Requirements Alignment Builder |
| Appointed By | Foreman — ChatGPT acting for ISMS governance workflow |
| Date | 2026-05-29 |
| Status | ACTIVE |

---

## 1. Appointment

The UX / Requirements Alignment Builder is appointed to create the missing Stage 2 UX Workflow & Wiring Spec, create an open-issues carry-forward register, and reconcile the ISMS build tracker with the approved App Description and FRS state.

---

## 2. Deliverables

The builder shall create or update:

```text
modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md
modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md
modules/isms/BUILD_PROGRESS_TRACKER.md
```

---

## 3. Required Constraints

The builder must:

- preserve the repo canonical stage model: Stage 2 = UX Workflow & Wiring Spec; Stage 3 = FRS; Stage 4 = TRS;
- preserve the app-description and FRS approvals as approved with conditions;
- carry known open issues forward rather than resolving them silently;
- not authorize implementation handover;
- not modify implementation code;
- not modify legacy harvest source files.

---

## 4. Handover Criteria

Builder handover is acceptable when the deliverables exist, tracker is reconciled, and Foreman QP can confirm that Stage 4 TRS is the next governed stage while implementation handover remains blocked.
