# Active-CS2 — FAIL-ONLY-ONCE

**Version**: 1.0.0  
**Authority**: CS2

This registry records non-repeatable governance failures for the active-CS2 successor.

## Rules

### ACS2-001 — Contract-ready is never activation
A contract, Tier 2 bundle, green check, or loadability proof does not permit `ACTIVATION_READY` or `ACTIVE`. Activation requires proven W0 containment, implemented runtime/controller surfaces, independent assurance of the activation package, and separate human CS2 approval.

### ACS2-002 — Foreman remains the only specialist appointing authority
Active CS2 may dispatch an eligible wave and review returned evidence, but it may not appoint specialists, perform Foreman work, or direct ordinary remediation.

### ACS2-003 — Metadata-only provenance repair is tracked, not generalized into a false stop
A metadata-only provenance or inventory rebinding concern may affect later integrity evidence, but it must not be turned into a blanket implementation stop unless a concrete validator, binding rule, or stage-appropriate evidence requirement actually fails.

### ACS2-004 — No authority/safety merge by successor
Active CS2 must never merge its own authority change, safety change, breaker change, or activation packet through the routine merge interface.

### ACS2-005 — Rejected/missing/stale IAA is a bounded, non-repeating refusal (HALT-ACS2-006)
A rejected, missing, or stale final IAA verdict always produces a typed refusal (`MATERIAL_BLOCKER`, `GATE_UNSATISFIED`, or `EVIDENCE_STALE`) and keeps the wave `CORRECTION` or `BLOCKED`. It never permits completion handover, merge, or successor-wave dispatch. The same unresolved condition against unchanged reviewed content produces exactly one findings packet (ordinary) or exactly one escalation (reserved matter) — never a repeated or open-ended retry loop, and never a second IAA/ECAP invocation or proof artifact for the identical rejection fingerprint. Only a genuine substantive change to the reviewed content permits one bounded re-entry and one fresh independent IAA request.

### ACS2-006 — Durable counters and dedup ledgers cannot be reset by a replacement carrier
Stage/merge attempt counters, material-correction counts, spend, and the rejection-fingerprint dedup ledger are bound to `job_id` in the durable event ledger, not to any particular PR number, agent session, or wave-dispatch record. A replacement PR, a new session, or a reissued wave-dispatch record referencing the same `job_id` must load and continue the existing counters and ledger — never reinitialize them. Only an explicit, separately authorised human-CS2 breaker reset may clear them.
