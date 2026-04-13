# Session Memory Template — governance-liaison-isms

**Agent**: governance-liaison-isms  
**Contract Version**: 3.3.0  
**Template Version**: 1.2.0  
**Last Updated**: 2026-04-10  
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
- Contract Version: 3.3.0

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

## Parking Station (MANDATORY — append per suggestion to agent-specific file)

**Target file**: `.agent-workspace/governance-liaison-isms/parking-station/suggestions-log.md`
**DO NOT** write to the retired global `.agent-workspace/parking-station/suggestions-log.md`.

Format (one line per suggestion):
~~~
| YYYY-MM-DD | governance-liaison-isms | session-NNN | [ALIGNMENT/SESSION-END] | <one-sentence summary> | <session-memory-filename> |
~~~

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

---

## SCOPE_DECLARATION Ceremony

> **A-029 MANDATORY**: Before writing any content to `SCOPE_DECLARATION.md`, execute:
>
> ```
> cat /dev/null > SCOPE_DECLARATION.md
> ```
>
> This clears stale content from prior sessions. Stale `SCOPE_DECLARATION.md` content has caused
> IAA rejections. Failure to clear first is a protocol violation (INC-SCOPE-STALE-001).

After clearing, declare ALL files changed in this wave using the required hyphen-separator format:

```
- `path/to/file.md` - brief description
```

Verify the format parses correctly before committing:
```
grep -E -c '^[[:space:]]*-[[:space:]]+`[^`]*`[[:space:]]+-[[:space:]]+' SCOPE_DECLARATION.md
```
Count must be > 0.

---

## Pre-IAA Commit Gate

**MANDATORY (per AGENT_HANDOVER_AUTOMATION.md §4.3c)**: Before invoking IAA, ALL artifacts MUST
be committed to the branch — not just staged, not just created on disk:

- PREHANDOVER proof (`.agent-workspace/governance-liaison-isms/memory/PREHANDOVER-*.md`)
- Session memory (`.agent-workspace/governance-liaison-isms/memory/session-NNN-YYYYMMDD.md`)
- SCOPE_DECLARATION.md (root of repository)
- All wave deliverables (every file declared in SCOPE_DECLARATION.md)

Run before invoking IAA:
```
git status
git diff --name-only HEAD
```

Verify `git status` shows no untracked or uncommitted files.
IAA will issue REJECTION-PACKAGE if any required artifact is untracked at invocation time (CORE-018).

---

## Version History

| Version | Date | Author | Change Description |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-02-25 | governance-liaison-isms | Initial template — session memory and escalation templates |
| 1.1.0 | 2026-03-03 | governance-liaison-isms (session-039) | Added Parking Station section with per-agent path instruction; updated Last Updated date |
| 1.2.0 | 2026-04-10 | CodexAdvisor-agent (session-056) | PS-I: Removed `iaa_invocation_result:` field (PS-I-01); added SCOPE_DECLARATION Ceremony section (PS-I-04); added Pre-IAA Commit Gate section (PS-I-03) |
