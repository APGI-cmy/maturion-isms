# Session Memory Template — governance-liaison-isms

**Agent**: governance-liaison-isms  
**Contract Version**: 3.2.0  
**Template Version**: 1.0.0  
**Last Updated**: 2026-02-25  
**Authority**: CS2 (Johan Ras)

---

## Session Memory Template

Copy this template when creating `.agent-workspace/governance-liaison-isms/memory/session-NNN-YYYYMMDD.md`.

```markdown
# Session NNN - YYYYMMDD (LIVING_AGENT_SYSTEM v6.2.0)

## Agent
- Type: governance-liaison-isms
- Class: liaison
- Session ID: session-NNN-YYYYMMDD
- Contract Version: 3.2.0

## Phase 1 Preflight Attestation

fail_only_once_attested: true
fail_only_once_version: [version from FAIL-ONLY-ONCE.md]
unresolved_breaches: [list, or 'none']

## Task
[What was I asked to do?]

## What I Did

### Files Modified
- governance/canon/FILE1.md (SHA256: abc123...)
- .agent-admin/governance/sync_state.json (SHA256: def456...)

### Actions Taken
- [action 1]
- [action 2]

### Decisions Made
- [decision 1]

## Living Agent System v6.2.0 Evidence

### Ripple Status
- Ripple received: YES/NO (dispatch-id if yes)
- Ripple processed: COMPLETE/PENDING/N/A
- Files updated: [count and list]

### Governance Alignment
- Drift detected: YES/NO
- Self-alignment executed: YES/NO/N/A
- Alignment gate: PASSED/FAILED/N/A

## Required Fields (must all be populated — none may be blank or 'N/A')

- prior_sessions_reviewed: [list session IDs reviewed in Phase 1 Step 1.4]
- unresolved_items_from_prior_sessions: [list, or 'none']
- roles_invoked: [list all roles or agents invoked this session]
- governance_artifacts_aligned: [list files aligned, or 'none']
- escalations_triggered: [list by HALT/ESC id, or 'none']
- iaa_invocation_result: [ASSURANCE-TOKEN / REJECTION-PACKAGE / NOT_REQUIRED / PENDING]

## Outcome
✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED

## Lessons

### What Worked Well
- [observation]

### What Future Sessions Should Know
- [learning]

## Suggestions for Improvement (MANDATORY — this field may NEVER be blank)

[At least one concrete improvement suggestion. If no degradation observed:
"No degradation observed. Continuous improvement note: [specific, actionable observation]."]
```

---

## Escalation Template

Copy this template when creating `.agent-workspace/governance-liaison-isms/escalation-inbox/blocker-YYYYMMDD.md`.

```markdown
# Escalation: [Title]

## Type
BLOCKER | GOVERNANCE_GAP | AUTHORITY_BOUNDARY

## Description
[What requires CS2 attention]

## Context
- Session: session-NNN-YYYYMMDD
- Task: [original task]
- Blocked at: [specific step]

## Recommendation
[Proposed solution or next steps]

## Evidence
- Related files: [file paths]
- Canonical references: [governance docs]
- Error logs: [if applicable]

---
Created: Session NNN | Date: YYYY-MM-DD
Authority: CS2
```

---

*Authority: CS2 (Johan Ras) | LIVING_AGENT_SYSTEM.md v6.2.0*  
*Created: 2026-02-25 | Status: ACTIVE*
