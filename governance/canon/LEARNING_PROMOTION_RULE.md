# LEARNING PROMOTION RULE

## Status
Canonical Governance Rule  
Version: v1  
Authority: Governance  
Applies To: All Agents, All Builds

---

## 1. Purpose

This rule governs how learnings that indicate systemic gaps
are promoted into governance, architecture law, and agent behavior.

Learning without promotion is explicitly forbidden when governance impact exists.

---

## 2. Core Rule

If a learning artifact declares:

- `GOVERNANCE_UPDATE_REQUIRED: YES`

Then the learning is **not considered resolved** until:

1. A governance update has been proposed, AND
2. The proposal is explicitly referenced in the learning artifact.

Agents may not conclude while this condition is unmet.

---

## 3. Required Evidence

When `GOVERNANCE_UPDATE_REQUIRED: YES`, the learning artifact MUST include:

- A link to a governance PR, issue, or change request
- The link MUST be included in `EVIDENCE_LINKS`
- The target governance file(s) MUST be listed in:
  - `GOVERNANCE_TARGET_PATHS`

---

## 4. Resolution Semantics

A learning artifact may only declare:

LEARNING_STATUS: RESOLVED

yaml
Copy code

If one of the following is true:

- Governance update has been merged, OR
- Governance update has been formally accepted and scheduled
  under governance change management procedures

Silent deferral is forbidden.

---

## 5. Enforcement

CI MUST block:
- Agent conclusion
- Build-to-Green
- Merge

If:
- `GOVERNANCE_UPDATE_REQUIRED: YES`, AND
- No governance reference is present in evidence

This rule supersedes local agent or repository rules.

---

## 6. Precedence

This rule has canonical precedence over:
- Agent contracts
- FM execution contracts
- Local CI configurations

---

End of Learning Promotion Rule
