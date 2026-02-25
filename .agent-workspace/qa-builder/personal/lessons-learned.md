# qa-builder — Lessons Learned (Cumulative)

**Agent**: qa-builder  
**Class**: builder  
**Version**: 6.2.0  
**Last Updated**: 2026-02-25

---

## LL-001 — [LOCKED] Contract Phase Execution is Non-Negotiable (2026-02-25)

**Session**: session-001-20260225  
**Severity**: CRITICAL — constitutional violation  
**Status**: LOCKED-IN LEARNING

### What Happened
In the initial Wave 5 delegation, qa-builder executed its Phase 3 BUILD task (delivering RED-gate test files and types) **without** first reading its agent file or executing:
- Phase 1 PREFLIGHT (identity declaration, CANON_INVENTORY verification, constraint acknowledgement)
- Phase 2 INDUCTION (session memory load, prior-session review, environment health check)
- Phase 4 HANDOVER (PREHANDOVER proof, session memory write, parking station append, IAA invocation)

This violated the explicit prohibition in the agent contract YAML:
> **"No skipping wake-up or session closure protocols"**

And the Phase 2 induction sequence which is classified **B_H** (Constitutional mandate — NEVER defer).

### Root Cause
The agent received a task prompt that described what to build and executed directly against the task without following the four-phase contract sequence. There was no internal gate forcing Phase 1 PREFLIGHT before Phase 3 BUILD.

### Impact
- No CANON_INVENTORY verification was performed before building
- No session memory was loaded (prior context could have been missed)
- No PREHANDOVER proof was generated after build completion
- No IAA invocation was attempted
- Governance evidence chain had a gap for Wave 5

### Correction Applied
On re-delegation, the agent:
1. Read `.github/agents/qa-builder.md` as MANDATORY FIRST ACTION
2. Declared Phase 1 PREFLIGHT (identity, canon check, constraint acknowledgement)
3. Declared Phase 2 INDUCTION (prior sessions = none, first session)
4. Verified 61/61 tests GREEN
5. Created all Phase 4 HANDOVER artifacts (this file, PREHANDOVER proof, session memory, parking station)

### Locked-In Rule
**Every future qa-builder session MUST begin by reading `.github/agents/qa-builder.md` and completing Phase 1 PREFLIGHT before any build task is executed. This is not optional. Phase 4 HANDOVER must be completed before declaring work done. No exceptions.**

---

## LL-002 — Workspace Initialization Required on First Session (2026-02-25)

**Session**: session-001-20260225  
**Severity**: MEDIUM — operational gap  
**Status**: LOCKED-IN LEARNING

### What Happened
The `.agent-workspace/qa-builder/` directory did not exist at the start of session-001. This means Phase 2 INDUCTION's memory load step had nothing to load, and Phase 4's memory write had no target.

### Rule
On first session, qa-builder MUST create the full workspace directory structure before attempting any induction or handover step:
```
.agent-workspace/qa-builder/
├── memory/
├── personal/
├── evidence/prehandover/
└── escalation-inbox/
```

---
