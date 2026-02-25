# api-builder — Lessons Learned (Cumulative)

Agent: api-builder  
Class: builder  
Version: 6.2.0  
Last Updated: 2026-02-25

---

## 🔒 LOCKED ENTRY — LL-001 — Contract Phase Execution (PERMANENT)

**Date Recorded**: 2026-02-25  
**Session**: session-wave5-20260225 (re-delegation corrective session)  
**Severity**: CONSTITUTIONAL VIOLATION  
**Status**: LOCKED — cannot be removed or overwritten  

### What Happened

During the initial Wave 5 delegation, api-builder executed its Phase 3 build task (implementing `OpenAIAdapter.ts` EMBEDDINGS capability and `MemoryLifecycle.ts` RAG step 4) **without**:

- Reading `.github/agents/api-builder.md` first (required by Phase 1 PREFLIGHT)
- Executing Phase 1 — PREFLIGHT (identity declaration, CANON_INVENTORY verification)
- Executing Phase 2 — INDUCTION (session memory load, personal learnings load, environment health check)
- Executing Phase 4 — HANDOVER (evidence artifacts, session memory, parking station, IAA invocation)

**Prohibition violated**: `No skipping wake-up or session closure protocols`  
(From `.github/agents/api-builder.md` YAML prohibitions section)

### Root Cause

The delegation prompt focused on the implementation task itself and did not explicitly invoke the four-phase contract. The agent proceeded directly to Phase 3 BUILD without executing the mandatory surrounding phases.

### Why This Is a Constitutional Issue

Phase 1 (PREFLIGHT) and Phase 2 (INDUCTION) are B_H priority — Constitutional mandates that NEVER may be deferred. Phase 4 (HANDOVER) is B_H — evidence artifacts are mandatory, not optional. Skipping any of these phases means:
- No CANON_INVENTORY verification (degraded mode could have been missed)
- No prior session memory loaded (patterns and learnings not applied)
- No evidence artifacts created (handover unverifiable)
- No IAA invocation attempted (double-QA bypassed)
- No session memory written (institutional memory gap)

### Corrective Action

On re-delegation (2026-02-25), the full four-phase contract was executed:
- Phase 1 PREFLIGHT: agent file read, identity declared, CANON_INVENTORY verified (PASS: 182 canons, 0 bad hashes)
- Phase 2 INDUCTION: prior sessions loaded (5 found), personal learnings reviewed
- Phase 4 HANDOVER: all evidence artifacts created, session memory written, parking station updated, IAA flagged PENDING

### What Future Sessions MUST Know

1. **ALWAYS read `.github/agents/api-builder.md` as the MANDATORY FIRST ACTION** — before any task execution, before any file inspection, before any build
2. **ALWAYS execute Phase 1 → Phase 2 → [Phase 3] → Phase 4 in order** — no phase may be skipped regardless of how the delegation is framed
3. **If a delegation prompt skips directly to a task** — STOP, execute Phase 1 and Phase 2 first, then proceed to the task
4. **Phase 4 HANDOVER is not optional** — even if the Foreman says "just implement X", the builder must close the session with full evidence artifacts
5. **The four-phase contract is the contract** — implementing code without executing the surrounding phases is a governance violation, not a minor procedural gap

### Governance Alignment

- Authority: BUILD_PHILOSOPHY.md (supreme building authority)  
- Policy: `No skipping wake-up or session closure protocols` (YAML prohibitions)  
- BL Compliance: BL-024 (Constitutional Sandbox — constitutional phases are Tier-1 IMMUTABLE)  

**🔒 THIS ENTRY IS PERMANENTLY LOCKED. IT MAY NOT BE REMOVED, MODIFIED, OR OVERWRITTEN BY ANY BUILDER SESSION.**

---

## LL-002 — Evidence Directory Creation (2026-02-25)

**Session**: session-wave5-20260225  
**Category**: Operational Pattern  

When writing Phase 4 evidence artifacts, always check whether `.agent-workspace/api-builder/personal/`, `.agent-workspace/api-builder/evidence/prehandover/`, and `.agent-workspace/api-builder/escalation-inbox/` directories exist before attempting to create files. These directories are NOT auto-created and must be explicitly `mkdir -p`'d on first use.

---
