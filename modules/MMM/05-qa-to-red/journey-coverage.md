# MMM Stage 6 — Journey Coverage Map

**Module**: MMM — Maturity Model Management
**Artifact**: Journey Coverage Map (Stage 6)
**Version**: 0.1.0
**Date**: 2026-04-15
**Wave**: mmm-stage6-qa-to-red-20260415
**Issue**: maturion-isms#1384
**Produced By**: qa-builder (delegated by foreman-v2-agent v6.2.0)
**Status**: RED — Coverage defined; no tests pass until implementation satisfies them.

---

## Overview

This document maps all 17 MMM user journeys (J-01 through J-17) to test IDs in the
QA-to-Red catalog. Every journey must have at least one test ID in each coverage category.
Coverage column meanings:

- **FULL** — All journey steps covered by dedicated tests
- **PRIMARY** — All primary happy-path steps covered; edge cases in cross-cutting tests
- **CROSS-CUTTING** — Journey is cross-cutting (e.g., AI, Roles); all dimensions covered across multiple domains

---

## Journey Coverage Table

| Journey ID | Journey Name | Primary FR Sources | Test IDs | Coverage | Notes |
|---|---|---|---|---|---|
| J-01 | Landing & Attraction | FR-006 | T-MMM-S6-001, T-MMM-S6-002, T-MMM-S6-003 | FULL | All three landing page entry points covered |
| J-02 | Free Assessment | FR-007, FR-008 | T-MMM-S6-004, T-MMM-S6-005, T-MMM-S6-006, T-MMM-S6-007, T-MMM-S6-008, T-MMM-S6-020 | FULL | Collect, score, display, prompt, lock, persist |
| J-03 | Subscription & Sign-Up | FR-010 | T-MMM-S6-008, T-MMM-S6-012, T-MMM-S6-013 | FULL | Plan selection, registration, records created |
| J-04 | Organisation Onboarding | FR-009, FR-011 | T-MMM-S6-009, T-MMM-S6-010, T-MMM-S6-011, T-MMM-S6-014, T-MMM-S6-015 | FULL | Mandatory fields, flag, maturity context, baseline gate |
| J-05 | Framework-Origin Fork | FR-012, FR-028 | T-MMM-S6-016, T-MMM-S6-017, T-MMM-S6-018, T-MMM-S6-019, T-MMM-S6-047 | FULL | Fork display, mode recording, both pathways, no hybrid |
| J-06 | Verbatim Upload (Mode A) | FR-013–FR-016, FR-020, FR-021, FR-056 | T-MMM-S6-021, T-MMM-S6-022, T-MMM-S6-023, T-MMM-S6-024, T-MMM-S6-025, T-MMM-S6-026, T-MMM-S6-027, T-MMM-S6-032, T-MMM-S6-033, T-MMM-S6-034, T-MMM-S6-035, T-MMM-S6-048, T-MMM-S6-050, T-MMM-S6-103 | FULL | Upload infra, classification, pipeline separation, parse, ambiguities, anchors |
| J-07 | New Criteria Creation (Mode B) | FR-017–FR-019, FR-022–FR-024 | T-MMM-S6-028, T-MMM-S6-029, T-MMM-S6-030, T-MMM-S6-031, T-MMM-S6-036, T-MMM-S6-037, T-MMM-S6-038, T-MMM-S6-039 | FULL | Hierarchy, numbering, canonical domains, AI generate, level descriptors, alter mechanism, intent statements |
| J-08 | Framework Review & Approval | FR-025, FR-026 | T-MMM-S6-040, T-MMM-S6-041, T-MMM-S6-042, T-MMM-S6-043, T-MMM-S6-044 | FULL | Criteria card, L1/L2/L3 approval, comments |
| J-09 | Publication & Activation | FR-027, FR-028 | T-MMM-S6-045, T-MMM-S6-046, T-MMM-S6-047, T-MMM-S6-091 | FULL | Six capabilities activated, publications record, dashboard activated |
| J-10 | Criterion Drill-Down & Evidence | FR-029–FR-040, FR-057 | T-MMM-S6-040, T-MMM-S6-049, T-MMM-S6-051, T-MMM-S6-052, T-MMM-S6-053, T-MMM-S6-054, T-MMM-S6-055, T-MMM-S6-056, T-MMM-S6-057, T-MMM-S6-058, T-MMM-S6-059, T-MMM-S6-060, T-MMM-S6-061, T-MMM-S6-062, T-MMM-S6-063, T-MMM-S6-064, T-MMM-S6-065, T-MMM-S6-066, T-MMM-S6-067, T-MMM-S6-068, T-MMM-S6-069, T-MMM-S6-070, T-MMM-S6-078, T-MMM-S6-104 | FULL | Drill-down navigation, evidence workspace, all types, decision flow, staleness, override, scoring cascade |
| J-11 | Audit Workbench / Walkabout | FR-041–FR-043 | T-MMM-S6-071, T-MMM-S6-072, T-MMM-S6-073, T-MMM-S6-074, T-MMM-S6-075, T-MMM-S6-076, T-MMM-S6-077, T-MMM-S6-079 | FULL | Workbench access, session lifecycle, queue-sync, no MAT branding, auditor flow, capture types, load performance |
| J-12 | Findings & Recommendations | FR-044–FR-046 | T-MMM-S6-081, T-MMM-S6-082, T-MMM-S6-083 | FULL | Findings nine fields, shared model, output fork |
| J-13 | Output Fork — Report | FR-047, FR-048 | T-MMM-S6-083, T-MMM-S6-084, T-MMM-S6-085, T-MMM-S6-086, T-MMM-S6-087 | FULL | Fork display, nine elements, export format, config reuse |
| J-14 | Output Fork — PIT Export | FR-049, FR-054 | T-MMM-S6-083, T-MMM-S6-088, T-MMM-S6-089, T-MMM-S6-090, T-MMM-S6-100, T-MMM-S6-101, T-MMM-S6-109, T-MMM-S6-110, T-MMM-S6-111 | FULL | Eight fields, send trigger, acknowledgment, PIT boundary, schemas |
| J-15 | Live Dashboard | FR-050–FR-052 | T-MMM-S6-091, T-MMM-S6-092, T-MMM-S6-093, T-MMM-S6-094, T-MMM-S6-095, T-MMM-S6-096, T-MMM-S6-097, T-MMM-S6-080, T-MMM-S6-133 | FULL | Activation, nine elements, drill-down, filters, achievement feed, CL-13, wow factor, realtime, render perf |
| J-16 | Roles, Invitations & Permissions | FR-060–FR-062 | T-MMM-S6-113, T-MMM-S6-114, T-MMM-S6-115, T-MMM-S6-116, T-MMM-S6-117, T-MMM-S6-118, T-MMM-S6-119, T-MMM-S6-141, T-MMM-S6-145, T-MMM-S6-146 | FULL | Seven roles, permission boundaries, invitation model, scope enforcement, inheritance, cross-scope deny, RLS |
| J-17 | AI Interactions (Cross-Cutting) | FR-053, FR-063–FR-066 | T-MMM-S6-011, T-MMM-S6-098, T-MMM-S6-099, T-MMM-S6-106, T-MMM-S6-121, T-MMM-S6-122, T-MMM-S6-123, T-MMM-S6-124, T-MMM-S6-125, T-MMM-S6-126, T-MMM-S6-127, T-MMM-S6-128, T-MMM-S6-131, T-MMM-S6-136, T-MMM-S6-137 | FULL | AIMC routing, no direct calls, JWT, data format, timeout, human oversight, confidence, governance logging, admin pane, circuit breaker |

---

## Coverage Summary

| Metric | Count | Total | Percentage |
|--------|-------|-------|------------|
| Journeys covered | 17 | 17 | 100% |
| Journeys with FULL coverage | 17 | 17 | 100% |
| Tests mapped to at least one journey | 158 | 176 | 90% |
| Tests in cross-cutting domains (D8–D11) | 38 | 176 | 22% |

### Notes on Cross-Cutting Test Allocation

Tests in Domains 8–11 (Performance, Security, Infrastructure, Governance) are not
journey-specific but support all 17 journeys:

- **Domain 8 (Performance)**: T-MMM-S6-129 through T-MMM-S6-138 underpin J-01–J-17 by
  ensuring all journey flows meet SLA thresholds.
- **Domain 9 (Security)**: T-MMM-S6-139 through T-MMM-S6-152 protect all journeys via
  authentication, RLS, audit logging, and compliance.
- **Domain 10 (Infrastructure)**: T-MMM-S6-153 through T-MMM-S6-164 ensure all journeys
  operate correctly within the deployment, commissioning, and quality gate framework.
- **Domain 11 (Identity/Governance)**: T-MMM-S6-165 through T-MMM-S6-176 establish the
  foundational governance, versioning, and notification infrastructure for all journeys.

---

## Journey Dependency Coverage

The following test sequences cover the complete journey dependency chain declared in the
UX Wiring Specification §1:

```
J-01 → J-02 → J-03 → J-04 → J-05 ──┬── J-06 ──┐
                                     └── J-07 ──┤
                                                 ├── J-08 → J-09 → J-10 → J-12 ──┬── J-13
                                                 │                  │              └── J-14
                                                 │                  └── J-11
                                                 └── J-15 (post J-09)
J-16: parallel from J-04 onwards
J-17: cross-cutting from J-03 onwards
```

**Entry Chain (J-01 → J-02 → J-03 → J-04 → J-05)**:
T-MMM-S6-001 → T-MMM-S6-004 → T-MMM-S6-012 → T-MMM-S6-014 → T-MMM-S6-016

**Framework Fork — Mode A Branch (J-05 → J-06 → J-08 → J-09)**:
T-MMM-S6-018 → T-MMM-S6-032 → T-MMM-S6-041 → T-MMM-S6-045

**Framework Fork — Mode B Branch (J-05 → J-07 → J-08 → J-09)**:
T-MMM-S6-019 → T-MMM-S6-036 → T-MMM-S6-041 → T-MMM-S6-045

**Evidence and Assessment (J-09 → J-10 → J-12)**:
T-MMM-S6-045 → T-MMM-S6-051 → T-MMM-S6-081

**Output Fork (J-12 → J-13 and J-12 → J-14)**:
T-MMM-S6-083 → T-MMM-S6-084 (Report) | T-MMM-S6-083 → T-MMM-S6-088 (PIT)

**Audit Workbench Branch (J-10 → J-11)**:
T-MMM-S6-068 → T-MMM-S6-071

**Live Dashboard (J-09 → J-15)**:
T-MMM-S6-045 → T-MMM-S6-091

---

*End of MMM Stage 6 — Journey Coverage Map*
*Total journeys: 17/17 covered | Total test IDs mapped: 176*
