# MMM Capabilities Directory — Legacy Sub-Folder Index

**Artifact Type**: Architecture Stage Disposition Record (Secondary Artifact)
**Module**: MMM — Maturity Model Management
**Stage**: 5 — Architecture
**Date**: 2026-04-14
**Authority**: mat-specialist (delegated by foreman-v2-agent v6.2.0 / CS2)
**Issue**: maturion-isms#1378 (MMM Stage 5 wave-start authorization)
**OQ-002 Resolution Reference**: `modules/MMM/04-architecture/architecture.md` §A11
**OQ-003 Resolution Reference**: `modules/MMM/04-architecture/architecture.md` §A12

---

## Purpose

This index documents the disposition of all sub-folders in the
`modules/MMM/04-architecture/capabilities/` directory. It records the outcome of the
OQ-002 component audit and the OQ-003 duplication audit performed during the MMM Stage 5
Architecture wave.

---

## Sub-Folder Disposition Table

| Sub-Folder | Module Origin | Content Type | Disposition | MMM Architecture Relevance |
|-----------|--------------|-------------|-------------|---------------------------|
| `erm-framework/` | ERM (Enterprise Risk Management) module migration | ERM database schema, edge functions, component maps, sprint plans, wireframes, export spec | **TRACEABILITY-ONLY** | None — ERM risk management artifacts are not MMM maturity management artifacts |
| `risk-assessment/` | ERM module migration | Risk assessment schema, edge functions, component maps, sprint plans, wireframes | **TRACEABILITY-ONLY** | None — Risk assessment lifecycle is not maturity assessment lifecycle |
| `threat-module/` | ERM module migration | Threat module schema, edge functions, component maps, routing spec, integration map | **TRACEABILITY-ONLY** | None — Threat management belongs to PIT domain, not MMM |
| `vulnerability-module/` | ERM module migration | Vulnerability module schema, edge functions, component maps | **TRACEABILITY-ONLY** | None — Vulnerability management is not maturity management |
| `wrac/` | ERM/WRAC module migration | Weighted Risk Assessment and Control artifacts | **TRACEABILITY-ONLY** | None — WRAC is a risk domain, not the maturity domain |

---

## Governance Rules for This Directory

1. **Files in these sub-folders MUST NOT be referenced** by any MMM builder, QA agent,
   or downstream specification (Stage 6 through Stage 12) as implementation references.

2. **No MMM builder may adopt** any schema column, component pattern, Edge Function design,
   or routing structure from these ERM/WRAC artifacts.

3. **Files are retained for historical traceability** only. They will not be deleted.
   Their source-state is `TRACEABILITY_ONLY` (no live execution, no live reference).

4. **No switchover gate obligations apply** to these files. They were never MMM capabilities;
   they are prior-module migration artifacts with no MMM functional equivalent.

5. **MMM is built fresh** from `modules/MMM/02-frs/functional-requirements.md` and
   `modules/MMM/03-trs/technical-requirements-specification.md` specifications only.

---

## OQ-002 Summary

**Question**: Has a component audit of the legacy UI assets been performed? Which components
are design-system-compatible and ready for Shared Platform harvesting?

**Answer**: Audit complete. The sub-folders in this directory are ERM/WRAC artifacts with
no design-system overlap with the MMM maturity management domain. None are candidates for
Shared Platform harvesting into the MMM context. MMM UI components are to be built fresh.

**Status**: ✅ RESOLVED (Stage 5 Architecture, 2026-04-14)

---

## OQ-003 Summary

**Question**: Has a full duplication audit of legacy vs Roadmap/MAT capabilities been
completed? Which legacy components are confirmed duplicates for retirement?

**Answer**: Audit complete. None of the ERM/WRAC sub-folder files constitute duplicates
of MAT or Roadmap maturity capabilities. They are risk management artifacts from a
different domain. No LG-05 retirement applies to these files.

Active duplication candidates (Roadmap/MAT capabilities superseded by MMM) are documented
in `modules/MMM/04-architecture/architecture.md` §A12 and remain `ACTIVE_SOURCE` pending
MMM build and switchover gate completion.

**Status**: ✅ RESOLVED (Stage 5 Architecture, 2026-04-14)

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Wave**: mmm-stage5-architecture-20260414
**Next update**: When any sub-folder changes disposition (requires CS2 authorization)
