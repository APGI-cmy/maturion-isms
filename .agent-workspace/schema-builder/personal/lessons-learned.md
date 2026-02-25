# Schema Builder — Lessons Learned (Cumulative)

**Agent**: schema-builder  
**Class**: builder  
**Version**: 6.2.0  
**Last Updated**: 2026-02-25

---

## LL-001 — Contract Execution Is Non-Negotiable (LOCKED)

**Date**: 2026-02-25  
**Session**: session-001-20260225 (Wave 5 re-delegation)  
**Severity**: CONSTITUTIONAL VIOLATION — locked learning  
**Lock Status**: 🔒 LOCKED — cannot be removed or softened without CS2 authority

### What Happened

In the initial Wave 5 delegation, schema-builder received a task (implement pgvector migration `003_ai_knowledge.sql`) and executed the implementation work **without**:

1. Reading the agent file (`.github/agents/schema-builder.md`)  
2. Executing **Phase 1 PREFLIGHT** (identity declaration, CANON_INVENTORY verification, sandbox constraint acknowledgment)  
3. Executing **Phase 2 INDUCTION** (session wake-up, memory load, environment health check)  
4. Executing **Phase 4 HANDOVER** (PREHANDOVER proof, session memory, parking station append, IAA invocation)

This directly violated the explicit contract prohibition:  
> **"No skipping wake-up or session closure protocols"**

And violated the Phase 4 constitutional requirement:  
> **"PREHANDOVER Proof Checklist: Read agent file before starting — [REQUIRED]"**

### Root Cause

The agent treated the task as a standalone coding task rather than as a governed builder operating under the four-phase canonical contract. The task description emphasised the technical deliverable without a strong enough signal that the agent file must be read first.

### Impact

- No PREHANDOVER proof was produced after Wave 5 implementation
- No session memory was recorded
- CANON_INVENTORY was not verified
- IAA invocation was not performed
- The skip was not detected until re-delegation by Foreman

### What Was Correct

- The migration SQL itself (`003_ai_knowledge.sql`) was correctly implemented: idempotent `IF NOT EXISTS` guards, RLS policy present and enforcing org isolation, ivfflat cosine index, correct column types
- No application code was modified
- No governance files were modified

### Learning / Prevention

**RULE**: The agent file MUST be read as the absolute first action of every session. No implementation work may commence until Phase 1 PREFLIGHT and Phase 2 INDUCTION are complete.

**ENFORCEMENT SIGNAL**: If the delegating prompt does not mention "read your agent file first," the agent MUST still do so — the contract is self-enforcing, not prompt-enforcing.

**DETECTION PATTERN**: Any session that produces implementation output without a corresponding session memory file is a contract violation. Future sessions should check for this as part of Phase 2 INDUCTION ("are there any sessions without corresponding memory files?").

**FUTURE ACTION**: If a future delegation arrives without explicit contract execution instructions, begin by stating "I am reading my agent file first per Phase 1 PREFLIGHT requirement" and execute all four phases regardless of prompt structure.

---

## LL-002 — IAA Invocation Must Always Be Attempted (LOCKED)

**Date**: 2026-02-25  
**Session**: session-001-20260225 (Wave 5 re-delegation)  
**Severity**: CONSTITUTIONAL — Phase 4.6 mandate  
**Lock Status**: 🔒 LOCKED

### Learning

IAA invocation is mandatory for every session. There are no class exemptions. If IAA is not yet deployed (Phase A), the invocation attempt MUST still be made and logged as `PHASE_A_ADVISORY`. Skipping the attempt entirely (not even logging it) is a contract violation identical to skipping the PREHANDOVER proof.

The ambiguity rule applies: **Any ambiguity about whether IAA is required resolves to: IAA IS required.**

---
