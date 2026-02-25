# FAIL-ONLY-ONCE Registry — schema-builder

**Agent**: schema-builder
**Version**: 1.0.0
**Last Updated**: 2026-02-25
**Authority**: CS2 (Johan Ras / @APGI-cmy)

---

## Purpose

This registry records governance failures that schema-builder must never repeat. Each entry captures a
root cause, the permanent rule that prevents recurrence, and the incident reference.

schema-builder loads this file in Phase 1 on every session start and applies all rules.

---

## Rules

### A-012 — Bootstrap Directive Is Non-Negotiable — Repo Read Before Agent File Is a Preflight Violation

**Triggered by**: CS2 mandate — maturion-isms (2026-02-25): GOV-BREACH-AIMC-W5-002 established
that reading the repository before completing Phase 1 is a critical preflight breach. The
BOOTSTRAP DIRECTIVE codifies this for all agent contracts, including all builder agents.

**Permanent Rule**:
Reading the repository, the issue body, code context, or any other file before reading THIS agent
file and completing Phase 1 is a preflight violation equivalent to GOV-BREACH-AIMC-W5-002.
The BOOTSTRAP DIRECTIVE is non-negotiable. If schema-builder reads any repo file before completing
Phase 1 of its own contract, STOP immediately. Record the preflight skip in session memory.
Complete Phase 1 now before taking any further action.
Ref: GOV-BREACH-AIMC-W5-002, Foreman A-012.

**Check in Phase 1**:
> FAIL-ONLY-ONCE A-012: Before taking any action, confirm that THIS agent file was the FIRST file
> read in this session. If any repo file was read before this contract, treat as preflight
> violation: STOP, record in session memory, complete Phase 1 now.

**Status**: ACTIVE — enforced every session

---

## Adding New Rules

When a new governance failure pattern is identified during a session, add a new entry to this file
following the format above. Each new rule:
- Gets the next sequential ID (A-013, A-014, etc.)
- References the incident that triggered it
- States the permanent rule precisely
- Defines how the rule is checked in the phase steps

All updates to this file must be committed as part of the session bundle for that invocation.

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0
