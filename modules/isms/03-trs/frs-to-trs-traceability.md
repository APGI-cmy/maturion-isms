# ISMS — FRS-to-TRS Traceability Matrix

| Field | Value |
|---|---|
| Product | ISMS — Integrated Security Management System |
| Artifact Type | FRS-to-TRS Traceability Matrix |
| Status | DRAFT — For review |
| Version | v0.1.0 |
| Date | 2026-05-29 |
| FRS Source | `modules/isms/02-frs/functional-requirements.md` v0.1.0 |
| TRS Source | `modules/isms/03-trs/technical-requirements-specification.md` v0.1.0 |

---

## 1. Purpose

This matrix confirms that each ISMS functional requirement has corresponding technical requirement coverage in the Stage 4 TRS.

---

## 2. Traceability Matrix

| FRS ID | FRS Title | TRS Coverage | Coverage Status |
|---|---|---|---|
| FR-ISMS-001 | ISMS platform identity and front-door authority | TR-ISMS-001, TR-ISMS-006, TR-ISMS-015 | Covered |
| FR-ISMS-002 | Public landing page | TR-ISMS-002, TR-ISMS-003, TR-ISMS-006, TR-ISMS-025 | Covered |
| FR-ISMS-003 | Module discovery card set | TR-ISMS-006 | Covered |
| FR-ISMS-004 | Module card content contract | TR-ISMS-006, TR-ISMS-007 | Covered |
| FR-ISMS-005 | Public module marketing routes | TR-ISMS-003, TR-ISMS-005, TR-ISMS-007, TR-ISMS-025 | Covered |
| FR-ISMS-006 | Public journey / house-model learning page | TR-ISMS-002, TR-ISMS-003, TR-ISMS-025 | Covered |
| FR-ISMS-007 | Public free assessment | TR-ISMS-003, TR-ISMS-008, TR-ISMS-009, TR-ISMS-025 | Covered |
| FR-ISMS-008 | Subscription page | TR-ISMS-010, TR-ISMS-014 | Covered |
| FR-ISMS-009 | Checkout flow | TR-ISMS-011, TR-ISMS-020 | Covered |
| FR-ISMS-010 | Sign-up/auth entry | TR-ISMS-003, TR-ISMS-004, TR-ISMS-011, TR-ISMS-012 | Covered |
| FR-ISMS-011 | Get-to-know-you onboarding | TR-ISMS-012, TR-ISMS-013 | Covered |
| FR-ISMS-012 | Shared context envelope | TR-ISMS-013, TR-ISMS-015, TR-ISMS-018 | Covered |
| FR-ISMS-013 | Public/private route boundaries | TR-ISMS-003, TR-ISMS-004, TR-ISMS-025 | Covered |
| FR-ISMS-014 | Legacy route redirects | TR-ISMS-005, TR-ISMS-025 | Covered |
| FR-ISMS-015 | Subscribed module workspace entry | TR-ISMS-014, TR-ISMS-015, TR-ISMS-016, TR-ISMS-019 | Covered |
| FR-ISMS-016 | Unsubscribed module learning/upsell loop | TR-ISMS-014, TR-ISMS-010, TR-ISMS-011 | Covered |
| FR-ISMS-017 | MMM identity boundary | TR-ISMS-006, TR-ISMS-016 | Covered |
| FR-ISMS-018 | Non-MMM module practical exercise extensibility | TR-ISMS-006, TR-ISMS-007 | Covered |
| FR-ISMS-019 | Ask Maturion shared affordance | TR-ISMS-017, TR-ISMS-018 | Covered |
| FR-ISMS-020 | Auditability of material actions and handoffs | TR-ISMS-019, TR-ISMS-020 | Covered |
| FR-ISMS-021 | Module handoff contract | TR-ISMS-015, TR-ISMS-016, TR-ISMS-019 | Covered |
| FR-ISMS-022 | Legacy harvest discipline | TR-ISMS-003, TR-ISMS-005, TR-ISMS-025 | Covered |
| FR-ISMS-023 | Known-gap surfacing | TRS Section 13 | Covered |
| FR-ISMS-024 | Public landing fully functional delivery gate | TR-ISMS-024, TR-ISMS-025 | Covered |

---

## 3. Coverage Conclusion

All FRS requirements FR-ISMS-001 through FR-ISMS-024 have Stage 4 TRS coverage.

No orphan FRS requirement remains uncovered in this traceability matrix.

---

## 4. Downstream Note

Stage 5 Architecture must preserve this mapping and show how each TRS item is realized in components, routes, providers, services, schemas, tests, and deployment gates.
