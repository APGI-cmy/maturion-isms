# FAILURE PROMOTION RULE

## Status
Canonical Governance Rule  
Version: v1  
Authority: Governance  
Applies To: All Builds, All Failure Records

---

## 1. Purpose

This rule ensures that failures that expose governance gaps are formally promoted
into governance change management rather than remaining local knowledge.

Failure recording without governance promotion is forbidden when governance impact exists.

---

## 2. Core Rule

If a failure record declares:

- `GOVERNANCE_UPDATE_REQUIRED: YES`

Then the failure is not considered governance-resolved until:

1. A governance PR or issue exists, AND
2. The governance PR/issue is referenced in the failure record.

---

## 3. Required Evidence

When `GOVERNANCE_UPDATE_REQUIRED: YES`, the failure record MUST include:

- A link to a governance PR or issue in `EVIDENCE_LINKS`
- The target governance file(s) in `ROLLDOWN_TARGETS` and/or a path list in the narrative

Accepted evidence patterns:
- `https://github.com/<org>/<repo>/pull/<id>`
- `https://github.com/<org>/<repo>/issues/<id>`

---

## 4. Resolution Semantics

A failure record may only be marked:

- `FAILURE_STATUS: RESOLVED`

If one of the following is true:

- The governance update has been merged, OR
- The governance update has been formally accepted and scheduled under change management,
  and the scheduling reference is included in `EVIDENCE_LINKS`.

Silent deferral is forbidden.

---

## 5. Enforcement

CI MUST block:
- Agent conclusion
- Build-to-Green completion
- Merge approval gates (where applicable)

If:
- `GOVERNANCE_UPDATE_REQUIRED: YES`, AND
- No governance PR/issue reference is present in `EVIDENCE_LINKS`.

---

## 6. Precedence

This rule has canonical precedence over local repository rules and agent contracts.

---

End of FAILURE PROMOTION RULE
