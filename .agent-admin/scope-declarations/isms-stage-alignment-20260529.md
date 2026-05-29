# Scope Declaration — ISMS Stage Alignment and UX Backfill

| Field | Value |
|---|---|
| Wave ID | `isms-stage-alignment-20260529` |
| Repository | `APGI-cmy/maturion-isms` |
| Product / Module | ISMS — Integrated Security Management System |
| Foreman | ChatGPT acting as Foreman for ISMS |
| CS2 Authority | Johan Ras |
| Date | 2026-05-29 |
| Status | ACTIVE — Stage alignment, UX backfill, tracker reconciliation |

---

## 1. Trigger

Johan Ras requested alignment of the following conditions so the ISMS build can proceed cleanly:

- Stage-number mismatch must be reconciled.
- Formal UX Workflow & Wiring Spec must be created/backfilled or explicitly waived before implementation handover.
- `BUILD_PROGRESS_TRACKER.md` must be reconciled.
- Known open issues must carry into UX/TRS/Architecture.
- Existing approval does not authorize implementation handover by itself.

---

## 2. Scope In

This wave includes:

1. Creating/backfilling Stage 2 UX Workflow & Wiring Spec at:
   - `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`
2. Creating an open-issues carry-forward register at:
   - `modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md`
3. Reconciling `modules/isms/BUILD_PROGRESS_TRACKER.md` to reflect:
   - Stage 1 App Description approved with conditions;
   - Stage 2 UX Workflow & Wiring Spec created and approved with conditions;
   - Stage 3 FRS approved with conditions;
   - Stage 4 TRS as next canonical stage;
   - implementation not yet authorized.
4. Filing QP, ECAP, IAA, and sign-off artifacts for this alignment wave.

---

## 3. Scope Out

This wave does not:

- implement application code;
- modify legacy source files;
- create TRS;
- approve implementation handover;
- resolve all open design issues;
- define module-internal workflows owned by MMM, PIT, Risk, Incident, RADAM, Skills, or Data/Remote Assurance.

---

## 4. Authority Loaded

- `FOREMAN_OPERATING_MODEL.md`
- `modules/isms/00-app-description/ISMS_app_description.md` v1.2.0
- `modules/isms/02-frs/functional-requirements.md` v0.1.0
- `.agent-admin/signoffs/isms-app-description-v1.2.0-ai-cs2-proxy-signoff-20260529.md`
- `.agent-admin/signoffs/isms-frs-v0.1.0-ai-cs2-proxy-signoff-20260529.md`
- `modules/isms/BUILD_PROGRESS_TRACKER.md`
- `modules/isms/discovery-report/isms-public-landing-harvest-discovery-report.md`
- `modules/isms/prebuild-harvest-package/`

---

## 5. Acceptance Criteria

This wave is complete when:

- Stage-number mismatch is explicitly reconciled to local canon;
- UX Workflow & Wiring Spec exists;
- open issues are carried forward into a governed register;
- tracker is updated;
- QP, ECAP, IAA, and sign-off artifacts are filed;
- next stage is clearly identified as Stage 4 TRS under repo canon;
- implementation handover remains blocked until later gates are satisfied or waived.
