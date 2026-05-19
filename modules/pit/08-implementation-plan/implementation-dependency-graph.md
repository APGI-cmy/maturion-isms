# PIT Stage 8 — Implementation Dependency Graph

> Sequencing contract for builder execution planning. This graph defines mandatory ordering dependencies and why they exist.

## Dependency edges (required)

- **W8.1 -> W8.2**: role-aware protected routing and auth baseline precede secure access enforcement.
- **W8.2 -> W8.5**: evidence approvals and audit visibility require RLS/access controls first.
- **W8.2 -> W8.8**: report generation/history permissions rely on role-scoped access model.
- **W8.2 -> W8.7**: QA dashboard visibility and permission-negative payload isolation depend on access controls.
- **W8.3 -> W8.6**: timeline requires hierarchy entities and date-bearing tasks to exist first.
- **W8.3 -> W8.7**: roll-up/watchdog logic depends on hierarchy + lifecycle data model.
- **W8.4 -> W8.8**: notification/report communication flows depend on assignment and invitation lifecycle.
- **W8.5 -> W8.8**: report/audit exports depend on evidence/audit event contracts.
- **W8.5 -> W8.10**: LFV evidence package requires prior evidence/audit pipeline.
- **W8.6 -> W8.7**: schedule-dependent roll-up and exception detection require timeline date integrity.
- **W8.7 -> W8.10**: QA dashboard/executive visibility checks must be in place before LFV closure.
- **W8.8 -> W8.10**: reporting/notification smoke evidence required before final LFV readiness.
- **W8.9 -> W8.10**: AIMC-only enforcement proof must be present before LFV package closure.
- **W8.1..W8.9 -> W8.10**: W8.10 depends on runtime smoke/evidence from all prior waves.

## Simplified topological order

1. W8.1 Foundation (auth/router/shell)
2. W8.2 Access/RLS baseline
3. W8.3 Hierarchy core
4. W8.4 Assignment and distributed accountability loop
5. W8.5 Evidence/Audit
6. W8.6 Timeline engine
7. W8.7 Roll-up/Watchdog/QA visibility
8. W8.8 Reporting/Notifications/export
9. W8.9 AIMC-only AI touchpoints
10. W8.10 LFV/deployment smoke and anti-regression closure

## Build-gate implications

- If any upstream dependency wave is incomplete, dependent wave closure must be rejected.
- Stage 8 hardening does not authorize implementation start; this graph is preparatory contract evidence only.
