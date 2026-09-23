# Active-CS2 — FAIL-ONLY-ONCE

**Version**: 1.0.0  
**Authority**: issue #2056 / CS2

This registry records non-repeatable governance failures for the active-CS2 successor.

## Rules

### ACS2-001 — Contract-ready is never activation
A contract, Tier 2 bundle, green check, or loadability proof does not permit `ACTIVATION_READY` or `ACTIVE`. Activation requires proven W0 containment, implemented runtime/controller surfaces, independent assurance of the activation package, and separate human CS2 approval.

### ACS2-002 — Foreman remains the only specialist appointing authority
Active CS2 may dispatch an eligible wave and review returned evidence, but it may not appoint specialists, perform Foreman work, or direct ordinary remediation.

### ACS2-003 — Metadata-only provenance repair is tracked, not generalized into a false stop
An open metadata-only provenance repair such as PR #1413 may affect later integrity/evidence rebinding, but it must not be turned into a blanket implementation stop unless a concrete validator or binding rule actually fails.

### ACS2-004 — No authority/safety merge by successor
Active CS2 must never merge its own authority change, safety change, breaker change, or activation packet through the routine merge interface.
