# Session Memory Template — execution-ceremony-admin-agent

> **Usage**: Copy to `.agent-workspace/execution-ceremony-admin/memory/session-NNN-YYYYMMDD.md`. Fill every section. This is an append-only artifact — do not edit after commitment. Rotate: keep last 5 session memories.

---

# Session Memory — execution-ceremony-admin-agent session-NNN

**Date**: YYYY-MM-DD  
**Agent**: execution-ceremony-admin-agent  
**Session**: session-NNN  
**Foreman Session**: session-NNN  
**Wave / Job**: [wave identifier]  
**Issue**: #[issue number]  
**PR**: #[PR number or "not yet created"]  
**Branch**: [branch name]

---

## Session Objective

[One paragraph describing what ECAP was appointed to do in this session]

---

## Work Completed

| Step | Action | Result |
|------|--------|--------|
| 1 | [Description of step] | COMPLETE / BLOCKED |
| 2 | [Description of step] | COMPLETE / BLOCKED |
| 3 | Final-state normalization | COMPLETE |
| 4 | Cross-artifact reconciliation | COMPLETE |
| 5 | Bundle handback to Foreman | COMPLETE |

---

## Artifacts Committed

| Artifact Class | Path | Committed |
|---------------|------|-----------|
| PREHANDOVER proof | `.agent-admin/prehandover/proof-<PR#>.md` | YES |
| ECAP reconciliation summary | `.agent-admin/prehandover/ecap-reconciliation-<PR#>.md` | YES |
| Session memory (this file) | `.agent-workspace/execution-ceremony-admin/memory/session-NNN-YYYYMMDD.md` | YES |
| Gate results | `.agent-admin/gates/gate-results-<TIMESTAMP>.json` | YES |

---

## IAA Assurance

| Field | Value |
|-------|-------|
| IAA invoked by Foreman | YES / NO / PENDING |
| IAA result | ASSURANCE-TOKEN / REJECTION-PACKAGE / PENDING |
| Token file path | `.agent-admin/assurance/iaa-token-session-NNN-waveY-YYYYMMDD.md` |
| Token session reference | IAA-YYYYMMDD-NNN |
| Re-invocation round | 0 (first invocation) |

---

## Ceremony Compliance

| Check | Status |
|-------|--------|
| §4.3e Admin Ceremony Compliance Gate | PASS |
| Artifact completeness (Section 1 checklist) | COMPLETE |
| Commit-state truth verified | CONFIRMED |
| Cross-artifact reconciliation | COMPLETE |
| Final-state normalization | COMPLETE |
| Ripple/registry obligations | COMPLETED / DEFERRED / N/A |

---

## Exceptions Declared

[NONE — or list each exception with reason and disposition]

---

## Learnings / Notes for Next Session

[Actionable lessons from this session — specific, not general]

---

## Environment State at Handback

| Field | Value |
|-------|-------|
| Working tree state | CLEAN (per git status) |
| Branch HEAD SHA | [first 12 chars of HEAD SHA] |
| All changes committed | YES |
| Scope declaration current | YES |

---

*Template Version: 1.0.0 | Authority: ECAP-001 v1.1.0 | Effective: 2026-04-17*
