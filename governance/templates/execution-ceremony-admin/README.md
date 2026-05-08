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

## Manifest-Era PR Routing

**Authority**: `governance/canon/MMM_SIMPLE_PR_ADMIN_MODEL.md` v1.2.0

Starting with the MMM simplified governance model, PRs use `.admin/pr.json` as the single source of truth for all metadata. Ceremony templates must only be generated for PRs that require them.

| PR Type | `requires_iaa` | `requires_ecap` | Ceremony Required |
|---------|---------------|----------------|------------------|
| `product-fix` / `test-only` | `false` | `false` | **None** — legacy ceremony frozen. Use `.admin/pr.json` only. |
| `product-fix` crossing governance-control paths | auto-`true` | auto-`true` | **Full ceremony** — governance-control scope overrides type default. |
| `deployment-change` | depends on manifest | `false` | Partial — per manifest `evidence_required`. |
| `governance-change` / `agent-contract-change` | `true` | `true` | **Full ceremony** — all templates apply. |

**Governance-control paths** (any PR touching these requires full ceremony regardless of `type`):
- `.github/workflows/**`, `.github/scripts/**`, `.github/agents/**`
- `governance/**` (all sub-paths)
- `.agent-admin/**`
- Any `*.agent.md` file

**Do NOT generate ceremony templates for low-ceremony product-fix PRs.** Agents should not be instructed to produce `PREHANDOVER.template.md`, `ECAP_RECONCILIATION_SUMMARY.template.md`, or session memory artifacts for MMM `product-fix` PRs where `requires_iaa=false`.

---

## Evidence discipline (remains mandatory)

Simplification does not erase evidence discipline. For all governed PRs:
- The `evidence_required` array in `.admin/pr.json` is the binding evidence specification.
- For PRs with `requires_iaa=true`, evidence is validated by IAA before merge.
- For low-ceremony product-fix PRs, evidence is declared in the manifest and validated by the CI gate only.
- CI is **confirmatory** — it confirms evidence already collected. It does not replace agent evidence collection.

---

## Scope declarations

Per-PR scope declarations are immutable files at `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md`.

The global `governance/scope-declaration.md` is **deprecated** for per-PR use. Do not reference it as an authoritative scope source in any ceremony artifact. Use `.agent-admin/scope-declarations/pr-<PR_NUMBER>.md` instead.

---

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

*Version: 1.1.0 | Effective: 2026-05-07 | Authority: CS2 (Johan Ras) | Aligned with MMM_SIMPLE_PR_ADMIN_MODEL.md v1.2.0*
