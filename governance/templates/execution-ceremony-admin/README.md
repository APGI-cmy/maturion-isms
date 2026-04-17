# Execution Ceremony Admin Templates — README

## Purpose

This directory contains canonical templates for all ceremony artifacts produced by or reviewed at the `execution-ceremony-admin-agent` layer.

These templates minimize freeform authorship and maximize deterministic field completion. Every required field is named; every conditional section is labeled. The templates enforce the closed 3-layer admin-control stack defined in `EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md §4.5`.

---

## Template Index

| Template File | Purpose | Used By |
|--------------|---------|---------|
| `PREHANDOVER.template.md` | PREHANDOVER proof for ECAP-involved jobs | execution-ceremony-admin-agent |
| `SESSION_MEMORY.template.md` | Session memory for ECAP sessions | execution-ceremony-admin-agent |
| `ECAP_RECONCILIATION_SUMMARY.template.md` | Full ECAP reconciliation summary (Tier 3 per-wave proof artifact) | execution-ceremony-admin-agent |
| `SCOPE_DECLARATION.template.md` | `governance/scope-declaration.md` generation | execution-ceremony-admin-agent |
| `CORRECTION_ADDENDUM.template.md` | Administrative correction addendum (when error found in committed artifact) | execution-ceremony-admin-agent |
| `FOREMAN_ADMIN_READINESS_HANDBACK.template.md` | Foreman QP admin-compliance checkpoint output | Foreman |

---

## Usage Rules

1. **Never submit a template with unfilled placeholders.** Every `<placeholder>` and `[bracket value]` must be replaced with a real value before committing.
2. **PREHANDOVER proof is immutable once committed.** Use `CORRECTION_ADDENDUM.template.md` + a new PREHANDOVER proof for any correction cycle.
3. **Session memory is append-only.** Do not edit a committed session memory; create a new one for the next session.
4. **Scope declaration is regenerated as the last committed file before IAA invocation** per ECAP-QC-002.
5. **ECAP_RECONCILIATION_SUMMARY** must be committed before or embedded in the PREHANDOVER proof.
6. **FOREMAN_ADMIN_READINESS_HANDBACK** must be completed and recorded before IAA is invoked.

---

## Tier 3 Per-Wave Proof Requirements

The `ECAP_RECONCILIATION_SUMMARY.template.md` satisfies the Tier 3 per-wave proof requirements defined in the issue:

- **C1**: ECAP Reconciliation Summary — fields: issue, PR, wave, branch, ECAP session, IAA session, token, final-state declaration, ripple status, admin-compliance result.
- **C2**: Artifact Completeness Table — columns: artifact class, required path, present, committed, final-state normalized, notes.
- **C3**: Cross-Artifact Consistency Table — rows: session, token, issue/PR/wave, version, path, status, scope, committed-state.
- **C4**: Ripple Assessment Block — fields: PUBLIC_API changed, layer-down required, registry update required, status, downstream issue/PR.
- **C5**: Foreman Administrative Readiness Block — fields: substantive_readiness, administrative_readiness, QP check completed, IAA authorized.

---

## Authority

- `governance/canon/EXECUTION_CEREMONY_ADMINISTRATION_PROTOCOL.md` v1.1.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.4.0 — §4.3e
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` v1.4.0 — §14.6
- `governance/canon/INDEPENDENT_ASSURANCE_AGENT_CANON.md` v1.6.0 — §Admin-Ceremony Rejection Triggers
- `governance/checklists/execution-ceremony-admin-checklist.md`
- `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md`
- `governance/checklists/execution-ceremony-admin-anti-patterns.md`

---

*Version: 1.0.0 | Effective: 2026-04-17 | Authority: CS2 (Johan Ras)*
