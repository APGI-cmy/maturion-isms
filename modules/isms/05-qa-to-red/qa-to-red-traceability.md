# ISMS Stage 6 — QA-to-Red Traceability

| Field | Value |
|---|---|
| Product | ISMS |
| Artifact | QA-to-Red Traceability |
| Stage | Stage 6 |
| Version | v0.1.0 |
| Status | RED QA traceability complete |

---

## 1. Purpose

This matrix maps Stage 6 QA-to-Red domains to upstream requirements and architecture gaps.

---

## 2. FRS Coverage

| FRS Range | Coverage |
|---|---|
| FR-ISMS-001–004 | D1, D2 |
| FR-ISMS-005–006 | D1, D2 |
| FR-ISMS-007 | D3 |
| FR-ISMS-008–011 | D4 |
| FR-ISMS-012 | D5 |
| FR-ISMS-013–014 | D1, D2 |
| FR-ISMS-015–018 | D5, D2 |
| FR-ISMS-019 | D6 |
| FR-ISMS-020–021 | D5, D9 |
| FR-ISMS-022–024 | D10, D11 |

All FRS requirements FR-ISMS-001 through FR-ISMS-024 are covered.

---

## 3. TRS Coverage

| TRS Range | Coverage |
|---|---|
| TR-ISMS-001–005 | D1, D10 |
| TR-ISMS-006–007 | D2 |
| TR-ISMS-008–009 | D3 |
| TR-ISMS-010–012 | D4 |
| TR-ISMS-013–016 | D5 |
| TR-ISMS-017–018 | D6 |
| TR-ISMS-019–020 | D9 |
| TR-ISMS-021–023 | D7, D8, D10 |
| TR-ISMS-024–025 | D10, D11 |

All TRS requirements TR-ISMS-001 through TR-ISMS-025 are covered.

---

## 4. Architecture Completeness Gap Coverage

| Gap Area | QA Domain |
|---|---|
| Route wiring not implemented/proven | D1, D2 |
| Component inventory target-pattern only | D2, D10 |
| AI capability boundary conceptual | D6 |
| Edge function registry absent | D7 |
| Supabase schema/data model undefined | D8 |
| RLS/tenant isolation undefined | D8 |
| Subscription/payment provider unspecified | D4, D10 |
| Free assessment result flow incomplete | D3 |
| Audit storage undefined | D9 |
| Testing strategy not RED | All domains |
| CI/build gates specified but not run | D10, D11 |
| Full architecture completeness canon gaps | D11 |

---

## 5. Conclusion

Stage 6 QA-to-Red provides RED coverage for the ISMS public landing, module discovery, subscription/onboarding, shared context, module handoff, AI boundary, edge function, Supabase/RLS, audit, deployment, CI, and architecture completeness gaps.

This does not mean the implementation is complete. It means the expected RED suite is now specified.
