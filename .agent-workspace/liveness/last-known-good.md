# Agent Liveness — Last Known Good State

**Path**: `.agent-workspace/liveness/last-known-good.md`
**Version**: 1.0.0
**Last Updated**: 2026-03-17
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This file is the **canonical source of liveness status** for the Maturion ISMS system components.
IAA reads this file at Phase 2 Step 2.3b for all BUILD/AAWP_MAT/ARCHITECTURE PRs.

If a component shows `DEGRADED` status and the PR touches that component's area →
**IAA blocks the verdict until the liveness issue is resolved.**

---

## How to Update This File

- **Who updates**: Foreman, IAA (post-incident), or CS2 directly.
- **When to update**: After any incident, remediation, or health change.
- **Format**: Update the `status` field and `last_checked` for the relevant component.
- **Resolution**: When a DEGRADED component is fixed, update status to `OK` and add an incident note.

---

## Component Liveness Status

| Component | Status | Last Checked | Notes |
|-----------|--------|-------------|-------|
| mat-frontend | OK | 2026-03-17 | Baseline established — no known degradation |
| mat-ai-gateway | OK | 2026-03-17 | Baseline established — no known degradation |
| supabase-migrations | OK | 2026-03-17 | Baseline established — no known degradation |
| supabase-edge-functions | OK | 2026-03-17 | Baseline established — no known degradation |
| supabase-rls-policies | OK | 2026-03-17 | Baseline established — no known degradation |
| mat-api-routes | OK | 2026-03-17 | Baseline established — no known degradation |
| mat-auth-flows | OK | 2026-03-17 | Baseline established — no known degradation |
| mat-audit-log | OK | 2026-03-17 | Baseline established — wave-audit-log-column-fix remediated INC-ALCF-001 |
| mat-criteria-parsing | OK | 2026-03-17 | Baseline established — no known degradation |
| governance-agent-contracts | OK | 2026-03-17 | Baseline established — no known degradation |
| ci-workflows | OK | 2026-03-17 | Baseline established — polc-boundary-gate and agent-contract-audit active |

---

## Status Definitions

| Status | Meaning | IAA Behaviour |
|--------|---------|---------------|
| `OK` | Component is functioning correctly. No known issues. | Proceed normally. |
| `DEGRADED` | Component has a known active failure or partial outage. PRs touching this area should be blocked. | BLOCK verdict for PRs touching this area. Cite component and incident. |
| `UNKNOWN` | Status not assessed. File absent or component not monitored. | IAA proceeds with advisory note. Does not block. Flags for liveness update. |
| `MONITORING` | Component recently remediated — under active observation. | IAA proceeds normally but flags in verdict for awareness. |

---

## Active Incidents

*(None at time of baseline establishment — 2026-03-17)*

When an incident is opened, add it here:

```
### INC-[ID] — [Component] — [Short description]
**Opened**: [date]
**Component**: [component name from status table]
**Status**: OPEN / RESOLVED
**Description**: [what is failing and how it was detected]
**Resolution**: [what was done to fix — fill in when resolved]
**Closed**: [date when status returns to OK]
```

---

## Incident History

| Incident ID | Component | Date Opened | Date Closed | Summary |
|------------|-----------|------------|------------|---------|
| INC-ALCF-001 | mat-audit-log | 2026-03-08 | 2026-03-08 | audit_logs INSERT/SELECT column mismatch (user_id, resource_type, resource_id non-existent); organisation_id NOT NULL omitted; silent try/catch masked failures — fixed in wave-audit-log-column-fix |

---

## IAA Reading Protocol (Phase 2 Step 2.3b)

When IAA reads this file:

1. **Identify touched components**: From the PR diff, determine which component areas are modified.
2. **Map to status table**: Look up each touched component in the table above.
3. **Apply blocking rule**:
   - `OK` or `MONITORING` → proceed
   - `DEGRADED` → **block verdict**, output component name and incident reference
   - `UNKNOWN` (file absent or component not in table) → proceed with advisory note
4. **Output**:

```
Liveness signal read from .agent-workspace/liveness/last-known-good.md
Components touched by this PR: [list]
Status:
  [component-1]: OK ✅
  [component-2]: DEGRADED ❌ — [incident reference]
Liveness verdict: [CLEAR TO PROCEED / BLOCKED — resolve [component] before verdict]
```

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Read by**: IAA Phase 2 Step 2.3b
**Governed by**: IAA contract v2.3.0 §Step 2.3b
