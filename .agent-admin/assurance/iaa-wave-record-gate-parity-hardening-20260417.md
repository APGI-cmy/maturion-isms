# IAA Wave Record — gate-parity-hardening-wave-#1402

**Wave**: gate-parity-hardening-wave-#1402
**Date**: 2026-04-17
**Authorization**: CS2 Issue #1402 — "Harden gate-parity ownership and pre-handover gate enforcement across ECAP / Foreman / IAA / CodexAdvisor"
**Producing Agent**: CodexAdvisor-agent (session-061-20260417)
**IAA Session**: session-gate-parity-hardening-20260417

---

## PRE-BRIEF

*No formal pre-brief invocation was submitted for this wave. Wave record created at assurance time.*

Qualifying tasks: gate-parity-hardening — 4 agent contract updates (foreman-v2-agent, execution-ceremony-admin-agent, independent-assurance-agent, CodexAdvisor-agent) + anti-patterns checklist + CI workflow
Applicable overlay: AGENT_CONTRACT (primary/most restrictive)
Anti-regression obligations: yes — A-023 (ripple assessment), A-029b (carry-forward mandate), OVL-AC-002 (no contradictions)

---

## TOKEN

*No ASSURANCE-TOKEN issued for this wave — see REJECTION_HISTORY below.*

---

## REJECTION_HISTORY

### Entry 1 — 2026-04-17 | IAA session-gate-parity-hardening-20260417

**IAA Session**: session-gate-parity-hardening-20260417
**PR**: gate-parity-hardening-wave-#1402 (session-061-20260417)
**Verdict**: REJECTION-PACKAGE
**Adoption Phase**: PHASE_B_BLOCKING — hard-blocking

**Findings:**

**FINDING-1 — A-023 / AC-05 / OVL-AC-007 (Systemic)**
- Finding: PREHANDOVER proof `.agent-workspace/CodexAdvisor-agent/memory/PREHANDOVER-session-061-20260417.md` is missing the mandatory `## Ripple/Cross-Agent Assessment` section required by FAIL-ONLY-ONCE A-023 and OVL-AC-007.
- Fix required: Create new PREHANDOVER proof for re-invocation with explicit ripple assessment section addressing ACR-09/10/11 implications, `gate_set_checked` field template propagation, and `sole_authority` AGCFPP-001 impact. Update CodexAdvisor PREHANDOVER template to include ripple assessment as mandatory non-blank field.

**FINDING-2 — OVL-AC-002 / A-029b CFM-FFA-05 (Substantive)**
- Finding: CodexAdvisor contract (v3.5.0) `iaa_oversight.advisory_phase: PHASE_A_ADVISORY` contradicts/creates ambiguity against IAA contract `capabilities.adoption_phase.current: PHASE_B_BLOCKING`. Demonstrated confusion in CodexAdvisor session memory. No tracked CS2 exception or blocking issue referenced. A-029b prohibits pre-existing dismissal.
- Fix required: Update `iaa_oversight.advisory_phase` to `PHASE_B_BLOCKING` OR rename field to remove ambiguity, OR reference a tracked blocking issue, OR obtain CS2 written exception.

**Non-blocking noted (CI-delegated):**
- CodexAdvisor YAML `secret: MATURION_BOT_TOKEN` should be `secret_env_var:` per A-024/CORE-022. CI-delegated per IAA Phase 3.2. Recommend fixing proactively.

**Re-invocation required**: YES — CodexAdvisor must resolve all blocking findings, commit a new PREHANDOVER proof, and re-invoke IAA.
