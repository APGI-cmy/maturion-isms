# ECAP Implementation Wave — Workstreams C/D Orchestration

**Status**: OUTSTANDING — follow-up required after PR #1396  
**Authority**: CS2 (@APGI-cmy) correction on PR #1396 review  
**Triggered by**: Session 066 (governance-liaison-isms) — Tier 2 artifact layer-down  
**Issue**: #1394  
**Date**: 2026-04-17  

---

## Context

PR #1396 delivered Workstreams A and B of the ECAP implementation wave authorized on issue #1394:

- **Workstream A (complete)**: CI ripple PR #1395 synced 4 PUBLIC_API canon files from governance commit `56d92004`
- **Workstream B (complete)**: PR #1396 layered down 7 templates + 3 checklists + updated GOVERNANCE_ALIGNMENT_INVENTORY.json

Workstreams C and D were NOT delivered by PR #1396. They require CS2 → CodexAdvisor-agent pathway and are captured here for explicit follow-up orchestration.

---

## Workstream C — Agent Contract Hardening

**Goal**: Reflect the new admin-ceremony stack in live agent contracts so ECAP, Foreman QP, and IAA agents actually run the hardened ceremony path.

**Required changes** (agent contract files in `.github/agents/`):

### C1 — `execution-ceremony-admin-agent.md`
- Reference new `governance/checklists/execution-ceremony-admin-checklist.md` as mandatory output
- Reference `governance/checklists/execution-ceremony-admin-reconciliation-matrix.md` R01–R17
- Reference `governance/checklists/execution-ceremony-admin-anti-patterns.md` AAP-01–AAP-14
- Update Tier 2 knowledge section to include 3 new checklist files and 7 new template files
- Gate on `governance/templates/execution-ceremony-admin/ECAP_RECONCILIATION_SUMMARY.template.md` usage for all reconciliation outputs
- Enforce §4.3e Admin Ceremony Compliance Gate (from AGENT_HANDOVER_AUTOMATION.md v1.4.1)
- Enforce AAP-01–09 auto-fail rules

### C2 — `foreman-v2-agent.md`
- Add §14.6 Foreman QP Admin-Compliance Checkpoint to Phase 4 handover review
- Reference `governance/templates/execution-ceremony-admin/FOREMAN_ADMIN_READINESS_HANDBACK.template.md` as required output artifact
- Gate on ECAP reconciliation summary before merge approval on ECAP-involved jobs

### C3 — `independent-assurance-agent.md`
- Add ACR-01–08 admin-ceremony rejection triggers (from INDEPENDENT_ASSURANCE_AGENT_CANON.md v1.6.0)
- Update ACR table to include ceremony checklist compliance as a hard gate
- Require ECAP reconciliation summary in Tier 3 proof bundle for ECAP-involved sessions

**Escalation path**: CS2 (@APGI-cmy) → CodexAdvisor-agent (per A-015, PROHIB-002)  
**Blocking**: governance-liaison cannot touch `.github/agents/*.md`

---

## Workstream D — CI Workflow Hardening

**Goal**: Stop recurrence of the CI automation gap that caused the 7-file/3-file layer-down miss in the first place.

**Required changes**:

### D1 — `ripple-integration.yml` extension
- Extend glob patterns to include `governance/templates/**` and `governance/checklists/**`
- Current automation only syncs `governance/canon/**` files — template and checklist files are excluded
- Root cause of gap: CI automation delivered 4/11 files from commit `56d92004`

### D2 — `GOVERNANCE_ALIGNMENT_INVENTORY.json` automation
- Automate SHA256 hash computation and inventory update in ripple-integration.yml
- Eliminates recurring manual update sessions (each ripple currently requires a manual governance-liaison session)

**Escalation path**: Any agent with `.github/workflows/*.yml` write authority  
**Suggested agent**: governance-liaison or api-builder (CI workflow changes)

---

## Workstream E — Proof-of-Operation (Mandatory)

**Goal**: Demonstrate the hardened 3-layer admin-control stack running end-to-end on a real PR in `maturion-isms`.

**Required proof** (per CS2 correction on PR #1396):

A real PR must complete the following on its ceremony path:
1. **ECAP normalization** — execution-ceremony-admin-agent produces full reconciliation summary using `ECAP_RECONCILIATION_SUMMARY.template.md` (C1–C5 blocks all present, R01–R17 all verified, no AAP violations)
2. **Foreman QP §14.6 checkpoint** — foreman-v2-agent produces `FOREMAN_ADMIN_READINESS_HANDBACK.template.md` output as part of Phase 4 review
3. **IAA final review under new ACR regime** — independent-assurance-agent applies ACR-01–08 triggers, confirms no admin-ceremony auto-fail, issues ASSURANCE-TOKEN

**Gate**: Issue #1394 CANNOT be closed until this proof exists on an identified PR.

---

## Closure Conditions for Issue #1394

| Condition | Status |
|---|---|
| Workstream A — PR #1395 CI canon sync | ✅ COMPLETE |
| Workstream B — PR #1396 Tier 2 layer-down | ✅ COMPLETE |
| Workstream C — Agent contract hardening (C1/C2/C3) | ❌ OUTSTANDING |
| Workstream D — CI workflow hardening (D1/D2) | ❌ OUTSTANDING |
| Workstream E — Proof-of-operation PR | ❌ OUTSTANDING |

**Issue #1394 closure**: BLOCKED on C, D, and E

---

## Next Steps

1. CS2 (@APGI-cmy) to authorize CodexAdvisor-agent for Workstream C (agent contract hardening)
2. CodexAdvisor-agent to execute C1, C2, C3 contract updates
3. Assign Workstream D to governance-liaison or workflow-capable agent
4. After C and D are complete: execute a real ceremony on the next substantive PR using the hardened stack
5. That PR's ceremony output constitutes the proof-of-operation for Workstream E
6. Only after E is verified: close issue #1394
