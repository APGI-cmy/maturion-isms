# Commissioning and registration method

Version: 1.1.0. Effective date: 2026-11-26.

Current authority: issue #2075, represented locally by `governance/commissioning-authority.json`. Preserve the earlier preparation authority unchanged. Authority to perform commissioning is distinct from evidence that commissioning succeeded.

## Separate identities

| Layer | Identifier | Meaning |
| --- | --- | --- |
| Governance specialist | `course-creator-agent` | Three-tier scoped course-creation specialist contract |
| Proposed AIMC runtime persona | `course-creator-advisor` | Generic Course Creator persona, module `course-creator`, capability `document-generation` |
| Reporting orchestrator | `maturion-agent` | Maturion identity/authority; actual runtime adapter must authenticate its accepted principal mapping |
| Legacy persona | `course-crafter-advisor` | Existing ISMS-specific persona; remains unchanged and is not silently repurposed |

A governance registry entry, Markdown persona, or prompt identity is not an active authenticated route. The registration owner must bind accepted governance and runtime identities, provider/model policy, tenant/role context, the controller adapter and the Maturion review path. Do not fabricate an active parent to satisfy a reference.

## Distinct gates

1. `scripts/validate_bundle.py` is local authoring/producer verification: file integrity, structure and declared interface fixtures. It is not runtime authentication or independent assurance.
2. `scripts/runtime_preflight.py` is the commissioned runtime gate, supplied by the separately appointed implementation owner. It must validate actual integrity/authority/registry/routing/dependency and independent-assurance receipts, return a typed outcome, and fail closed when any required proof is absent or invalid.
3. Independent IAA reviews the stable corrected submission without producer authorship. It cannot be replaced by either local script or this agent's self-review.
4. Actual activation occurs only after accepted registration/routing and bounded commissioning evidence. State pointers and later receipts are outside the stable reviewed content identity; they cannot silently change its bytes.

## Role ownership

The factory author owns this target contract and operational bundle. The implementation owner supplies executable adapter/preflight behaviour. The existing course controller retains all producer/researcher/reviewer invocation, locks, budgets, rendered artifacts and QA/owner gates. The specialist never delegates laterally. Maturion reviews the returned evidence and owns the final user-facing response.

Missing runtime components return UNAVAILABLE or DEGRADED with an exact dependency and owner. Do not substitute a new direct provider or mark a static proposal active. Commission with isolated fixtures; preserve QA, current held course lineages and LU2.
