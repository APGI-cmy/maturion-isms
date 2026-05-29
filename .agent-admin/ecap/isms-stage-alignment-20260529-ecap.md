# ECAP — ISMS Stage Alignment and UX Backfill

| Field | Value |
|---|---|
| Wave ID | `isms-stage-alignment-20260529` |
| Repository | `APGI-cmy/maturion-isms` |
| Date | 2026-05-29 |
| Foreman | ChatGPT acting as Foreman for ISMS |
| Status | FILED |

---

## 1. Purpose

This ECAP records the governance alignment wave that reconciled the ISMS stage numbering, created the missing Stage 2 UX Workflow & Wiring Spec, updated the tracker, and carried open issues forward.

---

## 2. Trigger

Johan Ras requested alignment of conditions blocking progression after App Description and FRS approval.

---

## 3. Files Created / Updated

Created:

- `.agent-admin/scope-declarations/isms-stage-alignment-20260529.md`
- `.agent-admin/builder-appointments/isms-stage-alignment-20260529-builder-contract.md`
- `modules/isms/01-ux-workflow-wiring-spec/ux-workflow-wiring-spec.md`
- `modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md`
- `.agent-admin/quality/isms-stage-alignment-20260529-foreman-qp.md`
- `.agent-admin/ecap/isms-stage-alignment-20260529-ecap.md`

Updated:

- `modules/isms/BUILD_PROGRESS_TRACKER.md`

---

## 4. Decisions Made

1. Repo canonical stage model preserved:
   - Stage 2 = UX Workflow & Wiring Spec
   - Stage 3 = FRS
   - Stage 4 = TRS
2. Missing UX artifact was backfilled rather than waived.
3. Tracker was reconciled to show Stages 1–3 complete / approved with conditions.
4. Stage 4 TRS is now the next governed stage.
5. Implementation handover remains not authorized.
6. Known open issues were carried into a register rather than resolved silently.

---

## 5. CI / Runtime Evidence

Documentation-only wave.

- Local build: Not run.
- Typecheck: Not run.
- Unit tests: Not run.
- GitHub Actions / CI: Not inspected because no PR was opened in this wave.

Do not report CI as passing.

---

## 6. Open Conditions

See:

```text
modules/isms/01-ux-workflow-wiring-spec/open-issues-carry-forward.md
```

TRS must address, defer, or carry forward each issue.

---

## 7. Next Action

Proceed to Stage 4 TRS:

```text
modules/isms/03-trs/technical-requirements-specification.md
modules/isms/03-trs/frs-to-trs-traceability.md
```

Stage 4 must include open issue disposition and preserve App Description → UX → FRS → TRS traceability.
